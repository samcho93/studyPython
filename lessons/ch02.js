/* Chapter 02. 미리 만드는 쓸 만한 프로그램 (lecture/Ch02_미리 만드는 쓸 만한 프로그램.pptx) */
(function () {
  /* ---------- 공통 SVG 그림 ---------- */
  const MONO = "font-family:Consolas,'D2Coding',monospace";

  /* 그릇(변수) 하나 그리기: 가운데 x, 위쪽 y */
  const bowl = (x, y, val, name, color, opt) => {
    const o = opt || {};
    const w = o.w || 180, h = o.h || 96;
    return `<g${o.dim ? ' opacity="0.45"' : ''}>
    <path d="M${x - w / 2},${y} L${x + w / 2},${y} L${x + w / 2 - 28},${y + h} L${x - w / 2 + 28},${y + h} Z" fill="${color}" opacity="0.9"/>
    <rect x="${x - w / 2 - 8}" y="${y - 12}" width="${w + 16}" height="16" rx="6" fill="${color}"/>
    <text x="${x}" y="${y + h / 2 + 14}" text-anchor="middle" style="${MONO};font-size:38px;font-weight:700;fill:#fff">${val}</text>
    <text x="${x}" y="${y + h + 38}" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--fg)">${name}</text></g>`;
  };

  const arrowDefs = (id, color) =>
    `<marker viewBox="0 0 12 12" id="${id}" markerWidth="4.5" markerHeight="4.5" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="${color}"/></marker>`;

  /* 이 장에서 만들 프로그램 미리보기 */
  const SVG_PREVIEW = `<svg viewBox="0 0 1280 520" width="100%" role="img" aria-label="이 장에서 만들 두 프로그램의 실행 화면">
  <text x="310" y="36" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--accent)">[프로그램 1] 간단 계산기</text>
  <rect x="30" y="56" width="560" height="330" rx="12" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
  <rect x="30" y="56" width="560" height="44" rx="12" fill="var(--line)"/>
  <text x="50" y="86" style="font-size:20px;fill:var(--fg)">콘솔 (실행 결과)</text>
  <g style="${MONO};font-size:24px;fill:var(--fg)">
    <text x="54" y="142">첫 번째 숫자를 입력하세요 : <tspan style="fill:var(--accent2);font-weight:700">300</tspan></text>
    <text x="54" y="180">두 번째 숫자를 입력하세요 : <tspan style="fill:var(--accent2);font-weight:700">200</tspan></text>
    <text x="54" y="228">300 + 200 = 500</text>
    <text x="54" y="266">300 - 200 = 100</text>
    <text x="54" y="304">300 * 200 = 60000</text>
    <text x="54" y="342">300 / 200 = 1.5</text>
  </g>
  <text x="310" y="430" text-anchor="middle" style="font-size:22px;fill:var(--muted)">두 수를 입력하면 사칙 연산 결과를 출력</text>
  <text x="960" y="36" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--accent)">[프로그램 2] 마우스로 그리는 터틀 그림</text>
  <rect x="670" y="56" width="580" height="400" rx="12" fill="#ffffff" stroke="var(--line)" stroke-width="3"/>
  <rect x="670" y="56" width="580" height="44" rx="12" fill="var(--line)"/>
  <text x="690" y="86" style="font-size:20px;fill:var(--fg)">거북이로 그림 그리기</text>
  <g fill="none" stroke-width="9" stroke-linecap="round" stroke-linejoin="round">
    <path d="M720,150 L820,150" stroke="#8e7cc3"/><path d="M745,152 L745,200" stroke="#6aa84f"/><path d="M795,152 L795,200" stroke="#93c47d"/><path d="M712,205 L830,203" stroke="#274e13"/>
    <path d="M870,135 L880,215" stroke="#cc0033"/><path d="M878,175 L915,172" stroke="#cc0033"/>
    <path d="M985,140 L1015,150 L1025,180 L1005,205 L970,205 L955,178 L962,150 Z" stroke="#a2c4a9"/>
    <path d="M1060,130 L1068,215" stroke="#5b0f1e"/>
    <path d="M1105,160 L1125,135 L1140,160 L1160,135" stroke="#3d85c6"/><path d="M1190,125 L1192,190" stroke="#3c4b9e"/><path d="M1150,150 L1190,150" stroke="#76a5af"/><path d="M1120,205 L1200,205" stroke="#b6d7a8"/>
    <path d="M740,290 L790,290 L785,320" stroke="#e06c1c"/><path d="M810,285 L850,285 L840,315" stroke="#6aa84f"/><path d="M718,335 L880,330" stroke="#8c3a6b"/><path d="M800,335 L797,365" stroke="#2d8a6b"/>
    <path d="M735,375 L870,370 L872,395 L745,398 L747,430 L860,430" stroke="#9c8fd0"/>
    <path d="M930,300 L1030,288 L950,340" stroke="#58b89a"/><path d="M990,315 L1040,345" stroke="#58b89a"/>
    <path d="M1070,280 L1072,350" stroke="#2e7d32"/><path d="M1045,310 L1072,310" stroke="#2e7d32"/><path d="M1095,275 L1097,355" stroke="#8aa3a8"/>
    <path d="M960,375 L1100,372 L1102,430 L962,432 Z" stroke="#58b89a"/>
    <path d="M1170,275 L1180,410" stroke="#1f4e9e"/><path d="M1181,432 L1182,440" stroke="#1f4e9e"/>
  </g>
  <path d="M905,245 l26,10 l-26,10 l6,-10 z" fill="#111"/>
  <text x="960" y="490" text-anchor="middle" style="font-size:22px;fill:var(--muted)">왼쪽 클릭: 선 그리기 · 오른쪽 클릭: 이동 · 가운데 클릭: 색 · 크기 바꾸기</text>
</svg>`;

  /* 변수 = 그릇 */
  const SVG_BOWLS = `<svg viewBox="0 0 1280 400" width="100%" role="img" aria-label="변수 a와 b 그릇">
  <g style="${MONO};font-size:34px;fill:var(--fg)">
    <text x="120" y="70">a = 100</text>
    <text x="120" y="130">b = 50</text>
  </g>
  <text x="120" y="200" style="font-size:22px;fill:var(--muted)">= 는 “같다”가 아니라</text>
  <text x="120" y="234" style="font-size:22px;fill:var(--muted)">“오른쪽 값을 왼쪽 그릇에 넣어라”</text>
  <text x="120" y="268" style="font-size:22px;fill:var(--muted)">a ← 100 과 같은 뜻 (대입 연산자)</text>
  ${bowl(640, 150, '100', '그릇 이름 : a', 'var(--accent)')}
  ${bowl(980, 150, '50', '그릇 이름 : b', 'var(--accent2)')}
  <text x="810" y="80" text-anchor="middle" style="font-size:24px;fill:var(--fg)">메모리 안에 그릇(변수) 2개가 생긴다</text>
  <text x="640" y="370" text-anchor="middle" style="font-size:22px;fill:var(--muted)">값을 담아 두는 이름 붙은 그릇 = 변수(variable)</text>
</svg>`;

  /* 더하기: result 그릇 */
  const SVG_ADD = `<svg viewBox="0 0 1280 480" width="100%" role="img" aria-label="a와 b를 더해 result에 넣기">
  <defs>${arrowDefs('c2add', 'var(--danger)')}</defs>
  <text x="640" y="44" text-anchor="middle" style="${MONO};font-size:34px;fill:var(--fg)">result = a + b</text>
  ${bowl(330, 110, '100', '그릇 이름 : a', 'var(--accent)')}
  ${bowl(950, 110, '50', '그릇 이름 : b', 'var(--accent2)')}
  <path d="M420,230 C500,300 540,320 570,330" stroke="var(--danger)" stroke-width="5" fill="none" marker-end="url(#c2add)"/>
  <path d="M860,230 C780,300 740,320 710,330" stroke="var(--danger)" stroke-width="5" fill="none" marker-end="url(#c2add)"/>
  <text x="640" y="300" text-anchor="middle" style="font-size:54px;fill:var(--muted)">+</text>
  ${bowl(640, 330, '150', '그릇 이름 : result', 'var(--ok)')}
  <text x="330" y="300" text-anchor="middle" style="font-size:21px;fill:var(--muted)">값을 꺼내 쓴 뒤에도</text>
  <text x="330" y="328" text-anchor="middle" style="font-size:21px;fill:var(--muted)">a 에는 100 이 그대로</text>
  <text x="950" y="300" text-anchor="middle" style="font-size:21px;fill:var(--muted)">b 에도 50 이 그대로</text>
</svg>`;

  /* print( a, '+', b, '=', result ) */
  const SVG_PRINT = (() => {
    const toks = [['a', 260, '100', 'var(--accent)'], ["'+'", 420, null], ['b', 560, '50', 'var(--accent2)'], ["'='", 700, null], ['result', 890, '150', 'var(--ok)']];
    const outX = [440, 540, 620, 700, 800];
    const outT = ['100', '+', '50', '=', '150'];
    return `<svg viewBox="0 0 1280 520" width="100%" role="img" aria-label="print 함수로 여러 값을 한 줄에 출력">
  <defs>${arrowDefs('c2pr', 'var(--accent2)')}</defs>
  ${toks.filter((t) => t[2]).map((t) => bowl(t[1], 30, t[2], '', t[3], { w: 130, h: 70 })).join('')}
  <text x="100" y="200" style="${MONO};font-size:34px;fill:var(--danger)">print(</text>
  ${toks.map((t) => `<text x="${t[1]}" y="200" text-anchor="middle" style="${MONO};font-size:34px;fill:var(--fg)">${t[0]}</text>`).join('')}
  <text x="330" y="200" style="${MONO};font-size:34px;fill:var(--muted)">,</text><text x="480" y="200" style="${MONO};font-size:34px;fill:var(--muted)">,</text>
  <text x="620" y="200" style="${MONO};font-size:34px;fill:var(--muted)">,</text><text x="770" y="200" style="${MONO};font-size:34px;fill:var(--muted)">,</text>
  <text x="990" y="200" style="${MONO};font-size:34px;fill:var(--danger)">)</text>
  ${toks.map((t, i) => `<line x1="${t[1]}" y1="215" x2="${outX[i]}" y2="330" stroke="var(--accent2)" stroke-width="3" marker-end="url(#c2pr)"/>`).join('')}
  <rect x="340" y="340" width="600" height="110" rx="14" fill="var(--card)" stroke="var(--fg)" stroke-width="4"/>
  ${outT.map((t, i) => `<text x="${outX[i]}" y="410" text-anchor="middle" style="${MONO};font-size:44px;font-weight:700;fill:var(--fg)">${t}</text>`).join('')}
  <rect x="600" y="450" width="80" height="30" fill="var(--line)"/>
  <text x="1110" y="360" text-anchor="middle" style="font-size:22px;fill:var(--muted)">변수 → 담긴 값 출력</text>
  <text x="1110" y="395" text-anchor="middle" style="font-size:22px;fill:var(--muted)">'…' → 글자 그대로 출력</text>
  <text x="1110" y="430" text-anchor="middle" style="font-size:22px;fill:var(--muted)">쉼표(,) → 한 칸 띄움</text>
</svg>`;
  })();

  /* 메모리와 파일 */
  const SVG_MEMORY = `<svg viewBox="0 0 1280 480" width="100%" role="img" aria-label="메모리와 파일의 차이">
  <defs>${arrowDefs('c2mem', 'var(--ok)')}</defs>
  <rect x="50" y="40" width="520" height="330" rx="16" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
  <text x="310" y="84" text-anchor="middle" style="font-size:28px;font-weight:700;fill:var(--warn)">메모리 (RAM)</text>
  <text x="310" y="118" text-anchor="middle" style="font-size:21px;fill:var(--muted)">대화형 모드(&gt;&gt;&gt; 셸)에서 만든 변수</text>
  <g style="${MONO};font-size:28px;fill:var(--fg)"><text x="120" y="180">&gt;&gt;&gt; a = 100</text><text x="120" y="222">&gt;&gt;&gt; b = 50</text><text x="120" y="264">&gt;&gt;&gt; result = a / b</text></g>
  <text x="310" y="340" text-anchor="middle" style="font-size:23px;fill:var(--danger);font-weight:700">셸을 끄거나 새로 시작하면 모두 사라짐</text>
  <rect x="710" y="40" width="520" height="330" rx="16" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="970" y="84" text-anchor="middle" style="font-size:28px;font-weight:700;fill:var(--ok)">파일 (저장 장치)</text>
  <text x="970" y="118" text-anchor="middle" style="font-size:21px;fill:var(--muted)">스크립트 모드에서 저장한 코드</text>
  <path d="M880,150 h150 l40,40 v130 h-190 z" fill="none" stroke="var(--fg)" stroke-width="3"/>
  <path d="M1030,150 v40 h40" fill="none" stroke="var(--fg)" stroke-width="3"/>
  <text x="975" y="245" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">Code02-01</text>
  <text x="975" y="280" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--accent)">.py</text>
  <text x="970" y="352" text-anchor="middle" style="font-size:23px;fill:var(--ok);font-weight:700">껐다 켜도 남아 있음 → 다시 열어 실행</text>
  <line x1="580" y1="205" x2="700" y2="205" stroke="var(--ok)" stroke-width="5" marker-end="url(#c2mem)"/>
  <text x="640" y="190" text-anchor="middle" style="font-size:22px;fill:var(--ok)">저장</text>
  <text x="640" y="430" text-anchor="middle" style="font-size:22px;fill:var(--muted)">오래 쓸 코드, 여러 줄짜리 코드는 파일(.py)로 저장해 둔다</text>
</svg>`;

  /* 긴 프로그램을 코딩하는 순서 */
  const SVG_FLOW = (() => {
    const box = (x, y, w, t, c) => `<rect x="${x}" y="${y}" width="${w}" height="58" rx="8" fill="${c}"/><text x="${x + w / 2}" y="${y + 38}" text-anchor="middle" style="font-size:24px;font-weight:700;fill:#fff">${t}</text>`;
    const note = (x, y, t) => `<text x="${x}" y="${y}" style="font-size:20px;fill:var(--fg)">${t}</text>`;
    return `<svg viewBox="0 0 1280 640" width="100%" role="img" aria-label="긴 프로그램을 코딩하는 순서">
  <defs>${arrowDefs('c2fl', 'var(--muted)')}</defs>
  <g stroke="var(--muted)" stroke-width="3" fill="none">
    <line x1="300" y1="88" x2="230" y2="138" marker-end="url(#c2fl)"/><line x1="360" y1="88" x2="430" y2="138" marker-end="url(#c2fl)"/>
    <line x1="220" y1="196" x2="290" y2="252" marker-end="url(#c2fl)"/><line x1="440" y1="196" x2="370" y2="252" marker-end="url(#c2fl)"/>
    <line x1="330" y1="312" x2="330" y2="354" marker-end="url(#c2fl)"/>
    <line x1="330" y1="414" x2="330" y2="456" marker-end="url(#c2fl)"/>
    <line x1="330" y1="516" x2="330" y2="560" marker-end="url(#c2fl)"/>
    <path d="M200,486 H110 V282 H196" marker-end="url(#c2fl)"/>
  </g>
  ${box(200, 30, 260, '편집기 준비', '#4fb3c8')}
  ${box(90, 140, 240, '새 코드 작성', '#4fb3c8')}${box(340, 140, 240, '저장한 코드 열기', '#4fb3c8')}
  ${box(200, 254, 260, '코딩', '#b56aa0')}
  ${box(200, 356, 260, '저장', '#4fb3c8')}
  ${box(200, 458, 260, '실행 및 결과 확인', '#4fb3c8')}
  ${box(200, 562, 260, '종료', '#8cbf4d')}
  <text x="95" y="380" text-anchor="end" style="font-size:22px;font-weight:700;fill:var(--danger)">실패</text>
  <text x="345" y="545" style="font-size:22px;font-weight:700;fill:var(--ok)">성공</text>
  <text x="640" y="40" style="font-size:22px;font-weight:700;fill:var(--accent)">IDLE (집에서)</text>
  <text x="960" y="40" style="font-size:22px;font-weight:700;fill:var(--accent2)">이 강좌 (웹)</text>
  ${note(640, 68, '[시작]-[IDLE] 실행')}${note(960, 68, '페이지 아래 편집기')}
  ${note(640, 172, '[File]-[New File] / [Open]')}${note(960, 172, '빈 편집기 / ✎ 편집기로')}
  ${note(640, 290, '문법에 맞게 여러 줄 입력 · 수정')}${note(960, 290, '편집기에 입력 · 수정')}
  ${note(640, 392, '[File]-[Save] (Ctrl+S)')}${note(960, 392, '브라우저에 자동 보관 · ⧉ 복사')}
  ${note(640, 494, '[Run]-[Run Module] (F5)')}${note(960, 494, '▶ 실행 (Ctrl+Enter)')}
  ${note(640, 596, '결과는 셸 창에 출력')}${note(960, 596, '결과는 오른쪽 콘솔에 출력')}
</svg>`;
  })();

  /* input() → 문자열 → int() → 정수 */
  const SVG_INPUT = `<svg viewBox="0 0 1280 440" width="100%" role="img" aria-label="input 함수와 int 함수의 흐름">
  <defs>${arrowDefs('c2in', 'var(--accent)')}</defs>
  <rect x="30" y="120" width="200" height="110" rx="12" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
  ${[0, 1, 2, 3].map((r) => [0, 1, 2, 3, 4, 5, 6].map((c) => `<rect x="${46 + c * 25}" y="${136 + r * 22}" width="20" height="16" rx="3" fill="var(--line)"/>`).join('')).join('')}
  <text x="130" y="270" text-anchor="middle" style="font-size:22px;fill:var(--fg)">키보드로 100 입력</text>
  <line x1="236" y1="175" x2="306" y2="175" stroke="var(--accent)" stroke-width="5" marker-end="url(#c2in)"/>
  <rect x="312" y="130" width="190" height="90" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="407" y="187" text-anchor="middle" style="${MONO};font-size:32px;fill:var(--fg)">input()</text>
  <line x1="508" y1="175" x2="578" y2="175" stroke="var(--accent)" stroke-width="5" marker-end="url(#c2in)"/>
  <rect x="584" y="130" width="170" height="90" rx="12" fill="var(--card)" stroke="var(--warn)" stroke-width="3" stroke-dasharray="10 6"/>
  <text x="669" y="187" text-anchor="middle" style="${MONO};font-size:34px;fill:var(--warn)">"100"</text>
  <text x="669" y="265" text-anchor="middle" style="font-size:22px;fill:var(--warn)">문자열 (글자)</text>
  <line x1="760" y1="175" x2="830" y2="175" stroke="var(--accent)" stroke-width="5" marker-end="url(#c2in)"/>
  <rect x="836" y="130" width="150" height="90" rx="12" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
  <text x="911" y="187" text-anchor="middle" style="${MONO};font-size:32px;fill:var(--fg)">int()</text>
  <line x1="992" y1="175" x2="1062" y2="175" stroke="var(--accent)" stroke-width="5" marker-end="url(#c2in)"/>
  ${bowl(1160, 128, '100', '그릇 이름 : a', 'var(--ok)', { w: 170, h: 90 })}
  <text x="1160" y="300" text-anchor="middle" style="font-size:22px;fill:var(--ok)">정수 (숫자)</text>
  <text x="640" y="60" text-anchor="middle" style="${MONO};font-size:34px;fill:var(--fg)">a = int(input("첫 번째 숫자를 입력하세요 : "))</text>
  <text x="640" y="380" text-anchor="middle" style="font-size:22px;fill:var(--muted)">안쪽 괄호부터 실행: input() 이 글자를 받아 오고 → int() 가 정수로 바꾸고 → a 에 대입</text>
  <text x="640" y="415" text-anchor="middle" style="font-size:22px;fill:var(--danger)">int() 를 빼먹으면 "100" + "50" → "10050" (글자 이어 붙이기)</text>
</svg>`;

  /* 긴 프로그램의 세 부분 */
  const SVG_STRUCTURE = `<svg viewBox="0 0 1280 600" width="100%" role="img" aria-label="긴 프로그램의 세 부분">
  <rect x="40" y="20" width="700" height="44" rx="8" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <text x="60" y="50" style="${MONO};font-size:22px;fill:var(--fg)">import turtle · import random</text>
  <rect x="40" y="80" width="700" height="190" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="60" y="116" style="${MONO};font-size:22px;fill:var(--muted)">## 함수 선언 부분 ##</text>
  <g style="${MONO};font-size:22px;fill:var(--fg)"><text x="60" y="152">def screenLeftClick(x, y) :</text><text x="100" y="182">global r, g, b</text><text x="100" y="212">...</text><text x="60" y="248">def screenRightClick(x, y) : ...</text></g>
  <rect x="40" y="286" width="700" height="110" rx="12" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
  <text x="60" y="322" style="${MONO};font-size:22px;fill:var(--muted)">## 변수 선언 부분 ##</text>
  <g style="${MONO};font-size:22px;fill:var(--fg)"><text x="60" y="354">pSize = 10</text><text x="60" y="382">r, g, b = 0.0, 0.0, 0.0</text></g>
  <rect x="40" y="412" width="700" height="170" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="60" y="448" style="${MONO};font-size:22px;fill:var(--muted)">## 메인 코드 부분 ##</text>
  <g style="${MONO};font-size:22px;fill:var(--fg)"><text x="60" y="482">turtle.shape('turtle')</text><text x="60" y="512">turtle.onscreenclick(screenLeftClick, 1)</text><text x="60" y="542">turtle.done()</text></g>
  <text x="780" y="140" style="font-size:26px;font-weight:700;fill:var(--accent)">① 함수 선언 부분</text>
  <text x="780" y="176" style="font-size:21px;fill:var(--fg)">프로그램에서 쓸 함수를 미리 만들어 둠</text>
  <text x="780" y="206" style="font-size:21px;fill:var(--muted)">(호출되기 전에는 실행되지 않음)</text>
  <text x="780" y="330" style="font-size:26px;font-weight:700;fill:var(--accent2)">② 변수 선언 부분</text>
  <text x="780" y="366" style="font-size:21px;fill:var(--fg)">프로그램 전체에서 쓸 전역 변수 준비</text>
  <text x="780" y="470" style="font-size:26px;font-weight:700;fill:var(--ok)">③ 메인(main) 코드 부분</text>
  <text x="780" y="506" style="font-size:21px;fill:var(--fg)">실제로 일을 처리하는 부분</text>
  <text x="780" y="536" style="font-size:21px;fill:var(--muted)">(여기서 함수를 호출 · 연결함)</text>
</svg>`;

  /* 마우스 버튼 → 함수 */
  const SVG_MOUSE = `<svg viewBox="0 0 1280 480" width="100%" role="img" aria-label="마우스 버튼 번호와 연결된 함수">
  <defs>${arrowDefs('c2m1', 'var(--accent)')}${arrowDefs('c2m2', 'var(--warn)')}${arrowDefs('c2m3', 'var(--accent2)')}</defs>
  <path d="M120,110 Q120,40 210,40 Q300,40 300,110 L300,300 Q300,420 210,420 Q120,420 120,300 Z" fill="var(--card)" stroke="var(--fg)" stroke-width="4"/>
  <path d="M120,110 Q120,40 196,40 L196,190 L120,190 Z" fill="var(--accent)" opacity="0.8"/>
  <path d="M300,110 Q300,40 224,40 L224,190 L300,190 Z" fill="var(--accent2)" opacity="0.8"/>
  <rect x="198" y="70" width="24" height="70" rx="12" fill="var(--warn)"/>
  <text x="158" y="130" text-anchor="middle" style="font-size:30px;font-weight:700;fill:#fff">1</text>
  <text x="262" y="130" text-anchor="middle" style="font-size:30px;font-weight:700;fill:#fff">3</text>
  <text x="210" y="60" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--warn)">2</text>
  <path d="M160,100 C340,80 380,90 470,95" stroke="var(--accent)" stroke-width="4" fill="none" marker-end="url(#c2m1)"/>
  <path d="M222,105 C360,210 380,230 470,235" stroke="var(--warn)" stroke-width="4" fill="none" marker-end="url(#c2m2)"/>
  <path d="M270,150 C340,330 380,370 470,375" stroke="var(--accent2)" stroke-width="4" fill="none" marker-end="url(#c2m3)"/>
  <rect x="480" y="50" width="760" height="100" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="500" y="92" style="${MONO};font-size:26px;fill:var(--fg)">onscreenclick(screenLeftClick, 1)</text>
  <text x="500" y="130" style="font-size:22px;fill:var(--accent)">왼쪽 버튼 → 임의의 색으로 선을 그리며 클릭한 곳까지 이동</text>
  <rect x="480" y="190" width="760" height="100" rx="12" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
  <text x="500" y="232" style="${MONO};font-size:26px;fill:var(--fg)">onscreenclick(screenMidClick, 2)</text>
  <text x="500" y="270" style="font-size:22px;fill:var(--warn)">가운데 버튼(휠) → 거북이 크기와 다음 선 색을 무작위로</text>
  <rect x="480" y="330" width="760" height="100" rx="12" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
  <text x="500" y="372" style="${MONO};font-size:26px;fill:var(--fg)">onscreenclick(screenRightClick, 3)</text>
  <text x="500" y="410" style="font-size:22px;fill:var(--accent2)">오른쪽 버튼 → 선을 그리지 않고 클릭한 곳으로 이동만</text>
  <text x="210" y="460" text-anchor="middle" style="font-size:21px;fill:var(--muted)">버튼 번호: 1 왼쪽 · 2 가운데 · 3 오른쪽</text>
</svg>`;

  /* 거북이 좌표와 클릭 */
  const SVG_COORD = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="터틀 좌표계와 클릭한 지점">
  <defs>${arrowDefs('c2c1', 'var(--muted)')}${arrowDefs('c2c2', 'var(--danger)')}</defs>
  <rect x="80" y="20" width="640" height="520" fill="#ffffff" stroke="var(--line)" stroke-width="3"/>
  <line x1="90" y1="280" x2="710" y2="280" stroke="var(--muted)" stroke-width="2" marker-end="url(#c2c1)"/>
  <line x1="400" y1="530" x2="400" y2="30" stroke="var(--muted)" stroke-width="2" marker-end="url(#c2c1)"/>
  <text x="690" y="310" style="font-size:22px;fill:#555">x</text><text x="410" y="50" style="font-size:22px;fill:#555">y</text>
  <text x="410" y="306" style="font-size:20px;fill:#555">(0, 0)</text>
  <text x="96" y="306" style="font-size:18px;fill:#777">-320</text><text x="672" y="270" style="font-size:18px;fill:#777">320</text>
  <text x="408" y="44" style="font-size:18px;fill:#777" dx="40">260</text><text x="408" y="528" style="font-size:18px;fill:#777">-260</text>
  <line x1="400" y1="280" x2="592" y2="136" stroke="var(--danger)" stroke-width="7" stroke-linecap="round" marker-end="url(#c2c2)"/>
  <path d="M388,272 l24,8 l-24,8 l6,-8 z" fill="#111"/>
  <circle cx="600" cy="130" r="10" fill="none" stroke="var(--accent)" stroke-width="4"/>
  <text x="560" y="110" style="font-size:22px;font-weight:700;fill:var(--accent)">클릭 (200, 150)</text>
  <text x="440" y="240" style="font-size:20px;fill:var(--danger)">goto(x, y)</text>
  <text x="770" y="80" style="font-size:26px;font-weight:700;fill:var(--fg)">클릭하면 일어나는 일</text>
  <text x="770" y="140" style="font-size:22px;fill:var(--fg)">① 창을 클릭한다</text>
  <text x="770" y="190" style="font-size:22px;fill:var(--fg)">② 파이썬이 연결된 함수를 호출하며</text>
  <text x="800" y="222" style="font-size:22px;fill:var(--fg)">클릭한 좌표를 x, y 로 넘겨준다</text>
  <text x="770" y="272" style="${MONO};font-size:22px;fill:var(--accent)">screenLeftClick(200, 150)</text>
  <text x="770" y="330" style="font-size:22px;fill:var(--fg)">③ 함수 안에서 goto(x, y) 로</text>
  <text x="800" y="362" style="font-size:22px;fill:var(--fg)">거북이가 그 지점까지 이동</text>
  <text x="770" y="440" style="font-size:20px;fill:var(--muted)">가운데가 (0, 0), 오른쪽이 +x, 위쪽이 +y</text>
  <text x="770" y="470" style="font-size:20px;fill:var(--muted)">(이 강좌의 기본 창: 640 × 520)</text>
</svg>`;

  /* 순차 실행 vs 이벤트 기반 */
  const SVG_EVENT = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="순차 실행 프로그램과 이벤트 기반 프로그램의 흐름 비교">
  <defs>${arrowDefs('c2ev', 'var(--muted)')}${arrowDefs('c2ev2', 'var(--danger)')}</defs>
  <text x="300" y="44" text-anchor="middle" style="font-size:27px;font-weight:700;fill:var(--accent)">계산기 — 순차 실행</text>
  <text x="900" y="44" text-anchor="middle" style="font-size:27px;font-weight:700;fill:var(--accent2)">그림판 — 이벤트 기반</text>
  ${[['시작', 80], ['입력 input()', 160], ['계산', 240], ['출력 print()', 320], ['끝', 400]].map((b) =>
      `<rect x="150" y="${b[1]}" width="300" height="56" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
    <text x="300" y="${b[1] + 36}" text-anchor="middle" style="font-size:24px;fill:var(--fg)">${b[0]}</text>`).join('')}
  ${[80, 160, 240, 320].map((y) => `<line x1="300" y1="${y + 56}" x2="300" y2="${y + 74}" stroke="var(--muted)" stroke-width="3" marker-end="url(#c2ev)"/>`).join('')}
  <text x="300" y="500" text-anchor="middle" style="font-size:22px;fill:var(--muted)">위에서 아래로 한 번 실행하고 끝난다</text>
  ${[['시작 · 함수 선언', 80], ['onscreenclick() 으로 등록', 160], ['done() — 기다리기', 250]].map((b) =>
      `<rect x="700" y="${b[1]}" width="400" height="56" rx="10" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
    <text x="900" y="${b[1] + 36}" text-anchor="middle" style="font-size:24px;fill:var(--fg)">${b[0]}</text>`).join('')}
  <line x1="900" y1="136" x2="900" y2="154" stroke="var(--muted)" stroke-width="3" marker-end="url(#c2ev)"/>
  <line x1="900" y1="216" x2="900" y2="244" stroke="var(--muted)" stroke-width="3" marker-end="url(#c2ev)"/>
  <rect x="700" y="370" width="400" height="56" rx="10" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
  <text x="900" y="406" text-anchor="middle" style="font-size:24px;fill:var(--fg)">연결된 함수(콜백) 실행</text>
  <path d="M1110,278 C1200,290 1200,380 1110,396" stroke="var(--danger)" stroke-width="4" fill="none" marker-end="url(#c2ev2)"/>
  <path d="M690,396 C600,380 600,290 690,278" stroke="var(--danger)" stroke-width="4" fill="none" marker-end="url(#c2ev2)"/>
  <text x="1135" y="330" text-anchor="middle" style="font-size:21px;fill:var(--danger)">클릭!</text>
  <text x="640" y="330" text-anchor="middle" style="font-size:21px;fill:var(--danger)">복귀</text>
  <text x="900" y="470" text-anchor="middle" style="font-size:22px;fill:var(--muted)">기다리다가 → 이벤트가 생기면 → 함수를 실행하고 → 다시 기다린다</text>
  <text x="900" y="505" text-anchor="middle" style="font-size:22px;fill:var(--muted)">창의 ✕ 를 눌러야 프로그램이 끝난다</text>
</svg>`;

  /* 색 견본 */
  const sw = (css) => `<span style="display:inline-block;width:1.1em;height:1.1em;border-radius:3px;vertical-align:middle;border:1px solid var(--line);background:${css}"></span>`;

  /* ---------- 자주 쓰는 코드 ---------- */
  const CODE02_01 = `a = 100
b = 50
result = a + b
print(a, "+", b, "=", result)
result = a - b
print(a, "-", b, "=", result)
result = a * b
print(a, "*", b, "=", result)
result = a / b
print(a, "/", b, "=", result)`;

  const CODE02_04 = `a = int(input("첫 번째 숫자를 입력하세요 : "))
b = int(input("두 번째 숫자를 입력하세요 : "))
result = a + b
print(a, "+", b, "=", result)
result = a - b
print(a, "-", b, "=", result)
result = a * b
print(a, "*", b, "=", result)
result = a / b
print(a, "/", b, "=", result)`;

  const CODE02_04_OUT = `첫 번째 숫자를 입력하세요 : 300
두 번째 숫자를 입력하세요 : 200
300 + 200 = 500
300 - 200 = 100
300 * 200 = 60000
300 / 200 = 1.5`;

  const CODE02_07 = `import turtle
import random

## 함수 선언 부분 ##
def screenLeftClick(x, y) :
    global r, g, b
    turtle.pencolor((r, g, b))
    turtle.pendown()
    turtle.goto(x, y)

def screenRightClick(x, y) :
    turtle.penup()
    turtle.goto(x, y)

def screenMidClick(x, y) :
    global r, g, b
    tSize = random.randrange(1, 10)
    turtle.shapesize(tSize)
    r = random.random()
    g = random.random()
    b = random.random()

## 변수 선언 부분 ##
pSize = 10
r, g, b = 0.0, 0.0, 0.0

## 메인 코드 부분 ##
turtle.title('거북이로 그림 그리기')
turtle.shape('turtle')
turtle.pensize(pSize)

turtle.onscreenclick(screenLeftClick, 1)
turtle.onscreenclick(screenMidClick, 2)
turtle.onscreenclick(screenRightClick, 3)

turtle.done()`;

  PY_COURSE.addChapter({
    id: 'ch02',
    no: '02',
    title: '미리 만드는 쓸 만한 프로그램',
    subtitle: '변수 · print() · input() · 파일 저장 · 마우스로 그리는 터틀 그래픽',
    summary: '변수와 print() 로 사칙 연산 계산기를 만들고, 코드를 파일로 저장해 다시 실행하는 방법을 익힌 뒤 input() 으로 값을 입력받도록 확장합니다. 마지막으로 긴 프로그램의 구조(함수 · 변수 · 메인)를 배우고, 마우스 클릭으로 그림을 그리는 터틀 그래픽 프로그램을 완성합니다. 각 교시마다 한 걸음 더 나아가 이름 짓기(PEP 8) · f-문자열 서식 · 오류 읽기와 디버깅 · 입력 검증 · 함수로 나누기 · 이벤트 기반 구조까지 다루고, 네 개의 미니 프로젝트로 마무리합니다.',
    goals: [
      '변수가 값을 담는 그릇이며 = 가 대입 연산자임을 설명할 수 있다',
      'print() 함수로 변수의 값과 글자를 함께 출력할 수 있다',
      '여러 줄의 코드를 파일(스크립트)로 작성 · 저장 · 실행 · 수정하는 순서를 설명할 수 있다',
      'input() 과 int() 로 키보드에서 숫자를 입력받아 계산하는 계산기 프로그램을 만들 수 있다',
      '함수 선언 · 변수 선언 · 메인 코드로 나누어 긴 프로그램을 작성하고, 마우스 클릭으로 그림을 그리는 터틀 프로그램을 만들 수 있다',
      '(심화) 좋은 이름 · 상수 · f-문자열 서식으로 읽기 좋은 코드와 보기 좋은 출력을 만들 수 있다',
      '(심화) 오류 메시지를 읽고 print() 로 버그를 찾으며, 잘못된 입력을 다시 묻는 프로그램을 만들 수 있다',
      '(심화) 프로그램을 입력 · 계산 · 출력 함수로 나누고, 콜백과 이벤트 루프로 동작하는 프로그램의 구조를 설명할 수 있다'
    ],
    sections: [
      /* ===================== ch02-1 ===================== */
      {
        id: 'ch02-1',
        title: '계산기의 기본 기능 — 변수와 print()',
        minutes: 50,
        goals: [
          '이 장에서 만들 두 프로그램(계산기, 터틀 그림판)의 모습을 안다',
          '변수에 값을 대입하고 = 의 의미를 설명할 수 있다',
          '변수끼리 계산한 결과를 새 변수에 저장할 수 있다',
          'print() 로 여러 값을 쉼표로 이어 한 줄에 출력할 수 있다',
          '+, -, *, / 로 사칙 연산을 하고 나누기 결과가 실수임을 안다',
          '(심화) 뜻이 드러나는 변수 이름과 대문자 상수를 PEP 8 스타일로 지을 수 있다',
          '(심화) f-문자열로 자릿수 · 자리 맞춤을 지정해 결과를 보기 좋게 출력할 수 있다',
          '(심화) += 로 값을 누적하는 변수를 쓸 수 있다'
        ],
        flow: [['도입: 이 장에서 만들 프로그램', 5], ['변수와 대입 연산자', 8], ['더하기 · print() 출력', 10], ['빼기 · 곱하기 · 나누기', 8], ['한 걸음 더: 이름 · f-문자열 · 누적', 9], ['퀴즈 · 실습', 10]],
        content: [
          { type: 'h', text: '이 장에서 만들 프로그램' },
          { type: 'p', html: '1장에서 파이썬을 설치하고 간단한 코드를 실행해 보았습니다. 이번 장에서는 문법을 하나하나 깊게 파기보다, <b>실제로 쓸 수 있는 작은 프로그램 두 개</b>를 먼저 완성해 보면서 “프로그램이 어떻게 만들어지는지” 전체 흐름을 경험합니다. 여기서 잠깐 스치듯 만나는 변수 · 함수 · 반복문은 뒤의 장에서 자세히 다시 배웁니다.' },
          { type: 'figure', html: SVG_PREVIEW, caption: '이 장에서 만들 두 프로그램 — 왼쪽: 간단 계산기, 오른쪽: 마우스로 그리는 터틀 그림' },
          { type: 'list', items: [
            '<b>[프로그램 1] 간단 계산기</b> — 숫자 2개를 입력하면 더하기 · 빼기 · 곱하기 · 나누기 결과를 한꺼번에 보여 주는 아주 기본적인 계산기',
            '<b>[프로그램 2] 마우스로 그리는 터틀 그래픽</b> — 마우스로 창을 클릭하면 거북이가 그 자리로 따라오며 알록달록한 선을 그리는 그림판'
          ] },
          { type: 'h', text: '필요한 변수 준비' },
          { type: 'p', html: '계산기는 두 숫자를 기억해 두었다가 계산해야 합니다. 값을 기억해 두는 곳이 필요하죠. 콘솔의 <b>&gt;&gt;&gt; 셸</b>(대화형 모드)을 열고 다음 두 줄을 입력해 봅시다.' },
          { type: 'code', repl: true, title: '그림 2-1. 변수 준비', code: 'a = 100\nb = 50', expect: '>>> a = 100\n>>> b = 50\n>>>',
            desc: '엔터를 눌러도 아무것도 출력되지 않습니다. 화면에는 보이지 않지만 컴퓨터 메모리 안에서는 일이 일어났습니다.' },
          { type: 'p', html: '여기서 <code>=</code> 는 수학의 “같다”가 아닙니다. <b>“오른쪽의 값을 왼쪽 이름에 넣어라”</b>라는 명령이고, 이것을 <b>대입 연산자(assignment operator)</b>라고 부릅니다. 즉 <code>a = 100</code> 은 <code>a ← 100</code> 과 같은 뜻입니다.' },
          { type: 'figure', html: SVG_BOWLS, caption: '그림 2-2. 그릇을 2개 준비 — a 그릇에는 100, b 그릇에는 50' },
          { type: 'p', html: '메모리 안에 <code>a</code> 라는 이름표가 붙은 그릇과 <code>b</code> 라는 그릇이 생기고, 각각 100 과 50 이 담긴 상태가 됩니다. 프로그래밍 언어에서 이렇게 <b>값을 담아 두는 이름 붙은 그릇</b>을 <b>변수(variable)</b>라고 합니다.' },
          { type: 'code', repl: true, title: '추가 예제. 변수에 무엇이 들어 있는지 확인하기', code: 'a = 100\nb = 50\na\nb\na = 7\na',
            expect: '>>> a = 100\n>>> b = 50\n>>> a\n100\n>>> b\n50\n>>> a = 7\n>>> a\n7\n>>>',
            desc: '셸에서는 변수 이름만 입력해도 담긴 값을 보여 줍니다. 그릇에 새 값을 넣으면 <b>이전 값은 사라지고 새 값으로 바뀝니다</b> (100 → 7).' },
          { type: 'callout', kind: 'tip', title: '= 앞뒤의 띄어쓰기', html: '<code>a=100</code> 과 <code>a = 100</code> 은 똑같이 동작합니다. 교재 화면에는 붙여 쓴 모양도 나오지만, 파이썬 공식 스타일 가이드(PEP 8)는 <b>연산자 앞뒤를 한 칸씩 띄우는 것</b>을 권장합니다. 읽기 쉬운 코드가 좋은 코드입니다.' },
          { type: 'callout', kind: 'more', title: '📘 변수 이름 짓기 규칙', html: '<ul><li>영문자 · 숫자 · 밑줄(<code>_</code>)로 만들고, <b>숫자로 시작할 수 없습니다</b>: <code>num1</code> (○), <code>1num</code> (✕)</li><li><b>대소문자를 구분</b>합니다: <code>result</code> 와 <code>Result</code> 는 서로 다른 변수</li><li><code>if</code>, <code>for</code>, <code>print</code> 처럼 파이썬이 이미 쓰는 단어는 피합니다 (<code>print = 3</code> 이라고 하면 print() 를 못 쓰게 됩니다)</li><li>한글 이름(<code>점수 = 90</code>)도 동작하지만, 보통은 영어로 <b>뜻이 드러나는 이름</b>을 씁니다: <code>x</code> 보다 <code>price</code>, <code>total</code></li></ul>변수와 데이터형은 3장에서 자세히 배웁니다.' },
          { type: 'h', text: '더하기 기능 구현' },
          { type: 'p', html: '이제 두 그릇의 값을 더해 봅시다. 더한 결과는 <code>result</code> 라는 새 그릇에 담습니다.' },
          { type: 'code', repl: true, title: '그림 2-3. 더하기 구현', code: 'a = 100\nb = 50\nresult = a + b', expect: '>>> a = 100\n>>> b = 50\n>>> result = a + b\n>>>',
            desc: '오른쪽의 <code>a + b</code> 가 먼저 계산되어 150 이 되고, 그 값이 왼쪽의 <code>result</code> 에 대입됩니다.' },
          { type: 'figure', html: SVG_ADD, caption: '그림 2-4. 더하는 작업 — a 와 b 의 값을 합쳐 새 그릇 result 에 담는다' },
          { type: 'p', html: '중요한 점: 변수의 값을 <b>꺼내 쓴다고 그릇이 비지는 않습니다</b>. 실제로는 값을 “복사해서” 계산하므로 <code>result</code> 에 150 이 들어간 뒤에도 <code>a</code> 에는 100, <code>b</code> 에는 50 이 그대로 남아 있습니다.' },
          { type: 'code', repl: true, title: '추가 예제. 계산 후에도 a, b 는 그대로', code: 'a = 100\nb = 50\nresult = a + b\nresult\na\nb',
            expect: '>>> a = 100\n>>> b = 50\n>>> result = a + b\n>>> result\n150\n>>> a\n100\n>>> b\n50\n>>>' },
          { type: 'h', text: '더한 결과 출력 — print() 함수' },
          { type: 'p', html: '셸에서는 이름만 입력해도 값이 보이지만, 파일로 만든 프로그램에서는 <b><code>print()</code> 함수</b>로 출력해야 화면에 나타납니다. 먼저 result 그릇의 내용만 출력해 봅시다.' },
          { type: 'code', repl: true, title: '그림 2-5. 더한 결과 출력 1', code: 'a = 100\nb = 50\nresult = a + b\nprint(result)',
            expect: '>>> a = 100\n>>> b = 50\n>>> result = a + b\n>>> print(result)\n150\n>>>' },
          { type: 'p', html: '150 이라는 숫자만 나오니 무엇을 계산했는지 알기 어렵습니다. <code>print()</code> 의 괄호 안에 <b>쉼표(,)로 여러 개를 나열</b>하면 한 줄에 이어서 출력할 수 있습니다. 계산식까지 보여 주도록 바꿔 봅시다.' },
          { type: 'code', repl: true, title: '그림 2-6. 더한 결과 출력 2', code: "a = 100\nb = 50\nresult = a + b\nprint(result)\nprint( a, '+', b, '=', result )",
            expect: ">>> a = 100\n>>> b = 50\n>>> result = a + b\n>>> print(result)\n150\n>>> print( a, '+', b, '=', result )\n100 + 50 = 150\n>>>" },
          { type: 'figure', html: SVG_PRINT, caption: '그림 2-7. print() 함수로 모두 출력 — 변수는 담긴 값이, 따옴표 안은 글자 그대로 출력된다' },
          { type: 'list', items: [
            '따옴표가 <b>없는</b> <code>a</code>, <code>b</code>, <code>result</code> → 변수이므로 <b>담긴 값</b>(100, 50, 150)이 출력됩니다.',
            '따옴표가 <b>있는</b> <code>\'+\'</code>, <code>\'=\'</code> → 글자(문자열)이므로 <b>그대로</b> 출력됩니다. 작은따옴표 <code>\'…\'</code> 와 큰따옴표 <code>"…"</code> 는 같은 뜻입니다.',
            '쉼표로 구분한 항목 사이에는 <b>빈칸이 한 칸씩</b> 자동으로 들어갑니다.'
          ] },
          { type: 'callout', kind: 'info', title: '여기서 잠깐 — 함수(Function)', html: '<b>함수</b>는 어떤 일을 하도록 미리 묶어 둔 기능입니다. 이름 뒤에 <b>괄호</b>가 붙는 것이 특징이죠. <code>print()</code> 는 “괄호 안의 내용을 화면에 출력하라”는 기능을 파이썬이 미리 만들어 제공하는 함수입니다. 파이썬에는 이런 함수가 아주 많지만, 필요한 기능을 모두 제공할 수는 없으므로 프로그래머가 <b>직접 함수를 만들어</b> 쓰기도 합니다. 함수를 만드는 방법은 이 장 뒷부분(02-4 교시)에서 맛보고, 9장에서 자세히 배웁니다.' },
          { type: 'callout', kind: 'more', title: '📘 print() 를 더 편하게 — sep 과 f-문자열', html: '<ul><li><code>sep=\'\'</code> 를 붙이면 항목 사이의 빈칸을 없애거나 다른 글자로 바꿀 수 있습니다.</li><li>파이썬 3.6 부터는 <b>f-문자열(f-string)</b>을 많이 씁니다. 따옴표 앞에 <code>f</code> 를 붙이고 <code>{변수}</code> 자리에 값이 들어갑니다. 요즘 파이썬 코드에서 가장 흔히 보는 출력 방식입니다.</li></ul>' },
          { type: 'code', title: '추가 예제. print() 의 여러 가지 출력 방법', code: `a = 100
b = 50
result = a + b
print(a, '+', b, '=', result)           # 기본: 항목 사이에 빈칸 한 칸
print(a, '+', b, '=', result, sep='')   # 빈칸 없이
print(a, b, result, sep=' / ')          # 사이에 ' / ' 넣기
print(f'{a} + {b} = {result}')          # f-문자열`,
            expect: `100 + 50 = 150
100+50=150
100 / 50 / 150
100 + 50 = 150`,
            desc: '<code>#</code> 뒤의 글은 <b>주석</b>으로, 실행되지 않고 사람에게 설명만 합니다 (02-4 교시에서 다시 다룹니다).' },
          { type: 'h', text: '빼기, 곱하기, 나누기 기능 구현' },
          { type: 'p', html: '더하기와 같은 방법으로 나머지 연산도 만들어 봅시다. <code>result</code> 그릇을 <b>다시 사용</b>합니다. 새 값을 대입하면 이전 값은 지워지고 새 계산 결과로 바뀝니다.' },
          { type: 'code', repl: true, title: '그림 2-8. 실습 최종 결과', code: "a = 100\nb = 50\nresult = a + b\nprint(result)\nprint( a, '+', b, '=', result )\nresult = a - b\nprint( a, '-', b, '=', result )\nresult = a * b\nprint( a, '*', b, '=', result )\nresult = a / b\nprint( a, '/', b, '=', result )",
            expect: ">>> a = 100\n>>> b = 50\n>>> result = a + b\n>>> print(result)\n150\n>>> print( a, '+', b, '=', result )\n100 + 50 = 150\n>>> result = a - b\n>>> print( a, '-', b, '=', result )\n100 - 50 = 50\n>>> result = a * b\n>>> print( a, '*', b, '=', result )\n100 * 50 = 5000\n>>> result = a / b\n>>> print( a, '/', b, '=', result )\n100 / 50 = 2.0\n>>>" },
          { type: 'table', head: ['연산', '기호', '예', '결과'], rows: [
            ['더하기', '<code>+</code>', '<code>100 + 50</code>', '150'],
            ['빼기', '<code>-</code>', '<code>100 - 50</code>', '50'],
            ['곱하기', '<code>*</code> (별표)', '<code>100 * 50</code>', '5000'],
            ['나누기', '<code>/</code> (슬래시)', '<code>100 / 50</code>', '2.0']
          ], caption: '파이썬의 사칙 연산 기호 — 곱하기는 ×가 아니라 *, 나누기는 ÷가 아니라 /' },
          { type: 'callout', kind: 'warn', title: '나누기 결과는 왜 2 가 아니라 2.0 일까?', html: '파이썬의 <code>/</code> 는 나누어떨어지더라도 <b>항상 실수(소수점이 있는 수)</b>로 결과를 줍니다. 100 / 50 은 2.0, 7 / 2 는 3.5 입니다. 정수 몫만 원하면 <code>//</code> 를 씁니다(아래 더 알아보기).' },
          { type: 'callout', kind: 'more', title: '📘 계산기에 넣을 수 있는 연산자 더 보기', html: '<code>//</code> 몫(소수점 아래 버림), <code>%</code> 나머지, <code>**</code> 거듭제곱도 자주 씁니다. 연산자는 4장에서 모두 정리합니다.' },
          { type: 'code', repl: true, title: '추가 예제. 몫 · 나머지 · 거듭제곱', code: '7 / 2\n7 // 2\n7 % 2\n2 ** 10',
            expect: '>>> 7 / 2\n3.5\n>>> 7 // 2\n3\n>>> 7 % 2\n1\n>>> 2 ** 10\n1024\n>>>' },
          { type: 'callout', kind: 'warn', title: '자주 하는 실수', html: '<ul><li><b>0으로 나누기</b>: <code>100 / 0</code> 은 계산할 수 없어 <code>ZeroDivisionError</code> 오류가 납니다.</li><li><b>이름 오타</b>: <code>print(Result)</code> 처럼 대소문자를 틀리면 <code>NameError: name \'Result\' is not defined</code> — “그런 그릇은 없다”는 뜻입니다.</li><li><b>따옴표 착각</b>: <code>print(\'a\')</code> 는 변수 a 의 값이 아니라 글자 <code>a</code> 를 출력합니다.</li></ul>' },
          { type: 'code', title: '추가 예제. 0으로 나누면 생기는 오류', code: `a = 100
b = 0
result = a / b
print(a, "/", b, "=", result)`, expectError: true,
            expect: `Traceback (most recent call last):
  File "main.py", line 3, in <module>
    result = a / b
             ~~^~~
ZeroDivisionError: division by zero`,
            desc: '오류 메시지는 <b>아래에서부터</b> 읽습니다. 마지막 줄이 오류의 종류와 이유, 그 위의 <code>line 3</code> 이 오류가 난 위치입니다.' },

          { type: 'h', text: '한 걸음 더 ① — 좋은 이름이 좋은 코드를 만든다' },
          { type: 'p', html: '변수 이름을 <code>a</code>, <code>b</code>, <code>c</code> 로 지어도 컴퓨터는 아무 불평을 하지 않습니다. 하지만 코드를 읽는 사람은 다릅니다. 프로그램은 <b>한 번 쓰고 여러 번 읽는</b> 글이고, 그 “여러 번” 중 대부분은 <b>몇 주 뒤의 나 자신</b>이 읽습니다. 같은 계산을 두 가지 이름으로 써 보면 차이가 분명해집니다.' },
          { type: 'code', title: '추가 예제. 이름이 없는 코드 — 무엇을 계산하는 걸까?', code: `a = 12000
b = 3
c = a * b
d = c * 0.1
print(c + d)`,
            expect: '39600.0',
            desc: '결과는 맞지만, 6개월 뒤에 이 코드를 열면 <code>d</code> 가 배송비인지 세금인지 알 수 없습니다.' },
          { type: 'code', title: '추가 예제. 같은 계산, 이름을 붙인 코드', code: `TAX_RATE = 0.1          # 부가세율 (바뀌지 않는 값 = 상수)
price = 12000           # 물건 1개 값
count = 3               # 개수
total = price * count   # 상품 금액
tax = total * TAX_RATE  # 부가세
print("결제 금액 :", total + tax)`,
            expect: '결제 금액 : 39600.0',
            desc: '줄 수는 늘었지만 <b>주석이 없어도 읽히는</b> 코드가 되었습니다. 부가세율이 바뀌면 <code>TAX_RATE</code> 한 곳만 고치면 됩니다. 코드 안에 툭 튀어나온 <code>0.1</code> 같은 숫자를 <b>매직 넘버(magic number)</b>라고 하며, 이름 붙은 상수로 바꾸는 것이 좋습니다.' },
          { type: 'table', head: ['아쉬운 이름', '왜 아쉬운가', '나은 이름'], rows: [
            ['<code>a</code>, <code>b</code>, <code>x1</code>', '무엇을 담았는지 알 수 없음', '<code>price</code>, <code>count</code>, <code>total</code>'],
            ['<code>data</code>, <code>value</code>, <code>temp</code>', '너무 뭉뚱그린 이름', '<code>user_name</code>, <code>score</code>, <code>celsius</code>'],
            ['<code>l</code>, <code>O</code>, <code>I</code>', '숫자 1 · 0 과 헷갈림', '한 글자 이름을 피하기'],
            ['<code>0.1</code> (이름 없는 숫자)', '뜻을 모르고 여러 곳에 흩어짐', '<code>TAX_RATE = 0.1</code>'],
            ['<code>list</code>, <code>str</code>, <code>sum</code>', '파이썬이 이미 쓰는 이름을 가림', '<code>items</code>, <code>text</code>, <code>total</code>']
          ], caption: '이름 짓기 — 짧게 쓰는 것보다 “읽으면 알 수 있게” 쓰는 것이 중요합니다' },
          { type: 'callout', kind: 'more', title: '📘 PEP 8 — 파이썬 코드 스타일 안내서', html: '<b>PEP 8</b> 은 파이썬 공식 스타일 가이드입니다. 문법이 아니라 <b>약속</b>이지만, 거의 모든 파이썬 프로젝트가 따르므로 처음부터 익혀 두면 좋습니다.<ul><li><b>변수 · 함수</b>: 소문자와 밑줄 — <code>user_name</code>, <code>total_price</code> (스네이크 표기법)</li><li><b>상수</b>: 모두 대문자 — <code>TAX_RATE</code>, <code>MAX_SIZE</code> (“바꾸지 마세요”라는 신호일 뿐, 파이썬이 막아 주지는 않습니다)</li><li><b>연산자 앞뒤</b>는 한 칸씩: <code>a = 100</code>, <code>total = price * count</code></li><li>쉼표 <b>뒤에만</b> 한 칸: <code>print(a, b)</code> (<code>print( a , b )</code> ✕)</li><li>한 줄은 79자 이내, 들여쓰기는 <b>스페이스 4칸</b></li></ul>이 강좌의 예제 중에는 교재를 따라 <code>pSize</code>, <code>thisYear</code> 처럼 낙타 표기법(camelCase)을 쓴 것도 있습니다. 교재 코드를 그대로 비교할 수 있게 남겨 둔 것이며, <b>여러분이 새로 쓰는 코드는 PEP 8 의 <code>pen_size</code>, <code>this_year</code> 스타일</b>을 권합니다.' },

          { type: 'h', text: '한 걸음 더 ② — f-문자열로 결과 다듬기' },
          { type: 'p', html: '<code>print(a, "+", b, "=", result)</code> 는 쉼표마다 빈칸이 하나씩 들어가서 <code>100 원</code> 처럼 어색해질 때가 있습니다. <b>f-문자열(f-string)</b>을 쓰면 출력 모양을 문장 하나로 정확히 설계할 수 있습니다. 따옴표 앞에 <code>f</code> 를 붙이고, 값을 넣고 싶은 자리에 <code>{변수}</code> 를 씁니다. 중괄호 안에는 <code>{a + b}</code> 처럼 <b>계산식</b>도 넣을 수 있습니다.' },
          { type: 'code', title: '추가 예제. f-문자열의 서식 — 자릿수와 자리 맞추기', code: `price = 12000
count = 3
total = price * count
average = total / 7

print(f"{total}원")
print(f"{total:,}원")
print(f"{average:.2f}")
print(f"[{'사과':<6}]")
print(f"[{total:>10,}]")
print(f"{total = }")`,
            expect: `36000원
36,000원
5142.86
[사과    ]
[    36,000]
total = 36000`,
            desc: '<code>:</code> 뒤가 <b>서식 지정</b>입니다. <code>,</code> 천 단위 쉼표, <code>.2f</code> 소수점 둘째 자리까지(반올림), <code>&lt;6</code> 왼쪽 맞춤 6칸, <code>&gt;10</code> 오른쪽 맞춤 10칸(<code>^</code> 는 가운데). 마지막 <code>{total = }</code> 는 <b>이름과 값을 함께</b> 출력해 주어 디버깅할 때 아주 편합니다.' },
          { type: 'callout', kind: 'more', title: '📘 f-string · format() · % — 무엇을 쓸까', html: '파이썬에는 문자열에 값을 끼워 넣는 방법이 세 가지 있습니다.<pre><code>print("%d + %d = %d" % (a, b, a + b))        # 옛 방식 (C 언어 스타일)\nprint("{} + {} = {}".format(a, b, a + b))    # 파이썬 2.6 ~\nprint(f"{a} + {b} = {a + b}")                # 파이썬 3.6 ~ (권장)</code></pre>셋 다 동작하지만 <b>f-문자열이 가장 짧고, 값이 어디에 들어가는지 눈으로 바로 보여서</b> 요즘 코드는 대부분 f-문자열을 씁니다. 오래된 코드나 로그 출력에서 앞의 두 가지를 만날 수 있으니 모양만 알아 두세요.' },

          { type: 'h', text: '한 걸음 더 ③ — 값을 쌓아 가는 변수' },
          { type: 'p', html: '<code>total = total + price</code> 는 수학으로 보면 말이 안 되는 식이지만, 대입 연산자의 뜻(“오른쪽을 계산해 왼쪽에 넣어라”)을 생각하면 자연스럽습니다. <b>지금 total 에 들어 있는 값에 price 를 더해서 다시 total 에 넣어라</b>. 장바구니 합계처럼 값을 쌓아 갈 때 쓰는 아주 흔한 패턴입니다.' },
          { type: 'code', title: '추가 예제. 장바구니 합계 쌓아 가기', code: `total = 0
print("시작 :", total)

total = total + 3000    # 우유
print("우유 담은 뒤 :", total)

total += 4500           # 빵 (total = total + 4500 의 짧은 표현)
print("빵 담은 뒤 :", total)

total += 2000           # 주스
print("합계 :", total)`,
            expect: `시작 : 0
우유 담은 뒤 : 3000
빵 담은 뒤 : 7500
합계 : 9500`,
            desc: '<code>total = 0</code> 처럼 <b>처음 값(초깃값)을 먼저 정해 두는 것</b>이 중요합니다. 없는 그릇에 더하려고 하면 <code>NameError</code> 가 납니다.' },
          { type: 'callout', kind: 'more', title: '📘 += 같은 복합 대입 연산자', html: '<code>total += 5</code> 는 <code>total = total + 5</code> 와 같습니다. 같은 방식으로 <code>-=</code>, <code>*=</code>, <code>/=</code>, <code>//=</code>, <code>%=</code>, <code>**=</code> 가 있습니다. 변수 이름을 두 번 쓰지 않으니 <b>오타가 줄고 읽기도 쉽습니다</b>(<code>total = totla + 5</code> 같은 실수를 막아 줍니다). 참고로 파이썬에는 <code>total++</code> 같은 증가 연산자가 <b>없습니다</b>. C 나 자바를 먼저 배운 사람이 자주 틀리는 부분입니다.' }
        ],
        practice: [
          {
            title: '실습 2-1. 다른 숫자로 사칙 연산하기',
            level: 1,
            desc: '<p>변수 <code>a</code> 에 <b>7</b>, <code>b</code> 에 <b>2</b> 를 넣고 아래처럼 사칙 연산 결과를 출력하세요.</p><pre>7 + 2 = 9\n7 - 2 = 5\n7 * 2 = 14\n7 / 2 = 3.5</pre>',
            hint: '그림 2-8 의 코드를 그대로 쓰고 첫 두 줄의 숫자만 바꾸면 됩니다. 계산은 <code>result</code> 변수에 담아 출력하세요.',
            starter: `a = 7
b = 2
# TODO: 더하기 결과를 result 에 넣고 계산식과 함께 출력
# TODO: 빼기, 곱하기, 나누기도 같은 방법으로
`,
            solution: `a = 7
b = 2
result = a + b
print(a, "+", b, "=", result)
result = a - b
print(a, "-", b, "=", result)
result = a * b
print(a, "*", b, "=", result)
result = a / b
print(a, "/", b, "=", result)
`,
            expect: `7 + 2 = 9
7 - 2 = 5
7 * 2 = 14
7 / 2 = 3.5`
          },
          {
            title: '실습 2-2. 직사각형의 넓이와 둘레',
            level: 1,
            desc: '<p>가로(<code>width</code>)가 12, 세로(<code>height</code>)가 5 인 직사각형의 넓이와 둘레를 구해 출력하세요.</p><pre>넓이 : 60\n둘레 : 34</pre>',
            hint: '넓이 = 가로 * 세로, 둘레 = (가로 + 세로) * 2. 괄호를 쓰면 괄호 안이 먼저 계산됩니다.',
            starter: `width = 12
height = 5
# TODO: 넓이를 area 에, 둘레를 around 에 계산해 넣기

# TODO: '넓이 :', '둘레 :' 와 함께 출력
`,
            solution: `width = 12
height = 5
area = width * height
around = (width + height) * 2
print("넓이 :", area)
print("둘레 :", around)
`,
            expect: `넓이 : 60
둘레 : 34`
          },
          {
            title: '실습 2-3. 물건값 계산 — 이름을 잘 붙여 보기',
            level: 1,
            desc: '<p>한 개에 1200원인 사과를 8개 삽니다. 부가세율은 10%입니다. 아래 세 줄이 출력되도록 프로그램을 완성하세요.</p><pre>상품 금액 : 9600\n부가세 : 960.0\n결제 금액 : 10560.0</pre><p>단, <b>부가세율은 대문자 상수 <code>TAX_RATE</code></b> 로, 나머지 값도 뜻이 드러나는 이름으로 만드세요.</p>',
            hint: '<code>TAX_RATE = 0.1</code>, <code>price</code>, <code>count</code>, <code>total</code>, <code>tax</code> 다섯 개의 이름이면 충분합니다. 상품 금액 = 값 × 개수, 부가세 = 상품 금액 × 세율.',
            starter: `TAX_RATE = 0.1
price = 1200
count = 8
# TODO: 상품 금액(total) 과 부가세(tax) 계산

# TODO: 세 줄 출력
`,
            solution: `TAX_RATE = 0.1
price = 1200
count = 8
total = price * count
tax = total * TAX_RATE
print("상품 금액 :", total)
print("부가세 :", tax)
print("결제 금액 :", total + tax)
`,
            expect: `상품 금액 : 9600
부가세 : 960.0
결제 금액 : 10560.0`
          },
          {
            title: '실습 2-4. 분을 시간과 분으로 바꾸기',
            level: 2,
            desc: '<p>변수 <code>minutes</code> 에 100 이 들어 있을 때, 몫 연산자 <code>//</code> 와 나머지 연산자 <code>%</code> 를 사용해 아래처럼 출력하세요.</p><pre>100 분은 1 시간 40 분</pre>',
            hint: '1시간 = 60분. <code>minutes // 60</code> 은 시간, <code>minutes % 60</code> 은 남은 분입니다.',
            starter: `minutes = 100
# TODO: 시간(hour)과 남은 분(rest)을 계산

# TODO: print() 로 출력
`,
            solution: `minutes = 100
hour = minutes // 60
rest = minutes % 60
print(minutes, "분은", hour, "시간", rest, "분")
`,
            expect: '100 분은 1 시간 40 분'
          },
          {
            title: '실습 2-5. 영수증처럼 줄 맞춰 출력하기',
            level: 2,
            desc: '<p>f-문자열의 자리 맞춤(<code>&lt;</code>, <code>&gt;</code>)과 천 단위 쉼표(<code>,</code>)를 사용해 아래 모양으로 출력하세요.</p><pre>아메리카노     2개    9,000원\n카페라떼      1개    5,000원\n------------------------\n합계             14,000원</pre>',
            hint: '이름은 <code>{name:&lt;8}</code>, 개수는 <code>{count:&gt;3}</code>, 금액은 <code>{money:&gt;8,}</code> 으로 맞춥니다. 줄은 <code>"-" * 24</code> 로 만들 수 있습니다(글자를 24번 반복).',
            starter: `name1, price1, count1 = "아메리카노", 4500, 2
name2, price2, count2 = "카페라떼", 5000, 1
# TODO: 품목별 금액(sum1, sum2) 과 합계(total) 계산

# TODO: f-문자열로 줄을 맞춰 출력
`,
            solution: `name1, price1, count1 = "아메리카노", 4500, 2
name2, price2, count2 = "카페라떼", 5000, 1
sum1 = price1 * count1
sum2 = price2 * count2
total = sum1 + sum2
print(f"{name1:<8}{count1:>3}개 {sum1:>8,}원")
print(f"{name2:<8}{count2:>3}개 {sum2:>8,}원")
print("-" * 24)
print(f"{'합계':<8}{'':>5}{total:>8,}원")
`,
            expect: `아메리카노     2개    9,000원
카페라떼      1개    5,000원
------------------------
합계             14,000원`
          },
          {
            title: '🚀 프로젝트 2-1. 여행 경비 정산서',
            level: 3,
            desc: '<p>친구들과 떠날 여행의 경비를 계산해 <b>정산서</b>를 출력하는 프로그램을 만드세요.</p><p><b>요구 사항</b></p><ol><li>1인당 비용을 <b>상수</b>로 준비한다: 교통비 <code>TRANSPORT = 45000</code>, 숙박비 <code>HOTEL = 80000</code>, 식비 <code>FOOD = 35000</code></li><li>인원 수는 변수 <code>people = 4</code> 로 둔다 (이 값만 바꾸면 전체 정산서가 다시 계산되어야 한다)</li><li>항목별 <b>전체 금액</b>(1인 비용 × 인원)과 <b>합계</b>, <b>1인당 금액</b>을 계산한다</li><li>f-문자열로 천 단위 쉼표와 자리 맞춤을 써서 아래 모양으로 출력한다</li></ol><pre>============================\n       여행 경비 정산서\n============================\n교통비          180,000원\n숙박비          320,000원\n식비           140,000원\n----------------------------\n합계           640,000원\n1인당          160,000원</pre><p><b>더 해 보기</b> — ① 인원을 7명으로 바꿔 보세요(숫자 한 개만 고치면 되나요?). ② 1인당 금액을 만원 단위로도 함께 출력해 보세요(<code>{value / 10000:.1f}만원</code>). ③ 02-3 교시를 배운 뒤 인원 수를 <code>input()</code> 으로 입력받도록 바꿔 보세요.</p>',
            hint: '<code>"=" * 28</code> 로 구분선을 만들고, 항목 줄은 <code>f"{\'교통비\':&lt;8}{TRANSPORT * people:&gt;12,}원"</code> 처럼 이름은 왼쪽, 금액은 오른쪽으로 맞춥니다. 제목은 <code>f"{\'여행 경비 정산서\':^24}"</code> 로 가운데 정렬.',
            starter: `## 값 준비 ##
TRANSPORT = 45000   # 1인 교통비
HOTEL = 80000       # 1인 숙박비
FOOD = 35000        # 1인 식비
people = 4

## 계산 ##
# TODO: 1인당 합계(per_person) 와 전체 합계(total) 계산

## 출력 ##
print("=" * 28)
# TODO: 제목과 항목별 금액, 합계, 1인당 금액 출력
`,
            solution: `## 값 준비 ##
TRANSPORT = 45000   # 1인 교통비
HOTEL = 80000       # 1인 숙박비
FOOD = 35000        # 1인 식비
people = 4

## 계산 ##
per_person = TRANSPORT + HOTEL + FOOD
total = per_person * people

## 출력 ##
print("=" * 28)
print(f"{'여행 경비 정산서':^24}")
print("=" * 28)
print(f"{'교통비':<8}{TRANSPORT * people:>12,}원")
print(f"{'숙박비':<8}{HOTEL * people:>12,}원")
print(f"{'식비':<8}{FOOD * people:>12,}원")
print("-" * 28)
print(f"{'합계':<8}{total:>12,}원")
print(f"{'1인당':<8}{per_person:>12,}원")
`,
            expect: `============================
       여행 경비 정산서
============================
교통비          180,000원
숙박비          320,000원
식비           140,000원
----------------------------
합계           640,000원
1인당          160,000원`
          }
        ],
        quiz: [
          { q: '파이썬에서 <code>a = 100</code> 의 의미로 가장 알맞은 것은?', options: ['a 와 100 이 같은지 비교한다', '100 을 변수 a 에 대입한다', 'a 를 100 번 출력한다', 'a 에서 100 을 뺀다'], answer: 1, explain: '<code>=</code> 는 대입 연산자로, 오른쪽 값을 왼쪽 변수에 넣습니다. 같은지 비교할 때는 <code>==</code> 를 씁니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>a = 100\nb = 50\nresult = a + b\nprint(a, \'+\', b, \'=\', result)</code></pre>', options: ['a + b = result', '100+50=150', '100 + 50 = 150', '150'], answer: 2, explain: '변수는 값으로, 따옴표 안은 글자 그대로 출력되고 쉼표 사이에는 빈칸이 한 칸씩 들어갑니다.' },
          { q: '다음 코드를 실행한 뒤 변수 <code>a</code> 의 값은?<pre><code>a = 100\nb = 50\nresult = a - b</code></pre>', options: ['50', '100', '150', '0'], answer: 1, explain: '값을 꺼내 계산해도 원래 변수의 값은 변하지 않습니다. a 는 그대로 100 입니다.' },
          { q: '<code>print(100 / 50)</code> 의 출력 결과는?', options: ['2', '2.0', '0.5', '오류'], answer: 1, explain: '파이썬의 <code>/</code> 는 나누어떨어져도 항상 실수를 돌려줍니다.' },
          { q: '다음 코드는 실행하면 오류가 납니다. <b>몇 행</b>을 고쳐야 하는가?<pre><code>1: price = 1000\n2: count = 3\n3: total = price * count\n4: print("합계 :", Total)</code></pre>', options: ['1행', '2행', '3행', '4행'], answer: 3, explain: '변수 이름은 대소문자를 구분하므로 <code>Total</code> 이라는 변수는 없습니다. <code>NameError: name \'Total\' is not defined</code> 가 나며, 4행의 <code>Total</code> 을 <code>total</code> 로 고치면 됩니다.' },
          { q: '<code>total = 36000</code> 일 때 <code>print(f"{total:,}원")</code> 의 출력은?', options: ['36000원', '36,000원', '{total:,}원', '오류'], answer: 1, explain: 'f-문자열의 서식 <code>:,</code> 는 천 단위마다 쉼표를 넣어 줍니다.' }
        ],
        slides: [
          { layout: 'title', title: '계산기의 기본 기능 — 변수와 print()', subtitle: 'Chapter 02 · Section 01~02 — 미리 만드는 쓸 만한 프로그램', badge: '02-1',
            notes: '<p><b>[도입 1분]</b> “오늘은 문법 공부보다 먼저, 실제로 돌아가는 프로그램 두 개를 만들어 봅니다.” 라고 시작합니다.</p><p>2장의 목표: 계산기(변수 · print · input)와 마우스로 그리는 터틀 그림판. 문법은 가볍게 맛보고 3장 이후 자세히 배운다는 점을 미리 알려 부담을 덜어 줍니다.</p>' },
          { layout: 'diagram', title: '이 장에서 만들 프로그램', html: SVG_PREVIEW, caption: '[프로그램 1] 간단 계산기 · [프로그램 2] 마우스로 그리는 터틀 그림',
            notes: '<p><b>[3분]</b> 완성된 모습을 먼저 보여 주면 동기가 생깁니다. 가능하면 02-5 교시의 Code02-07 을 미리 실행해 직접 클릭해 그림을 그려 보이세요.</p><p>발문: “계산기가 두 숫자를 계산하려면 컴퓨터는 무엇을 해야 할까요?” → 숫자를 <b>기억</b>해야 한다 → 변수로 연결.</p>' },
          { layout: 'bullets', title: '필요한 변수 준비', lead: '변수 = 값을 담아 두는 이름 붙은 그릇',
            bullets: ['<code>=</code> 는 “같다”가 아니라 <b>대입 연산자</b>', ['오른쪽 값을 왼쪽 그릇에 넣어라', '<code>a = 100</code> 은 <code>a ← 100</code> 과 같은 뜻'], '<code>a = 100</code>, <code>b = 50</code> → 그릇 2개가 생김', '같은 그릇에 새 값을 넣으면 <b>이전 값은 사라짐</b>'],
            notes: '<p><b>[4분]</b> 수학 시간의 <code>x = 5</code> 와 다르다는 점을 강조합니다. “<code>a = a + 1</code> 은 수학적으로 말이 안 되지만 프로그래밍에서는 ‘a 에 1 을 더해서 다시 a 에 넣어라’로 자연스럽다”는 예로 차이를 보여 주세요.</p>' },
          { layout: 'diagram', title: '변수는 그릇', html: SVG_BOWLS, caption: '그림 2-2. 그릇을 2개 준비',
            notes: '<p><b>[2분]</b> 그릇 비유는 이 장 전체에서 계속 씁니다. 그릇의 “이름표”가 변수 이름, “내용물”이 값입니다.</p><p>변수 이름 규칙(숫자로 시작 불가, 대소문자 구분)은 짧게 언급만 하고 3장으로 넘깁니다.</p>' },
          { layout: 'code', repl: true, title: '셸에서 변수 만들고 확인하기', code: 'a = 100\nb = 50\na\nb\na = 7\na',
            points: ['셸은 한 줄씩 바로 실행', '이름만 입력하면 <b>담긴 값</b> 표시', '새 값을 넣으면 <b>덮어쓰기</b>'],
            notes: '<p><b>[3분]</b> 콘솔의 <b>&gt;&gt;&gt; 셸</b> 버튼으로 대화형 모드를 열어 한 줄씩 직접 입력해 보이세요. (IDLE 의 Shell 창과 같은 역할)</p><p>질문: “마지막 줄에서 a 는 100 일까요 7 일까요?”</p>' },
          { layout: 'diagram', title: '더하기 기능 구현', html: SVG_ADD, caption: '그림 2-3, 2-4. result = a + b — 오른쪽을 먼저 계산해 왼쪽에 대입',
            notes: '<p><b>[3분]</b> 실행 순서를 강조합니다: ① 오른쪽 <code>a + b</code> 계산(150) ② 왼쪽 result 에 대입.</p><p>그릇에서 값을 “부어서” 비우는 것이 아니라 “복사해서” 쓰므로 a, b 는 그대로라는 점을 확인시킵니다.</p>' },
          { layout: 'code', repl: true, title: '더한 결과 출력', code: "a = 100\nb = 50\nresult = a + b\nprint(result)\nprint( a, '+', b, '=', result )",
            points: ['<code>print(result)</code> → 150 만 출력', '쉼표로 여러 항목을 한 줄에', '따옴표 안은 <b>글자 그대로</b>'],
            notes: '<p><b>[4분]</b> 그림 2-5, 2-6. 실행 전 “마지막 줄은 어떻게 출력될까요?” 예측시키세요.</p><p>흔한 질문: 작은따옴표와 큰따옴표 차이 → 없음. 둘 중 하나로 통일해서 쓰면 됩니다.</p>' },
          { layout: 'diagram', title: 'print() 함수로 모두 출력', html: SVG_PRINT, caption: '그림 2-7. 변수는 값으로, 따옴표 안은 글자 그대로, 쉼표는 빈칸',
            notes: '<p><b>[2분]</b> 여기서 “함수” 용어를 처음 소개합니다(여기서 잠깐): 이름 뒤에 괄호 → 미리 만들어진 기능. print() 는 파이썬이 제공하는 함수, 나중에 우리가 직접 함수를 만들 것(02-4).</p>' },
          { layout: 'code', repl: true, title: '빼기, 곱하기, 나누기 기능 구현', code: "a = 100\nb = 50\nresult = a - b\nprint( a, '-', b, '=', result )\nresult = a * b\nprint( a, '*', b, '=', result )\nresult = a / b\nprint( a, '/', b, '=', result )",
            points: ['곱하기 <code>*</code>, 나누기 <code>/</code>', 'result 그릇을 <b>재사용</b>', '<code>/</code> 결과는 항상 실수 (2.0)'],
            notes: '<p><b>[5분]</b> 그림 2-8. 키보드에 × ÷ 가 없으니 * / 를 쓴다고 설명합니다.</p><p>발문: “100 / 50 은 왜 2 가 아니라 2.0 일까요?” → 파이썬의 / 는 항상 실수. 정수 몫은 // (4장). 시간이 되면 <code>7 // 2</code>, <code>7 % 2</code> 도 셸에서 보여 주세요.</p>' },
          { layout: 'table', title: '사칙 연산 기호', head: ['연산', '기호', '예', '결과'], rows: [['더하기', '+', '100 + 50', '150'], ['빼기', '-', '100 - 50', '50'], ['곱하기', '*', '100 * 50', '5000'], ['나누기', '/', '100 / 50', '2.0'], ['(몫)', '//', '7 // 2', '3'], ['(나머지)', '%', '7 % 2', '1']],
            lead: '+ - * / 에 몫 // · 나머지 % 까지',
            notes: '<p><b>[2분]</b> 아래 두 줄(//, %)은 강의자료 밖의 보충입니다. 실습 2-4 에서 사용합니다.</p><p>0 으로 나누면 ZeroDivisionError 가 난다는 것도 짧게 언급하세요.</p>' },
          { layout: 'two', title: '한 걸음 더 ① — 이름이 코드를 설명한다',
            left: { title: '이름이 없는 코드', code: 'a = 12000\nb = 3\nc = a * b\nd = c * 0.1\nprint(c + d)' },
            right: { title: '이름을 붙인 코드', code: 'TAX_RATE = 0.1\nprice = 12000\ncount = 3\ntotal = price * count\ntax = total * TAX_RATE\nprint("결제 금액 :", total + tax)' },
            notes: '<p><b>[4분]</b> 두 코드의 결과는 같습니다(39600.0). “6개월 뒤에 어느 쪽을 열고 싶은가요?”라고 물어보세요.</p><p>핵심 용어 둘: <b>매직 넘버</b>(뜻 모를 0.1) → 이름 붙은 <b>상수</b>(대문자 TAX_RATE). PEP 8 은 변수 · 함수는 <code>snake_case</code>, 상수는 <code>UPPER_CASE</code> 를 권합니다.</p><p>교재 코드에 나오는 <code>pSize</code>, <code>thisYear</code> 는 낙타 표기법이며, 교재 비교를 위해 남겨 두었다고 안내하세요.</p>' },
          { layout: 'code', title: '한 걸음 더 ② — f-문자열로 다듬기', code: 'price = 12000\ncount = 3\ntotal = price * count\naverage = total / 7\n\nprint(f"{total}원")\nprint(f"{total:,}원")\nprint(f"{average:.2f}")\nprint(f"[{\'사과\':<6}]")\nprint(f"[{total:>10,}]")\nprint(f"{total = }")',
            points: ['<code>f"…{변수}…"</code> — 자리에 값이 들어감', '<code>:,</code> 천 단위 쉼표 · <code>:.2f</code> 소수 둘째 자리', '<code>:&lt;6</code> 왼쪽 · <code>:&gt;10</code> 오른쪽 · <code>:^10</code> 가운데', '<code>{total = }</code> — 이름과 값을 함께(디버깅)'],
            notes: '<p><b>[4분]</b> 실행해서 줄이 나란히 맞는 모습을 보여 주면 효과가 큽니다. 중괄호 안에 <code>{a + b}</code> 처럼 계산식도 들어간다는 점을 꼭 말하세요.</p><p>%-서식 · format() 도 있지만 요즘은 f-문자열이 표준이라고 한 줄로 정리합니다. 실습 2-5(영수증)와 프로젝트 2-1(정산서)에서 바로 씁니다.</p>' },
          { layout: 'quiz', title: '확인 문제', q: '다음 코드의 출력은?<pre><code>a = 100\nb = 50\nresult = a + b\nprint(a, \'+\', b, \'=\', result)</code></pre>', options: ['a + b = result', '100+50=150', '100 + 50 = 150', '150'], answer: 2, explain: '변수는 값으로, 따옴표 안은 그대로, 쉼표 사이는 빈칸 한 칸.',
            notes: '<p><b>[2분]</b> 손을 들어 보기 번호를 고르게 한 뒤 정답을 공개합니다. 2번을 고른 학생에게 “빈칸은 어디서 생길까요?”라고 되물어 쉼표의 역할을 다시 짚습니다.</p>' },
          { layout: 'practice', title: '실습 2-1. 다른 숫자로 사칙 연산하기', desc: '<p>a 에 7, b 에 2 를 넣고 사칙 연산 결과를 계산식과 함께 출력하세요.</p><pre>7 + 2 = 9\n7 - 2 = 5\n7 * 2 = 14\n7 / 2 = 3.5</pre>',
            starter: 'a = 7\nb = 2\n# TODO: 사칙 연산 결과 출력\n',
            solution: 'a = 7\nb = 2\nresult = a + b\nprint(a, "+", b, "=", result)\nresult = a - b\nprint(a, "-", b, "=", result)\nresult = a * b\nprint(a, "*", b, "=", result)\nresult = a / b\nprint(a, "/", b, "=", result)\n',
            notes: '<p><b>[8분]</b> 빠른 학생에게는 실습 2-2(직사각형) → 2-3(상수와 이름) → 2-4(// 와 %) → 2-5(f-문자열 영수증) 순서로 이어서 풀게 하고, 더 빠른 학생은 🚀 프로젝트 2-1(여행 경비 정산서)에 도전시키세요.</p><p>순회하며 확인할 점: 곱하기에 x 를 쓰는 실수, 따옴표 짝이 맞지 않는 실수.</p>' },
          { layout: 'summary', title: '정리', bullets: ['변수 = 값을 담는 이름 붙은 그릇', '<code>=</code> 는 대입 연산자 (오른쪽 → 왼쪽)', '<code>print(a, \'+\', b, \'=\', result)</code> — 쉼표로 여러 값 출력', '사칙 연산: <code>+ - * /</code>, <code>/</code> 의 결과는 실수', '함수 = 이름 뒤에 괄호가 붙는 미리 만든 기능'],
            notes: '<p><b>[1분]</b> 다음 교시 예고: “셸에서 입력한 코드는 끄면 사라집니다. 어떻게 보관할까요?” → 파일로 저장(스크립트 모드).</p>' }
        ]
      },

      /* ===================== ch02-2 ===================== */
      {
        id: 'ch02-2',
        title: '계산기 프로그램 저장 — 스크립트 모드',
        minutes: 50,
        goals: [
          '대화형 모드에서 입력한 내용은 종료하면 사라진다는 것을 이해한다',
          '여러 줄의 코드를 편집기(스크립트 모드)에 작성하고 실행할 수 있다',
          '저장한 코드를 다시 열어 수정하고 다시 실행할 수 있다',
          '긴 프로그램을 코딩하는 순서(코딩 → 저장 → 실행 → 수정)를 설명할 수 있다',
          '오류 메시지에서 오류의 종류와 위치를 찾을 수 있다',
          '(심화) SyntaxError · NameError · TypeError 등 오류 이름으로 원인을 좁힐 수 있다',
          '(심화) print() 로 중간값을 확인하며 오류 없는 버그를 찾을 수 있다',
          '(심화) 반복되는 코드와 값을 정리하는 리팩터링의 필요성을 설명할 수 있다'
        ],
        flow: [['복습 · 대화형 모드의 한계', 6], ['스크립트 모드: Code02-01', 10], ['파일 열어 수정 · 다시 실행', 7], ['긴 프로그램 코딩 순서 · 오류 읽기', 8], ['한 걸음 더: 오류 종류 · 디버깅 · 리팩터링', 9], ['퀴즈 · 실습', 10]],
        content: [
          { type: 'h', text: '대화형 모드를 끝내면?' },
          { type: 'p', html: '앞 교시에서 셸(대화형 모드)에 입력한 계산 코드는 잘 동작했습니다. 그런데 IDLE 을 종료했다가 다시 켜서 나누기만 다시 해 보면 어떻게 될까요?' },
          { type: 'callout', kind: 'more', title: '📘 IDLE 을 종료하는 방법 (집에서 IDLE 을 쓸 때)', html: 'IDLE 셸에서 <code>exit()</code> 를 입력하면 <b>“Kill? — Your program is still running! Do you want to kill it?”</b> 창이 뜹니다. <b>&lt;확인&gt;</b> 을 누르면 종료됩니다. 메뉴 <b>[File]-[Exit]</b> 를 선택해도 됩니다.' },
          { type: 'p', html: 'IDLE 을 다시 켜고 <code>result = a / b</code> 만 입력하면 오류가 납니다. 이 강좌의 편집기에서도 똑같이 확인할 수 있습니다. 프로그램은 실행할 때마다 <b>새로 시작</b>하므로, 앞에서 만든 <code>a</code>, <code>b</code> 는 남아 있지 않습니다.' },
          { type: 'code', title: '그림 2-10. 오류 발생 — 변수가 없는 상태에서 나누기', code: `result = a / b
print(result)`, expectError: true,
            expect: `Traceback (most recent call last):
  File "main.py", line 1, in <module>
    result = a / b
             ^
NameError: name 'a' is not defined`,
            desc: '<code>NameError: name \'a\' is not defined</code> — “a 라는 이름(그릇)은 정의되어 있지 않다”는 뜻입니다.' },
          { type: 'p', html: '대화형 모드에서 만든 변수와 코드는 <b>메모리(RAM)</b>에만 있습니다. 메모리의 내용은 프로그램을 끝내면 모두 지워지므로, 다시 쓰려면 처음부터 전부 입력해야 합니다. 몇 줄이라면 괜찮지만 수십 줄, 수백 줄이라면 곤란하겠죠. 그래서 코드는 하드디스크나 USB 같은 <b>저장 장치에 파일로 저장</b>해 둡니다.' },
          { type: 'figure', html: SVG_MEMORY, caption: '메모리에 있는 것은 사라지고, 파일로 저장한 것은 남는다' },
          { type: 'callout', kind: 'more', title: '📘 교재의 실습 폴더 C:\\CookPython', html: '교재는 C 드라이브 바로 아래에 <code>CookPython</code> 폴더를 만들고 모든 실습 파일을 거기에 저장합니다. 집에서 IDLE 로 실습한다면 파일 탐색기에서 <b>[내 PC]-[로컬 디스크 (C:)]</b> 를 열고 새 폴더 <code>CookPython</code> 을 만들어 두세요. 이 웹 강좌에서는 폴더를 만들 필요가 없습니다.' },
          { type: 'h', text: '스크립트 모드 — 여러 줄을 한꺼번에' },
          { type: 'p', html: '코드가 수십 줄이면 한 줄씩 입력하는 대화형 모드 대신 <b>스크립트 모드(script mode)</b>를 씁니다. IDLE 에서는 <b>[File]-[New File]</b> 을 선택하면 메모장처럼 생긴 창이 열리고, 여기에 여러 줄을 입력해 둔 뒤 한꺼번에 실행합니다. 입력하는 동안에는 실행되지 않는다는 점이 셸과 다릅니다.' },
          { type: 'p', html: '이 강좌에서는 페이지 아래쪽의 <b>편집기</b>가 스크립트 모드입니다. 예제의 <b>▶ 실행</b>을 누르면 코드가 편집기로 들어가 실행되고, 결과는 오른쪽 <b>콘솔</b>에 나옵니다. 편집기에서 코드를 고친 뒤 <b>▶ 실행</b> 또는 <kbd>Ctrl</kbd>+<kbd>Enter</kbd> 로 다시 실행할 수 있습니다.' },
          { type: 'table', head: ['하는 일', 'IDLE (집에서)', '이 강좌 (웹)'], rows: [
            ['대화형 모드', 'IDLE Shell 창의 <code>&gt;&gt;&gt;</code>', '콘솔의 <b>&gt;&gt;&gt; 셸</b> 버튼'],
            ['스크립트 모드 (새 파일)', '<b>[File]-[New File]</b> (Ctrl+N)', '페이지 아래 <b>편집기</b>'],
            ['실행', '<b>[Run]-[Run Module]</b> (F5)', '<b>▶ 실행</b> (Ctrl+Enter)'],
            ['저장', '<b>[File]-[Save]</b> (Ctrl+S) → <code>.py</code> 파일', '편집기 내용은 교시별로 <b>브라우저에 자동 보관</b> · <b>⧉ 복사</b>로 내 파일에 붙여 넣기'],
            ['열기', '<b>[File]-[Open]</b> (Ctrl+O)', '예제의 <b>✎ 편집기로</b> · 같은 교시를 다시 열면 이어서 편집'],
            ['처음 코드로 되돌리기', '(저장하지 않고 닫기)', '<b>↺ 초기화</b>']
          ], caption: 'IDLE 과 이 강좌 화면의 대응 관계' },
          { type: 'code', title: 'Code02-01.py', code: CODE02_01,
            expect: `100 + 50 = 150
100 - 50 = 50
100 * 50 = 5000
100 / 50 = 2.0`,
            desc: '셸에서 한 줄씩 입력했던 코드를 그대로 파일에 모았습니다. 셸과 달리 스크립트에서는 <code>result</code> 처럼 이름만 써서는 값이 보이지 않으므로 <b>반드시 print()</b> 로 출력합니다.' },
          { type: 'callout', kind: 'more', title: '📘 IDLE 에서 저장하고 실행하기 (그림 2-12, 2-13)', html: '<ol><li>스크립트 창에서 <b>[File]-[Save]</b> 를 선택합니다.</li><li>“다른 이름으로 저장” 창에서 <code>C:\\CookPython</code> 폴더를 고르고 파일 이름에 <code>Code02-01</code> 을 입력한 뒤 <b>&lt;저장&gt;</b> — 확장명 <code>.py</code> 는 자동으로 붙습니다. 창 제목이 <code>Code02-01.py - C:/CookPython/Code02-01.py</code> 로 바뀝니다.</li><li><b>[Run]-[Run Module]</b> 또는 <kbd>F5</kbd> 를 누르면 셸 창에 <code>===== RESTART: C:/CookPython/Code02-01.py =====</code> 가 표시되고 그 아래에 결과가 한꺼번에 출력됩니다.</li></ol>저장하지 않은 상태에서 F5 를 누르면 “먼저 저장하라”는 창이 뜹니다. <b>RESTART</b> 는 셸의 메모리를 비우고 새로 시작한다는 뜻입니다.' },
          { type: 'callout', kind: 'tip', title: '파일 탐색기에서 바로 실행하기', html: '저장한 <code>.py</code> 파일은 파일 탐색기에서 더블클릭해 실행할 수도 있습니다(교재 41쪽 “여기서 잠깐”). 다만 결과를 출력하자마자 창이 닫혀 버리므로, 결과를 보려면 코드 맨 끝에 <code>input()</code> 을 한 줄 넣어 엔터를 누를 때까지 기다리게 하면 됩니다.' },
          { type: 'h', text: '파이썬 파일 열어 수정하기' },
          { type: 'p', html: '파일로 저장해 두면 언제든 다시 열어 고칠 수 있습니다. IDLE 에서는 <b>[File]-[Open]</b> 으로 <code>Code02-01.py</code> 를 연 다음, <code>a</code> 와 <code>b</code> 의 값을 <b>300</b> 과 <b>200</b> 으로 바꾸고 <b>[File]-[Save]</b>(<kbd>Ctrl</kbd>+<kbd>S</kbd>)로 저장한 뒤 <kbd>F5</kbd> 로 다시 실행합니다. 이 강좌에서는 위 Code02-01 을 <b>✎ 편집기로</b> 불러와 첫 두 줄만 고치고 다시 실행하면 됩니다.' },
          { type: 'code', title: 'Code02-01.py 수정 (a = 300, b = 200) — 그림 2-17', code: `a = 300
b = 200
result = a + b
print(a, "+", b, "=", result)
result = a - b
print(a, "-", b, "=", result)
result = a * b
print(a, "*", b, "=", result)
result = a / b
print(a, "/", b, "=", result)`,
            expect: `300 + 200 = 500
300 - 200 = 100
300 * 200 = 60000
300 / 200 = 1.5`,
            desc: '<b>두 줄만 고쳤는데</b> 네 가지 계산이 모두 새로 됩니다. 셸이었다면 열 줄을 전부 다시 입력해야 했겠죠. 이것이 파일로 저장하는 가장 큰 이유입니다.' },
          { type: 'callout', kind: 'more', title: '📘 .py 파일의 정체와 이름 짓기', html: '<ul><li><code>.py</code> 파일은 특별한 형식이 아니라 <b>그냥 글자만 들어 있는 텍스트 파일</b>입니다. 메모장이나 VS Code 로 열어도 똑같은 코드가 보입니다.</li><li>파일 이름에는 <b>공백과 한글을 피하고</b> 영문 · 숫자 · <code>_</code>, <code>-</code> 정도만 쓰는 것이 안전합니다.</li><li><b>주의!</b> 내 파일을 <code>turtle.py</code>, <code>random.py</code> 처럼 파이썬 모듈 이름으로 저장하면 <code>import turtle</code> 이 진짜 turtle 대신 내 파일을 불러와 이상한 오류가 납니다. 이 장의 터틀 예제를 저장할 때 꼭 기억하세요.</li></ul>' },
          { type: 'h', text: '긴 프로그램을 코딩하는 순서' },
          { type: 'p', html: '앞으로 만들 프로그램은 대부분 스크립트 모드로 작성합니다. 긴 프로그램을 만드는 순서를 정리하면 다음과 같습니다.' },
          { type: 'figure', html: SVG_FLOW, caption: '그림 2-18. 긴 프로그램을 코딩하는 순서 — 실행 결과가 틀리면 다시 코딩 단계로' },
          { type: 'list', ordered: true, items: [
            '<b>준비</b>: IDLE 을 실행합니다. (이 강좌: 페이지 아래 편집기)',
            '<b>새 파일 또는 기존 파일 열기</b>: 새 코드는 <b>[File]-[New File]</b>, 저장해 둔 코드는 <b>[File]-[Open]</b>.',
            '<b>코딩</b>: 문법에 맞게 여러 줄을 입력하거나 고칩니다.',
            '<b>저장</b>: <b>[File]-[Save]</b> 로 폴더와 파일 이름을 정해 저장합니다.',
            '<b>실행 및 결과 확인</b>: <b>[Run]-[Run Module]</b>(F5). 결과는 셸 창에 나옵니다.',
            '결과가 <b>틀리거나 오류</b>가 나면 3번(코딩)으로 돌아가 고치고, 맞으면 끝!'
          ] },
          { type: 'callout', kind: 'tip', title: '오류 메시지 읽는 법', html: '오류가 났다고 당황하지 마세요. 프로그래머는 하루에도 수십 번 오류를 만납니다. 메시지를 <b>아래에서 위로</b> 읽으면 됩니다.<ol><li><b>마지막 줄</b>: 오류의 종류와 이유 (<code>NameError: name \'prnt\' is not defined</code>)</li><li><b>그 위</b>: 문제가 된 코드 줄과 <code>^</code> 표시</li><li><b>File … line N</b>: 몇 번째 줄인지</li></ol>' },
          { type: 'code', title: '추가 예제. 오타 찾기 — 오류 메시지가 알려 주는 것', code: `a = 100
b = 50
result = a + b
prnt(a, "+", b, "=", result)`, expectError: true,
            expect: `Traceback (most recent call last):
  File "main.py", line 4, in <module>
    prnt(a, "+", b, "=", result)
    ^^^^
NameError: name 'prnt' is not defined. Did you mean: 'print'?`,
            desc: '최신 파이썬은 <code>Did you mean: \'print\'?</code> 처럼 <b>고칠 방법까지 제안</b>해 줍니다. <code>4행</code>의 <code>prnt</code> 를 <code>print</code> 로 고치면 해결됩니다.' },

          { type: 'h', text: '한 걸음 더 ① — 자주 만나는 오류 이름들' },
          { type: 'p', html: '오류 메시지의 <b>종류 이름</b>만 알아도 어디를 봐야 할지 반쯤 알 수 있습니다. 지금까지 만난 오류와 앞으로 자주 만날 오류를 정리해 둡니다.' },
          { type: 'table', head: ['오류 이름', '뜻', '흔한 원인', '어디를 볼까'], rows: [
            ['<code>SyntaxError</code>', '문법이 틀림', '괄호 · 따옴표 짝이 안 맞음, 콜론(:) 빠짐', '<b>표시된 줄과 그 바로 위 줄</b>'],
            ['<code>NameError</code>', '그런 이름이 없음', '오타, 대소문자 다름, 아직 만들지 않은 변수', '이름의 철자'],
            ['<code>TypeError</code>', '종류가 안 맞는 값끼리 연산', '문자열 − 문자열, <code>int()</code> 를 빼먹음', '값이 숫자인지 글자인지'],
            ['<code>ValueError</code>', '종류는 맞는데 값이 이상함', '<code>int("abc")</code>', '입력한 값'],
            ['<code>ZeroDivisionError</code>', '0 으로 나눔', '나누는 수가 0', '나누기 앞의 값'],
            ['<code>IndentationError</code>', '들여쓰기가 틀림', '스페이스와 탭이 섞임, 칸 수가 다름', '들여쓴 줄 전체']
          ], caption: '오류 이름은 “무엇이 잘못됐는지”를 알려 주는 첫 단서입니다' },
          { type: 'callout', kind: 'tip', title: 'SyntaxError 는 조금 다르다', html: '다른 오류는 프로그램이 <b>실행되다가</b> 나지만, <code>SyntaxError</code> 는 <b>실행이 시작되기도 전에</b> 납니다. 파이썬이 코드를 읽다가 “이 문장은 무슨 말인지 모르겠다”고 멈추는 것이죠. 그래서 앞부분의 <code>print()</code> 도 하나도 출력되지 않습니다. 또 파이썬은 <b>이상한 곳을 뒤늦게 눈치채는</b> 경우가 많아서, 표시된 줄이 멀쩡해 보이면 <b>그 바로 위 줄</b>을 살펴보세요.' },
          { type: 'code', title: '추가 예제. 괄호를 닫지 않으면 (SyntaxError)', code: `a = 100
b = 50
print(a + b
print("끝")`, expectError: true,
            expect: `  File "main.py", line 3
    print(a + b
         ^
SyntaxError: '(' was never closed`,
            desc: '<code>3행</code>의 괄호가 닫히지 않아 파이썬은 4행까지 한 문장으로 읽다가 포기합니다. 앞의 두 줄도 실행되지 않은 채 프로그램이 끝났다는 점에 주목하세요.' },

          { type: 'h', text: '한 걸음 더 ② — print() 로 디버깅하기' },
          { type: 'p', html: '오류가 <b>나지 않는데</b> 결과가 이상할 때가 더 어렵습니다. 파이썬은 아무 말도 해 주지 않으니까요. 이럴 때 가장 빠르고 확실한 방법은 <b>중간값을 print() 로 찍어 보는 것</b>입니다. 전문 개발자도 매일 쓰는 방법입니다.' },
          { type: 'code', title: '추가 예제. 평균이 이상하다 — 중간값을 찍어 원인 찾기', code: `kor = 90
eng = 85
math = 77

avg = kor + eng + math / 3
print("avg =", avg)                    # 이상하다! 84 가 아니다

print("확인 - 세 점수의 합 :", kor + eng + math)
print("확인 - math / 3 :", math / 3)   # 범인 발견: 수학 점수만 3으로 나눴다

avg = (kor + eng + math) / 3           # 괄호로 묶어 합계를 먼저 계산
print("고친 avg =", avg)`,
            expect: `avg = 200.66666666666666
확인 - 세 점수의 합 : 252
확인 - math / 3 : 25.666666666666668
고친 avg = 84.0`,
            desc: '<code>*</code> 와 <code>/</code> 는 <code>+</code> 보다 <b>먼저</b> 계산됩니다(수학과 같습니다). 그래서 <code>kor + eng + math / 3</code> 은 <code>kor + eng + (math / 3)</code> 이 됩니다. <b>괄호로 계산 순서를 분명히</b> 해 주는 것이 안전합니다.' },
          { type: 'callout', kind: 'more', title: '📘 버그를 찾는 순서', html: '<ol><li><b>오류 메시지를 끝까지 읽는다</b> — 종류 · 줄 번호 · 제안(Did you mean)</li><li><b>중간값을 출력한다</b> — <code>print(f"{total = }")</code> 처럼 이름과 값을 함께 찍으면 헷갈리지 않습니다.</li><li><b>값의 종류를 확인한다</b> — <code>print(type(a))</code>. 숫자인 줄 알았는데 문자열인 경우가 아주 많습니다.</li><li><b>작게 쪼갠다</b> — 긴 한 줄을 여러 줄로 나눠 어디서 틀어지는지 봅니다.</li><li><b>확인용 print 는 지운다</b> — 다 고친 뒤 정리합니다. 나중에는 <code>logging</code> 모듈이나 디버거(중단점)를 쓰지만, 시작은 언제나 print 입니다.</li></ol>' },

          { type: 'h', text: '한 걸음 더 ③ — 반복되는 코드 줄이기' },
          { type: 'p', html: 'Code02-01 을 다시 보면 <b>“계산해서 result 에 넣고, print 로 출력한다”</b>는 두 줄이 네 번 반복됩니다. 지금은 8줄이라 괜찮지만, 연산이 20가지라면 40줄이 되고, 출력 모양을 바꾸려면 20군데를 고쳐야 합니다. 동작은 그대로 두고 구조만 손보는 일을 <b>리팩터링(refactoring)</b>이라고 합니다.' },
          { type: 'code', title: '추가 예제. result 를 거치지 않고 바로 출력하기', code: `a = 100
b = 50
print(a, "+", b, "=", a + b)
print(a, "-", b, "=", a - b)
print(a, "*", b, "=", a * b)
print(a, "/", b, "=", a / b)`,
            expect: `100 + 50 = 150
100 - 50 = 50
100 * 50 = 5000
100 / 50 = 2.0`,
            desc: '결과는 Code02-01 과 똑같은데 줄 수는 절반입니다. <code>print()</code> 의 괄호 안에서도 계산할 수 있기 때문이죠. 다만 계산 결과를 <b>나중에 또 써야 한다면</b> 변수에 담아 두는 편이 낫습니다. 무조건 짧은 코드가 아니라 <b>읽기 쉽고 고치기 쉬운 코드</b>가 목표입니다.' },
          { type: 'callout', kind: 'more', title: '📘 DRY 원칙 — 같은 것을 두 번 쓰지 않기', html: '<b>DRY(Don\'t Repeat Yourself, 반복하지 마라)</b> 는 프로그래밍의 오래된 원칙입니다. 같은 코드가 두세 번 넘게 보이면 대개 셋 중 하나로 정리할 수 있습니다.<ul><li>같은 <b>값</b>이 반복 → <b>변수 · 상수</b>로 뽑기 (예: <code>3</code> → <code>count = 3</code>)</li><li>같은 <b>줄</b>이 값만 바꿔 반복 → <b>반복문</b> (6장 <code>for</code>)</li><li>같은 <b>덩어리</b>가 여러 곳에서 반복 → <b>함수</b> (이 장 02-4 교시, 9장)</li></ul>왜 그럴까요? 고칠 곳이 한 군데로 줄기 때문입니다. 반복된 코드는 “고치다 만 곳”이 생기기 쉽고, 그것이 곧 버그가 됩니다.' },
          { type: 'code', title: '추가 예제. 같은 값을 한 곳에서 관리하기', code: `kor, eng, math = 90, 85, 77

count = 3                    # 과목 수를 한 곳에서 관리
total = kor + eng + math     # 합계도 한 번만 계산

print("합계 :", total)
print("평균 :", total / count)
print("가장 높은 점수 :", max(kor, eng, math))`,
            expect: `합계 : 252
평균 : 84.0
가장 높은 점수 : 90`,
            desc: '과목이 하나 늘어도 <code>count</code> 와 <code>total</code> 만 고치면 됩니다. <code>max()</code> 는 여러 값 중 가장 큰 값을 돌려주는 파이썬 기본 함수입니다 (<code>min()</code>, <code>abs()</code>, <code>round()</code> 도 자주 씁니다).' },
          { type: 'callout', kind: 'more', title: '📘 IDLE 말고 다른 방법으로 실행하기', html: '<code>.py</code> 파일은 명령 프롬프트(터미널)에서 <code>python Code02-01.py</code> 라고 입력해도 실행됩니다. 실제 현장에서는 이 방식이 가장 흔합니다. 편집기도 IDLE 외에 <b>VS Code</b>, <b>PyCharm</b> 같은 도구를 많이 쓰는데, 오타를 실시간으로 잡아 주고 자동 완성 · 디버거를 제공합니다. 지금은 IDLE(또는 이 강좌의 웹 편집기)로 충분하지만, 코드가 길어지면 한 번 써 보세요.' }
        ],
        practice: [
          {
            title: '실습 2-6. Code02-01 고쳐서 다시 실행하기',
            level: 1,
            desc: '<p>Code02-01 에서 <code>a</code> 를 <b>17</b>, <code>b</code> 를 <b>5</b> 로 바꾸고, 맨 아래에 <b>몫(//)</b>과 <b>나머지(%)</b>를 출력하는 줄을 추가하세요.</p><pre>17 + 5 = 22\n17 - 5 = 12\n17 * 5 = 85\n17 / 5 = 3.4\n17 // 5 = 3\n17 % 5 = 2</pre>',
            hint: '앞의 네 가지와 똑같은 모양으로 <code>result = a // b</code>, <code>print(a, "//", b, "=", result)</code> 를 추가합니다.',
            starter: `a = 100
b = 50
result = a + b
print(a, "+", b, "=", result)
result = a - b
print(a, "-", b, "=", result)
result = a * b
print(a, "*", b, "=", result)
result = a / b
print(a, "/", b, "=", result)
# TODO: a, b 값을 17, 5 로 고치고 몫과 나머지 출력 추가
`,
            solution: `a = 17
b = 5
result = a + b
print(a, "+", b, "=", result)
result = a - b
print(a, "-", b, "=", result)
result = a * b
print(a, "*", b, "=", result)
result = a / b
print(a, "/", b, "=", result)
result = a // b
print(a, "//", b, "=", result)
result = a % b
print(a, "%", b, "=", result)
`,
            expect: `17 + 5 = 22
17 - 5 = 12
17 * 5 = 85
17 / 5 = 3.4
17 // 5 = 3
17 % 5 = 2`
          },
          {
            title: '실습 2-7. 7단 출력하기',
            level: 1,
            desc: '<p>편집기에 여러 줄을 작성해 7단의 1 ~ 5 까지를 출력하세요. 단 숫자는 변수 <code>dan</code> 에 넣고, 출력은 f-문자열로 만듭니다.</p><pre>7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35</pre><p>다 만들었으면 <code>dan</code> 을 <b>9</b> 로 바꿔 한 줄만 고쳐도 전체가 9단으로 바뀌는지 확인하세요.</p>',
            hint: '<code>print(f"{dan} x 1 = {dan * 1}")</code> 처럼 중괄호 안에 계산식을 바로 쓸 수 있습니다. 같은 모양으로 5줄.',
            starter: `dan = 7
# TODO: f-문자열로 7 x 1 ~ 7 x 5 를 출력
`,
            solution: `dan = 7
print(f"{dan} x 1 = {dan * 1}")
print(f"{dan} x 2 = {dan * 2}")
print(f"{dan} x 3 = {dan * 3}")
print(f"{dan} x 4 = {dan * 4}")
print(f"{dan} x 5 = {dan * 5}")
`,
            expect: `7 x 1 = 7
7 x 2 = 14
7 x 3 = 21
7 x 4 = 28
7 x 5 = 35`
          },
          {
            title: '실습 2-8. 평균이 이상해요 — print 로 원인 찾기',
            level: 2,
            desc: '<p>아래 코드는 오류 없이 실행되지만 평균이 <b>200.66…</b> 으로 나옵니다. 중간값을 <code>print()</code> 로 찍어 원인을 찾고, <b>평균 : 84.0</b> 이 나오도록 고치세요.</p>',
            hint: '<code>kor + eng + math</code> 를 따로 출력해 보고, <code>math / 3</code> 도 출력해 보세요. <code>/</code> 는 <code>+</code> 보다 먼저 계산됩니다 — <b>괄호</b>가 필요합니다.',
            starter: `kor = 90
eng = 85
math = 77
avg = kor + eng + math / 3
# TODO: 중간값을 print 로 확인하고 위 줄을 고치기
print("평균 :", avg)
`,
            solution: `kor = 90
eng = 85
math = 77
total = kor + eng + math
avg = total / 3
print("평균 :", avg)
`,
            expect: '평균 : 84.0'
          },
          {
            title: '실습 2-9. 오류 고치기',
            level: 2,
            desc: '<p>아래 코드는 실행하면 오류가 납니다. 오류 메시지를 읽고 <b>두 군데</b>를 고쳐 다음처럼 출력되게 하세요.</p><pre>100 + 50 = 150\n100 * 50 = 5000</pre>',
            hint: '오류 메시지의 마지막 줄과 줄 번호를 보세요. 하나를 고치고 다시 실행하면 다음 오류가 보입니다. 대소문자도 확인!',
            starter: `a = 100
b = 50
result = a + b
print(a, "+", b, "=", Result)
result = a * b
prnt(a, "*", b, "=", result)
`,
            solution: `a = 100
b = 50
result = a + b
print(a, "+", b, "=", result)
result = a * b
print(a, "*", b, "=", result)
`,
            expect: `100 + 50 = 150
100 * 50 = 5000`
          },
          {
            title: '실습 2-10. 버그 잡기 도전 — 오류 4개',
            level: 3,
            desc: '<p>세 사람의 평균 나이를 구하는 프로그램에 <b>오류가 4군데</b> 숨어 있습니다. 실행 → 오류 메시지 읽기 → 한 군데 고치기 → 다시 실행을 반복해 모두 잡아내세요.</p><p>목표 출력</p><pre>평균 나이 : 25.0</pre><p><b>힌트가 되는 오류 이름</b>: <code>NameError</code>(2번), <code>TypeError</code>(1번), <code>ZeroDivisionError</code>(1번)</p><p><b>더 해 보기</b> — 다 고친 뒤, 사람이 한 명 더 늘어도 고칠 곳이 적어지도록 <code>count</code> 변수를 만들어 보세요.</p>',
            hint: '① 변수 이름의 <b>대소문자</b>를 확인하세요(파이썬은 <code>thisYear</code> 와 <code>thisyear</code> 를 다르게 봅니다). ② 따옴표로 감싼 값은 숫자가 아니라 글자입니다. ③ 나누는 수가 0 이면 안 됩니다 — 사람 수는 몇 명인가요?',
            starter: `# 세 사람의 평균 나이 구하기 (오류 4개를 찾아 고치세요)
thisYear = 2026
birth1 = 2001
birth2 = 1998
birth3 = 2004

age1 = thisYear - birth1
age2 = thisyear - birth2
age3 = thisYear - "2004"

total = age1 + age2 + age3
average = total / 0
print("평균 나이 :", Average)
`,
            solution: `# 세 사람의 평균 나이 구하기 (오류를 모두 고친 코드)
thisYear = 2026
birth1 = 2001
birth2 = 1998
birth3 = 2004

age1 = thisYear - birth1
age2 = thisYear - birth2
age3 = thisYear - birth3

total = age1 + age2 + age3
average = total / 3
print("평균 나이 :", average)
`,
            expect: '평균 나이 : 25.0'
          }
        ],
        quiz: [
          { q: 'IDLE 을 종료했다가 다시 켠 뒤 셸에 <code>result = a / b</code> 만 입력하면 어떻게 되는가?', options: ['2.0 이 출력된다', '이전 값이 남아 있어 result 에 2.0 이 들어간다', 'NameError 가 발생한다', 'ZeroDivisionError 가 발생한다'], answer: 2, explain: '종료하면 메모리의 변수가 모두 사라지므로 a 가 정의되어 있지 않다는 NameError 가 납니다.' },
          { q: 'IDLE 에서 스크립트 모드의 코드를 실행하는 단축키는? (이 강좌에서는 Ctrl+Enter)', options: ['F1', 'F5', 'Ctrl+S', 'Ctrl+N'], answer: 1, explain: '[Run]-[Run Module] 의 단축키는 F5 입니다. Ctrl+S 는 저장, Ctrl+N 은 새 파일입니다.' },
          { q: '스크립트 모드에 대한 설명으로 <b>틀린</b> 것은?', options: ['여러 줄의 코드를 입력해 두고 한꺼번에 실행한다', '코드를 .py 파일로 저장해 다시 열 수 있다', '한 줄을 입력할 때마다 바로 실행된다', '값을 보려면 print() 로 출력해야 한다'], answer: 2, explain: '한 줄씩 바로 실행되는 것은 대화형 모드입니다. 스크립트 모드는 입력 중에는 실행되지 않습니다.' },
          { q: '다음 오류 메시지에서 문제가 있는 줄은?<pre><code>  File "main.py", line 4, in &lt;module&gt;\n    prnt(result)\nNameError: name \'prnt\' is not defined</code></pre>', options: ['1행', '2행', '4행', '알 수 없다'], answer: 2, explain: '<code>line 4</code> 가 오류 위치입니다. print 를 prnt 로 잘못 쓴 오타입니다.' },
          { q: '긴 프로그램을 코딩하는 순서로 알맞은 것은?', options: ['실행 → 코딩 → 저장', '코딩 → 저장 → 실행 및 결과 확인', '저장 → 실행 → 코딩', '코딩 → 실행 → 파일 열기'], answer: 1, explain: '코딩 → 저장 → 실행 및 결과 확인, 결과가 틀리면 다시 코딩 단계로 돌아갑니다.' },
          { q: '다음 코드의 출력은?<pre><code>a = 10\nb = 20\nc = 30\nprint(a + b + c / 3)</code></pre>', options: ['20.0', '40.0', '60', '오류'], answer: 1, explain: '<code>/</code> 가 <code>+</code> 보다 먼저 계산되어 <code>10 + 20 + 10.0</code> = 40.0 입니다. 평균을 구하려면 <code>(a + b + c) / 3</code> 처럼 괄호가 필요합니다.' }
        ],
        slides: [
          { layout: 'title', title: '계산기 프로그램 저장 — 스크립트 모드', subtitle: 'Chapter 02 · Section 03', badge: '02-2',
            notes: '<p><b>[도입 2분]</b> 복습 질문: “지난 시간에 만든 a, b, result 는 지금 어디에 있을까요?” → 셸을 닫았다면 이미 사라졌다. 오늘은 코드를 <b>남겨 두는 방법</b>을 배웁니다.</p>' },
          { layout: 'code', title: '종료 후 다시 나누기를 하면?', code: 'result = a / b\nprint(result)', expectError: true,
            points: ['변수 a, b 가 <b>없는</b> 상태', '<code>NameError</code>: 그런 이름 없음', '메모리의 내용은 종료하면 사라짐'],
            notes: '<p><b>[3분]</b> IDLE 에서는 <code>exit()</code> → Kill? 창 &lt;확인&gt; 또는 [File]-[Exit] 로 종료합니다(그림 2-9). 다시 켜서 나누기만 하면 그림 2-10 의 오류가 납니다.</p><p>이 강좌의 ▶ 실행도 매번 새로 시작하므로 같은 오류를 바로 보여 줄 수 있습니다.</p>' },
          { layout: 'diagram', title: '프로그램 저장의 필요성', html: SVG_MEMORY, caption: '메모리(RAM)는 종료하면 비워지고, 파일은 남는다',
            notes: '<p><b>[3분]</b> 비유: 메모리는 “칠판”, 파일은 “공책”. 수업이 끝나면 칠판은 지워지지만 공책에 적은 것은 남습니다.</p><p>교재는 C:\\CookPython 폴더에 저장합니다. 집에서 IDLE 로 할 학생들에게 폴더를 미리 만들어 두라고 안내하세요.</p>' },
          { layout: 'bullets', title: '스크립트 모드', lead: '여러 줄을 입력해 두고 한꺼번에 실행',
            bullets: ['IDLE: <b>[File]-[New File]</b> → 메모장 같은 창', ['입력하는 동안에는 실행되지 않음'], '이 강좌: 페이지 아래 <b>편집기</b>', ['▶ 실행 또는 <b>Ctrl+Enter</b> → 오른쪽 콘솔에 결과'], '셸과 달리 값을 보려면 <b>print()</b> 필요'],
            notes: '<p><b>[3분]</b> 화면을 보여 주며 편집기 · ▶ 실행 · 콘솔 · &gt;&gt;&gt; 셸 버튼의 위치를 확인시킵니다.</p><p>IDLE 대응: New File = 편집기, F5 = Ctrl+Enter, Shell 창 = 콘솔.</p>' },
          { layout: 'code', title: 'Code02-01.py', code: CODE02_01,
            points: ['셸에서 입력한 코드를 <b>파일에 모음</b>', '▶ 실행 → 결과가 <b>한꺼번에</b>', 'IDLE: 저장 후 F5 (RESTART 표시)'],
            notes: '<p><b>[5분]</b> 학생들이 직접 편집기에 입력해 보게 하세요(복사하지 말고 타이핑!). 오타가 나면 오류 메시지를 함께 읽는 좋은 기회입니다.</p><p>IDLE 저장: [File]-[Save] → C:\\CookPython → 이름 Code02-01 (.py 자동) → 창 제목에 경로 표시(그림 2-12).</p>' },
          { layout: 'table', title: 'IDLE ↔ 이 강좌', head: ['하는 일', 'IDLE', '이 강좌'], rows: [['대화형 모드', 'Shell 창 >>>', '콘솔의 >>> 셸'], ['새 파일', '[File]-[New File]', '편집기'], ['실행', '[Run]-[Run Module] F5', '▶ 실행 · Ctrl+Enter'], ['저장', '[File]-[Save] Ctrl+S', '브라우저 자동 보관 · ⧉ 복사'], ['열기', '[File]-[Open]', '✎ 편집기로']],
            notes: '<p><b>[2분]</b> 집에서 IDLE 을 쓰는 학생을 위한 대응표입니다. 편집기 내용은 교시별로 브라우저에 보관되므로 새로 고쳐도 남아 있지만, 오래 보관할 코드는 ⧉ 복사해서 .py 파일로 저장하도록 권합니다.</p>' },
          { layout: 'code', title: '파일 열어 수정 후 다시 실행', code: 'a = 300\nb = 200\nresult = a + b\nprint(a, "+", b, "=", result)\nresult = a - b\nprint(a, "-", b, "=", result)\nresult = a * b\nprint(a, "*", b, "=", result)\nresult = a / b\nprint(a, "/", b, "=", result)',
            points: ['IDLE: [File]-[Open] → 수정 → Ctrl+S → F5', '<b>두 줄만</b> 고쳐도 전체 결과가 바뀜', '저장의 가장 큰 장점 = 재사용'],
            notes: '<p><b>[4분]</b> 그림 2-16, 2-17. 학생에게 a, b 를 자기가 원하는 수로 바꿔 실행하게 해 보세요.</p><p>발문: “매번 코드를 고치지 않고 실행할 때마다 숫자를 물어보게 할 수는 없을까?” → 다음 교시 input() 으로 연결.</p>' },
          { layout: 'diagram', title: '긴 프로그램을 코딩하는 순서', html: SVG_FLOW, caption: '그림 2-18. 코딩 → 저장 → 실행 및 결과 확인 → (실패하면 다시 코딩)',
            notes: '<p><b>[4분]</b> 핵심은 “실패 → 다시 코딩” 되돌이 화살표입니다. 한 번에 완벽한 프로그램은 없다, 고치고 다시 실행하는 과정이 곧 프로그래밍이라는 점을 강조하세요.</p>' },
          { layout: 'code', title: '오류 메시지 읽는 법', code: 'a = 100\nb = 50\nresult = a + b\nprnt(a, "+", b, "=", result)', expectError: true,
            points: ['<b>아래에서 위로</b> 읽기', '마지막 줄: 오류 종류 · 이유', '<code>line 4</code>: 오류 위치', '<code>Did you mean: \'print\'?</code> 제안'],
            notes: '<p><b>[3분]</b> 일부러 오류를 내고 함께 읽습니다. “빨간 글씨는 컴퓨터가 보내는 힌트 편지”라고 말해 두려움을 줄여 주세요.</p><p>고친 뒤 다시 실행해 정상 결과를 확인합니다.</p>' },
          { layout: 'table', title: '한 걸음 더 ① — 자주 만나는 오류', head: ['오류 이름', '뜻', '어디를 볼까'],
            rows: [['SyntaxError', '문법이 틀림 (괄호 · 따옴표 · 콜론)', '표시된 줄과 <b>그 위 줄</b>'], ['NameError', '그런 이름 없음 (오타 · 대소문자)', '이름의 철자'], ['TypeError', '종류가 안 맞는 값끼리 연산', '숫자인가 글자인가'], ['ValueError', '값이 이상함 (int("abc"))', '입력한 값'], ['ZeroDivisionError', '0 으로 나눔', '나누는 수'], ['IndentationError', '들여쓰기가 틀림', '들여쓴 줄 전체']],
            lead: '오류 이름 = 무엇이 잘못됐는지 알려 주는 첫 단서',
            notes: '<p><b>[4분]</b> 모두 외울 필요는 없고 “이름을 보면 어디를 볼지 정해진다”는 감각만 주면 됩니다.</p><p>SyntaxError 만 성격이 다릅니다: 실행 <b>전</b>에 나므로 앞부분 print 도 출력되지 않습니다. 괄호를 닫지 않은 코드를 즉석에서 실행해 보여 주세요.</p>' },
          { layout: 'code', title: '한 걸음 더 ② — print 로 버그 찾기', code: 'kor = 90\neng = 85\nmath = 77\n\navg = kor + eng + math / 3\nprint("avg =", avg)\n\nprint("확인 - 합 :", kor + eng + math)\nprint("확인 - math / 3 :", math / 3)\n\navg = (kor + eng + math) / 3\nprint("고친 avg =", avg)',
            points: ['오류는 없는데 <b>결과가 이상한</b> 경우', '중간값을 찍어 범인을 좁힌다', '<code>/</code> 가 <code>+</code> 보다 먼저 계산됨', '<b>괄호</b>로 순서를 분명히'],
            notes: '<p><b>[5분]</b> 먼저 “84 가 나와야 하는데 200 이 나왔다”는 상황을 보여 주고, 학생들에게 어디를 확인해 볼지 물어보세요.</p><p>디버깅 순서 5단계를 정리합니다: 메시지 읽기 → 중간값 출력 → <code>type()</code> 확인 → 작게 쪼개기 → 확인용 print 지우기. <code>print(f"{total = }")</code> 서식을 알려 주면 좋아합니다.</p><p>실습 2-8 이 바로 이 문제입니다.</p>' },
          { layout: 'two', title: '한 걸음 더 ③ — 반복 줄이기 (리팩터링)',
            left: { title: '두 줄씩 네 번 (Code02-01)', code: 'a = 100\nb = 50\nresult = a + b\nprint(a, "+", b, "=", result)\nresult = a - b\nprint(a, "-", b, "=", result)' },
            right: { title: 'print 안에서 바로 계산', code: 'a = 100\nb = 50\nprint(a, "+", b, "=", a + b)\nprint(a, "-", b, "=", a - b)\nprint(a, "*", b, "=", a * b)\nprint(a, "/", b, "=", a / b)' },
            notes: '<p><b>[4분]</b> 결과는 같고 줄 수는 절반입니다. 단, 결과를 나중에 또 쓴다면 변수에 담는 쪽이 낫다는 균형도 꼭 말해 주세요 — <b>짧은 코드가 아니라 고치기 쉬운 코드</b>가 목표입니다.</p><p>DRY 원칙: 같은 <b>값</b>이 반복되면 변수 · 상수로, 같은 <b>줄</b>이면 반복문(6장), 같은 <b>덩어리</b>면 함수(02-4 교시)로. 이 세 가지가 앞으로 배울 문법의 이유이기도 합니다.</p>' },
          { layout: 'quiz', title: '확인 문제', q: '스크립트 모드에 대한 설명으로 <b>틀린</b> 것은?', options: ['여러 줄을 입력해 두고 한꺼번에 실행한다', '.py 파일로 저장해 다시 열 수 있다', '한 줄을 입력할 때마다 바로 실행된다', '값을 보려면 print() 로 출력해야 한다'], answer: 2, explain: '한 줄씩 바로 실행되는 것은 대화형 모드(셸)입니다.',
            notes: '<p><b>[2분]</b> 대화형 모드와 스크립트 모드의 차이를 한 번 더 정리합니다.</p>' },
          { layout: 'practice', title: '실습 2-9. 오류 고치기', desc: '<p>오류 메시지를 읽고 두 군데를 고쳐 <code>100 + 50 = 150</code>, <code>100 * 50 = 5000</code> 이 출력되게 하세요.</p>',
            starter: 'a = 100\nb = 50\nresult = a + b\nprint(a, "+", b, "=", Result)\nresult = a * b\nprnt(a, "*", b, "=", result)\n',
            solution: 'a = 100\nb = 50\nresult = a + b\nprint(a, "+", b, "=", result)\nresult = a * b\nprint(a, "*", b, "=", result)\n',
            notes: '<p><b>[8분]</b> 오류는 한 번에 하나씩만 보입니다(첫 오류에서 멈춤). 하나 고치고 → 다시 실행 → 다음 오류, 이 과정 자체가 “긴 프로그램 코딩 순서”의 실습입니다.</p><p>순서 추천: 실습 2-6(몫 · 나머지 추가) → 2-7(7단) → 2-8(평균 버그) → 2-9(오류 고치기). 빠른 학생은 실습 2-10(오류 4개 잡기)에 도전시키세요.</p>' },
          { layout: 'summary', title: '정리', bullets: ['대화형 모드의 변수는 종료하면 <b>사라진다</b>', '긴 코드는 <b>스크립트 모드</b>로 작성해 .py 파일로 저장', 'IDLE: New File → Save → F5 / 이 강좌: 편집기 → ▶ 실행', '코딩 → 저장 → 실행 → (실패하면) 다시 코딩', '오류 메시지는 <b>아래에서 위로</b> 읽는다'],
            notes: '<p><b>[1분]</b> 다음 교시: 실행할 때마다 숫자를 키보드로 입력받는 계산기(input 함수).</p>' }
        ]
      },

      /* ===================== ch02-3 ===================== */
      {
        id: 'ch02-3',
        title: '계산기 프로그램 확장 — input() 과 int()',
        minutes: 50,
        goals: [
          'input() 함수로 키보드에서 값을 입력받을 수 있다',
          'input() 이 돌려주는 값은 문자열이라는 것을 설명할 수 있다',
          'int() 로 문자열을 정수로 바꿔 계산할 수 있다',
          '안내 문구가 있는 입력으로 [프로그램 1] 간단 계산기를 완성할 수 있다',
          '(심화) f-문자열 서식으로 계산 결과의 자릿수를 다듬을 수 있다',
          '(심화) split() 으로 한 줄에 여러 값을 입력받을 수 있다',
          '(심화) 잘못된 입력을 걸러 다시 묻는 재입력 루프를 만들 수 있다'
        ],
        flow: [['도입: 고정된 값의 한계', 4], ['input() 과 문자열 문제 (Code02-02)', 10], ['int() 변환 (Code02-03)', 8], ['[프로그램 1] 완성 (Code02-04)', 8], ['한 걸음 더: 서식 · split · 입력 검증', 10], ['퀴즈 · 실습 · 프로젝트', 10]],
        content: [
          { type: 'h', text: '직접 입력한 숫자로 계산하기' },
          { type: 'p', html: '지금까지의 계산기는 100 과 50(또는 300 과 200)만 계산합니다. 다른 숫자를 계산하려면 매번 코드를 고쳐야 하죠. 이번에는 <b>실행할 때 키보드로 두 숫자를 입력</b>받아 계산하도록 바꿔 봅시다.' },
          { type: 'table', head: ['지금까지', '바꿀 내용'], rows: [
            ['변수 a 에 100 을 넣는다.', '변수 a 에 넣을 값을 <b>키보드로 입력받는다</b>.'],
            ['변수 b 에 50 을 넣는다.', '변수 b 에 넣을 값을 <b>키보드로 입력받는다</b>.']
          ] },
          { type: 'p', html: 'IDLE 에서는 <b>[File]-[New File]</b> 로 새 파일을 열고 <b>[File]-[Save]</b> 로 <code>Code02-02.py</code> 라는 이름으로 저장한 뒤 시작합니다. 이 강좌에서는 아래 예제를 편집기로 불러오면 됩니다.' },
          { type: 'figure', html: SVG_INPUT, caption: '그림 2-19 (다시 그림). 키보드로 입력한 값이 변수에 들어가기까지 — input() → 문자열 → int() → 정수' },
          { type: 'h', text: 'input() 함수를 사용해 값 입력' },
          { type: 'p', html: '<code>input()</code> 은 <b>키보드로 입력한 값을 받아 오는 함수</b>입니다. 프로그램은 <code>input()</code> 을 만나면 멈춰서 사용자가 무언가 입력하고 <kbd>Enter</kbd> 를 누를 때까지 기다립니다. Code02-01 의 1~2행을 <code>input()</code> 으로 바꿔 봅시다.' },
          { type: 'code', title: 'Code02-02.py — input() 으로 입력받기 (오류 발생)', code: `a = input()
b = input()
result = a + b
print(a, "+", b, "=", result)
result = a - b
print(a, "-", b, "=", result)
result = a * b
print(a, "*", b, "=", result)
result = a / b
print(a, "/", b, "=", result)`, stdin: '100\n50\n', expectError: true,
            expect: `100
50
100 + 50 = 10050
Traceback (most recent call last):
  File "main.py", line 5, in <module>
    result = a - b
             ~~^~~
TypeError: unsupported operand type(s) for -: 'str' and 'str'`,
            desc: '▶ 실행 후 콘솔의 입력칸에 <code>100</code> <kbd>Enter</kbd>, <code>50</code> <kbd>Enter</kbd> 를 입력하세요. (<b>예시 입력으로 실행</b> 버튼을 누르면 자동으로 입력됩니다) 더하기는 <b>10050</b> 이라는 엉뚱한 결과가, 빼기에서는 <b>오류</b>가 납니다.' },
          { type: 'p', html: '왜 이럴까요? <code>input()</code> 은 입력한 내용을 숫자가 아니라 <b>모두 문자열(글자)</b>로 취급하기 때문입니다. 즉 <code>a</code> 에는 숫자 100 이 아니라 글자 <code>"100"</code> 이, <code>b</code> 에는 글자 <code>"50"</code> 이 들어갑니다.' },
          { type: 'list', items: [
            '<b>글자 + 글자</b> → 두 글자를 <b>이어 붙입니다</b>: <code>"100" + "50"</code> → <code>"10050"</code>',
            '<b>글자 - 글자</b> → 글자에는 빼기가 없으므로 <code>TypeError: unsupported operand type(s) for -: \'str\' and \'str\'</code> 오류 (str 은 문자열을 뜻합니다)'
          ] },
          { type: 'code', repl: true, title: '추가 예제. 숫자와 문자열은 다르다 — type() 으로 확인', code: '100 + 50\n"100" + "50"\ntype(100)\ntype("100")',
            expect: ">>> 100 + 50\n150\n>>> \"100\" + \"50\"\n'10050'\n>>> type(100)\n<class 'int'>\n>>> type(\"100\")\n<class 'str'>\n>>>",
            desc: '<code>type()</code> 은 값의 종류(데이터형)를 알려 주는 함수입니다. <code>int</code> 는 정수(integer), <code>str</code> 은 문자열(string)입니다. 셸은 문자열 결과를 따옴표로 감싸서 보여 줍니다.' },
          { type: 'h', text: 'int() 함수로 정수로 변환' },
          { type: 'p', html: '글자를 숫자로 바꿔 주는 함수가 <code>int()</code> 입니다. 괄호 안에 문자열을 넣으면 정수로 바꿔 주고, 소수점이 있는 실수를 넣으면 소수점 아래를 버리고 정수로 만듭니다.' },
          { type: 'code', repl: true, title: 'int() 함수 사용 예', code: 'int("100")\nint(100.123)',
            expect: '>>> int("100")\n100\n>>> int(100.123)\n100\n>>>',
            desc: '<code>int("100")</code> → 결과는 정수 100, <code>int(100.123)</code> → 결과는 정수 100 (반올림이 아니라 <b>버림</b>).' },
          { type: 'p', html: '이제 Code02-02 의 1~2행을 <code>int(input())</code> 으로 바꿉니다. <b>안쪽 괄호부터</b> 실행되므로 <code>input()</code> 이 입력한 글자를 받아 오고, 그 결과를 <code>int()</code> 가 정수로 바꿔 변수에 넣습니다.' },
          { type: 'code', title: 'Code02-03.py — int() 로 변환해 계산', code: `a = int(input())
b = int(input())
result = a + b
print(a, "+", b, "=", result)
result = a - b
print(a, "-", b, "=", result)
result = a * b
print(a, "*", b, "=", result)
result = a / b
print(a, "/", b, "=", result)`, stdin: '100\n50\n',
            expect: `100
50
100 + 50 = 150
100 - 50 = 50
100 * 50 = 5000
100 / 50 = 2.0`,
            desc: '입력한 100 과 50 이 정수로 바뀌어 네 가지 계산이 모두 제대로 됩니다. 콘솔의 첫 두 줄은 <b>사용자가 입력한 값</b>입니다.' },
          { type: 'callout', kind: 'warn', title: 'int() 로 바꿀 수 없는 입력', html: '<code>int()</code> 는 <b>정수 모양의 글자</b>만 바꿀 수 있습니다. <code>"3.5"</code>, <code>"abc"</code>, <code>"백"</code> 을 넣으면 <code>ValueError: invalid literal for int() with base 10</code> 오류가 납니다. (<code>" 100 "</code> 처럼 앞뒤 공백은 괜찮습니다) 입력이 잘못되었을 때 프로그램이 멈추지 않게 하는 방법(예외 처리)은 나중에 배웁니다.' },
          { type: 'code', title: '추가 예제. 정수가 아닌 값을 입력하면', code: `a = int(input("정수를 입력하세요 : "))
print(a * 2)`, stdin: '3.5\n', expectError: true,
            expect: `정수를 입력하세요 : 3.5
Traceback (most recent call last):
  File "main.py", line 1, in <module>
    a = int(input("정수를 입력하세요 : "))
        ~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
ValueError: invalid literal for int() with base 10: '3.5'` },
          { type: 'callout', kind: 'more', title: '📘 소수점이 있는 수를 입력받으려면 float()', html: '<code>float()</code> 은 문자열을 <b>실수</b>로 바꿉니다. <code>float("3.5")</code> → 3.5, <code>float("100")</code> → 100.0. 소수점 있는 값을 계산하는 계산기라면 <code>int</code> 대신 <code>float</code> 을 쓰면 됩니다. 반대로 숫자를 문자열로 바꿀 때는 <code>str()</code> 을 씁니다.' },
          { type: 'code', title: '추가 예제. 실수 계산기 (float 사용)', code: `a = float(input("첫 번째 숫자 : "))
b = float(input("두 번째 숫자 : "))
print(a, "+", b, "=", a + b)
print(a, "/", b, "=", a / b)`, stdin: '2.5\n4\n',
            expect: `첫 번째 숫자 : 2.5
두 번째 숫자 : 4
2.5 + 4.0 = 6.5
2.5 / 4.0 = 0.625`,
            desc: '4 를 입력해도 float() 을 거치면 4.0 이 됩니다. <code>print()</code> 안에 <code>a + b</code> 처럼 계산식을 바로 써도 됩니다.' },
          { type: 'h', text: '계산기의 최종 버전 — [프로그램 1] 완성' },
          { type: 'p', html: 'Code02-03 은 잘 동작하지만, 실행하면 아무 설명 없이 커서만 깜빡여서 사용자는 무엇을 입력해야 할지 모릅니다. <code>input()</code> 의 괄호 안에 <b>안내 문구</b>를 넣으면 입력받기 전에 그 문구를 먼저 출력합니다.' },
          { type: 'code', title: '[프로그램 1] 완성: Code02-04.py 간단 계산기', code: CODE02_04, stdin: '300\n200\n', expect: CODE02_04_OUT,
            desc: '<code>1~2행</code>: 안내 문구를 보여 주고, 입력한 글자를 정수로 바꿔 a, b 에 넣습니다. 입력한 값은 안내 문구 바로 뒤에 표시됩니다. <code>3~10행</code>은 Code02-01 과 똑같습니다.' },
          { type: 'callout', kind: 'tip', title: '입력이 있는 예제 실행하기', html: '▶ 실행을 누르면 콘솔 아래 입력칸이 깜빡입니다. 숫자를 입력하고 <kbd>Enter</kbd> 를 누르세요. 여러 가지 숫자로 여러 번 실행해 보는 것이 좋습니다. 빠르게 확인하려면 <b>예시 입력으로 실행</b>을 누르세요. 안내 문구 끝에 <code>" : "</code> 처럼 빈칸을 넣어 두면 입력한 숫자가 문구에 붙지 않아 보기 좋습니다.' },
          { type: 'callout', kind: 'more', title: '📘 요즘 스타일로 쓴 계산기', html: '같은 계산기를 f-문자열로 쓰면 결과 변수 없이도 깔끔하게 만들 수 있습니다.<pre><code>a = int(input("첫 번째 숫자를 입력하세요 : "))\nb = int(input("두 번째 숫자를 입력하세요 : "))\nprint(f"{a} + {b} = {a + b}")\nprint(f"{a} - {b} = {a - b}")\nprint(f"{a} * {b} = {a * b}")\nprint(f"{a} / {b} = {a / b}")</code></pre>교재 방식(result 변수 재사용)과 결과는 같습니다. 어느 쪽이든 읽기 쉬운 방식을 고르면 됩니다.' },

          { type: 'h', text: '한 걸음 더 ① — 계산 결과를 보기 좋게 다듬기' },
          { type: 'p', html: '나누기 결과가 <code>1.6666666666666667</code> 처럼 길게 나오면 읽기 불편합니다. f-문자열의 서식 <code>:.2f</code> 를 쓰면 <b>소수점 둘째 자리까지 반올림</b>해서 보여 줄 수 있습니다. 화면에 보이는 모양만 바뀌고 변수에 든 값은 그대로라는 점이 중요합니다.' },
          { type: 'code', title: '추가 예제. f-문자열로 다듬은 계산기', code: `a = int(input("첫 번째 숫자를 입력하세요 : "))
b = int(input("두 번째 숫자를 입력하세요 : "))

print(f"{a} + {b} = {a + b}")
print(f"{a} - {b} = {a - b}")
print(f"{a} * {b} = {a * b}")
print(f"{a} / {b} = {a / b:.2f}")
print(f"{a} // {b} = {a // b} … 나머지 {a % b}")`, stdin: '7\n3\n',
            expect: `첫 번째 숫자를 입력하세요 : 7
두 번째 숫자를 입력하세요 : 3
7 + 3 = 10
7 - 3 = 4
7 * 3 = 21
7 / 3 = 2.33
7 // 3 = 2 … 나머지 1`,
            desc: '<code>{a / b:.2f}</code> 에서 콜론 앞은 <b>값</b>, 뒤는 <b>서식</b>입니다. 실제 값은 2.333… 그대로이고 출력만 2.33 으로 보입니다.' },

          { type: 'h', text: '한 걸음 더 ② — 두 수를 한 줄에 입력받기' },
          { type: 'p', html: '입력을 두 번 받는 대신 <code>10 20</code> 처럼 한 줄에 받고 싶을 때가 있습니다. 문자열의 <code>split()</code> 은 <b>빈칸을 기준으로 잘라 여러 조각으로 나눠</b> 줍니다.' },
          { type: 'code', title: '추가 예제. split() 으로 한 줄에 두 수 입력받기', code: `data = input("두 수를 빈칸으로 나누어 입력 : ")
first, second = data.split()

print("자른 결과 :", first, second)
print("아직은 글자 :", type(first))

a = int(first)
b = int(second)
print(f"{a} + {b} = {a + b}")`, stdin: '10 20\n',
            expect: `두 수를 빈칸으로 나누어 입력 : 10 20
자른 결과 : 10 20
아직은 글자 : <class 'str'>
10 + 20 = 30`,
            desc: '<code>first, second = data.split()</code> 처럼 왼쪽에 이름을 두 개 두면 잘린 두 조각이 순서대로 들어갑니다(언패킹). 잘린 조각도 여전히 <b>문자열</b>이므로 계산하려면 <code>int()</code> 가 필요합니다.' },
          { type: 'callout', kind: 'more', title: '📘 map() 으로 한 번에 정수로 바꾸기', html: '<code>a, b = map(int, input().split())</code> 한 줄이면 “입력 → 빈칸으로 자르기 → 각 조각을 int 로 변환 → a, b 에 나눠 담기”가 모두 끝납니다. 온라인 코딩 테스트 풀이에서 가장 많이 보이는 관용구입니다. <code>map()</code> 은 “모든 조각에 같은 함수를 적용하라”는 뜻으로, 7장 리스트를 배운 뒤 다시 만납니다. 지금은 <b>이런 짧은 표현이 있다</b> 정도만 기억해 두세요. 참고로 입력 개수가 안 맞으면 <code>ValueError: not enough values to unpack</code> 이 납니다.' },

          { type: 'h', text: '한 걸음 더 ③ — 잘못된 입력에 대비하기' },
          { type: 'p', html: '<code>int(input())</code> 은 사용자가 <b>정확히 정수를 입력한다</b>는 가정 위에 서 있습니다. 하지만 실제 사용자는 <code>abc</code> 를 넣기도 하고, 실수로 엔터만 누르기도 하고, <code>3.5</code> 를 넣기도 합니다. 그때마다 프로그램이 오류로 죽어 버린다면 좋은 프로그램이라고 할 수 없습니다. 방법은 두 가지입니다.' },
          { type: 'list', ordered: true, items: [
            '<b>미리 확인하기</b> — 입력받은 글자가 숫자 모양인지 <code>isdigit()</code> 으로 검사하고, 아니면 다시 물어봅니다.',
            '<b>일단 해 보고 실패하면 받아 내기</b> — <code>try ~ except</code> 로 오류를 붙잡습니다 (13장에서 자세히 배웁니다).'
          ] },
          { type: 'code', title: '추가 예제. 정수를 넣을 때까지 다시 물어보기 (재입력 루프)', code: `## 변수 선언 부분 ##
data = ""

## 메인 코드 부분 ##
while True :
    data = input("정수를 입력하세요 : ")
    if data.isdigit() :
        break
    print("  → 정수가 아닙니다. 다시 입력해 주세요.")

num = int(data)
print("입력한 수의 2배 :", num * 2)`, stdin: 'abc\n3.5\n21\n',
            expect: `정수를 입력하세요 : abc
  → 정수가 아닙니다. 다시 입력해 주세요.
정수를 입력하세요 : 3.5
  → 정수가 아닙니다. 다시 입력해 주세요.
정수를 입력하세요 : 21
입력한 수의 2배 : 42`,
            desc: '<code>while True :</code> 는 “계속 반복하라”, <code>break</code> 는 “반복을 빠져나가라”는 뜻입니다(6장). 올바른 값을 받을 때까지 묻고, 받으면 빠져나오는 이 모양은 <b>입력을 다루는 프로그램의 기본 형태</b>입니다. <code>"abc".isdigit()</code> 은 False, <code>"21".isdigit()</code> 은 True 를 돌려줍니다.' },
          { type: 'callout', kind: 'warn', title: 'isdigit() 이 놓치는 것', html: '<code>"-5".isdigit()</code> 은 <b>False</b> 입니다(빼기 기호 때문). <code>"3.5"</code>, <code>""</code>(그냥 엔터)도 False 입니다. 즉 isdigit() 은 “0 이상의 정수 글자”만 True 입니다. 음수나 소수까지 받아야 한다면 아래의 <code>try ~ except</code> 가 더 알맞습니다.' },
          { type: 'callout', kind: 'more', title: '📘 try ~ except 로 더 단단하게 만들기', html: '<code>try :</code> 블록을 실행하다가 오류(예외)가 나면 프로그램이 죽는 대신 <code>except :</code> 블록으로 넘어갑니다. <code>int()</code> 가 실패할 때 나는 오류 이름이 <code>ValueError</code> 이므로 그것만 콕 집어 잡아냅니다. 음수 · 실수까지 자연스럽게 처리되는 것이 장점입니다. 자세한 내용은 13장에서 배웁니다.' },
          { type: 'code', title: '추가 예제. try ~ except 로 받아 내기', code: `## 변수 선언 부분 ##
num = 0

## 메인 코드 부분 ##
while True :
    try :
        num = int(input("정수를 입력하세요 : "))
        break
    except ValueError :
        print("  → 정수만 입력할 수 있습니다.")

print("입력한 수의 제곱 :", num ** 2)`, stdin: 'abc\n\n-7\n',
            expect: `정수를 입력하세요 : abc
  → 정수만 입력할 수 있습니다.
정수를 입력하세요 :
  → 정수만 입력할 수 있습니다.
정수를 입력하세요 : -7
입력한 수의 제곱 : 49`,
            desc: '<code>-7</code> 처럼 음수도 그대로 받아들입니다. 빈 입력(엔터만)도 안전하게 걸러집니다.' },
          { type: 'callout', kind: 'more', title: '📘 0 으로 나누기를 미리 막기', html: '계산기에 두 번째 숫자로 0 을 넣으면 <code>ZeroDivisionError</code> 로 멈춥니다. 나누기 전에 <code>if b != 0 :</code> 로 확인하고, 0 이면 “0 으로는 나눌 수 없습니다”라고 안내하면 프로그램이 죽지 않습니다. 조건문 <code>if</code> 는 5장에서 배우지만, <b>“위험한 계산 앞에는 확인 한 줄”</b> 이라는 감각은 지금부터 가져도 좋습니다. 이런 준비를 <b>방어적 프로그래밍(defensive programming)</b> 이라고 부릅니다.' },
          { type: 'code', title: '추가 예제. 0 으로 나누기를 피하는 계산기', code: `a = int(input("첫 번째 숫자를 입력하세요 : "))
b = int(input("두 번째 숫자를 입력하세요 : "))

print(f"{a} + {b} = {a + b}")
print(f"{a} - {b} = {a - b}")
print(f"{a} * {b} = {a * b}")

if b != 0 :
    print(f"{a} / {b} = {a / b:.2f}")
else :
    print("0 으로는 나눌 수 없습니다.")`, stdin: '10\n0\n',
            expect: `첫 번째 숫자를 입력하세요 : 10
두 번째 숫자를 입력하세요 : 0
10 + 0 = 10
10 - 0 = 10
10 * 0 = 0
0 으로는 나눌 수 없습니다.`,
            desc: '<code>!=</code> 는 “같지 않다”는 뜻입니다. 예시 입력을 <code>10</code>, <code>4</code> 로 바꿔 다시 실행해 보세요.' }
        ],
        practice: [
          {
            title: '실습 2-11. 나이 계산기',
            level: 1,
            desc: '<p>태어난 해를 입력받아 올해(2026년) 나이를 출력하세요. (올해 연도는 변수 <code>thisYear = 2026</code> 으로 준비합니다)</p><pre>태어난 해를 입력하세요 : 2010\n2026 년에 16 살입니다.</pre>',
            hint: '<code>int(input("…"))</code> 로 입력받고, <code>thisYear - 태어난해</code> 를 계산합니다.',
            starter: `thisYear = 2026
# TODO: 태어난 해를 정수로 입력받아 birth 에 저장

# TODO: 나이를 계산해 출력
`,
            solution: `thisYear = 2026
birth = int(input("태어난 해를 입력하세요 : "))
age = thisYear - birth
print(thisYear, "년에", age, "살입니다.")
`,
            stdin: '2010\n',
            expect: `태어난 해를 입력하세요 : 2010
2026 년에 16 살입니다.`
          },
          {
            title: '실습 2-12. 원의 넓이와 둘레',
            level: 1,
            desc: '<p>반지름을 <b>실수</b>로 입력받아 원의 넓이와 둘레를 <b>소수점 둘째 자리까지</b> 출력하세요. 원주율은 대문자 상수 <code>PI = 3.14159</code> 로 준비합니다.</p><pre>반지름 : 7.5\n넓이 : 176.71\n둘레 : 47.12</pre>',
            hint: '넓이 = PI × 반지름 × 반지름, 둘레 = 2 × PI × 반지름. 출력은 <code>print(f"넓이 : {area:.2f}")</code> 처럼 f-문자열의 <code>:.2f</code> 를 씁니다.',
            starter: `PI = 3.14159
# TODO: 반지름을 실수로 입력받기
r = 0.0
# TODO: 넓이(area) 와 둘레(around) 를 계산해 소수점 둘째 자리까지 출력
`,
            solution: `PI = 3.14159
r = float(input("반지름 : "))
area = PI * r * r
around = 2 * PI * r
print(f"넓이 : {area:.2f}")
print(f"둘레 : {around:.2f}")
`,
            stdin: '7.5\n',
            expect: `반지름 : 7.5
넓이 : 176.71
둘레 : 47.12`
          },
          {
            title: '실습 2-13. 세 과목 합계와 평균',
            level: 2,
            desc: '<p>국어 · 영어 · 수학 점수를 입력받아 합계와 평균을 출력하세요.</p><pre>국어 점수 : 90\n영어 점수 : 85\n수학 점수 : 77\n합계 : 252\n평균 : 84.0</pre>',
            hint: '세 번 입력받아 정수로 바꾸고, 평균 = 합계 / 3 입니다. <code>/</code> 의 결과는 실수입니다.',
            starter: `# TODO: 세 과목 점수를 정수로 입력받기
kor = 0
eng = 0
math = 0
# TODO: 합계와 평균 계산 후 출력
`,
            solution: `kor = int(input("국어 점수 : "))
eng = int(input("영어 점수 : "))
math = int(input("수학 점수 : "))
total = kor + eng + math
avg = total / 3
print("합계 :", total)
print("평균 :", avg)
`,
            stdin: '90\n85\n77\n',
            expect: `국어 점수 : 90
영어 점수 : 85
수학 점수 : 77
합계 : 252
평균 : 84.0`
          },
          {
            title: '실습 2-14. 섭씨 → 화씨 변환기',
            level: 2,
            desc: '<p>섭씨 온도를 <b>실수</b>로 입력받아 화씨 온도로 바꿔 출력하세요. 공식: 화씨 = 섭씨 × 9 / 5 + 32</p><pre>섭씨 온도 : 36.5\n섭씨 36.5 도는 화씨 97.7 도</pre>',
            hint: '소수점이 있는 값을 입력받으므로 <code>int()</code> 가 아니라 <code>float()</code> 을 씁니다.',
            starter: `# TODO: 섭씨 온도를 실수로 입력받기
c = 0.0
# TODO: 화씨로 바꿔 출력
`,
            solution: `c = float(input("섭씨 온도 : "))
f = c * 9 / 5 + 32
print("섭씨", c, "도는 화씨", f, "도")
`,
            stdin: '36.5\n',
            expect: `섭씨 온도 : 36.5
섭씨 36.5 도는 화씨 97.7 도`
          },
          {
            title: '실습 2-15. 올바른 값을 넣을 때까지 다시 묻기',
            level: 2,
            desc: '<p>태어난 해를 입력받아 나이를 알려 주는 프로그램을 만들되, <b>정수가 아닌 값을 입력하면 다시 묻도록</b> 하세요.</p><pre>태어난 해 : 이천년\n  → 정수 네 자리로 입력해 주세요.\n태어난 해 : 20o5\n  → 정수 네 자리로 입력해 주세요.\n태어난 해 : 2005\n2026 년에 21 살입니다.</pre>',
            hint: '<code>while True :</code> 안에서 <code>input()</code> 으로 받고, <code>isdigit()</code> 이 True 이면 <code>break</code> 로 빠져나옵니다. 아니면 안내 문구를 출력하고 다시 반복합니다.',
            starter: `THIS_YEAR = 2026
data = ""

while True :
    data = input("태어난 해 : ")
    # TODO: 정수 모양이면 break, 아니면 안내 문구 출력
    break

# TODO: 나이를 계산해 출력
`,
            solution: `THIS_YEAR = 2026
data = ""

while True :
    data = input("태어난 해 : ")
    if data.isdigit() :
        break
    print("  → 정수 네 자리로 입력해 주세요.")

birth = int(data)
age = THIS_YEAR - birth
print(THIS_YEAR, "년에", age, "살입니다.")
`,
            stdin: '이천년\n20o5\n2005\n',
            expect: `태어난 해 : 이천년
  → 정수 네 자리로 입력해 주세요.
태어난 해 : 20o5
  → 정수 네 자리로 입력해 주세요.
태어난 해 : 2005
2026 년에 21 살입니다.`
          },
          {
            title: '🚀 프로젝트 2-2. 단위 변환기',
            level: 3,
            desc: '<p>메뉴를 골라 단위를 바꿔 주는 <b>단위 변환기</b>를 만드세요.</p><p><b>요구 사항</b></p><ol><li>실행하면 메뉴를 보여 준다: <code>1) cm → inch   2) kg → lb   3) °C → °F</code></li><li>번호를 입력받는다 (문자열 그대로 비교하면 <code>int()</code> 변환 오류를 피할 수 있다)</li><li>고른 번호에 맞는 값을 <b>실수</b>로 입력받아 변환하고, <b>소수점 둘째 자리까지</b> 출력한다</li><li>변환에 쓰는 값은 상수로 둔다: <code>CM_PER_INCH = 2.54</code>, <code>LB_PER_KG = 2.20462</code></li><li>1 ~ 3 이 아닌 번호를 입력하면 <code>1 ~ 3 중에서 고르세요.</code> 라고 안내하고 끝낸다</li></ol><p>예시 실행 장면</p><pre>1) cm → inch   2) kg → lb   3) °C → °F\n번호를 고르세요 : 2\n무게(kg) : 70\n70.0kg = 154.32lb</pre><p><b>더 해 보기</b> — ① 변환이 끝난 뒤 “계속할까요?”를 물어 반복하도록 <code>while</code> 을 붙여 보세요. ② 반대 방향 변환(inch → cm)도 메뉴에 넣어 보세요. ③ 02-4 교시를 배운 뒤 각 변환을 <b>함수</b>로 분리해 보세요.</p>',
            hint: '여러 갈래로 나뉘는 처리는 <code>if 조건 :</code> / <code>elif 조건 :</code> / <code>else :</code> 로 씁니다(5장에서 자세히 배웁니다). 입력한 번호는 문자열이므로 <code>if menu == "1" :</code> 처럼 따옴표를 붙여 비교하세요.',
            starter: `CM_PER_INCH = 2.54
LB_PER_KG = 2.20462

print("1) cm → inch   2) kg → lb   3) °C → °F")
menu = input("번호를 고르세요 : ")

if menu == "1" :
    cm = float(input("길이(cm) : "))
    # TODO: inch 로 바꿔 출력
elif menu == "2" :
    # TODO: kg 을 입력받아 lb 로 바꿔 출력
    pass
elif menu == "3" :
    # TODO: 섭씨를 입력받아 화씨로 바꿔 출력
    pass
else :
    print("1 ~ 3 중에서 고르세요.")
`,
            solution: `CM_PER_INCH = 2.54
LB_PER_KG = 2.20462

print("1) cm → inch   2) kg → lb   3) °C → °F")
menu = input("번호를 고르세요 : ")

if menu == "1" :
    cm = float(input("길이(cm) : "))
    print(f"{cm}cm = {cm / CM_PER_INCH:.2f}inch")
elif menu == "2" :
    kg = float(input("무게(kg) : "))
    print(f"{kg}kg = {kg * LB_PER_KG:.2f}lb")
elif menu == "3" :
    c = float(input("온도(°C) : "))
    print(f"{c}°C = {c * 9 / 5 + 32:.2f}°F")
else :
    print("1 ~ 3 중에서 고르세요.")
`,
            stdin: '2\n70\n',
            expect: `1) cm → inch   2) kg → lb   3) °C → °F
번호를 고르세요 : 2
무게(kg) : 70
70.0kg = 154.32lb`
          }
        ],
        quiz: [
          { q: '<code>a = input()</code> 에서 키보드로 <code>100</code> 을 입력했을 때 a 에 들어가는 값은?', options: ['정수 100', '실수 100.0', '문자열 "100"', '아무것도 들어가지 않는다'], answer: 2, explain: 'input() 은 입력한 내용을 항상 문자열로 돌려줍니다.' },
          { q: '다음 코드에서 100 과 50 을 입력했을 때 출력은?<pre><code>a = input()\nb = input()\nprint(a + b)</code></pre>', options: ['150', '10050', '100 50', '오류'], answer: 1, explain: '문자열끼리 + 하면 이어 붙이므로 "10050" 이 됩니다.' },
          { q: '<code>int(100.123)</code> 의 결과는?', options: ['100', '100.1', '101', '오류'], answer: 0, explain: 'int() 는 실수의 소수점 아래를 버리고 정수로 만듭니다.' },
          { q: '<code>a = int(input("숫자 : "))</code> 가 실행되는 순서로 알맞은 것은?', options: ['int() → input() → a 에 대입', 'input() → int() → a 에 대입', 'a 에 대입 → input() → int()', '동시에 실행된다'], answer: 1, explain: '안쪽 괄호부터: input() 이 글자를 받고 → int() 가 정수로 바꾸고 → a 에 대입합니다.' },
          { q: '<code>int("3.5")</code> 를 실행하면?', options: ['3', '4', '3.5', 'ValueError 오류'], answer: 3, explain: 'int() 는 정수 모양의 문자열만 바꿀 수 있습니다. "3.5" 는 float() 으로 바꿔야 합니다.' },
          { q: '다음 코드의 출력은?<pre><code>data = "10 20"\na, b = data.split()\nprint(a + b)</code></pre>', options: ['30', '1020', '10 20', '오류'], answer: 1, explain: '<code>split()</code> 으로 자른 조각도 <b>문자열</b>이므로 <code>+</code> 는 이어 붙이기가 됩니다. 계산하려면 <code>int(a) + int(b)</code> 로 바꿔야 합니다.' }
        ],
        slides: [
          { layout: 'title', title: '계산기 프로그램 확장 — input() 과 int()', subtitle: 'Chapter 02 · Section 04', badge: '02-3',
            notes: '<p><b>[도입 2분]</b> “지난 시간 계산기는 숫자를 바꾸려면 코드를 고쳐야 했죠. 계산기 앱이 그렇다면 쓸 수 있을까요?” → 실행할 때 입력받도록 바꿉니다.</p>' },
          { layout: 'diagram', title: '변수에 키보드로 직접 값을 입력', html: SVG_INPUT, caption: 'input() 이 받은 값은 문자열 → int() 로 정수로 바꿔 변수에 대입',
            notes: '<p><b>[3분]</b> 그림 2-19. 이 그림은 교시 전체의 요약입니다. 처음에는 input() 부분만 설명하고, int() 는 오류를 경험한 뒤에 다시 이 그림으로 돌아와 설명하면 효과적입니다.</p>' },
          { layout: 'code', title: 'Code02-02.py — input() 으로 바꾸기', code: 'a = input()\nb = input()\nresult = a + b\nprint(a, "+", b, "=", result)\nresult = a - b\nprint(a, "-", b, "=", result)\nresult = a * b\nprint(a, "*", b, "=", result)\nresult = a / b\nprint(a, "/", b, "=", result)', stdin: '100\n50\n', expectError: true,
            points: ['100, 50 을 입력하면?', '더하기: <b>10050</b> (?)', '빼기: <b>TypeError</b>', 'input() 은 모두 <b>문자열</b>로 받음'],
            notes: '<p><b>[5분]</b> 실행 전에 “150 이 나올까요?” 물어보고 실행합니다. 결과가 10050 인 것을 보고 학생들이 웃으면 성공입니다.</p><p>“글자 + 글자 = 이어 붙이기, 글자 - 글자 = 할 수 없음” 을 칠판에 적으세요. str 은 string(문자열)의 줄임말입니다.</p>' },
          { layout: 'code', repl: true, title: '숫자와 문자열은 다르다', code: '100 + 50\n"100" + "50"\ntype(100)\ntype("100")',
            points: ['따옴표가 있으면 <b>문자열</b>', '<code>type()</code> 으로 종류 확인', 'int = 정수, str = 문자열'],
            notes: '<p><b>[3분]</b> 셸에서 직접 확인합니다. 데이터형은 3장에서 자세히 배운다고 예고만 하세요.</p>' },
          { layout: 'code', repl: true, title: 'int() 함수로 정수로 변환', code: 'int("100")\nint(100.123)\nint("100") + int("50")',
            points: ['<code>int("100")</code> → 정수 100', '<code>int(100.123)</code> → 100 (버림)', '바꾼 뒤에는 숫자 계산 가능'],
            notes: '<p><b>[3분]</b> 버림(반올림 아님)을 짚어 줍니다. <code>int("3.5")</code> 는 오류(ValueError)라는 점도 셸에서 보여 줄 수 있습니다.</p>' },
          { layout: 'code', title: 'Code02-03.py — int(input())', code: 'a = int(input())\nb = int(input())\nresult = a + b\nprint(a, "+", b, "=", result)\nresult = a - b\nprint(a, "-", b, "=", result)\nresult = a * b\nprint(a, "*", b, "=", result)\nresult = a / b\nprint(a, "/", b, "=", result)', stdin: '100\n50\n',
            points: ['<b>안쪽 괄호부터</b> 실행', 'input() → 글자, int() → 정수', '이제 계산이 올바르게 됨'],
            notes: '<p><b>[4분]</b> 괄호가 겹친 함수 호출을 처음 봅니다. “양파 껍질처럼 안쪽부터 벗긴다”고 설명하세요.</p><p>불편한 점을 물어봅니다: “실행하면 무엇을 입력해야 하는지 알 수 있나요?” → 안내 문구의 필요성.</p>' },
          { layout: 'code', title: '[프로그램 1] 완성: Code02-04.py', code: CODE02_04, stdin: '300\n200\n',
            points: ['input("안내 문구") — 문구를 먼저 출력', '문구 끝에 <code>" : "</code> 로 빈칸', '<b>[프로그램 1] 간단 계산기 완성!</b>'],
            notes: '<p><b>[5분]</b> 학생들이 자신의 숫자로 여러 번 실행해 보게 하세요. 0 을 두 번째 숫자로 넣으면? → ZeroDivisionError (지난 교시 내용 복습).</p><p>음수, 큰 수도 넣어 보게 하면 흥미를 끌 수 있습니다.</p>' },
          { layout: 'two', title: 'int() 와 float()',
            left: { title: 'int() — 정수로', bullets: ['<code>int("100")</code> → 100', '<code>int(100.9)</code> → 100', '<code>int("3.5")</code> → <b>오류</b>'] },
            right: { title: 'float() — 실수로', bullets: ['<code>float("3.5")</code> → 3.5', '<code>float("100")</code> → 100.0', '소수점 계산기에 사용'] },
            notes: '<p><b>[2분]</b> 강의자료 밖의 보충입니다. 실습 2-12(원의 넓이) · 2-14(섭씨 → 화씨)에서 float() 을 사용합니다.</p>' },
          { layout: 'code', title: '한 걸음 더 ① — f-문자열로 다듬기', code: 'a = int(input("첫 번째 숫자를 입력하세요 : "))\nb = int(input("두 번째 숫자를 입력하세요 : "))\n\nprint(f"{a} + {b} = {a + b}")\nprint(f"{a} - {b} = {a - b}")\nprint(f"{a} * {b} = {a * b}")\nprint(f"{a} / {b} = {a / b:.2f}")\nprint(f"{a} // {b} = {a // b} … 나머지 {a % b}")', stdin: '7\n3\n',
            points: ['<code>{a / b:.2f}</code> — 소수 둘째 자리까지', '콜론 앞은 <b>값</b>, 뒤는 <b>서식</b>', '값 자체는 그대로, <b>보이는 모양만</b> 바뀜', 'result 변수 없이도 깔끔'],
            notes: '<p><b>[4분]</b> 7 / 3 = 2.3333333333333335 를 먼저 보여 준 뒤 <code>:.2f</code> 를 붙여 비교하면 효과가 큽니다.</p><p>주의: 반올림해서 <b>보여 줄</b> 뿐 변수의 값은 그대로입니다. 값 자체를 바꾸려면 <code>round()</code> 를 씁니다.</p>' },
          { layout: 'code', title: '한 걸음 더 ② — 한 줄에 두 수 입력받기', code: 'data = input("두 수를 빈칸으로 나누어 입력 : ")\nfirst, second = data.split()\n\nprint("자른 결과 :", first, second)\nprint("아직은 글자 :", type(first))\n\na = int(first)\nb = int(second)\nprint(f"{a} + {b} = {a + b}")', stdin: '10 20\n',
            points: ['<code>split()</code> — 빈칸으로 잘라 나눔', '왼쪽에 이름 두 개 = 언패킹', '잘린 조각도 여전히 <b>문자열</b>', '짧게: <code>a, b = map(int, input().split())</code>'],
            notes: '<p><b>[4분]</b> 입력을 두 번 받는 것과 한 줄에 받는 것 중 어느 쪽이 편한지 물어보세요. 코딩 테스트에서는 한 줄 입력이 표준입니다.</p><p>map() 은 7장 이후에 다시 나오므로 “이런 짧은 표현이 있다” 정도로만 소개합니다. 개수가 안 맞으면 ValueError(not enough values to unpack).</p>' },
          { layout: 'code', title: '한 걸음 더 ③ — 올바른 값을 받을 때까지', code: 'data = ""\n\nwhile True :\n    data = input("정수를 입력하세요 : ")\n    if data.isdigit() :\n        break\n    print("  → 정수가 아닙니다. 다시 입력해 주세요.")\n\nnum = int(data)\nprint("입력한 수의 2배 :", num * 2)', stdin: 'abc\n3.5\n21\n',
            points: ['<code>while True</code> + <code>break</code> = 재입력 루프', '<code>isdigit()</code> 으로 숫자 모양인지 확인', '음수 · 소수는 <code>try ~ except</code> 로 (13장)', '실제 프로그램의 기본 형태'],
            notes: '<p><b>[5분]</b> “사용자는 반드시 이상한 값을 넣는다”는 말을 강조하세요. 프로그램을 죽지 않게 만드는 것이 곧 실력입니다.</p><p>while · break · if 는 각각 6장 · 5장에서 배우므로 여기서는 <b>모양만</b> 익히게 합니다. <code>"-5".isdigit()</code> 이 False 라는 점, 그래서 try ~ except 가 더 넓게 쓰인다는 점을 덧붙이세요.</p>' },
          { layout: 'quiz', title: '확인 문제', q: '100 과 50 을 입력했을 때 출력은?<pre><code>a = input()\nb = input()\nprint(a + b)</code></pre>', options: ['150', '10050', '100 50', '오류'], answer: 1, explain: 'input() 은 문자열을 돌려주므로 + 는 이어 붙이기가 됩니다.',
            notes: '<p><b>[2분]</b> 정답 공개 후 “150 이 나오게 하려면 어디를 고쳐야 할까요?” → <code>int(input())</code>.</p>' },
          { layout: 'practice', title: '실습 2-13. 세 과목 합계와 평균', desc: '<p>국어 · 영어 · 수학 점수를 입력받아 합계와 평균을 출력하세요.</p><pre>국어 점수 : 90\n영어 점수 : 85\n수학 점수 : 77\n합계 : 252\n평균 : 84.0</pre>',
            starter: 'kor = 0\neng = 0\nmath = 0\n# TODO: 입력받아 합계와 평균 출력\n',
            solution: 'kor = int(input("국어 점수 : "))\neng = int(input("영어 점수 : "))\nmath = int(input("수학 점수 : "))\ntotal = kor + eng + math\navg = total / 3\nprint("합계 :", total)\nprint("평균 :", avg)\n', stdin: '90\n85\n77\n',
            notes: '<p><b>[10분]</b> 쉬운 실습 2-11(나이 계산기) · 2-12(원의 넓이)부터 시작해도 좋습니다. 빠른 학생은 2-14(float) → 2-15(재입력 루프) → 🚀 프로젝트 2-2.</p><p>순회 포인트: int() 를 빼먹어 합계가 “908577”이 되는 학생 → 오늘 배운 내용을 스스로 발견하는 좋은 기회입니다.</p>' },
          { layout: 'practice', title: '🚀 프로젝트 2-2. 단위 변환기', desc: '<p>메뉴 번호를 골라 단위를 바꿔 주는 변환기를 만드세요.</p><ul><li>1) cm → inch &nbsp; 2) kg → lb &nbsp; 3) °C → °F</li><li>값은 <b>실수</b>로 입력받고 결과는 소수점 둘째 자리까지</li><li>변환 값은 상수로 (<code>CM_PER_INCH = 2.54</code> …)</li><li>1 ~ 3 이 아니면 안내 문구</li></ul>',
            starter: 'CM_PER_INCH = 2.54\nLB_PER_KG = 2.20462\n\nprint("1) cm → inch   2) kg → lb   3) °C → °F")\nmenu = input("번호를 고르세요 : ")\n\nif menu == "1" :\n    cm = float(input("길이(cm) : "))\n    # TODO: inch 로 바꿔 출력\nelse :\n    print("1 ~ 3 중에서 고르세요.")\n',
            solution: 'CM_PER_INCH = 2.54\nLB_PER_KG = 2.20462\n\nprint("1) cm → inch   2) kg → lb   3) °C → °F")\nmenu = input("번호를 고르세요 : ")\n\nif menu == "1" :\n    cm = float(input("길이(cm) : "))\n    print(f"{cm}cm = {cm / CM_PER_INCH:.2f}inch")\nelif menu == "2" :\n    kg = float(input("무게(kg) : "))\n    print(f"{kg}kg = {kg * LB_PER_KG:.2f}lb")\nelif menu == "3" :\n    c = float(input("온도(°C) : "))\n    print(f"{c}°C = {c * 9 / 5 + 32:.2f}°F")\nelse :\n    print("1 ~ 3 중에서 고르세요.")\n', stdin: '2\n70\n',
            notes: '<p><b>[12분 · 남는 시간은 과제]</b> 이 장 첫 번째 미니 프로젝트입니다. <code>if ~ elif ~ else</code> 는 5장 내용이지만 <b>모양을 보고 따라 쓰는</b> 것만으로 충분합니다.</p><p>지도 포인트: ① 메뉴 번호를 <code>int()</code> 로 바꾸지 않고 문자열로 비교하면 잘못된 입력에도 죽지 않습니다. ② 2.54 같은 숫자를 코드 안에 흩뿌리지 말고 상수로.</p><p>확장 아이디어(while 로 반복, 반대 방향 변환, 함수로 분리)를 칠판에 적어 두고 원하는 학생이 이어 가게 하세요.</p>' },
          { layout: 'summary', title: '정리', bullets: ['<code>input()</code> — 키보드 입력을 받아 옴 (항상 <b>문자열</b>)', '문자열 + 문자열 = 이어 붙이기, 빼기는 오류', '<code>int()</code> — 정수로 변환, <code>float()</code> — 실수로 변환', '<code>int(input("안내 문구"))</code> — 안쪽부터 실행', '<b>[프로그램 1] 간단 계산기 완성</b>'],
            notes: '<p><b>[1분]</b> 다음 교시: 긴 프로그램을 구조적으로 짜는 방법과 거북이 그래픽.</p>' }
        ]
      },

      /* ===================== ch02-4 ===================== */
      {
        id: 'ch02-4',
        title: '긴 프로그램의 구조 — 주석 · 함수 · 전역 변수',
        minutes: 50,
        goals: [
          '긴 프로그램을 함수 선언 · 변수 선언 · 메인 코드 세 부분으로 나누는 이유를 설명할 수 있다',
          '# 주석, 작은따옴표 3개 여러 줄 주석, \\ 줄 이어 쓰기를 사용할 수 있다',
          'def 로 함수를 만들고 global 로 전역 변수를 바꿀 수 있다',
          '거북이로 정사각형을 그리는 프로그램을 세 부분 구조로 바꿀 수 있다',
          '(심화) 프로그램을 입력 · 계산 · 출력 함수로 나누고 return 으로 값을 주고받을 수 있다',
          '(심화) docstring 으로 함수 설명을 남기고 좋은 주석을 구분할 수 있다',
          '(심화) 터틀 좌표계 · 창 크기를 이해하고 도형을 그리는 함수를 만들어 재사용할 수 있다'
        ],
        flow: [['도입: 긴 프로그램의 틀', 4], ['주석과 줄 이어 쓰기', 6], ['함수 선언 · 변수 선언 · 메인', 12], ['터틀 정사각형 Code02-05 → 02-06', 8], ['한 걸음 더: 함수로 나누기 · 좌표 · 재사용', 10], ['퀴즈 · 실습', 10]],
        content: [
          { type: 'h', text: '긴 프로그램은 세 부분으로' },
          { type: 'p', html: '이제 두 번째 프로그램인 <b>터틀 그래픽 그림판</b>을 만듭니다. 계산기보다 길고 복잡하므로 먼저 <b>프로그램의 틀</b>을 잡고 시작하겠습니다. 이 책은 긴 프로그램을 다음 세 부분으로 나누어 작성합니다.' },
          { type: 'code', title: '프로그램의 기본 틀', code: `## 함수 선언 부분 ##

## 변수 선언 부분 ##

## 메인(main) 코드 부분 ##`,
            desc: '<code>#</code> 로 시작하는 줄은 모두 주석이라 실행해도 아무 일도 일어나지 않습니다. 이 “빈 틀”에 코드를 채워 가며 프로그램을 완성합니다.' },
          { type: 'figure', html: SVG_STRUCTURE, caption: '긴 프로그램의 세 부분 — 이 교시와 다음 교시에서 완성할 Code02-07 의 뼈대' },
          { type: 'h', text: '주석(comment)과 줄 이어 쓰기' },
          { type: 'p', html: '<code>#</code> 기호 뒤의 내용은 <b>주석(Remark, comment)</b>입니다. 파이썬은 주석을 무시하고 실행하지 않으므로, 코드에 대한 설명이나 메모를 적어 두는 데 씁니다. 교재에서 <code>## … ##</code> 처럼 # 을 두 개씩 쓴 것은 눈에 잘 띄게 하려는 것일 뿐, <code>#</code> 하나만 있어도 주석입니다.' },
          { type: 'list', items: [
            '<b>한 줄 주석</b>: <code>#</code> 부터 그 줄 끝까지. 코드 뒤에 붙여 쓸 수도 있습니다: <code>a = 100  # a 에 100 대입</code>',
            '<b>여러 줄 주석</b>: 작은따옴표 3개 <code>\'\'\'</code> (또는 큰따옴표 3개 <code>"""</code>) 로 감쌉니다.',
            '<b>줄 이어 쓰기</b>: 한 줄이 너무 길 때 줄 끝에 <code>\\</code> (역슬래시, 한글 키보드에서는 <code>₩</code>)를 붙이면 다음 줄까지 <b>한 줄로</b> 인식합니다.'
          ] },
          { type: 'code', title: '여러 줄 주석', code: `'''
여러 줄 주석
입니다.
'''
print("주석은 실행되지 않습니다.")`, expect: '주석은 실행되지 않습니다.' },
          { type: 'code', title: '\\ 로 긴 줄 이어 쓰기', code: `data = '안녕' + \\
       '하세요? ' + \\
       '파이썬!'
print(data)`, expect: '안녕하세요? 파이썬!',
            desc: '세 줄로 나누어 썼지만 파이썬은 <code>data = \'안녕\' + \'하세요? \' + \'파이썬!\'</code> 한 줄로 봅니다. 문자열끼리 <code>+</code> 하면 이어 붙는다는 것은 앞 교시에서 확인했죠.' },
          { type: 'callout', kind: 'more', title: '📘 주석 더 알아보기', html: '<ul><li><code>\'\'\'…\'\'\'</code> 는 정확히는 “여러 줄 문자열”인데, 어디에도 쓰지 않으니 결과적으로 주석처럼 동작하는 것입니다.</li><li>이 강좌의 편집기에서 여러 줄을 선택하고 <kbd>Ctrl</kbd>+<kbd>/</kbd> 를 누르면 줄 앞에 <code>#</code> 을 한꺼번에 붙이거나 뗄 수 있습니다. 코드 일부를 잠시 실행하지 않게 할 때 편리합니다(IDLE 은 <kbd>Alt</kbd>+<kbd>3</kbd>).</li><li>괄호 <code>( )</code> 안에서는 <code>\\</code> 없이도 줄을 바꿀 수 있어서, 요즘은 <code>data = (\'안녕\' + \'하세요? \' + \'파이썬!\')</code> 처럼 괄호로 감싸는 방법을 더 많이 씁니다.</li><li>좋은 주석은 “무엇을”보다 <b>“왜”</b>를 설명합니다.</li></ul>' },
          { type: 'h', text: '① 함수 선언 부분' },
          { type: 'p', html: '프로그램에서 사용할 <b>함수들을 미리 만들어 두는</b> 곳입니다. <code>print()</code>, <code>input()</code> 처럼 파이썬이 제공하는 함수뿐 아니라, <code>def</code> 로 우리만의 함수를 만들 수 있습니다. 함수를 만드는 형식은 다음과 같습니다.' },
          { type: 'p', html: '<pre><code>def 함수명(매개변수) :\n    global 사용할_전역_변수\n    # 이 부분에 함수 내용을 코딩</code></pre>' },
          { type: 'list', items: [
            '<code>def</code> 는 define(정의하다)의 줄임말입니다. 끝에 <b>콜론(:)</b>을 꼭 붙입니다.',
            '<b>매개변수(parameter)</b>: 함수를 호출할 때 넘겨받는 값을 담는 변수입니다. 없으면 빈 괄호 <code>()</code>.',
            '함수 내용은 모두 <b>같은 칸만큼 들여쓰기</b>(보통 스페이스 4칸)합니다. 들여쓴 부분까지가 함수입니다.',
            '<code>global</code>: 함수 안에서 <b>함수 밖의 변수(전역 변수)를 바꾸겠다</b>고 알리는 선언입니다.',
            '함수는 만들어 두기만 해서는 실행되지 않습니다. <code>함수명(값)</code> 으로 <b>호출</b>해야 실행됩니다.'
          ] },
          { type: 'code', title: '추가 예제. 세 부분 구조로 만든 점수 계산 프로그램', code: `## 함수 선언 부분 ##
def addScore(point) :
    global score
    score = score + point
    print(point, "점 획득!")

## 변수 선언 부분 ##
score = 0

## 메인(main) 코드 부분 ##
addScore(10)
addScore(5)
addScore(20)
print("최종 점수 :", score)`,
            expect: `10 점 획득!
5 점 획득!
20 점 획득!
최종 점수 : 35`,
            desc: '실행은 위에서 아래로 진행되지만 <code>2~5행</code>의 함수는 <b>만들어만 두고</b> 건너뜁니다. <code>11행</code>에서 <code>addScore(10)</code> 을 호출하면 10 이 매개변수 <code>point</code> 에 들어가 함수 내용이 실행되고, 끝나면 다음 줄로 돌아옵니다.' },
          { type: 'callout', kind: 'warn', title: 'global 을 빼먹으면?', html: '함수 안에서 전역 변수에 <b>새 값을 대입</b>하려면 <code>global</code> 선언이 필요합니다. 빼먹으면 파이썬은 <code>score</code> 를 함수 안에서만 쓰는 새 변수(지역 변수)로 생각해서, 아직 값이 없는데 읽으려 한다는 <code>UnboundLocalError</code> 를 냅니다. (값을 <b>읽기만</b> 할 때는 global 없이도 됩니다) 전역 변수와 지역 변수는 9장에서 자세히 배웁니다.' },
          { type: 'code', title: '추가 예제. global 을 빼먹은 경우', code: `def addScore(point) :
    score = score + point

score = 0
addScore(10)
print(score)`, expectError: true,
            expect: `Traceback (most recent call last):
  File "main.py", line 5, in <module>
    addScore(10)
    ~~~~~~~~^^^^
  File "main.py", line 2, in addScore
    score = score + point
            ^^^^^
UnboundLocalError: cannot access local variable 'score' where it is not associated with a value` },
          { type: 'h', text: '② 변수 선언 부분' },
          { type: 'p', html: '프로그램 전체에서 사용할 <b>전역 변수(global variable)</b>를 미리 만들어 두는 곳입니다. 처음 값(초깃값)을 넣어 “이 프로그램은 이런 변수를 쓴다”고 한눈에 보이게 합니다.' },
          { type: 'callout', kind: 'info', title: '여기서 잠깐 — 변수의 선언', html: 'C/C++, 자바 같은 컴파일러 언어는 변수를 쓰기 전에 반드시 <b>선언</b>해야 합니다. 예를 들어 C 나 자바라면 다음처럼 먼저 “정수형 변수 a, b 를 만든다”고 선언한 뒤 값을 넣습니다.<pre><code>int a, b;     ## 두 변수를 선언한다. ##\na = 100;      ## a에 100을 대입한다. ##\nb = 50 ;      ## b에 50을 대입한다. ##</code></pre>반면 파이썬, 자바스크립트 같은 인터프리터 언어는 선언 없이 바로 <code>a = 100</code> 처럼 씁니다. 값을 대입하는 순간 변수가 자동으로 만들어지고, 100 이 정수이므로 a 는 정수형 변수가 됩니다. 그래서 파이썬에서 변수 선언이 꼭 필요한 것은 아니지만, <b>가급적 변수 선언 부분에 초깃값을 넣어 준비해 두는 것이 바람직하다</b> 정도로 이해하면 됩니다.' },
          { type: 'h', text: '③ 메인(main) 코드 부분' },
          { type: 'p', html: '프로그램이 <b>실제로 일을 처리하는</b> 핵심 부분입니다. 앞에서 만든 계산기(Code02-04)로 보면 입력받은 뒤 계산하고 출력하는 <code>3~10행</code>이 메인 코드에 해당합니다. 함수 선언 부분에서 만든 함수도 메인 코드에서 호출됩니다.' },
          { type: 'h', text: '터틀 프로그램 기본 틀 만들기' },
          { type: 'p', html: '먼저 창에 거북이가 나와서 <b>정사각형</b>을 그리는 간단한 프로그램을 만들어 봅시다. <code>import turtle</code> 은 거북이 그래픽 기능이 들어 있는 <b>turtle 모듈</b>을 불러오는 명령입니다.' },
          { type: 'code', title: 'Code02-05.py — 거북이가 정사각형 그리기', code: `import turtle

turtle.shape('turtle')

turtle.forward(200)
turtle.right(90)
turtle.forward(200)
turtle.right(90)
turtle.forward(200)
turtle.right(90)
turtle.forward(200)

turtle.done()`,
            desc: '<code>3행</code>: 커서 모양을 거북이로. <code>forward(200)</code>: 바라보는 방향으로 200 만큼 이동하며 선을 긋기, <code>right(90)</code>: 오른쪽으로 90도 회전. <code>13행</code>의 <code>done()</code> 은 창을 닫지 않고 계속 띄워 둡니다. 실행하면 페이지 위에 “Python Turtle Graphics” 창이 뜨고, 창의 ✕ 로 닫습니다.' },
          { type: 'p', html: '이제 Code02-05 를 <b>프로그램 틀 형태</b>로 바꿔 봅시다. 거북이를 담을 변수 <code>myT</code> 를 변수 선언 부분에 준비하고, 메인 코드 부분에서 거북이를 만들어 사각형을 그립니다.' },
          { type: 'code', title: 'Code02-06.py — 프로그램 틀 형태로 수정', code: `import turtle

## 함수 선언 부분 ##

## 변수 선언 부분 ##
myT = None

## 메인 코드 부분 ##
myT = turtle.Turtle()
myT.shape('turtle')

for i in range(0, 4) :
    myT.forward(200)
    myT.right(90)

turtle.done()`,
            desc: '<code>6행</code>: <code>None</code> 은 “아직 아무것도 없음”을 뜻하는 값으로, 변수를 미리 준비만 해 둘 때 씁니다. <code>9행</code>: <code>turtle.Turtle()</code> 로 거북이 한 마리를 만들어 myT 에 담습니다. <code>12~14행</code>: <b>for 반복문</b>으로 들여쓴 두 줄을 4번 반복합니다(6장에서 배웁니다). (교재의 마지막 줄 <code>myT.done()</code> 은 실제 파이썬에서 <code>AttributeError</code> 가 나므로 <code>turtle.done()</code> 으로 고쳤습니다. <code>done()</code> 은 거북이가 아니라 turtle 모듈의 함수입니다.)' },
          { type: 'callout', kind: 'more', title: '📘 turtle.forward() 와 myT.forward() 의 차이', html: '<code>turtle.forward(200)</code> 처럼 모듈 이름으로 부르면 파이썬이 자동으로 만들어 둔 <b>기본 거북이</b>가 움직입니다. <code>myT = turtle.Turtle()</code> 로 거북이를 직접 만들면 <b>여러 마리</b>를 따로 움직일 수 있습니다. 예: <code>t1 = turtle.Turtle()</code>, <code>t2 = turtle.Turtle()</code>. 다음 교시의 그림판은 거북이 한 마리면 되므로 기본 거북이(<code>turtle.…</code>)를 씁니다.' },
          { type: 'code', title: '추가 예제. 거북이 두 마리 움직이기', code: `import turtle

## 변수 선언 부분 ##
t1 = None
t2 = None

## 메인 코드 부분 ##
t1 = turtle.Turtle()
t1.shape('turtle')
t1.color('red')
t2 = turtle.Turtle()
t2.shape('turtle')
t2.color('blue')

for i in range(0, 4) :
    t1.forward(100)
    t1.right(90)
    t2.forward(150)
    t2.left(90)

turtle.done()`,
            desc: '빨간 거북이는 오른쪽으로 돌며 작은 사각형을, 파란 거북이는 왼쪽으로 돌며 큰 사각형을 그립니다.' },

          { type: 'h', text: '한 걸음 더 ① — 입력 · 계산 · 출력을 함수로 나누기' },
          { type: 'p', html: '“함수 선언 · 변수 선언 · 메인”이라는 틀은 <b>어디에 무엇을 쓸지</b>를 정해 줍니다. 그렇다면 <b>함수는 어떻게 나눌까요?</b> 가장 기본이 되는 기준은 프로그램의 세 동작 — <b>입력 → 계산 → 출력</b> — 입니다. 02-3 교시의 계산기를 이 기준으로 나눠 보겠습니다.' },
          { type: 'list', items: [
            '<b>입력 함수</b>: 사용자에게 묻고 값을 돌려준다 — 입력 방식을 바꿔도 여기만 고치면 된다',
            '<b>계산 함수</b>: 값을 받아 결과를 돌려준다 — 화면이 없어도 <b>따로 시험해 볼 수 있다</b>',
            '<b>출력 함수</b>: 결과를 보기 좋게 보여 준다 — 출력 모양을 바꿔도 계산은 건드리지 않는다'
          ] },
          { type: 'code', title: '추가 예제. 계산기를 세 함수로 나누기', code: `## 함수 선언 부분 ##
def getNumbers() :
    """두 정수를 입력받아 돌려준다."""
    a = int(input("첫 번째 숫자를 입력하세요 : "))
    b = int(input("두 번째 숫자를 입력하세요 : "))
    return a, b

def calcAll(a, b) :
    """네 가지 계산 결과를 한꺼번에 돌려준다."""
    return a + b, a - b, a * b, a / b

def showResult(a, b, results) :
    """계산 결과를 계산식과 함께 출력한다."""
    plus, minus, times, divide = results
    print(f"{a} + {b} = {plus}")
    print(f"{a} - {b} = {minus}")
    print(f"{a} * {b} = {times}")
    print(f"{a} / {b} = {divide}")

## 변수 선언 부분 ##
numA, numB = 0, 0

## 메인 코드 부분 ##
numA, numB = getNumbers()
showResult(numA, numB, calcAll(numA, numB))`, stdin: '300\n200\n',
            expect: `첫 번째 숫자를 입력하세요 : 300
두 번째 숫자를 입력하세요 : 200
300 + 200 = 500
300 - 200 = 100
300 * 200 = 60000
300 / 200 = 1.5`,
            desc: '<code>return</code> 은 함수가 <b>결과를 돌려주고 끝내는</b> 명령입니다. <code>return a, b</code> 처럼 쉼표로 여러 값을 돌려줄 수 있고, 받는 쪽에서 <code>numA, numB = …</code> 로 나눠 받습니다. 메인 코드가 <b>단 두 줄</b>로 줄어 프로그램의 큰 흐름이 한눈에 보입니다.' },
          { type: 'callout', kind: 'more', title: '📘 global 대신 return 을 쓰는 이유', html: '앞에서는 <code>global</code> 로 전역 변수를 바꿨지만, 위 예제는 값을 <b>돌려주고 받는</b> 방식을 썼습니다. 둘 다 동작하지만 <code>return</code> 쪽이 대체로 더 안전합니다.<ul><li>함수가 <b>바깥 세상을 몰래 바꾸지 않으므로</b>, 그 함수만 따로 떼어 시험해 볼 수 있습니다.</li><li>어떤 값이 오고 가는지 <b>함수 이름과 괄호만 봐도</b> 알 수 있습니다.</li><li>전역 변수가 많아지면 “누가 이 값을 바꿨지?”를 추적하기 어려워집니다 — 프로그램이 커질수록 심해집니다.</li></ul>그래서 <code>global</code> 은 GUI 콜백처럼 <b>값을 돌려줄 곳이 없을 때</b>(이 장의 그림판이 그렇습니다) 주로 씁니다. 함수와 반환값은 9장에서 자세히 배웁니다.' },

          { type: 'h', text: '한 걸음 더 ② — 주석과 docstring' },
          { type: 'p', html: '위 예제에서 함수 첫 줄에 넣은 <code>"""…"""</code> 를 <b>독스트링(docstring)</b>이라고 합니다. 겉모습은 여러 줄 문자열이지만 파이썬이 <b>함수의 설명서</b>로 기억해 두었다가, <code>help()</code> 나 편집기의 도움말로 보여 줍니다. 그냥 주석과 달리 <b>프로그램이 읽을 수 있는 설명</b>인 셈이죠.' },
          { type: 'code', title: '추가 예제. docstring 은 프로그램도 읽을 수 있다', code: `def rectArea(width, height) :
    """직사각형의 넓이를 돌려준다.

    width, height : 변의 길이 (0 보다 큰 수)
    """
    return width * height

print(rectArea(12, 5))
print("--- 설명서 보기 ---")
print(rectArea.__doc__)`,
            expect: `60
--- 설명서 보기 ---
직사각형의 넓이를 돌려준다.

width, height : 변의 길이 (0 보다 큰 수)`,
            desc: '함수 이름 뒤에 <code>.__doc__</code> 를 붙이면 독스트링을 꺼내 볼 수 있습니다. (파이썬 3.13 부터는 독스트링의 <b>공통 들여쓰기를 자동으로 없애</b> 주어서, 위처럼 들여쓴 설명도 왼쪽에 붙어 출력됩니다.) <code>print(len.__doc__)</code> 처럼 <b>파이썬 기본 함수의 설명</b>도 같은 방법으로 볼 수 있습니다.' },
          { type: 'callout', kind: 'more', title: '📘 좋은 주석 · 나쁜 주석', html: '<ul><li><b>나쁜 주석</b>: <code>total = total + 1  # total 에 1 을 더한다</code> — 코드를 그대로 옮겨 적은 주석은 쓸모가 없고, 코드를 고치면 거짓말이 됩니다.</li><li><b>좋은 주석</b>: <code>score = score + 10  # 보너스 점수는 정책상 10점 고정</code> — 코드만 봐서는 알 수 없는 <b>“왜”</b>를 적습니다.</li><li><b>docstring</b>: 함수가 <b>무엇을</b> 하는지, 무엇을 받고 무엇을 돌려주는지 한두 줄로 적습니다. 첫 줄은 마침표로 끝나는 한 문장이 관례입니다(PEP 257).</li><li>주석을 많이 달아야 할 만큼 어렵다면, 대개는 <b>이름을 고치거나 함수로 쪼개는 것</b>이 더 나은 답입니다.</li></ul>' },

          { type: 'h', text: '한 걸음 더 ③ — 터틀의 좌표계와 창 크기' },
          { type: 'p', html: '거북이는 <b>창 한가운데(0, 0)</b> 에서 <b>오른쪽</b>을 보고 시작합니다. 오른쪽이 +x, <b>위쪽이 +y</b> 입니다(컴퓨터 화면 좌표는 보통 아래쪽이 +y 라서 헷갈리기 쉽습니다). 창 크기는 <code>turtle.setup(너비, 높이)</code> 로 정하며, 이 강좌의 기본 창은 <b>640 × 520</b> 입니다. 따라서 x 는 대략 -320 ~ 320, y 는 -260 ~ 260 범위가 보입니다.' },
          { type: 'table', head: ['함수', '하는 일'], rows: [
            ['<code>turtle.setup(600, 400)</code>', '창 크기를 너비 600, 높이 400 으로'],
            ['<code>turtle.window_width()</code> · <code>window_height()</code>', '지금 창의 너비 · 높이를 알려 준다'],
            ['<code>turtle.position()</code> · <code>xcor()</code> · <code>ycor()</code>', '거북이의 현재 좌표'],
            ['<code>turtle.heading()</code>', '거북이가 보는 방향(0 = 오른쪽, 90 = 위쪽)'],
            ['<code>turtle.home()</code>', '(0, 0) 으로 돌아가고 방향도 처음으로'],
            ['<code>turtle.write(글자)</code>', '현재 위치에 글자를 쓴다']
          ], caption: '위치와 창을 다루는 turtle 함수' },
          { type: 'code', title: '추가 예제. 좌표를 확인하며 움직이기', code: `import turtle

turtle.setup(600, 400)
turtle.title('좌표 확인')
print("창 너비 :", turtle.window_width())
print("창 높이 :", turtle.window_height())

turtle.shape('turtle')
print("시작 위치 :", turtle.position(), "방향 :", turtle.heading())

turtle.penup()
turtle.goto(-250, 150)
turtle.pendown()
turtle.write("여기는 (-250, 150)")
print("이동 후 :", turtle.position())

turtle.setheading(90)
turtle.forward(50)
print("위로 50 :", turtle.position(), "방향 :", turtle.heading())

turtle.home()
print("home() 뒤 :", turtle.position())
turtle.done()`,
            expect: `창 너비 : 600
창 높이 : 400
시작 위치 : (0.00,0.00) 방향 : 0.0
이동 후 : (-250.00,150.00)
위로 50 : (-250.00,200.00) 방향 : 90.0
home() 뒤 : (0.00,0.00)`,
            desc: '<code>position()</code> 이 돌려주는 값은 좌표 한 쌍입니다. 화면에 그리기 전에 <b>숫자로 확인</b>하면 “왜 엉뚱한 곳에 그려지지?”를 훨씬 빨리 해결할 수 있습니다.' },

          { type: 'h', text: '한 걸음 더 ④ — 그림을 함수로 만들어 재사용하기' },
          { type: 'p', html: '정삼각형, 정사각형, 정육각형을 그리는 코드는 <b>반복 횟수와 회전 각도만</b> 다릅니다. 이렇게 “같은 모양, 다른 값”이 보이면 <b>함수로 묶고 값을 매개변수로 받는</b> 것이 정답입니다. 정n각형은 한 바퀴(360도)를 n 번에 나눠 도니까 회전 각도는 <code>360 / n</code> 입니다.' },
          { type: 'code', title: '추가 예제. 정다각형 함수 하나로 여러 도형 그리기', code: `import turtle

## 함수 선언 부분 ##
def drawPolygon(t, n, size) :
    """거북이 t 로 한 변이 size 인 정n각형을 그린다."""
    for i in range(0, n) :
        t.forward(size)
        t.left(360 / n)

def moveTo(t, x, y) :
    """선을 그리지 않고 (x, y) 로 옮긴다."""
    t.penup()
    t.goto(x, y)
    t.pendown()

## 변수 선언 부분 ##
myT = None

## 메인 코드 부분 ##
myT = turtle.Turtle()
myT.shape('turtle')
myT.speed(0)

moveTo(myT, -240, 0)
drawPolygon(myT, 3, 90)
moveTo(myT, -80, 0)
drawPolygon(myT, 4, 80)
moveTo(myT, 80, 0)
drawPolygon(myT, 6, 60)
moveTo(myT, 220, 0)
drawPolygon(myT, 12, 30)

myT.hideturtle()
turtle.done()`,
            desc: '함수 하나로 삼각형 · 사각형 · 육각형 · 십이각형을 모두 그렸습니다. <code>drawPolygon(myT, 30, 12)</code> 처럼 변의 수를 늘리면 원에 가까워집니다. <b>거북이를 매개변수 <code>t</code> 로 받는</b> 것도 중요한 습관입니다 — 어떤 거북이에게든 같은 그림을 시킬 수 있으니까요.' },
          { type: 'callout', kind: 'more', title: '📘 같은 함수를 조금씩 바꿔 쓰기 — 기본값 매개변수', html: '<code>def drawPolygon(t, n, size=50) :</code> 처럼 매개변수에 <b>기본값</b>을 주면 <code>drawPolygon(myT, 5)</code> 처럼 일부를 생략해 호출할 수 있습니다. 또 <code>drawPolygon(myT, n=5, size=100)</code> 처럼 <b>이름을 붙여</b> 넘기면 순서를 외우지 않아도 되고 코드도 읽기 쉬워집니다. 자세한 내용은 9장에서 배웁니다.' },

          { type: 'h', text: '한 걸음 더 ⑤ — tracer() 와 update() 로 빠르게 그리기' },
          { type: 'p', html: '거북이는 한 획을 그을 때마다 화면을 다시 그립니다. 덕분에 움직임이 보여서 배우기 좋지만, 선이 수백 개가 되면 <b>답답할 만큼 느려집니다</b>. 이럴 때는 <code>turtle.tracer(0)</code> 으로 <b>화면 갱신을 잠시 끄고</b>, 다 그린 뒤 <code>turtle.update()</code> 로 한 번에 보여 주면 됩니다.' },
          { type: 'code', title: '추가 예제. 화면 갱신을 멈추고 한 번에 그리기', code: `import turtle

## 변수 선언 부분 ##
myT = None

## 메인 코드 부분 ##
turtle.setup(640, 520)
turtle.tracer(0)          # 0 = 화면 갱신 끄기 (그리는 과정을 보여 주지 않음)

myT = turtle.Turtle()
myT.hideturtle()
myT.pensize(2)

for i in range(0, 72) :
    myT.pencolor((i / 72, 0.4, 1 - i / 72))
    myT.forward(150)
    myT.left(95)

turtle.update()           # 지금까지 그린 것을 한 번에 화면에 반영
turtle.done()`,
            desc: '<code>tracer(0)</code> 줄을 지우고 실행해 보면 차이를 확실히 느낄 수 있습니다. <code>tracer(10)</code> 처럼 숫자를 주면 “10번 움직일 때마다 한 번 갱신”이 되어 속도와 재미를 절충할 수 있습니다. <b>update() 를 깜빡하면 화면이 텅 빈 채로 남으니</b> 주의하세요.' },
          { type: 'callout', kind: 'more', title: '📘 그리기를 빠르게 하는 세 가지', html: '<ul><li><code>turtle.speed(0)</code> — 거북이 이동 속도를 최고로 (0 이 “애니메이션 없음”, 1 이 가장 느림, 10 이 빠름)</li><li><code>turtle.hideturtle()</code> — 거북이 그림을 숨기면 다시 그릴 것이 줄어듭니다</li><li><code>tracer(0)</code> + <code>update()</code> — 가장 효과가 큽니다. 게임이나 애니메이션에서는 “한 장면을 다 그린 뒤 한 번에 보여 주기”가 기본이며, 이것을 <b>더블 버퍼링(double buffering)</b> 이라고 부릅니다.</li></ul>' }
        ],
        practice: [
          {
            title: '실습 2-16. 정삼각형 그리기',
            level: 1,
            desc: '<p>Code02-06 의 틀을 그대로 사용해서 한 변이 200 인 <b>정삼각형</b>을 그리세요.</p>',
            hint: '정삼각형은 3번 반복하고, 한 번에 <b>120도</b>씩 돌아야 합니다 (바깥쪽으로 도는 각도). <code>range(0, 3)</code>',
            starter: `import turtle

## 함수 선언 부분 ##

## 변수 선언 부분 ##
myT = None

## 메인 코드 부분 ##
myT = turtle.Turtle()
myT.shape('turtle')

# TODO: 정삼각형 그리기

turtle.done()
`,
            solution: `import turtle

## 함수 선언 부분 ##

## 변수 선언 부분 ##
myT = None

## 메인 코드 부분 ##
myT = turtle.Turtle()
myT.shape('turtle')

for i in range(0, 3) :
    myT.forward(200)
    myT.left(120)

turtle.done()
`
          },
          {
            title: '실습 2-17. 인사 함수 만들기',
            level: 1,
            desc: '<p>이름을 매개변수로 받아 인사말을 출력하는 함수 <code>greet(name)</code> 을 만들고, 메인 코드에서 두 번 호출하세요. 함수 첫 줄에는 <b>독스트링</b>으로 설명을 적습니다.</p><pre>홍길동 님, 반갑습니다!\n파이썬 님, 반갑습니다!\ngreet 의 설명 : 이름을 받아 인사말을 출력한다.</pre>',
            hint: '<code>def greet(name) :</code> 아래를 4칸 들여쓰고 <code>print(f"{name} 님, 반갑습니다!")</code>. 독스트링은 <code>"""설명"""</code> 한 줄이면 충분하고, <code>greet.__doc__</code> 로 꺼내 볼 수 있습니다.',
            starter: `## 함수 선언 부분 ##
def greet(name) :
    # TODO: 독스트링과 인사말 출력
    pass

## 메인 코드 부분 ##
# TODO: greet() 를 두 번 호출하고 설명도 출력
`,
            solution: `## 함수 선언 부분 ##
def greet(name) :
    """이름을 받아 인사말을 출력한다."""
    print(f"{name} 님, 반갑습니다!")

## 메인 코드 부분 ##
greet("홍길동")
greet("파이썬")
print("greet 의 설명 :", greet.__doc__)
`,
            expect: `홍길동 님, 반갑습니다!
파이썬 님, 반갑습니다!
greet 의 설명 : 이름을 받아 인사말을 출력한다.`
          },
          {
            title: '실습 2-18. 호출 횟수 세기',
            level: 2,
            desc: '<p>함수 <code>hello()</code> 를 호출할 때마다 <code>안녕하세요!</code> 를 출력하고, 전역 변수 <code>count</code> 를 1씩 늘리세요. 메인 코드에서 3번 호출한 뒤 호출 횟수를 출력합니다.</p><pre>안녕하세요!\n안녕하세요!\n안녕하세요!\n호출 횟수 : 3</pre>',
            hint: '함수 안에서 전역 변수의 값을 바꾸려면 <code>global count</code> 가 필요합니다.',
            starter: `## 함수 선언 부분 ##
def hello() :
    # TODO: 전역 변수 count 사용 선언, 출력, count 1 증가
    pass

## 변수 선언 부분 ##
count = 0

## 메인 코드 부분 ##
hello()
hello()
hello()
print("호출 횟수 :", count)
`,
            solution: `## 함수 선언 부분 ##
def hello() :
    global count
    print("안녕하세요!")
    count = count + 1

## 변수 선언 부분 ##
count = 0

## 메인 코드 부분 ##
hello()
hello()
hello()
print("호출 횟수 :", count)
`,
            expect: `안녕하세요!
안녕하세요!
안녕하세요!
호출 횟수 : 3`
          },
          {
            title: '실습 2-19. 계단 모양으로 정사각형 3개',
            level: 2,
            desc: '<p>한 변의 길이를 매개변수로 받아 정사각형을 그리는 함수 <code>drawSquare(t, size)</code> 를 만들고, 이 함수 하나로 크기가 <b>50, 100, 150</b> 인 정사각형 세 개를 서로 겹치지 않게 그리세요.</p><p>선을 그리지 않고 이동하는 <code>moveTo(t, x, y)</code> 함수도 함께 만들면 메인 코드가 깔끔해집니다.</p>',
            hint: '<code>drawSquare</code> 안에서 <code>for i in range(0, 4) :</code> 로 <code>t.forward(size)</code> 와 <code>t.right(90)</code> 을 반복합니다. 이동은 <code>t.penup()</code> → <code>t.goto(x, y)</code> → <code>t.pendown()</code> 순서.',
            starter: `import turtle

## 함수 선언 부분 ##
def drawSquare(t, size) :
    """한 변이 size 인 정사각형을 그린다."""
    # TODO: for 로 4번 반복
    pass

def moveTo(t, x, y) :
    """선을 그리지 않고 (x, y) 로 옮긴다."""
    # TODO: penup - goto - pendown
    pass

## 변수 선언 부분 ##
myT = None

## 메인 코드 부분 ##
myT = turtle.Turtle()
myT.shape('turtle')
myT.speed(0)

# TODO: moveTo 와 drawSquare 로 크기 50, 100, 150 의 정사각형 그리기

turtle.done()
`,
            solution: `import turtle

## 함수 선언 부분 ##
def drawSquare(t, size) :
    """한 변이 size 인 정사각형을 그린다."""
    for i in range(0, 4) :
        t.forward(size)
        t.right(90)

def moveTo(t, x, y) :
    """선을 그리지 않고 (x, y) 로 옮긴다."""
    t.penup()
    t.goto(x, y)
    t.pendown()

## 변수 선언 부분 ##
myT = None

## 메인 코드 부분 ##
myT = turtle.Turtle()
myT.shape('turtle')
myT.speed(0)

moveTo(myT, -260, 0)
drawSquare(myT, 50)
moveTo(myT, -180, 0)
drawSquare(myT, 100)
moveTo(myT, -50, 0)
drawSquare(myT, 150)

myT.hideturtle()
turtle.done()
`
          },
          {
            title: '🚀 프로젝트 2-3. 거북이 도형 그리기 도구',
            level: 3,
            desc: '<p>도형을 그리는 <b>나만의 함수 묶음</b>을 만들어, 한 화면에 여러 도형을 나란히 그리는 프로그램을 만드세요.</p><p><b>요구 사항</b></p><ol><li><code>drawPolygon(t, n, size, color)</code> — 한 변이 <code>size</code> 인 정n각형을 <code>color</code> 로 <b>안까지 채워</b> 그린다 (<code>begin_fill()</code> … <code>end_fill()</code>)</li><li><code>moveTo(t, x, y)</code> — 선을 그리지 않고 (x, y) 로 이동한다</li><li><code>label(t, x, y, text)</code> — (x, y) 에 글자를 쓴다</li><li>메인 코드에서 <b>삼각형 · 사각형 · 오각형 · 육각형</b>을 가로로 나란히 그리고, 각 도형 아래에 <code>3각형</code> 처럼 이름을 쓴다</li><li><code>tracer(0)</code> … <code>update()</code> 로 <b>한 번에</b> 그려 기다리지 않게 한다</li><li>마지막에 거북이를 숨기고 <code>turtle.done()</code> 으로 창을 유지한다</li></ol><p><b>더 해 보기</b> — ① 색 목록을 만들어 <code>random.choice()</code> 로 고르게 해 보세요. ② 같은 자리에 크기를 조금씩 줄여 가며 여러 번 그려 나선 무늬를 만들어 보세요. ③ 02-5 교시를 배운 뒤 <b>클릭한 자리에</b> 도형이 그려지도록 바꿔 보세요.</p>',
            hint: '정n각형의 회전 각도는 <code>360 / n</code> 입니다. 색 채우기는 <code>t.fillcolor(color)</code> → <code>t.begin_fill()</code> → (도형 그리기) → <code>t.end_fill()</code> 순서입니다. 글자는 <code>t.write(text, align=\'center\')</code> 로 가운데 정렬할 수 있습니다.',
            starter: `import turtle

## 함수 선언 부분 ##
def moveTo(t, x, y) :
    """선을 그리지 않고 (x, y) 로 옮긴다."""
    t.penup()
    t.goto(x, y)
    t.pendown()

def drawPolygon(t, n, size, color) :
    """한 변이 size 인 정n각형을 color 로 채워 그린다."""
    # TODO: fillcolor - begin_fill - for 반복 - end_fill
    pass

def label(t, x, y, text) :
    """(x, y) 위치에 글자를 쓴다."""
    # TODO: moveTo 로 이동한 뒤 write
    pass

## 변수 선언 부분 ##
myT = None

## 메인 코드 부분 ##
turtle.setup(640, 520)
turtle.tracer(0)
myT = turtle.Turtle()
myT.speed(0)

# TODO: 3 ~ 6 각형을 나란히 그리고 이름 붙이기

myT.hideturtle()
turtle.update()
turtle.done()
`,
            solution: `import turtle

## 함수 선언 부분 ##
def moveTo(t, x, y) :
    """선을 그리지 않고 (x, y) 로 옮긴다."""
    t.penup()
    t.goto(x, y)
    t.pendown()

def drawPolygon(t, n, size, color) :
    """한 변이 size 인 정n각형을 color 로 채워 그린다."""
    t.fillcolor(color)
    t.begin_fill()
    for i in range(0, n) :
        t.forward(size)
        t.left(360 / n)
    t.end_fill()

def label(t, x, y, text) :
    """(x, y) 위치에 글자를 쓴다."""
    moveTo(t, x, y)
    t.write(text, align='center')

## 변수 선언 부분 ##
myT = None

## 메인 코드 부분 ##
turtle.setup(640, 520)
turtle.tracer(0)
myT = turtle.Turtle()
myT.speed(0)

moveTo(myT, -270, 0)
drawPolygon(myT, 3, 90, 'tomato')
label(myT, -225, -40, '3각형')

moveTo(myT, -130, 0)
drawPolygon(myT, 4, 80, 'gold')
label(myT, -90, -40, '4각형')

moveTo(myT, 10, 0)
drawPolygon(myT, 5, 65, 'skyblue')
label(myT, 60, -40, '5각형')

moveTo(myT, 150, 0)
drawPolygon(myT, 6, 55, 'mediumseagreen')
label(myT, 200, -40, '6각형')

myT.hideturtle()
turtle.update()
turtle.done()
`
          }
        ],
        quiz: [
          { q: '파이썬에서 주석을 나타내는 기호는?', options: ['//', '#', '--', '/* */'], answer: 1, explain: '# 뒤의 내용은 실행되지 않는 주석입니다. 여러 줄은 작은따옴표 3개로 감쌀 수 있습니다.' },
          { q: '다음 코드의 출력은?<pre><code>data = \'파이\' + \\\n       \'썬\'\nprint(data)</code></pre>', options: ['파이', '파이썬', '파이 썬', '오류'], answer: 1, explain: '줄 끝의 \\ 는 다음 줄과 이어서 한 줄로 인식하게 합니다. 문자열끼리 + 는 이어 붙이기입니다.' },
          { q: '다음 코드의 출력은?<pre><code>def plus() :\n    global total\n    total = total + 10\n\ntotal = 5\nplus()\nplus()\nprint(total)</code></pre>', options: ['5', '15', '25', '오류'], answer: 2, explain: 'plus() 를 두 번 호출해 5 + 10 + 10 = 25 가 됩니다.' },
          { q: '긴 프로그램의 세 부분 중 “프로그램 전체에서 쓸 변수를 초깃값과 함께 준비하는 곳”은?', options: ['함수 선언 부분', '변수 선언 부분', '메인 코드 부분', 'import 부분'], answer: 1, explain: '전역 변수를 미리 준비하는 곳이 변수 선언 부분입니다.' },
          { q: '파이썬의 변수 선언에 대한 설명으로 옳은 것은?', options: ['C 처럼 int a; 로 반드시 먼저 선언해야 한다', '값을 대입하는 순간 변수가 자동으로 만들어진다', '변수는 한 번 만들면 값을 바꿀 수 없다', '변수는 함수 안에서만 만들 수 있다'], answer: 1, explain: '파이썬은 선언 없이 대입하는 순간 변수가 생깁니다. 다만 변수 선언 부분에 초깃값을 넣어 두는 것이 바람직합니다.' },
          { q: '다음 코드의 출력은?<pre><code>def calc(a, b) :\n    return a + b, a * b\n\nx, y = calc(3, 4)\nprint(x, y)</code></pre>', options: ['3 4', '7 12', '(7, 12)', '오류'], answer: 1, explain: '<code>return</code> 으로 두 값을 돌려주면 받는 쪽에서 <code>x, y</code> 로 나눠 받을 수 있습니다. <code>global</code> 없이 값을 주고받는 더 안전한 방법입니다.' }
        ],
        slides: [
          { layout: 'title', title: '긴 프로그램의 구조 — 주석 · 함수 · 전역 변수', subtitle: 'Chapter 02 · Section 05 (1)', badge: '02-4',
            notes: '<p><b>[도입 2분]</b> “이제 프로그램 2(그림판)를 만듭니다. 30줄이 넘는데, 긴 글을 쓸 때 서론 · 본론 · 결론으로 나누듯 프로그램도 틀을 잡고 씁니다.”</p>' },
          { layout: 'diagram', title: '긴 프로그램은 세 부분으로', html: SVG_STRUCTURE, caption: '## 함수 선언 부분 ## · ## 변수 선언 부분 ## · ## 메인(main) 코드 부분 ##',
            notes: '<p><b>[4분]</b> 오늘 완성할 Code02-07 의 뼈대를 먼저 보여 줍니다. 비유: 함수 = 요리 레시피(미리 적어 둠), 변수 = 재료 준비, 메인 = 실제 요리 순서.</p><p>파이썬이 강제하는 규칙이 아니라 “읽기 쉽게 정리하는 습관”이라는 점도 말해 주세요.</p>' },
          { layout: 'two', title: '주석과 줄 이어 쓰기',
            left: { title: '여러 줄 주석', code: "'''\n여러 줄 주석\n입니다.\n'''\nprint('실행됨')" },
            right: { title: '\\ 로 줄 이어 쓰기', code: "data = '안녕' + \\\n       '하세요? ' + \\\n       '파이썬!'\nprint(data)" },
            notes: '<p><b>[4분]</b> # 은 한 줄 주석, \'\'\' \'\'\' 는 여러 줄. 한글 키보드에서 \\ 는 ₩ 로 보입니다.</p><p>편집기에서 여러 줄 선택 후 <kbd>Ctrl</kbd>+<kbd>/</kbd> 로 주석을 켜고 끄는 것을 시연하면 학생들이 좋아합니다.</p>' },
          { layout: 'bullets', title: '① 함수 선언 부분', lead: 'def 함수명(매개변수) : 로 함수를 만들어 둔다',
            bullets: ['<code>def</code> = define, 끝에 <b>콜론(:)</b>', '함수 내용은 <b>들여쓰기</b> (스페이스 4칸)', '<code>global 변수</code> — 함수 밖의 변수를 바꾸겠다는 선언', '만들기만 하면 실행 안 됨 → <b>호출</b>해야 실행'],
            notes: '<p><b>[4분]</b> 형식: <code>def 함수명(매개변수) :</code> / <code>global 사용할_전역_변수</code> / <code># 함수 내용</code>.</p><p>들여쓰기가 파이썬 문법의 일부라는 점을 처음 강조하는 시점입니다. 들여쓰기가 틀리면 IndentationError.</p>' },
          { layout: 'code', title: '세 부분 구조 맛보기', code: '## 함수 선언 부분 ##\ndef addScore(point) :\n    global score\n    score = score + point\n    print(point, "점 획득!")\n\n## 변수 선언 부분 ##\nscore = 0\n\n## 메인(main) 코드 부분 ##\naddScore(10)\naddScore(5)\naddScore(20)\nprint("최종 점수 :", score)',
            points: ['함수는 <b>만들어만 두고</b> 건너뜀', '호출하면 값이 <code>point</code> 로', '<code>global</code> 로 전역 score 변경'],
            notes: '<p><b>[5분]</b> 실행 순서를 손가락으로 따라가며 설명합니다: 2~5행 건너뜀 → 8행 → 11행 호출 → 3~5행 → 12행 …</p><p>그다음 3행(global)을 지우고 실행해 UnboundLocalError 를 보여 주세요. “함수 안에서 score 에 대입하면 파이썬은 새 지역 변수로 생각한다”.</p>' },
          { layout: 'two', title: '② 변수 선언 부분 — 여기서 잠깐',
            left: { title: 'C / 자바', html: '<p>반드시 먼저 선언</p><pre><code>int a, b;\na = 100;\nb = 50 ;</code></pre>' },
            right: { title: '파이썬', html: '<p>대입하는 순간 자동으로 생성</p><pre><code>a = 100\nb = 50</code></pre><p>그래도 초깃값을 <b>변수 선언 부분에 준비</b>해 두면 좋다</p>' },
            notes: '<p><b>[3분]</b> 컴파일러 언어와 인터프리터 언어의 차이를 가볍게 소개합니다. a = 100 이면 a 는 자동으로 정수형 변수가 됩니다.</p><p>③ 메인 코드 부분: 실제 처리하는 부분 — 계산기 Code02-04 의 3~10행이 여기에 해당한다고 연결해 주세요.</p>' },
          { layout: 'code', title: 'Code02-05.py — 거북이 정사각형', code: "import turtle\n\nturtle.shape('turtle')\n\nturtle.forward(200)\nturtle.right(90)\nturtle.forward(200)\nturtle.right(90)\nturtle.forward(200)\nturtle.right(90)\nturtle.forward(200)\n\nturtle.done()",
            points: ['<code>import turtle</code> — 거북이 모듈', '<code>forward(200)</code> 앞으로 200', '<code>right(90)</code> 오른쪽 90도', '<code>done()</code> 창 유지'],
            notes: '<p><b>[3분]</b> 실행하면 거북이 창이 뜹니다. 거북이는 처음에 창 가운데에서 오른쪽을 보고 있습니다.</p><p>질문: “같은 두 줄이 반복되네요. 더 짧게 쓸 수는 없을까?” → 다음 슬라이드의 for.</p>' },
          { layout: 'code', title: 'Code02-06.py — 프로그램 틀 형태로', code: "import turtle\n\n## 함수 선언 부분 ##\n\n## 변수 선언 부분 ##\nmyT = None\n\n## 메인 코드 부분 ##\nmyT = turtle.Turtle()\nmyT.shape('turtle')\n\nfor i in range(0, 4) :\n    myT.forward(200)\n    myT.right(90)\n\nturtle.done()",
            points: ['<code>None</code> = 아직 없음', '<code>turtle.Turtle()</code> 로 거북이 생성', 'for 로 4번 반복 (6장)', '교재 <code>myT.done()</code> → <code>turtle.done()</code>'],
            notes: '<p><b>[4분]</b> 교재의 마지막 줄 <code>myT.done()</code> 은 실제 파이썬에서 AttributeError 가 납니다(Turtle 객체에는 done 이 없음). 모듈 함수 <code>turtle.done()</code> 으로 고쳐서 쓰도록 안내하세요.</p><p>for 는 “들여쓴 줄을 4번 반복”이라고만 설명하고 넘어갑니다.</p>' },
          { layout: 'code', title: '한 걸음 더 ① — 입력 · 계산 · 출력 나누기', code: 'def getNumbers() :\n    """두 정수를 입력받아 돌려준다."""\n    a = int(input("첫 번째 숫자 : "))\n    b = int(input("두 번째 숫자 : "))\n    return a, b\n\ndef calcAll(a, b) :\n    """네 가지 계산 결과를 돌려준다."""\n    return a + b, a - b, a * b, a / b\n\ndef showResult(a, b, results) :\n    """결과를 계산식과 함께 출력한다."""\n    plus, minus, times, divide = results\n    print(f"{a} + {b} = {plus}")\n    print(f"{a} - {b} = {minus}")\n    print(f"{a} * {b} = {times}")\n    print(f"{a} / {b} = {divide}")\n\nnumA, numB = getNumbers()\nshowResult(numA, numB, calcAll(numA, numB))', stdin: '300\n200\n',
            points: ['프로그램의 세 동작 = <b>입력 · 계산 · 출력</b>', '<code>return</code> 으로 결과를 <b>돌려줌</b>', '<code>return a, b</code> — 여러 값도 한 번에', '메인 코드가 <b>두 줄</b>로 줄었다'],
            notes: '<p><b>[6분]</b> 02-3 교시의 계산기와 같은 프로그램입니다. “무엇이 좋아졌나요?”라고 물어보세요 — 출력 모양을 바꿀 때 showResult 만 고치면 됩니다.</p><p><b>global vs return</b>: 계산 함수는 바깥을 건드리지 않으므로 따로 시험해 볼 수 있습니다. global 은 GUI 콜백처럼 값을 돌려줄 곳이 없을 때 주로 씁니다(다음 교시의 그림판).</p>' },
          { layout: 'two', title: '한 걸음 더 ② — 주석과 docstring',
            left: { title: '주석 — 사람만 읽는다', html: '<pre><code>score = score + 10\n# 보너스는 정책상 10점 고정</code></pre><p><b>“왜”</b>를 적는다</p><p>코드를 그대로 옮겨 적은 주석은<br>고치면 곧 거짓말이 된다</p>' },
            right: { title: 'docstring — 프로그램도 읽는다', code: 'def rectArea(width, height) :\n    """직사각형의 넓이를 돌려준다."""\n    return width * height\n\nprint(rectArea(12, 5))\nprint(rectArea.__doc__)' },
            notes: '<p><b>[4분]</b> 독스트링은 함수 <b>첫 줄</b>에 오는 <code>"""…"""</code> 입니다. <code>help(함수)</code>, <code>함수.__doc__</code>, 편집기 도움말이 모두 이것을 보여 줍니다.</p><p>첫 줄은 “무엇을 하는지” 한 문장(PEP 257). 주석이 많이 필요하다면 이름을 고치거나 함수로 쪼개라는 신호라는 말도 덧붙이세요.</p>' },
          { layout: 'code', title: '한 걸음 더 ③ — 좌표계와 창 크기', code: "import turtle\n\nturtle.setup(600, 400)\nprint(\"창 너비 :\", turtle.window_width())\nturtle.shape('turtle')\nprint(\"시작 :\", turtle.position(), turtle.heading())\n\nturtle.penup()\nturtle.goto(-250, 150)\nturtle.pendown()\nturtle.write(\"여기는 (-250, 150)\")\nprint(\"이동 후 :\", turtle.position())\n\nturtle.home()\nprint(\"home() 뒤 :\", turtle.position())\nturtle.done()",
            points: ['창 <b>한가운데가 (0, 0)</b>', '오른쪽 +x, <b>위쪽 +y</b> (화면 좌표와 반대)', '<code>setup(600, 400)</code> — 창 크기', '기본 창은 <b>640 × 520</b>'],
            notes: '<p><b>[4분]</b> 좌표를 print 로 확인하는 습관을 보여 주는 슬라이드입니다. “왜 엉뚱한 곳에 그려지지?” 를 가장 빨리 해결하는 방법입니다.</p><p>학생 질문 대비: heading 0 = 오른쪽, 90 = 위쪽. home() 은 위치와 방향을 모두 처음으로 되돌립니다.</p>' },
          { layout: 'code', title: '한 걸음 더 ④ — 그림을 함수로 재사용', code: "import turtle\n\ndef drawPolygon(t, n, size) :\n    \"\"\"한 변이 size 인 정n각형을 그린다.\"\"\"\n    for i in range(0, n) :\n        t.forward(size)\n        t.left(360 / n)\n\ndef moveTo(t, x, y) :\n    t.penup()\n    t.goto(x, y)\n    t.pendown()\n\nmyT = turtle.Turtle()\nturtle.tracer(0)\n\nmoveTo(myT, -200, 0)\ndrawPolygon(myT, 3, 90)\nmoveTo(myT, -40, 0)\ndrawPolygon(myT, 6, 60)\n\nmyT.hideturtle()\nturtle.update()\nturtle.done()",
            points: ['삼각형 · 사각형 · 육각형 = <b>값만 다름</b>', '회전 각도는 <code>360 / n</code>', '거북이 <code>t</code> 도 매개변수로 받기', '<code>tracer(0)</code> … <code>update()</code> 로 한 번에'],
            notes: '<p><b>[5분]</b> “같은 모양, 다른 값”이 보이면 함수로 묶는다 — 이 장에서 가장 중요한 메시지 중 하나입니다.</p><p><code>tracer(0)</code> 은 화면 갱신을 끄고 <code>update()</code> 에서 한 번에 보여 줍니다. tracer 줄을 지우고 다시 실행해 속도 차이를 직접 보여 주세요. update() 를 빠뜨리면 화면이 빈 채로 남습니다.</p><p>실습 2-19 와 🚀 프로젝트 2-3 이 이 내용입니다.</p>' },
          { layout: 'quiz', title: '확인 문제', q: '출력은?<pre><code>def plus() :\n    global total\n    total = total + 10\n\ntotal = 5\nplus()\nplus()\nprint(total)</code></pre>', options: ['5', '15', '25', '오류'], answer: 2, explain: '두 번 호출: 5 → 15 → 25.',
            notes: '<p><b>[2분]</b> “global 줄을 지우면 어떻게 될까요?” 추가 질문으로 UnboundLocalError 를 복습합니다.</p>' },
          { layout: 'practice', title: '실습 2-16. 정삼각형 그리기', desc: '<p>Code02-06 의 틀로 한 변이 200 인 정삼각형을 그리세요. (힌트: 3번, 120도)</p>',
            starter: "import turtle\n\n## 변수 선언 부분 ##\nmyT = None\n\n## 메인 코드 부분 ##\nmyT = turtle.Turtle()\nmyT.shape('turtle')\n\n# TODO: 정삼각형 그리기\n\nturtle.done()\n",
            solution: "import turtle\n\n## 변수 선언 부분 ##\nmyT = None\n\n## 메인 코드 부분 ##\nmyT = turtle.Turtle()\nmyT.shape('turtle')\n\nfor i in range(0, 3) :\n    myT.forward(200)\n    myT.left(120)\n\nturtle.done()\n",
            notes: '<p><b>[8분]</b> 60도로 돌리는 학생이 많습니다(안쪽 각). 거북이는 “바깥쪽으로 도는 각”만큼 돌아야 하므로 120도. 직접 실행해 보고 스스로 찾게 하세요.</p><p>다음 순서: 실습 2-17(함수 만들기 · docstring) → 2-18(global 로 호출 횟수) → 2-19(정사각형 3개). 빠른 학생은 🚀 프로젝트 2-3(도형 그리기 도구).</p>' },
          { layout: 'summary', title: '정리', bullets: ['긴 프로그램 = 함수 선언 · 변수 선언 · 메인 코드', '<code>#</code> 한 줄 주석, <code>\'\'\'</code> 여러 줄 주석, <code>\\</code> 줄 이어 쓰기', '<code>def 함수명(매개변수) :</code> + 들여쓰기, <code>global</code>', '파이썬 변수는 대입하는 순간 생성', 'turtle: shape · forward · right · done'],
            notes: '<p><b>[1분]</b> 다음 교시: 이 틀에 마우스 클릭 기능을 채워 [프로그램 2] 그림판을 완성합니다.</p>' }
        ]
      },

      /* ===================== ch02-5 ===================== */
      {
        id: 'ch02-5',
        title: '[프로그램 2] 마우스로 그리는 터틀 그래픽',
        minutes: 50,
        goals: [
          '마우스 버튼별 기능을 계획하고 필요한 변수를 준비할 수 있다',
          'onscreenclick() 으로 마우스 클릭에 함수를 연결할 수 있다',
          'random 모듈로 임의의 색과 크기를 만들 수 있다',
          '세 부분 구조로 [프로그램 2] 터틀 그래픽 그림판을 완성할 수 있다',
          '(심화) 콜백 · 이벤트 루프로 이어지는 이벤트 기반 프로그램의 구조를 설명할 수 있다',
          '(심화) random 의 여러 함수와 seed 의 쓸모를 알고 알맞게 골라 쓸 수 있다',
          '(심화) onkey · listen · ontimer · textinput 으로 키보드와 대화상자를 다룰 수 있다'
        ],
        flow: [['기능 계획 · 변수 준비', 6], ['기능 1 · 2 구현 (클릭 → 함수)', 10], ['기능 3 구현 (random)', 6], ['Code02-07 완성 · 표 2-1', 7], ['한 걸음 더: 이벤트 구조 · random · 키보드', 9], ['SELF STUDY · 프로젝트 · 퀴즈', 12]],
        content: [
          { type: 'h', text: '구현할 기능 계획' },
          { type: 'p', html: '마우스로 창을 클릭하면 거북이가 따라오며 그림을 그리는 프로그램을 만듭니다. 마우스 버튼 세 개에 각각 다른 기능을 맡깁니다.' },
          { type: 'list', items: [
            '<b>기능 1</b> : 마우스 <b>왼쪽</b> 버튼을 누르면 거북이가 클릭한 지점까지 <b>임의의 색상으로 선을 그리면서</b> 따라온다.',
            '<b>기능 2</b> : 마우스 <b>오른쪽</b> 버튼을 누르면 거북이가 클릭한 지점까지 <b>선을 그리지 않고 이동만</b> 한다.',
            '<b>기능 3</b> : 마우스 <b>가운데</b> 버튼을 누르면 거북이가 <b>임의로 크기를 확대 또는 축소</b>한다.'
          ] },
          { type: 'figure', html: SVG_COORD, caption: '그림 2-20 (다시 그림). ① 클릭 → ② 거북이가 클릭한 곳까지 따라가기 — 창의 가운데가 (0, 0)' },
          { type: 'figure', html: SVG_MOUSE, caption: '마우스 버튼 번호와 연결할 함수 — 1 왼쪽, 2 가운데, 3 오른쪽' },
          { type: 'h', text: '필요한 변수 준비' },
          { type: 'p', html: '거북이로 그릴 <b>선의 두께</b>(<code>pSize</code>)와 <b>거북이의 크기</b>(<code>tSize</code>), 그리고 색상을 표현할 <b>빨강(r) · 초록(g) · 파랑(b)</b> 변수를 준비합니다. 파이썬은 여러 변수에 한 줄로 값을 넣을 수 있습니다.' },
          { type: 'code', repl: true, title: '필요한 변수 준비 — 한 줄로 여러 변수에 대입', code: 'pSize, tSize = 10, 0\nr, g, b = 0.0, 0.0, 0.0\npSize\ntSize\nr, g, b',
            expect: '>>> pSize, tSize = 10, 0\n>>> r, g, b = 0.0, 0.0, 0.0\n>>> pSize\n10\n>>> tSize\n0\n>>> r, g, b\n(0.0, 0.0, 0.0)\n>>>',
            desc: '<code>r, g, b = 0.0, 0.0, 0.0</code> 은 <code>r = 0.0</code>, <code>g = 0.0</code>, <code>b = 0.0</code> 세 줄과 같습니다. 왼쪽과 오른쪽의 개수가 같아야 합니다.' },
          { type: 'p', html: '거북이의 색은 빨강 · 초록 · 파랑 빛을 얼마나 섞을지를 <b>0.0 ~ 1.0</b> 사이의 실수 세 개로 나타냅니다. 0.0 은 그 빛이 전혀 없음, 1.0 은 가장 강함입니다. 모두 0.0 이면 검정입니다.' },
          { type: 'table', head: ['(r, g, b)', '색', '(r, g, b)', '색'], rows: [
            ['<code>(0.0, 0.0, 0.0)</code>', sw('rgb(0,0,0)') + ' 검정', '<code>(1.0, 1.0, 0.0)</code>', sw('rgb(255,255,0)') + ' 노랑'],
            ['<code>(1.0, 0.0, 0.0)</code>', sw('rgb(255,0,0)') + ' 빨강', '<code>(1.0, 0.5, 0.0)</code>', sw('rgb(255,128,0)') + ' 주황'],
            ['<code>(0.0, 1.0, 0.0)</code>', sw('rgb(0,255,0)') + ' 초록', '<code>(0.5, 0.0, 0.5)</code>', sw('rgb(128,0,128)') + ' 보라'],
            ['<code>(0.0, 0.0, 1.0)</code>', sw('rgb(0,0,255)') + ' 파랑', '<code>(1.0, 1.0, 1.0)</code>', sw('rgb(255,255,255)') + ' 흰색']
          ], caption: 'RGB 색상 — 세 빛의 세기를 0.0 ~ 1.0 으로' },
          { type: 'callout', kind: 'more', title: '📘 random 모듈 — 임의의 수 만들기', html: '<code>import random</code> 으로 불러오는 random 모듈은 무작위 수(난수)를 만들어 줍니다.<ul><li><code>random.random()</code> → 0.0 이상 1.0 <b>미만</b>의 임의의 실수 — RGB 값으로 딱 알맞습니다.</li><li><code>random.randrange(1, 10)</code> → 1 이상 10 <b>미만</b>, 즉 <b>1 ~ 9</b> 중 임의의 정수 (끝 숫자는 포함하지 않음)</li><li><code>random.randint(1, 9)</code> → 1 ~ 9 (끝 숫자 포함). 같은 범위를 이렇게 쓸 수도 있습니다.</li></ul>' },
          { type: 'code', title: '추가 예제. random 으로 임의의 수 만들기', code: `import random

print(random.random())
print(random.random())
print(random.randrange(1, 10))
print(random.randrange(1, 10))`, nondeterministic: true,
            desc: '실행할 때마다 결과가 달라집니다. 여러 번 실행해 보세요.' },
          { type: 'h', text: '기능 1 구현 — 왼쪽 클릭: 선을 그리며 따라오기' },
          { type: 'p', html: '마우스를 클릭하면 파이썬이 우리가 연결해 둔 함수를 호출하면서 <b>클릭한 지점의 좌표를 x, y 로 넘겨줍니다</b>. 그래서 클릭에 연결할 함수는 반드시 매개변수 두 개(<code>x, y</code>)를 받아야 합니다.' },
          { type: 'code', run: false, title: '기능 1 : screenLeftClick() 함수', code: `def screenLeftClick(x, y) :
    global r, g, b
    turtle.pencolor((r, g, b))
    turtle.pendown()
    turtle.goto(x, y)`,
            desc: '<code>pencolor((r, g, b))</code>: 펜 색을 (r, g, b) 로 — 괄호가 두 겹인 것은 세 값을 하나로 묶어(튜플) 넘기기 때문입니다. <code>pendown()</code>: 펜을 내려 이동할 때 선이 그려지게, <code>goto(x, y)</code>: 클릭한 지점으로 이동. (함수만 있는 조각이므로 아래의 완성 코드에서 실행해 보세요)' },
          { type: 'h', text: '기능 2 구현 — 오른쪽 클릭: 선 없이 이동' },
          { type: 'code', run: false, title: '기능 2 : screenRightClick() 함수', code: `def screenRightClick(x, y) :
    turtle.penup()
    turtle.goto(x, y)`,
            desc: '<code>penup()</code>: 펜을 들어 올리면 이동해도 선이 그려지지 않습니다. 이 함수는 전역 변수를 바꾸지 않으므로 <code>global</code> 이 필요 없습니다.' },
          { type: 'p', html: '두 기능만 먼저 연결해서 동작을 확인해 봅시다. <code>turtle.onscreenclick(함수명, 버튼번호)</code> 는 “창을 이 버튼으로 클릭하면 이 함수를 호출하라”고 등록하는 함수입니다. 실행한 뒤 거북이 창을 <b>왼쪽 · 오른쪽 버튼으로 번갈아 클릭</b>해 보세요.' },
          { type: 'code', title: '추가 예제. 기능 1 · 2 만 먼저 만들어 보기', code: `import turtle

## 함수 선언 부분 ##
def screenLeftClick(x, y) :
    global r, g, b
    turtle.pencolor((r, g, b))
    turtle.pendown()
    turtle.goto(x, y)
    print("왼쪽 클릭 :", x, y)

def screenRightClick(x, y) :
    turtle.penup()
    turtle.goto(x, y)
    print("오른쪽 클릭 :", x, y)

## 변수 선언 부분 ##
r, g, b = 0.0, 0.0, 0.0

## 메인 코드 부분 ##
turtle.shape('turtle')
turtle.onscreenclick(screenLeftClick, 1)
turtle.onscreenclick(screenRightClick, 3)
turtle.done()`,
            desc: '클릭할 때마다 콘솔에 좌표가 출력되어, 파이썬이 <b>함수를 대신 호출</b>해 준다는 것을 눈으로 확인할 수 있습니다. 아직 색을 바꾸는 기능이 없어서 선은 검정입니다.' },
          { type: 'callout', kind: 'warn', title: '함수를 연결할 때 괄호를 붙이지 않는다', html: '<code>turtle.onscreenclick(screenLeftClick, 1)</code> 처럼 <b>함수 이름만</b> 넘겨야 합니다. <code>screenLeftClick()</code> 처럼 괄호를 붙이면 등록하는 순간 함수를 <b>바로 호출</b>해 버려서 <code>TypeError: screenLeftClick() missing 2 required positional arguments: \'x\' and \'y\'</code> 오류가 납니다. “나중에 클릭하면 이 함수를 불러 줘”라고 이름만 알려 주는 것입니다. 이런 함수를 <b>콜백(callback) 함수</b>라고 부릅니다.' },
          { type: 'h', text: '기능 3 구현 — 가운데 클릭: 크기와 색 바꾸기' },
          { type: 'p', html: '가운데 버튼을 누르면 거북이의 크기를 1 ~ 9 사이에서 임의로 정하고, <b>다음에 그릴 선의 색상도 임의로</b> 바꿉니다. 여기서 바꾼 <code>r, g, b</code> 는 전역 변수이므로 다음에 왼쪽 클릭을 하면 <code>screenLeftClick()</code> 이 그 색으로 선을 그립니다.' },
          { type: 'code', run: false, title: '기능 3 : screenMidClick() 함수', code: `def screenMidClick(x, y) :
    global r, g, b
    tSize = random.randrange(1, 10)
    turtle.shapesize(tSize)
    r = random.random()
    g = random.random()
    b = random.random()`,
            desc: '<code>randrange(1, 10)</code>: 1 ~ 9 중 하나, <code>shapesize(tSize)</code>: 거북이 모양을 tSize 배 크기로. <code>r, g, b</code> 에 새 값을 <b>대입</b>하므로 <code>global r, g, b</code> 가 꼭 필요합니다. (<code>tSize</code> 는 이 함수 안에서만 쓰므로 global 없이 지역 변수로 썼습니다)' },
          { type: 'h', text: '터틀 그래픽 프로그램 완성' },
          { type: 'p', html: '세 함수를 함수 선언 부분에, 변수를 변수 선언 부분에 넣고, 메인 코드에서 창 제목 · 거북이 모양 · 펜 두께를 정한 뒤 세 버튼에 함수를 연결하면 완성입니다.' },
          { type: 'code', title: '[프로그램 2] 완성: Code02-07.py 마우스로 그리는 터틀 그래픽', code: CODE02_07,
            desc: '<code>28~30행</code>: 창 제목, 거북이 모양, 펜 두께(pSize = 10) 설정. <code>32~34행</code>: 버튼 1(왼쪽) · 2(가운데) · 3(오른쪽)에 함수 연결. <code>36행</code>: <code>done()</code> 으로 창을 띄운 채 클릭을 계속 기다립니다. 가운데 클릭으로 색을 바꾼 뒤 왼쪽 클릭으로 그려 보세요.' },
          { type: 'table', head: ['함수', '설명'], rows: [
            ['<code>turtle.title(\'제목\')</code>', '윈도창의 제목을 설정한다.'],
            ['<code>turtle.pensize(펜 두께)</code>', '그릴 선의 두께를 설정한다.'],
            ['<code>turtle.onscreenclick(함수명, 번호)</code>', '윈도창을 마우스로 클릭하면 ‘함수명’ 함수가 작동한다. 1은 마우스 왼쪽 버튼, 2는 마우스 가운데 버튼, 3은 마우스 오른쪽 버튼을 지정한다.']
          ], caption: '표 2-1. Code02-07.py 에 사용된 기타 함수' },
          { type: 'table', head: ['함수', '설명'], rows: [
            ['<code>turtle.shape(\'turtle\')</code>', '커서 모양을 거북이로 (\'arrow\', \'circle\', \'square\' 등도 가능)'],
            ['<code>turtle.pencolor((r, g, b))</code>', '펜 색상 설정 (0.0 ~ 1.0 실수 3개 또는 \'red\' 같은 색 이름)'],
            ['<code>turtle.pendown()</code> / <code>turtle.penup()</code>', '펜 내리기(이동하면 선이 그려짐) / 펜 들기(선 없이 이동)'],
            ['<code>turtle.goto(x, y)</code>', '(x, y) 좌표로 이동'],
            ['<code>turtle.shapesize(크기)</code>', '거북이 모양의 크기를 배율로 설정'],
            ['<code>turtle.done()</code>', '창을 닫지 않고 이벤트(클릭 등)를 계속 기다림']
          ], caption: '이 장에서 쓴 turtle 함수 정리' },
          { type: 'callout', kind: 'tip', title: '마우스 가운데 버튼이 없다면', html: '노트북 터치패드에는 가운데 버튼이 없는 경우가 많습니다. 휠이 있는 마우스는 <b>휠을 꾹 누르면</b> 가운데 버튼입니다. 가운데 버튼이 없다면 아래 SELF STUDY 2-1 처럼 왼쪽 버튼에 기능을 합쳐 보세요.' },
          { type: 'callout', kind: 'more', title: '📘 이벤트 기반 프로그래밍', html: '계산기는 위에서 아래로 한 번 실행되고 끝났습니다. 그림판은 <code>done()</code> 에서 멈춰 <b>사용자의 행동(이벤트, event)</b>을 기다리고, 클릭이 일어날 때마다 연결된 함수를 실행합니다. 이런 방식을 <b>이벤트 기반(event-driven) 프로그래밍</b>이라고 하며, 창과 버튼이 있는 거의 모든 프로그램(10장 윈도 프로그래밍, 게임)이 이렇게 동작합니다. 참고로 macOS 의 IDLE 에서는 오른쪽 버튼 번호가 2 로 잡히기도 하므로, 맥에서 오른쪽 클릭이 안 되면 번호를 바꿔 보세요.' },
          { type: 'p', html: '클릭하지 않고도 함수가 잘 만들어졌는지 확인할 수 있습니다. 클릭에 연결한 함수도 결국 <b>평범한 함수</b>이므로 좌표를 직접 넣어 호출하면 됩니다. <code>random.seed(7)</code> 은 난수가 매번 같은 순서로 나오게 고정하는 명령입니다.' },
          { type: 'code', title: '추가 예제. 클릭 대신 함수를 직접 호출해 확인하기', code: `import turtle
import random

## 함수 선언 부분 ##
def screenLeftClick(x, y) :
    global r, g, b
    turtle.pencolor((r, g, b))
    turtle.pendown()
    turtle.goto(x, y)

def screenRightClick(x, y) :
    turtle.penup()
    turtle.goto(x, y)

def screenMidClick(x, y) :
    global r, g, b
    tSize = random.randrange(1, 10)
    turtle.shapesize(tSize)
    r = random.random()
    g = random.random()
    b = random.random()
    print("거북이 크기 :", tSize)

## 변수 선언 부분 ##
pSize = 10
r, g, b = 0.0, 0.0, 0.0

## 메인 코드 부분 ##
random.seed(7)
turtle.shape('turtle')
turtle.pensize(pSize)
screenLeftClick(150, 100)      # 왼쪽 클릭한 것처럼
screenMidClick(0, 0)           # 가운데 클릭한 것처럼
screenLeftClick(-150, 100)
screenRightClick(-150, -100)   # 오른쪽 클릭한 것처럼
screenMidClick(0, 0)
screenLeftClick(150, -100)
print("새 펜 색 :", round(r, 2), round(g, 2), round(b, 2))
turtle.done()`,
            expect: `거북이 크기 : 6
거북이 크기 : 9
새 펜 색 : 0.09 0.58 0.91`,
            desc: '검은 선 → (가운데 클릭) → 새 색의 선 → (선 없이 이동) → (가운데 클릭) → 또 다른 색의 선이 그려집니다. <code>round(값, 2)</code> 는 소수점 둘째 자리까지 반올림합니다.' },

          { type: 'h', text: '한 걸음 더 ① — 이벤트 기반 프로그램의 구조' },
          { type: 'p', html: '계산기와 그림판은 <b>프로그램이 흘러가는 방식 자체</b>가 다릅니다. 계산기는 위에서 아래로 한 번 실행되고 끝나지만, 그림판은 <code>done()</code> 에서 멈춰 <b>사용자가 무언가 하기를 기다립니다</b>. 이 기다림 속에서 클릭 · 키 입력 같은 <b>이벤트(event)</b>가 생기면, 파이썬이 우리가 등록해 둔 함수를 대신 호출해 줍니다.' },
          { type: 'figure', html: SVG_EVENT, caption: '순차 실행(계산기)과 이벤트 기반(그림판)의 차이 — 창을 닫을 때까지 “기다림 ↔ 함수 실행”이 반복된다' },
          { type: 'list', ordered: true, items: [
            '<b>등록</b> — <code>onscreenclick(screenLeftClick, 1)</code> 처럼 “이 일이 생기면 이 함수를 불러 달라”고 미리 알려 둡니다. 이때 넘기는 함수를 <b>콜백(callback) 함수</b>라고 합니다.',
            '<b>대기</b> — <code>done()</code>(또는 <code>mainloop()</code>)에 들어가면 프로그램은 그 줄에서 멈춘 채 이벤트를 기다립니다. 이것을 <b>이벤트 루프(event loop)</b>라고 합니다.',
            '<b>호출</b> — 클릭이 일어나면 파이썬이 <b>좌표를 넣어</b> 콜백을 호출합니다. 콜백이 끝나면 다시 대기 상태로 돌아갑니다.',
            '<b>종료</b> — 창을 닫아야 이벤트 루프가 끝나고 <code>done()</code> 다음 줄로 넘어갑니다.'
          ] },
          { type: 'callout', kind: 'more', title: '📘 done() · mainloop() · exitonclick()', html: '<ul><li><code>turtle.done()</code> 과 <code>turtle.mainloop()</code> 는 <b>같은 일</b>을 합니다(이름만 다릅니다). tkinter · pygame 등 창을 쓰는 모든 도구에 비슷한 함수가 있습니다.</li><li><code>turtle.exitonclick()</code> 은 “아무 데나 클릭하면 창을 닫는다”는 뜻이라, 클릭으로 그림을 그리는 이 프로그램과는 <b>궁합이 맞지 않습니다</b>.</li><li>콜백 안에서 <b>오래 걸리는 일</b>(긴 반복문, <code>time.sleep()</code>)을 하면 그동안 창이 멈춘 것처럼 보입니다. 이벤트 루프가 그 시간 동안 다른 이벤트를 받지 못하기 때문입니다. 애니메이션은 <code>ontimer()</code> 로 조금씩 나눠서 처리합니다.</li></ul>' },
          { type: 'code', title: '추가 예제. ontimer() 로 스스로 움직이는 거북이', code: `import turtle

## 함수 선언 부분 ##
def moveStep() :
    """한 칸 움직이고, 8번이 안 됐으면 자기 자신을 다시 예약한다."""
    global count
    turtle.forward(40)
    turtle.left(45)
    count = count + 1
    if count < 8 :
        turtle.ontimer(moveStep, 200)

## 변수 선언 부분 ##
count = 0

## 메인 코드 부분 ##
turtle.title('타이머로 움직이기')
turtle.shape('turtle')
turtle.ontimer(moveStep, 200)   # 0.2초 뒤에 moveStep 을 한 번 호출
turtle.done()`,
            desc: '<code>ontimer(함수, 밀리초)</code> 는 “정해진 시간 뒤에 이 함수를 한 번 불러 달라”고 예약합니다. 함수 끝에서 자기 자신을 다시 예약하면 <b>반복 애니메이션</b>이 됩니다. <code>while</code> 로 계속 도는 대신 이렇게 나눠서 처리해야 그동안에도 클릭 같은 다른 이벤트를 받을 수 있습니다.' },

          { type: 'h', text: '한 걸음 더 ② — random 모듈 제대로 쓰기' },
          { type: 'p', html: '그림판은 색과 크기를 무작위로 정합니다. <code>random</code> 모듈에는 이 밖에도 쓸모 있는 함수가 많습니다. 자주 쓰는 것만 한 번에 확인해 봅시다.' },
          { type: 'table', head: ['함수', '돌려주는 것', '예'], rows: [
            ['<code>random.random()</code>', '0.0 이상 1.0 <b>미만</b>의 실수', 'RGB 색 값'],
            ['<code>random.randrange(1, 10)</code>', '1 ~ 9 의 정수 (끝 미포함)', '거북이 크기'],
            ['<code>random.randint(1, 10)</code>', '1 ~ 10 의 정수 (끝 <b>포함</b>)', '주사위 눈'],
            ['<code>random.uniform(0, 1)</code>', '범위 안의 실수', '임의의 각도 · 속도'],
            ['<code>random.choice(목록)</code>', '목록에서 하나를 고름', '색 팔레트에서 색 고르기'],
            ['<code>random.sample(범위, 개수)</code>', '겹치지 않게 여러 개', '로또 번호 6개'],
            ['<code>random.shuffle(목록)</code>', '목록의 순서를 섞음 (돌려주지 않음)', '카드 섞기']
          ], caption: '자주 쓰는 random 함수 — 끝 숫자를 포함하는지 아닌지가 서로 다릅니다' },
          { type: 'code', title: '추가 예제. random 함수 모아 보기 (seed 로 결과 고정)', code: `import random

random.seed(5)                      # 씨앗을 고정하면 실행할 때마다 같은 결과

print("0.0 ~ 1.0 실수 :", random.random())
print("1 ~ 9 정수 :", random.randrange(1, 10))
print("1 ~ 10 정수 :", random.randint(1, 10))
print("색 하나 고르기 :", random.choice(['red', 'green', 'blue']))
print("로또 번호 :", random.sample(range(1, 46), 6))

colors = ['red', 'green', 'blue']
random.shuffle(colors)
print("섞은 결과 :", colors)`,
            expect: `0.0 ~ 1.0 실수 : 0.6229016948897019
1 ~ 9 정수 : 6
1 ~ 10 정수 : 9
색 하나 고르기 : red
로또 번호 : [30, 16, 42, 4, 11, 8]
섞은 결과 : ['red', 'blue', 'green']`,
            desc: '<code>random.seed(5)</code> 줄을 지우고 실행하면 매번 다른 결과가 나옵니다. <code>shuffle()</code> 은 목록 <b>자체를 섞고</b> 아무것도 돌려주지 않으므로 <code>colors = random.shuffle(colors)</code> 라고 쓰면 안 됩니다(None 이 들어갑니다).' },
          { type: 'callout', kind: 'more', title: '📘 난수의 씨앗(seed)과 “진짜 무작위”', html: '컴퓨터가 만드는 난수는 사실 <b>계산으로 만들어 낸 가짜 난수(의사 난수)</b>입니다. 시작값인 <b>씨앗(seed)</b> 이 같으면 언제나 같은 순서로 나오죠. 그래서 <code>random.seed(5)</code> 를 쓰면 <b>결과를 재현</b>할 수 있습니다 — 게임 버그를 다시 만들어 보거나, 수업에서 같은 화면을 보여 줄 때 아주 유용합니다. 씨앗을 정하지 않으면 현재 시각 등을 이용해 매번 다른 값에서 시작합니다.<br>주의: <code>random</code> 은 <b>비밀번호나 보안용으로 쓰면 안 됩니다</b>. 그럴 때는 <code>secrets</code> 모듈을 씁니다.' },
          { type: 'code', title: '추가 예제. 임의의 색 점 200개 — tracer 로 한 번에', code: `import turtle
import random

## 변수 선언 부분 ##
myT = None

## 메인 코드 부분 ##
turtle.setup(640, 520)
turtle.tracer(0)

myT = turtle.Turtle()
myT.hideturtle()
myT.penup()

for i in range(0, 200) :
    x = random.randrange(-300, 301)
    y = random.randrange(-240, 241)
    size = random.randrange(8, 40)
    myT.goto(x, y)
    myT.dot(size, (random.random(), random.random(), random.random()))

turtle.update()
turtle.done()`,
            desc: '<code>tracer(0)</code> 이 없으면 점 200개가 하나씩 찍히느라 한참 걸립니다. <code>dot(지름, 색)</code> 은 현재 위치에 점을 찍습니다. 실행할 때마다 다른 그림이 나오니 여러 번 실행해 보세요.' },

          { type: 'h', text: '한 걸음 더 ③ — 키보드와 대화상자까지 쓰기' },
          { type: 'p', html: '마우스 말고 <b>키보드</b>도 이벤트를 만듭니다. <code>turtle.onkey(함수, \'키이름\')</code> 으로 등록하고, 마지막에 <code>turtle.listen()</code> 을 부르면 창이 키 입력을 받기 시작합니다(<code>listen()</code> 을 빠뜨리면 아무 반응이 없습니다). 키에 연결하는 함수는 좌표를 받지 않으므로 <b>매개변수가 없습니다</b>.' },
          { type: 'table', head: ['등록', '언제 호출되나', '콜백의 매개변수'], rows: [
            ['<code>onscreenclick(함수, 1)</code>', '창을 마우스로 클릭할 때', '<code>(x, y)</code> 클릭 좌표'],
            ['<code>onkey(함수, \'c\')</code>', 'c 키를 눌렀다 뗄 때', '없음'],
            ['<code>onkeypress(함수, \'Up\')</code>', '↑ 키를 누르는 순간', '없음'],
            ['<code>ontimer(함수, 500)</code>', '0.5초 뒤 한 번', '없음']
          ], caption: '이벤트를 등록하는 함수들 — 모두 “함수 이름만” 넘긴다는 점이 같습니다' },
          { type: 'code', title: '추가 예제. 이름을 묻고 키보드로 조작하기', code: `import turtle

## 함수 선언 부분 ##
def keyClear() :
    """그림을 모두 지운다."""
    turtle.clear()
    print("지웠습니다.")

def keyUp() :
    """위로 50 이동한다."""
    turtle.setheading(90)
    turtle.forward(50)

## 메인 코드 부분 ##
turtle.setup(600, 400)
name = turtle.textinput('이름', '이름을 입력하세요 :')
turtle.title(str(name) + ' 님의 그림판')   # 취소하면 None 이므로 str() 로 감싼다

turtle.shape('turtle')
turtle.onkey(keyClear, 'c')
turtle.onkey(keyUp, 'Up')
turtle.listen()                 # 이 줄이 있어야 키 입력을 받는다
turtle.done()`, dialogs: ['홍길동'],
            desc: '<code>textinput(제목, 질문)</code> 은 작은 입력 창을 띄워 글자를 받아 옵니다(취소하면 <code>None</code>). 실행한 뒤 <b>거북이 창을 한 번 클릭해 선택하고</b> <kbd>c</kbd> 나 <kbd>↑</kbd> 를 눌러 보세요. 키 이름은 소문자 한 글자, 또는 <code>\'Up\'</code>, <code>\'Down\'</code>, <code>\'space\'</code>, <code>\'Return\'</code> 처럼 씁니다.' },
          { type: 'callout', kind: 'more', title: '📘 여기서 배운 것이 이어지는 곳', html: '“등록해 두고 기다리다가, 이벤트가 오면 함수가 불린다”는 구조는 파이썬만의 이야기가 아닙니다. 웹 페이지의 버튼(자바스크립트), 스마트폰 앱, 10장에서 배울 <b>tkinter 윈도 프로그래밍</b>, 게임 라이브러리 <b>pygame</b> 이 모두 같은 방식으로 동작합니다. 지금 만든 32줄짜리 그림판이 그 모든 것의 축소판인 셈입니다.' }
        ],
        practice: [
          {
            title: '실습 2-20. 클릭한 좌표 확인하기',
            level: 1,
            desc: '<p>거북이 창을 <b>왼쪽 버튼으로 클릭</b>하면 클릭한 좌표를 콘솔에 출력하는 프로그램을 만드세요. 창의 네 귀퉁이와 한가운데를 눌러 좌표가 어떻게 변하는지 확인해 보세요.</p><pre>클릭한 곳 : 120.0 -85.0</pre>',
            hint: '클릭에 연결할 함수는 <code>def clickPrint(x, y) :</code> 처럼 매개변수 두 개를 받아야 합니다. 등록은 <code>turtle.onscreenclick(clickPrint, 1)</code> — <b>괄호 없이 이름만</b> 넘깁니다.',
            starter: `import turtle

## 함수 선언 부분 ##
def clickPrint(x, y) :
    """클릭한 좌표를 콘솔에 출력한다."""
    # TODO: x, y 출력
    pass

## 메인 코드 부분 ##
turtle.title('클릭 좌표 확인')
turtle.shape('turtle')
# TODO: 왼쪽 버튼에 clickPrint 연결

turtle.done()
`,
            solution: `import turtle

## 함수 선언 부분 ##
def clickPrint(x, y) :
    """클릭한 좌표를 콘솔에 출력한다."""
    print("클릭한 곳 :", x, y)

## 메인 코드 부분 ##
turtle.title('클릭 좌표 확인')
turtle.shape('turtle')
turtle.onscreenclick(clickPrint, 1)

turtle.done()
`
          },
          {
            title: '실습 2-21. 임의의 색으로 점 30개 찍기',
            level: 1,
            desc: '<p>화면 아무 곳에나 <b>임의의 위치 · 임의의 색</b>으로 지름 20인 점 30개를 찍으세요. 실행할 때마다 다른 그림이 나와야 합니다.</p>',
            hint: '위치는 <code>random.randrange(-250, 251)</code>, 색은 <code>(random.random(), random.random(), random.random())</code>. 점은 <code>myT.dot(20, 색)</code> 으로 찍고, 이동할 때 선이 생기지 않도록 <code>penup()</code> 을 먼저 해 두세요.',
            starter: `import turtle
import random

## 변수 선언 부분 ##
myT = None

## 메인 코드 부분 ##
myT = turtle.Turtle()
myT.hideturtle()
myT.penup()

for i in range(0, 30) :
    # TODO: 임의의 x, y 로 이동해 임의의 색 점 찍기
    pass

turtle.done()
`,
            solution: `import turtle
import random

## 변수 선언 부분 ##
myT = None

## 메인 코드 부분 ##
myT = turtle.Turtle()
myT.hideturtle()
myT.penup()

for i in range(0, 30) :
    x = random.randrange(-250, 251)
    y = random.randrange(-200, 201)
    myT.goto(x, y)
    myT.dot(20, (random.random(), random.random(), random.random()))

turtle.done()
`
          },
          {
            title: 'SELF STUDY 2-1. 왼쪽 버튼에 가운데 버튼 기능 합치기',
            level: 2,
            desc: '<p>터틀 그래픽 프로그램(Code02-07)을 수정해서 마우스 왼쪽 버튼과 가운데 버튼의 기능을 통합해 보세요. 즉 <b>마우스 왼쪽 버튼만 눌러도</b> 임의의 색상이 지정되고 거북이의 크기가 바뀌면서 선이 그려지도록 합니다.</p>',
            hint: '<code>screenMidClick()</code> 의 내용(크기 · 색 무작위)을 <code>screenLeftClick()</code> 의 <b>앞부분</b>으로 옮기고, 가운데 버튼 연결은 지웁니다.',
            starter: `import turtle
import random

## 함수 선언 부분 ##
def screenLeftClick(x, y) :
    global r, g, b
    # TODO: 거북이 크기와 r, g, b 를 임의로 정하기
    turtle.pencolor((r, g, b))
    turtle.pendown()
    turtle.goto(x, y)

def screenRightClick(x, y) :
    turtle.penup()
    turtle.goto(x, y)

## 변수 선언 부분 ##
pSize = 10
r, g, b = 0.0, 0.0, 0.0

## 메인 코드 부분 ##
turtle.title('거북이로 그림 그리기')
turtle.shape('turtle')
turtle.pensize(pSize)

turtle.onscreenclick(screenLeftClick, 1)
turtle.onscreenclick(screenRightClick, 3)

turtle.done()
`,
            solution: `import turtle
import random

## 함수 선언 부분 ##
def screenLeftClick(x, y) :
    global r, g, b
    tSize = random.randrange(1, 10)
    turtle.shapesize(tSize)
    r = random.random()
    g = random.random()
    b = random.random()
    turtle.pencolor((r, g, b))
    turtle.pendown()
    turtle.goto(x, y)

def screenRightClick(x, y) :
    turtle.penup()
    turtle.goto(x, y)

## 변수 선언 부분 ##
pSize = 10
r, g, b = 0.0, 0.0, 0.0

## 메인 코드 부분 ##
turtle.title('거북이로 그림 그리기')
turtle.shape('turtle')
turtle.pensize(pSize)

turtle.onscreenclick(screenLeftClick, 1)
turtle.onscreenclick(screenRightClick, 3)

turtle.done()
`
          },
          {
            title: '실습 2-22. 클릭한 곳에 점 찍기',
            level: 2,
            desc: '<p>Code02-07 의 오른쪽 클릭 기능을 바꿔서, 오른쪽 버튼을 누르면 선 없이 이동한 뒤 그 자리에 <b>지름 30 인 점</b>을 현재 색 <code>(r, g, b)</code> 로 찍도록 하세요.</p>',
            hint: '<code>turtle.dot(지름, 색)</code> 으로 점을 찍습니다. 전역 변수 r, g, b 는 읽기만 하므로 global 이 없어도 됩니다.',
            starter: `import turtle
import random

## 함수 선언 부분 ##
def screenLeftClick(x, y) :
    global r, g, b
    turtle.pencolor((r, g, b))
    turtle.pendown()
    turtle.goto(x, y)

def screenRightClick(x, y) :
    turtle.penup()
    turtle.goto(x, y)
    # TODO: 지름 30 인 점을 (r, g, b) 색으로 찍기

def screenMidClick(x, y) :
    global r, g, b
    tSize = random.randrange(1, 10)
    turtle.shapesize(tSize)
    r = random.random()
    g = random.random()
    b = random.random()

## 변수 선언 부분 ##
pSize = 10
r, g, b = 0.0, 0.0, 0.0

## 메인 코드 부분 ##
turtle.title('거북이로 그림 그리기')
turtle.shape('turtle')
turtle.pensize(pSize)

turtle.onscreenclick(screenLeftClick, 1)
turtle.onscreenclick(screenMidClick, 2)
turtle.onscreenclick(screenRightClick, 3)

turtle.done()
`,
            solution: `import turtle
import random

## 함수 선언 부분 ##
def screenLeftClick(x, y) :
    global r, g, b
    turtle.pencolor((r, g, b))
    turtle.pendown()
    turtle.goto(x, y)

def screenRightClick(x, y) :
    turtle.penup()
    turtle.goto(x, y)
    turtle.dot(30, (r, g, b))

def screenMidClick(x, y) :
    global r, g, b
    tSize = random.randrange(1, 10)
    turtle.shapesize(tSize)
    r = random.random()
    g = random.random()
    b = random.random()

## 변수 선언 부분 ##
pSize = 10
r, g, b = 0.0, 0.0, 0.0

## 메인 코드 부분 ##
turtle.title('거북이로 그림 그리기')
turtle.shape('turtle')
turtle.pensize(pSize)

turtle.onscreenclick(screenLeftClick, 1)
turtle.onscreenclick(screenMidClick, 2)
turtle.onscreenclick(screenRightClick, 3)

turtle.done()
`
          },
          {
            title: '실습 2-23. 키보드로 지우고 펜 두께 바꾸기',
            level: 3,
            desc: '<p>Code02-07 에 키보드 기능을 추가하세요.</p><ul><li><kbd>c</kbd> 키: 그린 그림을 모두 지운다 (<code>turtle.clear()</code>)</li><li><kbd>space</kbd> 키: 펜 두께 <code>pSize</code> 를 1 ~ 20 중 임의의 값으로 바꾼다</li></ul><p>(거북이 창을 한 번 클릭해 선택한 뒤 키를 눌러야 합니다)</p>',
            hint: '키에 함수를 연결하는 것은 <code>turtle.onkey(함수명, \'c\')</code>, <code>turtle.onkey(함수명, \'space\')</code> 이고, 마지막에 <code>turtle.listen()</code> 으로 키 입력을 받기 시작합니다. 키 함수는 매개변수가 없습니다. pSize 를 바꾸므로 <code>global pSize</code> 가 필요합니다.',
            starter: `import turtle
import random

## 함수 선언 부분 ##
def screenLeftClick(x, y) :
    global r, g, b
    turtle.pencolor((r, g, b))
    turtle.pendown()
    turtle.goto(x, y)

def screenRightClick(x, y) :
    turtle.penup()
    turtle.goto(x, y)

def screenMidClick(x, y) :
    global r, g, b
    tSize = random.randrange(1, 10)
    turtle.shapesize(tSize)
    r = random.random()
    g = random.random()
    b = random.random()

# TODO: keyC() 함수 — 그림 지우기
# TODO: keySpace() 함수 — 펜 두께를 임의로

## 변수 선언 부분 ##
pSize = 10
r, g, b = 0.0, 0.0, 0.0

## 메인 코드 부분 ##
turtle.title('거북이로 그림 그리기')
turtle.shape('turtle')
turtle.pensize(pSize)

turtle.onscreenclick(screenLeftClick, 1)
turtle.onscreenclick(screenMidClick, 2)
turtle.onscreenclick(screenRightClick, 3)
# TODO: 키 연결과 listen()

turtle.done()
`,
            solution: `import turtle
import random

## 함수 선언 부분 ##
def screenLeftClick(x, y) :
    global r, g, b
    turtle.pencolor((r, g, b))
    turtle.pendown()
    turtle.goto(x, y)

def screenRightClick(x, y) :
    turtle.penup()
    turtle.goto(x, y)

def screenMidClick(x, y) :
    global r, g, b
    tSize = random.randrange(1, 10)
    turtle.shapesize(tSize)
    r = random.random()
    g = random.random()
    b = random.random()

def keyC() :
    turtle.clear()

def keySpace() :
    global pSize
    pSize = random.randrange(1, 21)
    turtle.pensize(pSize)

## 변수 선언 부분 ##
pSize = 10
r, g, b = 0.0, 0.0, 0.0

## 메인 코드 부분 ##
turtle.title('거북이로 그림 그리기')
turtle.shape('turtle')
turtle.pensize(pSize)

turtle.onscreenclick(screenLeftClick, 1)
turtle.onscreenclick(screenMidClick, 2)
turtle.onscreenclick(screenRightClick, 3)
turtle.onkey(keyC, 'c')
turtle.onkey(keySpace, 'space')
turtle.listen()

turtle.done()
`
          },
          {
            title: '🚀 프로젝트 2-4. 나만의 그림판 완성하기',
            level: 3,
            desc: '<p>Code02-07 을 바탕으로 <b>실제로 쓸 만한 그림판</b>을 만드세요. 마우스와 키보드를 모두 사용합니다.</p><p><b>요구 사항</b></p><ol><li><b>마우스 왼쪽</b> 클릭 — 현재 색 · 현재 두께로 클릭한 곳까지 선을 그린다</li><li><b>마우스 오른쪽</b> 클릭 — 선을 그리지 않고 이동만 한다</li><li><b>마우스 가운데</b> 클릭 — 펜 색을 임의의 색으로 바꾼다</li><li><b>키 1 · 2 · 3</b> — 펜 색을 빨강 · 초록 · 파랑으로 고정한다</li><li><b>키 ↑ · ↓</b> — 펜 두께를 1 ~ 20 사이에서 1씩 늘리고 줄인다 (범위를 벗어나지 않게 한다)</li><li><b>키 c</b> — 그림을 모두 지우고 거북이를 가운데로 되돌린다</li><li><b>키 s</b> — 현재 펜 두께와 색을 콘솔에 출력한다 (예: <code>펜 두께 : 10 / 색 : (1.0, 0.0, 0.0)</code>)</li><li>펜 두께 · 색은 <b>전역 변수</b>로 두고, 콜백 안에서 바꿀 때 <code>global</code> 을 선언한다</li><li>키 입력을 받으려면 <code>turtle.listen()</code> 을 잊지 말 것</li></ol><p><b>실행 방법</b> — 거북이 창을 한 번 클릭해 선택한 뒤 키를 누르세요.</p><p><b>더 해 보기</b> — ① 키 <kbd>d</kbd> 로 현재 위치에 점(<code>dot</code>)을 찍어 보세요. ② 색 목록을 만들고 <code>random.choice()</code> 로 고르게 해 보세요. ③ <code>turtle.write()</code> 로 화면 위쪽에 현재 두께를 표시해 보세요. ④ 09장을 배운 뒤 “지금까지 클릭한 좌표를 리스트에 모아 두었다가 다시 그리기(재생)”에 도전해 보세요.</p>',
            hint: '색을 바꾸는 함수가 여러 개(가운데 클릭 · 키 1 · 2 · 3)이므로, <code>setColor(newR, newG, newB)</code> 처럼 <b>색을 정하는 함수 하나</b>를 만들어 두고 나머지는 그 함수를 부르게 하면 코드가 훨씬 짧아집니다. 두께 조절은 <code>if penSize &lt; 20 :</code> 처럼 범위를 확인한 뒤 <code>+= 1</code> 하세요.',
            starter: `import turtle
import random

## 함수 선언 부분 ##
def screenLeftClick(x, y) :
    """클릭한 곳까지 선을 그리며 이동한다."""
    turtle.pencolor((r, g, b))
    turtle.pendown()
    turtle.goto(x, y)

def screenRightClick(x, y) :
    """선을 그리지 않고 이동한다."""
    turtle.penup()
    turtle.goto(x, y)

def screenMidClick(x, y) :
    """펜 색을 임의의 색으로 바꾼다."""
    global r, g, b
    # TODO: r, g, b 를 임의의 값으로

def setColor(newR, newG, newB) :
    """펜 색을 정한다."""
    global r, g, b
    r, g, b = newR, newG, newB

# TODO: keyRed / keyGreen / keyBlue 함수
# TODO: keyUp / keyDown — 펜 두께 1 ~ 20
# TODO: keyClear — 지우고 가운데로
# TODO: keyStatus — 현재 상태 출력

## 변수 선언 부분 ##
penSize = 10
r, g, b = 0.0, 0.0, 0.0

## 메인 코드 부분 ##
turtle.title('나만의 그림판')
turtle.shape('turtle')
turtle.pensize(penSize)

turtle.onscreenclick(screenLeftClick, 1)
turtle.onscreenclick(screenMidClick, 2)
turtle.onscreenclick(screenRightClick, 3)
# TODO: 키 연결과 listen()

turtle.done()
`,
            solution: `import turtle
import random

## 함수 선언 부분 ##
def screenLeftClick(x, y) :
    """클릭한 곳까지 현재 색 · 두께로 선을 그린다."""
    turtle.pencolor((r, g, b))
    turtle.pendown()
    turtle.goto(x, y)

def screenRightClick(x, y) :
    """선을 그리지 않고 이동한다."""
    turtle.penup()
    turtle.goto(x, y)

def screenMidClick(x, y) :
    """펜 색을 임의의 색으로 바꾼다."""
    setColor(random.random(), random.random(), random.random())

def setColor(newR, newG, newB) :
    """펜 색을 정한다."""
    global r, g, b
    r, g, b = newR, newG, newB
    turtle.pencolor((r, g, b))

def keyRed() :
    setColor(1.0, 0.0, 0.0)

def keyGreen() :
    setColor(0.0, 0.7, 0.0)

def keyBlue() :
    setColor(0.0, 0.0, 1.0)

def keyUp() :
    """펜 두께를 1 늘린다 (최대 20)."""
    global penSize
    if penSize < 20 :
        penSize += 1
        turtle.pensize(penSize)

def keyDown() :
    """펜 두께를 1 줄인다 (최소 1)."""
    global penSize
    if penSize > 1 :
        penSize -= 1
        turtle.pensize(penSize)

def keyClear() :
    """그림을 지우고 거북이를 가운데로."""
    turtle.clear()
    turtle.penup()
    turtle.home()

def keyStatus() :
    """현재 펜 두께와 색을 출력한다."""
    print("펜 두께 :", penSize, "/ 색 :", (round(r, 2), round(g, 2), round(b, 2)))

## 변수 선언 부분 ##
penSize = 10
r, g, b = 0.0, 0.0, 0.0

## 메인 코드 부분 ##
turtle.title('나만의 그림판')
turtle.shape('turtle')
turtle.pensize(penSize)

turtle.onscreenclick(screenLeftClick, 1)
turtle.onscreenclick(screenMidClick, 2)
turtle.onscreenclick(screenRightClick, 3)

turtle.onkey(keyRed, '1')
turtle.onkey(keyGreen, '2')
turtle.onkey(keyBlue, '3')
turtle.onkey(keyUp, 'Up')
turtle.onkey(keyDown, 'Down')
turtle.onkey(keyClear, 'c')
turtle.onkey(keyStatus, 's')
turtle.listen()

turtle.done()
`
          }
        ],
        quiz: [
          { q: '<code>turtle.onscreenclick(screenRightClick, 3)</code> 의 의미는?', options: ['screenRightClick 을 3번 실행한다', '마우스 오른쪽 버튼으로 창을 클릭하면 screenRightClick 을 호출한다', '3초 뒤에 screenRightClick 을 호출한다', '거북이를 3 배 크기로 만든다'], answer: 1, explain: '번호 1은 왼쪽, 2는 가운데, 3은 오른쪽 버튼입니다.' },
          { q: '클릭에 연결하는 함수가 <code>def screenLeftClick(x, y) :</code> 처럼 매개변수 x, y 를 갖는 이유는?', options: ['x, y 를 전역 변수로 만들기 위해', '클릭한 지점의 좌표를 넘겨받기 위해', '거북이의 크기를 정하기 위해', '특별한 이유 없이 관습이다'], answer: 1, explain: '클릭하면 파이썬이 클릭한 지점의 좌표를 x, y 로 넘겨주며 함수를 호출합니다.' },
          { q: '<code>random.randrange(1, 10)</code> 이 돌려줄 수 <b>없는</b> 값은?', options: ['1', '5', '9', '10'], answer: 3, explain: 'randrange(1, 10) 은 1 이상 10 미만, 즉 1 ~ 9 중 하나입니다.' },
          { q: '<code>screenMidClick()</code> 에서 <code>global r, g, b</code> 를 빼면 어떻게 되는가?', options: ['아무 차이가 없다', '함수 안의 r, g, b 가 지역 변수가 되어 다음 왼쪽 클릭의 선 색이 바뀌지 않는다', '거북이 크기가 바뀌지 않는다', '가운데 버튼 클릭이 인식되지 않는다'], answer: 1, explain: '대입하는 변수는 global 이 없으면 함수 안의 지역 변수가 되어, 전역 r, g, b 는 계속 0.0 (검정) 입니다.' },
          { q: '펜을 들어 선을 그리지 않고 이동하게 하는 함수는?', options: ['turtle.pendown()', 'turtle.penup()', 'turtle.pensize(0)', 'turtle.done()'], answer: 1, explain: 'penup() 은 펜을 들고, pendown() 은 펜을 내립니다.' },
          { q: '<code>turtle.onkey(keyClear, \'c\')</code> 로 키를 연결했는데 c 를 눌러도 아무 일이 없습니다. 가장 흔한 원인은?', options: ['onkey 대신 onscreenclick 을 써야 한다', '<code>turtle.listen()</code> 을 부르지 않았다', 'keyClear 함수에 x, y 매개변수가 없다', 'c 는 예약된 키라서 쓸 수 없다'], answer: 1, explain: '키 이벤트는 <code>listen()</code> 을 불러야 받기 시작합니다. (창을 한 번 클릭해 선택하는 것도 필요합니다) 키 콜백은 좌표를 받지 않으므로 매개변수가 없는 것이 맞습니다.' }
        ],
        slides: [
          { layout: 'title', title: '[프로그램 2] 마우스로 그리는 터틀 그래픽', subtitle: 'Chapter 02 · Section 05 (2)', badge: '02-5',
            notes: '<p><b>[도입 2분]</b> 완성된 Code02-07 을 먼저 실행해 직접 그림을 그려 보입니다(“파이썬 꿀잼!” 같은 글자를 써 보면 좋습니다). “오늘 끝나면 여러분도 이걸 만들 수 있습니다.”</p>' },
          { layout: 'bullets', title: '구현할 기능 계획', lead: '마우스 버튼 3개에 기능 3개',
            bullets: ['기능 1: <b>왼쪽</b> 클릭 → 클릭한 곳까지 <b>임의의 색으로 선</b>을 그리며 따라옴', '기능 2: <b>오른쪽</b> 클릭 → 선을 그리지 않고 <b>이동만</b>', '기능 3: <b>가운데</b> 클릭 → 거북이 크기를 임의로 확대 · 축소'],
            notes: '<p><b>[2분]</b> 코드를 쓰기 전에 “무엇을 만들지” 먼저 말로 정리하는 습관을 강조합니다(그림 2-20).</p>' },
          { layout: 'diagram', title: '클릭하면 일어나는 일', html: SVG_COORD, caption: '클릭한 좌표가 함수의 x, y 로 전달 → goto(x, y)',
            notes: '<p><b>[3분]</b> 좌표계: 창 가운데가 (0, 0), 오른쪽 +x, 위쪽 +y. 수학 시간의 좌표평면과 같습니다.</p><p>핵심: 우리가 함수를 직접 호출하는 것이 아니라, 클릭하면 파이썬이 좌표를 넣어 호출해 준다.</p>' },
          { layout: 'code', repl: true, title: '필요한 변수 준비', code: 'pSize, tSize = 10, 0\nr, g, b = 0.0, 0.0, 0.0\npSize\nr, g, b',
            points: ['pSize: 선 두께, tSize: 거북이 크기', 'r, g, b: 빨강 · 초록 · 파랑 (0.0 ~ 1.0)', '한 줄로 여러 변수에 대입', '<code>r = 0.0</code> 세 줄과 같음'],
            notes: '<p><b>[3분]</b> 교재는 두 가지 표기(한 줄 / 세 줄)를 모두 보여 줍니다. 한 줄 방식은 파이썬의 편리한 기능입니다.</p><p>RGB: 빛의 삼원색. (1.0, 0.0, 0.0) 빨강, (0, 0, 0) 검정, (1, 1, 1) 흰색.</p>' },
          { layout: 'diagram', title: '마우스 버튼 → 함수 연결', html: SVG_MOUSE, caption: 'turtle.onscreenclick(함수명, 번호) — 1 왼쪽 · 2 가운데 · 3 오른쪽',
            notes: '<p><b>[2분]</b> 버튼 번호가 “왼쪽 1, 가운데 2, 오른쪽 3”으로 왼쪽부터 차례라는 것을 강조합니다(오른쪽이 2 가 아님).</p>' },
          { layout: 'code', title: '기능 1 · 2 구현', code: "import turtle\n\ndef screenLeftClick(x, y) :\n    global r, g, b\n    turtle.pencolor((r, g, b))\n    turtle.pendown()\n    turtle.goto(x, y)\n\ndef screenRightClick(x, y) :\n    turtle.penup()\n    turtle.goto(x, y)\n\nr, g, b = 0.0, 0.0, 0.0\nturtle.shape('turtle')\nturtle.onscreenclick(screenLeftClick, 1)\nturtle.onscreenclick(screenRightClick, 3)\nturtle.done()",
            points: ['pendown → 선 그리며 goto', 'penup → 선 없이 goto', '함수 <b>이름만</b> 넘김 (괄호 ✕)', '실행 후 창을 클릭해 보기'],
            notes: '<p><b>[6분]</b> 실행하고 창을 왼쪽/오른쪽으로 클릭해 보입니다. 아직 색 바꾸는 기능이 없어 선은 검정.</p><p>흔한 실수: <code>onscreenclick(screenLeftClick(), 1)</code> → TypeError (missing x, y). 이름만 넘겨야 “나중에 불러 준다”.</p>' },
          { layout: 'code', run: false, title: '기능 3 구현', code: 'def screenMidClick(x, y) :\n    global r, g, b\n    tSize = random.randrange(1, 10)\n    turtle.shapesize(tSize)\n    r = random.random()\n    g = random.random()\n    b = random.random()',
            points: ['<code>randrange(1, 10)</code> → 1 ~ 9', '<code>random()</code> → 0.0 이상 1.0 미만', '바뀐 r, g, b 는 <b>다음 왼쪽 클릭</b>에 사용', 'r, g, b 에 대입 → <b>global</b> 필수'],
            notes: '<p><b>[5분]</b> 함수 조각이라 단독 실행하지 않습니다(random 을 import 한 완성 코드에서 실행).</p><p>발문: “global r, g, b 를 지우면?” → 함수 안의 r, g, b 는 지역 변수가 되어 전역 색은 계속 검정. 직접 지우고 실행해 확인하면 좋은 실험이 됩니다.</p>' },
          { layout: 'code', title: 'Code02-07 ① 함수 선언 부분', code: "import turtle\nimport random\n\n## 함수 선언 부분 ##\ndef screenLeftClick(x, y) :\n    global r, g, b\n    turtle.pencolor((r, g, b))\n    turtle.pendown()\n    turtle.goto(x, y)\n\ndef screenRightClick(x, y) :\n    turtle.penup()\n    turtle.goto(x, y)\n\ndef screenMidClick(x, y) :\n    global r, g, b\n    tSize = random.randrange(1, 10)\n    turtle.shapesize(tSize)\n    r = random.random()\n    g = random.random()\n    b = random.random()",
            points: ['1~21행: 모듈과 함수 세 개', '함수는 만들어만 둠', '실행해도 창은 아직 안 뜸'],
            notes: '<p><b>[3분]</b> Code02-07 의 앞부분(1~21행)입니다. 이 코드만 실행하면 아무 일도 일어나지 않는다는 것(함수는 호출해야 실행됨)을 다시 확인시킬 수 있습니다.</p>' },
          { layout: 'code', run: false, title: 'Code02-07 ② 변수 선언 · 메인 코드', code: "## 변수 선언 부분 ##\npSize = 10\nr, g, b = 0.0, 0.0, 0.0\n\n## 메인 코드 부분 ##\nturtle.title('거북이로 그림 그리기')\nturtle.shape('turtle')\nturtle.pensize(pSize)\n\nturtle.onscreenclick(screenLeftClick, 1)\nturtle.onscreenclick(screenMidClick, 2)\nturtle.onscreenclick(screenRightClick, 3)\n\nturtle.done()",
            points: ['23~36행', '제목 · 모양 · 펜 두께 설정', '버튼 1 · 2 · 3 에 함수 연결', '<b>전체 실행은 다음 SELF STUDY 정답 또는 문서의 완성 코드로</b>'],
            notes: '<p><b>[4분]</b> 이 슬라이드는 코드 뒷부분만 보여 주는 조각이라 단독 실행하지 않습니다. 전체 프로그램은 학생용 문서의 “[프로그램 2] 완성: Code02-07.py”에서 ▶ 실행하세요.</p><p>실행 후 가운데 클릭 → 왼쪽 클릭 순서로 색이 바뀌는 것을 보여 주세요.</p>' },
          { layout: 'table', title: '표 2-1. Code02-07.py 에 사용된 기타 함수', head: ['함수', '설명'], rows: [['turtle.title(\'제목\')', '윈도창의 제목 설정'], ['turtle.pensize(펜 두께)', '그릴 선의 두께 설정'], ['turtle.onscreenclick(함수명, 번호)', '창을 클릭하면 함수 작동 — 1 왼쪽, 2 가운데, 3 오른쪽 버튼']],
            notes: '<p><b>[2분]</b> 이 밖에 shape, pencolor, pendown/penup, goto, shapesize, done 을 한 번 더 짚어 줍니다.</p><p>“done() 에서 멈춰 클릭을 기다리는” 이벤트 기반 방식이 계산기(위에서 아래로 한 번)와 다르다는 점을 강조하세요.</p>' },
          { layout: 'diagram', title: '한 걸음 더 ① — 이벤트 기반 프로그램', html: SVG_EVENT, caption: '등록 → 대기(done) → 이벤트 발생 → 콜백 실행 → 다시 대기',
            notes: '<p><b>[5분]</b> 이 교시에서 가장 중요한 개념 슬라이드입니다. 계산기와 그림판의 <b>흐름 자체가 다르다</b>는 것을 그림으로 확인시키세요.</p><p>용어 두 개만 남기면 됩니다: <b>콜백</b>(나중에 불릴 함수), <b>이벤트 루프</b>(기다리는 반복). <code>done()</code> 과 <code>mainloop()</code> 는 같은 일을 합니다.</p><p>덧붙일 이야기: 콜백 안에서 오래 걸리는 일을 하면 창이 멈춘 것처럼 보입니다 → 애니메이션은 <code>ontimer()</code> 로 잘게 나눕니다. 10장 tkinter, 게임(pygame), 웹의 버튼도 모두 같은 구조입니다.</p>' },
          { layout: 'code', title: '한 걸음 더 ② — random 모아 보기', code: "import random\n\nrandom.seed(5)\n\nprint(\"0.0 ~ 1.0 실수 :\", random.random())\nprint(\"1 ~ 9 정수 :\", random.randrange(1, 10))\nprint(\"1 ~ 10 정수 :\", random.randint(1, 10))\nprint(\"색 고르기 :\", random.choice(['red', 'green', 'blue']))\nprint(\"로또 번호 :\", random.sample(range(1, 46), 6))\n\ncolors = ['red', 'green', 'blue']\nrandom.shuffle(colors)\nprint(\"섞은 결과 :\", colors)",
            points: ['<code>randrange(1, 10)</code> 끝 미포함 / <code>randint</code> 포함', '<code>choice</code> 하나 고르기 · <code>sample</code> 겹치지 않게', '<code>shuffle</code> 은 목록 자체를 섞음 (돌려주지 않음)', '<code>seed()</code> — 결과를 <b>재현</b>할 수 있다'],
            notes: '<p><b>[4분]</b> seed 를 고정했으므로 교실의 모든 화면에 같은 값이 나옵니다. seed 줄을 지우고 다시 실행해 비교해 보세요.</p><p>자주 하는 실수: <code>colors = random.shuffle(colors)</code> → None 이 들어갑니다. 그리고 random 은 보안용이 아니며, 비밀번호 생성 등에는 <code>secrets</code> 모듈을 씁니다.</p>' },
          { layout: 'quiz', title: '확인 문제', q: '<code>random.randrange(1, 10)</code> 이 돌려줄 수 <b>없는</b> 값은?', options: ['1', '5', '9', '10'], answer: 3, explain: '끝 숫자 10 은 포함되지 않습니다 (1 ~ 9).',
            notes: '<p><b>[2분]</b> range 계열 함수는 “끝 숫자 미포함”이 공통 규칙입니다. 6장 range() 에서도 다시 나옵니다.</p>' },
          { layout: 'practice', title: 'SELF STUDY 2-1', desc: '<p>Code02-07 을 수정해서 <b>왼쪽 버튼만 눌러도</b> 임의의 색상이 지정되고 거북이 크기가 바뀌면서 선이 그려지도록 하세요.</p>',
            starter: "import turtle\nimport random\n\ndef screenLeftClick(x, y) :\n    global r, g, b\n    # TODO: 크기와 색을 임의로\n    turtle.pencolor((r, g, b))\n    turtle.pendown()\n    turtle.goto(x, y)\n\ndef screenRightClick(x, y) :\n    turtle.penup()\n    turtle.goto(x, y)\n\npSize = 10\nr, g, b = 0.0, 0.0, 0.0\nturtle.title('거북이로 그림 그리기')\nturtle.shape('turtle')\nturtle.pensize(pSize)\nturtle.onscreenclick(screenLeftClick, 1)\nturtle.onscreenclick(screenRightClick, 3)\nturtle.done()\n",
            solution: "import turtle\nimport random\n\n## 함수 선언 부분 ##\ndef screenLeftClick(x, y) :\n    global r, g, b\n    tSize = random.randrange(1, 10)\n    turtle.shapesize(tSize)\n    r = random.random()\n    g = random.random()\n    b = random.random()\n    turtle.pencolor((r, g, b))\n    turtle.pendown()\n    turtle.goto(x, y)\n\ndef screenRightClick(x, y) :\n    turtle.penup()\n    turtle.goto(x, y)\n\n## 변수 선언 부분 ##\npSize = 10\nr, g, b = 0.0, 0.0, 0.0\n\n## 메인 코드 부분 ##\nturtle.title('거북이로 그림 그리기')\nturtle.shape('turtle')\nturtle.pensize(pSize)\n\nturtle.onscreenclick(screenLeftClick, 1)\nturtle.onscreenclick(screenRightClick, 3)\n\nturtle.done()\n",
            notes: '<p><b>[10분]</b> 가운데 버튼이 없는 노트북 사용자에게 특히 유용한 수정입니다.</p><p>포인트: 색을 정하는 코드가 pencolor() <b>앞</b>에 와야 그 클릭의 선에 새 색이 적용됩니다. 뒤에 두면 “다음” 선에 적용되는 차이를 실험해 보게 하세요.</p><p>순서 추천: 실습 2-20(좌표 확인) · 2-21(점 30개)으로 몸을 풀고 → SELF STUDY 2-1 → 2-22(점 찍기) → 2-23(키보드 onkey) → 🚀 프로젝트 2-4.</p>' },
          { layout: 'practice', title: '🚀 프로젝트 2-4. 나만의 그림판', desc: '<p>Code02-07 을 확장해 실제로 쓸 만한 그림판을 만드세요.</p><ul><li>왼쪽 = 그리기 · 오른쪽 = 이동 · 가운데 = 임의의 색</li><li>키 <b>1 · 2 · 3</b> = 빨강 · 초록 · 파랑</li><li>키 <b>↑ ↓</b> = 펜 두께 1 ~ 20</li><li>키 <b>c</b> = 지우고 가운데로 · 키 <b>s</b> = 현재 상태 출력</li><li>전역 변수 + <code>global</code>, 마지막에 <code>listen()</code></li></ul>',
            starter: "import turtle\nimport random\n\ndef screenLeftClick(x, y) :\n    turtle.pencolor((r, g, b))\n    turtle.pendown()\n    turtle.goto(x, y)\n\ndef setColor(newR, newG, newB) :\n    global r, g, b\n    r, g, b = newR, newG, newB\n\n# TODO: keyRed/keyGreen/keyBlue, keyUp/keyDown, keyClear, keyStatus\n\npenSize = 10\nr, g, b = 0.0, 0.0, 0.0\nturtle.shape('turtle')\nturtle.pensize(penSize)\nturtle.onscreenclick(screenLeftClick, 1)\n# TODO: 키 연결과 listen()\nturtle.done()\n",
            solution: "import turtle\nimport random\n\ndef screenLeftClick(x, y) :\n    turtle.pencolor((r, g, b))\n    turtle.pendown()\n    turtle.goto(x, y)\n\ndef setColor(newR, newG, newB) :\n    global r, g, b\n    r, g, b = newR, newG, newB\n    turtle.pencolor((r, g, b))\n\ndef keyRed() :\n    setColor(1.0, 0.0, 0.0)\n\ndef keyUp() :\n    global penSize\n    if penSize < 20 :\n        penSize += 1\n        turtle.pensize(penSize)\n\ndef keyStatus() :\n    print(\"펜 두께 :\", penSize, \"/ 색 :\", (r, g, b))\n\npenSize = 10\nr, g, b = 0.0, 0.0, 0.0\nturtle.title('나만의 그림판')\nturtle.shape('turtle')\nturtle.pensize(penSize)\nturtle.onscreenclick(screenLeftClick, 1)\nturtle.onkey(keyRed, '1')\nturtle.onkey(keyUp, 'Up')\nturtle.onkey(keyStatus, 's')\nturtle.listen()\nturtle.done()\n",
            notes: '<p><b>[15분 · 남는 시간은 과제]</b> 이 장의 마무리 프로젝트입니다. 학생용 문서에는 요구 사항 9개와 전체 정답이 들어 있습니다(여기 슬라이드는 일부만 줄인 버전).</p><p>지도 포인트: ① 색을 바꾸는 곳이 네 군데(가운데 클릭 · 키 1 · 2 · 3)이므로 <code>setColor()</code> 함수 하나로 모으게 하세요 — 오늘 배운 “같은 덩어리는 함수로”의 실전입니다. ② 두께를 바꿀 때 범위 확인(1 ~ 20). ③ <code>listen()</code> 을 빠뜨리면 키가 먹지 않습니다.</p><p>완성한 학생에게는 확장 과제: 점 찍기(d), 색 목록 + <code>random.choice()</code>, 화면에 현재 두께 표시.</p>' },
          { layout: 'summary', title: '정리', bullets: ['<code>onscreenclick(함수명, 번호)</code> — 클릭에 함수 연결 (1 왼 · 2 가운데 · 3 오른)', '클릭 함수는 좌표 <code>x, y</code> 를 매개변수로 받음', '<code>pendown</code>/<code>penup</code> + <code>goto(x, y)</code>', '<code>random.random()</code> 0.0~1.0, <code>randrange(1, 10)</code> 1~9', '<b>[프로그램 2] 터틀 그래픽 그림판 완성!</b>'],
            notes: '<p><b>[1분]</b> 2장 전체 정리: 변수 · print · input · int · 파일 저장 · 프로그램 구조 · 이벤트. 다음 장(3장)에서 변수와 데이터형을 본격적으로 배웁니다.</p>' }
        ]
      }
    ]
  });
})();
