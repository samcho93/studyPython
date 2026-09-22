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
    summary: '변수와 print() 로 사칙 연산 계산기를 만들고, 코드를 파일로 저장해 다시 실행하는 방법을 익힌 뒤 input() 으로 값을 입력받도록 확장합니다. 마지막으로 긴 프로그램의 구조(함수 · 변수 · 메인)를 배우고, 마우스 클릭으로 그림을 그리는 터틀 그래픽 프로그램을 완성합니다.',
    goals: [
      '변수가 값을 담는 그릇이며 = 가 대입 연산자임을 설명할 수 있다',
      'print() 함수로 변수의 값과 글자를 함께 출력할 수 있다',
      '여러 줄의 코드를 파일(스크립트)로 작성 · 저장 · 실행 · 수정하는 순서를 설명할 수 있다',
      'input() 과 int() 로 키보드에서 숫자를 입력받아 계산하는 계산기 프로그램을 만들 수 있다',
      '함수 선언 · 변수 선언 · 메인 코드로 나누어 긴 프로그램을 작성하고, 마우스 클릭으로 그림을 그리는 터틀 프로그램을 만들 수 있다'
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
          '+, -, *, / 로 사칙 연산을 하고 나누기 결과가 실수임을 안다'
        ],
        flow: [['도입: 이 장에서 만들 프로그램', 5], ['변수와 대입 연산자', 10], ['더하기 · print() 출력', 12], ['빼기 · 곱하기 · 나누기', 10], ['퀴즈 · 실습', 13]],
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
            desc: '오류 메시지는 <b>아래에서부터</b> 읽습니다. 마지막 줄이 오류의 종류와 이유, 그 위의 <code>line 3</code> 이 오류가 난 위치입니다.' }
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
            title: '실습 2-3. 분을 시간과 분으로 바꾸기',
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
          }
        ],
        quiz: [
          { q: '파이썬에서 <code>a = 100</code> 의 의미로 가장 알맞은 것은?', options: ['a 와 100 이 같은지 비교한다', '100 을 변수 a 에 대입한다', 'a 를 100 번 출력한다', 'a 에서 100 을 뺀다'], answer: 1, explain: '<code>=</code> 는 대입 연산자로, 오른쪽 값을 왼쪽 변수에 넣습니다. 같은지 비교할 때는 <code>==</code> 를 씁니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>a = 100\nb = 50\nresult = a + b\nprint(a, \'+\', b, \'=\', result)</code></pre>', options: ['a + b = result', '100+50=150', '100 + 50 = 150', '150'], answer: 2, explain: '변수는 값으로, 따옴표 안은 글자 그대로 출력되고 쉼표 사이에는 빈칸이 한 칸씩 들어갑니다.' },
          { q: '다음 코드를 실행한 뒤 변수 <code>a</code> 의 값은?<pre><code>a = 100\nb = 50\nresult = a - b</code></pre>', options: ['50', '100', '150', '0'], answer: 1, explain: '값을 꺼내 계산해도 원래 변수의 값은 변하지 않습니다. a 는 그대로 100 입니다.' },
          { q: '<code>print(100 / 50)</code> 의 출력 결과는?', options: ['2', '2.0', '0.5', '오류'], answer: 1, explain: '파이썬의 <code>/</code> 는 나누어떨어져도 항상 실수를 돌려줍니다.' },
          { q: '다음 중 <b>print() 처럼 이름 뒤에 괄호가 붙어 어떤 기능을 수행하는 것</b>을 무엇이라 하는가?', options: ['변수', '연산자', '함수', '주석'], answer: 2, explain: '미리 만들어진(또는 직접 만든) 기능을 함수라고 하며, 이름 뒤에 괄호를 붙여 사용합니다.' }
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
            notes: '<p><b>[2분]</b> 아래 두 줄(//, %)은 강의자료 밖의 보충입니다. 실습 2-3 에서 사용합니다.</p><p>0 으로 나누면 ZeroDivisionError 가 난다는 것도 짧게 언급하세요.</p>' },
          { layout: 'quiz', title: '확인 문제', q: '다음 코드의 출력은?<pre><code>a = 100\nb = 50\nresult = a + b\nprint(a, \'+\', b, \'=\', result)</code></pre>', options: ['a + b = result', '100+50=150', '100 + 50 = 150', '150'], answer: 2, explain: '변수는 값으로, 따옴표 안은 그대로, 쉼표 사이는 빈칸 한 칸.',
            notes: '<p><b>[2분]</b> 손을 들어 보기 번호를 고르게 한 뒤 정답을 공개합니다. 2번을 고른 학생에게 “빈칸은 어디서 생길까요?”라고 되물어 쉼표의 역할을 다시 짚습니다.</p>' },
          { layout: 'practice', title: '실습 2-1. 다른 숫자로 사칙 연산하기', desc: '<p>a 에 7, b 에 2 를 넣고 사칙 연산 결과를 계산식과 함께 출력하세요.</p><pre>7 + 2 = 9\n7 - 2 = 5\n7 * 2 = 14\n7 / 2 = 3.5</pre>',
            starter: 'a = 7\nb = 2\n# TODO: 사칙 연산 결과 출력\n',
            solution: 'a = 7\nb = 2\nresult = a + b\nprint(a, "+", b, "=", result)\nresult = a - b\nprint(a, "-", b, "=", result)\nresult = a * b\nprint(a, "*", b, "=", result)\nresult = a / b\nprint(a, "/", b, "=", result)\n',
            notes: '<p><b>[8분]</b> 빠른 학생에게는 실습 2-2(직사각형), 2-3(// 와 %)을 이어서 풀게 합니다.</p><p>순회하며 확인할 점: 곱하기에 x 를 쓰는 실수, 따옴표 짝이 맞지 않는 실수.</p>' },
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
          '오류 메시지에서 오류의 종류와 위치를 찾을 수 있다'
        ],
        flow: [['복습 · 대화형 모드의 한계', 8], ['스크립트 모드: Code02-01', 12], ['파일 열어 수정 · 다시 실행', 8], ['긴 프로그램 코딩 순서 · 오류 읽기', 10], ['퀴즈 · 실습', 12]],
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
            desc: '최신 파이썬은 <code>Did you mean: \'print\'?</code> 처럼 <b>고칠 방법까지 제안</b>해 줍니다. <code>4행</code>의 <code>prnt</code> 를 <code>print</code> 로 고치면 해결됩니다.' }
        ],
        practice: [
          {
            title: '실습 2-4. Code02-01 고쳐서 다시 실행하기',
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
            title: '실습 2-5. 오류 고치기',
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
          }
        ],
        quiz: [
          { q: 'IDLE 을 종료했다가 다시 켠 뒤 셸에 <code>result = a / b</code> 만 입력하면 어떻게 되는가?', options: ['2.0 이 출력된다', '이전 값이 남아 있어 result 에 2.0 이 들어간다', 'NameError 가 발생한다', 'ZeroDivisionError 가 발생한다'], answer: 2, explain: '종료하면 메모리의 변수가 모두 사라지므로 a 가 정의되어 있지 않다는 NameError 가 납니다.' },
          { q: 'IDLE 에서 스크립트 모드의 코드를 실행하는 단축키는? (이 강좌에서는 Ctrl+Enter)', options: ['F1', 'F5', 'Ctrl+S', 'Ctrl+N'], answer: 1, explain: '[Run]-[Run Module] 의 단축키는 F5 입니다. Ctrl+S 는 저장, Ctrl+N 은 새 파일입니다.' },
          { q: '스크립트 모드에 대한 설명으로 <b>틀린</b> 것은?', options: ['여러 줄의 코드를 입력해 두고 한꺼번에 실행한다', '코드를 .py 파일로 저장해 다시 열 수 있다', '한 줄을 입력할 때마다 바로 실행된다', '값을 보려면 print() 로 출력해야 한다'], answer: 2, explain: '한 줄씩 바로 실행되는 것은 대화형 모드입니다. 스크립트 모드는 입력 중에는 실행되지 않습니다.' },
          { q: '다음 오류 메시지에서 문제가 있는 줄은?<pre><code>  File "main.py", line 4, in &lt;module&gt;\n    prnt(result)\nNameError: name \'prnt\' is not defined</code></pre>', options: ['1행', '2행', '4행', '알 수 없다'], answer: 2, explain: '<code>line 4</code> 가 오류 위치입니다. print 를 prnt 로 잘못 쓴 오타입니다.' },
          { q: '긴 프로그램을 코딩하는 순서로 알맞은 것은?', options: ['실행 → 코딩 → 저장', '코딩 → 저장 → 실행 및 결과 확인', '저장 → 실행 → 코딩', '코딩 → 실행 → 파일 열기'], answer: 1, explain: '코딩 → 저장 → 실행 및 결과 확인, 결과가 틀리면 다시 코딩 단계로 돌아갑니다.' }
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
          { layout: 'quiz', title: '확인 문제', q: '스크립트 모드에 대한 설명으로 <b>틀린</b> 것은?', options: ['여러 줄을 입력해 두고 한꺼번에 실행한다', '.py 파일로 저장해 다시 열 수 있다', '한 줄을 입력할 때마다 바로 실행된다', '값을 보려면 print() 로 출력해야 한다'], answer: 2, explain: '한 줄씩 바로 실행되는 것은 대화형 모드(셸)입니다.',
            notes: '<p><b>[2분]</b> 대화형 모드와 스크립트 모드의 차이를 한 번 더 정리합니다.</p>' },
          { layout: 'practice', title: '실습 2-5. 오류 고치기', desc: '<p>오류 메시지를 읽고 두 군데를 고쳐 <code>100 + 50 = 150</code>, <code>100 * 50 = 5000</code> 이 출력되게 하세요.</p>',
            starter: 'a = 100\nb = 50\nresult = a + b\nprint(a, "+", b, "=", Result)\nresult = a * b\nprnt(a, "*", b, "=", result)\n',
            solution: 'a = 100\nb = 50\nresult = a + b\nprint(a, "+", b, "=", result)\nresult = a * b\nprint(a, "*", b, "=", result)\n',
            notes: '<p><b>[8분]</b> 오류는 한 번에 하나씩만 보입니다(첫 오류에서 멈춤). 하나 고치고 → 다시 실행 → 다음 오류, 이 과정 자체가 “긴 프로그램 코딩 순서”의 실습입니다.</p><p>빠른 학생: 실습 2-4(몫 · 나머지 추가).</p>' },
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
          '안내 문구가 있는 입력으로 [프로그램 1] 간단 계산기를 완성할 수 있다'
        ],
        flow: [['도입: 고정된 값의 한계', 5], ['input() 과 문자열 문제 (Code02-02)', 12], ['int() 변환 (Code02-03)', 10], ['[프로그램 1] 완성 (Code02-04)', 10], ['퀴즈 · 실습', 13]],
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
          { type: 'callout', kind: 'more', title: '📘 요즘 스타일로 쓴 계산기', html: '같은 계산기를 f-문자열로 쓰면 결과 변수 없이도 깔끔하게 만들 수 있습니다.<pre><code>a = int(input("첫 번째 숫자를 입력하세요 : "))\nb = int(input("두 번째 숫자를 입력하세요 : "))\nprint(f"{a} + {b} = {a + b}")\nprint(f"{a} - {b} = {a - b}")\nprint(f"{a} * {b} = {a * b}")\nprint(f"{a} / {b} = {a / b}")</code></pre>교재 방식(result 변수 재사용)과 결과는 같습니다. 어느 쪽이든 읽기 쉬운 방식을 고르면 됩니다.' }
        ],
        practice: [
          {
            title: '실습 2-6. 나이 계산기',
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
            title: '실습 2-7. 세 과목 합계와 평균',
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
            title: '실습 2-8. 섭씨 → 화씨 변환기',
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
          }
        ],
        quiz: [
          { q: '<code>a = input()</code> 에서 키보드로 <code>100</code> 을 입력했을 때 a 에 들어가는 값은?', options: ['정수 100', '실수 100.0', '문자열 "100"', '아무것도 들어가지 않는다'], answer: 2, explain: 'input() 은 입력한 내용을 항상 문자열로 돌려줍니다.' },
          { q: '다음 코드에서 100 과 50 을 입력했을 때 출력은?<pre><code>a = input()\nb = input()\nprint(a + b)</code></pre>', options: ['150', '10050', '100 50', '오류'], answer: 1, explain: '문자열끼리 + 하면 이어 붙이므로 "10050" 이 됩니다.' },
          { q: '<code>int(100.123)</code> 의 결과는?', options: ['100', '100.1', '101', '오류'], answer: 0, explain: 'int() 는 실수의 소수점 아래를 버리고 정수로 만듭니다.' },
          { q: '<code>a = int(input("숫자 : "))</code> 가 실행되는 순서로 알맞은 것은?', options: ['int() → input() → a 에 대입', 'input() → int() → a 에 대입', 'a 에 대입 → input() → int()', '동시에 실행된다'], answer: 1, explain: '안쪽 괄호부터: input() 이 글자를 받고 → int() 가 정수로 바꾸고 → a 에 대입합니다.' },
          { q: '<code>int("3.5")</code> 를 실행하면?', options: ['3', '4', '3.5', 'ValueError 오류'], answer: 3, explain: 'int() 는 정수 모양의 문자열만 바꿀 수 있습니다. "3.5" 는 float() 으로 바꿔야 합니다.' }
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
            notes: '<p><b>[2분]</b> 강의자료 밖의 보충입니다. 실습 2-8(섭씨 → 화씨)에서 float() 을 사용합니다.</p>' },
          { layout: 'quiz', title: '확인 문제', q: '100 과 50 을 입력했을 때 출력은?<pre><code>a = input()\nb = input()\nprint(a + b)</code></pre>', options: ['150', '10050', '100 50', '오류'], answer: 1, explain: 'input() 은 문자열을 돌려주므로 + 는 이어 붙이기가 됩니다.',
            notes: '<p><b>[2분]</b> 정답 공개 후 “150 이 나오게 하려면 어디를 고쳐야 할까요?” → <code>int(input())</code>.</p>' },
          { layout: 'practice', title: '실습 2-7. 세 과목 합계와 평균', desc: '<p>국어 · 영어 · 수학 점수를 입력받아 합계와 평균을 출력하세요.</p><pre>국어 점수 : 90\n영어 점수 : 85\n수학 점수 : 77\n합계 : 252\n평균 : 84.0</pre>',
            starter: 'kor = 0\neng = 0\nmath = 0\n# TODO: 입력받아 합계와 평균 출력\n',
            solution: 'kor = int(input("국어 점수 : "))\neng = int(input("영어 점수 : "))\nmath = int(input("수학 점수 : "))\ntotal = kor + eng + math\navg = total / 3\nprint("합계 :", total)\nprint("평균 :", avg)\n', stdin: '90\n85\n77\n',
            notes: '<p><b>[10분]</b> 쉬운 실습 2-6(나이 계산기)부터 시작해도 좋습니다. 빠른 학생은 2-8(float 사용).</p><p>순회 포인트: int() 를 빼먹어 합계가 “908577”이 되는 학생 → 오늘 배운 내용을 스스로 발견하는 좋은 기회입니다.</p>' },
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
          '거북이로 정사각형을 그리는 프로그램을 세 부분 구조로 바꿀 수 있다'
        ],
        flow: [['도입: 긴 프로그램의 틀', 5], ['주석과 줄 이어 쓰기', 8], ['함수 선언 · 변수 선언 · 메인', 15], ['터틀 정사각형 Code02-05 → 02-06', 10], ['퀴즈 · 실습', 12]],
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
            desc: '빨간 거북이는 오른쪽으로 돌며 작은 사각형을, 파란 거북이는 왼쪽으로 돌며 큰 사각형을 그립니다.' }
        ],
        practice: [
          {
            title: '실습 2-9. 정삼각형 그리기',
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
            title: '실습 2-10. 호출 횟수 세기',
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
          }
        ],
        quiz: [
          { q: '파이썬에서 주석을 나타내는 기호는?', options: ['//', '#', '--', '/* */'], answer: 1, explain: '# 뒤의 내용은 실행되지 않는 주석입니다. 여러 줄은 작은따옴표 3개로 감쌀 수 있습니다.' },
          { q: '다음 코드의 출력은?<pre><code>data = \'파이\' + \\\n       \'썬\'\nprint(data)</code></pre>', options: ['파이', '파이썬', '파이 썬', '오류'], answer: 1, explain: '줄 끝의 \\ 는 다음 줄과 이어서 한 줄로 인식하게 합니다. 문자열끼리 + 는 이어 붙이기입니다.' },
          { q: '다음 코드의 출력은?<pre><code>def plus() :\n    global total\n    total = total + 10\n\ntotal = 5\nplus()\nplus()\nprint(total)</code></pre>', options: ['5', '15', '25', '오류'], answer: 2, explain: 'plus() 를 두 번 호출해 5 + 10 + 10 = 25 가 됩니다.' },
          { q: '긴 프로그램의 세 부분 중 “프로그램 전체에서 쓸 변수를 초깃값과 함께 준비하는 곳”은?', options: ['함수 선언 부분', '변수 선언 부분', '메인 코드 부분', 'import 부분'], answer: 1, explain: '전역 변수를 미리 준비하는 곳이 변수 선언 부분입니다.' },
          { q: '파이썬의 변수 선언에 대한 설명으로 옳은 것은?', options: ['C 처럼 int a; 로 반드시 먼저 선언해야 한다', '값을 대입하는 순간 변수가 자동으로 만들어진다', '변수는 한 번 만들면 값을 바꿀 수 없다', '변수는 함수 안에서만 만들 수 있다'], answer: 1, explain: '파이썬은 선언 없이 대입하는 순간 변수가 생깁니다. 다만 변수 선언 부분에 초깃값을 넣어 두는 것이 바람직합니다.' }
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
          { layout: 'quiz', title: '확인 문제', q: '출력은?<pre><code>def plus() :\n    global total\n    total = total + 10\n\ntotal = 5\nplus()\nplus()\nprint(total)</code></pre>', options: ['5', '15', '25', '오류'], answer: 2, explain: '두 번 호출: 5 → 15 → 25.',
            notes: '<p><b>[2분]</b> “global 줄을 지우면 어떻게 될까요?” 추가 질문으로 UnboundLocalError 를 복습합니다.</p>' },
          { layout: 'practice', title: '실습 2-9. 정삼각형 그리기', desc: '<p>Code02-06 의 틀로 한 변이 200 인 정삼각형을 그리세요. (힌트: 3번, 120도)</p>',
            starter: "import turtle\n\n## 변수 선언 부분 ##\nmyT = None\n\n## 메인 코드 부분 ##\nmyT = turtle.Turtle()\nmyT.shape('turtle')\n\n# TODO: 정삼각형 그리기\n\nturtle.done()\n",
            solution: "import turtle\n\n## 변수 선언 부분 ##\nmyT = None\n\n## 메인 코드 부분 ##\nmyT = turtle.Turtle()\nmyT.shape('turtle')\n\nfor i in range(0, 3) :\n    myT.forward(200)\n    myT.left(120)\n\nturtle.done()\n",
            notes: '<p><b>[8분]</b> 60도로 돌리는 학생이 많습니다(안쪽 각). 거북이는 “바깥쪽으로 도는 각”만큼 돌아야 하므로 120도. 직접 실행해 보고 스스로 찾게 하세요.</p><p>빠른 학생: 실습 2-10(global 로 호출 횟수 세기), 또는 오각형(72도) 도전.</p>' },
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
          '세 부분 구조로 [프로그램 2] 터틀 그래픽 그림판을 완성할 수 있다'
        ],
        flow: [['기능 계획 · 변수 준비', 8], ['기능 1 · 2 구현 (클릭 → 함수)', 12], ['기능 3 구현 (random)', 8], ['Code02-07 완성 · 표 2-1', 8], ['SELF STUDY · 퀴즈', 14]],
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
            desc: '검은 선 → (가운데 클릭) → 새 색의 선 → (선 없이 이동) → (가운데 클릭) → 또 다른 색의 선이 그려집니다. <code>round(값, 2)</code> 는 소수점 둘째 자리까지 반올림합니다.' }
        ],
        practice: [
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
            title: '실습 2-11. 클릭한 곳에 점 찍기',
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
            title: '실습 2-12. 키보드로 지우고 펜 두께 바꾸기',
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
          }
        ],
        quiz: [
          { q: '<code>turtle.onscreenclick(screenRightClick, 3)</code> 의 의미는?', options: ['screenRightClick 을 3번 실행한다', '마우스 오른쪽 버튼으로 창을 클릭하면 screenRightClick 을 호출한다', '3초 뒤에 screenRightClick 을 호출한다', '거북이를 3 배 크기로 만든다'], answer: 1, explain: '번호 1은 왼쪽, 2는 가운데, 3은 오른쪽 버튼입니다.' },
          { q: '클릭에 연결하는 함수가 <code>def screenLeftClick(x, y) :</code> 처럼 매개변수 x, y 를 갖는 이유는?', options: ['x, y 를 전역 변수로 만들기 위해', '클릭한 지점의 좌표를 넘겨받기 위해', '거북이의 크기를 정하기 위해', '특별한 이유 없이 관습이다'], answer: 1, explain: '클릭하면 파이썬이 클릭한 지점의 좌표를 x, y 로 넘겨주며 함수를 호출합니다.' },
          { q: '<code>random.randrange(1, 10)</code> 이 돌려줄 수 <b>없는</b> 값은?', options: ['1', '5', '9', '10'], answer: 3, explain: 'randrange(1, 10) 은 1 이상 10 미만, 즉 1 ~ 9 중 하나입니다.' },
          { q: '<code>screenMidClick()</code> 에서 <code>global r, g, b</code> 를 빼면 어떻게 되는가?', options: ['아무 차이가 없다', '함수 안의 r, g, b 가 지역 변수가 되어 다음 왼쪽 클릭의 선 색이 바뀌지 않는다', '거북이 크기가 바뀌지 않는다', '가운데 버튼 클릭이 인식되지 않는다'], answer: 1, explain: '대입하는 변수는 global 이 없으면 함수 안의 지역 변수가 되어, 전역 r, g, b 는 계속 0.0 (검정) 입니다.' },
          { q: '펜을 들어 선을 그리지 않고 이동하게 하는 함수는?', options: ['turtle.pendown()', 'turtle.penup()', 'turtle.pensize(0)', 'turtle.done()'], answer: 1, explain: 'penup() 은 펜을 들고, pendown() 은 펜을 내립니다.' }
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
          { layout: 'quiz', title: '확인 문제', q: '<code>random.randrange(1, 10)</code> 이 돌려줄 수 <b>없는</b> 값은?', options: ['1', '5', '9', '10'], answer: 3, explain: '끝 숫자 10 은 포함되지 않습니다 (1 ~ 9).',
            notes: '<p><b>[2분]</b> range 계열 함수는 “끝 숫자 미포함”이 공통 규칙입니다. 6장 range() 에서도 다시 나옵니다.</p>' },
          { layout: 'practice', title: 'SELF STUDY 2-1', desc: '<p>Code02-07 을 수정해서 <b>왼쪽 버튼만 눌러도</b> 임의의 색상이 지정되고 거북이 크기가 바뀌면서 선이 그려지도록 하세요.</p>',
            starter: "import turtle\nimport random\n\ndef screenLeftClick(x, y) :\n    global r, g, b\n    # TODO: 크기와 색을 임의로\n    turtle.pencolor((r, g, b))\n    turtle.pendown()\n    turtle.goto(x, y)\n\ndef screenRightClick(x, y) :\n    turtle.penup()\n    turtle.goto(x, y)\n\npSize = 10\nr, g, b = 0.0, 0.0, 0.0\nturtle.title('거북이로 그림 그리기')\nturtle.shape('turtle')\nturtle.pensize(pSize)\nturtle.onscreenclick(screenLeftClick, 1)\nturtle.onscreenclick(screenRightClick, 3)\nturtle.done()\n",
            solution: "import turtle\nimport random\n\n## 함수 선언 부분 ##\ndef screenLeftClick(x, y) :\n    global r, g, b\n    tSize = random.randrange(1, 10)\n    turtle.shapesize(tSize)\n    r = random.random()\n    g = random.random()\n    b = random.random()\n    turtle.pencolor((r, g, b))\n    turtle.pendown()\n    turtle.goto(x, y)\n\ndef screenRightClick(x, y) :\n    turtle.penup()\n    turtle.goto(x, y)\n\n## 변수 선언 부분 ##\npSize = 10\nr, g, b = 0.0, 0.0, 0.0\n\n## 메인 코드 부분 ##\nturtle.title('거북이로 그림 그리기')\nturtle.shape('turtle')\nturtle.pensize(pSize)\n\nturtle.onscreenclick(screenLeftClick, 1)\nturtle.onscreenclick(screenRightClick, 3)\n\nturtle.done()\n",
            notes: '<p><b>[10분]</b> 가운데 버튼이 없는 노트북 사용자에게 특히 유용한 수정입니다.</p><p>포인트: 색을 정하는 코드가 pencolor() <b>앞</b>에 와야 그 클릭의 선에 새 색이 적용됩니다. 뒤에 두면 “다음” 선에 적용되는 차이를 실험해 보게 하세요.</p><p>빠른 학생: 실습 2-11(점 찍기), 2-12(키보드 onkey).</p>' },
          { layout: 'summary', title: '정리', bullets: ['<code>onscreenclick(함수명, 번호)</code> — 클릭에 함수 연결 (1 왼 · 2 가운데 · 3 오른)', '클릭 함수는 좌표 <code>x, y</code> 를 매개변수로 받음', '<code>pendown</code>/<code>penup</code> + <code>goto(x, y)</code>', '<code>random.random()</code> 0.0~1.0, <code>randrange(1, 10)</code> 1~9', '<b>[프로그램 2] 터틀 그래픽 그림판 완성!</b>'],
            notes: '<p><b>[1분]</b> 2장 전체 정리: 변수 · print · input · int · 파일 저장 · 프로그램 구조 · 이벤트. 다음 장(3장)에서 변수와 데이터형을 본격적으로 배웁니다.</p>' }
        ]
      }
    ]
  });
})();
