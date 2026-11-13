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
        hidden: !!o.hidden, cls: o.cls || 'in', mdt: false,
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
            '      * A COBOL PROGRAM. COMPILING IT NEEDS IGYCRCTL + THE BINDER,',
            '      * WHICH THIS SIMULATOR DOES NOT HAVE - BROWSE ONLY.',
            '       PROCEDURE DIVISION.',
            '           DISPLAY \'HELLO, WORLD\'.',
            '           GOBACK.',
          ]),
          GREET: j([
            '/* REXX - THE SCRIPTING LANGUAGE OF TSO */',
            'SAY \'WHAT IS YOUR NAME?\'',
            'PULL NAME',
            'SAY \'HELLO\' NAME',
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
      if (cmd === 'END') { this.back(); return true; }
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
      if (!r.lines.length) { this.redraw(); return; }
      this.go(new Pager(this, r.lines, () => this.go(view)));
    }
    ispfAid(view, aid, v, cur) {
      view.msg = '';
      if (view.capture) view.capture(v);
      const cmd = (v.cmd || '').trim().toUpperCase();
      if (/^PF(3|15|12|24)$/.test(aid)) {
        if (view.onEnd) view.onEnd();
        else this.back();
        return;
      }
      if (aid === 'CLEAR' || aid === 'PA1' || aid === 'PA2') { this.redraw(); return; }
      if (aid === 'PF1' || aid === 'PF13') { view.msg = 'Help: see the guide panel'; this.redraw(); return; }
      if (/^PF(2|9|14|21)$/.test(aid)) { view.msg = 'Split screen not simulated'; this.redraw(); return; }
      if (aid === 'ENTER' && cmd && this.ispfCmd(cmd, view)) return;
      view.aid(aid, v, cur, cmd);
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
        d.members[p.mem] = {
          lines: lines.slice(), created: old ? old.created : isoDate(),
          changed: isoDate() + ' ' + hm(), id: this.user,
        };
      } else d.lines = lines.slice();
    }
    newDs(name, o = {}) {
      this.catalog[name] = Object.assign({ recfm: 'FB', lrecl: 80, vol: 'ZSPK0' + (1 + Object.keys(this.catalog).length % 3) },
        o.dsorg === 'PO' ? { dsorg: 'PO', members: {} } : { dsorg: 'PS', lines: [] }, o);
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
          out.push(name, '--RECFM-LRECL-BLKSIZE-DSORG', '  ' + pad(d.recfm, 6) + pad(d.lrecl, 6) + pad('27920', 8) + d.dsorg,
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
        case 'EXEC': case 'EX':
          return { lines: ['ZSIM002I REXX/CLIST EXECUTION IS NOT SIMULATED. BROWSE SOURCE(GREET) TO SEE A REXX EXEC.'] };
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

  const KNOWN_PGMS = ['IDCAMS', 'IEBCOPY', 'SORT', 'ICEMAN', 'IKJEFT01', 'IKJEFT1B', 'IGYCRCTL', 'IEWL', 'IEWBLINK',
    'HEWL', 'ASMA90', 'IEBPTPCH', 'IEBUPDTE', 'IEHLIST', 'IRXJCL', 'BPXBATCH', 'DFSRRC00', 'DSNTEP2', 'IEBCOMPR'];

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
    const steps = []; let step = null;
    real.slice(jobStmt ? 1 : 0).forEach((s, i) => {
      if (s.op === 'EXEC') {
        const pgm = s.ops.PGM;
        if (!pgm) errs.push('STMT NO. ' + (i + 2) + '   IEFC612I PROCEDURE ' + (s.ops.PROC || s.ops._0) + ' WAS NOT FOUND');
        step = { name: s.name || '', pgm, dds: [] };
        steps.push(step);
      } else if (s.op === 'DD') {
        if (!step) { errs.push('STMT NO. ' + (i + 2) + '   IEFC610I DD STATEMENT BEFORE FIRST EXEC'); return; }
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

    let abend = null, maxrc = 0, dsid = 101;
    for (const st of steps) {
      if (abend) { sysmsg.push('IEF272I ' + name + ' ' + st.name + ' - STEP WAS NOT EXECUTED.'); continue; }
      // allocation
      const alloc = {};
      for (const dd of st.dds) {
        const dsnRaw = dd.ops.DSN || dd.ops.DSNAME;
        const disp = unparen(dd.ops.DISP || 'NEW').split(',');
        const a = { dd, disp, sysout: dd.ops.SYSOUT !== undefined, out: [] };
        alloc[dd.name] = a;
        if (!dsnRaw || dsnRaw.startsWith('&&')) continue;
        const p = splitDsn(dsnRaw);
        if (!p) return jclError(['IEF642I ' + name + ' ' + st.name + ' ' + dd.name + ' - INVALID DSNAME ' + dsnRaw, 'IEF272I ' + name + ' ' + st.name + ' - STEP WAS NOT EXECUTED.', 'IEF452I ' + name + ' - JOB NOT RUN - JCL ERROR']);
        a.dsn = p;
        const exists = host.catalog[p.ds];
        const status = disp[0] || 'NEW';
        if (status !== 'NEW' && !exists) {
          return jclError(['IEF212I ' + name + ' ' + st.name + ' ' + dd.name + ' - DATA SET NOT FOUND',
            'IEF272I ' + name + ' ' + st.name + ' - STEP WAS NOT EXECUTED.', 'IEF452I ' + name + ' - JOB NOT RUN - JCL ERROR']);
        }
        if (status === 'NEW' && exists) {
          return jclError(['IGD17101I DATA SET ' + p.ds + ' NOT DEFINED BECAUSE DUPLICATE NAME EXISTS IN CATALOG',
            'IEF272I ' + name + ' ' + st.name + ' - STEP WAS NOT EXECUTED.', 'IEF452I ' + name + ' - JOB NOT RUN - JCL ERROR']);
        }
        if (status !== 'SHR' && !host.owns(p.ds)) {
          sysmsg.push(host.racf(p.ds, status === 'NEW' ? 'ALTER' : 'UPDATE'));
          abend = 'S913';
        }
        if (status === 'NEW') {
          const space = dd.ops.SPACE || '';
          const po = dd.ops.DSORG === 'PO' || /\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/.test(space) || /LIBRARY|PDS/.test(dd.ops.DSNTYPE || '');
          a.create = { dsorg: po ? 'PO' : 'PS', recfm: unparen(dd.ops.RECFM || 'FB').replace(/,/g, ''), lrecl: Number(dd.ops.LRECL) || 80 };
        }
      }
      // run the program
      let rc = 0;
      const pgm = (st.pgm || '').toUpperCase();
      const print = (dd, lines) => { if (alloc[dd]) alloc[dd].out.push(...lines); };
      if (abend) {
        sysmsg.push('IEF450I ' + name + ' ' + st.name + ' - ABEND=' + abend + ' U0000 REASON=00000004');
      } else if (pgm === 'IEFBR14') {
        rc = 0;
      } else if (pgm === 'IEBGENER') {
        const in1 = alloc.SYSUT1, out2 = alloc.SYSUT2;
        print('SYSPRINT', ['DATA SET UTILITY - GENERATE', '']);
        if (!in1 || !out2) {
          print('SYSPRINT', ['IEB311I CONFLICTING DCB PARAMETERS - SYSUT1 OR SYSUT2 MISSING']);
          rc = 12;
        } else {
          let data = in1.dd.data || [];
          if (in1.dsn) {
            if (in1.create) data = [];
            else { const r = host.readDs(in1.dsn.ds + (in1.dsn.mem ? '(' + in1.dsn.mem + ')' : '')); data = r.lines || []; }
          }
          if (out2.sysout) out2.out.push(...data);
          else if (out2.dsn) out2.write = data;
          print('SYSPRINT', ['PROCESSING ENDED AT EOD']);
        }
      } else if (KNOWN_PGMS.includes(pgm)) {
        const dd = alloc.SYSPRINT ? 'SYSPRINT' : 'SYSOUT';
        if (!alloc[dd]) alloc[dd] = { dd: { name: dd }, sysout: true, out: [] };
        print(dd, ['ZSIM100I ' + pgm + ' IS A REAL Z/OS PROGRAM BUT IT IS NOT SIMULATED HERE.', 'ZSIM101I THE STEP WAS TREATED AS SUCCESSFUL (RC=0).']);
      } else {
        sysmsg.push('CSV003I REQUESTED MODULE ' + pgm + ' NOT FOUND',
          'CSV028I ABEND806-04  JOBNAME=' + name + '  STEPNAME=' + st.name,
          'IEA995I SYMPTOM DUMP OUTPUT  806',
          '  SYSTEM COMPLETION CODE=806  REASON CODE=00000004',
          'IEF450I ' + name + ' ' + st.name + ' - ABEND=S806 U0000 REASON=00000004');
        abend = 'S806';
      }
      if (!abend) sysmsg.push('IEF142I ' + name + ' ' + st.name + ' - STEP WAS EXECUTED - COND CODE ' + lpad(rc, 4, '0'));
      maxrc = Math.max(maxrc, rc);
      // disposition
      for (const ddn of Object.keys(alloc)) {
        const a = alloc[ddn];
        if (a.dsn) {
          const full = a.dsn.ds;
          const keep = !abend ? (a.disp[1] || (a.create ? 'DELETE' : 'KEEP')) : (a.disp[2] || a.disp[1] || 'KEEP');
          if (a.create && /CATLG|KEEP/.test(keep)) {
            host.newDs(full, a.create);
            if (a.write) host.writeDs(full + (a.dsn.mem ? '(' + a.dsn.mem + ')' : ''), a.write);
            sysmsg.push('IEF285I   ' + pad(full, 44) + ' CATALOGED', 'IEF285I   VOL SER NOS= ' + host.catalog[full].vol + '.');
          } else if (a.create) {
            sysmsg.push('IEF285I   ' + pad(full, 44) + ' DELETED');
          } else {
            if (a.write && !abend) host.writeDs(full + (a.dsn.mem ? '(' + a.dsn.mem + ')' : ''), a.write);
            sysmsg.push('IEF285I   ' + pad(full, 44) + ' ' + (a.disp[0] === 'SHR' ? 'RETAINED' : 'KEPT'));
          }
        } else if (a.sysout && a.out.length) {
          job.dds.push({ dd: ddn, step: st.name, dsid: dsid++, lines: a.out });
          sysmsg.push('IEF285I   ' + pad(user + '.' + name + '.' + id + '.D0000' + (dsid - 1) + '.?', 44) + ' SYSOUT');
        }
      }
      sysmsg.push('IEF373I STEP/' + pad(st.name, 8) + '/START ' + julian(t0) + '.' + hm(t0).replace(':', ''),
        'IEF032I STEP/' + pad(st.name, 8) + '/STOP  ' + julian(t0) + '.' + hm(t0).replace(':', ''));
      msglg.push(ts() + '-' + pad(st.name, 8) + ' ' + pad('', 8) + '  ' + (abend ? pad(abend, 5) : lpad(lpad(rc, 2, '0'), 5)) +
        lpad(20 + Math.floor(Math.random() * 60), 7) + lpad(1, 7) + '    .00    .00     .0');
    }
    sysmsg.push('IEF375I  JOB/' + pad(name, 8) + '/START ' + julian(t0) + '.' + hm(t0).replace(':', ''),
      'IEF033I  JOB/' + pad(name, 8) + '/STOP  ' + julian(t0) + '.' + hm(t0).replace(':', ''));
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
    constructor(h) { this.h = h; this.name = 'ready'; this.page = []; this.queue = []; this.more = false; }
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
      if (this.more) { s.put(this.page.length, 0, ' ***', 'w'); s.cursor = this.page.length * COLS + 5; return; }
      const r = this.page.length;
      s.field(r, 0, (ROWS - r) * COLS - 1, { name: 'cmd', cursor: true, cls: 'in plain' });
    }
    aid(aid, v) {
      const h = this.h;
      if (this.more) {
        this.page = [];
        if (aid === 'PA1') { this.queue = []; this.out(['READY']); } else this.flush();
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
      this.out([...(echo ? [cmd] : []), ...notices, ...r.lines, 'READY']);
      h.go(this);
    }
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
        s.put(5 + i, 1, o[0], 'w'); s.put(5 + i, 4, o[1], 'w'); s.put(5 + i, 16, o[2], 't');
      });
      fkeys(s, 'F1=Help      F2=Split     F3=Exit      F7=Backward  F8=Forward   F9=Swap',
        'F10=Actions  F12=Cancel');
    }
    select(o) { return o === '4' ? new DslistEntry(this.h) : (/^\d+$/.test(o) ? 'Option 3.' + o + ' not simulated' : null); }
    aid(aid, v, cur, cmd) {
      if (aid !== 'ENTER' || !cmd) { this.h.redraw(); return; }
      const nx = this.select(cmd);
      if (nx && typeof nx !== 'string') this.h.push(nx);
      else { this.msg = nx || 'Invalid option'; this.h.redraw(); }
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

  class DslistView {
    constructor(h, level) { this.h = h; this.name = 'dslist'; this.ispf = true; this.level = level; this.top = 0; this.rowMsg = {}; this.msg = ''; this.refresh(); h.emit('dslist'); }
    refresh() { this.items = this.h.listLevel(this.level); }
    draw(s) {
      const n = this.items.length;
      head(s, 'DSLIST - Data Sets Matching ' + this.level, n ? 'Row ' + (this.top + 1) + ' of ' + n : 'No data sets', { msg: this.msg, scroll: 'PAGE' });
      s.put(3, 0, 'Command - Enter "/" to select action', 'w');
      s.put(3, 54, 'Message', 'w'); s.put(3, 72, 'Volume', 'w');
      s.put(4, 0, '-'.repeat(79), 'b');
      const vis = this.items.slice(this.top, this.top + 16);
      vis.forEach((name, i) => {
        const r = 5 + i, idx = this.top + i, d = this.h.catalog[name];
        s.field(r, 1, 8, { name: 'lc' + idx, cursor: i === 0 });
        s.put(r, 10, name, 't');
        if (this.rowMsg[name]) s.put(r, 54, this.rowMsg[name].slice(0, 17), 'w');
        s.put(r, 72, d ? d.vol : '', 't');
      });
      if (this.top + 16 >= n) s.put(5 + vis.length, 0, center(' End of Data Set list ', 79, '*'), 'b');
      s.put(23, 1, 'F1=Help  F3=Exit  F7=Up  F8=Down   Line commands: B E V D I M  (B=browse)', 't');
    }
    aid(aid, v, cur, cmd) {
      const h = this.h;
      if (aid === 'PF7' || aid === 'PF19') { this.top = Math.max(0, this.top - 16); h.redraw(); return; }
      if (aid === 'PF8' || aid === 'PF20') { if (this.top + 16 < this.items.length) this.top += 16; h.redraw(); return; }
      if (cmd === 'REFRESH' || cmd === 'REF') { this.refresh(); h.redraw(); return; }
      if (cmd) { this.msg = 'Command not simulated'; h.redraw(); return; }
      let nav = null;
      for (const k of Object.keys(v).filter(k => k.startsWith('lc') && v[k].trim())) {
        const name = this.items[Number(k.slice(2))], d = h.catalog[name];
        const c = v[k].trim().toUpperCase();
        if (!d) continue;
        if (c === 'D') {
          if (!h.owns(name)) { this.rowMsg[name] = 'RACF: no ALTER'; this.msg = 'ICH408I - not authorized'; continue; }
          delete h.catalog[name];
          this.rowMsg[name] = 'Deleted';
          h.emit('delete');
        } else if (c === 'I') {
          this.rowMsg[name] = d.dsorg + ' ' + d.recfm + ' ' + d.lrecl;
        } else if (c === '/') {
          this.rowMsg[name] = 'Use B E V D I M';
        } else if (['B', 'E', 'V', 'M', 'S'].includes(c)) {
          if (!nav) nav = { name, d, c };
        } else this.rowMsg[name] = 'Invalid command';
      }
      if (nav) {
        const mode = { B: 'BROWSE', M: 'BROWSE', E: 'EDIT', S: 'EDIT', V: 'VIEW' }[nav.c];
        this.rowMsg[nav.name] = { BROWSE: 'Browsed', EDIT: 'Edited', VIEW: 'Viewed' }[mode];
        if (nav.d.dsorg === 'PO') h.push(new MemberList(h, nav.name, mode));
        else openData(h, nav.name, null, mode);
        return;
      }
      h.redraw();
    }
  }

  /** open a data set / member in BROWSE, VIEW or EDIT */
  function openData(h, ds, mem, mode, newOk) {
    const full = ds + (mem ? '(' + mem + ')' : '');
    let lines;
    const r = h.readDs(full);
    if (r.err) {
      if (newOk && mem && mode === 'EDIT') lines = null;
      else { h.view.msg = r.err.toLowerCase().replace(/^\w/, c => c.toUpperCase()).slice(0, 40); h.redraw(); return; }
    } else lines = r.lines;
    if (mode === 'EDIT' && !h.owns(ds)) { mode = 'VIEW'; }
    if (mode === 'BROWSE') { h.push(new BrowseView(h, { title: 'BROWSE    ' + full, lines })); h.emit('browse'); }
    else h.push(new EditView(h, ds, mem, lines, mode));
  }

  class MemberList {
    constructor(h, ds, mode) { this.h = h; this.name = 'memlist'; this.ispf = true; this.ds = ds; this.mode = mode; this.top = 0; this.rowMsg = {}; this.msg = ''; }
    get members() { const d = this.h.catalog[this.ds]; return d ? Object.keys(d.members).sort() : []; }
    draw(s) {
      const ms = this.members, d = this.h.catalog[this.ds];
      head(s, pad(this.mode, 10) + this.ds, 'Row ' + lpad(Math.min(this.top + 1, ms.length), 5, '0') + ' of ' + lpad(ms.length, 5, '0'), { msg: this.msg });
      s.put(3, 3, 'Name     Prompt       Size  Created     Changed             ID', 'w');
      ms.slice(this.top, this.top + 17).forEach((m, i) => {
        const r = 4 + i, st = d.members[m];
        s.field(r, 0, 2, { name: 'lc' + (this.top + i), cursor: i === 0 });
        s.put(r, 3, m, 't');
        if (this.rowMsg[m]) s.put(r, 12, '*' + this.rowMsg[m], 'w');
        s.put(r, 24, lpad(st.lines.length, 5), 't');
        s.put(r, 31, st.created, 't');
        s.put(r, 43, st.changed, 't');
        s.put(r, 63, st.id, 't');
      });
      if (this.top + 17 >= ms.length) s.put(4 + Math.min(17, ms.length - this.top), 2, '**End**', 'b');
      s.put(23, 1, 'S=' + this.mode.toLowerCase() + ' B=browse E=edit V=view D=delete   New member: S NAME on command line', 't');
    }
    aid(aid, v, cur, cmd) {
      const h = this.h, ms = this.members;
      if (aid === 'PF7' || aid === 'PF19') { this.top = Math.max(0, this.top - 17); h.redraw(); return; }
      if (aid === 'PF8' || aid === 'PF20') { if (this.top + 17 < ms.length) this.top += 17; h.redraw(); return; }
      const m = cmd.match(/^(?:S|SEL|SELECT)?\s*([A-Z#$@][A-Z0-9#$@]{0,7})$/);
      if (cmd && m) { openData(h, this.ds, m[1], this.mode, true); return; }
      if (cmd) { this.msg = 'Invalid command'; h.redraw(); return; }
      for (const k of Object.keys(v).filter(k => k.startsWith('lc') && v[k].trim())) {
        const mem = ms[Number(k.slice(2))], c = v[k].trim().toUpperCase();
        if (!mem) continue;
        if (c === 'D') {
          if (!h.owns(this.ds)) { this.msg = 'ICH408I - not authorized'; continue; }
          delete h.catalog[this.ds].members[mem];
          this.rowMsg[mem] = 'Deleted';
          continue;
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
      this.lines = (lines || ['', '', '', '', '']).map(t => ({ t, ins: lines === null }));
      this.changed = false; this.caps = true; this.focus = null;
      if (mode === 'VIEW' && !h.owns(ds)) this.msg = 'Read only - RACF';
      if (this.isNew) this.msg = 'New member';
      h.emit(this.name);
    }
    get full() { return this.ds + (this.mem ? '(' + this.mem + ')' : ''); }
    seq(i) { return lpad(i + 1, 6, '0'); }
    draw(s) {
      head(s, pad(this.mode, 10) + this.full + ' - 01.00', 'Columns 00001 00072', { msg: this.msg, cursor: this.focus === null });
      const total = this.lines.length + 2;
      for (let i = 0; i < 20; i++) {
        const k = this.top + i, r = 2 + i;
        if (k >= total) break;
        if (k === 0) { s.put(r, 0, '****** ' + center(' Top of Data ', 72, '*'), 'w'); continue; }
        if (k === total - 1) { s.put(r, 0, '****** ' + center(' Bottom of Data ', 72, '*'), 'w'); continue; }
        const li = k - 1, L = this.lines[li];
        s.field(r, 0, 6, { name: 'p' + li, value: L.ins ? "''''''" : this.seq(li), cls: 'in pre' });
        s.field(r, 7, 72, { name: 'd' + li, value: L.t, cls: 'in data', cursor: this.focus === li });
      }
      this.focus = null;
      fkeys(s, 'F1=Help   F3=Exit(save) F5=Rfind  F7=Up   F8=Down   F12=Cancel',
        this.mode === 'EDIT' ? 'Commands: SAVE  SUB(mit)  CAN(cel)   Line cmds over 000001: I D R  (I3, D2)' : 'View mode: changes cannot be saved. F3 to leave.');
    }
    /** read what the user typed back into the model */
    capture(v) {
      const total = this.lines.length + 2, drop = new Set(), cmds = [];
      for (let i = 0; i < 20; i++) {
        const k = this.top + i;
        if (k < 1 || k >= total - 1) continue;
        const li = k - 1, L = this.lines[li];
        const d = v['d' + li];
        if (d === undefined) continue;
        let t = d;
        if (this.caps) t = t.toUpperCase();
        if (t !== L.t) { L.t = t; L.ins = false; this.changed = true; }
        // prefix area: work out what was typed over the sequence number
        const orig = L.ins ? "''''''" : this.seq(li), val = pad(v['p' + li] || '', 6);
        if (val !== orig) {
          let j = 0;
          while (j < 6 && val.slice(j) !== orig.slice(j)) j++;
          const c = val.slice(0, j).replace(/'/g, '').trim().toUpperCase();
          if (c) cmds.push({ li, c });
        }
        if (L.ins && L.t === '') drop.add(li);
      }
      // apply prefix commands bottom-up so indexes stay valid
      cmds.sort((a, b) => b.li - a.li);
      for (const { li, c } of cmds) {
        const m = c.match(/^([IDR])(\d*)$/);
        if (!m) { this.msg = 'Invalid line command ' + c; continue; }
        const n = Number(m[2] || 1);
        drop.delete(li);
        if (m[1] === 'I') {
          this.lines.splice(li + 1, 0, ...Array.from({ length: n }, () => ({ t: '', ins: true })));
          this.focus = li + 1;
        } else if (m[1] === 'D') { this.lines.splice(li, n); this.changed = true; }
        else if (m[1] === 'R') { this.lines.splice(li + 1, 0, ...Array.from({ length: n }, () => ({ t: this.lines[li].t, ins: false }))); this.changed = true; }
      }
      // forget inserted lines left blank (like ISPF does)
      if (!cmds.some(c => c.c.startsWith('I'))) {
        this.lines = this.lines.filter((L, i) => !(drop.has(i) && L.ins && L.t === ''));
      }
      if (!this.lines.length) this.lines.push({ t: '', ins: true });
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
    aid(aid, v, cur, cmd) {
      const h = this.h, max = Math.max(0, this.lines.length + 2 - 20);
      if (aid === 'PF7' || aid === 'PF19') this.top = Math.max(0, this.top - 19);
      else if (aid === 'PF8' || aid === 'PF20') this.top = Math.min(max, this.top + 19);
      else if (cmd === 'SAVE') { if (this.save()) this.msg = 'Member saved'; }
      else if (cmd === 'CAN' || cmd === 'CANCEL') { h.back(); return; }
      else if (cmd === 'SUB' || cmd === 'SUBMIT') {
        const lines = this.text();
        const m = h.submit(lines);
        h.go(new Pager(h, [m], () => h.go(this)));
        return;
      } else if (cmd === 'TOP') this.top = 0;
      else if (cmd === 'BOT' || cmd === 'BOTTOM') this.top = max;
      else if (cmd === 'CAPS ON') { this.caps = true; this.msg = 'CAPS ON'; }
      else if (cmd === 'CAPS OFF') { this.caps = false; this.msg = 'CAPS OFF'; }
      else if (cmd === 'RES' || cmd === 'RESET') { /* nothing to reset */ }
      else if (cmd) this.msg = 'Command not simulated';
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
