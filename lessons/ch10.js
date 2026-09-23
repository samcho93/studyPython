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
  const ARROW = (id, col) => `<marker viewBox="0 0 12 12" id="${id}" markerWidth="4.5" markerHeight="4.5" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="${col}"/></marker>`;

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

  /* ───────────── 심화 내용 그림 ───────────── */
  const FIG_EVENTMODEL = `<svg viewBox="0 0 1280 460" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <defs>${ARROW('c10arH', 'var(--accent)')}${ARROW('c10arI', 'var(--ok)')}</defs>
  <rect x="60" y="60" width="330" height="140" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="225" y="105" text-anchor="middle" font-size="24" font-weight="bold" fill="var(--accent)">① 상태 (데이터)</text>
  <text x="225" y="142" text-anchor="middle" font-size="20" fill="var(--fg)">num = 0 · 점수 · 목록</text>
  <text x="225" y="174" text-anchor="middle" font-size="19" fill="var(--muted)">전역 변수 · IntVar · 객체 속성</text>
  <rect x="890" y="60" width="330" height="140" rx="14" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
  <text x="1055" y="105" text-anchor="middle" font-size="24" font-weight="bold" fill="var(--accent2)">② 화면 (위젯)</text>
  <text x="1055" y="142" text-anchor="middle" font-size="20" fill="var(--fg)">Label · Button · Canvas</text>
  <text x="1055" y="174" text-anchor="middle" font-size="19" fill="var(--muted)">상태를 눈에 보이게 그린 것</text>
  <rect x="470" y="280" width="340" height="140" rx="14" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="640" y="325" text-anchor="middle" font-size="24" font-weight="bold" fill="var(--ok)">③ 콜백 함수</text>
  <text x="640" y="362" text-anchor="middle" font-size="20" fill="var(--fg)">def clickNext() : …</text>
  <text x="640" y="394" text-anchor="middle" font-size="19" fill="var(--muted)">상태를 바꾸고 화면을 다시 그림</text>
  <path d="M470,350 Q250,330 225,210" fill="none" stroke="var(--ok)" stroke-width="3" marker-end="url(#c10arI)"/>
  <text x="255" y="270" font-size="19" fill="var(--ok)">상태를 바꾼다</text>
  <path d="M810,350 Q1040,330 1055,210" fill="none" stroke="var(--ok)" stroke-width="3" marker-end="url(#c10arI)"/>
  <text x="900" y="270" font-size="19" fill="var(--ok)">화면을 고쳐 그린다</text>
  <line x1="390" y1="130" x2="880" y2="130" stroke="var(--accent)" stroke-width="3" stroke-dasharray="9 7" marker-end="url(#c10arH)"/>
  <text x="640" y="115" text-anchor="middle" font-size="20" fill="var(--fg)">화면은 상태의 <tspan font-weight="bold">사진</tspan>일 뿐</text>
  <text x="640" y="450" text-anchor="middle" font-size="20" fill="var(--muted)">mainloop() 은 이벤트가 올 때마다 ③ 을 불러 준다 — 나는 ①②③ 만 준비한다</text>
</svg>`;

  const FIG_LAMBDA = `<svg viewBox="0 0 1280 420" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="40" y="40" width="580" height="170" rx="14" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
  <text x="60" y="80" font-size="21" font-family="monospace" fill="var(--fg)">for i in range(3) :</text>
  <text x="60" y="112" font-size="21" font-family="monospace" fill="var(--fg)">    Button(…, command = lambda : f(<tspan fill="var(--danger)" font-weight="bold">i</tspan>))</text>
  <text x="60" y="160" font-size="20" fill="var(--danger)" font-weight="bold">✘ 셋 다 f(2) 가 실행된다</text>
  <text x="60" y="190" font-size="19" fill="var(--muted)">lambda 는 i 의 "값"이 아니라 "이름"을 기억</text>
  <rect x="660" y="40" width="580" height="170" rx="14" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="680" y="80" font-size="21" font-family="monospace" fill="var(--fg)">for i in range(3) :</text>
  <text x="680" y="112" font-size="21" font-family="monospace" fill="var(--fg)">    Button(…, command = lambda <tspan fill="var(--ok)" font-weight="bold">n = i</tspan> : f(n))</text>
  <text x="680" y="160" font-size="20" fill="var(--ok)" font-weight="bold">✔ f(0) · f(1) · f(2)</text>
  <text x="680" y="190" font-size="19" fill="var(--muted)">기본 인수는 만드는 순간의 값을 복사해 둔다</text>
  <text x="640" y="270" text-anchor="middle" font-size="22" fill="var(--fg)">클릭은 <tspan font-weight="bold">한참 뒤</tspan>에 일어난다 — 그때 i 는 이미 마지막 값(2)</text>
  <rect x="200" y="300" width="880" height="90" rx="12" fill="none" stroke="var(--line)" stroke-width="2" stroke-dasharray="8 6"/>
  <text x="640" y="335" text-anchor="middle" font-size="20" fill="var(--muted)">같은 해결책: functools.partial(f, i) · 값을 위젯에 저장(btn.num = i)</text>
  <text x="640" y="370" text-anchor="middle" font-size="20" fill="var(--muted)">for 문 안에서 만든 콜백에는 항상 이 함정이 있다</text>
</svg>`;

  const FIG_VAR = `<svg viewBox="0 0 1280 400" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <defs>${ARROW('c10arJ', 'var(--accent2)')}</defs>
  <rect x="470" y="140" width="340" height="120" rx="14" fill="var(--card)" stroke="var(--accent2)" stroke-width="4"/>
  <text x="640" y="185" text-anchor="middle" font-size="24" font-weight="bold" fill="var(--accent2)">StringVar</text>
  <text x="640" y="225" text-anchor="middle" font-size="22" font-family="monospace" fill="var(--fg)">"홍길동"</text>
  ${WIN(60, 50, 340, 130, 'Entry', `<rect x="90" y="115" width="280" height="44" rx="5" fill="var(--card)" stroke="var(--muted)" stroke-width="2.5"/><text x="104" y="146" font-size="20" fill="var(--fg)">홍길동|</text>`)}
  ${WIN(880, 50, 340, 130, 'Label', `<text x="910" y="145" font-size="22" fill="var(--fg)">안녕하세요, 홍길동님</text>`)}
  <line x1="400" y1="140" x2="465" y2="170" stroke="var(--accent2)" stroke-width="3" marker-end="url(#c10arJ)"/>
  <line x1="465" y1="195" x2="400" y2="165" stroke="var(--accent2)" stroke-width="3" marker-end="url(#c10arJ)"/>
  <text x="330" y="235" font-size="19" fill="var(--muted)">textvariable</text>
  <line x1="815" y1="170" x2="875" y2="140" stroke="var(--accent2)" stroke-width="3" marker-end="url(#c10arJ)"/>
  <text x="840" y="235" font-size="19" fill="var(--muted)">textvariable</text>
  <text x="640" y="310" text-anchor="middle" font-size="21" fill="var(--fg)">한 변수에 여러 위젯을 묶으면 <tspan font-weight="bold">한 쪽만 바꿔도 모두 따라 바뀐다</tspan></text>
  <text x="640" y="350" text-anchor="middle" font-size="20" font-family="monospace" fill="var(--ok)">var.set("값") · var.get() · var.trace_add("write", 함수)</text>
  <text x="640" y="385" text-anchor="middle" font-size="19" fill="var(--muted)">configure(text=…) 를 일일이 부르지 않아도 된다</text>
</svg>`;

  const FIG_MANAGERS = `<svg viewBox="0 0 1280 420" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  ${WIN(40, 40, 380, 250, 'pack — 쌓기', `${BTN(60, 92, 340, 42, '위에서부터')}${BTN(60, 140, 340, 42, '차곡차곡')}${BTN(60, 188, 160, 42, 'LEFT')}${BTN(228, 188, 172, 42, 'LEFT')}
  <text x="230" y="262" text-anchor="middle" font-size="19" fill="var(--muted)">줄 단위 화면 · 도구 모음</text>`)}
  ${WIN(450, 40, 380, 250, 'grid — 표', `${[0, 1, 2].map((r) => [0, 1].map((c) => `${BTN(470 + c * 175, 92 + r * 52, 165, 44, `(${r},${c})`)}`).join('')).join('')}
  <text x="640" y="262" text-anchor="middle" font-size="19" fill="var(--muted)">입력 폼 · 계산기 · 표</text>`)}
  ${WIN(860, 40, 380, 250, 'place — 좌표', `<rect x="900" y="100" width="120" height="60" rx="5" fill="var(--accent)" opacity="0.3"/><text x="960" y="137" text-anchor="middle" font-size="18" fill="var(--fg)">(40,50)</text>
  <rect x="1080" y="180" width="120" height="60" rx="5" fill="var(--accent2)" opacity="0.3"/><text x="1140" y="217" text-anchor="middle" font-size="18" fill="var(--fg)">(220,130)</text>
  <text x="1050" y="262" text-anchor="middle" font-size="19" fill="var(--muted)">그림 위 배치 · 애니메이션</text>`)}
  <text x="640" y="330" text-anchor="middle" font-size="22" fill="var(--fg)"><tspan font-weight="bold">고르는 기준</tspan> : 줄 세우기면 pack · 칸 맞추기면 grid · 좌표가 의미 있으면 place</text>
  <text x="640" y="370" text-anchor="middle" font-size="20" fill="var(--warn)">한 부모(창 · Frame) 안에서는 한 가지만 — 섞으면 배치가 깨진다</text>
  <text x="640" y="405" text-anchor="middle" font-size="19" fill="var(--muted)">Frame 으로 나누면 프레임마다 다른 방식을 써도 된다</text>
</svg>`;

  const FIG_GRID = `<svg viewBox="0 0 1280 440" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="70" y="60" width="560" height="300" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  ${[0, 1, 2].map((r) => `<line x1="70" y1="${60 + r * 100}" x2="630" y2="${60 + r * 100}" stroke="var(--line)" stroke-width="2" stroke-dasharray="6 5"/>`).join('')}
  ${[1, 2].map((c) => `<line x1="${70 + c * 187}" y1="60" x2="${70 + c * 187}" y2="360" stroke="var(--line)" stroke-width="2" stroke-dasharray="6 5"/>`).join('')}
  ${[0, 1, 2].map((r) => [0, 1, 2].map((c) => `<text x="${163 + c * 187}" y="${95 + r * 100}" text-anchor="middle" font-size="18" fill="var(--muted)">row=${r} col=${c}</text>`).join('')).join('')}
  <rect x="80" y="105" width="167" height="40" rx="5" fill="var(--accent)" opacity="0.3"/><text x="163" y="132" text-anchor="middle" font-size="19" fill="var(--fg)">sticky=E</text>
  <rect x="262" y="105" width="358" height="40" rx="5" fill="var(--accent2)" opacity="0.3"/><text x="441" y="132" text-anchor="middle" font-size="19" fill="var(--fg)">columnspan=2, sticky=W+E</text>
  <rect x="80" y="205" width="540" height="40" rx="5" fill="var(--ok)" opacity="0.3"/><text x="350" y="232" text-anchor="middle" font-size="19" fill="var(--fg)">columnspan=3</text>
  <text x="680" y="100" font-size="23" font-weight="bold" fill="var(--fg)">grid(row = 행, column = 열)</text>
  <text x="680" y="145" font-size="20" fill="var(--fg)">행 · 열 번호는 0 부터 · 빈 줄은 건너뛰어도 됨</text>
  <text x="680" y="185" font-size="20" fill="var(--fg)"><tspan font-family="monospace" fill="var(--accent2)">sticky</tspan> : 칸 안에서 어느 쪽에 붙일지 (N S E W)</text>
  <text x="680" y="225" font-size="20" fill="var(--fg)"><tspan font-family="monospace" fill="var(--accent2)">columnspan · rowspan</tspan> : 여러 칸 합치기</text>
  <text x="680" y="265" font-size="20" fill="var(--fg)"><tspan font-family="monospace" fill="var(--accent2)">padx · pady · ipadx · ipady</tspan> : pack 과 같음</text>
  <text x="680" y="315" font-size="20" fill="var(--muted)">창을 늘릴 때 같이 늘리려면</text>
  <text x="680" y="350" font-size="20" font-family="monospace" fill="var(--ok)">window.grid_columnconfigure(1, weight = 1)</text>
  <text x="680" y="400" font-size="19" fill="var(--muted)">칸 크기는 그 행 · 열에서 가장 큰 위젯이 정한다</text>
</svg>`;

  const FIG_AFTER = `<svg viewBox="0 0 1280 380" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <defs>${ARROW('c10arK', 'var(--accent)')}${ARROW('c10arL', 'var(--danger)')}</defs>
  <text x="40" y="50" font-size="23" font-weight="bold" fill="var(--ok)">✔ after() — 예약하고 바로 돌아온다</text>
  <line x1="60" y1="120" x2="1240" y2="120" stroke="var(--line)" stroke-width="3"/>
  ${[0, 1, 2, 3].map((i) => `<circle cx="${120 + i * 300}" cy="120" r="12" fill="var(--accent)"/><text x="${120 + i * 300}" y="100" text-anchor="middle" font-size="19" fill="var(--fg)">tick()</text><text x="${120 + i * 300}" y="152" text-anchor="middle" font-size="17" fill="var(--muted)">${i}초</text>`).join('')}
  ${[0, 1, 2].map((i) => `<path d="M${132 + i * 300},105 Q${270 + i * 300},50 ${408 + i * 300},105" fill="none" stroke="var(--accent)" stroke-width="3" marker-end="url(#c10arK)"/>`).join('')}
  <text x="640" y="185" text-anchor="middle" font-size="20" fill="var(--fg)">tick() 안에서 <tspan font-family="monospace" fill="var(--accent2)">window.after(1000, tick)</tspan> 으로 <tspan font-weight="bold">다음 번을 예약</tspan></text>
  <text x="640" y="215" text-anchor="middle" font-size="19" fill="var(--muted)">기다리는 동안에도 mainloop 는 클릭 · 키 입력을 받는다</text>
  <text x="40" y="275" font-size="23" font-weight="bold" fill="var(--danger)">✘ time.sleep() — 그 자리에서 멈춰 선다</text>
  <line x1="60" y1="330" x2="700" y2="330" stroke="var(--danger)" stroke-width="10"/>
  <text x="380" y="320" text-anchor="middle" font-size="19" fill="var(--danger)">mainloop 정지 — 창이 하얗게 얼고 버튼도 안 눌림</text>
  <line x1="710" y1="330" x2="790" y2="330" stroke="var(--danger)" stroke-width="3" marker-end="url(#c10arL)"/>
  <text x="810" y="337" font-size="19" fill="var(--muted)">한참 뒤에야 다시 반응</text>
</svg>`;

  const FIG_CANVAS = `<svg viewBox="0 0 1280 440" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="60" y="60" width="520" height="320" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="60" y="48" font-size="19" fill="var(--danger)">(0,0)</text>
  <line x1="60" y1="60" x2="240" y2="60" stroke="var(--danger)" stroke-width="3"/><text x="150" y="48" text-anchor="middle" font-size="18" fill="var(--danger)">x →</text>
  <line x1="60" y1="60" x2="60" y2="200" stroke="var(--danger)" stroke-width="3"/><text x="30" y="140" font-size="18" fill="var(--danger)">y ↓</text>
  <rect x="140" y="120" width="160" height="90" fill="var(--accent)" opacity="0.35" stroke="var(--fg)" stroke-width="2"/>
  <text x="220" y="172" text-anchor="middle" font-size="18" fill="var(--fg)">rectangle</text>
  <text x="145" y="112" font-size="16" fill="var(--muted)">(80,60)</text><text x="255" y="228" font-size="16" fill="var(--muted)">(240,150)</text>
  <ellipse cx="430" cy="160" rx="80" ry="55" fill="var(--ok)" opacity="0.35" stroke="var(--fg)" stroke-width="2"/>
  <text x="430" y="168" text-anchor="middle" font-size="18" fill="var(--fg)">oval</text>
  <line x1="120" y1="300" x2="500" y2="300" stroke="var(--accent2)" stroke-width="4"/><text x="310" y="290" text-anchor="middle" font-size="18" fill="var(--fg)">line</text>
  <text x="310" y="350" text-anchor="middle" font-size="20" fill="var(--fg)">create_text</text>
  <text x="630" y="95" font-size="21" font-family="monospace" fill="var(--ok)">create_rectangle(80, 60, 240, 150,</text>
  <text x="630" y="127" font-size="21" font-family="monospace" fill="var(--ok)">      fill = "skyblue", tags = "box")</text>
  <text x="630" y="175" font-size="20" fill="var(--fg)">도형은 <tspan font-weight="bold">위젯이 아니라 그림</tspan> — 번호(ID)로 다룬다</text>
  <text x="630" y="215" font-size="20" fill="var(--fg)"><tspan font-family="monospace" fill="var(--accent2)">tags</tspan> 로 이름을 붙이면 여러 도형을 한꺼번에</text>
  <text x="630" y="265" font-size="20" font-family="monospace" fill="var(--accent2)">canvas.move("box", 10, 0)</text>
  <text x="630" y="297" font-size="20" font-family="monospace" fill="var(--accent2)">canvas.coords(id, x1, y1, x2, y2)</text>
  <text x="630" y="329" font-size="20" font-family="monospace" fill="var(--accent2)">canvas.itemconfig("box", fill = "red")</text>
  <text x="630" y="361" font-size="20" font-family="monospace" fill="var(--accent2)">canvas.delete("box")  ·  delete(ALL)</text>
  <text x="630" y="405" font-size="19" fill="var(--muted)">tag_bind("box", "&lt;Button-1&gt;", 함수) — 도형마다 클릭 처리</text>
</svg>`;

  const FIG_MODAL = `<svg viewBox="0 0 1280 400" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <defs>${ARROW('c10arM', 'var(--accent)')}</defs>
  ${WIN(60, 50, 480, 300, '메인 창 (Tk)', `<rect x="60" y="88" width="480" height="262" fill="var(--muted)" opacity="0.25"/>
  <text x="300" y="300" text-anchor="middle" font-size="20" fill="var(--muted)">대화상자가 닫힐 때까지 잠김 (grab_set)</text>`)}
  ${WIN(240, 150, 380, 180, '설정 (Toplevel)', `${BTN(290, 250, 120, 42, '확인', 'var(--ok)')}${BTN(440, 250, 120, 42, '취소', 'var(--danger)')}
  <text x="270" y="228" font-size="19" fill="var(--fg)">이름 : [ 홍길동        ]</text>`)}
  <line x1="660" y1="150" x2="740" y2="150" stroke="var(--accent)" stroke-width="3" marker-end="url(#c10arM)"/>
  <text x="760" y="90" font-size="22" font-weight="bold" fill="var(--fg)">모달(modal) 대화상자 만들기</text>
  <text x="760" y="135" font-size="20" font-family="monospace" fill="var(--accent2)">dlg = Toplevel(window)</text>
  <text x="760" y="167" font-size="20" font-family="monospace" fill="var(--accent2)">dlg.transient(window)</text>
  <text x="760" y="199" font-size="20" font-family="monospace" fill="var(--accent2)">dlg.grab_set()</text>
  <text x="760" y="231" font-size="20" font-family="monospace" fill="var(--accent2)">window.wait_window(dlg)</text>
  <text x="760" y="281" font-size="19" fill="var(--muted)">Toplevel = 두 번째 창 (Tk 는 한 번만!)</text>
  <text x="760" y="313" font-size="19" fill="var(--muted)">결과는 리스트 · 딕셔너리 · 속성에 담아 전달</text>
  <text x="760" y="345" font-size="19" fill="var(--muted)">wait_window 는 창이 닫힐 때까지 기다린다</text>
</svg>`;

  const FIG_APP = `<svg viewBox="0 0 1280 420" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <defs>${ARROW('c10arN', 'var(--fg)')}</defs>
  ${[['① 만들기', 'Label(...) · Button(...)', 'var(--accent)', 60], ['② 배치하기', 'pack · grid · place', 'var(--accent2)', 460], ['③ 동작하기', 'def onClick() : …', 'var(--ok)', 860]].map(([t, s, c, x]) => `<rect x="${x}" y="70" width="360" height="150" rx="14" fill="var(--card)" stroke="${c}" stroke-width="3"/>
  <text x="${+x + 180}" y="120" text-anchor="middle" font-size="24" font-weight="bold" fill="${c}">${t}</text>
  <text x="${+x + 180}" y="165" text-anchor="middle" font-size="20" font-family="monospace" fill="var(--fg)">${s}</text>`).join('')}
  <line x1="430" y1="145" x2="450" y2="145" stroke="var(--fg)" stroke-width="3" marker-end="url(#c10arN)"/>
  <line x1="830" y1="145" x2="850" y2="145" stroke="var(--fg)" stroke-width="3" marker-end="url(#c10arN)"/>
  <text x="640" y="285" text-anchor="middle" font-size="22" fill="var(--fg)">세 가지를 <tspan font-weight="bold">섞어 쓰지 말고 구역을 나눠</tspan> 쓰면 코드가 한눈에 들어온다</text>
  <text x="640" y="330" text-anchor="middle" font-size="20" fill="var(--muted)">위젯이 많아지면 구역을 함수로 (createWidgets · layout · 콜백들)</text>
  <text x="640" y="370" text-anchor="middle" font-size="20" fill="var(--muted)">더 커지면 클래스로 — 전역 변수 대신 <tspan font-family="monospace" fill="var(--accent2)">self.num</tspan> 에 상태를 보관</text>
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
    subtitle: 'tkinter 위젯 · 배치 · 이벤트 · Canvas · 메뉴 · 대화상자',
    summary: 'tkinter 로 창(윈도)을 만들고 레이블 · 버튼 · 체크버튼 · 라디오버튼 · 입력칸을 pack · grid · place 로 배치한 뒤, 마우스 · 키보드 이벤트와 Canvas · 메뉴 · 대화상자를 다뤄 사진 앨범과 명화 감상 프로그램을 완성합니다. 여기에 계산기 · 스톱워치 · 그림판 · 할 일 목록 미니 프로젝트로 이벤트 기반 프로그램의 구조(상태 · 화면 · 콜백)를 몸에 익힙니다.',
    goals: [
      '윈도 프로그래밍(GUI)의 개념과 tkinter 프로그램의 기본 구조(Tk → 위젯 → 배치 → mainloop)를 설명할 수 있다',
      '레이블 · 버튼 · 체크버튼 · 라디오버튼 위젯을 만들고 command 로 함수를 연결할 수 있다',
      'pack() 의 side · fill · padx · ipadx 옵션과 place() 로 위젯을 원하는 위치에 배치할 수 있다',
      'bind() 로 마우스 · 키보드 이벤트를 처리하고 event 객체의 정보를 활용할 수 있다',
      '메뉴와 대화상자(askinteger · askopenfilename)를 이용해 사진 앨범 · 명화 감상 프로그램을 완성할 수 있다',
      '이벤트 기반 프로그램의 구조(상태 · 화면 · 콜백)를 이해하고 after() 로 타이머 · 애니메이션을 만들 수 있다',
      'grid() 로 줄 맞춘 화면을 만들고 pack · grid · place 중 알맞은 배치 방법을 고를 수 있다',
      'Entry 입력 검증 · StringVar · Canvas · Toplevel 모달 창 · 설정 파일 저장까지 갖춘 작은 앱을 만들 수 있다'
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
          'PhotoImage 로 GIF 그림을 읽어 레이블에 표시할 수 있다',
          '이벤트 기반 프로그램이 상태 · 화면 · 콜백으로 이루어진다는 것을 설명할 수 있다',
          'after() 로 일정 시간 뒤에 실행할 함수를 예약하고, time.sleep() 을 쓰면 안 되는 이유를 말할 수 있다'
        ],
        flow: [['도입: 만들 프로그램 미리 보기', 5], ['GUI 와 tkinter · 기본 창 · mainloop', 12], ['레이블 옵션과 꾸미기', 12], ['그림 레이블 · SELF STUDY 10-1', 10], ['📘 이벤트 구조 · after()', 8], ['정리 · 퀴즈', 3]],
        content: [
          { type: 'h', text: '이 장에서 만들 프로그램' },
          { type: 'p', html: '지금까지 만든 프로그램은 모두 <b>콘솔(검은 글자 화면)</b>에서 글자로 입력받고 글자로 출력했습니다. 하지만 우리가 매일 쓰는 프로그램은 창(윈도)이 뜨고, 버튼을 누르고, 메뉴를 고르는 방식입니다. 이번 장에서는 파이썬에 기본으로 들어 있는 <b>tkinter</b> 모듈로 이런 <b>윈도 프로그램</b>을 만들어 봅니다. 장을 마치면 다음 두 프로그램을 직접 완성합니다.' },
          { type: 'figure', html: FIG_PROGRAMS, caption: '[프로그램 1] 이전/다음 버튼으로 사진을 넘기는 사진 앨범, [프로그램 2] 메뉴에서 그림 파일을 골라 보여 주는 명화 감상' },
          { type: 'list', items: [
            '<b>[프로그램 1] 사진 앨범</b> — <code>&lt;&lt; 이전</code> · <code>다음 &gt;&gt;</code> 버튼을 누르면 제주 풍경 사진 9장이 차례로 바뀝니다. (4교시)',
            '<b>[프로그램 2] 명화 감상</b> — [파일] 메뉴의 [파일 열기]를 고르면 파일 선택 대화상자가 열리고, 고른 그림이 창에 나타납니다. (6교시)'
          ] },
          { type: 'table', head: ['교시', '내용', '핵심 코드'], rows: [
            ['1교시', '윈도 프로그래밍의 시작과 레이블 · 이벤트 구조', '<code>Tk()</code>, <code>Label</code>, <code>PhotoImage</code>, <code>after()</code>'],
            ['2교시', '버튼 · 체크버튼 · 라디오버튼 · 입력 검증', '<code>Button</code>, <code>command</code>, <code>IntVar</code>, <code>Entry</code>, <code>lambda</code>'],
            ['3교시', 'pack() 과 grid() 로 위젯 배치하기 · 🚀 계산기', '<code>side</code>, <code>fill</code>, <code>grid</code>, <code>sticky</code>'],
            ['4교시', 'place() 와 [프로그램 1] 사진 앨범 · 🚀 스톱워치', '<code>place(x, y)</code>, <code>global</code>, <code>after_cancel</code>'],
            ['5교시', '마우스 · 키보드 이벤트와 Canvas · 🚀 그림판', '<code>bind()</code>, <code>event</code>, <code>Canvas</code>'],
            ['6교시', '메뉴 · 대화상자 · [프로그램 2] 명화 감상 · 🚀 할 일 목록', '<code>Menu</code>, <code>askopenfilename</code>, <code>Toplevel</code>, <code>json</code>']
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

window.mainloop()`, desc: 'Pillow 는 그림을 여는 것 말고도 크기 조절, 회전, 필터 등 다양한 기능을 제공합니다(12장에서 영상 처리를 더 배웁니다). <code>11행</code>처럼 위젯을 만들자마자 <code>.pack()</code> 을 이어 쓰면 변수 없이 한 줄로 배치할 수 있습니다. 다만 나중에 그 위젯을 바꿔야 한다면 변수에 담아 두어야 합니다.' },

          { type: 'h', text: '📘 이벤트 기반 프로그램의 구조 — 상태 · 화면 · 콜백' },
          { type: 'p', html: '윈도 프로그램을 처음 만들면 "어디서부터 어떻게 써야 하지?" 하고 막막합니다. 사실 거의 모든 GUI 프로그램은 <b>세 덩어리</b>로 이루어져 있고, 우리가 할 일은 이 세 덩어리를 준비해 두는 것뿐입니다. 실행 순서를 정하는 일은 <code>mainloop()</code> 가 대신 해 줍니다.' },
          { type: 'list', ordered: true, items: [
            '<b>상태(state)</b> — 프로그램이 기억하는 데이터입니다. 지금 보고 있는 사진 번호, 점수, 할 일 목록 같은 것이죠. 보통 전역 변수나 <code>IntVar</code> · <code>StringVar</code>(2교시), 객체의 속성에 담습니다.',
            '<b>화면(위젯)</b> — 상태를 사람이 볼 수 있게 그려 놓은 것입니다. 레이블의 글자, 버튼의 색, 캔버스의 도형이 모두 상태의 <b>사진</b>일 뿐입니다.',
            '<b>콜백(callback) 함수</b> — 이벤트가 일어났을 때 불리는 함수입니다. 하는 일은 늘 같습니다. <b>① 상태를 바꾸고 ② 바뀐 상태대로 화면을 고쳐 그린다.</b>'
          ] },
          { type: 'figure', html: FIG_EVENTMODEL, caption: '이벤트 기반 프로그램의 세 덩어리 — 콜백이 상태를 바꾸고, 화면은 상태를 따라간다' },
          { type: 'callout', kind: 'more', title: '콘솔 프로그램과 무엇이 다른가', html: '<table><tr><th></th><th>콘솔 프로그램</th><th>윈도(이벤트 기반) 프로그램</th></tr><tr><td>흐름</td><td>내가 정한 순서대로 위 → 아래</td><td>사용자가 만드는 순서대로 (내가 모름)</td></tr><tr><td>입력</td><td><code>input()</code> 에서 멈춰 기다림</td><td>이벤트가 오면 콜백이 불림</td></tr><tr><td>끝</td><td>마지막 줄에 도달하면 끝</td><td>창을 닫아 <code>mainloop()</code> 가 끝날 때</td></tr><tr><td>내가 쓰는 것</td><td>절차(순서)</td><td>상태 + 화면 + 콜백</td></tr></table><p>그래서 GUI 코드에는 <b>"이제 몇 번째 줄이 실행될까"</b> 를 따지는 대신 <b>"이 이벤트가 오면 무엇이 달라져야 하나"</b> 를 생각합니다. 이런 방식을 <b>이벤트 기반(event-driven) 프로그래밍</b>이라고 하며, 웹 · 모바일 앱도 모두 같은 구조입니다.</p>' },

          { type: 'h', text: '📘 mainloop 이 살아 있으니 할 수 있는 일 — after()' },
          { type: 'p', html: '<code>mainloop()</code> 은 그냥 멈춰 있는 것이 아니라 <b>쉬지 않고 돌고 있는 반복문</b>입니다. 그래서 "몇 초 뒤에 이 함수를 불러 줘" 라고 예약할 수도 있습니다. 그 예약 기능이 <code>위젯.after(밀리초, 함수)</code> 입니다. 1000밀리초 = 1초입니다.' },
          { type: 'code', title: '추가 예제. 1초마다 스스로 갱신되는 디지털 시계', code: `from tkinter import *
import time

## 함수 선언 부분 ##
def updateClock() :
    now = time.strftime("%H:%M:%S")       # 현재 시각을 "시:분:초" 문자열로
    clockLabel.configure(text = now)      # 화면 고쳐 그리기
    window.after(1000, updateClock)       # 1초 뒤에 나를 다시 불러 줘

## 메인 코드 부분 ##
window = Tk()
window.title("디지털 시계")
window.geometry("320x140")

clockLabel = Label(window, text = "--:--:--", font = ("Consolas", 36), fg = "navy")
clockLabel.pack(expand = 1)

updateClock()          # 첫 번째 실행 (여기서부터 사슬이 시작됨)
window.mainloop()`, desc: '<code>8행</code>이 핵심입니다. 함수가 <b>자기 자신을 1초 뒤로 다시 예약</b>하므로 시계가 계속 움직입니다. <code>after()</code> 는 예약만 하고 <b>즉시 돌아오기 때문에</b> 그동안에도 창은 클릭 · 이동에 반응합니다. <code>18행</code> 처음 한 번은 직접 불러 주어야 사슬이 시작됩니다.' },
          { type: 'figure', html: FIG_AFTER, caption: 'after() 는 "예약"이라 창이 멈추지 않는다 — time.sleep() 은 창을 얼린다' },
          { type: 'callout', kind: 'warn', title: 'GUI 에서 time.sleep() 을 쓰면 창이 얼어붙습니다', html: '<p>콘솔 프로그램에서 쓰던 <code>time.sleep(1)</code> 을 콜백 안에서 쓰면, 그 1초 동안 <b>mainloop 이 멈춥니다.</b> 창은 하얗게 굳고 버튼도 눌리지 않으며, 심하면 운영체제가 "응답 없음" 이라고 표시합니다. GUI 에서 시간을 다룰 때는 <b>언제나 <code>after()</code></b> 를 씁니다. 같은 이유로 콜백 안에 오래 걸리는 반복문(수억 번 계산, 큰 파일 내려받기)을 넣어서도 안 됩니다.</p>' },

          { type: 'h', text: '📘 GUI 코드를 읽기 쉽게 나누는 법' },
          { type: 'p', html: '위젯이 서너 개만 넘어가도 코드가 금세 뒤죽박죽이 됩니다. 만들고 · 배치하고 · 동작하는 코드를 <b>구역으로 나누어</b> 쓰는 습관을 들이면, 나중에 고칠 곳을 훨씬 빨리 찾을 수 있습니다. 교재가 <code>## 함수 선언 부분 ##</code>, <code>## 메인 코드 부분 ##</code> 주석을 붙이는 것도 같은 이유입니다.' },
          { type: 'figure', html: FIG_APP, caption: '① 만들기 → ② 배치하기 → ③ 동작하기(콜백) 로 구역을 나눈다' },
          { type: 'code', title: '추가 예제. 구역을 나눠 쓴 레이블 화면 (relief · wraplength)', code: `from tkinter import *

## 전역 변수 · 상태 ##
TITLE = "오늘의 안내문"
BODY = "여백과 테두리를 조절하면 같은 레이블도 훨씬 보기 좋아집니다. 긴 글은 wraplength 로 줄을 바꿉니다."

## 위젯 만들기 ##
window = Tk()
window.title("레이블 꾸미기")
window.geometry("340x260")

titleLabel = Label(window, text = TITLE, font = ("맑은 고딕", 18, "bold"), fg = "white", bg = "navy")
bodyLabel = Label(window, text = BODY, wraplength = 280, justify = LEFT,
                  relief = "groove", bd = 3, padx = 10, pady = 10)
footLabel = Label(window, text = "— 파이썬 교실 —", fg = "gray")

## 배치하기 ##
titleLabel.pack(fill = X, ipady = 8)
bodyLabel.pack(padx = 12, pady = 12)
footLabel.pack(side = BOTTOM, pady = 6)

window.mainloop()`, desc: '위젯을 <b>모두 만든 뒤에</b> 한꺼번에 배치했습니다. 이렇게 하면 "어떤 위젯이 있는지" 와 "어디에 놓이는지" 를 따로따로 읽을 수 있습니다. <code>relief</code> 는 테두리 모양(<code>flat</code> · <code>raised</code> · <code>sunken</code> · <code>groove</code> · <code>ridge</code> · <code>solid</code>), <code>bd</code> 는 테두리 두께, <code>wraplength</code> 는 몇 픽셀에서 줄을 바꿀지, <code>justify</code> 는 여러 줄 글자의 정렬입니다.' },
          { type: 'table', head: ['옵션', '뜻', '값의 예'], rows: [
            ['<code>relief</code>', '테두리 모양', '<code>flat</code>(기본) · <code>raised</code> · <code>sunken</code> · <code>groove</code> · <code>ridge</code> · <code>solid</code>'],
            ['<code>bd</code> (borderwidth)', '테두리 두께(픽셀)', '<code>bd=3</code>'],
            ['<code>padx</code> · <code>pady</code> (위젯 옵션)', '글자와 테두리 사이 여백', '<code>padx=10</code>'],
            ['<code>wraplength</code>', '이 폭을 넘으면 줄 바꿈(픽셀)', '<code>wraplength=280</code>'],
            ['<code>justify</code>', '여러 줄 글자의 정렬', '<code>LEFT</code> · <code>CENTER</code> · <code>RIGHT</code>'],
            ['<code>font=(이름, 크기, 스타일)</code>', '글꼴 · 크기 · 굵게/기울임', '<code>("맑은 고딕", 18, "bold")</code>']
          ], caption: '레이블을 보기 좋게 만드는 옵션 (버튼 · 체크버튼에도 대부분 쓸 수 있음)' },
          { type: 'callout', kind: 'more', title: '내 PC 에서 IDLE 로 실습하려면', html: '<p>집에서는 <b>python.org</b> 에서 파이썬을 설치하면 IDLE 과 tkinter 가 함께 설치됩니다. IDLE 에서 <code>File → New File</code> 로 새 파일을 만들고 코드를 쓴 뒤 <b>F5</b>(이 강좌에서는 <b>Ctrl+Enter</b>)로 실행하면 같은 창이 뜹니다. 단, 그림 파일 경로는 내 PC 의 실제 경로(<code>"C:/CookPython/GIF/dog.gif"</code>)로 바꿔야 하고, <code>mainloop()</code> 을 빠뜨리면 창이 뜨지 않으니 주의하세요. 리눅스에서는 <code>sudo apt install python3-tk</code> 가 필요할 수 있습니다.</p>' }
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
          },
          {
            title: '실습 10-2. 레이블 옵션 실험실',
            level: 1,
            desc: '<p>테두리 모양 6가지(<code>flat</code>, <code>raised</code>, <code>sunken</code>, <code>groove</code>, <code>ridge</code>, <code>solid</code>)를 한눈에 비교하는 창을 만드세요.</p><ul><li>레이블마다 글자는 그 모양 이름, <code>relief</code> 는 그 모양, <code>bd = 4</code>, <code>width = 20</code>, <code>pady = 6</code></li><li>세로로 쌓고 레이블 사이에 위아래 여백 4픽셀</li><li>창 제목은 <code>relief 비교</code></li></ul>',
            hint: '이름 6개를 리스트에 담고 for 문으로 만듭니다. <code>Label(window, text = r, relief = r, ...)</code> 처럼 <b>같은 값</b>을 글자와 옵션에 함께 쓸 수 있습니다.',
            starter: `from tkinter import *
window = Tk()
window.title("relief 비교")

reliefs = ["flat", "raised", "sunken", "groove", "ridge", "solid"]

# TODO: for 문으로 레이블 6개를 만들고 pack(pady = 4)

window.mainloop()
`,
            solution: `from tkinter import *
window = Tk()
window.title("relief 비교")

reliefs = ["flat", "raised", "sunken", "groove", "ridge", "solid"]

for r in reliefs :
    label = Label(window, text = r, relief = r, bd = 4, width = 20, pady = 6)
    label.pack(pady = 4)

window.mainloop()
`
          },
          {
            title: '실습 10-3. 날짜까지 보여 주는 시계',
            level: 2,
            desc: '<p>본문의 디지털 시계를 고쳐 다음 세 줄이 <b>1초마다</b> 갱신되게 하세요.</p><ol><li>날짜 — <code>2026년 09월 23일</code> (글꼴 크기 14)</li><li>시각 — <code>14:05:33</code> (글꼴 크기 36, 파란색)</li><li>오전/오후 — 시(hour)가 12보다 작으면 <code>오전</code>, 아니면 <code>오후</code></li></ol>',
            hint: '<code>time.strftime("%Y년 %m월 %d일")</code>, <code>time.strftime("%H:%M:%S")</code>. 시만 정수로 얻으려면 <code>int(time.strftime("%H"))</code> 입니다. 갱신 함수 하나에서 레이블 3개를 모두 바꾸고 마지막에 <code>window.after(1000, 함수이름)</code> 으로 다시 예약합니다.',
            starter: `from tkinter import *
import time

def updateClock() :
    # TODO: 세 레이블의 글자를 모두 갱신하고 1초 뒤 다시 예약
    pass

window = Tk()
window.title("날짜 시계")
window.geometry("360x200")

dateLabel = Label(window, text = "", font = ("맑은 고딕", 14))
timeLabel = Label(window, text = "", font = ("Consolas", 36), fg = "blue")
ampmLabel = Label(window, text = "", font = ("맑은 고딕", 14))

dateLabel.pack(pady = 6)
timeLabel.pack()
ampmLabel.pack(pady = 6)

updateClock()
window.mainloop()
`,
            solution: `from tkinter import *
import time

def updateClock() :
    dateLabel.configure(text = time.strftime("%Y년 %m월 %d일"))
    timeLabel.configure(text = time.strftime("%H:%M:%S"))
    hour = int(time.strftime("%H"))
    if hour < 12 :
        ampmLabel.configure(text = "오전")
    else :
        ampmLabel.configure(text = "오후")
    window.after(1000, updateClock)

window = Tk()
window.title("날짜 시계")
window.geometry("360x200")

dateLabel = Label(window, text = "", font = ("맑은 고딕", 14))
timeLabel = Label(window, text = "", font = ("Consolas", 36), fg = "blue")
ampmLabel = Label(window, text = "", font = ("맑은 고딕", 14))

dateLabel.pack(pady = 6)
timeLabel.pack()
ampmLabel.pack(pady = 6)

updateClock()
window.mainloop()
`
          },
          {
            title: '실습 10-4. 저절로 넘어가는 사진 액자',
            level: 2,
            desc: '<p>제주 사진 9장(<code>GIF/jeju1.gif</code> ~ <code>jeju9.gif</code>)이 <b>2초마다</b> 저절로 바뀌는 액자를 만드세요.</p><ul><li>사진 아래에 <code>3 / 9 · jeju3.gif</code> 처럼 <b>몇 번째 사진인지와 파일명</b>을 표시합니다.</li><li>마지막 사진 다음에는 다시 첫 사진으로 돌아갑니다.</li></ul>',
            hint: '현재 번호를 전역 변수 <code>num</code> 에 두고, 갱신 함수에서 <code>num = (num + 1) % 9</code> 로 다음 번호를 구합니다. 함수 안에서 전역 변수를 바꾸려면 <code>global num</code> 이 필요합니다. 새 그림은 <code>photo = PhotoImage(file = ...)</code> → <code>pLabel.configure(image = photo)</code> → <code>pLabel.image = photo</code> 순서로 바꿉니다.',
            starter: `from tkinter import *

fnameList = ["jeju1.gif", "jeju2.gif", "jeju3.gif", "jeju4.gif", "jeju5.gif",
             "jeju6.gif", "jeju7.gif", "jeju8.gif", "jeju9.gif"]
num = 0

def nextPhoto() :
    # TODO: num 을 다음 번호로 바꾸고, 그림과 설명을 갱신한 뒤 2초 뒤 다시 예약
    pass

window = Tk()
window.geometry("700x520")
window.title("사진 액자")

photo = PhotoImage(file = "GIF/" + fnameList[0])
pLabel = Label(window, image = photo)
iLabel = Label(window, text = "1 / 9 · " + fnameList[0], font = ("맑은 고딕", 12))
pLabel.pack()
iLabel.pack(pady = 6)

window.after(2000, nextPhoto)
window.mainloop()
`,
            solution: `from tkinter import *

fnameList = ["jeju1.gif", "jeju2.gif", "jeju3.gif", "jeju4.gif", "jeju5.gif",
             "jeju6.gif", "jeju7.gif", "jeju8.gif", "jeju9.gif"]
num = 0

def nextPhoto() :
    global num
    num = (num + 1) % 9
    photo = PhotoImage(file = "GIF/" + fnameList[num])
    pLabel.configure(image = photo)
    pLabel.image = photo
    iLabel.configure(text = str(num + 1) + " / 9 · " + fnameList[num])
    window.after(2000, nextPhoto)

window = Tk()
window.geometry("700x520")
window.title("사진 액자")

photo = PhotoImage(file = "GIF/" + fnameList[0])
pLabel = Label(window, image = photo)
iLabel = Label(window, text = "1 / 9 · " + fnameList[0], font = ("맑은 고딕", 12))
pLabel.pack()
iLabel.pack(pady = 6)

window.after(2000, nextPhoto)
window.mainloop()
`
          },
          {
            title: '실습 10-5. 발사 카운트다운',
            level: 3,
            desc: '<p><b>10</b> 부터 1초마다 1씩 줄어드는 카운트다운 화면을 만드세요.</p><ul><li>숫자는 글꼴 크기 60 으로 크게 표시합니다.</li><li>숫자가 <b>5 이하</b>가 되면 글자색을 <code>red</code> 로 바꿉니다(그 전에는 <code>navy</code>).</li><li>0 이 되면 글자를 <code>발사!</code> 로 바꾸고, <b>더 이상 예약하지 않습니다</b>(계속 도는 일이 없어야 합니다).</li><li>아래 레이블에 <code>남은 시간 : N초</code> 를 함께 표시합니다.</li></ul>',
            hint: '남은 시간을 전역 변수 <code>left</code> 에 두고, 갱신 함수 끝에서 <code>if left &gt; 0 : window.after(1000, tick)</code> 처럼 <b>조건이 맞을 때만</b> 다시 예약합니다. 글자색은 <code>configure(fg = "red")</code> 로 바꿉니다.',
            starter: `from tkinter import *

left = 10

def tick() :
    # TODO: 숫자 표시 · 색 바꾸기 · left 줄이기 · 0 보다 크면 다시 예약
    pass

window = Tk()
window.geometry("360x260")
window.title("카운트다운")

numLabel = Label(window, text = "10", font = ("맑은 고딕", 60), fg = "navy")
msgLabel = Label(window, text = "남은 시간 : 10초", font = ("맑은 고딕", 14))
numLabel.pack(expand = 1)
msgLabel.pack(pady = 10)

tick()
window.mainloop()
`,
            solution: `from tkinter import *

left = 10

def tick() :
    global left
    if left > 0 :
        numLabel.configure(text = str(left))
        msgLabel.configure(text = "남은 시간 : " + str(left) + "초")
        if left <= 5 :
            numLabel.configure(fg = "red")
        else :
            numLabel.configure(fg = "navy")
        left -= 1
        window.after(1000, tick)
    else :
        numLabel.configure(text = "발사!", fg = "red")
        msgLabel.configure(text = "남은 시간 : 0초")

window = Tk()
window.geometry("360x260")
window.title("카운트다운")

numLabel = Label(window, text = "10", font = ("맑은 고딕", 60), fg = "navy")
msgLabel = Label(window, text = "남은 시간 : 10초", font = ("맑은 고딕", 14))
numLabel.pack(expand = 1)
msgLabel.pack(pady = 10)

tick()
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
          { q: '다음 중 tkinter 의 <code>PhotoImage(file=…)</code> 로 <b>직접 읽을 수 없는</b> 형식은?', options: ['GIF', 'PNG (Tk 8.6 이상)', 'JPG', '모두 읽을 수 있다'], answer: 2,
            explain: 'PhotoImage 는 GIF(와 Tk 8.6 부터 PNG)를 읽습니다. JPG 는 Pillow 의 <code>ImageTk.PhotoImage</code> 를 이용합니다.' },
          { q: '1초마다 레이블의 글자를 바꾸려고 합니다. 콜백 함수 안에 넣을 코드로 <b>알맞은</b> 것은?', options: ['<code>time.sleep(1)</code> 을 넣고 while 로 반복한다', '<code>window.after(1000, 함수이름)</code> 으로 자기 자신을 다시 예약한다', '<code>window.mainloop()</code> 을 한 번 더 부른다', '<code>for i in range(1000000) : pass</code> 로 시간을 끈다'], answer: 1,
            explain: '<code>after()</code> 는 예약만 하고 즉시 돌아오므로 창이 계속 반응합니다. 콜백 안의 <code>sleep</code> 이나 긴 반복문은 mainloop 을 멈춰 창을 얼립니다.' },
          { q: '다음 코드에서 <b>잘못된 곳</b>은?<pre><code>from tkinter import *\nwindow = Tk()\nlabel1 = Label(window, text = "안녕")\nwindow.mainloop()\nlabel1.pack()</code></pre>', options: ['Label 에 text 옵션을 쓸 수 없다', 'pack() 이 mainloop() 뒤에 있어 창에 나타나지 않는다', 'Tk() 를 두 번 불러야 한다', '틀린 곳이 없다'], answer: 1,
            explain: '<code>mainloop()</code> 은 창이 닫힐 때까지 돌아오지 않으므로 그 <b>뒤에</b> 쓴 코드는 창이 떠 있는 동안 실행되지 않습니다. 화면 구성 코드는 모두 mainloop() <b>앞</b>에 두어야 합니다.' }
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
          { layout: 'diagram', title: '📘 이벤트 기반 프로그램의 세 덩어리', html: FIG_EVENTMODEL, caption: '상태를 바꾸는 콜백 · 상태를 비추는 화면',
            notes: '<p>강의자료에 없는 보충이지만, 10장 전체를 꿰는 뼈대입니다. 4교시 사진 앨범(<code>num</code> = 상태, <code>pLabel</code> = 화면, <code>clickNext</code> = 콜백)을 미리 예로 들면 좋습니다.</p><p><b>발문</b>: "화면에 보이는 사진을 바꾸려면 무엇을 먼저 바꿔야 할까요?" → 상태(num).</p><p>시간: 4분</p>' },
          { layout: 'code', title: '📘 after() — 1초마다 갱신되는 시계', code: `from tkinter import *
import time

def updateClock() :
    clockLabel.configure(text = time.strftime("%H:%M:%S"))
    window.after(1000, updateClock)      # 1초 뒤 다시 나를 불러 줘

window = Tk()
window.title("디지털 시계")
window.geometry("320x140")

clockLabel = Label(window, text = "--:--:--", font = ("Consolas", 36), fg = "navy")
clockLabel.pack(expand = 1)

updateClock()        # 첫 번째 실행 — 여기서 사슬이 시작
window.mainloop()`,
            points: ['<code>after(밀리초, 함수)</code>: 예약하고 즉시 돌아옴', '함수가 자기 자신을 다시 예약 → 반복', '처음 한 번은 직접 호출해야 시작됨'],
            notes: '<p>mainloop 이 "살아 있는 반복문" 이라는 증거를 눈으로 보여 주는 예제입니다. <code>window.after(1000, updateClock)</code> 줄을 지우고 실행하면 시계가 한 번만 표시되고 멈추는 것을 보여 주세요.</p><p><b>주의</b>: <code>after(1000, updateClock())</code> 처럼 괄호를 붙이면 무한 재귀로 RecursionError 가 납니다(command 와 같은 규칙).</p><p>시간: 5분</p>' },
          { layout: 'diagram', title: 'after() vs time.sleep()', html: FIG_AFTER, caption: '예약은 창을 멈추지 않는다 · sleep 은 창을 얼린다',
            notes: '<p>학생들이 가장 많이 하는 실수입니다. 콜백 안에 <code>time.sleep(3)</code> 을 넣고 실행해 창이 3초간 굳는 모습을 직접 보여 주면 확실히 기억합니다.</p><p>시간: 3분</p>' },
          { layout: 'diagram', title: '📘 코드를 세 구역으로 나누기', html: FIG_APP, caption: '만들기 → 배치하기 → 동작하기 (relief · wraplength 등 꾸미기 옵션도 ① 구역에)',
            notes: '<p>교재의 <code>## 함수 선언 부분 ##</code> · <code>## 메인 코드 부분 ##</code> 주석이 왜 있는지 설명합니다. 위젯을 만들자마자 <code>.pack()</code> 을 이어 붙이면 짧지만, 나중에 그 위젯을 바꿀 수 없다는 단점도 함께 짚습니다.</p><p>시간: 3분</p>' },
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
          'Radiobutton 여러 개를 하나의 변수로 묶어 하나만 선택하게 하고, configure() 로 위젯 내용을 바꿀 수 있다',
          'command = lambda n = 값 : 함수(n) 형태로 버튼마다 다른 값을 넘기고, 클로저 함정을 피할 수 있다',
          'Entry 로 입력받은 값을 검증하고 오류를 화면에 친절하게 알려 줄 수 있다',
          'StringVar 와 textvariable 로 위젯과 데이터를 묶고, state 로 위젯을 켜고 끌 수 있다'
        ],
        flow: [['복습 · 도입', 3], ['버튼과 command · 메시지 창', 10], ['체크버튼 · 라디오버튼', 14], ['📘 lambda 로 값 넘기기', 8], ['📘 Entry 입력 검증 · StringVar', 10], ['정리 · 퀴즈', 5]],
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

window.mainloop()`, desc: 'value 에 문자열을 쓰려면 <code>StringVar()</code> 를 사용합니다. <code>10행</code>처럼 <code>set()</code> 으로 처음에 선택되어 있을 값을 정할 수 있습니다. 반복문으로 라디오버튼을 만들었기 때문에 항목을 추가하기도 쉽습니다.' },

          { type: 'h', text: '📘 command 에 값을 함께 넘기기 — lambda' },
          { type: 'p', html: '<code>command</code> 에는 함수 <b>이름</b>만 넘길 수 있어서, "이 버튼은 빨강, 저 버튼은 파랑" 처럼 <b>버튼마다 다른 값</b>을 전달할 수 없습니다. 이럴 때 쓰는 것이 이름 없는 짧은 함수, <b>lambda(람다)</b> 입니다. <code>lambda : setColor("red")</code> 는 "불리면 <code>setColor(\'red\')</code> 를 실행하는 함수" 라는 뜻입니다.' },
          { type: 'code', title: '추가 예제. lambda 로 버튼마다 다른 값 넘기기', code: `from tkinter import *

## 함수 선언 부분 ##
def setColor(c) :
    window.configure(bg = c)
    label1.configure(text = "배경색 : " + c, bg = c)

## 메인 코드 부분 ##
window = Tk()
window.title("색 고르기")
window.geometry("360x150")

label1 = Label(window, text = "배경색 : white", font = ("맑은 고딕", 14))
label1.pack(pady = 10)

colors = ["tomato", "skyblue", "lightgreen", "gold"]
for c in colors :
    btn = Button(window, text = c, bg = c, width = 10,
                 command = lambda name = c : setColor(name))
    btn.pack(side = LEFT, padx = 4, pady = 10)

window.mainloop()`, desc: '<code>19행</code>의 <code>name = c</code> 가 중요합니다. lambda 안에서 반복 변수 <code>c</code> 를 그대로 쓰면 <b>버튼 4개가 모두 마지막 색</b>이 됩니다. 왜 그런지는 아래에서 설명합니다.' },
          { type: 'figure', html: FIG_LAMBDA, caption: '반복문 안에서 만든 lambda 의 함정과 해결법 — 기본 인수로 지금의 값을 복사한다' },
          { type: 'callout', kind: 'more', title: '왜 마지막 값만 전달될까? — 늦게 찾아보기(late binding)', html: '<p>파이썬의 함수는 안에서 쓰는 이름(<code>c</code>)의 <b>값을 미리 복사해 두지 않습니다.</b> 함수가 <b>실제로 불릴 때</b> 그 이름을 찾아봅니다. 버튼을 클릭하는 시점은 for 문이 다 끝난 뒤이므로, 그때 <code>c</code> 는 이미 마지막 색(<code>"gold"</code>)입니다. 그래서 어느 버튼을 눌러도 gold 가 됩니다.</p><p><b>해결법</b> — 만드는 순간의 값을 <b>기본 인수</b>에 복사해 둡니다. 기본 인수는 함수를 <b>정의할 때</b> 딱 한 번 계산되기 때문입니다.</p><pre><code>command = lambda name = c : setColor(name)</code></pre><p>같은 일을 하는 다른 방법도 있습니다. <code>from functools import partial</code> 후 <code>command = partial(setColor, c)</code>, 또는 값을 위젯에 저장해 두고(<code>btn.color = c</code>) 이벤트 처리 함수에서 <code>event.widget.color</code> 로 꺼내 쓰는 방법입니다. 이 함정은 for 문 안에서 콜백을 만들 때마다 나타나므로 꼭 기억해 두세요.</p>' },
          { type: 'callout', kind: 'warn', title: 'lambda 를 언제 쓰고 언제 쓰지 말까', html: 'lambda 안에는 <b>식 하나</b>만 쓸 수 있습니다(<code>if</code> 문, <code>for</code> 문, 여러 줄 금지). 값을 넘기거나 한 줄짜리 호출을 연결할 때만 쓰고, 하는 일이 두 줄 이상이면 <b>보통의 def 함수</b>를 만들어 <code>command = 함수이름</code> 으로 연결하세요. 읽기 쉬운 코드가 언제나 이깁니다.' },

          { type: 'h', text: '📘 Entry 로 글자 입력받기와 입력 검증' },
          { type: 'p', html: '<b>Entry</b> 는 한 줄 입력칸입니다. 콘솔의 <code>input()</code> 에 해당합니다. 입력된 글자는 <code>entry.get()</code> 으로 가져오는데, <b>언제나 문자열</b>이므로 숫자로 쓰려면 <code>int()</code> · <code>float()</code> 로 바꿔야 합니다. 이때 사용자가 숫자가 아닌 것을 넣을 수 있으므로 <b>검사(검증)</b>가 필요합니다.' },
          { type: 'code', title: '추가 예제. BMI 계산기 — 입력 검증과 오류 메시지', code: `from tkinter import *

## 함수 선언 부분 ##
def calcBmi() :
    try :
        h = float(entHeight.get()) / 100      # cm → m
        w = float(entWeight.get())
    except ValueError :
        resultLabel.configure(text = "숫자만 입력하세요!", fg = "red")
        return
    if h <= 0 or w <= 0 :
        resultLabel.configure(text = "0보다 큰 값을 넣으세요!", fg = "red")
        return
    bmi = w / (h * h)
    resultLabel.configure(text = "BMI : " + format(bmi, ".1f"), fg = "navy")

## 메인 코드 부분 ##
window = Tk()
window.title("BMI 계산기")
window.geometry("300x200")

Label(window, text = "키(cm)").pack()
entHeight = Entry(window, width = 10)
entHeight.pack()
Label(window, text = "몸무게(kg)").pack()
entWeight = Entry(window, width = 10)
entWeight.pack()

Button(window, text = "계산하기", command = calcBmi).pack(pady = 8)
resultLabel = Label(window, text = "", font = ("맑은 고딕", 14))
resultLabel.pack()

entHeight.insert(0, "170")      # 처음 보여 줄 값
entWeight.insert(0, "65")

window.mainloop()`, desc: '<code>5~9행</code> <code>try ~ except ValueError</code> 로 "숫자로 바꿀 수 없는 입력" 을 잡아냅니다. GUI 에서는 오류가 나도 프로그램이 죽으면 안 되므로, <b>오류를 잡아 레이블에 빨간 글씨로 알려 주는</b> 것이 좋습니다(<code>messagebox.showwarning()</code> 을 써도 됩니다). <code>11~13행</code> 형식은 맞지만 값이 이상한 경우(0 이하)도 따로 검사합니다. <code>33~34행</code> <code>insert(0, "170")</code> 은 입력칸에 처음부터 글자를 넣어 둡니다. 지울 때는 <code>entry.delete(0, END)</code> 입니다.' },
          { type: 'table', head: ['메서드', '하는 일'], rows: [
            ['<code>entry.get()</code>', '입력된 <b>문자열</b> 가져오기'],
            ['<code>entry.insert(0, "글자")</code>', '0 번(맨 앞) 위치에 글자 넣기'],
            ['<code>entry.delete(0, END)</code>', '입력칸 비우기'],
            ['<code>entry.focus_set()</code>', '커서를 이 입력칸에 두기'],
            ['<code>Entry(window, show = "*")</code>', '비밀번호처럼 별표로 가리기'],
            ['<code>entry.bind("&lt;Return&gt;", 함수)</code>', 'Enter 키로 확인 (5교시)']
          ], caption: 'Entry 의 주요 사용법' },

          { type: 'h', text: '📘 StringVar 로 위젯과 데이터 묶기' },
          { type: 'p', html: '지금까지는 화면을 바꿀 때마다 <code>configure(text = …)</code> 를 불렀습니다. 그런데 같은 값을 여러 위젯이 함께 보여 줘야 한다면 일일이 부르기가 번거롭습니다. <code>StringVar</code> 같은 <b>tkinter 변수</b>에 위젯을 묶어 두면(<code>textvariable</code>), <b>변수만 바꿔도 묶인 위젯이 모두 저절로 바뀝니다.</b>' },
          { type: 'figure', html: FIG_VAR, caption: '한 변수에 여러 위젯을 묶으면 한 곳만 바꿔도 모두 따라 바뀐다' },
          { type: 'code', title: '추가 예제. 입력칸과 레이블을 한 변수로 묶기 (trace_add)', code: `from tkinter import *

## 함수 선언 부분 ##
def onChange(*args) :                    # 값이 바뀔 때마다 자동 호출
    text = nameVar.get()
    countLabel.configure(text = "글자 수 : " + str(len(text)))

## 메인 코드 부분 ##
window = Tk()
window.title("이름 미리 보기")
window.geometry("360x200")

nameVar = StringVar()
nameVar.set("홍길동")

entry1 = Entry(window, textvariable = nameVar, font = ("맑은 고딕", 14))
greetLabel = Label(window, textvariable = nameVar, font = ("맑은 고딕", 20), fg = "navy")
countLabel = Label(window, text = "글자 수 : 3")

entry1.pack(pady = 10)
greetLabel.pack()
countLabel.pack(pady = 6)

nameVar.trace_add("write", onChange)     # 값이 바뀌면 onChange 실행
Button(window, text = "이름 지우기", command = lambda : nameVar.set("")).pack(pady = 8)

window.mainloop()`, desc: '<code>16~17행</code> 입력칸과 레이블을 <b>같은 변수</b>에 묶었습니다. 입력칸에 글자를 치면 레이블이 즉시 따라 바뀝니다. <code>24행</code> <code>trace_add("write", 함수)</code> 는 변수 값이 바뀔 때마다 함수를 불러 줍니다(<code>*args</code> 로 받는 이유는 tkinter 가 변수 정보를 함께 넘기기 때문입니다). <code>25행</code> 버튼은 변수만 비우면 되므로 <code>configure</code> 가 필요 없습니다.' },
          { type: 'table', head: ['방법', '언제 쓰나', '특징'], rows: [
            ['<code>label.configure(text = …)</code>', '한 곳만 바꿀 때', '어디서 바뀌는지 코드로 분명히 보임'],
            ['<code>textvariable = 변수</code>', '여러 위젯이 같은 값을 보일 때', '변수 한 번만 바꾸면 모두 갱신'],
            ['<code>variable = 변수</code>', '체크버튼 · 라디오버튼 · Scale', '사용자 조작이 변수에 자동 반영'],
            ['<code>변수.trace_add("write", 함수)</code>', '값이 바뀔 때 반응해야 할 때', '입력할 때마다 검사 · 미리 보기']
          ], caption: '화면을 갱신하는 두 가지 방법' },

          { type: 'h', text: '📘 위젯 상태를 바꾸기 — state 와 config' },
          { type: 'p', html: '위젯은 만든 뒤에도 옵션을 바꿀 수 있습니다. <code>위젯.config(옵션 = 값)</code> 또는 <code>위젯.configure(…)</code> 는 같은 메서드이고, <code>위젯.cget("옵션")</code> 은 지금 값을 읽어 옵니다. 특히 <code>state</code> 옵션은 위젯을 쓸 수 있는지 없는지를 정합니다.' },
          { type: 'code', title: '추가 예제. 켜고 끄는 버튼과 state', code: `from tkinter import *

## 함수 선언 부분 ##
def toggle() :
    if target["state"] == "normal" :          # 딕셔너리처럼 읽기
        target.config(state = DISABLED, text = "잠김")
        toggleBtn.config(text = "잠금 풀기")
    else :
        target.config(state = NORMAL, text = "눌러 보세요")
        toggleBtn.config(text = "잠그기")

def hello() :
    label1.config(text = "눌렸습니다!", fg = "green")

## 메인 코드 부분 ##
window = Tk()
window.title("state 실험")
window.geometry("300x160")

target = Button(window, text = "눌러 보세요", command = hello, width = 15)
toggleBtn = Button(window, text = "잠그기", command = toggle, width = 15)
label1 = Label(window, text = "대기 중", font = ("맑은 고딕", 12))

target.pack(pady = 6)
toggleBtn.pack(pady = 6)
label1.pack(pady = 6)

window.mainloop()`, desc: '<code>5행</code> <code>위젯["옵션"]</code> 은 <code>cget("옵션")</code> 과 같은 뜻으로, 지금 설정된 값을 읽습니다. <code>state</code> 는 <code>NORMAL</code>(보통) · <code>DISABLED</code>(회색, 반응 없음) · <code>ACTIVE</code>(마우스가 올라간 상태)가 있습니다. 조건이 맞을 때만 누를 수 있는 버튼(약관 동의, 필수 입력)은 이렇게 만듭니다. 값을 <code>"normal"</code> 문자열과 비교한 이유는 <code>NORMAL</code> 상수가 바로 그 문자열이기 때문입니다.' }
        ],
        practice: [
          {
            title: '실습 10-6. 색을 고르는 버튼 4개',
            level: 1,
            desc: '<p>색 이름 4개(<code>tomato</code>, <code>skyblue</code>, <code>lightgreen</code>, <code>gold</code>)로 버튼 4개를 <b>for 문으로</b> 만드세요. 버튼을 누르면 가운데 레이블의 배경색과 글자가 그 색으로 바뀝니다(예: <code>배경색 : gold</code>).</p>',
            hint: 'for 문 안에서 <code>command = lambda name = c : setColor(name)</code> 처럼 <b>기본 인수</b>로 색을 넘깁니다. <code>lambda : setColor(c)</code> 라고 쓰면 네 버튼이 모두 마지막 색이 됩니다.',
            starter: `from tkinter import *

def setColor(c) :
    pass  # TODO: 레이블의 bg 와 text 를 바꾸기

window = Tk()
window.title("색 고르기")
window.geometry("400x150")

label1 = Label(window, text = "배경색 : white", font = ("맑은 고딕", 14), width = 20, height = 3)
label1.pack(pady = 10)

colors = ["tomato", "skyblue", "lightgreen", "gold"]
# TODO: for 문으로 버튼 4개 만들기 (side = LEFT)

window.mainloop()
`,
            solution: `from tkinter import *

def setColor(c) :
    label1.configure(bg = c, text = "배경색 : " + c)

window = Tk()
window.title("색 고르기")
window.geometry("400x150")

label1 = Label(window, text = "배경색 : white", font = ("맑은 고딕", 14), width = 20, height = 3)
label1.pack(pady = 10)

colors = ["tomato", "skyblue", "lightgreen", "gold"]
for c in colors :
    btn = Button(window, text = c, bg = c, width = 9,
                 command = lambda name = c : setColor(name))
    btn.pack(side = LEFT, padx = 3)

window.mainloop()
`
          },
          {
            title: '실습 10-7. 글자 크기 조절기',
            level: 1,
            desc: '<p>가운데에 <code>파이썬 GUI</code> 레이블을 두고, <code>[+] 크게</code> · <code>[-] 작게</code> 버튼으로 글꼴 크기를 <b>2씩</b> 바꾸세요. 크기는 <b>10 이상 40 이하</b>로만 바뀌게 하고, 아래 레이블에 <code>현재 크기 : 20</code> 을 표시합니다.</p>',
            hint: '크기를 전역 변수 <code>size</code> 에 두고 함수 안에서 <code>global size</code> 로 바꿉니다. 글꼴은 <code>label1.configure(font = ("맑은 고딕", size))</code> 처럼 통째로 다시 지정합니다.',
            starter: `from tkinter import *

size = 20

def changeSize(delta) :
    pass  # TODO: size 를 delta 만큼 바꾸고(10~40), 레이블 2개를 갱신

window = Tk()
window.title("글자 크기")
window.geometry("320x200")

label1 = Label(window, text = "파이썬 GUI", font = ("맑은 고딕", size))
infoLabel = Label(window, text = "현재 크기 : 20")

label1.pack(expand = 1)
# TODO: [+] [-] 버튼 만들기 (command = lambda : changeSize(2) …)
infoLabel.pack(pady = 6)

window.mainloop()
`,
            solution: `from tkinter import *

size = 20

def changeSize(delta) :
    global size
    size += delta
    if size < 10 :
        size = 10
    if size > 40 :
        size = 40
    label1.configure(font = ("맑은 고딕", size))
    infoLabel.configure(text = "현재 크기 : " + str(size))

window = Tk()
window.title("글자 크기")
window.geometry("320x200")

label1 = Label(window, text = "파이썬 GUI", font = ("맑은 고딕", size))
infoLabel = Label(window, text = "현재 크기 : 20")

label1.pack(expand = 1)
Button(window, text = "[+] 크게", command = lambda : changeSize(2)).pack(side = LEFT, padx = 20)
Button(window, text = "[-] 작게", command = lambda : changeSize(-2)).pack(side = RIGHT, padx = 20)
infoLabel.pack(pady = 6)

window.mainloop()
`
          },
          {
            title: '실습 10-8. 커피 주문기',
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
            title: '실습 10-9. 약관 동의 후 가입 버튼 켜기',
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
          },
          {
            title: '실습 10-10. 회원 가입 폼 검증하기',
            level: 3,
            desc: '<p>입력칸 · 라디오버튼 · 체크버튼을 모두 써서 <b>가입 폼</b>을 만들고, [가입하기] 를 누르면 아래 규칙대로 검사하세요.</p><ul><li>아이디(Entry) — 비어 있거나 <b>4글자 미만</b>이면 <code>아이디는 4글자 이상이어야 합니다.</code></li><li>나이(Entry) — 숫자가 아니면 <code>나이는 숫자로 입력하세요.</code>, 1~120 이 아니면 <code>나이가 올바르지 않습니다.</code></li><li>성별(Radiobutton: 남 · 여) — 고르지 않았으면 <code>성별을 선택하세요.</code></li><li>약관 동의(Checkbutton) — 체크하지 않았으면 <code>약관에 동의해야 합니다.</code></li><li>문제가 있으면 <b>빨간 글씨 레이블</b>로 첫 번째 문제만 알려 주고 멈춥니다.</li><li>모두 통과하면 <code>messagebox.showinfo</code> 로 <code>파이썬(남, 20세) 님 가입 완료!</code> 처럼 요약을 보여 주고, 레이블을 <code>가입 완료</code>(초록)로 바꿉니다.</li></ul>',
            hint: '검사 순서대로 <code>if 문제 : msgLabel.configure(text = "…", fg = "red") ; return</code> 처럼 <b>일찍 돌아가기</b>(early return)를 쓰면 코드가 깔끔합니다. 숫자 검사는 <code>try : age = int(entAge.get()) except ValueError : …</code>. 라디오버튼은 <code>StringVar()</code> 에 성별 글자를 담고, 고르지 않았으면 빈 문자열입니다.',
            starter: `from tkinter import *
from tkinter import messagebox

## 함수 선언 부분 ##
def join() :
    # TODO: 아이디 · 나이 · 성별 · 약관을 차례로 검사하고, 통과하면 메시지 창
    pass

## 메인 코드 부분 ##
window = Tk()
window.title("회원 가입")
window.geometry("340x280")

Label(window, text = "아이디").pack()
entId = Entry(window, width = 15)
entId.pack()
Label(window, text = "나이").pack()
entAge = Entry(window, width = 15)
entAge.pack()

gender = StringVar()
# TODO: 성별 라디오버튼 2개 (남 · 여)

agree = IntVar()
# TODO: 약관 동의 체크버튼

Button(window, text = "가입하기", command = join).pack(pady = 6)
msgLabel = Label(window, text = "", font = ("맑은 고딕", 11))
msgLabel.pack()

window.mainloop()
`,
            solution: `from tkinter import *
from tkinter import messagebox

## 함수 선언 부분 ##
def join() :
    uid = entId.get()
    if len(uid) < 4 :
        msgLabel.configure(text = "아이디는 4글자 이상이어야 합니다.", fg = "red")
        return
    try :
        age = int(entAge.get())
    except ValueError :
        msgLabel.configure(text = "나이는 숫자로 입력하세요.", fg = "red")
        return
    if age < 1 or age > 120 :
        msgLabel.configure(text = "나이가 올바르지 않습니다.", fg = "red")
        return
    if gender.get() == "" :
        msgLabel.configure(text = "성별을 선택하세요.", fg = "red")
        return
    if agree.get() == 0 :
        msgLabel.configure(text = "약관에 동의해야 합니다.", fg = "red")
        return
    messagebox.showinfo("가입", uid + "(" + gender.get() + ", " + str(age) + "세) 님 가입 완료!")
    msgLabel.configure(text = "가입 완료", fg = "green")

## 메인 코드 부분 ##
window = Tk()
window.title("회원 가입")
window.geometry("340x280")

Label(window, text = "아이디").pack()
entId = Entry(window, width = 15)
entId.pack()
Label(window, text = "나이").pack()
entAge = Entry(window, width = 15)
entAge.pack()

gender = StringVar()
for g in ["남", "여"] :
    Radiobutton(window, text = g, variable = gender, value = g).pack(side = LEFT, padx = 30)

agree = IntVar()
Checkbutton(window, text = "약관에 동의합니다", variable = agree).pack()

Button(window, text = "가입하기", command = join).pack(pady = 6)
msgLabel = Label(window, text = "", font = ("맑은 고딕", 11))
msgLabel.pack()

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
            explain: '<code>configure()</code>(또는 <code>config()</code>)로 위젯의 옵션을 나중에 바꿉니다. <code>textvariable</code> 로 묶어 두었다면 변수만 바꿔도 됩니다.' },
          { q: '다음 코드에서 <b>어떤 버튼을 눌러도</b> 화면에 나오는 숫자는?<pre><code>for i in range(3) :\n    Button(window, text = str(i),\n           command = lambda : show(i)).pack()</code></pre>', options: ['누른 버튼의 숫자 (0, 1, 2)', '항상 0', '항상 2', '오류가 난다'], answer: 2,
            explain: 'lambda 는 <code>i</code> 의 값을 복사해 두지 않고 <b>불릴 때</b> 찾아봅니다. 클릭 시점에는 for 문이 끝나 <code>i</code> 가 2 입니다. <code>lambda n = i : show(n)</code> 처럼 기본 인수로 값을 복사해야 합니다.' },
          { q: '입력칸(Entry)에 사용자가 <code>스무살</code> 이라고 쓴 뒤 <code>int(entry.get())</code> 을 실행하면?', options: ['0 이 된다', '<code>ValueError</code> 가 발생한다', '자동으로 20 이 된다', 'None 이 된다'], answer: 1,
            explain: '<code>get()</code> 은 언제나 문자열이고, 숫자로 바꿀 수 없으면 <code>ValueError</code> 입니다. GUI 에서는 <code>try ~ except ValueError</code> 로 잡아 레이블이나 메시지 창으로 친절히 알려 줍니다.' }
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
          { layout: 'diagram', title: '📘 lambda 로 값 넘기기 — 그리고 함정', html: FIG_LAMBDA, caption: '기본 인수 <code>lambda n = i :</code> 로 지금의 값을 복사한다',
            notes: '<p>중급으로 가는 첫 관문입니다. 먼저 잘못된 코드를 실행해 <b>모든 버튼이 같은 값</b>을 내는 것을 보여 준 뒤 고칩니다.</p><p><b>발문</b>: "버튼을 만드는 시점과 누르는 시점 중 언제 i 를 찾아볼까요?" → 누르는 시점.</p><p>시간: 5분</p>' },
          { layout: 'code', title: '📘 lambda 로 색 버튼 만들기', code: `from tkinter import *

def setColor(c) :
    label1.configure(bg = c, text = "배경색 : " + c)

window = Tk()
window.geometry("400x140")
label1 = Label(window, text = "배경색 : white", font = ("맑은 고딕", 14), width = 20, height = 3)
label1.pack(pady = 8)

for c in ["tomato", "skyblue", "lightgreen", "gold"] :
    Button(window, text = c, bg = c, width = 9,
           command = lambda name = c : setColor(name)).pack(side = LEFT, padx = 3)

window.mainloop()`,
            points: ['버튼마다 다른 값을 넘겨야 할 때', '<code>lambda name = c :</code> 기본 인수로 복사', '<code>name = c</code> 를 빼면 전부 gold'],
            notes: '<p>실습 10-6 과 같은 문제입니다. <code>name = c</code> 를 지우고 실행해 차이를 확인시킨 뒤 실습을 시킵니다.</p><p>시간: 4분</p>' },
          { layout: 'code', title: '📘 Entry 입력 검증 (BMI 계산기)', code: `from tkinter import *

def calcBmi() :
    try :
        h = float(entH.get()) / 100
        w = float(entW.get())
    except ValueError :
        resultLabel.configure(text = "숫자만 입력하세요!", fg = "red")
        return
    resultLabel.configure(text = "BMI : " + format(w / (h * h), ".1f"), fg = "navy")

window = Tk()
window.geometry("280x200")
Label(window, text = "키(cm) / 몸무게(kg)").pack()
entH = Entry(window, width = 8)
entW = Entry(window, width = 8)
entH.insert(0, "170")
entW.insert(0, "65")
entH.pack()
entW.pack()
Button(window, text = "계산하기", command = calcBmi).pack(pady = 6)
resultLabel = Label(window, text = "", font = ("맑은 고딕", 14))
resultLabel.pack()
window.mainloop()`,
            points: ['<code>entry.get()</code> 은 <b>언제나 문자열</b>', '<code>try ~ except ValueError</code> 로 검증', 'GUI 는 죽지 않고 <b>친절하게</b> 알려 주기'],
            notes: '<p>강의자료에 없는 보충. 입력칸에 "abc" 를 넣고 실행해 빨간 메시지가 나오는 것을 보여 줍니다. try 를 지우면 콘솔에 Traceback 만 찍히고 사용자는 아무것도 모른다는 점을 강조합니다.</p><p>시간: 5분</p>' },
          { layout: 'diagram', title: '📘 StringVar 로 위젯 묶기', html: FIG_VAR, caption: 'textvariable · trace_add("write", 함수)',
            notes: '<p>체크버튼의 <code>variable</code> 과 같은 원리를 레이블 · 입력칸으로 확장한 것입니다. 입력칸에 글자를 치면 레이블이 즉시 따라 바뀌는 예제를 실행해 보여 주세요(본문 "이름 미리 보기").</p><p>시간: 4분</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '버튼 클릭 시 myFunc 를 실행하도록 올바르게 연결한 것은?', options: ['command = myFunc()', 'command = myFunc', 'command = "myFunc"', 'click = myFunc'], answer: 1,
            explain: '함수 이름만 넘깁니다. 괄호를 붙이면 즉시 실행됩니다.',
            notes: '<p>시간: 1분</p>' },
          { layout: 'practice', title: '실습 10-8. 커피 주문기', desc: '라디오버튼 3개(아메리카노 · 카페라테 · 바닐라라테)와 [주문하기] 버튼. 누르면 선택한 메뉴와 가격을 메시지 창으로, 선택하지 않았으면 경고 창을 띄웁니다.',
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
            notes: '<p>7분 개별 실습. 선택하지 않았을 때 var.get() 이 0 이라는 점이 포인트입니다. 빨리 끝낸 학생은 실습 10-9(약관 동의), 10-10(가입 폼 검증)에 도전.</p><p>시간: 7분</p>' },
          { layout: 'summary', title: '정리', bullets: ['<code>Button(…, command = 함수이름)</code> — 괄호 없이!', '<code>messagebox.showinfo(제목, 내용)</code> — 따로 import', '<code>Checkbutton</code> + <code>IntVar</code>: 켜짐 1 / 꺼짐 0', '<code>Radiobutton</code>: 같은 variable, 다른 value', '<code>configure()</code> 로 위젯 옵션 바꾸기'],
            notes: '<p>다음 시간: 위젯을 원하는 방향 · 간격으로 배치하는 pack() 옵션.</p><p>시간: 2분</p>' }
        ]
      },

      /* ───────────────────────── 3교시: pack() 으로 위젯 배치하기 ───────────────────────── */
      {
        id: 'ch10-3',
        title: 'pack() 과 grid() 로 위젯 배치하기',
        minutes: 50,
        goals: [
          'pack() 의 side 옵션(LEFT · RIGHT · TOP · BOTTOM)으로 위젯을 가로 · 세로로 정렬할 수 있다',
          '리스트와 for 문으로 같은 종류의 위젯을 여러 개 만들 수 있다',
          'fill 로 위젯을 창 폭에 맞추고, padx · pady(바깥 여백)와 ipadx · ipady(안쪽 여백)를 구별해 쓸 수 있다',
          'Frame · LabelFrame 으로 위젯을 묶어 복잡한 화면을 배치할 수 있다',
          'grid(row · column · sticky · columnspan)로 입력 폼처럼 줄 맞춘 화면을 만들 수 있다',
          'pack · grid · place 의 차이를 알고 화면에 맞는 배치 방법을 고를 수 있다'
        ],
        flow: [['복습 · 도입', 3], ['수평 · 수직 정렬 side', 10], ['fill · padx/ipadx 여백', 10], ['Frame · LabelFrame 으로 묶기', 7], ['📘 세 가지 배치 관리자 · grid', 15], ['정리 · 퀴즈', 5]],
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
          { type: 'callout', kind: 'warn', title: '한 부모 안에서 pack 과 grid 를 섞지 마세요', html: '같은 창(또는 같은 Frame) 안의 위젯들은 <code>pack</code>, <code>grid</code>, <code>place</code> 중 <b>한 가지 방식</b>으로 배치하는 것이 원칙입니다. 특히 pack 과 grid 를 한 부모 안에서 섞으면 실제 tkinter 에서는 오류가 나거나 프로그램이 멈출 수 있습니다. 서로 다른 Frame 이라면 방식을 달리해도 됩니다.' },

          { type: 'h', text: '📘 세 가지 배치 관리자 — 무엇을 언제 쓸까' },
          { type: 'p', html: 'tkinter 에는 위젯을 놓는 방법(배치 관리자, geometry manager)이 <b>세 가지</b> 있습니다. 셋 다 할 수 있는 일이 비슷해 보이지만, 잘 맞는 상황이 서로 다릅니다.' },
          { type: 'figure', html: FIG_MANAGERS, caption: 'pack 은 줄 세우기, grid 는 칸 맞추기, place 는 좌표 찍기' },
          { type: 'table', head: ['', '<code>pack()</code>', '<code>grid()</code>', '<code>place()</code>'], rows: [
            ['생각하는 방식', '"위에서부터 차례로 붙여라"', '"몇 행 몇 열에 놓아라"', '"x, y 좌표에 놓아라"'],
            ['잘 맞는 화면', '도구 모음, 세로 목록, 간단한 창', '입력 폼, 계산기, 표 모양 화면', '그림 위의 부품, 애니메이션, 정밀한 위치'],
            ['창 크기가 바뀌면', '<code>fill</code> · <code>expand</code> 로 따라 늘어남', '<code>sticky</code> + <code>weight</code> 로 따라 늘어남', '<b>그대로</b> (직접 계산해야 함)'],
            ['줄 맞추기', '어려움 (Frame 을 겹쳐 써야 함)', '아주 쉬움', '직접 좌표를 계산'],
            ['주요 옵션', 'side · fill · expand · padx · anchor', 'row · column · sticky · columnspan', 'x · y · relx · rely · anchor']
          ], caption: '세 가지 배치 관리자 비교' },
          { type: 'callout', kind: 'more', title: '고르는 기준 — 실무에서는 이렇게', html: '<ul><li><b>줄 세우기면 pack</b> : 버튼 몇 개를 가로로, 목록을 세로로 — 가장 짧게 끝납니다.</li><li><b>칸 맞추기면 grid</b> : "이름 [입력칸] / 나이 [입력칸]" 처럼 <b>라벨과 입력칸이 줄 맞춰</b> 서야 하면 grid 가 압도적으로 편합니다. 실무의 입력 폼은 대부분 grid 입니다.</li><li><b>좌표가 의미 있으면 place</b> : 지도 위의 핀, 게임 말, 애니메이션처럼 <b>좌표 자체가 데이터</b>일 때만 씁니다. 화면 크기가 달라지면 깨지기 쉬워 일반 화면에는 잘 쓰지 않습니다.</li></ul><p>큰 화면은 <b>Frame 으로 영역을 나눈 뒤 영역마다 알맞은 방식</b>을 쓰는 것이 정석입니다. 예를 들어 위쪽 도구 모음 Frame 은 pack, 가운데 입력 폼 Frame 은 grid 를 쓰는 식입니다.</p>' },

          { type: 'h', text: '📘 grid() 로 표처럼 배치하기' },
          { type: 'p', html: '<code>grid(row = 행, column = 열)</code> 은 창을 보이지 않는 <b>모눈종이</b>로 보고 위젯을 칸에 놓습니다. 행 · 열 번호는 0 부터 시작하고, 칸의 크기는 그 행 · 열에서 <b>가장 큰 위젯</b>에 맞춰 자동으로 정해집니다.' },
          { type: 'figure', html: FIG_GRID, caption: 'grid 의 행 · 열과 sticky · columnspan' },
          { type: 'code', title: '추가 예제. grid 로 만든 로그인 폼', code: `from tkinter import *

## 함수 선언 부분 ##
def login() :
    uid = entId.get()
    if uid == "" :
        msgLabel.configure(text = "아이디를 입력하세요.", fg = "red")
    else :
        msgLabel.configure(text = uid + "님, 환영합니다!", fg = "green")

## 메인 코드 부분 ##
window = Tk()
window.title("로그인")
window.geometry("320x170")

Label(window, text = "아이디").grid(row = 0, column = 0, sticky = E, padx = 6, pady = 8)
Label(window, text = "비밀번호").grid(row = 1, column = 0, sticky = E, padx = 6, pady = 8)

entId = Entry(window)
entPw = Entry(window, show = "*")
entId.grid(row = 0, column = 1, sticky = W + E, padx = 6)
entPw.grid(row = 1, column = 1, sticky = W + E, padx = 6)

Button(window, text = "로그인", command = login).grid(row = 2, column = 0, columnspan = 2,
                                                   sticky = W + E, padx = 6, pady = 6)
msgLabel = Label(window, text = "")
msgLabel.grid(row = 3, column = 0, columnspan = 2)

window.grid_columnconfigure(1, weight = 1)      # 창을 늘리면 1열(입력칸)이 늘어남

window.mainloop()`, desc: '<code>16~17행</code> 설명 레이블은 <code>sticky = E</code> 로 <b>오른쪽에 붙여</b> 입력칸과 줄을 맞춥니다. <code>21~22행</code> <code>sticky = W + E</code> 는 "칸의 왼쪽과 오른쪽에 모두 붙여라", 즉 <b>칸을 가로로 꽉 채우라</b>는 뜻입니다(pack 의 <code>fill = X</code> 에 해당). <code>24~25행</code> <code>columnspan = 2</code> 로 버튼이 두 칸을 차지합니다. <code>29행</code> <code>weight = 1</code> 을 준 열만 창이 커질 때 함께 늘어납니다. <code>show = "*"</code> 는 비밀번호를 별표로 가립니다.' },
          { type: 'table', head: ['옵션', '뜻', '예'], rows: [
            ['<code>row</code> · <code>column</code>', '행 · 열 번호 (0부터)', '<code>grid(row=1, column=0)</code>'],
            ['<code>sticky</code>', '칸 안에서 어느 쪽에 붙일지', '<code>E</code>, <code>W</code>, <code>W+E</code>, <code>N+S+W+E</code>'],
            ['<code>columnspan</code> · <code>rowspan</code>', '여러 칸 합치기', '<code>columnspan=2</code>'],
            ['<code>padx</code> · <code>pady</code> · <code>ipadx</code> · <code>ipady</code>', 'pack 과 같은 여백', '<code>padx=6</code>'],
            ['<code>부모.grid_columnconfigure(열, weight=1)</code>', '창이 커질 때 늘어날 열', '입력칸이 있는 열에 주기'],
            ['<code>부모.grid_rowconfigure(행, weight=1)</code>', '창이 커질 때 늘어날 행', '목록 · 캔버스가 있는 행에 주기']
          ], caption: 'grid() 의 주요 옵션' },
          { type: 'callout', kind: 'warn', title: 'grid 에서 자주 하는 실수', html: '<ul><li><b>행 · 열을 빠뜨림</b> — <code>grid()</code> 만 쓰면 0열에 차례대로 쌓입니다. 의도한 것이 아니면 꼭 번호를 적으세요.</li><li><b>같은 칸에 두 위젯</b> — 겹쳐서 하나만 보입니다. 번호가 겹치지 않았는지 확인하세요.</li><li><b>sticky 없이 칸만 크게</b> — 위젯은 칸 가운데에 작게 남습니다. 늘리려면 <code>sticky = W + E</code> 를 주세요.</li><li><b>weight 를 주지 않음</b> — 창을 키워도 화면이 왼쪽 위에 몰려 있습니다. 늘어나야 할 행 · 열에 <code>weight = 1</code> 을 주세요.</li></ul>' },
          { type: 'code', title: '추가 예제. LabelFrame 으로 묶음에 제목 달기', code: `from tkinter import *

window = Tk()
window.title("설정")
window.geometry("300x230")

## 화면 묶음 1 — 화질 ##
qualityFrame = LabelFrame(window, text = " 화질 ", padx = 10, pady = 6)
qualityFrame.pack(fill = X, padx = 10, pady = 8)
quality = StringVar(value = "보통")
for q in ["낮음", "보통", "높음"] :
    Radiobutton(qualityFrame, text = q, variable = quality, value = q).pack(side = LEFT, padx = 6)

## 화면 묶음 2 — 알림 ##
alarmFrame = LabelFrame(window, text = " 알림 ", padx = 10, pady = 6)
alarmFrame.pack(fill = X, padx = 10, pady = 8)
sound, vibe = IntVar(), IntVar()
Checkbutton(alarmFrame, text = "소리", variable = sound).pack(anchor = W)
Checkbutton(alarmFrame, text = "진동", variable = vibe).pack(anchor = W)

Button(window, text = "저장", width = 12).pack(pady = 6)

window.mainloop()`, desc: '<b>LabelFrame</b> 은 제목이 붙은 Frame 입니다. 설정 화면처럼 <b>관련 있는 위젯을 묶어</b> 보여 줄 때 좋습니다. 위젯의 부모를 <code>window</code> 대신 <code>qualityFrame</code> 으로 지정하는 것이 핵심입니다. <code>StringVar(value = "보통")</code> 처럼 만들면서 바로 초기값을 줄 수도 있습니다.' }
        ],
        practice: [
          {
            title: '실습 10-11. 무지개 버튼',
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
            title: '실습 10-12. grid 로 만든 3×3 숫자판',
            level: 1,
            desc: '<p><code>grid()</code> 와 <b>중첩 for 문</b>으로 1~9 숫자 버튼을 3행 3열로 배치하세요.</p><ul><li>버튼 크기는 <code>width = 5, height = 2</code>, 칸 사이 여백 2픽셀</li><li>버튼을 누르면 맨 위(0행, 3칸 합침)의 레이블에 <code>누른 숫자 : 5</code> 가 표시됩니다.</li></ul>',
            hint: '<code>num = r * 3 + c + 1</code> 로 숫자를 구합니다. 버튼마다 다른 숫자를 넘기려면 <code>command = lambda n = num : show(n)</code> 처럼 <b>기본 인수</b>를 쓰세요. 레이블은 <code>grid(row = 0, column = 0, columnspan = 3)</code>.',
            starter: `from tkinter import *

def show(n) :
    pass  # TODO: 레이블 글자 바꾸기

window = Tk()
window.title("숫자판")

label1 = Label(window, text = "누른 숫자 : -", font = ("맑은 고딕", 14))
label1.grid(row = 0, column = 0, columnspan = 3, pady = 6)

# TODO: 중첩 for 문으로 1~9 버튼을 grid 로 배치

window.mainloop()
`,
            solution: `from tkinter import *

def show(n) :
    label1.configure(text = "누른 숫자 : " + str(n))

window = Tk()
window.title("숫자판")

label1 = Label(window, text = "누른 숫자 : -", font = ("맑은 고딕", 14))
label1.grid(row = 0, column = 0, columnspan = 3, pady = 6)

for r in range(3) :
    for c in range(3) :
        num = r * 3 + c + 1
        btn = Button(window, text = str(num), width = 5, height = 2,
                     command = lambda n = num : show(n))
        btn.grid(row = r + 1, column = c, padx = 2, pady = 2)

window.mainloop()
`
          },
          {
            title: '실습 10-13. 위아래 두 줄 버튼',
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
          },
          {
            title: '실습 10-14. grid 로 회원 정보 폼 만들기',
            level: 2,
            desc: '<p><code>grid()</code> 로 아래 모양의 입력 폼을 만드세요.</p><ul><li>0행: <code>이름</code> 레이블(오른쪽 정렬) + 입력칸</li><li>1행: <code>나이</code> 레이블(오른쪽 정렬) + 입력칸</li><li>2행: <code>성별</code> 레이블 + 라디오버튼 2개(남 · 여) — 라디오버튼은 <code>Frame</code> 에 담아 한 칸에 넣습니다</li><li>3행: <code>[저장]</code> 버튼 — 두 칸을 모두 차지(<code>columnspan = 2</code>, <code>sticky = W + E</code>)</li><li>4행: 결과 레이블 — 저장을 누르면 <code>홍길동 / 20세 / 남</code> 처럼 표시(빈 칸이 있으면 빨간 글씨로 <code>모두 입력하세요.</code>)</li><li>창을 넓히면 입력칸이 함께 넓어지게 <code>grid_columnconfigure(1, weight = 1)</code></li></ul>',
            hint: '레이블은 <code>sticky = E</code>, 입력칸은 <code>sticky = W + E</code>. 라디오버튼 2개는 <code>gFrame = Frame(window)</code> 안에 <code>pack(side = LEFT)</code> 로 넣고, <code>gFrame.grid(row = 2, column = 1, sticky = W)</code> 처럼 프레임만 grid 합니다(부모가 다르므로 pack 과 grid 를 섞어도 괜찮습니다).',
            starter: `from tkinter import *

def save() :
    pass  # TODO: 세 값을 확인하고 결과 레이블에 표시

window = Tk()
window.title("회원 정보")
window.geometry("340x200")

Label(window, text = "이름").grid(row = 0, column = 0, sticky = E, padx = 6, pady = 6)
entName = Entry(window)
entName.grid(row = 0, column = 1, sticky = W + E, padx = 6)

# TODO: 나이 줄, 성별 줄(Frame + 라디오버튼 2개), 저장 버튼, 결과 레이블

window.grid_columnconfigure(1, weight = 1)
window.mainloop()
`,
            solution: `from tkinter import *

def save() :
    name = entName.get()
    age = entAge.get()
    g = gender.get()
    if name == "" or age == "" or g == "" :
        resultLabel.configure(text = "모두 입력하세요.", fg = "red")
    else :
        resultLabel.configure(text = name + " / " + age + "세 / " + g, fg = "navy")

window = Tk()
window.title("회원 정보")
window.geometry("340x200")

Label(window, text = "이름").grid(row = 0, column = 0, sticky = E, padx = 6, pady = 6)
Label(window, text = "나이").grid(row = 1, column = 0, sticky = E, padx = 6, pady = 6)
Label(window, text = "성별").grid(row = 2, column = 0, sticky = E, padx = 6, pady = 6)

entName = Entry(window)
entAge = Entry(window)
entName.grid(row = 0, column = 1, sticky = W + E, padx = 6)
entAge.grid(row = 1, column = 1, sticky = W + E, padx = 6)

gender = StringVar()
gFrame = Frame(window)
for g in ["남", "여"] :
    Radiobutton(gFrame, text = g, variable = gender, value = g).pack(side = LEFT)
gFrame.grid(row = 2, column = 1, sticky = W, padx = 6)

Button(window, text = "저장", command = save).grid(row = 3, column = 0, columnspan = 2,
                                                 sticky = W + E, padx = 6, pady = 8)
resultLabel = Label(window, text = "")
resultLabel.grid(row = 4, column = 0, columnspan = 2)

window.grid_columnconfigure(1, weight = 1)
window.mainloop()
`
          },
          {
            title: '🚀 프로젝트 10-15. 계산기 앱',
            level: 3,
            desc: '<p>지금까지 배운 것(버튼 · lambda · 전역 변수 · grid)을 모두 모아 <b>동작하는 계산기</b>를 만듭니다.</p><h4>요구 사항</h4><ol><li><b>화면</b> — 맨 위에 결과 표시줄(레이블, 오른쪽 정렬, <code>relief = "sunken"</code>), 그 아래 4×4 버튼판을 <code>grid</code> 로 배치합니다.<br><code>7 8 9 ÷ / 4 5 6 × / 1 2 3 - / 0 C = +</code></li><li><b>숫자 버튼</b> — 누른 숫자가 표시줄 오른쪽에 이어 붙습니다(<code>1</code> → <code>12</code> → <code>123</code>). 12자리를 넘으면 더 받지 않습니다.</li><li><b>연산자 버튼</b> — 지금까지 입력한 수를 <code>first</code> 에 저장하고, 연산자를 <code>op</code> 에 기억한 뒤 표시줄에 연산자를 보여 줍니다.</li><li><b>= 버튼</b> — <code>first</code> 와 지금 입력한 수를 <code>op</code> 대로 계산해 표시합니다. 결과가 정수면 <code>12</code>, 아니면 <code>12.5</code> 처럼 보입니다.</li><li><b>C 버튼</b> — 모든 상태를 지우고 <code>0</code> 으로 되돌립니다.</li><li><b>0 으로 나누기</b> — 프로그램이 죽으면 안 됩니다. <code>0으로 나눌 수 없음</code> 을 표시하고 상태를 지웁니다.</li><li>창을 넓히면 버튼도 함께 넓어지게 합니다(<code>sticky</code> + <code>grid_columnconfigure(weight = 1)</code>).</li></ol><h4>실행 장면</h4><pre>[ 12 ] → [ + ] → [ 8 ] → [ = ]  ⇒  20\n[ 7 ] → [ ÷ ] → [ 0 ] → [ = ]  ⇒  0으로 나눌 수 없음</pre><h4>여기까지 했다면 이렇게 더 해 보세요</h4><ol><li><b>소수점 버튼</b> <code>.</code> 을 추가하세요(이미 <code>.</code> 이 들어 있으면 무시).</li><li><b>부호 바꾸기</b> <code>±</code> 와 <b>한 글자 지우기</b> <code>←</code> 버튼을 넣으세요.</li><li><b>키보드로도 계산</b> — 5교시의 <code>bind</code> 를 배운 뒤 숫자 키와 Enter(=), Escape(C) 를 연결하세요.</li><li><b>계산 기록</b> — 오른쪽에 지금까지의 계산식을 쌓아 보여 주세요(Listbox 또는 Text).</li><li><b>보기 좋게</b> — 숫자 · 연산자 · = 버튼의 색을 다르게 하고, 버튼에 <code>font</code> 를 주세요.</li></ol>',
            hint: '<b>상태 3개</b>만 기억하면 됩니다. <code>current</code>(지금 입력 중인 문자열) · <code>first</code>(먼저 입력한 수) · <code>op</code>(연산자). 모든 콜백은 이 세 개를 바꾸고 표시줄을 다시 그립니다(<code>global</code> 필요). 버튼은 중첩 for 문 + <code>lambda k = key :</code> 로 만들면 16줄이 아니라 몇 줄로 끝납니다. 결과가 정수인지 보려면 <code>if result == int(result) :</code> 를 씁니다.',
            starter: `from tkinter import *

## 전역 변수(상태) 선언 부분 ##
current = ""        # 지금 입력 중인 수(문자열)
first = None        # 먼저 입력한 수
op = None           # 기억해 둔 연산자

## 함수 선언 부분 ##
def show(text) :
    display.configure(text = text)

def clickNum(n) :
    pass  # TODO: current 뒤에 숫자를 붙이고 표시

def clickOp(o) :
    pass  # TODO: first 와 op 를 기억하고 current 를 비우기

def clickClear() :
    pass  # TODO: 상태를 모두 지우고 "0" 표시

def clickEqual() :
    pass  # TODO: op 에 따라 계산하고 결과 표시 (0으로 나누기 주의)

## 메인 코드 부분 ##
window = Tk()
window.title("계산기")
window.geometry("260x300")

display = Label(window, text = "0", font = ("Consolas", 22), bg = "white",
                anchor = E, relief = "sunken", bd = 2)
display.grid(row = 0, column = 0, columnspan = 4, sticky = W + E, padx = 4, pady = 6, ipady = 8)

keys = [["7", "8", "9", "÷"],
        ["4", "5", "6", "×"],
        ["1", "2", "3", "-"],
        ["0", "C", "=", "+"]]

# TODO: 중첩 for 문으로 버튼 16개를 grid 로 배치하고 알맞은 command 연결

for c in range(4) :
    window.grid_columnconfigure(c, weight = 1)

window.mainloop()
`,
            solution: `from tkinter import *

## 전역 변수(상태) 선언 부분 ##
current = ""        # 지금 입력 중인 수(문자열)
first = None        # 먼저 입력한 수
op = None           # 기억해 둔 연산자

## 함수 선언 부분 ##
def show(text) :
    display.configure(text = text)

def clickNum(n) :
    global current
    if len(current) < 12 :
        current = current + n
    show(current)

def clickOp(o) :
    global first, op, current
    if current != "" :
        first = float(current)
        current = ""
    op = o
    show(o)

def clickClear() :
    global current, first, op
    current = ""
    first = None
    op = None
    show("0")

def clickEqual() :
    global current, first, op
    if first is None or op is None or current == "" :
        return
    second = float(current)
    if op == "+" :
        result = first + second
    elif op == "-" :
        result = first - second
    elif op == "×" :
        result = first * second
    else :
        if second == 0 :
            clickClear()
            show("0으로 나눌 수 없음")
            return
        result = first / second
    current = ""
    first = None
    op = None
    if result == int(result) :
        show(str(int(result)))
    else :
        show(format(result, ".10g"))

## 메인 코드 부분 ##
window = Tk()
window.title("계산기")
window.geometry("260x300")

display = Label(window, text = "0", font = ("Consolas", 22), bg = "white",
                anchor = E, relief = "sunken", bd = 2)
display.grid(row = 0, column = 0, columnspan = 4, sticky = W + E, padx = 4, pady = 6, ipady = 8)

keys = [["7", "8", "9", "÷"],
        ["4", "5", "6", "×"],
        ["1", "2", "3", "-"],
        ["0", "C", "=", "+"]]

for r in range(4) :
    for c in range(4) :
        key = keys[r][c]
        if key in "0123456789" :
            cmd = lambda n = key : clickNum(n)
        elif key == "C" :
            cmd = clickClear
        elif key == "=" :
            cmd = clickEqual
        else :
            cmd = lambda o = key : clickOp(o)
        Button(window, text = key, width = 4, height = 2, command = cmd).grid(
            row = r + 1, column = c, padx = 2, pady = 2, sticky = W + E)

for c in range(4) :
    window.grid_columnconfigure(c, weight = 1)

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
          { q: 'grid 에서 <code>sticky = W + E</code> 의 뜻은?', options: ['칸을 왼쪽 · 오른쪽 두 개로 나눈다', '위젯을 칸의 가로 폭에 꽉 채운다 (pack 의 fill=X 에 해당)', '위젯을 칸 가운데에 놓는다', '창 크기가 바뀌어도 위젯 크기를 고정한다'], answer: 1,
            explain: 'sticky 는 "칸 안에서 어느 쪽 벽에 붙일지" 입니다. 왼쪽 벽과 오른쪽 벽에 모두 붙으라는 뜻이므로 가로로 늘어납니다.' },
          { q: '"이름 [입력칸] / 나이 [입력칸]" 처럼 <b>레이블과 입력칸의 줄을 맞춘</b> 입력 폼을 만들 때 가장 알맞은 배치 방법은?', options: ['pack(side = LEFT) 만 쓴다', 'grid(row =, column =)', 'place(x =, y =) 로 좌표를 직접 계산', '배치 방법과 상관없다'], answer: 1,
            explain: '행 · 열로 줄을 맞추는 일은 grid 가 가장 쉽습니다. place 로도 가능하지만 글꼴 · 창 크기가 바뀌면 줄이 어긋납니다.' },
          { q: '다음 코드를 실제 tkinter 에서 실행하면 생기는 문제는?<pre><code>Label(window, text="A").pack()\nButton(window, text="B").grid(row=0, column=0)</code></pre>', options: ['문제 없다', '같은 부모 안에서 pack 과 grid 를 섞어 프로그램이 멈추거나 오류가 난다', 'Button 이 Label 위에 그려진다', 'Label 이 사라진다'], answer: 1,
            explain: '한 부모(창 · Frame) 안의 위젯은 한 가지 배치 방법만 써야 합니다. 방법을 달리하려면 Frame 으로 영역을 나누세요.' }
        ],
        slides: [
          { layout: 'title', title: 'pack() 과 grid() 로 위젯 배치하기', subtitle: 'Chapter 10 · Section 03 위젯의 배치와 크기 조절 (1) + 📘 grid', badge: '3교시',
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
          { layout: 'diagram', title: '📘 세 가지 배치 관리자', html: FIG_MANAGERS, caption: '줄 세우기 pack · 칸 맞추기 grid · 좌표 place',
            notes: '<p>강의자료는 pack 과 place 만 다루지만, 실무 화면의 대부분은 grid 로 만듭니다. 세 가지를 한 번에 비교해 주고 "언제 무엇을" 을 분명히 알려 줍니다.</p><p><b>발문</b>: "로그인 화면은 무엇으로 만드는 게 좋을까요?" → grid.</p><p>시간: 4분</p>' },
          { layout: 'diagram', title: '📘 grid — 행 · 열 · sticky', html: FIG_GRID, caption: 'row · column · sticky · columnspan · weight',
            notes: '<p>모눈종이 비유로 설명합니다. sticky 는 "칸 안에서 어느 벽에 붙일지", weight 는 "창이 커질 때 누가 늘어날지" 입니다.</p><p>칠판에 3×3 격자를 그리고 학생에게 위젯을 배치시켜 보면 좋습니다.</p><p>시간: 4분</p>' },
          { layout: 'code', title: '📘 grid 로 만든 로그인 폼', code: `from tkinter import *

def login() :
    msgLabel.configure(text = entId.get() + "님, 환영합니다!", fg = "green")

window = Tk()
window.geometry("320x160")
Label(window, text = "아이디").grid(row = 0, column = 0, sticky = E, padx = 6, pady = 8)
Label(window, text = "비밀번호").grid(row = 1, column = 0, sticky = E, padx = 6, pady = 8)

entId = Entry(window)
entPw = Entry(window, show = "*")
entId.grid(row = 0, column = 1, sticky = W + E, padx = 6)
entPw.grid(row = 1, column = 1, sticky = W + E, padx = 6)

Button(window, text = "로그인", command = login).grid(row = 2, column = 0, columnspan = 2, sticky = W + E, padx = 6)
msgLabel = Label(window, text = "")
msgLabel.grid(row = 3, column = 0, columnspan = 2, pady = 6)

window.grid_columnconfigure(1, weight = 1)
window.mainloop()`,
            points: ['레이블은 <code>sticky = E</code> 로 줄 맞춤', '입력칸은 <code>sticky = W + E</code> 로 칸 채우기', '<code>columnspan = 2</code> 로 버튼을 두 칸에', '<code>weight = 1</code> 준 열만 창 따라 늘어남'],
            notes: '<p>같은 화면을 pack 으로 만들려면 Frame 이 여러 개 필요하다는 것을 보여 주면 grid 의 장점이 확 와 닿습니다. <code>window.grid_columnconfigure</code> 줄을 지우고 창을 늘려 차이를 보여 주세요.</p><p>시간: 6분</p>' },
          { layout: 'practice', title: '🚀 프로젝트 10-15. 계산기 앱', desc: '표시줄 + 4×4 버튼판(7 8 9 ÷ / 4 5 6 × / 1 2 3 - / 0 C = +). 상태 3개(current · first · op)로 계산하고, 0 으로 나누면 안내 메시지를 표시합니다.',
            starter: `from tkinter import *

current, first, op = "", None, None

def show(t) :
    display.configure(text = t)

def clickNum(n) :
    pass  # TODO

def clickOp(o) :
    pass  # TODO

def clickEqual() :
    pass  # TODO

window = Tk()
window.geometry("260x300")
display = Label(window, text = "0", font = ("Consolas", 22), bg = "white", anchor = E, relief = "sunken", bd = 2)
display.grid(row = 0, column = 0, columnspan = 4, sticky = W + E, padx = 4, pady = 6, ipady = 8)
# TODO: 버튼 16개를 grid 로
window.mainloop()
`,
            solution: `from tkinter import *

current, first, op = "", None, None

def show(t) :
    display.configure(text = t)

def clickNum(n) :
    global current
    current = current + n
    show(current)

def clickOp(o) :
    global first, op, current
    if current != "" :
        first = float(current)
        current = ""
    op = o
    show(o)

def clickClear() :
    global current, first, op
    current, first, op = "", None, None
    show("0")

def clickEqual() :
    global current, first, op
    if first is None or op is None or current == "" :
        return
    second = float(current)
    if op == "+" :
        r = first + second
    elif op == "-" :
        r = first - second
    elif op == "×" :
        r = first * second
    else :
        if second == 0 :
            clickClear()
            show("0으로 나눌 수 없음")
            return
        r = first / second
    current, first, op = "", None, None
    show(str(int(r)) if r == int(r) else format(r, ".10g"))

window = Tk()
window.geometry("260x300")
display = Label(window, text = "0", font = ("Consolas", 22), bg = "white", anchor = E, relief = "sunken", bd = 2)
display.grid(row = 0, column = 0, columnspan = 4, sticky = W + E, padx = 4, pady = 6, ipady = 8)

keys = [["7", "8", "9", "÷"], ["4", "5", "6", "×"], ["1", "2", "3", "-"], ["0", "C", "=", "+"]]
for r in range(4) :
    for c in range(4) :
        key = keys[r][c]
        if key in "0123456789" :
            cmd = lambda n = key : clickNum(n)
        elif key == "C" :
            cmd = clickClear
        elif key == "=" :
            cmd = clickEqual
        else :
            cmd = lambda o = key : clickOp(o)
        Button(window, text = key, width = 4, height = 2, command = cmd).grid(row = r + 1, column = c, padx = 2, pady = 2, sticky = W + E)

for c in range(4) :
    window.grid_columnconfigure(c, weight = 1)

window.mainloop()
`,
            notes: '<p>이 장의 첫 미니 프로젝트입니다. 한 시간에 끝내기 어려우면 <b>버튼 배치까지만</b> 수업에서 하고 계산 로직은 과제로 냅니다.</p><p>지도 순서: ① 표시줄과 버튼판 배치 → ② clickNum 만 만들어 숫자가 이어 붙는지 확인 → ③ clickOp · clickEqual → ④ 0 나누기 처리.</p><p>정답 코드의 <code>show(str(int(r)) if …)</code> 는 조건 표현식입니다. 학생은 if ~ else 로 풀어 써도 됩니다.</p><p>시간: 12분 (이어서 과제)</p>' },
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
            notes: '<p>5분 실습. 옵션 값을 바꿔 가며 차이를 스스로 확인하게 합니다. 빨리 끝낸 학생은 실습 10-12(grid 숫자판) · 10-13(Frame 두 줄).</p><p>시간: 6분</p>' },
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
          '전역 변수와 configure(image=…) 로 이전/다음 버튼이 동작하는 사진 앨범을 완성할 수 있다',
          'relx · rely · anchor 로 창 크기가 바뀌어도 흐트러지지 않는 배치를 할 수 있다',
          'after() 와 after_cancel() 로 간단한 애니메이션을 만들고 멈출 수 있다',
          '위젯 묶음을 만드는 함수를 정의해 같은 화면 조각을 여러 번 재사용할 수 있다'
        ],
        flow: [['복습 · 도입', 3], ['place() 와 좌표 · 그림 9개 배치', 12], ['[프로그램 1] 사진 앨범 완성', 15], ['📘 비율 배치 relx · rely', 6], ['📘 after() 애니메이션 · 함수로 묶기', 10], ['실습 · 정리', 4]],
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
          { type: 'callout', kind: 'more', title: '나머지 연산자로 더 짧게', html: '<p><code>if num &gt; 8 : num = 0</code> 대신 <code>num = (num + 1) % 9</code> 라고 쓰면 한 줄로 원형 순환을 만들 수 있습니다. 이전 버튼은 <code>num = (num - 1) % 9</code> 입니다. 파이썬에서 <code>-1 % 9</code> 는 <b>8</b> 이므로 0 에서 이전을 누르면 자연스럽게 8 이 됩니다. 사진 개수가 바뀌어도 되게 하려면 <code>% len(fnameList)</code> 로 쓰면 됩니다.</p><p>교재 코드 2행의 <code>from time import *</code> 는 이 프로그램에서 쓰이지 않습니다. 사진이 자동으로 넘어가는 슬라이드 쇼를 만든다면 <code>time.sleep()</code> 대신 tkinter 의 <code>window.after(밀리초, 함수)</code> 를 써야 창이 멈추지 않습니다(실습 10-17).</p>' },

          { type: 'h', text: '📘 비율로 배치하기 — relx · rely' },
          { type: 'p', html: '<code>place(x = 100, y = 50)</code> 는 창 크기가 달라져도 <b>그 자리에 그대로</b> 있습니다. 창을 키우면 화면이 한쪽에 몰려 보이죠. 그래서 place 에는 <b>비율</b>로 위치를 주는 옵션이 있습니다. <code>relx</code> · <code>rely</code> 는 0.0(왼쪽 · 위)부터 1.0(오른쪽 · 아래)까지의 비율입니다.' },
          { type: 'code', title: '추가 예제. 창 크기가 바뀌어도 가운데에 있는 위젯', code: `from tkinter import *

window = Tk()
window.geometry("420x260")
window.title("relx · rely (창 크기를 바꿔 보세요)")

center = Label(window, text = "언제나 가운데", font = ("맑은 고딕", 16), bg = "lightyellow")
center.place(relx = 0.5, rely = 0.5, anchor = CENTER)     # 가로 50%, 세로 50% 지점

corner = Label(window, text = "오른쪽 아래", bg = "lightblue")
corner.place(relx = 1.0, rely = 1.0, anchor = SE)         # 오른쪽 아래 모서리

bar = Label(window, text = "폭의 80% 를 차지하는 띠", bg = "lightgreen")
bar.place(relx = 0.1, rely = 0.08, relwidth = 0.8)        # 폭도 비율로

fixed = Label(window, text = "x=10, y=10 고정", fg = "gray")
fixed.place(x = 10, y = 10)

window.mainloop()`, desc: '<code>8행</code> <code>anchor = CENTER</code> 는 "위젯의 <b>가운데</b>를 그 지점에 맞춰라" 는 뜻입니다(기본값은 <code>NW</code>, 즉 왼쪽 위 모서리). <code>11행</code> <code>relx = 1.0, anchor = SE</code> 로 오른쪽 아래에 붙입니다. <code>14행</code> <code>relwidth = 0.8</code> 은 부모 폭의 80%. 창 크기를 바꿔 보면 비율로 놓은 위젯만 따라 움직입니다.' },
          { type: 'table', head: ['옵션', '뜻'], rows: [
            ['<code>x</code> · <code>y</code>', '픽셀 좌표 (고정)'],
            ['<code>relx</code> · <code>rely</code>', '부모 크기에 대한 비율 (0.0 ~ 1.0)'],
            ['<code>width</code> · <code>height</code>', '위젯 크기(픽셀)를 직접 지정'],
            ['<code>relwidth</code> · <code>relheight</code>', '부모 크기에 대한 비율로 위젯 크기 지정'],
            ['<code>anchor</code>', '지정한 지점에 위젯의 어느 쪽을 맞출지 (기본 <code>NW</code>)']
          ], caption: 'place() 의 주요 옵션' },

          { type: 'h', text: '📘 after() 로 애니메이션 만들기' },
          { type: 'p', html: '애니메이션은 <b>"조금 움직이고 → 잠깐 뒤에 또 조금 움직이기"</b> 의 반복일 뿐입니다. 1교시에서 본 <code>after()</code> 를 쓰면 움직임을 만들 수 있습니다. 필요한 것은 <b>위치 상태(x, y)</b> 와 <b>속도(dx, dy)</b> 두 가지뿐입니다.' },
          { type: 'code', title: '추가 예제. 벽에 튕기는 공 (place 애니메이션)', code: `from tkinter import *

## 전역 변수(상태) 선언 부분 ##
x, y = 20, 20          # 지금 위치
dx, dy = 6, 4          # 한 번에 움직일 거리(속도)
running = True
timer = None           # 예약 번호 (멈출 때 필요)

## 함수 선언 부분 ##
def animate() :
    global x, y, dx, dy, timer
    x += dx
    y += dy
    if x < 0 or x > 440 - 40 :         # 좌우 벽에 닿으면
        dx = -dx                       # 방향 뒤집기
    if y < 0 or y > 300 - 40 :         # 위아래 벽
        dy = -dy
    ball.place(x = x, y = y)
    timer = window.after(30, animate)   # 30밀리초 뒤 다시 (초당 약 33번)

def toggle() :
    global running, timer
    running = not running
    if running :
        btn.configure(text = "■ 멈춤")
        animate()
    else :
        btn.configure(text = "▶ 시작")
        if timer is not None :
            window.after_cancel(timer)   # 예약 취소

## 메인 코드 부분 ##
window = Tk()
window.geometry("440x340")
window.title("튕기는 공")

ball = Label(window, text = "●", font = ("맑은 고딕", 28), fg = "tomato")
btn = Button(window, text = "■ 멈춤", command = toggle)
btn.place(x = 180, y = 305)

animate()
window.mainloop()`, desc: '<code>18행</code> 위치 상태를 바꾼 뒤 <code>place()</code> 를 다시 불러 위젯을 옮깁니다. <code>19행</code> 30밀리초마다 반복하면 초당 33장면이 되어 부드럽게 보입니다(숫자를 5 나 200 으로 바꿔 보세요). <code>14~17행</code> 벽에 닿으면 속도의 <b>부호</b>를 뒤집어 방향을 바꿉니다. <code>29~30행</code> <code>after_cancel(예약번호)</code> 로 예약을 취소해 멈춥니다 — <code>after()</code> 가 돌려주는 번호를 보관해 두어야 취소할 수 있습니다.' },
          { type: 'callout', kind: 'more', title: '애니메이션을 만들 때 기억할 세 가지', html: '<ul><li><b>상태 → 화면</b> 순서를 지키세요. 먼저 <code>x</code>, <code>y</code> 같은 <b>숫자</b>를 바꾸고, 그다음 그 숫자대로 위젯을 옮깁니다. 화면에서 위치를 읽어 계산하면 코드가 금방 꼬입니다.</li><li><b>간격(ms)이 곧 속도</b>입니다. <code>after(30, …)</code> 이면 초당 약 33번입니다. 너무 짧게(1ms) 잡으면 CPU 만 많이 쓰고 실제로는 더 빨라지지 않습니다. 보통 16~50ms 를 씁니다.</li><li><b>예약을 두 번 걸지 않도록</b> 조심하세요. [시작] 버튼을 두 번 누르면 <code>animate</code> 사슬이 두 개가 되어 공이 두 배로 빨라집니다. <code>running</code> 같은 상태로 막거나, 예약 번호를 보관했다가 <code>after_cancel</code> 하세요.</li></ul>' },

          { type: 'h', text: '📘 위젯 만들기를 함수로 묶어 재사용하기' },
          { type: 'p', html: '같은 모양의 묶음(그림 + 설명 + 버튼)이 여러 개 필요하면, <b>그 묶음을 만드는 함수</b>를 하나 만들어 두고 여러 번 부르면 됩니다. 함수는 만든 위젯(보통 Frame)을 돌려주고, 부르는 쪽에서 배치합니다. 코드가 짧아질 뿐 아니라 <b>모양을 고칠 곳이 한 군데</b>가 되는 것이 더 큰 장점입니다.' },
          { type: 'code', title: '추가 예제. 사진 카드를 만드는 함수', code: `from tkinter import *

## 함수 선언 부분 ##
def makeCard(parent, filename, caption) :
    """그림 + 설명이 든 카드(Frame) 하나를 만들어 돌려준다"""
    frame = Frame(parent, relief = "ridge", bd = 2)
    photo = PhotoImage(file = "GIF/" + filename).subsample(4)
    photoLabel = Label(frame, image = photo)
    photoLabel.image = photo                 # 그림 붙잡아 두기
    textLabel = Label(frame, text = caption, font = ("맑은 고딕", 11))
    photoLabel.pack()
    textLabel.pack(pady = 4)
    return frame

## 메인 코드 부분 ##
window = Tk()
window.title("사진 카드")

cards = [("jeju1.gif", "바다와 섬"), ("jeju4.gif", "오름"), ("jeju7.gif", "노을")]
for filename, caption in cards :
    card = makeCard(window, filename, caption)
    card.pack(side = LEFT, padx = 8, pady = 8)

window.mainloop()`, desc: '<code>4~13행</code> 카드 하나를 만드는 일을 함수로 묶었습니다. <code>7~9행</code> 그림은 <b>함수 안의 지역 변수</b>라서 함수가 끝나면 사라지므로, <code>photoLabel.image = photo</code> 로 레이블에 매달아 둡니다(4교시에서 본 관용 코드). <code>19~22행</code> 튜플 리스트를 <b>언패킹</b>(<code>for filename, caption in cards</code>)해 카드 3장을 만듭니다. 카드 모양을 바꾸고 싶으면 함수 한 곳만 고치면 됩니다.' },
          { type: 'callout', kind: 'more', title: '함수로 묶을 때의 규칙 — 부모를 인수로 받기', html: '<p>위젯 만들기 함수는 <b>어디에 붙일지(부모)를 인수로 받는</b> 것이 좋습니다(<code>makeCard(parent, …)</code>). 그래야 같은 함수로 창에도, Frame 안에도, 나중에 만들 탭 안에도 카드를 만들 수 있습니다. 반대로 함수 안에서 전역 변수 <code>window</code> 를 직접 쓰면 그 창에서만 쓸 수 있는 함수가 됩니다.</p><p>또 하나 — 함수는 <b>배치까지 하지 말고</b> 만들어서 돌려주기만 하는 편이 좋습니다. 배치(<code>pack</code> · <code>grid</code>)는 부르는 쪽이 정하게 두면, 같은 카드를 가로로도 세로로도 쓸 수 있습니다. 6교시에서는 이 아이디어를 <b>클래스</b>로 한 걸음 더 밀고 갑니다.</p>' }
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
            title: '실습 10-16. 창 크기가 바뀌어도 흐트러지지 않는 화면',
            level: 1,
            desc: '<p><code>place()</code> 의 비율 옵션으로 다음 화면을 만드세요. 창 크기를 바꿔도 제자리를 지켜야 합니다.</p><ul><li>가운데(가로 50%, 세로 50%)에 <code>가운데</code> 레이블 — <code>anchor = CENTER</code></li><li>위쪽에 창 폭의 <b>90%</b> 를 차지하는 제목 띠(<code>relx = 0.05, rely = 0.03, relwidth = 0.9</code>, 배경색 <code>navy</code>, 글자색 흰색)</li><li>오른쪽 아래 모서리에 <code>닫기</code> 버튼 — <code>relx = 1.0, rely = 1.0, anchor = SE</code></li></ul>',
            hint: '<code>relx</code> · <code>rely</code> 는 0.0~1.0 비율입니다. <code>anchor</code> 를 주지 않으면 위젯의 <b>왼쪽 위 모서리</b>가 그 지점에 놓입니다. 닫기 버튼은 <code>command = window.destroy</code>.',
            starter: `from tkinter import *

window = Tk()
window.geometry("420x280")
window.title("비율 배치")

# TODO: 제목 띠 · 가운데 레이블 · 닫기 버튼을 place 의 비율 옵션으로 배치

window.mainloop()
`,
            solution: `from tkinter import *

window = Tk()
window.geometry("420x280")
window.title("비율 배치")

title = Label(window, text = "비율로 배치한 화면", bg = "navy", fg = "white")
title.place(relx = 0.05, rely = 0.03, relwidth = 0.9)

center = Label(window, text = "가운데", font = ("맑은 고딕", 16), bg = "lightyellow")
center.place(relx = 0.5, rely = 0.5, anchor = CENTER)

close = Button(window, text = "닫기", command = window.destroy)
close.place(relx = 1.0, rely = 1.0, anchor = SE)

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
            title: '실습 10-17. 자동 슬라이드 쇼',
            level: 2,
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
          },
          {
            title: '🚀 프로젝트 10-18. 스톱워치',
            level: 3,
            desc: '<p><code>after()</code> 와 상태 변수를 이용해 제대로 동작하는 <b>스톱워치</b>를 만듭니다.</p><h4>요구 사항</h4><ol><li><b>표시</b> — 가운데에 <code>00:00.0</code>(분:초.십분의일초) 을 큰 글씨(크기 40)로 표시하고 <b>0.1초마다</b> 갱신합니다.</li><li><b>[시작] / [멈춤]</b> — 한 버튼으로 토글합니다. 글자도 <code>시작</code> ↔ <code>멈춤</code> 으로 바뀝니다.</li><li><b>[초기화]</b> — 시간을 0 으로 되돌리고 기록도 모두 지웁니다.</li><li><b>[랩]</b> — 지금 시간을 아래 목록(<code>Listbox</code>)에 <code>1번째 : 00:03.2</code> 처럼 추가합니다.</li><li><b>멈췄다 다시 시작</b>해도 시간이 <b>이어서</b> 흘러야 합니다(0 으로 돌아가면 안 됩니다).</li><li>멈춘 동안에는 <code>after</code> 예약이 남아 있으면 안 됩니다(<code>after_cancel</code> 사용).</li></ol><h4>힌트가 되는 설계</h4><pre>상태 : running(동작 중?) · start(시작한 시각) · acc(멈출 때까지 쌓인 시간) · timer(예약 번호)\n지금 시간 = acc + (현재 시각 - start)   ← 동작 중일 때\n지금 시간 = acc                          ← 멈춰 있을 때</pre><h4>여기까지 했다면 이렇게 더 해 보세요</h4><ol><li>랩 기록을 <b>직전 기록과의 차이</b>(구간 기록)까지 함께 보여 주세요.</li><li>키보드로 조작하기 — 5교시의 <code>bind</code> 로 스페이스바(시작/멈춤), R(초기화)을 연결하세요.</li><li>1분이 넘으면 글자색을 바꾸거나, 10초마다 <code>bell()</code> 로 소리를 내 보세요.</li><li>기록을 파일에 저장했다가 다음에 실행하면 불러오게 해 보세요(6교시 설정 저장 참고).</li></ol>',
            hint: '시간을 "0.1 씩 더하기" 로 세면 조금씩 어긋납니다. <code>import time</code> 후 <code>time.monotonic()</code>(초 단위 실수)으로 <b>시각을 빼서</b> 계산하세요. 표시 형식은 <code>str(분).zfill(2) + ":" + str(초).zfill(2) + "." + str(십분의일초)</code> 로 만들 수 있습니다.',
            starter: `from tkinter import *
import time

## 전역 변수(상태) 선언 부분 ##
running = False     # 지금 동작 중인가
start = 0.0         # 시작(재개)한 시각
acc = 0.0           # 멈출 때까지 쌓인 시간(초)
timer = None        # after 예약 번호

## 함수 선언 부분 ##
def fmt(sec) :
    m = int(sec // 60)
    s = int(sec % 60)
    tenth = int(sec * 10) % 10
    return str(m).zfill(2) + ":" + str(s).zfill(2) + "." + str(tenth)

def now() :
    # TODO: 지금 표시해야 할 시간(초)을 돌려주기
    return 0.0

def tick() :
    # TODO: 표시 갱신 후 0.1초 뒤 다시 예약(예약 번호를 timer 에 보관)
    pass

def clickStart() :
    # TODO: 동작 중이면 멈추고(acc 에 누적 · 예약 취소), 아니면 시작
    pass

def clickReset() :
    # TODO: 모두 0 으로, 목록도 비우기
    pass

def clickLap() :
    # TODO: 지금 시간을 목록에 추가
    pass

## 메인 코드 부분 ##
window = Tk()
window.title("스톱워치")
window.geometry("300x320")

timeLabel = Label(window, text = "00:00.0", font = ("Consolas", 40))
timeLabel.pack(pady = 10)

btnFrame = Frame(window)
btnFrame.pack()
startBtn = Button(btnFrame, text = "시작", width = 7, command = clickStart)
lapBtn = Button(btnFrame, text = "랩", width = 7, command = clickLap)
resetBtn = Button(btnFrame, text = "초기화", width = 7, command = clickReset)
startBtn.pack(side = LEFT, padx = 3)
lapBtn.pack(side = LEFT, padx = 3)
resetBtn.pack(side = LEFT, padx = 3)

lapList = Listbox(window, height = 8)
lapList.pack(fill = BOTH, expand = 1, padx = 10, pady = 10)

window.mainloop()
`,
            solution: `from tkinter import *
import time

## 전역 변수(상태) 선언 부분 ##
running = False     # 지금 동작 중인가
start = 0.0         # 시작(재개)한 시각
acc = 0.0           # 멈출 때까지 쌓인 시간(초)
timer = None        # after 예약 번호

## 함수 선언 부분 ##
def fmt(sec) :
    m = int(sec // 60)
    s = int(sec % 60)
    tenth = int(sec * 10) % 10
    return str(m).zfill(2) + ":" + str(s).zfill(2) + "." + str(tenth)

def now() :
    if running :
        return acc + (time.monotonic() - start)
    return acc

def tick() :
    global timer
    timeLabel.configure(text = fmt(now()))
    timer = window.after(100, tick)

def clickStart() :
    global running, start, acc, timer
    if running :                       # 멈추기
        acc = acc + (time.monotonic() - start)
        running = False
        if timer is not None :
            window.after_cancel(timer)
            timer = None
        startBtn.configure(text = "시작")
        timeLabel.configure(text = fmt(acc))
    else :                             # 시작(재개)하기
        start = time.monotonic()
        running = True
        startBtn.configure(text = "멈춤")
        tick()

def clickReset() :
    global running, acc, timer
    if timer is not None :
        window.after_cancel(timer)
        timer = None
    running = False
    acc = 0.0
    startBtn.configure(text = "시작")
    timeLabel.configure(text = fmt(0))
    lapList.delete(0, END)

def clickLap() :
    lapList.insert(END, str(lapList.size() + 1) + "번째 : " + fmt(now()))

## 메인 코드 부분 ##
window = Tk()
window.title("스톱워치")
window.geometry("300x320")

timeLabel = Label(window, text = "00:00.0", font = ("Consolas", 40))
timeLabel.pack(pady = 10)

btnFrame = Frame(window)
btnFrame.pack()
startBtn = Button(btnFrame, text = "시작", width = 7, command = clickStart)
lapBtn = Button(btnFrame, text = "랩", width = 7, command = clickLap)
resetBtn = Button(btnFrame, text = "초기화", width = 7, command = clickReset)
startBtn.pack(side = LEFT, padx = 3)
lapBtn.pack(side = LEFT, padx = 3)
resetBtn.pack(side = LEFT, padx = 3)

lapList = Listbox(window, height = 8)
lapList.pack(fill = BOTH, expand = 1, padx = 10, pady = 10)

window.mainloop()
`
          }
        ],
        quiz: [
          { q: '<code>place()</code> 의 좌표에 대한 설명으로 옳은 것은?', options: ['창의 가운데가 (0, 0) 이다', '창의 왼쪽 위가 (0, 0) 이고 y 는 아래로 갈수록 커진다', '창의 왼쪽 아래가 (0, 0) 이고 y 는 위로 갈수록 커진다', '단위는 글자 수이다'], answer: 1,
            explain: '화면 좌표는 왼쪽 위가 원점이고, x 는 오른쪽, y 는 아래로 커집니다. 단위는 픽셀.' },
          { q: '다음 코드 실행 후 <code>a</code> 의 값은?<pre><code>import random\na = [1, 2, 3]\na = random.shuffle(a)</code></pre>', options: ['[1, 2, 3]', '섞인 리스트', 'None', '오류'], answer: 2,
            explain: 'shuffle() 은 리스트 자체를 섞고 <code>None</code> 을 돌려줍니다. 결과를 다시 a 에 넣으면 a 는 None 이 됩니다.' },
          { q: '[프로그램 1] 에서 num 이 8 일 때 [다음] 을 누르면 num 은?', options: ['9', '8', '0', '오류가 난다'], answer: 2,
            explain: 'num 이 9 가 되어 8 보다 크므로 0 으로 돌아갑니다. 마지막 사진 다음은 첫 사진.' },
          { q: 'clickNext() 함수 안에 <code>global num</code> 이 필요한 이유는?', options: ['num 을 출력하려고', '함수 밖(전역)의 num 값을 바꾸려고', 'num 을 새로 만들려고', '그림을 읽으려고'], answer: 1,
            explain: '함수 안에서 전역 변수에 값을 대입(<code>num += 1</code>)하려면 global 선언이 필요합니다. 없으면 UnboundLocalError.' },
          { q: '공을 움직이는 다음 함수에서 <b>마지막 줄을 지우면</b> 어떻게 될까요?<pre><code>def animate() :\n    global x\n    x += 5\n    ball.place(x = x, y = 50)\n    window.after(30, animate)</code></pre>', options: ['공이 더 빨리 움직인다', '공이 한 번만 움직이고 멈춘다', '오류가 난다', '공이 반대로 움직인다'], answer: 1,
            explain: '<code>after()</code> 는 <b>한 번만</b> 예약합니다. 함수가 끝나기 전에 자기 자신을 다시 예약해야 사슬이 이어져 애니메이션이 계속됩니다.' },
          { q: '<code>place(relx = 0.5, rely = 0.5, anchor = CENTER)</code> 의 뜻은?', options: ['왼쪽 위에서 0.5픽셀 떨어진 곳', '창 크기와 상관없이 항상 창의 한가운데', '창의 절반 크기로 위젯을 만든다', '창이 커질 때만 가운데로 간다'], answer: 1,
            explain: 'relx · rely 는 부모 크기에 대한 <b>비율</b>(0.0~1.0)이고, anchor=CENTER 는 위젯의 가운데를 그 지점에 맞춥니다. 창 크기가 바뀌어도 늘 가운데입니다.' }
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
          { layout: 'code', title: '📘 비율 배치 relx · rely', code: `from tkinter import *

window = Tk()
window.geometry("420x260")
window.title("창 크기를 바꿔 보세요")

center = Label(window, text = "언제나 가운데", font = ("맑은 고딕", 16), bg = "lightyellow")
center.place(relx = 0.5, rely = 0.5, anchor = CENTER)

corner = Label(window, text = "오른쪽 아래", bg = "lightblue")
corner.place(relx = 1.0, rely = 1.0, anchor = SE)

bar = Label(window, text = "폭의 80% 띠", bg = "lightgreen")
bar.place(relx = 0.1, rely = 0.08, relwidth = 0.8)

fixed = Label(window, text = "x=10, y=10 고정", fg = "gray")
fixed.place(x = 10, y = 10)

window.mainloop()`,
            points: ['<code>relx</code> · <code>rely</code>: 0.0 ~ 1.0 비율', '<code>anchor</code>: 위젯의 어느 쪽을 그 지점에', '<code>relwidth</code> · <code>relheight</code>: 크기도 비율로'],
            notes: '<p>실행한 뒤 창을 크게 · 작게 끌어 보며 고정 좌표(회색)와 비율 배치의 차이를 보여 줍니다.</p><p><b>발문</b>: "전체 화면으로 키워도 버튼이 가운데 있으려면?" → relx/rely + anchor.</p><p>시간: 4분</p>' },
          { layout: 'code', title: '📘 after() 로 애니메이션 — 튕기는 공', code: `from tkinter import *

x, y = 20, 20
dx, dy = 6, 4

def animate() :
    global x, y, dx, dy
    x += dx
    y += dy
    if x < 0 or x > 400 :
        dx = -dx
    if y < 0 or y > 260 :
        dy = -dy
    ball.place(x = x, y = y)
    window.after(30, animate)     # 30ms 뒤 다시 → 초당 약 33번

window = Tk()
window.geometry("440x300")
ball = Label(window, text = "●", font = ("맑은 고딕", 28), fg = "tomato")

animate()
window.mainloop()`,
            points: ['상태(x, y) 를 바꾸고 → 화면(place) 을 옮긴다', '벽에 닿으면 속도의 <b>부호</b>를 뒤집는다', '<code>after(30, …)</code> 의 숫자가 곧 속도', '멈추려면 <code>after_cancel(예약번호)</code>'],
            notes: '<p>학생들이 가장 좋아하는 예제입니다. 30 을 5 · 200 으로 바꿔 속도 차이를 보여 주고, dx · dy 값을 바꿔 각도를 바꿔 봅니다.</p><p><b>주의</b>: 시작 버튼을 여러 번 눌러 예약이 겹치면 공이 빨라진다는 점(본문 📘 상자)을 짚어 줍니다.</p><p>시간: 6분</p>' },
          { layout: 'practice', title: '🚀 프로젝트 10-18. 스톱워치', desc: '00:00.0 표시를 0.1초마다 갱신하고, [시작/멈춤] · [랩](Listbox 기록) · [초기화] 버튼을 만듭니다. 멈췄다 다시 시작하면 이어서 흘러야 합니다.',
            starter: `from tkinter import *
import time

running, start, acc, timer = False, 0.0, 0.0, None

def fmt(sec) :
    return str(int(sec // 60)).zfill(2) + ":" + str(int(sec % 60)).zfill(2) + "." + str(int(sec * 10) % 10)

def clickStart() :
    pass  # TODO: 토글 — 멈추면 acc 에 누적하고 after_cancel

window = Tk()
window.geometry("300x200")
timeLabel = Label(window, text = "00:00.0", font = ("Consolas", 40))
timeLabel.pack(pady = 10)
startBtn = Button(window, text = "시작", width = 7, command = clickStart)
startBtn.pack()

window.mainloop()
`,
            solution: `from tkinter import *
import time

running, start, acc, timer = False, 0.0, 0.0, None

def fmt(sec) :
    return str(int(sec // 60)).zfill(2) + ":" + str(int(sec % 60)).zfill(2) + "." + str(int(sec * 10) % 10)

def now() :
    if running :
        return acc + (time.monotonic() - start)
    return acc

def tick() :
    global timer
    timeLabel.configure(text = fmt(now()))
    timer = window.after(100, tick)

def clickStart() :
    global running, start, acc, timer
    if running :
        acc = acc + (time.monotonic() - start)
        running = False
        window.after_cancel(timer)
        startBtn.configure(text = "시작")
        timeLabel.configure(text = fmt(acc))
    else :
        start = time.monotonic()
        running = True
        startBtn.configure(text = "멈춤")
        tick()

window = Tk()
window.geometry("300x200")
timeLabel = Label(window, text = "00:00.0", font = ("Consolas", 40))
timeLabel.pack(pady = 10)
startBtn = Button(window, text = "시작", width = 7, command = clickStart)
startBtn.pack()

window.mainloop()
`,
            notes: '<p>교사용 정답은 [시작/멈춤] 만 있는 축소판입니다. 학생용 과제(본문 프로젝트 10-18)에는 [랩] · [초기화] 와 Listbox 가 포함됩니다.</p><p>핵심 지도 포인트: "0.1 씩 더하기" 로 세면 오차가 쌓입니다. <code>time.monotonic()</code> 으로 <b>시각의 차이</b>를 계산해야 정확합니다. 멈출 때 <code>acc</code> 에 누적하는 이유를 칠판에 그림으로 설명하세요.</p><p>시간: 10분 (이어서 과제)</p>' },
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
        title: '마우스 · 키보드 이벤트와 Canvas',
        minutes: 50,
        goals: [
          '마우스 이벤트 코드(<Button-1>, <Button-3>, <Double-Button-1>, <B1-Motion> 등)를 구별할 수 있다',
          '위젯.bind("이벤트", 함수) 형식으로 이벤트 처리 함수를 연결할 수 있다',
          'event 매개변수의 num · x · y 로 어떤 버튼을 어디에서 눌렀는지 알아낼 수 있다',
          '키보드 이벤트(<Key>, <Return>, 일반 키, <Shift-Up> 등)를 처리하고 keycode · keysym · char 를 활용할 수 있다',
          'event.widget 으로 여러 위젯이 하나의 처리 함수를 함께 쓸 수 있다',
          'Canvas 에 도형 · 글자를 그리고 태그 · 좌표(coords · move · delete)로 다룰 수 있다',
          '마우스 드래그(<B1-Motion>) 이벤트로 캔버스에 그림을 그릴 수 있다'
        ],
        flow: [['복습 · 도입', 3], ['마우스 이벤트 · bind 형식', 10], ['event 객체의 속성 활용', 10], ['키보드 이벤트', 10], ['📘 Canvas 로 그리기 · 드래그', 13], ['실습 · 정리', 4]],
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

window.mainloop()`, desc: 'keysym 으로 방향키를 구별하고, <code>place()</code> 를 다시 불러 그림의 위치를 옮깁니다. 이미 place 한 위젯도 place 를 다시 부르면 새 위치로 이동합니다. 간단한 게임의 기본 원리입니다.' },

          { type: 'h', text: '📘 event 객체가 알려 주는 것들' },
          { type: 'p', html: '이벤트 처리 함수가 받는 <code>event</code> 에는 <code>x</code>, <code>y</code>, <code>num</code> 말고도 쓸모 있는 정보가 더 들어 있습니다. 다음 표의 값만 알아도 대부분의 GUI 동작을 만들 수 있습니다.' },
          { type: 'table', head: ['속성', '뜻', '쓰는 곳'], rows: [
            ['<code>event.x</code> · <code>event.y</code>', '<b>이벤트가 일어난 위젯</b>의 왼쪽 위를 (0,0) 으로 한 좌표', '캔버스에 그리기, 클릭한 곳으로 이동'],
            ['<code>event.x_root</code> · <code>event.y_root</code>', '<b>화면 전체</b> 기준 좌표', '팝업 메뉴를 마우스 위치에 띄우기'],
            ['<code>event.num</code>', '누른 마우스 버튼 (1 왼쪽 · 2 가운데 · 3 오른쪽)', '왼쪽/오른쪽 클릭 구분'],
            ['<code>event.widget</code>', '이벤트가 일어난 <b>위젯 객체</b>', '여러 위젯이 같은 함수를 쓸 때 누가 눌렸는지 알기'],
            ['<code>event.keysym</code>', '키 이름 (<code>"a"</code>, <code>"Return"</code>, <code>"Up"</code>, <code>"space"</code>)', '키 구분 — 가장 많이 씀'],
            ['<code>event.char</code>', '입력된 글자 그대로 (특수 키는 <code>""</code>)', '글자를 받아 쌓을 때'],
            ['<code>event.keycode</code>', '키 번호 (대소문자 구별 안 됨, OS 마다 다를 수 있음)', '교재 예제, 특수 키 번호'],
            ['<code>event.type</code>', '이벤트 종류 이름', '한 함수로 여러 이벤트를 처리할 때'],
            ['<code>event.delta</code>', '마우스 휠을 굴린 양(+ 위 · − 아래)', '확대 · 축소, 스크롤']
          ], caption: 'event 객체의 주요 속성' },
          { type: 'code', title: '추가 예제. event.widget 으로 "누가 눌렸는지" 알아내기', code: `from tkinter import *

## 함수 선언 부분 ##
def clickCard(event) :
    card = event.widget                       # 클릭된 레이블 그 자체
    card.configure(bg = "gold")
    infoLabel.configure(text = card["text"] + " 을(를) 골랐습니다.")

## 메인 코드 부분 ##
window = Tk()
window.title("event.widget")
window.geometry("360x160")

infoLabel = Label(window, text = "카드를 클릭해 보세요", font = ("맑은 고딕", 12))
infoLabel.pack(pady = 10)

for name in ["딸기", "바나나", "포도"] :
    card = Label(window, text = name, width = 8, height = 3, bg = "lightgray",
                 relief = "raised", bd = 2)
    card.pack(side = LEFT, padx = 8)
    card.bind("<Button-1>", clickCard)         # 세 레이블이 같은 함수를 공유

window.mainloop()`, desc: '위젯이 여러 개여도 <b>함수는 하나</b>면 됩니다. <code>event.widget</code> 이 "지금 클릭된 위젯" 을 알려 주기 때문입니다. 2교시의 <code>lambda</code> 대신 쓸 수 있는 방법이며, 위젯을 리스트에 모아 두지 않아도 됩니다. <code>card["text"]</code> 로 그 위젯의 옵션 값을 읽었습니다.' },
          { type: 'callout', kind: 'more', title: 'command 와 bind 중 무엇을 쓸까 · 이벤트 겹치기', html: '<ul><li>버튼을 누르는 <b>보통의 동작</b>은 <code>command</code> 가 더 간단하고, 키보드로 버튼을 누를 때도 동작합니다.</li><li>버튼이 아닌 위젯(레이블 · 캔버스 · 창)의 클릭, 오른쪽 클릭, 드래그, 키 입력처럼 <b>세밀한 상황</b>은 <code>bind</code> 를 씁니다.</li><li>같은 이벤트에 함수를 <b>하나 더</b> 붙이려면 <code>bind("&lt;Button-1&gt;", 함수2, add = "+")</code> 처럼 <code>add="+"</code> 를 줍니다. 그냥 다시 bind 하면 앞의 함수가 <b>교체</b>됩니다.</li><li>연결을 끊을 때는 <code>위젯.unbind("&lt;Button-1&gt;")</code>, 모든 위젯에 한꺼번에 걸 때는 <code>window.bind_all("&lt;Key&gt;", 함수)</code> 를 씁니다.</li><li>키 이벤트는 <b>포커스</b>가 있는 위젯에만 갑니다. 창을 클릭하거나 <code>위젯.focus_set()</code> 으로 포커스를 줘야 합니다.</li></ul>' },

          { type: 'h', text: '📘 Canvas — 좌표 위에 그림을 그리는 위젯' },
          { type: 'p', html: '레이블 · 버튼만으로는 선을 긋거나 도형을 그릴 수 없습니다. <b>Canvas(캔버스)</b>는 말 그대로 <b>그림판</b>이 되는 위젯으로, 좌표를 주고 선 · 사각형 · 원 · 글자 · 그림을 그릴 수 있습니다. 마우스 이벤트와 만나면 그림판 · 도형 편집기 · 간단한 게임을 만들 수 있습니다.' },
          { type: 'figure', html: FIG_CANVAS, caption: 'Canvas 의 좌표(왼쪽 위가 0,0)와 도형 · 태그' },
          { type: 'table', head: ['메서드', '하는 일'], rows: [
            ['<code>create_line(x1, y1, x2, y2, …)</code>', '선 (점을 여러 개 이어 그릴 수 있음)'],
            ['<code>create_rectangle(x1, y1, x2, y2)</code>', '사각형 (왼쪽 위 · 오른쪽 아래 좌표)'],
            ['<code>create_oval(x1, y1, x2, y2)</code>', '타원 — <b>도형을 감싸는 네모</b>의 좌표를 준다'],
            ['<code>create_text(x, y, text = "글자")</code>', '글자'],
            ['<code>create_image(x, y, image = photo)</code>', '그림(PhotoImage)'],
            ['<code>move(대상, dx, dy)</code>', '상대적으로 옮기기'],
            ['<code>coords(대상, x1, y1, …)</code>', '좌표를 새로 지정(읽기도 가능)'],
            ['<code>itemconfig(대상, fill = "red")</code>', '색 · 굵기 등 옵션 바꾸기'],
            ['<code>delete(대상)</code> · <code>delete(ALL)</code>', '지우기 · 모두 지우기'],
            ['<code>tag_bind(태그, "&lt;Button-1&gt;", 함수)</code>', '그 도형을 클릭했을 때 처리']
          ], caption: 'Canvas 의 주요 메서드 (대상 = 도형 번호 또는 태그 이름)' },
          { type: 'code', title: '추가 예제. 캔버스에 도형 그리기와 태그', code: `from tkinter import *

## 함수 선언 부분 ##
def clickSun(event) :
    canvas.itemconfig("sun", fill = "orangered")     # 태그로 한꺼번에 바꾸기
    canvas.move("sun", 0, -20)

## 메인 코드 부분 ##
window = Tk()
window.title("캔버스 그리기")

canvas = Canvas(window, width = 400, height = 260, bg = "skyblue")
canvas.pack()

canvas.create_rectangle(0, 180, 400, 260, fill = "seagreen", outline = "")   # 땅
canvas.create_oval(300, 20, 370, 90, fill = "gold", outline = "", tags = "sun")
canvas.create_text(335, 55, text = "☀", font = ("맑은 고딕", 24), tags = "sun")
canvas.create_polygon(60, 180, 130, 70, 200, 180, fill = "dimgray")          # 산
canvas.create_line(0, 220, 400, 220, fill = "white", width = 3, dash = (8, 6))
house = canvas.create_rectangle(230, 130, 300, 180, fill = "ivory")
canvas.create_text(200, 240, text = "해를 클릭해 보세요", font = ("맑은 고딕", 12))

canvas.tag_bind("sun", "<Button-1>", clickSun)      # 태그 붙은 도형 모두에 연결

window.mainloop()`, desc: '<code>16~17행</code> 해(원)와 ☀ 글자에 <b>같은 태그</b> <code>"sun"</code> 을 붙였습니다. 그래서 <code>itemconfig("sun", …)</code>, <code>move("sun", …)</code>, <code>tag_bind("sun", …)</code> 가 <b>두 도형 모두</b>에 적용됩니다. <code>20행</code> <code>create_rectangle</code> 이 돌려주는 값은 도형의 <b>번호(ID)</b>로, 태그 대신 이 번호를 써도 됩니다. 캔버스의 도형은 위젯이 아니라 <b>그려진 그림</b>이므로 pack 하지 않습니다.' },
          { type: 'code', title: '추가 예제. 클릭한 자리에 원 그리기 · 오른쪽 클릭으로 지우기', code: `from tkinter import *

## 전역 변수 선언 부분 ##
colors = ["tomato", "gold", "skyblue", "lightgreen", "violet"]
count = 0

## 함수 선언 부분 ##
def clickCanvas(event) :
    global count
    c = colors[count % len(colors)]
    r = 20
    canvas.create_oval(event.x - r, event.y - r, event.x + r, event.y + r,
                       fill = c, outline = "white", width = 2)
    count += 1
    infoLabel.configure(text = "원 " + str(count) + "개 · 마지막 위치 (" +
                        str(event.x) + ", " + str(event.y) + ")")

def clearCanvas(event) :
    global count
    canvas.delete(ALL)          # 모두 지우기
    count = 0
    infoLabel.configure(text = "모두 지웠습니다.")

## 메인 코드 부분 ##
window = Tk()
window.title("클릭해서 원 그리기 (오른쪽 클릭 = 지우기)")

canvas = Canvas(window, width = 420, height = 280, bg = "white")
canvas.pack()
infoLabel = Label(window, text = "캔버스를 클릭해 보세요")
infoLabel.pack(pady = 4)

canvas.bind("<Button-1>", clickCanvas)
canvas.bind("<Button-3>", clearCanvas)

window.mainloop()`, desc: '<code>12~13행</code> <code>create_oval</code> 은 <b>원을 감싸는 네모</b>의 좌표를 받으므로, 가운데를 <code>(event.x, event.y)</code> 로 하려면 반지름 <code>r</code> 만큼 빼고 더합니다. <code>event.x</code> · <code>event.y</code> 는 <b>캔버스 안에서의</b> 좌표라서 그대로 쓸 수 있습니다(창에 bind 했다면 달라집니다). <code>20행</code> <code>delete(ALL)</code> 로 캔버스를 비웁니다.' }
        ],
        practice: [
          {
            title: '실습 10-19. 캔버스로 그림 그리기',
            level: 1,
            desc: '<p>400×300 크기의 흰색 캔버스에 도형으로 <b>집이 있는 풍경</b>을 그리세요.</p><ul><li>땅 — 사각형(<code>create_rectangle</code>), 초록 계열</li><li>해 — 원(<code>create_oval</code>), 노랑</li><li>집 몸체 — 사각형, 지붕 — 삼각형(<code>create_polygon</code>)</li><li>맨 아래 가운데에 <code>create_text</code> 로 내 이름 쓰기</li></ul>',
            hint: '<code>create_oval(x1, y1, x2, y2)</code> 는 <b>원을 감싸는 네모</b>의 왼쪽 위 · 오른쪽 아래 좌표입니다. 삼각형은 <code>create_polygon(x1, y1, x2, y2, x3, y3, fill = "…")</code>. 캔버스는 <code>canvas.pack()</code> 으로 창에 올립니다.',
            starter: `from tkinter import *

window = Tk()
window.title("내 그림")

canvas = Canvas(window, width = 400, height = 300, bg = "white")
canvas.pack()

# TODO: 땅 · 해 · 집(몸체 + 지붕) · 이름 그리기

window.mainloop()
`,
            solution: `from tkinter import *

window = Tk()
window.title("내 그림")

canvas = Canvas(window, width = 400, height = 300, bg = "white")
canvas.pack()

canvas.create_rectangle(0, 220, 400, 300, fill = "yellowgreen", outline = "")
canvas.create_oval(310, 20, 370, 80, fill = "gold", outline = "")
canvas.create_rectangle(140, 150, 260, 230, fill = "ivory")
canvas.create_polygon(130, 150, 200, 90, 270, 150, fill = "brown")
canvas.create_rectangle(180, 190, 220, 230, fill = "saddlebrown")
canvas.create_text(200, 270, text = "홍길동의 집", font = ("맑은 고딕", 14))

window.mainloop()
`
          },
          {
            title: '실습 10-20. 클릭한 자리에 글자 찍기',
            level: 1,
            desc: '<p>캔버스를 <b>왼쪽 클릭</b>하면 그 자리에 <code>❤</code> 를 그리고(글꼴 크기 20), 클릭할 때마다 아래 레이블에 <code>3개 · (120, 85)</code> 처럼 <b>개수와 마지막 좌표</b>를 표시하세요. <b>오른쪽 클릭</b>하면 모두 지우고 개수도 0 으로 되돌립니다.</p>',
            hint: '<code>canvas.bind("&lt;Button-1&gt;", 함수)</code> 로 연결하고, 함수 안에서 <code>canvas.create_text(event.x, event.y, text = "❤", font = ("맑은 고딕", 20), fill = "red")</code>. 모두 지우기는 <code>canvas.delete(ALL)</code>. 개수는 전역 변수 + <code>global</code>.',
            starter: `from tkinter import *

count = 0

def clickLeft(event) :
    pass  # TODO: 그 자리에 ❤ 그리고 개수 · 좌표 표시

def clickRight(event) :
    pass  # TODO: 모두 지우기

window = Tk()
window.title("하트 찍기")

canvas = Canvas(window, width = 400, height = 260, bg = "white")
canvas.pack()
infoLabel = Label(window, text = "0개")
infoLabel.pack(pady = 4)

# TODO: 이벤트 연결

window.mainloop()
`,
            solution: `from tkinter import *

count = 0

def clickLeft(event) :
    global count
    canvas.create_text(event.x, event.y, text = "❤", font = ("맑은 고딕", 20), fill = "red")
    count += 1
    infoLabel.configure(text = str(count) + "개 · (" + str(event.x) + ", " + str(event.y) + ")")

def clickRight(event) :
    global count
    canvas.delete(ALL)
    count = 0
    infoLabel.configure(text = "0개")

window = Tk()
window.title("하트 찍기")

canvas = Canvas(window, width = 400, height = 260, bg = "white")
canvas.pack()
infoLabel = Label(window, text = "0개")
infoLabel.pack(pady = 4)

canvas.bind("<Button-1>", clickLeft)
canvas.bind("<Button-3>", clickRight)

window.mainloop()
`
          },
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
            title: '실습 10-21. 클릭하는 곳으로 순간 이동',
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
          },
          {
            title: '🚀 프로젝트 10-22. 그림판 (Canvas 드래그)',
            level: 3,
            desc: '<p>마우스로 <b>끌어서 그림을 그리는 그림판</b>을 만듭니다. 이벤트 · 캔버스 · 상태 변수를 모두 쓰는 이 장의 종합 과제입니다.</p><h4>요구 사항</h4><ol><li><b>그리기</b> — 캔버스(500×340, 흰 바탕)에서 왼쪽 버튼을 누른 채 끌면 선이 그려집니다.<br>(<code>&lt;Button-1&gt;</code> 에서 시작점을 기억하고, <code>&lt;B1-Motion&gt;</code> 마다 <b>직전 점 → 지금 점</b> 선을 그은 뒤 직전 점을 갱신)</li><li><b>색 고르기</b> — 색 버튼 5개(검정 · 빨강 · 파랑 · 초록 · 주황). 누르면 그 색으로 그려집니다.</li><li><b>굵기</b> — <code>Scale</code>(1~12)로 선 굵기를 조절합니다.</li><li><b>지우개</b> — 캔버스 색(흰색)으로 그리는 버튼. 다시 색 버튼을 누르면 그리기로 돌아옵니다.</li><li><b>모두 지우기</b> — 캔버스를 비웁니다.</li><li><b>상태 표시</b> — 아래 레이블에 <code>색 : red · 굵기 : 5</code> 처럼 현재 설정을 보여 줍니다.</li></ol><h4>힌트가 되는 설계</h4><pre>상태 : lastX, lastY(직전 점) · color(지금 색) · 굵기는 Scale 에서 읽음\n&lt;Button-1&gt;  → lastX, lastY 를 event.x, event.y 로 저장\n&lt;B1-Motion&gt; → create_line(lastX, lastY, event.x, event.y) 후 last 갱신</pre><h4>여기까지 했다면 이렇게 더 해 보세요</h4><ol><li><b>되돌리기(Undo)</b> — 한 획마다 <code>tags = "s" + str(번호)</code> 를 붙여 두고, [되돌리기] 버튼에서 마지막 번호의 태그를 <code>delete</code> 하세요.</li><li><b>도형 모드</b> — 라디오버튼으로 자유선 / 직선 / 사각형을 고르게 하고, 버튼을 뗄 때(<code>&lt;ButtonRelease-1&gt;</code>) 도형을 완성하세요.</li><li><b>배경 그림</b> — 6교시의 파일 대화상자로 GIF 를 열어 <code>create_image</code> 로 깔고 그 위에 그리세요.</li><li><b>키보드 단축키</b> — <code>c</code> 는 모두 지우기, <code>1</code>~<code>5</code> 는 색 바꾸기로 <code>bind</code> 하세요(창에 <code>focus_set()</code> 필요).</li></ol>',
            hint: '<code>&lt;B1-Motion&gt;</code> 은 왼쪽 버튼을 <b>누른 채 움직일 때</b> 계속 발생합니다. 매번 점 하나를 찍으면 점선이 되므로, <b>직전 점과 지금 점을 선으로 이어야</b> 부드럽습니다. 굵기는 <code>widthScale.get()</code> 으로 읽고, 선 끝을 둥글게 하려면 <code>capstyle = ROUND</code> 를 주세요.',
            starter: `from tkinter import *

## 전역 변수(상태) 선언 부분 ##
lastX, lastY = 0, 0
color = "black"

## 함수 선언 부분 ##
def startDraw(event) :
    pass  # TODO: 시작점 기억

def drawLine(event) :
    pass  # TODO: 직전 점 → 지금 점 선 긋고 직전 점 갱신

def setColor(c) :
    pass  # TODO: 색 바꾸고 상태 레이블 갱신

def clearAll() :
    pass  # TODO: 캔버스 비우기

## 메인 코드 부분 ##
window = Tk()
window.title("그림판")

canvas = Canvas(window, width = 500, height = 340, bg = "white")
canvas.pack()

toolFrame = Frame(window)
toolFrame.pack(fill = X, pady = 4)
# TODO: 색 버튼 5개 · 지우개 · 모두 지우기 · 굵기 Scale

infoLabel = Label(window, text = "색 : black · 굵기 : 3")
infoLabel.pack()

canvas.bind("<Button-1>", startDraw)
canvas.bind("<B1-Motion>", drawLine)

window.mainloop()
`,
            solution: `from tkinter import *

## 전역 변수(상태) 선언 부분 ##
lastX, lastY = 0, 0
color = "black"

## 함수 선언 부분 ##
def showInfo() :
    infoLabel.configure(text = "색 : " + color + " · 굵기 : " + str(widthScale.get()))

def startDraw(event) :
    global lastX, lastY
    lastX, lastY = event.x, event.y

def drawLine(event) :
    global lastX, lastY
    canvas.create_line(lastX, lastY, event.x, event.y,
                       fill = color, width = widthScale.get(), capstyle = ROUND)
    lastX, lastY = event.x, event.y

def setColor(c) :
    global color
    color = c
    showInfo()

def clearAll() :
    canvas.delete(ALL)

## 메인 코드 부분 ##
window = Tk()
window.title("그림판 — 끌어서 그리세요")

canvas = Canvas(window, width = 500, height = 340, bg = "white")
canvas.pack()

toolFrame = Frame(window)
toolFrame.pack(fill = X, pady = 4)

for c in ["black", "red", "blue", "green", "orange"] :
    Button(toolFrame, bg = c, width = 3, command = lambda name = c : setColor(name)).pack(side = LEFT, padx = 2)

Button(toolFrame, text = "지우개", command = lambda : setColor("white")).pack(side = LEFT, padx = 8)
Button(toolFrame, text = "모두 지우기", command = clearAll).pack(side = LEFT)

infoLabel = Label(window, text = "색 : black · 굵기 : 3")      # showInfo 가 쓰므로 먼저 만든다

widthScale = Scale(toolFrame, from_ = 1, to = 12, orient = HORIZONTAL, label = "굵기",
                   command = lambda v : showInfo())
widthScale.set(3)
widthScale.pack(side = RIGHT, padx = 8)
infoLabel.pack()

canvas.bind("<Button-1>", startDraw)
canvas.bind("<B1-Motion>", drawLine)

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
          { q: '다음 중 소문자 a 와 대문자 A 를 <b>구별할 수 있는</b> event 속성은?', options: ['event.keycode', 'event.num', 'event.char', 'event.x'], answer: 2,
            explain: 'char 는 입력된 글자 그대로("a", "A")입니다. keycode 는 키 번호라 둘 다 65 입니다.' },
          { q: '캔버스에 <b>가운데가 (100, 80) 이고 반지름이 20</b> 인 원을 그리는 코드는?', options: ['canvas.create_oval(100, 80, 20, 20)', 'canvas.create_oval(80, 60, 120, 100)', 'canvas.create_oval(100, 80, 120, 100)', 'canvas.create_circle(100, 80, 20)'], answer: 1,
            explain: '<code>create_oval</code> 은 도형을 <b>감싸는 네모</b>의 왼쪽 위 · 오른쪽 아래 좌표를 받습니다. 가운데에서 반지름만큼 빼고 더하면 (80, 60, 120, 100) 입니다.' },
          { q: '여러 레이블이 <b>같은</b> 이벤트 처리 함수를 쓸 때, 방금 클릭된 위젯을 알아내는 방법은?', options: ['event.num', 'event.widget', 'event.keysym', '알 수 없어서 함수를 위젯마다 따로 만들어야 한다'], answer: 1,
            explain: '<code>event.widget</code> 이 이벤트가 일어난 위젯 객체입니다. <code>event.widget.configure(...)</code> 처럼 바로 조작할 수 있습니다.' }
        ],
        slides: [
          { layout: 'title', title: '마우스 · 키보드 이벤트와 Canvas', subtitle: 'Chapter 10 · Section 04 키보드와 마우스 이벤트 처리 + 📘 Canvas', badge: '5교시',
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
          { layout: 'diagram', title: '📘 Canvas — 좌표 · 도형 · 태그', html: FIG_CANVAS, caption: 'create_* → 번호(ID) · tags 로 한꺼번에 다루기',
            notes: '<p>레이블 · 버튼과 달리 캔버스의 도형은 <b>위젯이 아니라 그림</b>이라 pack 하지 않는다는 점을 분명히 합니다.</p><p><b>주의</b>: <code>create_oval</code> 은 원을 감싸는 <b>네모</b>의 좌표입니다. 학생들이 가장 많이 헷갈리는 부분이니 칠판에 그려 설명하세요.</p><p>시간: 4분</p>' },
          { layout: 'code', title: '📘 캔버스에 풍경 그리기 (태그 · tag_bind)', code: `from tkinter import *

def clickSun(event) :
    canvas.itemconfig("sun", fill = "orangered")
    canvas.move("sun", 0, -20)

window = Tk()
canvas = Canvas(window, width = 400, height = 240, bg = "skyblue")
canvas.pack()

canvas.create_rectangle(0, 170, 400, 240, fill = "seagreen", outline = "")
canvas.create_oval(300, 20, 370, 90, fill = "gold", outline = "", tags = "sun")
canvas.create_text(335, 55, text = "☀", font = ("맑은 고딕", 24), tags = "sun")
canvas.create_polygon(60, 170, 130, 60, 200, 170, fill = "dimgray")
canvas.create_text(200, 215, text = "해를 클릭해 보세요")

canvas.tag_bind("sun", "<Button-1>", clickSun)

window.mainloop()`,
            points: ['도형에 <code>tags</code> 로 이름 붙이기', '<code>itemconfig</code> · <code>move</code> · <code>delete</code> 는 태그로 한꺼번에', '<code>tag_bind</code>: 그 도형만 클릭 처리'],
            notes: '<p>해(원)와 ☀(글자) 두 도형에 같은 태그를 주었기 때문에 한 번 클릭으로 둘 다 움직입니다. 태그를 하나만 남기고 실행해 차이를 보여 주세요.</p><p>시간: 5분</p>' },
          { layout: 'practice', title: '🚀 프로젝트 10-22. 그림판', desc: '캔버스에서 끌면 선이 그려지는 그림판. 색 버튼 · 굵기 Scale · 지우개 · 모두 지우기. (핵심: &lt;Button-1&gt; 로 시작점 기억, &lt;B1-Motion&gt; 마다 직전 점과 이어 긋기)',
            starter: `from tkinter import *

lastX, lastY = 0, 0
color = "black"

def startDraw(event) :
    pass  # TODO: 시작점 기억

def drawLine(event) :
    pass  # TODO: 직전 점 → 지금 점 선 긋기

window = Tk()
canvas = Canvas(window, width = 480, height = 300, bg = "white")
canvas.pack()
canvas.bind("<Button-1>", startDraw)
canvas.bind("<B1-Motion>", drawLine)

window.mainloop()
`,
            solution: `from tkinter import *

lastX, lastY = 0, 0
color = "black"

def startDraw(event) :
    global lastX, lastY
    lastX, lastY = event.x, event.y

def drawLine(event) :
    global lastX, lastY
    canvas.create_line(lastX, lastY, event.x, event.y, fill = color, width = 3, capstyle = ROUND)
    lastX, lastY = event.x, event.y

def setColor(c) :
    global color
    color = c

window = Tk()
window.title("그림판")
canvas = Canvas(window, width = 480, height = 300, bg = "white")
canvas.pack()

toolFrame = Frame(window)
toolFrame.pack(fill = X, pady = 4)
for c in ["black", "red", "blue", "green"] :
    Button(toolFrame, bg = c, width = 3, command = lambda name = c : setColor(name)).pack(side = LEFT, padx = 2)
Button(toolFrame, text = "지우개", command = lambda : setColor("white")).pack(side = LEFT, padx = 8)
Button(toolFrame, text = "모두 지우기", command = lambda : canvas.delete(ALL)).pack(side = LEFT)

canvas.bind("<Button-1>", startDraw)
canvas.bind("<B1-Motion>", drawLine)

window.mainloop()
`,
            notes: '<p>교사용 정답은 굵기 Scale 을 뺀 축소판입니다. 본문 프로젝트에는 Scale · 상태 레이블이 포함됩니다.</p><p>지도 순서: ① &lt;B1-Motion&gt; 에서 점만 찍어 보게 한다(점선이 됨) → ② "왜 끊길까?" 발문 → ③ 직전 점을 기억해 선으로 잇는다. 이 흐름이면 학생 스스로 답을 찾습니다.</p><p>시간: 12분 (이어서 과제)</p>' },
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
            notes: '<p>강의자료 38쪽. 교사용 정답은 딕셔너리(8장)를 쓴 짧은 버전입니다. 학생은 if~elif 로 풀어도 됩니다. keysym(Up, Down …)을 써도 정답입니다.</p><p>빨리 끝낸 학생은 실습 10-19(캔버스 그림) · 10-21(순간 이동)에 도전.</p><p>시간: 6분</p>' },
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
          '메뉴와 파일 대화상자를 이용해 명화 감상 프로그램을 완성하고, zoom() · subsample() 로 확대 · 축소 기능을 더할 수 있다',
          'Toplevel 로 두 번째 창을 만들고 grab_set · wait_window 로 모달 대화상자를 만들 수 있다',
          'json 으로 사용자 설정을 파일에 저장했다가 다음 실행 때 복원할 수 있다',
          'GUI 코드를 클래스로 묶으면 무엇이 좋아지는지 설명할 수 있다'
        ],
        flow: [['복습 · 도입', 3], ['메뉴의 구성과 생성', 10], ['대화상자 (입력 · 파일)', 10], ['[프로그램 2] 명화 감상 완성 · 확대 축소', 12], ['📘 Toplevel 모달 · 설정 저장 · 클래스', 12], ['정리 · 퀴즈', 3]],
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
          { type: 'callout', kind: 'more', title: '확대를 여러 번 하면?', html: '<p>zoom 은 픽셀을 그대로 복사해서 키우므로 여러 번 확대하면 계단 모양(모자이크)이 커지고, 그림이 매우 커지면 메모리도 많이 씁니다. 또 subsample 은 픽셀을 건너뛰며 줄이므로 한 번 축소한 뒤 다시 확대해도 원래만큼 선명해지지 않습니다. 부드럽게 크기를 바꾸려면 Pillow 의 <code>Image.resize()</code> 를 사용하고, 원본 그림을 따로 보관해 두었다가 항상 원본에서 변환하는 것이 좋습니다.</p>' },

          { type: 'h', text: '📘 메뉴를 더 쓸모 있게 — 체크 · 라디오 · 팝업' },
          { type: 'p', html: '메뉴에는 실행 항목(<code>add_command</code>) 말고도 <b>켜고 끄는 항목</b>과 <b>하나만 고르는 항목</b>을 넣을 수 있습니다. 2교시에서 배운 <code>IntVar</code> · <code>StringVar</code> 를 그대로 씁니다.' },
          { type: 'code', title: '추가 예제. 체크 · 라디오 메뉴와 오른쪽 클릭 팝업 메뉴', code: `from tkinter import *

## 함수 선언 부분 ##
def applyStyle() :
    weight = "bold" if boldVar.get() == 1 else "normal"
    label1.configure(font = ("맑은 고딕", 20, weight), fg = colorVar.get())

def popupMenu(event) :
    popup.tk_popup(event.x_root, event.y_root)     # 마우스 위치에 메뉴 띄우기

## 메인 코드 부분 ##
window = Tk()
window.title("메뉴 더 알아보기 (오른쪽 클릭)")
window.geometry("360x160")

label1 = Label(window, text = "스타일 미리 보기", font = ("맑은 고딕", 20))
label1.pack(expand = 1)

boldVar = IntVar()
colorVar = StringVar(value = "black")

mainMenu = Menu(window)
window.config(menu = mainMenu)
styleMenu = Menu(mainMenu, tearoff = 0)
mainMenu.add_cascade(label = "스타일", menu = styleMenu)
styleMenu.add_checkbutton(label = "굵게", variable = boldVar, command = applyStyle)
styleMenu.add_separator()
for c in ["black", "red", "blue"] :
    styleMenu.add_radiobutton(label = c, variable = colorVar, value = c, command = applyStyle)

popup = Menu(window, tearoff = 0)                 # 메뉴 막대에 붙이지 않은 메뉴 = 팝업
popup.add_command(label = "굵게 켜기/끄기", command = lambda : (boldVar.set(1 - boldVar.get()), applyStyle()))
popup.add_command(label = "빨강으로", command = lambda : (colorVar.set("red"), applyStyle()))
window.bind("<Button-3>", popupMenu)

window.mainloop()`, desc: '<code>26행</code> <code>add_checkbutton</code> 은 ✔ 표시가 붙는 메뉴, <code>29행</code> <code>add_radiobutton</code> 은 ● 표시로 하나만 골라지는 메뉴입니다. <code>31~34행</code> 메뉴 막대에 붙이지 않은 Menu 객체를 만들어 두었다가 <code>tk_popup(화면좌표X, 화면좌표Y)</code> 로 띄우면 <b>오른쪽 클릭 팝업 메뉴</b>가 됩니다. 이때는 위젯 안 좌표(<code>event.x</code>)가 아니라 <b>화면 전체 좌표</b>(<code>event.x_root</code>)를 씁니다. <code>5행</code>의 <code>"bold" if 조건 else "normal"</code> 은 값을 고르는 짧은 표현(조건 표현식)입니다.' },

          { type: 'h', text: '📘 두 번째 창 만들기 — Toplevel 과 모달 대화상자' },
          { type: 'p', html: '<code>Tk()</code> 는 프로그램에 <b>한 번만</b> 부릅니다. 창이 하나 더 필요하면 <b><code>Toplevel()</code></b> 을 씁니다. 설정 창, 도움말 창, 직접 만든 입력 대화상자가 모두 Toplevel 입니다. 대화상자처럼 <b>그 창을 닫기 전에는 원래 창을 못 쓰게</b> 하려면(이것을 <b>모달(modal)</b> 이라고 합니다) 세 줄을 더 씁니다.' },
          { type: 'figure', html: FIG_MODAL, caption: 'Toplevel 로 두 번째 창을 만들고 grab_set + wait_window 로 모달 대화상자를 만든다' },
          { type: 'code', title: '추가 예제. 직접 만든 모달 입력 대화상자', code: `from tkinter import *

## 함수 선언 부분 ##
def askProfile() :
    """이름과 나이를 묻는 대화상자를 띄우고 [확인] 이면 (이름, 나이) 를 돌려준다"""
    dlg = Toplevel(window)                 # 두 번째 창
    dlg.title("내 정보 입력")
    dlg.geometry("260x160")
    result = {"ok" : False}                # 결과를 담아 둘 상자

    Label(dlg, text = "이름").grid(row = 0, column = 0, padx = 8, pady = 8, sticky = E)
    Label(dlg, text = "나이").grid(row = 1, column = 0, padx = 8, pady = 8, sticky = E)
    entName = Entry(dlg, width = 14)
    entAge = Entry(dlg, width = 14)
    entName.grid(row = 0, column = 1)
    entAge.grid(row = 1, column = 1)

    def onOk() :
        result["ok"] = True
        result["name"] = entName.get()
        result["age"] = entAge.get()
        dlg.destroy()                      # 창을 닫으면 wait_window 가 끝난다

    Button(dlg, text = "확인", width = 8, command = onOk).grid(row = 2, column = 0, pady = 10)
    Button(dlg, text = "취소", width = 8, command = dlg.destroy).grid(row = 2, column = 1)

    dlg.transient(window)                  # 메인 창에 딸린 창으로
    dlg.grab_set()                         # 이 창만 조작할 수 있게 (모달)
    entName.focus_set()
    window.wait_window(dlg)                # 창이 닫힐 때까지 기다린다
    return result

def clickOpen() :
    r = askProfile()
    if r["ok"] :
        label1.configure(text = r["name"] + " (" + r["age"] + "세)")
    else :
        label1.configure(text = "입력을 취소했습니다.")

## 메인 코드 부분 ##
window = Tk()
window.title("Toplevel 대화상자")
window.geometry("300x150")

label1 = Label(window, text = "아직 입력 전", font = ("맑은 고딕", 14))
label1.pack(expand = 1)
Button(window, text = "내 정보 입력…", command = clickOpen).pack(pady = 10)

window.mainloop()`, desc: '<code>9행</code> 결과를 <b>딕셔너리</b>에 담는 이유는, 안쪽 함수 <code>onOk</code> 에서 바깥 변수를 바꾸기 쉽기 때문입니다(딕셔너리의 <b>내용</b>을 바꾸는 것이라 <code>global</code> 이 필요 없습니다). <code>27~30행</code>이 모달의 핵심입니다. <code>transient</code> 는 부모에 딸린 창으로 만들고, <code>grab_set</code> 은 입력을 이 창에만 보내며, <code>wait_window</code> 는 창이 닫힐 때까지 <b>기다립니다</b>. 그래서 <code>askProfile()</code> 은 <code>askstring()</code> 처럼 값을 돌려주는 함수가 됩니다.' },
          { type: 'callout', kind: 'warn', title: 'Toplevel 을 쓸 때 조심할 것', html: '<ul><li><code>Tk()</code> 를 두 번 부르지 마세요. 두 번째부터는 <code>Toplevel()</code> 입니다(<code>Tk()</code> 를 여러 번 만들면 이벤트 루프가 꼬입니다).</li><li>창을 <b>여러 개 열지 않도록</b> 막으세요. 버튼을 여러 번 누르면 설정 창이 여러 개 뜹니다. 이미 열려 있으면 그 창을 앞으로 가져오거나(<code>lift()</code>), 모달로 만들어 애초에 못 누르게 합니다.</li><li><code>grab_set()</code> 한 창을 닫기 전에 <b>닫는 길</b>(확인 · 취소 버튼, ✕)을 꼭 남겨 두세요. 아니면 프로그램이 멈춘 것처럼 보입니다.</li><li>메인 창을 <code>destroy()</code> 하면 딸린 Toplevel 도 모두 닫힙니다.</li></ul>' },

          { type: 'h', text: '📘 사용자 설정을 파일로 저장하고 다음에 불러오기' },
          { type: 'p', html: '프로그램을 껐다 켜도 <b>내가 고른 설정이 그대로</b> 남아 있으면 좋겠죠. 설정을 <b>파일에 저장</b>했다가 시작할 때 읽어 오면 됩니다. 여러 값을 묶어 저장할 때는 <b><code>json</code></b> 모듈이 편합니다. 딕셔너리를 그대로 파일에 쓰고, 그대로 읽어 올 수 있습니다. (파일 다루기는 11장에서 자세히 배웁니다.)' },
          { type: 'code', title: '추가 예제. 설정 저장 · 복원 (json)', code: `from tkinter import *
from tkinter import messagebox
import json
import os

SETTING_FILE = "settings.json"
DEFAULT = {"name" : "손님", "size" : 16, "bg" : "white"}

## 함수 선언 부분 ##
def loadSettings() :
    if os.path.exists(SETTING_FILE) :
        try :
            with open(SETTING_FILE, encoding = "utf-8") as fp :
                data = json.load(fp)
            return data
        except (ValueError, OSError) :        # 파일이 깨졌을 때도 죽지 않게
            return dict(DEFAULT)
    return dict(DEFAULT)

def applySettings() :
    label1.configure(text = nameVar.get() + "님, 안녕하세요",
                     font = ("맑은 고딕", sizeScale.get()), bg = bgVar.get())

def saveSettings() :
    data = {"name" : nameVar.get(), "size" : sizeScale.get(), "bg" : bgVar.get()}
    with open(SETTING_FILE, "w", encoding = "utf-8") as fp :
        json.dump(data, fp, ensure_ascii = False)
    messagebox.showinfo("설정", "저장했습니다.\\n다음에 실행하면 이 설정으로 시작합니다.")

## 메인 코드 부분 ##
setting = loadSettings()

window = Tk()
window.title("설정 저장 · 복원")
window.geometry("340x240")

nameVar = StringVar(value = setting["name"])
bgVar = StringVar(value = setting["bg"])

label1 = Label(window, text = "", width = 24, height = 2)
label1.pack(pady = 10)

Entry(window, textvariable = nameVar).pack()
sizeScale = Scale(window, from_ = 10, to = 30, orient = HORIZONTAL, label = "글자 크기",
                  command = lambda v : applySettings())
sizeScale.set(setting["size"])
sizeScale.pack()

bgFrame = Frame(window)
bgFrame.pack()
for c in ["white", "lightyellow", "lightblue"] :
    Radiobutton(bgFrame, text = c, variable = bgVar, value = c,
                command = applySettings).pack(side = LEFT)

Button(window, text = "설정 저장", command = saveSettings).pack(pady = 8)
nameVar.trace_add("write", lambda *args : applySettings())
applySettings()

window.mainloop()`, desc: '<code>11~17행</code> 파일이 있으면 읽고, 없거나 깨졌으면 <b>기본값</b>을 돌려줍니다. 설정 파일은 사용자가 지울 수도, 손으로 고칠 수도 있으므로 <b>항상 기본값을 준비</b>해 두는 것이 중요합니다. <code>25~28행</code> 딕셔너리를 <code>json.dump</code> 로 저장합니다(<code>ensure_ascii = False</code> 를 주면 한글이 그대로 보입니다). 실행 → 설정 변경 → [설정 저장] → 창을 닫고 다시 ▶ 실행해 보세요. 설정이 그대로 살아 있습니다.' },
          { type: 'callout', kind: 'more', title: '설정 파일을 어디에 두나 · 무엇을 저장하나', html: '<p>이 강좌에서는 <b>작업 폴더</b>에 <code>settings.json</code> 을 만듭니다. 내 PC 의 진짜 프로그램이라면 사용자마다 다른 위치(윈도는 <code>%APPDATA%</code>, 맥 · 리눅스는 <code>~/.config</code>)에 저장합니다. <code>os.path.expanduser("~")</code> 로 사용자 폴더를 얻을 수 있습니다.</p><p>저장할 만한 것: 마지막으로 연 파일, 창 크기(<code>window.geometry()</code> 로 읽을 수 있습니다), 글꼴 · 색 · 언어, 최근 목록. 저장하면 안 되는 것: 비밀번호 같은 민감한 정보(암호화가 필요합니다).</p>' },

          { type: 'h', text: '📘 커지는 GUI 코드를 클래스로 묶기' },
          { type: 'p', html: '지금까지는 상태를 <b>전역 변수</b>에 두고 콜백마다 <code>global</code> 을 썼습니다. 위젯과 상태가 늘어나면 전역 변수가 뒤엉켜 어디서 무엇이 바뀌는지 알기 어려워집니다. <b>클래스</b>로 묶으면 상태와 위젯이 모두 <code>self.</code> 안에 모이고, <code>global</code> 이 필요 없어집니다. (클래스는 12장에서 자세히 배웁니다. 여기서는 <b>구조만</b> 맛봅니다.)' },
          { type: 'code', title: '추가 예제. 같은 카운터를 클래스로 만들기', code: `from tkinter import *

## 클래스 선언 부분 ##
class CounterApp :
    def __init__(self, master) :
        self.master = master
        self.count = 0                     # ① 상태 — self 안에 보관
        master.title("카운터 (클래스 버전)")
        master.geometry("260x180")

        # ② 위젯 만들기
        self.label = Label(master, text = "0", font = ("맑은 고딕", 36), fg = "navy")
        self.plusBtn = Button(master, text = "+1", width = 8, command = self.plus)
        self.resetBtn = Button(master, text = "초기화", width = 8, command = self.reset)

        # ③ 배치하기
        self.label.pack(expand = 1)
        self.plusBtn.pack()
        self.resetBtn.pack(pady = 6)

    # ④ 동작 (콜백)
    def plus(self) :
        self.count += 1                    # global 이 필요 없다
        self.show()

    def reset(self) :
        self.count = 0
        self.show()

    def show(self) :
        self.label.configure(text = str(self.count))

## 메인 코드 부분 ##
window = Tk()
app = CounterApp(window)
window.mainloop()`, desc: '<code>13~14행</code> <code>command = self.plus</code> 처럼 <b>메서드</b>도 괄호 없이 넘깁니다. <code>self</code> 가 함께 묶여 전달되므로 <code>plus</code> 안에서 <code>self.count</code>, <code>self.label</code> 을 바로 쓸 수 있습니다. 같은 앱을 두 개 띄우고 싶다면 <code>CounterApp(Toplevel(window))</code> 처럼 한 줄이면 됩니다 — 전역 변수 버전으로는 불가능한 일입니다.' },
          { type: 'table', head: ['', '전역 변수 방식', '클래스 방식'], rows: [
            ['상태 보관', '전역 변수 + <code>global</code>', '<code>self.count</code> — 객체 안'],
            ['위젯 접근', '전역 변수 이름', '<code>self.label</code>'],
            ['같은 화면 여러 개', '사실상 불가능', '객체를 여러 개 만들면 됨'],
            ['알맞은 크기', '위젯 10개 안팎의 작은 프로그램', '화면이 여러 개인 프로그램'],
            ['배우는 시점', '지금 (9장 함수 · global)', '12장 객체지향']
          ], caption: '두 방식의 비교 — 정답은 없고, 프로그램 크기에 맞게 고른다' },
          { type: 'callout', kind: 'more', title: '10장을 마치며 — 다음 단계', html: '<ul><li><b>ttk</b> — <code>from tkinter import ttk</code> 의 위젯(<code>ttk.Button</code>, <code>ttk.Combobox</code>(드롭다운), <code>ttk.Treeview</code>(표), <code>ttk.Notebook</code>(탭))은 운영체제의 요즘 모양을 따릅니다. 이 강좌의 호환 모듈에서도 기본 모양으로 동작하니 직접 시험해 보세요.</li><li><b>레이아웃을 먼저 그려 보기</b> — 종이에 화면을 그리고 영역을 나눈 뒤 Frame 과 배치 방법을 정하면 훨씬 빨리 만들 수 있습니다.</li><li><b>다음 장</b> 11장 파일 입출력에서 오늘 본 <code>asksaveasfile</code> · 설정 저장을 제대로 배우고, 12장 객체지향에서 이 클래스 구조를, 13장에서는 데이터베이스와 연결한 프로그램을 만듭니다.</li><li>실무에서는 tkinter 외에 PyQt · Kivy 같은 도구도 씁니다. 하지만 <b>상태 · 화면 · 콜백</b>이라는 구조는 어디서나 똑같습니다.</li></ul>' }
        ],
        practice: [
          {
            title: '실습 10-23. 이름을 물어보는 인사 프로그램',
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
            title: '실습 10-24. 배경색을 바꾸는 메뉴',
            level: 1,
            desc: '<p>메뉴 막대에 <b>[보기]</b> 상위 메뉴를 만들고, 그 아래에 <code>흰색</code> · <code>노랑</code> · <code>하늘색</code> 하위 메뉴를 넣으세요. 고르면 창의 배경색이 바뀌고, 가운데 레이블에 <code>배경색 : lightyellow</code> 를 표시합니다. 구분선 아래에 <code>종료</code> 메뉴도 넣으세요.</p>',
            hint: '<code>mainMenu = Menu(window)</code> → <code>window.config(menu = mainMenu)</code> → <code>viewMenu = Menu(mainMenu, tearoff = 0)</code> → <code>mainMenu.add_cascade(label = "보기", menu = viewMenu)</code>. 색마다 다른 값을 넘기려면 <code>command = lambda c = "white" : setBg(c)</code> 처럼 lambda 를 씁니다. 배경색은 <code>window.configure(bg = 색)</code>.',
            starter: `from tkinter import *

def setBg(c) :
    pass  # TODO: 창 배경색과 레이블 글자 바꾸기

window = Tk()
window.title("배경색 메뉴")
window.geometry("320x160")

label1 = Label(window, text = "배경색 : white", font = ("맑은 고딕", 14))
label1.pack(expand = 1)

mainMenu = Menu(window)
window.config(menu = mainMenu)

# TODO: [보기] 메뉴와 하위 메뉴 3개 + 구분선 + 종료

window.mainloop()
`,
            solution: `from tkinter import *

def setBg(c) :
    window.configure(bg = c)
    label1.configure(bg = c, text = "배경색 : " + c)

def quitApp() :
    window.quit()
    window.destroy()

window = Tk()
window.title("배경색 메뉴")
window.geometry("320x160")

label1 = Label(window, text = "배경색 : white", font = ("맑은 고딕", 14))
label1.pack(expand = 1)

mainMenu = Menu(window)
window.config(menu = mainMenu)

viewMenu = Menu(mainMenu, tearoff = 0)
mainMenu.add_cascade(label = "보기", menu = viewMenu)
for c in ["white", "lightyellow", "lightblue"] :
    viewMenu.add_command(label = c, command = lambda name = c : setBg(name))
viewMenu.add_separator()
viewMenu.add_command(label = "종료", command = quitApp)

window.mainloop()
`
          },
          {
            title: '실습 10-25. 명화 감상 — 제목 표시줄에 파일 이름',
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
            title: '실습 10-26. 주사위 배수만큼 그림 늘어놓기',
            level: 2,
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
          },
          {
            title: '실습 10-27. 내가 만든 설정 창 (Toplevel)',
            level: 2,
            desc: '<p>메인 창에는 큰 글씨 레이블 하나와 <code>[설정…]</code> 버튼만 둡니다. 버튼을 누르면 <b>설정 창(Toplevel)</b> 이 뜨고, 다음을 고를 수 있습니다.</p><ul><li>글자 내용(Entry), 글자 크기(라디오버튼 14 · 20 · 28)</li><li><code>[확인]</code> 을 누르면 메인 창의 레이블에 반영하고 설정 창을 닫습니다.</li><li><code>[취소]</code> 를 누르면 아무것도 바꾸지 않고 닫습니다.</li><li>설정 창이 떠 있는 동안에는 메인 창을 누를 수 없어야 합니다(모달).</li></ul>',
            hint: '<code>dlg = Toplevel(window)</code> 로 창을 만들고, 마지막에 <code>dlg.transient(window)</code> · <code>dlg.grab_set()</code> · <code>window.wait_window(dlg)</code> 세 줄을 넣으면 모달이 됩니다. [확인] 함수 안에서 메인 창의 레이블을 바꾸고 <code>dlg.destroy()</code> 하면 됩니다.',
            starter: `from tkinter import *

def openSetting() :
    dlg = Toplevel(window)
    dlg.title("설정")
    dlg.geometry("260x180")
    # TODO: 입력칸 · 크기 라디오버튼 · [확인] [취소] 버튼
    # TODO: transient · grab_set · wait_window 로 모달 만들기

window = Tk()
window.title("설정 창 연습")
window.geometry("320x180")

label1 = Label(window, text = "안녕하세요", font = ("맑은 고딕", 20))
label1.pack(expand = 1)
Button(window, text = "설정…", command = openSetting).pack(pady = 10)

window.mainloop()
`,
            solution: `from tkinter import *

def openSetting() :
    dlg = Toplevel(window)
    dlg.title("설정")
    dlg.geometry("260x190")

    Label(dlg, text = "글자 내용").pack(pady = 4)
    entText = Entry(dlg, width = 18)
    entText.insert(0, label1.cget("text"))
    entText.pack()

    sizeVar = IntVar(value = 20)
    Label(dlg, text = "글자 크기").pack(pady = 4)
    sizeFrame = Frame(dlg)
    sizeFrame.pack()
    for s in [14, 20, 28] :
        Radiobutton(sizeFrame, text = str(s), variable = sizeVar, value = s).pack(side = LEFT)

    def onOk() :
        label1.configure(text = entText.get(), font = ("맑은 고딕", sizeVar.get()))
        dlg.destroy()

    btnFrame = Frame(dlg)
    btnFrame.pack(pady = 10)
    Button(btnFrame, text = "확인", width = 7, command = onOk).pack(side = LEFT, padx = 4)
    Button(btnFrame, text = "취소", width = 7, command = dlg.destroy).pack(side = LEFT, padx = 4)

    dlg.transient(window)
    dlg.grab_set()
    entText.focus_set()
    window.wait_window(dlg)

window = Tk()
window.title("설정 창 연습")
window.geometry("320x180")

label1 = Label(window, text = "안녕하세요", font = ("맑은 고딕", 20))
label1.pack(expand = 1)
Button(window, text = "설정…", command = openSetting).pack(pady = 10)

window.mainloop()
`
          },
          {
            title: '🚀 프로젝트 10-28. 할 일 목록 (체크 · 삭제 · 저장)',
            level: 3,
            desc: '<p>이 장의 마지막 프로젝트입니다. 위젯 · 이벤트 · 메뉴 · 대화상자 · 파일 저장을 모두 씁니다.</p><h4>요구 사항</h4><ol><li><b>추가</b> — 위쪽 입력칸에 할 일을 쓰고 <code>[추가]</code> 버튼을 누르거나 <kbd>Enter</kbd> 를 치면 목록에 들어갑니다. 빈 칸이면 경고 창을 띄웁니다.</li><li><b>목록</b> — <code>Listbox</code> 에 <code>[ ] 우유 사기</code> 처럼 표시하고, 완료한 일은 <code>[v]</code> 로 보여 줍니다.</li><li><b>완료 표시</b> — 목록에서 하나를 고르고 <code>[완료/취소]</code> 를 누르면 <code>[ ]</code> ↔ <code>[v]</code> 가 바뀝니다. (고르지 않았으면 아무 일도 하지 않습니다.)</li><li><b>삭제</b> — <code>[삭제]</code> 는 <code>messagebox.askyesno</code> 로 한 번 물어본 뒤 지웁니다.</li><li><b>개수</b> — 아래에 <code>할 일 5개 · 남은 일 2개</code> 를 항상 표시합니다.</li><li><b>저장 · 불러오기</b> — [파일] 메뉴의 <code>[저장]</code> 으로 <code>todos.json</code> 에 저장하고, 프로그램을 시작할 때 파일이 있으면 자동으로 불러옵니다.</li></ol><h4>힌트가 되는 설계</h4><pre>상태 : todos = [{"text" : "우유 사기", "done" : False}, …]   ← 진짜 데이터\n화면 : Listbox 는 todos 를 "보여 주기만" 한다\n규칙 : todos 를 바꾼 뒤에는 언제나 redraw() 한 번 → 화면이 절대 어긋나지 않는다</pre><h4>여기까지 했다면 이렇게 더 해 보세요</h4><ol><li><b>수정</b> — 목록을 더블클릭(<code>&lt;Double-Button-1&gt;</code>)하면 <code>askstring</code> 으로 내용을 고치게 하세요.</li><li><b>순서 바꾸기</b> — [▲] [▼] 버튼으로 고른 항목을 위아래로 옮기세요(리스트의 원소 자리 바꾸기).</li><li><b>완료한 일 숨기기</b> — 체크버튼으로 완료한 일을 목록에서 감추세요(<code>redraw</code> 만 고치면 됩니다).</li><li><b>마감일 · 색</b> — 완료한 일은 회색으로 보이게 하세요(<code>listbox.itemconfig(번호, fg = "gray")</code>).</li><li><b>자동 저장</b> — 목록이 바뀔 때마다 저장하고, 종료 메뉴에서도 저장하게 하세요.</li></ol>',
            hint: '화면(Listbox)에서 글자를 읽어 판단하지 말고, <b>todos 리스트를 진짜 데이터로</b> 삼으세요. 화면은 <code>redraw()</code> 한 함수에서만 다시 그립니다. 선택한 번호는 <code>todoList.curselection()</code> 이 <b>튜플</b>로 돌려주므로 비어 있는지 먼저 확인해야 합니다. <code>[추가]</code> 버튼과 Enter 키가 같은 함수를 쓰려면 <code>def addTodo(event = None) :</code> 처럼 <b>기본값이 있는 매개변수</b>를 두면 됩니다.',
            starter: `from tkinter import *
from tkinter import messagebox
import json
import os

FILE = "todos.json"

## 전역 변수(상태) 선언 부분 ##
todos = []      # [{"text" : "우유 사기", "done" : False}, …]

## 함수 선언 부분 ##
def redraw() :
    # TODO: Listbox 를 비우고 todos 를 다시 그리기 + 개수 레이블 갱신
    pass

def addTodo(event = None) :
    # TODO: 입력칸의 글자를 todos 에 추가 (빈 칸이면 경고)
    pass

def selectedIndex() :
    # TODO: 선택한 번호를 돌려주기 (없으면 -1)
    return -1

def toggleTodo() :
    # TODO: 선택한 항목의 done 을 뒤집기
    pass

def deleteTodo() :
    # TODO: askyesno 로 물어본 뒤 삭제
    pass

def saveTodos() :
    # TODO: json 으로 FILE 에 저장
    pass

def loadTodos() :
    # TODO: FILE 이 있으면 읽어서 돌려주기 (없으면 빈 리스트)
    return []

## 메인 코드 부분 ##
todos = loadTodos()

window = Tk()
window.title("할 일 목록")
window.geometry("360x400")

topFrame = Frame(window)
topFrame.pack(fill = X, padx = 8, pady = 6)
entry1 = Entry(topFrame)
entry1.pack(side = LEFT, fill = X, expand = 1)
Button(topFrame, text = "추가", command = addTodo).pack(side = LEFT, padx = 4)

todoList = Listbox(window, font = ("맑은 고딕", 12))
todoList.pack(fill = BOTH, expand = 1, padx = 8)

btnFrame = Frame(window)
btnFrame.pack(pady = 6)
Button(btnFrame, text = "완료/취소", width = 10, command = toggleTodo).pack(side = LEFT, padx = 4)
Button(btnFrame, text = "삭제", width = 10, command = deleteTodo).pack(side = LEFT, padx = 4)

countLabel = Label(window, text = "할 일 0개 · 남은 일 0개")
countLabel.pack(pady = 4)

entry1.bind("<Return>", addTodo)
redraw()

window.mainloop()
`,
            solution: `from tkinter import *
from tkinter import messagebox
import json
import os

FILE = "todos.json"

## 전역 변수(상태) 선언 부분 ##
todos = []      # [{"text" : "우유 사기", "done" : False}, …]

## 함수 선언 부분 ##
def redraw() :
    todoList.delete(0, END)
    left = 0
    for t in todos :
        if t["done"] :
            todoList.insert(END, "[v] " + t["text"])
        else :
            todoList.insert(END, "[ ] " + t["text"])
            left += 1
    countLabel.configure(text = "할 일 " + str(len(todos)) + "개 · 남은 일 " + str(left) + "개")

def addTodo(event = None) :
    text = entry1.get().strip()
    if text == "" :
        messagebox.showwarning("할 일", "내용을 입력하세요.")
        return
    todos.append({"text" : text, "done" : False})
    entry1.delete(0, END)
    redraw()

def selectedIndex() :
    sel = todoList.curselection()
    if len(sel) == 0 :
        return -1
    return sel[0]

def toggleTodo() :
    i = selectedIndex()
    if i < 0 :
        return
    todos[i]["done"] = not todos[i]["done"]
    redraw()
    todoList.selection_set(i)

def deleteTodo() :
    i = selectedIndex()
    if i < 0 :
        return
    if messagebox.askyesno("삭제", todos[i]["text"] + " 을(를) 삭제할까요?") :
        del todos[i]
        redraw()

def saveTodos() :
    with open(FILE, "w", encoding = "utf-8") as fp :
        json.dump(todos, fp, ensure_ascii = False)
    messagebox.showinfo("저장", "저장했습니다.")

def loadTodos() :
    if os.path.exists(FILE) :
        try :
            with open(FILE, encoding = "utf-8") as fp :
                return json.load(fp)
        except (ValueError, OSError) :
            return []
    return []

def quitApp() :
    window.quit()
    window.destroy()

## 메인 코드 부분 ##
todos = loadTodos()

window = Tk()
window.title("할 일 목록")
window.geometry("360x400")

mainMenu = Menu(window)
window.config(menu = mainMenu)
fileMenu = Menu(mainMenu, tearoff = 0)
mainMenu.add_cascade(label = "파일", menu = fileMenu)
fileMenu.add_command(label = "저장", command = saveTodos)
fileMenu.add_separator()
fileMenu.add_command(label = "종료", command = quitApp)

topFrame = Frame(window)
topFrame.pack(fill = X, padx = 8, pady = 6)
entry1 = Entry(topFrame)
entry1.pack(side = LEFT, fill = X, expand = 1)
Button(topFrame, text = "추가", command = addTodo).pack(side = LEFT, padx = 4)

todoList = Listbox(window, font = ("맑은 고딕", 12))
todoList.pack(fill = BOTH, expand = 1, padx = 8)

btnFrame = Frame(window)
btnFrame.pack(pady = 6)
Button(btnFrame, text = "완료/취소", width = 10, command = toggleTodo).pack(side = LEFT, padx = 4)
Button(btnFrame, text = "삭제", width = 10, command = deleteTodo).pack(side = LEFT, padx = 4)

countLabel = Label(window, text = "할 일 0개 · 남은 일 0개")
countLabel.pack(pady = 4)

entry1.bind("<Return>", addTodo)
entry1.focus_set()
redraw()

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
            explain: 'subsample(2) 는 가로 · 세로를 모두 1/2 로 줄인 새 그림을 돌려줍니다. y 를 생략하면 x 와 같은 값이 쓰입니다.' },
          { q: '설정 창처럼 <b>두 번째 창</b>을 띄울 때 쓰는 것은?', options: ['Tk() 를 한 번 더 부른다', 'Toplevel(window)', 'Frame(window)', 'window.copy()'], answer: 1,
            explain: '<code>Tk()</code> 는 프로그램에 한 번만 부릅니다. 창을 더 만들 때는 <code>Toplevel()</code> 을 쓰고, 닫기 전에 원래 창을 못 쓰게 하려면 <code>grab_set()</code> + <code>wait_window()</code> 를 더합니다.' }
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
          { layout: 'diagram', title: '📘 Toplevel 과 모달 대화상자', html: FIG_MODAL, caption: 'transient → grab_set → wait_window',
            notes: '<p>simpledialog 가 해 주던 일을 직접 만들어 보는 단계입니다. 입력 칸이 두 개 이상이면 직접 만들어야 합니다.</p><p><b>주의</b>: <code>Tk()</code> 는 한 번만! 두 번째 창은 <code>Toplevel()</code> 입니다. grab_set 한 창에는 반드시 닫는 길을 남겨야 한다는 점도 강조합니다.</p><p>시간: 4분</p>' },
          { layout: 'code', title: '📘 Toplevel 로 만든 설정 창', code: `from tkinter import *

def openSetting() :
    dlg = Toplevel(window)
    dlg.title("설정")
    dlg.geometry("240x140")
    Label(dlg, text = "글자 내용").pack(pady = 4)
    ent = Entry(dlg, width = 16)
    ent.insert(0, label1.cget("text"))
    ent.pack()
    def onOk() :
        label1.configure(text = ent.get())
        dlg.destroy()
    Button(dlg, text = "확인", command = onOk).pack(pady = 10)
    dlg.transient(window)
    dlg.grab_set()
    window.wait_window(dlg)

window = Tk()
window.geometry("300x160")
label1 = Label(window, text = "안녕하세요", font = ("맑은 고딕", 20))
label1.pack(expand = 1)
Button(window, text = "설정…", command = openSetting).pack(pady = 8)
window.mainloop()`,
            points: ['<code>Toplevel(window)</code>: 두 번째 창', '<code>grab_set()</code>: 이 창만 조작 가능', '<code>wait_window()</code>: 닫힐 때까지 대기', '결과는 바깥 위젯에 직접 반영하거나 딕셔너리에 담기'],
            notes: '<p>실행해서 설정 창이 떠 있는 동안 메인 창의 버튼이 눌리지 않는 것을 확인시킵니다. <code>grab_set()</code> 을 지우면 두 창을 모두 쓸 수 있게 되는 것도 비교해 보세요.</p><p>시간: 5분</p>' },
          { layout: 'two', title: '📘 전역 변수 vs 클래스 · 설정 저장',
            left: { title: '상태를 클래스 안에', code: `from tkinter import *

class CounterApp :
    def __init__(self, master) :
        self.count = 0
        self.label = Label(master, text = "0", font = ("맑은 고딕", 32))
        self.btn = Button(master, text = "+1", command = self.plus)
        self.label.pack(expand = 1)
        self.btn.pack(pady = 6)

    def plus(self) :
        self.count += 1
        self.label.configure(text = str(self.count))

window = Tk()
window.geometry("240x160")
app = CounterApp(window)
window.mainloop()` },
            right: { title: '설정을 json 파일로', code: `import json
import os

FILE = "settings.json"
DEFAULT = {"name" : "손님", "size" : 16}

def load() :
    if os.path.exists(FILE) :
        with open(FILE, encoding = "utf-8") as fp :
            return json.load(fp)
    return dict(DEFAULT)

def save(data) :
    with open(FILE, "w", encoding = "utf-8") as fp :
        json.dump(data, fp, ensure_ascii = False)

save({"name" : "홍길동", "size" : 20})
print(load())` },
            notes: '<p>왼쪽: <code>global</code> 없이 <code>self.count</code> 로 상태를 보관합니다(12장 예고). 오른쪽: 설정을 파일에 저장했다 불러옵니다(11장 예고).</p><p>오른쪽 코드는 창 없이 콘솔에서 결과를 확인할 수 있어 파일 저장을 이해시키기 좋습니다.</p><p>시간: 5분</p>' },
          { layout: 'practice', title: '🚀 프로젝트 10-28. 할 일 목록', desc: 'Entry + [추가](Enter 키도) → Listbox 에 <code>[ ] 우유 사기</code>, [완료/취소] 로 <code>[v]</code> 토글, [삭제]는 askyesno 확인, 아래에 개수 표시, [파일]-[저장] 으로 todos.json 저장 · 시작할 때 자동 불러오기.',
            starter: `from tkinter import *
from tkinter import messagebox

todos = []      # [{"text" : "우유 사기", "done" : False}, …]

def redraw() :
    pass  # TODO: Listbox 를 비우고 todos 대로 다시 그리기

def addTodo(event = None) :
    pass  # TODO: 빈 칸이면 경고, 아니면 todos 에 추가 후 redraw()

window = Tk()
window.geometry("340x320")
entry1 = Entry(window)
entry1.pack(fill = X, padx = 8, pady = 6)
Button(window, text = "추가", command = addTodo).pack()
todoList = Listbox(window, font = ("맑은 고딕", 12))
todoList.pack(fill = BOTH, expand = 1, padx = 8, pady = 6)
entry1.bind("<Return>", addTodo)
window.mainloop()
`,
            solution: `from tkinter import *
from tkinter import messagebox

todos = []

def redraw() :
    todoList.delete(0, END)
    left = 0
    for t in todos :
        if t["done"] :
            todoList.insert(END, "[v] " + t["text"])
        else :
            todoList.insert(END, "[ ] " + t["text"])
            left += 1
    countLabel.configure(text = "할 일 " + str(len(todos)) + "개 · 남은 일 " + str(left) + "개")

def addTodo(event = None) :
    text = entry1.get().strip()
    if text == "" :
        messagebox.showwarning("할 일", "내용을 입력하세요.")
        return
    todos.append({"text" : text, "done" : False})
    entry1.delete(0, END)
    redraw()

def toggleTodo() :
    sel = todoList.curselection()
    if len(sel) == 0 :
        return
    todos[sel[0]]["done"] = not todos[sel[0]]["done"]
    redraw()

window = Tk()
window.title("할 일 목록")
window.geometry("340x340")
entry1 = Entry(window)
entry1.pack(fill = X, padx = 8, pady = 6)
Button(window, text = "추가", command = addTodo).pack()
todoList = Listbox(window, font = ("맑은 고딕", 12))
todoList.pack(fill = BOTH, expand = 1, padx = 8, pady = 6)
Button(window, text = "완료/취소", command = toggleTodo).pack()
countLabel = Label(window, text = "할 일 0개 · 남은 일 0개")
countLabel.pack(pady = 4)
entry1.bind("<Return>", addTodo)
redraw()
window.mainloop()
`,
            notes: '<p>교사용 정답은 [삭제]·메뉴·파일 저장을 뺀 축소판입니다(본문 프로젝트에는 모두 포함).</p><p>가장 중요한 지도 포인트: <b>화면이 아니라 리스트가 진짜 데이터</b>이고, 바꾼 뒤에는 언제나 <code>redraw()</code> 한 번. 이 원칙을 지키면 화면과 데이터가 어긋나는 버그가 사라집니다.</p><p><code>def addTodo(event = None)</code> 으로 버튼(인수 없음)과 Enter 키(event 전달)를 한 함수로 처리하는 기법도 짚어 주세요.</p><p>시간: 12분 (이어서 과제)</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>askopenfilename()</code> 이 돌려주는 것은?', options: ['열린 파일 객체', '경로 문자열', 'PhotoImage', '파일 내용'], answer: 1,
            explain: '이름(경로)만 돌려줍니다. 취소하면 빈 문자열.',
            notes: '<p>시간: 1분</p>' },
          { layout: 'practice', title: '실습 10-23. 이름을 물어보는 인사', desc: '시작하면 askstring 으로 이름을 묻고 "○○님, 환영합니다!" 를 크게 표시하세요. 취소하면 "손님".',
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
            notes: '<p>5분 실습. 빨리 끝낸 학생은 실습 10-25(명화 감상 개선), 10-26(토끼 늘어놓기), 10-27(설정 창)에 도전합니다.</p><p>시간: 5분</p>' },
          { layout: 'summary', title: '정리', bullets: ['메뉴: <code>Menu</code> → <code>config(menu=)</code> → <code>add_cascade</code> → <code>add_command</code>', '<code>askinteger</code> · <code>askfloat</code> · <code>askstring</code> (취소 → None)', '<code>askopenfilename</code> → 경로 문자열 (취소 → "")', '[프로그램 2]: 메뉴 + 파일 대화상자 + PhotoImage', '<code>zoom()</code> · <code>subsample()</code> 로 확대 · 축소'],
            notes: '<p>10장 전체 정리: 창 → 위젯 → 배치 → 이벤트 → 메뉴 · 대화상자. 다음 장은 파일 입출력입니다(오늘 본 asksaveasfile 과 연결).</p><p>시간: 3분</p>' }
        ]
      }
    ]
  });
})();
