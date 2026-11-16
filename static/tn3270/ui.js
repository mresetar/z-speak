/* ZSpeak TN3270 simulator: browser side. Draws the Terminal from host.js,
   turns keyboard/mouse into 3270 keys, and runs the guide panel. */
(function () {
  'use strict';
  const { Terminal, Host, ROWS, COLS } = window.ZSim;
  const $ = id => document.getElementById(id);
  const screenEl = $('screen'), oiaEl = $('oia'), kbd = $('kbd'), termEl = $('term');

  const term = new Terminal({ delay: 180 });
  const host = new Host();

  // ---------- drawing ----------------------------------------------------
  const esc = c => c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '&' ? '&amp;' : c;
  function render() {
    const s = term.scr;
    if (!term.connected) {
      const msg = connecting ? 'Negotiating TN3270E with ' + $('host').value + ':' + $('port').value + ' ...'
        : 'Not connected. Press Connect to open a session.';
      const lines = Array.from({ length: ROWS }, (_, r) => r === 11 ? msg.padStart(Math.floor((COLS + msg.length) / 2)) : '');
      screenEl.innerHTML = '<span class="idle">' + lines.map(l => l.split('').map(esc).join('')).join('\n') + '</span>';
      oiaEl.innerHTML = '<span>' + (connecting ? '  X ◷ connecting' : '  not connected') + '</span>';
      return;
    }
    const ch = s.ch.slice(), cl = s.cl.slice();
    for (const f of s.fields) {
      const hl = f.hl ? f.hl(f.buf.join('')) : null;   // syntax colours, recomputed as you type
      for (let i = 0; i < f.len; i++) {
        ch[f.pos + i] = f.hidden ? ' ' : f.buf[i];
        cl[f.pos + i] = hl && hl[i] ? f.cls + ' c-' + hl[i] : f.cls;
      }
    }
    let html = '';
    for (let r = 0; r < ROWS; r++) {
      let run = '', runCls = null;
      const flush = () => { if (run) html += runCls ? '<span class="' + runCls + '">' + run + '</span>' : run; run = ''; };
      for (let c = 0; c < COLS; c++) {
        const p = r * COLS + c;
        if (p === s.cursor) {
          flush();
          html += '<span class="cur ' + (cl[p] || '') + '">' + esc(ch[p]) + '</span>';
          runCls = null;
          continue;
        }
        if (cl[p] !== runCls) { flush(); runCls = cl[p]; }
        run += esc(ch[p]);
      }
      flush();
      if (r < ROWS - 1) html += '\n';
    }
    screenEl.innerHTML = html;
    screenEl.classList.toggle('ins', term.insert);
    const row = Math.floor(s.cursor / COLS) + 1, col = s.cursor % COLS + 1;
    const lock = term.locked ? '<span class="lock">X ◷ SYSTEM</span>' : term.err ? '<span class="err">' + esc(term.err) + '  (Reset: Alt+R)</span>' : '';
    oiaEl.innerHTML = '<span>4A</span><span>' + ($('tls').checked ? 'TLS' : '   ') + '</span>' + (lock || '<span></span>') +
      '<span class="grow"></span><span>' + (term.insert ? '^ INS' : '     ') + '</span><span>' +
      String(row).padStart(3, '0') + '/' + String(col).padStart(3, '0') + '</span>';
  }
  term.on(render);

  // ---------- connect / disconnect ---------------------------------------
  let connecting = false;
  $('connbar').addEventListener('submit', e => {
    e.preventDefault();
    if (term.connected) {
      term.disconnect();
      resetMissions();
      host.user = null;
      $('connect').textContent = 'Connect';
      updateWhere('disconnected');
      return;
    }
    if (!$('host').value.trim()) { $('host').focus(); return; }
    connecting = true;
    render();
    setTimeout(() => {
      connecting = false;
      term.connect(host);
      $('connect').textContent = 'Disconnect';
      kbd.focus();
    }, 700);
  });

  // ---------- keyboard ---------------------------------------------------
  const KEYMAP = {
    Tab: 'Tab', ArrowLeft: 'Left', ArrowRight: 'Right', ArrowUp: 'Up', ArrowDown: 'Down',
    Home: 'Home', End: 'EraseEOF', Backspace: 'Backspace', Delete: 'Delete', Insert: 'Insert',
  };
  kbd.addEventListener('keydown', e => {
    if (e.isComposing) return;
    let aid = null, key = null;
    if (e.key === 'Enter') { if (e.shiftKey) key = 'NewLine'; else aid = 'ENTER'; }
    else if (e.key === 'Escape') aid = 'CLEAR';
    else if (/^F([1-9]|1[0-2])$/.test(e.key)) aid = 'PF' + (Number(e.key.slice(1)) + (e.shiftKey ? 12 : 0));
    else if (e.key === 'PageUp') aid = 'PF7';
    else if (e.key === 'PageDown') aid = 'PF8';
    else if (e.altKey && e.code === 'Digit1') aid = 'PA1';
    else if (e.altKey && e.code === 'Digit2') aid = 'PA2';
    else if (e.altKey && e.code === 'KeyR') key = 'Reset';
    else if (e.ctrlKey && e.code === 'KeyI') key = 'Insert';
    else if (e.key === 'Tab' && e.shiftKey) key = 'BackTab';
    else if (KEYMAP[e.key] && !e.metaKey && !e.ctrlKey) key = KEYMAP[e.key];
    if (!aid && !key) return;
    e.preventDefault();
    if (aid) term.aid(aid); else term.key(key);
  });
  kbd.addEventListener('input', () => {
    const v = kbd.value;
    kbd.value = '';
    for (const c of v) if (/[\x20-\x7e¬¢]/.test(c)) term.input(c);
  });
  kbd.addEventListener('focus', () => termEl.classList.add('focused'));
  kbd.addEventListener('blur', () => termEl.classList.remove('focused'));

  // click on the screen moves the cursor there, like a light pen / mouse in an emulator
  screenEl.addEventListener('mousedown', e => {
    e.preventDefault();
    kbd.focus();
    if (!term.connected || term.locked) return;
    const rect = screenEl.getBoundingClientRect();
    const c = Math.min(COLS - 1, Math.floor((e.clientX - rect.left) / (rect.width / COLS)));
    const r = Math.min(ROWS - 1, Math.floor((e.clientY - rect.top) / (rect.height / ROWS)));
    term.cursor = r * COLS + c;
    term.err = '';
    render();
  });
  termEl.addEventListener('mousedown', e => { if (e.target !== screenEl && !screenEl.contains(e.target)) { e.preventDefault(); kbd.focus(); } });

  // on-screen keys
  const pfrow = $('pfrow');
  for (let i = 1; i <= 12; i++) {
    const b = document.createElement('button');
    b.className = 'btn' + ([3, 7, 8].includes(i) ? ' hot' : '');
    b.dataset.aid = 'PF' + i;
    b.textContent = 'PF' + i;
    b.title = { 1: 'Help', 3: 'Exit / back', 5: 'Repeat find', 6: 'Repeat change', 7: 'Scroll up', 8: 'Scroll down', 10: 'Left', 11: 'Right', 12: 'Cancel' }[i] || '';
    pfrow.appendChild(b);
  }
  $('keys').addEventListener('mousedown', e => e.preventDefault()); // keep focus in the terminal
  $('keys').addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.aid) term.aid(b.dataset.aid);
    if (b.dataset.key) term.key(b.dataset.key);
    kbd.focus();
  });

  // ---------- guide: where am I ------------------------------------------
  const WORDS = {
    tn3270: 'TN3270', '3270': '3270', vtam: 'VTAM', tso: 'TSO', racf: 'RACF', ispf: 'ISPF', 'data-set': 'data set',
    pds: 'PDS', catalog: 'catalog', 'high-level-qualifier': 'HLQ', jcl: 'JCL', jes: 'JES', sdsf: 'SDSF', sysout: 'SYSOUT',
    'system-utilities': 'utilities', abend: 'ABEND', 'condition-code': 'condition code', 'dd-statement': 'DD',
    'exec-statement': 'EXEC', 'job-statement': 'JOB', rexx: 'REXX', cobol: 'COBOL', 'z-os': 'z/OS',
  };
  const HELP = {
    disconnected: {
      t: 'Your PC, not yet the mainframe',
      p: ['A real session starts in a <b>3270 emulator</b> (x3270, PCOMM, Vista, the Zowe Explorer…). It opens a TCP connection to the host, usually over TLS, and speaks the <b>TN3270</b> protocol.',
        'Nothing streams character by character. The host sends a whole screen with input fields. You fill them in locally, and only pressing an attention key (Enter, PF keys, Clear) sends anything back.'],
      try: 'Press <b>Connect</b>.',
      w: ['tn3270', '3270', 'z-os'],
    },
    vtam: {
      t: 'VTAM logon screen',
      p: ['The first screen comes from <b>VTAM</b>, the z/OS networking layer. It isn\'t TSO yet. Think of it as a switchboard that hands your terminal to an application such as TSO, CICS or IMS.',
        'Every installation designs its own (often with ASCII art). Some take you straight to TSO.'],
      try: 'Type <b>TSO Z85188</b> (or any 1-7 character user ID) and press <b>Enter</b>.',
      w: ['vtam', 'tso', '3270'],
    },
    'ikj-userid': {
      t: 'TSO wants a user ID',
      p: ['You asked for TSO without saying who you are. <code>IKJ</code> is the message prefix of TSO/E, and the trailing <code>A</code> means it wants an Action from you.'],
      try: 'Type a user ID like <b>Z85188</b> and press Enter.',
      w: ['tso'],
    },
    logon: {
      t: 'TSO/E LOGON panel',
      p: ['Your user ID and password are checked by <b>RACF</b>, the security manager. <b>Procedure</b> is the logon proc, the JCL that builds your TSO address space and which libraries it gets. <b>Acct Nmbr</b> is for chargeback.',
        'The password field is non-display: the host told the terminal not to show it. In this simulator any non-blank password works. Never type a real one.'],
      try: 'Type a password and press <b>Enter</b>. Optional: put <b>ISPF</b> in the Command field to go straight to the menus.',
      w: ['racf', 'tso', 'jcl'],
    },
    pager: {
      t: 'Line-mode output, paused',
      p: ['The <code>***</code> means "there\'s more, or I\'m done. Press Enter when you\'ve read this." TSO line mode writes like a printer: line after line, then a pause when the screen is full.'],
      try: 'Press <b>Enter</b> to continue.',
      w: ['tso'],
    },
    ready: {
      t: 'TSO READY prompt',
      p: ['<b>READY</b> is TSO\'s command prompt, the mainframe\'s answer to a shell. Commands are uppercase (lowercase is fine, TSO folds it). Success is often silent: no message means it worked.',
        'Data set names without quotes get your <b>prefix</b> added, so <code>JCL</code> means <code>Z85188.JCL</code>. Quotes mean "exactly this name": <code>\'ZXP.PUBLIC.JCL\'</code>.'],
      try: 'Try <b>TIME</b>, <b>LISTCAT</b>, <b>LISTDS JCL MEMBERS</b>, <b>EXEC SOURCE(GREET)</b>, <b>SUBMIT JCL(HELLO)</b>, <b>HELP</b>, then <b>ISPF</b>.',
      w: ['tso', 'data-set', 'high-level-qualifier', 'catalog'],
    },
    'ispf-main': {
      t: 'ISPF Primary Option Menu',
      p: ['<b>ISPF</b> is the full-screen menu system most z/OS people live in. Pick an option by number. Options chain with dots, so <code>3.4</code> means Utilities → Dslist, and <code>=3.4</code> jumps there from any panel.',
        '<b>F3</b> goes back one level. <b>=X</b> leaves ISPF.'],
      try: 'Type <b>3.4</b> and press Enter to list your data sets. Or <b>6</b> for a TSO command shell, <b>S</b> for SDSF.',
      w: ['ispf', 'tso'],
    },
    'ispf-util': {
      t: 'Utility Selection Panel',
      p: ['The ISPF utilities for data sets. <b>1</b> works on the members of a library, <b>2</b> creates, renames and deletes whole data sets, <b>3</b> copies and moves, and <b>4</b> (Dslist) lists data sets so you can do all of that from one screen.'],
      try: 'Type <b>2</b> to allocate a data set, or <b>4</b> for the list everybody lives in.',
      w: ['ispf', 'data-set', 'pds'],
    },
    'lib-util': {
      t: 'Library Utility (3.1)',
      p: ['Works on one <b>PDS</b> and its members: browse, edit, delete and rename a member, or leave the option blank for the member list.',
        'In a classic PDS a saved member is written at the end and the old copy stays behind as dead space. <code>C</code> (compress) wins the space back. A PDSE does that by itself.'],
      try: 'Leave Option blank and press <b>Enter</b> for the member list of <b>JCL</b>.',
      w: ['pds', 'data-set'],
    },
    'ds-util': {
      t: 'Data Set Utility (3.2)',
      p: ['Whole data sets: <code>A</code> allocate a new one, <code>R</code> rename, <code>D</code> delete, blank for its attributes.',
        'Unlike a PC file, a data set can\'t just grow out of nothing. You <b>allocate</b> it first: how much disk space, which record format and length, sequential or partitioned.'],
      try: 'Type <b>A</b> on the Option line, a name like <b>MY.NEW.DATA</b>, and press Enter.',
      w: ['data-set', 'catalog', 'high-level-qualifier', 'racf'],
    },
    'alloc-new': {
      t: 'Allocate New Data Set',
      p: ['<b>Space</b>: a primary amount, plus a secondary amount the system adds (up to 15 times) when the data set fills up. Run out and the job abends with <code>B37</code>.',
        '<b>Record format</b> FB = fixed-length records in blocks, VB = variable length. <b>Record length</b> 80 is the classic card image. <b>Directory blocks</b> above zero make it a PDS; type <code>LIBRARY</code> makes it a PDSE.'],
      try: 'Set <b>Directory blocks</b> to <b>5</b> for a PDS (or leave 0 for a sequential data set) and press <b>Enter</b>.',
      w: ['data-set', 'pds'],
    },
    'ds-info': {
      t: 'Data Set Information',
      p: ['Everything the system knows about a data set: the <b>volume</b> it lives on, its organization (PS sequential, PO partitioned), record format and length, and how much of its allocated space is used.'],
      try: 'Press <b>Enter</b> or <b>F3</b> to go back.',
      w: ['data-set', 'pds', 'catalog'],
    },
    'rename-ds': {
      t: 'Rename Data Set',
      p: ['Renaming changes the catalog entry and the name on the volume. The data doesn\'t move. The first qualifier is the owner, so you can\'t rename something into another user\'s space.'],
      try: 'Type the new name over the old one and press <b>Enter</b>.',
      w: ['data-set', 'catalog', 'high-level-qualifier', 'racf'],
    },
    'confirm-del': {
      t: 'Confirm Delete',
      p: ['Deleting is final. z/OS has no recycle bin, so ISPF asks first. In a real shop a deleted data set comes back only from a backup.'],
      try: '<b>Enter</b> deletes. <b>F3</b> keeps the data set.',
      w: ['data-set', 'racf'],
    },
    movecopy: {
      t: 'Move/Copy Utility (3.3)',
      p: ['Copies a whole sequential data set, one member, or every member with <code>(*)</code>. First you name the <b>From</b> data set, then a second panel asks for the <b>To</b>.'],
      try: 'Type <b>C</b> on the Option line with <b>JCL(HELLO)</b> as the From name.',
      w: ['data-set', 'pds'],
    },
    'movecopy-to': {
      t: 'Move/Copy: the "To" data set',
      p: ['Name where it should go. Add a member name in parentheses to rename on the way. A like-named member is only overwritten if you select <b>Replace</b> with a <code>/</code>.'],
      try: 'Type <b>JCL(HELLO2)</b> and press <b>Enter</b>, or name a data set that doesn\'t exist yet.',
      w: ['data-set', 'pds'],
    },
    'alloc-like': {
      t: 'Allocate Target Data Set',
      p: ['The To data set doesn\'t exist. ISPF offers to allocate it with the same attributes as the one you are copying from, which is nearly always what you want.'],
      try: 'Press <b>Enter</b> to take option 1.',
      w: ['data-set'],
    },
    rexx: {
      t: 'A REXX exec is running',
      p: ['<b>REXX</b> is the scripting language of TSO. <code>SAY</code> writes a line, <code>PULL</code> waits for you to type one. A line that is not REXX is handed to TSO as a command.'],
      try: 'Answer the question and press <b>Enter</b>. <code>***</code> means it is done.',
      w: ['rexx', 'tso'],
    },
    'dslist-entry': {
      t: 'Data Set List Utility (3.4)',
      p: ['Enter a <b>Dsname Level</b>, which is the first qualifier(s) of the names you want. Your user ID is the usual <b>high-level qualifier</b> (HLQ) for your own data sets.'],
      try: 'Press <b>Enter</b> with <b>' + 'Z85188' + '</b>, or try level <b>ZXP</b>.',
      w: ['high-level-qualifier', 'data-set', 'catalog'],
    },
    dslist: {
      t: 'DSLIST: your data sets',
      p: ['z/OS has no directories. A <b>data set</b> name is up to 44 characters in dot-separated qualifiers, and the <b>catalog</b> knows which disk volume (right column) holds it.',
        'Type a line command in the left column next to a name: <code>B</code> browse, <code>E</code> edit, <code>M</code> member list, <code>I</code> info, <code>R</code> rename, <code>D</code> delete, <code>CO</code> copy, <code>MO</code> move, <code>Z</code> compress. <b>F11</b> switches to the attributes view.'],
      try: 'Type <b>B</b> next to <b>Z85188.JCL</b> and press Enter. Later: <b>CO</b> next to it to copy the whole library.',
      w: ['data-set', 'catalog', 'pds'],
    },
    memlist: {
      t: 'Member list',
      p: ['A <b>PDS</b> (partitioned data set) is like a folder of members, each a small file. JCL, source code and REXX execs usually live as members.'],
      try: 'Type <b>S</b> next to <b>HELLO</b>. To make a new member: <b>S NEWNAME</b> on the command line (in Edit mode). <b>J</b> submits a member as a job, <b>C</b> copies it, <b>R</b> renames it to the name you type under Prompt.',
      w: ['pds', 'data-set'],
    },
    browse: {
      t: 'Browse',
      p: ['Read-only view of a data set. <b>F7/F8</b> scroll, <b>F10/F11</b> shift left/right, <code>F text</code> finds. Records are fixed 80-byte lines (RECFM=FB, LRECL=80), a legacy of punched cards.'],
      try: 'Press <b>F3</b> to go back. Then edit the same member with <b>E</b> and submit it.',
      w: ['data-set', 'jcl'],
    },
    edit: {
      t: 'ISPF Editor',
      p: ['Type over the text and press Enter to keep it. The numbers on the left are the <b>prefix area</b>. Type over them for line commands: <code>I</code> insert, <code>D</code> delete, <code>R</code> repeat (<code>I3</code> = 3 lines). To copy or move, mark the source with <code>C</code> or <code>M</code> and the target with <code>A</code> (after) or <code>B</code> (before). Blocks take a pair: <code>CC</code>…<code>CC</code>, <code>MM</code>, <code>DD</code>, <code>RR</code>.',
        'On the command line: <code>F text</code> finds (<b>F5</b> repeats), <code>C old new ALL</code> changes (<b>F6</b> repeats), <code>UNDO</code>, <code>RES</code> clears markers, <code>COLS</code> shows a ruler, <code>HILITE OFF</code> turns the colours off. <code>SAVE</code>, <code>CAN</code> to cancel, <code>SUB</code> to submit this JCL. <b>F3</b> saves and exits.'],
      try: 'In <b>JCL(HELLO)</b>, change the text after <code>SYSUT1 DD *</code>, then type <b>SUB</b> on the command line.',
      w: ['jcl', 'job-statement', 'exec-statement', 'dd-statement', 'system-utilities'],
    },
    view: { t: 'View mode', p: ['Like Edit, but you can\'t save. That\'s what you get for data sets RACF only lets you read.'], try: '<b>F3</b> to leave.', w: ['racf'] },
    entry: { t: 'Edit / View entry panel', p: ['Name a data set, with or without a member in parentheses. Quoted means the exact name; unquoted gets your prefix.'], try: 'Press <b>Enter</b> to open <b>\'Z85188.JCL(HELLO)\'</b>.', w: ['data-set', 'pds'] },
    shell: {
      t: 'ISPF Command Shell (option 6)',
      p: ['Run TSO commands without leaving ISPF. Their line-mode output appears, then <code>***</code>. Earlier commands are listed. Put the cursor on one and press Enter to bring it back.',
        'From any ISPF command line you can also type <code>TSO command</code>.'],
      try: 'Try <b>LISTDS JCL MEMBERS</b> or <b>STATUS</b>.',
      w: ['tso', 'ispf'],
    },
    sdsf: {
      t: 'SDSF',
      p: ['<b>SDSF</b> shows what <b>JES</b>, the job entry subsystem, is doing: jobs waiting, running, and finished with their output sitting on the <b>spool</b>.'],
      try: 'Type <b>ST</b> for the status of your jobs, or <b>LOG</b> for the system log.',
      w: ['sdsf', 'jes'],
    },
    'sdsf-st': {
      t: 'SDSF status display',
      p: ['Your TSO session is itself a "job" (<code>TSU…</code>). Batch jobs are <code>JOB…</code>. <b>Max-RC</b> shows how it went: <code>CC 0000</code> fine, <code>CC 0004+</code> warnings and worse, <code>ABEND</code> crashed, <code>JCL ERROR</code> never ran.'],
      try: 'Type <b>S</b> in the NP column next to a job to read all its output, or <b>?</b> to see the separate output data sets.',
      w: ['sdsf', 'jes', 'condition-code', 'abend'],
    },
    'sdsf-jds': {
      t: 'Job output data sets',
      p: ['<code>JESMSGLG</code> is the job log, <code>JESJCL</code> your JCL as the system read it, and <code>JESYSMSG</code> the allocation and step messages. After those come your program\'s <b>SYSOUT</b> data sets.'],
      try: 'Type <b>S</b> next to <b>SYSUT2</b> (the HELLO job) to see your text.',
      w: ['sysout', 'jes', 'dd-statement'],
    },
    'sdsf-out': {
      t: 'Reading job output',
      p: ['Look for <code>IEF142I … COND CODE 0000</code> (step ran fine), <code>IEF450I … ABEND=S806</code> (program not found), or <code>IEF212I DATA SET NOT FOUND</code> (JCL error). Finding these lines fast is a core skill.'],
      try: 'Submit <b>JCL(BADPGM)</b> and <b>JCL(BADJCL)</b> and compare. Then the ones that do real work: <b>SORTJOB</b>, <b>COBRUN</b> (compile, link and run COBOL), <b>AMS</b>, <b>BACKUP</b>, <b>TSOBATCH</b>.',
      w: ['abend', 'condition-code', 'sysout'],
    },
    'sdsf-log': { t: 'System log', p: ['The SYSLOG records everything the system says: logons, jobs starting and ending. Operators watch it all day.'], try: '<b>F8</b> to scroll, <b>F3</b> to go back.', w: ['jes', 'z-os'] },
  };
  function updateWhere(name) {
    const H = HELP[name] || HELP.disconnected;
    const user = host.user || 'Z85188';
    $('where').innerHTML = '<h3>' + H.t + '</h3>' + H.p.map(p => '<p>' + p + '</p>').join('') +
      (H.try ? '<div class="try">→ ' + H.try.replace(/Z85188/g, user) + '</div>' : '');
    $('words').innerHTML = (H.w || []).map(s => '<a href="../terms/' + s + '/">' + WORDS[s] + '</a>').join('');
  }

  // ---------- guide: missions --------------------------------------------
  const MISSIONS = [
    ['connect', 'Connect to the host', 'Press <b>Connect</b> above the screen.'],
    ['logon-panel', 'Reach the TSO logon panel', 'At the VTAM screen type <code>TSO Z85188</code> and press Enter.'],
    ['ready', 'Log on and see READY', 'Any password; then Enter.'],
    ['listcat', 'List your data sets from READY', 'Type <code>LISTCAT</code>.'],
    ['ispf', 'Start ISPF', 'Type <code>ISPF</code> at READY.'],
    ['dslist', 'Open DSLIST (option 3.4)', 'Type <code>3.4</code> on the Option line, then Enter.'],
    ['browse', 'Browse a member', '<code>B</code> next to your .JCL data set, then <code>S</code> next to HELLO.'],
    ['submit', 'Submit a batch job', 'Edit <code>JCL(HELLO)</code> and type <code>SUB</code> on the command line.'],
    ['joboutput', 'Read the job output in SDSF', '<code>=S.ST</code>, then <code>S</code> next to your job.'],
    ['change', 'Change text with an editor command', 'In the editor: <code>C HELLO GOODBYE ALL</code>. <code>UNDO</code> takes it back.'],
    ['alloc', 'Allocate a new data set', '<code>=3.2</code>, option <code>A</code>, name <code>MY.LIB</code>, directory blocks 5.'],
    ['copy', 'Copy a member into it', '<code>=3.3</code>, option <code>C</code>, from <code>JCL(HELLO)</code>, to <code>MY.LIB</code>.'],
    ['rexx', 'Run a REXX exec', 'On any command line: <code>TSO EXEC SOURCE(GREET)</code>.'],
    ['cobol', 'Compile and run a COBOL program', 'Submit <code>JCL(COBRUN)</code> and read the output of step GO.'],
    ['logoff', 'Leave cleanly', '<code>=X</code> to leave ISPF, then <code>LOGOFF</code>.'],
  ];
  // Progress lives only as long as the session: disconnecting or leaving the
  // page starts over. (Drop the copy older versions kept in localStorage.)
  let done = new Set();
  try { localStorage.removeItem('zspeak-tn3270-missions'); } catch (e) {}
  function resetMissions() { done = new Set(); drawMissions(); }
  function drawMissions() {
    const next = MISSIONS.find(m => !done.has(m[0]));
    $('missions').innerHTML = MISSIONS.map(m =>
      '<li class="' + (done.has(m[0]) ? 'done' : m === next ? 'next' : '') + '"><span class="m-title">' + m[1] + '</span>' +
      '<span class="m-how">' + m[2] + '</span></li>').join('');
    $('score').textContent = MISSIONS.filter(m => done.has(m[0])).length + ' / ' + MISSIONS.length;
  }
  $('reset-missions').addEventListener('click', resetMissions);
  const mark = ev => {
    if (MISSIONS.some(m => m[0] === ev) && !done.has(ev)) { done.add(ev); drawMissions(); }
  };
  host.on((ev, data) => {
    if (ev === 'view') updateWhere(data);
    mark(ev);
    if (ev === 'submit' && data.name === 'COBRUN' && data.status === 'CC 0000') mark('cobol');
  });

  // ---------- theme toggle (shared with ZSpeak) ---------------------------
  (function () {
    const btn = $('theme-btn'), root = document.documentElement, order = ['auto', 'light', 'dark'];
    const show = () => { btn.textContent = 'theme: ' + (root.getAttribute('data-theme') || 'auto'); };
    btn.addEventListener('click', () => {
      const next = order[(order.indexOf(root.getAttribute('data-theme')) + 1) % order.length];
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('zspeak-theme', next); } catch (e) {}
      show();
    });
    show();
  })();

  updateWhere('disconnected');
  drawMissions();
  render();
})();
