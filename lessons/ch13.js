/* Chapter 13. 데이터베이스 (SQLite)
 * 강의자료: Ch13_데이터베이스.pptx
 * Section 01 이 장에서 만들 프로그램 / Section 02 데이터베이스의 기본 / Section 03 데이터베이스의 구축 ([프로그램 1])
 * Section 04 데이터의 입력과 조회 ([프로그램 2])
 * - sqlite3.exe 명령행 도구는 브라우저에서 실행할 수 없으므로 화면 그림 + 같은 일을 하는 파이썬 코드로 바꾸어 실습한다.
 * - DB 파일(naverDB)은 작업 폴더에 만들어진다. 모든 예제는 스스로 테이블을 만들어 여러 번 실행해도 된다.
 */
(function () {
  /* ---------- SVG 도우미 ---------- */
  const SV = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" width="100%" xmlns="http://www.w3.org/2000/svg" role="img">${body}</svg>`;
  const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" text-anchor="${o.a || 'middle'}" font-size="${o.fs || 20}" fill="${o.c || 'var(--fg)'}"${o.b ? ' font-weight="bold"' : ''}${o.mono ? ' font-family="monospace"' : ''}>${s}</text>`;
  const R = (x, y, w, h, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx == null ? 8 : o.rx}" fill="${o.f || 'var(--card)'}"${o.op ? ` fill-opacity="${o.op}"` : ''} stroke="${o.s || 'var(--line)'}" stroke-width="${o.sw || 2}"${o.dash ? ' stroke-dasharray="7 5"' : ''}/>`;
  const Ln = (x1, y1, x2, y2, o = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${o.s || 'var(--muted)'}" stroke-width="${o.sw || 2}"${o.dash ? ' stroke-dasharray="6 5"' : ''}${o.arrow ? ' marker-end="url(#arr13db)"' : ''}/>`;
  const DEFS = `<defs><marker id="arr13db" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--muted)"/></marker></defs>`;
  /* 원통(데이터베이스) */
  const CYL = (x, y, w, h, o = {}) => {
    const ry = o.ry || 16, f = o.f || 'var(--accent)', op = o.op || 0.15, s = o.s || 'var(--accent)';
    return `<path d="M${x} ${y} v${h} a${w / 2} ${ry} 0 0 0 ${w} 0 v${-h}" fill="${f}" fill-opacity="${op}" stroke="${s}" stroke-width="2"/>` +
      `<ellipse cx="${x + w / 2}" cy="${y}" rx="${w / 2}" ry="${ry}" fill="${f}" fill-opacity="${op * 2}" stroke="${s}" stroke-width="2"/>`;
  };
  /* 표 그리기: rows[0] 은 머리글 */
  const TBL = (x, y, ws, rows, o = {}) => {
    const rh = o.rh || 38;
    let s = '';
    rows.forEach((r, ri) => {
      let cx = x;
      r.forEach((c, ci) => {
        s += `<rect x="${cx}" y="${y + ri * rh}" width="${ws[ci]}" height="${rh}" fill="${ri === 0 ? 'var(--accent)' : 'var(--card)'}" fill-opacity="${ri === 0 ? 0.25 : 1}" stroke="var(--muted)" stroke-width="1"/>` +
          T(cx + 8, y + ri * rh + rh * 0.66, c, { a: 'start', fs: o.fs || 17, b: ri === 0, mono: o.mono });
        cx += ws[ci];
      });
    });
    return s;
  };

  /* 명령 프롬프트(sqlite3.exe) 화면 흉내 */
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const TERM = (title, lines) => `<div style="max-width:900px;margin:0 auto;border:1px solid var(--line);border-radius:8px;overflow:hidden;font-family:Consolas,'D2Coding',monospace">` +
    `<div style="background:#dfe3ea;color:#222;padding:4px 12px;font-size:14px">▣ ${esc(title)}</div>` +
    `<pre style="margin:0;background:#0c0c0c;color:#d4d4d4;padding:10px 14px;font-size:15px;line-height:1.45;white-space:pre;overflow-x:auto">` +
    lines.map((l) => l.startsWith('sqlite>') ? `<span style="color:#7fb8ff">sqlite&gt;</span><span style="color:#ffd75f">${esc(l.slice(7))}</span>` : esc(l)).join('\n') +
    `</pre></div>`;
  const TERM_TITLE = 'C:\\sqlite\\sqlite3.exe';

  const T_START = TERM(TERM_TITLE, [
    'SQLite version 3.36.0 2021-06-18 18:36:39',
    'Enter ".help" for usage hints.',
    'Connected to a transient in-memory database.',
    'Use ".open FILENAME" to reopen on a persistent database.',
    'sqlite> '
  ]);
  const T_OPEN = TERM(TERM_TITLE, ['sqlite> .open naverDB', 'sqlite> ']);
  const T_CREATE = TERM(TERM_TITLE, [
    'sqlite> CREATE TABLE userTable (id char(4), userName char(15), email char(15), birthYear int);',
    'sqlite> .table',
    'userTable',
    'sqlite> .schema userTable',
    'CREATE TABLE userTable (id char(4), userName char(15), email char(15), birthYear int);',
    'sqlite> '
  ]);
  const T_INSERT = TERM(TERM_TITLE, [
    "sqlite> INSERT INTO userTable VALUES('john', 'John Bann', 'john@naver.com', 1990);",
    "sqlite> INSERT INTO userTable VALUES('kim', 'Kim Chi', 'kim@daum.net', 1992);",
    "sqlite> INSERT INTO userTable VALUES('lee', 'Lee Pal', 'lee@paran.com', 1988);",
    "sqlite> INSERT INTO userTable VALUES('park', 'Park Su', 'park@gmail.com', 1980);",
    'sqlite> '
  ]);
  const T_SELECT = TERM(TERM_TITLE, [
    'sqlite> .header on',
    'sqlite> .mode column',
    'sqlite> SELECT * FROM userTable;',
    'id    userName   email           birthYear',
    '----  ---------  --------------  ---------',
    'john  John Bann  john@naver.com  1990',
    'kim   Kim Chi    kim@daum.net    1992',
    'lee   Lee Pal    lee@paran.com   1988',
    'park  Park Su    park@gmail.com  1980',
    'sqlite> '
  ]);
  const T_WHERE = TERM(TERM_TITLE, [
    'sqlite> SELECT id, birthYear FROM userTable WHERE birthYear <= 1990;',
    'john|1990',
    'lee|1988',
    'park|1980',
    "sqlite> SELECT * FROM userTable WHERE id = 'park';",
    'park|Park Su|park@gmail.com|1980',
    'sqlite> SELECT * FROM userTable ORDER BY birthYear;',
    'park|Park Su|park@gmail.com|1980',
    'lee|Lee Pal|lee@paran.com|1988',
    'john|John Bann|john@naver.com|1990',
    'kim|Kim Chi|kim@daum.net|1992',
    'sqlite> .quit'
  ]);

  /* 그림 13-1 DBMS 구성도 */
  const F_DBMS = SV(1280, 610, [
    DEFS,
    R(30, 45, 1220, 545, { f: 'none', s: 'var(--accent2)', sw: 3, rx: 14 }),
    T(640, 32, 'DBMS (SQLite)', { fs: 26, b: 1, c: 'var(--accent2)' }),
    CYL(880, 80, 150, 50, { f: 'var(--ok)' }), T(955, 120, 'A 데이터베이스', { fs: 17 }),
    CYL(1060, 80, 150, 50, { f: 'var(--warn)', s: 'var(--warn)' }), T(1135, 120, 'B 데이터베이스', { fs: 17 }),
    CYL(90, 175, 1100, 370, { ry: 30 }),
    T(640, 182, 'naverDB (네이버 데이터베이스)', { fs: 22, b: 1 }),
    T(420, 245, '회원 테이블 (userTable)', { fs: 21, b: 1 }),
    TBL(150, 265, [100, 150, 210, 120], [
      ['id', 'userName', 'email', 'birthYear'],
      ['john', 'John Bann', 'john@naver.com', '1990'],
      ['kim', 'Kim Chi', 'kim@daum.net', '1992'],
      ['lee', 'Lee Pal', 'lee@paran.com', '1988'],
      ['park', 'Park Su', 'park@gmail.com', '1980']
    ], { fs: 17 }),
    R(146, 300, 588, 42, { f: 'none', s: 'var(--danger)', sw: 3, rx: 4 }),
    R(146, 261, 108, 200, { f: 'none', s: 'var(--accent2)', sw: 3, rx: 4, dash: 1 }),
    Ln(80, 321, 140, 321, { arrow: 1, sw: 3 }), T(70, 300, '행(로우)', { fs: 19, b: 1, c: 'var(--danger)' }),
    Ln(200, 520, 200, 468, { arrow: 1, sw: 3 }), T(200, 548, '열(컬럼)', { fs: 19, b: 1, c: 'var(--accent2)' }),
    Ln(110, 230, 170, 268, { arrow: 1, sw: 2 }), T(95, 222, '열 이름', { fs: 18, b: 1 }),
    T(640, 510, '데이터: john, lee@paran.com, 1980 … 칸 하나하나의 값', { fs: 18, c: 'var(--muted)', a: 'start' }),
    T(900, 250, 'B 테이블', { fs: 18, a: 'start' }),
    TBL(900, 262, [70, 70, 70], [['', '', ''], ['', '', ''], ['', '', '']], { rh: 24 }),
    T(900, 370, 'C 테이블', { fs: 18, a: 'start' }),
    TBL(900, 382, [70, 70, 70], [['', '', ''], ['', '', ''], ['', '', '']], { rh: 24 }),
    Ln(800, 230, 740, 262, { arrow: 1 }), Ln(820, 230, 895, 262, { arrow: 1 }), Ln(820, 230, 895, 385, { arrow: 1 }),
    T(812, 222, '테이블', { fs: 19, b: 1 })
  ].join(''));

  /* 그림 13-2 데이터베이스 구축 및 운영 과정 */
  const stepBox = (x, y, w, t, o = {}) => R(x, y, w, 50, { f: o.f || 'var(--ok)', op: o.op || 0.3, s: o.s || 'var(--ok)', sw: 2 }) + T(x + w / 2, y + 33, t, { fs: o.fs || 21, b: o.b });
  const F_STEPS = SV(1280, 470, [
    DEFS,
    stepBox(60, 30, 300, '1단계', { b: 1, op: 0.6 }), stepBox(60, 100, 300, 'DBMS 설치'),
    stepBox(490, 30, 300, '2단계', { b: 1, op: 0.6 }), stepBox(490, 100, 300, '데이터베이스 구축'),
    stepBox(920, 30, 300, '3단계', { b: 1, op: 0.6 }),
    R(920, 100, 300, 76, { f: 'var(--ok)', op: 0.3, s: 'var(--ok)' }), T(1070, 132, '응용 프로그램에서', { fs: 20 }), T(1070, 160, '구축된 데이터 활용', { fs: 20 }),
    Ln(375, 55, 470, 55, { arrow: 1, sw: 4 }), Ln(805, 55, 900, 55, { arrow: 1, sw: 4 }),
    R(470, 160, 340, 290, { f: 'none', s: 'var(--ok)', sw: 3, rx: 12 }),
    T(640, 205, '❶ 데이터베이스 생성', { fs: 20 }), Ln(640, 215, 640, 250, { arrow: 1 }),
    T(640, 275, '❷ 테이블 생성', { fs: 20 }), Ln(640, 285, 640, 320, { arrow: 1 }),
    T(640, 345, '❸ 데이터 입력', { fs: 20 }), Ln(640, 355, 640, 390, { arrow: 1 }),
    T(640, 415, '❹ 데이터 조회 및 활용', { fs: 20 }),
    T(210, 200, 'sqlite3.exe 내려받기', { fs: 18, c: 'var(--muted)' }),
    T(210, 228, '(파이썬은 sqlite3 모듈 내장)', { fs: 18, c: 'var(--muted)' }),
    T(1070, 220, '[프로그램 2]', { fs: 18, c: 'var(--muted)' }),
    T(1070, 248, '파이썬 · GUI 에서 활용', { fs: 18, c: 'var(--muted)' }),
    T(640, 185, '[프로그램 1] SQL 문으로 직접', { fs: 16, c: 'var(--muted)' })
  ].join(''));

  /* 입력 · 조회 순서 흐름도 */
  const NUMS = '❶❷❸❹❺❻';
  const FLOW = (steps, loopAt) => {
    const h = steps.length * 84 + 10;
    return SV(1280, h, DEFS + steps.map((st, i) => {
      const y = 10 + i * 84;
      let s = T(185, y + 35, NUMS[i], { fs: 26, c: 'var(--accent)' }) +
        R(215, y, 330, 52, { f: 'var(--ok)', op: 0.3, s: 'var(--ok)', sw: 2 }) + T(380, y + 34, st[0], { fs: 21, b: 1 }) +
        T(580, y + 34, st[1], { a: 'start', fs: 21, mono: 1, c: 'var(--accent2)' });
      if (i < steps.length - 1) s += Ln(380, y + 54, 380, y + 80, { arrow: 1, sw: 3 });
      if (i === loopAt) s += `<path d="M215 ${y + 44} H130 V${y + 8} H209" fill="none" stroke="var(--accent2)" stroke-width="3" marker-end="url(#arr13db)"/>` + T(95, y + 33, '반복', { fs: 20, b: 1, c: 'var(--accent2)' });
      return s;
    }).join(''));
  };
  const F_FLOW_IN = FLOW([
    ['데이터베이스 연결', 'con = sqlite3.connect("DB이름")'],
    ['커서 생성', 'cur = con.cursor()'],
    ['(테이블 만들기)', 'cur.execute("CREATE TABLE 문")'],
    ['데이터 입력', 'cur.execute("INSERT 문")'],
    ['입력한 데이터 저장', 'con.commit()'],
    ['데이터베이스 닫기', 'con.close()']
  ], 3);
  const F_FLOW_OUT = FLOW([
    ['데이터베이스 연결', 'con = sqlite3.connect("DB이름")'],
    ['커서 생성', 'cur = con.cursor()'],
    ['데이터 조회', 'cur.execute("SELECT 문")'],
    ['조회한 데이터 출력', 'row = cur.fetchone()'],
    ['데이터베이스 닫기', 'con.close()']
  ], 3);

  /* 연결자와 커서 */
  const F_CURSOR = SV(1280, 300, [
    DEFS,
    R(30, 80, 250, 130, { f: 'var(--accent)', op: 0.15, s: 'var(--accent)', sw: 3 }),
    T(155, 135, '파이썬 프로그램', { fs: 22, b: 1 }), T(155, 170, '(main.py)', { fs: 18, c: 'var(--muted)', mono: 1 }),
    R(280, 125, 700, 40, { f: 'var(--line)', op: 0.5, s: 'var(--muted)', rx: 20 }),
    T(630, 152, 'con — 연결자(Connection) : DB 와 이어진 통로', { fs: 18 }),
    R(520, 20, 220, 60, { f: 'var(--warn)', op: 0.25, s: 'var(--warn)', sw: 3 }),
    T(630, 58, 'cur — 커서(Cursor)', { fs: 20, b: 1 }),
    Ln(330, 105, 900, 105, { arrow: 1, sw: 3, s: 'var(--accent2)' }),
    T(420, 98, 'execute("SQL 문") →', { fs: 18, c: 'var(--accent2)', mono: 1, a: 'start' }),
    Ln(900, 195, 330, 195, { arrow: 1, sw: 3, s: 'var(--ok)' }),
    T(420, 230, '← fetchone() / fetchall() : 결과 행 돌려받기', { fs: 18, c: 'var(--ok)', a: 'start' }),
    CYL(1000, 80, 230, 130, { ry: 20 }), T(1115, 160, 'naverDB', { fs: 22, b: 1, mono: 1 }), T(1115, 190, '(작업 폴더의 파일)', { fs: 16, c: 'var(--muted)' }),
    T(640, 285, '커서는 SQL 문을 DB 로 가져가고, 실행 결과를 다시 가져오는 "배달원" 역할', { fs: 19, c: 'var(--muted)' })
  ].join(''));

  /* 커밋 */
  const F_COMMIT = SV(1280, 330, [
    DEFS,
    R(30, 60, 260, 110, { f: 'var(--accent)', op: 0.15, s: 'var(--accent)' }),
    T(160, 105, 'cur.execute(', { fs: 19, mono: 1 }), T(160, 135, '"INSERT ...")', { fs: 19, mono: 1 }),
    Ln(300, 115, 400, 115, { arrow: 1, sw: 3 }),
    R(410, 40, 380, 150, { f: 'var(--warn)', op: 0.12, s: 'var(--warn)', dash: 1 }),
    T(600, 75, '임시 작업 공간 (트랜잭션)', { fs: 20, b: 1 }),
    T(600, 110, "('su', 'Su Ji', ...)  ← 아직 파일에 없음", { fs: 17, mono: 1 }),
    T(600, 140, "('woo', 'Woo Ja', ...)", { fs: 17, mono: 1 }),
    T(600, 172, '같은 연결(con) 안에서만 보임', { fs: 16, c: 'var(--muted)' }),
    Ln(800, 115, 960, 115, { arrow: 1, sw: 4, s: 'var(--ok)' }), T(880, 100, 'con.commit()', { fs: 20, b: 1, mono: 1, c: 'var(--ok)' }),
    CYL(980, 60, 240, 120, { ry: 18, f: 'var(--ok)', s: 'var(--ok)' }), T(1100, 135, 'naverDB 파일', { fs: 20, b: 1 }), T(1100, 162, '영구 저장 ✔', { fs: 18, c: 'var(--ok)' }),
    Ln(600, 195, 600, 255, { arrow: 1, sw: 3, s: 'var(--danger)' }),
    T(600, 285, 'commit() 없이 con.close() 또는 프로그램 종료 → 임시 내용은 버려짐 ✕', { fs: 20, c: 'var(--danger)', b: 1 }),
    T(600, 318, '(명령행 도구 sqlite3.exe 는 문장마다 자동으로 저장해 줍니다)', { fs: 17, c: 'var(--muted)' })
  ].join(''));

  /* rows 저장 형태 */
  const F_ROWS = SV(1280, 400, [
    DEFS,
    T(40, 36, 'rows = cur.fetchall()   →   리스트 안에 튜플(한 행)이 들어 있는 모양', { a: 'start', fs: 21, b: 1 }),
    R(170, 60, 900, 300, { f: 'none', s: 'var(--accent)', sw: 3, rx: 16 }),
    T(1085, 90, 'rows (list)', { a: 'start', fs: 18, c: 'var(--accent)', mono: 1 }),
    ...['[0]', '[1]', '[2]', '[3]'].map((t, i) => T([245, 395, 600, 830][i], 88, t, { fs: 17, c: 'var(--muted)', mono: 1 })),
    ...[
      ['john', 'John Bann', 'john@naver.com', '1990'],
      ['kim', 'Kim Chi', 'kim@daum.net', '1992'],
      ['lee', 'Lee Pal', 'lee@paran.com', '1988'],
      ['park', 'Park Su', 'park@gmail.com', '1980'],
      ['su', 'Su Ji', 'suji@naver.com', '1994']
    ].map((r, i) => T(100, 130 + i * 50, `rows[${i}]`, { fs: 18, mono: 1, c: 'var(--muted)' }) +
      R(190, 102 + i * 50, 700, 40, { f: 'var(--warn)', op: 0.12, s: 'var(--warn)', rx: 18 }) +
      T(205, 130 + i * 50, '(', { fs: 20, mono: 1, a: 'start' }) +
      T(245, 130 + i * 50, `'${r[0]}'`, { fs: 18, mono: 1 }) + T(395, 130 + i * 50, `'${r[1]}'`, { fs: 18, mono: 1 }) +
      T(600, 130 + i * 50, `'${r[2]}'`, { fs: 18, mono: 1 }) + T(830, 130 + i * 50, r[3], { fs: 18, mono: 1, c: 'var(--accent2)' }) +
      T(875, 130 + i * 50, ')', { fs: 20, mono: 1, a: 'start' })).join(''),
    T(920, 180, 'rows[0][1] → ', { a: 'start', fs: 18, mono: 1 }), T(1060, 180, "'John Bann'", { a: 'start', fs: 18, mono: 1, c: 'var(--accent2)' }),
    T(920, 230, 'rows[3][3] → 1980', { a: 'start', fs: 18, mono: 1 }),
    T(920, 280, 'len(rows) → 5', { a: 'start', fs: 18, mono: 1 }),
    T(640, 390, '문자열 열은 str, int 로 만든 열은 int 로 꺼내집니다 (1990 에 따옴표가 없음)', { fs: 18, c: 'var(--muted)' })
  ].join(''));

  /* fetchone 이 한 행씩 내려가는 모습 */
  const F_FETCH = SV(1280, 330, [
    DEFS,
    T(40, 34, 'cur.execute("SELECT * FROM userTable") 뒤의 결과 행', { a: 'start', fs: 21, b: 1 }),
    ...['john', 'kim', 'lee', 'park', 'su'].map((n, i) => R(300, 55 + i * 46, 420, 38, { f: i === 2 ? 'var(--warn)' : 'var(--card)', op: i === 2 ? 0.3 : 0, s: 'var(--muted)', rx: 4 }) +
      T(320, 81 + i * 46, `('${n}', ...)`, { a: 'start', fs: 18, mono: 1 }) + T(760, 81 + i * 46, `${i + 1}번째 fetchone()`, { a: 'start', fs: 17, c: 'var(--muted)' })).join(''),
    R(300, 285, 420, 38, { f: 'none', s: 'var(--danger)', rx: 4, dash: 1 }), T(510, 311, '더 이상 행 없음 → None', { fs: 18, c: 'var(--danger)' }),
    Ln(150, 166, 290, 166, { arrow: 1, sw: 4, s: 'var(--accent2)' }), T(150, 150, '커서 위치', { fs: 18, b: 1, c: 'var(--accent2)' }),
    T(150, 200, '(지금 3번째)', { fs: 16, c: 'var(--muted)' }),
    T(1000, 311, '→ while 문 탈출(break)', { a: 'start', fs: 17, c: 'var(--danger)' })
  ].join(''));

  /* [프로그램 2] 화면 흉내 */
  const GUI_ROWS = [['사용자ID', '사용자이름', '이메일', '출생연도'], ['-----------', '-----------', '-----------', '-----------'],
    ['john', 'John Bann', 'john@naver.com', '1990'], ['kim', 'Kim Chi', 'kim@daum.net', '1992'], ['lee', 'Lee Pal', 'lee@paran.com', '1988'],
    ['park', 'Park Su', 'park@gmail.com', '1980'], ['su', 'Su Ji', 'suji@naver.com', '1994'], ['woo', 'Woo Ja', 'woo@hanbit.co.kr', '2002']];
  const F_GUI = SV(1280, 470, [
    DEFS,
    `<rect x="140" y="10" width="1000" height="450" rx="6" fill="#f0f0f0" stroke="#8a93a3" stroke-width="2"/>`,
    `<rect x="140" y="10" width="1000" height="38" rx="6" fill="#6b7a90"/>`,
    `<text x="165" y="36" font-size="18" fill="#fff">🪶 GUI 데이터 입력</text><text x="1060" y="36" font-size="18" fill="#fff">—  ☐  ✕</text>`,
    ...['woo', 'Woo Ja', 'woo@hanbit.co.kr', '2002'].map((t, i) => `<rect x="${230 + i * 150}" y="62" width="130" height="30" fill="#fff" stroke="#999"/><text x="${236 + i * 150}" y="83" font-size="16" fill="#222">${t}</text>`).join(''),
    `<rect x="840" y="60" width="60" height="34" rx="3" fill="#e1e1e1" stroke="#777"/><text x="870" y="83" font-size="17" text-anchor="middle" fill="#222">입력</text>`,
    `<rect x="920" y="60" width="60" height="34" rx="3" fill="#e1e1e1" stroke="#777"/><text x="950" y="83" font-size="17" text-anchor="middle" fill="#222">조회</text>`,
    R(215, 54, 780, 48, { f: 'none', s: 'var(--danger)', sw: 2, dash: 1, rx: 4 }),
    T(215, 122, 'edtFrame : Entry 4개 + Button 2개 (side=LEFT)', { a: 'start', fs: 16, c: 'var(--danger)' }),
    ...[0, 1, 2, 3].map((c) => `<rect x="${150 + c * 247}" y="135" width="243" height="315" fill="#ecec4a" stroke="#999"/>` +
      GUI_ROWS.map((r, ri) => `<text x="${156 + c * 247}" y="${160 + ri * 26}" font-size="16" fill="#222">${r[c]}</text>`).join('')).join(''),
    Ln(150, 368, 1120, 368, { s: 'var(--danger)', sw: 3 }),
    T(1140, 170, 'listFrame', { a: 'start', fs: 16, c: 'var(--accent2)' }), T(1140, 192, 'Listbox 4개', { a: 'start', fs: 16, c: 'var(--accent2)' }),
    T(640, 440, '[입력] → 입력칸의 값을 INSERT      [조회] → SELECT 결과를 4개의 리스트 상자에 표시', { fs: 17, c: '#333' })
  ].join(''));

  /* zip 으로 4개 리스트를 리스트 상자로 */
  const F_ZIP = SV(1280, 360, [
    DEFS,
    ...[['strData1', ['사용자ID', '-------', 'john', 'kim', '…']], ['strData2', ['사용자이름', '-------', 'John Bann', 'Kim Chi', '…']],
      ['strData3', ['이메일', '-------', 'john@naver.com', 'kim@daum.net', '…']], ['strData4', ['출생연도', '-------', '1990', '1992', '…']]]
      .map(([name, vals], c) => {
        const x = 60 + c * 300;
        return T(x + 110, 30, name, { fs: 19, b: 1, mono: 1 }) + vals.map((v, i) => R(x, 44 + i * 34, 220, 30, { f: i === 2 ? 'var(--warn)' : 'var(--card)', op: i === 2 ? 0.35 : 0, s: 'var(--muted)', rx: 3 }) + T(x + 10, 65 + i * 34, v, { a: 'start', fs: 16 })).join('') +
          Ln(x + 110, 220, x + 110, 268, { arrow: 1, sw: 3, s: 'var(--accent2)' }) +
          `<rect x="${x}" y="272" width="220" height="44" fill="#ecec4a" stroke="#999"/>` + `<text x="${x + 110}" y="300" font-size="18" text-anchor="middle" fill="#222">listData${c + 1}</text>`;
      }),
    T(640, 250, 'insert(END, item)', { fs: 17, mono: 1, c: 'var(--accent2)' }),
    T(640, 345, 'zip() 은 네 리스트에서 같은 위치의 값을 하나씩 꺼내 (item1, item2, item3, item4) 로 묶어 줍니다 — 노란 칸이 한 번에 꺼내지는 값', { fs: 17, c: 'var(--muted)' })
  ].join(''));

  /* SQL 문자열 이어 붙이기 */
  const S = (t, c) => `<span style="color:${c}">${esc(t)}</span>`;
  const F_CONCAT = `<div style="font-family:Consolas,'D2Coding',monospace;font-size:15px;line-height:1.9;padding:12px 16px;border:1px solid var(--line);border-radius:10px;background:var(--card);overflow-x:auto">` +
    `<div>sql = ${S('"INSERT INTO userTable VALUES(\'"', 'var(--muted)')} + ${S('data1', 'var(--accent)')} + ${S('"\',\'"', 'var(--muted)')} + ${S('data2', 'var(--accent)')} + ${S('"\',\'"', 'var(--muted)')} + ${S('data3', 'var(--accent)')} + ${S('"\',"', 'var(--muted)')} + ${S('data4', 'var(--accent2)')} + ${S('")"', 'var(--muted)')}</div>` +
    `<div style="margin-top:6px">입력: data1=${S('su', 'var(--accent)')}, data2=${S('Su Ji', 'var(--accent)')}, data3=${S('suji@naver.com', 'var(--accent)')}, data4=${S('1994', 'var(--accent2)')}</div>` +
    `<div style="margin-top:6px">결과: INSERT INTO userTable VALUES('${S('su', 'var(--accent)')}','${S('Su Ji', 'var(--accent)')}','${S('suji@naver.com', 'var(--accent)')}',${S('1994', 'var(--accent2)')})</div>` +
    `<div style="margin-top:6px;color:var(--muted);font-family:inherit">문자열 열(id · 이름 · 이메일)은 작은따옴표로 감싸고, 숫자 열(출생연도)은 따옴표 없이 붙입니다.</div></div>`;

  /* ---------- 파이썬 코드 조각 ---------- */
  const U_CREATE = `cur.execute("CREATE TABLE userTable (id char(4), userName char(15), email char(15), birthYear int)")`;
  const U_CREATE_IF = `cur.execute("CREATE TABLE IF NOT EXISTS userTable (id char(4), userName char(15), email char(15), birthYear int)")`;
  const U_INS = [
    `cur.execute("INSERT INTO userTable VALUES('john', 'John Bann', 'john@naver.com', 1990)")`,
    `cur.execute("INSERT INTO userTable VALUES('kim', 'Kim Chi', 'kim@daum.net', 1992)")`,
    `cur.execute("INSERT INTO userTable VALUES('lee', 'Lee Pal', 'lee@paran.com', 1988)")`,
    `cur.execute("INSERT INTO userTable VALUES('park', 'Park Su', 'park@gmail.com', 1980)")`
  ];
  const U_SU = `cur.execute("INSERT INTO userTable VALUES('su', 'Su Ji', 'suji@naver.com', 1994)")`;
  /* 처음부터 다시 만들기 (4명) */
  const FRESH = `cur.execute("DROP TABLE IF EXISTS userTable")     # 여러 번 실행해도 되도록 지우고 시작
${U_CREATE}
${U_INS.join('\n')}
con.commit()`;
  /* 비어 있으면 5명 넣어 두기 (앞 예제에서 입력한 데이터는 그대로 둠) */
  const PREP = `# (웹 강좌용 준비) 테이블이 없거나 비어 있으면 예시 데이터 5건을 넣어 둔다
${U_CREATE_IF}
cur.execute("SELECT COUNT(*) FROM userTable")
if cur.fetchone()[0] == 0 :
    ${U_INS.join('\n    ')}
    ${U_SU}
    con.commit()`;
  const P_CREATE_IF = `cur.execute("CREATE TABLE IF NOT EXISTS productTable (pCode char(5), pName char(15), price int, amount int)")`;
  const PREP_P = `# (웹 강좌용 준비) productTable 이 없거나 비어 있으면 3건을 넣어 둔다
${P_CREATE_IF}
cur.execute("SELECT COUNT(*) FROM productTable")
if cur.fetchone()[0] == 0 :
    cur.execute("INSERT INTO productTable VALUES('p0001', '노트북', 110, 5)")
    cur.execute("INSERT INTO productTable VALUES('p0002', '마우스', 3, 22)")
    cur.execute("INSERT INTO productTable VALUES('p0003', '키보드', 2, 11)")
    con.commit()`;
  /* .header on + .mode column 흉내 함수 */
  const SHOW = `import unicodedata

def width(s) :                   # 화면에서 차지하는 칸 수 (한글은 2칸)
    return sum(2 if unicodedata.east_asian_width(ch) in "WF" else 1 for ch in str(s))

def show(cur) :                  # sqlite> .header on + .mode column 흉내
    heads = [d[0] for d in cur.description]
    rows = cur.fetchall()
    ws = [max([width(h)] + [width(r[i]) for r in rows]) for i, h in enumerate(heads)]
    print("  ".join(h + " " * (w - width(h)) for h, w in zip(heads, ws)))
    print("  ".join("-" * w for w in ws))
    for r in rows :
        print("  ".join(str(v) + " " * (w - width(v)) for v, w in zip(r, ws)))`;

  /* ---------- 코드 예제 ---------- */
  const C_FIRST = `import sqlite3

con = sqlite3.connect("naverDB")      # 데이터베이스 파일 열기 (없으면 새로 만듦)
cur = con.cursor()                    # SQL 문을 실어 나를 커서 만들기

${FRESH}

cur.execute("SELECT * FROM userTable")
for row in cur.fetchall() :
    print(row)

con.close()`;

  const C_TERMS = `import sqlite3

con = sqlite3.connect("naverDB")
cur = con.cursor()
${FRESH}

cur.execute("SELECT * FROM userTable")
names = [d[0] for d in cur.description]      # 열 이름 목록
rows = cur.fetchall()                        # 모든 행

print("열 이름 :", names)
print("열 개수 :", len(names))
print("행 개수 :", len(rows))
print("첫 번째 행 :", rows[0])
print("첫 번째 행의 email 데이터 :", rows[0][2])
con.close()`;

  const C_OPEN = `import sqlite3
import os

con = sqlite3.connect("naverDB")      # sqlite> .open naverDB 와 같은 일
print("naverDB 파일이 있나요?", os.path.exists("naverDB"))
con.close()`;

  const C_CREATE = `import sqlite3

con = sqlite3.connect("naverDB")      # sqlite> .open naverDB
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS userTable")

# sqlite> CREATE TABLE userTable (id char(4), userName char(15), email char(15), birthYear int);
${U_CREATE}

# sqlite> .table  → 테이블 목록 (sqlite_master 는 SQLite 가 관리하는 목록 테이블)
cur.execute("SELECT name FROM sqlite_master WHERE type = 'table'")
for row in cur.fetchall() :
    print(row[0])

# sqlite> .schema userTable  → 테이블을 만든 SQL 문
cur.execute("SELECT sql FROM sqlite_master WHERE name = 'userTable'")
print(cur.fetchone()[0] + ";")

con.close()`;

  const C_CREATE_TWICE = `import sqlite3

con = sqlite3.connect("naverDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS userTable")
${U_CREATE}
print("첫 번째 CREATE 성공")
${U_CREATE}
print("두 번째 CREATE 성공")
con.close()`;

  const C_CREATE_TWICE_TRY = `import sqlite3

con = sqlite3.connect("naverDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS userTable")
${U_CREATE}
print("첫 번째 CREATE 성공")
try :
    ${U_CREATE}
except sqlite3.OperationalError as e :
    print("오류 :", e)
con.close()`;

  const C_CREATE_IF = `import sqlite3

con = sqlite3.connect("naverDB")
cur = con.cursor()
${U_CREATE_IF}
print("첫 번째 실행 성공")
${U_CREATE_IF}
print("두 번째 실행도 성공 (이미 있으면 그냥 넘어감)")
con.close()`;

  const C_INSERT = `import sqlite3

con = sqlite3.connect("naverDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS userTable")
${U_CREATE}

# sqlite> INSERT INTO userTable VALUES('john', 'John Bann', 'john@naver.com', 1990);  … 4번
${U_INS.join('\n')}
con.commit()        # 파이썬에서는 commit() 을 해야 파일에 저장됨

cur.execute("SELECT COUNT(*) FROM userTable")      # 행 개수 세기
print("입력된 행 개수 :", cur.fetchone()[0])
con.close()`;

  const C_AFFINITY = `import sqlite3

con = sqlite3.connect(":memory:")    # 파일 없이 메모리에만 만드는 임시 DB
cur = con.cursor()
cur.execute("CREATE TABLE t (id char(4), year int)")
cur.execute("INSERT INTO t VALUES('abcdefgh', '2000')")   # 4글자보다 긴 id, 문자열 '2000'
cur.execute("SELECT id, year, typeof(year) FROM t")
print(cur.fetchone())
con.close()`;

  const C_PROG1 = `import sqlite3
${SHOW}

## 메인 코드 부분 ##
con = sqlite3.connect("naverDB")                 # sqlite> .open naverDB
cur = con.cursor()
${FRESH}

cur.execute("SELECT * FROM userTable")           # sqlite> SELECT * FROM userTable;
show(cur)                                        # .header on + .mode column 으로 보기
con.close()`;

  const C_PROG1_SHORT = `import sqlite3

con = sqlite3.connect("naverDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS userTable")
${U_CREATE}
${U_INS.join('\n')}
con.commit()

cur.execute("SELECT * FROM userTable")
print("id    userName   email           birthYear")
print("----  ---------  --------------  ---------")
for row in cur.fetchall() :
    print(f"{row[0]:<6}{row[1]:<11}{row[2]:<16}{row[3]}")
con.close()`;

  const C_LISTMODE = `import sqlite3

con = sqlite3.connect("naverDB")
cur = con.cursor()
${FRESH}

def query(sql) :                 # sqlite> 에 SQL 문을 입력한 것처럼 보여 주기 (기본 list 모드)
    print("sqlite>", sql + ";")
    cur.execute(sql)
    for row in cur.fetchall() :
        print("|".join(str(v) for v in row))

query("SELECT id, birthYear FROM userTable WHERE birthYear <= 1990")    # ❶
query("SELECT * FROM userTable WHERE id = 'park'")                      # ❷
query("SELECT * FROM userTable ORDER BY birthYear")                     # ❸
con.close()                                                             # ❹ sqlite> .quit`;

  const C_WHERE_MORE = `import sqlite3

con = sqlite3.connect("naverDB")
cur = con.cursor()
${FRESH}

print("① 1985년 이후에 태어나고 naver 메일을 쓰는 회원")
cur.execute("SELECT id, email FROM userTable WHERE birthYear > 1985 AND email LIKE '%naver%'")
print(cur.fetchall())

print("② 출생연도가 늦은(젊은) 순서로 id 와 출생연도")
cur.execute("SELECT id, birthYear FROM userTable ORDER BY birthYear DESC")
print(cur.fetchall())

print("③ 회원 수와 가장 빠른 출생연도")
cur.execute("SELECT COUNT(*), MIN(birthYear) FROM userTable")
print(cur.fetchone())
con.close()`;

  const C_UPDATE = `import sqlite3

con = sqlite3.connect("naverDB")
cur = con.cursor()
${FRESH}

# 수정 : kim 의 이메일을 바꾸기
cur.execute("UPDATE userTable SET email = 'kim@gmail.com' WHERE id = 'kim'")
# 삭제 : lee 회원 지우기
cur.execute("DELETE FROM userTable WHERE id = 'lee'")
con.commit()

cur.execute("SELECT * FROM userTable")
for row in cur.fetchall() :
    print(row)
con.close()`;

  const C_REPL = `import sqlite3
con = sqlite3.connect("naverDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS userTable")
${U_CREATE}
${U_INS[0]}
con.commit()
cur.execute("SELECT * FROM userTable")
cur.fetchall()
con.close()`;

  const C_SIX = `import sqlite3

con = sqlite3.connect("naverDB")                                  # ❶ 데이터베이스 연결
cur = con.cursor()                                                # ❷ 커서 생성

cur.execute("DROP TABLE IF EXISTS userTable")                     #    (여러 번 실행해도 되도록)
${U_CREATE}   # ❸ 테이블 만들기

${U_INS.join('\n')}   # ❹ 데이터 입력

con.commit()                                                      # ❺ 입력한 데이터 저장
con.close()                                                       # ❻ 데이터베이스 닫기
print("naverDB 의 userTable 에 4명 저장 완료")`;

  const C_NOCOMMIT = `import sqlite3

con = sqlite3.connect("testDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS t")
cur.execute("CREATE TABLE t (name char(10))")

cur.execute("INSERT INTO t VALUES('홍길동')")
con.close()                          # commit() 없이 닫음 → 입력이 취소됨!

con = sqlite3.connect("testDB")      # 다시 열어서 확인
cur = con.cursor()
cur.execute("SELECT COUNT(*) FROM t")
print("commit 없이 닫은 뒤 행 개수 :", cur.fetchone()[0])

cur.execute("INSERT INTO t VALUES('홍길동')")
con.commit()                         # 이번에는 저장
con.close()

con = sqlite3.connect("testDB")
cur = con.cursor()
cur.execute("SELECT COUNT(*) FROM t")
print("commit 하고 닫은 뒤 행 개수 :", cur.fetchone()[0])
con.close()`;

  const C_13_01 = `import sqlite3

## 변수 선언 부분 ##
con, cur = None, None
data1, data2, data3, data4 = "", "", "", ""
sql = ""

## 메인 코드 부분 ##
con = sqlite3.connect("naverDB")      # 작업 폴더의 naverDB (강의자료: C:/CookPython/naverDB)
cur = con.cursor()
${U_CREATE_IF}   # 웹 강좌용: 테이블이 없으면 만들기

while (True) :
    data1 = input("사용자ID ==> ")
    if data1 == "" :
        break;
    data2 = input("사용자이름 ==> ")
    data3 = input("이메일 ==> ")
    data4 = input("출생연도 ==> ")
    sql = "INSERT INTO userTable VALUES('" + data1 + "','" + data2 + "','" + data3 + "'," + data4 + ")"
    cur.execute(sql)

con.commit()
con.close()`;

  const C_13_01_SHORT = `import sqlite3

con = sqlite3.connect("naverDB")
cur = con.cursor()
${U_CREATE_IF}

while (True) :
    data1 = input("사용자ID ==> ")
    if data1 == "" :
        break;
    data2 = input("사용자이름 ==> ")
    data3 = input("이메일 ==> ")
    data4 = input("출생연도 ==> ")
    sql = "INSERT INTO userTable VALUES('" + data1 + "','" + data2 + "','" + data3 + "'," + data4 + ")"
    cur.execute(sql)

con.commit()
con.close()`;

  const C_QUOTE_ERR = `import sqlite3

con = sqlite3.connect("naverDB")
cur = con.cursor()
${U_CREATE_IF}

data1 = input("사용자ID ==> ")
data2 = input("사용자이름 ==> ")
data3 = input("이메일 ==> ")
data4 = input("출생연도 ==> ")
sql = "INSERT INTO userTable VALUES('" + data1 + "','" + data2 + "','" + data3 + "'," + data4 + ")"
print(sql)
cur.execute(sql)
con.commit()
con.close()`;

  const C_PLACEHOLDER = `import sqlite3

con = sqlite3.connect("naverDB")
cur = con.cursor()
${U_CREATE_IF}

while True :
    data1 = input("사용자ID ==> ")
    if data1 == "" :
        break
    data2 = input("사용자이름 ==> ")
    data3 = input("이메일 ==> ")
    data4 = input("출생연도 ==> ")
    sql = "INSERT INTO userTable VALUES(?, ?, ?, ?)"         # 값 자리에 ? 만 적어 둠
    cur.execute(sql, (data1, data2, data3, int(data4)))     # 값은 튜플로 따로 전달
    print("→", data2, "님 입력 완료")

con.commit()
cur.execute("SELECT * FROM userTable WHERE id = ?", ("tom",))
print(cur.fetchone())
con.close()`;

  const C_13_02 = `import sqlite3

## 변수 선언 부분 ##
con, cur = None, None
data1, data2, data3, data4 = "", "", "", ""
row = None

## 메인 코드 부분 ##
con = sqlite3.connect("naverDB")      # 작업 폴더의 naverDB (강의자료: C:/CookPython/naverDB)
cur = con.cursor()

${PREP}

cur.execute("SELECT * FROM userTable")

print("사용자ID    사용자이름    이메일            출생연도")
print("----------------------------------------------------")

while (True) :
    row = cur.fetchone()
    if row == None :
        break;
    data1 = row[0]
    data2 = row[1]
    data3 = row[2]
    data4 = row[3]
    print("%5s   %15s   %15s   %d" % (data1, data2, data3, data4))

con.close()`;

  const C_13_02_SHORT = `import sqlite3

con = sqlite3.connect("naverDB")
cur = con.cursor()
${U_CREATE_IF}
cur.execute("SELECT * FROM userTable")

print("사용자ID    사용자이름    이메일            출생연도")
print("----------------------------------------------------")
while (True) :
    row = cur.fetchone()
    if row == None :
        break;
    data1 = row[0]
    data2 = row[1]
    data3 = row[2]
    data4 = row[3]
    print("%5s   %15s   %15s   %d" % (data1, data2, data3, data4))
con.close()`;

  const C_FETCHSTEP = `import sqlite3

con = sqlite3.connect("naverDB")
cur = con.cursor()
${PREP}

cur.execute("SELECT id FROM userTable")
print(cur.fetchone())      # 1번째 행
print(cur.fetchone())      # 2번째 행
print(cur.fetchall())      # 남은 행 전부 (리스트)
print(cur.fetchone())      # 더 이상 없음 → None
con.close()`;

  const C_ROWS = `import sqlite3

con = sqlite3.connect("naverDB")
cur = con.cursor()
${PREP}

cur.execute("SELECT * FROM userTable")
rows = cur.fetchall()
print(type(rows), len(rows))
print(rows)
print(rows[0], type(rows[0]))
print(rows[0][1], rows[3][3])
con.close()`;

  const C_FSTRING = `import sqlite3

con = sqlite3.connect("naverDB")
cur = con.cursor()
${PREP}

cur.execute("SELECT * FROM userTable")
print(f"{'사용자ID':<9}{'사용자이름':<10}{'이메일':<15}출생연도")
print("-" * 52)
for uid, name, email, year in cur.fetchall() :      # 튜플을 네 변수로 풀기
    print(f"{uid:<10}{name:<15}{email:<18}{year}")
con.close()`;

  const C_SEARCH = `import sqlite3

con = sqlite3.connect("naverDB")
cur = con.cursor()
${PREP}

year = int(input("몇 년 이후 출생자를 찾을까요? "))
cur.execute("SELECT id, userName, birthYear FROM userTable WHERE birthYear >= ? ORDER BY birthYear", (year,))
rows = cur.fetchall()
for row in rows :
    print(row[0], row[1], row[2], sep=" / ")
print("검색 결과 :", len(rows), "명")
con.close()`;

  const C_ROWFACTORY = `import sqlite3

con = sqlite3.connect("naverDB")
con.row_factory = sqlite3.Row        # 행을 열 이름으로도 꺼낼 수 있게 설정
cur = con.cursor()
${PREP}

cur.execute("SELECT * FROM userTable WHERE birthYear < 1990")
for row in cur.fetchall() :
    print(row["id"], "→", row["email"])     # row[0] 대신 row["id"]
con.close()`;

  const C_13_03 = `import sqlite3
from tkinter import *
from tkinter import messagebox

## 함수 선언 부분 ##
def insertData() :
    con, cur = None, None
    data1, data2, data3, data4 = "", "", "", ""
    sql = ""

    con = sqlite3.connect("naverDB")    # 작업 폴더의 naverDB (강의자료: C:/CookPython/naverDB)
    cur = con.cursor()

    data1 = edt1.get(); data2 = edt2.get(); data3 = edt3.get(); data4 = edt4.get()
    try :
        sql = "INSERT INTO userTable VALUES('" + data1 + "','" + data2 + "','" + data3 + "'," + data4 + ")"
        cur.execute(sql)
    except :
        messagebox.showerror('오류', '데이터 입력 오류가 발생함')
    else :
        messagebox.showinfo('성공', '데이터 입력 성공')
    con.commit()
    con.close()

def selectData() :
    strData1, strData2, strData3, strData4 = [], [], [], []
    con = sqlite3.connect("naverDB")    # 작업 폴더의 naverDB
    cur = con.cursor()
    cur.execute("SELECT * FROM userTable")
    strData1.append("사용자ID"); strData2.append("사용자이름")
    strData3.append("이메일"); strData4.append("출생연도")
    strData1.append("-----------"); strData2.append("-----------")
    strData3.append("-----------"); strData4.append("-----------")
    while (True) :
        row = cur.fetchone()
        if row == None :
            break;
        strData1.append(row[0]); strData2.append(row[1])
        strData3.append(row[2]); strData4.append(row[3])

    listData1.delete(0, listData1.size() - 1); listData2.delete(0, listData2.size() - 1)
    listData3.delete(0, listData3.size() - 1); listData4.delete(0, listData4.size() - 1)
    for item1, item2, item3, item4 in zip(strData1, strData2, strData3, strData4) :
        listData1.insert(END, item1); listData2.insert(END, item2)
        listData3.insert(END, item3); listData4.insert(END, item4)
    con.close()

## (웹 강좌용 준비) userTable 이 없으면 만들어 둔다 ##
con = sqlite3.connect("naverDB")
${U_CREATE_IF.replace('cur.', 'con.')}
con.close()

## 메인 코드 부분 ##
window = Tk()
window.geometry("600x300")
window.title("GUI 데이터 입력")

edtFrame = Frame(window);
edtFrame.pack()
listFrame = Frame(window)
listFrame.pack(side = BOTTOM, fill = BOTH, expand = 1)

edt1 = Entry(edtFrame, width = 10); edt1.pack(side = LEFT, padx = 10, pady = 10)
edt2 = Entry(edtFrame, width = 10); edt2.pack(side = LEFT, padx = 10, pady = 10)
edt3 = Entry(edtFrame, width = 10); edt3.pack(side = LEFT, padx = 10, pady = 10)
edt4 = Entry(edtFrame, width = 10); edt4.pack(side = LEFT, padx = 10, pady = 10)

btnInsert = Button(edtFrame, text = "입력", command = insertData)
btnInsert.pack(side = LEFT, padx = 10, pady = 10)
btnSelect = Button(edtFrame, text = "조회", command = selectData)
btnSelect.pack(side = LEFT, padx = 10, pady = 10)

listData1 = Listbox(listFrame, bg = 'yellow');
listData1.pack(side = LEFT, fill = BOTH, expand = 1)
listData2 = Listbox(listFrame, bg = 'yellow')
listData2.pack(side = LEFT, fill = BOTH, expand = 1)
listData3 = Listbox(listFrame, bg = 'yellow')
listData3.pack(side = LEFT, fill = BOTH, expand = 1)
listData4 = Listbox(listFrame, bg = 'yellow')
listData4.pack(side = LEFT, fill = BOTH, expand = 1)

window.mainloop()`;

  const C_GUI_SHORT = `import sqlite3
from tkinter import *

def selectData() :
    con = sqlite3.connect("naverDB")
    cur = con.cursor()
    ${U_CREATE_IF}
    cur.execute("SELECT * FROM userTable")
    listData.delete(0, END)
    listData.insert(END, "사용자ID   사용자이름   이메일   출생연도")
    for row in cur.fetchall() :
        listData.insert(END, "%-6s %-10s %-18s %d" % row)
    con.close()

window = Tk()
window.title("GUI 데이터 조회")
Button(window, text = "조회", command = selectData).pack()
listData = Listbox(window, bg = "yellow", width = 50)
listData.pack(fill = BOTH, expand = 1)
selectData()                   # 시작할 때 한 번 조회
window.mainloop()`;

  const C_GUI_BETTER = `import sqlite3
from tkinter import *
from tkinter import messagebox

DB = "naverDB"

## 함수 선언 부분 ##
def insertData() :
    data = [edt.get().strip() for edt in edts]          # 입력칸 4개의 값
    if "" in data :
        messagebox.showwarning("확인", "네 칸을 모두 입력하세요")
        return
    try :
        con = sqlite3.connect(DB)
        con.execute("INSERT INTO userTable VALUES(?, ?, ?, ?)",
                    (data[0], data[1], data[2], int(data[3])))
        con.commit()
        con.close()
    except ValueError :
        messagebox.showerror("오류", "출생연도는 숫자로 입력하세요")
    except sqlite3.Error as e :
        messagebox.showerror("오류", "데이터 입력 오류 : " + str(e))
    else :
        messagebox.showinfo("성공", "데이터 입력 성공")
        for edt in edts :
            edt.delete(0, END)                          # 입력칸 비우기
        selectData()                                    # 바로 다시 조회

def selectData() :
    con = sqlite3.connect(DB)
    cur = con.cursor()
    cur.execute("SELECT * FROM userTable")
    rows = cur.fetchall()
    con.close()
    heads = ["사용자ID", "사용자이름", "이메일", "출생연도"]
    for i in range(4) :
        lists[i].delete(0, END)
        lists[i].insert(END, heads[i])
        lists[i].insert(END, "-----------")
        for row in rows :
            lists[i].insert(END, row[i])

## 메인 코드 부분 ##
con = sqlite3.connect(DB)
${U_CREATE_IF.replace('cur.', 'con.')}
con.close()

window = Tk()
window.geometry("600x300")
window.title("GUI 데이터 입력 (개선판)")

edtFrame = Frame(window)
edtFrame.pack()
listFrame = Frame(window)
listFrame.pack(side = BOTTOM, fill = BOTH, expand = 1)

edts = []
for i in range(4) :
    edt = Entry(edtFrame, width = 10)
    edt.pack(side = LEFT, padx = 10, pady = 10)
    edts.append(edt)
Button(edtFrame, text = "입력", command = insertData).pack(side = LEFT, padx = 10, pady = 10)
Button(edtFrame, text = "조회", command = selectData).pack(side = LEFT, padx = 10, pady = 10)

lists = []
for i in range(4) :
    lb = Listbox(listFrame, bg = 'yellow')
    lb.pack(side = LEFT, fill = BOTH, expand = 1)
    lists.append(lb)

selectData()          # 창을 열자마자 한 번 조회
window.mainloop()`;

  /* ---------- 실습 코드 ---------- */
  const PR_FRIEND_S = `import sqlite3

con = sqlite3.connect("myDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS friendTable")

# TODO 1: friendTable 만들기 (열: name char(10), age int, city char(10))

# TODO 2: 친구 3명 입력하기 (INSERT 3번)

# TODO 3: commit 한 뒤 SELECT 로 전체를 조회해서 한 행씩 출력하기

con.close()
`;
  const PR_FRIEND = `import sqlite3

con = sqlite3.connect("myDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS friendTable")

cur.execute("CREATE TABLE friendTable (name char(10), age int, city char(10))")

cur.execute("INSERT INTO friendTable VALUES('철수', 17, '서울')")
cur.execute("INSERT INTO friendTable VALUES('영희', 16, '부산')")
cur.execute("INSERT INTO friendTable VALUES('민수', 17, '대전')")

con.commit()
cur.execute("SELECT * FROM friendTable")
for row in cur.fetchall() :
    print(row)

con.close()
`;

  const PR_BOOK_S = `import sqlite3

con = sqlite3.connect("naverDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS bookTable")

# TODO 1: bookTable 만들기 (bookId char(5), title char(20), price int)

# TODO 2: 책 3권 입력하고 commit

# TODO 3: .schema bookTable 처럼 테이블을 만든 SQL 문 출력
#         (힌트: SELECT sql FROM sqlite_master WHERE name = 'bookTable')

# TODO 4: 입력된 행 개수 출력 (SELECT COUNT(*) FROM bookTable)

con.close()
`;
  const PR_BOOK = `import sqlite3

con = sqlite3.connect("naverDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS bookTable")

cur.execute("CREATE TABLE bookTable (bookId char(5), title char(20), price int)")

cur.execute("INSERT INTO bookTable VALUES('b0001', '파이썬 입문', 22000)")
cur.execute("INSERT INTO bookTable VALUES('b0002', '데이터베이스 첫걸음', 25000)")
cur.execute("INSERT INTO bookTable VALUES('b0003', '알고리즘 산책', 18000)")
con.commit()

cur.execute("SELECT sql FROM sqlite_master WHERE name = 'bookTable'")
print(cur.fetchone()[0] + ";")

cur.execute("SELECT COUNT(*) FROM bookTable")
print("입력된 책 :", cur.fetchone()[0], "권")
con.close()
`;

  const PR_SS1_S = `import sqlite3
${SHOW}

con = sqlite3.connect("naverDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS productTable")

# TODO 1: productTable 만들기 (제품코드·제품명은 char 형, 가격·재고수량은 int 형)

# TODO 2: 제품 3개 입력하고 commit

# TODO 3: SELECT * FROM productTable 을 실행하고 show(cur) 로 출력

con.close()
`;
  const PR_SS1 = `import sqlite3
${SHOW}

con = sqlite3.connect("naverDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS productTable")

cur.execute("CREATE TABLE productTable (pCode char(5), pName char(15), price int, amount int)")

cur.execute("INSERT INTO productTable VALUES('p0001', '노트북', 110, 5)")
cur.execute("INSERT INTO productTable VALUES('p0002', '마우스', 3, 22)")
cur.execute("INSERT INTO productTable VALUES('p0003', '키보드', 2, 11)")
con.commit()

cur.execute("SELECT * FROM productTable")
show(cur)
con.close()
`;

  const PR_WHERE_S = `import sqlite3

con = sqlite3.connect("naverDB")
cur = con.cursor()
${FRESH}

# TODO 1: 1990년 이후(1990 포함)에 태어난 회원의 id, userName 을 출력

# TODO 2: 전체 회원을 출생연도가 늦은 순서(DESC)로 id|birthYear 형식으로 출력

con.close()
`;
  const PR_WHERE = `import sqlite3

con = sqlite3.connect("naverDB")
cur = con.cursor()
${FRESH}

print("1990년 이후 출생")
cur.execute("SELECT id, userName FROM userTable WHERE birthYear >= 1990")
for row in cur.fetchall() :
    print(row[0], row[1])

print("출생연도 내림차순")
cur.execute("SELECT id, birthYear FROM userTable ORDER BY birthYear DESC")
for row in cur.fetchall() :
    print(str(row[0]) + "|" + str(row[1]))

con.close()
`;

  const PR_SS2_S = `import sqlite3

## 변수 선언 부분 ##
con, cur = None, None
data1, data2, data3, data4 = "", "", "", ""
sql = ""

## 메인 코드 부분 ##
con = sqlite3.connect("naverDB")
cur = con.cursor()
# TODO 1: productTable 이 없으면 만들기 (CREATE TABLE IF NOT EXISTS ...)

while (True) :
    data1 = input("제품코드 ==> ")
    if data1 == "" :
        break;
    # TODO 2: 제품명, 가격, 재고수량 입력받기
    # TODO 3: INSERT 문 만들어 실행 (가격 · 재고수량은 따옴표 없이)

con.commit()
con.close()
`;
  const PR_SS2 = `import sqlite3

## 변수 선언 부분 ##
con, cur = None, None
data1, data2, data3, data4 = "", "", "", ""
sql = ""

## 메인 코드 부분 ##
con = sqlite3.connect("naverDB")
cur = con.cursor()
${P_CREATE_IF}

while (True) :
    data1 = input("제품코드 ==> ")
    if data1 == "" :
        break;
    data2 = input("제품명 ==> ")
    data3 = input("가격 ==> ")
    data4 = input("재고수량 ==> ")
    sql = "INSERT INTO productTable VALUES('" + data1 + "','" + data2 + "'," + data3 + "," + data4 + ")"
    cur.execute(sql)

con.commit()
cur.execute("SELECT COUNT(*) FROM productTable")
print("productTable 의 제품 수 :", cur.fetchone()[0])
con.close()
`;

  const PR_MANY_S = `import sqlite3

con = sqlite3.connect("naverDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS scoreTable")
cur.execute("CREATE TABLE scoreTable (name char(10), kor int, eng int)")

scores = [("철수", 90, 80), ("영희", 85, 95), ("민수", 70, 88)]
# TODO 1: for 문과 ? 자리표시자로 scores 의 3명을 입력
# TODO 2: commit 후 이름, 국어, 영어, 합계를 출력 (SELECT name, kor, eng, kor + eng FROM ...)

con.close()
`;
  const PR_MANY = `import sqlite3

con = sqlite3.connect("naverDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS scoreTable")
cur.execute("CREATE TABLE scoreTable (name char(10), kor int, eng int)")

scores = [("철수", 90, 80), ("영희", 85, 95), ("민수", 70, 88)]
for s in scores :
    cur.execute("INSERT INTO scoreTable VALUES(?, ?, ?)", s)
con.commit()

cur.execute("SELECT name, kor, eng, kor + eng FROM scoreTable")
for row in cur.fetchall() :
    print(row[0], row[1], row[2], "합계:", row[3])
con.close()
`;

  const PR_SS3_S = `import sqlite3

con = sqlite3.connect("naverDB")
cur = con.cursor()
${PREP_P}

# TODO: Code13-02 처럼 productTable 을 조회해서 출력하기
#   제목 줄: 제품코드  제품명  가격  재고수량
#   fetchone() 으로 한 행씩 꺼내 %s, %d 서식으로 출력

con.close()
`;
  const PR_SS3 = `import sqlite3

## 변수 선언 부분 ##
con, cur = None, None
data1, data2, data3, data4 = "", "", "", ""
row = None

## 메인 코드 부분 ##
con = sqlite3.connect("naverDB")
cur = con.cursor()
${PREP_P}

cur.execute("SELECT * FROM productTable")

print("제품코드    제품명      가격      재고수량")
print("----------------------------------------------")

while (True) :
    row = cur.fetchone()
    if row == None :
        break;
    data1 = row[0]
    data2 = row[1]
    data3 = row[2]
    data4 = row[3]
    print("%5s   %5s   %5d   %5d" % (data1, data2, data3, data4))

con.close()
`;

  const PR_FIND_S = `import sqlite3

con = sqlite3.connect("naverDB")
cur = con.cursor()
${PREP}

uid = input("찾을 사용자ID ==> ")
# TODO: ? 자리표시자로 id 가 uid 인 행을 조회
#       있으면 이름 · 이메일 · 출생연도를, 없으면 "없는 사용자입니다" 출력

con.close()
`;
  const PR_FIND = `import sqlite3

con = sqlite3.connect("naverDB")
cur = con.cursor()
${PREP}

uid = input("찾을 사용자ID ==> ")
cur.execute("SELECT * FROM userTable WHERE id = ?", (uid,))
row = cur.fetchone()
if row == None :
    print("없는 사용자입니다")
else :
    print("이름 :", row[1])
    print("이메일 :", row[2])
    print("출생연도 :", row[3])

con.close()
`;

  const PR_DELETE_S = `import sqlite3

con = sqlite3.connect("naverDB")
cur = con.cursor()
${FRESH}

uid = input("삭제할 사용자ID ==> ")
# TODO 1: DELETE FROM userTable WHERE id = ? 실행
# TODO 2: cur.rowcount (지워진 행 수)가 0 이면 "없는 사용자", 아니면 "삭제 완료" 출력
# TODO 3: commit 후 남은 id 목록 출력

con.close()
`;
  const PR_DELETE = `import sqlite3

con = sqlite3.connect("naverDB")
cur = con.cursor()
${FRESH}

uid = input("삭제할 사용자ID ==> ")
cur.execute("DELETE FROM userTable WHERE id = ?", (uid,))
if cur.rowcount == 0 :
    print("없는 사용자입니다")
else :
    print(uid, "삭제 완료")
con.commit()

cur.execute("SELECT id FROM userTable")
print("남은 회원 :", [row[0] for row in cur.fetchall()])
con.close()
`;

  const PR_GUIP_S = `import sqlite3
from tkinter import *
from tkinter import messagebox

con = sqlite3.connect("naverDB")
con.execute("CREATE TABLE IF NOT EXISTS productTable (pCode char(5), pName char(15), price int, amount int)")
con.close()

def insertData() :
    # TODO: 입력칸 4개의 값을 productTable 에 INSERT (? 자리표시자, 가격·재고는 int)
    pass

def selectData() :
    # TODO: productTable 을 조회해서 리스트 상자 4개에 표시
    pass

window = Tk()
window.geometry("600x300")
window.title("제품 관리")
# TODO: Entry 4개, [입력] [조회] 버튼, Listbox 4개 배치
window.mainloop()
`;
  const PR_GUIP = `import sqlite3
from tkinter import *
from tkinter import messagebox

con = sqlite3.connect("naverDB")
con.execute("CREATE TABLE IF NOT EXISTS productTable (pCode char(5), pName char(15), price int, amount int)")
con.close()

def insertData() :
    data = [edt.get() for edt in edts]
    try :
        con = sqlite3.connect("naverDB")
        con.execute("INSERT INTO productTable VALUES(?, ?, ?, ?)",
                    (data[0], data[1], int(data[2]), int(data[3])))
        con.commit()
        con.close()
    except :
        messagebox.showerror("오류", "데이터 입력 오류가 발생함")
    else :
        messagebox.showinfo("성공", "데이터 입력 성공")
        selectData()

def selectData() :
    con = sqlite3.connect("naverDB")
    cur = con.cursor()
    cur.execute("SELECT * FROM productTable")
    rows = cur.fetchall()
    con.close()
    heads = ["제품코드", "제품명", "가격", "재고수량"]
    for i in range(4) :
        lists[i].delete(0, END)
        lists[i].insert(END, heads[i])
        lists[i].insert(END, "----------")
        for row in rows :
            lists[i].insert(END, row[i])

window = Tk()
window.geometry("600x300")
window.title("제품 관리")

edtFrame = Frame(window)
edtFrame.pack()
listFrame = Frame(window)
listFrame.pack(side = BOTTOM, fill = BOTH, expand = 1)

edts = []
for i in range(4) :
    edt = Entry(edtFrame, width = 10)
    edt.pack(side = LEFT, padx = 10, pady = 10)
    edts.append(edt)
Button(edtFrame, text = "입력", command = insertData).pack(side = LEFT, padx = 10, pady = 10)
Button(edtFrame, text = "조회", command = selectData).pack(side = LEFT, padx = 10, pady = 10)

lists = []
for i in range(4) :
    lb = Listbox(listFrame, bg = "lightyellow")
    lb.pack(side = LEFT, fill = BOTH, expand = 1)
    lists.append(lb)

selectData()
window.mainloop()
`;

  /* ================================================================== */
  /* ====== 심화 · 추가 예제 (강의자료 밖 보충) ====================== */
  /* ---------- 13-1 : 파일 저장의 한계 · 메모리 DB · 테이블 나누기 ---------- */
  const X1_FILE = `# ===== File: members.txt =====
john,John Bann,john@naver.com,1990
kim,Kim Chi,kim@daum.net,1992
lee,Lee Pal,lee@paran.com,1988
# ===== File: main.py =====
# 파일로만 관리하면 : kim 의 이메일 하나를 바꾸려고 파일 전체를 읽고 전체를 다시 써야 한다
lines = open("members.txt", encoding="utf-8").read().splitlines()
rows = [line.split(",") for line in lines]

for row in rows :
    if row[0] == "kim" :
        row[2] = "kim@gmail.com"

with open("members.txt", "w", encoding="utf-8") as f :
    for row in rows :
        f.write(",".join(row) + "\\n")

print(open("members.txt", encoding="utf-8").read(), end="")`;

  const X1_DBWAY = `import sqlite3

con = sqlite3.connect(":memory:")     # 연습용 임시 DB (프로그램이 끝나면 사라짐)
cur = con.cursor()
cur.execute("CREATE TABLE userTable (id char(4), userName char(15), email char(15), birthYear int)")
cur.execute("INSERT INTO userTable VALUES('john', 'John Bann', 'john@naver.com', 1990)")
cur.execute("INSERT INTO userTable VALUES('kim', 'Kim Chi', 'kim@daum.net', 1992)")
cur.execute("INSERT INTO userTable VALUES('lee', 'Lee Pal', 'lee@paran.com', 1988)")

cur.execute("UPDATE userTable SET email = 'kim@gmail.com' WHERE id = 'kim'")   # 이 한 줄이 전부

for row in cur.execute("SELECT * FROM userTable") :
    print(row)
con.close()`;

  const X1_MEM = `import sqlite3
import os

con = sqlite3.connect(":memory:")            # ① 메모리 DB
con.execute("CREATE TABLE t (name char(10))")
con.execute("INSERT INTO t VALUES('메모리')")
print("메모리 DB 행 개수 :", con.execute("SELECT COUNT(*) FROM t").fetchone()[0])
con.close()

con = sqlite3.connect(":memory:")            # 다시 열면 완전히 새 DB (앞의 내용 없음)
try :
    con.execute("SELECT COUNT(*) FROM t")
except sqlite3.OperationalError as e :
    print("다시 연 메모리 DB :", e)
con.close()

con = sqlite3.connect("testDB")              # ② 파일 DB
con.execute("DROP TABLE IF EXISTS t")
con.execute("CREATE TABLE t (name char(10))")
con.execute("INSERT INTO t VALUES('파일')")
con.commit()
con.close()

con = sqlite3.connect("testDB")              # 다시 열어도 내용이 남아 있다
print("파일 DB 행 개수 :", con.execute("SELECT COUNT(*) FROM t").fetchone()[0])
con.close()
print("testDB 파일이 만들어졌나요?", os.path.exists("testDB"))`;

  const SL1_MEM = `import sqlite3

con = sqlite3.connect(":memory:")       # 파일을 만들지 않는 임시 DB
con.execute("CREATE TABLE t (name char(10))")
con.execute("INSERT INTO t VALUES('메모리')")
print("행 개수 :", con.execute("SELECT COUNT(*) FROM t").fetchone()[0])
con.close()

con = sqlite3.connect(":memory:")       # 다시 열면 완전히 새 DB
try :
    con.execute("SELECT COUNT(*) FROM t")
except sqlite3.OperationalError as e :
    print("다시 연 메모리 DB :", e)
con.close()`;

  const X1_TWO = `import sqlite3

con = sqlite3.connect(":memory:")
cur = con.cursor()

cur.execute("CREATE TABLE badOrder (userName char(10), email char(20), product char(10))")
cur.execute("INSERT INTO badOrder VALUES('Kim Chi', 'kim@daum.net', '노트북')")
cur.execute("INSERT INTO badOrder VALUES('Kim Chi', 'kim@daum.net', '마우스')")
print("① 한 테이블에 다 넣기 (회원 정보가 주문마다 반복)")
for row in cur.execute("SELECT * FROM badOrder") :
    print("   ", row)

cur.execute("CREATE TABLE member (id char(4), userName char(10), email char(20))")
cur.execute("CREATE TABLE orderTable (id char(4), product char(10))")
cur.execute("INSERT INTO member VALUES('kim', 'Kim Chi', 'kim@daum.net')")
cur.execute("INSERT INTO orderTable VALUES('kim', '노트북')")
cur.execute("INSERT INTO orderTable VALUES('kim', '마우스')")
print("② 두 테이블로 나누기 (회원은 한 번만 저장하고 주문에는 아이디만)")
for row in cur.execute("SELECT * FROM member") :
    print("    회원", row)
for row in cur.execute("SELECT * FROM orderTable") :
    print("    주문", row)
con.close()`;

  /* 13-1 실습 */
  const PR_PET_S = `import sqlite3

con = sqlite3.connect(":memory:")          # 파일을 만들지 않는 연습용 DB
cur = con.cursor()

# TODO 1: petTable 만들기 (name char(10), kind char(10), age int)

# TODO 2: 반려동물 3마리 입력하기

# TODO 3: SELECT COUNT(*) 로 마리 수를 출력하고, 전체를 한 행씩 출력하기

con.close()
`;
  const PR_PET = `import sqlite3

con = sqlite3.connect(":memory:")          # 파일을 만들지 않는 연습용 DB
cur = con.cursor()
cur.execute("CREATE TABLE petTable (name char(10), kind char(10), age int)")

cur.execute("INSERT INTO petTable VALUES('두부', '고양이', 3)")
cur.execute("INSERT INTO petTable VALUES('초코', '강아지', 5)")
cur.execute("INSERT INTO petTable VALUES('별이', '앵무새', 1)")

cur.execute("SELECT COUNT(*) FROM petTable")
print("등록된 반려동물 :", cur.fetchone()[0], "마리")
for row in cur.execute("SELECT * FROM petTable") :
    print(row)
con.close()
`;

  const PR_BOOK5_S = `import sqlite3

con = sqlite3.connect("myDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS bookTable")

# TODO 1: bookTable 만들기 (title char(20), writer char(10), price int)

# TODO 2: 좋아하는 책 5권 입력하고 commit

# TODO 3: 전체를 조회해 "제목 / 지은이 / 가격 원" 형식으로 출력

# TODO 4: 책 수(len)와 가격 합계(sum)를 출력

con.close()
`;
  const PR_BOOK5 = `import sqlite3

con = sqlite3.connect("myDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS bookTable")
cur.execute("CREATE TABLE bookTable (title char(20), writer char(10), price int)")

cur.execute("INSERT INTO bookTable VALUES('파이썬 입문', '김파이', 22000)")
cur.execute("INSERT INTO bookTable VALUES('데이터베이스 첫걸음', '이디비', 25000)")
cur.execute("INSERT INTO bookTable VALUES('알고리즘 산책', '박알고', 18000)")
cur.execute("INSERT INTO bookTable VALUES('웹 프로그래밍', '최웹', 30000)")
cur.execute("INSERT INTO bookTable VALUES('그림으로 보는 자료구조', '정자료', 27000)")
con.commit()

rows = cur.execute("SELECT * FROM bookTable").fetchall()
for title, writer, price in rows :
    print(title, "/", writer, "/", price, "원")
print("책 수 :", len(rows), "권")
print("가격 합계 :", sum(row[2] for row in rows), "원")
con.close()
`;

  const PR_TWO_S = `import sqlite3

con = sqlite3.connect("musicDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS singerTable")
cur.execute("DROP TABLE IF EXISTS albumTable")

# TODO 1: singerTable (singerId char(4), singerName char(15), debut int) 만들기
# TODO 2: albumTable (singerId char(4), albumName char(20), year int) 만들기
# TODO 3: 가수 2명과 앨범 3장 입력 (앨범에는 가수 이름 대신 singerId 만 적는다)
# TODO 4: 두 테이블을 각각 조회해 출력

con.close()
`;
  const PR_TWO = `import sqlite3

con = sqlite3.connect("musicDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS singerTable")
cur.execute("DROP TABLE IF EXISTS albumTable")
cur.execute("CREATE TABLE singerTable (singerId char(4), singerName char(15), debut int)")
cur.execute("CREATE TABLE albumTable (singerId char(4), albumName char(20), year int)")

cur.execute("INSERT INTO singerTable VALUES('s01', '하늘밴드', 2015)")
cur.execute("INSERT INTO singerTable VALUES('s02', '바다소리', 2020)")
cur.execute("INSERT INTO albumTable VALUES('s01', '첫 번째 하늘', 2016)")
cur.execute("INSERT INTO albumTable VALUES('s01', '두 번째 하늘', 2019)")
cur.execute("INSERT INTO albumTable VALUES('s02', '파도', 2021)")
con.commit()

print("[가수]")
for row in cur.execute("SELECT * FROM singerTable") :
    print(" ", row)
print("[앨범]")
for row in cur.execute("SELECT * FROM albumTable") :
    print(" ", row)
print("가수 이름은 singerTable 에 한 번만 저장된다 (중복 없음)")
con.close()
`;

  const PJ_CLUB_S = `import sqlite3

con = sqlite3.connect("clubDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS memberTable")
cur.execute("DROP TABLE IF EXISTS activityTable")

# TODO 1: memberTable (id, name, grade, part) 만들기
# TODO 2: activityTable (id, day, title) 만들기
# TODO 3: 회원 4명, 활동 4건 입력하고 commit
# TODO 4: 두 테이블을 각각 목록으로 출력
# TODO 5: 회원 수 · 활동 수 · 개발 파트 회원 이름 목록 출력

con.close()
`;
  const PJ_CLUB = `import sqlite3

con = sqlite3.connect("clubDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS memberTable")
cur.execute("DROP TABLE IF EXISTS activityTable")
cur.execute("CREATE TABLE memberTable (id char(4), name char(10), grade int, part char(10))")
cur.execute("CREATE TABLE activityTable (id char(4), day char(10), title char(20))")

cur.execute("INSERT INTO memberTable VALUES('m01', '김철수', 1, '기획')")
cur.execute("INSERT INTO memberTable VALUES('m02', '이영희', 2, '개발')")
cur.execute("INSERT INTO memberTable VALUES('m03', '박민수', 1, '개발')")
cur.execute("INSERT INTO memberTable VALUES('m04', '최지우', 3, '홍보')")

cur.execute("INSERT INTO activityTable VALUES('m01', '03-05', '신입 환영회')")
cur.execute("INSERT INTO activityTable VALUES('m02', '03-12', '파이썬 스터디')")
cur.execute("INSERT INTO activityTable VALUES('m02', '04-02', '해커톤 준비')")
cur.execute("INSERT INTO activityTable VALUES('m04', '04-20', '동아리 홍보')")
con.commit()

print("===== 동아리 회원 =====")
for row in cur.execute("SELECT * FROM memberTable") :
    print(row)
print("===== 활동 기록 =====")
for row in cur.execute("SELECT * FROM activityTable") :
    print(row)

cur.execute("SELECT COUNT(*) FROM memberTable")
print("회원 수 :", cur.fetchone()[0], "명")
cur.execute("SELECT COUNT(*) FROM activityTable")
print("활동 수 :", cur.fetchone()[0], "건")
cur.execute("SELECT name FROM memberTable WHERE part = '개발'")
print("개발 파트 :", [row[0] for row in cur.fetchall()])
con.close()
`;

  /* ---------- 13-2 : 데이터 형식 · 제약 조건 · 스키마 ---------- */
  const X2_TYPES = `import sqlite3

con = sqlite3.connect(":memory:")
cur = con.cursor()
cur.execute("CREATE TABLE t (a INTEGER, b REAL, c TEXT, d BLOB)")
cur.execute("INSERT INTO t VALUES(10, 1.5, '파이썬', ?)", (b"abc",))
cur.execute("INSERT INTO t VALUES(NULL, NULL, NULL, NULL)")

for row in cur.execute("SELECT typeof(a), typeof(b), typeof(c), typeof(d) FROM t") :
    print(row)
print("값 :", cur.execute("SELECT a, b, c FROM t").fetchone())
con.close()`;

  const X2_CONSTRAINT = `import sqlite3

con = sqlite3.connect("shopDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS memberTable")
cur.execute("""CREATE TABLE memberTable (
    id       TEXT    PRIMARY KEY,           -- 기본키: 행을 구분하는 열 (중복 · 빈값 불가)
    userName TEXT    NOT NULL,              -- 반드시 값이 있어야 함
    email    TEXT    UNIQUE,                -- 값이 있다면 서로 달라야 함
    grade    TEXT    DEFAULT '일반',        -- 값을 주지 않으면 '일반'
    point    INTEGER CHECK (point >= 0)     -- 0 이상만 허용
)""")

cur.execute("INSERT INTO memberTable (id, userName, email, point) VALUES('john', 'John Bann', 'john@naver.com', 100)")
cur.execute("INSERT INTO memberTable (id, userName, point) VALUES('kim', 'Kim Chi', 0)")
con.commit()

for row in cur.execute("SELECT * FROM memberTable") :
    print(row)
con.close()`;

  const X2_VIOLATION = `import sqlite3

con = sqlite3.connect(":memory:")
cur = con.cursor()
cur.execute("CREATE TABLE memberTable (id TEXT PRIMARY KEY, userName TEXT NOT NULL, email TEXT UNIQUE, point INTEGER CHECK (point >= 0))")
cur.execute("INSERT INTO memberTable VALUES('john', 'John Bann', 'john@naver.com', 100)")

tests = [("기본키 중복", ("john", "다른 사람", "other@naver.com", 10)),
         ("이름이 비었음", ("kim", None, "kim@daum.net", 10)),
         ("이메일 중복", ("lee", "Lee Pal", "john@naver.com", 10)),
         ("포인트가 음수", ("park", "Park Su", "park@gmail.com", -5))]

for name, values in tests :
    try :
        cur.execute("INSERT INTO memberTable VALUES(?, ?, ?, ?)", values)
    except sqlite3.IntegrityError as e :
        print(name, "→", type(e).__name__, ":", e)

print("결국 저장된 행 :", cur.execute("SELECT COUNT(*) FROM memberTable").fetchone()[0])
con.close()`;

  const X2_PRAGMA = `import sqlite3

con = sqlite3.connect(":memory:")
cur = con.cursor()
cur.execute("CREATE TABLE userTable (id TEXT PRIMARY KEY, userName TEXT NOT NULL, birthYear INTEGER)")

print("PRAGMA table_info(userTable)")
for cid, name, ctype, notnull, default, pk in cur.execute("PRAGMA table_info(userTable)") :
    print("  %d번 열 %-10s %-8s %s%s" % (cid, name, ctype, "NOT NULL " if notnull else "", "기본키" if pk else ""))

cur.execute("ALTER TABLE userTable ADD COLUMN city TEXT DEFAULT '서울'")     # 열 추가
print("열 추가 후 :", [row[1] for row in cur.execute("PRAGMA table_info(userTable)")])
con.close()`;

  const X2_FOREIGN = `import sqlite3

con = sqlite3.connect("libraryDB")
cur = con.cursor()
cur.execute("PRAGMA foreign_keys = ON")           # SQLite 는 외래키 검사가 기본으로 꺼져 있다
cur.execute("DROP TABLE IF EXISTS loanTable")
cur.execute("DROP TABLE IF EXISTS bookTable")
cur.execute("CREATE TABLE bookTable (bookId TEXT PRIMARY KEY, title TEXT NOT NULL)")
cur.execute("""CREATE TABLE loanTable (
    loanId INTEGER PRIMARY KEY,
    bookId TEXT NOT NULL,
    member TEXT NOT NULL,
    FOREIGN KEY (bookId) REFERENCES bookTable(bookId))""")

cur.execute("INSERT INTO bookTable VALUES('b001', '파이썬 입문')")
cur.execute("INSERT INTO loanTable VALUES(1, 'b001', '철수')")        # 있는 책 → 성공
try :
    cur.execute("INSERT INTO loanTable VALUES(2, 'b999', '영희')")    # 없는 책 → 오류
except sqlite3.IntegrityError as e :
    print("없는 책을 대출하면 :", e)
con.commit()
print("대출 기록 :", cur.execute("SELECT * FROM loanTable").fetchall())
con.close()`;

  /* 13-2 실습 */
  const PR_STU_S = `import sqlite3

con = sqlite3.connect("schoolDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS studentTable")

# TODO 1: studentTable 만들기
#   sid TEXT 기본키 / name TEXT NOT NULL / email TEXT UNIQUE
#   grade INTEGER 기본값 1 / score INTEGER 는 0 ~ 100 만 허용(CHECK)

# TODO 2: 학생 2명 입력 (한 명은 email · grade 를 적지 않기)

# TODO 3: 전체 조회 출력 + sqlite_master 의 CREATE 문 출력

con.close()
`;
  const PR_STU = `import sqlite3

con = sqlite3.connect("schoolDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS studentTable")
cur.execute("""CREATE TABLE studentTable (
    sid   TEXT    PRIMARY KEY,
    name  TEXT    NOT NULL,
    email TEXT    UNIQUE,
    grade INTEGER DEFAULT 1,
    score INTEGER CHECK (score >= 0 AND score <= 100))""")

cur.execute("INSERT INTO studentTable (sid, name, email, grade, score) VALUES('2401', '김철수', 'kim@school.kr', 2, 88)")
cur.execute("INSERT INTO studentTable (sid, name, score) VALUES('2402', '이영희', 95)")
con.commit()

for row in cur.execute("SELECT * FROM studentTable") :
    print(row)
print(cur.execute("SELECT sql FROM sqlite_master WHERE name = 'studentTable'").fetchone()[0])
con.close()
`;

  const PR_VIO_S = `import sqlite3

con = sqlite3.connect("schoolDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS studentTable")
cur.execute("CREATE TABLE studentTable (sid TEXT PRIMARY KEY, name TEXT NOT NULL, score INTEGER CHECK (score BETWEEN 0 AND 100))")
cur.execute("INSERT INTO studentTable VALUES('2401', '김철수', 88)")
con.commit()

bad = [("2401", "다른 학생", 70), ("2402", None, 70), ("2403", "박민수", 120)]
for values in bad :
    # TODO: try ~ except sqlite3.IntegrityError 로 감싸 입력하고
    #       성공하면 "입력 성공", 실패하면 오류 메시지를 출력하기
    pass

# TODO: 마지막에 저장된 학생 수 출력
con.close()
`;
  const PR_VIO = `import sqlite3

con = sqlite3.connect("schoolDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS studentTable")
cur.execute("CREATE TABLE studentTable (sid TEXT PRIMARY KEY, name TEXT NOT NULL, score INTEGER CHECK (score BETWEEN 0 AND 100))")
cur.execute("INSERT INTO studentTable VALUES('2401', '김철수', 88)")
con.commit()

bad = [("2401", "다른 학생", 70), ("2402", None, 70), ("2403", "박민수", 120)]
for values in bad :
    try :
        cur.execute("INSERT INTO studentTable VALUES(?, ?, ?)", values)
        con.commit()
        print(values[0], "입력 성공")
    except sqlite3.IntegrityError as e :
        print(values[0], "입력 실패 :", e)

print("저장된 학생 수 :", cur.execute("SELECT COUNT(*) FROM studentTable").fetchone()[0])
con.close()
`;

  const PR_PRAG_S = `import sqlite3

con = sqlite3.connect("schoolDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS clubTable")
cur.execute("CREATE TABLE clubTable (cid TEXT PRIMARY KEY, cname TEXT NOT NULL)")

# TODO 1: PRAGMA table_info(clubTable) 로 열 이름 · 형식 · NOT NULL · 기본키를 출력

# TODO 2: ALTER TABLE 로 room TEXT 열 추가 (기본값 '미정')

# TODO 3: 동아리 2개 입력 (하나는 room 을 적지 않기) 후 열 목록과 전체 행 출력

con.close()
`;
  const PR_PRAG = `import sqlite3

con = sqlite3.connect("schoolDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS clubTable")
cur.execute("CREATE TABLE clubTable (cid TEXT PRIMARY KEY, cname TEXT NOT NULL)")

print("[처음 구조]")
for cid, name, ctype, notnull, default, pk in cur.execute("PRAGMA table_info(clubTable)") :
    print(" ", name, ctype, "NOT NULL" if notnull else "", "PK" if pk else "")

cur.execute("ALTER TABLE clubTable ADD COLUMN room TEXT DEFAULT '미정'")
cur.execute("INSERT INTO clubTable VALUES('c01', '코딩 동아리', '301호')")
cur.execute("INSERT INTO clubTable (cid, cname) VALUES('c02', '사진 동아리')")
con.commit()

print("[열 추가 후]", [row[1] for row in cur.execute("PRAGMA table_info(clubTable)")])
for row in cur.execute("SELECT * FROM clubTable") :
    print(" ", row)
con.close()
`;

  const PJ_LIB_S = `import sqlite3

con = sqlite3.connect("libraryDB")
cur = con.cursor()
cur.execute("PRAGMA foreign_keys = ON")
cur.execute("DROP TABLE IF EXISTS loanTable")
cur.execute("DROP TABLE IF EXISTS bookTable")
cur.execute("DROP TABLE IF EXISTS memberTable")

# TODO 1: bookTable (bookId 기본키, title NOT NULL, writer NOT NULL, price 는 0 이상)
# TODO 2: memberTable (memberId 기본키, name NOT NULL, phone UNIQUE)
# TODO 3: loanTable (loanId 자동번호, bookId · memberId · day, back 은 'Y'/'N' 기본값 'N')
#         bookId 와 memberId 에 FOREIGN KEY 를 걸기
# TODO 4: 책 3권 · 회원 2명 · 대출 3건 입력하고 commit
# TODO 5: 각 테이블의 행 수 출력
# TODO 6: 없는 책(b99)을 대출해 보고 IntegrityError 를 잡아 출력
# TODO 7: b01 을 반납 처리(UPDATE back='Y')하고 대출 목록 출력

con.close()
`;
  const PJ_LIB = `import sqlite3

con = sqlite3.connect("libraryDB")
cur = con.cursor()
cur.execute("PRAGMA foreign_keys = ON")
cur.execute("DROP TABLE IF EXISTS loanTable")
cur.execute("DROP TABLE IF EXISTS bookTable")
cur.execute("DROP TABLE IF EXISTS memberTable")

cur.execute("""CREATE TABLE bookTable (
    bookId TEXT PRIMARY KEY,
    title  TEXT NOT NULL,
    writer TEXT NOT NULL,
    price  INTEGER CHECK (price >= 0))""")
cur.execute("""CREATE TABLE memberTable (
    memberId TEXT PRIMARY KEY,
    name     TEXT NOT NULL,
    phone    TEXT UNIQUE)""")
cur.execute("""CREATE TABLE loanTable (
    loanId   INTEGER PRIMARY KEY,
    bookId   TEXT NOT NULL,
    memberId TEXT NOT NULL,
    day      TEXT NOT NULL,
    back     TEXT DEFAULT 'N' CHECK (back IN ('Y', 'N')),
    FOREIGN KEY (bookId) REFERENCES bookTable(bookId),
    FOREIGN KEY (memberId) REFERENCES memberTable(memberId))""")

cur.executemany("INSERT INTO bookTable VALUES(?, ?, ?, ?)",
                [("b01", "파이썬 입문", "김파이", 22000), ("b02", "데이터베이스 첫걸음", "이디비", 25000),
                 ("b03", "알고리즘 산책", "박알고", 18000)])
cur.executemany("INSERT INTO memberTable VALUES(?, ?, ?)",
                [("m01", "김철수", "010-1111-1111"), ("m02", "이영희", "010-2222-2222")])
cur.executemany("INSERT INTO loanTable (bookId, memberId, day) VALUES(?, ?, ?)",
                [("b01", "m01", "03-02"), ("b02", "m01", "03-05"), ("b03", "m02", "03-07")])
con.commit()

for name in ["bookTable", "memberTable", "loanTable"] :
    cur.execute("SELECT COUNT(*) FROM " + name)
    print(name, ":", cur.fetchone()[0], "행")

try :
    cur.execute("INSERT INTO loanTable (bookId, memberId, day) VALUES('b99', 'm01', '03-09')")
except sqlite3.IntegrityError as e :
    print("없는 책 대출 :", e)

cur.execute("UPDATE loanTable SET back = 'Y' WHERE bookId = 'b01' AND memberId = 'm01'")
con.commit()
print("반납 처리된 행 수 :", cur.rowcount)
for row in cur.execute("SELECT * FROM loanTable ORDER BY loanId") :
    print(row)
con.close()
`;

  /* ---------- 13-3 : WHERE · 정렬 · 집계 · 인덱스 ---------- */
  const CLUB_SETUP = `import sqlite3

con = sqlite3.connect("clubDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS memberTable")
cur.execute("CREATE TABLE memberTable (id TEXT, userName TEXT, city TEXT, birthYear INTEGER, point INTEGER)")
for row in [("john", "John Bann", "서울", 1990, 120), ("kim", "Kim Chi", "부산", 1992, 80),
            ("lee", "Lee Pal", "서울", 1988, 300), ("park", "Park Su", "대전", 1980, 50),
            ("su", "Su Ji", "부산", 1994, 210), ("woo", "Woo Ja", "서울", 2002, 0)] :
    cur.execute("INSERT INTO memberTable VALUES(?, ?, ?, ?, ?)", row)
con.commit()`;

  const QHELP = `
def q(sql) :                      # SQL 문과 결과를 함께 보여 주는 도우미
    print("SQL>", sql)
    for row in cur.execute(sql) :
        print("    ", row)
`;

  const X3_WHERE = `${CLUB_SETUP}
${QHELP}
q("SELECT id, city FROM memberTable WHERE city = '서울'")
q("SELECT id, point FROM memberTable WHERE point >= 100 AND city = '서울'")
q("SELECT id, city FROM memberTable WHERE city = '부산' OR city = '대전'")
q("SELECT id, point FROM memberTable WHERE NOT point > 0")
q("SELECT id, birthYear FROM memberTable WHERE birthYear <> 1990 AND birthYear < 1990")
con.close()`;

  const X3_INLIKE = `${CLUB_SETUP}
${QHELP}
q("SELECT id, city FROM memberTable WHERE city IN ('서울', '대전')")
q("SELECT id, birthYear FROM memberTable WHERE birthYear BETWEEN 1988 AND 1992")
q("SELECT id, userName FROM memberTable WHERE userName LIKE 'K%'")
q("SELECT id, userName FROM memberTable WHERE userName LIKE '%a%'")
q("SELECT id FROM memberTable WHERE id LIKE '____'")
con.close()`;

  const X3_NULL = `import sqlite3

con = sqlite3.connect(":memory:")
cur = con.cursor()
cur.execute("CREATE TABLE memberTable (id TEXT, city TEXT)")
cur.execute("INSERT INTO memberTable VALUES('john', '서울')")
cur.execute("INSERT INTO memberTable VALUES('kim', NULL)")      # 주소를 아직 모름

print("city = NULL  :", cur.execute("SELECT id FROM memberTable WHERE city = NULL").fetchall())
print("city IS NULL :", cur.execute("SELECT id FROM memberTable WHERE city IS NULL").fetchall())
print("city IS NOT NULL :", cur.execute("SELECT id FROM memberTable WHERE city IS NOT NULL").fetchall())
print("파이썬으로 꺼내면 :", cur.execute("SELECT * FROM memberTable WHERE id = 'kim'").fetchone())
con.close()`;

  const X3_ORDER = `${CLUB_SETUP}
${QHELP}
q("SELECT city, userName FROM memberTable ORDER BY city, birthYear DESC")
q("SELECT id, point FROM memberTable ORDER BY point DESC LIMIT 3")
q("SELECT id, point FROM memberTable ORDER BY point DESC LIMIT 2 OFFSET 2")
q("SELECT DISTINCT city FROM memberTable")
q("SELECT userName AS 이름, 2026 - birthYear AS 나이 FROM memberTable WHERE city = '대전'")
con.close()`;

  const X3_GROUP = `${CLUB_SETUP}
${QHELP}
q("SELECT COUNT(*), SUM(point), ROUND(AVG(point), 1), MIN(point), MAX(point) FROM memberTable")
q("SELECT city, COUNT(*), SUM(point) FROM memberTable GROUP BY city")
q("SELECT city, COUNT(*) FROM memberTable GROUP BY city HAVING COUNT(*) >= 2")
q("SELECT city, ROUND(AVG(point), 1) FROM memberTable GROUP BY city ORDER BY AVG(point) DESC")
print("한 값만 꺼내기 :", cur.execute("SELECT AVG(point) FROM memberTable").fetchone()[0])
con.close()`;

  const X3_SAFE = `${CLUB_SETUP}

cur.execute("SELECT id, point FROM memberTable WHERE point = 0")     # ① 먼저 눈으로 확인
print("지울 대상 :", cur.fetchall())

cur.execute("DELETE FROM memberTable WHERE point = 0")               # ② 같은 조건으로 삭제
print("지워진 행 수 :", cur.rowcount)

con.rollback()                                                       # ③ commit 전이면 되돌릴 수 있다
print("rollback 후 행 수 :", cur.execute("SELECT COUNT(*) FROM memberTable").fetchone()[0])
con.close()`;

  const X3_NOWHERE = `${CLUB_SETUP}

cur.execute("UPDATE memberTable SET city = '서울'")          # WHERE 를 빠뜨렸다!
print("바뀐 행 수 :", cur.rowcount)
print("도시 종류 :", cur.execute("SELECT DISTINCT city FROM memberTable").fetchall())

con.rollback()                                               # 아직 commit 전이라 살았다
print("rollback 후 :", cur.execute("SELECT DISTINCT city FROM memberTable").fetchall())
con.close()`;

  const X3_INDEX = `import sqlite3
import time

con = sqlite3.connect(":memory:")
cur = con.cursor()
cur.execute("CREATE TABLE bigTable (id INTEGER, name TEXT)")
cur.executemany("INSERT INTO bigTable VALUES(?, ?)", [(i, "user" + str(i)) for i in range(100000)])
con.commit()

def search100() :                       # 이름으로 100번 검색하는 데 걸린 시간
    start = time.time()
    for i in range(100) :
        cur.execute("SELECT id FROM bigTable WHERE name = ?", ("user" + str(i * 7),)).fetchone()
    return time.time() - start

t1 = search100()
cur.execute("CREATE INDEX idx_name ON bigTable(name)")      # name 열에 인덱스 만들기
t2 = search100()
print("인덱스 없이 : %.3f초" % t1)
print("인덱스 있음 : %.3f초" % t2)
print("약 %d배 빨라짐" % (t1 / t2))
print("실행 계획 :", cur.execute("EXPLAIN QUERY PLAN SELECT id FROM bigTable WHERE name = 'user7'").fetchone()[3])
con.close()`;

  /* 13-3 슬라이드용 짧은 버전 */
  const SL3_SETUP = `import sqlite3

con = sqlite3.connect(":memory:")
cur = con.cursor()
cur.execute("CREATE TABLE m (id TEXT, city TEXT, birthYear INT, point INT)")
cur.executemany("INSERT INTO m VALUES(?, ?, ?, ?)",
                [("john", "서울", 1990, 120), ("kim", "부산", 1992, 80), ("lee", "서울", 1988, 300),
                 ("park", "대전", 1980, 50), ("su", "부산", 1994, 210), ("woo", "서울", 2002, 0)])

def q(sql) :
    print("SQL>", sql)
    for row in cur.execute(sql) :
        print("   ", row)
`;
  const SL3_WHERE = `${SL3_SETUP}
q("SELECT id, city FROM m WHERE city IN ('서울', '대전')")
q("SELECT id FROM m WHERE birthYear BETWEEN 1988 AND 1992")
q("SELECT id, point FROM m WHERE point >= 100 AND city = '서울'")
con.close()`;
  const SL3_GROUP = `${SL3_SETUP}
q("SELECT COUNT(*), SUM(point), ROUND(AVG(point), 1) FROM m")
q("SELECT city, COUNT(*), ROUND(AVG(point), 1) FROM m GROUP BY city")
q("SELECT city, COUNT(*) FROM m GROUP BY city HAVING COUNT(*) >= 2")
con.close()`;
  const SL3_SAFE = `${SL3_SETUP}
con.commit()
cur.execute("SELECT id FROM m WHERE point = 0")          # ① 대상 확인
print("지울 대상 :", cur.fetchall())
cur.execute("DELETE FROM m WHERE point = 0")             # ② 같은 조건으로 삭제
print("지워진 행 수 :", cur.rowcount)                     # ③ 몇 행인지 확인
con.rollback()                                           # 이상하면 되돌리기
print("rollback 후 :", cur.execute("SELECT COUNT(*) FROM m").fetchone()[0])
con.close()`;

  /* 13-3 실습 */
  const PR_W2_S = `${CLUB_SETUP}

# TODO 1: IN 을 써서 서울 또는 부산에 사는 회원의 id, city 출력
# TODO 2: BETWEEN 을 써서 1988 ~ 1992년에 태어난 회원의 id, birthYear 출력
# TODO 3: LIKE 를 써서 이름에 S 가 들어가는 회원의 id, userName 출력

con.close()
`;
  const PR_W2 = `${CLUB_SETUP}

print("① 서울 또는 부산에 사는 회원")
for row in cur.execute("SELECT id, city FROM memberTable WHERE city IN ('서울', '부산')") :
    print("  ", row)

print("② 1988 ~ 1992년에 태어난 회원")
for row in cur.execute("SELECT id, birthYear FROM memberTable WHERE birthYear BETWEEN 1988 AND 1992") :
    print("  ", row)

print("③ 이름에 S 가 들어가는 회원")
for row in cur.execute("SELECT id, userName FROM memberTable WHERE userName LIKE '%S%'") :
    print("  ", row)
con.close()
`;

  const PR_ORD_S = `${CLUB_SETUP}

# TODO 1: 포인트가 높은 순으로 상위 3명의 id, point 출력 (ORDER BY … DESC LIMIT 3)
# TODO 2: 가장 어린(출생연도가 가장 늦은) 회원 한 명 출력
# TODO 3: DISTINCT 로 도시 목록을 가나다순으로 출력

con.close()
`;
  const PR_ORD = `${CLUB_SETUP}

print("포인트 상위 3명")
for row in cur.execute("SELECT id, point FROM memberTable ORDER BY point DESC LIMIT 3") :
    print("  ", row)

print("가장 어린 회원 :", cur.execute("SELECT id, birthYear FROM memberTable ORDER BY birthYear DESC LIMIT 1").fetchone())
print("도시 목록 :", [row[0] for row in cur.execute("SELECT DISTINCT city FROM memberTable ORDER BY city")])
con.close()
`;

  const PR_GRP_S = `${CLUB_SETUP}

# TODO 1: 도시별 인원 수와 평균 포인트 출력 (GROUP BY city, ROUND(AVG(point), 1))
# TODO 2: 회원이 2명 이상인 도시만 출력 (HAVING)
# TODO 3: 전체 평균 포인트 출력

con.close()
`;
  const PR_GRP = `${CLUB_SETUP}

print("도시별 인원과 평균 포인트")
for city, cnt, avg in cur.execute("SELECT city, COUNT(*), ROUND(AVG(point), 1) FROM memberTable GROUP BY city ORDER BY city") :
    print("  %s : %d명, 평균 %.1f점" % (city, cnt, avg))

print("2명 이상인 도시")
for row in cur.execute("SELECT city, COUNT(*) FROM memberTable GROUP BY city HAVING COUNT(*) >= 2 ORDER BY city") :
    print("  ", row)

print("전체 평균 :", cur.execute("SELECT ROUND(AVG(point), 1) FROM memberTable").fetchone()[0])
con.close()
`;

  const PJ_SCORE_S = `import sqlite3

con = sqlite3.connect("schoolDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS scoreTable")
cur.execute("CREATE TABLE scoreTable (name TEXT, room TEXT, kor INTEGER, eng INTEGER, math INTEGER)")
for row in [("김철수", "1반", 90, 80, 70), ("이영희", "1반", 85, 95, 100), ("박민수", "1반", 60, 70, 65),
            ("최지우", "2반", 100, 90, 95), ("정하늘", "2반", 75, 60, 80), ("강도현", "2반", 88, 84, 92),
            ("윤서연", "3반", 50, 60, 55), ("한지민", "3반", 95, 92, 98)] :
    cur.execute("INSERT INTO scoreTable VALUES(?, ?, ?, ?, ?)", row)
con.commit()

# TODO 1: 전체 요약 — 학생 수, 총점 평균(소수 첫째 자리), 최고 총점, 최저 총점
# TODO 2: 반별 평균 총점을 높은 순으로 (GROUP BY room ORDER BY AVG(...) DESC)
# TODO 3: 총점 상위 3명을 "1위 이름(반) 점수" 형식으로 (ORDER BY … LIMIT 3)
# TODO 4: 총점 평균이 240점 이상인 반만 (HAVING)
# TODO 5: 과목별 평균 (국어 · 영어 · 수학)

con.close()
`;
  const PJ_SCORE = `import sqlite3

con = sqlite3.connect("schoolDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS scoreTable")
cur.execute("CREATE TABLE scoreTable (name TEXT, room TEXT, kor INTEGER, eng INTEGER, math INTEGER)")
for row in [("김철수", "1반", 90, 80, 70), ("이영희", "1반", 85, 95, 100), ("박민수", "1반", 60, 70, 65),
            ("최지우", "2반", 100, 90, 95), ("정하늘", "2반", 75, 60, 80), ("강도현", "2반", 88, 84, 92),
            ("윤서연", "3반", 50, 60, 55), ("한지민", "3반", 95, 92, 98)] :
    cur.execute("INSERT INTO scoreTable VALUES(?, ?, ?, ?, ?)", row)
con.commit()

print("===== 전체 요약 =====")
cnt, avg, top, low = cur.execute("SELECT COUNT(*), ROUND(AVG(kor + eng + math), 1), MAX(kor + eng + math), MIN(kor + eng + math) FROM scoreTable").fetchone()
print("학생 %d명 / 총점 평균 %.1f / 최고 %d / 최저 %d" % (cnt, avg, top, low))

print("===== 반별 평균 (높은 순) =====")
for room, n, ravg in cur.execute("""SELECT room, COUNT(*), ROUND(AVG(kor + eng + math), 1) FROM scoreTable
                                    GROUP BY room ORDER BY AVG(kor + eng + math) DESC""") :
    print("%s %d명 평균 %.1f" % (room, n, ravg))

print("===== 총점 상위 3명 =====")
rank = 1
for name, room, total in cur.execute("""SELECT name, room, kor + eng + math AS total FROM scoreTable
                                        ORDER BY total DESC, name LIMIT 3""") :
    print("%d위 %s(%s) %d점" % (rank, name, room, total))
    rank = rank + 1

print("===== 총점 평균이 240점 이상인 반 =====")
for room, ravg in cur.execute("""SELECT room, ROUND(AVG(kor + eng + math), 1) FROM scoreTable
                                 GROUP BY room HAVING AVG(kor + eng + math) >= 240""") :
    print(room, ravg)

print("===== 과목별 평균 =====")
kor, eng, math = cur.execute("SELECT ROUND(AVG(kor), 1), ROUND(AVG(eng), 1), ROUND(AVG(math), 1) FROM scoreTable").fetchone()
print("국어 %.1f / 영어 %.1f / 수학 %.1f" % (kor, eng, math))
con.close()
`;

  /* ---------- 13-4 : 바인딩 · 인젝션 · 트랜잭션 · CSV ---------- */
  const X4_INJECT = `import sqlite3

con = sqlite3.connect(":memory:")
cur = con.cursor()
cur.execute("CREATE TABLE loginTable (userId TEXT, password TEXT)")
cur.execute("INSERT INTO loginTable VALUES('john', 'apple123')")
cur.execute("INSERT INTO loginTable VALUES('kim', 'banana!')")
con.commit()

def login_bad(user, pw) :        # 위험한 방법 : 문자열을 이어 붙여 SQL 을 만든다
    sql = "SELECT userId FROM loginTable WHERE userId = '" + user + "' AND password = '" + pw + "'"
    print("   만들어진 SQL :", sql)
    return cur.execute(sql).fetchall()

def login_safe(user, pw) :       # 안전한 방법 : 값은 ? 로 따로 넘긴다
    return cur.execute("SELECT userId FROM loginTable WHERE userId = ? AND password = ?", (user, pw)).fetchall()

print("① 올바른 비밀번호")
print("   로그인 결과 :", login_bad("john", "apple123"))
print("② 비밀번호 대신 공격 문자열 ' OR '1'='1 을 넣으면")
print("   로그인 결과 :", login_bad("john", "' OR '1'='1"))
print("③ 같은 공격을 ? 자리표시자에 넣으면")
print("   로그인 결과 :", login_safe("john", "' OR '1'='1"))
con.close()`;

  const X4_EXECMANY = `import sqlite3

con = sqlite3.connect("naverDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS userTable")
${U_CREATE}

userList = [("john", "John Bann", "john@naver.com", 1990),
            ("kim", "Kim Chi", "kim@daum.net", 1992),
            ("lee", "Lee Pal", "lee@paran.com", 1988),
            ("park", "Park Su", "park@gmail.com", 1980)]

cur.executemany("INSERT INTO userTable VALUES(?, ?, ?, ?)", userList)   # 4건을 한 번에
con.commit()

print("입력된 행 :", cur.execute("SELECT COUNT(*) FROM userTable").fetchone()[0])
print("첫 행 :", cur.execute("SELECT * FROM userTable LIMIT 1").fetchone())
con.close()`;

  const X4_TRANS = `import sqlite3

con = sqlite3.connect(":memory:")
cur = con.cursor()
cur.execute("CREATE TABLE account (name TEXT PRIMARY KEY, money INTEGER CHECK (money >= 0))")
cur.execute("INSERT INTO account VALUES('철수', 10000)")
cur.execute("INSERT INTO account VALUES('영희', 5000)")
con.commit()

def show(title) :
    print(title, cur.execute("SELECT name, money FROM account ORDER BY name").fetchall())

show("처음        :")
try :
    cur.execute("UPDATE account SET money = money - 8000 WHERE name = '철수'")   # 성공
    cur.execute("UPDATE account SET money = money - 8000 WHERE name = '영희'")   # 잔액 부족 → 오류
    con.commit()
except sqlite3.IntegrityError as e :
    con.rollback()                     # 앞의 성공한 UPDATE 까지 한꺼번에 취소
    print("이체 실패   :", e)
show("rollback 후 :")

with con :                             # 블록이 정상으로 끝나면 자동 commit, 예외가 나면 자동 rollback
    cur.execute("UPDATE account SET money = money - 3000 WHERE name = '철수'")
    cur.execute("UPDATE account SET money = money + 3000 WHERE name = '영희'")
show("정상 이체 후 :")
con.close()`;

  const X4_AUTOID = `import sqlite3

con = sqlite3.connect("diaryDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS memo")
cur.execute("CREATE TABLE memo (no INTEGER PRIMARY KEY, content TEXT NOT NULL)")   # no 는 자동 번호

for text in ["첫 번째 메모", "두 번째 메모", "세 번째 메모"] :
    cur.execute("INSERT INTO memo (content) VALUES(?)", (text,))    # no 는 적지 않는다
    print("방금 저장한 번호 :", cur.lastrowid)
con.commit()

print(cur.execute("SELECT * FROM memo").fetchall())
con.close()`;

  const X4_UPSERT = `import sqlite3

con = sqlite3.connect(":memory:")
cur = con.cursor()
cur.execute("CREATE TABLE visit (id TEXT PRIMARY KEY, count INTEGER)")

for name in ["john", "kim", "john", "john"] :
    cur.execute("INSERT INTO visit VALUES(?, 1) ON CONFLICT(id) DO UPDATE SET count = count + 1", (name,))
print("방문 횟수 :", cur.execute("SELECT * FROM visit ORDER BY id").fetchall())

cur.execute("INSERT OR IGNORE INTO visit VALUES('john', 999)")    # 이미 있으면 조용히 무시
print("OR IGNORE 뒤 :", cur.execute("SELECT * FROM visit WHERE id = 'john'").fetchall())

cur.execute("INSERT OR REPLACE INTO visit VALUES('john', 999)")   # 있으면 통째로 바꿔치기
print("OR REPLACE 뒤 :", cur.execute("SELECT * FROM visit WHERE id = 'john'").fetchall())
con.close()`;

  const X4_CSVIN = `# ===== File: members.csv =====
id,userName,city,point
john,John Bann,서울,120
kim,Kim Chi,부산,80
lee,Lee Pal,서울,300
# ===== File: main.py =====
import sqlite3
import csv

con = sqlite3.connect("shopDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS memberTable")
cur.execute("CREATE TABLE memberTable (id TEXT PRIMARY KEY, userName TEXT, city TEXT, point INTEGER)")

with open("members.csv", encoding="utf-8") as f :
    reader = csv.reader(f)
    next(reader)                                        # 첫 줄(제목 줄) 건너뛰기
    rows = [(r[0], r[1], r[2], int(r[3])) for r in reader]

cur.executemany("INSERT INTO memberTable VALUES(?, ?, ?, ?)", rows)
con.commit()

print("가져온 행 :", cur.execute("SELECT COUNT(*) FROM memberTable").fetchone()[0])
for row in cur.execute("SELECT * FROM memberTable ORDER BY point DESC") :
    print(row)
con.close()`;

  /* 13-4 슬라이드용 짧은 버전 */
  const SL4_INJECT = `import sqlite3

con = sqlite3.connect(":memory:")
cur = con.cursor()
cur.execute("CREATE TABLE login (userId TEXT, password TEXT)")
cur.execute("INSERT INTO login VALUES('john', 'apple123')")
cur.execute("INSERT INTO login VALUES('kim', 'banana!')")

def login_bad(user, pw) :          # 위험 : 문자열 이어 붙이기
    sql = "SELECT userId FROM login WHERE userId = '" + user + "' AND password = '" + pw + "'"
    print("  SQL :", sql)
    return cur.execute(sql).fetchall()

def login_safe(user, pw) :         # 안전 : ? 자리표시자
    return cur.execute("SELECT userId FROM login WHERE userId = ? AND password = ?", (user, pw)).fetchall()

print("공격 :", login_bad("john", "' OR '1'='1"))
print("? 사용 :", login_safe("john", "' OR '1'='1"))
con.close()`;

  const SL4_TRANS = `import sqlite3

con = sqlite3.connect(":memory:")
cur = con.cursor()
cur.execute("CREATE TABLE account (name TEXT, money INTEGER CHECK (money >= 0))")
cur.execute("INSERT INTO account VALUES('철수', 10000)")
cur.execute("INSERT INTO account VALUES('영희', 5000)")
con.commit()

try :
    cur.execute("UPDATE account SET money = money - 8000 WHERE name = '철수'")   # 성공
    cur.execute("UPDATE account SET money = money - 8000 WHERE name = '영희'")   # 실패
    con.commit()
except sqlite3.IntegrityError as e :
    con.rollback()                 # 앞의 UPDATE 까지 한꺼번에 취소
    print("이체 실패 :", e)

print(cur.execute("SELECT name, money FROM account ORDER BY name").fetchall())
con.close()`;

  const SL4_CSV = `# ===== File: members.csv =====
id,name,city
john,John Bann,서울
kim,Kim Chi,부산
# ===== File: main.py =====
import sqlite3
import csv

con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE m (id TEXT, name TEXT, city TEXT)")

with open("members.csv", encoding="utf-8") as f :
    reader = csv.reader(f)
    next(reader)                      # 제목 줄 건너뛰기
    rows = list(reader)

con.executemany("INSERT INTO m VALUES(?, ?, ?)", rows)
print("가져온 행 :", con.execute("SELECT COUNT(*) FROM m").fetchone()[0])
print(con.execute("SELECT * FROM m").fetchall())
con.close()`;

  /* 13-4 실습 */
  const PR_EM_S = `import sqlite3

con = sqlite3.connect("cafeDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS menuTable")
cur.execute("CREATE TABLE menuTable (name TEXT, price INTEGER)")

menuList = [("아메리카노", 3000), ("카페라떼", 4000), ("녹차", 3500), ("레모네이드", 4500), ("핫초코", 4200)]
# TODO 1: executemany 로 menuList 를 한 번에 입력하고 commit
# TODO 2: 메뉴 개수와 가격 합계 출력 (COUNT(*), SUM(price))
# TODO 3: 가격이 비싼 순으로 전체 출력

con.close()
`;
  const PR_EM = `import sqlite3

con = sqlite3.connect("cafeDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS menuTable")
cur.execute("CREATE TABLE menuTable (name TEXT, price INTEGER)")

menuList = [("아메리카노", 3000), ("카페라떼", 4000), ("녹차", 3500), ("레모네이드", 4500), ("핫초코", 4200)]
cur.executemany("INSERT INTO menuTable VALUES(?, ?)", menuList)
con.commit()

print("저장된 메뉴 :", cur.execute("SELECT COUNT(*) FROM menuTable").fetchone()[0], "개")
print("가격 합계 :", cur.execute("SELECT SUM(price) FROM menuTable").fetchone()[0], "원")
for row in cur.execute("SELECT * FROM menuTable ORDER BY price DESC") :
    print(row)
con.close()
`;

  const PR_AUTO_S = `import sqlite3

con = sqlite3.connect("guestDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS guestBook")

# TODO 1: guestBook 만들기 (no INTEGER PRIMARY KEY 자동 번호, name NOT NULL, message NOT NULL)

# TODO 2: 방명록 3건 입력 — no 는 적지 말고, 저장 뒤 cur.lastrowid 를 출력

# TODO 3: 번호가 큰 것부터 "[번호] 이름 - 내용" 형식으로 출력

con.close()
`;
  const PR_AUTO = `import sqlite3

con = sqlite3.connect("guestDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS guestBook")
cur.execute("CREATE TABLE guestBook (no INTEGER PRIMARY KEY, name TEXT NOT NULL, message TEXT NOT NULL)")

for name, message in [("철수", "반갑습니다"), ("영희", "잘 보고 갑니다"), ("민수", "또 올게요")] :
    cur.execute("INSERT INTO guestBook (name, message) VALUES(?, ?)", (name, message))
    print(cur.lastrowid, "번 글 저장 :", name)
con.commit()

for no, name, message in cur.execute("SELECT * FROM guestBook ORDER BY no DESC") :
    print("[%d] %s - %s" % (no, name, message))
con.close()
`;

  const PR_CSVIN_S = `# ===== File: menu.csv =====
name,price,kind
아메리카노,3000,커피
카페라떼,4000,커피
녹차,3500,차
레모네이드,4500,음료
# ===== File: main.py =====
import sqlite3
import csv

con = sqlite3.connect("cafeDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS menuTable")
cur.execute("CREATE TABLE menuTable (name TEXT, price INTEGER, kind TEXT)")

# TODO 1: csv.reader 로 menu.csv 를 읽고 첫 줄(제목)은 건너뛰기
# TODO 2: 가격은 int 로 바꿔 executemany 로 입력하고 commit
# TODO 3: 가져온 행 수를 출력
# TODO 4: 종류(kind)별 개수와 평균 가격 출력

con.close()
`;
  const PR_CSVIN = `# ===== File: menu.csv =====
name,price,kind
아메리카노,3000,커피
카페라떼,4000,커피
녹차,3500,차
레모네이드,4500,음료
# ===== File: main.py =====
import sqlite3
import csv

con = sqlite3.connect("cafeDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS menuTable")
cur.execute("CREATE TABLE menuTable (name TEXT, price INTEGER, kind TEXT)")

with open("menu.csv", encoding="utf-8") as f :
    reader = csv.reader(f)
    next(reader)
    rows = [(r[0], int(r[1]), r[2]) for r in reader]

cur.executemany("INSERT INTO menuTable VALUES(?, ?, ?)", rows)
con.commit()

print("가져온 행 :", cur.execute("SELECT COUNT(*) FROM menuTable").fetchone()[0])
for kind, cnt, avg in cur.execute("SELECT kind, COUNT(*), ROUND(AVG(price), 1) FROM menuTable GROUP BY kind ORDER BY kind") :
    print("%s : %d개, 평균 %.1f원" % (kind, cnt, avg))
con.close()
`;

  const PJ_LEDGER_S = `import sqlite3

con = sqlite3.connect("ledgerDB")
cur = con.cursor()
cur.execute("""CREATE TABLE IF NOT EXISTS ledger (
    no     INTEGER PRIMARY KEY,
    day    TEXT    NOT NULL,
    kind   TEXT    NOT NULL CHECK (kind IN ('수입', '지출')),
    item   TEXT    NOT NULL,
    amount INTEGER NOT NULL CHECK (amount > 0))""")
cur.execute("DELETE FROM ledger")           # 실습용 : 실행할 때마다 처음부터
con.commit()

def add() :
    day = input("날짜(MM-DD) : ")
    kind = input("수입/지출 : ")
    item = input("내용 : ")
    money = input("금액 : ")
    # TODO 1: money 가 숫자가 아니면 "  ! 금액은 숫자로 입력하세요" 출력 후 return
    # TODO 2: ? 자리표시자로 INSERT 하고 commit, 저장한 번호(lastrowid) 출력
    #         sqlite3.IntegrityError 가 나면 rollback 하고 오류 메시지 출력

def showAll() :
    # TODO 3: 번호 순으로 전체 출력 (없으면 "  (기록이 없습니다)")
    pass

def summary() :
    # TODO 4: 수입 합계 · 지출 합계 · 남은 돈 출력 (SUM, IFNULL)
    # TODO 5: 지출이 큰 항목 상위 3개 출력 (GROUP BY item)
    pass

while True :
    menu = input("1 입력  2 목록  3 요약  4 종료 ==> ")
    if menu == "1" :
        add()
    elif menu == "2" :
        showAll()
    elif menu == "3" :
        summary()
    elif menu == "4" :
        break
    else :
        print("  ! 1 ~ 4 중에서 고르세요")

con.close()
print("가계부를 닫았습니다")
`;
  const PJ_LEDGER = `import sqlite3

con = sqlite3.connect("ledgerDB")
cur = con.cursor()
cur.execute("""CREATE TABLE IF NOT EXISTS ledger (
    no     INTEGER PRIMARY KEY,
    day    TEXT    NOT NULL,
    kind   TEXT    NOT NULL CHECK (kind IN ('수입', '지출')),
    item   TEXT    NOT NULL,
    amount INTEGER NOT NULL CHECK (amount > 0))""")
cur.execute("DELETE FROM ledger")           # 실습용 : 실행할 때마다 처음부터
con.commit()

def add() :
    day = input("날짜(MM-DD) : ")
    kind = input("수입/지출 : ")
    item = input("내용 : ")
    money = input("금액 : ")
    if not money.isdigit() :
        print("  ! 금액은 숫자로 입력하세요")
        return
    try :
        cur.execute("INSERT INTO ledger (day, kind, item, amount) VALUES(?, ?, ?, ?)",
                    (day, kind, item, int(money)))
        con.commit()
        print("  ->", cur.lastrowid, "번으로 저장했습니다")
    except sqlite3.IntegrityError as e :
        con.rollback()
        print("  ! 저장 실패 :", e)

def showAll() :
    rows = cur.execute("SELECT * FROM ledger ORDER BY no").fetchall()
    if len(rows) == 0 :
        print("  (기록이 없습니다)")
    for no, day, kind, item, amount in rows :
        print("  %d번 %s %s %s %d원" % (no, day, kind, item, amount))

def summary() :
    income = cur.execute("SELECT IFNULL(SUM(amount), 0) FROM ledger WHERE kind = '수입'").fetchone()[0]
    spend = cur.execute("SELECT IFNULL(SUM(amount), 0) FROM ledger WHERE kind = '지출'").fetchone()[0]
    print("  수입 %d원 / 지출 %d원 / 남은 돈 %d원" % (income, spend, income - spend))
    print("  지출이 큰 항목")
    for item, total in cur.execute("""SELECT item, SUM(amount) FROM ledger WHERE kind = '지출'
                                      GROUP BY item ORDER BY SUM(amount) DESC LIMIT 3""") :
        print("   -", item, total, "원")

while True :
    menu = input("1 입력  2 목록  3 요약  4 종료 ==> ")
    if menu == "1" :
        add()
    elif menu == "2" :
        showAll()
    elif menu == "3" :
        summary()
    elif menu == "4" :
        break
    else :
        print("  ! 1 ~ 4 중에서 고르세요")

con.close()
print("가계부를 닫았습니다")
`;

  /* ---------- 13-5 : 조인 · row_factory · CSV 내보내기 ---------- */
  const SHOP_SETUP = `import sqlite3

con = sqlite3.connect("shopDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS memberTable")
cur.execute("DROP TABLE IF EXISTS orderTable")
cur.execute("CREATE TABLE memberTable (id TEXT PRIMARY KEY, userName TEXT, city TEXT)")
cur.execute("CREATE TABLE orderTable (orderId INTEGER PRIMARY KEY, id TEXT, product TEXT, price INTEGER)")
cur.executemany("INSERT INTO memberTable VALUES(?, ?, ?)",
                [("john", "John Bann", "서울"), ("kim", "Kim Chi", "부산"), ("lee", "Lee Pal", "서울")])
cur.executemany("INSERT INTO orderTable (id, product, price) VALUES(?, ?, ?)",
                [("john", "노트북", 1100), ("john", "마우스", 30), ("kim", "키보드", 20)])
con.commit()`;

  /* 조인 그림 */
  const F_JOIN = SV(1280, 500, [
    DEFS,
    T(60, 44, 'memberTable', { a: 'start', fs: 21, b: 1 }),
    TBL(60, 56, [100, 170, 110], [['id', 'userName', 'city'], ['john', 'John Bann', '서울'], ['kim', 'Kim Chi', '부산'], ['lee', 'Lee Pal', '서울']], { fs: 17 }),
    R(58, 54, 104, 156, { f: 'none', s: 'var(--accent2)', sw: 3, rx: 4, dash: 1 }),
    T(700, 44, 'orderTable', { a: 'start', fs: 21, b: 1 }),
    TBL(700, 56, [110, 100, 140, 100], [['orderId', 'id', 'product', 'price'], ['1', 'john', '노트북', '1100'], ['2', 'john', '마우스', '30'], ['3', 'kim', '키보드', '20']], { fs: 17 }),
    R(808, 54, 104, 156, { f: 'none', s: 'var(--accent2)', sw: 3, rx: 4, dash: 1 }),
    Ln(165, 240, 805, 240, { arrow: 1, sw: 3, s: 'var(--accent2)' }),
    T(485, 232, '같은 값을 가진 열로 이어 붙인다', { fs: 19, c: 'var(--accent2)' }),
    T(485, 275, 'ON memberTable.id = orderTable.id', { fs: 20, mono: 1, b: 1 }),
    T(330, 320, '조인 결과 (INNER JOIN — 양쪽에 다 있는 것만)', { a: 'start', fs: 20, b: 1, c: 'var(--ok)' }),
    TBL(330, 332, [200, 160, 110], [['userName', 'product', 'price'], ['John Bann', '노트북', '1100'], ['John Bann', '마우스', '30'], ['Kim Chi', '키보드', '20']], { fs: 17 }),
    T(640, 492, "주문이 없는 Lee Pal 은 빠진다 (LEFT JOIN 으로 하면 product 가 None 으로 나온다)", { fs: 18, c: 'var(--muted)' })
  ].join(''));

  /* 13-5 슬라이드용 짧은 버전 */
  const SL5_JOIN = `import sqlite3

con = sqlite3.connect(":memory:")
cur = con.cursor()
cur.execute("CREATE TABLE m (id TEXT, userName TEXT)")
cur.execute("CREATE TABLE o (orderId INTEGER, id TEXT, product TEXT, price INTEGER)")
cur.executemany("INSERT INTO m VALUES(?, ?)", [("john", "John Bann"), ("kim", "Kim Chi"), ("lee", "Lee Pal")])
cur.executemany("INSERT INTO o VALUES(?, ?, ?, ?)",
                [(1, "john", "노트북", 1100), (2, "john", "마우스", 30), (3, "kim", "키보드", 20)])

print("내부 조인")
for row in cur.execute("SELECT m.userName, o.product, o.price FROM m JOIN o ON m.id = o.id ORDER BY o.orderId") :
    print("  ", row)

print("회원별 합계")
for row in cur.execute("SELECT m.userName, COUNT(*), SUM(o.price) FROM m JOIN o ON m.id = o.id GROUP BY m.id") :
    print("  ", row)
con.close()`;

  const SL5_CSV = `import sqlite3
import csv

con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE o (product TEXT, price INTEGER)")
con.executemany("INSERT INTO o VALUES(?, ?)", [("노트북", 1100), ("마우스", 30)])

cur = con.execute("SELECT * FROM o")
heads = [d[0] for d in cur.description]      # 열 이름
rows = cur.fetchall()
con.close()

with open("out.csv", "w", encoding="utf-8", newline="") as f :
    writer = csv.writer(f)
    writer.writerow(heads)
    writer.writerows(rows)

print(open("out.csv", encoding="utf-8").read(), end="")`;

  const X5_JOIN = `${SHOP_SETUP}

print("① 내부 조인 : 주문한 회원의 이름과 제품")
for row in cur.execute("""SELECT memberTable.userName, orderTable.product, orderTable.price
                          FROM memberTable INNER JOIN orderTable
                          ON memberTable.id = orderTable.id
                          ORDER BY orderTable.orderId""") :
    print("   ", row)

print("② 표 이름에 별명을 붙이면 짧아진다")
for row in cur.execute("""SELECT m.userName, o.product FROM memberTable m JOIN orderTable o
                          ON m.id = o.id WHERE m.city = '서울'""") :
    print("   ", row)

print("③ 조인 + GROUP BY : 회원별 주문 건수와 금액 합계")
for row in cur.execute("""SELECT m.userName, COUNT(*), SUM(o.price) FROM memberTable m JOIN orderTable o
                          ON m.id = o.id GROUP BY m.id ORDER BY m.id""") :
    print("   ", row)

print("④ LEFT JOIN : 주문이 없는 회원도 보여 준다")
for row in cur.execute("""SELECT m.userName, o.product FROM memberTable m LEFT JOIN orderTable o
                          ON m.id = o.id ORDER BY m.id, o.orderId""") :
    print("   ", row)
con.close()`;

  const X5_SUB = `${SHOP_SETUP}

print("평균보다 비싼 주문 :",
      cur.execute("SELECT product, price FROM orderTable WHERE price > (SELECT AVG(price) FROM orderTable)").fetchall())
print("주문한 적이 있는 회원 :",
      cur.execute("SELECT userName FROM memberTable WHERE id IN (SELECT id FROM orderTable)").fetchall())
print("주문한 적이 없는 회원 :",
      cur.execute("SELECT userName FROM memberTable WHERE id NOT IN (SELECT id FROM orderTable)").fetchall())
con.close()`;

  const X5_ROWD = `${SHOP_SETUP}

con.row_factory = sqlite3.Row            # 이 줄 하나로 행을 열 이름으로 다룰 수 있다
cur = con.cursor()

row = cur.execute("SELECT * FROM memberTable WHERE id = 'kim'").fetchone()
print("번호로 :", row[1])
print("이름으로 :", row["userName"], row["city"])
print("열 이름 목록 :", row.keys())
print("딕셔너리로 :", dict(row))
con.close()`;

  const X5_CSVOUT = `${SHOP_SETUP}

import csv

cur.execute("SELECT * FROM orderTable ORDER BY orderId")
heads = [d[0] for d in cur.description]          # 열 이름
rows = cur.fetchall()

with open("order_backup.csv", "w", encoding="utf-8", newline="") as f :
    writer = csv.writer(f)
    writer.writerow(heads)
    writer.writerows(rows)
con.close()

print("--- order_backup.csv ---")
print(open("order_backup.csv", encoding="utf-8").read(), end="")`;

  const X5_ERRORS = `import sqlite3

con = sqlite3.connect(":memory:")
cur = con.cursor()
cur.execute("CREATE TABLE userTable (id TEXT, birthYear INTEGER)")
cur.execute("INSERT INTO userTable VALUES('john', 1990)")

tests = ["SELECT * FROM userTabel",                  # 테이블 이름 오타
         "SELECT name FROM userTable",               # 없는 열
         "SELECT * FROM userTable WHERE id = john",  # 값에 따옴표를 빠뜨림
         "SELCT * FROM userTable"]                   # SQL 키워드 오타

for sql in tests :
    try :
        cur.execute(sql)
    except sqlite3.Error as e :
        print(type(e).__name__, ":", e)
con.close()`;

  const X5_FETCHMANY = `import sqlite3

con = sqlite3.connect(":memory:")
cur = con.cursor()
cur.execute("CREATE TABLE t (n INTEGER)")
cur.executemany("INSERT INTO t VALUES(?)", [(i,) for i in range(1, 11)])

cur.execute("SELECT n FROM t")
print("3개씩 :", cur.fetchmany(3), cur.fetchmany(3))

print("커서를 직접 반복 :", end=" ")
for row in cur.execute("SELECT n FROM t WHERE n > 7") :    # fetchall 없이 한 행씩
    print(row[0], end=" ")
print()
print("한 값만 :", cur.execute("SELECT COUNT(*) FROM t").fetchone()[0])
con.close()`;

  /* 13-5 실습 */
  const PR_ROWF_S = `${SHOP_SETUP}

# TODO 1: con.row_factory = sqlite3.Row 로 설정하고 커서를 다시 만들기
# TODO 2: 회원 전체를 "이름(아이디) - 도시" 형식으로 출력 (row["userName"] 처럼 열 이름 사용)
# TODO 3: lee 회원 한 명을 꺼내 열 이름 목록(row.keys())과 dict(row) 출력

con.close()
`;
  const PR_ROWF = `${SHOP_SETUP}

con.row_factory = sqlite3.Row
cur = con.cursor()

for row in cur.execute("SELECT * FROM memberTable ORDER BY id") :
    print("%s(%s) - %s" % (row["userName"], row["id"], row["city"]))

row = cur.execute("SELECT * FROM memberTable WHERE id = 'lee'").fetchone()
print("열 이름 :", row.keys())
print("딕셔너리 :", dict(row))
con.close()
`;

  const PR_JOIN_S = `${SHOP_SETUP}

# TODO 1: 두 테이블을 조인해 "회원이름 - 제품 (가격원)" 형식으로 주문 내역 출력
#         (JOIN orderTable o ON m.id = o.id, ORDER BY o.orderId)
# TODO 2: 회원별 주문 금액 합계 출력 (GROUP BY m.id)

con.close()
`;
  const PR_JOIN = `${SHOP_SETUP}

print("주문 내역 (회원 이름과 함께)")
for name, product, price in cur.execute("""SELECT m.userName, o.product, o.price
                                           FROM memberTable m JOIN orderTable o ON m.id = o.id
                                           ORDER BY o.orderId""") :
    print("  %s - %s (%d원)" % (name, product, price))

print("회원별 주문 금액 합계")
for name, total in cur.execute("""SELECT m.userName, SUM(o.price) FROM memberTable m JOIN orderTable o
                                  ON m.id = o.id GROUP BY m.id ORDER BY m.id""") :
    print("  %s : %d원" % (name, total))
con.close()
`;

  const PR_CSVOUT_S = `${SHOP_SETUP}

import csv

# TODO 1: 조인 결과(회원이름 · 제품 · 가격)를 조회하고 cur.description 으로 열 이름 얻기
# TODO 2: order_report.csv 에 제목 줄과 모든 행 쓰기 (csv.writer, newline="")
# TODO 3: 내보낸 행 수를 출력하고 파일 내용을 그대로 출력해 확인

con.close()
`;
  const PR_CSVOUT = `${SHOP_SETUP}

import csv

cur.execute("""SELECT m.userName, o.product, o.price FROM memberTable m JOIN orderTable o
               ON m.id = o.id ORDER BY o.orderId""")
heads = [d[0] for d in cur.description]
rows = cur.fetchall()
con.close()

with open("order_report.csv", "w", encoding="utf-8", newline="") as f :
    writer = csv.writer(f)
    writer.writerow(heads)
    writer.writerows(rows)

print("내보낸 행 :", len(rows))
print(open("order_report.csv", encoding="utf-8").read(), end="")
`;

  const PJ_LOAN_SETUP = `import sqlite3
import csv

con = sqlite3.connect("libraryDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS loanTable")
cur.execute("DROP TABLE IF EXISTS bookTable")
cur.execute("DROP TABLE IF EXISTS memberTable")
cur.execute("CREATE TABLE bookTable (bookId TEXT PRIMARY KEY, title TEXT NOT NULL, writer TEXT)")
cur.execute("CREATE TABLE memberTable (memberId TEXT PRIMARY KEY, name TEXT NOT NULL)")
cur.execute("""CREATE TABLE loanTable (loanId INTEGER PRIMARY KEY, bookId TEXT, memberId TEXT,
                                       day TEXT, back TEXT DEFAULT 'N')""")

cur.executemany("INSERT INTO bookTable VALUES(?, ?, ?)",
                [("b01", "파이썬 입문", "김파이"), ("b02", "데이터베이스 첫걸음", "이디비"),
                 ("b03", "알고리즘 산책", "박알고"), ("b04", "웹 프로그래밍", "최웹")])
cur.executemany("INSERT INTO memberTable VALUES(?, ?)",
                [("m01", "김철수"), ("m02", "이영희"), ("m03", "박민수")])
cur.executemany("INSERT INTO loanTable (bookId, memberId, day, back) VALUES(?, ?, ?, ?)",
                [("b01", "m01", "03-02", "Y"), ("b02", "m01", "03-05", "N"),
                 ("b03", "m02", "03-07", "N"), ("b01", "m02", "03-10", "N")])
con.commit()`;

  const PJ_LOAN_S = `${PJ_LOAN_SETUP}

# TODO 1: 대출 중(back='N')인 책을 "제목 - 회원이름 (날짜 대출)" 형식으로 출력
#         loanTable 과 bookTable · memberTable 을 JOIN
# TODO 2: 회원별 대출 횟수를 많은 순으로 출력
# TODO 3: 2회 이상 대출된 인기 책 출력 (GROUP BY + HAVING)
# TODO 4: 한 번도 대출되지 않은 책 출력 (NOT IN 서브쿼리)
# TODO 5: 전체 대출 기록을 loan_report.csv 로 내보내기

con.close()
`;
  const PJ_LOAN = `${PJ_LOAN_SETUP}

print("===== 대출 중인 책 =====")
for title, name, day in cur.execute("""SELECT b.title, m.name, l.day
                                       FROM loanTable l JOIN bookTable b ON l.bookId = b.bookId
                                                        JOIN memberTable m ON l.memberId = m.memberId
                                       WHERE l.back = 'N' ORDER BY l.loanId""") :
    print("%s - %s (%s 대출)" % (title, name, day))

print("===== 회원별 대출 횟수 =====")
for name, cnt in cur.execute("""SELECT m.name, COUNT(*) FROM memberTable m JOIN loanTable l
                                ON m.memberId = l.memberId GROUP BY m.memberId ORDER BY COUNT(*) DESC, m.memberId""") :
    print("%s : %d권" % (name, cnt))

print("===== 인기 있는 책 (대출 2회 이상) =====")
for title, cnt in cur.execute("""SELECT b.title, COUNT(*) FROM bookTable b JOIN loanTable l
                                 ON b.bookId = l.bookId GROUP BY b.bookId HAVING COUNT(*) >= 2""") :
    print("%s : %d회" % (title, cnt))

print("===== 한 번도 빌려 가지 않은 책 =====")
for row in cur.execute("SELECT title FROM bookTable WHERE bookId NOT IN (SELECT bookId FROM loanTable)") :
    print(row[0])

cur.execute("""SELECT b.title, m.name, l.day, l.back FROM loanTable l
               JOIN bookTable b ON l.bookId = b.bookId
               JOIN memberTable m ON l.memberId = m.memberId ORDER BY l.loanId""")
heads = [d[0] for d in cur.description]
rows = cur.fetchall()
with open("loan_report.csv", "w", encoding="utf-8", newline="") as f :
    writer = csv.writer(f)
    writer.writerow(heads)
    writer.writerows(rows)
print("loan_report.csv 로", len(rows), "행을 내보냈습니다")
con.close()
`;

  /* ---------- 13-6 : 설계 · with · ORM · 종합 ---------- */
  const X6_NORMAL = `import sqlite3

con = sqlite3.connect(":memory:")
cur = con.cursor()

cur.execute("CREATE TABLE badOrder (userName TEXT, email TEXT, product TEXT)")
cur.executemany("INSERT INTO badOrder VALUES(?, ?, ?)",
                [("Kim Chi", "kim@daum.net", "노트북"), ("Kim Chi", "kim@daum.net", "마우스"),
                 ("Kim Chi", "kim@daum.net", "키보드")])
cur.execute("UPDATE badOrder SET email = 'kim@gmail.com' WHERE userName = 'Kim Chi' AND product = '노트북'")
print("한 행만 고치면 :", cur.execute("SELECT DISTINCT email FROM badOrder").fetchall())
print("→ 같은 사람의 이메일이 두 가지가 되어 버렸다 (데이터 불일치)")

cur.execute("CREATE TABLE member (id TEXT PRIMARY KEY, userName TEXT, email TEXT)")
cur.execute("CREATE TABLE orderTable (orderId INTEGER PRIMARY KEY, id TEXT, product TEXT)")
cur.execute("INSERT INTO member VALUES('kim', 'Kim Chi', 'kim@daum.net')")
cur.executemany("INSERT INTO orderTable (id, product) VALUES(?, ?)",
                [("kim", "노트북"), ("kim", "마우스"), ("kim", "키보드")])
cur.execute("UPDATE member SET email = 'kim@gmail.com' WHERE id = 'kim'")
print("테이블을 나누면 :", cur.execute("SELECT email FROM member").fetchall(), "→ 한 곳만 고치면 끝")
con.close()`;

  const X6_WITH = `import sqlite3

con = sqlite3.connect("naverDB")
${U_CREATE_IF.replace('cur.', 'con.')}
con.execute("DELETE FROM userTable")
con.commit()

with con :                      # 블록이 정상으로 끝나면 자동 commit
    con.execute("INSERT INTO userTable VALUES('john', 'John Bann', 'john@naver.com', 1990)")

try :
    with con :                  # 블록에서 예외가 나면 자동 rollback
        con.execute("INSERT INTO userTable VALUES('kim', 'Kim Chi', 'kim@daum.net', 1992)")
        raise ValueError("입력 중 문제 발생!")
except ValueError as e :
    print("예외 :", e)

print("남은 회원 :", [row[0] for row in con.execute("SELECT id FROM userTable")])
con.close()                     # with 는 연결을 닫지 않는다 → close 는 따로`;

  const X6_ORM = `# ① 이 장에서 배운 방법 : SQL 문을 직접 쓴다
cur.execute("SELECT userName FROM memberTable WHERE city = ?", ("서울",))
names = [row[0] for row in cur.fetchall()]

# ② ORM(SQLAlchemy)을 쓰는 방법 : 테이블을 파이썬 클래스로, 행을 객체로 다룬다
class Member(Base) :
    __tablename__ = "memberTable"
    id = Column(String, primary_key = True)
    userName = Column(String)
    city = Column(String)

members = session.query(Member).filter(Member.city == "서울").all()
names = [m.userName for m in members]

# ③ 새 회원 추가도 객체를 만들어 session 에 넣는다
session.add(Member(id = "su", userName = "Su Ji", city = "부산"))
session.commit()`;

  const C_GUI_CRUD = `import sqlite3
from tkinter import *
from tkinter import messagebox

DB = "naverDB"

def runSql(sql, values = ()) :                  # SQL 실행 도우미 (입력 · 수정 · 삭제)
    con = sqlite3.connect(DB)
    cur = con.cursor()
    cur.execute(sql, values)
    n = cur.rowcount
    con.commit()
    con.close()
    return n

def showRows(rows) :
    listData.delete(0, END)
    listData.insert(END, "%-8s %-12s %-18s %s" % ("사용자ID", "이름", "이메일", "출생연도"))
    for row in rows :
        listData.insert(END, "%-8s %-12s %-18s %s" % row)

def selectData() :
    con = sqlite3.connect(DB)
    rows = con.execute("SELECT * FROM userTable ORDER BY id").fetchall()
    con.close()
    showRows(rows)

def searchData() :
    word = edtFind.get().strip()
    con = sqlite3.connect(DB)
    rows = con.execute("SELECT * FROM userTable WHERE id LIKE ? OR userName LIKE ?",
                       ("%" + word + "%", "%" + word + "%")).fetchall()
    con.close()
    showRows(rows)

def insertData() :
    data = [e.get().strip() for e in edts]
    if "" in data :
        messagebox.showwarning("확인", "네 칸을 모두 입력하세요")
        return
    try :
        runSql("INSERT INTO userTable VALUES(?, ?, ?, ?)", (data[0], data[1], data[2], int(data[3])))
    except ValueError :
        messagebox.showerror("오류", "출생연도는 숫자로 입력하세요")
    except sqlite3.Error as e :
        messagebox.showerror("오류", str(e))
    else :
        for e in edts :
            e.delete(0, END)
        selectData()

def deleteData() :
    uid = edts[0].get().strip()
    if uid == "" :
        messagebox.showwarning("확인", "삭제할 사용자ID 를 첫 칸에 입력하세요")
        return
    if messagebox.askyesno("확인", uid + " 회원을 삭제할까요?") :
        n = runSql("DELETE FROM userTable WHERE id = ?", (uid,))
        messagebox.showinfo("결과", str(n) + "명을 삭제했습니다")
        selectData()

con = sqlite3.connect(DB)
${U_CREATE_IF.replace('cur.', 'con.')}
con.close()

window = Tk()
window.geometry("640x340")
window.title("회원 관리 (입력 · 검색 · 삭제)")

edtFrame = Frame(window)
edtFrame.pack()
edts = []
for i in range(4) :
    e = Entry(edtFrame, width = 10)
    e.pack(side = LEFT, padx = 4, pady = 8)
    edts.append(e)
Button(edtFrame, text = "입력", command = insertData).pack(side = LEFT, padx = 4)
Button(edtFrame, text = "삭제", command = deleteData).pack(side = LEFT, padx = 4)

findFrame = Frame(window)
findFrame.pack()
edtFind = Entry(findFrame, width = 14)
edtFind.pack(side = LEFT, padx = 4, pady = 4)
Button(findFrame, text = "검색", command = searchData).pack(side = LEFT, padx = 4)
Button(findFrame, text = "전체 보기", command = selectData).pack(side = LEFT, padx = 4)

listData = Listbox(window, bg = "lightyellow", width = 70)
listData.pack(fill = BOTH, expand = 1, padx = 6, pady = 6)

selectData()
window.mainloop()`;

  /* 13-6 실습 */
  const PR_WITH_S = `import sqlite3

con = sqlite3.connect("myDB")
con.execute("DROP TABLE IF EXISTS todoTable")
con.execute("CREATE TABLE todoTable (no INTEGER PRIMARY KEY, work TEXT NOT NULL, done TEXT DEFAULT 'N')")

# TODO 1: with con : 블록 안에서 할 일 3개를 INSERT (commit 은 쓰지 않는다)
# TODO 2: with con : 블록 안에서 1번 할 일을 done = 'Y' 로 UPDATE
# TODO 3: con.close() 한 뒤 다시 연결해서 전체를 출력 — 저장되었는지 확인

con.close()
`;
  const PR_WITH = `import sqlite3

con = sqlite3.connect("myDB")
con.execute("DROP TABLE IF EXISTS todoTable")
con.execute("CREATE TABLE todoTable (no INTEGER PRIMARY KEY, work TEXT NOT NULL, done TEXT DEFAULT 'N')")

with con :                          # commit 을 직접 쓰지 않아도 된다
    con.execute("INSERT INTO todoTable (work) VALUES('파이썬 복습')")
    con.execute("INSERT INTO todoTable (work) VALUES('실습 과제')")
    con.execute("INSERT INTO todoTable (work) VALUES('책 반납')")

with con :
    con.execute("UPDATE todoTable SET done = 'Y' WHERE no = 1")

con.close()

con = sqlite3.connect("myDB")       # 다시 열어서 저장되었는지 확인
for row in con.execute("SELECT * FROM todoTable ORDER BY no") :
    print(row)
con.close()
`;

  const PR_EXC_S = `import sqlite3

def safeQuery(sql) :
    con = sqlite3.connect(":memory:")
    con.execute("CREATE TABLE userTable (id TEXT, birthYear INTEGER)")
    con.execute("INSERT INTO userTable VALUES('john', 1990)")
    # TODO: try 안에서 sql 을 실행해 결과를 fetchall 하고
    #       sqlite3.OperationalError 면 "조회할 수 없습니다 : 메시지"
    #       그 밖의 sqlite3.Error 면 "데이터베이스 오류 : 메시지"
    #       오류가 없으면 else 에서 "결과 : …" 를 출력
    #       finally 에서 반드시 con.close()
    con.close()

safeQuery("SELECT * FROM userTable")
safeQuery("SELECT * FROM userTabel")
safeQuery("SELECT name FROM userTable")
safeQuery("SELECT * FROM userTable WHERE id = john")
`;
  const PR_EXC = `import sqlite3

def safeQuery(sql) :
    con = sqlite3.connect(":memory:")
    con.execute("CREATE TABLE userTable (id TEXT, birthYear INTEGER)")
    con.execute("INSERT INTO userTable VALUES('john', 1990)")
    try :
        rows = con.execute(sql).fetchall()
    except sqlite3.OperationalError as e :
        print("조회할 수 없습니다 :", e)
    except sqlite3.Error as e :
        print("데이터베이스 오류 :", e)
    else :
        print("결과 :", rows)
    finally :
        con.close()

safeQuery("SELECT * FROM userTable")
safeQuery("SELECT * FROM userTabel")
safeQuery("SELECT name FROM userTable")
safeQuery("SELECT * FROM userTable WHERE id = john")
`;

  const PR_GUIF_S = `import sqlite3
from tkinter import *

con = sqlite3.connect("naverDB")
${U_CREATE_IF.replace('cur.', 'con.')}
con.close()

def searchData() :
    word = edtFind.get().strip()
    # TODO 1: id 나 userName 에 word 가 들어간 회원을 조회 (LIKE 와 ? 자리표시자)
    # TODO 2: 리스트 상자를 비우고 결과를 한 줄씩 넣기 (없으면 "찾는 회원이 없습니다")
    pass

window = Tk()
window.title("회원 검색")
edtFind = Entry(window, width = 20)
edtFind.pack(side = LEFT, padx = 5, pady = 5)
Button(window, text = "검색", command = searchData).pack(side = LEFT)
listData = Listbox(window, bg = "lightyellow", width = 60)
listData.pack(fill = BOTH, expand = 1)
window.mainloop()
`;
  const PR_GUIF = `import sqlite3
from tkinter import *

con = sqlite3.connect("naverDB")
${U_CREATE_IF.replace('cur.', 'con.')}
con.execute("DELETE FROM userTable")
con.executemany("INSERT INTO userTable VALUES(?, ?, ?, ?)",
                [("john", "John Bann", "john@naver.com", 1990), ("kim", "Kim Chi", "kim@daum.net", 1992),
                 ("lee", "Lee Pal", "lee@paran.com", 1988)])
con.commit()
con.close()

def searchData() :
    word = edtFind.get().strip()
    con = sqlite3.connect("naverDB")
    rows = con.execute("SELECT * FROM userTable WHERE id LIKE ? OR userName LIKE ?",
                       ("%" + word + "%", "%" + word + "%")).fetchall()
    con.close()
    listData.delete(0, END)
    if len(rows) == 0 :
        listData.insert(END, "찾는 회원이 없습니다")
    for row in rows :
        listData.insert(END, "%-6s %-12s %-18s %s" % row)

window = Tk()
window.title("회원 검색")
edtFind = Entry(window, width = 20)
edtFind.pack(side = LEFT, padx = 5, pady = 5)
Button(window, text = "검색", command = searchData).pack(side = LEFT)
listData = Listbox(window, bg = "lightyellow", width = 60)
listData.pack(fill = BOTH, expand = 1)
searchData()                      # 시작할 때 전체 목록 보여 주기
window.mainloop()
`;

  const PJ_MEM_S = `import sqlite3

con = sqlite3.connect("naverDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS memberTable")
cur.execute("""CREATE TABLE memberTable (
    id    TEXT PRIMARY KEY,
    name  TEXT NOT NULL,
    email TEXT UNIQUE,
    year  INTEGER)""")
con.commit()

def addMember() :
    uid = input("  아이디 : ")
    name = input("  이름 : ")
    email = input("  이메일 : ")
    year = input("  출생연도 : ")
    # TODO 1: 출생연도가 숫자가 아니면 안내하고 return
    # TODO 2: ? 자리표시자로 INSERT · commit, IntegrityError 면 rollback 후 메시지

def findMember() :
    word = input("  검색할 이름(일부) : ")
    # TODO 3: name LIKE '%word%' 로 검색해 출력 (없으면 안내)

def editMember() :
    # TODO 4: 아이디와 새 이메일을 입력받아 UPDATE, cur.rowcount 로 수정된 수 출력
    pass

def deleteMember() :
    # TODO 5: 아이디를 입력받아 DELETE, cur.rowcount 로 삭제된 수 출력
    pass

def listMember() :
    # TODO 6: 전체 회원 수와 목록 출력
    pass

while True :
    menu = input("1 추가  2 검색  3 수정  4 삭제  5 목록  0 종료 ==> ")
    if menu == "1" :
        addMember()
    elif menu == "2" :
        findMember()
    elif menu == "3" :
        editMember()
    elif menu == "4" :
        deleteMember()
    elif menu == "5" :
        listMember()
    elif menu == "0" :
        break
    else :
        print("  ! 메뉴 번호를 다시 확인하세요")

con.close()
print("회원 관리를 끝냅니다")
`;
  const PJ_MEM = `import sqlite3

con = sqlite3.connect("naverDB")
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS memberTable")
cur.execute("""CREATE TABLE memberTable (
    id    TEXT PRIMARY KEY,
    name  TEXT NOT NULL,
    email TEXT UNIQUE,
    year  INTEGER)""")
con.commit()

def addMember() :
    uid = input("  아이디 : ")
    name = input("  이름 : ")
    email = input("  이메일 : ")
    year = input("  출생연도 : ")
    if not year.isdigit() :
        print("  ! 출생연도는 숫자로 입력하세요")
        return
    try :
        cur.execute("INSERT INTO memberTable VALUES(?, ?, ?, ?)", (uid, name, email, int(year)))
        con.commit()
        print("  ->", name, "님을 추가했습니다")
    except sqlite3.IntegrityError as e :
        con.rollback()
        print("  ! 추가 실패 :", e)

def findMember() :
    word = input("  검색할 이름(일부) : ")
    rows = cur.execute("SELECT * FROM memberTable WHERE name LIKE ?", ("%" + word + "%",)).fetchall()
    if len(rows) == 0 :
        print("  (찾는 회원이 없습니다)")
    for row in rows :
        print("  ", row)

def editMember() :
    uid = input("  수정할 아이디 : ")
    email = input("  새 이메일 : ")
    cur.execute("UPDATE memberTable SET email = ? WHERE id = ?", (email, uid))
    con.commit()
    print("  ->", cur.rowcount, "명을 수정했습니다")

def deleteMember() :
    uid = input("  삭제할 아이디 : ")
    cur.execute("DELETE FROM memberTable WHERE id = ?", (uid,))
    con.commit()
    print("  ->", cur.rowcount, "명을 삭제했습니다")

def listMember() :
    rows = cur.execute("SELECT * FROM memberTable ORDER BY id").fetchall()
    print("  전체", len(rows), "명")
    for uid, name, email, year in rows :
        print("  %s %s %s %d" % (uid, name, email, year))

while True :
    menu = input("1 추가  2 검색  3 수정  4 삭제  5 목록  0 종료 ==> ")
    if menu == "1" :
        addMember()
    elif menu == "2" :
        findMember()
    elif menu == "3" :
        editMember()
    elif menu == "4" :
        deleteMember()
    elif menu == "5" :
        listMember()
    elif menu == "0" :
        break
    else :
        print("  ! 메뉴 번호를 다시 확인하세요")

con.close()
print("회원 관리를 끝냅니다")
`;

  /* ================================================================== */
  PY_COURSE.addChapter({
    id: 'ch13',
    no: '13',
    title: '데이터베이스',
    subtitle: 'SQLite · SQL · sqlite3 모듈',
    summary: '데이터베이스와 DBMS 의 개념을 익히고, SQLite 에서 SQL 문(CREATE · INSERT · SELECT)으로 데이터베이스를 구축한 뒤, 파이썬 sqlite3 모듈로 데이터를 입력 · 조회하는 콘솔 프로그램과 GUI 프로그램을 만듭니다.',
    goals: [
      '데이터베이스, DBMS, 테이블, 행, 열 등 데이터베이스 용어를 설명할 수 있다',
      'SQLite 에서 CREATE TABLE · INSERT · SELECT 문으로 데이터베이스를 구축하고 조회할 수 있다',
      '파이썬 sqlite3 모듈로 연결 → 커서 → execute → commit → close 순서의 입력 프로그램을 만들 수 있다',
      'fetchone() · fetchall() 로 조회 결과를 꺼내 출력할 수 있다',
      'tkinter 와 데이터베이스를 연동한 GUI 입력 · 조회 프로그램을 만들 수 있다'
    ],
    sections: [
      /* ============================================================ 13-1 */
      {
        id: 'ch13-1',
        title: '데이터베이스의 기본',
        minutes: 50,
        goals: [
          '이 장에서 만들 두 프로그램을 미리 살펴본다',
          '데이터베이스와 DBMS 가 무엇인지, 파일 처리와 무엇이 다른지 설명할 수 있다',
          '관계형 데이터베이스의 구성 요소(테이블 · 행 · 열 · 열 이름 · 데이터 형식)를 구분할 수 있다',
          'SQL 이 사용자와 DBMS 사이의 언어임을 이해한다'
        ],
        flow: [['도입: 이 장에서 만들 프로그램', 5], ['데이터베이스 · DBMS 개념', 12], ['관계형 DB · 용어', 15], ['파이썬으로 맛보기', 10], ['정리 · 퀴즈', 8]],
        content: [
          { type: 'h', text: '이 장에서 만들 프로그램' },
          { type: 'p', html: '지금까지 만든 프로그램은 실행이 끝나면 데이터가 사라지거나(변수), 텍스트 파일에 줄 단위로 저장했습니다(11장). 이번 장에서는 데이터를 <b>표 형태로 체계적으로 저장하고 꺼내 쓰는 데이터베이스</b>를 다룹니다. 이 장에서 만드는 프로그램은 두 가지입니다.' },
          { type: 'list', items: [
            '<b>[프로그램 1] 데이터베이스 기본</b> — 파이썬 코드 없이 SQLite 명령행 도구(<code>sqlite3.exe</code>)에 SQL 문을 직접 입력해 회원 데이터를 저장하고 조회합니다.',
            '<b>[프로그램 2] 파이썬에서 SQLite</b> — 파이썬 <code>sqlite3</code> 모듈로 데이터를 입력 · 조회하고, 마지막에는 tkinter 창에서 [입력] · [조회] 버튼으로 다루는 GUI 프로그램을 완성합니다.'
          ] },
          { type: 'figure', html: T_SELECT, caption: '[프로그램 1] SQLite 명령행 도구에서 회원 테이블을 조회한 화면 (노란 글자가 사용자가 입력한 값)' },
          { type: 'figure', html: F_GUI, caption: '[프로그램 2] 입력칸에 값을 넣고 [입력] → [조회] 하면 아래 목록에 새 회원(woo)이 나타난다' },
          { type: 'callout', kind: 'info', title: '이 웹 강좌에서는 이렇게 실습합니다', html: '<code>sqlite3.exe</code> 같은 명령행 프로그램은 브라우저에서 실행할 수 없습니다. 그래서 [프로그램 1]은 <b>화면 그림과 설명</b>으로 익히고, 똑같은 SQL 문을 <b>파이썬 sqlite3 모듈로 실행하는 코드</b>로 바꾸어 직접 실행해 봅니다. 파이썬에는 SQLite 엔진이 기본으로 들어 있어 설치가 필요 없습니다. 데이터베이스 파일(<code>naverDB</code>)은 <b>📁 작업 폴더</b>에 만들어집니다.' },

          { type: 'h', text: '데이터베이스란?' },
          { type: 'p', html: '<b>데이터베이스(Database, DB)</b>는 많은 양의 데이터를 <mark>정해진 규칙에 따라 체계적으로 저장</mark>해 두고, 필요할 때 빠르고 정확하게 찾고 고칠 수 있게 만든 데이터의 모음입니다. 도서관에 비유하면, 책을 아무렇게나 쌓아 두는 창고가 아니라 분류 번호대로 꽂아 두고 검색 컴퓨터로 찾을 수 있게 정리한 서가와 같습니다.' },
          { type: 'p', html: '데이터가 적을 때는 11장에서 배운 <b>파일 처리</b>(텍스트 파일에 쓰고 읽기)로도 충분합니다. 하지만 회원이 수만 명이 되고, 여러 사람이 동시에 조회 · 수정해야 한다면 파일만으로는 감당하기 어렵습니다. 이때 데이터베이스를 씁니다.' },
          { type: 'table', head: ['비교', '파일 처리', '데이터베이스'], rows: [
            ['알맞은 경우', '데이터 양이 적을 때 (메모, 설정, 간단한 기록)', '데이터 양이 많고 자주 찾고 고칠 때'],
            ['찾기', '처음부터 한 줄씩 읽으며 직접 비교', '<code>SELECT … WHERE 조건</code> 한 줄로 요청'],
            ['수정 · 삭제', '파일 전체를 다시 써야 하는 경우가 많음', '<code>UPDATE</code> · <code>DELETE</code> 로 필요한 행만'],
            ['여러 사용자', '동시에 쓰면 내용이 꼬이기 쉬움', 'DBMS 가 순서를 관리해 안전하게 처리'],
            ['데이터 구조', '프로그램마다 제각각 (쉼표? 탭?)', '테이블(열 이름 · 데이터 형식)로 약속됨']
          ], caption: '파일 처리와 데이터베이스' },

          { type: 'h', text: 'DBMS — 데이터베이스를 관리하는 소프트웨어' },
          { type: 'p', html: '데이터베이스를 만들고, 저장하고, 찾아 주는 일을 대신 해 주는 소프트웨어를 <b>DBMS(DataBase Management System)</b>라고 합니다. 우리는 DBMS 에게 “이런 데이터를 넣어 줘”, “이 조건에 맞는 데이터를 찾아 줘” 라고 요청만 하면 됩니다.' },
          { type: 'table', head: ['DBMS', '만든 곳', '특징'], rows: [
            ['오라클(Oracle)', 'Oracle', '대기업 · 은행 등 대규모 시스템에서 많이 사용'],
            ['SQL 서버(SQL Server)', 'Microsoft', '윈도 서버 환경에서 많이 사용'],
            ['MySQL', 'Oracle (오픈 소스)', '웹 사이트 · 서비스에서 널리 사용, 무료 버전'],
            ['액세스(Access)', 'Microsoft', 'MS 오피스에 포함된 개인 · 소규모용'],
            ['<b>SQLite</b>', '오픈 소스', '<mark>서버 없이 파일 하나</mark>가 곧 DB. 스마트폰 앱, 브라우저, 파이썬에 내장']
          ] },
          { type: 'callout', kind: 'more', title: '📘 왜 SQLite 로 배울까?', html: '오라클이나 MySQL 은 따로 <b>서버 프로그램</b>을 설치하고 계정을 만들어야 쓸 수 있습니다. SQLite 는 데이터베이스 전체가 <b>파일 한 개</b>(예: <code>naverDB</code>)에 들어 있고, 파이썬에 <code>sqlite3</code> 모듈로 기본 포함되어 있어 <code>import sqlite3</code> 한 줄이면 바로 쓸 수 있습니다. 여러분 스마트폰의 연락처 · 메시지 앱도 내부적으로 SQLite 를 쓰는 경우가 많습니다. 여기서 배운 SQL 문은 다른 DBMS 에서도 거의 그대로 통합니다.' },

          { type: 'h', text: '관계형 데이터베이스' },
          { type: 'p', html: 'DBMS 는 데이터를 저장하는 모양에 따라 <b>계층형(Hierarchical)</b>, <b>망형(Network)</b>, <b>관계형(Relational)</b>, <b>객체지향형(Object-Oriented)</b>, <b>객체관계형(Object-Relational)</b> 등으로 나뉩니다. 오늘날 가장 많이 쓰는 것은 <b>관계형 DBMS(RDBMS)</b>입니다. 오라클, SQL 서버, 액세스, MySQL, SQLite 가 모두 관계형입니다.' },
          { type: 'list', items: [
            '관계형 DB 는 모든 데이터를 <b>테이블(표)</b> 형태로 저장합니다. 엑셀 시트를 떠올리면 됩니다.',
            '여러 테이블을 공통된 열(예: 회원 아이디)로 <b>관계</b>를 맺어 연결할 수 있어서 “관계형” 이라고 부릅니다.',
            '구조가 단순하고 튼튼해 널리 쓰이지만, 표를 여러 개 연결해 복잡하게 계산하면 <b>속도가 전반적으로 느린 편</b>이라는 단점이 있습니다.'
          ] },

          { type: 'h', text: '데이터베이스 관련 용어' },
          { type: 'figure', html: F_DBMS, caption: '그림 13-1 DBMS 구성도 — DBMS 안에 여러 데이터베이스가, 데이터베이스 안에 여러 테이블이 있다' },
          { type: 'table', head: ['용어', '뜻', '위 그림에서'], rows: [
            ['<b>데이터</b>', '하나하나의 단편적인 정보', '<code>john</code>, <code>lee@paran.com</code>, <code>1980</code>'],
            ['<b>테이블</b>', '데이터를 표 형태로 표현한 것', '회원 테이블(<code>userTable</code>)'],
            ['<b>데이터베이스(DB)</b>', '테이블이 저장되는 저장소. 보통 <b>원통</b> 모양으로 그림', '<code>naverDB</code>'],
            ['<b>DBMS</b>', '데이터베이스를 관리하는 시스템(소프트웨어)', 'SQLite'],
            ['<b>열</b>(컬럼 · 필드)', '세로 한 줄. 테이블은 1개 이상의 열로 구성', 'id 열, email 열 …'],
            ['<b>열 이름</b>', '열을 구분하는 이름. <mark>한 테이블 안에서 중복 불가</mark>', '<code>id</code>, <code>userName</code>, <code>email</code>, <code>birthYear</code>'],
            ['<b>데이터 형식</b>', '열에 저장할 값의 종류. 테이블을 만들 때 열 이름과 함께 지정', '<code>char(4)</code>(문자), <code>int</code>(정수)'],
            ['<b>행</b>(로우 · 레코드)', '가로 한 줄. 실제 데이터 한 건', "john 한 사람의 정보 전체"],
            ['<b>SQL</b>', 'Structured Query Language, 구조화된 질의 언어. 사용자와 DBMS 가 소통하는 말', '<code>SELECT * FROM userTable</code>']
          ] },
          { type: 'callout', kind: 'tip', title: '파이썬 자료형과 연결해 보기', html: '파이썬으로 조회하면 <b>행 하나는 튜플</b> <code>(\'john\', \'John Bann\', \'john@naver.com\', 1990)</code> 로, <b>여러 행은 튜플의 리스트</b>로 돌아옵니다. 즉 테이블 = “튜플을 모은 리스트” 로 생각하면 이해하기 쉽습니다.' },

          { type: 'h', text: '파이썬으로 맛보기' },
          { type: 'p', html: '자세한 문법은 다음 교시부터 배우고, 여기서는 데이터베이스가 어떻게 동작하는지 먼저 실행해 봅니다. ▶ 실행 후 📁 작업 폴더를 열어 보면 🗄️ <code>naverDB</code> 파일이 생긴 것을 확인할 수 있습니다.' },
          { type: 'code', title: '추가 예제. 파이썬으로 만드는 첫 데이터베이스', code: C_FIRST, expect: '(\'john\', \'John Bann\', \'john@naver.com\', 1990)\n(\'kim\', \'Kim Chi\', \'kim@daum.net\', 1992)\n(\'lee\', \'Lee Pal\', \'lee@paran.com\', 1988)\n(\'park\', \'Park Su\', \'park@gmail.com\', 1980)',
            desc: '<code>connect()</code> 로 DB 파일을 열고, <code>execute()</code> 로 SQL 문을 실행합니다. 테이블 만들기(CREATE) → 행 넣기(INSERT) → 저장(commit) → 조회(SELECT) 순서입니다. 출력된 한 줄 한 줄이 테이블의 <b>행</b>이고, 괄호 안의 값 4개가 각각 <b>열</b>의 데이터입니다.' },
          { type: 'code', title: '추가 예제. 테이블의 열 이름 · 행 · 데이터 확인하기', code: C_TERMS, expect: '열 이름 : [\'id\', \'userName\', \'email\', \'birthYear\']\n열 개수 : 4\n행 개수 : 4\n첫 번째 행 : (\'john\', \'John Bann\', \'john@naver.com\', 1990)\n첫 번째 행의 email 데이터 : john@naver.com',
            desc: '<code>cur.description</code> 에는 조회 결과의 열 정보가 들어 있어 열 이름을 꺼낼 수 있습니다. <code>rows[0][2]</code> 는 “첫 번째 행의 세 번째 열(email)” 데이터입니다. 용어와 파이썬 자료형이 어떻게 대응하는지 확인해 보세요.' },
          { type: 'callout', kind: 'warn', title: 'DB 파일은 텍스트 파일이 아니에요', html: '<code>naverDB</code> 는 SQLite 전용 형식(이진 파일)이라 메모장으로 열면 깨진 글자처럼 보입니다. 내용은 반드시 SQL(명령행 도구 또는 파이썬 sqlite3 모듈)로 읽고 써야 합니다.' },

          { type: 'h', text: '한 걸음 더 — 파일에만 저장하면 무엇이 불편할까' },
          { type: 'p', html: '“데이터베이스가 왜 필요한가” 는 말로만 들으면 잘 와닿지 않습니다. 직접 비교해 봅시다. 회원 3명이 적힌 텍스트 파일에서 <b>kim 의 이메일만 바꾸는 일</b>을 파일 처리로 하면 이렇게 됩니다.' },
          { type: 'code', title: '추가 예제. 파일로 회원 정보 고치기', code: X1_FILE,
            expect: 'john,John Bann,john@naver.com,1990\nkim,Kim Chi,kim@gmail.com,1992\nlee,Lee Pal,lee@paran.com,1988',
            desc: '한 사람의 값 하나를 바꾸려고 <b>파일 전체를 읽고 → 쉼표로 쪼개고 → 다시 전부 쓰는</b> 세 단계를 거쳤습니다. 회원이 10만 명이면 10만 줄을 모두 다시 써야 합니다. 게다가 쓰는 도중 프로그램이 멈추면 파일이 반쯤 망가집니다.' },
          { type: 'code', title: '추가 예제. 같은 일을 데이터베이스로 하면', code: X1_DBWAY,
            expect: "('john', 'John Bann', 'john@naver.com', 1990)\n('kim', 'Kim Chi', 'kim@gmail.com', 1992)\n('lee', 'Lee Pal', 'lee@paran.com', 1988)",
            desc: '<code>UPDATE … WHERE id = \'kim\'</code> 한 줄이면 끝납니다. “어느 행을 어떻게 고칠지” 만 말하면 나머지는 DBMS 가 알아서 합니다. 이것이 데이터베이스를 쓰는 가장 큰 이유입니다.' },
          { type: 'callout', kind: 'more', title: '📘 파일 저장이 무너지는 세 가지 순간', html: '<ul><li><b>검색</b> — 조건에 맞는 데이터를 찾으려면 처음부터 끝까지 읽어야 합니다. DB 는 <b>인덱스</b>(3교시 보충)를 만들어 두어 수십만 건에서도 즉시 찾습니다.</li><li><b>동시성(concurrency)</b> — 두 사람이 같은 파일을 동시에 고치면 나중에 저장한 쪽이 앞의 변경을 덮어씁니다. DBMS 는 <b>잠금(lock)과 트랜잭션</b>으로 순서를 관리합니다.</li><li><b>일관성(consistency)</b> — 파일에는 “출생연도 칸에 글자” 같은 이상한 값도 그대로 들어갑니다. DB 는 <b>데이터 형식과 제약 조건</b>(2교시 보충: 기본키 · NOT NULL · UNIQUE)으로 잘못된 데이터를 애초에 막습니다.</li></ul><p>거꾸로 말하면, 설정 파일이나 짧은 메모처럼 <b>데이터가 적고 한 사람만 쓰는 경우에는 파일이 더 간단</b>합니다. 도구는 상황에 맞게 고르는 것입니다.</p>' },

          { type: 'h', text: '파일 DB 와 메모리 DB' },
          { type: 'p', html: '<code>sqlite3.connect()</code> 에 파일 이름 대신 <code>":memory:"</code> 를 주면 <b>메모리에만 존재하는 데이터베이스</b>가 만들어집니다. 파일을 만들지 않아 빠르고 깨끗해서, <b>연습·실험·테스트</b>에 좋습니다. 대신 연결을 닫는 순간 내용이 모두 사라집니다.' },
          { type: 'code', title: '추가 예제. 메모리 DB(:memory:)와 파일 DB 비교', code: X1_MEM,
            expect: '메모리 DB 행 개수 : 1\n다시 연 메모리 DB : no such table: t\n파일 DB 행 개수 : 1\ntestDB 파일이 만들어졌나요? True',
            desc: '메모리 DB 는 다시 열면 테이블조차 없어 <code>no such table</code> 오류가 납니다. 파일 DB 는 작업 폴더에 <code>testDB</code> 파일로 남아 다시 열어도 그대로입니다. 이 장의 예제들은 대부분 파일 DB 를 쓰지만, <b>결과를 남길 필요가 없는 보충 예제는 메모리 DB</b> 를 씁니다.' },
          { type: 'table', head: ['비교', '파일 DB <code>connect("naverDB")</code>', '메모리 DB <code>connect(":memory:")</code>'], rows: [
            ['저장 위치', '작업 폴더의 파일', '프로그램의 메모리(RAM)'],
            ['프로그램이 끝나면', '내용이 그대로 남는다', '모두 사라진다'],
            ['속도', '디스크에 쓰므로 조금 느림', '매우 빠름'],
            ['쓰임', '실제 프로그램의 데이터 보관', '연습 · 실험 · 자동 테스트']
          ] },

          { type: 'h', text: '왜 테이블을 여러 개로 나눌까' },
          { type: 'p', html: '관계형 데이터베이스의 “관계” 는 <b>테이블을 나눠 두고 공통된 열로 이어 붙이는 것</b>을 뜻합니다. 회원 한 사람이 주문을 세 번 했다고 회원 이름과 이메일을 세 번 적어 둘 필요는 없습니다.' },
          { type: 'code', title: '추가 예제. 한 테이블 vs 두 테이블', code: X1_TWO,
            expect: "① 한 테이블에 다 넣기 (회원 정보가 주문마다 반복)\n    ('Kim Chi', 'kim@daum.net', '노트북')\n    ('Kim Chi', 'kim@daum.net', '마우스')\n② 두 테이블로 나누기 (회원은 한 번만 저장하고 주문에는 아이디만)\n    회원 ('kim', 'Kim Chi', 'kim@daum.net')\n    주문 ('kim', '노트북')\n    주문 ('kim', '마우스')",
            desc: '①은 이메일이 바뀌면 <b>모든 주문 행</b>을 고쳐야 하고, 하나라도 빠뜨리면 같은 사람의 이메일이 두 가지가 됩니다. ②처럼 나누면 회원 정보는 한 곳에만 있습니다. 이렇게 중복을 줄이는 설계를 <b>정규화(normalization)</b> 라고 합니다(6교시 보충).' },
          { type: 'callout', kind: 'more', title: '📘 앞으로 배울 것 미리 보기', html: '나눠 둔 두 테이블을 다시 하나의 결과로 합쳐 보려면 <b>조인(JOIN)</b>(5교시)을 씁니다. 행을 구분하는 열은 <b>기본키(PRIMARY KEY)</b>, 다른 테이블의 기본키를 가리키는 열은 <b>외래키(FOREIGN KEY)</b> 라고 부릅니다(2교시). 이 장을 끝내면 “회원 표 + 주문 표 → 회원별 구매 금액” 같은 질문에 SQL 한 문장으로 답할 수 있습니다.' }
        ],
        practice: [
          { title: '실습 13-1-1. 우리 반 친구 테이블 만들기', level: 1,
            desc: '<p><code>myDB</code> 데이터베이스에 <code>friendTable</code>(이름 <code>name</code>, 나이 <code>age</code>, 사는 곳 <code>city</code>)을 만들고 친구 3명을 넣은 뒤 전체를 조회해 출력하세요.</p><p>예: <code>(\'철수\', 17, \'서울\')</code></p>',
            hint: '첫 예제의 CREATE → INSERT → commit → SELECT 순서를 그대로 따라 합니다. 문자열 값은 작은따옴표로 감쌉니다.',
            starter: PR_FRIEND_S, solution: PR_FRIEND,
            expect: "('철수', 17, '서울')\n('영희', 16, '부산')\n('민수', 17, '대전')" },
          { title: '실습 13-1-2. 메모리 DB 로 연습하기', level: 1,
            desc: '<p>파일을 만들지 않는 메모리 DB(<code>":memory:"</code>)에 <code>petTable</code>(이름 <code>name</code>, 종류 <code>kind</code>, 나이 <code>age</code>)을 만들고 반려동물 3마리를 넣으세요. 그런 다음 <b>마리 수</b>를 세어 출력하고 전체를 한 행씩 출력합니다.</p><p>▶ 여러 번 실행해도 <code>DROP TABLE</code> 없이 잘 동작합니다. 왜 그럴까요?</p>',
            hint: '<code>sqlite3.connect(":memory:")</code> 로 연결합니다. 마리 수는 <code>SELECT COUNT(*) FROM petTable</code> 후 <code>cur.fetchone()[0]</code>. 메모리 DB 는 프로그램이 끝나면 사라지므로 commit 도 필요 없습니다.',
            starter: PR_PET_S, solution: PR_PET,
            expect: "등록된 반려동물 : 3 마리\n('두부', '고양이', 3)\n('초코', '강아지', 5)\n('별이', '앵무새', 1)" },
          { title: '실습 13-1-3. 내 책장 데이터베이스', level: 2,
            desc: '<p><code>myDB</code> 에 <code>bookTable</code>(제목 <code>title</code>, 지은이 <code>writer</code>, 가격 <code>price</code>)을 만들고 책 5권을 넣으세요.</p><ul><li>전체를 조회해 <code>제목 / 지은이 / 가격 원</code> 형식으로 출력</li><li>맨 아래에 <b>책 수</b>와 <b>가격 합계</b>를 출력 (조회 결과 리스트에 <code>len()</code>, <code>sum()</code> 사용)</li></ul>',
            hint: '<code>rows = cur.fetchall()</code> 로 받아 두면 <code>for title, writer, price in rows :</code> 처럼 풀어 쓸 수 있고, <code>sum(row[2] for row in rows)</code> 로 합계도 구할 수 있습니다.',
            starter: PR_BOOK5_S, solution: PR_BOOK5,
            expect: '파이썬 입문 / 김파이 / 22000 원\n데이터베이스 첫걸음 / 이디비 / 25000 원\n알고리즘 산책 / 박알고 / 18000 원\n웹 프로그래밍 / 최웹 / 30000 원\n그림으로 보는 자료구조 / 정자료 / 27000 원\n책 수 : 5 권\n가격 합계 : 122000 원' },
          { title: '실습 13-1-4. 가수와 앨범 — 테이블 나누기', level: 2,
            desc: '<p>가수 정보와 앨범 정보를 <b>두 테이블</b>로 나누어 저장하세요.</p><ul><li><code>singerTable</code>(<code>singerId</code>, <code>singerName</code>, <code>debut</code>) — 가수 2명</li><li><code>albumTable</code>(<code>singerId</code>, <code>albumName</code>, <code>year</code>) — 앨범 3장 (가수 이름 대신 <b><code>singerId</code> 만</b> 적습니다)</li></ul><p>두 테이블을 각각 조회해 출력하고, 마지막에 “가수 이름은 한 번만 저장된다” 를 확인하는 문장을 출력하세요.</p>',
            hint: '앨범 테이블에 가수 이름을 그대로 넣으면 가수가 개명했을 때 모든 앨범 행을 고쳐야 합니다. 그래서 <code>singerId</code> 같은 <b>짧은 식별자</b>만 넣어 둡니다.',
            starter: PR_TWO_S, solution: PR_TWO,
            expect: "[가수]\n  ('s01', '하늘밴드', 2015)\n  ('s02', '바다소리', 2020)\n[앨범]\n  ('s01', '첫 번째 하늘', 2016)\n  ('s01', '두 번째 하늘', 2019)\n  ('s02', '파도', 2021)\n가수 이름은 singerTable 에 한 번만 저장된다 (중복 없음)" },
          { title: '🚀 프로젝트 13-1. 우리 동아리 데이터베이스', level: 3,
            desc: '<p>동아리를 관리하는 작은 데이터베이스 <code>clubDB</code> 를 직접 설계해 만드세요.</p><p><b>요구 사항</b></p><ol><li><code>memberTable</code>(<code>id</code>, <code>name</code>, <code>grade</code>(학년), <code>part</code>(파트))를 만들고 회원 <b>4명</b>을 입력합니다.</li><li><code>activityTable</code>(<code>id</code>, <code>day</code>, <code>title</code>)을 만들고 활동 기록 <b>4건</b>을 입력합니다. 활동에는 회원 이름 대신 <code>id</code> 를 적습니다.</li><li><code>===== 동아리 회원 =====</code>, <code>===== 활동 기록 =====</code> 제목과 함께 두 테이블을 각각 출력합니다.</li><li>맨 아래에 <b>회원 수</b>, <b>활동 수</b>, <b>개발 파트 회원 이름 목록</b>을 출력합니다.</li></ol><p><b>예시 출력</b></p><pre><code>===== 동아리 회원 =====\n(\'m01\', \'김철수\', 1, \'기획\')\n…\n회원 수 : 4 명\n활동 수 : 4 건\n개발 파트 : [\'이영희\', \'박민수\']</code></pre><p><b>여기까지 했다면 이렇게 더 해 보세요</b></p><ul><li>학년이 2학년 이상인 회원만 조회해 보기 (<code>WHERE grade &gt;= 2</code>)</li><li>활동이 있는 회원의 <b>이름</b>까지 함께 보이게 하기 — 5교시의 <code>JOIN</code> 을 배우면 한 문장으로 됩니다</li><li>회원 · 활동을 <code>input()</code> 으로 입력받도록 바꾸기 (4교시)</li></ul>',
            hint: '테이블마다 <code>DROP TABLE IF EXISTS</code> → <code>CREATE TABLE</code> → <code>INSERT</code> 순서로 만들고 마지막에 <code>con.commit()</code> 을 합니다. 이름 목록은 <code>[row[0] for row in cur.fetchall()]</code> 로 만듭니다.',
            starter: PJ_CLUB_S, solution: PJ_CLUB,
            expect: "===== 동아리 회원 =====\n('m01', '김철수', 1, '기획')\n('m02', '이영희', 2, '개발')\n('m03', '박민수', 1, '개발')\n('m04', '최지우', 3, '홍보')\n===== 활동 기록 =====\n('m01', '03-05', '신입 환영회')\n('m02', '03-12', '파이썬 스터디')\n('m02', '04-02', '해커톤 준비')\n('m04', '04-20', '동아리 홍보')\n회원 수 : 4 명\n활동 수 : 4 건\n개발 파트 : ['이영희', '박민수']" }
        ],
        quiz: [
          { q: '대량의 데이터를 체계적으로 저장해 두고 빠르게 찾고 수정할 수 있도록 관리해 주는 <b>소프트웨어</b>를 무엇이라고 하나요?',
            options: ['DBMS', 'SQL', '테이블', '커서'], answer: 0,
            explain: 'DBMS(DataBase Management System)는 데이터베이스를 관리하는 소프트웨어입니다. SQL 은 DBMS 와 대화하는 언어입니다.' },
          { q: '그림 13-1 의 회원 테이블에서 <code>kim, Kim Chi, kim@daum.net, 1992</code> 처럼 가로 한 줄 전체를 부르는 말은?',
            options: ['열(컬럼)', '행(로우)', '열 이름', '데이터 형식'], answer: 1,
            explain: '가로 한 줄은 실제 데이터 한 건인 <b>행(로우)</b>입니다. 세로 한 줄은 열(컬럼)입니다.' },
          { q: '다음 중 <b>관계형 DBMS 가 아닌 것</b>은?',
            options: ['오라클', 'MySQL', 'SQLite', '엑셀 파일(.xlsx)'], answer: 3,
            explain: '엑셀 파일은 표 모양이지만 DBMS 가 아니라 스프레드시트 문서입니다. 나머지는 모두 관계형 DBMS 입니다.' },
          { q: '파이썬 sqlite3 모듈로 테이블을 조회했을 때 <b>행 하나</b>는 어떤 자료형으로 돌아오나요?',
            options: ['문자열(str)', '딕셔너리(dict)', '튜플(tuple)', '정수(int)'], answer: 2,
            explain: '행 하나는 <code>(\'john\', \'John Bann\', \'john@naver.com\', 1990)</code> 같은 튜플이고, fetchall() 은 튜플의 리스트를 돌려줍니다.' },
          { q: '<code>sqlite3.connect(":memory:")</code> 로 만든 데이터베이스에 대한 설명으로 <b>틀린</b> 것은?',
            options: ['작업 폴더에 파일이 만들어지지 않는다', '연결을 닫으면 내용이 사라진다', '파일 DB 보다 빠르다', '다른 프로그램에서 같은 데이터를 다시 열 수 있다'], answer: 3,
            explain: '메모리 DB 는 그 연결 안에서만 존재합니다. 다시 연결하면 테이블조차 없어 <code>no such table</code> 오류가 납니다. 연습 · 테스트용으로 씁니다.' },
          { q: '회원 한 명이 주문을 여러 번 했을 때, 주문 테이블에 회원 이름과 이메일을 <b>매번 함께 적으면</b> 생기는 문제는?',
            options: ['주문을 조회할 수 없다', '이메일이 바뀌면 모든 주문 행을 고쳐야 하고, 빠뜨리면 값이 어긋난다', '테이블을 만들 수 없다', '파이썬에서 튜플로 꺼낼 수 없다'], answer: 1,
            explain: '같은 정보를 여러 곳에 중복 저장하면 수정할 때 한 곳이라도 빠뜨리면 데이터가 어긋납니다. 그래서 테이블을 나누고 <code>id</code> 로 연결합니다(정규화).' }
        ],
        slides: [
          { layout: 'title', title: '데이터베이스의 기본', subtitle: 'Chapter 13 · Section 01~02 — 이 장에서 만들 프로그램 · 데이터베이스의 기본', badge: '13-1',
            notes: '<p>12장까지 데이터를 변수와 텍스트 파일에 저장했다는 것을 떠올리게 하고, 이번 장은 “진짜 서비스들이 데이터를 저장하는 방법” 인 데이터베이스를 배운다고 소개합니다.</p><p>발문: “카카오톡 친구 목록 수백 명은 어디에 저장될까요?” (1분)</p>' },
          { layout: 'diagram', title: '[프로그램 1] SQLite 에서 데이터 조회', html: T_SELECT, caption: '파이썬 없이 SQL 문만으로 조회 — 노란 글자가 입력한 값',
            notes: '<p>명령행 도구 sqlite3.exe 에서 SQL 문을 직접 입력한 결과입니다. 표처럼 정렬된 출력이 <b>.header on</b>, <b>.mode column</b> 설정 덕분이라는 것은 뒤에서 배운다고 예고합니다.</p><p>웹 강좌에서는 같은 SQL 을 파이썬으로 실행한다고 안내합니다. (2분)</p>' },
          { layout: 'diagram', title: '[프로그램 2] 파이썬에서 SQLite', html: F_GUI, caption: '입력칸 → [입력] → [조회] 하면 목록에 새 회원 추가',
            notes: '<p>장의 최종 목표 화면입니다. 입력칸 4개, 버튼 2개, 노란 리스트 상자 4개로 되어 있고, 10장의 tkinter 와 이번 장의 DB 를 합친 프로그램이라고 설명합니다.</p><p>시간: 2분</p>' },
          { layout: 'bullets', title: '데이터베이스의 개념', lead: '대량의 데이터를 체계적으로 저장 · 처리하는 방법',
            bullets: ['<b>데이터베이스(DB)</b>: 규칙에 따라 정리해 둔 데이터 모음', '<b>파일 처리</b>: 데이터 양이 적을 때 알맞음 (11장)', '<b>DBMS</b>: 데이터베이스를 관리하는 소프트웨어', ['종류', ['오라클 · SQL 서버 · MySQL · 액세스 · <b>SQLite</b>']], '비유: 창고에 쌓아 둔 책 ↔ 분류 · 검색되는 도서관'],
            notes: '<p>도서관 비유로 “정리해서 저장” 과 “찾기 쉬움” 을 강조합니다. 파일 처리와의 차이는 다음 표에서 비교합니다.</p><p>시간: 4분</p>' },
          { layout: 'table', title: '파일 처리 vs 데이터베이스', head: ['비교', '파일 처리', '데이터베이스'],
            rows: [['알맞은 경우', '데이터가 적을 때', '많고 자주 찾을 때'], ['찾기', '한 줄씩 읽으며 비교', 'SELECT … WHERE'], ['수정 · 삭제', '파일을 다시 씀', 'UPDATE · DELETE'], ['여러 사용자', '꼬이기 쉬움', 'DBMS 가 관리'], ['구조', '제각각', '테이블로 약속']],
            notes: '<p>11장에서 회원 목록을 텍스트 파일로 저장했다면 “park 의 이메일만 바꾸기” 가 얼마나 번거로운지 질문해 보세요. DB 는 한 줄의 SQL 로 해결됩니다.</p><p>시간: 3분</p>' },
          { layout: 'bullets', title: '관계형 데이터베이스', lead: '모든 데이터를 테이블(표)로 저장',
            bullets: ['DBMS 구분: 계층형 · 망형 · <b>관계형</b> · 객체지향형 · 객체관계형', '관계형 DBMS: 오라클, SQL 서버, 액세스, MySQL, SQLite', '테이블끼리 공통 열로 <b>관계</b>를 맺어 연결', '단점: 속도가 전반적으로 느린 편'],
            notes: '<p>관계형이 가장 널리 쓰인다는 것만 기억하면 충분합니다. “관계” 는 회원 테이블의 id 와 주문 테이블의 id 처럼 표끼리 연결하는 것이라고 예를 들어 줍니다.</p><p>시간: 3분</p>' },
          { layout: 'diagram', title: '그림 13-1 DBMS 구성도', html: F_DBMS, caption: 'DBMS ⊃ 데이터베이스 ⊃ 테이블 ⊃ 행 · 열',
            notes: '<p>큰 틀에서 작은 단위로: DBMS(SQLite) 안에 여러 DB, naverDB 안에 여러 테이블, 회원 테이블 안에 행과 열. 빨간 상자가 행, 점선 상자가 열입니다.</p><p>발문: “park 의 출생연도 1980 은 몇 번째 행, 몇 번째 열?” (4분)</p>' },
          { layout: 'table', title: '데이터베이스 관련 용어', head: ['용어', '뜻'],
            rows: [['데이터', '하나하나의 단편적인 정보 (john, 1980)'], ['테이블', '데이터를 표 형태로 표현한 것'], ['DB · DBMS', '테이블 저장소 · 관리 소프트웨어'], ['열(컬럼) · 열 이름', '세로 줄 · 중복 불가한 이름'], ['데이터 형식', '열에 넣을 값의 종류 (char, int)'], ['행(로우)', '실질적인 데이터 한 건'], ['SQL', '사용자와 DBMS 가 소통하는 언어']],
            notes: '<p>용어는 이후 계속 쓰므로 확실히 짚고 넘어갑니다. 특히 <b>행 = 가로, 열 = 세로</b>를 헷갈리는 학생이 많습니다 (“열은 세로로 서 있는 기둥”).</p><p>시간: 4분</p>' },
          { layout: 'code', title: '파이썬으로 맛보기', code: C_FIRST,
            points: ['<code>connect()</code> : DB 파일 열기(없으면 생성)', '<code>execute()</code> : SQL 문 실행', 'CREATE → INSERT → commit → SELECT', '출력 한 줄 = 행(튜플)'],
            notes: '<p>문법은 나중에 자세히 배우니 지금은 “SQL 문을 문자열로 넣어 execute 한다” 는 흐름만 봅니다. 실행 후 📁 작업 폴더에서 🗄️ naverDB 파일을 보여 주세요.</p><p>시간: 5분</p>' },
          { layout: 'bullets', title: '파일에만 저장하면 무엇이 불편할까', lead: '“kim 의 이메일만 바꾸기” 를 해 보면 안다',
            bullets: ['파일 : 전체 읽기 → 쪼개기 → <b>전체 다시 쓰기</b>', 'DB : <code>UPDATE … WHERE id = \'kim\'</code> 한 줄', ['파일이 힘들어지는 순간', ['<b>검색</b> — 처음부터 다 읽어야 함', '<b>동시성</b> — 동시에 쓰면 덮어씀', '<b>일관성</b> — 이상한 값도 그대로 저장']], '데이터가 적고 혼자 쓰면 파일이 더 간단하다'],
            notes: '<p>본문의 두 예제(파일 방식 · DB 방식)를 나란히 실행해 보여 주면 가장 효과적입니다. “왜 DB 인가” 를 말이 아니라 코드 길이로 느끼게 합니다.</p><p>발문: “회원이 10만 명이면 파일 방식은 몇 줄을 다시 써야 할까요?” (4분)</p>' },
          { layout: 'code', title: '같은 일을 DB 로 하면 한 줄', code: X1_DBWAY,
            points: ['<code>":memory:"</code> : 파일 없는 연습용 DB', '<code>UPDATE … SET … WHERE</code>', '고칠 행만 DBMS 가 찾아서 수정', '파일 방식의 “전체 다시 쓰기” 와 비교'],
            notes: '<p>UPDATE 는 3교시에서 자세히 배우니 지금은 “한 줄로 끝난다” 는 것만 봅니다. WHERE 를 지우면 어떻게 될지 질문만 던져 두세요(3교시 복선).</p><p>시간: 4분</p>' },
          { layout: 'code', title: '파일 DB 와 메모리 DB', code: SL1_MEM,
            points: ['<code>connect("이름")</code> : 작업 폴더에 파일', '<code>connect(":memory:")</code> : 메모리에만', '메모리 DB 는 닫으면 사라짐', '연습 · 테스트에 편리'],
            notes: '<p>두 번째 연결에서 <code>no such table: t</code> 가 나오는 것을 함께 확인합니다. 이 강좌의 보충 예제들이 왜 :memory: 를 쓰는지도 설명합니다.</p><p>시간: 3분</p>' },
          { layout: 'quiz', title: '확인 문제', q: '회원 테이블에서 세로 한 줄(예: 모든 회원의 email)을 부르는 말은?',
            options: ['행(로우)', '열(컬럼)', '데이터베이스', 'DBMS'], answer: 1,
            explain: '세로 한 줄은 열(컬럼, 필드)입니다. 가로 한 줄은 행(로우)입니다.',
            notes: '<p>손을 들어 답하게 한 뒤, 가로/세로를 손으로 그려 보이며 정리합니다. (1분)</p>' },
          { layout: 'practice', title: '실습 13-1-1. 친구 테이블 만들기', desc: '<p>myDB 에 friendTable(name, age, city)을 만들고 3명을 넣어 조회하세요.</p>', starter: PR_FRIEND_S, solution: PR_FRIEND,
            notes: '<p>맛보기 예제를 복사해 테이블 이름과 열만 바꾸면 되는 과제입니다. 문자열 값의 작은따옴표를 빠뜨리는 실수를 살펴봅니다.</p><p>시간: 6분</p>' },
          { layout: 'practice', title: '🚀 프로젝트 13-1. 우리 동아리 DB', desc: '<p>memberTable(회원 4명)과 activityTable(활동 4건)을 만들어 목록 · 회원 수 · 활동 수 · 개발 파트 명단을 출력하세요.</p>', starter: PJ_CLUB_S, solution: PJ_CLUB,
            notes: '<p>이 교시의 종합 과제입니다. 활동 테이블에 회원 이름 대신 id 를 적는 이유(중복 제거)를 꼭 확인시키세요. 시간이 모자라면 과제로 냅니다.</p><p>시간: 10분 또는 과제</p>' },
          { layout: 'summary', title: '정리', bullets: ['데이터베이스: 대량 데이터를 체계적으로 저장 · 처리', 'DBMS: DB 관리 소프트웨어 (SQLite 는 파일 하나)', '관계형 DB: 테이블(행 · 열)로 저장, 공통 열로 관계', 'SQL: 사용자와 DBMS 의 언어 / 파이썬: 행 = 튜플', '파일 DB ↔ 메모리 DB(<code>:memory:</code>)'],
            notes: '<p>다음 시간에는 SQLite 명령행 도구로 DB 를 직접 구축([프로그램 1])한다고 예고합니다. (1분)</p>' }
        ]
      },

      /* ============================================================ 13-2 */
      {
        id: 'ch13-2',
        title: 'SQLite 로 데이터베이스 구축하기',
        minutes: 50,
        goals: [
          '데이터베이스 구축 및 운영 과정(3단계)을 설명할 수 있다',
          'SQLite 명령행 도구의 .open · .table · .schema 명령어를 이해한다',
          'CREATE TABLE 문으로 테이블을 만들고, INSERT 문으로 행을 입력할 수 있다',
          '명령행 도구에서 하는 일을 파이썬 sqlite3 코드로 똑같이 실행할 수 있다'
        ],
        flow: [['구축 과정 3단계', 5], ['SQLite 설치 · 접속 · .open', 10], ['CREATE TABLE · .table · .schema', 15], ['INSERT', 12], ['정리 · 퀴즈', 8]],
        content: [
          { type: 'h', text: '데이터베이스 구축 및 운영 과정' },
          { type: 'figure', html: F_STEPS, caption: '그림 13-2 데이터베이스 구축 및 운영 과정' },
          { type: 'p', html: '데이터베이스를 쓰려면 먼저 <b>DBMS 를 설치</b>하고(1단계), 그 안에 <b>데이터베이스를 구축</b>한 뒤(2단계), <b>응용 프로그램에서 데이터를 활용</b>합니다(3단계). 2단계는 다시 ❶ 데이터베이스 생성 → ❷ 테이블 생성 → ❸ 데이터 입력 → ❹ 데이터 조회 및 활용의 순서로 진행합니다. 이번 교시와 다음 교시에서 이 순서대로 [프로그램 1]을 완성합니다.' },

          { type: 'h', text: '1단계: DBMS 설치 (SQLite)' },
          { type: 'list', ordered: true, items: [
            '<code>https://www.sqlite.org/download.html</code> 에 접속합니다.',
            '<b>Precompiled Binaries for Windows</b> 항목에서 <code>sqlite-tools-win…zip</code>(명령행 도구 묶음)을 내려받습니다.',
            '압축을 풀어 <code>C:\\sqlite</code> 폴더에 넣습니다. 안에 <code>sqlite3.exe</code> 가 있으면 설치 끝입니다 (설치 프로그램 없이 파일만 복사).'
          ] },
          { type: 'callout', kind: 'info', title: '웹 강좌에서는 설치가 필요 없어요', html: '파이썬에는 SQLite 엔진이 <code>sqlite3</code> 모듈로 들어 있습니다. 이 강좌의 브라우저 파이썬에서도 <code>import sqlite3</code> 만 하면 바로 데이터베이스를 만들 수 있습니다. 아래에서는 명령행 도구의 화면을 먼저 보고, <b>같은 일을 하는 파이썬 코드</b>를 실행해 봅니다.' },

          { type: 'h', text: '2단계: SQLite 에 접속하기' },
          { type: 'p', html: '<code>sqlite3.exe</code> 를 더블클릭하면 아래와 같은 창이 열리고 <code>sqlite&gt;</code> 프롬프트가 나타납니다. 파이썬 셸의 <code>&gt;&gt;&gt;</code> 처럼 여기에 명령을 한 줄씩 입력합니다.' },
          { type: 'figure', html: T_START, caption: 'SQLite 명령행 도구를 처음 실행한 화면' },
          { type: 'p', html: '안내문의 <b>transient in-memory database</b> 는 “잠깐 쓰고 사라지는 메모리 속 데이터베이스” 라는 뜻입니다. 이 상태에서 만든 테이블은 창을 닫으면 없어지므로, 파일로 저장되는 데이터베이스를 쓰려면 <code>.open</code> 명령으로 파일을 열어야 합니다.' },
          { type: 'table', head: ['명령어', '하는 일'], rows: [
            ['<code>.open 데이터베이스이름</code>', '데이터베이스 파일을 연다 (없으면 새로 만든다)'],
            ['<code>.table</code>', '현재 데이터베이스의 테이블 목록을 보여 준다'],
            ['<code>.schema 테이블이름</code>', '테이블의 열 이름 · 데이터 형식 등 구조를 보여 준다'],
            ['<code>.header on</code>', 'SELECT 결과를 출력할 때 열 이름(헤더)을 보여 준다'],
            ['<code>.mode column</code>', 'SELECT 결과를 열을 맞춘 표 모양(컬럼 모드)으로 출력한다'],
            ['<code>.quit</code>', 'SQLite 를 종료한다']
          ], caption: 'Tip. 자주 사용하는 SQLite 명령어 (점(.)으로 시작하는 명령은 SQL 이 아니라 도구 자체의 명령)' },
          { type: 'callout', kind: 'tip', title: '점(.) 명령과 SQL 문 구별하기', html: '<code>.open</code>, <code>.table</code> 처럼 <b>점으로 시작하는 명령</b>은 sqlite3.exe 도구에만 있는 명령이라 세미콜론(<code>;</code>)이 필요 없습니다. 반면 <code>CREATE</code>, <code>INSERT</code>, <code>SELECT</code> 같은 <b>SQL 문</b>은 끝에 반드시 <code>;</code> 를 붙입니다. 세미콜론을 빠뜨리면 <code>...&gt;</code> 프롬프트가 나오며 다음 줄을 기다리는데, 이때 <code>;</code> 만 입력하고 Enter 를 치면 됩니다.' },

          { type: 'h', text: '❶ 데이터베이스 생성 — .open' },
          { type: 'figure', html: T_OPEN, caption: '.open naverDB — naverDB 라는 데이터베이스 파일을 열거나 새로 만든다' },
          { type: 'p', html: '파이썬에서는 <code>sqlite3.connect("naverDB")</code> 가 같은 일을 합니다. 파일이 없으면 새로 만들고, 있으면 그 파일에 연결합니다.' },
          { type: 'code', title: '같은 일을 파이썬으로 ❶ .open naverDB', code: C_OPEN,
 expect: 'naverDB 파일이 있나요? True',            desc: '<code>os.path.exists()</code> 로 작업 폴더에 <code>naverDB</code> 파일이 생겼는지 확인합니다. 강의자료의 <code>C:/CookPython/naverDB</code> 대신 작업 폴더의 <code>naverDB</code> 를 씁니다(브라우저에는 C: 드라이브가 없기 때문).' },

          { type: 'h', text: '❷ 테이블 생성 — CREATE TABLE' },
          { type: 'p', html: '데이터베이스 안에 테이블을 만드는 SQL 문의 형식은 다음과 같습니다. 괄호 안에 <b>열 이름과 데이터 형식</b>을 쉼표로 나열합니다.' },
          { type: 'code', run: false, title: 'CREATE TABLE 문의 형식', code: 'CREATE TABLE 테이블이름(열이름1 데이터형식, 열이름2 데이터형식, …);' },
          { type: 'figure', html: T_CREATE, caption: 'userTable 만들기 → .table 로 목록 확인 → .schema 로 구조 확인' },
          { type: 'table', head: ['열 이름', '데이터 형식', '의미'], rows: [
            ['<code>id</code>', '<code>char(4)</code>', '사용자 아이디 — 문자 4글자'],
            ['<code>userName</code>', '<code>char(15)</code>', '사용자 이름 — 문자 15글자'],
            ['<code>email</code>', '<code>char(15)</code>', '이메일 — 문자 15글자'],
            ['<code>birthYear</code>', '<code>int</code>', '출생연도 — 정수']
          ], caption: 'userTable 의 구조' },
          { type: 'code', title: '같은 일을 파이썬으로 ❷ CREATE TABLE · .table · .schema', code: C_CREATE,
 expect: 'userTable\nCREATE TABLE userTable (id char(4), userName char(15), email char(15), birthYear int);',            desc: '<code>.table</code> 과 <code>.schema</code> 는 도구 전용 명령이라 파이썬에는 없습니다. 대신 SQLite 가 테이블 정보를 모아 두는 특별한 테이블 <code>sqlite_master</code> 를 조회하면 같은 정보를 얻을 수 있습니다. <code>5행</code>의 <code>DROP TABLE IF EXISTS</code> 는 “테이블이 있으면 지우기” 로, 예제를 여러 번 실행해도 오류가 나지 않게 해 줍니다.' },
          { type: 'p', html: '같은 이름의 테이블을 두 번 만들면 어떻게 될까요? 오류가 납니다.' },
          { type: 'code', title: '추가 예제. 같은 테이블을 두 번 만들면?', code: C_CREATE_TWICE, expectError: true,
            expect: '첫 번째 CREATE 성공\nTraceback (most recent call last):\n  File "main.py", line 8, in <module>\n    cur.execute("CREATE TABLE userTable (id char(4), userName char(15), email char(15), birthYear int)")\n    ~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\nsqlite3.OperationalError: table userTable already exists',
            desc: '두 번째 CREATE 에서 <code>sqlite3.OperationalError: table userTable already exists</code> 오류가 납니다. 명령행 도구에서도 <code>Parse error: table userTable already exists</code> 와 같은 오류가 나타납니다.' },
          { type: 'code', title: '추가 예제. CREATE TABLE IF NOT EXISTS', code: C_CREATE_IF,
 expect: '첫 번째 실행 성공\n두 번째 실행도 성공 (이미 있으면 그냥 넘어감)',            desc: '<code>IF NOT EXISTS</code> 를 붙이면 테이블이 <b>없을 때만</b> 만들고, 이미 있으면 조용히 넘어갑니다. 이 강좌의 입력 예제들은 이 방법으로 “처음 실행해도, 여러 번 실행해도” 동작하게 만들었습니다.' },
          { type: 'callout', kind: 'more', title: '📘 SQLite 의 데이터 형식은 느슨해요', html: '<p>오라클 · MySQL 은 <code>char(4)</code> 열에 5글자를 넣으면 오류를 내거나 잘라 버립니다. 그런데 SQLite 는 데이터 형식을 “권장 사항” 정도로만 취급합니다(<b>형식 친화성, type affinity</b>). <code>char(4)</code> 에 8글자를 넣어도 그대로 저장되고, <code>int</code> 열에 문자열 <code>\'2000\'</code> 을 넣으면 정수 2000 으로 바꿔 저장합니다.</p><p>SQLite 가 실제로 구분하는 형식은 <code>INTEGER</code>(정수), <code>REAL</code>(실수), <code>TEXT</code>(문자열), <code>BLOB</code>(이진 데이터), <code>NULL</code> 다섯 가지입니다. 새로 만들 때는 <code>TEXT</code>, <code>INTEGER</code> 를 써도 좋습니다.</p>' },
          { type: 'code', title: '추가 예제. char(4) 에 8글자를 넣으면?', code: C_AFFINITY, expect: '(\'abcdefgh\', 2000, \'integer\')',
            desc: '<code>":memory:"</code> 로 연결하면 파일을 만들지 않고 메모리에만 임시 DB 를 만듭니다(명령행 도구의 transient in-memory database 와 같음). <code>typeof()</code> 는 실제로 저장된 형식을 알려 주는 SQLite 함수입니다.' },

          { type: 'h', text: '❸ 데이터 입력 — INSERT' },
          { type: 'p', html: '테이블에 행을 하나 넣는 SQL 문입니다. 값은 <b>열의 순서대로</b> 적고, 문자열은 <b>작은따옴표</b>로 감싸며, 숫자는 따옴표 없이 씁니다.' },
          { type: 'code', run: false, title: 'INSERT 문의 형식', code: 'INSERT INTO 테이블이름 VALUES(값1, 값2, …);' },
          { type: 'figure', html: T_INSERT, caption: '회원 4명(john, kim, lee, park)의 행 데이터 입력' },
          { type: 'code', title: '같은 일을 파이썬으로 ❸ INSERT', code: C_INSERT,
 expect: '입력된 행 개수 : 4',            desc: '<code>SELECT COUNT(*)</code> 는 행의 개수를 세는 SQL 문입니다. 명령행 도구는 문장마다 자동으로 저장하지만, 파이썬에서는 INSERT 뒤에 <code>con.commit()</code> 을 해야 파일에 저장된다는 점이 다릅니다(4교시에서 자세히 배웁니다).' },
          { type: 'callout', kind: 'warn', title: '자주 하는 실수', html: '<ul><li>문자열 값에 따옴표 빠뜨리기: <code>VALUES(john, …)</code> → <code>no such column: john</code> 오류 (john 을 열 이름으로 착각)</li><li>값 개수가 열 개수와 다름: <code>table userTable has 4 columns but 3 values were supplied</code></li><li>큰따옴표 사용: SQL 의 문자열은 작은따옴표가 표준입니다. 파이썬 문자열을 큰따옴표로 감싸고 그 안에 작은따옴표를 쓰면 편합니다.</li></ul>' },
          { type: 'callout', kind: 'more', title: '📘 집에서 sqlite3.exe 로 직접 해 보기', html: '<ol><li>sqlite.org 에서 sqlite-tools 를 내려받아 <code>C:\\sqlite</code> 에 풉니다.</li><li><code>sqlite3.exe</code> 를 실행하고 <code>.open naverDB</code> 를 입력합니다 (파일은 sqlite3.exe 가 있는 폴더에 생깁니다).</li><li>이 교시의 CREATE TABLE, INSERT 문을 그대로 입력합니다 (끝에 <code>;</code>).</li><li><code>.table</code>, <code>.schema userTable</code> 로 확인하고 <code>.quit</code> 로 끝냅니다.</li></ol><p>파이썬으로 만든 <code>naverDB</code> 파일도 sqlite3.exe 의 <code>.open</code> 으로 열 수 있습니다. 같은 SQLite 형식이기 때문입니다.</p>' },

          { type: 'h', text: '한 걸음 더 — SQLite 가 실제로 쓰는 다섯 가지 형식' },
          { type: 'p', html: '강의자료는 <code>char(4)</code>, <code>int</code> 를 썼지만, SQLite 가 값을 실제로 저장할 때 쓰는 형식은 다섯 가지뿐입니다. 새 테이블을 만들 때는 <b>TEXT · INTEGER · REAL</b> 로 쓰는 것이 요즘 방식입니다.' },
          { type: 'table', head: ['형식', '저장하는 값', '파이썬 자료형'], rows: [
            ['<code>INTEGER</code>', '정수 (1990, -5)', '<code>int</code>'],
            ['<code>REAL</code>', '실수 (1.5, 3.14)', '<code>float</code>'],
            ['<code>TEXT</code>', '문자열 (\'John\', \'파이썬\')', '<code>str</code>'],
            ['<code>BLOB</code>', '이진 데이터 (사진 · 파일 그대로)', '<code>bytes</code>'],
            ['<code>NULL</code>', '값이 없음 (0 도 빈 문자열도 아님)', '<code>None</code>']
          ], caption: 'SQLite 의 저장 형식 — <code>char(15)</code> 는 TEXT, <code>int</code> 는 INTEGER 로 취급됩니다' },
          { type: 'code', title: '추가 예제. typeof() 로 실제 형식 확인하기', code: X2_TYPES,
            expect: "('integer', 'real', 'text', 'blob')\n('null', 'null', 'null', 'null')\n값 : (10, 1.5, '파이썬')",
            desc: '두 번째 행은 모든 열에 <code>NULL</code> 을 넣었습니다. <b>NULL 은 “아직 값이 없다”</b> 는 뜻이며 파이썬에서는 <code>None</code> 으로 꺼내집니다. 0이나 빈 문자열과 다릅니다(3교시의 <code>IS NULL</code> 참고).' },

          { type: 'h', text: '제약 조건(constraint) — 잘못된 데이터를 애초에 막기' },
          { type: 'p', html: '테이블을 만들 때 열 이름 · 형식 뒤에 <b>제약 조건</b>을 적어 두면, 규칙을 어기는 데이터는 <mark>입력 자체가 거부</mark>됩니다. 프로그램에서 일일이 검사하는 것보다 훨씬 안전합니다. “이 값은 반드시 있어야 한다”, “중복되면 안 된다” 같은 약속을 데이터베이스가 대신 지켜 주기 때문입니다.' },
          { type: 'table', head: ['제약 조건', '뜻', '예'], rows: [
            ['<code>PRIMARY KEY</code>', '<b>기본키</b> — 행을 구분하는 열. 중복 불가 + 빈 값 불가', '회원 아이디, 학번, 주문 번호'],
            ['<code>NOT NULL</code>', '값을 반드시 넣어야 함', '이름, 제목'],
            ['<code>UNIQUE</code>', '값이 서로 달라야 함 (비어 있는 것은 허용)', '이메일, 전화번호'],
            ['<code>DEFAULT 값</code>', '값을 주지 않으면 이 값으로', "등급 <code>'일반'</code>, 수량 <code>0</code>"],
            ['<code>CHECK (조건)</code>', '조건을 만족하는 값만 허용', '<code>point &gt;= 0</code>, <code>score BETWEEN 0 AND 100</code>'],
            ['<code>FOREIGN KEY</code>', '<b>외래키</b> — 다른 테이블에 실제로 있는 값만 허용', '주문의 회원 아이디']
          ] },
          { type: 'code', title: '추가 예제. 제약 조건이 있는 회원 테이블', code: X2_CONSTRAINT,
            expect: "('john', 'John Bann', 'john@naver.com', '일반', 100)\n('kim', 'Kim Chi', None, '일반', 0)",
            desc: '값을 넣을 열을 <code>INSERT INTO 테이블 (열1, 열2) VALUES(…)</code> 처럼 <b>골라서</b> 적을 수도 있습니다. kim 은 이메일과 등급을 적지 않았으므로 이메일은 <code>None</code>(NULL), 등급은 기본값 <code>\'일반\'</code> 이 들어갔습니다. <code>--</code> 는 SQL 의 주석입니다.' },
          { type: 'code', title: '추가 예제. 제약을 어기면 어떤 오류가 날까', code: X2_VIOLATION,
            expect: '기본키 중복 → IntegrityError : UNIQUE constraint failed: memberTable.id\n이름이 비었음 → IntegrityError : NOT NULL constraint failed: memberTable.userName\n이메일 중복 → IntegrityError : UNIQUE constraint failed: memberTable.email\n포인트가 음수 → IntegrityError : CHECK constraint failed: point >= 0\n결국 저장된 행 : 1',
            desc: '제약을 어기면 <code>sqlite3.IntegrityError</code>(무결성 오류)가 납니다. 오류 메시지에 <b>어떤 제약이 어느 열에서 깨졌는지</b> 그대로 적혀 있으니 꼭 읽어 보세요. <code>try ~ except sqlite3.IntegrityError</code> 로 잡으면 프로그램이 멈추지 않고 “이미 있는 아이디입니다” 같은 안내를 할 수 있습니다.' },
          { type: 'callout', kind: 'more', title: '📘 기본키는 무엇으로 정할까 · rowid 와 자동 번호', html: '<p>기본키는 <b>변하지 않고, 절대 겹치지 않는 값</b>이어야 합니다. 이름 · 전화번호는 바뀔 수 있으므로 보통 <code>id</code>, <code>학번</code>, <code>주문번호</code> 같은 전용 열을 만듭니다.</p><p>마땅한 값이 없으면 <code>no INTEGER PRIMARY KEY</code> 처럼 <b>정수형 기본키</b>를 두면 SQLite 가 1, 2, 3 … 을 자동으로 넣어 줍니다(4교시 <code>lastrowid</code> 참고). 사실 SQLite 의 모든 테이블에는 숨은 번호 <code>rowid</code> 가 있어서 <code>SELECT rowid, * FROM 테이블</code> 로 볼 수 있습니다.</p>' },

          { type: 'h', text: '테이블 구조 확인 · 변경 — PRAGMA, ALTER, DROP' },
          { type: 'p', html: '<code>.schema</code> 는 만든 SQL 문을 그대로 보여 주지만, <b>열을 하나씩 다루고 싶을 때</b>는 <code>PRAGMA table_info(테이블)</code> 가 편합니다. 열 번호 · 이름 · 형식 · NOT NULL 여부 · 기본값 · 기본키 여부를 행으로 돌려줍니다.' },
          { type: 'code', title: '추가 예제. PRAGMA 로 구조 보기 · ALTER 로 열 추가', code: X2_PRAGMA,
            expect: 'PRAGMA table_info(userTable)\n  0번 열 id         TEXT     기본키\n  1번 열 userName   TEXT     NOT NULL\n  2번 열 birthYear  INTEGER\n열 추가 후 : [\'id\', \'userName\', \'birthYear\', \'city\']',
            desc: '<code>ALTER TABLE 테이블 ADD COLUMN 열 형식</code> 으로 <b>나중에 열을 추가</b>할 수 있습니다. 기존 행에는 기본값(여기서는 \'서울\')이 채워집니다. 반대로 열을 지우거나 형식을 바꾸는 일은 SQLite 에서 제한이 많아, 보통 <b>새 테이블을 만들어 옮깁니다</b>.' },
          { type: 'callout', kind: 'warn', title: 'DROP TABLE 과 DELETE 는 다릅니다', html: '<ul><li><code>DROP TABLE 테이블;</code> — 테이블 <b>자체</b>를 없앱니다(구조 + 데이터 모두). 되돌릴 수 없습니다.</li><li><code>DELETE FROM 테이블;</code> — 구조는 남기고 <b>행만</b> 모두 지웁니다.</li></ul><p>이 강좌의 예제가 <code>DROP TABLE IF EXISTS</code> 로 시작하는 것은 “몇 번을 실행해도 같은 결과” 를 만들기 위해서입니다. <b>실제 데이터가 든 DB 에서는 절대 습관적으로 쓰지 마세요.</b></p>' },

          { type: 'h', text: '스키마 설계 맛보기 — 두 테이블과 외래키' },
          { type: 'p', html: '테이블들의 구조 전체를 <b>스키마(schema)</b> 라고 합니다. 도서관 프로그램이라면 “책 테이블 + 대출 테이블” 처럼 나누고, 대출 테이블에는 <b>책 번호만</b> 적습니다. 이때 “없는 책 번호는 적을 수 없다” 는 약속이 <b>외래키(FOREIGN KEY)</b> 입니다.' },
          { type: 'code', title: '추가 예제. 외래키로 두 테이블 연결하기', code: X2_FOREIGN,
            expect: "없는 책을 대출하면 : FOREIGN KEY constraint failed\n대출 기록 : [(1, 'b001', '철수')]",
            desc: 'SQLite 는 호환성 때문에 외래키 검사가 <b>기본으로 꺼져</b> 있어 <code>PRAGMA foreign_keys = ON</code> 을 먼저 실행해야 합니다. 이 한 줄 덕분에 <b>존재하지 않는 책의 대출 기록</b> 같은 엉터리 데이터가 들어가지 못합니다.' },
          { type: 'callout', kind: 'more', title: '📘 스키마를 설계하는 순서', html: '<ol><li><b>무엇을 저장할지</b> 적어 본다 — 회원, 책, 대출, 주문 …</li><li>하나의 “덩어리” 마다 테이블을 하나씩 만든다 (회원 표, 책 표).</li><li>각 테이블에서 <b>행을 구분할 열</b>을 정해 기본키로 삼는다.</li><li>“누가 무엇을 빌렸다” 처럼 <b>관계</b>를 나타내는 표를 따로 만들고, 양쪽 기본키를 외래키로 넣는다.</li><li>반복되는 값이 보이면 테이블을 더 나눈다(<b>정규화</b>, 6교시 보충).</li></ol><p>처음부터 완벽할 필요는 없습니다. 작게 만들고 필요할 때 <code>ALTER TABLE</code> 로 넓혀 가세요.</p>' }
        ],
        practice: [
          { title: '실습 13-2-1. 책 테이블 구축하기', level: 1,
            desc: '<p>naverDB 에 <code>bookTable</code>(책 코드 <code>bookId char(5)</code>, 제목 <code>title char(20)</code>, 가격 <code>price int</code>)을 만들고 책 3권을 입력하세요. 그런 다음 <code>.schema bookTable</code> 처럼 테이블을 만든 SQL 문과 입력된 행 개수를 출력하세요.</p>',
            hint: '<code>sqlite_master</code> 테이블의 <code>sql</code> 열에 CREATE 문이 저장되어 있습니다. 행 개수는 <code>SELECT COUNT(*)</code> 후 <code>fetchone()[0]</code>.',
            starter: PR_BOOK_S, solution: PR_BOOK,
            expect: 'CREATE TABLE bookTable (bookId char(5), title char(20), price int);\n입력된 책 : 3 권' },
          { title: '실습 13-2-2. 제약 조건이 있는 학생 테이블', level: 1,
            desc: '<p><code>schoolDB</code> 에 <code>studentTable</code> 을 다음 규칙대로 만드세요.</p><ul><li><code>sid</code> TEXT — <b>기본키</b></li><li><code>name</code> TEXT — <b>반드시 입력</b>(NOT NULL)</li><li><code>email</code> TEXT — <b>중복 불가</b>(UNIQUE)</li><li><code>grade</code> INTEGER — 적지 않으면 <b>기본값 1</b></li><li><code>score</code> INTEGER — <b>0 ~ 100</b> 만 허용(CHECK)</li></ul><p>학생 2명을 넣되 한 명은 email · grade 를 적지 마세요. 그런 다음 전체 조회 결과와 <code>sqlite_master</code> 의 CREATE 문을 출력합니다.</p>',
            hint: '값을 일부만 넣을 때는 <code>INSERT INTO studentTable (sid, name, score) VALUES(…)</code> 처럼 열 이름을 적습니다. 적지 않은 열에는 기본값 또는 NULL(파이썬의 <code>None</code>)이 들어갑니다.',
            starter: PR_STU_S, solution: PR_STU,
            expect: "('2401', '김철수', 'kim@school.kr', 2, 88)\n('2402', '이영희', None, 1, 95)\nCREATE TABLE studentTable (\n    sid   TEXT    PRIMARY KEY,\n    name  TEXT    NOT NULL,\n    email TEXT    UNIQUE,\n    grade INTEGER DEFAULT 1,\n    score INTEGER CHECK (score >= 0 AND score <= 100))" },
          { title: '실습 13-2-3. 제약을 어긴 입력 잡아내기', level: 2,
            desc: '<p>뼈대에는 학생 한 명(2401)이 이미 들어 있고, 규칙을 어기는 데이터 3건이 <code>bad</code> 리스트에 있습니다.</p><ul><li>학번 중복 <code>(\'2401\', …)</code></li><li>이름이 <code>None</code> <code>(\'2402\', None, 70)</code></li><li>점수 120점 <code>(\'2403\', \'박민수\', 120)</code></li></ul><p>각 행을 <code>try ~ except sqlite3.IntegrityError</code> 로 입력해 성공/실패를 출력하고, 마지막에 저장된 학생 수를 출력하세요.</p>',
            hint: '<code>except sqlite3.IntegrityError as e :</code> 안에서 <code>print(values[0], "입력 실패 :", e)</code> 처럼 오류 객체를 그대로 출력하면 어떤 제약이 깨졌는지 보입니다.',
            starter: PR_VIO_S, solution: PR_VIO,
            expect: '2401 입력 실패 : UNIQUE constraint failed: studentTable.sid\n2402 입력 실패 : NOT NULL constraint failed: studentTable.name\n2403 입력 실패 : CHECK constraint failed: score BETWEEN 0 AND 100\n저장된 학생 수 : 1' },
          { title: '실습 13-2-4. 테이블 구조 보기와 열 추가', level: 2,
            desc: '<p><code>clubTable</code>(<code>cid</code> 기본키, <code>cname</code> NOT NULL)의 구조를 <code>PRAGMA table_info()</code> 로 출력한 뒤, <code>ALTER TABLE</code> 로 <code>room</code> 열(기본값 <code>\'미정\'</code>)을 추가하세요. 동아리 2개를 넣되 하나는 <code>room</code> 을 적지 말고, 바뀐 열 목록과 전체 행을 출력합니다.</p>',
            hint: '<code>for cid, name, ctype, notnull, default, pk in cur.execute("PRAGMA table_info(clubTable)") :</code> 처럼 여섯 값으로 풀어 받을 수 있습니다.',
            starter: PR_PRAG_S, solution: PR_PRAG,
            expect: "[처음 구조]\n  cid TEXT  PK\n  cname TEXT NOT NULL\n[열 추가 후] ['cid', 'cname', 'room']\n  ('c01', '코딩 동아리', '301호')\n  ('c02', '사진 동아리', '미정')" },
          { title: '🚀 프로젝트 13-2. 도서 대출 데이터베이스 설계', level: 3,
            desc: '<p>도서관 프로그램의 <b>스키마</b>를 직접 설계해 <code>libraryDB</code> 에 만드세요.</p><p><b>요구 사항</b></p><ol><li><code>bookTable</code> — <code>bookId</code>(기본키), <code>title</code>(NOT NULL), <code>writer</code>(NOT NULL), <code>price</code>(0 이상)</li><li><code>memberTable</code> — <code>memberId</code>(기본키), <code>name</code>(NOT NULL), <code>phone</code>(UNIQUE)</li><li><code>loanTable</code> — <code>loanId</code>(자동 번호 기본키), <code>bookId</code>, <code>memberId</code>, <code>day</code>, <code>back</code>(<code>\'Y\'</code>/<code>\'N\'</code>만, 기본값 <code>\'N\'</code>) + <b>외래키 2개</b></li><li>책 3권 · 회원 2명 · 대출 3건을 넣고 각 테이블의 행 수를 출력합니다.</li><li>없는 책(<code>b99</code>)을 대출해 보고 <code>IntegrityError</code> 를 잡아 메시지를 출력합니다.</li><li><code>b01</code> 을 반납 처리(<code>back = \'Y\'</code>)하고 <code>cur.rowcount</code> 와 대출 목록을 출력합니다.</li></ol><p><b>여기까지 했다면 이렇게 더 해 보세요</b></p><ul><li>같은 책을 두 사람이 동시에 빌릴 수 없게 하려면 어떤 제약이 필요할까요?</li><li>대출 기간(2주)을 넘긴 책을 찾으려면 어떤 열이 더 있어야 할까요?</li><li>5교시의 <code>JOIN</code> 을 배우면 “누가 어떤 책을 빌렸는지” 를 한 문장으로 볼 수 있습니다 (🚀 프로젝트 13-5 에서 이어서 만듭니다).</li></ul>',
            hint: '외래키를 검사하려면 맨 앞에서 <code>PRAGMA foreign_keys = ON</code> 을 실행합니다. 테이블을 지울 때는 <b>참조하는 쪽(loanTable)을 먼저</b> 지워야 합니다. 여러 건은 <code>executemany</code> 로 한 번에 넣으면 편합니다(4교시).',
            starter: PJ_LIB_S, solution: PJ_LIB,
            expect: "bookTable : 3 행\nmemberTable : 2 행\nloanTable : 3 행\n없는 책 대출 : FOREIGN KEY constraint failed\n반납 처리된 행 수 : 1\n(1, 'b01', 'm01', '03-02', 'Y')\n(2, 'b02', 'm01', '03-05', 'N')\n(3, 'b03', 'm02', '03-07', 'N')" }
        ],
        quiz: [
          { q: 'SQLite 명령행 도구에서 <code>naverDB</code> 라는 데이터베이스 파일을 열거나 새로 만드는 명령은?',
            options: ['.open naverDB', '.table naverDB', 'CREATE DATABASE naverDB;', '.schema naverDB'], answer: 0,
            explain: '<code>.open 데이터베이스이름</code> 은 파일이 있으면 열고, 없으면 새로 만듭니다. 파이썬의 <code>sqlite3.connect("naverDB")</code> 와 같습니다.' },
          { q: '테이블의 열 이름과 데이터 형식 등 구조 정보를 보여 주는 SQLite 명령은?',
            options: ['.table', '.schema 테이블이름', '.header on', '.mode column'], answer: 1,
            explain: '<code>.schema</code> 는 테이블을 만든 CREATE 문을 보여 줍니다. <code>.table</code> 은 테이블 이름 목록만 보여 줍니다.' },
          { q: '다음 INSERT 문 중 올바른 것은? (userTable: id char(4), userName char(15), email char(15), birthYear int)',
            options: ["INSERT INTO userTable VALUES(john, John Bann, john@naver.com, 1990);", "INSERT INTO userTable VALUES('john', 'John Bann', 'john@naver.com', 1990);", "INSERT userTable INTO VALUES('john', 'John Bann', 'john@naver.com', 1990);", "INSERT INTO userTable VALUES('john', 'John Bann', 1990);"], answer: 1,
            explain: '문자열 값은 작은따옴표로 감싸고, 값 4개를 열 순서대로 적어야 합니다. 1번은 따옴표가 없고, 3번은 순서가 틀렸고, 4번은 값이 3개뿐입니다.' },
          { q: '다음 코드를 두 번째 실행하면(같은 작업 폴더) 어떻게 되나요?<pre><code>cur.execute("CREATE TABLE IF NOT EXISTS t (a int)")</code></pre>',
            options: ['table t already exists 오류', '테이블이 하나 더 생긴다', '이미 있으므로 아무 일 없이 넘어간다', '기존 테이블이 지워지고 새로 만들어진다'], answer: 2,
            explain: '<code>IF NOT EXISTS</code> 는 테이블이 없을 때만 만듭니다. 지우고 새로 만들려면 <code>DROP TABLE IF EXISTS</code> 를 먼저 실행합니다.' },
          { q: '다음 테이블에 <code>INSERT INTO t VALUES(\'a01\', NULL, 50)</code> 을 실행하면?<pre><code>CREATE TABLE t (id TEXT PRIMARY KEY, name TEXT NOT NULL, point INTEGER CHECK (point &gt;= 0))</code></pre>',
            options: ['정상 입력된다', 'name 이 NULL 이라 sqlite3.IntegrityError 가 난다', 'point 가 50 이라 오류가 난다', 'name 에 빈 문자열이 들어간다'], answer: 1,
            explain: '<code>NOT NULL</code> 제약이 있는 열에는 값을 반드시 넣어야 합니다. 오류 메시지는 <code>NOT NULL constraint failed: t.name</code> 입니다.' },
          { q: '테이블의 <b>열 목록과 형식</b>을 행 단위로 얻고 싶을 때 쓰는 것은?',
            options: ['<code>PRAGMA table_info(테이블)</code>', '<code>DESCRIBE 테이블</code>', '<code>SELECT * FROM 테이블</code>', '<code>ALTER TABLE 테이블</code>'], answer: 0,
            explain: 'SQLite 에서는 <code>PRAGMA table_info()</code> 가 (번호, 이름, 형식, NOT NULL, 기본값, 기본키) 를 행으로 돌려줍니다. <code>DESCRIBE</code> 는 MySQL 의 명령입니다.' }
        ],
        slides: [
          { layout: 'title', title: 'SQLite 로 데이터베이스 구축하기', subtitle: 'Chapter 13 · Section 03 — 데이터베이스의 구축 (1)', badge: '13-2',
            notes: '<p>오늘은 [프로그램 1]을 만들기 위해 SQLite 에 데이터베이스와 테이블을 만들고 데이터를 넣는다고 소개합니다. (1분)</p>' },
          { layout: 'diagram', title: '그림 13-2 데이터베이스 구축 및 운영 과정', html: F_STEPS,
            notes: '<p>1단계 설치 → 2단계 구축(❶~❹) → 3단계 활용. 오늘은 ❶~❸, 다음 시간 ❹, 그 다음부터 3단계(파이썬 프로그램)라고 로드맵을 보여 줍니다.</p><p>시간: 3분</p>' },
          { layout: 'bullets', title: '1단계 · 2단계: 설치와 접속', lead: 'sqlite3.exe 하나면 끝',
            bullets: ['sqlite.org/download.html → <b>sqlite-tools-win…zip</b>', '<code>C:\\sqlite</code> 에 압축 풀기 → <code>sqlite3.exe</code> 실행', '<code>sqlite&gt;</code> 프롬프트에 명령 입력', '처음엔 <b>메모리 DB</b> (창 닫으면 사라짐) → <code>.open</code> 필요', '웹 강좌: 파이썬 <code>sqlite3</code> 모듈에 내장 → 설치 불필요'],
            notes: '<p>교실 PC 에 sqlite3.exe 가 있다면 직접 시연하고, 없다면 본문의 화면 그림으로 설명합니다. 학생들은 파이썬 코드로 같은 결과를 확인합니다. 처음 뜨는 “transient in-memory database” 는 “창을 닫으면 사라지는 임시 DB” 라는 뜻입니다.</p><p>시간: 4분</p>' },
          { layout: 'table', title: 'Tip. 자주 사용하는 SQLite 명령어', head: ['명령어', '하는 일'], lead: '점(.)으로 시작하면 도구 명령 — 세미콜론 없이',
            rows: [['.open 이름', 'DB 파일 열기 · 만들기'], ['.table', '테이블 목록'], ['.schema 테이블', '테이블 구조(CREATE 문)'], ['.header on', 'SELECT 결과에 헤더 표시'], ['.mode column', '컬럼 모드로 정렬 출력'], ['.quit', '종료']],
            notes: '<p>점(.) 명령은 도구 전용이라 <b>세미콜론 없이</b>, SQL 문은 <b>세미콜론 필수</b>라는 차이를 강조합니다. SELECT 전에 .header on, .mode column 을 켜 두면 보기 좋다고 덧붙입니다.</p><p>시간: 3분</p>' },
          { layout: 'diagram', title: '❶ DB 생성 · ❷ 테이블 생성 — CREATE TABLE', html: T_CREATE, caption: '.open naverDB ↔ sqlite3.connect("naverDB") / CREATE TABLE 이름(열 데이터형식, …);',
            notes: '<p>먼저 <code>.open naverDB</code> = <code>sqlite3.connect("naverDB")</code> 임을 한 줄로 짚고(강의자료의 C:/CookPython 경로 대신 작업 폴더 사용), CREATE TABLE 형식을 id char(4) → “아이디 열, 문자 4글자” 처럼 한 열씩 읽어 줍니다. .table 과 .schema 결과도 설명합니다.</p><p>시간: 5분</p>' },
          { layout: 'code', title: '파이썬으로 ❷ CREATE · .table · .schema', code: C_CREATE,
            points: ['<code>DROP TABLE IF EXISTS</code> : 반복 실행 대비', '<code>sqlite_master</code> : 테이블 정보가 모인 특별 테이블', '<code>.table</code> ↔ name 열, <code>.schema</code> ↔ sql 열'],
            notes: '<p>도구 명령(.table/.schema)은 파이썬에 없으니 sqlite_master 를 조회한다는 점만 이해하면 됩니다. DROP 줄을 지우고 두 번 실행하면 어떻게 될지 질문해 다음 슬라이드로 넘어갑니다.</p><p>시간: 5분</p>' },
          { layout: 'code', title: '같은 테이블을 또 만들면? — IF NOT EXISTS', code: C_CREATE_IF,
            points: ['두 번 만들면 <code>table … already exists</code> 오류', '<code>CREATE TABLE IF NOT EXISTS</code> → 있으면 넘어감', '<code>DROP TABLE IF EXISTS</code> → 지우고 새로 시작', '이 장의 예제들이 쓰는 방법'],
            notes: '<p>먼저 본문의 오류 예제를 실행해 <code>table userTable already exists</code> 를 보여 주고, 이 슬라이드의 IF NOT EXISTS 로 해결합니다. 두 가지(유지 vs 초기화)의 차이를 구분해 주세요.</p><p>시간: 4분</p>' },
          { layout: 'diagram', title: '❸ 데이터 입력 — INSERT', html: T_INSERT, caption: 'INSERT INTO 테이블이름 VALUES(값1, 값2, …);',
            notes: '<p>문자열은 작은따옴표, 숫자는 따옴표 없이. 값의 순서 = CREATE 할 때 열의 순서. 명령 프롬프트 창이 좁아 줄이 꺾여 보이는 것은 문제없다고 알려 줍니다.</p><p>시간: 3분</p>' },
          { layout: 'code', title: '파이썬으로 ❸ INSERT', code: C_INSERT,
            points: ['SQL 문을 <b>문자열</b>로 execute', '큰따옴표 문자열 안에 작은따옴표 값', '<code>con.commit()</code> 해야 파일에 저장', '<code>COUNT(*)</code> : 행 개수'],
            notes: '<p>명령행 도구는 자동 저장, 파이썬은 commit 필요 — 이 차이는 4교시에서 다시 다룹니다. 실행 결과 4가 나오는지 확인합니다.</p><p>시간: 5분</p>' },
          { layout: 'table', title: '제약 조건 — 잘못된 데이터를 막는 약속', lead: 'CREATE TABLE 에 한 단어씩 덧붙이면 된다', head: ['제약', '뜻'],
            rows: [['PRIMARY KEY', '행을 구분하는 기본키 (중복 · 빈값 불가)'], ['NOT NULL', '반드시 값이 있어야 함'], ['UNIQUE', '값이 서로 달라야 함'], ["DEFAULT '일반'", '안 넣으면 이 값으로'], ['CHECK (point >= 0)', '조건을 만족하는 값만'], ['FOREIGN KEY', '다른 표에 있는 값만 (관계)']],
            notes: '<p>강의자료 밖 보충이지만 실무에서는 기본입니다. “프로그램에서 if 로 검사” 와 “DB 가 막아 줌” 의 차이를 설명하세요 — 프로그램이 여러 개여도 DB 제약은 항상 지켜집니다.</p><p>시간: 4분</p>' },
          { layout: 'code', title: '제약을 어기면 IntegrityError', code: X2_VIOLATION,
            points: ['기본키 중복 · NOT NULL · UNIQUE · CHECK', '<code>sqlite3.IntegrityError</code> 로 잡힌다', '오류 메시지에 깨진 제약이 적혀 있음', '거부된 행은 저장되지 않음'],
            notes: '<p>네 가지 위반을 한 번에 보여 줍니다. 오류 메시지를 함께 소리 내어 읽고, “이미 있는 아이디입니다” 같은 안내로 바꿔 보여 주면 좋습니다.</p><p>시간: 5분</p>' },
          { layout: 'code', title: '외래키로 두 테이블 연결', code: X2_FOREIGN,
            points: ['<code>PRAGMA foreign_keys = ON</code> 먼저!', 'loanTable.bookId → bookTable.bookId', '없는 책은 대출 기록도 못 남김', '스키마 설계의 첫걸음'],
            notes: '<p>SQLite 는 외래키 검사가 기본으로 꺼져 있다는 점이 함정입니다. 이 예제를 PRAGMA 줄 없이 실행해 보면 엉터리 데이터가 들어가는 것을 볼 수 있습니다.</p><p>시간: 5분</p>' },
          { layout: 'quiz', title: '확인 문제', q: 'SQL 문 끝에 세미콜론을 빠뜨리고 Enter 를 치면 sqlite3.exe 는?',
            options: ['오류를 내고 종료한다', '...&gt; 프롬프트로 다음 줄을 기다린다', '자동으로 세미콜론을 붙여 실행한다', '입력을 무시한다'], answer: 1,
            explain: 'SQL 문은 세미콜론까지가 한 문장이라, 없으면 계속 입력을 기다립니다. <code>;</code> 만 입력하고 Enter 를 치면 실행됩니다.',
            notes: '<p>실제로 자주 겪는 상황이라 꼭 짚어 줍니다. (1분)</p>' },
          { layout: 'practice', title: '실습 13-2-1. 책 테이블 구축하기', desc: '<p>bookTable(bookId, title, price)을 만들고 3권 입력 → CREATE 문과 행 개수 출력</p>', starter: PR_BOOK_S, solution: PR_BOOK,
            notes: '<p>CREATE · INSERT 를 스스로 써 보는 과제입니다. .schema 흉내는 예제 코드를 참고하게 합니다.</p><p>시간: 7분</p>' },
          { layout: 'practice', title: '🚀 프로젝트 13-2. 도서 대출 DB 설계', desc: '<p>bookTable · memberTable · loanTable 을 제약 조건과 외래키까지 갖춰 만들고, 행 수 · 위반 오류 · 반납 처리를 확인하세요.</p>', starter: PJ_LIB_S, solution: PJ_LIB,
            notes: '<p>이 교시의 종합 과제이자 5교시 프로젝트(대출 리포트)의 재료입니다. 테이블을 지우는 순서(참조하는 쪽 먼저)에서 막히는 학생이 많습니다.</p><p>시간: 12분 또는 과제</p>' },
          { layout: 'summary', title: '정리', bullets: ['구축 과정: 설치 → 구축(❶~❹) → 활용', '.open ↔ <code>sqlite3.connect()</code>', 'CREATE TABLE 이름(열 형식 [제약], …);', 'INSERT INTO 이름 VALUES(값, …);', '제약: PRIMARY KEY · NOT NULL · UNIQUE · CHECK · FOREIGN KEY'],
            notes: '<p>다음 시간: ❹ SELECT 로 조회하고 [프로그램 1]을 완성합니다. (1분)</p>' }
        ]
      },

      /* ============================================================ 13-3 */
      {
        id: 'ch13-3',
        title: '데이터 조회와 [프로그램 1] 완성',
        minutes: 50,
        goals: [
          'SELECT 문으로 테이블의 모든 행 또는 원하는 열을 조회할 수 있다',
          '.header on · .mode column 의 역할을 설명할 수 있다',
          'WHERE 조건과 ORDER BY 정렬을 사용해 조회할 수 있다',
          '[프로그램 1]의 결과를 파이썬 코드로 똑같이 만들 수 있다'
        ],
        flow: [['복습 · 도입', 3], ['SELECT · 출력 모드', 12], ['WHERE · ORDER BY', 15], ['SELF STUDY 13-1', 12], ['정리 · 퀴즈', 8]],
        content: [
          { type: 'h', text: '❹ 데이터 조회 및 활용 — SELECT' },
          { type: 'p', html: '저장한 데이터를 꺼내 보는 SQL 문이 <b>SELECT</b> 입니다. 가장 기본 형식은 “테이블의 모든 것을 보여 줘” 입니다. <code>*</code> 는 “모든 열” 이라는 뜻입니다.' },
          { type: 'code', run: false, title: 'SELECT 문의 기본 형식', code: 'SELECT * FROM 테이블이름;' },
          { type: 'p', html: '명령행 도구는 기본적으로 <code>john|John Bann|john@naver.com|1990</code> 처럼 값을 <code>|</code> 로 이어 붙여 출력합니다(<b>list 모드</b>). SELECT 전에 <code>.header on</code>(열 이름 보이기)과 <code>.mode column</code>(열 맞춰 출력)을 설정하면 표처럼 보기 좋게 나옵니다. 이것이 [프로그램 1]의 완성 화면입니다.' },
          { type: 'figure', html: T_SELECT, caption: '[프로그램 1]의 완성 — .header on, .mode column 설정 후 SELECT' },
          { type: 'table', head: ['설정', '출력 모양'], rows: [
            ['기본 (list 모드, 헤더 없음)', '<code>john|John Bann|john@naver.com|1990</code>'],
            ['<code>.header on</code> 만', '첫 줄에 <code>id|userName|email|birthYear</code> 가 추가됨'],
            ['<code>.header on</code> + <code>.mode column</code>', '열 이름 · 구분선(<code>----</code>) · 열을 맞춘 표 모양']
          ] },
          { type: 'p', html: '파이썬에서는 <code>cur.execute("SELECT * FROM userTable")</code> 로 조회한 뒤 결과 행을 꺼내 직접 출력합니다. 아래 코드의 <code>show()</code> 함수는 <code>.header on</code> + <code>.mode column</code> 처럼 열 너비를 계산해 표 모양으로 출력하는 도우미입니다. 함수 내용을 다 이해하지 않아도 괜찮습니다 — “조회 결과를 표로 보여 주는 함수” 라고만 알고 써도 됩니다.' },
          { type: 'code', title: '[프로그램 1] 완성 — 파이썬으로 같은 결과 만들기', code: C_PROG1, expect: 'id    userName   email           birthYear\n----  ---------  --------------  ---------\njohn  John Bann  john@naver.com  1990\nkim   Kim Chi    kim@daum.net    1992\nlee   Lee Pal    lee@paran.com   1988\npark  Park Su    park@gmail.com  1980',
            desc: '<code>cur.description</code> 에서 열 이름을, <code>cur.fetchall()</code> 에서 모든 행을 얻어 가장 긴 값에 맞춰 칸을 채웁니다. 한글은 화면에서 2칸을 차지하므로 <code>unicodedata.east_asian_width()</code> 로 너비를 계산합니다. 출력이 sqlite3.exe 의 컬럼 모드 화면과 같은지 비교해 보세요.' },
          { type: 'code', title: '추가 예제. 간단한 버전 — f-string 으로 열 맞추기', code: C_PROG1_SHORT,
 expect: 'id    userName   email           birthYear\n----  ---------  --------------  ---------\njohn  John Bann  john@naver.com  1990\nkim   Kim Chi    kim@daum.net    1992\nlee   Lee Pal    lee@paran.com   1988\npark  Park Su    park@gmail.com  1980',            desc: '열이 정해져 있다면 <code>f"{값:&lt;6}"</code> 처럼 왼쪽 정렬 폭을 직접 정해도 됩니다. <code>&lt;6</code> 은 “6칸에 왼쪽 정렬” 입니다.' },

          { type: 'h', text: 'WHERE — 조건에 맞는 행만 조회' },
          { type: 'p', html: '필요한 <b>열만</b> 고르려면 <code>*</code> 대신 열 이름을 쓰고, 필요한 <b>행만</b> 고르려면 <code>WHERE 조건</code> 을 붙입니다. 결과를 정렬하려면 <code>ORDER BY 열이름</code> 을 씁니다.' },
          { type: 'code', run: false, title: 'SELECT … WHERE 문의 형식', code: 'SELECT 열이름1, 열이름2, … FROM 테이블이름 WHERE 조건;' },
          { type: 'figure', html: T_WHERE, caption: '❶ 1990년 이전 출생자의 id · 출생연도 ❷ id 가 park 인 행 ❸ 출생연도 순 정렬 ❹ 종료' },
          { type: 'list', items: [
            '❶ <code>SELECT id, birthYear FROM userTable WHERE birthYear &lt;= 1990;</code> — 출생연도가 1990 이하인 행의 id, birthYear 열만',
            "❷ <code>SELECT * FROM userTable WHERE id = 'park';</code> — id 가 park 인 행의 모든 열 (SQL 에서 “같다” 는 <code>=</code> 하나!)",
            '❸ <code>SELECT * FROM userTable ORDER BY birthYear;</code> — 출생연도 오름차순(작은 값부터) 정렬',
            '❹ <code>.quit</code> — SQLite 종료'
          ] },
          { type: 'code', title: '같은 일을 파이썬으로 ❶~❹ (기본 list 모드 흉내)', code: C_LISTMODE,
 expect: 'sqlite> SELECT id, birthYear FROM userTable WHERE birthYear <= 1990;\njohn|1990\nlee|1988\npark|1980\nsqlite> SELECT * FROM userTable WHERE id = \'park\';\npark|Park Su|park@gmail.com|1980\nsqlite> SELECT * FROM userTable ORDER BY birthYear;\npark|Park Su|park@gmail.com|1980\nlee|Lee Pal|lee@paran.com|1988\njohn|John Bann|john@naver.com|1990\nkim|Kim Chi|kim@daum.net|1992',            desc: '<code>query()</code> 함수는 SQL 문을 받아 <code>sqlite&gt;</code> 화면처럼 보여 주고, 각 행의 값을 <code>"|".join()</code> 으로 이어 출력합니다. 숫자(1990)는 <code>str()</code> 로 바꿔야 join 할 수 있습니다. ❹ .quit 대신 파이썬은 <code>con.close()</code> 로 연결을 닫습니다.' },
          { type: 'table', head: ['SQL', '뜻', '예'], rows: [
            ['<code>=</code>, <code>&lt;&gt;</code>', '같다, 다르다 (파이썬의 <code>==</code>, <code>!=</code>)', "<code>id = 'kim'</code>"],
            ['<code>&lt; &lt;= &gt; &gt;=</code>', '크기 비교', '<code>birthYear &gt;= 1990</code>'],
            ['<code>AND</code>, <code>OR</code>, <code>NOT</code>', '그리고, 또는, 아니다', '<code>birthYear &gt; 1985 AND birthYear &lt; 1991</code>'],
            ['<code>LIKE</code>', '패턴 비교 (<code>%</code> = 아무 글자 여러 개)', "<code>email LIKE '%naver%'</code>"],
            ['<code>ORDER BY 열 [DESC]</code>', '정렬 (DESC 는 내림차순)', '<code>ORDER BY birthYear DESC</code>'],
            ['<code>COUNT(*)</code>, <code>MIN()</code>, <code>MAX()</code>, <code>AVG()</code>, <code>SUM()</code>', '개수 · 최솟값 · 최댓값 · 평균 · 합계', '<code>SELECT COUNT(*) FROM userTable</code>']
          ], caption: '📘 WHERE · ORDER BY 에 자주 쓰는 SQL 표현 (보충)' },
          { type: 'code', title: '추가 예제. 여러 조건 · 내림차순 · 집계 함수', code: C_WHERE_MORE, expect: '① 1985년 이후에 태어나고 naver 메일을 쓰는 회원\n[(\'john\', \'john@naver.com\')]\n② 출생연도가 늦은(젊은) 순서로 id 와 출생연도\n[(\'kim\', 1992), (\'john\', 1990), (\'lee\', 1988), (\'park\', 1980)]\n③ 회원 수와 가장 빠른 출생연도\n(4, 1980)',
            desc: '<code>fetchall()</code> 의 결과를 그대로 print 하면 튜플의 리스트가 보입니다. <code>COUNT(*)</code> 와 <code>MIN()</code> 처럼 여러 행을 하나로 계산하는 함수를 <b>집계 함수</b>라고 합니다.' },
          { type: 'callout', kind: 'more', title: '📘 데이터 수정(UPDATE)과 삭제(DELETE)', html: '<p>강의자료에서는 입력과 조회만 다루지만, 실제 DB 에서는 수정과 삭제도 자주 씁니다. 네 가지를 묶어 <b>CRUD</b>(Create · Read · Update · Delete)라고 부릅니다.</p><ul><li><code>UPDATE 테이블 SET 열 = 값 WHERE 조건;</code> — 조건에 맞는 행의 값을 바꿈</li><li><code>DELETE FROM 테이블 WHERE 조건;</code> — 조건에 맞는 행을 지움</li></ul><p>⚠ <b>WHERE 를 빠뜨리면 모든 행</b>이 수정 · 삭제되니 조심하세요!</p>' },
          { type: 'code', title: '추가 예제. UPDATE 와 DELETE', code: C_UPDATE, expect: '(\'john\', \'John Bann\', \'john@naver.com\', 1990)\n(\'kim\', \'Kim Chi\', \'kim@gmail.com\', 1992)\n(\'park\', \'Park Su\', \'park@gmail.com\', 1980)',
            desc: 'kim 의 이메일이 바뀌고 lee 의 행이 사라졌습니다. 수정 · 삭제도 입력과 마찬가지로 <code>commit()</code> 해야 파일에 반영됩니다.' },
          { type: 'callout', kind: 'tip', title: '명령행 도구 ↔ 파이썬 한눈에 보기', html: '<table><tr><th>sqlite3.exe</th><th>파이썬 sqlite3</th></tr><tr><td><code>.open naverDB</code></td><td><code>con = sqlite3.connect("naverDB")</code></td></tr><tr><td><code>SQL 문;</code> 입력</td><td><code>cur.execute("SQL 문")</code> (세미콜론 생략 가능)</td></tr><tr><td>자동 저장</td><td><code>con.commit()</code></td></tr><tr><td>결과가 화면에 출력</td><td><code>cur.fetchone()</code> / <code>cur.fetchall()</code> 로 꺼내 print</td></tr><tr><td><code>.quit</code></td><td><code>con.close()</code></td></tr></table>' },

          { type: 'h', text: '한 걸음 더 — WHERE 조건 제대로 쓰기' },
          { type: 'p', html: 'SQL 에서 가장 많이 쓰는 것이 <code>WHERE</code> 입니다. 아래 예제들은 도시 · 출생연도 · 포인트가 있는 회원 표로 연습합니다. <code>q()</code> 는 “SQL 문과 결과를 함께 보여 주는” 도우미 함수입니다.' },
          { type: 'code', title: '추가 예제. 비교 · AND · OR · NOT', code: X3_WHERE,
            expect: "SQL> SELECT id, city FROM memberTable WHERE city = '서울'\n     ('john', '서울')\n     ('lee', '서울')\n     ('woo', '서울')\nSQL> SELECT id, point FROM memberTable WHERE point >= 100 AND city = '서울'\n     ('john', 120)\n     ('lee', 300)\nSQL> SELECT id, city FROM memberTable WHERE city = '부산' OR city = '대전'\n     ('kim', '부산')\n     ('park', '대전')\n     ('su', '부산')\nSQL> SELECT id, point FROM memberTable WHERE NOT point > 0\n     ('woo', 0)\nSQL> SELECT id, birthYear FROM memberTable WHERE birthYear <> 1990 AND birthYear < 1990\n     ('lee', 1988)\n     ('park', 1980)",
            desc: '파이썬과 달리 <b>같다는 <code>=</code> 하나</b>, <b>다르다는 <code>&lt;&gt;</code></b> 입니다(<code>!=</code> 도 대부분 통합니다). <code>AND</code> 가 <code>OR</code> 보다 먼저 계산되므로, 섞어 쓸 때는 <code>(A OR B) AND C</code> 처럼 <b>괄호</b>로 뜻을 분명히 하세요.' },
          { type: 'table', head: ['조건', '뜻', '예'], rows: [
            ['<code>IN (값, 값, …)</code>', '여러 값 중 하나와 같다', "<code>city IN ('서울', '대전')</code>"],
            ['<code>BETWEEN a AND b</code>', 'a 이상 b 이하 (양 끝 포함)', '<code>birthYear BETWEEN 1988 AND 1992</code>'],
            ['<code>LIKE \'K%\'</code>', 'K 로 시작 (<code>%</code> = 글자 0개 이상)', "<code>userName LIKE 'K%'</code>"],
            ['<code>LIKE \'%a%\'</code>', 'a 가 들어 있는', "<code>userName LIKE '%a%'</code>"],
            ['<code>LIKE \'____\'</code>', '정확히 4글자 (<code>_</code> = 아무 글자 1개)', "<code>id LIKE '____'</code>"],
            ['<code>IS NULL</code> / <code>IS NOT NULL</code>', '값이 없다 / 있다', '<code>city IS NULL</code>']
          ], caption: 'WHERE 에서 자주 쓰는 조건들' },
          { type: 'code', title: '추가 예제. IN · BETWEEN · LIKE', code: X3_INLIKE,
            expect: "SQL> SELECT id, city FROM memberTable WHERE city IN ('서울', '대전')\n     ('john', '서울')\n     ('lee', '서울')\n     ('park', '대전')\n     ('woo', '서울')\nSQL> SELECT id, birthYear FROM memberTable WHERE birthYear BETWEEN 1988 AND 1992\n     ('john', 1990)\n     ('kim', 1992)\n     ('lee', 1988)\nSQL> SELECT id, userName FROM memberTable WHERE userName LIKE 'K%'\n     ('kim', 'Kim Chi')\nSQL> SELECT id, userName FROM memberTable WHERE userName LIKE '%a%'\n     ('john', 'John Bann')\n     ('lee', 'Lee Pal')\n     ('park', 'Park Su')\n     ('woo', 'Woo Ja')\nSQL> SELECT id FROM memberTable WHERE id LIKE '____'\n     ('john',)\n     ('park',)",
            desc: "<code>city IN ('서울', '대전')</code> 은 <code>city = '서울' OR city = '대전'</code> 과 같은 뜻인데 훨씬 읽기 쉽습니다. <code>LIKE</code> 의 <code>%</code> 는 파이썬의 <code>in</code> 검색, <code>_</code> 는 글자 하나에 해당합니다. (SQLite 의 LIKE 는 영문 대소문자를 구별하지 않습니다.)" },
          { type: 'code', title: '추가 예제. NULL 은 = 로 비교할 수 없다', code: X3_NULL,
            expect: "city = NULL  : []\ncity IS NULL : [('kim',)]\ncity IS NOT NULL : [('john',)]\n파이썬으로 꺼내면 : ('kim', None)",
            desc: 'NULL 은 “값이 없음” 이라서 <code>= NULL</code> 로는 <b>절대 참이 되지 않습니다</b>(아무 결과도 안 나옴). 반드시 <code>IS NULL</code> · <code>IS NOT NULL</code> 을 쓰세요. 파이썬에서는 <code>None</code> 으로 꺼내지므로 <code>if row[1] is None :</code> 처럼 검사합니다.' },

          { type: 'h', text: '정렬 · 자르기 · 중복 제거 — ORDER BY · LIMIT · DISTINCT · AS' },
          { type: 'code', title: '추가 예제. 여러 열 정렬 · 상위 N개 · 중복 제거 · 별칭', code: X3_ORDER,
            expect: "SQL> SELECT city, userName FROM memberTable ORDER BY city, birthYear DESC\n     ('대전', 'Park Su')\n     ('부산', 'Su Ji')\n     ('부산', 'Kim Chi')\n     ('서울', 'Woo Ja')\n     ('서울', 'John Bann')\n     ('서울', 'Lee Pal')\nSQL> SELECT id, point FROM memberTable ORDER BY point DESC LIMIT 3\n     ('lee', 300)\n     ('su', 210)\n     ('john', 120)\nSQL> SELECT id, point FROM memberTable ORDER BY point DESC LIMIT 2 OFFSET 2\n     ('john', 120)\n     ('kim', 80)\nSQL> SELECT DISTINCT city FROM memberTable\n     ('서울',)\n     ('부산',)\n     ('대전',)\nSQL> SELECT userName AS 이름, 2026 - birthYear AS 나이 FROM memberTable WHERE city = '대전'\n     ('Park Su', 46)",
            desc: '<ul><li><code>ORDER BY city, birthYear DESC</code> — 먼저 도시로, 같은 도시 안에서는 출생연도 내림차순</li><li><code>LIMIT 3</code> — 앞에서 3개만 (“상위 3명” 은 <b>정렬 + LIMIT</b>)</li><li><code>LIMIT 2 OFFSET 2</code> — 3~4번째 (게시판 페이지 나누기에 사용)</li><li><code>DISTINCT</code> — 중복 제거, <code>AS</code> — 결과 열에 붙이는 <b>별칭</b>, <code>2026 - birthYear</code> 처럼 <b>계산한 값</b>도 열이 됩니다</li></ul>' },

          { type: 'h', text: '집계 함수와 GROUP BY — 여러 행을 하나로 요약하기' },
          { type: 'p', html: '<code>COUNT</code> · <code>SUM</code> · <code>AVG</code> · <code>MIN</code> · <code>MAX</code> 처럼 <b>여러 행을 하나의 값으로 계산</b>하는 함수를 <b>집계 함수(aggregate function)</b> 라고 합니다. 여기에 <code>GROUP BY 열</code> 을 붙이면 “도시별로”, “반별로” 처럼 <b>묶음마다</b> 계산합니다.' },
          { type: 'table', head: ['함수 · 절', '하는 일'], rows: [
            ['<code>COUNT(*)</code>', '행의 개수 (<code>COUNT(열)</code> 은 NULL 이 아닌 값의 개수)'],
            ['<code>SUM(열)</code>, <code>AVG(열)</code>', '합계, 평균 (<code>ROUND(AVG(열), 1)</code> 로 반올림)'],
            ['<code>MIN(열)</code>, <code>MAX(열)</code>', '최솟값, 최댓값'],
            ['<code>GROUP BY 열</code>', '같은 값끼리 묶어 묶음마다 계산'],
            ['<code>HAVING 조건</code>', '<b>묶은 결과</b>에 거는 조건 (COUNT · SUM 등을 조건으로)']
          ] },
          { type: 'code', title: '추가 예제. 집계 함수 · GROUP BY · HAVING', code: X3_GROUP,
            expect: "SQL> SELECT COUNT(*), SUM(point), ROUND(AVG(point), 1), MIN(point), MAX(point) FROM memberTable\n     (6, 760, 126.7, 0, 300)\nSQL> SELECT city, COUNT(*), SUM(point) FROM memberTable GROUP BY city\n     ('대전', 1, 50)\n     ('부산', 2, 290)\n     ('서울', 3, 420)\nSQL> SELECT city, COUNT(*) FROM memberTable GROUP BY city HAVING COUNT(*) >= 2\n     ('부산', 2)\n     ('서울', 3)\nSQL> SELECT city, ROUND(AVG(point), 1) FROM memberTable GROUP BY city ORDER BY AVG(point) DESC\n     ('부산', 145.0)\n     ('서울', 140.0)\n     ('대전', 50.0)\n한 값만 꺼내기 : 126.66666666666667",
            desc: '집계 결과도 <b>한 행</b>이므로 <code>cur.fetchone()[0]</code> 으로 값 하나만 꺼낼 수 있습니다. 평균은 소수점이 길게 나오므로 <code>ROUND(값, 1)</code> 로 다듬습니다. 파이썬에서 모든 행을 가져와 <code>sum()</code> 하는 것보다 <b>DB 에게 계산을 시키는 편이 훨씬 빠릅니다</b> — 필요한 값 하나만 오가기 때문입니다.' },
          { type: 'callout', kind: 'more', title: '📘 WHERE 와 HAVING 은 무엇이 다를까', html: '<p><code>WHERE</code> 는 <b>묶기 전, 행 하나하나</b>에 대한 조건이고 <code>HAVING</code> 은 <b>묶은 뒤, 묶음(그룹)</b>에 대한 조건입니다.</p><pre><code>SELECT city, COUNT(*) FROM memberTable\n WHERE birthYear &gt;= 1988      -- ① 먼저 행을 고르고\n GROUP BY city                 -- ② 도시별로 묶은 다음\nHAVING COUNT(*) &gt;= 2          -- ③ 2명 이상인 묶음만 남긴다</code></pre><p>그래서 <code>WHERE COUNT(*) &gt;= 2</code> 라고 쓰면 오류가 납니다. 아직 묶지 않아 COUNT 를 알 수 없기 때문입니다.</p>' },

          { type: 'h', text: 'UPDATE 와 DELETE 를 안전하게 쓰기' },
          { type: 'p', html: '수정과 삭제는 <b>되돌리기 어려운 작업</b>입니다. 다음 세 단계를 습관으로 만드세요. ① 같은 조건으로 <code>SELECT</code> 해서 <b>대상이 맞는지 눈으로 확인</b> → ② 같은 <code>WHERE</code> 로 <code>UPDATE</code>/<code>DELETE</code> → ③ <code>cur.rowcount</code> 로 <b>몇 행이 바뀌었는지 확인</b>하고 이상하면 <code>con.rollback()</code>.' },
          { type: 'code', title: '추가 예제. 확인 → 삭제 → 되돌리기', code: X3_SAFE,
            expect: "지울 대상 : [('woo', 0)]\n지워진 행 수 : 1\nrollback 후 행 수 : 6",
            desc: '<code>cur.rowcount</code> 는 방금 실행한 <code>UPDATE</code>/<code>DELETE</code> 가 <b>바꾼 행의 수</b>입니다. <code>con.rollback()</code> 은 <b>마지막 commit 이후의 변경을 모두 취소</b>합니다 — 이미 commit 했다면 되돌릴 수 없습니다.' },
          { type: 'code', title: '추가 예제. WHERE 를 빠뜨리면 전체가 바뀐다', code: X3_NOWHERE,
            expect: "바뀐 행 수 : 6\n도시 종류 : [('서울',)]\nrollback 후 : [('서울',), ('부산',), ('대전',)]",
            desc: '<code>WHERE</code> 없는 <code>UPDATE</code> 는 <b>모든 행</b>을 바꿉니다. 6명 전원의 도시가 서울이 되어 버렸습니다. 다행히 commit 전이라 <code>rollback()</code> 으로 살렸습니다. 실무에서는 이런 실수 한 번으로 서비스 전체 데이터가 망가지기도 합니다.' },
          { type: 'callout', kind: 'warn', title: '가장 무서운 두 문장', html: '<p><code>DELETE FROM 테이블;</code> (모든 행 삭제), <code>UPDATE 테이블 SET 열 = 값;</code> (모든 행 수정)</p><p>연습용 DB 가 아니라면 <b>WHERE 를 먼저 쓰고</b> 나중에 앞부분을 채우는 습관도 좋습니다. 중요한 작업 전에는 DB 파일을 복사해 두는 것이 가장 확실한 백업입니다(SQLite 는 파일 하나!).</p>' },

          { type: 'h', text: '📘 인덱스 — 찾기를 빠르게 만드는 색인' },
          { type: 'p', html: '테이블에 행이 많아지면 <code>WHERE</code> 검색이 느려집니다. 데이터베이스가 <b>처음부터 끝까지 한 행씩 읽으며 비교</b>하기 때문입니다(전체 스캔). <b>인덱스(index)</b> 는 책 뒤의 “찾아보기” 처럼 특정 열의 값을 미리 정렬해 둔 것으로, 검색을 극적으로 빠르게 만듭니다.' },
          { type: 'code', title: '추가 예제. 인덱스가 있을 때와 없을 때 (10만 행)', code: X3_INDEX, nondeterministic: true,
            desc: '<code>CREATE INDEX 이름 ON 테이블(열)</code> 한 줄로 만듭니다. 실행하면 보통 <b>수백 배</b> 차이가 납니다. <code>EXPLAIN QUERY PLAN</code> 은 DB 가 어떻게 찾을지 보여 주는데, 인덱스가 없으면 <code>SCAN</code>(전체 훑기), 있으면 <code>SEARCH … USING INDEX</code> 로 바뀝니다. (컴퓨터 속도에 따라 시간은 달라집니다.)' },
          { type: 'callout', kind: 'more', title: '📘 인덱스는 언제 만들까', html: '<ul><li><b>만들면 좋은 열</b>: <code>WHERE</code> · <code>JOIN</code> · <code>ORDER BY</code> 에 자주 쓰는 열, 행이 수천 건 이상인 테이블</li><li><b>공짜가 아닙니다</b>: 인덱스도 저장 공간을 쓰고, <code>INSERT</code>/<code>UPDATE</code> 할 때마다 같이 갱신되므로 <b>입력이 조금 느려집니다</b>. 모든 열에 인덱스를 거는 것은 나쁜 습관입니다.</li><li><b>이미 있는 인덱스</b>: <code>PRIMARY KEY</code> 와 <code>UNIQUE</code> 열에는 자동으로 인덱스가 만들어집니다.</li><li>행이 몇십 건인 학습용 표에서는 차이를 느낄 수 없습니다 — “데이터가 많아지면 이런 방법이 있다” 정도로 기억해 두세요.</li></ul>' }
        ],
        practice: [
          { title: 'SELF STUDY 13-1. 제품 테이블 구축하기', level: 2,
            desc: '<p>naverDB 에 다음 제품 테이블(<code>productTable</code>)을 구축하고 컬럼 모드로 출력해 보세요.</p><table><tr><th>제품코드(pCode)</th><th>제품명(pName)</th><th>가격(price)</th><th>재고수량(amount)</th></tr><tr><td>p0001</td><td>노트북</td><td>110</td><td>5</td></tr><tr><td>p0002</td><td>마우스</td><td>3</td><td>22</td></tr><tr><td>p0003</td><td>키보드</td><td>2</td><td>11</td></tr></table><p>(강의자료는 sqlite3.exe 에서 하는 과제입니다. 집에 설치했다면 같은 SQL 을 직접 입력해 보세요.)</p>',
            hint: '제품코드와 제품명은 <code>char</code> 형, 가격과 재고수량은 <code>int</code> 형으로 지정합니다. 출력은 뼈대에 들어 있는 <code>show(cur)</code> 를 씁니다.',
            starter: PR_SS1_S, solution: PR_SS1,
            expect: 'pCode  pName   price  amount\n-----  ------  -----  ------\np0001  노트북  110    5\np0002  마우스  3      22\np0003  키보드  2      11' },
          { title: '실습 13-3-2. IN · BETWEEN · LIKE 로 골라내기', level: 1,
            desc: '<p>뼈대에 들어 있는 <code>memberTable</code>(6명)에서 다음을 조회해 출력하세요.</p><ol><li><code>IN</code> — 서울 또는 부산에 사는 회원의 <code>id</code>, <code>city</code></li><li><code>BETWEEN</code> — 1988 ~ 1992년에 태어난 회원의 <code>id</code>, <code>birthYear</code></li><li><code>LIKE</code> — 이름에 <code>S</code> 가 들어가는 회원의 <code>id</code>, <code>userName</code></li></ol>',
            hint: "각각 <code>WHERE city IN ('서울', '부산')</code>, <code>WHERE birthYear BETWEEN 1988 AND 1992</code>, <code>WHERE userName LIKE '%S%'</code> 입니다.",
            starter: PR_W2_S, solution: PR_W2,
            expect: "① 서울 또는 부산에 사는 회원\n   ('john', '서울')\n   ('kim', '부산')\n   ('lee', '서울')\n   ('su', '부산')\n   ('woo', '서울')\n② 1988 ~ 1992년에 태어난 회원\n   ('john', 1990)\n   ('kim', 1992)\n   ('lee', 1988)\n③ 이름에 S 가 들어가는 회원\n   ('park', 'Park Su')\n   ('su', 'Su Ji')" },
          { title: '실습 13-3-3. 순위 매기기 (ORDER BY · LIMIT · DISTINCT)', level: 1,
            desc: '<p>같은 <code>memberTable</code> 에서 ① 포인트가 높은 <b>상위 3명</b>의 <code>id</code>, <code>point</code>, ② <b>가장 어린</b> 회원 한 명, ③ <b>도시 목록</b>(중복 없이 가나다순)을 출력하세요.</p>',
            hint: '상위 N개는 <code>ORDER BY … DESC LIMIT N</code>. 가장 어린 회원은 출생연도가 가장 <b>큰</b> 사람이므로 <code>ORDER BY birthYear DESC LIMIT 1</code> 후 <code>fetchone()</code>.',
            starter: PR_ORD_S, solution: PR_ORD,
            expect: "포인트 상위 3명\n   ('lee', 300)\n   ('su', 210)\n   ('john', 120)\n가장 어린 회원 : ('woo', 2002)\n도시 목록 : ['대전', '부산', '서울']" },
          { title: '실습 13-3-4. 조건 조회와 정렬', level: 2,
            desc: '<p>userTable 에서 ① 1990년 이후(1990 포함) 태어난 회원의 id 와 이름, ② 전체 회원을 출생연도 내림차순으로 <code>id|birthYear</code> 형식으로 출력하세요.</p>',
            hint: '<code>WHERE birthYear &gt;= 1990</code>, <code>ORDER BY birthYear DESC</code>',
            starter: PR_WHERE_S, solution: PR_WHERE,
            expect: '1990년 이후 출생\njohn John Bann\nkim Kim Chi\n출생연도 내림차순\nkim|1992\njohn|1990\nlee|1988\npark|1980' },
          { title: '실습 13-3-5. 도시별 통계 (GROUP BY · HAVING)', level: 2,
            desc: '<p><code>memberTable</code> 을 도시별로 묶어 다음을 출력하세요.</p><ol><li>도시별 <b>인원 수</b>와 <b>평균 포인트</b>(소수 첫째 자리) — <code>서울 : 3명, 평균 140.0점</code> 형식</li><li>회원이 <b>2명 이상</b>인 도시만 (도시, 인원)</li><li>전체 평균 포인트</li></ol>',
            hint: '<code>SELECT city, COUNT(*), ROUND(AVG(point), 1) FROM memberTable GROUP BY city</code> 로 세 값을 한 번에 받고, 묶음에 조건을 걸 때는 <code>HAVING COUNT(*) &gt;= 2</code> 를 씁니다.',
            starter: PR_GRP_S, solution: PR_GRP,
            expect: "도시별 인원과 평균 포인트\n  대전 : 1명, 평균 50.0점\n  부산 : 2명, 평균 145.0점\n  서울 : 3명, 평균 140.0점\n2명 이상인 도시\n   ('부산', 2)\n   ('서울', 3)\n전체 평균 : 126.7" },
          { title: '🚀 프로젝트 13-3. 성적 DB 통계 리포트', level: 3,
            desc: '<p>8명의 성적이 들어 있는 <code>scoreTable</code>(이름 · 반 · 국어 · 영어 · 수학)로 <b>통계 리포트</b>를 출력하는 프로그램을 만드세요. 데이터 입력까지는 뼈대에 들어 있습니다.</p><p><b>요구 사항 — SQL 로 계산할 것</b></p><ol><li><b>전체 요약</b> : 학생 수, 총점 평균(소수 첫째 자리), 최고 총점, 최저 총점<br><code>학생 8명 / 총점 평균 241.1 / 최고 285 / 최저 165</code></li><li><b>반별 평균</b> : 반마다 인원과 총점 평균을 <b>높은 순</b>으로</li><li><b>총점 상위 3명</b> : <code>1위 최지우(2반) 285점</code> 형식 (동점이면 이름순)</li><li><b>총점 평균 240점 이상인 반</b> (HAVING)</li><li><b>과목별 평균</b> : 국어 · 영어 · 수학</li></ol><p><b>여기까지 했다면 이렇게 더 해 보세요</b></p><ul><li>평균 미만인 학생만 뽑아 보기 (서브쿼리: <code>WHERE kor + eng + math &lt; (SELECT AVG(kor + eng + math) FROM scoreTable)</code>)</li><li>등수 열을 만들어 저장하기 (<code>UPDATE</code> 와 반복문)</li><li>결과를 CSV 파일로 내보내기 (4 · 5교시에서 배웁니다)</li></ul>',
            hint: '총점은 <code>kor + eng + math</code> 처럼 <b>SQL 안에서 계산</b>할 수 있고 <code>AS total</code> 로 이름을 붙이면 <code>ORDER BY total DESC</code> 에 쓸 수 있습니다. 순위 번호는 파이썬 변수 <code>rank</code> 를 1부터 늘려 출력합니다.',
            starter: PJ_SCORE_S, solution: PJ_SCORE,
            expect: '===== 전체 요약 =====\n학생 8명 / 총점 평균 241.1 / 최고 285 / 최저 165\n===== 반별 평균 (높은 순) =====\n2반 3명 평균 254.7\n1반 3명 평균 238.3\n3반 2명 평균 225.0\n===== 총점 상위 3명 =====\n1위 최지우(2반) 285점\n2위 한지민(3반) 285점\n3위 이영희(1반) 280점\n===== 총점 평균이 240점 이상인 반 =====\n2반 254.7\n===== 과목별 평균 =====\n국어 80.4 / 영어 78.9 / 수학 81.9' }
        ],
        quiz: [
          { q: 'SELECT 결과에 열 이름을 표시하고 열을 맞춰 출력하려면 sqlite3.exe 에서 어떤 명령을 먼저 입력하나요?',
            options: ['.table 과 .schema', '.header on 과 .mode column', '.open 과 .quit', 'ORDER BY 와 WHERE'], answer: 1,
            explain: '<code>.header on</code> 은 헤더(열 이름)를 보여 주고, <code>.mode column</code> 은 컬럼 모드로 출력합니다.' },
          { q: '다음 SQL 의 결과로 나오는 행은 몇 개인가요? (userTable: john 1990, kim 1992, lee 1988, park 1980)<pre><code>SELECT id FROM userTable WHERE birthYear &lt;= 1990;</code></pre>',
            options: ['1개', '2개', '3개', '4개'], answer: 2,
            explain: '1990 이하인 john(1990), lee(1988), park(1980) 의 3개 행이 나옵니다.' },
          { q: "<code>SELECT * FROM userTable ORDER BY birthYear;</code> 의 첫 번째 행은?",
            options: ['john', 'kim', 'lee', 'park'], answer: 3,
            explain: 'ORDER BY 는 기본이 오름차순이라 가장 작은 출생연도 1980 의 park 가 맨 앞에 옵니다.' },
          { q: 'SQL 의 WHERE 절에서 “id 가 park 와 같다” 를 올바르게 쓴 것은?',
            options: ["WHERE id == 'park'", "WHERE id = 'park'", 'WHERE id = park', "WHERE id is 'park'"], answer: 1,
            explain: "SQL 의 같다는 <code>=</code> 하나이고, 문자열은 작은따옴표로 감쌉니다. (SQLite 는 == 도 받아 주지만 표준은 =)" },
          { q: '<code>DELETE FROM userTable;</code> 을 실행하고 commit 하면?',
            options: ['아무 행도 지워지지 않는다', '첫 번째 행만 지워진다', '모든 행이 지워진다', '테이블 자체가 삭제된다'], answer: 2,
            explain: 'WHERE 가 없으면 모든 행이 대상입니다. 테이블 구조는 남고 행만 모두 지워집니다(테이블 자체를 지우는 것은 DROP TABLE).' },
          { q: '도시별 회원 수를 구하고, 그중 <b>2명 이상인 도시만</b> 보려면?',
            options: ['<code>SELECT city, COUNT(*) FROM m WHERE COUNT(*) &gt;= 2 GROUP BY city</code>', '<code>SELECT city, COUNT(*) FROM m GROUP BY city HAVING COUNT(*) &gt;= 2</code>', '<code>SELECT city, COUNT(*) FROM m GROUP BY COUNT(*) &gt;= 2</code>', '<code>SELECT city FROM m ORDER BY COUNT(*) LIMIT 2</code>'], answer: 1,
            explain: '묶은 결과에 거는 조건은 <code>HAVING</code> 입니다. <code>WHERE</code> 는 묶기 전의 행에 대한 조건이라 COUNT 를 쓸 수 없습니다.' }
        ],
        slides: [
          { layout: 'title', title: '데이터 조회와 [프로그램 1] 완성', subtitle: 'Chapter 13 · Section 03 — 데이터베이스의 구축 (2)', badge: '13-3',
            notes: '<p>지난 시간 ❶~❸(생성 · 테이블 · 입력)을 복습하고, 오늘은 ❹ 조회로 [프로그램 1]을 완성한다고 소개합니다. (2분)</p>' },
          { layout: 'bullets', title: '❹ 데이터 조회 — SELECT', lead: 'SELECT * FROM 테이블이름;',
            bullets: ['<code>*</code> = 모든 열', '기본 출력: <code>john|John Bann|…</code> (list 모드)', '<code>.header on</code> : 열 이름 보이기', '<code>.mode column</code> : 열을 맞춘 표 모양', 'SELECT 전에 두 설정을 켜 두면 보기 좋음'],
            notes: '<p>* 가 “모든 열” 이라는 점을 강조합니다. list 모드와 컬럼 모드의 차이는 다음 화면으로 보여 줍니다.</p><p>시간: 3분</p>' },
          { layout: 'diagram', title: '[프로그램 1]의 완성', html: T_SELECT, caption: '.header on → .mode column → SELECT * FROM userTable;',
            notes: '<p>노란 글자 세 줄이 사용자가 입력한 값입니다. 헤더 아래 ---- 구분선의 길이는 열에서 가장 긴 값에 맞춰진다는 것을 보여 줍니다.</p><p>시간: 3분</p>' },
          { layout: 'code', title: '파이썬으로 [프로그램 1] (간단 버전)', code: C_PROG1_SHORT,
            points: ['DB · 테이블 · 입력 · 조회를 한 번에', '<code>fetchall()</code> : 모든 행 리스트', '<code>f"{값:&lt;6}"</code> : 6칸 왼쪽 정렬', '본문에는 열 너비 자동 계산 버전'],
            notes: '<p>명령행 화면과 출력을 나란히 비교하게 합니다. 본문의 show() 함수 버전은 열 너비를 자동 계산한다는 것만 소개합니다.</p><p>시간: 5분</p>' },
          { layout: 'diagram', title: 'SELECT … WHERE 조건', html: T_WHERE, caption: 'SELECT 열이름1, 열이름2, … FROM 테이블이름 WHERE 조건;',
            notes: '<p>❶ 열 고르기 + 조건, ❷ 문자열 조건(작은따옴표), ❸ ORDER BY 정렬, ❹ .quit. 헤더 설정 없이 기본 list 모드로 출력된 모습입니다.</p><p>발문: “1992년생 kim 은 ❶ 결과에 왜 없나요?” (4분)</p>' },
          { layout: 'code', title: '파이썬으로 ❶~❹', code: C_LISTMODE.replace(FRESH, `cur.execute("DROP TABLE IF EXISTS userTable")\n${U_CREATE}\n${U_INS.join('\n')}\ncon.commit()`),
            points: ['<code>query()</code> : SQL 을 실행하고 list 모드처럼 출력', '<code>"|".join()</code> 으로 값 연결', '<code>str(v)</code> : 숫자 → 문자열', '.quit ↔ <code>con.close()</code>'],
            notes: '<p>명령행 결과와 똑같이 나오는지 확인합니다. WHERE 조건을 바꿔 보게 하세요 (예: birthYear &gt; 1985).</p><p>시간: 5분</p>' },
          { layout: 'table', title: 'WHERE · ORDER BY 표현 (보충)', head: ['SQL', '뜻'],
            rows: [['= , &lt;&gt;', '같다, 다르다'], ['&lt; &lt;= &gt; &gt;=', '크기 비교'], ['AND, OR, NOT', '그리고, 또는, 아니다'], ["LIKE '%naver%'", 'naver 가 들어 있는'], ['ORDER BY 열 DESC', '내림차순 정렬'], ['COUNT(*), AVG(열)', '개수, 평균 (집계 함수)']],
            notes: '<p>파이썬과 다른 점: 같다는 = 하나, 다르다는 &lt;&gt;. LIKE 의 % 는 “아무 글자나 여러 개”.</p><p>시간: 3분</p>' },
          { layout: 'code', title: '추가 예제. UPDATE 와 DELETE', code: C_UPDATE.replace(FRESH, `cur.execute("DROP TABLE IF EXISTS userTable")\n${U_CREATE}\n${U_INS.join('\n')}\ncon.commit()`),
            points: ['<code>UPDATE … SET … WHERE</code> : 수정', '<code>DELETE FROM … WHERE</code> : 삭제', 'WHERE 빠뜨리면 전체 행!', 'CRUD = 입력 · 조회 · 수정 · 삭제'],
            notes: '<p>강의자료 밖 보충입니다. 시간이 부족하면 “WHERE 없는 DELETE 는 전체 삭제” 만 강조하고 넘어갑니다.</p><p>시간: 4분</p>' },
          { layout: 'code', title: 'IN · BETWEEN · LIKE 로 골라내기', code: SL3_WHERE,
            points: ['<code>IN</code> : 여러 값 중 하나', '<code>BETWEEN a AND b</code> : 양 끝 포함', '<code>LIKE</code> : <code>%</code> 여러 글자, <code>_</code> 한 글자', 'NULL 은 <code>IS NULL</code> 로만 비교'],
            notes: '<p>조건을 하나씩 바꿔 가며 실행해 보게 합니다. <code>IN</code> 은 OR 의 줄임, <code>BETWEEN</code> 은 두 부등호의 줄임이라고 설명하면 이해가 빠릅니다.</p><p>발문: “1990년생은 BETWEEN 1988 AND 1992 에 포함될까요?” (5분)</p>' },
          { layout: 'code', title: '집계 함수와 GROUP BY · HAVING', code: SL3_GROUP,
            points: ['COUNT · SUM · AVG · MIN · MAX', '<code>GROUP BY 열</code> : 묶음마다 계산', '<code>HAVING</code> : 묶은 결과에 거는 조건', '<code>ROUND(AVG(열), 1)</code> 로 반올림'],
            notes: '<p>“전체 한 줄 → 도시별 여러 줄” 로 바뀌는 것을 보여 줍니다. WHERE 와 HAVING 의 차이(묶기 전/후)는 본문 보충 상자에 있습니다.</p><p>시간: 6분</p>' },
          { layout: 'code', title: 'UPDATE · DELETE 는 이렇게 안전하게', code: SL3_SAFE,
            points: ['① 같은 조건으로 SELECT 해서 확인', '② 같은 WHERE 로 DELETE · UPDATE', '③ <code>cur.rowcount</code> 로 행 수 확인', 'commit 전이면 <code>rollback()</code> 으로 복구'],
            notes: '<p>WHERE 를 지우고 실행하면 6행이 모두 지워지는 것을 직접 보여 주세요. commit 전이라 rollback 으로 살아난다는 점도 강조합니다(실무에서는 commit 후면 끝입니다).</p><p>시간: 5분</p>' },
          { layout: 'bullets', title: '📘 인덱스 — 찾기를 빠르게', lead: '책 뒤의 “찾아보기” 와 같은 것',
            bullets: ['인덱스가 없으면 처음부터 한 행씩 훑는다(SCAN)', '<code>CREATE INDEX idx_name ON 표(열)</code>', '10만 행에서 수백 배까지 빨라짐', ['공짜는 아니다', ['저장 공간 사용, INSERT · UPDATE 가 조금 느려짐']], 'PRIMARY KEY · UNIQUE 열에는 자동으로 생김'],
            notes: '<p>본문의 10만 행 예제를 실행해 시간 차이를 보여 주면 인상적입니다. “모든 열에 인덱스” 는 나쁜 습관이라는 점도 함께 말해 주세요.</p><p>시간: 4분</p>' },
          { layout: 'quiz', title: '확인 문제', q: "SELECT * FROM userTable WHERE id = 'park'; 에서 'park' 의 작은따옴표를 빼면?",
            options: ['똑같이 동작한다', 'park 를 열 이름으로 보아 no such column 오류', '모든 행이 나온다', '아무 행도 안 나온다(오류 없음)'], answer: 1,
            explain: '따옴표가 없으면 park 를 열 이름으로 해석해 <code>no such column: park</code> 오류가 납니다.',
            notes: '<p>파이썬 코드에서 직접 따옴표를 지우고 실행해 오류 메시지를 보여 주면 효과적입니다. (2분)</p>' },
          { layout: 'practice', title: 'SELF STUDY 13-1. 제품 테이블', desc: '<p>productTable(pCode, pName, price, amount)에 p0001 노트북 110 5 / p0002 마우스 3 22 / p0003 키보드 2 11 을 넣고 컬럼 모드로 출력</p>', starter: PR_SS1_S, solution: PR_SS1,
            notes: '<p>힌트: 코드 · 이름은 char, 가격 · 수량은 int. 이 테이블은 다음 교시 SELF STUDY 13-2, 13-3 에서도 씁니다.</p><p>시간: 10분</p>' },
          { layout: 'practice', title: '🚀 프로젝트 13-3. 성적 DB 통계 리포트', desc: '<p>8명의 성적 표에서 전체 요약 · 반별 평균 · 상위 3명 · 평균 240점 이상인 반 · 과목별 평균을 SQL 로 계산해 리포트로 출력하세요.</p>', starter: PJ_SCORE_S, solution: PJ_SCORE,
            notes: '<p>오늘 배운 WHERE · ORDER BY · LIMIT · 집계 · GROUP BY · HAVING 을 모두 쓰는 종합 과제입니다. 총점을 SQL 안에서 <code>kor + eng + math</code> 로 계산한다는 힌트를 주세요.</p><p>시간: 12분 또는 과제</p>' },
          { layout: 'summary', title: '정리', bullets: ['SELECT * FROM 테이블; — 전체 조회', 'WHERE: 비교 · AND/OR · IN · BETWEEN · LIKE · IS NULL', 'ORDER BY · LIMIT · DISTINCT · AS', '집계: COUNT · SUM · AVG + GROUP BY · HAVING', 'UPDATE · DELETE 는 SELECT 로 확인 후 WHERE 와 함께'],
            notes: '<p>[프로그램 1] 완성! 다음 시간부터는 파이썬 프로그램이 DB 를 쓰는 3단계(활용)로 넘어갑니다. (1분)</p>' }
        ]
      },

      /* ============================================================ 13-4 */
      {
        id: 'ch13-4',
        title: '파이썬에서 데이터 입력하기',
        minutes: 50,
        goals: [
          '파이썬에서 데이터를 입력하는 6단계(연결 → 커서 → 테이블 → 입력 → 커밋 → 닫기)를 설명할 수 있다',
          '커서의 역할과 commit() 의 필요성을 이해한다',
          'input() 으로 받은 값을 SQL 문으로 만들어 반복 입력하는 프로그램(Code13-01)을 만들 수 있다',
          '? 자리표시자로 안전하게 값을 넣을 수 있다'
        ],
        flow: [['입력 코딩 순서', 5], ['연결 · 커서 · execute', 10], ['commit · close', 8], ['Code13-01 입력 프로그램', 15], ['SELF STUDY 13-2 · 정리', 12]],
        content: [
          { type: 'h', text: '파이썬에서 데이터를 입력하는 코딩 순서' },
          { type: 'p', html: '이제 명령행 도구 대신 <b>파이썬 프로그램</b>이 데이터베이스를 다룹니다(구축 과정의 3단계). 데이터를 입력하는 코드는 항상 다음 6단계를 따릅니다. ❹ 데이터 입력은 필요한 만큼 반복합니다.' },
          { type: 'figure', html: F_FLOW_IN, caption: '그림 13-7 SQLite 의 데이터 입력 순서' },

          { type: 'h', text: '❶ 데이터베이스 연결' },
          { type: 'p', html: '<code>sqlite3</code> 모듈을 임포트한 뒤 <code>sqlite3.connect("DB이름")</code> 으로 데이터베이스 파일과 연결합니다. 돌려받은 <b>연결자(Connection)</b>를 보통 <code>con</code> 변수에 저장합니다.' },
          { type: 'code', run: false, title: '❶ 데이터베이스 연결', code: 'import sqlite3\ncon = sqlite3.connect("naverDB")      # 작업 폴더의 naverDB 파일에 연결 (출력 없음)' },
          { type: 'callout', kind: 'info', title: '경로를 바꾼 이유', html: '강의자료는 <code>sqlite3.connect("C:/CookPython/naverDB")</code> 처럼 소스 코드 폴더의 경로를 씁니다. 브라우저에는 C: 드라이브가 없으므로 이 강좌에서는 <b>작업 폴더</b>의 <code>"naverDB"</code> 를 씁니다. 파일 이름만 쓰면 “현재 폴더” 라는 뜻입니다.' },

          { type: 'h', text: '❷ 커서 생성' },
          { type: 'p', html: '<b>커서(Cursor)</b>는 데이터베이스에 SQL 문을 실행하고, 실행된 결과를 돌려받는 <b>통로</b>입니다. ❶ 에서 만든 연결자로 커서를 만듭니다: <code>cur = con.cursor()</code>. 연결자가 “DB 까지 이어진 길” 이라면 커서는 그 길을 오가며 SQL 문을 전달하고 결과를 가져오는 “배달원” 입니다.' },
          { type: 'figure', html: F_CURSOR, caption: '연결자(con)와 커서(cur)의 역할' },

          { type: 'h', text: '❸ 테이블 만들기 · ❹ 데이터 입력' },
          { type: 'p', html: 'SQL 문을 문자열로 만들어 <code>커서.execute()</code> 의 매개변수로 넘기면 데이터베이스에서 실행됩니다. 셸(<code>&gt;&gt;&gt;</code>)에서 실행하면 <code>execute()</code> 가 커서 객체 자신을 돌려주기 때문에 <code>&lt;sqlite3.Cursor object at 0x…&gt;</code> 가 출력됩니다(주소는 실행할 때마다 다름). 스크립트로 실행할 때는 아무것도 출력되지 않습니다.' },
          { type: 'code', repl: true, nondeterministic: true, title: '셸에서 한 줄씩 실행해 보기 (❶ ~ ❻)', code: C_REPL,
            desc: '▶ 실행하면 콘솔의 <code>&gt;&gt;&gt;</code> 셸에서 한 줄씩 실행됩니다. execute 가 돌려준 <code>&lt;sqlite3.Cursor object at …&gt;</code> 와 <code>fetchall()</code> 의 결과를 확인해 보세요.' },

          { type: 'h', text: '❺ 입력한 데이터 저장 — 커밋(Commit) · ❻ 데이터베이스 닫기' },
          { type: 'p', html: 'INSERT 한 데이터는 바로 파일에 기록되지 않고 <b>임시 작업 공간</b>에 머뭅니다. <code>con.commit()</code> 을 해야 비로소 파일에 확정 저장됩니다. 다 쓴 뒤에는 <code>con.close()</code> 로 연결을 닫습니다.' },
          { type: 'figure', html: F_COMMIT, caption: '커밋(commit): 임시로 입력한 내용을 파일에 확정 저장하기' },
          { type: 'code', title: '추가 예제. 6단계를 모은 완성 코드', code: C_SIX, expect: 'naverDB 의 userTable 에 4명 저장 완료',
            desc: '강의자료의 ❶~❻ 조각을 하나의 프로그램으로 모았습니다. 마지막 줄의 print 만 출력을 만들고, 나머지 줄은 아무것도 출력하지 않습니다.' },
          { type: 'code', title: '추가 예제. commit() 을 빠뜨리면?', code: C_NOCOMMIT, expect: 'commit 없이 닫은 뒤 행 개수 : 0\ncommit 하고 닫은 뒤 행 개수 : 1',
            desc: '첫 번째 INSERT 는 commit 없이 닫았기 때문에 다시 열었을 때 0행입니다. 두 번째는 commit 했으므로 1행입니다. <b>“입력했는데 조회하면 없어요!”</b> 라는 질문의 90%는 commit 을 빠뜨린 경우입니다.' },
          { type: 'callout', kind: 'more', title: '📘 트랜잭션(transaction)', html: '여러 SQL 문을 “모두 성공하거나, 모두 취소되거나” 하나의 묶음으로 처리하는 단위를 <b>트랜잭션</b>이라고 합니다. 은행 이체에서 “내 계좌에서 빼기” 와 “상대 계좌에 넣기” 중 하나만 되면 큰일이죠. <code>commit()</code> 은 묶음을 확정하고, <code>con.rollback()</code> 은 마지막 commit 이후의 변경을 모두 취소합니다. <code>with con:</code> 블록을 쓰면 블록이 정상으로 끝날 때 자동 commit, 예외가 나면 자동 rollback 됩니다.' },

          { type: 'h', text: '데이터 입력 프로그램의 구현 (Code13-01)' },
          { type: 'p', html: '사용자 ID 를 입력받다가 <b>아무것도 입력하지 않고 Enter</b> 를 치면 끝나는 반복 입력 프로그램입니다. 입력받은 네 값으로 INSERT 문을 만들어 실행하고, 반복이 끝나면 한 번에 commit 합니다.' },
          { type: 'code', title: 'Code13-01. 데이터 입력 프로그램', code: C_13_01,
            stdin: 'su\nSu Ji\nsuji@naver.com\n1994\n\n',
            expect: '사용자ID ==> su\n사용자이름 ==> Su Ji\n이메일 ==> suji@naver.com\n출생연도 ==> 1994\n사용자ID ==>',
            desc: '<code>11행</code>: 강의자료에는 빈 줄이지만, 웹 강좌에서는 테이블이 없을 때를 대비해 <code>CREATE TABLE IF NOT EXISTS</code> 를 넣었습니다. <code>13~15행</code>: 무한 반복하다가 ID 가 빈 문자열이면 break. <code>20행</code>: 입력값을 이어 붙여 INSERT 문을 만듭니다. <code>23~24행</code>: 반복이 끝난 뒤 commit, close. (“예시 입력으로 실행” 을 누르면 su 회원 한 명을 입력합니다. 입력한 데이터는 다음 교시 Code13-02 로 확인할 수 있습니다.)' },
          { type: 'figure', html: F_CONCAT, caption: '20행: 문자열 이어 붙이기로 INSERT 문 만들기' },
          { type: 'callout', kind: 'warn', title: '이런 입력은 오류가 나요', html: '<ul><li>출생연도를 비워 두면 <code>…,\'suji@naver.com\',)</code> 처럼 값이 빠져 <code>syntax error</code></li><li>출생연도에 <code>천구백</code> 같은 글자를 넣으면 따옴표 없는 글자라 <code>no such column</code></li><li>이름에 작은따옴표가 들어가면(<code>O\'Neil</code>) SQL 문의 따옴표 짝이 깨져 <code>syntax error</code></li></ul>' },
          { type: 'code', title: '추가 예제. 이름에 작은따옴표가 있으면?', code: C_QUOTE_ERR, expectError: true,
            expect: '사용자ID ==> tom\n사용자이름 ==> Tom O\'Neil\n이메일 ==> tom@mail.com\n출생연도 ==> 1999\nINSERT INTO userTable VALUES(\'tom\',\'Tom O\'Neil\',\'tom@mail.com\',1999)\nTraceback (most recent call last):\n  File "main.py", line 13, in <module>\n    cur.execute(sql)\n    ~~~~~~~~~~~^^^^^\nsqlite3.OperationalError: near "Neil": syntax error',
            stdin: "tom\nTom O'Neil\ntom@mail.com\n1999\n",
            desc: '만들어진 SQL 문을 보면 <code>\'Tom O\'</code> 에서 문자열이 끝나 버려 뒤의 <code>Neil\'</code> 을 이해하지 못합니다.' },
          { type: 'h', text: '📘 더 안전한 방법 — ? 자리표시자' },
          { type: 'p', html: '문자열을 이어 붙이는 대신 SQL 문의 값 자리에 <code>?</code> 를 적고, 실제 값은 <b>튜플로 따로</b> 넘기면 sqlite3 모듈이 따옴표 처리를 알아서 해 줍니다. 실무에서는 반드시 이 방법을 씁니다.' },
          { type: 'code', title: '추가 예제. ? 자리표시자로 입력하기', code: C_PLACEHOLDER,
            stdin: "tom\nTom O'Neil\ntom@mail.com\n1999\n\n",
            expect: "사용자ID ==> tom\n사용자이름 ==> Tom O'Neil\n이메일 ==> tom@mail.com\n출생연도 ==> 1999\n→ Tom O'Neil 님 입력 완료\n사용자ID ==>\n('tom', \"Tom O'Neil\", 'tom@mail.com', 1999)",
            desc: '<code>cur.execute(sql, (값1, 값2, …))</code> 형태입니다. 값이 하나일 때도 튜플이어야 하므로 <code>("tom",)</code> 처럼 쉼표를 붙입니다. 출생연도는 <code>int()</code> 로 바꿔 정수로 저장합니다.' },
          { type: 'callout', kind: 'more', title: '📘 SQL 삽입(SQL Injection) 공격', html: '문자열 이어 붙이기로 SQL 을 만들면, 악의적인 사용자가 입력칸에 SQL 조각을 넣어 데이터를 훔치거나 지울 수 있습니다. 예를 들어 로그인 아이디 칸에 <code>\' OR \'1\'=\'1</code> 을 넣으면 조건이 항상 참이 되어 버립니다. 이것을 <b>SQL 삽입 공격</b>이라고 하며 실제로 많은 해킹 사고의 원인이었습니다. <code>?</code> 자리표시자는 값을 항상 “데이터” 로만 다루므로 이 공격을 막아 줍니다.' },

          { type: 'h', text: '한 걸음 더 — SQL 인젝션을 직접 해 보기' },
          { type: 'p', html: '말로만 들으면 감이 안 오니 <b>직접 공격해 봅시다</b>. 아이디와 비밀번호로 로그인하는 프로그램이 있다고 합시다. 비밀번호 칸에 <code>\' OR \'1\'=\'1</code> 을 입력하면 어떻게 될까요?' },
          { type: 'code', title: '추가 예제. 문자열 이어 붙이기 vs ? 자리표시자 (SQL 인젝션)', code: X4_INJECT,
            expect: "① 올바른 비밀번호\n   만들어진 SQL : SELECT userId FROM loginTable WHERE userId = 'john' AND password = 'apple123'\n   로그인 결과 : [('john',)]\n② 비밀번호 대신 공격 문자열 ' OR '1'='1 을 넣으면\n   만들어진 SQL : SELECT userId FROM loginTable WHERE userId = 'john' AND password = '' OR '1'='1'\n   로그인 결과 : [('john',), ('kim',)]\n③ 같은 공격을 ? 자리표시자에 넣으면\n   로그인 결과 : []",
            desc: '②에서 만들어진 SQL 을 읽어 보세요. 사용자가 넣은 따옴표 때문에 조건이 <code>(userId = \'john\' AND password = \'\') OR (\'1\'=\'1\')</code> 로 바뀌어 <b>항상 참</b>이 되었고, 비밀번호 없이 <b>회원 전체</b>가 조회되었습니다. ③처럼 <code>?</code> 로 넘기면 같은 글자가 “비밀번호라는 <b>값</b>” 으로만 취급되어 아무 일도 일어나지 않습니다.' },
          { type: 'callout', kind: 'warn', title: '규칙: SQL 문에 값을 “붙이지” 마세요', html: '<p>파이썬 문자열 이어 붙이기(<code>+</code>), <code>%</code> 서식, f-string 어느 것으로도 <b>SQL 문에 값을 직접 넣지 않습니다</b>. 값은 항상 <code>?</code> 와 튜플로 넘깁니다.</p><pre><code>cur.execute(f"SELECT * FROM t WHERE id = \'{uid}\'")   # ✕ 위험\ncur.execute("SELECT * FROM t WHERE id = ?", (uid,))     # ○ 안전</code></pre><p>단, <b>테이블 이름 · 열 이름</b>은 <code>?</code> 로 넘길 수 없습니다. 이럴 때는 미리 정해 둔 목록에 있는 이름인지 검사한 뒤 붙여야 합니다.</p>' },

          { type: 'h', text: '여러 건을 한 번에 — executemany()' },
          { type: 'p', html: '입력할 데이터가 리스트에 들어 있다면 <code>for</code> 문으로 <code>execute()</code> 를 반복해도 되지만, <code>executemany(SQL, 값리스트)</code> 를 쓰면 <b>한 줄</b>로 끝나고 더 빠릅니다.' },
          { type: 'code', title: '추가 예제. executemany() 로 4명 한 번에 입력', code: X4_EXECMANY,
            expect: "입력된 행 : 4\n첫 행 : ('john', 'John Bann', 'john@naver.com', 1990)",
            desc: '값 리스트는 <b>튜플의 리스트</b>여야 합니다. 각 튜플이 <code>?</code> 개수와 맞아야 합니다. 수천 건을 넣을 때는 반복 <code>execute</code> 보다 훨씬 빠릅니다.' },
          { type: 'callout', kind: 'more', title: '📘 빠르게 입력하는 요령', html: '<ul><li><b>commit 은 마지막에 한 번</b> — 한 건 넣을 때마다 commit 하면 그때마다 파일에 기록하느라 느려집니다.</li><li><code>executemany</code> 는 SQL 문을 한 번만 해석하고 값만 바꿔 넣으므로 효율적입니다.</li><li>정말 많은 데이터(수십만 건)라면 트랜잭션으로 묶고, 입력이 끝난 뒤 인덱스를 만드는 것이 빠릅니다.</li></ul>' },

          { type: 'h', text: '트랜잭션 — 모두 성공하거나, 모두 취소되거나' },
          { type: 'p', html: '계좌 이체는 “A 에서 빼기” 와 “B 에 넣기” 가 <b>둘 다 성공</b>해야 합니다. 하나만 성공하면 돈이 사라지죠. 이렇게 <b>하나로 묶여야 하는 SQL 문들의 단위</b>를 <b>트랜잭션(transaction)</b> 이라고 합니다. <code>commit()</code> 은 묶음을 확정하고, <code>rollback()</code> 은 마지막 commit 이후의 변경을 모두 취소합니다.' },
          { type: 'code', title: '추가 예제. 계좌 이체와 rollback · with con', code: X4_TRANS,
            expect: "처음        : [('영희', 5000), ('철수', 10000)]\n이체 실패   : CHECK constraint failed: money >= 0\nrollback 후 : [('영희', 5000), ('철수', 10000)]\n정상 이체 후 : [('영희', 8000), ('철수', 7000)]",
            desc: '철수의 돈을 빼는 UPDATE 는 성공했지만 영희 쪽에서 오류가 났습니다. <code>rollback()</code> 덕분에 <b>철수의 돈도 원래대로</b> 돌아왔습니다. 아래쪽 <code>with con :</code> 블록은 정상으로 끝나면 자동 <code>commit</code>, 예외가 나면 자동 <code>rollback</code> 을 해 주어 더 안전합니다. (<code>with</code> 는 연결을 <b>닫지는 않습니다</b> — <code>close()</code> 는 따로.)' },
          { type: 'callout', kind: 'more', title: '📘 트랜잭션과 ACID', html: '<p>데이터베이스의 트랜잭션은 네 가지 성질을 보장한다고 해서 <b>ACID</b> 라고 부릅니다.</p><ul><li><b>Atomicity(원자성)</b> — 전부 되거나 전부 안 되거나</li><li><b>Consistency(일관성)</b> — 제약 조건을 깨는 상태로는 끝나지 않음</li><li><b>Isolation(고립성)</b> — 동시에 실행되는 다른 작업에 섞이지 않음</li><li><b>Durability(지속성)</b> — commit 한 내용은 정전이 나도 남음</li></ul><p>파일 저장에는 이런 보장이 전혀 없습니다. “돈 · 성적 · 주문” 처럼 틀리면 안 되는 데이터를 DB 에 넣는 이유입니다.</p>' },

          { type: 'h', text: '자동 번호 기본키와 lastrowid' },
          { type: 'p', html: '메모 · 게시글 · 주문처럼 <b>번호를 매겨야 하는</b> 데이터는 <code>INTEGER PRIMARY KEY</code> 열을 두면 SQLite 가 1, 2, 3 … 을 자동으로 넣어 줍니다. 방금 저장한 행의 번호는 <code>cur.lastrowid</code> 로 알 수 있습니다.' },
          { type: 'code', title: '추가 예제. 자동 번호와 lastrowid', code: X4_AUTOID,
            expect: "방금 저장한 번호 : 1\n방금 저장한 번호 : 2\n방금 저장한 번호 : 3\n[(1, '첫 번째 메모'), (2, '두 번째 메모'), (3, '세 번째 메모')]",
            desc: 'INSERT 할 때 <code>no</code> 열은 아예 적지 않고 <code>INSERT INTO memo (content) VALUES(?)</code> 처럼 나머지 열만 적습니다. <code>lastrowid</code> 는 “방금 넣은 행의 번호” 라서 다른 테이블에 연결할 때(주문 → 주문상세) 요긴합니다.' },

          { type: 'h', text: '이미 있는 행이면? — INSERT OR IGNORE · UPSERT' },
          { type: 'code', title: '추가 예제. 중복을 만났을 때 세 가지 선택', code: X4_UPSERT,
            expect: "방문 횟수 : [('john', 3), ('kim', 1)]\nOR IGNORE 뒤 : [('john', 3)]\nOR REPLACE 뒤 : [('john', 999)]",
            desc: '<ul><li><code>ON CONFLICT(열) DO UPDATE SET …</code> — 없으면 넣고 있으면 고친다(<b>UPSERT</b>). 방문 횟수 세기에 딱 맞습니다.</li><li><code>INSERT OR IGNORE</code> — 이미 있으면 조용히 건너뜀</li><li><code>INSERT OR REPLACE</code> — 이미 있으면 그 행을 통째로 바꿔치기 (나머지 열이 기본값으로 초기화되므로 조심)</li></ul>' },

          { type: 'h', text: 'CSV 파일을 데이터베이스로 가져오기' },
          { type: 'p', html: '실무에서는 엑셀에서 받은 자료를 <b>CSV</b> 로 저장해 데이터베이스로 옮기는 일이 아주 많습니다. 11장에서 배운 <code>csv</code> 모듈로 읽어 <code>executemany</code> 로 넣으면 됩니다.' },
          { type: 'code', title: '추가 예제. CSV → DB 가져오기', code: X4_CSVIN,
            expect: "가져온 행 : 3\n('lee', 'Lee Pal', '서울', 300)\n('john', 'John Bann', '서울', 120)\n('kim', 'Kim Chi', '부산', 80)",
            desc: '<code>next(reader)</code> 로 제목 줄을 건너뛰고, 숫자 열은 <code>int()</code> 로 바꿔 넣는 것이 핵심입니다. CSV 의 값은 모두 문자열로 읽히기 때문입니다. 반대 방향(DB → CSV 내보내기)은 다음 교시에서 배웁니다.' }
        ],
        practice: [
          { title: 'SELF STUDY 13-2. 제품 데이터 입력 프로그램', level: 2,
            desc: '<p>Code13-01 을 수정해서 SELF STUDY 13-1 의 <code>productTable</code>(제품코드, 제품명, 가격, 재고수량)에 데이터가 입력되도록 해 보세요. 제품코드를 비워 두고 Enter 를 치면 끝납니다.</p><p>“예시 입력으로 실행” 하면 p0004 모니터 25 7 을 입력합니다.</p>',
            hint: '테이블을 만들어야 하므로 11행에서 <code>cur.execute("CREATE TABLE … 문")</code> 도 수행해야 합니다 (<code>IF NOT EXISTS</code> 를 붙이면 반복 실행 가능). 가격 · 재고수량은 숫자이므로 따옴표 없이 이어 붙입니다.',
            starter: PR_SS2_S, solution: PR_SS2,
            stdin: 'p0004\n모니터\n25\n7\n\n',
            expect: '제품코드 ==> p0004\n제품명 ==> 모니터\n가격 ==> 25\n재고수량 ==> 7\n제품코드 ==>\nproductTable 의 제품 수 : 1' },
          { title: '실습 13-4-2. executemany 로 메뉴판 만들기', level: 1,
            desc: '<p><code>cafeDB</code> 의 <code>menuTable</code>(이름 <code>name</code>, 가격 <code>price</code>)에 뼈대의 <code>menuList</code> 5개를 <b><code>executemany</code> 한 번</b>으로 입력하세요. 그런 다음 메뉴 개수와 가격 합계를 출력하고, 비싼 순으로 전체를 출력합니다.</p>',
            hint: '<code>cur.executemany("INSERT INTO menuTable VALUES(?, ?)", menuList)</code>. 합계는 파이썬이 아니라 <code>SELECT SUM(price)</code> 로 DB 에게 시켜 보세요.',
            starter: PR_EM_S, solution: PR_EM,
            expect: "저장된 메뉴 : 5 개\n가격 합계 : 19200 원\n('레모네이드', 4500)\n('핫초코', 4200)\n('카페라떼', 4000)\n('녹차', 3500)\n('아메리카노', 3000)" },
          { title: '실습 13-4-3. 자동 번호가 붙는 방명록', level: 1,
            desc: '<p><code>guestDB</code> 에 <code>guestBook</code>(<code>no</code> 자동 번호 기본키, <code>name</code>, <code>message</code>)을 만들고 방명록 3건을 입력하세요.</p><ul><li><code>no</code> 는 적지 않고 입력한 뒤, 저장된 번호(<code>cur.lastrowid</code>)를 출력합니다.</li><li>마지막에 <b>번호가 큰 것부터</b> <code>[번호] 이름 - 내용</code> 형식으로 출력합니다.</li></ul>',
            hint: '<code>CREATE TABLE guestBook (no INTEGER PRIMARY KEY, …)</code> 으로 만들면 번호가 자동으로 붙습니다. 최신 글이 위로 오게 하려면 <code>ORDER BY no DESC</code>.',
            starter: PR_AUTO_S, solution: PR_AUTO,
            expect: '1 번 글 저장 : 철수\n2 번 글 저장 : 영희\n3 번 글 저장 : 민수\n[3] 민수 - 또 올게요\n[2] 영희 - 잘 보고 갑니다\n[1] 철수 - 반갑습니다' },
          { title: '실습 13-4-4. 리스트의 데이터를 한꺼번에 입력하기', level: 2,
            desc: '<p><code>scores</code> 리스트의 세 학생 성적을 for 문과 <code>?</code> 자리표시자로 <code>scoreTable</code> 에 입력한 뒤, 이름 · 국어 · 영어 · 합계를 출력하세요.</p>',
            hint: '<code>cur.execute("INSERT INTO scoreTable VALUES(?, ?, ?)", s)</code> — s 가 이미 튜플이므로 그대로 넘기면 됩니다. SQL 에서 <code>kor + eng</code> 처럼 열끼리 계산할 수도 있습니다.',
            starter: PR_MANY_S, solution: PR_MANY,
            expect: '철수 90 80 합계: 170\n영희 85 95 합계: 180\n민수 70 88 합계: 158' },
          { title: '실습 13-4-5. CSV 파일을 데이터베이스로 가져오기', level: 2,
            desc: '<p>작업 폴더의 <code>menu.csv</code>(제목 줄 + 4행)를 읽어 <code>cafeDB</code> 의 <code>menuTable</code>(<code>name</code>, <code>price</code>, <code>kind</code>)에 넣으세요.</p><ul><li>제목 줄은 건너뛰고, 가격은 <code>int()</code> 로 바꿔 넣습니다.</li><li>가져온 행 수를 출력합니다.</li><li>종류(<code>kind</code>)별 개수와 평균 가격을 <code>커피 : 2개, 평균 3500.0원</code> 형식으로 출력합니다(가나다순).</li></ul>',
            hint: '<code>reader = csv.reader(f)</code> → <code>next(reader)</code> 로 제목 줄 건너뛰기 → 리스트 컴프리헨션으로 <code>(이름, int(가격), 종류)</code> 튜플 리스트 만들기 → <code>executemany</code>. 통계는 <code>GROUP BY kind</code>.',
            starter: PR_CSVIN_S, solution: PR_CSVIN,
            expect: '가져온 행 : 4\n음료 : 1개, 평균 4500.0원\n차 : 1개, 평균 3500.0원\n커피 : 2개, 평균 3500.0원' },
          { title: '🚀 프로젝트 13-4. 나만의 가계부 (콘솔 프로그램)', level: 3,
            desc: '<p>메뉴를 골라 수입 · 지출을 기록하는 <b>가계부 프로그램</b>을 만드세요. 테이블은 뼈대에 준비되어 있습니다(<code>no</code> 자동 번호, <code>day</code>, <code>kind</code>, <code>item</code>, <code>amount</code>).</p><p><b>요구 사항</b></p><ol><li>메뉴를 반복해서 보여 줍니다 — <code>1 입력  2 목록  3 요약  4 종료 ==&gt; </code></li><li><b>1 입력</b> : 날짜 · 수입/지출 · 내용 · 금액을 입력받아 <code>?</code> 자리표시자로 저장하고, 저장된 번호를 <code>  -&gt; 1 번으로 저장했습니다</code> 처럼 알려 줍니다.<ul><li>금액이 숫자가 아니면 <code>  ! 금액은 숫자로 입력하세요</code> 를 출력하고 저장하지 않습니다.</li><li><code>sqlite3.IntegrityError</code>(예: 수입/지출이 아닌 값)는 <code>rollback</code> 하고 메시지를 보여 줍니다.</li></ul></li><li><b>2 목록</b> : <code>  1번 03-02 지출 점심 9000원</code> 형식으로 번호 순 출력 (없으면 <code>  (기록이 없습니다)</code>)</li><li><b>3 요약</b> : 수입 합계 · 지출 합계 · 남은 돈, 그리고 <b>지출이 큰 항목 상위 3개</b></li><li><b>4 종료</b> : 반복을 빠져나와 연결을 닫고 <code>가계부를 닫았습니다</code> 출력</li></ol><p><b>여기까지 했다면 이렇게 더 해 보세요</b></p><ul><li>“5 삭제” 메뉴를 만들어 번호로 기록을 지우기 (<code>DELETE … WHERE no = ?</code>, <code>cur.rowcount</code> 확인)</li><li>월별 요약 만들기 — <code>GROUP BY substr(day, 1, 2)</code></li><li>CSV 로 내보내기(5교시)나 tkinter 화면 붙이기(6교시)</li></ul>',
            hint: '합계가 없을 때 <code>SUM</code> 은 <code>None</code> 을 돌려주므로 <code>IFNULL(SUM(amount), 0)</code> 을 씁니다. 상위 3개는 <code>GROUP BY item ORDER BY SUM(amount) DESC LIMIT 3</code>. 숫자 검사는 <code>money.isdigit()</code>.',
            starter: PJ_LEDGER_S, solution: PJ_LEDGER,
            stdin: '1\n03-02\n지출\n점심\n9000\n1\n03-02\n수입\n용돈\n50000\n1\n03-03\n지출\n간식\n3000\n1\n03-04\n지출\n버스\n돈\n2\n3\n4\n',
            expect: '1 입력  2 목록  3 요약  4 종료 ==> 1\n날짜(MM-DD) : 03-02\n수입/지출 : 지출\n내용 : 점심\n금액 : 9000\n  -> 1 번으로 저장했습니다\n1 입력  2 목록  3 요약  4 종료 ==> 1\n날짜(MM-DD) : 03-02\n수입/지출 : 수입\n내용 : 용돈\n금액 : 50000\n  -> 2 번으로 저장했습니다\n1 입력  2 목록  3 요약  4 종료 ==> 1\n날짜(MM-DD) : 03-03\n수입/지출 : 지출\n내용 : 간식\n금액 : 3000\n  -> 3 번으로 저장했습니다\n1 입력  2 목록  3 요약  4 종료 ==> 1\n날짜(MM-DD) : 03-04\n수입/지출 : 지출\n내용 : 버스\n금액 : 돈\n  ! 금액은 숫자로 입력하세요\n1 입력  2 목록  3 요약  4 종료 ==> 2\n  1번 03-02 지출 점심 9000원\n  2번 03-02 수입 용돈 50000원\n  3번 03-03 지출 간식 3000원\n1 입력  2 목록  3 요약  4 종료 ==> 3\n  수입 50000원 / 지출 12000원 / 남은 돈 38000원\n  지출이 큰 항목\n   - 점심 9000 원\n   - 간식 3000 원\n1 입력  2 목록  3 요약  4 종료 ==> 4\n가계부를 닫았습니다' }
        ],
        quiz: [
          { q: '파이썬에서 데이터를 입력하는 순서로 옳은 것은?',
            options: ['커서 생성 → 연결 → 입력 → 닫기 → 커밋', '연결 → 커서 생성 → 입력 → 커밋 → 닫기', '연결 → 입력 → 커서 생성 → 닫기 → 커밋', '커밋 → 연결 → 커서 생성 → 입력 → 닫기'], answer: 1,
            explain: 'connect → cursor → execute(CREATE/INSERT) → commit → close 순서입니다.' },
          { q: '데이터베이스에 SQL 문을 실행하고, 실행된 결과를 돌려받는 통로 역할을 하는 것은?',
            options: ['연결자(Connection)', '커서(Cursor)', '테이블(Table)', '트랜잭션(Transaction)'], answer: 1,
            explain: '커서는 <code>con.cursor()</code> 로 만들며 <code>execute()</code>, <code>fetchone()</code> 등을 제공합니다.' },
          { q: '다음 코드를 실행한 뒤 다른 프로그램에서 naverDB 의 userTable 을 조회하면 su 가 보일까요?<pre><code>con = sqlite3.connect("naverDB")\ncur = con.cursor()\ncur.execute("INSERT INTO userTable VALUES(\'su\', \'Su Ji\', \'suji@naver.com\', 1994)")\ncon.close()</code></pre>',
            options: ['보인다', '보이지 않는다 (commit 하지 않음)', '오류가 나서 실행되지 않는다', '두 번 입력된다'], answer: 1,
            explain: 'commit 없이 close 하면 임시로 입력한 내용이 취소됩니다.' },
          { q: 'Code13-01 에서 data1~data4 가 각각 <code>kim</code>, <code>Kim Chi</code>, <code>kim@daum.net</code>, <code>1992</code> 일 때 만들어지는 sql 은?<pre><code>sql = "INSERT INTO userTable VALUES(\'" + data1 + "\',\'" + data2 + "\',\'" + data3 + "\'," + data4 + ")"</code></pre>',
            options: ["INSERT INTO userTable VALUES('kim','Kim Chi','kim@daum.net',1992)", "INSERT INTO userTable VALUES('kim','Kim Chi','kim@daum.net','1992')", 'INSERT INTO userTable VALUES(kim,Kim Chi,kim@daum.net,1992)', "INSERT INTO userTable VALUES('kim' 'Kim Chi' 'kim@daum.net' 1992)"], answer: 0,
            explain: '문자열 세 개는 작은따옴표로 감싸지고, 마지막 출생연도는 따옴표 없이 붙습니다.' },
          { q: '? 자리표시자를 쓴 코드로 올바른 것은?',
            options: ['cur.execute("SELECT * FROM userTable WHERE id = ?", "kim")', 'cur.execute("SELECT * FROM userTable WHERE id = ?", ("kim",))', 'cur.execute("SELECT * FROM userTable WHERE id = \'?\'", ("kim",))', 'cur.execute("SELECT * FROM userTable WHERE id = ?" % "kim")'], answer: 1,
            explain: '값은 튜플로 넘깁니다. 값이 하나면 <code>("kim",)</code> 처럼 쉼표가 필요합니다. ? 를 따옴표로 감싸면 안 됩니다.' },
          { q: '다음 코드에서 <b>영희 쪽 UPDATE 가 실패</b>했을 때 철수의 잔액은?<pre><code>try :\n    cur.execute("UPDATE account SET money = money - 8000 WHERE name = \'철수\'")\n    cur.execute("UPDATE account SET money = money - 8000 WHERE name = \'영희\'")\n    con.commit()\nexcept sqlite3.IntegrityError :\n    con.rollback()</code></pre>',
            options: ['8000원이 빠진 채로 남는다', 'rollback 으로 원래 금액으로 돌아간다', '오류가 나서 프로그램이 멈춘다', '두 사람 모두 0원이 된다'], answer: 1,
            explain: '<code>rollback()</code> 은 마지막 commit 이후의 <b>모든 변경</b>을 취소합니다. 그래서 먼저 성공했던 철수의 UPDATE 도 함께 되돌아갑니다(트랜잭션의 원자성).' }
        ],
        slides: [
          { layout: 'title', title: '파이썬에서 데이터 입력하기', subtitle: 'Chapter 13 · Section 04 — 데이터의 입력과 조회 (1)', badge: '13-4',
            notes: '<p>명령행 도구로 하던 일을 이제 파이썬 프로그램이 한다고 소개합니다. 구축 과정의 3단계(응용 프로그램에서 활용)입니다. (1분)</p>' },
          { layout: 'diagram', title: '그림 13-7 데이터 입력 순서', html: F_FLOW_IN,
            notes: '<p>6단계를 소리 내어 함께 읽습니다: 연결 → 커서 → (테이블) → 입력(반복) → 커밋 → 닫기. 이 순서가 이번 장 모든 코드의 뼈대입니다.</p><p>시간: 3분</p>' },
          { layout: 'bullets', title: '❶ 연결과 ❷ 커서', lead: 'con = sqlite3.connect("naverDB") · cur = con.cursor()',
            bullets: ['<code>import sqlite3</code> 후 <code>connect("DB 이름")</code>', '강의자료 경로 <code>C:/CookPython/naverDB</code> → 작업 폴더 <code>naverDB</code>', '<b>커서</b>: SQL 문을 실행하고 결과를 돌려받는 통로', '두 줄 모두 출력 없음'],
            notes: '<p>연결자 = 도로, 커서 = 배달원 비유를 씁니다. 다음 그림으로 이어 갑니다.</p><p>시간: 3분</p>' },
          { layout: 'diagram', title: '연결자와 커서', html: F_CURSOR,
            notes: '<p>execute 로 SQL 을 가져가고, fetchone/fetchall 로 결과를 가져온다는 두 방향 화살표를 짚어 줍니다.</p><p>시간: 2분</p>' },
          { layout: 'code', title: '❸ ~ ❻ 셸에서 한 줄씩', code: C_REPL, repl: true,
            points: ['execute 는 커서 객체를 돌려줌', '셸에서는 <code>&lt;sqlite3.Cursor object at …&gt;</code> 표시', '<code>fetchall()</code> 로 조회 결과 확인', '스크립트에서는 출력 없음'],
            notes: '<p>강의자료의 “출력 결과: &lt;sqlite3.Cursor object at 개체번호&gt;” 는 셸에서 실행했을 때의 모습입니다. 직접 실행해 보여 주세요.</p><p>시간: 4분</p>' },
          { layout: 'diagram', title: '❺ 커밋(commit)', html: F_COMMIT,
            notes: '<p>INSERT 는 임시 공간에, commit 해야 파일에. commit 없이 닫으면 버려진다는 것을 강조합니다.</p><p>시간: 3분</p>' },
          { layout: 'code', title: 'commit() 을 빠뜨리면?', code: C_NOCOMMIT.split('\n').slice(0, 14).join('\n'),
            points: ['commit 없이 close → 입력 취소', '다시 열어 COUNT(*) → 0', '“입력했는데 없어요!” 의 주범'],
            notes: '<p>실행 결과 0 을 보여 주고, con.close() 앞에 con.commit() 을 넣어 다시 실행하면 1 이 되는 것을 시연합니다.</p><p>시간: 4분</p>' },
          { layout: 'code', title: 'Code13-01. 데이터 입력 프로그램', code: C_13_01_SHORT, stdin: 'su\nSu Ji\nsuji@naver.com\n1994\n\n',
            points: ['ID 가 빈 문자열이면 break', '입력값을 이어 붙여 INSERT 문 생성', '반복이 끝나면 commit · close', '웹 강좌: CREATE IF NOT EXISTS 추가'],
            notes: '<p>변수 선언 부분을 생략한 슬라이드용 버전입니다. 예시 입력(su)으로 실행해 보고, 학생에게 자기 정보를 입력하게 합니다. 입력한 데이터는 다음 교시 조회 프로그램으로 확인합니다.</p><p>시간: 7분</p>' },
          { layout: 'diagram', title: 'SQL 문자열 만들기', html: F_CONCAT,
            notes: '<p>따옴표 짝 맞추기가 가장 헷갈리는 부분입니다. 큰따옴표(파이썬 문자열) 안에 작은따옴표(SQL 문자열)가 들어 있음을 색으로 구분해 설명합니다.</p><p>시간: 4분</p>' },
          { layout: 'code', title: 'SQL 인젝션을 직접 해 보기', code: SL4_INJECT,
            points: ["비밀번호 칸에 <code>' OR '1'='1</code> 입력", '조건이 항상 참 → 회원 전체가 조회', "만들어진 SQL 을 눈으로 확인", '<code>?</code> 로 넘기면 그냥 “값” 일 뿐'],
            notes: '<p>출력된 SQL 문을 함께 읽으며 따옴표가 어떻게 깨지는지 짚어 줍니다. 실제 해킹 사고의 단골 원인이라는 점, 그래서 실무에서는 예외 없이 ? 를 쓴다는 점을 강조합니다.</p><p>시간: 6분</p>' },
          { layout: 'code', title: '트랜잭션 — 계좌 이체와 rollback', code: SL4_TRANS,
            points: ['둘 다 성공해야 하는 작업 = 트랜잭션', '중간에 실패 → <code>rollback()</code> 으로 전부 취소', '<code>with con :</code> 은 자동 commit · rollback', 'commit 한 뒤에는 되돌릴 수 없다'],
            notes: '<p>“철수 돈만 사라지면?” 이라고 물어보고 실행 결과로 확인합니다. CHECK 제약이 실패를 만들어 준다는 점도 2교시와 연결해 설명하세요.</p><p>시간: 6분</p>' },
          { layout: 'code', title: 'CSV 파일을 DB 로 가져오기', code: SL4_CSV,
            points: ['<code>csv.reader</code> + <code>next()</code> 로 제목 줄 건너뛰기', '<code>executemany</code> 로 한 번에 입력', '숫자 열은 <code>int()</code> 로 변환', '엑셀 자료를 옮기는 실무의 기본기'],
            notes: '<p>11장의 파일 입출력과 이번 장을 잇는 슬라이드입니다. CSV 의 모든 값이 문자열로 읽힌다는 점을 꼭 짚어 주세요.</p><p>시간: 5분</p>' },
          { layout: 'quiz', title: '확인 문제', q: 'Code13-01 에서 반복을 끝내려면?',
            options: ['출생연도에 0 입력', '사용자ID 에 아무것도 입력하지 않고 Enter', 'Ctrl+C', 'quit 입력'], answer: 1,
            explain: '<code>if data1 == "" : break</code> 이므로 ID 를 비워 두면 끝납니다.',
            notes: '<p>(1분)</p>' },
          { layout: 'practice', title: 'SELF STUDY 13-2. 제품 데이터 입력', desc: '<p>Code13-01 을 수정해 productTable(제품코드, 제품명, 가격, 재고수량)에 입력되게 하세요.</p>', starter: PR_SS2_S, solution: PR_SS2, stdin: 'p0004\n모니터\n25\n7\n\n',
            notes: '<p>힌트: 11행에 CREATE TABLE 문. 가격 · 수량은 숫자라 따옴표 없이. 따옴표 짝을 맞추는 데서 많이 막히니 순회하며 도와줍니다.</p><p>시간: 10분</p>' },
          { layout: 'practice', title: '🚀 프로젝트 13-4. 나만의 가계부', desc: '<p>메뉴(1 입력 / 2 목록 / 3 요약 / 4 종료)를 반복하는 가계부 프로그램을 만드세요. ? 자리표시자 · 자동 번호 · 예외 처리 · 집계를 모두 씁니다.</p>', starter: PJ_LEDGER_S, solution: PJ_LEDGER, stdin: '1\n03-02\n지출\n점심\n9000\n1\n03-02\n수입\n용돈\n50000\n2\n3\n4\n',
            notes: '<p>교사 화면에서 정답을 “예시 입력으로 실행” 해 전체 흐름을 먼저 보여 준 뒤 과제로 냅니다. 메뉴 반복(while True)과 함수 나누기가 핵심입니다.</p><p>시간: 남는 시간 또는 과제</p>' },
          { layout: 'summary', title: '정리', bullets: ['입력 6단계: 연결 → 커서 → 테이블 → 입력 → 커밋 → 닫기', '값은 항상 <code>?</code> 로 — SQL 인젝션 방지', '<code>executemany</code> 로 여러 건, commit 은 한 번에', '트랜잭션: commit / rollback / <code>with con :</code>', 'CSV → DB 가져오기, 자동 번호와 <code>lastrowid</code>'],
            notes: '<p>다음 시간: 입력한 데이터를 파이썬에서 조회(fetchone)합니다. (1분)</p>' }
        ]
      },

      /* ============================================================ 13-5 */
      {
        id: 'ch13-5',
        title: '파이썬에서 데이터 조회하기',
        minutes: 50,
        goals: [
          '파이썬에서 데이터를 조회하는 5단계를 설명할 수 있다',
          'fetchone() 으로 한 행씩 꺼내 None 이 나오면 반복을 끝내는 조회 프로그램(Code13-02)을 만들 수 있다',
          'fetchall() 이 돌려주는 rows 의 저장 형태(튜플의 리스트)를 이해한다',
          '서식 문자열로 조회 결과를 정렬해 출력할 수 있다'
        ],
        flow: [['조회 코딩 순서', 5], ['Code13-02 조회 프로그램', 15], ['fetchone · fetchall · rows', 12], ['SELF STUDY 13-3', 10], ['정리 · 퀴즈', 8]],
        content: [
          { type: 'h', text: '파이썬에서 데이터를 조회하는 코딩 순서' },
          { type: 'p', html: '조회도 연결과 커서 생성까지는 입력과 같습니다. 그다음 <code>SELECT</code> 문을 실행하고, 결과를 <code>fetchone()</code> 으로 <b>한 행씩</b> 꺼내 출력하는 것을 반복합니다. 조회는 데이터를 바꾸지 않으므로 <b>commit 이 필요 없습니다</b>.' },
          { type: 'figure', html: F_FLOW_OUT, caption: '그림 13-8 SQLite 의 데이터 조회 순서' },

          { type: 'h', text: '데이터 조회 프로그램의 구현 (Code13-02)' },
          { type: 'code', title: 'Code13-02. 데이터 조회 프로그램', code: C_13_02,
            expect: '사용자ID    사용자이름    이메일            출생연도\n----------------------------------------------------\n john         John Bann    john@naver.com   1990\n  kim           Kim Chi      kim@daum.net   1992\n  lee           Lee Pal     lee@paran.com   1988\n park           Park Su    park@gmail.com   1980\n   su             Su Ji    suji@naver.com   1994',
            desc: '<code>12~20행</code>은 웹 강좌용 준비 코드입니다. 테이블이 비어 있으면(이 예제를 처음 실행하면) 강의자료와 같은 5명을 넣어 둡니다. 앞 교시 Code13-01 로 입력한 데이터가 있다면 그 데이터도 함께 조회됩니다. <code>28~31행</code>: <code>fetchone()</code> 은 결과에서 다음 한 행을 튜플로 돌려주고, 더 없으면 <code>None</code> 을 돌려주므로 그때 break 합니다. <code>36행</code>: <code>%5s</code> 는 5칸 <b>오른쪽</b> 정렬 문자열, <code>%d</code> 는 정수입니다.' },
          { type: 'figure', html: F_FETCH, caption: 'fetchone() 을 부를 때마다 커서가 한 행씩 내려가고, 끝나면 None' },
          { type: 'code', title: '추가 예제. fetchone() 과 fetchall() 섞어 쓰기', code: C_FETCHSTEP,
            expect: "('john',)\n('kim',)\n[('lee',), ('park',), ('su',)]\nNone",
            desc: '<code>fetchone()</code> 두 번으로 앞의 두 행을 꺼낸 뒤 <code>fetchall()</code> 을 부르면 <b>남은</b> 행만 리스트로 돌아옵니다. 열이 하나뿐이어도 행은 튜플이라 <code>(\'john\',)</code> 처럼 쉼표가 붙습니다.' },
          { type: 'callout', kind: 'tip', title: '출력이 강의자료와 조금 달라요', html: '강의자료의 출력 결과는 왼쪽 정렬처럼 보이지만, <code>%5s</code> · <code>%15s</code> 는 실제로 <b>오른쪽 정렬</b>입니다. 왼쪽 정렬로 바꾸려면 <code>%-5s</code> · <code>%-15s</code> 처럼 <code>-</code> 를 붙이거나, 아래의 f-string 방법을 쓰세요.' },

          { type: 'h', text: 'rows 저장 형태 — fetchall()' },
          { type: 'p', html: '<code>fetchall()</code> 은 남은 모든 행을 한 번에 꺼내 <b>리스트</b>로 돌려줍니다. 리스트의 각 항목은 한 행을 나타내는 <b>튜플</b>입니다. 이 결과를 보통 <code>rows</code> 라는 변수에 저장합니다.' },
          { type: 'code', run: false, title: 'rows 저장 형태', code: "[('john', 'John Bann', 'john@naver.com', 1990), ('kim', 'Kim Chi', 'kim@daum.net', 1992), …]" },
          { type: 'figure', html: F_ROWS, caption: 'rows[행번호][열번호] 로 원하는 데이터를 꺼낸다' },
          { type: 'code', title: '추가 예제. rows 살펴보기', code: C_ROWS,
            expect: "<class 'list'> 5\n[('john', 'John Bann', 'john@naver.com', 1990), ('kim', 'Kim Chi', 'kim@daum.net', 1992), ('lee', 'Lee Pal', 'lee@paran.com', 1988), ('park', 'Park Su', 'park@gmail.com', 1980), ('su', 'Su Ji', 'suji@naver.com', 1994)]\n('john', 'John Bann', 'john@naver.com', 1990) <class 'tuple'>\nJohn Bann 1980",
            desc: '<code>rows[0]</code> 은 첫 행(튜플), <code>rows[0][1]</code> 은 첫 행의 두 번째 열(userName)입니다. 7장에서 배운 리스트 · 튜플 인덱싱이 그대로 쓰입니다.' },
          { type: 'callout', kind: 'more', title: '📘 fetchone() 과 fetchall(), 언제 무엇을?', html: '<ul><li><b>fetchone()</b>: 한 행씩. 결과가 아주 많을 때(수백만 행) 메모리를 아낄 수 있고, “한 명만 찾기” 처럼 결과가 1행일 때 편합니다.</li><li><b>fetchall()</b>: 모든 행을 리스트로. 결과가 적당할 때 for 문으로 다루기 편합니다.</li><li><b>fetchmany(n)</b>: n 행씩 끊어서.</li><li>커서 자체를 for 문에 넣을 수도 있습니다: <code>for row in cur.execute("SELECT …"):</code></li></ul>' },
          { type: 'code', title: '추가 예제. for 문과 f-string 으로 보기 좋게 출력', code: C_FSTRING,
            expect: '사용자ID    사용자이름     이메일            출생연도\n----------------------------------------------------\njohn      John Bann      john@naver.com    1990\nkim       Kim Chi        kim@daum.net      1992\nlee       Lee Pal        lee@paran.com     1988\npark      Park Su        park@gmail.com    1980\nsu        Su Ji          suji@naver.com    1994',
            desc: '<code>for uid, name, email, year in …</code> 처럼 튜플을 네 변수로 바로 풀면 <code>row[0]</code> 같은 번호 대신 이름으로 쓸 수 있어 읽기 쉽습니다. <code>{값:&lt;10}</code> 은 10칸 왼쪽 정렬입니다. (<code>id</code> 는 파이썬 내장 함수 이름이라 변수 이름으로 <code>uid</code> 를 썼습니다.)' },

          { type: 'h', text: '조건을 입력받아 조회하기' },
          { type: 'code', title: '추가 예제. 출생연도로 회원 검색', code: C_SEARCH, stdin: '1990\n',
            expect: '몇 년 이후 출생자를 찾을까요? 1990\njohn / John Bann / 1990\nkim / Kim Chi / 1992\nsu / Su Ji / 1994\n검색 결과 : 3 명',
            desc: '사용자가 입력한 값을 WHERE 조건에 넣을 때도 <code>?</code> 자리표시자를 씁니다. <code>(year,)</code> 는 값이 하나인 튜플입니다.' },
          { type: 'code', title: '추가 예제. 열 이름으로 꺼내기 — sqlite3.Row', code: C_ROWFACTORY,
            expect: 'lee → lee@paran.com\npark → park@gmail.com',
            desc: '<code>con.row_factory = sqlite3.Row</code> 로 설정하면 행을 <code>row["email"]</code> 처럼 열 이름으로 꺼낼 수 있습니다. 열이 많을 때 번호를 헷갈리지 않아 편리합니다.' },

          { type: 'h', text: '한 걸음 더 — 결과를 꺼내는 여러 방법' },
          { type: 'code', title: '추가 예제. fetchmany() 와 커서 반복', code: X5_FETCHMANY,
            expect: '3개씩 : [(1,), (2,), (3,)] [(4,), (5,), (6,)]\n커서를 직접 반복 : 8 9 10\n한 값만 : 10',
            desc: '<code>fetchmany(n)</code> 은 n 행씩 끊어서 가져옵니다. <code>for row in cur.execute(…)</code> 처럼 <b>커서를 바로 반복</b>하면 <code>fetchall()</code> 없이 한 행씩 처리되어 메모리를 아낄 수 있습니다. 값이 하나뿐인 결과는 <code>fetchone()[0]</code> 이 편합니다.' },
          { type: 'code', title: '추가 예제. sqlite3.Row 로 열 이름 · 딕셔너리 만들기', code: X5_ROWD,
            expect: "번호로 : Kim Chi\n이름으로 : Kim Chi 부산\n열 이름 목록 : ['id', 'userName', 'city']\n딕셔너리로 : {'id': 'kim', 'userName': 'Kim Chi', 'city': '부산'}",
            desc: '<code>sqlite3.Row</code> 로 꺼낸 행은 번호(<code>row[1]</code>)와 이름(<code>row["userName"]</code>) 둘 다 됩니다. <code>dict(row)</code> 로 바꾸면 JSON 으로 저장하거나 웹 응답으로 보내기 좋습니다. <b>열 순서가 바뀌어도 코드가 깨지지 않는다</b>는 것이 가장 큰 장점입니다.' },

          { type: 'h', text: '두 테이블을 합쳐서 보기 — JOIN' },
          { type: 'p', html: '1교시에서 “회원 표” 와 “주문 표” 를 나누었습니다. 이제 <b>“누가 무엇을 주문했는지”</b> 를 한 번에 보려면 두 표를 <mark>공통된 열로 이어 붙여야</mark> 합니다. 이것이 <b>조인(JOIN)</b> 입니다.' },
          { type: 'figure', html: F_JOIN, caption: 'INNER JOIN — 양쪽 표에서 id 가 같은 행끼리 짝을 지어 한 행으로 만든다' },
          { type: 'code', run: false, title: 'JOIN 문의 형식', code: 'SELECT 열목록\n  FROM 표A JOIN 표B ON 표A.공통열 = 표B.공통열\n WHERE 조건;' },
          { type: 'code', title: '추가 예제. INNER JOIN · 별칭 · GROUP BY · LEFT JOIN', code: X5_JOIN,
            expect: "① 내부 조인 : 주문한 회원의 이름과 제품\n    ('John Bann', '노트북', 1100)\n    ('John Bann', '마우스', 30)\n    ('Kim Chi', '키보드', 20)\n② 표 이름에 별명을 붙이면 짧아진다\n    ('John Bann', '노트북')\n    ('John Bann', '마우스')\n③ 조인 + GROUP BY : 회원별 주문 건수와 금액 합계\n    ('John Bann', 2, 1130)\n    ('Kim Chi', 1, 20)\n④ LEFT JOIN : 주문이 없는 회원도 보여 준다\n    ('John Bann', '노트북')\n    ('John Bann', '마우스')\n    ('Kim Chi', '키보드')\n    ('Lee Pal', None)",
            desc: '<ul><li>열 이름이 양쪽에 다 있을 수 있으므로 <code>표이름.열이름</code> 으로 적습니다. <code>FROM memberTable m</code> 처럼 <b>별칭</b>을 주면 <code>m.userName</code> 으로 짧게 쓸 수 있습니다.</li><li><code>INNER JOIN</code>(그냥 <code>JOIN</code>)은 <b>양쪽에 짝이 있는 행만</b> 남깁니다 — 주문이 없는 Lee Pal 은 빠졌습니다.</li><li><code>LEFT JOIN</code> 은 왼쪽 표의 행을 모두 남기고, 짝이 없으면 오른쪽 열을 <code>None</code>(NULL)으로 채웁니다.</li><li>조인 결과에도 <code>WHERE</code> · <code>GROUP BY</code> · <code>ORDER BY</code> 를 그대로 쓸 수 있습니다.</li></ul>' },
          { type: 'table', head: ['조인', '남는 행', '언제 쓰나'], rows: [
            ['<code>INNER JOIN</code>', '양쪽에 짝이 있는 행만', '“주문한 회원의 목록” 처럼 짝이 있는 것만 볼 때'],
            ['<code>LEFT JOIN</code>', '왼쪽 표는 모두 + 짝이 있으면 붙임', '“주문이 없는 회원까지” 보고 싶을 때'],
            ['조인 없이 따로 조회', '두 번 조회해 파이썬에서 합치기', '표가 아주 단순하거나 조인이 부담스러울 때']
          ] },
          { type: 'callout', kind: 'more', title: '📘 서브쿼리 — 조회 결과를 다시 조건으로', html: '괄호 안에 <code>SELECT</code> 를 넣어 <b>조회 결과를 값처럼</b> 쓸 수 있습니다. <code>WHERE price &gt; (SELECT AVG(price) FROM orderTable)</code> 처럼요. “평균보다 비싼 것”, “한 번도 주문하지 않은 회원” 같은 질문에 유용합니다.' },
          { type: 'code', title: '추가 예제. 서브쿼리', code: X5_SUB,
            expect: "평균보다 비싼 주문 : [('노트북', 1100)]\n주문한 적이 있는 회원 : [('John Bann',), ('Kim Chi',)]\n주문한 적이 없는 회원 : [('Lee Pal',)]",
            desc: '<code>IN (SELECT …)</code> 은 “그 목록 안에 있으면”, <code>NOT IN (SELECT …)</code> 은 “목록에 없으면” 입니다. 서브쿼리 안의 열이 NULL 을 포함하면 <code>NOT IN</code> 결과가 비어 버릴 수 있으니 주의하세요.' },

          { type: 'h', text: '조회 결과를 CSV 파일로 내보내기' },
          { type: 'p', html: '조회 결과를 엑셀에서 열어 보거나 다른 사람에게 보낼 때는 <b>CSV</b> 로 내보냅니다. 열 이름은 <code>cur.description</code> 에서 얻습니다.' },
          { type: 'code', title: '추가 예제. DB → CSV 내보내기', code: X5_CSVOUT,
            expect: '--- order_backup.csv ---\norderId,id,product,price\n1,john,노트북,1100\n2,john,마우스,30\n3,kim,키보드,20',
            desc: '<code>csv.writer</code> 의 <code>writerow(제목)</code> + <code>writerows(행들)</code> 로 한 번에 씁니다. <code>newline=""</code> 를 빼먹으면 윈도에서 빈 줄이 하나씩 끼어듭니다. 한글이 깨지지 않게 <code>encoding="utf-8"</code> 을 지정합니다(엑셀에서 열 때 깨지면 <code>utf-8-sig</code> 를 써 보세요).' },

          { type: 'h', text: '조회할 때 만나는 오류 메시지 읽기' },
          { type: 'code', title: '추가 예제. 흔한 SQL 오류 네 가지', code: X5_ERRORS,
            expect: 'OperationalError : no such table: userTabel\nOperationalError : no such column: name\nOperationalError : no such column: john\nOperationalError : near "SELCT": syntax error',
            desc: '<ul><li><code>no such table: …</code> — 테이블 이름 오타이거나, 아직 만들지 않았거나, <b>다른 DB 파일</b>에 연결했습니다.</li><li><code>no such column: …</code> — 열 이름 오타. <b>값에 작은따옴표를 빠뜨렸을 때</b>도 이 오류가 납니다(값을 열 이름으로 착각).</li><li><code>near "…": syntax error</code> — SQL 문법이 틀렸습니다. 따옴표 · 괄호 · 쉼표를 확인하세요. <code>near</code> 뒤의 단어 <b>바로 앞</b>에 문제가 있는 경우가 많습니다.</li></ul><p>모든 sqlite3 오류의 부모는 <code>sqlite3.Error</code> 이므로 <code>except sqlite3.Error</code> 로 한꺼번에 잡을 수 있습니다.</p>' }
        ],
        practice: [
          { title: 'SELF STUDY 13-3. 제품 목록 조회 프로그램', level: 2,
            desc: '<p>Code13-02 를 수정해서 SELF STUDY 13-2 에서 입력한 <code>productTable</code> 의 내용이 출력되도록 해 보세요. (뼈대의 준비 코드가 테이블이 비어 있으면 p0001~p0003 을 넣어 둡니다.)</p>',
            hint: '테이블 이름을 productTable 로 바꾸고, 가격 · 재고수량은 정수이므로 <code>%d</code> 로 출력합니다.',
            starter: PR_SS3_S, solution: PR_SS3,
            expect: '제품코드    제품명      가격      재고수량\n----------------------------------------------\np0001     노트북     110       5\np0002     마우스       3      22\np0003     키보드       2      11' },
          { title: '실습 13-5-2. 열 이름으로 꺼내기 (sqlite3.Row)', level: 1,
            desc: '<p>뼈대의 <code>shopDB</code> 에서 <code>con.row_factory = sqlite3.Row</code> 를 설정한 뒤 회원 전체를 <code>이름(아이디) - 도시</code> 형식으로 출력하세요. 마지막에 <code>lee</code> 회원 한 명을 꺼내 <b>열 이름 목록</b>과 <b>딕셔너리</b>로 출력합니다.</p>',
            hint: '<code>row_factory</code> 를 설정한 <b>뒤에</b> 커서를 새로 만들어야 합니다(<code>cur = con.cursor()</code>). 열 이름 목록은 <code>row.keys()</code>, 딕셔너리는 <code>dict(row)</code>.',
            starter: PR_ROWF_S, solution: PR_ROWF,
            expect: "John Bann(john) - 서울\nKim Chi(kim) - 부산\nLee Pal(lee) - 서울\n열 이름 : ['id', 'userName', 'city']\n딕셔너리 : {'id': 'lee', 'userName': 'Lee Pal', 'city': '서울'}" },
          { title: '실습 13-5-3. 두 테이블을 조인해 주문 내역 보기', level: 1,
            desc: '<p><code>memberTable</code> 과 <code>orderTable</code> 을 <code>id</code> 로 조인해 ① 주문 내역을 <code>John Bann - 노트북 (1100원)</code> 형식으로, ② 회원별 주문 금액 합계를 <code>John Bann : 1130원</code> 형식으로 출력하세요.</p>',
            hint: '<code>FROM memberTable m JOIN orderTable o ON m.id = o.id</code> 로 시작하고, 합계는 <code>SUM(o.price)</code> 와 <code>GROUP BY m.id</code> 를 씁니다.',
            starter: PR_JOIN_S, solution: PR_JOIN,
            expect: '주문 내역 (회원 이름과 함께)\n  John Bann - 노트북 (1100원)\n  John Bann - 마우스 (30원)\n  Kim Chi - 키보드 (20원)\n회원별 주문 금액 합계\n  John Bann : 1130원\n  Kim Chi : 20원' },
          { title: '실습 13-5-4. 회원 한 명 찾기', level: 2,
            desc: '<p>사용자 ID 를 입력받아 해당 회원의 이름 · 이메일 · 출생연도를 출력하고, 없으면 “없는 사용자입니다” 를 출력하세요.</p>',
            hint: '<code>cur.execute("SELECT * FROM userTable WHERE id = ?", (uid,))</code> 후 <code>fetchone()</code> 결과가 <code>None</code> 인지 검사합니다.',
            starter: PR_FIND_S, solution: PR_FIND, stdin: 'lee\n',
            expect: '찾을 사용자ID ==> lee\n이름 : Lee Pal\n이메일 : lee@paran.com\n출생연도 : 1988' },
          { title: '실습 13-5-5. 조회 결과를 CSV 로 내보내기', level: 2,
            desc: '<p>조인한 주문 내역(<code>회원이름</code>, <code>제품</code>, <code>가격</code>)을 <code>order_report.csv</code> 파일로 내보내세요.</p><ul><li>첫 줄에는 <b>열 이름</b>을 씁니다(<code>cur.description</code> 사용).</li><li>내보낸 행 수를 출력하고, 파일을 다시 읽어 내용을 그대로 출력해 확인합니다.</li></ul><p>▶ 실행 뒤 📁 작업 폴더에서 <code>order_report.csv</code> 를 확인해 보세요.</p>',
            hint: '<code>open(…, "w", encoding="utf-8", newline="")</code> 로 열고 <code>csv.writer</code> 의 <code>writerow(heads)</code> → <code>writerows(rows)</code> 순서로 씁니다.',
            starter: PR_CSVOUT_S, solution: PR_CSVOUT,
            expect: '내보낸 행 : 3\nuserName,product,price\nJohn Bann,노트북,1100\nJohn Bann,마우스,30\nKim Chi,키보드,20' },
          { title: '🚀 프로젝트 13-5. 도서 대출 조회 리포트', level: 3,
            desc: '<p>🚀 프로젝트 13-2 에서 설계한 도서관 DB(책 4권 · 회원 3명 · 대출 4건)로 <b>조회 리포트</b>를 만드세요. 데이터는 뼈대에 준비되어 있습니다.</p><p><b>요구 사항 — 모두 JOIN · GROUP BY · 서브쿼리로</b></p><ol><li><b>대출 중인 책</b>(<code>back = \'N\'</code>) : <code>제목 - 회원이름 (03-05 대출)</code> 형식 — 세 테이블 조인</li><li><b>회원별 대출 횟수</b> : 많은 순 (<code>김철수 : 2권</code>)</li><li><b>인기 있는 책</b> : 2회 이상 대출된 책 (<code>GROUP BY</code> + <code>HAVING</code>)</li><li><b>한 번도 빌려 가지 않은 책</b> (<code>NOT IN</code> 서브쿼리)</li><li>전체 대출 기록을 <code>loan_report.csv</code> 로 내보내고 “몇 행을 내보냈는지” 출력</li></ol><p><b>여기까지 했다면 이렇게 더 해 보세요</b></p><ul><li>대출 중인 책을 반납 처리하는 함수 만들기 (<code>UPDATE … SET back = \'Y\' WHERE loanId = ?</code>)</li><li>회원 이름을 입력받아 그 사람의 대출 목록만 보여 주기 (<code>?</code> 자리표시자 + <code>LIKE</code>)</li><li>tkinter 창에 표로 보여 주기 (6교시)</li></ul>',
            hint: '세 테이블 조인은 <code>FROM loanTable l JOIN bookTable b ON l.bookId = b.bookId JOIN memberTable m ON l.memberId = m.memberId</code> 처럼 <code>JOIN … ON …</code> 을 이어서 씁니다. 정렬 기준이 같을 때 순서가 흔들리지 않게 <code>ORDER BY COUNT(*) DESC, m.memberId</code> 처럼 두 번째 기준도 적어 주세요.',
            starter: PJ_LOAN_S, solution: PJ_LOAN,
            expect: '===== 대출 중인 책 =====\n데이터베이스 첫걸음 - 김철수 (03-05 대출)\n알고리즘 산책 - 이영희 (03-07 대출)\n파이썬 입문 - 이영희 (03-10 대출)\n===== 회원별 대출 횟수 =====\n김철수 : 2권\n이영희 : 2권\n===== 인기 있는 책 (대출 2회 이상) =====\n파이썬 입문 : 2회\n===== 한 번도 빌려 가지 않은 책 =====\n웹 프로그래밍\nloan_report.csv 로 4 행을 내보냈습니다' }
        ],
        quiz: [
          { q: '조회 결과에 더 이상 꺼낼 행이 없을 때 <code>cur.fetchone()</code> 이 돌려주는 값은?',
            options: ['0', '빈 튜플 ()', 'None', '오류 발생'], answer: 2,
            explain: 'fetchone() 은 행이 없으면 None 을 돌려줍니다. 그래서 <code>if row == None : break</code> 로 반복을 끝냅니다.' },
          { q: '<code>rows = cur.fetchall()</code> 에서 rows 의 자료형은?',
            options: ['튜플의 리스트', '리스트의 튜플', '딕셔너리', '문자열'], answer: 0,
            explain: '리스트 안에 행마다 튜플이 들어 있습니다: <code>[(…), (…), …]</code>' },
          { q: '다음 코드의 출력은? (userTable 에 john 1990, kim 1992 두 행만 있음)<pre><code>cur.execute("SELECT id, birthYear FROM userTable")\nrows = cur.fetchall()\nprint(rows[1][1])</code></pre>',
            options: ['john', 'kim', '1990', '1992'], answer: 3,
            explain: 'rows[1] 은 두 번째 행 (\'kim\', 1992), 그 [1] 은 1992 입니다.' },
          { q: '데이터를 <b>조회만</b> 하는 프로그램에서 생략해도 되는 것은?',
            options: ['sqlite3.connect()', 'con.cursor()', 'cur.execute("SELECT …")', 'con.commit()'], answer: 3,
            explain: '조회는 데이터를 바꾸지 않으므로 commit 이 필요 없습니다(강의자료 그림 13-8 에도 커밋 단계가 없음).' },
          { q: '<code>print("%5s|" % "kim")</code> 의 출력은?',
            options: ['kim|', '  kim|', 'kim  |', '%5s|kim'], answer: 1,
            explain: '%5s 는 5칸에 오른쪽 정렬이라 앞에 공백 2칸이 붙습니다. 왼쪽 정렬은 %-5s 입니다.' },
          { q: '회원 3명 중 <b>주문이 있는 사람은 2명</b>일 때, 다음 두 조회의 행 수는?<pre><code>A: SELECT * FROM member m JOIN orderT o ON m.id = o.id\nB: SELECT * FROM member m LEFT JOIN orderT o ON m.id = o.id</code></pre>(주문은 모두 3건)',
            options: ['A 3행, B 4행', 'A 3행, B 3행', 'A 4행, B 4행', 'A 2행, B 3행'], answer: 0,
            explain: 'INNER JOIN 은 짝이 있는 주문 3건만 남기고, LEFT JOIN 은 주문이 없는 회원 1명을 <code>None</code> 과 함께 한 행 더 붙여 4행이 됩니다.' }
        ],
        slides: [
          { layout: 'title', title: '파이썬에서 데이터 조회하기', subtitle: 'Chapter 13 · Section 04 — 데이터의 입력과 조회 (2)', badge: '13-5',
            notes: '<p>지난 시간 입력한 데이터를 이번에는 파이썬으로 꺼내 봅니다. 입력 6단계를 먼저 복습합니다. (2분)</p>' },
          { layout: 'diagram', title: '그림 13-8 데이터 조회 순서', html: F_FLOW_OUT,
            notes: '<p>입력 순서와 비교: 테이블 만들기 · 커밋이 없고, ❸ SELECT → ❹ fetchone 반복이 생겼습니다. 조회는 데이터를 바꾸지 않아 commit 이 필요 없다고 설명합니다.</p><p>시간: 3분</p>' },
          { layout: 'code', title: 'Code13-02. 데이터 조회 프로그램', code: C_13_02_SHORT,
            points: ['<code>fetchone()</code> : 한 행(튜플)씩', '없으면 <code>None</code> → break', '<code>row[0]</code> ~ <code>row[3]</code> : 각 열', '<code>%5s</code> 오른쪽 정렬, <code>%d</code> 정수'],
            notes: '<p>슬라이드용으로 변수 선언 부분을 줄인 버전입니다. 본문 버전은 테이블이 비어 있으면 예시 5명을 넣어 두는 준비 코드가 있습니다. 앞 시간에 입력한 데이터가 보이는지 확인합니다.</p><p>시간: 7분</p>' },
          { layout: 'diagram', title: 'fetchone() 의 동작', html: F_FETCH,
            notes: '<p>책갈피처럼 커서 위치가 한 행씩 내려간다고 설명합니다. 끝을 지나면 None.</p><p>시간: 3분</p>' },
          { layout: 'code', title: 'fetchone() 과 fetchall()', code: C_FETCHSTEP.replace(PREP, `${U_CREATE_IF}\ncur.execute("DELETE FROM userTable")\n${U_INS.join('\n')}\n${U_SU}\ncon.commit()`),
            points: ['fetchone 두 번 → 앞의 두 행', 'fetchall → <b>남은</b> 행 리스트', '그다음 fetchone → None', '열이 하나여도 행은 튜플'],
            notes: '<p>결과를 예측하게 한 뒤 실행합니다. fetchall 이 “처음부터 전부” 가 아니라 “남은 것 전부” 라는 점이 포인트입니다. (슬라이드 코드는 표를 5명으로 다시 채우고 시작합니다.)</p><p>시간: 4분</p>' },
          { layout: 'diagram', title: 'rows 저장 형태', html: F_ROWS,
            notes: '<p>[(…), (…), …] — 튜플의 리스트. rows[0][1] 을 짚으며 2차원 인덱싱을 복습합니다.</p><p>시간: 3분</p>' },
          { layout: 'code', title: 'for 문과 f-string 으로 출력', code: C_FSTRING.replace(PREP, `${U_CREATE_IF}`),
            points: ['<code>fetchall()</code> + for 문', '튜플을 네 변수로 풀기', '<code>{값:&lt;10}</code> : 10칸 왼쪽 정렬', 'while + fetchone 보다 짧음'],
            notes: '<p>Code13-02 와 같은 일을 하는 더 파이썬다운 코드입니다. 두 방식을 모두 읽을 수 있으면 됩니다.</p><p>시간: 4분</p>' },
          { layout: 'diagram', title: '두 테이블을 합치기 — JOIN', html: F_JOIN, caption: 'SELECT … FROM 표A JOIN 표B ON 표A.공통열 = 표B.공통열',
            notes: '<p>1교시에서 “왜 표를 나누는가” 를 배웠다면, 오늘은 “나눈 표를 다시 합치는 법” 입니다. 점선으로 표시한 id 열이 연결 고리입니다.</p><p>발문: “주문이 없는 Lee Pal 은 왜 결과에 없을까요?” (4분)</p>' },
          { layout: 'code', title: 'JOIN 예제 — 이름과 함께 보기', code: SL5_JOIN,
            points: ['<code>표A JOIN 표B ON 공통열</code>', '<code>m</code>, <code>o</code> 처럼 <b>별칭</b>으로 짧게', '조인 결과에도 GROUP BY 사용 가능', '<code>LEFT JOIN</code> 은 짝 없는 행도 남김'],
            notes: '<p>ON 조건을 지우면 어떻게 될지(모든 조합 = 카티션 곱) 한 번 보여 주면 조인의 의미가 분명해집니다.</p><p>시간: 6분</p>' },
          { layout: 'code', title: '조회 결과를 CSV 로 내보내기', code: SL5_CSV,
            points: ['<code>cur.description</code> → 열 이름', '<code>csv.writer</code> : writerow + writerows', '<code>newline=""</code> 를 잊지 말 것', '엑셀로 열어 볼 수 있는 결과물'],
            notes: '<p>11장의 파일 쓰기와 연결됩니다. 실행 후 작업 폴더에서 out.csv 를 열어 보여 주세요. CSV → DB(4교시)의 반대 방향입니다.</p><p>시간: 5분</p>' },
          { layout: 'quiz', title: '확인 문제', q: 'fetchone() 으로 3행 중 1행을 꺼낸 뒤 fetchall() 을 부르면 몇 행이 돌아오나요?',
            options: ['0행', '1행', '2행', '3행'], answer: 2,
            explain: 'fetchall 은 아직 꺼내지 않은 나머지 행만 돌려줍니다.',
            notes: '<p>(1분)</p>' },
          { layout: 'practice', title: 'SELF STUDY 13-3. 제품 목록 조회', desc: '<p>Code13-02 를 수정해 productTable 의 내용을 출력하세요.</p>', starter: PR_SS3_S, solution: PR_SS3,
            notes: '<p>테이블 이름과 제목 줄, 서식(%d)만 바꾸면 됩니다. 한글 제품명은 %5s 로 맞추면 칸이 조금 어긋날 수 있다는 것도 관찰하게 합니다.</p><p>시간: 8분</p>' },
          { layout: 'practice', title: '실습 13-5-4. 회원 한 명 찾기', desc: '<p>ID 를 입력받아 그 회원 정보를 출력(없으면 “없는 사용자입니다”)</p>', starter: PR_FIND_S, solution: PR_FIND, stdin: 'lee\n',
            notes: '<p>WHERE + ? 자리표시자 + fetchone 의 None 검사를 모두 쓰는 종합 과제입니다. 빨리 끝낸 학생에게 제공합니다.</p><p>시간: 5분</p>' },
          { layout: 'practice', title: '🚀 프로젝트 13-5. 도서 대출 조회 리포트', desc: '<p>세 테이블을 조인해 대출 중인 책 · 회원별 대출 횟수 · 인기 책 · 한 번도 안 빌린 책을 뽑고 CSV 로 내보내세요.</p>', starter: PJ_LOAN_S, solution: PJ_LOAN,
            notes: '<p>프로젝트 13-2(설계)의 후속입니다. 세 테이블 조인에서 막히면 두 테이블부터 붙여 보게 하세요. 과제로 내기에 좋습니다.</p><p>시간: 남는 시간 또는 과제</p>' },
          { layout: 'summary', title: '정리', bullets: ['조회 5단계: 연결 → 커서 → SELECT → fetchone 반복 → 닫기', 'fetchone() / fetchall() / fetchmany(n) / 커서 반복', 'rows[i][j] · <code>sqlite3.Row</code> 로 열 이름 접근', '<code>JOIN … ON</code> 으로 두 표 합치기, 서브쿼리', '조회 결과를 CSV 로 내보내기 / 조회는 commit 불필요'],
            notes: '<p>다음 시간: 입력과 조회를 tkinter GUI 로 합쳐 [프로그램 2]를 완성합니다. (1분)</p>' }
        ]
      },

      /* ============================================================ 13-6 */
      {
        id: 'ch13-6',
        title: '[프로그램 2] GUI 데이터 입력 · 조회',
        minutes: 50,
        goals: [
          'tkinter 의 Entry · Button · Listbox 와 데이터베이스를 연동할 수 있다',
          'insertData() 에서 try · except · else 로 입력 성공 · 실패를 알릴 수 있다',
          'selectData() 에서 조회 결과를 여러 리스트 상자에 나누어 표시할 수 있다',
          '? 자리표시자 · 입력 검사 등으로 프로그램을 개선할 수 있다'
        ],
        flow: [['완성 화면 · 구조', 5], ['insertData()', 12], ['selectData()', 12], ['화면 구성 · 실행', 8], ['개선판 · 정리', 13]],
        content: [
          { type: 'h', text: '[프로그램 2]의 완성 — 데이터 입력, 조회' },
          { type: 'p', html: '10장에서 배운 tkinter 창에 이번 장의 데이터베이스 입력 · 조회 기능을 붙입니다. 위쪽 입력칸 4개에 사용자 ID · 이름 · 이메일 · 출생연도를 넣고 <b>[입력]</b> 을 누르면 INSERT 되고, <b>[조회]</b> 를 누르면 아래 노란 리스트 상자 4개에 전체 회원이 표시됩니다.' },
          { type: 'figure', html: F_GUI, caption: '[프로그램 2] GUI 데이터 입력 화면' },
          { type: 'table', head: ['부분', '위젯 / 함수', '하는 일'], rows: [
            ['입력 영역', '<code>edtFrame</code> 안의 <code>Entry</code> 4개 (<code>edt1</code>~<code>edt4</code>)', '입력값을 받는 칸'],
            ['버튼', '<code>btnInsert</code> → <code>insertData()</code>', '입력칸의 값으로 INSERT, 결과를 메시지 상자로 알림'],
            ['', '<code>btnSelect</code> → <code>selectData()</code>', 'SELECT 결과를 리스트 상자에 표시'],
            ['목록 영역', '<code>listFrame</code> 안의 <code>Listbox</code> 4개 (<code>listData1</code>~<code>listData4</code>)', '열 하나당 리스트 상자 하나']
          ] },
          { type: 'code', title: 'Code13-03. [프로그램 2] GUI 데이터 입력 · 조회', code: C_13_03,
            desc: '<code>C:/CookPython/naverDB</code> 대신 작업 폴더의 <code>naverDB</code> 를 씁니다. <code>48~51행</code>은 웹 강좌용 준비 코드로, userTable 이 없으면 만들어 둡니다(처음 [조회]를 눌러도 오류가 나지 않게). 창이 뜨면 입력칸에 <code>woo</code>, <code>Woo Ja</code>, <code>woo@hanbit.co.kr</code>, <code>2002</code> 를 넣고 [입력] → [조회] 를 눌러 보세요.' },

          { type: 'h', text: 'insertData() — 입력 버튼' },
          { type: 'list', items: [
            '<code>11~12행</code>: 버튼을 누를 때마다 DB 에 연결하고 커서를 만듭니다.',
            '<code>14행</code>: <code>edt1.get()</code> 으로 입력칸 4개의 글자를 가져옵니다. 한 줄에 여러 문장을 <code>;</code> 로 이어 썼습니다.',
            '<code>15~21행</code>: INSERT 를 <code>try</code> 로 감싸, 실패하면 <code>except</code> 에서 오류 메시지 상자, 성공하면 <code>else</code> 에서 성공 메시지 상자를 띄웁니다 (9장 · 10장의 예외 처리와 messagebox).',
            '<code>22~23행</code>: commit 으로 저장하고 닫습니다.'
          ] },
          { type: 'callout', kind: 'warn', title: '입력 오류가 나는 경우', html: '출생연도 칸을 비우거나 글자를 넣으면 SQL 문이 잘못되어 <b>“데이터 입력 오류가 발생함”</b> 메시지가 뜹니다. 이름에 작은따옴표가 있어도 마찬가지입니다. 아래 개선판은 ? 자리표시자와 입력 검사로 이 문제를 해결합니다.' },

          { type: 'h', text: 'selectData() — 조회 버튼' },
          { type: 'list', items: [
            '<code>26행</code>: 열마다 따로 모을 빈 리스트 4개를 만듭니다.',
            '<code>30~33행</code>: 각 리스트의 맨 앞에 제목(<code>사용자ID</code> 등)과 구분선(<code>-----------</code>)을 넣습니다.',
            '<code>34~39행</code>: <code>fetchone()</code> 으로 한 행씩 꺼내 row[0]~row[3] 을 각 리스트에 추가합니다 (Code13-02 와 같은 반복 구조).',
            '<code>41~42행</code>: 리스트 상자의 기존 항목을 모두 지웁니다. <code>delete(0, 크기 - 1)</code> 은 0번부터 마지막 항목까지 삭제 (<code>delete(0, END)</code> 와 같음). 지우지 않으면 [조회] 를 누를 때마다 목록이 계속 쌓입니다.',
            '<code>43~45행</code>: <code>zip()</code> 으로 네 리스트에서 같은 위치의 값을 하나씩 꺼내 각 리스트 상자의 끝(<code>END</code>)에 넣습니다.'
          ] },
          { type: 'figure', html: F_ZIP, caption: 'zip() 으로 네 리스트의 값을 나란히 꺼내 리스트 상자에 넣기' },

          { type: 'h', text: '화면 구성 (메인 코드)' },
          { type: 'list', items: [
            '<code>54~56행</code>: 창 만들기, 크기 <code>600x300</code>, 제목.',
            '<code>58~61행</code>: 입력용 프레임(<code>edtFrame</code>)은 위에, 목록용 프레임(<code>listFrame</code>)은 아래(<code>side=BOTTOM</code>)에 창 크기에 맞춰 늘어나게(<code>fill=BOTH, expand=1</code>) 배치합니다.',
            '<code>63~71행</code>: Entry 4개와 버튼 2개를 <code>side=LEFT</code> 로 나란히. 버튼의 <code>command</code> 에 함수 이름을 연결합니다 (괄호 없이!).',
            '<code>73~80행</code>: 노란 리스트 상자 4개를 왼쪽부터 나란히 배치합니다.'
          ] },
          { type: 'callout', kind: 'tip', title: '버튼 command 에는 괄호 없이', html: '<code>command = insertData</code> 는 “누르면 이 함수를 불러 줘” 라는 뜻입니다. <code>command = insertData()</code> 처럼 괄호를 붙이면 창을 만드는 순간 함수가 한 번 실행되고, 버튼에는 그 결과(None)가 연결되어 버립니다.' },

          { type: 'h', text: '📘 [프로그램 2] 개선판' },
          { type: 'p', html: '강의자료 코드를 바탕으로 다음을 개선한 버전입니다: ① <code>?</code> 자리표시자로 안전하게 입력, ② 빈칸 · 숫자 검사, ③ 입력 성공 시 입력칸을 비우고 바로 다시 조회, ④ 창을 열자마자 한 번 조회, ⑤ 반복되는 Entry · Listbox 생성을 for 문과 리스트로 정리.' },
          { type: 'code', title: '추가 예제. [프로그램 2] 개선판', code: C_GUI_BETTER,
            desc: '<code>edts</code>, <code>lists</code> 리스트에 위젯을 담아 두면 <code>edts[0]</code>, <code>lists[i]</code> 처럼 번호로 다룰 수 있어 코드가 짧아집니다. <code>except sqlite3.Error</code> 는 sqlite3 의 모든 DB 오류를 잡습니다. <code>con.execute()</code> 는 커서를 따로 만들지 않고 바로 SQL 을 실행하는 지름길입니다.' },
          { type: 'code', title: '추가 예제. 한 개의 리스트 상자로 간단히 조회하기', code: C_GUI_SHORT,
            desc: '열마다 리스트 상자를 두지 않고, 한 행을 <code>"%-6s %-10s %-18s %d" % row</code> 로 한 줄 문자열로 만들어 넣는 방법입니다. <code>%-6s</code> 는 6칸 왼쪽 정렬입니다. (글꼴에 따라 칸이 딱 맞지 않을 수 있습니다.)' },
          { type: 'callout', kind: 'more', title: '📘 이 장에서 쓴 sqlite3 기능 정리', html: '<table><tr><th>코드</th><th>설명</th></tr><tr><td><code>con = sqlite3.connect("파일")</code></td><td>DB 연결 (없으면 생성), <code>":memory:"</code> 는 임시 DB</td></tr><tr><td><code>cur = con.cursor()</code></td><td>커서 생성</td></tr><tr><td><code>cur.execute(sql[, 값튜플])</code></td><td>SQL 실행 (<code>?</code> 자리표시자에 값 전달)</td></tr><tr><td><code>cur.fetchone()</code> / <code>fetchall()</code></td><td>결과 한 행(튜플 또는 None) / 모든 행(리스트)</td></tr><tr><td><code>cur.description</code>, <code>cur.rowcount</code></td><td>결과의 열 정보 / 바뀐 행 수</td></tr><tr><td><code>con.commit()</code> / <code>rollback()</code></td><td>변경 확정 / 취소</td></tr><tr><td><code>con.close()</code></td><td>연결 닫기</td></tr></table>' },

          { type: 'h', text: '한 걸음 더 — GUI 에서 CRUD 완성하기 (검색 · 삭제)' },
          { type: 'p', html: '[프로그램 2]는 입력(Create)과 조회(Read)만 합니다. 여기에 <b>검색</b>과 <b>삭제</b>(Delete)를 붙이면 실제 관리 프로그램에 가까워집니다. 삭제처럼 되돌릴 수 없는 일은 <code>messagebox.askyesno()</code> 로 한 번 더 확인합니다.' },
          { type: 'code', title: '추가 예제. 회원 관리 GUI — 입력 · 검색 · 삭제 · 전체 보기', code: C_GUI_CRUD,
            desc: '<code>runSql()</code> 처럼 <b>반복되는 DB 작업을 함수로 묶으면</b> 버튼이 늘어나도 코드가 지저분해지지 않습니다. 검색은 <code>LIKE ?</code> 에 <code>"%" + 단어 + "%"</code> 를 넘겨 “포함” 검색을 합니다. 창을 띄운 뒤 아이디 칸에 <code>john</code> 을 넣고 [삭제], 검색칸에 <code>k</code> 를 넣고 [검색] 을 눌러 보세요.' },
          { type: 'callout', kind: 'more', title: '📘 연결은 언제 열고 닫을까', html: '<ul><li><b>버튼을 누를 때마다 열고 닫기</b> (이 장의 방식) — 코드가 단순하고, 다른 프로그램이 DB 를 쓸 때 오래 잠그지 않아 안전합니다. 작은 프로그램에 적당합니다.</li><li><b>프로그램 시작 때 한 번 열어 두기</b> — 빠르지만, 닫는 것을 잊거나 예외가 나면 연결이 남습니다. 끝낼 때 <code>window.protocol("WM_DELETE_WINDOW", …)</code> 같은 곳에서 <code>close()</code> 를 해 줘야 합니다.</li></ul><p>어느 쪽이든 <b>commit 을 빠뜨리지 않는 것</b>이 가장 중요합니다.</p>' },
          { type: 'code', title: '추가 예제. with con : 으로 commit · rollback 자동화', code: X6_WITH,
            expect: "예외 : 입력 중 문제 발생!\n남은 회원 : ['john']",
            desc: '<code>with con :</code> 블록은 정상으로 끝나면 <b>자동 commit</b>, 블록 안에서 예외가 나면 <b>자동 rollback</b> 합니다. 두 번째 블록의 kim 은 예외 때문에 취소되어 john 만 남았습니다. 주의: <code>with</code> 는 <b>연결을 닫지 않습니다</b>. <code>con.close()</code> 는 따로 호출하세요.' },

          { type: 'h', text: '설계 다시 보기 — 정규화(normalization)' },
          { type: 'p', html: '1교시에서 “회원 정보를 주문마다 반복하지 말자” 고 했습니다. 왜 그런지 <b>수정할 때</b> 직접 확인해 봅시다.' },
          { type: 'code', title: '추가 예제. 중복 저장이 만드는 데이터 불일치', code: X6_NORMAL,
            expect: "한 행만 고치면 : [('kim@gmail.com',), ('kim@daum.net',)]\n→ 같은 사람의 이메일이 두 가지가 되어 버렸다 (데이터 불일치)\n테이블을 나누면 : [('kim@gmail.com',)] → 한 곳만 고치면 끝",
            desc: '중복이 있으면 <b>수정 이상(update anomaly)</b> 이 생깁니다. 한 행만 고쳤을 뿐인데 같은 사람의 이메일이 두 가지가 되었습니다. 테이블을 나눠 두면 고칠 곳이 한 군데뿐이라 이런 일이 없습니다.' },
          { type: 'callout', kind: 'more', title: '📘 정규화를 세 문장으로', html: '<ol><li><b>1NF</b> — 한 칸에는 값 하나만. (<code>취미 = "축구,독서"</code> ✕ → 취미 표를 따로)</li><li><b>2NF · 3NF</b> — 한 테이블은 <b>하나의 주제</b>만 담는다. 회원 표에 “주문한 제품명” 이 있으면 주제가 두 개다.</li><li>반복되는 덩어리가 보이면 <b>떼어 내고 id 로 연결</b>한다.</li></ol><p>다만 지나치게 잘게 나누면 조인이 많아져 느려지고 읽기 어려워집니다. 실무에서는 일부러 중복을 남기기도 합니다(<b>비정규화</b>). <b>먼저 정규화하고, 필요할 때 풀어 준다</b>가 기본 순서입니다.</p>' },

          { type: 'h', text: 'ORM — SQL 대신 파이썬 객체로 다루기' },
          { type: 'p', html: '프로그램이 커지면 SQL 문자열이 코드 곳곳에 흩어져 관리하기 어려워집니다. <b>ORM(Object-Relational Mapping)</b> 은 <mark>테이블을 클래스로, 행을 객체로</mark> 바꿔 주는 도구입니다. 파이썬에서는 <b>SQLAlchemy</b>, <b>Django ORM</b>, <b>peewee</b> 가 많이 쓰입니다.' },
          { type: 'code', run: false, title: 'SQL 방식 vs ORM 방식 (SQLAlchemy 예)', code: X6_ORM,
            desc: 'ORM 을 쓰면 SQL 을 몰라도 조회 · 입력을 할 수 있고, DBMS 를 SQLite 에서 PostgreSQL 로 바꿔도 코드가 거의 그대로입니다. 대신 <b>느려질 수 있고</b>, 무슨 SQL 이 실행되는지 보이지 않아 문제를 찾기 어렵습니다. (이 강좌의 브라우저 환경에는 설치되어 있지 않아 실행은 하지 않습니다.)' },
          { type: 'callout', kind: 'more', title: '📘 ORM 을 쓰더라도 SQL 은 알아야 합니다', html: 'ORM 이 만들어 내는 SQL 이 이상하게 느릴 때(대표적으로 <b>N+1 문제</b> — 목록 100개를 그리려고 조회를 101번 하는 현상), 결국 <code>JOIN</code> 을 이해해야 고칠 수 있습니다. 이 장에서 배운 <code>SELECT</code> · <code>WHERE</code> · <code>JOIN</code> · <code>인덱스</code> 는 어떤 도구를 쓰더라도 그대로 쓰입니다.' },

          { type: 'h', text: '실무로 가는 길 — SQLite 다음에는' },
          { type: 'table', head: ['항목', 'SQLite', '서버형 DB (MySQL · PostgreSQL …)'], rows: [
            ['설치', '없음 (파이썬에 내장)', '서버 설치 · 계정 · 포트 설정 필요'],
            ['저장', '<b>파일 한 개</b> — 복사하면 그대로 백업', '서버가 관리하는 저장소 + 백업 도구'],
            ['동시 사용', '읽기는 여럿, <b>쓰기는 한 번에 하나</b>', '수백 · 수천 명이 동시에 읽고 쓰기'],
            ['알맞은 곳', '스마트폰 앱, 작은 프로그램, 시험 · 학습', '웹 서비스, 회사 시스템'],
            ['SQL', '<b>거의 같다</b> — 여기서 배운 문법이 그대로 통함', '함수 이름 · 자료형이 조금씩 다름']
          ] },
          { type: 'callout', kind: 'tip', title: '데이터베이스를 쓸 때의 다섯 가지 습관', html: '<ol><li>값은 언제나 <code>?</code> 자리표시자로 넘긴다 (SQL 인젝션 방지)</li><li><code>UPDATE</code> · <code>DELETE</code> 는 <code>SELECT</code> 로 대상을 먼저 확인하고 <code>WHERE</code> 와 함께</li><li>입력 · 수정 뒤에는 <code>commit()</code>, 실패하면 <code>rollback()</code> (또는 <code>with con :</code>)</li><li>테이블에는 기본키를, 중요한 열에는 <code>NOT NULL</code> · <code>UNIQUE</code> 제약을</li><li>중요한 작업 전에는 <b>DB 파일을 복사</b>해 둔다 (SQLite 는 파일 하나!)</li></ol>' }
        ],
        practice: [
          { title: '실습 13-6-1. with 문으로 할 일 목록 저장하기', level: 1,
            desc: '<p><code>myDB</code> 에 <code>todoTable</code>(<code>no</code> 자동 번호, <code>work</code>, <code>done</code> 기본값 <code>\'N\'</code>)을 만들고, <b><code>with con :</code> 블록만 써서</b>(즉 <code>commit()</code> 을 직접 부르지 않고) 할 일 3개를 넣고 1번을 완료(<code>done = \'Y\'</code>)로 바꾸세요. 그런 다음 연결을 닫았다가 <b>다시 열어</b> 전체를 출력해 저장이 되었는지 확인합니다.</p>',
            hint: '<code>with con :</code> 블록이 정상으로 끝나면 자동으로 commit 됩니다. 단 <code>with</code> 는 연결을 닫지 않으므로 <code>con.close()</code> 는 따로 호출해야 합니다.',
            starter: PR_WITH_S, solution: PR_WITH,
            expect: "(1, '파이썬 복습', 'Y')\n(2, '실습 과제', 'N')\n(3, '책 반납', 'N')" },
          { title: '실습 13-6-2. 오류를 잡아 친절하게 알려 주기', level: 1,
            desc: '<p>SQL 문을 받아 실행하는 <code>safeQuery(sql)</code> 함수를 완성하세요.</p><ul><li>정상이면 <code>결과 : [(\'john\', 1990)]</code> 처럼 출력 (<code>else</code> 블록)</li><li><code>sqlite3.OperationalError</code> 면 <code>조회할 수 없습니다 : 메시지</code></li><li>그 밖의 <code>sqlite3.Error</code> 면 <code>데이터베이스 오류 : 메시지</code></li><li>어떤 경우에도 <code>finally</code> 에서 <code>con.close()</code></li></ul><p>테이블 이름 오타 · 없는 열 · 따옴표 누락 세 가지 SQL 이 어떤 메시지를 내는지 확인하세요.</p>',
            hint: '<code>try / except / else / finally</code> 를 모두 쓰는 연습입니다. <code>except</code> 는 <b>구체적인 오류를 먼저</b> 적어야 합니다(OperationalError 가 Error 보다 위).',
            starter: PR_EXC_S, solution: PR_EXC,
            expect: "결과 : [('john', 1990)]\n조회할 수 없습니다 : no such table: userTabel\n조회할 수 없습니다 : no such column: name\n조회할 수 없습니다 : no such column: john" },
          { title: '실습 13-6-3. 회원 삭제 프로그램', level: 2,
            desc: '<p>삭제할 사용자 ID 를 입력받아 userTable 에서 지우세요. 지워진 행이 없으면 “없는 사용자입니다”, 있으면 “○○ 삭제 완료” 를 출력하고 남은 회원 id 목록을 출력합니다.</p>',
            hint: '<code>DELETE FROM userTable WHERE id = ?</code> 실행 후 <code>cur.rowcount</code> 에 지워진 행 수가 들어 있습니다. commit 을 잊지 마세요.',
            starter: PR_DELETE_S, solution: PR_DELETE, stdin: 'kim\n',
            expect: "삭제할 사용자ID ==> kim\nkim 삭제 완료\n남은 회원 : ['john', 'lee', 'park']" },
          { title: '실습 13-6-4. GUI 회원 검색 창', level: 2,
            desc: '<p>검색칸에 글자를 넣고 [검색] 을 누르면 <b>아이디 또는 이름에 그 글자가 들어간 회원</b>을 리스트 상자에 보여 주는 창을 만드세요.</p><ul><li><code>WHERE id LIKE ? OR userName LIKE ?</code> 에 <code>"%" + 단어 + "%"</code> 를 넘깁니다.</li><li>검색할 때마다 리스트 상자를 <code>delete(0, END)</code> 로 비웁니다.</li><li>결과가 없으면 “찾는 회원이 없습니다” 를 보여 줍니다.</li></ul><p>(뼈대의 DB 에는 john · kim · lee 세 명이 들어 있습니다. 빈칸으로 검색하면 전체가 나옵니다.)</p>',
            hint: '<code>%</code> 는 “아무 글자 여러 개” 이므로 <code>"%" + word + "%"</code> 는 “포함” 검색이 됩니다. 값이 두 개이므로 튜플도 두 개: <code>("%" + word + "%", "%" + word + "%")</code>.',
            starter: PR_GUIF_S, solution: PR_GUIF },
          { title: '실습 13-6-5. GUI 제품 관리 프로그램', level: 3,
            desc: '<p>[프로그램 2]를 바꾸어 <code>productTable</code>(제품코드, 제품명, 가격, 재고수량)을 입력 · 조회하는 GUI 프로그램을 만드세요. 가격 · 재고수량이 숫자가 아니면 오류 메시지를 띄웁니다.</p>',
            hint: '개선판 코드에서 테이블 이름, 제목, 열 이름만 바꾸면 됩니다. <code>int(data[2])</code> 에서 ValueError 가 나면 except 로 잡힙니다.',
            starter: PR_GUIP_S, solution: PR_GUIP },
          { title: '🚀 프로젝트 13-6. 회원 관리 CLI (추가 · 검색 · 수정 · 삭제)', level: 3,
            desc: '<p>이 장의 마지막 프로젝트입니다. 메뉴를 고르며 회원을 관리하는 <b>CRUD 프로그램</b>을 완성하세요.</p><p><b>테이블</b> — <code>memberTable</code>(<code>id</code> 기본키, <code>name</code> NOT NULL, <code>email</code> UNIQUE, <code>year</code>)</p><p><b>요구 사항</b></p><ol><li>메뉴 반복 : <code>1 추가  2 검색  3 수정  4 삭제  5 목록  0 종료 ==&gt; </code></li><li><b>1 추가</b> — 아이디 · 이름 · 이메일 · 출생연도를 입력받아 저장.<ul><li>출생연도가 숫자가 아니면 안내만 하고 돌아갑니다.</li><li>아이디나 이메일이 겹치면 <code>IntegrityError</code> 를 잡아 <code>  ! 추가 실패 : UNIQUE constraint failed: memberTable.id</code> 처럼 안내하고 <code>rollback</code> 합니다.</li></ul></li><li><b>2 검색</b> — 이름의 일부를 입력받아 <code>LIKE</code> 로 검색 (없으면 <code>  (찾는 회원이 없습니다)</code>)</li><li><b>3 수정</b> — 아이디와 새 이메일을 입력받아 <code>UPDATE</code>, <code>cur.rowcount</code> 로 <code>  -&gt; 1 명을 수정했습니다</code></li><li><b>4 삭제</b> — 아이디를 입력받아 <code>DELETE</code>, 바뀐 행 수 출력</li><li><b>5 목록</b> — 전체 인원과 목록 출력</li><li><b>0 종료</b> — <code>con.close()</code> 후 <code>회원 관리를 끝냅니다</code></li></ol><p><b>여기까지 했다면 이렇게 더 해 보세요</b></p><ul><li>삭제 전에 <code>정말 지울까요? (y/n)</code> 로 한 번 더 확인하기</li><li>출생연도로 검색하는 메뉴 추가 (<code>BETWEEN</code>)</li><li>같은 기능을 tkinter 창으로 만들기 (본문의 회원 관리 GUI 예제 참고)</li><li>회원마다 주문 테이블을 만들어 <code>JOIN</code> 으로 구매 내역 보여 주기</li></ul>',
            hint: '기능마다 함수(<code>addMember</code>, <code>findMember</code> …)로 나누면 메뉴 부분이 아주 짧아집니다. 모든 값은 <code>?</code> 자리표시자로 넘기고, 수정 · 삭제 뒤에는 <code>cur.rowcount</code> 로 실제로 몇 명이 바뀌었는지 확인하세요.',
            starter: PJ_MEM_S, solution: PJ_MEM,
            stdin: '1\njohn\nJohn Bann\njohn@naver.com\n1990\n1\nkim\nKim Chi\nkim@daum.net\n1992\n1\njohn\n또 다른 사람\nother@naver.com\n2000\n2\nKim\n3\njohn\njohn@gmail.com\n5\n4\nkim\n5\n0\n',
            expect: '1 추가  2 검색  3 수정  4 삭제  5 목록  0 종료 ==> 1\n  아이디 : john\n  이름 : John Bann\n  이메일 : john@naver.com\n  출생연도 : 1990\n  -> John Bann 님을 추가했습니다\n1 추가  2 검색  3 수정  4 삭제  5 목록  0 종료 ==> 1\n  아이디 : kim\n  이름 : Kim Chi\n  이메일 : kim@daum.net\n  출생연도 : 1992\n  -> Kim Chi 님을 추가했습니다\n1 추가  2 검색  3 수정  4 삭제  5 목록  0 종료 ==> 1\n  아이디 : john\n  이름 : 또 다른 사람\n  이메일 : other@naver.com\n  출생연도 : 2000\n  ! 추가 실패 : UNIQUE constraint failed: memberTable.id\n1 추가  2 검색  3 수정  4 삭제  5 목록  0 종료 ==> 2\n  검색할 이름(일부) : Kim\n   (\'kim\', \'Kim Chi\', \'kim@daum.net\', 1992)\n1 추가  2 검색  3 수정  4 삭제  5 목록  0 종료 ==> 3\n  수정할 아이디 : john\n  새 이메일 : john@gmail.com\n  -> 1 명을 수정했습니다\n1 추가  2 검색  3 수정  4 삭제  5 목록  0 종료 ==> 5\n  전체 2 명\n  john John Bann john@gmail.com 1990\n  kim Kim Chi kim@daum.net 1992\n1 추가  2 검색  3 수정  4 삭제  5 목록  0 종료 ==> 4\n  삭제할 아이디 : kim\n  -> 1 명을 삭제했습니다\n1 추가  2 검색  3 수정  4 삭제  5 목록  0 종료 ==> 5\n  전체 1 명\n  john John Bann john@gmail.com 1990\n1 추가  2 검색  3 수정  4 삭제  5 목록  0 종료 ==> 0\n회원 관리를 끝냅니다' }
        ],
        quiz: [
          { q: 'Code13-03 에서 [입력] 버튼과 insertData() 함수를 연결하는 올바른 코드는?',
            options: ['Button(edtFrame, text="입력", command=insertData())', 'Button(edtFrame, text="입력", command=insertData)', 'Button(edtFrame, text="입력", command="insertData")', 'Button(edtFrame, text="입력", insertData)'], answer: 1,
            explain: 'command 에는 함수 이름만(괄호 없이) 넘깁니다. 괄호를 붙이면 즉시 실행된 결과가 연결됩니다.' },
          { q: 'insertData() 의 try 블록에서 INSERT 가 <b>성공</b>했을 때 실행되는 곳은?',
            options: ['except 블록', 'else 블록', 'finally 블록만', '아무 블록도 실행되지 않는다'], answer: 1,
            explain: 'try 에서 예외가 없으면 else 블록이 실행되어 “데이터 입력 성공” 메시지가 뜹니다.' },
          { q: 'selectData() 에서 <code>listData1.delete(0, listData1.size() - 1)</code> 을 하지 않으면?',
            options: ['오류가 난다', '[조회] 를 누를 때마다 목록이 계속 쌓인다', '목록이 비어 있게 된다', '첫 번째 항목만 지워진다'], answer: 1,
            explain: '기존 항목을 지우지 않고 END 에 계속 insert 하므로 같은 목록이 반복해서 붙습니다.' },
          { q: '다음 코드의 출력은?<pre><code>a = ["id", "kim"]\nb = ["year", 1992]\nfor x, y in zip(a, b) :\n    print(x, y)</code></pre>',
            options: ['id kim\nyear 1992', 'id year\nkim 1992', "('id', 'year')", 'id year kim 1992'], answer: 1,
            explain: 'zip 은 같은 위치끼리 묶습니다: (id, year), (kim, 1992).' },
          { q: '<code>with con :</code> 블록에 대한 설명으로 <b>틀린</b> 것은?',
            options: ['블록이 정상으로 끝나면 자동으로 commit 된다', '블록 안에서 예외가 나면 자동으로 rollback 된다', '블록이 끝나면 연결도 자동으로 닫힌다', '<code>con.commit()</code> 을 직접 쓰지 않아도 된다'], answer: 2,
            explain: '<code>with con :</code> 은 <b>트랜잭션</b>만 관리합니다. 연결은 닫히지 않으므로 <code>con.close()</code> 를 따로 호출해야 합니다.' },
          { q: '회원의 이메일을 주문 테이블에도 함께 저장해 두었을 때 생기는 문제를 무엇이라고 하나요?',
            options: ['데이터 중복으로 인한 수정 이상 (정규화가 필요한 상태)', '인덱스 부족', 'SQL 인젝션', '트랜잭션 고립성 위반'], answer: 0,
            explain: '같은 정보가 여러 곳에 있으면 한 곳만 고쳤을 때 값이 어긋납니다(수정 이상). 테이블을 나누고 id 로 연결하는 것이 정규화입니다.' }
        ],
        slides: [
          { layout: 'title', title: '[프로그램 2] GUI 데이터 입력 · 조회', subtitle: 'Chapter 13 · Section 04 — [프로그램 2]의 완성', badge: '13-6',
            notes: '<p>10장 tkinter + 이번 장 DB 입력 · 조회를 합칩니다. 지금까지 배운 것이 모두 들어가는 종합 프로그램이라고 동기를 줍니다. (1분)</p>' },
          { layout: 'diagram', title: '[프로그램 2] 완성 화면', html: F_GUI,
            notes: '<p>위: Entry 4 + Button 2 (edtFrame), 아래: Listbox 4 (listFrame). 각 부분이 코드의 어디에 해당하는지 미리 짚어 줍니다.</p><p>시간: 3분</p>' },
          { layout: 'code', title: 'insertData() — [입력] 버튼', code: `import sqlite3
from tkinter import *
from tkinter import messagebox

def insertData() :
    con = sqlite3.connect("naverDB")
    cur = con.cursor()
    ${U_CREATE_IF}
    data1 = edt1.get(); data2 = edt2.get(); data3 = edt3.get(); data4 = edt4.get()
    try :
        sql = "INSERT INTO userTable VALUES('" + data1 + "','" + data2 + "','" + data3 + "'," + data4 + ")"
        cur.execute(sql)
    except :
        messagebox.showerror('오류', '데이터 입력 오류가 발생함')
    else :
        messagebox.showinfo('성공', '데이터 입력 성공')
    con.commit()
    con.close()

window = Tk()
edt1 = Entry(window); edt2 = Entry(window); edt3 = Entry(window); edt4 = Entry(window)
for e in (edt1, edt2, edt3, edt4) : e.pack()
Button(window, text = "입력", command = insertData).pack()
window.mainloop()`,
            points: ['<code>edt.get()</code> : 입력칸의 글자', 'try / except / else 로 성공 · 실패 알림', 'Code13-01 의 INSERT 와 같은 문자열', '누를 때마다 연결 → commit → close'],
            notes: '<p>입력 부분만 떼어 낸 실행 가능한 버전입니다. 출생연도를 비우고 [입력] 을 눌러 오류 메시지 상자가 뜨는 것도 보여 주세요.</p><p>시간: 7분</p>' },
          { layout: 'code', title: 'selectData() — 한 개의 리스트 상자 버전', code: C_GUI_SHORT,
            points: ['SELECT → fetchall', '<code>delete(0, END)</code> 로 비우고', '<code>insert(END, 문자열)</code> 로 추가', 'Code13-03 은 열마다 리스트 상자 4개'],
            notes: '<p>원리를 먼저 간단한 버전으로 보여 주고, 다음 그림으로 Code13-03 의 “리스트 4개 + zip” 방식을 설명합니다.</p><p>시간: 5분</p>' },
          { layout: 'diagram', title: 'Code13-03 의 selectData() — zip', html: F_ZIP,
            notes: '<p>strData1~4 에 제목 · 구분선 · 각 열 값을 모은 뒤, zip 으로 같은 위치끼리 꺼내 각 리스트 상자에 넣습니다. 기존 항목을 먼저 지우는 이유도 질문합니다.</p><p>시간: 5분</p>' },
          { layout: 'bullets', title: '화면 구성 (메인 코드)', lead: 'Frame 두 개로 위 · 아래 나누기',
            bullets: ['<code>window.geometry("600x300")</code>, 제목 “GUI 데이터 입력”', '<code>edtFrame</code> 위, <code>listFrame</code> 아래 (<code>side=BOTTOM, fill=BOTH, expand=1</code>)', 'Entry 4 + Button 2 : <code>side=LEFT, padx=10, pady=10</code>', 'Listbox 4 : <code>bg=\'yellow\'</code>, 왼쪽부터 나란히', '버튼 <code>command=함수이름</code> (괄호 없이)'],
            notes: '<p>본문의 Code13-03 전체 코드를 학생 화면에서 실행하게 하고, woo 회원을 입력 → 조회해 보게 합니다.</p><p>시간: 6분</p>' },
          { layout: 'bullets', title: '개선판에서 바꾼 점 (보충)', lead: '더 안전하고 편리하게',
            bullets: ['<code>?</code> 자리표시자 → 따옴표 문제 · SQL 삽입 방지', '빈칸 검사, 출생연도 <code>int()</code> 검사', '입력 성공 → 입력칸 비우고 자동 조회', '창을 열자마자 <code>selectData()</code>', 'Entry · Listbox 를 for 문 + 리스트로'],
            notes: '<p>본문의 개선판을 실행해 보여 줍니다. 시간이 부족하면 ? 자리표시자만 강조합니다.</p><p>시간: 5분</p>' },
          { layout: 'code', title: 'with con : 으로 commit · rollback 자동화', code: X6_WITH,
            points: ['정상 종료 → 자동 <code>commit</code>', '예외 발생 → 자동 <code>rollback</code>', '<b>연결은 닫히지 않는다</b> → <code>close()</code> 따로', 'commit 을 잊는 실수를 줄여 준다'],
            notes: '<p>4교시의 트랜잭션과 이어집니다. 두 번째 블록에서 일부러 예외를 내 kim 이 저장되지 않는 것을 확인시키세요.</p><p>시간: 4분</p>' },
          { layout: 'two', title: '설계 다시 보기 — 정규화', left: { title: '중복 저장 (나쁜 설계)', bullets: ['주문마다 이름 · 이메일 반복', '이메일이 바뀌면 <b>모든 행</b>을 수정', '한 곳만 고치면 값이 어긋남(수정 이상)'] }, right: { title: '테이블 분리 (정규화)', bullets: ['회원 표에 한 번만 저장', '주문에는 <code>id</code> 만', '고칠 곳이 한 군데 → 항상 일관됨'] },
            notes: '<p>본문 예제를 실행하면 같은 사람의 이메일이 두 가지가 되는 장면을 볼 수 있습니다. 1교시의 “왜 표를 나누나” 와 5교시의 JOIN 을 하나로 묶어 정리하세요.</p><p>시간: 4분</p>' },
          { layout: 'bullets', title: 'ORM 과 실무로 가는 길', lead: '이 장에서 배운 SQL 은 어디서나 쓰인다',
            bullets: ['<b>ORM</b>(SQLAlchemy · Django ORM) : 표 → 클래스, 행 → 객체', 'SQL 을 몰라도 쓰지만, 느릴 때 고치려면 SQL 을 알아야 함', 'SQLite → MySQL · PostgreSQL : <b>SQL 문법은 거의 같다</b>', ['다음 단계', ['웹(Flask · Django) · 데이터 분석(pandas) 에서 DB 사용']]],
            notes: '<p>이 장이 끝이 아니라 시작이라는 메시지를 줍니다. 학생들이 앞으로 만들 프로그램(가계부 · 일정 관리 · 게임 기록)에 DB 를 붙여 보라고 권하세요.</p><p>시간: 4분</p>' },
          { layout: 'quiz', title: '확인 문제', q: 'Listbox 의 모든 항목을 지우는 코드는?',
            options: ['lb.delete()', 'lb.delete(0, END)', 'lb.clear()', 'lb.insert(END, "")'], answer: 1,
            explain: 'delete(처음, 끝) — 0 부터 END 까지 지웁니다. Code13-03 의 delete(0, size()-1) 과 같습니다.',
            notes: '<p>(1분)</p>' },
          { layout: 'practice', title: '실습 13-6. 회원 삭제 프로그램', desc: '<p>ID 를 입력받아 DELETE, rowcount 로 결과 확인 후 남은 id 출력</p>', starter: PR_DELETE_S, solution: PR_DELETE, stdin: 'kim\n',
            notes: '<p>CRUD 중 D 를 직접 해 보는 과제입니다. rowcount 가 “방금 execute 로 바뀐 행 수” 라는 점을 알려 줍니다.</p><p>시간: 6분</p>' },
          { layout: 'practice', title: '실습 13-6-5. GUI 제품 관리 (도전)', desc: '<p>productTable 을 입력 · 조회하는 GUI 프로그램 (숫자 검사 포함)</p>', starter: PR_GUIP_S, solution: PR_GUIP,
            notes: '<p>도전 과제 · 과제로 내도 좋습니다. 개선판 코드를 참고하게 합니다.</p><p>시간: 남는 시간</p>' },
          { layout: 'practice', title: '🚀 프로젝트 13-6. 회원 관리 CLI', desc: '<p>1 추가 / 2 검색 / 3 수정 / 4 삭제 / 5 목록 / 0 종료 메뉴로 회원을 관리하는 CRUD 프로그램을 완성하세요. 중복 아이디는 IntegrityError 로 안내합니다.</p>', starter: PJ_MEM_S, solution: PJ_MEM,
            stdin: '1\njohn\nJohn Bann\njohn@naver.com\n1990\n2\nJohn\n5\n0\n',
            notes: '<p>13장 전체의 마무리 과제입니다. 정답을 “예시 입력으로 실행” 해 흐름을 보여 준 뒤, 기능 하나씩 나눠 완성하게 하세요. 확장 아이디어(확인 질문 · GUI · JOIN)도 소개합니다.</p><p>시간: 남는 시간 또는 과제</p>' },
          { layout: 'summary', title: '13장 정리', bullets: ['DB · DBMS · 테이블 · 행 · 열 · SQL · 제약 조건', 'SELECT (WHERE · ORDER BY · LIMIT · GROUP BY · JOIN)', '입력: connect → cursor → execute(<code>?</code>) → commit → close', '안전: 자리표시자 · 트랜잭션 · rollback · 예외 처리', 'GUI · CSV · 인덱스 · 정규화 · ORM 으로 가는 길'],
            notes: '<p>장 전체를 정리합니다. 다음 장(미니 프로젝트)에서도 데이터를 저장하고 싶다면 SQLite 를 쓸 수 있다고 연결합니다. (2분)</p>' }
        ]
      }
    ]
  });
})();
