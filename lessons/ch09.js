/* Chapter 09. 함수와 모듈 (파이썬 for Beginner 3판 Ch09) */
(function () {
  /* ---------- 공통 SVG 도우미 ---------- */
  const MK = (id, color) => `<marker viewBox="0 0 12 12" id="${id}" markerWidth="4.5" markerHeight="4.5" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="${color}"/></marker>`;
  const BOX = (x, y, w, h, t, c, fs, fill) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${fill || 'var(--card)'}" stroke="${c || 'var(--line)'}" stroke-width="3"/>` +
    `<text x="${x + w / 2}" y="${y + h / 2 + (fs || 22) * 0.36}" text-anchor="middle" style="font-size:${fs || 22}px;fill:var(--fg)">${t}</text>`;
  const MONO = "font-family:Consolas,'D2Coding',monospace";

  /* 그림 9-1 · 9-2 : 직접 커피 타기 vs 커피 자판기 */
  const SVG_COFFEE = `<svg viewBox="0 0 1280 540" width="100%" role="img" aria-label="직접 커피를 타는 과정과 커피 자판기">
  <defs>${MK('m9c1', 'var(--muted)')}${MK('m9c2', 'var(--accent)')}</defs>
  <text x="30" y="40" style="font-size:24px;font-weight:700;fill:var(--fg)">① 직접 커피를 타는 과정 — 손님이 올 때마다 모든 단계를 사람이 직접</text>
  ${['주문 받기', '물 준비', '종이컵 준비', '커피 타기(3종)', '물 붓기', '스푼으로 젓기', '손님께 전달'].map((t, i) => BOX(30 + i * 180, 70, 150, 70, t, i === 3 ? 'var(--warn)' : 'var(--line)', 20)).join('')}
  ${[0, 1, 2, 3, 4, 5].map((i) => `<line x1="${182 + i * 180}" y1="105" x2="${206 + i * 180}" y2="105" stroke="var(--muted)" stroke-width="3" marker-end="url(#m9c1)"/>`).join('')}
  <text x="640" y="190" text-anchor="middle" style="font-size:22px;fill:var(--danger)">손님이 3명이면? → 이 7단계를 코드로 3번 복사해서 써야 한다 (길고, 고치기 어렵다)</text>
  <line x1="40" y1="225" x2="1240" y2="225" stroke="var(--line)" stroke-width="2" stroke-dasharray="8 8"/>
  <text x="30" y="270" style="font-size:24px;font-weight:700;fill:var(--fg)">② 커피 자판기(= 함수)를 이용하는 과정</text>
  ${BOX(60, 320, 250, 90, '버튼 누르기 (1·2·3)', 'var(--accent)', 22)}
  <line x1="312" y1="365" x2="410" y2="365" stroke="var(--accent)" stroke-width="4" marker-end="url(#m9c2)"/>
  <rect x="420" y="295" width="460" height="140" rx="16" fill="var(--card)" stroke="var(--accent2)" stroke-width="4"/>
  <text x="650" y="345" text-anchor="middle" style="${MONO};font-size:28px;font-weight:700;fill:var(--accent2)">coffee_machine(button)</text>
  <text x="650" y="390" text-anchor="middle" style="font-size:20px;fill:var(--muted)">물 준비 · 컵 준비 · 커피 · 물 붓기 · 젓기를 자동으로</text>
  <line x1="882" y1="365" x2="980" y2="365" stroke="var(--accent)" stroke-width="4" marker-end="url(#m9c2)"/>
  ${BOX(990, 320, 230, 90, '커피 완성 ☕', 'var(--ok)', 22)}
  <text x="640" y="500" text-anchor="middle" style="font-size:22px;fill:var(--muted)">자판기를 한 번 만들어 두면 손님마다 버튼만 누르면 된다 → 함수 = 한 번 정의하고 여러 번 호출</text>
</svg>`;

  /* 그림 9-3 · 9-5 : 함수의 기본 형식 */
  const SVG_FUNCBOX = `<svg viewBox="0 0 1280 500" width="100%" role="img" aria-label="함수의 기본 형식">
  <defs>${MK('m9f1', 'var(--accent)')}${MK('m9f2', 'var(--ok)')}</defs>
  ${BOX(120, 30, 320, 64, '매개변수 1 &nbsp;(100)', 'var(--accent)', 22)}
  ${BOX(840, 30, 320, 64, '매개변수 2 &nbsp;(200)', 'var(--accent)', 22)}
  <path d="M442,62 H590 V140" stroke="var(--accent)" stroke-width="4" fill="none" marker-end="url(#m9f1)"/>
  <path d="M838,62 H690 V140" stroke="var(--accent)" stroke-width="4" fill="none" marker-end="url(#m9f1)"/>
  <rect x="470" y="150" width="340" height="60" rx="10" fill="var(--accent2)" opacity="0.9"/>
  <text x="640" y="190" text-anchor="middle" style="font-size:26px;font-weight:700;fill:#fff">함수 &nbsp;plus()</text>
  <rect x="440" y="210" width="400" height="120" rx="10" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
  <text x="640" y="258" text-anchor="middle" style="font-size:22px;fill:var(--fg)">입력된 매개변수를 가공 · 처리한다</text>
  <text x="640" y="300" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--muted)">result = v1 + v2</text>
  <line x1="640" y1="332" x2="640" y2="385" stroke="var(--ok)" stroke-width="5" marker-end="url(#m9f2)"/>
  ${BOX(490, 392, 300, 64, '반환값 &nbsp;(300)', 'var(--ok)', 22)}
  <text x="60" y="250" style="font-size:20px;fill:var(--muted)">넣는 값 = 매개변수</text>
  <text x="60" y="280" style="font-size:20px;fill:var(--muted)">(파라미터, parameter)</text>
  <text x="1220" y="430" text-anchor="end" style="font-size:20px;fill:var(--muted)">돌려주는 값 = 반환값 (리턴값)</text>
</svg>`;

  /* 그림 9-4 : plus() 함수의 형식과 호출 순서 */
  const SVG_PLUS = `<svg viewBox="0 0 1280 580" width="100%" role="img" aria-label="plus 함수의 호출 순서">
  <defs>${MK('m9p1', 'var(--accent2)')}${MK('m9p2', 'var(--danger)')}${MK('m9p3', 'var(--ok)')}</defs>
  <rect x="380" y="40" width="620" height="250" rx="14" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="420" y="92" style="${MONO};font-size:30px;fill:var(--fg)">def plus(v1, v2) :</text>
  <ellipse cx="585" cy="82" rx="28" ry="24" fill="none" stroke="var(--danger)" stroke-width="3"/>
  <ellipse cx="651" cy="82" rx="28" ry="24" fill="none" stroke="var(--danger)" stroke-width="3"/>
  <text x="450" y="160" style="${MONO};font-size:28px;fill:var(--fg)">result = 0</text>
  <text x="450" y="205" style="${MONO};font-size:28px;fill:var(--fg)">result = v1 + v2</text>
  <rect x="435" y="222" width="240" height="46" rx="6" fill="none" stroke="var(--accent2)" stroke-width="3"/>
  <text x="450" y="255" style="${MONO};font-size:28px;fill:var(--fg)">return result</text>
  <text x="1015" y="170" style="font-size:22px;font-weight:700;fill:var(--ok)">② 함수 실행</text>
  <rect x="500" y="400" width="470" height="70" rx="10" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
  <text x="520" y="446" style="${MONO};font-size:30px;fill:var(--fg)">hap = plus(100, 200)</text>
  <ellipse cx="727" cy="436" rx="34" ry="26" fill="none" stroke="var(--danger)" stroke-width="3"/>
  <ellipse cx="810" cy="436" rx="34" ry="26" fill="none" stroke="var(--danger)" stroke-width="3"/>
  <path d="M727,408 V128 H585 V110" stroke="var(--danger)" stroke-width="3" fill="none" marker-end="url(#m9p2)"/>
  <path d="M810,408 V116 H651 V110" stroke="var(--danger)" stroke-width="3" fill="none" marker-end="url(#m9p2)"/>
  <path d="M498,435 H330 V70 H374" stroke="var(--accent2)" stroke-width="4" fill="none" marker-end="url(#m9p1)"/>
  <text x="130" y="260" style="font-size:22px;font-weight:700;fill:var(--accent2)">① 함수 호출</text>
  <path d="M677,245 H1070 V435 H978" stroke="var(--accent2)" stroke-width="4" fill="none" marker-end="url(#m9p1)"/>
  <text x="1080" y="345" style="font-size:22px;font-weight:700;fill:var(--accent2)">③ 결과 반환</text>
  <path d="M650,398 V372 H560 V392" stroke="var(--ok)" stroke-width="3" fill="none" marker-end="url(#m9p3)"/>
  <text x="400" y="365" style="font-size:20px;font-weight:700;fill:var(--ok)">④ 반환값 대입</text>
  <text x="652" y="510" text-anchor="middle" style="font-size:20px;fill:var(--muted)">함수명</text>
  <text x="727" y="540" text-anchor="middle" style="font-size:20px;fill:var(--muted)">매개변수 1</text>
  <text x="850" y="510" text-anchor="middle" style="font-size:20px;fill:var(--muted)">매개변수 2</text>
  <text x="1090" y="80" style="font-size:20px;fill:var(--danger)">100 → v1</text>
  <text x="1090" y="110" style="font-size:20px;fill:var(--danger)">200 → v2 에 들어감</text>
</svg>`;

  /* 그림 9-6 : 지역 변수와 전역 변수의 생존 범위 */
  const SVG_SCOPE = `<svg viewBox="0 0 1280 520" width="100%" role="img" aria-label="지역 변수와 전역 변수의 생존 범위">
  <text x="320" y="40" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--fg)">① 지역 변수의 생존 범위</text>
  <rect x="70" y="70" width="500" height="170" rx="12" fill="var(--card)" stroke="var(--fg)" stroke-width="3"/>
  <text x="90" y="105" style="font-size:22px;font-weight:700;fill:var(--fg)">함수 1</text>
  <rect x="90" y="122" width="130" height="50" rx="8" fill="none" stroke="var(--danger)" stroke-width="3"/>
  <text x="155" y="156" text-anchor="middle" style="${MONO};font-size:26px;fill:var(--ok)">a = 10</text>
  <text x="90" y="215" style="font-size:22px;fill:var(--fg)">a가 뭔지 함수 1에서는 <tspan style="fill:var(--ok);font-weight:700">안다 ✔</tspan></text>
  <rect x="70" y="270" width="500" height="120" rx="12" fill="var(--card)" stroke="var(--fg)" stroke-width="3"/>
  <text x="90" y="305" style="font-size:22px;font-weight:700;fill:var(--fg)">함수 2</text>
  <text x="90" y="355" style="font-size:22px;fill:var(--fg)">a가 뭔지 함수 2에서는 <tspan style="fill:var(--danger);font-weight:700">모른다 ✘</tspan></text>
  <text x="320" y="440" text-anchor="middle" style="font-size:20px;fill:var(--muted)">함수 안에서 만든 변수는 그 함수 안에서만 산다</text>
  <line x1="640" y1="30" x2="640" y2="480" stroke="var(--line)" stroke-width="2" stroke-dasharray="8 8"/>
  <text x="960" y="40" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--fg)">② 전역 변수의 생존 범위</text>
  <rect x="710" y="70" width="500" height="110" rx="12" fill="var(--card)" stroke="var(--fg)" stroke-width="3"/>
  <text x="730" y="105" style="font-size:22px;font-weight:700;fill:var(--fg)">함수 1</text>
  <text x="730" y="150" style="font-size:22px;fill:var(--fg)">b가 뭔지 함수 1에서 <tspan style="fill:var(--ok);font-weight:700">안다 ✔</tspan></text>
  <rect x="710" y="210" width="500" height="110" rx="12" fill="var(--card)" stroke="var(--fg)" stroke-width="3"/>
  <text x="730" y="245" style="font-size:22px;font-weight:700;fill:var(--fg)">함수 2</text>
  <text x="730" y="290" style="font-size:22px;fill:var(--fg)">b가 뭔지 함수 2에서 <tspan style="fill:var(--ok);font-weight:700">안다 ✔</tspan></text>
  <rect x="710" y="350" width="140" height="54" rx="8" fill="none" stroke="var(--danger)" stroke-width="3"/>
  <text x="780" y="386" text-anchor="middle" style="${MONO};font-size:26px;fill:var(--ok)">b = 20</text>
  <text x="870" y="386" style="font-size:20px;fill:var(--muted)">← 함수 바깥(메인)에서 만든 변수</text>
  <text x="960" y="440" text-anchor="middle" style="font-size:20px;fill:var(--muted)">함수 밖에서 만든 변수는 프로그램 전체에서 쓸 수 있다</text>
</svg>`;

  /* 그림 9-7 : 지역 변수와 전역 변수의 공존 */
  const SVG_SHADOW = `<svg viewBox="0 0 1280 440" width="100%" role="img" aria-label="지역 변수와 전역 변수가 같은 이름일 때">
  <defs>${MK('m9s1', 'var(--accent2)')}${MK('m9s2', 'var(--ok)')}</defs>
  <rect x="80" y="30" width="160" height="56" rx="8" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="160" y="67" text-anchor="middle" style="${MONO};font-size:26px;fill:var(--fg)">a = 20</text>
  <text x="260" y="66" style="font-size:20px;fill:var(--ok)">전역 변수 a</text>
  <text x="90" y="140" style="font-size:22px;font-weight:700;fill:var(--fg)">함수 1</text>
  <rect x="80" y="155" width="500" height="200" rx="12" fill="var(--card)" stroke="var(--fg)" stroke-width="3"/>
  <rect x="105" y="175" width="150" height="50" rx="8" fill="none" stroke="var(--accent2)" stroke-width="3"/>
  <text x="180" y="209" text-anchor="middle" style="${MONO};font-size:26px;fill:var(--fg)">a = 10</text>
  <text x="110" y="265" style="${MONO};font-size:26px;fill:var(--fg)">print(a)</text>
  <text x="110" y="325" style="font-size:22px;fill:var(--fg)">이때의 a는 <tspan style="fill:var(--accent2);font-weight:700">지역 변수 a (10)</tspan></text>
  <path d="M380,300 V200 H262" stroke="var(--accent2)" stroke-width="3" fill="none" marker-end="url(#m9s1)"/>
  <text x="710" y="140" style="font-size:22px;font-weight:700;fill:var(--fg)">함수 2</text>
  <rect x="700" y="155" width="500" height="200" rx="12" fill="var(--card)" stroke="var(--fg)" stroke-width="3"/>
  <text x="730" y="265" style="${MONO};font-size:26px;fill:var(--fg)">print(a)</text>
  <text x="730" y="325" style="font-size:22px;fill:var(--fg)">이때의 a는 <tspan style="fill:var(--ok);font-weight:700">전역 변수 a (20)</tspan></text>
  <path d="M1000,300 V58 H250" stroke="var(--ok)" stroke-width="3" fill="none" marker-end="url(#m9s2)" stroke-dasharray="10 6"/>
  <text x="640" y="410" text-anchor="middle" style="font-size:20px;fill:var(--muted)">이름이 같으면 함수 안에서는 지역 변수가 우선! 지역 변수가 없을 때만 전역 변수를 찾는다</text>
</svg>`;

  /* 그림 9-8 · 9-9 : 반환값이 있는 함수 / 없는 함수 */
  const SVG_RETURN = `<svg viewBox="0 0 1280 520" width="100%" role="img" aria-label="반환값이 있는 함수와 없는 함수">
  <defs>${MK('m9r1', 'var(--accent2)')}${MK('m9r2', 'var(--ok)')}${MK('m9r3', 'var(--muted)')}</defs>
  <text x="320" y="36" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--fg)">반환값이 있는 함수</text>
  <rect x="150" y="60" width="400" height="190" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="175" y="105" style="${MONO};font-size:26px;fill:var(--fg)">def func1() :</text>
  <text x="205" y="160" style="${MONO};font-size:26px;fill:var(--fg)">result = 100</text>
  <rect x="195" y="180" width="230" height="46" rx="6" fill="none" stroke="var(--accent2)" stroke-width="3"/>
  <text x="205" y="213" style="${MONO};font-size:26px;fill:var(--fg)">return result</text>
  <rect x="200" y="380" width="260" height="56" rx="8" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
  <text x="330" y="417" text-anchor="middle" style="${MONO};font-size:26px;fill:var(--fg)">hap = func1()</text>
  <path d="M198,408 H100 V90 H144" stroke="var(--accent2)" stroke-width="3" fill="none" marker-end="url(#m9r1)"/>
  <text x="20" y="300" style="font-size:20px;fill:var(--accent2)">① 호출</text>
  <path d="M427,203 H600 V408 H466" stroke="var(--accent2)" stroke-width="3" fill="none" marker-end="url(#m9r1)"/>
  <text x="560" y="300" style="font-size:20px;fill:var(--accent2)">③ 100 반환</text>
  <path d="M390,378 V350 H260 V374" stroke="var(--ok)" stroke-width="3" fill="none" marker-end="url(#m9r2)"/>
  <text x="235" y="340" style="font-size:20px;fill:var(--ok)">④ hap에 100 대입</text>
  <text x="330" y="490" text-anchor="middle" style="font-size:20px;fill:var(--muted)">② 함수 실행 → return 에서 값을 들고 돌아온다</text>
  <line x1="660" y1="20" x2="660" y2="500" stroke="var(--line)" stroke-width="2" stroke-dasharray="8 8"/>
  <text x="970" y="36" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--fg)">반환값이 없는 함수</text>
  <rect x="740" y="60" width="480" height="190" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="765" y="105" style="${MONO};font-size:26px;fill:var(--fg)">def func2() :</text>
  <text x="795" y="160" style="${MONO};font-size:22px;fill:var(--fg)">print("반환값 없는 함수 실행")</text>
  <rect x="785" y="185" width="230" height="40" rx="6" fill="none" stroke="var(--muted)" stroke-width="3" stroke-dasharray="6 6"/>
  <text x="900" y="212" text-anchor="middle" style="font-size:18px;fill:var(--muted)">(return 없음)</text>
  <rect x="840" y="380" width="220" height="56" rx="8" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
  <text x="950" y="417" text-anchor="middle" style="${MONO};font-size:26px;fill:var(--fg)">func2()</text>
  <path d="M838,408 H700 V90 H734" stroke="var(--accent2)" stroke-width="3" fill="none" marker-end="url(#m9r1)"/>
  <path d="M1017,205 H1150 V408 H1066" stroke="var(--muted)" stroke-width="3" fill="none" marker-end="url(#m9r3)"/>
  <text x="1160" y="300" style="font-size:20px;fill:var(--muted)">③ 돌려줄</text>
  <text x="1160" y="326" style="font-size:20px;fill:var(--muted)">값 없이 종료</text>
  <text x="970" y="490" text-anchor="middle" style="font-size:20px;fill:var(--muted)">일만 하고 끝남 (실제로는 None 을 돌려줌)</text>
</svg>`;

  /* 여기서 잠깐 : 매개변수 전달 (파이썬은 '객체 참조'를 전달) */
  const SVG_PASS = `<svg viewBox="0 0 1280 520" width="100%" role="img" aria-label="정수와 리스트를 함수에 전달할 때">
  <defs>${MK('m9v1', 'var(--accent)')}${MK('m9v2', 'var(--accent2)')}</defs>
  <text x="320" y="36" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--fg)">① 정수 전달: p = 222 는 p만 바꾼다</text>
  ${BOX(60, 90, 140, 60, 'v', 'var(--accent)', 26)}
  ${BOX(60, 280, 140, 60, 'p', 'var(--accent2)', 26)}
  ${BOX(400, 90, 160, 70, '111', 'var(--line)', 30)}
  ${BOX(400, 280, 160, 70, '222', 'var(--line)', 30)}
  <line x1="202" y1="120" x2="392" y2="124" stroke="var(--accent)" stroke-width="4" marker-end="url(#m9v1)"/>
  <line x1="202" y1="300" x2="392" y2="150" stroke="var(--accent2)" stroke-width="3" stroke-dasharray="8 6" opacity="0.5" marker-end="url(#m9v2)"/>
  <line x1="202" y1="315" x2="392" y2="315" stroke="var(--accent2)" stroke-width="4" marker-end="url(#m9v2)"/>
  <text x="230" y="230" style="font-size:18px;fill:var(--muted)">처음: v와 같은 111을 가리킴</text>
  <text x="230" y="360" style="font-size:18px;fill:var(--accent2)">p = 222 → p만 새 값으로</text>
  <text x="320" y="440" text-anchor="middle" style="font-size:22px;fill:var(--fg)">print(v) → <tspan style="font-weight:700;fill:var(--accent)">111</tspan> (그대로)</text>
  <line x1="640" y1="20" x2="640" y2="500" stroke="var(--line)" stroke-width="2" stroke-dasharray="8 8"/>
  <text x="960" y="36" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--fg)">② 리스트 전달: 같은 리스트를 공유</text>
  ${BOX(700, 90, 140, 60, 'v', 'var(--accent)', 26)}
  ${BOX(700, 280, 140, 60, 'p', 'var(--accent2)', 26)}
  <rect x="1020" y="170" width="180" height="90" rx="10" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
  <text x="1110" y="200" text-anchor="middle" style="font-size:18px;fill:var(--muted)">리스트 (메모리 한 곳)</text>
  <text x="1110" y="243" text-anchor="middle" style="${MONO};font-size:28px;fill:var(--fg)">[<tspan style="fill:var(--danger)">222</tspan>]</text>
  <line x1="842" y1="120" x2="1012" y2="200" stroke="var(--accent)" stroke-width="4" marker-end="url(#m9v1)"/>
  <line x1="842" y1="310" x2="1012" y2="235" stroke="var(--accent2)" stroke-width="4" marker-end="url(#m9v2)"/>
  <text x="880" y="380" style="font-size:18px;fill:var(--accent2)">p[0] = 222 → 공유하는 리스트의 내용이 바뀜</text>
  <text x="960" y="440" text-anchor="middle" style="font-size:22px;fill:var(--fg)">print(v[0]) → <tspan style="font-weight:700;fill:var(--danger)">222</tspan> (바뀜)</text>
</svg>`;

  /* 그림 9-10 : 모듈 사용 예 */
  const SVG_MODULE = `<svg viewBox="0 0 1280 480" width="100%" role="img" aria-label="모듈 사용 예">
  <defs>${MK('m9m1', 'var(--accent2)')}</defs>
  <rect x="470" y="30" width="340" height="150" rx="12" fill="var(--card)" stroke="var(--fg)" stroke-width="3"/>
  <rect x="560" y="14" width="160" height="32" fill="var(--bg, var(--card))"/>
  <text x="640" y="38" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--ok)">Module1.py</text>
  ${['func1()', 'func2()', 'func3()'].map((f, i) => `<text x="510" y="${90 + i * 36}" style="${MONO};font-size:24px;fill:var(--fg)">${f} <tspan style="font-family:inherit;fill:var(--muted)">함수 선언</tspan></text>`).join('')}
  <path d="M468,105 H200 V255" stroke="var(--accent2)" stroke-width="4" fill="none" marker-end="url(#m9m1)"/>
  <path d="M812,105 H1080 V255" stroke="var(--accent2)" stroke-width="4" fill="none" marker-end="url(#m9m1)"/>
  ${[['A.py', 60], ['B.py', 940]].map(([n, x]) => `<rect x="${x}" y="265" width="290" height="180" rx="12" fill="var(--card)" stroke="var(--fg)" stroke-width="3"/>
  <text x="${x + 145}" y="258" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--ok)">${n}</text>
  <text x="${x + 25}" y="305" style="${MONO};font-size:24px;fill:var(--accent2)">import Module1</text>
  ${['func1()', 'func2()', 'func3()'].map((f, i) => `<text x="${x + 25}" y="${350 + i * 32}" style="${MONO};font-size:22px;fill:var(--fg)">${f} <tspan style="font-family:inherit;fill:var(--muted)">함수 호출</tspan></text>`).join('')}`).join('')}
  <text x="640" y="300" text-anchor="middle" style="font-size:22px;fill:var(--muted)">한 번 만든 함수 모음(모듈)을</text>
  <text x="640" y="332" text-anchor="middle" style="font-size:22px;fill:var(--muted)">여러 프로그램이 import 해서 함께 쓴다</text>
</svg>`;

  /* 이 강좌에서 여러 파일을 쓰는 방법 */
  const SVG_FILES = `<svg viewBox="0 0 1280 440" width="100%" role="img" aria-label="파일 구분 주석으로 여러 파일 만들기">
  <defs>${MK('m9w1', 'var(--accent)')}</defs>
  <text x="300" y="36" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--fg)">편집기 (코드 한 칸)</text>
  <rect x="40" y="55" width="520" height="340" rx="12" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
  <text x="60" y="100" style="${MONO};font-size:20px;fill:var(--accent)"># ===== File: Module1.py =====</text>
  <text x="60" y="135" style="${MONO};font-size:20px;fill:var(--fg)">def func1() :</text>
  <text x="90" y="165" style="${MONO};font-size:20px;fill:var(--fg)">print("...")</text>
  <text x="60" y="195" style="${MONO};font-size:20px;fill:var(--muted)">...</text>
  <text x="60" y="250" style="${MONO};font-size:20px;fill:var(--accent2)"># ===== File: main.py =====</text>
  <text x="60" y="285" style="${MONO};font-size:20px;fill:var(--fg)">import Module1</text>
  <text x="60" y="315" style="${MONO};font-size:20px;fill:var(--fg)">Module1.func1()</text>
  <rect x="48" y="70" width="504" height="140" rx="8" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="6 6"/>
  <rect x="48" y="222" width="504" height="110" rx="8" fill="none" stroke="var(--accent2)" stroke-width="2" stroke-dasharray="6 6"/>
  <line x1="560" y1="140" x2="760" y2="140" stroke="var(--accent)" stroke-width="4" marker-end="url(#m9w1)"/>
  <line x1="560" y1="277" x2="760" y2="277" stroke="var(--accent)" stroke-width="4" marker-end="url(#m9w1)"/>
  <text x="660" y="125" text-anchor="middle" style="font-size:18px;fill:var(--muted)">파일로 저장</text>
  <text x="660" y="262" text-anchor="middle" style="font-size:18px;fill:var(--muted)">이 부분을 실행</text>
  <text x="1000" y="36" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--fg)">작업 폴더</text>
  <rect x="780" y="55" width="440" height="340" rx="12" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
  ${BOX(820, 105, 360, 70, '📄 Module1.py (모듈)', 'var(--accent)', 22)}
  ${BOX(820, 242, 360, 70, '▶ main.py (실행되는 프로그램)', 'var(--accent2)', 22)}
  <text x="1000" y="360" text-anchor="middle" style="font-size:18px;fill:var(--muted)">IDLE에서 파일을 두 개 만든 것과 같은 효과</text>
</svg>`;

  /* 그림 9-11 : 패키지의 개념 */
  const SVG_PACKAGE = `<svg viewBox="0 0 1280 440" width="100%" role="img" aria-label="패키지의 개념">
  <rect x="220" y="40" width="840" height="340" rx="14" fill="none" stroke="var(--ok)" stroke-width="4"/>
  <rect x="520" y="22" width="240" height="36" fill="var(--bg, var(--card))"/>
  <text x="640" y="50" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--ok)">📁 package (폴더)</text>
  ${[['📄 Module1.py (파일)', 290, ['func1()', 'func2()']], ['📄 Module2.py (파일)', 680, ['func3()', 'func4()']]].map(([n, x, fs]) => `<rect x="${x}" y="100" width="310" height="240" rx="12" fill="var(--card)" stroke="var(--fg)" stroke-width="3"/>
  <text x="${x + 155}" y="140" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--ok)">${n}</text>
  ${fs.map((f, i) => `<rect x="${x + 55}" y="${170 + i * 80}" width="200" height="54" rx="8" fill="var(--accent2)" opacity="0.85"/><text x="${x + 155}" y="${205 + i * 80}" text-anchor="middle" style="${MONO};font-size:24px;fill:#fff">${f}</text>`).join('')}`).join('')}
  <text x="640" y="420" text-anchor="middle" style="font-size:22px;fill:var(--muted)">함수 → 모듈(.py 파일) → 패키지(폴더) : 점점 큰 단위로 묶는다</text>
</svg>`;

  /* 람다와 map() */
  const SVG_MAP = `<svg viewBox="0 0 1280 460" width="100%" role="img" aria-label="map 함수의 동작">
  <defs>${MK('m9a1', 'var(--accent)')}</defs>
  <text x="640" y="40" text-anchor="middle" style="${MONO};font-size:26px;fill:var(--fg)">list(map(<tspan style="fill:var(--accent2)">lambda num : num + 10</tspan>, <tspan style="fill:var(--accent)">[1, 2, 3, 4, 5]</tspan>))</text>
  ${[1, 2, 3, 4, 5].map((n, i) => {
    const x = 170 + i * 200;
    return `${BOX(x, 90, 140, 64, String(n), 'var(--accent)', 28)}
    <line x1="${x + 70}" y1="158" x2="${x + 70}" y2="200" stroke="var(--accent)" stroke-width="3" marker-end="url(#m9a1)"/>
    <rect x="${x - 10}" y="208" width="160" height="56" rx="28" fill="var(--accent2)" opacity="0.85"/>
    <text x="${x + 70}" y="244" text-anchor="middle" style="${MONO};font-size:22px;fill:#fff">${n} + 10</text>
    <line x1="${x + 70}" y1="268" x2="${x + 70}" y2="310" stroke="var(--accent)" stroke-width="3" marker-end="url(#m9a1)"/>
    ${BOX(x, 318, 140, 64, String(n + 10), 'var(--ok)', 28)}`;
  }).join('')}
  <text x="60" y="130" style="font-size:20px;fill:var(--muted)">입력</text>
  <text x="40" y="244" style="font-size:20px;fill:var(--muted)">함수 적용</text>
  <text x="60" y="358" style="font-size:20px;fill:var(--muted)">결과</text>
  <text x="640" y="432" text-anchor="middle" style="font-size:22px;fill:var(--muted)">map(함수, 리스트) : 리스트의 모든 요소에 같은 함수를 하나씩 적용한다</text>
</svg>`;

  /* 재귀 호출 : factorial(4) */
  const SVG_RECUR = `<svg viewBox="0 0 1280 540" width="100%" role="img" aria-label="factorial 재귀 호출 과정">
  <defs>${MK('m9q1', 'var(--accent2)')}${MK('m9q2', 'var(--ok)')}</defs>
  ${[['factorial(4)', '4 * factorial(3)'], ['factorial(3)', '3 * factorial(2)'], ['factorial(2)', '2 * factorial(1)'], ['factorial(1)', 'num <= 1 → return 1']].map(([a, b], i) => {
    const x = 60 + i * 150, y = 40 + i * 110;
    return `<rect x="${x}" y="${y}" width="560" height="80" rx="12" fill="var(--card)" stroke="${i === 3 ? 'var(--danger)' : 'var(--accent2)'}" stroke-width="3"/>
    <text x="${x + 20}" y="${y + 50}" style="${MONO};font-size:26px;font-weight:700;fill:var(--fg)">${a}</text>
    <text x="${x + 230}" y="${y + 50}" style="${MONO};font-size:22px;fill:var(--muted)">${b}</text>` +
    (i < 3 ? `<path d="M${x + 100},${y + 82} V${y + 132} H${x + 146}" stroke="var(--accent2)" stroke-width="3" fill="none" marker-end="url(#m9q1)"/>` : '');
  }).join('')}
  ${[['1', 1040, 440], ['2 * 1 = 2', 1040, 330], ['3 * 2 = 6', 1040, 220], ['4 * 6 = 24', 1040, 110]].map(([t, x, y], i) =>
    `<text x="${x}" y="${y}" style="${MONO};font-size:24px;font-weight:700;fill:var(--ok)">${i === 0 ? 'return ' : '→ '}${t}</text>`).join('')}
  <path d="M1000,430 C1080,400 1080,360 1020,330" stroke="var(--ok)" stroke-width="3" fill="none" marker-end="url(#m9q2)"/>
  <path d="M1000,320 C1080,290 1080,250 1020,220" stroke="var(--ok)" stroke-width="3" fill="none" marker-end="url(#m9q2)"/>
  <path d="M1000,210 C1080,180 1080,140 1020,110" stroke="var(--ok)" stroke-width="3" fill="none" marker-end="url(#m9q2)"/>
  <text x="330" y="505" text-anchor="middle" style="font-size:22px;fill:var(--accent2)">① 자기 자신을 호출하며 내려감</text>
  <text x="1000" y="505" text-anchor="middle" style="font-size:22px;fill:var(--ok)">② 멈춤 조건에서부터 값을 들고 올라옴</text>
</svg>`;

  /* ---------- 자주 쓰는 코드 ---------- */
  const COFFEE_FUNC = `## 전역 변수 선언 부분 ##
coffee = 0

## 함수 선언 부분 ##
def coffee_machine(button) :
    print()
    print("#1. (자동으로) 뜨거운 물을 준비한다.");
    print("#2. (자동으로) 종이컵을 준비한다.");

    if button == 1 :
        print("#3. (자동으로) 보통커피를 탄다.")
    elif button == 2 :
        print("#3. (자동으로) 설탕커피를 탄다.")
    elif button == 3 :
        print("#3. (자동으로) 블랙커피를 탄다.")
    else :
        print("#3. (자동으로) 아무거나 탄다.\\n")

    print("#4. (자동으로) 물을 붓는다.");
    print("#5. (자동으로) 스푼으로 젓는다.");
    print()
`;

  const MY_TURTLE = `# ===== File: myTurtle.py =====
import random
from tkinter.simpledialog import *

def getString() :
    retStr = ''
    retStr = askstring('문자열 입력', '거북이 쓸 문자열을 입력')
    return retStr

def getRGB() :
    r, g, b = 0, 0, 0
    r = random.random()
    g = random.random()
    b = random.random()
    return (r, g, b)

def getXYAS(sw, sh) :
    x, y, angle, size = 0, 0, 0, 0
    x = random.randrange(-sw // 2, sw // 2)
    y = random.randrange(-sh // 2, sh // 2)
    angle = random.randrange(0, 360)
    size = random.randrange(10, 50)
    return [x, y, angle, size]
`;

  const CODE0914_MAIN = `# ===== File: main.py =====
from myTurtle import *
import turtle

## 전역 변수 선언 부분 ##
inStr = ''
swidth, sheight = 300, 300
tX, tY, tAngle, tSize = [0] * 4

## 메인 코드 부분 ##
turtle.title('거북이 글자쓰기(모듈버전)')
turtle.shape('turtle')
turtle.setup(width = swidth + 50, height = sheight + 50)
turtle.screensize(swidth, sheight)
turtle.penup()
turtle.speed(5)

inStr = getString()

for ch in inStr :

    tX, tY, tAngle, txtSize = getXYAS(swidth, sheight)
    r, g, b = getRGB()

    turtle.goto(tX, tY)
    turtle.left(tAngle)

    turtle.pencolor((r, g, b))
    turtle.write(ch, font = ('맑은고딕', txtSize, 'bold'))

turtle.done()
`;

  const LOTTO = `import random

## 함수 선언 부분 ##
def getNumber() :
    return random.randrange(1, 46)

## 전역 변수 선언 부분 ##
lotto = []
num = 0

## 메인 코드 부분 ##
print("** 로또 추첨을 시작합니다. ** \\n");

while True :
    num = getNumber()

    if lotto.count(num) == 0 :
        lotto.append(num)

    if len(lotto) >= 6 :
        break

print("추첨된 로또 번호 ==>  ", end = '')
lotto.sort()
for i in range(0, 6) :
    print("%d  " % lotto[i], end = '')
`;

  PY_COURSE.addChapter({
    id: 'ch09',
    no: '09',
    title: '함수와 모듈',
    subtitle: 'def · return · 매개변수 · 지역/전역 변수 · import · 패키지 · lambda · 재귀',
    summary: '자주 쓰는 코드를 함수로 묶어 이름으로 불러 쓰는 방법, 값을 주고받는 매개변수와 반환값, 변수의 생존 범위를 배우고, 함수를 파일로 모은 모듈과 패키지, 람다 · map() · 재귀 · 제너레이터까지 익힙니다. 로또 번호 추첨기와 모듈을 활용해 글자를 쓰는 거북이를 만듭니다.',
    goals: [
      '함수가 필요한 이유를 설명하고 def 로 함수를 정의 · 호출할 수 있다',
      '매개변수와 반환값(여러 개 포함)으로 함수와 데이터를 주고받을 수 있다',
      '지역 변수와 전역 변수의 차이를 설명하고 global 예약어를 사용할 수 있다',
      '기본값 매개변수, 가변 매개변수(*para), 딕셔너리 매개변수(**para)를 활용할 수 있다',
      '모듈을 직접 만들고 import / from … import 로 사용할 수 있으며, 표준 모듈 · 패키지를 이해한다',
      '내부 함수, lambda, map(), 재귀 함수, 제너레이터(yield)의 동작을 설명할 수 있다'
    ],
    sections: [
      /* ===================== ch09-1 ===================== */
      {
        id: 'ch09-1',
        title: '함수의 기본 — 커피 자판기 만들기',
        minutes: 50,
        goals: [
          '이 장에서 만들 두 프로그램(로또 추첨, 글자 쓰는 거북이)을 미리 본다',
          '함수의 개념(요술 상자)과 필요성을 커피 자판기 예로 설명할 수 있다',
          'def 로 함수를 정의하고, 인수를 넣어 호출할 수 있다',
          '함수 호출 순서(호출 → 실행 → 반환 → 대입)를 따라갈 수 있다'
        ],
        flow: [['도입: 이 장에서 만들 프로그램', 5], ['함수의 개념 · 커피 타기 코드', 10], ['커피 자판기 함수 (Code09-02, 03)', 12], ['plus() · 호출 순서 · 계산기', 15], ['퀴즈 · SELF STUDY', 8]],
        content: [
          { type: 'h', text: '이 장에서 만들 프로그램' },
          { type: 'p', html: '이번 장에서는 두 개의 프로그램을 완성합니다. 둘 다 <b>함수</b>와 <b>모듈</b>을 배워야 깔끔하게 만들 수 있는 프로그램입니다.' },
          { type: 'list', items: [
            '<b>[프로그램 1] 로또 번호 추첨</b> — 1~45 중에서 <b>겹치지 않는 숫자 6개</b>를 뽑아 작은 수부터 정렬해 보여 줍니다. 숫자 하나를 뽑는 일을 <code>getNumber()</code> 함수로 만듭니다.<pre><code>** 로또 추첨을 시작합니다. **\n\n추첨된 로또 번호 ==&gt;  2  6  8  9  27  32</code></pre>',
            '<b>[프로그램 2] 모듈을 활용해 글자를 쓰는 거북이</b> — 입력 대화상자에 문자열을 넣으면 거북이가 글자를 하나씩 임의의 위치 · 크기 · 색 · 방향으로 씁니다. 앞 장의 “임의의 위치에 글자를 쓰는 거북이”와 기능은 같지만, 필요한 함수들을 <code>myTurtle.py</code> 라는 <b>모듈</b>로 따로 빼서 사용합니다.'
          ] },
          { type: 'h', text: '함수의 개념과 필요성' },
          { type: 'p', html: '<b>함수(function)</b>는 “<b>무엇</b>을 넣으면 <b>어떤 것</b>을 돌려주는 요술 상자”입니다. 예를 들어 <code>len("hello")</code> 는 문자열을 넣으면 길이 5를 돌려주고, <code>int("100")</code> 은 문자열을 넣으면 정수 100을 돌려줍니다. 우리는 이미 많은 함수를 써 왔습니다.' },
          { type: 'p', html: '함수를 쓰는 형식은 <code>함수명()</code> 입니다. 괄호 안에 넣는 값이 있으면 괄호 안에 씁니다. 가장 많이 써 본 함수는 역시 <code>print()</code> 입니다.' },
          { type: 'code', repl: true, title: 'print() 함수 호출하기', code: 'print("CookBook-파이썬")\nlen("CookBook")\nint("100") + 1',
            expect: '>>> print("CookBook-파이썬")\nCookBook-파이썬\n>>> len("CookBook")\n8\n>>> int("100") + 1\n101\n>>>',
            desc: '콘솔의 <code>&gt;&gt;&gt;</code> 셸에서 한 줄씩 실행됩니다. <code>len()</code> 과 <code>int()</code> 는 결과값을 <b>돌려주는</b> 함수라서 셸에 결과가 바로 보입니다.' },
          { type: 'callout', kind: 'info', title: '함수(function)와 메서드(method)는 무엇이 다를까?', html: '둘 다 “이름을 불러서 실행하는 코드 묶음”입니다. <b>함수</b>는 <code>print()</code>, <code>len()</code> 처럼 <b>따로(독립적으로)</b> 존재하고, <b>메서드</b>는 <code>리스트.append()</code>, <code>문자열.upper()</code> 처럼 <b>클래스(객체) 안에</b> 들어 있어서 <code>값.메서드()</code> 형태로 부릅니다. 클래스는 12장에서 배웁니다.' },
          { type: 'h', text: '커피를 타는 과정을 코드로' },
          { type: 'p', html: '카페 직원이 손님에게 커피를 타 주는 과정을 생각해 봅시다. 주문을 받고 → 물을 끓이고 → 종이컵을 준비하고 → 주문한 종류(보통 · 설탕 · 블랙)의 커피를 넣고 → 물을 붓고 → 저어서 → 손님께 드립니다. 이 과정을 그대로 코드로 옮기면 다음과 같습니다.' },
          { type: 'figure', html: SVG_COFFEE, caption: '그림 9-1 · 9-2 직접 커피를 타는 과정과 커피 자판기' },
          { type: 'code', title: 'Code09-01. 커피를 타는 과정의 코드', stdin: '2\n', code: `coffee = 0

coffee = int(input("어떤 커피 드릴까요?(1:보통, 2:설탕, 3:블랙)") )

print()
print("#1. 뜨거운 물을 준비한다.");
print("#2. 종이컵을 준비한다.");

if coffee == 1 :
    print("#3. 보통커피를 탄다.")
elif coffee == 2 :
    print("#3. 설탕커피를 탄다.")
elif coffee == 3 :
    print("#3. 블랙커피를 탄다.")
else :
    print("#3. 아무거나 탄다.\\n")

print("#4. 물을 붓는다.");
print("#5. 스푼으로 젓는다.");
print()
print("손님~ 커피 여기 있습니다.");`,
            expect: '어떤 커피 드릴까요?(1:보통, 2:설탕, 3:블랙)2\n\n#1. 뜨거운 물을 준비한다.\n#2. 종이컵을 준비한다.\n#3. 설탕커피를 탄다.\n#4. 물을 붓는다.\n#5. 스푼으로 젓는다.\n\n손님~ 커피 여기 있습니다.',
            desc: '"예시 입력으로 실행"을 누르면 2(설탕커피)가 입력됩니다. 줄 끝의 <code>;</code> 는 강의자료 그대로 둔 것인데, 파이썬에서는 <b>붙여도 되고 안 붙여도 되는</b> 기호입니다(보통은 붙이지 않습니다).' },
          { type: 'p', html: '그런데 손님이 <b>3명</b> 연속으로 들어오면 어떻게 될까요? 함수를 모른다면 <code>3~21행</code>을 <b>복사해서 두 번 더 붙여 넣어야</b> 합니다. 코드가 3배로 길어지고, “물을 붓는다”를 “뜨거운 물을 붓는다”로 바꾸려면 세 군데를 모두 고쳐야 합니다. 한 곳이라도 빠뜨리면 손님마다 다른 결과가 나오는 버그가 생기지요.' },
          { type: 'callout', kind: 'warn', title: '복사 · 붙여 넣기 코드의 문제점', html: '<ul><li>코드가 길어져 읽기 어렵다</li><li>같은 수정을 여러 곳에 해야 한다 → 실수하기 쉽다</li><li>손님이 100명이면? 사실상 불가능하다</li></ul>' },
          { type: 'h', text: '커피 자판기(함수)를 만들자' },
          { type: 'p', html: '카페 사장님이 <b>커피 자판기</b>를 들여놓았다고 생각해 봅시다. 직원은 주문을 받아 자판기의 <b>버튼만 누르면</b> 됩니다. 자판기 안에서 물 준비부터 젓기까지 자동으로 처리해 주니까요. 이 “자판기”가 바로 함수입니다. 함수는 <code>def</code> (define, 정의하다) 키워드로 만듭니다.' },
          { type: 'code', title: 'Code09-02. 커피 자판기 함수 만들기', stdin: '2\n', code: COFFEE_FUNC + `
## 메인 코드 부분 ##
coffee = int(input("어떤 커피 드릴까요?(1:보통, 2:설탕, 3:블랙)"))
coffee_machine(coffee)
print("손님~ 커피 여기 있습니다.");`,
            expect: '어떤 커피 드릴까요?(1:보통, 2:설탕, 3:블랙)2\n\n#1. (자동으로) 뜨거운 물을 준비한다.\n#2. (자동으로) 종이컵을 준비한다.\n#3. (자동으로) 설탕커피를 탄다.\n#4. (자동으로) 물을 붓는다.\n#5. (자동으로) 스푼으로 젓는다.\n\n손님~ 커피 여기 있습니다.',
            desc: '<code>5행</code> <code>def coffee_machine(button) :</code> 이 자판기를 만드는 부분입니다. 들여쓴 <code>6~21행</code>이 자판기 안의 동작(함수 본문)이고, 이 부분은 <b>정의만 될 뿐 바로 실행되지 않습니다</b>. 실제 실행은 <code>25행</code> <code>coffee_machine(coffee)</code> 로 <b>호출</b>할 때 일어납니다. 이때 <code>coffee</code> 의 값(2)이 <code>button</code> 에 들어갑니다.' },
          { type: 'p', html: '프로그램을 <b>전역 변수 선언 부분 → 함수 선언 부분 → 메인 코드 부분</b>으로 나누어 쓴 것도 눈여겨보세요. 강의자료의 모든 예제가 이 순서를 따릅니다. 함수는 <b>호출하기 전에 먼저 정의</b>되어 있어야 하므로, 함수 선언 부분을 메인 코드보다 위에 둡니다.' },
          { type: 'p', html: '이제 손님이 여러 명 와도 걱정 없습니다. 자판기(함수)는 한 번만 만들고, 손님마다 <b>버튼만 누르면(호출하면)</b> 됩니다.' },
          { type: 'code', title: 'Code09-03. 손님 A, B, C 에게 커피 대접하기', stdin: '2\n3\n1\n', code: COFFEE_FUNC + `
## 메인 코드 부분 ##
coffee = int(input("A손님, 어떤 커피 드릴까요?(1:보통, 2:설탕, 3:블랙)"))
coffee_machine(coffee)
print("A손님~ 커피 여기 있습니다.")

coffee = int(input("B손님, 어떤 커피 드릴까요?(1:보통, 2:설탕, 3:블랙)"))
coffee_machine(coffee)
print("B손님~ 커피 여기 있습니다.")

coffee = int(input("C손님, 어떤 커피 드릴까요?(1:보통, 2:설탕, 3:블랙)"))
coffee_machine(coffee)
print("C손님~ 커피 여기 있습니다.")`,
            expect: 'A손님, 어떤 커피 드릴까요?(1:보통, 2:설탕, 3:블랙)2\n\n#1. (자동으로) 뜨거운 물을 준비한다.\n#2. (자동으로) 종이컵을 준비한다.\n#3. (자동으로) 설탕커피를 탄다.\n#4. (자동으로) 물을 붓는다.\n#5. (자동으로) 스푼으로 젓는다.\n\nA손님~ 커피 여기 있습니다.\nB손님, 어떤 커피 드릴까요?(1:보통, 2:설탕, 3:블랙)3\n\n#1. (자동으로) 뜨거운 물을 준비한다.\n#2. (자동으로) 종이컵을 준비한다.\n#3. (자동으로) 블랙커피를 탄다.\n#4. (자동으로) 물을 붓는다.\n#5. (자동으로) 스푼으로 젓는다.\n\nB손님~ 커피 여기 있습니다.\nC손님, 어떤 커피 드릴까요?(1:보통, 2:설탕, 3:블랙)1\n\n#1. (자동으로) 뜨거운 물을 준비한다.\n#2. (자동으로) 종이컵을 준비한다.\n#3. (자동으로) 보통커피를 탄다.\n#4. (자동으로) 물을 붓는다.\n#5. (자동으로) 스푼으로 젓는다.\n\nC손님~ 커피 여기 있습니다.',
            desc: '예시 입력은 A=2, B=3, C=1 입니다. 함수 본문(<code>6~21행</code>)은 한 번만 썼는데 세 번 실행되었습니다. “물을 붓는다” 문구를 바꾸고 싶다면 <code>19행</code> 한 곳만 고치면 됩니다.' },
          { type: 'callout', kind: 'more', title: '📘 반복문과 함께 쓰면 더 짧아진다', html: '손님 이름을 리스트로 만들고 <code>for</code> 문으로 돌리면 손님이 100명이어도 코드 길이가 같습니다.<pre><code>for name in ["A", "B", "C"] :\n    coffee = int(input(name + "손님, 어떤 커피 드릴까요?(1:보통, 2:설탕, 3:블랙)"))\n    coffee_machine(coffee)\n    print(name + "손님~ 커피 여기 있습니다.")</code></pre>함수(무엇을 할지)와 반복문(몇 번 할지)은 짝꿍처럼 자주 함께 쓰입니다.' },
          { type: 'h', text: '함수의 형식과 활용' },
          { type: 'p', html: '함수는 보통 <b>매개변수(parameter)</b>를 입력받아 처리한 뒤, 그 결과인 <b>반환값(return value)</b>을 돌려줍니다. 형식은 다음과 같습니다.<pre><code>def 함수명(매개변수1, 매개변수2, …) :\n    실행할 문장들      ← 반드시 들여쓰기\n    return 반환값      ← 돌려줄 값이 있으면</code></pre>' },
          { type: 'figure', html: SVG_FUNCBOX, caption: '그림 9-3 · 9-5 함수의 기본 형식 — 매개변수 2개를 받아 처리하고 반환값을 돌려준다' },
          { type: 'p', html: '가장 간단한 예로, 두 수를 받아 더한 값을 돌려주는 <code>plus()</code> 함수를 만들어 봅시다.' },
          { type: 'code', title: 'Code09-04. plus() 함수', code: `## 함수 선언 부분 ##
def plus(v1, v2) :
    result = 0
    result = v1 + v2
    return result

## 전역 변수 선언 부분 ##
hap = 0

## 메인 코드 부분 ##
hap = plus(100, 200)
print("100과 200의 plus() 함수 결과는 %d" % hap)`,
            expect: '100과 200의 plus() 함수 결과는 300',
            desc: '<code>11행</code>에서 <code>plus(100, 200)</code> 을 호출하면 100은 <code>v1</code>, 200은 <code>v2</code> 에 들어갑니다. 함수는 <code>4행</code>에서 더하고, <code>5행</code> <code>return result</code> 로 300을 돌려줍니다. 돌려받은 300이 <code>hap</code> 에 대입됩니다.' },
          { type: 'figure', html: SVG_PLUS, caption: '그림 9-4 plus() 함수의 형식과 호출 순서 — ① 호출 → ② 실행 → ③ 결과 반환 → ④ 반환값 대입' },
          { type: 'callout', kind: 'more', title: '📘 매개변수(parameter)와 인수(argument)', html: '엄밀히 구분하면, 함수를 <b>정의</b>할 때 괄호 안에 쓰는 변수(<code>v1</code>, <code>v2</code>)를 <b>매개변수</b>, 함수를 <b>호출</b>할 때 넣는 실제 값(<code>100</code>, <code>200</code>)을 <b>인수(인자)</b>라고 합니다. 이 강의자료에서는 둘을 모두 “매개변수”라고 부르니, 문맥에 따라 이해하면 됩니다.' },
          { type: 'callout', kind: 'more', title: '📘 f-string 으로 출력하기', html: '<code>%d</code> 서식 대신 최신 파이썬에서 많이 쓰는 f-string 을 쓰면 더 읽기 쉽습니다.<pre><code>print(f"100과 200의 plus() 함수 결과는 {hap}")\nprint(f"함수 호출 결과를 바로 넣을 수도 있다: {plus(3, 4)}")</code></pre>' },
          { type: 'h', text: '계산기 함수 만들기' },
          { type: 'p', html: '이번에는 매개변수를 3개 받는 함수입니다. 두 수와 연산자(<code>+ - * /</code>)를 받아 계산 결과를 돌려줍니다.' },
          { type: 'code', title: 'Code09-05. 계산기 함수', stdin: '*\n7\n8\n', code: `## 함수 선언 부분 ##
def calc(v1, v2, op) :
    result = 0
    if op == '+' :
        result = v1 + v2
    elif op == '-' :
        result = v1 - v2
    elif op == '*' :
        result = v1 * v2
    elif op == '/' :
        result = v1 / v2

    return result

## 전역 변수 선언 부분 ##
res = 0
var1, var2, oper = 0, 0, ""

## 메인 코드 부분 ##
oper = input("계산을 입력하세요(+, -, *, /) : ")
var1 = int(input("첫 번째 수를 입력하세요 : "))
var2 = int(input("두 번째 수를 입력하세요 : "))

res = calc(var1, var2, oper)

print("## 계산기 : %d %s %d = %d" % (var1, oper, var2, res))`,
            expect: '계산을 입력하세요(+, -, *, /) : *\n첫 번째 수를 입력하세요 : 7\n두 번째 수를 입력하세요 : 8\n## 계산기 : 7 * 8 = 56',
            desc: '<code>24행</code>에서 <code>var1, var2, oper</code> 의 값이 <b>순서대로</b> <code>v1, v2, op</code> 에 들어갑니다. 매개변수의 순서가 중요합니다. <code>/</code> 의 결과는 실수지만 <code>%d</code> 로 출력하므로 소수점 아래는 버려집니다.' },
          { type: 'callout', kind: 'tip', title: 'Tip · 매개변수는 지역 변수', html: '<code>calc()</code> 가 받는 매개변수 <code>v1</code>, <code>v2</code>, <code>op</code> 는 <b>calc() 함수 안에서만</b> 사용할 수 있는 <b>지역 변수</b>입니다. 함수 밖(메인 코드)에서 <code>print(v1)</code> 을 하면 오류가 납니다. 지역 변수와 전역 변수는 다음 교시에 자세히 배웁니다.' },
          { type: 'callout', kind: 'warn', title: '함수를 만들 때 흔한 실수', html: '<ul><li><code>def plus(v1, v2)</code> 뒤의 <b>콜론(:) 빠뜨리기</b> → <code>SyntaxError</code></li><li>함수 본문 <b>들여쓰기 안 하기</b> → <code>IndentationError</code></li><li><b>정의하기 전에 호출</b>하기 → <code>NameError: name \'plus\' is not defined</code></li><li>괄호 없이 <code>plus</code> 라고만 쓰기 → 함수가 실행되지 않고 함수 자체를 가리킬 뿐입니다</li></ul>' },
          { type: 'code', title: '추가 예제. 함수를 정의하기 전에 호출하면?', expectError: true, code: `hap = plus(100, 200)     # 아직 plus 를 모르는 상태
print(hap)

def plus(v1, v2) :
    return v1 + v2`,
            expect: 'Traceback (most recent call last):\n  File "main.py", line 1, in <module>\n    hap = plus(100, 200)     # 아직 plus 를 모르는 상태\n          ^^^^\nNameError: name \'plus\' is not defined',
            desc: '파이썬은 위에서 아래로 한 줄씩 실행합니다. <code>1행</code>을 실행하는 순간에는 아직 <code>4행</code>의 <code>def</code> 가 실행되지 않았으므로 <code>plus</code> 라는 이름이 없습니다. 그래서 함수 선언 부분을 메인 코드보다 <b>위에</b> 둡니다.' }
        ],
        practice: [
          {
            title: 'SELF STUDY 9-1. 4명의 손님과 4종류의 커피',
            level: 1,
            desc: '<p>Code09-03 을 수정해서 커피 종류를 <b>아메리카노, 카페라떼, 카푸치노, 에스프레소</b> 중 하나를 고를 수 있게 하세요. 그리고 <b>로제, 리사, 지수, 제니</b> 4명의 주문을 받아 보세요.</p><pre><code>로제씨, 어떤 커피 드릴까요?(1:아메리카노, 2:카페라떼, 3:카푸치노, 4:에스프레소) 4\n\n#1. (자동으로) 뜨거운 물을 준비한다.\n#2. (자동으로) 종이컵을 준비한다.\n#3. (자동으로) 에스프레소를 탄다.\n#4. (자동으로) 물을 붓는다.\n#5. (자동으로) 스푼으로 젓는다.\n\n로제씨~ 커피 여기 있습니다.\n… 생략 …</code></pre>',
            hint: '<code>coffee_machine()</code> 의 <code>if~elif</code> 에 4번 버튼을 추가하고, 메인 코드에서는 손님 이름만 바꿔 네 번 호출합니다. 리스트와 <code>for</code> 문을 쓰면 더 짧아집니다.',
            stdin: '4\n1\n2\n3\n',
            starter: `## 함수 선언 부분 ##
def coffee_machine(button) :
    print()
    print("#1. (자동으로) 뜨거운 물을 준비한다.")
    print("#2. (자동으로) 종이컵을 준비한다.")
    # TODO: 1:아메리카노, 2:카페라떼, 3:카푸치노, 4:에스프레소
    print("#4. (자동으로) 물을 붓는다.")
    print("#5. (자동으로) 스푼으로 젓는다.")
    print()

## 메인 코드 부분 ##
# TODO: 로제, 리사, 지수, 제니의 주문을 차례로 받기
`,
            solution: `## 함수 선언 부분 ##
def coffee_machine(button) :
    print()
    print("#1. (자동으로) 뜨거운 물을 준비한다.")
    print("#2. (자동으로) 종이컵을 준비한다.")

    if button == 1 :
        print("#3. (자동으로) 아메리카노를 탄다.")
    elif button == 2 :
        print("#3. (자동으로) 카페라떼를 탄다.")
    elif button == 3 :
        print("#3. (자동으로) 카푸치노를 탄다.")
    elif button == 4 :
        print("#3. (자동으로) 에스프레소를 탄다.")
    else :
        print("#3. (자동으로) 아무거나 탄다.\\n")

    print("#4. (자동으로) 물을 붓는다.")
    print("#5. (자동으로) 스푼으로 젓는다.")
    print()

## 메인 코드 부분 ##
for name in ["로제", "리사", "지수", "제니"] :
    coffee = int(input(name + "씨, 어떤 커피 드릴까요?(1:아메리카노, 2:카페라떼, 3:카푸치노, 4:에스프레소) "))
    coffee_machine(coffee)
    print(name + "씨~ 커피 여기 있습니다.")
`,
            expect: '로제씨, 어떤 커피 드릴까요?(1:아메리카노, 2:카페라떼, 3:카푸치노, 4:에스프레소) 4\n\n#1. (자동으로) 뜨거운 물을 준비한다.\n#2. (자동으로) 종이컵을 준비한다.\n#3. (자동으로) 에스프레소를 탄다.\n#4. (자동으로) 물을 붓는다.\n#5. (자동으로) 스푼으로 젓는다.\n\n로제씨~ 커피 여기 있습니다.\n리사씨, 어떤 커피 드릴까요?(1:아메리카노, 2:카페라떼, 3:카푸치노, 4:에스프레소) 1\n\n#1. (자동으로) 뜨거운 물을 준비한다.\n#2. (자동으로) 종이컵을 준비한다.\n#3. (자동으로) 아메리카노를 탄다.\n#4. (자동으로) 물을 붓는다.\n#5. (자동으로) 스푼으로 젓는다.\n\n리사씨~ 커피 여기 있습니다.\n지수씨, 어떤 커피 드릴까요?(1:아메리카노, 2:카페라떼, 3:카푸치노, 4:에스프레소) 2\n\n#1. (자동으로) 뜨거운 물을 준비한다.\n#2. (자동으로) 종이컵을 준비한다.\n#3. (자동으로) 카페라떼를 탄다.\n#4. (자동으로) 물을 붓는다.\n#5. (자동으로) 스푼으로 젓는다.\n\n지수씨~ 커피 여기 있습니다.\n제니씨, 어떤 커피 드릴까요?(1:아메리카노, 2:카페라떼, 3:카푸치노, 4:에스프레소) 3\n\n#1. (자동으로) 뜨거운 물을 준비한다.\n#2. (자동으로) 종이컵을 준비한다.\n#3. (자동으로) 카푸치노를 탄다.\n#4. (자동으로) 물을 붓는다.\n#5. (자동으로) 스푼으로 젓는다.\n\n제니씨~ 커피 여기 있습니다.'
          },
          {
            title: 'SELF STUDY 9-2. 계산기 기능 추가',
            level: 2,
            desc: '<p>Code09-05 에 다음 기능을 추가하세요.</p><ol><li>숫자1, 연산자, 숫자2 순서로 입력받는다.</li><li>제곱(<code>**</code>) 연산자를 추가한다.</li><li>0으로 나누려고 하면 메시지를 출력하고 계산하지 않는다.</li></ol><pre><code>첫 번째 수를 입력하세요 : 2\n계산을 입력하세요(+, -, *, /, **) : **\n두 번째 수를 입력하세요 : 4\n## 계산기 : 2 ** 4 = 16</code></pre><pre><code>첫 번째 수를 입력하세요 : 8\n계산을 입력하세요(+, -, *, /, **) : /\n두 번째 수를 입력하세요 : 0\n0으로는 나누면 안 됩니다.ㅠㅠ</code></pre>',
            hint: '메인 코드 부분에 <code>if~else</code> 문을 써서 “연산자가 <code>/</code> 이고 두 번째 수가 0” 인 경우를 먼저 걸러 냅니다.',
            stdin: '2\n**\n4\n',
            starter: `## 함수 선언 부분 ##
def calc(v1, v2, op) :
    result = 0
    if op == '+' :
        result = v1 + v2
    elif op == '-' :
        result = v1 - v2
    elif op == '*' :
        result = v1 * v2
    elif op == '/' :
        result = v1 / v2
    # TODO: ** 연산자 추가
    return result

## 메인 코드 부분 ##
# TODO: 숫자1 → 연산자 → 숫자2 순서로 입력받기
# TODO: 0으로 나누는 경우 메시지 출력
`,
            solution: `## 함수 선언 부분 ##
def calc(v1, v2, op) :
    result = 0
    if op == '+' :
        result = v1 + v2
    elif op == '-' :
        result = v1 - v2
    elif op == '*' :
        result = v1 * v2
    elif op == '/' :
        result = v1 / v2
    elif op == '**' :
        result = v1 ** v2

    return result

## 전역 변수 선언 부분 ##
res = 0
var1, var2, oper = 0, 0, ""

## 메인 코드 부분 ##
var1 = int(input("첫 번째 수를 입력하세요 : "))
oper = input("계산을 입력하세요(+, -, *, /, **) : ")
var2 = int(input("두 번째 수를 입력하세요 : "))

if oper == '/' and var2 == 0 :
    print("0으로는 나누면 안 됩니다.ㅠㅠ")
else :
    res = calc(var1, var2, oper)
    print("## 계산기 : %d %s %d = %d" % (var1, oper, var2, res))
`,
            expect: '첫 번째 수를 입력하세요 : 2\n계산을 입력하세요(+, -, *, /, **) : **\n두 번째 수를 입력하세요 : 4\n## 계산기 : 2 ** 4 = 16'
          },
          {
            title: '실습 9-1. 사각형 넓이 함수',
            level: 1,
            desc: '<p>가로와 세로를 매개변수로 받아 넓이를 돌려주는 <code>area(w, h)</code> 함수를 만들고, (3, 4), (10, 20) 두 사각형의 넓이를 출력하세요.</p><pre><code>3 x 4 사각형의 넓이 : 12\n10 x 20 사각형의 넓이 : 200</code></pre>',
            hint: '<code>return w * h</code> 로 값을 돌려주고, 호출한 쪽에서 변수에 받아 출력합니다.',
            starter: `## 함수 선언 부분 ##
# TODO: area(w, h) 함수 정의

## 메인 코드 부분 ##
# TODO: area(3, 4), area(10, 20) 결과 출력
`,
            solution: `## 함수 선언 부분 ##
def area(w, h) :
    return w * h

## 메인 코드 부분 ##
print("3 x 4 사각형의 넓이 : %d" % area(3, 4))
print("10 x 20 사각형의 넓이 : %d" % area(10, 20))
`,
            expect: '3 x 4 사각형의 넓이 : 12\n10 x 20 사각형의 넓이 : 200'
          }
        ],
        quiz: [
          { q: '함수에 대한 설명으로 <b>옳지 않은</b> 것은?', options: ['def 키워드로 정의한다', '정의만 해도 함수 본문이 한 번 자동 실행된다', '같은 함수를 여러 번 호출할 수 있다', '함수 본문은 들여쓰기해야 한다'], answer: 1, explain: '함수는 정의만 해서는 실행되지 않고, <code>함수명()</code> 으로 <b>호출</b>해야 실행됩니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>def plus(v1, v2) :\n    result = v1 + v2\n    return result\n\nhap = plus(3, 4)\nprint(hap * 2)</code></pre>', options: ['7', '14', '34', '오류'], answer: 1, explain: '<code>plus(3, 4)</code> 는 7을 돌려주고, <code>hap * 2</code> 는 14입니다.' },
          { q: '<code>calc(7, 8, \'*\')</code> 를 호출했을 때 <code>def calc(v1, v2, op)</code> 의 <code>op</code> 에 들어가는 값은?', options: ['7', '8', "'*'", 'None'], answer: 2, explain: '인수는 <b>순서대로</b> 매개변수에 들어갑니다. 세 번째 인수 <code>\'*\'</code> 가 세 번째 매개변수 <code>op</code> 에 들어갑니다.' },
          { q: '다음 중 함수를 쓰는 이유로 가장 알맞은 것은?', options: ['프로그램 실행 속도를 항상 빠르게 하려고', '같은 코드를 반복해 쓰지 않고, 한 곳만 고쳐도 되게 하려고', '변수를 쓰지 않으려고', 'input() 을 쓰지 않으려고'], answer: 1, explain: '함수는 반복되는 코드를 한 번만 작성해 재사용하고, 수정도 한 곳에서 할 수 있게 해 줍니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>def hello() :\n    print("안녕", end=" ")\n\nhello()\nhello()\nprint("파이썬")</code></pre>', options: ['안녕 파이썬', '안녕 안녕 파이썬', '파이썬 안녕 안녕', '아무것도 출력되지 않는다'], answer: 1, explain: '<code>hello()</code> 를 두 번 호출했으므로 “안녕 ”이 두 번 출력되고, 마지막에 “파이썬”이 출력됩니다.' }
        ],
        slides: [
          { layout: 'title', title: '함수의 기본 — 커피 자판기 만들기', subtitle: 'Chapter 09 함수와 모듈 · Section 01~02', badge: '09-1',
            notes: '<p><b>[도입 1분]</b> “여러분은 이미 함수를 매일 썼습니다. print, input, len, int … 오늘은 이런 함수를 <b>직접 만드는</b> 방법을 배웁니다.”</p><p>이번 장은 분량이 많아 5교시로 나눕니다: ① 함수 기본 ② 지역/전역 변수 · 반환값 ③ 매개변수 전달 · 로또 ④ 모듈 · 거북이 ⑤ 심화(패키지 · 람다 · 재귀 · 제너레이터).</p>' },
          { layout: 'bullets', title: '이 장에서 만들 프로그램', lead: '함수와 모듈을 배우면 만들 수 있는 두 프로그램',
            bullets: ['<b>[프로그램 1] 로또 번호 추첨</b>', ['1~45 중 겹치지 않는 6개 → 정렬해서 출력', '숫자 하나 뽑기를 <code>getNumber()</code> 함수로'], '<b>[프로그램 2] 글자를 쓰는 거북이 (모듈 버전)</b>', ['입력한 글자를 임의의 위치 · 크기 · 색으로', '도우미 함수를 <code>myTurtle.py</code> 모듈로 분리']],
            notes: '<p><b>[3분]</b> 완성 프로그램을 먼저 보여 주면 동기 부여가 됩니다. 3교시 끝 로또 코드, 4교시 끝 거북이 코드를 미리 실행해 보여 주세요(▶ 실행).</p><p>로또는 실행할 때마다 번호가 다르다는 점, 거북이는 대화상자에 한글 문장을 넣는다는 점을 짚어 둡니다.</p>' },
          { layout: 'bullets', title: '함수란? — 요술 상자', lead: '‘무엇’을 넣으면 ‘어떤 것’을 돌려주는 요술 상자',
            bullets: ['형식: <code>함수명()</code> — 넣을 값은 괄호 안에', '<code>print("CookBook-파이썬")</code>, <code>len("abc")</code>, <code>int("100")</code>', '<b>함수</b>: 독립적으로 존재 — <code>print()</code>', '<b>메서드</b>: 클래스(객체) 안에 존재 — <code>리스트.append()</code>'],
            notes: '<p><b>[3분]</b> 발문: “len 안이 어떻게 만들어져 있는지 아는 사람?” → 몰라도 잘 쓴다. 넣는 것(입력)과 돌려받는 것(출력)만 알면 된다는 게 함수의 힘.</p><p>메서드는 12장 클래스에서 자세히 다루므로 “점(.) 찍고 부르면 메서드” 정도로만 구분합니다.</p>' },
          { layout: 'diagram', title: '커피를 타는 과정 vs 커피 자판기', html: SVG_COFFEE, caption: '그림 9-1 · 9-2 — 자판기(함수)를 한 번 만들어 두면 버튼만 누르면 된다',
            notes: '<p><b>[3분]</b> 위쪽: 직원이 매번 7단계를 직접 → 손님 3명이면 3번. 아래쪽: 자판기에 버튼만.</p><p>비유를 끝까지 유지하세요: <b>자판기 = 함수</b>, <b>버튼 번호 = 매개변수</b>, <b>버튼 누르기 = 호출</b>, <b>나온 커피 = 결과</b>.</p>' },
          { layout: 'code', title: 'Code09-01. 커피를 타는 과정의 코드', stdin: '2\n', code: `coffee = int(input("어떤 커피 드릴까요?(1:보통, 2:설탕, 3:블랙)") )
print()
print("#1. 뜨거운 물을 준비한다.")
print("#2. 종이컵을 준비한다.")
if coffee == 1 :
    print("#3. 보통커피를 탄다.")
elif coffee == 2 :
    print("#3. 설탕커피를 탄다.")
elif coffee == 3 :
    print("#3. 블랙커피를 탄다.")
else :
    print("#3. 아무거나 탄다.\\n")
print("#4. 물을 붓는다.")
print("#5. 스푼으로 젓는다.")
print()
print("손님~ 커피 여기 있습니다.")`,
            points: ['손님 <b>1명</b>분의 코드', '손님이 3명이면 이 코드를 <b>3번 복사</b>?', '수정할 때 3곳을 모두 고쳐야 함'],
            notes: '<p><b>[3분]</b> 실행 후 “손님이 3명이면 어떻게 할까요?” 질문. 대부분 “복사해서 붙여요”라고 답합니다. 그 답을 받아서 문제점을 끌어내세요: 길어짐, 고칠 곳이 여러 군데, 100명이면?</p><p>강의자료 코드에는 줄 끝에 <code>;</code> 가 있는데 파이썬에서는 필요 없다는 점도 짧게 언급(슬라이드 코드에서는 뺐습니다).</p>' },
          { layout: 'code', title: 'Code09-02. 커피 자판기 함수', stdin: '2\n', code: `def coffee_machine(button) :
    print()
    print("#1. (자동으로) 뜨거운 물을 준비한다.")
    print("#2. (자동으로) 종이컵을 준비한다.")
    if button == 1 :
        print("#3. (자동으로) 보통커피를 탄다.")
    elif button == 2 :
        print("#3. (자동으로) 설탕커피를 탄다.")
    elif button == 3 :
        print("#3. (자동으로) 블랙커피를 탄다.")
    else :
        print("#3. (자동으로) 아무거나 탄다.\\n")
    print("#4. (자동으로) 물을 붓는다.")
    print("#5. (자동으로) 스푼으로 젓는다.")
    print()

coffee = int(input("어떤 커피 드릴까요?(1:보통, 2:설탕, 3:블랙)"))
coffee_machine(coffee)
print("손님~ 커피 여기 있습니다.")`,
            points: ['<code>def 함수명(매개변수) :</code> 로 정의', '들여쓴 부분 = 함수 본문 (정의만, 실행 X)', '<code>coffee_machine(coffee)</code> 호출 → 실행', 'coffee 값이 <b>button</b> 으로 들어감'],
            notes: '<p><b>[5분]</b> 실행 흐름을 손가락으로 따라가세요: 1행 def 는 “자판기 설치”만 하고 넘어감 → 17행 input → 18행 호출 시 1행으로 점프 → 본문 실행 → 18행 다음 줄(19행)로 복귀.</p><p>발문: “18행을 지우면?” → 자판기는 설치됐지만 아무도 버튼을 안 누름 → #1~#5 출력 안 됨.</p>' },
          { layout: 'code', title: 'Code09-03. 손님이 여러 명이면 호출만 여러 번', stdin: '2\n3\n', code: `def coffee_machine(button) :
    print()
    print("#1. (자동으로) 뜨거운 물을 준비한다.")
    print("#2. (자동으로) 종이컵을 준비한다.")
    if button == 1 :
        print("#3. (자동으로) 보통커피를 탄다.")
    elif button == 2 :
        print("#3. (자동으로) 설탕커피를 탄다.")
    elif button == 3 :
        print("#3. (자동으로) 블랙커피를 탄다.")
    else :
        print("#3. (자동으로) 아무거나 탄다.\\n")
    print("#4. (자동으로) 물을 붓는다.")
    print("#5. (자동으로) 스푼으로 젓는다.")
    print()

coffee = int(input("A손님, 어떤 커피 드릴까요?(1:보통, 2:설탕, 3:블랙)"))
coffee_machine(coffee)
print("A손님~ 커피 여기 있습니다.")
coffee = int(input("B손님, 어떤 커피 드릴까요?(1:보통, 2:설탕, 3:블랙)"))
coffee_machine(coffee)
print("B손님~ 커피 여기 있습니다.")`,
            points: ['함수 본문은 <b>한 번</b>만 작성', '손님마다 <b>호출만</b> 반복 (C손님도 같은 3줄)', '문구 수정은 함수 안 <b>한 곳</b>만'],
            notes: '<p><b>[3분]</b> 슬라이드에는 A, B 손님만 넣었습니다(강의자료는 C까지). 학생 문서에는 C까지 있는 전체 코드가 있습니다.</p><p>시연: 13행 “물을 붓는다”를 “뜨거운 물을 붓는다”로 바꾸고 다시 실행 → 두 손님 모두 바뀜. 함수의 유지보수 장점을 체감시키세요.</p>' },
          { layout: 'diagram', title: '함수의 형식', html: SVG_FUNCBOX, caption: '매개변수를 받아 → 처리하고 → 반환값을 돌려준다',
            notes: '<p><b>[2분]</b> 형식을 칠판에 적습니다.<br><code>def 함수명(매개변수1, 매개변수2) :<br>&nbsp;&nbsp;&nbsp;&nbsp;실행할 문장<br>&nbsp;&nbsp;&nbsp;&nbsp;return 반환값</code></p><p>용어: 매개변수 = 파라미터, 반환값 = 리턴값. 호출할 때 넣는 실제 값은 인수(argument)라고도 한다는 것을 한 번만 언급.</p>' },
          { layout: 'code', title: 'Code09-04. plus() 함수', code: `## 함수 선언 부분 ##
def plus(v1, v2) :
    result = 0
    result = v1 + v2
    return result

## 전역 변수 선언 부분 ##
hap = 0

## 메인 코드 부분 ##
hap = plus(100, 200)
print("100과 200의 plus() 함수 결과는 %d" % hap)`,
            points: ['100 → <code>v1</code>, 200 → <code>v2</code>', '<code>return result</code> 로 300을 돌려줌', '돌려받은 값이 <code>hap</code> 에 대입'],
            notes: '<p><b>[3분]</b> 강의자료의 코드 구조(전역 변수 선언 → 함수 선언 → 메인 코드) 주석을 계속 쓰는 습관을 들이게 하세요.</p><p>발문: “plus(1.5, 2.5) 는?” (4.0) “plus(\'a\', \'b\') 는?” (\'ab\') — 파이썬 함수는 자료형을 따지지 않고 + 가 되는 값이면 다 된다는 점이 재미있는 포인트입니다.</p>' },
          { layout: 'diagram', title: 'plus() 함수의 호출 순서', html: SVG_PLUS, caption: '① 함수 호출 → ② 함수 실행 → ③ 결과 반환 → ④ 반환값 대입',
            notes: '<p><b>[3분]</b> 번호 순서대로 짚습니다. 특히 ④가 가장 마지막이라는 점: <code>hap = plus(100, 200)</code> 은 오른쪽(함수 호출)이 먼저 끝나야 왼쪽 hap 에 값이 들어갑니다.</p><p>흔한 오해: “hap 이 먼저 만들어지고 함수가 실행된다” → 아님.</p>' },
          { layout: 'code', title: 'Code09-05. 계산기 함수', stdin: '*\n7\n8\n', code: `def calc(v1, v2, op) :
    result = 0
    if op == '+' :
        result = v1 + v2
    elif op == '-' :
        result = v1 - v2
    elif op == '*' :
        result = v1 * v2
    elif op == '/' :
        result = v1 / v2
    return result

oper = input("계산을 입력하세요(+, -, *, /) : ")
var1 = int(input("첫 번째 수를 입력하세요 : "))
var2 = int(input("두 번째 수를 입력하세요 : "))
res = calc(var1, var2, oper)
print("## 계산기 : %d %s %d = %d" % (var1, oper, var2, res))`,
            points: ['매개변수 3개 — <b>순서대로</b> 전달', '<code>op</code> 에 따라 다른 계산', 'Tip: 매개변수는 <b>지역 변수</b>'],
            notes: '<p><b>[4분]</b> 예시 입력(*, 7, 8)으로 실행한 뒤, 학생이 원하는 연산으로 다시 실행해 보게 합니다.</p><p>발문: “/ 를 고르고 두 번째 수에 0을 넣으면?” → ZeroDivisionError. SELF STUDY 9-2 에서 해결할 과제로 넘깁니다.</p><p>Tip 슬라이드 내용: v1, v2, op 는 calc 안에서만 산다 → 다음 교시 예고.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '다음 코드의 실행 결과는?<pre><code>def plus(v1, v2) :\n    result = v1 + v2\n    return result\n\nhap = plus(3, 4)\nprint(hap * 2)</code></pre>', options: ['7', '14', '34', '오류'], answer: 1, explain: 'plus(3, 4) → 7, hap * 2 → 14',
            notes: '<p><b>[2분]</b> 34를 고른 학생이 있다면 문자열 “3”+“4” 와 헷갈린 것. 여기서는 정수이므로 7이라는 점을 확인합니다.</p>' },
          { layout: 'practice', title: 'SELF STUDY 9-2. 계산기 기능 추가', desc: '숫자1 → 연산자 → 숫자2 순서로 입력, <code>**</code> 추가, 0으로 나누면 “0으로는 나누면 안 됩니다.ㅠㅠ” 출력', stdin: '8\n/\n0\n',
            starter: `def calc(v1, v2, op) :
    result = 0
    if op == '+' :
        result = v1 + v2
    elif op == '-' :
        result = v1 - v2
    elif op == '*' :
        result = v1 * v2
    elif op == '/' :
        result = v1 / v2
    # TODO: ** 추가
    return result

# TODO: 입력 순서 변경, 0으로 나누기 처리
`,
            solution: `def calc(v1, v2, op) :
    result = 0
    if op == '+' :
        result = v1 + v2
    elif op == '-' :
        result = v1 - v2
    elif op == '*' :
        result = v1 * v2
    elif op == '/' :
        result = v1 / v2
    elif op == '**' :
        result = v1 ** v2
    return result

var1 = int(input("첫 번째 수를 입력하세요 : "))
oper = input("계산을 입력하세요(+, -, *, /, **) : ")
var2 = int(input("두 번째 수를 입력하세요 : "))
if oper == '/' and var2 == 0 :
    print("0으로는 나누면 안 됩니다.ㅠㅠ")
else :
    res = calc(var1, var2, oper)
    print("## 계산기 : %d %s %d = %d" % (var1, oper, var2, res))
`,
            notes: '<p><b>[5분]</b> 힌트: 0 나누기 검사는 함수 안이 아니라 <b>메인 코드</b>에서 if~else 로 합니다(강의자료 힌트). 정답 실행은 8 / 0 입력으로 메시지가 나오는 경우를 보여 줍니다.</p><p>빨리 끝낸 학생에게는 SELF STUDY 9-1(4명의 손님)을 추가로 풀게 하세요.</p>' },
          { layout: 'summary', title: '정리', bullets: ['함수 = 넣으면 돌려주는 <b>요술 상자</b> (커피 자판기)', '<code>def 함수명(매개변수) :</code> 로 정의, <code>함수명(인수)</code> 로 호출', '정의만으로는 실행 X — <b>호출해야</b> 실행', '호출 순서: 호출 → 실행 → return 으로 반환 → 대입', '매개변수는 순서대로 전달되며 함수 안의 <b>지역 변수</b>'],
            notes: '<p><b>[1분]</b> 다음 시간 예고: “함수 안의 변수와 밖의 변수는 서로 보일까?” — 지역 변수와 전역 변수.</p>' }
        ]
      },
      /* ===================== ch09-2 ===================== */
      {
        id: 'ch09-2',
        title: '지역 변수 · 전역 변수와 함수의 반환값',
        minutes: 50,
        goals: [
          '지역 변수와 전역 변수의 생존 범위를 설명할 수 있다',
          '이름이 같은 지역 변수와 전역 변수가 있을 때 어떤 것이 쓰이는지 예측할 수 있다',
          'global 예약어로 함수 안에서 전역 변수를 바꿀 수 있다',
          '반환값이 있는 함수 · 없는 함수 · 여러 개인 함수를 작성하고, pass 를 사용할 수 있다'
        ],
        flow: [['지역 변수와 전역 변수 개념', 10], ['Code09-06 · NameError · global', 12], ['반환값 있는/없는 함수', 10], ['반환값이 여러 개 · pass', 10], ['퀴즈 · 실습', 8]],
        content: [
          { type: 'h', text: '지역 변수와 전역 변수의 이해' },
          { type: 'p', html: '변수에는 “사는 곳”이 있습니다. <b>지역 변수(local variable)</b>는 <b>함수 안</b>에서 만들어져 그 함수 안에서만 쓸 수 있는 변수이고, <b>전역 변수(global variable)</b>는 <b>함수 밖(메인 코드)</b>에서 만들어져 프로그램 전체에서 쓸 수 있는 변수입니다.' },
          { type: 'figure', html: SVG_SCOPE, caption: '그림 9-6 지역 변수와 전역 변수의 생존 범위' },
          { type: 'p', html: '비유하자면 지역 변수는 “우리 반 교실 칠판에 쓴 내용”이라서 다른 반(다른 함수)에서는 볼 수 없고, 전역 변수는 “학교 전체 게시판”이라서 모든 반에서 볼 수 있습니다. 함수가 끝나면 그 함수의 지역 변수는 지워집니다. 칠판을 지우는 것처럼요.' },
          { type: 'p', html: '그렇다면 <b>이름이 같은</b> 지역 변수와 전역 변수가 함께 있으면 어떻게 될까요? 함수 안에서는 <b>지역 변수가 먼저</b> 쓰입니다. 그 함수 안에 해당 이름의 지역 변수가 없을 때만 전역 변수를 찾아갑니다.' },
          { type: 'figure', html: SVG_SHADOW, caption: '그림 9-7 지역 변수와 전역 변수의 공존' },
          { type: 'code', title: 'Code09-06. 지역 변수와 전역 변수', code: `## 함수 선언 부분 ##
def func1() :
    a = 10    # 지역 변수
    print("func1()에서 a값 %d" % a)

def func2() :
    print("func2()에서 a값 %d" % a)

## 전역 변수 선언 부분 ##
a = 20        # 전역 변수

## 메인 코드 부분 ##
func1()
func2()`,
            expect: 'func1()에서 a값 10\nfunc2()에서 a값 20',
            desc: '<code>func1()</code> 안에는 지역 변수 <code>a</code>(10)가 있으므로 그것을 출력합니다. <code>func2()</code> 안에는 <code>a</code> 가 없으므로 전역 변수 <code>a</code>(20)를 찾아 출력합니다. <code>func1()</code> 의 <code>a = 10</code> 은 전역 변수 <code>a</code> 를 바꾸지 <b>않습니다</b> — 이름만 같은 별개의 변수입니다.' },
          { type: 'p', html: '만약 <code>10행</code>의 전역 변수가 없다면 <code>7행</code>은 어떻게 될까요? <code>func2()</code> 안에도, 밖에도 <code>a</code> 가 없으니 오류가 납니다. 직접 확인해 봅시다(<code>10행</code>을 주석으로 바꿨습니다).' },
          { type: 'code', title: 'Code09-06 변형. 10행의 전역 변수가 없다면?', expectError: true, code: `## 함수 선언 부분 ##
def func1() :
    a = 10    # 지역 변수
    print("func1()에서 a값 %d" % a)

def func2() :
    print("func2()에서 a값 %d" % a)

## 전역 변수 선언 부분 ##
# a = 20      # 전역 변수를 없앰

## 메인 코드 부분 ##
func1()
func2()`,
            desc: '실행하면 <code>func1()에서 a값 10</code> 이 출력된 뒤 <code>Traceback … File "main.py", line 7, in func2 … NameError: name \'a\' is not defined</code> 오류가 납니다. traceback 은 아래에서 위로 읽습니다. 마지막 줄 <code>NameError: name \'a\' is not defined</code> 는 “a 라는 이름을 모른다”는 뜻이고, 바로 위의 <code>line 7, in func2</code> 가 오류가 난 위치입니다. <code>func1()</code> 의 지역 변수 <code>a</code> 는 <code>func1()</code> 이 끝나면서 이미 사라졌습니다.' },
          { type: 'h', text: 'global 예약어' },
          { type: 'p', html: '함수 안에서 전역 변수의 값을 <b>바꾸고</b> 싶다면 어떻게 할까요? 함수 안에서 <code>a = 10</code> 이라고 쓰면 파이썬은 새 지역 변수를 만들어 버립니다. 이때 <code>global a</code> 라고 먼저 선언하면 “이 함수 안에서 <code>a</code> 는 전역 변수 <code>a</code> 를 말한다”는 뜻이 됩니다.' },
          { type: 'code', title: 'Code09-07. global 예약어', code: `## 함수 선언 부분 ##
def func1() :
    global a  # 이 함수 안에서 a는 전역 변수
    a = 10
    print("func1()에서 a값 %d" % a)

def func2() :
    print("func2()에서 a값 %d" % a)

## 전역 변수 선언 부분 ##
a = 20        # 전역 변수

## 메인 코드 부분 ##
func1()
func2()`,
            expect: 'func1()에서 a값 10\nfunc2()에서 a값 10',
            desc: '<code>3행</code>의 <code>global a</code> 때문에 <code>4행</code>은 전역 변수 <code>a</code> 를 10으로 바꿉니다. 그래서 <code>func2()</code> 에서도 10이 출력됩니다. (강의자료 10행의 주석 “함수 변수 선언 부분”은 “전역 변수 선언 부분”의 오타라서 바로잡았습니다.)' },
          { type: 'callout', kind: 'more', title: '📘 읽기는 되는데 바꾸기는 안 된다? — UnboundLocalError', html: '<code>global</code> 없이도 전역 변수를 <b>읽기</b>는 할 수 있습니다(Code09-06 의 func2). 하지만 함수 안에서 그 변수에 <b>값을 대입</b>하는 문장이 하나라도 있으면, 파이썬은 그 이름을 함수 전체에서 <b>지역 변수</b>로 취급합니다. 그래서 아래처럼 <code>count = count + 1</code> 을 하면 “아직 값이 없는 지역 변수를 읽었다”는 오류가 납니다. 이럴 때 <code>global count</code> 가 필요합니다.' },
          { type: 'code', title: '추가 예제. global 없이 전역 변수를 바꾸려고 하면?', expectError: true, code: `count = 0

def visit() :
    count = count + 1     # 대입이 있으므로 count 는 지역 변수로 취급됨
    print("방문자 수 :", count)

visit()`,
            expect: 'Traceback (most recent call last):\n  File "main.py", line 7, in <module>\n    visit()\n    ~~~~~^^\n  File "main.py", line 4, in visit\n    count = count + 1     # 대입이 있으므로 count 는 지역 변수로 취급됨\n            ^^^^^\nUnboundLocalError: cannot access local variable \'count\' where it is not associated with a value',
            desc: '<code>3행</code> 바로 아래에 <code>global count</code> 를 넣으면 정상적으로 “방문자 수 : 1” 이 출력됩니다. 실습 9-2 에서 직접 고쳐 보세요.' },
          { type: 'callout', kind: 'tip', title: '전역 변수는 꼭 필요할 때만', html: '어느 함수에서나 전역 변수를 바꿀 수 있으면, 값이 이상해졌을 때 <b>어디서 바뀌었는지 찾기 어렵습니다</b>. 가능하면 필요한 값은 <b>매개변수로 받고</b>, 결과는 <b>return 으로 돌려주는</b> 방식으로 함수를 만드는 것이 좋습니다.' },
          { type: 'h', text: '함수의 반환값' },
          { type: 'p', html: '함수가 일을 마친 뒤 호출한 곳으로 돌려주는 값을 <b>반환값</b>이라고 합니다. <code>return</code> 문으로 돌려주므로 <b>리턴값</b>이라고도 합니다. (매개변수는 <b>파라미터</b>라고도 합니다.) 함수는 반환값이 있는 함수와 없는 함수로 나눌 수 있습니다.' },
          { type: 'figure', html: SVG_RETURN, caption: '그림 9-8 · 9-9 값의 반환 — 반환값이 있는 함수와 없는 함수의 작동' },
          { type: 'code', title: 'Code09-08. 반환값이 있는 함수와 없는 함수', code: `## 함수 선언 부분 ##
def func1() :
    result = 100
    return result

def func2() :
    print("반환값이 없는 함수 실행")

## 전역 변수 선언 부분 ##
hap = 0

## 메인 코드 부분 ##
hap = func1()
print("func1()에서 돌려준 값 ==> %d" % hap)
func2()`,
            expect: 'func1()에서 돌려준 값 ==> 100\n반환값이 없는 함수 실행',
            desc: '<code>func1()</code> 은 <code>return</code> 으로 100을 돌려주므로 <code>hap = func1()</code> 처럼 결과를 받아 씁니다. <code>func2()</code> 는 출력만 하고 돌려주는 값이 없으므로 <code>func2()</code> 처럼 호출만 합니다.' },
          { type: 'callout', kind: 'more', title: '📘 반환값이 없는 함수는 사실 None 을 돌려준다', html: '<code>return</code> 이 없는 함수도 끝나면 <b><code>None</code></b>(값이 없음을 뜻하는 특별한 값)을 돌려줍니다. <code>return</code> 을 만나면 그 뒤의 코드는 실행하지 않고 <b>즉시 함수를 끝낸다</b>는 점도 기억하세요.' },
          { type: 'code', title: '추가 예제. None 과 return 의 즉시 종료', code: `def func2() :
    print("반환값이 없는 함수 실행")

def check(num) :
    if num < 0 :
        return "음수"
    return "0 또는 양수"
    print("이 줄은 절대 실행되지 않음")

result = func2()
print("func2()가 돌려준 값 :", result)
print(check(-5))
print(check(7))`,
            expect: '반환값이 없는 함수 실행\nfunc2()가 돌려준 값 : None\n음수\n0 또는 양수',
            desc: '<code>check(-5)</code> 는 <code>6행</code>에서 바로 돌아가므로 <code>7행</code>은 실행되지 않습니다. <code>8행</code>은 어떤 경우에도 <code>return</code> 뒤라서 실행될 수 없는 코드입니다.' },
          { type: 'h', text: '반환값이 여러 개인 함수' },
          { type: 'p', html: '<code>return</code> 으로 돌려줄 수 있는 값은 원칙적으로 <b>하나</b>입니다. 그래서 여러 값을 돌려주고 싶으면 <b>리스트</b>에 담아서 리스트 하나를 돌려주면 됩니다.' },
          { type: 'code', title: 'Code09-09. 반환값이 여러 개인 함수', code: `## 함수 선언 부분 ##
def multi(v1, v2) :
    retList = []      # 반환할 리스트
    res1 = v1 + v2
    res2 = v1 - v2
    retList.append(res1)
    retList.append(res2)
    return retList

## 전역 변수 선언 부분 ##
myList = []
hap, sub = 0, 0

## 메인 코드 부분 ##
myList = multi(100, 200)
hap = myList[0]
sub = myList[1]
print("multi()에서 돌려준 값 ==> %d, %d" % (hap, sub))`,
            expect: 'multi()에서 돌려준 값 ==> 300, -100',
            desc: '<code>multi()</code> 는 덧셈 결과와 뺄셈 결과를 리스트 <code>[300, -100]</code> 에 담아 돌려줍니다. 메인 코드에서는 첨자 <code>[0]</code>, <code>[1]</code> 로 꺼내 씁니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 파이썬다운 방법: 튜플로 돌려주고 한 번에 받기', html: '<code>return res1, res2</code> 처럼 쉼표로 여러 값을 쓰면 파이썬이 자동으로 <b>튜플</b> <code>(300, -100)</code> 로 묶어 돌려줍니다. 받는 쪽에서도 <code>hap, sub = multi(100, 200)</code> 처럼 한 번에 나눠 받을 수 있습니다(언패킹). 4교시 [프로그램 2]의 <code>getRGB()</code> 가 이 방식을 씁니다.' },
          { type: 'code', title: '추가 예제. 튜플로 여러 값 돌려주기', code: `def multi(v1, v2) :
    return v1 + v2, v1 - v2

hap, sub = multi(100, 200)
print("multi()에서 돌려준 값 ==> %d, %d" % (hap, sub))
print(multi(10, 3))`,
            expect: 'multi()에서 돌려준 값 ==> 300, -100\n(13, 7)' },
          { type: 'h', text: 'pass 예약어' },
          { type: 'p', html: '함수의 이름만 먼저 정해 두고 내용은 나중에 채우고 싶을 때가 있습니다. 그런데 파이썬은 <code>def</code> · <code>if</code> · <code>for</code> 다음에 <b>들여쓴 문장이 최소 한 줄</b>은 있어야 합니다. 이럴 때 “아무것도 하지 않는다”는 뜻의 <b><code>pass</code></b> 를 넣어 자리를 채웁니다.' },
          { type: 'code', title: 'pass 예약어로 빈 함수 만들기', code: `def myFunc() :
    pass

myFunc()
print("myFunc()는 아무 일도 하지 않고 끝났습니다.")`,
            expect: 'myFunc()는 아무 일도 하지 않고 끝났습니다.' },
          { type: 'p', html: '<code>if</code> 문에서 “True 일 때는 할 일이 없다”고 빈 줄로 두면 오류가 납니다.' },
          { type: 'code', title: 'True 일 때 할 일이 없다고 빈 줄로 두면 오류', expectError: true, code: `if True :

else :
    print('거짓이네요')`,
            expect: '  File "main.py", line 3\n    else :\n    ^^^^\nIndentationError: expected an indented block after \'if\' statement on line 1',
            desc: '“1행의 if 문 뒤에 들여쓴 블록이 와야 한다”는 <code>IndentationError</code> 입니다. 문법 오류라서 프로그램이 아예 시작되지 않습니다.' },
          { type: 'code', title: '오류 해결: pass 넣기', code: `if True :
    pass
else :
    print('거짓이네요')`,
            desc: '조건이 True 이므로 <code>pass</code> 가 실행되고(아무 일도 안 함) 출력 없이 끝납니다.' }
        ],
        practice: [
          {
            title: '실습 9-2. 방문자 수 세기 (global)',
            level: 1,
            desc: '<p>전역 변수 <code>count</code> 를 1씩 늘리는 <code>visit()</code> 함수를 만들어 3번 호출하세요. 앞의 “추가 예제”처럼 <code>UnboundLocalError</code> 가 나지 않도록 <code>global</code> 을 사용합니다.</p><pre><code>방문자 수 : 1\n방문자 수 : 2\n방문자 수 : 3</code></pre>',
            hint: '함수의 첫 줄에 <code>global count</code> 를 씁니다.',
            starter: `count = 0

def visit() :
    # TODO: 전역 변수 count 를 1 늘리고 출력
    pass

visit()
visit()
visit()
`,
            solution: `count = 0

def visit() :
    global count
    count = count + 1
    print("방문자 수 :", count)

visit()
visit()
visit()
`,
            expect: '방문자 수 : 1\n방문자 수 : 2\n방문자 수 : 3'
          },
          {
            title: '실습 9-3. 최댓값과 최솟값 함께 돌려주기',
            level: 2,
            desc: '<p>리스트를 매개변수로 받아 <b>최댓값과 최솟값을 리스트에 담아</b> 돌려주는 <code>getMaxMin(numList)</code> 함수를 만드세요. (<code>max()</code>, <code>min()</code> 함수를 쓰지 말고 <code>for</code> 문으로 직접 찾아 보세요.)</p><pre><code>최댓값 ==> 91, 최솟값 ==> 7</code></pre>',
            hint: '첫 번째 요소를 최댓값 · 최솟값의 처음 값으로 정하고, 나머지 요소와 비교하며 바꿉니다. 마지막에 <code>return [maxV, minV]</code>.',
            starter: `## 함수 선언 부분 ##
def getMaxMin(numList) :
    retList = []
    # TODO: 최댓값, 최솟값 찾기
    return retList

## 메인 코드 부분 ##
myList = getMaxMin([23, 7, 55, 91, 42])
# TODO: 결과 출력
`,
            solution: `## 함수 선언 부분 ##
def getMaxMin(numList) :
    retList = []
    maxV = numList[0]
    minV = numList[0]
    for num in numList :
        if num > maxV :
            maxV = num
        if num < minV :
            minV = num
    retList.append(maxV)
    retList.append(minV)
    return retList

## 메인 코드 부분 ##
myList = getMaxMin([23, 7, 55, 91, 42])
print("최댓값 ==> %d, 최솟값 ==> %d" % (myList[0], myList[1]))
`,
            expect: '최댓값 ==> 91, 최솟값 ==> 7'
          }
        ],
        quiz: [
          { q: '다음 코드의 실행 결과는?<pre><code>def func1() :\n    a = 10\n    print(a, end=" ")\n\na = 20\nfunc1()\nprint(a)</code></pre>', options: ['10 10', '10 20', '20 20', '20 10'], answer: 1, explain: '<code>func1()</code> 의 <code>a = 10</code> 은 지역 변수라서 전역 변수 <code>a</code>(20)에 영향을 주지 않습니다.' },
          { q: '위 코드의 <code>func1()</code> 첫 줄에 <code>global a</code> 를 추가하면 실행 결과는?', options: ['10 10', '10 20', '20 20', '오류'], answer: 0, explain: '<code>global a</code> 때문에 함수 안의 <code>a = 10</code> 이 전역 변수를 10으로 바꿉니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>def func() :\n    print("실행")\n\nr = func()\nprint(r)</code></pre>', options: ['실행', '실행 다음 줄에 None', 'None', '오류'], answer: 1, explain: '함수가 실행되며 “실행”이 출력되고, return 이 없으므로 <code>r</code> 에는 <code>None</code> 이 들어갑니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>def multi(v1, v2) :\n    return [v1 + v2, v1 - v2]\n\nmyList = multi(5, 3)\nprint(myList[1])</code></pre>', options: ['8', '2', '[8, 2]', '5'], answer: 1, explain: '돌려준 리스트는 <code>[8, 2]</code> 이고, 첨자 1은 두 번째 요소 2입니다.' },
          { q: '<code>pass</code> 에 대한 설명으로 옳은 것은?', options: ['함수를 즉시 끝내고 값을 돌려준다', '반복문을 빠져나간다', '아무 일도 하지 않고 문법상 빈자리를 채운다', '다음 반복으로 건너뛴다'], answer: 2, explain: '<code>pass</code> 는 아무 동작도 하지 않습니다. 들여쓴 블록이 반드시 필요한 곳에 자리만 채울 때 씁니다.' }
        ],
        slides: [
          { layout: 'title', title: '지역 변수 · 전역 변수와 반환값', subtitle: 'Chapter 09 · Section 03~04', badge: '09-2',
            notes: '<p><b>[도입 1분]</b> 지난 시간 Tip 복습: “calc() 의 매개변수 v1 을 메인 코드에서 print 하면?” → 오류. 왜 그런지가 오늘의 주제입니다.</p>' },
          { layout: 'diagram', title: '지역 변수와 전역 변수의 생존 범위', html: SVG_SCOPE, caption: '지역 변수: 한정된 지역(함수)에서만 / 전역 변수: 프로그램 전체에서',
            notes: '<p><b>[4분]</b> 비유: 지역 변수 = 우리 반 칠판(다른 반은 못 봄, 수업 끝나면 지움), 전역 변수 = 학교 게시판(모두 봄).</p><p>발문: “함수 1이 끝나면 a는 어떻게 될까?” → 사라진다.</p>' },
          { layout: 'diagram', title: '이름이 같으면? — 지역 변수가 우선', html: SVG_SHADOW, caption: '그림 9-7 지역 변수와 전역 변수의 공존',
            notes: '<p><b>[3분]</b> 함수 안에서 이름을 찾는 순서: <b>① 자기 함수 안(지역) → ② 함수 밖(전역) → ③ 파이썬 내장(print 등)</b>. 없으면 NameError.</p><p>교사 참고: 이를 LEGB 규칙이라 부르며 E(Enclosing)는 5교시 내부 함수에서 다시 나옵니다.</p>' },
          { layout: 'code', title: 'Code09-06. 지역 변수와 전역 변수', code: `## 함수 선언 부분 ##
def func1() :
    a = 10    # 지역 변수
    print("func1()에서 a값 %d" % a)

def func2() :
    print("func2()에서 a값 %d" % a)

## 전역 변수 선언 부분 ##
a = 20        # 전역 변수

## 메인 코드 부분 ##
func1()
func2()`,
            points: ['func1: 지역 <code>a</code> → 10', 'func2: 지역 a 없음 → 전역 <code>a</code> → 20', '10행을 지우면? → <b>NameError</b>'],
            notes: '<p><b>[4분]</b> 실행 전에 결과를 예측시킵니다. 이어서 10행 앞에 # 을 붙여 실행 → NameError 를 함께 읽습니다. traceback 은 <b>아래에서 위로</b> 읽는 습관을 들이게 하세요: 마지막 줄 = 오류 종류, 그 위 = 위치.</p>' },
          { layout: 'code', title: 'Code09-07. global 예약어', code: `## 함수 선언 부분 ##
def func1() :
    global a  # 이 함수 안에서 a는 전역 변수
    a = 10
    print("func1()에서 a값 %d" % a)

def func2() :
    print("func2()에서 a값 %d" % a)

## 전역 변수 선언 부분 ##
a = 20        # 전역 변수

## 메인 코드 부분 ##
func1()
func2()`,
            points: ['<code>global a</code> → 함수 안의 a 가 <b>전역 a</b>', 'func1 이 전역 a 를 10으로 변경', '그래서 func2 도 10 출력'],
            notes: '<p><b>[4분]</b> 3행을 지우고 실행(10, 20) → 다시 넣고 실행(10, 10)해서 차이를 비교합니다.</p><p>주의: 전역 변수를 여러 함수에서 마구 바꾸면 버그 찾기가 어렵다 → 매개변수와 return 을 우선 쓰도록 안내. UnboundLocalError 예제(학생 문서)를 시간 있으면 보여 주세요.</p>' },
          { layout: 'diagram', title: '함수의 반환값', html: SVG_RETURN, caption: '반환값(리턴값)은 return 문으로 돌려준다',
            notes: '<p><b>[3분]</b> 왼쪽: 호출 → 실행 → 100 반환 → hap 에 대입. 오른쪽: 호출 → 실행 → 돌려줄 값 없이 종료.</p><p>“반환값이 없는 함수도 사실 None 을 돌려준다”는 보충 내용을 짧게 언급합니다.</p>' },
          { layout: 'code', title: 'Code09-08. 반환값이 있는/없는 함수', code: `## 함수 선언 부분 ##
def func1() :
    result = 100
    return result

def func2() :
    print("반환값이 없는 함수 실행")

## 전역 변수 선언 부분 ##
hap = 0

## 메인 코드 부분 ##
hap = func1()
print("func1()에서 돌려준 값 ==> %d" % hap)
func2()`,
            points: ['반환값 있음 → <code>hap = func1()</code> 로 받아 씀', '반환값 없음 → <code>func2()</code> 호출만', '<code>print(func2())</code> 를 하면? → None'],
            notes: '<p><b>[3분]</b> 마지막 줄을 <code>print(func2())</code> 로 바꿔 실행해 None 이 찍히는 것을 보여 주세요. “출력(print)과 반환(return)은 다르다”는 점을 강조합니다 — 초보자가 가장 많이 헷갈리는 부분입니다.</p>' },
          { layout: 'code', title: 'Code09-09. 반환값이 여러 개인 함수', code: `## 함수 선언 부분 ##
def multi(v1, v2) :
    retList = []      # 반환할 리스트
    res1 = v1 + v2
    res2 = v1 - v2
    retList.append(res1)
    retList.append(res2)
    return retList

## 전역 변수 선언 부분 ##
myList = []
hap, sub = 0, 0

## 메인 코드 부분 ##
myList = multi(100, 200)
hap = myList[0]
sub = myList[1]
print("multi()에서 돌려준 값 ==> %d, %d" % (hap, sub))`,
            points: ['여러 값은 <b>리스트에 담아</b> 하나로 반환', '받은 쪽에서 <code>[0]</code>, <code>[1]</code> 로 꺼냄', '보충: <code>return a, b</code> → 튜플'],
            notes: '<p><b>[3분]</b> 보충으로 <code>return res1, res2</code> / <code>hap, sub = multi(100, 200)</code> 형태를 칠판에 적어 줍니다. 4교시 getRGB() 가 이 방식이라 미리 알려 두면 좋습니다.</p>' },
          { layout: 'two', title: 'pass 예약어',
            left: { title: '빈 줄로 두면 오류 ✘', code: `if True :\n\nelse :\n    print('거짓이네요')`, run: false },
            right: { title: 'pass 로 자리 채우기 ✔', code: `def myFunc() :\n    pass\n\nif True :\n    pass\nelse :\n    print('거짓이네요')` },
            notes: '<p><b>[2분]</b> 왼쪽은 IndentationError(학생 문서에 실제 오류 메시지 있음). 파이썬은 콜론(:) 다음에 들여쓴 문장이 최소 한 줄 필요합니다.</p><p>활용: 함수 이름부터 설계해 두고 내용은 나중에 채울 때 “할 일 표시”로 씁니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '실행 결과는?<pre><code>def func1() :\n    a = 10\n    print(a, end=" ")\n\na = 20\nfunc1()\nprint(a)</code></pre>', options: ['10 10', '10 20', '20 20', '20 10'], answer: 1, explain: '함수 안의 a 는 지역 변수이므로 전역 a(20)는 그대로입니다.',
            notes: '<p><b>[2분]</b> 정답 후 “global a 를 넣으면?” 으로 이어서 물어봅니다(10 10).</p>' },
          { layout: 'practice', title: '실습 9-2. 방문자 수 세기', desc: '전역 변수 <code>count</code> 를 1씩 늘리는 <code>visit()</code> 를 3번 호출해 “방문자 수 : 1~3” 출력',
            starter: `count = 0

def visit() :
    # TODO
    pass

visit()
visit()
visit()
`,
            solution: `count = 0

def visit() :
    global count
    count = count + 1
    print("방문자 수 :", count)

visit()
visit()
visit()
`,
            notes: '<p><b>[4분]</b> 먼저 global 없이 작성해 UnboundLocalError 를 겪어 보게 한 뒤 global 을 넣어 해결하게 하면 기억에 오래 남습니다.</p>' },
          { layout: 'summary', title: '정리', bullets: ['지역 변수: 함수 안에서만 / 전역 변수: 프로그램 전체', '이름이 같으면 함수 안에서는 <b>지역 변수 우선</b>', '<code>global 변수</code> → 함수 안에서 전역 변수 변경', '<code>return</code> 으로 값 반환 (없으면 None), 여러 값은 리스트 · 튜플로', '<code>pass</code> = 아무것도 안 함 (빈자리 채우기)'],
            notes: '<p><b>[1분]</b> 다음 시간: 매개변수를 전달하는 여러 가지 방법(기본값, 개수 제한 없음, 키=값)과 [프로그램 1] 로또.</p>' }
        ]
      },
      /* ===================== ch09-3 ===================== */
      {
        id: 'ch09-3',
        title: '매개변수 전달 방법과 [프로그램 1] 로또 번호 추첨',
        minutes: 50,
        goals: [
          '매개변수의 개수를 지정한 함수와 기본값을 가진 매개변수를 사용할 수 있다',
          '*para 로 개수가 정해지지 않은 매개변수를 받을 수 있다',
          '**para 로 키=값 형식의 매개변수를 딕셔너리로 받을 수 있다',
          '정수와 리스트를 함수에 넘길 때의 차이를 설명할 수 있다',
          '함수를 이용해 로또 번호 추첨 프로그램을 완성할 수 있다'
        ],
        flow: [['개수를 지정한 전달 · 기본값', 10], ['*para · **para', 12], ['여기서 잠깐: 값/참조 전달', 8], ['[프로그램 1] 로또 완성', 12], ['퀴즈 · 실습', 8]],
        content: [
          { type: 'h', text: '매개변수의 개수를 지정해 전달하는 방법' },
          { type: 'p', html: '지금까지 만든 함수는 모두 매개변수의 개수가 정해져 있었습니다. 숫자 2개의 합과 숫자 3개의 합을 구하려면, 매개변수가 2개인 함수와 3개인 함수를 <b>각각</b> 만들어야 합니다.' },
          { type: 'code', title: 'Code09-10. 매개변수가 2개인 함수와 3개인 함수', code: `## 함수 선언 부분 ##
def para2_func( v1, v2 ) :
    result = 0
    result = v1 + v2
    return result

def para3_func( v1, v2, v3 ) :
    result = 0
    result = v1 + v2 + v3
    return result

## 전역 변수 선언 부분 ##
hap = 0

## 메인 코드 부분 ##
hap = para2_func(10, 20)
print("매개변수가 2개인 함수를 호출한 결과 ==> %d" % hap)
hap = para3_func(10, 20, 30)
print("매개변수가 3개인 함수를 호출한 결과 ==> %d" % hap)`,
            expect: '매개변수가 2개인 함수를 호출한 결과 ==> 30\n매개변수가 3개인 함수를 호출한 결과 ==> 60',
            desc: '하는 일은 거의 같은데 함수가 두 개입니다. 숫자 4개, 5개의 합이 필요해지면 함수를 계속 새로 만들어야 할까요? 아래에서 더 좋은 방법을 알아봅니다.' },
          { type: 'callout', kind: 'warn', title: '매개변수 개수가 맞지 않으면 TypeError', html: '매개변수가 2개인 함수에 값을 1개만 넣거나 3개를 넣으면 오류가 납니다. 오류 메시지가 “무엇이 빠졌는지”를 친절하게 알려 줍니다.' },
          { type: 'code', title: '추가 예제. 매개변수를 하나 빠뜨리면?', expectError: true, code: `def para2_func( v1, v2 ) :
    return v1 + v2

hap = para2_func(10)
print(hap)`,
            expect: 'Traceback (most recent call last):\n  File "main.py", line 4, in <module>\n    hap = para2_func(10)\nTypeError: para2_func() missing 1 required positional argument: \'v2\'',
            desc: '“para2_func() 에 꼭 필요한 위치 매개변수 <code>v2</code> 1개가 빠졌다”는 뜻입니다.' },
          { type: 'h', text: '매개변수에 기본값을 설정해 놓고 전달하는 방법' },
          { type: 'p', html: '매개변수 이름 뒤에 <code>= 값</code> 을 써 두면 그 매개변수의 <b>기본값(default value)</b>이 됩니다. 호출할 때 그 자리의 값을 넘기지 않으면 기본값이 쓰이고, 넘기면 넘긴 값이 쓰입니다. 그러면 함수 하나로 2개의 합과 3개의 합을 모두 구할 수 있습니다.' },
          { type: 'code', title: 'Code09-11. 매개변수에 기본값 설정하기', code: `## 함수 선언 부분 ##
def para_func( v1, v2, v3 = 0 ) :
    result = 0
    result = v1 + v2 + v3
    return result

## 전역 변수 선언 부분 ##
hap = 0

## 메인 코드 부분 ##
hap = para_func(10, 20)
print("매개변수가 2개인 함수를 호출한 결과 ==> %d" % hap)
hap = para_func(10, 20, 30)
print("매개변수가 3개인 함수를 호출한 결과 ==> %d" % hap)`,
            expect: '매개변수가 2개인 함수를 호출한 결과 ==> 30\n매개변수가 3개인 함수를 호출한 결과 ==> 60',
            desc: '<code>11행</code>은 값을 2개만 넘겼으므로 <code>v3</code> 는 기본값 0이 되어 10 + 20 + 0 = 30 입니다. <code>13행</code>은 3개를 넘겼으므로 <code>v3</code> 에 30이 들어가 60 입니다.' },
          { type: 'callout', kind: 'warn', title: '기본값이 있는 매개변수는 뒤쪽에', html: '기본값이 <b>없는</b> 매개변수가 기본값이 <b>있는</b> 매개변수보다 뒤에 올 수 없습니다. 값이 순서대로 채워지기 때문에, 앞쪽이 비어 있으면 어느 자리를 건너뛴 것인지 알 수 없기 때문입니다.' },
          { type: 'code', title: '추가 예제. 기본값 매개변수를 앞에 두면?', expectError: true, code: `def para_func( v1 = 0, v2, v3 ) :
    return v1 + v2 + v3

print(para_func(10, 20))`,
            expect: '  File "main.py", line 1\n    def para_func( v1 = 0, v2, v3 ) :\n                           ^^\nSyntaxError: parameter without a default follows parameter with a default' },
          { type: 'callout', kind: 'more', title: '📘 키워드 인수 — 이름을 붙여서 넘기기', html: '호출할 때 <code>매개변수이름=값</code> 형태로 넘기면 <b>순서와 상관없이</b> 원하는 매개변수에 값을 넣을 수 있습니다. 이미 써 본 <code>print("A", end = \'\')</code> 의 <code>end=\'\'</code> 가 바로 키워드 인수입니다. 기본값과 함께 쓰면, 중간 매개변수는 기본값으로 두고 원하는 것만 바꿀 수 있습니다.' },
          { type: 'code', title: '추가 예제. 키워드 인수로 호출하기', code: `def order(menu, size = "보통", ice = False) :
    print("%s / 크기 : %s / 얼음 : %s" % (menu, size, ice))

order("아메리카노")
order("카페라떼", "큰 컵")
order("에스프레소", ice = True)
order(ice = True, size = "작은 컵", menu = "카푸치노")`,
            expect: '아메리카노 / 크기 : 보통 / 얼음 : False\n카페라떼 / 크기 : 큰 컵 / 얼음 : False\n에스프레소 / 크기 : 보통 / 얼음 : True\n카푸치노 / 크기 : 작은 컵 / 얼음 : True',
            desc: '<code>6행</code>은 <code>size</code> 를 건너뛰고 <code>ice</code> 만 바꿨습니다. <code>7행</code>처럼 모두 이름을 붙이면 순서를 마음대로 바꿔도 됩니다.' },
          { type: 'h', text: '매개변수의 개수를 지정하지 않고 전달하는 방법' },
          { type: 'p', html: '합을 구할 숫자가 2개일지 10개일지 미리 알 수 없다면, 매개변수 이름 앞에 <b>별표 <code>*</code></b> 를 붙입니다. 그러면 넘겨준 값이 몇 개든 모두 <b>튜플</b> 하나로 묶여 들어옵니다. 이런 매개변수를 <b>가변 매개변수</b>라고 합니다.' },
          { type: 'code', title: 'Code09-12. 개수를 지정하지 않는 매개변수 (*para)', code: `## 함수 선언 부분 ##
def para_func (*para) :
    result = 0
    for num in para :
        result = result + num

    return result

## 전역 변수 선언 부분 ##
hap = 0

## 메인 코드 부분 ##
hap = para_func(10, 20)
print("매개변수가 2개인 함수를 호출한 결과 ==> %d" % hap)
hap = para_func(10, 20, 30)
print("매개변수가 3개인 함수를 호출한 결과 ==> %d" % hap)`,
            expect: '매개변수가 2개인 함수를 호출한 결과 ==> 30\n매개변수가 3개인 함수를 호출한 결과 ==> 60',
            desc: '<code>para_func(10, 20, 30)</code> 을 호출하면 <code>para</code> 에는 튜플 <code>(10, 20, 30)</code> 이 들어가고, <code>4~5행</code>의 <code>for</code> 문이 요소를 하나씩 꺼내 더합니다.' },
          { type: 'table', head: ['반복', 'num', 'result = result + num', 'result'], rows: [
            ['1회', '10', 'result = 0 + 10', '10'],
            ['2회', '20', 'result = 10 + 20', '30'],
            ['3회', '30', 'result = 30 + 30', '60']
          ], caption: '(10, 20, 30)을 매개변수로 받았을 때 4~5행의 반복' },
          { type: 'p', html: '매개변수가 10개 이상이어도 함수를 전혀 고칠 필요가 없습니다.' },
          { type: 'code', title: '매개변수가 10개일 때', code: `def para_func (*para) :
    result = 0
    for num in para :
        result = result + num
    return result

hap = para_func(10, 20, 30, 40, 50, 60, 70, 80, 90, 100)
print(hap)`,
            expect: '550' },
          { type: 'callout', kind: 'more', title: '📘 *para 의 정체는 튜플', html: '함수 안에서 <code>print(para)</code> 를 해 보면 <code>(10, 20, 30)</code> 처럼 괄호로 싸인 튜플이 보입니다. 그래서 <code>len(para)</code> 로 몇 개가 들어왔는지 알 수 있고, <code>para[0]</code> 으로 첫 번째 값을 꺼낼 수도 있습니다. 파이썬 공식 문서에서는 이런 매개변수를 관례적으로 <code>*args</code> 라고 이름 붙입니다. 사실 이미 써 본 <code>print()</code> 도 <code>print(1, 2, 3, 4)</code> 처럼 개수 제한 없이 값을 받는 가변 매개변수 함수입니다.' },
          { type: 'h', text: '딕셔너리 형식의 매개변수 (**para)' },
          { type: 'p', html: '별표를 <b>두 개</b> 붙인 <code>**para</code> 는 함수를 호출할 때 <code>키 = 값</code> 형식으로 넘긴 매개변수들을 <b>딕셔너리</b>로 받습니다.' },
          { type: 'code', title: '딕셔너리 형식의 매개변수 (**para)', code: `def dic_func(**para) :
    for k in para.keys() :
        print("%s  --> %d명입니다." % (k, para[k]))

dic_func(트와이스 = 9, 소녀시대 = 7, 걸스데이 = 4, 블랙핑크 = 4)`,
            expect: '트와이스  --> 9명입니다.\n소녀시대  --> 7명입니다.\n걸스데이  --> 4명입니다.\n블랙핑크  --> 4명입니다.',
            desc: '<code>para</code> 에는 <code>{\'트와이스\': 9, \'소녀시대\': 7, \'걸스데이\': 4, \'블랙핑크\': 4}</code> 딕셔너리가 들어옵니다. 파이썬은 한글도 변수 이름(키 이름)으로 쓸 수 있어서 <code>트와이스 = 9</code> 가 가능합니다. 관례적으로는 <code>**kwargs</code>(keyword arguments)라는 이름을 많이 씁니다.' },
          { type: 'table', head: ['방법', '함수 정의', '호출 예', '함수 안에서'], rows: [
            ['개수 지정', '<code>def f(v1, v2)</code>', '<code>f(10, 20)</code>', '각각의 변수'],
            ['기본값 설정', '<code>def f(v1, v2, v3 = 0)</code>', '<code>f(10, 20)</code> · <code>f(10, 20, 30)</code>', '안 넘긴 자리는 기본값'],
            ['개수 지정 안 함', '<code>def f(*para)</code>', '<code>f(10, 20, 30, …)</code>', '<b>튜플</b>'],
            ['키=값 형식', '<code>def f(**para)</code>', '<code>f(a = 1, b = 2)</code>', '<b>딕셔너리</b>']
          ], caption: '함수의 매개변수 전달 방법 정리' },
          { type: 'h', text: '여기서 잠깐 — 함수의 매개변수 전달 방법' },
          { type: 'p', html: '강의자료에서는 매개변수 전달을 두 가지로 나누어 설명합니다. <b>① 값에 의한 전달(Call By Value)</b>: 정수 · 실수 · 문자열 같은 일반 값을 넘기면 함수 안의 매개변수는 따로 존재하는 것처럼 동작해서, 함수 안에서 바꿔도 밖의 변수는 그대로입니다. <b>② 참조에 의한 전달(Call By Reference)</b>: 리스트(딕셔너리, 세트 등)를 넘기면 함수 안과 밖이 <b>같은 리스트를 공유</b>하므로, 함수 안에서 리스트 내용을 바꾸면 메인 코드의 리스트도 바뀝니다. 7장에서 본 “리스트 복사” 개념과 비슷합니다.' },
          { type: 'code', title: '① 값에 의한 전달', code: `def func(p) :   # p는 별도의 메모리 공간을 확보함
    p = 222

v = 111
func(v)
print(v)        # 111이 출력됨`,
            expect: '111' },
          { type: 'code', title: '② 참조에 의한 전달', code: `def func(p) :   # 리스트 p는 리스트 v와 메모리를 공유함
    p[0] = 222

v = [111]
func(v)
print(v[0])     # 222가 출력됨`,
            expect: '222' },
          { type: 'figure', html: SVG_PASS, caption: '정수를 넘길 때와 리스트를 넘길 때 — 함수 안에서 무엇을 바꾸는가의 차이' },
          { type: 'callout', kind: 'more', title: '📘 파이썬의 실제 동작: “객체의 참조”를 넘긴다', html: '좀 더 정확히 말하면 파이썬은 항상 <b>값이 들어 있는 객체의 위치(참조)</b>를 넘깁니다. ①에서도 처음에는 <code>p</code> 와 <code>v</code> 가 같은 111을 가리킵니다. 그런데 <code>p = 222</code> 는 111을 바꾸는 것이 아니라 <b><code>p</code> 가 새 값 222를 가리키게</b> 할 뿐이라서 <code>v</code> 는 영향을 받지 않습니다. 반면 ②의 <code>p[0] = 222</code> 는 <b>둘이 함께 가리키는 리스트의 내용</b>을 바꾸므로 <code>v</code> 에서도 바뀐 값이 보입니다. 즉 “무엇을 넘겼나”보다 “함수 안에서 <b>이름을 다시 대입</b>했나, <b>내용을 수정</b>했나”가 결과를 가릅니다.' },
          { type: 'h', text: '[프로그램 1]의 완성 — 로또 번호 추첨' },
          { type: 'p', html: '이제 로또 번호 추첨 프로그램을 완성해 봅시다. 흐름은 다음과 같습니다.' },
          { type: 'list', ordered: true, items: [
            '<code>getNumber()</code> 함수: <code>random.randrange(1, 46)</code> 으로 1~45 중 숫자 하나를 뽑아 돌려준다.',
            '<code>while True</code> 로 계속 반복하면서 숫자를 하나씩 뽑는다.',
            '뽑은 숫자가 리스트 <code>lotto</code> 에 <b>없으면</b>(<code>lotto.count(num) == 0</code>) 추가한다 → 중복 방지',
            '리스트에 6개가 모이면 <code>break</code> 로 반복을 끝낸다.',
            '<code>sort()</code> 로 정렬한 뒤 6개를 한 줄에 출력한다.'
          ] },
          { type: 'code', title: '[프로그램 1] 완성: 로또 번호 추첨 (Code09-13)', nondeterministic: true, code: LOTTO,
            desc: '실행할 때마다 다른 번호가 나옵니다. 예) <code>추첨된 로또 번호 ==&gt;  2  6  8  9  27  32</code>. <code>randrange(1, 46)</code> 은 46을 <b>포함하지 않으므로</b> 1~45 중 하나입니다. 같은 숫자가 다시 뽑히면 <code>17행</code> 조건이 거짓이 되어 추가되지 않고, 다시 뽑습니다.' },
          { type: 'callout', kind: 'more', title: '📘 random.sample() 로 한 줄에 뽑기', html: '<code>random</code> 모듈의 <code>sample(모음, 개수)</code> 는 <b>중복 없이</b> 여러 개를 한 번에 뽑아 리스트로 돌려줍니다.<pre><code>import random\nlotto = sorted(random.sample(range(1, 46), 6))\nprint("추첨된 로또 번호 ==&gt;", lotto)</code></pre>원리를 익히는 것이 목적이므로 이 장에서는 강의자료처럼 반복문으로 직접 만들어 보고, 실전에서는 이런 편리한 함수를 활용하면 됩니다.' },
          { type: 'callout', kind: 'tip', title: '결과를 매번 같게 만들고 싶다면', html: '프로그램 맨 앞에 <code>random.seed(1)</code> 처럼 <b>시드(seed)</b>를 정해 주면, 실행할 때마다 같은 “무작위” 순서가 나옵니다. 프로그램을 테스트하거나 친구와 결과를 비교할 때 유용합니다.' }
        ],
        practice: [
          {
            title: 'SELF STUDY 9-3. 매개변수 2~10개의 합계',
            level: 1,
            desc: '<p>Code09-11 의 <code>para_func()</code> 를 수정해서, 매개변수를 <b>2개에서 10개까지</b> 몇 개를 넘기든 합계를 구하도록 하세요. (기본값을 이용합니다.)</p><pre><code>매개변수가 2개인 함수를 호출한 결과 ==> 30\n매개변수가 10개인 함수를 호출한 결과 ==> 550</code></pre>',
            hint: '<code>v3</code> 부터 <code>v10</code> 까지 모두 <code>= 0</code> 기본값을 줍니다.',
            starter: `## 함수 선언 부분 ##
def para_func( v1, v2, v3 = 0 ) :
    # TODO: v10 까지 기본값 0 인 매개변수 추가
    result = 0
    result = v1 + v2 + v3
    return result

## 메인 코드 부분 ##
hap = para_func(10, 20)
print("매개변수가 2개인 함수를 호출한 결과 ==> %d" % hap)
# TODO: 10개를 넘겨 호출하기
`,
            solution: `## 함수 선언 부분 ##
def para_func( v1, v2, v3 = 0, v4 = 0, v5 = 0, v6 = 0, v7 = 0, v8 = 0, v9 = 0, v10 = 0 ) :
    result = 0
    result = v1 + v2 + v3 + v4 + v5 + v6 + v7 + v8 + v9 + v10
    return result

## 전역 변수 선언 부분 ##
hap = 0

## 메인 코드 부분 ##
hap = para_func(10, 20)
print("매개변수가 2개인 함수를 호출한 결과 ==> %d" % hap)
hap = para_func(10, 20, 30, 40, 50, 60, 70, 80, 90, 100)
print("매개변수가 10개인 함수를 호출한 결과 ==> %d" % hap)
`,
            expect: '매개변수가 2개인 함수를 호출한 결과 ==> 30\n매개변수가 10개인 함수를 호출한 결과 ==> 550'
          },
          {
            title: '실습 9-4. 몇 과목이든 평균 구하기 (*para)',
            level: 2,
            desc: '<p>점수를 몇 개든 받아서 <b>평균</b>을 돌려주는 <code>average(*scores)</code> 함수를 만드세요. 점수가 하나도 없으면 0을 돌려줍니다.</p><pre><code>3과목 평균 : 80.0\n5과목 평균 : 87.0\n0과목 평균 : 0</code></pre>',
            hint: '<code>scores</code> 는 튜플이므로 <code>len(scores)</code> 로 개수를 알 수 있습니다. 개수가 0이면 먼저 <code>return 0</code>.',
            starter: `def average(*scores) :
    # TODO: 점수가 없으면 0, 있으면 평균 반환
    pass

print("3과목 평균 :", average(70, 80, 90))
print("5과목 평균 :", average(100, 95, 80, 75, 85))
print("0과목 평균 :", average())
`,
            solution: `def average(*scores) :
    if len(scores) == 0 :
        return 0
    total = 0
    for s in scores :
        total = total + s
    return total / len(scores)

print("3과목 평균 :", average(70, 80, 90))
print("5과목 평균 :", average(100, 95, 80, 75, 85))
print("0과목 평균 :", average())
`,
            expect: '3과목 평균 : 80.0\n5과목 평균 : 87.0\n0과목 평균 : 0'
          },
          {
            title: '실습 9-5. 로또 5게임 추첨하기',
            level: 3,
            desc: '<p>[프로그램 1]을 고쳐서, 로또 번호 6개를 뽑아 <b>정렬된 리스트로 돌려주는</b> <code>getLotto()</code> 함수를 만들고, 5게임을 추첨해 출력하세요. (결과는 실행할 때마다 다릅니다.)</p><pre><code>1게임 : [3, 11, 19, 24, 38, 42]\n2게임 : [1, 7, 15, 22, 30, 44]\n…</code></pre>',
            hint: '함수 안에서 빈 리스트를 만들고, 강의자료의 <code>while</code> 반복을 그대로 넣은 뒤 <code>lotto.sort()</code> 후 <code>return lotto</code>.',
            nondeterministic: true,
            starter: `import random

def getNumber() :
    return random.randrange(1, 46)

def getLotto() :
    lotto = []
    # TODO: 겹치지 않는 번호 6개를 뽑아 정렬 후 반환
    return lotto

for i in range(1, 6) :
    print("%d게임 :" % i, getLotto())
`,
            solution: `import random

def getNumber() :
    return random.randrange(1, 46)

def getLotto() :
    lotto = []
    while True :
        num = getNumber()
        if lotto.count(num) == 0 :
            lotto.append(num)
        if len(lotto) >= 6 :
            break
    lotto.sort()
    return lotto

for i in range(1, 6) :
    print("%d게임 :" % i, getLotto())
`
          }
        ],
        quiz: [
          { q: '다음 코드의 실행 결과는?<pre><code>def f(v1, v2, v3 = 5) :\n    return v1 + v2 + v3\n\nprint(f(1, 2), f(1, 2, 3))</code></pre>', options: ['3 6', '8 6', '8 11', '오류'], answer: 1, explain: '<code>f(1, 2)</code> 는 v3 가 기본값 5라서 8, <code>f(1, 2, 3)</code> 은 6입니다.' },
          { q: '<code>def para_func(*para)</code> 를 <code>para_func(10, 20, 30)</code> 으로 호출했을 때 <code>para</code> 의 값은?', options: ['10', '[10, 20, 30]', '(10, 20, 30)', "{'10': 20}"], answer: 2, explain: '별표 하나(<code>*</code>) 매개변수는 넘어온 값들을 <b>튜플</b>로 묶어 받습니다.' },
          { q: '<code>def dic_func(**para)</code> 를 호출하는 올바른 방법은?', options: ['dic_func(1, 2, 3)', 'dic_func(a = 1, b = 2)', 'dic_func([1, 2])', 'dic_func(*1)'], answer: 1, explain: '별표 두 개(<code>**</code>) 매개변수는 <code>키 = 값</code> 형식의 인수를 딕셔너리로 받습니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>def func(p) :\n    p.append(4)\n\nv = [1, 2, 3]\nfunc(v)\nprint(len(v))</code></pre>', options: ['3', '4', '1', '오류'], answer: 1, explain: '리스트는 함수 안과 밖이 같은 리스트를 공유하므로, 함수 안에서 추가한 4가 <code>v</code> 에도 반영되어 길이가 4가 됩니다.' },
          { q: '로또 프로그램에서 <code>if lotto.count(num) == 0 :</code> 조건이 하는 역할은?', options: ['리스트가 비었는지 확인', '뽑은 숫자가 0인지 확인', '뽑은 숫자가 이미 리스트에 있는지 확인해 중복을 막음', '6개가 모였는지 확인'], answer: 2, explain: '<code>count(num)</code> 은 리스트에 num 이 몇 개 있는지 셉니다. 0이면 아직 없는 숫자이므로 추가합니다.' }
        ],
        slides: [
          { layout: 'title', title: '매개변수 전달 방법과 로또 번호 추첨', subtitle: 'Chapter 09 · Section 04 (계속)', badge: '09-3',
            notes: '<p><b>[도입 1분]</b> “숫자 2개 합, 3개 합, 10개 합… 함수를 몇 개 만들어야 할까요?” 로 시작합니다. 오늘은 함수 하나로 해결하는 방법들을 배웁니다.</p>' },
          { layout: 'code', title: 'Code09-10. 개수를 지정해 전달', code: `def para2_func( v1, v2 ) :
    result = 0
    result = v1 + v2
    return result

def para3_func( v1, v2, v3 ) :
    result = 0
    result = v1 + v2 + v3
    return result

hap = para2_func(10, 20)
print("매개변수가 2개인 함수를 호출한 결과 ==> %d" % hap)
hap = para3_func(10, 20, 30)
print("매개변수가 3개인 함수를 호출한 결과 ==> %d" % hap)`,
            points: ['2개용, 3개용 함수를 <b>따로</b> 만듦', '개수가 틀리면 <b>TypeError</b>', '4개, 5개가 필요하면…?'],
            notes: '<p><b>[3분]</b> <code>para2_func(10)</code> 으로 바꿔 실행해 “missing 1 required positional argument” 오류를 함께 읽어 보세요. 오류 메시지가 빠진 매개변수 이름까지 알려 줍니다.</p>' },
          { layout: 'code', title: 'Code09-11. 매개변수에 기본값 설정', code: `def para_func( v1, v2, v3 = 0 ) :
    result = 0
    result = v1 + v2 + v3
    return result

hap = para_func(10, 20)
print("매개변수가 2개인 함수를 호출한 결과 ==> %d" % hap)
hap = para_func(10, 20, 30)
print("매개변수가 3개인 함수를 호출한 결과 ==> %d" % hap)`,
            points: ['<code>v3 = 0</code> → 안 넘기면 0', '넘기면 넘긴 값 사용 (기본값 무시)', '기본값 매개변수는 <b>뒤쪽</b>에'],
            notes: '<p><b>[3분]</b> 발문: “<code>def f(v1 = 0, v2)</code> 는 될까요?” → SyntaxError. 값이 앞에서부터 채워지므로 기본값 있는 것은 뒤쪽이어야 합니다.</p><p>보충: 키워드 인수 <code>print(..., end=\'\')</code> 의 end 도 기본값이 \'\\n\' 인 매개변수입니다.</p>' },
          { layout: 'code', title: 'Code09-12. 개수를 지정하지 않는 *para', code: `def para_func (*para) :
    result = 0
    for num in para :
        result = result + num
    return result

hap = para_func(10, 20)
print("매개변수가 2개인 함수를 호출한 결과 ==> %d" % hap)
hap = para_func(10, 20, 30)
print("매개변수가 3개인 함수를 호출한 결과 ==> %d" % hap)
print(para_func(10, 20, 30, 40, 50, 60, 70, 80, 90, 100))`,
            points: ['<code>*para</code> → 넘어온 값들이 <b>튜플</b>로', 'for 문으로 하나씩 꺼내 더함', '10개든 100개든 함수 수정 없음 (550)'],
            notes: '<p><b>[4분]</b> 반복 추적표(1회 10, 2회 30, 3회 60)를 칠판에 그리며 설명합니다.</p><p>함수 첫 줄에 <code>print(para)</code> 를 넣고 실행해 튜플이 들어오는 것을 눈으로 확인시키면 좋습니다.</p>' },
          { layout: 'code', title: '딕셔너리 형식의 매개변수 **para', code: `def dic_func(**para) :
    for k in para.keys() :
        print("%s  --> %d명입니다." % (k, para[k]))

dic_func(트와이스 = 9, 소녀시대 = 7, 걸스데이 = 4, 블랙핑크 = 4)`,
            points: ['호출: <code>키 = 값</code> 형식', '<code>para</code> 는 <b>딕셔너리</b>', '한글도 키 이름으로 사용 가능'],
            notes: '<p><b>[3분]</b> 함수 첫 줄에 <code>print(para)</code> 를 넣어 딕셔너리가 들어온 것을 확인합니다. 학생들에게 좋아하는 그룹 이름으로 바꿔 실행해 보게 하면 반응이 좋습니다.</p><p>관례 이름: <code>*args</code>, <code>**kwargs</code> — 다른 사람 코드를 읽을 때 자주 보게 된다고 알려 주세요.</p>' },
          { layout: 'table', title: '매개변수 전달 방법 정리', head: ['방법', '정의', '함수 안에서'], rows: [['개수 지정', '<code>def f(v1, v2)</code>', '각각의 변수'], ['기본값', '<code>def f(v1, v2, v3 = 0)</code>', '안 넘기면 기본값'], ['개수 지정 안 함', '<code>def f(*para)</code>', '튜플'], ['키=값 형식', '<code>def f(**para)</code>', '딕셔너리']],
            notes: '<p><b>[1분]</b> 표로 한 번에 정리합니다. 별 하나 = 튜플, 별 둘 = 딕셔너리로 외우게 하세요.</p>' },
          { layout: 'two', title: '여기서 잠깐 — 값에 의한 전달 vs 참조에 의한 전달',
            left: { title: '① 정수: 밖은 그대로', code: `def func(p) :\n    p = 222\n\nv = 111\nfunc(v)\nprint(v)        # 111` },
            right: { title: '② 리스트: 밖도 바뀜', code: `def func(p) :\n    p[0] = 222\n\nv = [111]\nfunc(v)\nprint(v[0])     # 222` },
            notes: '<p><b>[4분]</b> 두 코드를 각각 실행해 비교합니다. 다음 슬라이드 그림으로 이유를 설명합니다.</p><p>7장 리스트 복사(<code>b = a</code> 하면 같은 리스트를 공유) 내용을 떠올리게 하세요.</p>' },
          { layout: 'diagram', title: '무엇이 다를까?', html: SVG_PASS, caption: 'p = 222 는 이름을 새 값에 붙이고, p[0] = 222 는 공유하는 리스트의 내용을 바꾼다',
            notes: '<p><b>[3분]</b> 교과서는 “값 전달 / 참조 전달”로 설명하지만 파이썬의 실제 동작은 “항상 객체의 참조를 전달”입니다. 핵심은 함수 안에서 <b>다시 대입</b>했는지(p = …), <b>내용을 수정</b>했는지(p[0] = …, p.append(…))입니다.</p><p>수준이 높은 반에서는 이 구분까지, 아니면 “리스트를 넘기면 함수 안에서 바꾼 게 밖에도 반영된다” 정도로 마무리합니다.</p>' },
          { layout: 'code', title: '[프로그램 1] 완성: 로또 번호 추첨', code: `import random

def getNumber() :
    return random.randrange(1, 46)

lotto = []
num = 0

print("** 로또 추첨을 시작합니다. ** \\n");
while True :
    num = getNumber()
    if lotto.count(num) == 0 :
        lotto.append(num)
    if len(lotto) >= 6 :
        break

print("추첨된 로또 번호 ==>  ", end = '')
lotto.sort()
for i in range(0, 6) :
    print("%d  " % lotto[i], end = '')`,
            points: ['<code>getNumber()</code>: 1~45 중 하나 반환', '<code>count(num) == 0</code> → 중복 방지', '6개 모이면 <code>break</code> → 정렬 후 출력'],
            notes: '<p><b>[6분]</b> 여러 번 실행해 매번 다른 번호가 나오는 것을 보여 줍니다.</p><p>발문: “12~13행(중복 검사)을 빼면?” → 같은 번호가 두 번 나올 수 있음. “randrange(1, 46) 에 46이 나올까?” → 안 나옴(끝 값 미포함).</p><p>보충: <code>random.sample(range(1, 46), 6)</code> 한 줄 버전도 소개.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '실행 결과는?<pre><code>def f(v1, v2, v3 = 5) :\n    return v1 + v2 + v3\n\nprint(f(1, 2), f(1, 2, 3))</code></pre>', options: ['3 6', '8 6', '8 11', '오류'], answer: 1, explain: 'f(1, 2) → 1+2+5 = 8, f(1, 2, 3) → 6',
            notes: '<p><b>[2분]</b> 기본값이 “넘기지 않았을 때만” 쓰인다는 점을 다시 확인합니다.</p>' },
          { layout: 'practice', title: 'SELF STUDY 9-3. 2~10개의 합계', desc: '기본값을 이용해 매개변수를 2개에서 10개까지 받아 합계를 구하도록 <code>para_func()</code> 수정',
            starter: `def para_func( v1, v2, v3 = 0 ) :
    # TODO: v10 까지
    return v1 + v2 + v3

print("매개변수가 2개인 함수를 호출한 결과 ==> %d" % para_func(10, 20))
`,
            solution: `def para_func( v1, v2, v3 = 0, v4 = 0, v5 = 0, v6 = 0, v7 = 0, v8 = 0, v9 = 0, v10 = 0 ) :
    result = v1 + v2 + v3 + v4 + v5 + v6 + v7 + v8 + v9 + v10
    return result

hap = para_func(10, 20)
print("매개변수가 2개인 함수를 호출한 결과 ==> %d" % hap)
hap = para_func(10, 20, 30, 40, 50, 60, 70, 80, 90, 100)
print("매개변수가 10개인 함수를 호출한 결과 ==> %d" % hap)
`,
            notes: '<p><b>[5분]</b> 풀고 나면 “*para 로 하면 훨씬 짧지 않나요?” 라는 질문이 나올 것입니다. 맞습니다 — 두 방법을 비교하게 하세요(개수 제한이 있는 경우 vs 없는 경우).</p>' },
          { layout: 'summary', title: '정리', bullets: ['기본값 매개변수 <code>v3 = 0</code> — 안 넘기면 기본값, 뒤쪽에 배치', '<code>*para</code> → 튜플, <code>**para</code> → 딕셔너리', '키워드 인수 <code>이름 = 값</code> 으로 순서 상관없이 전달', '리스트를 넘기면 함수 안의 수정이 밖에도 반영', '[프로그램 1] 로또: 함수 + while + count() + sort()'],
            notes: '<p><b>[1분]</b> 다음 시간: 함수를 파일로 모은 <b>모듈</b>, 그리고 [프로그램 2] 글자 쓰는 거북이.</p>' }
        ]
      },
      /* ===================== ch09-4 ===================== */
      {
        id: 'ch09-4',
        title: '모듈과 [프로그램 2] 글자를 쓰는 거북이',
        minutes: 50,
        goals: [
          '모듈이 함수의 집합임을 이해하고 직접 모듈 파일을 만들 수 있다',
          'import 모듈명 / from 모듈명 import 함수 형식의 차이를 설명할 수 있다',
          '표준 모듈 · 사용자 정의 모듈 · 서드 파티 모듈을 구분할 수 있다',
          'dir() 로 모듈이 제공하는 함수 목록을 확인할 수 있다',
          '사용자 정의 모듈을 활용해 글자를 쓰는 거북이 프로그램을 완성할 수 있다'
        ],
        flow: [['모듈 개념 · 이 강좌의 여러 파일 쓰기', 8], ['Module1 · A.py · B.py', 12], ['모듈의 종류 · 표준 모듈 목록', 8], ['[프로그램 2] 완성', 15], ['퀴즈 · 실습', 7]],
        content: [
          { type: 'h', text: '모듈 : 함수의 집합' },
          { type: 'p', html: '함수를 잘 만들어 두면 다른 프로그램에서도 쓰고 싶어집니다. 그때마다 함수 코드를 복사해 붙여 넣는다면 “커피 코드 복사” 문제가 다시 생기겠지요. 그래서 함수들을 <b>별도의 .py 파일</b>에 모아 두고, 필요한 프로그램에서 <b><code>import</code></b> 로 불러와 씁니다. 이렇게 함수를 모아 둔 파일을 <b>모듈(module)</b>이라고 합니다.' },
          { type: 'figure', html: SVG_MODULE, caption: '그림 9-10 모듈 사용 예 — Module1.py 의 함수를 A.py 와 B.py 가 함께 쓴다' },
          { type: 'h', text: '이 강좌에서 여러 파일 만들기' },
          { type: 'p', html: 'IDLE 에서는 <code>Module1.py</code> 와 <code>A.py</code> 를 <b>같은 폴더</b>에 각각 저장한 뒤 <code>A.py</code> 를 실행합니다. 이 웹 강좌의 편집기는 한 칸이므로, <b>파일 구분 주석</b> <code># ===== File: 파일이름.py =====</code> 으로 파일을 나눕니다. 앞 구역들은 작업 폴더에 파일로 저장되고, <b>마지막 구역</b>이 실행할 프로그램(main.py)이 됩니다.' },
          { type: 'figure', html: SVG_FILES, caption: '파일 구분 주석으로 모듈 파일과 실행 프로그램을 한 편집기에 쓰기' },
          { type: 'h', text: '모듈의 생성과 사용' },
          { type: 'p', html: '먼저 함수 3개가 들어 있는 모듈 <code>Module1.py</code> 를 만들고, <code>A.py</code> 에서 <code>import Module1</code> 로 불러와 <code>모듈명.함수명()</code> 형식으로 호출합니다. 모듈 이름에는 확장자 <code>.py</code> 를 붙이지 않습니다.' },
          { type: 'code', title: 'Module1.py + A.py. 모듈 만들고 import 하기', code: `# ===== File: Module1.py =====
## 함수 선언 부분 ##
def func1() :
    print("Module1.py의 func1()이 호출됨.")

def func2() :
    print("Module1.py의 func2()가 호출됨.")

def func3() :
    print("Module1.py의 func3()이 호출됨.")
# ===== File: A.py =====
import Module1

## 메인 코드 부분 ##
Module1.func1()
Module1.func2()
Module1.func3()`,
            expect: 'Module1.py의 func1()이 호출됨.\nModule1.py의 func2()가 호출됨.\nModule1.py의 func3()이 호출됨.',
            desc: '마지막 구역(<code>A.py</code>)이 실행됩니다. <code>import Module1</code> 은 같은 폴더의 <code>Module1.py</code> 파일을 찾아 불러오고, 그 안의 함수는 <code>Module1.</code> 을 앞에 붙여 부릅니다.' },
          { type: 'p', html: '매번 <code>Module1.</code> 을 붙이는 것이 번거롭다면, <b>모듈명을 생략하고 함수명만</b> 쓸 수 있도록 불러옵니다.<pre><code>from 모듈명 import 함수1, 함수2, 함수3\n또는\nfrom 모듈명 import *</code></pre><code>*</code> 는 “모듈 안의 모든 것”이라는 뜻입니다.' },
          { type: 'code', title: 'Module1.py + B.py. from … import 로 함수명만 쓰기', code: `# ===== File: Module1.py =====
def func1() :
    print("Module1.py의 func1()이 호출됨.")

def func2() :
    print("Module1.py의 func2()가 호출됨.")

def func3() :
    print("Module1.py의 func3()이 호출됨.")
# ===== File: B.py =====
from Module1 import func1, func2, func3    # 또는 from Module1 import  *

## 메인 코드 부분 ##
func1()
func2()
func3()`,
            expect: 'Module1.py의 func1()이 호출됨.\nModule1.py의 func2()가 호출됨.\nModule1.py의 func3()이 호출됨.' },
          { type: 'table', head: ['형식', '호출 방법', '특징'], rows: [
            ['<code>import Module1</code>', '<code>Module1.func1()</code>', '어느 모듈의 함수인지 분명하다'],
            ['<code>from Module1 import func1, func2</code>', '<code>func1()</code>', '가져온 함수만 짧게 쓴다'],
            ['<code>from Module1 import *</code>', '<code>func1()</code>', '모두 가져와 편하지만, 이름이 겹칠 위험이 있다'],
            ['<code>import Module1 as m</code>', '<code>m.func1()</code>', '(보충) 모듈에 짧은 별명을 붙인다']
          ], caption: '모듈을 불러오는 형식' },
          { type: 'callout', kind: 'warn', title: 'from … import * 의 함정', html: '내 프로그램에 <code>func1()</code> 이라는 함수가 이미 있는데 <code>from Module1 import *</code> 를 하면, <b>나중에 실행된 쪽이 앞의 것을 덮어씁니다</b>. 어느 함수가 불린 것인지 헷갈리게 되므로, 큰 프로그램에서는 필요한 함수만 이름을 적어 가져오거나 <code>import 모듈명</code> 을 쓰는 것이 안전합니다.' },
          { type: 'callout', kind: 'more', title: '📘 if __name__ == "__main__" : 은 무슨 뜻일까?', html: '<code>import</code> 를 하면 모듈 파일의 코드가 <b>처음부터 끝까지 한 번 실행</b>됩니다. 그래서 모듈에 테스트용 <code>print()</code> 가 있으면 import 할 때마다 출력돼 버립니다. 파이썬은 <b>직접 실행한 파일</b>의 <code>__name__</code> 에는 <code>"__main__"</code> 을, <b>import 된 파일</b>의 <code>__name__</code> 에는 모듈 이름(<code>"Module2"</code>)을 넣어 줍니다. 이것을 이용해 “직접 실행할 때만” 테스트 코드를 돌릴 수 있습니다.' },
          { type: 'code', title: '추가 예제. __name__ 으로 테스트 코드 구분하기', code: `# ===== File: Module2.py =====
def plus(v1, v2) :
    return v1 + v2

print("Module2의 __name__ :", __name__)

if __name__ == "__main__" :
    # 이 파일을 직접 실행할 때만 동작하는 테스트 코드
    print("테스트 :", plus(1, 2))
# ===== File: main.py =====
import Module2

print("main.py의 __name__ :", __name__)
print("100 + 200 =", Module2.plus(100, 200))`,
            expect: 'Module2의 __name__ : Module2\nmain.py의 __name__ : __main__\n100 + 200 = 300',
            desc: 'import 할 때 <code>Module2.py</code> 의 <code>5행</code>은 실행되지만(<code>__name__</code> 은 <code>Module2</code>), <code>7행</code>의 조건은 거짓이라 테스트 코드는 실행되지 않습니다. 이 슬라이드 쇼 마지막 장 배경에 적힌 <code>if __name__ == \'__main__\'</code> 이 바로 이 문장입니다.' },
          { type: 'h', text: '모듈의 종류' },
          { type: 'list', items: [
            '<b>표준 모듈</b> — 파이썬을 설치하면 함께 들어 있는 모듈. 예: <code>random</code>, <code>math</code>, <code>turtle</code>, <code>time</code>, <code>sys</code>',
            '<b>사용자 정의 모듈</b> — 직접 만들어서 쓰는 모듈. 예: 위의 <code>Module1.py</code>, [프로그램 2]의 <code>myTurtle.py</code>',
            '<b>서드 파티(3rd Party) 모듈</b> — 파이썬이 아닌 외부 회사나 단체가 만들어 제공하는 모듈. 표준 모듈이 모든 기능을 제공하지는 않기 때문에, 서드 파티 모듈 덕분에 파이썬으로 고급 프로그래밍을 할 수 있습니다. 예: 게임 개발용 <code>pygame</code>, 윈도 창을 제공하는 <code>PyGTK</code>, 데이터베이스용 <code>SQLAlchemy</code> 등'
          ] },
          { type: 'callout', kind: 'more', title: '📘 서드 파티 모듈 설치하기 (내 PC)', html: '내 PC 의 파이썬에서는 명령 프롬프트에서 <code>pip install pygame</code> 처럼 <b>pip</b> 로 서드 파티 모듈을 설치합니다. 이 웹 강좌는 브라우저 안에서 파이썬이 돌기 때문에 pip 대신, 강좌에서 쓰는 모듈(turtle · tkinter · pygame · Pillow 등)을 미리 준비해 두었습니다.' },
          { type: 'p', html: '파이썬이 제공하는 표준 모듈 중, 파이썬 실행 파일에 <b>내장된</b> 모듈의 이름은 <code>sys.builtin_module_names</code> 로 확인할 수 있습니다.' },
          { type: 'code', title: '표준 모듈의 목록을 일부 확인하기', nondeterministic: true, code: `import sys
print(sys.builtin_module_names)`,
            desc: '<code>(\'_abc\', \'_ast\', \'_bisect\', … \'math\', … \'sys\', \'time\', …)</code> 처럼 튜플로 출력됩니다. 목록은 파이썬 버전과 운영체제(윈도 · 브라우저)에 따라 조금씩 다릅니다. <code>random</code> 이나 <code>turtle</code> 처럼 .py 파일로 된 표준 모듈은 이 목록에 없지만 import 해서 쓸 수 있습니다.' },
          { type: 'callout', kind: 'tip', title: 'Tip · dir(__builtins__)', html: '<code>dir(__builtins__)</code> 명령으로는 import 없이 바로 쓸 수 있는 <b>내장 함수와 이름들</b>(<code>print</code>, <code>len</code>, <code>range</code>, <code>int</code> …)을 확인할 수 있습니다. 콘솔의 <code>&gt;&gt;&gt;</code> 셸에서 직접 입력해 보세요.' },
          { type: 'p', html: '<code>dir(모듈명)</code> 을 쓰면 그 모듈이 제공하는 함수와 변수의 목록을 볼 수 있습니다. 수학 계산 모듈인 <code>math</code> 를 살펴봅시다.' },
          { type: 'code', repl: true, nondeterministic: true, title: 'math 모듈이 제공하는 함수의 목록 보기', code: 'import math\ndir(math)',
            desc: '<code>[\'__doc__\', …, \'acos\', \'ceil\', \'cos\', \'factorial\', \'floor\', \'gcd\', \'pi\', \'pow\', \'sin\', \'sqrt\', \'tan\', …]</code> 처럼 알파벳 순서의 리스트가 나옵니다. 밑줄 두 개로 시작하는 이름은 파이썬 내부용입니다. 사용법이 궁금한 함수는 <code>help(math.sqrt)</code> 로 설명을 볼 수 있습니다.' },
          { type: 'code', title: '추가 예제. math 모듈 함수 사용해 보기', code: `import math

print(math.pi)
print(math.sqrt(16))
print(math.ceil(3.2), math.floor(3.8))
print(math.factorial(5))`,
            expect: '3.141592653589793\n4.0\n4 3\n120' },
          { type: 'h', text: '[프로그램 2]의 완성 — 모듈을 활용해 글자를 쓰는 거북이' },
          { type: 'p', html: '이제 거북이 프로그램을 두 파일로 나누어 만듭니다. <code>myTurtle.py</code> 모듈에는 도우미 함수 3개를 넣고, <code>Code09-14.py</code>(여기서는 main.py)에서 <code>from myTurtle import *</code> 로 불러와 씁니다.' },
          { type: 'table', head: ['함수 (myTurtle.py)', '하는 일', '반환값'], rows: [
            ['<code>getString()</code>', '입력 대화상자로 거북이가 쓸 문자열을 받는다', '입력한 문자열'],
            ['<code>getRGB()</code>', '0~1 사이 난수 3개로 색을 만든다', '튜플 <code>(r, g, b)</code>'],
            ['<code>getXYAS(sw, sh)</code>', '화면 안의 임의 위치 x, y, 각도, 글자 크기를 만든다', '리스트 <code>[x, y, angle, size]</code>']
          ] },
          { type: 'code', title: '[프로그램 2] 완성: 모듈을 활용해 글자를 쓰는 거북이 (myTurtle.py + Code09-14)', nondeterministic: true, dialogs: ['나랏말싸미듕귁에달아문짜와로서르사맛디아니할쎄'], code: MY_TURTLE + CODE0914_MAIN,
            desc: '▶ 실행하면 “문자열 입력” 대화상자가 뜹니다. 문장을 넣으면 거북이가 한 글자씩 임의의 위치 · 방향 · 크기 · 색으로 씁니다. <code>getXYAS()</code> 의 좌표 계산은 강의자료의 <code>sw / 2</code> 를 <code>sw // 2</code> 로 바꿨습니다 — 파이썬 3.12부터 <code>randrange()</code> 에 실수(150.0)를 넣으면 <code>TypeError</code> 가 나기 때문입니다. 대화상자에서 취소를 누르면 <code>None</code> 이 돌아와 <code>for</code> 문에서 오류가 나니, 실습 9-7에서 고쳐 봅시다.' },
          { type: 'callout', kind: 'info', title: 'myTurtle.py 의 두 가지 반환 방식', html: '<code>getRGB()</code> 는 <code>return (r, g, b)</code> 로 <b>튜플</b>을, <code>getXYAS()</code> 는 <code>return [x, y, angle, size]</code> 로 <b>리스트</b>를 돌려줍니다. 메인 코드에서는 둘 다 <code>r, g, b = getRGB()</code>, <code>tX, tY, tAngle, txtSize = getXYAS(…)</code> 처럼 <b>여러 변수에 한 번에 나눠</b> 받습니다(언패킹). 2교시에서 배운 “반환값이 여러 개인 함수”의 활용입니다.' },
          { type: 'callout', kind: 'more', title: '📘 모듈로 나누면 좋은 점', html: '<ul><li>메인 코드가 짧아져 <b>프로그램의 흐름</b>(입력 → 글자마다 위치 · 색 정하기 → 쓰기)이 잘 보입니다.</li><li><code>getRGB()</code> 같은 함수는 다른 거북이 프로그램에서도 <code>import</code> 만 하면 재사용할 수 있습니다.</li><li>색을 만드는 방법을 바꾸고 싶으면 <code>myTurtle.py</code> 한 곳만 고치면 됩니다.</li></ul>' }
        ],
        practice: [
          {
            title: '실습 9-6. 나만의 계산 모듈 만들기',
            level: 1,
            desc: '<p><code>myCalc.py</code> 모듈에 <code>plus(a, b)</code>, <code>minus(a, b)</code>, <code>multiply(a, b)</code> 함수를 만들고, main.py 에서 <code>import myCalc</code> 로 불러와 10과 3의 계산 결과를 출력하세요.</p><pre><code>10 + 3 = 13\n10 - 3 = 7\n10 * 3 = 30</code></pre>',
            hint: '파일 구분 주석 <code># ===== File: myCalc.py =====</code> 과 <code># ===== File: main.py =====</code> 을 사용합니다.',
            starter: `# ===== File: myCalc.py =====
# TODO: plus, minus, multiply 함수 정의
pass
# ===== File: main.py =====
import myCalc

# TODO: myCalc.plus(10, 3) 등을 호출해 출력
`,
            solution: `# ===== File: myCalc.py =====
def plus(a, b) :
    return a + b

def minus(a, b) :
    return a - b

def multiply(a, b) :
    return a * b
# ===== File: main.py =====
import myCalc

print("10 + 3 =", myCalc.plus(10, 3))
print("10 - 3 =", myCalc.minus(10, 3))
print("10 * 3 =", myCalc.multiply(10, 3))
`,
            expect: '10 + 3 = 13\n10 - 3 = 7\n10 * 3 = 30'
          },
          {
            title: '실습 9-7. 거북이 프로그램 개선하기',
            level: 2,
            desc: '<p>[프로그램 2]에서 대화상자에 아무것도 넣지 않거나 취소하면(<code>None</code>) “입력한 문자열이 없습니다.” 를 출력하고 끝내도록 고치세요. 또, 글자를 쓴 뒤 거북이를 원래 방향(<code>setheading(0)</code>)으로 되돌려 각도가 누적되지 않게 해 보세요.</p>',
            hint: '<code>if not inStr :</code> 은 <code>None</code> 과 빈 문자열 <code>\'\'</code> 을 모두 걸러 냅니다.',
            dialogs: [null],
            starter: MY_TURTLE + `# ===== File: main.py =====
from myTurtle import *
import turtle

swidth, sheight = 300, 300
turtle.shape('turtle')
turtle.penup()

inStr = getString()
# TODO: inStr 이 None 이거나 빈 문자열이면 메시지 출력

turtle.done()
`,
            solution: MY_TURTLE + `# ===== File: main.py =====
from myTurtle import *
import turtle

swidth, sheight = 300, 300
turtle.title('거북이 글자쓰기(모듈버전)')
turtle.shape('turtle')
turtle.setup(width = swidth + 50, height = sheight + 50)
turtle.screensize(swidth, sheight)
turtle.penup()
turtle.speed(5)

inStr = getString()
if not inStr :
    print("입력한 문자열이 없습니다.")
else :
    for ch in inStr :
        tX, tY, tAngle, txtSize = getXYAS(swidth, sheight)
        r, g, b = getRGB()
        turtle.goto(tX, tY)
        turtle.setheading(tAngle)
        turtle.pencolor((r, g, b))
        turtle.write(ch, font = ('맑은고딕', txtSize, 'bold'))
        turtle.setheading(0)

turtle.done()
`,
            expect: '입력한 문자열이 없습니다.'
          }
        ],
        quiz: [
          { q: '모듈에 대한 설명으로 옳은 것은?', options: ['모듈은 반드시 파이썬이 제공하는 것만 쓸 수 있다', '함수 등을 모아 둔 .py 파일이며 import 로 불러 쓴다', 'import 할 때 파일 이름에 .py 를 붙여야 한다', '모듈 안의 함수는 모듈명 없이 항상 호출할 수 있다'], answer: 1, explain: '모듈은 함수의 집합인 .py 파일입니다. <code>import Module1</code> 처럼 확장자 없이 불러옵니다.' },
          { q: '<code>from Module1 import func1</code> 을 한 뒤 func1 을 호출하는 올바른 방법은?', options: ['Module1.func1()', 'func1()', 'Module1->func1()', 'import func1()'], answer: 1, explain: '<code>from … import</code> 로 가져온 함수는 모듈명 없이 함수명만으로 호출합니다.' },
          { q: 'pygame, SQLAlchemy 처럼 외부 회사나 단체가 만들어 제공하는 모듈은?', options: ['표준 모듈', '사용자 정의 모듈', '서드 파티 모듈', '내장 함수'], answer: 2, explain: '파이썬 외부에서 제공하는 모듈을 서드 파티(3rd Party) 모듈이라고 합니다.' },
          { q: '모듈이 제공하는 함수 목록을 확인하는 함수는?', options: ['list(math)', 'dir(math)', 'print(math)', 'len(math)'], answer: 1, explain: '<code>dir(모듈)</code> 은 모듈 안의 이름 목록을 리스트로 돌려줍니다.' },
          { q: 'Module2.py 를 import 했을 때, Module2.py 안에서 <code>__name__</code> 의 값은?', options: ['"__main__"', '"Module2"', '"main.py"', 'None'], answer: 1, explain: 'import 된 모듈의 <code>__name__</code> 은 모듈 이름이고, 직접 실행한 파일만 <code>"__main__"</code> 입니다.' }
        ],
        slides: [
          { layout: 'title', title: '모듈과 [프로그램 2] 글자를 쓰는 거북이', subtitle: 'Chapter 09 · Section 05', badge: '09-4',
            notes: '<p><b>[도입 1분]</b> “지난 시간 만든 getNumber() 를 다른 프로그램에서도 쓰려면? 복사?” → 함수를 파일로 모아 두고 import 하자 = 모듈.</p><p>이미 써 온 <code>import random</code>, <code>import turtle</code> 도 모두 모듈이라는 점을 연결합니다.</p>' },
          { layout: 'diagram', title: '모듈 : 함수의 집합', html: SVG_MODULE, caption: '그림 9-10 — 한 번 만든 모듈을 여러 프로그램이 import 해서 사용',
            notes: '<p><b>[2분]</b> Module1.py = 공구함, A.py · B.py = 공구함을 빌려 쓰는 작업자. 공구(함수)를 고치면 모든 작업자가 좋아진 공구를 씁니다.</p>' },
          { layout: 'diagram', title: '이 강좌에서 여러 파일 만들기', html: SVG_FILES, caption: '# ===== File: 이름.py ===== 주석으로 파일을 나눈다 — 마지막 구역이 실행된다',
            notes: '<p><b>[3분]</b> 중요한 운영 안내입니다. IDLE 에서는 파일을 두 개 저장하지만, 웹 편집기에서는 파일 구분 주석으로 나눕니다. 주석 형식을 정확히 쓰지 않으면(= 개수, File: 철자) 한 파일로 취급되니 복사해서 쓰도록 안내하세요.</p><p>집에서 IDLE 로 할 때는 두 파일을 반드시 <b>같은 폴더</b>에 저장해야 import 됩니다.</p>' },
          { layout: 'code', title: 'Module1.py 와 A.py', code: `# ===== File: Module1.py =====
## 함수 선언 부분 ##
def func1() :
    print("Module1.py의 func1()이 호출됨.")

def func2() :
    print("Module1.py의 func2()가 호출됨.")

def func3() :
    print("Module1.py의 func3()이 호출됨.")
# ===== File: A.py =====
import Module1

## 메인 코드 부분 ##
Module1.func1()
Module1.func2()
Module1.func3()`,
            points: ['<code>import Module1</code> (.py 없이)', '<code>모듈명.함수명()</code> 으로 호출', '마지막 구역(A.py)이 실행됨'],
            notes: '<p><b>[3분]</b> Module1 을 module1 로 바꿔 import 해 보면 ModuleNotFoundError — 파일 이름의 대소문자가 맞아야 한다는 점을 보여 줄 수 있습니다.</p>' },
          { layout: 'code', title: 'B.py — from … import', code: `# ===== File: Module1.py =====
def func1() :
    print("Module1.py의 func1()이 호출됨.")

def func2() :
    print("Module1.py의 func2()가 호출됨.")

def func3() :
    print("Module1.py의 func3()이 호출됨.")
# ===== File: B.py =====
from Module1 import func1, func2, func3    # 또는 from Module1 import  *

## 메인 코드 부분 ##
func1()
func2()
func3()`,
            points: ['<code>from 모듈명 import 함수1, 함수2</code>', '<code>from 모듈명 import *</code> → 전부', '호출할 때 모듈명 생략'],
            notes: '<p><b>[3분]</b> <code>import *</code> 의 함정: 내 코드의 같은 이름 함수를 덮어쓸 수 있음. 큰 프로그램에서는 필요한 이름만 가져오거나 <code>import 모듈 as 별명</code> 을 권장합니다.</p>' },
          { layout: 'code', title: '보충: if __name__ == "__main__"', code: `# ===== File: Module2.py =====
def plus(v1, v2) :
    return v1 + v2

print("Module2의 __name__ :", __name__)

if __name__ == "__main__" :
    print("테스트 :", plus(1, 2))
# ===== File: main.py =====
import Module2

print("main.py의 __name__ :", __name__)
print("100 + 200 =", Module2.plus(100, 200))`,
            points: ['import 하면 모듈 코드가 <b>한 번 실행</b>됨', '직접 실행한 파일: <code>__name__ == "__main__"</code>', 'import 된 파일: <code>__name__ == "Module2"</code>'],
            notes: '<p><b>[3분]</b> 강의자료 마지막 장 배경에 나오는 문장입니다. 모듈 안에 테스트 코드를 두되 import 할 때는 실행되지 않게 하는 관용구라고 설명합니다.</p><p>시간이 부족하면 건너뛰어도 됩니다(📘 보충 내용).</p>' },
          { layout: 'bullets', title: '모듈의 종류', lead: '표준 모듈 · 사용자 정의 모듈 · 서드 파티 모듈',
            bullets: ['<b>표준 모듈</b>: 파이썬이 제공 — <code>random</code>, <code>math</code>, <code>turtle</code>', '<b>사용자 정의 모듈</b>: 직접 만듦 — <code>Module1.py</code>, <code>myTurtle.py</code>', '<b>서드 파티 모듈</b>: 외부 회사 · 단체가 제공', ['표준 모듈이 모든 기능을 제공하지는 않음', 'pyGame(게임), PyGTK(윈도 창), SQLAlchemy(DB)']],
            notes: '<p><b>[2분]</b> 내 PC 에서는 <code>pip install 모듈명</code> 으로 서드 파티 모듈을 설치한다는 것을 알려 주세요. 이 웹 강좌에는 pygame · Pillow 등이 미리 준비되어 있습니다.</p>' },
          { layout: 'code', title: '표준 모듈 목록 · math 모듈 살펴보기', code: `import sys
print(sys.builtin_module_names)

import math
print(dir(math))
print(math.sqrt(16), math.factorial(5))`,
            points: ['<code>sys.builtin_module_names</code>: 내장 모듈 이름', '<code>dir(모듈)</code>: 모듈의 함수 목록', 'Tip: <code>dir(__builtins__)</code> — 내장 함수'],
            notes: '<p><b>[3분]</b> 목록은 버전 · 운영체제마다 다르므로 강의자료 화면과 조금 달라도 괜찮다고 안내합니다. 셸(>>>)에서 <code>dir(math)</code> 를 치면 print 없이도 결과가 보입니다.</p><p>help(math.sqrt) 로 설명을 보는 방법도 함께 보여 주세요.</p>' },
          { layout: 'table', title: '[프로그램 2] myTurtle.py 의 함수', head: ['함수', '하는 일', '반환값'], rows: [['<code>getString()</code>', '대화상자로 문자열 입력', '문자열'], ['<code>getRGB()</code>', '난수 3개로 색 만들기', '튜플 (r, g, b)'], ['<code>getXYAS(sw, sh)</code>', '임의의 위치 · 각도 · 크기', '리스트 [x, y, angle, size]']],
            notes: '<p><b>[2분]</b> 앞 장의 “임의의 위치에 글자를 쓰는 거북이”와 기능은 같고, 도우미 함수만 모듈로 분리했다는 점을 강조합니다.</p>' },
          { layout: 'code', title: 'myTurtle.py (모듈)', run: false, code: `import random
from tkinter.simpledialog import *

def getString() :
    retStr = ''
    retStr = askstring('문자열 입력', '거북이 쓸 문자열을 입력')
    return retStr

def getRGB() :
    r, g, b = 0, 0, 0
    r = random.random()
    g = random.random()
    b = random.random()
    return (r, g, b)

def getXYAS(sw, sh) :
    x, y, angle, size = 0, 0, 0, 0
    x = random.randrange(-sw // 2, sw // 2)
    y = random.randrange(-sh // 2, sh // 2)
    angle = random.randrange(0, 360)
    size = random.randrange(10, 50)
    return [x, y, angle, size]`,
            points: ['<code>askstring()</code>: 문자열 입력 대화상자', '<code>random.random()</code>: 0~1 실수', '<code>sw // 2</code>: 강의자료 <code>sw / 2</code> 수정'],
            notes: '<p><b>[3분]</b> 이 슬라이드는 모듈 파일만 보여 주는 것이라 단독 실행하지 않습니다(run 없음). 다음 슬라이드에서 합쳐 실행합니다.</p><p>강의자료의 <code>randrange(-sw / 2, sw / 2)</code> 는 파이썬 3.12 이상에서 TypeError(실수 불가)가 나므로 정수 나눗셈 <code>//</code> 로 바꾸었다는 점을 짚어 주세요.</p>' },
          { layout: 'code', title: '[프로그램 2] 완성 — Code09-14 (main)', dialogs: ['나랏말싸미듕귁에달아문짜와로서르사맛디아니할쎄'], code: `from myTurtle import *
import turtle

inStr = ''
swidth, sheight = 300, 300
tX, tY, tAngle, tSize = [0] * 4

turtle.title('거북이 글자쓰기(모듈버전)')
turtle.shape('turtle')
turtle.setup(width = swidth + 50, height = sheight + 50)
turtle.screensize(swidth, sheight)
turtle.penup()
turtle.speed(5)

inStr = getString()
for ch in inStr :
    tX, tY, tAngle, txtSize = getXYAS(swidth, sheight)
    r, g, b = getRGB()
    turtle.goto(tX, tY)
    turtle.left(tAngle)
    turtle.pencolor((r, g, b))
    turtle.write(ch, font = ('맑은고딕', txtSize, 'bold'))

turtle.done()`,
            points: ['<code>from myTurtle import *</code>', '글자마다 위치 · 색을 함수로 받아옴', '반환값을 여러 변수로 <b>언패킹</b>'],
            notes: '<p><b>[6분]</b> 이 슬라이드 코드는 main 부분만 있으므로 <b>학생 문서의 전체 코드(myTurtle.py 포함)</b>로 실행하세요. 교사 화면에서 실행하려면 이 코드 위에 이전 슬라이드의 myTurtle.py 를 파일 구분 주석과 함께 붙여 넣어야 합니다.</p><p>발문: “turtle.left(tAngle) 때문에 글자 방향이 계속 누적되는데, 매번 같은 기준에서 돌리려면?” → setheading(tAngle). 실습 9-7 로 연결.</p>',
            run: false },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>from Module1 import func1</code> 뒤에 func1 을 호출하는 올바른 방법은?', options: ['Module1.func1()', 'func1()', 'Module1->func1()', 'import func1()'], answer: 1, explain: 'from … import 로 가져온 이름은 모듈명 없이 바로 씁니다.',
            notes: '<p><b>[1분]</b> 이어서 “import Module1 로 불러왔다면?” → Module1.func1() 도 물어보세요.</p>' },
          { layout: 'practice', title: '실습 9-6. 나만의 계산 모듈', desc: '<code>myCalc.py</code> 에 plus · minus · multiply 를 만들고 main.py 에서 import 해서 10과 3 계산',
            starter: `# ===== File: myCalc.py =====
# TODO
pass
# ===== File: main.py =====
import myCalc
# TODO
`,
            solution: `# ===== File: myCalc.py =====
def plus(a, b) :
    return a + b

def minus(a, b) :
    return a - b

def multiply(a, b) :
    return a * b
# ===== File: main.py =====
import myCalc

print("10 + 3 =", myCalc.plus(10, 3))
print("10 - 3 =", myCalc.minus(10, 3))
print("10 * 3 =", myCalc.multiply(10, 3))
`,
            notes: '<p><b>[5분]</b> 파일 구분 주석을 정확히 쓰는지 확인하며 순회합니다. 끝난 학생은 from myCalc import * 형태로 바꿔 보게 하세요.</p>' },
          { layout: 'summary', title: '정리', bullets: ['모듈 = 함수의 집합(.py 파일), <code>import</code> 로 사용', '<code>import 모듈</code> → <code>모듈.함수()</code> / <code>from 모듈 import 함수</code> → <code>함수()</code>', '표준 · 사용자 정의 · 서드 파티 모듈', '<code>dir(모듈)</code> 로 함수 목록 확인', '[프로그램 2]: 도우미 함수를 myTurtle.py 로 분리'],
            notes: '<p><b>[1분]</b> 다음 시간: 모듈을 폴더로 묶는 패키지, 그리고 내부 함수 · 람다 · map · 재귀 · 제너레이터.</p>' }
        ]
      },
      /* ===================== ch09-5 ===================== */
      {
        id: 'ch09-5',
        title: '함수의 심화 — 패키지 · 람다 · 재귀 · 제너레이터',
        minutes: 50,
        goals: [
          '패키지가 모듈을 모은 폴더임을 이해하고 from 패키지.모듈 import 로 사용할 수 있다',
          '내부 함수를 만들고, 바깥에서 호출할 수 없는 이유를 설명할 수 있다',
          'lambda 로 한 줄 함수를 만들고 map() 과 함께 사용할 수 있다',
          '재귀 함수의 동작과 멈춤 조건의 필요성을 설명할 수 있다',
          'yield 를 사용한 제너레이터 함수의 동작을 설명할 수 있다'
        ],
        flow: [['패키지', 8], ['내부 함수 · 람다', 10], ['map()', 8], ['재귀 함수', 12], ['제너레이터 · 정리', 12]],
        content: [
          { type: 'h', text: '패키지' },
          { type: 'p', html: '모듈이 “함수 여러 개가 들어 있는 .py 파일 하나”라면, <b>패키지(package)</b>는 “<b>모듈 여러 개를 모아 둔 폴더</b>”입니다. 모듈이 많아지면 주제별로 폴더를 나누어 정리하는데, 이것이 패키지입니다. 컴퓨터에서 파일이 많아지면 폴더로 정리하는 것과 똑같습니다.' },
          { type: 'figure', html: SVG_PACKAGE, caption: '그림 9-11 패키지의 개념 — 함수 → 모듈(파일) → 패키지(폴더)' },
          { type: 'p', html: '패키지 안의 모듈을 불러오는 형식은 다음과 같습니다. 폴더와 파일 사이를 점(<code>.</code>)으로 연결합니다.<pre><code>from 패키지명.모듈명 import 함수명</code></pre>[그림 9-11]처럼 <code>package</code> 폴더 안에 <code>Module1.py</code> 가 있다면 <code>from package.Module1 import *</code> 로 불러옵니다.' },
          { type: 'code', title: 'package 폴더 안의 모듈 사용하기', code: `# ===== File: package/Module1.py =====
def func1() :
    print("package/Module1.py의 func1()이 호출됨.")

def func2() :
    print("package/Module1.py의 func2()가 호출됨.")
# ===== File: package/Module2.py =====
def func3() :
    print("package/Module2.py의 func3()이 호출됨.")

def func4() :
    print("package/Module2.py의 func4()가 호출됨.")
# ===== File: main.py =====
from package.Module1 import *
from package.Module2 import func3, func4

func1()
func2()
func3()
func4()`,
            expect: 'package/Module1.py의 func1()이 호출됨.\npackage/Module1.py의 func2()가 호출됨.\npackage/Module2.py의 func3()이 호출됨.\npackage/Module2.py의 func4()가 호출됨.',
            desc: '파일 구분 주석에 <code>package/Module1.py</code> 처럼 폴더 이름을 쓰면 작업 폴더에 <code>package</code> 폴더가 만들어지고 그 안에 파일이 저장됩니다.' },
          { type: 'callout', kind: 'more', title: '📘 __init__.py 파일', html: '예전 파이썬(3.2 이하)에서는 폴더를 패키지로 인식시키려면 그 안에 <code>__init__.py</code> 라는 (비어 있어도 되는) 파일이 꼭 있어야 했습니다. 지금은 없어도 동작하지만, 많은 라이브러리가 여전히 <code>__init__.py</code> 를 두고 패키지를 불러올 때 실행할 초기화 코드를 넣습니다. <code>import tkinter.messagebox</code> 의 <code>tkinter</code> 도 패키지이고, <code>messagebox</code> 는 그 안의 모듈입니다.' },
          { type: 'h', text: '내부 함수' },
          { type: 'p', html: '함수 안에 또 함수를 만들 수 있습니다. 이것을 <b>내부 함수(inner function)</b>라고 합니다. 내부 함수는 바깥 함수 안에서만 쓰는 “전용 도구”입니다.' },
          { type: 'code', title: '내부 함수', code: `def outFunc(v1, v2) :
    def inFunc(num1, num2) :
        return num1 + num2
    return inFunc(v1, v2)

print(outFunc(10, 20))`,
            expect: '30',
            desc: '<code>outFunc()</code> 가 호출될 때 그 안에서 <code>inFunc()</code> 가 만들어지고, <code>4행</code>에서 호출되어 30을 돌려줍니다.' },
          { type: 'p', html: '내부 함수도 바깥 함수의 <b>지역</b>에 만들어진 것이므로, <code>outFunc()</code> 밖에서 <code>inFunc()</code> 를 호출하면 오류가 납니다. 지역 변수와 같은 원리입니다.' },
          { type: 'code', title: 'outFunc() 함수 밖에서 inFunc() 를 호출하면 오류', expectError: true, code: `def outFunc(v1, v2) :
    def inFunc(num1, num2) :
        return num1 + num2
    return inFunc(v1, v2)

print(inFunc(10, 20))`,
            expect: 'Traceback (most recent call last):\n  File "main.py", line 6, in <module>\n    print(inFunc(10, 20))\n          ^^^^^^\nNameError: name \'inFunc\' is not defined' },
          { type: 'h', text: '람다(lambda) 함수' },
          { type: 'p', html: '<b>람다 함수</b>는 함수를 <b>한 줄로 간단하게</b> 만들어 줍니다. 형식은 <code>lambda 매개변수1, 매개변수2 : 반환할 식</code> 이며, <code>def</code> · 함수 이름 · <code>return</code> 을 쓰지 않습니다. 콜론 뒤의 식을 계산한 값이 자동으로 반환됩니다.' },
          { type: 'code', title: '일반 함수로 두 수 더하기', code: `def hap(num1, num2) :
    res = num1 + num2
    return res

print(hap(10, 20))`,
            expect: '30' },
          { type: 'code', title: '같은 기능을 람다 함수로', code: `hap2 = lambda num1, num2 : num1 + num2
print(hap2(10, 20))`,
            expect: '30',
            desc: '람다 함수는 이름이 없는 함수라서, 변수 <code>hap2</code> 에 대입해 이름처럼 씁니다.' },
          { type: 'p', html: '람다 함수의 매개변수에도 <b>기본값</b>을 설정할 수 있습니다. 매개변수를 지정하지 않으면 기본값이 쓰이고, 넘겨주면 기본값은 무시됩니다.' },
          { type: 'code', title: '람다 함수의 매개변수에 기본값 설정', code: `hap3 = lambda num1 = 10, num2 = 20 : num1 + num2
print(hap3())
print(hap3(100, 200))`,
            expect: '30\n300' },
          { type: 'h', text: 'map() 함수' },
          { type: 'p', html: '리스트의 모든 요소에 10을 더하는 코드를 생각해 봅시다. 함수와 <code>for</code> 문을 쓰면 다음과 같습니다.' },
          { type: 'code', title: '리스트에 모두 10을 더하는 코드', code: `myList = [1, 2, 3, 4, 5]
def add10(num) :
    return num + 10

for i in range(len(myList)) :
    myList[i] = add10(myList[i])
print(myList)`,
            expect: '[11, 12, 13, 14, 15]' },
          { type: 'p', html: '<code>map(함수, 리스트)</code> 는 리스트의 <b>각 요소에 함수를 하나씩 적용</b>합니다. 결과는 map 객체라서 <code>list()</code> 로 감싸 리스트로 바꿉니다. 람다 함수와 함께 쓰면 매우 간단해집니다.' },
          { type: 'code', title: '람다 함수와 map() 함수로 간단히', code: `myList = [1, 2, 3, 4, 5]
add10 = lambda num : num + 10
myList = list(map(add10, myList))
print(myList)`,
            expect: '[11, 12, 13, 14, 15]' },
          { type: 'figure', html: SVG_MAP, caption: 'map() 은 리스트의 모든 요소에 같은 함수를 적용한다' },
          { type: 'p', html: '2행과 3행을 합쳐, 람다 함수를 <code>map()</code> 안에 바로 쓸 수도 있습니다. 람다가 가장 많이 쓰이는 모습입니다.' },
          { type: 'code', title: '2행과 3행을 합친 코드', code: `myList = [1, 2, 3, 4, 5]
myList = list(map(lambda num : num + 10, myList))
print(myList)`,
            expect: '[11, 12, 13, 14, 15]' },
          { type: 'p', html: '매개변수가 2개인 람다 함수에 리스트 2개를 넘기면, 두 리스트의 <b>같은 자리 요소끼리</b> 짝지어 함수를 적용합니다.' },
          { type: 'code', title: '두 리스트의 각 자릿수를 합쳐서 새로운 리스트로 만들기', code: `list1 = [1, 2, 3, 4]
list2 = [10, 20, 30, 40]
hapList = list(map(lambda n1, n2 : n1 + n2, list1, list2))
print(hapList)`,
            expect: '[11, 22, 33, 44]' },
          { type: 'callout', kind: 'more', title: '📘 filter() 와 리스트 컴프리헨션', html: '<code>filter(함수, 리스트)</code> 는 함수의 결과가 True 인 요소만 골라 줍니다. 또 파이썬에서는 <code>map</code> · <code>filter</code> 대신 <b>리스트 컴프리헨션</b>(7장)을 쓰는 경우도 많습니다.<pre><code>myList = [1, 2, 3, 4, 5]\nprint(list(filter(lambda n : n % 2 == 0, myList)))   # [2, 4]\nprint([n + 10 for n in myList])                     # [11, 12, 13, 14, 15]</code></pre>' },
          { type: 'code', title: '추가 예제. 람다를 정렬 기준으로 쓰기', code: `members = [("로제", 27), ("리사", 28), ("지수", 30), ("제니", 29)]
members.sort(key = lambda m : m[1])
print(members)
print(list(filter(lambda m : m[1] >= 29, members)))`,
            expect: "[('로제', 27), ('리사', 28), ('제니', 29), ('지수', 30)]\n[('제니', 29), ('지수', 30)]",
            desc: '<code>sort(key = 함수)</code> 는 각 요소에 함수를 적용한 결과(여기서는 나이)를 기준으로 정렬합니다. 한 번만 쓰고 버릴 간단한 함수라서 람다가 잘 어울립니다.' },
          { type: 'h', text: '재귀 함수' },
          { type: 'p', html: '<b>재귀 함수(recursive function)</b>는 <b>자기 자신을 호출</b>하는 함수입니다. 아래 코드는 “하”를 출력한 뒤 자기 자신을 다시 부르므로 끝없이 반복됩니다.' },
          { type: 'code', title: '자기 자신을 호출하는 함수 (멈추지 않음)', run: false, code: `def selfCall() :
    print('하', end = '')
    selfCall()
selfCall()`,
            desc: '실행하면 <code>하하하하하하하하…</code> 가 계속 출력되다가, 파이썬이 정한 호출 깊이 한계(기본 1000번 정도)를 넘으면 <code>RecursionError: maximum recursion depth exceeded</code> 오류로 멈춥니다. 그래서 이 코드는 실행 버튼 없이 보여 주기만 합니다.' },
          { type: 'callout', kind: 'warn', title: '재귀 함수에는 반드시 “멈춤 조건”이 필요하다', html: '재귀 함수는 <b>언제 그만 부를지(멈춤 조건, base case)</b>가 꼭 있어야 합니다. 그리고 호출할 때마다 문제가 조금씩 작아져서(<code>num - 1</code>) 결국 멈춤 조건에 도달해야 합니다.' },
          { type: 'code', title: '추가 예제. 멈춤 조건을 넣은 selfCall()', code: `def selfCall(num) :
    if num == 0 :        # 멈춤 조건
        return
    print('하', end = '')
    selfCall(num - 1)

selfCall(8)`,
            expect: '하하하하하하하하' },
          { type: 'p', html: '입력한 숫자부터 1까지 거꾸로 세는 함수를 재귀 함수로 만들어 봅시다.' },
          { type: 'code', title: '입력한 숫자를 1까지 세는 재귀 함수', code: `def count(num) :
    if num >= 1 :
        print(num, end = ' ')
        count(num - 1)
    else :
        return
count(10)
print()
count(20)`,
            expect: '10 9 8 7 6 5 4 3 2 1\n20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1',
            desc: '<code>count(10)</code> → 10 출력 후 <code>count(9)</code> → … → <code>count(0)</code> 에서 조건이 거짓이 되어 <code>return</code> 으로 멈춥니다. 강의자료 출력처럼 두 결과를 다른 줄에 보이도록 <code>7행</code>의 <code>print()</code> 를 추가했습니다.' },
          { type: 'p', html: '<b>팩토리얼(factorial)</b>은 1부터 n까지 곱한 값입니다(4! = 4 × 3 × 2 × 1 = 24). “n! = n × (n−1)!” 이라는 성질을 그대로 재귀 함수로 옮길 수 있습니다.' },
          { type: 'code', title: '팩토리얼 값을 구하는 재귀 함수', code: `def factorial(num) :
    if num <= 1 :
        return num
    else :
        return num * factorial(num - 1)
print(factorial(4))
print(factorial(10))`,
            expect: '24\n3628800' },
          { type: 'figure', html: SVG_RECUR, caption: 'factorial(4) 의 동작 — 멈춤 조건까지 내려갔다가 결과를 곱하며 올라온다' },
          { type: 'callout', kind: 'more', title: '📘 재귀와 반복문', html: '재귀로 풀 수 있는 문제는 대부분 <code>for</code> · <code>while</code> 반복문으로도 풀 수 있습니다. 재귀는 문제의 정의(“n! = n × (n−1)!”)를 코드로 그대로 옮길 수 있어 읽기 쉬운 장점이 있지만, 호출할 때마다 메모리를 쓰므로 아주 깊은 재귀는 반복문이 더 안전합니다. 표준 모듈에는 <code>math.factorial()</code> 도 이미 있습니다.' },
          { type: 'h', text: '제너레이터와 yield' },
          { type: 'p', html: '<code>return</code> 은 값을 돌려주면서 <b>함수를 끝냅니다</b>. 반면 <b><code>yield</code></b> 는 값을 하나 돌려준 뒤 <b>함수를 끝내지 않고 그 자리에서 잠시 멈춰</b> 있다가, 다음 값을 달라고 하면 이어서 실행합니다. <code>yield</code> 가 들어 있는 함수를 <b>제너레이터(generator, 생성자) 함수</b>라고 합니다.' },
          { type: 'code', title: 'yield 문 : 함수를 종결하지 않으면서 값을 계속 반환', code: `def genFunc() :
    yield 1
    yield 2
    yield 3

print(list(genFunc()))`,
            expect: '[1, 2, 3]' },
          { type: 'p', html: '제너레이터는 <code>for</code> 문과 함께 쓰면 그 동작이 잘 보입니다. <code>yield i</code> 로 값을 돌려준 뒤, 반복문이 다음 값을 요청하면 <code>yield</code> 다음 줄부터 이어서 실행합니다.' },
          { type: 'code', title: 'yield 문으로 값을 반환한 후 계속 진행', code: `def genFunc(num) :
    for i in range(0, num) :
        yield i
        print('제너레이터 진행 중')
for data in genFunc(5) :
    print(data)`,
            expect: '0\n제너레이터 진행 중\n1\n제너레이터 진행 중\n2\n제너레이터 진행 중\n3\n제너레이터 진행 중\n4\n제너레이터 진행 중',
            desc: '“0 출력 → 제너레이터 진행 중 → 1 출력 → …” 처럼 함수와 반복문이 번갈아 실행됩니다. 마지막 4를 돌려준 뒤에도 <code>4행</code>이 실행되고 나서 함수가 끝납니다.' },
          { type: 'callout', kind: 'more', title: '📘 제너레이터를 왜 쓸까?', html: '리스트는 모든 값을 <b>미리 만들어 메모리에 저장</b>하지만, 제너레이터는 값이 필요할 때 <b>하나씩 만들어</b> 줍니다. 그래서 값이 백만 개라도 메모리를 거의 쓰지 않습니다. 이미 써 온 <code>range()</code> 도 비슷한 방식으로 동작합니다. <code>next(제너레이터)</code> 로 값을 하나씩 직접 꺼낼 수도 있습니다.' }
        ],
        practice: [
          {
            title: '실습 9-8. 람다와 map() 으로 섭씨 → 화씨',
            level: 1,
            desc: '<p>섭씨 온도 리스트 <code>[0, 10, 20, 30, 100]</code> 을 화씨로 바꾼 리스트를 <code>map()</code> 과 람다 함수로 만드세요. (화씨 = 섭씨 × 9 / 5 + 32)</p><pre><code>[32.0, 50.0, 68.0, 86.0, 212.0]</code></pre>',
            hint: '<code>list(map(lambda c : c * 9 / 5 + 32, 리스트))</code>',
            starter: `celsius = [0, 10, 20, 30, 100]
# TODO: map() 과 lambda 로 화씨 리스트 만들기
`,
            solution: `celsius = [0, 10, 20, 30, 100]
fahrenheit = list(map(lambda c : c * 9 / 5 + 32, celsius))
print(fahrenheit)
`,
            expect: '[32.0, 50.0, 68.0, 86.0, 212.0]'
          },
          {
            title: '실습 9-9. 재귀 함수로 1부터 n까지의 합',
            level: 2,
            desc: '<p>1부터 n까지의 합을 구하는 재귀 함수 <code>sumTo(n)</code> 을 만드세요. (sumTo(n) = n + sumTo(n − 1), sumTo(1) = 1)</p><pre><code>1부터 10까지의 합 : 55\n1부터 100까지의 합 : 5050</code></pre>',
            hint: '팩토리얼 함수에서 <code>*</code> 를 <code>+</code> 로 바꾼 모양입니다. 멈춤 조건을 먼저 씁니다.',
            starter: `def sumTo(n) :
    # TODO: 멈춤 조건과 재귀 호출
    pass

print("1부터 10까지의 합 :", sumTo(10))
print("1부터 100까지의 합 :", sumTo(100))
`,
            solution: `def sumTo(n) :
    if n <= 1 :
        return n
    else :
        return n + sumTo(n - 1)

print("1부터 10까지의 합 :", sumTo(10))
print("1부터 100까지의 합 :", sumTo(100))
`,
            expect: '1부터 10까지의 합 : 55\n1부터 100까지의 합 : 5050'
          },
          {
            title: '실습 9-10. 짝수만 만들어 주는 제너레이터',
            level: 3,
            desc: '<p>0부터 num 미만의 <b>짝수</b>만 하나씩 돌려주는 제너레이터 함수 <code>evenGen(num)</code> 을 만들고, <code>for</code> 문으로 출력하세요.</p><pre><code>0 2 4 6 8</code></pre>',
            hint: '<code>for i in range(0, num)</code> 안에서 <code>if i % 2 == 0 :</code> 일 때만 <code>yield i</code>.',
            starter: `def evenGen(num) :
    # TODO: 짝수만 yield
    yield 0

for data in evenGen(10) :
    print(data, end = ' ')
`,
            solution: `def evenGen(num) :
    for i in range(0, num) :
        if i % 2 == 0 :
            yield i

for data in evenGen(10) :
    print(data, end = ' ')
`,
            expect: '0 2 4 6 8'
          }
        ],
        quiz: [
          { q: '패키지 <code>package</code> 안의 <code>Module1.py</code> 에서 모든 함수를 가져오는 문장은?', options: ['import package/Module1', 'from package.Module1 import *', 'from Module1.package import *', 'import *.Module1'], answer: 1, explain: '형식은 <code>from 패키지명.모듈명 import 함수명</code> 입니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>hap3 = lambda num1 = 10, num2 = 20 : num1 + num2\nprint(hap3(1))</code></pre>', options: ['30', '21', '11', '오류'], answer: 1, explain: '<code>num1</code> 에 1이 들어가고 <code>num2</code> 는 기본값 20이므로 21입니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>myList = [1, 2, 3]\nprint(list(map(lambda n : n * n, myList)))</code></pre>', options: ['[1, 2, 3]', '[2, 4, 6]', '[1, 4, 9]', '14'], answer: 2, explain: '각 요소를 제곱한 값의 리스트가 만들어집니다.' },
          { q: '재귀 함수에 반드시 있어야 하는 것은?', options: ['yield 문', 'global 선언', '자기 자신을 더 이상 호출하지 않는 멈춤 조건', '람다 함수'], answer: 2, explain: '멈춤 조건이 없으면 끝없이 자신을 호출하다가 RecursionError 가 발생합니다.' },
          { q: '<code>yield</code> 와 <code>return</code> 의 차이로 옳은 것은?', options: ['yield 는 값을 돌려준 뒤 함수를 끝내지 않고 멈춰 있다가 이어서 실행한다', 'yield 는 값을 돌려줄 수 없다', 'return 은 여러 번 실행될 수 있다', '둘은 완전히 같다'], answer: 0, explain: 'return 은 함수를 끝내지만, yield 는 값을 하나 내주고 그 자리에서 멈췄다가 다음 요청 때 이어서 실행합니다.' }
        ],
        slides: [
          { layout: 'title', title: '함수의 심화 내용', subtitle: 'Chapter 09 · Section 06 — 패키지 · 내부 함수 · 람다 · map · 재귀 · 제너레이터', badge: '09-5',
            notes: '<p><b>[도입 1분]</b> 이번 시간은 다양한 주제를 짧게 훑습니다. 모두 “함수를 더 잘 쓰는 방법”이라는 공통점이 있습니다. 각 주제마다 예제를 직접 실행하며 진행하세요.</p>' },
          { layout: 'diagram', title: '패키지 = 모듈을 모은 폴더', html: SVG_PACKAGE, caption: '그림 9-11 — 모듈을 주제별로 분리할 때 주로 사용',
            notes: '<p><b>[2분]</b> 함수 → 모듈(파일) → 패키지(폴더). 컴퓨터에서 파일을 폴더로 정리하는 것과 같습니다. <code>tkinter.messagebox</code> 도 패키지.모듈 형태라는 점을 연결해 주세요.</p>' },
          { layout: 'code', title: '임포트 형식: from 패키지명.모듈명 import 함수명', code: `# ===== File: package/Module1.py =====
def func1() :
    print("package/Module1.py의 func1()이 호출됨.")

def func2() :
    print("package/Module1.py의 func2()가 호출됨.")
# ===== File: main.py =====
from package.Module1 import *

func1()
func2()`,
            points: ['파일 이름에 <b>폴더/</b>를 쓰면 폴더에 저장', '<code>from package.Module1 import *</code>', '점(.)으로 폴더와 모듈을 연결'],
            notes: '<p><b>[3분]</b> 실행 후, 집에서 IDLE 로 할 때는 실제로 package 폴더를 만들고 그 안에 Module1.py 를 저장해야 한다고 안내합니다. __init__.py 는 요즘은 없어도 되지만 관례적으로 둔다는 점을 보충합니다.</p>' },
          { layout: 'two', title: '내부 함수',
            left: { title: '함수 안의 함수 ✔', code: `def outFunc(v1, v2) :\n    def inFunc(num1, num2) :\n        return num1 + num2\n    return inFunc(v1, v2)\n\nprint(outFunc(10, 20))` },
            right: { title: '밖에서 호출하면 NameError ✘', code: `def outFunc(v1, v2) :\n    def inFunc(num1, num2) :\n        return num1 + num2\n    return inFunc(v1, v2)\n\nprint(inFunc(10, 20))`, run: false },
            notes: '<p><b>[3분]</b> 내부 함수도 지역 변수처럼 바깥 함수 안에서만 존재합니다. 오른쪽을 교사 화면에서 직접 실행하려면 run 이 꺼져 있으니, 왼쪽 코드의 마지막 줄을 바꿔 오류를 보여 주세요.</p>' },
          { layout: 'two', title: '람다 함수 — 함수를 한 줄로',
            left: { title: 'def 로 만든 함수', code: `def hap(num1, num2) :\n    res = num1 + num2\n    return res\nprint(hap(10, 20))` },
            right: { title: 'lambda 로 만든 함수', code: `hap2 = lambda num1, num2 : num1 + num2\nprint(hap2(10, 20))\n\nhap3 = lambda num1 = 10, num2 = 20 : num1 + num2\nprint(hap3())\nprint(hap3(100, 200))` },
            notes: '<p><b>[4분]</b> 형식: <code>lambda 매개변수 : 식</code> — def, 이름, return 이 없다. 식의 결과가 자동 반환됩니다.</p><p>람다 매개변수에도 기본값을 쓸 수 있다(hap3): 지정하지 않으면 30, 넘기면 300.</p><p>주의: 람다에는 식 하나만 쓸 수 있고 if 문 · for 문 같은 문장은 못 넣습니다.</p>' },
          { layout: 'code', title: 'map() — 리스트의 모든 요소에 함수 적용', code: `myList = [1, 2, 3, 4, 5]
def add10(num) :
    return num + 10
for i in range(len(myList)) :
    myList[i] = add10(myList[i])
print(myList)

myList = [1, 2, 3, 4, 5]
add10 = lambda num : num + 10
myList = list(map(add10, myList))
print(myList)

myList = [1, 2, 3, 4, 5]
myList = list(map(lambda num : num + 10, myList))
print(myList)`,
            points: ['for 문 버전 → map 버전 → 한 줄 버전', '<code>map(함수, 리스트)</code>', '결과는 <code>list()</code> 로 감싸기'],
            notes: '<p><b>[4분]</b> 세 가지 버전이 같은 결과를 내는 것을 보여 줍니다. list() 를 빼고 print 하면 <code>&lt;map object at …&gt;</code> 가 나오는 것도 보여 주세요 — 흔한 실수입니다.</p>' },
          { layout: 'diagram', title: 'map() 의 동작', html: SVG_MAP, caption: '각 요소에 lambda num : num + 10 을 하나씩 적용',
            notes: '<p><b>[1분]</b> 컨베이어 벨트 비유: 요소가 하나씩 기계(함수)를 통과해 결과가 나온다.</p>' },
          { layout: 'code', title: '두 리스트의 각 자릿수를 합치기', code: `list1 = [1, 2, 3, 4]
list2 = [10, 20, 30, 40]
hapList = list(map(lambda n1, n2 : n1 + n2, list1, list2))
print(hapList)`,
            points: ['매개변수 2개인 람다 + 리스트 2개', '같은 자리 요소끼리 짝지어 적용', '결과: [11, 22, 33, 44]'],
            notes: '<p><b>[2분]</b> 보충: filter(lambda n : n % 2 == 0, 리스트), sort(key = lambda …) 도 같은 방식으로 람다를 씁니다.</p>' },
          { layout: 'code', title: '재귀 함수 — 자신이 자신을 호출', code: `def selfCall(num) :
    if num == 0 :        # 멈춤 조건
        return
    print('하', end = '')
    selfCall(num - 1)
selfCall(8)
print()

def count(num) :
    if num >= 1 :
        print(num, end = ' ')
        count(num - 1)
    else :
        return
count(10)`,
            points: ['강의자료 <code>selfCall()</code> 은 멈춤 조건이 없어 무한 호출', '→ RecursionError 로 강제 종료', '<b>멈춤 조건</b> + 문제를 작게(<code>num - 1</code>)'],
            notes: '<p><b>[4분]</b> 강의자료의 멈추지 않는 selfCall 은 “하하하…” 가 끝없이 나오다 RecursionError 로 멈춥니다(파이썬 기본 한계 약 1000번). 여기서는 멈춤 조건을 넣은 버전을 실행합니다.</p><p>비유: 거울 두 개를 마주 보게 하면 끝없이 비치는 것 = 멈춤 조건 없는 재귀.</p>' },
          { layout: 'code', title: '팩토리얼(Factorial) 값을 구하는 재귀 함수', code: `def factorial(num) :
    if num <= 1 :
        return num
    else :
        return num * factorial(num - 1)
print(factorial(4))
print(factorial(10))`,
            points: ['4! = 4 × 3 × 2 × 1 = 24', 'n! = n × (n−1)! 을 그대로 코드로', '멈춤 조건: <code>num &lt;= 1</code>'],
            notes: '<p><b>[3분]</b> 다음 슬라이드 그림으로 내려가는 호출과 올라오는 반환을 추적합니다.</p>' },
          { layout: 'diagram', title: 'factorial(4) 의 동작', html: SVG_RECUR, caption: '내려갈 때는 호출이 쌓이고, 올라올 때 곱셈이 계산된다',
            notes: '<p><b>[3분]</b> 칠판에 계단을 그려 “내려가는 길(호출) · 올라오는 길(반환)”을 설명하면 이해가 빠릅니다. 곱셈은 올라오면서 계산된다는 것이 핵심입니다.</p>' },
          { layout: 'code', title: '제너레이터와 yield', code: `def genFunc() :
    yield 1
    yield 2
    yield 3

print(list(genFunc()))

def genFunc2(num) :
    for i in range(0, num) :
        yield i
        print('제너레이터 진행 중')
for data in genFunc2(5) :
    print(data)`,
            points: ['<code>yield</code>: 값을 내주고 <b>멈춤</b> (종료 X)', '다음 요청 때 이어서 실행', 'yield 가 있는 함수 = 제너레이터 함수'],
            notes: '<p><b>[4분]</b> 출력 순서(0 → 진행 중 → 1 → 진행 중 …)를 먼저 예측시킨 뒤 실행합니다. 강의자료의 두 번째 genFunc 는 이름이 겹쳐서 슬라이드에서는 genFunc2 로 이름을 바꿨습니다.</p><p>왜 쓰나: 값을 필요할 때 하나씩 만들어 메모리를 아낀다(range 와 비슷).</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '실행 결과는?<pre><code>def factorial(num) :\n    if num &lt;= 1 :\n        return num\n    else :\n        return num * factorial(num - 1)\nprint(factorial(5))</code></pre>', options: ['15', '24', '120', '오류'], answer: 2, explain: '5 × 4 × 3 × 2 × 1 = 120',
            notes: '<p><b>[1분]</b> 15를 고른 학생은 곱셈과 덧셈을 헷갈린 것입니다(실습 9-9 가 덧셈 버전).</p>' },
          { layout: 'practice', title: '실습 9-9. 재귀 함수로 1부터 n까지의 합', desc: 'sumTo(n) = n + sumTo(n − 1), sumTo(1) = 1 을 재귀 함수로 만들기',
            starter: `def sumTo(n) :
    # TODO
    pass

print("1부터 10까지의 합 :", sumTo(10))
`,
            solution: `def sumTo(n) :
    if n <= 1 :
        return n
    else :
        return n + sumTo(n - 1)

print("1부터 10까지의 합 :", sumTo(10))
print("1부터 100까지의 합 :", sumTo(100))
`,
            notes: '<p><b>[4분]</b> 팩토리얼 코드를 참고하게 하세요. sumTo(5000) 을 시켜 보면 RecursionError 가 날 수 있다 → 깊은 재귀는 반복문이 안전하다는 보충으로 마무리할 수 있습니다.</p>' },
          { layout: 'summary', title: '9장 정리', bullets: ['함수: <code>def</code> · 매개변수 · <code>return</code> · 지역/전역 변수 · <code>global</code>', '매개변수: 기본값 · <code>*para</code>(튜플) · <code>**para</code>(딕셔너리)', '모듈(.py) → 패키지(폴더), <code>import</code> / <code>from … import</code>', '<code>lambda</code> + <code>map()</code> 으로 간단하게', '재귀 함수는 멈춤 조건 필수, <code>yield</code> = 제너레이터'],
            notes: '<p><b>[2분]</b> 장 전체를 정리합니다. 두 프로그램(로또 · 거북이)을 다시 떠올리며 “어디에 함수가, 어디에 모듈이 쓰였나?” 를 질문하세요.</p><p>다음 장 예고: 윈도 프로그래밍(tkinter) — 오늘 쓴 askstring 이 들어 있던 그 모듈입니다.</p>' }
        ]
      }
    ]
  });
})();
