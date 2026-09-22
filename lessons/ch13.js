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
          { type: 'callout', kind: 'warn', title: 'DB 파일은 텍스트 파일이 아니에요', html: '<code>naverDB</code> 는 SQLite 전용 형식(이진 파일)이라 메모장으로 열면 깨진 글자처럼 보입니다. 내용은 반드시 SQL(명령행 도구 또는 파이썬 sqlite3 모듈)로 읽고 써야 합니다.' }
        ],
        practice: [
          { title: '실습 13-1. 우리 반 친구 테이블 만들기', level: 1,
            desc: '<p><code>myDB</code> 데이터베이스에 <code>friendTable</code>(이름 <code>name</code>, 나이 <code>age</code>, 사는 곳 <code>city</code>)을 만들고 친구 3명을 넣은 뒤 전체를 조회해 출력하세요.</p><p>예: <code>(\'철수\', 17, \'서울\')</code></p>',
            hint: '첫 예제의 CREATE → INSERT → commit → SELECT 순서를 그대로 따라 합니다. 문자열 값은 작은따옴표로 감쌉니다.',
            starter: PR_FRIEND_S, solution: PR_FRIEND,
            expect: "('철수', 17, '서울')\n('영희', 16, '부산')\n('민수', 17, '대전')" }
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
          { q: '열 이름에 대한 설명으로 옳은 것은?',
            options: ['한 테이블 안에서 같은 열 이름을 여러 번 쓸 수 있다', '한 테이블 안에서 열 이름은 중복될 수 없다', '열 이름은 행마다 다르게 정한다', '열 이름은 데이터를 입력할 때 정한다'], answer: 1,
            explain: '열 이름은 열을 구분하는 이름이므로 한 테이블 안에서 중복되면 안 됩니다. 테이블을 만들 때(CREATE TABLE) 데이터 형식과 함께 정합니다.' },
          { q: '파이썬 sqlite3 모듈로 테이블을 조회했을 때 <b>행 하나</b>는 어떤 자료형으로 돌아오나요?',
            options: ['문자열(str)', '딕셔너리(dict)', '튜플(tuple)', '정수(int)'], answer: 2,
            explain: '행 하나는 <code>(\'john\', \'John Bann\', \'john@naver.com\', 1990)</code> 같은 튜플이고, fetchall() 은 튜플의 리스트를 돌려줍니다.' }
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
          { layout: 'quiz', title: '확인 문제', q: '회원 테이블에서 세로 한 줄(예: 모든 회원의 email)을 부르는 말은?',
            options: ['행(로우)', '열(컬럼)', '데이터베이스', 'DBMS'], answer: 1,
            explain: '세로 한 줄은 열(컬럼, 필드)입니다. 가로 한 줄은 행(로우)입니다.',
            notes: '<p>손을 들어 답하게 한 뒤, 가로/세로를 손으로 그려 보이며 정리합니다. (1분)</p>' },
          { layout: 'practice', title: '실습 13-1. 친구 테이블 만들기', desc: '<p>myDB 에 friendTable(name, age, city)을 만들고 3명을 넣어 조회하세요.</p>', starter: PR_FRIEND_S, solution: PR_FRIEND,
            notes: '<p>맛보기 예제를 복사해 테이블 이름과 열만 바꾸면 되는 과제입니다. 문자열 값의 작은따옴표를 빠뜨리는 실수를 살펴봅니다.</p><p>시간: 6분</p>' },
          { layout: 'summary', title: '정리', bullets: ['데이터베이스: 대량 데이터를 체계적으로 저장 · 처리', 'DBMS: DB 관리 소프트웨어 (SQLite 는 파일 하나)', '관계형 DB: 테이블(행 · 열)로 저장', 'SQL: 사용자와 DBMS 의 언어', '파이썬: 행 = 튜플, 여러 행 = 튜플의 리스트'],
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
          { type: 'callout', kind: 'more', title: '📘 집에서 sqlite3.exe 로 직접 해 보기', html: '<ol><li>sqlite.org 에서 sqlite-tools 를 내려받아 <code>C:\\sqlite</code> 에 풉니다.</li><li><code>sqlite3.exe</code> 를 실행하고 <code>.open naverDB</code> 를 입력합니다 (파일은 sqlite3.exe 가 있는 폴더에 생깁니다).</li><li>이 교시의 CREATE TABLE, INSERT 문을 그대로 입력합니다 (끝에 <code>;</code>).</li><li><code>.table</code>, <code>.schema userTable</code> 로 확인하고 <code>.quit</code> 로 끝냅니다.</li></ol><p>파이썬으로 만든 <code>naverDB</code> 파일도 sqlite3.exe 의 <code>.open</code> 으로 열 수 있습니다. 같은 SQLite 형식이기 때문입니다.</p>' }
        ],
        practice: [
          { title: '실습 13-2. 책 테이블 구축하기', level: 1,
            desc: '<p>naverDB 에 <code>bookTable</code>(책 코드 <code>bookId char(5)</code>, 제목 <code>title char(20)</code>, 가격 <code>price int</code>)을 만들고 책 3권을 입력하세요. 그런 다음 <code>.schema bookTable</code> 처럼 테이블을 만든 SQL 문과 입력된 행 개수를 출력하세요.</p>',
            hint: '<code>sqlite_master</code> 테이블의 <code>sql</code> 열에 CREATE 문이 저장되어 있습니다. 행 개수는 <code>SELECT COUNT(*)</code> 후 <code>fetchone()[0]</code>.',
            starter: PR_BOOK_S, solution: PR_BOOK,
            expect: 'CREATE TABLE bookTable (bookId char(5), title char(20), price int);\n입력된 책 : 3 권' }
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
            explain: '<code>IF NOT EXISTS</code> 는 테이블이 없을 때만 만듭니다. 지우고 새로 만들려면 <code>DROP TABLE IF EXISTS</code> 를 먼저 실행합니다.' }
        ],
        slides: [
          { layout: 'title', title: 'SQLite 로 데이터베이스 구축하기', subtitle: 'Chapter 13 · Section 03 — 데이터베이스의 구축 (1)', badge: '13-2',
            notes: '<p>오늘은 [프로그램 1]을 만들기 위해 SQLite 에 데이터베이스와 테이블을 만들고 데이터를 넣는다고 소개합니다. (1분)</p>' },
          { layout: 'diagram', title: '그림 13-2 데이터베이스 구축 및 운영 과정', html: F_STEPS,
            notes: '<p>1단계 설치 → 2단계 구축(❶~❹) → 3단계 활용. 오늘은 ❶~❸, 다음 시간 ❹, 그 다음부터 3단계(파이썬 프로그램)라고 로드맵을 보여 줍니다.</p><p>시간: 3분</p>' },
          { layout: 'bullets', title: '1단계 · 2단계: 설치와 접속', lead: 'sqlite3.exe 하나면 끝',
            bullets: ['sqlite.org/download.html → <b>sqlite-tools-win…zip</b>', '<code>C:\\sqlite</code> 에 압축 풀기 → <code>sqlite3.exe</code> 실행', '<code>sqlite&gt;</code> 프롬프트에 명령 입력', '처음엔 <b>메모리 DB</b> (창 닫으면 사라짐) → <code>.open</code> 필요', '웹 강좌: 파이썬 <code>sqlite3</code> 모듈에 내장 → 설치 불필요'],
            notes: '<p>교실 PC 에 sqlite3.exe 가 있다면 직접 시연하고, 없다면 다음 슬라이드의 화면으로 설명합니다. 학생들은 파이썬 코드로 같은 결과를 확인합니다.</p><p>시간: 4분</p>' },
          { layout: 'diagram', title: 'SQLite 에 접속한 화면', html: T_START, caption: 'transient in-memory database = 임시 메모리 DB',
            notes: '<p>“transient” 는 “일시적인” 이라는 뜻. 이 상태에서 만든 테이블은 창을 닫으면 사라지므로 .open 으로 파일을 연다고 설명합니다.</p><p>시간: 2분</p>' },
          { layout: 'table', title: 'Tip. 자주 사용하는 SQLite 명령어', head: ['명령어', '하는 일'],
            rows: [['.open 이름', 'DB 파일 열기 · 만들기'], ['.table', '테이블 목록'], ['.schema 테이블', '테이블 구조(CREATE 문)'], ['.header on', 'SELECT 결과에 헤더 표시'], ['.mode column', '컬럼 모드로 정렬 출력'], ['.quit', '종료']],
            notes: '<p>점(.) 명령은 도구 전용이라 <b>세미콜론 없이</b>, SQL 문은 <b>세미콜론 필수</b>라는 차이를 강조합니다. SELECT 전에 .header on, .mode column 을 켜 두면 보기 좋다고 덧붙입니다.</p><p>시간: 3분</p>' },
          { layout: 'two', title: '❶ 데이터베이스 생성', left: { title: 'SQLite 명령행', html: T_OPEN }, right: { title: '파이썬', code: C_OPEN },
            notes: '<p>.open naverDB ↔ sqlite3.connect("naverDB"). 강의자료의 C:/CookPython 경로 대신 작업 폴더를 쓴다고 알려 줍니다. 실행해서 True 가 나오는지 확인합니다.</p><p>시간: 3분</p>' },
          { layout: 'diagram', title: '❷ 테이블 생성 — CREATE TABLE', html: T_CREATE, caption: 'CREATE TABLE 테이블이름(열이름1 데이터형식, 열이름2 데이터형식, …);',
            notes: '<p>형식을 먼저 보여 주고, id char(4) → “아이디 열, 문자 4글자” 처럼 한 열씩 읽어 줍니다. .table 과 .schema 결과도 설명합니다.</p><p>시간: 4분</p>' },
          { layout: 'code', title: '파이썬으로 ❷ CREATE · .table · .schema', code: C_CREATE,
            points: ['<code>DROP TABLE IF EXISTS</code> : 반복 실행 대비', '<code>sqlite_master</code> : 테이블 정보가 모인 특별 테이블', '<code>.table</code> ↔ name 열, <code>.schema</code> ↔ sql 열'],
            notes: '<p>도구 명령(.table/.schema)은 파이썬에 없으니 sqlite_master 를 조회한다는 점만 이해하면 됩니다. DROP 줄을 지우고 두 번 실행하면 어떻게 될지 질문해 다음 슬라이드로 넘어갑니다.</p><p>시간: 5분</p>' },
          { layout: 'two', title: '같은 테이블을 또 만들면?', left: { title: '오류', code: C_CREATE_TWICE_TRY }, right: { title: 'IF NOT EXISTS', code: C_CREATE_IF },
            notes: '<p>왼쪽을 실행해 <code>table userTable already exists</code> 오류를 보여 주고, 오른쪽의 IF NOT EXISTS 로 해결합니다. 이 장의 입력 예제가 이 방법을 쓴다는 것도 알려 줍니다.</p><p>시간: 4분</p>' },
          { layout: 'diagram', title: '❸ 데이터 입력 — INSERT', html: T_INSERT, caption: 'INSERT INTO 테이블이름 VALUES(값1, 값2, …);',
            notes: '<p>문자열은 작은따옴표, 숫자는 따옴표 없이. 값의 순서 = CREATE 할 때 열의 순서. 명령 프롬프트 창이 좁아 줄이 꺾여 보이는 것은 문제없다고 알려 줍니다.</p><p>시간: 3분</p>' },
          { layout: 'code', title: '파이썬으로 ❸ INSERT', code: C_INSERT,
            points: ['SQL 문을 <b>문자열</b>로 execute', '큰따옴표 문자열 안에 작은따옴표 값', '<code>con.commit()</code> 해야 파일에 저장', '<code>COUNT(*)</code> : 행 개수'],
            notes: '<p>명령행 도구는 자동 저장, 파이썬은 commit 필요 — 이 차이는 4교시에서 다시 다룹니다. 실행 결과 4가 나오는지 확인합니다.</p><p>시간: 5분</p>' },
          { layout: 'quiz', title: '확인 문제', q: 'SQL 문 끝에 세미콜론을 빠뜨리고 Enter 를 치면 sqlite3.exe 는?',
            options: ['오류를 내고 종료한다', '...&gt; 프롬프트로 다음 줄을 기다린다', '자동으로 세미콜론을 붙여 실행한다', '입력을 무시한다'], answer: 1,
            explain: 'SQL 문은 세미콜론까지가 한 문장이라, 없으면 계속 입력을 기다립니다. <code>;</code> 만 입력하고 Enter 를 치면 실행됩니다.',
            notes: '<p>실제로 자주 겪는 상황이라 꼭 짚어 줍니다. (1분)</p>' },
          { layout: 'practice', title: '실습 13-2. 책 테이블 구축하기', desc: '<p>bookTable(bookId, title, price)을 만들고 3권 입력 → CREATE 문과 행 개수 출력</p>', starter: PR_BOOK_S, solution: PR_BOOK,
            notes: '<p>CREATE · INSERT 를 스스로 써 보는 과제입니다. .schema 흉내는 예제 코드를 참고하게 합니다.</p><p>시간: 7분</p>' },
          { layout: 'summary', title: '정리', bullets: ['구축 과정: 설치 → 구축(❶~❹) → 활용', '.open ↔ <code>sqlite3.connect()</code>', 'CREATE TABLE 이름(열 형식, …);', 'INSERT INTO 이름 VALUES(값, …);', '점 명령은 ; 없이, SQL 문은 ; 필수'],
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
          { type: 'callout', kind: 'tip', title: '명령행 도구 ↔ 파이썬 한눈에 보기', html: '<table><tr><th>sqlite3.exe</th><th>파이썬 sqlite3</th></tr><tr><td><code>.open naverDB</code></td><td><code>con = sqlite3.connect("naverDB")</code></td></tr><tr><td><code>SQL 문;</code> 입력</td><td><code>cur.execute("SQL 문")</code> (세미콜론 생략 가능)</td></tr><tr><td>자동 저장</td><td><code>con.commit()</code></td></tr><tr><td>결과가 화면에 출력</td><td><code>cur.fetchone()</code> / <code>cur.fetchall()</code> 로 꺼내 print</td></tr><tr><td><code>.quit</code></td><td><code>con.close()</code></td></tr></table>' }
        ],
        practice: [
          { title: 'SELF STUDY 13-1. 제품 테이블 구축하기', level: 2,
            desc: '<p>naverDB 에 다음 제품 테이블(<code>productTable</code>)을 구축하고 컬럼 모드로 출력해 보세요.</p><table><tr><th>제품코드(pCode)</th><th>제품명(pName)</th><th>가격(price)</th><th>재고수량(amount)</th></tr><tr><td>p0001</td><td>노트북</td><td>110</td><td>5</td></tr><tr><td>p0002</td><td>마우스</td><td>3</td><td>22</td></tr><tr><td>p0003</td><td>키보드</td><td>2</td><td>11</td></tr></table><p>(강의자료는 sqlite3.exe 에서 하는 과제입니다. 집에 설치했다면 같은 SQL 을 직접 입력해 보세요.)</p>',
            hint: '제품코드와 제품명은 <code>char</code> 형, 가격과 재고수량은 <code>int</code> 형으로 지정합니다. 출력은 뼈대에 들어 있는 <code>show(cur)</code> 를 씁니다.',
            starter: PR_SS1_S, solution: PR_SS1,
            expect: 'pCode  pName   price  amount\n-----  ------  -----  ------\np0001  노트북  110    5\np0002  마우스  3      22\np0003  키보드  2      11' },
          { title: '실습 13-3. 조건 조회와 정렬', level: 2,
            desc: '<p>userTable 에서 ① 1990년 이후(1990 포함) 태어난 회원의 id 와 이름, ② 전체 회원을 출생연도 내림차순으로 <code>id|birthYear</code> 형식으로 출력하세요.</p>',
            hint: '<code>WHERE birthYear &gt;= 1990</code>, <code>ORDER BY birthYear DESC</code>',
            starter: PR_WHERE_S, solution: PR_WHERE,
            expect: '1990년 이후 출생\njohn John Bann\nkim Kim Chi\n출생연도 내림차순\nkim|1992\njohn|1990\nlee|1988\npark|1980' }
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
            explain: 'WHERE 가 없으면 모든 행이 대상입니다. 테이블 구조는 남고 행만 모두 지워집니다(테이블 자체를 지우는 것은 DROP TABLE).' }
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
          { layout: 'quiz', title: '확인 문제', q: "SELECT * FROM userTable WHERE id = 'park'; 에서 'park' 의 작은따옴표를 빼면?",
            options: ['똑같이 동작한다', 'park 를 열 이름으로 보아 no such column 오류', '모든 행이 나온다', '아무 행도 안 나온다(오류 없음)'], answer: 1,
            explain: '따옴표가 없으면 park 를 열 이름으로 해석해 <code>no such column: park</code> 오류가 납니다.',
            notes: '<p>파이썬 코드에서 직접 따옴표를 지우고 실행해 오류 메시지를 보여 주면 효과적입니다. (2분)</p>' },
          { layout: 'practice', title: 'SELF STUDY 13-1. 제품 테이블', desc: '<p>productTable(pCode, pName, price, amount)에 p0001 노트북 110 5 / p0002 마우스 3 22 / p0003 키보드 2 11 을 넣고 컬럼 모드로 출력</p>', starter: PR_SS1_S, solution: PR_SS1,
            notes: '<p>힌트: 코드 · 이름은 char, 가격 · 수량은 int. 이 테이블은 다음 교시 SELF STUDY 13-2, 13-3 에서도 씁니다.</p><p>시간: 10분</p>' },
          { layout: 'summary', title: '정리', bullets: ['SELECT * FROM 테이블; — 전체 조회', '.header on + .mode column → 표 모양', 'WHERE 조건 · ORDER BY 정렬', '파이썬: execute → fetchall → print', '보충: UPDATE · DELETE (WHERE 주의)'],
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
          { type: 'callout', kind: 'more', title: '📘 SQL 삽입(SQL Injection) 공격', html: '문자열 이어 붙이기로 SQL 을 만들면, 악의적인 사용자가 입력칸에 SQL 조각을 넣어 데이터를 훔치거나 지울 수 있습니다. 예를 들어 로그인 아이디 칸에 <code>\' OR \'1\'=\'1</code> 을 넣으면 조건이 항상 참이 되어 버립니다. 이것을 <b>SQL 삽입 공격</b>이라고 하며 실제로 많은 해킹 사고의 원인이었습니다. <code>?</code> 자리표시자는 값을 항상 “데이터” 로만 다루므로 이 공격을 막아 줍니다.' }
        ],
        practice: [
          { title: 'SELF STUDY 13-2. 제품 데이터 입력 프로그램', level: 2,
            desc: '<p>Code13-01 을 수정해서 SELF STUDY 13-1 의 <code>productTable</code>(제품코드, 제품명, 가격, 재고수량)에 데이터가 입력되도록 해 보세요. 제품코드를 비워 두고 Enter 를 치면 끝납니다.</p><p>“예시 입력으로 실행” 하면 p0004 모니터 25 7 을 입력합니다.</p>',
            hint: '테이블을 만들어야 하므로 11행에서 <code>cur.execute("CREATE TABLE … 문")</code> 도 수행해야 합니다 (<code>IF NOT EXISTS</code> 를 붙이면 반복 실행 가능). 가격 · 재고수량은 숫자이므로 따옴표 없이 이어 붙입니다.',
            starter: PR_SS2_S, solution: PR_SS2,
            stdin: 'p0004\n모니터\n25\n7\n\n',
            expect: '제품코드 ==> p0004\n제품명 ==> 모니터\n가격 ==> 25\n재고수량 ==> 7\n제품코드 ==>\nproductTable 의 제품 수 : 1' },
          { title: '실습 13-4. 리스트의 데이터를 한꺼번에 입력하기', level: 2,
            desc: '<p><code>scores</code> 리스트의 세 학생 성적을 for 문과 <code>?</code> 자리표시자로 <code>scoreTable</code> 에 입력한 뒤, 이름 · 국어 · 영어 · 합계를 출력하세요.</p>',
            hint: '<code>cur.execute("INSERT INTO scoreTable VALUES(?, ?, ?)", s)</code> — s 가 이미 튜플이므로 그대로 넘기면 됩니다. SQL 에서 <code>kor + eng</code> 처럼 열끼리 계산할 수도 있습니다.',
            starter: PR_MANY_S, solution: PR_MANY,
            expect: '철수 90 80 합계: 170\n영희 85 95 합계: 180\n민수 70 88 합계: 158' }
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
            explain: '값은 튜플로 넘깁니다. 값이 하나면 <code>("kim",)</code> 처럼 쉼표가 필요합니다. ? 를 따옴표로 감싸면 안 됩니다.' }
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
          { layout: 'two', title: '더 안전하게: ? 자리표시자', left: { title: '이어 붙이기 (위험)', bullets: ["<code>\"…VALUES('\" + data1 + \"',…\"</code>", "O'Neil 입력 → syntax error", 'SQL 삽입 공격에 취약'] }, right: { title: '? 자리표시자 (권장)', bullets: ['<code>"…VALUES(?, ?, ?, ?)"</code>', '<code>cur.execute(sql, (d1, d2, d3, d4))</code>', '따옴표 처리 자동 · 안전'] },
            notes: '<p>강의자료 밖 보충이지만 실무에서 필수입니다. 본문의 O\'Neil 오류 예제를 실행해 보여 주면 설득력이 있습니다.</p><p>시간: 4분</p>' },
          { layout: 'quiz', title: '확인 문제', q: 'Code13-01 에서 반복을 끝내려면?',
            options: ['출생연도에 0 입력', '사용자ID 에 아무것도 입력하지 않고 Enter', 'Ctrl+C', 'quit 입력'], answer: 1,
            explain: '<code>if data1 == "" : break</code> 이므로 ID 를 비워 두면 끝납니다.',
            notes: '<p>(1분)</p>' },
          { layout: 'practice', title: 'SELF STUDY 13-2. 제품 데이터 입력', desc: '<p>Code13-01 을 수정해 productTable(제품코드, 제품명, 가격, 재고수량)에 입력되게 하세요.</p>', starter: PR_SS2_S, solution: PR_SS2, stdin: 'p0004\n모니터\n25\n7\n\n',
            notes: '<p>힌트: 11행에 CREATE TABLE 문. 가격 · 수량은 숫자라 따옴표 없이. 따옴표 짝을 맞추는 데서 많이 막히니 순회하며 도와줍니다.</p><p>시간: 10분</p>' },
          { layout: 'summary', title: '정리', bullets: ['입력 6단계: 연결 → 커서 → 테이블 → 입력 → 커밋 → 닫기', '커서: SQL 실행 · 결과 반환 통로', 'commit() 해야 파일에 저장', '입력 반복: while True + 빈 입력이면 break', '보충: ? 자리표시자로 안전하게'],
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
            desc: '<code>con.row_factory = sqlite3.Row</code> 로 설정하면 행을 <code>row["email"]</code> 처럼 열 이름으로 꺼낼 수 있습니다. 열이 많을 때 번호를 헷갈리지 않아 편리합니다.' }
        ],
        practice: [
          { title: 'SELF STUDY 13-3. 제품 목록 조회 프로그램', level: 2,
            desc: '<p>Code13-02 를 수정해서 SELF STUDY 13-2 에서 입력한 <code>productTable</code> 의 내용이 출력되도록 해 보세요. (뼈대의 준비 코드가 테이블이 비어 있으면 p0001~p0003 을 넣어 둡니다.)</p>',
            hint: '테이블 이름을 productTable 로 바꾸고, 가격 · 재고수량은 정수이므로 <code>%d</code> 로 출력합니다.',
            starter: PR_SS3_S, solution: PR_SS3,
            expect: '제품코드    제품명      가격      재고수량\n----------------------------------------------\np0001     노트북     110       5\np0002     마우스       3      22\np0003     키보드       2      11' },
          { title: '실습 13-5. 회원 한 명 찾기', level: 2,
            desc: '<p>사용자 ID 를 입력받아 해당 회원의 이름 · 이메일 · 출생연도를 출력하고, 없으면 “없는 사용자입니다” 를 출력하세요.</p>',
            hint: '<code>cur.execute("SELECT * FROM userTable WHERE id = ?", (uid,))</code> 후 <code>fetchone()</code> 결과가 <code>None</code> 인지 검사합니다.',
            starter: PR_FIND_S, solution: PR_FIND, stdin: 'lee\n',
            expect: '찾을 사용자ID ==> lee\n이름 : Lee Pal\n이메일 : lee@paran.com\n출생연도 : 1988' }
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
            explain: '%5s 는 5칸에 오른쪽 정렬이라 앞에 공백 2칸이 붙습니다. 왼쪽 정렬은 %-5s 입니다.' }
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
          { layout: 'quiz', title: '확인 문제', q: 'fetchone() 으로 3행 중 1행을 꺼낸 뒤 fetchall() 을 부르면 몇 행이 돌아오나요?',
            options: ['0행', '1행', '2행', '3행'], answer: 2,
            explain: 'fetchall 은 아직 꺼내지 않은 나머지 행만 돌려줍니다.',
            notes: '<p>(1분)</p>' },
          { layout: 'practice', title: 'SELF STUDY 13-3. 제품 목록 조회', desc: '<p>Code13-02 를 수정해 productTable 의 내용을 출력하세요.</p>', starter: PR_SS3_S, solution: PR_SS3,
            notes: '<p>테이블 이름과 제목 줄, 서식(%d)만 바꾸면 됩니다. 한글 제품명은 %5s 로 맞추면 칸이 조금 어긋날 수 있다는 것도 관찰하게 합니다.</p><p>시간: 8분</p>' },
          { layout: 'practice', title: '실습 13-5. 회원 한 명 찾기', desc: '<p>ID 를 입력받아 그 회원 정보를 출력(없으면 “없는 사용자입니다”)</p>', starter: PR_FIND_S, solution: PR_FIND, stdin: 'lee\n',
            notes: '<p>WHERE + ? 자리표시자 + fetchone 의 None 검사를 모두 쓰는 종합 과제입니다. 빨리 끝낸 학생에게 제공합니다.</p><p>시간: 5분</p>' },
          { layout: 'summary', title: '정리', bullets: ['조회 5단계: 연결 → 커서 → SELECT → fetchone 반복 → 닫기', 'fetchone(): 한 행(튜플), 없으면 None', 'fetchall(): 남은 행 전부 (튜플의 리스트)', 'rows[i][j] : i번째 행의 j번째 열', '조회는 commit 불필요'],
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
          { type: 'callout', kind: 'more', title: '📘 이 장에서 쓴 sqlite3 기능 정리', html: '<table><tr><th>코드</th><th>설명</th></tr><tr><td><code>con = sqlite3.connect("파일")</code></td><td>DB 연결 (없으면 생성), <code>":memory:"</code> 는 임시 DB</td></tr><tr><td><code>cur = con.cursor()</code></td><td>커서 생성</td></tr><tr><td><code>cur.execute(sql[, 값튜플])</code></td><td>SQL 실행 (<code>?</code> 자리표시자에 값 전달)</td></tr><tr><td><code>cur.fetchone()</code> / <code>fetchall()</code></td><td>결과 한 행(튜플 또는 None) / 모든 행(리스트)</td></tr><tr><td><code>cur.description</code>, <code>cur.rowcount</code></td><td>결과의 열 정보 / 바뀐 행 수</td></tr><tr><td><code>con.commit()</code> / <code>rollback()</code></td><td>변경 확정 / 취소</td></tr><tr><td><code>con.close()</code></td><td>연결 닫기</td></tr></table>' }
        ],
        practice: [
          { title: '실습 13-6. 회원 삭제 프로그램', level: 2,
            desc: '<p>삭제할 사용자 ID 를 입력받아 userTable 에서 지우세요. 지워진 행이 없으면 “없는 사용자입니다”, 있으면 “○○ 삭제 완료” 를 출력하고 남은 회원 id 목록을 출력합니다.</p>',
            hint: '<code>DELETE FROM userTable WHERE id = ?</code> 실행 후 <code>cur.rowcount</code> 에 지워진 행 수가 들어 있습니다. commit 을 잊지 마세요.',
            starter: PR_DELETE_S, solution: PR_DELETE, stdin: 'kim\n',
            expect: "삭제할 사용자ID ==> kim\nkim 삭제 완료\n남은 회원 : ['john', 'lee', 'park']" },
          { title: '실습 13-7. GUI 제품 관리 프로그램', level: 3,
            desc: '<p>[프로그램 2]를 바꾸어 <code>productTable</code>(제품코드, 제품명, 가격, 재고수량)을 입력 · 조회하는 GUI 프로그램을 만드세요. 가격 · 재고수량이 숫자가 아니면 오류 메시지를 띄웁니다.</p>',
            hint: '개선판 코드에서 테이블 이름, 제목, 열 이름만 바꾸면 됩니다. <code>int(data[2])</code> 에서 ValueError 가 나면 except 로 잡힙니다.',
            starter: PR_GUIP_S, solution: PR_GUIP }
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
            explain: 'zip 은 같은 위치끼리 묶습니다: (id, year), (kim, 1992).' }
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
          { layout: 'quiz', title: '확인 문제', q: 'Listbox 의 모든 항목을 지우는 코드는?',
            options: ['lb.delete()', 'lb.delete(0, END)', 'lb.clear()', 'lb.insert(END, "")'], answer: 1,
            explain: 'delete(처음, 끝) — 0 부터 END 까지 지웁니다. Code13-03 의 delete(0, size()-1) 과 같습니다.',
            notes: '<p>(1분)</p>' },
          { layout: 'practice', title: '실습 13-6. 회원 삭제 프로그램', desc: '<p>ID 를 입력받아 DELETE, rowcount 로 결과 확인 후 남은 id 출력</p>', starter: PR_DELETE_S, solution: PR_DELETE, stdin: 'kim\n',
            notes: '<p>CRUD 중 D 를 직접 해 보는 과제입니다. rowcount 가 “방금 execute 로 바뀐 행 수” 라는 점을 알려 줍니다.</p><p>시간: 6분</p>' },
          { layout: 'practice', title: '실습 13-7. GUI 제품 관리 (도전)', desc: '<p>productTable 을 입력 · 조회하는 GUI 프로그램 (숫자 검사 포함)</p>', starter: PR_GUIP_S, solution: PR_GUIP,
            notes: '<p>도전 과제 · 과제로 내도 좋습니다. 개선판 코드를 참고하게 합니다.</p><p>시간: 남는 시간</p>' },
          { layout: 'summary', title: '13장 정리', bullets: ['DB · DBMS · 테이블 · 행 · 열 · SQL', 'SQLite: CREATE · INSERT · SELECT (WHERE · ORDER BY)', '입력: connect → cursor → execute → commit → close', '조회: execute(SELECT) → fetchone / fetchall', 'GUI: 버튼 command 에서 DB 입력 · 조회'],
            notes: '<p>장 전체를 정리합니다. 다음 장(미니 프로젝트)에서도 데이터를 저장하고 싶다면 SQLite 를 쓸 수 있다고 연결합니다. (2분)</p>' }
        ]
      }
    ]
  });
})();
