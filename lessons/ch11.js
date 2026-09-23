/* Chapter 11. 파일 입출력 (파이썬 for Beginner 3판 Ch11) */
(function () {
  /* ================================================================
     SVG 그리기 도우미
     ================================================================ */
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const MK = '<defs><marker viewBox="0 0 16 16" id="c11ah" markerWidth="11" markerHeight="11" refX="14" refY="8" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L16,8 L0,16 z" fill="var(--muted)"/></marker>' +
    '<marker viewBox="0 0 16 16" id="c11ok" markerWidth="11" markerHeight="11" refX="14" refY="8" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L16,8 L0,16 z" fill="var(--ok)"/></marker>' +
    '<marker viewBox="0 0 16 16" id="c11ac" markerWidth="11" markerHeight="11" refX="14" refY="8" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L16,8 L0,16 z" fill="var(--accent)"/></marker></defs>';
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
    subtitle: 'open · read · write · with · 인코딩 · 이진 파일 · 예외 처리 · csv · json',
    summary: '프로그램이 끝나도 사라지지 않도록 데이터를 파일에 저장하고, 파일에서 다시 읽어 오는 방법을 배웁니다. with 문과 파일 모드 · 인코딩(한글 깨짐)부터 시작해 텍스트 파일과 이진 파일을 다루고, 파일 암호화 프로그램과 RAW 흑백 사진 보기 프로그램을 만듭니다. 이어서 os · shutil · zipfile · pathlib 로 파일과 폴더를 일괄 처리하고, try~except~raise~logging 으로 오류를 다루며, csv · json 형식으로 데이터를 오래 보관하는 방법까지 익힙니다.',
    goals: [
      '파일 처리의 3단계(열기 → 읽기/쓰기 → 닫기)와 열기 모드(r · w · a · b)를 설명할 수 있다',
      'readline() · readlines() · for 문으로 텍스트 파일을 읽고, write() · writelines() 로 파일에 쓸 수 있다',
      'os.path.exists() 로 파일이 있는지 확인하고, 도스의 type · copy 명령을 파이썬으로 구현할 수 있다',
      'ord() · chr() 로 글자를 바꿔 파일을 암호화 · 해독하는 프로그램을 만들 수 있다',
      'rb · wb 모드로 이진 파일을 복사하고, RAW 흑백 사진을 읽어 tkinter 창에 출력할 수 있다',
      'os · os.path · shutil · zipfile · pathlib 로 파일과 폴더를 다루고, 여러 파일을 일괄 처리할 수 있다',
      'try~except~else~finally 로 오류를 처리하고, 구체적인 예외 잡기 · raise · logging 을 사용할 수 있다',
      'csv · json 모듈로 표 데이터와 설정 데이터를 읽고 쓰며, 저장 형식을 골라 쓸 수 있다'
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
          'with ~ as 문(컨텍스트 매니저)이 하는 일과 close() 를 잊었을 때의 문제를 설명할 수 있다',
          'r · w · a · x · b · + 모드를 구분해 쓰고, 큰 파일을 한 줄씩(스트리밍) 처리할 수 있다'
        ],
        flow: [['도입 · 이 장에서 만들 프로그램', 5], ['파일 입출력 개념 · 3단계 · 모드', 12], ['readline · readlines 예제', 16], ['with 문 · 모드 총정리 · 스트리밍', 10], ['SELF STUDY · 퀴즈', 7]],
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
          { type: 'callout', kind: 'more', title: '📘 인코딩(encoding) 과 한글', html: '파일에 저장되는 것은 글자가 아니라 <b>바이트</b>입니다. 글자를 바이트로 바꾸는 규칙을 <b>인코딩</b>이라 하고, 요즘은 대부분 <b>UTF-8</b> 을 씁니다. 윈도의 IDLE 에서 한글 파일을 읽을 때 <code>UnicodeDecodeError</code> 가 나면 <code>open("data1.txt", "r", encoding = "utf-8")</code> 처럼 인코딩을 적어 주세요. (이 강좌의 파이썬은 기본이 UTF-8 입니다. 인코딩은 11-3 교시에서 자세히 다룹니다)' },

          { type: 'h', text: '한 걸음 더 — close() 를 잊으면 무슨 일이 생길까?' },
          { type: 'p', html: '<code>write()</code> 는 글자를 <b>곧바로 디스크에 적지 않습니다</b>. 디스크에 한 글자씩 적는 것은 아주 느리기 때문에, 파이썬은 쓸 내용을 메모리의 <b>버퍼(buffer)</b> 라는 임시 공간에 모아 두었다가 한꺼번에 내려 씁니다. 이 “한꺼번에 내려쓰기”가 일어나는 때가 바로 <code>close()</code> 입니다. 그래서 <code>close()</code> 를 잊으면 <b>쓴 내용이 파일에 없을 수 있습니다</b>.' },
          { type: 'code', title: '추가 예제. close() 전과 후 — 버퍼 확인하기', code: `outFp = open("memo.txt", "w")
outFp.write("첫 줄을 썼습니다.\\n")

print("close 전에 읽기 :", repr(open("memo.txt", "r").read()))
outFp.close()
print("close 후에 읽기 :", repr(open("memo.txt", "r").read()))`, expect: `close 전에 읽기 : ''
close 후에 읽기 : '첫 줄을 썼습니다.\\n'`,
            desc: '<code>4행</code> 아직 버퍼에만 있어서 파일은 비어 있습니다(빈 문자열). <code>5행</code>의 <code>close()</code> 뒤에야 내용이 디스크에 저장됩니다. <code>repr()</code> 은 문자열을 따옴표와 <code>\\n</code> 까지 그대로 보여 주는 함수라서 이런 확인에 편리합니다. (<code>outFp.flush()</code> 로 중간에 강제로 내려쓸 수도 있습니다)' },
          { type: 'callout', kind: 'more', title: '📘 with 문의 정체 — 컨텍스트 매니저(context manager)', html: '<p><code>with A as b :</code> 는 “시작할 때 할 일”과 “끝날 때 할 일”이 짝으로 정해진 객체를 다루는 문법입니다. 이런 객체를 <b>컨텍스트 매니저</b>라고 합니다. 파일 객체는 블록에 들어갈 때 자기 자신을 돌려주고(<code>__enter__</code>), 블록을 빠져나갈 때 <code>close()</code> 를 실행합니다(<code>__exit__</code>).</p><p>중요한 것은 <b>블록 안에서 오류가 나도 <code>__exit__</code> 는 실행된다</b>는 점입니다. <code>close()</code> 를 직접 쓰면 중간에서 오류가 났을 때 그 줄까지 가지 못해 파일이 열린 채로 남습니다. 그래서 실무에서는 파일을 열 때 거의 항상 <code>with</code> 를 씁니다. 네트워크 연결, 잠금(lock), 데이터베이스 트랜잭션도 같은 방식으로 씁니다.</p>' },
          { type: 'code', title: '추가 예제. 오류가 나도 with 는 파일을 닫는다', code: `try :
    with open("data1.txt", "r") as inFp :
        print(inFp.readline(), end = "")
        num = 10 / 0                 # 일부러 오류를 냄
except ZeroDivisionError :
    print("오류가 발생했습니다!")

print("그래도 파일이 닫혔나요?", inFp.closed)`, expect: `CookBook 파이썬을 공부합니다.
오류가 발생했습니다!
그래도 파일이 닫혔나요? True`,
            desc: '<code>4행</code>에서 오류가 났는데도 <code>8행</code>의 <code>closed</code> 가 <code>True</code> 입니다. <code>with</code> 없이 <code>close()</code> 만 썼다면 <code>close()</code> 줄까지 가지 못해 파일이 열린 채 남았을 것입니다.' },

          { type: 'h', text: '파일 모드 총정리 — r · w · a · x · b · +' },
          { type: 'p', html: '<code>open()</code> 의 모드는 <b>“무엇을 할 것인가”(r · w · a · x)</b> 와 <b>“어떤 자료로 다룰 것인가”(t · b)</b>, 그리고 <b>“읽기 쓰기를 함께 할 것인가”(+)</b> 를 조합해서 씁니다. 예를 들어 <code>"rb"</code> 는 “이진 파일을 읽기”, <code>"w+"</code> 는 “새로 쓰면서 읽기도”입니다.' },
          { type: 'table', head: ['모드', '파일이 없으면', '파일이 있으면', '처음 위치', '주로 쓰는 곳'], rows: [
            ['<code>r</code>', '<b>오류</b>(FileNotFoundError)', '그대로 둠', '맨 앞', '읽기 — 가장 많이 씀'],
            ['<code>w</code>', '새로 만듦', '<b>내용을 모두 지움</b>', '맨 앞', '결과 파일 새로 쓰기'],
            ['<code>a</code>', '새로 만듦', '그대로 둠', '<b>맨 끝</b>', '기록(로그) 덧붙이기'],
            ['<code>x</code>', '새로 만듦', '<b>오류</b>(FileExistsError)', '맨 앞', '기존 파일을 덮어쓰면 안 될 때'],
            ['<code>t</code> (기본)', '—', '—', '—', '글자(str)로 다루기 · 줄바꿈 자동 변환'],
            ['<code>b</code>', '—', '—', '—', '바이트(bytes)로 다루기 — 그림 · 소리'],
            ['<code>+</code>', '—', '—', '—', '읽기와 쓰기를 함께 (<code>r+</code> · <code>w+</code> · <code>a+</code>)']
          ], caption: '표 11-1(확장) open() 의 모드 — 앞의 한 글자(r/w/a/x)에 b · + 를 덧붙여 조합합니다' },
          { type: 'code', title: '추가 예제. "x" 모드와 "a" 모드 — 덮어쓰기 사고 막기', code: `with open("new.txt", "x") as outFp :          # x : 새로 만들 때만 성공
    outFp.write("처음 만드는 파일\\n")
print("new.txt 를 만들었습니다.")

try :
    open("new.txt", "x")                      # 이미 있으므로 실패
except FileExistsError :
    print("이미 있는 파일은 'x' 모드로 만들 수 없습니다.")

with open("new.txt", "a") as outFp :          # a : 끝에 덧붙이기
    outFp.write("덧붙인 줄\\n")

with open("new.txt", "r") as inFp :
    print(inFp.read(), end = "")`, expect: `new.txt 를 만들었습니다.
이미 있는 파일은 'x' 모드로 만들 수 없습니다.
처음 만드는 파일
덧붙인 줄`,
            desc: '<code>"w"</code> 는 소중한 파일을 말없이 지워 버릴 수 있습니다. “새로 만드는 것이 확실할 때”는 <code>"x"</code> 를 쓰면 실수로 덮어쓰는 사고를 파이썬이 막아 줍니다.' },

          { type: 'h', text: '큰 파일은 한 줄씩 — 메모리와 스트리밍' },
          { type: 'p', html: '<code>read()</code> 와 <code>readlines()</code> 는 파일 <b>전체</b>를 메모리에 올립니다. 1GB 짜리 기록 파일을 <code>readlines()</code> 로 읽으면 메모리도 1GB 넘게 필요합니다. 반면 <code>for line in 파일객체 :</code> 는 <b>필요한 줄만</b> 차례로 꺼내 씁니다. 이렇게 흐르듯이 조금씩 처리하는 방식을 <b>스트리밍(streaming)</b> 이라고 합니다.' },
          { type: 'code', title: '추가 예제. 10만 줄짜리 파일을 한 줄씩 처리하기', code: `with open("big.txt", "w") as outFp :
    for i in range(1, 100001) :
        outFp.write("%d번째 줄\\n" % i)

count = 0
with open("big.txt", "r") as inFp :        # 한 줄씩 (메모리 조금)
    for line in inFp :
        count += 1
print("한 줄씩 세어 본 줄 수 :", count)

with open("big.txt", "r") as inFp :        # 전체를 리스트로 (메모리 많이)
    lines = inFp.readlines()
print("readlines() 가 만든 리스트의 길이 :", len(lines))
print("마지막 줄 :", lines[-1], end = "")`, expect: `한 줄씩 세어 본 줄 수 : 100000
readlines() 가 만든 리스트의 길이 : 100000
마지막 줄 : 100000번째 줄`,
            desc: '두 방법 모두 결과는 같지만, 위쪽은 한 번에 한 줄만 메모리에 두고 아래쪽은 10만 개의 문자열을 모두 메모리에 둡니다. 파일 크기를 모를 때는 <b>한 줄씩</b>이 안전한 선택입니다.' },
          { type: 'callout', kind: 'more', title: '📘 “줄”은 누가 나눌까 — \\n 과 CRLF', html: '<p>줄바꿈을 나타내는 방법은 운영체제마다 다릅니다. 리눅스 · macOS 는 <code>\\n</code>(LF) 한 글자, 윈도는 <code>\\r\\n</code>(CRLF) 두 글자입니다. 파이썬은 <b>텍스트 모드</b>에서 이 차이를 자동으로 맞춰 줍니다. 읽을 때는 무엇이든 <code>\\n</code> 으로 바꿔 주고, 윈도에서 쓸 때는 <code>\\n</code> 을 <code>\\r\\n</code> 으로 바꿔 저장합니다.</p><p>그래서 같은 코드로 만든 파일이라도 <b>크기(바이트 수)는 운영체제마다 다를 수 있습니다</b>. 있는 그대로 다루고 싶으면 <code>open(파일, "w", newline="")</code> 처럼 <code>newline</code> 을 지정합니다. (11-7 교시의 csv 파일에서 다시 나옵니다)</p>' }
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
            title: '실습 11-1. 메모 파일 만들고 번호를 붙여 다시 읽기',
            level: 1,
            desc: '<p><code>with</code> 문으로 <code>mymemo.txt</code> 파일을 만들어 아래 세 가지 할 일을 한 줄씩 저장하고, 다시 열어서 번호를 붙여 출력하세요.</p><pre>파이썬 공부하기 / 책 읽기 / 운동하기</pre><pre>1. 파이썬 공부하기\n2. 책 읽기\n3. 운동하기</pre>',
            hint: '쓸 때는 <code>with open("mymemo.txt", "w") as outFp :</code>, 읽을 때는 <code>"r"</code>. 번호는 <code>enumerate(inFp, 1)</code> 을 쓰면 1부터 세어 줍니다. 줄 끝의 줄바꿈은 <code>strip()</code> 으로 지웁니다.',
            starter: `lines = ["파이썬 공부하기\\n", "책 읽기\\n", "운동하기\\n"]

with open("mymemo.txt", "w") as outFp :
    pass    # TODO: lines 의 각 줄을 파일에 쓰기

# TODO: mymemo.txt 를 열어 번호를 붙여 출력
`,
            solution: `lines = ["파이썬 공부하기\\n", "책 읽기\\n", "운동하기\\n"]

with open("mymemo.txt", "w") as outFp :
    for line in lines :
        outFp.write(line)

with open("mymemo.txt", "r") as inFp :
    for i, line in enumerate(inFp, 1) :
        print("%d. %s" % (i, line.strip()))
`,
            expect: `1. 파이썬 공부하기
2. 책 읽기
3. 운동하기`
          },
          {
            title: '실습 11-2. 행 수 · 글자 수 세기',
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
          },
          {
            title: '실습 11-3. 낱말 세기 · 찾는 낱말이 든 행 번호',
            level: 2,
            desc: '<p><code>data1.txt</code> 를 한 줄씩 읽으면서 ① <code>파이썬</code> 이라는 낱말이 들어 있는 행의 번호와 내용을 출력하고 ② 파일 전체의 낱말 수(공백으로 나눈 조각의 수)를 출력하세요.</p><pre>1행 : CookBook 파이썬을 공부합니다.\n3행 : 파이썬을 공부하기 잘했네요~~\n전체 낱말 수 : 9</pre>',
            hint: '<code>line.split()</code> 은 공백을 기준으로 낱말 리스트를 만듭니다. 어떤 글자가 행에 들어 있는지는 <code>if keyword in line :</code> 으로 확인합니다.',
            starter: `keyword = "파이썬"
total = 0

with open("data1.txt", "r") as inFp :
    for i, line in enumerate(inFp, 1) :
        pass    # TODO: 낱말 수 더하기, keyword 가 있으면 행 번호와 내용 출력

print("전체 낱말 수 :", total)
`,
            solution: `keyword = "파이썬"
total = 0

with open("data1.txt", "r") as inFp :
    for i, line in enumerate(inFp, 1) :
        total += len(line.split())
        if keyword in line :
            print("%d행 : %s" % (i, line.strip()))

print("전체 낱말 수 :", total)
`,
            expect: `1행 : CookBook 파이썬을 공부합니다.
3행 : 파이썬을 공부하기 잘했네요~~
전체 낱말 수 : 9`
          },
          {
            title: '실습 11-4. 큰 파일을 한 줄씩 처리하기',
            level: 3,
            desc: '<p>먼저 <code>bigdata.txt</code> 에 <code>번호,점수</code> 형식으로 <b>5만 줄</b>을 만듭니다(점수는 <code>(번호 * 7) % 101</code>). 그다음 파일을 <b>한 줄씩</b> 읽으면서 다음을 구해 출력하세요. <code>readlines()</code> 나 <code>read()</code> 는 쓰지 않습니다.</p><ul><li>전체 줄 수</li><li>평균 점수 (소수점 둘째 자리까지)</li><li>가장 높은 점수와 그 번호 (같은 점수가 여럿이면 <b>처음</b> 나온 것)</li></ul><pre>줄 수 : 50000\n평균 점수 : 50.00\n최고 점수 : 100점 (72번)</pre>',
            hint: '<code>for line in inFp :</code> 로 한 줄씩 읽고, <code>line.strip().split(",")</code> 로 번호와 점수를 나눕니다. 최고 점수는 <code>if score &gt; best :</code> 일 때만 바꿔야 “처음 나온 것”이 남습니다.',
            starter: `with open("bigdata.txt", "w") as outFp :
    for i in range(1, 50001) :
        outFp.write("%d,%d\\n" % (i, (i * 7) % 101))

count, total, best, bestNo = 0, 0, -1, 0
with open("bigdata.txt", "r") as inFp :
    for line in inFp :
        pass    # TODO: 줄 수 · 합계 · 최고 점수 구하기

print("줄 수 :", count)
# TODO: 평균과 최고 점수 출력
`,
            solution: `with open("bigdata.txt", "w") as outFp :
    for i in range(1, 50001) :
        outFp.write("%d,%d\\n" % (i, (i * 7) % 101))

count, total, best, bestNo = 0, 0, -1, 0
with open("bigdata.txt", "r") as inFp :
    for line in inFp :
        no, score = line.strip().split(",")
        score = int(score)
        count += 1
        total += score
        if score > best :
            best, bestNo = score, int(no)

print("줄 수 :", count)
print("평균 점수 : %.2f" % (total / count))
print("최고 점수 : %d점 (%d번)" % (best, bestNo))
`,
            expect: `줄 수 : 50000
평균 점수 : 50.00
최고 점수 : 100점 (72번)`
          }
        ],
        quiz: [
          { q: '파일 처리의 3단계를 순서대로 바르게 나열한 것은?', options: ['읽기/쓰기 → 열기 → 닫기', '열기 → 읽기/쓰기 → 닫기', '열기 → 닫기 → 읽기/쓰기', '닫기 → 열기 → 읽기/쓰기'], answer: 1, explain: '<code>open()</code> 으로 열고, 읽거나 쓴 뒤, <code>close()</code> 로 닫습니다.' },
          { q: '이미 내용이 있는 <code>memo.txt</code> 를 <code>open("memo.txt", "w")</code> 로 열면?', options: ['오류가 난다', '기존 내용 뒤에 이어서 쓸 준비가 된다', '기존 내용이 모두 지워진다', '읽기 전용으로 열린다'], answer: 2, explain: '<code>"w"</code> 는 덮어쓰기 모드입니다. 이어서 쓰려면 <code>"a"</code> 를 씁니다.' },
          { q: '<code>readline()</code> 이 파일 끝에 도달했을 때 돌려주는 값은?', options: ['<code>None</code>', '<code>"\\n"</code>', '<code>""</code> (빈 문자열)', '<code>-1</code>'], answer: 2, explain: '빈 줄은 <code>"\\n"</code>, 파일 끝은 <code>""</code> 입니다. 그래서 <code>if inStr == "" : break</code> 로 반복을 끝냅니다.' },
          { q: '다음 중 <code>close()</code> 를 쓰지 않아도 파일이 자동으로 닫히는 방법은?', options: ['<code>open(…).close</code>', '<code>with open(…) as f :</code>', '<code>for f in open :</code>', '<code>del open</code>'], answer: 1, explain: '<code>with ~ as</code> 블록이 끝나면 파일이 자동으로 닫힙니다.' },
          { q: '다음 코드를 실행하면 마지막 줄에 무엇이 출력될까?<pre><code>f = open("a.txt", "w")\nf.write("안녕")\nprint(open("a.txt").read())</code></pre>', options: ['안녕', '아무것도 출력되지 않는다 (빈 줄)', 'FileNotFoundError', '\'안녕\''], answer: 1, explain: '<code>write()</code> 한 내용은 버퍼에 있다가 <code>close()</code>(또는 <code>with</code> 블록의 끝) 때 디스크에 저장됩니다. 아직 닫지 않았으므로 파일은 비어 있습니다.' },
          { q: '이미 있으면 <b>덮어쓰지 않고 오류를 내는</b> 모드는?', options: ['<code>"w"</code>', '<code>"a"</code>', '<code>"x"</code>', '<code>"r+"</code>'], answer: 2, explain: '<code>"x"</code>(exclusive creation)는 파일이 있으면 <code>FileExistsError</code> 를 내서 실수로 덮어쓰는 것을 막아 줍니다.' }
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
          { layout: 'table', title: '표 11-1 파일의 열기 모드', head: ['모드', '없으면', '있으면', '의미'], rows: [
            ['r (생략)', '오류', '그대로', '읽기 — 기본값'],
            ['w', '새로 만듦', '<b>모두 지움</b>', '새로 쓰기'],
            ['a', '새로 만듦', '그대로', '끝에 이어 쓰기(기록)'],
            ['x', '새로 만듦', '<b>오류</b>', '덮어쓰기 사고 방지'],
            ['b / t / +', '—', '—', '이진 / 텍스트(기본) / 읽기·쓰기 겸용']],
            notes: '<p><b>[3분]</b> 가장 많이 하는 실수: 읽으려던 파일을 "w" 로 열어 내용이 날아가는 것. “w 는 지우개부터 들고 온다”고 기억시키세요. x 모드는 “이미 있으면 손대지 마”라는 뜻이라고 설명하면 이해가 빠릅니다.</p>' },
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
          { layout: 'two', title: '📘 close() 를 잊으면? · with 가 하는 일', left: { title: '버퍼에 머물러 있다', code: `outFp = open("memo.txt", "w")
outFp.write("첫 줄\\n")
print(repr(open("memo.txt").read()))
outFp.close()
print(repr(open("memo.txt").read()))` }, right: { title: '오류가 나도 닫아 준다', code: `try :
    with open("data1.txt") as inFp :
        print(inFp.readline(), end = "")
        num = 10 / 0
except ZeroDivisionError :
    print("오류!")
print("닫혔나요?", inFp.closed)` },
            notes: '<p><b>[4분]</b> 왼쪽: write 는 바로 디스크에 쓰지 않고 버퍼에 모았다가 close 때 내려씁니다 → 첫 출력이 빈 문자열. 오른쪽: with 는 <code>__exit__</code> 가 있어 오류가 나도 닫습니다. 발문: “close() 를 직접 쓰는 코드였다면 파일은 어떻게 되었을까?”</p><p>실무에서 파일은 거의 항상 with 로 연다는 점을 강조하세요.</p>' },
          { layout: 'code', title: '큰 파일은 한 줄씩 (스트리밍)', code: `with open("big.txt", "w") as outFp :
    for i in range(1, 100001) :
        outFp.write("%d번째 줄\\n" % i)

count = 0
with open("big.txt", "r") as inFp :
    for line in inFp :          # 한 줄만 메모리에
        count += 1
print("줄 수 :", count)

with open("big.txt", "r") as inFp :
    lines = inFp.readlines()    # 10만 줄 전부 메모리에
print("리스트 길이 :", len(lines))`, points: ['결과는 같지만 쓰는 메모리가 다름', '<code>for line in 파일</code> = 스트리밍', '파일 크기를 모르면 한 줄씩이 안전'],
            notes: '<p><b>[3분]</b> 발문: “1GB 로그 파일을 readlines() 로 읽으면?” → 메모리도 1GB 이상 필요. 서버 로그 · 센서 기록처럼 큰 파일은 한 줄씩 처리한다고 알려 줍니다.</p>' },
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
          '읽기 파일과 쓰기 파일을 함께 열어 도스 copy 명령을 구현할 수 있다',
          '상대 경로와 절대 경로를 구분하고 os.path 로 폴더 · 이름 · 확장자를 다룰 수 있다',
          '원본을 고치기 전에 백업본을 만들고, 폴더 안의 여러 파일을 반복문으로 일괄 처리할 수 있다'
        ],
        flow: [['복습 · type 명령 구현', 8], ['오류와 os.path.exists', 6], ['파일에 쓰기', 10], ['copy 명령 구현', 8], ['경로 · 백업 · 일괄 처리', 10], ['SELF STUDY · 퀴즈', 8]],
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
            desc: '<code>11~13행</code>은 복사 결과를 확인하려고 추가한 부분입니다. <code>with open("a") as f1, open("b", "w") as f2 :</code> 처럼 한 줄에 두 파일을 열 수도 있습니다.' },

          { type: 'h', text: '한 걸음 더 — 경로(path) 다루기' },
          { type: 'p', html: '지금까지 쓴 <code>"data1.txt"</code>, <code>"RAW/tree.raw"</code> 는 <b>상대 경로(relative path)</b> 입니다. “지금 있는 폴더(현재 작업 디렉터리)를 기준으로 여기”라는 뜻이지요. 반대로 <code>C:/Users/hong/data1.txt</code> 처럼 드라이브부터 끝까지 다 적은 것은 <b>절대 경로(absolute path)</b> 입니다. 프로그램을 다른 PC 로 옮겨도 동작하게 하려면 <b>상대 경로</b>를 쓰는 것이 좋습니다.' },
          { type: 'code', title: '추가 예제. 지금 어디에 있을까 — getcwd() 와 abspath()', code: `import os

print("현재 작업 폴더 :", os.getcwd())
print("data1.txt 의 절대 경로 :", os.path.abspath("data1.txt"))
print("파일이 있나요? :", os.path.exists("data1.txt"))`, nondeterministic: true,
            desc: '출력되는 경로는 실행하는 곳마다 다릅니다(브라우저는 <code>/home/pyodide/work</code>, 윈도 IDLE 은 <code>C:\\Users\\…</code>). 중요한 것은 <b>상대 경로 <code>"data1.txt"</code> 는 “현재 작업 폴더 + 파일 이름” 으로 해석된다</b>는 점입니다.' },
          { type: 'p', html: '경로를 직접 문자열로 자르고 붙이면 실수하기 쉽습니다. <code>os.path</code> 모듈이 필요한 도구를 모두 제공합니다.' },
          { type: 'code', title: '추가 예제. 폴더 · 이름 · 확장자 나누고 붙이기', code: `import os

name = "RAW/tree.raw"
print("폴더 이름 :", os.path.dirname(name))
print("파일 이름 :", os.path.basename(name))
print("이름과 확장자 :", os.path.splitext(os.path.basename(name)))
print("이어 붙이기 :", os.path.join("backup", "2026", "tree.raw"))

root, ext = os.path.splitext(name)
print("확장자 바꾸기 :", root + ".bmp")`, nondeterministic: true,
            desc: '<code>splitext()</code> 는 <code>(\'tree\', \'.raw\')</code> 처럼 <b>이름</b>과 <b>확장자</b>를 나눠 줍니다. 확장자를 바꿀 때는 “이름 + 새 확장자” 로 만듭니다. <code>join()</code> 의 결과는 운영체제마다 달라서(윈도 <code>backup\\2026\\tree.raw</code>, 브라우저 <code>backup/2026/tree.raw</code>) 여기서는 정답 출력을 비교하지 않습니다.' },
          { type: 'callout', kind: 'more', title: '📘 윈도의 역슬래시 \\ 와 파이썬 문자열', html: '<p>윈도 탐색기는 경로를 <code>C:\\Temp\\data1.txt</code> 처럼 역슬래시로 보여 줍니다. 그런데 파이썬 문자열에서 <code>\\</code> 는 <b>특수 문자의 시작</b>입니다. <code>"C:\\Temp\\new.txt"</code> 는 <code>\\T</code> 는 그대로지만 <code>\\n</code> 이 줄바꿈이 되어 엉뚱한 경로가 됩니다.</p><ul><li>가장 쉬운 방법: <b><code>/</code> 를 쓴다</b> — <code>"C:/Temp/new.txt"</code> (윈도에서도 잘 동작합니다)</li><li><code>\\\\</code> 로 두 번 쓴다 — <code>"C:\\\\Temp\\\\new.txt"</code></li><li>앞에 <code>r</code> 을 붙인 <b>raw 문자열</b> — <code>r"C:\\Temp\\new.txt"</code></li><li>조각을 이어 붙일 때는 <code>os.path.join()</code> (또는 11-5 교시의 <code>pathlib</code>)</li></ul>' },

          { type: 'h', text: '고치기 전에 백업하기' },
          { type: 'p', html: '파일을 고치는 프로그램은 <b>실수하면 원본이 사라집니다</b>. 그래서 실무에서는 원본을 건드리기 전에 <b>백업본</b>을 먼저 만듭니다. <code>shutil.copy()</code> 로 한 줄이면 됩니다(11-5 교시에서 자세히 배웁니다).' },
          { type: 'code', title: '추가 예제. 백업본을 만들고 원본 고치기', code: `import os
import shutil

if os.path.exists("data1.txt") :          # 고치기 전에 백업본부터
    shutil.copy("data1.txt", "data1.txt.bak")
    print("백업 완료 : data1.txt.bak")

with open("data1.txt", "a", encoding = "utf-8") as outFp :
    outFp.write("\\n오늘 새로 덧붙인 줄입니다.\\n")

print("--- 고친 파일 ---")
with open("data1.txt", "r", encoding = "utf-8") as inFp :
    print(inFp.read())
print("--- 백업본 (원래 내용) ---")
with open("data1.txt.bak", "r", encoding = "utf-8") as inFp :
    print(inFp.read())`, expect: `백업 완료 : data1.txt.bak
--- 고친 파일 ---
CookBook 파이썬을 공부합니다.
완전 재미있어요. ^^
파이썬을 공부하기 잘했네요~~
오늘 새로 덧붙인 줄입니다.

--- 백업본 (원래 내용) ---
CookBook 파이썬을 공부합니다.
완전 재미있어요. ^^
파이썬을 공부하기 잘했네요~~`,
            desc: '페이지를 새로 고치면 작업 폴더가 처음 상태로 돌아오므로 마음 놓고 실험해도 됩니다. 실제 PC 에서 실습할 때는 이 예제처럼 <b>먼저 복사</b>하는 습관을 들이세요. 잠깐만 쓸 파일이라면 <code>tempfile</code> 모듈로 임시 파일을 만드는 방법도 있습니다.' },

          { type: 'h', text: '여러 파일을 한꺼번에 처리하기' },
          { type: 'p', html: '파일 하나를 다루는 코드를 <code>for</code> 문으로 감싸면 <b>수십 · 수백 개</b>의 파일도 같은 방식으로 처리할 수 있습니다. 이것이 사람이 손으로 하는 일과 크게 달라지는 지점입니다. 폴더 안의 이름 목록은 <code>os.listdir(폴더)</code> 로 얻습니다.' },
          { type: 'code', title: '추가 예제. 폴더 안의 .txt 파일을 모두 읽어 행 수 세기', code: `import os

os.makedirs("memo", exist_ok = True)                 # 연습용 폴더와 파일 만들기
for name, text in [("mon.txt", "월요일\\n비\\n"), ("tue.txt", "화요일\\n맑음\\n"), ("wed.txt", "수요일\\n흐림\\n안개\\n")] :
    with open(os.path.join("memo", name), "w", encoding = "utf-8") as outFp :
        outFp.write(text)

total = 0
for name in sorted(os.listdir("memo")) :             # 이름 순서로
    if not name.endswith(".txt") :                   # .txt 만 고르기
        continue
    with open(os.path.join("memo", name), "r", encoding = "utf-8") as inFp :
        lines = inFp.readlines()
    print("%s : %d행" % (name, len(lines)))
    total += len(lines)

print("합계 :", total, "행")`, expect: `mon.txt : 2행
tue.txt : 2행
wed.txt : 3행
합계 : 7 행`,
            desc: '<code>os.listdir()</code> 이 돌려주는 순서는 정해져 있지 않으므로 <code>sorted()</code> 로 정렬했습니다. <code>endswith(".txt")</code> 로 원하는 확장자만 고릅니다. 11-5 교시에서는 하위 폴더까지 훑는 <code>os.walk()</code> 와 <code>pathlib</code> 의 <code>glob()</code> 를 배웁니다.' }
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
            title: '실습 11-5. 실행 기록 남기기 ("a" 모드)',
            level: 1,
            desc: '<p><code>"a"</code>(추가) 모드를 써서 <code>run.log</code> 파일에 <code>1번째 실행</code> ~ <code>3번째 실행</code> 을 한 줄씩 덧붙이고, 마지막에 파일 전체를 출력하세요.</p><pre>--- run.log ---\n1번째 실행\n2번째 실행\n3번째 실행</pre><p><code>"a"</code> 를 <code>"w"</code> 로 바꾸면 결과가 어떻게 달라지는지도 확인해 보세요.</p>',
            hint: '<code>for i in range(1, 4) :</code> 안에서 <code>with open("run.log", "a", encoding = "utf-8") as outFp :</code> 로 열고 <code>outFp.write("%d번째 실행\\n" % i)</code> 로 씁니다.',
            starter: `for i in range(1, 4) :
    pass    # TODO: "a" 모드로 열어 한 줄 덧붙이기

print("--- run.log ---")
# TODO: run.log 전체 출력
`,
            solution: `for i in range(1, 4) :
    with open("run.log", "a", encoding = "utf-8") as outFp :
        outFp.write("%d번째 실행\\n" % i)

print("--- run.log ---")
with open("run.log", "r", encoding = "utf-8") as inFp :
    print(inFp.read(), end = "")
`,
            expect: `--- run.log ---
1번째 실행
2번째 실행
3번째 실행`
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
            title: '실습 11-6. 성적 파일 저장하고 평균 구하기',
            level: 2,
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
          },
          {
            title: '실습 11-7. 파일 이름과 확장자 다루기',
            level: 2,
            desc: '<p>경로 목록 <code>["data1.txt", "RAW/tree.raw", "backup/2026/report.csv", "win.ini"]</code> 의 각 경로에 대해 <b>폴더 · 이름 · 확장자</b>를 나눠 출력하고(폴더가 없으면 <code>(없음)</code>), 이어서 모든 경로의 확장자를 <code>.bak</code> 으로 바꾼 결과를 출력하세요.</p><pre>data1.txt → 폴더 : (없음) / 이름 : data1 / 확장자 : .txt\n…\n--- 확장자를 .bak 으로 바꾸기 ---\ndata1.bak\nRAW/tree.bak\n…</pre>',
            hint: '<code>os.path.dirname()</code>, <code>os.path.basename()</code>, <code>os.path.splitext()</code> 를 씁니다. 확장자 바꾸기는 <code>root, ext = os.path.splitext(경로)</code> 뒤 <code>root + ".bak"</code>.',
            starter: `import os

names = ["data1.txt", "RAW/tree.raw", "backup/2026/report.csv", "win.ini"]

for name in names :
    pass    # TODO: 폴더 · 이름 · 확장자 나눠 출력

print("--- 확장자를 .bak 으로 바꾸기 ---")
# TODO: 확장자를 .bak 으로 바꿔 출력
`,
            solution: `import os

names = ["data1.txt", "RAW/tree.raw", "backup/2026/report.csv", "win.ini"]

for name in names :
    folder = os.path.dirname(name)
    root, ext = os.path.splitext(os.path.basename(name))
    if folder == "" :
        folder = "(없음)"
    print("%s → 폴더 : %s / 이름 : %s / 확장자 : %s" % (name, folder, root, ext))

print("--- 확장자를 .bak 으로 바꾸기 ---")
for name in names :
    root, ext = os.path.splitext(name)
    print(root + ".bak")
`,
            expect: `data1.txt → 폴더 : (없음) / 이름 : data1 / 확장자 : .txt
RAW/tree.raw → 폴더 : RAW / 이름 : tree / 확장자 : .raw
backup/2026/report.csv → 폴더 : backup/2026 / 이름 : report / 확장자 : .csv
win.ini → 폴더 : (없음) / 이름 : win / 확장자 : .ini
--- 확장자를 .bak 으로 바꾸기 ---
data1.bak
RAW/tree.bak
backup/2026/report.bak
win.bak`
          },
          {
            title: '🚀 프로젝트 11-1. 메모장(일기) 앱 — 추가 · 목록 · 검색 · 삭제',
            level: 3,
            desc: '<p>메모를 파일에 저장해 두고 언제든 다시 꺼내 보는 <b>메모장 프로그램</b>을 만듭니다. 프로그램을 껐다 켜도 메모가 남아 있어야 합니다.</p><p><b>요구 사항</b></p><ol><li>메모는 <code>memo.txt</code> 에 <b>한 줄에 하나씩</b> 저장한다 (인코딩은 <code>utf-8</code>).</li><li>메뉴를 계속 보여 주고 번호를 입력받는다.<br><code>[1] 추가  [2] 목록  [3] 검색  [4] 삭제  [5] 종료</code></li><li><b>1 추가</b> — 내용을 입력받아 파일 끝에 추가하고 <code>N번으로 저장했습니다.</code> 출력</li><li><b>2 목록</b> — <code>1. 내용</code> 처럼 번호를 붙여 모두 출력. 하나도 없으면 <code>메모가 없습니다.</code></li><li><b>3 검색</b> — 낱말을 입력받아 그 낱말이 든 메모만 번호와 함께 출력하고, 마지막에 <code>N개를 찾았습니다.</code></li><li><b>4 삭제</b> — 번호를 입력받아 그 메모를 지우고 <code>지웠습니다 : 내용</code> 출력. 없는 번호면 <code>그런 번호는 없습니다.</code></li><li><b>5 종료</b> — <code>메모장을 끝냅니다.</code> 를 출력하고 반복을 끝낸다. 1~5 가 아니면 <code>1~5 중에서 선택하세요.</code></li></ol><p><b>확장 아이디어</b> — 여기까지 했다면 이렇게 더 해 보세요.</p><ul><li>메모 앞에 날짜를 붙여 저장하기 (<code>import datetime</code> → <code>datetime.date.today()</code>)</li><li>삭제하기 전에 <code>memo.txt.bak</code> 으로 백업본 만들기</li><li>메모를 <code>번호|중요도|내용</code> 형식으로 저장하고 중요한 메모만 보기</li><li>11-7 교시를 배운 뒤 <code>memo.json</code> 이나 <code>memo.csv</code> 로 바꾸기</li></ul>',
            hint: '파일 전체를 읽어 <b>리스트</b>로 만드는 함수 <code>load()</code> 와, 리스트를 파일에 <b>모두 다시 쓰는</b> 함수 <code>save(memos)</code> 를 만들면 나머지는 리스트 다루기(8장 · 9장)가 됩니다. 삭제는 <code>memos.pop(번호 - 1)</code> 뒤 <code>save()</code>. 번호 검사는 <code>num.isdigit() and 1 &lt;= int(num) &lt;= len(memos)</code>.',
            starter: `import os

FNAME = "memo.txt"

def load() :
    if not os.path.exists(FNAME) :
        return []
    with open(FNAME, "r", encoding = "utf-8") as inFp :
        return [line.rstrip("\\n") for line in inFp]

def save(memos) :
    pass    # TODO: memos 의 각 항목을 한 줄씩 파일에 쓰기

while True :
    print("[1] 추가  [2] 목록  [3] 검색  [4] 삭제  [5] 종료")
    sel = input("선택 : ")

    if sel == "1" :
        text = input("메모 내용 : ")
        # TODO: 목록을 읽어 추가하고 저장
    elif sel == "2" :
        pass    # TODO: 번호를 붙여 목록 출력
    elif sel == "3" :
        word = input("찾을 낱말 : ")
        # TODO: 낱말이 든 메모만 출력
    elif sel == "4" :
        num = input("지울 번호 : ")
        # TODO: 그 번호의 메모 지우기
    elif sel == "5" :
        print("메모장을 끝냅니다.")
        break
    else :
        print("1~5 중에서 선택하세요.")
`,
            solution: `import os

FNAME = "memo.txt"

def load() :
    if not os.path.exists(FNAME) :
        return []
    with open(FNAME, "r", encoding = "utf-8") as inFp :
        return [line.rstrip("\\n") for line in inFp]

def save(memos) :
    with open(FNAME, "w", encoding = "utf-8") as outFp :
        for memo in memos :
            outFp.write(memo + "\\n")

while True :
    print("[1] 추가  [2] 목록  [3] 검색  [4] 삭제  [5] 종료")
    sel = input("선택 : ")

    if sel == "1" :
        text = input("메모 내용 : ")
        memos = load()
        memos.append(text)
        save(memos)
        print("%d번으로 저장했습니다." % len(memos))

    elif sel == "2" :
        memos = load()
        if not memos :
            print("메모가 없습니다.")
        for i, memo in enumerate(memos, 1) :
            print("%d. %s" % (i, memo))

    elif sel == "3" :
        word = input("찾을 낱말 : ")
        found = 0
        for i, memo in enumerate(load(), 1) :
            if word in memo :
                print("%d. %s" % (i, memo))
                found += 1
        print("%d개를 찾았습니다." % found)

    elif sel == "4" :
        memos = load()
        num = input("지울 번호 : ")
        if num.isdigit() and 1 <= int(num) <= len(memos) :
            gone = memos.pop(int(num) - 1)
            save(memos)
            print("지웠습니다 : %s" % gone)
        else :
            print("그런 번호는 없습니다.")

    elif sel == "5" :
        print("메모장을 끝냅니다.")
        break

    else :
        print("1~5 중에서 선택하세요.")
`,
            stdin: '1\n파일 입출력 복습하기\n1\n저녁에 달리기\n1\n파이썬 프로젝트 만들기\n2\n3\n파이썬\n4\n2\n2\n9\n5\n',
            expect: `[1] 추가  [2] 목록  [3] 검색  [4] 삭제  [5] 종료
선택 : 1
메모 내용 : 파일 입출력 복습하기
1번으로 저장했습니다.
[1] 추가  [2] 목록  [3] 검색  [4] 삭제  [5] 종료
선택 : 1
메모 내용 : 저녁에 달리기
2번으로 저장했습니다.
[1] 추가  [2] 목록  [3] 검색  [4] 삭제  [5] 종료
선택 : 1
메모 내용 : 파이썬 프로젝트 만들기
3번으로 저장했습니다.
[1] 추가  [2] 목록  [3] 검색  [4] 삭제  [5] 종료
선택 : 2
1. 파일 입출력 복습하기
2. 저녁에 달리기
3. 파이썬 프로젝트 만들기
[1] 추가  [2] 목록  [3] 검색  [4] 삭제  [5] 종료
선택 : 3
찾을 낱말 : 파이썬
3. 파이썬 프로젝트 만들기
1개를 찾았습니다.
[1] 추가  [2] 목록  [3] 검색  [4] 삭제  [5] 종료
선택 : 4
지울 번호 : 2
지웠습니다 : 저녁에 달리기
[1] 추가  [2] 목록  [3] 검색  [4] 삭제  [5] 종료
선택 : 2
1. 파일 입출력 복습하기
2. 파이썬 프로젝트 만들기
[1] 추가  [2] 목록  [3] 검색  [4] 삭제  [5] 종료
선택 : 9
1~5 중에서 선택하세요.
[1] 추가  [2] 목록  [3] 검색  [4] 삭제  [5] 종료
선택 : 5
메모장을 끝냅니다.`
          }
        ],
        quiz: [
          { q: '없는 파일을 <code>open("abc.txt", "r")</code> 로 열면 나는 오류는?', options: ['NameError', 'FileNotFoundError', 'ValueError', '오류 없이 빈 파일이 만들어진다'], answer: 1, explain: '읽기 모드는 파일이 반드시 있어야 합니다. (쓰기 모드 "w" 는 없으면 새로 만듭니다)' },
          { q: '파일이 있는지 확인하는 함수는?', options: ['<code>os.exists()</code>', '<code>os.path.exists()</code>', '<code>open.exists()</code>', '<code>file.exists()</code>'], answer: 1, explain: '<code>import os</code> 후 <code>os.path.exists(파일명)</code> 을 씁니다.' },
          { q: '다음 코드를 실행한 뒤 <code>a.txt</code> 의 내용은?<pre><code>f = open("a.txt", "w")\nf.write("A")\nf.close()\nf = open("a.txt", "w")\nf.write("B")\nf.close()</code></pre>', options: ['AB', 'B', 'A', 'A 줄바꿈 B'], answer: 1, explain: '두 번째로 <code>"w"</code> 로 열 때 기존 내용 A 가 지워집니다. 이어 쓰려면 <code>"a"</code> 모드를 씁니다.' },
          { q: 'Code11-07 에서 <code>outStr + "\\n"</code> 처럼 줄바꿈을 붙이는 이유는?', options: ['input() 으로 받은 문자열에는 줄바꿈이 없어서', '파일 끝을 표시하려고', '한글을 저장하려고', 'writelines() 가 줄바꿈을 지워서'], answer: 0, explain: '줄바꿈을 붙이지 않으면 모든 입력이 한 줄로 이어져 저장됩니다.' },
          { q: '<code>os.path.splitext("backup/2026/report.csv")</code> 의 결과는?', options: ['<code>(\'report\', \'.csv\')</code>', '<code>(\'backup/2026/report\', \'.csv\')</code>', '<code>(\'backup/2026\', \'report.csv\')</code>', '<code>[\'backup\', \'2026\', \'report.csv\']</code>'], answer: 1, explain: '<code>splitext()</code> 는 <b>맨 뒤의 점</b>을 기준으로만 나눕니다. 폴더까지 떼어 내려면 <code>os.path.basename()</code> 을 먼저 적용합니다.' },
          { q: '윈도 경로를 파이썬 문자열로 쓸 때 <b>잘못된</b> 것은?', options: ['<code>"C:/Temp/new.txt"</code>', '<code>"C:\\\\Temp\\\\new.txt"</code>', '<code>r"C:\\Temp\\new.txt"</code>', '<code>"C:\\Temp\\new.txt"</code>'], answer: 3, explain: '<code>\\n</code> 이 줄바꿈 문자로 해석되어 엉뚱한 경로가 됩니다. <code>/</code> 를 쓰거나 <code>\\\\</code>, 또는 raw 문자열 <code>r"…"</code> 로 씁니다.' }
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
          { layout: 'code', title: '📘 경로 다루기 — os.path', code: `import os

name = "RAW/tree.raw"
print(os.path.dirname(name))        # 폴더
print(os.path.basename(name))       # 파일 이름
print(os.path.splitext(name))       # 이름 + 확장자
print(os.path.join("backup", "2026", "a.txt"))

root, ext = os.path.splitext(name)
print(root + ".bmp")                # 확장자 바꾸기`, points: ['상대 경로 = 현재 작업 폴더 기준', '<code>splitext</code> 는 맨 뒤 점에서 나눔', '<code>join</code> 결과는 OS 마다 다름(\\ 또는 /)'],
            notes: '<p><b>[4분]</b> 문자열을 직접 자르지 말고 os.path 를 쓰라고 강조합니다. 발문: “<code>"C:\\Temp\\new.txt"</code> 는 왜 위험할까?” → <code>\\n</code> 이 줄바꿈이 됨. 해결: <code>/</code>, <code>\\\\</code>, <code>r"…"</code>.</p>' },
          { layout: 'two', title: '백업하고 고치기 · 여러 파일 한꺼번에', left: { title: '고치기 전에 복사', code: `import os, shutil

shutil.copy("data1.txt", "data1.txt.bak")
with open("data1.txt", "a", encoding="utf-8") as f :
    f.write("\\n한 줄 더\\n")
print(open("data1.txt", encoding="utf-8").read())` }, right: { title: '폴더 안의 파일을 모두', code: `import os

os.makedirs("memo", exist_ok = True)
for name, text in [("a.txt", "1\\n2\\n"), ("b.txt", "3\\n")] :
    with open("memo/" + name, "w") as f :
        f.write(text)

for name in sorted(os.listdir("memo")) :
    if name.endswith(".txt") :
        with open("memo/" + name) as f :
            print(name, len(f.readlines()), "행")` },
            notes: '<p><b>[4분]</b> 왼쪽: “원본을 고치는 코드는 백업부터”라는 습관. 오른쪽: 파일 하나를 다루는 코드를 for 로 감싸면 100개도 같은 코드로 처리된다는 점 — 프로그래밍의 힘을 느끼게 해 주세요.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '파일을 지우지 않고 <b>끝에 이어서</b> 쓰려면 어떤 모드로 열어야 할까?', options: ['"r"', '"w"', '"a"', '"b"'], answer: 2, explain: 'a(append) 모드는 기존 내용 뒤에 덧붙입니다.',
            notes: '<p><b>[1분]</b></p>' },
          { layout: 'practice', title: '🚀 프로젝트 11-1. 메모장 앱', desc: '메뉴(추가 · 목록 · 검색 · 삭제 · 종료)를 반복해서 보여 주고, 메모를 <code>memo.txt</code> 에 한 줄씩 저장 · 삭제하는 프로그램', stdin: '1\n파이썬 공부\n2\n5\n', starter: `import os

FNAME = "memo.txt"
# TODO: load() 와 save() 함수
# TODO: 메뉴 반복
`, solution: `import os

FNAME = "memo.txt"

def load() :
    if not os.path.exists(FNAME) :
        return []
    with open(FNAME, "r", encoding = "utf-8") as f :
        return [line.rstrip("\\n") for line in f]

def save(memos) :
    with open(FNAME, "w", encoding = "utf-8") as f :
        for memo in memos :
            f.write(memo + "\\n")

while True :
    sel = input("[1] 추가 [2] 목록 [5] 종료 선택 : ")
    if sel == "1" :
        memos = load()
        memos.append(input("내용 : "))
        save(memos)
    elif sel == "2" :
        for i, m in enumerate(load(), 1) :
            print(i, m)
    elif sel == "5" :
        break
`,
            notes: '<p><b>[10분~]</b> 남은 시간에 시작해 과제로 이어 갑니다. 핵심 설계를 먼저 칠판에 정리하세요: “파일 전체 → 리스트”(load), “리스트 → 파일 전체”(save). 이 두 함수만 있으면 추가 · 검색 · 삭제는 리스트 다루기입니다.</p><p>삭제는 왜 “한 줄만 지우기”가 아니라 “전부 다시 쓰기”인지 발문해 보세요 — 파일 중간을 잘라 내는 기능은 없기 때문입니다.</p>' },
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
          'encoding 매개변수와 readline() · readlines() 의 선택 기준을 이해한다',
          'utf-8 과 cp949 의 차이를 알고 한글이 깨질 때 원인을 찾아 고칠 수 있다',
          'encode() · decode() · errors 옵션의 뜻을 설명할 수 있다'
        ],
        flow: [['복습 · ord · chr', 7], ['암호화 원리', 6], ['Code11-09 작성 · 실행', 16], ['인코딩과 한글 깨짐', 11], ['확장 실습 · 퀴즈', 10]],
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
          { type: 'callout', kind: 'more', title: '📘 문자열 바꾸기를 더 파이썬답게', html: '<p>문자열을 <code>+=</code> 로 계속 이어 붙이는 대신, 바꾼 글자를 리스트에 모아 <code>"".join(…)</code> 으로 합치는 방법도 많이 씁니다.</p><pre><code>outStr = "".join(chr(ord(ch) + secu) for ch in inStr)</code></pre>' },

          { type: 'h', text: '한 걸음 더 — 인코딩과 한글 깨짐' },
          { type: 'p', html: 'Code11-09 에서 <code>encoding = \'utf-8\'</code> 을 왜 적었을까요? 파일에 저장되는 것은 <b>글자가 아니라 바이트(0~255 숫자)</b> 입니다. 글자를 바이트로 바꾸는 약속을 <b>인코딩(encoding)</b>, 바이트를 다시 글자로 되돌리는 것을 <b>디코딩(decoding)</b> 이라고 합니다. 저장할 때와 읽을 때 <b>같은 약속</b>을 써야 글자가 제대로 살아납니다.' },
          { type: 'figure', html: SVG(1280, 300, '글자와 바이트, 인코딩과 디코딩',
            BOX(190, 120, 240, 110, '글자(str)|"파"', { stroke: 'var(--accent)', size: 24, bold: true }) +
            ARR('M315,90 L640,90', 'var(--warn)') + T(478, 60, 'encode  (인코딩)', { size: 21, bold: true, fill: 'var(--warn)' }) +
            ARR('M640,160 L320,160', 'var(--ok)', 'c11ok') + T(478, 195, 'decode  (디코딩)', { size: 21, bold: true, fill: 'var(--ok)' }) +
            BOX(900, 90, 440, 70, 'utf-8 :  ed 8c 8c   (3바이트)', { stroke: 'var(--line)', mono: true, size: 21, sw: 2 }) +
            BOX(900, 170, 440, 70, 'cp949 :  c6 c4      (2바이트)', { stroke: 'var(--line)', mono: true, size: 21, sw: 2 }) +
            T(640, 265, '같은 글자라도 약속(인코딩)에 따라 저장되는 바이트가 다릅니다 → 약속이 어긋나면 글자가 깨집니다', { size: 20, fill: 'var(--muted)' })), caption: '인코딩은 “글자 ↔ 바이트” 사이의 번역 규칙입니다' },
          { type: 'code', title: '추가 예제. encode() 와 decode() 로 직접 확인하기', code: `print("파이썬".encode("utf-8"))
print("파이썬".encode("cp949"))
print("글자 수 :", len("파이썬"))
print("utf-8 바이트 수 :", len("파이썬".encode("utf-8")))
print("cp949 바이트 수 :", len("파이썬".encode("cp949")))
print("다시 글자로 :", b"\\xed\\x8c\\x8c\\xec\\x9d\\xb4\\xec\\x8d\\xac".decode("utf-8"))`, expect: `b'\\xed\\x8c\\x8c\\xec\\x9d\\xb4\\xec\\x8d\\xac'
b'\\xc6\\xc4\\xc0\\xcc\\xbd\\xe3'
글자 수 : 3
utf-8 바이트 수 : 9
cp949 바이트 수 : 6
다시 글자로 : 파이썬`,
            desc: 'UTF-8 은 한글 한 글자에 <b>3바이트</b>, cp949 는 <b>2바이트</b>를 씁니다. 영문 · 숫자는 두 방식 모두 1바이트이고 값도 같아서, <b>영문만 있는 파일은 인코딩이 달라도 잘 열립니다</b>. 한글 파일에서만 문제가 생기는 이유가 여기에 있습니다.' },
          { type: 'table', head: ['인코딩 이름', '어디서 쓰나', '특징'], rows: [
            ['<code>utf-8</code>', '오늘날의 표준 (웹 · 리눅스 · macOS · 파이썬)', '전 세계 글자를 모두 표현. 한글 3바이트, 영문 1바이트'],
            ['<code>cp949</code> (<code>euc-kr</code>)', '윈도 메모장의 <b>ANSI</b>, 옛 한글 프로그램', '한글 2바이트. 한글 · 영문 외의 글자는 표현 못 함'],
            ['<code>utf-8-sig</code>', '엑셀에서 여는 CSV 파일', 'utf-8 앞에 표식(BOM) 3바이트를 붙임'],
            ['<code>ascii</code>', '아주 옛 파일 · 통신 규약', '영문 · 숫자 · 기호만 (0~127). 한글은 오류']
          ], caption: '자주 만나는 인코딩 — 한국에서 문제가 되는 것은 거의 utf-8 ↔ cp949 입니다' },
          { type: 'p', html: '작업 폴더에는 윈도 메모장에서 <b>ANSI(cp949)</b> 로 저장한 파일 <code>cp949.txt</code> 가 들어 있습니다. 이 파일을 utf-8 로 읽으면 어떻게 될까요?' },
          { type: 'code', title: '추가 예제. 인코딩이 어긋나면 — UnicodeDecodeError', code: `try :
    with open("cp949.txt", "r", encoding = "utf-8") as inFp :
        print(inFp.read())
except UnicodeDecodeError as e :
    print("utf-8 로 읽기 실패 :", e)

with open("cp949.txt", "r", encoding = "cp949") as inFp :
    print("cp949 로 읽기 성공 :")
    print(inFp.read(), end = "")`, expect: `utf-8 로 읽기 실패 : 'utf-8' codec can't decode byte 0xc0 in position 0: invalid start byte
cp949 로 읽기 성공 :
윈도 메모장에서 ANSI 로 저장한 파일입니다.
한글이 깨지면 인코딩을 확인하세요.`,
            desc: '<code>invalid start byte</code> 는 “이 바이트는 UTF-8 규칙에 맞지 않는다”는 뜻입니다. <code>position 0</code> 은 몇 번째 바이트에서 막혔는지 알려 줍니다. 오류 메시지가 이렇게 나오면 <b>거의 언제나 인코딩 문제</b>입니다. (try ~ except 는 11-6 교시에서 배웁니다)' },
          { type: 'callout', kind: 'warn', title: '한글이 깨질 때 점검하는 순서', html: '<ol><li><b>읽는 쪽</b>의 인코딩을 바꿔 본다 — <code>encoding="utf-8"</code> ↔ <code>encoding="cp949"</code></li><li>파일을 만든 프로그램을 확인한다 — 윈도 메모장의 <b>ANSI</b> = cp949, <b>UTF-8</b> = utf-8</li><li>그래도 모르겠으면 <code>"rb"</code> 로 열어 앞부분 바이트를 직접 본다 — 한글이 <code>\\xed…</code> 로 시작하면 utf-8, <code>\\xc0…</code> 처럼 <code>\\x80~\\xff</code> 가 두 개씩 이어지면 cp949</li><li><code>UnicodeDecodeError</code> 대신 <b>글자가 이상하게 보이는</b> 경우(<code>ì•ˆë…•</code>)는 utf-8 파일을 cp949 로 읽은 것입니다</li></ol>' },
          { type: 'code', title: '추가 예제. errors 로 오류 대신 넘어가기', code: `with open("cp949.txt", "rb") as inFp :
    raw = inFp.read(9)

print("바이트 그대로 :", raw)
print("cp949 로 해석 :", raw.decode("cp949"))
print("utf-8 로 해석(errors='ignore') :", repr(raw.decode("utf-8", errors = "ignore")))`, expect: `바이트 그대로 : b'\\xc0\\xa9\\xb5\\xb5 \\xb8\\xde\\xb8\\xf0'
cp949 로 해석 : 윈도 메모
utf-8 로 해석(errors='ignore') : ' \\u07b8'`,
            desc: '<code>errors="ignore"</code> 는 해석할 수 없는 바이트를 <b>버리고</b> 계속합니다. 그래서 한글이 거의 사라져 버렸습니다. <code>errors="replace"</code> 는 대신 <code>�</code> 를 넣습니다. <b>둘 다 원래 글자를 되살려 주지는 않습니다.</b> 프로그램이 멈추지 않게 하는 임시방편일 뿐이므로, 먼저 올바른 인코딩을 찾는 것이 정답입니다.' },
          { type: 'callout', kind: 'more', title: '📘 인코딩을 적지 않으면 어떻게 될까?', html: '<p><code>open("a.txt", "r")</code> 처럼 인코딩을 생략하면 운영체제의 <b>기본 인코딩</b>이 쓰입니다. 리눅스 · macOS · 이 강좌의 브라우저 파이썬은 UTF-8 이지만, 한국어 윈도의 옛 파이썬은 cp949 였습니다. 같은 코드가 PC 에 따라 다르게 동작하는 셈이지요.</p><p>그래서 <b>한글이 들어가는 파일은 인코딩을 항상 적는 것</b>이 좋습니다. 파이썬 3.15 부터는 기본값이 UTF-8 로 통일될 예정이고, 지금도 <code>encoding="utf-8"</code> 을 적어 두면 어디서나 같은 결과를 얻습니다.</p>' }
        ],
        practice: [
          {
            title: '실습 11-8. 낱말을 바꿔 새 파일로 저장하기',
            level: 1,
            desc: '<p><code>data1.txt</code> 를 읽어 <code>파이썬</code> 이라는 낱말을 모두 <code>Python</code> 으로 바꾼 뒤 <code>python.txt</code> 에 저장하고, 저장한 파일의 내용을 출력하세요.</p><pre>CookBook Python을 공부합니다.\n완전 재미있어요. ^^\nPython을 공부하기 잘했네요~~</pre>',
            hint: '파일 전체를 <code>read()</code> 로 읽어 문자열 하나로 만든 뒤 <code>text.replace("파이썬", "Python")</code> 을 쓰면 한 번에 바뀝니다(8장). 한글이 있으므로 <code>encoding = "utf-8"</code> 을 적습니다.',
            starter: `with open("data1.txt", "r", encoding = "utf-8") as inFp :
    text = inFp.read()

# TODO: 파이썬 → Python 으로 바꾸기

with open("python.txt", "w", encoding = "utf-8") as outFp :
    outFp.write(text)

# TODO: python.txt 내용 출력
`,
            solution: `with open("data1.txt", "r", encoding = "utf-8") as inFp :
    text = inFp.read()

text = text.replace("파이썬", "Python")

with open("python.txt", "w", encoding = "utf-8") as outFp :
    outFp.write(text)

with open("python.txt", "r", encoding = "utf-8") as inFp :
    print(inFp.read(), end = "")
`,
            expect: `CookBook Python을 공부합니다.
완전 재미있어요. ^^
Python을 공부하기 잘했네요~~`
          },
          {
            title: '실습 11-9. 영문 대문자로 바꿔 복사하기',
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
          },
          {
            title: '실습 11-10. 암호 키를 입력받는 암호화',
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
            title: '실습 11-11. cp949 파일을 utf-8 파일로 바꾸기',
            level: 2,
            desc: '<p>작업 폴더의 <code>cp949.txt</code>(윈도 메모장 ANSI 로 저장된 파일)를 읽어 <b>같은 내용</b>을 <code>utf8.txt</code> 에 UTF-8 로 저장하세요. 그다음 저장한 파일을 다시 읽어 출력하고, 같은 글자가 두 인코딩에서 각각 몇 바이트인지 출력합니다.</p><pre>--- utf8.txt ---\n윈도 메모장에서 ANSI 로 저장한 파일입니다.\n한글이 깨지면 인코딩을 확인하세요.\ncp949 바이트 수 : 78\nutf-8 바이트 수 : 109</pre>',
            hint: '읽을 때 <code>encoding = "cp949"</code>, 쓸 때 <code>encoding = "utf-8"</code> 을 씁니다. 바이트 수는 <code>len(text.encode("cp949"))</code> 처럼 <code>encode()</code> 결과의 길이로 구합니다.',
            starter: `# TODO: cp949 로 읽기
text = ""

# TODO: utf-8 로 utf8.txt 에 쓰기

print("--- utf8.txt ---")
# TODO: utf8.txt 를 utf-8 로 읽어 출력

# TODO: 두 인코딩의 바이트 수 출력
`,
            solution: `with open("cp949.txt", "r", encoding = "cp949") as inFp :
    text = inFp.read()

with open("utf8.txt", "w", encoding = "utf-8") as outFp :
    outFp.write(text)

print("--- utf8.txt ---")
with open("utf8.txt", "r", encoding = "utf-8") as inFp :
    print(inFp.read(), end = "")

print("cp949 바이트 수 :", len(text.encode("cp949")))
print("utf-8 바이트 수 :", len(text.encode("utf-8")))
`,
            expect: `--- utf8.txt ---
윈도 메모장에서 ANSI 로 저장한 파일입니다.
한글이 깨지면 인코딩을 확인하세요.
cp949 바이트 수 : 78
utf-8 바이트 수 : 109`
          },
          {
            title: '실습 11-12. 암호 키 알아내기 (무차별 대입)',
            level: 3,
            desc: '<p>작업 폴더의 <code>security.txt</code> 는 어떤 키로 암호화된 파일입니다. <b>키를 모른다고 가정</b>하고 1부터 109까지 모든 키로 해독해 보면서, 해독 결과가 <code>안녕</code> 으로 시작하는 키를 찾아 키와 해독문을 출력하세요.</p><pre>암호 키를 찾았습니다 : 100\n안녕하세요?\n저는 Cookbook 파이썬을 즐겁게\n공부하고 있습니다. ^___^</pre><p>이렇게 가능한 값을 모두 시도해 보는 공격을 <b>무차별 대입(brute force)</b> 이라고 합니다. 키가 몇백 개뿐인 암호는 컴퓨터가 순식간에 푼다는 것을 확인해 보세요.</p><p><b>왜 109까지일까?</b> 암호문에서 번호가 가장 작은 글자가 110(<code>n</code>)이라서, 110 이상을 빼면 <code>chr()</code> 에 음수가 들어가 오류가 납니다.</p>',
            hint: '<code>for key in range(1, 110) :</code> 안에서 <code>plain</code> 을 만들고 <code>if plain.startswith("안녕") :</code> 이면 출력한 뒤 <code>break</code> 합니다.',
            starter: `with open("security.txt", "r", encoding = "utf-8") as inFp :
    secStr = inFp.read()

for key in range(1, 110) :
    plain = ""
    # TODO: 모든 글자에서 key 를 뺀 글자로 plain 만들기
    # TODO: plain 이 "안녕" 으로 시작하면 출력하고 break
`,
            solution: `with open("security.txt", "r", encoding = "utf-8") as inFp :
    secStr = inFp.read()

for key in range(1, 110) :
    plain = ""
    for ch in secStr :
        plain += chr(ord(ch) - key)
    if plain.startswith("안녕") :
        print("암호 키를 찾았습니다 : %d" % key)
        print(plain, end = "")
        break
`,
            expect: `암호 키를 찾았습니다 : 100
안녕하세요?
저는 Cookbook 파이썬을 즐겁게
공부하고 있습니다. ^___^`
          }
        ],
        quiz: [
          { q: '<code>chr(ord("A") + 2)</code> 의 결과는?', options: ['"A2"', '"C"', '67', '"B"'], answer: 1, explain: '<code>ord("A")</code> 는 65, 65 + 2 = 67, <code>chr(67)</code> 은 "C" 입니다.' },
          { q: '암호화된 security.txt 가 한 줄짜리 파일이 되는 이유는?', options: ['write() 가 줄바꿈을 지워서', '줄바꿈 문자 \\n 도 100이 더해져 다른 글자(n)가 되어서', 'readline() 이 한 행만 읽어서', 'encoding 을 utf-8 로 해서'], answer: 1, explain: '\\n(10) + 100 = 110 = "n" 이므로 더 이상 줄바꿈이 아닙니다.' },
          { q: '크기가 수 GB 인 로그 파일을 처리할 때 가장 알맞은 읽기 방법은?', options: ['readlines() 로 전체를 리스트로', 'read() 로 전체를 문자열로', 'for 행 in 파일객체 : 로 한 행씩', '파일을 복사한 뒤 readlines()'], answer: 2, explain: '한 행씩 읽으면 메모리를 적게 씁니다. read() · readlines() 는 전체를 메모리에 올립니다.' },
          { q: '<code>len("한글")</code> 과 <code>len("한글".encode("utf-8"))</code> 의 결과를 차례대로 고르면?', options: ['2, 2', '2, 4', '2, 6', '6, 6'], answer: 2, explain: '글자 수는 2, UTF-8 에서 한글은 한 글자에 3바이트이므로 바이트 수는 6 입니다.' },
          { q: '윈도 메모장에서 <b>ANSI</b> 로 저장한 한글 파일을 <code>open(f, "r", encoding="utf-8")</code> 로 읽으면?', options: ['잘 읽힌다', '<code>UnicodeDecodeError</code> 가 날 수 있다', '파일이 지워진다', '영문만 읽힌다'], answer: 1, explain: 'ANSI 는 한국어 윈도에서 cp949 입니다. 저장할 때와 읽을 때의 인코딩이 다르면 오류가 나거나 글자가 깨집니다.' },
          { q: '<code>errors = "ignore"</code> 를 주고 파일을 읽으면?', options: ['원래 글자가 정확히 복원된다', '읽을 수 없는 바이트를 버리고 계속 읽는다', '오류가 나면 프로그램이 멈춘다', '인코딩을 자동으로 찾아 준다'], answer: 1, explain: '오류를 내지 않고 넘어갈 뿐, 버려진 글자는 되살아나지 않습니다. 올바른 인코딩을 찾는 것이 먼저입니다.' }
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
          { layout: 'two', title: '📘 인코딩 — 글자와 바이트', left: { title: 'encode / decode', code: `print("파이썬".encode("utf-8"))
print("파이썬".encode("cp949"))
print(len("파이썬"))
print(len("파이썬".encode("utf-8")))
print(len("파이썬".encode("cp949")))` }, right: { title: '자주 쓰는 인코딩', bullets: ['<code>utf-8</code> — 표준. 한글 3바이트', '<code>cp949</code> — 윈도 메모장의 <b>ANSI</b>. 한글 2바이트', '<code>utf-8-sig</code> — 엑셀용 CSV (BOM)', '영문 · 숫자는 어느 쪽이든 1바이트, 값도 같음'] },
            notes: '<p><b>[4분]</b> 파일에 저장되는 것은 글자가 아니라 바이트라는 점부터. 발문: “영문만 있는 파일은 왜 인코딩이 달라도 잘 열릴까?” → 0~127 구간은 모든 인코딩이 같기 때문. 한글에서만 문제가 생깁니다.</p>' },
          { layout: 'code', title: '📘 한글이 깨질 때 — cp949 파일 읽기', code: `try :
    with open("cp949.txt", "r", encoding = "utf-8") as inFp :
        print(inFp.read())
except UnicodeDecodeError as e :
    print("utf-8 로 읽기 실패 :", e)

with open("cp949.txt", "r", encoding = "cp949") as inFp :
    print("cp949 로 읽기 성공 :")
    print(inFp.read(), end = "")`, points: ['<code>invalid start byte</code> = 인코딩 문제', '읽는 쪽 인코딩을 바꿔 본다', '<code>errors="ignore"</code> 는 임시방편일 뿐'],
            notes: '<p><b>[4분]</b> 실제 실습에서 가장 자주 만나는 오류입니다. 점검 순서를 칠판에 적어 주세요: ① 읽는 쪽 인코딩 바꾸기 ② 만든 프로그램 확인(메모장 ANSI=cp949) ③ rb 로 앞 바이트 보기. 글자가 <code>ì•ˆë…•</code> 처럼 보이면 utf-8 파일을 cp949 로 읽은 것입니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>chr(ord("A") + 2)</code> 의 결과는?', options: ['"A2"', '"C"', '67', '"B"'], answer: 1, explain: '65 + 2 = 67 → "C"',
            notes: '<p><b>[1분]</b></p>' },
          { layout: 'practice', title: '실습 11-10. 암호 키 입력받기', desc: '100 대신 입력한 키로 normal.txt 를 secret.txt 로 암호화하고, 다시 해독해 출력', stdin: '7\n', starter: `key = int(input("암호 키(숫자) : "))
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
          'RAW 파일을 2차원 리스트로 읽고 tkinter 의 PhotoImage 에 출력할 수 있다',
          'bytes 와 bytearray 의 성질을 알고, 덩어리(버퍼) 단위로 복사할 수 있다',
          '파일의 머리글(매직 넘버)을 읽어 파일 종류와 그림 크기를 알아낼 수 있다'
        ],
        flow: [['이진 파일의 개념 · bytes', 8], ['이진 파일 복사 · 덩어리 복사', 8], ['RAW 구조 · 윈도창 · 종이', 9], ['loadImage · displayImage · 완성', 15], ['머리글 읽기 · 실습 · 퀴즈', 10]],
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
          { type: 'code', title: '추가 예제. 4096바이트씩 덩어리로 복사하기', code: `import os

CHUNK = 4096
count = 0
with open("RAW/tree.raw", "rb") as inFp, open("tree_copy.raw", "wb") as outFp :
    while True :
        data = inFp.read(CHUNK)
        if not data :
            break
        outFp.write(data)
        count += 1

print("%d 덩어리로 복사했습니다." % count)
print("원본 :", os.path.getsize("RAW/tree.raw"), "바이트")
print("복사본 :", os.path.getsize("tree_copy.raw"), "바이트")`, expect: `16 덩어리로 복사했습니다.
원본 : 65536 바이트
복사본 : 65536 바이트`,
            desc: '65,536 ÷ 4,096 = 16 번만 읽고 쓰면 끝납니다. 1바이트씩이면 65,536 번이니 4,000 배 차이입니다. <code>5행</code>처럼 <code>with</code> 한 줄에 파일 두 개를 열 수 있습니다. 이 방식은 <b>파일이 아무리 커도 메모리를 4KB 만</b> 쓰므로, 텍스트의 “한 줄씩 읽기”에 해당하는 이진 파일 버전입니다.' },

          { type: 'h', text: '한 걸음 더 — bytes 자세히 보기' },
          { type: 'p', html: '이진 모드에서 다루는 <code>bytes</code> 는 “<b>0~255 정수들의 변하지 않는 나열</b>” 입니다. 문자열(str)과 비슷하게 생겼지만 알아 둘 차이가 있습니다.' },
          { type: 'code', title: '추가 예제. bytes 의 성질', code: `data = b"Py\\x00\\xff"

print(data, len(data))
print("첫 바이트 :", data[0], type(data[0]))
print("자르기 :", data[0:2], type(data[0:2]))
print("숫자 리스트로 :", list(data))
print("숫자 리스트에서 만들기 :", bytes([72, 105, 33]))
print("16진수로 :", data.hex())

ba = bytearray(data)          # 값을 바꿀 수 있는 bytes
ba[0] = 74
print("바꾼 뒤 :", bytes(ba))`, expect: `b'Py\\x00\\xff' 4
첫 바이트 : 80 <class 'int'>
자르기 : b'Py' <class 'bytes'>
숫자 리스트로 : [80, 121, 0, 255]
숫자 리스트에서 만들기 : b'Hi!'
16진수로 : 507900ff
바꾼 뒤 : b'Jy\\x00\\xff'`,
            desc: '<code>data[0]</code> 은 <b>정수</b>지만 <code>data[0:2]</code> 는 <b>bytes</b> 입니다(문자열과 다른 점). <code>b\'Py\\x00\\xff\'</code> 처럼 화면에 보일 때, 글자로 보여 줄 수 있는 바이트는 글자로, 그렇지 않으면 <code>\\xff</code> 처럼 16진수로 보여 줍니다. <code>bytes</code> 는 값을 바꿀 수 없으므로(불변), 값을 고치려면 <code>bytearray</code> 로 바꿉니다. — 실습 11-17 의 반전 영상 저장이 바로 <code>bytes(정수리스트)</code> 를 쓰는 예입니다.' },

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
          { type: 'callout', kind: 'more', title: '📘 Pillow 로 RAW 읽기', html: '영상 처리 라이브러리 Pillow 를 쓰면 RAW 바이트를 한 줄로 그림으로 바꿀 수 있습니다: <code>Image.frombytes("L", (256, 256), open("RAW/tree.raw", "rb").read())</code>. 여기서 <code>"L"</code> 은 흑백(한 점 = 1바이트) 모드입니다. 이 장에서는 원리를 이해하려고 직접 한 바이트씩 처리했습니다.' },

          { type: 'h', text: '한 걸음 더 — 파일의 머리글(header) 읽기' },
          { type: 'p', html: 'RAW 파일은 밝기 값만 들어 있어서 크기 정보조차 없었습니다. 하지만 대부분의 이진 파일은 맨 앞에 <b>머리글(header)</b> 이 있어서 “나는 어떤 종류의 파일이고, 크기는 얼마다” 를 스스로 밝힙니다. 특히 맨 앞 몇 바이트는 파일 종류마다 정해져 있어서 <b>매직 넘버(magic number) · 시그니처</b> 라고 부릅니다.' },
          { type: 'table', head: ['파일 종류', '맨 앞 바이트', '글자로 보면'], rows: [
            ['PNG 그림', '<code>89 50 4E 47 0D 0A 1A 0A</code>', '<code>\\x89PNG\\r\\n\\x1a\\n</code>'],
            ['GIF 그림', '<code>47 49 46 38 37 61</code> / <code>…39 61</code>', '<code>GIF87a</code> / <code>GIF89a</code>'],
            ['JPEG 사진', '<code>FF D8 FF</code>', '(글자로 읽히지 않음)'],
            ['ZIP 압축 파일', '<code>50 4B 03 04</code>', '<code>PK\\x03\\x04</code> (개발자 Phil Katz 의 머리글자)'],
            ['PDF 문서', '<code>25 50 44 46</code>', '<code>%PDF</code>'],
            ['RAW (이 강좌)', '정해진 값 없음', '머리글이 없는 “날것” 파일이라 RAW'],
          ], caption: '확장명(.png)은 이름일 뿐이라 바꿀 수 있지만, 머리글은 파일 내용 자체입니다' },
          { type: 'code', title: '추가 예제. 앞 8바이트로 파일 종류 알아내기', code: `SIGNS = [(b"\\x89PNG\\r\\n\\x1a\\n", "PNG 그림"), (b"GIF87a", "GIF 그림"), (b"GIF89a", "GIF 그림"),
         (b"\\xff\\xd8\\xff", "JPEG 사진"), (b"PK\\x03\\x04", "ZIP 압축"), (b"%PDF", "PDF 문서")]

for name in ["game/ship02.png", "GIF/dog.gif", "JPG/picture01.jpg", "RAW/tree.raw"] :
    with open(name, "rb") as inFp :
        head = inFp.read(8)
    kind = "알 수 없음 (머리글이 없는 파일)"
    for sign, label in SIGNS :
        if head.startswith(sign) :
            kind = label
            break
    print(name)
    print("   앞 8바이트 :", head)
    print("   종류 :", kind)`, expect: `game/ship02.png
   앞 8바이트 : b'\\x89PNG\\r\\n\\x1a\\n'
   종류 : PNG 그림
GIF/dog.gif
   앞 8바이트 : b'GIF87a\\xc8\\x00'
   종류 : GIF 그림
JPG/picture01.jpg
   앞 8바이트 : b'\\xff\\xd8\\xff\\xe0\\x00\\x10JF'
   종류 : JPEG 사진
RAW/tree.raw
   앞 8바이트 : b'\\xeb\\xeb\\xeb\\xeb\\xeb\\xeb\\xeb\\xeb'
   종류 : 알 수 없음 (머리글이 없는 파일)`,
            desc: 'bytes 에도 문자열처럼 <code>startswith()</code> 를 쓸 수 있습니다. 이렇게 확인하면 누가 <code>bad.exe</code> 를 <code>photo.png</code> 로 이름만 바꿔 놓아도 <b>진짜 종류</b>를 알 수 있습니다. 파일 업로드를 받는 프로그램이 실제로 쓰는 방법입니다. (예제에 쓴 그림 파일들은 10장 · 13장에서 쓰는 예제 파일입니다)' },
          { type: 'p', html: '머리글에는 <b>가로 · 세로 크기</b>도 들어 있습니다. PNG 는 17~24번째 바이트에, GIF 는 7~10번째 바이트에 있습니다. 여러 바이트로 된 숫자는 <code>int.from_bytes(바이트, 순서)</code> 로 읽습니다.' },
          { type: 'code', title: '추가 예제. 그림 파일을 열지 않고 크기 알아내기', code: `with open("game/ship02.png", "rb") as inFp :
    head = inFp.read(24)
width = int.from_bytes(head[16:20], "big")       # PNG : 큰 자리부터
height = int.from_bytes(head[20:24], "big")
print("PNG 크기 : %d x %d" % (width, height))

with open("GIF/dog.gif", "rb") as inFp :
    head = inFp.read(10)
gw = int.from_bytes(head[6:8], "little")         # GIF : 작은 자리부터
gh = int.from_bytes(head[8:10], "little")
print("GIF 크기 : %d x %d" % (gw, gh))`, expect: `PNG 크기 : 48 x 64
GIF 크기 : 200 x 200`,
            desc: '<code>"big"</code>(빅 엔디언)은 큰 자릿수 바이트가 앞에 오는 방식, <code>"little"</code>(리틀 엔디언)은 반대입니다. 같은 <code>01 00</code> 두 바이트가 빅 엔디언이면 256, 리틀 엔디언이면 1 입니다. <b>파일 형식마다 약속이 다르므로 문서를 보고 맞춰야 합니다.</b>' },
          { type: 'callout', kind: 'more', title: '📘 struct 모듈 — 머리글을 한 번에 풀기', html: '<p>머리글에는 여러 개의 숫자가 이어져 있는 경우가 많습니다. 표준 라이브러리 <code>struct</code> 를 쓰면 <b>형식 문자열</b>로 한 번에 풀 수 있습니다.</p><pre><code>import struct\nw, h = struct.unpack("&gt;II", head[16:24])   # &gt; 빅엔디언, I 는 4바이트 부호 없는 정수</code></pre><p>반대로 <code>struct.pack()</code> 은 숫자들을 바이트로 만들어 줍니다. 이진 파일 형식을 직접 읽고 쓸 때 꼭 필요한 모듈입니다.</p>' }
        ],
        practice: [
          {
            title: '실습 11-13. 파일의 진짜 종류 알아내기',
            level: 1,
            desc: '<p>파일 이름을 받아 <b>머리글(맨 앞 바이트)</b> 로 종류를 알려 주는 함수 <code>kind(fname)</code> 을 만들고, 네 개의 파일에 대해 결과를 출력하세요. 확장명은 보지 않습니다.</p><pre>game/ship02.png : PNG\nGIF/cat.gif : GIF\nJPG/picture02.jpg : JPEG\nRAW/pattern.raw : 알 수 없음</pre>',
            hint: '<code>"rb"</code> 로 열어 <code>read(8)</code> 한 뒤 <code>head.startswith(b"\\x89PNG")</code> 처럼 확인합니다. GIF 는 <code>b"GIF87a"</code> 와 <code>b"GIF89a"</code> 두 가지, JPEG 는 <code>b"\\xff\\xd8\\xff"</code> 입니다.',
            starter: `def kind(fname) :
    with open(fname, "rb") as inFp :
        head = inFp.read(8)
    # TODO: head 의 시작을 보고 "PNG" · "GIF" · "JPEG" · "알 수 없음" 돌려주기
    return "알 수 없음"

for name in ["game/ship02.png", "GIF/cat.gif", "JPG/picture02.jpg", "RAW/pattern.raw"] :
    print("%s : %s" % (name, kind(name)))
`,
            solution: `def kind(fname) :
    with open(fname, "rb") as inFp :
        head = inFp.read(8)
    if head.startswith(b"\\x89PNG") :
        return "PNG"
    elif head.startswith(b"GIF87a") or head.startswith(b"GIF89a") :
        return "GIF"
    elif head.startswith(b"\\xff\\xd8\\xff") :
        return "JPEG"
    else :
        return "알 수 없음"

for name in ["game/ship02.png", "GIF/cat.gif", "JPG/picture02.jpg", "RAW/pattern.raw"] :
    print("%s : %s" % (name, kind(name)))
`,
            expect: `game/ship02.png : PNG
GIF/cat.gif : GIF
JPG/picture02.jpg : JPEG
RAW/pattern.raw : 알 수 없음`
          },
          {
            title: '실습 11-14. 1024바이트씩 덩어리로 복사하기',
            level: 1,
            desc: '<p><code>RAW/face_128.raw</code> 를 <b>1024바이트씩</b> 읽어 <code>face_copy.raw</code> 로 복사하세요. 몇 번 읽었는지, 두 파일의 크기와 내용이 같은지도 출력합니다.</p><pre>읽은 횟수 : 16\n원본 크기 : 16384\n복사본 크기 : 16384\n내용이 같은가? : True</pre>',
            hint: '<code>data = inFp.read(1024)</code> 로 읽고 <code>if not data : break</code>. 마지막 비교는 두 파일을 <code>"rb"</code> 로 읽어 <code>==</code> 로 견줍니다.',
            starter: `import os

count = 0
with open("RAW/face_128.raw", "rb") as inFp :
    with open("face_copy.raw", "wb") as outFp :
        while True :
            data = inFp.read(1024)
            if not data :
                break
            # TODO: outFp 에 쓰고 count 늘리기

print("읽은 횟수 :", count)
print("원본 크기 :", os.path.getsize("RAW/face_128.raw"))
# TODO: 복사본 크기와 내용 비교 출력
`,
            solution: `import os

count = 0
with open("RAW/face_128.raw", "rb") as inFp :
    with open("face_copy.raw", "wb") as outFp :
        while True :
            data = inFp.read(1024)
            if not data :
                break
            outFp.write(data)
            count += 1

print("읽은 횟수 :", count)
print("원본 크기 :", os.path.getsize("RAW/face_128.raw"))
print("복사본 크기 :", os.path.getsize("face_copy.raw"))
with open("RAW/face_128.raw", "rb") as f1, open("face_copy.raw", "rb") as f2 :
    print("내용이 같은가? :", f1.read() == f2.read())
`,
            expect: `읽은 횟수 : 16
원본 크기 : 16384
복사본 크기 : 16384
내용이 같은가? : True`
          },
          {
            title: '실습 11-15. RAW 사진의 밝기 통계',
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
            title: '실습 11-16. 반전 영상(네거티브) 만들기',
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
            title: '실습 11-17. 반전 영상을 RAW 파일로 저장하기',
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
          { q: '<code>data = b"Py"</code> 일 때 <code>data[0]</code> 과 <code>data[0:1]</code> 의 자료형을 차례대로 고르면?', options: ['bytes, bytes', 'int, bytes', 'str, str', 'int, int'], answer: 1, explain: 'bytes 에 인덱스 하나를 쓰면 <b>정수</b>(0~255), 잘라내기(슬라이스)를 하면 <b>bytes</b> 가 나옵니다. 문자열과 다른 점입니다.' },
          { q: '이름이 <code>photo.png</code> 인데 앞 8바이트가 <code>b\'\\xff\\xd8\\xff\\xe0…\'</code> 였다면?', options: ['정상적인 PNG 그림이다', '실제로는 JPEG 사진이다', '깨진 파일이다', '빈 파일이다'], answer: 1, explain: '확장명은 이름일 뿐이고 <b>머리글(매직 넘버)</b> 이 진짜 종류를 알려 줍니다. <code>\\xff\\xd8\\xff</code> 는 JPEG 입니다.' }
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
          { layout: 'two', title: '📘 bytes 자세히 · 덩어리 복사', left: { title: 'bytes 의 성질', code: `data = b"Py\\x00\\xff"
print(data[0], type(data[0]))     # 정수
print(data[0:2], type(data[0:2])) # bytes
print(list(data))
print(bytes([72, 105, 33]))
ba = bytearray(data)              # 고칠 수 있음
ba[0] = 74
print(bytes(ba))` }, right: { title: '4096바이트씩 복사', code: `import os

count = 0
with open("RAW/tree.raw", "rb") as f1, open("c.raw", "wb") as f2 :
    while True :
        data = f1.read(4096)
        if not data :
            break
        f2.write(data)
        count += 1
print(count, os.path.getsize("c.raw"))` },
            notes: '<p><b>[4분]</b> 왼쪽: <code>data[0]</code> 은 정수인데 <code>data[0:2]</code> 는 bytes 라는 점이 헷갈리는 부분입니다. bytes 는 고칠 수 없어서 bytearray 를 씁니다. 오른쪽: 65,536 ÷ 4,096 = 16번이면 끝 — 1바이트씩(65,536번)과 비교시키세요. 텍스트의 “한 줄씩”에 해당하는 이진 버전입니다.</p>' },
          { layout: 'code', title: '📘 머리글(magic number)로 파일 종류 알아내기', code: `SIGNS = [(b"\\x89PNG", "PNG"), (b"GIF87a", "GIF"),
         (b"GIF89a", "GIF"), (b"\\xff\\xd8\\xff", "JPEG")]

for name in ["game/ship02.png", "GIF/dog.gif",
             "JPG/picture01.jpg", "RAW/tree.raw"] :
    with open(name, "rb") as inFp :
        head = inFp.read(8)
    kind = "알 수 없음"
    for sign, label in SIGNS :
        if head.startswith(sign) :
            kind = label
    print(name, head, kind)`, points: ['확장명은 이름일 뿐 — 머리글이 진짜 종류', 'PNG <code>\\x89PNG</code> · ZIP <code>PK\\x03\\x04</code> · PDF <code>%PDF</code>', 'RAW 는 머리글이 없어서 크기도 모름'],
            notes: '<p><b>[4분]</b> 발문: “<code>bad.exe</code> 의 이름을 <code>cat.png</code> 로 바꾸면 그림이 될까?” → 이름만 바뀔 뿐. 파일 업로드를 받는 서비스가 머리글을 확인하는 이유입니다. 시간이 되면 PNG 의 17~24번째 바이트로 가로 · 세로를 읽는 것(<code>int.from_bytes</code>)까지 보여 주세요.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>"#%02x%02x%02x" % (200, 200, 200)</code> 의 결과는?', options: ['"#200200200"', '"#c8c8c8"', '"#C8"', '"#0c80c80c8"'], answer: 1, explain: '200 = 16진수 c8',
            notes: '<p><b>[1분]</b></p>' },
          { layout: 'practice', title: '실습 11-15. RAW 사진의 밝기 통계', desc: 'RAW/tree.raw 의 최솟값 · 최댓값 · 평균 밝기 · 128 이상인 점의 개수 출력', starter: `fp = open("RAW/tree.raw", "rb")
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
        title: '파일 및 디렉터리 다루기 — os · shutil · zipfile · pathlib',
        minutes: 50,
        goals: [
          'shutil · os · os.path 모듈이 제공하는 기능을 dir() 로 살펴볼 수 있다',
          'shutil.copy() · copytree() 로 파일과 폴더를 복사할 수 있다',
          'os.mkdir() · shutil.rmtree() · os.remove() 로 폴더와 파일을 만들고 지울 수 있다',
          'os.walk() · os.path.exists() · getsize() 로 폴더와 파일 정보를 알아낼 수 있다',
          'zipfile 모듈로 파일을 압축하고 압축을 풀 수 있다',
          'pathlib 의 Path 객체로 경로 · 확장자 · 목록을 다루고 os.path 와 비교할 수 있다',
          'glob() · rglob() 으로 폴더 안의 파일을 찾아 일괄 처리할 수 있다'
        ],
        flow: [['모듈 살펴보기', 4], ['복사 · 폴더 생성 · 삭제', 10], ['목록 · 존재 확인 · 크기', 8], ['압축과 압축 풀기', 6], ['pathlib · 일괄 처리 · 임시 파일', 12], ['실습 · 퀴즈', 10]],
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
          { type: 'callout', kind: 'more', title: '📘 with 문과 shutil.make_archive()', html: '<p>ZipFile 도 <code>with zipfile.ZipFile(\'new.zip\', \'w\') as z :</code> 처럼 쓰면 자동으로 닫힙니다. 폴더 하나를 통째로 압축할 때는 <code>shutil.make_archive(\'raw_backup\', \'zip\', \'RAW\')</code> 한 줄이면 됩니다(→ raw_backup.zip).</p>' },

          { type: 'h', text: '한 걸음 더 — pathlib : 경로를 “객체”로 다루기' },
          { type: 'p', html: '지금까지 경로는 <b>문자열</b>이었고, 그 문자열을 <code>os.path</code> 의 함수들에 넣어 가공했습니다(<code>os.path.splitext(os.path.basename(name))</code> 처럼 함수가 겹쳐 읽기 어려웠지요). 파이썬 3.4 부터 들어온 <b><code>pathlib</code></b> 모듈은 경로를 <b><code>Path</code> 객체</b>로 만들어, 필요한 기능을 <b>속성과 메서드</b>로 꺼내 쓰게 해 줍니다. 요즘 새로 쓰는 코드는 대부분 <code>pathlib</code> 을 씁니다.' },
          { type: 'code', title: '추가 예제. Path 객체 한눈에 보기', code: `from pathlib import Path

p = Path("RAW/tree.raw")

print("전체 경로 :", p.as_posix())
print("폴더 :", p.parent.as_posix())
print("파일 이름 :", p.name)
print("확장자 뺀 이름 :", p.stem)
print("확장자 :", p.suffix)
print("있나요? :", p.exists(), "/ 파일인가요? :", p.is_file())
print("크기 :", p.stat().st_size, "바이트")
print("확장자 바꾸기 :", p.with_suffix(".bmp").as_posix())
print("경로 잇기 :", (Path("backup") / "2026" / p.name).as_posix())`, expect: `전체 경로 : RAW/tree.raw
폴더 : RAW
파일 이름 : tree.raw
확장자 뺀 이름 : tree
확장자 : .raw
있나요? : True / 파일인가요? : True
크기 : 65536 바이트
확장자 바꾸기 : RAW/tree.bmp
경로 잇기 : backup/2026/tree.raw`,
            desc: '<b><code>/</code> 연산자로 경로를 잇는 것</b>이 가장 눈에 띄는 특징입니다(<code>os.path.join()</code> 대신). <code>print(p)</code> 로 바로 출력하면 윈도에서는 <code>RAW\\tree.raw</code> 처럼 역슬래시로 보이기 때문에, 이 예제에서는 어디서나 같은 결과가 나오도록 <code>as_posix()</code> 로 <code>/</code> 형태를 출력했습니다.' },
          { type: 'table', head: ['하는 일', '<code>os</code> · <code>os.path</code> (문자열)', '<code>pathlib</code> (객체)'], rows: [
            ['경로 잇기', '<code>os.path.join(a, b)</code>', '<code>Path(a) / b</code>'],
            ['파일 이름 · 폴더', '<code>os.path.basename(p)</code> · <code>dirname(p)</code>', '<code>p.name</code> · <code>p.parent</code>'],
            ['이름 · 확장자', '<code>os.path.splitext(p)</code>', '<code>p.stem</code> · <code>p.suffix</code>'],
            ['확장자 바꾸기', '<code>os.path.splitext(p)[0] + ".bak"</code>', '<code>p.with_suffix(".bak")</code>'],
            ['있는지 · 파일 · 폴더', '<code>os.path.exists() · isfile() · isdir()</code>', '<code>p.exists() · p.is_file() · p.is_dir()</code>'],
            ['크기', '<code>os.path.getsize(p)</code>', '<code>p.stat().st_size</code>'],
            ['목록 · 찾기', '<code>os.listdir()</code> · <code>os.walk()</code>', '<code>p.iterdir()</code> · <code>p.glob("*.txt")</code> · <code>p.rglob()</code>'],
            ['폴더 만들기', '<code>os.makedirs(p, exist_ok=True)</code>', '<code>p.mkdir(parents=True, exist_ok=True)</code>'],
            ['읽기 · 쓰기', '<code>open(p).read()</code>', '<code>p.read_text()</code> · <code>p.write_text()</code>'],
            ['지우기', '<code>os.remove(p)</code>', '<code>p.unlink()</code>']
          ], caption: '같은 일을 하는 두 방법 — 복사 · 압축(shutil · zipfile)은 pathlib 에 없으므로 계속 씁니다' },
          { type: 'callout', kind: 'more', title: '📘 어느 쪽을 써야 할까?', html: '<p>둘 다 표준 라이브러리이고 섞어 써도 됩니다(대부분의 함수가 <code>Path</code> 객체를 그대로 받습니다). <b>새로 짜는 코드는 <code>pathlib</code></b> 이 읽기 쉽고 실수도 적습니다. 다만 오래된 예제 · 책 · 회사 코드에는 <code>os.path</code> 가 많으므로 <b>둘 다 읽을 줄 알아야</b> 합니다. 그래서 이 교시에서는 <code>os</code> 로 원리를 배우고 <code>pathlib</code> 로 다시 정리했습니다.</p>' },
          { type: 'code', title: '추가 예제. glob() 로 찾고 read_text() 로 바로 읽기', code: `from pathlib import Path

total = 0
for f in sorted(Path("RAW").glob("*.raw")) :      # RAW 폴더의 .raw 파일 모두
    print("%-12s %6d 바이트" % (f.name, f.stat().st_size))
    total += f.stat().st_size
print("합계 :", total, "바이트")

print("---")
Path("hello.txt").write_text("한 줄 쓰기\\n", encoding = "utf-8")
print(Path("hello.txt").read_text(encoding = "utf-8"), end = "")
print("data1.txt 의 행 수 :", len(Path("data1.txt").read_text(encoding = "utf-8").splitlines()))`, expect: `cat.raw       65536 바이트
cat_128.raw   16384 바이트
face.raw      65536 바이트
face_128.raw  16384 바이트
pattern.raw   65536 바이트
tree.raw      65536 바이트
합계 : 294912 바이트
---
한 줄 쓰기
data1.txt 의 행 수 : 3`,
            desc: '<code>glob("*.raw")</code> 의 <code>*</code> 는 “아무 글자나”라는 뜻입니다(<code>*.txt</code>, <code>data?.txt</code>, <code>**/*.py</code>). <code>read_text()</code> · <code>write_text()</code> 는 <b>작은 파일</b>을 열고 읽고 닫는 일을 한 줄로 해 줍니다(큰 파일은 여전히 <code>with open</code> 으로 한 줄씩).' },

          { type: 'h', text: '폴더 안을 모두 훑어 일괄 처리하기' },
          { type: 'p', html: '<code>rglob("*")</code> 는 하위 폴더까지 <b>모두</b> 찾습니다(<code>os.walk()</code> 의 pathlib 판). 확장자별로 파일이 몇 개인지 세어 봅시다.' },
          { type: 'code', title: '추가 예제. 확장자별 파일 개수 세기', code: `from pathlib import Path

for folder, names in [("proj", ["main.py", "notes.txt"]),
                      ("proj/data", ["a.csv", "b.csv", "photo.png"]),
                      ("proj/old", ["backup.txt"])] :                 # 연습용 폴더 만들기
    Path(folder).mkdir(parents = True, exist_ok = True)
    for n in names :
        Path(folder, n).write_text("샘플\\n", encoding = "utf-8")

counts = {}
for f in sorted(Path("proj").rglob("*")) :       # 하위 폴더까지 모두
    if f.is_file() :
        counts[f.suffix] = counts.get(f.suffix, 0) + 1

for ext in sorted(counts) :
    print("%s : %d개" % (ext, counts[ext]))`, expect: `.csv : 2개
.png : 1개
.py : 1개
.txt : 2개`,
            desc: '<code>counts.get(키, 0)</code> 은 “있으면 값, 없으면 0” 이라서 개수 세기에 자주 씁니다(8장 딕셔너리). 이런 코드가 <b>폴더 정리 도구</b>의 뼈대가 됩니다 — 프로젝트 11-2 에서 만들어 봅니다.' },

          { type: 'h', text: '임시 파일 — 잠깐 쓰고 버리는 파일' },
          { type: 'p', html: '중간 결과를 잠깐 저장할 때 <code>temp.txt</code> 같은 이름을 직접 쓰면, 같은 이름의 파일을 덮어쓰거나 프로그램 두 개가 동시에 실행될 때 서로 망가뜨릴 수 있습니다. <code>tempfile</code> 모듈은 <b>겹치지 않는 이름</b>의 임시 파일을 만들어 줍니다.' },
          { type: 'code', title: '추가 예제. tempfile 로 임시 파일 만들고 지우기', code: `import os
import tempfile

with tempfile.NamedTemporaryFile(mode = "w", suffix = ".txt", delete = False, encoding = "utf-8") as tmpFp :
    tmpFp.write("계산 중간 결과\\n")
    tmpName = tmpFp.name                       # 파이썬이 지어 준 이름

print("임시 파일이 생겼나요? :", os.path.exists(tmpName))
with open(tmpName, "r", encoding = "utf-8") as inFp :
    print("내용 :", inFp.read(), end = "")

os.remove(tmpName)
print("지운 뒤 :", os.path.exists(tmpName))`, expect: `임시 파일이 생겼나요? : True
내용 : 계산 중간 결과
지운 뒤 : False`,
            desc: '<code>delete = False</code> 는 “<code>with</code> 블록이 끝나도 지우지 말라”는 뜻입니다(기본값 <code>True</code> 면 닫는 순간 사라집니다). 파일 이름은 실행할 때마다 달라서 여기서는 출력하지 않았습니다.' },
          { type: 'callout', kind: 'more', title: '📘 안전하게 덮어쓰기 — 임시 파일 + os.replace()', html: '<p>큰 파일을 고쳐 쓰는 도중에 프로그램이 멈추면 원본도 새 내용도 아닌 <b>반쪽짜리 파일</b>이 남습니다. 그래서 실무에서는 이렇게 합니다.</p><ol><li>새 내용을 <b>임시 파일</b>에 모두 쓴다</li><li>다 썼으면 <code>os.replace(임시파일, 원본파일)</code> 로 <b>한 번에</b> 바꿔치기한다</li></ol><p><code>os.replace()</code> 는 운영체제가 “중간 상태 없이” 처리해 주므로, 실패하더라도 원본은 그대로 남습니다. 백업본(<code>shutil.copy</code>)까지 함께 만들어 두면 더 안전합니다.</p>' }
        ],
        practice: [
          {
            title: '실습 11-18. pathlib 로 파일 정보 보기',
            level: 1,
            desc: '<p><code>pathlib</code> 의 <code>Path</code> 를 써서 네 파일의 정보를 출력하세요. 파일이 없으면 <code>없는 파일</code> 이라고 알려 줍니다.</p><pre>win.ini : 이름=win 확장자=.ini 크기=85바이트\ndata1.txt : 이름=data1 확장자=.txt 크기=106바이트\nRAW/pattern.raw : 이름=pattern 확장자=.raw 크기=65536바이트\nnone.txt : 없는 파일</pre>',
            hint: '<code>p.exists()</code>, <code>p.stem</code>(확장자 뺀 이름), <code>p.suffix</code>(확장자), <code>p.stat().st_size</code>(크기). 경로를 출력할 때는 어디서나 같게 보이도록 <code>p.as_posix()</code> 를 씁니다.',
            starter: `from pathlib import Path

for name in ["win.ini", "data1.txt", "RAW/pattern.raw", "none.txt"] :
    p = Path(name)
    # TODO: 있으면 이름 · 확장자 · 크기, 없으면 "없는 파일" 출력
`,
            solution: `from pathlib import Path

for name in ["win.ini", "data1.txt", "RAW/pattern.raw", "none.txt"] :
    p = Path(name)
    if p.exists() :
        print("%s : 이름=%s 확장자=%s 크기=%d바이트" % (p.as_posix(), p.stem, p.suffix, p.stat().st_size))
    else :
        print("%s : 없는 파일" % p.as_posix())
`,
            expect: `win.ini : 이름=win 확장자=.ini 크기=85바이트
data1.txt : 이름=data1 확장자=.txt 크기=106바이트
RAW/pattern.raw : 이름=pattern 확장자=.raw 크기=65536바이트
none.txt : 없는 파일`
          },
          {
            title: '실습 11-19. glob() 으로 크기별 파일 나누기',
            level: 1,
            desc: '<p><code>Path("RAW").glob("*.raw")</code> 로 RAW 폴더의 모든 <code>.raw</code> 파일을 찾아, 크기가 <b>65536바이트인 것</b>(256×256)과 <b>그 밖의 것</b>으로 나누어 이름 목록을 출력하세요.</p><pre>256x256 (65536바이트) : [\'cat.raw\', \'face.raw\', \'pattern.raw\', \'tree.raw\']\n그 밖의 크기 : [\'cat_128.raw\', \'face_128.raw\']\n256x256 파일 수 : 4</pre>',
            hint: '<code>sorted(Path("RAW").glob("*.raw"))</code> 로 이름 순서로 돌면서 <code>f.stat().st_size == 65536</code> 인지 확인하고, 리스트 두 개에 <code>f.name</code> 을 <code>append()</code> 합니다.',
            starter: `from pathlib import Path

big, small = [], []
for f in sorted(Path("RAW").glob("*.raw")) :
    pass    # TODO: 크기에 따라 big 또는 small 에 f.name 추가

print("256x256 (65536바이트) :", big)
print("그 밖의 크기 :", small)
print("256x256 파일 수 :", len(big))
`,
            solution: `from pathlib import Path

big, small = [], []
for f in sorted(Path("RAW").glob("*.raw")) :
    if f.stat().st_size == 65536 :
        big.append(f.name)
    else :
        small.append(f.name)

print("256x256 (65536바이트) :", big)
print("그 밖의 크기 :", small)
print("256x256 파일 수 :", len(big))
`,
            expect: `256x256 (65536바이트) : ['cat.raw', 'face.raw', 'pattern.raw', 'tree.raw']
그 밖의 크기 : ['cat_128.raw', 'face_128.raw']
256x256 파일 수 : 4`
          },
          {
            title: '실습 11-20. 텍스트 파일 백업하기',
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
            title: '실습 11-21. RAW 폴더를 압축하기',
            level: 2,
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
          },
          {
            title: '실습 11-22. 여러 파일 이름을 한꺼번에 바꾸기',
            level: 2,
            desc: '<p><code>photos</code> 폴더를 만들고 연습용 사진 파일 세 개를 넣은 뒤, 이름 순서대로 <code>photo_001.jpg</code>, <code>photo_002.jpg</code>, <code>photo_003.jpg</code> 로 <b>한꺼번에 이름을 바꾸세요</b>. 바꾸는 과정과 정리 후 목록을 출력합니다.</p><pre>aaa.jpg → photo_001.jpg\nbbb.jpg → photo_002.jpg\nimg20260101.jpg → photo_003.jpg\n정리 후 : [\'photo_001.jpg\', \'photo_002.jpg\', \'photo_003.jpg\']</pre>',
            hint: '<code>enumerate(sorted(folder.glob("*.jpg")), 1)</code> 로 번호를 붙이고, 새 경로는 <code>folder / ("photo_%03d.jpg" % i)</code> 로 만든 뒤 <code>f.rename(새경로)</code> 를 부릅니다. <code>%03d</code> 는 세 자리로 맞추고 앞을 0 으로 채웁니다.',
            starter: `from pathlib import Path

folder = Path("photos")
folder.mkdir(exist_ok = True)
for n in ["img20260101.jpg", "bbb.jpg", "aaa.jpg"] :
    (folder / n).write_text("사진\\n", encoding = "utf-8")

# TODO: 이름 순서대로 photo_001.jpg … 로 바꾸기

print("정리 후 :", sorted(p.name for p in folder.iterdir()))
`,
            solution: `from pathlib import Path

folder = Path("photos")
folder.mkdir(exist_ok = True)
for n in ["img20260101.jpg", "bbb.jpg", "aaa.jpg"] :
    (folder / n).write_text("사진\\n", encoding = "utf-8")

for i, f in enumerate(sorted(folder.glob("*.jpg")), 1) :
    newPath = folder / ("photo_%03d.jpg" % i)
    print("%s → %s" % (f.name, newPath.name))
    f.rename(newPath)

print("정리 후 :", sorted(p.name for p in folder.iterdir()))
`,
            expect: `aaa.jpg → photo_001.jpg
bbb.jpg → photo_002.jpg
img20260101.jpg → photo_003.jpg
정리 후 : ['photo_001.jpg', 'photo_002.jpg', 'photo_003.jpg']`
          },
          {
            title: '🚀 프로젝트 11-2. 폴더 정리 도구',
            level: 3,
            desc: '<p>내려받기 폴더처럼 여러 종류의 파일이 뒤섞인 폴더를 <b>확장자에 따라 하위 폴더로 자동 분류</b>하는 도구를 만듭니다.</p><p><b>요구 사항</b></p><ol><li>연습용으로 <code>messy</code> 폴더를 만들고 파일 8개를 넣는다(뼈대 코드에 들어 있음).</li><li>분류 규칙은 딕셔너리로 정한다.<br><code>.txt · .md → 문서</code>, <code>.png · .gif → 그림</code>, <code>.csv · .json → 데이터</code>, <b>그 밖 → 기타</b></li><li>폴더 안의 <b>파일</b>만(폴더는 건너뛰고) 이름 순서로 돌면서, 종류에 맞는 하위 폴더를 만들고(<code>mkdir(exist_ok = True)</code>) 그 안으로 <b>옮긴다</b>(<code>shutil.move</code>).</li><li>옮길 때마다 <code>메모.txt → 문서/</code> 처럼 출력한다.</li><li>끝나면 종류별 개수를 이름 순서로 출력하고, 바깥에 남은 파일이 없는지 확인한다.</li></ol><pre>messy 폴더 정리를 시작합니다.\nicon.gif → 그림/\n…\n--- 결과 ---\n그림 : 2개\n기타 : 1개\n데이터 : 2개\n문서 : 3개\n남은 파일 : []</pre><p><b>확장 아이디어</b> — 여기까지 했다면 이렇게 더 해 보세요.</p><ul><li>옮기기 전에 “정말 옮길까요?(y/n)” 를 묻거나, 먼저 <b>미리 보기</b>만 하는 모드 만들기</li><li>같은 이름의 파일이 이미 있으면 <code>이름(1).txt</code> 처럼 번호를 붙이기</li><li>크기가 0 인 파일, 30일이 지난 파일만 <code>오래된 파일</code> 폴더로 따로 모으기 (<code>p.stat().st_mtime</code>)</li><li>정리 기록을 <code>정리.log</code> 에 <code>"a"</code> 모드로 남기기 · 결과를 <code>report.csv</code> 로 저장하기(11-7 교시)</li></ul>',
            hint: '<code>RULES.get(f.suffix, "기타")</code> 하나로 “규칙에 있으면 그 종류, 없으면 기타”가 해결됩니다. 옮기기는 <code>shutil.move(str(f), str(target / f.name))</code>. 개수 세기는 <code>counts[kind] = counts.get(kind, 0) + 1</code>.',
            starter: `import shutil
from pathlib import Path

RULES = {".txt": "문서", ".md": "문서", ".png": "그림", ".gif": "그림",
         ".csv": "데이터", ".json": "데이터"}

src = Path("messy")
src.mkdir(exist_ok = True)
for n in ["메모.txt", "보고서.md", "todo.txt", "logo.png", "icon.gif", "점수.csv", "설정.json", "install.exe"] :
    (src / n).write_text("샘플\\n", encoding = "utf-8")

print("%s 폴더 정리를 시작합니다." % src.name)
counts = {}
for f in sorted(src.iterdir()) :
    pass    # TODO: 파일이면 종류를 정하고, 하위 폴더를 만들어 옮기고, 개수 세기

print("--- 결과 ---")
# TODO: 종류별 개수 출력
print("남은 파일 :", [p.name for p in sorted(src.iterdir()) if p.is_file()])
`,
            solution: `import shutil
from pathlib import Path

RULES = {".txt": "문서", ".md": "문서", ".png": "그림", ".gif": "그림",
         ".csv": "데이터", ".json": "데이터"}

src = Path("messy")
src.mkdir(exist_ok = True)
for n in ["메모.txt", "보고서.md", "todo.txt", "logo.png", "icon.gif", "점수.csv", "설정.json", "install.exe"] :
    (src / n).write_text("샘플\\n", encoding = "utf-8")

print("%s 폴더 정리를 시작합니다." % src.name)
counts = {}
for f in sorted(src.iterdir()) :
    if not f.is_file() :
        continue
    kind = RULES.get(f.suffix, "기타")
    target = src / kind
    target.mkdir(exist_ok = True)
    shutil.move(str(f), str(target / f.name))
    print("%s → %s/" % (f.name, kind))
    counts[kind] = counts.get(kind, 0) + 1

print("--- 결과 ---")
for kind in sorted(counts) :
    print("%s : %d개" % (kind, counts[kind]))
print("남은 파일 :", [p.name for p in sorted(src.iterdir()) if p.is_file()])
`,
            expect: `messy 폴더 정리를 시작합니다.
icon.gif → 그림/
install.exe → 기타/
logo.png → 그림/
todo.txt → 문서/
메모.txt → 문서/
보고서.md → 문서/
설정.json → 데이터/
점수.csv → 데이터/
--- 결과 ---
그림 : 2개
기타 : 1개
데이터 : 2개
문서 : 3개
남은 파일 : []`
          }
        ],
        quiz: [
          { q: '파일 하나를 복사하는 함수는?', options: ['<code>os.copy()</code>', '<code>shutil.copy()</code>', '<code>os.path.copy()</code>', '<code>zipfile.copy()</code>'], answer: 1, explain: '파일 복사는 <code>shutil.copy()</code>, 폴더 통째 복사는 <code>shutil.copytree()</code> 입니다.' },
          { q: '<code>os.mkdir(\'a/b\')</code> 가 오류를 내는 경우는?', options: ['a 폴더가 이미 있을 때', 'a 폴더가 없을 때', 'b 가 파일 이름일 때', '항상 성공한다'], answer: 1, explain: '<code>os.mkdir()</code> 은 상위 폴더가 있어야 합니다. 한 번에 만들려면 <code>os.makedirs()</code> 를 씁니다.' },
          { q: '폴더를 안의 파일까지 모두 지우는 함수는?', options: ['<code>os.remove()</code>', '<code>os.rmdir()</code>', '<code>shutil.rmtree()</code>', '<code>os.path.delete()</code>'], answer: 2, explain: '<code>os.remove()</code> 는 파일 하나, <code>os.rmdir()</code> 은 빈 폴더만 지웁니다.' },
          { q: 'zipfile 로 실제로 크기를 줄여 압축하려면 write() 에 무엇을 지정해야 할까?', options: ['<code>mode = \'z\'</code>', '<code>compress_type = zipfile.ZIP_DEFLATED</code>', '<code>encoding = \'zip\'</code>', '아무것도 필요 없다'], answer: 1, explain: '기본값(ZIP_STORED)은 압축하지 않고 묶기만 합니다.' },
          { q: '<code>pathlib</code> 에서 <code>os.path.join("backup", "a.txt")</code> 에 해당하는 것은?', options: ['<code>Path("backup").join("a.txt")</code>', '<code>Path("backup") + "a.txt"</code>', '<code>Path("backup") / "a.txt"</code>', '<code>Path.join("backup", "a.txt")</code>'], answer: 2, explain: '<code>Path</code> 객체는 <code>/</code> 연산자로 경로를 잇습니다. 읽기 쉬운 것이 pathlib 의 큰 장점입니다.' },
          { q: '<code>Path("report.csv")</code> 에서 <code>.stem</code> 과 <code>.suffix</code> 의 값을 차례대로 고르면?', options: ['<code>\'report.csv\'</code>, <code>\'\'</code>', '<code>\'report\'</code>, <code>\'.csv\'</code>', '<code>\'report\'</code>, <code>\'csv\'</code>', '<code>\'.csv\'</code>, <code>\'report\'</code>'], answer: 1, explain: '<code>stem</code> 은 확장자를 뺀 이름, <code>suffix</code> 는 점을 포함한 확장자입니다.' }
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
          { layout: 'table', title: '📘 os.path vs pathlib — 같은 일, 다른 문법', head: ['하는 일', 'os · os.path (문자열)', 'pathlib (객체)'], rows: [
            ['경로 잇기', '<code>os.path.join(a, b)</code>', '<code>Path(a) / b</code>'],
            ['이름 · 확장자', '<code>os.path.splitext(p)</code>', '<code>p.stem</code> · <code>p.suffix</code>'],
            ['있는지 · 크기', '<code>os.path.exists()</code> · <code>getsize()</code>', '<code>p.exists()</code> · <code>p.stat().st_size</code>'],
            ['목록 · 찾기', '<code>os.listdir()</code> · <code>os.walk()</code>', '<code>p.glob("*.txt")</code> · <code>p.rglob("*")</code>'],
            ['읽기 · 쓰기', '<code>open(p).read()</code>', '<code>p.read_text()</code> · <code>p.write_text()</code>']],
            notes: '<p><b>[3분]</b> 새 코드는 pathlib 이 읽기 쉽지만, 오래된 책 · 회사 코드에는 os.path 가 많아 둘 다 읽을 줄 알아야 한다고 알려 줍니다. 복사 · 압축(shutil · zipfile)은 pathlib 에 없어서 계속 함께 씁니다.</p>' },
          { layout: 'code', title: '📘 pathlib — Path 객체', code: `from pathlib import Path

p = Path("RAW/tree.raw")
print(p.name, p.stem, p.suffix)
print(p.exists(), p.stat().st_size)
print(p.with_suffix(".bmp").as_posix())
print((Path("backup") / "2026" / p.name).as_posix())

for f in sorted(Path("RAW").glob("*.raw")) :
    print(f.name, f.stat().st_size)`, points: ['<code>/</code> 로 경로 잇기', '<code>glob("*.raw")</code> 로 골라 찾기', '<code>as_posix()</code> : 어디서나 <code>/</code> 로 보이게'],
            notes: '<p><b>[4분]</b> 함수 겹쳐 쓰기(<code>os.path.splitext(os.path.basename(x))</code>)와 비교해 보여 주면 pathlib 의 장점이 바로 느껴집니다. glob 의 <code>*</code> 는 “아무 글자나”라는 뜻입니다.</p>' },
          { layout: 'code', title: '📘 폴더 전체 훑기 — rglob 으로 확장자별 개수', code: `from pathlib import Path

for folder, names in [("proj", ["main.py", "notes.txt"]),
                      ("proj/data", ["a.csv", "b.csv"])] :
    Path(folder).mkdir(parents = True, exist_ok = True)
    for n in names :
        Path(folder, n).write_text("샘플\\n", encoding = "utf-8")

counts = {}
for f in sorted(Path("proj").rglob("*")) :
    if f.is_file() :
        counts[f.suffix] = counts.get(f.suffix, 0) + 1
for ext in sorted(counts) :
    print(ext, counts[ext])`, points: ['<code>rglob</code> : 하위 폴더까지 모두', '<code>counts.get(키, 0)</code> 으로 개수 세기', '폴더 정리 도구의 뼈대'],
            notes: '<p><b>[3분]</b> 발문: “내려받기 폴더에 파일이 500개 있다면?” → 이 코드로 몇 초면 분류됩니다. 바로 다음 프로젝트로 이어집니다.</p>' },
          { layout: 'practice', title: '🚀 프로젝트 11-2. 폴더 정리 도구', desc: '뒤섞인 폴더의 파일을 확장자에 따라 <code>문서 · 그림 · 데이터 · 기타</code> 하위 폴더로 자동 분류하고 결과를 보고', starter: `import shutil
from pathlib import Path

RULES = {".txt": "문서", ".png": "그림", ".csv": "데이터"}
src = Path("messy")
src.mkdir(exist_ok = True)
for n in ["a.txt", "b.png", "c.csv", "d.exe"] :
    (src / n).write_text("샘플\\n", encoding = "utf-8")

# TODO: 종류별 폴더로 옮기고 개수 세기
`, solution: `import shutil
from pathlib import Path

RULES = {".txt": "문서", ".png": "그림", ".csv": "데이터"}
src = Path("messy")
src.mkdir(exist_ok = True)
for n in ["a.txt", "b.png", "c.csv", "d.exe"] :
    (src / n).write_text("샘플\\n", encoding = "utf-8")

counts = {}
for f in sorted(src.iterdir()) :
    if not f.is_file() :
        continue
    kind = RULES.get(f.suffix, "기타")
    (src / kind).mkdir(exist_ok = True)
    shutil.move(str(f), str(src / kind / f.name))
    counts[kind] = counts.get(kind, 0) + 1
for kind in sorted(counts) :
    print(kind, counts[kind], "개")
`,
            notes: '<p><b>[10분~]</b> 핵심은 <code>RULES.get(f.suffix, "기타")</code> 한 줄 — “규칙에 있으면 그것, 없으면 기타”. 실제 내려받기 폴더에 돌리기 전에 <b>먼저 미리 보기만 하는 모드</b>를 만들라고 꼭 당부하세요(<code>shutil.move</code> 는 되돌릴 수 없습니다).</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '폴더를 안의 파일까지 모두 지우는 함수는?', options: ['os.remove()', 'os.rmdir()', 'shutil.rmtree()', 'os.path.delete()'], answer: 2, explain: 'remove 는 파일 하나, rmdir 은 빈 폴더만.',
            notes: '<p><b>[1분]</b></p>' },
          { layout: 'practice', title: '실습 11-20. 텍스트 파일 백업', desc: 'backup 폴더를 만들고 data1.txt · normal.txt 를 복사한 뒤, 폴더의 이름과 크기를 출력', starter: `import os
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
          { layout: 'summary', title: '정리', bullets: ['복사: <code>shutil.copy()</code> · <code>copytree()</code>', '폴더: <code>os.mkdir()</code> · <code>os.makedirs()</code> · <code>shutil.rmtree()</code>', '파일 삭제: <code>os.remove()</code> — 영구 삭제 주의', '정보: <code>os.listdir() · os.walk() · os.path.exists() · getsize()</code>', '압축: <code>zipfile.ZipFile</code> + <code>ZIP_DEFLATED</code>, <code>extractall()</code>', '📘 <code>pathlib</code>: <code>Path("a") / "b"</code> · <code>stem · suffix · glob · read_text</code>', '📘 임시 파일 <code>tempfile</code>, 안전한 덮어쓰기 <code>os.replace()</code>'],
            notes: '<p><b>[1분]</b> 다음 교시: 오류가 나도 프로그램이 멈추지 않게 하는 예외 처리.</p>' }
        ]
      },
      /* ================================================================
       * 11-6. 예외 처리 (Section 05 뒷부분)
       * ================================================================ */
      {
        id: 'ch11-6',
        title: '예외 처리 — try · except · else · finally · raise · logging',
        minutes: 50,
        goals: [
          '예외 처리의 필요성을 설명하고 try ~ except 문을 사용할 수 있다',
          '오류의 종류(ValueError, ZeroDivisionError, FileNotFoundError …)에 따라 다르게 처리할 수 있다',
          'else · finally 가 실행되는 시점을 설명할 수 있다',
          '파일 입출력 프로그램에 예외 처리를 적용할 수 있다',
          '구체적인 예외를 잡아야 하는 이유를 설명하고, raise 로 오류를 직접 일으킬 수 있다',
          'logging 으로 오류 기록을 파일에 남길 수 있다'
        ],
        flow: [['오류 상황 보기', 4], ['try ~ except 기본', 10], ['예외 종류별 처리', 10], ['else · finally', 6], ['예외 처리 전략 · raise · logging', 12], ['실습 · 퀴즈', 8]],
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
            desc: '<code>6행</code>의 <code>print()</code> 는 출력하기 전에 <code>lines[9]</code> 부터 계산하다가 오류가 나므로, “10번째 행 :” 도 출력되지 않고 곧바로 except 로 넘어갑니다. 오류가 났는데도 finally 에서 파일이 닫힌 것을 확인하세요.' },

          { type: 'h', text: '한 걸음 더 — 예외 처리 전략' },
          { type: 'p', html: '예외 처리는 “오류가 안 나게 하는 마법”이 아닙니다. <b>“이런 일이 생길 수 있다는 것을 알고 있고, 그때는 이렇게 하겠다”</b> 고 미리 적어 두는 일입니다. 그래서 잘못 쓰면 오히려 위험합니다. 아래 두 코드를 비교해 보세요.' },
          { type: 'code', title: '추가 예제. except : 하나로 다 잡으면 생기는 일', code: `with open("nums.txt", "w", encoding = "utf-8") as outFp :
    outFp.write("10\\n20\\n30\\n")

def total_bad(fname) :
    try :
        with open(fname, "r", encoding = "utf-8") as inFp :
            numbers = [int(line) for line in inFp]
        return sum(nubmers)                    # 오타! numbers 를 nubmers 로 씀
    except :
        return "파일을 읽을 수 없습니다"

def total_good(fname) :
    try :
        with open(fname, "r", encoding = "utf-8") as inFp :
            numbers = [int(line) for line in inFp]
    except FileNotFoundError :
        return "파일이 없습니다"
    except ValueError :
        return "숫자가 아닌 줄이 있습니다"
    return sum(numbers)

print("나쁜 예 :", total_bad("nums.txt"))
print("좋은 예 :", total_good("nums.txt"))
print("좋은 예 :", total_good("none.txt"))`, expect: `나쁜 예 : 파일을 읽을 수 없습니다
좋은 예 : 60
좋은 예 : 파일이 없습니다`,
            desc: '<code>total_bad()</code> 의 파일은 <b>멀쩡히 읽혔는데도</b> “파일을 읽을 수 없습니다” 가 나옵니다. 변수 이름 오타(<code>NameError</code>)까지 <code>except :</code> 가 삼켜 버렸기 때문입니다. 이런 버그는 찾기가 정말 어렵습니다. 반면 <code>total_good()</code> 은 <b>예상하는 오류만</b> 잡으므로, 오타가 있었다면 그대로 <code>NameError</code> 가 나서 바로 고칠 수 있습니다.' },
          { type: 'table', head: ['원칙', '이유'], rows: [
            ['<b>잡을 예외를 구체적으로 적는다</b><br><code>except FileNotFoundError :</code>', '예상하지 못한 버그까지 숨기지 않으려고'],
            ['<b><code>try</code> 블록은 짧게</b><br>오류가 날 수 있는 줄만 감싼다', '어느 줄에서 난 오류인지 분명해지게'],
            ['<b>사용자에게는 할 일을 알려 준다</b><br>“파일 이름을 확인해 주세요”', '<code>[Errno 2] No such file…</code> 는 사용자에게 의미가 없음'],
            ['<b>개발자에게는 자세히 남긴다</b><br>로그(log) 파일에 기록', '나중에 원인을 찾을 수 있게'],
            ['<b>처리할 수 없으면 잡지 않는다</b>', '어설프게 잡아 넘기면 더 큰 사고가 남']
          ], caption: '예외 처리의 다섯 가지 원칙' },
          { type: 'callout', kind: 'more', title: '📘 LBYL 과 EAFP — 파이썬이 좋아하는 방식', html: '<p>오류를 다루는 방법은 크게 두 가지입니다.</p><ul><li><b>LBYL</b>(Look Before You Leap, 뛰기 전에 살펴보라) — <code>if os.path.exists(f) :</code> 처럼 <b>미리 확인</b>합니다. 11-2 교시의 방식입니다.</li><li><b>EAFP</b>(Easier to Ask Forgiveness than Permission, 허락보다 용서가 쉽다) — <b>일단 해 보고</b> 오류가 나면 <code>except</code> 로 처리합니다.</li></ul><p>파이썬 사용자들은 보통 <b>EAFP</b> 를 선호합니다. ① 확인한 뒤 실제로 여는 사이에 파일이 지워질 수도 있고(확인이 소용없음), ② 정상적인 경우에 <code>if</code> 검사를 매번 하지 않아 빠르며, ③ 코드의 주 흐름이 <code>try</code> 안에 모여 읽기 좋기 때문입니다. 물론 사용자 입력처럼 <b>틀릴 것이 뻔한</b> 경우에는 미리 확인하는 편이 더 친절합니다.</p>' },

          { type: 'h', text: '오류를 직접 일으키기 — raise' },
          { type: 'p', html: '내가 만든 함수가 <b>말이 안 되는 값</b>을 받았을 때, 조용히 잘못된 결과를 돌려주는 것보다 <b>오류를 내는 것</b>이 낫습니다. <code>raise 예외종류("설명")</code> 로 직접 예외를 일으킬 수 있습니다.' },
          { type: 'code', title: '추가 예제. raise 로 잘못된 값 막기', code: `def read_age(text) :
    age = int(text)                                    # 숫자가 아니면 ValueError
    if age < 0 or age > 150 :
        raise ValueError("나이는 0~150 사이여야 합니다 : %d" % age)
    return age

for text in ["20", "200", "스무살"] :
    try :
        print("%s → %d살" % (text, read_age(text)))
    except ValueError as e :
        print("%s → 입력이 잘못되었습니다 : %s" % (text, e))`, expect: `20 → 20살
200 → 입력이 잘못되었습니다 : 나이는 0~150 사이여야 합니다 : 200
스무살 → 입력이 잘못되었습니다 : invalid literal for int() with base 10: '스무살'`,
            desc: '<code>int()</code> 가 스스로 내는 <code>ValueError</code> 와 내가 <code>raise</code> 한 <code>ValueError</code> 를 <b>한 곳에서</b> 처리했습니다. “값이 잘못되었다”는 뜻이 같으므로 같은 예외를 쓰는 것이 자연스럽습니다. <b>함수는 검사하고 알리기만 하고, 어떻게 할지는 부르는 쪽이 정한다</b> — 이것이 예외의 큰 장점입니다.' },

          { type: 'h', text: '기록 남기기 맛보기 — logging' },
          { type: 'p', html: '오류가 났을 때 <code>print()</code> 로 화면에 찍으면 프로그램을 끄는 순간 사라집니다. <b><code>logging</code></b> 모듈을 쓰면 시간 · 수준(level)과 함께 <b>파일에 기록</b>할 수 있어서, 나중에 “무슨 일이 있었는지” 를 되짚을 수 있습니다. 11장 앞부분에서 본 <code>server.log</code> 같은 파일이 이렇게 만들어집니다.' },
          { type: 'code', title: '추가 예제. logging 으로 오류를 파일에 남기기', code: `import logging

logging.basicConfig(filename = "app.log", level = logging.INFO,
                    format = "%(levelname)s %(message)s", encoding = "utf-8")

def divide(a, b) :
    try :
        return a / b
    except ZeroDivisionError :
        logging.error("0으로 나누기 시도 : %s / %s", a, b)
        return None

print("10 / 2 =", divide(10, 2))
print("10 / 0 =", divide(10, 0))
logging.info("계산을 끝냈습니다")

print("--- app.log ---")
with open("app.log", "r", encoding = "utf-8") as inFp :
    print(inFp.read(), end = "")`, expect: `10 / 2 = 5.0
10 / 0 = None
--- app.log ---
ERROR 0으로 나누기 시도 : 10 / 0
INFO 계산을 끝냈습니다`,
            desc: '<code>basicConfig()</code> 로 <b>어디에</b>(<code>filename</code>), <b>어느 정도까지</b>(<code>level</code>), <b>어떤 모양으로</b>(<code>format</code>) 남길지 한 번 정해 둡니다. 수준은 <code>DEBUG &lt; INFO &lt; WARNING &lt; ERROR &lt; CRITICAL</code> 순서이고, 정한 수준보다 낮은 것은 기록되지 않습니다. <code>format</code> 에 <code>%(asctime)s</code> 를 넣으면 시간도 함께 남습니다.' },
          { type: 'callout', kind: 'more', title: '📘 print 대신 logging 을 쓰는 이유', html: '<ul><li>기록이 <b>파일로 남아서</b> 나중에 볼 수 있다 (<code>"a"</code> 모드로 계속 쌓임)</li><li>수준을 한 줄 바꿔 <b>자세한 기록을 켜고 끌</b> 수 있다 (개발할 때 DEBUG, 배포할 때 WARNING)</li><li>시간 · 파일 이름 · 줄 번호를 <b>자동으로</b> 붙일 수 있다</li><li>여러 파일로 나누기, 용량이 차면 새 파일로 바꾸기 등도 설정만으로 된다</li></ul><p>혼자 연습할 때는 <code>print()</code> 로 충분하지만, 남이 쓰는 프로그램을 만든다면 <code>logging</code> 을 쓰세요.</p>' }
        ],
        practice: [
          {
            title: '실습 11-23. 오류 종류별로 다르게 처리하기',
            level: 1,
            desc: '<p>문자열 쌍 목록 <code>[("10","2"), ("7","0"), ("8","이"), ("9","3")]</code> 을 차례로 나누어 출력하세요. <code>0</code> 으로 나누거나 숫자가 아니면 프로그램이 멈추지 않고 안내 메시지를 출력하고 다음으로 넘어가야 합니다.</p><pre>10 / 2 = 5.00\n7 / 0 → 0으로 나눌 수 없습니다\n8 / 이 → 숫자가 아닙니다\n9 / 3 = 3.00</pre>',
            hint: '<code>try :</code> 안에서 <code>int(a) / int(b)</code> 를 계산하고, <code>except ZeroDivisionError :</code> 와 <code>except ValueError :</code> 를 따로 씁니다. 몫은 <code>%.2f</code> 로 출력합니다.',
            starter: `values = [("10", "2"), ("7", "0"), ("8", "이"), ("9", "3")]

for a, b in values :
    # TODO: try ~ except ZeroDivisionError ~ except ValueError
    print("%s / %s = %.2f" % (a, b, int(a) / int(b)))
`,
            solution: `values = [("10", "2"), ("7", "0"), ("8", "이"), ("9", "3")]

for a, b in values :
    try :
        print("%s / %s = %.2f" % (a, b, int(a) / int(b)))
    except ZeroDivisionError :
        print("%s / %s → 0으로 나눌 수 없습니다" % (a, b))
    except ValueError :
        print("%s / %s → 숫자가 아닙니다" % (a, b))
`,
            expect: `10 / 2 = 5.00
7 / 0 → 0으로 나눌 수 없습니다
8 / 이 → 숫자가 아닙니다
9 / 3 = 3.00`
          },
          {
            title: '실습 11-24. 올바른 정수를 입력할 때까지 다시 묻기',
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
            title: '실습 11-25. raise 로 점수 검사하기',
            level: 2,
            desc: '<p>문자열을 받아 점수(0~100 사이의 정수)로 바꿔 주는 함수 <code>check_score(text)</code> 를 만드세요. 범위를 벗어나면 <code>raise ValueError("점수는 0~100 사이여야 합니다 : N")</code> 으로 오류를 냅니다. 그다음 <code>["90", "120", "영점", "0"]</code> 을 차례로 넣어 보고, 올바른 점수가 몇 개였는지 출력하세요.</p><pre>90 → 90점\n120 → 잘못된 입력 : 점수는 0~100 사이여야 합니다 : 120\n영점 → 잘못된 입력 : invalid literal for int() with base 10: \'영점\'\n0 → 0점\n올바른 점수 : 2 개</pre>',
            hint: '<code>int(text)</code> 가 스스로 내는 <code>ValueError</code> 와 내가 <code>raise</code> 한 <code>ValueError</code> 를 <code>except ValueError as e :</code> 한 곳에서 잡습니다. 오류가 없을 때만 세려면 <code>else :</code> 블록이 편리합니다.',
            starter: `def check_score(text) :
    score = int(text)
    # TODO: 0~100 을 벗어나면 raise ValueError(...)
    return score

ok = 0
for text in ["90", "120", "영점", "0"] :
    # TODO: try ~ except ValueError as e ~ else
    print("%s → %d점" % (text, check_score(text)))

print("올바른 점수 :", ok, "개")
`,
            solution: `def check_score(text) :
    score = int(text)
    if score < 0 or score > 100 :
        raise ValueError("점수는 0~100 사이여야 합니다 : %d" % score)
    return score

ok = 0
for text in ["90", "120", "영점", "0"] :
    try :
        score = check_score(text)
    except ValueError as e :
        print("%s → 잘못된 입력 : %s" % (text, e))
    else :
        print("%s → %d점" % (text, score))
        ok += 1

print("올바른 점수 :", ok, "개")
`,
            expect: `90 → 90점
120 → 잘못된 입력 : 점수는 0~100 사이여야 합니다 : 120
영점 → 잘못된 입력 : invalid literal for int() with base 10: '영점'
0 → 0점
올바른 점수 : 2 개`
          },
          {
            title: '실습 11-26. 여러 파일의 행 수 세기',
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
          },
          {
            title: '🚀 프로젝트 11-3. 로그 파일 분석기',
            level: 3,
            desc: '<p>서버가 남긴 기록 파일 <code>server.log</code>(작업 폴더에 있음)를 읽어 <b>무슨 일이 있었는지 요약</b>해 주는 프로그램을 만듭니다. 로그 한 줄의 모양은 다음과 같습니다.</p><pre>2026-03-02 09:15:22 ERROR 파일을 찾을 수 없음: photo.png\n날짜(10) 시간(8) 수준 메시지</pre><p><b>요구 사항</b></p><ol><li>파일을 <b>한 줄씩</b> 읽는다(<code>readlines()</code> 금지 — 로그는 클 수 있다). 빈 줄은 건너뛴다.</li><li><code>line.split(" ", 3)</code> 으로 날짜 · 시간 · 수준 · 메시지 네 조각으로 나눈다.</li><li>수준별 건수를 딕셔너리로 센다.</li><li>ERROR 인 줄은 <code>시간 메시지</code> 형태로 따로 모은다.</li><li>결과를 아래 모양으로 <b>화면에 출력</b>하고, <b>같은 내용을 <code>report.txt</code> 에 저장</b>한다.</li><li>파일이 없을 때는 <code>server.log 파일이 없습니다.</code> 만 출력하고 조용히 끝난다(<code>try ~ except FileNotFoundError</code>).</li></ol><pre>--- server.log 분석 ---\n전체 줄 수 : 20\n처음 기록 : 2026-03-02 09:12:03\n마지막 기록 : 2026-03-02 09:35:10\n[수준별 건수]\nERROR : 4건\nINFO : 12건\nWARNING : 4건\n[ERROR 메시지]\n09:15:22 파일을 찾을 수 없음: photo.png\n…\n오류 비율 : 20.0%\nreport.txt 에 저장했습니다.</pre><p><b>확장 아이디어</b> — 여기까지 했다면 이렇게 더 해 보세요.</p><ul><li>시간대(<code>09시</code>)별 건수 세기 — <code>time.split(":")[0]</code></li><li>가장 자주 나온 오류 메시지 세 개 뽑기 (<code>collections.Counter</code> 의 <code>most_common(3)</code>)</li><li>수준을 입력받아 그 수준만 보여 주기, 또는 <code>report.csv</code> 로 저장하기(11-7 교시)</li><li>직접 만든 <code>logging</code> 기록 파일(<code>app.log</code>)도 같은 방법으로 분석해 보기</li></ul>',
            hint: '<code>counts[level] = counts.get(level, 0) + 1</code> 로 셉니다. 출력과 파일 저장을 <b>두 번 쓰지 않으려면</b>, 결과 줄들을 리스트 <code>report</code> 에 모아 두었다가 한 번은 <code>print</code>, 한 번은 <code>write</code> 하면 됩니다. 비율은 <code>"%.1f%%" % (…)</code> — <code>%%</code> 가 퍼센트 기호입니다.',
            starter: `FNAME = "server.log"

counts = {}
errors = []
lines = []

try :
    with open(FNAME, "r", encoding = "utf-8") as inFp :
        for line in inFp :
            line = line.strip()
            if line == "" :
                continue
            lines.append(line)
            # TODO: 네 조각으로 나누고 수준별로 세기, ERROR 는 errors 에 모으기
except FileNotFoundError :
    print("%s 파일이 없습니다." % FNAME)
    lines = []

if lines :
    report = []
    report.append("--- %s 분석 ---" % FNAME)
    # TODO: 줄 수 · 처음/마지막 기록 · 수준별 건수 · ERROR 목록 · 오류 비율을 report 에 넣기

    for line in report :
        print(line)
    # TODO: report 를 report.txt 에 저장하고 안내 출력
`,
            solution: `FNAME = "server.log"

counts = {}
errors = []
lines = []

try :
    with open(FNAME, "r", encoding = "utf-8") as inFp :
        for line in inFp :
            line = line.strip()
            if line == "" :
                continue
            lines.append(line)
            date, time, level, message = line.split(" ", 3)
            counts[level] = counts.get(level, 0) + 1
            if level == "ERROR" :
                errors.append("%s %s" % (time, message))
except FileNotFoundError :
    print("%s 파일이 없습니다." % FNAME)
    lines = []

if lines :
    report = []
    report.append("--- %s 분석 ---" % FNAME)
    report.append("전체 줄 수 : %d" % len(lines))
    report.append("처음 기록 : %s" % " ".join(lines[0].split(" ", 2)[:2]))
    report.append("마지막 기록 : %s" % " ".join(lines[-1].split(" ", 2)[:2]))
    report.append("[수준별 건수]")
    for level in sorted(counts) :
        report.append("%s : %d건" % (level, counts[level]))
    report.append("[ERROR 메시지]")
    for e in errors :
        report.append(e)
    report.append("오류 비율 : %.1f%%" % (len(errors) / len(lines) * 100))

    for line in report :
        print(line)

    with open("report.txt", "w", encoding = "utf-8") as outFp :
        for line in report :
            outFp.write(line + "\\n")
    print("report.txt 에 저장했습니다.")
`,
            expect: `--- server.log 분석 ---
전체 줄 수 : 20
처음 기록 : 2026-03-02 09:12:03
마지막 기록 : 2026-03-02 09:35:10
[수준별 건수]
ERROR : 4건
INFO : 12건
WARNING : 4건
[ERROR 메시지]
09:15:22 파일을 찾을 수 없음: photo.png
09:19:07 데이터베이스 연결 실패
09:25:02 파일을 찾을 수 없음: old.zip
09:31:27 시간 초과: 외부 API
오류 비율 : 20.0%
report.txt 에 저장했습니다.`
          }
        ],
        quiz: [
          { q: '다음 코드의 실행 결과는?<pre><code>try :\n    print(int("12a"))\nexcept ValueError :\n    print("A")\nexcept ZeroDivisionError :\n    print("B")</code></pre>', options: ['12', 'A', 'B', '오류로 멈춘다'], answer: 1, explain: '<code>int("12a")</code> 는 ValueError 이므로 A 가 출력됩니다.' },
          { q: '<code>finally</code> 블록이 실행되는 경우는?', options: ['오류가 났을 때만', '오류가 없을 때만', '오류가 나든 안 나든 항상', 'else 가 실행되지 않을 때만'], answer: 2, explain: 'finally 는 무조건 실행됩니다. 파일 닫기 같은 뒷정리에 씁니다.' },
          { q: '다음 코드의 출력 순서로 알맞은 것은?<pre><code>try :\n    x = 10 / 2\nexcept :\n    print("E")\nelse :\n    print("L")\nfinally :\n    print("F")</code></pre>', options: ['E F', 'L F', 'L', 'E L F'], answer: 1, explain: '오류가 없으므로 else(L) 다음 finally(F) 가 실행됩니다.' },
          { q: '<code>["a", "b"][5]</code> 를 실행할 때 나는 예외는?', options: ['KeyError', 'IndexError', 'ValueError', 'TypeError'], answer: 1, explain: '리스트의 인덱스 범위를 벗어나면 IndexError 입니다.' },
          { q: '다음 코드가 <code>nums.txt</code> 가 멀쩡한데도 “읽을 수 없습니다” 를 출력하는 이유는?<pre><code>try :\n    with open("nums.txt") as f :\n        numbers = [int(x) for x in f]\n    print(sum(nubmers))\nexcept :\n    print("읽을 수 없습니다")</code></pre>', options: ['파일이 실제로 없어서', '<code>except :</code> 가 변수 이름 오타(NameError)까지 잡아서', 'int() 가 실패해서', 'with 문을 썼기 때문에'], answer: 1, explain: '<code>nubmers</code> 는 오타라 <code>NameError</code> 가 나는데, 모든 예외를 잡는 <code>except :</code> 가 그것까지 삼켰습니다. <b>예상하는 예외만 구체적으로 잡아야</b> 버그가 숨지 않습니다.' },
          { q: '내가 만든 함수에서 잘못된 값을 받았을 때 직접 오류를 내는 방법은?', options: ['<code>return Error</code>', '<code>raise ValueError("설명")</code>', '<code>except ValueError</code>', '<code>print("오류")</code>'], answer: 1, explain: '<code>raise</code> 로 예외를 일으키면, 어떻게 처리할지는 함수를 <b>부르는 쪽</b>이 정할 수 있습니다.' }
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
          { layout: 'code', title: '📘 except : 하나로 다 잡으면 — 버그가 숨는다', code: `with open("nums.txt", "w") as f :
    f.write("10\\n20\\n30\\n")

def total_bad(fname) :
    try :
        with open(fname) as f :
            numbers = [int(x) for x in f]
        return sum(nubmers)        # 오타!
    except :
        return "파일을 읽을 수 없습니다"

print(total_bad("nums.txt"))       # 파일은 멀쩡한데?`, points: ['<code>NameError</code>(오타)까지 삼켜 버림', '원인을 찾기 아주 어려운 버그', '<b>예상하는 예외만</b> 구체적으로 잡기'],
            notes: '<p><b>[4분]</b> 실행해서 “파일을 읽을 수 없습니다” 가 나오는 것을 먼저 보여 주고, 발문: “파일은 방금 만들었는데 왜?” 한참 찾게 두었다가 <code>except :</code> 를 <code>except FileNotFoundError :</code> 로 바꿔 실행하면 NameError 가 드러납니다. 강렬한 교훈이 됩니다.</p>' },
          { layout: 'table', title: '📘 예외 처리의 원칙', head: ['원칙', '이유'], rows: [
            ['잡을 예외를 구체적으로 적는다', '예상 못 한 버그를 숨기지 않으려고'],
            ['<code>try</code> 블록은 짧게', '어느 줄의 오류인지 분명해지게'],
            ['사용자에게는 <b>할 일</b>을 알려 준다', '<code>[Errno 2]</code> 는 사용자에게 의미 없음'],
            ['개발자에게는 <b>로그</b>로 남긴다', '나중에 원인을 찾을 수 있게'],
            ['처리할 수 없으면 잡지 않는다', '어설픈 처리가 더 큰 사고를 만듦']],
            lead: 'LBYL(미리 확인) vs EAFP(일단 하고 용서 구하기) — 파이썬은 EAFP 를 좋아합니다',
            notes: '<p><b>[3분]</b> EAFP 를 선호하는 이유 세 가지: ① 확인과 실행 사이에 상황이 바뀔 수 있다 ② 정상일 때 검사 비용이 없다 ③ 주 흐름이 try 안에 모여 읽기 좋다. 다만 사용자 입력처럼 틀릴 것이 뻔하면 미리 확인이 더 친절하다고 덧붙이세요.</p>' },
          { layout: 'two', title: '📘 raise 로 오류 내기 · logging 으로 남기기', left: { title: 'raise', code: `def read_age(text) :
    age = int(text)
    if age < 0 or age > 150 :
        raise ValueError("나이는 0~150 : %d" % age)
    return age

for t in ["20", "200", "스무살"] :
    try :
        print(t, read_age(t))
    except ValueError as e :
        print(t, "→", e)` }, right: { title: 'logging', code: `import logging

logging.basicConfig(filename = "app.log",
    level = logging.INFO,
    format = "%(levelname)s %(message)s",
    encoding = "utf-8")

try :
    10 / 0
except ZeroDivisionError :
    logging.error("0으로 나누기")

print(open("app.log", encoding="utf-8").read())` },
            notes: '<p><b>[5분]</b> 왼쪽: 함수는 “검사하고 알리기”만 하고, 어떻게 할지는 부르는 쪽이 정한다 — 예외의 핵심 장점입니다. 오른쪽: print 는 끄면 사라지지만 log 는 파일에 남습니다. 수준 DEBUG &lt; INFO &lt; WARNING &lt; ERROR &lt; CRITICAL 을 소개하세요.</p>' },
          { layout: 'practice', title: '🚀 프로젝트 11-3. 로그 파일 분석기', desc: '<code>server.log</code> 를 한 줄씩 읽어 수준별 건수 · ERROR 목록 · 오류 비율을 요약하고 <code>report.txt</code> 로 저장', starter: `counts = {}
with open("server.log", "r", encoding = "utf-8") as inFp :
    for line in inFp :
        pass    # TODO: split(" ", 3) 으로 나누고 수준별로 세기
`, solution: `counts, errors, n = {}, [], 0
with open("server.log", "r", encoding = "utf-8") as inFp :
    for line in inFp :
        line = line.strip()
        if line == "" :
            continue
        n += 1
        date, time, level, message = line.split(" ", 3)
        counts[level] = counts.get(level, 0) + 1
        if level == "ERROR" :
            errors.append("%s %s" % (time, message))

print("전체 줄 수 :", n)
for level in sorted(counts) :
    print("%s : %d건" % (level, counts[level]))
for e in errors :
    print(e)
print("오류 비율 : %.1f%%" % (len(errors) / n * 100))
`,
            notes: '<p><b>[10분~]</b> 실제 서버 운영에서 가장 많이 하는 일이 로그 분석이라고 알려 주세요. 핵심 두 가지: ① 로그는 크니까 <b>한 줄씩</b> ② <code>split(" ", 3)</code> 의 3 은 “세 번만 자르라” — 메시지 안의 공백이 살아남습니다. 발문: “maxsplit 을 안 주면 무슨 일이 생길까?”</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '오류가 없을 때 <code>try → ? → ?</code> 의 실행 순서는?', options: ['except → finally', 'else → finally', 'finally → else', 'else 만'], answer: 1, explain: '오류가 없으면 else, 그리고 항상 finally.',
            notes: '<p><b>[1분]</b></p>' },
          { layout: 'practice', title: '실습 11-24. 올바른 정수를 입력할 때까지', desc: '정수가 아니면 “숫자로 입력하세요.” 를 출력하고 다시 입력받기', stdin: '열다섯\n15.5\n15\n', starter: `while True :
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
            notes: '<p><b>[4분]</b> 입력 검사에 가장 많이 쓰는 패턴입니다. 빠른 학생은 실습 11-26.</p>' },
          { layout: 'summary', title: '정리', bullets: ['<code>try · except · else · finally</code> — 오류가 나도 멈추지 않는 프로그램', '예외 종류를 <b>구체적으로</b> 적는다 (<code>except :</code> 는 버그를 숨긴다)', '<code>raise ValueError("설명")</code> — 함수는 알리고, 부르는 쪽이 결정', '사용자에게는 할 일을, 개발자에게는 <code>logging</code> 으로 기록을', '파일은 <code>finally : close()</code> 또는 <code>with</code> 로 반드시 닫기'],
            notes: '<p><b>[2분]</b> 다음 교시 예고: 지금까지는 <code>"이름,점수"</code> 를 직접 자르고 붙였는데, 이런 일을 정확하게 해 주는 표준 형식(csv · json)을 배웁니다.</p>' }
        ]
      },
      /* ================================================================
       * 11-7. 데이터 저장 형식 — csv · json (강의자료에 없는 보충 교시)
       * ================================================================ */
      {
        id: 'ch11-7',
        title: '데이터 저장 형식 고르기 — csv · json',
        minutes: 50,
        goals: [
          '텍스트 · CSV · JSON 의 차이를 알고 상황에 맞는 저장 형식을 고를 수 있다',
          'csv 모듈의 reader · DictReader · writer · DictWriter 로 표 데이터를 읽고 쓸 수 있다',
          '값 안에 쉼표가 있을 때 split() 이 왜 위험한지 설명할 수 있다',
          'json 모듈의 load · dump 로 딕셔너리 · 리스트를 그대로 저장하고 읽을 수 있다',
          '한글이 깨지지 않게 ensure_ascii = False 와 encoding 을 지정할 수 있다'
        ],
        flow: [['왜 형식이 필요한가', 5], ['csv 읽기 — reader · DictReader', 12], ['csv 쓰기 · 따옴표 규칙', 10], ['json 읽기 · 쓰기', 12], ['형식 고르기 · 실습 · 퀴즈', 11]],
        content: [
          { type: 'h', text: '왜 “형식”이 필요할까?' },
          { type: 'p', html: '11-2 교시에서 성적을 <code>홍길동,90</code> 처럼 저장하고 <code>line.strip().split(",")</code> 로 읽었습니다. 잘 동작했지요. 그런데 이름이 <code>"홍길동, 2학년"</code> 이라면 어떻게 될까요? 쉼표가 <b>데이터의 일부</b>인지 <b>칸을 나누는 기호</b>인지 구분할 수 없어서 프로그램이 엉뚱하게 동작합니다.' },
          { type: 'p', html: '이런 문제를 <b>모두가 같은 방식으로</b> 풀어 두면, 다른 프로그램(엑셀 · 웹 서비스)과도 데이터를 주고받을 수 있습니다. 그렇게 정해 둔 약속이 <b>데이터 형식(format)</b> 입니다. 가장 많이 쓰는 두 가지가 <b>CSV</b> 와 <b>JSON</b> 이고, 파이썬은 둘 다 표준 라이브러리로 지원합니다.' },
          { type: 'figure', html: SVG(1280, 420, '텍스트 · CSV · JSON 의 구조 비교',
            BOX(215, 50, 380, 60, '📄 그냥 텍스트 (.txt)', { stroke: 'var(--muted)', bold: true, size: 22 }) +
            BOX(640, 50, 380, 60, '📊 CSV (.csv)', { stroke: 'var(--ok)', bold: true, size: 22 }) +
            BOX(1065, 50, 380, 60, '🧩 JSON (.json)', { stroke: 'var(--accent)', bold: true, size: 22 }) +
            BOX(215, 175, 380, 130, '홍길동 90점|이순신 75점|(내 맘대로 — 내가 자름)', { stroke: 'var(--line)', mono: true, size: 19, sw: 2 }) +
            BOX(640, 175, 380, 130, '이름,국어,영어|홍길동,90,85|(표 한 장 — 엑셀도 읽음)', { stroke: 'var(--line)', mono: true, size: 19, sw: 2 }) +
            BOX(1065, 175, 380, 130, '{"이름": "홍길동",| "점수": [90, 85]}|(중첩 구조 그대로)', { stroke: 'var(--line)', mono: true, size: 19, sw: 2 }) +
            T(215, 290, '사람이 읽기 쉬움', { size: 20, fill: 'var(--muted)' }) +
            T(640, 290, '표 모양 데이터에 딱', { size: 20, fill: 'var(--ok)' }) +
            T(1065, 290, '설정 · 중첩 데이터에 딱', { size: 20, fill: 'var(--accent)' }) +
            T(640, 355, '기록(로그) · 메모 → txt    ·    표 · 성적 · 가계부 → csv    ·    설정 · 계층 구조 → json', { size: 21, bold: true }) +
            T(640, 395, '셋 다 “글자로 된 텍스트 파일” 입니다 — 메모장으로 열어 볼 수 있습니다', { size: 19, fill: 'var(--muted)' })), caption: '같은 데이터라도 담는 그릇이 다르면 다룰 수 있는 일이 달라집니다' },

          { type: 'h', text: 'CSV — 쉼표로 나눈 표' },
          { type: 'p', html: '<b>CSV(Comma-Separated Values)</b> 는 “쉼표로 나눈 값들” 이라는 뜻으로, <b>표 한 장</b>을 텍스트로 적는 가장 흔한 형식입니다. 첫 줄은 보통 <b>머리글(header)</b> 이고, 그다음부터 한 줄이 한 행입니다. 엑셀 · 구글 스프레드시트에서 바로 열리고, 어떤 프로그램에서든 내보내기 · 가져오기가 됩니다. 작업 폴더에 <code>scores.csv</code> 가 들어 있습니다.' },
          { type: 'code', run: false, title: 'scores.csv (작업 폴더에 있는 예제 파일)', code: '이름,국어,영어,수학\n홍길동,90,85,100\n이순신,75,80,70\n강감찬,100,95,90\n유관순,88,92,84\n김유신,60,70,65' },
          { type: 'p', html: '먼저 지금까지 배운 방법(<code>split(",")</code>)으로 읽어 봅시다. 간단한 파일이라면 이것으로도 충분합니다.' },
          { type: 'code', title: '추가 예제. split() 으로 직접 읽기', code: `with open("scores.csv", "r", encoding = "utf-8") as inFp :
    header = inFp.readline().strip().split(",")
    print("머리글 :", header)
    for line in inFp :
        parts = line.strip().split(",")
        print(parts[0], "→", parts[1:])`, expect: `머리글 : ['이름', '국어', '영어', '수학']
홍길동 → ['90', '85', '100']
이순신 → ['75', '80', '70']
강감찬 → ['100', '95', '90']
유관순 → ['88', '92', '84']
김유신 → ['60', '70', '65']`,
            desc: '<code>2행</code> <code>readline()</code> 으로 첫 줄(머리글)만 따로 읽고, <code>5행</code>부터 나머지를 반복합니다. 읽은 값은 모두 <b>문자열</b>이므로 계산하려면 <code>int()</code> 로 바꿔야 합니다.' },

          { type: 'h', text: 'csv 모듈 — reader 와 DictReader' },
          { type: 'p', html: '표준 라이브러리 <code>csv</code> 모듈은 같은 일을 더 정확하게 해 줍니다. <code>csv.reader(파일객체)</code> 는 한 줄을 <b>리스트</b>로 만들어 돌려줍니다.' },
          { type: 'code', title: '추가 예제. csv.reader 로 읽기', code: `import csv

with open("scores.csv", "r", encoding = "utf-8", newline = "") as inFp :
    reader = csv.reader(inFp)
    header = next(reader)                      # 첫 줄은 머리글
    print("과목 :", header[1:])
    for row in reader :
        scores = [int(x) for x in row[1:]]
        print("%s : %s 평균 %.1f" % (row[0], scores, sum(scores) / len(scores)))`, expect: `과목 : ['국어', '영어', '수학']
홍길동 : [90, 85, 100] 평균 91.7
이순신 : [75, 80, 70] 평균 75.0
강감찬 : [100, 95, 90] 평균 95.0
유관순 : [88, 92, 84] 평균 88.0
김유신 : [60, 70, 65] 평균 65.0`,
            desc: '<code>next(reader)</code> 는 “다음 한 줄만 꺼내기” 라서 머리글을 건너뛰는 데 씁니다. <code>3행</code>의 <code>newline = ""</code> 은 <b>csv 파일을 열 때 꼭 붙이는 약속</b>입니다(줄바꿈을 csv 모듈이 직접 처리하도록 파이썬의 자동 변환을 끔).' },
          { type: 'p', html: '<code>row[1]</code>, <code>row[2]</code> 처럼 번호로 꺼내면 “1번이 국어였나 영어였나?” 헷갈립니다. <code>csv.DictReader</code> 는 <b>머리글을 열쇠(key)로 하는 딕셔너리</b>를 만들어 주므로 <code>row["국어"]</code> 처럼 이름으로 꺼낼 수 있습니다.' },
          { type: 'code', title: '추가 예제. csv.DictReader 로 이름으로 꺼내기', code: `import csv

with open("scores.csv", "r", encoding = "utf-8", newline = "") as inFp :
    for row in csv.DictReader(inFp) :
        print("%s → 국어 %s / 영어 %s / 수학 %s" % (row["이름"], row["국어"], row["영어"], row["수학"]))`, expect: `홍길동 → 국어 90 / 영어 85 / 수학 100
이순신 → 국어 75 / 영어 80 / 수학 70
강감찬 → 국어 100 / 영어 95 / 수학 90
유관순 → 국어 88 / 영어 92 / 수학 84
김유신 → 국어 60 / 영어 70 / 수학 65`,
            desc: '머리글을 따로 읽지 않아도 됩니다(<code>DictReader</code> 가 첫 줄을 머리글로 씁니다). 열의 <b>순서가 바뀌어도</b> 코드를 고칠 필요가 없다는 것이 큰 장점입니다. 열이 많은 실제 데이터에서는 거의 언제나 <code>DictReader</code> 를 씁니다.' },

          { type: 'h', text: 'csv 모듈 — writer 와 DictWriter' },
          { type: 'p', html: '쓸 때는 <code>csv.writer(파일객체)</code> 의 <code>writerow(한 줄)</code> · <code>writerows(여러 줄)</code> 를 씁니다. 줄바꿈과 쉼표를 csv 모듈이 알아서 붙여 줍니다.' },
          { type: 'code', title: '추가 예제. csv.writer 로 쓰기', code: `import csv

with open("out.csv", "w", encoding = "utf-8", newline = "") as outFp :
    writer = csv.writer(outFp)
    writer.writerow(["과목", "점수"])
    writer.writerows([["국어", 90], ["영어", 85], ["수학", 100]])

print("--- out.csv ---")
with open("out.csv", "r", encoding = "utf-8") as inFp :
    print(inFp.read(), end = "")`, expect: `--- out.csv ---
과목,점수
국어,90
영어,85
수학,100`,
            desc: '숫자를 그대로 넘겨도 됩니다(csv 모듈이 글자로 바꿔 저장). <code>newline = ""</code> 을 빼면 윈도에서 <b>줄 사이에 빈 줄</b>이 하나씩 끼는 유명한 증상이 생깁니다 — 파이썬과 csv 모듈이 둘 다 줄바꿈을 붙이기 때문입니다.' },
          { type: 'callout', kind: 'warn', title: 'CSV 를 다룰 때 꼭 기억할 두 가지', html: '<ol><li><b><code>newline = ""</code></b> 를 붙여서 연다 (읽을 때도, 쓸 때도)</li><li>엑셀에서 열 한글 CSV 는 <b><code>encoding = "utf-8-sig"</code></b> 로 저장한다 — 그냥 utf-8 로 저장하면 엑셀이 cp949 로 읽어 한글이 깨집니다. 앞에 붙는 표식(BOM) 3바이트를 보고 엑셀이 UTF-8 임을 알아차립니다.</li></ol>' },
          { type: 'p', html: '그러면 값 안에 쉼표나 따옴표가 있을 때는 어떻게 될까요? CSV 규칙은 <b>값을 따옴표로 감싸는 것</b>입니다. csv 모듈은 이 규칙을 알아서 지켜 줍니다.' },
          { type: 'code', title: '추가 예제. 쉼표가 든 값 — split() 은 왜 위험한가', code: `import csv

rows = [["제목", "메모"], ["회의", "9시, 3층 회의실"], ["인용", '그는 "좋다" 고 말했다']]
with open("memo.csv", "w", encoding = "utf-8", newline = "") as outFp :
    csv.writer(outFp).writerows(rows)

print("--- 파일에 저장된 모습 ---")
with open("memo.csv", "r", encoding = "utf-8") as inFp :
    print(inFp.read(), end = "")

print("--- split(\\",\\") 으로 읽으면 (깨짐) ---")
with open("memo.csv", "r", encoding = "utf-8") as inFp :
    for line in inFp :
        print(line.strip().split(","))

print("--- csv.reader 로 읽으면 (정확) ---")
with open("memo.csv", "r", encoding = "utf-8", newline = "") as inFp :
    for row in csv.reader(inFp) :
        print(row)`, expect: `--- 파일에 저장된 모습 ---
제목,메모
회의,"9시, 3층 회의실"
인용,"그는 ""좋다"" 고 말했다"
--- split(",") 으로 읽으면 (깨짐) ---
['제목', '메모']
['회의', '"9시', ' 3층 회의실"']
['인용', '"그는 ""좋다"" 고 말했다"']
--- csv.reader 로 읽으면 (정확) ---
['제목', '메모']
['회의', '9시, 3층 회의실']
['인용', '그는 "좋다" 고 말했다']`,
            desc: '규칙은 두 가지입니다. ① 값 안에 쉼표 · 따옴표 · 줄바꿈이 있으면 <b>값 전체를 <code>"</code> 로 감싼다</b>. ② 값 안의 <code>"</code> 는 <code>""</code> 로 두 번 쓴다. <code>split(",")</code> 은 이 규칙을 모르기 때문에 한 칸이 두 칸으로 쪼개집니다. <b>남이 만든 CSV 를 읽을 때는 반드시 csv 모듈</b>을 쓰세요.' },
          { type: 'callout', kind: 'more', title: '📘 DictWriter · 다른 구분 기호 · pandas', html: '<p><code>csv.DictWriter(파일, fieldnames = [...])</code> 는 딕셔너리 목록을 그대로 저장합니다. <code>writeheader()</code> 로 머리글을 쓰고 <code>writerows(목록)</code> 로 내용을 씁니다 (실습 11-30).</p><p>쉼표 대신 탭으로 나눈 파일(TSV)은 <code>csv.reader(f, delimiter = "\\t")</code> 로 읽습니다. 수십만 줄짜리 표를 분석할 때는 외부 라이브러리 <b>pandas</b> 의 <code>read_csv()</code> 를 많이 쓰지만, 그 안에서도 규칙은 똑같습니다.</p>' },

          { type: 'h', text: 'JSON — 구조가 있는 데이터' },
          { type: 'p', html: 'CSV 는 <b>표 한 장</b>만 담을 수 있습니다. “창 크기는 640×480 이고, 글꼴은 이름과 크기를 갖고, 최근 파일 목록이 있다” 같은 <b>계층 구조</b>는 표로 만들기 어렵습니다. 이럴 때 쓰는 형식이 <b>JSON(JavaScript Object Notation)</b> 입니다. 놀랍게도 파이썬의 <b>딕셔너리 · 리스트</b>와 생김새가 거의 같습니다.' },
          { type: 'code', run: false, title: 'config.json (작업 폴더에 있는 예제 파일)', code: '{\n  "제목": "나의 메모장",\n  "창크기": [640, 480],\n  "글꼴": {"이름": "맑은 고딕", "크기": 12},\n  "최근파일": ["data1.txt", "normal.txt"],\n  "자동저장": true\n}' },
          { type: 'code', title: '추가 예제. json.load() 로 읽기', code: `import json

with open("config.json", "r", encoding = "utf-8") as inFp :
    config = json.load(inFp)

print("읽은 결과의 자료형 :", type(config))
print("제목 :", config["제목"])
print("창 크기 :", config["창크기"], "→ 가로", config["창크기"][0])
print("글꼴 이름 :", config["글꼴"]["이름"], "크기", config["글꼴"]["크기"])
print("최근 파일 :", config["최근파일"])
print("자동 저장 :", config["자동저장"], type(config["자동저장"]))`, expect: `읽은 결과의 자료형 : <class 'dict'>
제목 : 나의 메모장
창 크기 : [640, 480] → 가로 640
글꼴 이름 : 맑은 고딕 크기 12
최근 파일 : ['data1.txt', 'normal.txt']
자동 저장 : True <class 'bool'>`,
            desc: '<b><code>json.load()</code> 한 번이면 파이썬 딕셔너리가 됩니다.</b> 자르고 형 변환할 필요가 전혀 없습니다. 숫자는 숫자로, 목록은 리스트로, <code>true</code> 는 <code>True</code> 로 알아서 바뀝니다. CSV 와 가장 크게 다른 점입니다.' },
          { type: 'table', head: ['파이썬', 'JSON', '비고'], rows: [
            ['<code>dict</code>', '객체 <code>{ }</code>', 'JSON 의 열쇠는 <b>반드시 문자열</b>'],
            ['<code>list</code> · <code>tuple</code>', '배열 <code>[ ]</code>', '튜플로 저장해도 읽으면 리스트가 됨'],
            ['<code>str</code>', '문자열 <code>" "</code>', '작은따옴표는 안 되고 <b>큰따옴표만</b>'],
            ['<code>int</code> · <code>float</code>', '숫자', '따옴표 없이'],
            ['<code>True</code> · <code>False</code>', '<code>true</code> · <code>false</code>', '첫 글자가 소문자'],
            ['<code>None</code>', '<code>null</code>', ''],
            ['집합(set) · 객체', '(없음)', '<code>TypeError</code> — 리스트 등으로 바꿔서 저장']
          ], caption: '파이썬과 JSON 의 자료형 대응' },
          { type: 'p', html: '저장은 <code>json.dump(자료, 파일객체)</code> 입니다. 한글을 그대로 보이게 하려면 <code>ensure_ascii = False</code>, 보기 좋게 줄을 나누려면 <code>indent = 2</code> 를 줍니다.' },
          { type: 'code', title: '추가 예제. json.dump() 로 저장 — 한글이 깨지지 않게', code: `import json

config = {"제목": "나의 메모장", "창크기": [800, 600],
          "글꼴": {"이름": "맑은 고딕", "크기": 14},
          "최근파일": ["memo.txt"], "자동저장": False}

print("ensure_ascii = True  :", json.dumps(config)[:30])
print("ensure_ascii = False :", json.dumps(config, ensure_ascii = False)[:30])

with open("myconfig.json", "w", encoding = "utf-8") as outFp :
    json.dump(config, outFp, ensure_ascii = False, indent = 2)

print("--- myconfig.json ---")
with open("myconfig.json", "r", encoding = "utf-8") as inFp :
    print(inFp.read())`, expect: `ensure_ascii = True  : {"\\uc81c\\ubaa9": "\\ub098\\uc758
ensure_ascii = False : {"제목": "나의 메모장", "창크기": [800,
--- myconfig.json ---
{
  "제목": "나의 메모장",
  "창크기": [
    800,
    600
  ],
  "글꼴": {
    "이름": "맑은 고딕",
    "크기": 14
  },
  "최근파일": [
    "memo.txt"
  ],
  "자동저장": false
}`,
            desc: '<code>ensure_ascii</code> 의 기본값은 <code>True</code> 라서 한글이 <code>\\uc81c\\ubaa9</code> 같은 escape 로 저장됩니다(읽을 때는 정상으로 돌아오지만 사람이 볼 수 없습니다). <b>한글 JSON 은 <code>ensure_ascii = False</code> + <code>encoding = "utf-8"</code></b> 을 한 쌍으로 기억하세요. <code>json.dumps()</code>(s 가 붙음)는 파일 대신 <b>문자열</b>을 돌려줍니다.' },
          { type: 'callout', kind: 'more', title: '📘 JSON 은 인터넷의 공용어', html: '<p>날씨 · 지도 · 번역 같은 인터넷 서비스(API)에 요청을 보내면 거의 대부분 JSON 으로 답이 옵니다. 그래서 <code>json.loads(받은문자열)</code> 한 줄이면 파이썬 딕셔너리로 바뀌어 바로 다룰 수 있습니다. 설정 파일(<code>.json</code>), 프로그램 사이의 데이터 교환, 웹 브라우저와 서버의 통신이 모두 JSON 으로 이루어집니다.</p><p>주의: JSON 에는 <b>주석을 쓸 수 없고</b>, 마지막 항목 뒤에 쉼표를 붙이면 오류가 납니다(<code>json.JSONDecodeError</code>). 사람이 손으로 많이 고치는 설정에는 <code>toml</code> · <code>yaml</code> 같은 형식을 쓰기도 합니다.</p>' },

          { type: 'h', text: '어떤 형식을 고를까 — 비교표' },
          { type: 'table', head: ['', 'txt (그냥 텍스트)', 'csv', 'json'], rows: [
            ['<b>담기 좋은 것</b>', '메모 · 기록(로그) · 줄글', '표 — 같은 열이 반복되는 자료', '설정 · 중첩된 구조 · 서로 다른 모양의 자료'],
            ['<b>읽는 방법</b>', '<code>readline()</code> · <code>split()</code>', '<code>csv.reader</code> · <code>DictReader</code>', '<code>json.load()</code> 한 번'],
            ['<b>자료형</b>', '모두 문자열', '모두 문자열 (<code>int()</code> 필요)', '<b>숫자 · 목록 · 참거짓이 그대로</b>'],
            ['<b>중첩 구조</b>', '어려움', '불가능 (표 한 장)', '얼마든지 가능'],
            ['<b>다른 프로그램</b>', '메모장', '<b>엑셀 · 구글 시트</b>', '웹 서비스 · 거의 모든 언어'],
            ['<b>사람이 고치기</b>', '아주 쉬움', '쉬움', '보통 (따옴표 · 쉼표 규칙)'],
            ['<b>한 줄씩 처리</b>', '쉬움', '쉬움 (큰 파일도 OK)', '어려움 — 보통 전체를 한 번에 읽음']
          ], caption: '표 11-3 데이터 저장 형식 고르기' },
          { type: 'list', ordered: true, items: [
            '<b>줄글 · 기록이고 나만 읽는다</b> → <code>.txt</code> (일기, <code>server.log</code>)',
            '<b>행과 열이 반복되고 엑셀로도 볼 것이다</b> → <code>.csv</code> (성적, 가계부, 출석부)',
            '<b>값마다 모양이 다르거나 안에 또 구조가 있다</b> → <code>.json</code> (설정, 저장 파일, 서버 응답)',
            '<b>아주 크고 검색 · 수정이 잦다</b> → 데이터베이스(<code>sqlite3</code>) — 파일 하나로 쓰는 데이터베이스가 파이썬에 기본으로 들어 있습니다'
          ] },
          { type: 'callout', kind: 'tip', title: '형식을 바꾸는 것은 어렵지 않습니다', html: '읽어서 파이썬의 <b>리스트 · 딕셔너리</b>로 만들어 두면, 그다음 어떤 형식으로 저장할지는 마지막 몇 줄만 바꾸면 됩니다. 그래서 프로그램을 만들 때 <b>“읽기 → 파이썬 자료 → 쓰기”</b> 로 나누어 생각하는 습관이 중요합니다. 프로젝트 11-4 에서 이 흐름을 그대로 연습합니다.' }
        ],
        practice: [
          {
            title: '실습 11-27. CSV 를 표 모양으로 출력하기',
            level: 1,
            desc: '<p><code>csv.reader</code> 로 <code>scores.csv</code> 를 읽어 각 줄을 <code> | </code> 로 이어 출력하세요. 머리글(첫 줄) 아래에는 <code>-</code> 24개로 된 구분선을 넣습니다.</p><pre>이름 | 국어 | 영어 | 수학\n------------------------\n홍길동 | 90 | 85 | 100\n…</pre>',
            hint: '<code>for i, row in enumerate(csv.reader(inFp)) :</code> 로 번호와 함께 돌면서 <code>" | ".join(row)</code> 를 출력하고, <code>i == 0</code> 일 때만 <code>print("-" * 24)</code> 를 더 출력합니다.',
            starter: `import csv

with open("scores.csv", "r", encoding = "utf-8", newline = "") as inFp :
    for i, row in enumerate(csv.reader(inFp)) :
        pass    # TODO: " | " 로 이어 출력하고, 첫 줄 다음에는 구분선
`,
            solution: `import csv

with open("scores.csv", "r", encoding = "utf-8", newline = "") as inFp :
    for i, row in enumerate(csv.reader(inFp)) :
        print(" | ".join(row))
        if i == 0 :
            print("-" * 24)
`,
            expect: `이름 | 국어 | 영어 | 수학
------------------------
홍길동 | 90 | 85 | 100
이순신 | 75 | 80 | 70
강감찬 | 100 | 95 | 90
유관순 | 88 | 92 | 84
김유신 | 60 | 70 | 65`
          },
          {
            title: '실습 11-28. JSON 설정 읽어 고쳐 저장하기',
            level: 1,
            desc: '<p><code>config.json</code> 을 읽어 ① 창 크기를 <code>[1024, 768]</code> 로 바꾸고 ② 글꼴 크기를 <code>16</code> 으로 바꾸고 ③ 최근 파일 목록에 <code>"memo.txt"</code> 를 추가한 뒤, <code>config2.json</code> 에 <b>한글이 보이도록</b> 저장하고 그 내용을 출력하세요.</p>',
            hint: '<code>json.load()</code> 로 읽으면 그냥 딕셔너리입니다. <code>config["창크기"] = [1024, 768]</code>, <code>config["글꼴"]["크기"] = 16</code>, <code>config["최근파일"].append("memo.txt")</code>. 저장은 <code>json.dump(config, outFp, ensure_ascii = False, indent = 2)</code>.',
            starter: `import json

with open("config.json", "r", encoding = "utf-8") as inFp :
    config = json.load(inFp)

# TODO: 창크기 · 글꼴 크기 · 최근파일 고치기

# TODO: config2.json 에 저장 (ensure_ascii = False, indent = 2)

with open("config2.json", "r", encoding = "utf-8") as inFp :
    print(inFp.read(), end = "")
`,
            solution: `import json

with open("config.json", "r", encoding = "utf-8") as inFp :
    config = json.load(inFp)

config["창크기"] = [1024, 768]
config["글꼴"]["크기"] = 16
config["최근파일"].append("memo.txt")

with open("config2.json", "w", encoding = "utf-8") as outFp :
    json.dump(config, outFp, ensure_ascii = False, indent = 2)

with open("config2.json", "r", encoding = "utf-8") as inFp :
    print(inFp.read(), end = "")
`,
            expect: `{
  "제목": "나의 메모장",
  "창크기": [
    1024,
    768
  ],
  "글꼴": {
    "이름": "맑은 고딕",
    "크기": 16
  },
  "최근파일": [
    "data1.txt",
    "normal.txt",
    "memo.txt"
  ],
  "자동저장": true
}`
          },
          {
            title: '실습 11-29. DictReader 로 과목별 통계 내기',
            level: 2,
            desc: '<p><code>csv.DictReader</code> 로 <code>scores.csv</code> 를 읽어 <b>과목별 평균</b>과 <b>최고점을 받은 학생</b>을 출력하세요.</p><pre>국어 : 평균 82.6 / 최고 강감찬(100점)\n영어 : 평균 84.4 / 최고 강감찬(95점)\n수학 : 평균 81.8 / 최고 홍길동(100점)</pre><p>최고점이 같으면 <b>먼저 나온 학생</b>을 고릅니다.</p>',
            hint: '과목 이름 목록 <code>["국어", "영어", "수학"]</code> 을 만들어 두고, 학생 한 명마다 세 과목을 돌면서 <code>totals[s] = totals.get(s, 0) + score</code> 로 더합니다. 최고점은 <code>best[s] = (이름, 점수)</code> 튜플로 기억해 두고 더 클 때만 바꿉니다.',
            starter: `import csv

SUBJECTS = ["국어", "영어", "수학"]
totals = {}
best = {}
count = 0

with open("scores.csv", "r", encoding = "utf-8", newline = "") as inFp :
    for row in csv.DictReader(inFp) :
        count += 1
        # TODO: 과목마다 합계 더하기, 최고점 학생 기억하기

# TODO: 과목별로 평균과 최고점 출력
`,
            solution: `import csv

SUBJECTS = ["국어", "영어", "수학"]
totals = {}
best = {}
count = 0

with open("scores.csv", "r", encoding = "utf-8", newline = "") as inFp :
    for row in csv.DictReader(inFp) :
        count += 1
        for s in SUBJECTS :
            score = int(row[s])
            totals[s] = totals.get(s, 0) + score
            if s not in best or score > best[s][1] :
                best[s] = (row["이름"], score)

for s in SUBJECTS :
    print("%s : 평균 %.1f / 최고 %s(%d점)" % (s, totals[s] / count, best[s][0], best[s][1]))
`,
            expect: `국어 : 평균 82.6 / 최고 강감찬(100점)
영어 : 평균 84.4 / 최고 강감찬(95점)
수학 : 평균 81.8 / 최고 홍길동(100점)`
          },
          {
            title: '실습 11-30. 딕셔너리 목록을 CSV 로 저장하기',
            level: 2,
            desc: '<p>책 정보 딕셔너리 세 개를 <code>csv.DictWriter</code> 로 <code>books.csv</code> 에 저장하고, 파일 내용을 그대로 출력한 뒤 다시 <code>DictReader</code> 로 읽어 <b>전체 쪽수</b>를 구하세요.</p><pre>--- books.csv ---\n제목,지은이,쪽수\n파이썬 입문,홍길동,320\n"자료 구조, 쉽게",이순신,415\n알고리즘,강감찬,280\n전체 쪽수 : 1015</pre><p>제목에 쉼표가 들어 있는 책이 <b>따옴표로 감싸져</b> 저장되는 것을 꼭 확인하세요.</p>',
            hint: '<code>writer = csv.DictWriter(outFp, fieldnames = ["제목", "지은이", "쪽수"])</code> → <code>writer.writeheader()</code> → <code>writer.writerows(books)</code>. 읽은 쪽수는 문자열이므로 <code>int()</code> 로 바꿔 더합니다.',
            starter: `import csv

books = [{"제목": "파이썬 입문", "지은이": "홍길동", "쪽수": 320},
         {"제목": "자료 구조, 쉽게", "지은이": "이순신", "쪽수": 415},
         {"제목": "알고리즘", "지은이": "강감찬", "쪽수": 280}]

with open("books.csv", "w", encoding = "utf-8", newline = "") as outFp :
    pass    # TODO: DictWriter 로 머리글과 내용 쓰기

print("--- books.csv ---")
with open("books.csv", "r", encoding = "utf-8") as inFp :
    print(inFp.read(), end = "")

total = 0
# TODO: DictReader 로 다시 읽어 쪽수 더하기
print("전체 쪽수 :", total)
`,
            solution: `import csv

books = [{"제목": "파이썬 입문", "지은이": "홍길동", "쪽수": 320},
         {"제목": "자료 구조, 쉽게", "지은이": "이순신", "쪽수": 415},
         {"제목": "알고리즘", "지은이": "강감찬", "쪽수": 280}]

with open("books.csv", "w", encoding = "utf-8", newline = "") as outFp :
    writer = csv.DictWriter(outFp, fieldnames = ["제목", "지은이", "쪽수"])
    writer.writeheader()
    writer.writerows(books)

print("--- books.csv ---")
with open("books.csv", "r", encoding = "utf-8") as inFp :
    print(inFp.read(), end = "")

total = 0
with open("books.csv", "r", encoding = "utf-8", newline = "") as inFp :
    for row in csv.DictReader(inFp) :
        total += int(row["쪽수"])
print("전체 쪽수 :", total)
`,
            expect: `--- books.csv ---
제목,지은이,쪽수
파이썬 입문,홍길동,320
"자료 구조, 쉽게",이순신,415
알고리즘,강감찬,280
전체 쪽수 : 1015`
          },
          {
            title: '🚀 프로젝트 11-4. CSV 성적 처리 리포트 생성기',
            level: 3,
            desc: '<p><code>scores.csv</code> 를 읽어 <b>성적표를 만들어 주는 프로그램</b>을 만듭니다. “읽기 → 파이썬 자료로 계산 → 쓰기” 라는 데이터 처리의 기본 흐름을 그대로 따라갑니다.</p><p><b>요구 사항</b></p><ol><li><code>csv.DictReader</code> 로 <code>scores.csv</code> 를 읽는다.</li><li>학생마다 <b>총점 · 평균(소수점 첫째 자리) · 등급</b>을 구한다. 등급은 평균 기준으로 <code>90 이상 A</code>, <code>80 이상 B</code>, <code>70 이상 C</code>, 그 미만은 <code>D</code>.</li><li><b>총점이 높은 순서</b>로 정렬해 등수와 함께 화면에 출력한다.</li><li>이어서 <b>과목별 평균 · 최고 · 최저</b>를 출력한다.</li><li>결과를 <code>report.csv</code> 로 저장한다. 열은 <code>이름, 국어, 영어, 수학, 총점, 평균, 등급</code> 이고 <code>csv.DictWriter</code> 를 쓴다.</li><li>저장한 <code>report.csv</code> 를 그대로 출력해 확인한다.</li></ol><pre>등수 이름   총점  평균 등급\n 1   강감찬    285  95.0  A\n 2   홍길동    275  91.7  A\n…\n--- 과목별 ---\n국어 : 평균 82.6 / 최고 100 / 최저 60\n…\nreport.csv 에 저장했습니다.</pre><p><b>확장 아이디어</b> — 여기까지 했다면 이렇게 더 해 보세요.</p><ul><li>등급별 인원수를 세어 <code>A:2명 B:1명 …</code> 로 함께 출력하기</li><li>평균이 가장 낮은 과목에 <code>← 보충 필요</code> 표시 붙이기</li><li>결과를 <code>report.json</code> 으로도 저장하기 (<code>ensure_ascii = False</code>)</li><li>점수가 비어 있거나 숫자가 아닌 줄을 만나면 건너뛰고 경고를 출력하기 (11-6 교시의 <code>try ~ except ValueError</code>)</li><li>별표 그래프로 평균 보여 주기 — <code>"★" * int(평균 / 10)</code></li></ul>',
            hint: '정렬은 <code>students.sort(key = total_of, reverse = True)</code> — <code>total_of(student)</code> 는 <code>student["총점"]</code> 을 돌려주는 함수입니다. 등수는 <code>enumerate(students, 1)</code>. 과목별 값 모으기는 <code>values = [s[sub] for s in students]</code> 로 하면 <code>sum · max · min</code> 을 바로 쓸 수 있습니다.',
            starter: `import csv

SUBJECTS = ["국어", "영어", "수학"]

def total_of(student) :
    return student["총점"]

students = []
with open("scores.csv", "r", encoding = "utf-8", newline = "") as inFp :
    for row in csv.DictReader(inFp) :
        scores = [int(row[s]) for s in SUBJECTS]
        # TODO: 총점 · 평균 · 등급을 구해 딕셔너리로 만들어 students 에 추가

# TODO: 총점이 높은 순서로 정렬

print("등수 이름   총점  평균 등급")
# TODO: 등수와 함께 출력

print("--- 과목별 ---")
# TODO: 과목별 평균 · 최고 · 최저 출력

# TODO: report.csv 로 저장하고 내용 출력
`,
            solution: `import csv

SUBJECTS = ["국어", "영어", "수학"]

def total_of(student) :
    return student["총점"]

students = []
with open("scores.csv", "r", encoding = "utf-8", newline = "") as inFp :
    for row in csv.DictReader(inFp) :
        scores = [int(row[s]) for s in SUBJECTS]
        total = sum(scores)
        avg = total / len(scores)
        if avg >= 90 :
            grade = "A"
        elif avg >= 80 :
            grade = "B"
        elif avg >= 70 :
            grade = "C"
        else :
            grade = "D"
        student = {"이름": row["이름"], "총점": total, "평균": round(avg, 1), "등급": grade}
        for i, s in enumerate(SUBJECTS) :
            student[s] = scores[i]
        students.append(student)

students.sort(key = total_of, reverse = True)

print("등수 이름   총점  평균 등급")
for i, s in enumerate(students, 1) :
    print("%2d   %-5s %4d %5.1f  %s" % (i, s["이름"], s["총점"], s["평균"], s["등급"]))

print("--- 과목별 ---")
for sub in SUBJECTS :
    values = [s[sub] for s in students]
    print("%s : 평균 %.1f / 최고 %d / 최저 %d" % (sub, sum(values) / len(values), max(values), min(values)))

with open("report.csv", "w", encoding = "utf-8", newline = "") as outFp :
    writer = csv.DictWriter(outFp, fieldnames = ["이름"] + SUBJECTS + ["총점", "평균", "등급"])
    writer.writeheader()
    writer.writerows(students)
print("report.csv 에 저장했습니다.")

with open("report.csv", "r", encoding = "utf-8") as inFp :
    print(inFp.read(), end = "")
`,
            expect: `등수 이름   총점  평균 등급
 1   강감찬    285  95.0  A
 2   홍길동    275  91.7  A
 3   유관순    264  88.0  B
 4   이순신    225  75.0  C
 5   김유신    195  65.0  D
--- 과목별 ---
국어 : 평균 82.6 / 최고 100 / 최저 60
영어 : 평균 84.4 / 최고 95 / 최저 70
수학 : 평균 81.8 / 최고 100 / 최저 65
report.csv 에 저장했습니다.
이름,국어,영어,수학,총점,평균,등급
강감찬,100,95,90,285,95.0,A
홍길동,90,85,100,275,91.7,A
유관순,88,92,84,264,88.0,B
이순신,75,80,70,225,75.0,C
김유신,60,70,65,195,65.0,D`
          }
        ],
        quiz: [
          { q: 'CSV 파일을 열 때 <code>newline = ""</code> 을 붙이는 이유는?', options: ['한글이 깨지지 않게 하려고', '줄바꿈 처리를 csv 모듈에 맡겨 빈 줄이 끼지 않게 하려고', '파일 크기를 줄이려고', '엑셀에서 열리게 하려고'], answer: 1, explain: '붙이지 않으면 윈도에서 줄 사이에 빈 줄이 하나씩 끼는 증상이 생깁니다. 한글은 <code>encoding</code> 으로 따로 맞춥니다.' },
          { q: 'CSV 한 줄이 <code>회의,"9시, 3층 회의실"</code> 일 때 <code>line.split(",")</code> 의 결과 길이는?', options: ['2', '3', '1', '오류가 난다'], answer: 1, explain: '따옴표 규칙을 모르는 <code>split()</code> 은 쉼표 세 곳… 이 아니라 두 곳에서 잘라 <b>3조각</b>이 됩니다. <code>csv.reader</code> 로 읽어야 2개로 정확히 나뉩니다.' },
          { q: '<code>csv.reader</code> 대신 <code>csv.DictReader</code> 를 쓰면 좋은 점은?', options: ['파일이 작아진다', '<code>row["국어"]</code> 처럼 머리글 이름으로 꺼낼 수 있다', '숫자로 자동 변환된다', '한글이 깨지지 않는다'], answer: 1, explain: '열 순서가 바뀌어도 코드를 고칠 필요가 없습니다. 값은 여전히 문자열이라 <code>int()</code> 가 필요합니다.' },
          { q: '다음 코드로 저장한 파일에서 한글이 <code>\\uc81c\\ubaa9</code> 처럼 보이는 이유는?<pre><code>json.dump(data, f, indent = 2)</code></pre>', options: ['<code>encoding</code> 을 안 적어서', '<code>ensure_ascii</code> 의 기본값이 True 라서', '<code>indent</code> 때문에', 'JSON 은 한글을 저장할 수 없어서'], answer: 1, explain: '<code>ensure_ascii = False</code> 를 주면 한글이 그대로 저장됩니다. 기본값으로 저장해도 <code>json.load()</code> 로 읽으면 한글로 돌아오지만, 사람이 파일을 열어 볼 수 없습니다.' },
          { q: '<code>json.load()</code> 로 <code>{"크기": [640, 480], "자동저장": true}</code> 를 읽었을 때 <code>config["자동저장"]</code> 의 값은?', options: ['문자열 <code>"true"</code>', '<code>True</code> (bool)', '<code>1</code>', '<code>None</code>'], answer: 1, explain: 'JSON 의 <code>true</code> 는 파이썬의 <code>True</code> 로 바뀝니다. 숫자 · 목록 · 참거짓이 <b>자료형 그대로</b> 살아나는 것이 JSON 의 장점입니다.' },
          { q: '학생 30명의 이름과 세 과목 점수를 저장하고 엑셀로도 열어 보려고 합니다. 가장 알맞은 형식은?', options: ['<code>.txt</code>', '<code>.csv</code>', '<code>.json</code>', '<code>.raw</code>'], answer: 1, explain: '같은 열이 반복되는 <b>표</b> 데이터이고 엑셀 호환이 필요하므로 CSV 가 알맞습니다. (엑셀에서 한글이 깨지면 <code>encoding="utf-8-sig"</code>)' }
        ],
        slides: [
          { layout: 'title', title: '데이터 저장 형식 고르기', subtitle: 'csv · json — 표준 형식으로 주고받기', badge: '11-7',
            notes: '<p><b>[도입 3분]</b> 복습 발문: “11-2 교시에서 성적을 어떻게 저장했나요?” → <code>홍길동,90</code> + <code>split(",")</code>. 그다음 발문: “이름이 <code>홍길동, 2학년</code> 이라면?” → 쉼표가 데이터인지 구분 기호인지 알 수 없음. 오늘 배울 형식이 이 문제를 해결합니다.</p>' },
          { layout: 'diagram', title: 'txt · csv · json 한눈에 보기', html: SVG(1280, 300, '세 가지 저장 형식',
            BOX(215, 50, 360, 60, '📄 txt', { stroke: 'var(--muted)', bold: true, size: 24 }) +
            BOX(640, 50, 360, 60, '📊 csv', { stroke: 'var(--ok)', bold: true, size: 24 }) +
            BOX(1065, 50, 360, 60, '🧩 json', { stroke: 'var(--accent)', bold: true, size: 24 }) +
            BOX(215, 165, 360, 120, '홍길동 90점|(내가 자름)', { stroke: 'var(--line)', mono: true, size: 20, sw: 2 }) +
            BOX(640, 165, 360, 120, '이름,국어|홍길동,90', { stroke: 'var(--line)', mono: true, size: 20, sw: 2 }) +
            BOX(1065, 165, 360, 120, '{"이름": "홍길동",| "점수": [90, 85]}', { stroke: 'var(--line)', mono: true, size: 19, sw: 2 }) +
            T(640, 265, '기록 · 메모          표 · 성적 · 엑셀          설정 · 중첩 구조', { size: 21, bold: true })), caption: '셋 다 텍스트 파일 — 담기 좋은 모양이 다를 뿐',
            notes: '<p><b>[3분]</b> 세 형식 모두 메모장으로 열리는 텍스트라는 점을 먼저 짚어 주세요(이진 파일과 대비). 고르는 기준은 “데이터의 모양”입니다.</p>' },
          { layout: 'code', title: 'csv.reader — 한 줄이 리스트', code: `import csv

with open("scores.csv", "r", encoding = "utf-8", newline = "") as inFp :
    reader = csv.reader(inFp)
    header = next(reader)          # 머리글 건너뛰기
    print("과목 :", header[1:])
    for row in reader :
        scores = [int(x) for x in row[1:]]
        print(row[0], scores, sum(scores) / len(scores))`, points: ['<code>newline = ""</code> 는 csv 의 약속', '<code>next(reader)</code> 로 머리글 한 줄만', '값은 <b>문자열</b> → <code>int()</code> 필요'],
            notes: '<p><b>[4분]</b> 작업 폴더의 scores.csv 를 먼저 보여 주세요. 실행한 뒤 <code>newline=""</code> 을 빼고 파일에 써 보면(다음 슬라이드) 빈 줄이 끼는 것을 확인할 수 있습니다.</p>' },
          { layout: 'code', title: 'csv.DictReader — 이름으로 꺼내기', code: `import csv

with open("scores.csv", "r", encoding = "utf-8", newline = "") as inFp :
    for row in csv.DictReader(inFp) :
        print("%s → 국어 %s / 영어 %s / 수학 %s"
              % (row["이름"], row["국어"], row["영어"], row["수학"]))`, points: ['머리글이 <b>열쇠(key)</b> 가 됨', '열 순서가 바뀌어도 코드는 그대로', '실제 데이터에서는 거의 이것을 씀'],
            notes: '<p><b>[3분]</b> 발문: “<code>row[2]</code> 가 영어였나 수학이었나?” — 번호로 꺼내는 코드의 문제를 먼저 느끼게 한 뒤 DictReader 를 보여 주면 효과가 큽니다.</p>' },
          { layout: 'code', title: '쉼표가 든 값 — split() 은 왜 위험한가', code: `import csv

rows = [["제목", "메모"], ["회의", "9시, 3층 회의실"]]
with open("memo.csv", "w", encoding = "utf-8", newline = "") as f :
    csv.writer(f).writerows(rows)

with open("memo.csv", "r", encoding = "utf-8") as f :
    print(f.read(), end = "")
    f.seek(0)
    for line in f :
        print("split :", line.strip().split(","))

with open("memo.csv", "r", encoding = "utf-8", newline = "") as f :
    for row in csv.reader(f) :
        print("csv   :", row)`, points: ['규칙 ① 쉼표가 있으면 <code>" "</code> 로 감싼다', '규칙 ② 값 안의 <code>"</code> 는 <code>""</code> 로', '<b>남이 만든 CSV 는 반드시 csv 모듈로</b>'],
            notes: '<p><b>[4분]</b> 오늘 교시에서 가장 중요한 슬라이드입니다. split 결과가 3조각으로 깨지는 것을 눈으로 확인시키세요. 실무에서 “왜 데이터가 밀렸지?” 하는 사고의 단골 원인입니다.</p>' },
          { layout: 'code', title: 'csv.writer · DictWriter 로 쓰기', code: `import csv

books = [{"제목": "파이썬 입문", "쪽수": 320},
         {"제목": "알고리즘", "쪽수": 280}]

with open("books.csv", "w", encoding = "utf-8", newline = "") as outFp :
    writer = csv.DictWriter(outFp, fieldnames = ["제목", "쪽수"])
    writer.writeheader()
    writer.writerows(books)

with open("books.csv", "r", encoding = "utf-8") as inFp :
    print(inFp.read(), end = "")`, points: ['<code>writerow</code> 한 줄 / <code>writerows</code> 여러 줄', '<code>DictWriter</code> + <code>writeheader()</code>', '엑셀용 한글 CSV 는 <code>utf-8-sig</code>'],
            notes: '<p><b>[3분]</b> 숫자를 그대로 넘겨도 csv 모듈이 글자로 바꿔 준다는 점. 엑셀에서 한글이 깨지는 문제는 <code>encoding="utf-8-sig"</code> 로 해결된다고 꼭 알려 주세요 — 실습 · 과제에서 자주 묻습니다.</p>' },
          { layout: 'code', title: 'json.load() — 한 줄이면 딕셔너리', code: `import json

with open("config.json", "r", encoding = "utf-8") as inFp :
    config = json.load(inFp)

print(type(config))
print(config["제목"], config["창크기"], config["창크기"][0])
print(config["글꼴"]["이름"], config["글꼴"]["크기"])
print(config["자동저장"], type(config["자동저장"]))`, points: ['자르지도 <code>int()</code> 하지도 않음', '숫자 · 목록 · 참거짓이 <b>그대로</b>', '<code>true</code> → <code>True</code>'],
            notes: '<p><b>[4분]</b> CSV 와의 결정적 차이입니다. 작업 폴더의 config.json 을 먼저 열어 보여 주고, 파이썬 딕셔너리와 생김새가 거의 같다는 점을 강조하세요.</p>' },
          { layout: 'table', title: '파이썬 ↔ JSON 자료형', head: ['파이썬', 'JSON', '주의'], rows: [
            ['<code>dict</code>', '<code>{ }</code>', '열쇠는 반드시 문자열'],
            ['<code>list</code> · <code>tuple</code>', '<code>[ ]</code>', '튜플도 읽으면 리스트'],
            ['<code>str</code>', '<code>"…"</code>', '<b>큰따옴표만</b>'],
            ['<code>True</code> · <code>False</code> · <code>None</code>', '<code>true</code> · <code>false</code> · <code>null</code>', '소문자'],
            ['<code>set</code>', '(없음)', 'TypeError → 리스트로 바꿔 저장']],
            notes: '<p><b>[3분]</b> JSON 에는 주석을 쓸 수 없고 마지막 쉼표도 오류라는 점을 덧붙이세요. 직접 손으로 고치다가 <code>JSONDecodeError</code> 를 만나는 학생이 꼭 나옵니다.</p>' },
          { layout: 'code', title: 'json.dump() — 한글이 깨지지 않게', code: `import json

config = {"제목": "나의 메모장", "창크기": [800, 600],
          "자동저장": False}

print(json.dumps(config)[:28])                      # 기본값
print(json.dumps(config, ensure_ascii = False)[:28])

with open("myconfig.json", "w", encoding = "utf-8") as outFp :
    json.dump(config, outFp, ensure_ascii = False, indent = 2)

with open("myconfig.json", "r", encoding = "utf-8") as inFp :
    print(inFp.read())`, points: ['<code>ensure_ascii = False</code> + <code>encoding="utf-8"</code> 는 한 쌍', '<code>indent = 2</code> : 보기 좋게', '<code>dumps</code>(s) 는 <b>문자열</b>을 돌려줌'],
            notes: '<p><b>[4분]</b> 기본값으로 저장한 <code>\\uc81c\\ubaa9</code> 를 먼저 보여 주고 “읽기는 되지만 사람이 못 본다” 는 점을 짚으세요. JSON 은 인터넷 서비스(API)의 공용어라는 이야기도 함께.</p>' },
          { layout: 'table', title: '표 11-3 어떤 형식을 고를까', head: ['', 'txt', 'csv', 'json'], rows: [
            ['담기 좋은 것', '메모 · 기록', '표 (반복되는 열)', '설정 · 중첩 구조'],
            ['읽기', '<code>split()</code>', '<code>DictReader</code>', '<code>json.load()</code>'],
            ['자료형', '모두 문자열', '모두 문자열', '<b>그대로 살아남</b>'],
            ['다른 프로그램', '메모장', '<b>엑셀</b>', '웹 · 모든 언어'],
            ['한 줄씩 처리', '쉬움', '쉬움', '어려움']],
            lead: '아주 크고 검색 · 수정이 잦으면 → 데이터베이스(sqlite3)',
            notes: '<p><b>[3분]</b> 고르는 기준을 한 문장으로: “표면 csv, 구조면 json, 줄글이면 txt”. 형식을 바꾸는 일은 “읽기 → 파이썬 자료 → 쓰기” 중 마지막만 고치면 된다는 점도 강조하세요.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: 'CSV 한 줄이 <code>회의,"9시, 3층 회의실"</code> 일 때 <code>line.split(",")</code> 의 결과는 몇 조각?', options: ['2', '3', '1', '오류'], answer: 1, explain: '따옴표 규칙을 모르는 split 은 3조각으로 쪼갭니다. csv.reader 는 2개로 정확히 나눕니다.',
            notes: '<p><b>[1분]</b> 앞 슬라이드를 직접 실행해 확인시키면 확실히 남습니다.</p>' },
          { layout: 'practice', title: '🚀 프로젝트 11-4. CSV 성적 리포트 생성기', desc: '<code>scores.csv</code> → 총점 · 평균 · 등급 계산 → 총점 순 정렬 · 과목별 통계 출력 → <code>report.csv</code> 저장', starter: `import csv

SUBJECTS = ["국어", "영어", "수학"]
students = []
with open("scores.csv", "r", encoding = "utf-8", newline = "") as inFp :
    for row in csv.DictReader(inFp) :
        pass    # TODO: 총점 · 평균 · 등급
`, solution: `import csv

SUBJECTS = ["국어", "영어", "수학"]

def total_of(s) :
    return s["총점"]

students = []
with open("scores.csv", "r", encoding = "utf-8", newline = "") as inFp :
    for row in csv.DictReader(inFp) :
        scores = [int(row[s]) for s in SUBJECTS]
        total = sum(scores)
        students.append({"이름": row["이름"], "총점": total,
                         "평균": round(total / 3, 1)})

students.sort(key = total_of, reverse = True)
for i, s in enumerate(students, 1) :
    print(i, s["이름"], s["총점"], s["평균"])
`,
            notes: '<p><b>[10분~]</b> 데이터 처리의 기본 흐름을 칠판에 적어 주세요: <b>읽기 → 파이썬 자료(리스트 · 딕셔너리) → 계산 → 쓰기</b>. 가운데만 바꾸면 어떤 리포트도 만들 수 있고, 마지막만 바꾸면 json 으로도 저장됩니다.</p><p>정렬의 <code>key</code> 는 “무엇을 기준으로 줄을 세울까”를 알려 주는 함수라고 설명합니다.</p>' },
          { layout: 'summary', title: '11장 정리', bullets: ['파일 처리: <code>open()</code> → <code>read · readline · readlines / write · writelines</code> → <code>close()</code> (또는 <code>with</code>)', '모드 <code>r · w · a · x</code> + <code>b</code> · <code>+</code>, 인코딩 <code>utf-8</code> · <code>cp949</code>, 큰 파일은 한 줄씩', '[프로그램 1] <code>ord · chr</code> 암호화 · [프로그램 2] RAW → 2차원 리스트 → <code>paper.put()</code>', '<code>os · os.path · shutil · zipfile · pathlib</code> 로 파일 · 폴더 · 압축 · 경로', '<code>try · except · else · finally · raise · logging</code> 으로 오류에도 멈추지 않기', '표는 <code>csv</code>, 구조는 <code>json</code> — 형식을 골라 데이터를 오래 보관하기'],
            notes: '<p><b>[2분]</b> 11장 전체를 정리합니다. 다음 장(12장 객체지향 프로그래밍) 예고: 지금까지 쓴 <code>inFp.readline()</code>, <code>p.exists()</code> 처럼 “변수.함수()” 형태가 바로 객체의 메서드입니다. 오늘 만든 프로젝트들을 클래스로 다시 쓰면 훨씬 깔끔해집니다.</p>' }
        ]
      }
    ]
  });
})();
