/* Chapter 07. 리스트, 튜플, 딕셔너리 */
(function () {
  /* ---------- SVG 도우미 ---------- */
  const MONO = "font-family:Consolas,'D2Coding',monospace";
  const box = (x, y, w, h, txt, o = {}) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx || 4}" fill="${o.fill || 'var(--card)'}" stroke="${o.stroke || 'var(--accent)'}" stroke-width="${o.sw || 3}"${o.dash ? ' stroke-dasharray="10 7"' : ''}/>` +
    (txt !== '' ? `<text x="${x + w / 2}" y="${y + h / 2 + (o.fs || 26) * 0.35}" text-anchor="middle" style="${MONO};font-size:${o.fs || 26}px;fill:${o.color || 'var(--fg)'}">${txt}</text>` : '');
  const label = (x, y, txt, o = {}) =>
    `<text x="${x}" y="${y}" text-anchor="${o.anchor || 'middle'}" style="${o.mono ? MONO + ';' : ''}font-size:${o.fs || 22}px;fill:${o.color || 'var(--muted)'};${o.bold ? 'font-weight:700' : ''}">${txt}</text>`;
  const arrowDefs = (id, color) => `<marker viewBox="0 0 12 12" id="${id}" markerWidth="4.5" markerHeight="4.5" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="${color}"/></marker>`;
  const line = (x1, y1, x2, y2, o = {}) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${o.color || 'var(--accent)'}" stroke-width="${o.sw || 4}"${o.dash ? ' stroke-dasharray="8 6"' : ''}${o.arrow ? ` marker-end="url(#${o.arrow})"` : ''}/>`;
  const row = (x, y, vals, cw, o = {}) => vals.map((v, i) => box(x + i * cw, y, cw, o.h || 70, v, { fs: o.fs || 26, stroke: o.strokeFn ? o.strokeFn(i) : (o.stroke || 'var(--accent)'), fill: o.fillFn ? o.fillFn(i) : undefined, color: o.colorFn ? o.colorFn(i) : undefined })).join('');

  /* 그림 7-1 리스트의 개념 */
  const SVG_LIST_CONCEPT = `<svg viewBox="0 0 1280 540" width="100%" role="img" aria-label="변수 여러 개와 리스트 하나의 비교">
  <defs>${arrowDefs('a7a', 'var(--accent2)')}</defs>
  ${label(150, 90, '하나씩', { fs: 24, bold: true, color: 'var(--accent2)' })}${label(150, 122, '변수로 사용', { fs: 24, bold: true, color: 'var(--accent2)' })}
  ${box(330, 110, 110, 80, '10', { stroke: 'var(--accent2)' })}${label(385, 220, '변수 a', { fs: 22, mono: true })}
  ${box(560, 50, 110, 80, '20', { stroke: 'var(--accent2)' })}${label(615, 160, '변수 b', { fs: 22, mono: true })}
  ${box(790, 95, 110, 80, '30', { stroke: 'var(--accent2)' })}${label(845, 205, '변수 c', { fs: 22, mono: true })}
  ${box(1020, 140, 110, 80, '40', { stroke: 'var(--accent2)' })}${label(1075, 250, '변수 d', { fs: 22, mono: true })}
  <line x1="40" y1="285" x2="1240" y2="285" stroke="var(--line)" stroke-width="2" stroke-dasharray="8 8"/>
  ${label(150, 370, '리스트로', { fs: 24, bold: true, color: 'var(--accent)' })}${label(150, 402, '묶어서 사용', { fs: 24, bold: true, color: 'var(--accent)' })}
  ${box(300, 345, 110, 70, 'aa', { stroke: 'var(--accent)', fill: 'none' })}
  ${line(412, 380, 470, 380, { arrow: 'a7a', color: 'var(--accent2)' })}
  ${row(480, 340, ['10', '20', '30', '40'], 150, { h: 80 })}
  ${[0, 1, 2, 3].map((i) => label(555 + i * 150, 460, 'aa[' + i + ']', { mono: true, fs: 24, color: 'var(--accent)' })).join('')}
  ${label(640, 515, '이름 하나(aa) + 번호(첨자, index)로 여러 값을 관리한다 — 번호는 0부터!', { fs: 24, color: 'var(--fg)' })}
</svg>`;

  /* 그림 7-2 for 문으로 리스트값 입력 */
  const SVG_FOR_INPUT = `<svg viewBox="0 0 1280 500" width="100%" role="img" aria-label="for 문으로 리스트의 각 칸에 값 입력">
  <defs>${arrowDefs('a7b', 'var(--accent)')}${arrowDefs('a7b2', 'var(--accent2)')}</defs>
  <rect x="40" y="40" width="520" height="250" rx="14" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  ${label(70, 90, 'for i in range(0, 4) :', { mono: true, fs: 28, anchor: 'start', color: 'var(--accent2)' })}
  ${label(110, 145, 'aa[i] = int(input(...))', { mono: true, fs: 28, anchor: 'start', color: 'var(--fg)' })}
  ${label(300, 215, '같은 한 줄이 4번 실행되지만', { fs: 22 })}${label(300, 250, 'i 가 0 → 1 → 2 → 3 으로 바뀐다', { fs: 22, color: 'var(--fg)' })}
  ${row(700, 110, ['10', '20', '30', '40'], 130, { h: 90, fs: 30 })}
  ${[0, 1, 2, 3].map((i) => label(765 + i * 130, 240, 'aa[' + i + ']', { mono: true, fs: 24, color: 'var(--accent)' })).join('')}
  ${[0, 1, 2, 3].map((i) => label(765 + i * 130, 80, 'i=' + i, { mono: true, fs: 22, color: 'var(--accent2)' }) ).join('')}
  ${line(565, 150, 690, 150, { arrow: 'a7b' })}
  ${label(640, 350, '반복할 때마다 i 값이 달라지므로 aa[0] 부터 aa[3] 까지 차례대로 채워진다', { fs: 24, color: 'var(--fg)' })}
  ${label(640, 400, '리스트의 첨자(index)는 변수 · 계산식으로도 쓸 수 있다  →  aa[i],  aa[i + 1],  aa[99 - i]', { fs: 22, mono: true })}
  ${label(640, 455, '값이 1,000개가 되어도 range(0, 1000) 만 바꾸면 된다', { fs: 22, color: 'var(--ok)' })}
</svg>`;

  /* 그림 7-3 리스트의 초기화 및 역순 대입 */
  const aaV = ['0', '2', '4', '…', '194', '196', '198'];
  const bbV = ['198', '196', '194', '…', '4', '2', '0'];
  const aaI = ['aa[0]', 'aa[1]', 'aa[2]', '', 'aa[97]', 'aa[98]', 'aa[99]'];
  const bbI = ['bb[0]', 'bb[1]', 'bb[2]', '', 'bb[97]', 'bb[98]', 'bb[99]'];
  const SVG_REVERSE = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="리스트 aa 를 역순으로 bb 에 넣기">
  <defs>${arrowDefs('a7c', 'var(--accent2)')}${arrowDefs('a7c2', 'var(--warn)')}</defs>
  ${label(40, 60, '① aa 를 짝수로 초기화', { fs: 24, bold: true, anchor: 'start', color: 'var(--accent)' })}
  ${label(40, 92, 'aa.append(value); value += 2', { fs: 20, mono: true, anchor: 'start' })}
  ${aaV.map((v, i) => v === '…' ? label(390 + i * 115 + 57, 160, '…', { fs: 34, color: 'var(--muted)' }) : box(390 + i * 115, 115, 115, 70, v, { fs: 26 })).join('')}
  ${aaI.map((v, i) => label(447 + i * 115, 215, v, { fs: 20, mono: true, color: 'var(--accent)' })).join('')}
  ${label(40, 380, '② bb 에 역순으로 대입', { fs: 24, bold: true, anchor: 'start', color: 'var(--accent2)' })}
  ${label(40, 412, 'bb.append(aa[99 - i])', { fs: 20, mono: true, anchor: 'start' })}
  ${bbV.map((v, i) => v === '…' ? label(390 + i * 115 + 57, 390, '…', { fs: 34, color: 'var(--muted)' }) : box(390 + i * 115, 345, 115, 70, v, { fs: 26, stroke: 'var(--accent2)' })).join('')}
  ${bbI.map((v, i) => label(447 + i * 115, 445, v, { fs: 20, mono: true, color: 'var(--accent2)' })).join('')}
  <path d="M1137,225 C1137,280 447,280 447,335" fill="none" stroke="var(--accent2)" stroke-width="3" marker-end="url(#a7c)"/>
  <path d="M1022,225 C1022,290 562,290 562,335" fill="none" stroke="var(--accent2)" stroke-width="3" marker-end="url(#a7c)"/>
  <path d="M447,225 C447,300 1137,290 1137,335" fill="none" stroke="var(--warn)" stroke-width="3" stroke-dasharray="8 6" marker-end="url(#a7c2)"/>
  ${label(640, 500, 'i = 0 이면 aa[99] → bb[0],  i = 1 이면 aa[98] → bb[1],  …,  i = 99 이면 aa[0] → bb[99]', { fs: 22, mono: true, color: 'var(--fg)' })}
  ${label(640, 540, '첨자 계산식 99 - i 가 “뒤에서부터” 꺼내 오는 열쇠', { fs: 22 })}
</svg>`;

  /* 인덱스(양수 · 음수)와 슬라이싱 경계 */
  const SVG_INDEX = `<svg viewBox="0 0 1280 600" width="100%" role="img" aria-label="리스트의 양수 인덱스, 음수 인덱스, 슬라이싱 경계">
  ${label(640, 50, 'aa = [10, 20, 30, 40]', { mono: true, fs: 30, color: 'var(--fg)' })}
  ${label(250, 130, '양수 인덱스', { fs: 22, anchor: 'end', color: 'var(--accent)' })}
  ${[0, 1, 2, 3].map((i) => label(365 + i * 160, 130, '[' + i + ']', { mono: true, fs: 26, color: 'var(--accent)' })).join('')}
  ${row(285, 150, ['10', '20', '30', '40'], 160, { h: 90, fs: 32 })}
  ${label(250, 290, '음수 인덱스', { fs: 22, anchor: 'end', color: 'var(--accent2)' })}
  ${[-4, -3, -2, -1].map((v, i) => label(365 + i * 160, 290, '[' + v + ']', { mono: true, fs: 26, color: 'var(--accent2)' })).join('')}
  <line x1="40" y1="330" x2="1240" y2="330" stroke="var(--line)" stroke-width="2" stroke-dasharray="8 8"/>
  ${label(640, 375, '슬라이싱은 “칸”이 아니라 칸 사이의 “경계” 번호로 자른다', { fs: 24, bold: true, color: 'var(--fg)' })}
  ${row(285, 400, ['10', '20', '30', '40'], 160, { h: 70, fs: 28, strokeFn: (i) => (i >= 1 && i < 3 ? 'var(--warn)' : 'var(--accent)'), fillFn: (i) => (i >= 1 && i < 3 ? 'var(--card)' : 'none') })}
  ${[0, 1, 2, 3, 4].map((i) => `<line x1="${285 + i * 160}" y1="390" x2="${285 + i * 160}" y2="490" stroke="var(--warn)" stroke-width="3"/>` + label(285 + i * 160, 515, i, { mono: true, fs: 26, color: 'var(--warn)' })).join('')}
  <path d="M445,545 v14 h320 v-14" fill="none" stroke="var(--warn)" stroke-width="4"/>
  ${label(605, 590, 'aa[1:3]  →  [20, 30]   (경계 1부터 경계 3까지, 끝 번호 칸은 포함 안 함)', { fs: 22, mono: true, color: 'var(--warn)' })}
</svg>`;

  /* 슬라이싱 간격(step) */
  const SVG_STEP = `<svg viewBox="0 0 1280 420" width="100%" role="img" aria-label="슬라이싱 간격 지정">
  <defs>${arrowDefs('a7d', 'var(--accent2)')}${arrowDefs('a7d2', 'var(--danger)')}</defs>
  ${label(640, 44, 'aa = [10, 20, 30, 40, 50, 60, 70]', { mono: true, fs: 28, color: 'var(--fg)' })}
  ${row(220, 80, ['10', '20', '30', '40', '50', '60', '70'], 120, { h: 70, fs: 28, strokeFn: (i) => (i % 2 === 0 ? 'var(--accent2)' : 'var(--line)'), colorFn: (i) => (i % 2 === 0 ? 'var(--fg)' : 'var(--muted)') })}
  ${[0, 1, 2, 3, 4, 5, 6].map((i) => label(280 + i * 120, 180, '[' + i + ']', { mono: true, fs: 20 })).join('')}
  ${[0, 2, 4].map((i) => `<path d="M${280 + i * 120},${75} C${280 + i * 120},40 ${520 + i * 120},40 ${520 + i * 120},${72}" fill="none" stroke="var(--accent2)" stroke-width="3" marker-end="url(#a7d)"/>`).join('')}
  ${label(220, 230, 'aa[::2]   →  [10, 30, 50, 70]    처음부터 끝까지 2칸씩 건너뛰며', { mono: true, fs: 24, anchor: 'start', color: 'var(--accent2)' })}
  ${label(220, 290, 'aa[::-2]  →  [70, 50, 30, 10]    끝에서부터 거꾸로 2칸씩', { mono: true, fs: 24, anchor: 'start', color: 'var(--danger)' })}
  ${label(220, 350, 'aa[::-1]  →  [70, 60, 50, 40, 30, 20, 10]   통째로 뒤집기', { mono: true, fs: 24, anchor: 'start', color: 'var(--fg)' })}
  ${label(640, 405, '형식:  리스트[시작 : 끝 : 간격]   (생략하면 시작=처음, 끝=마지막까지, 간격=1)', { fs: 22 })}
</svg>`;

  const SVG_PROGRAMS = `<svg viewBox="0 0 1280 520" width="100%" role="img" aria-label="이 장에서 만들 두 프로그램">
  <rect x="30" y="30" width="590" height="460" rx="16" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  ${label(325, 75, '[프로그램 1] 밖으로 나가는 거북이', { fs: 26, bold: true, color: 'var(--accent)' })}
  ${(() => { let s = ''; const cols = ['var(--accent)', 'var(--accent2)', 'var(--warn)', 'var(--ok)', 'var(--danger)']; for (let k = 0; k < 22; k++) { const a = k * 2 * Math.PI / 22 + 0.2; const r = 110 + (k * 37 % 70); const x = 325 + Math.cos(a) * r, y = 280 + Math.sin(a) * r * 0.8; const c = cols[k % 5]; s += `<line x1="325" y1="280" x2="${x.toFixed(0)}" y2="${y.toFixed(0)}" stroke="${c}" stroke-width="2" opacity="0.7"/>`; s += k % 3 === 0 ? `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${10 + k % 4 * 3}" fill="${c}"/>` : k % 3 === 1 ? `<rect x="${(x - 9).toFixed(0)}" y="${(y - 9).toFixed(0)}" width="18" height="18" fill="${c}"/>` : `<path d="M${(x - 10).toFixed(0)},${(y - 10).toFixed(0)} L${(x + 12).toFixed(0)},${y.toFixed(0)} L${(x - 10).toFixed(0)},${(y + 10).toFixed(0)} z" fill="${c}"/>`; } return s; })()}
  ${label(325, 470, '거북이 100마리의 정보를 2차원 리스트에 저장', { fs: 20 })}
  <rect x="660" y="30" width="590" height="460" rx="16" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
  ${label(955, 75, '[프로그램 2] 음식 궁합 출력', { fs: 26, bold: true, color: 'var(--accent2)' })}
  ${label(690, 140, '[\'떡볶이\', \'짜장면\', …] 중 좋아하는 음식은?치킨', { fs: 18, mono: true, anchor: 'start', color: 'var(--fg)' })}
  ${label(690, 175, '&lt;치킨&gt; 궁합 음식은 &lt;치킨무&gt;입니다.', { fs: 18, mono: true, anchor: 'start', color: 'var(--accent2)' })}
  ${label(690, 215, '[\'떡볶이\', \'짜장면\', …] 중 좋아하는 음식은?짬뽕', { fs: 18, mono: true, anchor: 'start', color: 'var(--fg)' })}
  ${label(690, 250, '그런 음식이 없습니다. 확인해 보세요.', { fs: 18, mono: true, anchor: 'start', color: 'var(--danger)' })}
  ${label(690, 290, '[\'떡볶이\', \'짜장면\', …] 중 좋아하는 음식은?끝', { fs: 18, mono: true, anchor: 'start', color: 'var(--fg)' })}
  ${box(720, 340, 150, 60, '"치킨"', { fs: 22, stroke: 'var(--accent2)' })}${label(905, 378, '→', { fs: 30, color: 'var(--fg)' })}${box(940, 340, 170, 60, '"치킨무"', { fs: 22, stroke: 'var(--ok)' })}
  ${label(795, 430, '키(key)', { fs: 20, color: 'var(--accent2)' })}${label(1025, 430, '값(value)', { fs: 20, color: 'var(--ok)' })}
  ${label(955, 470, '“끝”을 입력할 때까지 반복', { fs: 20 })}
</svg>`;

  /* 그림 7-4 · 7-5 1차원/2차원 리스트 */
  const SVG_2D = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="1차원 리스트와 2차원 리스트">
  <defs>${arrowDefs('a7e', 'var(--accent2)')}</defs>
  ${label(40, 50, '1차원 리스트', { fs: 24, bold: true, anchor: 'start', color: 'var(--fg)' })}
  ${label(40, 90, 'aa = [10, 20, 30]', { fs: 24, mono: true, anchor: 'start' })}
  ${row(360, 50, ['10', '20', '30'], 120, { h: 60 })}
  ${[0, 1, 2].map((i) => label(420 + i * 120, 140, 'aa[' + i + ']', { mono: true, fs: 20, color: 'var(--accent)' })).join('')}
  <line x1="40" y1="170" x2="1240" y2="170" stroke="var(--line)" stroke-width="2" stroke-dasharray="8 8"/>
  ${label(40, 215, '2차원 리스트 (3행 4열)', { fs: 24, bold: true, anchor: 'start', color: 'var(--fg)' })}
  ${label(40, 260, 'aa = [[1, 2, 3, 4],', { fs: 22, mono: true, anchor: 'start' })}
  ${label(40, 292, '      [5, 6, 7, 8],', { fs: 22, mono: true, anchor: 'start' })}
  ${label(40, 324, '      [9, 10, 11, 12]]', { fs: 22, mono: true, anchor: 'start' })}
  ${[0, 1, 2].map((i) => label(560, 280 + i * 85, 'aa[' + i + ']', { mono: true, fs: 22, anchor: 'end', color: 'var(--accent2)' }) + line(568, 272 + i * 85, 600, 272 + i * 85, { color: 'var(--accent2)', arrow: 'a7e', sw: 3 }) +
    [0, 1, 2, 3].map((k) => box(610 + k * 150, 235 + i * 85, 150, 75, 'aa[' + i + '][' + k + ']', { fs: 20, stroke: i === 1 && k === 2 ? 'var(--danger)' : 'var(--accent)', sw: i === 1 && k === 2 ? 5 : 3 })).join('')).join('')}
  ${[0, 1, 2, 3].map((k) => label(685 + k * 150, 222, '열 ' + k, { fs: 20, color: 'var(--accent)' })).join('')}
  ${label(40, 420, 'aa[1][2] → 1행(두 번째 줄)의 2열(세 번째 칸) = 7', { fs: 22, anchor: 'start', color: 'var(--danger)' })}
  ${label(40, 470, 'aa[i] 는 한 행 전체(1차원 리스트)', { fs: 22, anchor: 'start', color: 'var(--fg)' })}
  ${label(640, 540, '전체 리스트명: aa  ·  첨자는 [행][열] 순서, 모두 0부터', { fs: 22 })}
</svg>`;

  /* 그림 7-6 불규칙한 크기 */
  const SVG_JAGGED = `<svg viewBox="0 0 1280 420" width="100%" role="img" aria-label="불규칙한 크기의 2차원 리스트">
  ${label(40, 60, 'aa = [[1, 2, 3, 4],', { fs: 26, mono: true, anchor: 'start', color: 'var(--fg)' })}
  ${label(40, 100, '      [5, 6],', { fs: 26, mono: true, anchor: 'start', color: 'var(--fg)' })}
  ${label(40, 140, '      [7, 8, 9]]', { fs: 26, mono: true, anchor: 'start', color: 'var(--fg)' })}
  ${[[1, 2, 3, 4], [5, 6], [7, 8, 9]].map((r, i) => r.map((v, k) => box(460 + k * 150, 30 + i * 95, 150, 80, 'aa[' + i + '][' + k + ']', { fs: 20 })).join('') + label(1100, 80 + i * 95, 'len(aa[' + i + ']) = ' + r.length, { mono: true, fs: 22, anchor: 'start', color: 'var(--accent2)' })).join('')}
  ${label(640, 360, '행마다 항목 수가 달라도 된다 → 안쪽 반복은 range(len(aa[i]))', { fs: 24, color: 'var(--fg)' })}
</svg>`;

  /* 행 순회 · 열 순회 · 전치 */
  const TR_LEFT = [[80, 85, 90], [70, 80, 95], [90, 90, 85]];
  const SVG_TRANSPOSE = `<svg viewBox="0 0 1280 470" width="100%" role="img" aria-label="2차원 리스트의 행 순회, 열 순회, 그리고 zip(*) 전치">
  <defs>${arrowDefs('a7h', 'var(--accent2)')}</defs>
  ${label(335, 45, 'scores — 행 = 학생, 열 = 과목', { fs: 24, bold: true, color: 'var(--fg)' })}
  ${['국어', '영어', '수학'].map((s, k) => label(225 + k * 110, 100, s, { fs: 20, color: 'var(--accent)' })).join('')}
  ${TR_LEFT.map((r, i) => label(160, 155 + i * 70, '학생 ' + (i + 1), { fs: 20, anchor: 'end', color: 'var(--accent2)' }) +
    r.map((v, k) => box(170 + k * 110, 115 + i * 70, 110, 70, String(v), { fs: 24 })).join('')).join('')}
  <rect x="168" y="113" width="334" height="74" rx="6" fill="none" stroke="var(--ok)" stroke-width="4"/>
  ${label(335, 375, 'scores[0] — 한 행 = 한 학생의 점수', { fs: 20, color: 'var(--ok)' })}
  <rect x="278" y="113" width="114" height="214" rx="6" fill="none" stroke="var(--warn)" stroke-width="4" stroke-dasharray="9 6"/>
  ${label(335, 410, '열은 행마다 scores[i][1] 을 모아야 한다', { fs: 20, color: 'var(--warn)' })}
  ${line(530, 220, 760, 220, { arrow: 'a7h', color: 'var(--accent2)', sw: 5 })}
  ${label(645, 195, 'zip(*scores)', { fs: 24, mono: true, bold: true, color: 'var(--accent2)' })}
  ${label(645, 255, '행과 열을 맞바꾼다 (전치)', { fs: 20 })}
  ${label(985, 45, '전치 결과 — 행 = 과목, 열 = 학생', { fs: 24, bold: true, color: 'var(--fg)' })}
  ${['학생1', '학생2', '학생3'].map((s, k) => label(875 + k * 110, 100, s, { fs: 20, color: 'var(--accent2)' })).join('')}
  ${[0, 1, 2].map((k) => label(810, 155 + k * 70, ['국어', '영어', '수학'][k], { fs: 20, anchor: 'end', color: 'var(--accent)' }) +
    [0, 1, 2].map((i) => box(820 + i * 110, 115 + k * 70, 110, 70, String(TR_LEFT[i][k]), { fs: 24, stroke: k === 1 ? 'var(--warn)' : 'var(--accent)' })).join('')).join('')}
  ${label(985, 375, '이제 한 행이 한 과목 → sum(행) 이 과목 합계', { fs: 20, color: 'var(--ok)' })}
  ${label(640, 455, '열 방향으로 계산할 일이 많으면 전치해 두고 행처럼 다루는 편이 읽기 쉽다', { fs: 22, color: 'var(--fg)' })}
</svg>`;

  /* [프로그램 1] 거북이 2차원 리스트 */
  const SVG_TURTLE_LIST = `<svg viewBox="0 0 1280 460" width="100%" role="img" aria-label="거북이 정보 2차원 리스트">
  ${label(640, 40, 'playerTurtles.append([myTurtle, tX, tY, tSize, r, g, b])', { mono: true, fs: 26, color: 'var(--fg)' })}
  ${['거북이', 'X위치', 'Y위치', '크기', 'R', 'G', 'B'].map((h, k) => label(270 + k * 140, 95, 'tList[' + k + ']', { mono: true, fs: 20, color: 'var(--accent)' }) + label(270 + k * 140, 125, h, { fs: 20, color: 'var(--accent2)' })).join('')}
  ${[['🐢1', '-120', '85', '2', '0.31', '0.72', '0.15'], ['🐢2', '203', '-44', '1', '0.90', '0.12', '0.55'], ['🐢3', '-18', '-230', '1', '0.05', '0.48', '0.88']].map((r, i) =>
    label(185, 185 + i * 80, '[' + i + ']', { mono: true, fs: 22, anchor: 'end' }) + r.map((v, k) => box(200 + k * 140, 145 + i * 80, 140, 65, v, { fs: 22, stroke: k === 0 ? 'var(--accent2)' : k >= 4 ? 'var(--warn)' : 'var(--accent)' })).join('')).join('')}
  ${label(185, 410, '…', { fs: 30, anchor: 'end' })}${label(690, 410, '… 모두 100행 (거북이 100마리)', { fs: 22 })}
  ${label(640, 450, 'for tList in playerTurtles :  → 한 행(거북이 한 마리)씩 꺼내 색 · 크기 설정 후 goto(tList[1], tList[2])', { fs: 20, mono: true, color: 'var(--fg)' })}
</svg>`;

  /* 딕셔너리 구조 */
  const SVG_DICT = `<svg viewBox="0 0 1280 480" width="100%" role="img" aria-label="딕셔너리의 키와 값">
  <defs>${arrowDefs('a7f', 'var(--ok)')}</defs>
  ${label(640, 46, "student1 = {'학번': 1000, '이름': '홍길동', '학과': '컴퓨터학과'}", { mono: true, fs: 24, color: 'var(--fg)' })}
  ${label(390, 105, '키(key)', { fs: 24, bold: true, color: 'var(--accent2)' })}${label(850, 105, '값(value)', { fs: 24, bold: true, color: 'var(--ok)' })}
  ${[["'학번'", '1000'], ["'이름'", "'홍길동'"], ["'학과'", "'컴퓨터학과'"]].map((p, i) =>
    box(290, 130 + i * 90, 200, 70, p[0], { fs: 24, stroke: 'var(--accent2)' }) + line(492, 165 + i * 90, 700, 165 + i * 90, { color: 'var(--ok)', arrow: 'a7f' }) + box(710, 130 + i * 90, 280, 70, p[1], { fs: 24, stroke: 'var(--ok)' })).join('')}
  ${label(640, 435, '순서 번호 대신 “이름표(키)”로 값을 찾는다:  student1[\'이름\'] → \'홍길동\'', { fs: 22, color: 'var(--fg)' })}
  ${label(640, 470, '키는 중복될 수 없고(같은 키 → 마지막 값만 남음), 값은 중복되어도 된다', { fs: 20 })}
</svg>`;

  /* 집합 연산 벤 다이어그램 */
  const venn = (x, title, op, hl) => `<g>
    <circle cx="${x + 110}" cy="190" r="95" fill="${hl.includes('L') ? 'var(--accent)' : 'none'}" fill-opacity="0.25" stroke="var(--accent)" stroke-width="3"/>
    <circle cx="${x + 200}" cy="190" r="95" fill="${hl.includes('R') ? 'var(--accent2)' : 'none'}" fill-opacity="0.25" stroke="var(--accent2)" stroke-width="3"/>
    ${hl.includes('M') ? `<path d="M${x + 155},107 A95,95 0 0,1 ${x + 155},273 A95,95 0 0,1 ${x + 155},107 z" fill="var(--warn)" fill-opacity="0.55"/>` : ''}
    ${hl.includes('X') ? `<path d="M${x + 155},107 A95,95 0 0,1 ${x + 155},273 A95,95 0 0,1 ${x + 155},107 z" fill="var(--card)"/>` : ''}
    ${label(x + 155, 70, title, { fs: 22, bold: true, color: 'var(--fg)' })}${label(x + 155, 325, op, { fs: 22, mono: true, color: 'var(--accent)' })}</g>`;
  const SVG_SET = `<svg viewBox="0 0 1280 440" width="100%" role="img" aria-label="세트의 교집합, 합집합, 차집합, 대칭 차집합">
  ${label(640, 30, 'mySet1 = {1, 2, 3, 4, 5}      mySet2 = {4, 5, 6, 7}', { mono: true, fs: 24, color: 'var(--fg)' })}
  ${venn(0, '교집합', '&amp;', 'M')}${venn(320, '합집합', '|', 'LRM')}${venn(640, '차집합', '-', 'LX')}${venn(960, '대칭 차집합', '^', 'LRX')}
  ${label(155, 370, '{4, 5}', { mono: true, fs: 22, color: 'var(--fg)' })}${label(475, 370, '{1, …, 7}', { mono: true, fs: 22, color: 'var(--fg)' })}${label(795, 370, '{1, 2, 3}', { mono: true, fs: 22, color: 'var(--fg)' })}${label(1115, 370, '{1, 2, 3, 6, 7}', { mono: true, fs: 22, color: 'var(--fg)' })}
  ${label(155, 410, 'intersection()', { mono: true, fs: 18 })}${label(475, 410, 'union()', { mono: true, fs: 18 })}${label(795, 410, 'difference()', { mono: true, fs: 18 })}${label(1115, 410, 'symmetric_difference()', { mono: true, fs: 18 })}
</svg>`;

  /* 그림 7-7 · 7-8 리스트 복사 */
  const SVG_COPY = `<svg viewBox="0 0 1280 440" width="100%" role="img" aria-label="newList = oldList 와 newList = oldList[:] 의 차이">
  <defs>${arrowDefs('a7g', 'var(--accent)')}${arrowDefs('a7g2', 'var(--ok)')}</defs>
  ${label(320, 40, '그림 7-7  newList = oldList', { fs: 24, bold: true, color: 'var(--danger)' })}
  ${label(960, 40, '그림 7-8  newList = oldList[:]', { fs: 24, bold: true, color: 'var(--ok)' })}
  ${label(140, 80, '코드(이름)', { fs: 20 })}${label(450, 80, '메모리(리스트)', { fs: 20 })}
  ${box(60, 130, 170, 60, 'oldList', { fs: 22, stroke: 'var(--accent2)' })}${box(60, 250, 170, 60, 'newList', { fs: 22, stroke: 'var(--accent2)' })}
  ${box(330, 180, 280, 80, '', { stroke: 'var(--accent)' })}${label(470, 215, "['짬뽕', '탕수육',", { fs: 18, mono: true, color: 'var(--fg)' })}${label(470, 242, "'군만두', '깐풍기']", { fs: 18, mono: true, color: 'var(--fg)' })}
  ${line(232, 160, 325, 205, { arrow: 'a7g' })}${line(232, 280, 325, 240, { arrow: 'a7g' })}
  ${label(320, 350, '두 이름이 같은 리스트 하나를 공유', { fs: 22, color: 'var(--fg)' })}${label(320, 385, '→ oldList 를 바꾸면 newList 도 바뀐다', { fs: 20, color: 'var(--danger)' })}
  <line x1="640" y1="60" x2="640" y2="420" stroke="var(--line)" stroke-width="2" stroke-dasharray="8 8"/>
  ${box(680, 130, 170, 60, 'oldList', { fs: 22, stroke: 'var(--accent2)' })}${box(680, 260, 170, 60, 'newList', { fs: 22, stroke: 'var(--accent2)' })}
  ${box(930, 115, 300, 90, '', { stroke: 'var(--accent)' })}${label(1080, 152, "['짬뽕', '탕수육',", { fs: 18, mono: true, color: 'var(--fg)' })}${label(1080, 180, "'군만두', '깐풍기']", { fs: 18, mono: true, color: 'var(--fg)' })}
  ${box(930, 245, 300, 90, '', { stroke: 'var(--ok)' })}${label(1080, 282, "['짜장면', '탕수육',", { fs: 18, mono: true, color: 'var(--fg)' })}${label(1080, 310, "'군만두']", { fs: 18, mono: true, color: 'var(--fg)' })}
  ${line(852, 160, 925, 160, { arrow: 'a7g' })}${line(852, 290, 925, 290, { arrow: 'a7g2', color: 'var(--ok)' })}
  ${label(960, 385, '내용을 복사한 새 리스트 → 서로 영향 없음', { fs: 20, color: 'var(--ok)' })}
</svg>`;

  /* 그림 7-9 ~ 7-13 스택 */
  const car = (x, y, name, color) => `<g><rect x="${x}" y="${y + 14}" width="130" height="34" rx="12" fill="${color}"/><path d="M${x + 25},${y + 16} L${x + 45},${y} L${x + 90},${y} L${x + 110},${y + 16} z" fill="${color}"/><circle cx="${x + 30}" cy="${y + 50}" r="11" fill="var(--fg)"/><circle cx="${x + 100}" cy="${y + 50}" r="11" fill="var(--fg)"/><text x="${x + 65}" y="${y + 40}" text-anchor="middle" style="font-size:22px;font-weight:700;fill:#fff">${name}</text></g>`;
  const CAR_COL = { A: '#e2574c', B: '#e6a93b', C: '#4e9f78' };
  const parking = (y, cars, top, note, out) => {
    let s = `<rect x="60" y="${y}" width="16" height="110" fill="#b07050"/>`;
    for (let i = 0; i < 5; i++) {
      s += `<rect x="${80 + i * 170}" y="${y}" width="164" height="110" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>`;
      s += label(162 + i * 170, y + 100, 'parking[' + i + ']', { fs: 18, mono: true });
      if (cars[i]) s += car(97 + i * 170, y + 15, cars[i], CAR_COL[cars[i]]);
    }
    s += `<rect x="${112 + top * 170}" y="${y - 50}" width="120" height="38" rx="6" fill="var(--accent)"/>` + label(172 + top * 170, y - 23, 'top = ' + top, { fs: 20, bold: true, color: '#fff' });
    if (out) s += car(990, y + 15, out, CAR_COL[out]) + label(1055, y + 100, 'pop ➜ 빠져나감', { fs: 18, color: 'var(--ok)' });
    s += label(1240, y - 20, note, { fs: 20, anchor: 'end', color: 'var(--fg)' });
    return s;
  };
  const SVG_STACK = `<svg viewBox="0 0 1280 600" width="100%" role="img" aria-label="리스트로 구현한 스택: 주차장">
  ${parking(70, [], 0, 'parking = []; top = 0  (비어 있는 주차장)')}
  ${parking(250, ['A', 'B', 'C'], 3, 'append 3번(push) → top = 3')}
  ${parking(430, ['A', 'B'], 2, 'top -= 1; parking.pop() → 자동차C', 'C')}
  ${label(640, 590, '한쪽이 막힌 주차장: 입구 겸 출구는 오른쪽 하나 → 마지막에 들어간 차가 가장 먼저 나온다 (LIFO)', { fs: 20 })}
</svg>`;

  PY_COURSE.addChapter({
    id: 'ch07',
    no: '07',
    title: '리스트, 튜플, 딕셔너리',
    subtitle: 'list · tuple · dict · set',
    summary: '여러 개의 값을 하나로 묶어 다루는 리스트 · 튜플 · 딕셔너리 · 세트를 배우고, 2차원 리스트로 거북이 100마리를 움직이는 프로그램과 딕셔너리로 음식 궁합을 알려 주는 프로그램을 만듭니다.',
    goals: [
      '리스트를 만들고 첨자(인덱스) · 슬라이싱으로 값을 읽고 바꿀 수 있다',
      'append · pop · sort · insert 등 리스트 조작 함수를 활용할 수 있다',
      '2차원 리스트를 중첩 for 문으로 다룰 수 있다',
      '튜플의 특징(수정 불가)을 이해하고 리스트와 변환할 수 있다',
      '딕셔너리를 키 · 값의 쌍으로 만들고 keys · values · items · get 을 활용할 수 있다',
      '세트, 컴프리헨션, zip(), 리스트 복사, 스택 구현 등 심화 내용을 이해한다',
      '가변 · 불변과 참조를 이해하고 얕은 복사 · 깊은 복사를 구분해 쓸 수 있다',
      '언패킹 · sort(key=) · 중첩 자료구조 · collections 로 실전에 가까운 코드를 쓸 수 있다',
      '상황에 맞는 자료형(리스트 · 튜플 · 딕셔너리 · 세트 · deque)을 고를 수 있다'
    ],
    sections: [
      /* ===================== ch07-1 ===================== */
      {
        id: 'ch07-1',
        title: '리스트의 개념과 생성',
        minutes: 50,
        goals: ['리스트가 필요한 이유를 설명할 수 있다', '빈 리스트를 만들고 append() 로 항목을 추가할 수 있다', 'for 문과 첨자를 함께 써서 리스트에 값을 입력 · 합계를 구할 수 있다', '리스트를 초기화하고 다른 리스트에 역순으로 옮길 수 있다', '리스트를 만드는 여러 방법을 상황에 맞게 고를 수 있다', '변수는 이름표이고 리스트는 객체임을 알고 <code>is</code> 와 <code>==</code> 를 구분할 수 있다'],
        flow: [['도입: 이 장에서 만들 프로그램', 4], ['리스트의 개념 · 필요성', 9], ['빈 리스트와 append()', 8], ['for 문으로 입력 · 합계', 9], ['초기화 · 만드는 방법 비교', 8], ['📘 이름표와 객체 (is · ==)', 7], ['정리 · 퀴즈', 5]],
        content: [
          { type: 'h', text: '이 장에서 만들 프로그램' },
          { type: 'p', html: '지금까지는 값 하나를 변수 하나에 저장했습니다. 이번 장에서는 <b>여러 개의 값을 한 덩어리로 묶어</b> 다루는 방법을 배웁니다. 이 방법을 익히면 다음 두 프로그램을 만들 수 있습니다.' },
          { type: 'figure', html: SVG_PROGRAMS, caption: '이 장에서 완성할 두 프로그램' },
          { type: 'list', items: [
            '<b>[프로그램 1] 화면 중앙에서 밖으로 나가는 거북이</b> — 모양 · 위치 · 크기 · 색상이 제각각인 거북이 100마리의 정보를 <b>2차원 리스트</b>에 저장했다가, 차례대로 꺼내 화면 중앙에서 바깥으로 이동시킵니다. (7-3 교시)',
            '<b>[프로그램 2] 딕셔너리를 활용한 음식 궁합 출력</b> — <code>"치킨" → "치킨무"</code> 처럼 짝을 이루는 정보를 <b>딕셔너리</b>에 저장하고, 사용자가 음식 이름을 입력하면 궁합 음식을 알려 줍니다. “끝”을 입력하면 종료합니다. (7-5 교시)'
          ] },
          { type: 'h', text: '리스트의 개념' },
          { type: 'p', html: '<b>리스트(list)</b>는 여러 개의 값을 <b>순서대로</b> 담아 두는 상자 묶음입니다. 변수 <code>a, b, c, d</code> 네 개를 따로 만드는 대신 이름이 <code>aa</code> 인 리스트 하나를 만들고, 각 칸을 <code>aa[0]</code>, <code>aa[1]</code>, <code>aa[2]</code>, <code>aa[3]</code> 처럼 <b>번호</b>로 구분합니다. 이 번호를 <b>첨자</b> 또는 <b>인덱스(index)</b>라고 하며 <mark>항상 0부터 시작</mark>합니다.' },
          { type: 'figure', html: SVG_LIST_CONCEPT, caption: '그림 7-1 리스트의 개념 — 따로 떨어진 변수 4개 vs 이름 하나로 묶인 리스트' },
          { type: 'callout', kind: 'tip', title: 'Tip · 다른 언어의 배열(Array)과 비교', html: 'C/C++ 나 자바에는 파이썬의 리스트 대신 비슷한 개념인 <b>배열(array)</b>이 있습니다. 배열은 <b>같은 자료형</b>만 묶을 수 있어서 정수 배열에는 정수만 넣어야 합니다. 반면 파이썬의 리스트는 정수 · 실수 · 문자열 등 <b>서로 다른 자료형도 한 리스트에 함께</b> 담을 수 있고, 실행 중에 크기를 마음대로 늘리고 줄일 수 있습니다.' },
          { type: 'code', repl: true, title: '추가 예제. 리스트를 만들어 살펴보기', code: `aa = [10, 20, 30, 40]
aa
type(aa)
len(aa)
aa[0]
aa[3]`, expect: `>>> aa = [10, 20, 30, 40]
>>> aa
[10, 20, 30, 40]
>>> type(aa)
<class 'list'>
>>> len(aa)
4
>>> aa[0]
10
>>> aa[3]
40
>>>`, desc: '<code>type()</code> 으로 확인하면 리스트의 자료형 이름은 <code>list</code> 입니다. <code>len()</code> 은 리스트에 들어 있는 항목의 <b>개수</b>를 알려 줍니다. 항목이 4개이면 첨자는 0 ~ 3 입니다.' },
          { type: 'h', text: '리스트의 필요성' },
          { type: 'p', html: '정수 4개를 입력받아 합계를 출력하는 프로그램을 변수만으로 만들어 봅시다. 변수 <code>a, b, c, d</code> 를 준비하고 하나씩 입력받습니다.' },
          { type: 'code', title: 'Code07-01. 변수 4개로 합계 구하기', stdin: '10\n20\n30\n40\n', code: `a, b, c, d = 0, 0, 0, 0
hap = 0

a = int(input("1번째 숫자 : "))
b = int(input("2번째 숫자 : "))
c = int(input("3번째 숫자 : "))
d = int(input("4번째 숫자 : "))

hap = a + b + c + d

print("합계 ==> %d" % hap)`, expect: `1번째 숫자 : 10
2번째 숫자 : 20
3번째 숫자 : 30
4번째 숫자 : 40
합계 ==> 100`, desc: '입력이 4개일 때는 괜찮아 보이지만, 숫자가 100개라면 변수 100개를 만들고 <code>input()</code> 줄도 100번 써야 합니다. <code>9행</code>의 덧셈식도 100개의 변수를 모두 나열해야 하지요.' },
          { type: 'p', html: '리스트는 다음 형식으로 만듭니다. 대괄호 <code>[ ]</code> 안에 값을 쉼표로 구분해 나열합니다.' },
          { type: 'code', run: false, title: '리스트 생성 형식', code: `리스트명 = [값1, 값2, 값3, …]

aa = [10, 20, 30, 40]` },
          { type: 'table', head: ['❶ 각 변수 사용', '❷ 리스트 사용'], rows: [
            ['<code>a, b, c, d = 10, 20, 30, 40</code>', '<code>aa = [10, 20, 30, 40]</code>'],
            ['<code>a</code> 사용', '<code>aa[0]</code> 사용'],
            ['<code>b</code> 사용', '<code>aa[1]</code> 사용'],
            ['<code>c</code> 사용', '<code>aa[2]</code> 사용'],
            ['<code>d</code> 사용', '<code>aa[3]</code> 사용']
          ], caption: '변수 4개와 리스트 1개의 사용법 비교' },
          { type: 'p', html: 'Code07-01 을 리스트로 바꾸면 다음과 같습니다. 변수 이름이 <code>aa[0]</code> ~ <code>aa[3]</code> 으로 바뀌었을 뿐 결과는 같습니다.' },
          { type: 'code', title: 'Code07-02. 리스트로 합계 구하기', stdin: '10\n20\n30\n40\n', code: `aa = [0, 0, 0, 0]
hap = 0

aa[0] = int(input("1번째 숫자 : "))
aa[1] = int(input("2번째 숫자 : "))
aa[2] = int(input("3번째 숫자 : "))
aa[3] = int(input("4번째 숫자 : "))

hap = aa[0] + aa[1] + aa[2] + aa[3]

print("합계 ==> %d" % hap)`, expect: `1번째 숫자 : 10
2번째 숫자 : 20
3번째 숫자 : 30
4번째 숫자 : 40
합계 ==> 100`, desc: '<code>1행</code>에서 0 네 개로 채운 리스트를 먼저 만들어 두었기 때문에 <code>aa[0]</code> ~ <code>aa[3]</code> 칸에 값을 넣을 수 있습니다. 아직은 코드 길이가 똑같지만, 첨자가 <b>숫자</b>라는 점이 핵심입니다. 숫자는 반복문의 변수로 바꿀 수 있으니까요!' },
          { type: 'h', text: '리스트의 일반적인 사용 — 빈 리스트와 append()' },
          { type: 'p', html: '처음부터 항목 개수를 정해 두지 않고 <b>빈 리스트</b> <code>[]</code> 를 만든 다음, <code>리스트명.append(값)</code> 으로 맨 뒤에 항목을 하나씩 붙여 나가는 방법이 더 많이 쓰입니다. <code>append</code> 는 “덧붙이다”라는 뜻입니다.' },
          { type: 'code', title: '빈 리스트에 항목 4개 추가하기', code: `aa = []
aa.append(0)
aa.append(0)
aa.append(0)
aa.append(0)
print(aa)`, expect: '[0, 0, 0, 0]' },
          { type: 'p', html: '<code>append()</code> 를 반복문 안에 넣으면 항목 100개짜리 리스트도 세 줄이면 만들 수 있습니다. 다음은 <code>&gt;&gt;&gt;</code> 셸에서 실행하는 예입니다.' },
          { type: 'code', repl: true, title: '항목 100개짜리 리스트 만들기 (대화형 모드)', code: `aa = []
for i in range(0, 100) :
    aa.append(0)

len(aa)`, expect: `>>> aa = []
>>> for i in range(0, 100) :
...     aa.append(0)
...
>>> len(aa)
100
>>>`, desc: '셸에서 <code>for</code> 문처럼 들여쓴 블록을 입력할 때는 마지막에 <b>빈 줄</b>을 한 번 더 입력해야 블록이 끝나고 실행됩니다.' },
          { type: 'h', text: '반복문과 함께 쓰는 리스트' },
          { type: 'p', html: '첨자 자리에 숫자 대신 <b>변수 <code>i</code></b> 를 쓰면, <code>i</code> 가 0, 1, 2, 3 으로 바뀌면서 <code>aa[0]</code> 부터 <code>aa[3]</code> 까지 차례대로 다룰 수 있습니다.' },
          { type: 'figure', html: SVG_FOR_INPUT, caption: '그림 7-2 for 문으로 리스트값 입력' },
          { type: 'code', title: 'Code07-03. for 문으로 리스트에 입력하기', stdin: '10\n20\n30\n40\n', code: `aa = []
for i in range(0, 4) :
    aa.append(0)
hap = 0

for i in range(0, 4) :
    aa[i] = int(input(str(i + 1) + "번째 숫자 : "))

hap = aa[0] + aa[1] + aa[2] + aa[3]

print("합계 ==> %d" % hap)`, expect: `1번째 숫자 : 10
2번째 숫자 : 20
3번째 숫자 : 30
4번째 숫자 : 40
합계 ==> 100`, desc: '<code>1~3행</code>: 0 을 4번 추가해 <code>[0, 0, 0, 0]</code> 을 만듭니다. <code>6~7행</code>: <code>i</code> 가 0 ~ 3 으로 바뀌며 입력값을 <code>aa[i]</code> 에 저장합니다. 안내 문구의 번호는 사람에게 익숙하도록 <code>i + 1</code> 을 문자열로 바꿔(<code>str()</code>) 붙였습니다.' },
          { type: 'p', html: '<code>9행</code>의 덧셈도 반복문으로 바꿀 수 있습니다. 이렇게 하면 항목이 몇 개든 코드가 늘어나지 않습니다.' },
          { type: 'code', title: 'Code07-03 수정. 합계도 for 문으로 구하기', stdin: '10\n20\n30\n40\n', code: `aa = []
for i in range(0, 4) :
    aa.append(0)
hap = 0

for i in range(0, 4) :
    aa[i] = int(input(str(i + 1) + "번째 숫자 : "))

for i in range(0, 4) :
    hap = hap + aa[i]

print("합계 ==> %d" % hap)`, expect: `1번째 숫자 : 10
2번째 숫자 : 20
3번째 숫자 : 30
4번째 숫자 : 40
합계 ==> 100` },
          { type: 'callout', kind: 'more', title: '📘 더 파이썬다운 방법: len() 과 sum()', html: '<ul><li><code>range(0, 4)</code> 의 4 를 직접 쓰는 대신 <code>range(0, len(aa))</code> 로 쓰면 리스트 크기가 바뀌어도 고칠 곳이 없습니다.</li><li>리스트의 합계는 내장 함수 <code>sum(aa)</code> 로 한 번에 구할 수 있습니다. 최댓값 · 최솟값은 <code>max(aa)</code>, <code>min(aa)</code>.</li><li><code>for 값 in 리스트 :</code> 형식을 쓰면 첨자 없이 항목을 하나씩 꺼낼 수 있습니다: <code>for num in aa : hap += num</code></li></ul>' },
          { type: 'code', title: '추가 예제. len() · sum() · for-in 으로 합계 구하기', stdin: '10\n20\n30\n40\n', code: `aa = []
for i in range(0, 4) :
    aa.append(int(input(str(i + 1) + "번째 숫자 : ")))

hap = 0
for num in aa :          # 첨자 없이 항목을 하나씩 꺼낸다
    hap = hap + num
print("for-in 합계 ==> %d" % hap)

print("sum() 합계 ==> %d" % sum(aa))
print("항목 수 : %d, 최댓값 : %d, 최솟값 : %d" % (len(aa), max(aa), min(aa)))`, expect: `1번째 숫자 : 10
2번째 숫자 : 20
3번째 숫자 : 30
4번째 숫자 : 40
for-in 합계 ==> 100
sum() 합계 ==> 100
항목 수 : 4, 최댓값 : 40, 최솟값 : 10`, desc: '<code>3행</code>처럼 입력받은 값을 바로 <code>append()</code> 하면 0 으로 미리 채워 둘 필요도 없습니다.' },
          { type: 'h', text: '리스트의 생성과 초기화' },
          { type: 'p', html: '리스트에는 어떤 값이든 넣을 수 있습니다. 다음은 여러 가지 리스트를 만드는 예입니다.' },
          { type: 'code', repl: true, title: '다양한 리스트 생성', code: `aa = []
bb = [10, 20, 30]
cc = ['파이썬', '공부는', '꿀잼']
dd = [10, 20, '파이썬']
aa
bb
cc
dd`, expect: `>>> aa = []
>>> bb = [10, 20, 30]
>>> cc = ['파이썬', '공부는', '꿀잼']
>>> dd = [10, 20, '파이썬']
>>> aa
[]
>>> bb
[10, 20, 30]
>>> cc
['파이썬', '공부는', '꿀잼']
>>> dd
[10, 20, '파이썬']
>>>`, desc: '❶ 빈 리스트 ❷ 정수로만 구성된 리스트 ❸ 문자열로만 구성된 리스트 ❹ 여러 자료형을 섞은 리스트' },
          { type: 'p', html: '이번에는 항목 100개짜리 리스트 <code>aa</code> 를 0, 2, 4, 6, … 처럼 <b>2의 배수</b>로 채운 뒤, 그 값을 리스트 <code>bb</code> 에 <b>거꾸로(역순)</b> 옮겨 봅시다.' },
          { type: 'figure', html: SVG_REVERSE, caption: '그림 7-3 리스트의 초기화 및 역순 대입' },
          { type: 'code', title: 'Code07-04. 초기화와 역순 대입', code: `aa = []
bb = []
value = 0

for i in range(0, 100) :
    aa.append(value)
    value += 2

for i in range(0, 100) :
    bb.append(aa[99 - i])

print("bb[0]에는 %d이, bb[99]에는 %d이 입력됩니다." % (bb[0], bb[99]))`, expect: 'bb[0]에는 198이, bb[99]에는 0이 입력됩니다.', desc: '<code>5~7행</code>: 0 부터 2씩 늘린 값 100개(0 ~ 198)를 <code>aa</code> 에 추가합니다. <code>9~10행</code>: <code>i</code> 가 0 일 때 <code>aa[99]</code>, 1 일 때 <code>aa[98]</code> … 을 꺼내 <code>bb</code> 에 붙이므로 순서가 뒤집힙니다.' },
          { type: 'callout', kind: 'more', title: '📘 리스트를 빠르게 초기화하는 다른 방법', html: '<ul><li><code>[0] * 100</code> → 0 이 100개인 리스트 (리스트의 곱셈, 7-2 교시)</li><li><code>list(range(0, 200, 2))</code> → 0, 2, 4, …, 198 (range 를 리스트로 변환)</li><li><code>aa[::-1]</code> → 거꾸로 뒤집은 새 리스트 (슬라이싱, 7-2 교시)</li><li><code>[v * 2 for v in range(100)]</code> → 컴프리헨션 (7-6 교시)</li></ul>' },
          { type: 'code', title: '추가 예제. Code07-04 를 짧게 쓰기', code: `aa = list(range(0, 200, 2))   # 0, 2, 4, ..., 198
bb = aa[::-1]                 # 거꾸로 뒤집은 새 리스트
print("aa의 앞부분 :", aa[:5])
print("bb의 앞부분 :", bb[:5])
print("bb[0]에는 %d이, bb[99]에는 %d이 입력됩니다." % (bb[0], bb[99]))

zeros = [0] * 10
print(zeros)`, expect: `aa의 앞부분 : [0, 2, 4, 6, 8]
bb의 앞부분 : [198, 196, 194, 192, 190]
bb[0]에는 198이, bb[99]에는 0이 입력됩니다.
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]`, desc: '<code>aa[:5]</code> 는 “앞에서 5개”를 잘라 낸 새 리스트입니다. 슬라이싱은 다음 교시에 자세히 배웁니다.' },
          { type: 'h', text: '리스트를 만드는 네 가지 방법 — 무엇을 언제 쓰나' },
          { type: 'p', html: '같은 리스트라도 만드는 방법은 여러 가지입니다. 입문 단계에서는 ❶ 만 알아도 충분하지만, 상황에 맞는 방법을 고르면 코드가 짧아지고 <b>실수할 곳이 줄어듭니다</b>. “짧게 쓰는 것”이 목적이 아니라 <b>읽는 사람이 의도를 바로 알아보게 하는 것</b>이 목적입니다.' },
          { type: 'table', head: ['방법', '코드', '언제 쓰나'], rows: [
            ['❶ 하나씩 추가', '<code>aa = []</code> 뒤에 <code>aa.append(값)</code>', '값이 하나씩 생길 때 — 입력받을 때, 조건에 맞는 것만 고를 때'],
            ['❷ 같은 값으로 채우기', '<code>aa = [0] * 100</code>', '칸을 먼저 만들어 두고 나중에 <code>aa[i] = 값</code> 으로 채울 때'],
            ['❸ 규칙적인 수', '<code>aa = list(range(0, 200, 2))</code>', '0, 2, 4 … 처럼 일정한 간격의 숫자열'],
            ['❹ 컴프리헨션', '<code>aa = [v * 2 for v in range(100)]</code>', '“각 항목을 계산해서 모은다”는 규칙이 있을 때 (7-6 교시)']
          ], caption: '리스트를 만드는 방법 비교 — ❷ 는 문자열 · 리스트를 담을 때 주의가 필요합니다(7-3 교시)' },
          { type: 'code', title: '추가 예제. 네 가지 방법으로 같은 리스트 만들기', code: `aa = []
for v in range(0, 10, 2) :
    aa.append(v)

bb = [0] * 5
for i in range(0, 5) :
    bb[i] = i * 2

cc = list(range(0, 10, 2))
dd = [i * 2 for i in range(0, 5)]

print(aa)
print(bb)
print(cc)
print(dd)
print(aa == bb == cc == dd)`, expect: `[0, 2, 4, 6, 8]
[0, 2, 4, 6, 8]
[0, 2, 4, 6, 8]
[0, 2, 4, 6, 8]
True`, desc: '네 결과가 모두 같습니다. <code>==</code> 는 두 리스트의 <b>내용</b>이 같은지 비교합니다(항목의 값과 순서가 모두 같아야 True).' },
          { type: 'h', text: '흔한 오류: 없는 칸에 접근하기 (IndexError)' },
          { type: 'p', html: '항목이 4개인 리스트의 첨자는 0 ~ 3 입니다. 그 밖의 첨자를 쓰면 <code>IndexError</code> 가 발생합니다. 또 빈 리스트 <code>[]</code> 에 <code>aa[0] = 10</code> 처럼 값을 넣으려 해도 같은 오류가 납니다. 빈 리스트에는 <code>append()</code> 로 추가해야 합니다.' },
          { type: 'code', repl: true, title: '추가 예제. 첨자 범위를 벗어나면?', code: `aa = [10, 20, 30, 40]
aa[3]
aa[4]
bb = []
bb[0] = 10`, expect: `>>> aa = [10, 20, 30, 40]
>>> aa[3]
40
>>> aa[4]
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
IndexError: list index out of range
>>> bb = []
>>> bb[0] = 10
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
IndexError: list assignment index out of range
>>>`, desc: '오류 메시지의 <code>list index out of range</code> 는 “리스트 첨자가 범위를 벗어났다”는 뜻입니다. 빈 리스트에 첨자로 값을 넣으려 할 때는 <code>list assignment index out of range</code>(대입할 칸이 없음)가 나옵니다. 스크립트로 실행하면 오류 메시지에 <code>line 3</code> 처럼 줄 번호가 나오므로 어느 줄이 문제인지 찾을 수 있습니다.' },
          { type: 'callout', kind: 'warn', title: '자주 하는 실수', html: '<ul><li>첨자를 1부터 세는 습관: 첫 항목은 <code>aa[1]</code> 이 아니라 <code>aa[0]</code></li><li>마지막 항목을 <code>aa[len(aa)]</code> 로 접근 → <code>aa[len(aa) - 1]</code> 또는 <code>aa[-1]</code></li><li>빈 리스트에 <code>aa[0] = 값</code> → <code>aa.append(값)</code></li><li><code>aa.append(1, 2)</code> 처럼 한 번에 여러 개 추가 → <code>append</code> 는 값을 <b>하나</b>만 받습니다 (여러 개는 <code>extend</code>)</li></ul>' },
          { type: 'h', text: '📘 더 알아보기: 변수는 “이름표”, 리스트는 “객체”' },
          { type: 'p', html: '<code>a = 10</code> 을 “상자 a 에 10 을 넣는다”고 배웠지만, 파이썬에서는 <b>값(객체)이 메모리에 만들어지고 변수는 거기에 <mark>이름표</mark>를 붙이는 것</b>에 가깝습니다. 리스트처럼 큰 자료에서는 이 차이가 눈에 보입니다. <code>bb = aa</code> 는 리스트를 <b>복사하는 것이 아니라</b> 같은 리스트에 이름표를 하나 더 붙이는 것입니다.' },
          { type: 'code', title: '추가 예제. 이름표(변수)와 객체 — is 와 ==', code: `aa = [10, 20, 30]
bb = aa          # 같은 리스트에 이름표 하나 더 (복사 아님!)
cc = aa[:]       # 내용을 복사한 새 리스트

bb.append(40)    # bb 를 바꿨는데...
cc.append(99)

print("aa :", aa)
print("bb :", bb)
print("cc :", cc)
print("aa is bb :", aa is bb)     # 같은 객체인가?
print("aa is cc :", aa is cc)
print("aa == cc :", aa == cc)     # 내용이 같은가?`, expect: `aa : [10, 20, 30, 40]
bb : [10, 20, 30, 40]
cc : [10, 20, 30, 99]
aa is bb : True
aa is cc : False
aa == cc : False`, desc: '<code>is</code> 는 “<b>같은 객체</b>인가”, <code>==</code> 는 “<b>내용</b>이 같은가”를 묻습니다. <code>bb</code> 를 바꿨는데 <code>aa</code> 까지 바뀐 이유는 둘이 같은 리스트이기 때문입니다. 이 성질은 7-6 교시(리스트의 복사)에서 다시 자세히 다룹니다.' },
          { type: 'callout', kind: 'more', title: '📘 가변(mutable)과 불변(immutable)', html: '<ul><li><b>가변</b> — 리스트 · 딕셔너리 · 세트: 만든 뒤에 <b>내용을 바꿀 수 있습니다</b>. 그래서 이름표를 공유하면 서로 영향을 받습니다.</li><li><b>불변</b> — 숫자 · 문자열 · 튜플: 내용을 바꿀 수 없습니다. <code>s = s + "!"</code> 는 기존 문자열을 고친 것이 아니라 <b>새 문자열</b>을 만들어 이름표를 옮겨 붙인 것입니다. 그래서 다른 이름표는 영향을 받지 않습니다.</li></ul>“왜 이런 걸 알아야 하나요?” — 리스트를 함수에 넘기거나 다른 변수에 대입했을 때 <b>원본이 바뀌는 버그</b>의 원인이 거의 항상 이것이기 때문입니다.' },
          { type: 'code', repl: true, title: '추가 예제. 불변인 문자열 · 숫자는 서로 영향이 없다', code: `s = "python"
t = s
t = t + "!"
s
t
x = 10
y = x
y += 5
x, y`, expect: `>>> s = "python"
>>> t = s
>>> t = t + "!"
>>> s
'python'
>>> t
'python!'
>>> x = 10
>>> y = x
>>> y += 5
>>> x, y
(10, 15)
>>>`, desc: '문자열과 숫자는 불변이라 <code>t</code> 를 바꿔도 <code>s</code> 는 그대로입니다. 반면 리스트는 가변이라 앞 예제처럼 함께 바뀝니다.' },
          { type: 'callout', kind: 'more', title: '📘 IDLE 에서 실습할 때', html: '강의자료의 “IDLE 대화형 모드” 예제는 이 강좌의 <b>콘솔 &gt;&gt;&gt; 셸</b>에서, “스크립트 모드” 예제는 <b>편집기 + ▶ 실행(Ctrl+Enter)</b> 으로 실행합니다. 집에서 python.org 의 파이썬을 설치했다면 IDLE 의 Shell 창이 &gt;&gt;&gt; 셸, <b>File → New File</b> 로 연 편집기 창이 스크립트 모드(F5 로 실행)에 해당합니다.' }
        ],
        practice: [
          {
            title: 'SELF STUDY 7-1. 10개 입력받아 합계 구하기',
            level: 1,
            desc: '<p>값을 4개가 아닌 <b>10개</b> 입력받아 합계를 출력하도록 Code07-03 을 수정하세요. 또 합계를 구하는 마지막 <code>for</code> 문 대신 <b><code>while</code> 문</b>을 사용하세요.</p><pre>1번째 숫자 : 1\n2번째 숫자 : 2\n…\n10번째 숫자 : 10\n합계 ==> 55</pre>',
            hint: '<code>range(0, 4)</code> 를 <code>range(0, 10)</code> 으로 바꿉니다. <code>while</code> 문은 <code>i = 0</code> 으로 시작해서 <code>i &lt; 10</code> 동안 <code>hap</code> 에 <code>aa[i]</code> 를 더하고 <code>i += 1</code> 합니다.',
            starter: `aa = []
for i in range(0, 4) :
    aa.append(0)
hap = 0

for i in range(0, 4) :
    aa[i] = int(input(str(i + 1) + "번째 숫자 : "))

# TODO: 10개를 입력받도록 위 코드를 고치고,
# TODO: while 문으로 합계를 구하세요.

print("합계 ==> %d" % hap)
`,
            solution: `aa = []
for i in range(0, 10) :
    aa.append(0)
hap = 0

for i in range(0, 10) :
    aa[i] = int(input(str(i + 1) + "번째 숫자 : "))

i = 0
while i < 10 :
    hap = hap + aa[i]
    i += 1

print("합계 ==> %d" % hap)
`,
            stdin: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n',
            expect: `1번째 숫자 : 1
2번째 숫자 : 2
3번째 숫자 : 3
4번째 숫자 : 4
5번째 숫자 : 5
6번째 숫자 : 6
7번째 숫자 : 7
8번째 숫자 : 8
9번째 숫자 : 9
10번째 숫자 : 10
합계 ==> 55`
          },
          {
            title: 'SELF STUDY 7-2. 3의 배수 200개를 역순으로',
            level: 1,
            desc: '<p>Code07-04 를 수정해서 리스트 <code>aa</code> 에 <b>3의 배수를 200개</b>(0, 3, 6, …) 입력하고, 리스트 <code>bb</code> 에는 <code>aa</code> 의 역순으로 입력하세요. 마지막에 <code>bb[0]</code> 과 <code>bb[199]</code> 의 값을 출력합니다.</p><pre>bb[0]에는 597이, bb[199]에는 0이 입력됩니다.</pre>',
            hint: '반복 횟수 100 → 200, 증가값 2 → 3, 역순 첨자 <code>99 - i</code> → <code>199 - i</code> 세 곳을 바꿉니다.',
            starter: `aa = []
bb = []
value = 0

# TODO: aa 에 3의 배수 200개 추가

# TODO: bb 에 aa 의 역순으로 추가

# print("bb[0]에는 %d이, bb[199]에는 %d이 입력됩니다." % (bb[0], bb[199]))
`,
            solution: `aa = []
bb = []
value = 0

for i in range(0, 200) :
    aa.append(value)
    value += 3

for i in range(0, 200) :
    bb.append(aa[199 - i])

print("bb[0]에는 %d이, bb[199]에는 %d이 입력됩니다." % (bb[0], bb[199]))
`,
            expect: 'bb[0]에는 597이, bb[199]에는 0이 입력됩니다.'
          },
          {
            title: '실습 7-1. 기온 리스트 살펴보기',
            level: 1,
            desc: '<p>일주일 기온이 담긴 리스트가 주어집니다. 다음을 차례로 출력하세요.</p><ol><li>항목 수</li><li>첫 값과 마지막 값</li><li>합계</li><li>평균(소수점 한 자리)</li><li>최고 기온과 최저 기온</li></ol><pre>항목 수 : 7\n첫 값 : 12 / 마지막 값 : 8\n합계 : 140\n평균 : 20.0\n최고 : 31 / 최저 : 8</pre>',
            hint: '<code>len()</code>, <code>sum()</code>, <code>max()</code>, <code>min()</code> 을 씁니다. 마지막 값은 <code>temps[len(temps) - 1]</code> 입니다. (다음 교시에 배울 <code>temps[-1]</code> 도 같은 뜻입니다)',
            starter: `temps = [12, 18, 25, 31, 27, 19, 8]

# TODO: 항목 수, 첫 값 · 마지막 값
# TODO: 합계, 평균(소수점 한 자리)
# TODO: 최고 · 최저
`,
            solution: `temps = [12, 18, 25, 31, 27, 19, 8]

print("항목 수 :", len(temps))
print("첫 값 :", temps[0], "/ 마지막 값 :", temps[len(temps) - 1])
print("합계 :", sum(temps))
print("평균 : %.1f" % (sum(temps) / len(temps)))
print("최고 :", max(temps), "/ 최저 :", min(temps))
`,
            expect: `항목 수 : 7
첫 값 : 12 / 마지막 값 : 8
합계 : 140
평균 : 20.0
최고 : 31 / 최저 : 8`
          },
          {
            title: '실습 7-2. 점수 입력받아 평균과 최고점 구하기',
            level: 2,
            desc: '<p>학생 수를 먼저 입력받고, 그 수만큼 점수를 입력받아 리스트에 저장하세요. 그런 다음 <b>평균</b>(소수점 한 자리)과 <b>최고 점수</b>, 그리고 <b>평균 이상인 점수의 개수</b>를 출력하세요. 최고 점수는 <code>max()</code> 를 쓰지 말고 반복문으로 직접 구해 보세요.</p><pre>학생 수 : 5\n1번 학생 점수 : 80\n…\n평균 : 84.0\n최고 점수 : 95\n평균 이상 : 3명</pre>',
            hint: '빈 리스트에 <code>append()</code> 로 점수를 넣습니다. 최고 점수는 <code>best = scores[0]</code> 로 시작해서 더 큰 값을 만나면 바꿉니다.',
            starter: `count = int(input("학생 수 : "))
scores = []

# TODO: count 번 반복하며 점수를 입력받아 scores 에 추가

# TODO: 평균, 최고 점수(반복문으로), 평균 이상 인원 출력
`,
            solution: `count = int(input("학생 수 : "))
scores = []

for i in range(0, count) :
    scores.append(int(input(str(i + 1) + "번 학생 점수 : ")))

hap = 0
for s in scores :
    hap += s
avg = hap / len(scores)

best = scores[0]
for s in scores :
    if s > best :
        best = s

over = 0
for s in scores :
    if s >= avg :
        over += 1

print("평균 : %.1f" % avg)
print("최고 점수 : %d" % best)
print("평균 이상 : %d명" % over)
`,
            stdin: '5\n80\n95\n70\n90\n85\n',
            expect: `학생 수 : 5
1번 학생 점수 : 80
2번 학생 점수 : 95
3번 학생 점수 : 70
4번 학생 점수 : 90
5번 학생 점수 : 85
평균 : 84.0
최고 점수 : 95
평균 이상 : 3명`
          },
          {
            title: '실습 7-3. 월별 판매량 리포트',
            level: 2,
            desc: '<p>1월부터 12월까지의 판매량이 리스트로 주어집니다. 다음 리포트를 출력하세요.</p><ol><li>총 판매량과 월 평균(소수점 한 자리)</li><li>가장 많이 팔린 달이 <b>몇 월</b>인지와 그 수량 — <code>max()</code> 와 <code>index()</code> 를 함께 사용</li><li>월 평균 이상 팔린 달이 몇 개월인지</li><li>상반기(1~6월) 합계와 하반기(7~12월) 합계</li></ol><pre>총 판매량 : 1665\n월 평균 : 138.8\n최다 판매 : 12월 (180개)\n평균 이상인 달 : 7개월\n상반기 735 / 하반기 930</pre>',
            hint: '리스트의 첨자는 0부터이므로 “몇 월”은 <code>index</code> 에 1을 더합니다. 상 · 하반기 합계는 <code>for i in range(0, 6)</code> 처럼 범위를 나누어 더하거나, 다음 교시에 배울 슬라이싱 <code>sum(sales[0:6])</code> 을 써도 됩니다.',
            starter: `sales = [120, 95, 140, 160, 130, 90, 175, 155, 110, 145, 165, 180]

# TODO: 총 판매량과 월 평균

# TODO: 최다 판매 월 (max 와 index)

# TODO: 평균 이상인 달의 수

# TODO: 상반기 · 하반기 합계
`,
            solution: `sales = [120, 95, 140, 160, 130, 90, 175, 155, 110, 145, 165, 180]

total = sum(sales)
avg = total / len(sales)
print("총 판매량 :", total)
print("월 평균 : %.1f" % avg)

best = max(sales)
print("최다 판매 : %d월 (%d개)" % (sales.index(best) + 1, best))

over = 0
for s in sales :
    if s >= avg :
        over += 1
print("평균 이상인 달 : %d개월" % over)

first, second = 0, 0
for i in range(0, 6) :
    first += sales[i]
for i in range(6, 12) :
    second += sales[i]
print("상반기 %d / 하반기 %d" % (first, second))
`,
            expect: `총 판매량 : 1665
월 평균 : 138.8
최다 판매 : 12월 (180개)
평균 이상인 달 : 7개월
상반기 735 / 하반기 930`
          },
          {
            title: '실습 7-4. 숫자 통계 도구 만들기',
            level: 3,
            desc: '<p>숫자를 원하는 만큼 입력받아 통계를 내는 프로그램을 만드세요.</p><p><b>요구 사항</b></p><ul><li><b>입력</b> — <code>"숫자(끝: 종료) : "</code> 로 계속 입력받고, <code>끝</code> 을 입력하면 입력을 멈춥니다.</li><li>입력한 숫자는 리스트에 저장합니다(정수로 변환).</li><li><b>출력</b> — 개수 · 합계 · 평균(소수점 <b>두</b> 자리), 최댓값 · 최솟값, 평균보다 <b>큰</b> 값들의 리스트, 입력의 <b>역순</b> 리스트</li><li>하나도 입력하지 않고 끝내면 <code>입력된 숫자가 없습니다.</code> 만 출력합니다(나누기 오류 방지!).</li></ul><pre>숫자(끝: 종료) : 15\n…\n숫자(끝: 종료) : 끝\n개수 : 5, 합계 : 95, 평균 : 19.00\n최댓값 : 42, 최솟값 : 7\n평균보다 큰 수 : [23, 42]\n역순 : [8, 42, 23, 7, 15]</pre><p>👉 <b>더 해 보기</b>: 평균 이상 · 이하를 각각 세어 보기, 0 을 입력하면 무시하기, 짝수만 모은 리스트도 함께 출력하기.</p>',
            hint: '<code>while True :</code> 안에서 <code>if s == \'끝\' : break</code>. 리스트가 비었는지는 <code>if len(nums) == 0 :</code> 로 먼저 확인해야 <code>ZeroDivisionError</code> 를 막을 수 있습니다. 역순은 <code>nums[len(nums) - 1 - i]</code> 를 <code>append</code> 하면 됩니다.',
            starter: `nums = []

while True :
    s = input("숫자(끝: 종료) : ")
    if s == '끝' :
        break
    # TODO: 정수로 바꿔 nums 에 추가

# TODO: 비어 있으면 안내만 출력

# TODO: 개수 · 합계 · 평균 · 최대 · 최소

# TODO: 평균보다 큰 수, 역순 리스트
`,
            solution: `nums = []

while True :
    s = input("숫자(끝: 종료) : ")
    if s == '끝' :
        break
    nums.append(int(s))

if len(nums) == 0 :
    print("입력된 숫자가 없습니다.")
else :
    total = sum(nums)
    avg = total / len(nums)
    print("개수 : %d, 합계 : %d, 평균 : %.2f" % (len(nums), total, avg))
    print("최댓값 : %d, 최솟값 : %d" % (max(nums), min(nums)))

    big = []
    for n in nums :
        if n > avg :
            big.append(n)
    print("평균보다 큰 수 :", big)

    back = []
    for i in range(0, len(nums)) :
        back.append(nums[len(nums) - 1 - i])
    print("역순 :", back)
`,
            stdin: '15\n7\n23\n42\n8\n끝\n',
            expect: `숫자(끝: 종료) : 15
숫자(끝: 종료) : 7
숫자(끝: 종료) : 23
숫자(끝: 종료) : 42
숫자(끝: 종료) : 8
숫자(끝: 종료) : 끝
개수 : 5, 합계 : 95, 평균 : 19.00
최댓값 : 42, 최솟값 : 7
평균보다 큰 수 : [23, 42]
역순 : [8, 42, 23, 7, 15]`
          }
        ],
        quiz: [
          { q: '다음 코드의 실행 결과는?<pre><code>aa = [5, 10, 15, 20]\nprint(aa[1] + aa[3])</code></pre>', options: ['15', '25', '30', '35'], answer: 2, explain: '첨자는 0부터이므로 <code>aa[1]</code> = 10, <code>aa[3]</code> = 20 → 30' },
          { q: '빈 리스트 <code>aa = []</code> 에 값 7 을 추가하는 올바른 코드는?', options: ['<code>aa[0] = 7</code>', '<code>aa.append(7)</code>', '<code>aa.add(7)</code>', '<code>aa + 7</code>'], answer: 1, explain: '빈 리스트에는 칸이 없으므로 <code>aa[0] = 7</code> 은 IndexError. 맨 뒤에 추가하는 함수는 <code>append()</code> 입니다.' },
          { q: '다음 코드 실행 후 <code>len(aa)</code> 의 값은?<pre><code>aa = []\nfor i in range(0, 10, 2) :\n    aa.append(i)</code></pre>', options: ['2', '5', '10', '11'], answer: 1, explain: '<code>range(0, 10, 2)</code> 는 0, 2, 4, 6, 8 — 5번 반복하므로 항목이 5개입니다.' },
          { q: '<code>aa</code> 가 항목 100개인 리스트일 때, <code>bb.append(aa[99 - i])</code> 를 i = 0 ~ 99 로 반복하면 <code>bb[0]</code> 에 들어가는 값은?', options: ['<code>aa[0]</code>', '<code>aa[1]</code>', '<code>aa[98]</code>', '<code>aa[99]</code>'], answer: 3, explain: 'i = 0 일 때 <code>aa[99 - 0]</code> = <code>aa[99]</code> 가 가장 먼저 추가됩니다.' },
          { q: '파이썬 리스트에 대한 설명으로 <b>틀린</b> 것은?', options: ['첨자는 0부터 시작한다', '서로 다른 자료형을 한 리스트에 넣을 수 있다', '한 번 만든 리스트의 크기는 바꿀 수 없다', '<code>len()</code> 으로 항목 수를 알 수 있다'], answer: 2, explain: '리스트는 <code>append()</code> 등으로 실행 중에 얼마든지 늘리고 줄일 수 있습니다. (크기가 고정인 것은 C/자바의 배열)' },
          { q: '다음 코드의 실행 결과는?<pre><code>aa = [1, 2]\nbb = aa\nbb.append(3)\nprint(aa, aa is bb)</code></pre>', options: ['<code>[1, 2] False</code>', '<code>[1, 2] True</code>', '<code>[1, 2, 3] True</code>', '<code>[1, 2, 3] False</code>'], answer: 2, explain: '<code>bb = aa</code> 는 복사가 아니라 같은 리스트에 이름표를 하나 더 붙인 것입니다. 그래서 <code>bb</code> 를 바꾸면 <code>aa</code> 도 바뀌고 <code>aa is bb</code> 는 True 입니다. 독립된 복사본은 <code>bb = aa[:]</code>.' }
        ],
        slides: [
          { layout: 'title', title: '리스트의 개념과 생성', subtitle: 'Chapter 07 · Section 01~02 — 리스트, 튜플, 딕셔너리', badge: '07-1',
            notes: '<p><b>[도입 1분]</b> 학습목표 4가지(리스트 · 튜플 · 딕셔너리 · 심화)를 소개합니다. 이번 장은 분량이 많아 6교시로 나눕니다.</p><p>“지금까지 변수 하나에 값 하나를 넣었죠? 학생 30명의 점수를 저장하려면?” 으로 시작합니다.</p>' },
          { layout: 'diagram', title: '이 장에서 만들 프로그램', html: SVG_PROGRAMS, caption: '[프로그램 1] 2차원 리스트 + 터틀 · [프로그램 2] 딕셔너리 + 입력 반복',
            notes: '<p><b>[3분]</b> 완성 프로그램을 미리 실행해 보여 주면 동기 부여가 됩니다. 7-3 교시의 Code07-07, 7-5 교시의 Code07-10 을 교사 화면에서 실행하세요.</p><p>질문: “거북이 100마리의 모양 · 위치 · 색을 변수로 저장하면 변수가 몇 개 필요할까?” → 700개!</p>' },
          { layout: 'diagram', title: '리스트의 개념', html: SVG_LIST_CONCEPT, caption: '그림 7-1 이름 하나 + 첨자로 여러 값 관리',
            notes: '<p><b>[4분]</b> 비유: 사물함 한 줄 — 사물함 이름(aa)은 하나, 칸 번호(첨자)로 구분. 단 번호가 0번부터!</p><p>Tip: C/자바의 배열은 같은 자료형만, 파이썬 리스트는 섞어서 저장 가능 + 크기 변경 가능.</p>' },
          { layout: 'code', title: 'Code07-01. 변수 4개로 합계', stdin: '10\n20\n30\n40\n', code: `a, b, c, d = 0, 0, 0, 0
hap = 0

a = int(input("1번째 숫자 : "))
b = int(input("2번째 숫자 : "))
c = int(input("3번째 숫자 : "))
d = int(input("4번째 숫자 : "))

hap = a + b + c + d

print("합계 ==> %d" % hap)`, points: ['입력 4개 → 변수 4개', '숫자가 100개라면?', 'input 줄 · 덧셈식이 계속 늘어남'],
            notes: '<p><b>[3분]</b> “예시 입력으로 실행” 버튼으로 10, 20, 30, 40 을 넣어 실행합니다. 문제점을 학생 입으로 말하게 유도하세요.</p>' },
          { layout: 'two', title: '리스트 생성 형식', left: { title: '❶ 각 변수 사용', code: `a, b, c, d = 10, 20, 30, 40
print(a, b, c, d)`, run: true }, right: { title: '❷ 리스트 사용', code: `aa = [10, 20, 30, 40]
print(aa[0], aa[1], aa[2], aa[3])` },
            notes: '<p><b>[2분]</b> 형식: <code>리스트명 = [값1, 값2, …]</code>. 대괄호, 쉼표 구분. 첨자로 접근한다는 점을 강조합니다.</p>' },
          { layout: 'code', title: 'Code07-02. 리스트로 바꾸기', stdin: '10\n20\n30\n40\n', code: `aa = [0, 0, 0, 0]
hap = 0

aa[0] = int(input("1번째 숫자 : "))
aa[1] = int(input("2번째 숫자 : "))
aa[2] = int(input("3번째 숫자 : "))
aa[3] = int(input("4번째 숫자 : "))

hap = aa[0] + aa[1] + aa[2] + aa[3]

print("합계 ==> %d" % hap)`, points: ['1행: 0으로 칸 4개 준비', '변수 이름만 aa[0]~aa[3]', '첨자가 <b>숫자</b> → 반복문 가능!'],
            notes: '<p><b>[2분]</b> “아직 코드가 줄지 않았는데 왜 리스트를 쓸까?” → 첨자를 변수 i 로 바꿀 수 있기 때문 (다음 슬라이드).</p>' },
          { layout: 'code', repl: true, title: '빈 리스트와 append()', code: `aa = []
aa.append(0)
aa.append(0)
aa
bb = []
for i in range(0, 100) :
    aa.append(0)

len(aa)`, points: ['<code>[]</code> 빈 리스트', '<code>append(값)</code>: 맨 뒤에 추가', '반복문 + append → 100개도 간단'],
            notes: '<p><b>[4분]</b> 셸에서 한 줄씩 실행합니다. for 블록 뒤 빈 줄 입력을 꼭 보여 주세요.</p><p>함정 질문: 마지막 len(aa) 는 100? → 앞에서 2개를 넣었으므로 <b>102</b>. (bb 는 쓰지 않았음!) 학생들이 코드를 꼼꼼히 읽는지 확인하는 장치입니다.</p>' },
          { layout: 'diagram', title: 'for 문으로 리스트값 입력', html: SVG_FOR_INPUT, caption: '그림 7-2 첨자 자리에 변수 i',
            notes: '<p><b>[2분]</b> 핵심 한 문장: “첨자 자리에 변수를 쓸 수 있다.” 한 줄의 코드가 i 가 바뀌며 4개의 서로 다른 칸을 채웁니다.</p>' },
          { layout: 'code', title: 'Code07-03. for 문으로 입력 · 합계', stdin: '10\n20\n30\n40\n', code: `aa = []
for i in range(0, 4) :
    aa.append(0)
hap = 0

for i in range(0, 4) :
    aa[i] = int(input(str(i + 1) + "번째 숫자 : "))

for i in range(0, 4) :
    hap = hap + aa[i]

print("합계 ==> %d" % hap)`, points: ['1~3행: [0,0,0,0] 준비', '<code>str(i + 1)</code>: 1번째부터 표시', '9행 덧셈도 for 문으로 (강의자료 “9행의 변경”)'],
            notes: '<p><b>[5분]</b> 강의자료 원본은 9행이 <code>hap = aa[0] + … + aa[3]</code> 이고, 이어서 for 문으로 바꾸는 방법을 보여 줍니다. 여기서는 바꾼 버전을 실행합니다.</p><p>질문: “10개로 늘리려면 어디를 고쳐야 할까?” → SELF STUDY 7-1 로 연결.</p>' },
          { layout: 'diagram', title: '리스트의 초기화와 역순 대입', html: SVG_REVERSE, caption: '그림 7-3 aa[99 - i] 로 뒤에서부터 꺼내기',
            notes: '<p><b>[3분]</b> 리스트 생성 예 ❶ 빈 리스트 ❷ 정수만 ❸ 문자열만 ❹ 섞어서 — 를 먼저 말로 짚고 그림으로 넘어갑니다.</p><p>i 에 0, 1, 99 를 대입해 보며 99 - i 의 값을 칠판에 적게 하세요.</p>' },
          { layout: 'code', title: 'Code07-04. 초기화와 역순 대입', code: `aa = []
bb = []
value = 0

for i in range(0, 100) :
    aa.append(value)
    value += 2

for i in range(0, 100) :
    bb.append(aa[99 - i])

print("bb[0]에는 %d이, bb[99]에는 %d이 입력됩니다." % (bb[0], bb[99]))`, points: ['aa: 0, 2, 4, …, 198', 'bb: 198, 196, …, 0', '결과: bb[0]=198, bb[99]=0'],
            notes: '<p><b>[4분]</b> 실행 후 <code>print(aa)</code>, <code>print(bb)</code> 를 추가해 전체를 보여 주면 이해가 빠릅니다.</p><p>보충: <code>bb = aa[::-1]</code> 로 한 줄에 가능(다음 교시 슬라이싱).</p>' },
          { layout: 'code', repl: true, title: '흔한 오류: IndexError', code: `aa = [10, 20, 30, 40]
aa[3]
aa[4]
bb = []
bb[0] = 10`, points: ['첨자 범위: 0 ~ len-1', '<code>list index out of range</code>', '빈 리스트에 aa[0]=값 도 같은 오류'],
            notes: '<p><b>[2분]</b> 오류 메시지 읽는 법: 오류 이름 · 설명 · 줄 번호. 학생이 자주 하는 실수(1부터 세기)를 짚습니다.</p>' },
          { layout: 'two', title: '📘 한 걸음 더: 만드는 방법 · 이름표와 객체', left: { title: '리스트를 만드는 4가지', bullets: ['❶ <code>aa = []</code> + <code>append()</code> — 값이 하나씩 생길 때', '❷ <code>[0] * 100</code> — 칸을 먼저 만들어 둘 때', '❸ <code>list(range(0, 200, 2))</code> — 규칙적인 수', '❹ <code>[v * 2 for v in range(100)]</code> — 컴프리헨션(7-6)'] }, right: { title: 'bb = aa 는 복사가 아니다', code: `aa = [10, 20, 30]
bb = aa
cc = aa[:]
bb.append(40)
print(aa, bb, cc)
print(aa is bb, aa is cc, aa == cc)` },
            notes: '<p><b>[4분]</b> 왼쪽: 상황마다 쓰기 좋은 방법이 다릅니다. 짧게 쓰는 것이 목적이 아니라 <b>의도가 드러나게</b> 쓰는 것이 목적이라고 말해 주세요.</p><p>오른쪽: 결과를 먼저 예측하게 합니다. 대부분 <code>aa</code> 가 그대로일 거라고 답합니다 → 실행해서 <code>[10, 20, 30, 40]</code> 을 보여 주면 충격 효과가 큽니다.</p><p><code>is</code>(같은 객체인가) vs <code>==</code>(내용이 같은가) 구분. 7-6 교시 “리스트의 복사”의 복선입니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>aa = [5, 10, 15, 20]</code> 일 때 <code>aa[1] + aa[3]</code> 의 값은?', options: ['15', '25', '30', '35'], answer: 2, explain: 'aa[1]=10, aa[3]=20 → 30',
            notes: '<p><b>[1분]</b> 틀린 학생은 대부분 1부터 센 경우(5+15=20 도 보기에 없음 → 15+... 로 헷갈림). 0부터를 다시 강조.</p>' },
          { layout: 'practice', title: 'SELF STUDY 7-1', desc: '10개를 입력받아 합계를 구하고, 합계는 <b>while 문</b>으로 구하도록 Code07-03 을 수정하세요.', stdin: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n', starter: `aa = []
for i in range(0, 4) :
    aa.append(0)
hap = 0
for i in range(0, 4) :
    aa[i] = int(input(str(i + 1) + "번째 숫자 : "))
# TODO: 10개로, while 문으로 합계
print("합계 ==> %d" % hap)`, solution: `aa = []
for i in range(0, 10) :
    aa.append(0)
hap = 0
for i in range(0, 10) :
    aa[i] = int(input(str(i + 1) + "번째 숫자 : "))
i = 0
while i < 10 :
    hap = hap + aa[i]
    i += 1
print("합계 ==> %d" % hap)`,
            notes: '<p><b>[5분]</b> while 문은 4장 복습. 초기값 · 조건 · 증가 세 요소를 빠뜨리지 않는지 확인합니다. 빨리 끝낸 학생은 SELF STUDY 7-2(3의 배수 200개 역순)로.</p>' },
          { layout: 'summary', title: '정리', bullets: ['리스트 = 여러 값을 순서대로 묶은 것, <code>[값1, 값2, …]</code>', '첨자(인덱스)는 <b>0부터</b>, 항목 수는 <code>len()</code>', '<code>[]</code> 로 빈 리스트 → <code>append()</code> 로 맨 뒤에 추가', '첨자 자리에 변수 i → 반복문으로 한 번에 처리', '범위 밖 첨자 → IndexError'],
            notes: '<p><b>[1분]</b> 다음 교시: 음수 첨자, 슬라이싱(:), 리스트 연산, 값 변경 · 삭제, 리스트 조작 함수.</p>' }
        ]
      },
      /* ===================== ch07-2 ===================== */
      {
        id: 'ch07-2',
        title: '리스트 값의 접근 · 변경과 조작 함수',
        minutes: 50,
        goals: ['음수 첨자와 콜론(:)을 이용한 범위 지정(슬라이싱)으로 값을 꺼낼 수 있다', '리스트의 덧셈 · 곱셈 연산 결과를 예측할 수 있다', '리스트의 값을 변경 · 삭제하는 여러 방법의 차이를 설명할 수 있다', 'append · pop · sort · reverse · index · insert · remove · extend · count 등 조작 함수를 사용할 수 있다', 'sort() 와 sorted() 의 차이를 설명할 수 있다', '슬라이스 대입 · 삭제로 리스트를 한 줄에 고칠 수 있다', 'sort(key = …) 와 람다로 기준을 정해 다중 정렬을 할 수 있다'],
        flow: [['복습 · 음수 첨자', 4], ['슬라이싱 · 연산', 11], ['값의 변경 · 삭제 · 슬라이스 대입', 10], ['리스트 조작 함수', 12], ['📘 sort(key=) · 람다 정렬', 8], ['정리 · 퀴즈', 5]],
        content: [
          { type: 'h', text: '리스트 값에 접근하는 다양한 방법' },
          { type: 'p', html: '첨자에는 <b>음수</b>도 쓸 수 있습니다. <code>-1</code> 은 맨 마지막 항목, <code>-2</code> 는 뒤에서 두 번째 항목입니다. 리스트 길이를 몰라도 마지막 값을 꺼낼 수 있어 편리합니다.' },
          { type: 'code', title: '음수 첨자로 접근하기', code: `aa = [10, 20, 30, 40]
print("aa[-1]은 %d, aa[-2]는 %d" % (aa[-1], aa[-2]))`, expect: 'aa[-1]은 40, aa[-2]는 30' },
          { type: 'figure', html: SVG_INDEX, caption: '양수 첨자 · 음수 첨자와 슬라이싱의 경계 번호' },
          { type: 'p', html: '<b>콜론(<code>:</code>)</b>을 사용하면 여러 항목을 범위로 꺼낼 수 있습니다. 이것을 <b>슬라이싱(slicing, 잘라 내기)</b>이라고 합니다. <code>aa[시작:끝]</code> 은 <b>시작 첨자부터 끝 첨자 바로 앞까지</b>입니다. <mark>끝 첨자의 항목은 포함되지 않는다</mark>는 점에 주의하세요. (<code>range(시작, 끝)</code> 과 같은 규칙)' },
          { type: 'code', repl: true, title: '콜론(:)으로 범위 지정', code: `aa = [10, 20, 30, 40]
aa[0:3]
aa[2:4]`, expect: `>>> aa = [10, 20, 30, 40]
>>> aa[0:3]
[10, 20, 30]
>>> aa[2:4]
[30, 40]
>>>`, desc: '<code>aa[0:3]</code> 은 첨자 0, 1, 2 (3은 제외), <code>aa[2:4]</code> 는 첨자 2, 3 입니다. 꺼낸 항목의 개수는 <code>끝 - 시작</code> 으로 바로 계산됩니다.' },
          { type: 'p', html: '콜론 앞의 숫자를 생략하면 “처음부터”, 뒤의 숫자를 생략하면 “끝까지”라는 뜻입니다.' },
          { type: 'code', repl: true, title: '콜론 앞이나 뒤의 숫자 생략', code: `aa = [10, 20, 30, 40]
aa[2:]
aa[:2]
aa[:]`, expect: `>>> aa = [10, 20, 30, 40]
>>> aa[2:]
[30, 40]
>>> aa[:2]
[10, 20]
>>> aa[:]
[10, 20, 30, 40]
>>>`, desc: '<code>aa[:2]</code> 는 “앞에서 2개”, <code>aa[2:]</code> 는 “앞의 2개를 뺀 나머지”로 기억하면 쉽습니다. 둘 다 생략한 <code>aa[:]</code> 는 전체를 복사한 새 리스트입니다(7-6 교시의 리스트 복사).' },
          { type: 'h', text: '리스트끼리 덧셈 · 곱셈' },
          { type: 'p', html: '리스트에 <code>+</code> 를 쓰면 두 리스트를 <b>이어 붙인</b> 새 리스트가, <code>* 정수</code> 를 쓰면 <b>그 횟수만큼 반복</b>한 새 리스트가 만들어집니다. 항목끼리 더하거나 곱하는 것이 아닙니다!' },
          { type: 'code', repl: true, title: '리스트의 덧셈과 곱셈', code: `aa = [10, 20, 30]
bb = [40, 50, 60]
aa + bb
aa * 3`, expect: `>>> aa = [10, 20, 30]
>>> bb = [40, 50, 60]
>>> aa + bb
[10, 20, 30, 40, 50, 60]
>>> aa * 3
[10, 20, 30, 10, 20, 30, 10, 20, 30]
>>>` },
          { type: 'callout', kind: 'warn', title: '항목마다 계산하고 싶다면?', html: '<code>[10, 20, 30] * 3</code> 은 <code>[30, 60, 90]</code> 이 아닙니다. 항목마다 3을 곱하려면 반복문을 쓰거나 컴프리헨션(7-6 교시) <code>[v * 3 for v in aa]</code> 을 사용합니다. 또 <code>aa + 5</code> 처럼 리스트와 정수를 더하면 <code>TypeError: can only concatenate list (not "int") to list</code> 오류가 납니다.' },
          { type: 'h', text: '항목을 건너뛰며 추출하기' },
          { type: 'p', html: '콜론을 두 번 써서 <code>aa[시작:끝:간격]</code> 으로 쓰면 <b>간격(step)</b>만큼 건너뛰며 꺼냅니다. 간격이 음수이면 뒤에서부터 거꾸로 꺼냅니다.' },
          { type: 'code', repl: true, title: '간격을 지정한 슬라이싱', code: `aa = [10, 20, 30, 40, 50, 60, 70]
aa[::2]
aa[::-2]
aa[::-1]`, expect: `>>> aa = [10, 20, 30, 40, 50, 60, 70]
>>> aa[::2]
[10, 30, 50, 70]
>>> aa[::-2]
[70, 50, 30, 10]
>>> aa[::-1]
[70, 60, 50, 40, 30, 20, 10]
>>>` },
          { type: 'figure', html: SVG_STEP, caption: '간격(step)을 지정한 슬라이싱 — aa[::-1] 은 리스트를 뒤집는 관용구' },
          { type: 'h', text: '리스트 값의 변경' },
          { type: 'p', html: '첨자로 지정한 칸에 새 값을 대입하면 그 값이 바뀝니다. 슬라이싱 범위에 리스트를 대입하면 <b>그 범위가 통째로 교체</b>되므로, 항목 1개를 2개로 늘릴 수도 있습니다.' },
          { type: 'code', repl: true, title: '두 번째 값을 1개 변경 / 2개로 변경', code: `aa = [10, 20, 30]
aa[1] = 200
aa
aa = [10, 20, 30]
aa[1:2] = [200, 201]
aa`, expect: `>>> aa = [10, 20, 30]
>>> aa[1] = 200
>>> aa
[10, 200, 30]
>>> aa = [10, 20, 30]
>>> aa[1:2] = [200, 201]
>>> aa
[10, 200, 201, 30]
>>>`, desc: '<code>aa[1:2]</code> 는 “첨자 1 하나만 있는 범위”입니다. 이 범위를 항목 2개짜리 리스트로 바꾸었으므로 전체 항목이 4개가 되었습니다.' },
          { type: 'p', html: '<code>aa[1:2]</code> 대신 그냥 <code>aa[1]</code> 에 리스트를 대입하면 결과가 전혀 다릅니다. 두 번째 칸 <b>하나</b>에 리스트 자체가 통째로 들어갑니다(리스트 안의 리스트).' },
          { type: 'code', repl: true, title: 'aa[1:2] 대신 aa[1] 에 대입하면?', code: `aa = [10, 20, 30]
aa[1] = [200, 201]
aa
len(aa)
aa[1][0]`, expect: `>>> aa = [10, 20, 30]
>>> aa[1] = [200, 201]
>>> aa
[10, [200, 201], 30]
>>> len(aa)
3
>>> aa[1][0]
200
>>>`, desc: '항목 수는 그대로 3 입니다. 두 번째 항목이 리스트이므로 <code>aa[1][0]</code> 처럼 첨자를 두 번 써서 안쪽 값을 꺼냅니다. 이런 구조가 바로 7-3 교시의 <b>2차원 리스트</b>입니다.' },
          { type: 'h', text: '리스트 값의 삭제' },
          { type: 'p', html: '<code>del(리스트[첨자])</code> 로 항목을 지웁니다. 범위를 지우려면 슬라이싱 범위에 빈 리스트 <code>[]</code> 를 대입합니다(<code>del(aa[1:4])</code> 도 같습니다).' },
          { type: 'code', repl: true, title: '항목 하나 삭제 / 범위 삭제', code: `aa = [10, 20, 30]
del(aa[1])
aa
aa = [10, 20, 30, 40, 50]
aa[1:4] = []
aa`, expect: `>>> aa = [10, 20, 30]
>>> del(aa[1])
>>> aa
[10, 30]
>>> aa = [10, 20, 30, 40, 50]
>>> aa[1:4] = []
>>> aa
[10, 50]
>>>`, desc: '항목을 지우면 뒤의 항목들이 앞으로 당겨집니다. <code>[10, 30]</code> 에서 30 은 이제 <code>aa[1]</code> 입니다.' },
          { type: 'p', html: '리스트 <b>자체</b>를 없애는 방법은 세 가지입니다. 한 줄에 여러 문장을 쓸 때는 세미콜론(<code>;</code>)으로 구분합니다.' },
          { type: 'code', repl: true, title: '리스트 자체를 삭제하는 세 가지 방법', code: `aa = [10, 20, 30]; aa = []; aa
aa = [10, 20, 30]; aa = None; aa
aa = [10, 20, 30]; del(aa); aa`, expect: `>>> aa = [10, 20, 30]; aa = []; aa
[]
>>> aa = [10, 20, 30]; aa = None; aa
>>> aa = [10, 20, 30]; del(aa); aa
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
NameError: name 'aa' is not defined
>>>`, desc: '❶ 빈 리스트를 대입 — 변수 <code>aa</code> 는 남아 있고 내용만 비었습니다. ❷ <code>None</code>(“아무것도 없음”)을 대입 — 셸은 <code>None</code> 을 화면에 표시하지 않습니다. ❸ <code>del()</code> — 변수 자체가 사라져 <code>aa</code> 를 쓰면 <code>NameError</code> 가 발생합니다.' },
          { type: 'h', text: '📘 더 알아보기: 슬라이싱 한 방에 정리하기' },
          { type: 'p', html: '지금까지 나온 슬라이싱은 사실 <b>읽기 · 쓰기 · 지우기</b> 세 가지로 정리됩니다. <code>aa[시작:끝:간격]</code> 을 <b>왼쪽</b>에 쓰면 그 범위를 <b>교체</b>하고, <code>del</code> 과 함께 쓰면 그 범위를 <b>삭제</b>합니다. 반복문 없이 한 줄로 처리할 수 있어 코드가 짧고 실수가 줄어듭니다.' },
          { type: 'table', head: ['하고 싶은 일', '코드', '설명'], rows: [
            ['전체 복사', '<code>bb = aa[:]</code>', '내용이 같은 <b>새 리스트</b> (7-6 교시)'],
            ['뒤집은 새 리스트', '<code>bb = aa[::-1]</code>', '원본은 그대로'],
            ['범위 교체(개수 달라도 됨)', '<code>aa[2:5] = [0, 0]</code>', '3칸이 2칸으로 → 전체 길이가 줄어든다'],
            ['범위 삭제', '<code>del aa[0:2]</code> 또는 <code>aa[0:2] = []</code>', '두 방법은 같은 뜻'],
            ['맨 뒤에 이어 붙이기', '<code>aa[len(aa):] = [7, 8]</code>', '<code>aa.extend([7, 8])</code> 과 같다'],
            ['내용만 통째로 교체', '<code>aa[:] = [1, 2, 3]</code>', '<b>같은 객체</b>를 유지한 채 내용만 바꾼다 (<code>aa = [1, 2, 3]</code> 과 다름!)'],
            ['간격 대입', '<code>aa[::2] = […]</code>', '오른쪽 개수가 <b>정확히</b> 같아야 한다']
          ], caption: '슬라이싱으로 할 수 있는 일들' },
          { type: 'code', title: '추가 예제. 슬라이싱으로 자르고 · 바꾸고 · 지우기', code: `aa = list(range(1, 11))
print("원본          :", aa)

aa[2:5] = [0, 0]            # 3칸을 2칸으로 교체 → 길이가 줄어든다
print("[2:5] = 2개   :", aa)

del aa[0:2]                 # 앞의 두 칸 삭제 (aa[0:2] = [] 와 같다)
print("del [0:2]     :", aa)

aa[::2] = [100, 200, 300, 400]   # 간격 대입: 개수가 정확히 같아야 한다
print("[::2] 대입    :", aa)

aa[len(aa):] = [7, 8]       # 맨 뒤에 이어 붙이기 (extend 와 같다)
print("뒤에 붙이기   :", aa)

aa[:] = [1, 2, 3]           # 같은 객체의 내용만 통째로 교체
print("[:] 대입      :", aa)`, expect: `원본          : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
[2:5] = 2개   : [1, 2, 0, 0, 6, 7, 8, 9, 10]
del [0:2]     : [0, 0, 6, 7, 8, 9, 10]
[::2] 대입    : [100, 0, 200, 7, 300, 9, 400]
뒤에 붙이기   : [100, 0, 200, 7, 300, 9, 400, 7, 8]
[:] 대입      : [1, 2, 3]`, desc: '<code>aa[:] = [1, 2, 3]</code> 과 <code>aa = [1, 2, 3]</code> 은 결과가 같아 보이지만 다릅니다. 앞의 것은 <b>원래 리스트의 내용</b>을 바꾸므로 같은 리스트를 보고 있던 다른 이름(<code>bb = aa</code>)에도 반영되고, 뒤의 것은 이름표만 새 리스트로 옮깁니다.' },
          { type: 'callout', kind: 'warn', title: '간격 대입은 개수가 맞아야 한다', html: '<code>aa = [1, 2, 3, 4, 5, 6]</code> 에서 <code>aa[::2]</code> 는 항목 3개(1, 3, 5)입니다. 여기에 2개를 대입하면 <code>ValueError: attempt to assign sequence of size 2 to extended slice of size 3</code> 오류가 납니다. 간격이 없는 <code>aa[0:3] = [9]</code> 는 개수가 달라도 괜찮습니다 — “구간을 통째로 갈아 끼운다”는 뜻이기 때문입니다.' },
          { type: 'h', text: '리스트 조작 함수' },
          { type: 'p', html: '리스트에는 자주 쓰는 작업을 대신해 주는 함수(정확히는 <b>메서드</b>)가 준비되어 있습니다. <code>리스트명.함수()</code> 형식으로 사용합니다.' },
          { type: 'table', head: ['함수', '설명', '사용법'], rows: [
            ['<code>append()</code>', '리스트 맨 뒤에 항목을 추가한다', '<code>리스트명.append(값)</code>'],
            ['<code>pop()</code>', '리스트 맨 뒤의 항목을 빼낸다(리스트에서 삭제되고 그 값을 돌려준다)', '<code>리스트명.pop()</code>'],
            ['<code>sort()</code>', '리스트의 항목을 정렬한다', '<code>리스트명.sort()</code>'],
            ['<code>reverse()</code>', '리스트 항목의 순서를 역순으로 만든다', '<code>리스트명.reverse()</code>'],
            ['<code>index()</code>', '지정한 값을 찾아 그 위치(첨자)를 돌려준다', '<code>리스트명.index(찾을값)</code>'],
            ['<code>insert()</code>', '지정한 위치에 값을 삽입한다', '<code>리스트명.insert(위치, 값)</code>'],
            ['<code>remove()</code>', '지정한 값을 삭제한다. 같은 값이 여러 개면 첫 번째 것만 지운다', '<code>리스트명.remove(지울값)</code>'],
            ['<code>extend()</code>', '리스트 뒤에 다른 리스트를 이어 붙인다(<code>+</code> 연산과 비슷)', '<code>리스트명.extend(추가할리스트)</code>'],
            ['<code>count()</code>', '지정한 값이 몇 개 있는지 센다', '<code>리스트명.count(찾을값)</code>'],
            ['<code>clear()</code>', '리스트의 내용을 모두 지운다', '<code>리스트명.clear()</code>'],
            ['<code>del()</code>', '지정한 위치의 항목을 삭제한다', '<code>del(리스트명[위치])</code>'],
            ['<code>len()</code>', '리스트 전체 항목의 개수를 센다', '<code>len(리스트명)</code>'],
            ['<code>copy()</code>', '리스트의 내용을 새로운 리스트에 복사한다', '<code>새리스트 = 리스트명.copy()</code>'],
            ['<code>sorted()</code>', '정렬한 새로운 리스트를 만들어 돌려준다(원래 리스트는 그대로)', '<code>새리스트 = sorted(리스트)</code>']
          ], caption: '표 7-1 리스트 조작 함수 (del · len · sorted 는 리스트명. 없이 쓰는 내장 기능)' },
          { type: 'code', title: 'Code07-05. 리스트 조작 함수 사용하기', code: `myList = [30, 10, 20]
print("현재 리스트 : %s" % myList)

myList.append(40)
print("append(40) 후의 리스트 : %s" % myList)

print("pop()으로 추출한 값 : %s" % myList.pop())
print("pop() 후의 리스트 : %s" % myList)

myList.sort()
print("sort() 후의 리스트 : %s" % myList)

myList.reverse()
print("reverse() 후의 리스트 : %s" % myList)

print("20값의 위치 : %d" % myList.index(20))

myList.insert(2, 222)
print("insert(2, 222) 후의 리스트 : %s" % myList)

myList.remove(222)
print("remove(222) 후의 리스트 : %s" % myList)

myList.extend([77, 88, 77])
print("extend([77, 88, 77]) 후의 리스트 : %s" % myList)

print("77값의 개수 : %d" % myList.count(77))`, expect: `현재 리스트 : [30, 10, 20]
append(40) 후의 리스트 : [30, 10, 20, 40]
pop()으로 추출한 값 : 40
pop() 후의 리스트 : [30, 10, 20]
sort() 후의 리스트 : [10, 20, 30]
reverse() 후의 리스트 : [30, 20, 10]
20값의 위치 : 1
insert(2, 222) 후의 리스트 : [30, 20, 222, 10]
remove(222) 후의 리스트 : [30, 20, 10]
extend([77, 88, 77]) 후의 리스트 : [30, 20, 10, 77, 88, 77]
77값의 개수 : 2`, desc: '<code>%s</code> 서식에 리스트를 넣으면 리스트 모양 그대로 출력됩니다. <code>7행</code>의 <code>pop()</code> 은 값을 <b>돌려주면서</b> 리스트에서 지우는 두 가지 일을 동시에 합니다. <code>18행</code>의 <code>insert(2, 222)</code> 는 첨자 2 자리에 222 를 끼워 넣고, 원래 있던 항목들은 한 칸씩 뒤로 밀립니다.' },
          { type: 'p', html: '<code>sort()</code> 는 리스트 <b>자신</b>을 정렬해 버립니다. 원래 리스트는 그대로 두고 정렬된 <b>새 리스트</b>만 얻고 싶으면 <code>sorted()</code> 함수를 사용합니다.' },
          { type: 'code', title: 'sorted() — 기존 리스트는 그대로 두고 정렬', code: `myList = [30, 10, 20]
newList = sorted(myList)
print("sorted() 후의 myList : %s" % myList)
print("sorted() 후의 newList : %s" % newList)`, expect: `sorted() 후의 myList : [30, 10, 20]
sorted() 후의 newList : [10, 20, 30]` },
          { type: 'callout', kind: 'warn', title: '흔한 실수: myList = myList.sort()', html: '<code>sort()</code> · <code>reverse()</code> · <code>append()</code> 처럼 리스트 자신을 바꾸는 함수는 결과로 <code>None</code> 을 돌려줍니다. 그래서 <code>myList = myList.sort()</code> 라고 쓰면 정렬된 리스트가 아니라 <code>None</code> 이 저장되어 리스트를 잃어버립니다. <b>자신을 바꾸는 함수는 그냥 <code>myList.sort()</code> 로 호출</b>하고, 새 리스트가 필요하면 <code>sorted()</code> 를 쓰세요.' },
          { type: 'code', title: '추가 예제. sort() 의 반환값은 None', code: `myList = [30, 10, 20]
result = myList.sort()
print("result :", result)
print("myList :", myList)

myList = myList.sort()     # 이렇게 쓰면 리스트를 잃어버린다!
print("myList :", myList)`, expect: `result : None
myList : [10, 20, 30]
myList : None` },
          { type: 'h', text: '📘 더 알아보기: 알아 두면 편한 기능들' },
          { type: 'code', title: '추가 예제. 내림차순 정렬 · pop(위치) · in 연산자', code: `scores = [85, 92, 78, 92, 60]

scores.sort(reverse = True)          # 내림차순(큰 것부터)
print("내림차순 :", scores)
print("오름차순 새 리스트 :", sorted(scores))

last = scores.pop()                  # 맨 뒤 항목 빼기
first = scores.pop(0)                # 첨자 0 항목 빼기
print("뺀 값 :", first, last, "/ 남은 리스트 :", scores)

print(92 in scores, 100 in scores)   # 값이 들어 있는지 True/False
print("합계 :", sum(scores), "최댓값 :", max(scores), "최솟값 :", min(scores))

names = ['홍길동', '이순신', '강감찬']
names.sort()                         # 문자열은 가나다(사전) 순
print(names)`, expect: `내림차순 : [92, 92, 85, 78, 60]
오름차순 새 리스트 : [60, 78, 85, 92, 92]
뺀 값 : 92 60 / 남은 리스트 : [92, 85, 78]
True False
합계 : 255 최댓값 : 92 최솟값 : 78
['강감찬', '이순신', '홍길동']` },
          { type: 'callout', kind: 'more', title: '📘 없는 값을 찾거나 지우면?', html: '<code>index()</code> 와 <code>remove()</code> 는 리스트에 없는 값을 주면 <code>ValueError</code> 오류가 납니다(예: <code>ValueError: list.remove(x): x not in list</code>). 안전하게 쓰려면 먼저 <code>if 값 in 리스트 :</code> 로 들어 있는지 확인하세요. 빈 리스트에 <code>pop()</code> 을 해도 <code>IndexError: pop from empty list</code> 가 발생합니다.' },
          { type: 'code', title: '추가 예제. 값이 있을 때만 지우기', code: `fruits = ['사과', '배', '감', '배']

target = '배'
if target in fruits :
    print("'%s'의 첫 위치 : %d" % (target, fruits.index(target)))
    fruits.remove(target)          # 첫 번째 '배'만 지운다
print(fruits)

target = '귤'
if target in fruits :
    fruits.remove(target)
else :
    print("'%s'은(는) 리스트에 없습니다." % target)`, expect: `'배'의 첫 위치 : 1
['사과', '감', '배']
'귤'은(는) 리스트에 없습니다.` },
          { type: 'h', text: '정렬 심화: sort(key = …) 와 람다' },
          { type: 'p', html: '<code>sort()</code> 와 <code>sorted()</code> 는 그냥 쓰면 값 자체를 비교합니다. 하지만 <b>“무엇을 기준으로” 비교할지</b>를 <code>key</code> 로 알려 줄 수 있습니다. <code>key</code> 에는 <b>항목 하나를 받아 비교에 쓸 값을 돌려주는 함수</b>를 넣습니다. 파이썬은 모든 항목을 그 함수에 한 번씩 넣어 본 뒤, 나온 값을 기준으로 줄을 세웁니다.' },
          { type: 'code', title: '추가 예제. 길이 순 · 대소문자 무시 정렬', code: `words = ['banana', 'Kiwi', 'apple', 'fig', 'Cherry']

print("기본 정렬     :", sorted(words))
print("길이 순       :", sorted(words, key = len))
print("대소문자 무시 :", sorted(words, key = str.lower))
print("긴 것부터     :", sorted(words, key = len, reverse = True))
print("원본은 그대로 :", words)`, expect: `기본 정렬     : ['Cherry', 'Kiwi', 'apple', 'banana', 'fig']
길이 순       : ['fig', 'Kiwi', 'apple', 'banana', 'Cherry']
대소문자 무시 : ['apple', 'banana', 'Cherry', 'fig', 'Kiwi']
긴 것부터     : ['banana', 'Cherry', 'apple', 'Kiwi', 'fig']
원본은 그대로 : ['banana', 'Kiwi', 'apple', 'fig', 'Cherry']`, desc: '기본 정렬에서 대문자가 앞에 오는 이유는 문자를 <b>코드 번호</b>로 비교하기 때문입니다(<code>\'C\'</code>=67, <code>\'a\'</code>=97). 사람이 기대하는 순서로 정렬하려면 <code>key = str.lower</code> 처럼 <b>비교용 값</b>을 따로 만들어 줍니다. 괄호 없이 함수 <b>이름만</b> 넘기는 점에 주의하세요(<code>len()</code> 이 아니라 <code>len</code>).' },
          { type: 'p', html: '이름이 없는 짧은 함수는 <b>람다(lambda)</b>로 그 자리에서 만들 수 있습니다. <code>lambda 항목 : 비교값</code> 형식입니다. 항목이 리스트나 튜플이면 <b>몇 번째 값으로 비교할지</b>를 지정할 수 있습니다.' },
          { type: 'code', title: '추가 예제. 다중 기준 정렬 — 점수 내림차순, 같으면 이름 순', code: `students = [['가은', 2, 88], ['나래', 1, 95], ['다온', 2, 95], ['라희', 1, 88]]

# 점수(2번 칸) 기준 오름차순
print(sorted(students, key = lambda s : s[2]))

# 점수 내림차순 → 점수가 같으면 이름 오름차순
students.sort(key = lambda s : (-s[2], s[0]))
for name, grade, score in students :
    print("%s %d반 %d점" % (name, grade, score))`, expect: `[['가은', 2, 88], ['라희', 1, 88], ['나래', 1, 95], ['다온', 2, 95]]
나래 1반 95점
다온 2반 95점
가은 2반 88점
라희 1반 88점`, desc: '<code>lambda s : (-s[2], s[0])</code> 는 항목마다 <b>튜플</b>을 만들어 돌려줍니다. 튜플끼리 비교하면 <b>앞의 값부터</b> 차례로 비교하므로 “1순위 점수, 2순위 이름”이 됩니다. 숫자 앞에 <code>-</code> 를 붙이면 큰 값이 작아져 <b>내림차순</b>이 됩니다. <code>for name, grade, score in students :</code> 는 한 행(리스트)을 세 변수에 나누어 받는 <b>언패킹</b>입니다(7-4 교시).' },
          { type: 'callout', kind: 'more', title: '📘 reverse() · reversed() · [::-1] 의 차이', html: '<ul><li><code>aa.reverse()</code> — <b>자기 자신</b>을 뒤집습니다. 반환값은 <code>None</code>.</li><li><code>aa[::-1]</code> — 뒤집힌 <b>새 리스트</b>를 만듭니다. 원본은 그대로.</li><li><code>reversed(aa)</code> — 뒤에서부터 하나씩 꺼내 주는 <b>도구</b>를 돌려줍니다. <code>for v in reversed(aa) :</code> 처럼 바로 쓰거나 <code>list(reversed(aa))</code> 로 리스트로 만듭니다. 새 리스트를 만들지 않아 메모리에 유리합니다.</li></ul>정렬도 마찬가지입니다: <b>원본을 바꿔도 될 때는 <code>sort()</code>, 원본을 지켜야 할 때는 <code>sorted()</code></b>. 이 선택 기준 하나만 기억하면 됩니다.' },
          { type: 'code', title: '추가 예제. 뒤집는 세 가지 방법 비교', code: `aa = [10, 20, 30]

print(aa[::-1], "/ 원본 :", aa)
print(list(reversed(aa)), "/ 원본 :", aa)

aa.reverse()
print(aa, "/ 원본이 바뀌었다")

for i, v in enumerate(reversed([10, 20, 30])) :
    print(i, v)`, expect: `[30, 20, 10] / 원본 : [10, 20, 30]
[30, 20, 10] / 원본 : [10, 20, 30]
[30, 20, 10] / 원본이 바뀌었다
0 30
1 20
2 10` }
        ],
        practice: [
          {
            title: '실습 7-5. 심사위원 점수 계산',
            level: 2,
            desc: '<p>심사위원 5명의 점수를 입력받아 리스트에 저장한 뒤 <b>정렬</b>하고, <b>최고 점수와 최저 점수를 하나씩 뺀</b> 나머지 3개의 평균을 구하세요. (슬라이싱 사용)</p><pre>1번 심사위원 점수 : 7\n…\n정렬된 점수 : [6, 7, 8, 9, 10]\n최고 · 최저를 뺀 점수 : [7, 8, 9]\n평균 : 8.0</pre>',
            hint: '<code>scores.sort()</code> 후 <code>scores[1:4]</code> (또는 <code>scores[1:-1]</code>) 가 가운데 3개입니다. 평균은 <code>sum() / len()</code>.',
            starter: `scores = []
for i in range(0, 5) :
    scores.append(int(input(str(i + 1) + "번 심사위원 점수 : ")))

# TODO: 정렬하고 출력
# TODO: 슬라이싱으로 가운데 3개를 꺼내 출력
# TODO: 평균 출력 (소수점 1자리)
`,
            solution: `scores = []
for i in range(0, 5) :
    scores.append(int(input(str(i + 1) + "번 심사위원 점수 : ")))

scores.sort()
print("정렬된 점수 :", scores)
mid = scores[1:-1]
print("최고 · 최저를 뺀 점수 :", mid)
print("평균 : %.1f" % (sum(mid) / len(mid)))
`,
            stdin: '7\n9\n8\n10\n6\n',
            expect: `1번 심사위원 점수 : 7
2번 심사위원 점수 : 9
3번 심사위원 점수 : 8
4번 심사위원 점수 : 10
5번 심사위원 점수 : 6
정렬된 점수 : [6, 7, 8, 9, 10]
최고 · 최저를 뺀 점수 : [7, 8, 9]
평균 : 8.0`
          },
          {
            title: '실습 7-6. 리스트 조작 함수로 대기 명단 관리',
            level: 1,
            desc: '<p>식당 대기 명단 <code>waiting = [\'민수\', \'지아\', \'도윤\']</code> 이 있습니다. 조작 함수를 사용해 다음을 차례로 처리하고, 처리할 때마다 명단을 출력하세요.</p><ol><li>맨 뒤에 \'하린\' 추가</li><li>\'지아\' 가 몇 번째(첨자)인지 출력</li><li>첨자 1 자리에 VIP \'서준\' 끼워 넣기</li><li>\'도윤\' 이 대기를 취소 (값으로 삭제)</li><li>맨 앞 손님 입장 (<code>pop(0)</code>) — 입장한 사람 이름 출력</li></ol><pre>추가 후 : [\'민수\', \'지아\', \'도윤\', \'하린\']\n지아의 위치 : 1\n…</pre>',
            hint: '<code>append</code>, <code>index</code>, <code>insert</code>, <code>remove</code>, <code>pop(0)</code> 을 차례로 사용합니다.',
            starter: `waiting = ['민수', '지아', '도윤']

# 1. '하린' 추가

# 2. '지아'의 위치 출력

# 3. 첨자 1 자리에 '서준' 삽입

# 4. '도윤' 삭제

# 5. 맨 앞 손님 입장
`,
            solution: `waiting = ['민수', '지아', '도윤']

waiting.append('하린')
print("추가 후 :", waiting)

print("지아의 위치 :", waiting.index('지아'))

waiting.insert(1, '서준')
print("VIP 삽입 후 :", waiting)

waiting.remove('도윤')
print("취소 후 :", waiting)

guest = waiting.pop(0)
print(guest, "님 입장! 남은 명단 :", waiting)
`,
            expect: `추가 후 : ['민수', '지아', '도윤', '하린']
지아의 위치 : 1
VIP 삽입 후 : ['민수', '서준', '지아', '도윤', '하린']
취소 후 : ['민수', '서준', '지아', '하린']
민수 님 입장! 남은 명단 : ['서준', '지아', '하린']`
          },
          {
            title: '실습 7-7. 슬라이싱으로 자르고 · 바꾸고 · 지우기',
            level: 1,
            desc: '<p>알파벳 리스트가 주어집니다. 슬라이싱만 사용해 다음을 차례로 처리하세요.</p><ol><li>앞에서 3개 출력</li><li>뒤에서 3개 출력 (음수 첨자 사용)</li><li>짝수 번째(첨자 0, 2, 4 …) 항목만 출력</li><li>통째로 뒤집어 출력</li><li>첨자 2 ~ 4 세 칸을 <code>[\'x\', \'y\']</code> 로 교체한 뒤 전체 출력</li><li>마지막 두 항목을 삭제한 뒤 전체 출력</li></ol><pre>앞 3개    : [\'A\', \'B\', \'C\']\n뒤 3개    : [\'F\', \'G\', \'H\']\n짝수 번째 : [\'A\', \'C\', \'E\', \'G\']\n뒤집기    : [\'H\', \'G\', \'F\', \'E\', \'D\', \'C\', \'B\', \'A\']\n교체 후   : [\'A\', \'B\', \'x\', \'y\', \'F\', \'G\', \'H\']\n삭제 후   : [\'A\', \'B\', \'x\', \'y\', \'F\']</pre>',
            hint: '뒤에서 3개는 <code>letters[-3:]</code>, 짝수 번째는 <code>letters[::2]</code>, 뒤집기는 <code>letters[::-1]</code> 입니다. 교체는 <code>letters[2:5] = [\'x\', \'y\']</code>, 삭제는 <code>del letters[-2:]</code>.',
            starter: `letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

# TODO: 앞 3개 / 뒤 3개 / 짝수 번째 / 뒤집기

# TODO: 첨자 2~4 를 ['x', 'y'] 로 교체 후 출력

# TODO: 마지막 두 항목 삭제 후 출력
`,
            solution: `letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

print("앞 3개    :", letters[:3])
print("뒤 3개    :", letters[-3:])
print("짝수 번째 :", letters[::2])
print("뒤집기    :", letters[::-1])

letters[2:5] = ['x', 'y']
print("교체 후   :", letters)

del letters[-2:]
print("삭제 후   :", letters)
`,
            expect: `앞 3개    : ['A', 'B', 'C']
뒤 3개    : ['F', 'G', 'H']
짝수 번째 : ['A', 'C', 'E', 'G']
뒤집기    : ['H', 'G', 'F', 'E', 'D', 'C', 'B', 'A']
교체 후   : ['A', 'B', 'x', 'y', 'F', 'G', 'H']
삭제 후   : ['A', 'B', 'x', 'y', 'F']`
          },
          {
            title: '실습 7-8. 다중 기준으로 책 순위표 만들기',
            level: 2,
            desc: '<p>책 정보가 <code>[제목, 가격, 평점]</code> 형태로 들어 있습니다. <code>sorted(…, key = …)</code> 를 사용해 세 가지를 출력하세요.</p><ol><li><b>가격이 싼 순</b>으로 “제목 가격원”</li><li><b>평점이 높은 순</b>, 평점이 같으면 <b>가격이 싼 순</b>으로 “제목 평점점 가격원”</li><li>제목 글자 수가 가장 긴 책의 제목 (<code>max(…, key = …)</code>)</li></ol><pre>--- 가격이 싼 순 ---\n파이썬 입문 12000원\n…\n제목이 가장 긴 책 : 파이썬 입문</pre>',
            hint: '가격 기준은 <code>key = lambda b : b[1]</code>. 두 기준은 튜플로 묶습니다: <code>key = lambda b : (-b[2], b[1])</code> — 앞의 값부터 비교하고, 숫자에 <code>-</code> 를 붙이면 내림차순이 됩니다.',
            starter: `books = [['파이썬 입문', 12000, 4.5],
         ['자료구조', 25000, 4.5],
         ['알고리즘', 18000, 4.8],
         ['웹개발', 18000, 4.1]]

# TODO: 1. 가격이 싼 순

# TODO: 2. 평점 높은 순 (같으면 싼 순)

# TODO: 3. 제목이 가장 긴 책
`,
            solution: `books = [['파이썬 입문', 12000, 4.5],
         ['자료구조', 25000, 4.5],
         ['알고리즘', 18000, 4.8],
         ['웹개발', 18000, 4.1]]

print("--- 가격이 싼 순 ---")
for title, price, star in sorted(books, key = lambda b : b[1]) :
    print("%s %d원" % (title, price))

print("--- 평점 높은 순(같으면 싼 순) ---")
for title, price, star in sorted(books, key = lambda b : (-b[2], b[1])) :
    print("%s %.1f점 %d원" % (title, star, price))

longest = max(books, key = lambda b : len(b[0]))
print("제목이 가장 긴 책 :", longest[0])
`,
            expect: `--- 가격이 싼 순 ---
파이썬 입문 12000원
알고리즘 18000원
웹개발 18000원
자료구조 25000원
--- 평점 높은 순(같으면 싼 순) ---
알고리즘 4.8점 18000원
파이썬 입문 4.5점 12000원
자료구조 4.5점 25000원
웹개발 4.1점 18000원
제목이 가장 긴 책 : 파이썬 입문`
          },
          {
            title: '실습 7-9. 할 일 목록(To-do) 관리 프로그램',
            level: 3,
            desc: '<p>리스트 조작 함수를 모아 쓰는 작은 프로그램입니다.</p><p><b>요구 사항</b></p><ul><li><code>"명령(추가/완료/목록/끝) : "</code> 를 반복해서 입력받습니다.</li><li><b>추가</b> — 할 일을 입력받아 리스트 맨 뒤에 넣고 <code>추가되었습니다. (N개)</code> 출력</li><li><b>완료</b> — 번호를 입력받아 그 항목을 <b>빼내고</b> <code>&lt;할 일&gt; 완료!</code> 출력. 범위 밖 번호이면 <code>그런 번호가 없습니다.</code></li><li><b>목록</b> — <code>1. 할 일</code> 처럼 <b>1번부터</b> 번호를 붙여 출력. 비어 있으면 <code>할 일이 없습니다.</code></li><li><b>끝</b> — 반복을 멈추고 <code>남은 할 일 : N개</code> 출력</li><li>그 밖의 입력은 <code>모르는 명령입니다.</code></li></ul><p>👉 <b>더 해 보기</b>: 완료한 일을 <code>done</code> 리스트에 모아 두었다가 끝낼 때 함께 보여 주기, <code>중요</code> 명령으로 <code>insert(0, …)</code> 해서 맨 앞에 넣기, 같은 할 일이 이미 있으면 <code>in</code> 으로 확인해 거절하기.</p>',
            hint: '사람은 1번부터 세고 리스트는 0번부터 세므로 <code>todo.pop(no - 1)</code> 입니다. 번호 검사는 <code>if 1 &lt;= no &lt;= len(todo) :</code> 로 한 번에 할 수 있습니다.',
            starter: `todo = []

while True :
    cmd = input("명령(추가/완료/목록/끝) : ")
    if cmd == '추가' :
        pass    # TODO: 할 일 입력받아 append
    elif cmd == '완료' :
        pass    # TODO: 번호 입력받아 pop (범위 검사!)
    elif cmd == '목록' :
        pass    # TODO: 1번부터 번호를 붙여 출력
    elif cmd == '끝' :
        break
    else :
        print("모르는 명령입니다.")

print("남은 할 일 : %d개" % len(todo))
`,
            solution: `todo = []

while True :
    cmd = input("명령(추가/완료/목록/끝) : ")
    if cmd == '추가' :
        todo.append(input("할 일 : "))
        print("추가되었습니다. (%d개)" % len(todo))
    elif cmd == '완료' :
        no = int(input("완료한 번호 : "))
        if 1 <= no <= len(todo) :
            print("<%s> 완료!" % todo.pop(no - 1))
        else :
            print("그런 번호가 없습니다.")
    elif cmd == '목록' :
        if len(todo) == 0 :
            print("할 일이 없습니다.")
        else :
            for i in range(0, len(todo)) :
                print("%d. %s" % (i + 1, todo[i]))
    elif cmd == '끝' :
        break
    else :
        print("모르는 명령입니다.")

print("남은 할 일 : %d개" % len(todo))
`,
            stdin: '추가\n숙제하기\n추가\n설거지\n추가\n운동\n목록\n완료\n2\n목록\n완료\n9\n끝\n',
            expect: `명령(추가/완료/목록/끝) : 추가
할 일 : 숙제하기
추가되었습니다. (1개)
명령(추가/완료/목록/끝) : 추가
할 일 : 설거지
추가되었습니다. (2개)
명령(추가/완료/목록/끝) : 추가
할 일 : 운동
추가되었습니다. (3개)
명령(추가/완료/목록/끝) : 목록
1. 숙제하기
2. 설거지
3. 운동
명령(추가/완료/목록/끝) : 완료
완료한 번호 : 2
<설거지> 완료!
명령(추가/완료/목록/끝) : 목록
1. 숙제하기
2. 운동
명령(추가/완료/목록/끝) : 완료
완료한 번호 : 9
그런 번호가 없습니다.
명령(추가/완료/목록/끝) : 끝
남은 할 일 : 2개`
          }
        ],
        quiz: [
          { q: '<code>aa = [10, 20, 30, 40, 50]</code> 일 때 <code>aa[1:3]</code> 의 결과는?', options: ['<code>[10, 20, 30]</code>', '<code>[20, 30]</code>', '<code>[20, 30, 40]</code>', '<code>[10, 20]</code>'], answer: 1, explain: '첨자 1부터 3 <b>바로 앞</b>(2)까지 → <code>[20, 30]</code>' },
          { q: '<code>aa = [1, 2, 3]</code> 일 때 <code>aa * 2</code> 의 결과는?', options: ['<code>[2, 4, 6]</code>', '<code>[1, 2, 3, 1, 2, 3]</code>', '<code>[[1, 2, 3], [1, 2, 3]]</code>', '오류'], answer: 1, explain: '리스트의 곱셈은 항목을 반복해 이어 붙입니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>aa = [10, 20, 30]\naa[1] = [200, 201]\nprint(len(aa))</code></pre>', options: ['2', '3', '4', '오류'], answer: 1, explain: '<code>aa[1]</code> 한 칸에 리스트가 통째로 들어가므로 <code>[10, [200, 201], 30]</code> → 항목 3개. (<code>aa[1:2] = [200, 201]</code> 이었다면 4)' },
          { q: '다음 코드의 실행 결과는?<pre><code>myList = [3, 1, 2]\nmyList.insert(1, 9)\nmyList.pop()\nprint(myList)</code></pre>', options: ['<code>[3, 9, 1]</code>', '<code>[9, 1, 2]</code>', '<code>[3, 1, 9]</code>', '<code>[3, 9, 1, 2]</code>'], answer: 0, explain: 'insert 후 <code>[3, 9, 1, 2]</code>, pop() 으로 맨 뒤 2 제거 → <code>[3, 9, 1]</code>' },
          { q: '<code>newList = myList.sort()</code> 실행 후 <code>newList</code> 에 들어 있는 값은?', options: ['정렬된 리스트', '정렬 전 리스트', '<code>None</code>', '오류가 발생한다'], answer: 2, explain: '<code>sort()</code> 는 리스트 자신을 정렬하고 <code>None</code> 을 돌려줍니다. 새 리스트가 필요하면 <code>sorted(myList)</code>.' },
          { q: '다음 코드의 실행 결과는?<pre><code>words = [\'aaa\', \'b\', \'cc\']\nprint(sorted(words, key = len))</code></pre>', options: ["<code>['aaa', 'b', 'cc']</code>", "<code>['b', 'cc', 'aaa']</code>", "<code>['aaa', 'cc', 'b']</code>", '오류'], answer: 1, explain: '<code>key = len</code> 은 “각 항목의 길이를 기준으로 비교하라”는 뜻입니다. 길이 1, 2, 3 순서 → <code>[\'b\', \'cc\', \'aaa\']</code>. 괄호 없이 함수 이름만 넘기는 점에 주의하세요.' }
        ],
        slides: [
          { layout: 'title', title: '리스트 값의 접근 · 변경과 조작 함수', subtitle: 'Section 02 — 리스트의 기본 (2)', badge: '07-2',
            notes: '<p><b>[도입 1분]</b> 복습 질문: “aa = [10, 20, 30, 40] 에서 마지막 값을 꺼내려면?” → aa[3]. “리스트 길이를 모른다면?” → aa[len(aa)-1] … 더 쉬운 방법이 오늘 나옵니다.</p>' },
          { layout: 'diagram', title: '음수 첨자와 슬라이싱', html: SVG_INDEX, caption: '음수 첨자: 뒤에서부터 · 슬라이싱: 경계 번호로 자르기',
            notes: '<p><b>[4분]</b> 음수 첨자: -1 은 맨 끝. 슬라이싱은 “칸 사이의 경계에 번호를 붙인다”고 설명하면 끝 번호가 포함되지 않는 이유가 자연스럽게 이해됩니다.</p>' },
          { layout: 'code', repl: true, title: '콜론(:)으로 범위 지정', code: `aa = [10, 20, 30, 40]
aa[-1]
aa[0:3]
aa[2:4]
aa[2:]
aa[:2]`, points: ['<code>[시작:끝]</code> 끝은 미포함', '앞 생략 = 처음부터', '뒤 생략 = 끝까지'],
            notes: '<p><b>[3분]</b> 실행 전에 결과를 먼저 예측하게 하세요. aa[:2] 는 “앞에서 2개”, aa[2:] 는 “2개 빼고 나머지”.</p>' },
          { layout: 'code', repl: true, title: '리스트 연산과 간격 지정', code: `aa = [10, 20, 30]
bb = [40, 50, 60]
aa + bb
aa * 3
cc = [10, 20, 30, 40, 50, 60, 70]
cc[::2]
cc[::-2]
cc[::-1]`, points: ['<code>+</code> 이어 붙이기, <code>*</code> 반복', '<code>[시작:끝:간격]</code>', '<code>[::-1]</code> 뒤집기'],
            notes: '<p><b>[4분]</b> 오개념 주의: aa * 3 을 [30, 60, 90] 으로 예상하는 학생이 많습니다. 항목별 계산은 7-6 교시의 컴프리헨션에서.</p>' },
          { layout: 'diagram', title: '간격(step) 슬라이싱', html: SVG_STEP, caption: '[::2] 한 칸씩 건너뛰기 · [::-1] 뒤집기',
            notes: '<p><b>[2분]</b> 문자열에도 같은 슬라이싱이 적용된다는 점을 예고합니다(8장 문자열).</p>' },
          { layout: 'two', title: '값 변경: aa[1:2] vs aa[1]', left: { title: '범위를 교체 → 항목 4개', code: `aa = [10, 20, 30]
aa[1:2] = [200, 201]
print(aa)` }, right: { title: '한 칸에 리스트 → 항목 3개', code: `aa = [10, 20, 30]
aa[1] = [200, 201]
print(aa)` },
            notes: '<p><b>[4분]</b> 두 코드의 차이를 먼저 예측하게 한 뒤 실행합니다. 오른쪽 결과 <code>[10, [200, 201], 30]</code> 은 “리스트 안의 리스트” → 다음 교시 2차원 리스트의 복선.</p>' },
          { layout: 'code', repl: true, title: '값의 삭제와 리스트 자체 삭제', code: `aa = [10, 20, 30]
del(aa[1])
aa
aa = [10, 20, 30, 40, 50]
aa[1:4] = []
aa
aa = [10, 20, 30]; aa = []; aa
aa = [10, 20, 30]; aa = None; aa
aa = [10, 20, 30]; del(aa); aa`, points: ['<code>del(aa[1])</code> 항목 삭제', '<code>aa[1:4] = []</code> 범위 삭제', '❶ [] ❷ None ❸ del → NameError'],
            notes: '<p><b>[4분]</b> 리스트 자체 삭제 3가지의 차이: ❶ 변수는 있고 비어 있음 ❷ None(값 없음, 셸에 표시 안 됨) ❸ 변수 자체가 사라짐.</p><p>세미콜론(;)은 한 줄에 여러 문장을 쓸 때 사용 — 실제 코드에서는 권장하지 않습니다.</p>' },
          { layout: 'table', title: '표 7-1 리스트 조작 함수', head: ['함수', '설명', '사용법'], rows: [['append()', '맨 뒤에 추가', 'aa.append(값)'], ['pop()', '맨 뒤를 빼냄', 'aa.pop()'], ['sort() / reverse()', '정렬 / 역순', 'aa.sort()'], ['index()', '값의 위치', 'aa.index(값)'], ['insert()', '위치에 삽입', 'aa.insert(위치, 값)'], ['remove()', '값 삭제(첫 번째만)', 'aa.remove(값)'], ['extend()', '리스트 이어 붙이기', 'aa.extend(리스트)'], ['count() / clear()', '개수 세기 / 모두 지우기', 'aa.count(값)'], ['del · len · copy · sorted', '위치 삭제 · 개수 · 복사 · 정렬된 새 리스트', 'len(aa)']],
            notes: '<p><b>[3분]</b> 외우기보다 “이런 기능이 있다”를 알고 필요할 때 표를 찾아보게 합니다. 리스트명.함수() 형식과 함수(리스트) 형식(del, len, sorted)을 구분해 주세요.</p>' },
          { layout: 'code', title: 'Code07-05. 조작 함수 (앞부분)', code: `myList = [30, 10, 20]
print("현재 리스트 : %s" % myList)

myList.append(40)
print("append(40) 후의 리스트 : %s" % myList)

print("pop()으로 추출한 값 : %s" % myList.pop())
print("pop() 후의 리스트 : %s" % myList)

myList.sort()
print("sort() 후의 리스트 : %s" % myList)

myList.reverse()
print("reverse() 후의 리스트 : %s" % myList)`, points: ['pop(): 값을 돌려주며 삭제', 'sort(): 오름차순', 'reverse(): 순서 뒤집기'],
            notes: '<p><b>[4분]</b> 한 줄씩 결과를 예측 → 실행. pop() 이 “돌려주기 + 삭제” 두 가지를 한다는 점을 강조합니다.</p>' },
          { layout: 'code', title: 'Code07-05. 조작 함수 (뒷부분)', code: `myList = [30, 20, 10]
print("20값의 위치 : %d" % myList.index(20))

myList.insert(2, 222)
print("insert(2, 222) 후의 리스트 : %s" % myList)

myList.remove(222)
print("remove(222) 후의 리스트 : %s" % myList)

myList.extend([77, 88, 77])
print("extend([77, 88, 77]) 후의 리스트 : %s" % myList)

print("77값의 개수 : %d" % myList.count(77))`, points: ['insert(위치, 값): 뒤로 밀림', 'remove(값): 값으로 삭제', 'extend(): 리스트 이어 붙이기'],
            notes: '<p><b>[3분]</b> 슬라이드에서는 앞부분의 결과 리스트 [30, 20, 10] 으로 시작하도록 나누었습니다. 원본은 하나의 파일(27행)입니다.</p><p>질문: “del(aa[2]) 와 aa.remove(2) 의 차이?” → 위치로 삭제 vs 값으로 삭제.</p>' },
          { layout: 'code', title: '📘 슬라이싱: 자르고 · 바꾸고 · 지우기', code: `aa = list(range(1, 11))
print("원본          :", aa)

aa[2:5] = [0, 0]            # 3칸 → 2칸 (길이가 줄어든다)
print("[2:5] = 2개   :", aa)

del aa[0:2]                 # 범위 삭제
print("del [0:2]     :", aa)

aa[len(aa):] = [7, 8]       # extend 와 같다
print("뒤에 붙이기   :", aa)

aa[:] = [1, 2, 3]           # 같은 객체의 내용만 교체
print("[:] 대입      :", aa)`, points: ['왼쪽에 쓰면 <b>교체</b>', '<code>del aa[a:b]</code> 로 범위 삭제', '<code>aa[:] = …</code> 는 내용만 교체', '<code>aa[::2] = …</code> 는 개수가 같아야 함'],
            notes: '<p><b>[4분]</b> 반복문 없이 한 줄로 처리된다는 점이 핵심입니다. 각 줄의 결과를 예측하게 한 뒤 실행하세요.</p><p>마지막 두 줄의 차이를 꼭 짚어 주세요: <code>aa[:] = [1,2,3]</code> 은 <b>원래 리스트의 내용</b>을 바꾸고, <code>aa = [1,2,3]</code> 은 이름표만 옮깁니다. <code>bb = aa</code> 가 있을 때 결과가 달라집니다.</p>' },
          { layout: 'code', title: '📘 sort(key = …) 와 람다 — 무엇을 기준으로?', code: `words = ['banana', 'Kiwi', 'apple', 'fig']
print(sorted(words))
print(sorted(words, key = len))
print(sorted(words, key = str.lower))

students = [['가은', 2, 88], ['나래', 1, 95],
            ['다온', 2, 95], ['라희', 1, 88]]
students.sort(key = lambda s : (-s[2], s[0]))
print(students)`, points: ['<code>key</code> = 비교에 쓸 값을 만드는 함수', '괄호 없이 이름만: <code>len</code>, <code>str.lower</code>', '<code>lambda</code> = 그 자리에서 만드는 짧은 함수', '튜플로 묶으면 <b>다중 기준</b>, <code>-</code> 는 내림차순'],
            notes: '<p><b>[5분]</b> 기본 정렬에서 대문자가 먼저 오는 이유(문자 코드 번호)를 먼저 확인합니다.</p><p>“key 는 항목마다 한 번씩 불려서 <b>비교용 값</b>을 만든다”로 설명하면 이해가 빠릅니다.</p><p>다중 기준: 튜플은 앞의 값부터 비교 → 1순위 점수(내림차순), 2순위 이름. 실습 7-8 로 연결됩니다.</p>' },
          { layout: 'two', title: 'sort() vs sorted()', left: { title: 'sort(): 자기 자신을 정렬', code: `myList = [30, 10, 20]
result = myList.sort()
print(myList)
print(result)` }, right: { title: 'sorted(): 새 리스트 반환', code: `myList = [30, 10, 20]
newList = sorted(myList)
print(myList)
print(newList)` },
            notes: '<p><b>[3분]</b> 흔한 버그 <code>myList = myList.sort()</code> → None. 원본을 보존해야 하면 sorted().</p><p>보충: <code>sort(reverse=True)</code> 로 내림차순.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>aa = [10, 20, 30]</code> 에서 <code>aa[1] = [200, 201]</code> 실행 후 <code>len(aa)</code> 는?', options: ['2', '3', '4', '오류'], answer: 1, explain: '[10, [200, 201], 30] → 3개',
            notes: '<p><b>[1분]</b> 이어서: “aa[1:2] = [200, 201] 이었다면?” → 4.</p>' },
          { layout: 'practice', title: '실습 7-5. 심사위원 점수', desc: '점수 5개를 입력받아 정렬하고, 최고 · 최저를 뺀 3개의 평균을 구하세요.', stdin: '7\n9\n8\n10\n6\n', starter: `scores = []
for i in range(0, 5) :
    scores.append(int(input(str(i + 1) + "번 심사위원 점수 : ")))
# TODO: 정렬, 슬라이싱, 평균`, solution: `scores = []
for i in range(0, 5) :
    scores.append(int(input(str(i + 1) + "번 심사위원 점수 : ")))
scores.sort()
print("정렬된 점수 :", scores)
mid = scores[1:-1]
print("최고 · 최저를 뺀 점수 :", mid)
print("평균 : %.1f" % (sum(mid) / len(mid)))`,
            notes: '<p><b>[6분]</b> scores[1:4] 와 scores[1:-1] 두 가지 답이 모두 가능. 심사위원 수가 바뀌어도 동작하는 쪽은? → [1:-1].</p>' },
          { layout: 'summary', title: '정리', bullets: ['음수 첨자: <code>aa[-1]</code> 마지막 항목', '슬라이싱 <code>aa[시작:끝:간격]</code> — 끝은 미포함, <code>[::-1]</code> 뒤집기, <code>+</code> · <code>*</code>', '변경 <code>aa[i] = 값</code>, 삭제 <code>del aa[i]</code>, 범위 교체 · 삭제 <code>aa[a:b] = […]</code>', '조작 함수: append · pop · sort · reverse · index · insert · remove · extend · count', 'sort() 는 자신을 정렬(None 반환), sorted() 는 새 리스트', '📘 <code>key = len</code> · <code>key = lambda s : (-s[2], s[0])</code> — 기준을 정한 정렬'],
            notes: '<p><b>[1분]</b> 다음 교시: 리스트 안에 리스트 — 2차원 리스트와 [프로그램 1] 거북이 100마리.</p>' }
        ]
      },
      /* ===================== ch07-3 ===================== */
      {
        id: 'ch07-3',
        title: '2차원 리스트와 [프로그램 1]',
        minutes: 50,
        goals: ['2차원 리스트의 구조(리스트의 리스트)를 설명할 수 있다', '중첩 for 문으로 2차원 리스트를 만들고 출력할 수 있다', '행마다 길이가 다른 불규칙한 2차원 리스트를 다룰 수 있다', '행 방향 · 열 방향 순회의 차이를 알고 zip(*표) 로 전치할 수 있다', '[[0] * 4] * 3 이 왜 위험한지 설명할 수 있다', '2차원 리스트로 거북이 100마리의 정보를 저장하는 [프로그램 1]을 완성할 수 있다'],
        flow: [['1차원 → 2차원 리스트', 7], ['Code07-06 중첩 for 문', 10], ['불규칙 · 행 / 열 순회 · 전치', 10], ['[프로그램 1] 완성', 16], ['정리 · 퀴즈', 7]],
        content: [
          { type: 'h', text: '2차원 리스트의 개념' },
          { type: 'p', html: '지금까지 다룬 리스트는 항목이 한 줄로 늘어선 <b>1차원 리스트</b>였습니다. <b>2차원 리스트</b>는 1차원 리스트 여러 개를 다시 하나의 리스트로 묶은 것으로, <b>행(가로줄)과 열(세로줄)로 된 표</b>처럼 생각할 수 있습니다. 값을 꺼낼 때는 첨자를 <b>2개</b> 사용합니다: <code>aa[행][열]</code>.' },
          { type: 'figure', html: SVG_2D, caption: '그림 7-4 · 7-5 1차원 리스트와 2차원 리스트의 개념' },
          { type: 'code', repl: true, title: '2차원 리스트 만들고 접근하기', code: `aa = [[1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12]]
aa[0]
aa[1][2]
aa[2][3]
len(aa)
len(aa[0])`, expect: `>>> aa = [[1, 2, 3, 4],
...       [5, 6, 7, 8],
...       [9, 10, 11, 12]]
>>> aa[0]
[1, 2, 3, 4]
>>> aa[1][2]
7
>>> aa[2][3]
12
>>> len(aa)
3
>>> len(aa[0])
4
>>>`, desc: '<code>aa[0]</code> 은 첫 번째 행 전체(1차원 리스트)입니다. <code>aa[1][2]</code> 는 “1행의 2열” — 먼저 <code>aa[1]</code> 로 <code>[5, 6, 7, 8]</code> 을 꺼낸 뒤 그 안에서 <code>[2]</code> 번째 값 7 을 꺼낸다고 생각하면 됩니다. <code>len(aa)</code> 는 행의 개수, <code>len(aa[0])</code> 은 열의 개수입니다. 괄호 안에서는 줄을 바꿔 써도 한 문장으로 인식됩니다.' },
          { type: 'h', text: '중첩 for 문으로 2차원 리스트 만들기' },
          { type: 'p', html: '3행 4열짜리 2차원 리스트를 만들고 1 ~ 12 를 차례대로 넣어 출력해 봅시다. 바깥 <code>for</code> 가 행을, 안쪽 <code>for</code> 가 열을 담당합니다.' },
          { type: 'code', title: 'Code07-06. 3행 4열 2차원 리스트', code: `list1 = []
list2 = []
value = 1
for i in range(0, 3) :
    for k in range(0, 4) :
        list1.append(value)
        value += 1
    list2.append(list1)
    list1 = []

for i in range(0, 3) :
    for k in range(0, 4) :
        print("%3d" % list2[i][k], end = " ")
    print("")`, expect: `  1   2   3   4
  5   6   7   8
  9  10  11  12`, desc: '<code>5~7행</code>: 한 행(<code>list1</code>)에 값 4개를 채웁니다. <code>8행</code>: 완성된 한 행을 <code>list2</code> 에 통째로 추가합니다. <code>9행</code>: 다음 행을 위해 <code>list1</code> 을 <b>새 빈 리스트</b>로 바꿉니다. <code>13행</code>의 <code>%3d</code> 는 3칸 폭으로 오른쪽 정렬, <code>end = " "</code> 는 줄을 바꾸지 않고 공백을 출력합니다. <code>14행</code>의 <code>print("")</code> 로 한 행이 끝날 때마다 줄을 바꿉니다.' },
          { type: 'callout', kind: 'warn', title: '9행을 list1.clear() 로 바꾸면 안 되는 이유', html: '<code>list2.append(list1)</code> 는 list1 의 <b>복사본이 아니라 list1 그 자체(같은 리스트)</b>를 넣습니다. <code>list1 = []</code> 는 이름 list1 이 <b>새 리스트</b>를 가리키게 하므로 이미 넣은 행은 안전합니다. 하지만 <code>list1.clear()</code> 는 이미 list2 에 들어간 그 리스트의 내용을 지워 버려서 모든 행이 망가집니다. (리스트 복사와 참조는 7-6 교시에서 자세히)' },
          { type: 'code', title: '추가 예제. 9행을 clear() 로 바꾸면?', code: `list1 = []
list2 = []
value = 1
for i in range(0, 3) :
    for k in range(0, 4) :
        list1.append(value)
        value += 1
    list2.append(list1)
    list1.clear()        # list1 = [] 대신 사용하면?

print(list2)`, expect: '[[], [], []]', desc: '세 행 모두 같은 리스트(list1)를 가리키고 있고, 그 리스트는 마지막에 비워졌기 때문에 빈 리스트 세 개로 보입니다.' },
          { type: 'callout', kind: 'more', title: '📘 2차원 리스트를 만드는 다른 방법', html: '<ul><li><code>for row in list2 :</code> 처럼 첨자 없이 행을 하나씩 꺼내고, 다시 <code>for v in row :</code> 로 값을 꺼낼 수 있습니다.</li><li>0 으로 채운 3행 4열: <code>[[0] * 4 for i in range(3)]</code> (컴프리헨션, 7-6 교시)</li><li>⚠ <code>[[0] * 4] * 3</code> 은 <b>같은 행 하나를 3번 가리키는</b> 리스트라서 한 칸을 바꾸면 세 행이 모두 바뀝니다. 흔한 함정이니 쓰지 마세요.</li></ul>' },
          { type: 'code', title: '추가 예제. for-in 으로 출력 · [[0]*4]*3 의 함정', code: `table = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]
for row in table :
    for v in row :
        print("%3d" % v, end = " ")
    print()

good = [[0] * 4 for i in range(3)]
bad = [[0] * 4] * 3
good[0][0] = 99
bad[0][0] = 99
print("good :", good)
print("bad  :", bad)`, expect: `  1   2   3   4
  5   6   7   8
  9  10  11  12
good : [[99, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
bad  : [[99, 0, 0, 0], [99, 0, 0, 0], [99, 0, 0, 0]]` },
          { type: 'h', text: '불규칙한 크기의 2차원 리스트' },
          { type: 'p', html: '파이썬의 2차원 리스트는 각 행이 독립된 리스트이므로 <b>행마다 길이가 달라도</b> 됩니다. 이때는 열의 개수를 고정된 숫자로 쓰지 말고 <code>len(aa[i])</code> 로 행마다 구해야 합니다.' },
          { type: 'figure', html: SVG_JAGGED, caption: '그림 7-6 불규칙한 크기의 2차원 리스트' },
          { type: 'code', title: '추가 예제. 불규칙한 2차원 리스트 출력하기', code: `aa = [[1, 2, 3, 4],
      [5, 6],
      [7, 8, 9]]

for i in range(0, len(aa)) :
    for k in range(0, len(aa[i])) :
        print("aa[%d][%d]=%d" % (i, k, aa[i][k]), end = "  ")
    print()`, expect: `aa[0][0]=1  aa[0][1]=2  aa[0][2]=3  aa[0][3]=4
aa[1][0]=5  aa[1][1]=6
aa[2][0]=7  aa[2][1]=8  aa[2][2]=9`, desc: '안쪽 반복을 <code>range(0, 4)</code> 로 고정하면 1행에서 <code>aa[1][2]</code> 에 접근하다가 IndexError 가 납니다.' },
          { type: 'h', text: '행 순회와 열 순회 — 방향이 다르면 코드가 다르다' },
          { type: 'p', html: '2차원 리스트는 <b>행</b>이 바깥, <b>열</b>이 안쪽입니다. 그래서 <b>행 방향</b> 계산(학생별 합계)은 <code>sum(scores[i])</code> 한 줄이면 되지만, <b>열 방향</b> 계산(과목별 합계)은 행을 돌면서 같은 열 번호의 값을 모아야 합니다. 이 비대칭을 이해하면 표 형태의 데이터를 자유롭게 다룰 수 있습니다.' },
          { type: 'figure', html: SVG_TRANSPOSE, caption: '행 순회 · 열 순회와 zip(*) 으로 행 · 열 맞바꾸기(전치)' },
          { type: 'code', title: '추가 예제. 행 합계(학생별)와 열 합계(과목별)', code: `scores = [[80, 85, 90],
          [70, 80, 95],
          [90, 90, 85]]
subjects = ['국어', '영어', '수학']

print("--- 행(학생)별 ---")
for i in range(0, len(scores)) :
    print("학생 %d : 합계 %d, 평균 %.1f" % (i + 1, sum(scores[i]), sum(scores[i]) / len(scores[i])))

print("--- 열(과목)별 ---")
for k in range(0, len(subjects)) :
    hap = 0
    for i in range(0, len(scores)) :     # 같은 열의 값을 행마다 모은다
        hap += scores[i][k]
    print("%s : 합계 %d, 평균 %.1f" % (subjects[k], hap, hap / len(scores)))`, expect: `--- 행(학생)별 ---
학생 1 : 합계 255, 평균 85.0
학생 2 : 합계 245, 평균 81.7
학생 3 : 합계 265, 평균 88.3
--- 열(과목)별 ---
국어 : 합계 240, 평균 80.0
영어 : 합계 255, 평균 85.0
수학 : 합계 270, 평균 90.0`, desc: '열 합계에서는 바깥 반복이 <b>열 번호 k</b>, 안쪽 반복이 <b>행 번호 i</b> 입니다. 두 반복의 순서를 바꾸는 것만으로 계산 방향이 달라집니다.' },
          { type: 'callout', kind: 'more', title: '📘 zip(*리스트) — 행과 열을 맞바꾸기(전치, transpose)', html: '<code>*</code> 를 함수 인자 앞에 붙이면 리스트를 <b>풀어서</b> 하나씩 넘긴다는 뜻입니다. 즉 <code>zip(*scores)</code> 는 <code>zip(scores[0], scores[1], scores[2])</code> 와 같습니다. <code>zip()</code> 은 같은 위치끼리 묶어 주므로(7-6 교시) 결과는 <b>열이 행이 된</b> 새 표가 됩니다.<br>열 방향 계산이 여러 번 필요하다면 한 번 전치해 두고 <b>행처럼</b> 다루는 편이 읽기 쉽습니다.' },
          { type: 'code', title: '추가 예제. zip(*) 으로 전치한 뒤 과목별로 계산하기', code: `scores = [[80, 85, 90],
          [70, 80, 95],
          [90, 90, 85]]
subjects = ['국어', '영어', '수학']

print(list(zip(*scores)))                       # 튜플의 리스트

bySubject = [list(col) for col in zip(*scores)]  # 리스트의 리스트로
print(bySubject)

for k in range(0, len(subjects)) :
    col = bySubject[k]
    print("%s : 합계 %d, 최고 %d" % (subjects[k], sum(col), max(col)))`, expect: `[(80, 70, 90), (85, 80, 90), (90, 95, 85)]
[[80, 70, 90], [85, 80, 90], [90, 95, 85]]
국어 : 합계 240, 최고 90
영어 : 합계 255, 최고 90
수학 : 합계 270, 최고 95`, desc: '전치한 뒤에는 <code>sum(col)</code>, <code>max(col)</code> 처럼 1차원 리스트 함수를 그대로 쓸 수 있습니다. <code>[list(col) for col in …]</code> 은 컴프리헨션입니다(7-6 교시).' },
          { type: 'callout', kind: 'warn', title: '다시 한 번: [[0] * 4] * 3 을 쓰지 마세요', html: '<code>[[0] * 4] * 3</code> 은 <b>행 하나를 만들어 그 이름표를 3번 복사</b>한 것입니다. 세 행이 모두 같은 리스트라서 <code>bad[0][0] = 99</code> 가 세 행에 모두 나타납니다. 앞의 “추가 예제”에서 직접 확인했지요.<br>0 으로 채운 3행 4열이 필요하면 <code>[[0] * 4 for i in range(3)]</code> 처럼 <b>행을 매번 새로 만드는</b> 형태를 쓰세요. 반대로 <code>[0] * 4</code> 는 안에 든 것이 <b>불변</b>인 정수라서 안전합니다 — 문제가 되는 것은 <b>가변 객체(리스트 · 딕셔너리)를 곱할 때</b>입니다.' },
          { type: 'h', text: '[프로그램 1]의 완성 — 화면 중앙에서 밖으로 나가는 거북이' },
          { type: 'p', html: '거북이 한 마리의 정보는 <b>거북이 객체, X 위치, Y 위치, 크기, 색상(R, G, B)</b> 입니다. 이 7개를 1차원 리스트 하나로 묶고, 거북이 100마리의 리스트를 다시 하나로 묶으면 2차원 리스트가 됩니다.' },
          { type: 'code', run: false, title: '거북이 정보의 1차원 리스트와 2차원 리스트', code: `# 거북이 한 마리의 1차원 리스트
[거북이, X위치, Y위치, 거북이크기, 거북이색상(R), 거북이색상(G), 거북이색상(B)]

# 2차원 리스트
[[거북이1, X, Y, 크기, R, G, B], [거북이2, X, Y, 크기, R, G, B], [거북이3, X, Y, 크기, R, G, B] …]` },
          { type: 'figure', html: SVG_TURTLE_LIST, caption: 'playerTurtles — 행 하나 = 거북이 한 마리, tList[0] ~ tList[6] 의 의미' },
          { type: 'code', title: 'Code07-07. [프로그램 1] 완성: 화면 중앙에서 밖으로 나가는 거북이', nondeterministic: true, code: `import turtle
import random

## 전역 변수 선언 부분 ##
myTurtle, tX, tY, tColor, tSize, tShape = [None] * 6
shapeList = []
playerTurtles = []    # 거북이 2차원 리스트
swidth, sheight = 500, 500

## 메인 코드 부분 ##
if __name__ == "__main__" :
    turtle.title('거북 리스트 활용')
    turtle.setup(width = swidth + 50, height = sheight + 50)
    turtle.screensize(swidth, sheight)

    shapeList = turtle.getshapes()
    for i in range(0, 100) :
        random.shuffle(shapeList)
        myTurtle = turtle.Turtle(shapeList[0])
        tX = random.randrange(-swidth // 2, swidth // 2)
        tY = random.randrange(-sheight // 2, sheight // 2)
        r = random.random(); g = random.random(); b = random.random()
        tSize = random.randrange(1, 3)
        playerTurtles.append([myTurtle, tX, tY, tSize, r, g, b])

    for tList in playerTurtles :
        myTurtle = tList[0]
        myTurtle.color((tList[4], tList[5], tList[6]))
        myTurtle.pencolor((tList[4], tList[5], tList[6]))
        myTurtle.turtlesize(tList[3])
        myTurtle.goto(tList[1], tList[2])
    turtle.done()`, desc: '<code>5행</code>: <code>[None] * 6</code> 은 <code>[None, None, None, None, None, None]</code> 이고, 이것을 변수 6개에 한 번에 나누어 담습니다(“아직 값 없음”으로 초기화). <code>16행</code>: <code>getshapes()</code> 는 사용할 수 있는 거북이 모양 이름 리스트(<code>[\'arrow\', \'blank\', \'circle\', …]</code>)를 돌려줍니다. <code>18~19행</code>: 모양 리스트를 무작위로 섞은 뒤 맨 앞 모양으로 새 거북이를 만듭니다. <code>20~21행</code>: 강의자료는 <code>swidth / 2</code> 로 썼지만, <code>/</code> 의 결과는 실수(250.0)이고 파이썬 3.12부터 <code>randrange()</code> 는 실수를 받지 않아 <code>TypeError</code> 가 나므로 정수 나눗셈 <code>//</code> 로 바꾸었습니다. <code>20~23행</code>: 위치 · 색상(0~1 실수) · 크기(1 또는 2)를 무작위로 정하고, <code>24행</code>에서 거북이 한 마리의 정보를 리스트로 묶어 2차원 리스트에 추가합니다. <code>26~31행</code>: 2차원 리스트에서 한 행(<code>tList</code>)씩 꺼내 색 · 크기를 설정하고 목표 위치로 이동시킵니다. 모든 거북이는 화면 중앙 (0, 0) 에서 출발하므로 중앙에서 밖으로 퍼져 나가는 선이 그려집니다.' },
          { type: 'callout', kind: 'tip', title: 'Tip · random.choice(리스트)', html: '<code>18~19행</code>은 <code>random.choice(리스트)</code> 를 이용하도록 바꿀 수 있습니다. <code>random.choice()</code> 는 리스트에서 임의의 항목 하나를 골라 돌려줍니다. 리스트 전체를 섞을 필요가 없어 더 간단합니다.<pre><code>tmpShape = random.choice(shapeList)\nmyTurtle = turtle.Turtle(tmpShape)</code></pre>' },
          { type: 'callout', kind: 'more', title: '📘 if __name__ == "__main__" : 은 무엇인가요?', html: '이 파일을 직접 실행했을 때만 아래 코드를 실행하라는 뜻입니다. 다른 파일에서 <code>import</code> 해서 쓸 때는 실행되지 않습니다(모듈은 10장). 지금은 “메인 코드가 시작되는 곳”이라는 표시로 이해하면 충분합니다. 또 거북이가 100마리라 그리는 데 시간이 걸린다면 <code>turtle.tracer(0)</code> 으로 애니메이션을 끄고 마지막에 <code>turtle.update()</code> 를 호출하면 한 번에 그려집니다.' },
          { type: 'code', title: '추가 예제. random.choice() 와 random.seed() 로 결과 고정하기', code: `import random

shapeList = ['arrow', 'blank', 'circle', 'classic', 'square', 'triangle', 'turtle']
random.seed(7)          # 같은 seed 이면 매번 같은 난수가 나온다
for i in range(0, 3) :
    tmpShape = random.choice(shapeList)
    tX = random.randrange(-250, 250)
    tSize = random.randrange(1, 3)
    print([tmpShape, tX, tSize])`, nondeterministic: true, desc: '<code>random.seed(값)</code> 을 쓰면 실행할 때마다 같은 “무작위” 결과를 얻을 수 있어 디버깅할 때 편리합니다. (파이썬 버전에 따라 결과가 다를 수 있습니다)' }
        ],
        practice: [
          {
            title: 'SELF STUDY 7-3. 4행 5열에 3의 배수 넣기',
            level: 1,
            desc: '<p>4행 5열의 2차원 리스트를 만들고, 0부터 3의 배수를 차례대로 넣어 출력하도록 Code07-06 을 수정하세요.</p><pre>  0   3   6   9  12\n 15  18  21  24  27\n 30  33  36  39  42\n 45  48  51  54  57</pre>',
            hint: '<code>value</code> 를 0 에서 시작해 3씩 증가시키고, 반복 범위를 <code>range(0, 4)</code> · <code>range(0, 5)</code> 로 바꿉니다.',
            starter: `list1 = []
list2 = []
value = 0
# TODO: 4행 5열, 3의 배수

# TODO: 출력
`,
            solution: `list1 = []
list2 = []
value = 0
for i in range(0, 4) :
    for k in range(0, 5) :
        list1.append(value)
        value += 3
    list2.append(list1)
    list1 = []

for i in range(0, 4) :
    for k in range(0, 5) :
        print("%3d" % list2[i][k], end = " ")
    print("")
`,
            expect: `  0   3   6   9  12
 15  18  21  24  27
 30  33  36  39  42
 45  48  51  54  57`
          },
          {
            title: '실습 7-10. 성적표 2차원 리스트',
            level: 2,
            desc: '<p>학생 3명의 국어 · 영어 · 수학 점수가 2차원 리스트로 주어집니다. 학생별 <b>합계와 평균</b>, 그리고 과목별 <b>평균</b>을 출력하세요.</p><pre>1번 학생 : 합계 255, 평균 85.0\n…\n과목 평균 : 국어 80.0, 영어 85.0, 수학 90.0</pre>',
            hint: '학생별 합계는 <code>sum(scores[i])</code>. 과목별 합계는 바깥 반복을 과목(열) <code>k</code>, 안쪽 반복을 학생(행) <code>i</code> 로 바꿔 <code>scores[i][k]</code> 를 더합니다.',
            starter: `scores = [[80, 85, 90],
          [70, 80, 95],
          [90, 90, 85]]
subjects = ['국어', '영어', '수학']

# TODO: 학생별 합계 · 평균

# TODO: 과목별 평균
`,
            solution: `scores = [[80, 85, 90],
          [70, 80, 95],
          [90, 90, 85]]
subjects = ['국어', '영어', '수학']

for i in range(0, len(scores)) :
    hap = sum(scores[i])
    print("%d번 학생 : 합계 %d, 평균 %.1f" % (i + 1, hap, hap / len(scores[i])))

result = "과목 평균 :"
for k in range(0, len(subjects)) :
    hap = 0
    for i in range(0, len(scores)) :
        hap += scores[i][k]
    result += " %s %.1f" % (subjects[k], hap / len(scores))
    if k < len(subjects) - 1 :
        result += ","
print(result)
`,
            expect: `1번 학생 : 합계 255, 평균 85.0
2번 학생 : 합계 245, 평균 81.7
3번 학생 : 합계 265, 평균 88.3
과목 평균 : 국어 80.0, 영어 85.0, 수학 90.0`
          },
          {
            title: '실습 7-11. 거북이 수 · 크기 바꾸기 (random.choice)',
            level: 2,
            desc: '<p>Code07-07 을 수정하세요.</p><ol><li>거북이를 30마리만 만듭니다.</li><li>모양은 <code>random.shuffle</code> 대신 <code>random.choice(shapeList)</code> 로 고릅니다.</li><li>크기는 1 ~ 3 중에서 무작위로 정합니다.</li><li>이동한 뒤 거북이 옆에 번호(1 ~ 30)를 <code>write()</code> 로 씁니다.</li></ol>',
            hint: '<code>random.randrange(1, 4)</code> 는 1, 2, 3 중 하나. 번호는 <code>enumerate</code> 를 몰라도 <code>num = 1</code> 로 시작해 반복마다 1씩 늘리면 됩니다.',
            starter: `import turtle
import random

playerTurtles = []
swidth, sheight = 500, 500

turtle.title('거북 리스트 활용')
turtle.setup(width = swidth + 50, height = sheight + 50)
turtle.screensize(swidth, sheight)
shapeList = turtle.getshapes()

# TODO: 30마리, random.choice, 크기 1~3

# TODO: 이동 후 번호 쓰기

turtle.done()
`,
            solution: `import turtle
import random

playerTurtles = []
swidth, sheight = 500, 500

turtle.title('거북 리스트 활용')
turtle.setup(width = swidth + 50, height = sheight + 50)
turtle.screensize(swidth, sheight)
shapeList = turtle.getshapes()

for i in range(0, 30) :
    tmpShape = random.choice(shapeList)
    myTurtle = turtle.Turtle(tmpShape)
    tX = random.randrange(-swidth // 2, swidth // 2)
    tY = random.randrange(-sheight // 2, sheight // 2)
    r = random.random(); g = random.random(); b = random.random()
    tSize = random.randrange(1, 4)
    playerTurtles.append([myTurtle, tX, tY, tSize, r, g, b])

num = 1
for tList in playerTurtles :
    myTurtle = tList[0]
    myTurtle.color((tList[4], tList[5], tList[6]))
    myTurtle.turtlesize(tList[3])
    myTurtle.goto(tList[1], tList[2])
    myTurtle.write(str(num))
    num += 1

turtle.done()
`,
            nondeterministic: true
          },
          {
            title: '실습 7-12. 2차원 리스트의 행 · 열 다루기',
            level: 1,
            desc: '<p>3행 4열의 숫자 표가 주어집니다. 다음을 출력하세요.</p><ol><li>표 모양 그대로 출력 (한 칸에 <code>%3d</code>)</li><li>각 <b>행</b>의 합계</li><li>각 <b>열</b>의 합계</li><li>전체 합계</li><li>가장 큰 값과 그 위치 <code>matrix[행][열]</code></li></ol><pre>  3  8  1  6\n  7  2  9  4\n  5  0  6  2\n0행 합계 : 18\n…\n최댓값 9 → matrix[1][2]</pre>',
            hint: '행 합계는 <code>sum(matrix[i])</code>. 열 합계는 바깥 반복을 열 <code>k</code>, 안쪽 반복을 행 <code>i</code> 로 두고 <code>matrix[i][k]</code> 를 더합니다. 최댓값의 위치는 두 반복을 돌며 더 큰 값을 만날 때 <code>bi, bk = i, k</code> 로 기억합니다.',
            starter: `matrix = [[3, 8, 1, 6],
          [7, 2, 9, 4],
          [5, 0, 6, 2]]

# TODO: 표 모양으로 출력

# TODO: 행 합계

# TODO: 열 합계

# TODO: 전체 합계, 최댓값과 위치
`,
            solution: `matrix = [[3, 8, 1, 6],
          [7, 2, 9, 4],
          [5, 0, 6, 2]]

for row in matrix :
    for v in row :
        print("%3d" % v, end = "")
    print()

for i in range(0, len(matrix)) :
    print("%d행 합계 : %d" % (i, sum(matrix[i])))

for k in range(0, len(matrix[0])) :
    hap = 0
    for i in range(0, len(matrix)) :
        hap += matrix[i][k]
    print("%d열 합계 : %d" % (k, hap))

total = 0
best, bi, bk = matrix[0][0], 0, 0
for i in range(0, len(matrix)) :
    for k in range(0, len(matrix[i])) :
        total += matrix[i][k]
        if matrix[i][k] > best :
            best, bi, bk = matrix[i][k], i, k

print("전체 합계 :", total)
print("최댓값 %d → matrix[%d][%d]" % (best, bi, bk))
`,
            expect: `  3  8  1  6
  7  2  9  4
  5  0  6  2
0행 합계 : 18
1행 합계 : 22
2행 합계 : 13
0열 합계 : 15
1열 합계 : 10
2열 합계 : 16
3열 합계 : 12
전체 합계 : 53
최댓값 9 → matrix[1][2]`
          },
          {
            title: '실습 7-13. 틱택토(O · X) 승패 판정기',
            level: 3,
            desc: '<p>3 × 3 틱택토 판이 여러 개 들어 있는 리스트가 주어집니다. 각 판의 결과를 판정하세요.</p><p><b>요구 사항</b></p><ul><li>판마다 <code>=== N번 판 ===</code> 을 먼저 출력하고, 보드를 <code>O | X | X</code> 모양으로 세 줄 출력합니다. 빈 칸은 <code>\' \'</code> 입니다.</li><li><b>승리 줄</b>은 가로 3줄 · 세로 3줄 · 대각선 2줄, 모두 <b>8줄</b>입니다. 한 줄의 세 칸이 모두 같고 빈 칸이 아니면 그 기호가 승자입니다.</li><li>승자가 있으면 <code>승자 : O</code>, 없고 빈 칸이 남았으면 <code>아직 진행 중 (빈 칸 N개)</code>, 빈 칸도 없으면 <code>무승부</code> 를 출력합니다.</li></ul><p>👉 <b>더 해 보기</b>: 승리한 줄이 무엇인지(가로 1행 / 대각선 …) 함께 출력하기, 사용자에게 좌표를 입력받아 한 수씩 두면서 판정하기, 판 크기를 4 × 4 로 바꿔도 동작하게 만들기.</p>',
            hint: '검사할 8줄을 먼저 리스트 <code>lines</code> 에 모아 두면 판정 코드가 짧아집니다. 가로는 <code>board[i]</code>, 세로는 <code>[board[0][k], board[1][k], board[2][k]]</code>, 대각선은 <code>[board[0][0], board[1][1], board[2][2]]</code> 와 <code>[board[0][2], board[1][1], board[2][0]]</code> 입니다. 빈 칸 수는 <code>row.count(\' \')</code> 로 셉니다.',
            starter: `boards = [[['O', 'X', 'X'], ['X', 'O', 'O'], ['X', 'O', 'O']],
          [['X', 'X', 'X'], ['O', 'O', ' '], [' ', ' ', 'O']],
          [['O', 'X', 'O'], ['X', 'X', 'O'], ['O', 'O', 'X']],
          [['O', 'X', ' '], [' ', 'O', ' '], [' ', ' ', ' ']]]

for no in range(0, len(boards)) :
    board = boards[no]
    print("=== %d번 판 ===" % (no + 1))
    # TODO: 보드 세 줄 출력

    # TODO: 검사할 8줄을 lines 에 모으기

    # TODO: 승자 찾기 / 빈 칸 세기 / 결과 출력
`,
            solution: `boards = [[['O', 'X', 'X'], ['X', 'O', 'O'], ['X', 'O', 'O']],
          [['X', 'X', 'X'], ['O', 'O', ' '], [' ', ' ', 'O']],
          [['O', 'X', 'O'], ['X', 'X', 'O'], ['O', 'O', 'X']],
          [['O', 'X', ' '], [' ', 'O', ' '], [' ', ' ', ' ']]]

for no in range(0, len(boards)) :
    board = boards[no]
    print("=== %d번 판 ===" % (no + 1))
    for row in board :
        print(row[0], "|", row[1], "|", row[2])

    lines = []
    for i in range(0, 3) :
        lines.append(board[i])
    for k in range(0, 3) :
        lines.append([board[0][k], board[1][k], board[2][k]])
    lines.append([board[0][0], board[1][1], board[2][2]])
    lines.append([board[0][2], board[1][1], board[2][0]])

    winner = ''
    for line in lines :
        if line[0] != ' ' and line[0] == line[1] and line[1] == line[2] :
            winner = line[0]

    empty = 0
    for row in board :
        empty += row.count(' ')

    if winner != '' :
        print("승자 : %s" % winner)
    elif empty > 0 :
        print("아직 진행 중 (빈 칸 %d개)" % empty)
    else :
        print("무승부")
`,
            expect: `=== 1번 판 ===
O | X | X
X | O | O
X | O | O
승자 : O
=== 2번 판 ===
X | X | X
O | O |
  |   | O
승자 : X
=== 3번 판 ===
O | X | O
X | X | O
O | O | X
무승부
=== 4번 판 ===
O | X |
  | O |
  |   |
아직 진행 중 (빈 칸 6개)`
          }
        ],
        quiz: [
          { q: '<code>aa = [[1, 2, 3], [4, 5, 6]]</code> 일 때 <code>aa[1][0]</code> 의 값은?', options: ['1', '2', '4', '5'], answer: 2, explain: '<code>aa[1]</code> = <code>[4, 5, 6]</code>, 그 안의 <code>[0]</code> = 4' },
          { q: 'Code07-06 에서 <code>list2.append(list1)</code> 다음 줄의 <code>list1 = []</code> 를 지우면 출력 결과는?', options: ['똑같이 3행 4열이 출력된다', '모든 행이 12개짜리 같은 리스트가 되어 출력 모양이 1 2 3 4 가 세 번 반복된다', '오류가 난다', '아무것도 출력되지 않는다'], answer: 1, explain: 'list1 이 계속 같은 리스트라서 12개가 모두 한 리스트에 쌓이고, list2 의 세 행이 모두 그 리스트를 가리킵니다. 출력은 각 행의 앞 4개(1 2 3 4)만 세 번 나옵니다.' },
          { q: 'Code07-07 에서 거북이 한 마리의 정보 리스트 <code>tList</code> 의 <code>tList[3]</code> 은 무엇인가?', options: ['거북이 객체', 'X 위치', '거북이 크기', '빨강(R) 색상값'], answer: 2, explain: '<code>[myTurtle, tX, tY, tSize, r, g, b]</code> 이므로 첨자 3은 tSize' },
          { q: '<code>random.choice(shapeList)</code> 가 하는 일은?', options: ['리스트를 무작위로 섞는다', '리스트에서 임의의 항목 하나를 돌려준다', '리스트를 정렬한다', '0~1 사이 실수를 돌려준다'], answer: 1, explain: '섞는 것은 <code>random.shuffle()</code>, 0~1 실수는 <code>random.random()</code> 입니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>bad = [[0] * 3] * 2\nbad[0][0] = 7\nprint(bad)</code></pre>', options: ['<code>[[7, 0, 0], [0, 0, 0]]</code>', '<code>[[7, 0, 0], [7, 0, 0]]</code>', '<code>[[7, 7, 7], [0, 0, 0]]</code>', '오류'], answer: 1, explain: '<code>[리스트] * 2</code> 는 <b>같은 행</b>의 이름표를 두 번 복사합니다. 두 행이 같은 리스트라서 한 칸을 바꾸면 모두 바뀝니다. 올바른 방법은 <code>[[0] * 3 for i in range(2)]</code>.' },
          { q: '<code>scores = [[80, 85], [70, 90]]</code> 에서 <b>열(과목)별</b> 합계를 구하려면?', options: ['<code>sum(scores[k])</code> 를 k = 0, 1 로 반복', '바깥 반복 k(열), 안쪽 반복 i(행)로 <code>scores[i][k]</code> 를 더한다', '<code>sum(scores)</code> 한 번이면 된다', '<code>len(scores[0])</code> 을 더한다'], answer: 1, explain: '행 합계는 <code>sum(scores[i])</code> 로 간단하지만, 열은 행마다 같은 열 번호의 값을 모아야 합니다. <code>zip(*scores)</code> 로 전치한 뒤 행처럼 다루는 방법도 있습니다.' }
        ],
        slides: [
          { layout: 'title', title: '2차원 리스트와 [프로그램 1]', subtitle: 'Section 02~03 — 2차원 리스트', badge: '07-3',
            notes: '<p><b>[도입 1분]</b> 지난 시간 <code>aa[1] = [200, 201]</code> 의 결과 <code>[10, [200, 201], 30]</code> 을 다시 보여 주며 “리스트 안에 리스트를 넣을 수 있다”로 시작합니다.</p>' },
          { layout: 'diagram', title: '2차원 리스트의 개념', html: SVG_2D, caption: '1차원 리스트를 여러 개 묶은 것 — 첨자 2개 [행][열]',
            notes: '<p><b>[4분]</b> 엑셀 표, 교실 좌석표 비유. aa[행][열] 순서! aa[1][2] 를 그림에서 짚어 보게 합니다.</p>' },
          { layout: 'code', repl: true, title: '2차원 리스트 접근', code: `aa = [[1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12]]
aa[0]
aa[1][2]
len(aa)
len(aa[0])`, points: ['<code>aa[0]</code> → 한 행 전체', '<code>aa[1][2]</code> → 7', '행 수 len(aa), 열 수 len(aa[0])'],
            notes: '<p><b>[3분]</b> aa[1][2] 를 두 단계로 풀어 설명: aa[1] → [5,6,7,8] → 그 [2] → 7.</p>' },
          { layout: 'code', title: 'Code07-06. 중첩 for 문', code: `list1 = []
list2 = []
value = 1
for i in range(0, 3) :
    for k in range(0, 4) :
        list1.append(value)
        value += 1
    list2.append(list1)
    list1 = []

for i in range(0, 3) :
    for k in range(0, 4) :
        print("%3d" % list2[i][k], end = " ")
    print("")`, points: ['안쪽 for: 한 행 채우기', '8행: 행을 통째로 추가', '9행: 새 빈 리스트로 교체', '<code>%3d</code>, <code>end=" "</code>'],
            notes: '<p><b>[6분]</b> 실행 전에 i, k 가 어떻게 변하는지 표로 추적하게 합니다.</p><p>심화 질문: 9행을 <code>list1.clear()</code> 로 바꾸면? → [[], [], []] (참조 문제, 7-6 교시 복선). 시간이 되면 직접 바꿔 실행해 보여 주세요.</p>' },
          { layout: 'diagram', title: '불규칙한 크기의 2차원 리스트', html: SVG_JAGGED, caption: '그림 7-6 행마다 길이가 다를 수 있다',
            notes: '<p><b>[3분]</b> 이 경우 range(0, 4) 로 고정하면 IndexError. 안쪽 반복은 <code>range(len(aa[i]))</code> 로.</p>' },
          { layout: 'code', title: '불규칙한 2차원 리스트 출력', code: `aa = [[1, 2, 3, 4],
      [5, 6],
      [7, 8, 9]]

for i in range(0, len(aa)) :
    for k in range(0, len(aa[i])) :
        print("aa[%d][%d]=%d" % (i, k, aa[i][k]), end = "  ")
    print()`, points: ['행마다 <code>len(aa[i])</code>', '고정 숫자 대신 len() 습관'],
            notes: '<p><b>[2분]</b> 강의자료 그림 7-6 을 코드로 확인하는 추가 예제입니다.</p>' },
          { layout: 'diagram', title: '행 순회 · 열 순회 · 전치', html: SVG_TRANSPOSE, caption: '행 합계는 sum(scores[i]), 열 합계는 행마다 모아야 한다 — zip(*scores) 로 맞바꾸기',
            notes: '<p><b>[4분]</b> “행은 쉽고 열은 번거롭다”는 비대칭을 먼저 느끼게 합니다. 표에서 가로줄 하나(초록)와 세로줄 하나(주황)를 손으로 짚어 주세요.</p><p>질문: “과목 평균을 구하려면 어느 방향으로 돌아야 할까?” → 열 방향. 그래서 반복문의 안팎이 뒤바뀝니다.</p>' },
          { layout: 'code', title: '행 합계 vs 열 합계', code: `scores = [[80, 85, 90],
          [70, 80, 95],
          [90, 90, 85]]
subjects = ['국어', '영어', '수학']

for i in range(0, len(scores)) :
    print("학생 %d : %d" % (i + 1, sum(scores[i])))

for k in range(0, len(subjects)) :
    hap = 0
    for i in range(0, len(scores)) :
        hap += scores[i][k]
    print("%s : %d" % (subjects[k], hap))

print(list(zip(*scores)))`, points: ['행: <code>sum(scores[i])</code> 한 줄', '열: 바깥 k(열) · 안쪽 i(행)', '<code>zip(*scores)</code> → 전치', '<code>*</code> = 리스트를 풀어서 넘기기'],
            notes: '<p><b>[5분]</b> 두 반복문의 <b>순서만</b> 바뀐 것을 강조합니다.</p><p>마지막 줄은 보너스: <code>zip(*scores)</code> 는 <code>zip(scores[0], scores[1], scores[2])</code> 와 같습니다. 열 계산이 여러 번 필요하면 전치해 두고 행처럼 다루는 것이 읽기 쉽다고 알려 주세요. zip 자체는 7-6 교시.</p>' },
          { layout: 'two', title: '⚠ [[0] * 4] * 3 의 함정', left: { title: '올바른 방법', code: `good = [[0] * 4 for i in range(3)]
good[0][0] = 99
print(good)` }, right: { title: '망가지는 방법', code: `bad = [[0] * 4] * 3
bad[0][0] = 99
print(bad)` },
            notes: '<p><b>[4분]</b> 결과를 먼저 예측하게 합니다. 오른쪽은 세 행이 <b>같은 리스트</b>라서 99 가 세 번 나타납니다.</p><p>왜 <code>[0] * 4</code> 는 괜찮은가? 안에 든 것이 불변인 정수이기 때문입니다. 문제는 <b>가변 객체를 곱할 때</b>입니다. Code07-06 의 <code>list1 = []</code> vs <code>list1.clear()</code> 와 같은 원리 — 7-6 교시에서 마무리합니다.</p>' },
          { layout: 'diagram', title: '[프로그램 1] 거북이 정보 2차원 리스트', html: SVG_TURTLE_LIST, caption: '[거북이, X, Y, 크기, R, G, B] × 100',
            notes: '<p><b>[3분]</b> 거북이 한 마리 = 1차원 리스트(7개 정보), 100마리 = 2차원 리스트. 각 첨자가 무엇을 의미하는지 확인합니다.</p>' },
          { layout: 'code', title: 'Code07-07 (1) 거북이 100마리 정보 만들기', code: `import turtle
import random

myTurtle, tX, tY, tColor, tSize, tShape = [None] * 6
shapeList = []
playerTurtles = []    # 거북이 2차원 리스트
swidth, sheight = 500, 500

turtle.title('거북 리스트 활용')
turtle.setup(width = swidth + 50, height = sheight + 50)
turtle.screensize(swidth, sheight)

shapeList = turtle.getshapes()
for i in range(0, 100) :
    random.shuffle(shapeList)
    myTurtle = turtle.Turtle(shapeList[0])
    tX = random.randrange(-swidth // 2, swidth // 2)
    tY = random.randrange(-sheight // 2, sheight // 2)
    r = random.random(); g = random.random(); b = random.random()
    tSize = random.randrange(1, 3)
    playerTurtles.append([myTurtle, tX, tY, tSize, r, g, b])
print(len(playerTurtles), "마리 준비 완료")`, points: ['<code>[None] * 6</code> 로 6개 초기화', 'getshapes(): 모양 이름 리스트', 'shuffle 후 [0] → 무작위 모양', '한 마리 = 리스트 1행'],
            notes: '<p><b>[6분]</b> 슬라이드 공간 때문에 <code>if __name__ == "__main__":</code> 를 빼고 둘로 나누었습니다. 완성본은 학생 문서의 Code07-07 입니다.</p><p>이 부분만 실행하면 거북이들이 모두 중앙에 겹쳐 있습니다.</p>' },
          { layout: 'code', title: 'Code07-07 (2) 리스트에서 꺼내 이동', code: `import turtle
import random

playerTurtles = []
shapeList = turtle.getshapes()
for i in range(0, 100) :
    random.shuffle(shapeList)
    myTurtle = turtle.Turtle(shapeList[0])
    tX = random.randrange(-250, 250)
    tY = random.randrange(-250, 250)
    r = random.random(); g = random.random(); b = random.random()
    tSize = random.randrange(1, 3)
    playerTurtles.append([myTurtle, tX, tY, tSize, r, g, b])

for tList in playerTurtles :
    myTurtle = tList[0]
    myTurtle.color((tList[4], tList[5], tList[6]))
    myTurtle.pencolor((tList[4], tList[5], tList[6]))
    myTurtle.turtlesize(tList[3])
    myTurtle.goto(tList[1], tList[2])
turtle.done()`, points: ['<code>for tList in 2차원리스트</code> → 한 행씩', 'color((r, g, b)) 0~1 실수', 'goto → 중앙에서 밖으로 선'],
            notes: '<p><b>[5분]</b> 실행해서 결과를 봅니다. 질문: “tList[3] 은 무엇?” → 크기.</p><p>Tip: 18~19행을 <code>tmpShape = random.choice(shapeList)</code> 로 바꿀 수 있음(실습 7-11).</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>aa = [[1, 2, 3], [4, 5, 6]]</code> 일 때 <code>aa[1][0]</code> 은?', options: ['1', '2', '4', '5'], answer: 2, explain: 'aa[1] = [4, 5, 6] → [0] = 4',
            notes: '<p><b>[1분]</b> [행][열] 순서를 다시 확인합니다.</p>' },
          { layout: 'practice', title: 'SELF STUDY 7-3', desc: '4행 5열의 2차원 리스트에 0부터 3의 배수를 넣고 출력하세요.', starter: `list1 = []
list2 = []
value = 0
# TODO`, solution: `list1 = []
list2 = []
value = 0
for i in range(0, 4) :
    for k in range(0, 5) :
        list1.append(value)
        value += 3
    list2.append(list1)
    list1 = []
for i in range(0, 4) :
    for k in range(0, 5) :
        print("%3d" % list2[i][k], end = " ")
    print("")`,
            notes: '<p><b>[5분]</b> 고칠 곳: value 시작값, 증가값, 행 · 열 범위(두 군데씩). 실습 7-10(성적표) · 실습 7-12(행 · 열 다루기)는 과제로.</p>' },
          { layout: 'summary', title: '정리', bullets: ['2차원 리스트 = 리스트의 리스트, <code>aa[행][열]</code> · 행 수 <code>len(aa)</code>, 열 수 <code>len(aa[i])</code>', '중첩 for 문으로 만들고 출력 · 행마다 길이가 달라도 된다(불규칙)', '📘 행 합계는 <code>sum(aa[i])</code>, 열 합계는 k · i 반복 / <code>zip(*aa)</code> 전치', '⚠ <code>[[0] * 4] * 3</code> 금지 → <code>[[0] * 4 for i in range(3)]</code>', '[프로그램 1]: 거북이 정보 7개 × 100마리, <code>random.choice()</code>'],
            notes: '<p><b>[1분]</b> 다음 교시: 수정할 수 없는 리스트 — 튜플, 그리고 딕셔너리의 시작.</p>' }
        ]
      },
      /* ===================== ch07-4 ===================== */
      {
        id: 'ch07-4',
        title: '튜플과 딕셔너리의 생성',
        minutes: 50,
        goals: ['튜플을 만들고 리스트와의 차이(수정 불가)를 설명할 수 있다', '항목이 하나인 튜플을 올바르게 만들 수 있다', '튜플의 항목 · 범위 접근, 덧셈 · 곱셈, 리스트와의 변환을 할 수 있다', '언패킹으로 값을 교환하고 *rest 로 나머지를 받을 수 있다', '튜플을 쓰는 이유(안전 · 키 · 여러 값 반환)를 설명할 수 있다', '딕셔너리를 키 : 값 쌍으로 만들고 항목을 추가 · 수정 · 삭제할 수 있다'],
        flow: [['튜플의 생성', 8], ['튜플의 오류 · 사용 · 변환', 11], ['📘 언패킹 · 튜플을 쓰는 이유', 9], ['딕셔너리의 개념 · 생성', 9], ['추가 · 수정 · 삭제 · 튜플 키', 9], ['정리 · 퀴즈', 4]],
        content: [
          { type: 'h', text: '튜플의 생성' },
          { type: 'p', html: '<b>튜플(tuple)</b>은 리스트와 비슷하게 여러 값을 순서대로 묶지만, 한 번 만들면 <b>값을 바꾸거나 추가 · 삭제할 수 없는</b>(읽기 전용) 자료형입니다. 리스트는 대괄호 <code>[ ]</code>, 튜플은 <b>소괄호 <code>( )</code></b> 로 만듭니다. 요일 이름, 좌표, 설정값처럼 <b>바뀌면 안 되는 자료</b>를 저장할 때 씁니다.' },
          { type: 'code', repl: true, title: '튜플 만들기', code: `tt1 = (10, 20, 30); tt1
tt2 = 10, 20, 30; tt2
type(tt1)`, expect: `>>> tt1 = (10, 20, 30); tt1
(10, 20, 30)
>>> tt2 = 10, 20, 30; tt2
(10, 20, 30)
>>> type(tt1)
<class 'tuple'>
>>>`, desc: '소괄호를 생략하고 쉼표로만 나열해도 튜플이 됩니다. 사실 튜플을 만드는 것은 괄호가 아니라 <b>쉼표</b>입니다.' },
          { type: 'p', html: '그래서 <b>항목이 하나인 튜플</b>을 만들 때는 주의해야 합니다. <code>(10)</code> 은 그냥 괄호로 감싼 숫자 10 입니다. 튜플로 만들려면 뒤에 <b>쉼표</b>를 붙여야 합니다.' },
          { type: 'code', repl: true, title: '항목이 하나인 튜플', code: `tt3 = (10); tt3
tt4 = 10; tt4
tt5 = (10,); tt5
tt6 = 10,; tt6
type(tt3), type(tt5)`, expect: `>>> tt3 = (10); tt3
10
>>> tt4 = 10; tt4
10
>>> tt5 = (10,); tt5
(10,)
>>> tt6 = 10,; tt6
(10,)
>>> type(tt3), type(tt5)
(<class 'int'>, <class 'tuple'>)
>>>` },
          { type: 'callout', kind: 'more', title: '📘 이미 튜플을 쓰고 있었다!', html: '<code>a, b = 10, 20</code> 처럼 여러 변수에 한 번에 대입하는 것도 튜플 덕분입니다. 오른쪽 <code>10, 20</code> 이 튜플로 만들어진 뒤 왼쪽 변수들에 하나씩 풀려 들어갑니다(언패킹, unpacking). 그래서 <code>a, b = b, a</code> 로 두 변수의 값을 간단히 바꿀 수 있습니다. 또 <code>print("%d %d" % (a, b))</code> 의 <code>(a, b)</code> 도 튜플입니다.' },
          { type: 'h', text: '튜플의 오류와 삭제' },
          { type: 'p', html: '튜플은 읽기 전용이므로 항목을 추가(<code>append</code>)하거나, 값을 바꾸거나, 항목을 지우려 하면 오류가 발생합니다.' },
          { type: 'code', repl: true, title: '튜플을 수정하려고 하면?', code: `tt1 = (10, 20, 30)
tt1.append(40)
tt1[0] = 40
del(tt1[0])`, expect: `>>> tt1 = (10, 20, 30)
>>> tt1.append(40)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
AttributeError: 'tuple' object has no attribute 'append'
>>> tt1[0] = 40
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: 'tuple' object does not support item assignment
>>> del(tt1[0])
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: 'tuple' object doesn't support item deletion
>>>`, desc: '<code>AttributeError</code>: 튜플에는 append 기능이 없음. <code>TypeError … item assignment</code>: 항목 대입을 지원하지 않음. <code>… item deletion</code>: 항목 삭제를 지원하지 않음.' },
          { type: 'p', html: '항목은 지울 수 없지만 <b>튜플 자체</b>는 <code>del()</code> 로 삭제할 수 있습니다.' },
          { type: 'code', repl: true, title: '튜플 자체의 삭제', code: `tt1 = (10, 20, 30)
tt2 = 10, 20, 30
del(tt1)
del(tt2)
tt1`, expect: `>>> tt1 = (10, 20, 30)
>>> tt2 = 10, 20, 30
>>> del(tt1)
>>> del(tt2)
>>> tt1
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
NameError: name 'tt1' is not defined
>>>` },
          { type: 'h', text: '튜플의 사용' },
          { type: 'p', html: '값을 <b>읽는</b> 방법은 리스트와 똑같습니다. 첨자, 음수 첨자, 슬라이싱, <code>len()</code>, <code>in</code>, <code>index()</code>, <code>count()</code> 모두 사용할 수 있습니다.' },
          { type: 'code', repl: true, title: '튜플 항목 · 범위에 접근', code: `tt1 = (10, 20, 30, 40)
tt1[0]
tt1[0] + tt1[1] + tt1[2]
tt1[1:3]
tt1[1:]
tt1[:3]`, expect: `>>> tt1 = (10, 20, 30, 40)
>>> tt1[0]
10
>>> tt1[0] + tt1[1] + tt1[2]
60
>>> tt1[1:3]
(20, 30)
>>> tt1[1:]
(20, 30, 40)
>>> tt1[:3]
(10, 20, 30)
>>>`, desc: '튜플을 슬라이싱한 결과도 튜플입니다.' },
          { type: 'p', html: '덧셈 · 곱셈도 리스트처럼 <b>새 튜플</b>을 만듭니다. 원래 튜플이 바뀌는 것이 아니므로 허용됩니다.' },
          { type: 'code', repl: true, title: '튜플의 덧셈 및 곱셈', code: `tt1 = (10, 20, 30, 40)
tt2 = ('A', 'B')
tt1 + tt2
tt2 * 3`, expect: `>>> tt1 = (10, 20, 30, 40)
>>> tt2 = ('A', 'B')
>>> tt1 + tt2
(10, 20, 30, 40, 'A', 'B')
>>> tt2 * 3
('A', 'B', 'A', 'B', 'A', 'B')
>>>` },
          { type: 'h', text: '튜플 ↔ 리스트 변환' },
          { type: 'p', html: '튜플의 내용을 꼭 바꿔야 한다면 <code>list()</code> 로 리스트로 바꿔 수정한 뒤, <code>tuple()</code> 로 다시 튜플로 만듭니다.' },
          { type: 'code', repl: true, title: '튜플 → 리스트 → 튜플 변환', code: `myTuple = (10, 20, 30)
myList = list(myTuple)
myList.append(40)
myTuple = tuple(myList)
myTuple`, expect: `>>> myTuple = (10, 20, 30)
>>> myList = list(myTuple)
>>> myList.append(40)
>>> myTuple = tuple(myList)
>>> myTuple
(10, 20, 30, 40)
>>>` },
          { type: 'table', head: ['비교', '리스트 list', '튜플 tuple'], rows: [
            ['만드는 기호', '<code>[10, 20]</code>', '<code>(10, 20)</code> 또는 <code>10, 20</code>'],
            ['항목 하나', '<code>[10]</code>', '<code>(10,)</code> — 쉼표 필수'],
            ['값 읽기 · 슬라이싱 · + · *', '가능', '가능'],
            ['값 변경 · 추가 · 삭제', '가능', '<b>불가능</b> (오류)'],
            ['주 용도', '바뀌는 데이터 모음', '바뀌면 안 되는 데이터, 여러 값 한 번에 반환'],
            ['변환', '<code>list(튜플)</code>', '<code>tuple(리스트)</code>']
          ], caption: '리스트와 튜플 비교' },
          { type: 'h', text: '언패킹(unpacking) — 묶음을 풀어서 변수에 담기' },
          { type: 'p', html: '<code>a, b = 10, 20</code> 처럼 <b>왼쪽에 변수를 여러 개</b> 쓰면, 오른쪽의 묶음(튜플 · 리스트)이 <b>순서대로 풀려서</b> 변수에 하나씩 들어갑니다. 이것을 <b>언패킹</b>이라고 합니다. 파이썬을 파이썬답게 만드는 문법 중 하나로, 임시 변수 없이 값을 교환하거나 함수가 돌려준 여러 값을 한 번에 받을 때 씁니다.' },
          { type: 'code', title: '추가 예제. 언패킹 · 값 교환 · * 로 나머지 받기', code: `a, b = 10, 20
print(a, b)

a, b = b, a                    # 임시 변수 없이 값 교환
print(a, b)

point = (3, 7)
x, y = point                   # 튜플을 풀어서 x, y 에
print("x =", x, ", y =", y)

first, *rest = [10, 20, 30, 40]    # * 는 "나머지 전부" (리스트로 받는다)
print(first, rest)

*front, last = [10, 20, 30, 40]
print(front, last)

q, r = divmod(17, 5)           # 몫과 나머지를 튜플로 돌려주는 내장 함수
print("17 ÷ 5 → 몫 %d, 나머지 %d" % (q, r))`, expect: `10 20
20 10
x = 3 , y = 7
10 [20, 30, 40]
[10, 20, 30] 40
17 ÷ 5 → 몫 3, 나머지 2`, desc: '<code>a, b = b, a</code> 가 동작하는 이유는 오른쪽 <code>b, a</code> 가 <b>먼저 튜플로 만들어진 뒤</b> 왼쪽에 풀리기 때문입니다. 그래서 C 언어처럼 <code>tmp</code> 변수를 쓸 필요가 없습니다. <code>*rest</code> 는 개수가 정해지지 않은 나머지를 <b>리스트</b>로 받습니다.' },
          { type: 'callout', kind: 'warn', title: '언패킹은 개수가 맞아야 한다', html: '<code>x, y = (1, 2, 3)</code> 처럼 개수가 다르면 <code>ValueError: too many values to unpack (expected 2)</code>, 모자라면 <code>not enough values to unpack</code> 오류가 납니다. 개수를 모를 때는 <code>x, *rest = 묶음</code> 처럼 <code>*</code> 를 쓰세요.<br>반대로 <code>x = 1, 2</code> 처럼 왼쪽이 하나면 <b>튜플 그대로</b> 들어갑니다 — 쉼표를 실수로 남겨 두면 숫자가 아니라 튜플이 되어 버리는 흔한 버그입니다.' },
          { type: 'h', text: '튜플을 쓰는 세 가지 이유' },
          { type: 'p', html: '“바꿀 수 없어서 불편한 리스트”처럼 보이지만, 튜플은 <b>바꿀 수 없다는 점 자체가 장점</b>이 되는 곳에 씁니다.' },
          { type: 'table', head: ['이유', '설명', '예'], rows: [
            ['① 실수로 바뀌는 것을 막는다', '고정된 설정값 · 요일 이름처럼 바뀌면 안 되는 자료를 튜플로 두면, 실수로 수정하는 코드에서 <b>바로 오류</b>가 나서 버그를 빨리 찾습니다.', '<code>WEEK = (\'월\', \'화\', \'수\', \'목\', \'금\')</code>'],
            ['② 딕셔너리의 키 · 세트의 항목이 될 수 있다', '키는 <b>불변</b>이어야 하므로 리스트는 쓸 수 없습니다. 좌표 · 날짜 · 조합처럼 <b>여러 값이 하나의 이름표</b>가 되어야 할 때 튜플을 씁니다.', '<code>board[(2, 3)] = \'O\'</code>'],
            ['③ 여러 값을 한 번에 돌려준다', '함수가 결과를 여러 개 돌려줄 때 튜플로 묶어 반환하고, 받는 쪽에서 언패킹합니다.', '<code>q, r = divmod(17, 5)</code>']
          ], caption: '튜플이 필요한 상황' },
          { type: 'h', text: '딕셔너리의 개념' },
          { type: 'p', html: '<b>딕셔너리(dictionary)</b>는 <b>두 값이 한 쌍</b>으로 묶인 자료구조입니다. 영어사전에서 “apple” 을 찾으면 “사과” 가 나오듯, 앞의 값(<b>키, key</b>)으로 뒤의 값(<b>값, value</b>)을 찾습니다. 중괄호 <code>{ }</code> 로 감싸고 <code>키 : 값</code> 쌍을 쉼표로 구분합니다. 리스트는 0, 1, 2 … 번호로 값을 찾지만 딕셔너리는 <b>이름표(키)</b>로 찾습니다.' },
          { type: 'code', run: false, title: '딕셔너리 생성 형식', code: `딕셔너리변수 = {키1:값1, 키2:값2, 키3:값3, …}` },
          { type: 'callout', kind: 'tip', title: 'Tip · 다른 언어에서는', html: '다른 프로그래밍 언어에서는 딕셔너리와 같은 자료구조를 <b>해시(Hash)</b>, <b>연관 배열(Associative Array)</b>, 맵(Map)이라고 부릅니다.' },
          { type: 'figure', html: SVG_DICT, caption: '딕셔너리 = 키와 값의 쌍 · 키로 값을 찾는다' },
          { type: 'h', text: '딕셔너리의 생성' },
          { type: 'code', repl: true, title: '딕셔너리 만들기', code: `dic1 = {1 : 'a', 2 : 'b', 3 : 'c'}
dic1
dic2 = {'a': 1, 'b': 2, 'c': 3}
dic2`, expect: `>>> dic1 = {1 : 'a', 2 : 'b', 3 : 'c'}
>>> dic1
{1: 'a', 2: 'b', 3: 'c'}
>>> dic2 = {'a': 1, 'b': 2, 'c': 3}
>>> dic2
{'a': 1, 'b': 2, 'c': 3}
>>>`, desc: '<code>dic2</code> 는 <code>dic1</code> 의 키와 값을 반대로 만든 것입니다. 무엇을 키로, 무엇을 값으로 할지는 프로그래머가 정하는 것이지 규칙이 있는 것은 아닙니다.' },
          { type: 'callout', kind: 'info', title: '딕셔너리의 순서에 대해', html: '강의자료(파이썬 3.6 이전 기준)에서는 “딕셔너리에는 순서가 없어 생성한 순서대로 구성된다는 보장이 없다”고 설명합니다. <b>파이썬 3.7부터는 넣은 순서가 유지되도록</b> 언어 규칙이 바뀌었습니다. 그래도 딕셔너리는 <b>번호(첨자)로 접근하지 않고 키로만 접근</b>한다는 점은 같습니다. <code>dic1[0]</code> 은 “0번째 항목”이 아니라 “키가 0 인 항목”을 뜻합니다.' },
          { type: 'h', text: '여러 정보를 딕셔너리로 표현하기' },
          { type: 'table', head: ['키', '값'], rows: [['학번', '1000'], ['이름', '홍길동'], ['학과', '컴퓨터학과']], caption: '표 7-2 홍길동 학생의 정보' },
          { type: 'p', html: '한 학생의 여러 정보를 딕셔너리 하나로 표현할 수 있습니다. <code>딕셔너리[키] = 값</code> 으로 대입하면, 없는 키이면 <b>추가</b>되고 이미 있는 키이면 값이 <b>수정</b>됩니다. 삭제는 <code>del(딕셔너리[키])</code> 입니다.' },
          { type: 'code', repl: true, title: '딕셔너리 항목 추가 · 수정 · 삭제', code: `student1 = {'학번' : 1000, '이름': '홍길동', '학과': '컴퓨터학과'}
student1
student1['연락처'] = '010-1111-2222'
student1
student1['학과'] = '파이썬학과'
student1
del(student1['학과'])
student1`, expect: `>>> student1 = {'학번' : 1000, '이름': '홍길동', '학과': '컴퓨터학과'}
>>> student1
{'학번': 1000, '이름': '홍길동', '학과': '컴퓨터학과'}
>>> student1['연락처'] = '010-1111-2222'
>>> student1
{'학번': 1000, '이름': '홍길동', '학과': '컴퓨터학과', '연락처': '010-1111-2222'}
>>> student1['학과'] = '파이썬학과'
>>> student1
{'학번': 1000, '이름': '홍길동', '학과': '파이썬학과', '연락처': '010-1111-2222'}
>>> del(student1['학과'])
>>> student1
{'학번': 1000, '이름': '홍길동', '연락처': '010-1111-2222'}
>>>` },
          { type: 'p', html: '딕셔너리의 <b>키는 중복될 수 없습니다</b>. 같은 키를 두 번 쓰면 오류가 나는 대신 <b>마지막에 쓴 값</b>만 남습니다.' },
          { type: 'code', repl: true, title: '같은 키가 두 번 나오면?', code: `student1 = {'학번': 1000, '이름': '홍길동', '학과': '파이썬학과', '학번': 2000}
student1`, expect: `>>> student1 = {'학번': 1000, '이름': '홍길동', '학과': '파이썬학과', '학번': 2000}
>>> student1
{'학번': 2000, '이름': '홍길동', '학과': '파이썬학과'}
>>>` },
          { type: 'callout', kind: 'more', title: '📘 키로 쓸 수 있는 값', html: '키로는 숫자 · 문자열 · 튜플처럼 <b>바뀌지 않는(immutable) 값</b>만 쓸 수 있습니다. 리스트를 키로 쓰면 <code>TypeError: cannot use \'list\' as a dict key (unhashable type: \'list\')</code> 오류가 납니다. 값(value)에는 리스트 · 딕셔너리 등 무엇이든 넣을 수 있습니다. 예: <code>{\'이름\': \'홍길동\', \'취미\': [\'독서\', \'축구\']}</code>' },
          { type: 'code', repl: true, title: '추가 예제. 튜플을 키로 — 좌표에 값 붙이기', code: `board = {}
board[(0, 0)] = 'O'
board[(1, 1)] = 'X'
board[(2, 0)] = 'O'
board
board[(1, 1)]
board[[1, 2]] = '리스트는 키가 될 수 없다'`, expect: `>>> board = {}
>>> board[(0, 0)] = 'O'
>>> board[(1, 1)] = 'X'
>>> board[(2, 0)] = 'O'
>>> board
{(0, 0): 'O', (1, 1): 'X', (2, 0): 'O'}
>>> board[(1, 1)]
'X'
>>> board[[1, 2]] = '리스트는 키가 될 수 없다'
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: cannot use 'list' as a dict key (unhashable type: 'list')
>>>`, desc: '2차원 판을 2차원 리스트 대신 <b>좌표 튜플을 키로 하는 딕셔너리</b>로 표현하면, 값이 있는 칸만 저장하면 되고 <code>(-3, 5)</code> 처럼 음수 좌표도 자연스럽게 쓸 수 있습니다. <code>unhashable</code> 은 “키로 쓸 수 없는(내용이 바뀔 수 있는) 자료형”이라는 뜻입니다.' },
          { type: 'code', title: '추가 예제. 여러 정보를 담는 방법 고르기', code: `# ① 리스트: 같은 종류가 여러 개, 순서가 중요할 때
scores = [80, 95, 72]

# ② 튜플: 개수와 의미가 고정된 한 덩어리
point = (3, 7)
today = (2026, 9, 23)

# ③ 딕셔너리: 이름표(키)로 찾을 때
student = {'이름': '홍길동', '학과': '파이썬학과', '점수': scores}

year, month, day = today
print("%d년 %d월 %d일" % (year, month, day))
print(student['이름'], "→", student['점수'], "평균 %.1f" % (sum(student['점수']) / 3))
print("좌표의 x :", point[0])`, expect: `2026년 9월 23일
홍길동 → [80, 95, 72] 평균 82.3
좌표의 x : 3`, desc: '같은 데이터라도 <b>무엇을 자주 하게 될지</b>에 따라 자료형을 고릅니다. “개수가 늘었다 줄었다 하나?” → 리스트, “의미가 고정된 한 덩어리인가?” → 튜플, “이름으로 찾아야 하나?” → 딕셔너리.' }
        ],
        practice: [
          {
            title: 'SELF STUDY 7-4. 2차원 튜플 출력하기',
            level: 1,
            desc: '<p>다음과 같이 2차원 튜플을 만든 후 모든 값을 출력하세요.</p><pre>tt = ((1, 2, 3),\n      (4, 5, 6),\n      (7, 8, 9))</pre><pre>  1  2  3\n  4  5  6\n  7  8  9</pre>',
            hint: 'Code07-06 의 출력 부분처럼 중첩 for 문과 <code>tt[i][k]</code>, <code>"%3d" % 값</code>, <code>end = ""</code> 를 사용합니다.',
            starter: `tt = ((1, 2, 3),
      (4, 5, 6),
      (7, 8, 9))

# TODO: 중첩 for 문으로 모든 값 출력
`,
            solution: `tt = ((1, 2, 3),
      (4, 5, 6),
      (7, 8, 9))

for i in range(0, 3) :
    for k in range(0, 3) :
        print("%3d" % tt[i][k], end = "")
    print("")
`,
            expect: `  1  2  3
  4  5  6
  7  8  9`
          },
          {
            title: '실습 7-14. 내 정보 딕셔너리',
            level: 1,
            desc: '<p>빈 딕셔너리 <code>me = {}</code> 를 만들고 이름 · 나이 · 도시를 키로 추가한 뒤 출력하세요. 이어서 나이를 1 늘리고, <code>\'취미\'</code> 키에 리스트 <code>[\'게임\', \'코딩\']</code> 을 넣고, 도시를 삭제한 뒤 다시 출력하세요.</p><pre>{\'이름\': \'김파이\', \'나이\': 17, \'도시\': \'서울\'}\n{\'이름\': \'김파이\', \'나이\': 18, \'취미\': [\'게임\', \'코딩\']}</pre>',
            hint: '<code>me[\'나이\'] = me[\'나이\'] + 1</code> 또는 <code>me[\'나이\'] += 1</code>. 삭제는 <code>del(me[\'도시\'])</code>.',
            starter: `me = {}
# TODO: 이름, 나이, 도시 추가 후 출력

# TODO: 나이 +1, 취미 추가, 도시 삭제 후 출력
`,
            solution: `me = {}
me['이름'] = '김파이'
me['나이'] = 17
me['도시'] = '서울'
print(me)

me['나이'] += 1
me['취미'] = ['게임', '코딩']
del(me['도시'])
print(me)
`,
            expect: `{'이름': '김파이', '나이': 17, '도시': '서울'}
{'이름': '김파이', '나이': 18, '취미': ['게임', '코딩']}`
          },
          {
            title: '실습 7-15. 좌표 튜플과 언패킹',
            level: 2,
            desc: '<p>점의 좌표가 튜플 리스트로 주어집니다.</p><ol><li><code>for x, y in points :</code> 로 <b>언패킹</b>하면서 각 점의 원점까지 거리를 <code>(x, y) → 거리 d</code> 형식(소수 두 자리)으로 출력하세요. 거리는 <code>(x * x + y * y) ** 0.5</code> 입니다.</li><li>좌표 튜플을 <b>키</b>로, 거리를 값으로 하는 딕셔너리를 만드세요.</li><li>가장 먼 점을 <code>max(points, key = …)</code> 로 찾아 출력하세요.</li><li><code>zip(*points)</code> 로 x 들과 y 들을 각각 묶어 출력하세요.</li></ol><pre>(3, 4) → 거리 5.00\n…\n가장 먼 점 : (6, -8)\nx 들 : (3, -2, 0, 6)</pre>',
            hint: '<code>**</code> 는 거듭제곱이므로 <code>** 0.5</code> 는 제곱근입니다. 딕셔너리 키로 쓸 때는 <code>dist[(x, y)] = d</code>. <code>zip(*points)</code> 의 <code>*</code> 는 “리스트를 풀어서 인자로 넘기기”라는 뜻입니다.',
            starter: `points = [(3, 4), (-2, 5), (0, 0), (6, -8)]
dist = {}

# TODO: 언패킹하며 거리 출력 + dist 에 저장

# TODO: 가장 먼 점

# TODO: zip(*points) 로 x 들 · y 들
`,
            solution: `points = [(3, 4), (-2, 5), (0, 0), (6, -8)]
dist = {}

for x, y in points :
    d = (x * x + y * y) ** 0.5
    dist[(x, y)] = d
    print("(%d, %d) → 거리 %.2f" % (x, y, d))

far = max(points, key = lambda p : dist[p])
print("가장 먼 점 :", far)

xs, ys = zip(*points)
print("x 들 :", xs)
print("y 들 :", ys)
print("저장된 좌표 수 :", len(dist))
`,
            expect: `(3, 4) → 거리 5.00
(-2, 5) → 거리 5.39
(0, 0) → 거리 0.00
(6, -8) → 거리 10.00
가장 먼 점 : (6, -8)
x 들 : (3, -2, 0, 6)
y 들 : (4, 5, 0, -8)
저장된 좌표 수 : 4`
          },
          {
            title: '실습 7-16. 시간표 튜플 분석하기',
            level: 2,
            desc: '<p>요일과 과목이 <b>중첩 튜플</b>로 주어집니다(바뀌면 안 되는 자료라서 튜플로 만들었습니다).</p><ol><li>언패킹으로 <code>월요일 : 국어 수학 영어</code> 처럼 요일별 시간표를 출력하세요.</li><li><code>\'수학\'</code> 수업이 있는 요일을 리스트로 모아 출력하세요.</li><li>전체 수업 수와 <b>중복을 뺀</b> 과목 종류 수, 그리고 정렬한 과목 목록을 출력하세요.</li></ol><pre>월요일 : 국어 수학 영어\n…\n수학 수업이 있는 요일 : [\'월\', \'화\', \'수\']\n전체 수업 수 : 9, 과목 종류 : 5가지\n과목 목록 : [\'과학\', \'국어\', \'수학\', \'영어\', \'체육\']</pre>',
            hint: '<code>for day, subjects in timetable :</code> 로 한 쌍씩 풀어 받습니다. 중복을 빼려면 새 리스트에 <code>if s not in kinds :</code> 일 때만 <code>append</code> 하세요. (7-6 교시의 <code>set()</code> 을 쓰면 더 간단합니다)',
            starter: `timetable = (('월', ('국어', '수학', '영어')),
             ('화', ('수학', '과학', '국어')),
             ('수', ('영어', '체육', '수학')))

# TODO: 요일별 시간표 출력

# TODO: '수학' 수업이 있는 요일

# TODO: 전체 수업 수 · 과목 종류 · 정렬한 목록
`,
            solution: `timetable = (('월', ('국어', '수학', '영어')),
             ('화', ('수학', '과학', '국어')),
             ('수', ('영어', '체육', '수학')))

for day, subjects in timetable :
    line = day + "요일 :"
    for s in subjects :
        line = line + " " + s
    print(line)

target = '수학'
days = []
for day, subjects in timetable :
    if target in subjects :
        days.append(day)
print("%s 수업이 있는 요일 : %s" % (target, days))

total = 0
kinds = []
for day, subjects in timetable :
    total += len(subjects)
    for s in subjects :
        if s not in kinds :
            kinds.append(s)

print("전체 수업 수 : %d, 과목 종류 : %d가지" % (total, len(kinds)))
print("과목 목록 :", sorted(kinds))
`,
            expect: `월요일 : 국어 수학 영어
화요일 : 수학 과학 국어
수요일 : 영어 체육 수학
수학 수업이 있는 요일 : ['월', '화', '수']
전체 수업 수 : 9, 과목 종류 : 5가지
과목 목록 : ['과학', '국어', '수학', '영어', '체육']`
          },
          {
            title: '실습 7-17. 좌표 이동 기록기',
            level: 3,
            desc: '<p>로봇이 격자 위를 움직입니다. 명령 리스트를 처리하며 이동 기록을 남기세요.</p><p><b>요구 사항</b></p><ul><li>시작 위치는 <code>(0, 0)</code>. 명령은 <code>상</code>(y + 1) · <code>하</code>(y − 1) · <code>좌</code>(x − 1) · <code>우</code>(x + 1) 입니다.</li><li>그 밖의 명령은 <code>무시 : 점프</code> 처럼 알리고 <b>건너뜁니다</b>(<code>continue</code>).</li><li>이동할 때마다 현재 위치를 <b>튜플</b>로 <code>log</code> 리스트에 추가합니다(시작 위치도 포함).</li><li><b>출력</b> — 이동 경로 전체, 최종 위치, 실제 이동 횟수, 그리고 <b>두 번 이상 지난 칸</b>의 목록</li><li>지난 횟수는 <b>좌표 튜플을 키로</b> 하는 딕셔너리로 셉니다.</li></ul><pre>무시 : 점프\n이동 경로 : [(0, 0), (0, 1), …]\n최종 위치 : (0, 0)\n이동 횟수 : 8\n두 번 이상 지난 칸 : [(0, 0)]</pre><p>👉 <b>더 해 보기</b>: 명령을 <code>input()</code> 으로 받아 실시간으로 움직이기, 격자 밖으로 나가지 못하게 막기(−2 ~ 2), 지나온 칸을 <code>*</code> 로 표시한 지도 그리기.</p>',
            hint: '리스트는 딕셔너리의 키가 될 수 없지만 <b>튜플은 가능</b>합니다: <code>count[(x, y)]</code>. 키가 이미 있는지는 <code>if p in count :</code> 로 확인합니다(다음 교시에 <code>get()</code> 으로 더 짧게 쓰는 법을 배웁니다).',
            starter: `moves = ['상', '우', '우', '하', '하', '좌', '상', '점프', '좌']

x, y = 0, 0
log = [(x, y)]
steps = 0

for m in moves :
    # TODO: 상 · 하 · 좌 · 우 처리, 나머지는 무시하고 continue
    pass

# TODO: 경로 · 최종 위치 · 이동 횟수 출력

# TODO: 좌표 튜플을 키로 지난 횟수 세기 → 두 번 이상 지난 칸
`,
            solution: `moves = ['상', '우', '우', '하', '하', '좌', '상', '점프', '좌']

x, y = 0, 0
log = [(x, y)]
steps = 0

for m in moves :
    if m == '상' :
        y += 1
    elif m == '하' :
        y -= 1
    elif m == '좌' :
        x -= 1
    elif m == '우' :
        x += 1
    else :
        print("무시 :", m)
        continue
    steps += 1
    log.append((x, y))

print("이동 경로 :", log)
print("최종 위치 :", (x, y))
print("이동 횟수 :", steps)

count = {}
for p in log :
    if p in count :
        count[p] = count[p] + 1
    else :
        count[p] = 1

repeat = []
for p in log :
    if count[p] >= 2 and p not in repeat :
        repeat.append(p)
print("두 번 이상 지난 칸 :", repeat)
`,
            expect: `무시 : 점프
이동 경로 : [(0, 0), (0, 1), (1, 1), (2, 1), (2, 0), (2, -1), (1, -1), (1, 0), (0, 0)]
최종 위치 : (0, 0)
이동 횟수 : 8
두 번 이상 지난 칸 : [(0, 0)]`
          }
        ],
        quiz: [
          { q: '다음 중 <b>튜플</b>이 <b>아닌</b> 것은?', options: ['<code>(10, 20)</code>', '<code>10, 20</code>', '<code>(10,)</code>', '<code>(10)</code>'], answer: 3, explain: '<code>(10)</code> 은 괄호로 감싼 정수 10 입니다. 항목 하나인 튜플은 <code>(10,)</code>.' },
          { q: '<code>tt = (1, 2, 3)</code> 일 때 오류가 발생하는 코드는?', options: ['<code>tt[0]</code>', '<code>tt + (4,)</code>', '<code>tt[1] = 5</code>', '<code>tt[1:]</code>'], answer: 2, explain: '튜플은 항목 값을 바꿀 수 없습니다(TypeError). 덧셈은 새 튜플을 만드는 것이므로 가능합니다.' },
          { q: '튜플 <code>t</code> 에 값을 추가하고 싶을 때 올바른 방법은?', options: ['<code>t.append(값)</code>', '<code>list(t)</code> 로 바꿔 append 한 뒤 <code>tuple()</code> 로 다시 변환', '<code>t[len(t)] = 값</code>', '튜플은 어떤 방법으로도 불가능'], answer: 1, explain: '리스트로 변환 → 수정 → 튜플로 변환. (또는 <code>t = t + (값,)</code> 로 새 튜플을 만들 수도 있습니다)' },
          { q: '다음 코드의 실행 결과는?<pre><code>d = {\'a\': 1, \'b\': 2}\nd[\'c\'] = 3\nd[\'a\'] = 10\nprint(d)</code></pre>', options: ["<code>{'a': 1, 'b': 2, 'c': 3}</code>", "<code>{'a': 10, 'b': 2, 'c': 3}</code>", "<code>{'a': 1, 'b': 2, 'c': 3, 'a': 10}</code>", '오류'], answer: 1, explain: '없는 키 c 는 추가, 있는 키 a 는 값 수정. 키는 중복되지 않습니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>a, b = 1, 2\na, b = b, a + b\nprint(a, b)</code></pre>', options: ['<code>2 3</code>', '<code>2 4</code>', '<code>1 3</code>', '오류'], answer: 0, explain: '오른쪽 <code>b, a + b</code> 가 <b>먼저</b> 튜플 <code>(2, 3)</code> 으로 계산된 뒤 왼쪽에 풀립니다. 그래서 <code>a</code> 가 바뀐 값이 아니라 <b>원래 값</b>으로 계산됩니다. (피보나치 수열을 한 줄로 쓰는 관용구)' },
          { q: '딕셔너리의 <b>키</b>로 쓸 수 <b>없는</b> 것은?', options: ['<code>\'이름\'</code> (문자열)', '<code>1000</code> (정수)', '<code>(2, 3)</code> (튜플)', '<code>[2, 3]</code> (리스트)'], answer: 3, explain: '키는 내용이 바뀌지 않는(불변) 값이어야 합니다. 리스트를 키로 쓰면 <code>TypeError … unhashable type: \'list\'</code> 오류가 납니다. 좌표처럼 여러 값을 키로 쓰고 싶을 때 <b>튜플</b>을 사용합니다.' }
        ],
        slides: [
          { layout: 'title', title: '튜플과 딕셔너리의 생성', subtitle: 'Section 04 튜플 · Section 05 딕셔너리 (1)', badge: '07-4',
            notes: '<p><b>[도입 1분]</b> “리스트는 자유롭게 바꿀 수 있어 편리하지만, 절대 바뀌면 안 되는 데이터라면?” (예: 요일 이름, 주민번호 앞자리) → 튜플.</p>' },
          { layout: 'code', repl: true, title: '튜플의 생성', code: `tt1 = (10, 20, 30); tt1
tt2 = 10, 20, 30; tt2
tt3 = (10); tt3
tt4 = 10; tt4
tt5 = (10,); tt5
tt6 = 10,; tt6`, points: ['소괄호 <code>( )</code>, 생략 가능', '읽기 전용 자료', '항목 하나는 <b>쉼표</b> 필수 <code>(10,)</code>'],
            notes: '<p><b>[4분]</b> tt3 이 튜플이 아닌 이유를 질문. 튜플을 만드는 것은 괄호가 아니라 쉼표! <code>type(tt3)</code> 을 추가로 실행해 보여 주세요.</p>' },
          { layout: 'code', repl: true, title: '튜플의 오류와 삭제', code: `tt1 = (10, 20, 30)
tt1.append(40)
tt1[0] = 40
del(tt1[0])
del(tt1)`, points: ['추가 · 변경 · 항목 삭제 모두 오류', '튜플 자체는 del 가능'],
            notes: '<p><b>[3분]</b> 오류 이름을 함께 읽습니다: AttributeError(그런 기능 없음), TypeError(지원 안 함). 튜플 자체 삭제는 가능.</p>' },
          { layout: 'code', repl: true, title: '튜플의 사용', code: `tt1 = (10, 20, 30, 40)
tt1[0]
tt1[0] + tt1[1] + tt1[2]
tt1[1:3]
tt1[1:]
tt1[:3]
tt2 = ('A', 'B')
tt1 + tt2
tt2 * 3`, points: ['읽기는 리스트와 동일', '슬라이싱 결과도 튜플', '+, * 는 새 튜플 생성'],
            notes: '<p><b>[3분]</b> 질문: “tt1 + tt2 는 튜플을 수정한 것일까?” → 아니요, 새 튜플을 만든 것.</p>' },
          { layout: 'two', title: '튜플 ↔ 리스트 변환', left: { title: '튜플 → 리스트 → 튜플', code: `myTuple = (10, 20, 30)
myList = list(myTuple)
myList.append(40)
myTuple = tuple(myList)
print(myTuple)` }, right: { title: '📘 튜플 언패킹', code: `a, b = 10, 20
a, b = b, a
print(a, b)
point = (3, 7)
x, y = point
print(x, y)` },
            notes: '<p><b>[3분]</b> 왼쪽이 강의자료 예제. 오른쪽은 보충: 이미 써 온 <code>a, b = 10, 20</code> 이 튜플이었다는 사실. 값 교환 관용구.</p>' },
          { layout: 'code', title: '📘 언패킹 — 묶음을 풀어서 담기', code: `a, b = 10, 20
a, b = b, a                 # 임시 변수 없이 교환
print(a, b)

x, y = (3, 7)
print(x, y)

first, *rest = [10, 20, 30, 40]
print(first, rest)

q, r = divmod(17, 5)        # 여러 값을 튜플로 반환
print(q, r)`, points: ['왼쪽 변수 개수만큼 <b>풀려서</b> 들어간다', '<code>a, b = b, a</code> — 오른쪽이 먼저 튜플이 됨', '<code>*rest</code> — 나머지 전부를 리스트로', '개수가 안 맞으면 <code>ValueError</code>'],
            notes: '<p><b>[5분]</b> <code>a, b = b, a</code> 를 C/자바의 tmp 방식과 비교해 보여 주면 파이썬다움이 잘 드러납니다.</p><p>“왜 동작하나?” → 오른쪽이 <b>먼저</b> 튜플로 만들어진 뒤 왼쪽에 풀리기 때문. 퀴즈의 피보나치 한 줄(<code>a, b = b, a + b</code>)로 확인하세요.</p><p>이미 써 온 <code>for k, v in …</code>, <code>for x, y in points</code> 도 모두 언패킹입니다.</p>' },
          { layout: 'table', title: '📘 튜플을 쓰는 세 가지 이유', head: ['이유', '설명', '예'], rows: [
            ['① 안전', '바뀌면 안 되는 자료 — 실수로 고치면 바로 오류', "WEEK = ('월', '화', '수')"],
            ['② 키가 될 수 있다', '딕셔너리 키 · 세트 항목은 불변이어야 함', "board[(2, 3)] = 'O'"],
            ['③ 여러 값 반환', '함수가 결과 여러 개를 묶어 돌려줄 때', 'q, r = divmod(17, 5)']
          ], lead: '“못 바꾼다”가 단점이 아니라 장점이 되는 자리가 있다',
            notes: '<p><b>[3분]</b> 학생 질문 1위: “그럼 그냥 리스트 쓰면 되지 않나요?” → 이 표가 답입니다.</p><p>특히 ②는 다음 슬라이드에서 좌표 딕셔너리로 바로 확인합니다. 실습 7-15 · 7-17 로 연결됩니다.</p>' },
          { layout: 'table', title: '리스트 vs 튜플', head: ['비교', '리스트', '튜플'], rows: [['기호', '[10, 20]', '(10, 20)'], ['항목 하나', '[10]', '(10,)'], ['읽기 · 슬라이싱 · + · *', 'O', 'O'], ['변경 · 추가 · 삭제', 'O', 'X'], ['변환', 'list(튜플)', 'tuple(리스트)']],
            notes: '<p><b>[2분]</b> 튜플을 쓰는 이유: 실수로 바뀌는 것을 막음(안전), 딕셔너리의 키로 사용 가능, 약간 더 빠르고 가벼움.</p>' },
          { layout: 'practice', title: 'SELF STUDY 7-4', desc: '2차원 튜플 <code>tt = ((1, 2, 3), (4, 5, 6), (7, 8, 9))</code> 의 모든 값을 출력하세요.', starter: `tt = ((1, 2, 3),
      (4, 5, 6),
      (7, 8, 9))
# TODO`, solution: `tt = ((1, 2, 3),
      (4, 5, 6),
      (7, 8, 9))
for i in range(0, 3) :
    for k in range(0, 3) :
        print("%3d" % tt[i][k], end = "")
    print("")`,
            notes: '<p><b>[4분]</b> 2차원 리스트와 읽는 방법이 같다는 것을 확인합니다. for row in tt 방식도 인정.</p>' },
          { layout: 'diagram', title: '딕셔너리의 개념', html: SVG_DICT, caption: '{키1:값1, 키2:값2, …} — 해시 · 연관 배열',
            notes: '<p><b>[4분]</b> 비유: 영어사전(apple → 사과), 전화번호부(이름 → 번호), 사물함 이름표. 리스트는 번호표, 딕셔너리는 이름표.</p>' },
          { layout: 'code', repl: true, title: '딕셔너리의 생성', code: `dic1 = {1 : 'a', 2 : 'b', 3 : 'c'}
dic1
dic2 = {'a': 1, 'b': 2, 'c': 3}
dic2
dic1[1]
dic2['b']`, points: ['키와 값은 프로그래머가 정함', '<code>dic1[1]</code> 은 “키가 1”', '3.7+ 부터 넣은 순서 유지'],
            notes: '<p><b>[3분]</b> 강의자료의 “순서 보장 없음”은 3.6 이전 설명. 현재 파이썬은 삽입 순서를 유지하지만, 첨자(번호)로 접근하지 않는다는 점은 동일합니다.</p>' },
          { layout: 'code', repl: true, title: '추가 · 수정 · 삭제', code: `student1 = {'학번' : 1000, '이름': '홍길동', '학과': '컴퓨터학과'}
student1['연락처'] = '010-1111-2222'
student1
student1['학과'] = '파이썬학과'
student1
del(student1['학과'])
student1`, points: ['없는 키에 대입 → 추가', '있는 키에 대입 → 수정', '<code>del(딕셔너리[키])</code> 삭제'],
            notes: '<p><b>[4분]</b> 표 7-2 홍길동 학생의 정보를 딕셔너리로. 같은 문법(<code>d[키] = 값</code>)이 추가도 되고 수정도 된다는 점을 강조.</p>' },
          { layout: 'code', repl: true, title: '같은 키가 두 번이면?', code: `student1 = {'학번': 1000, '이름': '홍길동', '학과': '파이썬학과', '학번': 2000}
student1
len(student1)`, points: ['키는 중복 불가', '마지막 값(2000)만 적용', '오류는 나지 않음 → 주의'],
            notes: '<p><b>[2분]</b> 오류가 나지 않으므로 오히려 발견하기 어려운 버그가 될 수 있음을 알려 줍니다.</p>' },
          { layout: 'code', repl: true, title: '📘 튜플을 키로 — 좌표 딕셔너리', code: `board = {}
board[(0, 0)] = 'O'
board[(1, 1)] = 'X'
board
board[(1, 1)]
(0, 0) in board
board[[1, 2]] = '오류'`, points: ['좌표 · 날짜처럼 <b>여러 값이 하나의 이름표</b>', '값이 있는 칸만 저장 → 음수 좌표도 OK', '리스트 키 → <code>unhashable type</code>'],
            notes: '<p><b>[4분]</b> 2차원 리스트와 비교: 판이 아주 크고 값이 드문드문 있으면 딕셔너리가 유리합니다(빈 칸을 저장하지 않으니까).</p><p>마지막 줄의 오류 이름 <code>unhashable</code> 은 “내용이 바뀔 수 있어 키로 못 쓴다”는 뜻이라고 풀어 주세요. 실습 7-17(좌표 이동 기록기)의 준비입니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '다음 중 튜플이 <b>아닌</b> 것은?', options: ['(10, 20)', '10, 20', '(10,)', '(10)'], answer: 3, explain: '(10) 은 정수 10',
            notes: '<p><b>[1분]</b></p>' },
          { layout: 'summary', title: '정리', bullets: ['튜플: <code>( )</code>, 읽기 전용 — 항목 하나는 <code>(10,)</code>, <code>list()</code> ↔ <code>tuple()</code>', '📘 언패킹 <code>a, b = b, a</code> · <code>x, *rest = 묶음</code> · <code>q, r = divmod(17, 5)</code>', '📘 튜플을 쓰는 이유: 안전 · <b>키가 될 수 있다</b> · 여러 값 반환', '딕셔너리: <code>{키:값, …}</code>, <code>d[키] = 값</code> 추가/수정, <code>del(d[키])</code> 삭제', '키는 중복 불가(마지막 값만) · 키는 <b>불변</b>이어야 한다 → 리스트는 키 불가'],
            notes: '<p><b>[1분]</b> 다음 교시: 딕셔너리 사용(get, keys, values, items, in, for, 정렬)과 [프로그램 2] 음식 궁합.</p>' }
        ]
      },
      /* ===================== ch07-5 ===================== */
      {
        id: 'ch07-5',
        title: '딕셔너리의 사용과 [프로그램 2]',
        minutes: 50,
        goals: ['딕셔너리[키] 와 get(키) 의 차이를 설명할 수 있다', 'keys() · values() · items() 와 in 연산자를 활용할 수 있다', 'for 문으로 딕셔너리의 모든 항목을 출력할 수 있다', '딕셔너리를 키로 정렬할 수 있다', 'setdefault · update · pop 으로 없는 키를 안전하게 다룰 수 있다', '개수 세기 · 그룹 묶기 패턴을 쓰고 중첩 자료구조(JSON 모양)를 읽을 수 있다', '딕셔너리와 입력 반복으로 [프로그램 2]를 완성할 수 있다'],
        flow: [['키로 값 접근 · get()', 7], ['keys · values · items · in', 8], ['📘 메서드 · 세기 · 묶기 패턴', 9], ['for 문 · 정렬 · 중첩 자료구조', 10], ['[프로그램 2] 완성', 12], ['정리 · 퀴즈', 4]],
        content: [
          { type: 'h', text: '키로 값에 접근하기' },
          { type: 'p', html: '<code>딕셔너리명[키]</code> 로 값을 꺼냅니다. <code>딕셔너리명.get(키)</code> 함수를 써도 결과는 같습니다.' },
          { type: 'code', repl: true, title: '키로 값에 접근 · get()', code: `student1 = {'학번': 2000, '이름': '홍길동', '학과': '파이썬학과'}
student1['학번']
student1['이름']
student1['학과']
student1.get('이름')`, expect: `>>> student1 = {'학번': 2000, '이름': '홍길동', '학과': '파이썬학과'}
>>> student1['학번']
2000
>>> student1['이름']
'홍길동'
>>> student1['학과']
'파이썬학과'
>>> student1.get('이름')
'홍길동'
>>>`, desc: '셸에서는 문자열 값을 보여 줄 때 따옴표를 붙여 표시합니다. <code>print()</code> 로 출력하면 따옴표 없이 나옵니다.' },
          { type: 'p', html: '차이는 <b>없는 키</b>를 찾을 때 나타납니다. <code>딕셔너리명[키]</code> 는 <code>KeyError</code> 오류가 나지만, <code>get(키)</code> 는 오류 없이 <code>None</code>(아무것도 없음)을 돌려줍니다. 그래서 키가 있는지 확실하지 않을 때는 <code>get()</code> 을 사용합니다.' },
          { type: 'code', repl: true, title: '없는 키를 찾으면?', code: `student1 = {'학번': 2000, '이름': '홍길동', '학과': '파이썬학과'}
student1['주소']
student1.get('주소')
print(student1.get('주소'))
student1.get('주소', '주소 없음')`, expect: `>>> student1 = {'학번': 2000, '이름': '홍길동', '학과': '파이썬학과'}
>>> student1['주소']
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
KeyError: '주소'
>>> student1.get('주소')
>>> print(student1.get('주소'))
None
>>> student1.get('주소', '주소 없음')
'주소 없음'
>>>`, desc: '셸은 <code>None</code> 결과를 화면에 표시하지 않아 “아무것도 반환하지 않는 것”처럼 보입니다. <code>print()</code> 로 확인하면 <code>None</code> 입니다. 📘 <code>get(키, 기본값)</code> 처럼 두 번째 값을 주면 키가 없을 때 그 값을 돌려줍니다.' },
          { type: 'h', text: 'keys() · values() · items()' },
          { type: 'p', html: '<code>keys()</code> 는 모든 키를, <code>values()</code> 는 모든 값을, <code>items()</code> 는 모든 <b>(키, 값) 튜플</b>을 돌려줍니다. 결과 앞에 붙은 <code>dict_keys</code>, <code>dict_values</code>, <code>dict_items</code> 가 보기 싫으면 <code>list()</code> 로 감싸 리스트로 바꿉니다.' },
          { type: 'code', repl: true, title: 'keys() · values() · items()', code: `student1 = {'학번': 2000, '이름': '홍길동', '학과': '파이썬학과'}
student1.keys()
list(student1.keys())
student1.values()
list(student1.values())
student1.items()`, expect: `>>> student1 = {'학번': 2000, '이름': '홍길동', '학과': '파이썬학과'}
>>> student1.keys()
dict_keys(['학번', '이름', '학과'])
>>> list(student1.keys())
['학번', '이름', '학과']
>>> student1.values()
dict_values([2000, '홍길동', '파이썬학과'])
>>> list(student1.values())
[2000, '홍길동', '파이썬학과']
>>> student1.items()
dict_items([('학번', 2000), ('이름', '홍길동'), ('학과', '파이썬학과')])
>>>` },
          { type: 'h', text: '키가 있는지 확인하기: in' },
          { type: 'p', html: '<code>키 in 딕셔너리</code> 는 그 키가 있으면 <code>True</code>, 없으면 <code>False</code> 입니다. <b>키</b>를 검사한다는 점에 주의하세요. 값이 들어 있는지 확인하려면 <code>값 in 딕셔너리.values()</code> 를 씁니다.' },
          { type: 'code', repl: true, title: 'in 으로 키 확인', code: `student1 = {'학번': 2000, '이름': '홍길동', '학과': '파이썬학과'}
'이름' in student1
'주소' in student1
'홍길동' in student1
'홍길동' in student1.values()`, expect: `>>> student1 = {'학번': 2000, '이름': '홍길동', '학과': '파이썬학과'}
>>> '이름' in student1
True
>>> '주소' in student1
False
>>> '홍길동' in student1
False
>>> '홍길동' in student1.values()
True
>>>` },
          { type: 'h', text: '딕셔너리 메서드 한눈에 — 실무에서 자주 쓰는 것들' },
          { type: 'p', html: '딕셔너리에는 <code>get()</code> 말고도 편리한 메서드가 많습니다. 특히 <b>“없으면 이렇게, 있으면 저렇게”</b> 를 짧게 쓰게 해 주는 <code>get()</code> · <code>setdefault()</code> 는 실전에서 정말 자주 등장합니다.' },
          { type: 'table', head: ['메서드', '하는 일', '없는 키일 때'], rows: [
            ['<code>d[키]</code>', '값을 읽는다 / 대입하면 추가 · 수정', '읽기: <code>KeyError</code>'],
            ['<code>d.get(키)</code>', '값을 읽는다', '<code>None</code> (오류 없음)'],
            ['<code>d.get(키, 기본값)</code>', '값을 읽되 없으면 기본값', '기본값을 <b>돌려만</b> 준다 (딕셔너리는 그대로)'],
            ['<code>d.setdefault(키, 기본값)</code>', '없으면 <b>넣고</b>, 있으면 그대로 둔 뒤 값을 돌려준다', '딕셔너리에 실제로 <b>추가된다</b>'],
            ['<code>d.update(다른딕셔너리)</code>', '여러 쌍을 한 번에 추가 · 수정', '없는 키는 추가, 있는 키는 덮어쓴다'],
            ['<code>d.pop(키)</code>', '값을 꺼내면서 삭제', '<code>KeyError</code> (<code>d.pop(키, 기본값)</code> 이면 기본값)'],
            ['<code>d.keys()</code> · <code>d.values()</code> · <code>d.items()</code>', '키 · 값 · (키, 값) 쌍 모음', '—'],
            ['<code>len(d)</code> · <code>키 in d</code> · <code>d.clear()</code>', '개수 · 존재 확인 · 전부 삭제', '—']
          ], caption: '자주 쓰는 딕셔너리 메서드 — <code>get</code> 과 <code>setdefault</code> 의 차이에 주의' },
          { type: 'code', title: '추가 예제. get · setdefault · update · pop', code: `stock = {'사과': 10, '바나나': 5}

print(stock.get('사과'), stock.get('포도'), stock.get('포도', 0))

stock.setdefault('포도', 0)       # 없으므로 실제로 추가된다
stock.setdefault('사과', 999)     # 이미 있으므로 그대로
print("setdefault 후 :", stock)

stock.update({'바나나': 8, '딸기': 3})   # 수정 + 추가를 한 번에
print("update 후     :", stock)

sold = stock.pop('딸기')          # 꺼내면서 삭제
print("팔린 것 :", sold, "/ 남은 것 :", stock)
print("없는 키 pop :", stock.pop('수박', '없음'))

print("종류 %d개, 총 수량 %d" % (len(stock), sum(stock.values())))
stock.clear()
print("정리 후 :", stock)`, expect: `10 None 0
setdefault 후 : {'사과': 10, '바나나': 5, '포도': 0}
update 후     : {'사과': 10, '바나나': 8, '포도': 0, '딸기': 3}
팔린 것 : 3 / 남은 것 : {'사과': 10, '바나나': 8, '포도': 0}
없는 키 pop : 없음
종류 3개, 총 수량 18
정리 후 : {}`, desc: '<code>get(키, 0)</code> 은 값을 <b>돌려만</b> 주고 딕셔너리는 건드리지 않습니다. 반면 <code>setdefault(키, 0)</code> 은 없을 때 <b>실제로 넣어 둡니다</b>. “읽기만 할 것인가, 자리를 만들어 둘 것인가”로 구분하세요.' },
          { type: 'h', text: '가장 자주 쓰는 패턴: 세기와 묶기' },
          { type: 'p', html: '딕셔너리의 실전 용도 1위는 <b>개수 세기</b>와 <b>그룹으로 묶기</b>입니다. “처음 보는 키이면 초기값부터 만들어야 한다”는 문제를 세 가지 방법으로 해결할 수 있습니다.' },
          { type: 'code', title: '추가 예제. 세는 방법 세 가지 + 그룹으로 묶기', code: `votes = ['철수', '영희', '철수', '민수', '영희', '철수']

count1 = {}                       # ❶ if 로 직접 확인
for name in votes :
    if name in count1 :
        count1[name] += 1
    else :
        count1[name] = 1

count2 = {}                       # ❷ get(키, 0) — 가장 많이 쓴다
for name in votes :
    count2[name] = count2.get(name, 0) + 1

count3 = {}                       # ❸ setdefault 로 자리를 먼저 만든다
for name in votes :
    count3.setdefault(name, 0)
    count3[name] += 1

print(count2)
print(count1 == count2 == count3)

words = ['apple', 'avocado', 'banana', 'blueberry', 'cherry']
group = {}                        # 값이 리스트인 딕셔너리로 묶기
for w in words :
    group.setdefault(w[0], []).append(w)
print(group)`, expect: `{'철수': 3, '영희': 2, '민수': 1}
True
{'a': ['apple', 'avocado'], 'b': ['banana', 'blueberry'], 'c': ['cherry']}`, desc: '<code>group.setdefault(w[0], []).append(w)</code> 는 “<b>없으면 빈 리스트를 만들어 넣고, 그 리스트에 붙인다</b>”를 한 줄로 쓴 것입니다. 이 패턴은 7-6 교시의 <code>collections.Counter</code> · <code>defaultdict</code> 로 더 짧아집니다.' },
          { type: 'h', text: 'for 문으로 딕셔너리의 모든 값 출력하기' },
          { type: 'code', title: 'Code07-08. for 문으로 딕셔너리 출력', code: `singer = {}

singer['이름'] = '트와이스'
singer['구성원 수'] = 9
singer['데뷔'] = '서바이벌 식스틴'
singer['대표곡'] = 'SIGNAL'

for k in singer.keys() :
    print('%s --> %s' % (k, singer[k]))`, expect: `이름 --> 트와이스
구성원 수 --> 9
데뷔 --> 서바이벌 식스틴
대표곡 --> SIGNAL`, desc: '<code>1행</code>: 빈 딕셔너리를 만들고 <code>3~6행</code>에서 키 : 값을 하나씩 추가합니다. <code>8~9행</code>: 키를 하나씩 꺼내 <code>singer[k]</code> 로 값을 찾아 출력합니다. <code>%s</code> 는 숫자 9 도 문자열로 바꾸어 출력합니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 간단한 for 문', html: '<ul><li><code>for k in singer :</code> — 딕셔너리를 그대로 반복해도 키가 하나씩 나옵니다(<code>.keys()</code> 생략 가능).</li><li><code>for k, v in singer.items() :</code> — 키와 값을 한 번에 꺼냅니다(튜플 언패킹). 가장 많이 쓰는 형태입니다.</li></ul>' },
          { type: 'code', title: '추가 예제. items() 로 키와 값 함께 꺼내기', code: `singer = {'이름': '트와이스', '구성원 수': 9, '데뷔': '서바이벌 식스틴', '대표곡': 'SIGNAL'}

for k, v in singer.items() :
    print(f'{k} --> {v}')

print('키의 개수 :', len(singer))`, expect: `이름 --> 트와이스
구성원 수 --> 9
데뷔 --> 서바이벌 식스틴
대표곡 --> SIGNAL
키의 개수 : 4`, desc: '<code>f\'{k} --> {v}\'</code> 는 f-string 입니다. 문자열 앞에 <code>f</code> 를 붙이면 중괄호 안의 변수 값이 그 자리에 들어갑니다.' },
          { type: 'h', text: '딕셔너리의 정렬' },
          { type: 'p', html: '딕셔너리를 키 순서로 정렬하려면 <code>items()</code> 로 (키, 값) 튜플들을 얻은 뒤 <code>sorted()</code> 로 정렬합니다. <code>key = operator.itemgetter(0)</code> 은 “각 튜플의 0번째(키)를 기준으로 정렬하라”는 뜻입니다. 결과는 튜플의 리스트입니다.' },
          { type: 'code', title: 'Code07-09. 키로 정렬한 후 딕셔너리 추출', code: `import operator

trainDic, trainList = {}, []

trainDic = {'Thomas':'토마스', 'Edward':'에드워드', 'Henry':'헨리', 'Gothen':'고든',
            'James':'제임스'}
trainList = sorted(trainDic.items(), key = operator.itemgetter(0))

print(trainList)`, expect: `[('Edward', '에드워드'), ('Gothen', '고든'), ('Henry', '헨리'), ('James', '제임스'), ('Thomas', '토마스')]`, desc: '<code>3행</code>: 딕셔너리와 리스트 변수를 한 번에 빈 값으로 초기화합니다(튜플 대입). <code>6행</code>: 영어 키의 알파벳 순서로 정렬되었습니다. 값(한글 이름)으로 정렬하려면 <code>itemgetter(1)</code> 을 씁니다.' },
          { type: 'code', title: '추가 예제. 값으로 정렬 · 내림차순 · 다시 딕셔너리로', code: `import operator

trainDic = {'Thomas':'토마스', 'Edward':'에드워드', 'Henry':'헨리', 'Gothen':'고든', 'James':'제임스'}

byValue = sorted(trainDic.items(), key = operator.itemgetter(1))
print(byValue)

byKeyDesc = sorted(trainDic.items(), key = operator.itemgetter(0), reverse = True)
print(dict(byKeyDesc))

print(sorted(trainDic))     # 딕셔너리를 그냥 정렬하면 키만 정렬된 리스트`, expect: `[('Gothen', '고든'), ('Edward', '에드워드'), ('James', '제임스'), ('Thomas', '토마스'), ('Henry', '헨리')]
{'Thomas': '토마스', 'James': '제임스', 'Henry': '헨리', 'Gothen': '고든', 'Edward': '에드워드'}
['Edward', 'Gothen', 'Henry', 'James', 'Thomas']`, desc: '한글은 가나다 순(유니코드 순)으로 정렬됩니다. <code>dict()</code> 로 감싸면 정렬된 순서를 유지한 딕셔너리가 만들어집니다(파이썬 3.7+).' },
          { type: 'h', text: '중첩 자료구조 — 딕셔너리 안의 리스트, 리스트 안의 딕셔너리' },
          { type: 'p', html: '현실의 데이터는 “값 하나”로 끝나지 않습니다. <b>동아리 안에 회원들이 있고, 회원마다 취미 목록이 있는</b> 식이지요. 딕셔너리의 값에는 무엇이든 넣을 수 있으므로 <b>리스트와 딕셔너리를 겹겹이 쌓아</b> 이런 구조를 그대로 표현할 수 있습니다. 꺼낼 때는 <code>club[\'회원\'][0][\'이름\']</code> 처럼 <b>바깥에서 안쪽으로</b> 한 단계씩 따라 들어갑니다.' },
          { type: 'code', title: '추가 예제. 딕셔너리 안의 리스트, 리스트 안의 딕셔너리', code: `club = {
    '이름': '파이썬 동아리',
    '인원': 3,
    '회원': [
        {'이름': '가은', '학년': 1, '취미': ['독서', '코딩']},
        {'이름': '나래', '학년': 2, '취미': ['축구']},
        {'이름': '다온', '학년': 1, '취미': ['코딩', '음악', '영화']}
    ]
}

print("%s (%d명)" % (club['이름'], club['인원']))
print("첫 회원 :", club['회원'][0]['이름'])
print("첫 회원의 두 번째 취미 :", club['회원'][0]['취미'][1])

for m in club['회원'] :
    print("%s(%d학년) 취미 %d개 : %s" % (m['이름'], m['학년'], len(m['취미']), m['취미']))

grade1 = 0
for m in club['회원'] :
    if m['학년'] == 1 :
        grade1 += 1
print("1학년 :", grade1, "명")`, expect: `파이썬 동아리 (3명)
첫 회원 : 가은
첫 회원의 두 번째 취미 : 코딩
가은(1학년) 취미 2개 : ['독서', '코딩']
나래(2학년) 취미 1개 : ['축구']
다온(1학년) 취미 3개 : ['코딩', '음악', '영화']
1학년 : 2 명`, desc: '<code>club[\'회원\']</code> 은 리스트, <code>club[\'회원\'][0]</code> 은 딕셔너리, <code>club[\'회원\'][0][\'취미\']</code> 는 다시 리스트입니다. 헷갈릴 때는 <code>print(type(값))</code> 으로 한 단계씩 확인하면서 내려가면 됩니다.' },
          { type: 'callout', kind: 'more', title: '📘 이 모양이 바로 JSON — 웹에서 데이터를 주고받는 표준', html: '웹 API · 설정 파일 · 데이터베이스 응답은 대부분 <b>JSON</b> 형식입니다. JSON 은 <b>중첩된 딕셔너리와 리스트</b>로 이루어져 있어서 파이썬 자료구조와 모양이 거의 같습니다. 그래서 <code>json</code> 모듈로 <b>문자열 ↔ 파이썬 객체</b>를 바로 변환할 수 있습니다.<ul><li><code>json.dumps(객체)</code> — 파이썬 객체 → JSON 문자열 (한글이 깨져 보이면 <code>ensure_ascii = False</code>)</li><li><code>json.loads(문자열)</code> — JSON 문자열 → 파이썬 딕셔너리 · 리스트</li></ul>즉 <b>이번 장에서 배운 딕셔너리 · 리스트를 다룰 줄 알면 웹 데이터도 다룰 수 있습니다.</b> (파일로 저장 · 읽기는 <code>json.dump</code> · <code>json.load</code>)' },
          { type: 'code', title: '추가 예제. json 으로 주고받기', code: `import json

club = {'이름': '파이썬 동아리',
        '회원': [{'이름': '가은', '학년': 1, '취미': ['독서', '코딩']}]}

text = json.dumps(club, ensure_ascii = False)
print(text)
print(type(text))

back = json.loads(text)             # 다시 파이썬 딕셔너리로
print(type(back))
print(back['회원'][0]['취미'])
print(back == club)`, expect: `{"이름": "파이썬 동아리", "회원": [{"이름": "가은", "학년": 1, "취미": ["독서", "코딩"]}]}
<class 'str'>
<class 'dict'>
['독서', '코딩']
True`, desc: 'JSON 문자열은 겉보기에 파이썬 딕셔너리와 거의 같지만 <b>작은따옴표가 아니라 큰따옴표</b>를 쓰고 <code>True</code> 대신 <code>true</code> 를 씁니다. 그래서 눈으로 읽을 때는 비슷해도 변환은 <code>json</code> 모듈에 맡겨야 합니다.' },
          { type: 'h', text: '[프로그램 2]의 완성 — 딕셔너리를 활용한 음식 궁합 출력' },
          { type: 'p', html: '음식과 궁합이 맞는 음식을 딕셔너리에 저장해 두고, 사용자가 음식 이름을 입력하면 궁합 음식을 알려 줍니다. 딕셔너리에 없는 음식이면 안내 문구를 출력하고, <b>“끝”</b>을 입력하면 반복을 멈춥니다.' },
          { type: 'code', title: 'Code07-10. [프로그램 2] 완성: 음식 궁합 출력', stdin: '치킨\n라면\n짬뽕\n끝\n', code: `## 변수 선언 부분 ##
foods = {"떡볶이":"오뎅",
         "짜장면":"단무지",
         "라면":"김치",
         "피자":"피클",
         "맥주":"땅콩",
         "치킨":"치킨무",
         "삼겹살":"상추"};

## 메인 코드 부분 ##
while (True) :
    myfood = input(str(list(foods.keys())) + " 중 좋아하는 음식은?")
    if myfood in foods :
        print("<%s> 궁합 음식은 <%s>입니다." % (myfood, foods.get(myfood)))
    elif myfood == "끝" :
        break
    else :
        print("그런 음식이 없습니다. 확인해 보세요.")`, expect: `['떡볶이', '짜장면', '라면', '피자', '맥주', '치킨', '삼겹살'] 중 좋아하는 음식은?치킨
<치킨> 궁합 음식은 <치킨무>입니다.
['떡볶이', '짜장면', '라면', '피자', '맥주', '치킨', '삼겹살'] 중 좋아하는 음식은?라면
<라면> 궁합 음식은 <김치>입니다.
['떡볶이', '짜장면', '라면', '피자', '맥주', '치킨', '삼겹살'] 중 좋아하는 음식은?짬뽕
그런 음식이 없습니다. 확인해 보세요.
['떡볶이', '짜장면', '라면', '피자', '맥주', '치킨', '삼겹살'] 중 좋아하는 음식은?끝`, desc: '<code>2~8행</code>: 음식(키) : 궁합 음식(값) 딕셔너리. 괄호 안이므로 여러 줄로 나누어 써도 됩니다(8행 끝의 <code>;</code> 는 없어도 됩니다). <code>11행</code>: <code>while (True)</code> 는 무한 반복이고, <code>16행</code>의 <code>break</code> 로만 빠져나옵니다. <code>12행</code>: 키 목록을 리스트 → 문자열로 바꿔 안내 문구를 만듭니다. <code>13~14행</code>: 입력한 음식이 딕셔너리의 키이면 <code>get()</code> 으로 궁합 음식을 찾아 출력합니다.' },
          { type: 'callout', kind: 'tip', title: '실행해 보기', html: '▶ 실행 후 콘솔에 음식 이름을 직접 입력해 보세요. <b>“예시 입력으로 실행”</b> 을 누르면 치킨 → 라면 → 짬뽕 → 끝 이 차례로 입력됩니다. “끝”을 입력해야 프로그램이 종료됩니다.' },
          { type: 'callout', kind: 'more', title: '📘 입력값의 앞뒤 공백', html: '사용자가 실수로 <code>" 치킨"</code> 처럼 공백을 넣으면 키를 찾지 못합니다. <code>input(...).strip()</code> 으로 앞뒤 공백을 제거하면 더 튼튼한 프로그램이 됩니다(문자열 함수는 8장).' }
        ],
        practice: [
          {
            title: '실습 7-18. 영어 단어장',
            level: 2,
            desc: '<p>영어 단어(키) : 뜻(값) 딕셔너리를 만들고, 단어를 입력받아 뜻을 알려 주는 프로그램을 만드세요. 없는 단어이면 뜻을 입력받아 <b>단어장에 추가</b>합니다. <code>q</code> 를 입력하면 종료하고 전체 단어장을 <b>알파벳 순으로</b> 출력합니다.</p><pre>단어 : apple\napple의 뜻은 사과입니다.\n단어 : cat\ncat은(는) 없는 단어입니다. 뜻을 입력하세요 : 고양이\n단어 : q\napple : 사과\n…</pre>',
            hint: '<code>while True :</code> 안에서 <code>if word == \'q\' : break</code>, <code>elif word in words :</code>, <code>else :</code> 로 나눕니다. 정렬 출력은 <code>for k in sorted(words) :</code>.',
            starter: `words = {'apple':'사과', 'book':'책', 'dog':'개'}

# TODO: q 를 입력할 때까지 반복

# TODO: 알파벳 순으로 전체 출력
`,
            solution: `words = {'apple':'사과', 'book':'책', 'dog':'개'}

while True :
    word = input("단어 : ")
    if word == 'q' :
        break
    elif word in words :
        print("%s의 뜻은 %s입니다." % (word, words[word]))
    else :
        words[word] = input("%s은(는) 없는 단어입니다. 뜻을 입력하세요 : " % word)

for k in sorted(words) :
    print(k, ':', words[k])
`,
            stdin: 'apple\ncat\n고양이\ncat\nq\n',
            expect: `단어 : apple
apple의 뜻은 사과입니다.
단어 : cat
cat은(는) 없는 단어입니다. 뜻을 입력하세요 : 고양이
단어 : cat
cat의 뜻은 고양이입니다.
단어 : q
apple : 사과
book : 책
cat : 고양이
dog : 개`
          },
          {
            title: '실습 7-19. 투표 결과 세기',
            level: 2,
            desc: '<p>후보 이름이 담긴 투표 리스트가 있습니다. 딕셔너리를 사용해 후보별 득표 수를 세고, <b>득표 수가 많은 순서</b>로 출력하세요.</p><pre>votes = [\'철수\', \'영희\', \'철수\', \'민수\', \'영희\', \'철수\']</pre><pre>철수 : 3표\n영희 : 2표\n민수 : 1표</pre>',
            hint: '<code>count[name] = count.get(name, 0) + 1</code> 이 핵심입니다. 정렬은 <code>sorted(count.items(), key = operator.itemgetter(1), reverse = True)</code>.',
            starter: `import operator

votes = ['철수', '영희', '철수', '민수', '영희', '철수']
count = {}

# TODO: 득표 수 세기

# TODO: 많은 순으로 출력
`,
            solution: `import operator

votes = ['철수', '영희', '철수', '민수', '영희', '철수']
count = {}

for name in votes :
    count[name] = count.get(name, 0) + 1

for name, n in sorted(count.items(), key = operator.itemgetter(1), reverse = True) :
    print("%s : %d표" % (name, n))
`,
            expect: `철수 : 3표
영희 : 2표
민수 : 1표`
          },
          {
            title: '실습 7-20. 카페 메뉴판 — 딕셔너리 메서드 익히기',
            level: 1,
            desc: '<p>메뉴판 딕셔너리를 메서드로 고쳐 나가세요.</p><ol><li><code>get()</code> 으로 <code>\'라떼\'</code> 가격과 <code>\'녹차\'</code> 가격(없으면 <b>0</b>)을 출력</li><li><code>setdefault()</code> 로 <code>\'녹차\' 4500</code> 을 추가하고, <code>\'라떼\' 9999</code> 도 시도해 본 뒤 전체 출력 (있는 키는 바뀌지 않는 것을 확인!)</li><li><code>update()</code> 로 <code>{\'라떼\': 4500, \'콜드브루\': 5000}</code> 을 반영하고 전체 출력</li><li><code>pop()</code> 으로 <code>\'아메리카노\'</code> 를 빼내고 가격과 남은 메뉴 출력</li><li>메뉴 수 · 가격 합계 · 평균 가격(소수점 없이) 출력</li></ol><pre>라떼 : 4000 / 녹차 : 0\n…\n메뉴 수 : 3, 합계 : 14000원, 평균 : 4667원</pre>',
            hint: '<code>get(키, 기본값)</code> 은 값을 <b>돌려만</b> 주고, <code>setdefault(키, 기본값)</code> 은 없을 때 <b>실제로 넣습니다</b>. 합계는 <code>sum(menu.values())</code>.',
            starter: `menu = {'아메리카노': 3000, '라떼': 4000}

# TODO: 1. get 으로 라떼 · 녹차 가격

# TODO: 2. setdefault 로 녹차 추가 · 라떼 시도

# TODO: 3. update

# TODO: 4. pop

# TODO: 5. 메뉴 수 · 합계 · 평균
`,
            solution: `menu = {'아메리카노': 3000, '라떼': 4000}

print("라떼 :", menu.get('라떼'), "/ 녹차 :", menu.get('녹차', 0))

menu.setdefault('녹차', 4500)
menu.setdefault('라떼', 9999)
print("setdefault 후 :", menu)

menu.update({'라떼': 4500, '콜드브루': 5000})
print("update 후     :", menu)

price = menu.pop('아메리카노')
print("아메리카노(%d원) 단종 →" % price, menu)

print("메뉴 수 : %d, 합계 : %d원, 평균 : %.0f원" % (len(menu), sum(menu.values()), sum(menu.values()) / len(menu)))
`,
            expect: `라떼 : 4000 / 녹차 : 0
setdefault 후 : {'아메리카노': 3000, '라떼': 4000, '녹차': 4500}
update 후     : {'아메리카노': 3000, '라떼': 4500, '녹차': 4500, '콜드브루': 5000}
아메리카노(3000원) 단종 → {'라떼': 4500, '녹차': 4500, '콜드브루': 5000}
메뉴 수 : 3, 합계 : 14000원, 평균 : 4667원`
          },
          {
            title: '실습 7-21. 요일별 판매량 분석',
            level: 1,
            desc: '<p>요일(키) : 판매량(값) 딕셔너리가 주어집니다.</p><ol><li><code>items()</code> 로 <code>월요일 : 120개</code> 처럼 모두 출력</li><li>합계와 평균(소수점 한 자리)</li><li>가장 많이 팔린 요일과 가장 적게 팔린 요일 — <code>max(sales, key = sales.get)</code> 활용</li><li>평균 이상 팔린 요일 목록</li></ol><pre>월요일 : 120개\n…\n합계 : 645개, 평균 : 129.0개\n최고 : 목요일(160), 최저 : 화요일(95)\n평균 이상 : [\'수\', \'목\', \'금\']</pre>',
            hint: '<code>max(sales, key = sales.get)</code> 는 “값이 가장 큰 <b>키</b>”를 돌려줍니다. <code>max(sales.values())</code> 는 값만 나오므로 어느 요일인지 알 수 없다는 점을 비교해 보세요.',
            starter: `sales = {'월': 120, '화': 95, '수': 140, '목': 160, '금': 130}

# TODO: items() 로 모두 출력

# TODO: 합계 · 평균

# TODO: 최고 · 최저 요일

# TODO: 평균 이상 요일
`,
            solution: `sales = {'월': 120, '화': 95, '수': 140, '목': 160, '금': 130}

for day, n in sales.items() :
    print("%s요일 : %d개" % (day, n))

total = sum(sales.values())
avg = total / len(sales)
print("합계 : %d개, 평균 : %.1f개" % (total, avg))

best = max(sales, key = sales.get)
worst = min(sales, key = sales.get)
print("최고 : %s요일(%d), 최저 : %s요일(%d)" % (best, sales[best], worst, sales[worst]))

over = []
for day, n in sales.items() :
    if n >= avg :
        over.append(day)
print("평균 이상 :", over)
`,
            expect: `월요일 : 120개
화요일 : 95개
수요일 : 140개
목요일 : 160개
금요일 : 130개
합계 : 645개, 평균 : 129.0개
최고 : 목요일(160), 최저 : 화요일(95)
평균 이상 : ['수', '목', '금']`
          },
          {
            title: '실습 7-22. 중첩 자료구조에서 정보 뽑기 (도서관)',
            level: 2,
            desc: '<p>도서관 데이터가 <b>딕셔너리 안에 리스트, 리스트 안에 딕셔너리</b> 형태(JSON 과 같은 모양)로 주어집니다.</p><ol><li>도서관 이름과 전체 책 수</li><li><b>대출 가능한</b> 책 제목 목록 (<code>\'대출중\'</code> 이 <code>False</code>)</li><li><code>\'프로그래밍\'</code> 태그가 붙은 책 제목 목록</li><li>저자별 보유 권수 딕셔너리 (<code>get(키, 0) + 1</code> 패턴)</li><li>중복을 뺀 전체 태그 목록(정렬)</li></ol><pre>중앙 도서관 : 전체 3권\n대출 가능 : [\'파이썬 입문\', \'요리의 기초\']\n프로그래밍 태그 : [\'파이썬 입문\', \'자료구조\']\n저자별 권수 : {\'김파이\': 1, \'이자료\': 1, \'박요리\': 1}\n태그 종류 : [\'요리\', \'입문\', \'전공\', \'프로그래밍\']</pre>',
            hint: '<code>for b in library[\'책\'] :</code> 로 책(딕셔너리)을 하나씩 꺼내고, 그 안에서 <code>b[\'제목\']</code>, <code>b[\'태그\']</code> 로 들어갑니다. 태그 검사는 <code>if \'프로그래밍\' in b[\'태그\'] :</code>.',
            starter: `library = {
    '이름': '중앙 도서관',
    '책': [
        {'제목': '파이썬 입문', '저자': '김파이', '대출중': False, '태그': ['프로그래밍', '입문']},
        {'제목': '자료구조', '저자': '이자료', '대출중': True, '태그': ['프로그래밍', '전공']},
        {'제목': '요리의 기초', '저자': '박요리', '대출중': False, '태그': ['요리']}
    ]
}

# TODO: 이름과 전체 책 수

# TODO: 대출 가능한 책

# TODO: '프로그래밍' 태그가 붙은 책

# TODO: 저자별 권수

# TODO: 태그 종류(중복 제거 후 정렬)
`,
            solution: `library = {
    '이름': '중앙 도서관',
    '책': [
        {'제목': '파이썬 입문', '저자': '김파이', '대출중': False, '태그': ['프로그래밍', '입문']},
        {'제목': '자료구조', '저자': '이자료', '대출중': True, '태그': ['프로그래밍', '전공']},
        {'제목': '요리의 기초', '저자': '박요리', '대출중': False, '태그': ['요리']}
    ]
}

print("%s : 전체 %d권" % (library['이름'], len(library['책'])))

available = []
for b in library['책'] :
    if not b['대출중'] :
        available.append(b['제목'])
print("대출 가능 :", available)

prog = []
for b in library['책'] :
    if '프로그래밍' in b['태그'] :
        prog.append(b['제목'])
print("프로그래밍 태그 :", prog)

byAuthor = {}
for b in library['책'] :
    byAuthor[b['저자']] = byAuthor.get(b['저자'], 0) + 1
print("저자별 권수 :", byAuthor)

tags = []
for b in library['책'] :
    for t in b['태그'] :
        if t not in tags :
            tags.append(t)
print("태그 종류 :", sorted(tags))
`,
            expect: `중앙 도서관 : 전체 3권
대출 가능 : ['파이썬 입문', '요리의 기초']
프로그래밍 태그 : ['파이썬 입문', '자료구조']
저자별 권수 : {'김파이': 1, '이자료': 1, '박요리': 1}
태그 종류 : ['요리', '입문', '전공', '프로그래밍']`
          },
          {
            title: '🚀 프로젝트 1. 학생 성적 관리 프로그램',
            level: 3,
            desc: '<p>딕셔너리 안에 딕셔너리를 두어 <b>학생 이름 → 과목별 점수</b>를 관리하는 프로그램을 만듭니다. 이번 장에서 배운 것(딕셔너리 · 정렬 · <code>items()</code> · <code>max(key=)</code> · 언패킹)을 모두 쓰는 종합 과제입니다.</p><p><b>요구 사항</b></p><ul><li><b>자료 구조</b> — <code>scores = {\'가은\': {\'국어\': 80, \'영어\': 85, \'수학\': 90}, …}</code></li><li><code>"명령(추가/조회/순위/통계/끝) : "</code> 를 반복해서 입력받습니다.</li><li><b>추가</b> — 이름과 국어 · 영어 · 수학 점수를 차례로 입력받아 저장. 이미 있는 이름이면 <code>이미 있는 학생입니다. 점수를 덮어씁니다.</code> 를 먼저 출력. 끝나면 <code>다온 저장 완료 (총 3명)</code></li><li><b>조회</b> — 이름을 입력받아 과목별 점수 · 총점 · 평균(소수점 한 자리) 출력. 없으면 <code>그런 학생이 없습니다.</code></li><li><b>순위</b> — 총점 <b>내림차순</b>, 총점이 같으면 <b>이름 오름차순</b>으로 <code>1위 나래 265점 (평균 88.3)</code> 형식 출력</li><li><b>통계</b> — 과목마다 <code>국어 : 평균 80.0, 최고 다온(90)</code> 형식 출력</li><li><b>끝</b> — 반복을 멈추고 <code>학생 N명 저장됨</code> 출력. 그 밖의 입력은 <code>모르는 명령입니다.</code></li></ul><pre>명령(추가/조회/순위/통계/끝) : 순위\n1위 나래 265점 (평균 88.3)\n2위 다온 265점 (평균 88.3)\n3위 가은 255점 (평균 85.0)</pre><p>👉 <b>더 해 보기</b>: ① <code>삭제</code> 명령 추가(<code>pop</code>) ② 과목을 <code>subjects</code> 리스트로만 관리해 과목이 늘어도 코드를 고치지 않게 하기(이미 그렇게 되어 있는지 확인!) ③ 평균 90 이상은 <code>A</code>, 80 이상은 <code>B</code> … 학점 출력 ④ <code>json.dumps</code> 로 저장 문자열 만들어 보기 ⑤ 7-6 교시를 배운 뒤 컴프리헨션으로 순위 코드를 더 짧게.</p>',
            hint: '정렬 기준 두 개는 튜플로 묶습니다: <code>sorted(scores.items(), key = lambda it : (-sum(it[1].values()), it[0]))</code> — <code>it</code> 은 <code>(이름, 점수딕셔너리)</code> 튜플입니다. 과목 최고점 학생은 <code>max(scores, key = lambda n : scores[n][s])</code>.',
            starter: `subjects = ['국어', '영어', '수학']
scores = {'가은': {'국어': 80, '영어': 85, '수학': 90},
          '나래': {'국어': 70, '영어': 95, '수학': 100}}

while True :
    cmd = input("명령(추가/조회/순위/통계/끝) : ")
    if cmd == '추가' :
        pass      # TODO: 이름 + 과목별 점수 입력받아 저장
    elif cmd == '조회' :
        pass      # TODO: 이름으로 찾아 점수 · 총점 · 평균
    elif cmd == '순위' :
        pass      # TODO: 총점 내림차순(동점이면 이름 순)
    elif cmd == '통계' :
        pass      # TODO: 과목별 평균과 최고점 학생
    elif cmd == '끝' :
        break
    else :
        print("모르는 명령입니다.")

print("학생 %d명 저장됨" % len(scores))
`,
            solution: `subjects = ['국어', '영어', '수학']
scores = {'가은': {'국어': 80, '영어': 85, '수학': 90},
          '나래': {'국어': 70, '영어': 95, '수학': 100}}

while True :
    cmd = input("명령(추가/조회/순위/통계/끝) : ")
    if cmd == '추가' :
        name = input("이름 : ")
        if name in scores :
            print("이미 있는 학생입니다. 점수를 덮어씁니다.")
        one = {}
        for s in subjects :
            one[s] = int(input("%s 점수 : " % s))
        scores[name] = one
        print("%s 저장 완료 (총 %d명)" % (name, len(scores)))
    elif cmd == '조회' :
        name = input("이름 : ")
        if name not in scores :
            print("그런 학생이 없습니다.")
        else :
            one = scores[name]
            total = sum(one.values())
            print("%s : %s" % (name, one))
            print("총점 %d, 평균 %.1f" % (total, total / len(one)))
    elif cmd == '순위' :
        rank = sorted(scores.items(), key = lambda it : (-sum(it[1].values()), it[0]))
        for i in range(0, len(rank)) :
            name, one = rank[i]
            total = sum(one.values())
            print("%d위 %s %d점 (평균 %.1f)" % (i + 1, name, total, total / len(one)))
    elif cmd == '통계' :
        for s in subjects :
            vals = []
            for name in scores :
                vals.append(scores[name][s])
            best = max(scores, key = lambda n : scores[n][s])
            print("%s : 평균 %.1f, 최고 %s(%d)" % (s, sum(vals) / len(vals), best, scores[best][s]))
    elif cmd == '끝' :
        break
    else :
        print("모르는 명령입니다.")

print("학생 %d명 저장됨" % len(scores))
`,
            stdin: '추가\n다온\n90\n90\n85\n조회\n가은\n조회\n라희\n순위\n통계\n끝\n',
            expect: `명령(추가/조회/순위/통계/끝) : 추가
이름 : 다온
국어 점수 : 90
영어 점수 : 90
수학 점수 : 85
다온 저장 완료 (총 3명)
명령(추가/조회/순위/통계/끝) : 조회
이름 : 가은
가은 : {'국어': 80, '영어': 85, '수학': 90}
총점 255, 평균 85.0
명령(추가/조회/순위/통계/끝) : 조회
이름 : 라희
그런 학생이 없습니다.
명령(추가/조회/순위/통계/끝) : 순위
1위 나래 265점 (평균 88.3)
2위 다온 265점 (평균 88.3)
3위 가은 255점 (평균 85.0)
명령(추가/조회/순위/통계/끝) : 통계
국어 : 평균 80.0, 최고 다온(90)
영어 : 평균 90.0, 최고 나래(95)
수학 : 평균 91.7, 최고 나래(100)
명령(추가/조회/순위/통계/끝) : 끝
학생 3명 저장됨`
          }
        ],
        quiz: [
          { q: '<code>d = {\'a\': 1}</code> 일 때 <code>print(d.get(\'b\'))</code> 의 결과는?', options: ['<code>0</code>', '<code>None</code>', "<code>KeyError: 'b'</code> 오류", '빈 문자열'], answer: 1, explain: 'get() 은 없는 키이면 None 을 돌려줍니다. <code>d[\'b\']</code> 였다면 KeyError.' },
          { q: '<code>d = {\'이름\': \'홍길동\'}</code> 일 때 <code>\'홍길동\' in d</code> 의 결과는?', options: ['True', 'False', '오류', 'None'], answer: 1, explain: 'in 은 <b>키</b>를 검사합니다. 값을 검사하려면 <code>\'홍길동\' in d.values()</code>.' },
          { q: '<code>list({\'x\': 1, \'y\': 2}.items())</code> 의 결과는?', options: ["<code>['x', 'y']</code>", '<code>[1, 2]</code>', "<code>[('x', 1), ('y', 2)]</code>", "<code>[['x', 1], ['y', 2]]</code>"], answer: 2, explain: 'items() 는 (키, 값) <b>튜플</b>들을 돌려줍니다.' },
          { q: 'Code07-10 에서 프로그램이 끝나는 조건은?', options: ['딕셔너리에 없는 음식을 입력했을 때', '"끝"을 입력했을 때', '7번 입력했을 때', '아무것도 입력하지 않았을 때'], answer: 1, explain: '<code>elif myfood == "끝" : break</code> 로 무한 반복을 빠져나옵니다.' },
          { q: '<code>sorted(dic.items(), key = operator.itemgetter(0))</code> 는 무엇을 기준으로 정렬하는가?', options: ['값', '키', '항목을 넣은 순서', '키의 길이'], answer: 1, explain: '(키, 값) 튜플의 0번째 = 키. itemgetter(1) 이면 값 기준입니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>d = {\'a\': 1}\nd.get(\'b\', 0)\nd.setdefault(\'c\', 0)\nprint(d)</code></pre>', options: ["<code>{'a': 1}</code>", "<code>{'a': 1, 'c': 0}</code>", "<code>{'a': 1, 'b': 0, 'c': 0}</code>", "<code>{'a': 1, 'b': 0}</code>"], answer: 1, explain: '<code>get()</code> 은 값을 <b>돌려만</b> 주고 딕셔너리를 바꾸지 않지만, <code>setdefault()</code> 는 키가 없으면 <b>실제로 추가</b>합니다.' }
        ],
        slides: [
          { layout: 'title', title: '딕셔너리의 사용과 [프로그램 2]', subtitle: 'Section 05 — 딕셔너리 (2)', badge: '07-5',
            notes: '<p><b>[도입 1분]</b> 복습: 딕셔너리를 만들고 추가 · 수정 · 삭제하는 법. 오늘은 꺼내 쓰는 법과 음식 궁합 프로그램.</p>' },
          { layout: 'code', repl: true, title: '키로 값에 접근: [ ] vs get()', code: `student1 = {'학번': 2000, '이름': '홍길동', '학과': '파이썬학과'}
student1['이름']
student1.get('이름')
student1['주소']
student1.get('주소')
print(student1.get('주소'))`, points: ['있는 키: 결과 같음', '없는 키: [ ] → KeyError', 'get() → None (오류 없음)'],
            notes: '<p><b>[4분]</b> 셸은 None 을 표시하지 않아 “아무것도 반환하지 않음”처럼 보입니다. print 로 None 확인. 보충: get(키, 기본값).</p>' },
          { layout: 'code', repl: true, title: 'keys() · values() · items()', code: `student1 = {'학번': 2000, '이름': '홍길동', '학과': '파이썬학과'}
student1.keys()
list(student1.keys())
student1.values()
list(student1.values())
student1.items()`, points: ['dict_keys → list() 로 변환', 'items(): (키, 값) 튜플', '반복문에 바로 사용 가능'],
            notes: '<p><b>[4분]</b> dict_keys 등은 “딕셔너리를 들여다보는 창(view)”으로, 딕셔너리가 바뀌면 함께 바뀝니다. 지금은 list() 로 바꾸면 리스트처럼 쓸 수 있다는 정도로.</p>' },
          { layout: 'code', repl: true, title: 'in 으로 키 확인', code: `student1 = {'학번': 2000, '이름': '홍길동', '학과': '파이썬학과'}
'이름' in student1
'주소' in student1
'홍길동' in student1
'홍길동' in student1.values()`, points: ['키가 있으면 True', 'in 은 <b>키</b>만 검사', '값 검사는 .values()'],
            notes: '<p><b>[2분]</b> 세 번째 줄 결과를 예측하게 하세요. 대부분 True 라고 답합니다.</p>' },
          { layout: 'table', title: '📘 딕셔너리 메서드 한눈에', head: ['메서드', '하는 일', '없는 키일 때'], rows: [
            ['d[키]', '읽기 / 대입하면 추가 · 수정', '읽기는 KeyError'],
            ['d.get(키, 기본값)', '값을 읽는다', '기본값을 <b>돌려만</b> 준다'],
            ['d.setdefault(키, 기본값)', '없으면 넣고 값을 돌려준다', '실제로 <b>추가된다</b>'],
            ['d.update(다른딕셔너리)', '여러 쌍을 한 번에 반영', '없으면 추가, 있으면 덮어쓰기'],
            ['d.pop(키, 기본값)', '꺼내면서 삭제', '기본값이 없으면 KeyError'],
            ['len(d) · 키 in d · d.clear()', '개수 · 존재 확인 · 전부 삭제', '—']
          ], lead: 'get 과 setdefault 의 차이가 핵심 — 읽기만? 자리를 만들어 둘까?',
            notes: '<p><b>[3분]</b> 표를 외우게 하지 말고, <code>get</code> vs <code>setdefault</code> 한 쌍만 확실히 구분시키세요.</p><p>질문: “<code>d.get(\'x\', 0)</code> 을 실행하면 d 에 x 가 생길까?” → 아니요. <code>setdefault</code> 는 생깁니다.</p>' },
          { layout: 'code', title: 'get · setdefault · update · pop', code: `stock = {'사과': 10, '바나나': 5}
print(stock.get('포도'), stock.get('포도', 0))

stock.setdefault('포도', 0)
stock.setdefault('사과', 999)
print(stock)

stock.update({'바나나': 8, '딸기': 3})
print(stock)

print(stock.pop('딸기'), stock.pop('수박', '없음'))
print(len(stock), sum(stock.values()))`, points: ['<code>get</code> 은 딕셔너리를 바꾸지 않는다', '<code>setdefault</code> 는 없을 때 넣는다', '<code>update</code> = 수정 + 추가', '<code>pop(키, 기본값)</code> 으로 안전하게'],
            notes: '<p><b>[4분]</b> 한 줄씩 결과를 예측시키며 실행합니다. 특히 <code>setdefault(\'사과\', 999)</code> 뒤에도 사과가 10 인 것을 확인하세요.</p><p><code>sum(stock.values())</code> — values() 는 합계 · 최대 · 최소에 바로 쓸 수 있습니다.</p>' },
          { layout: 'code', title: '📘 가장 많이 쓰는 패턴: 세기와 묶기', code: `votes = ['철수', '영희', '철수', '민수', '영희', '철수']

count = {}
for name in votes :
    count[name] = count.get(name, 0) + 1
print(count)

words = ['apple', 'avocado', 'banana', 'cherry']
group = {}
for w in words :
    group.setdefault(w[0], []).append(w)
print(group)`, points: ['<code>count.get(키, 0) + 1</code> — 개수 세기', '<code>setdefault(키, []).append(값)</code> — 묶기', '“처음 보는 키”를 다루는 두 관용구', '7-6 교시: Counter · defaultdict 로 더 짧게'],
            notes: '<p><b>[5분]</b> 먼저 <code>if name in count : … else : …</code> 로 길게 쓴 뒤, get 으로 줄이는 과정을 보여 주면 이해가 깊어집니다.</p><p>두 번째 예는 “값이 리스트인 딕셔너리”. 한 줄이 낯설면 두 줄로 풀어 쓰게 하세요. 실습 7-19 · 7-22 와 프로젝트에서 계속 나옵니다.</p>' },
          { layout: 'code', title: 'Code07-08. for 문으로 출력', code: `singer = {}

singer['이름'] = '트와이스'
singer['구성원 수'] = 9
singer['데뷔'] = '서바이벌 식스틴'
singer['대표곡'] = 'SIGNAL'

for k in singer.keys() :
    print('%s --> %s' % (k, singer[k]))`, points: ['빈 딕셔너리에 하나씩 추가', 'keys() 로 키를 하나씩', '<code>singer[k]</code> 로 값'],
            notes: '<p><b>[3분]</b> 보충: <code>for k, v in singer.items():</code> 로 바꿔 실행해 보여 주세요. 학생들이 좋아하는 가수로 바꿔 보게 해도 좋습니다.</p>' },
          { layout: 'code', title: 'Code07-09. 딕셔너리의 정렬', code: `import operator

trainDic, trainList = {}, []

trainDic = {'Thomas':'토마스', 'Edward':'에드워드', 'Henry':'헨리', 'Gothen':'고든',
            'James':'제임스'}
trainList = sorted(trainDic.items(), key = operator.itemgetter(0))

print(trainList)`, points: ['items() → (키, 값) 튜플들', 'itemgetter(0): 키 기준', '결과는 튜플의 리스트'],
            notes: '<p><b>[4분]</b> itemgetter(1) 로 바꾸면 값(한글 이름) 기준. reverse=True 로 내림차순. key=lambda 는 나중에(함수 장).</p>' },
          { layout: 'code', title: '📘 중첩 자료구조 = JSON 의 모양', code: `club = {
    '이름': '파이썬 동아리',
    '회원': [
        {'이름': '가은', '학년': 1, '취미': ['독서', '코딩']},
        {'이름': '나래', '학년': 2, '취미': ['축구']}
    ]
}

print(club['회원'][0]['취미'][1])
for m in club['회원'] :
    print(m['이름'], m['학년'], m['취미'])

import json
print(json.dumps(club, ensure_ascii = False))`, points: ['딕셔너리 값에 리스트 · 딕셔너리', '바깥 → 안쪽으로 한 단계씩', '<code>[\'회원\'][0][\'취미\'][1]</code> 를 소리 내어 읽기', '이 모양이 곧 <b>JSON</b> (웹 데이터 표준)'],
            notes: '<p><b>[5분]</b> <code>club[\'회원\'][0][\'취미\'][1]</code> 를 “회원 목록의 → 0번 회원의 → 취미 목록의 → 1번”처럼 읽게 하면 헷갈리지 않습니다. 헷갈릴 때는 <code>print(type(…))</code> 으로 한 단계씩 확인.</p><p>마지막 json 출력으로 “우리가 배운 딕셔너리 · 리스트가 곧 웹 데이터 형식”임을 보여 주세요. 학생들의 동기 부여에 효과가 큽니다. 실습 7-22 로 연결.</p>' },
          { layout: 'diagram', title: '[프로그램 2] 음식 궁합 출력', html: SVG_PROGRAMS, caption: '음식(키) → 궁합 음식(값), “끝” 입력까지 반복',
            notes: '<p><b>[2분]</b> 필요한 것: ① 딕셔너리 ② 무한 반복 + break ③ in 으로 키 확인 ④ get() 으로 값 꺼내기. 모두 배운 것들!</p>' },
          { layout: 'code', title: 'Code07-10. [프로그램 2] 완성', stdin: '치킨\n라면\n짬뽕\n끝\n', code: `## 변수 선언 부분 ##
foods = {"떡볶이":"오뎅",
         "짜장면":"단무지",
         "라면":"김치",
         "피자":"피클",
         "맥주":"땅콩",
         "치킨":"치킨무",
         "삼겹살":"상추"};

## 메인 코드 부분 ##
while (True) :
    myfood = input(str(list(foods.keys())) + " 중 좋아하는 음식은?")
    if myfood in foods :
        print("<%s> 궁합 음식은 <%s>입니다." % (myfood, foods.get(myfood)))
    elif myfood == "끝" :
        break
    else :
        print("그런 음식이 없습니다. 확인해 보세요.")`, points: ['while (True) + break', '<code>in</code> 으로 키 확인', 'get() 으로 궁합 음식'],
            notes: '<p><b>[8분]</b> 직접 입력해 보게 한 뒤 “예시 입력으로 실행”도 보여 줍니다. 확장 질문: 없는 음식이면 궁합 음식을 입력받아 추가하려면? → 실습 7-18 단어장과 같은 구조.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: "<code>d = {'이름': '홍길동'}</code> 일 때 <code>'홍길동' in d</code> 는?", options: ['True', 'False', '오류', 'None'], answer: 1, explain: 'in 은 키를 검사',
            notes: '<p><b>[1분]</b></p>' },
          { layout: 'practice', title: '🚀 프로젝트 1. 학생 성적 관리', desc: '<code>{이름: {과목: 점수}}</code> 구조로 <b>추가 · 조회 · 순위 · 통계</b> 명령을 처리하세요. 순위는 총점 내림차순(동점이면 이름 순).', stdin: '추가\n다온\n90\n90\n85\n순위\n통계\n끝\n', starter: `subjects = ['국어', '영어', '수학']
scores = {'가은': {'국어': 80, '영어': 85, '수학': 90},
          '나래': {'국어': 70, '영어': 95, '수학': 100}}
# TODO: 추가 / 조회 / 순위 / 통계 / 끝`, solution: `subjects = ['국어', '영어', '수학']
scores = {'가은': {'국어': 80, '영어': 85, '수학': 90},
          '나래': {'국어': 70, '영어': 95, '수학': 100}}

while True :
    cmd = input("명령(추가/조회/순위/통계/끝) : ")
    if cmd == '추가' :
        name = input("이름 : ")
        one = {}
        for s in subjects :
            one[s] = int(input("%s 점수 : " % s))
        scores[name] = one
        print("%s 저장 완료 (총 %d명)" % (name, len(scores)))
    elif cmd == '순위' :
        rank = sorted(scores.items(), key = lambda it : (-sum(it[1].values()), it[0]))
        for i in range(0, len(rank)) :
            name, one = rank[i]
            print("%d위 %s %d점" % (i + 1, name, sum(one.values())))
    elif cmd == '통계' :
        for s in subjects :
            best = max(scores, key = lambda n : scores[n][s])
            print("%s : 최고 %s(%d)" % (s, best, scores[best][s]))
    elif cmd == '끝' :
        break

print("학생 %d명 저장됨" % len(scores))`,
            notes: '<p><b>[10분 이상 · 과제]</b> 이 장의 종합 과제입니다. 수업에서는 <b>자료 구조 설계</b>와 <b>순위 정렬</b> 두 가지만 함께 잡아 주고 나머지는 과제로 돌리세요.</p><p>정렬 키 <code>lambda it : (-sum(it[1].values()), it[0])</code> 를 분해해 설명: <code>it</code> 은 (이름, 점수딕셔너리) 튜플 → <code>it[1].values()</code> 가 점수들 → 합이 총점 → 앞에 <code>-</code> 로 내림차순 → 동점이면 <code>it[0]</code>(이름) 순.</p><p>확장 아이디어(삭제 명령 · 학점 · json 저장)는 학생 문서에 적어 두었습니다.</p>' },
          { layout: 'practice', title: '실습 7-19. 투표 결과 세기', desc: '딕셔너리로 후보별 득표 수를 세고 많은 순으로 출력하세요.', starter: `import operator
votes = ['철수', '영희', '철수', '민수', '영희', '철수']
count = {}
# TODO`, solution: `import operator
votes = ['철수', '영희', '철수', '민수', '영희', '철수']
count = {}
for name in votes :
    count[name] = count.get(name, 0) + 1
for name, n in sorted(count.items(), key = operator.itemgetter(1), reverse = True) :
    print("%s : %d표" % (name, n))`,
            notes: '<p><b>[5분]</b> <code>count.get(name, 0) + 1</code> 관용구가 핵심. if name in count 로 나눠 푸는 학생도 정답.</p>' },
          { layout: 'summary', title: '정리', bullets: ['<code>d[키]</code> 없으면 KeyError, <code>d.get(키, 기본값)</code> 은 안전하게', '📘 <code>setdefault</code> · <code>update</code> · <code>pop</code> — 없는 키를 다루는 도구', '📘 세기 <code>d[k] = d.get(k, 0) + 1</code> · 묶기 <code>d.setdefault(k, []).append(v)</code>', '<code>키 in d</code> · <code>for k, v in d.items()</code> · <code>sum(d.values())</code>', '정렬: <code>sorted(d.items(), key = …)</code> · <code>max(d, key = d.get)</code>', '📘 중첩 자료구조(딕셔너리 안의 리스트) = JSON 의 모양'],
            notes: '<p><b>[1분]</b> 다음 교시: 세트, 컴프리헨션, zip, 리스트 복사, 스택.</p>' }
        ]
      },
      /* ===================== ch07-6 ===================== */
      {
        id: 'ch07-6',
        title: '심화: 세트 · 컴프리헨션 · zip · 복사 · 스택',
        minutes: 50,
        goals: ['세트로 중복을 제거하고 교집합 · 합집합 · 차집합 · 대칭 차집합을 구할 수 있다', '컴프리헨션으로 리스트를 한 줄에 만들 수 있다', 'zip() 으로 여러 리스트를 동시에 다루고 튜플 · 딕셔너리로 짝지을 수 있다', 'newList = oldList 와 oldList[:] 의 차이를 설명할 수 있다', '참조 · 얕은 복사 · 깊은 복사(copy.deepcopy)를 구분할 수 있다', '리스트의 append() · pop() 으로 스택(LIFO)을 구현할 수 있다', 'in 검색 비용을 알고 상황에 맞는 자료형을 고를 수 있다', 'collections 의 Counter · defaultdict · deque · namedtuple 을 활용할 수 있다'],
        flow: [['세트 · in 검색 비용', 10], ['컴프리헨션(심화 포함)', 10], ['zip()', 6], ['리스트의 복사 · 깊은 복사', 9], ['스택 · 큐', 8], ['📘 collections', 5], ['정리', 2]],
        content: [
          { type: 'h', text: '세트(set)' },
          { type: 'p', html: '<b>세트(set, 집합)</b>는 <b>키만 모아 놓은 딕셔너리</b> 같은 자료형입니다. 딕셔너리의 키가 중복될 수 없듯이 세트에 들어 있는 값은 <b>항상 유일</b>합니다. 딕셔너리처럼 중괄호 <code>{ }</code> 를 쓰지만 <code>:</code> 없이 값만 나열합니다. 중복된 값은 자동으로 하나만 남습니다.' },
          { type: 'code', repl: true, title: '세트 만들기 — 중복은 하나만', code: `mySet1 = {1, 2, 3, 3, 3, 4}
mySet1
type(mySet1)
len(mySet1)`, expect: `>>> mySet1 = {1, 2, 3, 3, 3, 4}
>>> mySet1
{1, 2, 3, 4}
>>> type(mySet1)
<class 'set'>
>>> len(mySet1)
4
>>>` },
          { type: 'p', html: '판매된 물품의 전체 수량이 아니라 <b>어떤 종류가 팔렸는지</b>만 알고 싶을 때 리스트를 <code>set()</code> 으로 바꾸면 중복이 사라집니다.' },
          { type: 'code', repl: true, nondeterministic: true, title: '판매된 물품의 종류만 파악하기', code: `salesList = ['삼각김밥', '바나나', '도시락', '삼각김밥', '삼각김밥', '도시락', '삼각김밥']
set(salesList)
len(set(salesList))`, desc: '결과는 예를 들어 <code>{\'도시락\', \'바나나\', \'삼각김밥\'}</code> 처럼 나오지만 <b>순서는 실행할 때마다 달라질 수 있습니다</b>. 세트는 순서가 없는 자료형이라 첨자(<code>mySet[0]</code>)로 접근할 수 없습니다. 종류의 개수는 항상 3 입니다.' },
          { type: 'code', title: '추가 예제. 중복 제거 후 정렬해서 출력', code: `salesList = ['삼각김밥', '바나나', '도시락', '삼각김밥', '삼각김밥', '도시락', '삼각김밥']
kinds = sorted(set(salesList))     # 세트 → 정렬된 리스트
print("판매된 종류 :", kinds)
for item in kinds :
    print("%s : %d개" % (item, salesList.count(item)))`, expect: `판매된 종류 : ['도시락', '바나나', '삼각김밥']
도시락 : 2개
바나나 : 1개
삼각김밥 : 4개`, desc: '출력 순서를 일정하게 하려면 <code>sorted()</code> 로 정렬된 리스트로 바꿉니다.' },
          { type: 'p', html: '세트는 수학의 집합처럼 두 세트 사이의 <b>교집합(<code>&amp;</code>), 합집합(<code>|</code>), 차집합(<code>-</code>), 대칭 차집합(<code>^</code>)</b>을 구할 수 있습니다. 대칭 차집합은 “한쪽에만 있는 것”(합집합 − 교집합)입니다.' },
          { type: 'figure', html: SVG_SET, caption: '두 세트의 교집합 · 합집합 · 차집합 · 대칭 차집합' },
          { type: 'code', repl: true, title: '집합 연산 — 연산자와 함수', code: `mySet1 = {1, 2, 3, 4, 5}
mySet2 = {4, 5, 6, 7}
mySet1 & mySet2     # 교집합
mySet1 | mySet2     # 합집합
mySet1 - mySet2     # 차집합
mySet1 ^ mySet2     # 대칭 차집합
mySet1.intersection(mySet2)           # 교집합
mySet1.union(mySet2)                  # 합집합
mySet1.difference(mySet2)             # 차집합
mySet1.symmetric_difference(mySet2)   # 대칭 차집합`, expect: `>>> mySet1 = {1, 2, 3, 4, 5}
>>> mySet2 = {4, 5, 6, 7}
>>> mySet1 & mySet2     # 교집합
{4, 5}
>>> mySet1 | mySet2     # 합집합
{1, 2, 3, 4, 5, 6, 7}
>>> mySet1 - mySet2     # 차집합
{1, 2, 3}
>>> mySet1 ^ mySet2     # 대칭 차집합
{1, 2, 3, 6, 7}
>>> mySet1.intersection(mySet2)           # 교집합
{4, 5}
>>> mySet1.union(mySet2)                  # 합집합
{1, 2, 3, 4, 5, 6, 7}
>>> mySet1.difference(mySet2)             # 차집합
{1, 2, 3}
>>> mySet1.symmetric_difference(mySet2)   # 대칭 차집합
{1, 2, 3, 6, 7}
>>>`, desc: '연산자 <code>&amp;, |, -, ^</code> 대신 <code>intersection()</code>, <code>union()</code>, <code>difference()</code>, <code>symmetric_difference()</code> 함수를 써도 결과가 같습니다.' },
          { type: 'callout', kind: 'warn', title: '빈 세트는 set()', html: '<code>{}</code> 는 빈 <b>딕셔너리</b>입니다. 빈 세트는 <code>set()</code> 으로 만들고, 값은 <code>add(값)</code> 으로 추가 · <code>remove(값)</code> 으로 삭제합니다. 리스트는 세트의 항목이 될 수 없습니다(딕셔너리의 키와 같은 규칙).' },
          { type: 'code', title: '추가 예제. 세트에 넣고 빼기 — add · update · discard · remove', code: `basket = set()
basket.add('사과')
basket.add('바나나')
basket.add('사과')            # 이미 있으면 조용히 무시된다
print(sorted(basket))

basket.update(['딸기', '포도'])   # 여러 개 한 번에
basket.discard('수박')         # 없어도 오류가 나지 않는다
basket.remove('바나나')        # 없으면 KeyError
print(sorted(basket), len(basket))

print('사과' in basket)
print({'사과', '딸기'} <= basket)     # 부분집합인가?`, expect: `['바나나', '사과']
['딸기', '사과', '포도'] 3
True
True`, desc: '<code>add()</code> 는 중복을 신경 쓰지 않아도 되므로 “이미 있나 확인 → 없으면 추가” 코드를 대신합니다. 지울 때 키가 있는지 확실하지 않으면 <code>remove()</code> 대신 <code>discard()</code> 를 쓰세요. <code>&lt;=</code> 는 부분집합 검사입니다(<code>issubset()</code> 과 같음).' },
          { type: 'h', text: '📘 더 알아보기: in 검색 비용 — 리스트 vs 세트 · 딕셔너리' },
          { type: 'p', html: '<code>값 in 리스트</code> 는 <b>앞에서부터 하나씩 비교</b>합니다. 항목이 10만 개면 없는 값을 찾을 때 10만 번 비교하지요. 반면 세트와 딕셔너리는 값을 <b>해시(hash)</b>라는 계산으로 “저장된 자리”를 바로 알아내므로, 항목이 몇 개든 <b>거의 같은 시간</b>이 걸립니다.<br>그래서 <mark>“들어 있는지”를 자주 확인해야 하면 리스트 대신 세트를 쓰세요</mark>. 이것은 문법이 아니라 <b>설계 선택</b>의 문제이고, 실무에서 성능 차이가 가장 크게 나는 지점 중 하나입니다.' },
          { type: 'code', title: '추가 예제. 얼마나 차이 날까? (직접 재 보기)', nondeterministic: true, code: `import time

n = 20000
data = list(range(n))       # 리스트
dataSet = set(data)         # 같은 내용의 세트
targets = [n - 1, n - 2, n - 3]     # 일부러 맨 뒤에 있는 값들

start = time.perf_counter()
for i in range(0, 100) :
    for t in targets :
        found = t in data           # 앞에서부터 하나씩 비교
listTime = time.perf_counter() - start

start = time.perf_counter()
for i in range(0, 100) :
    for t in targets :
        found = t in dataSet        # 해시로 한 번에
setTime = time.perf_counter() - start

print("리스트 검색 : %.4f초" % listTime)
print("세트 검색   : %.4f초" % setTime)
if setTime > 0 :
    print("세트가 약 %d배 빠름" % (listTime / setTime))
else :
    print("세트 검색은 너무 빨라 시간이 0 으로 측정되었습니다.")`, desc: '시간은 컴퓨터와 브라우저 상황에 따라 달라지므로 <b>정확한 숫자보다 배수의 규모</b>를 보세요. 보통 수백 ~ 수천 배 차이가 납니다. 반대로 <b>항목이 열 개 남짓이면 차이가 없으니</b> 무조건 세트를 쓸 필요는 없습니다.' },
          { type: 'table', head: ['하고 싶은 일', '알맞은 자료형', '이유'], rows: [
            ['순서대로 쌓고 꺼내기', '리스트 <code>[ ]</code>', '순서 유지 · 중복 허용 · 첨자 접근'],
            ['“들어 있는지” 자주 확인, 중복 제거', '세트 <code>set()</code>', '검색이 아주 빠름 · 중복 자동 제거'],
            ['이름표로 값 찾기, 개수 세기', '딕셔너리 <code>{키:값}</code>', '키 검색이 아주 빠름'],
            ['바뀌면 안 되는 한 덩어리, 키로 쓸 값', '튜플 <code>( )</code>', '불변 → 안전하고 키로 쓸 수 있음'],
            ['앞뒤로 넣고 빼기(큐)', '<code>collections.deque</code>', '양쪽 끝 삽입 · 삭제가 빠름']
          ], caption: '자료형 고르기 — “무엇을 자주 하게 될까?”가 기준' },
          { type: 'h', text: '컴프리헨션(comprehension)' },
          { type: 'p', html: '<b>컴프리헨션</b>은 규칙적으로 값이 이어지는 리스트를 <b>한 줄로</b> 만드는 간단한 방법입니다. 1부터 5까지 저장된 리스트를 두 가지 방법으로 만들어 봅시다.' },
          { type: 'code', repl: true, title: '반복문으로 만들기 vs 컴프리헨션', code: `numList = []
for num in range(1, 6) :
    numList.append(num)

numList
numList = [num for num in range(1, 6)]
numList`, expect: `>>> numList = []
>>> for num in range(1, 6) :
...     numList.append(num)
...
>>> numList
[1, 2, 3, 4, 5]
>>> numList = [num for num in range(1, 6)]
>>> numList
[1, 2, 3, 4, 5]
>>>` },
          { type: 'code', run: false, title: '컴프리헨션의 구성', code: `리스트 = [수식 for 항목 in range() if 조건식]` },
          { type: 'p', html: '대괄호 안의 맨 앞 <b>수식</b>이 리스트에 들어갈 값이고, 뒤의 <code>for</code> 가 반복을, <code>if</code> 가 조건을 담당합니다(<code>if</code> 는 생략 가능). “<i>range(1, 6) 의 각 num 에 대해, 조건을 만족하면, 수식의 값을 모아라</i>”라고 읽으면 됩니다.' },
          { type: 'code', repl: true, title: '제곱 리스트 · 3의 배수 리스트', code: `numList = [num * num for num in range(1, 6)]
numList
numList = [num for num in range(1, 21) if num % 3 == 0]
numList`, expect: `>>> numList = [num * num for num in range(1, 6)]
>>> numList
[1, 4, 9, 16, 25]
>>> numList = [num for num in range(1, 21) if num % 3 == 0]
>>> numList
[3, 6, 9, 12, 15, 18]
>>>` },
          { type: 'code', title: '추가 예제. 컴프리헨션을 반복문으로 풀어 보기', code: `# 컴프리헨션
numList1 = [num for num in range(1, 21) if num % 3 == 0]

# 같은 일을 하는 반복문
numList2 = []
for num in range(1, 21) :
    if num % 3 == 0 :
        numList2.append(num)

print(numList1)
print(numList2)
print(numList1 == numList2)

prices = [1000, 2500, 3000]
print([p * 2 for p in prices])                   # 리스트의 모든 항목에 계산
words = ['apple', 'banana', 'kiwi']
print([len(w) for w in words])
print({w: len(w) for w in words})                # 📘 딕셔너리 컴프리헨션`, expect: `[3, 6, 9, 12, 15, 18]
[3, 6, 9, 12, 15, 18]
True
[2000, 5000, 6000]
[5, 6, 4]
{'apple': 5, 'banana': 6, 'kiwi': 4}`, desc: '7-2 교시에서 “리스트의 모든 항목에 곱하기”는 <code>*</code> 로 안 된다고 했지요? 컴프리헨션 <code>[p * 2 for p in prices]</code> 이 그 답입니다. 중괄호와 <code>키: 값</code> 을 쓰면 딕셔너리도 만들 수 있습니다.' },
          { type: 'h', text: '컴프리헨션 심화 — 리스트 · 딕셔너리 · 집합 · 2차원' },
          { type: 'p', html: '대괄호 <code>[ ]</code> 대신 중괄호를 쓰면 <b>딕셔너리</b>나 <b>집합</b>도 한 줄로 만들 수 있습니다. 또 <code>for</code> 앞의 “수식” 자리에는 <code>A if 조건 else B</code>(조건 표현식)를 쓸 수 있습니다. <b>앞의 <code>if</code> 는 값을 고르고, 뒤의 <code>if</code> 는 항목을 걸러 낸다</b>고 기억하세요.' },
          { type: 'code', title: '추가 예제. 네 가지 컴프리헨션과 조건 표현식', code: `nums = [1, 2, 3, 4, 5, 6]

print([n * n for n in nums if n % 2 == 0])            # 뒤의 if : 걸러내기
print(['짝' if n % 2 == 0 else '홀' for n in nums])    # 앞의 if~else : 값 고르기

print({n : n * n for n in nums if n <= 3})            # 딕셔너리 컴프리헨션
print(sorted({n % 3 for n in nums}))                  # 집합 컴프리헨션 (중복 제거)

table = [[i * k for k in range(1, 4)] for i in range(1, 4)]   # 2차원 만들기
print(table)

words = ['apple', 'Banana', 'cherry']
print([w.upper() for w in words])`, expect: `[4, 16, 36]
['홀', '짝', '홀', '짝', '홀', '짝']
{1: 1, 2: 4, 3: 9}
[0, 1, 2]
[[1, 2, 3], [2, 4, 6], [3, 6, 9]]
['APPLE', 'BANANA', 'CHERRY']`, desc: '<code>[[i * k for k in range(1, 4)] for i in range(1, 4)]</code> 는 7-3 교시의 <b>안전한 2차원 리스트 만들기</b>와 같은 방법입니다. 안쪽 대괄호가 <b>행마다 새로 실행</b>되므로 <code>[[0] * 4] * 3</code> 같은 공유 문제가 생기지 않습니다.' },
          { type: 'callout', kind: 'warn', title: '컴프리헨션을 쓰지 말아야 할 때', html: '컴프리헨션은 <b>짧아서</b> 좋은 것이 아니라 <b>“이 리스트는 무엇을 모은 것이다”가 한눈에 보여서</b> 좋은 것입니다. 다음과 같으면 그냥 <code>for</code> 문으로 쓰세요.<ul><li>한 줄이 너무 길어 가로로 스크롤해야 할 때</li><li><code>for</code> 가 두 개 이상 겹치고 <code>if</code> 도 여러 개일 때</li><li>중간에 <code>print()</code> 나 다른 작업이 함께 필요할 때 (컴프리헨션은 <b>값을 모으는 용도</b>입니다)</li></ul>“동료가 3초 안에 읽을 수 있는가”가 좋은 기준입니다.' },
          { type: 'h', text: '동시에 여러 리스트에 접근하기: zip()' },
          { type: 'p', html: '<code>zip()</code> 함수는 여러 리스트의 같은 위치 항목끼리 <b>지퍼처럼 짝지어</b> 줍니다. <code>for</code> 문과 함께 쓰면 여러 리스트를 동시에 반복할 수 있습니다. 길이가 다르면 <b>짧은 쪽</b>에 맞춰 끝납니다.' },
          { type: 'code', title: 'zip() 으로 두 리스트 동시에 반복', code: `foods = ['떡볶이', '짜장면', '라면', '피자', '맥주', '치킨', '삼겹살']
sides = ['오뎅', '단무지', '김치']
for food, side in zip(foods, sides) :
    print(food, ' --> ', side)`, expect: `떡볶이  -->  오뎅
짜장면  -->  단무지
라면  -->  김치`, desc: '<code>print()</code> 에 쉼표로 여러 값을 주면 값 사이에 공백이 하나씩 들어가므로 <code>\' --> \'</code> 양옆에 공백이 두 칸씩 보입니다. <code>sides</code> 가 3개뿐이라 세 쌍만 출력되었습니다.' },
          { type: 'p', html: '<code>zip()</code> 의 결과를 <code>list()</code> 로 감싸면 <b>튜플의 리스트</b>가, <code>dict()</code> 로 감싸면 <b>딕셔너리</b>가 됩니다.' },
          { type: 'code', repl: true, title: '두 리스트를 튜플이나 딕셔너리로 짝짓기', code: `foods = ['떡볶이', '짜장면', '라면', '피자', '맥주', '치킨', '삼겹살']
sides = ['오뎅', '단무지', '김치']
tupList = list(zip(foods, sides))
dic = dict(zip(foods, sides))
tupList
dic`, expect: `>>> foods = ['떡볶이', '짜장면', '라면', '피자', '맥주', '치킨', '삼겹살']
>>> sides = ['오뎅', '단무지', '김치']
>>> tupList = list(zip(foods, sides))
>>> dic = dict(zip(foods, sides))
>>> tupList
[('떡볶이', '오뎅'), ('짜장면', '단무지'), ('라면', '김치')]
>>> dic
{'떡볶이': '오뎅', '짜장면': '단무지', '라면': '김치'}
>>>` },
          { type: 'callout', kind: 'more', title: '📘 enumerate() — 첨자와 값을 함께', html: '<code>for i, food in enumerate(foods) :</code> 로 쓰면 <code>i</code> 에 0, 1, 2 … 첨자가, <code>food</code> 에 값이 함께 들어옵니다. <code>range(len(foods))</code> 와 <code>foods[i]</code> 를 따로 쓸 필요가 없습니다. <code>enumerate(foods, 1)</code> 이면 1부터 셉니다.' },
          { type: 'h', text: '리스트의 복사' },
          { type: 'p', html: '<code>newList = oldList</code> 는 리스트를 복사하는 것처럼 보이지만, 실제로는 <b>같은 리스트에 이름을 하나 더 붙이는 것</b>입니다. 두 이름이 <b>같은 메모리 공간을 공유</b>하므로 한쪽을 바꾸면 다른 쪽도 바뀝니다. 강의자료에서는 이것을 “얕은 복사”라고 부릅니다.' },
          { type: 'code', title: 'newList = oldList (같은 리스트 공유)', code: `oldList = ['짜장면', '탕수육', '군만두']
newList = oldList
print(newList)
oldList[0] = '짬뽕'
oldList.append('깐풍기')
print(newList)`, expect: `['짜장면', '탕수육', '군만두']
['짬뽕', '탕수육', '군만두', '깐풍기']`, desc: 'newList 는 한 번도 고치지 않았는데 oldList 를 바꾸자 newList 도 바뀌었습니다.' },
          { type: 'figure', html: SVG_COPY, caption: '그림 7-7 · 7-8 이름만 복사(공유) vs 내용을 복사한 새 리스트' },
          { type: 'p', html: '이것을 막으려면 <code>newList = oldList[:]</code> 처럼 슬라이싱으로 <b>내용을 복사한 새 리스트</b>를 만듭니다. 강의자료는 이것을 “깊은 복사”라고 부릅니다. 이제 oldList 를 바꿔도 newList 는 그대로입니다.' },
          { type: 'code', title: 'newList = oldList[:] (새 리스트로 복사)', code: `oldList = ['짜장면', '탕수육', '군만두']
newList = oldList[:]
print(newList)
oldList[0] = '짬뽕'
oldList.append('깐풍기')
print(newList)
print(oldList)`, expect: `['짜장면', '탕수육', '군만두']
['짜장면', '탕수육', '군만두']
['짬뽕', '탕수육', '군만두', '깐풍기']` },
          { type: 'callout', kind: 'more', title: '📘 용어 정리: 참조 · 얕은 복사 · 깊은 복사', html: '파이썬 공식 문서의 용어로는 조금 다르게 부릅니다.<ul><li><code>newList = oldList</code> — 복사가 아니라 <b>같은 객체를 참조</b>(별명 붙이기). <code>newList is oldList</code> 가 <code>True</code>.</li><li><code>oldList[:]</code>, <code>oldList.copy()</code>, <code>list(oldList)</code> — <b>얕은 복사(shallow copy)</b>: 바깥 리스트는 새로 만들지만 안쪽 리스트(2차원의 각 행)는 공유합니다.</li><li><code>copy.deepcopy(oldList)</code> — <b>깊은 복사(deep copy)</b>: 안쪽 리스트까지 모두 새로 만듭니다. 2차원 리스트를 완전히 복사할 때 사용합니다.</li></ul>1차원 리스트라면 <code>[:]</code> 나 <code>copy()</code> 로 충분합니다.' },
          { type: 'code', title: '추가 예제. 2차원 리스트에서 [:] 와 deepcopy 비교', code: `import copy

old = [[1, 2], [3, 4]]
a = old                  # 같은 리스트 참조
b = old[:]               # 얕은 복사 (행은 공유)
c = copy.deepcopy(old)   # 깊은 복사 (모두 새로)

old[0][0] = 99           # 안쪽 값 변경
old.append([5, 6])       # 바깥 리스트에 추가

print("a :", a)
print("b :", b)
print("c :", c)
print(a is old, b is old, b[0] is old[0], c[0] is old[0])`, expect: `a : [[99, 2], [3, 4], [5, 6]]
b : [[99, 2], [3, 4]]
c : [[1, 2], [3, 4]]
True False True False`, desc: '<code>is</code> 는 “두 이름이 <b>같은 객체</b>인가”를 검사합니다. b 는 새 바깥 리스트라 append 의 영향은 없지만, 행 <code>b[0]</code> 은 old 와 공유하므로 99 가 보입니다.' },
          { type: 'h', text: '리스트를 이용한 스택 구현' },
          { type: 'p', html: '<b>스택(stack)</b>은 한쪽 끝이 막혀 있어서 <b>먼저 들어간 것이 가장 나중에 나오는</b> 자료구조입니다. 막다른 골목 주차장, 쌓아 올린 접시를 떠올려 보세요. 이런 구조를 <b>LIFO(Last In First Out, 후입선출)</b>라고 합니다.' },
          { type: 'list', items: [
            '<b>푸시(push)</b>: 데이터를 넣는 것 → 리스트의 <code>append()</code>',
            '<b>팝(pop)</b>: 데이터를 빼는 것 → 리스트의 <code>pop()</code>',
            '<b>top</b>: 스택에 들어 있는 데이터 중 가장 마지막 데이터의 <b>바로 다음 위치</b>(다음에 넣을 자리). 자동차 A, B, C 가 들어 있으면 top 은 C 다음의 빈 자리(3)'
          ] },
          { type: 'figure', html: SVG_STACK, caption: '그림 7-9 ~ 7-13 한쪽이 막힌 주차장으로 이해하는 스택' },
          { type: 'p', html: '한쪽이 막힌 주차장을 리스트 <code>parking</code> 으로 만들고, 자동차를 넣고(push) 빼면서(pop) top 의 변화를 확인해 봅시다.' },
          { type: 'code', repl: true, title: '주차장 스택 — push 와 pop', code: `parking = []
top = 0
parking.append('자동차A')
top += 1
parking.append('자동차B')
top += 1
parking.append('자동차C')
top += 1
parking, top
top -= 1
outCar = parking.pop()
print(outCar)
parking, top`, expect: `>>> parking = []
>>> top = 0
>>> parking.append('자동차A')
>>> top += 1
>>> parking.append('자동차B')
>>> top += 1
>>> parking.append('자동차C')
>>> top += 1
>>> parking, top
(['자동차A', '자동차B', '자동차C'], 3)
>>> top -= 1
>>> outCar = parking.pop()
>>> print(outCar)
자동차C
>>> parking, top
(['자동차A', '자동차B'], 2)
>>>`, desc: '가장 나중에 들어간 자동차C 가 가장 먼저 빠져나왔습니다. 파이썬 리스트에서는 <code>len(parking)</code> 이 항상 top 과 같으므로 top 변수를 따로 두지 않아도 됩니다(아래 예제).' },
          { type: 'code', title: '추가 예제. 스택 전체 동작 확인', code: `parking = []

for car in ['자동차A', '자동차B', '자동차C'] :
    parking.append(car)                       # push
    print("%s 입차 → %s (top = %d)" % (car, parking, len(parking)))

while len(parking) > 0 :
    outCar = parking.pop()                    # pop
    print("%s 출차 → %s (top = %d)" % (outCar, parking, len(parking)))

print("주차장이 비었습니다.")`, expect: `자동차A 입차 → ['자동차A'] (top = 1)
자동차B 입차 → ['자동차A', '자동차B'] (top = 2)
자동차C 입차 → ['자동차A', '자동차B', '자동차C'] (top = 3)
자동차C 출차 → ['자동차A', '자동차B'] (top = 2)
자동차B 출차 → ['자동차A'] (top = 1)
자동차A 출차 → [] (top = 0)
주차장이 비었습니다.`, desc: '<code>while len(parking) &gt; 0</code> 조건으로 빈 스택에서 <code>pop()</code> 하는 오류(<code>IndexError: pop from empty list</code>)를 막았습니다.' },
          { type: 'callout', kind: 'tip', title: 'Tip · 큐(Queue)', html: '스택과 함께 많이 쓰는 자료구조가 <b>큐(queue)</b>입니다. 큐는 양쪽이 뚫린 파이프처럼 <b>한쪽으로 들어가서 다른 쪽으로 나오는</b> 구조로, 먼저 들어간 것이 먼저 나옵니다(<b>FIFO</b>, First In First Out). 줄 서기와 같습니다. 리스트로는 <code>append()</code> 로 넣고 <code>pop(0)</code> 으로 맨 앞을 빼면 됩니다. (📘 데이터가 많으면 <code>collections.deque</code> 의 <code>popleft()</code> 가 훨씬 빠릅니다)' },
          { type: 'code', title: '추가 예제. 리스트로 큐 흉내 내기', code: `queue = []
for person in ['민수', '지아', '도윤'] :
    queue.append(person)          # 줄 서기 (뒤로 들어감)
print("대기 줄 :", queue)

while queue :                     # 빈 리스트는 False
    person = queue.pop(0)         # 맨 앞 사람이 나감
    print(person, "입장, 남은 줄 :", queue)`, expect: `대기 줄 : ['민수', '지아', '도윤']
민수 입장, 남은 줄 : ['지아', '도윤']
지아 입장, 남은 줄 : ['도윤']
도윤 입장, 남은 줄 : []` },
          { type: 'h', text: '📘 collections — 리스트 · 딕셔너리의 “업그레이드 버전”' },
          { type: 'p', html: '지금까지 직접 만들어 본 패턴들(개수 세기, 그룹으로 묶기, 큐)은 너무 자주 쓰여서 <b>표준 라이브러리에 이미 들어 있습니다</b>. <code>collections</code> 모듈의 네 가지만 알아 두면 코드가 눈에 띄게 짧아집니다. 직접 만들 줄 아는 상태에서 쓰는 것이 중요합니다 — 그래야 <b>무엇을 대신해 주는지</b> 알 수 있으니까요.' },
          { type: 'table', head: ['도구', '무엇을 대신하나', '핵심 사용법'], rows: [
            ['<code>Counter</code>', '<code>d[k] = d.get(k, 0) + 1</code> 개수 세기', '<code>Counter(리스트)</code>, <code>.most_common(n)</code>'],
            ['<code>defaultdict</code>', '<code>d.setdefault(k, []).append(v)</code> 그룹 묶기', '<code>defaultdict(list)</code>, <code>defaultdict(int)</code>'],
            ['<code>deque</code>', '리스트의 <code>pop(0)</code> (느린 큐)', '<code>append()</code> · <code>popleft()</code> · <code>appendleft()</code>'],
            ['<code>namedtuple</code>', '<code>t[0]</code>, <code>t[1]</code> 처럼 번호로 읽던 튜플', '<code>Point(x, y)</code> → <code>p.x</code>, <code>p.y</code>']
          ], caption: 'collections 의 네 가지 — 모두 리스트 · 딕셔너리 · 튜플의 친척' },
          { type: 'code', title: '추가 예제. Counter · defaultdict · deque · namedtuple', code: `from collections import Counter, defaultdict, deque, namedtuple

words = ['사과', '배', '사과', '포도', '배', '사과']

cnt = Counter(words)                 # 개수 세기를 한 줄로
print(cnt)
print(cnt.most_common(2))            # 많은 순 상위 2개
print(cnt['사과'], cnt['수박'])       # 없는 키는 0 (KeyError 아님!)

group = defaultdict(list)            # 없는 키를 빈 리스트로 자동 생성
for w in ['apple', 'avocado', 'banana'] :
    group[w[0]].append(w)
print(dict(group))

queue = deque(['민수', '지아'])
queue.append('도윤')                 # 뒤로 들어오고
print(queue.popleft(), queue.popleft())   # 앞에서 나간다
print(queue)

Point = namedtuple('Point', ['x', 'y'])
p = Point(3, 7)
print(p, p.x + p.y, p[0])`, expect: `Counter({'사과': 3, '배': 2, '포도': 1})
[('사과', 3), ('배', 2)]
3 0
{'a': ['apple', 'avocado'], 'b': ['banana']}
민수 지아
deque(['도윤'])
Point(x=3, y=7) 10 3`, desc: '<code>Counter</code> 는 딕셔너리의 한 종류라서 <code>cnt[\'사과\']</code> 처럼 그대로 쓸 수 있고, <b>없는 키는 0</b> 을 돌려줍니다. <code>namedtuple</code> 은 튜플이면서도 <code>p.x</code> 처럼 <b>이름으로</b> 읽을 수 있어, <code>tList[3]</code> 이 무엇이었는지 헷갈리던 7-3 교시의 거북이 리스트 같은 코드를 훨씬 읽기 쉽게 만들어 줍니다.' },
          { type: 'callout', kind: 'more', title: '📘 왜 큐는 deque 를 쓰나요? (pop(0) 이 느린 이유)', html: '리스트에서 <code>pop(0)</code> 을 하면 맨 앞 칸이 비므로 <b>뒤의 항목을 모두 한 칸씩 앞으로 당겨야</b> 합니다. 항목이 10만 개면 한 번 꺼낼 때마다 10만 번 옮기는 셈이지요. <code>deque</code>(“데크”, double-ended queue)는 <b>양쪽 끝</b>에서 넣고 빼도록 만들어져 있어 <code>popleft()</code> 가 항상 빠릅니다.<br>반대로 <code>append()</code> 와 <code>pop()</code> (맨 뒤)은 리스트도 빠르므로, <b>스택은 리스트로 충분</b>하고 <b>큐는 deque</b> 를 쓰면 됩니다.' },
          { type: 'code', title: '추가 예제. 지금까지 배운 것 vs collections — 결과는 같다', code: `from collections import Counter, defaultdict

votes = ['철수', '영희', '철수', '민수', '영희', '철수']

# 배운 방법
count1 = {}
for name in votes :
    count1[name] = count1.get(name, 0) + 1

# collections
count2 = Counter(votes)

print(count1)
print(dict(count2))
print(count1 == count2)

words = ['apple', 'avocado', 'banana']
group1 = {}
for w in words :
    group1.setdefault(w[0], []).append(w)

group2 = defaultdict(list)
for w in words :
    group2[w[0]].append(w)

print(group1 == group2)`, expect: `{'철수': 3, '영희': 2, '민수': 1}
{'철수': 3, '영희': 2, '민수': 1}
True
True`, desc: '결과가 같으므로 <b>둘 다 옳습니다</b>. 다만 읽는 사람에게 “이 코드는 개수를 세는 코드”라는 의도가 <code>Counter</code> 쪽이 더 빨리 전달됩니다. 라이브러리를 쓰는 이유는 “편해서”만이 아니라 <b>의도가 드러나서</b>입니다.' }
        ],
        practice: [
          {
            title: '실습 7-23. 두 반의 공통 취미 찾기',
            level: 1,
            desc: '<p>1반과 2반 학생들의 취미 리스트가 있습니다(중복 있음). 세트를 사용해 ① 두 반 모두에 있는 취미, ② 1반에만 있는 취미, ③ 전체 취미 종류 수를 출력하세요. 출력 순서를 일정하게 하기 위해 <code>sorted()</code> 로 정렬해서 출력합니다.</p><pre>공통 취미 : [\'게임\', \'축구\']\n1반에만 : [\'독서\']\n전체 종류 : 5가지</pre>',
            hint: '<code>set(class1) &amp; set(class2)</code>, <code>set(class1) - set(class2)</code>, <code>len(set(class1) | set(class2))</code>',
            starter: `class1 = ['축구', '게임', '독서', '게임', '축구']
class2 = ['게임', '요리', '축구', '음악', '게임']

# TODO: 공통 취미, 1반에만 있는 취미, 전체 종류 수
`,
            solution: `class1 = ['축구', '게임', '독서', '게임', '축구']
class2 = ['게임', '요리', '축구', '음악', '게임']

s1 = set(class1)
s2 = set(class2)
print("공통 취미 :", sorted(s1 & s2))
print("1반에만 :", sorted(s1 - s2))
print("전체 종류 : %d가지" % len(s1 | s2))
`,
            expect: `공통 취미 : ['게임', '축구']
1반에만 : ['독서']
전체 종류 : 5가지`
          },
          {
            title: '실습 7-24. 컴프리헨션과 zip 으로 성적 처리',
            level: 2,
            desc: '<p>이름 리스트와 점수 리스트가 있습니다.</p><ol><li><code>zip()</code> 과 <code>dict()</code> 로 이름 : 점수 딕셔너리를 만들어 출력</li><li>컴프리헨션으로 <b>80점 이상인 학생의 이름</b> 리스트를 만들어 출력</li><li>컴프리헨션으로 모든 점수에 5점을 더한(최대 100점) 리스트를 만들어 출력</li></ol><pre>{\'가은\': 72, \'나래\': 95, \'다온\': 88, \'라희\': 60}\n80점 이상 : [\'나래\', \'다온\']\n보너스 후 : [77, 100, 93, 65]</pre>',
            hint: '<code>[n for n, s in zip(names, scores) if s >= 80]</code>, 최대 100점은 <code>min(s + 5, 100)</code>.',
            starter: `names = ['가은', '나래', '다온', '라희']
scores = [72, 95, 88, 60]

# TODO: 1. zip + dict
# TODO: 2. 80점 이상 이름 (컴프리헨션)
# TODO: 3. 보너스 5점, 최대 100 (컴프리헨션)
`,
            solution: `names = ['가은', '나래', '다온', '라희']
scores = [72, 95, 88, 60]

scoreDic = dict(zip(names, scores))
print(scoreDic)

good = [n for n, s in zip(names, scores) if s >= 80]
print("80점 이상 :", good)

bonus = [min(s + 5, 100) for s in scores]
print("보너스 후 :", bonus)
`,
            expect: `{'가은': 72, '나래': 95, '다온': 88, '라희': 60}
80점 이상 : ['나래', '다온']
보너스 후 : [77, 100, 93, 65]`
          },
          {
            title: '실습 7-25. 스택으로 되돌리기(Undo) 만들기',
            level: 3,
            desc: '<p>명령을 입력받아 스택으로 처리하세요.</p><ul><li><code>쓰기</code> : 글자를 입력받아 스택에 push 하고 현재 내용 출력</li><li><code>취소</code> : 마지막으로 쓴 글자를 pop 해서 “○ 취소” 출력 (스택이 비어 있으면 “취소할 내용이 없습니다.”)</li><li><code>끝</code> : 최종 내용을 이어 붙여 출력하고 종료</li></ul><pre>명령(쓰기/취소/끝) : 쓰기\n글자 : 안\n현재 : [\'안\']\n…\n최종 : 안녕</pre>',
            hint: '최종 내용은 <code>"".join(stack)</code> 또는 for 문으로 문자열을 이어 붙입니다. 빈 스택 검사는 <code>if len(stack) == 0 :</code>',
            starter: `stack = []

while True :
    cmd = input("명령(쓰기/취소/끝) : ")
    # TODO: 쓰기 / 취소 / 끝 처리
    break
`,
            solution: `stack = []

while True :
    cmd = input("명령(쓰기/취소/끝) : ")
    if cmd == '쓰기' :
        stack.append(input("글자 : "))
        print("현재 :", stack)
    elif cmd == '취소' :
        if len(stack) == 0 :
            print("취소할 내용이 없습니다.")
        else :
            print(stack.pop(), "취소")
    elif cmd == '끝' :
        break

result = ""
for ch in stack :
    result += ch
print("최종 :", result)
`,
            stdin: '취소\n쓰기\n안\n쓰기\n녕\n쓰기\n히\n취소\n끝\n',
            expect: `명령(쓰기/취소/끝) : 취소
취소할 내용이 없습니다.
명령(쓰기/취소/끝) : 쓰기
글자 : 안
현재 : ['안']
명령(쓰기/취소/끝) : 쓰기
글자 : 녕
현재 : ['안', '녕']
명령(쓰기/취소/끝) : 쓰기
글자 : 히
현재 : ['안', '녕', '히']
명령(쓰기/취소/끝) : 취소
히 취소
명령(쓰기/취소/끝) : 끝
최종 : 안녕`
          },
          {
            title: '실습 7-26. 장바구니 복사 — 참조 · 얕은 복사 · 깊은 복사',
            level: 1,
            desc: '<p>2차원 리스트로 된 장바구니를 세 가지 방법으로 “복사”한 뒤 원본을 바꿔 보세요. <b>실행하기 전에 결과를 먼저 종이에 적어 보는 것</b>이 이 문제의 핵심입니다.</p><ol><li><code>share = cart</code> (참조), <code>shallow = cart[:]</code> (얕은 복사), <code>deep = copy.deepcopy(cart)</code> (깊은 복사)</li><li>원본에서 <code>cart[0][1] = 10</code> (안쪽 값 변경)과 <code>cart.append([\'빵\', 3])</code> (바깥 리스트에 추가)를 실행</li><li>세 결과를 모두 출력하고, <code>is</code> 로 같은 객체인지 네 가지를 확인</li><li>마지막에 <b>원본을 완전히 지키려면 어떤 방법을 써야 하는지</b> 한 줄로 출력</li></ol><pre>share   : [[\'사과\', 10], [\'우유\', 1], [\'빵\', 3]]\nshallow : [[\'사과\', 10], [\'우유\', 1]]\ndeep    : [[\'사과\', 2], [\'우유\', 1]]\nTrue False True False</pre>',
            hint: '<code>[:]</code> 는 <b>바깥 리스트만</b> 새로 만들고 안쪽 리스트(행)는 그대로 공유합니다. 그래서 <code>shallow</code> 에는 <code>append</code> 의 영향은 없지만 <code>cart[0][1] = 10</code> 의 영향은 나타납니다.',
            starter: `import copy

cart = [['사과', 2], ['우유', 1]]
share = cart
shallow = cart[:]
deep = copy.deepcopy(cart)

# TODO: cart[0][1] 을 10 으로, cart 에 ['빵', 3] 추가

# TODO: share · shallow · deep 출력

# TODO: is 로 네 가지 비교, 결론 한 줄
`,
            solution: `import copy

cart = [['사과', 2], ['우유', 1]]
share = cart                  # 같은 객체 (복사가 아니다)
shallow = cart[:]             # 얕은 복사 (행은 공유)
deep = copy.deepcopy(cart)    # 깊은 복사 (행까지 새로)

cart[0][1] = 10
cart.append(['빵', 3])

print("share   :", share)
print("shallow :", shallow)
print("deep    :", deep)
print(share is cart, shallow is cart, shallow[0] is cart[0], deep[0] is cart[0])
print("원본을 완전히 지키려면 copy.deepcopy() 를 써야 한다")
`,
            expect: `share   : [['사과', 10], ['우유', 1], ['빵', 3]]
shallow : [['사과', 10], ['우유', 1]]
deep    : [['사과', 2], ['우유', 1]]
True False True False
원본을 완전히 지키려면 copy.deepcopy() 를 써야 한다`
          },
          {
            title: '실습 7-27. 단어 빈도 분석기 (Counter)',
            level: 2,
            desc: '<p>문장에 어떤 단어가 몇 번 나오는지 세는 프로그램을 만드세요.</p><ol><li><code>text.split()</code> 으로 단어 리스트를 만듭니다.</li><li><code>Counter</code> 로 세고 <code>most_common(3)</code> 으로 상위 3개를 출력합니다.</li><li><b>같은 결과를</b> <code>get(키, 0) + 1</code> 패턴으로 직접 만들어 보고, 두 결과가 같은지 <code>==</code> 로 확인합니다.</li><li>딱 한 번만 나온 단어 목록을 출력합니다.</li><li>전체 단어 수와 단어 종류 수를 출력합니다.</li></ol><pre>상위 3개 : [(\'사과\', 4), (\'배\', 2), (\'포도\', 2)]\n…\n전체 9단어, 종류 4가지</pre>',
            hint: '<code>from collections import Counter</code> 로 가져옵니다. <code>Counter</code> 도 딕셔너리라서 <code>dict(cnt)</code>, <code>cnt.items()</code>, <code>len(cnt)</code> 가 모두 됩니다.',
            starter: `from collections import Counter

text = '사과 배 사과 포도 배 사과 딸기 포도 사과'
words = text.split()

# TODO: Counter 로 세고 상위 3개

# TODO: get(키, 0) + 1 로 직접 세고 비교

# TODO: 한 번만 나온 단어

# TODO: 전체 단어 수 · 종류 수
`,
            solution: `from collections import Counter

text = '사과 배 사과 포도 배 사과 딸기 포도 사과'
words = text.split()

cnt = Counter(words)
print("상위 3개 :", cnt.most_common(3))

manual = {}
for w in words :
    manual[w] = manual.get(w, 0) + 1
print("직접 센 결과 :", manual)
print("같은가 :", dict(cnt) == manual)

once = []
for w, n in cnt.items() :
    if n == 1 :
        once.append(w)
print("한 번만 나온 단어 :", once)

print("전체 %d단어, 종류 %d가지" % (len(words), len(cnt)))
`,
            expect: `상위 3개 : [('사과', 4), ('배', 2), ('포도', 2)]
직접 센 결과 : {'사과': 4, '배': 2, '포도': 2, '딸기': 1}
같은가 : True
한 번만 나온 단어 : ['딸기']
전체 9단어, 종류 4가지`
          },
          {
            title: '🚀 프로젝트 2. 지하철 노선 탐색기 (인접 리스트 + BFS)',
            level: 3,
            desc: '<p>역 이름(키)과 <b>바로 이어진 역 목록</b>(값 리스트)으로 지하철 노선을 표현했습니다. 이런 구조를 <b>인접 리스트(adjacency list)</b> 라고 하며, 지도 · SNS 친구 관계 · 게임 맵 등에 그대로 쓰입니다.</p><p><b>요구 사항</b></p><ul><li><b>① 노선 요약</b> — 전체 역 수를 출력하고, 역을 <b>가나다 순</b>으로 돌며 <code>남영 : 2개 연결 → [\'서울역\', \'용산\']</code> 형식으로 출력</li><li><b>② 환승역 찾기</b> — 연결된 역이 <b>3개 이상</b>인 역 목록</li><li><b>③ 최단 경로</b> — <code>용산</code> 에서 <code>동대문</code> 까지 <b>가장 적은 정거장</b>으로 가는 경로를 찾아 <code>[\'용산\', …, \'동대문\'] (5정거장)</code> 형식으로 출력<br>방법(BFS): <code>deque</code> 에 출발역을 넣고, 꺼낸 역의 이웃 중 <b>처음 보는 역</b>만 큐에 넣으면서 <code>prev[다음역] = 현재역</code> 을 기록합니다. 도착하면 <code>prev</code> 를 거꾸로 따라가 경로를 만들고 <code>reverse()</code> 합니다.</li><li><b>④ N정거장 이내</b> — <code>시청</code> 에서 <b>2정거장 이내</b>에 갈 수 있는 역 목록(정렬)</li></ul><pre>전체 역 수 : 8\n남영 : 2개 연결 → [\'서울역\', \'용산\']\n…\n환승역 : [\'서울역\', \'을지로3가\']\n용산 → 동대문 최단 경로 : [\'용산\', \'남영\', \'서울역\', \'충정로\', \'을지로3가\', \'동대문\'] (5정거장)\n시청 에서 2정거장 이내 : [\'남영\', \'서울역\', \'을지로3가\', \'을지로입구\', \'충정로\']</pre><p>👉 <b>더 해 보기</b>: ① 출발 · 도착역을 <code>input()</code> 으로 받고 없는 역이면 안내하기 ② 경로를 <code>용산 → 남영 → 서울역</code> 처럼 화살표로 출력하기 ③ 노선을 추가해도 코드를 고치지 않아도 되는지 확인하기 ④ 두 역 사이에 경로가 <b>없을 때</b>(<code>prev</code> 에 도착역이 없을 때) 안내 출력하기 ⑤ 역 사이 <b>소요 시간</b>을 <code>{(\'시청\', \'서울역\'): 2}</code> 처럼 튜플 키 딕셔너리로 두고 가장 빠른 경로 찾기.</p>',
            hint: '<code>prev</code> 딕셔너리는 “이 역에 어디서 왔는지”를 기록하는 용도이자 <b>방문 표시</b> 역할도 합니다(<code>if nxt not in prev :</code>). 큐는 <code>from collections import deque</code> 의 <code>popleft()</code> 를 쓰세요 — 리스트의 <code>pop(0)</code> 도 되지만 느립니다. ④ 는 거리 딕셔너리 <code>dist[다음역] = dist[현재역] + 1</code> 로 같은 BFS 를 한 번 더 돌리면 됩니다.',
            starter: `from collections import deque

graph = {
    '시청': ['서울역', '을지로입구'],
    '서울역': ['시청', '남영', '충정로'],
    '을지로입구': ['시청', '을지로3가'],
    '남영': ['서울역', '용산'],
    '충정로': ['서울역', '을지로3가'],
    '을지로3가': ['을지로입구', '충정로', '동대문'],
    '용산': ['남영'],
    '동대문': ['을지로3가']
}

# TODO ① 전체 역 수와 역별 연결 (가나다 순)

# TODO ② 환승역(연결 3개 이상)

# TODO ③ 용산 → 동대문 최단 경로 (BFS + prev)

# TODO ④ 시청에서 2정거장 이내 역
`,
            solution: `from collections import deque

graph = {
    '시청': ['서울역', '을지로입구'],
    '서울역': ['시청', '남영', '충정로'],
    '을지로입구': ['시청', '을지로3가'],
    '남영': ['서울역', '용산'],
    '충정로': ['서울역', '을지로3가'],
    '을지로3가': ['을지로입구', '충정로', '동대문'],
    '용산': ['남영'],
    '동대문': ['을지로3가']
}

print("전체 역 수 :", len(graph))
for station in sorted(graph) :
    print("%s : %d개 연결 → %s" % (station, len(graph[station]), graph[station]))

transfer = []
for station in sorted(graph) :
    if len(graph[station]) >= 3 :
        transfer.append(station)
print("환승역 :", transfer)

start, goal = '용산', '동대문'
prev = {start : None}
queue = deque([start])
while len(queue) > 0 :
    cur = queue.popleft()
    if cur == goal :
        break
    for nxt in graph[cur] :
        if nxt not in prev :
            prev[nxt] = cur
            queue.append(nxt)

path = []
node = goal
while node is not None :
    path.append(node)
    node = prev[node]
path.reverse()
print("%s → %s 최단 경로 : %s (%d정거장)" % (start, goal, path, len(path) - 1))

start2 = '시청'
dist = {start2 : 0}
queue = deque([start2])
while len(queue) > 0 :
    cur = queue.popleft()
    for nxt in graph[cur] :
        if nxt not in dist :
            dist[nxt] = dist[cur] + 1
            queue.append(nxt)

near = []
for station in dist :
    if 0 < dist[station] <= 2 :
        near.append(station)
print("%s 에서 2정거장 이내 : %s" % (start2, sorted(near)))
`,
            expect: `전체 역 수 : 8
남영 : 2개 연결 → ['서울역', '용산']
동대문 : 1개 연결 → ['을지로3가']
서울역 : 3개 연결 → ['시청', '남영', '충정로']
시청 : 2개 연결 → ['서울역', '을지로입구']
용산 : 1개 연결 → ['남영']
을지로3가 : 3개 연결 → ['을지로입구', '충정로', '동대문']
을지로입구 : 2개 연결 → ['시청', '을지로3가']
충정로 : 2개 연결 → ['서울역', '을지로3가']
환승역 : ['서울역', '을지로3가']
용산 → 동대문 최단 경로 : ['용산', '남영', '서울역', '충정로', '을지로3가', '동대문'] (5정거장)
시청 에서 2정거장 이내 : ['남영', '서울역', '을지로3가', '을지로입구', '충정로']`
          }
        ],
        quiz: [
          { q: '<code>{1, 2, 3, 4} ^ {3, 4, 5}</code> 의 결과는?', options: ['<code>{3, 4}</code>', '<code>{1, 2}</code>', '<code>{1, 2, 5}</code>', '<code>{1, 2, 3, 4, 5}</code>'], answer: 2, explain: '대칭 차집합 = 한쪽에만 있는 값 → {1, 2, 5}' },
          { q: '<code>[n * 10 for n in range(1, 8) if n % 2 == 0]</code> 의 결과는?', options: ['<code>[10, 30, 50, 70]</code>', '<code>[20, 40, 60]</code>', '<code>[2, 4, 6]</code>', '<code>[20, 40, 60, 80]</code>'], answer: 1, explain: 'n = 2, 4, 6 (짝수) → 20, 40, 60' },
          { q: '다음 코드의 실행 결과는?<pre><code>a = [1, 2, 3]\nb = a\nb.append(4)\nprint(a)</code></pre>', options: ['<code>[1, 2, 3]</code>', '<code>[1, 2, 3, 4]</code>', '<code>[4]</code>', '오류'], answer: 1, explain: 'b = a 는 같은 리스트를 공유하므로 b 를 바꾸면 a 도 바뀝니다. 독립된 복사본은 <code>b = a[:]</code>.' },
          { q: '스택에 A, B, C 를 차례로 push 한 뒤 pop 을 두 번 하면 두 번째로 나오는 값은?', options: ['A', 'B', 'C', '오류'], answer: 1, explain: 'LIFO: 첫 pop → C, 두 번째 pop → B' },
          { q: '항목 10만 개 중에 어떤 값이 <b>들어 있는지</b>를 수천 번 확인해야 합니다. 가장 알맞은 자료형은?', options: ['리스트 — 순서가 있어 빠르다', '세트(또는 딕셔너리) — 해시로 바로 찾는다', '튜플 — 불변이라 빠르다', '2차원 리스트'], answer: 1, explain: '<code>값 in 리스트</code> 는 앞에서부터 하나씩 비교하지만, 세트 · 딕셔너리는 해시로 자리를 바로 계산해 항목 수와 거의 상관없이 빠릅니다. 다만 항목이 몇 개뿐이면 차이가 없습니다.' },
          { q: '<code>[\'짝\' if n % 2 == 0 else \'홀\' for n in [1, 2, 3]]</code> 의 결과는?', options: ["<code>['홀', '짝', '홀']</code>", "<code>['짝']</code>", "<code>[2]</code>", '오류'], answer: 0, explain: '<code>for</code> <b>앞</b>의 <code>if ~ else</code> 는 넣을 <b>값을 고르고</b>, <code>for</code> <b>뒤</b>의 <code>if</code> 는 항목을 <b>걸러 냅니다</b>. 여기서는 걸러 내지 않으므로 항목 수는 3개 그대로입니다.' }
        ],
        slides: [
          { layout: 'title', title: '심화: 세트 · 컴프리헨션 · zip · 복사 · 스택', subtitle: 'Section 06 — 리스트, 튜플, 딕셔너리의 심화 내용', badge: '07-6',
            notes: '<p><b>[도입 1분]</b> 오늘은 다섯 가지 도구를 빠르게 익힙니다. 각 주제마다 “언제 쓰나”를 먼저 말해 주세요.</p>' },
          { layout: 'code', repl: true, title: '세트: 중복 없는 모음', code: `mySet1 = {1, 2, 3, 3, 3, 4}
mySet1
salesList = ['삼각김밥', '바나나', '도시락', '삼각김밥', '삼각김밥', '도시락', '삼각김밥']
set(salesList)
len(set(salesList))`, points: ['키만 모아 놓은 딕셔너리', '<code>{ }</code> 에 : 없이 값만', '중복 자동 제거, 순서 없음'],
            notes: '<p><b>[4분]</b> 문자열 세트의 출력 순서는 실행마다 다를 수 있다는 점을 보여 줍니다(두 번 실행). 빈 세트는 set(), {} 는 빈 딕셔너리!</p>' },
          { layout: 'diagram', title: '집합 연산', html: SVG_SET, caption: '& 교집합 · | 합집합 · - 차집합 · ^ 대칭 차집합',
            notes: '<p><b>[2분]</b> 수학 시간의 벤 다이어그램과 연결합니다.</p>' },
          { layout: 'code', repl: true, title: '집합 연산 — 연산자와 함수', code: `mySet1 = {1, 2, 3, 4, 5}
mySet2 = {4, 5, 6, 7}
mySet1 & mySet2
mySet1 | mySet2
mySet1 - mySet2
mySet1 ^ mySet2
mySet1.intersection(mySet2)
mySet1.union(mySet2)
mySet1.difference(mySet2)
mySet1.symmetric_difference(mySet2)`, points: ['연산자 &amp;, |, -, ^', '함수 intersection · union', 'difference · symmetric_difference'],
            notes: '<p><b>[3분]</b> 질문: “mySet2 - mySet1 은?” → {6, 7}. 차집합은 순서가 중요.</p>' },
          { layout: 'two', title: '컴프리헨션', left: { title: '반복문', code: `numList = []
for num in range(1, 6) :
    numList.append(num)
print(numList)` }, right: { title: '컴프리헨션 (한 줄)', code: `numList = [num for num in range(1, 6)]
print(numList)` },
            notes: '<p><b>[3분]</b> 구성: <code>[수식 for 항목 in range() if 조건식]</code>. 왼쪽 코드의 어느 부분이 오른쪽 어디로 옮겨졌는지 색으로 짚어 줍니다.</p>' },
          { layout: 'code', repl: true, title: '컴프리헨션의 구성', code: `numList = [num * num for num in range(1, 6)]
numList
numList = [num for num in range(1, 21) if num % 3 == 0]
numList
prices = [1000, 2500, 3000]
[p * 2 for p in prices]`, points: ['<code>[수식 for 항목 in range() if 조건식]</code>', '수식: 들어갈 값', 'if: 걸러내기 (생략 가능)'],
            notes: '<p><b>[4분]</b> 마지막 줄은 7-2 교시 “리스트 * 2 는 반복” 문제의 해결책. 너무 복잡한 컴프리헨션은 오히려 읽기 어렵다는 점도 언급.</p>' },
          { layout: 'code', title: 'zip(): 여러 리스트 동시에', code: `foods = ['떡볶이', '짜장면', '라면', '피자', '맥주', '치킨', '삼겹살']
sides = ['오뎅', '단무지', '김치']
for food, side in zip(foods, sides) :
    print(food, ' --> ', side)

tupList = list(zip(foods, sides))
dic = dict(zip(foods, sides))
print(tupList)
print(dic)`, points: ['같은 위치끼리 짝짓기', '짧은 쪽에 맞춰 끝', 'list() → 튜플 리스트, dict() → 딕셔너리'],
            notes: '<p><b>[5분]</b> 지퍼 비유. [프로그램 2] 의 foods 딕셔너리를 두 리스트로부터 만들 수 있음을 연결합니다.</p>' },
          { layout: 'diagram', title: '리스트의 복사', html: SVG_COPY, caption: 'newList = oldList (공유) vs newList = oldList[:] (새 리스트)',
            notes: '<p><b>[3분]</b> 강의자료 용어: newList=oldList 를 “얕은 복사”, oldList[:] 를 “깊은 복사”라고 부릅니다. 공식 용어는 참조 / 얕은 복사 / 깊은 복사(copy.deepcopy)로 조금 다르니 학생 문서의 더 알아보기를 참고하게 하세요.</p>' },
          { layout: 'two', title: '= vs [:]', left: { title: 'newList = oldList', code: `oldList = ['짜장면', '탕수육', '군만두']
newList = oldList
oldList[0] = '짬뽕'
oldList.append('깐풍기')
print(newList)` }, right: { title: 'newList = oldList[:]', code: `oldList = ['짜장면', '탕수육', '군만두']
newList = oldList[:]
oldList[0] = '짬뽕'
oldList.append('깐풍기')
print(newList)` },
            notes: '<p><b>[4분]</b> 결과를 먼저 예측하게 한 뒤 두 코드를 실행. 7-3 교시 Code07-06 의 <code>list1 = []</code> vs <code>list1.clear()</code> 문제가 바로 이 원리였음을 연결합니다.</p>' },
          { layout: 'diagram', title: '리스트를 이용한 스택', html: SVG_STACK, caption: 'LIFO — push: append(), pop: pop(), top: 다음에 넣을 위치',
            notes: '<p><b>[4분]</b> 그림 7-9~7-13 의 흐름: 빈 주차장(top=0) → A 넣기(top=1) → B, C 넣기(top=3) → C 빼기(top=2). 생활 예: 접시 쌓기, 브라우저 뒤로 가기, Ctrl+Z.</p>' },
          { layout: 'code', repl: true, title: '주차장 스택', code: `parking = []
top = 0
parking.append('자동차A')
top += 1
parking.append('자동차B')
top += 1
parking.append('자동차C')
top += 1
parking, top
top -= 1
outCar = parking.pop()
print(outCar)
parking, top`, points: ['push: append() + top += 1', 'pop: top -= 1 + pop()', '마지막에 넣은 C 가 먼저'],
            notes: '<p><b>[4분]</b> Tip: 큐(Queue)는 양쪽이 뚫린 파이프 — 먼저 들어간 것이 먼저(FIFO). 리스트로는 append + pop(0).</p>' },
          { layout: 'table', title: '📘 자료형 고르기 — “무엇을 자주 하게 될까?”', head: ['하고 싶은 일', '알맞은 자료형', '이유'], rows: [
            ['순서대로 쌓고 꺼내기', '리스트 [ ]', '순서 · 중복 · 첨자 접근'],
            ['들어 있는지 자주 확인 · 중복 제거', '세트 set()', '검색이 아주 빠름'],
            ['이름표로 찾기 · 개수 세기', '딕셔너리 {키:값}', '키 검색이 아주 빠름'],
            ['바뀌면 안 되는 한 덩어리 · 키로 쓸 값', '튜플 ( )', '불변 → 안전 · 키 가능'],
            ['앞뒤로 넣고 빼기(큐)', 'collections.deque', '양쪽 끝이 빠름']
          ], lead: '10만 개에서 in 검색: 리스트는 하나씩 비교, 세트는 해시로 한 번에',
            notes: '<p><b>[4분]</b> 학생 문서의 “얼마나 차이 날까?” 예제를 교사 화면에서 실제로 실행해 보여 주세요(수백 배 차이). 숫자보다 <b>규모</b>를 보게 합니다.</p><p>단, 항목이 열 개 남짓이면 차이가 없다는 점도 꼭 말해 주세요 — 무조건 세트가 정답은 아닙니다. 이 표가 7장 전체의 결론입니다.</p>' },
          { layout: 'code', title: '📘 collections — 직접 만든 패턴의 완성형', code: `from collections import Counter, defaultdict, deque

votes = ['철수', '영희', '철수', '민수', '영희', '철수']
print(Counter(votes))
print(Counter(votes).most_common(2))

group = defaultdict(list)
for w in ['apple', 'avocado', 'banana'] :
    group[w[0]].append(w)
print(dict(group))

queue = deque(['민수', '지아'])
queue.append('도윤')
print(queue.popleft(), queue)`, points: ['<code>Counter</code> ← <code>get(k, 0) + 1</code>', '<code>defaultdict(list)</code> ← <code>setdefault(k, [])</code>', '<code>deque.popleft()</code> ← 느린 <code>pop(0)</code>', '<code>namedtuple</code> ← <code>t[0]</code> 대신 <code>p.x</code>'],
            notes: '<p><b>[5분]</b> 순서가 중요합니다 — <b>직접 만들어 본 다음에</b> 소개해야 “무엇을 대신해 주는지” 알 수 있습니다.</p><p><code>pop(0)</code> 이 느린 이유: 뒤 항목을 전부 한 칸씩 당겨야 함. 그래서 <b>스택은 리스트, 큐는 deque</b>.</p><p>실습 7-27(단어 빈도)과 🚀 프로젝트 2(지하철 BFS)에서 바로 씁니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>a = [1, 2, 3]; b = a; b.append(4)</code> 후 <code>print(a)</code> 는?', options: ['[1, 2, 3]', '[1, 2, 3, 4]', '[4]', '오류'], answer: 1, explain: 'b 와 a 는 같은 리스트',
            notes: '<p><b>[1분]</b> b = a[:] 였다면? → [1, 2, 3].</p>' },
          { layout: 'practice', title: '실습 7-24. 컴프리헨션과 zip', desc: 'zip + dict 로 딕셔너리, 컴프리헨션으로 80점 이상 이름 · 보너스 점수 리스트를 만드세요.', starter: `names = ['가은', '나래', '다온', '라희']
scores = [72, 95, 88, 60]
# TODO`, solution: `names = ['가은', '나래', '다온', '라희']
scores = [72, 95, 88, 60]
print(dict(zip(names, scores)))
print("80점 이상 :", [n for n, s in zip(names, scores) if s >= 80])
print("보너스 후 :", [min(s + 5, 100) for s in scores])`,
            notes: '<p><b>[5분]</b> 빨리 끝낸 학생은 실습 7-25(스택 Undo)나 🚀 프로젝트 2(지하철 노선)에 도전.</p>' },
          { layout: 'summary', title: '정리', bullets: ['세트 <code>{1, 2, 3}</code>: 중복 없음 · 순서 없음, &amp; | - ^ · <code>add</code> · <code>discard</code>', '컴프리헨션 <code>[수식 for 항목 in … if 조건]</code> — 리스트 · 딕셔너리 · 집합 · 2차원', '<code>zip()</code>: 같은 위치끼리 짝, <code>dict(zip(a, b))</code>, <code>zip(*표)</code> 전치', '참조 <code>new = old</code> · 얕은 복사 <code>old[:]</code> · 깊은 복사 <code>copy.deepcopy()</code>', '스택(LIFO)은 리스트 <code>append</code> · <code>pop</code>, 큐(FIFO)는 <code>deque.popleft()</code>', '📘 <code>Counter</code> · <code>defaultdict</code> · <code>deque</code> · <code>namedtuple</code> · <b>in 검색은 세트가 빠르다</b>'],
            notes: '<p><b>[2분]</b> 7장 전체 정리: 리스트 [ ] · 튜플 ( ) · 딕셔너리 {키:값} · 세트 { }. 다음 장: 문자열.</p>' }
        ]
      }
    ]
  });
})();
