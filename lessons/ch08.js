/* Chapter 08. 문자열 (파이썬 for Beginner 3판 Ch08) */
(function () {
  /* ---------- SVG 도우미 ---------- */
  const MONO = "font-family:Consolas,'D2Coding',monospace";
  const box = (x, y, w, h, txt, o = {}) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx || 4}" fill="${o.fill || 'var(--card)'}" stroke="${o.stroke || 'var(--accent)'}" stroke-width="${o.sw || 3}"${o.dash ? ' stroke-dasharray="10 7"' : ''}/>` +
    (txt !== '' ? `<text x="${x + w / 2}" y="${y + h / 2 + (o.fs || 26) * 0.35}" text-anchor="middle" style="${MONO};font-size:${o.fs || 26}px;fill:${o.color || 'var(--fg)'};${o.bold ? 'font-weight:700' : ''}">${txt}</text>` : '');
  const label = (x, y, txt, o = {}) =>
    `<text x="${x}" y="${y}" text-anchor="${o.anchor || 'middle'}" style="${o.mono ? MONO + ';' : ''}font-size:${o.fs || 22}px;fill:${o.color || 'var(--muted)'};${o.bold ? 'font-weight:700' : ''}">${txt}</text>`;
  const arrowDefs = (id, color) => `<marker id="${id}" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="${color}"/></marker>`;
  const arrow = (x1, y1, x2, y2, id, color, sw = 4) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${sw}" marker-end="url(#${id})"/>`;
  /* 글자 칸 한 줄: str 을 cw 폭의 칸으로 그림 */
  const cells = (x, y, str, cw, o = {}) => Array.from(str).map((ch, i) =>
    box(x + i * cw, y, cw, o.h || 70, ch === ' ' ? '␣' : ch, {
      fs: o.fs || 32, stroke: o.strokeFn ? o.strokeFn(i, ch) : (o.stroke || 'var(--accent)'),
      color: ch === ' ' ? 'var(--muted)' : (o.colorFn ? o.colorFn(i, ch) : 'var(--fg)'), fill: o.fillFn ? o.fillFn(i, ch) : undefined
    })).join('');
  const idxRow = (x, y, n, cw, o = {}) => Array.from({ length: n }, (_, i) =>
    label(x + i * cw + cw / 2, y, String(o.neg ? i - n : i), { mono: true, fs: o.fs || 22, color: o.color || 'var(--accent)' })).join('');

  /* 1. 이 장에서 만들 프로그램 미리보기 */
  const RND_CH = [['이', 190, 150, 44, '#d0406a'], ['썬', 330, 180, 30, '#2a9d8f'], ['파', 460, 300, 56, '#6b3e26'], ['k', 250, 250, 24, '#2b4acb'],
    ['열', 110, 150, 22, '#c06030'], ['공', 420, 440, 40, '#2a8f5f'], ['b', 280, 330, 34, '#2ab0c0'], ['하', 360, 360, 24, '#5040a0'],
    ['심', 190, 430, 30, '#20a0a0'], ['히', 250, 470, 48, '#335533'], ['o', 320, 400, 22, '#6040b0'], ['부', 470, 170, 38, '#a050b0']];
  const SVG_PREVIEW = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="이 장에서 만들 두 프로그램의 실행 화면">
  ${label(320, 44, '[프로그램 1] 입력된 문자열 거꾸로 출력', { fs: 26, bold: true, color: 'var(--fg)' })}
  <rect x="40" y="80" width="560" height="260" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <rect x="40" y="80" width="560" height="40" rx="10" fill="var(--line)"/>
  ${label(70, 108, '콘솔', { fs: 20, anchor: 'start', color: 'var(--fg)' })}
  ${label(60, 170, '문자열을 입력하세요 : ', { fs: 20, anchor: 'start', color: 'var(--fg)' })}
  ${label(282, 170, '즐거운 Python 프로그래밍~~~', { fs: 20, anchor: 'start', color: 'var(--danger)' })}
  ${label(60, 215, '내용을 거꾸로 출력 --&gt; ~~~밍래그로프 nohtyP 운거즐', { fs: 20, anchor: 'start', color: 'var(--fg)' })}
  ${label(60, 270, '&gt;&gt;&gt;', { fs: 20, anchor: 'start', mono: true, color: 'var(--accent)' })}
  ${label(320, 385, '문자열의 끝 글자부터 첫 글자까지 하나씩 이어 붙인다', { fs: 20 })}
  ${label(320, 420, '→ 인덱스 · len() · for 문 · 문자열 더하기', { fs: 20, color: 'var(--accent)' })}
  ${label(960, 44, '[프로그램 2] 임의의 위치에 글자를 쓰는 거북이', { fs: 26, bold: true, color: 'var(--fg)' })}
  <g transform="translate(700,60)">
    <rect x="0" y="20" width="540" height="470" rx="10" fill="#ffffff" stroke="var(--line)" stroke-width="2"/>
    <rect x="0" y="20" width="540" height="36" rx="10" fill="var(--line)"/>
    <text x="20" y="45" style="font-size:18px;fill:var(--fg)">거북이 글자쓰기</text>
    ${RND_CH.map(([c, x, y, s, col]) => `<text x="${x}" y="${y}" style="font-size:${s}px;font-weight:700;fill:${col}">${c}</text>`).join('')}
    <path d="M270,290 l14,-7 l-4,7 l4,7 z" fill="#222"/>
    <rect x="-10" y="380" width="200" height="90" rx="6" fill="var(--card)" stroke="var(--accent2)" stroke-width="2"/>
    <text x="0" y="408" style="font-size:16px;fill:var(--fg)">거북이 쓸 문자열을 입력</text>
    <rect x="0" y="420" width="180" height="30" fill="#fff" stroke="var(--line)"/>
    <text x="6" y="441" style="font-size:14px;fill:#333">IT Cookbook, 파이썬을…</text>
  </g>
</svg>`;

  /* 2. 인덱스 */
  const SVG_INDEX = `<svg viewBox="0 0 1280 470" width="100%" role="img" aria-label="문자열의 양수 인덱스와 음수 인덱스">
  ${label(640, 46, 'ss = "파이썬최고"   →  글자 5개가 순서대로 늘어선 시퀀스(sequence)', { fs: 26, color: 'var(--fg)' })}
  ${label(250, 128, '양수 인덱스', { fs: 22, anchor: 'end', color: 'var(--accent)', bold: true })}
  ${idxRow(340, 128, 5, 120, { fs: 26 })}
  ${cells(340, 150, '파이썬최고', 120, { h: 100, fs: 48 })}
  ${idxRow(340, 290, 5, 120, { neg: true, fs: 26, color: 'var(--accent2)' })}
  ${label(250, 290, '음수 인덱스', { fs: 22, anchor: 'end', color: 'var(--accent2)', bold: true })}
  <rect x="120" y="330" width="1040" height="120" rx="12" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  ${label(160, 372, 'ss[0] → \'파\'      ss[2] → \'썬\'      ss[-1] → \'고\' (마지막 글자)', { fs: 24, mono: true, anchor: 'start', color: 'var(--fg)' })}
  ${label(160, 420, 'len(ss) = 5  →  인덱스는 0 ~ 4,  ss[5] 는 IndexError', { fs: 24, mono: true, anchor: 'start', color: 'var(--danger)' })}
</svg>`;

  /* 3. 슬라이싱 */
  const SVG_SLICE = `<svg viewBox="0 0 1280 520" width="100%" role="img" aria-label="문자열 슬라이싱: 칸 사이의 경계 번호">
  ${label(640, 44, '슬라이싱 ss[시작:끝]  →  시작 번호 이상, 끝 번호 미만 (끝은 포함하지 않음)', { fs: 26, color: 'var(--fg)' })}
  ${cells(340, 150, '파이썬최고', 120, { h: 100, fs: 48, strokeFn: (i) => (i >= 1 && i < 3 ? 'var(--warn)' : i >= 3 ? 'var(--ok)' : 'var(--accent)') })}
  ${[0, 1, 2, 3, 4, 5].map((i) => `<line x1="${340 + i * 120}" y1="120" x2="${340 + i * 120}" y2="280" stroke="var(--muted)" stroke-width="2" stroke-dasharray="6 6"/>` + label(340 + i * 120, 110, String(i), { mono: true, fs: 26, color: 'var(--accent)', bold: true })).join('')}
  ${label(200, 110, '경계 번호', { fs: 20, anchor: 'end', color: 'var(--accent)' })}
  <path d="M462,290 v18 h236 v-18" fill="none" stroke="var(--warn)" stroke-width="4"/>
  ${label(580, 340, 'ss[1:3] → \'이썬\'', { fs: 26, mono: true, color: 'var(--warn)', bold: true })}
  <path d="M702,290 v18 h236 v-18" fill="none" stroke="var(--ok)" stroke-width="4"/>
  ${label(820, 340, 'ss[3:] → \'최고\'', { fs: 26, mono: true, color: 'var(--ok)', bold: true })}
  <rect x="120" y="380" width="1040" height="125" rx="12" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  ${label(160, 420, 'ss[:2] → \'파이\'    ss[-2:] → \'최고\'    ss[:] → \'파이썬최고\' (전체 복사)', { fs: 23, mono: true, anchor: 'start', color: 'var(--fg)' })}
  ${label(160, 470, 'ss[::2] → \'파썬고\' (2칸씩)    ss[::-1] → \'고최썬이파\' (거꾸로)', { fs: 23, mono: true, anchor: 'start', color: 'var(--fg)' })}
</svg>`;

  /* 4. 거꾸로 출력 원리 */
  const SVG_REVERSE = `<svg viewBox="0 0 1280 540" width="100%" role="img" aria-label="문자열을 거꾸로 이어 붙이는 원리">
  <defs>${arrowDefs('ah8r', 'var(--accent2)')}</defs>
  ${label(640, 40, 'inStr = "Python",  count = len(inStr) = 6', { fs: 26, mono: true, color: 'var(--fg)' })}
  ${label(230, 138, 'inStr', { fs: 26, mono: true, anchor: 'end', color: 'var(--fg)' })}
  ${idxRow(290, 88, 6, 110, { fs: 22 })}
  ${cells(290, 98, 'Python', 110, { h: 64, fs: 34 })}
  ${label(230, 418, 'outStr', { fs: 26, mono: true, anchor: 'end', color: 'var(--fg)' })}
  ${cells(290, 378, 'nohtyP', 110, { h: 64, fs: 34, stroke: 'var(--accent2)' })}
  ${idxRow(290, 470, 6, 110, { fs: 20, color: 'var(--accent2)' })}
  ${[0, 1, 2, 3, 4, 5].map((i) => arrow(290 + (5 - i) * 110 + 55, 166, 290 + i * 110 + 55, 372, 'ah8r', 'var(--accent2)', 3)).join('')}
  ${label(1000, 220, 'i = 0 → inStr[6-1] = \'n\'', { fs: 20, mono: true, anchor: 'start', color: 'var(--fg)' })}
  ${label(1000, 252, 'i = 1 → inStr[6-2] = \'o\'', { fs: 20, mono: true, anchor: 'start', color: 'var(--fg)' })}
  ${label(1000, 284, 'i = 2 → inStr[6-3] = \'h\'', { fs: 20, mono: true, anchor: 'start', color: 'var(--fg)' })}
  ${label(1000, 316, '   …', { fs: 20, mono: true, anchor: 'start', color: 'var(--fg)' })}
  ${label(1000, 348, 'i = 5 → inStr[6-6] = \'P\'', { fs: 20, mono: true, anchor: 'start', color: 'var(--fg)' })}
  ${label(640, 525, 'outStr += inStr[count - (i + 1)]  —  뒤에서부터 한 글자씩 꺼내 outStr 뒤에 붙인다', { fs: 22, color: 'var(--accent2)' })}
</svg>`;

  /* 5. 불변성 */
  const SVG_IMMUTABLE = `<svg viewBox="0 0 1280 500" width="100%" role="img" aria-label="문자열은 바꿀 수 없다: 새 문자열을 만들어 다시 대입">
  <defs>${arrowDefs('ah8i', 'var(--accent)')}${arrowDefs('ah8j', 'var(--ok)')}</defs>
  ${label(320, 44, '✗ 글자 하나만 바꾸기', { fs: 26, bold: true, color: 'var(--danger)' })}
  ${box(60, 110, 110, 64, 'ss', { stroke: 'var(--accent)', fs: 28 })}
  ${arrow(172, 142, 236, 142, 'ah8i', 'var(--accent)')}
  ${cells(244, 110, '파이썬', 100, { h: 64, fs: 34, strokeFn: (i) => (i === 0 ? 'var(--danger)' : 'var(--accent)') })}
  ${label(294, 230, 'ss[0] = \'X\'', { fs: 26, mono: true, color: 'var(--danger)' })}
  <line x1="220" y1="205" x2="370" y2="245" stroke="var(--danger)" stroke-width="5"/>
  <line x1="370" y1="205" x2="220" y2="245" stroke="var(--danger)" stroke-width="5"/>
  ${label(320, 300, 'TypeError: \'str\' object does not', { fs: 20, mono: true, color: 'var(--danger)' })}
  ${label(320, 326, 'support item assignment', { fs: 20, mono: true, color: 'var(--danger)' })}
  ${label(320, 390, '문자열은 한 번 만들어지면', { fs: 22, color: 'var(--fg)' })}
  ${label(320, 422, '내용을 바꿀 수 없다 (immutable)', { fs: 22, color: 'var(--fg)', bold: true })}
  <line x1="640" y1="70" x2="640" y2="470" stroke="var(--line)" stroke-width="2" stroke-dasharray="8 8"/>
  ${label(960, 44, '✓ 새 문자열을 만들어 다시 대입', { fs: 26, bold: true, color: 'var(--ok)' })}
  ${label(960, 96, 'ss = \'X\' + ss[1:]', { fs: 26, mono: true, color: 'var(--fg)' })}
  ${box(690, 150, 110, 64, 'ss', { stroke: 'var(--accent)', fs: 28 })}
  ${cells(900, 130, '파이썬', 90, { h: 56, fs: 30, stroke: 'var(--line)', colorFn: () => 'var(--muted)' })}
  ${label(1035, 215, '원래 문자열 (그대로 남아 있음)', { fs: 18 })}
  ${cells(900, 260, 'X이썬', 90, { h: 56, fs: 30, stroke: 'var(--ok)' })}
  ${label(1035, 345, '새로 만든 문자열', { fs: 18, color: 'var(--ok)' })}
  <line x1="802" y1="170" x2="892" y2="158" stroke="var(--muted)" stroke-width="3" stroke-dasharray="6 6"/>
  ${arrow(802, 196, 890, 280, 'ah8j', 'var(--ok)')}
  ${label(960, 405, '변수 ss 가 새 문자열을 가리키게 될 뿐,', { fs: 22, color: 'var(--fg)' })}
  ${label(960, 437, '원래 문자열이 바뀐 것은 아니다', { fs: 22, color: 'var(--fg)' })}
</svg>`;

  /* 6. 함수와 메서드 */
  const SVG_METHOD = `<svg viewBox="0 0 1280 420" width="100%" role="img" aria-label="함수와 메서드의 호출 형식 비교">
  ${label(320, 50, '함수(function) — 단독으로 사용', { fs: 26, bold: true, color: 'var(--accent)' })}
  <text x="320" y="170" text-anchor="middle" style="${MONO};font-size:56px;fill:var(--fg)"><tspan fill="var(--accent)">len</tspan>(<tspan fill="var(--warn)">ss</tspan>)</text>
  ${label(215, 215, '함수 이름', { fs: 20, color: 'var(--accent)' })}${label(400, 215, '대상은 괄호 안에', { fs: 20, color: 'var(--warn)' })}
  ${label(320, 290, 'len(), print(), input(), int(), str()', { fs: 22, mono: true })}
  ${label(320, 330, 'map(), list() …', { fs: 22, mono: true })}
  <line x1="640" y1="30" x2="640" y2="390" stroke="var(--line)" stroke-width="2" stroke-dasharray="8 8"/>
  ${label(960, 50, '메서드(method) — 변수명.메서드()', { fs: 26, bold: true, color: 'var(--accent2)' })}
  <text x="960" y="170" text-anchor="middle" style="${MONO};font-size:56px;fill:var(--fg)"><tspan fill="var(--warn)">ss</tspan>.<tspan fill="var(--accent2)">upper</tspan>()</text>
  ${label(835, 215, '대상(문자열)', { fs: 20, color: 'var(--warn)' })}${label(1010, 215, '문자열에 들어 있는 기능', { fs: 20, color: 'var(--accent2)' })}
  ${label(960, 290, 'upper(), find(), split(), replace()', { fs: 22, mono: true })}
  ${label(960, 330, 'strip(), join(), isdigit() …', { fs: 22, mono: true })}
  ${label(640, 400, '지금은 “둘 다 뒤에 괄호가 붙는다” 정도로 알고, 이 장에서는 모두 “문자열 함수”라고 부른다', { fs: 20, color: 'var(--fg)' })}
</svg>`;

  /* 7. find / rfind / index */
  const SVG_FIND = `<svg viewBox="0 0 1280 470" width="100%" role="img" aria-label="find, rfind, index 의 차이">
  <defs>${arrowDefs('ah8f', 'var(--accent)')}${arrowDefs('ah8g', 'var(--accent2)')}</defs>
  ${label(640, 44, 's = "공부하고 또 공부"   —  \'공부\' 는 어디에 있을까?', { fs: 26, color: 'var(--fg)' })}
  ${idxRow(190, 100, 9, 100, { fs: 22 })}
  ${cells(190, 112, '공부하고 또 공부', 100, { h: 76, fs: 36, strokeFn: (i) => (i < 2 ? 'var(--accent)' : i >= 7 ? 'var(--accent2)' : 'var(--line)') })}
  ${arrow(290, 280, 290, 196, 'ah8f', 'var(--accent)')}
  ${label(290, 310, 's.find(\'공부\') → 0', { fs: 22, mono: true, color: 'var(--accent)' })}
  ${label(290, 340, '왼쪽(앞)부터 찾기', { fs: 18 })}
  ${arrow(990, 280, 990, 196, 'ah8g', 'var(--accent2)')}
  ${label(990, 310, 's.rfind(\'공부\') → 7', { fs: 22, mono: true, color: 'var(--accent2)' })}
  ${label(990, 340, '오른쪽(뒤)부터 찾기', { fs: 18 })}
  ${label(640, 250, 's.count(\'공부\') → 2', { fs: 24, mono: true, color: 'var(--fg)' })}
  <rect x="100" y="370" width="1080" height="90" rx="12" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  ${label(140, 405, '없는 글자:  s.find(\'없다\') → -1     s.index(\'없다\') → ValueError 오류!', { fs: 22, mono: true, anchor: 'start', color: 'var(--danger)' })}
  ${label(140, 443, '찾는 위치 지정:  s.find(\'공부\', 3) → 7  (3번 칸부터 찾기 시작)', { fs: 22, mono: true, anchor: 'start', color: 'var(--fg)' })}
</svg>`;

  /* 8. strip */
  const SVG_STRIP = `<svg viewBox="0 0 1280 440" width="100%" role="img" aria-label="strip 은 앞뒤에서만 지운다">
  ${label(640, 44, 'strip() 은 양 끝에서 안쪽으로 지워 나가다가, 지울 글자가 아닌 글자를 만나면 멈춘다', { fs: 24, color: 'var(--fg)' })}
  ${label(120, 140, 'ss', { fs: 26, mono: true, anchor: 'end', color: 'var(--fg)' })}
  ${cells(140, 100, '--파--이--썬--', 72, { h: 64, fs: 30, strokeFn: (i) => (i < 2 || i > 10 ? 'var(--danger)' : 'var(--accent)'), fillFn: (i) => (i < 2 || i > 10 ? 'none' : undefined), colorFn: (i) => (i < 2 || i > 10 ? 'var(--danger)' : 'var(--fg)') })}
  ${label(212, 200, '지움', { fs: 20, color: 'var(--danger)' })}${label(1004, 200, '지움', { fs: 20, color: 'var(--danger)' })}
  ${label(608, 200, '가운데의 - 는 그대로', { fs: 20, color: 'var(--accent)' })}
  ${label(120, 280, '결과', { fs: 24, anchor: 'end', color: 'var(--fg)' })}
  ${cells(284, 240, '파--이--썬', 72, { h: 64, fs: 30, stroke: 'var(--ok)' })}
  <rect x="100" y="340" width="1080" height="84" rx="12" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  ${label(140, 375, 'strip() 양쪽 · lstrip() 왼쪽(left)만 · rstrip() 오른쪽(right)만', { fs: 22, anchor: 'start', color: 'var(--fg)' })}
  ${label(140, 408, '괄호가 비어 있으면 공백(스페이스 · 탭 · 줄바꿈)을 지운다', { fs: 22, anchor: 'start' })}
</svg>`;

  /* 9. split / join */
  const SVG_SPLIT = `<svg viewBox="0 0 1280 470" width="100%" role="img" aria-label="split 으로 나누고 join 으로 합치기">
  <defs>${arrowDefs('ah8s', 'var(--accent)')}${arrowDefs('ah8t', 'var(--accent2)')}</defs>
  ${label(170, 95, '문자열', { fs: 22, bold: true, color: 'var(--fg)' })}
  ${box(60, 115, 220, 70, '\'하나:둘:셋\'', { fs: 26 })}
  ${arrow(284, 150, 470, 150, 'ah8s', 'var(--accent)')}
  ${label(377, 130, 'split(\':\')', { fs: 22, mono: true, color: 'var(--accent)' })}
  ${label(760, 95, '리스트', { fs: 22, bold: true, color: 'var(--fg)' })}
  <rect x="480" y="105" width="560" height="90" rx="12" fill="none" stroke="var(--accent)" stroke-width="3"/>
  ${box(500, 120, 150, 60, '\'하나\'', { fs: 26, stroke: 'var(--warn)' })}${box(680, 120, 150, 60, '\'둘\'', { fs: 26, stroke: 'var(--warn)' })}${box(860, 120, 150, 60, '\'셋\'', { fs: 26, stroke: 'var(--warn)' })}
  ${label(760, 225, '구분자 \':\' 는 사라지고 조각만 남는다', { fs: 20 })}
  ${arrow(760, 240, 760, 300, 'ah8t', 'var(--accent2)')}
  ${label(1000, 280, '\'-\'.join(리스트)', { fs: 22, mono: true, color: 'var(--accent2)' })}
  ${box(610, 310, 300, 70, '\'하나-둘-셋\'', { fs: 26, stroke: 'var(--accent2)' })}
  ${label(760, 415, '조각 사이사이에 \'-\' 를 끼워 넣어 하나의 문자열로', { fs: 20 })}
  ${label(170, 300, '반대 방향', { fs: 22, color: 'var(--fg)', bold: true })}
  ${label(170, 335, 'split : 문자열 → 리스트', { fs: 20, color: 'var(--accent)' })}
  ${label(170, 368, 'join : 리스트 → 문자열', { fs: 20, color: 'var(--accent2)' })}
</svg>`;

  /* 10. 정렬 · 채우기 */
  const alignRow = (y, name, str) => label(420, y + 42, name, { fs: 24, mono: true, anchor: 'end', color: 'var(--fg)' }) +
    Array.from(str).map((ch, i) => box(450 + i * 70, y, 70, 60, ch === ' ' ? '' : ch, {
      fs: 30, stroke: ch === ' ' ? 'var(--line)' : (/[0\-]/.test(ch) ? 'var(--warn)' : 'var(--accent)'), fill: ch === ' ' ? 'none' : undefined
    })).join('');
  const SVG_ALIGN = `<svg viewBox="0 0 1280 520" width="100%" role="img" aria-label="center, ljust, rjust, zfill 로 폭 10에 맞추기">
  ${label(640, 40, 'ss = \'파이썬\'  (3글자)  →  폭 10칸에 맞춰 배치하기', { fs: 26, color: 'var(--fg)' })}
  ${idxRow(450, 78, 10, 70, { fs: 18, color: 'var(--muted)' })}
  ${alignRow(90, 'ss.center(10)', '   파이썬    ')}
  ${alignRow(170, 'ss.center(10, \'-\')', '---파이썬----')}
  ${alignRow(250, 'ss.ljust(10)', '파이썬       ')}
  ${alignRow(330, 'ss.rjust(10)', '       파이썬')}
  ${alignRow(410, 'ss.zfill(10)', '0000000파이썬')}
  ${label(640, 505, '빈칸 7개를 어디에 둘까?  center: 왼쪽 3 · 오른쪽 4 / ljust: 오른쪽 / rjust · zfill: 왼쪽', { fs: 20 })}
</svg>`;

  /* 11. 거북이 좌표 범위 */
  const SVG_CANVAS = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="거북이 화면 좌표와 임의의 위치 범위">
  <defs>${arrowDefs('ah8c', 'var(--muted)')}</defs>
  <rect x="120" y="60" width="440" height="440" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <rect x="170" y="110" width="340" height="340" fill="none" stroke="var(--accent)" stroke-width="3" stroke-dasharray="10 7"/>
  ${arrow(120, 280, 570, 280, 'ah8c', 'var(--muted)', 2)}${arrow(340, 500, 340, 50, 'ah8c', 'var(--muted)', 2)}
  ${label(350, 272, '(0, 0)', { fs: 18, anchor: 'start', mono: true })}
  ${label(170, 474, '-150', { fs: 18, mono: true, color: 'var(--accent)' })}${label(510, 474, '150', { fs: 18, mono: true, color: 'var(--accent)' })}
  ${label(360, 116, '150', { fs: 18, mono: true, color: 'var(--accent)', anchor: 'start' })}${label(360, 446, '-150', { fs: 18, mono: true, color: 'var(--accent)', anchor: 'start' })}
  ${label(340, 40, '창 크기 350×350 · 글자 범위 300×300', { fs: 20, color: 'var(--fg)' })}
  <text x="220" y="190" style="font-size:40px;font-weight:700;fill:#d0406a">파</text>
  <text x="420" y="230" style="font-size:24px;font-weight:700;fill:#2a9d8f">이</text>
  <text x="250" y="400" style="font-size:32px;font-weight:700;fill:#5040a0">썬</text>
  ${label(640, 120, '각 글자마다 네 가지를 무작위로 정한다', { fs: 24, anchor: 'start', color: 'var(--fg)', bold: true })}
  ${label(640, 180, 'tX = randrange(-150, 150)', { fs: 22, anchor: 'start', mono: true, color: 'var(--accent)' })}
  ${label(640, 220, 'tY = randrange(-150, 150)', { fs: 22, anchor: 'start', mono: true, color: 'var(--accent)' })}
  ${label(640, 280, 'r, g, b = random() × 3  (0.0 ~ 1.0)', { fs: 22, anchor: 'start', mono: true, color: 'var(--warn)' })}
  ${label(640, 340, 'txtSize = randrange(10, 50)', { fs: 22, anchor: 'start', mono: true, color: 'var(--ok)' })}
  ${label(640, 410, 'goto(tX, tY) → pencolor((r, g, b))', { fs: 22, anchor: 'start', mono: true, color: 'var(--fg)' })}
  ${label(640, 450, '→ write(ch, font=(글꼴, txtSize, \'bold\'))', { fs: 22, anchor: 'start', mono: true, color: 'var(--fg)' })}
</svg>`;

  /* ---------- 공통 코드 ---------- */
  const CODE_0802 = `## 변수 선언 부분 ##
inStr, outStr = "", ""
count, i = 0, 0

## 메인 코드 부분 ##
inStr = input("문자열을 입력하세요 : ")
count = len(inStr)

for i in range(0, count) :
    outStr += inStr[count - (i + 1)]

print("내용을 거꾸로 출력 --> %s" % outStr)`;

  const CODE_0807 = `import turtle
import random
from tkinter.simpledialog import *

## 전역 변수 선언 부분 ##
inStr = ''
swidth, sheight = 300, 300
tX, tY, txtSize = [0] * 3

## 메인 코드 부분 ##
turtle.title('거북이 글자쓰기')
turtle.shape('turtle')
turtle.setup(width = swidth + 50, height = sheight + 50)
turtle.screensize(swidth, sheight)
turtle.penup()

inStr = askstring('문자열 입력', '거북이 쓸 문자열을 입력')

for ch in inStr :

    tX = random.randrange(-swidth // 2, swidth // 2)
    tY = random.randrange(-sheight // 2, sheight // 2)
    r = random.random(); g = random.random(); b = random.random()
    txtSize = random.randrange(10, 50)

    turtle.goto(tX, tY)

    turtle.pencolor((r, g, b))
    turtle.write(ch, font=('맑은고딕', txtSize, 'bold'))

turtle.done()`;

  const CODE_0807_SLIDE = `import turtle
import random
from tkinter.simpledialog import *

inStr = ''
swidth, sheight = 300, 300
tX, tY, txtSize = [0] * 3

turtle.title('거북이 글자쓰기')
turtle.shape('turtle')
turtle.setup(width = swidth + 50, height = sheight + 50)
turtle.screensize(swidth, sheight)
turtle.penup()

inStr = askstring('문자열 입력', '거북이 쓸 문자열을 입력')

for ch in inStr :
    tX = random.randrange(-swidth // 2, swidth // 2)
    tY = random.randrange(-sheight // 2, sheight // 2)
    r = random.random(); g = random.random(); b = random.random()
    txtSize = random.randrange(10, 50)
    turtle.goto(tX, tY)
    turtle.pencolor((r, g, b))
    turtle.write(ch, font=('맑은고딕', txtSize, 'bold'))`;

  const DLG = ['IT Cookbook, 파이썬을 열심히 공부하자'];

  PY_COURSE.addChapter({
    id: 'ch08',
    no: '08',
    title: '문자열',
    subtitle: 'Strings — 인덱스 · 슬라이싱 · 문자열 함수',
    summary: '글자들이 순서대로 늘어선 자료형인 문자열을 인덱스와 슬라이싱으로 다루고, 대소문자 변환 · 찾기 · 공백 삭제 · 바꾸기 · 분리와 결합 · 정렬 · 구성 파악 등 다양한 문자열 함수를 익힙니다. 입력한 문자열을 거꾸로 출력하는 프로그램과, 입력한 글자를 거북이가 화면 곳곳에 쓰는 프로그램을 완성합니다.',
    goals: [
      '문자열이 글자의 시퀀스임을 이해하고 인덱스 · 음수 인덱스 · 슬라이싱으로 원하는 부분을 꺼낼 수 있다',
      '문자열의 +, *, len(), in 연산과 for 문을 이용해 문자열을 한 글자씩 처리할 수 있다',
      '문자열은 바꿀 수 없는(immutable) 자료형임을 설명하고, 새 문자열을 만들어 원하는 결과를 얻을 수 있다',
      'upper · find · strip · replace · split · join · center · isdigit 등 문자열 함수를 상황에 맞게 사용할 수 있다',
      '문자열 함수를 활용하여 문자열 거꾸로 출력 프로그램과 거북이 글자쓰기 프로그램을 완성할 수 있다'
    ],
    sections: [
      /* ===================== ch08-1 ===================== */
      {
        id: 'ch08-1',
        title: '문자열 기본: 인덱스와 슬라이싱',
        minutes: 50,
        goals: [
          '이 장에서 만들 두 프로그램의 동작을 설명할 수 있다',
          '문자열과 리스트가 인덱스 · 슬라이싱을 똑같이 사용한다는 점을 비교할 수 있다',
          '양수 · 음수 인덱스와 슬라이싱 [시작:끝:간격] 으로 문자열의 일부를 꺼낼 수 있다',
          '문자열의 +, *, len(), in 을 사용할 수 있다'
        ],
        flow: [['도입: 이 장에서 만들 프로그램', 5], ['문자열의 개념 · 리스트와 비교', 10], ['인덱스 · 음수 인덱스 · 슬라이싱', 15], ['+, *, len(), in', 10], ['퀴즈 · 실습', 10]],
        content: [
          { type: 'h', text: '이 장에서 만들 프로그램' },
          { type: 'p', html: '이번 장에서는 우리가 매일 쓰는 <b>글자 데이터</b>, 즉 <b>문자열(string)</b>을 자유자재로 다루는 방법을 배웁니다. 장을 마치면 다음 두 프로그램을 직접 완성할 수 있습니다.' },
          { type: 'list', items: [
            '<b>[프로그램 1] 입력된 문자열 거꾸로 출력</b> — 사용자가 입력한 문장을 끝 글자부터 거꾸로 뒤집어 보여 줍니다. <code>즐거운 Python 프로그래밍~~~</code> → <code>~~~밍래그로프 nohtyP 운거즐</code>',
            '<b>[프로그램 2] 임의의 위치에 글자를 쓰는 거북이</b> — 대화상자에 입력한 문장을 거북이가 한 글자씩, 제멋대로인 위치 · 크기 · 색상으로 화면에 씁니다.'
          ] },
          { type: 'figure', html: SVG_PREVIEW, caption: '이 장에서 만들 두 프로그램의 실행 모습' },
          { type: 'h', text: '문자열의 개념' },
          { type: 'p', html: `문자열은 <b>글자(문자)들이 순서대로 한 줄로 늘어선 것</b>입니다. 7장에서 배운 리스트가 여러 값을 순서대로 담은 것이었죠? 문자열도 똑같이 <b>순서가 있는 모음(시퀀스, sequence)</b>이기 때문에, 리스트에서 쓰던 <b>인덱스</b>와 <b>슬라이싱</b>을 그대로 사용할 수 있습니다.` },
          { type: 'p', html: `먼저 리스트 코드를 콘솔의 <code>&gt;&gt;&gt;</code> 셸(대화형 모드)에서 실행해 봅시다.` },
          { type: 'code', repl: true, title: '리스트의 인덱스와 슬라이싱 (복습)', code: `aa = [10, 20, 30, 40, 50]
aa[0]
aa[1:3]
aa[3:]`, expect: `>>> aa = [10, 20, 30, 40, 50]
>>> aa[0]
10
>>> aa[1:3]
[20, 30]
>>> aa[3:]
[40, 50]
>>>` },
          { type: 'p', html: `이번에는 같은 모양의 코드를 문자열로 바꿔 봅니다. 리스트는 대괄호 <code>[ ]</code> 로 묶여 출력되었지만, 문자열은 <b>작은따옴표 <code>' '</code></b> 로 묶여 출력됩니다.` },
          { type: 'code', repl: true, title: '문자열의 인덱스와 슬라이싱', code: `ss = "파이썬최고"
ss[0]
ss[1:3]
ss[3:]`, expect: `>>> ss = "파이썬최고"
>>> ss[0]
'파'
>>> ss[1:3]
'이썬'
>>> ss[3:]
'최고'
>>>`, desc: `셸은 식의 결과가 문자열이면 따옴표를 붙여서 보여 줍니다. <code>print(ss[0])</code> 처럼 출력하면 따옴표 없이 <code>파</code> 만 나옵니다.` },
          { type: 'table', head: ['', '리스트', '문자열'], rows: [
            ['만드는 방법', '<code>[10, 20, 30]</code>', `<code>"파이썬"</code> 또는 <code>'파이썬'</code>`],
            ['담는 것', '어떤 값이든 (숫자 · 문자열 · 리스트 …)', '글자만'],
            ['인덱스 · 슬라이싱', '<code>aa[0]</code>, <code>aa[1:3]</code>', '<code>ss[0]</code>, <code>ss[1:3]</code> (같은 방법)'],
            ['셸의 출력 모양', '<code>[20, 30]</code>', `<code>'이썬'</code>`],
            ['내용 바꾸기', `<code>aa[0] = 99</code> 가능`, '<b>불가능</b> (다음 교시에서 자세히)']
          ], caption: '리스트와 문자열 비교' },
          { type: 'callout', kind: 'more', title: '📘 문자열을 만드는 여러 가지 따옴표', html: `파이썬은 작은따옴표 <code>'…'</code> 와 큰따옴표 <code>"…"</code> 를 <b>똑같이</b> 취급합니다. 문자열 안에 따옴표가 들어가야 할 때는 다른 종류로 감싸면 편합니다. 예: <code>"It's OK"</code>, <code>'그가 "안녕"이라고 말했다'</code>.<br>여러 줄에 걸친 문자열은 따옴표 세 개 <code>'''…'''</code> 또는 <code>"""…"""</code> 로 만듭니다. 줄바꿈이 그대로 문자열에 들어갑니다.` },
          { type: 'code', title: '추가 예제. 따옴표 종류와 여러 줄 문자열', code: `s1 = '작은따옴표 문자열'
s2 = "큰따옴표 문자열"
s3 = "It's OK"
s4 = '그가 "안녕"이라고 말했다'
s5 = """첫째 줄
둘째 줄
셋째 줄"""
print(s1)
print(s2)
print(s3)
print(s4)
print(s5)`, expect: `작은따옴표 문자열
큰따옴표 문자열
It's OK
그가 "안녕"이라고 말했다
첫째 줄
둘째 줄
셋째 줄` },
          { type: 'h', text: '인덱스: 글자 하나 꺼내기' },
          { type: 'p', html: `문자열의 각 글자에는 <b>0부터 시작하는 번호(인덱스, index)</b>가 붙어 있습니다. <code>문자열[번호]</code> 로 그 위치의 글자 하나를 꺼냅니다. 또 파이썬에서는 <b>음수 인덱스</b>도 쓸 수 있는데, <code>-1</code> 은 맨 뒤 글자, <code>-2</code> 는 뒤에서 두 번째 글자입니다. 글자 수를 몰라도 마지막 글자를 쉽게 꺼낼 수 있어 편리합니다.` },
          { type: 'figure', html: SVG_INDEX, caption: '양수 인덱스는 앞에서 0부터, 음수 인덱스는 뒤에서 -1부터' },
          { type: 'code', title: '추가 예제. 양수 인덱스와 음수 인덱스', code: `ss = "파이썬최고"
print(ss[0], ss[1], ss[2], ss[3], ss[4])
print(ss[-1], ss[-2], ss[-5])
print("첫 글자 :", ss[0], "/ 마지막 글자 :", ss[-1])`, expect: `파 이 썬 최 고
고 최 파
첫 글자 : 파 / 마지막 글자 : 고` },
          { type: 'callout', kind: 'warn', title: '없는 인덱스를 쓰면 IndexError', html: `글자가 5개인 문자열의 인덱스는 <code>0 ~ 4</code> (또는 <code>-5 ~ -1</code>) 입니다. <code>ss[5]</code> 처럼 범위를 벗어나면 <code>IndexError: string index out of range</code> 오류가 납니다. “글자 수 = 마지막 인덱스 + 1” 을 꼭 기억하세요.` },
          { type: 'code', title: '추가 예제. 범위를 벗어난 인덱스', code: `ss = "파이썬최고"
print(ss[4])
print(ss[5])`, expectError: true, expect: `고
Traceback (most recent call last):
  File "main.py", line 3, in <module>
    print(ss[5])
          ~~^^^
IndexError: string index out of range` },
          { type: 'h', text: '슬라이싱: 여러 글자 잘라 내기' },
          { type: 'p', html: `<code>문자열[시작:끝]</code> 은 <b>시작 번호부터 끝 번호 바로 앞까지</b>의 글자들을 잘라 새 문자열로 만듭니다. 끝 번호의 글자는 <b>포함되지 않는다</b>는 점이 중요합니다. 인덱스를 “글자 칸 사이의 경계선 번호”로 생각하면 헷갈리지 않습니다.` },
          { type: 'figure', html: SVG_SLICE, caption: '슬라이싱은 경계선 번호 사이를 잘라 낸다 — ss[1:3] 은 1번 선과 3번 선 사이' },
          { type: 'list', items: [
            '<code>ss[시작:]</code> — 시작부터 <b>끝까지</b>',
            '<code>ss[:끝]</code> — <b>처음부터</b> 끝 바로 앞까지',
            '<code>ss[:]</code> — 전체 (복사본)',
            '<code>ss[시작:끝:간격]</code> — 간격만큼 건너뛰며. 간격이 <code>-1</code> 이면 <b>거꾸로</b>'
          ] },
          { type: 'code', title: '추가 예제. 다양한 슬라이싱', code: `ss = "파이썬최고"
print(ss[1:3])
print(ss[3:])
print(ss[:2])
print(ss[-2:])
print(ss[:])
print(ss[::2])
print(ss[::-1])`, expect: `이썬
최고
파이
최고
파이썬최고
파썬고
고최썬이파` },
          { type: 'callout', kind: 'tip', title: '슬라이싱은 범위를 벗어나도 오류가 없다', html: `인덱스 <code>ss[5]</code> 는 오류지만, 슬라이싱 <code>ss[3:100]</code> 은 오류 없이 있는 데까지만 잘라 <code>'최고'</code> 를 돌려줍니다. 범위가 아예 비면 빈 문자열 <code>''</code> 이 됩니다.` },
          { type: 'h', text: '문자열 더하기(+)와 곱하기(*)' },
          { type: 'p', html: `문자열끼리 <code>+</code> 를 하면 두 문자열이 <b>이어 붙은(연결, concatenation)</b> 새 문자열이 되고, 문자열에 정수를 <code>*</code> 하면 그 횟수만큼 <b>반복</b>한 문자열이 됩니다.` },
          { type: 'code', repl: true, title: '문자열 연결(+)과 반복(*)', code: `ss = '파이썬' + '최고'
ss
ss = '파이썬' * 3
ss`, expect: `>>> ss = '파이썬' + '최고'
>>> ss
'파이썬최고'
>>> ss = '파이썬' * 3
>>> ss
'파이썬파이썬파이썬'
>>>` },
          { type: 'callout', kind: 'warn', title: '문자열 + 숫자는 오류', html: `<code>'나이: ' + 20</code> 은 <code>TypeError: can only concatenate str (not "int") to str</code> 오류입니다. 숫자를 <code>str(20)</code> 으로 바꾸어 <code>'나이: ' + str(20)</code> 처럼 써야 합니다. (반대로 <code>'10' + '20'</code> 은 계산이 아니라 <code>'1020'</code> 이 됩니다.)` },
          { type: 'code', title: '추가 예제. 문자열 연산 활용', code: `name = "파이썬"
age = 35
print("=" * 20)
print(name + "의 나이는 " + str(age) + "살")
print("=" * 20)
print('10' + '20')
print(10 + 20)`, expect: `====================
파이썬의 나이는 35살
====================
1020
30` },
          { type: 'h', text: 'len() 함수: 글자 수 세기' },
          { type: 'p', html: `<code>len()</code> 함수는 리스트의 항목 수나 <b>문자열의 글자 수</b>를 알려 줍니다. 한글 한 글자, 영문 한 글자, 공백 하나가 모두 <b>1글자</b>로 세어집니다.` },
          { type: 'code', repl: true, title: 'len() 으로 문자열 길이 구하기', code: `ss = '파이썬abcd'
len(ss)`, expect: `>>> ss = '파이썬abcd'
>>> len(ss)
7
>>>` },
          { type: 'code', title: '추가 예제. 공백도 한 글자', code: `print(len("파이썬"))
print(len("Python"))
print(len("파이썬 최고"))
print(len(""))`, expect: `3
6
6
0`, desc: `빈 문자열 <code>""</code> 의 길이는 0 입니다. 공백 <code>" "</code> 은 눈에 보이지 않지만 한 글자입니다.` },
          { type: 'h', text: '📘 in 연산자: 포함되어 있나?' },
          { type: 'p', html: `<code>'글자' in 문자열</code> 은 왼쪽 문자열이 오른쪽 문자열 안에 들어 있으면 <code>True</code>, 없으면 <code>False</code> 입니다. <code>not in</code> 은 그 반대입니다. if 문과 함께 쓰면 “특정 단어가 들어 있는지” 쉽게 검사할 수 있습니다.` },
          { type: 'code', title: '추가 예제. in 으로 포함 여부 검사', code: `ss = "파이썬 공부는 즐겁습니다"
print('파이썬' in ss)
print('자바' in ss)
print('자바' not in ss)
if '즐겁' in ss :
    print("즐거운 문장이네요!")`, expect: `True
False
True
즐거운 문장이네요!` },
          { type: 'callout', kind: 'more', title: '📘 이스케이프 문자(escape sequence)', html: `문자열 안에서 역슬래시 <code>\\</code> 뒤의 글자는 특별한 뜻을 가집니다. <code>\\n</code> 줄바꿈, <code>\\t</code> 탭, <code>\\\\</code> 역슬래시 자체, <code>\\'</code> 작은따옴표, <code>\\"</code> 큰따옴표. 이스케이프 문자도 <code>len()</code> 으로 세면 <b>한 글자</b>입니다.` },
          { type: 'code', title: '추가 예제. 이스케이프 문자', code: `print("하나\\n둘\\n셋")
print("이름\\t나이")
print("홍길동\\t20")
print('It\\'s OK')
print("C:\\\\CookPython")
print(len("a\\nb"))`, expect: `하나
둘
셋
이름	나이
홍길동	20
It's OK
C:\\CookPython
3` }
        ],
        practice: [
          {
            title: '실습 8-1. 날짜 문자열 잘라 내기',
            level: 1,
            desc: `<p>8자리 날짜 문자열 <code>"20260918"</code> 에서 슬라이싱으로 연도 · 월 · 일을 잘라 내어 다음처럼 출력하세요.</p><pre>연도 : 2026
월 : 09
일 : 18
2026-09-18</pre>`,
            hint: '연도는 0~3번 글자 → <code>date[0:4]</code>, 월은 4~5번 글자 → <code>date[4:6]</code>. 마지막 줄은 <code>+</code> 로 이어 붙입니다.',
            starter: `date = "20260918"

# TODO: 슬라이싱으로 year, month, day 를 만드세요
year = ""
month = ""
day = ""

print("연도 :", year)
print("월 :", month)
print("일 :", day)
# TODO: 2026-09-18 형태로 출력
`,
            solution: `date = "20260918"

year = date[0:4]
month = date[4:6]
day = date[6:]

print("연도 :", year)
print("월 :", month)
print("일 :", day)
print(year + "-" + month + "-" + day)
`,
            expect: `연도 : 2026
월 : 09
일 : 18
2026-09-18`
          },
          {
            title: '실습 8-2. 문자열 곱하기로 상자 그리기',
            level: 2,
            desc: `<p>단어를 입력받아, 단어 길이에 맞는 상자 안에 넣어 출력하세요. 상자의 가로선은 <code>'*'</code> 를 <b>(단어 길이 + 4)</b> 번 반복한 것입니다. (영문 입력 기준)</p><pre>단어 : Python
**********
* Python *
**********</pre>`,
            hint: '<code>line = "*" * (len(word) + 4)</code> 로 가로선을 만들고, 가운데 줄은 <code>"* " + word + " *"</code> 입니다.',
            starter: `word = input("단어 : ")

# TODO: 가로선 만들기 (len() 과 * 사용)
line = ""

print(line)
# TODO: 가운데 줄 출력
print(line)
`,
            solution: `word = input("단어 : ")

line = "*" * (len(word) + 4)

print(line)
print("* " + word + " *")
print(line)
`,
            stdin: 'Python\n',
            expect: `단어 : Python
**********
* Python *
**********`
          }
        ],
        quiz: [
          { q: `다음 코드의 실행 결과는?<pre><code>ss = "파이썬최고"
print(ss[1:3])</code></pre>`, options: ['파이', '이썬', '이썬최', '파이썬'], answer: 1, explain: `슬라이싱은 시작 번호 1부터 끝 번호 3 <b>바로 앞</b>(2)까지이므로 <code>ss[1]</code>, <code>ss[2]</code> → '이썬' 입니다.` },
          { q: `<code>ss = "Python"</code> 일 때 <code>ss[-1]</code> 의 값은?`, options: [`'P'`, `'n'`, `'o'`, 'IndexError 오류'], answer: 1, explain: '음수 인덱스 -1 은 맨 마지막 글자입니다.' },
          { q: `다음 코드의 실행 결과는?<pre><code>ss = 'ab' * 3 + 'c'
print(len(ss))</code></pre>`, options: ['3', '6', '7', '9'], answer: 2, explain: `<code>'ab' * 3</code> 은 'ababab'(6글자), 여기에 'c' 를 붙이면 7글자입니다.` },
          { q: `<code>'10' + '20'</code> 의 결과는?`, options: ['30', `'30'`, `'1020'`, 'TypeError 오류'], answer: 2, explain: '따옴표로 감싼 값은 숫자가 아니라 문자열이므로 + 는 이어 붙이기입니다.' },
          { q: `<code>ss = "파이썬최고"</code> 일 때 <b>오류가 나는</b> 코드는?`, options: ['ss[4]', 'ss[-5]', 'ss[5]', 'ss[3:100]'], answer: 2, explain: '인덱스는 0~4(-5~-1)까지만 있으므로 ss[5] 는 IndexError 입니다. 슬라이싱은 범위를 벗어나도 오류가 나지 않습니다.' }
        ],
        slides: [
          { layout: 'title', title: '문자열 기본: 인덱스와 슬라이싱', subtitle: 'Chapter 08 문자열 · Section 01~02', badge: '08-1',
            notes: '<p><b>[도입 1분]</b> “여러분이 스마트폰에서 매일 다루는 데이터 중 가장 많은 것은?” → 대부분 글자(메시지, 검색어, 이름). 오늘은 글자 데이터인 문자열을 다룹니다.</p><p>이번 교시 목표: 인덱스 · 슬라이싱 · +, * · len().</p>' },
          { layout: 'diagram', title: '이 장에서 만들 프로그램', html: SVG_PREVIEW, caption: '[프로그램 1] 문자열 거꾸로 출력 · [프로그램 2] 임의의 위치에 글자를 쓰는 거북이',
            notes: '<p><b>[3분]</b> 완성 프로그램을 먼저 실행해서 보여 주면 동기 부여가 됩니다 (8-2, 8-4 교시의 코드 슬라이드를 미리 실행).</p><p>발문: “문장을 거꾸로 뒤집으려면 컴퓨터는 무엇을 알아야 할까?” → 글자 수, 각 글자의 위치.</p>' },
          { layout: 'two', title: '문자열의 개념: 리스트와 비교', left: { title: '리스트', code: `aa = [10, 20, 30, 40, 50]
aa[0]
aa[1:3]
aa[3:]`, repl: true }, right: { title: '문자열', code: `ss = "파이썬최고"
ss[0]
ss[1:3]
ss[3:]`, repl: true },
            notes: '<p><b>[5분]</b> 양쪽을 차례로 실행합니다. 결과가 <code>[20, 30]</code> 과 <code>\'이썬\'</code> — 리스트는 대괄호, 문자열은 작은따옴표로 묶여 출력됨을 짚어 줍니다.</p><p>핵심 메시지: 문자열 = 글자들의 리스트처럼 생각하면 된다(단, 바꿀 수는 없다 — 다음 교시).</p>' },
          { layout: 'bullets', title: '문자열이란?', lead: '글자들이 순서대로 늘어선 시퀀스(sequence)',
            bullets: [`작은따옴표 <code>'…'</code>, 큰따옴표 <code>"…"</code> 모두 가능`, `여러 줄: <code>'''…'''</code> 또는 <code>"""…"""</code>`, '각 글자에 0부터 번호(인덱스)가 붙음', '리스트처럼 <b>인덱스 · 슬라이싱 · len()</b> 사용 가능'],
            notes: '<p><b>[2분]</b> 따옴표 짝이 맞지 않으면 SyntaxError 가 난다는 것을 시연해도 좋습니다: <code>print("안녕\')</code>.</p>' },
          { layout: 'diagram', title: '인덱스: 양수와 음수', html: SVG_INDEX, caption: '앞에서 0부터, 뒤에서 -1부터',
            notes: '<p><b>[4분]</b> 발문: “글자가 100개인 문자열의 마지막 글자를 꺼내려면?” → <code>ss[99]</code> 또는 <code>ss[len(ss)-1]</code>, 더 쉽게 <code>ss[-1]</code>.</p><p>흔한 실수: 인덱스를 1부터 세는 것. “0층부터 시작하는 건물”에 비유.</p>' },
          { layout: 'code', title: '인덱스로 글자 꺼내기', code: `ss = "파이썬최고"
print(ss[0], ss[1], ss[2], ss[3], ss[4])
print(ss[-1], ss[-2], ss[-5])
print(ss[5])`, expectError: true, points: ['<code>ss[-1]</code> = 마지막 글자', '<code>ss[5]</code> → IndexError', '인덱스 범위: 0 ~ len-1'],
            notes: '<p><b>[3분]</b> 일부러 오류가 나는 4행까지 실행해 오류 메시지를 함께 읽어 봅니다. “string index out of range” = 문자열 인덱스가 범위를 벗어남.</p>' },
          { layout: 'diagram', title: '슬라이싱 [시작:끝]', html: SVG_SLICE, caption: '끝 번호의 글자는 포함하지 않는다',
            notes: '<p><b>[5분]</b> 칸이 아니라 “칸 사이의 경계선”에 번호를 붙이면 끝 번호 미포함 규칙이 자연스럽습니다. <code>ss[1:3]</code> = 1번 선과 3번 선 사이.</p><p>슬라이스 길이 = 끝 - 시작 (3 - 1 = 2글자).</p>' },
          { layout: 'code', title: '다양한 슬라이싱', code: `ss = "파이썬최고"
print(ss[1:3])
print(ss[3:])
print(ss[:2])
print(ss[-2:])
print(ss[::2])
print(ss[::-1])`, points: ['생략하면 처음 / 끝까지', '<code>[::2]</code> 두 칸씩', '<code>[::-1]</code> 거꾸로 — [프로그램 1] 의 지름길!'],
            notes: '<p><b>[4분]</b> 실행 전에 결과를 예측시키고 손을 들게 합니다. <code>[::-1]</code> 은 다음 교시 [프로그램 1] 을 한 줄로 만드는 방법이라고 예고만 합니다.</p>' },
          { layout: 'code', title: '문자열 + 와 *', code: `ss = '파이썬' + '최고'
ss
ss = '파이썬' * 3
ss`, repl: true, points: ['<code>+</code> : 이어 붙이기(연결)', '<code>*</code> : 정수만큼 반복', '<code>\'나이\' + 20</code> 은 TypeError'],
            notes: '<p><b>[3분]</b> 셸에서 <code>\'나이: \' + 20</code> 을 직접 입력해 TypeError 를 보여 주고 <code>str(20)</code> 으로 고칩니다.</p><p><code>"=" * 30</code> 으로 구분선 그리는 실용 예도 보여 주세요.</p>' },
          { layout: 'code', title: 'len() 과 in', code: `ss = '파이썬abcd'
print(len(ss))
print(len("파이썬 최고"))
print('파이썬' in ss)
print('자바' in ss)`, points: ['한글 · 영문 · 공백 모두 1글자', '<code>in</code> : 포함되면 True', '<code>not in</code> : 반대'],
            notes: '<p><b>[3분]</b> 공백도 한 글자로 세어지는 것을 강조합니다. in 은 강의자료에 없는 보충 내용이지만 뒤의 실습에서 편리하게 씁니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: `<code>ss = "Python"</code> 일 때 <code>ss[1:4]</code> 는?`, options: [`'Pyt'`, `'yth'`, `'ytho'`, `'Pyth'`], answer: 1,
            explain: '인덱스 1(y)부터 4 바로 앞인 3(h)까지 → \'yth\'',
            notes: '<p><b>[2분]</b> 틀린 학생은 대부분 끝 번호를 포함(ytho)하거나 1부터 셉니다(Pyt). 경계선 그림으로 다시 설명하세요.</p>' },
          { layout: 'practice', title: '실습 8-1. 날짜 문자열 잘라 내기', desc: '<code>"20260918"</code> 에서 연 · 월 · 일을 잘라 <code>2026-09-18</code> 형태로 출력하기', starter: `date = "20260918"
# TODO: year, month, day 슬라이싱
`, solution: `date = "20260918"
year = date[0:4]
month = date[4:6]
day = date[6:]
print("연도 :", year)
print("월 :", month)
print("일 :", day)
print(year + "-" + month + "-" + day)
`,
            notes: '<p><b>[6분]</b> 먼저 날짜 문자열 아래에 인덱스 0~7 을 적어 보게 한 뒤 슬라이싱 범위를 정하게 합니다.</p><p>빨리 끝낸 학생: 음수 인덱스만으로 같은 결과 만들기 (<code>date[-2:]</code> 등).</p>' },
          { layout: 'summary', title: '정리', bullets: ['문자열 = 글자의 시퀀스, 인덱스는 0부터 (음수는 뒤에서 -1부터)', '<code>ss[시작:끝:간격]</code> — 끝은 포함하지 않음, <code>[::-1]</code> 거꾸로', '<code>+</code> 연결, <code>*</code> 반복, <code>len()</code> 글자 수, <code>in</code> 포함 여부', '문자열 + 숫자는 오류 → <code>str()</code> 로 변환'],
            notes: '<p><b>[1분]</b> 다음 교시 예고: for 문으로 문자열을 한 글자씩 처리하고 [프로그램 1] 완성.</p>' }
        ]
      },

      /* ===================== ch08-2 ===================== */
      {
        id: 'ch08-2',
        title: '문자열 한 글자씩 처리하기와 [프로그램 1]',
        minutes: 50,
        goals: [
          'for 문과 range(), len() 으로 문자열을 한 글자씩 처리할 수 있다',
          '문자열이 바꿀 수 없는 자료형임을 알고, += 로 새 문자열을 만들어 갈 수 있다',
          '[프로그램 1] 문자열 거꾸로 출력을 완성하고 다른 방법(슬라이싱)과 비교할 수 있다',
          '% 서식과 f-string 으로 문자열 안에 값을 넣어 출력할 수 있다'
        ],
        flow: [['복습: 인덱스 · len()', 5], ['Code08-01 · SELF STUDY 8-1', 15], ['문자열의 불변성 · 빈 문자열 += ', 8], ['[프로그램 1] 완성 · 다른 방법', 12], ['문자열 서식(f-string) · 퀴즈', 10]],
        content: [
          { type: 'h', text: '모든 글자 뒤에 $ 붙이기' },
          { type: 'p', html: `문자열의 글자 수는 <code>len()</code> 으로, 각 글자는 <code>ss[i]</code> 로 꺼낼 수 있었습니다. 이 둘을 <code>for i in range(0, len(ss))</code> 와 함께 쓰면 i 가 0, 1, 2, … 로 바뀌면서 <b>모든 글자를 차례로</b> 처리할 수 있습니다.` },
          { type: 'code', title: 'Code08-01. 모든 글자 뒤에 $ 붙여 출력하기', code: `ss = '파이썬짱!'

sslen = len(ss)
for i in range(0, sslen) :
    print(ss[i] + '$', end = '')`, expect: '파$이$썬$짱$!$',
            desc: `<code>3행</code> 글자 수(5)를 구해 <code>4행</code>에서 i 가 0~4 로 반복합니다. <code>5행</code> <code>ss[i] + '$'</code> 는 i 번째 글자 뒤에 $ 를 이어 붙인 문자열이고, <code>end = ''</code> 때문에 줄을 바꾸지 않고 옆으로 계속 출력됩니다.` },
          { type: 'table', head: ['i', 'ss[i]', "ss[i] + '$'", '지금까지 출력된 내용'], rows: [
            ['0', '파', '파$', '파$'], ['1', '이', '이$', '파$이$'], ['2', '썬', '썬$', '파$이$썬$'], ['3', '짱', '짱$', '파$이$썬$짱$'], ['4', '!', '!$', '파$이$썬$짱$!$']
          ], caption: 'Code08-01 의 반복 과정' },
          { type: 'callout', kind: 'more', title: '📘 더 파이썬다운 방법: for ch in 문자열', html: `인덱스 번호가 필요 없다면 <code>for ch in ss :</code> 처럼 문자열을 바로 for 문에 넣을 수 있습니다. 그러면 <code>ch</code> 에 글자가 하나씩 차례로 들어옵니다. 코드가 짧아지고 인덱스 실수(IndexError)도 줄어듭니다. 번호와 글자가 모두 필요하면 <code>for i, ch in enumerate(ss) :</code> 를 사용합니다. [프로그램 2]에서도 <code>for ch in inStr :</code> 형태를 사용합니다.` },
          { type: 'code', title: '추가 예제. for ch in 문자열 / enumerate()', code: `ss = '파이썬짱!'

for ch in ss :
    print(ch + '$', end = '')
print()

for i, ch in enumerate(ss) :
    print(i, ':', ch)`, expect: `파$이$썬$짱$!$
0 : 파
1 : 이
2 : 썬
3 : 짱
4 : !` },
          { type: 'h', text: 'SELF STUDY 8-1' },
          { type: 'p', html: `Code08-01 을 고쳐서 <code>'파이썬은완전재미있어요'</code> 를 <code>파#썬#완#재#있#요</code> 로 출력해 봅시다. 인덱스를 0부터 센다고 할 때 <b>짝수 번째 글자는 그대로</b>, <b>홀수 번째 글자는 # 으로</b> 바꿔 출력하면 됩니다. (힌트: i 를 2로 나눈 나머지가 0이면 짝수) — 아래 실습 과제에서 직접 풀어 보세요.` },
          { type: 'h', text: '문자열은 바꿀 수 없다 (불변, immutable)' },
          { type: 'p', html: `리스트는 <code>aa[0] = 99</code> 처럼 항목 하나를 바꿀 수 있었지만, <b>문자열은 한 번 만들어지면 그 안의 글자를 바꿀 수 없습니다</b>. 이런 성질을 <b>불변(immutable)</b>이라고 합니다. 글자를 바꾼 것 같은 결과가 필요하면, 슬라이싱과 <code>+</code> 로 <b>새 문자열을 만들어 변수에 다시 대입</b>합니다.` },
          { type: 'figure', html: SVG_IMMUTABLE, caption: '문자열의 글자는 바꿀 수 없다 — 새 문자열을 만들어 변수가 그것을 가리키게 한다' },
          { type: 'code', title: '추가 예제. 문자열의 글자를 바꾸려고 하면', code: `ss = '파이썬'
ss[0] = 'X'`, expectError: true, expect: `Traceback (most recent call last):
  File "main.py", line 2, in <module>
    ss[0] = 'X'
    ~~^^^
TypeError: 'str' object does not support item assignment` },
          { type: 'code', title: '추가 예제. 새 문자열을 만들어 다시 대입하기', code: `ss = '파이썬'
ss = 'X' + ss[1:]
print(ss)

ss = '파이썬'
ss = ss[:1] + '@' + ss[2:]
print(ss)`, expect: `X이썬
파@썬` },
          { type: 'callout', kind: 'info', title: '빈 문자열에 += 로 쌓아 가기', html: `불변이라고 해서 <code>outStr += '글자'</code> 가 안 되는 것은 아닙니다. 이것은 <code>outStr = outStr + '글자'</code> 와 같아서, <b>기존 문자열 + 새 글자 = 새 문자열</b>을 만들어 변수에 다시 넣는 것입니다. 그래서 빈 문자열 <code>""</code> 에서 시작해 글자를 하나씩 붙여 가는 방식을 자주 씁니다. [프로그램 1]이 바로 이 방식입니다.` },
          { type: 'h', text: '[프로그램 1]의 완성: 문자열을 입력받아 거꾸로 출력' },
          { type: 'p', html: `이제 입력받은 문자열을 거꾸로 뒤집어 봅시다. 아이디어는 간단합니다. 빈 문자열 <code>outStr</code> 을 준비하고, 입력 문자열의 <b>맨 뒤 글자부터 맨 앞 글자까지</b> 차례로 꺼내 <code>outStr</code> 뒤에 붙입니다.` },
          { type: 'figure', html: SVG_REVERSE, caption: 'i 가 0, 1, 2 … 로 커질 때 count - (i + 1) 은 5, 4, 3 … 으로 작아진다' },
          { type: 'code', title: '[프로그램 1] 완성: Code08-02. 문자열을 입력받아 거꾸로 출력', code: CODE_0802, stdin: '즐거운 Python 프로그래밍~~~\n',
            expect: `문자열을 입력하세요 : 즐거운 Python 프로그래밍~~~
내용을 거꾸로 출력 --> ~~~밍래그로프 nohtyP 운거즐`,
            desc: `<code>2~3행</code> 사용할 변수를 미리 준비합니다. <code>outStr</code> 은 빈 문자열에서 시작합니다. <code>7행</code> 입력한 글자 수를 <code>count</code> 에 저장합니다. <code>9~10행</code> i 가 0일 때 <code>inStr[count - 1]</code>(마지막 글자), i 가 1일 때 <code>inStr[count - 2]</code> … 를 차례로 <code>outStr</code> 에 붙입니다. <code>12행</code> <code>%s</code> 자리에 <code>outStr</code> 이 들어가 출력됩니다.` },
          { type: 'callout', kind: 'tip', title: '웹 강좌에서 입력하기', html: `▶ 실행 후 콘솔 입력칸에 문장을 입력하고 Enter 를 누르세요. <b>“예시 입력으로 실행”</b> 버튼을 누르면 <code>즐거운 Python 프로그래밍~~~</code> 이 자동으로 입력됩니다.` },
          { type: 'callout', kind: 'more', title: '📘 [프로그램 1]을 한 줄로: 슬라이싱 [::-1]', html: `앞 교시에서 배운 슬라이싱 간격 <code>-1</code> 을 쓰면 반복문 없이 <code>inStr[::-1]</code> 한 번으로 거꾸로 된 문자열을 얻을 수 있습니다. 또 <code>reversed()</code> 함수로 글자를 거꾸로 꺼내 <code>''.join()</code> 으로 붙이는 방법도 있습니다(join 은 8-4 교시). 원리를 이해하는 데는 반복문 버전이, 실제 프로그램에서는 슬라이싱 버전이 좋습니다.` },
          { type: 'code', title: '추가 예제. 거꾸로 출력하는 세 가지 방법', code: `inStr = input("문자열을 입력하세요 : ")

# 방법 1: 반복문 (Code08-02 방식)
outStr = ""
for i in range(0, len(inStr)) :
    outStr += inStr[len(inStr) - (i + 1)]
print("방법 1 -->", outStr)

# 방법 2: 슬라이싱
print("방법 2 -->", inStr[::-1])

# 방법 3: 앞에 붙이기
outStr = ""
for ch in inStr :
    outStr = ch + outStr
print("방법 3 -->", outStr)`, stdin: '파이썬 만세\n', expect: `문자열을 입력하세요 : 파이썬 만세
방법 1 --> 세만 썬이파
방법 2 --> 세만 썬이파
방법 3 --> 세만 썬이파`, desc: `방법 3은 새 글자를 <b>앞쪽</b>에 붙입니다. '파' → '이파' → '썬이파' … 처럼 자연스럽게 뒤집힙니다.` },
          { type: 'h', text: '📘 문자열 안에 값 넣기: % 서식과 f-string' },
          { type: 'p', html: `Code08-02 의 마지막 줄 <code>"… %s" % outStr</code> 는 문자열 안의 <code>%s</code> 자리에 값을 끼워 넣는 <b>% 서식</b>입니다. 파이썬 3.6부터는 더 읽기 쉬운 <b>f-string</b>(포맷 문자열)을 많이 씁니다. 문자열 앞에 <code>f</code> 를 붙이고, 넣을 값을 중괄호 <code>{ }</code> 안에 바로 적습니다.` },
          { type: 'table', head: ['방법', '예', '결과'], rows: [
            ['% 서식', `<code>"%s님은 %d살" % ("홍길동", 20)</code>`, '홍길동님은 20살'],
            ['format() 함수', `<code>"{}님은 {}살".format("홍길동", 20)</code>`, '홍길동님은 20살'],
            ['f-string (권장)', `<code>f"{name}님은 {age}살"</code>`, '홍길동님은 20살']
          ], caption: '같은 결과를 내는 세 가지 서식' },
          { type: 'code', title: '추가 예제. % 서식 · format() · f-string 비교', code: `name = "홍길동"
age = 20
height = 175.456

print("%s님은 %d살, 키는 %.1fcm" % (name, age, height))
print("{}님은 {}살, 키는 {:.1f}cm".format(name, age, height))
print(f"{name}님은 {age}살, 키는 {height:.1f}cm")
print(f"내년에는 {age + 1}살")`, expect: `홍길동님은 20살, 키는 175.5cm
홍길동님은 20살, 키는 175.5cm
홍길동님은 20살, 키는 175.5cm
내년에는 21살`, desc: '<code>%.1f</code>, <code>{:.1f}</code> 는 소수점 아래 1자리까지 반올림해 표시하라는 뜻입니다. f-string 의 중괄호 안에는 <code>age + 1</code> 같은 식도 쓸 수 있습니다.' },
          { type: 'table', head: ['f-string 서식', '의미', '예 → 결과'], rows: [
            ['<code>{x:.2f}</code>', '소수점 아래 2자리', '<code>f"{3.14159:.2f}"</code> → 3.14'],
            ['<code>{x:,}</code>', '천 단위 쉼표', '<code>f"{1234567:,}"</code> → 1,234,567'],
            ['<code>{x:&gt;8}</code>', '8칸, 오른쪽 정렬', `<code>f"{'abc':&gt;8}"</code> → '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;abc'`],
            ['<code>{x:&lt;8}</code>', '8칸, 왼쪽 정렬', `<code>f"{'abc':&lt;8}"</code> → 'abc&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'`],
            ['<code>{x:^8}</code>', '8칸, 가운데 정렬', `<code>f"{'abc':^8}"</code> → '&nbsp;&nbsp;abc&nbsp;&nbsp;&nbsp;'`],
            ['<code>{x:05d}</code>', '5칸, 빈 곳은 0', '<code>f"{42:05d}"</code> → 00042']
          ], caption: '📘 자주 쓰는 f-string 서식 지정' },
          { type: 'code', title: '추가 예제. f-string 서식 지정으로 표 만들기', code: `items = ["사과", "바나나", "딸기"]
prices = [1500, 12000, 8900]

for i in range(0, len(items)) :
    print(f"{i + 1:02d}. {items[i]:<5} {prices[i]:>8,}원")`, expect: `01. 사과       1,500원
02. 바나나     12,000원
03. 딸기       8,900원`, desc: '한글은 화면에서 영문보다 폭이 넓어 보여서, 칸 수를 맞춰도 줄이 딱 맞지 않을 수 있습니다. 파이썬은 한글도 1글자로 세기 때문입니다.' }
        ],
        practice: [
          {
            title: 'SELF STUDY 8-1. 짝수 번째 글자만 보이기',
            level: 1,
            desc: `<p>Code08-01 을 수정해서 <code>'파이썬은완전재미있어요'</code> 를 <code>파#썬#완#재#있#요</code> 로 출력하세요. 인덱스를 0부터 센다고 할 때, 짝수 번째 글자는 그대로 출력하고 홀수 번째 글자는 대신 <code>#</code> 을 출력합니다.</p>`,
            hint: 'if 문으로 i 가 짝수일 때(<code>i % 2 == 0</code>)와 홀수일 때를 다르게 처리합니다.',
            starter: `ss = '파이썬은완전재미있어요'

sslen = len(ss)
for i in range(0, sslen) :
    # TODO: i 가 짝수면 ss[i], 홀수면 '#' 출력 (end = '')
    pass
`,
            solution: `ss = '파이썬은완전재미있어요'

sslen = len(ss)
for i in range(0, sslen) :
    if i % 2 == 0 :
        print(ss[i], end = '')
    else :
        print('#', end = '')
`,
            expect: '파#썬#완#재#있#요'
          },
          {
            title: '실습 8-3. 회문(팰린드롬) 판별기',
            level: 2,
            desc: `<p>앞으로 읽어도 뒤로 읽어도 같은 말을 <b>회문</b>이라고 합니다(예: <code>기러기</code>, <code>토마토</code>, <code>level</code>). 단어를 입력받아 회문이면 <code>회문입니다.</code>, 아니면 <code>회문이 아닙니다.</code> 를 출력하세요.</p><pre>단어 입력 : 기러기
기러기 → 기러기
회문입니다.</pre>`,
            hint: '[프로그램 1] 처럼 거꾸로 된 문자열 <code>outStr</code> 을 만든 뒤 <code>inStr == outStr</code> 로 비교합니다. (슬라이싱 <code>[::-1]</code> 을 써도 됩니다)',
            starter: `inStr = input("단어 입력 : ")
outStr = ""

# TODO: outStr 에 inStr 을 거꾸로 만들기

print(inStr, "→", outStr)
# TODO: 같으면 "회문입니다." 아니면 "회문이 아닙니다."
`,
            solution: `inStr = input("단어 입력 : ")
outStr = ""

count = len(inStr)
for i in range(0, count) :
    outStr += inStr[count - (i + 1)]

print(inStr, "→", outStr)
if inStr == outStr :
    print("회문입니다.")
else :
    print("회문이 아닙니다.")
`,
            stdin: '기러기\n',
            expect: `단어 입력 : 기러기
기러기 → 기러기
회문입니다.`
          },
          {
            title: '실습 8-4. 모음 개수 세기',
            level: 2,
            desc: `<p>영어 문장을 입력받아 모음(<code>a, e, i, o, u</code>)이 몇 개인지 세어 f-string 으로 출력하세요. 대문자는 입력하지 않는다고 가정합니다.</p><pre>영어 문장 : i love python programming
모음은 모두 7개입니다.</pre>`,
            hint: '<code>for ch in 문장 :</code> 으로 한 글자씩 꺼내고, <code>if ch in "aeiou" :</code> 이면 개수를 1 늘립니다.',
            starter: `sentence = input("영어 문장 : ")
count = 0

# TODO: 한 글자씩 검사하여 모음이면 count += 1

print(f"모음은 모두 {count}개입니다.")
`,
            solution: `sentence = input("영어 문장 : ")
count = 0

for ch in sentence :
    if ch in "aeiou" :
        count += 1

print(f"모음은 모두 {count}개입니다.")
`,
            stdin: 'i love python programming\n',
            expect: `영어 문장 : i love python programming
모음은 모두 7개입니다.`
          }
        ],
        quiz: [
          { q: `다음 코드의 실행 결과는?<pre><code>ss = 'abc'
for i in range(0, len(ss)) :
    print(ss[i] + '-', end = '')</code></pre>`, options: ['abc-', 'a-b-c', 'a-b-c-', '-a-b-c'], answer: 2, explain: '각 글자 뒤에 - 를 붙여 줄바꿈 없이 출력하므로 a-b-c- 입니다.' },
          { q: `다음 코드를 실행하면?<pre><code>ss = 'python'
ss[0] = 'P'
print(ss)</code></pre>`, options: ['Python', 'python', 'Pthon', 'TypeError 오류'], answer: 3, explain: `문자열은 불변(immutable)이라 글자 하나를 바꿀 수 없습니다. <code>ss = 'P' + ss[1:]</code> 처럼 새 문자열을 만들어야 합니다.` },
          { q: `Code08-02 에서 <code>count</code> 가 6 이고 <code>i</code> 가 0 일 때 <code>inStr[count - (i + 1)]</code> 가 가리키는 글자는?`, options: ['첫 번째 글자', '두 번째 글자', '마지막 글자', 'IndexError 오류'], answer: 2, explain: '<code>inStr[6 - 1] = inStr[5]</code>, 즉 6글자 문자열의 마지막 글자입니다.' },
          { q: `<code>"ABCDE"[::-1]</code> 의 결과는?`, options: [`'ABCDE'`, `'EDCBA'`, `'E'`, `'ACE'`], answer: 1, explain: '간격이 -1 이면 뒤에서부터 거꾸로 잘라 냅니다.' },
          { q: `<code>name = "철수"</code>, <code>age = 15</code> 일 때 <code>f"{name}는 {age + 1}살"</code> 의 결과는?`, options: ['{name}는 {age + 1}살', '철수는 15살', '철수는 16살', '오류'], answer: 2, explain: 'f-string 의 중괄호 안의 식이 계산되어 들어갑니다.' }
        ],
        slides: [
          { layout: 'title', title: '문자열 한 글자씩 처리하기', subtitle: 'for 문 · 불변성 · [프로그램 1] 문자열 거꾸로 출력', badge: '08-2',
            notes: '<p><b>[도입 2분]</b> 복습 발문: “<code>ss = \'파이썬\'</code> 의 마지막 글자를 꺼내는 방법 두 가지는?” → <code>ss[2]</code>, <code>ss[-1]</code>.</p>' },
          { layout: 'code', title: 'Code08-01. 모든 글자 뒤에 $ 붙이기', code: `ss = '파이썬짱!'

sslen = len(ss)
for i in range(0, sslen) :
    print(ss[i] + '$', end = '')`, points: ['<code>len()</code> 으로 반복 횟수 결정', '<code>ss[i]</code> 로 i 번째 글자', '<code>end = \'\'</code> : 줄바꿈 없이'],
            notes: '<p><b>[4분]</b> i 가 0~4 로 바뀌는 표를 칠판에 함께 그립니다. 발문: “<code>end = \'\'</code> 를 빼면 어떻게 될까?” → 한 줄에 하나씩 출력.</p>' },
          { layout: 'two', title: '📘 인덱스 반복 vs 글자 반복', left: { title: 'range + 인덱스', code: `ss = '파이썬짱!'
for i in range(0, len(ss)) :
    print(ss[i] + '$', end = '')` }, right: { title: 'for ch in 문자열', code: `ss = '파이썬짱!'
for ch in ss :
    print(ch + '$', end = '')` },
            notes: '<p><b>[3분]</b> 결과는 같습니다. 위치(번호)가 필요하면 왼쪽, 글자만 필요하면 오른쪽이 간단합니다. [프로그램 2] 는 오른쪽 방식을 씁니다.</p>' },
          { layout: 'practice', title: 'SELF STUDY 8-1', desc: `<code>'파이썬은완전재미있어요'</code> → <code>파#썬#완#재#있#요</code><br>짝수 번째 글자는 그대로, 홀수 번째는 # 출력`, starter: `ss = '파이썬은완전재미있어요'

sslen = len(ss)
for i in range(0, sslen) :
    # TODO
    pass
`, solution: `ss = '파이썬은완전재미있어요'

sslen = len(ss)
for i in range(0, sslen) :
    if i % 2 == 0 :
        print(ss[i], end = '')
    else :
        print('#', end = '')
`,
            notes: '<p><b>[6분]</b> 힌트: 짝수 판별은 <code>i % 2 == 0</code>. 다 한 학생에게는 “홀수 번째만 보이게 바꾸기”를 추가로 제시합니다.</p>' },
          { layout: 'diagram', title: '문자열은 바꿀 수 없다 (immutable)', html: SVG_IMMUTABLE, caption: '글자 하나 대입은 TypeError — 새 문자열을 만들어 다시 대입',
            notes: '<p><b>[4분]</b> 셸에서 <code>ss[0] = \'X\'</code> 를 실행해 오류를 직접 보여 줍니다. “item assignment 를 지원하지 않는다” = 항목 대입 불가.</p><p>비유: 인쇄된 책의 글자는 못 고치고, 고친 내용으로 새로 인쇄해야 한다.</p>' },
          { layout: 'code', title: '새 문자열을 만들어 다시 대입', code: `ss = '파이썬'
ss = 'X' + ss[1:]
print(ss)

outStr = ""
for ch in "abc" :
    outStr += ch * 2
print(outStr)`, points: ['슬라이싱 + 연결로 “바꾼 것처럼”', '<code>+=</code> 는 새 문자열을 만들어 재대입', '빈 문자열 <code>""</code> 에서 쌓아 가기'],
            notes: '<p><b>[3분]</b> 두 번째 예의 결과 <code>aabbcc</code> 를 예측시킵니다. 빈 문자열에서 시작해 쌓아 가는 패턴이 [프로그램 1] 의 핵심입니다.</p>' },
          { layout: 'diagram', title: '[프로그램 1] 거꾸로 만드는 원리', html: SVG_REVERSE, caption: 'outStr += inStr[count - (i + 1)]',
            notes: '<p><b>[4분]</b> i 가 0 → 5 로 커질 때 꺼내는 인덱스가 5 → 0 으로 작아지는 것을 표로 확인합니다. <code>count - (i + 1)</code> 에서 +1 이 왜 필요한지 질문하세요 (마지막 인덱스는 count - 1).</p>' },
          { layout: 'code', title: '[프로그램 1] Code08-02. 문자열 거꾸로 출력', code: CODE_0802, stdin: '즐거운 Python 프로그래밍~~~\n', points: ['빈 문자열 <code>outStr</code> 에 쌓기', '마지막 글자부터 꺼내기', '<code>%s</code> 서식으로 출력'],
            notes: '<p><b>[5분]</b> “예시 입력으로 실행” 후 학생들이 자기 이름 · 문장을 넣어 보게 합니다. 영어 · 한글 · 공백이 섞여도 잘 되는지 확인.</p>' },
          { layout: 'code', title: '📘 한 줄로: 슬라이싱 [::-1]', code: `inStr = input("문자열을 입력하세요 : ")
print("내용을 거꾸로 출력 -->", inStr[::-1])`, stdin: '즐거운 Python 프로그래밍~~~\n', points: ['반복문 없이 같은 결과', '원리는 반복문 버전으로 이해', '실무에서는 슬라이싱'],
            notes: '<p><b>[2분]</b> 간단하지만, 반복문 버전을 먼저 이해해야 “한 글자씩 처리” 능력이 생긴다는 점을 강조합니다.</p>' },
          { layout: 'table', title: '📘 문자열 안에 값 넣기', head: ['방법', '코드', '결과'], rows: [['% 서식', '"%s는 %d살" % (n, a)', '철수는 15살'], ['format()', '"{}는 {}살".format(n, a)', '철수는 15살'], ['f-string', 'f"{n}는 {a}살"', '철수는 15살'], ['소수점', 'f"{3.14159:.2f}"', '3.14'], ['천 단위', 'f"{1234567:,}"', '1,234,567']],
            lead: '파이썬 3.6+ 에서는 f-string 을 권장',
            notes: '<p><b>[4분]</b> 강의자료 코드(%s)를 읽을 수 있을 정도로만 % 서식을 소개하고, 새 코드는 f-string 으로 쓰도록 안내합니다.</p>' },
          { layout: 'code', title: '📘 f-string 사용하기', code: `name = "홍길동"
age = 20
height = 175.456
print("%s님은 %d살" % (name, age))
print(f"{name}님은 {age}살, 키는 {height:.1f}cm")
print(f"내년에는 {age + 1}살")`, points: ['앞에 <code>f</code>, 값은 <code>{ }</code> 안에', '<code>:.1f</code> 소수점 1자리', '중괄호 안에 식도 가능'],
            notes: '<p><b>[3분]</b> 흔한 실수: 앞에 f 를 빼먹으면 <code>{name}</code> 이 그대로 출력됩니다. 직접 f 를 지우고 실행해 보여 주세요.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: `다음 코드의 결과는?<pre><code>out = ""
for ch in "abc" :
    out = ch + out
print(out)</code></pre>`, options: ['abc', 'cba', 'aabbcc', 'c'], answer: 1, explain: '새 글자를 앞에 붙이므로 a → ba → cba 가 됩니다.',
            notes: '<p><b>[2분]</b> 추가 예제의 “방법 3” 입니다. <code>out + ch</code> 와 <code>ch + out</code> 의 차이를 비교해 주세요.</p>' },
          { layout: 'summary', title: '정리', bullets: ['<code>for i in range(0, len(ss))</code> 또는 <code>for ch in ss</code> 로 한 글자씩', '문자열은 <b>불변</b> — 새 문자열을 만들어 다시 대입', '빈 문자열 + <code>+=</code> 로 결과를 쌓아 가기', '[프로그램 1] 완성, 한 줄 버전 <code>inStr[::-1]</code>', 'f-string: <code>f"{변수}"</code>'],
            notes: '<p><b>[1분]</b> 다음 교시: 문자열 함수(대소문자 · 찾기 · 공백 삭제 · 바꾸기).</p>' }
        ]
      },

      /* ===================== ch08-3 ===================== */
      {
        id: 'ch08-3',
        title: '문자열 함수 ①: 변환 · 찾기 · 삭제 · 변경',
        minutes: 50,
        goals: [
          '함수와 메서드의 호출 형식 차이를 설명할 수 있다',
          'upper · lower · swapcase · title 로 대소문자를 바꿀 수 있다',
          'count · find · rfind · index · rindex · startswith · endswith 로 문자열을 찾고 검사할 수 있다',
          'strip · lstrip · rstrip 으로 앞뒤 글자를 지우고, replace 로 문자열을 바꿀 수 있다'
        ],
        flow: [['함수와 메서드', 5], ['대소문자 변환', 7], ['문자열 찾기 · Code08-03', 15], ['공백 삭제 · Code08-04 · SELF STUDY 8-2', 13], ['replace · Code08-05 · 퀴즈', 10]],
        content: [
          { type: 'h', text: '문자열 함수의 사용' },
          { type: 'p', html: `파이썬의 문자열에는 자주 쓰는 기능이 <b>함수</b> 형태로 잔뜩 들어 있습니다. 대문자로 바꾸기, 특정 단어 찾기, 공백 지우기, 단어 바꾸기, 쪼개기 등을 직접 반복문으로 만들 필요 없이 한 줄로 처리할 수 있습니다.` },
          { type: 'h', text: '여기서 잠깐: 함수(function)와 메서드(method)' },
          { type: 'p', html: `지금까지 쓴 <code>len(ss)</code> 는 <b>함수</b>입니다. 함수는 단독으로 쓰고, 처리할 대상을 괄호 안에 넣습니다. 반면 <code>ss.upper()</code> 처럼 <b>변수명.기능()</b> 형식으로 쓰는 것을 <b>메서드</b>라고 합니다. 메서드는 문자열 자료형 안에 그 기능이 들어 있기 때문에 점(<code>.</code>)으로 꺼내 씁니다.` },
          { type: 'figure', html: SVG_METHOD, caption: '함수는 len(ss), 메서드는 ss.upper()' },
          { type: 'code', title: '추가 예제. 함수와 메서드 호출 비교', code: `ss = "abcd"
print(len(ss))       # 함수 : 함수이름(대상)
print(ss.upper())    # 메서드 : 대상.메서드이름()`, expect: `4
ABCD` },
          { type: 'callout', kind: 'info', title: '지금은 모두 “함수”라고 불러도 OK', html: '12장 객체지향 프로그래밍에서는 함수와 메서드를 정확히 구분해야 하지만, 지금은 “둘 다 뒤에 괄호가 붙는다” 정도만 알면 됩니다. 이 장에서는 문자열의 메서드도 편하게 <b>문자열 함수</b>라고 부릅니다.' },
          { type: 'h', text: '대문자와 소문자 변환하기: upper(), lower(), swapcase(), title()' },
          { type: 'code', repl: true, title: '대소문자 변환 함수', code: `ss = 'Python is Easy. 그래서 programming이 재미있습니다. ^^'
ss.upper()
ss.lower()
ss.swapcase()
ss.title()`, expect: `>>> ss = 'Python is Easy. 그래서 programming이 재미있습니다. ^^'
>>> ss.upper()
'PYTHON IS EASY. 그래서 PROGRAMMING이 재미있습니다. ^^'
>>> ss.lower()
'python is easy. 그래서 programming이 재미있습니다. ^^'
>>> ss.swapcase()
'pYTHON IS eASY. 그래서 PROGRAMMING이 재미있습니다. ^^'
>>> ss.title()
'Python Is Easy. 그래서 Programming이 재미있습니다. ^^'
>>>` },
          { type: 'table', head: ['함수', '하는 일'], rows: [
            ['<code>upper()</code>', '모두 대문자로'],
            ['<code>lower()</code>', '모두 소문자로'],
            ['<code>swapcase()</code>', '대문자 ↔ 소문자 서로 바꾸기'],
            ['<code>title()</code>', '각 단어의 첫 글자만 대문자로']
          ], caption: '한글 · 숫자 · 기호는 대소문자가 없으므로 그대로 남는다' },
          { type: 'callout', kind: 'warn', title: '원래 문자열은 바뀌지 않는다', html: `문자열은 불변이므로 <code>ss.upper()</code> 는 <b>대문자로 바뀐 새 문자열을 돌려줄 뿐</b>, <code>ss</code> 자체는 그대로입니다. 결과를 계속 쓰려면 <code>ss = ss.upper()</code> 처럼 다시 대입해야 합니다. 이 장의 모든 문자열 함수가 마찬가지입니다.` },
          { type: 'code', title: '추가 예제. 결과를 다시 대입해야 바뀐다', code: `ss = "Hello"
ss.upper()
print(ss)
ss = ss.upper()
print(ss)`, expect: `Hello
HELLO` },
          { type: 'code', title: '추가 예제. 대소문자 구분 없이 비교하기', code: `answer = input("파이썬의 영어 이름은? ")
if answer.lower() == "python" :
    print("정답!")
else :
    print("오답!")`, stdin: 'PyThOn\n', expect: `파이썬의 영어 이름은? PyThOn
정답!`, desc: '사용자가 대문자 · 소문자를 섞어 입력해도 <code>lower()</code> 로 모두 소문자로 바꾼 뒤 비교하면 정답으로 처리됩니다.' },
          { type: 'h', text: '문자열 찾기: count(), find(), rfind(), index(), rindex(), startswith(), endswith()' },
          { type: 'figure', html: SVG_FIND, caption: 'find 는 앞에서, rfind 는 뒤에서 찾는다 — 없으면 find 는 -1, index 는 오류' },
          { type: 'code', repl: true, title: '문자열 찾기 함수', code: `ss = '파이썬 공부는 즐겁습니다. 물론 모든 공부가 다 재미있지는 않죠. ^^'
ss.count('공부')
print(ss.find('공부'), ss.rfind('공부'), ss.find('공부', 5), ss.find('없다'))
print(ss.index('공부'), ss.rindex('공부'), ss.index('공부', 5))
print(ss.startswith('파이썬'), ss.startswith('파이썬', 10), ss.endswith('^^'))`, expect: `>>> ss = '파이썬 공부는 즐겁습니다. 물론 모든 공부가 다 재미있지는 않죠. ^^'
>>> ss.count('공부')
2
>>> print(ss.find('공부'), ss.rfind('공부'), ss.find('공부', 5), ss.find('없다'))
4 21 21 -1
>>> print(ss.index('공부'), ss.rindex('공부'), ss.index('공부', 5))
4 21 21
>>> print(ss.startswith('파이썬'), ss.startswith('파이썬', 10), ss.endswith('^^'))
True False True
>>>` },
          { type: 'table', head: ['함수', '하는 일', '위 예의 결과'], rows: [
            [`<code>count('공부')</code>`, '몇 번 나오는지 개수', '2'],
            [`<code>find('공부')</code>`, '<b>처음</b> 나오는 위치(인덱스). 없으면 <b>-1</b>', '4'],
            [`<code>rfind('공부')</code>`, '<b>오른쪽(뒤)부터</b> 찾아 마지막으로 나오는 위치', '21'],
            [`<code>find('공부', 5)</code>`, '5번 위치부터 찾기 시작', '21'],
            [`<code>index('공부')</code>`, 'find 와 같지만, 없으면 <b>ValueError 오류</b>', '4'],
            [`<code>rindex('공부')</code>`, 'rfind 와 같지만, 없으면 오류', '21'],
            [`<code>startswith('파이썬')</code>`, '그 글자로 <b>시작</b>하면 True', 'True'],
            [`<code>startswith('파이썬', 10)</code>`, '10번 위치부터 봤을 때 그 글자로 시작하면 True', 'False'],
            [`<code>endswith('^^')</code>`, '그 글자로 <b>끝나면</b> True', 'True']
          ] },
          { type: 'callout', kind: 'tip', title: 'find 와 index, 무엇을 쓸까?', html: `찾는 글자가 <b>없을 수도 있다면</b> <code>find()</code> 를 쓰고 결과가 <code>-1</code> 인지 검사하세요. <code>index()</code> 는 없을 때 프로그램이 오류로 멈춥니다. 단순히 “들어 있나?”만 궁금하면 <code>'공부' in ss</code> 가 가장 간단합니다.` },
          { type: 'code', title: '추가 예제. index() 는 없으면 오류', code: `ss = '파이썬 공부는 즐겁습니다.'
print(ss.find('자바'))
print(ss.index('자바'))`, expectError: true, expect: `-1
Traceback (most recent call last):
  File "main.py", line 3, in <module>
    print(ss.index('자바'))
          ~~~~~~~~^^^^^^^^
ValueError: substring not found` },
          { type: 'code', title: '추가 예제. find() 와 슬라이싱으로 이메일 나누기', code: `email = "python@hanbit.co.kr"
pos = email.find('@')
print("@ 위치 :", pos)
print("아이디 :", email[:pos])
print("도메인 :", email[pos + 1:])`, expect: `@ 위치 : 6
아이디 : python
도메인 : hanbit.co.kr`, desc: '<code>find()</code> 가 돌려준 위치를 슬라이싱의 경계로 쓰면 원하는 부분만 잘라 낼 수 있습니다.' },
          { type: 'h', text: '괄호로 감싸 주는 프로그램' },
          { type: 'p', html: `<code>startswith()</code> 와 <code>endswith()</code> 를 이용해, 입력한 문자열이 괄호로 감싸 있지 않으면 괄호를 붙여 주는 프로그램을 만들어 봅시다. 이미 <code>(</code> 로 시작하면 앞 괄호는 붙이지 않고, 이미 <code>)</code> 로 끝나면 뒤 괄호는 붙이지 않습니다.` },
          { type: 'code', title: 'Code08-03. 문자열을 괄호로 감싸기', code: `ss = input("입력 문자열 ==> ")
print("출력 문자열 ==> ", end = '')

if ss.startswith('(') == False :
    print("(", end = '')

print(ss, end = '')

if ss.endswith(')') == False :
    print(")", end = '')`, stdin: '파이썬 열공 중~~\n', expect: `입력 문자열 ==> 파이썬 열공 중~~
출력 문자열 ==> (파이썬 열공 중~~)`,
            desc: '<code>4~5행</code> <code>(</code> 로 시작하지 않을 때만 앞 괄호를 출력하고, <code>9~10행</code> <code>)</code> 로 끝나지 않을 때만 뒤 괄호를 출력합니다. <code>(파이썬</code> 처럼 앞 괄호만 있는 문자열을 입력해 보세요.' },
          { type: 'code', title: '추가 예제. 이미 앞 괄호가 있는 경우', code: `ss = input("입력 문자열 ==> ")
print("출력 문자열 ==> ", end = '')

if not ss.startswith('(') :
    print("(", end = '')

print(ss, end = '')

if not ss.endswith(')') :
    print(")", end = '')`, stdin: '(파이썬 열공 중~~\n', expect: `입력 문자열 ==> (파이썬 열공 중~~
출력 문자열 ==> (파이썬 열공 중~~)`, desc: '<code>조건 == False</code> 는 <code>not 조건</code> 으로 쓸 수 있습니다. 파이썬에서는 <code>not</code> 을 쓰는 쪽이 더 자연스럽습니다.' },
          { type: 'h', text: '문자열 공백 삭제 · 변경하기: strip(), rstrip(), lstrip(), replace()' },
          { type: 'p', html: `입력받은 문자열의 앞뒤에 실수로 들어간 공백을 지울 때 <code>strip()</code> 을 씁니다. <code>lstrip()</code> 은 왼쪽(left)만, <code>rstrip()</code> 은 오른쪽(right)만 지웁니다. <b>가운데의 공백은 지우지 않습니다.</b>` },
          { type: 'code', repl: true, title: '앞뒤 공백 삭제', code: `ss = '   파  이  썬   '
ss.strip()
ss.rstrip()
ss.lstrip()`, expect: `>>> ss = '   파  이  썬   '
>>> ss.strip()
'파  이  썬'
>>> ss.rstrip()
'   파  이  썬'
>>> ss.lstrip()
'파  이  썬   '
>>>` },
          { type: 'p', html: `괄호 안에 글자를 넣으면 공백 대신 <b>그 글자들</b>을 앞뒤에서 지웁니다. 여러 글자를 넣으면 그중 <b>아무 글자나</b> 해당하면 지웁니다.` },
          { type: 'code', title: '앞뒤의 특정 문자 삭제', code: `ss = '----파---이---썬----'
print(ss.strip('-'))
ss = '<<<파 << 이 >> 썬>>>'
print(ss.strip('<>'))`, expect: `파---이---썬
파 << 이 >> 썬` },
          { type: 'figure', html: SVG_STRIP, caption: 'strip 은 양 끝에서만 지우고, 지울 글자가 아닌 글자를 만나면 멈춘다' },
          { type: 'h', text: '문자열 중간의 공백까지 지우기' },
          { type: 'p', html: `<code>strip()</code> 으로는 가운데 공백을 지울 수 없습니다. 모든 공백을 지우려면 한 글자씩 검사해서 <b>공백이 아닌 글자만</b> 새 문자열에 붙이면 됩니다.` },
          { type: 'code', title: 'Code08-04. 문자열 중간의 공백까지 삭제하기', code: `inStr = "  한글 Python 프로그래밍  "
outStr = ""

for i in range(0, len(inStr)) :
    if inStr[i] != ' ' :
        outStr += inStr[i]

print("원래 문자열 ==> " + '[' + inStr + ']')
print("공백 삭제 문자열 ==> " + '[' + outStr + ']')`, expect: `원래 문자열 ==> [  한글 Python 프로그래밍  ]
공백 삭제 문자열 ==> [한글Python프로그래밍]`,
            desc: '<code>5~6행</code> i 번째 글자가 공백 <code>\' \'</code> 이 아닐 때만 <code>outStr</code> 에 붙입니다. <code>8~9행</code> 앞뒤 공백이 잘 보이도록 대괄호로 감싸 출력합니다.' },
          { type: 'callout', kind: 'more', title: '📘 공백을 모두 지우는 더 쉬운 방법', html: `뒤에서 배울 <code>replace()</code> 를 쓰면 <code>inStr.replace(' ', '')</code> 한 줄로 모든 공백을 지울 수 있습니다. 또 <code>''.join(inStr.split())</code> 은 스페이스 · 탭 · 줄바꿈 같은 모든 종류의 공백을 한꺼번에 지웁니다(split · join 은 다음 교시).` },
          { type: 'h', text: '문자열 변경: replace()' },
          { type: 'p', html: `<code>replace('기존 글자', '새 글자')</code> 는 문자열 안의 기존 글자를 <b>모두</b> 새 글자로 바꾼 새 문자열을 돌려줍니다. 세 번째 값으로 횟수를 주면 앞에서부터 그 횟수만큼만 바꿉니다.` },
          { type: 'code', repl: true, title: '문자열 변경', code: `ss = '열심히 파이썬 공부 중~~'
ss.replace('파이썬', 'Python')`, expect: `>>> ss = '열심히 파이썬 공부 중~~'
>>> ss.replace('파이썬', 'Python')
'열심히 Python 공부 중~~'
>>>` },
          { type: 'code', title: '추가 예제. replace() 의 여러 쓰임', code: `ss = "나는 사과가 좋다. 사과는 맛있다. 사과 최고!"
print(ss.replace('사과', '딸기'))
print(ss.replace('사과', '딸기', 1))
print(ss.replace(' ', ''))
print(ss.replace('사과', ''))`, expect: `나는 딸기가 좋다. 딸기는 맛있다. 딸기 최고!
나는 딸기가 좋다. 사과는 맛있다. 사과 최고!
나는사과가좋다.사과는맛있다.사과최고!
나는 가 좋다. 는 맛있다.  최고!`, desc: '새 글자를 빈 문자열 <code>\'\'</code> 로 주면 해당 글자를 <b>삭제</b>하는 효과가 납니다.' },
          { type: 'h', text: '문자열 변경 응용: o 를 $ 로 바꾸기' },
          { type: 'code', title: 'Code08-05. 입력 문자열의 o 를 $ 로 변경', code: `ss = input("입력 문자열 ==> ")

print("출력 문자열 ==> ", end = '')
for i in range(0, len(ss)) :
    if ss[i] != 'o' :
        print(ss[i], end = '')
    else :
        print('$', end = '')`, stdin: 'IT CookBook for Python\n', expect: `입력 문자열 ==> IT CookBook for Python
출력 문자열 ==> IT C$$kB$$k f$r Pyth$n`,
            desc: '<code>4~8행</code> 한 글자씩 검사해서 <code>o</code> 가 아니면 그대로, <code>o</code> 이면 <code>$</code> 를 출력합니다.' },
          { type: 'p', html: `Code08-05 의 <code>4~8행</code> 반복문은 <code>replace()</code> 를 쓰면 <b>한 줄</b>로 줄어듭니다.` },
          { type: 'code', title: 'Code08-05 의 4~8행을 한 줄로', code: `ss = input("입력 문자열 ==> ")

print("출력 문자열 ==> ", end = '')
print(ss.replace('o', '$'))`, stdin: 'IT CookBook for Python\n', expect: `입력 문자열 ==> IT CookBook for Python
출력 문자열 ==> IT C$$kB$$k f$r Pyth$n` },
          { type: 'callout', kind: 'more', title: '📘 문자열 함수는 대소문자를 구분한다', html: `<code>'IT CookBook'.replace('o', '$')</code> 는 소문자 o 만 바꾸고 대문자 <code>O</code> 는 그대로 둡니다. <code>find()</code>, <code>count()</code>, <code>startswith()</code>, <code>in</code> 도 모두 대소문자를 구분합니다. 구분 없이 처리하려면 먼저 <code>lower()</code> 로 바꾼 뒤 사용하세요.` }
        ],
        practice: [
          {
            title: 'SELF STUDY 8-2. 꺾쇠 괄호 없애기',
            level: 1,
            desc: `<p>Code08-04 를 수정해서 <code>'&lt;&lt;&lt;파&lt;&lt;이&gt;&gt;썬&gt;&gt;&gt;'</code> 이 <code>'파이썬'</code> 으로 출력되도록 하세요.</p><pre>원래 문자열 ==> [&lt;&lt;&lt;파&lt;&lt;이&gt;&gt;썬&gt;&gt;&gt;]
꺾쇠 삭제 문자열 ==> [파이썬]</pre>`,
            hint: `if 문에서 <code>'&lt;'</code> 이 아닐 때와 <code>'&gt;'</code> 이 아닐 때를 <code>and</code> 로 연결해야 합니다.`,
            starter: `inStr = "<<<파<<이>>썬>>>"
outStr = ""

for i in range(0, len(inStr)) :
    # TODO: '<' 도 아니고 '>' 도 아닌 글자만 outStr 에 붙이기
    pass

print("원래 문자열 ==> " + '[' + inStr + ']')
print("꺾쇠 삭제 문자열 ==> " + '[' + outStr + ']')
`,
            solution: `inStr = "<<<파<<이>>썬>>>"
outStr = ""

for i in range(0, len(inStr)) :
    if inStr[i] != '<' and inStr[i] != '>' :
        outStr += inStr[i]

print("원래 문자열 ==> " + '[' + inStr + ']')
print("꺾쇠 삭제 문자열 ==> " + '[' + outStr + ']')
`,
            expect: `원래 문자열 ==> [<<<파<<이>>썬>>>]
꺾쇠 삭제 문자열 ==> [파이썬]`
          },
          {
            title: '실습 8-5. 이메일 주소 분석기',
            level: 2,
            desc: `<p>이메일 주소를 입력받아 앞뒤 공백을 지운 뒤, <code>@</code> 가 있으면 아이디와 도메인을 나누어 출력하고, 없으면 <code>잘못된 이메일입니다.</code> 를 출력하세요. 도메인이 <code>.kr</code> 로 끝나면 <code>한국 도메인</code> 이라고도 알려 줍니다.</p><pre>이메일 : &nbsp;&nbsp;python@hanbit.co.kr
아이디 : python
도메인 : hanbit.co.kr
한국 도메인입니다.</pre>`,
            hint: '<code>strip()</code> → <code>find(\'@\')</code> 결과가 <code>-1</code> 인지 검사 → 슬라이싱 → <code>endswith(\'.kr\')</code>',
            starter: `email = input("이메일 : ")
# TODO: 앞뒤 공백 지우기

pos = email.find('@')
# TODO: pos 가 -1 이면 "잘못된 이메일입니다."
#       아니면 아이디 / 도메인 출력, .kr 로 끝나면 "한국 도메인입니다."
`,
            solution: `email = input("이메일 : ")
email = email.strip()

pos = email.find('@')
if pos == -1 :
    print("잘못된 이메일입니다.")
else :
    print("아이디 :", email[:pos])
    print("도메인 :", email[pos + 1:])
    if email.endswith('.kr') :
        print("한국 도메인입니다.")
`,
            stdin: '  python@hanbit.co.kr\n',
            expect: `이메일 :   python@hanbit.co.kr
아이디 : python
도메인 : hanbit.co.kr
한국 도메인입니다.`
          },
          {
            title: '실습 8-6. 금지어 필터',
            level: 2,
            desc: `<p>채팅 문장을 입력받아 금지어 <code>바보</code>, <code>멍청이</code> 를 글자 수만큼의 <code>*</code> 로 바꾸어 출력하고, 금지어가 모두 몇 번 나왔는지도 출력하세요.</p><pre>채팅 입력 : 너 바보야? 바보 멍청이!
필터 결과 : 너 **야? ** ***!
금지어 3회 발견</pre>`,
            hint: '<code>count()</code> 로 개수를 먼저 세고, <code>replace(금지어, \'*\' * len(금지어))</code> 로 바꿉니다.',
            starter: `msg = input("채팅 입력 : ")
bad1 = '바보'
bad2 = '멍청이'

# TODO: 금지어 개수 세기 (count)
total = 0

# TODO: 금지어를 * 로 바꾸기 (replace)

print("필터 결과 :", msg)
print(f"금지어 {total}회 발견")
`,
            solution: `msg = input("채팅 입력 : ")
bad1 = '바보'
bad2 = '멍청이'

total = msg.count(bad1) + msg.count(bad2)

msg = msg.replace(bad1, '*' * len(bad1))
msg = msg.replace(bad2, '*' * len(bad2))

print("필터 결과 :", msg)
print(f"금지어 {total}회 발견")
`,
            stdin: '너 바보야? 바보 멍청이!\n',
            expect: `채팅 입력 : 너 바보야? 바보 멍청이!
필터 결과 : 너 **야? ** ***!
금지어 3회 발견`
          }
        ],
        quiz: [
          { q: `<code>'Hello World'.swapcase()</code> 의 결과는?`, options: [`'HELLO WORLD'`, `'hello world'`, `'hELLO wORLD'`, `'Hello World'`], answer: 2, explain: 'swapcase() 는 대문자는 소문자로, 소문자는 대문자로 서로 바꿉니다.' },
          { q: `다음 코드의 실행 결과는?<pre><code>ss = 'banana'
print(ss.find('an'), ss.rfind('an'), ss.find('x'))</code></pre>`, options: ['1 3 -1', '1 3 0', '1 4 -1', '2 4 오류'], answer: 0, explain: `'an' 은 인덱스 1 과 3 에 있습니다. find 는 처음 위치(1), rfind 는 마지막 위치(3), 없으면 -1 입니다.` },
          { q: `<code>'  a b c  '.strip()</code> 의 결과는?`, options: [`'abc'`, `'a b c'`, `'a b c  '`, `'  a b c'`], answer: 1, explain: 'strip() 은 앞뒤의 공백만 지우고 가운데 공백은 남겨 둡니다.' },
          { q: `다음 코드의 실행 결과는?<pre><code>ss = 'python'
ss.upper()
print(ss)</code></pre>`, options: ['PYTHON', 'python', 'Python', '오류'], answer: 1, explain: 'upper() 는 새 문자열을 돌려줄 뿐 ss 를 바꾸지 않습니다. <code>ss = ss.upper()</code> 로 다시 대입해야 합니다.' },
          { q: `찾는 글자가 없을 때 <b>오류가 발생하는</b> 함수는?`, options: ['find()', 'rfind()', 'index()', 'count()'], answer: 2, explain: 'index() 와 rindex() 는 없으면 ValueError 가 발생합니다. find() 는 -1, count() 는 0 을 돌려줍니다.' }
        ],
        slides: [
          { layout: 'title', title: '문자열 함수 ①', subtitle: '대소문자 변환 · 찾기 · 공백 삭제 · 변경', badge: '08-3',
            notes: '<p><b>[도입 1분]</b> “지난 시간 공백을 지우려고 반복문을 썼죠? 파이썬에는 이런 일을 한 줄로 해 주는 함수가 잔뜩 있습니다.”</p>' },
          { layout: 'diagram', title: '여기서 잠깐: 함수와 메서드', html: SVG_METHOD, caption: '함수는 단독으로, 메서드는 변수명.메서드() 로',
            notes: '<p><b>[3분]</b> 비유: 함수는 “공용 도구”(누구에게나 len 을 쓸 수 있음), 메서드는 “문자열이 가지고 다니는 개인 도구”.</p><p>12장 전까지는 모두 “함수”라고 불러도 된다고 안심시킵니다.</p>' },
          { layout: 'code', title: '대소문자 변환', code: `ss = 'Python is Easy. 그래서 programming이 재미있습니다. ^^'
ss.upper()
ss.lower()
ss.swapcase()
ss.title()`, repl: true, points: ['<code>upper</code> 대문자 · <code>lower</code> 소문자', '<code>swapcase</code> 서로 바꾸기', '<code>title</code> 단어 첫 글자만 대문자', '한글 · 기호는 그대로'],
            notes: '<p><b>[4분]</b> 실행 후 반드시 <code>ss</code> 를 한 번 더 입력해 원래 문자열이 바뀌지 않았음을 보여 주세요. → <code>ss = ss.upper()</code> 의 필요성.</p><p>활용: 대소문자 구분 없는 비교 <code>answer.lower() == "python"</code>.</p>' },
          { layout: 'diagram', title: '문자열 찾기', html: SVG_FIND, caption: 'find · rfind · count · index',
            notes: '<p><b>[3분]</b> 짧은 문자열로 원리를 먼저 설명한 뒤 강의자료의 긴 문장 예제로 넘어갑니다.</p>' },
          { layout: 'code', title: '찾기 함수 한눈에', code: `ss = '파이썬 공부는 즐겁습니다. 물론 모든 공부가 다 재미있지는 않죠. ^^'
ss.count('공부')
print(ss.find('공부'), ss.rfind('공부'), ss.find('공부', 5), ss.find('없다'))
print(ss.index('공부'), ss.rindex('공부'), ss.index('공부', 5))
print(ss.startswith('파이썬'), ss.startswith('파이썬', 10), ss.endswith('^^'))`, repl: true,
            points: ['<code>find</code> 없으면 -1', '<code>index</code> 없으면 오류', '두 번째 값 = 찾기 시작 위치', 'starts/endswith → True/False'],
            notes: '<p><b>[5분]</b> “21 은 어떻게 나왔을까?” — 공백과 마침표도 한 글자로 세어야 함을 손으로 세어 보게 합니다.</p><p><code>ss.index(\'없다\')</code> 를 입력해 ValueError 도 보여 줍니다.</p>' },
          { layout: 'code', title: 'Code08-03. 괄호로 감싸기', code: `ss = input("입력 문자열 ==> ")
print("출력 문자열 ==> ", end = '')

if ss.startswith('(') == False :
    print("(", end = '')

print(ss, end = '')

if ss.endswith(')') == False :
    print(")", end = '')`, stdin: '파이썬 열공 중~~\n', points: ['( 로 시작하지 않으면 앞 괄호', ') 로 끝나지 않으면 뒤 괄호', '<code>== False</code> 대신 <code>not</code> 도 가능'],
            notes: '<p><b>[4분]</b> 입력을 <code>(파이썬</code>, <code>파이썬)</code>, <code>(파이썬)</code> 으로 바꿔 가며 실행해 봅니다.</p>' },
          { layout: 'two', title: '앞뒤 글자 삭제: strip', left: { title: '공백 삭제', code: `ss = '   파  이  썬   '
ss.strip()
ss.rstrip()
ss.lstrip()`, repl: true }, right: { title: '특정 문자 삭제', code: `ss = '----파---이---썬----'
print(ss.strip('-'))
ss = '<<<파 << 이 >> 썬>>>'
print(ss.strip('<>'))` },
            notes: '<p><b>[4분]</b> 핵심: strip 은 <b>양 끝</b>에서만 지운다 — 가운데의 공백과 - 는 그대로. r = right, l = left.</p><p>실제 활용: <code>input().strip()</code> 으로 사용자가 실수로 넣은 앞뒤 공백 제거.</p>' },
          { layout: 'code', title: 'Code08-04. 중간 공백까지 삭제', code: `inStr = "  한글 Python 프로그래밍  "
outStr = ""

for i in range(0, len(inStr)) :
    if inStr[i] != ' ' :
        outStr += inStr[i]

print("원래 문자열 ==> " + '[' + inStr + ']')
print("공백 삭제 문자열 ==> " + '[' + outStr + ']')`, points: ['공백이 아닌 글자만 붙이기', '대괄호로 감싸 공백을 눈으로 확인', '📘 한 줄: <code>inStr.replace(\' \', \'\')</code>'],
            notes: '<p><b>[3분]</b> strip() 과 결과를 비교합니다. 다음 SELF STUDY 8-2 로 자연스럽게 연결.</p>' },
          { layout: 'practice', title: 'SELF STUDY 8-2', desc: `Code08-04 를 수정해서 <code>'&lt;&lt;&lt;파&lt;&lt;이&gt;&gt;썬&gt;&gt;&gt;'</code> 이 <code>'파이썬'</code> 으로 출력되게 하기`, starter: `inStr = "<<<파<<이>>썬>>>"
outStr = ""
for i in range(0, len(inStr)) :
    # TODO
    pass
print("[" + outStr + "]")
`, solution: `inStr = "<<<파<<이>>썬>>>"
outStr = ""
for i in range(0, len(inStr)) :
    if inStr[i] != '<' and inStr[i] != '>' :
        outStr += inStr[i]
print("[" + outStr + "]")
`,
            notes: '<p><b>[5분]</b> 흔한 오답: <code>or</code> 로 연결 → 모든 글자가 통과합니다. 왜 그런지 “< 는 > 가 아니므로 True” 로 설명.</p><p>strip(\'<>\') 로는 안 되는 이유도 질문 (가운데의 << >> 가 남음).</p>' },
          { layout: 'code', title: '문자열 변경: replace', code: `ss = '열심히 파이썬 공부 중~~'
print(ss.replace('파이썬', 'Python'))

ss = input("입력 문자열 ==> ")
print("출력 문자열 ==> ", end = '')
print(ss.replace('o', '$'))`, stdin: 'IT CookBook for Python\n', points: ['<code>replace(기존, 새것)</code> 모두 바꿈', 'Code08-05 의 4~8행을 한 줄로', '새것을 <code>\'\'</code> 로 → 삭제'],
            notes: '<p><b>[4분]</b> 강의자료 Code08-05 는 반복문 버전입니다(본문 참고). 두 버전의 결과가 같음을 확인하고, 대문자 O 는 바뀌지 않는다는 점(대소문자 구분)도 짚어 주세요.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: `<code>'banana'.replace('a', 'o', 2)</code> 의 결과는?`, options: [`'bonono'`, `'bonona'`, `'banono'`, `'bnn'`], answer: 1, explain: '세 번째 값 2 는 앞에서부터 2번만 바꾸라는 뜻입니다.',
            notes: '<p><b>[2분]</b> 세 번째 값을 모르는 학생이 많으므로 본문 추가 예제와 연결해 설명합니다.</p>' },
          { layout: 'summary', title: '정리', bullets: ['변환: <code>upper · lower · swapcase · title</code>', '찾기: <code>count · find(-1) · rfind · index(오류) · startswith · endswith</code>', '삭제: <code>strip · lstrip · rstrip</code> (앞뒤만)', '변경: <code>replace(기존, 새것[, 횟수])</code>', '모든 함수는 <b>새 문자열</b>을 돌려준다 (원본 불변)'],
            notes: '<p><b>[1분]</b> 다음 교시: 분리 · 결합 · 정렬 · 구성 파악과 [프로그램 2] 거북이 글자쓰기.</p>' }
        ]
      },

      /* ===================== ch08-4 ===================== */
      {
        id: 'ch08-4',
        title: '문자열 함수 ②: 분리 · 결합 · 정렬 · 구성 파악과 [프로그램 2]',
        minutes: 50,
        goals: [
          'split · splitlines · join 으로 문자열을 나누고 합칠 수 있다',
          'map() 으로 리스트의 모든 항목에 함수를 적용할 수 있다',
          'center · ljust · rjust · zfill 로 문자열을 정렬하고 채울 수 있다',
          'isdigit · isalpha · isalnum 등으로 문자열의 구성을 판단할 수 있다',
          '[프로그램 2] 임의의 위치에 글자를 쓰는 거북이를 완성할 수 있다'
        ],
        flow: [['split · join · Code08-06', 12], ['map() 함수', 5], ['정렬 · 채우기', 5], ['구성 파악 · SELF STUDY 8-3', 10], ['[프로그램 2] 완성', 13], ['정리 · 퀴즈', 5]],
        content: [
          { type: 'h', text: '문자열 분리 · 결합하기: split(), splitlines(), join()' },
          { type: 'p', html: `<code>split()</code> 은 문자열을 <b>잘게 쪼개서 리스트</b>로 만듭니다. 괄호가 비어 있으면 공백을 기준으로, 괄호 안에 글자를 넣으면 그 글자를 기준(구분자)으로 나눕니다. <code>splitlines()</code> 는 줄바꿈 기준으로 나눕니다. 반대로 <code>join()</code> 은 <b>리스트나 문자열의 항목들 사이사이에 글자를 끼워 넣어 하나의 문자열</b>로 합칩니다.` },
          { type: 'code', repl: true, title: '문자열 분리 · 결합', code: `ss = 'Python을 열심히 공부 중'
ss.split()
ss = '하나:둘:셋'
ss.split(':')
ss = '하나\\n둘\\n셋'
ss.splitlines()
ss = '%'
ss.join('파이썬')`, expect: `>>> ss = 'Python을 열심히 공부 중'
>>> ss.split()
['Python을', '열심히', '공부', '중']
>>> ss = '하나:둘:셋'
>>> ss.split(':')
['하나', '둘', '셋']
>>> ss = '하나\\n둘\\n셋'
>>> ss.splitlines()
['하나', '둘', '셋']
>>> ss = '%'
>>> ss.join('파이썬')
'파%이%썬'
>>>`, desc: `<code>'%'.join('파이썬')</code> 은 '파', '이', '썬' 사이사이에 % 를 끼워 넣습니다. <b>끼워 넣을 글자가 점(.) 앞</b>에 온다는 점이 헷갈리기 쉽습니다.` },
          { type: 'figure', html: SVG_SPLIT, caption: 'split 은 문자열 → 리스트, join 은 리스트 → 문자열' },
          { type: 'code', title: '추가 예제. split 과 join 을 함께 쓰기', code: `fruits = "사과,바나나,딸기"
fruitList = fruits.split(',')
print(fruitList)
print(len(fruitList), "종류")

print(' / '.join(fruitList))
print(''.join(fruitList))
print('-'.join(['2026', '09', '18']))`, expect: `['사과', '바나나', '딸기']
3 종류
사과 / 바나나 / 딸기
사과바나나딸기
2026-09-18` },
          { type: 'callout', kind: 'warn', title: 'join 에는 문자열만', html: `<code>'-'.join([2026, 9, 18])</code> 처럼 숫자가 든 리스트를 합치면 <code>TypeError</code> 가 납니다. 숫자는 먼저 문자열로 바꿔야 합니다: <code>'-'.join(map(str, [2026, 9, 18]))</code> (map 은 아래에서 배웁니다).` },
          { type: 'h', text: '날짜를 입력받아 10년 후 날짜 출력하기' },
          { type: 'p', html: `<code>2019/12/31</code> 처럼 연/월/일 형식으로 입력받은 문자열을 <code>split('/')</code> 로 나누면 <code>['2019', '12', '31']</code> 리스트가 됩니다. 연도는 <b>문자열</b>이므로 <code>int()</code> 로 숫자로 바꾼 뒤 10을 더하고, 다시 <code>str()</code> 로 바꿔 문자열과 연결합니다.` },
          { type: 'code', title: 'Code08-06. 10년 후 날짜 출력하기', code: `ss = input("날짜(연/월/일) 입력 ==> ")

ssList = ss.split('/')

print("입력한 날짜의 10년 후 ==> ", end = '')
print(str(int(ssList[0]) + 10) + "년", end = '')
print(ssList[1] + "월", end = '')
print(ssList[2] + "일")`, stdin: '2019/12/31\n', expect: `날짜(연/월/일) 입력 ==> 2019/12/31
입력한 날짜의 10년 후 ==> 2029년12월31일`,
            desc: '<code>3행</code> 입력 문자열을 / 기준으로 나눠 리스트로 만듭니다. <code>6행</code> <code>ssList[0]</code>(\'2019\')을 정수로 바꿔 10을 더한 뒤(2029) 다시 문자열로 바꿔 \'년\' 과 연결합니다. (강의자료 출력 화면의 “31년” 은 “31일” 의 오타입니다.)' },
          { type: 'code', title: '추가 예제. f-string 으로 더 간단하게', code: `ss = input("날짜(연/월/일) 입력 ==> ")
year, month, day = ss.split('/')
print(f"입력한 날짜의 10년 후 ==> {int(year) + 10}년 {month}월 {day}일")`, stdin: '2019/12/31\n', expect: `날짜(연/월/일) 입력 ==> 2019/12/31
입력한 날짜의 10년 후 ==> 2029년 12월 31일`, desc: '나눈 결과가 3개인 것을 알면 변수 세 개에 한 번에 나눠 담을 수 있습니다. f-string 안에서는 숫자를 <code>str()</code> 로 바꿀 필요도 없습니다.' },
          { type: 'h', text: '함수명에 대입하기: map() 함수' },
          { type: 'p', html: `<code>split()</code> 으로 나눈 결과는 모두 <b>문자열</b>입니다. 이것을 한꺼번에 정수로 바꾸고 싶을 때 <code>map(함수명, 리스트)</code> 를 씁니다. 리스트의 <b>모든 항목에 함수를 하나씩 적용</b>해 주며, 결과를 리스트로 보려면 <code>list()</code> 로 감쌉니다. 이때 함수명 뒤에 괄호를 붙이지 않는다는 점에 주의하세요(<code>int</code> O, <code>int()</code> X).` },
          { type: 'code', repl: true, title: 'map() 으로 모든 항목을 정수로', code: `before = ['2019', '12', '31']
after = list(map(int , before))
after`, expect: `>>> before = ['2019', '12', '31']
>>> after = list(map(int , before))
>>> after
[2019, 12, 31]
>>>` },
          { type: 'code', title: '추가 예제. 공백으로 구분된 숫자들의 합계', code: `ss = input("숫자들을 공백으로 구분해 입력 : ")
numList = list(map(int, ss.split()))
print("숫자 리스트 :", numList)
print("합계 :", sum(numList))
print("최댓값 :", max(numList))`, stdin: '10 20 30 45\n', expect: `숫자들을 공백으로 구분해 입력 : 10 20 30 45
숫자 리스트 : [10, 20, 30, 45]
합계 : 105
최댓값 : 45`, desc: '<code>input().split()</code> 과 <code>map(int, …)</code> 조합은 여러 숫자를 한 줄로 입력받을 때 아주 자주 쓰는 패턴입니다.' },
          { type: 'h', text: '문자열 정렬하기, 채우기: center(), ljust(), rjust(), zfill()' },
          { type: 'p', html: `지정한 폭(글자 칸 수) 안에서 문자열을 가운데 · 왼쪽 · 오른쪽에 배치하고 남는 칸을 채웁니다. <code>center()</code> 의 두 번째 값으로 채울 글자를 정할 수 있고, <code>zfill()</code> 은 왼쪽 빈칸을 <b>0</b> 으로 채웁니다(zero fill).` },
          { type: 'code', repl: true, title: '문자열 정렬과 채우기', code: `ss = '파이썬'
ss.center(10)
ss.center(10, '-')
ss.ljust(10)
ss.rjust(10)
ss.zfill(10)`, expect: `>>> ss = '파이썬'
>>> ss.center(10)
'   파이썬    '
>>> ss.center(10, '-')
'---파이썬----'
>>> ss.ljust(10)
'파이썬       '
>>> ss.rjust(10)
'       파이썬'
>>> ss.zfill(10)
'0000000파이썬'
>>>` },
          { type: 'figure', html: SVG_ALIGN, caption: '폭 10칸에 3글자를 배치하면 빈칸이 7개 — 어디에 두느냐의 차이' },
          { type: 'code', title: '추가 예제. 정렬 함수로 영수증 만들기', code: `print("영수증".center(20, '='))
print("아메리카노".ljust(10) + "4500".rjust(10))
print("케이크".ljust(10) + "6000".rjust(10))
print("=" * 20)
print("주문번호 " + "7".zfill(4))`, expect: `========영수증=========
아메리카노           4500
케이크             6000
====================
주문번호 0007`, desc: '파이썬은 한글도 1칸으로 세지만 화면에서는 한글이 영문보다 넓게 보여서 줄이 조금 어긋나 보일 수 있습니다. 숫자 · 영문 위주의 정렬에 특히 유용합니다.' },
          { type: 'h', text: '문자열 구성 파악하기: isdigit(), isalpha(), isalnum(), islower(), isupper(), isspace()' },
          { type: 'p', html: `문자열이 어떤 글자로 이루어졌는지 검사해서 <code>True</code> / <code>False</code> 로 알려 주는 함수들입니다. 사용자가 입력한 값이 숫자인지 확인한 뒤 <code>int()</code> 로 바꾸면 오류를 막을 수 있습니다.` },
          { type: 'code', repl: true, title: '문자열 구성 파악 함수', code: `'1234'.isdigit()
'abcd'.isalpha()
'abc123'.isalnum()
'abcd'.islower()
'ABCD'.isupper()
'   '.isspace()`, expect: `>>> '1234'.isdigit()
True
>>> 'abcd'.isalpha()
True
>>> 'abc123'.isalnum()
True
>>> 'abcd'.islower()
True
>>> 'ABCD'.isupper()
True
>>> '   '.isspace()
True
>>>` },
          { type: 'table', head: ['함수', 'True 가 되는 경우', '예 (True / False)'], rows: [
            ['<code>isdigit()</code>', '모두 <b>숫자</b>', `'1234' / '12.5', '-3'`],
            ['<code>isalpha()</code>', '모두 <b>글자</b>(영문 · <b>한글</b> 포함)', `'abc', '파이썬' / 'abc1'`],
            ['<code>isalnum()</code>', '모두 글자 또는 숫자 (섞여도 됨)', `'abc123' / 'abc 123', 'a!'`],
            ['<code>islower()</code>', '영문자가 모두 소문자', `'abcd' / 'Abcd'`],
            ['<code>isupper()</code>', '영문자가 모두 대문자', `'ABCD' / 'ABCd'`],
            ['<code>isspace()</code>', '모두 공백(스페이스 · 탭 · 줄바꿈)', `'   ' / ' a '`]
          ], caption: '빈 문자열 \'\' 은 모든 is 함수에서 False' },
          { type: 'callout', kind: 'warn', title: 'isdigit() 은 음수와 소수점을 숫자로 보지 않는다', html: `<code>'-3'.isdigit()</code>, <code>'12.5'.isdigit()</code> 는 모두 <code>False</code> 입니다. 부호 <code>-</code> 와 소수점 <code>.</code> 은 숫자가 아니기 때문입니다. 양의 정수 입력을 검사할 때 주로 사용합니다.` },
          { type: 'code', title: '추가 예제. 숫자만 입력받아 계산하기', code: `ss = input("나이를 입력하세요 : ")
if ss.isdigit() :
    age = int(ss)
    print(f"10년 후에는 {age + 10}살입니다.")
else :
    print("숫자만 입력하세요!")`, stdin: '스무살\n', expect: `나이를 입력하세요 : 스무살
숫자만 입력하세요!`, desc: '<code>isdigit()</code> 으로 먼저 검사하지 않고 <code>int(\'스무살\')</code> 을 하면 <code>ValueError</code> 오류로 프로그램이 멈춥니다.' },
          { type: 'h', text: 'SELF STUDY 8-3' },
          { type: 'p', html: `입력한 값이 영어나 한글이면 <code>글자입니다.</code>, 숫자이면 <code>숫자입니다.</code>, 섞여 있으면 <code>글자+숫자입니다.</code>, 특수문자 등이면 <code>모르겠습니다.</code> 가 출력되는 프로그램을 작성해 봅시다. <b>검사 순서</b>가 중요합니다 — <code>isalnum()</code> 은 숫자만 있거나 글자만 있어도 True 이므로 가장 나중에 검사해야 합니다. (아래 실습 과제)` },
          { type: 'callout', kind: 'more', title: '📘 한글 처리: 문자 코드 ord() 와 chr()', html: `컴퓨터는 글자를 <b>번호(유니코드 코드 포인트)</b>로 저장합니다. <code>ord('가')</code> 는 글자의 번호 44032 를, <code>chr(44032)</code> 는 번호에 해당하는 글자 '가' 를 돌려줍니다. 한글 음절은 <code>'가'</code>(44032) ~ <code>'힣'</code>(55203) 사이에 모여 있으므로 <code>'가' &lt;= ch &lt;= '힣'</code> 로 한글인지 판별할 수 있습니다. 파이썬 3 의 문자열은 유니코드라서 한글도 영어와 똑같이 <b>1글자</b>로 다뤄집니다. 파일이나 네트워크로 보낼 때 바이트로 바꾸면 UTF-8 에서 한글 1글자는 3바이트가 됩니다.` },
          { type: 'code', title: '추가 예제. 한글 · 영문 · 숫자 개수 세기', code: `ss = "Python 3.14 파이썬 최고!"
hangul, english, digit, other = 0, 0, 0, 0

for ch in ss :
    if '가' <= ch <= '힣' :
        hangul += 1
    elif ch.isalpha() :
        english += 1
    elif ch.isdigit() :
        digit += 1
    else :
        other += 1

print(f"한글 {hangul}, 영문 {english}, 숫자 {digit}, 기타 {other}")
print(ord('가'), chr(44032), chr(ord('가') + 1))
print(len("파이썬"), len("파이썬".encode('utf-8')))`, expect: `한글 5, 영문 6, 숫자 3, 기타 5
44032 가 각
3 9`, desc: '한글도 <code>isalpha()</code> 가 True 이므로, 한글을 먼저 검사한 뒤 나머지를 영문으로 셉니다. 마지막 줄: 글자 수는 3, UTF-8 바이트 수는 9 입니다.' },
          { type: 'h', text: '[프로그램 2]의 완성: 임의의 위치에 글자를 쓰는 거북이' },
          { type: 'p', html: `대화상자로 문자열을 입력받은 뒤, <code>for ch in inStr :</code> 로 한 글자씩 꺼내 <b>임의의 위치 · 색상 · 크기</b>로 거북이가 화면에 씁니다. 필요한 기능은 모두 배운 것들입니다.` },
          { type: 'list', items: [
            '<code>askstring(제목, 안내 문구)</code> — <code>tkinter.simpledialog</code> 의 문자열 입력 대화상자 (6장 <code>askinteger</code> 의 문자열 버전)',
            '<code>random.randrange(시작, 끝)</code> — 시작 ~ 끝-1 사이의 임의의 정수 (위치 · 글자 크기)',
            '<code>random.random()</code> — 0.0 이상 1.0 미만의 임의의 실수 (빨강 · 초록 · 파랑 색 성분)',
            '<code>turtle.write(글자, font=(글꼴, 크기, 굵기))</code> — 거북이 위치에 글자 쓰기'
          ] },
          { type: 'figure', html: SVG_CANVAS, caption: '글자 범위 300×300 → x, y 는 -150 ~ 149 사이의 임의의 값' },
          { type: 'code', title: '[프로그램 2] 완성: Code08-07. 임의의 위치에 글자를 쓰는 거북이', code: CODE_0807, dialogs: DLG, nondeterministic: true,
            desc: `<code>7~8행</code> 글자를 쓸 범위(300×300)와 위치 · 크기 변수를 준비합니다. <code>[0] * 3</code> 은 <code>[0, 0, 0]</code> 이므로 세 변수가 모두 0 이 됩니다. <code>13~14행</code> 창 크기를 범위보다 50 크게 잡습니다. <code>17행</code> 대화상자로 문자열을 입력받습니다. <code>19~29행</code> 한 글자마다 위치(tX, tY) · 색(r, g, b) · 크기(txtSize)를 무작위로 정하고 그 자리에 글자를 씁니다. 대화상자에 <code>IT Cookbook, 파이썬을 열심히 공부하자</code> 처럼 입력해 보세요.` },
          { type: 'callout', kind: 'warn', title: '강의자료 코드와 달라진 점: swidth / 2 → swidth // 2', html: `강의자료는 <code>random.randrange(-swidth / 2, swidth / 2)</code> 로 되어 있습니다. <code>/</code> 나눗셈의 결과는 <code>-150.0</code> 같은 <b>실수</b>인데, <b>파이썬 3.12 부터</b> <code>randrange()</code> 에 실수를 넣으면 <code>TypeError</code> 가 납니다(예전 버전은 경고만 했습니다). 그래서 정수 몫을 구하는 <code>//</code> 로 바꾸었습니다. <code>int(swidth / 2)</code> 로 써도 됩니다.` },
          { type: 'callout', kind: 'tip', title: '대화상자에서 [취소]를 누르면?', html: `<code>askstring()</code> 은 취소하면 문자열 대신 <code>None</code> 을 돌려주고, <code>for ch in None</code> 에서 <code>TypeError</code> 가 납니다. 안전하게 만들려면 반복문 앞에 <code>if inStr == None : inStr = ''</code> 처럼 확인하는 줄을 추가하세요.` },
          { type: 'callout', kind: 'more', title: '📘 turtle.textinput() 으로 입력받기', html: `turtle 모듈에도 문자열 입력 대화상자 <code>turtle.textinput(제목, 안내 문구)</code> 가 있습니다. tkinter 를 따로 import 하지 않아도 되어 거북이 프로그램에서는 더 간단합니다. 숫자는 <code>turtle.numinput()</code> 으로 받습니다. 아래는 같은 프로그램을 textinput 과 f-string 으로 다듬은 버전입니다.` },
          { type: 'code', title: '추가 예제. turtle.textinput() 버전 거북이 글자쓰기', code: `import turtle
import random

swidth, sheight = 300, 300

turtle.title('거북이 글자쓰기')
turtle.shape('turtle')
turtle.setup(width = swidth + 50, height = sheight + 50)
turtle.penup()
turtle.speed(0)

inStr = turtle.textinput('문자열 입력', '거북이 쓸 문자열을 입력')
if inStr == None :
    inStr = ''

for ch in inStr :
    if ch == ' ' :
        continue
    tX = random.randrange(-swidth // 2, swidth // 2)
    tY = random.randrange(-sheight // 2, sheight // 2)
    turtle.goto(tX, tY)
    turtle.pencolor((random.random(), random.random(), random.random()))
    turtle.write(ch, font=('맑은고딕', random.randrange(10, 50), 'bold'))

print(f"'{inStr}' 에서 공백을 뺀 {len(inStr.replace(' ', ''))}글자를 썼습니다.")
turtle.done()`, dialogs: ['파이썬 만세'], expect: `'파이썬 만세' 에서 공백을 뺀 5글자를 썼습니다.`,
            desc: '공백은 써도 보이지 않으므로 <code>continue</code> 로 건너뜁니다. 위치와 색은 매번 다르지만 콘솔에 출력되는 글자 수는 항상 같습니다.' },
          { type: 'h', text: '📘 한눈에 보는 문자열 함수' },
          { type: 'table', head: ['분류', '함수', '예 → 결과'], rows: [
            ['변환', '<code>upper() lower() swapcase() title()</code>', `<code>'ab'.upper()</code> → 'AB'`],
            ['찾기', '<code>count() find() rfind() index() rindex()</code>', `<code>'abcb'.find('b')</code> → 1`],
            ['검사', '<code>startswith() endswith()</code>', `<code>'abc'.endswith('c')</code> → True`],
            ['삭제', '<code>strip() lstrip() rstrip()</code>', `<code>' a '.strip()</code> → 'a'`],
            ['변경', '<code>replace()</code>', `<code>'aa'.replace('a', 'b')</code> → 'bb'`],
            ['분리', '<code>split() splitlines()</code>', `<code>'a b'.split()</code> → ['a', 'b']`],
            ['결합', '<code>join()</code>', `<code>'-'.join('ab')</code> → 'a-b'`],
            ['정렬 · 채우기', '<code>center() ljust() rjust() zfill()</code>', `<code>'7'.zfill(3)</code> → '007'`],
            ['구성 파악', '<code>isdigit() isalpha() isalnum() islower() isupper() isspace()</code>', `<code>'12'.isdigit()</code> → True`],
            ['함수', '<code>len() str() int() map() ord() chr()</code>', `<code>len('파이썬')</code> → 3`]
          ], caption: '모든 문자열 함수는 원래 문자열을 바꾸지 않고 결과를 새로 돌려준다' }
        ],
        practice: [
          {
            title: 'SELF STUDY 8-3. 글자인지 숫자인지 판별하기',
            level: 1,
            desc: `<p>입력한 값이 영어나 한글이면 <code>글자입니다.</code>, 숫자이면 <code>숫자입니다.</code>, 섞여 있으면 <code>글자+숫자입니다.</code>, 특수문자 등이면 <code>모르겠습니다.</code> 를 출력하세요.</p><pre>문자열 입력 : abcd123
글자+숫자입니다.</pre>`,
            hint: '<code>isdigit()</code> → <code>isalpha()</code> → <code>isalnum()</code> 순서로 if · elif 를 씁니다. 순서를 바꾸면 결과가 달라집니다!',
            starter: `ss = input("문자열 입력 : ")

# TODO: isdigit(), isalpha(), isalnum() 으로 판별
`,
            solution: `ss = input("문자열 입력 : ")

if ss.isdigit() :
    print("숫자입니다.")
elif ss.isalpha() :
    print("글자입니다.")
elif ss.isalnum() :
    print("글자+숫자입니다.")
else :
    print("모르겠습니다.")
`,
            stdin: 'abcd123\n',
            expect: `문자열 입력 : abcd123
글자+숫자입니다.`
          },
          {
            title: '실습 8-7. 성적 문자열 분석',
            level: 2,
            desc: `<p><code>이름:점수</code> 가 쉼표로 이어진 문자열을 나누어, 각 학생을 정렬된 표로 출력하고 평균을 구하세요.</p><pre>이름           점수
홍길동          90
이순신          85
강감찬          77
평균 : 84.0</pre>`,
            hint: '<code>split(\',\')</code> 로 학생별로 나누고, 각 항목을 다시 <code>split(\':\')</code> 로 이름과 점수로 나눕니다. 이름은 <code>ljust(10)</code>, 점수는 <code>rjust(5)</code> 로 정렬합니다.',
            starter: `data = "홍길동:90,이순신:85,강감찬:77"
total = 0

print("이름".ljust(10) + "점수".rjust(5))
# TODO: data 를 split 으로 나누어 한 줄씩 출력하고 total 에 더하기

# TODO: 평균 출력
`,
            solution: `data = "홍길동:90,이순신:85,강감찬:77"
total = 0

print("이름".ljust(10) + "점수".rjust(5))
students = data.split(',')
for s in students :
    name, score = s.split(':')
    total += int(score)
    print(name.ljust(10) + score.rjust(5))

print("평균 :", total / len(students))
`,
            expect: `이름           점수
홍길동          90
이순신          85
강감찬          77
평균 : 84.0`
          },
          {
            title: '실습 8-8. 거북이로 내 이름 쓰기',
            level: 3,
            desc: `<p><code>turtle.textinput()</code> 으로 이름을 입력받아, 화면 가운데 가로 한 줄로 한 글자씩 이어서 쓰세요. 글자마다 색은 무작위, 글자 크기는 40, 글자 간격은 60 입니다. 다 쓴 뒤 콘솔에 <code>이름의 글자 수 : N</code> 을 출력합니다.</p>`,
            hint: '시작 x 좌표는 <code>-60 * len(name) // 2</code> 정도로 잡고, 글자마다 x 를 60씩 늘립니다. 입력을 취소하면 <code>None</code> 이 오므로 빈 문자열로 바꿔 두세요.',
            starter: `import turtle
import random

turtle.penup()
turtle.hideturtle()

name = turtle.textinput('이름 입력', '이름을 입력하세요')
if name == None :
    name = ''

# TODO: 한 글자씩 무작위 색으로 가로로 이어 쓰기

print("이름의 글자 수 :", len(name))
turtle.done()
`,
            solution: `import turtle
import random

turtle.penup()
turtle.hideturtle()

name = turtle.textinput('이름 입력', '이름을 입력하세요')
if name == None :
    name = ''

x = -60 * len(name) // 2
for ch in name :
    turtle.goto(x, 0)
    turtle.pencolor((random.random(), random.random(), random.random()))
    turtle.write(ch, font=('맑은고딕', 40, 'bold'))
    x += 60

print("이름의 글자 수 :", len(name))
turtle.done()
`,
            dialogs: ['홍길동'],
            expect: '이름의 글자 수 : 3'
          }
        ],
        quiz: [
          { q: `다음 코드의 실행 결과는?<pre><code>ss = '2026-09-18'
print(ss.split('-'))</code></pre>`, options: [`['2026', '09', '18']`, `[2026, 9, 18]`, `'2026 09 18'`, `['2026-09-18']`], answer: 0, explain: 'split 의 결과는 문자열들의 리스트입니다. 숫자로 바꾸려면 map(int, …) 를 사용합니다.' },
          { q: `<code>'*'.join('abc')</code> 의 결과는?`, options: [`'*abc*'`, `'a*b*c'`, `'a*b*c*'`, `'abc*'`], answer: 1, explain: 'join 은 항목들 <b>사이사이</b>에만 끼워 넣습니다. 앞과 끝에는 붙지 않습니다.' },
          { q: `<code>'42'.zfill(5)</code> 의 결과는?`, options: [`'42000'`, `'00042'`, `'   42'`, `'42   '`], answer: 1, explain: 'zfill 은 왼쪽 빈칸을 0 으로 채워 전체 폭을 5 로 맞춥니다.' },
          { q: `다음 중 결과가 <b>False</b> 인 것은?`, options: [`'2026'.isdigit()`, `'파이썬'.isalpha()`, `'abc123'.isalnum()`, `'-5'.isdigit()`], answer: 3, explain: '부호 - 는 숫자가 아니므로 \'-5\'.isdigit() 은 False 입니다. 한글도 isalpha() 가 True 입니다.' },
          { q: `[프로그램 2] 에서 강의자료의 <code>random.randrange(-swidth / 2, swidth / 2)</code> 를 <code>//</code> 로 바꾼 이유는?`, options: ['더 넓은 범위를 얻으려고', '파이썬 3.12 부터 randrange() 에 실수를 넣으면 오류이므로', '음수를 없애려고', '속도를 빠르게 하려고'], answer: 1, explain: '/ 의 결과는 실수(-150.0)입니다. 최신 파이썬의 randrange() 는 정수만 받으므로 // 로 정수 몫을 구합니다.' }
        ],
        slides: [
          { layout: 'title', title: '문자열 함수 ②', subtitle: '분리 · 결합 · 정렬 · 구성 파악 · [프로그램 2] 거북이 글자쓰기', badge: '08-4',
            notes: '<p><b>[도입 1분]</b> 복습 발문: “<code>\'  Hi  \'.strip().upper()</code> 의 결과는?” → \'HI\' (함수를 이어서 호출할 수 있다는 것도 함께).</p>' },
          { layout: 'code', title: '분리 · 결합: split, splitlines, join', code: `ss = 'Python을 열심히 공부 중'
ss.split()
ss = '하나:둘:셋'
ss.split(':')
ss = '하나\\n둘\\n셋'
ss.splitlines()
ss = '%'
ss.join('파이썬')`, repl: true, points: ['<code>split()</code> 공백 기준 → 리스트', '<code>split(\':\')</code> 구분자 기준', '<code>splitlines()</code> 줄 기준', '<code>\'%\'.join()</code> 사이에 끼우기'],
            notes: '<p><b>[4분]</b> join 은 끼워 넣을 글자가 점 앞에 온다는 점이 가장 헷갈립니다. “풀(%)을 가지고 조각들을 붙인다” 로 비유하세요.</p>' },
          { layout: 'diagram', title: 'split ↔ join', html: SVG_SPLIT, caption: '문자열 → 리스트 → 문자열',
            notes: '<p><b>[2분]</b> <code>\'-\'.join(\'하나:둘:셋\'.split(\':\'))</code> 처럼 두 함수를 이어 구분자를 바꾸는 패턴을 보여 줍니다.</p>' },
          { layout: 'code', title: 'Code08-06. 10년 후 날짜', code: `ss = input("날짜(연/월/일) 입력 ==> ")

ssList = ss.split('/')

print("입력한 날짜의 10년 후 ==> ", end = '')
print(str(int(ssList[0]) + 10) + "년", end = '')
print(ssList[1] + "월", end = '')
print(ssList[2] + "일")`, stdin: '2019/12/31\n', points: ['split 결과는 <b>문자열</b> 리스트', '<code>int()</code> 로 계산 → <code>str()</code> 로 연결', '강의자료 “31년” → “31일” 오타'],
            notes: '<p><b>[4분]</b> 발문: “<code>ssList[0] + 10</code> 이라고 쓰면?” → TypeError. 직접 바꿔서 실행해 보여 주세요.</p>' },
          { layout: 'code', title: 'map() 함수', code: `before = ['2019', '12', '31']
after = list(map(int , before))
after
sum(after)`, repl: true, points: ['모든 항목에 함수 적용', '함수명만: <code>int</code> (괄호 X)', '<code>list()</code> 로 감싸 확인', '활용: <code>map(int, input().split())</code>'],
            notes: '<p><b>[4분]</b> 강의자료 제목 “함수명에 대입하기” — 함수를 호출하지 않고 이름 자체를 넘긴다는 의미입니다. <code>map(int(), before)</code> 로 쓰면 오류가 남을 보여 주세요.</p>' },
          { layout: 'diagram', title: '정렬하기, 채우기', html: SVG_ALIGN, caption: 'center · ljust · rjust · zfill',
            notes: '<p><b>[3분]</b> 셸에서 <code>ss.center(10)</code> 등을 직접 실행해 따옴표 안의 공백 개수를 세어 보게 합니다. center 는 남는 칸이 홀수면 오른쪽에 하나 더 둡니다.</p>' },
          { layout: 'code', title: '문자열 구성 파악', code: `'1234'.isdigit()
'abcd'.isalpha()
'abc123'.isalnum()
'abcd'.islower()
'ABCD'.isupper()
'   '.isspace()
'-5'.isdigit()`, repl: true, points: ['결과는 True / False', '한글도 <code>isalpha()</code> True', '<code>\'-5\'</code>, <code>\'1.5\'</code> 는 isdigit False'],
            notes: '<p><b>[3분]</b> 마지막 줄은 강의자료에 없는 함정 예시입니다. 입력값 검사(<code>if ss.isdigit():</code>) 후 int() 로 바꾸는 패턴을 강조합니다.</p>' },
          { layout: 'practice', title: 'SELF STUDY 8-3', desc: '영어 · 한글 → <code>글자입니다.</code> / 숫자 → <code>숫자입니다.</code> / 섞임 → <code>글자+숫자입니다.</code> / 그 외 → <code>모르겠습니다.</code>', stdin: 'abcd123\n', starter: `ss = input("문자열 입력 : ")
# TODO
`, solution: `ss = input("문자열 입력 : ")

if ss.isdigit() :
    print("숫자입니다.")
elif ss.isalpha() :
    print("글자입니다.")
elif ss.isalnum() :
    print("글자+숫자입니다.")
else :
    print("모르겠습니다.")
`,
            notes: '<p><b>[6분]</b> isalnum() 을 맨 앞에 두면 \'1234\' 도 “글자+숫자” 가 되어 버립니다. 조건의 순서가 왜 중요한지 토론하세요.</p>' },
          { layout: 'diagram', title: '[프로그램 2] 설계', html: SVG_CANVAS, caption: '글자마다 위치 · 색 · 크기를 무작위로',
            notes: '<p><b>[3분]</b> 필요한 도구 복습: askstring(6장 askinteger 의 문자열 버전), randrange, random, write.</p><p>randrange(-150, 150) 은 -150 ~ 149 라는 점도 짚어 줍니다.</p>' },
          { layout: 'code', title: '[프로그램 2] Code08-07. 거북이 글자쓰기', code: CODE_0807_SLIDE, dialogs: DLG, points: ['<code>askstring()</code> 문자열 입력', '<code>for ch in inStr</code> 한 글자씩', '<code>//</code> : 3.12+ randrange 는 정수만', '<code>write(ch, font=(…))</code>'],
            notes: '<p><b>[8분]</b> 실행 후 대화상자에 자기 이름이나 좋아하는 문장을 입력하게 합니다. 실행할 때마다 결과가 다른 이유(random)를 질문합니다.</p><p>강의자료의 <code>swidth / 2</code> 는 최신 파이썬에서 TypeError — <code>//</code> 로 고친 이유를 꼭 설명하세요. 슬라이드는 공간 때문에 빈 줄 · 주석과 마지막 <code>turtle.done()</code> 을 생략했습니다(본문 코드는 완전판).</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: `<code>list(map(int, '1 2 3'.split()))</code> 의 결과는?`, options: [`['1', '2', '3']`, '[1, 2, 3]', '6', `'123'`], answer: 1, explain: 'split 으로 [\'1\', \'2\', \'3\'] → map(int, …) 로 각각 정수 → list 로 [1, 2, 3].',
            notes: '<p><b>[2분]</b> 한 줄에 여러 숫자를 입력받는 가장 흔한 패턴이므로 꼭 이해시키세요.</p>' },
          { layout: 'summary', title: '8장 정리', bullets: ['문자열 = 글자의 시퀀스 · <b>불변</b> · 인덱스/슬라이싱', '분리 · 결합: <code>split</code> → 리스트, <code>join</code> → 문자열, <code>map(int, …)</code>', '정렬: <code>center · ljust · rjust · zfill</code>', '구성 파악: <code>isdigit · isalpha · isalnum · …</code>', '[프로그램 1] 거꾸로 출력 · [프로그램 2] 거북이 글자쓰기 완성'],
            notes: '<p><b>[2분]</b> 과제: 본문의 “한눈에 보는 문자열 함수” 표를 보며 각 함수를 셸에서 한 번씩 직접 실행해 보기. 다음 장 예고: 함수 만들기.</p>' }
        ]
      }
    ]
  });
})();
