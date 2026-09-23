/* Chapter 01. 파이썬 들여다보기
 * 강의자료: Ch01_파이썬 들여다보기.pptx (Section 01 ~ 03)
 */
(function () {
  /* ───────────── 공용 그림(SVG) ───────────── */
  const FIG_PROGRAMMER = `<svg viewBox="0 0 1280 440" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <defs><marker viewBox="0 0 12 12" id="c1arrA" markerWidth="4.5" markerHeight="4.5" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="var(--ok)"/></marker></defs>
  <rect x="60" y="70" width="300" height="240" rx="22" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <circle cx="210" cy="140" r="38" fill="none" stroke="var(--accent)" stroke-width="5"/>
  <path d="M140,250 Q210,170 280,250" fill="none" stroke="var(--accent)" stroke-width="5"/>
  <rect x="120" y="258" width="180" height="30" rx="6" fill="none" stroke="var(--muted)" stroke-width="3"/>
  <text x="210" y="360" text-anchor="middle" font-size="30" font-weight="bold" fill="var(--fg)">프로그래머</text>
  <text x="210" y="400" text-anchor="middle" font-size="21" fill="var(--muted)">코드를 작성하는 사람</text>
  <line x1="375" y1="190" x2="480" y2="190" stroke="var(--ok)" stroke-width="6" marker-end="url(#c1arrA)"/>
  <rect x="490" y="70" width="300" height="240" rx="22" fill="var(--card)" stroke="var(--accent2)" stroke-width="4"/>
  <rect x="520" y="100" width="240" height="180" rx="10" fill="none" stroke="var(--line)" stroke-width="3"/>
  <text x="535" y="140" font-size="21" font-family="monospace" fill="var(--accent2)">print("Hi")</text>
  <text x="535" y="175" font-size="21" font-family="monospace" fill="var(--muted)">a = 10 + 20</text>
  <text x="535" y="210" font-size="21" font-family="monospace" fill="var(--muted)">print(a)</text>
  <text x="535" y="245" font-size="21" font-family="monospace" fill="var(--ok)"># 주석</text>
  <text x="640" y="360" text-anchor="middle" font-size="30" font-weight="bold" fill="var(--fg)">프로그래밍 언어</text>
  <text x="640" y="400" text-anchor="middle" font-size="21" fill="var(--muted)">컴퓨터에게 일을 시키는 말</text>
  <line x1="805" y1="190" x2="910" y2="190" stroke="var(--ok)" stroke-width="6" marker-end="url(#c1arrA)"/>
  <rect x="920" y="70" width="300" height="240" rx="22" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <rect x="1020" y="95" width="100" height="190" rx="16" fill="none" stroke="var(--ok)" stroke-width="4"/>
  <rect x="1035" y="120" width="30" height="30" rx="4" fill="var(--accent)"/><rect x="1075" y="120" width="30" height="30" rx="4" fill="var(--warn)"/>
  <rect x="1035" y="160" width="30" height="30" rx="4" fill="var(--accent2)"/><rect x="1075" y="160" width="30" height="30" rx="4" fill="var(--danger)"/>
  <rect x="1035" y="200" width="70" height="50" rx="4" fill="var(--line)"/>
  <text x="1070" y="360" text-anchor="middle" font-size="30" font-weight="bold" fill="var(--fg)">소프트웨어 · 앱</text>
  <text x="1070" y="400" text-anchor="middle" font-size="21" fill="var(--muted)">엑셀, 한글, 웹 브라우저, 게임…</text>
</svg>`;

  const tiobe = [['C', 12.54], ['Python', 11.84], ['Java', 11.54], ['C++', 7.36], ['C#', 4.33], ['Visual Basic', 4.01], ['JavaScript', 2.33], ['PHP', 2.21], ['Assembly', 2.05], ['SQL', 1.88]];
  const FIG_TIOBE = `<svg viewBox="0 0 1280 640" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="640" y="45" text-anchor="middle" font-size="28" font-weight="bold" fill="var(--fg)">프로그래밍 언어 인기 순위 TOP 10 (TIOBE 지수, 2021년 6월)</text>
  ${tiobe.map(([n, v], i) => {
    const y = 80 + i * 54, w = Math.round(v / 12.54 * 760);
    const col = n === 'Python' ? 'var(--warn)' : 'var(--accent)';
    return `<text x="60" y="${y + 28}" font-size="22" fill="var(--muted)">${i + 1}위</text>
  <text x="280" y="${y + 28}" text-anchor="end" font-size="23" font-weight="${n === 'Python' ? 'bold' : 'normal'}" fill="var(--fg)">${n}</text>
  <rect x="300" y="${y}" width="${w}" height="38" rx="6" fill="${col}" opacity="${n === 'Python' ? 1 : 0.75}"/>
  <text x="${300 + w + 12}" y="${y + 28}" font-size="22" fill="var(--fg)">${v.toFixed(2)}%</text>`;
  }).join('\n  ')}
</svg>`;

  const FIG_TIMELINE = `<svg viewBox="0 0 1280 400" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <line x1="60" y1="200" x2="1220" y2="200" stroke="var(--line)" stroke-width="6"/>
  ${[[110, '1989', '성탄절 휴가에', '개발 시작'], [300, '1991', '파이썬 0.9', '공식 발표'], [490, '2000', '파이썬 2.0', ''], [680, '2008', '파이썬 3.0', '(2.x 와 호환 X)'], [870, '2020', '파이썬 2.x', '지원 종료'], [1080, '2025', '파이썬 3.14', '이 강좌 버전']].map(([x, y, a, b], i) => `<circle cx="${x}" cy="200" r="16" fill="${i === 5 ? 'var(--warn)' : 'var(--accent)'}"/>
  <text x="${x}" y="${i % 2 ? 290 : 140}" text-anchor="middle" font-size="30" font-weight="bold" fill="var(--fg)">${y}</text>
  <text x="${x}" y="${i % 2 ? 330 : 80}" text-anchor="middle" font-size="22" fill="var(--accent2)">${a}</text>
  <text x="${x}" y="${i % 2 ? 362 : 108}" text-anchor="middle" font-size="20" fill="var(--muted)">${b}</text>`).join('\n  ')}
</svg>`;

  const FIG_COMPILE = `<svg viewBox="0 0 1280 560" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <defs><marker viewBox="0 0 12 12" id="c1arrB" markerWidth="4.5" markerHeight="4.5" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="var(--fg)"/></marker></defs>
  <text x="40" y="50" font-size="28" font-weight="bold" fill="var(--accent)">컴파일러 언어 (C, C++, 자바 …)</text>
  <rect x="40" y="80" width="220" height="140" rx="14" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
  <text x="150" y="140" text-anchor="middle" font-size="24" fill="var(--fg)">소스 코드</text>
  <text x="150" y="175" text-anchor="middle" font-size="20" fill="var(--muted)">hello.c</text>
  <line x1="265" y1="150" x2="335" y2="150" stroke="var(--fg)" stroke-width="4" marker-end="url(#c1arrB)"/>
  <rect x="345" y="80" width="260" height="140" rx="14" fill="var(--accent)" opacity="0.18" stroke="var(--accent)" stroke-width="3"/>
  <text x="475" y="140" text-anchor="middle" font-size="26" font-weight="bold" fill="var(--accent)">컴파일러</text>
  <text x="475" y="175" text-anchor="middle" font-size="20" fill="var(--fg)">전체를 한꺼번에 번역</text>
  <line x1="610" y1="150" x2="680" y2="150" stroke="var(--fg)" stroke-width="4" marker-end="url(#c1arrB)"/>
  <rect x="690" y="80" width="240" height="140" rx="14" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
  <text x="810" y="140" text-anchor="middle" font-size="24" fill="var(--fg)">실행 파일</text>
  <text x="810" y="175" text-anchor="middle" font-size="20" fill="var(--muted)">hello.exe (기계어)</text>
  <line x1="935" y1="150" x2="1005" y2="150" stroke="var(--fg)" stroke-width="4" marker-end="url(#c1arrB)"/>
  <rect x="1015" y="80" width="220" height="140" rx="14" fill="var(--ok)" opacity="0.18" stroke="var(--ok)" stroke-width="3"/>
  <text x="1125" y="140" text-anchor="middle" font-size="24" font-weight="bold" fill="var(--ok)">실행</text>
  <text x="1125" y="175" text-anchor="middle" font-size="20" fill="var(--fg)">빠름</text>
  <text x="40" y="320" font-size="28" font-weight="bold" fill="var(--warn)">스크립트(인터프리터) 언어 (파이썬, 자바스크립트 …)</text>
  <rect x="40" y="350" width="220" height="170" rx="14" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
  <text x="150" y="395" text-anchor="middle" font-size="24" fill="var(--fg)">소스 코드</text>
  <text x="60" y="435" font-size="19" font-family="monospace" fill="var(--muted)">1: print(…)</text>
  <text x="60" y="465" font-size="19" font-family="monospace" fill="var(--muted)">2: print(…)</text>
  <text x="60" y="495" font-size="19" font-family="monospace" fill="var(--muted)">3: print(…)</text>
  <line x1="265" y1="435" x2="335" y2="435" stroke="var(--fg)" stroke-width="4" marker-end="url(#c1arrB)"/>
  <rect x="345" y="350" width="585" height="170" rx="14" fill="var(--warn)" opacity="0.15" stroke="var(--warn)" stroke-width="3"/>
  <text x="637" y="395" text-anchor="middle" font-size="26" font-weight="bold" fill="var(--warn)">인터프리터</text>
  <text x="637" y="440" text-anchor="middle" font-size="21" fill="var(--fg)">1행 번역 → 실행 → 2행 번역 → 실행 → …</text>
  <text x="637" y="480" text-anchor="middle" font-size="20" fill="var(--muted)">별도의 실행 파일을 만들지 않음</text>
  <line x1="935" y1="435" x2="1005" y2="435" stroke="var(--fg)" stroke-width="4" marker-end="url(#c1arrB)"/>
  <rect x="1015" y="350" width="220" height="170" rx="14" fill="var(--ok)" opacity="0.18" stroke="var(--ok)" stroke-width="3"/>
  <text x="1125" y="420" text-anchor="middle" font-size="24" font-weight="bold" fill="var(--ok)">결과</text>
  <text x="1125" y="460" text-anchor="middle" font-size="20" fill="var(--fg)">바로 확인</text>
</svg>`;

  const FIG_PVM = `<svg viewBox="0 0 1280 520" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <defs><marker viewBox="0 0 12 12" id="c1arrP" markerWidth="4.5" markerHeight="4.5" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="var(--fg)"/></marker></defs>
  <text x="640" y="48" text-anchor="middle" font-size="28" font-weight="bold" fill="var(--fg)">파이썬 코드가 실행되기까지</text>
  <rect x="40" y="90" width="270" height="180" rx="16" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <text x="175" y="132" text-anchor="middle" font-size="24" font-weight="bold" fill="var(--accent)">① 소스 코드</text>
  <text x="62" y="176" font-size="20" font-family="monospace" fill="var(--fg)">a = 10 + 20</text>
  <text x="62" y="208" font-size="20" font-family="monospace" fill="var(--fg)">print(a)</text>
  <text x="175" y="250" text-anchor="middle" font-size="19" fill="var(--muted)">hello.py (사람이 읽는 글)</text>
  <line x1="315" y1="180" x2="385" y2="180" stroke="var(--fg)" stroke-width="4" marker-end="url(#c1arrP)"/>
  <rect x="395" y="90" width="230" height="180" rx="16" fill="var(--accent2)" opacity="0.18" stroke="var(--accent2)" stroke-width="4"/>
  <text x="510" y="150" text-anchor="middle" font-size="24" font-weight="bold" fill="var(--accent2)">② 컴파일</text>
  <text x="510" y="190" text-anchor="middle" font-size="20" fill="var(--fg)">문법 검사 +</text>
  <text x="510" y="220" text-anchor="middle" font-size="20" fill="var(--fg)">바이트코드 변환</text>
  <line x1="630" y1="180" x2="700" y2="180" stroke="var(--fg)" stroke-width="4" marker-end="url(#c1arrP)"/>
  <rect x="710" y="90" width="250" height="180" rx="16" fill="var(--card)" stroke="var(--warn)" stroke-width="4"/>
  <text x="835" y="132" text-anchor="middle" font-size="24" font-weight="bold" fill="var(--warn)">③ 바이트코드</text>
  <text x="730" y="176" font-size="18" font-family="monospace" fill="var(--muted)">LOAD_CONST 10</text>
  <text x="730" y="206" font-size="18" font-family="monospace" fill="var(--muted)">BINARY_OP  +</text>
  <text x="835" y="250" text-anchor="middle" font-size="19" fill="var(--muted)">__pycache__/*.pyc</text>
  <line x1="965" y1="180" x2="1035" y2="180" stroke="var(--fg)" stroke-width="4" marker-end="url(#c1arrP)"/>
  <rect x="1045" y="90" width="200" height="180" rx="16" fill="var(--ok)" opacity="0.18" stroke="var(--ok)" stroke-width="4"/>
  <text x="1145" y="150" text-anchor="middle" font-size="24" font-weight="bold" fill="var(--ok)">④ PVM</text>
  <text x="1145" y="190" text-anchor="middle" font-size="20" fill="var(--fg)">한 개씩 실행</text>
  <text x="1145" y="222" text-anchor="middle" font-size="20" fill="var(--fg)">→ 결과 출력</text>
  <rect x="395" y="330" width="230" height="110" rx="14" fill="var(--danger)" opacity="0.15" stroke="var(--danger)" stroke-width="3"/>
  <text x="510" y="372" text-anchor="middle" font-size="22" font-weight="bold" fill="var(--danger)">SyntaxError</text>
  <text x="510" y="408" text-anchor="middle" font-size="19" fill="var(--fg)">여기서 걸리면</text>
  <line x1="510" y1="275" x2="510" y2="325" stroke="var(--danger)" stroke-width="4" marker-end="url(#c1arrP)" stroke-dasharray="8 6"/>
  <text x="510" y="472" text-anchor="middle" font-size="20" fill="var(--danger)">첫 줄도 실행되지 않음</text>
  <rect x="1045" y="330" width="200" height="110" rx="14" fill="var(--warn)" opacity="0.15" stroke="var(--warn)" stroke-width="3"/>
  <text x="1145" y="372" text-anchor="middle" font-size="22" font-weight="bold" fill="var(--warn)">ZeroDivisionError</text>
  <text x="1145" y="408" text-anchor="middle" font-size="19" fill="var(--fg)">실행 중 오류</text>
  <line x1="1145" y1="275" x2="1145" y2="325" stroke="var(--warn)" stroke-width="4" marker-end="url(#c1arrP)" stroke-dasharray="8 6"/>
  <text x="1145" y="472" text-anchor="middle" font-size="20" fill="var(--warn)">그 줄에 도착했을 때 발생</text>
  <text x="180" y="400" font-size="21" fill="var(--muted)">②·③ 은 눈에 보이지 않게</text>
  <text x="180" y="432" font-size="21" fill="var(--muted)">자동으로 일어납니다</text>
</svg>`;

  const FIG_WEBIDE = `<svg viewBox="0 0 1280 520" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="30" y="30" width="700" height="460" rx="16" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <rect x="30" y="30" width="700" height="60" rx="16" fill="var(--accent)" opacity="0.15"/>
  <text x="60" y="70" font-size="26" font-weight="bold" fill="var(--accent)">편집기 (스크립트 모드)</text>
  <rect x="560" y="44" width="150" height="36" rx="8" fill="var(--accent)"/>
  <text x="635" y="70" text-anchor="middle" font-size="21" font-weight="bold" fill="#fff">▶ 실행</text>
  <text x="60" y="140" font-size="22" font-family="monospace" fill="var(--muted)">1</text><text x="100" y="140" font-size="22" font-family="monospace" fill="var(--fg)">print("Hello, world!")</text>
  <text x="60" y="180" font-size="22" font-family="monospace" fill="var(--muted)">2</text><text x="100" y="180" font-size="22" font-family="monospace" fill="var(--fg)">print(10 + 20)</text>
  <text x="60" y="220" font-size="22" font-family="monospace" fill="var(--muted)">3</text><text x="100" y="220" font-size="22" font-family="monospace" fill="var(--ok)"># 여러 줄을 한 번에 실행</text>
  <text x="60" y="440" font-size="20" fill="var(--muted)">여러 줄을 작성한 뒤 ▶ 실행 또는 Ctrl + Enter</text>
  <rect x="760" y="30" width="490" height="460" rx="16" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <rect x="760" y="30" width="490" height="60" rx="16" fill="var(--ok)" opacity="0.15"/>
  <text x="790" y="70" font-size="26" font-weight="bold" fill="var(--ok)">실행 결과 (콘솔)</text>
  <rect x="1110" y="44" width="120" height="36" rx="8" fill="none" stroke="var(--ok)" stroke-width="3"/>
  <text x="1170" y="70" text-anchor="middle" font-size="20" font-weight="bold" fill="var(--ok)">&gt;&gt;&gt; 셸</text>
  <text x="790" y="140" font-size="22" font-family="monospace" fill="var(--fg)">Hello, world!</text>
  <text x="790" y="180" font-size="22" font-family="monospace" fill="var(--fg)">30</text>
  <line x1="780" y1="215" x2="1230" y2="215" stroke="var(--line)" stroke-width="2" stroke-dasharray="8 6"/>
  <text x="790" y="260" font-size="22" font-family="monospace" fill="var(--danger)">&gt;&gt;&gt; <tspan fill="var(--fg)">10 + 20</tspan></text>
  <text x="790" y="300" font-size="22" font-family="monospace" fill="var(--accent)">30</text>
  <text x="790" y="340" font-size="22" font-family="monospace" fill="var(--danger)">&gt;&gt;&gt; <tspan fill="var(--muted)">▌</tspan></text>
  <text x="790" y="440" font-size="20" fill="var(--muted)">&gt;&gt;&gt; 셸 = 대화형 모드 (한 줄씩)</text>
</svg>`;

  const FIG_MODES = `<svg viewBox="0 0 1280 520" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <defs><marker viewBox="0 0 12 12" id="c1arrC" markerWidth="4.5" markerHeight="4.5" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="var(--fg)"/></marker></defs>
  <text x="310" y="50" text-anchor="middle" font-size="30" font-weight="bold" fill="var(--accent)">대화형 모드 (Interactive)</text>
  <circle cx="310" cy="260" r="150" fill="none" stroke="var(--accent)" stroke-width="4" stroke-dasharray="10 8"/>
  <rect x="200" y="85" width="220" height="60" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="310" y="124" text-anchor="middle" font-size="22" fill="var(--fg)">① &gt;&gt;&gt; 한 줄 입력</text>
  <rect x="370" y="330" width="220" height="60" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="480" y="369" text-anchor="middle" font-size="22" fill="var(--fg)">② Enter → 즉시 실행</text>
  <rect x="30" y="330" width="220" height="60" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="140" y="369" text-anchor="middle" font-size="22" fill="var(--fg)">③ 결과 확인</text>
  <text x="310" y="265" text-anchor="middle" font-size="22" fill="var(--muted)">반복</text>
  <text x="310" y="470" text-anchor="middle" font-size="21" fill="var(--muted)">계산기처럼 바로바로 · 간단한 확인용</text>
  <line x1="640" y1="40" x2="640" y2="490" stroke="var(--line)" stroke-width="3"/>
  <text x="960" y="50" text-anchor="middle" font-size="30" font-weight="bold" fill="var(--ok)">스크립트 모드 (Script)</text>
  <rect x="700" y="90" width="520" height="70" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="960" y="134" text-anchor="middle" font-size="22" fill="var(--fg)">① 편집기에 여러 줄의 코드 작성</text>
  <line x1="960" y1="165" x2="960" y2="205" stroke="var(--fg)" stroke-width="4" marker-end="url(#c1arrC)"/>
  <rect x="700" y="215" width="520" height="70" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="960" y="259" text-anchor="middle" font-size="22" fill="var(--fg)">② (파일로 저장) → ▶ 실행 / Ctrl+Enter</text>
  <line x1="960" y1="290" x2="960" y2="330" stroke="var(--fg)" stroke-width="4" marker-end="url(#c1arrC)"/>
  <rect x="700" y="340" width="520" height="70" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="960" y="384" text-anchor="middle" font-size="22" fill="var(--fg)">③ 위에서 아래로 전체 실행 → 결과</text>
  <text x="960" y="470" text-anchor="middle" font-size="21" fill="var(--muted)">저장 · 수정 · 재실행 · 긴 프로그램용</text>
</svg>`;

  const FIG_INSTALL = `<svg viewBox="0 0 1280 400" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <defs><marker viewBox="0 0 12 12" id="c1arrD" markerWidth="4.5" markerHeight="4.5" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="var(--fg)"/></marker></defs>
  ${[['①', '다운로드', 'python.org', 'Downloads'], ['②', '설치 파일 실행', '☑ Add Python', 'to PATH'], ['③', 'Customize', 'installation', '→ Next'], ['④', '설치 위치', 'C:\\Python\\', 'Python3xx'], ['⑤', 'Install', '→ 진행', '→ Close']].map(([n, a, b, c], i) => {
    const x = 30 + i * 250;
    return `<rect x="${x}" y="90" width="210" height="220" rx="18" fill="var(--card)" stroke="${i === 1 ? 'var(--danger)' : 'var(--accent)'}" stroke-width="4"/>
  <text x="${x + 105}" y="150" text-anchor="middle" font-size="36" font-weight="bold" fill="${i === 1 ? 'var(--danger)' : 'var(--accent)'}">${n}</text>
  <text x="${x + 105}" y="200" text-anchor="middle" font-size="24" font-weight="bold" fill="var(--fg)">${a}</text>
  <text x="${x + 105}" y="240" text-anchor="middle" font-size="20" fill="var(--muted)">${b}</text>
  <text x="${x + 105}" y="270" text-anchor="middle" font-size="20" fill="var(--muted)">${c}</text>` + (i < 4 ? `
  <line x1="${x + 213}" y1="200" x2="${x + 245}" y2="200" stroke="var(--fg)" stroke-width="4" marker-end="url(#c1arrD)"/>` : '');
  }).join('\n  ')}
  <text x="640" y="370" text-anchor="middle" font-size="22" fill="var(--danger)">② 의 PATH 체크를 빠뜨리면 명령 프롬프트에서 python 명령을 찾지 못합니다</text>
</svg>`;

  const idle = (lines) => `<div style="max-width:760px;margin:0 auto;border:2px solid var(--line);border-radius:10px;overflow:hidden;background:var(--card);font-size:15px">
<div style="padding:6px 12px;background:var(--line);color:var(--fg);font-weight:bold">🐍 IDLE Shell 3.x</div>
<div style="padding:4px 12px;border-bottom:1px solid var(--line);color:var(--muted);font-size:13px">File&nbsp;&nbsp; Edit&nbsp;&nbsp; Shell&nbsp;&nbsp; Debug&nbsp;&nbsp; Options&nbsp;&nbsp; Window&nbsp;&nbsp; Help</div>
<pre style="margin:0;padding:12px;min-height:120px;white-space:pre-wrap;font-family:monospace;line-height:1.5;background:transparent">${lines}</pre></div>`;
  const P = '<span style="color:var(--danger)">&gt;&gt;&gt; </span>';
  const OUT = (t) => `<span style="color:var(--accent)">${t}</span>`;
  const IDLE_START = idle(`Python 3.x.x (tags/v3.x.x ...) [MSC v.19xx 64 bit (AMD64)] on win32
Type "help", "copyright", "credits" or "license()" for more information.
${P}`);
  const IDLE_HELLO = idle(`Python 3.x.x (tags/v3.x.x ...) [MSC v.19xx 64 bit (AMD64)] on win32
Type "help", "copyright", "credits" or "license()" for more information.
${P}<span style="color:var(--ok)">print("Hello, world!")</span>
${OUT('Hello, world!')}
${P}`);

  const HELLO_LANGS = `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px">
<div style="border:2px solid var(--line);border-radius:10px;padding:10px;background:var(--card)"><b>C 프로그램</b><pre style="margin:6px 0 0;font-size:14px;white-space:pre">#include &lt;stdio.h&gt;
int main()
{
    printf("Hello, world!\\n");
    return 0;
}</pre></div>
<div style="border:2px solid var(--line);border-radius:10px;padding:10px;background:var(--card)"><b>자바 프로그램</b><pre style="margin:6px 0 0;font-size:14px;white-space:pre">public class HelloWorldApp {
  public static void main(String[] args) {
    System.out.println("Hello, world!");
  }
}</pre></div>
<div style="border:2px solid var(--warn);border-radius:10px;padding:10px;background:var(--card)"><b>파이썬 프로그램</b><pre style="margin:6px 0 0;font-size:14px;white-space:pre">print("Hello, world!")</pre><p style="margin:8px 0 0;color:var(--muted);font-size:13px">단 한 줄! 클래스·main 함수·세미콜론이 필요 없습니다.</p></div>
</div>`;

  PY_COURSE.addChapter({
    id: 'ch01',
    no: '01',
    title: '파이썬 들여다보기',
    subtitle: '프로그래밍 언어 · 파이썬 소개 · 설치와 첫 실행',
    summary: '프로그래밍 언어가 무엇인지, 파이썬은 어떤 특징을 가진 언어인지 알아보고, 파이썬을 설치하는 방법과 대화형 모드(>>> 셸) · 스크립트 모드(편집기)로 첫 파이썬 코드를 실행해 봅니다.',
    goals: [
      '프로그래밍 언어와 프로그래머의 의미를 설명하고, 대표적인 프로그래밍 언어를 말할 수 있다',
      '파이썬의 역사, 장점과 단점, 컴파일러 언어와 스크립트 언어의 차이를 설명할 수 있다',
      '내 컴퓨터에 맞는 파이썬을 내려받아 설치하고 IDLE 을 실행하는 과정을 설명할 수 있다',
      '대화형 모드(>>> 셸)에서 print() 와 계산식을 실행하고 결과를 확인할 수 있다',
      '스크립트 모드(편집기 + ▶ 실행)로 여러 줄의 간단한 파이썬 프로그램을 만들 수 있다'
    ],
    sections: [
      /* ───────────────────────── Section 01 ───────────────────────── */
      {
        id: 'ch01-1',
        title: '프로그래밍 언어의 개념과 종류',
        minutes: 50,
        goals: [
          '프로그래밍 언어와 프로그래머의 의미를 자신의 말로 설명할 수 있다',
          '컴퓨터가 기계어만 이해하기 때문에 프로그래밍 언어가 필요하다는 것을 이해한다',
          '대표적인 프로그래밍 언어(C/C++, 자바, HTML, PHP, 파이썬 등)와 쓰임새를 말할 수 있다',
          '이 강좌의 편집기에서 print() 로 첫 코드를 실행해 볼 수 있다',
          '함수 호출에서 괄호가 하는 역할을 설명할 수 있다',
          '파이썬의 주요 활용 분야와 표준 · 외부 라이브러리의 차이를 말할 수 있다'
        ],
        flow: [['도입: 이 장에서 배울 내용', 4], ['프로그래밍 언어 · 프로그래머', 10], ['첫 코드 실행 · 📘 함수 호출', 10], ['프로그래밍 언어의 종류 · 순위', 10], ['📘 활용 분야 지도 · 라이브러리', 8], ['정리 · 퀴즈 · 실습', 8]],
        content: [
          { type: 'h', text: '이 장에서 배울 내용' },
          { type: 'p', html: '이번 장은 파이썬 여행의 출발점입니다. 먼저 <b>프로그래밍 언어</b>가 무엇인지 알아보고(1교시), <b>파이썬</b>이 어떤 언어인지 살펴본 다음(2교시), 파이썬을 <b>설치하고 실행하는 방법</b>(3교시)과 <b>대화형 모드 · 스크립트 모드</b>로 첫 코드를 실행하는 방법(4교시)을 배웁니다.' },
          { type: 'list', items: [
            '<b>1교시</b> 프로그래밍 언어의 개념과 종류',
            '<b>2교시</b> 파이썬 소개 — 역사, 특징, 단점, 컴파일러 언어와 스크립트 언어',
            '<b>3교시</b> 파이썬 설치와 실행 — 내 PC 에 설치하기, IDLE, 이 강좌의 실행 환경',
            '<b>4교시</b> 대화형 모드와 스크립트 모드 — 첫 파이썬 프로그램 만들기'
          ] },
          { type: 'callout', kind: 'info', title: '이 강좌는 설치 없이 바로 실행됩니다', html: '이 사이트는 웹 브라우저 안에서 파이썬(Pyodide, Python 3.14)을 실행합니다. 본문의 코드 상자에 있는 <b>▶ 실행</b> 버튼을 누르면 바로 결과를 볼 수 있습니다. 내 컴퓨터에 파이썬을 설치하는 방법은 3교시에서 배웁니다.' },

          { type: 'h', text: '프로그래밍 언어란?' },
          { type: 'p', html: '컴퓨터는 스스로 생각하지 못합니다. 사람이 "무엇을, 어떤 순서로 하라"고 정확하게 알려 줘야만 움직입니다. 이때 컴퓨터에게 일을 시키기 위해 쓰는 약속된 말이 <b>프로그래밍 언어(programming language)</b>입니다. 우리가 매일 쓰는 엑셀, 한글, 웹 브라우저, 게임, 스마트폰 앱 같은 <b>소프트웨어(software)</b>는 모두 프로그래밍 언어로 만들어졌습니다.' },
          { type: 'p', html: '그리고 프로그래밍 언어로 소프트웨어나 앱을 만드는 사람을 <b>프로그래머(programmer)</b> 또는 개발자라고 부릅니다. 이 강좌를 마치면 여러분도 파이썬으로 작은 프로그램을 만드는 프로그래머가 됩니다.' },
          { type: 'figure', html: FIG_PROGRAMMER, caption: '그림 1-1 프로그래머가 프로그래밍 언어로 코드를 작성하면 소프트웨어(앱)가 만들어진다' },
          { type: 'table', head: ['용어', '뜻', '비유'], rows: [
            ['프로그래밍 언어', '컴퓨터가 알아들을 수 있도록 약속된 명령의 규칙', '요리 레시피를 적는 글자와 문법'],
            ['프로그램(코드)', '프로그래밍 언어로 작성한 명령의 모음', '한 편의 레시피'],
            ['프로그래머', '프로그래밍 언어로 프로그램을 만드는 사람', '레시피를 쓰는 요리사'],
            ['소프트웨어 · 앱', '프로그램이 완성되어 사용자가 쓰는 결과물', '완성된 요리']
          ], caption: '프로그래밍과 관련된 기본 용어' },
          { type: 'callout', kind: 'more', title: '컴퓨터는 0 과 1 만 안다 — 기계어와 고급 언어', html: '<p>컴퓨터의 두뇌인 CPU 가 직접 이해하는 것은 <code>10110000 01100001</code> 같은 0 과 1 의 나열, 즉 <b>기계어(machine language)</b>뿐입니다. 사람이 기계어로 프로그램을 짜기는 너무 어렵기 때문에, 사람의 말에 가까운 <b>고급 언어(high-level language)</b>를 만들고 이를 기계어로 <b>번역</b>해서 실행합니다.</p><ul><li><b>저급 언어</b>: 기계어, 어셈블리어 — 컴퓨터에 가깝고 사람이 읽기 어려움</li><li><b>고급 언어</b>: C, 자바, 파이썬 등 — 영어 단어와 수식을 사용해 사람이 읽기 쉬움</li></ul><p>파이썬은 고급 언어 중에서도 특히 영어 문장처럼 읽히도록 만들어진 언어입니다. 번역 방식(컴파일러 · 인터프리터)은 2교시에 배웁니다.</p>' },

          { type: 'h', text: '첫 명령 내려 보기' },
          { type: 'p', html: '아직 문법을 몰라도 괜찮습니다. 아래 코드는 파이썬에게 "괄호 안의 글자를 화면에 출력하라"고 명령합니다. <b>▶ 실행</b>을 눌러 결과를 확인해 보세요.' },
          { type: 'code', title: '추가 예제. 컴퓨터에게 인사 시키기', code: `print("안녕하세요!")
print("저는 파이썬으로 만든 첫 프로그램입니다.")
print("만나서 반갑습니다.")`, expect: '안녕하세요!\n저는 파이썬으로 만든 첫 프로그램입니다.\n만나서 반갑습니다.', desc: '<code>print()</code> 는 괄호 안의 내용을 화면에 출력하는 명령입니다. 글자는 큰따옴표(<code>"</code>)로 감쌉니다. 컴퓨터는 <b>1행 → 2행 → 3행</b> 순서대로 명령을 실행합니다. 따옴표 안의 문장을 바꿔서 다시 실행해 보세요.' },
          { type: 'code', title: '추가 예제. 컴퓨터는 계산을 잘해요', code: `print(123 + 456)
print(365 * 24)
print("1년은", 365 * 24, "시간입니다.")`, expect: '579\n8760\n1년은 8760 시간입니다.', desc: '따옴표 없이 쓴 <b>수식</b>은 계산된 결과가 출력되고, 따옴표로 감싼 <b>글자</b>는 그대로 출력됩니다. <code>3행</code>처럼 쉼표(<code>,</code>)로 여러 값을 나열하면 한 줄에 띄어서 출력됩니다.' },
          { type: 'callout', kind: 'more', title: 'print 뒤의 괄호는 무슨 뜻일까 — 함수 호출', html: '<p><code>print</code> 는 "화면에 출력하기"라는 일을 미리 만들어 둔 <b>함수(function)</b>의 이름입니다. 이름 뒤에 괄호를 붙인 <code>print(…)</code> 는 "그 일을 <b>지금 실행하라</b>"는 뜻이고, 이것을 <b>함수 호출(call)</b>이라고 합니다. 괄호 안에 넘겨 주는 값은 <b>인자(argument)</b>라고 부릅니다.</p><p>그래서 괄호 없이 <code>print</code> 라고만 쓰면 "실행하라"가 아니라 <b>함수 그 자체</b>를 가리키게 되어 아무 일도 일어나지 않습니다. "왜 출력이 안 되지?" 하는 실수의 흔한 원인입니다. 함수는 뒤의 장에서 직접 만들어 봅니다.</p>' },
          { type: 'code', title: '추가 예제. 괄호가 있을 때와 없을 때', code: `print("괄호가 있으면 실행됩니다")
print
print(print)`, expect: '괄호가 있으면 실행됩니다\n<built-in function print>', desc: '<code>2행</code>의 <code>print</code> 는 함수를 가리키기만 할 뿐 호출하지 않아서 아무것도 출력되지 않습니다. <code>3행</code>은 "print 라는 함수 자체"를 출력 대상으로 넘겼기 때문에 <code>&lt;built-in function print&gt;</code>(내장 함수 print)라는 설명이 나옵니다.' },

          { type: 'h', text: '프로그래밍 언어의 종류' },
          { type: 'p', html: '운동에 축구 · 농구 · 테니스 · 자전거처럼 여러 종목이 있고 종목마다 잘 맞는 상황이 다르듯이, 프로그래밍 언어도 <b>수백 가지</b>가 넘으며 각자 잘하는 분야가 있습니다. 그중 많이 쓰이는 언어는 <b>C/C++, 자바(Java), HTML, PHP, 파이썬(Python)</b> 등입니다.' },
          { type: 'table', head: ['언어', '특징', '주로 쓰이는 곳'], rows: [
            ['C / C++', '빠르고 하드웨어를 세밀하게 제어', '운영체제, 게임 엔진, 임베디드 기기'],
            ['자바(Java)', '한 번 작성하면 여러 운영체제에서 실행', '기업 · 은행 서버, 안드로이드 앱'],
            ['HTML', '웹 페이지의 구조(제목 · 문단 · 그림)를 표시', '웹 페이지 화면'],
            ['PHP', '웹 서버에서 페이지를 만들어 내는 언어', '게시판, 쇼핑몰 등 웹 사이트'],
            ['<b>파이썬(Python)</b>', '<b>쉽고 짧은 문법, 풍부한 라이브러리</b>', '<b>데이터 분석, 인공지능, 웹, 자동화, 교육</b>'],
            ['자바스크립트(JavaScript)', '웹 브라우저에서 동작', '웹 페이지의 움직임 · 웹 앱']
          ], caption: '많이 사용되는 프로그래밍 언어' },
          { type: 'callout', kind: 'info', title: 'HTML 은 프로그래밍 언어일까?', html: 'HTML 은 "여기는 제목, 여기는 그림" 처럼 문서의 <b>구조를 표시</b>하는 <b>마크업 언어(markup language)</b>입니다. 조건에 따라 다르게 동작하거나 반복하는 기능이 없어서 엄밀하게는 프로그래밍 언어로 보지 않는 경우가 많습니다. 하지만 웹을 만들 때 꼭 필요하므로 흔히 함께 소개됩니다.' },
          { type: 'h', text: '프로그래밍 언어의 인기 순위' },
          { type: 'p', html: 'TIOBE 라는 회사는 검색 엔진에서 각 언어가 얼마나 많이 언급되는지를 조사해 매달 <b>프로그래밍 언어 인기 순위</b>를 발표합니다. 아래는 강의자료에 실린 2021년 6월 순위입니다. 파이썬은 오랫동안 1위였던 C 언어를 바짝 뒤쫓는 2위였습니다.' },
          { type: 'figure', html: FIG_TIOBE, caption: '그림 1-3 프로그래밍 언어 순위 (출처: TIOBE Index, 2021년 6월 — 상위 10개)' },
          { type: 'callout', kind: 'more', title: '그 뒤 파이썬은?', html: '파이썬은 2021년 가을 TIOBE 순위에서 처음으로 <b>1위</b>에 올랐고, 그 뒤로도 줄곧 최상위권을 지키고 있습니다. 인공지능(AI) · 데이터 과학 붐, 그리고 "처음 배우는 언어"로 학교와 기업에서 널리 채택된 것이 큰 이유입니다. 순위는 매달 바뀌므로 궁금하면 <code>tiobe.com/tiobe-index</code> 에서 최신 순위를 확인해 보세요.' },
          { type: 'callout', kind: 'tip', title: '어떤 언어를 먼저 배워야 할까?', html: '첫 언어로는 <b>문법이 간단하고 결과를 바로 확인할 수 있는 언어</b>가 좋습니다. 프로그래밍의 핵심 개념(변수, 조건문, 반복문, 함수)은 거의 모든 언어에 공통이므로, 파이썬으로 개념을 익혀 두면 나중에 다른 언어도 훨씬 빨리 배울 수 있습니다.' },

          { type: 'h', text: '📘 파이썬으로 무엇을 만들까 — 분야별 지도' },
          { type: 'p', html: '"파이썬을 배우면 뭘 할 수 있나요?" 는 가장 많이 나오는 질문입니다. 파이썬이 강한 이유는 문법이 쉬워서만이 아니라, 분야마다 <b>이미 잘 만들어진 도구(라이브러리)</b>가 준비되어 있기 때문입니다. 지금 당장 다 알 필요는 없고, "이 강좌를 마치면 이런 길이 이어진다"는 지도로만 봐 두세요.' },
          { type: 'table', head: ['분야', '대표 라이브러리', '무엇을 하나', '이 강좌에서'], rows: [
            ['데이터 분석', '<code>pandas</code>, <code>NumPy</code>, <code>matplotlib</code>', '표 형태 데이터 정리 · 통계 · 그래프', '리스트 · 파일 입출력이 바탕'],
            ['인공지능(AI)', '<code>scikit-learn</code>, <code>PyTorch</code>', '데이터로 규칙을 학습시켜 예측', '함수 · 리스트 · 반복문이 바탕'],
            ['웹 개발', '<code>Django</code>, <code>Flask</code>, <code>FastAPI</code>', '웹 사이트 · API 서버 만들기', '함수 · 클래스가 바탕'],
            ['업무 자동화', '<code>openpyxl</code>, <code>requests</code>, <code>pathlib</code>', '엑셀 정리, 파일 정리, 자료 수집', '파일 입출력 장에서 맛보기'],
            ['GUI · 게임', '<code>tkinter</code>, <code>pygame</code>, <code>turtle</code>', '창이 뜨는 프로그램, 2D 게임', '이 강좌에서 직접 만듭니다'],
            ['교육 · 연구', '<code>Jupyter</code>, <code>SymPy</code>', '노트북 형식 실험, 수식 계산', '대화형 모드와 같은 방식']
          ], caption: '파이썬의 주요 활용 분야와 대표 라이브러리' },
          { type: 'callout', kind: 'more', title: '표준 라이브러리와 외부 라이브러리 — pip 와 PyPI', html: '<ul><li><b>표준 라이브러리(standard library)</b>: 파이썬을 설치하면 <b>같이 딸려 오는</b> 기능 묶음입니다. <code>math</code>(수학), <code>random</code>(난수), <code>datetime</code>(날짜), <code>calendar</code>(달력), <code>statistics</code>(통계), <code>json</code>, <code>csv</code> 등 200개가 넘습니다. <b>설치 없이 <code>import</code> 만 하면</b> 바로 쓸 수 있습니다.</li><li><b>외부 라이브러리</b>: 전 세계 개발자가 만들어 <b>PyPI</b>(Python Package Index, <code>pypi.org</code>)에 올려 둔 것으로, 60만 개가 넘습니다. <code>pip install pandas</code> 처럼 <b>pip</b> 명령으로 내려받아 씁니다. (자세한 내용은 3교시)</li></ul><p>파이썬 세계에는 <b>"바퀴를 다시 발명하지 마라(Don\'t reinvent the wheel)"</b> 는 말이 있습니다. 새 문제를 만나면 먼저 "이미 만들어 둔 사람이 있지 않을까?" 하고 찾아보는 습관이 실력을 크게 바꿉니다.</p>' },
          { type: 'code', title: '추가 예제. 설치 없이 바로 쓰는 표준 라이브러리', code: `import math
import statistics

scores = [88, 92, 79, 95, 61]

print("평균:", statistics.mean(scores))
print("최고점:", max(scores))
print("최저점:", min(scores))
print("2의 제곱근:", round(math.sqrt(2), 4))`, expect: '평균: 83\n최고점: 95\n최저점: 61\n2의 제곱근: 1.4142', desc: '평균을 구하는 공식을 직접 짜지 않아도 <code>statistics.mean()</code> 하나면 끝납니다. <code>max()</code>, <code>min()</code>, <code>round()</code> 는 <code>import</code> 조차 필요 없는 <b>내장 함수(built-in function)</b>입니다. 리스트(<code>[ ]</code>)와 모듈은 뒤의 장에서 자세히 배웁니다.' },
          { type: 'callout', kind: 'tip', title: '모르는 이름을 만났을 때', html: '코드에서 처음 보는 이름이 나와도 겁먹을 필요 없습니다. 지금 단계에서는 <b>① 무엇을 하는 코드인지</b>, <b>② 결과가 어떻게 바뀌는지</b>만 보면 충분합니다. 값을 바꿔 가며 ▶ 실행해 보는 것이 설명을 열 번 읽는 것보다 빠릅니다.' }
        ],
        practice: [
          {
            title: '실습 1-1. 나를 소개하는 프로그램',
            level: 1,
            desc: '<p><code>print()</code> 를 세 번 사용하여 아래와 같이 출력하세요.</p><pre>이름: 홍길동\n학과: 컴퓨터공학과\n목표: 파이썬으로 나만의 프로그램 만들기</pre>',
            hint: '한 줄마다 <code>print("...")</code> 를 한 번씩 씁니다. 글자는 큰따옴표로 감쌉니다.',
            starter: '# TODO: print() 를 세 번 사용해 자기소개를 출력하세요\n',
            solution: 'print("이름: 홍길동")\nprint("학과: 컴퓨터공학과")\nprint("목표: 파이썬으로 나만의 프로그램 만들기")\n',
            expect: '이름: 홍길동\n학과: 컴퓨터공학과\n목표: 파이썬으로 나만의 프로그램 만들기'
          },
          {
            title: '실습 1-2. 프로그래밍 언어 목록과 계산',
            level: 1,
            desc: '<p>많이 쓰이는 프로그래밍 언어 다섯 가지를 번호와 함께 출력하고, 마지막 줄에 언어의 개수를 <b>계산식</b> <code>2 + 3</code> 으로 출력하세요.</p><pre>1. C/C++\n2. Java\n3. HTML\n4. PHP\n5. Python\n언어 개수: 5</pre>',
            hint: '마지막 줄은 <code>print("언어 개수:", 2 + 3)</code> 처럼 쉼표로 글자와 계산식을 함께 출력합니다.',
            starter: '# TODO: 언어 다섯 개를 한 줄씩 출력\n\n# TODO: "언어 개수:" 와 2 + 3 의 결과를 한 줄에 출력\n',
            solution: 'print("1. C/C++")\nprint("2. Java")\nprint("3. HTML")\nprint("4. PHP")\nprint("5. Python")\nprint("언어 개수:", 2 + 3)\n',
            expect: '1. C/C++\n2. Java\n3. HTML\n4. PHP\n5. Python\n언어 개수: 5'
          },
          {
            title: '실습 1-3. 컴퓨터에게 계산 시키기',
            level: 1,
            desc: '<p>사람이 암산하기 번거로운 단위 환산을 컴퓨터에게 시켜 봅시다. 아래와 같이 출력하세요. <b>숫자는 직접 적지 말고 계산식으로</b> 넣습니다. (예: 1시간의 초 = <code>60 * 60</code>)</p><pre>1분 = 60 초\n1시간 = 3600 초\n1일 = 86400 초\n1년 = 31536000 초</pre>',
            hint: '<code>print("1시간 =", 60 * 60, "초")</code> 처럼 글자와 계산식을 쉼표로 이어 씁니다. 1일은 <code>24 * 60 * 60</code>, 1년은 <code>365 * 24 * 60 * 60</code> 입니다.',
            starter: 'print("1분 =", 60, "초")\n# TODO: 1시간, 1일, 1년의 초를 계산식으로 출력\n',
            solution: 'print("1분 =", 60, "초")\nprint("1시간 =", 60 * 60, "초")\nprint("1일 =", 24 * 60 * 60, "초")\nprint("1년 =", 365 * 24 * 60 * 60, "초")\n',
            expect: '1분 = 60 초\n1시간 = 3600 초\n1일 = 86400 초\n1년 = 31536000 초'
          },
          {
            title: '실습 1-4. 파이썬 활용 분야 안내문',
            level: 2,
            desc: '<p>본문의 "분야별 지도"를 참고하여 아래와 같은 안내문을 출력하세요. 마지막 줄의 두 숫자는 <b>계산식</b>으로 넣습니다. (분야는 4개, 분야마다 라이브러리 2개)</p><pre>[파이썬으로 할 수 있는 일]\n- 데이터 분석 : pandas, NumPy\n- 인공지능   : scikit-learn, PyTorch\n- 웹 개발    : Django, Flask\n- 업무 자동화 : openpyxl, requests\n소개한 분야 4 개, 라이브러리 8 개</pre>',
            hint: '마지막 줄은 <code>print("소개한 분야", 4, "개, 라이브러리", 4 * 2, "개")</code> 처럼 씁니다.',
            starter: 'print("[파이썬으로 할 수 있는 일]")\n# TODO: 네 분야를 한 줄씩 출력\n\n# TODO: 분야 수와 라이브러리 수를 계산식으로 출력\n',
            solution: 'print("[파이썬으로 할 수 있는 일]")\nprint("- 데이터 분석 : pandas, NumPy")\nprint("- 인공지능   : scikit-learn, PyTorch")\nprint("- 웹 개발    : Django, Flask")\nprint("- 업무 자동화 : openpyxl, requests")\nprint("소개한 분야", 4, "개, 라이브러리", 4 * 2, "개")\n',
            expect: '[파이썬으로 할 수 있는 일]\n- 데이터 분석 : pandas, NumPy\n- 인공지능   : scikit-learn, PyTorch\n- 웹 개발    : Django, Flask\n- 업무 자동화 : openpyxl, requests\n소개한 분야 4 개, 라이브러리 8 개'
          },
          {
            title: '실습 1-5. 나의 파이썬 학습 계획표',
            level: 2,
            desc: '<p>하루 <b>30분</b>씩, 주 <b>5일</b>, <b>12주</b> 동안 공부한다고 할 때 총 공부 시간을 계산해 출력하세요. 숫자는 모두 계산식으로 구합니다.</p><pre>[나의 파이썬 학습 계획]\n하루 공부 시간: 30 분\n주당 공부 일수: 5 일\n계획 기간: 12 주\n총 공부 시간: 1800 분\n시간으로 바꾸면: 30.0 시간</pre><p>마지막 줄은 분을 60으로 나눈 값입니다. 파이썬에서 <code>/</code> 로 나누면 결과가 <code>30.0</code> 처럼 소수로 나옵니다.</p>',
            hint: '총 분 = <code>30 * 5 * 12</code>, 시간 = <code>30 * 5 * 12 / 60</code>. 같은 식을 두 번 써도 괜찮습니다.',
            starter: 'print("[나의 파이썬 학습 계획]")\nprint("하루 공부 시간:", 30, "분")\n# TODO: 주당 일수, 기간, 총 분, 총 시간을 출력\n',
            solution: 'print("[나의 파이썬 학습 계획]")\nprint("하루 공부 시간:", 30, "분")\nprint("주당 공부 일수:", 5, "일")\nprint("계획 기간:", 12, "주")\nprint("총 공부 시간:", 30 * 5 * 12, "분")\nprint("시간으로 바꾸면:", 30 * 5 * 12 / 60, "시간")\n',
            expect: '[나의 파이썬 학습 계획]\n하루 공부 시간: 30 분\n주당 공부 일수: 5 일\n계획 기간: 12 주\n총 공부 시간: 1800 분\n시간으로 바꾸면: 30.0 시간'
          },
          {
            title: '실습 1-6. 도전! 언어 비교 막대그래프',
            level: 3,
            desc: '<p>세 언어의 Hello World 코드 줄 수를 <b>글자 막대그래프</b>로 그려 보세요. 막대는 <code>#</code> 을 줄 수만큼 반복해서 만듭니다.</p><p>파이썬에서는 <b>문자열에 정수를 곱하면 그 횟수만큼 반복</b>됩니다. 예를 들어 <code>"#" * 6</code> 은 <code>######</code> 이 됩니다. (문자열 연산은 뒤의 장에서 배웁니다)</p><pre>+-------------------------------+\n|  Hello World 코드 줄 수 비교  |\n+-------------------------------+\n| C      : ###### 6 줄\n| Java   : ##### 5 줄\n| Python : # 1 줄\n+-------------------------------+\n파이썬은 C 보다 5 줄 적습니다.\nC 한 개를 쓸 6 줄이면 파이썬 프로그램 6 개!</pre>',
            hint: '테두리 줄도 <code>"+" + "-" * 31 + "+"</code> 처럼 만들 수 있지만, 그냥 통째로 따옴표 안에 적어도 됩니다. 마지막 두 줄의 숫자는 <code>6 - 1</code> 과 <code>6</code> 을 계산식으로 넣으세요.',
            starter: 'print("+-------------------------------+")\nprint("|  Hello World 코드 줄 수 비교  |")\nprint("+-------------------------------+")\n# TODO: "#" * 줄수 로 막대 세 줄 출력\n\n# TODO: 아래 테두리와 비교 문장 두 줄 출력\n',
            solution: 'print("+-------------------------------+")\nprint("|  Hello World 코드 줄 수 비교  |")\nprint("+-------------------------------+")\nprint("| C      :", "#" * 6, 6, "줄")\nprint("| Java   :", "#" * 5, 5, "줄")\nprint("| Python :", "#" * 1, 1, "줄")\nprint("+-------------------------------+")\nprint("파이썬은 C 보다", 6 - 1, "줄 적습니다.")\nprint("C 한 개를 쓸 6 줄이면 파이썬 프로그램", 6, "개!")\n',
            expect: '+-------------------------------+\n|  Hello World 코드 줄 수 비교  |\n+-------------------------------+\n| C      : ###### 6 줄\n| Java   : ##### 5 줄\n| Python : # 1 줄\n+-------------------------------+\n파이썬은 C 보다 5 줄 적습니다.\nC 한 개를 쓸 6 줄이면 파이썬 프로그램 6 개!'
          }
        ],
        quiz: [
          { q: '컴퓨터에서 동작하는 소프트웨어를 만들기 위해 사용하는, 컴퓨터가 이해하는 말(도구)을 무엇이라고 하나요?', options: ['운영체제', '프로그래밍 언어', '하드웨어', '웹 브라우저'], answer: 1,
            explain: '<b>프로그래밍 언어</b>는 컴퓨터에게 일을 시키기 위해 약속된 말로, 이것으로 소프트웨어를 만듭니다.' },
          { q: 'CPU 가 직접 이해할 수 있는 언어는?', options: ['파이썬', '자바', '기계어', 'HTML'], answer: 2,
            explain: 'CPU 는 0 과 1 로 된 <b>기계어</b>만 이해합니다. 파이썬 같은 고급 언어는 기계어로 번역되어 실행됩니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>print("10 + 20")\nprint(10 + 20)</code></pre>', options: ['10 + 20 과 10 + 20', '30 과 30', '10 + 20 과 30', '30 과 10 + 20'], answer: 2,
            explain: '따옴표로 감싼 <code>"10 + 20"</code> 은 글자 그대로, 따옴표가 없는 <code>10 + 20</code> 은 계산 결과 <code>30</code> 이 출력됩니다.' },
          { q: '다음 중 웹 페이지의 구조를 표시하는 <b>마크업 언어</b>는?', options: ['C++', 'HTML', 'Python', 'Java'], answer: 1,
            explain: 'HTML 은 제목 · 문단 · 그림 같은 문서 구조를 표시하는 마크업 언어입니다.' },
          { q: '다음 코드를 실행하면 화면에 몇 줄이 출력될까요?<pre><code>print("A")\nprint\nprint("B")</code></pre>', options: ['3줄', '2줄', '1줄', '오류가 발생한다'], answer: 1,
            explain: '<code>print</code> 는 괄호가 없으므로 <b>호출되지 않고</b> 함수를 가리키기만 합니다. 실제로 출력되는 것은 <code>A</code> 와 <code>B</code> 두 줄입니다.' },
          { q: '<code>pandas</code> 나 <code>Django</code> 처럼 다른 사람이 만들어 <code>pypi.org</code> 에 올려 둔 라이브러리를 내 컴퓨터에 설치할 때 사용하는 도구는?', options: ['IDLE', 'pip', 'PATH', 'msinfo32'], answer: 1,
            explain: '<b>pip</b> 은 PyPI 에 올라온 <b>외부 라이브러리</b>를 내려받아 설치하는 도구입니다. <code>math</code>, <code>calendar</code> 같은 <b>표준 라이브러리</b>는 설치 없이 <code>import</code> 만으로 씁니다.' }
        ],
        slides: [
          { layout: 'title', title: '프로그래밍 언어의 개념과 종류', subtitle: 'Chapter 01 파이썬 들여다보기 · Section 01', badge: '1교시',
            notes: '<p>첫 시간입니다. 강좌 운영 방식(웹 브라우저에서 바로 코드 실행, 실습 · 퀴즈)을 먼저 안내합니다.</p><p><b>발문</b>: "오늘 아침부터 지금까지 사용한 소프트웨어(앱)를 말해 볼까요?" — 알람, 메신저, 지도, 게임 등 → 모두 누군가 프로그래밍 언어로 만든 것임을 연결합니다.</p><p>시간: 2분</p>' },
          { layout: 'bullets', title: '이 장에서 배울 내용', lead: '파이썬 여행의 출발점',
            bullets: ['1교시 프로그래밍 언어의 개념과 종류', '2교시 파이썬 소개 (역사 · 특징 · 단점)', '3교시 파이썬 설치와 실행 (IDLE · 이 강좌 환경)', '4교시 대화형 모드 · 스크립트 모드로 첫 프로그램'],
            notes: '<p>장 전체의 흐름을 보여 줍니다. 강의자료의 학습목표(프로그래밍 언어 이해, 파이썬 이해, 설치, 간단한 프로그램 작성)와 같습니다.</p><p>이 사이트는 설치 없이 실행된다는 점을 강조하고, 집에서 설치하는 방법은 3교시에 다룬다고 예고합니다.</p><p>시간: 3분</p>' },
          { layout: 'bullets', title: '프로그래밍 언어란?',
            bullets: ['<b>프로그래밍 언어</b>: 컴퓨터가 알아듣는 약속된 말', ['이 말로 소프트웨어를 만든다', ['엑셀, 한글, 웹 브라우저, 게임, 앱 …']], '<b>프로그래머</b>: 프로그래밍 언어로 소프트웨어 · 앱을 만드는 사람', '비유: 레시피(코드) → 요리사(프로그래머) → 요리(앱)'],
            notes: '<p>강의자료 3쪽. 정의를 외우게 하기보다 "컴퓨터에게 일을 시키는 말"이라는 핵심만 전달합니다.</p><p><b>발문</b>: "컴퓨터는 왜 우리말(한국어)로 시키면 안 될까요?" → 한국어는 뜻이 모호함(예: "적당히 끓여") → 프로그래밍 언어는 뜻이 하나로 정해진 말.</p><p>시간: 4분</p>' },
          { layout: 'diagram', title: '프로그래머 → 프로그래밍 언어 → 소프트웨어', html: FIG_PROGRAMMER, caption: '그림 1-1 프로그래머, 프로그래밍 언어, 소프트웨어',
            notes: '<p>강의자료의 그림 1-1 을 다시 그린 것입니다. 왼쪽에서 오른쪽으로 짚어 가며 설명합니다.</p><p>가운데 코드 창의 <code>print("Hi")</code> 는 오늘 직접 써 볼 코드라고 예고합니다.</p><p>시간: 2분</p>' },
          { layout: 'bullets', title: '📘 컴퓨터는 0 과 1 만 안다',
            bullets: ['CPU 가 이해하는 말 = <b>기계어</b> (0 과 1)', '사람이 쓰기 쉬운 말 = <b>고급 언어</b> (C, 자바, 파이썬)', '고급 언어 → 기계어로 <b>번역</b>해서 실행', '파이썬은 영어 문장처럼 읽히는 고급 언어'],
            notes: '<p>강의자료에 없는 보충 내용입니다. 2교시의 "컴파일러 vs 인터프리터"를 이해하는 바탕이 됩니다.</p><p>통역사 비유: 한국어(파이썬) → 통역사(번역 프로그램) → 영어(기계어).</p><p>시간: 3분</p>' },
          { layout: 'code', title: '첫 명령 내려 보기', code: `print("안녕하세요!")
print("저는 파이썬으로 만든 첫 프로그램입니다.")
print(123 + 456)
print("1년은", 365 * 24, "시간입니다.")`,
            points: ['<code>print()</code>: 괄호 안의 내용을 화면에 출력', '따옴표 안 → 글자 그대로', '따옴표 없는 수식 → 계산 결과', '위에서 아래로 한 줄씩 실행'],
            notes: '<p>교사 화면에서 ▶ 실행으로 보여 준 뒤, 학생들도 본문의 예제를 실행하게 합니다.</p><p>따옴표 안의 문장을 자기 이름으로 바꿔 보게 하면 흥미를 끌 수 있습니다.</p><p><b>주의</b>: 따옴표를 한쪽만 쓰면 오류가 납니다. 오류 메시지는 4교시에 자세히 다룹니다.</p><p>시간: 6분</p>' },
          { layout: 'table', title: '프로그래밍 언어의 종류', lead: '수백 가지 언어 — 종목마다 잘 맞는 운동이 다르듯이',
            head: ['언어', '주로 쓰이는 곳'], rows: [
              ['C / C++', '운영체제, 게임 엔진, 임베디드'], ['자바', '기업 서버, 안드로이드 앱'], ['HTML', '웹 페이지 구조 (마크업 언어)'], ['PHP', '웹 사이트 서버'], ['<b>파이썬</b>', '<b>AI · 데이터 분석 · 웹 · 자동화 · 교육</b>']],
            notes: '<p>강의자료 4쪽의 "스포츠와 프로그래밍 언어 비교" 그림을 말로 설명합니다: 공으로 하는 운동도 축구 · 농구 · 테니스가 다르듯, 언어마다 잘하는 분야가 있다.</p><p>HTML 은 엄밀히는 마크업 언어라는 점을 짧게 언급합니다.</p><p><b>발문</b>: "들어 본 프로그래밍 언어가 있나요?"</p><p>시간: 5분</p>' },
          { layout: 'diagram', title: '프로그래밍 언어 인기 순위', html: FIG_TIOBE, caption: 'TIOBE Index 2021년 6월 (강의자료 그림 1-3). 파이썬은 2021년 가을부터 1위권',
            notes: '<p>강의자료 5쪽의 표를 막대그래프로 바꾼 것입니다. 상위 10개만 보여 줍니다.</p><p>2021년 6월에는 2위였지만 그해 가을 처음 1위에 올랐고 지금도 최상위권이라는 점을 덧붙입니다. 시간이 있으면 tiobe.com 에서 최신 순위를 함께 봅니다.</p><p>시간: 4분</p>' },
          { layout: 'bullets', title: '📘 print 뒤의 괄호 = 함수 호출', lead: '이름만 부르는 것과, 실제로 시키는 것은 다르다',
            bullets: ['<code>print</code> = "출력하기"라는 일의 <b>이름</b>(함수)', '<code>print(…)</code> = 그 일을 <b>지금 실행하라</b> (호출)', '괄호 안의 값 = <b>인자</b>(argument)', '괄호를 빠뜨리면 → 아무 일도 일어나지 않음'],
            notes: '<p>강의자료에 없는 보충 내용입니다. 2교시 이후 "왜 출력이 안 되지?" 라는 질문의 상당수가 여기서 옵니다.</p><p><b>발문</b>: "전등 스위치의 <b>이름</b>을 부르는 것과 스위치를 <b>누르는</b> 것은 다르죠?" 괄호가 곧 스위치를 누르는 동작입니다.</p><p>본문의 "괄호가 있을 때와 없을 때" 예제를 실행해 <code>&lt;built-in function print&gt;</code> 를 함께 봅니다.</p><p>시간: 4분</p>' },
          { layout: 'table', title: '📘 파이썬으로 무엇을 만들까', lead: '문법이 쉬워서만이 아니라 — 분야마다 도구가 준비되어 있다',
            head: ['분야', '대표 라이브러리', '하는 일'], rows: [
              ['데이터 분석', '<code>pandas</code>, <code>NumPy</code>', '표 정리 · 통계 · 그래프'],
              ['인공지능', '<code>scikit-learn</code>, <code>PyTorch</code>', '학습 · 예측'],
              ['웹 개발', '<code>Django</code>, <code>Flask</code>', '웹 사이트 · API 서버'],
              ['업무 자동화', '<code>openpyxl</code>, <code>requests</code>', '엑셀 · 파일 · 자료 수집'],
              ['GUI · 게임', '<code>tkinter</code>, <code>pygame</code>', '창이 뜨는 프로그램, 2D 게임']],
            notes: '<p>보충 내용입니다. 첫 시간에 "이걸 배우면 어디까지 갈 수 있나"를 보여 주면 동기가 크게 올라갑니다.</p><p>표준 라이브러리(설치하면 딸려 옴)와 외부 라이브러리(<code>pip install</code> 로 설치, PyPI 에 60만 개 이상)의 차이를 한 줄로 짚습니다. pip 는 3교시에 자세히.</p><p><b>발문</b>: "여러분이 만들고 싶은 프로그램은 어느 칸에 있나요?"</p><p>시간: 5분</p>' },
          { layout: 'code', title: '📘 설치 없이 바로 쓰는 표준 라이브러리', code: `import math
import statistics

scores = [88, 92, 79, 95, 61]

print("평균:", statistics.mean(scores))
print("최고점:", max(scores))
print("2의 제곱근:", round(math.sqrt(2), 4))`,
            points: ['평균 공식을 직접 짤 필요가 없다', '<code>import</code> = 도구 상자 꺼내기', '<code>max</code> · <code>round</code> 는 import 도 불필요', '"바퀴를 다시 발명하지 마라"'],
            notes: '<p>아직 리스트 · 모듈을 배우지 않았으므로 문법은 설명하지 않고 <b>결과</b>만 보게 합니다.</p><p>점수 값을 학생들이 부르는 숫자로 바꿔 즉석에서 실행하면 반응이 좋습니다.</p><p>시간: 4분</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '다음 코드의 실행 결과는?<pre><code>print("10 + 20")\nprint(10 + 20)</code></pre>', options: ['10 + 20 / 10 + 20', '30 / 30', '10 + 20 / 30', '30 / 10 + 20'], answer: 2,
            explain: '따옴표 안은 글자 그대로, 따옴표 없는 수식은 계산 결과가 출력됩니다.',
            notes: '<p>손가락으로 보기 번호를 들게 합니다. 헷갈려하면 바로 실행해서 확인합니다.</p><p>시간: 2분</p>' },
          { layout: 'practice', title: '실습 1-1. 나를 소개하는 프로그램', desc: '<code>print()</code> 를 세 번 사용하여 이름, 학과, 목표를 한 줄씩 출력하세요.',
            starter: '# TODO: print() 를 세 번 사용해 자기소개를 출력하세요\n',
            solution: 'print("이름: 홍길동")\nprint("학과: 컴퓨터공학과")\nprint("목표: 파이썬으로 나만의 프로그램 만들기")\n',
            notes: '<p>3~4분 개별 실습. 자주 나오는 실수: 따옴표를 한쪽만 닫음, 괄호 누락, <code>Print</code> 처럼 대문자로 씀.</p><p>빨리 끝낸 학생에게는 실습 1-2 를 안내합니다.</p><p>시간: 4분</p>' },
          { layout: 'summary', title: '정리', bullets: ['프로그래밍 언어: 컴퓨터에게 일을 시키는 약속된 말', '프로그래머: 프로그래밍 언어로 소프트웨어를 만드는 사람', 'CPU 는 기계어만 이해 → 고급 언어를 번역해 실행', '많이 쓰는 언어: C/C++, 자바, HTML, PHP, 파이썬 …', '다음 시간: 파이썬은 어떤 언어일까?'],
            notes: '<p>핵심 용어 세 개(프로그래밍 언어, 프로그래머, 기계어)를 다시 짚습니다.</p><p>시간: 2분</p>' }
        ]
      },

      /* ───────────────────────── Section 02 ───────────────────────── */
      {
        id: 'ch01-2',
        title: '파이썬 소개',
        minutes: 50,
        goals: [
          '파이썬을 만든 사람과 발표 연도, 이름의 유래를 말할 수 있다',
          '파이썬의 장점 5가지와 단점을 설명할 수 있다',
          'print() 로 원하는 내용을 화면에 출력할 수 있다',
          '컴파일러 언어와 스크립트(인터프리터) 언어의 차이를 설명할 수 있다',
          'C · 자바 · 파이썬의 Hello World 프로그램을 비교할 수 있다',
          '소스 코드 → 바이트코드 → PVM 의 실행 단계를 설명하고, 문법 오류와 실행 중 오류가 생기는 시점을 구분할 수 있다',
          'CPython 외의 구현체(PyPy · Jython · MicroPython · Pyodide)의 성격을 간단히 말할 수 있다',
          'time.perf_counter() 로 코드 구간의 실행 시간을 재고 두 방법의 속도를 비교할 수 있다'
        ],
        flow: [['파이썬의 역사 · 📘 구현체', 7], ['파이썬의 특징 · 단점', 10], ['📘 실행 시간 측정 맛보기', 5], ['실행 화면 · print() 기초', 8], ['컴파일러 vs 스크립트 · 📘 바이트코드와 PVM', 12], ['Hello World 비교 · 정리 · 퀴즈', 8]],
        content: [
          { type: 'h', text: '파이썬의 역사' },
          { type: 'p', html: '<b>파이썬(Python)</b>은 문법이 쉽고 코드를 입력하면 결과를 바로 확인할 수 있어서 <b>처음 프로그래밍을 배우는 사람에게 잘 맞는 언어</b>입니다. 네덜란드의 프로그래머 <b>귀도 반 로섬(Guido van Rossum, 1956년~)</b>이 C 언어로 만들어 <b>1991년</b>에 처음 공개했습니다.' },
          { type: 'p', html: 'Python 은 영어로 <b>비단뱀</b>이라는 뜻입니다. 그래서 파이썬 로고도 <b>파란색 뱀과 노란색 뱀 두 마리가 서로 얽힌 모양</b>입니다.' },
          { type: 'figure', html: FIG_TIMELINE, caption: '파이썬의 발자취 — 1991년 공개 이후 꾸준히 발전해 왔다' },
          { type: 'callout', kind: 'more', title: '이름은 사실 뱀이 아니라 코미디 프로그램에서!', html: '귀도 반 로섬은 1989년 성탄절 휴가 동안 취미로 파이썬을 만들기 시작했습니다. 이름은 그가 좋아하던 영국 코미디 프로그램 <b>"몬티 파이썬의 날아다니는 서커스(Monty Python\'s Flying Circus)"</b>에서 따왔다고 합니다. 짧고 기억하기 쉬우며 조금 신비로운 이름을 원했다고 하네요. 이름의 뜻이 비단뱀이다 보니 로고와 마스코트는 뱀이 되었습니다.' },
          { type: 'h', text: '파이썬의 다양한 종류' },
          { type: 'p', html: '귀도 반 로섬이 만든 원래의 파이썬은 C 언어로 만들어졌기 때문에 <b>CPython</b> 이라고도 부릅니다. 보통 "파이썬"이라고 하면 이 CPython 을 뜻합니다. 그 밖에도 여러 개발자와 프로젝트가 파이썬에서 갈라져 나온(분기된) 파이썬을 만들었습니다.' },
          { type: 'table', head: ['이름', '특징'], rows: [
            ['<b>CPython</b>', 'C 언어로 만든 표준 파이썬 (python.org 에서 내려받는 것)'],
            ['Jython', '자바로 구현한 파이썬 — 자바 프로그램과 함께 사용'],
            ['IronPython', 'C# (.NET) 으로 구현한 파이썬'],
            ['PyPy', '파이썬으로 작성한 파이썬 — 실행 속도를 높이는 데 초점'],
            ['Stackless Python', 'CPython 의 C 스택 문제를 없앤 파이썬'],
            ['IPython', 'CPython 에 편리한 대화형 기능을 더한 셸 (주피터 노트북의 바탕)'],
            ['Brython', '웹 브라우저에서 실행되는 파이썬']
          ], caption: '파이썬의 다양한 분류' },
          { type: 'callout', kind: 'more', title: '이 강좌의 파이썬은? — Pyodide', html: '이 사이트에서 실행되는 파이썬은 <b>Pyodide</b> 입니다. Pyodide 는 <b>CPython 을 웹어셈블리(WebAssembly)로 바꿔서</b> 웹 브라우저 안에서 돌아가게 만든 것입니다. 그래서 python.org 의 파이썬과 문법 · 결과가 거의 같습니다. 아래 코드를 실행해 지금 어떤 파이썬이 실행 중인지 확인해 보세요. (실행하는 곳에 따라 결과가 다를 수 있습니다)' },
          { type: 'code', title: '추가 예제. 지금 실행 중인 파이썬 확인하기', code: `import sys

print("파이썬 구현:", sys.implementation.name)
print("파이썬 버전:", sys.version_info.major, sys.version_info.minor)
print("실행 플랫폼:", sys.platform)`, nondeterministic: true, desc: '<code>import sys</code> 는 파이썬 자신의 정보를 담은 <b>sys 모듈</b>을 불러옵니다. 브라우저에서 실행하면 플랫폼이 <code>emscripten</code>(웹어셈블리)으로, 윈도 PC 에서 실행하면 <code>win32</code> 로 나옵니다. 모듈은 나중에 자세히 배웁니다.' },
          { type: 'callout', kind: 'more', title: '구현체가 여러 개라는 말의 뜻 — 문법(언어)과 실행기(구현)는 다르다', html: '<p>"파이썬"이라는 말에는 두 가지 뜻이 섞여 있습니다.</p><ul><li><b>언어 사양(specification)</b>: <code>print(...)</code> 는 이렇게 쓰고, 들여쓰기는 블록을 뜻한다 … 는 <b>규칙</b> 자체</li><li><b>구현(implementation)</b>: 그 규칙대로 코드를 실제로 실행해 주는 <b>프로그램</b>. CPython · PyPy · Jython 등</li></ul><p>그래서 "파이썬 코드"는 하나여도, 그것을 돌리는 엔진은 여러 개일 수 있습니다. 각 구현체의 성격은 이렇습니다.</p><ul><li><b>CPython</b> — 사실상의 표준. 새 문법이 가장 먼저 들어오고 라이브러리 호환성이 가장 좋습니다. 대신 한 번에 한 스레드만 파이썬 코드를 실행하게 하는 <b>GIL</b>(Global Interpreter Lock)이라는 제약이 있습니다. (3.13부터 GIL 을 끈 실험용 빌드가 제공됩니다)</li><li><b>PyPy</b> — 실행 중 자주 쓰이는 부분을 기계어로 바꾸는 <b>JIT</b> 덕분에 순수 파이썬 반복 계산이 CPython 보다 몇 배 빠를 수 있습니다. 대신 C 로 만든 일부 라이브러리와 궁합이 나쁠 수 있습니다.</li><li><b>MicroPython · CircuitPython</b> — 메모리가 아주 작은 마이크로컨트롤러(예: 라즈베리 파이 피코)에서 돌아가는 작은 파이썬입니다.</li><li><b>Pyodide</b> — CPython 을 웹어셈블리로 빌드한 것. 이 강좌가 브라우저에서 돌아가는 이유입니다.</li></ul><p>입문 단계에서는 <b>"파이썬 = CPython"</b> 으로 생각해도 아무 문제가 없습니다. 다만 나중에 "왜 내 코드가 저 서버에서만 느리지?" 같은 질문을 만나면 구현체가 답일 수 있다는 것만 기억해 두세요.</p>' },

          { type: 'h', text: '파이썬의 특징' },
          { type: 'p', html: '파이썬이 전 세계에서 가장 인기 있는 언어 중 하나가 된 데에는 다음과 같은 장점이 있습니다.' },
          { type: 'table', head: ['특징', '설명', '예'], rows: [
            ['❶ 강력한 기능을 <b>무료</b>로 사용', '누구나 내려받아 개인 · 회사 용도로 자유롭게 쓸 수 있는 오픈 소스', 'python.org 에서 무료 설치'],
            ['❷ <b>읽기 쉽고 사용하기 쉽다</b>', '영어 문장처럼 읽히고, 들여쓰기로 구조를 표현해 코드가 깔끔', '<code>print("Hello")</code> 한 줄이면 출력'],
            ['❸ <b>사물인터넷(IoT)</b>과 잘 연동', '라즈베리 파이 같은 작은 컴퓨터로 센서 · LED · 모터를 제어', '온도 측정기, 스마트 화분'],
            ['❹ 다양하고 강력한 <b>외부 라이브러리</b>', '이미 만들어진 기능 묶음(라이브러리)을 가져다 씀', '데이터 분석, 인공지능, 그래픽, 게임'],
            ['❺ 강력한 <b>웹 프레임워크</b>', '웹 사이트를 빠르게 만드는 도구 제공', '장고(Django), 플라스크(Flask)']
          ], caption: '파이썬의 특징' },
          { type: 'code', title: '추가 예제. 영어 문장처럼 읽히는 파이썬', code: `fruits = ["사과", "바나나", "딸기"]

for fruit in fruits:
    print(fruit, "좋아!")

print("과일 개수:", len(fruits))`, expect: '사과 좋아!\n바나나 좋아!\n딸기 좋아!\n과일 개수: 3', desc: '아직 배우지 않은 문법이지만 "과일들 안의 각 과일에 대해(for fruit in fruits) 출력하라"처럼 <b>영어 문장으로 읽힙니다</b>. <code>4행</code>의 들여쓰기(공백 4칸)는 "반복할 부분"을 뜻합니다. 반복문은 나중에 자세히 배웁니다.' },
          { type: 'code', title: '추가 예제. 라이브러리 맛보기 — 달력 출력하기', code: `import calendar

print(calendar.month(2026, 9))`, expect: '   September 2026\nMo Tu We Th Fr Sa Su\n    1  2  3  4  5  6\n 7  8  9 10 11 12 13\n14 15 16 17 18 19 20\n21 22 23 24 25 26 27\n28 29 30', desc: '달력을 그리는 코드를 직접 만들려면 꽤 복잡하지만, 파이썬에 기본으로 들어 있는 <b>calendar 라이브러리</b>를 쓰면 두 줄이면 됩니다. 연도와 월을 바꿔서 실행해 보세요. 이렇게 필요한 기능이 이미 준비되어 있다는 것이 파이썬의 큰 장점입니다.' },
          { type: 'code', title: '추가 예제. 파이썬의 철학 (The Zen of Python)', code: `import this`, expect: `The Zen of Python, by Tim Peters

Beautiful is better than ugly.
Explicit is better than implicit.
Simple is better than complex.
Complex is better than complicated.
Flat is better than nested.
Sparse is better than dense.
Readability counts.
Special cases aren't special enough to break the rules.
Although practicality beats purity.
Errors should never pass silently.
Unless explicitly silenced.
In the face of ambiguity, refuse the temptation to guess.
There should be one-- and preferably only one --obvious way to do it.
Although that way may not be obvious at first unless you're Dutch.
Now is better than never.
Although never is often better than *right* now.
If the implementation is hard to explain, it's a bad idea.
If the implementation is easy to explain, it may be a good idea.
Namespaces are one honking great idea -- let's do more of those!`, desc: '파이썬에 숨겨진 재미있는 기능입니다. "아름다운 것이 추한 것보다 낫다", "단순한 것이 복잡한 것보다 낫다", "<b>읽기 쉬움이 중요하다(Readability counts)</b>" 처럼 파이썬이 추구하는 설계 철학 19가지가 출력됩니다.' },
          { type: 'code', title: '추가 예제. 맛보기 — 거북이 그래픽으로 별 그리기', code: `import turtle

t = turtle.Turtle()
t.shape("turtle")
t.color("orange")
t.pensize(3)

for i in range(5):
    t.forward(200)
    t.right(144)

turtle.done()`, desc: '파이썬에는 거북이를 움직여 그림을 그리는 <b>turtle 라이브러리</b>도 있습니다. 실행하면 그림 창이 열리고 거북이가 별을 그립니다. 거북이 그래픽은 뒤의 장들에서 자주 사용합니다.' },

          { type: 'h', text: '파이썬의 단점' },
          { type: 'p', html: '장점이 많은 파이썬에도 약점은 있습니다.' },
          { type: 'list', items: [
            '<b>느린 속도</b> — 파이썬은 컴파일러 언어가 아닌 <b>스크립트 언어</b>라서 C · 자바 같은 컴파일러 언어보다 실행 속도가 느립니다. 이를 보완하기 위해 많은 파이썬 패키지가 속도를 최적화하고 있습니다.',
            '<b>모바일 · 하드웨어 분야</b> — 스마트폰 앱 개발 지원이 약하고, 하드웨어를 아주 세밀하게 제어하는 일(운영체제, 장치 드라이버 등)에는 쓰기 어렵습니다.'
          ] },
          { type: 'callout', kind: 'more', title: '느린데도 AI · 데이터 분석에 쓰이는 이유', html: '<ul><li>데이터 분석(NumPy, pandas)이나 인공지능(PyTorch, TensorFlow) 라이브러리는 속도가 중요한 계산 부분을 <b>C/C++ 로 만들어 두고</b>, 파이썬은 그것을 편하게 부르는 역할만 합니다. 그래서 "쓰기는 파이썬처럼 쉽게, 계산은 C 처럼 빠르게" 할 수 있습니다.</li><li>파이썬 자체도 빨라지고 있습니다. 3.11 버전에서 크게 빨라졌고, 최근 버전에는 실험적인 JIT(실행 중 기계어 번역) 기능도 들어왔습니다.</li><li>대부분의 프로그램은 사람이 기다리는 시간보다 훨씬 빨리 끝납니다. 개발 시간이 짧다는 장점이 실행 속도보다 중요한 경우가 많습니다.</li></ul>' },
          { type: 'code', title: '추가 예제. 파이썬은 얼마나 빠를까?', code: `import time

start = time.time()
total = 0
for i in range(1000000):
    total = total + i
end = time.time()

print("0부터 999999까지의 합:", total)
print("걸린 시간(초):", round(end - start, 3))`, nondeterministic: true, desc: '더하기를 100만 번 반복하는 데 걸린 시간을 잽니다. 컴퓨터와 브라우저에 따라 결과가 다르지만 대개 1초 안쪽입니다. 같은 일을 C 언어로 하면 훨씬 빠르지만, 우리가 사용하기에는 파이썬도 충분히 빠르다는 것을 알 수 있습니다.' },
          { type: 'h', text: '📘 실행 시간 측정 맛보기 — "느리다"를 숫자로 확인하기' },
          { type: 'p', html: '"느리다 · 빠르다"는 느낌으로 말하지 말고 <b>재서 말하는</b> 습관을 들이면 좋습니다. 파이썬에는 시간을 재는 도구가 여럿 있는데, 용도가 조금씩 다릅니다.' },
          { type: 'table', head: ['도구', '재는 것', '언제 쓰나'], rows: [
            ['<code>time.time()</code>', '1970년부터 흐른 <b>시각</b>(초)', '"지금 몇 시인가"가 필요할 때'],
            ['<code>time.perf_counter()</code>', '가장 정밀한 <b>경과 시간</b>', '코드 구간의 속도를 잴 때 <b>(권장)</b>'],
            ['<code>time.process_time()</code>', 'CPU 가 실제로 일한 시간', '대기 시간을 빼고 재고 싶을 때'],
            ['<code>timeit</code> 모듈', '같은 코드를 <b>여러 번</b> 반복해 평균', '두 방법의 속도를 공정하게 비교할 때']
          ], caption: '시간 측정 도구' },
          { type: 'callout', kind: 'more', title: '왜 time.time() 대신 perf_counter() 인가', html: '<code>time.time()</code> 이 돌려주는 값은 컴퓨터의 <b>시계(벽시계 시각)</b>입니다. 시계는 시간 동기화나 서머타임 때문에 도중에 <b>뒤로 갈 수도</b> 있어서, 아주 짧은 구간을 재면 음수가 나오는 일까지 생깁니다. 반면 <code>time.perf_counter()</code> 는 "언제부터인지는 몰라도 <b>절대 거꾸로 가지 않고 가장 잘게 나뉜</b> 카운터"입니다. 그래서 <b>구간의 길이</b>를 잴 때는 <code>perf_counter()</code> 를 씁니다.' },
          { type: 'code', title: '추가 예제. 같은 일을 하는 두 가지 방법의 속도 비교', code: `import time

N = 1000000

start = time.perf_counter()
total1 = 0
for i in range(N):
    total1 = total1 + i
t_loop = time.perf_counter() - start

start = time.perf_counter()
total2 = sum(range(N))
t_sum = time.perf_counter() - start

print("결과가 같은가?", total1 == total2)
print("직접 반복:", round(t_loop, 4), "초")
print("sum() 사용:", round(t_sum, 4), "초")
print("sum() 이 약", round(t_loop / t_sum, 1), "배 빠름")`, nondeterministic: true, desc: '두 코드는 <b>똑같은 값</b>을 구하지만 걸리는 시간이 다릅니다. 직접 <code>for</code> 로 도는 쪽은 파이썬이 100만 번 해석하며 실행하고, <code>sum()</code> 은 그 반복이 <b>C 로 짜여 있어서</b> 훨씬 빠릅니다. "파이썬이 느리다"의 정체는 대개 <b>파이썬 층에서 도는 반복</b>입니다. 이것이 NumPy·pandas 같은 라이브러리가 빠른 이유이기도 합니다. (배수는 실행 환경마다 다릅니다)' },
          { type: 'callout', kind: 'tip', title: '측정할 때 흔한 함정', html: '<ul><li>한 번만 재면 우연에 휘둘립니다. 여러 번 재서 <b>가장 작은 값</b>을 쓰거나 <code>timeit</code> 을 씁니다.</li><li>처음 실행은 준비 작업(모듈 로딩 등) 때문에 느립니다. <b>첫 측정은 버리는</b> 것이 보통입니다.</li><li><b>재기 전에 먼저 어디가 느린지 찾으세요.</b> 전체의 1%를 차지하는 코드를 두 배 빠르게 만들어 봐야 소용이 없습니다.</li></ul>' },

          { type: 'h', text: '파이썬의 실행 화면' },
          { type: 'p', html: '아래는 파이썬을 설치하면 함께 설치되는 <b>IDLE 셸</b>에서 <code>print("Hello, world!")</code> 를 입력하고 <kbd>Enter</kbd> 를 눌러 <code>Hello, world!</code> 를 출력한 화면입니다. <code>&gt;&gt;&gt;</code> 는 "명령을 입력하세요"라는 뜻의 <b>프롬프트(prompt)</b>입니다.' },
          { type: 'figure', html: IDLE_HELLO, caption: '그림 1-6 파이썬 실행 화면 (IDLE 셸)' },
          { type: 'p', html: '<code>print</code> 는 "인쇄하다, 출력하다"라는 뜻입니다. 이름 그대로 <code>print()</code> 는 <b>괄호 안에 있는 것을 화면에 출력</b>합니다. 이 강좌에서는 콘솔의 <b>&gt;&gt;&gt; 셸</b> 버튼이 IDLE 셸 역할을 합니다. 아래 예제의 ▶ 실행을 누르면 셸에서 한 줄씩 실행됩니다.' },
          { type: 'code', repl: true, title: '그림 1-6. 파이썬 실행 화면 (대화형 모드)', code: 'print("Hello, world!")', expect: '>>> print("Hello, world!")\nHello, world!\n>>>' },
          { type: 'callout', kind: 'more', title: 'print() 기초 한눈에 보기', html: '<ul><li>글자(문자열)는 큰따옴표 <code>"…"</code> 또는 작은따옴표 <code>\'…\'</code> 로 감쌉니다. 둘 다 같습니다.</li><li>숫자와 계산식은 따옴표 없이 씁니다 → 계산 결과가 출력됩니다.</li><li>쉼표로 여러 값을 나열하면 <b>한 칸씩 띄어서</b> 한 줄에 출력됩니다.</li><li><code>print()</code> 처럼 괄호 안을 비우면 <b>빈 줄</b>이 출력됩니다.</li><li><code>sep="…"</code> 은 값 사이에 넣을 글자, <code>end="…"</code> 는 줄 끝에 넣을 글자를 정합니다. (기본값: 공백, 줄 바꿈)</li></ul>' },
          { type: 'code', title: '추가 예제. print() 의 여러 가지 사용법', code: `print("Hello, world!")
print('작은따옴표도 됩니다')
print(100)
print(3.14 * 2)
print("사과", "바나나", "딸기")
print()
print("2026", "09", "18", sep="-")
print("같은 줄에 ", end="")
print("이어서 출력")`, expect: 'Hello, world!\n작은따옴표도 됩니다\n100\n6.28\n사과 바나나 딸기\n\n2026-09-18\n같은 줄에 이어서 출력', desc: '<code>6행</code>의 <code>print()</code> 는 빈 줄을 출력합니다. <code>7행</code>은 값 사이를 공백 대신 <code>-</code> 로 이어 붙이고, <code>8행</code>은 줄을 바꾸지 않아서 <code>9행</code>의 출력이 같은 줄에 이어집니다.' },

          { type: 'h', text: '컴파일러 언어와 스크립트 언어' },
          { type: 'p', html: '고급 언어로 쓴 소스 코드를 기계어로 바꾸는 방법은 크게 두 가지입니다.' },
          { type: 'list', items: [
            '<b>컴파일러(compiler) 언어</b>: 소스 코드 <b>전체를 한꺼번에</b> 기계어로 번역해 실행 파일(<code>*.exe</code>, <code>*.class</code> 등)을 만든 뒤, 그 파일을 실행합니다. 번역하는 과정을 <b>컴파일(compile)</b>, 번역해 주는 프로그램을 <b>컴파일러</b>라고 합니다. 예: C/C++, 자바',
            '<b>스크립트(script) 언어</b> = 인터프리터 언어: 소스 코드를 <b>한 줄씩 읽어서 바로 실행</b>합니다. 따로 실행 파일을 만들지 않습니다. 한 줄씩 처리해 주는 프로그램을 <b>인터프리터(interpreter)</b>라고 합니다. 예: 파이썬, 자바스크립트, 펄(Perl)'
          ] },
          { type: 'figure', html: FIG_COMPILE, caption: '컴파일러 언어는 전체를 번역한 뒤 실행하고, 스크립트 언어는 한 줄씩 번역하며 실행한다' },
          { type: 'table', head: ['비교', '컴파일러 언어', '스크립트 언어'], rows: [
            ['번역 방식', '전체를 한꺼번에 번역', '한 줄씩 읽어 바로 실행'],
            ['실행 파일', '만든다 (<code>.exe</code>, <code>.class</code>)', '만들지 않는다'],
            ['실행 속도', '<b>빠르다</b> (미리 번역해 둠)', '상대적으로 느리다'],
            ['배우기', '규칙이 많아 오래 걸린다', '<b>빨리 배울 수 있다</b>'],
            ['결과 확인', '컴파일 후 실행해야 확인', '입력하자마자 확인'],
            ['예', 'C, C++, 자바', '파이썬, 자바스크립트, 펄']
          ], caption: '컴파일러 언어와 스크립트 언어 비교' },
          { type: 'callout', kind: 'tip', title: '비유: 번역가 vs 동시통역사', html: '컴파일러는 외국 책을 <b>통째로 번역해서 번역본을 출판</b>하는 번역가와 같습니다. 한 번 번역해 두면 읽기(실행)는 빠르지만, 번역하는 데 시간이 걸립니다. 인터프리터는 연설을 <b>한 문장씩 바로바로 통역</b>하는 동시통역사와 같습니다. 곧바로 알아들을 수 있지만, 매번 통역해야 하므로 조금 느립니다.' },
          { type: 'p', html: '파이썬이 코드를 <b>위에서부터 차례로 실행</b>한다는 것은 다음 예제로 확인할 수 있습니다. 3행에서 0 으로 나누는 오류가 나지만, 그 전의 1 · 2행은 이미 실행되어 결과가 출력됩니다.' },
          { type: 'code', title: '추가 예제. 한 줄씩 실행되는 것 확인하기', code: `print("1번째 줄 실행")
print("2번째 줄 실행")
print(3 / 0)
print("4번째 줄은 실행되지 않음")`, expectError: true, nondeterministic: true, desc: '실행하면 <code>1번째 줄 실행</code>, <code>2번째 줄 실행</code> 이 출력된 뒤 빨간 오류 메시지가 나타납니다. <code>3 / 0</code> 은 0 으로 나눌 수 없어서 <b>ZeroDivisionError</b> 오류가 발생하고 프로그램이 멈춥니다. 그래서 4행은 실행되지 않습니다. 오류 메시지의 <code>line 3</code> 은 오류가 난 줄 번호입니다.' },
          { type: 'callout', kind: 'more', title: '사실 파이썬은 "먼저 살짝 번역"합니다', html: '<p>정확히 말하면 파이썬(CPython)은 실행 전에 소스 코드 전체를 <b>바이트코드(bytecode)</b>라는 중간 코드로 먼저 번역하고, 이것을 <b>파이썬 가상 머신(PVM)</b>이 한 줄씩 실행합니다. 그래서 <b>문법 오류(SyntaxError)</b>가 하나라도 있으면 번역 단계에서 걸려 <b>첫 줄조차 실행되지 않습니다</b>. 반면 0 으로 나누기 같은 <b>실행 중 오류</b>는 그 줄에 도착했을 때 발생합니다.</p><p>아래 예제는 2행의 따옴표가 닫히지 않은 문법 오류입니다. 위의 예제와 달리 1행도 출력되지 않는 것을 확인해 보세요.</p>' },
          { type: 'code', title: '추가 예제. 문법 오류가 있으면 아무것도 실행되지 않는다', code: `print("1번째 줄")
print("2번째 줄)
print("3번째 줄")`, expectError: true, expect: `  File "main.py", line 2
    print("2번째 줄)
          ^
SyntaxError: unterminated string literal (detected at line 2)`, desc: '<code>2행</code>의 문자열이 닫히지 않아(<code>unterminated string literal</code>) <b>SyntaxError</b> 가 발생했습니다. 실행 전에 발견된 오류라서 1행의 <code>print</code> 도 실행되지 않았습니다. 2행 끝에 <code>"</code> 를 넣어 고친 뒤 다시 실행해 보세요.' },

          { type: 'h', text: '📘 파이썬이 코드를 실행하는 진짜 순서 — 소스 → 바이트코드 → PVM' },
          { type: 'p', html: '앞에서 "인터프리터는 한 줄씩 번역하며 실행한다"고 배웠습니다. 큰 그림으로는 맞지만, 실제 CPython 은 조금 더 영리하게 일합니다. 우리가 <b>▶ 실행</b>을 누르면 다음 네 단계가 자동으로 일어납니다.' },
          { type: 'figure', html: FIG_PVM, caption: '소스 코드는 바이트코드로 번역된 뒤 파이썬 가상 머신(PVM)이 실행한다' },
          { type: 'list', ordered: true, items: [
            '<b>소스 코드</b>(<code>.py</code>) — 사람이 읽고 쓰는 글자입니다.',
            '<b>컴파일</b> — 파이썬이 소스 전체를 훑으며 <b>문법이 맞는지 검사</b>하고, 기계가 다루기 쉬운 형태로 바꿉니다. 이 단계에서 걸리는 오류가 <code>SyntaxError</code> 입니다.',
            '<b>바이트코드(bytecode)</b> — <code>LOAD_CONST</code>, <code>BINARY_OP</code> 같은 <b>아주 단순한 명령의 목록</b>입니다. CPU 의 기계어는 아니고, 파이썬만 알아보는 중간 언어입니다.',
            '<b>PVM(Python Virtual Machine)</b> — 바이트코드 명령을 <b>위에서부터 하나씩</b> 실행합니다. 여기서 나는 오류가 <code>ZeroDivisionError</code>, <code>NameError</code> 같은 <b>실행 중 오류</b>입니다.'
          ] },
          { type: 'p', html: '이 구조를 알면 앞에서 본 두 예제의 차이가 분명해집니다. <b>문법 오류는 ② 단계에서</b> 걸리므로 프로그램이 <b>한 줄도 실행되지 않고</b>, <b>0 으로 나누기는 ④ 단계에서</b> 그 줄에 도착했을 때 발생하므로 <b>그 앞줄까지는 이미 실행</b>된 뒤입니다.' },
          { type: 'code', title: '추가 예제. 소스 코드를 바이트코드로 바꿔 보기', code: `src = "seconds = 365 * 24 * 60 * 60"

obj = compile(src, "<나의코드>", "exec")

print("compile() 이 돌려준 것:", type(obj))
print("코드가 사용하는 이름:", obj.co_names)
print("31536000 이 미리 들어 있나요?", 31536000 in obj.co_consts)`, expect: "compile() 이 돌려준 것: <class 'code'>\n코드가 사용하는 이름: ('seconds',)\n31536000 이 미리 들어 있나요? True", desc: '<code>compile()</code> 은 ② 단계만 직접 해 보는 내장 함수입니다. 결과인 <b>코드 객체(code object)</b> 안에 바이트코드가 들어 있습니다. 재미있는 점은 소스에 <code>31536000</code> 이라는 숫자가 한 번도 나오지 않는데 <b>코드 객체 안에는 이미 들어 있다</b>는 것입니다. 파이썬이 <b>컴파일 단계에서 미리 계산</b>(상수 접기, constant folding)해 두었기 때문입니다. 즉 <code>365 * 24 * 60 * 60</code> 은 실행할 때마다 곱하는 것이 아니라 <b>단 한 번만</b> 계산됩니다.' },
          { type: 'callout', kind: 'more', title: '__pycache__ 폴더의 정체', html: '내 PC 에서 파이썬 프로그램을 실행하다 보면 옆에 <code>__pycache__</code> 라는 폴더와 <code>xxx.cpython-314.pyc</code> 파일이 생기는 것을 보게 됩니다. 이것이 바로 <b>번역해 둔 바이트코드</b>입니다. <code>import</code> 로 불러 쓰는 모듈은 내용이 바뀌지 않았다면 다음 실행 때 <b>번역을 건너뛰고</b> 이 파일을 재사용해서 시작이 빨라집니다. 지워도 아무 문제 없고(다시 만들어집니다), 버전을 올리거나 소스를 고치면 자동으로 새로 만들어집니다. Git 같은 곳에 올리지 않는 것이 관례입니다.' },
          { type: 'code', title: '추가 예제. 바이트코드 직접 들여다보기 (dis 모듈)', code: `import dis

def add(a, b):
    total = a + b
    return total

dis.dis(add)`, nondeterministic: true, desc: '<code>dis</code>(disassemble, 역어셈블) 모듈은 함수의 바이트코드를 사람이 읽을 수 있게 풀어 줍니다. 왼쪽 숫자는 소스의 <b>줄 번호</b>, 그 오른쪽이 명령 이름입니다. <code>a</code> 와 <code>b</code> 를 꺼내고(LOAD) → 더하고(BINARY_OP) → <code>total</code> 에 넣고(STORE) → 돌려주는(RETURN) 순서가 보입니다. <b>명령 이름과 개수는 파이썬 버전마다 달라지므로</b> 외울 필요는 전혀 없습니다. "이런 단계가 실제로 있다"는 것만 확인하세요.' },
          { type: 'callout', kind: 'info', title: '그럼 파이썬도 컴파일러 언어인가?', html: '<p>애매하게 들리지만 구분은 분명합니다. C 의 컴파일은 <b>CPU 가 바로 실행하는 기계어</b>를 만들고, 그 결과물(<code>.exe</code>)은 파이썬 없이도 혼자 돌아갑니다. 파이썬의 컴파일은 <b>PVM 이 읽는 바이트코드</b>를 만들 뿐이라, 실행하려면 언제나 파이썬(PVM)이 필요합니다.</p><p>그래서 파이썬은 여전히 <b>인터프리터 언어</b>로 분류합니다. 자바도 비슷하게 바이트코드 + 가상 머신(JVM) 방식이라, 요즘은 "컴파일이냐 인터프리터냐"를 칼같이 나누기보다 <b>어디까지 미리 번역해 두느냐의 정도 차이</b>로 보는 편이 정확합니다.</p>' },

          { type: 'h', text: 'Hello World 프로그램' },
          { type: 'p', html: '화면에 <code>Hello, world!</code> 를 출력하는 <b>Hello World 프로그램</b>은 대부분의 프로그래밍 책에서 가장 먼저 만드는 예제입니다. 1978년 브라이언 커니핸과 데니스 리치가 쓴 책 <b>『The C Programming Language』</b>에서 처음 쓰인 것으로 알려져 있습니다. 같은 일을 하는 프로그램을 세 언어로 비교해 봅시다.' },
          { type: 'figure', html: HELLO_LANGS, caption: 'C · 자바 · 파이썬의 Hello World 프로그램 비교' },
          { type: 'code', title: '추가 예제. 파이썬의 Hello World', code: `print("Hello, world!")`, expect: 'Hello, world!', desc: 'C 는 6줄, 자바는 5줄이 필요했지만 파이썬은 <b>단 한 줄</b>입니다. 파이썬은 <code>#include</code>, <code>main()</code>, 클래스, 세미콜론(<code>;</code>), 중괄호(<code>{ }</code>) 없이도 프로그램이 됩니다. 이것이 파이썬이 "배우기 쉬운 언어"로 불리는 이유입니다.' }
        ],
        practice: [
          {
            title: '실습 1-7. 파이썬 소개 카드 만들기',
            level: 1,
            desc: '<p><code>print()</code> 를 사용하여 아래와 같은 파이썬 소개 카드를 출력하세요. 3행은 <code>2026 - 1991</code> 을 <b>계산식</b>으로 넣어 출력합니다.</p><pre>==============================\n파이썬(Python) 소개\n공개 후 35 년이 지났습니다.\n만든 사람: 귀도 반 로섬\n==============================</pre>',
            hint: '3행은 <code>print("공개 후", 2026 - 1991, "년이 지났습니다.")</code> 처럼 쉼표로 글자와 계산식을 이어서 씁니다.',
            starter: 'print("==============================")\n# TODO: 제목, 공개 후 지난 햇수(계산식), 만든 사람을 출력\n\nprint("==============================")\n',
            solution: 'print("==============================")\nprint("파이썬(Python) 소개")\nprint("공개 후", 2026 - 1991, "년이 지났습니다.")\nprint("만든 사람: 귀도 반 로섬")\nprint("==============================")\n',
            expect: '==============================\n파이썬(Python) 소개\n공개 후 35 년이 지났습니다.\n만든 사람: 귀도 반 로섬\n=============================='
          },
          {
            title: '실습 1-8. 지금 내가 쓰는 파이썬 조사하기',
            level: 1,
            desc: '<p><code>sys</code> 모듈을 사용해 지금 실행 중인 파이썬의 정보를 아래 형태로 출력하세요. (실행하는 곳에 따라 값은 다르게 나옵니다)</p><pre>[내 파이썬 정보]\n구현체: cpython\n큰 버전: 3\n작은 버전: 14\n플랫폼: emscripten</pre>',
            hint: '<code>sys.implementation.name</code>, <code>sys.version_info.major</code>, <code>sys.version_info.minor</code>, <code>sys.platform</code> 을 각각 출력합니다. 맨 위에 <code>import sys</code> 를 잊지 마세요.',
            starter: 'import sys\n\nprint("[내 파이썬 정보]")\n# TODO: 구현체 · 큰 버전 · 작은 버전 · 플랫폼을 한 줄씩 출력\n',
            solution: 'import sys\n\nprint("[내 파이썬 정보]")\nprint("구현체:", sys.implementation.name)\nprint("큰 버전:", sys.version_info.major)\nprint("작은 버전:", sys.version_info.minor)\nprint("플랫폼:", sys.platform)\n',
            nondeterministic: true
          },
          {
            title: '실습 1-9. sep 과 end 사용하기',
            level: 2,
            desc: '<p><code>print()</code> 의 <code>sep</code>, <code>end</code> 를 사용하여 아래와 같이 출력하세요. 첫 줄은 <code>print()</code> 한 번에 <code>"010"</code>, <code>"1234"</code>, <code>"5678"</code> 세 값을 넣어 만들고, 둘째 줄은 <code>print()</code> 두 번으로 만듭니다.</p><pre>010-1234-5678\nPython is fun!</pre>',
            hint: '<code>sep="-"</code> 은 값 사이에 <code>-</code> 를 넣고, <code>end=" "</code> 는 줄을 바꾸는 대신 공백을 넣습니다.',
            starter: '# TODO: sep 을 사용해 전화번호 출력\n\n# TODO: end 를 사용해 두 번의 print() 를 한 줄로 출력\n',
            solution: 'print("010", "1234", "5678", sep="-")\nprint("Python", end=" ")\nprint("is fun!")\n',
            expect: '010-1234-5678\nPython is fun!'
          },
          {
            title: '실습 1-10. 속도를 숫자로 재 보기',
            level: 2,
            desc: '<p><code>time.perf_counter()</code> 로 구간의 실행 시간을 재는 연습입니다. 1부터 100만까지 더하는 일을 <b>두 가지 방법</b>으로 해 보고 시간을 비교해 출력하세요.</p><ul><li>방법 ①: <code>for</code> 반복문으로 하나씩 더하기</li><li>방법 ②: <code>sum(range(1, 1000001))</code> 사용하기</li></ul><p>출력 예(시간은 컴퓨터마다 다릅니다):</p><pre>두 결과가 같은가? True\n방법 1(반복문): 0.0821 초\n방법 2(sum): 0.0104 초</pre>',
            hint: '<code>start = time.perf_counter()</code> 로 시작 시각을 재고, 끝난 뒤 <code>time.perf_counter() - start</code> 로 걸린 시간을 구합니다. 소수 자리는 <code>round(값, 4)</code> 로 줄입니다.',
            starter: 'import time\n\nN = 1000000\n\nstart = time.perf_counter()\ntotal1 = 0\nfor i in range(1, N + 1):\n    total1 = total1 + i\nt1 = time.perf_counter() - start\n\n# TODO: sum(range(1, N + 1)) 로 같은 계산을 하고 시간을 t2 에 담기\n\n# TODO: 두 결과가 같은지, 각각 걸린 시간을 출력\n',
            solution: 'import time\n\nN = 1000000\n\nstart = time.perf_counter()\ntotal1 = 0\nfor i in range(1, N + 1):\n    total1 = total1 + i\nt1 = time.perf_counter() - start\n\nstart = time.perf_counter()\ntotal2 = sum(range(1, N + 1))\nt2 = time.perf_counter() - start\n\nprint("두 결과가 같은가?", total1 == total2)\nprint("방법 1(반복문):", round(t1, 4), "초")\nprint("방법 2(sum):", round(t2, 4), "초")\n',
            nondeterministic: true
          },
          {
            title: '실습 1-11. 도전! 컴파일러 · 인터프리터 비교표 출력기',
            level: 3,
            desc: '<p>본문의 비교표를 <b>콘솔에 표 모양으로</b> 출력하는 프로그램을 만드세요. 표의 가로줄은 <code>"-" * 44</code> 처럼 문자열 반복으로 만듭니다.</p><pre>============================================\n            번역 방식 비교표\n============================================\n항목          | 컴파일러 언어 | 스크립트 언어\n--------------------------------------------\n번역 단위      | 전체 한꺼번에  | 한 줄씩\n실행 파일      | 만든다         | 만들지 않는다\n실행 속도      | 빠르다         | 느린 편\n결과 확인      | 컴파일 후      | 즉시\n대표 언어      | C, C++, 자바   | 파이썬, JS\n============================================\n비교 항목 5 개 · 소개한 언어 5 개</pre>',
            hint: '위아래 테두리는 <code>print("=" * 44)</code>, 가운데 가로줄은 <code>print("-" * 44)</code> 로 만듭니다. 마지막 줄의 숫자 두 개는 계산식(<code>2 + 3</code>, <code>3 + 2</code> 등)으로 넣어 보세요.',
            starter: 'print("=" * 44)\nprint("            번역 방식 비교표")\nprint("=" * 44)\nprint("항목          | 컴파일러 언어 | 스크립트 언어")\n# TODO: 가로줄과 다섯 개의 비교 항목 줄 출력\n\n# TODO: 아래 테두리와 요약 줄 출력\n',
            solution: 'print("=" * 44)\nprint("            번역 방식 비교표")\nprint("=" * 44)\nprint("항목          | 컴파일러 언어 | 스크립트 언어")\nprint("-" * 44)\nprint("번역 단위      | 전체 한꺼번에  | 한 줄씩")\nprint("실행 파일      | 만든다         | 만들지 않는다")\nprint("실행 속도      | 빠르다         | 느린 편")\nprint("결과 확인      | 컴파일 후      | 즉시")\nprint("대표 언어      | C, C++, 자바   | 파이썬, JS")\nprint("=" * 44)\nprint("비교 항목", 2 + 3, "개 · 소개한 언어", 3 + 2, "개")\n',
            expect: '============================================\n            번역 방식 비교표\n============================================\n항목          | 컴파일러 언어 | 스크립트 언어\n--------------------------------------------\n번역 단위      | 전체 한꺼번에  | 한 줄씩\n실행 파일      | 만든다         | 만들지 않는다\n실행 속도      | 빠르다         | 느린 편\n결과 확인      | 컴파일 후      | 즉시\n대표 언어      | C, C++, 자바   | 파이썬, JS\n============================================\n비교 항목 5 개 · 소개한 언어 5 개'
          }
        ],
        quiz: [
          { q: '파이썬을 만든 사람과 처음 공개한 연도로 옳은 것은?', options: ['데니스 리치, 1978년', '귀도 반 로섬, 1991년', '제임스 고슬링, 1995년', '팀 버너스리, 1991년'], answer: 1,
            explain: '파이썬은 <b>귀도 반 로섬</b>이 C 언어로 만들어 <b>1991년</b>에 공개했습니다.' },
          { q: '다음 중 파이썬의 특징으로 알맞지 <b>않은</b> 것은?', options: ['무료로 사용할 수 있다', '읽기 쉽고 사용하기 쉽다', '외부 라이브러리가 풍부하다', '컴파일러 언어라서 C 언어보다 실행 속도가 빠르다'], answer: 3,
            explain: '파이썬은 <b>스크립트 언어</b>이기 때문에 C 같은 컴파일러 언어보다 <b>느린</b> 것이 단점입니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>print("A", "B", "C", sep="*")</code></pre>', options: ['A B C', 'ABC', 'A*B*C', '*A*B*C*'], answer: 2,
            explain: '<code>sep="*"</code> 은 값과 값 <b>사이</b>에 <code>*</code> 를 넣습니다.' },
          { q: '다음 코드를 실행하면 화면에 어떻게 출력될까요?<pre><code>print("하나")\nprint("둘)\nprint("셋")</code></pre>', options: ['하나 만 출력되고 오류', '하나, 둘 까지 출력되고 오류', '아무것도 출력되지 않고 SyntaxError', '하나, 둘), 셋 이 출력된다'], answer: 2,
            explain: '따옴표가 닫히지 않은 <b>문법 오류</b>는 실행 전에 발견되므로 첫 줄도 실행되지 않습니다.' },
          { q: 'CPython 이 파이썬 소스 코드를 실행하는 순서로 옳은 것은?', options: ['소스 코드 → 기계어(.exe) → CPU 가 실행', '소스 코드 → 바이트코드 → PVM 이 실행', '소스 코드 → PVM → 바이트코드로 저장', '소스 코드를 번역 없이 CPU 가 바로 실행'], answer: 1,
            explain: '소스 코드는 먼저 <b>바이트코드</b>로 컴파일되고, 그것을 <b>PVM(파이썬 가상 머신)</b>이 한 명령씩 실행합니다. 기계어 실행 파일을 만들지 않기 때문에 실행하려면 항상 파이썬이 필요합니다.' },
          { q: '코드 구간의 <b>실행 시간</b>을 잴 때 <code>time.time()</code> 보다 <code>time.perf_counter()</code> 를 권하는 이유는?', options: ['현재 날짜를 함께 알려 주기 때문', '시계 동기화 등으로 값이 거꾸로 가지 않고 더 정밀하기 때문', '실행 속도 자체를 빠르게 만들어 주기 때문', '파이썬 2 에서도 쓸 수 있기 때문'], answer: 1,
            explain: '<code>time.time()</code> 은 벽시계 시각이라 도중에 조정되면 값이 뒤로 갈 수 있습니다. <code>perf_counter()</code> 는 <b>단조 증가</b>하는 고해상도 카운터라 구간 측정에 알맞습니다.' }
        ],
        slides: [
          { layout: 'title', title: '파이썬 소개', subtitle: 'Chapter 01 · Section 02', badge: '2교시',
            notes: '<p>지난 시간 복습: 프로그래밍 언어, 프로그래머, 기계어.</p><p><b>발문</b>: "Python 이 영어로 무슨 뜻일까요?" → 비단뱀. 그런데 이름의 진짜 유래는 코미디 프로그램이라는 반전으로 흥미를 끕니다.</p><p>시간: 2분</p>' },
          { layout: 'bullets', title: '파이썬의 역사',
            bullets: ['배우기 쉽고 결과를 바로 확인 → 초보자에게 적합', '<b>귀도 반 로섬</b>(1956~)이 C 언어로 제작', '<b>1991년</b> 공식 발표', 'Python = 비단뱀 → 로고: 파랑 · 노랑 뱀 두 마리', '📘 이름의 유래: 코미디 "몬티 파이썬"'],
            notes: '<p>강의자료 6쪽. 1989년 성탄절 휴가에 취미로 만들기 시작했다는 일화를 곁들입니다.</p><p>시간: 3분</p>' },
          { layout: 'diagram', title: '파이썬의 발자취', html: FIG_TIMELINE, caption: '2.x 는 2020년에 지원 종료 — 지금은 3.x 만 사용',
            notes: '<p>연표는 보충 자료입니다. 3.0 이 2.x 와 호환되지 않는다는 점은 3교시의 "파이썬 2.x 와 3.x" 설명과 연결됩니다.</p><p>매년 가을 새 버전(3.x)이 나온다는 것도 짚어 줍니다. 이 강좌는 3.14 기준입니다.</p><p>시간: 2분</p>' },
          { layout: 'table', title: '여기서 잠깐: 파이썬의 다양한 분류', head: ['이름', '특징'], rows: [
            ['<b>CPython</b>', 'C 로 만든 표준 파이썬'], ['Jython / IronPython', '자바 / C# 으로 구현'], ['PyPy', '빠른 실행에 초점'], ['Stackless · IPython', 'C 스택 문제 제거 · 강력한 대화형 셸'], ['Brython · <b>Pyodide</b>', '웹 브라우저에서 실행 (이 강좌 = Pyodide)']],
            notes: '<p>강의자료 7쪽 "여기서 잠깐". 모두 외울 필요는 없고 "보통 파이썬 = CPython" 만 기억하게 합니다.</p><p>이 사이트가 Pyodide(CPython 을 웹어셈블리로 바꾼 것)를 쓴다는 점을 연결하면 학생들이 신기해합니다.</p><p>시간: 3분</p>' },
          { layout: 'bullets', title: '파이썬의 특징',
            bullets: ['❶ 강력한 기능을 <b>무료</b>로 사용', '❷ <b>읽기 쉽고</b> 사용하기 쉽다', '❸ <b>사물인터넷</b>과 잘 연동된다 (라즈베리 파이)', '❹ 다양하고 강력한 <b>외부 라이브러리</b>', '❺ 강력한 <b>웹 프레임워크</b> (장고, 플라스크)'],
            notes: '<p>강의자료 8쪽. 각 특징마다 예를 하나씩: ❸ 라즈베리 파이로 온도 센서 읽기, ❹ 인공지능 · 데이터 분석, ❺ 인스타그램이 장고로 시작.</p><p><b>발문</b>: "무료인 것이 왜 장점일까요?" → 누구나 쓰니 사용자와 자료가 많아짐.</p><p>시간: 5분</p>' },
          { layout: 'code', title: '라이브러리 맛보기 — 달력', code: `import calendar

print(calendar.month(2026, 9))`,
            points: ['<code>import</code>: 라이브러리 불러오기', '달력 기능이 이미 준비되어 있음', '연 · 월을 바꿔 실행해 보기', '"바퀴를 다시 발명하지 않는다"'],
            notes: '<p>특징 ❹ 를 직접 보여 주는 예제입니다. 학생 생일이 있는 달로 바꿔 실행해 보게 합니다.</p><p>시간에 여유가 있으면 본문의 <code>import this</code> 와 거북이 별 그리기도 보여 줍니다.</p><p>시간: 3분</p>' },
          { layout: 'bullets', title: '파이썬의 단점',
            bullets: [['<b>느린 속도</b>', ['컴파일러 언어가 아닌 스크립트 언어', '→ 패키지 최적화로 보완 중']], '모바일 앱 개발 지원이 약함', '하드웨어 세밀한 제어에는 부적합', '📘 AI 라이브러리는 핵심 계산을 C/C++ 로 처리'],
            notes: '<p>강의자료 9쪽. 느린 이유는 곧 설명할 "스크립트 언어"와 연결합니다.</p><p>그런데도 AI 분야 1등 언어인 이유(계산은 C 로, 사용은 파이썬으로)를 보충합니다.</p><p>시간: 3분</p>' },
          { layout: 'code', title: '📘 "느리다"를 숫자로 재 보기', code: `import time

N = 500000

start = time.perf_counter()
total1 = 0
for i in range(N):
    total1 = total1 + i
t_loop = time.perf_counter() - start

start = time.perf_counter()
total2 = sum(range(N))
t_sum = time.perf_counter() - start

print("같은 결과?", total1 == total2)
print("반복문:", round(t_loop, 4), "초")
print("sum():", round(t_sum, 4), "초")`,
            points: ['<b>결과는 같은데 시간이 다르다</b>', '반복문 → 파이썬이 50만 번 해석', '<code>sum()</code> → 그 반복이 C 로 구현됨', '구간 측정은 <code>perf_counter()</code>'],
            notes: '<p>보충 내용입니다. 교사 화면에서 두세 번 실행해 값이 매번 조금씩 다르다는 것도 보여 주세요 — "한 번만 재면 안 된다"는 이야기로 이어집니다.</p><p><b>핵심 메시지</b>: "파이썬이 느리다"의 정체는 대개 <b>파이썬 층에서 도는 반복</b>입니다. NumPy · pandas 가 빠른 이유도 똑같습니다.</p><p>학생에게 N 을 100만, 200만으로 바꾸게 하면 시간이 비례해 늘어나는 것을 관찰할 수 있습니다.</p><p>시간: 5분</p>' },
          { layout: 'code', title: '파이썬의 실행 화면과 print() 기초', code: `print("Hello, world!")
print('작은따옴표도 됩니다')
print(3.14 * 2)
print("사과", "바나나", "딸기")
print()
print("2026", "09", "18", sep="-")
print("같은 줄에 ", end="")
print("이어서 출력")`,
            points: ['따옴표 <code>"</code> <code>\'</code> 둘 다 가능', '쉼표 → 한 칸 띄어 출력', '<code>print()</code> → 빈 줄', '<code>sep</code>: 사이 글자, <code>end</code>: 끝 글자'],
            notes: '<p>강의자료 10쪽(그림 1-6, IDLE 셸에서 <code>print("Hello, world!")</code> 입력)을 본문 그림으로 먼저 보여 준 뒤 이 슬라이드로 넘어갑니다. <code>&gt;&gt;&gt;</code> 는 "입력하세요"라는 프롬프트이고, 이 강좌에서는 콘솔의 <b>&gt;&gt;&gt; 셸</b> 버튼이 그 역할을 합니다.</p><p>print 는 "출력하다" → 괄호 안의 것을 화면에 출력.</p><p>📘 <code>sep</code> · <code>end</code> 는 보충 내용입니다. 한 번 보여 주고 실습 1-9 에서 직접 써 보게 합니다. 앞으로 모든 장에서 print() 를 쓰므로 여기서 기본을 확실히 다집니다.</p><p>시간: 7분</p>' },
          { layout: 'diagram', title: '컴파일러 언어 vs 스크립트 언어', html: FIG_COMPILE, caption: '전체를 번역해 실행 파일을 만들까, 한 줄씩 번역하며 실행할까',
            notes: '<p>강의자료 11쪽 "여기서 잠깐". 번역가(책 전체 번역) vs 동시통역사(한 문장씩) 비유를 씁니다.</p><p>컴파일러 언어: 실행 빠름, 배우는 데 오래 걸림. 스크립트 언어: 빨리 배움, 결과 바로 확인.</p><p>시간: 5분</p>' },
          { layout: 'code', title: '한 줄씩 실행되는 것 확인하기', code: `print("1번째 줄 실행")
print("2번째 줄 실행")
print(3 / 0)
print("4번째 줄은 실행되지 않음")`, expectError: true,
            points: ['1 · 2행은 출력된다', '3행에서 ZeroDivisionError', '4행은 실행되지 않는다', '📘 문법 오류는 1행도 실행 안 됨'],
            notes: '<p>실행하면 오류가 나는 것이 정상입니다. 빨간 오류 메시지의 <code>line 3</code> 을 함께 읽습니다.</p><p>심화: 파이썬은 먼저 바이트코드로 번역하므로 <b>문법 오류</b>는 첫 줄도 실행되지 않는다는 차이를 본문 예제로 보여 줍니다.</p><p>시간: 4분</p>' },
          { layout: 'diagram', title: '📘 소스 → 바이트코드 → PVM', html: FIG_PVM, caption: '파이썬도 "미리 번역"은 한다 — 다만 기계어가 아니라 바이트코드까지',
            notes: '<p>보충 내용입니다. 앞 슬라이드에서 생긴 의문("한 줄씩 실행한다면서 왜 문법 오류는 첫 줄도 안 돌지?")에 대한 답입니다.</p><p>네 단계를 손으로 짚으며 설명하고, 오류 두 종류가 <b>어느 단계에서</b> 생기는지 화살표로 연결합니다.</p><p><b>발문</b>: "그럼 파이썬도 컴파일러 언어일까요?" → C 는 CPU 가 바로 읽는 기계어를 만들고 파이썬 없이도 실행되지만, 파이썬 바이트코드는 <b>PVM 이 있어야만</b> 실행됩니다. 그래서 인터프리터 언어로 분류합니다.</p><p>여유가 있으면 본문의 <code>compile()</code> 예제를 실행해 <code>co_consts</code> 에 <code>30</code> 이 들어 있는 것(상수 접기)을 보여 주면 반응이 좋습니다. <code>__pycache__</code> 폴더 이야기도 여기서.</p><p>시간: 6분</p>' },
          { layout: 'two', title: '여기서 잠깐: Hello World 프로그램',
            left: { title: 'C 프로그램', code: '#include <stdio.h>\nint main()\n{\n    printf("Hello, world!\\n");\n    return 0;\n}', run: false },
            right: { title: '파이썬 프로그램', code: 'print("Hello, world!")' },
            notes: '<p>강의자료 12쪽. 자바 버전(5줄)은 본문에 있습니다. 1978년 『The C Programming Language』에서 처음 쓰였다는 일화를 소개합니다.</p><p><b>발문</b>: "파이썬 코드에는 없는 것이 무엇인가요?" → <code>#include</code>, <code>main</code>, 중괄호, 세미콜론.</p><p>시간: 3분</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '파이썬에 대한 설명으로 옳지 <b>않은</b> 것은?', options: ['귀도 반 로섬이 1991년에 발표했다', '무료로 사용할 수 있다', '컴파일러 언어라서 C 보다 빠르다', '외부 라이브러리가 풍부하다'], answer: 2,
            explain: '파이썬은 스크립트 언어라서 컴파일러 언어보다 느린 편입니다.',
            notes: '<p>오답을 고른 학생에게 컴파일러 · 인터프리터 비유를 다시 설명합니다.</p><p>시간: 2분</p>' },
          { layout: 'practice', title: '실습 1-7. 파이썬 소개 카드', desc: '제목, 공개 후 지난 햇수(<code>2026 - 1991</code> 계산식), 만든 사람을 출력하는 소개 카드를 만드세요.',
            starter: 'print("==============================")\n# TODO: 제목, 공개 후 지난 햇수(계산식), 만든 사람을 출력\n\nprint("==============================")\n',
            solution: 'print("==============================")\nprint("파이썬(Python) 소개")\nprint("공개 후", 2026 - 1991, "년이 지났습니다.")\nprint("만든 사람: 귀도 반 로섬")\nprint("==============================")\n',
            notes: '<p>5분 개별 실습. 쉼표로 글자와 계산식을 함께 출력하는 방법을 확인합니다.</p><p>빨리 끝낸 학생은 실습 1-9(sep · end)나 실습 1-11(비교표 출력기)에 도전하게 합니다.</p><p>시간: 5분</p>' },
          { layout: 'summary', title: '정리', bullets: ['파이썬: 귀도 반 로섬, 1991년, 비단뱀 로고', '장점: 무료 · 쉬움 · IoT · 라이브러리 · 웹 프레임워크', '단점: 느린 속도, 모바일 · 하드웨어 제어 약함', 'print(): 괄호 안의 것을 화면에 출력', '컴파일러 = 전체 번역, 인터프리터 = 한 줄씩 실행'],
            notes: '<p>다음 시간 예고: 내 컴퓨터에 파이썬을 설치하고 IDLE 을 실행해 봅니다.</p><p>시간: 2분</p>' }
        ]
      },

      /* ───────────────────────── Section 03 ───────────────────────── */
      {
        id: 'ch01-3',
        title: '파이썬 설치와 실행',
        minutes: 50,
        goals: [
          '내 윈도의 버전과 시스템 종류(64bit/32bit)를 확인하고 파일 확장명을 표시할 수 있다',
          'python.org 에서 파이썬을 내려받아 설치하는 과정을 순서대로 설명할 수 있다',
          '파이썬 2.x 와 3.x 의 차이와, 3.x 를 써야 하는 이유를 말할 수 있다',
          '버전 번호(major.minor.micro)의 의미와 호환성 규칙을 설명할 수 있다',
          'IDLE 을 실행하고 종료할 수 있으며, 이 강좌의 편집기 · 콘솔 · >>> 셸과 대응시킬 수 있다',
          '명령 프롬프트에서 python 파일.py 로 스크립트를 실행하는 방법과 __main__ 의 뜻을 안다',
          'pip · PyPI · 가상환경이 무엇이고 왜 필요한지 설명할 수 있다'
        ],
        flow: [['이 강좌의 실행 환경', 5], ['윈도 버전 확인 · 다운로드', 8], ['2.x 와 3.x · 📘 버전 번호 읽기', 8], ['설치 과정 · IDLE', 12], ['📘 스크립트 실행 · __main__', 8], ['📘 pip · 가상환경 · 정리', 9]],
        content: [
          { type: 'h', text: '이 강좌의 실행 환경' },
          { type: 'p', html: '파이썬 코드를 실행하려면 원래는 컴퓨터에 파이썬을 설치해야 합니다. 이 강좌는 <b>웹 브라우저 안에서 파이썬이 실행</b>되므로, 학교나 집 어디서든 설치 없이 바로 연습할 수 있습니다. 화면은 크게 두 부분으로 나뉩니다.' },
          { type: 'figure', html: FIG_WEBIDE, caption: '이 강좌의 실행 화면: 왼쪽 편집기(스크립트 모드) + 오른쪽 콘솔(실행 결과 · >>> 셸)' },
          { type: 'table', head: ['화면 요소', '하는 일', '파이썬 IDLE 에서는'], rows: [
            ['<b>편집기</b>', '여러 줄의 코드를 작성', '[File]-[New File] 로 연 편집기 창'],
            ['<b>▶ 실행</b> (<kbd>Ctrl</kbd>+<kbd>Enter</kbd>)', '편집기의 코드를 처음부터 끝까지 실행', '[Run]-[Run Module] (<kbd>F5</kbd>)'],
            ['<b>콘솔(실행 결과)</b>', 'print() 출력, 오류 메시지 표시, input() 입력', 'IDLE 셸 창'],
            ['<b>&gt;&gt;&gt; 셸</b> 버튼', '한 줄씩 입력해 바로 결과 보기 (대화형 모드)', 'IDLE 셸의 <code>&gt;&gt;&gt;</code> 프롬프트'],
            ['<b>■ 중지</b>', '실행 중인 프로그램 멈추기', '<kbd>Ctrl</kbd>+<kbd>C</kbd>']
          ], caption: '이 강좌의 화면과 IDLE 의 대응' },
          { type: 'callout', kind: 'tip', title: '그래도 설치 방법을 알아 두면 좋은 이유', html: '인터넷이 없는 곳에서 연습하거나, 내 컴퓨터의 파일을 다루는 프로그램을 만들거나, 외부 라이브러리를 마음껏 설치해 쓰려면 내 PC 에 파이썬을 설치하는 것이 좋습니다. 아래 과정은 <b>집에서 직접 따라 해 보세요</b>.' },

          { type: 'h', text: '윈도 버전 및 시스템 종류 확인하기' },
          { type: 'p', html: '파이썬 설치 파일은 운영체제의 종류(64bit / 32bit)에 맞춰야 합니다. 먼저 내 윈도의 정보를 확인합니다.' },
          { type: 'list', ordered: true, items: [
            '키보드에서 <kbd>Win</kbd> + <kbd>R</kbd> 을 눌러 [실행] 창을 엽니다.',
            '<code>msinfo32</code> 를 입력하고 &lt;확인&gt; 을 누르면 [시스템 정보] 창이 열립니다.',
            '[시스템 요약]에서 <b>OS 이름</b>(예: Microsoft Windows 11 Pro)과 <b>시스템 종류</b>를 확인합니다.'
          ] },
          { type: 'table', head: ['시스템 종류에 표시되는 값', '의미'], rows: [
            ['<code>x64 기반 PC</code>', '<b>64bit</b> 윈도 — 요즘 PC 는 대부분 이것'],
            ['<code>x86 기반 PC</code>', '<b>32bit</b> 윈도']
          ], caption: 'msinfo32 의 [시스템 종류] 읽는 법' },
          { type: 'p', html: '다음으로 파일 이름 뒤의 <b>확장명(확장자)</b>이 보이도록 설정합니다. 파이썬 파일은 <code>.py</code> 라는 확장명을 사용하기 때문입니다.' },
          { type: 'list', items: [
            '<b>윈도 11</b>: 파일 탐색기 → 도구 모음의 [레이아웃 및 보기 옵션] → [표시] → <b>[파일 확장명]</b> 체크',
            '<b>윈도 10</b>: 파일 탐색기 → [보기] 메뉴 → <b>\'파일 확장명\'</b> 체크'
          ] },
          { type: 'callout', kind: 'warn', title: '확장명을 켜 두지 않으면 생기는 일', html: '메모장으로 <code>hello.py</code> 를 저장했는데 실제로는 <code>hello.py.txt</code> 가 되어 파이썬 파일로 인식되지 않는 일이 자주 생깁니다. 확장명을 켜 두면 이런 실수를 바로 알아챌 수 있습니다.' },

          { type: 'h', text: '파이썬 다운로드' },
          { type: 'list', ordered: true, items: [
            '웹 브라우저로 <code>https://www.python.org/</code> 에 접속합니다.',
            '[Downloads] 메뉴에 마우스를 올리면 [Download for Windows] 아래에 최신 버전 버튼(<b>Python 3.x.x</b>)이 보입니다. 이 버튼을 클릭합니다.',
            '설치 파일 <code>python-3.x.x-amd64.exe</code> 를 원하는 폴더(예: 다운로드 폴더)에 저장합니다.'
          ] },
          { type: 'callout', kind: 'info', title: '윈도 환경에 따른 파이썬 설치', html: '<ul><li>요즘은 대부분 64bit 윈도를 쓰지만, <b>32bit 윈도</b>라면 이름에 <code>amd64</code> 가 없는 32bit 설치 파일(예: <code>python-3.x.x.exe</code>)을 받아야 합니다. python.org 의 [Downloads]-[Windows] 페이지에서 고를 수 있습니다.</li><li><b>윈도 7</b>에는 파이썬 <b>3.8</b> 까지만 설치됩니다. (3.9 부터는 윈도 7 을 지원하지 않습니다) 이때는 3.8 버전 설치 파일을 받아 사용합니다. 그 이후의 설치 과정은 거의 같습니다.</li></ul>' },
          { type: 'callout', kind: 'more', title: '[참고] 동영상으로 보기', html: '설치 과정을 동영상으로 보고 싶다면 강의자료에 소개된 영상 "파이썬 3.8과 PyCharm 설치"(<code>https://www.youtube.com/watch?v=bM5eBHz7QJg</code>)를 참고하세요. PyCharm 은 파이썬 전용 통합 개발 환경(IDE)으로, IDLE 보다 기능이 많아 큰 프로그램을 만들 때 많이 씁니다. 그 밖에 VS Code, 주피터 노트북(Jupyter Notebook)도 인기 있는 도구입니다.' },

          { type: 'h', text: '여기서 잠깐: 파이썬 2.x 와 3.x' },
          { type: 'p', html: '파이썬은 크게 <b>2.x 버전</b>과 <b>3.x 버전</b>으로 나뉩니다. 둘은 <b>서로 호환되지 않아서</b> 2.x 로 작성한 코드를 3.x 에서 쓰려면 코드를 일부 고쳐야 합니다. 예전에 작성된 코드 중에는 2.x 가 많았지만, <b>2.x 는 2.7 을 마지막으로 2020년에 지원이 끝났습니다</b>. 따라서 특별한 이유가 없다면 <b>최신 3.x 버전</b>을 사용해야 최신 기능을 모두 활용할 수 있습니다.' },
          { type: 'p', html: '파이썬은 <b>매년 가을(10월 무렵)</b> 새 정식 버전이 나옵니다. (2018년 3.7, 2019년 3.8, 2020년 3.9, 2021년 3.10, 2022년 3.11, … 2025년 3.14) 강의자료는 3.9 버전 화면을 사용하지만, 이 강좌의 실행 환경은 <b>3.14</b> 이며 이 책의 코드는 최신 버전에서도 그대로 동작합니다.' },
          { type: 'p', html: '2.x 와 3.x 의 차이를 가장 쉽게 볼 수 있는 곳이 <code>print</code> 입니다. 2.x 에서는 괄호 없이 <code>print "Hello"</code> 라고 썼지만, 3.x 에서는 반드시 괄호를 써야 합니다.' },
          { type: 'code', title: '추가 예제. 파이썬 2 방식의 print 는 오류', code: `print "Hello, world!"`, expectError: true, expect: `  File "main.py", line 1
    print "Hello, world!"
    ^^^^^^^^^^^^^^^^^^^^^
SyntaxError: Missing parentheses in call to 'print'. Did you mean print(...)?`, desc: '파이썬 3 은 "print 를 호출할 때 괄호가 빠졌습니다. print(...) 를 의도했나요?" 라고 친절하게 알려 줍니다. <code>print("Hello, world!")</code> 로 고쳐 실행해 보세요. 인터넷에서 찾은 예제가 이런 오류를 낸다면 2.x 용 코드일 가능성이 높습니다.' },

          { type: 'h', text: '📘 버전 번호 읽는 법과 호환성' },
          { type: 'p', html: '파이썬 버전은 <code>3.14.2</code> 처럼 <b>점으로 구분된 세 개의 숫자</b>로 적습니다. 각 자리가 뜻하는 바가 다르고, 여기에 파이썬 생태계의 약속이 담겨 있습니다.' },
          { type: 'table', head: ['자리', '이름', '3.14.2 에서', '바뀌면 무슨 일이?'], rows: [
            ['첫째', '메이저(major)', '<code>3</code>', '언어가 크게 달라짐. 2 → 3 처럼 <b>호환되지 않음</b>'],
            ['둘째', '마이너(minor)', '<code>14</code>', '<b>새 문법 · 새 기능</b> 추가. 매년 10월에 하나씩 올라감'],
            ['셋째', '마이크로(micro)', '<code>2</code>', '<b>버그 · 보안 수정</b>만. 문법은 그대로 — 올려도 안전']
          ], caption: '파이썬 버전 번호의 의미' },
          { type: 'list', items: [
            '마이너 버전은 <b>매년 10월</b>에 하나씩 올라갑니다. (3.9 → 3.10 → … → 3.14) 각 버전은 <b>약 5년</b> 동안 보안 수정을 받고 수명이 끝납니다(EOL, End Of Life).',
            '위로는 대체로 호환됩니다. 3.9 에서 잘 돌던 코드는 3.14 에서도 거의 그대로 돌아갑니다.',
            '아래로는 호환되지 않습니다. 3.12 에서 새로 생긴 문법을 3.9 에서 실행하면 <code>SyntaxError</code> 가 납니다. 그래서 "파이썬 3.10 이상 필요" 같은 안내가 붙습니다.',
            '어떤 버전을 쓸지 모르겠다면 <b>가장 최신에서 하나 아래 마이너 버전</b>이 무난합니다. 라이브러리들이 새 버전을 지원하기까지 몇 달이 걸리기 때문입니다.'
          ] },
          { type: 'code', title: '추가 예제. 내 파이썬 버전 확인하고 조건 검사하기', code: `import sys

print("전체 버전 문자열:")
print(sys.version)
print()
print("major:", sys.version_info.major)
print("minor:", sys.version_info.minor)
print("micro:", sys.version_info.micro)
print()
print("3.10 이상인가?", sys.version_info >= (3, 10))
print("4.0 이상인가?", sys.version_info >= (4, 0))`, nondeterministic: true, desc: '<code>sys.version</code> 은 컴파일러 정보까지 담긴 긴 문자열이라 사람이 읽기용입니다. <b>프로그램에서 버전을 판단</b>할 때는 <code>sys.version_info</code> 를 씁니다. 이 값은 숫자 묶음이라 <code>&gt;= (3, 10)</code> 처럼 <b>버전끼리 크기를 비교</b>할 수 있습니다. 글자 비교(<code>"3.9" &lt; "3.14"</code>)로 하면 <code>"3.9"</code> 가 더 크다고 나오므로 반드시 <code>version_info</code> 를 쓰세요.' },
          { type: 'callout', kind: 'more', title: '윈도의 py 명령 — 여러 버전을 함께 쓰기', html: '<p>윈도에 파이썬을 설치하면 <b>파이썬 런처(py launcher)</b>도 함께 설치됩니다. 버전을 여러 개 깔아 두고 골라 쓸 수 있는 편리한 도구입니다.</p><ul><li><code>py --version</code> — 기본으로 잡힌 버전 확인</li><li><code>py -0</code> — 설치된 파이썬 목록 보기</li><li><code>py -3.12 hello.py</code> — 3.12 로 실행</li><li><code>py -3.12 -m pip install requests</code> — 3.12 쪽에만 설치</li></ul><p>맥 · 리눅스에서는 <code>python3</code>, <code>python3.12</code> 처럼 버전을 이름에 붙여 부릅니다. 이들 시스템에서 <code>python</code> 은 시스템이 쓰는 파이썬일 수 있으니 건드리지 않는 편이 안전합니다.</p>' },

          { type: 'h', text: '파이썬 설치' },
          { type: 'figure', html: FIG_INSTALL, caption: '파이썬 설치 과정 요약' },
          { type: 'list', ordered: true, items: [
            '내려받은 <code>python-3.x.x-amd64.exe</code> 를 더블클릭해 실행합니다.',
            '첫 화면(Install Python 3.x.x) 아래쪽의 <b>[Add Python 3.x to PATH]</b> 에 반드시 체크합니다.',
            '<b>&lt;Customize installation&gt;</b> 을 클릭합니다. (&lt;Install Now&gt; 를 누르면 기본 위치에 바로 설치됩니다)',
            '[Optional Features] 화면에서는 그대로 두고 <b>&lt;Next&gt;</b> 를 클릭합니다.',
            '[Advanced Options] 화면의 설치 위치(Customize install location)를 <code>C:\\Python\\Python3xx</code> 처럼 찾기 쉬운 곳으로 바꿉니다. (예: <code>C:\\Python\\Python39</code>, <code>Python311</code>, <code>Python314</code>)',
            '<b>&lt;Install&gt;</b> 을 누르면 [Setup Progress] 화면에서 설치가 진행됩니다.',
            '"Setup was successful" 이 나오면 <b>&lt;Close&gt;</b> 를 눌러 마칩니다.'
          ] },
          { type: 'table', head: ['설치 화면', '할 일'], rows: [
            ['Install Python 3.x.x', '☑ <b>Add Python to PATH</b> 체크 → Customize installation'],
            ['Optional Features', '(Documentation, pip, IDLE 등 기본 선택 유지) → Next'],
            ['Advanced Options', '설치 위치를 <code>C:\\Python\\Python3xx</code> 로 변경 → Install'],
            ['Setup Progress', '설치가 끝날 때까지 기다리기'],
            ['Setup was successful', 'Close']
          ], caption: '그림 1-9 파이썬 설치 화면 요약' },
          { type: 'callout', kind: 'warn', title: 'PATH 체크를 잊었다면?', html: '<b>PATH</b> 는 "명령어를 찾아볼 폴더 목록"입니다. 여기에 파이썬이 등록되지 않으면 명령 프롬프트에서 <code>python</code> 을 입력해도 "명령을 찾을 수 없다"는 오류가 납니다. (IDLE 은 시작 메뉴에서 실행되므로 이 책의 실습에는 큰 문제가 없습니다) 체크를 잊었다면 설치 파일을 다시 실행해 [Modify] 로 고치거나, 제거 후 다시 설치하면 됩니다.' },
          { type: 'callout', kind: 'more', title: '설치가 잘 되었는지 확인하는 방법', html: '<ol><li><kbd>Win</kbd> + <kbd>R</kbd> → <code>cmd</code> 입력 → 명령 프롬프트를 엽니다.</li><li><code>python --version</code> 을 입력합니다. <code>Python 3.x.x</code> 처럼 버전이 나오면 성공입니다.</li><li><code>python</code> 만 입력하면 명령 프롬프트 안에서 <code>&gt;&gt;&gt;</code> 대화형 모드가 열립니다. 끝낼 때는 <code>exit()</code> 를 입력합니다.</li></ol><p>최신 파이썬(3.14 무렵)부터는 python.org 에서 여러 버전을 관리해 주는 <b>Python Install Manager</b> 도 제공합니다. 설치 화면이 강의자료와 조금 달라도 "PATH 등록 · 설치 · IDLE 실행"이라는 큰 흐름은 같습니다.</p>' },

          { type: 'h', text: '파이썬 실행 — IDLE' },
          { type: 'p', html: '파이썬을 설치하면 <b>IDLE</b>(Integrated Development and Learning Environment, 통합 개발 · 학습 환경)이라는 기본 도구가 함께 설치됩니다. 윈도의 &lt;시작&gt; 버튼 → [모든 프로그램] → [Python 3.x] → <b>[IDLE (Python 3.x 64-bit)]</b> 을 선택하면 IDLE 이 실행됩니다.' },
          { type: 'p', html: 'IDLE 을 실행하면 <b>파이썬 셸(IDLE Shell)</b> 창이 <b>대화형 모드</b>로 나타납니다. 첫 줄에는 설치된 파이썬 버전이 표시되고, 마지막 줄의 <code>&gt;&gt;&gt;</code> 뒤에서 커서가 깜빡이며 명령을 기다립니다.' },
          { type: 'figure', html: IDLE_START, caption: '그림 1-11 IDLE 실행 화면 — 대화형 모드의 파이썬 셸' },
          { type: 'p', html: '이 강좌에서는 콘솔 위쪽의 <b>&gt;&gt;&gt; 셸</b> 버튼을 누르면 IDLE 셸과 같은 대화형 모드가 열립니다. 아래 예제의 ▶ 실행을 누르면 버전 정보를 확인하는 코드가 셸에서 실행됩니다.' },
          { type: 'code', repl: true, title: '추가 예제. 셸에서 파이썬 버전 확인하기', code: 'import sys\nsys.version_info.major', expect: '>>> import sys\n>>> sys.version_info.major\n3\n>>>', desc: '대화형 모드에서는 <code>print()</code> 없이 값만 입력해도 결과가 표시됩니다. 결과 <code>3</code> 은 파이썬 3.x 라는 뜻입니다.' },
          { type: 'h', text: '파이썬 IDLE 종료' },
          { type: 'p', html: 'IDLE 을 끝낼 때는 메뉴에서 <b>[File]-[Exit]</b> 을 선택하거나 단축키 <kbd>Ctrl</kbd>+<kbd>Q</kbd> 를 누릅니다. 창의 ✕ 버튼을 눌러도 됩니다. 이 강좌에서는 따로 종료할 필요가 없고, 콘솔의 <b>⌫ 지우기</b> 버튼으로 화면을 깨끗하게 지울 수 있습니다.' },

          { type: 'h', text: '📘 스크립트를 실행하는 여러 가지 방법' },
          { type: 'p', html: 'IDLE 의 <kbd>F5</kbd>(이 강좌의 ▶ 실행)는 편리하지만, 실제 현장에서는 <b>명령 프롬프트(터미널)에서 직접 실행</b>하는 일이 더 많습니다. 자동 실행, 서버 배포, 다른 프로그램에서 호출하기 등은 모두 명령줄로 이루어지기 때문입니다.' },
          { type: 'table', head: ['명령', '하는 일', '언제'], rows: [
            ['<code>python hello.py</code>', '<code>hello.py</code> 파일을 처음부터 끝까지 실행', '가장 기본'],
            ['<code>python hello.py 10 20</code>', '뒤의 값을 <b>인자</b>로 넘겨 실행 (<code>sys.argv</code> 로 받음)', '실행할 때마다 값을 바꾸고 싶을 때'],
            ['<code>python -c "print(1+2)"</code>', '파일 없이 한 줄을 바로 실행', '아주 짧은 확인'],
            ['<code>python -m calendar 2026 9</code>', '<b>모듈</b>을 프로그램처럼 실행', '<code>pip</code>, <code>venv</code>, <code>http.server</code> 등'],
            ['<code>python</code>', '대화형 모드(<code>&gt;&gt;&gt;</code>) 시작 — <code>exit()</code> 로 종료', '빠른 실험'],
            ['<code>python -i hello.py</code>', '파일을 실행한 <b>뒤 그대로 셸</b>로 들어감', '결과 변수를 직접 살펴볼 때']
          ], caption: '명령 프롬프트에서 파이썬 실행하기' },
          { type: 'callout', kind: 'tip', title: '경로 때문에 생기는 "파일을 찾을 수 없습니다"', html: '<code>python hello.py</code> 는 "<b>지금 있는 폴더</b>의 hello.py 를 실행하라"는 뜻입니다. 명령 프롬프트가 다른 폴더에 있으면 파일을 찾지 못합니다. 윈도에서는 파일 탐색기에서 해당 폴더를 연 뒤 주소창에 <code>cmd</code> 를 입력하면 그 폴더에서 명령 프롬프트가 열려 편합니다. (이 강좌의 코드는 <b>작업 폴더</b>에서 실행되므로 파일 이름만 쓰면 됩니다)' },

          { type: 'h', text: '📘 __name__ 과 "__main__" — 직접 실행과 불러 쓰기의 구분' },
          { type: 'p', html: '파이썬 코드를 남이 쓸 수 있게 만들려면 한 가지를 구분해야 합니다. 이 파일을 <b>직접 실행</b>한 것인지, 다른 파일이 <code>import</code> 로 <b>불러다 쓴</b> 것인지입니다. 파이썬은 실행 중인 각 파일에 <code>__name__</code> 이라는 이름표를 붙여서 이것을 알려 줍니다.' },
          { type: 'list', items: [
            '내가 <b>직접 실행한 파일</b>의 <code>__name__</code> 은 언제나 <code>"__main__"</code> 입니다.',
            '<code>import</code> 로 <b>불러온 파일</b>의 <code>__name__</code> 은 <b>모듈 이름</b>(파일 이름에서 <code>.py</code> 를 뗀 것)입니다.'
          ] },
          { type: 'code', title: '추가 예제. __name__ 직접 확인하기', code: `# ===== File: greet.py =====
print("greet.py 안의 __name__ 은", __name__)

# ===== File: main.py =====
import greet

print("main.py 안의 __name__ 은", __name__)`, expect: 'greet.py 안의 __name__ 은 greet\nmain.py 안의 __name__ 은 __main__', desc: '두 개의 파일이 만들어지고 <b>마지막 구역(main.py)이 실행</b>됩니다. <code>import greet</code> 하는 순간 <code>greet.py</code> 의 내용이 위에서부터 실행되는데, 이때 그 파일의 이름표는 <code>greet</code> 입니다. 반면 직접 실행된 <code>main.py</code> 의 이름표는 <code>__main__</code> 입니다.' },
          { type: 'p', html: '이 차이를 이용하면 <b>"직접 실행했을 때만 하는 일"</b>을 적을 수 있습니다. 파이썬 파일 아래쪽에서 자주 보게 되는 <code>if __name__ == "__main__":</code> 가 바로 그것입니다.' },
          { type: 'code', title: '추가 예제. if __name__ == "__main__": 의 쓸모', code: `# ===== File: mymath.py =====
def add(a, b):
    return a + b

# 아래 블록은 mymath.py 를 "직접 실행"할 때만 동작한다 (간단한 자체 시험)
if __name__ == "__main__":
    print("mymath.py 자체 시험:", add(2, 3))

# ===== File: main.py =====
import mymath

print("main.py 에서 불러다 씁니다:", mymath.add(10, 20))
print("불러올 때는 mymath 의 시험 코드가 실행되지 않았습니다.")`, expect: 'main.py 에서 불러다 씁니다: 30\n불러올 때는 mymath 의 시험 코드가 실행되지 않았습니다.', desc: '출력에 <code>mymath.py 자체 시험</code> 이 <b>없다</b>는 점이 핵심입니다. <code>mymath.py</code> 를 직접 실행하면 시험 코드가 돌지만, <code>import</code> 로 불러오면 <b>함수 정의만 가져오고</b> 시험 코드는 건너뜁니다. 이 장치가 없으면, 모듈을 불러올 때마다 남의 시험 코드나 화면 출력이 끼어들게 됩니다.' },

          { type: 'h', text: '📘 pip 와 PyPI — 남이 만든 기능 가져다 쓰기' },
          { type: 'p', html: '표준 라이브러리에 없는 기능은 <b>PyPI</b>(Python Package Index, <code>pypi.org</code>)에서 찾습니다. 전 세계 개발자가 올려 둔 <b>패키지</b>가 60만 개 넘게 모여 있는 창고이고, 여기서 패키지를 내려받아 설치해 주는 도구가 <b>pip</b> 입니다. pip 는 파이썬을 설치할 때 함께 설치됩니다.' },
          { type: 'table', head: ['명령', '하는 일'], rows: [
            ['<code>python -m pip --version</code>', 'pip 이 설치되어 있는지 · 어느 파이썬의 pip 인지 확인'],
            ['<code>python -m pip install requests</code>', '<code>requests</code> 패키지 설치'],
            ['<code>python -m pip install "django==5.0"</code>', '버전을 지정해 설치'],
            ['<code>python -m pip list</code>', '설치된 패키지 목록 보기'],
            ['<code>python -m pip show requests</code>', '패키지 정보(버전 · 위치 · 의존성) 보기'],
            ['<code>python -m pip uninstall requests</code>', '패키지 지우기'],
            ['<code>python -m pip freeze &gt; requirements.txt</code>', '지금 설치 목록을 파일로 저장'],
            ['<code>python -m pip install -r requirements.txt</code>', '저장해 둔 목록대로 한 번에 설치']
          ], caption: 'pip 의 기본 명령 (명령 프롬프트에서 실행)' },
          { type: 'callout', kind: 'more', title: '왜 pip 보다 python -m pip 를 권할까', html: '컴퓨터에 파이썬이 여러 개 설치되어 있으면 <code>pip</code> 이라는 이름이 <b>어느 파이썬의 pip 인지</b> 헷갈립니다. "분명히 설치했는데 import 하면 없다고 나와요" 라는 문제의 대부분이 이것입니다. <code>python -m pip</code> 라고 쓰면 <b>지금 이 python 의 pip</b> 이 확실하게 실행되므로 헷갈릴 일이 없습니다.' },
          { type: 'callout', kind: 'warn', title: '설치하기 전에 이름을 꼭 확인하세요', html: 'PyPI 는 누구나 올릴 수 있는 열린 창고입니다. 유명한 패키지와 <b>한 글자 다른 이름</b>으로 악성 패키지를 올려 두는 수법(타이포스쿼팅)이 실제로 있습니다. 설치 명령은 블로그에서 복사하기보다 <b>공식 문서나 <code>pypi.org</code> 의 프로젝트 페이지</b>에서 확인하고, 최근 배포일 · 내려받기 수 · 소스 저장소 링크가 정상인지 살펴보세요.' },
          { type: 'code', title: '추가 예제. 어떤 라이브러리가 설치되어 있는지 확인하기', code: `import importlib.util

names = ["math", "json", "tkinter", "requests", "pandas"]

for name in names:
    found = importlib.util.find_spec(name) is not None
    print(name.ljust(10), "설치됨" if found else "없음 (pip install 대상)")`, nondeterministic: true, desc: '<code>importlib.util.find_spec()</code> 은 <b>실제로 불러오지 않고</b> 그 이름의 모듈이 있는지만 확인합니다. <code>math</code>, <code>json</code> 은 표준 라이브러리라 어디서나 있고, <code>requests</code>, <code>pandas</code> 는 설치 여부에 따라 결과가 달라집니다. 실행 환경마다 결과가 다른 것이 정상입니다.' },

          { type: 'h', text: '📘 가상환경(virtual environment) — 프로젝트마다 살림을 따로' },
          { type: 'p', html: '패키지를 계속 설치하다 보면 문제가 생깁니다. A 프로젝트는 <code>django 3</code> 이 필요한데 B 프로젝트는 <code>django 5</code> 가 필요한 상황입니다. 한 컴퓨터에 한 벌만 설치할 수 있다면 둘 중 하나는 깨집니다. 이 문제를 푸는 것이 <b>가상환경</b>입니다.' },
          { type: 'p', html: '가상환경은 <b>프로젝트 폴더 안에 만드는 작은 파이썬 전용 방</b>이라고 생각하면 됩니다. 그 방 안에서 설치한 패키지는 그 프로젝트에서만 보이고, 컴퓨터 전체에는 영향을 주지 않습니다. 방을 통째로 지우고 싶으면 폴더만 삭제하면 됩니다.' },
          { type: 'table', head: ['단계', '명령 (윈도)', '설명'], rows: [
            ['① 만들기', '<code>python -m venv .venv</code>', '현재 폴더에 <code>.venv</code> 라는 방을 만든다'],
            ['② 들어가기', '<code>.venv\\Scripts\\activate</code>', '프롬프트 앞에 <code>(.venv)</code> 가 붙는다'],
            ['③ 설치', '<code>python -m pip install requests</code>', '이 방 안에만 설치된다'],
            ['④ 기록', '<code>python -m pip freeze &gt; requirements.txt</code>', '팀원이 같은 환경을 재현할 수 있게'],
            ['⑤ 나오기', '<code>deactivate</code>', '원래 환경으로 돌아온다']
          ], caption: '가상환경 사용 흐름 (맥 · 리눅스는 ②가 <code>source .venv/bin/activate</code>)' },
          { type: 'callout', kind: 'tip', title: '지금 당장은 몰라도 됩니다 — 다만 이때 떠올리세요', html: '이 강좌의 실습은 브라우저에서 돌아가므로 가상환경이 필요 없습니다. 하지만 <b>내 PC 에서 두 번째 프로젝트를 시작하는 순간</b> 가상환경을 쓰기 시작하는 것이 좋습니다. 실무에서는 예외 없이 씁니다. 요즘은 <code>uv</code>, <code>poetry</code> 처럼 가상환경과 패키지 관리를 한 번에 해 주는 도구도 널리 쓰입니다.' }
        ],
        practice: [
          {
            title: '실습 1-12. 설치 순서 정리하기',
            level: 1,
            desc: '<p>파이썬 설치 과정을 순서대로 출력하는 프로그램을 만드세요.</p><pre>[파이썬 설치 순서]\n1. python.org 에서 설치 파일 다운로드\n2. Add Python to PATH 체크\n3. Customize installation → Next\n4. 설치 위치 변경 → Install\n5. Close\n총 5 단계</pre>',
            hint: '마지막 줄은 <code>print("총", 5, "단계")</code> 처럼 쉼표로 이어서 출력합니다.',
            starter: 'print("[파이썬 설치 순서]")\n# TODO: 1 ~ 5 단계를 출력\n\n# TODO: "총 5 단계" 출력\n',
            solution: 'print("[파이썬 설치 순서]")\nprint("1. python.org 에서 설치 파일 다운로드")\nprint("2. Add Python to PATH 체크")\nprint("3. Customize installation → Next")\nprint("4. 설치 위치 변경 → Install")\nprint("5. Close")\nprint("총", 5, "단계")\n',
            expect: '[파이썬 설치 순서]\n1. python.org 에서 설치 파일 다운로드\n2. Add Python to PATH 체크\n3. Customize installation → Next\n4. 설치 위치 변경 → Install\n5. Close\n총 5 단계'
          },
          {
            title: '실습 1-13. pip 명령 치트 시트 만들기',
            level: 1,
            desc: '<p>본문의 pip 표를 보고, 자주 쓰는 명령을 정리한 안내문을 출력하세요.</p><pre>[pip 자주 쓰는 명령]\n설치      : python -m pip install 패키지이름\n목록 보기 : python -m pip list\n정보 보기 : python -m pip show 패키지이름\n삭제      : python -m pip uninstall 패키지이름\n정리한 명령 4 개</pre>',
            hint: '마지막 줄의 숫자는 <code>2 + 2</code> 같은 계산식으로 넣으세요. 명령 문자열 안의 공백은 있는 그대로 따옴표 안에 적으면 됩니다.',
            starter: 'print("[pip 자주 쓰는 명령]")\n# TODO: 설치 · 목록 · 정보 · 삭제 명령을 한 줄씩 출력\n\n# TODO: 정리한 명령 개수를 계산식으로 출력\n',
            solution: 'print("[pip 자주 쓰는 명령]")\nprint("설치      : python -m pip install 패키지이름")\nprint("목록 보기 : python -m pip list")\nprint("정보 보기 : python -m pip show 패키지이름")\nprint("삭제      : python -m pip uninstall 패키지이름")\nprint("정리한 명령", 2 + 2, "개")\n',
            expect: '[pip 자주 쓰는 명령]\n설치      : python -m pip install 패키지이름\n목록 보기 : python -m pip list\n정보 보기 : python -m pip show 패키지이름\n삭제      : python -m pip uninstall 패키지이름\n정리한 명령 4 개'
          },
          {
            title: '실습 1-14. 파이썬 2 코드를 파이썬 3 으로 고치기',
            level: 2,
            desc: '<p>아래는 파이썬 2 방식으로 작성된 코드입니다. 파이썬 3 에서 실행되도록 고쳐 보세요. (뼈대 코드에서는 오류가 나지 않도록 주석 처리해 두었습니다. <code>#</code> 을 지우고 고치세요)</p><pre>print "Python 2 는 끝났습니다."\nprint "이제는 Python", 3</pre><p>실행 결과:</p><pre>Python 2 는 끝났습니다.\n이제는 Python 3</pre>',
            hint: '파이썬 3 에서 <code>print</code> 는 함수이므로 출력할 내용을 반드시 괄호 <code>( )</code> 안에 넣어야 합니다.',
            starter: '# print "Python 2 는 끝났습니다."\n# print "이제는 Python", 3\n',
            solution: 'print("Python 2 는 끝났습니다.")\nprint("이제는 Python", 3)\n',
            expect: 'Python 2 는 끝났습니다.\n이제는 Python 3'
          },
          {
            title: '실습 1-15. 모듈 만들어 불러 쓰기 (__main__ 확인)',
            level: 2,
            desc: '<p>파일을 두 개 만들어 <code>__name__</code> 의 동작을 직접 확인하세요. (코드 상자 안에서 <code># ===== File: 이름.py =====</code> 주석으로 파일을 나눕니다. 마지막 구역이 실행됩니다)</p><ol><li><b>tool.py</b> — 두 수를 곱해 돌려주는 함수 <code>multiply(a, b)</code> 를 만들고, <code>if __name__ == "__main__":</code> 블록에 자체 시험 출력을 넣습니다.</li><li><b>main.py</b> — <code>tool</code> 을 불러 <code>multiply(7, 6)</code> 의 결과를 출력하고, 자기 <code>__name__</code> 도 출력합니다.</li></ol><p>실행 결과:</p><pre>7 x 6 = 42\nmain.py 의 __name__ : __main__</pre><p>tool.py 의 시험 출력이 <b>나오지 않아야</b> 정답입니다.</p>',
            hint: '<code>import tool</code> 한 뒤 <code>tool.multiply(7, 6)</code> 으로 부릅니다. tool.py 의 <code>if __name__ == "__main__":</code> 블록은 직접 실행할 때만 동작하므로 불러 쓸 때는 건너뜁니다.',
            starter: '# ===== File: tool.py =====\ndef multiply(a, b):\n    return a * b\n\n# TODO: 직접 실행할 때만 동작하는 자체 시험 블록 추가\n\n# ===== File: main.py =====\n# TODO: tool 을 불러와 7 x 6 을 출력하고, __name__ 도 출력\n',
            solution: '# ===== File: tool.py =====\ndef multiply(a, b):\n    return a * b\n\nif __name__ == "__main__":\n    print("tool.py 자체 시험:", multiply(2, 3))\n\n# ===== File: main.py =====\nimport tool\n\nprint("7 x 6 =", tool.multiply(7, 6))\nprint("main.py 의 __name__ :", __name__)\n',
            expect: '7 x 6 = 42\nmain.py 의 __name__ : __main__'
          },
          {
            title: '실습 1-16. 도전! 설치 안내서 생성기',
            level: 3,
            desc: '<p>후배에게 줄 <b>파이썬 설치 안내 카드</b>를 출력하는 프로그램을 만드세요. 테두리는 <code>"=" * 50</code>, <code>"-" * 50</code> 처럼 <b>문자열 반복</b>으로 만들고, 아래쪽 숫자는 모두 <b>계산식</b>으로 넣습니다.</p><ul><li>단계는 5개, 한 단계에 평균 2분이 걸린다고 가정 → 예상 소요 시간</li><li>설치 후 확인 명령 2개를 함께 안내</li></ul><pre>==================================================\n        파이썬 설치 안내서 (Windows)\n==================================================\n 1단계  python.org 접속 → Downloads\n 2단계  Add Python to PATH 체크 (중요!)\n 3단계  Customize installation → Next\n 4단계  설치 위치 변경 → Install\n 5단계  Setup was successful → Close\n--------------------------------------------------\n전체 5 단계 · 예상 소요 시간 10 분\n확인 1: python --version\n확인 2: python -m pip --version\n==================================================</pre>',
            hint: '<code>print("=" * 50)</code> 로 테두리를, <code>print("전체", 5, "단계 · 예상 소요 시간", 5 * 2, "분")</code> 으로 요약 줄을 만듭니다.',
            starter: 'print("=" * 50)\nprint("        파이썬 설치 안내서 (Windows)")\nprint("=" * 50)\n# TODO: 1~5단계를 한 줄씩 출력\n\n# TODO: 구분선, 요약 줄(계산식), 확인 명령 두 줄, 아래 테두리 출력\n',
            solution: 'print("=" * 50)\nprint("        파이썬 설치 안내서 (Windows)")\nprint("=" * 50)\nprint(" 1단계  python.org 접속 → Downloads")\nprint(" 2단계  Add Python to PATH 체크 (중요!)")\nprint(" 3단계  Customize installation → Next")\nprint(" 4단계  설치 위치 변경 → Install")\nprint(" 5단계  Setup was successful → Close")\nprint("-" * 50)\nprint("전체", 5, "단계 · 예상 소요 시간", 5 * 2, "분")\nprint("확인 1: python --version")\nprint("확인 2: python -m pip --version")\nprint("=" * 50)\n',
            expect: '==================================================\n        파이썬 설치 안내서 (Windows)\n==================================================\n 1단계  python.org 접속 → Downloads\n 2단계  Add Python to PATH 체크 (중요!)\n 3단계  Customize installation → Next\n 4단계  설치 위치 변경 → Install\n 5단계  Setup was successful → Close\n--------------------------------------------------\n전체 5 단계 · 예상 소요 시간 10 분\n확인 1: python --version\n확인 2: python -m pip --version\n=================================================='
          }
        ],
        quiz: [
          { q: '[Win]+[R] 에 <code>msinfo32</code> 를 입력해 확인한 시스템 종류가 <code>x64 기반 PC</code> 일 때, 알맞은 설명은?', options: ['32bit 윈도이다', '64bit 윈도이다', '윈도 7 이다', '파이썬이 설치되어 있다'], answer: 1,
            explain: '<code>x64</code> 는 64bit, <code>x86</code> 은 32bit 를 뜻합니다.' },
          { q: '파이썬 설치 첫 화면에서 반드시 체크해야 명령 프롬프트에서 <code>python</code> 명령을 쓸 수 있는 항목은?', options: ['Install launcher for all users', 'Add Python 3.x to PATH', 'Documentation', 'Install for all users'], answer: 1,
            explain: '<b>Add Python to PATH</b> 를 체크해야 윈도가 python 명령의 위치를 찾을 수 있습니다.' },
          { q: '파이썬 2.x 와 3.x 에 대한 설명으로 옳은 것은?', options: ['두 버전은 완전히 호환된다', '2.x 가 최신 버전이다', '2.x 는 지원이 끝났으므로 3.x 를 사용하는 것이 좋다', '3.x 에서는 print 에 괄호를 쓰지 않는다'], answer: 2,
            explain: '두 버전은 호환되지 않으며, 2.x 는 2.7 을 끝으로 지원이 종료되었습니다. 3.x 에서는 <code>print()</code> 처럼 괄호를 씁니다.' },
          { q: 'IDLE 을 처음 실행하면 나타나는 창과 모드는?', options: ['편집기 창, 스크립트 모드', '파이썬 셸 창, 대화형 모드', '명령 프롬프트, 관리자 모드', '웹 브라우저, 온라인 모드'], answer: 1,
            explain: 'IDLE 을 실행하면 <b>파이썬 셸(IDLE Shell)</b>이 <b>대화형 모드</b>로 나타나고 <code>&gt;&gt;&gt;</code> 프롬프트가 표시됩니다.' },
          { q: '<code>tool.py</code> 를 <code>import tool</code> 로 불러왔을 때, <code>tool.py</code> 안에서 <code>__name__</code> 의 값은?', options: ['<code>"__main__"</code>', '<code>"tool"</code>', '<code>"tool.py"</code>', '<code>None</code>'], answer: 1,
            explain: '<b>직접 실행한 파일</b>만 <code>"__main__"</code> 이 되고, <code>import</code> 로 불러온 파일은 <b>모듈 이름</b>(<code>tool</code>)을 갖습니다. 그래서 <code>if __name__ == "__main__":</code> 블록은 불러 쓸 때 실행되지 않습니다.' },
          { q: '다음 중 <b>가상환경(venv)</b>을 쓰는 이유로 가장 알맞은 것은?', options: ['파이썬 실행 속도를 높이기 위해', '프로젝트마다 필요한 패키지 · 버전을 따로 관리하기 위해', '인터넷 없이 파이썬을 쓰기 위해', '파이썬 2 코드를 3 으로 자동 변환하기 위해'], answer: 1,
            explain: 'A 프로젝트는 <code>django 3</code>, B 프로젝트는 <code>django 5</code> 처럼 요구 버전이 다를 때, 가상환경은 프로젝트마다 <b>독립된 설치 공간</b>을 만들어 충돌을 막아 줍니다.' }
        ],
        slides: [
          { layout: 'title', title: '파이썬 설치와 실행', subtitle: 'Chapter 01 · Section 03', badge: '3교시',
            notes: '<p>이 교시는 "내 PC 에 설치하는 방법"을 안내하는 시간입니다. 실습실 PC 에 이미 설치되어 있다면 화면을 보여 주며 설명하고, 집에서 따라 하도록 과제로 줍니다.</p><p>시간: 1분</p>' },
          { layout: 'diagram', title: '이 강좌의 실행 환경', html: FIG_WEBIDE, caption: '편집기(스크립트 모드) + 콘솔 + >>> 셸(대화형 모드)',
            notes: '<p>학생 화면에서 편집기, ▶ 실행(Ctrl+Enter), 콘솔, &gt;&gt;&gt; 셸 버튼의 위치를 직접 찾아보게 합니다.</p><p>브라우저 안에서 진짜 파이썬(CPython → 웹어셈블리)이 돌아간다는 점을 다시 강조합니다.</p><p>시간: 5분</p>' },
          { layout: 'table', title: 'IDLE 과 이 강좌의 화면 비교', head: ['이 강좌', 'IDLE'], rows: [
            ['편집기', '[File]-[New File] 편집기 창'], ['▶ 실행 (Ctrl+Enter)', '[Run]-[Run Module] (F5)'], ['콘솔 (실행 결과)', 'IDLE 셸 창'], ['&gt;&gt;&gt; 셸 버튼', '셸의 &gt;&gt;&gt; 프롬프트']],
            notes: '<p>앞으로 강의자료에 "IDLE 에서 F5" 가 나오면 이 강좌에서는 "▶ 실행 / Ctrl+Enter" 로 바꿔 생각하면 된다고 안내합니다.</p><p>시간: 2분</p>' },
          { layout: 'bullets', title: '윈도 버전 및 시스템 종류 파악',
            bullets: ['<kbd>Win</kbd>+<kbd>R</kbd> → <code>msinfo32</code> → &lt;확인&gt;', ['[시스템 정보]에서 확인', ['x64 : 64bit', 'x86 : 32bit']], '[레이아웃 및 보기 옵션] → [표시] → [파일 확장명] 체크 (윈도 11)', '윈도 10: 파일 탐색기 → [보기] → \'파일 확장명\' 체크'],
            notes: '<p>강의자료 13~14쪽. 교사 PC 에서 직접 msinfo32 를 실행해 보여 줍니다.</p><p>확장명을 켜야 하는 이유: <code>hello.py.txt</code> 같은 실수를 막기 위해.</p><p>시간: 5분</p>' },
          { layout: 'bullets', title: '파이썬 다운로드',
            bullets: ['<code>https://www.python.org/</code> 접속', '[Downloads] → [Download Python 3.x.x] 클릭', '설치 파일 <code>python-3.x.x-amd64.exe</code> 저장', ['여기서 잠깐', ['32bit 윈도 → 32bit 설치 파일', '윈도 7 → 파이썬 3.8 까지만 설치 가능']]],
            notes: '<p>강의자료 15~16쪽. 실제 python.org 화면을 열어 [Downloads] 메뉴를 보여 주면 좋습니다(설치 파일은 받지 않아도 됨).</p><p>참고 영상(강의자료 17쪽): 파이썬 3.8과 PyCharm 설치 — 링크는 본문에 있습니다.</p><p>시간: 4분</p>' },
          { layout: 'two', title: '여기서 잠깐: 파이썬 2.x 와 3.x',
            left: { title: '파이썬 2.x', bullets: ['2.7 이 마지막 버전', '2020년 지원 종료', '<code>print "Hello"</code>', '옛 코드에 많이 남아 있음'] },
            right: { title: '파이썬 3.x ✔', bullets: ['현재 계속 발전 중', '매년 가을 새 버전 (3.14 …)', '<code>print("Hello")</code>', '2.x 와 호환되지 않음'] },
            notes: '<p>강의자료 18쪽. "특별한 이유가 없다면 최신 3.x" 가 핵심입니다.</p><p>본문의 "파이썬 2 방식의 print 는 오류" 예제를 실행해 오류 메시지 "Did you mean print(...)?" 를 함께 읽습니다.</p><p>시간: 4분</p>' },
          { layout: 'code', title: '파이썬 2 방식의 print 는 오류', code: `print "Hello, world!"`, expectError: true,
            points: ['파이썬 3 에서는 SyntaxError', '"Did you mean print(...)?"', '괄호를 넣어 고치기', '인터넷 예제가 오류라면 2.x 코드일 수도'],
            notes: '<p>일부러 오류를 내는 예제입니다. 오류 메시지를 두려워하지 말고 <b>읽는 습관</b>을 들이도록 합니다.</p><p>학생에게 직접 고쳐서 다시 실행하게 합니다.</p><p>시간: 3분</p>' },
          { layout: 'diagram', title: '파이썬 설치', html: FIG_INSTALL, caption: '그림 1-9 파이썬 설치 화면 요약',
            notes: '<p>강의자료 19~24쪽의 설치 화면을 다섯 단계로 요약했습니다.</p><p><b>꼭 강조</b>: ② Add Python to PATH 체크. ④ 설치 위치를 <code>C:\\Python\\Python3xx</code> 처럼 짧게 바꾸면 나중에 찾기 쉽습니다.</p><p>시간: 5분</p>' },
          { layout: 'bullets', title: '파이썬 설치 순서',
            bullets: ['<code>python-3.x.x.exe</code> 더블클릭 실행', '☑ <b>Add Python 3.x to PATH</b> 체크', '&lt;Customize installation&gt; → [Optional Features] &lt;Next&gt;', '[Advanced Options] 설치 위치 <code>C:\\Python\\Python3xx</code>', '&lt;Install&gt; → 설치 완료 후 &lt;Close&gt;'],
            notes: '<p>설치 확인 방법(📘): 명령 프롬프트에서 <code>python --version</code>.</p><p>PATH 를 체크하지 않았을 때 생기는 문제와 해결법(설치 파일 다시 실행 → Modify)을 짧게 안내합니다.</p><p>시간: 3분</p>' },
          { layout: 'diagram', title: '파이썬 실행 — IDLE', html: IDLE_START, caption: '<시작> → [Python 3.x] → [IDLE (Python 3.x 64-bit)] → 파이썬 셸(대화형 모드)',
            notes: '<p>강의자료 25~26쪽. IDLE = 파이썬과 함께 설치되는 기본 개발 도구.</p><p>첫 줄의 버전 정보, 마지막 줄의 <code>&gt;&gt;&gt;</code> 프롬프트를 짚어 줍니다. 종료는 [File]-[Exit] (Ctrl+Q) — 강의자료 30쪽.</p><p>시간: 3분</p>' },
          { layout: 'table', title: '📘 명령 프롬프트에서 실행하기', lead: 'IDLE 의 F5 말고 — 실무에서 쓰는 방식',
            head: ['명령', '하는 일'], rows: [
              ['<code>python hello.py</code>', '파일을 처음부터 끝까지 실행'],
              ['<code>python hello.py 10 20</code>', '값을 인자로 넘겨 실행 (<code>sys.argv</code>)'],
              ['<code>python -c "print(1+2)"</code>', '파일 없이 한 줄 실행'],
              ['<code>python -m calendar 2026 9</code>', '모듈을 프로그램처럼 실행'],
              ['<code>python</code> / <code>exit()</code>', '대화형 모드 시작 / 종료']],
            notes: '<p>보충 내용입니다. 교사 PC 의 명령 프롬프트에서 <code>python -m calendar 2026 9</code> 를 실제로 쳐 보여 주면 "이게 되네?" 하는 반응이 나옵니다.</p><p><b>자주 나오는 문제</b>: "파일을 찾을 수 없습니다" → 명령 프롬프트가 있는 <b>폴더</b>가 다른 것입니다. 탐색기 주소창에 <code>cmd</code> 를 입력하면 그 폴더에서 열린다는 요령을 알려 주세요.</p><p>시간: 4분</p>' },
          { layout: 'code', title: '📘 __name__ 과 "__main__"', code: `# ===== File: mymath.py =====
def add(a, b):
    return a + b

if __name__ == "__main__":
    print("mymath.py 자체 시험:", add(2, 3))

# ===== File: main.py =====
import mymath

print("불러다 쓰기:", mymath.add(10, 20))
print("main.py 의 __name__ :", __name__)`,
            points: ['직접 실행한 파일 → <code>"__main__"</code>', '<code>import</code> 로 불러온 파일 → 모듈 이름', '시험 출력이 <b>안 나오는 것</b>이 핵심', '남이 쓸 코드를 만들 때의 기본 장치'],
            notes: '<p>보충 내용입니다. 먼저 <b>출력을 예상하게</b> 한 뒤 실행하세요. 대부분 "자체 시험" 줄이 나올 거라고 답합니다.</p><p>비유: 가게가 <b>내가 직접 열었을 때만</b> 간판에 불을 켜는 것. 남이 물건만 가져갈 때는 간판을 켤 필요가 없습니다.</p><p>이 슬라이드는 실습 1-15 로 바로 이어집니다.</p><p>시간: 5분</p>' },
          { layout: 'two', title: '📘 pip · PyPI · 가상환경',
            left: { title: 'pip — 남의 기능 가져오기', bullets: ['PyPI(<code>pypi.org</code>) = 패키지 창고 60만+', '<code>python -m pip install requests</code>', '<code>python -m pip list</code> / <code>show</code> / <code>uninstall</code>', '<code>pip</code> 보다 <b><code>python -m pip</code></b> 을 권장', '⚠ 이름 한 글자 차이 악성 패키지 주의'] },
            right: { title: 'venv — 프로젝트마다 따로', bullets: ['A는 django 3, B는 django 5 … 충돌!', '<code>python -m venv .venv</code>', '<code>.venv\\Scripts\\activate</code>', '<code>pip freeze &gt; requirements.txt</code>', '지우고 싶으면 폴더만 삭제'] },
            notes: '<p>보충 내용입니다. 이 강좌에서는 필요 없지만 "내 PC 에서 두 번째 프로젝트를 시작할 때" 반드시 만나게 되는 개념이라고 예고합니다.</p><p><b>비유</b>: 가상환경 = 프로젝트마다 따로 쓰는 <b>도구 상자</b>. 공용 창고에 다 섞어 두면 누가 무엇을 바꿨는지 알 수 없습니다.</p><p>"분명히 설치했는데 없다고 나와요"의 원인이 pip 이 다른 파이썬을 가리키는 것이라는 점을 꼭 언급하세요.</p><p>시간: 5분</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '파이썬 설치 첫 화면에서 꼭 체크해야 하는 항목은?', options: ['Install launcher for all users', 'Add Python 3.x to PATH', 'Documentation', 'Precompile standard library'], answer: 1,
            explain: 'PATH 에 등록해야 명령 프롬프트 어디서든 python 명령을 쓸 수 있습니다.',
            notes: '<p>설치 과정에서 가장 많이 실수하는 부분이므로 한 번 더 확인합니다.</p><p>시간: 1분</p>' },
          { layout: 'practice', title: '실습 1-14. 파이썬 2 코드를 3 으로 고치기', desc: '파이썬 2 방식의 <code>print "…"</code> 두 줄을 파이썬 3 에서 실행되도록 고치세요.',
            starter: '# print "Python 2 는 끝났습니다."\n# print "이제는 Python", 3\n',
            solution: 'print("Python 2 는 끝났습니다.")\nprint("이제는 Python", 3)\n',
            notes: '<p>주석(<code>#</code>)을 지우는 방법도 함께 알려 줍니다. 주석은 4교시에 자세히 다룹니다.</p><p>시간: 3분</p>' },
          { layout: 'summary', title: '정리', bullets: ['이 강좌: 브라우저에서 바로 실행 (편집기 + 콘솔 + >>> 셸)', 'msinfo32 로 64bit/32bit 확인, 파일 확장명 표시', 'python.org → 다운로드 → PATH 체크 → 설치', '2.x 는 지원 종료 → 최신 3.x 사용', 'IDLE = 대화형 모드의 파이썬 셸, 종료는 [File]-[Exit]'],
            notes: '<p>과제: 집 PC 에 파이썬을 설치하고 IDLE 에서 <code>print("Hello, world!")</code> 를 실행한 화면을 캡처해 오기(선택).</p><p>시간: 2분</p>' }
        ]
      },

      /* ───────────────────────── Section 04 ───────────────────────── */
      {
        id: 'ch01-4',
        title: '대화형 모드와 스크립트 모드 — 첫 파이썬 프로그램',
        minutes: 50,
        goals: [
          '대화형 모드(>>> 셸)에서 print() 와 계산식을 입력해 결과를 바로 확인할 수 있다',
          '파이썬의 기본 산술 연산자(+, -, *, /, //, %, **)를 사용할 수 있다',
          '스크립트 모드(편집기 + ▶ 실행)로 여러 줄의 프로그램을 작성 · 실행할 수 있다',
          '대화형 모드와 스크립트 모드의 차이를 설명할 수 있다',
          '주석을 달고, 흔한 오류 메시지(NameError, SyntaxError, IndentationError)를 읽고 고칠 수 있다',
          '셸에서 type() · dir() · help() 로 값과 기능을 스스로 확인할 수 있다',
          '트레이스백을 아래에서 위로 읽고, 오류가 난 줄과 원인이 있는 줄을 구분할 수 있다',
          'docstring 과 주석의 차이를 알고, PEP 8 의 기본 스타일에 맞춰 코드를 쓸 수 있다'
        ],
        flow: [['대화형 모드: 예1 ~ 예3 · 산술 연산자', 12], ['📘 셸 탐험 도구 (type · dir · help)', 7], ['스크립트 모드 · 두 모드 비교', 10], ['주석 · 📘 docstring · PEP 8', 8], ['📘 오류 메시지와 트레이스백 읽기', 8], ['장 정리 · 퀴즈 · 프로젝트 안내', 5]],
        content: [
          { type: 'h', text: '대화형 모드로 코드 입력하고 실행하기' },
          { type: 'p', html: '<b>대화형 모드(interactive mode)</b>는 <code>&gt;&gt;&gt;</code> 프롬프트 뒤에 코드를 <b>한 줄</b> 입력하고 <kbd>Enter</kbd> 를 누르면, 파이썬이 그 줄을 <b>바로 실행</b>해 결과를 보여 주는 방식입니다. 사람과 컴퓨터가 한 마디씩 주고받으며 대화하는 것 같아서 붙은 이름입니다. IDLE 셸이 바로 대화형 모드이며, 이 강좌에서는 콘솔의 <b>&gt;&gt;&gt; 셸</b> 버튼으로 엽니다.' },
          { type: 'callout', kind: 'tip', title: '직접 해 보기', html: '콘솔 위쪽의 <b>&gt;&gt;&gt; 셸</b> 버튼을 누르고, <code>&gt;&gt;&gt;</code> 뒤에 아래 예제의 코드를 직접 입력한 뒤 <kbd>Enter</kbd> 를 눌러 보세요. 예제 상자의 ▶ 실행을 눌러도 같은 결과를 볼 수 있습니다.' },
          { type: 'h', text: '예1. Hello, world! 출력하기' },
          { type: 'p', html: '<code>&gt;&gt;&gt;</code> 다음에 <code>print("Hello, world!")</code> 를 입력하고 <kbd>Enter</kbd> 를 누릅니다. 바로 아래 줄에 <code>Hello, world!</code> 가 출력되고, 다음 명령을 기다리는 <code>&gt;&gt;&gt;</code> 가 다시 나타납니다.' },
          { type: 'code', repl: true, title: '그림 1-12 코드 입력과 실행 예1', code: 'print("Hello, world!")', expect: '>>> print("Hello, world!")\nHello, world!\n>>>' },
          { type: 'h', text: '예2. 간단한 계산식' },
          { type: 'p', html: '<code>&gt;&gt;&gt;</code> 다음에 <code>10 + 20</code> 을 입력하고 <kbd>Enter</kbd> 를 누르면 계산 결과 <code>30</code> 이 출력됩니다. 대화형 모드에서는 <code>print()</code> 를 쓰지 않아도 <b>식의 결과가 자동으로 표시</b>됩니다.' },
          { type: 'code', repl: true, title: '그림 1-13 코드 입력과 실행 예2', code: '10 + 20', expect: '>>> 10 + 20\n30\n>>>' },
          { type: 'h', text: '예3. 조금 복잡한 계산식' },
          { type: 'p', html: '복잡한 계산도 순식간에 합니다. <code>9876 * 27 - 32767</code> 을 입력해 보세요. 파이썬에서 곱하기 기호는 <code>×</code> 가 아니라 <b>별표 <code>*</code></b> 입니다. 수학과 마찬가지로 곱셈을 먼저 계산한 뒤 뺄셈을 합니다.' },
          { type: 'code', repl: true, title: '그림 1-14 코드 입력과 실행 예3', code: '9876 * 27 - 32767', expect: '>>> 9876 * 27 - 32767\n233885\n>>>', desc: '9876 × 27 = 266652, 266652 − 32767 = <b>233885</b> 입니다. 계산기를 두드리는 것보다 빠르지요?' },
          { type: 'callout', kind: 'more', title: '셸에서 글자만 입력하면?', html: '대화형 모드에서 <code>"Hello"</code> 처럼 글자(문자열)만 입력하면 <code>\'Hello\'</code> 처럼 <b>따옴표가 붙은 채로</b> 표시됩니다. 셸은 "이 값은 문자열입니다"라는 것을 보여 주기 위해 값의 <b>표현(representation)</b>을 출력하기 때문입니다. 반면 <code>print()</code> 는 사람이 읽기 좋게 따옴표 없이 내용만 출력합니다.' },
          { type: 'code', repl: true, title: '추가 예제. 셸의 자동 표시와 print() 의 차이', code: '"Hello"\nprint("Hello")\n3 + 4\nprint(3 + 4)', expect: ">>> \"Hello\"\n'Hello'\n>>> print(\"Hello\")\nHello\n>>> 3 + 4\n7\n>>> print(3 + 4)\n7\n>>>" },

          { type: 'h', text: '📘 파이썬 계산기 — 산술 연산자' },
          { type: 'p', html: '대화형 모드는 강력한 계산기로 쓸 수 있습니다. 파이썬의 기본 산술 연산자를 미리 맛보겠습니다. (연산자는 뒤의 장에서 자세히 배웁니다)' },
          { type: 'table', head: ['연산자', '의미', '예', '결과'], rows: [
            ['<code>+</code>', '더하기', '<code>7 + 2</code>', '<code>9</code>'],
            ['<code>-</code>', '빼기', '<code>7 - 2</code>', '<code>5</code>'],
            ['<code>*</code>', '곱하기', '<code>7 * 2</code>', '<code>14</code>'],
            ['<code>/</code>', '나누기 (결과는 실수)', '<code>7 / 2</code>', '<code>3.5</code>'],
            ['<code>//</code>', '몫 (정수 나눗셈)', '<code>7 // 2</code>', '<code>3</code>'],
            ['<code>%</code>', '나머지', '<code>7 % 2</code>', '<code>1</code>'],
            ['<code>**</code>', '거듭제곱', '<code>7 ** 2</code>', '<code>49</code>']
          ], caption: '파이썬의 산술 연산자' },
          { type: 'code', repl: true, title: '추가 예제. 셸을 계산기로 사용하기', code: '7 / 2\n7 // 2\n7 % 2\n2 ** 10\n(10 + 20) * 3\n2 ** 100', expect: '>>> 7 / 2\n3.5\n>>> 7 // 2\n3\n>>> 7 % 2\n1\n>>> 2 ** 10\n1024\n>>> (10 + 20) * 3\n90\n>>> 2 ** 100\n1267650600228229401496703205376\n>>>', desc: '괄호 <code>( )</code> 안을 먼저 계산하는 규칙도 수학과 같습니다. 마지막 줄처럼 파이썬은 <b>아주 큰 정수</b>도 정확하게 계산합니다. (많은 언어는 이 정도 큰 수를 그대로 다루지 못합니다)' },

          { type: 'h', text: '📘 셸은 계산기가 아니라 탐험 도구 — type() · dir() · help()' },
          { type: 'p', html: '대화형 모드의 진짜 가치는 계산이 아니라 <b>확인</b>에 있습니다. 문서를 뒤지기 전에 셸에서 한 줄 쳐 보면 5초 만에 답이 나오는 경우가 아주 많습니다. 숙련된 개발자일수록 셸 창을 항상 하나 열어 둡니다. 이때 쓰는 도구가 다음 셋입니다.' },
          { type: 'table', head: ['도구', '알려 주는 것', '예'], rows: [
            ['<code>type(값)</code>', '이 값이 <b>무슨 종류</b>인지', '<code>type(10)</code> → <code>&lt;class \'int\'&gt;</code>'],
            ['<code>dir(값)</code>', '이 값이 <b>할 수 있는 일의 목록</b>', '<code>dir("글자")</code> → <code>upper</code>, <code>split</code> …'],
            ['<code>help(대상)</code>', '<b>사용법 설명</b>(도움말)', '<code>help(len)</code>'],
            ['<code>len(값)</code>', '길이 · 개수', '<code>len("파이썬")</code> → <code>3</code>']
          ], caption: '셸에서 가장 많이 쓰는 탐험 도구' },
          { type: 'code', repl: true, title: '추가 예제. 값의 정체를 확인하는 type()', code: 'type(10)\ntype("10")\ntype(3.14)\nlen("파이썬")\n"python".upper()\n10 + 20\n_ * 2', expect: '>>> type(10)\n<class \'int\'>\n>>> type("10")\n<class \'str\'>\n>>> type(3.14)\n<class \'float\'>\n>>> len("파이썬")\n3\n>>> "python".upper()\n\'PYTHON\'\n>>> 10 + 20\n30\n>>> _ * 2\n60\n>>>', desc: '<code>10</code> 과 <code>"10"</code> 은 <b>보이는 모양은 같아도 종류가 다릅니다</b>(<code>int</code> 는 정수, <code>str</code> 은 글자). 이 차이 때문에 생기는 오류가 초보 단계에서 가장 많으므로, 이상하면 <code>type()</code> 으로 확인하는 습관을 들이세요. 마지막 줄의 <code>_</code> 는 셸에서 <b>바로 앞 결과</b>를 뜻하는 특별한 이름입니다.' },
          { type: 'code', title: '추가 예제. 도움말 읽어 보기 — help()', code: `help(len)`, expect: 'Help on built-in function len in module builtins:\n\nlen(obj, /)\n    Return the number of items in a container.', desc: '<code>help()</code> 는 그 대상에 붙어 있는 <b>설명문(docstring)</b>을 꺼내 보여 줍니다. "컨테이너에 들어 있는 항목의 개수를 돌려준다"는 뜻입니다. <code>help(print)</code>, <code>help(str.upper)</code> 처럼 바꿔 실행해 보세요. 인터넷 검색보다 빠를 때가 많습니다.' },
          { type: 'code', title: '추가 예제. 이 값으로 무엇을 할 수 있을까 — dir()', code: `import math

print("math 가 제공하는 것의 개수:", len(dir(math)) > 50)
print("sqrt 가 있나요?", "sqrt" in dir(math))
print("root 가 있나요?", "root" in dir(math))

text = "python"
print("upper 가 있나요?", "upper" in dir(text))
print("실제로 써 보면:", text.upper())`, expect: 'math 가 제공하는 것의 개수: True\nsqrt 가 있나요? True\nroot 가 있나요? False\nupper 가 있나요? True\n실제로 써 보면: PYTHON', desc: '<code>dir()</code> 은 그 대상이 가진 이름들을 <b>목록</b>으로 돌려줍니다. "제곱근 함수 이름이 <code>sqrt</code> 였나 <code>root</code> 였나?" 처럼 헷갈릴 때 검색 대신 <code>dir()</code> 로 바로 확인할 수 있습니다. 셸에서는 <code>dir(math)</code> 라고만 쳐서 전체 목록을 볼 수 있습니다.' },
          { type: 'callout', kind: 'more', title: '셸을 200% 쓰는 잔기술', html: '<ul><li><b><kbd>↑</kbd> · <kbd>↓</kbd></b> — 앞에 입력한 줄을 다시 불러옵니다. 긴 줄을 조금만 고쳐 실행할 때 필수입니다.</li><li><b><code>_</code></b> — 바로 앞 식의 결과. <code>1234 * 5678</code> 을 계산한 뒤 <code>_ + 1</code> 처럼 이어서 쓸 수 있습니다.</li><li><b>작게 쪼개기</b> — 프로그램이 이상하면 문제되는 한 줄만 셸에 옮겨 와 실행해 봅니다. 원인을 찾는 가장 빠른 길입니다.</li><li><b>IDLE · 표준 셸에서는 <kbd>Tab</kbd> 완성</b> 도 됩니다. <code>math.</code> 까지 치고 <kbd>Tab</kbd> 을 누르면 쓸 수 있는 이름이 나옵니다.</li><li>셸에 적은 내용은 <b>저장되지 않습니다</b>. 쓸 만한 코드가 나왔다면 편집기로 옮겨 두세요.</li></ul>' },

          { type: 'h', text: '스크립트 모드로 프로그램 만들기' },
          { type: 'p', html: '대화형 모드는 간단히 확인하기에는 편하지만, 입력한 코드가 <b>저장되지 않고</b> 여러 줄의 프로그램을 고쳐 가며 만들기 어렵습니다. 그래서 실제 프로그램은 <b>스크립트 모드(script mode)</b>로 만듭니다. 스크립트 모드는 편집기에 여러 줄의 코드를 작성해 <b>파일(.py)</b>로 저장한 뒤, 한꺼번에 실행하는 방식입니다.' },
          { type: 'figure', html: FIG_MODES, caption: '대화형 모드와 스크립트 모드' },
          { type: 'p', html: '이 강좌에서는 <b>왼쪽 편집기</b>에 코드를 작성하고 <b>▶ 실행</b>(또는 <kbd>Ctrl</kbd>+<kbd>Enter</kbd>)을 누르면 스크립트 모드로 실행됩니다. 앞의 예1 ~ 예3 을 스크립트로 바꿔 보겠습니다.' },
          { type: 'code', title: '추가 예제. 예1 ~ 예3 을 스크립트 모드로 실행하기', code: `print("Hello, world!")
print(10 + 20)
print(9876 * 27 - 32767)`, expect: 'Hello, world!\n30\n233885', desc: '스크립트 모드에서는 세 줄이 <b>위에서 아래로 한꺼번에</b> 실행됩니다. 대화형 모드와 달리 계산 결과를 보려면 반드시 <code>print()</code> 를 써야 합니다.' },
          { type: 'callout', kind: 'warn', title: '스크립트 모드에서는 print() 가 없으면 아무것도 안 보인다', html: '아래 코드를 실행하면 파이썬은 <code>10 + 20</code> 을 계산하기는 하지만, 결과를 <b>화면에 출력하라는 명령이 없으므로</b> 아무것도 표시되지 않습니다. 대화형 모드에서 하던 습관대로 쓰면 "왜 결과가 안 나오지?" 하고 당황하기 쉬우니 기억해 두세요.' },
          { type: 'code', title: '추가 예제. print() 없이 계산만 하면?', code: `10 + 20
9876 * 27 - 32767`, expect: '', desc: '실행해도 콘솔에 아무것도 나오지 않습니다. 각 줄을 <code>print(10 + 20)</code> 처럼 고쳐서 다시 실행해 보세요.' },
          { type: 'table', head: ['비교', '대화형 모드 (&gt;&gt;&gt; 셸)', '스크립트 모드 (편집기)'], rows: [
            ['입력 방식', '한 줄씩 입력', '여러 줄을 작성'],
            ['실행 시점', 'Enter 를 누를 때마다 그 줄을 실행', '▶ 실행을 누르면 전체를 실행'],
            ['결과 표시', '식의 값이 <b>자동 표시</b>', '<code>print()</code> 로 출력해야 보임'],
            ['저장', '저장되지 않음', '<code>.py</code> 파일로 저장 가능'],
            ['쓰임새', '간단한 계산, 기능 확인, 실험', '실제 프로그램 작성'],
            ['IDLE 에서', '처음 뜨는 IDLE 셸', '[File]-[New File] → 저장 → F5'],
            ['이 강좌에서', '콘솔의 <b>&gt;&gt;&gt; 셸</b>', '편집기 + <b>▶ 실행</b> (Ctrl+Enter)']
          ], caption: '대화형 모드와 스크립트 모드 비교' },
          { type: 'callout', kind: 'more', title: '집에서 IDLE 스크립트 모드 사용하기', html: '<ol><li>IDLE 셸에서 <b>[File]-[New File]</b> (<kbd>Ctrl</kbd>+<kbd>N</kbd>)을 선택하면 빈 편집기 창이 열립니다.</li><li>코드를 입력한 뒤 <b>[File]-[Save]</b> (<kbd>Ctrl</kbd>+<kbd>S</kbd>)로 저장합니다. 파일 이름 끝에 <code>.py</code> 가 붙습니다. (예: <code>hello.py</code>)</li><li><b>[Run]-[Run Module]</b> (<kbd>F5</kbd>)을 누르면 코드가 실행되고 결과가 IDLE 셸 창에 나타납니다.</li><li>저장한 파일은 나중에 [File]-[Open] 으로 다시 열어 고칠 수 있습니다.</li></ol>' },
          { type: 'code', title: '추가 예제. 나의 첫 스크립트 — 간단한 영수증', code: `print("===== 파이썬 분식 =====")
print("떡볶이 2 인분 :", 4000 * 2, "원")
print("김밥   3 줄   :", 3500 * 3, "원")
print("----------------------")
print("합계          :", 4000 * 2 + 3500 * 3, "원")
print("======================")`, expect: '===== 파이썬 분식 =====\n떡볶이 2 인분 : 8000 원\n김밥   3 줄   : 10500 원\n----------------------\n합계          : 18500 원\n======================', desc: '글자와 계산식을 섞어 작은 영수증을 만들었습니다. 가격이나 수량을 바꿔 다시 실행해 보세요. 이렇게 <b>고치고 → 다시 실행하는</b> 일은 스크립트 모드라서 편리합니다.' },

          { type: 'h', text: '📘 주석 — 코드에 메모 남기기' },
          { type: 'p', html: '<code>#</code> 기호 뒤에 쓴 내용은 <b>주석(comment)</b>이라고 하며, 파이썬이 실행하지 않고 건너뜁니다. 코드를 설명하는 메모를 남기거나, 잠시 실행하고 싶지 않은 줄을 막아 둘 때 사용합니다.' },
          { type: 'code', title: '추가 예제. 주석 사용하기', code: `# 나의 첫 파이썬 프로그램
# 작성자: 홍길동

print("주석은 실행되지 않습니다.")   # 줄 끝에도 주석을 달 수 있다
# print("이 줄은 실행되지 않습니다.")
print("프로그램 끝")`, expect: '주석은 실행되지 않습니다.\n프로그램 끝', desc: '<code>1 · 2행</code>은 설명용 주석, <code>4행</code>은 코드 뒤에 붙인 주석, <code>5행</code>은 <code>#</code> 으로 막아 둔 코드입니다. <code>5행</code>의 <code>#</code> 을 지우고 다시 실행해 보세요.' },
          { type: 'callout', kind: 'more', title: '좋은 주석과 나쁜 주석 — "무엇"이 아니라 "왜"', html: '<p>주석을 많이 다는 것이 좋은 것은 아닙니다. 코드를 읽으면 알 수 있는 내용을 그대로 옮겨 적은 주석은 <b>오히려 방해</b>가 됩니다. 코드를 고칠 때 주석을 같이 고치지 않으면 <b>거짓말하는 주석</b>이 되어 더 위험합니다.</p><ul><li>❌ <code>total = total + 1  # total 에 1 을 더한다</code> — 코드가 이미 말하고 있음</li><li>⭕ <code>total = total + 1  # 헤더 줄은 세지 않으므로 나중에 1 을 더해 보정</code> — <b>왜</b> 그렇게 했는지</li><li>⭕ <code># 주의: 이 API 는 100 건까지만 한 번에 준다</code> — 코드만 봐서는 알 수 없는 사실</li></ul><p>정리하면 <b>"무엇을 하는지"는 코드로, "왜 그렇게 했는지"는 주석으로</b> 적습니다. 이름을 잘 짓는 것이 주석을 잘 다는 것보다 대체로 낫습니다.</p>' },

          { type: 'h', text: '📘 docstring — 설명을 코드 안에 넣어 두기' },
          { type: 'p', html: '앞에서 <code>help(len)</code> 을 실행했을 때 나온 설명문은 어디에서 온 걸까요? 파이썬에는 함수 · 클래스 · 파일의 <b>첫머리에 적는 문자열</b>을 설명문으로 인정하는 약속이 있습니다. 이것을 <b>docstring(문서화 문자열)</b>이라고 하며, 보통 큰따옴표 세 개(<code>"""</code>)로 감쌉니다.' },
          { type: 'code', title: '추가 예제. docstring 을 쓰고 꺼내 보기', code: `def area(width, height):
    """직사각형의 넓이를 구한다.

    width, height: 두 변의 길이
    """
    return width * height


print("넓이:", area(3, 4))
print("---- 설명문 ----")
print(area.__doc__)`, expect: '넓이: 12\n---- 설명문 ----\n직사각형의 넓이를 구한다.\n\nwidth, height: 두 변의 길이', desc: '함수 정의 바로 아래 줄의 문자열이 <code>__doc__</code> 에 저장되고, <code>help(area)</code> 로도 볼 수 있습니다. 주석(<code>#</code>)은 실행 시점에 <b>완전히 사라지지만</b>, docstring 은 프로그램 안에 <b>값으로 남아</b> 편집기의 도움말 풍선, <code>help()</code>, 자동 문서 생성 도구가 읽어 갑니다. 이것이 둘의 결정적 차이입니다.' },
          { type: 'table', head: ['', '주석 <code>#</code>', 'docstring <code>"""…"""</code>'], rows: [
            ['위치', '어디든', '파일 · 함수 · 클래스의 <b>첫머리</b>'],
            ['실행 후', '사라진다', '값으로 <b>남는다</b> (<code>__doc__</code>)'],
            ['읽는 사람', '이 코드를 <b>고칠</b> 사람', '이 코드를 <b>쓸</b> 사람'],
            ['내용', '왜 이렇게 했는지, 주의사항', '무엇을 하는지, 입력 · 출력']
          ], caption: '주석과 docstring 의 차이' },

          { type: 'h', text: '📘 PEP 8 — 파이썬의 코드 스타일 약속' },
          { type: 'p', html: '문법만 맞으면 파이썬은 불평하지 않습니다. 하지만 <b>코드는 쓰는 시간보다 읽는 시간이 훨씬 깁니다.</b> 그래서 파이썬 커뮤니티는 <b>PEP 8</b> 이라는 공통 스타일 안내서를 두고 거의 모든 프로젝트가 이를 따릅니다. 처음부터 이 습관을 들이면 나중에 고치느라 고생하지 않습니다.' },
          { type: 'table', head: ['항목', '권장', '피할 것'], rows: [
            ['들여쓰기', '<b>공백 4칸</b>', '탭과 공백 섞어 쓰기'],
            ['이름', '변수 · 함수는 <code>snake_case</code>, 상수는 <code>UPPER_CASE</code>', '<code>MyVariable</code>, <code>a1</code>, <code>ㅁㄴㅇ</code>'],
            ['연산자 주위', '<code>x = a + b</code> (양쪽 한 칸)', '<code>x=a+b</code>, <code>x  =  a</code>'],
            ['쉼표 뒤', '<code>f(1, 2)</code> (뒤에만 한 칸)', '<code>f(1 ,2)</code>'],
            ['한 줄 길이', '<b>79자</b> 이내 (팀에 따라 88~100)', '한 줄에 화면을 넘길 만큼 길게'],
            ['한 줄에 한 문장', '한 줄에 하나씩', '<code>a = 1; b = 2</code>'],
            ['import', '파일 맨 위, <b>한 줄에 하나</b>', '<code>import os, sys</code>'],
            ['빈 줄', '함수 사이 2줄, 논리 묶음 사이 1줄', '빈 줄 없이 빽빽하게']
          ], caption: 'PEP 8 기본 규칙 (자주 쓰는 것만)' },
          { type: 'code', title: '추가 예제. 같은 일을 하는 두 코드 — 읽기 쉬운 쪽은?', code: `# ① 문법은 맞지만 읽기 어려운 코드
a=10;b=20
print( "합:",a+b )

# ② PEP 8 스타일
first_number = 10
second_number = 20
print("합:", first_number + second_number)`, expect: '합: 30\n합: 30', desc: '두 코드의 <b>결과는 완전히 같습니다</b>. 하지만 ②는 변수 이름만 봐도 무엇인지 알 수 있고, 한 달 뒤에 다시 봐도 읽힙니다. 스타일은 취향 문제가 아니라 <b>남(그리고 미래의 나)에게 드는 비용</b>의 문제입니다.' },
          { type: 'callout', kind: 'more', title: '스타일은 손으로 지키지 않습니다 — 도구에 맡기기', html: '<p>실무에서는 사람이 공백을 세지 않고 도구가 자동으로 맞춰 줍니다. 나중에 내 PC 에 파이썬을 설치했다면 한 번 써 보세요.</p><ul><li><b>포매터</b> — 저장할 때 코드 모양을 자동 정리: <code>black</code>, <code>ruff format</code></li><li><b>린터</b> — 스타일 위반과 의심스러운 코드를 지적: <code>ruff</code>, <code>flake8</code>, <code>pylint</code></li><li>설치와 실행: <code>python -m pip install ruff</code> → <code>ruff format hello.py</code></li></ul><p>VS Code 같은 편집기는 이 도구들을 연결해 <b>저장할 때마다 자동 정리</b>하게 설정할 수 있습니다. 규칙을 외우기보다 도구를 켜 두는 편이 훨씬 현실적입니다. PEP 8 원문은 <code>peps.python.org/pep-0008</code> 에 있습니다.</p>' },

          { type: 'h', text: '📘 처음 만나는 오류 메시지' },
          { type: 'p', html: '프로그래밍을 하면 오류는 반드시 만납니다. 전문 프로그래머도 매일 오류를 봅니다. 중요한 것은 <b>오류 메시지를 읽고 고치는 방법</b>을 아는 것입니다. 오류 메시지의 <b>마지막 줄</b>에는 오류의 종류와 이유가, 그 위에는 <b>몇 번째 줄(line)</b>에서 났는지가 나옵니다.' },
          { type: 'code', title: '추가 예제. NameError — 이름을 잘못 쓴 경우', code: `Print("Hello, world!")`, expectError: true, expect: `Traceback (most recent call last):
  File "main.py", line 1, in <module>
    Print("Hello, world!")
    ^^^^^
NameError: name 'Print' is not defined. Did you mean: 'print'?`, desc: '파이썬은 <b>대문자와 소문자를 구별</b>합니다. <code>Print</code> 와 <code>print</code> 는 다른 이름이어서 "Print 라는 이름이 정의되지 않았다. print 를 뜻했나요?" 라는 오류가 납니다.' },
          { type: 'code', title: '추가 예제. SyntaxError — 괄호를 닫지 않은 경우', code: `print("Hello, world!"`, expectError: true, expect: `  File "main.py", line 1
    print("Hello, world!"
         ^
SyntaxError: '(' was never closed`, desc: '여는 괄호 <code>(</code> 가 닫히지 않았다는 뜻입니다. 괄호와 따옴표는 항상 <b>짝</b>을 맞춰야 합니다.' },
          { type: 'code', title: '추가 예제. IndentationError — 줄 앞에 공백을 넣은 경우', code: `print("첫째 줄")
 print("둘째 줄")`, expectError: true, expect: `  File "main.py", line 2
    print("둘째 줄")
IndentationError: unexpected indent`, desc: '파이썬에서 줄 앞의 공백(<b>들여쓰기</b>)은 특별한 의미가 있어서 함부로 넣으면 안 됩니다. <code>2행</code> 앞의 공백 한 칸을 지우면 해결됩니다. 들여쓰기는 조건문 · 반복문에서 자세히 배웁니다.' },
          { type: 'table', head: ['오류 이름', '뜻', '흔한 원인', '고치는 법'], rows: [
            ['<code>SyntaxError</code>', '문법 오류', '따옴표 · 괄호 짝이 안 맞음, 파이썬 2 방식 print', '짝을 맞추고 괄호 사용'],
            ['<code>NameError</code>', '모르는 이름', '철자 · 대소문자 틀림 (<code>Print</code>, <code>pirnt</code>)', '정확한 이름으로 고치기'],
            ['<code>IndentationError</code>', '들여쓰기 오류', '줄 앞에 불필요한 공백', '공백 지우기'],
            ['<code>ZeroDivisionError</code>', '0 으로 나눔', '<code>10 / 0</code>', '0 이 아닌 수로 나누기']
          ], caption: '처음 자주 만나는 오류' },
          { type: 'callout', kind: 'tip', title: '따옴표는 영어 자판으로!', html: '한글 워드프로세서나 발표 자료에서 복사한 코드에는 <code>“ ”</code> 처럼 <b>둥근 따옴표(스마트 따옴표)</b>가 들어 있는 경우가 많습니다. 파이썬은 곧은 따옴표 <code>" "</code> 와 <code>\' \'</code> 만 인식하므로 이런 코드는 SyntaxError 가 납니다. 코드는 직접 입력하는 습관을 들이세요.' },

          { type: 'h', text: '📘 트레이스백 읽는 법 — 아래에서 위로' },
          { type: 'p', html: '오류가 나면 <code>Traceback (most recent call last):</code> 로 시작하는 여러 줄이 쏟아집니다. 처음에는 무섭게 보이지만 구조는 아주 단순합니다. 이 화면은 <b>"오류가 여기까지 어떻게 왔는지"의 경로 기록</b>입니다.' },
          { type: 'list', ordered: true, items: [
            '<b>맨 마지막 줄부터</b> 읽습니다. <code>ZeroDivisionError: division by zero</code> 처럼 <b>오류 이름 : 이유</b>가 적혀 있습니다. 여기에 답의 80%가 있습니다.',
            '그 <b>바로 위 블록</b>이 오류가 실제로 터진 위치입니다. <code>File "main.py", line 3, in average</code> — <b>3행</b>, <code>average</code> 함수 안입니다. 아래의 <code>~~~^~~~</code> 표시는 문제가 된 부분을 가리킵니다.',
            '더 위쪽 블록들은 <b>거기까지 부른 순서</b>입니다. <code>most recent call last</code> 는 "가장 최근 호출이 맨 아래"라는 뜻이라, 위에서 아래로 내려갈수록 더 깊이 들어간 것입니다.',
            '내 코드가 아니라 <b>라이브러리 파일</b>이 보이면, 아래에서 위로 올라오며 <b>내가 쓴 파일이 처음 나오는 줄</b>을 찾으세요. 원인은 거의 항상 거기에 있습니다.'
          ] },
          { type: 'code', title: '추가 예제. 여러 단계를 거친 오류 읽어 보기', code: `def average(numbers):
    total = sum(numbers)
    return total / len(numbers)


def report(title, numbers):
    print(title, "평균:", average(numbers))


print("첫 번째 반:")
report("1반", [80, 90, 100])
print("두 번째 반:")
report("2반", [])`, expectError: true, expect: `첫 번째 반:
1반 평균: 90.0
두 번째 반:
Traceback (most recent call last):
  File "main.py", line 13, in <module>
    report("2반", [])
    ~~~~~~^^^^^^^^^^^
  File "main.py", line 7, in report
    print(title, "평균:", average(numbers))
                          ~~~~~~~^^^^^^^^^
  File "main.py", line 3, in average
    return total / len(numbers)
           ~~~~~~^~~~~~~~~~~~~~
ZeroDivisionError: division by zero`, desc: '읽는 순서를 따라가 봅시다. ① 마지막 줄: <b>0 으로 나눴다</b>. ② 그 위: <code>3행</code>의 <code>total / len(numbers)</code> 에서 터졌다. ③ 더 위: <code>7행</code>이 <code>average</code> 를 불렀고, <code>13행</code>이 <code>report</code> 를 불렀다. 그러므로 진짜 원인은 <b>13행에서 빈 목록 <code>[]</code> 을 넘긴 것</b>입니다. 오류가 난 줄(3행)과 <b>원인이 있는 줄(13행)이 다르다</b>는 점이 핵심입니다.' },
          { type: 'callout', kind: 'more', title: '디버깅의 네 단계 — 찍지 말고 좁히기', html: '<p>오류를 고칠 때 코드를 이리저리 바꿔 보며 찍는 것은 가장 느린 방법입니다. 다음 순서를 습관으로 만드세요.</p><ol><li><b>다시 일으킨다(재현)</b> — 어떤 입력일 때 나는지 정확히 찾습니다. "가끔 난다"는 아직 못 찾은 것입니다.</li><li><b>줄인다(최소화)</b> — 오류가 계속 나는 선에서 코드를 최대한 잘라냅니다. 대개 이 과정에서 원인이 저절로 드러납니다.</li><li><b>확인한다(관찰)</b> — 내가 <b>믿고 있는 값</b>이 실제로 그런지 봅니다. <code>print(변수)</code>, <code>print(type(변수))</code>, <code>print(repr(변수))</code> 세 개면 대부분 해결됩니다. <code>repr()</code> 은 <code>" 10"</code> 처럼 <b>눈에 안 보이는 공백</b>까지 드러내 줍니다.</li><li><b>고치고 확인한다</b> — 한 번에 한 군데만 고치고 다시 실행합니다. 여러 곳을 동시에 고치면 무엇이 효과가 있었는지 알 수 없습니다.</li></ol><p>그래도 막히면 <b>오류 메시지의 마지막 줄을 그대로 검색</b>해 보세요. 파일 이름이나 내 변수 이름은 빼고 검색하는 것이 요령입니다. 같은 일을 겪은 사람이 거의 항상 있습니다.</p>' },
          { type: 'code', title: '추가 예제. print 로 값 들여다보기 — repr 의 힘', code: `value = " 10"

print("그냥 출력:", value)
print("repr 로 출력:", repr(value))
print("종류:", type(value))
print("길이:", len(value))`, expect: "그냥 출력:  10\nrepr 로 출력: ' 10'\n종류: <class 'str'>\n길이: 3", desc: '<code>print(value)</code> 만 보면 <code>10</code> 처럼 보여서 "숫자인데 왜 오류가 나지?" 하고 헤매게 됩니다. <code>repr()</code> 로 찍으면 <b>따옴표가 붙어 문자열임이 드러나고, 앞의 공백까지</b> 보입니다. 글자가 두 개(<code>1</code>, <code>0</code>)인데 길이가 <b>3</b> 인 것도 "앞에 뭔가 더 있다"는 단서입니다. 값이 수상하면 <code>repr</code> 과 <code>type</code> 을 함께 찍는 것이 가장 빠릅니다.' },

          { type: 'h', text: '1장 요약' },
          { type: 'list', items: [
            '<b>프로그래밍 언어</b>는 컴퓨터가 이해하는 말로 소프트웨어를 만드는 도구이고, <b>프로그래머</b>는 이를 사용해 소프트웨어를 만드는 사람입니다.',
            '<b>파이썬</b>은 귀도 반 로섬이 1991년에 발표한 언어로, 무료이고 읽기 쉬우며 라이브러리가 풍부합니다. 스크립트 언어라서 컴파일러 언어보다 느린 것이 단점입니다.',
            '파이썬은 <code>python.org</code> 에서 내려받아 설치하며, 설치할 때 <b>Add Python to PATH</b> 를 체크합니다. 설치하면 <b>IDLE</b> 이 함께 설치됩니다.',
            '<b>대화형 모드</b>(IDLE 셸, 이 강좌의 &gt;&gt;&gt; 셸)는 한 줄씩 입력해 바로 결과를 보고, <b>스크립트 모드</b>(편집기 + ▶ 실행)는 여러 줄을 작성해 한꺼번에 실행합니다.',
            '<code>print()</code> 는 괄호 안의 내용을 화면에 출력합니다. 글자는 따옴표로 감싸고, 계산식은 따옴표 없이 씁니다.',
            '<b>[심화]</b> 파이썬은 소스를 <b>바이트코드</b>로 컴파일한 뒤 <b>PVM</b> 이 실행합니다. 그래서 문법 오류는 실행 전에, 다른 오류는 그 줄에 도착했을 때 발생합니다.',
            '<b>[심화]</b> 표준 라이브러리는 설치하면 딸려 오고, 외부 라이브러리는 <b>PyPI</b> 에서 <b>pip</b> 으로 설치합니다. 프로젝트마다 <b>가상환경</b>을 따로 두는 것이 원칙입니다.',
            '<b>[심화]</b> 셸에서 <code>type()</code> · <code>dir()</code> · <code>help()</code> 로 확인하고, 트레이스백은 <b>아래에서 위로</b> 읽습니다. 설명은 주석과 <b>docstring</b> 으로, 코드 모양은 <b>PEP 8</b> 을 따릅니다.'
          ] }
        ],
        practice: [
          {
            title: '실습 1-17. 대화형 모드 예제를 스크립트로',
            level: 1,
            desc: '<p>대화형 모드에서 입력했던 다음 식들의 결과를 <b>스크립트 모드</b>에서 출력하세요. 각 줄은 <code>식 = 결과</code> 형태로 출력합니다.</p><pre>10 + 20 = 30\n9876 * 27 - 32767 = 233885\n2 ** 10 = 1024\n7 // 2 = 3\n7 % 2 = 1</pre>',
            hint: '<code>print("10 + 20 =", 10 + 20)</code> 처럼 식은 따옴표 안(글자)과 밖(계산)에 두 번 씁니다.',
            starter: 'print("10 + 20 =", 10 + 20)\n# TODO: 나머지 네 줄을 같은 방법으로 출력\n',
            solution: 'print("10 + 20 =", 10 + 20)\nprint("9876 * 27 - 32767 =", 9876 * 27 - 32767)\nprint("2 ** 10 =", 2 ** 10)\nprint("7 // 2 =", 7 // 2)\nprint("7 % 2 =", 7 % 2)\n',
            expect: '10 + 20 = 30\n9876 * 27 - 32767 = 233885\n2 ** 10 = 1024\n7 // 2 = 3\n7 % 2 = 1'
          },
          {
            title: '실습 1-18. 주석과 docstring 달기',
            level: 1,
            desc: '<p>아래 뼈대 코드에 다음을 추가하세요.</p><ol><li>파일 맨 위에 <b>주석</b>으로 프로그램 설명과 작성자를 적습니다.</li><li><code>circle_area</code> 함수 안에 <b>docstring</b>(<code>"""…"""</code>)으로 "원의 넓이를 구한다."를 적습니다.</li><li>마지막에 <code>circle_area.__doc__</code> 를 출력합니다.</li></ol><p>실행 결과:</p><pre>반지름 5 인 원의 넓이: 78.54\n설명문: 원의 넓이를 구한다.</pre>',
            hint: 'docstring 은 <code>def</code> 줄 <b>바로 다음 줄</b>에 와야 인정됩니다. 주석(<code>#</code>)을 거기에 쓰면 <code>__doc__</code> 는 <code>None</code> 이 됩니다.',
            starter: '# TODO: 프로그램 설명과 작성자를 주석으로 적기\n\ndef circle_area(radius):\n    # TODO: 이 줄을 docstring 으로 바꾸기\n    return 3.14159 * radius * radius\n\n\nprint("반지름 5 인 원의 넓이:", round(circle_area(5), 2))\n# TODO: circle_area 의 설명문 출력\n',
            solution: '# 원의 넓이를 계산하는 프로그램\n# 작성자: 홍길동\n\ndef circle_area(radius):\n    """원의 넓이를 구한다."""\n    return 3.14159 * radius * radius\n\n\nprint("반지름 5 인 원의 넓이:", round(circle_area(5), 2))\nprint("설명문:", circle_area.__doc__)\n',
            expect: '반지름 5 인 원의 넓이: 78.54\n설명문: 원의 넓이를 구한다.'
          },
          {
            title: '실습 1-19. 오류 고치기',
            level: 2,
            desc: '<p>뼈대 코드에는 오류가 세 군데 있습니다. 실행해서 오류 메시지를 읽고 하나씩 고쳐 아래와 같이 출력되게 하세요. (한 번에 하나의 오류만 보이므로 고치고 → 실행을 반복합니다)</p><pre>파이썬 공부 1일차\n오늘 공부한 시간: 90 분\n오늘의 한마디: 오류는 친구다!</pre>',
            hint: '① 대소문자(<code>Print</code>) ② 계산식 앞뒤의 쉼표 ③ 이름의 철자(<code>pritn</code>) 를 확인하세요.',
            starter: 'Print("파이썬 공부 1일차")\nprint("오늘 공부한 시간:", 60 + 30, "분")\npritn("오늘의 한마디: 오류는 친구다!")\n',
            solution: 'print("파이썬 공부 1일차")\nprint("오늘 공부한 시간:", 60 + 30, "분")\nprint("오늘의 한마디: 오류는 친구다!")\n',
            expect: '파이썬 공부 1일차\n오늘 공부한 시간: 90 분\n오늘의 한마디: 오류는 친구다!'
          },
          {
            title: '실습 1-20. 값의 정체 밝히기 (type · repr · len)',
            level: 2,
            desc: "<p>겉보기는 비슷하지만 <b>종류가 다른</b> 네 개의 값을 조사하는 프로그램을 만드세요. 각 값마다 <code>repr()</code>, <code>type()</code>, <code>len()</code> 중 알맞은 것을 사용해 아래처럼 출력합니다.</p><pre>a = '10'  종류: &lt;class 'str'&gt;  길이: 2\nb = 10  종류: &lt;class 'int'&gt;\nc = 10.0  종류: &lt;class 'float'&gt;\nd = ' 10 '  종류: &lt;class 'str'&gt;  길이: 4\na 와 d 는 같은가? False</pre><p>숫자에는 <code>len()</code> 을 쓸 수 없으니 문자열에만 사용하세요.</p>",
            hint: '<code>print("a =", repr(a), " 종류:", type(a), " 길이:", len(a))</code> 형태로 씁니다. <code>repr()</code> 을 써야 따옴표와 눈에 안 보이는 공백이 드러납니다.',
            starter: 'a = "10"\nb = 10\nc = 10.0\nd = " 10 "\n\nprint("a =", repr(a), " 종류:", type(a), " 길이:", len(a))\n# TODO: b, c, d 도 같은 방식으로 조사해 출력\n\n# TODO: a 와 d 가 같은 값인지 출력\n',
            solution: 'a = "10"\nb = 10\nc = 10.0\nd = " 10 "\n\nprint("a =", repr(a), " 종류:", type(a), " 길이:", len(a))\nprint("b =", repr(b), " 종류:", type(b))\nprint("c =", repr(c), " 종류:", type(c))\nprint("d =", repr(d), " 종류:", type(d), " 길이:", len(d))\nprint("a 와 d 는 같은가?", a == d)\n',
            expect: "a = '10'  종류: <class 'str'>  길이: 2\nb = 10  종류: <class 'int'>\nc = 10.0  종류: <class 'float'>\nd = ' 10 '  종류: <class 'str'>  길이: 4\na 와 d 는 같은가? False"
          },
          {
            title: '실습 1-21. 도전! 글자로 그림 그리기',
            level: 3,
            desc: '<p><code>print()</code> 만 사용하여 아래와 같은 파이썬 뱀 그림과 문구를 출력하세요. 마지막 줄의 숫자는 <code>1991</code> 과 <code>2026 - 1991</code> 을 계산식으로 넣습니다.</p><pre>   ____\n  / . .\\\n  \\  ---&lt;\n   \\  /\n __/ /\n&lt;___/\nPython 1991 ~ (35 살)</pre>',
            hint: '역슬래시 <code>\\</code> 를 문자열에 넣을 때는 <code>\\\\</code> 처럼 두 번 씁니다. 마지막 줄은 <code>print("Python", 1991, "~ (" ...</code> 보다 <code>sep</code> 를 활용하면 편합니다.',
            starter: 'print("   ____")\n# TODO: 나머지 그림을 한 줄씩 출력 (역슬래시는 \\\\ 로 입력)\n\n# TODO: Python 1991 ~ (35 살) 출력\n',
            solution: 'print("   ____")\nprint("  / . .\\\\")\nprint("  \\\\  ---<")\nprint("   \\\\  /")\nprint(" __/ /")\nprint("<___/")\nprint("Python ", 1991, " ~ (", 2026 - 1991, " 살)", sep="")\n',
            expect: '   ____\n  / . .\\\n  \\  ---<\n   \\  /\n __/ /\n<___/\nPython 1991 ~ (35 살)'
          },
          {
            title: '🚀 프로젝트 1. 나만의 파이썬 환경 점검 카드',
            level: 3,
            desc: '<p>1장에서 배운 것을 모두 모아, <b>지금 내가 쓰는 파이썬을 한 장으로 점검해 주는 프로그램</b>을 만듭니다. 새로 설치한 PC 에서 이 파일 하나만 실행하면 "제대로 준비됐는지"를 알 수 있는 도구입니다.</p>' +
              '<p><b>요구 사항</b></p><ol>' +
              '<li><b>파일 맨 위에 docstring</b> 으로 프로그램 설명을 적습니다.</li>' +
              '<li>내 정보(<code>NAME</code>, <code>GOAL</code>)와 학습 계획 값(<code>MINUTES_PER_DAY</code>, <code>DAYS_PER_WEEK</code>, <code>WEEKS</code>)을 <b>맨 위에 상수로</b> 모읍니다. (PEP 8: 상수는 대문자)</li>' +
              '<li>테두리와 구분선은 <code>"=" * 46</code>, <code>"-" * 46</code> 처럼 <b>문자열 반복</b>으로 만듭니다.</li>' +
              '<li><b>[파이썬]</b> 칸 — <code>platform.python_implementation()</code>, <code>platform.python_version()</code>, <code>sys.platform</code>, 그리고 <code>sys.version_info &gt;= (3, 10)</code> 으로 버전 조건을 만족하는지 출력합니다.</li>' +
              '<li><b>[속도 점검]</b> 칸 — <code>time.perf_counter()</code> 로 <code>sum(range(1000000))</code> 에 걸린 시간을 재어 소수 넷째 자리까지 출력합니다.</li>' +
              '<li><b>[학습 계획]</b> 칸 — 총 공부 시간을 <b>분</b>과 <b>시간</b>으로 계산해 출력합니다. (숫자를 직접 적지 말고 계산식으로)</li>' +
              '<li>마지막 줄에 마무리 한마디를 출력합니다.</li></ol>' +
              '<p><b>예시 실행 장면</b> (버전 · 플랫폼 · 시간은 실행 환경에 따라 다릅니다)</p>' +
              '<pre>==============================================\n        나의 파이썬 환경 점검 카드\n==============================================\n이름   : 홍길동\n목표   : 파이썬으로 나만의 프로그램 만들기\n----------------------------------------------\n[파이썬]\n  구현체     : CPython\n  버전       : 3.14.2\n  플랫폼     : emscripten\n  3.10 이상? : True\n----------------------------------------------\n[속도 점검]\n  1~100만 합계 : 499999500000\n  걸린 시간(초) : 0.0113\n----------------------------------------------\n[학습 계획]\n  하루 30 분 × 5 일 × 12 주\n  총 공부 시간 : 1800 분\n  시간으로     : 30.0 시간\n==============================================\n점검 완료! 이제 2장으로 출발합니다.</pre>' +
              '<p><b>더 해보기</b> — 여기까지 했다면 이렇게 확장해 보세요.</p><ul>' +
              '<li><b>판정 문구 추가</b>: 버전이 3.10 미만이면 "업그레이드를 권합니다" 를 함께 출력하기 (<code>if</code> 문은 5장에서 배웁니다)</li>' +
              '<li><b>라이브러리 점검</b>: <code>importlib.util.find_spec("requests")</code> 로 필요한 패키지가 깔려 있는지 칸을 하나 더 만들기</li>' +
              '<li><b>내 정보 입력받기</b>: <code>input()</code> 으로 이름과 목표를 직접 받기 (2장에서 배웁니다)</li>' +
              '<li><b>파일로 저장</b>: 카드 내용을 <code>report.txt</code> 로 저장해 두기 (파일 입출력 장에서 배웁니다)</li>' +
              '<li><b>속도 등급</b>: 걸린 시간에 따라 "빠름 / 보통 / 느림" 을 표시하기</li></ul>',
            hint: '한 번에 다 만들려 하지 말고 <b>칸 하나씩</b> 완성하며 실행해 보세요. 테두리 → 내 정보 → 파이썬 정보 → 속도 → 계획 순서가 편합니다. <code>round(값, 4)</code> 로 소수 자리를 줄이고, 계산식은 <code>MINUTES_PER_DAY * DAYS_PER_WEEK * WEEKS</code> 처럼 상수 이름으로 씁니다.',
            starter: '"""나만의 파이썬 환경 점검 카드."""\n\nimport sys\nimport time\nimport platform\n\n# ----- 1. 내 정보 (자기 것으로 바꾸세요) -----\nNAME = "홍길동"\nGOAL = "파이썬으로 나만의 프로그램 만들기"\nMINUTES_PER_DAY = 30\nDAYS_PER_WEEK = 5\nWEEKS = 12\n\nLINE = "=" * 46\nTHIN = "-" * 46\n\n# ----- 2. 속도 점검 (시간 재기) -----\nstart = time.perf_counter()\ntotal = sum(range(1000000))\nelapsed = time.perf_counter() - start\n\n# ----- 3. 카드 출력 -----\nprint(LINE)\nprint("        나의 파이썬 환경 점검 카드")\nprint(LINE)\nprint("이름   :", NAME)\n# TODO: 목표 출력, 구분선 출력\n\n# TODO: [파이썬] 칸 - 구현체 · 버전 · 플랫폼 · 3.10 이상 여부\n\n# TODO: [속도 점검] 칸 - 합계와 걸린 시간\n\n# TODO: [학습 계획] 칸 - 총 분 · 총 시간 (계산식으로)\n\n# TODO: 아래 테두리와 마무리 한마디\n',
            solution: '"""나만의 파이썬 환경 점검 카드.\n\n지금 실행 중인 파이썬의 종류 · 버전 · 속도를 확인하고,\n학습 계획을 한 장으로 정리해 보여 준다.\n"""\n\nimport sys\nimport time\nimport platform\n\n# ----- 1. 내 정보 (자기 것으로 바꾸세요) -----\nNAME = "홍길동"\nGOAL = "파이썬으로 나만의 프로그램 만들기"\nMINUTES_PER_DAY = 30\nDAYS_PER_WEEK = 5\nWEEKS = 12\n\nLINE = "=" * 46\nTHIN = "-" * 46\n\n# ----- 2. 속도 점검 (시간 재기) -----\nstart = time.perf_counter()\ntotal = sum(range(1000000))\nelapsed = time.perf_counter() - start\n\n# ----- 3. 카드 출력 -----\nprint(LINE)\nprint("        나의 파이썬 환경 점검 카드")\nprint(LINE)\nprint("이름   :", NAME)\nprint("목표   :", GOAL)\nprint(THIN)\n\nprint("[파이썬]")\nprint("  구현체     :", platform.python_implementation())\nprint("  버전       :", platform.python_version())\nprint("  플랫폼     :", sys.platform)\nprint("  3.10 이상? :", sys.version_info >= (3, 10))\nprint(THIN)\n\nprint("[속도 점검]")\nprint("  1~100만 합계 :", total)\nprint("  걸린 시간(초) :", round(elapsed, 4))\nprint(THIN)\n\nprint("[학습 계획]")\nprint("  하루", MINUTES_PER_DAY, "분 ×", DAYS_PER_WEEK, "일 ×", WEEKS, "주")\nprint("  총 공부 시간 :", MINUTES_PER_DAY * DAYS_PER_WEEK * WEEKS, "분")\nprint("  시간으로     :", MINUTES_PER_DAY * DAYS_PER_WEEK * WEEKS / 60, "시간")\nprint(LINE)\nprint("점검 완료! 이제 2장으로 출발합니다.")\n',
            nondeterministic: true
          }
        ],
        quiz: [
          { q: '대화형 모드(&gt;&gt;&gt;)에서 <code>9876 * 27 - 32767</code> 을 입력하고 Enter 를 누르면?', options: ['233885 가 출력된다', '9876 * 27 - 32767 이 그대로 출력된다', 'print() 가 없어서 아무것도 출력되지 않는다', 'SyntaxError 가 발생한다'], answer: 0,
            explain: '대화형 모드에서는 식의 결과가 자동으로 표시됩니다. 9876×27 = 266652, 266652 − 32767 = 233885.' },
          { q: '스크립트 모드에서 다음 코드를 실행한 결과는?<pre><code>10 + 20\nprint(3 * 4)</code></pre>', options: ['30 과 12', '12', '30', '아무것도 출력되지 않는다'], answer: 1,
            explain: '스크립트 모드에서는 <code>print()</code> 로 출력한 것만 화면에 나타납니다. 1행은 계산만 하고 버려집니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code># print("A")\nprint("B")  # print("C")</code></pre>', options: ['A B C', 'B C', 'B', 'A'], answer: 2,
            explain: '<code>#</code> 뒤는 주석이므로 실행되지 않습니다. <code>print("B")</code> 만 실행됩니다.' },
          { q: '<code>Print("Hi")</code> 를 실행했을 때 발생하는 오류는?', options: ['SyntaxError', 'NameError', 'IndentationError', 'ZeroDivisionError'], answer: 1,
            explain: '파이썬은 대소문자를 구별하므로 <code>Print</code> 라는 이름을 찾지 못해 <b>NameError</b> 가 발생합니다.' },
          { q: '트레이스백(Traceback)을 읽는 요령으로 가장 알맞은 것은?', options: ['첫 줄부터 차례대로 읽는다', '<b>맨 마지막 줄</b>의 오류 이름과 이유부터 읽고, 위로 올라가며 호출 경로를 본다', '줄 수가 많으면 읽지 말고 코드를 고쳐 본다', '<code>File</code> 로 시작하는 줄만 읽으면 된다'], answer: 1,
            explain: '마지막 줄에 <b>무엇이 잘못됐는지</b>가 있고, 그 바로 위가 오류가 터진 위치입니다. 더 위쪽은 거기까지 부른 경로이므로, <b>오류가 난 줄과 원인이 있는 줄은 다를 수 있습니다</b>.' },
          { q: '다음 코드에서 <code>print(f.__doc__)</code> 의 결과는?<pre><code>def f():\n    # 두 배로 만든다\n    return 2\n\nprint(f.__doc__)</code></pre>', options: ['두 배로 만든다', '# 두 배로 만든다', 'None', '오류가 발생한다'], answer: 2,
            explain: 'docstring 으로 인정되는 것은 <code>def</code> 줄 바로 다음의 <b>문자열</b>(<code>"""…"""</code>)뿐입니다. <code>#</code> 주석은 실행 시점에 사라지므로 <code>__doc__</code> 는 <code>None</code> 입니다.' }
        ],
        slides: [
          { layout: 'title', title: '대화형 모드와 스크립트 모드', subtitle: 'Chapter 01 · 첫 파이썬 프로그램', badge: '4교시',
            notes: '<p>이번 시간은 직접 손으로 코드를 입력하는 시간입니다. 모든 학생이 콘솔의 &gt;&gt;&gt; 셸 버튼을 찾았는지 먼저 확인합니다.</p><p>시간: 1분</p>' },
          { layout: 'bullets', title: '대화형 모드란?',
            bullets: ['<code>&gt;&gt;&gt;</code> 뒤에 <b>한 줄</b> 입력 → Enter → <b>바로 실행</b>', '컴퓨터와 한 마디씩 대화하는 방식', 'IDLE 셸 = 대화형 모드', '이 강좌: 콘솔의 <b>&gt;&gt;&gt; 셸</b> 버튼'],
            notes: '<p>교사 화면에서 &gt;&gt;&gt; 셸을 열고 학생들과 동시에 입력합니다.</p><p><b>발문</b>: "&gt;&gt;&gt; 는 무슨 뜻일까요?" → "명령을 입력하세요" 라는 프롬프트.</p><p>시간: 3분</p>' },
          { layout: 'code', title: '예1. Hello, world!', repl: true, code: 'print("Hello, world!")',
            points: ['<code>&gt;&gt;&gt;</code> 다음에 입력 → Enter', '바로 아래에 결과 출력', '다시 <code>&gt;&gt;&gt;</code> 가 나타남', '그림 1-12'],
            notes: '<p>강의자료 27쪽. 학생들이 직접 입력하게 합니다. 따옴표 · 괄호 짝을 맞추는지 돌아다니며 확인합니다.</p><p>시간: 3분</p>' },
          { layout: 'code', title: '예2 · 예3. 계산식', repl: true, code: '10 + 20\n9876 * 27 - 32767',
            points: ['식의 결과가 <b>자동 표시</b>', '곱하기는 <code>*</code>', '곱셈 먼저, 뺄셈 나중', '그림 1-13, 1-14'],
            notes: '<p>강의자료 28~29쪽. 계산기와 속도 경쟁을 시켜 보면 재미있습니다.</p><p>대화형 모드에서는 print 없이도 결과가 나온다는 점을 꼭 짚습니다(스크립트 모드와의 차이).</p><p>시간: 4분</p>' },
          { layout: 'table', title: '📘 산술 연산자 맛보기', head: ['연산자', '의미', '예 → 결과'], rows: [
            ['<code>+ - *</code>', '더하기 · 빼기 · 곱하기', '<code>7 * 2</code> → 14'], ['<code>/</code>', '나누기', '<code>7 / 2</code> → 3.5'], ['<code>//</code>', '몫', '<code>7 // 2</code> → 3'], ['<code>%</code>', '나머지', '<code>7 % 2</code> → 1'], ['<code>**</code>', '거듭제곱', '<code>2 ** 10</code> → 1024']],
            notes: '<p>보충 내용입니다. 2장 이후에 자세히 다루므로 "이런 것이 있다" 정도로 셸에서 직접 입력해 보게 합니다.</p><p><code>2 ** 100</code> 을 입력하면 아주 큰 수도 정확히 계산된다는 것을 보여 주면 반응이 좋습니다.</p><p>시간: 5분</p>' },
          { layout: 'code', title: '📘 셸은 계산기가 아니라 탐험 도구', repl: true, code: 'type(10)\ntype("10")\nlen("파이썬")\n"python".upper()\n10 + 20\n_ * 2',
            points: ['<code>type()</code>: 이 값은 무슨 종류인가', '<code>dir()</code>: 무엇을 할 수 있나', '<code>help()</code>: 사용법 설명', '<code>_</code>: 바로 앞 결과 · <kbd>↑</kbd>: 앞 줄 다시'],
            notes: '<p>보충 내용이지만 <b>이 장에서 가장 오래 쓰일 도구</b>입니다. 앞으로 "이거 어떻게 쓰죠?" 라는 질문이 나올 때마다 "셸에서 <code>type</code>/<code>dir</code>/<code>help</code> 로 확인해 보세요" 라고 되돌려 주면 좋습니다.</p><p><b>꼭 강조</b>: <code>10</code> 과 <code>"10"</code> 은 <b>보이는 모양이 같아도 종류가 다릅니다</b>. 앞으로 만날 오류의 상당수가 여기서 옵니다.</p><p><b>발문</b>: "<code>len(10)</code> 을 하면 어떻게 될까요?" → 직접 쳐 보게 합니다. <code>TypeError</code> 가 나옵니다.</p><p>시간: 5분</p>' },
          { layout: 'diagram', title: '대화형 모드 vs 스크립트 모드', html: FIG_MODES, caption: '한 줄씩 바로바로 vs 여러 줄을 작성해 한꺼번에',
            notes: '<p>대화형 모드의 한계(저장 안 됨, 여러 줄 수정 어려움) → 스크립트 모드가 필요한 이유를 설명합니다.</p><p>IDLE 에서는 [File]-[New File] → 저장 → F5, 이 강좌에서는 편집기 + ▶ 실행(Ctrl+Enter).</p><p>시간: 4분</p>' },
          { layout: 'code', title: '스크립트 모드로 실행하기', code: `print("Hello, world!")
print(10 + 20)
print(9876 * 27 - 32767)
10 + 20`,
            points: ['세 줄이 위에서 아래로 한꺼번에 실행', '계산 결과도 <code>print()</code> 로 출력', '4행: print 없으면 <b>아무것도 안 보임</b>', '편집기 + ▶ 실행 (Ctrl+Enter)'],
            notes: '<p>실행 결과가 3줄뿐인 것을 확인시키고, 4행이 왜 출력되지 않는지 질문합니다.</p><p>시간: 4분</p>' },
          { layout: 'code', title: '📘 주석(#)', code: `# 나의 첫 파이썬 프로그램
# 작성자: 홍길동

print("주석은 실행되지 않습니다.")   # 줄 끝 주석
# print("이 줄은 실행되지 않습니다.")
print("프로그램 끝")`,
            points: ['<code>#</code> 뒤는 실행하지 않음', '코드 설명 메모', '잠시 실행을 막을 때', '단축키: 편집기에서 줄 주석 토글'],
            notes: '<p>보충 내용입니다. 5행의 <code>#</code> 을 지우고 실행해 보게 합니다.</p><p>좋은 주석은 <b>"무엇을"이 아니라 "왜"</b> 를 적는다는 원칙을 한 줄 덧붙이세요. 코드를 옮겨 적은 주석은 코드를 고칠 때 같이 고치지 않아 <b>거짓말</b>이 되기 쉽습니다.</p><p>시간: 3분</p>' },
          { layout: 'two', title: '📘 설명은 docstring, 모양은 PEP 8',
            left: { title: '주석 vs docstring', bullets: ['<code>#</code> → 실행 후 <b>사라짐</b>, 고칠 사람을 위해', '<code>"""…"""</code> → 값으로 <b>남음</b>(<code>__doc__</code>), 쓸 사람을 위해', 'docstring 은 <code>def</code> 바로 <b>다음 줄</b>', '<code>help(len)</code> 이 보여 준 글의 정체'] },
            right: { title: 'PEP 8 핵심 5가지', bullets: ['들여쓰기는 <b>공백 4칸</b>', '이름은 <code>snake_case</code>, 상수는 <code>UPPER</code>', '<code>x = a + b</code> (연산자 양쪽 한 칸)', '한 줄 79자 · 한 줄에 한 문장', 'import 는 맨 위, 한 줄에 하나'] },
            notes: '<p>보충 내용입니다. "문법만 맞으면 되는 것 아닌가요?" 라는 질문에 <b>"코드는 쓰는 시간보다 읽는 시간이 길다"</b> 로 답합니다.</p><p>본문의 "같은 일을 하는 두 코드" 예제를 띄워 놓고 <b>어느 쪽을 한 달 뒤에 읽고 싶은지</b> 물어보세요.</p><p>규칙을 외우게 하지 말고, 나중에 <code>black</code> · <code>ruff</code> 같은 도구가 자동으로 맞춰 준다는 점을 알려 주면 부담이 줄어듭니다.</p><p>시간: 5분</p>' },
          { layout: 'table', title: '📘 처음 만나는 오류', head: ['오류', '원인 예', '고치기'], rows: [
            ['SyntaxError', '<code>print("Hi"</code> · <code>print "Hi"</code>', '괄호 · 따옴표 짝'], ['NameError', '<code>Print("Hi")</code>', '소문자 print'], ['IndentationError', '줄 앞 공백', '공백 삭제'], ['ZeroDivisionError', '<code>10 / 0</code>', '0 으로 나누지 않기']],
            notes: '<p>오류 메시지는 <b>마지막 줄(종류와 이유)</b>과 <b>line 번호</b>를 먼저 읽는다고 알려 줍니다.</p><p>둥근 따옴표(“ ”)를 복사해 붙여 넣으면 오류가 난다는 점도 경고합니다.</p><p>시간: 5분</p>' },
          { layout: 'code', title: '📘 트레이스백은 아래에서 위로', code: `def average(numbers):
    return sum(numbers) / len(numbers)


def report(title, numbers):
    print(title, "평균:", average(numbers))


report("1반", [80, 90, 100])
report("2반", [])`, expectError: true,
            points: ['① 마지막 줄 = 오류 이름과 이유', '② 그 위 = 오류가 <b>터진</b> 줄', '③ 더 위 = 거기까지 <b>부른</b> 경로', '터진 줄과 <b>원인인 줄은 다르다</b>'],
            notes: '<p>보충 내용이지만 앞으로 매 시간 쓰게 되는 기술입니다. 실행 후 화면을 <b>아래에서 위로</b> 손으로 짚으며 함께 읽습니다.</p><p><b>발문</b>: "고쳐야 할 곳은 몇 행일까요?" → 오류는 <code>average</code> 안에서 났지만, 진짜 원인은 <b>빈 목록 <code>[]</code> 을 넘긴 마지막 줄</b>입니다.</p><p>디버깅 4단계(재현 → 줄이기 → <code>print</code>/<code>type</code>/<code>repr</code> 로 확인 → 한 군데씩 고치기)를 칠판에 적어 두고 이후 수업에서 계속 가리킵니다.</p><p>시간: 6분</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '스크립트 모드에서 실행한 결과는?<pre><code>10 + 20\nprint(3 * 4)</code></pre>', options: ['30 과 12', '12', '30', '아무것도 출력되지 않는다'], answer: 1,
            explain: '스크립트 모드에서는 print() 로 출력한 것만 보입니다.',
            notes: '<p>대화형 모드와 헷갈리는 학생이 많은 문제입니다. 오답이 많으면 직접 실행해서 확인합니다.</p><p>시간: 2분</p>' },
          { layout: 'practice', title: '실습 1-19. 오류 고치기', desc: '오류 세 군데(<code>Print</code>, <code>pritn</code> 등)를 오류 메시지를 읽으며 하나씩 고치세요.',
            starter: 'Print("파이썬 공부 1일차")\nprint("오늘 공부한 시간:", 60 + 30, "분")\npritn("오늘의 한마디: 오류는 친구다!")\n',
            solution: 'print("파이썬 공부 1일차")\nprint("오늘 공부한 시간:", 60 + 30, "분")\nprint("오늘의 한마디: 오류는 친구다!")\n',
            notes: '<p>"고치고 → 실행 → 다음 오류 메시지 읽기" 과정을 경험하게 하는 것이 목적입니다. 정답을 바로 알려 주지 말고 메시지의 마지막 줄을 읽게 합니다.</p><p>시간: 4분</p>' },
          { layout: 'practice', title: '🚀 프로젝트 1. 나만의 파이썬 환경 점검 카드', desc: '1장에서 배운 것을 모아 <b>지금 내 파이썬을 한 장으로 점검</b>하는 프로그램을 만듭니다. ① 테두리는 <code>"=" * 46</code> 으로 ② <code>platform</code> · <code>sys</code> 로 구현체 · 버전 · 플랫폼 ③ <code>time.perf_counter()</code> 로 속도 ④ 학습 계획을 계산식으로 출력합니다.',
            starter: '"""나만의 파이썬 환경 점검 카드."""\n\nimport sys\nimport time\nimport platform\n\nNAME = "홍길동"\nMINUTES_PER_DAY = 30\nDAYS_PER_WEEK = 5\nWEEKS = 12\nLINE = "=" * 46\n\nstart = time.perf_counter()\ntotal = sum(range(1000000))\nelapsed = time.perf_counter() - start\n\nprint(LINE)\nprint("        나의 파이썬 환경 점검 카드")\nprint(LINE)\nprint("이름   :", NAME)\n# TODO: 파이썬 정보 · 속도 · 학습 계획 칸을 채우세요\n',
            solution: '"""나만의 파이썬 환경 점검 카드."""\n\nimport sys\nimport time\nimport platform\n\nNAME = "홍길동"\nMINUTES_PER_DAY = 30\nDAYS_PER_WEEK = 5\nWEEKS = 12\nLINE = "=" * 46\nTHIN = "-" * 46\n\nstart = time.perf_counter()\ntotal = sum(range(1000000))\nelapsed = time.perf_counter() - start\n\nprint(LINE)\nprint("        나의 파이썬 환경 점검 카드")\nprint(LINE)\nprint("이름   :", NAME)\nprint(THIN)\nprint("  구현체     :", platform.python_implementation())\nprint("  버전       :", platform.python_version())\nprint("  플랫폼     :", sys.platform)\nprint("  3.10 이상? :", sys.version_info >= (3, 10))\nprint(THIN)\nprint("  1~100만 합계 :", total)\nprint("  걸린 시간(초) :", round(elapsed, 4))\nprint(THIN)\nprint("  총 공부 시간 :", MINUTES_PER_DAY * DAYS_PER_WEEK * WEEKS, "분")\nprint(LINE)\n',
            notes: '<p>1장의 <b>마무리 프로젝트</b>입니다. 수업 시간에 다 못 끝내도 되고, 과제로 내주기 좋습니다.</p><p><b>지도 요령</b>: 한 번에 다 만들라고 하면 막힙니다. "테두리 → 이름 → 파이썬 정보 → 속도 → 계획" 순서로 <b>칸 하나 만들 때마다 실행</b>하게 하세요.</p><p>친구들끼리 결과 화면을 비교하면 플랫폼(<code>emscripten</code> vs <code>win32</code>)과 걸린 시간이 다르게 나와서 이야깃거리가 됩니다.</p><p>더 해보기(본문 참고): 버전 판정 문구, 라이브러리 설치 점검, <code>input()</code> 으로 이름 받기, 파일로 저장하기.</p><p>시간: 10분 (또는 과제)</p>' },
          { layout: 'summary', title: '1장 정리', bullets: ['프로그래밍 언어 · 프로그래머 · 파이썬(1991, 귀도 반 로섬)', '파이썬: 쉽고 무료, 라이브러리 풍부 / 느린 속도', '📘 소스 → 바이트코드 → PVM · pip · PyPI · 가상환경', '대화형 모드: &gt;&gt;&gt; 한 줄씩 + <code>type</code> · <code>dir</code> · <code>help</code> 로 탐험', '스크립트 모드: 편집기 + ▶ 실행, print() 로 출력', '📘 트레이스백은 아래에서 위로 · 설명은 docstring · 모양은 PEP 8'],
            notes: '<p>1장 전체를 정리합니다. 다음 장 예고: 변수와 입력(input) — 사용자와 대화하는 프로그램 만들기.</p><p>과제: 실습 1-21(글자 그림)과 🚀 프로젝트 1(환경 점검 카드) 도전.</p><p>시간: 3분</p>' }
        ]
      }
    ]
  });
})();
