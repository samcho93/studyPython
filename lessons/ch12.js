/* Chapter 12. 객체지향 프로그래밍 (강의자료 Ch12, 44쪽) */
PY_COURSE.addChapter((function () {
  // ---- SVG 도우미 (IIFE 내부 지역 함수: 전역 변수 없음) ----
  const S = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">${body}</svg>`;
  const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.fs || 22}" fill="${o.c || 'var(--fg)'}" text-anchor="${o.a || 'middle'}" dominant-baseline="middle"${o.b ? ' font-weight="700"' : ''}${o.i ? ' font-style="italic"' : ''}${o.mono ? ' font-family="monospace"' : ''}>${s}</text>`;
  const R = (x, y, w, h, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx == null ? 12 : o.rx}" fill="${o.f || 'var(--card)'}" stroke="${o.s || 'var(--accent)'}" stroke-width="${o.sw || 3}"${o.d ? ' stroke-dasharray="10 7"' : ''}/>`;
  const B = (x, y, w, h, lines, o = {}) => {
    const arr = [].concat(lines), fs = o.fs || 22, lh = fs * 1.35, y0 = y + h / 2 - (arr.length - 1) * lh / 2;
    return R(x, y, w, h, o) + arr.map((l, i) => T(x + w / 2, y0 + i * lh, l, { fs, b: o.b !== false && i === 0, c: o.tc, mono: o.mono })).join('');
  };
  // 코드 줄 여러 개 (왼쪽 정렬, 고정폭)
  const L = (x, y, lines, o = {}) => {
    const fs = o.fs || 20, lh = o.lh || fs * 1.45;
    return [].concat(lines).map((l, i) => {
      const t = Array.isArray(l) ? l[0] : l, c = Array.isArray(l) ? l[1] : (o.c || 'var(--fg)');
      return T(x, y + i * lh, t, { fs, a: 'start', mono: o.mono !== false, c, b: Array.isArray(l) && l[2] });
    }).join('');
  };
  // UML 클래스 상자: 높이 = 46 + 멤버수 * (fs + 10) + 10
  const U = (x, y, w, name, members, o = {}) => {
    const fs = o.fs || 20, hh = 46, lh = fs + 10, h = hh + Math.max(1, members.length) * lh + 10;
    let s = R(x, y, w, h, o) + `<line x1="${x}" y1="${y + hh}" x2="${x + w}" y2="${y + hh}" stroke="${o.s || 'var(--accent)'}" stroke-width="2"/>`;
    s += T(x + w / 2, y + hh / 2, name, { fs: fs + 2, b: true, i: o.it });
    members.forEach((m, i) => {
      const t = Array.isArray(m) ? m[0] : m, c = Array.isArray(m) ? m[1] : undefined;
      s += T(x + 14, y + hh + 5 + lh / 2 + i * lh, t, { fs, a: 'start', c, mono: true });
    });
    return s;
  };
  // 화살표 (hollow: 상속을 나타내는 속이 빈 삼각형)
  const A = (x1, y1, x2, y2, o = {}) => {
    const c = o.c || 'var(--muted)', ang = Math.atan2(y2 - y1, x2 - x1), Ln = o.hollow ? 26 : 18, W = o.hollow ? 15 : 10;
    const bx = x2 - Ln * Math.cos(ang), by = y2 - Ln * Math.sin(ang), px = -Math.sin(ang) * W, py = Math.cos(ang) * W;
    const f = (n) => n.toFixed(1);
    return `<line x1="${x1}" y1="${y1}" x2="${f(bx)}" y2="${f(by)}" stroke="${c}" stroke-width="${o.sw || 3}"${o.d ? ' stroke-dasharray="10 7"' : ''}/>` +
      `<polygon points="${x2},${y2} ${f(bx + px)},${f(by + py)} ${f(bx - px)},${f(by - py)}" fill="${o.hollow ? 'var(--card)' : c}" stroke="${c}" stroke-width="3"/>`;
  };
  // 자동차 그림 (폭 약 210, 높이 약 85 × s)
  const CAR = (x, y, s, c, label, o = {}) => `<g transform="translate(${x},${y}) scale(${s})">` +
    `<path d="M10 60 L20 36 Q30 30 52 28 L72 8 Q80 2 92 2 L140 2 Q152 2 160 10 L182 28 Q202 31 206 42 L208 60 Q208 68 200 68 L18 68 Q10 68 10 60 Z" fill="${o.outline ? 'none' : c}" stroke="${o.outline ? c : 'none'}" stroke-width="${o.outline ? 3 : 0}"${o.outline ? ' stroke-dasharray="8 5"' : ''}/>` +
    (o.outline ? '' : `<path d="M80 12 L94 8 L118 8 L118 28 L64 28 Z" fill="var(--card)" opacity=".8"/><path d="M124 8 L140 8 Q148 8 154 14 L166 28 L124 28 Z" fill="var(--card)" opacity=".8"/>`) +
    `<circle cx="55" cy="68" r="16" fill="${o.outline ? 'var(--card)' : 'var(--fg)'}" stroke="${c}" stroke-width="${o.outline ? 3 : 0}"/><circle cx="55" cy="68" r="6" fill="var(--card)"/>` +
    `<circle cx="165" cy="68" r="16" fill="${o.outline ? 'var(--card)' : 'var(--fg)'}" stroke="${c}" stroke-width="${o.outline ? 3 : 0}"/><circle cx="165" cy="68" r="6" fill="var(--card)"/>` +
    (label ? `<text x="112" y="48" font-size="22" font-weight="700" fill="#fff" text-anchor="middle" dominant-baseline="middle">${label}</text>` : '') + `</g>`;
  // 트럭 그림 (폭 약 220, 높이 약 90 × s)
  const TRUCK = (x, y, s, c) => `<g transform="translate(${x},${y}) scale(${s})">` +
    `<rect x="0" y="0" width="140" height="58" rx="4" fill="${c}" opacity=".75"/>` +
    `<path d="M146 12 L186 12 Q196 12 202 24 L214 44 L214 62 L146 62 Z" fill="${c}"/><path d="M160 18 L186 18 Q192 18 196 26 L204 40 L160 40 Z" fill="var(--card)" opacity=".8"/>` +
    `<rect x="0" y="58" width="214" height="8" fill="${c}"/>` +
    `<circle cx="36" cy="72" r="15" fill="var(--fg)"/><circle cx="36" cy="72" r="6" fill="var(--card)"/>` +
    `<circle cx="84" cy="72" r="15" fill="var(--fg)"/><circle cx="84" cy="72" r="6" fill="var(--card)"/>` +
    `<circle cx="180" cy="72" r="15" fill="var(--fg)"/><circle cx="180" cy="72" r="6" fill="var(--card)"/></g>`;
  const RED = '#e5533d', BLUE = '#3f8fd2', YEL = '#e2b022';

  // ================= 다이어그램 =================
  // 이 장에서 만들 프로그램
  const rects = [[760, 100, 60, 90, '#8e44ad', 5], [830, 150, 70, 50, '#76d7c4', 2], [960, 90, 90, 80, '#e67e22', 7], [900, 210, 90, 80, '#2e86c1', 8],
    [720, 250, 90, 60, '#7dcea0', 4], [1010, 280, 70, 90, '#27ae60', 5], [830, 320, 60, 40, '#c0739f', 3], [950, 340, 50, 90, '#d35400', 4],
    [740, 390, 40, 55, '#229954', 4], [1080, 180, 60, 60, '#5d6d7e', 6], [1110, 380, 80, 50, '#8e7cc3', 2]];
  const D_PROGRAMS = S(1280, 520,
    T(320, 30, '[프로그램 1] 객체지향 개념 적용', { fs: 24, b: true, c: 'var(--accent)' }) +
    R(40, 60, 560, 200, { s: 'var(--line)', rx: 8 }) + `<rect x="40" y="60" width="560" height="40" rx="8" fill="var(--line)"/>` +
    T(60, 80, '콘솔', { fs: 18, a: 'start', c: 'var(--muted)' }) +
    L(64, 135, ['아우디의 현재 속도는 0입니다.', '벤츠의 현재 속도는 30입니다.', ['>>>', 'var(--muted)']], { fs: 22, lh: 40, c: 'var(--accent)' }) +
    T(320, 300, 'Car 클래스로 인스턴스 2개를 만들고', { fs: 20, c: 'var(--muted)' }) + T(320, 332, '메서드로 이름과 속도를 알아낸다', { fs: 20, c: 'var(--muted)' }) +
    T(960, 30, '[프로그램 2] 객체지향 사각형을 그리는 거북이', { fs: 24, b: true, c: 'var(--accent)' }) +
    R(680, 50, 560, 440, { s: 'var(--line)', rx: 8, f: '#ffffff' }) + `<rect x="680" y="50" width="560" height="34" rx="8" fill="var(--line)"/>` +
    T(700, 67, '거북이로 객체지향 사각형 그리기', { fs: 16, a: 'start', c: 'var(--muted)' }) +
    rects.map(([x, y, w, h, c, sw]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${c}" stroke-width="${sw}"/>` +
      `<polygon points="${x - 8},${y + h - 7} ${x + 8},${y + h} ${x - 8},${y + h + 7}" fill="#222"/>`).join('') +
    T(320, 420, '화면을 클릭할 때마다', { fs: 20, c: 'var(--muted)' }) + T(320, 452, 'Rectangle 인스턴스가 새로 생겨 사각형을 그린다', { fs: 20, c: 'var(--muted)' }) +
    A(560, 436, 700, 380, { c: 'var(--accent2)' })
  );

  // 자동차 → 클래스
  const D_CAR_CLASS = S(1280, 440,
    CAR(40, 150, 1.45, 'var(--muted)', '', { outline: true }) + T(190, 110, '실제 자동차', { fs: 24, b: true }) +
    T(190, 300, '색상 · 속도가 있고', { fs: 20, c: 'var(--muted)' }) + T(190, 330, '속도를 올리고 내릴 수 있다', { fs: 20, c: 'var(--muted)' }) +
    A(360, 200, 430, 200, { c: 'var(--accent2)', sw: 4 }) +
    R(440, 50, 360, 330, { s: 'var(--accent2)' }) + T(620, 80, '말로 쓴 클래스', { fs: 20, b: true, c: 'var(--accent2)' }) +
    L(465, 125, ['class 자동차 :', ['    # 자동차의 속성', 'var(--muted)'], ['    색상', 'var(--ok)', 1], ['    속도', 'var(--ok)', 1], ['    # 자동차의 기능', 'var(--muted)'], ['    속도 올리기()', 'var(--accent)', 1], ['    속도 내리기()', 'var(--accent)', 1]], { fs: 21, lh: 34 }) +
    A(810, 200, 870, 200, { c: 'var(--accent2)', sw: 4 }) +
    R(880, 50, 380, 330, { s: 'var(--accent)' }) + T(1070, 80, '파이썬 클래스', { fs: 20, b: true, c: 'var(--accent)' }) +
    L(900, 125, ['class Car :', ['    color = ""', 'var(--ok)', 1], ['    speed = 0', 'var(--ok)', 1], '', ['    def upSpeed(...)', 'var(--accent)', 1], ['    def downSpeed(...)', 'var(--accent)', 1]], { fs: 21, lh: 36 }) +
    T(640, 415, '속성 → 필드(field, 변수)          기능 → 메서드(method, 클래스 안의 함수)', { fs: 22, b: true })
  );

  // 클래스와 인스턴스
  const D_INSTANCES = S(1280, 500,
    R(30, 40, 430, 420, { s: 'var(--accent2)', d: true }) + T(245, 72, '자동차 설계도 (클래스)', { fs: 24, b: true, c: 'var(--accent2)' }) +
    CAR(125, 100, 1.0, 'var(--accent2)', '', { outline: true }) +
    L(60, 235, ['class Car :', '    color = ""', '    speed = 0', '    def upSpeed(self, value) : ...', '    def downSpeed(self, value) : ...'], { fs: 19, lh: 34 }) +
    T(245, 430, '틀만 있다 → 달릴 수 없다', { fs: 20, c: 'var(--muted)' }) +
    T(585, 120, '여러 번', { fs: 24, b: true, c: 'var(--danger)' }) + T(585, 152, '찍어 내기', { fs: 24, b: true, c: 'var(--danger)' }) +
    A(480, 200, 690, 110, { c: 'var(--danger)', sw: 4 }) + A(480, 250, 690, 250, { c: 'var(--danger)', sw: 4 }) + A(480, 300, 690, 390, { c: 'var(--danger)', sw: 4 }) +
    CAR(700, 60, 1.0, RED, 'myCar1') + CAR(700, 200, 1.0, BLUE, 'myCar2') + CAR(700, 340, 1.0, YEL, 'myCar3') +
    L(945, 100, ['myCar1 = Car()'], { fs: 22 }) + L(945, 240, ['myCar2 = Car()'], { fs: 22 }) + L(945, 380, ['myCar3 = Car()'], { fs: 22 }) +
    T(1080, 470, '실제 자동차 (인스턴스)', { fs: 22, b: true, c: 'var(--accent)' })
  );

  // 필드에 값 대입
  const fieldRow = (y, c, name, color) => CAR(60, y, 0.9, c, name) +
    R(330, y + 4, 330, 40, { s: 'var(--line)', rx: 6 }) + T(345, y + 24, `${name}.color`, { fs: 20, a: 'start', mono: true }) +
    R(330, y + 50, 330, 40, { s: 'var(--line)', rx: 6 }) + T(345, y + 70, `${name}.speed`, { fs: 20, a: 'start', mono: true }) +
    A(830, y + 24, 670, y + 24, { c: 'var(--danger)' }) + A(830, y + 70, 670, y + 70, { c: 'var(--danger)' }) +
    T(850, y + 24, `"${color}"`, { fs: 22, a: 'start', mono: true, b: true, c: 'var(--danger)' }) + T(850, y + 70, '0', { fs: 22, a: 'start', mono: true, b: true, c: 'var(--danger)' });
  const D_FIELDS = S(1280, 470,
    fieldRow(20, RED, 'myCar1', '빨강') + fieldRow(160, BLUE, 'myCar2', '파랑') + fieldRow(300, YEL, 'myCar3', '노랑') +
    T(1040, 60, '인스턴스.필드 = 값', { fs: 22, a: 'start', b: true, c: 'var(--accent)' }) +
    T(640, 450, '같은 클래스에서 만들었어도 인스턴스마다 필드 값을 따로 가진다', { fs: 22, c: 'var(--muted)' })
  );

  // self 의 정체
  const D_SELF = S(1280, 500,
    T(640, 36, 'myCar1.upSpeed(30) 을 실행하면 파이썬은 이렇게 바꿔서 호출한다', { fs: 24, b: true }) +
    B(80, 70, 420, 64, 'myCar1.upSpeed(30)', { fs: 26, mono: true, s: 'var(--accent)' }) +
    A(510, 102, 700, 102, { c: 'var(--accent2)', sw: 4 }) + T(605, 80, '자동 변환', { fs: 18, c: 'var(--accent2)' }) +
    B(710, 70, 490, 64, 'Car.upSpeed(myCar1, 30)', { fs: 26, mono: true, s: 'var(--accent2)' }) +
    R(330, 190, 620, 130, { s: 'var(--line)' }) +
    L(360, 230, ['def upSpeed(self, value) :', '    self.speed += value'], { fs: 26, lh: 50 }) +
    A(830, 140, 530, 215, { c: 'var(--ok)' }) + A(1150, 140, 690, 215, { c: 'var(--warn)' }) +
    T(700, 170, 'myCar1 → self', { fs: 20, b: true, c: 'var(--ok)' }) + T(1100, 185, '30 → value', { fs: 20, b: true, c: 'var(--warn)' }) +
    CAR(80, 360, 0.9, RED, 'myCar1') + A(300, 400, 400, 400, { c: 'var(--muted)' }) +
    R(410, 370, 300, 64, { s: 'var(--ok)', rx: 8 }) + T(560, 402, 'speed : 0 → 30', { fs: 24, mono: true, b: true, c: 'var(--ok)' }) +
    T(740, 390, 'self.speed 는 곧 myCar1.speed', { fs: 22, a: 'start', b: true, c: 'var(--ok)' }) +
    T(740, 425, 'self = “메서드를 부른 바로 그 인스턴스”', { fs: 20, a: 'start', c: 'var(--muted)' }) +
    T(640, 480, '그래서 메서드를 정의할 때 첫 번째 매개변수로 self 를 꼭 적는다', { fs: 20, c: 'var(--muted)' })
  );

  // 생성자 동작 순서
  const D_INIT = S(1280, 500,
    T(640, 34, 'myCar1 = Car("빨강", 30) 한 줄이 실행되는 순서', { fs: 26, b: true }) +
    B(40, 80, 360, 170, ['① 빈 인스턴스 생성', '(아직 필드 없음)'], { fs: 22, s: 'var(--muted)' }) +
    A(405, 165, 455, 165, { c: 'var(--accent2)', sw: 4 }) +
    R(460, 80, 400, 170, { s: 'var(--accent)' }) + T(660, 108, '② __init__ 자동 호출', { fs: 22, b: true, c: 'var(--accent)' }) +
    L(480, 150, ['__init__(self, "빨강", 30)', '  self.color = "빨강"', '  self.speed = 30'], { fs: 20, lh: 32 }) +
    A(865, 165, 915, 165, { c: 'var(--accent2)', sw: 4 }) +
    B(920, 80, 320, 170, ['③ 변수에 연결', 'myCar1 → 인스턴스'], { fs: 22, s: 'var(--ok)' }) +
    CAR(100, 300, 1.0, 'var(--muted)', '', { outline: true }) + T(215, 420, '빈 자동차', { fs: 20, c: 'var(--muted)' }) +
    CAR(560, 300, 1.0, RED, '') + T(665, 420, 'color="빨강", speed=30', { fs: 20, mono: true }) +
    CAR(970, 300, 1.0, RED, 'myCar1') + T(1075, 420, '바로 사용 가능!', { fs: 20, b: true, c: 'var(--ok)' }) +
    T(640, 475, '생성자 = 인스턴스를 만들 때 필드를 초기화해 주는 특별한 메서드 (직접 부르지 않아도 자동 실행)', { fs: 20, c: 'var(--muted)' })
  );

  // 인스턴스 변수
  const D_INSTVAR = S(1280, 460,
    R(40, 110, 340, 220, { s: 'var(--accent2)', d: true }) + T(210, 140, 'Car 클래스 (설계도)', { fs: 22, b: true, c: 'var(--accent2)' }) +
    L(70, 190, ['class Car :', '    color = ""', '    speed = 0'], { fs: 22, lh: 40 }) +
    A(390, 190, 560, 110, { c: 'var(--danger)', sw: 4 }) + A(390, 250, 560, 330, { c: 'var(--danger)', sw: 4 }) +
    CAR(570, 60, 0.9, RED, 'car1') + CAR(570, 280, 0.9, BLUE, 'car2') +
    T(800, 40, 'myCar1 = Car()', { fs: 22, a: 'start', mono: true, b: true }) +
    R(800, 65, 280, 44, { s: RED, rx: 6 }) + T(815, 87, 'myCar1.color', { fs: 21, a: 'start', mono: true }) +
    R(800, 118, 280, 44, { s: RED, rx: 6 }) + T(815, 140, 'myCar1.speed', { fs: 21, a: 'start', mono: true }) +
    T(800, 262, 'myCar2 = Car()', { fs: 22, a: 'start', mono: true, b: true }) +
    R(800, 287, 280, 44, { s: BLUE, rx: 6 }) + T(815, 309, 'myCar2.color', { fs: 21, a: 'start', mono: true }) +
    R(800, 340, 280, 44, { s: BLUE, rx: 6 }) + T(815, 362, 'myCar2.speed', { fs: 21, a: 'start', mono: true }) +
    T(1100, 115, '자기만의', { fs: 20, a: 'start', c: 'var(--muted)' }) + T(1100, 142, '공간', { fs: 20, a: 'start', c: 'var(--muted)' }) +
    T(1100, 335, '자기만의', { fs: 20, a: 'start', c: 'var(--muted)' }) + T(1100, 362, '공간', { fs: 20, a: 'start', c: 'var(--muted)' }) +
    T(640, 435, '인스턴스 변수: 인스턴스를 만들 때마다 인스턴스 안에 따로 생기는 변수', { fs: 22, b: true })
  );

  // 클래스 변수
  const D_CLASSVAR = S(1280, 480,
    R(40, 110, 360, 260, { s: 'var(--accent2)', d: true }) + T(220, 140, 'Car 클래스', { fs: 22, b: true, c: 'var(--accent2)' }) +
    L(70, 190, ['class Car :', '    color = ""', '    speed = 0'], { fs: 22, lh: 40 }) +
    R(90, 300, 260, 50, { s: 'var(--danger)', f: 'var(--card)', sw: 4, rx: 8 }) + T(220, 325, 'count = 2', { fs: 24, mono: true, b: true, c: 'var(--danger)' }) +
    T(800, 30, 'myCar1 = Car()', { fs: 22, a: 'start', mono: true, b: true }) +
    R(800, 50, 290, 40, { s: RED, rx: 6 }) + T(815, 70, 'myCar1.color', { fs: 20, a: 'start', mono: true }) +
    R(800, 96, 290, 40, { s: RED, rx: 6 }) + T(815, 116, 'myCar1.speed', { fs: 20, a: 'start', mono: true }) +
    R(800, 142, 290, 40, { s: 'var(--danger)', rx: 6, d: true }) + T(815, 162, 'Car.count', { fs: 20, a: 'start', mono: true, c: 'var(--danger)' }) +
    T(800, 250, 'myCar2 = Car()', { fs: 22, a: 'start', mono: true, b: true }) +
    R(800, 270, 290, 40, { s: BLUE, rx: 6 }) + T(815, 290, 'myCar2.color', { fs: 20, a: 'start', mono: true }) +
    R(800, 316, 290, 40, { s: BLUE, rx: 6 }) + T(815, 336, 'myCar2.speed', { fs: 20, a: 'start', mono: true }) +
    R(800, 362, 290, 40, { s: 'var(--danger)', rx: 6, d: true }) + T(815, 382, 'myCar2.count', { fs: 20, a: 'start', mono: true, c: 'var(--danger)' }) +
    A(795, 162, 360, 315, { c: 'var(--danger)', d: true }) + A(795, 382, 360, 335, { c: 'var(--danger)', d: true }) +
    T(560, 270, '공유', { fs: 26, b: true, c: 'var(--danger)' }) +
    CAR(560, 60, 0.8, RED, 'car1') + CAR(560, 390, 0.6, BLUE, '') +
    T(640, 460, '클래스 변수: 클래스 안에 딱 하나만 있고, 모든 인스턴스가 함께 쓰는 변수', { fs: 22, b: true })
  );

  // 이름 찾는 순서
  const D_LOOKUP = S(1280, 420,
    T(640, 34, 'myCar2.count 처럼 “인스턴스.이름” 을 읽을 때 파이썬이 찾는 순서', { fs: 24, b: true }) +
    B(40, 90, 270, 120, ['① 인스턴스', '(self.xxx 로 만든 것)'], { fs: 22, s: BLUE }) +
    A(315, 150, 365, 150, { c: 'var(--accent2)', sw: 4 }) +
    B(370, 90, 270, 120, ['② 클래스', '(클래스 변수 · 메서드)'], { fs: 22, s: 'var(--accent2)' }) +
    A(645, 150, 695, 150, { c: 'var(--accent2)', sw: 4 }) +
    B(700, 90, 270, 120, ['③ 부모 클래스', '(상속받은 것)'], { fs: 22, s: 'var(--ok)' }) +
    A(975, 150, 1025, 150, { c: 'var(--danger)', sw: 4 }) +
    B(1030, 90, 220, 120, ['없으면', 'AttributeError'], { fs: 22, s: 'var(--danger)' }) +
    T(640, 270, '먼저 찾은 것을 쓰고 멈춘다 → 인스턴스에 같은 이름이 있으면 클래스 변수는 가려진다', { fs: 22, c: 'var(--fg)' }) +
    T(640, 320, '쓰기(대입)는 다르다: myCar2.count = 5 는 인스턴스에 새 변수를 만든다 (클래스 변수는 그대로)', { fs: 22, c: 'var(--danger)' }) +
    T(640, 370, '클래스 변수를 바꾸려면 반드시  Car.count = …  처럼 클래스 이름으로 쓴다', { fs: 22, b: true, c: 'var(--accent)' })
  );

  // 상속 (그림 12-8)
  const D_INHERIT = S(1280, 560,
    U(440, 20, 400, 'Car (자동차)', [['color, speed', 'var(--ok)'], ['upSpeed(), downSpeed()', 'var(--ok)']], { s: 'var(--accent2)' }) +
    T(870, 50, '슈퍼 클래스 = 부모 클래스', { fs: 22, a: 'start', b: true, c: 'var(--accent2)' }) +
    T(870, 85, '공통 내용만 둔다', { fs: 20, a: 'start', c: 'var(--muted)' }) +
    U(80, 330, 400, 'Sedan(Car) 승용차', [['+ seatNum', 'var(--danger)'], ['+ getSeatNum()', 'var(--danger)']]) +
    U(800, 330, 400, 'Truck(Car) 트럭', [['+ capacity', 'var(--danger)'], ['+ getCapacity()', 'var(--danger)']]) +
    A(280, 330, 580, 146, { hollow: true, c: 'var(--fg)' }) + A(1000, 330, 700, 146, { hollow: true, c: 'var(--fg)' }) +
    T(420, 230, '상속', { fs: 26, b: true, c: 'var(--danger)' }) + T(860, 230, '상속', { fs: 26, b: true, c: 'var(--danger)' }) +
    CAR(170, 470, 0.7, BLUE, '') + TRUCK(900, 468, 0.72, YEL) +
    T(640, 380, '서브 클래스', { fs: 22, b: true, c: 'var(--accent)' }) + T(640, 412, '= 자식 클래스', { fs: 20, c: 'var(--muted)' }) +
    T(640, 520, '자식 = 부모의 필드 · 메서드 (그대로) + 자기만의 필드 · 메서드 (빨강)', { fs: 20, c: 'var(--muted)' })
  );

  // 메서드 오버라이딩 (그림 12-9 + Code12-07)
  const D_OVERRIDE = S(1280, 560,
    U(420, 20, 440, 'Car', ['speed = 0', ['upSpeed(): 속도 올리기', 'var(--accent2)']], { s: 'var(--accent2)' }) +
    U(60, 300, 480, 'Sedan(Car)', [['upSpeed(): 올리고 150 제한', 'var(--danger)']], { s: 'var(--danger)' }) +
    U(740, 300, 480, 'Truck(Car)', [['pass  (재정의 없음)', 'var(--muted)']]) +
    A(300, 300, 560, 146, { hollow: true, c: 'var(--fg)' }) + A(980, 300, 720, 146, { hollow: true, c: 'var(--fg)' }) +
    T(300, 270, '재정의(오버라이딩)', { fs: 22, b: true, c: 'var(--danger)' }) +
    T(300, 420, 'sedan1.upSpeed(200)', { fs: 22, mono: true, b: true }) + T(300, 455, '→ Sedan 의 upSpeed() 실행 → 150', { fs: 20, c: 'var(--danger)' }) +
    T(980, 420, 'truck1.upSpeed(200)', { fs: 22, mono: true, b: true }) + T(980, 455, '→ 물려받은 Car 의 upSpeed() → 200', { fs: 20, c: 'var(--accent2)' }) +
    T(640, 525, '같은 이름의 메서드가 자식에 있으면 자식 것이, 없으면 부모 것이 실행된다', { fs: 22, b: true })
  );

  // super()
  const D_SUPER = S(1280, 480,
    R(40, 40, 520, 180, { s: 'var(--accent2)' }) + T(60, 70, 'class Car (슈퍼 클래스)', { fs: 20, a: 'start', b: true, c: 'var(--accent2)' }) +
    L(70, 115, ["value = '슈퍼 값'", 'def carMethod(self) :', "    print('슈퍼 클래스 메서드 실행~~')"], { fs: 19, lh: 34 }) +
    R(640, 40, 600, 260, { s: 'var(--accent)' }) + T(660, 70, 'class Sedan(Car) (서브 클래스)', { fs: 20, a: 'start', b: true, c: 'var(--accent)' }) +
    L(670, 115, ["value = '서브 값'", 'def carMethod(self) :', ['    super().carMethod()', 'var(--danger)', 1], "    print('서브 클래스 메서드 실행~~')", ['    print(super().value)', 'var(--danger)', 1]], { fs: 19, lh: 36 }) +
    A(660, 187, 480, 150, { c: 'var(--danger)' }) + A(660, 259, 240, 118, { c: 'var(--danger)' }) +
    T(560, 245, '① 부모 메서드 실행', { fs: 18, c: 'var(--danger)' }) + T(420, 290, '③ 부모의 value', { fs: 18, c: 'var(--danger)' }) +
    R(40, 330, 1200, 130, { s: 'var(--line)' }) + T(60, 355, 'sedan1.carMethod() 출력', { fs: 20, a: 'start', b: true, c: 'var(--muted)' }) +
    L(70, 395, ['슈퍼 클래스 메서드 실행~~', '서브 클래스 메서드 실행~~', '슈퍼 값'], { fs: 20, lh: 28 }) +
    T(760, 395, 'self.value 였다면 → 서브 값', { fs: 22, a: 'start', c: 'var(--muted)' }) +
    T(760, 430, 'super().value → 부모의 슈퍼 값', { fs: 22, a: 'start', b: true, c: 'var(--danger)' })
  );

  // [프로그램 2] 클래스 구조
  const D_SHAPE = S(1280, 540,
    U(40, 20, 470, 'Shape (슈퍼 클래스)', ['myTurtle = None', 'cx, cy = 0, 0', ['__init__(): 거북이 생성', 'var(--accent2)'], ['setPen(): 펜 색 · 두께 무작위', 'var(--accent2)'], ['drawShape(): pass', 'var(--muted)']], { s: 'var(--accent2)' }) +
    U(40, 330, 470, 'Rectangle(Shape) (서브 클래스)', ['width, height', ['__init__(x, y): 중심 · 크기', 'var(--accent)'], ['drawShape(): 네모 그리기', 'var(--danger)']]) +
    A(275, 330, 275, 262, { hollow: true, c: 'var(--fg)' }) +
    T(300, 296, '상속', { fs: 20, a: 'start', b: true, c: 'var(--danger)' }) +
    T(700, 40, '클릭 한 번에 일어나는 일', { fs: 24, a: 'start', b: true }) +
    B(620, 80, 560, 60, '① 화면 클릭 (x, y)', { fs: 22, s: 'var(--muted)' }) +
    A(900, 142, 900, 168, { c: 'var(--accent2)' }) +
    B(620, 170, 560, 60, '② screenLeftClick(x, y) 호출', { fs: 22, mono: true, s: 'var(--muted)' }) +
    A(900, 232, 900, 258, { c: 'var(--accent2)' }) +
    B(620, 260, 560, 80, ['③ rect = Rectangle(x, y)', '새 거북이 생성 + 크기 무작위'], { fs: 21, s: 'var(--accent)' }) +
    A(900, 342, 900, 368, { c: 'var(--accent2)' }) +
    B(620, 370, 560, 80, ['④ rect.drawShape()', 'setPen() → 네 변 그리기'], { fs: 21, s: 'var(--danger)' }) +
    T(900, 490, '클릭할 때마다 새 인스턴스(새 거북이)가 생긴다', { fs: 20, c: 'var(--muted)' })
  );

  // 사각형 좌표
  const D_RECT = S(1280, 520,
    `<line x1="60" y1="470" x2="720" y2="470" stroke="var(--line)" stroke-width="2"/><line x1="90" y1="500" x2="90" y2="30" stroke="var(--line)" stroke-width="2"/>` +
    T(730, 470, 'x', { fs: 20, a: 'start', c: 'var(--muted)' }) + T(90, 20, 'y', { fs: 20, c: 'var(--muted)' }) +
    `<rect x="220" y="110" width="360" height="260" fill="none" stroke="var(--accent)" stroke-width="6"/>` +
    `<circle cx="400" cy="240" r="8" fill="var(--danger)"/>` + T(400, 272, '(cx, cy) 클릭한 곳', { fs: 20, b: true, c: 'var(--danger)' }) +
    `<circle cx="220" cy="370" r="9" fill="var(--ok)"/>` + T(210, 400, '(sx1, sy1) 출발 · 도착', { fs: 20, a: 'end', b: true, c: 'var(--ok)' }) +
    `<circle cx="580" cy="110" r="9" fill="var(--warn)"/>` + T(590, 85, '(sx2, sy2)', { fs: 20, a: 'start', b: true, c: 'var(--warn)' }) +
    T(200, 100, '(sx1, sy2)', { fs: 18, a: 'end', c: 'var(--muted)' }) + T(600, 395, '(sx2, sy1)', { fs: 18, a: 'start', c: 'var(--muted)' }) +
    T(185, 240, '①↑', { fs: 24, b: true, c: 'var(--accent2)' }) + T(400, 90, '②→', { fs: 24, b: true, c: 'var(--accent2)' }) +
    T(612, 240, '③↓', { fs: 24, b: true, c: 'var(--accent2)' }) + T(400, 395, '④←', { fs: 24, b: true, c: 'var(--accent2)' }) +
    `<line x1="220" y1="430" x2="580" y2="430" stroke="var(--muted)" stroke-width="2"/>` + T(400, 448, 'width', { fs: 18, c: 'var(--muted)' }) +
    R(780, 60, 470, 330, { s: 'var(--line)' }) +
    L(800, 100, ['sx1 = cx - width / 2', 'sy1 = cy - height / 2', 'sx2 = cx + width / 2', 'sy2 = cy + height / 2'], { fs: 22, lh: 44 }) +
    T(800, 300, '거북이 좌표는 위쪽이 +y', { fs: 20, a: 'start', c: 'var(--muted)' }) +
    T(800, 335, '→ sy1 이 아래, sy2 가 위', { fs: 20, a: 'start', c: 'var(--muted)' })
  );

  // 특별한 메서드 연결
  const spRow = (y, left, right, c) => B(60, y, 440, 52, left, { fs: 22, mono: true, b: false, s: 'var(--muted)', rx: 8 }) +
    A(510, y + 26, 640, y + 26, { c: c || 'var(--accent2)' }) + B(650, y, 570, 52, right, { fs: 22, mono: true, b: false, s: c || 'var(--accent2)', rx: 8 });
  const D_SPECIAL = S(1280, 520,
    T(280, 30, '내가 쓰는 코드', { fs: 22, b: true }) + T(935, 30, '파이썬이 대신 부르는 특별한 메서드', { fs: 22, b: true, c: 'var(--accent2)' }) +
    spRow(60, 'myLine1 = Line(100)', 'Line.__init__(myLine1, 100)', 'var(--ok)') +
    spRow(128, 'print(myLine1)', 'myLine1.__repr__()') +
    spRow(196, 'myLine1 + myLine2', 'myLine1.__add__(myLine2)') +
    spRow(264, 'myLine1 < myLine2', 'myLine1.__lt__(myLine2)') +
    spRow(332, 'myLine1 == myLine2', 'myLine1.__eq__(myLine2)') +
    spRow(400, 'del(myLine1)', 'myLine1.__del__()', 'var(--danger)') +
    T(640, 490, '이름 앞뒤에 밑줄 두 개(__) → “던더(dunder) 메서드” 라고도 부른다', { fs: 20, c: 'var(--muted)' })
  );

  // 추상 메서드
  const D_ABSTRACT = S(1280, 500,
    U(390, 20, 500, 'SuperClass', [['def method(self):', 'var(--fg)'], ['    raise NotImplementedError()', 'var(--danger)']], { s: 'var(--accent2)' }) +
    T(910, 60, '“자식이 꼭 채워라”', { fs: 22, a: 'start', b: true, c: 'var(--accent2)' }) + T(910, 95, '빈 껍질 메서드', { fs: 20, a: 'start', c: 'var(--muted)' }) +
    U(60, 280, 480, 'SubClass1(SuperClass)', [['def method(self): print(...)', 'var(--ok)']], { s: 'var(--ok)' }) +
    U(740, 280, 480, 'SubClass2(SuperClass)', [['pass  (오버라이딩 안 함)', 'var(--muted)']], { s: 'var(--danger)', d: true }) +
    A(300, 280, 560, 146, { hollow: true, c: 'var(--fg)' }) + A(980, 280, 720, 146, { hollow: true, c: 'var(--fg)' }) +
    T(300, 410, 'sub1.method()', { fs: 22, mono: true, b: true }) + T(300, 445, '→ 자기 메서드 실행 (정상)', { fs: 20, c: 'var(--ok)' }) +
    T(980, 410, 'sub2.method()', { fs: 22, mono: true, b: true }) + T(980, 445, '→ 부모의 raise 실행 → 오류!', { fs: 20, c: 'var(--danger)' }) +
    T(640, 485, 'pass 로 두면 조용히 넘어가지만, raise 로 두면 “깜빡 잊은 오버라이딩”을 바로 알 수 있다', { fs: 20, c: 'var(--muted)' })
  );

  // 스레드 (그림 12-10)
  const D_THREAD = S(1280, 460,
    T(150, 80, '일반 프로그램', { fs: 24, b: true }) +
    A(290, 80, 560, 80, { c: 'var(--accent2)', sw: 4 }) + A(560, 80, 830, 80, { c: 'var(--accent)', sw: 4 }) + A(830, 80, 1100, 80, { c: 'var(--ok)', sw: 4 }) +
    T(425, 52, '작업 1', { fs: 22, b: true, c: 'var(--accent2)' }) + T(695, 52, '작업 2', { fs: 22, b: true, c: 'var(--accent)' }) + T(965, 52, '작업 3', { fs: 22, b: true, c: 'var(--ok)' }) +
    T(695, 120, '앞 작업이 끝나야 다음 작업 시작 (순차 실행)', { fs: 20, c: 'var(--muted)' }) +
    `<line x1="40" y1="160" x2="1240" y2="160" stroke="var(--line)" stroke-width="2" stroke-dasharray="8 8"/>` +
    T(150, 270, '멀티 스레드', { fs: 24, b: true }) +
    A(290, 210, 700, 210, { c: 'var(--accent2)', sw: 4 }) + A(290, 280, 900, 280, { c: 'var(--accent)', sw: 4 }) + A(420, 350, 1100, 350, { c: 'var(--ok)', sw: 4 }) +
    T(495, 188, '작업 1', { fs: 22, b: true, c: 'var(--accent2)' }) + T(595, 258, '작업 2', { fs: 22, b: true, c: 'var(--accent)' }) + T(760, 328, '작업 3', { fs: 22, b: true, c: 'var(--ok)' }) +
    T(695, 410, '여러 작업이 겹쳐서 “동시에” 진행 → 출력 순서가 섞인다', { fs: 20, c: 'var(--muted)' }) +
    T(695, 440, '(실제로는 아주 빠르게 번갈아 실행하는 경우가 많다)', { fs: 18, c: 'var(--muted)' })
  );

  // 스레드 vs 프로세스
  const D_PROC = S(1280, 480,
    T(320, 30, '멀티 스레드 (threading)', { fs: 24, b: true, c: 'var(--accent)' }) +
    R(40, 60, 560, 300, { s: 'var(--accent)' }) + T(320, 90, '프로그램(프로세스) 1개', { fs: 20, b: true }) +
    R(70, 115, 500, 70, { s: 'var(--line)', rx: 8 }) + T(320, 150, '공유 메모리: car1, car2, car3 …', { fs: 20 }) +
    B(70, 215, 150, 60, '스레드1', { fs: 20, s: 'var(--accent2)' }) + B(245, 215, 150, 60, '스레드2', { fs: 20, s: 'var(--accent2)' }) + B(420, 215, 150, 60, '스레드3', { fs: 20, s: 'var(--accent2)' }) +
    T(320, 320, '한 프로그램 안에서 일을 나눈다', { fs: 20, c: 'var(--muted)' }) +
    T(960, 30, '멀티 프로세싱 (multiprocessing)', { fs: 24, b: true, c: 'var(--danger)' }) +
    B(680, 60, 170, 190, ['프로세스1', '메모리', '따로'], { fs: 20, s: 'var(--danger)' }) +
    B(875, 60, 170, 190, ['프로세스2', '메모리', '따로'], { fs: 20, s: 'var(--danger)' }) +
    B(1070, 60, 170, 190, ['프로세스3', '메모리', '따로'], { fs: 20, s: 'var(--danger)' }) +
    B(680, 290, 170, 60, 'CPU 코어1', { fs: 20, s: 'var(--muted)' }) + B(875, 290, 170, 60, 'CPU 코어2', { fs: 20, s: 'var(--muted)' }) + B(1070, 290, 170, 60, 'CPU 코어3', { fs: 20, s: 'var(--muted)' }) +
    A(765, 252, 765, 288) + A(960, 252, 960, 288) + A(1155, 252, 1155, 288) +
    T(960, 385, '프로그램을 여러 개 띄워 CPU 여러 개를 쓴다', { fs: 20, c: 'var(--muted)' }) +
    R(40, 410, 1200, 56, { s: 'var(--warn)', rx: 10 }) +
    T(640, 438, '⚠ 이 웹 강좌(브라우저 속 파이썬)에서는 둘 다 실행할 수 없다 → 집 PC 의 파이썬(IDLE)에서 실행', { fs: 21, b: true, c: 'var(--fg)' })
  );

  // 번갈아 실행 (스레드 없이)
  const D_TURN = S(1280, 360,
    T(640, 30, '스레드 없이 “한 걸음씩 번갈아” 실행하기', { fs: 24, b: true }) +
    [0, 1, 2].map((r) => [0, 1, 2].map((k) => {
      const x = 120 + (r * 3 + k) * 118, c = [RED, BLUE, YEL][k];
      return R(x, 80, 104, 70, { s: c, rx: 8 }) + T(x + 52, 105, ['@차1', '#차2', '$차3'][k], { fs: 20, b: true, c }) + T(x + 52, 132, `${r + 1}번째`, { fs: 16, c: 'var(--muted)' });
    }).join('')).join('') +
    T(120, 190, 'for 반복 한 바퀴 = 세 대가 한 걸음씩', { fs: 20, a: 'start', c: 'var(--muted)' }) +
    L(120, 240, ['for _ in range(0, 3) :', '    car1.runStep();  car2.runStep();  car3.runStep()'], { fs: 22, lh: 40 }) +
    T(640, 340, '결과 모양은 스레드와 비슷하지만 순서가 항상 같다 (진짜 동시 실행은 아님)', { fs: 20, c: 'var(--muted)' })
  );

  return {
    id: 'ch12',
    no: '12',
    title: '객체지향 프로그래밍',
    subtitle: '클래스 · 인스턴스 · 상속',
    summary: '클래스와 인스턴스, 필드와 메서드, 생성자(__init__), 인스턴스 변수와 클래스 변수, 상속과 메서드 오버라이딩, 특별한 메서드와 추상 메서드, 멀티 스레드를 배우고 객체지향 방식으로 사각형을 그리는 거북이 프로그램을 만듭니다.',
    goals: [
      '객체지향 프로그래밍의 개념과 클래스 · 인스턴스의 관계를 설명할 수 있다',
      '필드와 메서드를 가진 클래스를 선언하고, self 의 역할을 설명할 수 있다',
      '생성자 __init__() 으로 인스턴스를 만들면서 필드를 초기화할 수 있다',
      '인스턴스 변수와 클래스 변수를 구분해 사용할 수 있다',
      '상속 · 메서드 오버라이딩 · super() 로 기존 클래스를 확장할 수 있다',
      '__repr__, __add__, __lt__ 같은 특별한 메서드와 추상 메서드를 활용할 수 있다',
      '멀티 스레드 · 멀티 프로세싱의 개념을 설명할 수 있다'
    ],
    sections: [
      // ================= 12-1 =================
      {
        id: 'ch12-1',
        title: '객체지향과 클래스',
        minutes: 50,
        goals: [
          '객체지향 프로그래밍이 무엇인지, 왜 쓰는지 설명할 수 있다',
          '클래스의 필드(속성)와 메서드(기능)를 구분할 수 있다',
          '메서드의 첫 번째 매개변수 self 의 의미를 설명할 수 있다',
          '클래스로 인스턴스를 만들고 필드와 메서드를 사용할 수 있다'
        ],
        flow: [['도입: 이 장에서 만들 프로그램', 5], ['객체지향 · 클래스의 개념', 10], ['Car 클래스와 self', 12], ['인스턴스 생성 · 사용 (Code12-02)', 15], ['정리 · 퀴즈', 8]],
        content: [
          { type: 'h', text: '이 장에서 만들 프로그램' },
          { type: 'p', html: '이번 장에서는 파이썬의 <b>객체지향 프로그래밍(Object-Oriented Programming, OOP)</b>을 배웁니다. 배운 내용으로 두 개의 프로그램을 완성합니다.' },
          { type: 'list', items: [
            '<b>[프로그램 1] 객체지향 개념 적용</b> — 자동차 클래스를 만들고, 이름과 속도가 다른 자동차 두 대(인스턴스)를 만들어 정보를 출력합니다.',
            '<b>[프로그램 2] 객체지향 사각형을 그리는 거북이</b> — 도형(Shape) 클래스를 상속받은 사각형(Rectangle) 클래스를 만들고, 화면을 클릭할 때마다 새 거북이가 태어나 무작위 색 · 크기의 사각형을 그립니다.'
          ] },
          { type: 'figure', html: D_PROGRAMS, caption: '이 장에서 만들 두 프로그램의 실행 모습' },

          { type: 'h', text: '객체지향 프로그래밍이란?' },
          { type: 'p', html: '지금까지는 변수와 함수를 따로따로 만들어 위에서 아래로 실행하는 방식으로 프로그램을 짰습니다. 프로그램이 커지면 “이 변수는 어느 함수가 쓰는 거지?” 하고 헷갈리기 시작합니다.' },
          { type: 'p', html: '객체지향 프로그래밍은 <mark>서로 관련 있는 데이터(변수)와 기능(함수)을 하나로 묶어 “객체”로 다루는 방법</mark>입니다. 자동차라면 색상 · 속도라는 데이터와 “속도 올리기 · 내리기”라는 기능을 한 덩어리로 묶어 두는 것이죠. 이 묶음의 <b>설계도</b>가 바로 <b>클래스(class)</b>입니다.' },
          { type: 'callout', kind: 'tip', title: '비유: 붕어빵 틀과 붕어빵', html: '클래스는 <b>붕어빵 틀</b>, 인스턴스(객체)는 틀로 찍어 낸 <b>붕어빵</b>입니다. 틀은 하나지만 붕어빵은 여러 개 만들 수 있고, 붕어빵마다 속(팥 · 슈크림)이 다를 수 있습니다. 클래스 하나로 인스턴스를 여러 개 만들고, 인스턴스마다 필드 값이 다를 수 있다는 뜻입니다.' },

          { type: 'h', text: '클래스의 모양과 생성' },
          { type: 'p', html: '클래스는 <code>class</code> 키워드로 만듭니다. 함수(<code>def</code>)처럼 콜론(<code>:</code>)을 붙이고, 내용은 들여쓰기해서 씁니다.' },
          { type: 'code', title: '클래스의 기본 형식', run: false, code: `class 클래스명 :
    # 이 부분에 관련 코드 구현` },
          { type: 'p', html: '실제 자동차를 떠올려 봅시다. 자동차에는 <b>색상 · 속도</b> 같은 <b>속성</b>이 있고, <b>속도 올리기 · 속도 내리기</b> 같은 <b>기능</b>이 있습니다. 이것을 그대로 클래스로 옮기면 됩니다.' },
          { type: 'figure', html: D_CAR_CLASS, caption: '그림 12-1 자동차를 클래스로 구현 — 속성은 필드로, 기능은 메서드로' },
          { type: 'list', items: [
            '자동차의 <b>속성</b>은 지금까지 쓰던 변수처럼 만듭니다. 클래스 안의 변수를 <b>필드(field)</b>라고 합니다.',
            '자동차의 <b>기능</b>은 지금까지 쓰던 함수 모양으로 만듭니다.',
            '클래스 안에 만든 함수는 함수라고 하지 않고 <b>메서드(method)</b>라고 부릅니다.'
          ] },
          { type: 'code', title: '자동차 클래스의 설계 (말로 쓴 코드)', run: false, code: `class Car :
    # 자동차의 필드
    색상 = ""
    현재_속도 = 0

    # 자동차의 메서드
    def upSpeed(증가할_속도량) :
        # 현재 속도에서 증가할_속도량만큼 속도를 올리는 코드

    def downSpeed(감소할_속도량) :
        # 현재 속도에서 감소할_속도량만큼 속도를 내리는 코드`,
            desc: '아직 실행할 수 없는 “설계 메모”입니다. 메서드 안에 주석만 있으면 문법 오류가 납니다. 이제 이것을 완전한 파이썬 코드로 바꿔 봅니다.' },

          { type: 'h', text: '자동차 클래스를 완전한 파이썬 코드로' },
          { type: 'code', title: 'Code12-01. 자동차 클래스', code: `class Car :
    color = ""
    speed = 0

    def upSpeed(self, value) :
        self.speed += value

    def downSpeed(self, value) :
        self.speed -= value`,
            desc: '실행해도 <b>아무것도 출력되지 않습니다</b>. 설계도(클래스)만 만들었을 뿐, 아직 자동차(인스턴스)를 만들지도, 메서드를 부르지도 않았기 때문입니다. <code>2~3행</code>이 필드, <code>5~9행</code>이 메서드입니다.' },
          { type: 'p', html: '메서드의 첫 번째 매개변수 <code>self</code> 는 “<b>이 메서드를 부른 인스턴스 자기 자신</b>”을 뜻합니다. <code>self.speed</code> 는 “나(이 자동차)의 speed” 라는 뜻이 됩니다. 메서드 안에서 필드를 쓰려면 반드시 <code>self.</code> 를 붙여야 합니다.' },
          { type: 'figure', html: D_SELF, caption: 'self 의 정체 — 메서드를 부른 인스턴스가 self 로 자동 전달된다' },
          { type: 'callout', kind: 'warn', title: 'self 를 빠뜨리면?', html: '<ul><li><code>def upSpeed(value):</code> 처럼 self 를 빼면, 호출할 때 인스턴스가 자동으로 넘어가 <code>TypeError: ... takes 1 positional argument but 2 were given</code> 오류가 납니다.</li><li>메서드 안에서 <code>speed += value</code> 처럼 <code>self.</code> 를 빼면 지역 변수 speed 를 찾게 되어 <code>UnboundLocalError</code> 가 납니다.</li></ul>' },

          { type: 'h', text: '필드를 사용하지 않는 메서드' },
          { type: 'p', html: 'Code12-01 에 다음과 같이 필드를 쓰지 않는 메서드를 추가해 봅시다. 강의자료에서는 이런 메서드는 <code>self</code> 를 생략할 수 있다고 소개합니다.' },
          { type: 'code', title: 'Code12-01 에 메서드 추가: printMessage()', code: `class Car :
    color = ""
    speed = 0

    def upSpeed(self, value) :
        self.speed += value

    def downSpeed(self, value) :
        self.speed -= value

    def printMessage() :
        print("시험 출력이다.")

Car.printMessage()     # 클래스 이름으로 부르면 동작한다`,
            expect: '시험 출력이다.',
            desc: '<code>11~12행</code>의 printMessage() 는 필드를 쓰지 않으므로 self 가 없습니다. <code>Car.printMessage()</code> 처럼 <b>클래스 이름으로</b> 부르면 잘 동작합니다.' },
          { type: 'callout', kind: 'warn', title: '주의: 인스턴스로 부르면 오류', html: 'self 가 없는 메서드를 인스턴스로 부르면(<code>myCar1.printMessage()</code>) 파이썬이 인스턴스를 첫 번째 인수로 자동으로 넘기기 때문에 오류가 납니다. 아래 예제로 확인해 보세요. 그래서 실무에서는 <b>메서드에는 항상 self 를 쓰는 습관</b>을 들이는 것이 안전합니다.' },
          { type: 'code', title: '추가 예제. self 없는 메서드를 인스턴스로 호출하면', expectError: true, code: `class Car :
    speed = 0

    def printMessage() :
        print("시험 출력이다.")

myCar1 = Car()
myCar1.printMessage()`,
            expect: `Traceback (most recent call last):
  File "main.py", line 8, in <module>
    myCar1.printMessage()
    ~~~~~~~~~~~~~~~~~~~^^
TypeError: Car.printMessage() takes 0 positional arguments but 1 was given`,
            desc: '“인수를 0개 받는데 1개가 들어왔다”는 오류입니다. 눈에 보이지 않게 넘어간 1개가 바로 <code>myCar1</code>(self 자리)입니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: @staticmethod', html: '인스턴스와 상관없는 메서드를 인스턴스로도 부르고 싶다면 메서드 위에 <code>@staticmethod</code> 를 붙입니다. 그러면 self 없이도 <code>Car.printMessage()</code>, <code>myCar1.printMessage()</code> 둘 다 동작합니다.<pre><code>class Car :\n    @staticmethod\n    def printMessage() :\n        print("시험 출력이다.")</code></pre>' },

          { type: 'h', text: '인스턴스의 생성' },
          { type: 'p', html: '클래스는 설계도일 뿐이므로 실제로 사용하려면 설계도로 “실물”을 만들어야 합니다. 클래스로 만든 실물을 <b>인스턴스(instance)</b> 또는 <b>객체(object)</b>라고 합니다. 자동차 설계도 한 장으로 자동차를 여러 대 생산하는 것과 같습니다.' },
          { type: 'figure', html: D_INSTANCES, caption: '그림 12-2, 12-3 클래스와 인스턴스 — 설계도 하나로 인스턴스를 여러 개 찍어 낸다' },
          { type: 'p', html: '인스턴스는 <code>인스턴스 = 클래스명()</code> 형식으로 만듭니다. 함수를 호출하듯 클래스 이름 뒤에 괄호를 붙입니다.' },
          { type: 'code', title: '자동차 세 대의 인스턴스 생성', code: `class Car :
    color = ""
    speed = 0

myCar1 = Car()
myCar2 = Car()
myCar3 = Car()

print(type(myCar1))
print(isinstance(myCar2, Car))
print(myCar1 is myCar2)`,
            expect: `<class '__main__.Car'>
True
False`,
            desc: '<code>type()</code> 으로 보면 myCar1 은 Car 클래스의 인스턴스입니다. <code>isinstance(값, 클래스)</code> 는 “이 값이 그 클래스의 인스턴스인가?”를 알려 줍니다. 같은 클래스로 만들었어도 myCar1 과 myCar2 는 <b>서로 다른</b> 인스턴스입니다(<code>is</code> 가 False).' },

          { type: 'h', text: '필드에 값 대입과 메서드 호출' },
          { type: 'p', html: '인스턴스의 필드는 <code>인스턴스.필드명 = 값</code> 으로 값을 넣고, 메서드는 <code>인스턴스.메서드()</code> 로 부릅니다. 점(<code>.</code>)은 “~의” 라고 읽으면 쉽습니다. <code>myCar1.color</code> → “myCar1 의 color”.' },
          { type: 'figure', html: D_FIELDS, caption: '그림 12-4 인스턴스의 필드에 값을 대입하는 개념' },
          { type: 'code', title: '필드에 값 대입 · 메서드 호출', code: `class Car :
    color = ""
    speed = 0

    def upSpeed(self, value) :
        self.speed += value

    def downSpeed(self, value) :
        self.speed -= value

myCar1 = Car()
myCar2 = Car()
myCar3 = Car()

myCar1.color = "빨강"
myCar1.speed = 0
myCar2.color = "파랑"
myCar2.speed = 0
myCar3.color = "노랑"
myCar3.speed = 0

myCar1.upSpeed(30)
myCar2.downSpeed(60)
print(myCar1.color, myCar1.speed)
print(myCar2.color, myCar2.speed)
print(myCar3.color, myCar3.speed)`,
            expect: `빨강 30
파랑 -60
노랑 0`,
            desc: '강의자료의 코드 조각을 모아 실행할 수 있게 만든 것입니다. 속도 0 에서 downSpeed(60) 을 하니 myCar2 의 속도가 -60 이 되었네요. 실제 자동차라면 말이 안 되지요? 이런 문제를 막는 방법은 SELF STUDY 12-1 에서 연습합니다.' },

          { type: 'h', text: '클래스의 완전한 작동 구현' },
          { type: 'code', title: 'Code12-02. 클래스의 완전한 작동', code: `## 클래스 선언 부분 ##
class Car :
    color = ""
    speed = 0

    def upSpeed(self, value) :
        self.speed += value

    def downSpeed(self, value) :
        self.speed -= value

## 메인 코드 부분 ##
myCar1 = Car()
myCar1.color = "빨강"
myCar1.speed = 0

myCar2 = Car()
myCar2.color = "파랑"
myCar2.speed = 0

myCar3 = Car()
myCar3.color = "노랑"
myCar3.speed = 0

myCar1.upSpeed(30)
print("자동차1의 색상은 %s이며, 현재 속도는 %dkm입니다." % (myCar1.color, myCar1.speed))

myCar2.upSpeed(60)
print("자동차2의 색상은 %s이며, 현재 속도는 %dkm입니다." % (myCar2.color, myCar2.speed))

myCar3.upSpeed(0)
print("자동차3의 색상은 %s이며, 현재 속도는 %dkm입니다." % (myCar3.color, myCar3.speed))`,
            expect: `자동차1의 색상은 빨강이며, 현재 속도는 30km입니다.
자동차2의 색상은 파랑이며, 현재 속도는 60km입니다.
자동차3의 색상은 노랑이며, 현재 속도는 0km입니다.`,
            desc: '<code>2~10행</code>은 클래스 선언 부분, <code>13~32행</code>은 메인 코드 부분입니다. 같은 upSpeed() 메서드를 불러도 <b>어느 인스턴스로 불렀는지</b>에 따라 바뀌는 speed 가 다릅니다. self 덕분입니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: f-string 으로 바꿔 쓰기', html: '<code>%s</code>, <code>%d</code> 서식 대신 f-string 을 쓰면 더 읽기 쉽습니다.<pre><code>print(f"자동차1의 색상은 {myCar1.color}이며, 현재 속도는 {myCar1.speed}km입니다.")</code></pre>' },

          { type: 'h', text: '클래스 사용 순서' },
          { type: 'table', caption: '클래스를 사용하는 3단계', head: ['단계', '작업', '형식', '예'], rows: [
            ['1단계', '클래스 선언', '<code>class 클래스명 :</code><br>&nbsp;&nbsp;# 필드 선언<br>&nbsp;&nbsp;# 메서드 선언', '<code>class Car :</code><br>&nbsp;&nbsp;<code>color = ""</code><br>&nbsp;&nbsp;<code>def upSpeed(self, value) :</code> …'],
            ['2단계', '인스턴스 생성', '<code>인스턴스 = 클래스명()</code>', '<code>myCar1 = Car()</code>'],
            ['3단계', '필드나 메서드 사용', '<code>인스턴스.필드명 = 값</code><br><code>인스턴스.메서드()</code>', '<code>myCar1.color = "빨강"</code><br><code>myCar1.upSpeed(30)</code>']
          ] },

          { type: 'h', text: '>>> 셸에서 인스턴스 다뤄 보기' },
          { type: 'p', html: '대화형 모드(콘솔의 <code>&gt;&gt;&gt;</code> 셸)에서는 인스턴스의 필드 값을 바로 확인할 수 있어 편리합니다. 클래스 블록을 다 쓴 다음에는 빈 줄로 블록을 닫습니다.' },
          { type: 'code', repl: true, title: '대화형 모드에서 인스턴스 만들기', code: `class Car :
    color = ""
    speed = 0
    def upSpeed(self, value) :
        self.speed += value

myCar = Car()
myCar.upSpeed(30)
myCar.upSpeed(20)
myCar.speed
myCar.color = "초록"
myCar.color`,
            expect: `>>> class Car :
...     color = ""
...     speed = 0
...     def upSpeed(self, value) :
...         self.speed += value
...
>>> myCar = Car()
>>> myCar.upSpeed(30)
>>> myCar.upSpeed(20)
>>> myCar.speed
50
>>> myCar.color = "초록"
>>> myCar.color
'초록'
>>>` },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 파이썬에서는 모든 것이 객체', html: '사실 우리는 처음부터 객체를 쓰고 있었습니다. <code>"hello".upper()</code> 의 <code>upper()</code> 는 문자열(str 클래스) 인스턴스의 메서드이고, <code>리스트.append()</code> 도 list 클래스의 메서드입니다. <code>type(10)</code> 을 실행하면 <code>&lt;class \'int\'&gt;</code> 가 나옵니다. 숫자조차 int 클래스의 인스턴스입니다.' }
        ],
        practice: [
          { title: 'SELF STUDY 12-1. 최고 속도 제한', level: 1,
            desc: '<p>Code12-02 의 <code>upSpeed()</code> 메서드를 수정해서 속도가 150 을 넘으면 최대 150 으로 조절되게 하세요. 예를 들어 <code>upSpeed(200)</code> 을 해도 출력은 150km 가 되어야 합니다. (자동차2 를 200 만큼 올려 확인합니다)</p>',
            hint: '<code>self.speed += value</code> 다음에 <code>if</code> 문으로 150 보다 크면 150 으로 바꿉니다.',
            starter: `## 클래스 선언 부분 ##
class Car :
    color = ""
    speed = 0

    def upSpeed(self, value) :
        self.speed += value
        # TODO: 속도가 150을 넘으면 150으로 조절

    def downSpeed(self, value) :
        self.speed -= value

## 메인 코드 부분 ##
myCar1 = Car()
myCar1.color = "빨강"
myCar1.speed = 0

myCar2 = Car()
myCar2.color = "파랑"
myCar2.speed = 0

myCar1.upSpeed(30)
print("자동차1의 색상은 %s이며, 현재 속도는 %dkm입니다." % (myCar1.color, myCar1.speed))

myCar2.upSpeed(200)
print("자동차2의 색상은 %s이며, 현재 속도는 %dkm입니다." % (myCar2.color, myCar2.speed))
`,
            solution: `## 클래스 선언 부분 ##
class Car :
    color = ""
    speed = 0

    def upSpeed(self, value) :
        self.speed += value
        if self.speed > 150 :
            self.speed = 150

    def downSpeed(self, value) :
        self.speed -= value

## 메인 코드 부분 ##
myCar1 = Car()
myCar1.color = "빨강"
myCar1.speed = 0

myCar2 = Car()
myCar2.color = "파랑"
myCar2.speed = 0

myCar1.upSpeed(30)
print("자동차1의 색상은 %s이며, 현재 속도는 %dkm입니다." % (myCar1.color, myCar1.speed))

myCar2.upSpeed(200)
print("자동차2의 색상은 %s이며, 현재 속도는 %dkm입니다." % (myCar2.color, myCar2.speed))
`,
            expect: `자동차1의 색상은 빨강이며, 현재 속도는 30km입니다.
자동차2의 색상은 파랑이며, 현재 속도는 150km입니다.` },
          { title: '실습 12-1. TV 클래스 만들기', level: 1,
            desc: '<p>필드 <code>channel</code>(처음 1)과 <code>volume</code>(처음 5), 메서드 <code>channelUp()</code>(채널 1 증가), <code>channelDown()</code>(채널 1 감소), <code>volumeUp(value)</code>(볼륨 value 만큼 증가)를 가진 TV 클래스를 만드세요. 인스턴스를 하나 만들어 채널을 두 번 올리고 볼륨을 3 올린 뒤 결과를 출력합니다.</p><pre><code>채널 : 3, 볼륨 : 8</code></pre>',
            hint: '필드를 바꿀 때는 <code>self.channel += 1</code> 처럼 self 를 붙입니다.',
            starter: `class TV :
    channel = 1
    volume = 5

    # TODO: channelUp(self), channelDown(self), volumeUp(self, value) 메서드

# TODO: 인스턴스 myTV 를 만들고 메서드 호출 후 출력
`,
            solution: `class TV :
    channel = 1
    volume = 5

    def channelUp(self) :
        self.channel += 1

    def channelDown(self) :
        self.channel -= 1

    def volumeUp(self, value) :
        self.volume += value

myTV = TV()
myTV.channelUp()
myTV.channelUp()
myTV.volumeUp(3)
print("채널 : %d, 볼륨 : %d" % (myTV.channel, myTV.volume))
`,
            expect: '채널 : 3, 볼륨 : 8' },
          { title: '실습 12-2. 은행 계좌 클래스', level: 2,
            desc: '<p>필드 <code>owner</code>(예금주)와 <code>balance</code>(잔액, 처음 0), 메서드 <code>deposit(money)</code>(입금)과 <code>withdraw(money)</code>(출금)를 가진 Account 클래스를 만드세요. 출금할 돈이 잔액보다 많으면 “잔액이 부족합니다.” 를 출력하고 출금하지 않습니다.</p><pre><code>홍길동 입금 후 잔액 : 10000원\n잔액이 부족합니다.\n홍길동 출금 후 잔액 : 7000원</code></pre>',
            hint: 'withdraw() 안에서 <code>if money &gt; self.balance :</code> 로 검사합니다. 메인에서는 10000 입금 → 50000 출금 시도 → 3000 출금 순서입니다.',
            starter: `class Account :
    owner = ""
    balance = 0

    def deposit(self, money) :
        # TODO: 잔액 늘리기
        pass

    def withdraw(self, money) :
        # TODO: 잔액이 부족하면 메시지 출력, 아니면 잔액 줄이기
        pass

acc = Account()
acc.owner = "홍길동"
acc.deposit(10000)
print("%s 입금 후 잔액 : %d원" % (acc.owner, acc.balance))
acc.withdraw(50000)
acc.withdraw(3000)
print("%s 출금 후 잔액 : %d원" % (acc.owner, acc.balance))
`,
            solution: `class Account :
    owner = ""
    balance = 0

    def deposit(self, money) :
        self.balance += money

    def withdraw(self, money) :
        if money > self.balance :
            print("잔액이 부족합니다.")
        else :
            self.balance -= money

acc = Account()
acc.owner = "홍길동"
acc.deposit(10000)
print("%s 입금 후 잔액 : %d원" % (acc.owner, acc.balance))
acc.withdraw(50000)
acc.withdraw(3000)
print("%s 출금 후 잔액 : %d원" % (acc.owner, acc.balance))
`,
            expect: `홍길동 입금 후 잔액 : 10000원
잔액이 부족합니다.
홍길동 출금 후 잔액 : 7000원` }
        ],
        quiz: [
          { q: '클래스 안에 정의된 함수를 부르는 이름은?', options: ['필드', '메서드', '인스턴스', '모듈'], answer: 1,
            explain: '클래스 안의 변수는 필드, 클래스 안의 함수는 <b>메서드</b>라고 합니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>class Car :\n    speed = 0\n    def upSpeed(self, value) :\n        self.speed += value\n\na = Car()\nb = Car()\na.upSpeed(10)\nb.upSpeed(20)\na.upSpeed(5)\nprint(a.speed, b.speed)</code></pre>',
            options: ['15 20', '35 35', '10 20', '0 0'], answer: 0,
            explain: '인스턴스마다 speed 를 따로 가집니다. a 는 10 + 5 = 15, b 는 20 입니다.' },
          { q: '메서드의 첫 번째 매개변수 <code>self</code> 에 대한 설명으로 옳은 것은?', options: ['호출할 때 직접 값을 넣어 주어야 한다', '메서드를 호출한 인스턴스 자신이 자동으로 전달된다', '클래스 이름과 같은 뜻이다', '필드가 없는 클래스에서만 쓴다'], answer: 1,
            explain: '<code>myCar1.upSpeed(30)</code> 은 <code>Car.upSpeed(myCar1, 30)</code> 처럼 동작하여 myCar1 이 self 로 들어갑니다.' },
          { q: 'Car 클래스로 인스턴스를 만드는 올바른 코드는?', options: ['myCar = Car', 'myCar = new Car()', 'myCar = Car()', 'Car myCar()'], answer: 2,
            explain: '파이썬은 <code>클래스명()</code> 으로 인스턴스를 만듭니다. <code>Car</code> 만 쓰면 클래스 자체가 대입됩니다. <code>new</code> 는 자바 문법입니다.' }
        ],
        slides: [
          { layout: 'title', title: '객체지향과 클래스', subtitle: '클래스 · 필드 · 메서드 · self · 인스턴스', badge: '12장 1교시',
            notes: '<p>12장은 파이썬 기초 문법의 마지막 큰 산인 <b>객체지향 프로그래밍</b>입니다. 처음에는 낯설지만 “설계도와 실물” 비유 하나로 끝까지 끌고 갈 수 있습니다.</p><p>발문: “게임 캐릭터 100명을 만든다면 변수를 몇 개 만들어야 할까요?” — 이름 · 체력 · 위치 × 100 … 을 떠올리게 하면 클래스의 필요성이 자연스럽게 나옵니다.</p><p>(1분)</p>' },
          { layout: 'diagram', title: '이 장에서 만들 프로그램', html: D_PROGRAMS, caption: '[프로그램 1] 자동차 클래스 · [프로그램 2] 클릭하면 사각형을 그리는 거북이',
            notes: '<p>[프로그램 1]은 3교시(생성자) 끝에, [프로그램 2]는 5교시에 완성합니다.</p><p>[프로그램 2]는 미리 실행해서 보여 주면 동기 부여가 됩니다(학생 문서 5교시의 Code12-08). 클릭할 때마다 <b>새 거북이</b>가 생긴다는 점을 짚어 두세요 — 거북이 하나하나가 인스턴스입니다.</p><p>(3분)</p>' },
          { layout: 'bullets', title: '객체지향 프로그래밍이란?', lead: '관련 있는 데이터(변수)와 기능(함수)을 하나로 묶어 “객체”로 다루는 방법',
            bullets: ['지금까지: 변수와 함수를 따로 만들어 사용', '객체지향: 자동차 = 색상 · 속도 + 속도 올리기 · 내리기', '묶음의 설계도 = <b>클래스(class)</b>', '설계도로 만든 실물 = <b>인스턴스(instance)</b> = 객체', '비유: 붕어빵 틀(클래스)과 붕어빵(인스턴스)'],
            notes: '<p>OOP 의 장점은 “프로그램이 커져도 관리하기 쉽다”, “같은 구조를 여러 번 만들 수 있다” 두 가지로 정리합니다.</p><p>발문: “붕어빵 틀 하나로 붕어빵을 몇 개 만들 수 있나요? 붕어빵마다 속이 다를 수 있나요?” → 인스턴스마다 필드 값이 다르다는 것과 연결.</p><p>(4분)</p>' },
          { layout: 'diagram', title: '자동차를 클래스로 구현', html: D_CAR_CLASS, caption: '그림 12-1 — 속성은 필드(변수), 기능은 메서드(클래스 안의 함수)',
            notes: '<p>강의자료 4~5쪽. 실제 자동차 → 말로 쓴 클래스 → 파이썬 클래스로 세 단계 변환을 보여 줍니다.</p><p>용어 정리: 필드(field) = 속성 = 클래스 안의 변수, 메서드(method) = 기능 = 클래스 안의 함수. 판서해 두면 이후 계속 참조할 수 있습니다.</p><p>(4분)</p>' },
          { layout: 'code', title: 'Code12-01. 자동차 클래스', code: `class Car :
    color = ""
    speed = 0

    def upSpeed(self, value) :
        self.speed += value

    def downSpeed(self, value) :
        self.speed -= value`,
            points: ['<code>class Car :</code> 클래스 선언 (이름은 대문자로 시작하는 관례)', '필드: <code>color</code>, <code>speed</code>', '메서드: <code>upSpeed()</code>, <code>downSpeed()</code>', '실행해도 출력 없음 → 설계도만 만든 상태'],
            notes: '<p>실행해서 “아무것도 안 나온다”는 것을 확인시키고 이유를 묻습니다. → 설계도만 있고 자동차를 만들지 않았으니까.</p><p>클래스 이름은 <b>대문자로 시작</b>(Car, Shape)하고, 변수 · 함수는 소문자로 시작하는 관례(PEP 8)를 알려 줍니다.</p><p>(3분)</p>' },
          { layout: 'diagram', title: 'self 의 정체', html: D_SELF, caption: 'myCar1.upSpeed(30)  ⇒  Car.upSpeed(myCar1, 30)',
            notes: '<p>📘 보충. 학생들이 가장 헷갈리는 부분입니다. “호출할 때는 인수가 1개인데 정의에는 매개변수가 2개” 라는 의문을 먼저 끌어낸 뒤 이 그림으로 풀어 줍니다.</p><p>실제로 <code>Car.upSpeed(myCar1, 30)</code> 이라고 써도 똑같이 동작한다는 것을 즉석에서 보여 주면 효과적입니다.</p><p>흔한 실수: self 누락 → TypeError, <code>self.</code> 누락 → UnboundLocalError.</p><p>(5분)</p>' },
          { layout: 'code', title: '필드를 쓰지 않는 메서드: printMessage()', expectError: true, code: `class Car :
    speed = 0

    def printMessage() :
        print("시험 출력이다.")

Car.printMessage()        # 클래스 이름으로 호출 → OK

myCar1 = Car()
myCar1.printMessage()     # 인스턴스로 호출 → TypeError`,
            points: ['강의자료: 필드를 쓰지 않으면 self 생략 가능', '단, <b>클래스 이름</b>으로 부를 때만 동작', '인스턴스로 부르면 self 자리에 인스턴스가 들어가 오류', '→ 메서드에는 항상 self 를 쓰자'],
            notes: '<p>강의자료 7쪽의 내용을 정확히 보충하는 슬라이드입니다. 실행하면 첫 줄은 출력되고 마지막 줄에서 TypeError 가 납니다 — 일부러 오류를 보여 주는 코드입니다.</p><p>“0 positional arguments but 1 was given” 의 1개가 무엇인지 묻습니다 → myCar1.</p><p>@staticmethod 는 궁금한 학생에게만 짧게 언급합니다(학생 문서 📘 참고).</p><p>(3분)</p>' },
          { layout: 'diagram', title: '인스턴스의 생성', html: D_INSTANCES, caption: '인스턴스 = 클래스명()  — 설계도 하나로 여러 대를 찍어 낸다',
            notes: '<p>강의자료 7~8쪽, 그림 12-2 · 12-3. <code>Car()</code> 처럼 괄호를 붙여야 인스턴스가 생깁니다. 괄호를 빼면 클래스 자체가 대입된다는 점을 짚어 주세요.</p><p>발문: “myCar1 과 myCar2 는 같은 자동차인가요?” → 서로 다른 인스턴스(is 로 비교하면 False).</p><p>(3분)</p>' },
          { layout: 'diagram', title: '필드에 값 대입', html: D_FIELDS, caption: '그림 12-4 — 인스턴스.필드 = 값,  인스턴스.메서드()',
            notes: '<p>강의자료 9쪽. 점(.)을 “~의”로 읽게 하세요. myCar1.color = “myCar1 의 color”.</p><p>메서드 호출도 같은 모양: <code>myCar1.upSpeed(30)</code>, <code>myCar2.downSpeed(60)</code>. downSpeed(60) 을 하면 속도가 -60 이 되는 문제를 짚고 SELF STUDY 12-1 로 연결합니다.</p><p>(3분)</p>' },
          { layout: 'code', title: 'Code12-02. 클래스의 완전한 작동', code: `class Car :
    color = ""
    speed = 0
    def upSpeed(self, value) :
        self.speed += value
    def downSpeed(self, value) :
        self.speed -= value

myCar1 = Car()
myCar1.color = "빨강"
myCar1.speed = 0
myCar2 = Car()
myCar2.color = "파랑"
myCar2.speed = 0
myCar3 = Car()
myCar3.color = "노랑"
myCar3.speed = 0

myCar1.upSpeed(30)
print("자동차1: %s, %dkm" % (myCar1.color, myCar1.speed))
myCar2.upSpeed(60)
print("자동차2: %s, %dkm" % (myCar2.color, myCar2.speed))
myCar3.upSpeed(0)
print("자동차3: %s, %dkm" % (myCar3.color, myCar3.speed))`,
            points: ['클래스 선언 부분 + 메인 코드 부분', '인스턴스 3개, 필드 값은 제각각', '같은 upSpeed() 라도 부른 인스턴스의 speed 만 바뀐다'],
            notes: '<p>슬라이드에 맞게 빈 줄 · 주석과 출력 문장을 줄인 버전입니다(원본은 학생 문서 Code12-02).</p><p>실행 전에 세 줄의 출력을 예측하게 하세요: 빨강 30, 파랑 60, 노랑 0.</p><p>“메인 코드가 길고 반복된다 — 더 줄일 방법은?” 이라고 물어 두면 다음 교시 생성자로 이어집니다.</p><p>(5분)</p>' },
          { layout: 'table', title: '클래스 사용 순서', head: ['단계', '작업', '형식', '예'],
            rows: [['1단계', '클래스 선언', 'class 클래스명 : 필드 · 메서드', 'class Car : …'], ['2단계', '인스턴스 생성', '인스턴스 = 클래스명()', 'myCar1 = Car()'], ['3단계', '필드 · 메서드 사용', '인스턴스.필드명 = 값<br>인스턴스.메서드()', 'myCar1.color = "빨강"<br>myCar1.upSpeed(30)']],
            notes: '<p>강의자료 12쪽. 세 단계를 입으로 따라 말하게 합니다: “선언 → 생성 → 사용”.</p><p>(2분)</p>' },
          { layout: 'quiz', title: '확인 문제', q: 'a = Car(); b = Car(); a.upSpeed(10); b.upSpeed(20); a.upSpeed(5)<br>print(a.speed, b.speed) 의 결과는? (speed 처음 0)', options: ['15 20', '35 35', '10 20', '0 0'], answer: 0,
            explain: '인스턴스마다 speed 를 따로 가집니다. a 는 15, b 는 20.',
            notes: '<p>“35 35” 를 고른 학생은 인스턴스가 필드를 공유한다고 오해한 것입니다. 붕어빵 비유로 다시 설명합니다(공유하는 변수는 4교시 클래스 변수에서 배움).</p><p>(2분)</p>' },
          { layout: 'practice', title: 'SELF STUDY 12-1. 최고 속도 제한', desc: 'upSpeed() 를 고쳐 속도가 150 을 넘으면 150 으로 맞추세요. upSpeed(200) → 150km.',
            starter: `class Car :
    color = ""
    speed = 0
    def upSpeed(self, value) :
        self.speed += value
        # TODO: 150 제한

myCar2 = Car()
myCar2.color = "파랑"
myCar2.upSpeed(200)
print("자동차2의 색상은 %s이며, 현재 속도는 %dkm입니다." % (myCar2.color, myCar2.speed))
`,
            solution: `class Car :
    color = ""
    speed = 0
    def upSpeed(self, value) :
        self.speed += value
        if self.speed > 150 :
            self.speed = 150

myCar2 = Car()
myCar2.color = "파랑"
myCar2.upSpeed(200)
print("자동차2의 색상은 %s이며, 현재 속도는 %dkm입니다." % (myCar2.color, myCar2.speed))
`,
            notes: '<p>3분 정도 직접 풀게 합니다. 빠른 학생에게는 downSpeed() 에서 속도가 0 아래로 내려가지 않게 하는 것도 추가로 시킵니다.</p><p>(5분)</p>' },
          { layout: 'summary', title: '1교시 정리',
            bullets: ['클래스 = 설계도, 인스턴스 = 설계도로 만든 실물', '필드 = 클래스 안의 변수, 메서드 = 클래스 안의 함수', '<code>self</code> = 메서드를 부른 인스턴스 자신 (첫 번째 매개변수)', '사용 순서: 클래스 선언 → <code>인스턴스 = 클래스명()</code> → <code>인스턴스.필드</code> / <code>인스턴스.메서드()</code>'],
            notes: '<p>다음 시간 예고: “인스턴스를 만들 때마다 color, speed 를 한 줄씩 넣는 게 귀찮지 않았나요? 만들면서 한 번에 넣는 방법 = 생성자”.</p><p>(1분)</p>' }
        ]
      },
      // ================= 12-2 =================
      {
        id: 'ch12-2',
        title: '생성자와 [프로그램 1]',
        minutes: 45,
        goals: [
          '생성자 __init__() 이 인스턴스를 만들 때 자동으로 호출된다는 것을 설명할 수 있다',
          '기본 생성자와 매개변수가 있는 생성자를 만들 수 있다',
          '값을 돌려주는 메서드(getName, getSpeed)를 만들어 [프로그램 1]을 완성할 수 있다'
        ],
        flow: [['복습 · 도입', 5], ['생성자의 개념과 형식', 8], ['기본 생성자 (Code12-03)', 8], ['매개변수가 있는 생성자 (Code12-04)', 10], ['[프로그램 1] 완성 (Code12-05)', 9], ['정리 · 퀴즈', 5]],
        content: [
          { type: 'h', text: '생성자의 개념' },
          { type: 'p', html: '1교시의 Code12-02 에서는 인스턴스를 만든 뒤 <code>myCar1.color = "빨강"</code>, <code>myCar1.speed = 0</code> 처럼 필드 값을 한 줄씩 따로 넣었습니다. 자동차가 100대라면 200줄이 필요하겠죠.' },
          { type: 'p', html: '<b>생성자(constructor)</b>는 <mark>인스턴스를 만들 때 자동으로 호출되어 필드 값을 초기화하는 메서드</mark>입니다. 공장에서 자동차를 만들 때 색을 칠하고 출고하는 과정까지 한 번에 해 주는 것과 같습니다.' },
          { type: 'h', text: '생성자의 기본 형식' },
          { type: 'p', html: '파이썬의 생성자는 이름이 정해져 있습니다. <code>__init__()</code> — 앞뒤로 <b>밑줄(_)이 두 개씩</b> 붙습니다. init 은 initialize(초기화하다)의 줄임말입니다.' },
          { type: 'code', title: '생성자의 기본 형식', run: false, code: `class 클래스명 :
    def __init__(self) :
        # 이 부분에 초기화할 코드 입력` },
          { type: 'code', title: '생성자를 가진 Car 클래스', code: `class Car :
    color = ""
    speed = 0

    def __init__(self) :
        self.color = "빨강"
        self.speed = 0

myCar = Car()             # 이 순간 __init__() 이 자동으로 실행된다
print(myCar.color, myCar.speed)`,
            expect: '빨강 0',
            desc: '<code>__init__()</code> 을 직접 부르지 않았는데도 <code>Car()</code> 를 실행하는 순간 호출되어 color 가 "빨강" 이 되었습니다.' },
          { type: 'figure', html: D_INIT, caption: '인스턴스를 만들 때 생성자가 호출되는 순서' },
          { type: 'callout', kind: 'warn', title: '흔한 실수: 밑줄 개수', html: '<code>_init_</code>(밑줄 1개)이나 <code>__int__</code>(오타)로 쓰면 파이썬은 그냥 평범한 메서드로 여기고 <b>자동으로 부르지 않습니다</b>. 오류도 나지 않아서 찾기 어렵습니다. 매개변수가 있는 생성자라면 <code>TypeError: Car() takes no arguments</code> 가 나기도 합니다.' },

          { type: 'h', text: '기본 생성자' },
          { type: 'p', html: '매개변수가 <code>self</code> 하나뿐인 생성자를 <b>기본 생성자</b>라고 합니다. 이 생성자로 만든 인스턴스는 모두 같은 초기값을 가집니다.' },
          { type: 'code', title: 'Code12-03. 기본 생성자', code: `## 클래스 선언 부분 ##
class Car :
    color = ""
    speed = 0

    def __init__(self) :
        self.color = "빨강"
        self.speed = 0

    def upSpeed(self, value) :
        self.speed += value

    def downSpeed(self, value) :
        self.speed -= value

## 메인 코드 부분 ##
myCar1 = Car()
myCar2 = Car()

print("자동차1의 색상은 %s이며, 현재 속도는 %dkm입니다." % (myCar1.color, myCar1.speed))
print("자동차2의 색상은 %s이며, 현재 속도는 %dkm입니다." % (myCar2.color, myCar2.speed))`,
            expect: `자동차1의 색상은 빨강이며, 현재 속도는 0km입니다.
자동차2의 색상은 빨강이며, 현재 속도는 0km입니다.`,
            desc: '<code>6~8행</code>이 기본 생성자입니다. 메인 코드에서 필드 값을 하나도 넣지 않았지만 두 자동차 모두 빨강, 0km 로 초기화되었습니다. 하지만 자동차가 모두 빨간색이라니 조금 아쉽네요.' },

          { type: 'h', text: '매개변수가 있는 생성자' },
          { type: 'p', html: '생성자에 <code>self</code> 외의 매개변수를 추가하면 인스턴스를 만들 때 <b>원하는 초기값</b>을 넘겨줄 수 있습니다. <code>Car("빨강", 30)</code> 처럼 클래스 이름 뒤 괄호에 값을 넣으면 그 값이 차례로 생성자의 매개변수에 들어갑니다.' },
          { type: 'code', title: 'Code12-04. 매개변수가 있는 생성자', code: `## 클래스 선언 부분 ##
class Car :
    color = ""
    speed = 0

    def __init__(self, value1, value2) :
        self.color = value1
        self.speed = value2

    def upSpeed(self, value) :
        self.speed += value

    def downSpeed(self, value) :
        self.speed -= value

## 메인 코드 부분 ##
myCar1 = Car("빨강", 30)
myCar2 = Car("파랑", 60)

print("자동차1의 색상은 %s이며, 현재 속도는 %dkm입니다." % (myCar1.color, myCar1.speed))
print("자동차2의 색상은 %s이며, 현재 속도는 %dkm입니다." % (myCar2.color, myCar2.speed))`,
            expect: `자동차1의 색상은 빨강이며, 현재 속도는 30km입니다.
자동차2의 색상은 파랑이며, 현재 속도는 60km입니다.`,
            desc: '강의자료에서 “Code12-03 과 동일” 이라고 줄인 부분을 채워 넣은 완성 코드입니다. <code>17행</code>의 <code>"빨강"</code> 은 value1, <code>30</code> 은 value2 로 들어갑니다. 인스턴스를 만들면서 필드 값을 한 번에 정할 수 있게 되었습니다.' },
          { type: 'callout', kind: 'warn', title: '인수 개수가 맞지 않으면', html: '매개변수가 있는 생성자를 만든 뒤 <code>Car()</code> 처럼 값을 주지 않으면 <code>TypeError: Car.__init__() missing 2 required positional arguments: \'value1\' and \'value2\'</code> 오류가 납니다. 생성자가 요구하는 값을 모두 넘겨야 합니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 기본값이 있는 매개변수', html: '함수에서 배운 매개변수 기본값을 생성자에도 쓸 수 있습니다. 그러면 값을 줘도 되고 안 줘도 됩니다.<pre><code>class Car :\n    def __init__(self, color="흰색", speed=0) :\n        self.color = color\n        self.speed = speed\n\ncar1 = Car()               # 흰색, 0\ncar2 = Car("검정")          # 검정, 0\ncar3 = Car(speed=50)       # 흰색, 50</code></pre>또 매개변수 이름을 필드 이름과 똑같이 쓰는 경우가 많습니다(<code>self.color = color</code>). 왼쪽은 인스턴스의 필드, 오른쪽은 매개변수입니다.' },

          { type: 'h', text: '[프로그램 1]의 완성' },
          { type: 'p', html: '이제 자동차의 이름과 속도를 생성자로 초기화하고, 필드 값을 <b>돌려주는(return)</b> 메서드 <code>getName()</code>, <code>getSpeed()</code> 를 만들어 [프로그램 1]을 완성합니다.' },
          { type: 'code', title: '[프로그램 1] 완성: Code12-05. 객체지향 개념 적용', code: `## 클래스 선언 부분 ##
class Car :
    name = ""
    speed = 0

    def __init__(self, name, speed) :
        self.name = name
        self.speed = speed

    def getName(self) :
        return self.name

    def getSpeed(self) :
        return self.speed

## 변수 선언 부분 ##
car1, car2 = None, None

## 메인 코드 부분 ##
car1 = Car("아우디", 0)
car2 = Car("벤츠", 30)

print("%s의 현재 속도는 %d입니다." % (car1.getName(), car1.getSpeed()))
print("%s의 현재 속도는 %d입니다." % (car2.getName(), car2.getSpeed()))`,
            expect: `아우디의 현재 속도는 0입니다.
벤츠의 현재 속도는 30입니다.`,
            desc: '<code>6~8행</code>: 생성자의 매개변수 이름(name, speed)이 필드 이름과 같습니다. <code>self.name</code> 은 필드, <code>name</code> 은 매개변수입니다. <code>10~14행</code>: 필드 값을 돌려주는 메서드입니다. <code>17행</code>: 변수를 None(아무것도 없음)으로 미리 준비해 두는 이 책의 코드 스타일입니다.' },
          { type: 'callout', kind: 'info', title: '왜 car1.name 대신 car1.getName() 을 쓸까?', html: '필드를 직접 읽어도 결과는 같습니다. 하지만 메서드를 거치면 나중에 “이름 앞에 브랜드를 붙여서 돌려주기” 같은 규칙을 한 곳(메서드)만 고쳐서 적용할 수 있습니다. 필드 값을 읽는 메서드를 <b>게터(getter)</b>, 바꾸는 메서드를 <b>세터(setter)</b>라고 부릅니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 필드를 클래스 위에 꼭 써야 할까?', html: '이 책은 필드를 클래스 맨 위에 <code>name = ""</code> 처럼 먼저 적어 두는 스타일을 씁니다. 하지만 파이썬에서는 생성자에서 <code>self.name = name</code> 을 실행하는 순간 인스턴스에 필드가 생기므로, 클래스 위의 선언을 빼도 똑같이 동작합니다. 실무 코드에서는 <b>생성자 안에서만 필드를 만드는</b> 경우가 더 많습니다. 이 차이는 다음 교시(인스턴스 변수와 클래스 변수)에서 자세히 봅니다.' },
          { type: 'code', repl: true, title: '>>> 셸에서 생성자 확인하기', code: `class Car :
    def __init__(self, name, speed) :
        self.name = name
        self.speed = speed
        print(name, "생산 완료!")

c = Car("아우디", 0)
c.name
Car("벤츠", 30).speed`,
            expect: `>>> class Car :
...     def __init__(self, name, speed) :
...         self.name = name
...         self.speed = speed
...         print(name, "생산 완료!")
...
>>> c = Car("아우디", 0)
아우디 생산 완료!
>>> c.name
'아우디'
>>> Car("벤츠", 30).speed
벤츠 생산 완료!
30
>>>` }
        ],
        practice: [
          { title: '실습 12-3. 학생 클래스', level: 1,
            desc: '<p>생성자로 이름(name)과 점수(score)를 받는 Student 클래스를 만들고, 점수가 60 이상이면 "합격", 아니면 "불합격" 을 돌려주는 <code>getResult()</code> 메서드를 추가하세요.</p><pre><code>김철수 : 85점, 합격\n이영희 : 55점, 불합격</code></pre>',
            hint: '<code>def __init__(self, name, score) :</code> 안에서 <code>self.name = name</code> 처럼 저장합니다.',
            starter: `class Student :
    # TODO: 생성자 __init__(self, name, score)

    # TODO: getResult(self) - 60점 이상이면 "합격"
    pass

s1 = Student("김철수", 85)
s2 = Student("이영희", 55)
# TODO: 두 학생의 정보 출력
`,
            solution: `class Student :
    def __init__(self, name, score) :
        self.name = name
        self.score = score

    def getResult(self) :
        if self.score >= 60 :
            return "합격"
        else :
            return "불합격"

s1 = Student("김철수", 85)
s2 = Student("이영희", 55)
print("%s : %d점, %s" % (s1.name, s1.score, s1.getResult()))
print("%s : %d점, %s" % (s2.name, s2.score, s2.getResult()))
`,
            expect: `김철수 : 85점, 합격
이영희 : 55점, 불합격` },
          { title: '실습 12-4. 입력받아 자동차 만들기', level: 2,
            desc: '<p>Code12-05 의 Car 클래스를 사용합니다. 자동차 이름과 속도를 입력받아 인스턴스를 만들고, <code>upSpeed(value)</code> 메서드를 추가해 속도를 20 올린 뒤 출력하세요.</p><pre><code>자동차 이름 : 소나타\n현재 속도 : 40\n소나타의 현재 속도는 60입니다.</code></pre>',
            hint: '<code>int(input(...))</code> 으로 속도를 정수로 바꿔 생성자에 넘깁니다.',
            starter: `class Car :
    def __init__(self, name, speed) :
        self.name = name
        self.speed = speed

    def getName(self) :
        return self.name

    def getSpeed(self) :
        return self.speed

    # TODO: upSpeed(self, value)

# TODO: 이름과 속도 입력 → 인스턴스 생성 → 20 올리고 출력
`,
            solution: `class Car :
    def __init__(self, name, speed) :
        self.name = name
        self.speed = speed

    def getName(self) :
        return self.name

    def getSpeed(self) :
        return self.speed

    def upSpeed(self, value) :
        self.speed += value

name = input("자동차 이름 : ")
speed = int(input("현재 속도 : "))
car1 = Car(name, speed)
car1.upSpeed(20)
print("%s의 현재 속도는 %d입니다." % (car1.getName(), car1.getSpeed()))
`,
            stdin: '소나타\n40\n',
            expect: `자동차 이름 : 소나타
현재 속도 : 40
소나타의 현재 속도는 60입니다.` }
        ],
        quiz: [
          { q: '파이썬 생성자의 이름으로 옳은 것은?', options: ['Car()', '_init_()', '__init__()', 'constructor()'], answer: 2,
            explain: '생성자는 앞뒤로 밑줄 두 개씩 붙은 <code>__init__()</code> 입니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>class Car :\n    def __init__(self) :\n        print("생성")\n\na = Car()\nb = Car()</code></pre>', options: ['생성', '생성\n생성 (두 줄)', '아무것도 출력되지 않는다', '오류'], answer: 1,
            explain: '인스턴스를 만들 때마다 생성자가 자동 호출되므로 “생성” 이 두 번 출력됩니다.' },
          { q: '<code>def __init__(self, name, speed)</code> 생성자를 가진 Car 로 인스턴스를 만드는 올바른 코드는?', options: ['Car(self, "벤츠", 30)', 'Car("벤츠", 30)', 'Car.__init__("벤츠", 30)', 'Car()'], answer: 1,
            explain: 'self 는 자동으로 전달되므로 나머지 두 값만 넘깁니다. <code>Car()</code> 는 인수가 모자라 TypeError 가 납니다.' },
          { q: '다음 중 생성자에 대한 설명으로 <b>틀린</b> 것은?', options: ['인스턴스를 만들 때 자동으로 호출된다', '필드 값을 초기화하는 데 주로 쓴다', 'self 외에 매개변수를 더 가질 수 있다', '반드시 메인 코드에서 직접 호출해야 한다'], answer: 3,
            explain: '생성자는 <code>클래스명()</code> 으로 인스턴스를 만들 때 자동으로 호출됩니다. 직접 부를 필요가 없습니다.' }
        ],
        slides: [
          { layout: 'title', title: '생성자와 [프로그램 1]', subtitle: '__init__() 으로 인스턴스를 만들면서 초기화하기', badge: '12장 2교시',
            notes: '<p>복습 발문: “클래스 사용 3단계는?” → 선언 · 생성 · 사용. “Code12-02 에서 가장 귀찮았던 부분은?” → 필드 값을 한 줄씩 넣기.</p><p>(2분)</p>' },
          { layout: 'bullets', title: '생성자의 개념', lead: '생성자 = 인스턴스를 생성하면서 필드값을 초기화하는 메서드',
            bullets: ['이름이 정해져 있다: <code>__init__()</code> (밑줄 2개씩)', '<code>Car()</code> 로 인스턴스를 만들 때 <b>자동 호출</b>', '첫 번째 매개변수는 역시 <code>self</code>', 'init = initialize (초기화)'],
            notes: '<p>강의자료 13쪽. 밑줄 개수를 칠판에 크게 써 주세요. 발음은 “던더 이닛(dunder init)” 이라고 알려 주면 좋습니다.</p><p>(3분)</p>' },
          { layout: 'diagram', title: '생성자가 호출되는 순서', html: D_INIT, caption: '① 빈 인스턴스 → ② __init__ 자동 호출 → ③ 변수에 연결',
            notes: '<p>📘 보충. “Car(…) 한 줄 안에서 세 가지 일이 일어난다” 를 강조합니다. 생성자 안에 print 를 넣어 두면 호출 시점을 눈으로 확인할 수 있습니다.</p><p>(3분)</p>' },
          { layout: 'code', title: 'Code12-03. 기본 생성자', code: `class Car :
    color = ""
    speed = 0

    def __init__(self) :
        self.color = "빨강"
        self.speed = 0

myCar1 = Car()
myCar2 = Car()

print("자동차1: %s, %dkm" % (myCar1.color, myCar1.speed))
print("자동차2: %s, %dkm" % (myCar2.color, myCar2.speed))`,
            points: ['매개변수가 <code>self</code> 뿐 → 기본 생성자', '모든 인스턴스가 같은 초기값', '메인 코드에서 필드 대입이 사라졌다'],
            notes: '<p>원본의 upSpeed/downSpeed 는 슬라이드에서 생략했습니다(학생 문서는 전체 코드).</p><p>발문: “모든 차가 빨간색이면 어떤 문제가 있나요?” → 매개변수가 있는 생성자로 연결.</p><p>(4분)</p>' },
          { layout: 'code', title: 'Code12-04. 매개변수가 있는 생성자', code: `class Car :
    color = ""
    speed = 0

    def __init__(self, value1, value2) :
        self.color = value1
        self.speed = value2

myCar1 = Car("빨강", 30)
myCar2 = Car("파랑", 60)

print("자동차1: %s, %dkm" % (myCar1.color, myCar1.speed))
print("자동차2: %s, %dkm" % (myCar2.color, myCar2.speed))`,
            points: ['<code>Car("빨강", 30)</code> → value1="빨강", value2=30', 'self 는 자동, 나머지만 넘긴다', '<code>Car()</code> 로 부르면 TypeError (인수 부족)'],
            notes: '<p>실행 후 <code>Car()</code> 로 바꿔 실행해서 “missing 2 required positional arguments” 오류를 보여 주세요.</p><p>매개변수 기본값(<code>value1="흰색"</code>)을 쓰면 생략할 수 있다는 것도 짧게 언급(학생 문서 📘).</p><p>(5분)</p>' },
          { layout: 'code', title: '[프로그램 1] Code12-05. 객체지향 개념 적용', code: `class Car :
    name = ""
    speed = 0

    def __init__(self, name, speed) :
        self.name = name
        self.speed = speed

    def getName(self) :
        return self.name

    def getSpeed(self) :
        return self.speed

car1, car2 = None, None
car1 = Car("아우디", 0)
car2 = Car("벤츠", 30)
print("%s의 현재 속도는 %d입니다." % (car1.getName(), car1.getSpeed()))
print("%s의 현재 속도는 %d입니다." % (car2.getName(), car2.getSpeed()))`,
            points: ['<code>self.name = name</code>: 왼쪽은 필드, 오른쪽은 매개변수', '<code>getName()</code>, <code>getSpeed()</code>: 값을 돌려주는 메서드(게터)', '출력: 아우디 0, 벤츠 30'],
            notes: '<p>강의자료 16쪽. [프로그램 1] 완성입니다. <code>self.name = name</code> 이 헷갈리는 학생이 많으니 색 분필로 두 name 을 다르게 표시하세요.</p><p>왜 getter 를 쓰는지: 규칙을 한 곳에서 관리할 수 있다(캡슐화의 기초).</p><p>(6분)</p>' },
          { layout: 'quiz', title: '확인 문제', q: 'class Car: def __init__(self): print("생성") 일 때<br>a = Car(); b = Car() 를 실행하면?', options: ['생성 (한 번)', '생성 (두 번)', '아무 출력 없음', '오류'], answer: 1,
            explain: '인스턴스를 만들 때마다 생성자가 자동 호출됩니다.',
            notes: '<p>“아무 출력 없음” 을 고른 학생은 생성자를 직접 불러야 한다고 생각한 것입니다. 자동 호출을 다시 강조합니다.</p><p>(2분)</p>' },
          { layout: 'practice', title: '실습 12-3. 학생 클래스', desc: '생성자로 name, score 를 받고 getResult() 가 60점 이상이면 "합격" 을 돌려주게 하세요.',
            starter: `class Student :
    # TODO: __init__, getResult
    pass

s1 = Student("김철수", 85)
print(s1.name, s1.getResult())
`,
            solution: `class Student :
    def __init__(self, name, score) :
        self.name = name
        self.score = score

    def getResult(self) :
        if self.score >= 60 :
            return "합격"
        return "불합격"

s1 = Student("김철수", 85)
print(s1.name, s1.getResult())
`,
            notes: '<p>뼈대 코드를 그대로 실행하면 TypeError(Student() takes no arguments)가 납니다. 그 오류가 “생성자가 없다” 는 뜻임을 읽어 주세요.</p><p>(5분)</p>' },
          { layout: 'summary', title: '2교시 정리',
            bullets: ['생성자 <code>__init__(self, …)</code>: 인스턴스를 만들 때 자동 호출', '기본 생성자: self 만 → 모두 같은 초기값', '매개변수 생성자: <code>Car("빨강", 30)</code> 처럼 초기값 전달', 'getter 메서드: <code>return self.필드</code>'],
            notes: '<p>다음 시간 예고: “생산된 자동차가 모두 몇 대인지 세려면 어디에 변수를 둬야 할까?” → 클래스 변수.</p><p>(1분)</p>' }
        ]
      },
      // ================= 12-3 =================
      {
        id: 'ch12-3',
        title: '인스턴스 변수와 클래스 변수',
        minutes: 40,
        goals: [
          '인스턴스 변수와 클래스 변수의 저장 위치 차이를 설명할 수 있다',
          '클래스 변수로 모든 인스턴스가 공유하는 값(생산 대수 등)을 관리할 수 있다',
          '인스턴스를 통해 클래스 변수에 대입할 때 생기는 문제를 설명할 수 있다'
        ],
        flow: [['도입', 3], ['인스턴스 변수', 8], ['클래스 변수 개념', 8], ['Code12-06 생산 대수', 10], ['이름 찾는 순서 · 주의점', 6], ['정리 · 퀴즈', 5]],
        content: [
          { type: 'h', text: '인스턴스 변수' },
          { type: 'p', html: '지금까지 Car 클래스에 만든 <code>color</code>, <code>speed</code> 같은 필드는 모두 <b>인스턴스 변수</b>로 쓰였습니다. 인스턴스 변수는 <mark>인스턴스를 만들 때마다 인스턴스 안에 따로 생기는 변수</mark>입니다.' },
          { type: 'code', title: 'Car 클래스의 두 필드', run: false, code: `class Car :
    color = ""    # 필드 : 인스턴스 변수
    speed = 0     # 필드 : 인스턴스 변수` },
          { type: 'p', html: '메인 코드에서 <code>myCar1 = Car()</code>, <code>myCar2 = Car()</code> 로 인스턴스를 두 개 만들면, 각 인스턴스는 자기만의 color 와 speed 를 가집니다. 즉 <code>myCar1.color</code>, <code>myCar1.speed</code>, <code>myCar2.color</code>, <code>myCar2.speed</code> 네 개의 공간이 생깁니다.' },
          { type: 'figure', html: D_INSTVAR, caption: '그림 12-5 인스턴스 변수의 개념 — 인스턴스마다 자기만의 공간' },
          { type: 'code', title: '추가 예제. 인스턴스 변수는 서로 독립적이다', code: `class Car :
    color = ""
    speed = 0

myCar1 = Car()
myCar2 = Car()

myCar1.speed = 30
myCar2.speed = 60
myCar1.color = "빨강"

print("myCar1 :", myCar1.color, myCar1.speed)
print("myCar2 :", myCar2.color, myCar2.speed)`,
            expect: `myCar1 : 빨강 30
myCar2 :  60`,
            desc: 'myCar1 의 color 를 바꿔도 myCar2 의 color 는 여전히 빈 문자열입니다(그래서 <code>myCar2 :</code> 뒤에 공백이 두 칸). 서로 영향을 주지 않습니다.' },

          { type: 'h', text: '클래스 변수' },
          { type: 'p', html: '<b>클래스 변수</b>는 <mark>클래스 안에 공간이 딱 하나 할당되어, 모든 인스턴스가 함께 사용하는 변수</mark>입니다. 예를 들어 “지금까지 생산된 자동차 대수” 는 자동차 한 대 한 대가 따로 가질 값이 아니라 공장(클래스) 전체가 하나만 가져야 할 값입니다.' },
          { type: 'figure', html: D_CLASSVAR, caption: '그림 12-6 클래스 변수의 개념 — count 는 클래스에 하나만 있고 모든 인스턴스가 공유' },
          { type: 'p', html: '클래스 변수는 <code>클래스명.변수명</code> 형식으로 사용합니다. 인스턴스를 통해 <code>myCar2.count</code> 처럼 읽어도 같은 값이 나옵니다(인스턴스에 없으면 클래스에서 찾기 때문).' },
          { type: 'code', title: 'Code12-06. 자동차 생산 대수 확인', code: `## 클래스 선언 부분 ##
class Car :
    color = ""    # 인스턴스 변수
    speed = 0     # 인스턴스 변수
    count = 0     # 클래스 변수

    def __init__(self) :
        self.speed = 0
        Car.count += 1

## 변수 선언 부분 ##
myCar1, myCar2 = None, None

## 메인 코드 부분 ##
myCar1 = Car()
myCar1.speed = 30
print("자동차1의 현재 속도는 %dkm, 생산된 자동차는 총 %d대입니다." % (myCar1.speed, Car.count))

myCar2 = Car()
myCar2.speed = 60
print("자동차2의 현재 속도는 %dkm, 생산된 자동차는 총 %d대입니다." % (myCar2.speed, myCar2.count))`,
            expect: `자동차1의 현재 속도는 30km, 생산된 자동차는 총 1대입니다.
자동차2의 현재 속도는 60km, 생산된 자동차는 총 2대입니다.`,
            desc: '<code>9행</code>: 생성자가 실행될 때마다(= 자동차가 생산될 때마다) 클래스 변수 <code>Car.count</code> 가 1씩 늘어납니다. <code>17행</code>은 <code>Car.count</code>, <code>21행</code>은 <code>myCar2.count</code> 로 읽었지만 둘 다 같은 클래스 변수를 가리킵니다.' },
          { type: 'callout', kind: 'info', title: '같은 모양인데 무엇이 다를까?', html: '<code>color = ""</code> 와 <code>count = 0</code> 은 클래스 안에 똑같은 모양으로 적혀 있습니다. 차이는 <b>사용하는 방법</b>입니다.<ul><li><code>self.speed = …</code> 처럼 <b>self 로 대입</b>하면 인스턴스 안에 따로 생깁니다 → 인스턴스 변수</li><li><code>Car.count += 1</code> 처럼 <b>클래스 이름으로 대입</b>하면 클래스의 것 하나만 바뀝니다 → 클래스 변수</li></ul>' },

          { type: 'h', text: '이름을 찾는 순서와 주의할 점' },
          { type: 'figure', html: D_LOOKUP, caption: '📘 인스턴스.이름 을 읽을 때 찾는 순서: 인스턴스 → 클래스 → 부모 클래스' },
          { type: 'p', html: '만약 생성자에서 <code>Car.count += 1</code> 대신 <code>self.count += 1</code> 이라고 쓰면 어떻게 될까요? 오른쪽의 <code>self.count</code> 를 읽을 때는 클래스 변수 0 을 찾아오지만, 대입은 <b>인스턴스에 새 변수</b>를 만들기 때문에 클래스 변수는 계속 0 으로 남습니다.' },
          { type: 'code', title: '추가 예제. self.count 로 쓰면 생기는 문제', code: `class Car :
    count = 0

    def __init__(self) :
        self.count += 1       # 잘못된 방법: 인스턴스 변수가 새로 생긴다

myCar1 = Car()
myCar2 = Car()
myCar3 = Car()
print("myCar3.count :", myCar3.count)
print("Car.count    :", Car.count)`,
            expect: `myCar3.count : 1
Car.count    : 0`,
            desc: '세 대를 만들었는데 각 인스턴스의 count 는 1, 클래스 변수 Car.count 는 0 입니다. 공유하는 값을 바꿀 때는 반드시 <code>클래스명.변수</code> 로 대입하세요.' },
          { type: 'callout', kind: 'warn', title: '리스트 클래스 변수는 더 조심', html: '클래스 변수가 리스트라면 <code>self.items.append(x)</code> 는 새 변수를 만들지 않고 <b>공유 리스트 자체를 바꿉니다</b>. 그래서 한 인스턴스에 넣은 값이 모든 인스턴스에 보이는 버그가 생깁니다. 인스턴스마다 따로 가져야 할 리스트는 생성자에서 <code>self.items = []</code> 로 만드세요.' },
          { type: 'code', repl: true, title: '>>> 셸에서 클래스 변수 확인하기', code: `class Car :
    count = 0
    def __init__(self) :
        Car.count += 1

a = Car()
b = Car()
Car.count
a.count
a.__dict__
Car.count = 100
b.count`,
            expect: `>>> class Car :
...     count = 0
...     def __init__(self) :
...         Car.count += 1
...
>>> a = Car()
>>> b = Car()
>>> Car.count
2
>>> a.count
2
>>> a.__dict__
{}
>>> Car.count = 100
>>> b.count
100
>>>`,
            desc: '<code>__dict__</code> 는 인스턴스가 직접 가진 변수 목록입니다. a 에는 아무 변수도 없으므로(<code>{}</code>) <code>a.count</code> 는 클래스에서 찾아온 값입니다.' }
        ],
        practice: [
          { title: '실습 12-5. 회원 수 세기', level: 1,
            desc: '<p>Member 클래스에 클래스 변수 <code>total</code> 을 두고, 생성자에서 이름을 받아 저장하면서 total 을 1 늘리세요. 회원 3명을 만든 뒤 출력합니다.</p><pre><code>가입 : 김하나 (총 1명)\n가입 : 이두리 (총 2명)\n가입 : 박세나 (총 3명)</code></pre>',
            hint: '생성자 안에서 <code>Member.total += 1</code>, 이름은 <code>self.name = name</code>.',
            starter: `class Member :
    total = 0   # 클래스 변수

    def __init__(self, name) :
        # TODO: 이름 저장, total 1 증가, 가입 메시지 출력
        pass

m1 = Member("김하나")
m2 = Member("이두리")
m3 = Member("박세나")
`,
            solution: `class Member :
    total = 0   # 클래스 변수

    def __init__(self, name) :
        self.name = name
        Member.total += 1
        print("가입 : %s (총 %d명)" % (self.name, Member.total))

m1 = Member("김하나")
m2 = Member("이두리")
m3 = Member("박세나")
`,
            expect: `가입 : 김하나 (총 1명)
가입 : 이두리 (총 2명)
가입 : 박세나 (총 3명)` },
          { title: '실습 12-6. 자동 번호 붙이기', level: 2,
            desc: '<p>Car 클래스의 클래스 변수 <code>count</code> 를 이용해 인스턴스마다 <b>생산 번호</b>(인스턴스 변수 <code>serial</code>)를 붙이세요. 첫 차는 1번, 두 번째 차는 2번 … 입니다.</p><pre><code>빨강 자동차 : 1번\n파랑 자동차 : 2번\n노랑 자동차 : 3번\n총 3대 생산</code></pre>',
            hint: '생성자에서 <code>Car.count += 1</code> 을 먼저 하고, 그 값을 <code>self.serial = Car.count</code> 로 저장합니다.',
            starter: `class Car :
    count = 0

    def __init__(self, color) :
        self.color = color
        # TODO: 생산 번호 붙이기

cars = [Car("빨강"), Car("파랑"), Car("노랑")]
# TODO: 각 자동차의 번호와 총 생산 대수 출력
`,
            solution: `class Car :
    count = 0

    def __init__(self, color) :
        self.color = color
        Car.count += 1
        self.serial = Car.count

cars = [Car("빨강"), Car("파랑"), Car("노랑")]
for car in cars :
    print("%s 자동차 : %d번" % (car.color, car.serial))
print("총 %d대 생산" % Car.count)
`,
            expect: `빨강 자동차 : 1번
파랑 자동차 : 2번
노랑 자동차 : 3번
총 3대 생산` }
        ],
        quiz: [
          { q: '모든 인스턴스가 함께 사용하는, 클래스에 하나만 있는 변수는?', options: ['인스턴스 변수', '지역 변수', '클래스 변수', '매개변수'], answer: 2,
            explain: '클래스 변수는 클래스 안에 공간이 하나만 할당되어 모든 인스턴스가 공유합니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>class Car :\n    count = 0\n    def __init__(self) :\n        Car.count += 1\n\na = Car()\nb = Car()\nc = Car()\nprint(a.count)</code></pre>', options: ['0', '1', '3', '오류'], answer: 2,
            explain: 'Car.count 는 세 번 증가하여 3 입니다. a 에는 count 가 없으므로 클래스 변수 3 을 읽습니다.' },
          { q: '위 코드에서 생성자를 <code>self.count += 1</code> 로 바꾸면 <code>print(Car.count)</code> 의 결과는?', options: ['0', '1', '3', '오류'], answer: 0,
            explain: '<code>self.count = self.count + 1</code> 은 인스턴스에 새 변수를 만들 뿐, 클래스 변수는 0 그대로입니다.' },
          { q: '인스턴스 변수에 대한 설명으로 옳은 것은?', options: ['클래스에 하나만 존재한다', '인스턴스마다 따로 존재한다', '반드시 클래스명.변수 로 사용한다', '생성자 안에서는 만들 수 없다'], answer: 1,
            explain: '인스턴스 변수는 인스턴스마다 따로 생기며, 보통 <code>self.변수</code> 로 사용합니다.' }
        ],
        slides: [
          { layout: 'title', title: '인스턴스 변수와 클래스 변수', subtitle: '각자 가지는 값 vs 모두가 함께 쓰는 값', badge: '12장 3교시',
            notes: '<p>도입 발문: “자동차의 색은 차마다 다르죠. 그럼 ‘지금까지 생산된 자동차 수’ 는 차마다 따로 가져야 할까요?”</p><p>(2분)</p>' },
          { layout: 'diagram', title: '인스턴스 변수', html: D_INSTVAR, caption: '그림 12-5 — 인스턴스를 만들 때마다 인스턴스 안에 따로 생긴다',
            notes: '<p>강의자료 17~18쪽. myCar1.color, myCar1.speed, myCar2.color, myCar2.speed 네 개의 공간이 따로 있다는 점을 짚습니다.</p><p>(4분)</p>' },
          { layout: 'diagram', title: '클래스 변수', html: D_CLASSVAR, caption: '그림 12-6 — 클래스 안에 하나, 모든 인스턴스가 공유',
            notes: '<p>강의자료 19쪽. 점선 상자(Car.count, myCar2.count)는 인스턴스 안에 실제로 있는 것이 아니라 클래스의 count 를 가리키는 “창문” 이라고 설명합니다.</p><p>비유: 교실의 벽시계(클래스 변수)와 각자의 손목시계(인스턴스 변수).</p><p>(4분)</p>' },
          { layout: 'code', title: 'Code12-06. 자동차 생산 대수 확인', code: `class Car :
    color = ""    # 인스턴스 변수
    speed = 0     # 인스턴스 변수
    count = 0     # 클래스 변수

    def __init__(self) :
        self.speed = 0
        Car.count += 1

myCar1 = Car()
myCar1.speed = 30
print("자동차1: %dkm, 총 %d대" % (myCar1.speed, Car.count))

myCar2 = Car()
myCar2.speed = 60
print("자동차2: %dkm, 총 %d대" % (myCar2.speed, myCar2.count))`,
            points: ['생성자에서 <code>Car.count += 1</code> → 생산될 때마다 1 증가', '<code>Car.count</code> 와 <code>myCar2.count</code> 는 같은 값', '출력: 1대 → 2대'],
            notes: '<p>실행 전에 두 번째 줄의 대수를 예측하게 하세요. 인스턴스 변수로 착각하면 “1대” 라고 답합니다.</p><p>(5분)</p>' },
          { layout: 'diagram', title: '이름을 찾는 순서', html: D_LOOKUP, caption: '읽기: 인스턴스 → 클래스 → 부모 클래스   /   쓰기: 대상에 새로 만든다',
            notes: '<p>📘 보충. 파이썬만의 특징이라 시험보다는 버그 예방에 중요합니다. 다음 슬라이드 예제와 함께 보여 주세요.</p><p>이 순서는 5교시 상속(부모 클래스)에서도 그대로 쓰입니다.</p><p>(3분)</p>' },
          { layout: 'code', title: '흔한 실수: self.count += 1', code: `class Car :
    count = 0

    def __init__(self) :
        self.count += 1      # 인스턴스 변수가 새로 생김

myCar1 = Car()
myCar2 = Car()
myCar3 = Car()
print("myCar3.count :", myCar3.count)
print("Car.count    :", Car.count)`,
            points: ['읽기(오른쪽): 클래스 변수 0 을 찾아옴', '쓰기(왼쪽): 인스턴스에 count=1 생성', '결과: 1 과 0 → 공유되지 않음', '공유 값은 반드시 <code>Car.count</code> 로 대입'],
            notes: '<p>실행 결과 1, 0 을 보고 왜 그런지 토론하게 합니다. <code>self.count += 1</code> 을 <code>self.count = self.count + 1</code> 로 풀어 쓰면 이해가 쉽습니다.</p><p>(4분)</p>' },
          { layout: 'quiz', title: '확인 문제', q: 'count = 0 인 클래스 변수를 생성자에서 Car.count += 1 로 증가시킬 때,<br>a, b, c 세 인스턴스를 만든 뒤 print(a.count) 의 결과는?', options: ['0', '1', '3', '오류'], answer: 2,
            explain: '클래스 변수는 공유되므로 3 입니다.',
            notes: '<p>이어서 “Car.count 대신 self.count 라면?” 을 구두로 물어 앞 슬라이드를 복습합니다(답: a.count 는 1, Car.count 는 0).</p><p>(2분)</p>' },
          { layout: 'practice', title: '실습 12-5. 회원 수 세기', desc: '클래스 변수 total 로 가입한 회원 수를 세고, 가입할 때마다 “가입 : 이름 (총 N명)” 을 출력하세요.',
            starter: `class Member :
    total = 0

    def __init__(self, name) :
        # TODO
        pass

m1 = Member("김하나")
m2 = Member("이두리")
`,
            solution: `class Member :
    total = 0

    def __init__(self, name) :
        self.name = name
        Member.total += 1
        print("가입 : %s (총 %d명)" % (self.name, Member.total))

m1 = Member("김하나")
m2 = Member("이두리")
`,
            notes: '<p>빠른 학생에게는 실습 12-6(생산 번호 붙이기)을 이어서 하게 합니다.</p><p>(5분)</p>' },
          { layout: 'summary', title: '3교시 정리',
            bullets: ['인스턴스 변수: 인스턴스마다 따로 (<code>self.변수</code>)', '클래스 변수: 클래스에 하나, 모두 공유 (<code>클래스명.변수</code>)', '읽을 때는 인스턴스 → 클래스 순서로 찾는다', '공유 값을 바꿀 때는 <code>클래스명.변수 = …</code>'],
            notes: '<p>다음 시간 예고: “승용차 · 트럭 클래스를 따로 만들면 속도 올리기 코드를 두 번 써야 할까?” → 상속.</p><p>(1분)</p>' }
        ]
      },
      // ================= 12-4 =================
      {
        id: 'ch12-4',
        title: '클래스의 상속과 메서드 오버라이딩',
        minutes: 50,
        goals: [
          '상속의 개념과 슈퍼(부모) 클래스 · 서브(자식) 클래스를 설명할 수 있다',
          'class 서브_클래스(슈퍼_클래스) 형식으로 상속을 구현할 수 있다',
          '메서드 오버라이딩으로 부모의 메서드를 다시 정의할 수 있다',
          'super() 로 슈퍼 클래스의 메서드나 속성을 사용할 수 있다'
        ],
        flow: [['도입: 중복 코드 문제', 5], ['상속의 개념 · 용어', 10], ['상속 문법 · 예제', 8], ['메서드 오버라이딩 (Code12-07)', 12], ['super()', 8], ['정리 · 퀴즈', 7]],
        content: [
          { type: 'h', text: '상속의 개념' },
          { type: 'p', html: '<b>클래스의 상속(inheritance)</b>이란 <mark>기존 클래스에 있는 필드와 메서드를 그대로 물려받는 새로운 클래스를 만드는 것</mark>입니다.' },
          { type: 'p', html: '승용차 클래스와 트럭 클래스를 따로 만든다고 해 봅시다.' },
          { type: 'table', caption: '그림 12-7 승용차와 트럭 클래스의 개념', head: ['', '승용차 클래스', '트럭 클래스'], rows: [
            ['필드', '색상, 속도, <b style="color:var(--danger)">좌석 수</b>', '색상, 속도, <b style="color:var(--danger)">적재량</b>'],
            ['메서드', '속도 올리기(), 속도 내리기(),<br><b style="color:var(--danger)">좌석 수 알아보기()</b>', '속도 올리기(), 속도 내리기(),<br><b style="color:var(--danger)">적재량 알아보기()</b>']
          ] },
          { type: 'p', html: '색상 · 속도 · 속도 올리기 · 속도 내리기는 두 클래스에 <b>똑같이</b> 들어 있습니다. 같은 코드를 두 번 쓰면 수정할 때도 두 곳을 고쳐야 합니다. 그래서 <b>공통 내용을 자동차 클래스에 두고</b>, 승용차와 트럭은 자동차 클래스를 <b>상속</b>받아 자기만의 내용만 추가합니다. 이렇게 하면 일관되고 효율적으로 프로그래밍할 수 있습니다.' },
          { type: 'figure', html: D_INHERIT, caption: '그림 12-8 상속의 개념 — 공통 내용은 슈퍼 클래스에, 고유 내용만 서브 클래스에' },
          { type: 'table', caption: '상속 관련 용어', head: ['구분', '다른 이름', '예'], rows: [
            ['상위 클래스', '<b>슈퍼 클래스</b>(super class), <b>부모 클래스</b>', '자동차(Car)'],
            ['하위 클래스', '<b>서브 클래스</b>(sub class), <b>자식 클래스</b>', '승용차(Sedan), 트럭(Truck)']
          ] },

          { type: 'h', text: '상속을 구현하는 문법' },
          { type: 'p', html: '클래스 이름 뒤 괄호 안에 물려받을 슈퍼 클래스 이름을 씁니다.' },
          { type: 'code', title: '상속의 형식', run: false, code: `class 서브_클래스(슈퍼_클래스) :
    # 이 부분에 서브 클래스의 내용 코딩` },
          { type: 'code', title: '추가 예제. 그림 12-8 을 코드로: 승용차와 트럭', code: `## 슈퍼 클래스 ##
class Car :
    color = ""
    speed = 0

    def upSpeed(self, value) :
        self.speed += value

    def downSpeed(self, value) :
        self.speed -= value

## 서브 클래스 ##
class Sedan(Car) :
    seatNum = 0

    def getSeatNum(self) :
        return self.seatNum

class Truck(Car) :
    capacity = 0

    def getCapacity(self) :
        return self.capacity

## 메인 코드 ##
sedan1, truck1 = Sedan(), Truck()

sedan1.upSpeed(100)        # Car 에게 물려받은 메서드
truck1.upSpeed(80)
sedan1.seatNum = 5
truck1.capacity = 50

print("승용차의 속도는 %dkm, 좌석 수는 %d개입니다." % (sedan1.speed, sedan1.getSeatNum()))
print("트럭의 속도는 %dkm, 총 적재량은 %d톤입니다." % (truck1.speed, truck1.getCapacity()))`,
            expect: `승용차의 속도는 100km, 좌석 수는 5개입니다.
트럭의 속도는 80km, 총 적재량은 50톤입니다.`,
            desc: 'Sedan, Truck 클래스 안에는 <code>upSpeed()</code> 가 없지만 <code>Car</code> 에서 물려받았기 때문에 사용할 수 있습니다. 서브 클래스에는 좌석 수 · 적재량처럼 자기만의 필드와 메서드만 적으면 됩니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: issubclass() 와 isinstance()', html: '<code>issubclass(Sedan, Car)</code> 는 True — Sedan 은 Car 의 서브 클래스입니다. <code>isinstance(sedan1, Car)</code> 도 True — 승용차는 자동차이기도 하니까요. 반대로 <code>isinstance(sedan1, Truck)</code> 은 False 입니다. “승용차는 자동차이다” 처럼 <b>“A 는 B 이다”</b> 가 자연스러우면 상속 관계로 설계하기 좋습니다.' },

          { type: 'h', text: '메서드 오버라이딩' },
          { type: 'p', html: '<b>메서드 오버라이딩(method overriding)</b>은 <mark>슈퍼 클래스에 있는 메서드를 서브 클래스에서 다시 정의하는 것</mark>입니다. 물려받은 기능을 그대로 쓰지 않고 “우리 집 방식” 으로 바꾸는 것이죠.' },
          { type: 'p', html: '예를 들어 자동차 클래스의 속도 올리기()는 제한 없이 속도를 올리지만, 승용차는 안전을 위해 속도가 150 을 넘지 않게 하고 싶습니다. 이때 승용차 클래스에 같은 이름의 속도 올리기() 메서드를 다시 만들면 됩니다. 트럭 클래스는 다시 만들지 않았으므로 자동차의 것을 그대로 씁니다.' },
          { type: 'figure', html: D_OVERRIDE, caption: '그림 12-9 메서드 오버라이딩의 개념' },
          { type: 'code', title: 'Code12-07. 메서드 오버라이딩', code: `## 클래스 선언 부분 ##
class Car :
    speed = 0
    def upSpeed(self, value) :
        self.speed += value

        print("현재 속도(슈퍼 클래스) : %d" % self.speed)

class Sedan(Car) :
    def upSpeed(self, value) :
        self.speed += value

        if self.speed > 150 :
            self.speed = 150

        print("현재 속도(서브 클래스) : %d" % self.speed)

class Truck(Car) :
    pass

## 변수 선언 부분 ##
sedan1, truck1 = None, None

## 메인 코드 부분 ##
truck1 = Truck()
sedan1 = Sedan()

print("트럭 --> ", end = "")
truck1.upSpeed(200)

print("승용차 --> ", end = "")
sedan1.upSpeed(200)`,
            expect: `트럭 --> 현재 속도(슈퍼 클래스) : 200
승용차 --> 현재 속도(서브 클래스) : 150`,
            desc: '<code>4행</code>과 <code>10행</code>은 메서드 이름과 매개변수가 똑같습니다. Sedan 은 upSpeed() 를 오버라이딩했으므로 <b>자기 것</b>이 실행되어 150 으로 제한됩니다. <code>18~19행</code>의 Truck 은 <code>pass</code> 로 아무것도 추가하지 않았으므로 Car 의 upSpeed() 가 실행됩니다.' },
          { type: 'callout', kind: 'tip', title: '어떤 메서드가 실행될까?', html: '3교시에서 본 “이름 찾는 순서” 가 그대로 적용됩니다. <code>sedan1.upSpeed()</code> 를 부르면 ① sedan1 인스턴스 → ② Sedan 클래스 → ③ Car 클래스 순서로 찾고, <b>먼저 찾은 것</b>을 실행합니다. Sedan 에 upSpeed() 가 있으므로 Car 의 것까지 가지 않습니다.' },

          { type: 'h', text: 'super() 함수' },
          { type: 'p', html: '서브 클래스에서 메서드를 오버라이딩할 때, 슈퍼 클래스의 메서드나 속성을 <b>함께</b> 사용해야 할 때가 있습니다. 이때 <code>super()</code> 를 사용합니다. <code>super()</code> 는 “나의 부모 클래스” 를 가리킨다고 생각하면 됩니다.' },
          { type: 'code', title: '여기서 잠깐. super() 함수', code: `class Car :
    value = '슈퍼 값'
    def carMethod(self) :
        print('슈퍼 클래스 메서드 실행~~')

class Sedan(Car) :
    value = '서브 값'
    def carMethod(self) :
        super().carMethod()     # Car 클래스의 carMethod()가 실행됨
        print('서브 클래스 메서드 실행~~')
        print(super().value)    # Car 클래스의 value가 출력됨

sedan1 = Sedan()
sedan1.carMethod()`,
            expect: `슈퍼 클래스 메서드 실행~~
서브 클래스 메서드 실행~~
슈퍼 값`,
            desc: '<code>9행</code>: 오버라이딩한 메서드 안에서 부모의 carMethod() 를 먼저 실행합니다. <code>11행</code>: <code>self.value</code> 라면 “서브 값” 이 나오지만 <code>super().value</code> 는 부모의 “슈퍼 값” 을 가져옵니다.' },
          { type: 'figure', html: D_SUPER, caption: 'super() 는 부모 클래스에서 찾기 시작한다' },
          { type: 'p', html: 'super() 는 <b>생성자</b>에서 가장 많이 쓰입니다. 부모의 생성자가 해 주는 초기화를 다시 쓰지 않고 그대로 이용한 뒤, 서브 클래스에 필요한 것만 추가로 초기화합니다.' },
          { type: 'code', title: '추가 예제. super().__init__() 으로 부모 생성자 호출', code: `class Car :
    def __init__(self, color, speed) :
        self.color = color
        self.speed = speed

class Sedan(Car) :
    def __init__(self, color, speed, seatNum) :
        super().__init__(color, speed)   # 색상 · 속도는 부모가 초기화
        self.seatNum = seatNum           # 좌석 수만 새로 초기화

sedan1 = Sedan("흰색", 0, 5)
print(sedan1.color, sedan1.speed, sedan1.seatNum)`,
            expect: '흰색 0 5',
            desc: '서브 클래스에 생성자를 만들면 부모의 생성자는 자동으로 불리지 않습니다. 그래서 <code>8행</code>처럼 직접 불러 줘야 합니다. 5교시 [프로그램 2]에서는 같은 일을 <code>Shape.__init__(self)</code> 로 합니다.' },
          { type: 'callout', kind: 'warn', title: '부모 생성자 호출을 잊으면', html: '위 예제에서 <code>8행</code>을 지우면 sedan1 에는 color, speed 가 만들어지지 않아 <code>AttributeError: \'Sedan\' object has no attribute \'color\'</code> 오류가 납니다.' }
        ],
        practice: [
          { title: 'SELF STUDY 12-2. Sonata 클래스 추가', level: 1,
            desc: '<p>Code12-07 에 Sonata 클래스를 추가하세요. 단, Sonata 클래스는 Car → Sedan → Sonata 순서로 상속을 받도록 하고, 특별히 추가하는 필드나 메서드는 없습니다.</p><pre><code>트럭 --> 현재 속도(슈퍼 클래스) : 200\n승용차 --> 현재 속도(서브 클래스) : 150\n소나타 --> 현재 속도(서브 클래스) : 150</code></pre>',
            hint: '<code>class Sonata(Sedan) :</code> 다음 줄에 <code>pass</code>. 소나타는 Sedan 의 upSpeed() 를 물려받습니다.',
            starter: `class Car :
    speed = 0
    def upSpeed(self, value) :
        self.speed += value
        print("현재 속도(슈퍼 클래스) : %d" % self.speed)

class Sedan(Car) :
    def upSpeed(self, value) :
        self.speed += value
        if self.speed > 150 :
            self.speed = 150
        print("현재 속도(서브 클래스) : %d" % self.speed)

class Truck(Car) :
    pass

# TODO: Sonata 클래스 (Sedan 상속)

truck1 = Truck()
sedan1 = Sedan()

print("트럭 --> ", end = "")
truck1.upSpeed(200)
print("승용차 --> ", end = "")
sedan1.upSpeed(200)
# TODO: sonata1 만들고 upSpeed(200)
`,
            solution: `class Car :
    speed = 0
    def upSpeed(self, value) :
        self.speed += value
        print("현재 속도(슈퍼 클래스) : %d" % self.speed)

class Sedan(Car) :
    def upSpeed(self, value) :
        self.speed += value
        if self.speed > 150 :
            self.speed = 150
        print("현재 속도(서브 클래스) : %d" % self.speed)

class Truck(Car) :
    pass

class Sonata(Sedan) :
    pass

truck1 = Truck()
sedan1 = Sedan()
sonata1 = Sonata()

print("트럭 --> ", end = "")
truck1.upSpeed(200)
print("승용차 --> ", end = "")
sedan1.upSpeed(200)
print("소나타 --> ", end = "")
sonata1.upSpeed(200)
`,
            expect: `트럭 --> 현재 속도(슈퍼 클래스) : 200
승용차 --> 현재 속도(서브 클래스) : 150
소나타 --> 현재 속도(서브 클래스) : 150` },
          { title: '실습 12-7. 동물 울음소리 (오버라이딩)', level: 2,
            desc: '<p>Animal 클래스의 생성자는 이름을 받고, <code>speak()</code> 는 “(이름): ...” 을 출력합니다. Dog, Cat 클래스가 Animal 을 상속받아 speak() 를 오버라이딩하세요. Dog 는 부모의 speak() 를 먼저 실행한 뒤 “멍멍!” 을 출력합니다(super() 사용).</p><pre><code>뽀삐: ...\n뽀삐: 멍멍!\n나비: 야옹~</code></pre>',
            hint: 'Dog 의 speak() 안에서 <code>super().speak()</code> 를 먼저 부릅니다. 이름은 <code>self.name</code>.',
            starter: `class Animal :
    def __init__(self, name) :
        self.name = name

    def speak(self) :
        print("%s: ..." % self.name)

# TODO: class Dog(Animal) - super().speak() 후 "멍멍!"
# TODO: class Cat(Animal) - "야옹~"

# dog = Dog("뽀삐")
# cat = Cat("나비")
# dog.speak()
# cat.speak()
`,
            solution: `class Animal :
    def __init__(self, name) :
        self.name = name

    def speak(self) :
        print("%s: ..." % self.name)

class Dog(Animal) :
    def speak(self) :
        super().speak()
        print("%s: 멍멍!" % self.name)

class Cat(Animal) :
    def speak(self) :
        print("%s: 야옹~" % self.name)

dog = Dog("뽀삐")
cat = Cat("나비")
dog.speak()
cat.speak()
`,
            expect: `뽀삐: ...
뽀삐: 멍멍!
나비: 야옹~` }
        ],
        quiz: [
          { q: '<code>class Sedan(Car) :</code> 에서 Car 를 무엇이라고 하는가?', options: ['서브 클래스', '슈퍼 클래스', '인스턴스', '생성자'], answer: 1,
            explain: '괄호 안의 Car 는 물려주는 쪽인 슈퍼(부모) 클래스, Sedan 은 서브(자식) 클래스입니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>class A :\n    def hello(self) :\n        print("A")\nclass B(A) :\n    def hello(self) :\n        print("B")\nclass C(A) :\n    pass\n\nB().hello()\nC().hello()</code></pre>', options: ['A 다음 A', 'B 다음 B', 'B 다음 A', 'A 다음 B'], answer: 2,
            explain: 'B 는 hello() 를 오버라이딩했으므로 “B”, C 는 오버라이딩하지 않았으므로 A 의 “A” 가 출력됩니다.' },
          { q: '서브 클래스의 메서드 안에서 슈퍼 클래스의 같은 이름 메서드를 실행하는 방법은?', options: ['self.method()', 'super().method()', 'sub().method()', 'parent.method()'], answer: 1,
            explain: '<code>super()</code> 는 부모 클래스를 가리킵니다. <code>self.method()</code> 는 자기 자신의 (오버라이딩된) 메서드를 다시 부르게 됩니다.' },
          { q: '메서드 오버라이딩에 대한 설명으로 옳은 것은?', options: ['슈퍼 클래스의 메서드를 서브 클래스에서 다시 정의하는 것', '같은 클래스에 이름이 같은 메서드를 여러 개 만드는 것', '클래스 변수를 인스턴스 변수로 바꾸는 것', '인스턴스를 삭제하는 것'], answer: 0,
            explain: '오버라이딩 = 물려받은 메서드를 서브 클래스에서 재정의하는 것입니다.' }
        ],
        slides: [
          { layout: 'title', title: '클래스의 상속', subtitle: '상속 · 메서드 오버라이딩 · super()', badge: '12장 4교시',
            notes: '<p>도입 발문: “승용차 클래스와 트럭 클래스를 만들 때 같은 코드가 얼마나 겹칠까요?”</p><p>(2분)</p>' },
          { layout: 'table', title: '상속이 필요한 이유', lead: '그림 12-7 — 승용차와 트럭에 같은 내용이 반복된다', head: ['', '승용차', '트럭'],
            rows: [['필드', '색상, 속도, <b>좌석 수</b>', '색상, 속도, <b>적재량</b>'], ['메서드', '속도 올리기 · 내리기, <b>좌석 수 알아보기</b>', '속도 올리기 · 내리기, <b>적재량 알아보기</b>']],
            notes: '<p>강의자료 21쪽. 겹치는 부분(굵지 않은 글씨)을 학생이 찾게 하세요. “속도 올리기에 버그가 있으면 몇 곳을 고쳐야 하나?” → 2곳.</p><p>(3분)</p>' },
          { layout: 'diagram', title: '상속의 개념', html: D_INHERIT, caption: '그림 12-8 — 공통 내용은 슈퍼 클래스, 고유 내용만 서브 클래스',
            notes: '<p>강의자료 22쪽. 용어: 슈퍼 클래스 = 부모 클래스, 서브 클래스 = 자식 클래스. 화살표는 자식 → 부모 방향(UML 상속 표기)이라는 것도 알려 줍니다.</p><p>(4분)</p>' },
          { layout: 'code', title: '상속 문법: class 서브(슈퍼)', code: `class Car :
    speed = 0
    def upSpeed(self, value) :
        self.speed += value

class Sedan(Car) :
    seatNum = 0
    def getSeatNum(self) :
        return self.seatNum

sedan1 = Sedan()
sedan1.upSpeed(100)      # Car 에게 물려받음
sedan1.seatNum = 5
print(sedan1.speed, sedan1.getSeatNum())
print(isinstance(sedan1, Car))`,
            points: ['<code>class 서브_클래스(슈퍼_클래스) :</code>', 'Sedan 에 없는 <code>upSpeed()</code> 도 사용 가능', '승용차는 자동차이다 → isinstance 도 True'],
            notes: '<p>강의자료 23쪽의 형식을 실제 코드로 보여 줍니다. <code>(Car)</code> 를 지우고 실행하면 AttributeError 가 나는 것을 보여 주면 효과가 확실합니다.</p><p>(4분)</p>' },
          { layout: 'diagram', title: '메서드 오버라이딩', html: D_OVERRIDE, caption: '그림 12-9 — 상위 클래스의 메서드를 서브 클래스에서 재정의',
            notes: '<p>강의자료 24쪽. 승용차만 “150 제한” 규칙으로 바꾸고, 트럭은 그대로 물려받습니다.</p><p>비유: 부모님의 요리법을 물려받았지만 나는 덜 맵게 바꿔서 요리한다.</p><p>(3분)</p>' },
          { layout: 'code', title: 'Code12-07. 메서드 오버라이딩', code: `class Car :
    speed = 0
    def upSpeed(self, value) :
        self.speed += value
        print("현재 속도(슈퍼 클래스) : %d" % self.speed)

class Sedan(Car) :
    def upSpeed(self, value) :
        self.speed += value
        if self.speed > 150 :
            self.speed = 150
        print("현재 속도(서브 클래스) : %d" % self.speed)

class Truck(Car) :
    pass

truck1 = Truck()
sedan1 = Sedan()
print("트럭 --> ", end = "")
truck1.upSpeed(200)
print("승용차 --> ", end = "")
sedan1.upSpeed(200)`,
            points: ['Sedan: upSpeed() 재정의 → 150', 'Truck: <code>pass</code> → Car 의 upSpeed() → 200', '이름 · 매개변수가 같은 메서드를 다시 만든다'],
            notes: '<p>강의자료 25~26쪽(빈 줄을 줄인 버전). 실행 전 예측: 트럭 200, 승용차 150.</p><p>발문: “Truck 클래스는 비어 있는데 왜 upSpeed() 가 되나요?”</p><p>(5분)</p>' },
          { layout: 'code', title: 'super() 함수', code: `class Car :
    value = '슈퍼 값'
    def carMethod(self) :
        print('슈퍼 클래스 메서드 실행~~')

class Sedan(Car) :
    value = '서브 값'
    def carMethod(self) :
        super().carMethod()
        print('서브 클래스 메서드 실행~~')
        print(super().value)

sedan1 = Sedan()
sedan1.carMethod()`,
            points: ['<code>super()</code> = 부모 클래스', '<code>super().carMethod()</code>: 부모의 메서드 실행', '<code>super().value</code>: 부모의 값 (self.value 는 서브 값)', '생성자에서 <code>super().__init__(…)</code> 로 많이 사용'],
            notes: '<p>강의자료 32쪽 “여기서 잠깐”. 11행을 <code>print(self.value)</code> 로 바꿔 “서브 값” 이 나오는 것과 비교하세요.</p><p>부모 생성자 호출은 5교시 [프로그램 2]의 <code>Shape.__init__(self)</code> 와 연결됩니다.</p><p>(5분)</p>' },
          { layout: 'quiz', title: '확인 문제', q: 'B 는 hello() 를 오버라이딩("B" 출력), C 는 pass 인 A 의 서브 클래스일 때<br>B().hello(); C().hello() 의 결과는? (A 의 hello 는 "A" 출력)', options: ['A, A', 'B, B', 'B, A', 'A, B'], answer: 2,
            explain: '오버라이딩한 B 는 자기 것, C 는 A 의 것을 실행합니다.',
            notes: '<p>(2분)</p>' },
          { layout: 'practice', title: 'SELF STUDY 12-2. Sonata 클래스', desc: 'Car → Sedan → Sonata 순서로 상속받는 Sonata 클래스를 추가하고 upSpeed(200) 을 호출하세요. 출력: 소나타 --> 현재 속도(서브 클래스) : 150',
            starter: `class Car :
    speed = 0
    def upSpeed(self, value) :
        self.speed += value
        print("현재 속도(슈퍼 클래스) : %d" % self.speed)

class Sedan(Car) :
    def upSpeed(self, value) :
        self.speed += value
        if self.speed > 150 :
            self.speed = 150
        print("현재 속도(서브 클래스) : %d" % self.speed)

# TODO: class Sonata
`,
            solution: `class Car :
    speed = 0
    def upSpeed(self, value) :
        self.speed += value
        print("현재 속도(슈퍼 클래스) : %d" % self.speed)

class Sedan(Car) :
    def upSpeed(self, value) :
        self.speed += value
        if self.speed > 150 :
            self.speed = 150
        print("현재 속도(서브 클래스) : %d" % self.speed)

class Sonata(Sedan) :
    pass

sonata1 = Sonata()
print("소나타 --> ", end = "")
sonata1.upSpeed(200)
`,
            notes: '<p>강의자료 27쪽. 여러 단계 상속(할아버지 → 아버지 → 나)도 가능하다는 것을 보여 주는 문제입니다. Sonata 는 가장 가까운 부모인 Sedan 의 upSpeed() 를 씁니다.</p><p>(4분)</p>' },
          { layout: 'summary', title: '4교시 정리',
            bullets: ['상속: <code>class 서브(슈퍼) :</code> — 필드 · 메서드를 물려받는다', '슈퍼 = 부모 클래스, 서브 = 자식 클래스', '오버라이딩: 물려받은 메서드를 서브 클래스에서 재정의', '<code>super()</code>: 부모의 메서드 · 속성 · 생성자 사용'],
            notes: '<p>다음 시간: 상속과 오버라이딩을 이용해 [프로그램 2] 거북이 사각형 그리기를 완성합니다.</p><p>(1분)</p>' }
        ]
      },
      // ================= 12-5 =================
      {
        id: 'ch12-5',
        title: '[프로그램 2] 객체지향 사각형을 그리는 거북이',
        minutes: 45,
        goals: [
          'Shape 슈퍼 클래스와 Rectangle 서브 클래스의 역할을 설명할 수 있다',
          '서브 클래스 생성자에서 슈퍼 클래스 생성자를 호출할 수 있다',
          '마우스 클릭 이벤트로 인스턴스를 만들어 [프로그램 2]를 완성할 수 있다'
        ],
        flow: [['도입: 완성 화면 보기', 4], ['클래스 구조 설계', 8], ['Shape 클래스', 8], ['Rectangle 클래스 · 좌표 계산', 12], ['클릭 이벤트 · 실행', 8], ['정리 · 퀴즈', 5]],
        content: [
          { type: 'h', text: '프로그램 설계' },
          { type: 'p', html: '[프로그램 2]는 거북이 그래픽 창을 클릭할 때마다 클릭한 곳을 중심으로 <b>무작위 크기 · 색 · 두께</b>의 사각형을 그립니다. 사각형 하나하나를 <b>새 거북이(인스턴스)</b>가 그리기 때문에 그리기가 끝난 자리에 거북이가 남아 있습니다.' },
          { type: 'figure', html: D_SHAPE, caption: '[프로그램 2]의 클래스 구조와 클릭했을 때의 동작' },
          { type: 'list', items: [
            '<b>Shape (슈퍼 클래스)</b>: 모든 도형에 공통인 것 — 거북이(myTurtle), 중심점(cx, cy), 펜 설정(setPen), 도형 그리기(drawShape, 내용 없음)',
            '<b>Rectangle (서브 클래스)</b>: 사각형만의 것 — 가로 · 세로(width, height), 사각형을 그리는 drawShape() <b>오버라이딩</b>',
            '나중에 원(Circle) · 삼각형(Triangle) 클래스를 추가할 때도 Shape 를 상속받으면 거북이 생성 · 펜 설정 코드를 다시 쓸 필요가 없습니다.'
          ] },

          { type: 'h', text: '사각형의 네 꼭짓점 계산' },
          { type: 'p', html: '클릭한 점 (cx, cy) 가 사각형의 중심입니다. 가로 width, 세로 height 의 절반씩 빼고 더하면 왼쪽 아래 (sx1, sy1) 와 오른쪽 위 (sx2, sy2) 를 구할 수 있습니다. 거북이는 왼쪽 아래에서 출발해 ①위 → ②오른쪽 → ③아래 → ④왼쪽 으로 돌아옵니다.' },
          { type: 'figure', html: D_RECT, caption: '중심점과 크기로 꼭짓점 좌표 구하기 (거북이 좌표계는 위쪽이 +y)' },

          { type: 'h', text: '[프로그램 2]의 완성' },
          { type: 'code', title: '[프로그램 2] 완성: Code12-08. 객체지향 사각형을 그리는 거북이', nondeterministic: true, code: `import turtle
import random

## 클래스 선언 부분 ##
class Shape :           # 슈퍼 클래스
    myTurtle = None
    cx, cy = 0, 0       # 도형의 중심점

    def __init__(self) :
        self.myTurtle = turtle.Turtle('turtle')   # 거북이 생성

    def setPen(self) :                   # 펜 색상과 두께 무작위로 뽑기
        r = random.random()
        g = random.random()
        b = random.random()
        self.myTurtle.pencolor((r, g, b))
        pSize = random.randrange(1, 10)
        self.myTurtle.pensize(pSize)

    def drawShape(self) :                # 서브 클래스에서 상속받아 오버라이딩
        pass

class Rectangle(Shape) :                 # 서브 클래스
    width, height = [0] * 2
    def __init__(self, x, y) :
        Shape.__init__(self)
        self.cx = x
        self.cy = y
        self.width = random.randrange(20, 100)
        self.height = random.randrange(20, 100)

    def drawShape(self) :
        # 네모 그리기
        sx1, sy1, sx2, sy2 = [0] * 4      # 왼쪽 위 X, Y와 오른쪽 아래 X, Y

        sx1 = self.cx - self.width / 2
        sy1 = self.cy - self.height / 2
        sx2 = self.cx + self.width / 2
        sy2 = self.cy + self.height / 2

        self.setPen()                    # 부모 클래스 메서드
        self.myTurtle.penup()
        self.myTurtle.goto(sx1, sy1)
        self.myTurtle.pendown()
        self.myTurtle.goto(sx1, sy2)
        self.myTurtle.goto(sx2, sy2)
        self.myTurtle.goto(sx2, sy1)
        self.myTurtle.goto(sx1, sy1)

## 함수 선언 부분 ##
def screenLeftClick(x, y) :
    rect = Rectangle(x, y)
    rect.drawShape()

## 메인 코드 부분 ##
turtle.title('거북이로 객체지향 사각형 그리기')
turtle.onscreenclick(screenLeftClick, 1)
turtle.done()`,
            desc: '▶ 실행한 뒤 거북이 창을 여러 번 클릭해 보세요. <code>10행</code>: 인스턴스마다 새 거북이를 만듭니다(모양 <code>\'turtle\'</code>). <code>16행</code>: pencolor 에 0~1 사이 실수 3개(빨강 · 초록 · 파랑 비율)를 튜플로 넘깁니다. <code>25행</code>: Rectangle 이 생성자를 새로 만들었으므로 부모 생성자를 <b>직접</b> 불러 거북이를 만듭니다. <code>41행</code>: Rectangle 에 없는 setPen() 은 부모 Shape 에게 물려받은 것입니다. <code>56행</code>: 마우스 왼쪽 버튼(1)을 클릭하면 screenLeftClick(x, y) 가 클릭한 좌표와 함께 호출됩니다.' },
          { type: 'callout', kind: 'info', title: '코드 읽기 포인트', html: '<ul><li><code>width, height = [0] * 2</code> 는 <code>[0, 0]</code> 을 두 변수에 나눠 담는 이 책의 스타일로, <code>width, height = 0, 0</code> 과 같습니다.</li><li>주석의 “왼쪽 위 · 오른쪽 아래” 는 화면 좌표(아래쪽이 +y) 기준 설명입니다. 거북이 좌표는 위쪽이 +y 라서 실제로는 sy1 이 아래쪽입니다. 사각형 모양에는 영향이 없습니다.</li><li><code>Shape.__init__(self)</code> 는 4교시에 배운 <code>super().__init__()</code> 과 같은 역할입니다.</li></ul>' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 클릭 없이 결과 미리 보기', html: '클릭 이벤트 대신 반복문으로 <code>screenLeftClick()</code> 을 직접 불러도 됩니다. 아래 예제는 무작위 위치에 사각형 10개를 자동으로 그립니다. 거북이 10마리가 차례로 태어나 그림을 그리는 모습을 볼 수 있습니다.' },
          { type: 'code', title: '추가 예제. 사각형 10개 자동으로 그리기', nondeterministic: true, code: `import turtle
import random

class Shape :
    myTurtle = None
    cx, cy = 0, 0

    def __init__(self) :
        self.myTurtle = turtle.Turtle('turtle')

    def setPen(self) :
        self.myTurtle.pencolor((random.random(), random.random(), random.random()))
        self.myTurtle.pensize(random.randrange(1, 10))

    def drawShape(self) :
        pass

class Rectangle(Shape) :
    def __init__(self, x, y) :
        super().__init__()
        self.cx, self.cy = x, y
        self.width = random.randrange(20, 100)
        self.height = random.randrange(20, 100)

    def drawShape(self) :
        sx1, sy1 = self.cx - self.width / 2, self.cy - self.height / 2
        sx2, sy2 = self.cx + self.width / 2, self.cy + self.height / 2
        self.setPen()
        self.myTurtle.penup()
        self.myTurtle.goto(sx1, sy1)
        self.myTurtle.pendown()
        for x, y in [(sx1, sy2), (sx2, sy2), (sx2, sy1), (sx1, sy1)] :
            self.myTurtle.goto(x, y)

turtle.title('사각형 10개 자동으로 그리기')
turtle.speed(0)
for i in range(10) :
    rect = Rectangle(random.randint(-250, 250), random.randint(-200, 200))
    rect.drawShape()
turtle.done()`,
            desc: '<code>super().__init__()</code> 과 튜플 목록을 도는 for 문으로 조금 더 짧게 정리한 버전입니다. 동작은 Code12-08 과 같습니다.' }
        ],
        practice: [
          { title: '실습 12-8. 원을 그리는 Circle 클래스 추가', level: 2,
            desc: '<p>Code12-08 에 Shape 를 상속받는 <code>Circle</code> 클래스를 추가하세요. 생성자는 중심 (x, y) 와 10~50 사이 무작위 반지름(radius)을 정하고, drawShape() 는 중심에서 반지름만큼 아래로 내려간 곳에서 <code>circle(radius)</code> 로 원을 그립니다. 클릭하면 사각형과 원이 번갈아 그려지게 하세요.</p>',
            hint: '원은 거북이의 현재 위치에서 왼쪽으로 돌며 그려집니다. <code>goto(cx, cy - radius)</code> 로 이동한 뒤 <code>circle(radius)</code>. 번갈아 그리기는 전역 변수 count 를 두고 짝수 · 홀수로 나눕니다.',
            starter: `import turtle
import random

class Shape :
    myTurtle = None
    cx, cy = 0, 0
    def __init__(self) :
        self.myTurtle = turtle.Turtle('turtle')
    def setPen(self) :
        self.myTurtle.pencolor((random.random(), random.random(), random.random()))
        self.myTurtle.pensize(random.randrange(1, 10))
    def drawShape(self) :
        pass

class Rectangle(Shape) :
    def __init__(self, x, y) :
        Shape.__init__(self)
        self.cx, self.cy = x, y
        self.width = random.randrange(20, 100)
        self.height = random.randrange(20, 100)
    def drawShape(self) :
        sx1, sy1 = self.cx - self.width / 2, self.cy - self.height / 2
        sx2, sy2 = self.cx + self.width / 2, self.cy + self.height / 2
        self.setPen()
        self.myTurtle.penup()
        self.myTurtle.goto(sx1, sy1)
        self.myTurtle.pendown()
        self.myTurtle.goto(sx1, sy2)
        self.myTurtle.goto(sx2, sy2)
        self.myTurtle.goto(sx2, sy1)
        self.myTurtle.goto(sx1, sy1)

# TODO: class Circle(Shape)

count = 0
def screenLeftClick(x, y) :
    global count
    # TODO: count 가 짝수면 Rectangle, 홀수면 Circle
    rect = Rectangle(x, y)
    rect.drawShape()
    count += 1

turtle.title('사각형과 원 그리기')
turtle.onscreenclick(screenLeftClick, 1)
turtle.done()
`,
            solution: `import turtle
import random

class Shape :
    myTurtle = None
    cx, cy = 0, 0
    def __init__(self) :
        self.myTurtle = turtle.Turtle('turtle')
    def setPen(self) :
        self.myTurtle.pencolor((random.random(), random.random(), random.random()))
        self.myTurtle.pensize(random.randrange(1, 10))
    def drawShape(self) :
        pass

class Rectangle(Shape) :
    def __init__(self, x, y) :
        Shape.__init__(self)
        self.cx, self.cy = x, y
        self.width = random.randrange(20, 100)
        self.height = random.randrange(20, 100)
    def drawShape(self) :
        sx1, sy1 = self.cx - self.width / 2, self.cy - self.height / 2
        sx2, sy2 = self.cx + self.width / 2, self.cy + self.height / 2
        self.setPen()
        self.myTurtle.penup()
        self.myTurtle.goto(sx1, sy1)
        self.myTurtle.pendown()
        self.myTurtle.goto(sx1, sy2)
        self.myTurtle.goto(sx2, sy2)
        self.myTurtle.goto(sx2, sy1)
        self.myTurtle.goto(sx1, sy1)

class Circle(Shape) :
    def __init__(self, x, y) :
        Shape.__init__(self)
        self.cx, self.cy = x, y
        self.radius = random.randrange(10, 50)
    def drawShape(self) :
        self.setPen()
        self.myTurtle.penup()
        self.myTurtle.goto(self.cx, self.cy - self.radius)
        self.myTurtle.pendown()
        self.myTurtle.circle(self.radius)

count = 0
def screenLeftClick(x, y) :
    global count
    if count % 2 == 0 :
        shape = Rectangle(x, y)
    else :
        shape = Circle(x, y)
    shape.drawShape()
    count += 1

turtle.title('사각형과 원 그리기')
turtle.onscreenclick(screenLeftClick, 1)
turtle.done()
`,
            nondeterministic: true },
          { title: '실습 12-9. 정사각형 클래스', level: 2,
            desc: '<p>Rectangle 을 상속받는 <code>Square</code> 클래스를 만드세요. 생성자에서 부모 생성자를 부른 뒤 <code>height</code> 를 <code>width</code> 와 같게 바꾸기만 하면 됩니다(drawShape 는 그대로 물려받음). 화면 여러 곳에 정사각형 5개를 자동으로 그리세요.</p>',
            hint: '<code>class Square(Rectangle) :</code> 의 생성자 안에서 <code>Rectangle.__init__(self, x, y)</code> 또는 <code>super().__init__(x, y)</code> 후 <code>self.height = self.width</code>.',
            starter: `import turtle
import random

class Shape :
    def __init__(self) :
        self.myTurtle = turtle.Turtle('turtle')
    def setPen(self) :
        self.myTurtle.pencolor((random.random(), random.random(), random.random()))
        self.myTurtle.pensize(random.randrange(1, 10))
    def drawShape(self) :
        pass

class Rectangle(Shape) :
    def __init__(self, x, y) :
        Shape.__init__(self)
        self.cx, self.cy = x, y
        self.width = random.randrange(20, 100)
        self.height = random.randrange(20, 100)
    def drawShape(self) :
        sx1, sy1 = self.cx - self.width / 2, self.cy - self.height / 2
        sx2, sy2 = self.cx + self.width / 2, self.cy + self.height / 2
        self.setPen()
        self.myTurtle.penup()
        self.myTurtle.goto(sx1, sy1)
        self.myTurtle.pendown()
        for x, y in [(sx1, sy2), (sx2, sy2), (sx2, sy1), (sx1, sy1)] :
            self.myTurtle.goto(x, y)

# TODO: class Square(Rectangle)

# TODO: 정사각형 5개 그리기
turtle.done()
`,
            solution: `import turtle
import random

class Shape :
    def __init__(self) :
        self.myTurtle = turtle.Turtle('turtle')
    def setPen(self) :
        self.myTurtle.pencolor((random.random(), random.random(), random.random()))
        self.myTurtle.pensize(random.randrange(1, 10))
    def drawShape(self) :
        pass

class Rectangle(Shape) :
    def __init__(self, x, y) :
        Shape.__init__(self)
        self.cx, self.cy = x, y
        self.width = random.randrange(20, 100)
        self.height = random.randrange(20, 100)
    def drawShape(self) :
        sx1, sy1 = self.cx - self.width / 2, self.cy - self.height / 2
        sx2, sy2 = self.cx + self.width / 2, self.cy + self.height / 2
        self.setPen()
        self.myTurtle.penup()
        self.myTurtle.goto(sx1, sy1)
        self.myTurtle.pendown()
        for x, y in [(sx1, sy2), (sx2, sy2), (sx2, sy1), (sx1, sy1)] :
            self.myTurtle.goto(x, y)

class Square(Rectangle) :
    def __init__(self, x, y) :
        super().__init__(x, y)
        self.height = self.width

for i in range(5) :
    sq = Square(random.randint(-250, 250), random.randint(-200, 200))
    sq.drawShape()
turtle.done()
`,
            nondeterministic: true }
        ],
        quiz: [
          { q: 'Code12-08 에서 Rectangle 의 생성자가 <code>Shape.__init__(self)</code> 를 호출하는 이유는?', options: ['사각형 크기를 정하려고', '부모 생성자에 있는 거북이 생성 코드를 실행하려고', '화면 제목을 바꾸려고', '클릭 이벤트를 등록하려고'], answer: 1,
            explain: '서브 클래스에 생성자를 만들면 부모 생성자가 자동으로 불리지 않으므로, 거북이를 만드는 Shape 의 생성자를 직접 부릅니다.' },
          { q: 'Rectangle 클래스 안에는 없지만 <code>self.setPen()</code> 을 쓸 수 있는 이유는?', options: ['setPen 이 전역 함수라서', 'turtle 모듈의 함수라서', 'Shape 에게서 상속받았기 때문에', '오류가 발생한다'], answer: 2,
            explain: 'Rectangle 은 Shape 의 서브 클래스이므로 Shape 의 메서드를 물려받아 사용합니다.' },
          { q: '중심이 (100, 50), width 가 40, height 가 20 인 사각형의 sx1, sy1 은?', options: ['(80, 40)', '(60, 30)', '(120, 60)', '(100, 50)'], answer: 0,
            explain: 'sx1 = 100 - 40/2 = 80, sy1 = 50 - 20/2 = 40 입니다.' },
          { q: 'Shape 의 <code>drawShape()</code> 가 <code>pass</code> 로 비어 있는 이유는?', options: ['나중에 지울 코드라서', '서브 클래스에서 오버라이딩해서 채우기 위해', '거북이가 그림을 그리지 못하게 하려고', '파이썬 문법상 꼭 필요해서'], answer: 1,
            explain: '도형마다 그리는 방법이 다르므로 부모는 빈 껍데기만 두고 서브 클래스가 오버라이딩합니다(6교시 추상 메서드).' }
        ],
        slides: [
          { layout: 'title', title: '[프로그램 2] 객체지향 사각형을 그리는 거북이', subtitle: '상속 · 오버라이딩 · 이벤트를 한 번에', badge: '12장 5교시',
            notes: '<p>먼저 완성 코드(Code12-08)를 실행해 여러 번 클릭하는 모습을 보여 주고 시작합니다.</p><p>발문: “클릭할 때마다 새로 생기는 것은 무엇일까요?” → 거북이 = 인스턴스.</p><p>(3분)</p>' },
          { layout: 'diagram', title: '클래스 구조와 동작 흐름', html: D_SHAPE, caption: 'Shape(공통) ← Rectangle(사각형) / 클릭 → 인스턴스 생성 → drawShape()',
            notes: '<p>왼쪽: 클래스 구조, 오른쪽: 클릭 한 번에 일어나는 일. “원을 그리는 클래스를 추가한다면 무엇만 새로 만들면 될까?” → Circle 의 생성자와 drawShape() 만.</p><p>(4분)</p>' },
          { layout: 'code', title: 'Code12-08 ① Shape 슈퍼 클래스', code: `import turtle
import random

class Shape :           # 슈퍼 클래스
    myTurtle = None
    cx, cy = 0, 0       # 도형의 중심점

    def __init__(self) :
        self.myTurtle = turtle.Turtle('turtle')

    def setPen(self) :
        r = random.random()
        g = random.random()
        b = random.random()
        self.myTurtle.pencolor((r, g, b))
        pSize = random.randrange(1, 10)
        self.myTurtle.pensize(pSize)

    def drawShape(self) :
        pass`,
            points: ['생성자: 인스턴스마다 새 거북이', 'setPen(): 색(0~1 실수 3개) · 두께 무작위', 'drawShape(): 비워 두고 서브 클래스가 채운다'],
            notes: '<p>강의자료 28~29쪽. 실행해도 클래스만 선언했으므로 화면에 아무 일도 없습니다.</p><p>pencolor((r, g, b)) 의 괄호가 두 겹인 이유: 튜플 하나를 넘기기 때문.</p><p>(5분)</p>' },
          { layout: 'diagram', title: '사각형 꼭짓점 계산', html: D_RECT, caption: '중심 ± 크기의 절반 → 왼쪽 아래(sx1, sy1)에서 출발해 ①→②→③→④',
            notes: '<p>칠판에 좌표를 그려 직접 계산해 보게 하세요. 예: 중심 (100, 50), 가로 40, 세로 20 → (80, 40)~(120, 60).</p><p>강의자료 주석의 “왼쪽 위” 는 화면 좌표 기준이라 거북이 좌표와 반대라는 점도 짚어 줍니다.</p><p>(4분)</p>' },
          { layout: 'code', title: 'Code12-08 ② Rectangle 서브 클래스', code: `class Rectangle(Shape) :                 # 서브 클래스
    width, height = [0] * 2
    def __init__(self, x, y) :
        Shape.__init__(self)
        self.cx = x
        self.cy = y
        self.width = random.randrange(20, 100)
        self.height = random.randrange(20, 100)

    def drawShape(self) :
        sx1 = self.cx - self.width / 2
        sy1 = self.cy - self.height / 2
        sx2 = self.cx + self.width / 2
        sy2 = self.cy + self.height / 2
        self.setPen()                    # 부모 클래스 메서드
        self.myTurtle.penup()
        self.myTurtle.goto(sx1, sy1)
        self.myTurtle.pendown()
        self.myTurtle.goto(sx1, sy2)
        self.myTurtle.goto(sx2, sy2)
        self.myTurtle.goto(sx2, sy1)
        self.myTurtle.goto(sx1, sy1)`,
            run: false,
            points: ['<code>Shape.__init__(self)</code>: 부모 생성자 호출', '크기는 20~99 무작위', 'drawShape() 오버라이딩', '<code>self.setPen()</code>: 물려받은 메서드'],
            notes: '<p>강의자료 29~30쪽. 이 슬라이드는 Shape 가 없어서 단독 실행이 안 됩니다(run: false). 전체 실행은 다음 슬라이드에서.</p><p>발문: “Shape.__init__(self) 줄을 지우면?” → myTurtle 이 None 이라 AttributeError.</p><p>(6분)</p>' },
          { layout: 'code', title: 'Code12-08 ③ 클릭 이벤트 (전체 실행)', code: `import turtle, random
class Shape :
    def __init__(self) :
        self.myTurtle = turtle.Turtle('turtle')
    def setPen(self) :
        self.myTurtle.pencolor((random.random(), random.random(), random.random()))
        self.myTurtle.pensize(random.randrange(1, 10))
class Rectangle(Shape) :
    def __init__(self, x, y) :
        Shape.__init__(self)
        self.cx, self.cy = x, y
        self.width, self.height = random.randrange(20, 100), random.randrange(20, 100)
    def drawShape(self) :
        sx1, sy1 = self.cx - self.width / 2, self.cy - self.height / 2
        sx2, sy2 = self.cx + self.width / 2, self.cy + self.height / 2
        self.setPen(); self.myTurtle.penup(); self.myTurtle.goto(sx1, sy1); self.myTurtle.pendown()
        for p in [(sx1, sy2), (sx2, sy2), (sx2, sy1), (sx1, sy1)] : self.myTurtle.goto(p)
def screenLeftClick(x, y) :
    rect = Rectangle(x, y)
    rect.drawShape()

turtle.title('거북이로 객체지향 사각형 그리기')
turtle.onscreenclick(screenLeftClick, 1)
turtle.done()`,
            points: ['<code>onscreenclick(함수, 1)</code>: 왼쪽 클릭 시 함수(x, y) 호출', '클릭마다 Rectangle 인스턴스 생성', '실행 후 창을 여러 번 클릭!'],
            notes: '<p>강의자료 31쪽. 슬라이드에 맞게 압축한 전체 코드입니다(원본은 학생 문서). 학생 몇 명을 불러 클릭하게 하면 분위기가 좋습니다.</p><p>(5분)</p>' },
          { layout: 'quiz', title: '확인 문제', q: 'Rectangle 클래스에 setPen() 이 없는데도 self.setPen() 이 동작하는 이유는?', options: ['전역 함수라서', 'turtle 모듈 함수라서', 'Shape 에게 상속받아서', '오류가 난다'], answer: 2,
            explain: '서브 클래스는 슈퍼 클래스의 메서드를 물려받습니다.',
            notes: '<p>(2분)</p>' },
          { layout: 'practice', title: '실습 12-9. 정사각형 클래스', desc: 'Rectangle 을 상속받는 Square 를 만드세요. 부모 생성자를 부른 뒤 height = width 로만 바꿉니다.',
            starter: `import turtle, random
class Rectangle :
    def __init__(self, x, y) :
        self.t = turtle.Turtle('turtle')
        self.t.setheading(90)
        self.cx, self.cy = x, y
        self.width = random.randrange(20, 100)
        self.height = random.randrange(20, 100)
    def drawShape(self) :
        self.t.penup()
        self.t.goto(self.cx - self.width / 2, self.cy - self.height / 2)
        self.t.pendown()
        for d in [self.height, self.width, self.height, self.width] :
            self.t.forward(d)
            self.t.right(90)

# TODO: class Square(Rectangle)
turtle.done()
`,
            solution: `import turtle, random
class Rectangle :
    def __init__(self, x, y) :
        self.t = turtle.Turtle('turtle')
        self.t.setheading(90)
        self.cx, self.cy = x, y
        self.width = random.randrange(20, 100)
        self.height = random.randrange(20, 100)
    def drawShape(self) :
        self.t.penup()
        self.t.goto(self.cx - self.width / 2, self.cy - self.height / 2)
        self.t.pendown()
        for d in [self.height, self.width, self.height, self.width] :
            self.t.forward(d)
            self.t.right(90)

class Square(Rectangle) :
    def __init__(self, x, y) :
        super().__init__(x, y)
        self.height = self.width

for i in range(5) :
    Square(random.randint(-250, 250), random.randint(-200, 200)).drawShape()
turtle.done()
`,
            notes: '<p>슬라이드용으로 Shape 없이 단순화한 버전입니다. 학생 문서의 실습 12-9 는 Code12-08 구조 그대로입니다.</p><p>포인트: 생성자에서 부모 생성자를 먼저 부르고 필요한 것만 바꾼다.</p><p>(5분)</p>' },
          { layout: 'summary', title: '5교시 정리',
            bullets: ['Shape: 공통(거북이 생성 · 펜 설정), drawShape() 는 빈 껍데기', 'Rectangle(Shape): 크기 · drawShape() 오버라이딩', '서브 생성자에서 <code>Shape.__init__(self)</code> (= <code>super().__init__()</code>)', '<code>turtle.onscreenclick(함수, 1)</code> → 클릭마다 새 인스턴스'],
            notes: '<p>다음 시간 예고: print(인스턴스), 인스턴스 + 인스턴스 가 가능할까? → 특별한 메서드.</p><p>(1분)</p>' }
        ]
      },
      // ================= 12-6 =================
      {
        id: 'ch12-6',
        title: '특별한 메서드와 추상 메서드',
        minutes: 45,
        goals: [
          '__del__, __repr__, __add__ 같은 특별한 메서드가 언제 자동 호출되는지 설명할 수 있다',
          '비교 메서드(__lt__, __eq__ 등)로 인스턴스끼리 비교 연산을 할 수 있다',
          '추상 메서드와 NotImplementedError 로 오버라이딩을 강제할 수 있다'
        ],
        flow: [['도입', 3], ['특별한 메서드 개념', 7], ['Code12-09 Line 클래스', 15], ['추상 메서드 (Code12-10)', 12], ['정리 · 퀴즈', 8]],
        content: [
          { type: 'h', text: '클래스의 특별한 메서드' },
          { type: 'p', html: '<code>__init__()</code> 처럼 이름 앞뒤에 밑줄이 두 개씩 붙은 메서드는 <b>특별한 메서드</b>입니다. 우리가 직접 부르지 않아도 <mark>특정한 상황이 되면 파이썬이 자동으로 호출</mark>합니다. 이름 앞뒤의 double underscore 를 줄여 <b>던더(dunder) 메서드</b>, 또는 <b>매직 메서드</b>라고도 부릅니다.' },
          { type: 'table', caption: '대표적인 특별한 메서드', head: ['메서드', '호출되는 때', '설명'], rows: [
            ['<code>__init__()</code>', '<code>Line(100)</code>', '생성자 — 인스턴스를 만들 때'],
            ['<code>__del__()</code>', '<code>del(인스턴스)</code>', '<b>소멸자(destructor)</b> — 생성자와 반대로 인스턴스를 삭제할 때'],
            ['<code>__repr__()</code>', '<code>print(인스턴스)</code>', '인스턴스를 출력할 때 보여 줄 문자열을 돌려준다'],
            ['<code>__add__()</code>', '<code>인스턴스 + 인스턴스</code>', '인스턴스 사이의 덧셈 작업'],
            ['<code>__lt__()</code>, <code>__le__()</code>, <code>__gt__()</code>,<br><code>__ge__()</code>, <code>__eq__()</code>, <code>__ne__()</code>', '<code>&lt;</code>, <code>&lt;=</code>, <code>&gt;</code>, <code>&gt;=</code>, <code>==</code>, <code>!=</code>', '인스턴스 사이의 비교 연산자를 사용할 때 (lt = less than, le = less or equal, gt = greater than, ge = greater or equal, eq = equal, ne = not equal)']
          ] },
          { type: 'figure', html: D_SPECIAL, caption: '내가 쓰는 코드 → 파이썬이 대신 부르는 특별한 메서드' },
          { type: 'code', title: 'Code12-09. 특별한 메서드', code: `## 클래스 선언 부분 ##
class Line :
    length = 0
    def __init__(self, length) :
        self.length = length
        print(self.length, '길이의 선이 생성되었습니다.')

    def __del__(self) :
        print(self.length, '길이의 선이 삭제되었습니다.')

    def __repr__(self) :
        return '선의 길이 : ' + str(self.length)

    def __add__(self, other) :
        return self.length + other.length

    def __lt__(self, other) :
        return self.length < other.length

    def __eq__(self, other) :
        return self.length == other.length

## 메인 코드 부분 ##
myLine1 = Line(100)
myLine2 = Line(200)

print(myLine1)

print('두 선의 길이 합 : ', myLine1 + myLine2)

if myLine1 < myLine2 :
    print('선분 2가 더 기네요.')
elif myLine1 == myLine2 :
    print('두 선분이 같네요.')
else :
    print('모르겠네요.')

del(myLine1)`,
            expect: `100 길이의 선이 생성되었습니다.
200 길이의 선이 생성되었습니다.
선의 길이 : 100
두 선의 길이 합 :  300
선분 2가 더 기네요.
100 길이의 선이 삭제되었습니다.`,
            desc: '<code>27행</code>: print(myLine1) 이 __repr__() 의 반환값을 출력합니다. <code>29행</code>: <code>myLine1 + myLine2</code> 는 <code>myLine1.__add__(myLine2)</code> 로 바뀌어 300 을 돌려줍니다(쉼표로 이어 출력해서 콜론 뒤에 공백이 두 칸). <code>31행</code>: <code>&lt;</code> 는 __lt__(), <code>33행</code>: <code>==</code> 는 __eq__() 를 호출합니다. <code>38행</code>: del 로 인스턴스를 지우면 __del__() 이 호출됩니다.' },
          { type: 'callout', kind: 'info', title: '__repr__ 이 없다면?', html: '__repr__() 을 정의하지 않고 <code>print(myLine1)</code> 을 하면 <code>&lt;__main__.Line object at 0x0000…&gt;</code> 처럼 클래스 이름과 메모리 주소만 나옵니다. __repr__() 을 만들어 두면 디버깅할 때 인스턴스 내용을 한눈에 볼 수 있습니다. (사람이 읽기 좋은 문자열만 따로 정하고 싶으면 <code>__str__()</code> 을 쓰기도 합니다)' },
          { type: 'callout', kind: 'warn', title: '__del__() 은 언제 호출될까?', html: '<code>del(myLine1)</code> 은 인스턴스를 바로 지우는 명령이 아니라 <b>myLine1 이라는 이름을 지우는</b> 명령입니다. 그 인스턴스를 가리키는 변수가 하나도 남지 않을 때 파이썬이 인스턴스를 정리하면서 __del__() 을 부릅니다. 그래서 <code>a = myLine1</code> 처럼 다른 변수가 같은 인스턴스를 가리키고 있으면 del 을 해도 __del__() 이 호출되지 않습니다. 프로그램이 끝날 때 남은 인스턴스(myLine2)의 __del__() 호출 여부는 실행 환경에 따라 다릅니다.' },
          { type: 'code', title: '추가 예제. 나머지 비교 메서드와 __sub__', code: `class Line :
    def __init__(self, length) :
        self.length = length

    def __repr__(self) :
        return 'Line(' + str(self.length) + ')'

    def __sub__(self, other) :          # 빼기 -
        return abs(self.length - other.length)

    def __gt__(self, other) :           # >
        return self.length > other.length

    def __ne__(self, other) :           # !=
        return self.length != other.length

a = Line(300)
b = Line(120)
print(a, b)
print('길이 차이 :', a - b)
print('a > b :', a > b)
print('a != b :', a != b)
print(max([Line(5), Line(50), Line(10)], key=lambda x : x.length))`,
            expect: `Line(300) Line(120)
길이 차이 : 180
a > b : True
a != b : True
Line(50)`,
            desc: '연산자마다 대응하는 특별한 메서드가 있습니다: <code>-</code> → __sub__, <code>*</code> → __mul__, <code>&gt;</code> → __gt__ 등. 리스트 안의 인스턴스를 출력할 때도 __repr__() 이 쓰입니다.' },
          { type: 'code', repl: true, title: '>>> 셸에서 __repr__ 확인하기', code: `class Line :
    def __init__(self, length) :
        self.length = length
    def __repr__(self) :
        return '선의 길이 : ' + str(self.length)

Line(100)
lines = [Line(1), Line(2)]
lines`,
            expect: `>>> class Line :
...     def __init__(self, length) :
...         self.length = length
...     def __repr__(self) :
...         return '선의 길이 : ' + str(self.length)
...
>>> Line(100)
선의 길이 : 100
>>> lines = [Line(1), Line(2)]
>>> lines
[선의 길이 : 1, 선의 길이 : 2]
>>>`,
            desc: '셸에서 값을 입력만 해도 결과가 보이는 것도 __repr__() 덕분입니다.' },

          { type: 'h', text: '추상 메서드' },
          { type: 'p', html: '[프로그램 2]의 Shape 클래스에서 drawShape() 는 내용이 <code>pass</code> 뿐이었습니다. 이렇게 <mark>슈퍼 클래스에는 빈 껍질의 메서드만 만들어 두고, 실제 내용은 서브 클래스에서 오버라이딩해서 채우도록 한 메서드</mark>를 <b>추상 메서드(abstract method)</b>라고 합니다.' },
          { type: 'code', title: 'Code12-10. 추상 메서드', code: `## 클래스 선언 부분 ##
class SuperClass :
    def method(self) :
        pass

class SubClass1 (SuperClass) :
    def method(self) :       # 메서드 오버라이딩
        print('SubClass1에서 method()를 오버라이딩함')

class SubClass2 (SuperClass) :
    pass

## 메인 코드 부분 ##
sub1 = SubClass1()
sub2 = SubClass2()

sub1.method()
sub2.method()`,
            expect: 'SubClass1에서 method()를 오버라이딩함',
            desc: 'SubClass2 는 method() 를 오버라이딩하지 않았으므로 부모의 빈 method() 가 실행되어 <b>아무 일도 일어나지 않습니다</b>. 오류가 없으니 “깜빡 잊은 것” 을 알아차리기 어렵습니다.' },
          { type: 'p', html: '그래서 슈퍼 클래스의 추상 메서드를 <code>pass</code> 대신 <code>raise NotImplementedError()</code> 로 채워 둡니다. <code>raise</code> 는 오류를 일부러 발생시키는 명령이고, <code>NotImplementedError</code> 는 “아직 구현되지 않았음” 을 뜻하는 오류입니다. 이제 서브 클래스가 오버라이딩하지 않으면 실행할 때 오류가 나서 바로 알 수 있습니다.' },
          { type: 'code', title: 'Code12-10 수정: 3~4행을 raise NotImplementedError() 로', expectError: true, code: `## 클래스 선언 부분 ##
class SuperClass :
    def method(self) :
        raise NotImplementedError()

class SubClass1 (SuperClass) :
    def method(self) :       # 메서드 오버라이딩
        print('SubClass1에서 method()를 오버라이딩함')

class SubClass2 (SuperClass) :
    pass

## 메인 코드 부분 ##
sub1 = SubClass1()
sub2 = SubClass2()

sub1.method()
sub2.method()`,
            expect: `SubClass1에서 method()를 오버라이딩함
Traceback (most recent call last):
  File "main.py", line 18, in <module>
    sub2.method()
    ~~~~~~~~~~~^^
  File "main.py", line 4, in method
    raise NotImplementedError()
NotImplementedError`,
            desc: 'sub1 은 정상 동작하고, sub2.method() 에서 <b>NotImplementedError</b> 가 발생합니다. traceback 을 아래에서 위로 읽으면 “4행의 raise 때문에, 18행의 호출에서” 오류가 났음을 알 수 있습니다.' },
          { type: 'figure', html: D_ABSTRACT, caption: 'raise NotImplementedError() — 오버라이딩을 잊은 서브 클래스를 바로 찾아낸다' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: abc 모듈', html: '파이썬 표준 모듈 <code>abc</code>(Abstract Base Class)를 쓰면 더 엄격하게 만들 수 있습니다. 추상 메서드를 오버라이딩하지 않은 클래스는 <b>인스턴스를 만드는 순간</b> 오류가 납니다.<pre><code>from abc import ABC, abstractmethod\n\nclass Shape(ABC) :\n    @abstractmethod\n    def drawShape(self) :\n        pass\n\nclass Rectangle(Shape) :\n    pass\n\nr = Rectangle()   # TypeError: Can\'t instantiate abstract class ...</code></pre>' }
        ],
        practice: [
          { title: '실습 12-10. 돈(Money) 클래스', level: 2,
            desc: '<p>금액(amount)을 가진 Money 클래스를 만드세요. <code>print()</code> 하면 “12,000원” 처럼 천 단위 쉼표가 들어간 문자열이 나오고, 두 Money 를 더하면 <b>새 Money 인스턴스</b>가 나오며, <code>&gt;</code> 로 비교할 수 있어야 합니다.</p><pre><code>12,000원\n3,500원\n합계 : 15,500원\n지갑1이 더 많아요.</code></pre>',
            hint: '__repr__ 에서 <code>format(self.amount, ",") + "원"</code>. __add__ 는 <code>return Money(self.amount + other.amount)</code>. __gt__ 도 만듭니다.',
            starter: `class Money :
    def __init__(self, amount) :
        self.amount = amount

    # TODO: __repr__, __add__, __gt__

wallet1 = Money(12000)
wallet2 = Money(3500)
print(wallet1)
print(wallet2)
# print("합계 :", wallet1 + wallet2)
# if wallet1 > wallet2 :
#     print("지갑1이 더 많아요.")
`,
            solution: `class Money :
    def __init__(self, amount) :
        self.amount = amount

    def __repr__(self) :
        return format(self.amount, ",") + "원"

    def __add__(self, other) :
        return Money(self.amount + other.amount)

    def __gt__(self, other) :
        return self.amount > other.amount

wallet1 = Money(12000)
wallet2 = Money(3500)
print(wallet1)
print(wallet2)
print("합계 :", wallet1 + wallet2)
if wallet1 > wallet2 :
    print("지갑1이 더 많아요.")
`,
            expect: `12,000원
3,500원
합계 : 15,500원
지갑1이 더 많아요.` },
          { title: '실습 12-11. 넓이를 구하는 추상 메서드', level: 2,
            desc: '<p>Figure 슈퍼 클래스의 <code>area()</code> 는 <code>raise NotImplementedError()</code> 로 만드세요. Rect(가로, 세로)와 Circle(반지름)이 area() 를 오버라이딩합니다. 리스트에 담긴 도형들의 넓이를 반복문으로 출력하세요(원주율 3.14).</p><pre><code>사각형의 넓이 : 50\n원의 넓이 : 78.5\n사각형의 넓이 : 9</code></pre>',
            hint: '각 클래스에 <code>name</code> 클래스 변수를 두면 출력이 편합니다. <code>for f in figures : print(f.name + "의 넓이 :", f.area())</code>',
            starter: `class Figure :
    name = "도형"
    def area(self) :
        raise NotImplementedError()

# TODO: class Rect(Figure) - 생성자(w, h), area()
# TODO: class Circle(Figure) - 생성자(r), area()

# figures = [Rect(5, 10), Circle(5), Rect(3, 3)]
# for f in figures :
#     print(f.name + "의 넓이 :", f.area())
`,
            solution: `class Figure :
    name = "도형"
    def area(self) :
        raise NotImplementedError()

class Rect(Figure) :
    name = "사각형"
    def __init__(self, w, h) :
        self.w = w
        self.h = h
    def area(self) :
        return self.w * self.h

class Circle(Figure) :
    name = "원"
    def __init__(self, r) :
        self.r = r
    def area(self) :
        return 3.14 * self.r * self.r

figures = [Rect(5, 10), Circle(5), Rect(3, 3)]
for f in figures :
    print(f.name + "의 넓이 :", f.area())
`,
            expect: `사각형의 넓이 : 50
원의 넓이 : 78.5
사각형의 넓이 : 9` }
        ],
        quiz: [
          { q: '<code>print(인스턴스)</code> 를 실행할 때 자동으로 호출되어 출력할 문자열을 돌려주는 메서드는?', options: ['__init__()', '__del__()', '__repr__()', '__add__()'], answer: 2,
            explain: '__repr__() 이 돌려준 문자열이 출력됩니다.' },
          { q: 'Line 클래스에 <code>__add__(self, other): return self.length + other.length</code> 가 있을 때<pre><code>print(Line(10) + Line(25))</code></pre>의 결과는?', options: ['1025', '35', 'Line(35)', '오류'], answer: 1,
            explain: '<code>+</code> 는 __add__() 를 호출하고, 두 length 의 합 35 를 돌려줍니다.' },
          { q: '인스턴스끼리 <code>&lt;</code> 연산자로 비교할 때 호출되는 메서드는?', options: ['__lt__()', '__le__()', '__gt__()', '__eq__()'], answer: 0,
            explain: 'lt = less than(보다 작다). &lt;= 는 __le__, &gt; 는 __gt__, == 는 __eq__ 입니다.' },
          { q: '슈퍼 클래스의 추상 메서드를 <code>raise NotImplementedError()</code> 로 만들었다. 오버라이딩하지 않은 서브 클래스의 인스턴스로 그 메서드를 부르면?', options: ['아무 일도 일어나지 않는다', 'NotImplementedError 오류가 발생한다', '슈퍼 클래스의 pass 가 실행된다', '자동으로 오버라이딩된다'], answer: 1,
            explain: '부모의 메서드가 실행되면서 raise 로 오류가 발생합니다. 오버라이딩을 잊은 것을 바로 알 수 있습니다.' }
        ],
        slides: [
          { layout: 'title', title: '특별한 메서드와 추상 메서드', subtitle: '__repr__ · __add__ · __lt__ · __del__ · NotImplementedError', badge: '12장 6교시',
            notes: '<p>도입 발문: “<code>3 + 5</code> 와 <code>\'a\' + \'b\'</code> 는 둘 다 + 인데 결과가 다르죠? 파이썬은 어떻게 구분할까요?” → 클래스마다 __add__() 가 다르게 정의되어 있기 때문.</p><p>(2분)</p>' },
          { layout: 'table', title: '클래스의 특별한 메서드', head: ['메서드', '호출되는 때'],
            rows: [['<code>__del__()</code>', '인스턴스 삭제 (소멸자)'], ['<code>__repr__()</code>', 'print(인스턴스)'], ['<code>__add__()</code>', '인스턴스 + 인스턴스'], ['<code>__lt__ __le__ __gt__ __ge__ __eq__ __ne__</code>', '&lt;  &lt;=  &gt;  &gt;=  ==  !=']],
            notes: '<p>강의자료 33쪽. 비교 메서드 이름은 영어 약자로 외우게 합니다: less than, less or equal, greater than, greater or equal, equal, not equal.</p><p>(4분)</p>' },
          { layout: 'diagram', title: '파이썬이 대신 부르는 메서드', html: D_SPECIAL, caption: '연산자 · print · del 이 특별한 메서드 호출로 바뀐다',
            notes: '<p>📘 보충. 연산자는 사실 메서드 호출이라는 점을 강조합니다. <code>(3).__add__(5)</code> 를 셸에서 실행해 8 이 나오는 것을 보여 주면 재미있어합니다.</p><p>(3분)</p>' },
          { layout: 'code', title: 'Code12-09. 특별한 메서드', code: `class Line :
    length = 0
    def __init__(self, length) :
        self.length = length
        print(self.length, '길이의 선이 생성되었습니다.')
    def __del__(self) :
        print(self.length, '길이의 선이 삭제되었습니다.')
    def __repr__(self) :
        return '선의 길이 : ' + str(self.length)
    def __add__(self, other) :
        return self.length + other.length
    def __lt__(self, other) :
        return self.length < other.length
    def __eq__(self, other) :
        return self.length == other.length

myLine1, myLine2 = Line(100), Line(200)
print(myLine1)
print('두 선의 길이 합 : ', myLine1 + myLine2)
if myLine1 < myLine2 :
    print('선분 2가 더 기네요.')
del(myLine1)`,
            points: ['print → __repr__', '+ → __add__ (300)', '&lt; → __lt__, == → __eq__', 'del → __del__ (소멸자)'],
            notes: '<p>강의자료 33~35쪽을 슬라이드용으로 압축(elif/else 생략). 실행 전에 출력 순서를 예측하게 하세요.</p><p>__repr__ 을 주석 처리하고 다시 실행해 “&lt;__main__.Line object at …&gt;” 를 보여 주면 필요성이 드러납니다.</p><p>(7분)</p>' },
          { layout: 'code', title: 'Code12-10. 추상 메서드', code: `class SuperClass :
    def method(self) :
        pass

class SubClass1 (SuperClass) :
    def method(self) :       # 메서드 오버라이딩
        print('SubClass1에서 method()를 오버라이딩함')

class SubClass2 (SuperClass) :
    pass

sub1 = SubClass1()
sub2 = SubClass2()
sub1.method()
sub2.method()`,
            points: ['추상 메서드: 부모는 빈 껍질, 자식이 채운다', 'SubClass2 는 오버라이딩 안 함 → 아무 일도 없음', '실수를 알아차리기 어렵다!'],
            notes: '<p>강의자료 36쪽. 출력은 한 줄뿐입니다. “sub2.method() 는 왜 아무것도 안 할까?” 를 묻습니다.</p><p>(3분)</p>' },
          { layout: 'code', title: 'raise NotImplementedError()', expectError: true, code: `class SuperClass :
    def method(self) :
        raise NotImplementedError()

class SubClass1 (SuperClass) :
    def method(self) :
        print('SubClass1에서 method()를 오버라이딩함')

class SubClass2 (SuperClass) :
    pass

sub1 = SubClass1()
sub2 = SubClass2()
sub1.method()
sub2.method()`,
            points: ['3~4행 수정: pass → raise NotImplementedError()', 'raise = 오류를 일부러 발생', 'sub2.method() 에서 NotImplementedError', '→ 오버라이딩을 잊은 곳을 바로 찾는다'],
            notes: '<p>강의자료 37쪽. 일부러 오류를 내는 코드입니다. traceback 을 아래에서 위로 읽는 법을 다시 연습시킵니다.</p><p>📘 abc 모듈의 @abstractmethod 는 관심 있는 학생에게만 소개(학생 문서).</p><p>(5분)</p>' },
          { layout: 'diagram', title: '추상 메서드의 역할', html: D_ABSTRACT, caption: 'pass → 조용히 넘어감 / raise → 바로 오류로 알려 줌',
            notes: '<p>[프로그램 2]의 Shape.drawShape() 도 raise NotImplementedError() 로 바꿀 수 있다는 것과 연결합니다.</p><p>(2분)</p>' },
          { layout: 'quiz', title: '확인 문제', q: '__add__(self, other) 가 self.length + other.length 를 돌려줄 때<br>print(Line(10) + Line(25)) 의 결과는?', options: ['1025', '35', 'Line(35)', '오류'], answer: 1,
            explain: '+ 는 __add__() 를 호출하고 35 를 돌려줍니다.',
            notes: '<p>“__add__ 가 없으면?” 도 물어보세요 → TypeError: unsupported operand type(s) for +.</p><p>(2분)</p>' },
          { layout: 'practice', title: '실습 12-10. 돈(Money) 클래스', desc: 'print 하면 “12,000원”, + 하면 새 Money, &gt; 로 비교 가능한 Money 클래스를 만드세요.',
            starter: `class Money :
    def __init__(self, amount) :
        self.amount = amount
    # TODO: __repr__, __add__, __gt__

print(Money(12000))
`,
            solution: `class Money :
    def __init__(self, amount) :
        self.amount = amount
    def __repr__(self) :
        return format(self.amount, ",") + "원"
    def __add__(self, other) :
        return Money(self.amount + other.amount)
    def __gt__(self, other) :
        return self.amount > other.amount

w1, w2 = Money(12000), Money(3500)
print(w1, w2, w1 + w2, w1 > w2)
`,
            notes: '<p>__add__ 가 숫자가 아니라 <b>새 Money</b> 를 돌려주게 하는 것이 포인트입니다. 그래야 합계도 “15,500원” 으로 출력됩니다.</p><p>(6분)</p>' },
          { layout: 'summary', title: '6교시 정리',
            bullets: ['특별한 메서드: 이름이 __xxx__, 상황에 따라 자동 호출', '__repr__ (print), __add__ (+), __lt__ · __eq__ … (비교), __del__ (삭제)', '추상 메서드: 부모는 빈 껍질, 자식이 오버라이딩', '<code>raise NotImplementedError()</code> 로 오버라이딩 강제'],
            notes: '<p>다음 시간 예고: 자동차 세 대가 동시에 달리게 하려면? → 멀티 스레드.</p><p>(1분)</p>' }
        ]
      },
      // ================= 12-7 =================
      {
        id: 'ch12-7',
        title: '멀티 스레드와 멀티 프로세싱',
        minutes: 40,
        goals: [
          '멀티 스레드의 개념과 일반 프로그램의 차이를 설명할 수 있다',
          'threading.Thread 로 메서드를 스레드로 실행하는 코드를 읽고 쓸 수 있다',
          '멀티 프로세싱의 개념과 멀티 스레드와의 차이를 설명할 수 있다'
        ],
        flow: [['도입', 3], ['멀티 스레드 개념', 7], ['Code12-11 순차 실행', 7], ['Code12-12 스레드 (+ 브라우저 대안)', 12], ['멀티 프로세싱 (Code12-13)', 6], ['정리 · 퀴즈', 5]],
        content: [
          { type: 'h', text: '멀티 스레드' },
          { type: 'p', html: '<b>스레드(thread)</b>는 프로그램 안에서 실행되는 작업의 흐름 하나를 말합니다. <b>멀티 스레드(multi-thread)</b>는 <mark>프로그램 하나에서 여러 작업을 동시에 처리할 수 있도록 제공하는 기능</mark>입니다.' },
          { type: 'p', html: '지금까지의 프로그램은 작업 1이 끝나야 작업 2를, 작업 2가 끝나야 작업 3을 실행했습니다. 멀티 스레드를 사용하면 작업 1 · 2 · 3 이 겹쳐서 동시에 진행됩니다. 음악을 들으면서 파일을 내려받고 채팅도 하는 프로그램을 떠올려 보세요.' },
          { type: 'figure', html: D_THREAD, caption: '그림 12-10 일반 프로그램과 스레드의 차이' },
          { type: 'callout', kind: 'warn', title: '⚠ 이 웹 강좌에서는 스레드를 실행할 수 없어요', html: '이 강좌의 파이썬은 <b>브라우저 안(Pyodide)</b>에서 동작하는데, 브라우저 속 파이썬은 진짜 스레드를 만들 수 없습니다. <code>threading.Thread(…).start()</code> 를 실행하면 <code>RuntimeError: can\'t start new thread</code> 오류가 납니다. 멀티 프로세싱(<code>multiprocessing</code>)도 마찬가지입니다.<br>그래서 이 교시의 스레드 · 프로세스 코드는 <b>▶ 실행 버튼 없이</b> 보여 주고, 대신 브라우저에서도 실행되는 <b>비슷한 동작의 예제</b>를 함께 제공합니다. 진짜 동시 실행은 집 PC 에 파이썬(IDLE)을 설치해서 확인해 보세요.' },

          { type: 'h', text: '자동차 세 대가 경주하는 코드 (스레드 없이)' },
          { type: 'p', html: '먼저 스레드를 쓰지 않은 코드를 봅시다. RacingCar 클래스의 runCar() 메서드는 “~~ 달립니다.” 를 3번 출력하면서 한 번 출력할 때마다 0.1초씩 멈춥니다.' },
          { type: 'code', title: 'Code12-11. 자동차 세 대의 경주 (순차 실행)', code: `import time

## 클래스 선언 부분 ##
class RacingCar :
    carName = ''
    def __init__(self, name) :
        self.carName = name

    def runCar(self) :
        for _ in range(0, 3) :
            carStr = self.carName + '~~ 달립니다.\\n'
            print(carStr, end = '')
            time.sleep(0.1)        # 0.1초 멈춤

## 메인 코드 부분 ##
car1 = RacingCar('@자동차1')
car2 = RacingCar('#자동차2')
car3 = RacingCar('$자동차3')

car1.runCar()
car2.runCar()
car3.runCar()`,
            expect: `@자동차1~~ 달립니다.
@자동차1~~ 달립니다.
@자동차1~~ 달립니다.
#자동차2~~ 달립니다.
#자동차2~~ 달립니다.
#자동차2~~ 달립니다.
$자동차3~~ 달립니다.
$자동차3~~ 달립니다.
$자동차3~~ 달립니다.`,
            desc: '자동차1이 세 번 다 달린 뒤에야 자동차2가 출발합니다. 경주라기보다는 한 대씩 차례로 달리는 모습이죠. <code>10행</code>의 <code>_</code> 는 반복 변수를 쓰지 않을 때 관례적으로 쓰는 이름입니다. <code>time.sleep(초)</code> 는 지정한 시간만큼 프로그램을 잠시 멈춥니다.' },

          { type: 'h', text: '자동차 세 대를 동시에 출발 (멀티 스레드)' },
          { type: 'p', html: '<code>threading</code> 모듈의 <code>Thread</code> 클래스로 스레드를 만듭니다. <code>target</code> 에 스레드가 실행할 함수(메서드)를 <b>괄호 없이</b> 넘기고, <code>start()</code> 로 출발시킵니다.' },
          { type: 'code', title: 'Code12-12. 멀티 스레드 (집 PC 의 파이썬에서 실행)', run: false, code: `import threading
import time

## 클래스 선언 부분 ##
class RacingCar :
    carName = ''
    def __init__(self, name) :
        self.carName = name

    def runCar(self) :
        for _ in range(0, 3) :
            carStr = self.carName + '~~ 달립니다.\\n'
            print(carStr, end = '')
            time.sleep(0.1)        # 0.1초 멈춤

## 메인 코드 부분 ##
car1 = RacingCar('@자동차1')
car2 = RacingCar('#자동차2')
car3 = RacingCar('$자동차3')

th1 = threading.Thread(target = car1.runCar)
th2 = threading.Thread(target = car2.runCar)
th3 = threading.Thread(target = car3.runCar)

th1.start()
th2.start()
th3.start()`,
            desc: '강의자료에서 “Code12-11 과 동일” 로 줄인 클래스 부분을 채운 완성 코드입니다. 집 PC 에서 실행하면 예를 들어 다음처럼 세 자동차의 출력이 <b>섞여서</b> 나옵니다(실행할 때마다 순서가 달라질 수 있음).<pre><code>@자동차1~~ 달립니다.\n#자동차2~~ 달립니다.\n@자동차1~~ 달립니다.\n$자동차3~~ 달립니다.\n#자동차2~~ 달립니다.\n$자동차3~~ 달립니다.\n@자동차1~~ 달립니다.\n#자동차2~~ 달립니다.\n$자동차3~~ 달립니다.</code></pre>' },
          { type: 'callout', kind: 'tip', title: 'target 에는 괄호를 붙이지 않는다', html: '<code>target = car1.runCar()</code> 처럼 괄호를 붙이면 스레드를 만들기도 전에 그 자리에서 runCar() 가 실행되어 버립니다. 스레드에게 “나중에 이 메서드를 실행해 줘” 라고 <b>메서드 자체</b>를 넘기는 것이므로 괄호 없이 씁니다. 스레드가 모두 끝날 때까지 기다리려면 <code>th1.join()</code> 을 씁니다.' },
          { type: 'p', html: '브라우저에서는 스레드 대신 <b>한 걸음씩 번갈아 실행</b>하는 방법으로 비슷한 모습을 만들어 볼 수 있습니다. 반복문 한 바퀴에서 세 자동차가 한 걸음(한 줄 출력)씩 달리게 하는 것입니다.' },
          { type: 'figure', html: D_TURN, caption: '스레드 없이 번갈아 실행하기 — 순서는 항상 같다' },
          { type: 'code', title: '추가 예제. 브라우저에서 실행하는 “번갈아 달리기”', code: `import time

class RacingCar :
    carName = ''
    def __init__(self, name) :
        self.carName = name

    def runStep(self) :            # 한 걸음만 달린다
        print(self.carName + '~~ 달립니다.')

car1 = RacingCar('@자동차1')
car2 = RacingCar('#자동차2')
car3 = RacingCar('$자동차3')

for _ in range(0, 3) :
    for car in [car1, car2, car3] :
        car.runStep()
    time.sleep(0.1)`,
            expect: `@자동차1~~ 달립니다.
#자동차2~~ 달립니다.
$자동차3~~ 달립니다.
@자동차1~~ 달립니다.
#자동차2~~ 달립니다.
$자동차3~~ 달립니다.
@자동차1~~ 달립니다.
#자동차2~~ 달립니다.
$자동차3~~ 달립니다.`,
            desc: '겉모습은 멀티 스레드와 비슷하지만, 실제로는 하나의 흐름이 순서대로 실행하는 것이라 출력 순서가 항상 같습니다. 게임 프로그램의 “한 프레임마다 모든 캐릭터를 조금씩 움직이기” 가 바로 이 방식입니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 스레드와 GIL', html: '일반 파이썬(CPython)에는 <b>GIL</b>(Global Interpreter Lock)이라는 장치가 있어서, 여러 스레드가 있어도 파이썬 코드는 한 번에 하나의 스레드만 실행됩니다(아주 빠르게 번갈아 가며). 그래서 멀티 스레드는 <b>기다리는 시간이 많은 작업</b>(time.sleep, 파일 · 네트워크 입출력)에는 효과가 크지만, 계산만 많이 하는 작업은 빨라지지 않습니다. 이럴 때 다음에 볼 멀티 프로세싱을 씁니다. (최신 파이썬에는 GIL 을 끈 실험용 버전도 있습니다)' },

          { type: 'h', text: '멀티 프로세싱' },
          { type: 'p', html: '<b>멀티 프로세싱(multi-processing)</b>은 <mark>프로그램(프로세스)을 여러 개 띄워 동시에 CPU 를 여러 개 사용</mark>하는 방법입니다. 요즘 컴퓨터는 CPU 안에 코어가 여러 개 있어서 계산을 진짜로 동시에 나눠 할 수 있습니다.' },
          { type: 'figure', html: D_PROC, caption: '멀티 스레드와 멀티 프로세싱의 차이' },
          { type: 'code', title: 'Code12-13. 멀티 프로세싱 (명령 프롬프트에서 실행)', run: false, code: `import multiprocessing
import time

## 클래스 선언 부분 ##
class RacingCar :
    carName = ''
    def __init__(self, name) :
        self.carName = name

    def runCar(self) :
        for _ in range(0, 3) :
            carStr = self.carName + '~~ 달립니다.\\n'
            print(carStr, end = '')
            time.sleep(0.1)        # 0.1초 멈춤

## 메인 코드 부분 ##
if __name__ == "__main__" :
    car1 = RacingCar('@자동차1')
    car2 = RacingCar('#자동차2')
    car3 = RacingCar('$자동차3')

    mp1 = multiprocessing.Process(target = car1.runCar)
    mp2 = multiprocessing.Process(target = car2.runCar)
    mp3 = multiprocessing.Process(target = car3.runCar)

    mp1.start()
    mp2.start()
    mp3.start()

    mp1.join()
    mp2.join()
    mp3.join()`,
            desc: '사용법은 스레드와 거의 같습니다: <code>Process(target = …)</code> → <code>start()</code> → <code>join()</code>(끝날 때까지 기다림). 새 프로세스가 이 파일을 다시 불러오기 때문에 메인 코드를 반드시 <code>if __name__ == "__main__" :</code> 안에 넣어야 합니다. IDLE 에서는 자식 프로세스의 출력이 보이지 않을 수 있어서 강의자료는 <b>명령 프롬프트</b>에서 <code>python Code12-13.py</code> 로 실행합니다. 이때도 출력 순서는 실행할 때마다 달라집니다.' },
          { type: 'table', caption: '멀티 스레드와 멀티 프로세싱 비교', head: ['', '멀티 스레드', '멀티 프로세싱'], rows: [
            ['모듈 · 클래스', '<code>threading.Thread</code>', '<code>multiprocessing.Process</code>'],
            ['단위', '프로그램 하나 안의 여러 흐름', '프로그램(프로세스) 여러 개'],
            ['메모리', '변수를 함께 쓴다(공유)', '각자 따로 가진다'],
            ['잘 맞는 일', '기다림이 많은 작업(입출력)', '계산이 많은 작업(CPU 여러 개 활용)'],
            ['이 웹 강좌', '실행 불가', '실행 불가']
          ] },
          { type: 'callout', kind: 'more', title: '📘 집 PC 에서 실행해 보기', html: '<a href="https://www.python.org" target="_blank">python.org</a> 에서 파이썬을 설치하면 IDLE 이 함께 설치됩니다. IDLE 에서 [File] → [New File] 로 Code12-12 를 붙여 넣고 F5 로 실행하면 스레드 결과를 볼 수 있습니다. Code12-13 은 파일로 저장한 뒤 명령 프롬프트(cmd)에서 <code>python 파일이름.py</code> 로 실행하세요.' }
        ],
        practice: [
          { title: 'SELF STUDY 12-3. 스레드로 합계 구하기', level: 3,
            desc: '<p>Code12-12 를 활용해서 1~1000, 1~100000, 1~10000000 각각의 합을 계산하는 스레드 프로그램을 작성하세요.</p><pre><code>1+2+3+.....+ 1000 = 500500\n1+2+3+.....+ 100000 = 5000050000\n1+2+3+.....+ 10000000 = 50000005000000</code></pre><p>※ 브라우저에서는 스레드를 시작할 수 없으므로, 정답 코드는 <code>start()</code> 가 실패하면(<code>RuntimeError</code>) 같은 메서드를 직접 실행하도록 만들었습니다. 집 PC 에서는 진짜 스레드로 실행됩니다. 마지막 합계는 계산에 몇 초 걸릴 수 있습니다.</p>',
            hint: 'SumCalc 클래스의 생성자에서 끝 수(num)를 받고, calcSum() 메서드에서 for 문으로 합을 구해 출력합니다. <code>threading.Thread(target = 인스턴스.calcSum)</code>.',
            starter: `import threading

## 클래스 선언 부분 ##
class SumCalc :
    def __init__(self, num) :
        self.num = num

    def calcSum(self) :
        # TODO: 1부터 self.num 까지의 합을 구해 출력
        pass

## 메인 코드 부분 ##
calc1 = SumCalc(1000)
calc2 = SumCalc(100000)
calc3 = SumCalc(10000000)

# TODO: 스레드 3개를 만들어 start()
`,
            solution: `import threading

## 클래스 선언 부분 ##
class SumCalc :
    def __init__(self, num) :
        self.num = num

    def calcSum(self) :
        hap = 0
        for i in range(1, self.num + 1) :
            hap += i
        print("1+2+3+.....+ %d = %d" % (self.num, hap))

## 메인 코드 부분 ##
calc1 = SumCalc(1000)
calc2 = SumCalc(100000)
calc3 = SumCalc(10000000)

th1 = threading.Thread(target = calc1.calcSum)
th2 = threading.Thread(target = calc2.calcSum)
th3 = threading.Thread(target = calc3.calcSum)

for th in [th1, th2, th3] :
    try :
        th.start()
    except RuntimeError :       # 브라우저: 스레드를 시작할 수 없으면 직접 실행
        th.run()

for th in [th1, th2, th3] :     # 스레드가 모두 끝날 때까지 기다리기
    if th.is_alive() :
        th.join()
`,
            expect: `1+2+3+.....+ 1000 = 500500
1+2+3+.....+ 100000 = 5000050000
1+2+3+.....+ 10000000 = 50000005000000` },
          { title: '실습 12-12. 번갈아 달리는 자동차 경주', level: 2,
            desc: '<p>브라우저에서 실행되는 “번갈아 달리기” 예제를 고쳐, 각 자동차가 달린 거리(distance)를 기억하게 하세요. 한 걸음마다 1~10 사이 무작위 거리만큼 전진하고, 5바퀴 뒤 가장 멀리 간 자동차를 출력합니다.</p>',
            hint: '생성자에서 <code>self.distance = 0</code>, runStep() 에서 <code>self.distance += random.randint(1, 10)</code>. 우승자는 <code>max(cars, key=lambda c : c.distance)</code>.',
            starter: `import random

class RacingCar :
    def __init__(self, name) :
        self.carName = name
        # TODO: distance 필드

    def runStep(self) :
        # TODO: 무작위 거리만큼 전진하고 현재 거리 출력
        pass

cars = [RacingCar('@자동차1'), RacingCar('#자동차2'), RacingCar('$자동차3')]
for step in range(1, 6) :
    print('--- %d바퀴 ---' % step)
    for car in cars :
        car.runStep()
# TODO: 우승 자동차 출력
`,
            solution: `import random

class RacingCar :
    def __init__(self, name) :
        self.carName = name
        self.distance = 0

    def runStep(self) :
        self.distance += random.randint(1, 10)
        print('%s~~ 달립니다. (%dm)' % (self.carName, self.distance))

cars = [RacingCar('@자동차1'), RacingCar('#자동차2'), RacingCar('$자동차3')]
for step in range(1, 6) :
    print('--- %d바퀴 ---' % step)
    for car in cars :
        car.runStep()
winner = max(cars, key=lambda c : c.distance)
print('우승 :', winner.carName)
`,
            nondeterministic: true }
        ],
        quiz: [
          { q: '멀티 스레드에 대한 설명으로 옳은 것은?', options: ['프로그램을 여러 개 동시에 실행하는 것', '프로그램 하나에서 여러 작업을 동시에 처리하는 기능', '클래스를 여러 개 상속받는 것', '메서드를 여러 번 오버라이딩하는 것'], answer: 1,
            explain: '멀티 스레드는 프로그램 하나 안에서 여러 작업 흐름을 동시에 진행하는 기능입니다. 프로그램 여러 개는 멀티 프로세싱입니다.' },
          { q: '<code>car1</code> 의 runCar() 메서드를 스레드로 실행하는 올바른 코드는?', options: ['threading.Thread(target = car1.runCar())', 'threading.Thread(target = car1.runCar)', 'threading.Thread(car1)', 'threading.runCar(car1)'], answer: 1,
            explain: 'target 에는 괄호 없이 메서드 자체를 넘깁니다. 괄호를 붙이면 그 자리에서 바로 실행되어 버립니다.' },
          { q: 'Code12-11(스레드 없음)에서 car1.runCar(), car2.runCar() 순서로 호출하면 출력은?', options: ['자동차1과 자동차2가 섞여서 나온다', '자동차1이 3번 다 나온 뒤 자동차2가 나온다', '자동차2가 먼저 나온다', '아무것도 출력되지 않는다'], answer: 1,
            explain: '일반 프로그램은 앞 작업(car1.runCar)이 끝나야 다음 작업을 시작합니다.' },
          { q: '멀티 프로세싱 코드에서 메인 코드를 <code>if __name__ == "__main__" :</code> 안에 넣는 이유는?', options: ['코드를 짧게 하려고', '새 프로세스가 파일을 다시 불러올 때 메인 코드가 또 실행되지 않게 하려고', '스레드를 쓰기 위해', '클래스를 상속하기 위해'], answer: 1,
            explain: '새 프로세스는 파일을 모듈로 다시 불러옵니다. 이 조건이 없으면 프로세스를 만드는 코드가 반복 실행되어 문제가 생깁니다.' }
        ],
        slides: [
          { layout: 'title', title: '멀티 스레드와 멀티 프로세싱', subtitle: '여러 작업을 동시에', badge: '12장 7교시',
            notes: '<p>이 교시의 코드는 브라우저(Pyodide)에서 스레드 · 프로세스를 만들 수 없어 실행되지 않습니다. 교사 PC 에 파이썬(IDLE)이 설치되어 있다면 Code12-12 · 12-13 을 거기서 시연하세요.</p><p>도입 발문: “스마트폰으로 음악을 들으면서 카톡을 할 수 있는 이유는?”</p><p>(2분)</p>' },
          { layout: 'diagram', title: '멀티 스레드의 개념', html: D_THREAD, caption: '그림 12-10 — 순차 실행 vs 겹쳐서 동시에',
            notes: '<p>강의자료 38쪽. 스레드 = 작업의 흐름 하나. 요리 비유: 혼자 밥 → 국 → 반찬 순서로 하기 vs 세 사람이 동시에 하기.</p><p>(4분)</p>' },
          { layout: 'code', title: 'Code12-11. 자동차 세 대의 경주', code: `import time

class RacingCar :
    carName = ''
    def __init__(self, name) :
        self.carName = name

    def runCar(self) :
        for _ in range(0, 3) :
            carStr = self.carName + '~~ 달립니다.\\n'
            print(carStr, end = '')
            time.sleep(0.1)        # 0.1초 멈춤

car1 = RacingCar('@자동차1')
car2 = RacingCar('#자동차2')
car3 = RacingCar('$자동차3')

car1.runCar()
car2.runCar()
car3.runCar()`,
            points: ['runCar(): 3번 출력, 0.1초씩 멈춤', '자동차1이 다 달려야 자동차2 출발', '→ 동시에 달리게 하고 싶다!'],
            notes: '<p>강의자료 39~40쪽. 브라우저에서도 실행됩니다. 출력이 한 대씩 나오는 것을 확인합니다.</p><p>(4분)</p>' },
          { layout: 'code', title: 'Code12-12. 자동차 세 대를 동시에 출발', run: false, code: `import threading
import time

class RacingCar :
    # Code12-11 과 동일
    ...

car1 = RacingCar('@자동차1')
car2 = RacingCar('#자동차2')
car3 = RacingCar('$자동차3')

th1 = threading.Thread(target = car1.runCar)
th2 = threading.Thread(target = car2.runCar)
th3 = threading.Thread(target = car3.runCar)

th1.start()
th2.start()
th3.start()`,
            points: ['<code>threading.Thread(target = 메서드)</code>', 'target 에는 괄호 없이!', '<code>start()</code> 로 출발 → 출력이 섞인다', '⚠ 브라우저에서는 실행 불가 (RuntimeError)'],
            notes: '<p>강의자료 41쪽. 실행 버튼이 없는 슬라이드입니다. 교사 PC 의 IDLE 에서 시연하거나 강의자료의 출력 화면(순서가 섞인 결과)을 보여 주세요.</p><p>이 웹 강좌가 브라우저 속 파이썬(Pyodide)이라 스레드를 만들 수 없다는 점을 짧게 설명합니다.</p><p>(5분)</p>' },
          { layout: 'code', title: '브라우저에서: 번갈아 달리기', code: `import time

class RacingCar :
    carName = ''
    def __init__(self, name) :
        self.carName = name

    def runStep(self) :            # 한 걸음만 달린다
        print(self.carName + '~~ 달립니다.')

car1 = RacingCar('@자동차1')
car2 = RacingCar('#자동차2')
car3 = RacingCar('$자동차3')

for _ in range(0, 3) :
    for car in [car1, car2, car3] :
        car.runStep()
    time.sleep(0.1)`,
            points: ['한 바퀴마다 세 대가 한 걸음씩', '스레드와 비슷한 모양의 출력', '순서는 항상 같다 (진짜 동시 실행은 아님)'],
            notes: '<p>📘 보충(브라우저 대안). 게임의 “프레임마다 모든 캐릭터를 조금씩 움직이기” 와 같은 방식이라고 연결해 주면 좋습니다.</p><p>(3분)</p>' },
          { layout: 'diagram', title: '멀티 프로세싱', html: D_PROC, caption: '동시에 CPU 를 여러 개 사용 — 프로세스마다 메모리가 따로',
            notes: '<p>강의자료 42쪽. 스레드 = 한 집 안의 가족(냉장고 공유), 프로세스 = 옆집들(각자 냉장고).</p><p>(3분)</p>' },
          { layout: 'code', title: 'Code12-13. 멀티 프로세싱', run: false, code: `import multiprocessing
import time

class RacingCar :
    # Code12-11 과 동일
    ...

if __name__ == "__main__" :
    car1 = RacingCar('@자동차1')
    car2 = RacingCar('#자동차2')
    car3 = RacingCar('$자동차3')

    mp1 = multiprocessing.Process(target = car1.runCar)
    mp2 = multiprocessing.Process(target = car2.runCar)
    mp3 = multiprocessing.Process(target = car3.runCar)

    mp1.start(); mp2.start(); mp3.start()
    mp1.join();  mp2.join();  mp3.join()`,
            points: ['<code>multiprocessing.Process(target = …)</code>', '<code>join()</code>: 끝날 때까지 기다림', '<code>if __name__ == "__main__" :</code> 필수', '명령 프롬프트에서 실행 (브라우저 불가)'],
            notes: '<p>강의자료 42~43쪽. 원본은 start() · join() 을 한 줄씩 썼습니다. IDLE 에서는 자식 프로세스 출력이 안 보일 수 있어 명령 프롬프트에서 실행한다는 점을 알려 주세요.</p><p>(4분)</p>' },
          { layout: 'quiz', title: '확인 문제', q: 'car1 의 runCar() 를 스레드로 실행하는 올바른 코드는?', options: ['Thread(target = car1.runCar())', 'Thread(target = car1.runCar)', 'Thread(car1)', 'threading.runCar(car1)'], answer: 1,
            explain: 'target 에는 괄호 없이 메서드 자체를 넘깁니다.',
            notes: '<p>1번을 고른 학생에게: 괄호를 붙이면 “지금 실행한 결과(None)” 를 넘기게 된다고 설명합니다.</p><p>(2분)</p>' },
          { layout: 'practice', title: 'SELF STUDY 12-3. 스레드로 합계 구하기', desc: '1~1000, 1~100000, 1~10000000 의 합을 각각 스레드로 계산하세요. (브라우저에서는 start() 실패 시 run() 으로 직접 실행)',
            starter: `import threading

class SumCalc :
    def __init__(self, num) :
        self.num = num
    def calcSum(self) :
        # TODO: 1~num 의 합 출력
        pass

# TODO: 스레드 3개
`,
            solution: `import threading

class SumCalc :
    def __init__(self, num) :
        self.num = num
    def calcSum(self) :
        hap = 0
        for i in range(1, self.num + 1) :
            hap += i
        print("1+2+3+.....+ %d = %d" % (self.num, hap))

threads = [threading.Thread(target = SumCalc(n).calcSum) for n in [1000, 100000, 10000000]]
for th in threads :
    try :
        th.start()
    except RuntimeError :       # 브라우저에서는 직접 실행
        th.run()
for th in threads :
    if th.is_alive() :
        th.join()
`,
            notes: '<p>강의자료 43쪽. 마지막 합계는 브라우저에서 수 초 걸립니다. 집 PC 에서 스레드로 실행하면 작은 수의 합이 먼저 출력됩니다.</p><p>(4분)</p>' },
          { layout: 'summary', title: '12장 정리',
            bullets: ['클래스(설계도) → 인스턴스(실물), 필드 · 메서드 · self', '생성자 __init__, 인스턴스 변수 vs 클래스 변수', '상속 · 오버라이딩 · super(), 특별한 메서드 · 추상 메서드', '멀티 스레드(threading) · 멀티 프로세싱(multiprocessing)'],
            notes: '<p>12장 전체 정리입니다. 1교시 “붕어빵 틀” 비유로 돌아가 클래스 → 인스턴스 → 상속을 한 번에 복습하세요.</p><p>(3분)</p>' }
        ]
      }
    ]
  };
})());
