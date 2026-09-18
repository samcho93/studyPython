/* Chapter 11. 파일 입출력 (파이썬 for Beginner 3판 Ch11) */
(function () {
  /* ================================================================
     SVG 그리기 도우미
     ================================================================ */
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const MK = '<defs><marker id="c11ah" markerWidth="16" markerHeight="16" refX="14" refY="8" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L16,8 L0,16 z" fill="var(--muted)"/></marker>' +
    '<marker id="c11ok" markerWidth="16" markerHeight="16" refX="14" refY="8" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L16,8 L0,16 z" fill="var(--ok)"/></marker>' +
    '<marker id="c11ac" markerWidth="16" markerHeight="16" refX="14" refY="8" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L16,8 L0,16 z" fill="var(--accent)"/></marker></defs>';
  const SVG = (w, h, label, body) => `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="${label}">${MK}${body}</svg>`;

  // 글자 ('|' 로 줄바꿈)
  const T = (x, y, s, o = {}) => {
    const lines = String(s).split('|');
    const size = o.size || 22, lh = Math.round(size * 1.3);
    const y0 = Math.round(y - ((lines.length - 1) * lh) / 2 + size * 0.36);
    const st = (o.mono ? "font-family:Consolas,'D2Coding',monospace;" : '') + (o.bold ? 'font-weight:700;' : '') + `font-size:${size}px;fill:${o.fill || 'var(--fg)'}`;
    return `<text x="${x}" y="${y0}" text-anchor="${o.anchor || 'middle'}" style="${st}">` +
      lines.map((l, i) => `<tspan x="${x}" dy="${i ? lh : 0}">${esc(l)}</tspan>`).join('') + '</text>';
  };
  const BOX = (cx, cy, w, h, s, o = {}) =>
    `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${o.r == null ? 12 : o.r}" fill="${o.bg || 'var(--card)'}" stroke="${o.stroke || 'var(--accent)'}" stroke-width="${o.sw || 3}"${o.dash ? ' stroke-dasharray="8 6"' : ''}/>` + T(cx, cy, s, o);
  const ARR = (d, c, m) => `<path d="${d}" fill="none" stroke="${c || 'var(--muted)'}" stroke-width="3" marker-end="url(#${m || 'c11ah'})"/>`;
  const LINE = (d, c, w) => `<path d="${d}" fill="none" stroke="${c || 'var(--muted)'}" stroke-width="${w || 3}"/>`;

  /* ---------- 그림 11-1 표준 입출력과 파일 입출력 ---------- */
  const FIG_IO = SVG(1280, 470, '표준 입출력과 파일 입출력 함수',
    BOX(640, 235, 220, 380, '파이썬|프로그램', { stroke: 'var(--line)', bold: true, size: 28, bg: 'var(--card)' }) +
    BOX(120, 120, 180, 80, '⌨️ 키보드|(표준 입력)', { stroke: 'var(--accent2)', size: 20 }) +
    BOX(120, 350, 180, 80, '📄 파일', { stroke: 'var(--ok)', size: 22 }) +
    BOX(350, 120, 210, 80, 'input()', { stroke: 'var(--accent)', mono: true, size: 22 }) +
    BOX(350, 350, 210, 120, 'read()|readline()|readlines()', { stroke: 'var(--accent)', mono: true, size: 21 }) +
    ARR('M212,120 L242,120') + ARR('M212,350 L242,350') + ARR('M457,120 L527,120') + ARR('M457,350 L527,350') +
    BOX(930, 120, 210, 80, 'print()', { stroke: 'var(--warn)', mono: true, size: 22 }) +
    BOX(930, 350, 210, 100, 'write()|writelines()', { stroke: 'var(--warn)', mono: true, size: 21 }) +
    BOX(1160, 120, 180, 80, '🖥️ 모니터|(표준 출력)', { stroke: 'var(--accent2)', size: 20 }) +
    BOX(1160, 350, 180, 80, '📄 파일', { stroke: 'var(--ok)', size: 22 }) +
    ARR('M752,120 L822,120') + ARR('M752,350 L822,350') + ARR('M1037,120 L1067,120') + ARR('M1037,350 L1067,350') +
    T(350, 38, '입력 관련', { bold: true, fill: 'var(--accent)' }) + T(930, 38, '출력 관련', { bold: true, fill: 'var(--warn)' }) +
    T(640, 448, '입력은 키보드 또는 파일에서, 출력은 화면 또는 파일로 — 네 가지 조합이 모두 가능합니다', { size: 20, fill: 'var(--muted)' }));

  /* ---------- 그림 11-2 파일 처리 3단계 ---------- */
  const FIG_STEPS = SVG(1280, 380, '파일 처리의 3단계',
    BOX(200, 90, 300, 90, '1단계  파일 열기', { stroke: 'var(--accent)', bold: true, size: 26 }) +
    BOX(640, 90, 340, 90, '2단계  읽기 · 쓰기', { stroke: 'var(--ok)', bold: true, size: 26 }) +
    BOX(1080, 90, 300, 90, '3단계  파일 닫기', { stroke: 'var(--danger)', bold: true, size: 26 }) +
    ARR('M352,90 L466,90') + ARR('M812,90 L926,90') +
    BOX(200, 245, 360, 120, 'inFp = open("a.txt", "r")|outFp = open("b.txt", "w")', { stroke: 'var(--line)', mono: true, size: 19, sw: 2 }) +
    BOX(640, 245, 360, 120, 'inFp.readline()|outFp.write("글자")', { stroke: 'var(--line)', mono: true, size: 19, sw: 2 }) +
    BOX(1080, 245, 360, 120, 'inFp.close()|outFp.close()', { stroke: 'var(--line)', mono: true, size: 19, sw: 2 }) +
    T(640, 350, 'open() 이 돌려준 파일 변수(파일 객체)를 통해서 읽고 쓰고 닫습니다', { size: 20, fill: 'var(--muted)' }));

  /* ---------- readline() 의 동작 ---------- */
  const FIG_READLINE = SVG(1280, 420, 'readline 함수가 한 행씩 읽는 과정',
    `<rect x="40" y="40" width="560" height="250" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>` +
    T(320, 20, '📄 data1.txt', { bold: true, size: 22 }) +
    T(64, 90, 'CookBook 파이썬을 공부합니다.↵', { anchor: 'start', mono: true, size: 21 }) +
    T(64, 160, '완전 재미있어요. ^^↵', { anchor: 'start', mono: true, size: 21 }) +
    T(64, 230, '파이썬을 공부하기 잘했네요~~', { anchor: 'start', mono: true, size: 21 }) +
    T(64, 272, '(파일 끝)', { anchor: 'start', size: 18, fill: 'var(--muted)' }) +
    ARR('M610,90 L700,90', 'var(--accent)', 'c11ac') + ARR('M610,160 L700,160', 'var(--accent)', 'c11ac') +
    ARR('M610,230 L700,230', 'var(--accent)', 'c11ac') + ARR('M610,272 L700,300', 'var(--danger)') +
    T(710, 90, '1번째 readline() → \'CookBook 파이썬을 공부합니다.\\n\'', { anchor: 'start', size: 19, mono: true }) +
    T(710, 160, '2번째 readline() → \'완전 재미있어요. ^^\\n\'', { anchor: 'start', size: 19, mono: true }) +
    T(710, 230, '3번째 readline() → \'파이썬을 공부하기 잘했네요~~\'', { anchor: 'start', size: 19, mono: true }) +
    T(710, 306, '4번째 readline() → \'\'  (빈 문자열 = 끝)', { anchor: 'start', size: 19, mono: true, fill: 'var(--danger)' }) +
    T(640, 380, '파일 안에는 "지금 어디까지 읽었는지" 표시하는 위치(커서)가 있어서, 부를 때마다 다음 행을 돌려줍니다', { size: 20, fill: 'var(--muted)' }));

  /* ---------- 그림 11-7 copy 명령을 구현하는 파일 입출력 ---------- */
  const FIG_COPY = SVG(1280, 300, 'copy 명령어를 구현하는 파일 입출력',
    BOX(110, 150, 170, 90, '📄 win.ini|(소스)', { stroke: 'var(--ok)', size: 21 }) +
    BOX(360, 150, 230, 110, 'readlines()|for 한 행씩', { stroke: 'var(--accent)', mono: true, size: 20 }) +
    BOX(640, 150, 200, 150, '파이썬|프로그램', { stroke: 'var(--line)', bold: true, size: 24 }) +
    BOX(920, 150, 230, 110, 'writelines()|한 행씩 쓰기', { stroke: 'var(--warn)', mono: true, size: 20 }) +
    BOX(1170, 150, 170, 90, '📄 data3.txt|(타깃)', { stroke: 'var(--ok)', size: 21 }) +
    ARR('M196,150 L243,150') + ARR('M477,150 L538,150') + ARR('M742,150 L803,150') + ARR('M1037,150 L1083,150') +
    T(640, 270, '읽기용 파일(r)과 쓰기용 파일(w)을 동시에 열어 두고, 읽은 행을 그대로 씁니다', { size: 20, fill: 'var(--muted)' }));

  /* ---------- 암호화 원리 ---------- */
  const FIG_CRYPT = SVG(1280, 400, 'ord와 chr 함수를 이용한 암호화와 해독',
    BOX(140, 110, 170, 100, '파', { stroke: 'var(--accent)', bold: true, size: 44 }) +
    ARR('M227,110 L337,110') + T(282, 80, 'ord()', { mono: true, size: 20, fill: 'var(--accent)' }) +
    BOX(440, 110, 200, 80, '54028', { stroke: 'var(--line)', mono: true, size: 28 }) +
    ARR('M542,110 L652,110', 'var(--ok)', 'c11ok') + T(597, 80, '+ 100', { mono: true, size: 22, fill: 'var(--ok)', bold: true }) +
    BOX(760, 110, 200, 80, '54128', { stroke: 'var(--line)', mono: true, size: 28 }) +
    ARR('M862,110 L972,110') + T(917, 80, 'chr()', { mono: true, size: 20, fill: 'var(--accent)' }) +
    BOX(1080, 110, 170, 100, '퍰', { stroke: 'var(--danger)', bold: true, size: 44 }) +
    T(140, 190, '원래 글자', { size: 19, fill: 'var(--muted)' }) + T(1080, 190, '암호화된 글자', { size: 19, fill: 'var(--muted)' }) +
    ARR('M1080,215 L1080,300 L760,300', 'var(--danger)') + T(920, 280, 'ord() → 54128', { mono: true, size: 19, fill: 'var(--danger)' }) +
    BOX(620, 300, 260, 70, '54128 − 100', { stroke: 'var(--danger)', mono: true, size: 24 }) +
    ARR('M490,300 L140,300 L140,215', 'var(--danger)') + T(330, 280, 'chr(54028) → \'파\'', { mono: true, size: 19, fill: 'var(--danger)' }) +
    T(640, 380, '암호화: 글자 번호에 100을 더한다   ·   해독: 100을 뺀다 (secu = 100 또는 -100)', { size: 20, fill: 'var(--muted)', bold: true }));

  /* ---------- 텍스트 파일과 이진 파일 ---------- */
  const FIG_BIN = SVG(1280, 360, '텍스트 파일과 이진 파일의 차이',
    BOX(320, 70, 520, 70, '텍스트 파일 (data1.txt, win.ini …)', { stroke: 'var(--ok)', bold: true, size: 22 }) +
    BOX(960, 70, 520, 70, '이진 파일 (그림 · 소리 · 실행 파일 …)', { stroke: 'var(--warn)', bold: true, size: 22 }) +
    BOX(320, 190, 520, 110, '43 6F 6F 6B …  →  "Cook…"|바이트를 글자로 해석해야 의미가 있음', { stroke: 'var(--line)', size: 20, sw: 2 }) +
    BOX(960, 190, 520, 110, '00 23 64 FF …  →  밝기 · 색 · 명령|바이트 값(0~255) 자체가 의미', { stroke: 'var(--line)', size: 20, sw: 2 }) +
    T(320, 290, 'open(…, "r")  /  "w"   → 문자열(str)', { mono: true, size: 20, fill: 'var(--ok)' }) +
    T(960, 290, 'open(…, "rb") /  "wb"  → 바이트(bytes)', { mono: true, size: 20, fill: 'var(--warn)' }) +
    T(640, 340, '메모장으로 열었을 때 글자로 읽히면 텍스트 파일, 깨져 보이면 이진 파일', { size: 20, fill: 'var(--muted)' }));

  /* ---------- 그림 11-10 RAW 파일 구조 ---------- */
  const rawVals = [[0, 35, 100, 27, 255, 111, 12, 33], [1, 0, 55, 201, 66, 55, 22, 5], [12, 40, 80, 120, 160, 200, 240, 250]];
  let rawCells = '';
  rawVals.forEach((row, r) => row.forEach((v, c) => {
    const x = 200 + c * 90, y = 70 + r * 64;
    rawCells += `<rect x="${x}" y="${y}" width="90" height="64" fill="rgb(${v},${v},${v})" stroke="var(--line)" stroke-width="2"/>` +
      T(x + 45, y + 32, String(v), { size: 20, bold: true, fill: v > 120 ? '#111' : '#fff' });
  }));
  const FIG_RAW = SVG(1280, 400, 'RAW 사진 파일의 구조',
    T(560, 40, '← 256열 (가로 256개 점) →', { size: 22, bold: true }) +
    rawCells +
    T(560, 290, '⋮      (이렇게 256행)      ⋮', { size: 22, fill: 'var(--muted)' }) +
    T(150, 190, '256행', { size: 22, bold: true }) +
    `<circle cx="515" cy="166" r="34" fill="none" stroke="var(--danger)" stroke-width="4"/>` +
    ARR('M1000,166 L555,166', 'var(--danger)') +
    T(1020, 150, '점(픽셀) 하나 = 1바이트', { anchor: 'start', size: 21, bold: true, fill: 'var(--danger)' }) +
    T(1020, 184, '0(검정) ~ 255(흰색)', { anchor: 'start', size: 20, fill: 'var(--danger)' }) +
    T(640, 350, '머리글(header) 없이 밝기 값만 한 줄로 이어 붙인 파일 → 256 × 256 = 65,536 바이트', { size: 21, fill: 'var(--muted)' }));

  /* ---------- 그림 11-12 RAW 파일 → 메모리 → 화면 ---------- */
  let memGrid = '';
  for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) {
    const v = [[25, 77, 88, 33, 90], [99, 10, 55, 34, 12], [98, 32, 11, 78, 60], [40, 41, 42, 43, 44]][r][c];
    memGrid += `<rect x="${505 + c * 54}" y="${110 + r * 44}" width="54" height="44" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>` + T(532 + c * 54, 132 + r * 44, String(v), { size: 17, mono: true });
  }
  const FIG_LOAD = SVG(1280, 420, 'RAW 파일을 메모리로 읽은 뒤 화면에 출력하는 과정',
    BOX(160, 200, 240, 200, '💾 RAW 파일|RAW/tree.raw|(디스크)', { stroke: 'var(--ok)', size: 21 }) +
    ARR('M284,200 L490,200', 'var(--accent)', 'c11ac') + T(387, 160, '❶ loadImage()', { size: 21, bold: true, fill: 'var(--accent)' }) +
    T(387, 240, 'fp.read(1) × 65536', { size: 18, mono: true, fill: 'var(--muted)' }) +
    memGrid + T(640, 80, '메모리: 2차원 리스트 inImage', { size: 21, bold: true }) +
    T(640, 320, '256 × 256 개의 0~255 숫자', { size: 19, fill: 'var(--muted)' }) +
    ARR('M790,200 L990,200', 'var(--accent)', 'c11ac') + T(890, 160, '❷ displayImage()', { size: 21, bold: true, fill: 'var(--accent)' }) +
    T(890, 240, 'paper.put(…)', { size: 18, mono: true, fill: 'var(--muted)' }) +
    BOX(1130, 200, 240, 200, '🖥️ 윈도창|Canvas 위의|PhotoImage(paper)', { stroke: 'var(--warn)', size: 20 }) +
    T(640, 395, '디스크의 바이트 → 파이썬 리스트(숫자) → 화면의 점(색 문자열 #rrggbb)', { size: 20, fill: 'var(--muted)' }));

  /* ---------- 윈도창 · 캔버스 · 종이 ---------- */
  const FIG_PAPER = SVG(1280, 420, '윈도창, 캔버스, 흰 종이의 관계',
    `<rect x="380" y="20" width="440" height="380" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>` +
    `<rect x="380" y="20" width="440" height="40" rx="10" fill="var(--line)"/>` + T(400, 40, '🪶 흑백 사진 보기', { anchor: 'start', size: 18 }) +
    `<rect x="410" y="80" width="380" height="300" fill="none" stroke="var(--accent)" stroke-width="3" stroke-dasharray="8 6"/>` +
    `<rect x="450" y="100" width="300" height="260" fill="#ffffff" stroke="#222" stroke-width="4"/>` +
    ARR('M1000,40 L830,40') + T(1010, 40, 'window = Tk()', { anchor: 'start', mono: true, size: 20 }) +
    ARR('M1000,140 L800,140', 'var(--accent)', 'c11ac') + T(1010, 140, 'canvas = Canvas(…)', { anchor: 'start', mono: true, size: 20, fill: 'var(--accent)' }) +
    ARR('M1000,240 L760,240', 'var(--ok)', 'c11ok') + T(1010, 230, 'paper = PhotoImage(…)', { anchor: 'start', mono: true, size: 20, fill: 'var(--ok)' }) +
    T(1010, 262, '점을 찍을 흰 종이', { anchor: 'start', size: 18, fill: 'var(--muted)' }) +
    T(190, 150, '창(window) 안에', { size: 20 }) + T(190, 190, '캔버스(canvas)를 놓고', { size: 20 }) + T(190, 230, '그 위에 종이(paper)를', { size: 20 }) + T(190, 270, '붙인다', { size: 20 }));

  /* ---------- try · except · else · finally 흐름 ---------- */
  const FIG_TRY = SVG(1280, 440, 'try except else finally 문의 실행 흐름',
    BOX(640, 50, 380, 64, 'try :  실행할 문장들', { stroke: 'var(--accent)', mono: true, size: 22 }) +
    ARR('M560,82 L330,180', 'var(--danger)') + T(380, 118, '오류 발생', { size: 20, fill: 'var(--danger)', bold: true }) +
    ARR('M720,82 L950,180', 'var(--ok)', 'c11ok') + T(900, 118, '오류 없음', { size: 20, fill: 'var(--ok)', bold: true }) +
    BOX(310, 215, 420, 70, 'except 예외_종류 :  오류 처리', { stroke: 'var(--danger)', mono: true, size: 20 }) +
    BOX(970, 215, 420, 70, 'else :  정상일 때 할 일', { stroke: 'var(--ok)', mono: true, size: 20 }) +
    ARR('M310,250 L560,340') + ARR('M970,250 L720,340') +
    BOX(640, 370, 460, 70, 'finally :  무조건 실행', { stroke: 'var(--warn)', mono: true, size: 22 }) +
    T(640, 290, '둘 중 하나만 실행', { size: 19, fill: 'var(--muted)' }));

  /* ---------- 경로 비교 표 (여러 곳에서 사용) ---------- */
  const PATH_ROWS = [
    ['<code>C:/Temp/data1.txt</code>', '<code>data1.txt</code>', '예제용 파일 ★ (작업 폴더에 미리 있음)'],
    ['<code>C:/Windows/win.ini</code>', '<code>win.ini</code>', '윈도 설정 파일을 흉내 낸 작은 텍스트 파일 ★'],
    ['<code>C:/CookPython/normal.txt</code>', '<code>normal.txt</code>', '[프로그램 1] 원본 파일 ★'],
    ['<code>C:/CookPython/RAW/tree.raw</code>', '<code>RAW/tree.raw</code>', '작업 폴더 안의 RAW 폴더 ★ (tree · face · cat · pattern)'],
    ['<code>C:/Temp/data2.txt</code> (쓰기)', '<code>data2.txt</code>', '프로그램이 새로 만드는 파일'],
    ['<code>C:/Windows/notepad.exe</code>', '<code>RAW/cat.raw</code> 등', '브라우저에는 윈도 프로그램이 없어서 다른 이진 파일로 대신']
  ];

  PY_COURSE.addChapter({
    id: 'ch11',
    no: '11',
    title: '파일 입출력',
    subtitle: 'open · read · write · close · 이진 파일 · 예외 처리',
    summary: '프로그램이 끝나도 사라지지 않도록 데이터를 파일에 저장하고, 파일에서 다시 읽어 오는 방법을 배웁니다. 텍스트 파일과 이진 파일을 다루고, 파일 암호화 프로그램과 RAW 흑백 사진 보기 프로그램을 만든 뒤, os · shutil · zipfile 모듈과 try~except 예외 처리까지 익힙니다.',
    goals: [
      '파일 처리의 3단계(열기 → 읽기/쓰기 → 닫기)와 열기 모드(r · w · a · b)를 설명할 수 있다',
      'readline() · readlines() · for 문으로 텍스트 파일을 읽고, write() · writelines() 로 파일에 쓸 수 있다',
      'os.path.exists() 로 파일이 있는지 확인하고, 도스의 type · copy 명령을 파이썬으로 구현할 수 있다',
      'ord() · chr() 로 글자를 바꿔 파일을 암호화 · 해독하는 프로그램을 만들 수 있다',
      'rb · wb 모드로 이진 파일을 복사하고, RAW 흑백 사진을 읽어 tkinter 창에 출력할 수 있다',
      'os · os.path · shutil · zipfile 로 파일과 폴더를 다루고, try~except~else~finally 로 오류를 처리할 수 있다'
    ],
    sections: [
      /* ================================================================
       * 11-1. 파일 입출력의 기본과 텍스트 파일 읽기 (Section 01 ~ 03 앞부분)
       * ================================================================ */
      {
        id: 'ch11-1',
        title: '파일 입출력의 기본과 텍스트 파일 읽기',
        minutes: 50,
        goals: [
          '표준 입출력과 파일 입출력의 차이를 설명할 수 있다',
          '파일 처리 3단계와 open() 의 모드를 이해한다',
          'readline() · readlines() · for 문으로 텍스트 파일을 읽을 수 있다',
          'with ~ as 문으로 파일을 자동으로 닫을 수 있다'
        ],
        flow: [['도입 · 이 장에서 만들 프로그램', 5], ['파일 입출력 개념 · 3단계 · 모드', 12], ['readline · readlines 예제', 20], ['SELF STUDY · 퀴즈', 13]],
        content: [
          { type: 'h', text: '이 장에서 만들 프로그램' },
          { type: 'p', html: '지금까지 만든 프로그램은 실행이 끝나면 입력한 값과 결과가 모두 사라졌습니다. 변수는 <b>메모리(RAM)</b> 에 있고, 메모리는 프로그램이 끝나면 비워지기 때문입니다. 데이터를 오래 보관하려면 <b>디스크의 파일</b>에 저장해야 합니다. 이번 장에서는 파일에서 읽고(입력) 파일에 쓰는(출력) 방법을 배우고, 다음 두 프로그램을 완성합니다.' },
          { type: 'list', items: [
            '<b>[프로그램 1] 파일 암호화 및 암호 해독</b> — <code>normal.txt</code> 의 글자를 모두 다른 글자로 바꿔 <code>security.txt</code> 에 저장하고(암호화), 다시 원래대로 되돌립니다(해독). (11-3 교시)',
            '<b>[프로그램 2] 흑백 사진 출력</b> — 256×256 크기의 RAW 흑백 사진 파일을 한 바이트씩 읽어서 tkinter 창에 그림으로 보여 줍니다. (11-4 교시)'
          ] },
          { type: 'figure', html: `<div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center;font-family:Consolas,'D2Coding',monospace;font-size:14px">
<div style="border:2px solid var(--line);border-radius:10px;padding:10px 14px;background:var(--card)"><b>normal.txt (원본)</b><br>안녕하세요?<br>저는 Cookbook 파이썬을 즐겁게<br>공부하고 있습니다. ^___^</div>
<div style="align-self:center;font-size:24px">➜</div>
<div style="border:2px solid var(--danger);border-radius:10px;padding:10px 14px;background:var(--card)"><b>security.txt (암호화)</b><br>얬놹햼솜웸£n...<br>(알아볼 수 없는 글자)</div>
<div style="align-self:center;font-size:24px">➜</div>
<div style="border:2px solid var(--ok);border-radius:10px;padding:10px 14px;background:var(--card)"><b>recovery.txt (해독)</b><br>안녕하세요?<br>저는 Cookbook 파이썬을 즐겁게<br>공부하고 있습니다. ^___^</div></div>`, caption: '[프로그램 1] 원본 → 암호화된 파일 → 다시 해독된 파일' },
          { type: 'callout', kind: 'info', title: '📁 이 강좌의 파일은 “작업 폴더”에 있습니다', html: '<p>강의자료는 <code>C:/Temp/data1.txt</code>, <code>C:/Windows/win.ini</code>, <code>C:/CookPython/RAW/tree.raw</code> 처럼 윈도 PC 의 경로를 씁니다. 이 웹 강좌의 파이썬은 <b>브라우저 안</b>에서 실행되므로 여러분 PC 의 C: 드라이브에 접근할 수 없습니다. 대신 프로그램의 현재 폴더인 <b>📁 작업 폴더</b>를 사용합니다. 그래서 예제는 모두 <code>\'data1.txt\'</code>, <code>\'RAW/tree.raw\'</code> 처럼 <b>상대 경로</b>(현재 폴더 기준 경로)로 바꾸었습니다.</p><p>예제에 필요한 파일(★)은 작업 폴더에 미리 들어 있고, 콘솔의 <b>📁 작업 폴더</b> 버튼으로 목록과 내용을 볼 수 있습니다. 프로그램이 만든 파일도 여기에 생기며, 페이지를 새로 고치면 처음 상태로 돌아갑니다.</p>' },
          { type: 'table', head: ['강의자료의 경로', '이 강좌의 경로', '설명'], rows: PATH_ROWS, caption: '경로 바꾸기 — 집에서 IDLE 로 실습할 때는 강의자료의 경로를 그대로 써도 됩니다' },

          { type: 'h', text: '파일 입출력의 개념' },
          { type: 'p', html: '지금까지는 키보드로 입력받고(<code>input()</code>) 화면에 출력했습니다(<code>print()</code>). 이것을 <b>표준 입출력</b>이라고 합니다. 입력을 키보드 대신 <b>파일</b>에서 받거나, 출력을 화면 대신 <b>파일</b>로 보내는 것이 <b>파일 입출력(File Input/Output)</b> 입니다. 파일에서 읽을 때는 <code>read()</code> · <code>readline()</code> · <code>readlines()</code>, 파일에 쓸 때는 <code>write()</code> · <code>writelines()</code> 함수를 씁니다.' },
          { type: 'figure', html: FIG_IO, caption: '그림 11-1 표준 입출력과 파일 입출력 함수' },

          { type: 'h', text: '파일 입출력의 기본 과정 — 3단계' },
          { type: 'p', html: '파일은 책과 비슷합니다. 책을 <b>펼치고(열기)</b> → <b>읽거나 쓰고</b> → <b>덮습니다(닫기)</b>. 파이썬의 파일 처리도 항상 이 3단계를 거칩니다.' },
          { type: 'figure', html: FIG_STEPS, caption: '그림 11-2 파일 처리의 3단계' },
          { type: 'list', ordered: true, items: [
            '<b>1단계 파일 열기</b> : <code>변수명 = open("파일명", "r")</code> (읽기용), <code>변수명 = open("파일명", "w")</code> (쓰기용). <code>open()</code> 은 열린 파일을 다루는 <b>파일 객체</b>를 돌려주고, 이것을 변수에 저장해 두고 사용합니다.',
            '<b>2단계 파일 처리</b> : 파일 변수로 읽기(<code>inFp.readline()</code>) 또는 쓰기(<code>outFp.write(…)</code>)를 합니다.',
            '<b>3단계 파일 닫기</b> : <code>변수명.close()</code> — 1단계에서 연 파일 변수를 닫습니다. (파이썬은 강의자료처럼 끝에 <code>;</code> 를 붙이지 않아도 됩니다)'
          ] },
          { type: 'table', head: ['모드', '설명'], rows: [
            ['생략', '<code>r</code> 과 같다'],
            ['<code>r</code>', '읽기(read) 모드. 기본값. 파일이 없으면 오류(FileNotFoundError)'],
            ['<code>w</code>', '쓰기(write) 모드. 파일이 없으면 새로 만들고, <b>있으면 내용을 지우고 덮어쓴다</b>'],
            ['<code>r+</code>', '읽기/쓰기 겸용 모드'],
            ['<code>a</code>', '추가(append) 모드. 기존 파일이 있으면 <b>끝에 이어서</b> 쓴다'],
            ['<code>t</code>', '텍스트 모드. 텍스트 파일을 처리한다. 기본값 (<code>"rt"</code> = <code>"r"</code>)'],
            ['<code>b</code>', '이진(binary) 모드. 그림 같은 이진 파일을 처리한다 (<code>"rb"</code>, <code>"wb"</code>)']
          ], caption: '표 11-1 파일의 열기 모드 (open() 의 마지막 매개변수)' },
          { type: 'callout', kind: 'warn', title: '"w" 모드는 기존 내용을 지웁니다', html: '이미 있는 파일을 <code>"w"</code> 로 열면 여는 순간 내용이 모두 사라집니다. 기존 내용 뒤에 덧붙이고 싶으면 <code>"a"</code> 모드를 쓰세요. 읽기용 파일을 실수로 <code>"w"</code> 로 여는 일이 없도록 조심합니다.' },

          { type: 'h', text: '파일을 이용한 입력 — 한 행씩 읽어 들이기' },
          { type: 'p', html: '먼저 파일에서 읽어 화면에 출력해 봅시다. 강의자료에서는 메모장으로 <code>C:/Temp/data1.txt</code> 를 직접 만들지만, 이 강좌에는 같은 내용의 <code>data1.txt</code> 가 작업 폴더에 준비되어 있습니다.' },
          { type: 'code', run: false, title: 'data1.txt (작업 폴더에 있는 예제 파일)', code: 'CookBook 파이썬을 공부합니다.\n완전 재미있어요. ^^\n파이썬을 공부하기 잘했네요~~' },
          { type: 'p', html: '<code>readline()</code> 함수는 파일에서 <b>한 행</b>을 읽어 문자열로 돌려줍니다. 부를 때마다 다음 행을 읽습니다.' },
          { type: 'code', title: 'Code11-01. 파일에서 한 행씩 세 번 읽기', code: `inFp = None       # 입력 파일
inStr = ""        # 읽어 온 문자열

inFp = open("data1.txt", "r")

inStr = inFp.readline()
print(inStr, end = "")

inStr = inFp.readline()
print(inStr, end = "")

inStr = inFp.readline()
print(inStr, end = "")

inFp.close()`, expect: `CookBook 파이썬을 공부합니다.
완전 재미있어요. ^^
파이썬을 공부하기 잘했네요~~`,
            desc: '<code>4행</code> 읽기 모드로 파일을 엽니다. <code>6행</code> 첫 행을 읽습니다. 읽은 문자열 끝에는 줄바꿈 문자 <code>\\n</code> 이 붙어 있으므로 <code>print(…, end = "")</code> 로 print 의 줄바꿈을 없앱니다. <code>15행</code> 다 쓴 파일은 닫습니다.' },
          { type: 'figure', html: FIG_READLINE, caption: 'readline() 은 부를 때마다 다음 행을 읽고, 더 읽을 행이 없으면 빈 문자열을 돌려준다' },
          { type: 'callout', kind: 'more', title: '📘 end = "" 를 빼면?', html: '<code>print(inStr)</code> 로 출력하면 행 끝의 <code>\\n</code> 과 print 가 붙이는 줄바꿈이 겹쳐서 <b>한 줄씩 빈 줄</b>이 생깁니다. <code>inStr.rstrip("\\n")</code> 이나 <code>inStr.strip()</code> 으로 행 끝의 줄바꿈을 지우는 방법도 자주 씁니다.' },

          { type: 'h', text: '텍스트 파일의 모든 행 읽기' },
          { type: 'p', html: 'Code11-01 은 파일이 세 줄이라는 것을 알고 세 번 읽었습니다. 행 수를 모를 때는 <code>while True</code> 로 계속 읽다가, <code>readline()</code> 이 <b>빈 문자열 <code>""</code></b> 을 돌려주면(파일 끝) <code>break</code> 로 멈춥니다.' },
          { type: 'code', title: 'Code11-02. 모든 행을 읽어 출력하기', code: `inFp = None       # 입력 파일
inStr = ""        # 읽어 온 문자열

inFp = open("data1.txt", "r")

while True :
    inStr = inFp.readline()
    if inStr == "" :
        break
    print(inStr, end = "")

inFp.close()`, expect: `CookBook 파이썬을 공부합니다.
완전 재미있어요. ^^
파이썬을 공부하기 잘했네요~~`,
            desc: '빈 줄은 <code>"\\n"</code> 이므로 파일 중간의 빈 줄에서는 멈추지 않습니다. 진짜 파일 끝에서만 <code>""</code> 가 나옵니다. (강의자료의 <code>break;</code> 처럼 세미콜론을 붙여도 동작하지만 파이썬에서는 보통 쓰지 않습니다)' },
          { type: 'callout', kind: 'tip', title: '파일 확장명 보이게 하기', html: '윈도 탐색기는 기본 설정에서 <code>.txt</code> 같은 확장명을 숨깁니다. 메모장으로 <code>data1.txt</code> 를 만들었는데 실제 이름이 <code>data1.txt.txt</code> 가 되는 실수가 흔합니다. 탐색기의 <b>[보기] → 파일 확장명</b>(윈도 10/11)에 체크해 두세요. 이 강좌의 작업 폴더에서는 확장명이 항상 보입니다.' },

          { type: 'h', text: '한 번에 모두 읽어 들이기 — readlines()' },
          { type: 'p', html: '<code>readlines()</code> 함수는 파일의 모든 행을 통째로 읽어 <b>리스트</b>로 돌려줍니다. 리스트의 각 항목이 한 행입니다.' },
          { type: 'code', title: 'Code11-03. readlines() 로 한 번에 읽기', code: `inFp = None
inList = ""

inFp = open("data1.txt", "r")

inList = inFp.readlines()
print(inList)

inFp.close()`, expect: `['CookBook 파이썬을 공부합니다.\\n', '완전 재미있어요. ^^\\n', '파이썬을 공부하기 잘했네요~~']`,
            desc: '마지막 행에는 줄바꿈이 없어서 <code>\\n</code> 이 붙지 않았습니다. (강의자료 2행의 <code>inList = ""</code> 는 곧 리스트로 바뀌므로 <code>[]</code> 로 써도 됩니다)' },
          { type: 'callout', kind: 'info', title: '여기서 잠깐 — with ~ as 문', html: '<p><code>close()</code> 를 깜빡하면 쓴 내용이 파일에 다 저장되지 않는 등 문제가 생길 수 있습니다. <code>with open(…) as 변수 :</code> 로 열면 블록이 끝날 때 파이썬이 <b>자동으로 닫아</b> 주므로 <code>close()</code> 를 쓰지 않습니다.</p>' },
          { type: 'code', title: 'Code11-03 을 with ~ as 문으로 바꾸기', code: `with open("data1.txt", "r") as inFp :
    inList = inFp.readlines()
    print(inList)

print("with 블록이 끝나면 파일이 닫혔나요?", inFp.closed)`, expect: `['CookBook 파이썬을 공부합니다.\\n', '완전 재미있어요. ^^\\n', '파이썬을 공부하기 잘했네요~~']
with 블록이 끝나면 파일이 닫혔나요? True`,
            desc: '<code>5행</code>은 확인용으로 추가한 줄입니다. 파일 객체의 <code>closed</code> 속성이 <code>True</code> 이면 닫힌 것입니다.' },

          { type: 'h', text: '리스트를 한 행씩 출력하기' },
          { type: 'p', html: '<code>readlines()</code> 로 얻은 리스트를 <code>for</code> 문으로 하나씩 꺼내면 한 행씩 처리할 수 있습니다.' },
          { type: 'code', title: 'Code11-04. readlines() 결과를 한 행씩 출력', code: `inFp = None
inList, inStr = [], ""

inFp = open("data1.txt", "r")

inList = inFp.readlines()
for inStr in inList :
    print(inStr, end = "")

inFp.close()`, expect: `CookBook 파이썬을 공부합니다.
완전 재미있어요. ^^
파이썬을 공부하기 잘했네요~~` },
          { type: 'callout', kind: 'more', title: '📘 파일 객체를 바로 for 문에 쓰기 · read()', html: '<p>파일 객체는 그 자체로 <code>for</code> 문에 쓸 수 있습니다. <code>for inStr in inFp :</code> 라고 쓰면 한 행씩 읽어 옵니다. <code>readlines()</code> 처럼 리스트를 만들지 않으므로 큰 파일에 좋습니다.</p><p><code>read()</code> 는 파일 전체를 <b>문자열 하나</b>로 읽습니다. <code>read(5)</code> 처럼 숫자를 주면 그 글자 수만큼만 읽습니다.</p>' },
          { type: 'code', title: '추가 예제. for 문 · read() 로 읽기', code: `with open("data1.txt", "r") as inFp :
    for inStr in inFp :                   # 파일 객체를 바로 반복
        print("[" + inStr.strip() + "]")

with open("data1.txt", "r") as inFp :
    allStr = inFp.read()                  # 전체를 문자열 하나로
print(len(allStr), "글자")
print(allStr.split("\\n")[1])`, expect: `[CookBook 파이썬을 공부합니다.]
[완전 재미있어요. ^^]
[파이썬을 공부하기 잘했네요~~]
50 글자
완전 재미있어요. ^^` },
          { type: 'callout', kind: 'more', title: '📘 인코딩(encoding) 과 한글', html: '파일에 저장되는 것은 글자가 아니라 <b>바이트</b>입니다. 글자를 바이트로 바꾸는 규칙을 <b>인코딩</b>이라 하고, 요즘은 대부분 <b>UTF-8</b> 을 씁니다. 윈도의 IDLE 에서 한글 파일을 읽을 때 <code>UnicodeDecodeError</code> 가 나면 <code>open("data1.txt", "r", encoding = "utf-8")</code> 처럼 인코딩을 적어 주세요. (이 강좌의 파이썬은 기본이 UTF-8 입니다)' }
        ],
        practice: [
          {
            title: 'SELF STUDY 11-1. 행 번호 붙여 출력하기 (readline)',
            level: 1,
            desc: '<p>Code11-02 를 수정해서 각 행 앞에 행 번호를 붙여 출력하세요.</p><pre>1: CookBook 파이썬을 공부합니다.\n2: 완전 재미있어요. ^^\n3: 파이썬을 공부하기 잘했네요~~</pre>',
            hint: '1, 2, 3… 으로 늘어나는 변수를 하나 추가하고, <code>print("%d: %s" % (번호, inStr), end = "")</code> 를 사용합니다.',
            starter: `inFp = None
inStr = ""
# TODO: 행 번호 변수 추가

inFp = open("data1.txt", "r")

while True :
    inStr = inFp.readline()
    if inStr == "" :
        break
    print(inStr, end = "")    # TODO: 행 번호 붙이기

inFp.close()
`,
            solution: `inFp = None
inStr = ""
lineNum = 1

inFp = open("data1.txt", "r")

while True :
    inStr = inFp.readline()
    if inStr == "" :
        break
    print("%d: %s" % (lineNum, inStr), end = "")
    lineNum += 1

inFp.close()
`,
            expect: `1: CookBook 파이썬을 공부합니다.
2: 완전 재미있어요. ^^
3: 파이썬을 공부하기 잘했네요~~`
          },
          {
            title: 'SELF STUDY 11-2. 행 번호 붙여 출력하기 (readlines)',
            level: 1,
            desc: '<p>Code11-04 를 수정해서 SELF STUDY 11-1 과 같은 결과를 출력하세요.</p>',
            hint: '<code>for</code> 문 앞에 번호 변수를 만들거나, <code>enumerate(inList, 1)</code> 를 쓸 수도 있습니다.',
            starter: `inFp = None
inList, inStr = [], ""

inFp = open("data1.txt", "r")

inList = inFp.readlines()
for inStr in inList :
    print(inStr, end = "")    # TODO: 행 번호 붙이기

inFp.close()
`,
            solution: `inFp = None
inList, inStr = [], ""
lineNum = 1

inFp = open("data1.txt", "r")

inList = inFp.readlines()
for inStr in inList :
    print("%d: %s" % (lineNum, inStr), end = "")
    lineNum += 1

inFp.close()
`,
            expect: `1: CookBook 파이썬을 공부합니다.
2: 완전 재미있어요. ^^
3: 파이썬을 공부하기 잘했네요~~`
          },
          {
            title: '실습 11-1. 행 수 · 글자 수 세기',
            level: 2,
            desc: '<p><code>data1.txt</code> 를 읽어서 <b>행 수</b>와 각 행의 <b>글자 수</b>(줄바꿈 문자 제외), 그리고 가장 긴 행을 출력하세요.</p><pre>1행 : 20글자\n2행 : 12글자\n3행 : 16글자\n행 수 : 3\n가장 긴 행 : CookBook 파이썬을 공부합니다.</pre>',
            hint: '<code>inStr.rstrip("\\n")</code> 으로 줄바꿈을 지운 뒤 <code>len()</code> 을 사용합니다. 가장 긴 행은 변수에 기억해 두면서 비교합니다.',
            starter: `with open("data1.txt", "r") as inFp :
    inList = inFp.readlines()

longest = ""
# TODO: 각 행의 글자 수 출력, 가장 긴 행 찾기

print("행 수 :", len(inList))
print("가장 긴 행 :", longest)
`,
            solution: `with open("data1.txt", "r") as inFp :
    inList = inFp.readlines()

longest = ""
for i in range(len(inList)) :
    line = inList[i].rstrip("\\n")
    print("%d행 : %d글자" % (i + 1, len(line)))
    if len(line) > len(longest) :
        longest = line

print("행 수 :", len(inList))
print("가장 긴 행 :", longest)
`,
            expect: `1행 : 20글자
2행 : 12글자
3행 : 16글자
행 수 : 3
가장 긴 행 : CookBook 파이썬을 공부합니다.`
          }
        ],
        quiz: [
          { q: '파일 처리의 3단계를 순서대로 바르게 나열한 것은?', options: ['읽기/쓰기 → 열기 → 닫기', '열기 → 읽기/쓰기 → 닫기', '열기 → 닫기 → 읽기/쓰기', '닫기 → 열기 → 읽기/쓰기'], answer: 1, explain: '<code>open()</code> 으로 열고, 읽거나 쓴 뒤, <code>close()</code> 로 닫습니다.' },
          { q: '이미 내용이 있는 <code>memo.txt</code> 를 <code>open("memo.txt", "w")</code> 로 열면?', options: ['오류가 난다', '기존 내용 뒤에 이어서 쓸 준비가 된다', '기존 내용이 모두 지워진다', '읽기 전용으로 열린다'], answer: 2, explain: '<code>"w"</code> 는 덮어쓰기 모드입니다. 이어서 쓰려면 <code>"a"</code> 를 씁니다.' },
          { q: '<code>readline()</code> 이 파일 끝에 도달했을 때 돌려주는 값은?', options: ['<code>None</code>', '<code>"\\n"</code>', '<code>""</code> (빈 문자열)', '<code>-1</code>'], answer: 2, explain: '빈 줄은 <code>"\\n"</code>, 파일 끝은 <code>""</code> 입니다. 그래서 <code>if inStr == "" : break</code> 로 반복을 끝냅니다.' },
          { q: '세 줄짜리 파일에서 <code>inFp.readlines()</code> 의 결과 형태는?', options: ['문자열 하나', '세 개의 문자열이 든 리스트', '정수 3', '튜플'], answer: 1, explain: '각 행이 문자열 항목이 되는 리스트를 돌려줍니다.' },
          { q: '다음 중 <code>close()</code> 를 쓰지 않아도 파일이 자동으로 닫히는 방법은?', options: ['<code>open(…).close</code>', '<code>with open(…) as f :</code>', '<code>for f in open :</code>', '<code>del open</code>'], answer: 1, explain: '<code>with ~ as</code> 블록이 끝나면 파일이 자동으로 닫힙니다.' }
        ],
        slides: [
          { layout: 'title', title: '파일 입출력의 기본과 텍스트 파일 읽기', subtitle: 'Chapter 11 파일 입출력 · Section 01~03', badge: '11-1',
            notes: '<p><b>[도입 2분]</b> 발문: “게임을 끄고 다시 켜도 레벨이 그대로인 이유는?” → 파일(디스크)에 저장했기 때문. 변수는 메모리에 있어서 프로그램이 끝나면 사라진다는 점을 짚습니다.</p>' },
          { layout: 'bullets', title: '이 장에서 만들 프로그램', bullets: ['<b>[프로그램 1]</b> 파일 암호화 및 암호 해독 — <code>ord()</code> · <code>chr()</code> 로 글자 바꾸기', '<b>[프로그램 2]</b> 흑백 사진 출력 — RAW 파일을 바이트 단위로 읽어 tkinter 창에 그리기', '그 밖에: 도스 type · copy 명령 구현, 폴더 · 압축 다루기, 예외 처리'],
            notes: '<p><b>[3분]</b> 11-3, 11-4 교시의 완성 코드를 미리 실행해서 보여 주면 동기 부여가 됩니다. 특히 흑백 사진이 한 번에 나타나는 모습을 보여 주세요.</p>' },
          { layout: 'table', title: '📁 경로는 작업 폴더 기준으로', head: ['강의자료', '이 강좌', '비고'], rows: PATH_ROWS.slice(0, 5),
            notes: '<p><b>[2분]</b> 브라우저 파이썬은 PC 의 C: 드라이브에 접근할 수 없어 “작업 폴더”를 쓴다는 점, 예제 파일(★)은 미리 들어 있다는 점을 알려 줍니다. 콘솔의 📁 작업 폴더 버튼을 직접 눌러 data1.txt 내용을 보여 주세요.</p><p>집에서 IDLE 을 쓰는 학생은 강의자료 경로 그대로 써도 됩니다.</p>' },
          { layout: 'diagram', title: '표준 입출력과 파일 입출력', html: FIG_IO, caption: '입력: input() / read · readline · readlines   출력: print() / write · writelines',
            notes: '<p><b>[3분]</b> 입력 2가지 × 출력 2가지 = 4가지 조합. 이번 교시는 “파일 입력 → 화면 출력”, 다음 교시는 “키보드 입력 → 파일 출력”, “파일 → 파일”입니다.</p>' },
          { layout: 'diagram', title: '파일 처리의 3단계', html: FIG_STEPS, caption: '열기(open) → 읽기 · 쓰기 → 닫기(close)',
            notes: '<p><b>[3분]</b> 책 비유: 펼치고 → 읽거나 쓰고 → 덮는다. open() 이 돌려주는 것은 파일 내용이 아니라 “파일을 다루는 손잡이(파일 객체)”라는 점을 강조합니다.</p>' },
          { layout: 'table', title: '표 11-1 파일의 열기 모드', head: ['모드', '의미'], rows: [['r (생략)', '읽기 — 기본값, 파일 없으면 오류'], ['w', '쓰기 — 있으면 <b>덮어씀</b>'], ['a', '추가 — 끝에 이어서 씀'], ['r+', '읽기/쓰기 겸용'], ['t / b', '텍스트(기본) / 이진 — rb, wb 처럼 조합']],
            notes: '<p><b>[3분]</b> 가장 많이 하는 실수: 읽으려던 파일을 "w" 로 열어 내용이 날아가는 것. “w 는 지우개부터 들고 온다”고 기억시키세요.</p>' },
          { layout: 'code', title: 'Code11-01. 한 행씩 읽기', code: `inFp = open("data1.txt", "r")

inStr = inFp.readline()
print(inStr, end = "")

inStr = inFp.readline()
print(inStr, end = "")

inStr = inFp.readline()
print(inStr, end = "")

inFp.close()`, points: ['<code>readline()</code> : 부를 때마다 다음 한 행', '읽은 행 끝에 <code>\\n</code> 이 붙어 있음 → <code>end = ""</code>', '다 쓰면 <code>close()</code>'],
            notes: '<p><b>[4분]</b> 실행 후 <code>end = ""</code> 를 지우고 다시 실행해 빈 줄이 생기는 것을 보여 줍니다. 발문: “왜 빈 줄이 생겼을까?”</p>' },
          { layout: 'diagram', title: 'readline() 의 동작', html: FIG_READLINE, caption: '파일 끝에서는 빈 문자열 "" 을 돌려준다',
            notes: '<p><b>[2분]</b> 파일 안의 “읽는 위치(커서)”가 한 행씩 내려간다고 설명합니다. 빈 줄은 "\\n", 파일 끝은 "" 로 다르다는 점이 다음 코드의 핵심입니다.</p>' },
          { layout: 'code', title: 'Code11-02. 모든 행 읽기', code: `inFp = open("data1.txt", "r")

while True :
    inStr = inFp.readline()
    if inStr == "" :
        break
    print(inStr, end = "")

inFp.close()`, points: ['행 수를 몰라도 끝까지 읽기', '<code>""</code> 가 나오면 파일 끝 → <code>break</code>', '<code>if not inStr :</code> 로 써도 같음'],
            notes: '<p><b>[3분]</b> 7장의 while True + break 패턴을 복습시킵니다.</p>' },
          { layout: 'two', title: 'readlines() 와 with ~ as', left: { title: 'Code11-03', code: `inFp = open("data1.txt", "r")
inList = inFp.readlines()
print(inList)
inFp.close()` }, right: { title: 'with ~ as (자동으로 닫힘)', code: `with open("data1.txt", "r") as inFp :
    inList = inFp.readlines()
    print(inList)` },
            notes: '<p><b>[4분]</b> 결과가 리스트이고 각 항목 끝에 \\n 이 있는 것을 확인합니다. with 문은 블록이 끝나면 자동으로 close 된다는 점 — 실무에서는 with 를 가장 많이 씁니다.</p>' },
          { layout: 'code', title: 'Code11-04. 리스트를 한 행씩 출력', code: `inFp = open("data1.txt", "r")

inList = inFp.readlines()
for inStr in inList :
    print(inStr, end = "")

inFp.close()

# 📘 파일 객체를 바로 for 문에
with open("data1.txt", "r") as inFp :
    for inStr in inFp :
        print(inStr.strip())`, points: ['<code>readlines()</code> + <code>for</code>', '파일 객체도 for 문에 바로 쓸 수 있음', '<code>strip()</code> 으로 줄바꿈 제거'],
            notes: '<p><b>[3분]</b> 세 가지 읽기 방법(readline 반복, readlines, for 파일객체)을 비교해 정리합니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '파일 끝에서 <code>readline()</code> 이 돌려주는 값은?', options: ['None', '"\\n"', '"" (빈 문자열)', '-1'], answer: 2, explain: '빈 줄은 "\\n", 파일 끝은 "" 입니다.',
            notes: '<p><b>[1분]</b> "\\n" 을 고른 학생에게 빈 줄과 파일 끝의 차이를 다시 설명합니다.</p>' },
          { layout: 'practice', title: 'SELF STUDY 11-1. 행 번호 붙이기', desc: 'Code11-02 를 수정해 <code>1: CookBook …</code> 처럼 행 번호를 붙여 출력', starter: `inFp = open("data1.txt", "r")
# TODO: 행 번호 변수
while True :
    inStr = inFp.readline()
    if inStr == "" :
        break
    print(inStr, end = "")
inFp.close()
`, solution: `inFp = open("data1.txt", "r")
lineNum = 1
while True :
    inStr = inFp.readline()
    if inStr == "" :
        break
    print("%d: %s" % (lineNum, inStr), end = "")
    lineNum += 1
inFp.close()
`,
            notes: '<p><b>[5분]</b> 번호 증가 위치(출력 뒤)를 틀리는 학생이 많습니다. SELF STUDY 11-2(readlines 버전)는 과제로 냅니다.</p>' },
          { layout: 'summary', title: '정리', bullets: ['파일 처리 3단계: <code>open()</code> → 읽기/쓰기 → <code>close()</code>', '모드: <code>r</code> 읽기, <code>w</code> 덮어쓰기, <code>a</code> 추가, <code>b</code> 이진', '<code>readline()</code> 한 행, <code>readlines()</code> 전체를 리스트로, <code>read()</code> 전체를 문자열로', '파일 끝 = <code>""</code>, 행 끝에는 <code>\\n</code>', '<code>with open(…) as f :</code> → 자동으로 닫힘'],
            notes: '<p><b>[1분]</b> 다음 교시: 파일 이름을 입력받아 출력(도스 type), 파일에 쓰기, 파일 복사(도스 copy).</p>' }
        ]
      },
      /* ================================================================
       * 11-2. 도스 type · copy 구현과 파일 쓰기 (Section 03 중간)
       * ================================================================ */
      {
        id: 'ch11-2',
        title: '파일 이름 입력 · 오류 확인 · 파일 쓰기와 복사',
        minutes: 50,
        goals: [
          '입력받은 파일 이름의 내용을 출력하는 도스 type 명령을 구현할 수 있다',
          '없는 파일을 열 때의 오류를 이해하고 os.path.exists() 로 미리 확인할 수 있다',
          'write() · writelines() 로 키보드 입력을 파일에 저장할 수 있다',
          '읽기 파일과 쓰기 파일을 함께 열어 도스 copy 명령을 구현할 수 있다'
        ],
        flow: [['복습 · type 명령 구현', 10], ['오류와 os.path.exists', 8], ['파일에 쓰기', 12], ['copy 명령 구현', 10], ['SELF STUDY · 퀴즈', 10]],
        content: [
          { type: 'h', text: '도스 명령어 type 의 구현' },
          { type: 'p', html: '윈도의 명령 프롬프트(도스 창)에는 <code>type 파일명</code> 이라는 명령이 있습니다. 지정한 텍스트 파일의 내용을 화면에 그대로 보여 주는 명령입니다. 예를 들어 <code>type C:\\Windows\\win.ini</code> 라고 입력하면 윈도 설정 파일인 win.ini 의 내용이 출력됩니다.' },
          { type: 'code', run: false, title: '명령 프롬프트에서 type 명령 실행 (그림 11-4)', code: 'C:\\>type C:\\Windows\\win.ini\n; for 16-bit app support\n[fonts]\n[extensions]\n[mci extensions]\n[files]\n[Mail]\nMAPI=1' },
          { type: 'p', html: '이 명령을 파이썬으로 만들어 봅시다. 파일 이름을 <code>input()</code> 으로 입력받고, 그 파일을 열어 모든 행을 출력하면 됩니다. 작업 폴더에는 실제 win.ini 와 비슷한 내용의 <code>win.ini</code> 파일이 들어 있습니다. (강의자료처럼 <code>C:/Windows/win.ini</code> 를 입력하면 브라우저에는 그런 경로가 없어 오류가 납니다)' },
          { type: 'code', title: 'Code11-05. 도스 type 명령 구현', code: `inFp = None
fName, inList, inStr = "", [], ""

fName = input("파일명을 입력하세요 : ")
inFp = open(fName, "r")

inList = inFp.readlines()
for inStr in inList :
    print(inStr, end = "")

inFp.close()`, stdin: 'win.ini\n', expect: `파일명을 입력하세요 : win.ini
; for 16-bit app support
[fonts]
[extensions]
[mci extensions]
[files]
[Mail]
MAPI=1`,
            desc: '<code>5행</code> 파일 이름이 문자열 변수 <code>fName</code> 에 들어 있으므로 따옴표 없이 <code>open(fName, "r")</code> 로 엽니다. <b>예시 입력으로 실행</b>을 누르면 <code>win.ini</code> 가 입력됩니다. <code>data1.txt</code> 를 입력해 보세요.' },
          { type: 'callout', kind: 'more', title: '📘 sys.argv 로 진짜 명령처럼 만들기', html: '실제 도스 명령은 <code>type 파일명</code> 처럼 명령 뒤에 이름을 붙여 실행합니다. 파이썬에서도 <code>import sys</code> 후 <code>sys.argv[1]</code> 로 “명령 뒤에 붙인 값”을 받을 수 있습니다(예: <code>python mytype.py win.ini</code>). 이 웹 강좌는 명령 줄이 없으므로 <code>input()</code> 으로 받습니다.' },

          { type: 'h', text: '파일을 열 때 오류 처리' },
          { type: 'p', html: 'Code11-05 를 다시 실행하고 <b>없는 파일 이름</b>을 입력하면 어떻게 될까요? 파이썬은 <code>FileNotFoundError</code> 오류를 내고 프로그램을 멈춥니다.' },
          { type: 'code', title: 'Code11-05 에 없는 파일명을 입력했을 때', code: `inFp = None
fName, inList, inStr = "", [], ""

fName = input("파일명을 입력하세요 : ")
inFp = open(fName, "r")

inList = inFp.readlines()
for inStr in inList :
    print(inStr, end = "")

inFp.close()`, stdin: 'abc.txt\n', expectError: true, expect: `파일명을 입력하세요 : abc.txt
Traceback (most recent call last):
  File "main.py", line 5, in <module>
    inFp = open(fName, "r")
FileNotFoundError: [Errno 2] No such file or directory: 'abc.txt'`,
            desc: '오류 메시지의 마지막 줄을 읽어 보면 “그런 파일이나 폴더가 없다(No such file or directory)” 는 뜻입니다. 5행에서 오류가 났다는 것도 알려 줍니다.' },
          { type: 'p', html: '오류가 나지 않게 하려면 파일을 열기 전에 <b>파일이 있는지</b> 먼저 확인합니다. <code>os</code> 모듈의 <code>os.path.exists(파일명)</code> 은 파일(또는 폴더)이 있으면 <code>True</code>, 없으면 <code>False</code> 를 돌려줍니다.' },
          { type: 'code', title: 'Code11-06. os.path.exists() 로 파일 확인', code: `import os

inFp = None
fName, inList, inStr = "", [], ""

fName = input("파일명을 입력하세요 : ")

if os.path.exists(fName) :
    inFp = open(fName, "r")

    inList = inFp.readlines()
    for inStr in inList :
        print(inStr, end = "")

    inFp.close()
else :
    print("%s 파일이 없습니다." % fName)`, stdin: 'abc.txt\n', expect: `파일명을 입력하세요 : abc.txt
abc.txt 파일이 없습니다.`,
            desc: '<code>8행</code> 파일이 있을 때만 열고 읽습니다. <code>16~17행</code> 없으면 안내 메시지를 출력하고 정상적으로 끝납니다. 이번에는 <code>win.ini</code> 를 입력해 보세요.' },
          { type: 'callout', kind: 'tip', title: '오류를 처리하는 두 가지 방법', html: '① <b>미리 확인하기</b>: <code>os.path.exists()</code> 로 확인한 뒤 연다 (이번 예제). ② <b>일단 해 보고 오류를 잡기</b>: <code>try ~ except FileNotFoundError</code> 로 오류가 나면 처리한다. ②는 11-6 교시에서 배웁니다.' },

          { type: 'h', text: '파일을 이용한 출력' },
          { type: 'p', html: '이번에는 방향을 바꿔서 <b>키보드로 입력한 내용을 파일에 저장</b>합니다. 파일에 쓸 때는 <code>"w"</code> 모드로 열고 <code>write()</code> 나 <code>writelines()</code> 함수를 사용합니다.' },
          { type: 'figure', html: SVG(1280, 220, '표준 입력과 파일 출력',
            BOX(150, 100, 200, 90, '⌨️ 키보드', { stroke: 'var(--accent2)', size: 22 }) +
            BOX(420, 100, 200, 80, 'input()', { stroke: 'var(--accent)', mono: true }) +
            BOX(700, 100, 220, 130, '파이썬|프로그램', { stroke: 'var(--line)', bold: true, size: 24 }) +
            BOX(980, 100, 220, 100, 'write()|writelines()', { stroke: 'var(--warn)', mono: true, size: 21 }) +
            BOX(1190, 100, 150, 90, '📄 파일', { stroke: 'var(--ok)' }) +
            ARR('M252,100 L318,100') + ARR('M522,100 L588,100') + ARR('M812,100 L868,100') + ARR('M1092,100 L1113,100') +
            T(640, 200, '출력 결과를 화면 대신 파일에 저장합니다', { size: 20, fill: 'var(--muted)' })), caption: '그림 11-5 표준 입력과 파일 출력' },
          { type: 'p', html: '<code>input()</code> 을 반복해서 한 행씩 입력받고, 아무것도 입력하지 않고 <kbd>Enter</kbd> 를 누르면 끝냅니다. <code>input()</code> 으로 받은 문자열에는 줄바꿈이 없으므로 쓸 때 <code>"\\n"</code> 을 붙여야 행이 나뉩니다.' },
          { type: 'code', title: 'Code11-07. 키보드 입력을 한 행씩 파일에 쓰기', code: `outFp = None
outStr = ""

outFp = open("data2.txt", "w")

while True :
    outStr = input("내용 입력 : ")
    if outStr != "" :
        outFp.writelines(outStr + "\\n")
    else :
        break

outFp.close()
print("--- 정상적으로 파일에 씀 ---")`, stdin: '파이썬을\n열공하고\n있습니다. ^^\n\n', expect: `내용 입력 : 파이썬을
내용 입력 : 열공하고
내용 입력 : 있습니다. ^^
내용 입력 :
--- 정상적으로 파일에 씀 ---`,
            desc: '실행 후 <b>📁 작업 폴더</b>를 열어 <code>data2.txt</code> 를 눌러 보면 입력한 세 줄이 저장되어 있습니다. 또는 Code11-05 를 실행해 <code>data2.txt</code> 를 입력해 보세요. (강의자료의 <code>C:/Temp/data2.txt</code> → <code>data2.txt</code>)' },
          { type: 'callout', kind: 'more', title: '📘 write() 와 writelines() 의 차이', html: '<p><code>write(문자열)</code> 은 문자열 하나를 씁니다. <code>writelines(목록)</code> 은 원래 <b>문자열 리스트</b>를 받아 차례로 씁니다(줄바꿈을 자동으로 넣지는 않음). 문자열도 “글자들의 모음”이므로 강의자료처럼 <code>writelines("글자\\n")</code> 도 결과는 같습니다.</p><p><code>print()</code> 에 <code>file=</code> 을 주면 화면 대신 파일로 출력할 수도 있습니다: <code>print("안녕", file=outFp)</code> — 줄바꿈이 자동으로 붙어 편리합니다.</p>' },
          { type: 'code', title: '추가 예제. 쓰고 나서 다시 읽어 확인하기', code: `outFp = open("data2.txt", "w")
outFp.write("첫째 줄\\n")                    # write : 문자열 하나
outFp.writelines(["둘째 줄\\n", "셋째 줄\\n"])  # writelines : 리스트
print("넷째 줄", file = outFp)               # print 로 파일에 쓰기
outFp.close()

outFp = open("data2.txt", "a")               # a : 끝에 이어서 쓰기
outFp.write("다섯째 줄 (추가)\\n")
outFp.close()

inFp = open("data2.txt", "r")
print(inFp.read(), end = "")
inFp.close()`, expect: `첫째 줄
둘째 줄
셋째 줄
넷째 줄
다섯째 줄 (추가)`,
            desc: '<code>7행</code> <code>"a"</code> 모드로 열면 기존 내용이 지워지지 않고 끝에 덧붙습니다. <code>"a"</code> 를 <code>"w"</code> 로 바꿔 실행하면 결과가 어떻게 달라질지 예상해 보세요.' },

          { type: 'h', text: '도스 copy 명령어의 구현' },
          { type: 'p', html: '도스의 <code>copy 소스파일 타깃파일</code> 명령은 파일을 복사합니다. 예를 들어 <code>copy C:\\Windows\\win.ini C:\\Temp\\data3.txt</code> 를 입력하면 win.ini 와 똑같은 data3.txt 가 생깁니다. 파이썬으로는 <b>소스 파일을 읽기 모드</b>로, <b>타깃 파일을 쓰기 모드</b>로 함께 열고, 읽은 행을 그대로 쓰면 됩니다.' },
          { type: 'figure', html: FIG_COPY, caption: '그림 11-7 copy 명령어를 구현하는 파일 입출력' },
          { type: 'code', title: 'Code11-08. 도스 copy 명령 구현', code: `inFp, outFp = None, None
inStr = ""

inFp = open("win.ini", "r")
outFp = open("data3.txt", "w")

inList = inFp.readlines()
for inStr in inList :
    outFp.writelines(inStr)

inFp.close()
outFp.close()
print("--- 파일이 정상적으로 복사되었음 ---")`, expect: '--- 파일이 정상적으로 복사되었음 ---',
            desc: '<code>4~5행</code> 두 파일을 동시에 엽니다(강의자료: <code>C:/Windows/win.ini</code> → <code>C:/Temp/data3.txt</code>). <code>8~9행</code> 읽은 행에는 이미 <code>\\n</code> 이 있으므로 그대로 씁니다. 복사가 잘 되었는지 Code11-05 로 <code>data3.txt</code> 를 출력해 보세요.' },
          { type: 'callout', kind: 'info', title: '여기서 잠깐 — with ~ as 문으로 간단하게', html: 'with 문 두 개를 겹치면 Code11-08 이 짧아집니다. 파일 객체를 바로 <code>for</code> 문에 쓰면 <code>readlines()</code> 도 필요 없습니다.' },
          { type: 'code', title: 'Code11-08 을 with ~ as 문으로 바꾸기', code: `inFp, outFp = None, None
inStr = ""

with open("win.ini", "r") as inFp :
    with open("data4.txt", "w") as outFp :
        for inStr in inFp :
            outFp.writelines(inStr)

print("--- 파일이 정상적으로 복사되었음 ---")

# 확인 : 복사한 파일 출력
with open("data4.txt", "r") as inFp :
    print(inFp.read(), end = "")`, expect: `--- 파일이 정상적으로 복사되었음 ---
; for 16-bit app support
[fonts]
[extensions]
[mci extensions]
[files]
[Mail]
MAPI=1`,
            desc: '<code>11~13행</code>은 복사 결과를 확인하려고 추가한 부분입니다. <code>with open("a") as f1, open("b", "w") as f2 :</code> 처럼 한 줄에 두 파일을 열 수도 있습니다.' }
        ],
        practice: [
          {
            title: 'SELF STUDY 11-3. 파일명도 입력받아 쓰기',
            level: 1,
            desc: '<p>Code11-07 을 수정해서 저장할 <b>파일 이름도 입력</b>받으세요. 마지막에 어떤 파일에 저장했는지 알려 줍니다.</p><pre>저장할 파일명을 입력하세요 : diary.txt\n내용 입력 : 오늘은\n내용 입력 : 파일 입출력을 배웠다\n내용 입력 :\n--- diary.txt 파일에 정상적으로 씀 ---</pre>',
            hint: 'Code11-05 처럼 <code>fName = input(…)</code> 으로 받은 변수를 <code>open(fName, "w")</code> 에 넣습니다.',
            starter: `outFp = None
outStr = ""
# TODO: 파일명 입력받기

outFp = open("data2.txt", "w")

while True :
    outStr = input("내용 입력 : ")
    if outStr != "" :
        outFp.writelines(outStr + "\\n")
    else :
        break

outFp.close()
print("--- 정상적으로 파일에 씀 ---")
`,
            solution: `outFp = None
outStr = ""
fName = input("저장할 파일명을 입력하세요 : ")

outFp = open(fName, "w")

while True :
    outStr = input("내용 입력 : ")
    if outStr != "" :
        outFp.writelines(outStr + "\\n")
    else :
        break

outFp.close()
print("--- %s 파일에 정상적으로 씀 ---" % fName)
`,
            stdin: 'diary.txt\n오늘은\n파일 입출력을 배웠다\n\n',
            expect: `저장할 파일명을 입력하세요 : diary.txt
내용 입력 : 오늘은
내용 입력 : 파일 입출력을 배웠다
내용 입력 :
--- diary.txt 파일에 정상적으로 씀 ---`
          },
          {
            title: 'SELF STUDY 11-4. 두 파일명을 모두 입력받아 복사',
            level: 2,
            desc: '<p>Code11-08 을 수정해서 소스 파일과 타깃 파일의 이름을 모두 입력받아 복사하세요.</p><pre>소스 파일명을 입력하세요 : win.ini\n타깃 파일명을 입력하세요 : data4.txt\n--- win.ini 파일이 data4.txt 파일로 복사되었음 ---</pre>',
            hint: '<code>inFname</code>, <code>outFname</code> 두 변수에 입력받고, 마지막 출력은 <code>%s</code> 두 개를 사용합니다.',
            starter: `inFp, outFp = None, None
inStr = ""
# TODO: 두 파일명 입력

inFp = open("win.ini", "r")
outFp = open("data3.txt", "w")

inList = inFp.readlines()
for inStr in inList :
    outFp.writelines(inStr)

inFp.close()
outFp.close()
print("--- 파일이 정상적으로 복사되었음 ---")
`,
            solution: `inFp, outFp = None, None
inStr = ""
inFname = input("소스 파일명을 입력하세요 : ")
outFname = input("타깃 파일명을 입력하세요 : ")

inFp = open(inFname, "r")
outFp = open(outFname, "w")

inList = inFp.readlines()
for inStr in inList :
    outFp.writelines(inStr)

inFp.close()
outFp.close()
print("--- %s 파일이 %s 파일로 복사되었음 ---" % (inFname, outFname))
`,
            stdin: 'win.ini\ndata4.txt\n',
            expect: `소스 파일명을 입력하세요 : win.ini
타깃 파일명을 입력하세요 : data4.txt
--- win.ini 파일이 data4.txt 파일로 복사되었음 ---`
          },
          {
            title: '실습 11-2. 성적 파일 저장하고 평균 구하기',
            level: 3,
            desc: '<p>학생 3명의 이름과 점수를 입력받아 <code>score.txt</code> 에 <code>이름,점수</code> 형식으로 한 행씩 저장하세요. 그다음 파일을 다시 읽어서 모든 행과 평균을 출력합니다.</p><pre>이름 : 홍길동\n점수 : 90\n… (3명)\n--- score.txt 내용 ---\n홍길동 : 90점\n…\n평균 : 85.0점</pre>',
            hint: '쓰기: <code>outFp.write(name + "," + score + "\\n")</code>. 읽기: 각 행을 <code>strip().split(",")</code> 로 나누고 <code>int()</code> 로 바꿔 더합니다.',
            starter: `outFp = open("score.txt", "w")
for i in range(3) :
    name = input("이름 : ")
    score = input("점수 : ")
    # TODO: "이름,점수" 한 행 쓰기
outFp.close()

print("--- score.txt 내용 ---")
total, count = 0, 0
# TODO: score.txt 를 읽어 출력하고 합계 · 개수 구하기
`,
            solution: `outFp = open("score.txt", "w")
for i in range(3) :
    name = input("이름 : ")
    score = input("점수 : ")
    outFp.write(name + "," + score + "\\n")
outFp.close()

print("--- score.txt 내용 ---")
total, count = 0, 0
inFp = open("score.txt", "r")
for line in inFp :
    name, score = line.strip().split(",")
    print("%s : %s점" % (name, score))
    total += int(score)
    count += 1
inFp.close()
print("평균 : %.1f점" % (total / count))
`,
            stdin: '홍길동\n90\n이순신\n75\n강감찬\n90\n',
            expect: `이름 : 홍길동
점수 : 90
이름 : 이순신
점수 : 75
이름 : 강감찬
점수 : 90
--- score.txt 내용 ---
홍길동 : 90점
이순신 : 75점
강감찬 : 90점
평균 : 85.0점`
          }
        ],
        quiz: [
          { q: '없는 파일을 <code>open("abc.txt", "r")</code> 로 열면 나는 오류는?', options: ['NameError', 'FileNotFoundError', 'ValueError', '오류 없이 빈 파일이 만들어진다'], answer: 1, explain: '읽기 모드는 파일이 반드시 있어야 합니다. (쓰기 모드 "w" 는 없으면 새로 만듭니다)' },
          { q: '파일이 있는지 확인하는 함수는?', options: ['<code>os.exists()</code>', '<code>os.path.exists()</code>', '<code>open.exists()</code>', '<code>file.exists()</code>'], answer: 1, explain: '<code>import os</code> 후 <code>os.path.exists(파일명)</code> 을 씁니다.' },
          { q: '다음 코드를 실행한 뒤 <code>a.txt</code> 의 내용은?<pre><code>f = open("a.txt", "w")\nf.write("A")\nf.close()\nf = open("a.txt", "w")\nf.write("B")\nf.close()</code></pre>', options: ['AB', 'B', 'A', 'A 줄바꿈 B'], answer: 1, explain: '두 번째로 <code>"w"</code> 로 열 때 기존 내용 A 가 지워집니다. 이어 쓰려면 <code>"a"</code> 모드를 씁니다.' },
          { q: 'Code11-07 에서 <code>outStr + "\\n"</code> 처럼 줄바꿈을 붙이는 이유는?', options: ['input() 으로 받은 문자열에는 줄바꿈이 없어서', '파일 끝을 표시하려고', '한글을 저장하려고', 'writelines() 가 줄바꿈을 지워서'], answer: 0, explain: '줄바꿈을 붙이지 않으면 모든 입력이 한 줄로 이어져 저장됩니다.' }
        ],
        slides: [
          { layout: 'title', title: '파일 이름 입력 · 오류 확인 · 파일 쓰기와 복사', subtitle: 'Section 03 텍스트 파일 입출력 — 도스 type · copy 명령 구현', badge: '11-2',
            notes: '<p><b>[도입 2분]</b> 복습 발문: “파일의 모든 행을 리스트로 읽는 함수는?” → readlines(). 오늘은 명령 프롬프트의 명령어를 파이썬으로 흉내 냅니다.</p>' },
          { layout: 'code', title: 'Code11-05. 도스 type 명령 구현', code: `fName = input("파일명을 입력하세요 : ")
inFp = open(fName, "r")

inList = inFp.readlines()
for inStr in inList :
    print(inStr, end = "")

inFp.close()`, stdin: 'win.ini\n', points: ['<code>type 파일명</code> → 파일 내용 출력', '파일명을 <code>input()</code> 으로 받기', '작업 폴더의 <code>win.ini</code> · <code>data1.txt</code> 로 실험'],
            notes: '<p><b>[4분]</b> 가능하면 실제 명령 프롬프트에서 <code>type C:\\Windows\\win.ini</code> 를 먼저 보여 주고, 같은 일을 하는 파이썬 코드를 실행합니다. 이어서 없는 파일 이름을 넣어 오류를 보여 줍니다.</p>' },
          { layout: 'code', title: '없는 파일이면? → FileNotFoundError', code: `fName = input("파일명을 입력하세요 : ")
inFp = open(fName, "r")
print(inFp.read())
inFp.close()`, stdin: 'abc.txt\n', run: false, points: ['<code>FileNotFoundError: [Errno 2] No such file or directory</code>', '읽기 모드는 파일이 반드시 있어야 함', 'traceback 의 마지막 줄부터 읽기'],
            notes: '<p><b>[2분]</b> 오류 메시지 읽는 법: 맨 아래 줄 = 오류 종류와 이유, 그 위 = 오류가 난 행 번호. (이 슬라이드는 실행하면 오류가 나므로 run: false 로 두었습니다. 편집기에서 abc.txt 를 입력해 직접 보여 주세요)</p>' },
          { layout: 'code', title: 'Code11-06. os.path.exists() 로 확인', code: `import os

fName = input("파일명을 입력하세요 : ")

if os.path.exists(fName) :
    inFp = open(fName, "r")
    inList = inFp.readlines()
    for inStr in inList :
        print(inStr, end = "")
    inFp.close()
else :
    print("%s 파일이 없습니다." % fName)`, stdin: 'abc.txt\n', points: ['열기 전에 존재 여부 확인', '있으면 <code>True</code>, 없으면 <code>False</code>', '폴더도 확인 가능'],
            notes: '<p><b>[3분]</b> “돌다리도 두들겨 보고 건넌다” 방식. 11-6 교시의 try~except(일단 건너 보고 빠지면 구조) 방식과 비교할 것이라고 예고합니다.</p>' },
          { layout: 'code', title: 'Code11-07. 키보드 입력을 파일에 쓰기', code: `outFp = open("data2.txt", "w")

while True :
    outStr = input("내용 입력 : ")
    if outStr != "" :
        outFp.writelines(outStr + "\\n")
    else :
        break

outFp.close()
print("--- 정상적으로 파일에 씀 ---")`, stdin: '파이썬을\n열공하고\n있습니다. ^^\n\n', points: ['<code>"w"</code> 모드로 열기', '빈 입력(Enter)이면 종료', '<code>"\\n"</code> 을 붙여야 행이 나뉨'],
            notes: '<p><b>[4분]</b> 실행 후 📁 작업 폴더에서 data2.txt 를 열어 보여 줍니다. "\\n" 을 빼고 다시 실행해 한 줄로 붙어 저장되는 것도 확인시키세요.</p>' },
          { layout: 'two', title: 'write · writelines · print(file=) · "a" 모드', left: { title: '쓰는 방법 3가지', code: `f = open("data2.txt", "w")
f.write("첫째 줄\\n")
f.writelines(["둘째\\n", "셋째\\n"])
print("넷째 줄", file = f)
f.close()
print(open("data2.txt").read())` }, right: { title: '"a" : 끝에 이어 쓰기', code: `f = open("log.txt", "a")
f.write("실행했음\\n")
f.close()
print(open("log.txt").read())` },
            notes: '<p><b>[3분]</b> 오른쪽 코드를 여러 번 실행하면 “실행했음” 이 계속 늘어납니다. "w" 로 바꾸면 항상 한 줄만 남습니다.</p>' },
          { layout: 'diagram', title: '도스 copy 명령 구현 원리', html: FIG_COPY, caption: 'copy 소스파일 타깃파일',
            notes: '<p><b>[2분]</b> 읽기용과 쓰기용 파일 두 개를 동시에 연다는 것이 핵심입니다.</p>' },
          { layout: 'code', title: 'Code11-08. 도스 copy 명령 구현', code: `inFp = open("win.ini", "r")
outFp = open("data3.txt", "w")

inList = inFp.readlines()
for inStr in inList :
    outFp.writelines(inStr)

inFp.close()
outFp.close()
print("--- 파일이 정상적으로 복사되었음 ---")`, points: ['읽은 행에 이미 <code>\\n</code> 이 있음 → 그대로 쓰기', '두 파일 모두 닫기', 'with 문 두 개로 줄일 수 있음'],
            notes: '<p><b>[3분]</b> 실행 후 Code11-05 로 data3.txt 를 출력해 확인합니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '파일을 지우지 않고 <b>끝에 이어서</b> 쓰려면 어떤 모드로 열어야 할까?', options: ['"r"', '"w"', '"a"', '"b"'], answer: 2, explain: 'a(append) 모드는 기존 내용 뒤에 덧붙입니다.',
            notes: '<p><b>[1분]</b></p>' },
          { layout: 'practice', title: 'SELF STUDY 11-4. 두 파일명 입력받아 복사', desc: '소스 · 타깃 파일명을 입력받아 복사하고 <code>--- win.ini 파일이 data4.txt 파일로 복사되었음 ---</code> 출력', stdin: 'win.ini\ndata4.txt\n', starter: `# TODO: 두 파일명 입력
inFp = open("win.ini", "r")
outFp = open("data3.txt", "w")
for inStr in inFp.readlines() :
    outFp.writelines(inStr)
inFp.close()
outFp.close()
`, solution: `inFname = input("소스 파일명을 입력하세요 : ")
outFname = input("타깃 파일명을 입력하세요 : ")
inFp = open(inFname, "r")
outFp = open(outFname, "w")
for inStr in inFp.readlines() :
    outFp.writelines(inStr)
inFp.close()
outFp.close()
print("--- %s 파일이 %s 파일로 복사되었음 ---" % (inFname, outFname))
`,
            notes: '<p><b>[6분]</b> SELF STUDY 11-3(파일명 입력해서 쓰기)은 먼저 끝낸 학생의 추가 과제로 냅니다.</p>' },
          { layout: 'summary', title: '정리', bullets: ['<code>open(fName, "r")</code> — 파일명을 변수로 받을 수 있음', '없는 파일을 읽으면 <code>FileNotFoundError</code> → <code>os.path.exists()</code> 로 확인', '쓰기: <code>"w"</code> 모드 + <code>write()</code> · <code>writelines()</code>, 줄바꿈은 직접 <code>"\\n"</code>', '복사: 읽기 파일 + 쓰기 파일을 함께 열고 행 단위로 옮기기'],
            notes: '<p><b>[1분]</b> 다음 교시: 글자를 숫자로 바꿔(ord) 더하고 다시 글자로(chr) → 파일 암호화 프로그램.</p>' }
        ]
      },
      /* ================================================================
       * 11-3. [프로그램 1] 파일 암호화 및 암호 해독 (Section 03 끝)
       * ================================================================ */
      {
        id: 'ch11-3',
        title: '[프로그램 1] 파일 암호화 및 암호 해독',
        minutes: 50,
        goals: [
          'ord() 와 chr() 로 글자와 유니코드 번호를 서로 바꿀 수 있다',
          '글자 번호에 일정한 값을 더하고 빼서 암호화 · 해독하는 원리를 설명할 수 있다',
          '파일을 한 행씩 읽어 글자 단위로 바꾼 뒤 다른 파일에 쓰는 프로그램을 완성할 수 있다',
          'encoding 매개변수와 readline() · readlines() 의 선택 기준을 이해한다'
        ],
        flow: [['복습 · ord · chr', 8], ['암호화 원리', 7], ['Code11-09 작성 · 실행', 20], ['확장 실습 · 퀴즈', 15]],
        content: [
          { type: 'h', text: '글자와 숫자 — ord() 와 chr()' },
          { type: 'p', html: '컴퓨터 안에서 모든 글자는 <b>번호</b>로 저장됩니다. 전 세계 글자에 번호를 붙인 표준을 <b>유니코드(Unicode)</b> 라고 합니다. <code>ord(글자)</code> 는 글자의 번호를, <code>chr(번호)</code> 는 번호에 해당하는 글자를 알려 줍니다. (8장 문자열에서 잠깐 보았던 함수입니다)' },
          { type: 'code', repl: true, title: 'ord() 와 chr() 함수', code: `ord('파')
chr(54028)
ord('A')
chr(65 + 1)`, expect: `>>> ord('파')
54028
>>> chr(54028)
'파'
>>> ord('A')
65
>>> chr(65 + 1)
'B'
>>>` },
          { type: 'p', html: '<b>암호화</b>의 아이디어는 간단합니다. 각 글자의 번호에 <b>100을 더한</b> 글자로 바꿔 저장하면, 원래 내용을 알아볼 수 없게 됩니다. 예를 들어 <code>\'파\'</code>(54028) 는 54128 번 글자인 <code>\'퍰\'</code> 로 바뀝니다. <b>해독</b>할 때는 반대로 <b>100을 빼면</b> 원래 글자로 돌아옵니다.' },
          { type: 'figure', html: FIG_CRYPT, caption: '글자 번호에 100을 더하면 암호화, 100을 빼면 해독' },
          { type: 'code', repl: true, title: '암호화와 암호 해독', code: `num = ord('파')
chr(num + 100)
num = ord('퍰')
chr(num - 100)`, expect: `>>> num = ord('파')
>>> chr(num + 100)
'퍰'
>>> num = ord('퍰')
>>> chr(num - 100)
'파'
>>>`, desc: '강의자료에는 54028 + 100 = 54123 과 \'팸\' 으로 나와 있지만, 실제로 계산하면 54128(\'퍰\') 입니다. 직접 실행해서 확인해 보세요.' },
          { type: 'callout', kind: 'more', title: '📘 이런 암호를 “카이사르 암호”라고 합니다', html: '글자를 일정한 칸만큼 밀어서 바꾸는 방법은 고대 로마의 율리우스 카이사르가 썼다고 해서 <b>카이사르(시저) 암호</b>라고 부릅니다. 원리가 단순해 몇 번만 시도해도 풀리기 때문에 실제 보안에는 쓰지 않습니다. 실제 프로그램은 <code>hashlib</code>, <code>cryptography</code> 같은 검증된 암호 라이브러리를 사용합니다.' },

          { type: 'h', text: '[프로그램 1]의 완성' },
          { type: 'p', html: '강의자료에서는 메모장으로 세 줄을 입력해 <code>C:\\CookPython\\normal.txt</code> 에 UTF-8 인코딩으로 저장합니다. 이 강좌의 작업 폴더에는 같은 내용의 <code>normal.txt</code> 가 미리 들어 있습니다.' },
          { type: 'code', run: false, title: 'normal.txt (작업 폴더에 있는 원본 파일)', code: '안녕하세요?\n저는 Cookbook 파이썬을 즐겁게\n공부하고 있습니다. ^___^' },
          { type: 'callout', kind: 'tip', title: '메모장에서 저장할 때 인코딩', html: '집에서 메모장으로 직접 만들 때는 [다른 이름으로 저장] 창 아래쪽의 <b>인코딩</b>을 <b>UTF-8</b> 로 선택하세요. 프로그램이 <code>encoding = \'utf-8\'</code> 로 읽기 때문에, 다른 인코딩(ANSI 등)으로 저장하면 <code>UnicodeDecodeError</code> 가 납니다.' },
          { type: 'p', html: '프로그램의 흐름은 다음과 같습니다. ① 암호화(1)인지 해독(2)인지, 입력 · 출력 파일명을 입력받는다 → ② 선택에 따라 <code>secu</code> 를 100 또는 -100 으로 정한다 → ③ 입력 파일을 한 행씩 읽어 각 글자의 번호에 <code>secu</code> 를 더한 글자로 바꾼다 → ④ 바꾼 행을 출력 파일에 쓴다.' },
          { type: 'code', title: 'Code11-09. [프로그램 1] 파일 암호화 및 암호 해독 — 암호화', code: `## 변수 선언 부분 ##
inFp, outFp = None, None
inStr, outStr = "", ""
i = 0
secu = 0

## 메인 코드 부분 ##
secuYN = input(" 1. 암호화 2. 암호 해석 중 선택 : ")
inFname = input("입력 파일명을 입력하세요 : ")
outFname = input("출력 파일명을 입력하세요 : ")

if secuYN == "1" :
    secu = 100
elif secuYN == "2" :
    secu = -100

inFp = open(inFname, 'r', encoding = 'utf-8')
outFp = open(outFname, 'w', encoding = 'utf-8')

while True :
    inStr = inFp.readline()
    if not inStr :
        break

    outStr = ""
    for i in range(0, len(inStr)) :
        ch = inStr[i]
        chNum = ord(ch)
        chNum = chNum + secu
        ch2 = chr(chNum)
        outStr = outStr + ch2

    outFp.write(outStr)

outFp.close()
inFp.close()
print('%s --> %s 변환 완료' % (inFname, outFname))`, stdin: '1\nnormal.txt\nsecurity.txt\n', expect: ` 1. 암호화 2. 암호 해석 중 선택 : 1
입력 파일명을 입력하세요 : normal.txt
출력 파일명을 입력하세요 : security.txt
normal.txt --> security.txt 변환 완료`,
            desc: '<code>17~18행</code> 한글이 들어 있으므로 인코딩을 UTF-8 로 지정합니다. <code>22행</code> <code>if not inStr</code> 은 “빈 문자열이면” 이라는 뜻으로, <code>if inStr == ""</code> 과 같습니다. <code>26~31행</code> 한 글자씩 번호를 바꿔 새 문자열 <code>outStr</code> 에 이어 붙입니다. 실행 후 📁 작업 폴더에서 <code>security.txt</code> 를 열어 보세요.' },
          { type: 'code', title: 'Code11-09. [프로그램 1] — 암호 해독 (같은 코드, 입력만 다르게)', code: `## 변수 선언 부분 ##
inFp, outFp = None, None
inStr, outStr = "", ""
i = 0
secu = 0

## 메인 코드 부분 ##
secuYN = input(" 1. 암호화 2. 암호 해석 중 선택 : ")
inFname = input("입력 파일명을 입력하세요 : ")
outFname = input("출력 파일명을 입력하세요 : ")

if secuYN == "1" :
    secu = 100
elif secuYN == "2" :
    secu = -100

inFp = open(inFname, 'r', encoding = 'utf-8')
outFp = open(outFname, 'w', encoding = 'utf-8')

while True :
    inStr = inFp.readline()
    if not inStr :
        break

    outStr = ""
    for i in range(0, len(inStr)) :
        ch = inStr[i]
        chNum = ord(ch)
        chNum = chNum + secu
        ch2 = chr(chNum)
        outStr = outStr + ch2

    outFp.write(outStr)

outFp.close()
inFp.close()
print('%s --> %s 변환 완료' % (inFname, outFname))`, stdin: '2\nsecurity.txt\nrecovery.txt\n', expect: ` 1. 암호화 2. 암호 해석 중 선택 : 2
입력 파일명을 입력하세요 : security.txt
출력 파일명을 입력하세요 : recovery.txt
security.txt --> recovery.txt 변환 완료`,
            desc: '작업 폴더에는 미리 암호화해 둔 <code>security.txt</code> 도 들어 있어서, 해독부터 실행해도 됩니다. 해독된 <code>recovery.txt</code> 를 Code11-05(type) 로 출력하면 원본과 같습니다.' },
          { type: 'callout', kind: 'info', title: '줄바꿈 문자도 암호화됩니다', html: '줄바꿈 <code>\\n</code>(10번) 도 100이 더해져 110번 글자 <code>n</code> 이 됩니다. 그래서 security.txt 는 <b>한 줄짜리</b> 파일이 되고, 해독할 때 <code>n</code> 이 다시 <code>\\n</code> 으로 돌아오면서 세 줄이 복원됩니다. 공백(32번)은 132번의 보이지 않는 제어 문자가 되어 메모장에서 이상한 모양으로 보이기도 합니다.' },
          { type: 'code', title: '추가 예제. 암호화 → 해독을 한 번에 확인하기', code: `def convert(inFname, outFname, secu) :
    with open(inFname, 'r', encoding = 'utf-8') as inFp :
        with open(outFname, 'w', encoding = 'utf-8') as outFp :
            for inStr in inFp :
                outStr = ""
                for ch in inStr :
                    outStr += chr(ord(ch) + secu)
                outFp.write(outStr)

convert("normal.txt", "security.txt", 100)     # 암호화
convert("security.txt", "recovery.txt", -100)  # 해독

with open("security.txt", encoding = 'utf-8') as f :
    secStr = f.read()
print("암호문의 처음 5글자 :", secStr[:5])
print("암호문의 행 수 :", len(secStr.split("\\n")))

with open("normal.txt", encoding = 'utf-8') as f1, open("recovery.txt", encoding = 'utf-8') as f2 :
    original, recovered = f1.read(), f2.read()
print(recovered, end = "")
print("원본과 같은가?", original == recovered)`, expect: `암호문의 처음 5글자 : 얬놹햼솜웸
암호문의 행 수 : 1
안녕하세요?
저는 Cookbook 파이썬을 즐겁게
공부하고 있습니다. ^___^
원본과 같은가? True`,
            desc: '같은 일을 두 번 하므로 함수 <code>convert()</code> 로 묶었습니다(9장 함수). <code>for ch in inStr</code> 로 글자를 바로 꺼내면 인덱스가 필요 없습니다. 마지막에 원본과 해독 결과를 비교해 정확히 복원되었는지 확인합니다.' },
          { type: 'callout', kind: 'info', title: '여기서 잠깐 — readline() 과 readlines(), 무엇을 쓸까?', html: '<p><code>readline()</code> 은 한 번에 한 행만 메모리에 올리고, <code>readlines()</code> 는 파일 전체를 리스트로 메모리에 올립니다. 편하기는 <code>readlines()</code> 가 편하지만, 파일이 아주 크면(수백 MB 이상) 그만큼 메모리를 차지합니다. 그래서 <b>작은 파일은 readlines()</b>, <b>큰 파일은 readline() 이나 <code>for 행 in 파일객체</code></b> 로 한 행씩 처리하는 것이 좋습니다.</p>' },
          { type: 'callout', kind: 'more', title: '📘 문자열 바꾸기를 더 파이썬답게', html: '<p>문자열을 <code>+=</code> 로 계속 이어 붙이는 대신, 바꾼 글자를 리스트에 모아 <code>"".join(…)</code> 으로 합치는 방법도 많이 씁니다.</p><pre><code>outStr = "".join(chr(ord(ch) + secu) for ch in inStr)</code></pre>' }
        ],
        practice: [
          {
            title: '실습 11-3. 암호 키를 입력받는 암호화',
            level: 2,
            desc: '<p>100 대신 사용자가 입력한 숫자(암호 키)만큼 글자 번호를 밀어서 <code>normal.txt</code> 를 <code>secret.txt</code> 로 암호화하고, 같은 키로 다시 해독해서 화면에 출력하세요.</p><pre>암호 키(숫자) : 7\n--- 암호화 완료 : secret.txt ---\n--- 해독 결과 ---\n안녕하세요?\n저는 Cookbook 파이썬을 즐겁게\n공부하고 있습니다. ^___^</pre>',
            hint: '암호화는 <code>chr(ord(ch) + key)</code>, 해독은 <code>chr(ord(ch) - key)</code>. 해독 결과는 파일에 쓰지 않고 바로 출력해도 됩니다.',
            starter: `key = int(input("암호 키(숫자) : "))

# 1) normal.txt → secret.txt 로 암호화
inFp = open("normal.txt", "r", encoding = "utf-8")
outFp = open("secret.txt", "w", encoding = "utf-8")
# TODO
inFp.close()
outFp.close()
print("--- 암호화 완료 : secret.txt ---")

# 2) secret.txt 를 읽어 해독한 결과를 출력
print("--- 해독 결과 ---")
# TODO
`,
            solution: `key = int(input("암호 키(숫자) : "))

# 1) normal.txt → secret.txt 로 암호화
inFp = open("normal.txt", "r", encoding = "utf-8")
outFp = open("secret.txt", "w", encoding = "utf-8")
for inStr in inFp.readlines() :
    outStr = ""
    for ch in inStr :
        outStr += chr(ord(ch) + key)
    outFp.write(outStr)
inFp.close()
outFp.close()
print("--- 암호화 완료 : secret.txt ---")

# 2) secret.txt 를 읽어 해독한 결과를 출력
print("--- 해독 결과 ---")
inFp = open("secret.txt", "r", encoding = "utf-8")
secStr = inFp.read()
inFp.close()
plain = ""
for ch in secStr :
    plain += chr(ord(ch) - key)
print(plain, end = "")
`,
            stdin: '7\n',
            expect: `암호 키(숫자) : 7
--- 암호화 완료 : secret.txt ---
--- 해독 결과 ---
안녕하세요?
저는 Cookbook 파이썬을 즐겁게
공부하고 있습니다. ^___^`
          },
          {
            title: '실습 11-4. 영문 대문자로 바꿔 복사하기',
            level: 1,
            desc: '<p><code>win.ini</code> 를 읽어 영문자를 모두 <b>대문자</b>로 바꿔 <code>upper.ini</code> 에 저장한 뒤, <code>upper.ini</code> 의 내용을 출력하세요.</p>',
            hint: '문자열의 <code>upper()</code> 함수를 사용합니다(8장). 행 단위로 읽어 <code>inStr.upper()</code> 를 쓰면 됩니다.',
            starter: `inFp = open("win.ini", "r")
outFp = open("upper.ini", "w")
# TODO: 한 행씩 읽어 대문자로 바꿔 쓰기

inFp.close()
outFp.close()

# TODO: upper.ini 내용 출력
`,
            solution: `inFp = open("win.ini", "r")
outFp = open("upper.ini", "w")
for inStr in inFp :
    outFp.write(inStr.upper())
inFp.close()
outFp.close()

inFp = open("upper.ini", "r")
print(inFp.read(), end = "")
inFp.close()
`,
            expect: `; FOR 16-BIT APP SUPPORT
[FONTS]
[EXTENSIONS]
[MCI EXTENSIONS]
[FILES]
[MAIL]
MAPI=1`
          }
        ],
        quiz: [
          { q: '<code>chr(ord("A") + 2)</code> 의 결과는?', options: ['"A2"', '"C"', '67', '"B"'], answer: 1, explain: '<code>ord("A")</code> 는 65, 65 + 2 = 67, <code>chr(67)</code> 은 "C" 입니다.' },
          { q: 'Code11-09 에서 사용자가 2(암호 해석)를 선택하면 <code>secu</code> 의 값은?', options: ['2', '100', '-100', '0'], answer: 2, explain: '해독은 암호화 때 더한 100을 다시 빼는 것이므로 -100 을 더합니다.' },
          { q: '암호화된 security.txt 가 한 줄짜리 파일이 되는 이유는?', options: ['write() 가 줄바꿈을 지워서', '줄바꿈 문자 \\n 도 100이 더해져 다른 글자(n)가 되어서', 'readline() 이 한 행만 읽어서', 'encoding 을 utf-8 로 해서'], answer: 1, explain: '\\n(10) + 100 = 110 = "n" 이므로 더 이상 줄바꿈이 아닙니다.' },
          { q: '크기가 수 GB 인 로그 파일을 처리할 때 가장 알맞은 읽기 방법은?', options: ['readlines() 로 전체를 리스트로', 'read() 로 전체를 문자열로', 'for 행 in 파일객체 : 로 한 행씩', '파일을 복사한 뒤 readlines()'], answer: 2, explain: '한 행씩 읽으면 메모리를 적게 씁니다. read() · readlines() 는 전체를 메모리에 올립니다.' }
        ],
        slides: [
          { layout: 'title', title: '[프로그램 1] 파일 암호화 및 암호 해독', subtitle: 'ord() · chr() 로 글자 바꾸기', badge: '11-3',
            notes: '<p><b>[도입 2분]</b> 발문: “친구와 몰래 쪽지를 주고받을 때 어떤 방법을 써 봤나요?” → 글자를 밀어 쓰기, 거꾸로 쓰기 등. 오늘은 컴퓨터로 이것을 합니다.</p>' },
          { layout: 'two', title: '글자 ↔ 번호 : ord() 와 chr()', left: { title: '번호 알아보기', code: `ord('파')
chr(54028)
ord('A')`, repl: true }, right: { title: '밀고 되돌리기', code: `num = ord('파')
chr(num + 100)
num = ord('퍰')
chr(num - 100)`, repl: true },
            notes: '<p><b>[4분]</b> 모든 글자에는 유니코드 번호가 있다는 것부터. 강의자료의 54123 · \'팸\' 은 오타이며 실제로는 54128 · \'퍰\' 임을 실행으로 확인시킵니다.</p>' },
          { layout: 'diagram', title: '암호화와 해독의 원리', html: FIG_CRYPT, caption: '+100 → 암호화, −100 → 해독',
            notes: '<p><b>[3분]</b> 카이사르 암호 이야기. “암호 키 100을 모르는 사람은 풀 수 있을까?” → 몇 번 시도하면 풀림 → 실제 보안에는 쓰지 않는다.</p>' },
          { layout: 'code', title: 'Code11-09 ① 입력 받기 · secu 정하기', code: `secuYN = input(" 1. 암호화 2. 암호 해석 중 선택 : ")
inFname = input("입력 파일명을 입력하세요 : ")
outFname = input("출력 파일명을 입력하세요 : ")

if secuYN == "1" :
    secu = 100
elif secuYN == "2" :
    secu = -100

print("secu =", secu)`, stdin: '1\nnormal.txt\nsecurity.txt\n', points: ['선택 1 → +100, 2 → −100', '같은 코드로 암호화 · 해독 모두 처리', '파일명은 입력받기'],
            notes: '<p><b>[3분]</b> 하나의 코드로 두 가지 일을 하는 요령: 달라지는 부분(더할 값)만 변수로 뺀다.</p>' },
          { layout: 'code', title: 'Code11-09 ② 한 글자씩 바꿔 쓰기', code: `secu = 100
inFp = open("normal.txt", 'r', encoding = 'utf-8')
outFp = open("security.txt", 'w', encoding = 'utf-8')

while True :
    inStr = inFp.readline()
    if not inStr :
        break
    outStr = ""
    for i in range(0, len(inStr)) :
        ch = inStr[i]
        chNum = ord(ch)
        chNum = chNum + secu
        ch2 = chr(chNum)
        outStr = outStr + ch2
    outFp.write(outStr)

outFp.close()
inFp.close()
print('normal.txt --> security.txt 변환 완료')`, points: ['<code>encoding = \'utf-8\'</code> : 한글 파일', '행 → 글자 → 번호 → +secu → 글자', '바꾼 행을 출력 파일에 쓰기'],
            notes: '<p><b>[8분]</b> 학생들과 함께 입력합니다. 실행 후 📁 작업 폴더에서 security.txt 를 열어 보고, secu 를 -100 으로 바꿔 security.txt → recovery.txt 해독도 해 봅니다.</p>' },
          { layout: 'bullets', title: '실행 결과 살펴보기', bullets: ['security.txt 는 알아볼 수 없는 글자 + <b>한 줄</b>', ['줄바꿈 \\n(10) → n(110)', '공백(32) → 보이지 않는 제어 문자(132)'], '해독하면 n → \\n 으로 돌아와 세 줄 복원', '입력 파일을 메모장으로 만들 때는 <b>UTF-8</b> 로 저장'],
            notes: '<p><b>[3분]</b> 발문: “암호문에서 n 이 보이는 자리는 원래 무엇이었을까?”</p>' },
          { layout: 'code', title: '📘 함수로 묶고 원본과 비교', code: `def convert(inFname, outFname, secu) :
    with open(inFname, 'r', encoding = 'utf-8') as inFp :
        with open(outFname, 'w', encoding = 'utf-8') as outFp :
            for inStr in inFp :
                outStr = ""
                for ch in inStr :
                    outStr += chr(ord(ch) + secu)
                outFp.write(outStr)

convert("normal.txt", "security.txt", 100)
convert("security.txt", "recovery.txt", -100)

original = open("normal.txt", encoding = 'utf-8').read()
recovered = open("recovery.txt", encoding = 'utf-8').read()
print(recovered)
print("원본과 같은가?", original == recovered)`, points: ['같은 작업은 함수로', '<code>for ch in inStr</code> : 글자 바로 꺼내기', '복원 결과를 비교해 검증'],
            notes: '<p><b>[3분]</b> 9장 함수 복습을 겸합니다.</p>' },
          { layout: 'table', title: 'readline() vs readlines()', head: ['', 'readline() / for 행 in 파일', 'readlines()'], rows: [['읽는 양', '한 번에 한 행', '파일 전체 → 리스트'], ['메모리', '적게 사용', '파일 크기만큼 사용'], ['추천', '큰 파일(수백 MB~)', '작은 파일(수 MB)']],
            notes: '<p><b>[2분]</b> 강의자료 “여기서 잠깐” 내용. (강의자료의 Code11-32 는 Code11-03 의 오타)</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>chr(ord("A") + 2)</code> 의 결과는?', options: ['"A2"', '"C"', '67', '"B"'], answer: 1, explain: '65 + 2 = 67 → "C"',
            notes: '<p><b>[1분]</b></p>' },
          { layout: 'practice', title: '실습 11-3. 암호 키 입력받기', desc: '100 대신 입력한 키로 normal.txt 를 secret.txt 로 암호화하고, 다시 해독해 출력', stdin: '7\n', starter: `key = int(input("암호 키(숫자) : "))
# TODO: 암호화 → secret.txt
# TODO: secret.txt 해독 → 출력
`, solution: `key = int(input("암호 키(숫자) : "))
inFp = open("normal.txt", "r", encoding = "utf-8")
outFp = open("secret.txt", "w", encoding = "utf-8")
for inStr in inFp :
    outFp.write("".join(chr(ord(ch) + key) for ch in inStr))
inFp.close()
outFp.close()

secStr = open("secret.txt", "r", encoding = "utf-8").read()
print("".join(chr(ord(ch) - key) for ch in secStr))
`,
            notes: '<p><b>[8분]</b> 빠른 학생에게는 “키를 모를 때 1~200 을 모두 시도해 ‘안녕’ 이 나오는 키 찾기(무차별 대입)” 를 추가 과제로.</p>' },
          { layout: 'summary', title: '정리', bullets: ['<code>ord(글자)</code> → 번호, <code>chr(번호)</code> → 글자', '암호화: 번호 + 키, 해독: 번호 − 키', '행 단위로 읽고 → 글자 단위로 바꾸고 → 파일에 쓰기', '한글 파일은 <code>encoding = \'utf-8\'</code>', '큰 파일은 한 행씩 처리'],
            notes: '<p><b>[1분]</b> 다음 교시: 글자가 아닌 바이트를 다루는 이진 파일 → 흑백 사진 출력.</p>' }
        ]
      },
      /* ================================================================
       * 11-4. 이진 파일 입출력과 [프로그램 2] 흑백 사진 출력 (Section 03 끝 ~ 04)
       * ================================================================ */
      {
        id: 'ch11-4',
        title: '이진 파일 입출력과 [프로그램 2] 흑백 사진 출력',
        minutes: 50,
        goals: [
          '텍스트 파일과 이진 파일의 차이를 설명할 수 있다',
          'rb · wb 모드로 이진 파일을 한 바이트씩 읽고 써서 복사할 수 있다',
          'RAW 흑백 영상 파일의 구조(256×256 바이트)를 이해한다',
          'RAW 파일을 2차원 리스트로 읽고 tkinter 의 PhotoImage 에 출력할 수 있다'
        ],
        flow: [['이진 파일의 개념', 7], ['이진 파일 복사', 8], ['RAW 구조 · 윈도창 · 종이', 10], ['loadImage · displayImage · 완성', 17], ['실습 · 퀴즈', 8]],
        content: [
          { type: 'h', text: '이진 파일의 개념' },
          { type: 'p', html: '지금까지 다룬 파일은 사람이 읽을 수 있는 글자로 된 <b>텍스트 파일</b>이었습니다. 이와 달리 <b>이진(Binary, 바이너리) 파일</b>은 글자가 아니라 <b>비트(Bit) · 바이트 단위의 값 자체</b>가 의미를 갖는 파일입니다. 텍스트 파일을 제외한 거의 모든 파일 — 그림, 음악, 동영상, 엑셀, 실행(EXE) 파일 — 이 이진 파일입니다.' },
          { type: 'figure', html: FIG_BIN, caption: '그림 11-9 텍스트 파일과 이진 파일' },
          { type: 'p', html: '둘을 구분하는 간단한 방법은 <b>메모장으로 열어 보는 것</b>입니다. 글자가 제대로 보이면 텍스트 파일, <code>??ÿØJFIF</code> 처럼 깨진 글자가 보이면 이진 파일입니다. 이 강좌의 📁 작업 폴더에서 파일을 눌러 보면 텍스트 파일은 내용이, 이진 파일은 “이진(binary) 파일입니다” 라는 안내가 나옵니다.' },
          { type: 'p', html: '이진 파일은 모드에 <code>b</code> 를 붙여 <code>"rb"</code>(읽기) · <code>"wb"</code>(쓰기) 로 엽니다. 이때 읽은 값은 문자열(str)이 아니라 <b>바이트(bytes)</b> 입니다.' },
          { type: 'code', title: '추가 예제. 텍스트 모드와 이진 모드로 읽어 비교하기', code: `inFp = open("data1.txt", "r")          # 텍스트 모드
print(repr(inFp.read(8)))                # 8글자
inFp.close()

inFp = open("data1.txt", "rb")         # 이진 모드
print(inFp.read(8))                      # 8바이트
inFp.close()

inFp = open("RAW/pattern.raw", "rb")
inFp.seek(128 * 256 + 100)               # 128행 100열 위치로 이동
data = inFp.read(1)                      # 1바이트 읽기
print(data, type(data), ord(data))       # ord() 로 숫자(0~255)로
print(list(inFp.read(10)))               # 다음 10바이트를 숫자 리스트로
inFp.close()`, expect: `'CookBook'
b'CookBook'
b'\\xaf' <class 'bytes'> 175
[178, 181, 185, 191, 197, 204, 211, 219, 227, 235]`,
            desc: '<code>10행</code> <code>seek(위치)</code> 는 읽을 위치(바이트 번호)를 옮깁니다. <code>11행</code> 이진 모드에서 <code>read(1)</code> 은 1바이트짜리 bytes 를 돌려줍니다. <code>ord()</code> 에 넣으면 0~255 사이의 정수가 됩니다. <code>13행</code> bytes 를 <code>list()</code> 로 바꾸면 바로 숫자 리스트가 됩니다.' },
          { type: 'callout', kind: 'more', title: '📘 글자는 몇 바이트일까? — 인코딩', html: '<p>UTF-8 에서 영문 · 숫자 · 기호는 1바이트, 한글은 한 글자에 3바이트입니다. 그래서 <code>"CookBook"</code> 은 8바이트지만 <code>"파이썬"</code> 은 9바이트입니다. 문자열의 <code>encode()</code> 는 글자 → 바이트, bytes 의 <code>decode()</code> 는 바이트 → 글자로 바꿉니다.</p><pre><code>&gt;&gt;&gt; "파이썬".encode("utf-8")\nb\'\\xed\\x8c\\x8c\\xec\\x9d\\xb4\\xec\\x8d\\xac\'</code></pre>' },

          { type: 'h', text: '이진 파일의 복사' },
          { type: 'p', html: 'Code11-08(텍스트 파일 복사)을 고쳐서 이진 파일을 복사해 봅시다. 강의자료는 <code>C:/Windows/notepad.exe</code>(메모장 프로그램)를 복사하지만, 브라우저에는 윈도 프로그램이 없으므로 작업 폴더의 흑백 사진 파일 <code>RAW/tree.raw</code> 를 복사합니다. 이진 파일에는 “행”이 없으므로 <code>read(1)</code> 로 <b>1바이트씩</b> 읽어서 그대로 씁니다.' },
          { type: 'code', title: 'Code11-10. 이진 파일 복사', code: `inFp, outFp = None, None
inStr = ""

inFp = open("RAW/tree.raw", "rb")
outFp = open("tree_copy.raw", "wb")

while True :
    inStr = inFp.read(1)
    if not inStr :
        break
    outFp.write(inStr)

inFp.close()
outFp.close()
print("--- 이진 파일이 정상적으로 복사되었음 ---")

import os                                 # 확인용
print(os.path.getsize("RAW/tree.raw"), os.path.getsize("tree_copy.raw"))`, expect: `--- 이진 파일이 정상적으로 복사되었음 ---
65536 65536`,
            desc: '<code>4~5행</code> 읽기 · 쓰기 모두 <code>b</code> 를 붙입니다. <code>8행</code> 1바이트씩 읽고, 더 읽을 것이 없으면 빈 bytes <code>b""</code> 가 나오므로 <code>if not inStr</code> 로 끝냅니다. <code>17~18행</code>은 두 파일의 크기(바이트 수)가 같은지 확인하려고 추가했습니다.' },
          { type: 'callout', kind: 'more', title: '📘 1바이트씩 복사는 느립니다', html: '1바이트씩 읽고 쓰면 원리는 이해하기 쉽지만, 큰 파일에서는 매우 느립니다. 실제로는 <code>inFp.read(4096)</code> 처럼 덩어리(버퍼) 단위로 읽거나, 11-5 교시에서 배울 <code>shutil.copy()</code> 를 사용합니다. 파일 전체를 <code>outFp.write(inFp.read())</code> 한 줄로 복사할 수도 있습니다.' },

          { type: 'h', text: '[프로그램 2]의 완성 — RAW 사진 파일의 구조' },
          { type: 'p', html: '이제 이진 파일을 이용해 흑백 사진을 화면에 출력합니다. 사용할 <code>*.raw</code> 파일은 <b>256×256 픽셀</b> 크기의 흑백 사진입니다. 파일 안에는 머리글(크기 · 형식 정보) 없이, 왼쪽 위 점부터 한 행씩 <b>각 점의 밝기</b>가 1바이트씩 차례로 들어 있습니다. 밝기는 0(검정) ~ 255(흰색) 사이의 숫자입니다. 그래서 파일 크기는 정확히 256 × 256 = <b>65,536 바이트</b>입니다.' },
          { type: 'figure', html: FIG_RAW, caption: '그림 11-10 RAW 사진 파일의 구조' },
          { type: 'callout', kind: 'info', title: '이 강좌의 RAW 파일', html: '저작권 문제 때문에 교재의 사진 대신 파이썬(Pillow)으로 직접 그린 256×256 흑백 그림을 작업 폴더의 <code>RAW</code> 폴더에 넣어 두었습니다: <code>tree.raw</code>(나무), <code>face.raw</code>(안경 쓴 학생), <code>cat.raw</code>(고양이), <code>pattern.raw</code>(동심원 · 밝기 계단). 128×128 크기의 <code>face_128.raw</code>, <code>cat_128.raw</code> 도 있습니다.' },

          { type: 'h', text: '윈도창의 작성' },
          { type: 'p', html: '사진을 보여 줄 창부터 만듭니다. 10장에서 배운 tkinter 로 창(<code>Tk()</code>)을 만들고, 그 안에 그림을 그릴 수 있는 <b>캔버스(Canvas)</b> 를 256×256 크기로 놓습니다.' },
          { type: 'code', title: 'Code11-11. 기본 윈도창과 캔버스', code: `from tkinter import *

## 변수 선언 부분 ##
window = None
canvas = None
XSIZE, YSIZE = 256, 256

## 메인 코드 부분 ##
window = Tk()
canvas = Canvas(window, height = XSIZE, width = YSIZE)

canvas.pack()
window.mainloop()`, desc: '실행하면 빈 캔버스가 있는 창이 나타납니다. 창의 ✕ 로 닫습니다.' },
          { type: 'p', html: '캔버스 위에 점을 찍으려면 <b>흰 종이</b>를 한 장 붙입니다. <code>PhotoImage(width=, height=)</code> 는 지정한 크기의 빈 이미지를 만들고, <code>canvas.create_image()</code> 로 캔버스의 가운데에 붙입니다. 이 종이 변수 <code>paper</code> 에 색을 칠하면 화면에 사진이 나타납니다. Code11-11 의 11행에 두 행을 추가합니다.' },
          { type: 'code', title: 'Code11-11 + 흰 종이 붙이기', code: `from tkinter import *

## 변수 선언 부분 ##
window = None
canvas = None
XSIZE, YSIZE = 256, 256

## 메인 코드 부분 ##
window = Tk()
canvas = Canvas(window, height = XSIZE, width = YSIZE)
paper = PhotoImage(width = XSIZE, height = YSIZE)
canvas.create_image((XSIZE / 2, YSIZE / 2), image = paper, state = "normal")

canvas.pack()
window.mainloop()`, desc: '<code>12행</code> 이미지의 <b>가운데</b>를 캔버스 좌표 (128, 128) 에 놓으므로 종이가 캔버스를 꽉 채웁니다.' },
          { type: 'figure', html: FIG_PAPER, caption: '그림 11-11 흰 종이를 붙인 개념의 윈도창' },

          { type: 'h', text: 'RAW 사진 파일의 화면 출력' },
          { type: 'p', html: '전체 과정은 두 단계입니다. ❶ 디스크의 RAW 파일을 읽어 <b>메모리(2차원 리스트 inImage)</b> 에 저장하고(<code>loadImage()</code>), ❷ 메모리의 값을 윈도창의 종이에 출력합니다(<code>displayImage()</code>).' },
          { type: 'figure', html: FIG_LOAD, caption: '그림 11-12 RAW 사진 파일을 메모리로 읽은 후 화면에 출력하는 개념' },
          { type: 'p', html: '<b>❶ 파일 → 메모리</b> : 바깥 반복은 행, 안쪽 반복은 열입니다. 한 행(256개)을 <code>tmpList</code> 에 모은 뒤 <code>inImage</code> 에 추가하면, <code>inImage[i][k]</code> 가 i행 k열 점의 밝기인 2차원 리스트가 됩니다. 창 없이 이 부분만 실행해 봅시다.' },
          { type: 'code', title: '❶ loadImage() 부분 — RAW 파일을 2차원 리스트로', code: `XSIZE, YSIZE = 256, 256
inImage = []

fp = open("RAW/pattern.raw", "rb")
for i in range(0, XSIZE) :
    tmpList = []
    for k in range(0, YSIZE) :
        data = int(ord(fp.read(1)))
        tmpList.append(data)
    inImage.append(tmpList)
fp.close()

print("행 수 :", len(inImage), " 열 수 :", len(inImage[0]))
print("0행의 처음 8개 :", inImage[0][:8])
print("가운데 점(128행 128열) :", inImage[128][128])
print("왼쪽 띠(32행마다) :", [inImage[r][0] for r in range(0, 256, 32)])`, expect: `행 수 : 256  열 수 : 256
0행의 처음 8개 : [0, 0, 0, 0, 0, 0, 0, 0]
가운데 점(128행 128열) : 255
왼쪽 띠(32행마다) : [0, 36, 72, 108, 144, 180, 216, 252]`,
            desc: '<code>8행</code> 1바이트를 읽어 <code>ord()</code> 로 정수로 바꿉니다(<code>int()</code> 는 없어도 되지만 강의자료를 따랐습니다). pattern.raw 는 가운데가 가장 밝은(255 가까운) 동심원 그림입니다.' },
          { type: 'p', html: '<b>❷ 메모리 → 화면</b> : tkinter 의 <code>PhotoImage.put()</code> 은 색을 <code>"#rrggbb"</code> 형식의 문자열로 받습니다. 흑백이므로 빨강 · 초록 · 파랑에 같은 밝기를 넣습니다(예: 밝기 200 → 16진수 c8 → <code>"#c8c8c8"</code>). 한 행의 색들을 공백으로 이어 <code>{ }</code> 로 감싸고, 모든 행을 이어 붙인 긴 문자열을 <code>paper.put()</code> 에 한 번에 넘기면 전체 그림이 칠해집니다.' },
          { type: 'code', title: '❷ displayImage() 가 만드는 문자열 살펴보기 (2행 × 3열 그림)', code: `image = [[0, 128, 255],
         [200, 30, 90]]

rgbString = ""
for i in range(0, 2) :
    tmpString = ""
    for k in range(0, 3) :
        data = image[i][k]
        tmpString += "#%02x%02x%02x " % (data, data, data)   # x 뒤에 한 칸 공백
    rgbString += "{" + tmpString + "} "                       # } 뒤에 한 칸 공백
print(rgbString)`, expect: `{#000000 #808080 #ffffff } {#c8c8c8 #1e1e1e #5a5a5a } `,
            desc: '<code>%02x</code> 는 정수를 <b>2자리 16진수</b>로(한 자리면 앞에 0) 바꿉니다. 공백이 색과 색, 행과 행을 구분하므로 빠뜨리면 안 됩니다.' },
          { type: 'p', html: '이제 모두 합쳐 [프로그램 2] 를 완성합니다.' },
          { type: 'code', title: 'Code11-12. [프로그램 2] 흑백 사진 출력', code: `from tkinter import *

## 함수 선언 부분 ##
def loadImage(fname) :
    global inImage, XSIZE, YSIZE
    fp = open(fname, 'rb')

    for i in range(0, XSIZE) :
        tmpList = []
        for k in range(0, YSIZE) :
            data = int(ord(fp.read(1)))
            tmpList.append(data)
        inImage.append(tmpList)

    fp.close()

def displayImage(image) :
    global XSIZE, YSIZE
    rgbString = ""
    for i in range(0, XSIZE) :
        tmpString = ""
        for k in range(0, YSIZE) :
            data = image[i][k]
            tmpString += "#%02x%02x%02x " % (data, data, data)   # x 뒤에 한 칸 공백
        rgbString += "{" + tmpString + "} "                       # } 뒤에 한 칸 공백
    paper.put(rgbString)

## 전역 변수 선언 부분 ##
window = None
canvas = None
XSIZE, YSIZE = 256, 256
inImage = []                   # 2차원 리스트(메모리)

## 메인 코드 부분 ##
window = Tk()
window.title("흑백 사진 보기")
canvas = Canvas(window, height = XSIZE, width = YSIZE)
paper = PhotoImage(width = XSIZE, height = YSIZE)
canvas.create_image((XSIZE / 2, YSIZE / 2), image = paper, state = "normal")

# 파일 --> 메모리
filename = 'RAW/tree.raw'      # 강의자료 : C:/CookPython/RAW/tree.raw
loadImage(filename)

# 메모리 --> 화면
displayImage(inImage)

canvas.pack()
window.mainloop()`, desc: '<code>42행</code>의 파일명을 <code>\'RAW/face.raw\'</code>, <code>\'RAW/cat.raw\'</code>, <code>\'RAW/pattern.raw\'</code> 로 바꿔 실행해 보세요. <code>5행</code> <code>inImage</code> 는 함수 안에서 <code>append()</code> 만 하므로 <code>global</code> 이 없어도 되지만, 전역 변수를 쓴다는 것을 드러내려고 적었습니다.' },
          { type: 'callout', kind: 'warn', title: '다른 크기의 RAW 파일을 열 때', html: 'RAW 파일에는 크기 정보가 없습니다. 128×128 파일(<code>RAW/face_128.raw</code>)을 256×256 으로 읽으면 16,384 바이트 뒤에서 <code>fp.read(1)</code> 이 빈 bytes 를 돌려주고, <code>ord(b"")</code> 에서 <code>TypeError</code> 가 납니다. <code>XSIZE, YSIZE = 128, 128</code> 로 바꾸거나, 파일 크기로 한 변의 길이를 계산하세요: <code>int(os.path.getsize(파일명) ** 0.5)</code>.' },
          { type: 'code', title: '추가 예제. 파일 열기 대화상자로 사진 고르기 (크기 자동 계산)', code: `from tkinter import *
from tkinter.filedialog import askopenfilename
import os

def loadImage(fname) :
    global inImage, XSIZE, YSIZE
    XSIZE = YSIZE = int(os.path.getsize(fname) ** 0.5)   # 65536 → 256, 16384 → 128
    inImage = []
    fp = open(fname, 'rb')
    for i in range(0, XSIZE) :
        inImage.append(list(fp.read(YSIZE)))             # 한 행을 한 번에 읽어 숫자 리스트로
    fp.close()

def displayImage(image) :
    rgbString = ""
    for i in range(0, XSIZE) :
        tmpString = ""
        for k in range(0, YSIZE) :
            data = image[i][k]
            tmpString += "#%02x%02x%02x " % (data, data, data)
        rgbString += "{" + tmpString + "} "
    paper.put(rgbString)

XSIZE, YSIZE = 256, 256
inImage = []

window = Tk()
filename = askopenfilename(title = "RAW 파일 선택", filetypes = (("RAW 파일", "*.raw"), ("모든 파일", "*.*")))
if filename :
    loadImage(filename)
    window.title("흑백 사진 보기 - " + os.path.basename(filename) + " (%d×%d)" % (XSIZE, YSIZE))
    canvas = Canvas(window, height = XSIZE, width = YSIZE)
    paper = PhotoImage(width = XSIZE, height = YSIZE)
    canvas.create_image((XSIZE // 2, YSIZE // 2), image = paper, state = "normal")
    displayImage(inImage)
    canvas.pack()
else :
    Label(window, text = "파일을 선택하지 않았습니다.").pack()
window.mainloop()`, dialogs: ['RAW/cat_128.raw'],
            desc: '대화상자에는 작업 폴더의 파일 목록이 나옵니다. <code>RAW/face.raw</code>, <code>RAW/cat_128.raw</code> 처럼 크기가 다른 파일도 열 수 있습니다. <code>11행</code> <code>list(fp.read(YSIZE))</code> 는 한 행(YSIZE 바이트)을 한 번에 읽어 숫자 리스트로 바꾸므로 1바이트씩 읽는 것보다 빠릅니다.' },
          { type: 'callout', kind: 'more', title: '📘 점을 하나씩 찍는 방법 — put(색, (x, y))', html: '<p><code>paper.put("#rrggbb", (x, y))</code> 처럼 좌표를 주면 점 하나만 칠합니다. 이해하기는 쉽지만 256×256 = 65,536 번 호출해야 해서 느립니다. 한 번에 문자열로 넘기는 강의자료 방식이 훨씬 빠릅니다. 주의: <code>(x, y)</code> 는 (열, 행) 순서이므로 <code>image[i][k]</code> 는 <code>(k, i)</code> 에 찍습니다.</p>' },
          { type: 'code', title: '추가 예제. 점을 하나씩 찍어 128×128 사진 출력하기', code: `from tkinter import *

XSIZE, YSIZE = 128, 128
window = Tk()
window.title("점 하나씩 찍기")
canvas = Canvas(window, height = YSIZE * 2, width = XSIZE * 2)
paper = PhotoImage(width = XSIZE, height = YSIZE)

fp = open("RAW/face_128.raw", "rb")
for i in range(YSIZE) :                   # i : 행(y)
    for k in range(XSIZE) :               # k : 열(x)
        data = ord(fp.read(1))
        paper.put("#%02x%02x%02x" % (data, data, data), (k, i))
fp.close()

big = paper.zoom(2)                       # 2배로 확대한 복사본
canvas.create_image((XSIZE, YSIZE), image = big)
canvas.pack()
window.mainloop()`, desc: '<code>16행</code> <code>zoom(2)</code> 는 이미지를 가로 · 세로 2배로 키운 새 이미지를 만듭니다(10장).' },
          { type: 'callout', kind: 'more', title: '📘 Pillow 로 RAW 읽기', html: '영상 처리 라이브러리 Pillow 를 쓰면 RAW 바이트를 한 줄로 그림으로 바꿀 수 있습니다: <code>Image.frombytes("L", (256, 256), open("RAW/tree.raw", "rb").read())</code>. 여기서 <code>"L"</code> 은 흑백(한 점 = 1바이트) 모드입니다. 이 장에서는 원리를 이해하려고 직접 한 바이트씩 처리했습니다.' }
        ],
        practice: [
          {
            title: '실습 11-5. RAW 사진의 밝기 통계',
            level: 2,
            desc: '<p><code>RAW/tree.raw</code> 를 이진 모드로 읽어서 가장 어두운 값, 가장 밝은 값, 평균 밝기(소수점 1자리), 그리고 밝기가 128 이상인 점의 개수를 출력하세요. (창은 필요 없습니다)</p>',
            hint: '<code>data = fp.read()</code> 로 전체를 읽으면 bytes 이고, <code>min(data)</code>, <code>max(data)</code>, <code>sum(data)</code>, <code>len(data)</code> 를 바로 쓸 수 있습니다. 개수는 for 문과 if 문으로 셉니다.',
            starter: `fp = open("RAW/tree.raw", "rb")
data = fp.read()
fp.close()

print("점의 개수 :", len(data))
# TODO: 최솟값, 최댓값, 평균, 128 이상인 점의 개수
`,
            solution: `fp = open("RAW/tree.raw", "rb")
data = fp.read()
fp.close()

print("점의 개수 :", len(data))
print("가장 어두운 값 :", min(data))
print("가장 밝은 값 :", max(data))
print("평균 밝기 : %.1f" % (sum(data) / len(data)))
count = 0
for v in data :
    if v >= 128 :
        count += 1
print("128 이상인 점 :", count)
`,
            expect: `점의 개수 : 65536
가장 어두운 값 : 55
가장 밝은 값 : 250
평균 밝기 : 166.9
128 이상인 점 : 40387`
          },
          {
            title: '실습 11-6. 반전 영상(네거티브) 만들기',
            level: 2,
            desc: '<p>Code11-12 를 수정해서 사진을 <b>반전</b>(밝은 곳은 어둡게, 어두운 곳은 밝게)해서 출력하세요. 필름 사진의 네거티브처럼 보입니다.</p>',
            hint: '반전된 밝기 = <code>255 - 원래 밝기</code>. <code>displayImage()</code> 안에서 <code>data = 255 - image[i][k]</code> 로 바꾸면 됩니다.',
            starter: `from tkinter import *

def loadImage(fname) :
    fp = open(fname, 'rb')
    for i in range(0, XSIZE) :
        tmpList = []
        for k in range(0, YSIZE) :
            tmpList.append(ord(fp.read(1)))
        inImage.append(tmpList)
    fp.close()

def displayImage(image) :
    rgbString = ""
    for i in range(0, XSIZE) :
        tmpString = ""
        for k in range(0, YSIZE) :
            data = image[i][k]          # TODO: 반전
            tmpString += "#%02x%02x%02x " % (data, data, data)
        rgbString += "{" + tmpString + "} "
    paper.put(rgbString)

XSIZE, YSIZE = 256, 256
inImage = []
window = Tk()
window.title("반전 영상")
canvas = Canvas(window, height = XSIZE, width = YSIZE)
paper = PhotoImage(width = XSIZE, height = YSIZE)
canvas.create_image((XSIZE / 2, YSIZE / 2), image = paper, state = "normal")
loadImage('RAW/cat.raw')
displayImage(inImage)
canvas.pack()
window.mainloop()
`,
            solution: `from tkinter import *

def loadImage(fname) :
    fp = open(fname, 'rb')
    for i in range(0, XSIZE) :
        tmpList = []
        for k in range(0, YSIZE) :
            tmpList.append(ord(fp.read(1)))
        inImage.append(tmpList)
    fp.close()

def displayImage(image) :
    rgbString = ""
    for i in range(0, XSIZE) :
        tmpString = ""
        for k in range(0, YSIZE) :
            data = 255 - image[i][k]
            tmpString += "#%02x%02x%02x " % (data, data, data)
        rgbString += "{" + tmpString + "} "
    paper.put(rgbString)

XSIZE, YSIZE = 256, 256
inImage = []
window = Tk()
window.title("반전 영상")
canvas = Canvas(window, height = XSIZE, width = YSIZE)
paper = PhotoImage(width = XSIZE, height = YSIZE)
canvas.create_image((XSIZE / 2, YSIZE / 2), image = paper, state = "normal")
loadImage('RAW/cat.raw')
displayImage(inImage)
canvas.pack()
window.mainloop()
`
          },
          {
            title: '실습 11-7. 반전 영상을 RAW 파일로 저장하기',
            level: 3,
            desc: '<p><code>RAW/face.raw</code> 의 모든 점을 반전(255 - 값)해서 <code>face_neg.raw</code> 파일로 저장하세요. 저장한 파일의 크기와 처음 5개 점의 원래 값 · 반전 값을 출력합니다. 다 되면 추가 예제(대화상자)로 <code>face_neg.raw</code> 를 열어 확인해 보세요.</p>',
            hint: '이진 쓰기(<code>"wb"</code>)에는 bytes 를 써야 합니다. 정수 리스트 <code>outList</code> 를 <code>bytes(outList)</code> 로 바꿔 <code>write()</code> 합니다.',
            starter: `import os

inFp = open("RAW/face.raw", "rb")
inData = inFp.read()
inFp.close()

outList = []
# TODO: 모든 값을 반전해서 outList 에 추가

# TODO: face_neg.raw 에 bytes(outList) 쓰기

print("저장한 파일 크기 :", os.path.getsize("face_neg.raw") if os.path.exists("face_neg.raw") else 0)
`,
            solution: `import os

inFp = open("RAW/face.raw", "rb")
inData = inFp.read()
inFp.close()

outList = []
for v in inData :
    outList.append(255 - v)

outFp = open("face_neg.raw", "wb")
outFp.write(bytes(outList))
outFp.close()

print("저장한 파일 크기 :", os.path.getsize("face_neg.raw"))
print("원래 값 :", list(inData[:5]))
print("반전 값 :", outList[:5])
`,
            expect: `저장한 파일 크기 : 65536
원래 값 : [225, 225, 225, 225, 225]
반전 값 : [30, 30, 30, 30, 30]`
          }
        ],
        quiz: [
          { q: '그림 파일을 복사하려고 열 때 알맞은 모드의 조합은?', options: ['"r" 과 "w"', '"rb" 와 "wb"', '"r" 과 "a"', '"rt" 와 "wt"'], answer: 1, explain: '이진 파일은 b 를 붙인 이진 모드로 읽고 씁니다.' },
          { q: '256×256 크기의 RAW 흑백 사진 파일의 크기는?', options: ['256 바이트', '512 바이트', '65,536 바이트', '196,608 바이트'], answer: 2, explain: '점 하나가 1바이트이므로 256 × 256 = 65,536 바이트입니다. (컬러라면 점마다 3바이트 → 196,608)' },
          { q: '<code>"#%02x%02x%02x" % (200, 200, 200)</code> 의 결과는?', options: ['"#200200200"', '"#c8c8c8"', '"#C8"', '"#0c80c80c8"'], answer: 1, explain: '200 은 16진수로 c8 입니다. %02x 는 2자리 16진수(소문자)로 바꿉니다.' },
          { q: '이진 모드에서 <code>fp.read(1)</code> 이 파일 끝에서 돌려주는 값은?', options: ['<code>""</code>', '<code>b""</code> (빈 bytes)', '<code>0</code>', '<code>None</code>'], answer: 1, explain: '이진 모드는 bytes 를 돌려주므로 파일 끝에서는 빈 bytes 입니다. <code>if not inStr</code> 로 검사할 수 있습니다.' },
          { q: 'RAW 파일 출력에서 <code>inImage[10][20]</code> 이 뜻하는 것은?', options: ['10열 20행 점의 밝기', '10행 20열 점의 밝기', '10번째 파일의 20번째 글자', '밝기가 10~20 인 점'], answer: 1, explain: '바깥 리스트가 행, 안쪽 리스트가 열입니다.' }
        ],
        slides: [
          { layout: 'title', title: '이진 파일 입출력과 [프로그램 2] 흑백 사진 출력', subtitle: 'Section 04 이진 파일 입출력', badge: '11-4',
            notes: '<p><b>[도입 2분]</b> 발문: “사진 파일을 메모장으로 열면 어떻게 보일까?” → 실제로 열어 보이거나, 📁 작업 폴더에서 RAW 파일을 눌러 “이진 파일” 안내를 보여 줍니다.</p>' },
          { layout: 'diagram', title: '텍스트 파일 vs 이진 파일', html: FIG_BIN, caption: '이진 파일 = 바이트 값 자체가 의미 (그림 · 소리 · 실행 파일 …)',
            notes: '<p><b>[3분]</b> 텍스트 파일도 사실은 바이트이지만 “글자로 해석하는 규칙(인코딩)”이 정해져 있다는 점을 덧붙입니다.</p>' },
          { layout: 'code', title: 'bytes 맛보기', code: `inFp = open("RAW/pattern.raw", "rb")
data = inFp.read(1)
print(data, type(data), ord(data))
print(list(inFp.read(10)))
inFp.close()

print("파이썬".encode("utf-8"))
print(len("파이썬"), len("파이썬".encode("utf-8")))`, points: ['<code>rb</code> 로 읽으면 <code>bytes</code>', '<code>ord()</code> · <code>list()</code> 로 숫자(0~255)', '한글 한 글자 = UTF-8 3바이트'],
            notes: '<p><b>[3분]</b> b\'...\' 표기가 bytes 라는 것만 알면 충분합니다.</p>' },
          { layout: 'code', title: 'Code11-10. 이진 파일 복사', code: `inFp = open("RAW/tree.raw", "rb")
outFp = open("tree_copy.raw", "wb")

while True :
    inStr = inFp.read(1)
    if not inStr :
        break
    outFp.write(inStr)

inFp.close()
outFp.close()
print("--- 이진 파일이 정상적으로 복사되었음 ---")

import os
print(os.path.getsize("tree_copy.raw"))`, points: ['<code>rb</code> · <code>wb</code>', '<code>read(1)</code> : 1바이트씩', '파일 끝 → <code>b""</code>', '강의자료 notepad.exe → RAW 파일로 대체'],
            notes: '<p><b>[4분]</b> Code11-08(텍스트 복사)과 무엇이 달라졌는지 찾게 합니다: 모드에 b, 행 대신 1바이트.</p>' },
          { layout: 'diagram', title: 'RAW 사진 파일의 구조', html: FIG_RAW, caption: '256 × 256 점, 점마다 밝기 1바이트(0~255)',
            notes: '<p><b>[3분]</b> 발문: “컬러 사진이라면 점 하나에 몇 바이트가 필요할까?” → 빨강 · 초록 · 파랑 3바이트.</p>' },
          { layout: 'code', title: 'Code11-11. 윈도창 + 흰 종이', code: `from tkinter import *

XSIZE, YSIZE = 256, 256

window = Tk()
canvas = Canvas(window, height = XSIZE, width = YSIZE)
paper = PhotoImage(width = XSIZE, height = YSIZE)
canvas.create_image((XSIZE / 2, YSIZE / 2), image = paper, state = "normal")

paper.put("#ff0000", to = (50, 50, 200, 100))   # 확인용 빨간 띠

canvas.pack()
window.mainloop()`, points: ['창 → 캔버스 → 종이(PhotoImage)', '종이의 가운데를 (128, 128) 에', '<code>put()</code> 으로 색칠'],
            notes: '<p><b>[4분]</b> 원래 코드에 확인용으로 빨간 띠를 칠하는 줄을 넣었습니다. put 의 to=(x1, y1, x2, y2) 는 사각형 영역을 칠합니다.</p>' },
          { layout: 'diagram', title: '파일 → 메모리 → 화면', html: FIG_LOAD, caption: '❶ loadImage() → 2차원 리스트 inImage → ❷ displayImage()',
            notes: '<p><b>[2분]</b> 영상 처리 프로그램의 기본 구조입니다. 중간에 inImage 를 바꾸면(반전 · 밝게) 영상 처리가 됩니다.</p>' },
          { layout: 'code', title: '❶ loadImage : 파일 → 2차원 리스트', code: `XSIZE, YSIZE = 256, 256
inImage = []

fp = open("RAW/pattern.raw", "rb")
for i in range(0, XSIZE) :
    tmpList = []
    for k in range(0, YSIZE) :
        data = int(ord(fp.read(1)))
        tmpList.append(data)
    inImage.append(tmpList)
fp.close()

print(len(inImage), len(inImage[0]))
print(inImage[128][120:136])`, points: ['바깥 for = 행, 안쪽 for = 열', '1바이트 → <code>ord()</code> → 정수', '<code>inImage[i][k]</code>'],
            notes: '<p><b>[4분]</b> 가운데 부근 값이 255 에 가까운 것을 확인합니다.</p>' },
          { layout: 'code', title: '❷ displayImage : 색 문자열 만들기', code: `image = [[0, 128, 255],
         [200, 30, 90]]

rgbString = ""
for i in range(0, 2) :
    tmpString = ""
    for k in range(0, 3) :
        data = image[i][k]
        tmpString += "#%02x%02x%02x " % (data, data, data)
    rgbString += "{" + tmpString + "} "
print(rgbString)`, points: ['<code>%02x</code> : 2자리 16진수', 'R = G = B → 회색', '<code>{행} {행} …</code> → <code>paper.put()</code>'],
            notes: '<p><b>[3분]</b> 공백을 빠뜨리면 색 이름이 붙어 오류가 난다는 점(강의자료 주석)을 강조합니다.</p>' },
          { layout: 'code', title: 'Code11-12. [프로그램 2] 완성 (요약)', code: `from tkinter import *
def loadImage(fname) :
    fp = open(fname, 'rb')
    for i in range(0, XSIZE) :
        tmpList = []
        for k in range(0, YSIZE) :
            tmpList.append(int(ord(fp.read(1))))
        inImage.append(tmpList)
    fp.close()
def displayImage(image) :
    rgbString = ""
    for i in range(0, XSIZE) :
        tmpString = ""
        for k in range(0, YSIZE) :
            data = image[i][k]
            tmpString += "#%02x%02x%02x " % (data, data, data)
        rgbString += "{" + tmpString + "} "
    paper.put(rgbString)
XSIZE, YSIZE, inImage = 256, 256, []
window = Tk(); window.title("흑백 사진 보기")
canvas = Canvas(window, height = XSIZE, width = YSIZE)
paper = PhotoImage(width = XSIZE, height = YSIZE)
canvas.create_image((XSIZE / 2, YSIZE / 2), image = paper, state = "normal")
loadImage('RAW/tree.raw'); displayImage(inImage); canvas.pack(); window.mainloop()`, points: ['파일명만 바꿔 다른 사진', 'face · cat · pattern.raw', '전체 코드는 학생용 본문 참고'],
            notes: '<p><b>[8분]</b> 슬라이드에 맞추려고 줄였습니다(; 로 여러 문장을 한 줄에). 학생들은 본문의 Code11-12 를 그대로 입력하게 하세요. 파일명을 바꿔 가며 실행해 봅니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>"#%02x%02x%02x" % (200, 200, 200)</code> 의 결과는?', options: ['"#200200200"', '"#c8c8c8"', '"#C8"', '"#0c80c80c8"'], answer: 1, explain: '200 = 16진수 c8',
            notes: '<p><b>[1분]</b></p>' },
          { layout: 'practice', title: '실습 11-5. RAW 사진의 밝기 통계', desc: 'RAW/tree.raw 의 최솟값 · 최댓값 · 평균 밝기 · 128 이상인 점의 개수 출력', starter: `fp = open("RAW/tree.raw", "rb")
data = fp.read()
fp.close()
# TODO
`, solution: `fp = open("RAW/tree.raw", "rb")
data = fp.read()
fp.close()
print("가장 어두운 값 :", min(data))
print("가장 밝은 값 :", max(data))
print("평균 밝기 : %.1f" % (sum(data) / len(data)))
print("128 이상인 점 :", sum(1 for v in data if v >= 128))
`,
            notes: '<p><b>[5분]</b> 빠른 학생은 실습 11-6(반전 영상)으로. bytes 도 리스트처럼 min · max · sum 을 쓸 수 있다는 점이 포인트.</p>' },
          { layout: 'summary', title: '정리', bullets: ['이진 파일: <code>"rb"</code> · <code>"wb"</code>, 읽은 값은 <code>bytes</code>', '<code>read(1)</code> → 1바이트, 파일 끝은 <code>b""</code>', 'RAW = 머리글 없는 밝기 바이트의 나열 (256×256 = 65,536)', '파일 → 2차원 리스트 → <code>"#rrggbb"</code> 문자열 → <code>paper.put()</code>'],
            notes: '<p><b>[1분]</b> 다음 교시: 파일과 폴더를 통째로 다루는 os · shutil · zipfile 모듈.</p>' }
        ]
      },
      /* ================================================================
       * 11-5. 파일 및 디렉터리 다루기 (Section 05 앞부분)
       * ================================================================ */
      {
        id: 'ch11-5',
        title: '파일 및 디렉터리 다루기 — os · shutil · zipfile',
        minutes: 45,
        goals: [
          'shutil · os · os.path 모듈이 제공하는 기능을 dir() 로 살펴볼 수 있다',
          'shutil.copy() · copytree() 로 파일과 폴더를 복사할 수 있다',
          'os.mkdir() · shutil.rmtree() · os.remove() 로 폴더와 파일을 만들고 지울 수 있다',
          'os.walk() · os.path.exists() · getsize() 로 폴더와 파일 정보를 알아낼 수 있다',
          'zipfile 모듈로 파일을 압축하고 압축을 풀 수 있다'
        ],
        flow: [['모듈 살펴보기', 5], ['복사 · 폴더 생성 · 삭제', 12], ['목록 · 존재 확인 · 크기', 10], ['압축과 압축 풀기', 8], ['실습 · 퀴즈', 10]],
        content: [
          { type: 'h', text: '파일 및 디렉터리 다루기' },
          { type: 'p', html: '파일의 <b>내용</b>을 읽고 쓰는 것 말고도, 파일을 통째로 복사하거나 지우고, 폴더(<b>디렉터리, directory</b>)를 만드는 일도 자주 필요합니다. 파이썬은 이런 일을 위해 <code>shutil</code>(shell utility), <code>os</code>(운영체제), <code>os.path</code>(경로) 모듈을 제공합니다. <code>dir(모듈)</code> 로 어떤 함수가 있는지 볼 수 있습니다.' },
          { type: 'code', repl: true, title: 'shutil · os · os.path 모듈 살펴보기', code: `import shutil
[name for name in dir(shutil) if name.startswith('copy')]
import os
'mkdir' in dir(os), 'remove' in dir(os), 'walk' in dir(os)
import os.path
[name for name in dir(os.path) if name.startswith('get')]`, expect: `>>> import shutil
>>> [name for name in dir(shutil) if name.startswith('copy')]
['copy', 'copy2', 'copyfile', 'copyfileobj', 'copymode', 'copystat', 'copytree']
>>> import os
>>> 'mkdir' in dir(os), 'remove' in dir(os), 'walk' in dir(os)
(True, True, True)
>>> import os.path
>>> [name for name in dir(os.path) if name.startswith('get')]
['getatime', 'getctime', 'getmtime', 'getsize']
>>>`,
            desc: '<code>dir(shutil)</code> 을 그대로 실행하면 이름이 아주 많이 나옵니다. 여기서는 리스트 컴프리헨션(7장)으로 특정 글자로 시작하는 이름만 골라 보았습니다. 셸에서 <code>dir(os)</code> 를 직접 실행해 보세요.' },
          { type: 'callout', kind: 'info', title: '경로는 작업 폴더 기준으로', html: '강의자료는 <code>C:/Windows/notepad.exe</code>, <code>C:/Temp/</code>, <code>C:/myDir/</code> 같은 경로를 씁니다. 이 강좌에서는 모두 작업 폴더 안의 파일 · 폴더로 바꾸었습니다. 집의 PC 에서 강의자료 경로로 실습할 때는 <b>C:\\Windows 안의 파일을 지우거나 덮어쓰지 않도록</b> 특히 조심하세요.' },

          { type: 'h', text: '파일 및 디렉터리 복사' },
          { type: 'p', html: '<code>shutil.copy(소스파일, 타깃파일)</code> 은 파일을 복사하고 만든 파일의 경로를 돌려줍니다. 11-2 교시에서 여러 줄로 만든 copy 명령이 한 줄로 끝납니다. 원본 파일이 있어야 하고, 복사할 곳의 폴더도 미리 있어야 합니다. 폴더를 통째로 복사할 때는 <code>shutil.copytree(소스폴더, 타깃폴더)</code> 를 씁니다.' },
          { type: 'code', repl: true, title: 'shutil.copy() 와 shutil.copytree()', code: `import shutil, os
shutil.copy('win.ini', 'myWin.ini')
shutil.copytree('RAW', 'RAW_backup')
sorted(os.listdir('RAW_backup'))`, expect: `>>> import shutil, os
>>> shutil.copy('win.ini', 'myWin.ini')
'myWin.ini'
>>> shutil.copytree('RAW', 'RAW_backup')
'RAW_backup'
>>> sorted(os.listdir('RAW_backup'))
['cat.raw', 'cat_128.raw', 'face.raw', 'face_128.raw', 'pattern.raw', 'tree.raw']
>>>`,
            desc: '강의자료: <code>shutil.copy(\'C:/Windows/notepad.exe\', \'C:/Temp/myNote.exe\')</code>, <code>shutil.copytree(\'C:/CookPython/GIF/\', \'C:/Temp/GIF\')</code>. <code>os.listdir(폴더)</code> 는 폴더 안의 이름 목록을 돌려줍니다(순서가 정해져 있지 않아 <code>sorted()</code> 로 정렬했습니다). <code>copytree()</code> 는 타깃 폴더가 이미 있으면 오류가 나므로 두 번 실행하려면 먼저 지워야 합니다.' },

          { type: 'h', text: '디렉터리의 생성 및 삭제' },
          { type: 'p', html: '<code>os.mkdir(폴더명)</code> 은 폴더를 만들고, <code>shutil.rmtree(폴더명)</code> 은 폴더를 <b>안의 파일까지 모두</b> 지웁니다. <code>os.mkdir()</code> 은 한 단계씩만 만들 수 있으므로, <code>myDir/dir1</code> 을 만들려면 상위 폴더 <code>myDir</code> 을 먼저 만들어야 합니다.' },
          { type: 'code', title: '디렉터리 생성과 삭제', code: `import os
import shutil

os.mkdir('myDir/')
os.mkdir('myDir/dir1/')
print("만든 뒤 :", os.path.exists('myDir/dir1'))

shutil.rmtree('myDir/')
print("지운 뒤 :", os.path.exists('myDir'))

try :
    os.mkdir('noDir/dir1/')        # 상위 폴더 noDir 이 없음
except Exception as e :
    print("오류 :", type(e).__name__)`, expect: `만든 뒤 : True
지운 뒤 : False
오류 : FileNotFoundError`,
            desc: '강의자료의 <code>C:/myDir/</code> → <code>myDir/</code>. 강의자료 코드는 아무것도 출력하지 않아서, 결과를 확인하도록 <code>print()</code> 를 넣었습니다. <code>11~14행</code>은 상위 폴더 없이 만들 때의 오류를 보여 주려고 추가했습니다 (try~except 는 11-6 교시에서 자세히 배웁니다).' },
          { type: 'callout', kind: 'warn', title: 'rmtree 는 휴지통을 거치지 않습니다', html: '<code>shutil.rmtree()</code> 와 <code>os.remove()</code> 로 지운 파일은 휴지통에 가지 않고 <b>바로 영구 삭제</b>됩니다. 지우는 코드는 경로를 꼭 다시 확인한 뒤 실행하세요.' },
          { type: 'callout', kind: 'more', title: '📘 os.makedirs() — 여러 단계를 한 번에', html: '<code>os.makedirs(\'a/b/c\')</code> 는 중간 폴더까지 한 번에 만듭니다. <code>exist_ok=True</code> 를 주면 이미 있어도 오류가 나지 않습니다: <code>os.makedirs(\'backup/2026\', exist_ok=True)</code>' },

          { type: 'h', text: '디렉터리의 목록 모두 보기' },
          { type: 'p', html: '<code>os.walk(폴더)</code> 는 폴더와 그 <b>하위 폴더를 모두 돌아다니며</b> (폴더 이름, 하위 폴더 목록, 파일 목록) 세 가지를 차례로 알려 줍니다. <code>os.path.join(폴더, 파일)</code> 은 폴더와 파일 이름을 운영체제에 맞는 구분 기호로 이어 줍니다.' },
          { type: 'code', title: 'os.walk() 로 폴더 안의 모든 파일 보기', code: `import os

os.makedirs('myDir/sub', exist_ok = True)       # 연습용 폴더와 파일 만들기
open('myDir/a.txt', 'w').close()
open('myDir/sub/b.txt', 'w').close()

for dirName, subDirList, fnames in os.walk('myDir') :
    for fname in fnames :
        print(os.path.join(dirName, fname))`, nondeterministic: true,
            desc: '강의자료는 <code>C:\\\\Windows\\\\debug</code> 폴더를 살펴봅니다. 이 강좌의 파이썬에서는 <code>myDir/a.txt</code>, <code>myDir/sub/b.txt</code> 처럼 <code>/</code> 로 이어지고, 윈도의 IDLE 에서는 <code>myDir\\sub\\b.txt</code> 처럼 <code>\\</code> 로 이어집니다. 파일이 나오는 순서도 운영체제마다 다를 수 있습니다. 강의자료처럼 대화형 모드에서 <code>print</code> 없이 <code>os.path.join(…)</code> 만 쓰면 결과가 나오지 않는 점에도 주의하세요(반복문 안의 식은 셸이 출력하지 않음).' },

          { type: 'h', text: '파일 또는 폴더가 이미 있는지 확인 · 파일 삭제 · 파일 크기' },
          { type: 'code', repl: true, title: 'os.path.exists() · isfile() · isdir() · getsize()', code: `import os.path
os.path.exists('RAW/tree.raw')
os.path.isfile('RAW/tree.raw')
os.path.isdir('RAW')
os.path.isfile('RAW')
os.path.getsize('RAW/tree.raw')
os.path.getsize('win.ini')`, expect: `>>> import os.path
>>> os.path.exists('RAW/tree.raw')
True
>>> os.path.isfile('RAW/tree.raw')
True
>>> os.path.isdir('RAW')
True
>>> os.path.isfile('RAW')
False
>>> os.path.getsize('RAW/tree.raw')
65536
>>> os.path.getsize('win.ini')
85
>>>`,
            desc: '<code>exists()</code> 는 파일 · 폴더 구분 없이 있는지, <code>isfile()</code> 은 파일인지, <code>isdir()</code> 은 폴더인지 확인합니다. <code>getsize()</code> 는 파일 크기를 <b>바이트 단위</b>로 알려 줍니다(강의자료: <code>GIF/dog.gif</code> → 22332).' },
          { type: 'p', html: '파일은 <code>os.remove(파일명)</code> 으로 지웁니다. 이미 지워진(없는) 파일을 다시 지우려고 하면 <code>FileNotFoundError</code> 가 납니다.' },
          { type: 'code', title: 'os.remove() 로 파일 삭제 — 두 번 지우면?', code: `import os
import shutil

shutil.copy('win.ini', 'myWin.ini')
os.remove('myWin.ini')
print("첫 번째 삭제 완료")
os.remove('myWin.ini')`, expectError: true, nondeterministic: true,
            desc: '오류 메시지는 운영체제마다 조금 다릅니다. 이 강좌에서는 <code>FileNotFoundError: [Errno 2] No such file or directory: \'myWin.ini\'</code>, 윈도 IDLE 에서는 <code>FileNotFoundError: [WinError 2] 지정된 파일을 찾을 수 없습니다: \'myWin.ini\'</code> 로 나옵니다.' },

          { type: 'h', text: '파일 압축과 압축 풀기' },
          { type: 'p', html: '압축 기능은 <code>zipfile</code> 모듈이 제공합니다. <code>zipfile.ZipFile(zip파일명, \'w\')</code> 로 새 압축 파일을 만들고 <code>write()</code> 로 파일을 넣습니다. <code>compress_type = zipfile.ZIP_DEFLATED</code> 를 주어야 실제로 크기가 줄어듭니다(주지 않으면 압축하지 않고 묶기만 함). 압축을 풀 때는 <code>\'r\'</code> 모드로 열어 <code>extractall(폴더)</code> 을 호출합니다.' },
          { type: 'code', title: '파일 압축하기', code: `import zipfile
import os

newZip = zipfile.ZipFile('new.zip', 'w')
newZip.write('RAW/tree.raw', compress_type = zipfile.ZIP_DEFLATED)
newZip.write('win.ini', compress_type = zipfile.ZIP_DEFLATED)
newZip.close()

print("원래 크기 :", os.path.getsize('RAW/tree.raw') + os.path.getsize('win.ini'))
print("줄어들었나? :", os.path.getsize('new.zip') < 65536)`, expect: `원래 크기 : 65621
줄어들었나? : True`,
            desc: '강의자료: <code>ZipFile(\'C:/Temp/new.zip\', \'w\')</code> 에 <code>C:/Windows/notepad.exe</code> 를 압축. 이 그림 파일은 비슷한 값이 많아서 원래 크기의 몇 분의 일로 줄어듭니다. 📁 작업 폴더에서 new.zip 을 내려받아 PC 에서 열어 볼 수도 있습니다.' },
          { type: 'code', title: '압축 풀기', code: `import zipfile
import os

newZip = zipfile.ZipFile('new.zip', 'w')          # 먼저 압축 파일 만들기
newZip.write('RAW/tree.raw', compress_type = zipfile.ZIP_DEFLATED)
newZip.write('win.ini', compress_type = zipfile.ZIP_DEFLATED)
newZip.close()

extZip = zipfile.ZipFile('new.zip', 'r')
print("압축 파일 안의 목록 :", extZip.namelist())
extZip.extractall('unzip/')
extZip.close()

print(sorted(os.listdir('unzip')))
print(os.path.getsize('unzip/RAW/tree.raw'))`, expect: `압축 파일 안의 목록 : ['RAW/tree.raw', 'win.ini']
['RAW', 'win.ini']
65536`,
            desc: '강의자료: <code>extZip.extractall(\'C:/Temp/\')</code>. <code>namelist()</code> 는 압축 파일 안의 파일 이름 목록입니다. 폴더 구조(<code>RAW/</code>)까지 그대로 풀립니다.' },
          { type: 'callout', kind: 'more', title: '📘 with 문과 shutil.make_archive()', html: '<p>ZipFile 도 <code>with zipfile.ZipFile(\'new.zip\', \'w\') as z :</code> 처럼 쓰면 자동으로 닫힙니다. 폴더 하나를 통째로 압축할 때는 <code>shutil.make_archive(\'raw_backup\', \'zip\', \'RAW\')</code> 한 줄이면 됩니다(→ raw_backup.zip).</p>' }
        ],
        practice: [
          {
            title: '실습 11-8. 텍스트 파일 백업하기',
            level: 2,
            desc: '<p><code>backup</code> 폴더를 만들고(이미 있으면 그대로 사용), 작업 폴더에서 이름이 <code>.txt</code> 로 끝나는 파일 중 <code>data1.txt</code> 와 <code>normal.txt</code> 를 <code>backup</code> 폴더에 복사하세요. 그다음 backup 폴더의 파일 이름과 크기를 이름 순서로 출력합니다.</p><pre>data1.txt 복사 완료\nnormal.txt 복사 완료\n--- backup 폴더 ---\ndata1.txt : 106 바이트\nnormal.txt : 89 바이트</pre>',
            hint: '<code>os.makedirs(\'backup\', exist_ok=True)</code>, <code>shutil.copy(파일, \'backup/\' + 파일)</code>, <code>sorted(os.listdir(\'backup\'))</code>, <code>os.path.getsize()</code>',
            starter: `import os
import shutil

files = ['data1.txt', 'normal.txt']
# TODO: backup 폴더 만들기

# TODO: 파일 복사

print("--- backup 폴더 ---")
# TODO: 이름 순서로 이름과 크기 출력
`,
            solution: `import os
import shutil

files = ['data1.txt', 'normal.txt']
os.makedirs('backup', exist_ok = True)

for f in files :
    shutil.copy(f, 'backup/' + f)
    print(f, "복사 완료")

print("--- backup 폴더 ---")
for name in sorted(os.listdir('backup')) :
    print(name, ":", os.path.getsize('backup/' + name), "바이트")
`,
            expect: `data1.txt 복사 완료
normal.txt 복사 완료
--- backup 폴더 ---
data1.txt : 106 바이트
normal.txt : 89 바이트`
          },
          {
            title: '실습 11-9. RAW 폴더를 압축하기',
            level: 3,
            desc: '<p><code>RAW</code> 폴더 안의 모든 파일을 <code>raw_all.zip</code> 하나로 압축하고, 압축 파일 안의 목록(이름 순서)과 원래 크기 합계를 출력하세요. 마지막으로 압축 파일이 원래 크기 합계보다 작은지 출력합니다.</p>',
            hint: '<code>for name in sorted(os.listdir(\'RAW\')) :</code> 로 파일마다 <code>newZip.write(\'RAW/\' + name, compress_type = zipfile.ZIP_DEFLATED)</code>. 목록은 <code>namelist()</code>.',
            starter: `import zipfile
import os

total = 0
newZip = zipfile.ZipFile('raw_all.zip', 'w')
# TODO: RAW 폴더의 파일을 하나씩 압축하고 크기 더하기
newZip.close()

# TODO: 목록 · 합계 · 비교 출력
`,
            solution: `import zipfile
import os

total = 0
newZip = zipfile.ZipFile('raw_all.zip', 'w')
for name in sorted(os.listdir('RAW')) :
    newZip.write('RAW/' + name, compress_type = zipfile.ZIP_DEFLATED)
    total += os.path.getsize('RAW/' + name)
newZip.close()

extZip = zipfile.ZipFile('raw_all.zip', 'r')
for name in extZip.namelist() :
    print(name)
extZip.close()
print("원래 크기 합계 :", total)
print("압축 파일이 더 작은가? :", os.path.getsize('raw_all.zip') < total)
`,
            expect: `RAW/cat.raw
RAW/cat_128.raw
RAW/face.raw
RAW/face_128.raw
RAW/pattern.raw
RAW/tree.raw
원래 크기 합계 : 294912
압축 파일이 더 작은가? : True`
          }
        ],
        quiz: [
          { q: '파일 하나를 복사하는 함수는?', options: ['<code>os.copy()</code>', '<code>shutil.copy()</code>', '<code>os.path.copy()</code>', '<code>zipfile.copy()</code>'], answer: 1, explain: '파일 복사는 <code>shutil.copy()</code>, 폴더 통째 복사는 <code>shutil.copytree()</code> 입니다.' },
          { q: '<code>os.mkdir(\'a/b\')</code> 가 오류를 내는 경우는?', options: ['a 폴더가 이미 있을 때', 'a 폴더가 없을 때', 'b 가 파일 이름일 때', '항상 성공한다'], answer: 1, explain: '<code>os.mkdir()</code> 은 상위 폴더가 있어야 합니다. 한 번에 만들려면 <code>os.makedirs()</code> 를 씁니다.' },
          { q: '폴더를 안의 파일까지 모두 지우는 함수는?', options: ['<code>os.remove()</code>', '<code>os.rmdir()</code>', '<code>shutil.rmtree()</code>', '<code>os.path.delete()</code>'], answer: 2, explain: '<code>os.remove()</code> 는 파일 하나, <code>os.rmdir()</code> 은 빈 폴더만 지웁니다.' },
          { q: '256×256 RAW 파일에 대해 <code>os.path.getsize()</code> 의 결과는?', options: ['256', '65536', '(256, 256)', '파일 이름'], answer: 1, explain: '파일 크기를 바이트 단위로 돌려줍니다.' },
          { q: 'zipfile 로 실제로 크기를 줄여 압축하려면 write() 에 무엇을 지정해야 할까?', options: ['<code>mode = \'z\'</code>', '<code>compress_type = zipfile.ZIP_DEFLATED</code>', '<code>encoding = \'zip\'</code>', '아무것도 필요 없다'], answer: 1, explain: '기본값(ZIP_STORED)은 압축하지 않고 묶기만 합니다.' }
        ],
        slides: [
          { layout: 'title', title: '파일 및 디렉터리 다루기', subtitle: 'Section 05 — os · os.path · shutil · zipfile', badge: '11-5',
            notes: '<p><b>[도입 2분]</b> 발문: “탐색기에서 마우스로 하는 일(복사 · 새 폴더 · 삭제 · 압축)을 코드로 하면 무엇이 좋을까?” → 수백 개 파일도 한 번에, 매일 자동 백업.</p>' },
          { layout: 'table', title: '파일 · 폴더를 다루는 함수', head: ['하는 일', '함수'], rows: [['파일 복사 / 폴더 복사', '<code>shutil.copy()</code> / <code>shutil.copytree()</code>'], ['폴더 만들기 / 폴더 지우기', '<code>os.mkdir()</code> / <code>shutil.rmtree()</code>'], ['파일 지우기', '<code>os.remove()</code>'], ['목록 보기', '<code>os.listdir()</code> · <code>os.walk()</code>'], ['있는지 · 파일? · 폴더? · 크기', '<code>os.path.exists() · isfile() · isdir() · getsize()</code>'], ['압축 / 압축 풀기', '<code>zipfile.ZipFile(…).write()</code> / <code>extractall()</code>']],
            notes: '<p><b>[3분]</b> 전체 지도를 먼저 보여 주고 하나씩 실행합니다. dir(shutil) 로 직접 찾아보는 습관도 소개합니다.</p>' },
          { layout: 'code', title: '복사: shutil.copy · copytree', code: `import shutil, os
shutil.copy('win.ini', 'myWin.ini')
shutil.copytree('RAW', 'RAW_backup')
sorted(os.listdir('RAW_backup'))`, repl: true, points: ['원본 파일 · 대상 폴더가 있어야 함', 'copytree 대상 폴더는 없어야 함', '강의자료 notepad.exe → win.ini'],
            notes: '<p><b>[3분]</b> 두 번 실행하면 copytree 가 FileExistsError 를 내는 것도 보여 주세요.</p>' },
          { layout: 'code', title: '폴더 만들기 · 지우기', code: `import os
import shutil

os.mkdir('myDir/')
os.mkdir('myDir/dir1/')
print(os.path.exists('myDir/dir1'))

shutil.rmtree('myDir/')
print(os.path.exists('myDir'))`, points: ['<code>mkdir</code> 은 한 단계씩 (상위 폴더 먼저)', '<code>makedirs</code> 는 여러 단계 한 번에', '<code>rmtree</code> : 안의 파일까지 영구 삭제'],
            notes: '<p><b>[3분]</b> 4행을 빼고 5행만 실행하면 오류가 난다는 점을 확인시킵니다. 삭제 함수는 휴지통을 거치지 않는다는 경고를 꼭 하세요.</p>' },
          { layout: 'code', title: 'os.walk() : 하위 폴더까지 모든 파일', code: `import os

os.makedirs('myDir/sub', exist_ok = True)
open('myDir/a.txt', 'w').close()
open('myDir/sub/b.txt', 'w').close()

for dirName, subDirList, fnames in os.walk('myDir') :
    for fname in fnames :
        print(os.path.join(dirName, fname))`, points: ['(폴더, 하위 폴더들, 파일들) 을 차례로', '<code>os.path.join()</code> : 경로 잇기', '윈도는 <code>\\</code>, 이 강좌는 <code>/</code>'],
            notes: '<p><b>[3분]</b> 강의자료는 C:\\Windows\\debug 를 살펴봅니다. 경로 구분 기호가 운영체제마다 다르므로 문자열 + 로 잇기보다 join 을 쓰는 것이 안전하다고 설명합니다.</p>' },
          { layout: 'code', title: '존재 확인 · 크기 · 삭제', code: `import os, shutil
print(os.path.exists('RAW/tree.raw'), os.path.isfile('RAW/tree.raw'), os.path.isdir('RAW'))
print(os.path.getsize('RAW/tree.raw'), "바이트")

shutil.copy('win.ini', 'myWin.ini')
os.remove('myWin.ini')
print(os.path.exists('myWin.ini'))`, points: ['<code>exists</code> · <code>isfile</code> · <code>isdir</code>', '<code>getsize</code> : 바이트 단위', '없는 파일 remove → FileNotFoundError'],
            notes: '<p><b>[3분]</b> 마지막 줄 뒤에 os.remove(\'myWin.ini\') 를 한 번 더 넣어 오류를 보여 주면 다음 교시(예외 처리)로 자연스럽게 이어집니다.</p>' },
          { layout: 'code', title: '압축과 압축 풀기 : zipfile', code: `import zipfile, os

newZip = zipfile.ZipFile('new.zip', 'w')
newZip.write('RAW/tree.raw', compress_type = zipfile.ZIP_DEFLATED)
newZip.write('win.ini', compress_type = zipfile.ZIP_DEFLATED)
newZip.close()
print(os.path.getsize('new.zip'), "바이트")

extZip = zipfile.ZipFile('new.zip', 'r')
print(extZip.namelist())
extZip.extractall('unzip/')
extZip.close()
print(sorted(os.listdir('unzip')))`, points: ['<code>\'w\'</code> 로 만들고 <code>write()</code>', '<code>ZIP_DEFLATED</code> 여야 실제로 줄어듦', '<code>\'r\'</code> 로 열고 <code>extractall()</code>'],
            notes: '<p><b>[4분]</b> 65KB 그림이 몇 KB 로 줄어드는지 확인합니다. 📁 작업 폴더에서 new.zip 을 내려받아 PC 에서 열어 보게 해도 좋습니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '폴더를 안의 파일까지 모두 지우는 함수는?', options: ['os.remove()', 'os.rmdir()', 'shutil.rmtree()', 'os.path.delete()'], answer: 2, explain: 'remove 는 파일 하나, rmdir 은 빈 폴더만.',
            notes: '<p><b>[1분]</b></p>' },
          { layout: 'practice', title: '실습 11-8. 텍스트 파일 백업', desc: 'backup 폴더를 만들고 data1.txt · normal.txt 를 복사한 뒤, 폴더의 이름과 크기를 출력', starter: `import os
import shutil
files = ['data1.txt', 'normal.txt']
# TODO
`, solution: `import os
import shutil
files = ['data1.txt', 'normal.txt']
os.makedirs('backup', exist_ok = True)
for f in files :
    shutil.copy(f, 'backup/' + f)
for name in sorted(os.listdir('backup')) :
    print(name, ":", os.path.getsize('backup/' + name), "바이트")
`,
            notes: '<p><b>[6분]</b> 빠른 학생은 실습 11-9(RAW 폴더 압축)로.</p>' },
          { layout: 'summary', title: '정리', bullets: ['복사: <code>shutil.copy()</code> · <code>copytree()</code>', '폴더: <code>os.mkdir()</code> · <code>os.makedirs()</code> · <code>shutil.rmtree()</code>', '파일 삭제: <code>os.remove()</code> — 영구 삭제 주의', '정보: <code>os.listdir() · os.walk() · os.path.exists() · getsize()</code>', '압축: <code>zipfile.ZipFile</code> + <code>ZIP_DEFLATED</code>, <code>extractall()</code>'],
            notes: '<p><b>[1분]</b> 다음 교시: 오류가 나도 프로그램이 멈추지 않게 하는 예외 처리.</p>' }
        ]
      },
      /* ================================================================
       * 11-6. 예외 처리 (Section 05 뒷부분)
       * ================================================================ */
      {
        id: 'ch11-6',
        title: '예외 처리 — try · except · else · finally',
        minutes: 45,
        goals: [
          '예외 처리의 필요성을 설명하고 try ~ except 문을 사용할 수 있다',
          '오류의 종류(ValueError, ZeroDivisionError, FileNotFoundError …)에 따라 다르게 처리할 수 있다',
          'else · finally 가 실행되는 시점을 설명할 수 있다',
          '파일 입출력 프로그램에 예외 처리를 적용할 수 있다'
        ],
        flow: [['오류 상황 보기', 5], ['try ~ except 기본', 12], ['예외 종류별 처리', 12], ['else · finally', 8], ['실습 · 퀴즈 · 장 정리', 8]],
        content: [
          { type: 'h', text: '예외 처리란?' },
          { type: 'p', html: '프로그램 실행 중에 생기는 오류를 <b>예외(Exception)</b> 라고 합니다. 예외가 생기면 파이썬은 빨간 오류 메시지(traceback)를 출력하고 프로그램을 <b>멈춥니다</b>. 예를 들어 없는 파일을 지우려고 하면 다음과 같습니다.' },
          { type: 'code', title: '없는 파일을 지우면', code: `import os
os.remove('noFile.exe')        # 이 파일이 없음`, expectError: true, nondeterministic: true,
            desc: '<code>FileNotFoundError</code> 가 나며 프로그램이 멈춥니다. (메시지는 운영체제에 따라 <code>[Errno 2] No such file or directory</code> 또는 <code>[WinError 2] 지정된 파일을 찾을 수 없습니다</code>)' },
          { type: 'p', html: '<b>예외 처리(Exception Handling)</b> 는 오류가 날 때 파이썬이 멈추게 두지 않고, <b>프로그래머가 준비한 코드</b>를 실행하게 하는 방법입니다. 오류가 날 수 있는 부분을 <code>try :</code> 블록에 넣고, 오류가 났을 때 할 일을 <code>except :</code> 블록에 씁니다.' },
          { type: 'code', title: 'try ~ except 로 처리하기', code: `import os

try :
    os.remove('noFile.exe')
except :
    print('파일이 없네요. 확인 바랍니다.')

print('프로그램은 계속 실행됩니다.')`, expect: `파일이 없네요. 확인 바랍니다.
프로그램은 계속 실행됩니다.`,
            desc: '<code>4행</code>에서 오류가 나면 곧바로 <code>except</code> 블록으로 넘어갑니다. 오류 메시지 대신 우리가 쓴 메시지가 나오고, 프로그램도 멈추지 않고 <code>8행</code>까지 실행됩니다.' },

          { type: 'h', text: '반복문에서 예외 처리 활용하기' },
          { type: 'p', html: '문자열에서 <code>\'파이썬\'</code> 이 나오는 위치를 모두 찾아 봅시다. 문자열의 <code>index(찾을글자, 시작위치)</code> 는 시작 위치부터 찾아서 위치를 돌려주고, <b>더 이상 없으면 ValueError</b> 를 냅니다(8장).' },
          { type: 'code', title: 'Code11-13. 모든 위치 찾기 — 오류 발생', code: `myStr = '파이썬은 재미 있어요. 파이썬만 매일매일 공부하고 싶어요. ^^'
strPosList = []
index = 0

while True :
    index = myStr.index('파이썬', index)
    strPosList.append(index)
    index = index + 1          # 다음 위치부터 찾음

print('파이썬 글자 위치 -->', strPosList)`, expectError: true, expect: `Traceback (most recent call last):
  File "main.py", line 6, in <module>
    index = myStr.index('파이썬', index)
            ~~~~~~~~~~~^^^^^^^^^^^^^^^^^
ValueError: substring not found`,
            desc: '위치 0 과 13 을 찾은 뒤, 세 번째로 찾을 때는 더 이상 없으므로 오류가 나고 <code>10행</code>은 실행되지 못합니다.' },
          { type: 'p', html: '찾다가 오류가 나면 “이제 다 찾았다”는 뜻이므로, <code>except</code> 에서 <code>break</code> 로 반복을 끝내면 됩니다.' },
          { type: 'code', title: 'Code11-14. 예외 처리 추가', code: `myStr = '파이썬은 재미 있어요. 파이썬만 매일매일 공부하고 싶어요. ^^'
strPosList = []
index = 0

while True :
    try :
        index = myStr.index('파이썬', index)
        strPosList.append(index)
        index = index + 1      # 다음 위치부터 찾음
    except :
        break

print('파이썬 글자 위치 -->', strPosList)`, expect: `파이썬 글자 위치 --> [0, 13]` },
          { type: 'callout', kind: 'more', title: '📘 오류 대신 미리 확인하는 방법', html: '<code>find()</code> 는 못 찾으면 오류 대신 <code>-1</code> 을 돌려주므로 <code>if index == -1 : break</code> 로도 만들 수 있습니다. 이처럼 “미리 확인하기(<code>os.path.exists</code>, <code>find</code>)” 와 “일단 하고 예외 처리하기(<code>try</code>)” 는 상황에 따라 골라 씁니다. 파이썬에서는 뒤의 방식도 자연스러운 스타일로 여깁니다.' },

          { type: 'h', text: '오류의 종류에 따라 다르게 처리하기' },
          { type: 'p', html: '<code>except</code> 뒤에 아무것도 쓰지 않으면 <b>모든 종류</b>의 오류를 처리합니다. 오류 종류를 적으면 종류마다 다른 처리를 할 수 있습니다.' },
          { type: 'code', run: false, title: '형식 — 오류 종류별 처리', code: `try :
    실행할 문장들
except 예외_종류1 :
    오류일 때 실행할 문장들
except 예외_종류2 :
    오류일 때 실행할 문장들` },
          { type: 'table', head: ['종류', '설명'], rows: [
            ['<code>ImportError</code>', 'import 문에서 오류가 발생할 때'],
            ['<code>IndexError</code>', '리스트 등의 첨자(인덱스)가 범위를 벗어날 때'],
            ['<code>KeyError</code>', '딕셔너리에 키가 없을 때'],
            ['<code>KeyboardInterrupt</code>', '프로그램 실행 중 <kbd>Ctrl</kbd>+<kbd>C</kbd> 를 누를 때 (이 강좌: ■ 중지 버튼)'],
            ['<code>NameError</code>', '없는 변수 이름에 접근할 때'],
            ['<code>RecursionError</code>', '재귀 호출 횟수가 시스템 설정(보통 1000번)보다 많을 때'],
            ['<code>RuntimeError</code>', '그 밖의 실행 중 오류'],
            ['<code>SyntaxError</code>', '문법이 틀렸을 때 (<code>exec()</code> · <code>eval()</code> 등)'],
            ['<code>TypeError</code>', '자료형이 맞지 않을 때. 예: <code>\'문자열\' - \'문자열\'</code>'],
            ['<code>ValueError</code>', '함수에 잘못된 값을 넘길 때. 예: <code>int(\'파이썬\')</code>'],
            ['<code>ZeroDivisionError</code>', '0으로 나눌 때'],
            ['<code>IOError</code> (<code>OSError</code>)', '파일 처리 등 입출력 오류. <code>FileNotFoundError</code> 는 그중 “파일 없음”']
          ], caption: '표 11-2 대표적인 예외 종류' },
          { type: 'code', title: 'Code11-15. 오류 종류에 따라 다르게 처리 — 문자 입력', code: `num1 = input('숫자1 -->')
num2 = input('숫자2 -->')

try :
    num1 = int(num1)
    num2 = int(num2)
    while True :
        res = num1 / num2

except ValueError :
    print('문자열은 숫자로 변환할 수 없습니다.')

except ZeroDivisionError :
    print('0으로 나눌 수 없습니다.')

except KeyboardInterrupt :
    print('Ctrl+C를 눌렀군요.')`, stdin: '이건 뭐죠?\n10\n', expect: `숫자1 -->이건 뭐죠?
숫자2 -->10
문자열은 숫자로 변환할 수 없습니다.`,
            desc: '<code>5행</code> <code>int(\'이건 뭐죠?\')</code> 에서 <code>ValueError</code> 가 나서 10~11행이 실행됩니다.' },
          { type: 'code', title: 'Code11-15. — 0 입력', code: `num1 = input('숫자1 -->')
num2 = input('숫자2 -->')

try :
    num1 = int(num1)
    num2 = int(num2)
    while True :
        res = num1 / num2

except ValueError :
    print('문자열은 숫자로 변환할 수 없습니다.')

except ZeroDivisionError :
    print('0으로 나눌 수 없습니다.')

except KeyboardInterrupt :
    print('Ctrl+C를 눌렀군요.')`, stdin: '10\n0\n', expect: `숫자1 -->10
숫자2 -->0
0으로 나눌 수 없습니다.`,
            desc: '<code>8행</code> 10 / 0 에서 <code>ZeroDivisionError</code> 가 납니다. 이번에는 직접 <code>10</code>, <code>5</code> 를 입력해 보세요. <code>7~8행</code>은 끝나지 않는 반복이므로 프로그램이 계속 실행됩니다. 이때 IDLE 에서는 <kbd>Ctrl</kbd>+<kbd>C</kbd>, 이 강좌에서는 <b>■ 중지</b> 버튼을 누르면 <code>KeyboardInterrupt</code> 가 발생해 <code>Ctrl+C를 눌렀군요.</code> 가 출력됩니다.' },
          { type: 'callout', kind: 'more', title: '📘 except … as e : 오류 메시지 받기', html: '<p><code>except 예외_종류 as e :</code> 라고 쓰면 변수 <code>e</code> 에 오류 정보가 들어 있어 원래 메시지를 출력할 수 있습니다. 여러 종류를 한 번에 처리할 때는 괄호로 묶습니다: <code>except (ValueError, ZeroDivisionError) as e :</code></p><p>이유 없이 모든 오류를 <code>except :</code> 로 삼키면 진짜 버그까지 숨겨지므로, 가능하면 <b>예상하는 오류 종류를 적는 것</b>이 좋습니다.</p>' },
          { type: 'code', title: '추가 예제. 파일 열기 오류를 종류별로 처리하기', code: `fName = input("파일명을 입력하세요 : ")

try :
    inFp = open(fName, "r")
    print(inFp.readline(), end = "")
    inFp.close()
except FileNotFoundError as e :
    print("파일이 없습니다 :", e)
except UnicodeDecodeError :
    print("텍스트 파일이 아닌 것 같습니다.")`, stdin: 'abc.txt\n', expect: `파일명을 입력하세요 : abc.txt
파일이 없습니다 : [Errno 2] No such file or directory: 'abc.txt'`,
            desc: '<code>win.ini</code>(첫 행 출력), <code>RAW/tree.raw</code>(이진 파일 → UnicodeDecodeError)도 입력해 보세요. 11-2 교시의 <code>os.path.exists()</code> 방식과 비교해 보세요.' },

          { type: 'h', text: 'try, except, else, finally 문' },
          { type: 'p', html: '<code>try</code> 문에는 <code>else</code> 와 <code>finally</code> 를 더 붙일 수 있습니다.' },
          { type: 'list', items: [
            '<code>try</code> 블록에서 오류가 발생하면 → <code>except</code> 블록이 실행된다',
            '오류가 발생하지 않으면 → <code>else</code> 블록이 실행된다',
            '<code>finally</code> 블록은 오류가 발생하든 그렇지 않든 <b>무조건</b> 실행된다 (파일 닫기 같은 뒷정리에 사용)'
          ] },
          { type: 'figure', html: FIG_TRY, caption: 'try · except · else · finally 의 실행 흐름' },
          { type: 'code', title: 'Code11-16. try, except, else, finally — 정상 입력', code: `num1 = input('숫자1 -->')
num2 = input('숫자2 -->')

try :
    num1 = int(num1)
    num2 = int(num2)

except :
    print('오류가 발생했습니다.')

else :
    print(num1, '/', num2, '=', num1 / num2)

finally :
    print('이 부분은 무조건 나옵니다.')`, stdin: '100\n50\n', expect: `숫자1 -->100
숫자2 -->50
100 / 50 = 2.0
이 부분은 무조건 나옵니다.` },
          { type: 'code', title: 'Code11-16. — 오류가 나는 입력', code: `num1 = input('숫자1 -->')
num2 = input('숫자2 -->')

try :
    num1 = int(num1)
    num2 = int(num2)

except :
    print('오류가 발생했습니다.')

else :
    print(num1, '/', num2, '=', num1 / num2)

finally :
    print('이 부분은 무조건 나옵니다.')`, stdin: '100\n모름\n', expect: `숫자1 -->100
숫자2 -->모름
오류가 발생했습니다.
이 부분은 무조건 나옵니다.`,
            desc: '<code>100</code> 과 <code>0</code> 을 입력하면 어떻게 될까요? <code>try</code> 에서는 오류가 없어서 <code>else</code> 로 가지만, <code>else</code> 안의 <code>num1 / num2</code> 에서 ZeroDivisionError 가 납니다. <code>else</code> 블록의 오류는 위의 <code>except</code> 가 잡아 주지 않는다는 점에 주의하세요 (<code>finally</code> 는 그래도 실행됩니다).' },
          { type: 'callout', kind: 'tip', title: '파일 처리에서의 finally', html: '파일을 연 뒤 처리 중에 오류가 나도 파일은 닫아야 합니다. <code>finally : inFp.close()</code> 로 쓰거나, 더 간단하게 <code>with open(…) as inFp :</code> 를 쓰면 오류가 나도 자동으로 닫힙니다.' },
          { type: 'code', title: '추가 예제. finally 로 파일 닫기', code: `inFp = open("data1.txt", "r")
try :
    lines = inFp.readlines()
    print("3번째 행 :", lines[2], end = "")
    print()
    print("10번째 행 :", lines[9])        # IndexError 발생
except IndexError :
    print("그런 행은 없습니다. 전체", len(lines), "행")
finally :
    inFp.close()
    print("파일을 닫았나요?", inFp.closed)`, expect: `3번째 행 : 파이썬을 공부하기 잘했네요~~
그런 행은 없습니다. 전체 3 행
파일을 닫았나요? True`,
            desc: '<code>6행</code>의 <code>print()</code> 는 출력하기 전에 <code>lines[9]</code> 부터 계산하다가 오류가 나므로, “10번째 행 :” 도 출력되지 않고 곧바로 except 로 넘어갑니다. 오류가 났는데도 finally 에서 파일이 닫힌 것을 확인하세요.' }
        ],
        practice: [
          {
            title: '실습 11-10. 올바른 정수를 입력할 때까지 다시 묻기',
            level: 1,
            desc: '<p>나이를 입력받는데, 정수가 아닌 값을 입력하면 <code>숫자로 입력하세요.</code> 를 출력하고 다시 입력받습니다. 올바르게 입력하면 <code>내년에는 ○살입니다.</code> 를 출력하세요.</p><pre>나이 : 열다섯\n숫자로 입력하세요.\n나이 : 15.5\n숫자로 입력하세요.\n나이 : 15\n내년에는 16살입니다.</pre>',
            hint: '<code>while True :</code> 안에서 <code>try : age = int(input(…))</code> → 성공하면 <code>break</code>, <code>except ValueError :</code> 에서 안내 메시지.',
            starter: `while True :
    # TODO: try ~ except ValueError
    age = int(input("나이 : "))
    break

print("내년에는 %d살입니다." % (age + 1))
`,
            solution: `while True :
    try :
        age = int(input("나이 : "))
        break
    except ValueError :
        print("숫자로 입력하세요.")

print("내년에는 %d살입니다." % (age + 1))
`,
            stdin: '열다섯\n15.5\n15\n',
            expect: `나이 : 열다섯
숫자로 입력하세요.
나이 : 15.5
숫자로 입력하세요.
나이 : 15
내년에는 16살입니다.`
          },
          {
            title: '실습 11-11. 여러 파일의 행 수 세기',
            level: 2,
            desc: '<p>파일 이름 목록 <code>[\'data1.txt\', \'abc.txt\', \'win.ini\', \'RAW/tree.raw\']</code> 의 각 파일을 열어 행 수를 출력하세요. 파일이 없으면 <code>없는 파일</code>, 텍스트로 읽을 수 없으면 <code>텍스트 파일 아님</code> 을 출력하고 다음 파일로 넘어갑니다. 마지막에 성공한 파일 수를 출력합니다.</p><pre>data1.txt : 3행\nabc.txt : 없는 파일\nwin.ini : 7행\nRAW/tree.raw : 텍스트 파일 아님\n성공 : 2개</pre>',
            hint: '<code>for</code> 문 안에 <code>try ~ except FileNotFoundError ~ except UnicodeDecodeError ~ else</code> 를 넣습니다. 성공 개수는 <code>else</code> 에서 셉니다.',
            starter: `names = ['data1.txt', 'abc.txt', 'win.ini', 'RAW/tree.raw']
ok = 0

for name in names :
    # TODO: 예외 처리
    with open(name, "r", encoding = "utf-8") as f :
        count = len(f.readlines())
    print("%s : %d행" % (name, count))

print("성공 : %d개" % ok)
`,
            solution: `names = ['data1.txt', 'abc.txt', 'win.ini', 'RAW/tree.raw']
ok = 0

for name in names :
    try :
        with open(name, "r", encoding = "utf-8") as f :
            count = len(f.readlines())
    except FileNotFoundError :
        print("%s : 없는 파일" % name)
    except UnicodeDecodeError :
        print("%s : 텍스트 파일 아님" % name)
    else :
        print("%s : %d행" % (name, count))
        ok += 1

print("성공 : %d개" % ok)
`,
            expect: `data1.txt : 3행
abc.txt : 없는 파일
win.ini : 7행
RAW/tree.raw : 텍스트 파일 아님
성공 : 2개`
          }
        ],
        quiz: [
          { q: '다음 코드의 실행 결과는?<pre><code>try :\n    print(int("12a"))\nexcept ValueError :\n    print("A")\nexcept ZeroDivisionError :\n    print("B")</code></pre>', options: ['12', 'A', 'B', '오류로 멈춘다'], answer: 1, explain: '<code>int("12a")</code> 는 ValueError 이므로 A 가 출력됩니다.' },
          { q: '<code>finally</code> 블록이 실행되는 경우는?', options: ['오류가 났을 때만', '오류가 없을 때만', '오류가 나든 안 나든 항상', 'else 가 실행되지 않을 때만'], answer: 2, explain: 'finally 는 무조건 실행됩니다. 파일 닫기 같은 뒷정리에 씁니다.' },
          { q: '다음 코드의 출력 순서로 알맞은 것은?<pre><code>try :\n    x = 10 / 2\nexcept :\n    print("E")\nelse :\n    print("L")\nfinally :\n    print("F")</code></pre>', options: ['E F', 'L F', 'L', 'E L F'], answer: 1, explain: '오류가 없으므로 else(L) 다음 finally(F) 가 실행됩니다.' },
          { q: '<code>["a", "b"][5]</code> 를 실행할 때 나는 예외는?', options: ['KeyError', 'IndexError', 'ValueError', 'TypeError'], answer: 1, explain: '리스트의 인덱스 범위를 벗어나면 IndexError 입니다.' },
          { q: 'Code11-14 에서 <code>except : break</code> 가 하는 일은?', options: ['오류가 나면 프로그램을 끝낸다', '더 찾을 것이 없어서 난 오류에서 반복을 끝낸다', '오류 메시지를 출력한다', '다음 위치부터 다시 찾는다'], answer: 1, explain: 'index() 가 더 못 찾아 ValueError 를 내면, 다 찾은 것이므로 반복문을 빠져나와 결과를 출력합니다.' }
        ],
        slides: [
          { layout: 'title', title: '예외 처리', subtitle: 'try · except · else · finally', badge: '11-6',
            notes: '<p><b>[도입 2분]</b> 발문: “사용자가 숫자 대신 글자를 입력하면 우리 프로그램은 어떻게 되었나요?” → 빨간 오류와 함께 멈춤. 오늘은 멈추지 않게 만드는 방법.</p>' },
          { layout: 'two', title: '예외 처리 전과 후', left: { title: '처리 전 — 멈춤', run: false, code: `import os
os.remove('noFile.exe')
print('여기는 실행될까?')` }, right: { title: '처리 후 — 계속 실행', code: `import os
try :
    os.remove('noFile.exe')
except :
    print('파일이 없네요. 확인 바랍니다.')
print('여기는 실행될까?')` },
            notes: '<p><b>[3분]</b> 왼쪽은 실행하면 오류로 멈춥니다(의도된 오류). 오른쪽은 준비한 메시지 후 계속 실행됩니다. (왼쪽 코드는 검증 시 오류가 나므로 학생에게 직접 실행해 보여 주세요)</p>'  },
          { layout: 'code', title: 'Code11-13 → 11-14. 모든 위치 찾기', code: `myStr = '파이썬은 재미 있어요. 파이썬만 매일매일 공부하고 싶어요. ^^'
strPosList = []
index = 0

while True :
    try :
        index = myStr.index('파이썬', index)
        strPosList.append(index)
        index = index + 1
    except :
        break

print('파이썬 글자 위치 -->', strPosList)`, points: ['try 없이 실행하면 ValueError: substring not found', '더 못 찾음 = 다 찾음 → <code>break</code>', '결과: <code>[0, 13]</code>'],
            notes: '<p><b>[5분]</b> 먼저 try/except 를 지운 Code11-13 을 실행해 오류를 보여 준 뒤 예외 처리를 추가합니다.</p>' },
          { layout: 'table', title: '표 11-2 대표적인 예외 종류', head: ['예외', '언제?'], rows: [['IndexError', '인덱스 범위를 벗어남'], ['KeyError', '딕셔너리에 키 없음'], ['NameError', '없는 변수'], ['TypeError', '자료형 오류 ("a" - "b")'], ['ValueError', '잘못된 값 (int("파이썬"))'], ['ZeroDivisionError', '0으로 나눔'], ['FileNotFoundError', '파일 없음 (OSError · IOError 의 일종)'], ['KeyboardInterrupt', 'Ctrl+C (이 강좌: ■ 중지)']],
            notes: '<p><b>[3분]</b> 각 오류를 셸에서 일부러 한 번씩 내 보게 하면 기억에 남습니다: <code>[1][5]</code>, <code>{}["a"]</code>, <code>abc</code>, <code>"a"-"b"</code>, <code>int("파이썬")</code>, <code>1/0</code>.</p>' },
          { layout: 'code', title: 'Code11-15. 종류별로 다르게 처리', code: `num1 = input('숫자1 -->')
num2 = input('숫자2 -->')

try :
    num1 = int(num1)
    num2 = int(num2)
    while True :
        res = num1 / num2
except ValueError :
    print('문자열은 숫자로 변환할 수 없습니다.')
except ZeroDivisionError :
    print('0으로 나눌 수 없습니다.')
except KeyboardInterrupt :
    print('Ctrl+C를 눌렀군요.')`, stdin: '10\n0\n', points: ['문자 입력 → ValueError', '0 입력 → ZeroDivisionError', '10, 5 → 무한 반복 → ■ 중지 → KeyboardInterrupt'],
            notes: '<p><b>[5분]</b> 세 번 실행합니다: “이건 뭐죠?”/10, 10/0, 10/5. 세 번째는 무한 반복이므로 ■ 중지(IDLE 에서는 Ctrl+C)를 누르게 합니다.</p>' },
          { layout: 'diagram', title: 'try · except · else · finally', html: FIG_TRY, caption: 'except 와 else 는 둘 중 하나, finally 는 항상',
            notes: '<p><b>[2분]</b></p>' },
          { layout: 'code', title: 'Code11-16. else 와 finally', code: `num1 = input('숫자1 -->')
num2 = input('숫자2 -->')

try :
    num1 = int(num1)
    num2 = int(num2)
except :
    print('오류가 발생했습니다.')
else :
    print(num1, '/', num2, '=', num1 / num2)
finally :
    print('이 부분은 무조건 나옵니다.')`, stdin: '100\n50\n', points: ['100, 50 → else + finally', '100, 모름 → except + finally', '발문: 100, 0 이면?'],
            notes: '<p><b>[4분]</b> 100, 0 을 넣으면 else 안에서 ZeroDivisionError 가 나서 멈추지만 finally 는 먼저 실행된다는 점을 확인합니다.</p>' },
          { layout: 'code', title: '파일 입출력 + 예외 처리', code: `fName = input("파일명을 입력하세요 : ")

try :
    with open(fName, "r") as inFp :
        for inStr in inFp :
            print(inStr, end = "")
except FileNotFoundError as e :
    print("파일이 없습니다 :", e)
except UnicodeDecodeError :
    print("텍스트 파일이 아닌 것 같습니다.")`, stdin: 'abc.txt\n', points: ['<code>as e</code> : 원래 오류 메시지', '이진 파일을 텍스트로 읽으면 UnicodeDecodeError', 'with 문은 오류가 나도 파일을 닫아 줌'],
            notes: '<p><b>[3분]</b> win.ini, abc.txt, RAW/tree.raw 를 차례로 입력해 봅니다. 11-2 교시의 os.path.exists 방식과 비교.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '오류가 없을 때 <code>try → ? → ?</code> 의 실행 순서는?', options: ['except → finally', 'else → finally', 'finally → else', 'else 만'], answer: 1, explain: '오류가 없으면 else, 그리고 항상 finally.',
            notes: '<p><b>[1분]</b></p>' },
          { layout: 'practice', title: '실습 11-10. 올바른 정수를 입력할 때까지', desc: '정수가 아니면 “숫자로 입력하세요.” 를 출력하고 다시 입력받기', stdin: '열다섯\n15.5\n15\n', starter: `while True :
    # TODO: try ~ except ValueError
    age = int(input("나이 : "))
    break
print("내년에는 %d살입니다." % (age + 1))
`, solution: `while True :
    try :
        age = int(input("나이 : "))
        break
    except ValueError :
        print("숫자로 입력하세요.")
print("내년에는 %d살입니다." % (age + 1))
`,
            notes: '<p><b>[4분]</b> 입력 검사에 가장 많이 쓰는 패턴입니다. 빠른 학생은 실습 11-11.</p>' },
          { layout: 'summary', title: '11장 정리', bullets: ['파일 처리: <code>open()</code> → <code>read · readline · readlines / write · writelines</code> → <code>close()</code> (또는 <code>with</code>)', '모드: <code>r · w · a</code> + 이진 <code>b</code> (<code>rb · wb</code>)', '[프로그램 1] <code>ord · chr</code> 암호화, [프로그램 2] RAW → 2차원 리스트 → <code>paper.put()</code>', '<code>os · os.path · shutil · zipfile</code> 로 파일 · 폴더 · 압축', '<code>try · except · else · finally</code> 로 오류에도 멈추지 않는 프로그램'],
            notes: '<p><b>[2분]</b> 장 전체를 정리합니다. 다음 장(12장 객체지향 프로그래밍) 예고: 지금까지 쓴 <code>inFp.readline()</code> 처럼 “변수.함수()” 형태가 바로 객체의 메서드입니다.</p>' }
        ]
      }
    ]
  });
})();
