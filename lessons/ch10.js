/* Chapter 10. 윈도 프로그래밍 (tkinter)
 * 강의자료: Ch10_윈도 프로그래밍.pptx (Section 01 ~ 05)
 * 예제 그림: assets/GIF/*.gif (tools/assets/ch10_assets.py 로 직접 그린 그림 — 교재 사진을 쓰지 않음)
 */
(function () {
  /* ───────────── 공용 그림(SVG) 도우미 ───────────── */
  // 윈도 창 모양: 제목 표시줄 + 본문
  const WIN = (x, y, w, h, title, body, hl) => `<g>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="var(--card)" stroke="${hl || 'var(--line)'}" stroke-width="3"/>
  <rect x="${x}" y="${y}" width="${w}" height="38" rx="8" fill="var(--muted)" opacity="0.28"/>
  <text x="${x + 16}" y="${y + 26}" font-size="19" fill="var(--fg)">🪶 ${title}</text>
  <text x="${x + w - 96}" y="${y + 27}" font-size="20" fill="var(--muted)">─  ☐  ✕</text>
  ${body || ''}</g>`;
  const BTN = (x, y, w, h, t, col) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="var(--card)" stroke="${col || 'var(--muted)'}" stroke-width="2.5"/>
  <text x="${x + w / 2}" y="${y + h / 2 + 7}" text-anchor="middle" font-size="19" fill="var(--fg)">${t}</text>`;
  const ARROW = (id, col) => `<marker id="${id}" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="${col}"/></marker>`;

  const FIG_PROGRAMS = `<svg viewBox="0 0 1280 520" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  ${WIN(30, 30, 590, 430, '사진 앨범 보기', `${BTN(190, 82, 110, 34, '&lt;&lt; 이전', 'var(--danger)')}${BTN(350, 82, 110, 34, '다음 &gt;&gt;', 'var(--danger)')}
  <rect x="60" y="135" width="530" height="300" fill="#6fa8dc"/><rect x="60" y="300" width="530" height="135" fill="#1f4e8c"/>
  <polygon points="90,300 220,215 350,300" fill="#4f6f68"/><polygon points="380,300 420,190 480,180 530,240 550,300" fill="#7a5040"/>
  <text x="80" y="170" font-size="22" fill="#fff" font-weight="bold">제주 1 · 바다와 섬</text>`)}
  <text x="325" y="495" text-anchor="middle" font-size="24" font-weight="bold" fill="var(--accent)">[프로그램 1] 사진 앨범 — 버튼 · place()</text>
  ${WIN(680, 30, 570, 430, '명화 감상하기', `<rect x="682" y="68" width="566" height="30" fill="var(--card)"/><text x="696" y="90" font-size="19" fill="var(--fg)">파일</text>
  <rect x="690" y="98" width="170" height="84" fill="var(--card)" stroke="var(--danger)" stroke-width="2.5"/>
  <text x="706" y="128" font-size="18" fill="var(--fg)">파일 열기</text><line x1="696" y1="142" x2="854" y2="142" stroke="var(--line)" stroke-width="2"/><text x="706" y="170" font-size="18" fill="var(--fg)">프로그램 종료</text>
  <rect x="890" y="110" width="220" height="290" fill="#1a2d6e"/>
  <circle cx="930" cy="150" r="18" fill="#fbe27a"/><circle cx="1060" cy="170" r="16" fill="#fbe27a"/>
  <path d="M900,230 q60,-50 110,0 t100,0" fill="none" stroke="#8fb0e0" stroke-width="6"/>
  <polygon points="890,330 950,300 1030,320 1110,300 1110,400 890,400" fill="#1e3c46"/>`)}
  <text x="965" y="495" text-anchor="middle" font-size="24" font-weight="bold" fill="var(--accent2)">[프로그램 2] 명화 감상 — 메뉴 · 파일 대화상자</text>
</svg>`;

  const FIG_ANATOMY = `<svg viewBox="0 0 1280 520" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <defs>${ARROW('c10arA', 'var(--accent)')}</defs>
  ${WIN(60, 40, 560, 420, '윈도창 연습', `${BTN(120, 120, 180, 44, '버튼(Button)')}
  <text x="120" y="215" font-size="22" fill="var(--accent2)">레이블(Label) 글자</text>
  <rect x="120" y="245" width="22" height="22" fill="none" stroke="var(--fg)" stroke-width="2"/><text x="152" y="264" font-size="20" fill="var(--fg)">체크버튼(Checkbutton)</text>
  <circle cx="131" cy="306" r="11" fill="none" stroke="var(--fg)" stroke-width="2"/><text x="152" y="314" font-size="20" fill="var(--fg)">라디오버튼(Radiobutton)</text>
  <rect x="120" y="345" width="160" height="90" fill="var(--ok)" opacity="0.35"/><text x="200" y="398" text-anchor="middle" font-size="20" fill="var(--fg)">그림 레이블</text>`)}
  <line x1="700" y1="60" x2="630" y2="60" stroke="var(--accent)" stroke-width="3" marker-end="url(#c10arA)"/>
  <text x="710" y="68" font-size="22" fill="var(--fg)"><tspan font-weight="bold">window = Tk()</tspan> — 빈 윈도창(루트 창)</text>
  <line x1="700" y1="150" x2="310" y2="142" stroke="var(--accent)" stroke-width="3" marker-end="url(#c10arA)"/>
  <text x="710" y="158" font-size="22" fill="var(--fg)"><tspan font-weight="bold">위젯(widget)</tspan> — 창에 올리는 부품</text>
  <text x="710" y="192" font-size="19" fill="var(--muted)">위젯 = 클래스(Label, Button …)로 만든 객체</text>
  <text x="710" y="270" font-size="22" fill="var(--fg)">① 창 만들기 <tspan font-family="monospace" fill="var(--accent2)">Tk()</tspan></text>
  <text x="710" y="310" font-size="22" fill="var(--fg)">② 위젯 만들기 <tspan font-family="monospace" fill="var(--accent2)">Label(window, …)</tspan></text>
  <text x="710" y="350" font-size="22" fill="var(--fg)">③ 창에 배치 <tspan font-family="monospace" fill="var(--accent2)">pack() · place()</tspan></text>
  <text x="710" y="390" font-size="22" fill="var(--fg)">④ 이벤트 기다리기 <tspan font-family="monospace" fill="var(--accent2)">mainloop()</tspan></text>
  <rect x="700" y="236" width="540" height="176" rx="12" fill="none" stroke="var(--line)" stroke-width="2" stroke-dasharray="8 6"/>
</svg>`;

  const FIG_LOOP = `<svg viewBox="0 0 1280 400" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <defs>${ARROW('c10arB', 'var(--fg)')}</defs>
  <rect x="40" y="130" width="240" height="120" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="160" y="182" text-anchor="middle" font-size="23" font-weight="bold" fill="var(--accent)">화면 구성 코드</text>
  <text x="160" y="216" text-anchor="middle" font-size="18" fill="var(--muted)">Tk() · 위젯 · pack()</text>
  <line x1="285" y1="190" x2="400" y2="190" stroke="var(--fg)" stroke-width="3" marker-end="url(#c10arB)"/>
  <circle cx="620" cy="190" r="150" fill="none" stroke="var(--warn)" stroke-width="4" stroke-dasharray="12 8"/>
  <text x="620" y="150" text-anchor="middle" font-size="26" font-weight="bold" fill="var(--warn)">mainloop()</text>
  <text x="620" y="190" text-anchor="middle" font-size="20" fill="var(--fg)">이벤트가 올 때까지 기다림</text>
  <text x="620" y="222" text-anchor="middle" font-size="20" fill="var(--fg)">→ 이벤트 처리 함수 호출</text>
  <text x="620" y="254" text-anchor="middle" font-size="20" fill="var(--fg)">→ 다시 기다림 (반복)</text>
  <text x="900" y="120" font-size="21" fill="var(--fg)">🖱 클릭 · ⌨ 키 입력 · 메뉴 선택</text>
  <text x="900" y="152" font-size="18" fill="var(--muted)">= 이벤트(event)</text>
  <line x1="890" y1="140" x2="775" y2="160" stroke="var(--fg)" stroke-width="3" marker-end="url(#c10arB)"/>
  <text x="900" y="270" font-size="21" fill="var(--fg)">✕ 창 닫기 / quit()</text>
  <text x="900" y="302" font-size="18" fill="var(--muted)">→ mainloop() 가 끝남</text>
  <line x1="775" y1="240" x2="890" y2="262" stroke="var(--fg)" stroke-width="3" marker-end="url(#c10arB)"/>
</svg>`;

  const ANCH = [['NW', 'nw'], ['N', 'n'], ['NE', 'ne'], ['W', 'w'], ['CENTER', 'center'], ['E', 'e'], ['SW', 'sw'], ['S', 's'], ['SE', 'se']];
  const FIG_ANCHOR = `<svg viewBox="0 0 1280 440" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="80" y="40" width="540" height="360" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  ${ANCH.map(([n], i) => { const cx = 80 + 90 + (i % 3) * 180, cy = 40 + 60 + Math.floor(i / 3) * 120; return `<circle cx="${cx}" cy="${cy}" r="8" fill="var(--accent)"/><text x="${cx}" y="${cy + 38}" text-anchor="middle" font-size="22" font-weight="bold" fill="${n === 'SE' ? 'var(--danger)' : 'var(--fg)'}">${n}</text>`; }).join('')}
  <text x="350" y="432" text-anchor="middle" font-size="20" fill="var(--muted)">레이블 영역 안에서 글자가 놓이는 위치 (anchor)</text>
  <text x="680" y="90" font-size="24" font-weight="bold" fill="var(--fg)">anchor = 나침반 방향</text>
  <text x="680" y="140" font-size="21" fill="var(--fg)">N 북(위) · S 남(아래)</text>
  <text x="680" y="175" font-size="21" fill="var(--fg)">W 서(왼쪽) · E 동(오른쪽)</text>
  <text x="680" y="210" font-size="21" fill="var(--fg)">SE = 오른쪽 아래 · CENTER = 가운데(기본)</text>
  <text x="680" y="270" font-size="20" fill="var(--muted)">※ width · height 로 레이블을 글자보다</text>
  <text x="680" y="300" font-size="20" fill="var(--muted)">크게 만들어야 차이가 보입니다</text>
  <text x="680" y="360" font-size="20" font-family="monospace" fill="var(--accent2)">Label(..., width=20, height=5,</text>
  <text x="680" y="390" font-size="20" font-family="monospace" fill="var(--accent2)">      anchor=SE)</text>
</svg>`;

  const FIG_COMMAND = `<svg viewBox="0 0 1280 420" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <defs>${ARROW('c10arC', 'var(--ok)')}${ARROW('c10arD', 'var(--danger)')}</defs>
  <rect x="40" y="40" width="560" height="150" rx="14" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="60" y="80" font-size="22" font-family="monospace" fill="var(--fg)">def myFunc() :</text>
  <text x="60" y="112" font-size="22" font-family="monospace" fill="var(--fg)">    messagebox.showinfo(…)</text>
  <text x="60" y="165" font-size="22" font-family="monospace" fill="var(--fg)">Button(…, command = <tspan fill="var(--ok)" font-weight="bold">myFunc</tspan>)</text>
  <text x="640" y="95" font-size="22" fill="var(--ok)" font-weight="bold">✔ 함수 이름만 넘긴다</text>
  <text x="640" y="130" font-size="20" fill="var(--fg)">"버튼이 눌리면 이 함수를 불러 줘" 라고 등록</text>
  <text x="640" y="162" font-size="20" fill="var(--muted)">→ 클릭할 때마다 mainloop 가 myFunc() 호출</text>
  <rect x="40" y="230" width="560" height="150" rx="14" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
  <text x="60" y="310" font-size="22" font-family="monospace" fill="var(--fg)">Button(…, command = <tspan fill="var(--danger)" font-weight="bold">myFunc()</tspan>)</text>
  <text x="640" y="285" font-size="22" fill="var(--danger)" font-weight="bold">✘ 괄호를 붙이면</text>
  <text x="640" y="320" font-size="20" fill="var(--fg)">버튼을 만드는 순간 함수가 한 번 실행되고,</text>
  <text x="640" y="352" font-size="20" fill="var(--fg)">그 결과(None)가 command 에 들어가 클릭해도 반응 없음</text>
</svg>`;

  const FIG_PACK = `<svg viewBox="0 0 1280 380" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  ${WIN(30, 30, 280, 110, 'side=LEFT', `${BTN(40, 82, 84, 40, '버튼1')}${BTN(126, 82, 84, 40, '버튼2')}${BTN(212, 82, 84, 40, '버튼3')}`)}
  ${WIN(340, 30, 280, 110, 'side=RIGHT', `${BTN(350, 82, 84, 40, '버튼3')}${BTN(436, 82, 84, 40, '버튼2')}${BTN(522, 82, 84, 40, '버튼1')}`)}
  ${WIN(650, 30, 280, 190, 'side=TOP', `${BTN(738, 78, 104, 40, '버튼1')}${BTN(738, 122, 104, 40, '버튼2')}${BTN(738, 166, 104, 40, '버튼3')}`)}
  ${WIN(960, 30, 280, 190, 'side=BOTTOM', `${BTN(1048, 78, 104, 40, '버튼3')}${BTN(1048, 122, 104, 40, '버튼2')}${BTN(1048, 166, 104, 40, '버튼1')}`)}
  ${WIN(340, 200, 280, 170, 'fill=X', `${BTN(346, 244, 268, 38, '버튼1')}${BTN(346, 286, 268, 38, '버튼2')}${BTN(346, 328, 268, 38, '버튼3')}`)}
  <text x="40" y="200" font-size="20" fill="var(--fg)">먼저 pack 한 위젯이</text>
  <text x="40" y="230" font-size="20" fill="var(--fg)">지정한 쪽 끝부터 자리를 차지</text>
  <text x="40" y="275" font-size="20" fill="var(--muted)">RIGHT 는 오른쪽부터</text>
  <text x="40" y="305" font-size="20" fill="var(--muted)">→ 버튼3 · 버튼2 · 버튼1 순서로 보임</text>
  <text x="660" y="280" font-size="20" fill="var(--fg)">fill=X : 창의 가로 폭에 맞게 늘림</text>
  <text x="660" y="315" font-size="20" fill="var(--muted)">(fill=Y 세로 · fill=BOTH 양쪽)</text>
</svg>`;

  const FIG_PAD = `<svg viewBox="0 0 1280 420" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="300" y="40" text-anchor="middle" font-size="24" font-weight="bold" fill="var(--accent)">padx · pady (바깥 여백)</text>
  <rect x="80" y="70" width="440" height="300" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
  <rect x="120" y="110" width="360" height="100" fill="var(--accent)" opacity="0.15"/>
  <rect x="160" y="140" width="280" height="40" rx="5" fill="var(--card)" stroke="var(--muted)" stroke-width="2.5"/><text x="300" y="167" text-anchor="middle" font-size="20" fill="var(--fg)">버튼1</text>
  <text x="140" y="165" text-anchor="middle" font-size="18" fill="var(--accent)">↔</text><text x="300" y="132" text-anchor="middle" font-size="18" fill="var(--accent)">↕ pady</text>
  <rect x="160" y="240" width="280" height="40" rx="5" fill="var(--card)" stroke="var(--muted)" stroke-width="2.5"/><text x="300" y="267" text-anchor="middle" font-size="20" fill="var(--fg)">버튼2</text>
  <text x="300" y="340" text-anchor="middle" font-size="19" fill="var(--muted)">위젯과 위젯 · 창 테두리 사이가 벌어짐</text>
  <text x="960" y="40" text-anchor="middle" font-size="24" font-weight="bold" fill="var(--accent2)">ipadx · ipady (안쪽 여백)</text>
  <rect x="740" y="70" width="440" height="300" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
  <rect x="742" y="100" width="436" height="80" rx="5" fill="var(--accent2)" opacity="0.15" stroke="var(--muted)" stroke-width="2.5"/><text x="960" y="147" text-anchor="middle" font-size="20" fill="var(--fg)">버튼1</text>
  <text x="960" y="120" text-anchor="middle" font-size="18" fill="var(--accent2)">↕ ipady</text>
  <rect x="742" y="182" width="436" height="80" rx="5" fill="var(--accent2)" opacity="0.15" stroke="var(--muted)" stroke-width="2.5"/><text x="960" y="229" text-anchor="middle" font-size="20" fill="var(--fg)">버튼2</text>
  <text x="960" y="340" text-anchor="middle" font-size="19" fill="var(--muted)">위젯 자체가 뚱뚱해짐 (글자 둘레가 넓어짐)</text>
</svg>`;

  const FIG_PLACE = `<svg viewBox="0 0 1280 460" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="80" y="40" width="420" height="420" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
  ${[0, 1, 2].map((r) => [0, 1, 2].map((k) => { const n = r * 3 + k, x = 80 + k * 140, y = 40 + r * 140; return `<rect x="${x + 6}" y="${y + 6}" width="128" height="128" rx="6" fill="var(--accent)" opacity="${0.12 + n * 0.05}"/><text x="${x + 70}" y="${y + 70}" text-anchor="middle" font-size="22" font-weight="bold" fill="var(--fg)">num=${n}</text><text x="${x + 70}" y="${y + 100}" text-anchor="middle" font-size="17" fill="var(--muted)">(${k * 70}, ${r * 70})</text>`; }).join('')).join('')}
  <text x="80" y="30" font-size="18" fill="var(--danger)">(0,0)</text>
  <text x="560" y="80" font-size="24" font-weight="bold" fill="var(--fg)">place(x=가로, y=세로)</text>
  <text x="560" y="120" font-size="20" fill="var(--fg)">창의 왼쪽 위가 원점 (0, 0)</text>
  <text x="560" y="152" font-size="20" fill="var(--fg)">x 는 오른쪽으로, y 는 아래로 커짐 (픽셀)</text>
  <text x="560" y="210" font-size="20" font-family="monospace" fill="var(--accent2)">for i in range(0, 3) :      # 행</text>
  <text x="560" y="242" font-size="20" font-family="monospace" fill="var(--accent2)">    for k in range(0, 3) :  # 열</text>
  <text x="560" y="274" font-size="20" font-family="monospace" fill="var(--accent2)">        place(x=xPos, y=yPos)</text>
  <text x="560" y="306" font-size="20" font-family="monospace" fill="var(--accent2)">        num += 1; xPos += 70</text>
  <text x="560" y="338" font-size="20" font-family="monospace" fill="var(--accent2)">    xPos = 0; yPos += 70</text>
  <text x="560" y="390" font-size="19" fill="var(--muted)">※ 그림은 설명을 위해 2배로 확대 (실제 한 칸 = 70픽셀)</text>
</svg>`;

  const FIG_ALBUM = `<svg viewBox="0 0 1280 330" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <defs>${ARROW('c10arE', 'var(--ok)')}${ARROW('c10arF', 'var(--danger)')}</defs>
  ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `<rect x="${60 + i * 128}" y="110" width="112" height="76" rx="8" fill="var(--card)" stroke="${i === 0 || i === 8 ? 'var(--warn)' : 'var(--line)'}" stroke-width="3"/><text x="${116 + i * 128}" y="145" text-anchor="middle" font-size="18" fill="var(--fg)">jeju${i + 1}.gif</text><text x="${116 + i * 128}" y="172" text-anchor="middle" font-size="18" fill="var(--muted)">num=${i}</text>`).join('')}
  <path d="M170,100 Q230,50 290,100" fill="none" stroke="var(--ok)" stroke-width="3" marker-end="url(#c10arE)"/>
  <text x="230" y="50" text-anchor="middle" font-size="19" fill="var(--ok)">다음 &gt;&gt; : num += 1</text>
  <path d="M1110,196 Q640,320 120,196" fill="none" stroke="var(--ok)" stroke-width="3" stroke-dasharray="10 6" marker-end="url(#c10arE)"/>
  <text x="640" y="300" text-anchor="middle" font-size="19" fill="var(--ok)">8 보다 커지면 → num = 0 (처음으로)</text>
  <path d="M290,196 Q230,240 170,196" fill="none" stroke="var(--danger)" stroke-width="3" marker-end="url(#c10arF)"/>
  <text x="330" y="245" font-size="19" fill="var(--danger)">&lt;&lt; 이전 : num -= 1 (0 보다 작아지면 num = 8)</text>
</svg>`;

  const FIG_EVENT = `<svg viewBox="0 0 1280 400" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <defs>${ARROW('c10arG', 'var(--accent)')}</defs>
  ${WIN(40, 40, 380, 300, 'tk', `<text x="230" y="200" text-anchor="middle" font-size="40">🖱</text><text x="230" y="250" text-anchor="middle" font-size="19" fill="var(--muted)">(x, y) 위치에서 클릭</text>`)}
  <line x1="430" y1="190" x2="520" y2="190" stroke="var(--accent)" stroke-width="3" marker-end="url(#c10arG)"/>
  <rect x="530" y="70" width="330" height="240" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="695" y="110" text-anchor="middle" font-size="22" font-weight="bold" fill="var(--accent)">event 객체</text>
  <text x="555" y="150" font-size="20" font-family="monospace" fill="var(--fg)">event.num  = 1 (왼쪽)</text>
  <text x="555" y="182" font-size="20" font-family="monospace" fill="var(--fg)">event.x    = 70</text>
  <text x="555" y="214" font-size="20" font-family="monospace" fill="var(--fg)">event.y    = 166</text>
  <text x="555" y="246" font-size="20" font-family="monospace" fill="var(--fg)">event.widget = 위젯</text>
  <text x="555" y="286" font-size="18" fill="var(--muted)">키보드: keycode · keysym · char</text>
  <line x1="870" y1="190" x2="950" y2="190" stroke="var(--accent)" stroke-width="3" marker-end="url(#c10arG)"/>
  <rect x="960" y="100" width="290" height="180" rx="14" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="980" y="150" font-size="20" font-family="monospace" fill="var(--fg)">def clickMouse(event):</text>
  <text x="980" y="185" font-size="20" font-family="monospace" fill="var(--muted)">    … event.x …</text>
  <text x="980" y="240" font-size="18" fill="var(--ok)">bind 로 등록한 함수가 호출됨</text>
  <text x="640" y="370" text-anchor="middle" font-size="20" fill="var(--fg)"><tspan font-family="monospace" fill="var(--accent2)">window.bind("&lt;Button&gt;", clickMouse)</tspan>  — 이벤트 코드와 처리 함수를 연결</text>
</svg>`;

  const FIG_MENU = `<svg viewBox="0 0 1280 420" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="40" y="40" width="520" height="340" rx="16" fill="none" stroke="var(--accent)" stroke-width="3"/>
  <text x="60" y="30" font-size="20" fill="var(--accent)">메뉴 자체 (mainMenu) — window.config(menu = mainMenu)</text>
  <rect x="80" y="80" width="190" height="56" rx="8" fill="var(--accent2)" opacity="0.85"/><text x="175" y="116" text-anchor="middle" font-size="22" font-weight="bold" fill="#fff">상위 메뉴 [파일]</text>
  <path d="M175,136 V300 M175,200 H300 M175,300 H300" fill="none" stroke="var(--fg)" stroke-width="3"/>
  <rect x="300" y="172" width="220" height="56" rx="8" fill="var(--ok)" opacity="0.85"/><text x="410" y="208" text-anchor="middle" font-size="21" fill="#fff">하위 메뉴 [열기]</text>
  <line x1="300" y1="250" x2="520" y2="250" stroke="var(--muted)" stroke-width="2" stroke-dasharray="6 5"/><text x="530" y="256" font-size="16" fill="var(--muted)">separator</text>
  <rect x="300" y="272" width="220" height="56" rx="8" fill="var(--ok)" opacity="0.85"/><text x="410" y="308" text-anchor="middle" font-size="21" fill="#fff">하위 메뉴 [종료]</text>
  <text x="640" y="90" font-size="20" font-family="monospace" fill="var(--fg)">mainMenu = Menu(window)</text>
  <text x="640" y="122" font-size="20" font-family="monospace" fill="var(--fg)">window.config(menu = mainMenu)</text>
  <text x="640" y="172" font-size="20" font-family="monospace" fill="var(--accent2)">fileMenu = Menu(mainMenu)</text>
  <text x="640" y="204" font-size="20" font-family="monospace" fill="var(--accent2)">mainMenu.add_cascade(label="파일",</text>
  <text x="640" y="236" font-size="20" font-family="monospace" fill="var(--accent2)">                     menu=fileMenu)</text>
  <text x="640" y="286" font-size="20" font-family="monospace" fill="var(--ok)">fileMenu.add_command(label="열기", …)</text>
  <text x="640" y="318" font-size="20" font-family="monospace" fill="var(--muted)">fileMenu.add_separator()</text>
  <text x="640" y="350" font-size="20" font-family="monospace" fill="var(--ok)">fileMenu.add_command(label="종료", …)</text>
</svg>`;

  /* ───────────── 자주 쓰는 코드 ───────────── */
  const C10_12 = `from tkinter import *
from time import *

## 전역 변수 선언 부분 ##
fnameList = ["jeju1.gif", "jeju2.gif", "jeju3.gif", "jeju4.gif", "jeju5.gif",
             "jeju6.gif", "jeju7.gif", "jeju8.gif", "jeju9.gif"]
photoList = [None] * 9
num = 0

## 함수 선언 부분 ##
def clickNext() :
    global num
    num += 1
    if num > 8 :
        num = 0
    photo = PhotoImage(file = "GIF/" + fnameList[num])
    pLabel.configure(image = photo)
    pLabel.image = photo

def clickPrev() :
    global num
    num -= 1
    if num < 0 :
        num = 8
    photo = PhotoImage(file = "GIF/" + fnameList[num])
    pLabel.configure(image = photo)
    pLabel.image = photo

## 메인 코드 부분 ##
window = Tk()
window.geometry("700x500")
window.title("사진 앨범 보기")

btnPrev = Button(window, text = "<< 이전", command = clickPrev)
btnNext = Button(window, text = "다음 >>", command = clickNext)

photo = PhotoImage(file = "GIF/" + fnameList[0])
pLabel = Label(window, image = photo)

btnPrev.place(x = 250, y = 10)
btnNext.place(x = 400, y = 10)
pLabel.place(x = 15, y = 50)

window.mainloop()`;

  const C10_22 = `from tkinter import *
from tkinter.filedialog import *

## 함수 선언 부분 ##
def func_open() :
    filename = askopenfilename(parent = window, filetypes = (("GIF 파일", "*.gif"),
                               ("모든 파일", "*.*")))
    photo = PhotoImage(file = filename)
    pLabel.configure(image = photo)
    pLabel.image = photo

def func_exit() :
    window.quit()
    window.destroy()

## 메인 코드 부분 ##
window = Tk()
window.geometry("400x400")
window.title("명화 감상하기")

photo = PhotoImage()
pLabel = Label(window, image = photo)
pLabel.pack(expand = 1, anchor = CENTER)

mainMenu = Menu(window)
window.config(menu = mainMenu)
fileMenu = Menu(mainMenu)
mainMenu.add_cascade(label = "파일", menu = fileMenu)
fileMenu.add_command(label = "파일 열기", command = func_open)
fileMenu.add_separator()
fileMenu.add_command(label = "프로그램 종료", command = func_exit)

window.mainloop()`;

  const C10_ZOOM = `from tkinter import *
from tkinter.filedialog import *
from tkinter.simpledialog import *

## 전역 변수 선언 부분 ##
photo = None

## 함수 선언 부분 ##
def func_open() :
    global photo
    filename = askopenfilename(parent = window, filetypes = (("GIF 파일", "*.gif"),
                               ("모든 파일", "*.*")))
    if filename == "" :          # [취소]를 누른 경우
        return
    photo = PhotoImage(file = filename)
    pLabel.configure(image = photo)
    pLabel.image = photo

def func_zoom() :
    global photo
    if photo == None :
        return
    value = askinteger("확대배수", "확대할 배수를 입력하세요(2~4)", minvalue = 2, maxvalue = 4)
    if value == None :
        return
    photo = photo.zoom(value, value)
    pLabel.configure(image = photo)
    pLabel.image = photo

def func_subsample() :
    global photo
    if photo == None :
        return
    value = askinteger("축소배수", "축소할 배수를 입력하세요(2~4)", minvalue = 2, maxvalue = 4)
    if value == None :
        return
    photo = photo.subsample(value, value)
    pLabel.configure(image = photo)
    pLabel.image = photo

def func_exit() :
    window.quit()
    window.destroy()

## 메인 코드 부분 ##
window = Tk()
window.geometry("600x600")
window.title("명화 감상하기 (확대 · 축소)")

pLabel = Label(window)
pLabel.pack(expand = 1, anchor = CENTER)

mainMenu = Menu(window)
window.config(menu = mainMenu)

fileMenu = Menu(mainMenu)
mainMenu.add_cascade(label = "파일", menu = fileMenu)
fileMenu.add_command(label = "파일 열기", command = func_open)
fileMenu.add_separator()
fileMenu.add_command(label = "프로그램 종료", command = func_exit)

imageMenu = Menu(mainMenu)
mainMenu.add_cascade(label = "이미지 효과", menu = imageMenu)
imageMenu.add_command(label = "확대하기", command = func_zoom)
imageMenu.add_command(label = "축소하기", command = func_subsample)

window.mainloop()`;

  PY_COURSE.addChapter({
    id: 'ch10',
    no: '10',
    title: '윈도 프로그래밍',
    subtitle: 'tkinter 위젯 · 배치 · 이벤트 · 메뉴 · 대화상자',
    summary: 'tkinter 로 창(윈도)을 만들고 레이블 · 버튼 · 체크버튼 · 라디오버튼을 배치한 뒤, 마우스 · 키보드 이벤트와 메뉴 · 대화상자를 처리하여 사진 앨범과 명화 감상 프로그램을 만듭니다.',
    goals: [
      '윈도 프로그래밍(GUI)의 개념과 tkinter 프로그램의 기본 구조(Tk → 위젯 → 배치 → mainloop)를 설명할 수 있다',
      '레이블 · 버튼 · 체크버튼 · 라디오버튼 위젯을 만들고 command 로 함수를 연결할 수 있다',
      'pack() 의 side · fill · padx · ipadx 옵션과 place() 로 위젯을 원하는 위치에 배치할 수 있다',
      'bind() 로 마우스 · 키보드 이벤트를 처리하고 event 객체의 정보를 활용할 수 있다',
      '메뉴와 대화상자(askinteger · askopenfilename)를 이용해 사진 앨범 · 명화 감상 프로그램을 완성할 수 있다'
    ],
    sections: [
      /* ───────────────────────── 1교시: 윈도 프로그래밍 시작 · 레이블 ───────────────────────── */
      {
        id: 'ch10-1',
        title: '윈도 프로그래밍의 시작과 레이블',
        minutes: 50,
        goals: [
          '이 장에서 만들 두 프로그램(사진 앨범 · 명화 감상)의 동작을 설명할 수 있다',
          'Tk() 로 창을 만들고 title() · geometry() · resizable() 로 창을 꾸밀 수 있다',
          'mainloop() 가 이벤트를 기다리는 반복이라는 것을 이해한다',
          'Label 의 text · font · fg · bg · width · height · anchor 옵션을 사용할 수 있다',
          'PhotoImage 로 GIF 그림을 읽어 레이블에 표시할 수 있다'
        ],
        flow: [['도입: 만들 프로그램 미리 보기', 5], ['GUI 와 tkinter · 기본 창', 12], ['레이블 옵션', 13], ['그림 레이블 · SELF STUDY 10-1', 15], ['정리 · 퀴즈', 5]],
        content: [
          { type: 'h', text: '이 장에서 만들 프로그램' },
          { type: 'p', html: '지금까지 만든 프로그램은 모두 <b>콘솔(검은 글자 화면)</b>에서 글자로 입력받고 글자로 출력했습니다. 하지만 우리가 매일 쓰는 프로그램은 창(윈도)이 뜨고, 버튼을 누르고, 메뉴를 고르는 방식입니다. 이번 장에서는 파이썬에 기본으로 들어 있는 <b>tkinter</b> 모듈로 이런 <b>윈도 프로그램</b>을 만들어 봅니다. 장을 마치면 다음 두 프로그램을 직접 완성합니다.' },
          { type: 'figure', html: FIG_PROGRAMS, caption: '[프로그램 1] 이전/다음 버튼으로 사진을 넘기는 사진 앨범, [프로그램 2] 메뉴에서 그림 파일을 골라 보여 주는 명화 감상' },
          { type: 'list', items: [
            '<b>[프로그램 1] 사진 앨범</b> — <code>&lt;&lt; 이전</code> · <code>다음 &gt;&gt;</code> 버튼을 누르면 제주 풍경 사진 9장이 차례로 바뀝니다. (4교시)',
            '<b>[프로그램 2] 명화 감상</b> — [파일] 메뉴의 [파일 열기]를 고르면 파일 선택 대화상자가 열리고, 고른 그림이 창에 나타납니다. (6교시)'
          ] },
          { type: 'table', head: ['교시', '내용', '핵심 코드'], rows: [
            ['1교시', '윈도 프로그래밍의 시작과 레이블', '<code>Tk()</code>, <code>Label</code>, <code>PhotoImage</code>'],
            ['2교시', '버튼 · 체크버튼 · 라디오버튼', '<code>Button</code>, <code>command</code>, <code>IntVar</code>'],
            ['3교시', 'pack() 으로 위젯 배치하기', '<code>side</code>, <code>fill</code>, <code>padx</code>, <code>ipadx</code>'],
            ['4교시', 'place() 와 [프로그램 1] 사진 앨범', '<code>place(x, y)</code>, <code>global</code>'],
            ['5교시', '마우스와 키보드 이벤트', '<code>bind()</code>, <code>event</code>'],
            ['6교시', '메뉴와 대화상자 · [프로그램 2] 명화 감상', '<code>Menu</code>, <code>askinteger</code>, <code>askopenfilename</code>']
          ], caption: '이 장의 수업 흐름' },

          { type: 'h', text: 'GUI 와 tkinter' },
          { type: 'p', html: '마우스로 누르고 고르는 그래픽 화면을 <b>GUI(Graphical User Interface, 그래픽 사용자 인터페이스)</b>라고 합니다. 반대로 글자만 주고받는 화면은 <b>CLI(Command Line Interface)</b>라고 부릅니다. 파이썬에서 GUI 를 만드는 가장 기본적인 도구가 <b>tkinter</b> 입니다.' },
          { type: 'callout', kind: 'info', title: 'tkinter 라는 이름', html: '<b>tkinter</b> 는 <b>Tk interface</b> 의 줄임말입니다. Tk 는 Tcl/Tk 라는 오래되고 안정적인 GUI 도구로, 윈도 · 리눅스 · 맥 어디서나 <b>같은 코드로</b> 창을 띄울 수 있습니다. 파이썬을 설치하면 tkinter 도 함께 설치되므로 따로 설치할 필요가 없습니다.' },
          { type: 'callout', kind: 'tip', title: '이 강좌에서는 창이 어디에 뜨나요?', html: '이 강좌는 브라우저 안에서 파이썬을 실행하므로, 강좌용 <b>tkinter 호환 모듈</b>이 페이지 위에 창을 띄워 줍니다. 코드는 표준 tkinter 와 똑같이 작성하면 됩니다. 창은 끌어서 옮길 수 있고, 오른쪽 위의 <b>✕</b> 를 누르면 닫힙니다. 창이 떠 있는 동안에는 프로그램이 계속 실행 중(이벤트를 기다리는 중)입니다.' },

          { type: 'h', text: '기본 윈도창의 구성' },
          { type: 'p', html: '창에 올라가는 글자, 버튼, 체크박스, 라디오버튼 같은 부품을 <b>위젯(widget)</b>이라고 합니다. tkinter 프로그램은 항상 다음 뼈대로 시작합니다.' },
          { type: 'code', title: 'Code10-01. 기본 윈도창', code: `from tkinter import *

window = Tk()

## 이 부분에서 화면을 구성하고 처리 ##

window.mainloop()`, desc: '<code>1행</code> tkinter 의 모든 것을 가져옵니다. <code>3행</code> <code>Tk()</code> 는 빈 창(루트 창)을 만들어 <code>window</code> 에 넣습니다. <code>5행</code> 자리에 위젯을 만들고 배치하는 코드를 씁니다. <code>7행</code> <code>mainloop()</code> 는 창을 화면에 띄워 둔 채 사용자의 클릭 · 키 입력(이벤트)을 계속 기다립니다. ▶ 실행하면 제목이 <code>tk</code> 인 빈 창이 나타납니다.' },
          { type: 'figure', html: FIG_ANATOMY, caption: 'tkinter 프로그램의 구조: 창을 만들고 → 위젯을 만들고 → 배치하고 → mainloop() 로 기다린다' },
          { type: 'figure', html: FIG_LOOP, caption: 'mainloop() 는 이벤트를 기다렸다가 처리하기를 창이 닫힐 때까지 반복한다' },
          { type: 'callout', kind: 'more', title: '왜 mainloop() 가 꼭 필요할까?', html: '<p>콘솔 프로그램은 위에서 아래로 실행하고 끝납니다. 그런데 윈도 프로그램은 <b>사용자가 언제 무엇을 누를지 모릅니다</b>. 그래서 "기다렸다가 → 일이 생기면 처리하고 → 다시 기다리는" <b>이벤트 루프(event loop)</b>가 필요합니다. <code>mainloop()</code> 가 바로 그 무한 반복이며, 창을 닫으면 반복이 끝나고 다음 줄로 넘어갑니다.</p><p>IDLE 에서 <code>mainloop()</code> 를 빼먹으면 창이 잠깐 떴다가 사라지거나 반응이 없을 수 있습니다. 항상 <b>프로그램의 마지막 줄</b>에 두는 습관을 들이세요. (이 강좌 환경은 빠뜨려도 창을 유지해 주지만, 내 PC 에서는 꼭 필요합니다.)</p>' },

          { type: 'h', text: '윈도창 조절' },
          { type: 'p', html: '창의 제목, 크기, 크기 변경 가능 여부를 정할 수 있습니다.' },
          { type: 'code', title: 'Code10-02. 윈도창 조절', code: `from tkinter import *

window = Tk()
window.title("윈도창 연습")
window.geometry("400x100")
window.resizable(width = FALSE, height = FALSE)

window.mainloop()`, desc: '<code>4행</code> 제목 표시줄의 글자를 바꿉니다. <code>5행</code> 창 크기를 <b>"가로x세로"</b> 문자열로 지정합니다. 가운데는 곱하기 기호가 아니라 <b>영어 소문자 x</b> 입니다. <code>6행</code> 가로 · 세로 모두 크기를 바꿀 수 없게 합니다. (<code>FALSE</code> 는 tkinter 가 제공하는 상수로 0 과 같습니다. 파이썬의 <code>False</code> 를 써도 됩니다.)' },
          { type: 'table', head: ['메서드', '하는 일', '예'], rows: [
            ['<code>title(문자열)</code>', '창 제목 바꾸기', '<code>window.title("윈도창 연습")</code>'],
            ['<code>geometry("가로x세로")</code>', '창 크기(픽셀) 정하기', '<code>window.geometry("400x100")</code>'],
            ['<code>geometry("가로x세로+X+Y")</code>', '크기와 화면 위치까지 정하기', '<code>window.geometry("400x100+200+50")</code>'],
            ['<code>resizable(width, height)</code>', '마우스로 크기 변경 허용 여부', '<code>window.resizable(False, False)</code>'],
            ['<code>mainloop()</code>', '이벤트 기다리기(창 띄워 두기)', '<code>window.mainloop()</code>']
          ], caption: '창(Tk)을 조절하는 주요 메서드' },
          { type: 'callout', kind: 'warn', title: '자주 하는 실수', html: '<ul><li><code>geometry("400*100")</code> — 곱하기 기호(<code>*</code>)가 아니라 영어 <b>x</b> 를 써야 합니다.</li><li><code>geometry(400, 100)</code> — 숫자 두 개가 아니라 <b>문자열 하나</b>로 넘깁니다.</li><li><code>window = tk()</code> — 클래스 이름은 대문자 <b>T</b> 로 시작하는 <code>Tk</code> 입니다.</li></ul>' },

          { type: 'h', text: '레이블' },
          { type: 'p', html: '<b>레이블(Label)</b>은 창에 글자(또는 그림)를 보여 주는 가장 간단한 위젯입니다. 모든 위젯은 <code>위젯클래스(부모창, 옵션=값, …)</code> 형식으로 만들고, <code>pack()</code> 을 불러야 창에 나타납니다.' },
          { type: 'code', title: 'Code10-03. 레이블', code: `from tkinter import *
window = Tk()

label1 = Label(window, text = "COOKBOOK~~ Python을")
label2 = Label(window, text = "열심히", font = ("궁서체", 30), fg = "blue")
label3 = Label(window, text = "공부 중입니다.", bg = "magenta", width = 20, height = 5,
               anchor = SE)

label1.pack()
label2.pack()
label3.pack()

window.mainloop()`, desc: '<code>4행</code> 글자만 지정한 기본 레이블입니다. <code>5행</code> <code>font=("글꼴 이름", 크기)</code> 로 글꼴을, <code>fg</code>(foreground)로 글자색을 정합니다. <code>6행</code> <code>bg</code>(background)로 배경색을, <code>width</code> · <code>height</code> 로 레이블 크기를, <code>anchor=SE</code> 로 글자를 오른쪽 아래에 둡니다. <code>9~11행</code> <code>pack()</code> 한 순서대로 위에서 아래로 쌓입니다.' },
          { type: 'table', head: ['옵션', '뜻', '예'], rows: [
            ['<code>text</code>', '표시할 글자', '<code>text="안녕"</code>'],
            ['<code>font</code>', '(글꼴, 크기[, "bold"])', '<code>font=("궁서체", 30)</code>'],
            ['<code>fg</code>', '글자색 (foreground)', '<code>fg="blue"</code>, <code>fg="#0000FF"</code>'],
            ['<code>bg</code>', '배경색 (background)', '<code>bg="magenta"</code>'],
            ['<code>width</code> · <code>height</code>', '레이블 크기 (글자 레이블은 <b>글자 수 · 줄 수</b> 단위)', '<code>width=20, height=5</code>'],
            ['<code>anchor</code>', '레이블 안에서 글자의 위치', '<code>anchor=SE</code>'],
            ['<code>image</code>', '글자 대신 보여 줄 그림', '<code>image=photo</code>']
          ], caption: 'Label 의 주요 옵션 (Button 등 다른 위젯도 대부분 같은 옵션을 씀)' },
          { type: 'figure', html: FIG_ANCHOR, caption: 'anchor 에 쓸 수 있는 9가지 방향 — 나침반의 동서남북으로 기억한다' },
          { type: 'callout', kind: 'info', title: '글꼴이 없으면?', html: '<code>"궁서체"</code> 처럼 컴퓨터에 없는 글꼴 이름을 쓰면 오류가 나지 않고 <b>비슷한 기본 글꼴</b>로 대신 표시됩니다. 브라우저에서도 마찬가지입니다. 색 이름은 <code>"red"</code>, <code>"blue"</code>, <code>"magenta"</code> 같은 영어 이름이나 <code>"#FF8800"</code> 같은 16진수 색 코드를 쓸 수 있습니다.' },
          { type: 'code', title: '추가 예제. anchor 비교하기', code: `from tkinter import *
window = Tk()
window.title("anchor 비교")

for pos in [NW, CENTER, SE] :
    label = Label(window, text = "anchor = " + pos, bg = "lightyellow",
                  width = 25, height = 3, anchor = pos)
    label.pack(pady = 3)

window.mainloop()`, desc: '같은 크기의 레이블 3개에 anchor 만 다르게 주었습니다. <code>NW</code> · <code>CENTER</code> · <code>SE</code> 는 사실 <code>"nw"</code> · <code>"center"</code> · <code>"se"</code> 문자열 상수이므로 <code>"anchor = " + pos</code> 처럼 문자열과 이어 붙일 수 있습니다. 반복문으로 위젯을 여러 개 만드는 방법은 3교시에 자세히 배웁니다.' },

          { type: 'h', text: '레이블에 글자 대신 이미지 넣기' },
          { type: 'p', html: '그림 파일을 <code>PhotoImage</code> 로 읽은 다음, 레이블의 <code>image</code> 옵션에 넣으면 글자 대신 그림이 나타납니다.' },
          { type: 'code', title: 'Code10-04. 레이블에 이미지 넣기', code: `from tkinter import *
window = Tk()

photo = PhotoImage(file = "GIF/dog.gif")
label1 = Label(window, image = photo)

label1.pack()

window.mainloop()`, desc: '<code>4행</code> <code>GIF</code> 폴더의 <code>dog.gif</code> 파일을 읽어 그림 객체를 만듭니다. <code>5행</code> <code>image=photo</code> 로 레이블에 그림을 넣습니다. 창 크기는 그림 크기에 맞춰 자동으로 정해집니다.' },
          { type: 'callout', kind: 'info', title: '📁 그림 파일은 작업 폴더에 있습니다', html: '<p>교재는 <code>C:/CookPython/GIF/dog.gif</code> 같은 내 PC 의 경로를 쓰지만, 이 강좌에서는 <b>작업 폴더</b>의 <code>GIF</code> 폴더에 예제 그림이 미리 들어 있으므로 <code>"GIF/dog.gif"</code> 처럼 <b>상대 경로</b>로 씁니다. (교재 사진 대신 이 강좌에서 직접 그린 그림을 사용합니다.)</p><p>들어 있는 그림: <code>dog.gif</code>, <code>dog2.gif</code>, <code>cat.gif</code>, <code>cat2.gif</code>, <code>rabbit.gif</code>, <code>jeju1.gif</code>~<code>jeju9.gif</code>, <code>painting1.gif</code>~<code>painting4.gif</code>, 과자 아이콘 9개(<code>froyo.gif</code> …). 파일 대화상자의 <b>내 PC 파일 올리기</b>로 내 그림을 작업 폴더에 추가할 수도 있습니다.</p>' },
          { type: 'callout', kind: 'more', title: 'PhotoImage 가 읽을 수 있는 그림 형식', html: '<p>교재가 쓰인 시절의 tkinter(Tk 8.5)는 <b>GIF</b> 만 읽을 수 있었습니다. 요즘 파이썬에 들어 있는 Tk 8.6 부터는 <b>PNG</b> 도 읽을 수 있습니다. 하지만 <b>JPG · BMP</b> 는 여전히 직접 읽지 못합니다. 이 강좌의 호환 모듈도 GIF 와 PNG 를 지원합니다.</p><p>JPG 사진을 쓰고 싶다면 <b>Pillow(PIL)</b> 라이브러리의 <code>ImageTk.PhotoImage</code> 를 사용합니다(아래 추가 예제). 파일이 없거나 경로가 틀리면 <code>TclError: couldn\'t open "…": no such file or directory</code> 오류가 납니다.</p>' },
          { type: 'code', title: '추가 예제. Pillow 로 그림 크기를 바꿔 표시하기', code: `from tkinter import *
from PIL import Image, ImageTk

window = Tk()
window.title("Pillow + tkinter")

img = Image.open("GIF/dog.gif")          # Pillow 로 그림 열기 (JPG 도 가능)
img = img.resize((100, 100))             # 100 x 100 으로 줄이기
photo = ImageTk.PhotoImage(img)          # tkinter 용 그림으로 바꾸기

Label(window, image = photo).pack(side = LEFT)
Label(window, text = "크기를 줄인 강아지", font = ("맑은 고딕", 14)).pack(side = LEFT)

window.mainloop()`, desc: 'Pillow 는 그림을 여는 것 말고도 크기 조절, 회전, 필터 등 다양한 기능을 제공합니다(12장에서 영상 처리를 더 배웁니다). <code>11행</code>처럼 위젯을 만들자마자 <code>.pack()</code> 을 이어 쓰면 변수 없이 한 줄로 배치할 수 있습니다. 다만 나중에 그 위젯을 바꿔야 한다면 변수에 담아 두어야 합니다.' }
        ],
        practice: [
          {
            title: 'SELF STUDY 10-1. 이미지 2개 출력하기',
            level: 1,
            desc: '<p>Code10-04 를 수정해서 고양이 그림 2개(<code>GIF/cat.gif</code>, <code>GIF/cat2.gif</code>)를 <b>가로로 나란히</b> 출력하세요. 창 제목은 <code>냥이들 ^^</code> 로 합니다.</p>',
            hint: '그림(PhotoImage)과 레이블을 2개씩 만듭니다. 위젯을 가로로 나타내려면 <code>pack(side = LEFT)</code> 를 사용합니다.',
            starter: `from tkinter import *
window = Tk()
window.title("냥이들 ^^")

photo1 = PhotoImage(file = "GIF/cat.gif")
# TODO: 두 번째 그림 photo2 만들기

label1 = Label(window, image = photo1)
# TODO: label2 만들기

# TODO: 두 레이블을 가로로 배치하기 (pack(side = LEFT))
label1.pack()

window.mainloop()
`,
            solution: `from tkinter import *
window = Tk()
window.title("냥이들 ^^")

photo1 = PhotoImage(file = "GIF/cat.gif")
photo2 = PhotoImage(file = "GIF/cat2.gif")

label1 = Label(window, image = photo1)
label2 = Label(window, image = photo2)

label1.pack(side = LEFT)
label2.pack(side = LEFT)

window.mainloop()
`
          },
          {
            title: '실습 10-1. 나의 명함 만들기',
            level: 1,
            desc: '<p>레이블 3개로 명함 창을 만드세요.</p><ul><li>창 제목 <code>나의 명함</code>, 크기 <code>300x200</code>, 크기 변경 불가</li><li>이름: 글꼴 크기 25, 글자색 <code>navy</code></li><li>소속: 기본 글꼴</li><li>연락처: 배경 <code>lightyellow</code>, 너비 30, 높이 2, 글자는 오른쪽(<code>E</code>)</li></ul>',
            hint: '<code>font=("맑은 고딕", 25)</code>, <code>fg="navy"</code>, <code>bg="lightyellow"</code>, <code>width=30, height=2, anchor=E</code>',
            starter: `from tkinter import *
window = Tk()
# TODO: 제목, 크기, 크기 변경 불가 설정

# TODO: 레이블 3개 만들고 pack()

window.mainloop()
`,
            solution: `from tkinter import *
window = Tk()
window.title("나의 명함")
window.geometry("300x200")
window.resizable(width = FALSE, height = FALSE)

name = Label(window, text = "홍길동", font = ("맑은 고딕", 25), fg = "navy")
dept = Label(window, text = "파이썬대학교 컴퓨터공학과")
phone = Label(window, text = "010-1234-5678", bg = "lightyellow", width = 30, height = 2, anchor = E)

name.pack()
dept.pack()
phone.pack()

window.mainloop()
`
          }
        ],
        quiz: [
          { q: 'tkinter 프로그램의 마지막 줄에 두어, 창을 띄워 둔 채 사용자의 클릭이나 키 입력을 계속 기다리게 하는 것은?', options: ['window.pack()', 'window.mainloop()', 'window.title()', 'window.geometry()'], answer: 1,
            explain: '<code>mainloop()</code> 는 이벤트를 기다렸다가 처리하는 반복(이벤트 루프)입니다. 창이 닫히면 끝납니다.' },
          { q: '창 크기를 가로 400, 세로 100 픽셀로 정하는 올바른 코드는?', options: ['window.geometry(400, 100)', 'window.geometry("400*100")', 'window.geometry("400x100")', 'window.size("400x100")'], answer: 2,
            explain: '<code>geometry()</code> 에는 <b>"가로x세로"</b> 형식의 문자열 하나를 넘깁니다. 가운데는 영어 소문자 x 입니다.' },
          { q: '다음 레이블에서 글자는 레이블의 어느 위치에 표시될까요?<pre><code>Label(window, text="안녕", width=20, height=5, anchor=NW)</code></pre>', options: ['가운데', '왼쪽 위', '오른쪽 아래', '오른쪽 위'], answer: 1,
            explain: 'NW 는 북서쪽, 즉 <b>왼쪽 위</b>입니다. N=위, S=아래, W=왼쪽, E=오른쪽.' },
          { q: 'Label 에서 <b>글자색</b>을 지정하는 옵션은?', options: ['bg', 'color', 'fg', 'font'], answer: 2,
            explain: '<code>fg</code>(foreground)는 글자색, <code>bg</code>(background)는 배경색입니다.' },
          { q: '다음 중 tkinter 의 <code>PhotoImage(file=…)</code> 로 <b>직접 읽을 수 없는</b> 형식은?', options: ['GIF', 'PNG (Tk 8.6 이상)', 'JPG', '모두 읽을 수 있다'], answer: 2,
            explain: 'PhotoImage 는 GIF(와 Tk 8.6 부터 PNG)를 읽습니다. JPG 는 Pillow 의 <code>ImageTk.PhotoImage</code> 를 이용합니다.' }
        ],
        slides: [
          { layout: 'title', title: '윈도 프로그래밍의 시작과 레이블', subtitle: 'Chapter 10 윈도 프로그래밍 · Section 01 ~ 02', badge: '1교시',
            notes: '<p>드디어 창이 뜨는 프로그램을 만듭니다. 학생들이 가장 흥미로워하는 장 중 하나입니다.</p><p><b>발문</b>: "지금까지 만든 프로그램과 평소 쓰는 앱은 무엇이 다를까요?" → 창, 버튼, 메뉴, 마우스.</p><p>시간: 2분</p>' },
          { layout: 'diagram', title: '이 장에서 만들 프로그램', html: FIG_PROGRAMS, caption: '[프로그램 1] 사진 앨범 · [프로그램 2] 명화 감상',
            notes: '<p>강의자료 3~4쪽. 완성된 두 프로그램을 먼저 보여 주면 동기 부여가 됩니다. 시간이 있으면 4교시 · 6교시의 완성 코드를 미리 실행해 보여 줍니다.</p><p>사진 앨범: 버튼 + 전역 변수 + place. 명화 감상: 메뉴 + 파일 대화상자.</p><p>시간: 3분</p>' },
          { layout: 'bullets', title: 'GUI 와 tkinter', lead: '글자 화면(CLI) → 그래픽 화면(GUI)',
            bullets: ['<b>GUI</b>: 창 · 버튼 · 메뉴를 마우스로 조작하는 화면', '<b>tkinter</b> = Tk interface — 파이썬 기본 GUI 모듈', ['윈도 · 리눅스 · 맥에서 같은 코드로 동작', '파이썬 설치 시 함께 설치됨'], '<b>위젯(widget)</b>: 창에 올리는 부품 (레이블, 버튼 …)', '이 강좌: 호환 모듈이 페이지 위에 창을 띄움'],
            notes: '<p>강의자료 5쪽의 Tip 내용입니다. 브라우저에서는 창이 페이지 위에 뜨고, ✕ 로 닫는다는 점을 시연합니다.</p><p>시간: 3분</p>' },
          { layout: 'code', title: 'Code10-01 · 02 기본 윈도창과 창 조절', code: `from tkinter import *

window = Tk()
window.title("윈도창 연습")
window.geometry("400x100")
window.resizable(width = FALSE, height = FALSE)

## 이 부분에서 화면을 구성하고 처리 ##

window.mainloop()`,
            points: ['<code>Tk()</code>: 빈 창(루트 창) 만들기', '<code>title</code> · <code>geometry("가로x세로")</code> · <code>resizable</code>', '<code>mainloop()</code>: 이벤트 기다리기 — 항상 마지막 줄'],
            notes: '<p>Code10-01 과 10-02 를 합쳐 보여 줍니다. 먼저 4~6행을 지운 상태로 실행 → 기본 창(제목 tk), 다음에 한 줄씩 추가하며 실행합니다.</p><p><b>주의</b>: geometry 의 x 는 영어 소문자. <code>*</code> 를 쓰는 학생이 많습니다.</p><p>시간: 5분</p>' },
          { layout: 'diagram', title: 'mainloop() — 이벤트 루프', html: FIG_LOOP, caption: '기다림 → 이벤트 처리 → 다시 기다림 (창이 닫힐 때까지)',
            notes: '<p>강의자료에 없는 보충입니다. 콘솔 프로그램(위→아래로 실행 후 종료)과 윈도 프로그램(이벤트를 기다림)의 차이를 비유로 설명합니다: 식당 종업원은 손님이 부를 때까지 기다리다가 주문을 처리합니다.</p><p>시간: 3분</p>' },
          { layout: 'code', title: 'Code10-03 레이블', code: `from tkinter import *
window = Tk()

label1 = Label(window, text = "COOKBOOK~~ Python을")
label2 = Label(window, text = "열심히", font = ("궁서체", 30), fg = "blue")
label3 = Label(window, text = "공부 중입니다.", bg = "magenta", width = 20, height = 5,
               anchor = SE)

label1.pack()
label2.pack()
label3.pack()

window.mainloop()`,
            points: ['위젯 만들기: <code>Label(부모창, 옵션=값 …)</code>', '<code>font</code> · <code>fg</code>(글자색) · <code>bg</code>(배경색)', '<code>width</code> · <code>height</code> · <code>anchor</code>', '<code>pack()</code> 해야 창에 보임'],
            notes: '<p>강의자료 7쪽. pack() 을 한 줄 지워서 실행해 보고 "만들기만 하면 안 보인다"는 것을 확인시킵니다.</p><p><b>발문</b>: "label3 의 글자를 왼쪽 위로 옮기려면?" → anchor=NW.</p><p>시간: 5분</p>' },
          { layout: 'diagram', title: 'anchor — 글자의 위치', html: FIG_ANCHOR, caption: 'N 위 · S 아래 · W 왼쪽 · E 오른쪽',
            notes: '<p>나침반으로 외우게 합니다. 지도에서 위가 북쪽(N)입니다. 레이블이 글자보다 커야 효과가 보인다는 점을 강조합니다.</p><p>시간: 2분</p>' },
          { layout: 'code', title: 'Code10-04 레이블에 이미지 넣기', code: `from tkinter import *
window = Tk()

photo = PhotoImage(file = "GIF/dog.gif")
label1 = Label(window, image = photo)

label1.pack()

window.mainloop()`,
            points: ['<code>PhotoImage(file = 경로)</code>: 그림 읽기', '레이블의 <code>image</code> 옵션에 넣기', '교재 경로 <code>C:/CookPython/GIF/…</code> → 작업 폴더의 <code>GIF/…</code>', 'GIF · PNG 가능, JPG 는 Pillow 이용'],
            notes: '<p>강의자료 8쪽. 교재 사진 대신 이 강좌용으로 그린 그림을 쓴다는 것과, 작업 폴더에 파일이 있다는 것을 안내합니다.</p><p>경로를 일부러 틀리게 써서 TclError 를 보여 주면 좋습니다.</p><p>시간: 4분</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '창 크기를 가로 400, 세로 100 으로 정하는 코드는?', options: ['geometry(400, 100)', 'geometry("400*100")', 'geometry("400x100")', 'size("400x100")'], answer: 2,
            explain: '"가로x세로" 형식의 문자열 하나. x 는 영어 소문자.',
            notes: '<p>시간: 1분</p>' },
          { layout: 'practice', title: 'SELF STUDY 10-1. 이미지 2개 출력하기', desc: 'Code10-04 를 수정해 <code>cat.gif</code>, <code>cat2.gif</code> 를 가로로 나란히 출력하세요. (제목: 냥이들 ^^, 힌트: <code>pack(side=LEFT)</code>)',
            starter: `from tkinter import *
window = Tk()
window.title("냥이들 ^^")

photo1 = PhotoImage(file = "GIF/cat.gif")
label1 = Label(window, image = photo1)
label1.pack()

window.mainloop()
`,
            solution: `from tkinter import *
window = Tk()
window.title("냥이들 ^^")

photo1 = PhotoImage(file = "GIF/cat.gif")
photo2 = PhotoImage(file = "GIF/cat2.gif")
label1 = Label(window, image = photo1)
label2 = Label(window, image = photo2)
label1.pack(side = LEFT)
label2.pack(side = LEFT)

window.mainloop()
`,
            notes: '<p>강의자료 9쪽. 5분 개별 실습. side=LEFT 는 3교시에 자세히 배우므로 여기서는 힌트대로만 써 보게 합니다.</p><p>흔한 실수: PhotoImage 를 하나만 만들고 두 레이블에 같이 넣음 → 같은 그림 2개.</p><p>시간: 5분</p>' },
          { layout: 'summary', title: '정리', bullets: ['<code>Tk()</code> → 위젯 만들기 → <code>pack()</code> → <code>mainloop()</code>', '창 조절: <code>title</code>, <code>geometry("가로x세로")</code>, <code>resizable</code>', 'Label 옵션: text, font, fg, bg, width, height, anchor', '그림: <code>PhotoImage(file="GIF/dog.gif")</code> → <code>image=photo</code>', '다음 시간: 누르면 반응하는 버튼'],
            notes: '<p>뼈대 4단계를 다시 한 번 말로 정리합니다.</p><p>시간: 2분</p>' }
        ]
      },

      /* ───────────────────────── 2교시: 버튼 · 체크버튼 · 라디오버튼 ───────────────────────── */
      {
        id: 'ch10-2',
        title: '버튼 · 체크버튼 · 라디오버튼',
        minutes: 50,
        goals: [
          'Button 의 command 옵션에 함수 이름을 연결하여 클릭할 때 작업을 실행할 수 있다',
          'messagebox.showinfo() 로 간단한 메시지 창을 띄울 수 있다',
          'Checkbutton 과 IntVar 로 켜짐/꺼짐 상태를 알아낼 수 있다',
          'Radiobutton 여러 개를 하나의 변수로 묶어 하나만 선택하게 하고, configure() 로 위젯 내용을 바꿀 수 있다'
        ],
        flow: [['복습 · 도입', 3], ['버튼과 command', 12], ['이미지 버튼 · 메시지 창', 8], ['체크버튼 · IntVar', 10], ['라디오버튼 · configure', 12], ['정리 · 퀴즈', 5]],
        content: [
          { type: 'h', text: '버튼' },
          { type: 'p', html: '<b>버튼(Button)</b>은 마우스로 클릭하면 눌리는 모양이 되면서, 미리 정해 둔 작업을 실행하는 위젯입니다. 클릭했을 때 할 일은 <code>command</code> 옵션에 <b>함수 이름</b>으로 지정합니다.' },
          { type: 'code', title: 'Code10-05. 버튼을 누르면 파이썬이 종료되는 코드', code: `from tkinter import *
window = Tk()

button1 = Button(window, text = "파이썬 종료", fg = "red", command = quit)

button1.pack()

window.mainloop()`, desc: '<code>4행</code> 빨간 글자의 버튼을 만들고, 누르면 파이썬의 <code>quit</code> 함수가 실행되도록 연결했습니다. 버튼을 누르면 프로그램이 끝나면서 창도 사라집니다. (교재에서는 IDLE 자체가 종료된다고 설명합니다.)' },
          { type: 'callout', kind: 'tip', title: '창만 닫고 싶다면', html: '<code>quit</code> 은 파이썬 프로그램 전체를 끝내는 함수입니다. 프로그램은 두고 <b>창만 닫으려면</b> <code>command = window.destroy</code> 를 씁니다. 6교시의 메뉴 예제에서는 <code>window.quit()</code>(mainloop 끝내기)와 <code>window.destroy()</code>(창 없애기)를 함께 사용합니다.' },
          { type: 'figure', html: FIG_COMMAND, caption: 'command 에는 함수를 "호출"하지 않고 함수 "이름"만 넘긴다 — 호출은 클릭할 때 tkinter 가 한다' },
          { type: 'code', title: 'Code10-06. 이미지 버튼을 누르면 메시지 창이 나오는 코드', code: `from tkinter import *
from tkinter import messagebox

## 함수 선언 부분 ##
def myFunc() :
    messagebox.showinfo("강아지 버튼", "강아지가 귀엽죠? ^^")

## 메인 코드 부분 ##
window = Tk()

photo = PhotoImage(file = "GIF/dog2.gif")
button1 = Button(window, image = photo, command = myFunc)

button1.pack()

window.mainloop()`, desc: '<code>2행</code> 메시지 창 기능이 있는 <code>messagebox</code> 모듈을 따로 가져옵니다(<code>from tkinter import *</code> 만으로는 가져와지지 않습니다). <code>5~6행</code> 버튼을 누를 때 실행할 함수입니다. <code>showinfo(제목, 내용)</code> 은 ⓘ 아이콘이 있는 알림 창을 띄웁니다. <code>12행</code> 버튼에도 <code>image</code> 옵션으로 그림을 넣을 수 있습니다. 그림을 클릭해 보세요.' },
          { type: 'callout', kind: 'info', title: '함수 선언 부분 · 메인 코드 부분', html: '교재의 윈도 프로그램은 <b>① 함수 선언 부분</b>(이벤트가 생기면 실행할 함수들)과 <b>② 메인 코드 부분</b>(창과 위젯을 만드는 코드)으로 나누어 작성합니다. 함수는 <b>쓰이기 전에</b> 정의되어 있어야 하므로 <code>command=myFunc</code> 보다 위에 <code>def myFunc()</code> 가 와야 합니다.' },
          { type: 'table', head: ['함수', '모양', '돌려주는 값'], rows: [
            ['<code>messagebox.showinfo(제목, 내용)</code>', 'ⓘ 알림', '"ok"'],
            ['<code>messagebox.showwarning(제목, 내용)</code>', '⚠ 경고', '"ok"'],
            ['<code>messagebox.showerror(제목, 내용)</code>', '⛔ 오류', '"ok"'],
            ['<code>messagebox.askyesno(제목, 질문)</code>', '예 / 아니요', '<code>True</code> / <code>False</code>'],
            ['<code>messagebox.askokcancel(제목, 질문)</code>', '확인 / 취소', '<code>True</code> / <code>False</code>']
          ], caption: '📘 messagebox 모듈의 여러 가지 메시지 창' },
          { type: 'code', title: '추가 예제. 누를 때마다 숫자가 올라가는 버튼', code: `from tkinter import *

## 전역 변수 선언 부분 ##
count = 0

## 함수 선언 부분 ##
def clickButton() :
    global count
    count += 1
    label1.configure(text = "클릭 횟수 : " + str(count))

## 메인 코드 부분 ##
window = Tk()
window.title("클릭 카운터")
window.geometry("250x100")

label1 = Label(window, text = "클릭 횟수 : 0", font = ("맑은 고딕", 15))
button1 = Button(window, text = "눌러 보세요", command = clickButton)

label1.pack()
button1.pack()

window.mainloop()`, desc: '<code>8행</code> 함수 안에서 바깥의 <code>count</code> 값을 <b>바꾸려면</b> <code>global</code> 선언이 필요합니다(9장 함수에서 배운 전역 변수). <code>10행</code> <code>configure()</code> 는 이미 만든 위젯의 옵션을 나중에 바꾸는 메서드입니다. 버튼을 누를 때마다 레이블의 글자가 바뀝니다.' },

          { type: 'h', text: '체크버튼' },
          { type: 'p', html: '<b>체크버튼(Checkbutton)</b>은 네모 칸을 눌러 <b>켜고 끄는</b> 위젯입니다. 체크 상태는 tkinter 의 특별한 변수 <code>IntVar()</code> 에 저장됩니다. 켜지면 1, 꺼지면 0 이 들어갑니다.' },
          { type: 'code', title: 'Code10-07. 체크버튼을 켜거나 끄면 메시지 창이 열리는 코드', code: `from tkinter import *
from tkinter import messagebox
window = Tk()

## 함수 선언 부분 ##
def myFunc() :
    if chk.get() == 0 :
        messagebox.showinfo("", "체크버튼이 꺼졌어요.")
    else :
        messagebox.showinfo("", "체크버튼이 켜졌어요.")

## 메인 코드 부분 ##
chk = IntVar()
cb1 = Checkbutton(window, text = "클릭하세요", variable = chk, command = myFunc)

cb1.pack()

window.mainloop()`, desc: '<code>13행</code> 정수를 담는 tkinter 변수 <code>chk</code> 를 만듭니다. <code>14행</code> <code>variable=chk</code> 로 체크버튼과 변수를 연결하고, 상태가 바뀔 때마다 <code>myFunc</code> 가 실행되게 합니다. <code>7행</code> <code>chk.get()</code> 으로 현재 값(0 또는 1)을 꺼내 확인합니다.' },
          { type: 'callout', kind: 'more', title: 'IntVar 는 왜 필요할까? — "연결된 상자"', html: '<p>보통 변수 <code>a = 0</code> 은 위젯이 바뀌어도 알 수 없습니다. <code>IntVar()</code> 는 위젯과 <b>선으로 연결된 상자</b>라고 생각하면 됩니다. 사용자가 체크하면 상자 값이 자동으로 바뀌고, 반대로 코드에서 <code>chk.set(1)</code> 하면 화면의 체크 표시가 켜집니다.</p><ul><li><code>IntVar()</code> 정수, <code>StringVar()</code> 문자열, <code>DoubleVar()</code> 실수, <code>BooleanVar()</code> 참/거짓</li><li>값 읽기 <code>변수.get()</code>, 값 쓰기 <code>변수.set(값)</code></li><li>체크했을 때 · 해제했을 때 들어갈 값은 <code>onvalue</code> · <code>offvalue</code> 옵션으로 바꿀 수 있습니다.</li></ul>' },
          { type: 'code', title: '추가 예제. 피자 토핑 고르기 (체크버튼 여러 개)', code: `from tkinter import *

## 함수 선언 부분 ##
def calcPrice() :
    price = 10000
    toppings = ""
    if cheese.get() == 1 :
        price += 2000
        toppings += "치즈 "
    if pepper.get() == 1 :
        price += 1000
        toppings += "피망 "
    if bacon.get() == 1 :
        price += 3000
        toppings += "베이컨 "
    label1.configure(text = "추가 토핑 : " + toppings + "\\n가격 : " + str(price) + "원")

## 메인 코드 부분 ##
window = Tk()
window.title("피자 주문")

cheese, pepper, bacon = IntVar(), IntVar(), IntVar()
Checkbutton(window, text = "치즈 추가 (+2000원)", variable = cheese, command = calcPrice).pack(anchor = W)
Checkbutton(window, text = "피망 추가 (+1000원)", variable = pepper, command = calcPrice).pack(anchor = W)
Checkbutton(window, text = "베이컨 추가 (+3000원)", variable = bacon, command = calcPrice).pack(anchor = W)

label1 = Label(window, text = "추가 토핑 : \\n가격 : 10000원", fg = "blue")
label1.pack()

window.mainloop()`, desc: '체크버튼마다 <b>따로</b> IntVar 를 연결하면 여러 개를 동시에 켤 수 있습니다. 모든 체크버튼이 같은 함수 <code>calcPrice</code> 를 부르고, 함수에서 각 변수를 확인해 가격을 계산합니다. <code>pack(anchor=W)</code> 는 위젯을 왼쪽에 붙여 줄을 맞춥니다. 글자 속 <code>\\n</code> 은 줄 바꿈입니다.' },

          { type: 'h', text: '라디오버튼' },
          { type: 'p', html: '<b>라디오버튼(Radiobutton)</b>은 여러 개 중에서 <b>하나만</b> 고르는 위젯입니다. 옛날 라디오의 채널 버튼처럼 하나를 누르면 다른 것은 풀립니다. 같은 그룹의 라디오버튼은 <b>하나의 변수</b>를 함께 쓰고, 각자 다른 <code>value</code> 를 가집니다.' },
          { type: 'code', title: 'Code10-08. 라디오버튼', code: `from tkinter import *
window = Tk()

## 함수 선언 부분 ##
def myFunc() :
    if var.get() == 1 :
        label1.configure(text = "파이썬")
    elif var.get() == 2 :
        label1.configure(text = "C++")
    else :
        label1.configure(text = "Java")

## 메인 코드 부분 ##
var = IntVar()
rb1 = Radiobutton(window, text = "파이썬", variable = var, value = 1, command = myFunc)
rb2 = Radiobutton(window, text = "C++", variable = var, value = 2, command = myFunc)
rb3 = Radiobutton(window, text = "Java", variable = var, value = 3, command = myFunc)

label1 = Label(window, text = "선택한 언어 : ", fg = "red")

rb1.pack()
rb2.pack()
rb3.pack()
label1.pack()

window.mainloop()`, desc: '<code>14행</code> 라디오버튼 3개가 함께 쓸 변수 <code>var</code> 입니다. <code>15~17행</code> 모두 <code>variable=var</code> 이고 <code>value</code> 만 1, 2, 3 으로 다릅니다. 버튼을 고르면 그 버튼의 value 가 var 에 들어갑니다. <code>5~11행</code> var 값에 따라 <code>configure()</code> 로 레이블의 글자를 바꿉니다.' },
          { type: 'table', head: ['', '체크버튼', '라디오버튼'], rows: [
            ['선택 개수', '여러 개 동시에 선택 가능', '그룹에서 <b>하나만</b>'],
            ['변수', '버튼마다 <b>따로</b>', '그룹 전체가 <b>하나를 함께</b>'],
            ['변수에 들어가는 값', '켜짐 1 / 꺼짐 0 (onvalue · offvalue)', '선택한 버튼의 <code>value</code>'],
            ['예', '관심 분야(복수 선택), 동의 체크', '성별, 학년, 결제 방법']
          ], caption: '체크버튼과 라디오버튼 비교' },
          { type: 'callout', kind: 'warn', title: '라디오버튼이 하나만 선택되지 않아요!', html: '라디오버튼마다 <b>서로 다른 변수</b>를 연결하거나, <b>value 를 같게</b> 주면 "하나만 선택" 이 제대로 동작하지 않습니다. 그룹의 모든 라디오버튼은 <b>같은 variable</b>, <b>서로 다른 value</b> — 이 두 가지를 꼭 지키세요.' },
          { type: 'code', title: '추가 예제. StringVar 를 쓰는 라디오버튼', code: `from tkinter import *

def showSize() :
    label1.configure(text = "선택한 크기 : " + size.get())

window = Tk()
window.title("음료 크기")

size = StringVar()
size.set("Regular")                  # 처음 선택 값

for s in ["Small", "Regular", "Large"] :
    Radiobutton(window, text = s, variable = size, value = s, command = showSize).pack(side = LEFT)

label1 = Label(window, text = "선택한 크기 : Regular")
label1.pack(side = LEFT, padx = 10)

window.mainloop()`, desc: 'value 에 문자열을 쓰려면 <code>StringVar()</code> 를 사용합니다. <code>10행</code>처럼 <code>set()</code> 으로 처음에 선택되어 있을 값을 정할 수 있습니다. 반복문으로 라디오버튼을 만들었기 때문에 항목을 추가하기도 쉽습니다.' }
        ],
        practice: [
          {
            title: '실습 10-2. 커피 주문기',
            level: 2,
            desc: '<p>라디오버튼 3개(<code>아메리카노</code> 3000원, <code>카페라테</code> 3500원, <code>바닐라라테</code> 4000원)와 <code>주문하기</code> 버튼을 만드세요. 주문하기 버튼을 누르면 메시지 창에 <code>아메리카노 주문 완료! (3000원)</code> 처럼 표시합니다. 아무것도 고르지 않고 누르면 <code>메뉴를 선택하세요.</code> 경고 창을 띄웁니다.</p>',
            hint: 'IntVar 하나를 세 라디오버튼이 함께 씁니다(value 1, 2, 3). 선택하지 않으면 값은 0 입니다. 이름과 가격은 리스트에 담아 <code>names[var.get() - 1]</code> 처럼 꺼내면 편합니다. 경고 창은 <code>messagebox.showwarning()</code>.',
            starter: `from tkinter import *
from tkinter import messagebox

names = ["아메리카노", "카페라테", "바닐라라테"]
prices = [3000, 3500, 4000]

## 함수 선언 부분 ##
def order() :
    pass  # TODO: 선택한 메뉴와 가격을 메시지 창으로 보여 주기

## 메인 코드 부분 ##
window = Tk()
window.title("커피 주문")
var = IntVar()

# TODO: 라디오버튼 3개와 주문하기 버튼 만들고 배치

window.mainloop()
`,
            solution: `from tkinter import *
from tkinter import messagebox

names = ["아메리카노", "카페라테", "바닐라라테"]
prices = [3000, 3500, 4000]

## 함수 선언 부분 ##
def order() :
    n = var.get()
    if n == 0 :
        messagebox.showwarning("주문", "메뉴를 선택하세요.")
    else :
        messagebox.showinfo("주문", names[n - 1] + " 주문 완료! (" + str(prices[n - 1]) + "원)")

## 메인 코드 부분 ##
window = Tk()
window.title("커피 주문")
var = IntVar()

for i in range(3) :
    rb = Radiobutton(window, text = names[i] + " " + str(prices[i]) + "원", variable = var, value = i + 1)
    rb.pack(anchor = W)

btn = Button(window, text = "주문하기", command = order)
btn.pack()

window.mainloop()
`
          },
          {
            title: '실습 10-3. 약관 동의 후 가입 버튼 켜기',
            level: 2,
            desc: '<p><code>약관에 동의합니다</code> 체크버튼과 <code>가입하기</code> 버튼을 만드세요. 처음에는 가입하기 버튼이 <b>눌리지 않는 상태</b>(<code>state=DISABLED</code>)이고, 체크하면 눌리는 상태(<code>NORMAL</code>)가 됩니다. 체크를 풀면 다시 눌리지 않게 합니다. 가입하기를 누르면 <code>가입을 환영합니다!</code> 메시지 창을 띄웁니다.</p>',
            hint: '체크버튼의 command 함수에서 <code>btn.configure(state = NORMAL)</code> 또는 <code>state = DISABLED</code> 로 바꿉니다.',
            starter: `from tkinter import *
from tkinter import messagebox

def check() :
    pass  # TODO: agree 값에 따라 버튼 상태 바꾸기

def join() :
    messagebox.showinfo("가입", "가입을 환영합니다!")

window = Tk()
window.title("회원 가입")
agree = IntVar()

# TODO: 체크버튼과 가입하기 버튼(처음에는 DISABLED) 만들기

window.mainloop()
`,
            solution: `from tkinter import *
from tkinter import messagebox

def check() :
    if agree.get() == 1 :
        btn.configure(state = NORMAL)
    else :
        btn.configure(state = DISABLED)

def join() :
    messagebox.showinfo("가입", "가입을 환영합니다!")

window = Tk()
window.title("회원 가입")
agree = IntVar()

cb = Checkbutton(window, text = "약관에 동의합니다", variable = agree, command = check)
btn = Button(window, text = "가입하기", state = DISABLED, command = join)

cb.pack(padx = 20, pady = 5)
btn.pack(pady = 5)

window.mainloop()
`
          }
        ],
        quiz: [
          { q: '버튼을 클릭했을 때 <code>myFunc</code> 함수가 실행되도록 올바르게 연결한 코드는?', options: ['Button(window, command = myFunc())', 'Button(window, command = myFunc)', 'Button(window, command = "myFunc")', 'Button(window, click = myFunc)'], answer: 1,
            explain: 'command 에는 함수 <b>이름</b>만 넘깁니다. <code>myFunc()</code> 처럼 괄호를 붙이면 버튼을 만들 때 한 번 실행되고 그 결과(None)가 들어갑니다.' },
          { q: '체크버튼과 연결된 <code>chk = IntVar()</code> 에서, 체크버튼이 <b>켜져 있을 때</b> <code>chk.get()</code> 의 기본 값은?', options: ['0', '1', 'True', '"on"'], answer: 1,
            explain: '기본값은 켜짐 1, 꺼짐 0 입니다. onvalue · offvalue 옵션으로 바꿀 수 있습니다.' },
          { q: '라디오버튼 3개 중 하나만 선택되게 하려면?', options: ['버튼마다 다른 variable, 같은 value', '모두 같은 variable, 서로 다른 value', '모두 같은 variable, 같은 value', 'variable 없이 command 만 지정'], answer: 1,
            explain: '같은 그룹은 variable 을 함께 쓰고, 각 버튼은 서로 다른 value 를 가집니다.' },
          { q: '이미 만든 레이블 <code>label1</code> 의 글자를 "Java" 로 바꾸는 코드는?', options: ['label1.text = "Java"', 'label1.configure(text = "Java")', 'label1.pack(text = "Java")', 'Label(label1, text = "Java")'], answer: 1,
            explain: '<code>configure()</code>(또는 <code>config()</code>)로 위젯의 옵션을 나중에 바꿉니다.' },
          { q: '<code>messagebox.showinfo()</code> 를 쓰기 위해 필요한 import 문은?', options: ['import messagebox', 'from tkinter import messagebox', 'from tkinter import * 만 있으면 된다', 'import tkinter.showinfo'], answer: 1,
            explain: 'messagebox 는 tkinter 의 하위 모듈이라 <code>from tkinter import *</code> 로는 가져와지지 않습니다. 따로 import 해야 합니다.' }
        ],
        slides: [
          { layout: 'title', title: '버튼 · 체크버튼 · 라디오버튼', subtitle: 'Chapter 10 · Section 02 기본 위젯 활용', badge: '2교시',
            notes: '<p>지난 시간: 창과 레이블(보여 주기만 함). 오늘: 사용자가 누르면 반응하는 위젯.</p><p>시간: 1분</p>' },
          { layout: 'code', title: 'Code10-05 버튼', code: `from tkinter import *
window = Tk()

button1 = Button(window, text = "파이썬 종료", fg = "red", command = quit)

button1.pack()

window.mainloop()`,
            points: ['<code>command = 함수이름</code>: 클릭하면 실행', '<code>quit</code>: 파이썬 프로그램 종료', '창만 닫기: <code>command = window.destroy</code>'],
            notes: '<p>강의자료 10쪽. 버튼을 눌러 프로그램이 끝나는 것을 보여 줍니다(콘솔에 종료 표시).</p><p><b>발문</b>: "quit 뒤에 괄호가 없는 이유는?" → 다음 장 그림으로 연결.</p><p>시간: 4분</p>' },
          { layout: 'diagram', title: 'command 에는 함수 이름만!', html: FIG_COMMAND, caption: '괄호를 붙이면 버튼을 만들 때 바로 실행되어 버린다',
            notes: '<p>강의자료에 없는 보충. 가장 흔한 실수이므로 꼭 짚습니다. <code>command=myFunc()</code> 로 바꿔 실행해서 창이 뜨자마자 메시지 창이 나오는 모습을 직접 보여 주면 효과적입니다.</p><p>시간: 3분</p>' },
          { layout: 'code', title: 'Code10-06 이미지 버튼 + 메시지 창', code: `from tkinter import *
from tkinter import messagebox

## 함수 선언 부분 ##
def myFunc() :
    messagebox.showinfo("강아지 버튼", "강아지가 귀엽죠? ^^")

## 메인 코드 부분 ##
window = Tk()

photo = PhotoImage(file = "GIF/dog2.gif")
button1 = Button(window, image = photo, command = myFunc)

button1.pack()

window.mainloop()`,
            points: ['messagebox 는 따로 import', '<code>showinfo(제목, 내용)</code>', '버튼에도 <code>image</code> 옵션', '함수 선언 부분 → 메인 코드 부분 순서'],
            notes: '<p>강의자료 11쪽. 함수가 command 보다 먼저 정의되어야 한다는 것을 강조합니다(순서를 바꾸면 NameError).</p><p>showwarning, showerror, askyesno 도 한 번씩 바꿔 보게 합니다.</p><p>시간: 5분</p>' },
          { layout: 'code', title: '📘 클릭 카운터 — global 과 configure', code: `from tkinter import *

count = 0

def clickButton() :
    global count
    count += 1
    label1.configure(text = "클릭 횟수 : " + str(count))

window = Tk()
label1 = Label(window, text = "클릭 횟수 : 0", font = ("맑은 고딕", 15))
button1 = Button(window, text = "눌러 보세요", command = clickButton)
label1.pack()
button1.pack()

window.mainloop()`,
            points: ['함수에서 전역 변수를 바꾸려면 <code>global</code>', '<code>configure()</code>: 위젯 옵션 바꾸기', '4교시 사진 앨범의 핵심 기법'],
            notes: '<p>강의자료에 없는 추가 예제지만, [프로그램 1] 의 num 처리와 같은 구조이므로 미리 연습시킵니다.</p><p>global 을 빼면 UnboundLocalError 가 콘솔에 "Exception in Tkinter callback" 으로 출력됩니다. 창은 계속 동작한다는 점도 보여 줍니다.</p><p>시간: 4분</p>' },
          { layout: 'code', title: 'Code10-07 체크버튼', code: `from tkinter import *
from tkinter import messagebox
window = Tk()

def myFunc() :
    if chk.get() == 0 :
        messagebox.showinfo("", "체크버튼이 꺼졌어요.")
    else :
        messagebox.showinfo("", "체크버튼이 켜졌어요.")

chk = IntVar()
cb1 = Checkbutton(window, text = "클릭하세요", variable = chk, command = myFunc)

cb1.pack()

window.mainloop()`,
            points: ['<code>IntVar()</code>: 위젯과 연결된 변수', '<code>variable = chk</code> 로 연결', '<code>chk.get()</code> → 켜짐 1 / 꺼짐 0'],
            notes: '<p>강의자료 12쪽. IntVar 를 "위젯과 선으로 연결된 상자"에 비유합니다. <code>chk.set(1)</code> 을 메인 코드에 넣어 처음부터 체크된 상태로 만드는 것도 보여 줍니다.</p><p>시간: 5분</p>' },
          { layout: 'code', title: 'Code10-08 라디오버튼', code: `from tkinter import *
window = Tk()

def myFunc() :
    if var.get() == 1 :
        label1.configure(text = "파이썬")
    elif var.get() == 2 :
        label1.configure(text = "C++")
    else :
        label1.configure(text = "Java")

var = IntVar()
rb1 = Radiobutton(window, text = "파이썬", variable = var, value = 1, command = myFunc)
rb2 = Radiobutton(window, text = "C++", variable = var, value = 2, command = myFunc)
rb3 = Radiobutton(window, text = "Java", variable = var, value = 3, command = myFunc)
label1 = Label(window, text = "선택한 언어 : ", fg = "red")

rb1.pack(); rb2.pack(); rb3.pack(); label1.pack()
window.mainloop()`,
            points: ['같은 <code>variable</code>, 다른 <code>value</code>', '선택한 버튼의 value 가 var 에 저장', '<code>configure(text=…)</code> 로 결과 표시'],
            notes: '<p>강의자료 13~14쪽(원래 26행 코드를 슬라이드용으로 줄임 — 한 줄에 세미콜론으로 pack).</p><p><b>발문</b>: "rb2 의 value 도 1 로 바꾸면?" → 파이썬과 C++ 이 함께 선택된 것처럼 보임. 직접 실험.</p><p>시간: 6분</p>' },
          { layout: 'table', title: '체크버튼 vs 라디오버튼', head: ['', '체크버튼', '라디오버튼'], rows: [
            ['선택', '여러 개 가능', '그룹에서 하나만'], ['변수', '버튼마다 따로', '그룹이 하나를 공유'], ['값', '켜짐 1 / 꺼짐 0', '선택한 버튼의 value'], ['예', '관심 분야, 약관 동의', '학년, 결제 방법']],
            notes: '<p>정리용 표입니다. 실생활 예를 학생들에게 더 물어봅니다(설문지, 쇼핑몰 옵션 등).</p><p>시간: 2분</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '버튼 클릭 시 myFunc 를 실행하도록 올바르게 연결한 것은?', options: ['command = myFunc()', 'command = myFunc', 'command = "myFunc"', 'click = myFunc'], answer: 1,
            explain: '함수 이름만 넘깁니다. 괄호를 붙이면 즉시 실행됩니다.',
            notes: '<p>시간: 1분</p>' },
          { layout: 'practice', title: '실습 10-2. 커피 주문기', desc: '라디오버튼 3개(아메리카노 · 카페라테 · 바닐라라테)와 [주문하기] 버튼. 누르면 선택한 메뉴와 가격을 메시지 창으로, 선택하지 않았으면 경고 창을 띄웁니다.',
            starter: `from tkinter import *
from tkinter import messagebox

names = ["아메리카노", "카페라테", "바닐라라테"]
prices = [3000, 3500, 4000]

def order() :
    pass  # TODO

window = Tk()
var = IntVar()
# TODO: 라디오버튼 3개 + 주문하기 버튼
window.mainloop()
`,
            solution: `from tkinter import *
from tkinter import messagebox

names = ["아메리카노", "카페라테", "바닐라라테"]
prices = [3000, 3500, 4000]

def order() :
    n = var.get()
    if n == 0 :
        messagebox.showwarning("주문", "메뉴를 선택하세요.")
    else :
        messagebox.showinfo("주문", names[n - 1] + " 주문 완료! (" + str(prices[n - 1]) + "원)")

window = Tk()
var = IntVar()
for i in range(3) :
    Radiobutton(window, text = names[i], variable = var, value = i + 1).pack(anchor = W)
Button(window, text = "주문하기", command = order).pack()
window.mainloop()
`,
            notes: '<p>7분 개별 실습. 선택하지 않았을 때 var.get() 이 0 이라는 점이 포인트입니다. 빨리 끝낸 학생은 실습 10-3(약관 동의)에 도전.</p><p>시간: 7분</p>' },
          { layout: 'summary', title: '정리', bullets: ['<code>Button(…, command = 함수이름)</code> — 괄호 없이!', '<code>messagebox.showinfo(제목, 내용)</code> — 따로 import', '<code>Checkbutton</code> + <code>IntVar</code>: 켜짐 1 / 꺼짐 0', '<code>Radiobutton</code>: 같은 variable, 다른 value', '<code>configure()</code> 로 위젯 옵션 바꾸기'],
            notes: '<p>다음 시간: 위젯을 원하는 방향 · 간격으로 배치하는 pack() 옵션.</p><p>시간: 2분</p>' }
        ]
      },

      /* ───────────────────────── 3교시: pack() 으로 위젯 배치하기 ───────────────────────── */
      {
        id: 'ch10-3',
        title: 'pack() 으로 위젯 배치하기',
        minutes: 45,
        goals: [
          'pack() 의 side 옵션(LEFT · RIGHT · TOP · BOTTOM)으로 위젯을 가로 · 세로로 정렬할 수 있다',
          '리스트와 for 문으로 같은 종류의 위젯을 여러 개 만들 수 있다',
          'fill 로 위젯을 창 폭에 맞추고, padx · pady(바깥 여백)와 ipadx · ipady(안쪽 여백)를 구별해 쓸 수 있다',
          'Frame 으로 위젯을 묶어 복잡한 화면을 배치할 수 있다'
        ],
        flow: [['복습 · 도입', 3], ['수평 정렬 side=LEFT/RIGHT', 8], ['리스트와 for 문으로 버튼 만들기', 8], ['수직 정렬 · fill', 8], ['padx/pady · ipadx/ipady', 10], ['Frame 활용 · 정리', 8]],
        content: [
          { type: 'h', text: '수평 정렬' },
          { type: 'p', html: '지금까지는 <code>pack()</code> 을 옵션 없이 불러서 위젯이 위에서 아래로 쌓였습니다. <code>pack()</code> 에 <code>side</code> 옵션을 주면 위젯을 붙일 <b>방향</b>을 정할 수 있습니다. 가로로 나란히 놓으려면 <code>side=LEFT</code> 또는 <code>side=RIGHT</code> 를 씁니다.' },
          { type: 'code', title: 'Code10-09. 수평 정렬', code: `from tkinter import *
window = Tk()

button1 = Button(window, text = "버튼1")
button2 = Button(window, text = "버튼2")
button3 = Button(window, text = "버튼3")

button1.pack(side = LEFT)
button2.pack(side = LEFT)
button3.pack(side = LEFT)

window.mainloop()`, desc: '<code>8~10행</code> 세 버튼 모두 왼쪽부터 차례로 붙습니다. 결과는 <code>[버튼1][버튼2][버튼3]</code> 입니다.' },

          { type: 'h', text: '리스트와 for 문 활용' },
          { type: 'p', html: '같은 모양의 위젯을 여러 개 만들 때는 변수를 하나씩 만드는 대신 <b>리스트</b>에 담고 <b>for 문</b>으로 처리하면 코드가 짧아집니다. 버튼이 100개라도 코드 길이는 같습니다.' },
          { type: 'code', title: 'Code10-10. 리스트와 for 문 활용', code: `from tkinter import *
window = Tk()

btnList = [None] * 3

for i in range(0, 3) :
    btnList[i] = Button(window, text = "버튼" + str(i + 1))

for btn in btnList :
    btn.pack(side = RIGHT)

window.mainloop()`, desc: '<code>4행</code> <code>[None] * 3</code> 은 빈칸 3개짜리 리스트 <code>[None, None, None]</code> 을 만듭니다. <code>6~7행</code> 빈칸마다 버튼을 만들어 넣습니다. 글자는 "버튼1", "버튼2", "버튼3". <code>9~10행</code> 모든 버튼을 <b>오른쪽부터</b> 붙이므로 화면에는 <code>[버튼3][버튼2][버튼1]</code> 순서로 보입니다.' },
          { type: 'figure', html: FIG_PACK, caption: 'side 와 fill 옵션에 따른 배치 — 먼저 pack 한 위젯이 지정한 쪽 끝부터 자리를 잡는다' },
          { type: 'callout', kind: 'info', title: '왜 RIGHT 는 순서가 거꾸로일까?', html: 'pack 은 <b>남은 공간</b>에서 지정한 쪽 끝부터 위젯을 붙입니다. 버튼1 을 먼저 맨 오른쪽에 붙이고, 버튼2 는 남은 공간의 오른쪽(버튼1 의 왼쪽), 버튼3 은 그 왼쪽에 붙습니다. 그래서 왼쪽에서 보면 버튼3 · 버튼2 · 버튼1 순서가 됩니다. <code>BOTTOM</code> 도 같은 이유로 아래에서부터 쌓입니다.' },

          { type: 'h', text: '수직 정렬' },
          { type: 'p', html: '세로로 쌓으려면 <code>side=TOP</code>(위에서부터) 또는 <code>side=BOTTOM</code>(아래에서부터)을 씁니다. 옵션 없이 <code>pack()</code> 한 것은 <code>side=TOP</code> 과 같습니다. Code10-10 의 <b>10행만</b> 바꿔서 실행해 봅시다.' },
          { type: 'code', title: 'Code10-10 변형 ①. side = TOP', code: `from tkinter import *
window = Tk()

btnList = [None] * 3

for i in range(0, 3) :
    btnList[i] = Button(window, text = "버튼" + str(i + 1))

for btn in btnList :
    btn.pack(side = TOP)

window.mainloop()`, desc: '위에서부터 버튼1 · 버튼2 · 버튼3 순서로 쌓입니다.' },
          { type: 'code', title: 'Code10-10 변형 ②. side = BOTTOM', code: `from tkinter import *
window = Tk()

btnList = [None] * 3

for i in range(0, 3) :
    btnList[i] = Button(window, text = "버튼" + str(i + 1))

for btn in btnList :
    btn.pack(side = BOTTOM)

window.mainloop()`, desc: '아래에서부터 쌓이므로 위에서 보면 버튼3 · 버튼2 · 버튼1 순서입니다.' },

          { type: 'h', text: '폭 조정' },
          { type: 'p', html: '버튼은 기본적으로 글자 크기만큼만 자리를 차지합니다. <code>fill=X</code> 를 주면 위젯이 <b>창의 가로 폭을 꽉 채우도록</b> 늘어납니다. (세로는 <code>fill=Y</code>, 양쪽은 <code>fill=BOTH</code>)' },
          { type: 'code', title: 'Code10-10 변형 ③. 폭 조정 fill = X', code: `from tkinter import *
window = Tk()

btnList = [None] * 3

for i in range(0, 3) :
    btnList[i] = Button(window, text = "버튼" + str(i + 1))

for btn in btnList :
    btn.pack(side = TOP, fill = X)

window.mainloop()`, desc: '세 버튼의 폭이 창의 폭과 같아집니다. 창의 오른쪽 아래 모서리를 끌어 창을 넓혀 보세요. 버튼도 함께 넓어집니다.' },

          { type: 'h', text: '위젯 사이의 여백 조절' },
          { type: 'p', html: '<code>padx</code> · <code>pady</code> 는 위젯 <b>바깥</b>에 여백을 줍니다. 위젯과 위젯 사이, 위젯과 창 테두리 사이가 벌어집니다. 값은 픽셀 단위입니다.' },
          { type: 'code', title: 'Code10-10 변형 ④. padx · pady', code: `from tkinter import *
window = Tk()

btnList = [None] * 3

for i in range(0, 3) :
    btnList[i] = Button(window, text = "버튼" + str(i + 1))

for btn in btnList :
    btn.pack(side = TOP, fill = X, padx = 10, pady = 10)

window.mainloop()`, desc: '버튼 좌우에 10픽셀, 위아래에 10픽셀의 여백이 생겨 버튼 사이가 띄워집니다.' },

          { type: 'h', text: '위젯 내부의 여백 조절' },
          { type: 'p', html: '<code>ipadx</code> · <code>ipady</code> 의 <b>i 는 internal(내부)</b> 입니다. 위젯 <b>안쪽</b>, 즉 글자와 테두리 사이에 여백을 주어 위젯 자체가 커집니다.' },
          { type: 'code', title: 'Code10-10 변형 ⑤. ipadx · ipady', code: `from tkinter import *
window = Tk()

btnList = [None] * 3

for i in range(0, 3) :
    btnList[i] = Button(window, text = "버튼" + str(i + 1))

for btn in btnList :
    btn.pack(side = TOP, fill = X, ipadx = 10, ipady = 10)

window.mainloop()`, desc: '버튼 사이는 붙어 있지만 버튼 하나하나가 위아래로 두툼해집니다.' },
          { type: 'code', title: 'Code10-10 변형 ⑥. 위젯 내부와 외부에 모두 여백', code: `from tkinter import *
window = Tk()

btnList = [None] * 3

for i in range(0, 3) :
    btnList[i] = Button(window, text = "버튼" + str(i + 1))

for btn in btnList :
    btn.pack(side = TOP, fill = X, ipadx = 10, ipady = 10, padx = 10, pady = 10)

window.mainloop()`, desc: '버튼이 두툼해지고(ipad), 버튼 사이도 벌어집니다(pad). 두 가지를 함께 쓰면 보기 좋은 화면을 만들 수 있습니다.' },
          { type: 'figure', html: FIG_PAD, caption: 'padx · pady 는 위젯 바깥의 여백, ipadx · ipady 는 위젯 안쪽의 여백' },
          { type: 'table', head: ['옵션', '값', '뜻'], rows: [
            ['<code>side</code>', '<code>TOP</code>(기본), <code>BOTTOM</code>, <code>LEFT</code>, <code>RIGHT</code>', '어느 쪽부터 붙일지'],
            ['<code>fill</code>', '<code>NONE</code>(기본), <code>X</code>, <code>Y</code>, <code>BOTH</code>', '남는 공간을 채우도록 늘리기'],
            ['<code>expand</code>', '<code>0</code>(기본) / <code>1</code>', '창이 커질 때 남는 공간까지 차지하기'],
            ['<code>anchor</code>', '<code>N</code>, <code>SE</code>, <code>CENTER</code> …', '배정된 공간 안에서의 위치'],
            ['<code>padx</code> · <code>pady</code>', '픽셀', '위젯 바깥 여백'],
            ['<code>ipadx</code> · <code>ipady</code>', '픽셀', '위젯 안쪽 여백']
          ], caption: 'pack() 의 주요 옵션' },
          { type: 'callout', kind: 'more', title: 'expand 와 fill=BOTH — 창 크기에 따라 함께 커지기', html: '<p><code>fill</code> 은 "배정받은 칸을 채워라", <code>expand=1</code> 은 "창이 커지면 남는 공간도 내 칸으로 달라"는 뜻입니다. 둘을 함께 쓰면(<code>pack(expand=1, fill=BOTH)</code>) 창을 늘릴 때 위젯도 가로 · 세로로 같이 커집니다. 5교시의 <code>label1.pack(expand=1, anchor=CENTER)</code> 는 "남는 공간을 다 차지하고 그 가운데에 놓아라" 라는 뜻입니다.</p>' },

          { type: 'h', text: '📘 Frame 으로 위젯 묶기' },
          { type: 'p', html: 'pack 하나만으로는 "윗줄은 가로로, 아랫줄도 가로로" 같은 배치가 어렵습니다. 이럴 때는 보이지 않는 상자인 <b>Frame</b> 을 만들고, 위젯을 창 대신 Frame 에 넣습니다. Frame 들은 창에 세로로 쌓고, 각 Frame 안에서는 가로로 쌓으면 됩니다.' },
          { type: 'code', title: '추가 예제. Frame 으로 숫자 키패드 만들기', code: `from tkinter import *
window = Tk()
window.title("키패드")

display = Label(window, text = "0", font = ("맑은 고딕", 20), bg = "white", anchor = E)
display.pack(fill = X, padx = 5, pady = 5)

keys = [["7", "8", "9"], ["4", "5", "6"], ["1", "2", "3"]]
for row in keys :
    frame = Frame(window)                 # 한 줄을 담을 상자
    frame.pack(side = TOP, fill = X)
    for k in row :
        btn = Button(frame, text = k, width = 5, height = 2)   # 부모가 frame
        btn.pack(side = LEFT, expand = 1, fill = X, padx = 2, pady = 2)

window.mainloop()`, desc: '<code>10~11행</code> 한 줄마다 Frame 을 만들어 창에 위에서부터 쌓습니다. <code>13행</code> 버튼의 부모를 <code>window</code> 가 아니라 <code>frame</code> 으로 지정합니다. <code>14행</code> 같은 줄의 버튼은 왼쪽부터 붙고, <code>expand=1, fill=X</code> 로 줄 전체를 고르게 나눠 가집니다. (tkinter 에는 표 모양 배치를 하는 <code>grid(row=, column=)</code> 도 있습니다.)' },
          { type: 'callout', kind: 'warn', title: '한 부모 안에서 pack 과 grid 를 섞지 마세요', html: '같은 창(또는 같은 Frame) 안의 위젯들은 <code>pack</code>, <code>grid</code>, <code>place</code> 중 <b>한 가지 방식</b>으로 배치하는 것이 원칙입니다. 특히 pack 과 grid 를 한 부모 안에서 섞으면 실제 tkinter 에서는 오류가 나거나 프로그램이 멈출 수 있습니다. 서로 다른 Frame 이라면 방식을 달리해도 됩니다.' }
        ],
        practice: [
          {
            title: '실습 10-4. 무지개 버튼',
            level: 1,
            desc: '<p>리스트와 for 문으로 무지개 7색(<code>red, orange, yellow, green, blue, navy, purple</code>) 버튼을 만드세요. 버튼의 배경색(<code>bg</code>)과 글자가 색 이름과 같고, 세로로 쌓이며 창 폭에 맞춰 늘어나고(<code>fill=X</code>), 버튼 사이에 위아래 여백 3픽셀, 안쪽 위아래 여백 5픽셀을 줍니다.</p>',
            hint: '<code>btn.pack(side = TOP, fill = X, pady = 3, ipady = 5)</code>',
            starter: `from tkinter import *
window = Tk()
window.title("무지개")
window.geometry("200x350")

colors = ["red", "orange", "yellow", "green", "blue", "navy", "purple"]

# TODO: for 문으로 버튼을 만들고 배치하기

window.mainloop()
`,
            solution: `from tkinter import *
window = Tk()
window.title("무지개")
window.geometry("200x350")

colors = ["red", "orange", "yellow", "green", "blue", "navy", "purple"]

for c in colors :
    btn = Button(window, text = c, bg = c)
    btn.pack(side = TOP, fill = X, pady = 3, ipady = 5)

window.mainloop()
`
          },
          {
            title: '실습 10-5. 위아래 두 줄 버튼',
            level: 2,
            desc: '<p>Frame 2개를 이용해 윗줄에는 <code>[이전] [재생] [다음]</code>, 아랫줄에는 <code>[볼륨 -] [볼륨 +]</code> 버튼을 가로로 배치하세요. 윗줄 버튼은 <code>padx=5, pady=5</code> 로 간격을 둡니다.</p>',
            hint: '<code>top = Frame(window)</code>, <code>top.pack()</code> 후 버튼의 부모를 <code>top</code> 으로 하고 <code>side=LEFT</code>.',
            starter: `from tkinter import *
window = Tk()
window.title("플레이어")

# TODO: 윗줄 Frame 과 버튼 3개

# TODO: 아랫줄 Frame 과 버튼 2개

window.mainloop()
`,
            solution: `from tkinter import *
window = Tk()
window.title("플레이어")

top = Frame(window)
top.pack(side = TOP)
for t in ["이전", "재생", "다음"] :
    Button(top, text = t).pack(side = LEFT, padx = 5, pady = 5)

bottom = Frame(window)
bottom.pack(side = TOP)
for t in ["볼륨 -", "볼륨 +"] :
    Button(bottom, text = t).pack(side = LEFT)

window.mainloop()
`
          }
        ],
        quiz: [
          { q: '다음 코드의 실행 결과 버튼의 순서(왼쪽 → 오른쪽)는?<pre><code>for i in range(3) :\n    Button(window, text = "B" + str(i + 1)).pack(side = RIGHT)</code></pre>', options: ['B1 B2 B3', 'B3 B2 B1', 'B1 B3 B2', '세로로 쌓인다'], answer: 1,
            explain: 'RIGHT 는 오른쪽 끝부터 붙이므로 먼저 만든 B1 이 가장 오른쪽에 놓입니다.' },
          { q: '버튼을 창의 가로 폭에 꽉 차게 늘리는 pack 옵션은?', options: ['side = X', 'fill = X', 'expand = X', 'ipadx = X'], answer: 1,
            explain: '<code>fill=X</code> 는 가로, <code>fill=Y</code> 는 세로, <code>fill=BOTH</code> 는 양쪽으로 채웁니다.' },
          { q: '위젯 <b>자체</b>를 두툼하게(글자와 테두리 사이를 넓게) 만드는 옵션은?', options: ['padx · pady', 'ipadx · ipady', 'width · height 만 가능', 'side'], answer: 1,
            explain: 'i 는 internal(내부). ipadx · ipady 는 위젯 안쪽 여백, padx · pady 는 바깥 여백입니다.' },
          { q: '<code>btnList = [None] * 3</code> 을 실행한 뒤 btnList 의 값은?', options: ['[None]', '[3]', '[None, None, None]', 'None3'], answer: 2,
            explain: '리스트에 * 정수를 하면 그만큼 반복된 리스트가 됩니다. 나중에 채울 빈칸을 미리 만들 때 씁니다.' }
        ],
        slides: [
          { layout: 'title', title: 'pack() 으로 위젯 배치하기', subtitle: 'Chapter 10 · Section 03 위젯의 배치와 크기 조절 (1)', badge: '3교시',
            notes: '<p>지금까지 pack() 은 위에서 아래로만 쌓았습니다. 오늘은 방향 · 폭 · 여백을 조절합니다.</p><p>시간: 1분</p>' },
          { layout: 'code', title: 'Code10-09 수평 정렬', code: `from tkinter import *
window = Tk()

button1 = Button(window, text = "버튼1")
button2 = Button(window, text = "버튼2")
button3 = Button(window, text = "버튼3")

button1.pack(side = LEFT)
button2.pack(side = LEFT)
button3.pack(side = LEFT)

window.mainloop()`,
            points: ['<code>pack(side = LEFT)</code>: 왼쪽부터 가로로', '옵션 없는 <code>pack()</code> = <code>side = TOP</code>'],
            notes: '<p>강의자료 15쪽. LEFT 를 RIGHT 로 바꾸면? 예상을 먼저 물어본 뒤 실행합니다.</p><p>시간: 3분</p>' },
          { layout: 'code', title: 'Code10-10 리스트와 for 문 활용', code: `from tkinter import *
window = Tk()

btnList = [None] * 3

for i in range(0, 3) :
    btnList[i] = Button(window, text = "버튼" + str(i + 1))

for btn in btnList :
    btn.pack(side = RIGHT)

window.mainloop()`,
            points: ['<code>[None] * 3</code>: 빈칸 3개 리스트', 'for 문으로 위젯 만들기 · 배치', 'RIGHT → 버튼3 · 버튼2 · 버튼1'],
            notes: '<p>강의자료 16쪽. 이 코드의 <b>10행</b>을 계속 바꾸며 수업을 진행합니다. range(0, 3) 을 range(0, 10) 으로 바꿔 버튼 10개를 만들어 보이면 반복문의 힘을 체감합니다(리스트 크기도 10 으로!).</p><p>시간: 5분</p>' },
          { layout: 'diagram', title: 'side 와 fill', html: FIG_PACK, caption: '먼저 pack 한 위젯이 지정한 쪽 끝부터 자리를 차지',
            notes: '<p>강의자료 15~18쪽의 실행 화면을 한 장에 모았습니다. RIGHT 와 BOTTOM 의 순서가 거꾸로인 이유(남은 공간의 끝에 붙임)를 설명합니다.</p><p>시간: 3분</p>' },
          { layout: 'two', title: '수직 정렬 · 폭 조정 (10행 변경)',
            left: { title: 'side = TOP / BOTTOM', code: `from tkinter import *
window = Tk()
for i in range(0, 3) :
    btn = Button(window, text = "버튼" + str(i + 1))
    btn.pack(side = BOTTOM)
window.mainloop()` },
            right: { title: 'fill = X', code: `from tkinter import *
window = Tk()
for i in range(0, 3) :
    btn = Button(window, text = "버튼" + str(i + 1))
    btn.pack(side = TOP, fill = X)
window.mainloop()` },
            notes: '<p>강의자료 17~18쪽. 슬라이드에서는 리스트 없이 줄여 썼습니다. fill=X 실행 후 창 크기를 늘려 버튼도 넓어지는 것을 보여 줍니다.</p><p>시간: 5분</p>' },
          { layout: 'two', title: '여백: padx/pady vs ipadx/ipady',
            left: { title: '바깥 여백 padx · pady', code: `from tkinter import *
window = Tk()
for i in range(0, 3) :
    btn = Button(window, text = "버튼" + str(i + 1))
    btn.pack(side = TOP, fill = X, padx = 10, pady = 10)
window.mainloop()` },
            right: { title: '안쪽 여백 ipadx · ipady', code: `from tkinter import *
window = Tk()
for i in range(0, 3) :
    btn = Button(window, text = "버튼" + str(i + 1))
    btn.pack(side = TOP, fill = X, ipadx = 10, ipady = 10)
window.mainloop()` },
            notes: '<p>강의자료 19~21쪽. 두 코드를 나란히 실행해 차이를 비교합니다. i = internal. 마지막으로 두 옵션을 모두 준 코드(강의자료 21쪽)도 실행합니다.</p><p>시간: 6분</p>' },
          { layout: 'diagram', title: '바깥 여백과 안쪽 여백', html: FIG_PAD, caption: 'pad = 위젯 사이 간격, ipad = 위젯 두께',
            notes: '<p>옷에 비유: padx 는 사람 사이의 거리, ipadx 는 두꺼운 패딩 점퍼를 입은 것.</p><p>시간: 2분</p>' },
          { layout: 'code', title: '📘 Frame 으로 위젯 묶기', code: `from tkinter import *
window = Tk()
window.title("키패드")

keys = [["7", "8", "9"], ["4", "5", "6"], ["1", "2", "3"]]
for row in keys :
    frame = Frame(window)
    frame.pack(side = TOP, fill = X)
    for k in row :
        btn = Button(frame, text = k, width = 5, height = 2)
        btn.pack(side = LEFT, expand = 1, fill = X)

window.mainloop()`,
            points: ['Frame: 위젯을 담는 보이지 않는 상자', '줄마다 Frame → 창에 세로로 쌓기', '버튼의 부모를 frame 으로 → 가로로 쌓기'],
            notes: '<p>강의자료에 없는 보충입니다. 계산기 같은 화면을 만들 때 필요합니다. 시간이 부족하면 생략 가능합니다.</p><p>시간: 5분</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: 'for 문으로 B1, B2, B3 버튼을 만들어 <code>pack(side=RIGHT)</code> 했을 때 왼쪽부터의 순서는?', options: ['B1 B2 B3', 'B3 B2 B1', 'B2 B1 B3', '세로로 쌓인다'], answer: 1,
            explain: 'RIGHT 는 오른쪽 끝부터 붙으므로 B1 이 가장 오른쪽.',
            notes: '<p>시간: 1분</p>' },
          { layout: 'practice', title: '실습 10-4. 무지개 버튼', desc: '리스트와 for 문으로 무지개 7색 버튼을 세로로, 창 폭에 맞춰(fill=X), 위아래 여백 3 · 안쪽 여백 5 로 배치하세요.',
            starter: `from tkinter import *
window = Tk()
window.geometry("200x350")
colors = ["red", "orange", "yellow", "green", "blue", "navy", "purple"]
# TODO
window.mainloop()
`,
            solution: `from tkinter import *
window = Tk()
window.geometry("200x350")
colors = ["red", "orange", "yellow", "green", "blue", "navy", "purple"]
for c in colors :
    btn = Button(window, text = c, bg = c)
    btn.pack(side = TOP, fill = X, pady = 3, ipady = 5)
window.mainloop()
`,
            notes: '<p>5분 실습. 옵션 값을 바꿔 가며 차이를 스스로 확인하게 합니다. 빨리 끝낸 학생은 실습 10-5(Frame).</p><p>시간: 6분</p>' },
          { layout: 'summary', title: '정리', bullets: ['<code>side</code>: LEFT · RIGHT(가로), TOP · BOTTOM(세로)', '리스트 + for 문으로 위젯 여러 개 만들기', '<code>fill=X</code>: 창 폭에 맞추기 (Y · BOTH)', '<code>padx/pady</code> 바깥 여백, <code>ipadx/ipady</code> 안쪽 여백', 'Frame 으로 묶어 복잡한 배치'],
            notes: '<p>다음 시간: 좌표로 정확한 위치에 놓는 place() 와 [프로그램 1] 사진 앨범 완성.</p><p>시간: 2분</p>' }
        ]
      },

      /* ───────────────────────── 4교시: place() 와 [프로그램 1] 사진 앨범 ───────────────────────── */
      {
        id: 'ch10-4',
        title: 'place() 와 [프로그램 1] 사진 앨범',
        minutes: 50,
        goals: [
          'place(x, y) 로 위젯을 창의 원하는 좌표에 놓을 수 있다',
          '중첩 for 문으로 그림 버튼 9개를 3×3 격자로 배치할 수 있다',
          'random.shuffle() 로 리스트의 순서를 무작위로 섞을 수 있다',
          '전역 변수와 configure(image=…) 로 이전/다음 버튼이 동작하는 사진 앨범을 완성할 수 있다'
        ],
        flow: [['복습 · 도입', 3], ['place() 와 좌표', 7], ['그림 9개 배치 (Code10-11)', 10], ['SELF STUDY 10-2 shuffle', 7], ['[프로그램 1] 사진 앨범 완성', 15], ['SELF STUDY 10-3 · 정리', 8]],
        content: [
          { type: 'h', text: '고정 위치에 배치' },
          { type: 'p', html: 'pack 은 위젯을 "위부터, 왼쪽부터" 차례로 쌓아 주는 편리한 방식이지만, 위젯을 <b>정확한 좌표</b>에 놓을 수는 없습니다. 원하는 위치에 딱 놓으려면 <code>pack()</code> 대신 <code>place(x=가로좌표, y=세로좌표)</code> 를 사용합니다. 좌표는 창 안쪽의 <b>왼쪽 위 모서리가 (0, 0)</b> 이고, x 는 오른쪽으로, y 는 <b>아래쪽으로</b> 커집니다.' },
          { type: 'figure', html: FIG_PLACE, caption: 'place() 의 좌표계와 3×3 격자 배치 — 한 칸의 크기 70픽셀' },
          { type: 'p', html: '다음 코드는 과자 그림 9개를 버튼에 넣어 3×3 격자로 배치합니다.' },
          { type: 'code', title: 'Code10-11. 그림 9개를 2차원으로 배치하는 코드', code: `from tkinter import *

## 전역 변수 선언 부분 ##
btnList = [None] * 9
fnameList = ["froyo.gif", "gingerbread.gif", "honeycomb.gif", "icecream.gif",
             "jellybean.gif", "kitkat.gif", "lollipop.gif", "marshmallow.gif", "nougat.gif"]
photoList = [None] * 9
i, k = 0, 0
xPos, yPos = 0, 0
num = 0

## 메인 코드 부분 ##
window = Tk()
window.geometry("210x210")

for i in range(0, 9) :
    photoList[i] = PhotoImage(file = "GIF/" + fnameList[i])
    btnList[i] = Button(window, image = photoList[i])

for i in range(0, 3) :
    for k in range(0, 3) :
        btnList[num].place(x = xPos, y = yPos)
        num += 1
        xPos += 70
    xPos = 0
    yPos += 70

window.mainloop()`, desc: '<code>4~7행</code> 버튼 9개, 파일 이름 9개, 그림 9개를 담을 리스트를 준비합니다. <code>15~17행</code> 파일 이름으로 그림을 읽고 그 그림을 넣은 버튼을 만듭니다. <code>19~25행</code> 바깥 for(i)는 <b>행</b>, 안쪽 for(k)는 <b>열</b>입니다. 한 칸 놓을 때마다 <code>xPos</code> 를 70 늘려 오른쪽으로 가고, 한 줄이 끝나면 <code>xPos</code> 를 0 으로 되돌리고 <code>yPos</code> 를 70 늘려 다음 줄로 내려갑니다. <code>num</code> 은 0~8 번 버튼을 차례로 가리킵니다.' },
          { type: 'callout', kind: 'info', title: '교재와 달라진 점', html: '교재는 안드로이드 버전 이름(프로요, 진저브레드 …)의 로고 그림을 쓰지만, 이 강좌에서는 같은 파일 이름으로 <b>과자 아이콘을 직접 그려</b> 작업 폴더의 <code>GIF</code> 폴더에 넣어 두었습니다(각 64×64 픽셀). 경로도 <code>"gif/"</code> 대신 <code>"GIF/"</code> 로 씁니다. 브라우저의 파일 시스템은 <b>대소문자를 구별</b>하므로 폴더 이름을 정확히 써야 합니다.' },
          { type: 'callout', kind: 'more', title: 'photoList 에 그림을 모아 두는 이유', html: '<p>파이썬은 더 이상 어떤 변수도 가리키지 않는 객체를 자동으로 지우는데(<b>가비지 컬렉션</b>), tkinter 의 위젯은 그림을 "파이썬 변수" 로 붙잡고 있지 않습니다. 그래서 반복문 안에서 <code>photo = PhotoImage(…)</code> 처럼 변수 하나에 계속 덮어쓰면, 앞의 그림들이 지워져 <b>버튼이 빈칸</b>으로 나올 수 있습니다(내 PC 의 tkinter 에서). 그림을 리스트에 모두 담아 두면 지워지지 않습니다. [프로그램 1] 의 <code>pLabel.image = photo</code> 도 같은 이유로 쓰는 코드입니다.</p>' },
          { type: 'code', title: '추가 예제. 한 칸 크기 · 위치를 계산식으로 구하기', code: `from tkinter import *

fnameList = ["froyo.gif", "gingerbread.gif", "honeycomb.gif", "icecream.gif",
             "jellybean.gif", "kitkat.gif", "lollipop.gif", "marshmallow.gif", "nougat.gif"]
photoList = [None] * 9

window = Tk()
window.geometry("230x230")
window.title("계산으로 배치")

for num in range(0, 9) :
    photoList[num] = PhotoImage(file = "GIF/" + fnameList[num])
    row = num // 3            # 몫 → 행 (0, 0, 0, 1, 1, 1, 2, 2, 2)
    col = num % 3             # 나머지 → 열 (0, 1, 2, 0, 1, 2, 0, 1, 2)
    btn = Button(window, image = photoList[num])
    btn.place(x = 5 + col * 75, y = 5 + row * 75)

window.mainloop()`, desc: '중첩 for 문 대신 <b>몫(<code>//</code>)과 나머지(<code>%</code>)</b>로 번호를 행 · 열로 바꾸는 방법입니다. 번호 <code>num</code> 을 3 으로 나눈 몫이 행, 나머지가 열이 됩니다. 칸 사이를 띄우려고 한 칸을 75픽셀로 하고 테두리에서 5픽셀 떨어뜨렸습니다.' },

          { type: 'h', text: 'SELF STUDY 10-2 — 그림을 섞어서 배치하기' },
          { type: 'p', html: 'random 모듈의 <code>shuffle(리스트)</code> 함수는 리스트의 순서를 <b>무작위로 섞습니다</b>. 새 리스트를 돌려주는 것이 아니라 <b>리스트 자체를 바꾸며</b>, 돌려주는 값은 <code>None</code> 입니다.' },
          { type: 'code', title: '추가 예제. random.shuffle() 맛보기', code: `import random

cards = ["A", "B", "C", "D", "E"]
random.shuffle(cards)
print(cards)

result = random.shuffle(cards)
print("shuffle() 이 돌려주는 값 :", result)`, nondeterministic: true, desc: '실행할 때마다 순서가 달라집니다. <code>cards = random.shuffle(cards)</code> 처럼 쓰면 cards 가 <code>None</code> 이 되어 버리니 주의하세요.' },

          { type: 'h', text: '[프로그램 1]의 완성 — 사진 앨범' },
          { type: 'p', html: '이제 <code>&lt;&lt; 이전</code> · <code>다음 &gt;&gt;</code> 버튼으로 제주 풍경 사진 9장을 넘겨 보는 사진 앨범을 만듭니다. 핵심 아이디어는 다음과 같습니다.' },
          { type: 'list', ordered: true, items: [
            '파일 이름 9개를 리스트 <code>fnameList</code> 에 담고, 지금 보여 주는 사진의 번호를 전역 변수 <code>num</code>(0~8)에 기억합니다.',
            '[다음] 을 누르면 <code>num</code> 을 1 늘리고, 8 을 넘으면 0 으로 돌아갑니다. [이전] 은 1 줄이고, 0 보다 작아지면 8 로 갑니다.',
            '바뀐 번호의 그림을 읽어 <code>pLabel.configure(image = photo)</code> 로 레이블의 그림을 바꿉니다.',
            '버튼과 그림 레이블은 <code>place()</code> 로 정확한 위치에 놓습니다.'
          ] },
          { type: 'figure', html: FIG_ALBUM, caption: 'num 이 0~8 을 빙글빙글 도는 원형 구조 — 마지막 다음은 처음, 처음 이전은 마지막' },
          { type: 'code', title: 'Code10-12. [프로그램 1] 완성: 사진 앨범', code: C10_12, desc: '<code>5~7행</code> 전역 변수입니다(<code>photoList</code> 는 이 코드에서는 쓰이지 않지만 교재 코드를 그대로 두었습니다). <code>11~18행</code> [다음] 버튼 함수: <code>global num</code> 으로 전역 변수를 바꿀 수 있게 하고, 번호를 늘린 뒤 그림을 새로 읽어 레이블에 넣습니다. <code>20~27행</code> [이전] 버튼 함수로 방향만 반대입니다. <code>34~35행</code> 버튼에 함수를 연결하고 <code>37~38행</code> 첫 사진(jeju1.gif)으로 레이블을 만듭니다. <code>40~42행</code> 버튼 두 개는 위쪽에, 사진은 (15, 50) 위치에 놓습니다.' },
          { type: 'callout', kind: 'warn', title: 'global 을 빠뜨리면?', html: '<code>clickNext()</code> 안에서 <code>global num</code> 을 지우면, 파이썬은 <code>num += 1</code> 의 num 을 <b>함수 안의 지역 변수</b>로 보고 "값을 정하기 전에 썼다" 는 <code>UnboundLocalError</code> 를 냅니다. 윈도 프로그램에서는 이런 오류가 나도 창이 꺼지지 않고, 콘솔에 <code>Exception in Tkinter callback</code> 과 함께 오류 내용이 출력됩니다. 버튼이 반응하지 않으면 콘솔을 확인하세요.' },
          { type: 'callout', kind: 'more', title: '<code>pLabel.image = photo</code> 는 왜 쓸까?', html: '<p>함수 안의 <code>photo</code> 는 <b>지역 변수</b>라서 함수가 끝나면 사라집니다. 그러면 파이썬이 그림 객체를 지워 버려 내 PC 의 tkinter 에서는 레이블이 <b>빈 화면</b>이 됩니다. <code>pLabel.image = photo</code> 는 레이블 객체에 그림을 <b>매달아 두어</b>(레이블이 살아 있는 한 그림도 살아 있게) 이 문제를 막는 관용 코드입니다. <code>image</code> 라는 이름은 아무 이름이나 써도 되지만 관례상 image 를 씁니다.</p>' },
          { type: 'callout', kind: 'more', title: '나머지 연산자로 더 짧게', html: '<p><code>if num &gt; 8 : num = 0</code> 대신 <code>num = (num + 1) % 9</code> 라고 쓰면 한 줄로 원형 순환을 만들 수 있습니다. 이전 버튼은 <code>num = (num - 1) % 9</code> 입니다. 파이썬에서 <code>-1 % 9</code> 는 <b>8</b> 이므로 0 에서 이전을 누르면 자연스럽게 8 이 됩니다. 사진 개수가 바뀌어도 되게 하려면 <code>% len(fnameList)</code> 로 쓰면 됩니다.</p><p>교재 코드 2행의 <code>from time import *</code> 는 이 프로그램에서 쓰이지 않습니다. 사진이 자동으로 넘어가는 슬라이드 쇼를 만든다면 <code>time.sleep()</code> 대신 tkinter 의 <code>window.after(밀리초, 함수)</code> 를 써야 창이 멈추지 않습니다(실습 10-6).</p>' }
        ],
        practice: [
          {
            title: 'SELF STUDY 10-2. 그림을 임의로 섞어서 배치하기',
            level: 1,
            desc: '<p>Code10-11 을 실행할 때마다 9개의 그림이 <b>임의의 순서</b>로 섞여서 나타나게 하세요.</p>',
            hint: 'random 모듈을 임포트하고, 그림을 읽기 전에 <code>random.shuffle(fnameList)</code> 로 파일 이름 리스트를 섞습니다.',
            nondeterministic: true,
            starter: `from tkinter import *
# TODO: random 모듈 임포트

btnList = [None] * 9
fnameList = ["froyo.gif", "gingerbread.gif", "honeycomb.gif", "icecream.gif",
             "jellybean.gif", "kitkat.gif", "lollipop.gif", "marshmallow.gif", "nougat.gif"]
photoList = [None] * 9
xPos, yPos = 0, 0
num = 0

window = Tk()
window.geometry("210x210")

# TODO: fnameList 섞기

for i in range(0, 9) :
    photoList[i] = PhotoImage(file = "GIF/" + fnameList[i])
    btnList[i] = Button(window, image = photoList[i])

for i in range(0, 3) :
    for k in range(0, 3) :
        btnList[num].place(x = xPos, y = yPos)
        num += 1
        xPos += 70
    xPos = 0
    yPos += 70

window.mainloop()
`,
            solution: `from tkinter import *
import random

btnList = [None] * 9
fnameList = ["froyo.gif", "gingerbread.gif", "honeycomb.gif", "icecream.gif",
             "jellybean.gif", "kitkat.gif", "lollipop.gif", "marshmallow.gif", "nougat.gif"]
photoList = [None] * 9
xPos, yPos = 0, 0
num = 0

window = Tk()
window.geometry("210x210")

random.shuffle(fnameList)

for i in range(0, 9) :
    photoList[i] = PhotoImage(file = "GIF/" + fnameList[i])
    btnList[i] = Button(window, image = photoList[i])

for i in range(0, 3) :
    for k in range(0, 3) :
        btnList[num].place(x = xPos, y = yPos)
        num += 1
        xPos += 70
    xPos = 0
    yPos += 70

window.mainloop()
`
          },
          {
            title: 'SELF STUDY 10-3. 버튼 사이에 파일명 표시하기',
            level: 2,
            desc: '<p>Code10-12 를 수정해서 [이전] 버튼과 [다음] 버튼 <b>사이에 지금 보고 있는 사진의 파일명</b>(예: <code>jeju3.gif</code>)을 표시하세요. 사진을 넘길 때마다 파일명도 바뀌어야 합니다.</p>',
            hint: '파일명 레이블 <code>fLabel</code> 을 만들어 <code>place(x = 330, y = 12)</code> 쯤에 두고, clickNext · clickPrev 함수 안에서 <code>fLabel.configure(text = fnameList[num])</code> 을 실행합니다.',
            starter: C10_12.replace('pLabel.place(x = 15, y = 50)', 'pLabel.place(x = 15, y = 50)\n\n# TODO: 파일명 레이블 fLabel 을 만들어 두 버튼 사이에 배치하고,\n#       clickNext / clickPrev 에서 글자를 바꾸기') + '\n',
            solution: `from tkinter import *

## 전역 변수 선언 부분 ##
fnameList = ["jeju1.gif", "jeju2.gif", "jeju3.gif", "jeju4.gif", "jeju5.gif",
             "jeju6.gif", "jeju7.gif", "jeju8.gif", "jeju9.gif"]
num = 0

## 함수 선언 부분 ##
def showPhoto() :
    photo = PhotoImage(file = "GIF/" + fnameList[num])
    pLabel.configure(image = photo)
    pLabel.image = photo
    fLabel.configure(text = fnameList[num])

def clickNext() :
    global num
    num += 1
    if num > 8 :
        num = 0
    showPhoto()

def clickPrev() :
    global num
    num -= 1
    if num < 0 :
        num = 8
    showPhoto()

## 메인 코드 부분 ##
window = Tk()
window.geometry("700x500")
window.title("사진 앨범 보기")

btnPrev = Button(window, text = "<< 이전", command = clickPrev)
btnNext = Button(window, text = "다음 >>", command = clickNext)
fLabel = Label(window, text = fnameList[0], relief = "solid", bd = 1, padx = 5)

photo = PhotoImage(file = "GIF/" + fnameList[0])
pLabel = Label(window, image = photo)

btnPrev.place(x = 250, y = 10)
fLabel.place(x = 330, y = 12)
btnNext.place(x = 420, y = 10)
pLabel.place(x = 15, y = 50)

window.mainloop()
`
          },
          {
            title: '실습 10-6. 자동 슬라이드 쇼',
            level: 3,
            desc: '<p>Code10-12 에 <code>[▶ 자동]</code> 버튼을 추가하세요. 누르면 2초(2000밀리초)마다 사진이 저절로 다음 사진으로 넘어갑니다. 다시 누르면 멈추고, 버튼 글자는 <code>[■ 멈춤]</code> ↔ <code>[▶ 자동]</code> 으로 바뀝니다.</p>',
            hint: '<code>window.after(2000, 함수)</code> 는 2초 뒤에 함수를 한 번 불러 줍니다. 그 함수 안에서 <code>clickNext()</code> 를 부르고 다시 <code>after</code> 로 자기 자신을 예약하면 반복됩니다. 전역 변수 <code>playing</code>(True/False)으로 계속할지 결정합니다.',
            starter: `from tkinter import *

fnameList = ["jeju1.gif", "jeju2.gif", "jeju3.gif", "jeju4.gif", "jeju5.gif",
             "jeju6.gif", "jeju7.gif", "jeju8.gif", "jeju9.gif"]
num = 0
playing = False

def clickNext() :
    global num
    num = (num + 1) % 9
    photo = PhotoImage(file = "GIF/" + fnameList[num])
    pLabel.configure(image = photo)
    pLabel.image = photo

def autoNext() :
    pass  # TODO: playing 이면 clickNext() 후 2초 뒤 다시 autoNext 예약

def clickAuto() :
    pass  # TODO: playing 을 바꾸고, 버튼 글자 바꾸고, 켰다면 autoNext 예약

window = Tk()
window.geometry("700x500")
window.title("슬라이드 쇼")

btnNext = Button(window, text = "다음 >>", command = clickNext)
btnAuto = Button(window, text = "▶ 자동", command = clickAuto)
photo = PhotoImage(file = "GIF/" + fnameList[0])
pLabel = Label(window, image = photo)

btnNext.place(x = 400, y = 10)
btnAuto.place(x = 250, y = 10)
pLabel.place(x = 15, y = 50)

window.mainloop()
`,
            solution: `from tkinter import *

fnameList = ["jeju1.gif", "jeju2.gif", "jeju3.gif", "jeju4.gif", "jeju5.gif",
             "jeju6.gif", "jeju7.gif", "jeju8.gif", "jeju9.gif"]
num = 0
playing = False

def clickNext() :
    global num
    num = (num + 1) % 9
    photo = PhotoImage(file = "GIF/" + fnameList[num])
    pLabel.configure(image = photo)
    pLabel.image = photo

def autoNext() :
    if playing :
        clickNext()
        window.after(2000, autoNext)

def clickAuto() :
    global playing
    playing = not playing
    if playing :
        btnAuto.configure(text = "■ 멈춤")
        window.after(2000, autoNext)
    else :
        btnAuto.configure(text = "▶ 자동")

window = Tk()
window.geometry("700x500")
window.title("슬라이드 쇼")

btnNext = Button(window, text = "다음 >>", command = clickNext)
btnAuto = Button(window, text = "▶ 자동", command = clickAuto)
photo = PhotoImage(file = "GIF/" + fnameList[0])
pLabel = Label(window, image = photo)

btnNext.place(x = 400, y = 10)
btnAuto.place(x = 250, y = 10)
pLabel.place(x = 15, y = 50)

window.mainloop()
`
          }
        ],
        quiz: [
          { q: '<code>place()</code> 의 좌표에 대한 설명으로 옳은 것은?', options: ['창의 가운데가 (0, 0) 이다', '창의 왼쪽 위가 (0, 0) 이고 y 는 아래로 갈수록 커진다', '창의 왼쪽 아래가 (0, 0) 이고 y 는 위로 갈수록 커진다', '단위는 글자 수이다'], answer: 1,
            explain: '화면 좌표는 왼쪽 위가 원점이고, x 는 오른쪽, y 는 아래로 커집니다. 단위는 픽셀.' },
          { q: 'Code10-11 에서 안쪽 for 문이 한 바퀴 끝날 때마다 <code>xPos = 0</code>, <code>yPos += 70</code> 을 하는 이유는?', options: ['그림을 확대하려고', '다음 줄의 맨 왼쪽으로 이동하려고', '버튼 개수를 세려고', '창 크기를 바꾸려고'], answer: 1,
            explain: '한 줄(3칸)을 다 놓으면 x 를 처음(0)으로 되돌리고 y 를 한 칸(70) 내려 다음 줄을 시작합니다.' },
          { q: '다음 코드 실행 후 <code>a</code> 의 값은?<pre><code>import random\na = [1, 2, 3]\na = random.shuffle(a)</code></pre>', options: ['[1, 2, 3]', '섞인 리스트', 'None', '오류'], answer: 2,
            explain: 'shuffle() 은 리스트 자체를 섞고 <code>None</code> 을 돌려줍니다. 결과를 다시 a 에 넣으면 a 는 None 이 됩니다.' },
          { q: '[프로그램 1] 에서 num 이 8 일 때 [다음] 을 누르면 num 은?', options: ['9', '8', '0', '오류가 난다'], answer: 2,
            explain: 'num 이 9 가 되어 8 보다 크므로 0 으로 돌아갑니다. 마지막 사진 다음은 첫 사진.' },
          { q: 'clickNext() 함수 안에 <code>global num</code> 이 필요한 이유는?', options: ['num 을 출력하려고', '함수 밖(전역)의 num 값을 바꾸려고', 'num 을 새로 만들려고', '그림을 읽으려고'], answer: 1,
            explain: '함수 안에서 전역 변수에 값을 대입(<code>num += 1</code>)하려면 global 선언이 필요합니다. 없으면 UnboundLocalError.' }
        ],
        slides: [
          { layout: 'title', title: 'place() 와 [프로그램 1] 사진 앨범', subtitle: 'Chapter 10 · Section 03 위젯의 배치와 크기 조절 (2)', badge: '4교시',
            notes: '<p>오늘은 이 장의 첫 번째 완성 프로그램을 만듭니다. 지난 시간의 pack 과 비교하며 place 를 소개합니다.</p><p>시간: 1분</p>' },
          { layout: 'diagram', title: 'place(x, y) — 좌표로 배치', html: FIG_PLACE, caption: '왼쪽 위 (0,0), x 오른쪽 · y 아래로 증가',
            notes: '<p>강의자료 22쪽. 수학의 좌표평면과 달리 y 가 아래로 커진다는 점을 강조합니다(모니터는 위에서부터 그림).</p><p>시간: 3분</p>' },
          { layout: 'code', title: 'Code10-11 그림 9개 배치 (1)', code: `from tkinter import *
btnList = [None] * 9
fnameList = ["froyo.gif", "gingerbread.gif", "honeycomb.gif", "icecream.gif",
             "jellybean.gif", "kitkat.gif", "lollipop.gif", "marshmallow.gif", "nougat.gif"]
photoList = [None] * 9
xPos, yPos = 0, 0
num = 0

window = Tk()
window.geometry("210x210")

for i in range(0, 9) :
    photoList[i] = PhotoImage(file = "GIF/" + fnameList[i])
    btnList[i] = Button(window, image = photoList[i])

for i in range(0, 3) :
    for k in range(0, 3) :
        btnList[num].place(x = xPos, y = yPos)
        num += 1
        xPos += 70
    xPos = 0
    yPos += 70

window.mainloop()`,
            points: ['리스트 3개: 버튼 · 파일 이름 · 그림', '바깥 for = 행, 안쪽 for = 열', '한 줄 끝: <code>xPos = 0</code>, <code>yPos += 70</code>'],
            notes: '<p>강의자료 22~23쪽(슬라이드에 맞게 전역 변수 i, k 초기화 줄만 생략). 칠판에 num · xPos · yPos 값을 표로 추적해 보게 합니다: (0,0,0) (1,70,0) (2,140,0) (3,0,70) …</p><p>교재의 안드로이드 그림 대신 과자 아이콘을 쓴다는 점을 안내합니다.</p><p>시간: 8분</p>' },
          { layout: 'bullets', title: '📘 그림을 리스트에 모아 두는 이유',
            bullets: ['변수에서 사라진 객체는 파이썬이 자동으로 지움 (가비지 컬렉션)', 'tkinter 위젯은 그림을 붙잡아 두지 않음', '→ 그림이 지워지면 버튼 · 레이블이 빈칸 (내 PC)', '해결: <code>photoList</code> 에 보관, <code>pLabel.image = photo</code>'],
            notes: '<p>강의자료에 없는 보충이지만, 집에서 IDLE 로 실습할 때 가장 많이 겪는 문제입니다. 브라우저 환경에서는 잘 보이더라도 이 습관을 꼭 들이게 합니다.</p><p>시간: 2분</p>' },
          { layout: 'practice', title: 'SELF STUDY 10-2. 그림 섞기', desc: 'Code10-11 을 실행할 때마다 그림이 임의로 섞여 나타나게 하세요. (힌트: <code>random.shuffle(리스트)</code>)',
            starter: `from tkinter import *
fnameList = ["froyo.gif", "gingerbread.gif", "honeycomb.gif", "icecream.gif",
             "jellybean.gif", "kitkat.gif", "lollipop.gif", "marshmallow.gif", "nougat.gif"]
photoList = [None] * 9
window = Tk()
window.geometry("210x210")
# TODO: 섞기
for num in range(9) :
    photoList[num] = PhotoImage(file = "GIF/" + fnameList[num])
    Button(window, image = photoList[num]).place(x = num % 3 * 70, y = num // 3 * 70)
window.mainloop()
`,
            solution: `from tkinter import *
import random
fnameList = ["froyo.gif", "gingerbread.gif", "honeycomb.gif", "icecream.gif",
             "jellybean.gif", "kitkat.gif", "lollipop.gif", "marshmallow.gif", "nougat.gif"]
photoList = [None] * 9
window = Tk()
window.geometry("210x210")
random.shuffle(fnameList)
for num in range(9) :
    photoList[num] = PhotoImage(file = "GIF/" + fnameList[num])
    Button(window, image = photoList[num]).place(x = num % 3 * 70, y = num // 3 * 70)
window.mainloop()
`,
            notes: '<p>강의자료 24쪽. 슬라이드의 뼈대는 몫 · 나머지로 줄인 버전입니다. 여러 번 실행해 매번 달라지는지 확인합니다.</p><p>흔한 실수: <code>fnameList = random.shuffle(fnameList)</code> → None 이 되어 TypeError.</p><p>시간: 5분</p>' },
          { layout: 'diagram', title: '[프로그램 1] 의 아이디어', html: FIG_ALBUM, caption: 'num 이 0~8 을 원형으로 순환',
            notes: '<p>강의자료 25쪽 코드를 보기 전에 아이디어를 먼저 설명합니다. <b>발문</b>: "마지막 사진에서 [다음] 을 누르면 어떻게 되면 좋을까요?"</p><p>시간: 3분</p>' },
          { layout: 'code', title: 'Code10-12 사진 앨범 (1) 함수 부분', code: `fnameList = ["jeju1.gif", "jeju2.gif", "jeju3.gif", "jeju4.gif", "jeju5.gif",
             "jeju6.gif", "jeju7.gif", "jeju8.gif", "jeju9.gif"]
num = 0

def clickNext() :
    global num
    num += 1
    if num > 8 :
        num = 0
    photo = PhotoImage(file = "GIF/" + fnameList[num])
    pLabel.configure(image = photo)
    pLabel.image = photo

def clickPrev() :
    global num
    num -= 1
    if num < 0 :
        num = 8
    # 이하 clickNext 와 같음`, run: false,
            points: ['<code>global num</code>: 전역 변수 바꾸기', '8 을 넘으면 0, 0 보다 작으면 8', '<code>configure(image = photo)</code> 로 그림 교체', '<code>pLabel.image = photo</code>: 그림 붙잡아 두기'],
            notes: '<p>강의자료 25~26쪽. 이 슬라이드는 설명용 조각이라 실행 버튼이 없습니다. 다음 장에서 전체 코드를 실행합니다.</p><p>시간: 5분</p>' },
          { layout: 'code', title: 'Code10-12 사진 앨범 (2) 메인 코드', code: `## 메인 코드 부분 ##
window = Tk()
window.geometry("700x500")
window.title("사진 앨범 보기")

btnPrev = Button(window, text = "<< 이전", command = clickPrev)
btnNext = Button(window, text = "다음 >>", command = clickNext)

photo = PhotoImage(file = "GIF/" + fnameList[0])
pLabel = Label(window, image = photo)

btnPrev.place(x = 250, y = 10)
btnNext.place(x = 400, y = 10)
pLabel.place(x = 15, y = 50)

window.mainloop()`,
            run: false,
            points: ['버튼 2개 + 그림 레이블 1개', '<code>place()</code> 로 좌표 지정', '첫 사진: <code>fnameList[0]</code>', '전체 실행은 다음 장'],
            notes: '<p>강의자료 26~27쪽. 창 700×500, 사진 레이블은 (15, 50) — 사진(600×400)이 버튼 아래에 오도록.</p><p>시간: 3분</p>' },
          { layout: 'code', title: 'Code10-12 전체 실행 (줄인 버전)', code: `from tkinter import *
fnameList = ["jeju1.gif", "jeju2.gif", "jeju3.gif", "jeju4.gif", "jeju5.gif",
             "jeju6.gif", "jeju7.gif", "jeju8.gif", "jeju9.gif"]
num = 0
def clickNext() :
    global num
    num += 1
    if num > 8 : num = 0
    photo = PhotoImage(file = "GIF/" + fnameList[num])
    pLabel.configure(image = photo); pLabel.image = photo

def clickPrev() :
    global num
    num -= 1
    if num < 0 : num = 8
    photo = PhotoImage(file = "GIF/" + fnameList[num])
    pLabel.configure(image = photo); pLabel.image = photo

window = Tk(); window.geometry("700x500"); window.title("사진 앨범 보기")
Button(window, text = "<< 이전", command = clickPrev).place(x = 250, y = 10)
Button(window, text = "다음 >>", command = clickNext).place(x = 400, y = 10)
photo = PhotoImage(file = "GIF/" + fnameList[0])
pLabel = Label(window, image = photo); pLabel.place(x = 15, y = 50)
window.mainloop()`,
            points: ['[다음] · [이전] 을 번갈아 눌러 보기', '마지막 ↔ 처음 순환 확인', '원본 코드는 본문 Code10-12'],
            notes: '<p>슬라이드 한 장에 들어가도록 세미콜론으로 줄을 합친 버전입니다. 학생들에게는 본문의 원본 코드(43행)를 실행하게 합니다.</p><p>시간: 3분</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: 'clickNext() 에서 <code>global num</code> 을 지우면?', options: ['정상 동작', 'UnboundLocalError (콘솔에 출력, 창은 유지)', '창이 바로 닫힘', '첫 사진만 계속 보임 (오류 없음)'], answer: 1,
            explain: '함수 안에서 대입하는 변수는 지역 변수로 취급되어 UnboundLocalError. tkinter 는 콜백 오류를 출력하고 계속 동작합니다.',
            notes: '<p>직접 지우고 실행해 콘솔의 "Exception in Tkinter callback" 을 보여 줍니다.</p><p>시간: 2분</p>' },
          { layout: 'practice', title: 'SELF STUDY 10-3. 버튼 사이에 파일명 표시', desc: '[이전] · [다음] 버튼 사이에 현재 사진의 파일명(jeju3.gif 등)을 표시하고, 사진을 넘길 때마다 바뀌게 하세요.',
            starter: C10_12.replace('from time import *\n', '').replace('photoList = [None] * 9\n', '').replace('window.mainloop()', '# TODO: 파일명 레이블 추가\nwindow.mainloop()'),
            solution: `from tkinter import *
fnameList = ["jeju1.gif", "jeju2.gif", "jeju3.gif", "jeju4.gif", "jeju5.gif",
             "jeju6.gif", "jeju7.gif", "jeju8.gif", "jeju9.gif"]
num = 0

def showPhoto() :
    photo = PhotoImage(file = "GIF/" + fnameList[num])
    pLabel.configure(image = photo)
    pLabel.image = photo
    fLabel.configure(text = fnameList[num])

def clickNext() :
    global num
    num = (num + 1) % 9
    showPhoto()

def clickPrev() :
    global num
    num = (num - 1) % 9
    showPhoto()

window = Tk()
window.geometry("700x500")
Button(window, text = "<< 이전", command = clickPrev).place(x = 250, y = 10)
Button(window, text = "다음 >>", command = clickNext).place(x = 420, y = 10)
fLabel = Label(window, text = fnameList[0])
fLabel.place(x = 330, y = 12)
photo = PhotoImage(file = "GIF/" + fnameList[0])
pLabel = Label(window, image = photo)
pLabel.place(x = 15, y = 50)
window.mainloop()
`,
            notes: '<p>강의자료 28쪽. 정답은 중복 코드를 showPhoto() 로 묶고 % 로 순환을 줄인 버전입니다. 학생들의 답이 교재 구조를 따라도 정답으로 인정합니다.</p><p>시간: 7분</p>' },
          { layout: 'summary', title: '정리', bullets: ['<code>place(x=, y=)</code>: 왼쪽 위 (0,0) 기준 픽셀 좌표', '중첩 for 문 또는 <code>//</code> · <code>%</code> 로 격자 배치', '<code>random.shuffle(리스트)</code>: 리스트 자체를 섞음 (None 반환)', '[프로그램 1]: 전역 변수 num + <code>configure(image=)</code>', '그림 객체는 리스트 · <code>위젯.image</code> 로 붙잡아 두기'],
            notes: '<p>다음 시간: 버튼이 아닌 곳을 클릭하거나 키보드를 눌렀을 때 처리하기(이벤트).</p><p>시간: 2분</p>' }
        ]
      },

      /* ───────────────────────── 5교시: 마우스와 키보드 이벤트 ───────────────────────── */
      {
        id: 'ch10-5',
        title: '마우스와 키보드 이벤트',
        minutes: 50,
        goals: [
          '마우스 이벤트 코드(<Button-1>, <Button-3>, <Double-Button-1>, <B1-Motion> 등)를 구별할 수 있다',
          '위젯.bind("이벤트", 함수) 형식으로 이벤트 처리 함수를 연결할 수 있다',
          'event 매개변수의 num · x · y 로 어떤 버튼을 어디에서 눌렀는지 알아낼 수 있다',
          '키보드 이벤트(<Key>, <Return>, 일반 키, <Shift-Up> 등)를 처리하고 keycode · keysym · char 를 활용할 수 있다'
        ],
        flow: [['복습 · 도입', 3], ['마우스 이벤트 표 · bind 형식', 7], ['창 · 위젯 클릭 처리', 10], ['event.num · x · y', 10], ['키보드 이벤트', 12], ['SELF STUDY 10-4 · 정리', 8]],
        content: [
          { type: 'h', text: '이벤트란?' },
          { type: 'p', html: '버튼의 <code>command</code> 는 "버튼을 클릭했을 때" 한 가지 상황만 처리합니다. 하지만 그림을 클릭하거나, 마우스 오른쪽 버튼을 누르거나, 키보드를 누르는 것처럼 더 다양한 상황을 처리하고 싶을 때가 있습니다. 이렇게 프로그램 밖에서 일어나는 일(클릭, 키 입력, 마우스 이동 …)을 <b>이벤트(event)</b>라고 하고, 이벤트가 일어났을 때 실행할 함수를 <b>이벤트 처리 함수(event handler)</b>라고 합니다.' },

          { type: 'h', text: '마우스 이벤트 기본 처리' },
          { type: 'table', head: ['마우스 작동', '마우스 버튼', '이벤트 코드'], rows: [
            ['클릭할 때', '모든 버튼 공통 / 왼쪽 / 가운데 / 오른쪽', '<code>&lt;Button&gt;</code> / <code>&lt;Button-1&gt;</code> / <code>&lt;Button-2&gt;</code> / <code>&lt;Button-3&gt;</code>'],
            ['뗐을 때', '모든 버튼 공통 / 왼쪽 / 가운데 / 오른쪽', '<code>&lt;ButtonRelease&gt;</code> / <code>&lt;ButtonRelease-1&gt;</code> / <code>-2</code> / <code>-3</code>'],
            ['더블클릭할 때', '모든 버튼 공통 / 왼쪽 / 가운데 / 오른쪽', '<code>&lt;Double-Button&gt;</code> / <code>&lt;Double-Button-1&gt;</code> / <code>-2</code> / <code>-3</code>'],
            ['드래그할 때', '왼쪽 / 가운데 / 오른쪽', '<code>&lt;B1-Motion&gt;</code> / <code>&lt;B2-Motion&gt;</code> / <code>&lt;B3-Motion&gt;</code>'],
            ['마우스 커서가 위젯 위로 올라왔을 때', '', '<code>&lt;Enter&gt;</code>'],
            ['마우스 커서가 위젯에서 떠났을 때', '', '<code>&lt;Leave&gt;</code>']
          ], caption: '표 10-1 마우스 이벤트 (1 = 왼쪽, 2 = 가운데(휠), 3 = 오른쪽 버튼)' },
          { type: 'p', html: '이벤트 처리 함수는 반드시 <b>매개변수 하나(<code>event</code>)</b>를 받도록 만들고, <code>bind()</code> 로 위젯과 이벤트 코드에 연결합니다.' },
          { type: 'code', title: '마우스 이벤트 처리 형식', run: false, code: `def 이벤트처리함수(event) :
    # 이 부분에 마우스 이벤트가 발생할 때 작동할 내용 작성

위젯.bind("마우스이벤트", 이벤트처리함수)` },
          { type: 'code', title: 'Code10-13. 마우스 왼쪽 버튼을 클릭했을 때 처리하는 방법', code: `from tkinter import *
from tkinter import messagebox

## 함수 선언 부분 ##
def clickLeft(event) :
    messagebox.showinfo("마우스", "마우스 왼쪽 버튼이 클릭됨")

## 메인 코드 부분 ##
window = Tk()

window.bind("<Button-1>", clickLeft)

window.mainloop()`, desc: '<code>5행</code> 이벤트 처리 함수는 <code>event</code> 매개변수를 받습니다(쓰지 않더라도 꼭 있어야 합니다). <code>11행</code> 창(window)에서 마우스 왼쪽 버튼(<code>&lt;Button-1&gt;</code>)이 클릭되면 clickLeft 를 부르도록 연결합니다. 창 아무 곳이나 왼쪽 클릭해 보세요. 오른쪽 클릭에는 반응하지 않습니다.' },
          { type: 'callout', kind: 'warn', title: 'command 함수와 이벤트 처리 함수의 차이', html: '<ul><li><b>command</b> 에 연결한 함수는 매개변수 <b>없이</b> 불립니다: <code>def myFunc() :</code></li><li><b>bind</b> 로 연결한 함수는 <b>event 객체를 넘겨받으며</b> 불립니다: <code>def clickLeft(event) :</code></li></ul><p>bind 함수에 매개변수를 빼먹으면 클릭할 때 <code>TypeError: clickLeft() takes 0 positional arguments but 1 was given</code> 오류가 콘솔에 출력됩니다.</p>' },

          { type: 'h', text: '지정된 위젯을 클릭했을 때 다른 함수 호출' },
          { type: 'p', html: 'bind 는 창뿐 아니라 <b>모든 위젯</b>에 쓸 수 있습니다. 레이블에 bind 하면 그 레이블을 클릭했을 때만 함수가 실행됩니다.' },
          { type: 'code', title: 'Code10-14. 지정된 위젯을 클릭했을 때 다른 함수 호출', code: `from tkinter import *
from tkinter import messagebox

## 함수 선언 부분 ##
def clickImage(event) :
    messagebox.showinfo("마우스", "토끼에서 마우스가 클릭됨")

## 메인 코드 부분 ##
window = Tk()
window.geometry("400x400")

photo = PhotoImage(file = "GIF/rabbit.gif")
label1 = Label(window, image = photo)

label1.bind("<Button>", clickImage)

label1.pack(expand = 1, anchor = CENTER)
window.mainloop()`, desc: '<code>15행</code> 토끼 그림 레이블에 <code>&lt;Button&gt;</code>(왼쪽 · 가운데 · 오른쪽 모든 버튼)을 연결했습니다. 토끼 바깥의 빈 곳을 클릭하면 아무 일도 일어나지 않습니다. <code>17행</code> <code>expand=1</code> 로 남는 공간을 모두 차지하고 <code>anchor=CENTER</code> 로 그 가운데에 놓아, 그림이 창 한가운데에 나타납니다.' },

          { type: 'h', text: 'event 매개변수를 활용한 마우스 이벤트 처리' },
          { type: 'p', html: '이벤트 처리 함수가 받는 <code>event</code> 객체에는 이벤트에 대한 정보가 들어 있습니다. <code>event.num</code> 은 누른 마우스 버튼 번호(1 왼쪽, 2 가운데, 3 오른쪽), <code>event.x</code> · <code>event.y</code> 는 클릭한 위치의 좌표(위젯의 왼쪽 위 기준)입니다.' },
          { type: 'figure', html: FIG_EVENT, caption: '이벤트가 일어나면 tkinter 가 정보를 담은 event 객체를 만들어 처리 함수에 넘겨준다' },
          { type: 'code', title: 'Code10-15. 클릭한 마우스 버튼과 좌표 출력', code: `from tkinter import *

## 함수 선언 부분 ##
def clickMouse(event) :
    txt = ""
    if event.num == 1 :
        txt += "마우스 왼쪽 버튼이 ("
    elif event.num == 3 :
        txt += "마우스 오른쪽 버튼이 ("

    txt += str(event.y) + "," + str(event.x) + ")에서 클릭됨"
    label1.configure(text = txt)

## 메인 코드 부분 ##
window = Tk()
window.geometry("400x400")

label1 = Label(window, text = "이곳이 바뀜")

window.bind("<Button>", clickMouse)

label1.pack(expand = 1, anchor = CENTER)
window.mainloop()`, desc: '<code>6~9행</code> 누른 버튼 번호에 따라 글자를 만듭니다. <code>11행</code> 좌표를 붙여 레이블에 표시합니다. 교재 코드는 <code>(y, x)</code> 순서로 출력하므로, 위쪽을 클릭하면 앞의 숫자가 작아집니다. <code>(x, y)</code> 순서로 바꿔 보세요. <code>20행</code> 창 전체에 <code>&lt;Button&gt;</code> 을 연결했습니다.' },
          { type: 'callout', kind: 'info', title: '브라우저에서 오른쪽 클릭 · 가운데 클릭', html: '이 강좌의 창 위에서 오른쪽 클릭하면 브라우저 메뉴 대신 tkinter 이벤트(<code>event.num == 3</code>)가 전달됩니다. 노트북 터치패드는 두 손가락 클릭이 오른쪽 클릭입니다. 가운데 버튼(휠 클릭, <code>num == 2</code>)은 Code10-15 에서 처리하지 않으므로 좌표만 표시됩니다.' },
          { type: 'code', title: '추가 예제. 마우스를 따라다니는 좌표 · 더블클릭 · 드래그', code: `from tkinter import *

def moveMouse(event) :
    label1.configure(text = "마우스 위치 : (" + str(event.x) + ", " + str(event.y) + ")")

def doubleClick(event) :
    label2.configure(text = "더블클릭!", fg = "red")

def dragMouse(event) :
    label2.configure(text = "왼쪽 버튼으로 드래그 중 …", fg = "blue")

def enterLabel(event) :
    label3.configure(bg = "yellow")

def leaveLabel(event) :
    label3.configure(bg = "lightgray")

window = Tk()
window.geometry("400x250")
window.title("여러 가지 마우스 이벤트")

label1 = Label(window, text = "마우스를 움직여 보세요", font = ("맑은 고딕", 14))
label2 = Label(window, text = "더블클릭 또는 드래그해 보세요")
label3 = Label(window, text = "여기에 마우스를 올려 보세요", bg = "lightgray", width = 30, height = 3)
label1.pack(pady = 10)
label2.pack(pady = 10)
label3.pack(pady = 10)

window.bind("<Motion>", moveMouse)
window.bind("<Double-Button-1>", doubleClick)
window.bind("<B1-Motion>", dragMouse)
label3.bind("<Enter>", enterLabel)
label3.bind("<Leave>", leaveLabel)

window.mainloop()`, desc: '표 10-1 의 이벤트를 한꺼번에 시험해 봅니다. <code>&lt;Motion&gt;</code> 은 버튼을 누르지 않고 움직이기만 해도 계속 발생합니다. <code>&lt;Enter&gt;</code> · <code>&lt;Leave&gt;</code> 는 마우스를 올리면 색이 바뀌는 효과(hover)를 만들 때 씁니다. 이처럼 한 위젯에 여러 이벤트를 bind 할 수 있습니다.' },

          { type: 'h', text: '키보드 이벤트 기본 처리' },
          { type: 'p', html: '키보드 이벤트는 위젯에서 키보드가 눌리면 발생합니다. 모든 키에 반응하려면 <code>&lt;Key&gt;</code> 이벤트를 씁니다. <code>event.keycode</code> 에는 누른 키의 <b>번호</b>가 들어 있습니다.' },
          { type: 'code', title: 'Code10-16. 키보드 이벤트 기본 처리', code: `from tkinter import *
from tkinter import messagebox

## 함수 선언 부분 ##
def keyEvent(event) :
    messagebox.showinfo("키보드 이벤트", "눌린 키 : " + chr(event.keycode))

## 메인 코드 부분 ##
window = Tk()

window.bind("<Key>", keyEvent)

window.mainloop()`, desc: '<code>11행</code> 창에서 아무 키나 누르면 keyEvent 가 실행됩니다. <code>6행</code> 윈도에서 문자 키의 keycode 는 그 글자의 <b>대문자 코드</b>와 같아서(A=65 … Z=90, 0=48 … 9=57), <code>chr()</code> 로 바꾸면 <code>K</code> 처럼 대문자가 나옵니다. 소문자 k 를 눌러도 <code>K</code> 로 표시됩니다.' },
          { type: 'callout', kind: 'tip', title: '키보드 이벤트가 안 받아져요!', html: '키 입력은 <b>포커스(focus)</b>를 가진 창에만 전달됩니다. 실행 후 창을 <b>한 번 클릭</b>해서 선택한 다음 키를 누르세요. 편집기에 커서가 있으면 키 입력이 편집기로 들어갑니다.' },
          { type: 'table', head: ['키보드 작동', '이벤트 코드'], rows: [
            ['모든 키를 누를 때', '<code>&lt;Key&gt;</code>'],
            ['특수 키를 누를 때', '<code>&lt;Return&gt;</code>, <code>&lt;BackSpace&gt;</code>, <code>&lt;Tab&gt;</code>, <code>&lt;Shift_L&gt;</code>, <code>&lt;Control_L&gt;</code>, <code>&lt;Alt_L&gt;</code>, <code>&lt;Pause&gt;</code>, <code>&lt;Caps_Lock&gt;</code>, <code>&lt;Escape&gt;</code>, <code>&lt;End&gt;</code>, <code>&lt;Home&gt;</code>, <code>&lt;Left&gt;</code>, <code>&lt;Right&gt;</code>, <code>&lt;Up&gt;</code>, <code>&lt;Down&gt;</code>, <code>&lt;Num_Lock&gt;</code>, <code>&lt;Delete&gt;</code>, <code>&lt;F1&gt;</code>~<code>&lt;F12&gt;</code> 등'],
            ['일반 키를 누를 때', '<code>a</code>~<code>z</code>, <code>A</code>~<code>Z</code>, <code>0</code>~<code>9</code>, <code>&lt;space&gt;</code>, <code>&lt;less&gt;</code>'],
            ['화살표 키와 조합', '<code>&lt;Shift-Up&gt;</code>, <code>&lt;Shift-Down&gt;</code>, <code>&lt;Shift-Left&gt;</code>, <code>&lt;Shift-Right&gt;</code> 등']
          ], caption: '표 10-2 키보드 이벤트' },
          { type: 'list', items: [
            '<b>Enter</b> 키만 처리하려면 Code10-16 의 11행에서 <code>&lt;Key&gt;</code> 대신 <code>&lt;Return&gt;</code> 을 씁니다.',
            '일반 키는 <b>대 · 소문자를 구분</b>합니다. 소문자 <code>r</code> 만 처리하려면 <code>"&lt;Key&gt;"</code> 대신 <code>"r"</code> 을 씁니다(꺾쇠 없이).',
            '일반 키 중 <b>스페이스바</b>는 <code>&lt;space&gt;</code>, <b>&lt;</b> 기호는 <code>&lt;less&gt;</code> 로 씁니다. (<code>&lt;</code> 는 이벤트 코드의 시작 기호와 겹치기 때문)'
          ] },
          { type: 'code', title: 'Code10-16 변형 ①. Enter 키 처리', code: `from tkinter import *
from tkinter import messagebox

## 함수 선언 부분 ##
def keyEvent(event) :
    messagebox.showinfo("키보드 이벤트", "눌린 키 : Enter")

## 메인 코드 부분 ##
window = Tk()

window.bind("<Return>", keyEvent)

window.mainloop()`, desc: 'Enter 키의 keycode 는 13 이라 <code>chr(13)</code> 은 보이지 않는 글자입니다. 그래서 메시지를 직접 "Enter" 로 적었습니다.' },
          { type: 'code', title: 'Code10-16 변형 ②. 소문자 r 키만 처리', code: `from tkinter import *
from tkinter import messagebox

## 함수 선언 부분 ##
def keyEvent(event) :
    messagebox.showinfo("키보드 이벤트", "눌린 키 : " + chr(event.keycode))

## 메인 코드 부분 ##
window = Tk()

window.bind("r", keyEvent)

window.mainloop()`, desc: '소문자 r 을 누를 때만 반응합니다. Caps Lock 을 켜거나 Shift 와 함께 눌러 대문자 R 을 입력하면 반응하지 않습니다.' },
          { type: 'callout', kind: 'more', title: 'keycode · keysym · char — 무엇을 써야 할까?', html: '<p><code>event.keycode</code> 는 키보드의 <b>키 번호</b>라서 운영체제마다 값이 다를 수 있고, 대소문자를 구별하지 못합니다. 실제로는 다음 두 속성이 더 편리합니다.</p><ul><li><code>event.char</code> : 입력된 <b>글자</b> 그대로 (<code>"a"</code>, <code>"A"</code>, <code>"!"</code>, 특수 키는 <code>""</code>)</li><li><code>event.keysym</code> : 키의 <b>이름</b> (<code>"a"</code>, <code>"Return"</code>, <code>"Up"</code>, <code>"space"</code>, <code>"Shift_L"</code>)</li></ul><p>이벤트 코드 <code>&lt;Up&gt;</code> 의 Up, <code>&lt;Return&gt;</code> 의 Return 이 바로 keysym 입니다. 아래 추가 예제로 세 값을 비교해 보세요.</p>' },
          { type: 'code', title: '추가 예제. keycode · keysym · char 비교하기', code: `from tkinter import *

def keyEvent(event) :
    txt = "keycode : " + str(event.keycode) + "\\n"
    txt += "keysym : " + event.keysym + "\\n"
    txt += "char : " + repr(event.char)
    label1.configure(text = txt)

window = Tk()
window.geometry("300x150")
window.title("키를 눌러 보세요")

label1 = Label(window, text = "창을 클릭한 뒤\\n아무 키나 눌러 보세요", font = ("Consolas", 14), justify = LEFT)
label1.pack(expand = 1)

window.bind("<Key>", keyEvent)

window.mainloop()`, desc: 'a, A, Enter, 스페이스바, 방향키, Shift 를 차례로 눌러 보세요. <code>repr()</code> 은 빈 문자열이나 특수 문자도 따옴표와 함께 보여 주어 차이를 확인하기 좋습니다. <code>justify=LEFT</code> 는 여러 줄 글자를 왼쪽 정렬합니다.' },
          { type: 'code', title: '추가 예제. 방향키로 그림 움직이기', code: `from tkinter import *

## 전역 변수 선언 부분 ##
x, y = 150, 100

## 함수 선언 부분 ##
def moveKey(event) :
    global x, y
    if event.keysym == "Left" :
        x -= 10
    elif event.keysym == "Right" :
        x += 10
    elif event.keysym == "Up" :
        y -= 10
    elif event.keysym == "Down" :
        y += 10
    pLabel.place(x = x, y = y)

## 메인 코드 부분 ##
window = Tk()
window.geometry("500x400")
window.title("방향키로 움직이기 — 창을 클릭한 뒤 방향키")

photo = PhotoImage(file = "GIF/rabbit.gif")
pLabel = Label(window, image = photo)
pLabel.place(x = x, y = y)

window.bind("<Key>", moveKey)

window.mainloop()`, desc: 'keysym 으로 방향키를 구별하고, <code>place()</code> 를 다시 불러 그림의 위치를 옮깁니다. 이미 place 한 위젯도 place 를 다시 부르면 새 위치로 이동합니다. 간단한 게임의 기본 원리입니다.' }
        ],
        practice: [
          {
            title: 'SELF STUDY 10-4. Shift + 화살표 키 처리하기',
            level: 2,
            desc: '<p>Code10-16 을 수정해서 <kbd>Shift</kbd> + 화살표 키를 누르면 어떤 화살표 키가 눌렸는지 메시지 창에 <code>눌린 키 : Shift + 아래쪽 화살표</code> 처럼 출력하세요.</p>',
            hint: '<b>힌트1</b> 이벤트 코드는 표 10-2 를 참고합니다(<code>&lt;Shift-Up&gt;</code> …). <b>힌트2</b> <code>위젯.bind("이벤트", 함수)</code> 를 한 위젯에 여러 개 써도 됩니다. <b>힌트3</b> 화살표 키의 keycode 는 왼쪽 37, 위쪽 38, 오른쪽 39, 아래쪽 40 입니다.',
            starter: `from tkinter import *
from tkinter import messagebox

## 함수 선언 부분 ##
def keyEvent(event) :
    txt = ""
    # TODO: event.keycode 로 화살표 방향 판단 (37 왼쪽, 38 위쪽, 39 오른쪽, 40 아래쪽)
    messagebox.showinfo("키보드 이벤트", "눌린 키 : Shift + " + txt)

## 메인 코드 부분 ##
window = Tk()

# TODO: Shift + 화살표 이벤트 4개를 keyEvent 에 연결

window.mainloop()
`,
            solution: `from tkinter import *
from tkinter import messagebox

## 함수 선언 부분 ##
def keyEvent(event) :
    txt = ""
    if event.keycode == 37 :
        txt = "왼쪽 화살표"
    elif event.keycode == 38 :
        txt = "위쪽 화살표"
    elif event.keycode == 39 :
        txt = "오른쪽 화살표"
    elif event.keycode == 40 :
        txt = "아래쪽 화살표"
    messagebox.showinfo("키보드 이벤트", "눌린 키 : Shift + " + txt)

## 메인 코드 부분 ##
window = Tk()

window.bind("<Shift-Up>", keyEvent)
window.bind("<Shift-Down>", keyEvent)
window.bind("<Shift-Left>", keyEvent)
window.bind("<Shift-Right>", keyEvent)

window.mainloop()
`
          },
          {
            title: '실습 10-7. 클릭하는 곳으로 순간 이동',
            level: 2,
            desc: '<p>창(500×400)에 강아지 그림(<code>GIF/dog.gif</code>) 레이블을 놓고, 창의 빈 곳을 <b>마우스 왼쪽 버튼</b>으로 클릭하면 그 위치로 강아지가 이동하게 하세요. <b>오른쪽 버튼</b>을 클릭하면 강아지가 처음 위치 (0, 0) 으로 돌아갑니다.</p>',
            hint: '<code>window.bind("&lt;Button-1&gt;", 함수)</code> 에서 <code>pLabel.place(x = event.x, y = event.y)</code>. 단, 강아지 그림 위를 클릭하면 event.x · y 가 <b>그림 기준</b> 좌표가 되므로 <code>event.widget == window</code> 일 때만 이동하게 합니다.',
            starter: `from tkinter import *

def clickLeft(event) :
    pass  # TODO: 창의 빈 곳을 클릭했을 때만 그 위치로 이동

def clickRight(event) :
    pass  # TODO: (0, 0) 으로 돌아가기

window = Tk()
window.geometry("500x400")
window.title("클릭하는 곳으로!")

photo = PhotoImage(file = "GIF/dog.gif")
pLabel = Label(window, image = photo)
pLabel.place(x = 0, y = 0)

# TODO: 이벤트 연결

window.mainloop()
`,
            solution: `from tkinter import *

def clickLeft(event) :
    if event.widget == window :
        pLabel.place(x = event.x, y = event.y)

def clickRight(event) :
    pLabel.place(x = 0, y = 0)

window = Tk()
window.geometry("500x400")
window.title("클릭하는 곳으로!")

photo = PhotoImage(file = "GIF/dog.gif")
pLabel = Label(window, image = photo)
pLabel.place(x = 0, y = 0)

window.bind("<Button-1>", clickLeft)
window.bind("<Button-3>", clickRight)

window.mainloop()
`
          }
        ],
        quiz: [
          { q: '마우스 <b>오른쪽</b> 버튼을 클릭했을 때의 이벤트 코드는?', options: ['&lt;Button-1&gt;', '&lt;Button-2&gt;', '&lt;Button-3&gt;', '&lt;Right&gt;'], answer: 2,
            explain: '1 왼쪽, 2 가운데(휠), 3 오른쪽입니다. <code>&lt;Right&gt;</code> 는 오른쪽 <b>화살표 키</b>입니다.' },
          { q: 'bind 로 연결하는 이벤트 처리 함수의 올바른 형태는?', options: ['def clickLeft() :', 'def clickLeft(event) :', 'def clickLeft(window, event) :', 'def clickLeft(x, y) :'], answer: 1,
            explain: 'bind 로 연결한 함수는 event 객체 하나를 넘겨받습니다.' },
          { q: 'Code10-15 에서 마우스 왼쪽 버튼으로 (x=70, y=166) 을 클릭하면 레이블에 표시되는 글자는?', options: ['마우스 왼쪽 버튼이 (70,166)에서 클릭됨', '마우스 왼쪽 버튼이 (166,70)에서 클릭됨', '마우스 오른쪽 버튼이 (166,70)에서 클릭됨', '이곳이 바뀜'], answer: 1,
            explain: '코드가 <code>str(event.y) + "," + str(event.x)</code> 순서로 붙이므로 (166,70) 입니다.' },
          { q: '스페이스바를 누를 때만 처리하는 bind 코드는?', options: ['window.bind(" ", f)', 'window.bind("&lt;space&gt;", f)', 'window.bind("&lt;Key-Spacebar&gt;", f)', 'window.bind("space", f)'], answer: 1,
            explain: '스페이스바는 <code>&lt;space&gt;</code>, <code>&lt;</code> 기호는 <code>&lt;less&gt;</code> 로 씁니다.' },
          { q: '다음 중 소문자 a 와 대문자 A 를 <b>구별할 수 있는</b> event 속성은?', options: ['event.keycode', 'event.num', 'event.char', 'event.x'], answer: 2,
            explain: 'char 는 입력된 글자 그대로("a", "A")입니다. keycode 는 키 번호라 둘 다 65 입니다.' }
        ],
        slides: [
          { layout: 'title', title: '마우스와 키보드 이벤트', subtitle: 'Chapter 10 · Section 04 키보드와 마우스 이벤트 처리', badge: '5교시',
            notes: '<p>command 는 버튼 클릭만 처리합니다. 오늘은 어떤 위젯이든, 어떤 마우스 · 키보드 동작이든 처리하는 bind 를 배웁니다.</p><p>시간: 1분</p>' },
          { layout: 'table', title: '표 10-1 마우스 이벤트', head: ['작동', '공통 / 왼쪽 / 가운데 / 오른쪽'], rows: [
            ['클릭', '&lt;Button&gt; / &lt;Button-1&gt; / -2 / -3'], ['뗌', '&lt;ButtonRelease&gt; / -1 / -2 / -3'], ['더블클릭', '&lt;Double-Button&gt; / -1 / -2 / -3'], ['드래그', '&lt;B1-Motion&gt; / &lt;B2-Motion&gt; / &lt;B3-Motion&gt;'], ['올라옴 / 떠남', '&lt;Enter&gt; / &lt;Leave&gt;']],
            notes: '<p>강의자료 29쪽. 숫자 1 · 2 · 3 = 왼쪽 · 가운데 · 오른쪽만 기억하면 나머지는 규칙적입니다.</p><p>시간: 3분</p>' },
          { layout: 'code', title: 'Code10-13 왼쪽 클릭 처리', code: `from tkinter import *
from tkinter import messagebox

## 함수 선언 부분 ##
def clickLeft(event) :
    messagebox.showinfo("마우스", "마우스 왼쪽 버튼이 클릭됨")

## 메인 코드 부분 ##
window = Tk()

window.bind("<Button-1>", clickLeft)

window.mainloop()`,
            points: ['형식: <code>위젯.bind("이벤트", 함수)</code>', '처리 함수는 <code>event</code> 매개변수 필수', '오른쪽 클릭 → 반응 없음'],
            notes: '<p>강의자료 30~31쪽. <code>&lt;Button-1&gt;</code> 을 <code>&lt;Button-3&gt;</code>, <code>&lt;Double-Button-1&gt;</code> 로 바꿔 가며 실행합니다.</p><p>event 매개변수를 지워서 TypeError 가 콘솔에 나오는 것을 보여 줍니다.</p><p>시간: 5분</p>' },
          { layout: 'code', title: 'Code10-14 위젯(그림)을 클릭했을 때', code: `from tkinter import *
from tkinter import messagebox

def clickImage(event) :
    messagebox.showinfo("마우스", "토끼에서 마우스가 클릭됨")

window = Tk()
window.geometry("400x400")

photo = PhotoImage(file = "GIF/rabbit.gif")
label1 = Label(window, image = photo)

label1.bind("<Button>", clickImage)

label1.pack(expand = 1, anchor = CENTER)
window.mainloop()`,
            points: ['bind 는 모든 위젯에 가능', '토끼 레이블에만 연결 → 빈 곳 클릭은 무시', '<code>expand=1, anchor=CENTER</code>: 창 가운데'],
            notes: '<p>강의자료 32~33쪽. 그림 안과 밖을 번갈아 클릭해 차이를 확인합니다.</p><p>시간: 4분</p>' },
          { layout: 'diagram', title: 'event 객체', html: FIG_EVENT, caption: 'event.num · event.x · event.y · event.keycode …',
            notes: '<p>tkinter 가 이벤트 정보를 봉투(event)에 담아 함수에 전달한다고 비유합니다.</p><p>시간: 2분</p>' },
          { layout: 'code', title: 'Code10-15 event.num · x · y', code: `from tkinter import *

def clickMouse(event) :
    txt = ""
    if event.num == 1 :
        txt += "마우스 왼쪽 버튼이 ("
    elif event.num == 3 :
        txt += "마우스 오른쪽 버튼이 ("
    txt += str(event.y) + "," + str(event.x) + ")에서 클릭됨"
    label1.configure(text = txt)

window = Tk()
window.geometry("400x400")
label1 = Label(window, text = "이곳이 바뀜")
window.bind("<Button>", clickMouse)
label1.pack(expand = 1, anchor = CENTER)
window.mainloop()`,
            points: ['<code>event.num</code>: 1 왼쪽 · 3 오른쪽', '<code>event.x</code> · <code>event.y</code>: 클릭 좌표', '교재는 (y, x) 순서로 출력 — 바꿔 보기'],
            notes: '<p>강의자료 34~35쪽. 창의 네 모서리를 클릭해 좌표 범위(0~400)를 확인합니다. 레이블 위를 클릭하면 레이블 기준 좌표가 나오는 것도 관찰 포인트.</p><p>시간: 5분</p>' },
          { layout: 'code', title: 'Code10-16 키보드 이벤트', code: `from tkinter import *
from tkinter import messagebox

## 함수 선언 부분 ##
def keyEvent(event) :
    messagebox.showinfo("키보드 이벤트", "눌린 키 : " + chr(event.keycode))

## 메인 코드 부분 ##
window = Tk()

window.bind("<Key>", keyEvent)

window.mainloop()`,
            points: ['<code>&lt;Key&gt;</code>: 모든 키', '<code>event.keycode</code>: 키 번호 (A=65)', '창을 먼저 클릭해 포커스 주기'],
            notes: '<p>강의자료 36쪽. 소문자를 눌러도 대문자로 나오는 이유(keycode 는 키 번호)를 설명합니다. 포커스 문제로 반응이 없다는 학생이 많으니 창을 먼저 클릭하게 합니다.</p><p>시간: 4분</p>' },
          { layout: 'table', title: '표 10-2 키보드 이벤트', head: ['작동', '이벤트 코드'], rows: [
            ['모든 키', '&lt;Key&gt;'], ['특수 키', '&lt;Return&gt; &lt;BackSpace&gt; &lt;Tab&gt; &lt;Escape&gt; &lt;Up&gt; &lt;Down&gt; &lt;F1&gt; …'], ['일반 키', 'a~z, A~Z, 0~9, &lt;space&gt;, &lt;less&gt;'], ['조합', '&lt;Shift-Up&gt; &lt;Shift-Down&gt; …']],
            lead: 'Enter → &lt;Return&gt; · 소문자 r → "r" · 스페이스 → &lt;space&gt;',
            notes: '<p>강의자료 37쪽. Code10-16 의 11행을 <code>&lt;Return&gt;</code>, <code>"r"</code>, <code>&lt;space&gt;</code> 로 바꿔 실행해 봅니다.</p><p>시간: 4분</p>' },
          { layout: 'code', title: '📘 keycode · keysym · char', code: `from tkinter import *

def keyEvent(event) :
    txt = "keycode : " + str(event.keycode) + "\\n"
    txt += "keysym : " + event.keysym + "\\n"
    txt += "char : " + repr(event.char)
    label1.configure(text = txt)

window = Tk()
window.geometry("300x150")
label1 = Label(window, text = "창을 클릭한 뒤 키를 누르세요", font = ("Consolas", 14), justify = LEFT)
label1.pack(expand = 1)
window.bind("<Key>", keyEvent)
window.mainloop()`,
            points: ['keycode: 키 번호 (대소문자 구별 X)', 'keysym: 키 이름 (Return, Up …)', 'char: 입력된 글자 그대로'],
            notes: '<p>강의자료에 없는 보충. a / A / Enter / 방향키를 눌러 세 값을 비교합니다. 실무에서는 keysym · char 를 주로 쓴다고 안내합니다.</p><p>시간: 3분</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '마우스 오른쪽 버튼 클릭의 이벤트 코드는?', options: ['&lt;Button-1&gt;', '&lt;Button-2&gt;', '&lt;Button-3&gt;', '&lt;Right&gt;'], answer: 2,
            explain: '1 왼쪽 · 2 가운데 · 3 오른쪽. &lt;Right&gt; 는 오른쪽 화살표 키.',
            notes: '<p>시간: 1분</p>' },
          { layout: 'practice', title: 'SELF STUDY 10-4. Shift + 화살표', desc: 'Shift + 화살표 키를 누르면 "눌린 키 : Shift + 아래쪽 화살표" 처럼 메시지 창에 출력하세요. (keycode: 왼 37, 위 38, 오 39, 아래 40)',
            starter: `from tkinter import *
from tkinter import messagebox

def keyEvent(event) :
    txt = ""
    # TODO: keycode 로 방향 판단
    messagebox.showinfo("키보드 이벤트", "눌린 키 : Shift + " + txt)

window = Tk()
# TODO: bind 4개
window.mainloop()
`,
            solution: `from tkinter import *
from tkinter import messagebox

def keyEvent(event) :
    names = {37 : "왼쪽", 38 : "위쪽", 39 : "오른쪽", 40 : "아래쪽"}
    txt = names.get(event.keycode, "") + " 화살표"
    messagebox.showinfo("키보드 이벤트", "눌린 키 : Shift + " + txt)

window = Tk()
window.bind("<Shift-Up>", keyEvent)
window.bind("<Shift-Down>", keyEvent)
window.bind("<Shift-Left>", keyEvent)
window.bind("<Shift-Right>", keyEvent)
window.mainloop()
`,
            notes: '<p>강의자료 38쪽. 교사용 정답은 딕셔너리(8장)를 쓴 짧은 버전입니다. 학생은 if~elif 로 풀어도 됩니다. keysym(Up, Down …)을 써도 정답입니다.</p><p>시간: 6분</p>' },
          { layout: 'summary', title: '정리', bullets: ['<code>위젯.bind("이벤트", 함수)</code> — 함수는 <code>event</code> 매개변수', '마우스: &lt;Button-1/2/3&gt;, &lt;Double-Button-1&gt;, &lt;B1-Motion&gt;, &lt;Enter&gt;', '<code>event.num</code>, <code>event.x</code>, <code>event.y</code>', '키보드: &lt;Key&gt;, &lt;Return&gt;, "r", &lt;space&gt;, &lt;Shift-Up&gt;', '<code>event.keycode</code> · <code>keysym</code> · <code>char</code>'],
            notes: '<p>다음 시간: 메뉴와 대화상자, 그리고 [프로그램 2] 명화 감상.</p><p>시간: 2분</p>' }
        ]
      },

      /* ───────────────────────── 6교시: 메뉴와 대화상자 · [프로그램 2] 명화 감상 ───────────────────────── */
      {
        id: 'ch10-6',
        title: '메뉴와 대화상자 · [프로그램 2] 명화 감상',
        minutes: 50,
        goals: [
          '메뉴 자체 · 상위 메뉴 · 하위 메뉴의 관계를 이해하고 Menu, add_cascade, add_command, add_separator 로 메뉴를 만들 수 있다',
          'simpledialog 의 askinteger() · askstring() 으로 값을 입력받을 수 있다',
          'filedialog 의 askopenfilename() · asksaveasfile() 로 파일을 고를 수 있다',
          '메뉴와 파일 대화상자를 이용해 명화 감상 프로그램을 완성하고, zoom() · subsample() 로 확대 · 축소 기능을 더할 수 있다'
        ],
        flow: [['복습 · 도입', 3], ['메뉴의 구성과 생성', 12], ['숫자 입력 대화상자', 7], ['파일 열기 · 저장 대화상자', 10], ['[프로그램 2] 명화 감상 완성', 10], ['확대 · 축소 · 정리', 8]],
        content: [
          { type: 'h', text: '메뉴의 생성' },
          { type: 'p', html: '대부분의 윈도 프로그램은 창 위쪽에 <b>[파일] [편집] [보기]</b> 같은 메뉴가 있습니다. tkinter 의 메뉴는 세 층으로 이루어집니다.' },
          { type: 'list', items: [
            '<b>메뉴 자체</b> — 창 위쪽의 메뉴 막대. <code>Menu(window)</code> 로 만들고 <code>window.config(menu = …)</code> 로 창에 붙입니다.',
            '<b>상위 메뉴</b> — 메뉴 막대에 보이는 [파일] 같은 항목. <code>Menu(메뉴자체)</code> 로 만들어 <code>add_cascade()</code> 로 메뉴 막대에 추가합니다.',
            '<b>하위 메뉴</b> — 상위 메뉴를 누르면 펼쳐지는 [열기] [종료] 같은 항목. <code>add_command()</code> 로 추가하고, 고르면 <code>command</code> 의 함수가 실행됩니다.'
          ] },
          { type: 'figure', html: FIG_MENU, caption: '그림 10-1 메뉴의 구성 개념도와 코드 — 메뉴 자체 ⊃ 상위 메뉴 ⊃ 하위 메뉴' },
          { type: 'code', title: '메뉴 생성 형식', run: false, code: `메뉴자체 = Menu(부모윈도)
부모윈도.config(menu = 메뉴자체)

상위메뉴 = Menu(메뉴자체)
메뉴자체.add_cascade(label = "상위메뉴텍스트", menu = 상위메뉴)
상위메뉴.add_command(label = "하위메뉴1", command = 함수1)
상위메뉴.add_command(label = "하위메뉴2", command = 함수2)` },
          { type: 'code', title: 'Code10-17. [파일] 메뉴 아래에 [열기]와 [종료] 하위 메뉴가 있는 코드', code: `from tkinter import *

window = Tk()

mainMenu = Menu(window)
window.config(menu = mainMenu)

fileMenu = Menu(mainMenu)
mainMenu.add_cascade(label = "파일", menu = fileMenu)
fileMenu.add_command(label = "열기")
fileMenu.add_separator()
fileMenu.add_command(label = "종료")

window.mainloop()`, desc: '<code>5~6행</code> 메뉴 막대를 만들어 창에 붙입니다. <code>8~9행</code> [파일] 상위 메뉴를 만들어 메뉴 막대에 넣습니다. <code>10~12행</code> [열기], 구분선, [종료] 하위 메뉴를 차례로 넣습니다. 아직 command 를 지정하지 않았으므로 골라도 아무 일도 일어나지 않습니다.' },
          { type: 'callout', kind: 'info', title: '메뉴 위의 점선(- - - -)은?', html: '윈도의 IDLE 에서 실행하면 하위 메뉴 맨 위에 점선이 보입니다. 이것을 누르면 메뉴를 별도의 작은 창으로 떼어 낼 수 있는(tear-off) 기능입니다. 필요 없다면 <code>Menu(mainMenu, tearoff = 0)</code> 으로 만들면 사라집니다. 이 강좌의 창에는 점선이 표시되지 않습니다.' },
          { type: 'code', title: 'Code10-18. 메뉴를 선택하면 작동하도록 코드 추가', code: `from tkinter import *
from tkinter import messagebox

## 함수 선언 부분 ##
def func_open() :
    messagebox.showinfo("메뉴선택", "열기 메뉴를 선택함")

def func_exit() :
    window.quit()
    window.destroy()

## 메인 코드 부분 ##
window = Tk()

mainMenu = Menu(window)
window.config(menu = mainMenu)

fileMenu = Menu(mainMenu)
mainMenu.add_cascade(label = "파일", menu = fileMenu)
fileMenu.add_command(label = "열기", command = func_open)
fileMenu.add_separator()
fileMenu.add_command(label = "종료", command = func_exit)

window.mainloop()`, desc: '<code>20행</code> [열기] 를 고르면 func_open 이 메시지 창을 띄웁니다. <code>8~10행</code> [종료] 를 고르면 <code>window.quit()</code> 로 mainloop 를 끝내고, <code>window.destroy()</code> 로 창을 없앱니다. 하위 메뉴의 command 도 버튼과 마찬가지로 <b>괄호 없이 함수 이름</b>만 씁니다.' },
          { type: 'callout', kind: 'more', title: 'quit() 와 destroy() 의 차이', html: '<ul><li><code>window.quit()</code> — <b>mainloop() 반복을 멈춥니다.</b> 창은 화면에 남아 있을 수 있습니다. mainloop() 다음 줄의 코드가 실행됩니다.</li><li><code>window.destroy()</code> — <b>창과 그 안의 모든 위젯을 없앱니다.</b> 창이 모두 없어지면 mainloop 도 끝납니다.</li></ul><p>교재처럼 둘을 함께 쓰면 IDLE 등 어떤 환경에서도 깔끔하게 끝납니다.</p>' },
          { type: 'code', title: '추가 예제. 메뉴 두 개와 배경색 바꾸기', code: `from tkinter import *
from tkinter import messagebox

## 함수 선언 부분 ##
def func_red() :
    window.configure(bg = "tomato")

def func_blue() :
    window.configure(bg = "skyblue")

def func_about() :
    messagebox.showinfo("정보", "메뉴 연습 프로그램 v1.0")

## 메인 코드 부분 ##
window = Tk()
window.geometry("300x150")
window.title("메뉴 연습")

mainMenu = Menu(window)
window.config(menu = mainMenu)

colorMenu = Menu(mainMenu, tearoff = 0)
mainMenu.add_cascade(label = "배경색", menu = colorMenu)
colorMenu.add_command(label = "빨강", command = func_red)
colorMenu.add_command(label = "파랑", command = func_blue)

helpMenu = Menu(mainMenu, tearoff = 0)
mainMenu.add_cascade(label = "도움말", menu = helpMenu)
helpMenu.add_command(label = "프로그램 정보", command = func_about)

window.mainloop()`, desc: '상위 메뉴를 여러 개 만들려면 <code>Menu(mainMenu)</code> 를 여러 번 만들어 각각 <code>add_cascade()</code> 합니다. 먼저 추가한 것이 왼쪽에 옵니다. <code>window.configure(bg = …)</code> 로 창의 배경색도 바꿀 수 있습니다.' },

          { type: 'h', text: '대화상자의 생성과 사용' },
          { type: 'p', html: '<b>대화상자(dialog)</b>는 사용자에게 값을 물어보는 작은 창입니다. <code>tkinter.simpledialog</code> 모듈을 임포트하면 정수를 묻는 <code>askinteger()</code>, 실수를 묻는 <code>askfloat()</code>, 문자열을 묻는 <code>askstring()</code> 을 쓸 수 있습니다. 콘솔의 <code>input()</code> 을 창으로 바꾼 것이라고 생각하면 됩니다.' },
          { type: 'code', title: 'Code10-19. 숫자를 입력받는 대화상자', code: `from tkinter import *
from tkinter.simpledialog import *

## 메인 코드 부분 ##
window = Tk()
window.geometry("400x100")

label1 = Label(window, text = "입력된 값")
label1.pack()

value = askinteger("확대배수", "주사위 숫자(1~6)을 입력하세요", minvalue = 1, maxvalue = 6)

label1.configure(text = str(value))
window.mainloop()`, dialogs: [3], desc: '<code>2행</code> simpledialog 모듈의 함수들을 가져옵니다. <code>11행</code> 제목이 "확대배수" 인 대화상자가 열립니다. <code>minvalue</code> · <code>maxvalue</code> 로 입력 범위를 1~6 으로 제한했으므로, 범위를 벗어나거나 정수가 아닌 값을 넣으면 다시 입력하라고 안내합니다. [OK] 를 누르면 입력한 정수가, [Cancel] 을 누르면 <code>None</code> 이 value 에 들어갑니다. <code>13행</code> 결과를 레이블에 표시합니다. (교재의 "## 함수 선언 부분 ##" 주석은 내용에 맞게 "메인 코드 부분" 으로 고쳤습니다.)' },
          { type: 'table', head: ['함수', '입력받는 값', '[취소] 시'], rows: [
            ['<code>askinteger(제목, 안내문, minvalue=, maxvalue=)</code>', '정수 <code>int</code>', '<code>None</code>'],
            ['<code>askfloat(제목, 안내문, minvalue=, maxvalue=)</code>', '실수 <code>float</code>', '<code>None</code>'],
            ['<code>askstring(제목, 안내문)</code>', '문자열 <code>str</code>', '<code>None</code>']
          ], caption: 'tkinter.simpledialog 의 입력 대화상자' },
          { type: 'callout', kind: 'warn', title: '[취소] 를 누르면 None!', html: '사용자가 [Cancel] 을 누르거나 창을 닫으면 <code>None</code> 이 돌아옵니다. 받은 값으로 계산을 한다면 <code>if value == None : return</code> 처럼 먼저 확인해야 <code>TypeError</code> 를 피할 수 있습니다. (파이썬다운 표현은 <code>if value is None</code> 입니다.)' },

          { type: 'h', text: '그림 파일인 GIF 파일을 선택하는 코드' },
          { type: 'p', html: '<code>tkinter.filedialog</code> 모듈의 <code>askopenfilename()</code> 은 파일을 고르는 <b>[열기] 대화상자</b>를 띄우고, 고른 파일의 <b>경로 문자열</b>을 돌려줍니다. 파일을 여는 것은 아니고 "이름만" 알려 줍니다. Code10-19 에서 2행과 11행만 바꿉니다.' },
          { type: 'code', title: 'Code10-20. GIF 파일을 선택하는 코드', code: `from tkinter import *
from tkinter.filedialog import *

## 메인 코드 부분 ##
window = Tk()
window.geometry("400x100")

label1 = Label(window, text = "선택된 파일 이름")
label1.pack()

filename = askopenfilename(parent = window, filetypes = (("GIF 파일", "*.gif"),
                           ("모든 파일", "*.*")))

label1.configure(text = str(filename))
window.mainloop()`, dialogs: ['GIF/cat2.gif'], desc: '<code>11~12행</code> <code>filetypes</code> 는 (설명, 패턴) 쌍의 튜플로, 대화상자에서 고를 수 있는 파일 종류입니다. 첫 번째 <code>*.gif</code> 가 기본으로 선택되어 GIF 파일만 보입니다. 파일을 고르면 전체 경로가 레이블에 표시되고, [취소] 하면 빈 문자열 <code>""</code> 이 돌아옵니다.' },
          { type: 'callout', kind: 'info', title: '이 강좌의 파일 대화상자', html: '브라우저에서는 내 PC 의 폴더를 직접 볼 수 없으므로, 대화상자에 <b>작업 폴더의 파일 목록</b>이 나타납니다. <code>GIF</code> 폴더의 그림을 고르면 <code>/home/pyodide/work/GIF/cat2.gif</code> 같은 경로가 돌아옵니다(교재의 <code>C:/CookPython/GIF/cat2.gif</code> 에 해당). <b>내 PC 파일 올리기</b> 버튼으로 내 그림 파일(GIF · PNG)을 작업 폴더에 올려서 고를 수도 있습니다.' },
          { type: 'p', html: '저장할 파일을 고르는 <b>[다른 이름으로 저장] 대화상자</b>도 있습니다. <code>asksaveasfile()</code> 은 고른 이름으로 <b>파일을 열어서 파일 객체</b>를 돌려주고, <code>asksaveasfilename()</code> 은 이름(문자열)만 돌려줍니다. Code10-20 의 11~13행을 바꿔 봅니다.' },
          { type: 'code', title: 'Code10-21. 저장할 파일을 선택하는 코드', code: `from tkinter import *
from tkinter.filedialog import *

## 메인 코드 부분 ##
window = Tk()
window.geometry("400x100")

label1 = Label(window, text = "선택된 파일 이름")
label1.pack()

saveFp = asksaveasfile(parent = window, mode = "w", defaultextension = ".jpg",
                       filetypes = (("JPG 파일", "*.jpg;*.jpeg"), ("모든 파일", "*.*")))
label1.configure(text = saveFp)
saveFp.close()

window.mainloop()`, dialogs: ['picture6.jpg'], desc: '<code>11~12행</code> 쓰기 모드(<code>"w"</code>)로 파일을 엽니다. 확장자 없이 이름을 입력하면 <code>defaultextension</code> 의 <code>.jpg</code> 가 붙습니다. <code>13행</code> 파일 객체를 그대로 레이블에 넣으면 <code>&lt;_io.TextIOWrapper name=\'…/picture6.jpg\' mode=\'w\' …&gt;</code> 처럼 파일 객체의 정보가 표시됩니다. <code>14행</code> 파일을 열었으면 반드시 닫습니다. (아무것도 쓰지 않았으므로 빈 파일이 만들어집니다. 파일 쓰기는 11장에서 배웁니다.)' },
          { type: 'callout', kind: 'warn', title: '같은 이름의 파일이 있으면', html: '내 PC 의 저장 대화상자에서 이미 있는 파일 이름을 고르면 "바꾸시겠습니까?" 라고 한 번 더 묻습니다. [예] 를 누르면 <code>mode="w"</code> 로 열리면서 <b>원래 내용이 모두 지워집니다</b>. 실습할 때 중요한 파일을 고르지 않도록 주의하세요. 또, [취소] 하면 saveFp 가 <code>None</code> 이 되어 <code>saveFp.close()</code> 에서 <code>AttributeError</code> 가 납니다. 실제 프로그램에서는 <code>if saveFp != None :</code> 으로 확인하세요.' },

          { type: 'h', text: '[프로그램 2]의 완성 — 명화 감상' },
          { type: 'p', html: '메뉴와 파일 대화상자를 합쳐서, [파일] → [파일 열기] 로 고른 그림을 창에 보여 주는 프로그램을 만듭니다. 메뉴 처리와 파일 처리가 핵심입니다.' },
          { type: 'code', title: 'Code10-22. [프로그램 2] 완성: 명화 감상', code: C10_22, desc: '<code>5~10행</code> [파일 열기] 를 고르면 파일 대화상자로 파일 이름을 받고, 그 그림을 읽어 레이블의 그림을 바꿉니다. <code>12~14행</code> [프로그램 종료]. <code>21~23행</code> 처음에는 <b>빈 그림</b>(<code>PhotoImage()</code>)으로 레이블을 만들어 창 가운데에 둡니다. <code>25~32행</code> 메뉴를 만듭니다. 실행한 뒤 [파일] → [파일 열기] 에서 <code>GIF</code> 폴더의 <code>painting1.gif</code>~<code>painting4.gif</code> 를 골라 보세요.' },
          { type: 'callout', kind: 'info', title: '교재와 달라진 점', html: '교재는 르누아르의 명화 사진(<code>C:/CookPython/GIF2/renoir01.gif</code> …)을 쓰지만, 이 강좌에서는 유명한 그림의 <b>분위기만 흉내 내어 직접 그린</b> 그림 4장(<code>painting1.gif</code> 별이 빛나는 밤 풍, <code>painting2.gif</code> 빨강 · 파랑 · 노랑의 구성 풍, <code>painting3.gif</code> 수련 풍, <code>painting4.gif</code> 동심원 풍)을 작업 폴더의 <code>GIF</code> 폴더에 넣어 두었습니다. 내 그림을 올려서 감상해도 됩니다.' },
          { type: 'callout', kind: 'more', title: '[취소] 를 눌렀을 때도 안전하게', html: '<p>Code10-22 에서 [파일 열기] 대화상자를 [취소] 하면 filename 이 <code>""</code> 가 됩니다. 이때 내 PC 의 tkinter 는 <code>PhotoImage(file = "")</code> 를 빈 그림으로 처리하여 그림이 사라집니다. 원래 그림을 그대로 두고 싶다면 함수 앞부분에 다음 두 줄을 넣습니다.</p><pre><code>if filename == "" :\n    return</code></pre>' },

          { type: 'h', text: '📘 [프로그램 2] 확장: 그림 확대 · 축소' },
          { type: 'p', html: 'PhotoImage 객체에는 그림 크기를 정수 배로 바꾸는 메서드가 있습니다. <code>zoom(x배, y배)</code> 는 확대한, <code>subsample(x분의1, y분의1)</code> 은 축소한 <b>새 PhotoImage</b> 를 돌려줍니다(원래 그림은 그대로). askinteger 로 배수를 입력받아 명화를 확대 · 축소하는 [이미지 효과] 메뉴를 추가해 봅시다.' },
          { type: 'table', head: ['메서드', '결과', '예 (원래 280×340)'], rows: [
            ['<code>photo.zoom(2, 2)</code>', '가로 · 세로 2배 확대', '560×680'],
            ['<code>photo.zoom(3)</code>', 'y 를 생략하면 x 와 같은 배수', '840×1020'],
            ['<code>photo.subsample(2, 2)</code>', '가로 · 세로 1/2 로 축소 (2픽셀마다 1픽셀)', '140×170'],
            ['<code>photo.subsample(2, 1)</code>', '가로만 1/2', '140×340']
          ], caption: 'PhotoImage 의 확대 · 축소 메서드 (정수 배만 가능)' },
          { type: 'code', title: '추가 예제. [프로그램 2] 확장: 확대 · 축소 메뉴가 있는 명화 감상', code: C10_ZOOM, desc: '<code>6행</code> 지금 보여 주는 그림을 전역 변수 <code>photo</code> 에 기억합니다. 그래서 세 함수 모두 <code>global photo</code> 가 필요합니다. <code>13~14행</code> 파일 대화상자를 취소하면 아무것도 하지 않습니다. <code>19~20행</code> 아직 그림을 열지 않았으면 확대할 것이 없으므로 돌아갑니다. <code>21~24행</code> 2~4 배수를 입력받아 <code>zoom()</code> 한 새 그림으로 바꿉니다. 축소는 <code>subsample()</code> 을 씁니다. 확대한 뒤 축소하면 원래 크기로 돌아옵니다.' },
          { type: 'callout', kind: 'more', title: '확대를 여러 번 하면?', html: '<p>zoom 은 픽셀을 그대로 복사해서 키우므로 여러 번 확대하면 계단 모양(모자이크)이 커지고, 그림이 매우 커지면 메모리도 많이 씁니다. 또 subsample 은 픽셀을 건너뛰며 줄이므로 한 번 축소한 뒤 다시 확대해도 원래만큼 선명해지지 않습니다. 부드럽게 크기를 바꾸려면 Pillow 의 <code>Image.resize()</code> 를 사용하고, 원본 그림을 따로 보관해 두었다가 항상 원본에서 변환하는 것이 좋습니다.</p>' }
        ],
        practice: [
          {
            title: '실습 10-8. 이름을 물어보는 인사 프로그램',
            level: 1,
            desc: '<p>프로그램을 시작하면 <code>askstring()</code> 으로 이름을 물어보고, 창의 레이블에 <code>홍길동님, 환영합니다!</code> 를 큰 글씨(크기 20)로 표시하세요. [Cancel] 을 누르면 <code>손님, 환영합니다!</code> 로 표시합니다.</p>',
            hint: '<code>from tkinter.simpledialog import *</code> 후 <code>name = askstring("이름", "이름을 입력하세요")</code>. 취소하면 <code>None</code> 입니다.',
            dialogs: ['홍길동'],
            starter: `from tkinter import *
from tkinter.simpledialog import *

window = Tk()
window.geometry("400x100")

label1 = Label(window, text = "", font = ("맑은 고딕", 20))
label1.pack(expand = 1)

# TODO: askstring 으로 이름을 묻고 레이블에 환영 인사 표시

window.mainloop()
`,
            solution: `from tkinter import *
from tkinter.simpledialog import *

window = Tk()
window.geometry("400x100")

label1 = Label(window, text = "", font = ("맑은 고딕", 20))
label1.pack(expand = 1)

name = askstring("이름", "이름을 입력하세요")
if name == None :
    name = "손님"
label1.configure(text = name + "님, 환영합니다!")

window.mainloop()
`
          },
          {
            title: '실습 10-9. 명화 감상 — 제목 표시줄에 파일 이름',
            level: 2,
            desc: '<p>Code10-22 를 수정하세요.</p><ol><li>[파일 열기] 를 [취소] 하면 아무 일도 하지 않습니다.</li><li>그림을 열면 창 제목이 <code>명화 감상하기 - painting1.gif</code> 처럼 <b>파일 이름</b>(경로 제외)으로 바뀝니다.</li><li>[파일] 메뉴에 [그림 지우기] 를 추가하여, 고르면 빈 그림으로 되돌리고 제목도 <code>명화 감상하기</code> 로 되돌립니다.</li></ol>',
            hint: '경로에서 파일 이름만 꺼내려면 <code>import os</code> 후 <code>os.path.basename(filename)</code> 또는 <code>filename.split("/")[-1]</code>. 빈 그림은 <code>PhotoImage()</code>.',
            starter: C10_22.replace('window.mainloop()', '# TODO: 취소 처리, 제목 바꾸기, [그림 지우기] 메뉴 추가\n\nwindow.mainloop()') + '\n',
            solution: `from tkinter import *
from tkinter.filedialog import *
import os

## 함수 선언 부분 ##
def func_open() :
    filename = askopenfilename(parent = window, filetypes = (("GIF 파일", "*.gif"),
                               ("모든 파일", "*.*")))
    if filename == "" :
        return
    photo = PhotoImage(file = filename)
    pLabel.configure(image = photo)
    pLabel.image = photo
    window.title("명화 감상하기 - " + os.path.basename(filename))

def func_clear() :
    photo = PhotoImage()
    pLabel.configure(image = photo)
    pLabel.image = photo
    window.title("명화 감상하기")

def func_exit() :
    window.quit()
    window.destroy()

## 메인 코드 부분 ##
window = Tk()
window.geometry("400x400")
window.title("명화 감상하기")

photo = PhotoImage()
pLabel = Label(window, image = photo)
pLabel.pack(expand = 1, anchor = CENTER)

mainMenu = Menu(window)
window.config(menu = mainMenu)
fileMenu = Menu(mainMenu)
mainMenu.add_cascade(label = "파일", menu = fileMenu)
fileMenu.add_command(label = "파일 열기", command = func_open)
fileMenu.add_command(label = "그림 지우기", command = func_clear)
fileMenu.add_separator()
fileMenu.add_command(label = "프로그램 종료", command = func_exit)

window.mainloop()
`
          },
          {
            title: '실습 10-10. 주사위 배수만큼 그림 늘어놓기',
            level: 3,
            desc: '<p>Code10-19 처럼 <code>askinteger()</code> 로 1~6 사이의 숫자를 입력받은 뒤, 그 개수만큼 <code>GIF/rabbit.gif</code> 를 <b>2분의 1로 축소</b>(<code>subsample(2)</code>)해서 가로로 늘어놓으세요. 창 제목은 <code>토끼 N마리</code> 로 합니다. [Cancel] 이면 <code>토끼 0마리</code>.</p>',
            hint: '축소한 그림은 하나만 만들어 여러 레이블에 같이 넣어도 됩니다. <code>small = PhotoImage(file = "GIF/rabbit.gif").subsample(2)</code>',
            dialogs: [4],
            starter: `from tkinter import *
from tkinter.simpledialog import *

window = Tk()

value = askinteger("토끼", "토끼 몇 마리? (1~6)", minvalue = 1, maxvalue = 6)

# TODO: 축소한 토끼 그림을 value 개 가로로 배치하고 제목 바꾸기

window.mainloop()
`,
            solution: `from tkinter import *
from tkinter.simpledialog import *

window = Tk()

value = askinteger("토끼", "토끼 몇 마리? (1~6)", minvalue = 1, maxvalue = 6)
if value == None :
    value = 0

small = PhotoImage(file = "GIF/rabbit.gif").subsample(2)
for i in range(value) :
    Label(window, image = small).pack(side = LEFT)

window.title("토끼 " + str(value) + "마리")
window.mainloop()
`
          }
        ],
        quiz: [
          { q: '메뉴 막대에 [파일] 상위 메뉴를 추가하는 메서드는?', options: ['add_command()', 'add_cascade()', 'add_separator()', 'config()'], answer: 1,
            explain: '<code>add_cascade(label=, menu=)</code> 는 펼쳐지는 상위 메뉴를, <code>add_command()</code> 는 실행되는 하위 메뉴를 추가합니다.' },
          { q: '만든 메뉴 막대(mainMenu)를 창에 붙이는 코드는?', options: ['mainMenu.pack()', 'window.config(menu = mainMenu)', 'window.add_cascade(mainMenu)', 'mainMenu.place(x=0, y=0)'], answer: 1,
            explain: '메뉴 막대는 pack 하지 않고 <code>window.config(menu = …)</code> 로 창에 지정합니다.' },
          { q: '<code>askinteger()</code> 대화상자에서 [Cancel] 을 누르면 돌려주는 값은?', options: ['0', '""', 'None', '-1'], answer: 2,
            explain: 'simpledialog 의 ask 함수들은 취소하면 <code>None</code> 을 돌려줍니다.' },
          { q: '<code>askopenfilename()</code> 이 돌려주는 것은?', options: ['열린 파일 객체', '고른 파일의 경로 문자열', '그림 객체(PhotoImage)', '파일의 내용'], answer: 1,
            explain: '파일 이름(경로)만 돌려줍니다. 그 이름으로 <code>PhotoImage(file=…)</code> 나 <code>open()</code> 을 해야 파일을 사용할 수 있습니다.' },
          { q: '크기가 280×340 인 PhotoImage <code>p</code> 에 대해 <code>p.subsample(2)</code> 의 크기는?', options: ['560×680', '140×170', '140×340', '280×340'], answer: 1,
            explain: 'subsample(2) 는 가로 · 세로를 모두 1/2 로 줄인 새 그림을 돌려줍니다. y 를 생략하면 x 와 같은 값이 쓰입니다.' }
        ],
        slides: [
          { layout: 'title', title: '메뉴와 대화상자 · [프로그램 2] 명화 감상', subtitle: 'Chapter 10 · Section 05 메뉴와 대화상자', badge: '6교시',
            notes: '<p>이 장의 마지막 시간. 메뉴와 대화상자를 배우고 [프로그램 2] 를 완성한 뒤, 확대 · 축소 기능까지 더해 봅니다.</p><p>시간: 1분</p>' },
          { layout: 'diagram', title: '메뉴의 구성', html: FIG_MENU, caption: '메뉴 자체 → 상위 메뉴(add_cascade) → 하위 메뉴(add_command)',
            notes: '<p>강의자료 39쪽. 메모장 같은 실제 프로그램의 메뉴를 보여 주며 세 층을 짚습니다. 상위 메뉴도 Menu 객체라는 점이 헷갈리는 포인트입니다.</p><p>시간: 4분</p>' },
          { layout: 'code', title: 'Code10-17 메뉴 만들기', code: `from tkinter import *

window = Tk()

mainMenu = Menu(window)
window.config(menu = mainMenu)

fileMenu = Menu(mainMenu)
mainMenu.add_cascade(label = "파일", menu = fileMenu)
fileMenu.add_command(label = "열기")
fileMenu.add_separator()
fileMenu.add_command(label = "종료")

window.mainloop()`,
            points: ['<code>Menu(window)</code> + <code>config(menu=)</code>', '<code>add_cascade</code>: 상위 메뉴 [파일]', '<code>add_command</code>: 하위 메뉴', '<code>add_separator</code>: 구분선'],
            notes: '<p>강의자료 40쪽. [편집] 메뉴를 하나 더 추가해 보게 합니다(Menu 하나 더 + add_cascade).</p><p>시간: 4분</p>' },
          { layout: 'code', title: 'Code10-18 메뉴에 기능 연결', code: `from tkinter import *
from tkinter import messagebox

def func_open() :
    messagebox.showinfo("메뉴선택", "열기 메뉴를 선택함")

def func_exit() :
    window.quit()
    window.destroy()

window = Tk()
mainMenu = Menu(window)
window.config(menu = mainMenu)

fileMenu = Menu(mainMenu)
mainMenu.add_cascade(label = "파일", menu = fileMenu)
fileMenu.add_command(label = "열기", command = func_open)
fileMenu.add_separator()
fileMenu.add_command(label = "종료", command = func_exit)

window.mainloop()`,
            points: ['하위 메뉴에 <code>command = 함수이름</code>', '<code>quit()</code>: mainloop 끝내기', '<code>destroy()</code>: 창 없애기'],
            notes: '<p>강의자료 41~42쪽. quit 과 destroy 의 차이를 간단히 설명합니다.</p><p>시간: 4분</p>' },
          { layout: 'code', title: 'Code10-19 숫자 입력 대화상자', code: `from tkinter import *
from tkinter.simpledialog import *

window = Tk()
window.geometry("400x100")

label1 = Label(window, text = "입력된 값")
label1.pack()

value = askinteger("확대배수", "주사위 숫자(1~6)을 입력하세요", minvalue = 1, maxvalue = 6)

label1.configure(text = str(value))
window.mainloop()`, dialogs: [3],
            points: ['<code>tkinter.simpledialog</code> 임포트', '<code>askinteger(제목, 안내, minvalue, maxvalue)</code>', 'askfloat · askstring 도 있음', '취소 → <code>None</code>'],
            notes: '<p>강의자료 43쪽. 범위 밖 숫자(7), 문자(abc)를 넣어 보게 합니다. 취소 시 레이블에 None 이 표시되는 것도 확인.</p><p>시간: 4분</p>' },
          { layout: 'code', title: 'Code10-20 파일 열기 대화상자', code: `from tkinter import *
from tkinter.filedialog import *

window = Tk()
window.geometry("400x100")

label1 = Label(window, text = "선택된 파일 이름")
label1.pack()

filename = askopenfilename(parent = window, filetypes = (("GIF 파일", "*.gif"),
                           ("모든 파일", "*.*")))

label1.configure(text = str(filename))
window.mainloop()`, dialogs: ['GIF/cat2.gif'],
            points: ['<code>tkinter.filedialog</code> 임포트', '<code>filetypes</code>: (설명, 패턴) 쌍', '돌려주는 값: 경로 <b>문자열</b>', '취소 → <code>""</code>'],
            notes: '<p>강의자료 44~45쪽. 이 강좌에서는 작업 폴더 파일 목록이 뜨고, 내 PC 파일 올리기도 가능하다고 안내합니다.</p><p>Code10-21(asksaveasfile)은 본문에서 간단히 소개하고 넘어갑니다(파일 쓰기는 11장).</p><p>시간: 4분</p>' },
          { layout: 'code', title: 'Code10-22 [프로그램 2] 명화 감상 (함수)', code: `from tkinter import *
from tkinter.filedialog import *

## 함수 선언 부분 ##
def func_open() :
    filename = askopenfilename(parent = window, filetypes = (("GIF 파일", "*.gif"),
                               ("모든 파일", "*.*")))
    photo = PhotoImage(file = filename)
    pLabel.configure(image = photo)
    pLabel.image = photo

def func_exit() :
    window.quit()
    window.destroy()`, run: false,
            points: ['메뉴 [파일 열기] → 파일 대화상자', '고른 파일로 PhotoImage 만들기', '<code>configure(image=)</code> + <code>pLabel.image</code>'],
            notes: '<p>강의자료 47쪽. 사진 앨범의 clickNext 와 비교: 파일 이름을 리스트에서 꺼내느냐, 대화상자로 받느냐의 차이뿐입니다.</p><p>시간: 3분</p>' },
          { layout: 'code', title: 'Code10-22 [프로그램 2] 명화 감상 (실행)', code: `from tkinter import *
from tkinter.filedialog import *

def func_open() :
    filename = askopenfilename(parent = window, filetypes = (("GIF 파일", "*.gif"), ("모든 파일", "*.*")))
    photo = PhotoImage(file = filename)
    pLabel.configure(image = photo)
    pLabel.image = photo

def func_exit() :
    window.quit()
    window.destroy()

window = Tk()
window.geometry("400x400")
window.title("명화 감상하기")
photo = PhotoImage()
pLabel = Label(window, image = photo)
pLabel.pack(expand = 1, anchor = CENTER)
mainMenu = Menu(window); window.config(menu = mainMenu)
fileMenu = Menu(mainMenu); mainMenu.add_cascade(label = "파일", menu = fileMenu)
fileMenu.add_command(label = "파일 열기", command = func_open)
fileMenu.add_separator(); fileMenu.add_command(label = "프로그램 종료", command = func_exit)
window.mainloop()`,
            points: ['처음엔 빈 그림 <code>PhotoImage()</code>', '[파일] → [파일 열기] → painting1~4.gif', '원본 32행 코드는 본문 참고'],
            notes: '<p>강의자료 47~48쪽. 슬라이드 크기에 맞춰 메뉴 부분을 세미콜론으로 줄였습니다. 교재의 르누아르 그림 대신 직접 그린 명화 풍 그림을 사용합니다.</p><p>시간: 5분</p>' },
          { layout: 'table', title: '📘 확대 · 축소: zoom · subsample', head: ['메서드', '결과 (원래 280×340)'], rows: [
            ['<code>photo.zoom(2, 2)</code>', '2배 확대 → 560×680'], ['<code>photo.subsample(2, 2)</code>', '1/2 축소 → 140×170'], ['<code>photo.zoom(3)</code>', 'y 생략 = x 와 같음'], ['돌려주는 값', '<b>새</b> PhotoImage (원본은 그대로)']],
            lead: '정수 배만 가능 · askinteger 로 배수 입력받기',
            notes: '<p>교재 응용예제 수준의 확장입니다. 본문의 "추가 예제. [프로그램 2] 확장" 코드를 실행해 [이미지 효과] 메뉴로 확대 · 축소해 봅니다(코드가 길어 슬라이드에는 표만 둠).</p><p>시간: 4분</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>askopenfilename()</code> 이 돌려주는 것은?', options: ['열린 파일 객체', '경로 문자열', 'PhotoImage', '파일 내용'], answer: 1,
            explain: '이름(경로)만 돌려줍니다. 취소하면 빈 문자열.',
            notes: '<p>시간: 1분</p>' },
          { layout: 'practice', title: '실습 10-8. 이름을 물어보는 인사', desc: '시작하면 askstring 으로 이름을 묻고 "○○님, 환영합니다!" 를 크게 표시하세요. 취소하면 "손님".',
            starter: `from tkinter import *
from tkinter.simpledialog import *

window = Tk()
label1 = Label(window, text = "", font = ("맑은 고딕", 20))
label1.pack(expand = 1)
# TODO
window.mainloop()
`,
            solution: `from tkinter import *
from tkinter.simpledialog import *

window = Tk()
label1 = Label(window, text = "", font = ("맑은 고딕", 20))
label1.pack(expand = 1)
name = askstring("이름", "이름을 입력하세요")
if name == None :
    name = "손님"
label1.configure(text = name + "님, 환영합니다!")
window.mainloop()
`, dialogs: ['홍길동'],
            notes: '<p>5분 실습. 빨리 끝낸 학생은 실습 10-9(명화 감상 개선), 10-10(토끼 늘어놓기)에 도전합니다.</p><p>시간: 5분</p>' },
          { layout: 'summary', title: '정리', bullets: ['메뉴: <code>Menu</code> → <code>config(menu=)</code> → <code>add_cascade</code> → <code>add_command</code>', '<code>askinteger</code> · <code>askfloat</code> · <code>askstring</code> (취소 → None)', '<code>askopenfilename</code> → 경로 문자열 (취소 → "")', '[프로그램 2]: 메뉴 + 파일 대화상자 + PhotoImage', '<code>zoom()</code> · <code>subsample()</code> 로 확대 · 축소'],
            notes: '<p>10장 전체 정리: 창 → 위젯 → 배치 → 이벤트 → 메뉴 · 대화상자. 다음 장은 파일 입출력입니다(오늘 본 asksaveasfile 과 연결).</p><p>시간: 3분</p>' }
        ]
      }
    ]
  });
})();
