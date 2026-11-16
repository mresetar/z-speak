/* ZSpeak TN3270 simulator: the pretend z/OS host and the 3270 terminal model.
 *
 * No DOM in this file; ui.js draws the screen and feeds keys in. Node can
 * load it for tests:  const { Terminal, Host } = require('./host.js')
 *
 *   Terminal   24x80 screen buffer, fields, cursor, keyboard lock, AID keys
 *   Host       session state (catalog, jobs, syslog) + the current "view"
 *   views      one object per screen: VTAM logon, TSO logon, READY, ISPF ...
 *
 * Messages are modelled on real z/OS ones but simplified; this is a feel-it
 * trainer, not an emulator of z/OS.
 */
(function (root) {
  'use strict';

  const ROWS = 24, COLS = 80, SIZE = ROWS * COLS;
  const SYSID = 'ZSPK', NODE = 'ZSPEAK', CATALOG_NAME = 'CATALOG.ZSPK.USERCAT';

  // ---------- small helpers ----------------------------------------------
  const two = n => String(n).padStart(2, '0');
  const pad = (s, n) => String(s).padEnd(n).slice(0, n);
  const lpad = (s, n, c = ' ') => String(s).padStart(n, c);
  const MONTHS = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY',
    'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const hms = (d = new Date()) => two(d.getHours()) + ':' + two(d.getMinutes()) + ':' + two(d.getSeconds());
  const hmsDot = (d = new Date()) => hms(d).replace(/:/g, '.');
  const hm = (d = new Date()) => two(d.getHours()) + ':' + two(d.getMinutes());
  const longDate = (d = new Date()) => MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  const isoDate = (d = new Date()) => d.getFullYear() + '/' + two(d.getMonth() + 1) + '/' + two(d.getDate());
  const mmddyy = (d = new Date()) => two(d.getMonth() + 1) + '/' + two(d.getDate()) + '/' + String(d.getFullYear()).slice(2);
  const julian = (d = new Date()) => {
    const start = new Date(d.getFullYear(), 0, 0);
    return d.getFullYear() + lpad(Math.floor((d - start) / 864e5), 3, '0');
  };
  const center = (s, n, fill = ' ') => {
    const l = Math.max(0, Math.floor((n - s.length) / 2));
    return (fill.repeat(l) + s).padEnd(n, fill);
  };
  const DSN_RE = /^[A-Z#$@][A-Z0-9#$@-]{0,7}(\.[A-Z#$@][A-Z0-9#$@-]{0,7})*$/;
  const MEM_RE = /^[A-Z#$@][A-Z0-9#$@]{0,7}$/;
  const USERID_RE = /^[A-Z#$@][A-Z0-9#$@]{0,6}$/;

  /** 'Z85188.JCL(HELLO)' -> { ds: 'Z85188.JCL', mem: 'HELLO' } or null */
  function splitDsn(s) {
    const m = String(s).toUpperCase().match(/^([^()]+?)(?:\(([^()]*)\))?$/);
    if (!m || !DSN_RE.test(m[1]) || m[1].length > 44) return null;
    if (m[2] !== undefined && !MEM_RE.test(m[2])) return null;
    return { ds: m[1], mem: m[2] || null };
  }

  const blksize = d => d.blksize || (d.recfm[0] === 'F' ? Math.max(d.lrecl, Math.floor(27920 / d.lrecl) * d.lrecl) : d.recfm[0] === 'V' ? 27998 : 32760);
  const fullName = p => p.ds + (p.mem ? '(' + p.mem + ')' : '');

  /** EBCDIC collating order: blank < specials < lower case < upper case < digits */
  const ebc = ch => {
    const c = ch.charCodeAt(0);
    if (ch === ' ') return 0x40;
    if (c >= 97 && c <= 122) return 0x81 + (c - 97);
    if (c >= 65 && c <= 90) return 0xC1 + (c - 65);
    if (c >= 48 && c <= 57) return 0xF0 + (c - 48);
    return 0x41 + (c % 0x3f);
  };
  function ebcCmp(a, b) {
    const n = Math.max(a.length, b.length);
    for (let i = 0; i < n; i++) {
      const d = ebc(a[i] || ' ') - ebc(b[i] || ' ');
      if (d) return d;
    }
    return 0;
  }

  // ---------- syntax colouring for the editor (HILITE) --------------------
  // each returns one colour letter (or '') per character of the line
  const RULER = Array.from({ length: 72 }, (_, i) => (i + 1) % 10 === 0 ? String((i + 1) / 10 % 10) : (i + 1) % 5 === 0 ? '+' : '-').join('');
  const JCL_OPS = ['JOB', 'EXEC', 'DD', 'PROC', 'PEND', 'SET', 'IF', 'ELSE', 'ENDIF', 'INCLUDE', 'JCLLIB', 'OUTPUT'];
  const paint = (out, a, b, c) => { for (let i = Math.max(0, a); i < b && i < out.length; i++) out[i] = c; };
  function hiStrings(t, out) {
    let q = null, start = 0;
    for (let i = 0; i < t.length; i++) {
      if (out[i]) continue;
      if (!q && (t[i] === "'" || t[i] === '"')) { q = t[i]; start = i; }
      else if (q && t[i] === q) { paint(out, start, i + 1, 'w'); q = null; }
    }
  }
  function hiWords(t, out, words) {
    const re = /[A-Za-z][A-Za-z0-9-]*/g; let m;
    while ((m = re.exec(t))) if (!out[m.index] && words.has(m[0].toUpperCase())) paint(out, m.index, m.index + m[0].length, 'r');
  }
  const REXX_KW = new Set('SAY PULL PARSE ARG UPPER VAR VALUE WITH IF THEN ELSE DO END TO BY WHILE UNTIL FOREVER SELECT WHEN OTHERWISE EXIT RETURN LEAVE ITERATE NOP ADDRESS CALL'.split(' '));
  const COBOL_KW = new Set(('IDENTIFICATION ENVIRONMENT DATA PROCEDURE DIVISION SECTION WORKING-STORAGE PROGRAM-ID PIC PICTURE VALUE DISPLAY MOVE TO ADD ' +
    'SUBTRACT FROM PERFORM TIMES END-PERFORM STOP RUN GOBACK').split(' '));
  const HILITE = {
    JCL(t) {
      const out = new Array(t.length).fill('');
      if (t.startsWith('//*')) { paint(out, 0, t.length, 't'); return out; }
      if (t.startsWith('/*')) { paint(out, 0, t.length, 'b'); return out; }
      if (!t.startsWith('//')) { paint(out, 0, t.length, 'w'); return out; }   // in-stream data
      const m = t.match(/^\/\/(\S*)(\s+)(\S*)/);
      if (!m) return out;
      paint(out, 2, 2 + m[1].length, 'y');
      let i = 2 + m[1].length + m[2].length;
      if (JCL_OPS.includes(m[3])) { paint(out, i, i + m[3].length, 'r'); i += m[3].length; while (t[i] === ' ') i++; }
      else if (m[1]) return out;
      // operand field ends at the first blank outside quotes; the rest is comment
      let q = false, d = 0, j = i;
      for (; j < t.length; j++) {
        if (t[j] === "'") q = !q;
        else if (!q && t[j] === '(') d++;
        else if (!q && t[j] === ')') d--;
        else if (!q && d <= 0 && t[j] === ' ') break;
      }
      paint(out, j, t.length, 't');
      hiStrings(t.slice(0, j), out);
      return out;
    },
    REXX(t) {
      const out = new Array(t.length).fill('');
      const re = /\/\*.*?(\*\/|$)/g; let m;
      while ((m = re.exec(t))) paint(out, m.index, m.index + m[0].length, 't');
      hiStrings(t, out);
      hiWords(t, out, REXX_KW);
      return out;
    },
    COBOL(t) {
      const out = new Array(t.length).fill('');
      if (t[6] === '*' || t[6] === '/') { paint(out, 0, t.length, 't'); return out; }
      paint(out, 0, 6, 'b');
      hiStrings(t, out);
      hiWords(t, out, COBOL_KW);
      return out;
    },
  };
  function guessLanguage(lines) {
    const first = lines.find(l => l.trim()) || '';
    if (first.startsWith('//')) return 'JCL';
    if (/^\s*\/\*.*REXX/i.test(first)) return 'REXX';
    if (lines.slice(0, 12).some(l => /\b(DIVISION|PROGRAM-ID)\b/.test(l))) return 'COBOL';
    return null;
  }

  // ---------- the screen -------------------------------------------------
  class Screen {
    constructor() { this.reset(); }
    reset() {
      this.ch = new Array(SIZE).fill(' ');
      this.cl = new Array(SIZE).fill('');
      this.fields = [];
      this.cursor = -1;
    }
    /** write protected text at row/col with a colour class (b g t w y r p) */
    put(r, c, text, cls = 'g') {
      text = String(text);
      for (let i = 0; i < text.length; i++) {
        const p = r * COLS + c + i;
        if (p >= SIZE) break;
        this.ch[p] = text[i];
        this.cl[p] = cls;
      }
      return this;
    }
    /** an unprotected (input) field */
    field(r, c, len, o = {}) {
      const pos = r * COLS + c;
      len = Math.min(len, SIZE - pos);
      const f = {
        pos, len, name: o.name || 'f' + this.fields.length,
        buf: pad(o.value || '', len).split(''),
        hidden: !!o.hidden, cls: o.cls || 'in', mdt: false, hl: o.hl || null,
      };
      this.fields.push(f);
      this.fields.sort((a, b) => a.pos - b.pos);
      if (o.cursor) this.cursor = pos + (o.cursorOffset || 0);
      return f;
    }
    fieldAt(p) { return this.fields.find(f => p >= f.pos && p < f.pos + f.len); }
    values() {
      const v = {};
      for (const f of this.fields) v[f.name] = f.buf.join('').replace(/\s+$/, '');
      return v;
    }
    text() { // plain text of what a user would see (for tests / screen reader)
      const ch = this.ch.slice();
      for (const f of this.fields) for (let i = 0; i < f.len; i++) ch[f.pos + i] = f.hidden ? ' ' : f.buf[i];
      const rows = [];
      for (let r = 0; r < ROWS; r++) rows.push(ch.slice(r * COLS, r * COLS + COLS).join('').replace(/\s+$/, ''));
      return rows.join('\n');
    }
  }

  // ---------- the terminal (what a 3270 does locally) ---------------------
  class Terminal {
    constructor(o = {}) {
      this.scr = new Screen();
      this.host = null;
      this.connected = false;
      this.locked = false;   // "X SYSTEM": host owns the keyboard
      this.err = '';         // operator error, e.g. "X -f" typing on protected
      this.insert = false;
      this.delay = o.delay ?? 220;
      this.listeners = [];
    }
    on(fn) { this.listeners.push(fn); }
    changed() { for (const fn of this.listeners) fn(this); }

    connect(host) {
      this.host = host;
      this.connected = true;
      this.err = '';
      this.locked = false;
      host.attach(this);
    }
    disconnect() {
      this.connected = false;
      this.host = null;
      this.locked = false;
      this.scr.reset();
      this.changed();
    }
    /** the host writes a new screen */
    paint(draw) {
      this.scr.reset();
      draw(this.scr);
      if (this.scr.cursor < 0) this.scr.cursor = this.scr.fields.length ? this.scr.fields[0].pos : 0;
      this.changed();
    }
    get cursor() { return this.scr.cursor; }
    set cursor(p) { this.scr.cursor = ((p % SIZE) + SIZE) % SIZE; }

    nextField(p) {
      const fs = this.scr.fields;
      if (!fs.length) return p;
      const f = fs.find(f => f.pos > p);
      return (f || fs[0]).pos;
    }
    prevField(p) {
      const fs = this.scr.fields;
      if (!fs.length) return p;
      const cur = this.scr.fieldAt(p);
      if (cur && p > cur.pos) return cur.pos;
      const before = fs.filter(f => f.pos < p);
      return (before.length ? before[before.length - 1] : fs[fs.length - 1]).pos;
    }

    /** a data key (printable character) */
    input(ch) {
      if (!this.connected || this.locked) return;
      this.err = '';
      const s = this.scr, f = s.fieldAt(s.cursor);
      if (!f) { this.err = 'X -f'; this.changed(); return; }
      const off = s.cursor - f.pos;
      if (this.insert) {
        if (f.buf[f.len - 1] !== ' ') { this.err = 'X >'; this.changed(); return; }
        f.buf.splice(off, 0, ch);
        f.buf.length = f.len;
      } else {
        f.buf[off] = ch;
      }
      f.mdt = true;
      this.cursor = off + 1 >= f.len ? this.nextField(s.cursor) : s.cursor + 1;
      this.changed();
    }

    /** local editing / movement keys */
    key(name) {
      if (!this.connected) return;
      if (name === 'Reset') { this.err = ''; this.insert = false; this.changed(); return; }
      if (this.locked) return;
      this.err = '';
      const s = this.scr, f = s.fieldAt(s.cursor), off = f ? s.cursor - f.pos : 0;
      switch (name) {
        case 'Tab': this.cursor = this.nextField(s.cursor); break;
        case 'BackTab': this.cursor = this.prevField(s.cursor); break;
        case 'Home': this.cursor = s.fields.length ? s.fields[0].pos : 0; break;
        case 'Left': this.cursor = s.cursor - 1; break;
        case 'Right': this.cursor = s.cursor + 1; break;
        case 'Up': this.cursor = s.cursor - COLS; break;
        case 'Down': this.cursor = s.cursor + COLS; break;
        case 'NewLine': {
          const row = Math.floor(s.cursor / COLS);
          const nf = s.fields.find(f => Math.floor(f.pos / COLS) > row);
          this.cursor = nf ? nf.pos : (s.fields[0] ? s.fields[0].pos : 0);
          break;
        }
        case 'Insert': this.insert = !this.insert; break;
        case 'Backspace':
          if (f && off > 0) { f.buf.splice(off - 1, 1); f.buf.push(' '); f.mdt = true; this.cursor = s.cursor - 1; }
          else if (!f) this.cursor = s.cursor - 1;
          break;
        case 'Delete':
          if (f) { f.buf.splice(off, 1); f.buf.push(' '); f.mdt = true; } else this.err = 'X -f';
          break;
        case 'EraseEOF':
          if (f) { for (let i = off; i < f.len; i++) f.buf[i] = ' '; f.mdt = true; } else this.err = 'X -f';
          break;
        case 'EraseInput':
          for (const g of s.fields) { g.buf.fill(' '); g.mdt = true; }
          this.cursor = s.fields.length ? s.fields[0].pos : 0;
          break;
      }
      this.changed();
    }

    /** an attention (AID) key: ENTER, CLEAR, PA1-PA2, PF1-PF24 */
    aid(name) {
      if (!this.connected || this.locked) return;
      this.locked = true;
      this.err = '';
      this.insert = false;
      this.changed();
      const values = this.scr.values(), cur = this.scr.cursor;
      if (name === 'CLEAR') this.scr.reset();
      const run = () => {
        if (!this.connected) return;
        this.locked = false;
        this.host.aid(name, values, cur);
        this.changed();
      };
      if (this.delay < 0) run(); else setTimeout(run, this.delay + Math.random() * this.delay);
    }
  }

  // ---------- a small REXX ------------------------------------------------
  // Enough of the language to run teaching execs: SAY, PULL, PARSE, ARG,
  // assignment, IF/THEN/ELSE, DO loops, SELECT, expressions, a few built-in
  // functions, and host (TSO) commands. It is a generator, so PULL can wait
  // for the terminal:  yields { say } | { pull } | { cmd }.
  class RexxError extends Error {
    constructor(msg, line) { super(msg); this.line = line; }
  }

  function rexxTokens(text, line) {
    const T = []; let i = 0;
    while (i < text.length) {
      const ch = text[i], sp = i > 0 && /\s/.test(text[i - 1]);
      if (/\s/.test(ch)) { i++; continue; }
      if (ch === "'" || ch === '"') {
        let j = i + 1, v = '';
        for (;;) {
          if (j >= text.length) throw new RexxError('Unmatched quote', line);
          if (text[j] === ch) { if (text[j + 1] === ch) { v += ch; j += 2; continue; } break; }
          v += text[j++];
        }
        T.push({ t: 'str', v, sp }); i = j + 1; continue;
      }
      const rest = text.slice(i);
      let m = rest.match(/^\d+(\.\d+)?/);
      if (m) { T.push({ t: 'num', v: m[0], sp }); i += m[0].length; continue; }
      m = rest.match(/^[A-Za-z_!?@#$.][A-Za-z0-9_!?@#$.]*/);
      if (m) { T.push({ t: 'sym', v: m[0].toUpperCase(), sp }); i += m[0].length; continue; }
      m = rest.match(/^(\|\||\*\*|\/\/|\\==|\\=|<>|><|<=|>=|==|&&|[-+*/%=<>&|\\(),])/);
      if (!m) throw new RexxError('Invalid character "' + ch + '"', line);
      T.push({ t: 'op', v: m[0], sp }); i += m[0].length;
    }
    return T;
  }

  /** source lines -> clauses [{ k: keyword, toks, line }] with IF/THEN/ELSE split apart */
  function rexxClauses(src) {
    const lines = []; let inC = false;
    for (const raw of src) {   // strip /* comments */, which may span lines
      let out = '', q = null;
      for (let i = 0; i < raw.length; i++) {
        if (inC) { if (raw[i] === '*' && raw[i + 1] === '/') { inC = false; i++; } continue; }
        if (q) { out += raw[i]; if (raw[i] === q) q = null; continue; }
        if (raw[i] === '/' && raw[i + 1] === '*') { inC = true; i++; out += ' '; continue; }
        if (raw[i] === "'" || raw[i] === '"') q = raw[i];
        out += raw[i].replace('¬', '\\');
      }
      lines.push(out);
    }
    const C = [];
    const push = (toks, line) => {
      if (!toks.length) return;
      const assign = toks[1] && toks[1].t === 'op' && toks[1].v === '=';
      const k = toks[0].t === 'sym' && !assign ? toks[0].v : '';
      if (k === 'IF' || k === 'WHEN') {
        const i = toks.findIndex(t => t.t === 'sym' && t.v === 'THEN');
        C.push({ k, toks: toks.slice(1, i < 0 ? toks.length : i), line });
        if (i >= 0) { C.push({ k: 'THEN', line }); push(toks.slice(i + 1), line); }
      } else if (k === 'THEN' || k === 'ELSE' || k === 'OTHERWISE') {
        C.push({ k, line });
        push(toks.slice(1), line);
      } else C.push({ k, toks, line });
    };
    let carry = '', carryLine = 0;
    lines.forEach((l, n) => {
      const text = carry + l, line = carry ? carryLine : n + 1;
      carry = '';
      if (/,\s*$/.test(text)) { carry = text.replace(/,\s*$/, ' '); carryLine = line; return; }
      let part = '', q = null;
      for (const ch of text + ';') {
        if (q) { part += ch; if (ch === q) q = null; continue; }
        if (ch === "'" || ch === '"') q = ch;
        if (ch === ';') { if (part.trim()) push(rexxTokens(part, line), line); part = ''; continue; }
        part += ch;
      }
    });
    return C;
  }

  function rexxParse(C) {
    let i = 0;
    const err = (m, c) => { throw new RexxError(m, (c || C[C.length - 1] || {}).line || 1); };
    const needThen = c => { if (!C[i] || C[i].k !== 'THEN') err('THEN expected', c); i++; };
    function stmt() {
      const c = C[i++];
      if (!c) err('Incomplete DO, SELECT or IF');
      if (c.k === 'IF') {
        needThen(c);
        const node = { type: 'if', cond: c.toks, then: stmt(), else: null, line: c.line };
        if (C[i] && C[i].k === 'ELSE') { i++; node.else = stmt(); }
        return node;
      }
      if (c.k === 'DO') return { type: 'do', head: c.toks.slice(1), line: c.line, body: block(c) };
      if (c.k === 'SELECT') {
        const node = { type: 'select', whens: [], other: null, line: c.line };
        for (;;) {
          const w = C[i];
          if (!w) err('Incomplete DO, SELECT or IF', c);
          if (w.k === 'WHEN') { i++; needThen(w); node.whens.push({ cond: w.toks, then: stmt(), line: w.line }); }
          else if (w.k === 'OTHERWISE') { i++; node.other = block(c); return node; }
          else if (w.k === 'END') { i++; return node; }
          else err('WHEN or OTHERWISE expected', w);
        }
      }
      if (['END', 'THEN', 'ELSE', 'WHEN', 'OTHERWISE'].includes(c.k)) err('Unexpected ' + c.k, c);
      return { type: 'cl', k: c.k, toks: c.toks, line: c.line };
    }
    function block(open) {   // statements up to the matching END
      const out = [];
      for (;;) {
        if (!C[i]) err('Incomplete DO, SELECT or IF', open);
        if (C[i].k === 'END') { i++; return out; }
        out.push(stmt());
      }
    }
    const prog = [];
    while (i < C.length) prog.push(stmt());
    return prog;
  }

  function* rexxRun(src, env) {
    const prog = rexxParse(rexxClauses(src));
    const V = new Map(); let steps = 0, cur = null;
    const fail = m => { throw new RexxError(m, cur ? cur.line : 1); };
    const isNum = v => String(v).trim() !== '' && !isNaN(Number(String(v).trim()));
    const num = v => { if (!isNum(v)) fail('Bad arithmetic conversion'); return Number(String(v).trim()); };
    const fmt = n => { if (!isFinite(n)) fail('Arithmetic overflow/underflow'); return String(Number(n.toPrecision(9))); };
    const bool = v => { if (v === '1') return true; if (v === '0') return false; return fail('Logical value not 0 or 1'); };
    const tick = () => { if (++steps > 20000) fail('ZSIM: stopped after 20000 clauses - endless loop?'); };
    const name = sym => {   // compound symbols: A.I -> A.<value of I>
      const p = sym.split('.');
      if (p.length === 1 || sym === '.') return sym;
      return p[0] + '.' + p.slice(1).map(t => (V.has(t) ? V.get(t) : t)).join('.');
    };
    const get = sym => {
      const n = name(sym);
      if (V.has(n)) return V.get(n);
      const dot = n.indexOf('.');
      if (dot > 0 && V.has(n.slice(0, dot + 1))) return V.get(n.slice(0, dot + 1));
      return n;   // an unset variable is its own name, in upper case
    };
    const set = (sym, v) => V.set(name(sym), String(v));

    function call(f, a) {
      const s = i => a[i] === undefined ? '' : String(a[i]);
      const n = (i, d) => a[i] === undefined || a[i] === '' ? d : num(a[i]);
      const words = t => t.trim().split(/\s+/).filter(Boolean);
      const d = new Date();
      switch (f) {
        case 'LENGTH': return String(s(0).length);
        case 'SUBSTR': { const st = n(1, 1) - 1, len = n(2); return len === undefined ? s(0).slice(st) : s(0).slice(st, st + len).padEnd(len); }
        case 'LEFT': return s(0).slice(0, n(1, 0)).padEnd(n(1, 0));
        case 'RIGHT': { const len = n(1, 0); return s(0).slice(Math.max(0, s(0).length - len)).padStart(len); }
        case 'UPPER': case 'TRANSLATE': return s(0).toUpperCase();
        case 'LOWER': return s(0).toLowerCase();
        case 'STRIP': { const o = s(1).toUpperCase()[0]; return o === 'L' ? s(0).trimStart() : o === 'T' ? s(0).trimEnd() : s(0).trim(); }
        case 'SPACE': return words(s(0)).join(' '.repeat(n(1, 1)));
        case 'WORD': return words(s(0))[n(1, 1) - 1] || '';
        case 'WORDS': return String(words(s(0)).length);
        case 'POS': return String(s(1).indexOf(s(0)) + 1);
        case 'REVERSE': return s(0).split('').reverse().join('');
        case 'COPIES': return s(0).repeat(Math.max(0, Math.min(n(1, 0), 1000)));
        case 'ABS': return fmt(Math.abs(num(s(0))));
        case 'MAX': return fmt(Math.max(...a.map(num)));
        case 'MIN': return fmt(Math.min(...a.map(num)));
        case 'TRUNC': return fmt(Math.trunc(num(s(0))));
        case 'RANDOM': {
          const lo = a.length > 1 ? n(0, 0) : 0, hi = a.length > 1 ? n(1, 999) : n(0, 999);
          return String(lo + Math.floor(Math.random() * (hi - lo + 1)));
        }
        case 'DATATYPE': return isNum(s(0)) ? 'NUM' : 'CHAR';
        case 'DATE': {
          const o = s(0).toUpperCase()[0];
          if (o === 'S') return d.getFullYear() + two(d.getMonth() + 1) + two(d.getDate());
          if (o === 'J') return julian(d).slice(2);
          if (o === 'W') return DAYS[d.getDay()][0] + DAYS[d.getDay()].slice(1).toLowerCase();
          const mon = MONTHS[d.getMonth()];
          return d.getDate() + ' ' + mon[0] + mon.slice(1, 3).toLowerCase() + ' ' + d.getFullYear();
        }
        case 'TIME': return hms(d);
        case 'USERID': return env.user;
        case 'SYSVAR': return { SYSUID: env.user, SYSPREF: env.prefix || '', SYSNODE: NODE, SYSENV: 'FORE' }[s(0).toUpperCase()] || '';
        case 'MVSVAR': return { SYSNAME: SYSID, SYSOPSYS: 'z/OS 03.01.00' }[s(0).toUpperCase()] || '';
      }
      return fail('Routine not found: ' + f);
    }

    function evaluate(toks) {
      let p = 0;
      const isOp = (...v) => toks[p] && toks[p].t === 'op' && v.includes(toks[p].v);
      const startsTerm = t => t && (t.t !== 'op' || t.v === '(' || t.v === '\\');
      let or;
      function primary() {
        const t = toks[p++];
        if (!t) fail('Invalid expression');
        if (t.t === 'str' || t.t === 'num') return t.v;
        if (t.t === 'sym') {
          const nx = toks[p];
          if (!(nx && nx.t === 'op' && nx.v === '(' && !nx.sp)) return get(t.v);
          p++;
          const args = [];
          if (isOp(')')) { p++; return call(t.v, args); }
          for (;;) {
            args.push(isOp(',') || isOp(')') ? '' : or());
            if (isOp(',')) { p++; continue; }
            if (isOp(')')) { p++; break; }
            fail('Unmatched "(" in expression');
          }
          return call(t.v, args);
        }
        if (t.v === '(') { const v = or(); if (!isOp(')')) fail('Unmatched "(" in expression'); p++; return v; }
        return fail('Invalid expression');
      }
      function prefix() {
        if (isOp('-')) { p++; return fmt(-num(prefix())); }
        if (isOp('+')) { p++; return fmt(num(prefix())); }
        if (isOp('\\')) { p++; return bool(prefix()) ? '0' : '1'; }
        return primary();
      }
      function power() { let v = prefix(); while (isOp('**')) { p++; v = fmt(Math.pow(num(v), num(prefix()))); } return v; }
      function mul() {
        let v = power();
        while (isOp('*', '/', '%', '//')) {
          const o = toks[p++].v, b = num(power()), a = num(v);
          if (o !== '*' && b === 0) fail('Arithmetic overflow/underflow');   // divide by zero
          v = fmt(o === '*' ? a * b : o === '/' ? a / b : o === '%' ? Math.trunc(a / b) : a % b);
        }
        return v;
      }
      function add() {
        let v = mul();
        while (isOp('+', '-')) { const o = toks[p++].v, b = num(mul()); v = fmt(o === '+' ? num(v) + b : num(v) - b); }
        return v;
      }
      function cat() {   // "||", a blank (one space), or abuttal (nothing)
        let v = add();
        for (;;) {
          if (isOp('||')) { p++; v += add(); }
          else if (startsTerm(toks[p])) { const sp = toks[p].sp; v += (sp ? ' ' : '') + add(); }
          else return v;
        }
      }
      function cmp() {
        let v = cat();
        while (isOp('=', '\\=', '<>', '><', '<', '>', '<=', '>=', '==', '\\==')) {
          const o = toks[p++].v, b = cat(); let c;
          if (o === '==' || o === '\\==') c = v === b ? 0 : 1;
          else if (isNum(v) && isNum(b)) c = Number(v) - Number(b);
          else { const x = v.trim(), y = b.trim(); c = x < y ? -1 : x > y ? 1 : 0; }
          v = {
            '=': c === 0, '==': c === 0, '\\=': c !== 0, '\\==': c !== 0, '<>': c !== 0, '><': c !== 0,
            '<': c < 0, '>': c > 0, '<=': c <= 0, '>=': c >= 0,
          }[o] ? '1' : '0';
        }
        return v;
      }
      function and() { let v = cmp(); while (isOp('&')) { p++; const b = cmp(); v = bool(v) && bool(b) ? '1' : '0'; } return v; }
      or = function () {
        let v = and();
        while (isOp('|', '&&')) { const o = toks[p++].v, b = and(); v = (o === '|' ? bool(v) || bool(b) : bool(v) !== bool(b)) ? '1' : '0'; }
        return v;
      };
      const v = or();
      if (p < toks.length) fail('Invalid expression');
      return v;
    }

    const template = toks => toks.map(t => (t.t === 'sym' ? t.v : fail('Invalid template')));
    const assign = (names, text) => {   // word parsing; the last variable takes what is left
      let rest = String(text);
      names.forEach((nm, i) => {
        let v;
        if (i === names.length - 1) v = rest.trim();
        else { const m = rest.match(/^\s*(\S*)([^]*)$/); v = m[1]; rest = m[2]; }
        if (nm !== '.') set(nm, v);
      });
    };

    function* clause(c) {
      const t = c.toks, rest = t.slice(1);
      if (!c.k && t[0].t === 'sym') { set(t[0].v, t.length > 2 ? evaluate(t.slice(2)) : ''); return undefined; }
      switch (c.k) {
        case 'SAY': yield { say: rest.length ? evaluate(rest) : '' }; return undefined;
        case 'PULL': assign(template(rest), String(yield { pull: true }).toUpperCase()); return undefined;
        case 'ARG': assign(template(rest), env.arg.toUpperCase()); return undefined;
        case 'PARSE': {
          let r = rest, up = false, text;
          if (r[0] && r[0].v === 'UPPER') { up = true; r = r.slice(1); }
          const what = r[0] && r[0].t === 'sym' ? r[0].v : '';
          r = r.slice(1);
          if (what === 'PULL') text = String(yield { pull: true });
          else if (what === 'ARG') text = env.arg;
          else if (what === 'VAR') { if (!r[0]) fail('Invalid template'); text = get(r[0].v); r = r.slice(1); }
          else if (what === 'VALUE') {
            const w = r.findIndex(x => x.t === 'sym' && x.v === 'WITH');
            if (w < 0) fail('WITH expected');
            text = w ? evaluate(r.slice(0, w)) : '';
            r = r.slice(w + 1);
          } else fail('Invalid sub-keyword found');
          assign(template(r), up ? text.toUpperCase() : text);
          return undefined;
        }
        case 'NOP': return undefined;
        case 'EXIT': case 'RETURN': return 'EXIT';
        case 'LEAVE': return 'LEAVE';
        case 'ITERATE': return 'ITERATE';
        case 'ADDRESS': {   // ADDRESS TSO "command"
          const cmd = rest.slice(rest[0] && rest[0].t === 'sym' ? 1 : 0);
          if (cmd.length) set('RC', yield { cmd: evaluate(cmd) });
          return undefined;
        }
        case 'CALL': case 'SIGNAL': case 'PROCEDURE': case 'INTERPRET': case 'TRACE': case 'NUMERIC': case 'DROP': case 'PUSH': case 'QUEUE':
          return fail(c.k + ' is not part of this small REXX');
      }
      set('RC', yield { cmd: evaluate(t) });   // anything else is a host (TSO) command
      return undefined;
    }

    function* run(nodes) {
      for (const nd of nodes) { const r = yield* one(nd); if (r) return r; }
      return undefined;
    }
    function* one(nd) {
      cur = nd;
      tick();
      if (nd.type === 'cl') return yield* clause(nd);
      if (nd.type === 'if') {
        if (bool(evaluate(nd.cond))) return yield* one(nd.then);
        return nd.else ? yield* one(nd.else) : undefined;
      }
      if (nd.type === 'select') {
        for (const w of nd.whens) { cur = w; if (bool(evaluate(w.cond))) return yield* one(w.then); }
        cur = nd;
        if (!nd.other) fail('SELECT: no WHEN matched and there is no OTHERWISE');
        return yield* run(nd.other);
      }
      // DO
      const h = nd.head, at = w => h.findIndex(x => x.t === 'sym' && x.v === w);
      let hd = h, whileT = null, untilT = null;
      if (at('WHILE') >= 0) { whileT = h.slice(at('WHILE') + 1); hd = h.slice(0, at('WHILE')); }
      else if (at('UNTIL') >= 0) { untilT = h.slice(at('UNTIL') + 1); hd = h.slice(0, at('UNTIL')); }
      let count = Infinity, ctl = null, to = Infinity, by = 1;
      if (!hd.length) { if (!whileT && !untilT) return yield* run(nd.body); }   // a plain DO ... END group
      else if (hd[0].t === 'sym' && hd[0].v === 'FOREVER') { /* until LEAVE */ }
      else if (hd[0].t === 'sym' && hd[1] && hd[1].t === 'op' && hd[1].v === '=') {
        ctl = hd[0].v;
        const ti = hd.findIndex(x => x.t === 'sym' && x.v === 'TO'), bi = hd.findIndex(x => x.t === 'sym' && x.v === 'BY');
        const seg = start => { const e = [ti, bi].filter(x => x > start).sort((a, b) => a - b)[0]; return hd.slice(start + 1, e === undefined ? hd.length : e); };
        set(ctl, fmt(num(evaluate(seg(1)))));
        if (ti >= 0) to = num(evaluate(seg(ti)));
        if (bi >= 0) by = num(evaluate(seg(bi)));
      } else count = num(evaluate(hd));
      for (let n = 0; n < count; n++) {
        cur = nd;
        tick();
        if (ctl !== null && (by >= 0 ? num(get(ctl)) > to : num(get(ctl)) < to)) break;
        if (whileT && !bool(evaluate(whileT))) break;
        const r = yield* run(nd.body);
        if (r === 'EXIT') return r;
        if (r === 'LEAVE') break;
        cur = nd;
        if (untilT && bool(evaluate(untilT))) break;
        if (ctl !== null) set(ctl, fmt(num(get(ctl)) + by));
      }
      return undefined;
    }
    yield* run(prog);
  }

  const isRexx = lines => /^\s*\/\*.*REXX/i.test(lines[0] || '');
  const rexxErrorLines = (e, x) => {
    const l = e.line || 1;
    return [lpad(l, 6) + ' +++ ' + (x.src[l - 1] || '').trim(), 'IRX0040I Error running ' + x.name + ', line ' + l + ': ' + e.message];
  };
  /** the return code REXX sees after a TSO command */
  const tsoRc = t => /^IKJ56500I/.test(t.lines[0] || '') ? -3 : t.lines.some(l => / NOT /.test(l)) ? 8 : 0;
  /** run an exec to the end without a terminal (batch): PULL reads from pull() */
  function rexxSync(host, x, pull, out) {
    const gen = rexxRun(x.src, { arg: x.arg, user: host.user, prefix: host.prefix });
    try {
      let r = gen.next();
      while (!r.done) {
        const y = r.value;
        if (y.say !== undefined) { out([y.say]); r = gen.next(); }
        else if (y.cmd !== undefined) { const t = host.tso(y.cmd, 'rexx'); out(t.lines); r = gen.next(tsoRc(t)); }
        else r = gen.next(pull());
      }
      return 0;
    } catch (e) {
      if (!(e instanceof RexxError)) throw e;
      out(rexxErrorLines(e, x));
      return 12;
    }
  }

  // ---------- a very small COBOL "compiler" -------------------------------
  // DISPLAY, MOVE, ADD, SUBTRACT, PERFORM n TIMES, STOP RUN/GOBACK and simple
  // WORKING-STORAGE items. Enough to compile, link and run a first program.
  const COBOL_VERBS = ['DISPLAY', 'MOVE', 'ADD', 'SUBTRACT', 'PERFORM', 'END-PERFORM', 'STOP', 'GOBACK', 'EXIT', 'CONTINUE', 'ACCEPT',
    'COMPUTE', 'IF', 'ELSE', 'END-IF', 'CALL', 'OPEN', 'CLOSE', 'READ', 'WRITE', 'EVALUATE', 'INITIALIZE', 'MULTIPLY', 'DIVIDE', 'GO'];
  function cobolCompile(src) {
    const errs = [], prog = { id: null, vars: {}, code: [] }, T = [];
    src.forEach((raw, n) => {
      const l = raw.slice(0, 72);
      if (l[6] === '*' || l[6] === '/') return;
      const re = /'((?:[^']|'')*)'|"((?:[^"]|"")*)"|([A-Za-z0-9][A-Za-z0-9-]*(?:\.[0-9]+)?)|(\.)|(\S)/g; let m;
      while ((m = re.exec(l.slice(7)))) {
        if (m[1] !== undefined || m[2] !== undefined) T.push({ s: m[1] !== undefined ? m[1] : m[2], line: n + 1 });
        else if (m[3]) T.push({ w: m[3].toUpperCase(), line: n + 1 });
        else if (m[4]) T.push({ dot: true, line: n + 1 });
        else T.push({ w: m[5], line: n + 1 });
      }
    });
    const E = (line, code, text) => errs.push({ line, code, text });
    const skipped = '  Skipped to the next verb, period or procedure-name definition.';
    let i = 0, div = '', hasProc = false;
    const isW = (k, w) => !!T[k] && T[k].w === w;
    const operand = () => {   // a literal or a data-name at T[i]
      const t = T[i];
      if (!t || t.dot) return null;
      if (t.s !== undefined) { i++; return { lit: t.s }; }
      if (/^-?\d+(\.\d+)?$/.test(t.w)) { i++; return { lit: t.w }; }
      if (/^SPACES?$/.test(t.w)) { i++; return { lit: ' ' }; }
      if (/^ZERO(S|ES)?$/.test(t.w)) { i++; return { lit: '0' }; }
      if (COBOL_VERBS.includes(t.w) || !/^[A-Z0-9]/.test(t.w) || ['TO', 'FROM', 'TIMES', 'UPON'].includes(t.w)) return null;
      i++;
      if (!(t.w in prog.vars)) { E(t.line, 'IGYPS2121-S', '"' + t.w + '" was not defined as a data-name.  The statement was discarded.'); return { lit: '' }; }
      return { v: t.w };
    };
    function statements(until) {
      const code = [];
      while (i < T.length) {
        const t = T[i];
        if (t.dot) { i++; continue; }
        if (until && t.w === until) { i++; return code; }
        if (t.w && isW(i + 1, 'DIVISION')) break;
        i++;
        const bad = why => E(t.line, 'IGYPS2072-S', '"' + (t.w || t.s) + '" was invalid.' + (why || skipped));
        switch (t.w) {
          case 'DISPLAY': {
            const ops = []; let o;
            while ((o = operand())) ops.push(o);
            if (isW(i, 'UPON')) i += 2;
            code.push({ op: 'display', ops });
            break;
          }
          case 'MOVE': {
            const from = operand();
            if (!from || !isW(i, 'TO')) { bad(); break; }
            i++;
            const to = []; let o;
            while ((o = operand())) if (o.v) to.push(o.v);
            code.push({ op: 'move', from, to });
            break;
          }
          case 'ADD': case 'SUBTRACT': {
            const a = operand();
            if (!a || !isW(i, t.w === 'ADD' ? 'TO' : 'FROM')) { bad(); break; }
            i++;
            const o = operand();
            if (o && o.v) code.push({ op: 'add', a, to: o.v, sign: t.w === 'ADD' ? 1 : -1 });
            break;
          }
          case 'PERFORM': {
            const n = operand();
            if (!n || !isW(i, 'TIMES')) { bad('  Only PERFORM n TIMES ... END-PERFORM is simulated.'); break; }
            i++;
            code.push({ op: 'loop', n, body: statements('END-PERFORM') });
            break;
          }
          case 'STOP': if (isW(i, 'RUN')) i++; code.push({ op: 'stop' }); break;
          case 'EXIT': if (isW(i, 'PROGRAM')) i++; code.push({ op: 'stop' }); break;
          case 'GOBACK': code.push({ op: 'stop' }); break;
          case 'CONTINUE': break;
          default:
            if (t.w && !COBOL_VERBS.includes(t.w) && T[i] && (T[i].dot || T[i].w === 'SECTION')) { i++; break; }   // paragraph or section name
            bad(COBOL_VERBS.includes(t.w) ? '  This simulator\'s compiler does not know that verb.' : '');
            while (i < T.length && !T[i].dot && !COBOL_VERBS.includes(T[i].w)) i++;
        }
      }
      return code;
    }
    while (i < T.length) {
      const t = T[i];
      if (t.w && isW(i + 1, 'DIVISION')) {
        div = t.w; i += 2;
        if (div === 'PROCEDURE') { hasProc = true; prog.code = statements(null); }
        continue;
      }
      if (t.w === 'PROGRAM-ID') {
        i++;
        if (T[i] && T[i].dot) i++;
        if (T[i] && T[i].w) prog.id = T[i].w.slice(0, 8);
        i++;
        continue;
      }
      if (div === 'DATA' && t.w && /^\d\d?$/.test(t.w) && T[i + 1] && T[i + 1].w) {
        const nm = T[i + 1].w; let j = i + 2, numeric = false, val = null;
        for (; j < T.length && !T[j].dot; j++) {
          if ((T[j].w === 'PIC' || T[j].w === 'PICTURE') && T[j + 1] && T[j + 1].w) numeric = /^S?9/.test(T[j + 1].w);
          if (T[j].w === 'VALUE') {
            const v = isW(j + 1, 'IS') ? T[j + 2] : T[j + 1];
            if (v) val = v.s !== undefined ? v.s : /^ZERO/.test(v.w) ? '0' : /^SPACE/.test(v.w) ? '' : v.w;
          }
        }
        prog.vars[nm] = { v: val !== null ? val : numeric ? '0' : '' };
        i = j;
        continue;
      }
      i++;
    }
    if (!prog.id) E(1, 'IGYDS1003-E', 'A "PROGRAM-ID" paragraph was not found.');
    if (!hasProc) E(src.length || 1, 'IGYPS2023-S', 'The "PROCEDURE DIVISION" header was not found.');
    const rc = errs.length ? 12 : 0;
    const listing = [
      'PP 5655-EC6 IBM Enterprise COBOL for z/OS  6.4.0' + ' '.repeat(16) + 'Date ' + mmddyy() + '   Time ' + hms() + '   Page     1',
      '  LineID  PL SL  ----+-*A-1-B--+----2----+----3----+----4----+----5----+----6----+----7-|',
      ...src.map((l, n) => '  ' + lpad(n + 1, 6, '0') + '         ' + l), '',
    ];
    if (errs.length) listing.push('LineID  Message code  Message text', ...errs.map(e => lpad(e.line, 6) + '  ' + e.code + '   ' + e.text), '');
    listing.push('Messages    Total    Informational    Warning    Error    Severe    Terminating',
      'Printed:' + lpad(errs.length, 9) + lpad(0, 17) + lpad(0, 11) + lpad(errs.filter(e => e.code.endsWith('E')).length, 9) + lpad(errs.filter(e => e.code.endsWith('S')).length, 10) + lpad(0, 15),
      '* Statistics for COBOL program ' + (prog.id || '(none)') + ':',
      '*    Source records = ' + src.length,
      '*    Procedure Division statements = ' + prog.code.length,
      'Return code ' + rc);
    return { prog, rc, listing };
  }
  /** run a "load module"; emit(line) gets each DISPLAY. Returns 'limit' if it ran away. */
  function cobolRun(prog, emit) {
    const vars = {};
    for (const k of Object.keys(prog.vars)) vars[k] = prog.vars[k].v;
    let budget = 5000;
    const val = o => (o.v ? vars[o.v] : o.lit);
    const run = code => {
      for (const c of code) {
        if (--budget < 0) return 'limit';
        if (c.op === 'display') emit(c.ops.map(val).join(''));
        else if (c.op === 'move') for (const t of c.to) vars[t] = val(c.from);
        else if (c.op === 'add') vars[c.to] = String((Number(vars[c.to]) || 0) + c.sign * (Number(val(c.a)) || 0));
        else if (c.op === 'stop') return 'stop';
        else if (c.op === 'loop') {
          for (let n = Number(val(c.n)) || 0; n > 0; n--) { const r = run(c.body); if (r) return r; }
        }
      }
      return null;
    };
    return run(prog.code) === 'limit' ? 'limit' : 0;
  }

  // ---------- canned content ---------------------------------------------
  const BANNER = [
    'ZZZZZZZ   SSSSSS  PPPPPP   EEEEEEE    AAA    KK   KK',
    '    ZZ   SS       PP   PP  EE        AA AA   KK  KK ',
    '   ZZ     SSSSS   PPPPPP   EEEEE    AA   AA  KKKKK  ',
    '  ZZ          SS  PP       EE       AAAAAAA  KK  KK ',
    'ZZZZZZZ  SSSSSS   PP       EEEEEEE  AA   AA  KK   KK',
  ];

  function seed(user) {
    const d = isoDate(), j = (lines, id = user) => ({ lines, created: '2026/09/01', changed: d + ' 09:12', id });
    const jcl = {
      HELLO: j([
        '//HELLO    JOB (FB3),\'MY FIRST JOB\',CLASS=A,MSGCLASS=X,NOTIFY=&SYSUID',
        '//*-------------------------------------------------------------------',
        '//*  COPY THE INLINE TEXT BELOW TO THE SPOOL WITH THE IEBGENER UTILITY',
        '//*  TRY: CHANGE THE TEXT, THEN TYPE  SUB  ON THE COMMAND LINE.',
        '//*-------------------------------------------------------------------',
        '//STEP1    EXEC PGM=IEBGENER',
        '//SYSPRINT DD SYSOUT=*',
        '//SYSIN    DD DUMMY',
        '//SYSUT2   DD SYSOUT=*',
        '//SYSUT1   DD *',
        'HELLO FROM ' + user + ', RUNNING AS A BATCH JOB ON Z/OS.',
        'THIS TEXT WAS INLINE DATA IN THE JCL AND IEBGENER COPIED IT.',
        '/*',
      ]),
      ALLOC: j([
        '//ALLOC    JOB (FB3),\'NEW DATA SET\',CLASS=A,MSGCLASS=X,NOTIFY=&SYSUID',
        '//*  CREATE A NEW EMPTY DATA SET. IEFBR14 DOES NOTHING AT ALL - THE',
        '//*  WORK IS DONE BY THE SYSTEM WHILE IT PROCESSES THE DD STATEMENT.',
        '//STEP1    EXEC PGM=IEFBR14',
        '//NEWDS    DD DSN=&SYSUID..MY.FIRST.DATA,DISP=(NEW,CATLG,DELETE),',
        '//            SPACE=(TRK,(1,1)),RECFM=FB,LRECL=80,UNIT=SYSDA',
      ]),
      SORTJOB: j([
        '//SORTJOB  JOB (FB3),\'SORT SALES\',CLASS=A,MSGCLASS=X,NOTIFY=&SYSUID',
        '//*  SORT THE SALES RECORDS BY AMOUNT, BIGGEST FIRST. THE KEY IS THE',
        '//*  7 BYTES FROM COLUMN 29, AS CHARACTERS (CH), DESCENDING (D).',
        '//*  TRY (1,15,CH,A) FOR THE CUSTOMER NAME, OR ADD THIS LINE:',
        '//*     INCLUDE COND=(21,2,CH,EQ,C\'11\')     ONLY NOVEMBER',
        '//STEP1    EXEC PGM=SORT',
        '//SYSOUT   DD SYSOUT=*',
        '//SORTIN   DD DSN=&SYSUID..SALES.DATA,DISP=SHR',
        '//SORTOUT  DD SYSOUT=*',
        '//SYSIN    DD *',
        '  SORT FIELDS=(29,7,CH,D)',
        '/*',
      ]),
      COBRUN: j([
        '//COBRUN   JOB (FB3),\'COMPILE LINK GO\',CLASS=A,MSGCLASS=X,NOTIFY=&SYSUID',
        '//*  THREE STEPS: COMPILE SOURCE(HELLO), LINK-EDIT THE OBJECT CODE INTO',
        '//*  A LOAD MODULE, THEN RUN IT. COND=(4,LT) MEANS: SKIP THIS STEP IF',
        '//*  4 IS LESS THAN THE RETURN CODE OF ANY EARLIER STEP.',
        '//COMPILE  EXEC PGM=IGYCRCTL',
        '//SYSPRINT DD SYSOUT=*',
        '//SYSIN    DD DSN=&SYSUID..SOURCE(HELLO),DISP=SHR',
        '//SYSLIN   DD DSN=&&OBJ,DISP=(NEW,PASS),UNIT=SYSDA,SPACE=(TRK,(1,1))',
        '//LKED     EXEC PGM=IEWL,COND=(4,LT)',
        '//SYSPRINT DD SYSOUT=*',
        '//SYSLIN   DD DSN=&&OBJ,DISP=(OLD,DELETE)',
        '//SYSLMOD  DD DSN=&SYSUID..LOAD(HELLO),DISP=SHR',
        '//GO       EXEC PGM=HELLO,COND=(4,LT)',
        '//STEPLIB  DD DSN=&SYSUID..LOAD,DISP=SHR',
        '//SYSOUT   DD SYSOUT=*',
      ]),
      AMS: j([
        '//AMS      JOB (FB3),\'IDCAMS\',CLASS=A,MSGCLASS=X,NOTIFY=&SYSUID',
        '//*  IDCAMS (ACCESS METHOD SERVICES) WORKS ON THE CATALOG AND ON DATA',
        '//*  SETS. A HYPHEN AT THE END OF A LINE CONTINUES THE COMMAND.',
        '//*  ALSO TRY:  REPRO INDATASET(...) OUTDATASET(...)   AND   DELETE ...',
        '//STEP1    EXEC PGM=IDCAMS',
        '//SYSPRINT DD SYSOUT=*',
        '//SYSIN    DD *',
        '  LISTCAT LEVEL(' + user + ')',
        '  PRINT INDATASET(' + user + '.SALES.DATA) -',
        '        CHARACTER COUNT(3)',
        '/*',
      ]),
      BACKUP: j([
        '//BACKUP   JOB (FB3),\'COPY A PDS\',CLASS=A,MSGCLASS=X,NOTIFY=&SYSUID',
        '//*  IEBCOPY COPIES MEMBERS BETWEEN PARTITIONED DATA SETS. THIS JOB',
        '//*  MAKES A NEW PDS AND COPIES ALL OF YOUR JCL INTO IT. RUN IT TWICE',
        '//*  AND SEE WHAT THE SYSTEM SAYS ABOUT THE DUPLICATE NAME.',
        '//STEP1    EXEC PGM=IEBCOPY',
        '//SYSPRINT DD SYSOUT=*',
        '//SYSUT1   DD DSN=&SYSUID..JCL,DISP=SHR',
        '//SYSUT2   DD DSN=&SYSUID..JCL.BACKUP,DISP=(NEW,CATLG,DELETE),',
        '//            SPACE=(TRK,(5,1,10)),RECFM=FB,LRECL=80,UNIT=SYSDA',
        '//SYSIN    DD DUMMY',
      ]),
      TSOBATCH: j([
        '//TSOBATCH JOB (FB3),\'TSO IN BATCH\',CLASS=A,MSGCLASS=X,NOTIFY=&SYSUID',
        '//*  TSO WITHOUT A TERMINAL: IKJEFT01 READS COMMANDS FROM SYSTSIN AND',
        '//*  WRITES WHAT YOU WOULD SEE AT READY TO SYSTSPRT. WHEN THE REXX EXEC',
        '//*  DOES A PULL, IT GETS THE NEXT SYSTSIN LINE.',
        '//STEP1    EXEC PGM=IKJEFT01',
        '//SYSTSPRT DD SYSOUT=*',
        '//SYSTSIN  DD *',
        '  LISTDS JCL MEMBERS',
        '  EXEC SOURCE(GREET)',
        '  BATCH JOB',
        '/*',
      ]),
      BADPGM: j([
        '//BADPGM   JOB (FB3),\'ABEND DEMO\',CLASS=A,MSGCLASS=X,NOTIFY=&SYSUID',
        '//*  THIS JOB ASKS FOR A PROGRAM THAT DOES NOT EXIST -> ABEND S806.',
        '//*  LOOK AT JESYSMSG IN SDSF TO SEE HOW THE SYSTEM REPORTS IT.',
        '//STEP1    EXEC PGM=HELOWRLD',
        '//SYSOUT   DD SYSOUT=*',
        '//STEP2    EXEC PGM=IEFBR14',
      ]),
      BADJCL: j([
        '//BADJCL   JOB (FB3),\'JCL ERROR DEMO\',CLASS=A,MSGCLASS=X',
        '//*  READS A DATA SET THAT DOES NOT EXIST -> JCL ERROR, NOTHING RUNS.',
        '//STEP1    EXEC PGM=IEBGENER',
        '//SYSPRINT DD SYSOUT=*',
        '//SYSIN    DD DUMMY',
        '//SYSUT1   DD DSN=&SYSUID..NO.SUCH.DATA,DISP=SHR',
        '//SYSUT2   DD SYSOUT=*',
      ]),
    };
    return {
      [user + '.JCL']: { dsorg: 'PO', recfm: 'FB', lrecl: 80, vol: 'ZSPK01', members: jcl },
      [user + '.SOURCE']: {
        dsorg: 'PO', recfm: 'FB', lrecl: 80, vol: 'ZSPK01', members: {
          HELLO: j([
            '       IDENTIFICATION DIVISION.',
            '       PROGRAM-ID. HELLO.',
            '      * A COBOL PROGRAM. JCL(COBRUN) COMPILES IT (IGYCRCTL), LINKS IT',
            '      * (IEWL) INTO LOAD(HELLO) AND RUNS IT. CHANGE THE TEXT, RERUN.',
            '       DATA DIVISION.',
            '       WORKING-STORAGE SECTION.',
            '       01  WS-COUNT          PIC 9(2) VALUE 0.',
            '       PROCEDURE DIVISION.',
            '           DISPLAY \'HELLO, WORLD\'.',
            '           PERFORM 3 TIMES',
            '               ADD 1 TO WS-COUNT',
            '               DISPLAY \'COBOL COUNTS: \' WS-COUNT',
            '           END-PERFORM.',
            '           GOBACK.',
          ]),
          GREET: j([
            '/* REXX - THE SCRIPTING LANGUAGE OF TSO */',
            'SAY \'WHAT IS YOUR NAME?\'',
            'PULL NAME',
            'SAY \'HELLO\' NAME',
          ]),
          COUNT: j([
            '/* REXX - A LOOP, AND A TSO COMMAND RUN FROM INSIDE AN EXEC */',
            '/* TRY:  EXEC SOURCE(COUNT) \'5\'                            */',
            'ARG N',
            'IF DATATYPE(N) \\= \'NUM\' THEN N = 3',
            'DO I = 1 TO N',
            '  SAY \'LINE\' I \'OF\' N',
            'END',
            '"LISTDS JCL"',
            'SAY \'LISTDS ENDED WITH RETURN CODE\' RC',
          ]),
        },
      },
      [user + '.DATA']: {
        dsorg: 'PS', recfm: 'FB', lrecl: 80, vol: 'ZSPK02', lines: [
          'THIS IS A SEQUENTIAL DATA SET: ONE "FILE" OF FIXED-LENGTH 80-BYTE RECORDS.',
          'IT HAS NO MEMBERS. COMPARE WITH ' + user + '.JCL, WHICH IS PARTITIONED (A PDS).',
          'ACME CORP      2026-11-01   1250.00',
          'GLOBEX INC     2026-11-02    730.50',
          'INITECH        2026-11-03   9100.00',
        ],
      },
      [user + '.SALES.DATA']: {
        dsorg: 'PS', recfm: 'FB', lrecl: 80, vol: 'ZSPK01',
        lines: [['GLOBEX INC', '2026-11-02', '730.50'], ['ACME CORP', '2026-11-01', '1250.00'], ['INITECH', '2026-11-03', '9100.00'],
          ['UMBRELLA LTD', '2026-10-28', '88.10'], ['ACME CORP', '2026-10-15', '415.75'], ['SOYLENT CO', '2026-11-05', '3020.00']]
          .map(x => pad(x[0], 15) + x[1] + '   ' + lpad(x[2], 7)),
      },
      [user + '.LOAD']: { dsorg: 'PO', recfm: 'U', lrecl: 0, blksize: 32760, vol: 'ZSPK02', dsntype: 'PDS', members: {} },
      [user + '.ISPF.ISPPROF']: {
        dsorg: 'PO', recfm: 'FB', lrecl: 80, vol: 'ZSPK02', members: {
          ISRPROF: j(['(ISPF KEEPS YOUR SETTINGS AND PANEL HISTORY HERE)']),
        },
      },
      'ZXP.PUBLIC.JCL': {
        dsorg: 'PO', recfm: 'FB', lrecl: 80, vol: 'ZSPK03', members: {
          README: j([
            'SHARED DATA SET OWNED BY SOMEONE ELSE. YOU CAN READ IT, BUT RACF',
            'WILL STOP YOU FROM CHANGING OR DELETING IT. TRY "D" IN DSLIST.',
          ], 'ZXPADM'),
        },
      },
    };
  }

  // ---------- the host ---------------------------------------------------
  class Host {
    constructor(o = {}) {
      this.jobDelay = o.jobDelay ?? 1500;   // how long a job "runs" (ms)
      this.listeners = [];
      this.events = new Set();
      this.term = null;
      this.reset();
    }
    reset() {
      this.user = null;
      this.prefix = null;
      this.catalog = this.catalog || null;
      this.jobs = this.jobs || [];
      this.jobSeq = this.jobSeq || 1200 + Math.floor(Math.random() * 700);
      this.syslog = this.syslog || [];
      this.view = null;
      this.stack = [];
      this.ready = null;
      this.cmdHistory = [];
      this.lastLevel = null;
      this.logonAt = null;
    }
    on(fn) { this.listeners.push(fn); }
    emit(ev, data) {
      this.events.add(ev);
      for (const fn of this.listeners) fn(ev, data, this);
    }
    log(msg) { this.syslog.push(hmsDot() + ' ' + msg); }

    attach(term) {
      this.term = term;
      this.reset();
      this.log('IST663I ZSPK0042 LU SESSION STARTED VIA TN3270 SERVER');
      this.emit('connect');
      this.go(new VtamView(this));
    }
    go(view) {
      this.view = view;
      this.redraw();
      this.emit('view', view.name);
    }
    redraw() { if (this.term) this.term.paint(s => this.view.draw(s)); }

    aid(aid, v, cur) {
      const view = this.view;
      if (view.ispf) this.ispfAid(view, aid, v, cur);
      else view.aid(aid, v, cur);
      // job-end notifications break into ISPF like on a real system
      if (this.view && this.view.ispf) {
        const n = this.takeNotices();
        if (n.length) { const back = this.view; this.go(new Pager(this, n, () => this.go(back))); }
      }
    }

    // ---- session ----
    logon(user, proc) {
      this.user = user;
      this.prefix = user;
      this.proc = proc || 'IZUFPROC';
      if (!this.catalog || this.catalogUser !== user) { this.catalog = seed(user); this.catalogUser = user; }
      this.logonAt = new Date();
      this.log('$HASP373 ' + pad(user, 8) + ' STARTED');
      this.log('IEF125I ' + user + ' - LOGGED ON - TIME=' + hmsDot());
      this.ready = new ReadyView(this);
      this.emit('ready');
    }
    logoff() {
      const msg = 'IKJ56470I ' + this.user + ' LOGGED OFF TSO AT ' + hms() + ' ON ' + longDate();
      this.log('IEF126I ' + this.user + ' - LOGGED OFF - TIME=' + hmsDot());
      this.user = null;
      this.ready = null;
      this.stack = [];
      this.emit('logoff');
      this.go(new VtamView(this, msg));
    }
    enterIspf() {
      this.stack = [];
      this.go(new MainMenu(this));
      this.emit('ispf');
    }
    exitIspf() {
      this.stack = [];
      this.ready.out(['READY']);
      this.go(this.ready);
    }

    // ---- ISPF navigation ----
    push(view) { this.stack.push(this.view); this.go(view); }
    back(msg) {
      if (!this.stack.length) { this.exitIspf(); return; }
      const v = this.stack.pop();
      if (msg) v.msg = msg;
      this.go(v);
    }
    jump(path) {
      const parts = path.split('.').filter(Boolean);
      this.stack = [];
      let v = new MainMenu(this);
      for (const p of parts) {
        const nx = v.select ? v.select(p) : null;
        if (nx === 'exit') return;
        if (!nx || typeof nx === 'string') { v.msg = nx || 'Invalid option'; break; }
        this.stack.push(v);
        v = nx;
      }
      this.go(v);
    }
    /** commands every ISPF panel understands; true if handled */
    ispfCmd(cmd, view) {
      if (cmd.startsWith('=')) {
        const p = cmd.slice(1).trim();
        if (p === 'X') { this.exitIspf(); return true; }
        this.jump(p);
        return true;
      }
      const m = cmd.match(/^TSO\s+(.+)$/);
      if (m) { this.runFromIspf(m[1], view); return true; }
      if (cmd === 'END') { this.end(view); return true; }
      if (cmd === 'RETURN') { this.jump(''); return true; }
      if (cmd === 'SPLIT' || cmd === 'SWAP') { view.msg = 'Split screen not simulated'; this.redraw(); return true; }
      if (cmd === 'SDSF' || cmd === 'SD') { this.push(new SdsfMenu(this)); return true; }
      return false;
    }
    runFromIspf(cmdline, view) {
      const r = this.tso(cmdline, 'ispf');
      if (r.action === 'ISPF') { view.msg = 'ISPF is already active'; this.redraw(); return; }
      if (r.action === 'LOGOFF') { view.msg = 'Exit ISPF first (=X)'; this.redraw(); return; }
      if (r.action === 'SDSF') { this.push(new SdsfMenu(this)); return; }
      if (r.action === 'EXEC') {   // line mode takes over the screen until the exec ends
        const rv = new ReadyView(this);
        rv.name = 'rexx';
        rv.exec(r.exec, () => this.go(view));
        this.go(rv);
        return;
      }
      if (!r.lines.length) { this.redraw(); return; }
      this.go(new Pager(this, r.lines, () => this.go(view)));
    }
    ispfAid(view, aid, v, cur) {
      view.msg = '';
      if (view.capture) view.capture(v, cur);
      const raw = (v.cmd || '').trim(), cmd = raw.toUpperCase();
      if (/^PF(3|15)$/.test(aid)) { this.end(view); return; }
      if (/^PF(12|24)$/.test(aid)) { if (view.onCancel) view.onCancel(); else this.end(view); return; }
      if (aid === 'CLEAR' || aid === 'PA1' || aid === 'PA2') { this.redraw(); return; }
      if (aid === 'PF1' || aid === 'PF13') { view.msg = 'Help: see the guide panel'; this.redraw(); return; }
      if (/^PF(2|9|14|21)$/.test(aid)) { view.msg = 'Split screen not simulated'; this.redraw(); return; }
      if (aid === 'ENTER' && cmd && this.ispfCmd(cmd, view)) return;
      view.aid(aid, v, cur, cmd, raw);
    }
    end(view) { if (view.onEnd) view.onEnd(); else this.back(); }
    /** go back to a panel further down the stack (or stay on the current one) */
    returnTo(view, msg) {
      const i = this.stack.indexOf(view);
      if (i >= 0) this.stack.length = i;
      if (msg !== undefined) view.msg = msg;
      this.go(view);
    }

    // ---- data sets ----
    resolve(arg) { // TSO naming: quoted = as is, unquoted = prefix added
      arg = String(arg).trim().toUpperCase();
      if (arg.startsWith("'")) return arg.replace(/^'|'$/g, '');
      return this.prefix ? this.prefix + '.' + arg : arg;
    }
    owns(ds) { return this.user && ds.split('.')[0] === this.user; }
    racf(ds, access) {
      return 'ICH408I USER(' + pad(this.user, 8) + ') GROUP(SYS1    ) NAME(STUDENT) ' + ds +
        ' CL(DATASET ) INSUFFICIENT ACCESS AUTHORITY - ACCESS INTENT(' + access + ')';
    }
    readDs(name) { // -> { lines } | { err }
      const p = splitDsn(name);
      if (!p) return { err: 'INVALID DATA SET NAME, ' + name };
      const d = this.catalog[p.ds];
      if (!d) return { err: 'DATA SET ' + p.ds + ' NOT IN CATALOG' };
      if (d.dsorg === 'PO') {
        if (!p.mem) return { err: 'MEMBER NAME REQUIRED FOR ' + p.ds };
        const m = d.members[p.mem];
        if (!m) return { err: 'MEMBER ' + p.mem + ' NOT FOUND IN ' + p.ds };
        return { lines: m.lines.slice() };
      }
      if (p.mem) return { err: p.ds + ' IS NOT PARTITIONED' };
      return { lines: d.lines.slice() };
    }
    writeDs(name, lines) {
      const p = splitDsn(name), d = this.catalog[p.ds];
      if (d.dsorg === 'PO') {
        const old = d.members[p.mem];
        if (old && d.dsntype !== 'LIBRARY') d.gas = (d.gas || 0) + old.lines.length;   // a PDS keeps the old copy as dead space
        d.members[p.mem] = {
          lines: lines.slice(), created: old ? old.created : isoDate(),
          changed: isoDate() + ' ' + hm(), id: this.user,
        };
      } else d.lines = lines.slice();
    }
    newDs(name, o = {}) {
      this.catalog[name] = Object.assign({ recfm: 'FB', lrecl: 80, vol: 'ZSPK0' + (1 + Object.keys(this.catalog).length % 3), created: isoDate() },
        o.dsorg === 'PO' ? { dsorg: 'PO', members: {} } : { dsorg: 'PS', lines: [] }, o);
    }
    /** these return an error text for the panel, or null when it worked */
    deleteDs(name) {
      if (!this.catalog[name]) return 'Data set not cataloged';
      if (!this.owns(name)) { this.log(this.racf(name, 'ALTER')); return 'ICH408I - not authorized'; }
      delete this.catalog[name];
      this.emit('delete');
      return null;
    }
    renameDs(from, to) {
      if (!this.catalog[from]) return 'Data set not cataloged';
      if (this.catalog[to]) return 'New name already cataloged';
      if (!this.owns(from) || !this.owns(to)) { this.log(this.racf(this.owns(from) ? to : from, 'ALTER')); return 'ICH408I - not authorized'; }
      this.catalog[to] = this.catalog[from];
      delete this.catalog[from];
      this.emit('rename');
      return null;
    }
    compress(name) {
      const d = this.catalog[name];
      if (!this.owns(name)) { this.log(this.racf(name, 'UPDATE')); return 'ICH408I - not authorized'; }
      if (d.dsntype === 'LIBRARY') return 'PDSE: compress not needed';
      d.gas = 0;
      return 'Compress successful';
    }
    /** copy or move: from/to are { ds, mem }, from.mem may be '*'. -> { err } | { n, skipped } */
    copy(from, to, o = {}) {
      const S = this.catalog[from.ds], T = this.catalog[to.ds];
      if (!S) return { err: 'Data set not cataloged' };
      if (!T) return { err: 'Target not cataloged' };
      if (!this.owns(to.ds) || (o.move && !this.owns(from.ds))) {
        this.log(this.racf(this.owns(to.ds) ? from.ds : to.ds, 'UPDATE'));
        return { err: 'ICH408I - not authorized' };
      }
      const clone = m => Object.assign({}, m, { lines: m.lines.slice() });
      let n = 0, skipped = 0;
      if (S.dsorg === 'PO') {
        const all = !from.mem || from.mem === '*', names = all ? Object.keys(S.members) : [from.mem];
        if (!all && !S.members[from.mem]) return { err: 'Member ' + from.mem + ' not found' };
        if (T.dsorg !== 'PO') {
          if (names.length !== 1) return { err: 'Name one member to copy' };
          T.lines = S.members[names[0]].lines.slice(); n = 1;
          if (o.move) delete S.members[names[0]];
        } else {
          if (S === T && (all || !to.mem || to.mem === from.mem)) return { err: 'Same data set and member' };
          for (const m of names) {
            const t = (!all && to.mem) || m;
            if (T.members[t] && !o.replace) { skipped++; continue; }
            if (T.members[t] && T.dsntype !== 'LIBRARY') T.gas = (T.gas || 0) + T.members[t].lines.length;
            T.members[t] = clone(S.members[m]); n++;
            if (o.move) delete S.members[m];
          }
        }
      } else {
        if (S === T) return { err: 'Same data set' };
        if (T.dsorg === 'PO') {
          if (!to.mem) return { err: 'Target member name needed' };
          if (T.members[to.mem] && !o.replace) skipped++;
          else { this.writeDs(to.ds + '(' + to.mem + ')', S.lines); n = 1; }
        } else { T.lines = S.lines.slice(); n = 1; }
        if (o.move && n) delete this.catalog[from.ds];
      }
      if (n) this.emit(o.move ? 'move' : 'copy');
      return { n, skipped };
    }
    listLevel(level) {
      level = level.toUpperCase().replace(/^'|'$/g, '');
      let re;
      if (level.includes('*') || level.includes('%')) {
        re = new RegExp('^' + level.replace(/\./g, '\\.').replace(/\*\*/g, '\u0000').replace(/\*/g, '[^.]*')
          .replace(/%/g, '[^.]').replace(/\u0000/g, '.*') + '(\\..*)?$');
      } else re = new RegExp('^' + level.replace(/\./g, '\\.') + '(\\..*)?$');
      return Object.keys(this.catalog).filter(n => re.test(n)).sort();
    }

    // ---- TSO commands ----
    tso(line, ctx) {
      const out = [];
      const u = line.trim().toUpperCase();
      const [verb, ...restArr] = u.split(/\s+/);
      const rest = u.slice(verb.length).trim();
      const kw = k => { const m = rest.match(new RegExp('\\b(?:' + k + ')\\(([^)]*)\\)')); return m ? m[1].trim() : null; };
      const firstArg = () => rest.split(/\s+/)[0] || '';
      this.emit('tso', verb);
      switch (verb) {
        case '': return { lines: [] };
        case 'HELP': case 'H':
          return {
            lines: [
              'COMMANDS IN THIS SIMULATOR (UNQUOTED DATA SET NAMES GET YOUR PREFIX ADDED):',
              '  TIME                               TIME, CPU USED, SESSION LENGTH',
              '  PROFILE [PREFIX(X)|NOPREFIX]       SHOW OR CHANGE YOUR TSO PROFILE',
              '  LISTCAT [LEVEL(HLQ)]               LIST CATALOGED DATA SETS',
              '  LISTDS NAME [MEMBERS]              DATA SET ATTRIBUTES (AND MEMBERS)',
              '  LISTALC                            DATA SETS ALLOCATED TO YOUR SESSION',
              '  ALLOCATE DA(NAME) NEW [DIR(5)]     CREATE A DATA SET (DIR = PDS)',
              '  RENAME OLD NEW                     RENAME A DATA SET',
              '  DELETE NAME                        DELETE A DATA SET OR MEMBER',
              '  SUBMIT NAME                        RUN JCL AS A BATCH JOB, E.G. SUBMIT JCL(HELLO)',
              '  STATUS                             STATE OF YOUR BATCH JOBS',
              "  EXEC NAME ['ARGS']                 RUN A REXX EXEC, E.G. EXEC SOURCE(GREET)",
              '  CALL NAME                          RUN A LOAD MODULE, E.G. CALL LOAD(HELLO)',
              '  ISPF                               START THE ISPF MENUS',
              '  SDSF                               LOOK AT JOBS AND THEIR OUTPUT',
              '  LOGOFF                             END THE SESSION',
            ],
          };
        case 'TIME': {
          const sess = Math.floor((Date.now() - this.logonAt) / 1000);
          const d = new Date(), h12 = d.getHours() % 12 || 12;
          return {
            lines: ['IKJ56650I TIME-' + two(h12) + ':' + two(d.getMinutes()) + ':' + two(d.getSeconds()) +
              (d.getHours() < 12 ? ' AM' : ' PM') + '. CPU-00:00:00 SERVICE-' + (4000 + sess * 37) +
              ' SESSION-' + two(Math.floor(sess / 3600)) + ':' + two(Math.floor(sess / 60) % 60) + ':' + two(sess % 60) +
              ' ' + MONTHS[d.getMonth()] + ' ' + d.getDate() + ',' + d.getFullYear()],
          };
        }
        case 'PROFILE': case 'PROF': {
          if (/\bNOPREFIX\b/.test(rest)) { this.prefix = null; return { lines: [] }; }
          const p = kw('PREFIX');
          if (p) { this.prefix = p; return { lines: [] }; }
          return {
            lines: [
              'CHAR(BS) LINE(ATTN) PROMPT INTERCOM NOPAUSE MSGID MODE WTPMSG RECOVER ' +
              (this.prefix ? 'PREFIX(' + this.prefix + ')' : 'NOPREFIX'),
              'PLANGUAGE(ENU) SLANGUAGE(ENU)',
              'VARSTORAGE(LOW)',
              'DEFAULT LINE/CHARACTER DELETE CHARACTERS IN EFFECT FOR THIS TERMINAL',
            ],
          };
        }
        case 'LISTCAT': case 'LISTC': {
          const level = kw('LEVEL|LVL|L') || this.prefix || this.user;
          const names = this.listLevel(level);
          this.emit('listcat');
          if (!names.length) return { lines: ['IDC3012I ENTRY ' + level + ' NOT FOUND', 'IDC1566I ** ' + level + ' NOT LISTED'] };
          return { lines: ['IN CATALOG:' + CATALOG_NAME, ...names.map(n => ' ' + n)] };
        }
        case 'LISTDS': case 'LISTD': {
          if (!firstArg()) return { lines: ['IKJ56700A ENTER DATA SET NAME - (USE LISTDS NAME)'] };
          const name = this.resolve(firstArg()), d = this.catalog[name];
          if (!d) return { lines: [name, 'IKJ58503I DATA SET ' + name + ' NOT IN CATALOG'] };
          out.push(name, '--RECFM-LRECL-BLKSIZE-DSORG', '  ' + pad(d.recfm, 6) + pad(d.lrecl, 6) + pad(blksize(d), 8) + d.dsorg,
            '--VOLUMES--', '  ' + d.vol);
          if (/\bMEM(BERS)?\b/.test(rest) && d.dsorg === 'PO') out.push('--MEMBERS--', ...Object.keys(d.members).sort().map(m => '  ' + m));
          return { lines: out };
        }
        case 'LISTALC': case 'LISTA':
          return {
            lines: ['SYS1.HELP', 'ISP.SISPCLIB', 'ISP.SISPMENU', 'ISP.SISPPENU', 'ISP.SISPTENU', 'ISP.SISPSLIB',
              this.user + '.ISPF.ISPPROF', 'TERMFILE', 'NULLFILE'],
          };
        case 'ALLOCATE': case 'ALLOC': case 'ATTRIB': {
          const ds = kw('DATASET|DSNAME|DSN|DA');
          if (!ds) return { lines: ['IKJ56700A ENTER DATA SET NAME - (USE ALLOC DA(NAME) NEW)'] };
          const name = this.resolve(ds);
          if (!splitDsn(name)) return { lines: ['IKJ56231I DATA SET ' + name + ' NOT ALLOCATED, INVALID NAME'] };
          if (/\bNEW\b/.test(rest)) {
            if (this.catalog[name]) return { lines: ['IKJ56893I DATA SET ' + name + ' NOT ALLOCATED+', 'IGD17101I DATA SET ' + name + ' NOT DEFINED BECAUSE DUPLICATE NAME EXISTS IN CATALOG'] };
            if (!this.owns(name)) return { lines: ['IKJ56893I DATA SET ' + name + ' NOT ALLOCATED+', this.racf(name, 'ALTER')] };
            const po = kw('DIR|DIRBLKS') || kw('DSORG') === 'PO' || kw('DSNTYPE') === 'LIBRARY';
            const recfm = (kw('RECFM') || 'F,B').replace(/[, ]/g, '');
            this.newDs(name, { dsorg: po ? 'PO' : 'PS', recfm, lrecl: Number(kw('LRECL')) || 80 });
            this.emit('alloc');
            return { lines: [] }; // TSO says nothing when it works
          }
          if (!this.catalog[name]) return { lines: ['IKJ56228I DATA SET ' + name + ' NOT IN CATALOG OR CATALOG CAN NOT BE ACCESSED'] };
          return { lines: [] };
        }
        case 'DELETE': case 'DEL': {
          if (!firstArg()) return { lines: ['IKJ56700A ENTER ENTRY NAME - (USE DELETE NAME)'] };
          const p = splitDsn(this.resolve(firstArg()));
          if (!p) return { lines: ['IDC3203I ITEM ' + firstArg() + ' DOES NOT ADHERE TO RESTRICTIONS', 'IDC0014I LASTCC=12'] };
          const d = this.catalog[p.ds];
          if (!d || (p.mem && (d.dsorg !== 'PO' || !d.members[p.mem]))) {
            const n = p.ds + (p.mem ? '(' + p.mem + ')' : '');
            return { lines: ['IDC3012I ENTRY ' + n + ' NOT FOUND', 'IDC3009I ** VSAM CATALOG RETURN CODE IS 8 - REASON CODE IS IGG0CLEG-42', 'IDC0551I ** ENTRY ' + n + ' NOT DELETED', 'IDC0014I LASTCC=8'] };
          }
          if (!this.owns(p.ds)) return { lines: [this.racf(p.ds, 'ALTER'), 'IDC3018I SECURITY VERIFICATION FAILED+', 'IDC0551I ** ENTRY ' + p.ds + ' NOT DELETED', 'IDC0014I LASTCC=8'] };
          if (p.mem) { delete d.members[p.mem]; return { lines: ['IDC0549I MEMBER ' + p.mem + ' DELETED'] }; }
          delete this.catalog[p.ds];
          return { lines: ['IDC0550I ENTRY (A) ' + p.ds + ' DELETED'] };
        }
        case 'RENAME': case 'REN': {
          const [a, b] = rest.split(/\s+/);
          if (!a || !b) return { lines: ['IKJ56700A ENTER NEW NAME - (USE RENAME OLD NEW)'] };
          const from = this.resolve(a), to = this.resolve(b);
          if (!this.catalog[from]) return { lines: ['IKJ56709I DATA SET ' + from + ' NOT IN CATALOG'] };
          if (this.catalog[to]) return { lines: ['IKJ56709I DATA SET ' + to + ' ALREADY EXISTS'] };
          if (!this.owns(from) || !this.owns(to)) return { lines: [this.racf(from, 'ALTER')] };
          this.catalog[to] = this.catalog[from];
          delete this.catalog[from];
          return { lines: [] };
        }
        case 'SUBMIT': case 'SUB': {
          if (!firstArg()) return { lines: ['IKJ56700A ENTER DATA SET NAME - (USE SUBMIT JCL(HELLO))'] };
          const name = this.resolve(firstArg()), r = this.readDs(name);
          if (r.err) return { lines: ['IKJ56228I ' + r.err] };
          return { lines: [this.submit(r.lines)] };
        }
        case 'STATUS': case 'ST': {
          const mine = this.jobs.filter(j => j.owner === this.user);
          if (!mine.length) return { lines: ['IKJ56192I NO JOBS FOUND'] };
          return {
            lines: mine.map(j => Date.now() < j.endAt
              ? 'IKJ56211I JOB ' + j.name + '(' + j.id + ') EXECUTING'
              : 'IKJ56192I JOB ' + j.name + '(' + j.id + ') ON OUTPUT QUEUE'),
          };
        }
        case 'SEND': case 'SE': {
          const m = rest.match(/^'(.*)'/);
          if (!m) return { lines: ["IKJ56700A ENTER MESSAGE TEXT - (USE SEND 'HELLO' USER(*))"] };
          return { lines: [m[1] + ' ' + this.user] };
        }
        case 'ISPF': case 'ISPPDF': case 'PDF': return { lines: [], action: 'ISPF' };
        case 'SDSF': return { lines: [], action: 'SDSF' };
        case 'LOGOFF': case 'LOGON': return { lines: [], action: 'LOGOFF' };
        case 'OMVS': case 'ISH': case 'OSHELL':
          return { lines: ['ZSIM001I z/OS UNIX (' + verb + ') IS NOT PART OF THIS SIMULATOR - SEE THE USS ZXPLORE CHALLENGES.'] };
        case 'EXEC': case 'EX': {
          if (!firstArg()) return { lines: ['IKJ56700A ENTER DATA SET NAME - (USE EXEC SOURCE(GREET))'] };
          const name = this.resolve(firstArg()), r = this.readDs(name);
          if (r.err) return { lines: ['IKJ56228I ' + r.err] };
          if (!isRexx(r.lines)) return { lines: ['ZSIM002I ' + name + ' IS NOT REXX: LINE 1 MUST BE A COMMENT WITH THE WORD REXX. (CLISTS ARE NOT SIMULATED.)'] };
          const arg = (line.trim().match(/^\S+\s+\S+\s+(.*)$/) || ['', ''])[1].replace(/^'(.*)'$/, '$1');
          return { lines: [], action: 'EXEC', exec: { name: splitDsn(name).mem || name, src: r.lines, arg } };
        }
        case 'CALL': {
          if (!firstArg()) return { lines: ['IKJ56700A ENTER DATA SET NAME - (USE CALL LOAD(HELLO))'] };
          const p = splitDsn(this.resolve(firstArg())), d = p && this.catalog[p.ds];
          if (!d) return { lines: ['IKJ56228I DATA SET ' + (p ? p.ds : firstArg()) + ' NOT IN CATALOG OR CATALOG CAN NOT BE ACCESSED'] };
          const m = d.dsorg === 'PO' && p.mem && d.members[p.mem];
          if (!m) return { lines: ['IKJ56501I MEMBER ' + (p.mem || '(NONE)') + ' NOT IN DATA SET ' + p.ds] };
          if (!m.load) return { lines: ['CSV016I REQUESTED MODULE ' + p.mem + ' IS NOT EXECUTABLE - IT IS NOT A LOAD MODULE'] };
          if (cobolRun(m.load, l => out.push(l)) === 'limit') out.push('IEA995I SYMPTOM DUMP OUTPUT  SYSTEM COMPLETION CODE=322');
          return { lines: out };
        }
        default:
          return { lines: ['IKJ56500I COMMAND ' + verb + ' NOT FOUND'] };
      }
    }

    // ---- batch ----
    submit(src) {
      const job = runJob(this, src);
      this.jobs.push(job);
      this.log('$HASP100 ' + pad(job.name, 8) + ' ON INTRDR' + ' '.repeat(12) + 'FROM TSU' + this.tsuId() + ' ' + this.user);
      this.emit('submit', job);
      return 'IKJ56250I JOB ' + job.name + '(' + job.id + ') SUBMITTED';
    }
    tsuId() { return lpad(this.jobSeq - 900, 5, '0'); }
    takeNotices() {
      const out = [];
      for (const j of this.jobs) {
        if (!j.notified && Date.now() >= j.endAt && j.notify) {
          j.notified = true;
          out.push(hmsDot(new Date(j.endAt)) + ' $HASP165 ' + pad(j.name, 8) + ' ENDED AT ' + NODE + ' ' + j.summary + ' CN(INTERNAL)');
        }
      }
      return out;
    }
  }

  // ---------- JCL "execution" --------------------------------------------
  /** split by `sep` at paren depth 0, outside quotes */
  function splitTop(s, sep = ',') {
    const out = []; let depth = 0, q = false, cur = '';
    for (const ch of s) {
      if (ch === "'") q = !q;
      if (!q && ch === '(') depth++;
      if (!q && ch === ')') depth--;
      if (!q && depth === 0 && ch === sep) { out.push(cur); cur = ''; continue; }
      cur += ch;
    }
    out.push(cur);
    return out;
  }
  /** operand field ends at the first blank outside quotes/parens (rest is comment) */
  function operandField(s) {
    let depth = 0, q = false, i = 0;
    for (; i < s.length; i++) {
      const ch = s[i];
      if (ch === "'") q = !q;
      else if (!q && ch === '(') depth++;
      else if (!q && ch === ')') depth--;
      else if (!q && depth === 0 && ch === ' ') break;
    }
    return s.slice(0, i);
  }
  function parseOps(field) {
    const ops = {}; let i = 0;
    for (const part of splitTop(field)) {
      if (!part) continue;
      const eq = part.indexOf('=');
      if (eq > 0 && /^[A-Z0-9.]+$/.test(part.slice(0, eq))) ops[part.slice(0, eq)] = part.slice(eq + 1);
      else ops['_' + i++] = part;
    }
    return ops;
  }
  const unparen = s => String(s || '').replace(/^\((.*)\)$/, '$1');

  function parseJcl(src, user) {
    const stmts = []; let cur = null, inData = null;
    src.forEach((raw, i) => {
      const line = raw.slice(0, 72).replace(/\s+$/, '').replace(/&SYSUID\.?/g, user);
      if (inData) {
        if (line.startsWith('/*') || line.startsWith('//')) { inData = null; if (line.startsWith('/*')) return; }
        else { inData.data.push(raw.replace(/\s+$/, '')); return; }
      }
      if (line.startsWith('//*')) { stmts.push({ kind: 'comment', src: [line] }); return; }
      if (line === '//' || !line.startsWith('//')) return;
      const m = line.match(/^\/\/(\S*)\s*(.*)$/);
      if (cur && cur.cont && m[1] === '') {
        cur.field += operandField(m[2].trim());
        cur.src.push(line);
        cur.cont = cur.field.endsWith(',');
        return;
      }
      const m2 = m[2].match(/^(\S+)\s*(.*)$/) || ['', '', ''];
      cur = { kind: 'stmt', name: m[1], op: m2[1], field: operandField(m2[2]), src: [line], n: i + 1 };
      cur.cont = cur.field.endsWith(',');
      stmts.push(cur);
      if (cur.op === 'DD' && /^(\*|DATA)(,|$)/.test(cur.field)) { inData = cur; cur.data = []; }
    });
    for (const s of stmts) if (s.kind === 'stmt') s.ops = parseOps(s.field);
    return stmts;
  }

  // real programs that are recognised but only answer "not simulated"
  const KNOWN_PGMS = ['ASMA90', 'IEBPTPCH', 'IEBUPDTE', 'IEHLIST', 'IRXJCL', 'BPXBATCH', 'DFSRRC00', 'DSNTEP2', 'IEBCOMPR', 'ADRDSSU', 'ICETOOL'];

  const sortNum = s => Number(String(s).replace(/[^0-9.-]/g, '')) || 0;
  /** DFSORT INCLUDE/OMIT COND=(p,l,fmt,op,value[,AND|OR,...]) -> predicate, or null if it does not parse */
  function sortCond(c) {
    const t = splitTop(c).map(x => x.trim()), groups = [[]];
    let i = 0;
    while (i < t.length) {
      if (t.length - i < 5) return null;
      const [p, l, f, op, val] = t.slice(i, i + 5);
      if (!(Number(p) >= 1) || !(Number(l) >= 1) || !/^(EQ|NE|GT|GE|LT|LE)$/i.test(op)) return null;
      groups[groups.length - 1].push({ p: Number(p), l: Number(l), f: f.toUpperCase(), op: op.toUpperCase(), val });
      i += 5;
      if (i < t.length) {
        const j = t[i++].toUpperCase();
        if (j === 'OR') groups.push([]); else if (j !== 'AND') return null;
      }
    }
    const test = (r, k) => {
      const x = r.padEnd(k.p - 1 + k.l).substr(k.p - 1, k.l), m = k.val.match(/^C'(.*)'$/i);
      const c2 = m ? ebcCmp(x, m[1].padEnd(k.l)) : sortNum(x) - Number(k.val);
      return { EQ: c2 === 0, NE: c2 !== 0, GT: c2 > 0, GE: c2 >= 0, LT: c2 < 0, LE: c2 <= 0 }[k.op];
    };
    return r => groups.some(g => g.every(k => test(r, k)));
  }

  /** the programs a job step can run. io = the step's DD statements; returns the condition code */
  const PGMS = {
    IEFBR14: () => 0,

    IEBGENER(io) {
      io.write('SYSPRINT', ['DATA SET UTILITY - GENERATE', '']);
      if (!io.has('SYSUT1') || !io.has('SYSUT2')) {
        io.write('SYSPRINT', ['IEB311I CONFLICTING DCB PARAMETERS - SYSUT1 OR SYSUT2 MISSING']);
        return 12;
      }
      if (io.write('SYSUT2', io.read('SYSUT1'))) io.write('SYSPRINT', ['PROCESSING ENDED AT EOD']);
      return 0;
    },

    IEBCOPY(io) {
      const P = l => io.write('SYSPRINT', l);
      let ind = 'SYSUT1', outd = 'SYSUT2', sel = null, replace = false;
      for (const c of io.read('SYSIN') || []) {
        const t = c.slice(0, 72).toUpperCase();
        let m = t.match(/\b(?:OUTDD|O)=(\w+)/); if (m) outd = m[1];
        m = t.match(/\b(?:INDD|I)=\(*(\w+)(,R\))?/); if (m) { ind = m[1]; replace = !!m[2]; }
        m = t.match(/\bMEMBER=\(?([^)\s]+)\)?/); if (m) sel = (sel || []).concat(m[1].split(',').filter(Boolean));
      }
      P(['IEBCOPY  FMID HDZ3310  SERVICE LEVEL NONE    DATED ' + isoDate() + '  DFSMS 03.01.00  z/OS 03.01.00', '']);
      const src = io.ds(ind), dst = io.ds(outd);
      for (const [dd, x] of [[ind, src], [outd, dst]]) {
        if (!x || x.d.dsorg !== 'PO') { P(['IEB120I ' + pad(dd, 8) + ' VALIDATION ERROR - NOT A PARTITIONED DATA SET', 'IEB147I END OF JOB - 8 WAS HIGHEST SEVERITY CODE']); return 8; }
      }
      if (!io.host.owns(dst.name)) { io.deny(dst.name, 'UPDATE'); return 0; }
      let rc = 0; const done = [];
      for (const m of sel || Object.keys(src.d.members).sort()) {
        if (!src.d.members[m]) { P(['IEB189I MEMBER ' + m + ' NOT FOUND IN INPUT DATA SET']); rc = Math.max(rc, 4); continue; }
        if (dst.d.members[m] && !replace) { P(['IEB1067I ' + m + ' NOT COPIED - IT ALREADY EXISTS IN THE OUTPUT DATA SET (USE INDD=((' + ind + ',R)) TO REPLACE)']); rc = Math.max(rc, 4); continue; }
        dst.d.members[m] = Object.assign({}, src.d.members[m], { lines: src.d.members[m].lines.slice() });
        done.push(m);
      }
      if (done.length) P(['IEB167I FOLLOWING MEMBER(S) COPIED FROM INPUT DDNAME ' + ind + ' VOL=SER=' + src.d.vol, ...done.map(m => 'IEB154I ' + pad(m, 8) + ' HAS BEEN SUCCESSFULLY COPIED')]);
      P(['IEB144I THERE ARE ' + (dst.d.space ? dst.d.space.pri : 1) + ' UNUSED TRACKS IN OUTPUT DATA SET REFERENCED BY ' + outd,
        'IEB147I END OF JOB - ' + rc + ' WAS HIGHEST SEVERITY CODE']);
      return rc;
    },

    SORT(io) {
      const P = l => io.write('SYSOUT', l);
      const raw = (io.read('SYSIN') || []).map(l => l.slice(0, 71).replace(/\s+$/, '')).filter(l => l.trim() && !l.startsWith('*'));
      P(['ICE143I 0 BLOCKSET     SORT  TECHNIQUE SELECTED',
        'ICE000I 1 - CONTROL STATEMENTS FOR 5650-ZOS, Z/OS DFSORT V3R1 - ' + hm() + ' ON ' + DAYS[new Date().getDay()].slice(0, 3) + ' ' + longDate(),
        ...raw.map(l => '          ' + l.trim())]);
      const bad = m => { P([m, 'ICE751I 0 C5-NONE C6-NONE C7-NONE C8-NONE', 'ICE052I 3 END OF DFSORT']); return 16; };
      const stmts = []; let cur = '';
      for (const l of raw) { cur += l.trim(); if (!cur.endsWith(',')) { stmts.push(cur); cur = ''; } }
      if (cur) stmts.push(cur);
      let keys = null, copy = false, inc = null, omit = null, sumNone = false;
      for (const s of stmts) {
        const verb = s.split(/\s+/)[0].toUpperCase(), ops = operandField(s.slice(verb.length).trim());
        if (verb === 'SORT' || verb === 'MERGE') {
          const f = (ops.match(/FIELDS=(\([^)]*\)|COPY)/i) || [])[1];
          if (!f) return bad('ICE007A 0 SYNTAX ERROR');
          if (/^COPY$/i.test(f)) { copy = true; continue; }
          const fmtAll = (ops.match(/FORMAT=(\w+)/i) || [])[1];
          const parts = unparen(f).split(',').map(x => x.trim().toUpperCase()), w = fmtAll ? 3 : 4;
          if (parts.length % w) return bad('ICE007A 0 SYNTAX ERROR');
          keys = [];
          for (let i = 0; i < parts.length; i += w) {
            const k = { p: Number(parts[i]), l: Number(parts[i + 1]), f: fmtAll ? fmtAll.toUpperCase() : parts[i + 2], d: parts[i + w - 1] };
            if (!(k.p >= 1) || !(k.l >= 1) || !/^[AD]$/.test(k.d)) return bad('ICE007A 0 SYNTAX ERROR');
            keys.push(k);
          }
        } else if (verb === 'OPTION') { if (/\bCOPY\b/i.test(ops)) copy = true; }
        else if (verb === 'INCLUDE' || verb === 'OMIT') {
          const c = (ops.match(/COND=\((.*)\)$/i) || [])[1], cond = c && sortCond(c);
          if (!cond) return bad('ICE007A 0 SYNTAX ERROR');
          if (verb === 'INCLUDE') inc = cond; else omit = cond;
        } else if (verb === 'SUM') {
          if (!/FIELDS=NONE/i.test(ops)) return bad('ICE007A 0 SYNTAX ERROR - ONLY SUM FIELDS=NONE IS SIMULATED');
          sumNone = true;
        } else if (verb === 'END') break;
        else return bad('ICE007A 0 SYNTAX ERROR - ' + verb + ' IS NOT SIMULATED');
      }
      if (!keys && !copy) return bad('ICE010A 0 NO SORT OR MERGE CONTROL STATEMENT');
      for (const dd of ['SORTIN', 'SORTOUT']) if (!io.has(dd)) return bad('ICE056A 0 ' + dd + ' IS NOT DEFINED');
      const all = io.read('SORTIN');
      let recs = all.filter(r => (!inc || inc(r)) && !(omit && omit(r)));
      const kv = (r, k) => r.padEnd(k.p - 1 + k.l).substr(k.p - 1, k.l);
      const numeric = f => /^(ZD|PD|FS|FI|UFF|SFF|CSF)$/.test(f);
      const cmpKeys = (a, b) => {
        for (const k of keys) {
          const c = numeric(k.f) ? sortNum(kv(a, k)) - sortNum(kv(b, k)) : ebcCmp(kv(a, k), kv(b, k));
          if (c) return k.d === 'A' ? c : -c;
        }
        return 0;
      };
      if (keys) {
        recs = recs.map((r, i) => [r, i]).sort((a, b) => cmpKeys(a[0], b[0]) || a[1] - b[1]).map(x => x[0]);
        if (sumNone) recs = recs.filter((r, i) => i === 0 || cmpKeys(recs[i - 1], r) !== 0);
      }
      if (!io.write('SORTOUT', recs)) return 0;
      P(['ICE055I 0 INSERT 0, DELETE ' + (all.length - recs.length), 'ICE054I 0 RECORDS - IN: ' + all.length + ', OUT: ' + recs.length, 'ICE052I 0 END OF DFSORT']);
      return 0;
    },

    IDCAMS(io) {
      const host = io.host, P = l => io.write('SYSPRINT', l);
      P(['IDCAMS  SYSTEM SERVICES' + ' '.repeat(40) + 'TIME: ' + hms() + '        ' + mmddyy() + '     PAGE      1', '']);
      const cmds = []; let cur = '';
      for (const l of io.read('SYSIN') || []) {
        const t = l.slice(0, 72).trim();
        if (!t || t.startsWith('/*')) continue;
        if (/[-+]$/.test(t)) { cur += t.slice(0, -1).trim() + ' '; continue; }   // continuation
        cmds.push(cur + t); cur = '';
      }
      if (cur) cmds.push(cur.trim());
      const kw = (s, names) => { const m = s.match(new RegExp('\\b(?:' + names + ')\\s*\\(\\s*([^)]*?)\\s*\\)', 'i')); return m ? m[1].replace(/'/g, '').toUpperCase() : null; };
      const input = s => {
        const dd = kw(s, 'INFILE|IFILE'), ds = kw(s, 'INDATASET|IDS');
        if (dd) return io.has(dd) ? { lines: io.read(dd), name: dd } : { err: 'IDC3300I ERROR OPENING ' + dd + ' - DD STATEMENT MISSING' };
        if (ds) { const r = host.readDs(ds); return r.err ? { err: 'IDC3012I ENTRY ' + ds + ' NOT FOUND' } : { lines: r.lines, name: ds }; }
        return { err: 'IDC3213I KEYWORD INFILE OR INDATASET IS REQUIRED' };
      };
      let maxcc = 0;
      for (const c of cmds) {
        P([' ' + c, '']);
        const U = c.toUpperCase(), verb = U.split(/[\s(]+/)[0]; let cc = 0;
        if (verb === 'LISTCAT' || verb === 'LISTC') {
          const level = kw(c, 'LEVEL|LVL'), ent = kw(c, 'ENTRIES|ENT'), what = ent || level || io.user;
          const names = ent ? ent.split(/[\s,]+/).filter(n => host.catalog[n]) : host.listLevel(what);
          if (!names.length) { P(['IDC3012I ENTRY ' + what + ' NOT FOUND', 'IDC1566I ** ' + what + ' NOT LISTED']); cc = 4; }
          for (const n of names) {
            P(['NONVSAM ------- ' + n, '     IN-CAT --- ' + CATALOG_NAME]);
            if (/\b(ALL|VOL|VOLUME)\b/.test(U)) P(['     VOLUMES', '       VOLSER------------' + host.catalog[n].vol + "     DEVTYPE------X'3010200F'"]);
          }
          if (names.length) P(['', '         THE NUMBER OF ENTRIES PROCESSED WAS:', '                   NONVSAM ---------------' + names.length]);
        } else if (verb === 'DELETE' || verb === 'DEL') {
          const m = c.replace(/^\s*\S+\s*/, '').match(/^\(?\s*'?([^\s')]+(?:\([^)]*\))?)/), nm = m ? m[1].toUpperCase() : '';
          const p = splitDsn(nm), d = p && host.catalog[p.ds];
          if (!d || (p.mem && !(d.members || {})[p.mem])) {
            P(['IDC3012I ENTRY ' + nm + ' NOT FOUND', 'IDC3009I ** VSAM CATALOG RETURN CODE IS 8 - REASON CODE IS IGG0CLEG-42', 'IDC0551I ** ENTRY ' + nm + ' NOT DELETED']);
            cc = 8;
          } else if (!host.owns(p.ds)) {
            P([host.racf(p.ds, 'ALTER'), 'IDC3018I SECURITY VERIFICATION FAILED+', 'IDC0551I ** ENTRY ' + nm + ' NOT DELETED']);
            cc = 8;
          } else if (p.mem) { delete d.members[p.mem]; P(['IDC0549I MEMBER ' + p.mem + ' DELETED']); }
          else { delete host.catalog[p.ds]; P(['IDC0550I ENTRY (A) ' + p.ds + ' DELETED']); }
        } else if (verb === 'REPRO') {
          const s = input(c), odd = kw(c, 'OUTFILE|OFILE'), ods = kw(c, 'OUTDATASET|ODS');
          if (s.err) { P([s.err]); cc = 12; }
          else if (odd) {
            if (!io.has(odd)) { P(['IDC3300I ERROR OPENING ' + odd + ' - DD STATEMENT MISSING']); cc = 12; }
            else if (!io.write(odd, s.lines)) return maxcc;
          } else if (ods) {
            const p = splitDsn(ods), d = p && host.catalog[p.ds];
            if (!d || (d.dsorg === 'PO') !== !!p.mem) { P(['IDC3012I ENTRY ' + ods + ' NOT FOUND']); cc = 12; }
            else if (!host.owns(p.ds)) { P([host.racf(p.ds, 'UPDATE'), 'IDC3018I SECURITY VERIFICATION FAILED+']); cc = 12; }
            else host.writeDs(ods, s.lines);
          } else { P(['IDC3213I KEYWORD OUTFILE OR OUTDATASET IS REQUIRED']); cc = 12; }
          if (!cc) P(['IDC0005I NUMBER OF RECORDS PROCESSED WAS ' + s.lines.length]);
        } else if (verb === 'PRINT') {
          const s = input(c);
          if (s.err) { P([s.err]); cc = 12; }
          else {
            const recs = s.lines.slice(0, Number(kw(c, 'COUNT')) || s.lines.length);
            P(['IDCAMS LISTING OF DATA SET -' + s.name, '']);
            recs.forEach((l, i) => P(['RECORD SEQUENCE NUMBER - ' + (i + 1), l, '']));
            P(['IDC0005I NUMBER OF RECORDS PROCESSED WAS ' + recs.length]);
          }
        } else if (verb === 'SET') {
          const m = U.match(/MAXCC\s*=\s*(\d+)/);
          if (m) maxcc = Number(m[1]);
          continue;
        } else if (['DEFINE', 'DEF', 'ALTER', 'VERIFY', 'EXPORT', 'IMPORT', 'BLDINDEX', 'EXAMINE', 'IF', 'THEN', 'ELSE', 'DO', 'END'].includes(verb)) {
          P(['ZSIM110I ' + verb + ' IS A REAL IDCAMS COMMAND BUT IT IS NOT SIMULATED HERE (THERE IS NO VSAM).']);
        } else { P(['IDC3202I ABOVE TEXT BYPASSED UNTIL NEXT COMMAND. CONDITION CODE IS 12']); cc = 12; }
        maxcc = Math.max(maxcc, cc);
        P([(cc >= 12 ? 'IDC3003I FUNCTION TERMINATED. CONDITION CODE IS ' : 'IDC0001I FUNCTION COMPLETED, HIGHEST CONDITION CODE WAS ') + cc, '']);
      }
      P(['IDC0002I IDCAMS PROCESSING COMPLETE. MAXIMUM CONDITION CODE WAS ' + maxcc]);
      return maxcc;
    },

    /** TSO in batch: commands come from SYSTSIN, output goes to SYSTSPRT */
    IKJEFT01(io) {
      const host = io.host, P = l => io.write('SYSTSPRT', l);
      if (!io.has('SYSTSIN')) { P(['IKJ56641I SYSTSIN DD STATEMENT MISSING - NO COMMANDS TO RUN']); return 12; }
      const q = io.read('SYSTSIN').map(l => l.slice(0, 72).trim());
      let rc = 0;
      while (q.length) {
        const line = q.shift();
        if (!line) continue;
        P(['READY', line]);
        const r = host.tso(line, 'batch');
        if (r.action === 'EXEC') rc = Math.max(rc, rexxSync(host, r.exec, () => q.shift() || '', P));
        else if (r.action) P(['ZSIM003I ' + line.split(/\s+/)[0].toUpperCase() + ' NEEDS A TERMINAL - IT CAN NOT RUN IN BATCH']);
        else { P(r.lines); if (/^IKJ56500I/.test(r.lines[0] || '')) rc = 12; }
      }
      P(['READY', 'END']);
      return rc;
    },

    /** Enterprise COBOL compiler: SYSIN source -> SYSPRINT listing + SYSLIN object deck */
    IGYCRCTL(io) {
      if (!io.has('SYSIN')) { io.write('SYSPRINT', ['IGYOS4003-U  SYSIN DD STATEMENT IS MISSING. COMPILATION TERMINATED.']); return 16; }
      const c = cobolCompile(io.read('SYSIN'));
      io.write('SYSPRINT', c.listing);
      if (c.rc < 8 && io.has('SYSLIN')) io.write('SYSLIN', ['.ESD ' + JSON.stringify(c.prog)]);
      return c.rc;
    },

    /** the binder (linkage editor): SYSLIN object deck -> load module in SYSLMOD */
    IEWL(io) {
      const P = l => io.write('SYSPRINT', l);
      P(['z/OS V3 R1 BINDER     ' + hms() + ' ' + DAYS[new Date().getDay()] + ' ' + longDate(), 'IEW2278I B352 INVOCATION PARAMETERS - ' + (io.parm || 'NONE'), '']);
      const obj = (io.read('SYSLIN') || []).find(l => l.startsWith('.ESD '));
      const lib = io.ds('SYSLMOD');
      if (!obj) { P(['IEW2230S 0414 MODULE HAS NO TEXT.', 'IEW2677S 5130 A VALID ENTRY POINT COULD NOT BE DETERMINED.', 'IEW2008I 0F03 PROCESSING COMPLETED.  RETURN CODE = 12.']); return 12; }
      if (!lib || lib.d.dsorg !== 'PO') { P(['IEW2735S DA40 SYSLMOD IS MISSING OR IS NOT A PARTITIONED DATA SET.', 'IEW2008I 0F03 PROCESSING COMPLETED.  RETURN CODE = 12.']); return 12; }
      if (!io.host.owns(lib.name)) { io.deny(lib.name, 'UPDATE'); return 0; }
      const prog = JSON.parse(obj.slice(5)), mem = lib.mem || prog.id;
      io.host.writeDs(lib.name + '(' + mem + ')', ['LOAD MODULE ' + mem + ' - EXECUTABLE CODE, NOT TEXT.   RUN IT WITH   //STEP EXEC PGM=' + mem]);
      lib.d.members[mem].load = prog;
      P(['IEW2650I 5102 MODULE ENTRY NOT PROVIDED.  ENTRY DEFAULTS TO SECTION ' + prog.id + '.', '',
        'SAVE OPERATION SUMMARY:', '   MEMBER NAME         ' + mem, '   LOAD LIBRARY        ' + lib.name, '   PROGRAM TYPE        LOAD MODULE', '',
        'IEW2008I 0F03 PROCESSING COMPLETED.  RETURN CODE =  0.']);
      return 0;
    },
  };
  PGMS.ICEMAN = PGMS.SORT;
  PGMS.IEWBLINK = PGMS.HEWL = PGMS.IEWL;
  PGMS.IKJEFT1B = PGMS.IKJEFT01;

  const CONDS = { GT: (a, b) => a > b, GE: (a, b) => a >= b, EQ: (a, b) => a === b, LT: (a, b) => a < b, LE: (a, b) => a <= b, NE: (a, b) => a !== b };

  function runJob(host, src) {
    const user = host.user, id = 'JOB' + lpad(++host.jobSeq, 5, '0');
    const stmts = parseJcl(src, user), real = stmts.filter(s => s.kind === 'stmt');
    const jobStmt = real[0] && real[0].op === 'JOB' ? real[0] : null;
    const name = (jobStmt && jobStmt.name) || user + 'A';
    const t0 = new Date(), ts = () => hmsDot(t0) + ' ' + id + '  ';
    const job = {
      id, name, owner: user, cls: (jobStmt && jobStmt.ops.CLASS) || 'A', submitted: t0,
      endAt: Date.now() + host.jobDelay, notify: !!(jobStmt && jobStmt.ops.NOTIFY), dds: [],
    };
    const msglg = [
      center('J E S 2  J O B  L O G  --  S Y S T E M  ' + SYSID + '  --  N O D E  ' + NODE, 100),
      '', hmsDot(t0) + ' ' + id + ' ---- ' + DAYS[t0.getDay()] + ',  ' + t0.getDate() + ' ' + MONTHS[t0.getMonth()].slice(0, 3) + ' ' + t0.getFullYear() + ' ----',
      ts() + 'IRR010I  USERID ' + pad(user, 8) + ' IS ASSIGNED TO THIS JOB.',
    ];
    const jesjcl = [];
    let n = 0;
    for (const s of stmts) for (let k = 0; k < s.src.length; k++) {
      jesjcl.push((k === 0 && s.kind === 'stmt' ? lpad(++n, 9) : ' '.repeat(9)) + ' ' + s.src[k]);
    }
    const sysmsg = [];
    const finish = (summary, status) => {
      job.summary = summary;
      job.status = status;
      job.dds = [
        { dd: 'JESMSGLG', step: 'JES2', dsid: 2, lines: msglg },
        { dd: 'JESJCL', step: 'JES2', dsid: 3, lines: jesjcl },
        { dd: 'JESYSMSG', step: 'JES2', dsid: 4, lines: sysmsg },
        ...job.dds,
      ];
      host.log('$HASP395 ' + pad(name, 8) + ' ENDED - ' + summary);
      return job;
    };
    const jclError = msgs => {
      sysmsg.push(...msgs);
      msglg.push(ts() + '$HASP396 ' + pad(name, 8) + ' TERMINATED');
      return finish('JCL ERROR', 'JCL ERROR');
    };

    // converter: syntax
    const errs = [];
    if (!jobStmt) errs.push('STMT NO. 1   IEFC601I FIRST STATEMENT IS NOT A JOB STATEMENT');
    const steps = []; let step = null, joblib = null;
    real.slice(jobStmt ? 1 : 0).forEach((s, i) => {
      if (s.op === 'EXEC') {
        const pgm = s.ops.PGM;
        if (!pgm) errs.push('STMT NO. ' + (i + 2) + '   IEFC612I PROCEDURE ' + (s.ops.PROC || s.ops._0) + ' WAS NOT FOUND');
        step = { name: s.name || '', pgm, dds: [], cond: s.ops.COND, parm: unparen(s.ops.PARM || '').replace(/^'|'$/g, '') };
        steps.push(step);
      } else if (s.op === 'DD') {
        if (!step) {
          if (s.name === 'JOBLIB') joblib = s.ops.DSN || s.ops.DSNAME;
          else errs.push('STMT NO. ' + (i + 2) + '   IEFC610I DD STATEMENT BEFORE FIRST EXEC');
          return;
        }
        if (!s.name) return;   // concatenation: only the first data set is used here
        step.dds.push({ name: s.name, ops: s.ops, data: s.data });
      } else if (!['JCLLIB', 'SET', 'OUTPUT', 'INCLUDE', 'IF', 'ELSE', 'ENDIF', 'JOBLIB'].includes(s.op) && s.op !== 'JOB') {
        errs.push('STMT NO. ' + (i + 2) + '   IEFC605I UNIDENTIFIED OPERATION FIELD');
      }
    });
    if (!steps.length && !errs.length) errs.push('IEFC607I JOB HAS NO STEPS');
    if (errs.length) return jclError([...errs, 'IEF452I ' + name + ' - JOB NOT RUN - JCL ERROR']);

    msglg.push(ts() + '$HASP373 ' + pad(name, 8) + ' STARTED - INIT 1    - CLASS ' + job.cls + '        - SYS ' + SYSID,
      ts() + '-                                      -----TIMINGS (MINS.)------',
      ts() + '-STEPNAME PROCSTEP    RC   EXCP   CONN    TCB    SRB  CLOCK');
    const stepRow = (st, what) => msglg.push(ts() + '-' + pad(st.name, 8) + ' ' + pad('', 8) + '  ' + what +
      lpad(20 + Math.floor(Math.random() * 60), 7) + lpad(1, 7) + '    .00    .00     .0');
    const stamps = (k, a, b, nm) => sysmsg.push(a + ' ' + k + '/' + pad(nm, 8) + '/START ' + julian(t0) + '.' + hm(t0).replace(':', ''),
      b + ' ' + k + '/' + pad(nm, 8) + '/STOP  ' + julian(t0) + '.' + hm(t0).replace(':', ''));

    let abend = null, maxrc = 0, dsid = 101;
    const temps = {}, rcs = [];   // &&TEMP data sets passed between steps; condition codes so far
    for (const st of steps) {
      if (abend) { sysmsg.push('IEF272I ' + name + ' ' + st.name + ' - STEP WAS NOT EXECUTED.'); continue; }
      // COND=(4,LT): skip this step if 4 is less than an earlier step's condition code
      if (st.cond) {
        const tests = [...st.cond.matchAll(/(\d+),(GT|GE|EQ|LT|LE|NE)(?:,([A-Z0-9#$@]+))?/g)];
        if (tests.some(m => rcs.some(r => (!m[3] || r.name === m[3]) && CONDS[m[2]](Number(m[1]), r.rc)))) {
          sysmsg.push('IEF202I ' + name + ' ' + st.name + ' - STEP WAS NOT RUN BECAUSE OF CONDITION CODES');
          stepRow(st, 'FLUSH');
          continue;
        }
      }
      // allocation
      const alloc = {};
      const stepErr = msg => jclError([msg, 'IEF272I ' + name + ' ' + st.name + ' - STEP WAS NOT EXECUTED.', 'IEF452I ' + name + ' - JOB NOT RUN - JCL ERROR']);
      for (const dd of st.dds) {
        const dsnRaw = dd.ops.DSN || dd.ops.DSNAME;
        const disp = unparen(dd.ops.DISP || 'NEW').split(',');
        const a = { dd, disp, sysout: dd.ops.SYSOUT !== undefined, dummy: dd.ops._0 === 'DUMMY', out: [] };
        alloc[dd.name] = a;
        if (!dsnRaw) continue;
        if (dsnRaw.startsWith('&&')) { a.temp = dsnRaw; continue; }
        const p = splitDsn(dsnRaw);
        if (!p) return stepErr('IEF642I ' + name + ' ' + st.name + ' ' + dd.name + ' - INVALID DSNAME ' + dsnRaw);
        a.dsn = p;
        const exists = host.catalog[p.ds];
        const status = disp[0] || 'NEW';
        if (status !== 'NEW' && !exists) return stepErr('IEF212I ' + name + ' ' + st.name + ' ' + dd.name + ' - DATA SET NOT FOUND');
        if (status === 'NEW' && exists) return stepErr('IGD17101I DATA SET ' + p.ds + ' NOT DEFINED BECAUSE DUPLICATE NAME EXISTS IN CATALOG');
        if (status !== 'SHR' && !host.owns(p.ds)) {
          sysmsg.push(host.racf(p.ds, status === 'NEW' ? 'ALTER' : 'UPDATE'));
          abend = 'S913';
        }
        if (status === 'NEW') {
          const sp = (dd.ops.SPACE || '').match(/\(?(\w+),\(?(\d+)(?:,(\d*))?(?:,(\d+))?/) || [];
          const lib = /LIBRARY/.test(dd.ops.DSNTYPE || ''), po = dd.ops.DSORG === 'PO' || Number(sp[4]) > 0 || lib || /PDS/.test(dd.ops.DSNTYPE || '');
          a.create = {
            dsorg: po ? 'PO' : 'PS', recfm: unparen(dd.ops.RECFM || 'FB').replace(/,/g, ''), lrecl: Number(dd.ops.LRECL) || 80,
            space: { unit: /^CYL/.test(sp[1] || '') ? 'CYLS' : 'TRKS', pri: Number(sp[2]) || 1, sec: Number(sp[3]) || 0, dir: Number(sp[4]) || 0 },
          };
          if (po) a.create.dsntype = lib ? 'LIBRARY' : 'PDS';
        }
      }
      // every DD is valid: now the new data sets exist, so the program can write to them
      for (const a of Object.values(alloc)) if (a.create && !abend) { host.newDs(a.dsn.ds, a.create); a.created = true; }

      // run the program
      let rc = 0;
      const pgm = (st.pgm || '').toUpperCase();
      const fail = (code, msgs) => {
        if (abend) return;
        abend = code;
        sysmsg.push(...msgs, 'IEF450I ' + name + ' ' + st.name + ' - ABEND=' + code + ' U0000 REASON=00000004');
      };
      const io = {
        host, user, parm: st.parm,
        has: dd => !!alloc[dd],
        read(dd) {
          const a = alloc[dd];
          if (!a) return null;
          if (a.dd.data) return a.dd.data.slice();
          if (a.temp) return (temps[a.temp] || []).slice();
          if (a.dsn) return host.readDs(fullName(a.dsn)).lines || [];
          return [];
        },
        /** false if the step abended instead */
        write(dd, lines) {
          let a = alloc[dd];
          if (!a) {
            if (!/^SYS(OUT|PRINT|TSPRT)$/.test(dd)) return true;
            a = alloc[dd] = { dd: { name: dd }, disp: [], sysout: true, out: [] };
          }
          if (a.sysout) a.out.push(...lines);
          else if (a.temp) temps[a.temp] = lines.slice();
          else if (a.dsn && !a.dummy) {
            const d = host.catalog[a.dsn.ds];
            if (!host.owns(a.dsn.ds)) { this.deny(a.dsn.ds, 'UPDATE'); return false; }
            if (d.dsorg === 'PO' && !a.dsn.mem) {
              fail('S013', ['IEC141I 013-14,IGG0191B,' + name + ',' + st.name + ',' + dd + ',,' + d.vol + ',' + a.dsn.ds,
                '  (A PDS WAS OPENED FOR OUTPUT WITHOUT A MEMBER NAME)']);
              return false;
            }
            host.writeDs(fullName(a.dsn), lines);
          }
          return true;
        },
        ds(dd) {
          const a = alloc[dd], d = a && a.dsn && host.catalog[a.dsn.ds];
          return d ? { name: a.dsn.ds, mem: a.dsn.mem, d } : null;
        },
        deny(ds, intent) { fail('S913', [host.racf(ds, intent)]); },
      };
      if (abend) {
        sysmsg.push('IEF450I ' + name + ' ' + st.name + ' - ABEND=' + abend + ' U0000 REASON=00000004');
      } else if (PGMS[pgm]) {
        rc = PGMS[pgm](io) || 0;
      } else {
        // not a system program: look for a load module in STEPLIB, then JOBLIB
        const libs = [alloc.STEPLIB && alloc.STEPLIB.dsn && alloc.STEPLIB.dsn.ds, joblib].filter(Boolean).map(x => host.catalog[x]);
        const lib = libs.find(d => d && d.dsorg === 'PO' && d.members[pgm] && d.members[pgm].load);
        if (lib) {
          if (cobolRun(lib.members[pgm].load, l => io.write('SYSOUT', [l])) === 'limit') {
            fail('S322', ['IEA995I SYMPTOM DUMP OUTPUT  322', '  SYSTEM COMPLETION CODE=322  (THE STEP USED MORE CPU TIME THAN IT IS ALLOWED)']);
          }
        } else if (KNOWN_PGMS.includes(pgm)) {
          io.write(alloc.SYSPRINT ? 'SYSPRINT' : 'SYSOUT', ['ZSIM100I ' + pgm + ' IS A REAL Z/OS PROGRAM BUT IT IS NOT SIMULATED HERE.', 'ZSIM101I THE STEP WAS TREATED AS SUCCESSFUL (RC=0).']);
        } else {
          fail('S806', ['CSV003I REQUESTED MODULE ' + pgm + ' NOT FOUND', 'CSV028I ABEND806-04  JOBNAME=' + name + '  STEPNAME=' + st.name,
            'IEA995I SYMPTOM DUMP OUTPUT  806', '  SYSTEM COMPLETION CODE=806  REASON CODE=00000004']);
        }
      }
      if (!abend) sysmsg.push('IEF142I ' + name + ' ' + st.name + ' - STEP WAS EXECUTED - COND CODE ' + lpad(rc, 4, '0'));
      maxrc = Math.max(maxrc, rc);
      rcs.push({ name: st.name, rc });
      // disposition
      for (const ddn of Object.keys(alloc)) {
        const a = alloc[ddn];
        if (a.dsn) {
          const full = a.dsn.ds, d = host.catalog[full];
          const how = (abend ? a.disp[2] || a.disp[1] : a.disp[1]) || (a.create ? 'DELETE' : 'KEEP');
          if (a.created && /CATLG|KEEP|PASS/.test(how)) {
            sysmsg.push('IEF285I   ' + pad(full, 44) + ' CATALOGED', 'IEF285I   VOL SER NOS= ' + d.vol + '.');
          } else if (a.created || (how === 'DELETE' && d && !a.create && a.disp[0] !== 'SHR' && host.owns(full))) {
            delete host.catalog[full];
            sysmsg.push('IEF285I   ' + pad(full, 44) + ' DELETED');
          } else if (!a.create) {
            sysmsg.push('IEF285I   ' + pad(full, 44) + ' ' + (a.disp[0] === 'SHR' ? 'RETAINED' : 'KEPT'));
          }
        } else if (a.sysout && a.out.length) {
          job.dds.push({ dd: ddn, step: st.name, dsid: dsid++, lines: a.out });
          sysmsg.push('IEF285I   ' + pad(user + '.' + name + '.' + id + '.D0000' + (dsid - 1) + '.?', 44) + ' SYSOUT');
        }
      }
      stamps('STEP', 'IEF373I', 'IEF032I', st.name);
      stepRow(st, abend ? pad(abend, 5) : lpad(lpad(rc, 2, '0'), 5));
    }
    stamps(' JOB', 'IEF375I', 'IEF033I', name);
    const summary = abend ? 'ABEND=' + abend : 'MAXCC=' + lpad(maxrc, 4, '0');
    msglg.push(ts() + '$HASP395 ' + pad(name, 8) + ' ENDED - ' + (abend ? 'ABEND=' + abend : 'RC=' + lpad(maxrc, 4, '0')));
    return finish(summary, abend ? 'ABEND ' + abend : 'CC ' + lpad(maxrc, 4, '0'));
  }

  // ---------- shared panel bits -------------------------------------------
  /** standard ISPF header: title row, Command ===> row, optional scroll field */
  function head(s, title, right, o = {}) {
    s.put(0, 0, title, 'b');
    if (o.msg) s.put(0, 79 - o.msg.length, o.msg, 'w');
    else if (right) s.put(0, 79 - right.length, right, 'b');
    const label = o.label || 'Command ===>';
    s.put(1, 0, label, 'g');
    const w = o.scroll === false ? 79 - label.length - 1 : 63 - label.length - 1;
    s.field(1, label.length + 1, w, { name: 'cmd', value: o.cmdValue || '', cursor: o.cursor !== false });
    if (o.scroll !== false) { s.put(1, 64, 'Scroll ===>', 'g'); s.field(1, 76, 4, { name: 'scroll', value: o.scroll || 'CSR', cls: 'in t' }); }
  }
  function fkeys(s, a, b) {
    if (a) s.put(22, 1, a, 't');
    if (b) s.put(23, 1, b, 't');
  }
  const actionBar = (s, text) => { s.put(0, 1, text, 'w'); s.put(1, 0, '-'.repeat(79), 'b'); };

  // ---------- views: before logon -----------------------------------------
  class VtamView {
    constructor(h, msg) { this.h = h; this.name = 'vtam'; this.msg = msg || ''; }
    draw(s) {
      BANNER.forEach((l, i) => s.put(1 + i, 13, l, 'b'));
      s.put(7, 18, 'ZSPEAK TRAINING SYSTEM  -  simulated z/OS 3.1', 'w');
      s.put(9, 2, 'You are talking to VTAM, the z/OS network layer. Pick an application:', 't');
      s.put(11, 4, 'Application  Description', 'w');
      s.put(12, 4, 'TSO          Time Sharing Option - interactive z/OS (this simulator)', 't');
      s.put(13, 4, 'CICS         Transaction server ................ not simulated here', 'b');
      s.put(14, 4, 'IMS          Transaction and database manager .. not simulated here', 'b');
      s.put(16, 2, 'To log on, type', 't');
      s.put(16, 18, 'TSO userid', 'w');
      s.put(16, 29, '(for example  TSO Z85188 ) and press ENTER.', 't');
      if (this.msg) s.put(19, 2, this.msg.slice(0, 77), 'r');
      s.put(21, 2, 'Terminal ZSPK0042   ' + mmddyy() + ' ' + hm() + '   Model 3278-2 (24x80)', 'b');
      s.put(22, 2, '===>', 'w');
      s.field(22, 7, 72, { name: 'cmd', cursor: true });
    }
    aid(aid, v) {
      this.msg = '';
      if (aid !== 'ENTER') { this.h.redraw(); return; }
      const u = (v.cmd || '').trim().toUpperCase();
      if (!u) { this.h.redraw(); return; }
      const m = u.match(/^(?:(?:L|LOGON)\s+(?:APPLID\(\s*)?)?(TSO|CICS|IMS)\s*\)?(?:\s+(?:DATA\(\s*)?([^\s)]+)\)?)?$/);
      if (!m) { this.msg = 'IST457I INVALID COMMAND SYNTAX - TYPE  TSO userid  TO LOG ON'; this.h.redraw(); return; }
      if (m[1] !== 'TSO') { this.msg = 'IST453I ' + m[1] + ' IS NOT AVAILABLE ON THIS TRAINING SYSTEM - TRY TSO'; this.h.redraw(); return; }
      if (!m[2]) { this.h.go(new UseridPrompt(this.h)); return; }
      if (!USERID_RE.test(m[2])) { this.msg = 'IKJ56420I USERID ' + m[2] + ' NOT AUTHORIZED TO USE TSO (1-7 CHARACTERS)'; this.h.redraw(); return; }
      this.h.go(new LogonPanel(this.h, m[2]));
    }
  }

  class UseridPrompt {
    constructor(h) { this.h = h; this.name = 'ikj-userid'; this.lines = ['IKJ56700A ENTER USERID -']; }
    draw(s) {
      this.lines.forEach((l, i) => s.put(i, 0, l, 'g'));
      s.field(this.lines.length, 0, 79, { name: 'cmd', cursor: true, cls: 'in plain' });
    }
    aid(aid, v) {
      if (aid === 'PA1' || /^PF(3|15)$/.test(aid)) { this.h.go(new VtamView(this.h)); return; }
      const u = (v.cmd || '').trim().toUpperCase();
      if (aid !== 'ENTER' || !u) { this.h.redraw(); return; }
      if (!USERID_RE.test(u)) {
        this.lines = ['IKJ56420I USERID ' + u + ' NOT AUTHORIZED TO USE TSO', 'IKJ56700A ENTER USERID -'];
        this.h.redraw();
        return;
      }
      this.h.go(new LogonPanel(this.h, u));
    }
  }

  class LogonPanel {
    constructor(h, user) { this.h = h; this.name = 'logon'; this.user = user; this.msg = ''; h.emit('logon-panel'); }
    draw(s) {
      s.put(0, 0, '------------------------------- TSO/E LOGON -----------------------------------', 'b');
      if (this.msg) s.put(1, 0, this.msg.slice(0, 79), 'r');
      s.put(3, 3, 'Enter LOGON parameters below:', 'w');
      s.put(3, 51, 'RACF LOGON parameters:', 'w');
      const row = (r, label, col = 3) => s.put(r, col, label, 't');
      row(5, 'Userid    ===>'); s.put(5, 18, this.user, 'w');
      row(7, 'Password  ===>'); s.field(7, 18, 8, { name: 'pw', hidden: true, cursor: true });
      row(7, 'New Password ===>', 51); s.field(7, 69, 8, { name: 'newpw', hidden: true });
      row(9, 'Procedure ===>'); s.field(9, 18, 8, { name: 'proc', value: 'IZUFPROC' });
      row(9, 'Group Ident  ===>', 51); s.field(9, 69, 8, { name: 'group' });
      row(11, 'Acct Nmbr ===>'); s.field(11, 18, 40, { name: 'acct', value: 'FB3' });
      row(13, 'Size      ===>'); s.field(13, 18, 7, { name: 'size', value: '2096128' });
      row(15, 'Perform   ===>'); s.field(15, 18, 3, { name: 'perf' });
      row(17, 'Command   ===>'); s.field(17, 18, 60, { name: 'command' });
      s.put(19, 3, "Enter an 'S' before each option desired below:", 'w');
      s.put(20, 11, '-Nomail         -Nonotice        -Reconnect        -OIDcard', 't');
      s.put(22, 0, 'PF1/PF13 ==> Help    PF3/PF15 ==> Logoff    PA1 ==> Attention    PA2 ==> Reshow', 'b');
      s.put(23, 0, "You may request specific help information by entering a '?' in any entry field", 'b');
    }
    aid(aid, v) {
      const h = this.h;
      this.msg = '';
      if (/^PF(3|15)$/.test(aid)) { h.go(new VtamView(h, 'IKJ56400A LOGON TERMINATED BY USER')); return; }
      if (/^PF(1|13)$/.test(aid)) { this.msg = 'Your RACF password. In this simulator ANY non-blank password works.'; h.redraw(); return; }
      if (aid !== 'ENTER') { h.redraw(); return; }
      if (!v.pw) { this.msg = 'IKJ56476I ENTER PASSWORD FOR ' + this.user; h.redraw(); return; }
      if (v.newpw && v.newpw.length < 6) { this.msg = 'ICH21007I NEW PASSWORD TOO SHORT'; h.redraw(); return; }
      const proc = (v.proc || 'IZUFPROC').toUpperCase();
      const last = new Date(Date.now() - 86400e3 * 2 - 3600e3 * 3);
      h.logon(this.user, proc);
      const msgs = [
        'ICH70001I ' + pad(this.user, 8) + ' LAST ACCESS AT ' + hms(last) + ' ON ' + DAYS[last.getDay()] + ', ' + longDate(last),
        'IKJ56455I ' + this.user + ' LOGON IN PROGRESS AT ' + hms() + ' ON ' + longDate(),
        'IKJ56951I NO BROADCAST MESSAGES',
      ];
      const cmd = (v.command || '').trim();
      if (cmd) {
        h.go(new Pager(h, msgs, () => h.ready.run(cmd)));
      } else {
        h.ready.out([...msgs, 'READY']);
        h.go(h.ready);
      }
    }
  }

  /** line-mode output followed by *** ; any key continues */
  class Pager {
    constructor(h, lines, done) {
      this.h = h; this.name = 'pager'; this.done = done; this.pages = [];
      const wrapped = [];
      for (const l of lines) for (let i = 0; i < Math.max(1, l.length); i += COLS) wrapped.push(l.slice(i, i + COLS));
      for (let i = 0; i < wrapped.length; i += ROWS - 1) this.pages.push(wrapped.slice(i, i + ROWS - 1));
      if (!this.pages.length) this.pages.push([]);
      this.i = 0;
    }
    draw(s) {
      const p = this.pages[this.i];
      p.forEach((l, r) => s.put(r, 0, l, 'g'));
      s.put(p.length, 0, ' ***', 'w');
      s.cursor = p.length * COLS + 5;
    }
    aid() {
      if (++this.i < this.pages.length) this.h.redraw();
      else this.done();
    }
  }

  // ---------- TSO READY (line mode) ---------------------------------------
  class ReadyView {
    constructor(h) { this.h = h; this.name = 'ready'; this.page = []; this.queue = []; this.more = false; this.x = null; this.endCb = null; }
    out(lines) {
      for (const l of lines) for (let i = 0; i < Math.max(1, l.length); i += COLS) this.queue.push(l.slice(i, i + COLS));
      this.flush();
    }
    flush() {
      while (this.queue.length && this.page.length < ROWS - 1) this.page.push(this.queue.shift());
      this.more = this.queue.length > 0;
    }
    draw(s) {
      this.page.forEach((l, i) => s.put(i, 0, l, 'g'));
      if (this.more || (this.endCb && !this.x)) { s.put(this.page.length, 0, ' ***', 'w'); s.cursor = this.page.length * COLS + 5; return; }
      const r = this.page.length;
      s.field(r, 0, (ROWS - r) * COLS - 1, { name: 'cmd', cursor: true, cls: 'in plain' });
    }
    aid(aid, v) {
      const h = this.h;
      if (this.more) {
        this.page = [];
        if (aid !== 'PA1') this.flush();
        else {   // attention: throw the rest away
          this.queue = []; this.more = false;
          if (this.x) this.endExec(['IRX0920I EXEC ' + this.x.name + ' ENDED BY ATTENTION']);
          else if (!this.endCb) this.out(['READY']);
        }
        h.redraw();
        return;
      }
      if (this.endCb && !this.x) { const cb = this.endCb; this.endCb = null; cb(); return; }
      if (this.x) {   // a REXX exec is waiting in PULL for a line from the terminal
        if (aid === 'PA1') this.endExec(['IRX0920I EXEC ' + this.x.name + ' ENDED BY ATTENTION']);
        else if (aid === 'ENTER') {
          if (this.page.length >= ROWS - 1) this.page = [];
          this.out([v.cmd || '']);
          this.pump(v.cmd || '');
        }
        h.redraw();
        return;
      }
      if (aid === 'CLEAR') { this.page = []; h.redraw(); return; }
      if (aid === 'PA1') { this.out(['READY']); h.redraw(); return; }
      if (aid !== 'ENTER') { h.redraw(); return; }
      const cmd = (v.cmd || '').trim();
      if (this.page.length >= ROWS - 1) this.page = [];
      this.run(cmd, true);
    }
    run(cmd, echo) {
      const h = this.h;
      const notices = h.takeNotices();
      if (!cmd) { if (echo) this.out(['', ...notices]); else this.out(notices); h.go(this); return; }
      const r = h.tso(cmd, 'ready');
      if (r.action === 'ISPF') { if (notices.length) this.out(notices); h.enterIspf(); return; }
      if (r.action === 'LOGOFF') { h.logoff(); return; }
      if (r.action === 'SDSF') { h.stack = []; h.go(new SdsfMenu(h, true)); return; }
      if (r.action === 'EXEC') { this.out([...(echo ? [cmd] : []), ...notices]); this.exec(r.exec); h.go(this); return; }
      this.out([...(echo ? [cmd] : []), ...notices, ...r.lines, 'READY']);
      h.go(this);
    }
    /** run a REXX exec in line mode. From ISPF, done() runs after the closing *** */
    exec(x, done) {
      this.x = Object.assign({ gen: rexxRun(x.src, { arg: x.arg, user: this.h.user, prefix: this.h.prefix }) }, x);
      this.endCb = done || null;
      this.h.emit('rexx');
      this.pump();
    }
    pump(input) {
      const x = this.x;
      try {
        let r = x.gen.next(input);
        while (!r.done) {
          const y = r.value;
          if (y.say !== undefined) { this.out([y.say]); r = x.gen.next(); }
          else if (y.cmd !== undefined) { const t = this.h.tso(y.cmd, 'rexx'); this.out(t.lines); r = x.gen.next(tsoRc(t)); }
          else return;   // PULL: wait for the terminal
        }
        this.endExec([]);
      } catch (e) {
        if (!(e instanceof RexxError)) throw e;
        this.endExec(rexxErrorLines(e, x));
      }
    }
    endExec(lines) { this.x = null; this.out(this.endCb ? lines : [...lines, 'READY']); }
  }

  // ---------- ISPF -------------------------------------------------------
  class MainMenu {
    constructor(h) { this.h = h; this.name = 'ispf-main'; this.ispf = true; this.msg = ''; }
    draw(s) {
      const h = this.h;
      actionBar(s, 'Menu  Utilities  Compilers  Options  Status  Help');
      s.put(2, 27, 'ISPF Primary Option Menu', 'b');
      if (this.msg) s.put(2, 79 - this.msg.length, this.msg, 'w');
      s.put(3, 0, 'Option ===>', 'g');
      s.field(3, 12, 67, { name: 'cmd', cursor: true });
      const opts = [
        ['0', 'Settings', 'Terminal and user parameters', 'User ID . :', h.user],
        ['1', 'View', 'Display source data or listings', 'Time. . . :', hm()],
        ['2', 'Edit', 'Create or change source data', 'Terminal. :', '3278'],
        ['3', 'Utilities', 'Perform utility functions', 'Screen. . :', '1'],
        ['4', 'Foreground', 'Interactive language processing', 'Language. :', 'ENGLISH'],
        ['5', 'Batch', 'Submit job for language processing', 'Appl ID . :', 'ISR'],
        ['6', 'Command', 'Enter TSO or Workstation commands', 'TSO logon :', h.proc],
        ['7', 'Dialog Test', 'Perform dialog testing', 'TSO prefix:', h.prefix || ''],
        ['9', 'IBM Products', 'IBM program development products', 'System ID :', SYSID],
        ['10', 'SCLM', 'SW Configuration Library Manager', 'MVS acct. :', 'FB3'],
        ['11', 'Workplace', 'ISPF Object/Action Workplace', 'Release . :', 'ISPF 7.6'],
        ['M', 'More', 'Additional IBM Products'],
        ['S', 'SDSF', 'System Display and Search Facility'],
      ];
      opts.forEach((o, i) => {
        const r = 5 + i;
        s.put(r, 0, o[0], 'w');
        s.put(r, 3, o[1], 'w');
        s.put(r, 17, o[2], 't');
        if (o[3]) { s.put(r, 55, o[3], 't'); s.put(r, 67, o[4], 'w'); }
      });
      s.put(20, 5, 'Enter X to Terminate using log/list defaults', 't');
      fkeys(s, 'F1=Help      F2=Split     F3=Exit      F7=Backward  F8=Forward   F9=Swap',
        'F10=Actions  F12=Cancel');
    }
    select(o) {
      const h = this.h;
      switch (o) {
        case '1': return new EntryPanel(h, 'VIEW');
        case '2': return new EntryPanel(h, 'EDIT');
        case '3': return new UtilMenu(h);
        case '6': return new ShellView(h);
        case 'S': case 'SD': case 'SDSF': return new SdsfMenu(h);
        case 'X': h.exitIspf(); return 'exit';
        case '0': case '4': case '5': case '7': case '9': case '10': case '11': case 'M':
          return 'Option ' + o + ' not simulated';
      }
      return null;
    }
    aid(aid, v, cur, cmd) {
      if (aid !== 'ENTER' || !cmd) { this.h.redraw(); return; }
      this.h.jump(cmd);
    }
  }


  class DslistEntry {
    constructor(h) { this.h = h; this.name = 'dslist-entry'; this.ispf = true; this.msg = ''; }
    draw(s) {
      actionBar(s, 'Menu  RefList  RefMode  Utilities  Help');
      s.put(2, 28, 'Data Set List Utility', 'b');
      if (this.msg) s.put(2, 79 - this.msg.length, this.msg, 'w');
      s.put(3, 0, 'Option ===>', 'g');
      s.field(3, 12, 67, { name: 'cmd' });
      s.put(5, 3, 'blank Display data set list', 't'); s.put(5, 37, 'P  Print data set list', 't');
      s.put(6, 3, 'V     Display VTOC information', 't'); s.put(6, 37, 'PV Print VTOC information', 't');
      s.put(8, 0, 'Enter one or both of the parameters below:', 'w');
      s.put(9, 3, 'Dsname Level . . .', 't');
      s.field(9, 22, 44, { name: 'level', value: this.h.lastLevel || this.h.prefix || this.h.user, cursor: true });
      s.put(10, 3, 'Volume serial  . .', 't');
      s.field(10, 22, 6, { name: 'vol' });
      s.put(12, 0, 'Data set list options', 'w');
      s.put(13, 3, 'Initial View . . . 1  1. Volume      Enter "/" to select option', 't');
      s.put(14, 22, '2. Space       /  Confirm Data Set Delete', 't');
      s.put(16, 0, 'Tip: a level like Z85188 lists Z85188.*; you can also use * and ** patterns.', 'b');
      fkeys(s, 'F1=Help      F2=Split     F3=Exit      F7=Backward  F8=Forward   F9=Swap',
        'F10=Actions  F12=Cancel');
    }
    aid(aid, v, cur, cmd) {
      if (aid !== 'ENTER') { this.h.redraw(); return; }
      if (cmd && cmd !== 'P') { this.msg = 'Option ' + cmd + ' not simulated'; this.h.redraw(); return; }
      const level = (v.level || '').trim().toUpperCase();
      if (!level) { this.msg = 'Enter a Dsname Level'; this.h.redraw(); return; }
      this.h.lastLevel = level;
      this.h.push(new DslistView(this.h, level));
    }
  }




  class BrowseView {
    constructor(h, o) {
      this.h = h; this.name = o.name || 'browse'; this.ispf = true; this.o = o; this.lines = o.lines;
      this.top = 0; this.col = 0; this.msg = '';
    }
    get list() { return ['\u0001TOP', ...this.lines, '\u0001BOT']; }
    draw(s) {
      const L = this.list;
      head(s, this.o.title.slice(0, 50), 'Line ' + lpad(Math.max(0, this.top - 1), 8, '0') + ' Col ' + lpad(this.col + 1, 3, '0') + ' ' + lpad(this.col + 80, 3, '0'),
        { msg: this.msg, scroll: 'PAGE', label: this.o.label });
      for (let i = 0; i < 20; i++) {
        const l = L[this.top + i];
        if (l === undefined) break;
        if (l === '\u0001TOP') s.put(2 + i, 0, center(' Top of Data ', 79, '*'), 'w');
        else if (l === '\u0001BOT') s.put(2 + i, 0, center(' Bottom of Data ', 79, '*'), 'w');
        else s.put(2 + i, 0, l.slice(this.col, this.col + 80), 'g');
      }
      fkeys(s, 'F1=Help   F3=Exit   F5=Rfind  F7=Up   F8=Down   F10=Left  F11=Right F12=Cancel',
        'Commands: TOP  BOTTOM  F text (find)');
    }
    aid(aid, v, cur, cmd) {
      const h = this.h, max = Math.max(0, this.list.length - 20);
      const amt = /^\d+$/.test(cmd) ? Number(cmd) : (cmd === 'M' || cmd === 'MAX') ? 1e9 : 20;
      if (aid === 'PF7' || aid === 'PF19') this.top = Math.max(0, this.top - amt);
      else if (aid === 'PF8' || aid === 'PF20') this.top = Math.min(max, this.top + amt);
      else if (aid === 'PF10' || aid === 'PF22') this.col = Math.max(0, this.col - 40);
      else if (aid === 'PF11' || aid === 'PF23') this.col = Math.min(80, this.col + 40);
      else if (aid === 'PF5' || aid === 'PF17' || /^(F|FIND)\s+/.test(cmd)) {
        if (/^(F|FIND)\s+/.test(cmd)) this.find = cmd.replace(/^(F|FIND)\s+/, '').replace(/^'(.*)'$/, '$1');
        if (this.find) {
          const L = this.list, from = aid === 'ENTER' ? 0 : this.top;
          const i = L.findIndex((l, k) => k > from && l.toUpperCase().includes(this.find));
          if (i < 0) this.msg = '*Bottom of data reached*';
          else { this.top = Math.min(i, max); this.msg = 'CHARS \'' + this.find + '\' found'; }
        }
      } else if (cmd === 'TOP') this.top = 0;
      else if (cmd === 'BOT' || cmd === 'BOTTOM') this.top = max;
      else if (cmd && !/^\d+$|^M(AX)?$/.test(cmd)) this.msg = 'Command not simulated';
      h.redraw();
    }
  }

  class EditView {
    constructor(h, ds, mem, lines, mode) {
      this.h = h; this.name = mode === 'EDIT' ? 'edit' : 'view'; this.ispf = true;
      this.ds = ds; this.mem = mem; this.mode = mode; this.top = 0; this.msg = '';
      this.isNew = lines === null;
      // a line: { t: text, ins: inserted and still empty-able, pend: line command waiting, chg, cols, fresh }
      this.lines = (lines || ['', '', '', '', '']).map(t => ({ t, ins: lines === null }));
      this.changed = false; this.caps = true; this.focus = null;
      this.undo = []; this.hilite = 'AUTO'; this.colsTop = false; this.r0 = 2;
      this.findStr = null; this.findDir = 'NEXT'; this.chg = null; this.last = null; this.wrap = false; this.curAt = null;
      if (mode === 'VIEW' && !h.owns(ds)) this.msg = 'Read only - RACF';
      if (this.isNew) this.msg = 'New member';
      h.emit(this.name);
    }
    get full() { return this.ds + (this.mem ? '(' + this.mem + ')' : ''); }
    seq(i) { return lpad(i + 1, 6, '0'); }
    /** what the prefix area shows when no line command is waiting there */
    base(L, li) { return L.chg ? '==CHG>' : L.ins ? "''''''" : this.seq(li); }
    prefix(L, li) { const b = this.base(L, li); return L.pend ? L.pend + b.slice(L.pend.length) : b; }
    rows() {
      const R = [{ k: 'top' }];
      this.lines.forEach((L, li) => { if (L.cols) R.push({ k: 'cols' }); R.push({ k: 'line', li }); });
      R.push({ k: 'bot' });
      return R;
    }
    language() {
      if (this.hilite === 'OFF') return null;
      return this.hilite === 'AUTO' ? guessLanguage(this.lines.map(L => L.t)) : this.hilite;
    }
    draw(s) {
      const R = this.rows(), r0 = this.r0 = this.colsTop ? 3 : 2, n = 22 - r0;
      let fli = this.focus ? this.lines.indexOf(this.focus.L) : -1;
      if (fli >= 0) {
        const k = R.findIndex(r => r.k === 'line' && r.li === fli);
        if (k < this.top || k >= this.top + n) this.top = Math.max(0, k - 1);
      }
      this.top = Math.max(0, Math.min(this.top, R.length - 1));
      head(s, pad(this.mode, 10) + this.full + ' - 01.00', 'Columns 00001 00072', { msg: this.msg.slice(0, 40), cursor: fli < 0 });
      if (this.colsTop) s.put(2, 0, '=COLS> ' + RULER, 'w');
      const lang = this.language(), hl = lang ? HILITE[lang] : null;
      for (let i = 0; i < n; i++) {
        const row = R[this.top + i], r = r0 + i;
        if (!row) break;
        if (row.k === 'top') s.put(r, 0, '****** ' + center(' Top of Data ', 72, '*'), 'w');
        else if (row.k === 'bot') s.put(r, 0, '****** ' + center(' Bottom of Data ', 72, '*'), 'w');
        else if (row.k === 'cols') s.put(r, 0, '=COLS> ' + RULER, 'w');
        else {
          const li = row.li, L = this.lines[li];
          s.field(r, 0, 6, { name: 'p' + li, value: this.prefix(L, li), cls: L.pend || L.chg ? 'in pre hot' : 'in pre' });
          s.field(r, 7, 72, { name: 'd' + li, value: L.t, cls: 'in data', hl, cursor: li === fli, cursorOffset: li === fli ? Math.min(71, this.focus.col) : 0 });
        }
      }
      this.focus = null;
      fkeys(s, 'F1=Help  F3=Exit' + (this.mode === 'EDIT' ? '(save)' : '') + '  F5=Rfind  F6=Rchange  F7=Up  F8=Down  F12=Cancel',
        this.mode === 'EDIT' ? 'Cmds: SAVE SUB F C UNDO RES HILITE COLS   Line: I D R C M A B CC DD MM RR'
          : 'View mode: you can try changes but not save them. F3 to leave.');
    }
    /** the data without inserted-but-empty lines; what UNDO remembers */
    snap() { return JSON.stringify(this.lines.filter(L => !(L.ins && L.t === '')).map(L => L.t)); }
    remember(before) {
      if (this.snap() === before) return;
      this.undo.push(before);
      if (this.undo.length > 50) this.undo.shift();
      this.changed = true;
    }
    /** read what the user typed back into the model, then run the line commands */
    capture(v, cur) {
      const before = this.snap(), R = this.rows();
      for (const L of this.lines) L.fresh = false;
      // where the cursor was: FIND starts there, and Enter in an inserted line continues it
      const row = R[this.top + Math.floor(cur / COLS) - this.r0], col = cur % COLS;
      const curLine = row && row.k === 'line' ? this.lines[row.li] : null;
      this.curAt = curLine && col >= 7 ? { li: row.li, col: col - 7 } : null;
      const seen = []; let typedIns = null;
      for (const key of Object.keys(v)) {
        const m = key.match(/^d(\d+)$/), li = m ? Number(m[1]) : -1, L = this.lines[li];
        if (!L) continue;
        seen.push(L);
        // prefix area: work out what was typed over the sequence number
        const shown = this.prefix(L, li), val = pad(v['p' + li] || '', 6);
        if (val !== shown) {
          const b = this.base(L, li); let j = 0;
          while (j < 6 && val.slice(j) !== b.slice(j)) j++;
          L.pend = val.slice(0, j).replace(/'/g, '').trim().toUpperCase() || null;
        }
        const t = this.caps ? v[key].toUpperCase() : v[key];
        if (t !== L.t) {
          if (L.ins && L === curLine) typedIns = L;
          L.t = t; L.ins = false;
        }
      }
      this.runLineCmds();
      // inserted lines left blank go away again, like in ISPF
      this.lines = this.lines.filter(L => !(L.ins && L.t === '' && !L.fresh && !L.pend && seen.includes(L)));
      // typing in an inserted line and pressing Enter gives you the next one
      if (typedIns && !this.focus && !(v.cmd || '').trim() && this.lines.includes(typedIns)) {
        const next = { t: '', ins: true, fresh: true };
        this.lines.splice(this.lines.indexOf(typedIns) + 1, 0, next);
        this.focus = { L: next, col: typedIns.t.match(/^\s*/)[0].length };
      }
      if (!this.lines.length) this.lines.push({ t: '', ins: true, fresh: true });
      this.remember(before);
    }
    runLineCmds() {
      const cmds = [];
      for (const L of this.lines.filter(x => x.pend)) {
        const m = L.pend.match(/^(CC|MM|DD|RR|COLS|UC|LC|[IDRCMAB])(\d*)$/);
        if (!m) { this.msg = 'Invalid line command'; L.pend = null; continue; }
        cmds.push({ L, op: m[1], n: Math.max(1, Number(m[2] || 1)) });
      }
      if (!cmds.length) return;
      const idx = L => this.lines.indexOf(L);
      const span = (L, n) => this.lines.slice(idx(L), idx(L) + n);
      const of = op => cmds.filter(c => c.op === op);
      const done = (...cs) => { for (const c of cs) c.L.pend = null; };
      const clone = (Ls, times) => { const out = []; for (let k = 0; k < times; k++) out.push(...Ls.map(L => ({ t: L.t, ins: false }))); return out; };
      const block = op => {   // a block needs both ends; until then the command stays in the prefix area
        const b = of(op);
        if (b.length < 2) { if (b.length) this.msg = 'Block command incomplete'; return null; }
        return { cs: b.slice(0, 2), lines: this.lines.slice(idx(b[0].L), idx(b[1].L) + 1), n: Math.max(b[0].n, b[1].n) };
      };
      for (const c of [...of('UC'), ...of('LC')]) {
        for (const L of span(c.L, c.n)) L.t = c.op === 'UC' ? L.t.toUpperCase() : L.t.toLowerCase();
        done(c);
      }
      for (const c of of('COLS')) { c.L.cols = true; done(c); }
      // copy and move: a source (C, M, CC, MM) plus a destination (A = after, B = before)
      let src = null;
      const one = of('C')[0] || of('M')[0], dest = of('A')[0] || of('B')[0];
      if (one) src = { cs: [one], lines: span(one.L, one.n), move: one.op === 'M' };
      else {
        const b = block('CC') || block('MM');
        if (b) src = Object.assign(b, { move: b.cs[0].op === 'MM' });
      }
      if (src && dest) {
        if (src.move && src.lines.includes(dest.L)) { this.msg = 'Destination is inside the block'; done(dest); }
        else {
          const copies = clone(src.lines, dest.n);
          this.lines.splice(idx(dest.L) + (dest.op === 'A' ? 1 : 0), 0, ...copies);
          if (src.move) this.lines = this.lines.filter(L => !src.lines.includes(L));
          done(dest, ...src.cs);
          this.focus = { L: copies[0], col: 0 };
        }
      } else if (src || dest) this.msg = 'Move/Copy is pending';
      for (const c of of('R')) { this.lines.splice(idx(c.L) + 1, 0, ...clone([c.L], c.n)); done(c); }
      const rr = block('RR');
      if (rr) { this.lines.splice(idx(rr.cs[1].L) + 1, 0, ...clone(rr.lines, rr.n)); done(...rr.cs); }
      for (const c of of('I')) {
        const add = Array.from({ length: c.n }, () => ({ t: '', ins: true, fresh: true }));
        this.lines.splice(idx(c.L) + 1, 0, ...add);
        this.focus = { L: add[0], col: 0 };
        done(c);
      }
      for (const c of of('D')) this.lines.splice(idx(c.L), c.n);
      const dd = block('DD');
      if (dd) this.lines = this.lines.filter(L => !dd.lines.includes(L));
    }
    text() {
      const t = this.lines.filter(L => !(L.ins && L.t === '')).map(L => L.t.replace(/\s+$/, ''));
      while (t.length && t[t.length - 1] === '') t.pop();
      return t;
    }
    save() {
      if (this.mode !== 'EDIT') { this.msg = 'Not saved - VIEW mode'; return false; }
      if (!this.h.owns(this.ds)) { this.msg = 'ICH408I - not authorized'; return false; }
      this.h.writeDs(this.full, this.text());
      this.changed = false;
      this.isNew = false;
      this.h.emit('save');
      return true;
    }
    onEnd() {
      const h = this.h;
      if (this.mode === 'EDIT' && (this.changed || this.isNew) && this.text().length) {
        if (this.save()) { h.back((this.mem ? 'Member ' + this.mem : 'Data set') + ' saved'); return; }
        h.redraw();
        return;
      }
      h.back();
    }
    onCancel() { this.h.back(this.changed ? 'Changes discarded' : ''); }

    // ---- FIND and CHANGE ----
    /** split a command into words; 'quoted strings' stay together */
    words(raw) {
      const out = [], re = /'([^']*)'|"([^"]*)"|(\S+)/g; let m;
      while ((m = re.exec(raw))) out.push({ v: m[1] !== undefined ? m[1] : m[2] !== undefined ? m[2] : m[3], quoted: m[3] === undefined });
      return out;
    }
    /** next (or previous) place the string occurs, ignoring case: { li, col } or null */
    locate(str, from, back) {
      const S = str.toUpperCase();
      if (!back) {
        for (let li = Math.max(0, from.li); li < this.lines.length; li++) {
          const c = this.lines[li].t.toUpperCase().indexOf(S, li === from.li ? from.col : 0);
          if (c >= 0) return { li, col: c };
        }
        return null;
      }
      for (let li = Math.min(from.li, this.lines.length - 1); li >= 0; li--) {
        if (li === from.li && from.col < 0) continue;
        const c = this.lines[li].t.toUpperCase().lastIndexOf(S, li === from.li ? from.col : Infinity);
        if (c >= 0) return { li, col: c };
      }
      return null;
    }
    find(str, dir, repeat) {
      const q = "'" + str.toUpperCase() + "'", end = { li: this.lines.length - 1, col: Infinity };
      let hit;
      if (dir === 'ALL' || dir === 'FIRST') hit = this.locate(str, { li: 0, col: 0 });
      else if (dir === 'LAST') hit = this.locate(str, end, true);
      else {
        const back = dir === 'PREV', wrapped = this.wrap;
        this.wrap = false;
        let from;
        if (wrapped) from = back ? end : { li: 0, col: 0 };
        else {
          // start at the cursor if it is in the data, else at the top of the screen
          const firstRow = this.rows().slice(this.top).find(r => r.k === 'line');
          from = this.curAt || { li: firstRow ? firstRow.li : this.lines.length, col: 0 };
          const onLast = this.last && (repeat && !this.curAt || (this.curAt && this.curAt.li === this.last.li && this.curAt.col === this.last.col));
          if (onLast) from = { li: this.last.li, col: this.last.col + (back ? -1 : 1) };
          else if (back && !this.curAt) from = { li: from.li - 1, col: Infinity };
        }
        hit = this.locate(str, from, back);
        if (!hit && !wrapped && this.locate(str, { li: 0, col: 0 })) {
          this.wrap = true;   // the next RFIND starts again from the other end
          this.msg = back ? '*Top of data reached*' : '*Bottom of data reached*';
          return null;
        }
      }
      if (!hit) { this.msg = 'No CHARS ' + q + ' found'; return null; }
      this.last = hit;
      this.focus = { L: this.lines[hit.li], col: hit.col };
      if (dir === 'ALL') {
        const n = this.lines.reduce((a, L) => a + L.t.toUpperCase().split(str.toUpperCase()).length - 1, 0);
        this.msg = n + ' CHARS ' + q;
      } else this.msg = 'CHARS ' + q + ' found';
      return hit;
    }
    change(from, to, dir, repeat) {
      const q = "'" + from.toUpperCase() + "'", F = from.toUpperCase();
      if (this.caps) to = to.toUpperCase();
      const put = (L, col) => {
        const t = (L.t.slice(0, col) + to + L.t.slice(col + from.length)).replace(/\s+$/, '');
        if (t.length > 72) return false;
        L.t = t; L.chg = true; L.ins = false;
        return true;
      };
      if (dir === 'ALL') {
        let n = 0, tooLong = 0, first = null;
        for (const L of this.lines) {
          let col = 0, c;
          while ((c = L.t.toUpperCase().indexOf(F, col)) >= 0) {
            if (put(L, c)) { n++; col = c + to.length; first = first || { L, col: c }; } else { tooLong++; col = c + from.length; }
          }
        }
        if (first) this.focus = first;
        this.msg = !n && !tooLong ? 'No CHARS ' + q + ' found' : tooLong ? n + ' changed, ' + tooLong + ' would not fit' : 'CHARS ' + q + ' changed ' + n + ' time' + (n > 1 ? 's' : '');
        return;
      }
      const hit = this.find(from, dir, repeat);
      if (!hit) return;
      const L = this.lines[hit.li];
      if (!put(L, hit.col)) { this.msg = 'No room: line would pass column 72'; return; }
      this.last = { li: hit.li, col: hit.col + Math.max(0, to.length - 1) };
      this.focus = { L, col: hit.col + to.length };
      this.msg = 'CHARS ' + q + ' changed';
    }

    aid(aid, v, cur, cmd, raw) {
      const h = this.h, before = this.snap();
      const n = 22 - this.r0, max = Math.max(0, this.rows().length - n);
      const w = this.words(raw || cmd || ''), verb = w.length ? w[0].v.toUpperCase() : '', rest = w.slice(1);
      const up = i => (rest[i] ? rest[i].v.toUpperCase() : '');
      const amt = /^\d+$/.test(cmd) ? Number(cmd) : /^M(AX)?$/.test(cmd) ? 1e9 : n - 1;
      const dirOf = list => { const d = list.find(x => !x.quoted && /^(NEXT|PREV|FIRST|LAST|ALL)$/i.test(x.v)); return d ? d.v.toUpperCase() : 'NEXT'; };
      let undoing = false;
      if (aid === 'PF7' || aid === 'PF19') this.top = Math.max(0, this.top - amt);
      else if (aid === 'PF8' || aid === 'PF20') this.top = Math.min(max, this.top + amt);
      else if (aid === 'PF5' || aid === 'PF17' || (aid === 'ENTER' && verb === 'RFIND')) {
        if (this.findStr) this.find(this.findStr, this.findDir === 'PREV' ? 'PREV' : 'NEXT', true);
        else this.msg = 'Enter a FIND command first';
      } else if (aid === 'PF6' || aid === 'PF18' || (aid === 'ENTER' && verb === 'RCHANGE')) {
        if (this.chg) this.change(this.chg.from, this.chg.to, 'NEXT', true);
        else this.msg = 'Enter a CHANGE command first';
      } else if (aid !== 'ENTER' || !verb) { /* line commands and typing were handled in capture() */ }
      else if (verb === 'F' || verb === 'FIND') {
        if (!rest.length || !rest[0].v) this.msg = 'FIND what?  e.g.  F SYSOUT';
        else { this.findStr = rest[0].v; this.findDir = dirOf(rest.slice(1)); this.find(this.findStr, this.findDir, false); }
      } else if (verb === 'C' || verb === 'CHG' || verb === 'CHANGE') {
        if (rest.length < 2 || !rest[0].v) this.msg = 'Use:  C old new  [ALL]';
        else {
          this.chg = { from: rest[0].v, to: rest[1].v }; this.findStr = rest[0].v; this.findDir = 'NEXT';
          this.change(rest[0].v, rest[1].v, dirOf(rest.slice(2)), false);
          if (this.snap() !== before) h.emit('change');
        }
      } else if (verb === 'L' || verb === 'LOC' || verb === 'LOCATE') {
        const k = Number(up(0));
        if (!(k >= 1)) this.msg = 'Use:  L line-number';
        else this.focus = { L: this.lines[Math.min(k, this.lines.length) - 1], col: 0 };
      } else if (verb === 'SAVE') { if (this.save()) this.msg = (this.mem ? 'Member ' + this.mem : 'Data set') + ' saved'; }
      else if (verb === 'CAN' || verb === 'CANCEL') { this.onCancel(); return; }
      else if (verb === 'SUB' || verb === 'SUBMIT') {
        const m = h.submit(this.text());
        h.go(new Pager(h, [m], () => h.go(this)));
        return;
      } else if (verb === 'TOP') this.top = 0;
      else if (verb === 'BOT' || verb === 'BOTTOM') this.top = max;
      else if (verb === 'UP') this.top = Math.max(0, this.top - (Number(up(0)) || n - 1));
      else if (verb === 'DOWN') this.top = Math.min(max, this.top + (Number(up(0)) || n - 1));
      else if (verb === 'CAPS') { this.caps = up(0) !== 'OFF'; this.msg = 'CAPS ' + (this.caps ? 'ON' : 'OFF'); }
      else if (verb === 'RES' || verb === 'RESET') {
        for (const L of this.lines) { L.pend = null; L.chg = false; L.cols = false; }
        this.colsTop = false;
      } else if (verb === 'UNDO') {
        undoing = true;
        if (!this.undo.length) this.msg = 'Nothing to undo';
        else {
          this.lines = JSON.parse(this.undo.pop()).map(t => ({ t, ins: false }));
          if (!this.lines.length) this.lines.push({ t: '', ins: true, fresh: true });
          this.changed = true;
          this.msg = 'Change undone';
        }
      } else if (verb === 'HI' || verb === 'HILITE') {
        const o = up(0) || 'ON';
        if (['OFF', 'JCL', 'REXX', 'COBOL'].includes(o)) this.hilite = o;
        else if (o === 'ON' || o === 'AUTO') this.hilite = 'AUTO';
        else { this.msg = 'HILITE ON | OFF | JCL | REXX | COBOL'; h.redraw(); return; }
        this.msg = 'HILITE ' + (this.hilite === 'AUTO' ? 'ON - ' + (this.language() || 'no language found') : this.hilite);
      } else if (verb === 'COLS') this.colsTop = up(0) !== 'OFF' && !this.colsTop;
      else this.msg = 'Command not simulated';
      if (!undoing) this.remember(before);
      h.redraw();
    }
  }

  // ---------- ISPF 3.x: utilities ------------------------------------------
  const stdKeys = s => fkeys(s, 'F1=Help      F2=Split     F3=Exit      F7=Backward  F8=Forward   F9=Swap', 'F10=Actions  F12=Cancel');
  /** action bar, centred title, message, Option ===> */
  function optPanel(s, view, title, o = {}) {
    actionBar(s, o.bar || 'Menu  RefList  Utilities  Help');
    s.put(2, Math.floor((80 - title.length) / 2), title, 'b');
    if (view.msg) s.put(2, 79 - view.msg.length, view.msg, 'w');
    s.put(3, 0, 'Option ===>', 'g');
    s.field(3, 12, 67, { name: 'cmd', cursor: !!o.cursor });
  }
  /** a plain panel: title, message, Command ===> */
  function cmdPanel(s, view, title) {
    s.put(0, Math.floor((80 - title.length) / 2), title, 'b');
    if (view.msg) s.put(0, 79 - view.msg.length, view.msg, 'w');
    s.put(1, 0, 'Command ===>', 'g');
    s.field(1, 13, 66, { name: 'cmd' });
  }
  /** a data set name typed on a panel, the TSO way -> { ds, mem } (mem may be '*'), or null with view.msg set */
  function dsnField(view, raw) {
    raw = (raw || '').trim();
    if (!raw) { view.msg = 'Enter a data set name'; return null; }
    const star = /\(\*\)/.test(raw);
    const p = splitDsn(view.h.resolve(raw.replace('(*)', '')));
    if (!p) { view.msg = 'Invalid data set name'; return null; }
    if (star) p.mem = '*';
    return p;
  }
  function copyMsg(r, from, move) {
    const verb = move ? 'moved' : 'copied';
    if (!r.n) return r.skipped ? 'Not replaced - already exists' : 'Nothing ' + verb;
    if (from.mem === '*') return r.n + ' member' + (r.n > 1 ? 's ' : ' ') + verb + (r.skipped ? ', ' + r.skipped + ' not replaced' : '');
    return (from.mem ? 'Member ' + from.mem : 'Data set') + ' ' + verb;
  }

  class UtilMenu {
    constructor(h) { this.h = h; this.name = 'ispf-util'; this.ispf = true; this.msg = ''; }
    draw(s) {
      actionBar(s, 'Menu  Help');
      s.put(2, 30, 'Utility Selection Panel', 'b');
      if (this.msg) s.put(2, 79 - this.msg.length, this.msg, 'w');
      s.put(3, 0, 'Option ===>', 'g');
      s.field(3, 12, 67, { name: 'cmd', cursor: true });
      [
        ['1', 'Library', 'Compress or print data set. Print index listing.'],
        ['2', 'Data Set', 'Allocate, rename, delete, catalog, uncatalog, or display'],
        ['3', 'Move/Copy', 'Move, or copy members or data sets'],
        ['4', 'Dslist', 'Print or display (to process) list of data set names'],
        ['5', 'Reset', 'Reset statistics for members of ISPF library'],
        ['6', 'Hardcopy', 'Initiate hardcopy output'],
        ['7', 'Transfer', 'Download ISPF Client/Server or Transfer data set'],
        ['8', 'Outlist', 'Display, delete, or print held job output'],
        ['9', 'Commands', 'Create/change an application command table'],
        ['11', 'Format', 'Format definition for formatted data Edit/Browse'],
        ['12', 'SuperC', 'Compare data sets and print differences'],
        ['13', 'SuperCE', 'Compare data sets Extended'],
        ['14', 'Search-For', 'Search data sets for strings of data'],
      ].forEach((o, i) => {
        s.put(5 + i, 1, o[0], 'w'); s.put(5 + i, 4, o[1], 'w'); s.put(5 + i, 16, o[2], Number(o[0]) <= 4 ? 't' : 'b');
      });
      stdKeys(s);
    }
    select(o) {
      const h = this.h;
      switch (o) {
        case '1': return new LibUtil(h);
        case '2': return new DsUtil(h);
        case '3': return new MoveCopy(h);
        case '4': return new DslistEntry(h);
      }
      return /^\d+$/.test(o) ? 'Option 3.' + o + ' not simulated' : null;
    }
    aid(aid, v, cur, cmd) {
      if (aid !== 'ENTER' || !cmd) { this.h.redraw(); return; }
      const nx = this.select(cmd);
      if (nx && typeof nx !== 'string') this.h.push(nx);
      else { this.msg = nx || 'Invalid option'; this.h.redraw(); }
    }
  }

  class LibUtil { // ISPF 3.1
    constructor(h) { this.h = h; this.name = 'lib-util'; this.ispf = true; this.msg = ''; }
    draw(s) {
      optPanel(s, this, 'Library Utility', { cursor: true });
      [['blank', 'Display member list', 'I', 'Data set information'], ['C', 'Compress data set', 'S', 'Short data set information'],
        ['B', 'Browse member', 'D', 'Delete member'], ['E', 'Edit member', 'R', 'Rename member'], ['V', 'View member', '', '']]
        .forEach((x, i) => { s.put(5 + i, 3, x[0], 'w'); s.put(5 + i, 9, x[1], 't'); s.put(5 + i, 40, x[2], 'w'); s.put(5 + i, 42, x[3], 't'); });
      s.put(11, 0, 'Data Set:', 'w');
      s.put(12, 3, 'Name . . . . . . .', 't');
      s.field(12, 22, 56, { name: 'dsn', value: this.h.lastDsn || 'JCL' });
      s.put(13, 3, 'New member name  .', 't');
      s.field(13, 22, 8, { name: 'newname' });
      s.put(13, 33, '(only for R)', 'b');
      s.put(15, 3, 'For B, E, V, D and R name the member in parentheses:  JCL(HELLO)', 'b');
      s.put(16, 3, 'Every save of a member in a PDS leaves the old copy behind as dead space.', 'b');
      s.put(17, 3, 'C (compress) wins it back. A PDSE (type LIBRARY) reuses space by itself.', 'b');
      stdKeys(s);
    }
    aid(aid, v, cur, cmd) {
      const h = this.h, say = m => { this.msg = m; h.redraw(); };
      if (aid !== 'ENTER') { h.redraw(); return; }
      const p = dsnField(this, v.dsn);
      if (!p) { h.redraw(); return; }
      h.lastDsn = v.dsn.trim().toUpperCase();
      const d = h.catalog[p.ds];
      if (!d) { say('Data set not cataloged'); return; }
      if (cmd === 'I' || cmd === 'S') { h.push(new DsInfo(h, p.ds)); return; }
      if (d.dsorg !== 'PO') { say('Not a partitioned data set'); return; }
      if (cmd === '') { h.push(new MemberList(h, p.ds, h.owns(p.ds) ? 'EDIT' : 'BROWSE', 'LIBRARY')); return; }
      if (cmd === 'C') { say(h.compress(p.ds)); return; }
      if (!['B', 'E', 'V', 'D', 'R'].includes(cmd)) { say('Invalid option'); return; }
      if (!p.mem || p.mem === '*') { say('Member name required'); return; }
      if ('BEV'.includes(cmd)) { openData(h, p.ds, p.mem, { B: 'BROWSE', E: 'EDIT', V: 'VIEW' }[cmd], cmd === 'E'); return; }
      if (!d.members[p.mem]) { say('Member ' + p.mem + ' not found'); return; }
      if (!h.owns(p.ds)) { say('ICH408I - not authorized'); return; }
      if (cmd === 'D') { delete d.members[p.mem]; say('Member ' + p.mem + ' deleted'); return; }
      const nn = (v.newname || '').trim().toUpperCase();
      if (!MEM_RE.test(nn)) { say('Enter a valid new member name'); return; }
      if (d.members[nn]) { say('Member ' + nn + ' already exists'); return; }
      d.members[nn] = d.members[p.mem];
      delete d.members[p.mem];
      say('Member ' + p.mem + ' renamed');
    }
  }

  class DsUtil { // ISPF 3.2
    constructor(h) { this.h = h; this.name = 'ds-util'; this.ispf = true; this.msg = ''; }
    draw(s) {
      optPanel(s, this, 'Data Set Utility', { cursor: true });
      [['A', 'Allocate new data set', 'C', 'Catalog data set'], ['R', 'Rename entire data set', 'U', 'Uncatalog data set'],
        ['D', 'Delete entire data set', 'S', 'Short data set information'], ['blank', 'Data set information', 'V', 'VSAM Utilities']]
        .forEach((x, i) => { s.put(5 + i, 3, x[0], 'w'); s.put(5 + i, 9, x[1], 't'); s.put(5 + i, 40, x[2], 'w'); s.put(5 + i, 42, x[3], i < 2 || x[2] === 'V' ? 'b' : 't'); });
      s.put(10, 0, 'Data Set:', 'w');
      s.put(11, 3, 'Name . . . . . . .', 't');
      s.field(11, 22, 56, { name: 'dsn', value: this.h.lastDsn || 'MY.NEW.DATA' });
      s.put(12, 3, 'Volume Serial  . .', 't');
      s.field(12, 22, 6, { name: 'vol' });
      s.put(12, 33, '(If not cataloged, required for option "C")', 'b');
      s.put(14, 3, 'A data set has to be allocated before anything can be written to it:', 'b');
      s.put(15, 3, 'its size and record layout are fixed up front. Type A and a new name.', 'b');
      s.put(16, 3, 'Unquoted names get your prefix (' + (this.h.prefix || 'none') + '.) in front.', 'b');
      stdKeys(s);
    }
    aid(aid, v, cur, cmd) {
      const h = this.h, say = m => { this.msg = m; h.redraw(); };
      if (aid !== 'ENTER') { h.redraw(); return; }
      const p = dsnField(this, v.dsn);
      if (!p) { h.redraw(); return; }
      if (p.mem) { say('Member name not allowed here'); return; }
      h.lastDsn = v.dsn.trim().toUpperCase();
      const exists = !!h.catalog[p.ds];
      if (cmd === 'A') {
        if (exists) { say('Data set already cataloged'); return; }
        if (!h.owns(p.ds)) { h.log(h.racf(p.ds, 'ALTER')); say('ICH408I - not authorized'); return; }
        h.push(new AllocPanel(h, p.ds));
        return;
      }
      if ('CUV'.includes(cmd) && cmd) { say('Option ' + cmd + ' not simulated'); return; }
      if (!['', 'S', 'R', 'D'].includes(cmd)) { say('Invalid option'); return; }
      if (!exists) { say('Data set not cataloged'); return; }
      if (cmd === 'R') h.push(new RenamePanel(h, p.ds, nn => { h.lastDsn = "'" + nn + "'"; }));
      else if (cmd === 'D') h.push(new ConfirmDelete(h, p.ds));
      else h.push(new DsInfo(h, p.ds));
    }
  }

  const ALLOC_DEFAULTS = { vol: '', unit: 'TRKS', pri: '1', sec: '1', dir: '0', recfm: 'FB', lrecl: '80', blk: '27920', type: '' };
  class AllocPanel { // ISPF 3.2 option A
    constructor(h, dsn, after) {
      this.h = h; this.name = 'alloc-new'; this.ispf = true; this.msg = ''; this.dsn = dsn; this.after = after;
      this.val = Object.assign({}, ALLOC_DEFAULTS, h.lastAlloc);
    }
    draw(s) {
      cmdPanel(s, this, 'Allocate New Data Set');
      s.put(3, 0, 'Data Set Name  . . . :', 't'); s.put(3, 23, this.dsn, 'w');
      [
        ['Management class . . .', null, 0, '(Blank for default management class)'],
        ['Storage class  . . . .', null, 0, '(Blank for default storage class)'],
        [' Volume serial . . . .', 'vol', 6, '(Blank for system default volume)'],
        ['Data class . . . . . .', null, 0, '(Blank for default data class)'],
        [' Space units . . . . .', 'unit', 10, '(BLKS, TRKS, CYLS, KB, MB, BYTES or RECORDS)'],
        [' Primary quantity  . .', 'pri', 6, '(In above units)'],
        [' Secondary quantity  .', 'sec', 6, '(In above units; added when it fills up)'],
        [' Directory blocks  . .', 'dir', 6, '(Zero for sequential data set)'],
        [' Record format . . . .', 'recfm', 5, '(FB, VB, FBA, VBA, F, V or U)'],
        [' Record length . . . .', 'lrecl', 5, ''],
        [' Block size  . . . . .', 'blk', 5, '(0 lets the system choose)'],
        [' Data set name type  .', 'type', 8, '(LIBRARY, PDS, LARGE, BASIC or blank)'],
      ].forEach((f, i) => {
        s.put(5 + i, 0, f[0], 't');
        if (f[1]) s.field(5 + i, 23, f[2], { name: f[1], value: this.val[f[1]], cursor: f[1] === 'unit' });
        s.put(5 + i, 35, f[3], 'b');
      });
      s.put(18, 0, 'Directory blocks above zero, or type PDS or LIBRARY, make it partitioned', 'b');
      s.put(19, 0, '(a data set with members). Otherwise it is one sequential file.', 'b');
      fkeys(s, 'Enter=Allocate   F1=Help   F3=Cancel   F12=Cancel');
    }
    aid(aid, v) {
      const h = this.h, bad = m => { this.msg = m; h.redraw(); };
      for (const k of Object.keys(ALLOC_DEFAULTS)) this.val[k] = (v[k] || '').trim().toUpperCase();
      if (aid !== 'ENTER') { h.redraw(); return; }
      const f = this.val, int = x => (/^\d+$/.test(x) ? Number(x) : NaN);
      const unit = ['TRKS', 'CYLS', 'BLKS', 'KB', 'MB', 'BYTES', 'RECORDS'].find(u => f.unit && (u.startsWith(f.unit) || f.unit.startsWith(u.replace(/S$/, ''))));
      const pri = int(f.pri), sec = int(f.sec || '0'), dir = int(f.dir || '0'), lrecl = int(f.lrecl), blk = int(f.blk || '0');
      if (f.vol && !/^ZSPK0[1-3]$/.test(f.vol)) { bad('Volume ' + f.vol + ' not mounted'); return; }
      if (!unit) { bad('Invalid space units'); return; }
      if (!(pri >= 1)) { bad('Primary quantity must be > 0'); return; }
      if (isNaN(sec) || isNaN(dir)) { bad('Enter numeric quantities'); return; }
      if (!/^(FB|VB|FBA|VBA|F|V|U)$/.test(f.recfm)) { bad('Invalid record format'); return; }
      if (!(lrecl >= 1 && lrecl <= 32760) && f.recfm !== 'U') { bad('Record length 1 - 32760'); return; }
      if (!['', 'PDS', 'LIBRARY', 'LARGE', 'BASIC'].includes(f.type)) { bad('Invalid data set name type'); return; }
      if (f.recfm[0] === 'F' && blk && blk % lrecl) { bad('Block size not multiple of ' + lrecl); return; }
      if (f.recfm[0] === 'V' && blk && blk < lrecl + 4) { bad('Block size must be >= LRECL+4'); return; }
      if (f.type === 'PDS' && !dir) { bad('PDS needs directory blocks'); return; }
      if (dir && (f.type === 'LARGE' || f.type === 'BASIC')) { bad('Directory blocks: use type PDS'); return; }
      const po = dir > 0 || f.type === 'PDS' || f.type === 'LIBRARY';
      const o = { dsorg: po ? 'PO' : 'PS', recfm: f.recfm, lrecl: f.recfm === 'U' ? 0 : lrecl, space: { unit, pri, sec, dir } };
      if (blk) o.blksize = blk;
      if (f.vol) o.vol = f.vol;
      if (po) o.dsntype = f.type === 'LIBRARY' ? 'LIBRARY' : 'PDS';
      h.newDs(this.dsn, o);
      h.lastAlloc = Object.assign({}, f, { vol: '' });
      h.emit('alloc');
      if (this.after) this.after();
      else h.back('Data set allocated');
    }
  }

  class DsInfo { // ISPF 3.2 blank, 3.4 "I"
    constructor(h, dsn) { this.h = h; this.name = 'ds-info'; this.ispf = true; this.msg = ''; this.dsn = dsn; }
    draw(s) {
      const d = this.h.catalog[this.dsn];
      cmdPanel(s, this, 'Data Set Information');
      s.put(3, 0, 'Data Set Name . . . . :', 't'); s.put(3, 24, this.dsn, 'w');
      if (!d) { s.put(5, 0, 'The data set is no longer cataloged.', 'r'); return; }
      const sp = d.space || { unit: 'TRKS', pri: 5, sec: 1, dir: d.dsorg === 'PO' ? 10 : 0 };
      const unit = { TRKS: 'tracks', CYLS: 'cylinders', BLKS: 'blocks' }[sp.unit] || sp.unit;
      const lab = t => { let x = t + ' '; while (x.length < 22) x += x.length % 2 ? ' ' : '.'; return x + ':'; };
      const recs = d.dsorg === 'PO' ? Object.values(d.members).reduce((a, m) => a + m.lines.length, 0) : d.lines.length;
      const used = Math.max(1, Math.ceil((recs + (d.gas || 0)) / 60)), mems = d.dsorg === 'PO' ? Object.keys(d.members).length : 0;
      const pdse = d.dsntype === 'LIBRARY';
      const L = [
        ['General Data', null],
        [' Management class . . :', 'STANDARD'], [' Storage class  . . . :', 'STANDARD'],
        ['  Volume serial . . . :', d.vol], ['  Device type . . . . :', '3390'],
        [' Data class . . . . . :', '**None**'],
        ['  Organization  . . . :', d.dsorg], ['  Record format . . . :', d.recfm], ['  Record length . . . :', d.lrecl],
        ['  Block size  . . . . :', blksize(d)], [lab('  1st extent ' + unit), sp.pri], [lab('  Secondary ' + unit), sp.sec],
        ['  Data set name type  :', d.dsorg === 'PO' ? (pdse ? 'LIBRARY' : 'PDS') : (d.dsntype || '')],
      ];
      const R = [
        ['Current Allocation', null],
        [lab(' Allocated ' + unit), Math.max(sp.pri, used)], [' Allocated extents  . :', used > sp.pri ? 2 : 1],
        ...(d.dsorg === 'PO' ? [[' Maximum dir. blocks  :', pdse ? 'NOLIMIT' : sp.dir || 10]] : []),
        ['', null],
        ['Current Utilization', null],
        [lab(' Used ' + unit), used], [' Used extents . . . . :', 1],
        ...(d.dsorg === 'PO' ? [[' Used dir. blocks . . :', Math.max(1, Math.ceil(mems / 6))], [' Number of members  . :', mems]] : []),
        ['', null],
        ['Dates', null],
        [' Creation date  . . . :', d.created || '2026/09/01'], [' Referenced date  . . :', isoDate()], [' Expiration date  . . :', '***None***'],
      ];
      L.forEach((x, i) => { s.put(5 + i, 0, x[0], x[1] === null ? 'w' : 't'); if (x[1] !== null) s.put(5 + i, 24, String(x[1]), 'w'); });
      R.forEach((x, i) => { s.put(5 + i, 40, x[0], x[1] === null ? 'w' : 't'); if (x[1] !== null) s.put(5 + i, 64, String(x[1]), 'w'); });
      if (d.dsorg === 'PO' && !pdse && d.gas) s.put(20, 0, 'Used space includes ' + d.gas + ' dead records from replaced members: compress (3.1 C, or Z).', 'y');
      fkeys(s, 'F1=Help   F3=Exit   F12=Cancel');
    }
    aid() { this.h.back(); }
  }

  class RenamePanel { // ISPF 3.2 option R
    constructor(h, dsn, done) { this.h = h; this.name = 'rename-ds'; this.ispf = true; this.msg = ''; this.dsn = dsn; this.done = done; }
    draw(s) {
      cmdPanel(s, this, 'Rename Data Set');
      s.put(3, 0, 'Data Set Name . . :', 't'); s.put(3, 20, this.dsn, 'w');
      s.put(4, 0, 'Volume Serial . . :', 't'); s.put(4, 20, (this.h.catalog[this.dsn] || {}).vol || '', 'w');
      s.put(6, 0, 'Enter new name below:', 'w');
      s.put(8, 3, 'Data Set Name . .', 't');
      s.field(8, 21, 56, { name: 'dsn', value: "'" + this.dsn + "'", cursor: true });
      s.put(10, 3, 'The data stays where it is on disk; only the catalog entry changes.', 'b');
      s.put(11, 3, 'The first qualifier decides who owns it, so RACF checks the new name too.', 'b');
      fkeys(s, 'Enter=Rename   F1=Help   F3=Cancel   F12=Cancel');
    }
    aid(aid, v) {
      const h = this.h;
      if (aid !== 'ENTER') { h.redraw(); return; }
      const p = dsnField(this, v.dsn);
      if (p) {
        const err = p.mem ? 'Member name not allowed here' : h.renameDs(this.dsn, p.ds);
        if (!err) { if (this.done) this.done(p.ds); h.back('Data set renamed'); return; }
        this.msg = err;
      }
      h.redraw();
    }
  }

  class ConfirmDelete { // ISPF 3.2 option D, DSLIST "D"
    constructor(h, dsn, done) { this.h = h; this.name = 'confirm-del'; this.ispf = true; this.msg = ''; this.dsn = dsn; this.done = done; }
    draw(s) {
      const d = this.h.catalog[this.dsn] || {};
      cmdPanel(s, this, 'Confirm Delete');
      s.put(3, 0, 'The data set listed below will be deleted. There is no recycle bin.', 'y');
      s.put(5, 0, 'Data Set Name . :', 't'); s.put(5, 18, this.dsn, 'w');
      s.put(6, 0, 'Volume  . . . . :', 't'); s.put(6, 18, d.vol || '', 'w');
      s.put(7, 0, 'Creation date . :', 't'); s.put(7, 18, d.created || '2026/09/01', 'w');
      if (d.dsorg === 'PO') { s.put(8, 0, 'Members . . . . :', 't'); s.put(8, 18, String(Object.keys(d.members).length), 'w'); }
      s.put(11, 0, 'Instructions:', 'w');
      s.put(13, 3, 'Press ENTER to confirm delete.', 't');
      s.put(14, 3, 'Press CANCEL or END (F3) to cancel delete.', 't');
      fkeys(s, 'Enter=Delete   F3=Cancel   F12=Cancel');
    }
    end(err) { if (this.done) this.done(err); this.h.back(err || 'Data set deleted'); }
    onEnd() { this.end('Data set not deleted'); }
    aid(aid, v, cur, cmd) {
      if (aid !== 'ENTER') { this.h.redraw(); return; }
      if (cmd === 'CANCEL' || cmd === 'CAN') { this.onEnd(); return; }
      this.end(this.h.deleteDs(this.dsn));
    }
  }

  class MoveCopy { // ISPF 3.3: the "From" panel
    constructor(h) { this.h = h; this.name = 'movecopy'; this.ispf = true; this.msg = ''; }
    draw(s) {
      optPanel(s, this, 'Move/Copy Utility', { cursor: true });
      s.put(5, 3, 'C', 'w'); s.put(5, 7, 'Copy data set or member(s)', 't'); s.put(5, 40, 'CP', 'w'); s.put(5, 43, 'Copy and print', 'b');
      s.put(6, 3, 'M', 'w'); s.put(6, 7, 'Move data set or member(s)', 't'); s.put(6, 40, 'MP', 'w'); s.put(6, 43, 'Move and print', 'b');
      s.put(8, 0, 'Specify "From" Data Set below, then press Enter key', 'w');
      s.put(10, 0, 'From Data Set:', 'w');
      s.put(11, 3, 'Name . . . . . . .', 't');
      s.field(11, 22, 56, { name: 'dsn', value: this.h.lastFrom || 'JCL(HELLO)' });
      s.put(13, 3, 'JCL(HELLO)  one member        JCL(*)  every member', 'b');
      s.put(14, 3, 'DATA        a whole sequential data set', 'b');
      s.put(15, 3, 'Move is copy followed by deleting the original.', 'b');
      stdKeys(s);
    }
    aid(aid, v, cur, cmd) {
      const h = this.h, say = m => { this.msg = m; h.redraw(); };
      if (aid !== 'ENTER') { h.redraw(); return; }
      if (cmd === 'CP' || cmd === 'MP') { say('Print options not simulated'); return; }
      if (cmd !== 'C' && cmd !== 'M') { say('Enter option C or M'); return; }
      const p = dsnField(this, v.dsn);
      if (!p) { h.redraw(); return; }
      const d = h.catalog[p.ds];
      if (!d) { say('Data set not cataloged'); return; }
      if (d.dsorg === 'PO' && !p.mem) { say('Add (MEMBER) or (*) to the name'); return; }
      if (d.dsorg !== 'PO' && p.mem) { say('Data set is not partitioned'); return; }
      if (d.dsorg === 'PO' && p.mem !== '*' && !d.members[p.mem]) { say('Member ' + p.mem + ' not found'); return; }
      h.lastFrom = v.dsn.trim().toUpperCase();
      h.push(new MoveCopyTo(h, cmd === 'M', p, this));
    }
  }

  class MoveCopyTo { // ISPF 3.3: the "To" panel (also behind CO/MO in DSLIST and C/M in member lists)
    constructor(h, move, from, origin, done) {
      this.h = h; this.name = 'movecopy-to'; this.ispf = true; this.msg = '';
      this.move = move; this.from = from; this.origin = origin; this.done = done;
    }
    draw(s) {
      s.put(0, 0, pad(this.move ? 'MOVE' : 'COPY', 10) + 'From ' + fullName(this.from), 'b');
      if (this.msg) s.put(0, 79 - this.msg.length, this.msg, 'w');
      s.put(1, 0, 'Command ===>', 'g');
      s.field(1, 13, 66, { name: 'cmd' });
      s.put(3, 0, 'Specify "To" Data Set Below', 'w');
      s.put(5, 0, 'To Data Set:', 'w');
      s.put(6, 3, 'Name . . . . . . .', 't');
      s.field(6, 22, 56, { name: 'dsn', value: this.h.lastTo || '', cursor: true });
      s.put(8, 0, 'Options:', 'w');
      s.field(9, 3, 1, { name: 'rep' });
      s.put(9, 5, 'Replace like-named members    (type / to select)', 't');
      s.put(11, 3, 'To give the copy another member name, add it:  JCL(HELLO2)', 'b');
      s.put(12, 3, 'If the "To" data set does not exist you are asked whether to allocate it.', 'b');
      fkeys(s, 'Enter=' + (this.move ? 'Move' : 'Copy') + '   F1=Help   F3=Cancel   F12=Cancel');
    }
    aid(aid, v) {
      const h = this.h;
      if (aid !== 'ENTER') { h.redraw(); return; }
      const p = dsnField(this, v.dsn);
      if (!p) { h.redraw(); return; }
      if (p.mem === '*') { this.msg = 'Use a member name, not *'; h.redraw(); return; }
      h.lastTo = v.dsn.trim().toUpperCase();
      const o = { move: this.move, replace: !!(v.rep || '').trim() };
      if (h.catalog[p.ds]) { this.finish(p, o); return; }
      if (!h.owns(p.ds)) { h.log(h.racf(p.ds, 'ALTER')); this.msg = 'ICH408I - not authorized'; h.redraw(); return; }
      h.push(new AllocLike(h, this.from.ds, p.ds, !!p.mem, () => this.finish(p, o)));
    }
    finish(to, o) {
      const h = this.h, r = h.copy(this.from, to, o);
      if (r.err) { h.returnTo(this, r.err); return; }
      if (!r.n) { h.returnTo(this, copyMsg(r, this.from, this.move)); return; }   // stay here: the user may want "replace"
      if (this.done) this.done(r);
      h.returnTo(this.origin, copyMsg(r, this.from, this.move));
    }
  }

  class AllocLike { // "Allocate Target Data Set": the To data set of a copy does not exist yet
    constructor(h, like, dsn, needPds, after) {
      this.h = h; this.name = 'alloc-like'; this.ispf = true; this.msg = '';
      this.like = like; this.dsn = dsn; this.needPds = needPds; this.after = after;
    }
    draw(s) {
      cmdPanel(s, this, 'Allocate Target Data Set');
      s.put(3, 0, 'Specified data set', 't'); s.put(3, 19, this.dsn, 'w');
      s.put(4, 0, 'does not exist. If you wish to allocate it, select one of the options below.', 't');
      s.put(6, 0, 'Allocation Options:', 'w');
      s.field(6, 20, 1, { name: 'opt', value: '1', cursor: true });
      s.put(7, 3, '1. Allocate using the attributes of:', 't');
      s.put(8, 6, this.like, 'w');
      s.put(9, 3, '2. Specify allocation attributes', 't');
      s.put(12, 0, 'Instructions:', 'w');
      s.put(13, 3, 'Press ENTER to continue.', 't');
      s.put(14, 3, 'Press CANCEL or END (F3) to cancel the copy.', 't');
      fkeys(s, 'Enter=Continue   F3=Cancel   F12=Cancel');
    }
    onEnd() { this.h.back('Cancelled - nothing copied'); }
    aid(aid, v, cur, cmd) {
      const h = this.h;
      if (aid !== 'ENTER') { h.redraw(); return; }
      if (cmd === 'CANCEL' || cmd === 'CAN') { this.onEnd(); return; }
      const opt = (v.opt || '').trim();
      if (opt === '2') { h.go(new AllocPanel(h, this.dsn, this.after)); return; }
      if (opt !== '1') { this.msg = 'Enter 1 or 2'; h.redraw(); return; }
      const d = h.catalog[this.like], o = { dsorg: d.dsorg, recfm: d.recfm, lrecl: d.lrecl };
      for (const k of ['space', 'blksize', 'dsntype']) if (d[k]) o[k] = d[k];
      if (this.needPds && o.dsorg !== 'PO') Object.assign(o, { dsorg: 'PO', dsntype: 'PDS', space: { unit: 'TRKS', pri: 5, sec: 1, dir: 10 } });
      h.newDs(this.dsn, o);
      h.emit('alloc');
      this.after();
    }
  }

  class DslistView { // ISPF 3.4
    constructor(h, level) {
      this.h = h; this.name = 'dslist'; this.ispf = true; this.level = level; this.top = 0; this.rowMsg = {}; this.msg = ''; this.attrs = false;
      this.refresh();
      h.emit('dslist');
    }
    refresh() { this.items = this.h.listLevel(this.level); }
    draw(s) {
      const n = this.items.length;
      head(s, 'DSLIST - Data Sets Matching ' + this.level, n ? 'Row ' + (this.top + 1) + ' of ' + n : 'No data sets', { msg: this.msg, scroll: 'PAGE' });
      s.put(3, 0, 'Command - Enter "/" to select action', 'w');
      if (this.attrs) s.put(3, 55, 'Dsorg Recfm Lrecl Blksz', 'w');
      else { s.put(3, 54, 'Message', 'w'); s.put(3, 72, 'Volume', 'w'); }
      s.put(4, 0, '-'.repeat(79), 'b');
      const vis = this.items.slice(this.top, this.top + 16);
      vis.forEach((name, i) => {
        const r = 5 + i, idx = this.top + i, d = this.h.catalog[name];
        s.field(r, 1, 8, { name: 'lc' + idx, cursor: i === 0 });
        s.put(r, 10, name, d ? 't' : 'b');
        if (this.attrs && d) s.put(r, 55, ' ' + pad(d.dsorg, 6) + pad(d.recfm, 5) + lpad(d.lrecl, 5) + lpad(blksize(d), 6), 't');
        else {
          if (this.rowMsg[name]) s.put(r, 54, this.rowMsg[name].slice(0, 17), 'w');
          s.put(r, 72, d ? d.vol : '', 't');
        }
      });
      if (this.top + 16 >= n) s.put(5 + vis.length, 0, center(' End of Data Set list ', 79, '*'), 'b');
      s.put(22, 1, 'Line commands: B E V M=members I=info D=delete R=rename CO=copy MO=move Z', 't');
      s.put(23, 1, 'F3=Exit  F7=Up  F8=Down  F11=' + (this.attrs ? 'Volume view' : 'Attributes') + '   Command: REFRESH', 't');
    }
    aid(aid, v, cur, cmd) {
      const h = this.h;
      if (aid === 'PF7' || aid === 'PF19') { this.top = Math.max(0, this.top - 16); h.redraw(); return; }
      if (aid === 'PF8' || aid === 'PF20') { if (this.top + 16 < this.items.length) this.top += 16; h.redraw(); return; }
      if (/^PF(10|11|22|23)$/.test(aid)) { this.attrs = !this.attrs; h.redraw(); return; }
      if (cmd === 'REFRESH' || cmd === 'REF') { this.refresh(); this.rowMsg = {}; this.top = 0; this.msg = 'List refreshed'; h.redraw(); return; }
      if (cmd) { this.msg = 'Command not simulated'; h.redraw(); return; }
      let nav = null;   // a command that opens another panel; only the first one runs
      for (const k of Object.keys(v).filter(x => x.startsWith('lc') && v[x].trim())) {
        const idx = Number(k.slice(2)), name = this.items[idx], d = h.catalog[name];
        const c = v[k].trim().toUpperCase();
        if (!d) { if (name) this.rowMsg[name] = 'Not cataloged'; continue; }
        if (c === 'S') this.rowMsg[name] = d.dsorg + ' ' + d.recfm + ' ' + d.lrecl;
        else if (c === 'Z') this.rowMsg[name] = d.dsorg === 'PO' ? h.compress(name).slice(0, 17) : 'Not a PDS';
        else if (c === '/') this.rowMsg[name] = 'B E V M I D R CO MO';
        else if (c === 'C' || c === 'U' || c === 'X' || c === 'P') this.rowMsg[name] = 'Not simulated';
        else if (!['B', 'E', 'V', 'M', 'I', 'D', 'R', 'CO', 'MO'].includes(c)) this.rowMsg[name] = 'Invalid command';
        else if (nav) this.rowMsg[name] = 'Not done yet';
        else nav = { name, d, c, idx };
      }
      if (!nav) { h.redraw(); return; }
      const { name, d, c, idx } = nav;
      if (c === 'I') { this.rowMsg[name] = 'Info'; h.push(new DsInfo(h, name)); return; }
      if (c === 'D') { h.push(new ConfirmDelete(h, name, err => { this.rowMsg[name] = err ? 'Not deleted' : 'Deleted'; })); return; }
      if (c === 'R') { h.push(new RenamePanel(h, name, nn => { this.items[idx] = nn; this.rowMsg[nn] = 'Renamed'; })); return; }
      if (c === 'CO' || c === 'MO') {
        h.push(new MoveCopyTo(h, c === 'MO', { ds: name, mem: d.dsorg === 'PO' ? '*' : null }, this,
          r => { this.rowMsg[name] = r.n ? (c === 'MO' ? 'Moved' : 'Copied') : 'Not replaced'; }));
        return;
      }
      const mode = { B: 'BROWSE', M: 'BROWSE', E: 'EDIT', V: 'VIEW' }[c];
      this.rowMsg[name] = { BROWSE: 'Browsed', EDIT: 'Edited', VIEW: 'Viewed' }[mode];
      if (d.dsorg === 'PO') h.push(new MemberList(h, name, c === 'M' && h.owns(name) ? 'EDIT' : mode, c === 'M' ? 'DSLIST' : null));
      else openData(h, name, null, mode);
    }
  }

  /** open a data set / member in BROWSE, VIEW or EDIT */
  function openData(h, ds, mem, mode, newOk) {
    const full = ds + (mem ? '(' + mem + ')' : ''), d = h.catalog[ds];
    const say = m => { h.view.msg = m; h.redraw(); };
    let lines;
    const r = h.readDs(full);
    if (r.err) {
      if (newOk && mem && mode === 'EDIT' && d && d.dsorg === 'PO' && !d.members[mem]) lines = null;
      else { say(r.err.toLowerCase().replace(/^\w/, c => c.toUpperCase()).slice(0, 40)); return; }
    } else lines = r.lines;
    if (mem && d.members[mem] && d.members[mem].load && mode !== 'BROWSE') { say('Load module: browse only'); return; }
    if (mode === 'EDIT' && !h.owns(ds)) { mode = 'VIEW'; }
    if (mode === 'BROWSE') { h.push(new BrowseView(h, { title: 'BROWSE    ' + full, lines })); h.emit('browse'); }
    else h.push(new EditView(h, ds, mem, lines, mode));
  }

  class MemberList {
    constructor(h, ds, mode, label) {
      this.h = h; this.name = 'memlist'; this.ispf = true; this.ds = ds; this.mode = mode; this.label = label || mode;
      this.top = 0; this.rowMsg = {}; this.msg = '';
    }
    get members() { const d = this.h.catalog[this.ds]; return d && d.members ? Object.keys(d.members).sort() : []; }
    draw(s) {
      const ms = this.members, d = this.h.catalog[this.ds];
      head(s, pad(this.label, 10) + this.ds, 'Row ' + lpad(Math.min(this.top + 1, ms.length), 5, '0') + ' of ' + lpad(ms.length, 5, '0'), { msg: this.msg });
      s.put(3, 3, 'Name     Prompt       Size  Created     Changed             ID', 'w');
      ms.slice(this.top, this.top + 17).forEach((m, i) => {
        const r = 4 + i, st = d.members[m], idx = this.top + i;
        s.field(r, 0, 2, { name: 'lc' + idx, cursor: i === 0 });
        s.put(r, 3, m, 't');
        s.field(r, 12, 8, { name: 'pr' + idx });
        if (this.rowMsg[m]) s.put(r, 72, this.rowMsg[m].slice(0, 7), 'w');
        s.put(r, 24, lpad(st.lines.length, 5), 't');
        s.put(r, 31, st.created, 't');
        s.put(r, 43, st.changed, 't');
        s.put(r, 63, st.id, 't');
      });
      if (this.top + 17 >= ms.length) s.put(4 + Math.max(0, Math.min(17, ms.length - this.top)), 2, '**End**', 'b');
      s.put(22, 1, 'S=' + this.mode.toLowerCase() + ' B E V D=delete R=rename(name in Prompt) C=copy M=move J=submit', 't');
      s.put(23, 1, 'F3=Exit  F7=Up  F8=Down    New member: type  S NEWNAME  on the command line', 't');
    }
    aid(aid, v, cur, cmd) {
      const h = this.h, ms = this.members, d = h.catalog[this.ds];
      if (aid === 'PF7' || aid === 'PF19') { this.top = Math.max(0, this.top - 17); h.redraw(); return; }
      if (aid === 'PF8' || aid === 'PF20') { if (this.top + 17 < ms.length) this.top += 17; h.redraw(); return; }
      if (!d) { h.back('Data set not cataloged'); return; }
      const m = cmd.match(/^(?:S|SEL|SELECT)?\s*([A-Z#$@][A-Z0-9#$@]{0,7})$/);
      if (cmd && m) { openData(h, this.ds, m[1], this.mode, true); return; }
      if (cmd) { this.msg = 'Invalid command'; h.redraw(); return; }
      for (const k of Object.keys(v).filter(x => x.startsWith('lc') && v[x].trim())) {
        const idx = Number(k.slice(2)), mem = ms[idx], c = v[k].trim().toUpperCase();
        if (!mem) continue;
        if (c === 'J') {
          this.msg = h.submit(d.members[mem].lines).replace(/^IKJ56250I /, '');
          this.rowMsg[mem] = 'Submit';
          continue;
        }
        if (c === 'D' || c === 'R') {
          if (!h.owns(this.ds)) { h.log(h.racf(this.ds, 'UPDATE')); this.msg = 'ICH408I - not authorized'; continue; }
          if (c === 'D') { delete d.members[mem]; this.msg = 'Member ' + mem + ' deleted'; continue; }
          const nn = (v['pr' + idx] || '').trim().toUpperCase();
          if (!nn || nn.startsWith('*')) { this.msg = 'Type the new name under Prompt'; this.rowMsg[mem] = ''; continue; }
          if (!MEM_RE.test(nn)) { this.msg = 'Invalid member name'; continue; }
          if (d.members[nn]) { this.msg = 'Member ' + nn + ' already exists'; continue; }
          d.members[nn] = d.members[mem];
          delete d.members[mem];
          delete this.rowMsg[mem];
          this.rowMsg[nn] = 'Renamed';
          continue;
        }
        if (c === 'C' || c === 'M') {
          h.push(new MoveCopyTo(h, c === 'M', { ds: this.ds, mem }, this, r => { if (c === 'C' && r.n) this.rowMsg[mem] = 'Copied'; }));
          return;
        }
        const mode = { S: this.mode, B: 'BROWSE', E: 'EDIT', V: 'VIEW' }[c];
        if (!mode) { this.rowMsg[mem] = 'Invalid'; continue; }
        this.rowMsg[mem] = { BROWSE: 'Browsed', EDIT: 'Edited', VIEW: 'Viewed' }[mode];
        openData(h, this.ds, mem, mode);
        return;
      }
      h.redraw();
    }
  }

  class EntryPanel { // ISPF 1 (View) and 2 (Edit) entry panel
    constructor(h, mode) { this.h = h; this.mode = mode; this.name = 'entry'; this.ispf = true; this.msg = ''; }
    draw(s) {
      const t = this.mode === 'EDIT' ? 'Edit Entry Panel' : 'View Entry Panel';
      actionBar(s, 'Menu  RefList  RefMode  Utilities  Workstation  Help');
      s.put(2, 31, t, 'b');
      if (this.msg) s.put(2, 79 - this.msg.length, this.msg, 'w');
      s.put(3, 0, 'Command ===>', 'g');
      s.field(3, 13, 66, { name: 'cmd' });
      s.put(5, 0, 'ISPF Library:', 'w');
      s.put(6, 3, 'Project . . .  (not simulated - use the data set name below)', 'b');
      s.put(10, 0, 'Other Partitioned or Sequential Data Set:', 'w');
      s.put(11, 3, 'Name . . . . . . .', 't');
      s.field(11, 22, 56, { name: 'dsn', value: "'" + this.h.user + ".JCL(HELLO)'", cursor: true });
      s.put(13, 3, 'Quote the name to use it as is. Unquoted names get your TSO prefix', 'b');
      s.put(14, 3, '(' + this.h.prefix + '.) in front. Leave out (MEMBER) to get a member list.', 'b');
      fkeys(s, 'F1=Help      F2=Split     F3=Exit      F7=Backward  F8=Forward   F9=Swap',
        'F10=Actions  F12=Cancel');
    }
    aid(aid, v) {
      const h = this.h;
      if (aid !== 'ENTER') { h.redraw(); return; }
      const raw = (v.dsn || '').trim();
      if (!raw) { this.msg = 'Enter a data set name'; h.redraw(); return; }
      const p = splitDsn(h.resolve(raw));
      if (!p) { this.msg = 'Invalid data set name'; h.redraw(); return; }
      const d = h.catalog[p.ds];
      if (!d) { this.msg = 'Data set not cataloged'; h.redraw(); return; }
      if (d.dsorg === 'PO' && !p.mem) { h.push(new MemberList(h, p.ds, this.mode)); return; }
      openData(h, p.ds, p.mem, this.mode, true);
    }
  }

  class ShellView { // ISPF option 6
    constructor(h) { this.h = h; this.name = 'shell'; this.ispf = true; this.msg = ''; this.pending = ''; }
    draw(s) {
      actionBar(s, 'Menu  List  Mode  Functions  Utilities  Help');
      s.put(2, 30, 'ISPF Command Shell', 'b');
      if (this.msg) s.put(2, 79 - this.msg.length, this.msg, 'w');
      s.put(3, 0, 'Enter TSO or Workstation commands below:', 'w');
      s.put(5, 0, '===>', 'g');
      s.field(5, 5, 74, { name: 'cmd', value: this.pending, cursor: true });
      this.pending = '';
      s.put(7, 0, 'Place cursor on choice and press enter to Retrieve command', 'w');
      this.h.cmdHistory.slice(0, 12).forEach((c, i) => s.put(9 + i, 0, '=> ' + c, 't'));
      fkeys(s, 'F1=Help      F2=Split     F3=Exit      F7=Backward  F8=Forward   F9=Swap',
        'F10=Actions  F12=Cancel     Try: TIME  LISTCAT  LISTDS JCL MEMBERS  SUBMIT JCL(HELLO)');
    }
    aid(aid, v, cur, cmd) {
      const h = this.h, row = Math.floor(cur / COLS);
      if (aid !== 'ENTER') { h.redraw(); return; }
      if (!cmd && row >= 9 && row < 9 + Math.min(12, h.cmdHistory.length)) {
        this.pending = h.cmdHistory[row - 9];
        h.redraw();
        return;
      }
      if (!cmd) { h.redraw(); return; }
      h.cmdHistory = [cmd, ...h.cmdHistory.filter(c => c !== cmd)];
      h.runFromIspf(cmd, this);
    }
  }

  // ---------- SDSF -------------------------------------------------------
  class SdsfMenu {
    constructor(h, fromReady) { this.h = h; this.name = 'sdsf'; this.ispf = true; this.msg = ''; this.fromReady = fromReady; h.emit('sdsf-menu'); }
    draw(s) {
      actionBar(s, 'Display  Filter  View  Print  Options  Search  Help');
      s.put(2, 0, 'HQX7790 ' + center(' SDSF PRIMARY OPTION MENU ', 63, '-'), 'b');
      if (this.msg) s.put(2, 79 - this.msg.length, this.msg, 'w');
      s.put(3, 0, 'COMMAND INPUT ===>', 'g');
      s.field(3, 19, 42, { name: 'cmd', cursor: true });
      s.put(3, 63, 'SCROLL ===> CSR', 'g');
      s.put(5, 0, 'Type an option or command and press Enter.', 'w');
      const L = [['DA', 'Active users'], ['I', 'Input queue'], ['O', 'Output queue'], ['H', 'Held output queue'],
        ['ST', 'Status of jobs  <- start here'], ['', ''], ['LOG', 'System log'], ['SR', 'System requests'], ['MAS', 'Members in the MAS'],
        ['JC', 'Job classes'], ['', ''], ['END', 'Exit SDSF']];
      const R = [['INIT', 'Initiators'], ['PR', 'Printers'], ['PUN', 'Punches'], ['RDR', 'Readers'], ['LINE', 'Lines'], ['NODE', 'Nodes'],
        ['SO', 'Spool offload'], ['SP', 'Spool volumes']];
      L.forEach((o, i) => { s.put(7 + i, 0, o[0], 'w'); s.put(7 + i, 7, o[1], o[0] === 'ST' ? 'y' : 't'); });
      R.forEach((o, i) => { s.put(7 + i, 42, o[0], 'w'); s.put(7 + i, 49, o[1], 't'); });
      fkeys(s, 'F1=HELP    F2=SPLIT   F3=END     F4=RETURN  F5=IFIND   F6=BOOK',
        'F7=UP      F8=DOWN    F9=SWAP    F10=LEFT   F11=RIGHT  F12=RETRIEVE');
    }
    select(o) {
      if (o === 'ST') return new SdsfStatus(this.h);
      if (o === 'LOG') { this.h.emit('syslog'); return new BrowseView(this.h, { title: 'SDSF SYSLOG  ' + SYSID + '  ' + isoDate(), lines: this.h.syslog.slice(), label: 'COMMAND INPUT ===>', name: 'sdsf-log' }); }
      return ['DA', 'I', 'O', 'H', 'SR', 'MAS', 'JC', 'INIT', 'PR', 'PUN', 'RDR', 'LINE', 'NODE', 'SO', 'SP'].includes(o) ? o + ' not simulated - try ST' : null;
    }
    onEnd() {
      if (this.fromReady) { this.h.exitIspf(); return; }
      this.h.back();
    }
    aid(aid, v, cur, cmd) {
      if (aid !== 'ENTER' || !cmd) { this.h.redraw(); return; }
      const nx = this.select(cmd.split(/\s+/)[0]);
      if (nx && typeof nx !== 'string') this.h.push(nx);
      else { this.msg = nx || 'Invalid command'; this.h.redraw(); }
    }
  }

  class SdsfStatus {
    constructor(h) { this.h = h; this.name = 'sdsf-st'; this.ispf = true; this.msg = ''; this.top = 0; h.emit('sdsf-st'); }
    rows() {
      const h = this.h;
      return [
        { name: h.user, id: 'TSU' + h.tsuId(), queue: 'EXECUTION', rc: '', tsu: true },
        ...h.jobs.filter(j => j.owner === h.user).map(j => ({
          name: j.name, id: j.id, job: j,
          queue: Date.now() < j.endAt ? 'EXECUTION' : 'PRINT', rc: Date.now() < j.endAt ? '' : j.status,
        })),
      ];
    }
    draw(s) {
      const R = this.rows();
      s.put(0, 0, 'SDSF STATUS DISPLAY ALL CLASSES', 'b');
      s.put(0, 79 - (this.msg || ('LINE 1-' + R.length + ' (' + R.length + ')')).length, this.msg || ('LINE 1-' + R.length + ' (' + R.length + ')'), this.msg ? 'w' : 'b');
      s.put(1, 0, 'COMMAND INPUT ===>', 'g');
      s.field(1, 19, 42, { name: 'cmd' });
      s.put(1, 63, 'SCROLL ===> CSR', 'g');
      s.put(2, 0, 'PREFIX=' + this.h.user + '*  DEST=(ALL)  OWNER=' + this.h.user + '  SYSNAME=' + SYSID, 'b');
      s.put(3, 0, 'NP   JOBNAME  JobID    Owner    Prty Queue      C  Pos  SAff  ASys Max-RC', 'w');
      R.forEach((r, i) => {
        const row = 4 + i;
        if (row > 21) return;
        s.field(row, 0, 4, { name: 'np' + i, cursor: i === R.length - 1 });
        s.put(row, 5, pad(r.name, 8) + ' ' + pad(r.id, 8) + ' ' + pad(this.h.user, 8) + ' ' + lpad(r.tsu ? 15 : 1, 4) + ' ' +
          pad(r.queue, 10) + ' ' + pad(r.tsu ? '' : (r.job.cls || 'A'), 2) + ' ' + lpad(r.tsu ? '' : '', 4) + ' ' + pad(SYSID, 5) + ' ' + pad(SYSID, 4) + ' ' + r.rc,
        r.rc.startsWith('ABEND') || r.rc.startsWith('JCL') ? 'r' : 't');
      });
      s.put(22, 1, 'NP: S=show all output  ?=list output data sets  P=purge     Enter=refresh', 'y');
      s.put(23, 1, 'F1=HELP  F3=END  F7=UP  F8=DOWN', 't');
    }
    aid(aid, v, cur, cmd) {
      const h = this.h, R = this.rows();
      for (const k of Object.keys(v).filter(k => k.startsWith('np') && v[k].trim())) {
        const r = R[Number(k.slice(2))], c = v[k].trim().toUpperCase();
        if (!r) continue;
        if (r.tsu) { this.msg = 'That is your own TSO session'; continue; }
        if (r.queue === 'EXECUTION') { this.msg = 'Job still running - press Enter'; continue; }
        if (c === 'S') {
          const lines = [];
          for (const d of r.job.dds) lines.push(...d.lines, '');
          h.push(new BrowseView(h, { title: 'SDSF OUTPUT DISPLAY ' + r.job.name + ' ' + r.job.id, lines, label: 'COMMAND INPUT ===>', name: 'sdsf-out' }));
          h.emit('joboutput');
          return;
        }
        if (c === '?') { h.push(new SdsfJobDs(h, r.job)); return; }
        if (c === 'P') { h.jobs = h.jobs.filter(j => j !== r.job); this.msg = 'Job ' + r.job.id + ' purged'; continue; }
        this.msg = 'Invalid NP command ' + c;
      }
      if (cmd) this.msg = 'Command not simulated';
      h.redraw();
    }
  }

  class SdsfJobDs {
    constructor(h, job) { this.h = h; this.job = job; this.name = 'sdsf-jds'; this.ispf = true; this.msg = ''; }
    draw(s) {
      const j = this.job;
      s.put(0, 0, 'SDSF JOB DATA SET DISPLAY - JOB ' + j.name + ' (' + j.id + ')', 'b');
      s.put(0, 79 - ('LINE 1-' + j.dds.length + ' (' + j.dds.length + ')').length, 'LINE 1-' + j.dds.length + ' (' + j.dds.length + ')', 'b');
      if (this.msg) s.put(0, 79 - this.msg.length, this.msg, 'w');
      s.put(1, 0, 'COMMAND INPUT ===>', 'g');
      s.field(1, 19, 42, { name: 'cmd' });
      s.put(1, 63, 'SCROLL ===> CSR', 'g');
      s.put(3, 0, 'NP   DDNAME   StepName ProcStep DSID Owner    C Dest     Rec-Cnt', 'w');
      j.dds.forEach((d, i) => {
        s.field(4 + i, 0, 4, { name: 'np' + i, cursor: i === 0 });
        s.put(4 + i, 5, pad(d.dd, 8) + ' ' + pad(d.step, 8) + ' ' + pad('', 8) + ' ' + lpad(d.dsid, 4) + ' ' + pad(j.owner, 8) + ' X LOCAL   ' + lpad(d.lines.length, 8), 't');
      });
      s.put(22, 1, 'NP: S=show this data set.   JESYSMSG has the system messages for each step.', 'y');
      s.put(23, 1, 'F1=HELP  F3=END', 't');
    }
    aid(aid, v) {
      const h = this.h;
      for (const k of Object.keys(v).filter(k => k.startsWith('np') && v[k].trim())) {
        const d = this.job.dds[Number(k.slice(2))];
        if (d && v[k].trim().toUpperCase() === 'S') {
          h.push(new BrowseView(h, { title: 'SDSF OUTPUT DISPLAY ' + this.job.name + ' ' + this.job.id + ' DSID ' + d.dsid, lines: d.lines, label: 'COMMAND INPUT ===>', name: 'sdsf-out' }));
          h.emit('joboutput');
          return;
        }
      }
      h.redraw();
    }
  }

  const api = { Terminal, Host, Screen, ROWS, COLS, splitDsn, parseJcl };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ZSim = api;
})(typeof window !== 'undefined' ? window : globalThis);
