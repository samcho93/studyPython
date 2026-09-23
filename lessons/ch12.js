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
    const c = o.c || 'var(--muted)', ang = Math.atan2(y2 - y1, x2 - x1), Ln = o.hollow ? 20 : 13, W = o.hollow ? 11 : 6.5;
    const bx = x2 - Ln * Math.cos(ang), by = y2 - Ln * Math.sin(ang), px = -Math.sin(ang) * W, py = Math.cos(ang) * W;
    const f = (n) => n.toFixed(1);
    return `<line x1="${x1}" y1="${y1}" x2="${f(bx)}" y2="${f(by)}" stroke="${c}" stroke-width="${o.sw || 3}"${o.d ? ' stroke-dasharray="10 7"' : ''}/>` +
      `<polygon points="${x2},${y2} ${f(bx + px)},${f(by + py)} ${f(bx - px)},${f(by - py)}" fill="${o.hollow ? 'var(--card)' : c}" stroke="${c}" stroke-width="2" stroke-linejoin="round"/>`;
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
    summary: '클래스와 인스턴스, 필드와 메서드, 생성자(__init__), 인스턴스 변수와 클래스 변수, 상속과 메서드 오버라이딩, 특별한 메서드와 추상 클래스, 멀티 스레드를 배웁니다. 나아가 @property · @classmethod · dataclass · 덕 타이핑 · 컴포지션 · 사용자 정의 예외 · JSON 저장까지 실무에서 쓰는 수준으로 넓히고, 자판기 · 은행 계좌 · 도서 대출 · RPG 전투 · 도형 팔레트 · 분수 클래스 여섯 개의 미니 프로젝트를 만듭니다.',
    goals: [
      '객체지향 프로그래밍의 개념과 클래스 · 인스턴스의 관계를 설명할 수 있다',
      '왜 딕셔너리 · 전역 변수 대신 클래스를 쓰는지, 언제 쓰지 말아야 하는지 판단할 수 있다',
      '필드와 메서드를 가진 클래스를 선언하고, self 의 역할을 설명할 수 있다',
      '생성자 __init__() 으로 인스턴스를 초기화하고, @classmethod 로 대체 생성자를 만들 수 있다',
      '인스턴스 변수와 클래스 변수를 구분하고, 가변 클래스 변수 공유 함정을 피할 수 있다',
      '@property 와 비공개 관례(_name, __name)로 속성 접근을 관리할 수 있다',
      '상속 · 메서드 오버라이딩 · super() · MRO 를 이해하고, 상속과 컴포지션을 구분해 선택할 수 있다',
      '__str__ · __repr__ · __eq__ · __len__ · __getitem__ · 연산자 메서드로 파이썬다운 클래스를 만들 수 있다',
      '추상 클래스(abc)와 사용자 정의 예외로 안전한 클래스를 설계하고, assert 로 검증할 수 있다',
      '객체를 JSON 파일로 저장하고 다시 불러올 수 있다',
      '멀티 스레드 · 멀티 프로세싱의 개념과 경쟁 조건 문제를 설명할 수 있다'
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
          '클래스로 인스턴스를 만들고 필드와 메서드를 사용할 수 있다',
          '변수 · 딕셔너리로 만든 코드와 비교해 클래스를 쓰는 이유를 설명할 수 있다'
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

          { type: 'h', text: '왜 클래스를 쓰는가 — 변수 · 딕셔너리와 비교' },
          { type: 'p', html: '“클래스 없이도 되는데 왜 배우나요?” 좋은 질문입니다. <b>같은 프로그램</b>을 세 가지 방법으로 만들어 보고 무엇이 달라지는지 직접 비교해 봅시다. 자동차 두 대의 색과 속도를 관리하고, 속도는 150 을 넘지 않게 하는 아주 작은 프로그램입니다.' },
          { type: 'code', title: '방법 ① 변수를 따로따로 만들기', code: `car1_color = "빨강"
car1_speed = 0
car2_color = "파랑"
car2_speed = 0

def upSpeed(speed, value) :      # 값을 받아서 새 값을 돌려주는 함수
    speed += value
    if speed > 150 :
        speed = 150
    return speed

car1_speed = upSpeed(car1_speed, 30)
car2_speed = upSpeed(car2_speed, 200)
print(car1_color, car1_speed)
print(car2_color, car2_speed)`,
            expect: `빨강 30
파랑 150`,
            desc: '동작은 합니다. 하지만 자동차가 한 대 늘 때마다 <b>변수 2개</b>가 늘고, <code>car1_speed = upSpeed(car1_speed, 30)</code> 처럼 “받아서 다시 넣기” 를 잊으면 조용히 값이 바뀌지 않습니다. 자동차 100대면 변수가 200개입니다.' },
          { type: 'code', title: '방법 ② 딕셔너리로 데이터 묶기', code: `car1 = {"color" : "빨강", "speed" : 0}
car2 = {"color" : "파랑", "speed" : 0}

def upSpeed(car, value) :        # 딕셔너리를 받아 직접 고친다
    car["speed"] += value
    if car["speed"] > 150 :
        car["speed"] = 150

upSpeed(car1, 30)
upSpeed(car2, 200)
print(car1["color"], car1["speed"])
print(car2["color"], car2["speed"])
print(car1.get("speeed"))        # 오타를 내도 오류가 아니라 None`,
            expect: `빨강 30
파랑 150
None`,
            desc: '데이터는 한 덩어리로 묶였지만 <b>기능(함수)은 여전히 따로</b> 떨어져 있습니다. 게다가 <code>car1["speeed"]</code> 처럼 키 이름을 틀려도 프로그램이 조용히 넘어가는 경우가 많아 버그를 찾기 어렵습니다.' },
          { type: 'code', title: '방법 ③ 클래스로 데이터와 기능을 함께 묶기', code: `class Car :
    color = ""
    speed = 0

    def upSpeed(self, value) :
        self.speed += value
        if self.speed > 150 :
            self.speed = 150

car1 = Car()
car1.color = "빨강"
car2 = Car()
car2.color = "파랑"

car1.upSpeed(30)
car2.upSpeed(200)
print(car1.color, car1.speed)
print(car2.color, car2.speed)`,
            expect: `빨강 30
파랑 150`,
            desc: '<mark>“속도를 올린다” 는 규칙이 Car 안에 들어가 있습니다.</mark> 자동차를 아무리 많이 만들어도 규칙은 한 곳(메서드)에만 있고, <code>car1.speeed</code> 처럼 이름을 틀리면 <code>AttributeError</code> 로 바로 알려 줍니다.' },
          { type: 'table', caption: '세 가지 방법 비교 — 프로그램이 커질수록 차이가 벌어진다', head: ['', '① 변수 따로', '② 딕셔너리', '③ 클래스'], rows: [
            ['데이터 묶기', '✗ 이름 규칙으로만', '○ 한 덩어리', '○ 한 덩어리'],
            ['기능(함수) 묶기', '✗ 따로 떨어짐', '✗ 따로 떨어짐', '○ 메서드로 함께'],
            ['이름을 틀렸을 때', '✗ 새 변수가 생김', '✗ 조용히 None', '○ <code>AttributeError</code>'],
            ['같은 것 100개 만들기', '✗ 변수 200개', '△ 딕셔너리 100개', '○ <code>Car()</code> 를 100번'],
            ['규칙(150 제한) 지키기', '△ 함수를 꼭 거쳐야', '△ 함수를 꼭 거쳐야', '○ 메서드 안에 들어 있음']
          ] },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 언제 클래스를 쓰지 말아야 할까', html: '클래스가 항상 정답은 아닙니다. 다음과 같을 때는 <b>함수 하나</b>가 더 좋습니다.<ul><li>상태(기억해 둘 값)가 없고 입력 → 출력만 있는 계산: <code>def bmi(kg, m) : return kg / (m * m)</code> 를 굳이 클래스로 감싸지 마세요.</li><li>메서드가 <code>__init__</code> 과 하나뿐인 클래스 — 그냥 함수로 충분합니다.</li><li>값을 담기만 하고 기능이 없는 묶음 — 딕셔너리, <code>tuple</code>, 또는 2교시에서 볼 <code>dataclass</code> 가 더 간단합니다.</li></ul><b>클래스가 좋은 때</b>: 같은 모양의 것을 여러 개 만들 때, 데이터와 그 데이터를 다루는 규칙이 늘 함께 다닐 때, 비슷하지만 조금씩 다른 종류(승용차 · 트럭)를 만들 때입니다.' },

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
홍길동 출금 후 잔액 : 7000원` },
          { title: '실습 12-3. 딕셔너리를 클래스로 바꾸기', level: 2,
            desc: '<p>아래 딕셔너리 코드를 <code>Student</code> 클래스로 바꾸세요.</p><pre><code>s1 = {"name": "김하나", "kor": 90, "eng": 80}</code></pre><p>필드는 <code>name</code>, <code>kor</code>, <code>eng</code> 이고 메서드는 세 개입니다.</p><ul><li><code>total()</code> — 국어 + 영어 점수를 돌려준다</li><li><code>average()</code> — 평균을 돌려준다 (<code>total()</code> 을 이용할 것)</li><li><code>printInfo()</code> — <code>이름 : 총점 N, 평균 N.N</code> 형식으로 출력한다</li></ul><pre><code>김하나 : 총점 170, 평균 85.0\n이두리 : 총점 135, 평균 67.5</code></pre>',
            hint: '메서드 안에서 다른 메서드를 부를 때도 <code>self.</code> 를 붙입니다: <code>self.total()</code>. 평균은 <code>%.1f</code> 서식으로 출력합니다.',
            starter: `class Student :
    name = ""
    kor = 0
    eng = 0

    # TODO: total(self) - 국어 + 영어
    # TODO: average(self) - self.total() 을 이용
    # TODO: printInfo(self) - "이름 : 총점 N, 평균 N.N"

s1 = Student()
s1.name = "김하나"
s1.kor = 90
s1.eng = 80
# TODO: 이두리(70, 65) 학생도 만들고 두 학생의 정보 출력
`,
            solution: `class Student :
    name = ""
    kor = 0
    eng = 0

    def total(self) :
        return self.kor + self.eng

    def average(self) :
        return self.total() / 2

    def printInfo(self) :
        print("%s : 총점 %d, 평균 %.1f" % (self.name, self.total(), self.average()))

s1 = Student()
s1.name = "김하나"
s1.kor = 90
s1.eng = 80

s2 = Student()
s2.name = "이두리"
s2.kor = 70
s2.eng = 65

s1.printInfo()
s2.printInfo()
`,
            expect: `김하나 : 총점 170, 평균 85.0
이두리 : 총점 135, 평균 67.5` },
          { title: '🚀 프로젝트 12-1. 음료 자판기 클래스', level: 3,
            desc: '<p>음료 자판기를 <code>VendingMachine</code> 클래스 하나로 만들어 봅니다. 데이터(이름 · 가격 · 재고 · 투입 금액 · 누적 판매액)와 규칙(거스름돈 · 품절 · 금액 부족)을 <b>한 클래스 안에</b> 모으는 연습입니다.</p><p><b>요구 사항</b></p><ul><li>필드: <code>name</code>(음료 이름), <code>price</code>(가격), <code>stock</code>(재고), <code>money</code>(현재 투입 금액), <code>sales</code>(누적 판매액)</li><li><code>insert(amount)</code> — 돈을 넣고 <code>N원 투입 (현재 N원)</code> 출력</li><li><code>buy()</code> — 재고가 0이면 <code>이름 : 품절입니다.</code>, 투입 금액이 모자라면 <code>이름 : 금액이 부족합니다. (N원 더 필요)</code>, 살 수 있으면 재고를 1 줄이고 가격만큼 투입 금액을 빼고 누적 판매액에 더한 뒤 <code>이름 한 개를 드립니다. (남은 재고 N개)</code> 출력</li><li><code>refund()</code> — <code>거스름돈 N원을 돌려 드립니다.</code> 출력 후 투입 금액을 0으로</li><li><code>report()</code> — <code>[정산] 이름 총 판매액 N원, 남은 재고 N개</code> 출력</li></ul><p><b>메인 코드(그대로 사용)</b>: 콜라(1500원, 재고 2개)에 1000원 투입 → 구매 시도 → 1000원 투입 → 구매 → 1500원 투입 → 구매 → 1500원 투입 → 구매 시도 → 거스름돈 → 정산</p><pre><code>1000원 투입 (현재 1000원)\n콜라 : 금액이 부족합니다. (500원 더 필요)\n1000원 투입 (현재 2000원)\n콜라 한 개를 드립니다. (남은 재고 1개)\n1500원 투입 (현재 2000원)\n콜라 한 개를 드립니다. (남은 재고 0개)\n1500원 투입 (현재 2000원)\n콜라 : 품절입니다.\n거스름돈 2000원을 돌려 드립니다.\n[정산] 콜라 총 판매액 3000원, 남은 재고 0개</code></pre><p><b>여기까지 했다면 이렇게 더 해 보세요</b></p><ul><li>사이다 자판기 인스턴스를 하나 더 만들어 두 자판기가 서로 영향을 주지 않는지 확인하기</li><li><code>buy()</code> 가 성공하면 <code>True</code>, 실패하면 <code>False</code> 를 돌려주게 고치고 메인 코드에서 활용하기</li><li>여러 음료를 리스트에 담아 <code>for</code> 문으로 전체 정산표 출력하기</li></ul>',
            hint: '판단 순서가 중요합니다. ① 재고 확인 → ② 금액 확인 → ③ 판매. <code>if / elif / else</code> 로 세 갈래를 만드세요. 부족한 금액은 <code>self.price - self.money</code> 입니다.',
            starter: `class VendingMachine :
    name = ""
    price = 0
    stock = 0
    money = 0     # 현재 투입 금액
    sales = 0     # 누적 판매액

    def insert(self, amount) :
        # TODO: 투입 금액 늘리고 출력
        pass

    def buy(self) :
        # TODO: 품절 / 금액 부족 / 판매 세 갈래
        pass

    def refund(self) :
        # TODO: 거스름돈 출력 후 0으로
        pass

    def report(self) :
        # TODO: 정산 출력
        pass

cola = VendingMachine()
cola.name = "콜라"
cola.price = 1500
cola.stock = 2

cola.insert(1000)
cola.buy()
cola.insert(1000)
cola.buy()
cola.insert(1500)
cola.buy()
cola.insert(1500)
cola.buy()
cola.refund()
cola.report()
`,
            solution: `class VendingMachine :
    name = ""
    price = 0
    stock = 0
    money = 0     # 현재 투입 금액
    sales = 0     # 누적 판매액

    def insert(self, amount) :
        self.money += amount
        print("%d원 투입 (현재 %d원)" % (amount, self.money))

    def buy(self) :
        if self.stock <= 0 :
            print("%s : 품절입니다." % self.name)
        elif self.money < self.price :
            print("%s : 금액이 부족합니다. (%d원 더 필요)" % (self.name, self.price - self.money))
        else :
            self.stock -= 1
            self.money -= self.price
            self.sales += self.price
            print("%s 한 개를 드립니다. (남은 재고 %d개)" % (self.name, self.stock))

    def refund(self) :
        print("거스름돈 %d원을 돌려 드립니다." % self.money)
        self.money = 0

    def report(self) :
        print("[정산] %s 총 판매액 %d원, 남은 재고 %d개" % (self.name, self.sales, self.stock))

cola = VendingMachine()
cola.name = "콜라"
cola.price = 1500
cola.stock = 2

cola.insert(1000)
cola.buy()
cola.insert(1000)
cola.buy()
cola.insert(1500)
cola.buy()
cola.insert(1500)
cola.buy()
cola.refund()
cola.report()
`,
            expect: `1000원 투입 (현재 1000원)
콜라 : 금액이 부족합니다. (500원 더 필요)
1000원 투입 (현재 2000원)
콜라 한 개를 드립니다. (남은 재고 1개)
1500원 투입 (현재 2000원)
콜라 한 개를 드립니다. (남은 재고 0개)
1500원 투입 (현재 2000원)
콜라 : 품절입니다.
거스름돈 2000원을 돌려 드립니다.
[정산] 콜라 총 판매액 3000원, 남은 재고 0개` }
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
            explain: '파이썬은 <code>클래스명()</code> 으로 인스턴스를 만듭니다. <code>Car</code> 만 쓰면 클래스 자체가 대입됩니다. <code>new</code> 는 자바 문법입니다.' },
          { q: '다음 코드에는 <b>오류</b>가 있습니다. 어디를 고쳐야 할까요?<pre><code>class Car :\n    speed = 0\n    def upSpeed(self, value) :\n        speed += value\n\nc = Car()\nc.upSpeed(10)</code></pre>',
            options: ['<code>class Car :</code> 를 <code>class Car() :</code> 로 바꾼다', '<code>speed += value</code> 를 <code>self.speed += value</code> 로 바꾼다', '<code>c = Car()</code> 를 <code>c = new Car()</code> 로 바꾼다', '<code>def upSpeed(self, value)</code> 에서 self 를 뺀다'], answer: 1,
            explain: '메서드 안에서 <code>self.</code> 없이 <code>speed</code> 라고 쓰면 파이썬은 <b>지역 변수</b> speed 를 찾습니다. 아직 값이 없으므로 <code>UnboundLocalError</code> 가 납니다. 필드를 쓸 때는 반드시 <code>self.</code> 를 붙입니다.' },
          { q: '딕셔너리 대신 클래스를 쓰면 좋은 점으로 가장 알맞은 것은?', options: ['코드가 항상 짧아진다', '실행 속도가 항상 빨라진다', '데이터와 그 데이터를 다루는 규칙(메서드)을 한곳에 모을 수 있다', '변수를 만들지 않아도 된다'], answer: 2,
            explain: '딕셔너리도 데이터는 묶어 주지만 기능은 바깥의 함수로 흩어집니다. 클래스는 데이터와 기능을 함께 묶어 두므로 규칙을 한 곳에서 관리할 수 있습니다. 코드 길이나 속도가 목적이 아닙니다.' }
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
          { layout: 'two', title: '왜 클래스를 쓰는가?', left: { title: '딕셔너리 — 데이터만 묶인다', code: `car1 = {"color": "빨강", "speed": 0}

def upSpeed(car, value) :
    car["speed"] += value
    if car["speed"] > 150 :
        car["speed"] = 150

upSpeed(car1, 200)
print(car1["color"], car1["speed"])` },
            right: { title: '클래스 — 데이터 + 규칙이 함께', code: `class Car :
    color = ""
    speed = 0
    def upSpeed(self, value) :
        self.speed += value
        if self.speed > 150 :
            self.speed = 150

car1 = Car()
car1.color = "빨강"
car1.upSpeed(200)
print(car1.color, car1.speed)` },
            notes: '<p>📘 보충. 두 코드의 결과는 <b>똑같이 “빨강 150”</b> 입니다. 차이는 “150 제한” 규칙이 어디에 있느냐입니다.</p><p>발문: “자동차가 100대로 늘면 어느 쪽이 편할까요?”, “딕셔너리에서 <code>car[\'speeed\']</code> 처럼 오타를 내면 어떻게 될까요?” → 클래스는 AttributeError 로 바로 알려 줍니다.</p><p>정리: <b>같은 모양을 여러 개</b> 만들고, <b>데이터와 규칙이 늘 함께</b> 다닐 때 클래스를 씁니다. 계산만 하는 짧은 코드는 함수가 더 낫다는 점도 덧붙이세요.</p><p>(4분)</p>' },
          { layout: 'quiz', title: '오류 찾기', q: '다음 코드는 왜 오류가 날까요?<br><code>class Car :</code><br>&nbsp;&nbsp;<code>speed = 0</code><br>&nbsp;&nbsp;<code>def upSpeed(self, value) :</code><br>&nbsp;&nbsp;&nbsp;&nbsp;<code>speed += value</code>', options: ['클래스 이름에 괄호가 없어서', '<code>self.</code> 를 빼서 지역 변수를 찾기 때문에', 'value 가 정수가 아니라서', '오류가 나지 않는다'], answer: 1,
            explain: '<code>speed += value</code> 는 지역 변수 speed 를 읽으려다 UnboundLocalError. <code>self.speed += value</code> 로 고칩니다.',
            notes: '<p>실제로 실행해서 <code>UnboundLocalError: cannot access local variable \'speed\'</code> 메시지를 보여 주세요. 학생들이 가장 많이 내는 실수입니다.</p><p>“오류 메시지에 나온 단어(local variable)를 보면 원인을 알 수 있다” 는 점을 짚어 주세요.</p><p>(3분)</p>' },
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
          '값을 돌려주는 메서드(getName, getSpeed)를 만들어 [프로그램 1]을 완성할 수 있다',
          '기본값과 키워드 인수를 쓰고, 가변 기본값의 위험을 설명할 수 있다',
          '@classmethod 로 대체 생성자를 만들고, @dataclass 로 값 클래스를 짧게 쓸 수 있다'
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
>>>` },

          { type: 'h', text: '기본값과 키워드 인수로 더 편한 생성자 만들기' },
          { type: 'p', html: '생성자도 함수이므로 <b>기본값이 있는 매개변수</b>와 <b>키워드 인수</b>를 쓸 수 있습니다. 값을 주면 그 값으로, 주지 않으면 기본값으로 초기화되므로 “자주 쓰는 값” 을 미리 정해 둘 수 있습니다.' },
          { type: 'code', title: '추가 예제. 기본값 · 키워드 인수를 쓰는 생성자', code: `class Car :
    def __init__(self, name, color = "흰색", speed = 0) :
        self.name = name
        self.color = color
        self.speed = speed

    def info(self) :
        return f"{self.name}({self.color}) {self.speed}km"

car1 = Car("아반떼")                              # color, speed 는 기본값
car2 = Car("소나타", "검정")                       # speed 만 기본값
car3 = Car("그랜저", speed = 60)                   # 키워드 인수: color 를 건너뛴다
car4 = Car(name = "제네시스", color = "파랑", speed = 30)

for car in [car1, car2, car3, car4] :
    print(car.info())`,
            expect: `아반떼(흰색) 0km
소나타(검정) 0km
그랜저(흰색) 60km
제네시스(파랑) 30km`,
            desc: '<code>13행</code>처럼 <code>speed = 60</code> 이라고 이름을 적어 주면 중간 매개변수(color)를 건너뛸 수 있습니다. 인수가 4~5개로 늘어날수록 키워드 인수가 훨씬 읽기 쉽습니다. <code>8행</code>의 f-string 도 눈여겨보세요.' },
          { type: 'callout', kind: 'warn', title: '흔한 함정: 기본값으로 리스트를 쓰면 안 된다', html: '<code>def __init__(self, items = []) :</code> 처럼 <b>가변(mutable) 값</b>을 기본값으로 쓰면 그 리스트는 함수를 정의할 때 <b>딱 한 번</b> 만들어져 모든 인스턴스가 함께 쓰게 됩니다. 다음 예제로 확인해 보세요.' },
          { type: 'code', title: '추가 예제. 기본값 리스트를 공유하는 버그', code: `class Cart :
    def __init__(self, items = []) :     # 위험한 기본값
        self.items = items

    def add(self, item) :
        self.items.append(item)

cart1 = Cart()
cart2 = Cart()
cart1.add("사과")

print("cart1 :", cart1.items)
print("cart2 :", cart2.items)            # 넣은 적이 없는데?
print("같은 리스트인가 :", cart1.items is cart2.items)`,
            expect: `cart1 : ['사과']
cart2 : ['사과']
같은 리스트인가 : True`,
            desc: '두 장바구니가 <b>같은 리스트</b>를 가리키고 있습니다. 해결 방법은 기본값을 <code>None</code> 으로 두고 생성자 안에서 새로 만드는 것입니다.<pre><code>def __init__(self, items = None) :\n    self.items = [] if items is None else items</code></pre>이 문제는 3교시의 “가변 클래스 변수 공유” 와 원인이 같습니다.' },

          { type: 'h', text: '대체 생성자 만들기 — @classmethod' },
          { type: 'p', html: '“문자열 <code>"소나타,60"</code> 에서 자동차를 만들고 싶다”, “속도 0 인 주차된 차를 자주 만든다” 처럼 <b>만드는 방법이 여러 가지</b>일 때가 있습니다. <code>__init__</code> 을 복잡하게 만드는 대신 <b>대체 생성자(alternative constructor)</b>를 따로 두면 훨씬 읽기 좋습니다. 메서드 위에 <code>@classmethod</code> 를 붙이면 첫 번째 매개변수로 인스턴스(self) 대신 <b>클래스 자신</b>(관례상 <code>cls</code>)이 들어옵니다.' },
          { type: 'code', title: '추가 예제. @classmethod 로 만든 대체 생성자', code: `class Car :
    def __init__(self, name, speed) :
        self.name = name
        self.speed = speed

    @classmethod
    def fromText(cls, text) :          # "소나타,60" 형식의 문자열에서 만들기
        name, speed = text.split(",")
        return cls(name.strip(), int(speed))

    @classmethod
    def parked(cls, name) :            # 주차된 차 (속도 0)
        return cls(name, 0)

    def info(self) :
        return "%s : %dkm" % (self.name, self.speed)

car1 = Car("아우디", 30)
car2 = Car.fromText("소나타, 60")
car3 = Car.parked("트럭")

for car in [car1, car2, car3] :
    print(car.info())`,
            expect: `아우디 : 30km
소나타 : 60km
트럭 : 0km`,
            desc: '<code>cls</code> 는 Car 클래스 자신이므로 <code>cls(name, 0)</code> 은 <code>Car(name, 0)</code> 과 같습니다. 클래스 이름을 직접 쓰지 않고 <code>cls</code> 를 쓰는 이유는, 나중에 Car 를 상속받은 클래스에서 불러도 <b>그 자식 클래스의 인스턴스</b>가 만들어지기 때문입니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 메서드 세 종류 정리', html: '<ul><li><b>인스턴스 메서드</b> <code>def info(self)</code> — 첫 인수는 인스턴스. 인스턴스마다 다른 값을 다룰 때(대부분).</li><li><b>클래스 메서드</b> <code>@classmethod def fromText(cls, …)</code> — 첫 인수는 클래스. 대체 생성자, 클래스 변수를 다루는 일에 씁니다.</li><li><b>정적 메서드</b> <code>@staticmethod def isValid(text)</code> — 자동으로 넘어오는 인수가 없습니다. 클래스와 관련은 있지만 인스턴스도 클래스도 건드리지 않는 도우미 함수를 클래스 안에 모아 둘 때 씁니다.</li></ul>세 가지 모두 <code>Car.메서드()</code> 로도, <code>car1.메서드()</code> 로도 부를 수 있습니다(인스턴스 메서드만 클래스로 부를 때 인스턴스를 직접 넘겨야 합니다).' },

          { type: 'h', text: '값만 담는 클래스는 dataclass 로 짧게' },
          { type: 'p', html: '점 좌표처럼 <b>값만 담아 두는</b> 클래스는 생성자를 쓰는 일이 늘 비슷합니다. 파이썬 표준 모듈 <code>dataclasses</code> 의 <code>@dataclass</code> 를 붙이면 생성자와 출력 형식, 비교 방법을 <b>자동으로</b> 만들어 줍니다.' },
          { type: 'code', title: '추가 예제. @dataclass 로 만든 Point', code: `from dataclasses import dataclass

@dataclass
class Point :
    x: int = 0
    y: int = 0

    def distance(self) :           # 메서드도 평소처럼 추가할 수 있다
        return (self.x ** 2 + self.y ** 2) ** 0.5

p1 = Point(3, 4)
p2 = Point(3, 4)
p3 = Point()

print(p1)                # __init__ 과 보기 좋은 출력이 자동으로 생긴다
print(p3)
print(p1 == p2)          # 값이 같으면 같다고 판단해 준다
print(p1.distance())`,
            expect: `Point(x=3, y=4)
Point(x=0, y=0)
True
5.0`,
            desc: '<code>x: int = 0</code> 의 <code>: int</code> 는 <b>타입 힌트</b>입니다. “여기에는 정수가 들어온다” 는 메모로, 실행에는 영향을 주지 않지만 dataclass 는 이 줄을 보고 필드를 알아냅니다. 직접 만들었다면 <code>__init__</code>, <code>__repr__</code>, <code>__eq__</code>(6교시에 배웁니다)를 모두 써야 할 일을 두 줄로 끝냈습니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 타입 힌트(type hint)', html: '파이썬은 변수의 자료형을 적지 않아도 되지만, 적어 두면 <b>읽는 사람과 편집기</b>가 도움을 받습니다.<pre><code>class Car :\n    def __init__(self, name: str, speed: int = 0) -> None :\n        self.name = name\n        self.speed = speed\n\n    def info(self) -> str :\n        return f"{self.name} {self.speed}km"</code></pre><code>-&gt;</code> 뒤는 <b>돌려주는 값</b>의 자료형입니다. 힌트일 뿐이라 <code>Car(123)</code> 처럼 잘못 넣어도 실행은 됩니다. 대신 VS Code 같은 편집기가 미리 빨간 줄로 알려 주고, 자동 완성이 정확해집니다.' }
        ],
        practice: [
          { title: '실습 12-4. 학생 클래스', level: 1,
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
          { title: '실습 12-5. 좌표 클래스 (기본값 매개변수)', level: 1,
            desc: '<p>생성자로 <code>x</code>, <code>y</code> 를 받는 Point 클래스를 만드세요. 두 값 모두 <b>기본값 0</b> 이어서 <code>Point()</code> 로도 만들 수 있어야 합니다. <code>move(dx, dy)</code> 는 좌표를 옮기고, <code>info()</code> 는 <code>(3, 4)</code> 형식의 문자열을 돌려줍니다.</p><pre><code>p1 : (3, 4)\np2 : (5, 25)</code></pre>',
            hint: '<code>def __init__(self, x = 0, y = 0) :</code> 처럼 매개변수에 기본값을 줍니다. info() 는 <code>return "(%d, %d)" % (self.x, self.y)</code>.',
            starter: `class Point :
    # TODO: 생성자 (x, y 의 기본값은 0)

    # TODO: move(self, dx, dy)
    # TODO: info(self) - "(x, y)" 문자열 반환
    pass

p1 = Point()
p2 = Point(10, 20)
# TODO: p1 은 (3, 4) 만큼, p2 는 (-5, 5) 만큼 옮기고 출력
`,
            solution: `class Point :
    def __init__(self, x = 0, y = 0) :
        self.x = x
        self.y = y

    def move(self, dx, dy) :
        self.x += dx
        self.y += dy

    def info(self) :
        return "(%d, %d)" % (self.x, self.y)

p1 = Point()
p2 = Point(10, 20)
p1.move(3, 4)
p2.move(-5, 5)
print("p1 :", p1.info())
print("p2 :", p2.info())
`,
            expect: `p1 : (3, 4)
p2 : (5, 25)` },
          { title: '실습 12-6. 입력받아 자동차 만들기', level: 2,
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
소나타의 현재 속도는 60입니다.` },
          { title: '실습 12-7. 대체 생성자로 책 목록 만들기', level: 2,
            desc: '<p><code>Book</code> 클래스에 제목(title)과 가격(price)을 받는 생성자를 만들고, <code>"파이썬 입문, 18000"</code> 형식의 <b>문자열 하나로</b> 인스턴스를 만드는 대체 생성자 <code>fromText()</code> 를 <code>@classmethod</code> 로 추가하세요. 문자열 목록을 모두 Book 인스턴스로 바꾼 뒤 정보를 출력하고, 가장 비싼 책의 제목도 출력합니다.</p><pre><code>파이썬 입문 : 18000원\n알고리즘 산책 : 25000원\n거북이 그래픽 : 12000원\n가장 비싼 책 : 알고리즘 산책</code></pre>',
            hint: '<code>text.split(",")</code> 으로 나누고, 제목은 <code>.strip()</code> 으로 앞뒤 공백을 없애고, 가격은 <code>int()</code> 로 바꿉니다. 대체 생성자 안에서는 <code>return cls(제목, 가격)</code>. 가장 비싼 책은 <code>max(books, key = lambda b : b.price)</code>.',
            starter: `class Book :
    def __init__(self, title, price) :
        self.title = title
        self.price = price

    # TODO: @classmethod fromText(cls, text)

    def info(self) :
        return "%s : %d원" % (self.title, self.price)

lines = ["파이썬 입문, 18000", "알고리즘 산책, 25000", "거북이 그래픽, 12000"]
# TODO: 문자열 목록을 Book 목록으로 바꾸고 출력, 가장 비싼 책 찾기
`,
            solution: `class Book :
    def __init__(self, title, price) :
        self.title = title
        self.price = price

    @classmethod
    def fromText(cls, text) :
        title, price = text.split(",")
        return cls(title.strip(), int(price))

    def info(self) :
        return "%s : %d원" % (self.title, self.price)

lines = ["파이썬 입문, 18000", "알고리즘 산책, 25000", "거북이 그래픽, 12000"]
books = [Book.fromText(line) for line in lines]

for b in books :
    print(b.info())
print("가장 비싼 책 :", max(books, key = lambda b : b.price).title)
`,
            expect: `파이썬 입문 : 18000원
알고리즘 산책 : 25000원
거북이 그래픽 : 12000원
가장 비싼 책 : 알고리즘 산책` },
          { title: '🚀 프로젝트 12-2. 은행 계좌 클래스 (입출금 · 이자 · 거래 내역)', level: 3,
            desc: '<p>실습 12-2 의 계좌를 <b>생성자 · 검사 · 거래 내역</b>까지 갖춘 제대로 된 클래스로 키웁니다. 잘못된 요청을 <b>클래스 안에서</b> 막아 주는 것이 핵심입니다.</p><p><b>요구 사항</b></p><ul><li>생성자 <code>__init__(self, owner, balance = 0)</code> — 예금주와 시작 잔액(기본값 0), 그리고 <b>빈 거래 내역 리스트</b> <code>self.history = []</code> 를 만든다</li><li><code>deposit(money)</code> — 0원 이하이면 <code>입금액은 0원보다 커야 합니다.</code> 를 출력하고 아무 일도 하지 않는다. 정상이면 잔액을 늘리고 내역에 <code>입금 N원</code> 을 남긴 뒤 <code>예금주님 N원 입금 (잔액 N원)</code> 출력</li><li><code>withdraw(money)</code> — 잔액보다 많으면 <code>잔액이 부족합니다. (현재 N원)</code> 출력. 정상이면 잔액을 줄이고 내역에 <code>출금 N원</code> 을 남긴 뒤 <code>예금주님 N원 출금 (잔액 N원)</code> 출력</li><li><code>addInterest(rate)</code> — 이자는 <code>int(잔액 * rate / 100)</code>. 잔액에 더하고 내역에 <code>이자 N원</code> 을 남긴 뒤 <code>이자 N원이 붙었습니다. (잔액 N원)</code> 출력</li><li><code>statement()</code> — 거래 내역을 번호를 붙여 모두 출력하고 마지막에 최종 잔액 출력</li></ul><p><b>메인 코드(그대로 사용)</b>: 홍길동 계좌 → 100000 입금 → -500 입금 시도 → 30000 출금 → 1000000 출금 시도 → 연 3% 이자 → 내역 출력</p><pre><code>홍길동님 100000원 입금 (잔액 100000원)\n입금액은 0원보다 커야 합니다.\n홍길동님 30000원 출금 (잔액 70000원)\n잔액이 부족합니다. (현재 70000원)\n이자 2100원이 붙었습니다. (잔액 72100원)\n--- 홍길동님 거래 내역 ---\n1. 입금 100000원\n2. 출금 30000원\n3. 이자 2100원\n최종 잔액 : 72100원</code></pre><p><b>여기까지 했다면 이렇게 더 해 보세요</b></p><ul><li>계좌를 두 개 만들어 내역이 섞이지 않는지 확인하기 (<code>self.history = []</code> 를 생성자가 아니라 클래스 맨 위에 두면 어떻게 될까요? → 3교시에서 답을 봅니다)</li><li><code>transfer(other, money)</code> 를 만들어 다른 계좌로 이체하기 (내 계좌에서 출금 + 상대 계좌에 입금)</li><li>출금 실패를 <code>print</code> 대신 <b>예외</b>로 알리기 (6교시의 사용자 정의 예외)</li></ul>',
            hint: '검사 → 처리 → 기록 → 출력 순서로 작성하면 깔끔합니다. 조건에 걸리면 <code>return</code> 으로 바로 메서드를 빠져나오세요. 내역 번호는 <code>for i, item in enumerate(self.history, 1) :</code> 로 붙일 수 있습니다.',
            starter: `class Account :
    def __init__(self, owner, balance = 0) :
        self.owner = owner
        self.balance = balance
        self.history = []          # 거래 내역

    def deposit(self, money) :
        # TODO: 0원 이하면 메시지만 출력하고 return
        pass

    def withdraw(self, money) :
        # TODO: 잔액보다 많으면 메시지만 출력하고 return
        pass

    def addInterest(self, rate) :
        # TODO: 이자 = int(self.balance * rate / 100)
        pass

    def statement(self) :
        # TODO: 내역을 번호와 함께 출력하고 최종 잔액 출력
        pass

acc = Account("홍길동")
acc.deposit(100000)
acc.deposit(-500)
acc.withdraw(30000)
acc.withdraw(1000000)
acc.addInterest(3)
acc.statement()
`,
            solution: `class Account :
    def __init__(self, owner, balance = 0) :
        self.owner = owner
        self.balance = balance
        self.history = []          # 거래 내역

    def deposit(self, money) :
        if money <= 0 :
            print("입금액은 0원보다 커야 합니다.")
            return
        self.balance += money
        self.history.append("입금 %d원" % money)
        print("%s님 %d원 입금 (잔액 %d원)" % (self.owner, money, self.balance))

    def withdraw(self, money) :
        if money > self.balance :
            print("잔액이 부족합니다. (현재 %d원)" % self.balance)
            return
        self.balance -= money
        self.history.append("출금 %d원" % money)
        print("%s님 %d원 출금 (잔액 %d원)" % (self.owner, money, self.balance))

    def addInterest(self, rate) :
        interest = int(self.balance * rate / 100)
        self.balance += interest
        self.history.append("이자 %d원" % interest)
        print("이자 %d원이 붙었습니다. (잔액 %d원)" % (interest, self.balance))

    def statement(self) :
        print("--- %s님 거래 내역 ---" % self.owner)
        for i, item in enumerate(self.history, 1) :
            print("%d. %s" % (i, item))
        print("최종 잔액 : %d원" % self.balance)

acc = Account("홍길동")
acc.deposit(100000)
acc.deposit(-500)
acc.withdraw(30000)
acc.withdraw(1000000)
acc.addInterest(3)
acc.statement()
`,
            expect: `홍길동님 100000원 입금 (잔액 100000원)
입금액은 0원보다 커야 합니다.
홍길동님 30000원 출금 (잔액 70000원)
잔액이 부족합니다. (현재 70000원)
이자 2100원이 붙었습니다. (잔액 72100원)
--- 홍길동님 거래 내역 ---
1. 입금 100000원
2. 출금 30000원
3. 이자 2100원
최종 잔액 : 72100원` }
        ],
        quiz: [
          { q: '파이썬 생성자의 이름으로 옳은 것은?', options: ['Car()', '_init_()', '__init__()', 'constructor()'], answer: 2,
            explain: '생성자는 앞뒤로 밑줄 두 개씩 붙은 <code>__init__()</code> 입니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>class Car :\n    def __init__(self) :\n        print("생성")\n\na = Car()\nb = Car()</code></pre>', options: ['생성', '생성\n생성 (두 줄)', '아무것도 출력되지 않는다', '오류'], answer: 1,
            explain: '인스턴스를 만들 때마다 생성자가 자동 호출되므로 “생성” 이 두 번 출력됩니다.' },
          { q: '<code>def __init__(self, name, speed)</code> 생성자를 가진 Car 로 인스턴스를 만드는 올바른 코드는?', options: ['Car(self, "벤츠", 30)', 'Car("벤츠", 30)', 'Car.__init__("벤츠", 30)', 'Car()'], answer: 1,
            explain: 'self 는 자동으로 전달되므로 나머지 두 값만 넘깁니다. <code>Car()</code> 는 인수가 모자라 TypeError 가 납니다.' },
          { q: '다음 중 생성자에 대한 설명으로 <b>틀린</b> 것은?', options: ['인스턴스를 만들 때 자동으로 호출된다', '필드 값을 초기화하는 데 주로 쓴다', 'self 외에 매개변수를 더 가질 수 있다', '반드시 메인 코드에서 직접 호출해야 한다'], answer: 3,
            explain: '생성자는 <code>클래스명()</code> 으로 인스턴스를 만들 때 자동으로 호출됩니다. 직접 부를 필요가 없습니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>class Car :\n    def __init__(self, name, color = "흰색", speed = 0) :\n        self.name = name\n        self.color = color\n        self.speed = speed\n\nc = Car("그랜저", speed = 60)\nprint(c.name, c.color, c.speed)</code></pre>',
            options: ['그랜저 흰색 60', '그랜저 60 0', '그랜저 흰색 0', '오류'], answer: 0,
            explain: 'color 는 값을 주지 않았으므로 기본값 “흰색”, speed 는 <b>키워드 인수</b>로 60 을 지정했습니다. 키워드 인수를 쓰면 중간 매개변수를 건너뛸 수 있습니다.' },
          { q: '다음 코드에서 <code>cart2.items</code> 가 <code>[\'사과\']</code> 로 나오는 이유는?<pre><code>class Cart :\n    def __init__(self, items = []) :\n        self.items = items\n\ncart1 = Cart()\ncart2 = Cart()\ncart1.add("사과")   # items.append("사과")</code></pre>',
            options: ['Cart 가 클래스 변수를 쓰기 때문', '기본값 리스트는 한 번만 만들어져 모든 인스턴스가 공유하기 때문', 'append 가 원래 모든 리스트를 바꾸기 때문', '파이썬의 버그'], answer: 1,
            explain: '기본값은 함수를 <b>정의할 때 한 번</b> 만들어집니다. 가변 값(리스트 · 딕셔너리)을 기본값으로 쓰면 모두가 같은 객체를 쓰게 됩니다. <code>items = None</code> 으로 두고 생성자 안에서 <code>[]</code> 를 새로 만들어야 합니다.' }
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
          { layout: 'code', title: '기본값 · 키워드 인수를 쓰는 생성자', code: `class Car :
    def __init__(self, name, color = "흰색", speed = 0) :
        self.name = name
        self.color = color
        self.speed = speed

    def info(self) :
        return f"{self.name}({self.color}) {self.speed}km"

car1 = Car("아반떼")
car2 = Car("소나타", "검정")
car3 = Car("그랜저", speed = 60)

for car in [car1, car2, car3] :
    print(car.info())`,
            points: ['기본값: 값을 안 주면 그 값으로', '키워드 인수: <code>speed = 60</code> → 중간을 건너뛴다', '인수가 많아질수록 키워드 인수가 읽기 쉽다'],
            notes: '<p>📘 보충(중급). 출력은 아반떼(흰색) 0km / 소나타(검정) 0km / 그랜저(흰색) 60km 입니다.</p><p>발문: “<code>Car(\'그랜저\', 60)</code> 이라고 쓰면 어떻게 될까요?” → 60 이 color 에 들어가 “그랜저(60) 0km”. 키워드 인수가 필요한 이유가 드러납니다.</p><p>(4분)</p>' },
          { layout: 'code', title: '⚠ 기본값으로 리스트를 쓰면 안 된다', code: `class Cart :
    def __init__(self, items = []) :   # 위험한 기본값
        self.items = items

    def add(self, item) :
        self.items.append(item)

cart1 = Cart()
cart2 = Cart()
cart1.add("사과")

print("cart1 :", cart1.items)
print("cart2 :", cart2.items)
print(cart1.items is cart2.items)`,
            points: ['기본값은 <b>정의할 때 한 번</b> 만들어진다', '두 장바구니가 같은 리스트를 공유!', '해결: <code>items = None</code> → 생성자에서 <code>[]</code> 만들기'],
            notes: '<p>📘 보충. 실행 결과가 둘 다 [\'사과\'] 인 것을 보여 주고 이유를 토론하게 하세요.</p><p>고친 코드: <code>self.items = [] if items is None else items</code>.</p><p>3교시의 “가변 클래스 변수 공유” 와 원인이 같다는 점을 예고합니다.</p><p>(4분)</p>' },
          { layout: 'code', title: '대체 생성자: @classmethod', code: `class Car :
    def __init__(self, name, speed) :
        self.name = name
        self.speed = speed

    @classmethod
    def fromText(cls, text) :
        name, speed = text.split(",")
        return cls(name.strip(), int(speed))

    def info(self) :
        return "%s : %dkm" % (self.name, self.speed)

print(Car("아우디", 30).info())
print(Car.fromText("소나타, 60").info())`,
            points: ['<code>@classmethod</code> → 첫 인수는 클래스 자신(<code>cls</code>)', '<code>cls(…)</code> = <code>Car(…)</code>', '“만드는 방법이 여러 가지” 일 때 쓴다', '<code>Car.fromText(…)</code> 처럼 클래스로 호출'],
            notes: '<p>📘 보충(중급). 실무에서 아주 자주 보는 무늬입니다(<code>datetime.fromtimestamp</code>, <code>dict.fromkeys</code> 등).</p><p>발문: “생성자 하나로 문자열도 받고 숫자도 받게 만들면 어떻게 될까요?” → if 문으로 복잡해집니다. 이름이 있는 대체 생성자가 읽기 좋습니다.</p><p>(4분)</p>' },
          { layout: 'code', title: '값만 담는 클래스는 @dataclass', code: `from dataclasses import dataclass

@dataclass
class Point :
    x: int = 0
    y: int = 0

    def distance(self) :
        return (self.x ** 2 + self.y ** 2) ** 0.5

p1 = Point(3, 4)
p2 = Point(3, 4)
print(p1)
print(Point())
print(p1 == p2)
print(p1.distance())`,
            points: ['<code>__init__</code> · 보기 좋은 출력 · 값 비교가 자동 생성', '<code>x: int = 0</code> 의 <code>: int</code> 는 타입 힌트', '메서드는 평소처럼 추가 가능'],
            notes: '<p>📘 보충(중급). 출력: Point(x=3, y=4) / Point(x=0, y=0) / True / 5.0.</p><p>“값만 담는 클래스” 에만 쓰라고 강조하세요. 기능이 많은 클래스는 평소대로 만듭니다.</p><p>시간이 부족하면 이 슬라이드는 건너뛰고 학생 문서로 안내해도 됩니다.</p><p>(3분)</p>' },
          { layout: 'practice', title: '🚀 프로젝트 12-2. 은행 계좌 클래스', desc: '생성자로 예금주 · 잔액 · 거래 내역을 초기화하고, 입금 · 출금(잔액 검사) · 이자 · 내역 출력 메서드를 만드세요.',
            starter: `class Account :
    def __init__(self, owner, balance = 0) :
        self.owner = owner
        self.balance = balance
        self.history = []
    # TODO: deposit, withdraw, addInterest, statement

acc = Account("홍길동")
acc.deposit(100000)
acc.withdraw(30000)
`,
            solution: `class Account :
    def __init__(self, owner, balance = 0) :
        self.owner = owner
        self.balance = balance
        self.history = []

    def deposit(self, money) :
        if money <= 0 :
            print("입금액은 0원보다 커야 합니다.")
            return
        self.balance += money
        self.history.append("입금 %d원" % money)
        print("%s님 %d원 입금 (잔액 %d원)" % (self.owner, money, self.balance))

    def withdraw(self, money) :
        if money > self.balance :
            print("잔액이 부족합니다. (현재 %d원)" % self.balance)
            return
        self.balance -= money
        print("%s님 %d원 출금 (잔액 %d원)" % (self.owner, money, self.balance))

acc = Account("홍길동")
acc.deposit(100000)
acc.withdraw(30000)
acc.withdraw(1000000)
`,
            notes: '<p>학생 문서의 프로젝트는 이자 · 거래 내역까지 포함합니다. 슬라이드는 입금 · 출금만 줄인 버전입니다.</p><p>핵심 지도 포인트: ① 검사를 먼저 하고 <code>return</code> 으로 빠져나온다 ② <code>self.history = []</code> 는 반드시 생성자 안에 둔다(클래스 위에 두면 모든 계좌가 내역을 공유!).</p><p>(8분, 남은 시간은 과제)</p>' },
          { layout: 'quiz', title: '확인 문제', q: 'class Car: def __init__(self): print("생성") 일 때<br>a = Car(); b = Car() 를 실행하면?', options: ['생성 (한 번)', '생성 (두 번)', '아무 출력 없음', '오류'], answer: 1,
            explain: '인스턴스를 만들 때마다 생성자가 자동 호출됩니다.',
            notes: '<p>“아무 출력 없음” 을 고른 학생은 생성자를 직접 불러야 한다고 생각한 것입니다. 자동 호출을 다시 강조합니다.</p><p>(2분)</p>' },
          { layout: 'practice', title: '실습 12-4. 학생 클래스', desc: '생성자로 name, score 를 받고 getResult() 가 60점 이상이면 "합격" 을 돌려주게 하세요.',
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
          '인스턴스를 통해 클래스 변수에 대입할 때 생기는 문제를 설명할 수 있다',
          '가변(리스트) 클래스 변수를 공유하는 버그를 찾아 고칠 수 있다',
          '@property 와 비공개 관례(_name, __name)로 속성 접근을 제어할 수 있다'
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
            desc: '<code>__dict__</code> 는 인스턴스가 직접 가진 변수 목록입니다. a 에는 아무 변수도 없으므로(<code>{}</code>) <code>a.count</code> 는 클래스에서 찾아온 값입니다.' },

          { type: 'h', text: '가장 무서운 함정: 리스트 클래스 변수 공유하기' },
          { type: 'p', html: '앞에서 <code>self.count += 1</code> 은 인스턴스에 새 변수를 만들 뿐 클래스 변수를 바꾸지 못한다고 배웠습니다. 그런데 클래스 변수가 <b>리스트</b>라면 이야기가 완전히 달라집니다. <code>self.scores.append(90)</code> 은 <b>대입(=)이 아니라 변경</b>이라서 새 변수를 만들지 않고 <mark>모두가 함께 쓰는 리스트를 직접 고칩니다.</mark>' },
          { type: 'code', title: '추가 예제. 점수가 섞이는 버그', code: `class Student :
    scores = []              # 클래스 변수 — 모든 학생이 함께 쓴다!

    def __init__(self, name) :
        self.name = name

    def addScore(self, score) :
        self.scores.append(score)    # 대입이 아니라 '변경'

s1 = Student("김하나")
s2 = Student("이두리")
s1.addScore(90)
s2.addScore(70)

print("김하나 :", s1.scores)
print("이두리 :", s2.scores)
print("같은 리스트인가 :", s1.scores is s2.scores)`,
            expect: `김하나 : [90, 70]
이두리 : [90, 70]
같은 리스트인가 : True`,
            desc: '두 학생의 점수가 한 리스트에 섞여 버렸습니다. 이런 버그는 오류 메시지가 없어서 찾기가 아주 어렵습니다. 원인은 2교시의 “기본값 리스트” 함정과 똑같습니다 — <b>가변(mutable) 객체를 여러 인스턴스가 함께 가리키고 있다</b>는 것입니다.' },
          { type: 'code', title: '추가 예제. 생성자에서 새 리스트를 만들어 고치기', code: `class Student :
    def __init__(self, name) :
        self.name = name
        self.scores = []     # 인스턴스마다 새 리스트를 만든다

    def addScore(self, score) :
        self.scores.append(score)

s1 = Student("김하나")
s2 = Student("이두리")
s1.addScore(90)
s2.addScore(70)

print("김하나 :", s1.scores)
print("이두리 :", s2.scores)
print("같은 리스트인가 :", s1.scores is s2.scores)`,
            expect: `김하나 : [90]
이두리 : [70]
같은 리스트인가 : False`,
            desc: '<code>self.scores = []</code> 가 <b>생성자 안</b>에 있으므로 인스턴스를 만들 때마다 새 리스트가 생깁니다. <b>인스턴스마다 따로 가져야 할 리스트 · 딕셔너리는 반드시 생성자 안에서 만드세요.</b>' },
          { type: 'callout', kind: 'tip', title: '한 줄 정리: 대입(=)과 변경의 차이', html: '<ul><li><code>self.count += 1</code> → <b>대입</b>. 인스턴스에 새 변수가 생기고 클래스 변수는 그대로. (숫자 · 문자열 · 튜플은 값을 바꿀 수 없으므로 항상 이쪽)</li><li><code>self.scores.append(90)</code> → <b>변경</b>. 새 변수를 만들지 않고 클래스 변수가 가리키는 리스트를 직접 고침. (리스트 · 딕셔너리 · 집합)</li></ul>그래서 “클래스 변수는 숫자니까 안전하다” 가 아니라 <b>“공유해도 되는 값인가?”</b> 를 기준으로 판단해야 합니다.' },

          { type: 'h', text: '비공개 관례 — _name 과 __name' },
          { type: 'p', html: '자바 같은 언어에는 <code>private</code> 처럼 “밖에서 못 건드리게” 막는 장치가 있습니다. 파이썬에는 그런 강제 장치가 없고 대신 <b>이름 짓기 약속</b>을 씁니다.' },
          { type: 'list', items: [
            '<code>balance</code> — 공개. 누구나 읽고 써도 되는 값',
            '<code>_balance</code> — 밑줄 하나. “내부용이니 밖에서 건드리지 마세요” 라는 <b>약속</b>(막지는 않는다)',
            '<code>__pin</code> — 밑줄 둘. 파이썬이 이름을 <code>_클래스이름__pin</code> 으로 바꿔 버린다(<b>네임 맹글링, name mangling</b>)'
          ] },
          { type: 'code', title: '추가 예제. _변수 와 __변수', code: `class Account :
    def __init__(self, owner, balance) :
        self.owner = owner          # 공개
        self._balance = balance     # 관례상 비공개
        self.__pin = "1234"         # 네임 맹글링

    def getBalance(self) :
        return self._balance

acc = Account("홍길동", 10000)
print(acc.owner, acc.getBalance())
print(acc._balance)                 # 되긴 된다 (약속일 뿐)

try :
    print(acc.__pin)                # 이 이름으로는 찾을 수 없다
except AttributeError as e :
    print("오류 :", e)

print(acc._Account__pin)            # 실제로는 이 이름으로 저장되어 있다`,
            expect: `홍길동 10000
10000
오류 : 'Account' object has no attribute '__pin'
1234`,
            desc: '<code>__pin</code> 은 <code>_Account__pin</code> 으로 이름이 바뀌어 저장됩니다. 완전히 숨기는 것이 아니라 <b>실수로 덮어쓰는 것을 막는</b> 장치입니다(특히 상속받은 클래스에서 같은 이름을 쓸 때). 실무에서는 밑줄 하나(<code>_balance</code>)를 훨씬 많이 씁니다.' },

          { type: 'h', text: '@property — 필드처럼 쓰지만 검사는 하는 속성' },
          { type: 'p', html: '“속도는 0~150 사이여야 한다” 같은 규칙을 지키려면 <code>setSpeed()</code> 메서드를 만들어 쓰면 됩니다. 하지만 그러면 <code>car.speed = 60</code> 이라는 <b>자연스러운 문장</b>을 쓸 수 없습니다. <code>@property</code> 를 쓰면 <mark>겉보기에는 필드처럼 쓰면서 속으로는 메서드가 실행되게</mark> 할 수 있습니다.' },
          { type: 'code', title: '추가 예제. @property 로 값 검사하기', code: `class Car :
    def __init__(self, name) :
        self.name = name
        self._speed = 0            # 진짜 값은 _speed 에 둔다

    @property
    def speed(self) :              # 읽을 때 실행 (게터)
        return self._speed

    @speed.setter
    def speed(self, value) :       # 쓸 때 실행 (세터) — 여기서 검사!
        if value < 0 :
            print("속도는 0보다 작을 수 없습니다. 0으로 맞춥니다.")
            value = 0
        elif value > 150 :
            print("최고 속도는 150입니다. 150으로 맞춥니다.")
            value = 150
        self._speed = value

    @property
    def status(self) :             # 저장하지 않고 계산해서 돌려주는 속성
        return "정지" if self._speed == 0 else "주행 중"

car = Car("소나타")
car.speed = 60                     # 메서드가 아니라 필드처럼!
print(car.speed, car.status)
car.speed = 200
print(car.speed, car.status)
car.speed = -10
print(car.speed, car.status)`,
            expect: `60 주행 중
최고 속도는 150입니다. 150으로 맞춥니다.
150 주행 중
속도는 0보다 작을 수 없습니다. 0으로 맞춥니다.
0 정지`,
            desc: '<code>car.speed = 200</code> 이라고 썼을 뿐인데 세터가 실행되어 150 으로 조정되었습니다. <code>status</code> 처럼 <b>세터가 없는 property</b> 는 읽기 전용이 됩니다(<code>car.status = "정지"</code> 를 시도하면 AttributeError).' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 왜 처음부터 getter · setter 를 만들지 않을까', html: '자바에서는 필드를 모두 private 으로 막고 <code>getSpeed()</code> · <code>setSpeed()</code> 를 만드는 것이 기본입니다. 파이썬의 문화는 다릅니다.<ul><li>규칙이 필요 없으면 <b>그냥 공개 필드</b>로 둡니다. <code>car.speed = 60</code> 이 가장 읽기 좋습니다.</li><li>나중에 검사가 필요해지면 그때 <code>@property</code> 로 바꿉니다. <b>바깥 코드는 한 줄도 고치지 않아도 됩니다.</b></li></ul>즉 “혹시 몰라서 미리 게터 · 세터를 만들어 두는” 일은 하지 않습니다. 이것을 파이썬에서는 “필요해질 때까지 미룬다” 고 말합니다.' },

          { type: 'h', text: '클래스 변수를 다루는 클래스 메서드' },
          { type: 'p', html: '“지금까지 몇 대 생산했지?”, “집계를 처음부터 다시 세자” 처럼 <b>클래스 전체와 관련된 일</b>은 인스턴스가 아니라 클래스가 하는 것이 자연스럽습니다. 2교시에서 본 <code>@classmethod</code> 를 여기에 쓰면 딱 맞습니다.' },
          { type: 'code', title: '추가 예제. @classmethod 로 클래스 변수 다루기', code: `class Car :
    count = 0                      # 클래스 변수

    def __init__(self, name) :
        self.name = name
        Car.count += 1

    @classmethod
    def total(cls) :               # cls 는 Car 클래스 자신
        return cls.count

    @classmethod
    def reset(cls) :
        cls.count = 0

car1 = Car("아반떼")
car2 = Car("소나타")
print("생산 대수 :", Car.total())
Car.reset()
print("초기화 후 :", Car.total())`,
            expect: `생산 대수 : 2
초기화 후 : 0`,
            desc: '<code>cls.count = 0</code> 은 <code>Car.count = 0</code> 과 같습니다. 클래스 이름을 직접 쓰지 않았기 때문에 나중에 클래스 이름을 바꾸거나 상속해도 그대로 동작합니다. 인스턴스 없이 <code>Car.total()</code> 로 부를 수 있다는 점도 편리합니다.' }
        ],
        practice: [
          { title: '실습 12-8. 회원 수 세기', level: 1,
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
          { title: '실습 12-9. 공유 리스트 버그 고치기', level: 1,
            desc: '<p>아래 <code>Playlist</code> 클래스에는 버그가 있습니다. 하나와 두리가 각자 담은 노래가 <b>한 목록에 섞여</b> 버립니다. 원인을 찾아 고치세요. (클래스 안의 구조만 고치고 메인 코드는 그대로 둡니다)</p><pre><code>하나 : [\'봄날\', \'첫사랑\']\n두리 : [\'겨울바람\']</code></pre>',
            hint: '<code>songs = []</code> 가 클래스 변수라서 모든 인스턴스가 같은 리스트를 씁니다. 이 줄을 지우고 생성자 안에서 <code>self.songs = []</code> 로 새 리스트를 만드세요.',
            starter: `class Playlist :
    songs = []                  # 이 줄이 버그의 원인!

    def __init__(self, owner) :
        self.owner = owner
        # TODO: 여기서 songs 를 새로 만들기

    def add(self, title) :
        self.songs.append(title)

p1 = Playlist("하나")
p2 = Playlist("두리")
p1.add("봄날")
p1.add("첫사랑")
p2.add("겨울바람")
print(p1.owner, ":", p1.songs)
print(p2.owner, ":", p2.songs)
`,
            solution: `class Playlist :
    def __init__(self, owner) :
        self.owner = owner
        self.songs = []         # 인스턴스마다 새 리스트

    def add(self, title) :
        self.songs.append(title)

p1 = Playlist("하나")
p2 = Playlist("두리")
p1.add("봄날")
p1.add("첫사랑")
p2.add("겨울바람")
print(p1.owner, ":", p1.songs)
print(p2.owner, ":", p2.songs)
`,
            expect: `하나 : ['봄날', '첫사랑']
두리 : ['겨울바람']` },
          { title: '실습 12-10. 자동 번호 붙이기', level: 2,
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
총 3대 생산` },
          { title: '실습 12-11. @property 로 온도 클래스 만들기', level: 2,
            desc: '<p>섭씨온도를 다루는 <code>Temperature</code> 클래스를 만드세요.</p><ul><li>진짜 값은 <code>self._celsius</code> 에 저장하고, <code>celsius</code> 는 <code>@property</code> 로 만든다</li><li>세터에서 <b>-273 보다 낮은 값</b>이 들어오면 메시지를 출력하고 -273 으로 맞춘다</li><li><code>fahrenheit</code> 는 <b>읽기 전용</b> property — 저장하지 않고 <code>섭씨 * 9 / 5 + 32</code> 로 계산해 돌려준다</li></ul><pre><code>25 77.0\n100 212.0\n절대영도보다 낮을 수 없습니다. -273으로 맞춥니다.\n-273 -459.4</code></pre>',
            hint: '<code>@property</code> 아래에 <code>def celsius(self) : return self._celsius</code>, 그 아래에 <code>@celsius.setter</code> 와 같은 이름의 메서드를 하나 더 만듭니다. 생성자에서 <code>self.celsius = celsius</code> 라고 쓰면 세터를 거쳐 검사까지 됩니다.',
            starter: `class Temperature :
    def __init__(self, celsius = 0) :
        self.celsius = celsius      # 세터를 거친다

    # TODO: @property celsius (게터)
    # TODO: @celsius.setter celsius (검사)
    # TODO: @property fahrenheit (읽기 전용)

t = Temperature(25)
# print(t.celsius, t.fahrenheit)
`,
            solution: `class Temperature :
    def __init__(self, celsius = 0) :
        self.celsius = celsius      # 세터를 거친다

    @property
    def celsius(self) :
        return self._celsius

    @celsius.setter
    def celsius(self, value) :
        if value < -273 :
            print("절대영도보다 낮을 수 없습니다. -273으로 맞춥니다.")
            value = -273
        self._celsius = value

    @property
    def fahrenheit(self) :
        return self._celsius * 9 / 5 + 32

t = Temperature(25)
print(t.celsius, t.fahrenheit)
t.celsius = 100
print(t.celsius, t.fahrenheit)
t.celsius = -500
print(t.celsius, t.fahrenheit)
`,
            expect: `25 77.0
100 212.0
절대영도보다 낮을 수 없습니다. -273으로 맞춥니다.
-273 -459.4` },
          { title: '🚀 프로젝트 12-3. 도서 대출 관리', level: 3,
            desc: '<p>도서관의 책 한 권을 <code>Book</code> 클래스로 표현하고, <b>책마다 다른 값</b>(제목 · 지은이 · 빌린 사람)과 <b>도서관 전체의 값</b>(총 대출 횟수)을 구분해서 관리합니다. 인스턴스 변수와 클래스 변수를 제대로 나누는 것이 이 프로젝트의 핵심입니다.</p><p><b>요구 사항</b></p><ul><li>클래스 변수 <code>loanCount</code> — 지금까지 빌려 나간 <b>총 횟수</b> (모든 책이 함께 쓰는 값)</li><li>인스턴스 변수 <code>title</code>, <code>author</code>, <code>borrower</code>(빌린 사람, 없으면 <code>None</code>)</li><li><code>borrow(name)</code> — 이미 대출 중이면 <code>\'제목\'은(는) 이미 OOO님이 빌렸습니다.</code> 출력 후 종료. 아니면 빌린 사람을 기록하고 <code>loanCount</code> 를 1 늘린 뒤 <code>OOO님이 \'제목\'을(를) 빌렸습니다.</code> 출력</li><li><code>giveBack()</code> — 대출 중이 아니면 <code>\'제목\'은(는) 대출 중이 아닙니다.</code> 출력. 아니면 반납 메시지를 출력하고 <code>borrower</code> 를 <code>None</code> 으로</li><li><code>info()</code> — <code>제목 (지은이) - 대출 가능</code> 또는 <code>제목 (지은이) - OOO 대출 중</code> 문자열을 돌려준다</li><li><code>report()</code> — <b>클래스 메서드</b>(<code>@classmethod</code>)로 만들어 <code>[집계] 총 대출 횟수 : N회</code> 출력</li></ul><pre><code>홍길동님이 \'파이썬 입문\'을(를) 빌렸습니다.\n\'파이썬 입문\'은(는) 이미 홍길동님이 빌렸습니다.\n성춘향님이 \'알고리즘 산책\'을(를) 빌렸습니다.\n파이썬 입문 (김코딩) - 홍길동 대출 중\n홍길동님이 \'파이썬 입문\'을(를) 반납했습니다.\n\'파이썬 입문\'은(는) 대출 중이 아닙니다.\n파이썬 입문 (김코딩) - 대출 가능\n알고리즘 산책 (이자료) - 성춘향 대출 중\n[집계] 총 대출 횟수 : 2회</code></pre><p><b>여기까지 했다면 이렇게 더 해 보세요</b></p><ul><li>책마다 <code>history</code> 리스트를 두어 누가 언제 빌렸는지 기록하기 (⚠ 반드시 <b>생성자 안</b>에서 만들 것!)</li><li>책 여러 권을 리스트에 담고 <code>for</code> 문으로 “대출 가능한 책만” 출력하기</li><li>같은 사람이 3권 넘게 빌리지 못하게 막기 (사람 이름별 대출 수를 클래스 변수 딕셔너리로 관리)</li></ul>',
            hint: '<code>borrower</code> 가 <code>None</code> 인지로 대출 여부를 판단합니다(<code>if self.borrower is not None :</code>). 총 대출 횟수를 늘릴 때는 꼭 <code>Book.loanCount += 1</code> 처럼 <b>클래스 이름</b>으로 대입하세요. <code>self.loanCount += 1</code> 로 쓰면 책마다 따로 세어져 집계가 되지 않습니다.',
            starter: `class Book :
    loanCount = 0                 # 클래스 변수: 총 대출 횟수

    def __init__(self, title, author) :
        self.title = title
        self.author = author
        self.borrower = None      # 빌린 사람 (없으면 None)

    def borrow(self, name) :
        # TODO: 이미 대출 중이면 메시지 출력 후 return
        pass

    def giveBack(self) :
        # TODO: 대출 중이 아니면 메시지 출력 후 return
        pass

    def info(self) :
        # TODO: "제목 (지은이) - 대출 가능 / OOO 대출 중"
        return ""

    # TODO: @classmethod report(cls)

b1 = Book("파이썬 입문", "김코딩")
b2 = Book("알고리즘 산책", "이자료")

b1.borrow("홍길동")
b1.borrow("성춘향")
b2.borrow("성춘향")
print(b1.info())
b1.giveBack()
b1.giveBack()
print(b1.info())
print(b2.info())
`,
            solution: `class Book :
    loanCount = 0                 # 클래스 변수: 총 대출 횟수

    def __init__(self, title, author) :
        self.title = title
        self.author = author
        self.borrower = None      # 빌린 사람 (없으면 None)

    def borrow(self, name) :
        if self.borrower is not None :
            print("'%s'은(는) 이미 %s님이 빌렸습니다." % (self.title, self.borrower))
            return
        self.borrower = name
        Book.loanCount += 1
        print("%s님이 '%s'을(를) 빌렸습니다." % (name, self.title))

    def giveBack(self) :
        if self.borrower is None :
            print("'%s'은(는) 대출 중이 아닙니다." % self.title)
            return
        print("%s님이 '%s'을(를) 반납했습니다." % (self.borrower, self.title))
        self.borrower = None

    def info(self) :
        if self.borrower is None :
            state = "대출 가능"
        else :
            state = self.borrower + " 대출 중"
        return "%s (%s) - %s" % (self.title, self.author, state)

    @classmethod
    def report(cls) :
        print("[집계] 총 대출 횟수 : %d회" % cls.loanCount)

b1 = Book("파이썬 입문", "김코딩")
b2 = Book("알고리즘 산책", "이자료")

b1.borrow("홍길동")
b1.borrow("성춘향")
b2.borrow("성춘향")
print(b1.info())
b1.giveBack()
b1.giveBack()
print(b1.info())
print(b2.info())
Book.report()
`,
            expect: `홍길동님이 '파이썬 입문'을(를) 빌렸습니다.
'파이썬 입문'은(는) 이미 홍길동님이 빌렸습니다.
성춘향님이 '알고리즘 산책'을(를) 빌렸습니다.
파이썬 입문 (김코딩) - 홍길동 대출 중
홍길동님이 '파이썬 입문'을(를) 반납했습니다.
'파이썬 입문'은(는) 대출 중이 아닙니다.
파이썬 입문 (김코딩) - 대출 가능
알고리즘 산책 (이자료) - 성춘향 대출 중
[집계] 총 대출 횟수 : 2회` }
        ],
        quiz: [
          { q: '모든 인스턴스가 함께 사용하는, 클래스에 하나만 있는 변수는?', options: ['인스턴스 변수', '지역 변수', '클래스 변수', '매개변수'], answer: 2,
            explain: '클래스 변수는 클래스 안에 공간이 하나만 할당되어 모든 인스턴스가 공유합니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>class Car :\n    count = 0\n    def __init__(self) :\n        Car.count += 1\n\na = Car()\nb = Car()\nc = Car()\nprint(a.count)</code></pre>', options: ['0', '1', '3', '오류'], answer: 2,
            explain: 'Car.count 는 세 번 증가하여 3 입니다. a 에는 count 가 없으므로 클래스 변수 3 을 읽습니다.' },
          { q: '위 코드에서 생성자를 <code>self.count += 1</code> 로 바꾸면 <code>print(Car.count)</code> 의 결과는?', options: ['0', '1', '3', '오류'], answer: 0,
            explain: '<code>self.count = self.count + 1</code> 은 인스턴스에 새 변수를 만들 뿐, 클래스 변수는 0 그대로입니다.' },
          { q: '인스턴스 변수에 대한 설명으로 옳은 것은?', options: ['클래스에 하나만 존재한다', '인스턴스마다 따로 존재한다', '반드시 클래스명.변수 로 사용한다', '생성자 안에서는 만들 수 없다'], answer: 1,
            explain: '인스턴스 변수는 인스턴스마다 따로 생기며, 보통 <code>self.변수</code> 로 사용합니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>class Student :\n    scores = []\n    def __init__(self, name) :\n        self.name = name\n    def addScore(self, s) :\n        self.scores.append(s)\n\na = Student("하나")\nb = Student("두리")\na.addScore(90)\nb.addScore(70)\nprint(a.scores)</code></pre>',
            options: ['[90]', '[70]', '[90, 70]', '오류'], answer: 2,
            explain: '<code>append()</code> 는 <b>대입이 아니라 변경</b>이라서 새 인스턴스 변수를 만들지 않고 <b>공유 리스트</b>를 직접 고칩니다. 두 학생의 점수가 한 리스트에 섞입니다. 고치려면 생성자 안에서 <code>self.scores = []</code> 를 만들어야 합니다.' },
          { q: '<code>@property</code> 에 대한 설명으로 옳은 것은?', options: ['클래스 변수를 만드는 장식자이다', '메서드를 필드처럼 쓸 수 있게 해 주어, 읽고 쓸 때 검사·계산을 끼워 넣을 수 있다', '필드를 완전히 감춰서 밖에서 못 읽게 만든다', '상속을 막는 기능이다'], answer: 1,
            explain: '<code>car.speed = 200</code> 처럼 <b>필드를 쓰는 문장 그대로</b> 두고도 세터 안에서 값을 검사할 수 있습니다. 밑줄로 시작하는 이름(<code>_speed</code>)은 “내부용” 이라는 약속일 뿐 접근을 막지는 못합니다.' }
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
          { layout: 'code', title: '⚠ 리스트 클래스 변수는 점수가 섞인다', code: `class Student :
    scores = []              # 모든 학생이 함께 쓴다!

    def __init__(self, name) :
        self.name = name

    def addScore(self, score) :
        self.scores.append(score)

s1 = Student("김하나")
s2 = Student("이두리")
s1.addScore(90)
s2.addScore(70)

print("김하나 :", s1.scores)
print("이두리 :", s2.scores)
print(s1.scores is s2.scores)`,
            points: ['<code>append()</code> 는 대입이 아니라 <b>변경</b>', '새 변수를 만들지 않고 공유 리스트를 고친다', '결과: 두 학생 모두 [90, 70]', '해결: 생성자에서 <code>self.scores = []</code>'],
            notes: '<p>📘 보충(중급). 오류 메시지가 없어서 실무에서도 자주 나는 버그입니다.</p><p>실행 결과를 예측하게 한 뒤 보여 주세요. 대부분 [90] 이라고 답합니다.</p><p>고친 코드를 그 자리에서 함께 만들어 보고 False 가 나오는 것까지 확인합니다.</p><p>(5분)</p>' },
          { layout: 'two', title: '대입(=) 과 변경의 차이', left: { title: '대입 — 새 인스턴스 변수가 생긴다', code: `class Car :
    count = 0
    def __init__(self) :
        self.count += 1     # 대입!

a = Car()
b = Car()
print(a.count, Car.count)` },
            right: { title: '변경 — 공유 객체를 직접 고친다', code: `class Car :
    tags = []
    def add(self, t) :
        self.tags.append(t)   # 변경!

a = Car()
b = Car()
a.add("빨강")
print(a.tags, b.tags)` },
            notes: '<p>왼쪽 출력은 <code>1 0</code>, 오른쪽 출력은 <code>[\'빨강\'] [\'빨강\']</code> 입니다. 똑같이 <code>self.</code> 로 시작하는데 결과가 정반대라는 점이 핵심입니다.</p><p>정리 한 문장: <b>“= 는 새로 만들고, append 는 원래 것을 고친다.”</b></p><p>판단 기준: 숫자 · 문자열 · 튜플은 항상 대입, 리스트 · 딕셔너리 · 집합은 변경이 가능합니다.</p><p>(4분)</p>' },
          { layout: 'code', title: '비공개 관례: _name 과 __name', code: `class Account :
    def __init__(self, owner, balance) :
        self.owner = owner          # 공개
        self._balance = balance     # 관례상 비공개
        self.__pin = "1234"         # 네임 맹글링

acc = Account("홍길동", 10000)
print(acc.owner, acc._balance)

try :
    print(acc.__pin)
except AttributeError as e :
    print("오류 :", e)

print(acc._Account__pin)`,
            points: ['파이썬에는 private 강제 장치가 없다', '<code>_이름</code>: “건드리지 마세요” 라는 약속', '<code>__이름</code>: <code>_클래스__이름</code> 으로 바뀐다', '숨기는 게 아니라 <b>실수를 막는</b> 장치'],
            notes: '<p>📘 보충(중급). 실무에서는 밑줄 하나를 훨씬 많이 씁니다.</p><p>발문: “막지도 못하는데 왜 쓸까요?” → 코드를 읽는 사람에게 주는 신호. 파이썬은 “우리는 모두 어른이다(we are all consenting adults)” 라는 문화를 가지고 있다고 소개해도 좋습니다.</p><p>(3분)</p>' },
          { layout: 'code', title: '@property — 필드처럼 쓰고 검사는 하고', code: `class Car :
    def __init__(self, name) :
        self.name = name
        self._speed = 0

    @property
    def speed(self) :           # 읽을 때
        return self._speed

    @speed.setter
    def speed(self, value) :    # 쓸 때 — 검사!
        if value > 150 :
            print("최고 속도는 150입니다.")
            value = 150
        self._speed = value

car = Car("소나타")
car.speed = 60
print(car.speed)
car.speed = 200
print(car.speed)`,
            points: ['<code>car.speed = 200</code> → 세터가 실행된다', '진짜 값은 <code>_speed</code> 에 보관', '세터가 없으면 <b>읽기 전용</b> 속성', '나중에 규칙이 생겨도 바깥 코드는 그대로'],
            notes: '<p>📘 보충(중급). 자바식 getSpeed()/setSpeed() 와 비교해 주세요. 파이썬은 <b>필요해질 때</b> property 로 바꿉니다.</p><p>발문: “<code>car.speed = 200</code> 한 줄이 어떻게 150 이 될까요?” → 대입문이 메서드 호출로 바뀐다는 점이 놀라움 포인트입니다.</p><p>(5분)</p>' },
          { layout: 'code', title: '@classmethod 로 클래스 변수 다루기', code: `class Car :
    count = 0

    def __init__(self, name) :
        self.name = name
        Car.count += 1

    @classmethod
    def total(cls) :
        return cls.count

    @classmethod
    def reset(cls) :
        cls.count = 0

car1 = Car("아반떼")
car2 = Car("소나타")
print("생산 대수 :", Car.total())
Car.reset()
print("초기화 후 :", Car.total())`,
            points: ['<code>cls</code> = 클래스 자신 (<code>cls.count</code> = <code>Car.count</code>)', '“클래스 전체와 관련된 일” 은 클래스 메서드로', '인스턴스 없이 <code>Car.total()</code> 로 호출'],
            notes: '<p>2교시의 대체 생성자에 이어 <code>@classmethod</code> 의 두 번째 쓰임입니다.</p><p>발문: “집계를 인스턴스 메서드로 만들면 무엇이 불편할까요?” → 세기 위해 자동차를 한 대 만들어야 합니다.</p><p>(3분)</p>' },
          { layout: 'practice', title: '🚀 프로젝트 12-3. 도서 대출 관리', desc: '책마다 다른 값(제목 · 빌린 사람)은 인스턴스 변수로, 도서관 전체 값(총 대출 횟수)은 클래스 변수로 관리하세요.',
            starter: `class Book :
    loanCount = 0
    def __init__(self, title) :
        self.title = title
        self.borrower = None
    # TODO: borrow(name), giveBack(), report()

b1 = Book("파이썬 입문")
b1.borrow("홍길동")
`,
            solution: `class Book :
    loanCount = 0

    def __init__(self, title) :
        self.title = title
        self.borrower = None

    def borrow(self, name) :
        if self.borrower is not None :
            print("이미 %s님이 빌렸습니다." % self.borrower)
            return
        self.borrower = name
        Book.loanCount += 1
        print("%s님이 '%s'을(를) 빌렸습니다." % (name, self.title))

    @classmethod
    def report(cls) :
        print("총 대출 횟수 :", cls.loanCount)

b1 = Book("파이썬 입문")
b1.borrow("홍길동")
b1.borrow("성춘향")
Book.report()
`,
            notes: '<p>학생 문서의 프로젝트는 반납 · 상태 출력까지 포함합니다. 슬라이드는 대출과 집계만 줄인 버전입니다.</p><p>지도 포인트: <code>Book.loanCount += 1</code> 을 <code>self.loanCount += 1</code> 로 쓰면 집계가 안 되는 것을 꼭 실험해 보게 하세요.</p><p>(8분)</p>' },
          { layout: 'quiz', title: '확인 문제', q: 'count = 0 인 클래스 변수를 생성자에서 Car.count += 1 로 증가시킬 때,<br>a, b, c 세 인스턴스를 만든 뒤 print(a.count) 의 결과는?', options: ['0', '1', '3', '오류'], answer: 2,
            explain: '클래스 변수는 공유되므로 3 입니다.',
            notes: '<p>이어서 “Car.count 대신 self.count 라면?” 을 구두로 물어 앞 슬라이드를 복습합니다(답: a.count 는 1, Car.count 는 0).</p><p>(2분)</p>' },
          { layout: 'practice', title: '실습 12-8. 회원 수 세기', desc: '클래스 변수 total 로 가입한 회원 수를 세고, 가입할 때마다 “가입 : 이름 (총 N명)” 을 출력하세요.',
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
            notes: '<p>빠른 학생에게는 실습 12-10(자동 번호 붙이기)을 이어서 하게 합니다.</p><p>(5분)</p>' },
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
          'super() 로 슈퍼 클래스의 메서드나 속성을 사용할 수 있다',
          '덕 타이핑과 다형성을 설명하고, 상속(is-a)과 컴포지션(has-a)을 구분해 선택할 수 있다'
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
          { type: 'callout', kind: 'warn', title: '부모 생성자 호출을 잊으면', html: '위 예제에서 <code>8행</code>을 지우면 sedan1 에는 color, speed 가 만들어지지 않아 <code>AttributeError: \'Sedan\' object has no attribute \'color\'</code> 오류가 납니다.' },

          { type: 'h', text: 'super() 가 찾아가는 길 — MRO 맛보기' },
          { type: 'p', html: '상속은 여러 단계로 이어질 수 있습니다(Car → Sedan → Sonata). 이때 파이썬은 메서드를 찾을 순서를 미리 정해 두는데, 이것을 <b>MRO</b>(Method Resolution Order, 메서드 결정 순서)라고 합니다. <code>클래스.__mro__</code> 로 직접 볼 수 있습니다.' },
          { type: 'code', title: '추가 예제. super() 를 따라가는 3단계 상속', code: `class Car :
    def info(self) :
        return "자동차"

class Sedan(Car) :
    def info(self) :
        return "승용차 ← " + super().info()

class Sonata(Sedan) :
    def info(self) :
        return "소나타 ← " + super().info()

s = Sonata()
print(s.info())
print(" → ".join(c.__name__ for c in Sonata.__mro__))
print(isinstance(s, Car), issubclass(Sonata, Car))`,
            expect: `소나타 ← 승용차 ← 자동차
Sonata → Sedan → Car → object
True True`,
            desc: '<code>super()</code> 는 “부모” 가 아니라 정확히는 <b>MRO 에서 나 다음 차례</b>를 가리킵니다. Sonata 의 super() 는 Sedan, Sedan 의 super() 는 Car 입니다. 맨 끝의 <code>object</code> 는 모든 클래스의 조상입니다 — 아무 상속도 쓰지 않은 클래스도 사실 object 를 상속받고 있습니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 다중 상속과 믹스인', html: '파이썬은 부모를 여러 개 둘 수도 있습니다: <code>class C(A, B) :</code>. 이때 MRO 는 <b>왼쪽부터</b> 살펴봅니다(C → A → B → object). 편리하지만 관계가 복잡해지면 “이 메서드가 어디에서 왔지?” 를 알기 어려워집니다.<br>실무에서는 “기능 한 조각만 얹어 주는” 작은 클래스를 하나 더 붙이는 <b>믹스인(mixin)</b> 정도로만 쓰는 경우가 많습니다. 예를 들어 <code>class Car(LoggingMixin, Vehicle) :</code> 처럼 기록 기능만 얹는 식입니다. 초보자라면 <b>부모는 하나</b>로 두는 것이 안전합니다.' },

          { type: 'h', text: '덕 타이핑과 다형성 — 상속이 없어도 된다' },
          { type: 'p', html: '<b>다형성(polymorphism)</b>은 <mark>같은 이름의 메서드를 불렀을 때 대상에 따라 다르게 동작하는 성질</mark>입니다. 오버라이딩이 바로 다형성의 한 모습이죠. 그런데 파이썬에서는 <b>상속 관계가 없어도</b> 다형성이 됩니다.' },
          { type: 'p', html: '“오리처럼 꽥꽥거리고 오리처럼 걷는다면 그것은 오리다” 라는 말에서 온 <b>덕 타이핑(duck typing)</b> 때문입니다. 파이썬은 “이 객체가 어떤 클래스인가?” 를 따지지 않고 <mark>“내가 부르려는 메서드를 가지고 있는가?” 만 확인</mark>합니다.' },
          { type: 'code', title: '추가 예제. 상속 없이도 되는 다형성', code: `class Dog :
    def speak(self) :
        return "멍멍"

class Cat :
    def speak(self) :
        return "야옹"

class Robot :            # Dog · Cat 과 아무 상속 관계가 없다!
    def speak(self) :
        return "삐빅"

for thing in [Dog(), Cat(), Robot()] :
    print(thing.speak())

def introduce(who) :
    print("이 친구는", who.speak(), "하고 말합니다.")

introduce(Robot())`,
            expect: `멍멍
야옹
삐빅
이 친구는 삐빅 하고 말합니다.`,
            desc: '<code>introduce()</code> 는 “speak() 를 가진 무언가” 면 무엇이든 받습니다. 그래서 파이썬에서는 <code>isinstance()</code> 로 종류를 검사하기보다 <b>필요한 메서드를 가졌는지</b>에 기대어 코드를 씁니다. 다만 공통 규칙을 분명히 하고 싶을 때는 상속(또는 6교시의 추상 클래스)이 더 좋습니다.' },

          { type: 'h', text: '상속이냐 컴포지션이냐 — 선택 기준' },
          { type: 'p', html: '초보자가 가장 많이 하는 실수가 <b>상속을 너무 많이 쓰는 것</b>입니다. 판단 기준은 간단합니다. 두 문장 중 어느 쪽이 자연스러운지 소리 내어 읽어 보세요.' },
          { type: 'table', caption: '상속(is-a) 과 컴포지션(has-a)', head: ['', '상속 (inheritance)', '컴포지션 (composition)'], rows: [
            ['읽어 보는 문장', '“승용차<b>는</b> 자동차<b>이다</b>” (is-a)', '“자동차<b>는</b> 엔진<b>을 가진다</b>” (has-a)'],
            ['코드 모양', '<code>class Sedan(Car) :</code>', '<code>self.engine = Engine(300)</code>'],
            ['부모가 바뀌면', '자식이 모두 영향을 받는다', '부품만 갈아 끼우면 된다'],
            ['바꾸기', '실행 중에 부모를 바꿀 수 없다', '실행 중에 다른 부품으로 교체 가능'],
            ['알맞은 때', '같은 종류의 변형(승용차 · 트럭)', '서로 다른 것의 조합(자동차 + 엔진)']
          ] },
          { type: 'code', title: '추가 예제. 상속과 컴포지션을 나란히 보기', code: `## 상속: 승용차는 자동차이다 ##
class Car :
    def __init__(self, name) :
        self.name = name

    def run(self) :
        print("%s 달립니다." % self.name)

class Sedan(Car) :
    pass

## 컴포지션: 자동차는 엔진을 가진다 ##
class Engine :
    def __init__(self, power) :
        self.power = power

    def start(self) :
        print("%d마력 엔진 시동" % self.power)

class Truck :
    def __init__(self, name, engine) :
        self.name = name
        self.engine = engine        # 다른 객체를 부품으로 가진다

    def run(self) :
        self.engine.start()
        print("%s 달립니다." % self.name)

Sedan("소나타").run()
Truck("11톤 트럭", Engine(300)).run()`,
            expect: `소나타 달립니다.
300마력 엔진 시동
11톤 트럭 달립니다.`,
            desc: 'Truck 은 Engine 을 <b>가지고</b> 있을 뿐이어서, 전기 모터 클래스를 만들어 넣으면 Truck 코드를 고치지 않고도 전기 트럭이 됩니다. 반면 상속은 관계가 고정됩니다. 실무 격언으로 <b>“상속보다 컴포지션을 먼저 생각하라”</b> 는 말이 있습니다.' }
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
          { title: '실습 12-12. 스마트폰 클래스 (상속과 부모 생성자)', level: 1,
            desc: '<p>전화번호(number)를 가지고 <code>call(to)</code> 로 전화를 거는 <code>Phone</code> 클래스와, 이것을 상속받는 <code>SmartPhone</code> 클래스를 만드세요. SmartPhone 은 생성자에서 <b>부모 생성자를 부른 뒤</b> 앱 이름(app)을 추가로 저장하고, <code>run()</code> 메서드로 앱을 실행합니다.</p><pre><code>010-1111-2222 → 119 전화를 겁니다.\n010-3333-4444 → 119 전화를 겁니다.\n지도 앱을 실행합니다.</code></pre>',
            hint: '<code>class SmartPhone(Phone) :</code> 의 생성자 첫 줄에 <code>super().__init__(number)</code> 를 씁니다. 이 줄을 빼면 <code>self.number</code> 가 없어서 AttributeError 가 납니다.',
            starter: `class Phone :
    def __init__(self, number) :
        self.number = number

    def call(self, to) :
        print("%s → %s 전화를 겁니다." % (self.number, to))

# TODO: class SmartPhone(Phone) - 생성자(number, app), run()

p = Phone("010-1111-2222")
p.call("119")
# s = SmartPhone("010-3333-4444", "지도")
# s.call("119")
# s.run()
`,
            solution: `class Phone :
    def __init__(self, number) :
        self.number = number

    def call(self, to) :
        print("%s → %s 전화를 겁니다." % (self.number, to))

class SmartPhone(Phone) :
    def __init__(self, number, app) :
        super().__init__(number)      # 부모가 number 를 저장하게 한다
        self.app = app

    def run(self) :
        print("%s 앱을 실행합니다." % self.app)

p = Phone("010-1111-2222")
s = SmartPhone("010-3333-4444", "지도")
p.call("119")
s.call("119")
s.run()
`,
            expect: `010-1111-2222 → 119 전화를 겁니다.
010-3333-4444 → 119 전화를 겁니다.
지도 앱을 실행합니다.` },
          { title: '실습 12-13. 동물 울음소리 (오버라이딩)', level: 2,
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
나비: 야옹~` },
          { title: '실습 12-14. 상속 대신 컴포지션으로 컴퓨터 조립하기', level: 2,
            desc: '<p>컴퓨터는 CPU<b>이지</b> 않습니다. 컴퓨터는 CPU 와 메모리를 <b>가지고</b> 있습니다. 이런 관계는 상속이 아니라 <b>컴포지션</b>으로 만듭니다.</p><ul><li><code>CPU</code> 클래스 — 이름(name), <code>calc()</code> 가 <code>"i7 가 계산합니다."</code> 문자열을 돌려준다</li><li><code>Memory</code> 클래스 — 크기(size), <code>load()</code> 가 <code>"16GB 메모리에 올립니다."</code> 문자열을 돌려준다</li><li><code>Computer</code> 클래스 — 주인(owner)과 <b>CPU 인스턴스 · Memory 인스턴스를 받아서 필드로 가진다</b>. <code>boot()</code> 는 아래 형식으로 출력한다</li></ul><pre><code>--- 하나의 컴퓨터 ---\n16GB 메모리에 올립니다.\ni7 가 계산합니다.\n--- 두리의 컴퓨터 ---\n8GB 메모리에 올립니다.\nM3 가 계산합니다.</code></pre>',
            hint: '<code>Computer("하나", CPU("i7"), Memory(16))</code> 처럼 <b>다른 클래스의 인스턴스를 인수로</b> 넘깁니다. 생성자에서는 <code>self.cpu = cpu</code> 로 받아 두고, <code>boot()</code> 안에서 <code>self.cpu.calc()</code> 처럼 씁니다.',
            starter: `class CPU :
    def __init__(self, name) :
        self.name = name
    def calc(self) :
        return "%s 가 계산합니다." % self.name

class Memory :
    def __init__(self, size) :
        self.size = size
    def load(self) :
        return "%dGB 메모리에 올립니다." % self.size

# TODO: class Computer - owner, cpu, memory 를 받고 boot() 출력

# pc = Computer("하나", CPU("i7"), Memory(16))
# pc.boot()
`,
            solution: `class CPU :
    def __init__(self, name) :
        self.name = name
    def calc(self) :
        return "%s 가 계산합니다." % self.name

class Memory :
    def __init__(self, size) :
        self.size = size
    def load(self) :
        return "%dGB 메모리에 올립니다." % self.size

class Computer :
    def __init__(self, owner, cpu, memory) :
        self.owner = owner
        self.cpu = cpu              # 부품을 '가진다'
        self.memory = memory

    def boot(self) :
        print("--- %s의 컴퓨터 ---" % self.owner)
        print(self.memory.load())
        print(self.cpu.calc())

pc = Computer("하나", CPU("i7"), Memory(16))
pc.boot()
note = Computer("두리", CPU("M3"), Memory(8))
note.boot()
`,
            expect: `--- 하나의 컴퓨터 ---
16GB 메모리에 올립니다.
i7 가 계산합니다.
--- 두리의 컴퓨터 ---
8GB 메모리에 올립니다.
M3 가 계산합니다.` },
          { title: '🚀 프로젝트 12-4. RPG 캐릭터 전투 시뮬레이션', level: 3,
            desc: '<p>상속 · 오버라이딩 · <code>super()</code> 를 모두 쓰는 턴제 전투를 만듭니다. 공통 규칙은 부모 <code>Character</code> 에, 직업별 특기는 자식 클래스에 둡니다.</p><p><b>요구 사항</b></p><ul><li><code>Character</code> — 필드 <code>name</code>, <code>hp</code>, <code>power</code><ul><li><code>isAlive()</code> — 체력이 0보다 크면 True</li><li><code>attack(other)</code> — <code>OOO의 공격! XXX에게 N 피해</code> 출력 후 <code>other.damaged(N)</code></li><li><code>damaged(amount)</code> — 체력을 깎고, 0 이하면 0으로 맞춘 뒤 <code>  OOO 쓰러짐!</code>, 아니면 <code>  OOO 남은 체력 N</code> 출력 (앞에 공백 두 칸)</li></ul></li><li><code>Warrior(Character)</code> — <code>attack()</code> 오버라이딩: 피해가 <b>power 의 2배</b>이고 <code>OOO의 강타!</code> 로 출력</li><li><code>Wizard(Character)</code> — 생성자에 <code>mp</code> 추가(<code>super().__init__</code> 사용). <code>attack()</code> 오버라이딩: MP 가 10 이상이면 10 을 쓰고 <b>power 의 3배</b> 피해로 <code>OOO의 파이어볼! XXX에게 N 피해 (남은 MP N)</code>, 부족하면 <code>OOO는 지팡이로 때립니다.</code> 를 출력하고 <code>super().attack(other)</code> 로 평범하게 공격</li><li>전사(hp 100, power 10)와 마법사(hp 80, power 8, mp 25)가 <b>전사부터</b> 번갈아 공격. 한쪽이 쓰러지면 즉시 끝내고 승자를 출력</li></ul><pre><code>[1턴]\n전사의 강타! 마법사에게 20 피해\n  마법사 남은 체력 60\n마법사의 파이어볼! 전사에게 24 피해 (남은 MP 15)\n  전사 남은 체력 76\n…\n[4턴]\n전사의 강타! 마법사에게 20 피해\n  마법사 쓰러짐!\n승자 : 전사</code></pre><p><b>여기까지 했다면 이렇게 더 해 보세요</b></p><ul><li>도적(Thief) 클래스를 추가해 2턴마다 두 번 공격하게 하기</li><li><code>random</code> 으로 피해에 ±20% 를 섞어 매번 다른 전투 만들기</li><li>회복 물약을 가진 <code>Priest</code> 를 만들고, 파티(리스트)끼리 싸우게 하기</li></ul>',
            hint: '<code>damaged()</code> 는 <b>부모에만</b> 만들면 모든 직업이 물려받습니다. 마법사의 <code>attack()</code> 에서 MP 가 부족할 때는 <code>super().attack(other)</code> 한 줄로 부모의 평범한 공격을 그대로 씁니다. 전투 반복은 <code>while hero.isAlive() and enemy.isAlive() :</code>.',
            starter: `class Character :
    def __init__(self, name, hp, power) :
        self.name = name
        self.hp = hp
        self.power = power

    def isAlive(self) :
        return self.hp > 0

    def attack(self, other) :
        # TODO: 공격 메시지 출력 후 other.damaged(self.power)
        pass

    def damaged(self, amount) :
        # TODO: 체력 깎기, 0 이하면 쓰러짐 메시지
        pass

# TODO: class Warrior(Character) - 강타 (2배)
# TODO: class Wizard(Character) - mp, 파이어볼 (3배, MP 10 소모)

hero = Character("전사", 100, 10)
enemy = Character("마법사", 80, 8)
# TODO: 턴제 전투 반복 + 승자 출력
`,
            solution: `class Character :
    def __init__(self, name, hp, power) :
        self.name = name
        self.hp = hp
        self.power = power

    def isAlive(self) :
        return self.hp > 0

    def attack(self, other) :
        print("%s의 공격! %s에게 %d 피해" % (self.name, other.name, self.power))
        other.damaged(self.power)

    def damaged(self, amount) :
        self.hp -= amount
        if self.hp <= 0 :
            self.hp = 0
            print("  %s 쓰러짐!" % self.name)
        else :
            print("  %s 남은 체력 %d" % (self.name, self.hp))

class Warrior(Character) :
    def attack(self, other) :
        power = self.power * 2
        print("%s의 강타! %s에게 %d 피해" % (self.name, other.name, power))
        other.damaged(power)

class Wizard(Character) :
    def __init__(self, name, hp, power, mp) :
        super().__init__(name, hp, power)
        self.mp = mp

    def attack(self, other) :
        if self.mp >= 10 :
            self.mp -= 10
            power = self.power * 3
            print("%s의 파이어볼! %s에게 %d 피해 (남은 MP %d)" % (self.name, other.name, power, self.mp))
            other.damaged(power)
        else :
            print("%s는 지팡이로 때립니다." % self.name)
            super().attack(other)

hero = Warrior("전사", 100, 10)
enemy = Wizard("마법사", 80, 8, 25)

turn = 1
while hero.isAlive() and enemy.isAlive() :
    print("[%d턴]" % turn)
    hero.attack(enemy)
    if not enemy.isAlive() :
        break
    enemy.attack(hero)
    turn += 1

if hero.isAlive() :
    print("승자 :", hero.name)
else :
    print("승자 :", enemy.name)
`,
            expect: `[1턴]
전사의 강타! 마법사에게 20 피해
  마법사 남은 체력 60
마법사의 파이어볼! 전사에게 24 피해 (남은 MP 15)
  전사 남은 체력 76
[2턴]
전사의 강타! 마법사에게 20 피해
  마법사 남은 체력 40
마법사의 파이어볼! 전사에게 24 피해 (남은 MP 5)
  전사 남은 체력 52
[3턴]
전사의 강타! 마법사에게 20 피해
  마법사 남은 체력 20
마법사는 지팡이로 때립니다.
마법사의 공격! 전사에게 8 피해
  전사 남은 체력 44
[4턴]
전사의 강타! 마법사에게 20 피해
  마법사 쓰러짐!
승자 : 전사` }
        ],
        quiz: [
          { q: '<code>class Sedan(Car) :</code> 에서 Car 를 무엇이라고 하는가?', options: ['서브 클래스', '슈퍼 클래스', '인스턴스', '생성자'], answer: 1,
            explain: '괄호 안의 Car 는 물려주는 쪽인 슈퍼(부모) 클래스, Sedan 은 서브(자식) 클래스입니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>class A :\n    def hello(self) :\n        print("A")\nclass B(A) :\n    def hello(self) :\n        print("B")\nclass C(A) :\n    pass\n\nB().hello()\nC().hello()</code></pre>', options: ['A 다음 A', 'B 다음 B', 'B 다음 A', 'A 다음 B'], answer: 2,
            explain: 'B 는 hello() 를 오버라이딩했으므로 “B”, C 는 오버라이딩하지 않았으므로 A 의 “A” 가 출력됩니다.' },
          { q: '서브 클래스의 메서드 안에서 슈퍼 클래스의 같은 이름 메서드를 실행하는 방법은?', options: ['self.method()', 'super().method()', 'sub().method()', 'parent.method()'], answer: 1,
            explain: '<code>super()</code> 는 부모 클래스를 가리킵니다. <code>self.method()</code> 는 자기 자신의 (오버라이딩된) 메서드를 다시 부르게 됩니다.' },
          { q: '메서드 오버라이딩에 대한 설명으로 옳은 것은?', options: ['슈퍼 클래스의 메서드를 서브 클래스에서 다시 정의하는 것', '같은 클래스에 이름이 같은 메서드를 여러 개 만드는 것', '클래스 변수를 인스턴스 변수로 바꾸는 것', '인스턴스를 삭제하는 것'], answer: 0,
            explain: '오버라이딩 = 물려받은 메서드를 서브 클래스에서 재정의하는 것입니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>class A :\n    def __init__(self, x) :\n        self.x = x\n\nclass B(A) :\n    def __init__(self, x, y) :\n        self.y = y\n\nb = B(1, 2)\nprint(b.y)\nprint(b.x)</code></pre>',
            options: ['2 다음 1', '2 를 출력한 뒤 AttributeError', '1 다음 2', 'B(1, 2) 에서 바로 오류'], answer: 1,
            explain: '서브 클래스에 생성자를 만들면 부모 생성자는 <b>자동으로 불리지 않습니다</b>. <code>super().__init__(x)</code> 를 빼먹어 <code>self.x</code> 가 만들어지지 않았으므로 <code>b.x</code> 에서 AttributeError 가 납니다.' },
          { q: '다음 중 <b>상속(is-a)</b> 보다 <b>컴포지션(has-a)</b> 으로 만드는 것이 자연스러운 관계는?', options: ['승용차 — 자동차', '고양이 — 동물', '자동차 — 엔진', '정사각형 — 직사각형'], answer: 2,
            explain: '“자동차는 엔진<b>이다</b>” 는 이상하고 “자동차는 엔진을 <b>가진다</b>” 가 자연스럽습니다. 이런 관계는 <code>self.engine = Engine(…)</code> 처럼 부품으로 가집니다. 나머지는 모두 “A 는 B 이다” 가 성립하는 상속 관계입니다.' }
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
          { layout: 'code', title: '부모 생성자 호출: super().__init__()', code: `class Car :
    def __init__(self, color, speed) :
        self.color = color
        self.speed = speed

class Sedan(Car) :
    def __init__(self, color, speed, seatNum) :
        super().__init__(color, speed)   # 부모가 할 일은 부모에게
        self.seatNum = seatNum           # 내 것만 추가

sedan1 = Sedan("흰색", 0, 5)
print(sedan1.color, sedan1.speed, sedan1.seatNum)`,
            points: ['서브 클래스에 생성자를 만들면 <b>부모 생성자는 자동 호출되지 않는다</b>', '<code>super().__init__(…)</code> 로 직접 부른다', '빼먹으면 <code>AttributeError</code>'],
            notes: '<p>학생들이 가장 많이 틀리는 지점입니다. 9행을 지우고 실행해 <code>\'Sedan\' object has no attribute \'color\'</code> 를 꼭 보여 주세요.</p><p>5교시 [프로그램 2]의 <code>Shape.__init__(self)</code> 와 같은 일이라는 것도 예고합니다.</p><p>(4분)</p>' },
          { layout: 'code', title: 'super() 가 찾아가는 길 (MRO)', code: `class Car :
    def info(self) :
        return "자동차"

class Sedan(Car) :
    def info(self) :
        return "승용차 ← " + super().info()

class Sonata(Sedan) :
    def info(self) :
        return "소나타 ← " + super().info()

s = Sonata()
print(s.info())
print(" → ".join(c.__name__ for c in Sonata.__mro__))`,
            points: ['출력: 소나타 ← 승용차 ← 자동차', 'MRO = 메서드를 찾는 순서', 'Sonata → Sedan → Car → object', '<code>super()</code> = “MRO 에서 내 다음 차례”'],
            notes: '<p>📘 보충(중급). 3단계 상속에서 super() 가 한 단계씩 올라가는 모습을 눈으로 봅니다.</p><p>맨 끝의 <code>object</code> 를 가리키며 “아무것도 상속하지 않은 클래스도 사실 object 의 자식” 이라고 알려 주세요.</p><p>다중 상속은 이름만 소개하고 넘어갑니다(학생 문서 📘).</p><p>(4분)</p>' },
          { layout: 'code', title: '덕 타이핑 — 상속 없이도 다형성', code: `class Dog :
    def speak(self) :
        return "멍멍"

class Cat :
    def speak(self) :
        return "야옹"

class Robot :          # 상속 관계가 전혀 없다!
    def speak(self) :
        return "삐빅"

for thing in [Dog(), Cat(), Robot()] :
    print(thing.speak())`,
            points: ['“오리처럼 울면 오리다” = 덕 타이핑', '종류가 아니라 <b>메서드가 있는지</b>만 본다', '같은 호출, 다른 동작 = 다형성'],
            notes: '<p>📘 보충(중급). 자바 · C++ 를 아는 학생에게는 “인터페이스 없이도 되는 이유” 로 설명하면 좋습니다.</p><p>발문: “Robot 에서 speak() 를 지우면 어떻게 될까요?” → 그 순간에 AttributeError. 편리한 대신 미리 검사해 주지는 않는다는 장단점을 짚어 주세요.</p><p>(4분)</p>' },
          { layout: 'two', title: '상속이냐 컴포지션이냐', left: { title: 'is-a : 승용차는 자동차이다', code: `class Car :
    def __init__(self, name) :
        self.name = name
    def run(self) :
        print("%s 달립니다." % self.name)

class Sedan(Car) :
    pass

Sedan("소나타").run()` },
            right: { title: 'has-a : 자동차는 엔진을 가진다', code: `class Engine :
    def __init__(self, power) :
        self.power = power
    def start(self) :
        print("%d마력 시동" % self.power)

class Truck :
    def __init__(self, engine) :
        self.engine = engine
    def run(self) :
        self.engine.start()

Truck(Engine(300)).run()` },
            notes: '<p>📘 보충(중급). 두 문장을 <b>소리 내어 읽어 보는 것</b>이 가장 좋은 판단법입니다.</p><p>발문: “자동차는 엔진이다?” → 어색합니다. 초보자는 상속을 너무 많이 쓰는 경향이 있으니 “상속보다 컴포지션을 먼저 생각하라” 는 격언을 알려 주세요.</p><p>오른쪽은 엔진을 전기 모터로 갈아 끼우기만 하면 전기 트럭이 된다는 점도 짚습니다.</p><p>(4분)</p>' },
          { layout: 'practice', title: '🚀 프로젝트 12-4. RPG 캐릭터 전투', desc: '공통 규칙은 Character 에, 직업별 특기는 자식 클래스의 오버라이딩으로. 전사는 2배 강타, 마법사는 MP 를 쓰는 파이어볼.',
            starter: `class Character :
    def __init__(self, name, hp, power) :
        self.name = name
        self.hp = hp
        self.power = power
    # TODO: isAlive, attack, damaged

# TODO: class Warrior(Character) - 강타(2배)
`,
            solution: `class Character :
    def __init__(self, name, hp, power) :
        self.name = name
        self.hp = hp
        self.power = power

    def isAlive(self) :
        return self.hp > 0

    def attack(self, other) :
        print("%s의 공격! %s에게 %d 피해" % (self.name, other.name, self.power))
        other.damaged(self.power)

    def damaged(self, amount) :
        self.hp -= amount
        if self.hp <= 0 :
            self.hp = 0
            print("  %s 쓰러짐!" % self.name)
        else :
            print("  %s 남은 체력 %d" % (self.name, self.hp))

class Warrior(Character) :
    def attack(self, other) :
        power = self.power * 2
        print("%s의 강타! %s에게 %d 피해" % (self.name, other.name, power))
        other.damaged(power)

hero = Warrior("전사", 100, 10)
enemy = Character("고블린", 40, 7)
while hero.isAlive() and enemy.isAlive() :
    hero.attack(enemy)
    if enemy.isAlive() :
        enemy.attack(hero)
print("승자 :", hero.name if hero.isAlive() else enemy.name)
`,
            notes: '<p>학생 문서에는 마법사(MP · 파이어볼)와 턴 번호까지 있습니다. 슬라이드는 전사 vs 고블린으로 줄였습니다.</p><p>지도 포인트: <code>damaged()</code> 는 <b>부모에만</b> 만든다(모두가 물려받는다), 특기만 오버라이딩한다, MP 가 부족하면 <code>super().attack()</code> 으로 되돌아간다.</p><p>(10분, 남은 것은 과제)</p>' },
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
          '마우스 클릭 이벤트로 인스턴스를 만들어 [프로그램 2]를 완성할 수 있다',
          '공통 부분과 도형별 부분을 나누어(책임 분리) 새 도형 클래스를 추가할 수 있다'
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
            desc: '<code>super().__init__()</code> 과 튜플 목록을 도는 for 문으로 조금 더 짧게 정리한 버전입니다. 동작은 Code12-08 과 같습니다.' },

          { type: 'h', text: '클래스 설계 연습 — 책임을 어떻게 나눌까' },
          { type: 'p', html: 'Code12-08 은 왜 Shape 와 Rectangle 두 클래스로 나뉘어 있을까요? 클래스를 설계할 때는 다음 세 가지 질문을 순서대로 던져 보면 좋습니다.' },
          { type: 'list', ordered: true, items: [
            '<b>무엇을 여러 개 만들 것인가?</b> → 그것이 클래스가 됩니다. (도형 하나하나)',
            '<b>각자 무엇을 기억해야 하는가?</b> → 그것이 필드입니다. (중심점, 크기, 내 거북이)',
            '<b>무엇을 할 수 있어야 하는가?</b> → 그것이 메서드입니다. (펜 설정하기, 나를 그리기)'
          ] },
          { type: 'p', html: '그 다음 <b>“어느 도형에나 똑같은 것”</b> 과 <b>“도형마다 다른 것”</b> 을 나눕니다. 똑같은 것은 부모(Shape)로 올리고, 다른 것만 자식이 오버라이딩합니다. 이것을 <b>책임을 나눈다</b>고 말합니다.' },
          { type: 'table', caption: '도형 프로그램의 책임 나누기', head: ['하는 일', '누가 맡을까', '이유'], rows: [
            ['거북이 만들기', '<b>Shape</b> (부모)', '어느 도형이든 거북이 한 마리가 필요하다'],
            ['펜 색 · 두께 정하기', '<b>Shape</b> (부모)', '규칙이 모든 도형에 똑같다'],
            ['중심점 기억하기', '<b>Shape</b> (부모)', '모든 도형에 중심이 있다'],
            ['가로 · 세로 기억하기', '<b>Rectangle</b> (자식)', '사각형에만 있는 값 (원은 반지름)'],
            ['실제로 그리기', '<b>자식마다 따로</b>', '도형마다 그리는 방법이 다르다']
          ] },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 이름 짓기 규칙 (PEP 8)', html: '파이썬 공식 스타일 안내서 <b>PEP 8</b> 은 이름 짓기를 이렇게 권합니다.<ul><li><b>클래스</b>: 첫 글자 대문자, 단어마다 대문자 — <code>Shape</code>, <code>RacingCar</code> (파스칼 표기법)</li><li><b>메서드 · 변수</b>: 소문자와 밑줄 — <code>draw_shape()</code>, <code>my_turtle</code> (스네이크 표기법)</li><li><b>상수</b>: 모두 대문자 — <code>MAX_SPEED = 150</code></li></ul>이 강좌의 코드는 강의자료를 따라 <code>drawShape()</code> 처럼 카멜 표기법을 쓰지만, 실무 파이썬 코드에서는 <code>draw_shape()</code> 가 표준입니다. 어느 쪽을 쓰든 <b>한 프로젝트 안에서는 하나로 통일</b>하는 것이 가장 중요합니다.<br>또 좋은 이름은 <b>동사로 시작하는 메서드</b>(<code>drawShape</code>, <code>setPen</code>)와 <b>명사인 필드</b>(<code>width</code>, <code>myTurtle</code>)입니다. <code>doIt()</code>, <code>data1</code> 같은 이름은 나중에 읽을 사람을 괴롭게 합니다.' },

          { type: 'h', text: '설계가 좋으면 도형을 늘리기 쉽다 — Triangle 추가' },
          { type: 'p', html: 'Shape 가 공통 부분을 맡고 있으므로 새 도형을 추가할 때는 <b>생성자와 drawShape() 만</b> 쓰면 됩니다. 삼각형을 추가해 봅시다. 이번에는 부모의 drawShape() 를 <code>pass</code> 대신 <code>raise NotImplementedError()</code> 로 두어, 자식이 그리기를 깜빡하면 바로 알 수 있게 했습니다(6교시에서 자세히 배웁니다).' },
          { type: 'code', title: '추가 예제. 삼각형 클래스 추가하기', nondeterministic: true, code: `import turtle
import random

class Shape :
    def __init__(self) :
        self.myTurtle = turtle.Turtle('turtle')
        self.myTurtle.speed(0)
        self.cx, self.cy = 0, 0

    def setPen(self) :
        self.myTurtle.pencolor((random.random(), random.random(), random.random()))
        self.myTurtle.pensize(random.randrange(1, 8))

    def drawShape(self) :
        raise NotImplementedError()      # 자식이 반드시 채워야 한다

class Triangle(Shape) :
    def __init__(self, x, y) :
        super().__init__()
        self.cx, self.cy = x, y
        self.size = random.randrange(40, 120)

    def drawShape(self) :
        self.setPen()
        self.myTurtle.penup()
        self.myTurtle.goto(self.cx - self.size / 2, self.cy - self.size / 2)
        self.myTurtle.setheading(0)       # 오른쪽을 보게 방향 맞추기
        self.myTurtle.pendown()
        for _ in range(3) :
            self.myTurtle.forward(self.size)
            self.myTurtle.left(120)

turtle.title('삼각형 클래스 추가하기')
for i in range(5) :
    Triangle(random.randint(-200, 200), random.randint(-150, 150)).drawShape()
turtle.done()`,
            desc: 'Shape 코드는 <b>한 글자도 고치지 않았습니다</b>. 새 도형이 필요할 때 부모를 건드리지 않아도 되는 것이 잘 나눈 설계의 신호입니다. 정삼각형은 세 번 반복해서 <code>forward(변)</code> 후 <code>left(120)</code> 하면 그려집니다(외각 120°).' },

          { type: 'h', text: '컴포지션으로 도형을 묶기 — ShapeGroup' },
          { type: 'p', html: '“도형 여러 개를 한 덩어리로 다루고 싶다” 면 어떻게 할까요? <b>ShapeGroup 은 Shape 가 아닙니다</b>(is-a 가 아닙니다). 대신 도형들을 <b>가지고</b> 있습니다(has-a). 4교시에서 배운 컴포지션을 쓸 자리입니다.' },
          { type: 'code', title: '추가 예제. 도형 묶음 클래스 (컴포지션)', code: `import turtle
import random

class Shape :
    def __init__(self, x, y) :
        self.myTurtle = turtle.Turtle('turtle')
        self.myTurtle.speed(0)
        self.cx, self.cy = x, y
        self.size = random.randrange(40, 100)

    def setPen(self) :
        self.myTurtle.pencolor((random.random(), random.random(), random.random()))
        self.myTurtle.pensize(3)

    def drawShape(self) :
        raise NotImplementedError()

class Square(Shape) :
    def drawShape(self) :
        self.setPen()
        self.myTurtle.penup()
        self.myTurtle.goto(self.cx - self.size / 2, self.cy - self.size / 2)
        self.myTurtle.setheading(0)
        self.myTurtle.pendown()
        for _ in range(4) :
            self.myTurtle.forward(self.size)
            self.myTurtle.left(90)

class Circle(Shape) :
    def drawShape(self) :
        self.setPen()
        self.myTurtle.penup()
        self.myTurtle.goto(self.cx, self.cy - self.size / 2)
        self.myTurtle.pendown()
        self.myTurtle.circle(self.size / 2)

class ShapeGroup :                  # 도형을 '가지고 있는' 클래스
    def __init__(self, name) :
        self.name = name
        self.shapes = []

    def add(self, shape) :
        self.shapes.append(shape)

    def drawAll(self) :
        for s in self.shapes :      # 덕 타이핑: 종류를 묻지 않고 그리라고만 한다
            s.drawShape()
        print("%s : 도형 %d개를 그렸습니다." % (self.name, len(self.shapes)))

group = ShapeGroup('내 그림')
for i in range(3) :
    group.add(Square(random.randint(-220, -20), random.randint(-120, 120)))
    group.add(Circle(random.randint(20, 220), random.randint(-120, 120)))
group.drawAll()
turtle.done()`,
            expect: '내 그림 : 도형 6개를 그렸습니다.',
            desc: '<code>drawAll()</code> 안에서는 사각형인지 원인지 <b>묻지 않습니다</b>. “drawShape() 를 가진 무언가” 이기만 하면 되니까요(4교시의 덕 타이핑). 나중에 Triangle 을 추가해도 ShapeGroup 은 고칠 필요가 없습니다.' }
        ],
        practice: [
          { title: '실습 12-15. 삼각형을 그리는 Triangle 클래스', level: 1,
            desc: '<p>Shape 를 상속받는 <code>Triangle</code> 클래스를 만들어 정삼각형 6개를 화면에 그리세요.</p><ul><li>생성자: 중심 (x, y) 를 받고, 한 변의 길이 <code>size</code> 를 40~120 사이 무작위로 정한다 (부모 생성자 먼저 호출!)</li><li><code>drawShape()</code>: 펜을 설정하고 왼쪽 아래 <code>(cx - size/2, cy - size/2)</code> 로 이동한 뒤, <code>forward(size)</code> 와 <code>left(120)</code> 을 세 번 반복한다</li></ul>',
            hint: '<code>super().__init__()</code> 을 먼저 불러야 거북이가 생깁니다. 이동하기 전에 <code>penup()</code>, 그리기 전에 <code>pendown()</code>. 방향이 틀어지지 않게 <code>setheading(0)</code> 을 넣어 주세요. 정삼각형의 외각은 120도입니다.',
            starter: `import turtle
import random

class Shape :
    def __init__(self) :
        self.myTurtle = turtle.Turtle('turtle')
        self.myTurtle.speed(0)
        self.cx, self.cy = 0, 0
    def setPen(self) :
        self.myTurtle.pencolor((random.random(), random.random(), random.random()))
        self.myTurtle.pensize(random.randrange(1, 8))
    def drawShape(self) :
        pass

# TODO: class Triangle(Shape) - __init__(x, y), drawShape()

turtle.title('삼각형 그리기')
# TODO: 삼각형 6개 그리기
turtle.done()
`,
            solution: `import turtle
import random

class Shape :
    def __init__(self) :
        self.myTurtle = turtle.Turtle('turtle')
        self.myTurtle.speed(0)
        self.cx, self.cy = 0, 0
    def setPen(self) :
        self.myTurtle.pencolor((random.random(), random.random(), random.random()))
        self.myTurtle.pensize(random.randrange(1, 8))
    def drawShape(self) :
        pass

class Triangle(Shape) :
    def __init__(self, x, y) :
        super().__init__()
        self.cx, self.cy = x, y
        self.size = random.randrange(40, 120)

    def drawShape(self) :
        self.setPen()
        self.myTurtle.penup()
        self.myTurtle.goto(self.cx - self.size / 2, self.cy - self.size / 2)
        self.myTurtle.setheading(0)
        self.myTurtle.pendown()
        for _ in range(3) :
            self.myTurtle.forward(self.size)
            self.myTurtle.left(120)

turtle.title('삼각형 그리기')
for i in range(6) :
    Triangle(random.randint(-200, 200), random.randint(-150, 150)).drawShape()
turtle.done()
`,
            nondeterministic: true },
          { title: '실습 12-16. 점을 찍는 Dot 클래스', level: 1,
            desc: '<p>Shape 를 상속받아 <b>점(동그라미)을 찍는</b> <code>Dot</code> 클래스를 만드세요. 거북이의 <code>dot(크기)</code> 메서드는 현재 위치에 점을 찍습니다. 무작위 위치에 점 15개를 찍어 밤하늘처럼 만들어 보세요.</p>',
            hint: '점은 선을 긋는 것이 아니므로 <code>pendown()</code> 이 필요 없습니다. <code>penup()</code> → <code>goto(cx, cy)</code> → <code>dot(self.size)</code> 순서면 됩니다. 점 색은 <code>pencolor</code> 를 따라갑니다.',
            starter: `import turtle
import random

class Shape :
    def __init__(self) :
        self.myTurtle = turtle.Turtle('turtle')
        self.myTurtle.speed(0)
    def setPen(self) :
        self.myTurtle.pencolor((random.random(), random.random(), random.random()))
    def drawShape(self) :
        pass

# TODO: class Dot(Shape) - __init__(x, y) 와 drawShape()

turtle.title('점 찍기')
turtle.done()
`,
            solution: `import turtle
import random

class Shape :
    def __init__(self) :
        self.myTurtle = turtle.Turtle('turtle')
        self.myTurtle.speed(0)
    def setPen(self) :
        self.myTurtle.pencolor((random.random(), random.random(), random.random()))
    def drawShape(self) :
        pass

class Dot(Shape) :
    def __init__(self, x, y) :
        super().__init__()
        self.cx, self.cy = x, y
        self.size = random.randrange(10, 40)

    def drawShape(self) :
        self.setPen()
        self.myTurtle.penup()
        self.myTurtle.goto(self.cx, self.cy)
        self.myTurtle.dot(self.size)
        self.myTurtle.hideturtle()

turtle.title('점 찍기')
for i in range(15) :
    Dot(random.randint(-250, 250), random.randint(-180, 180)).drawShape()
turtle.done()
`,
            nondeterministic: true },
          { title: '실습 12-17. 원을 그리는 Circle 클래스 추가', level: 2,
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
          { title: '실습 12-18. 정사각형 클래스', level: 2,
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
            nondeterministic: true },
          { title: '🚀 프로젝트 12-5. 도형 팔레트 (클릭으로 그리는 그림판)', level: 3,
            desc: '<p>[프로그램 2]를 <b>여러 도형을 골라 그리는 그림판</b>으로 키웁니다. 상속(도형 종류) 과 컴포지션(팔레트가 도형들을 가진다) 을 함께 쓰는 프로젝트입니다.</p><p><b>요구 사항</b></p><ul><li><code>Shape</code> (부모) — 생성자에서 거북이 생성 · 중심점 · 크기(30~100 무작위), <code>setPen()</code>, 그리기 시작 위치로 가는 <code>start(x, y)</code>, 지우는 <code>erase()</code>, 그리고 <code>drawShape()</code> 는 <code>raise NotImplementedError()</code></li><li><code>Rectangle</code> · <code>Circle</code> · <code>Triangle</code> — <code>drawShape()</code> 만 오버라이딩하고, 클래스 변수 <code>name</code> 에 한글 이름을 둔다</li><li><code>Palette</code> — 도형을 <b>가지고</b> 있는 클래스(컴포지션)<ul><li><code>select(shapeClass)</code> — 앞으로 그릴 도형 <b>클래스</b>를 바꾸고 창 제목에 표시</li><li><code>draw(x, y)</code> — 지금 고른 클래스로 인스턴스를 만들어 그리고 목록에 넣는다</li><li><code>clearAll()</code> — 그린 도형을 모두 지운다</li></ul></li><li>마우스 왼쪽 클릭 → 도형 그리기, 키 <code>1</code> · <code>2</code> · <code>3</code> → 도형 바꾸기, 키 <code>c</code> → 모두 지우기</li></ul><p><b>실행 장면</b>: 창을 클릭하면 사각형이 그려지고, 키보드 <code>2</code> 를 누른 뒤 클릭하면 원이 그려집니다. 제목 표시줄에 현재 도형 이름이 보입니다. (키보드를 쓰려면 <code>turtle.listen()</code> 이 필요하고, 창을 한 번 클릭해 주어야 합니다)</p><p><b>여기까지 했다면 이렇게 더 해 보세요</b></p><ul><li>오른쪽 클릭(<code>onscreenclick(함수, 3)</code>)으로 마지막 도형만 지우기</li><li><code>begin_fill()</code> · <code>end_fill()</code> 로 색을 채운 도형 그리기</li><li>그린 도형의 개수와 종류를 세어 창 제목에 함께 표시하기</li></ul>',
            hint: '<b>클래스 자체를 변수에 담을 수 있습니다.</b> <code>self.current = Circle</code> 처럼 괄호 없이 넣어 두었다가 <code>self.current(x, y)</code> 로 인스턴스를 만듭니다. 키보드는 <code>turtle.onkey(함수, \'1\')</code> 로 연결하는데, 인수를 넘기려면 <code>lambda : palette.select(Circle)</code> 처럼 lambda 로 감쌉니다.',
            starter: `import turtle
import random

class Shape :
    def __init__(self, x, y) :
        self.myTurtle = turtle.Turtle('turtle')
        self.myTurtle.speed(0)
        self.cx, self.cy = x, y
        self.size = random.randrange(30, 100)

    def setPen(self) :
        self.myTurtle.pencolor((random.random(), random.random(), random.random()))
        self.myTurtle.pensize(random.randrange(1, 8))

    def start(self, x, y) :          # 펜을 들고 이동한 뒤 내려놓기
        self.setPen()
        self.myTurtle.penup()
        self.myTurtle.goto(x, y)
        self.myTurtle.setheading(0)
        self.myTurtle.pendown()

    def drawShape(self) :
        raise NotImplementedError()

    def erase(self) :
        self.myTurtle.clear()
        self.myTurtle.hideturtle()

class Rectangle(Shape) :
    name = '사각형'
    def drawShape(self) :
        self.start(self.cx - self.size / 2, self.cy - self.size / 2)
        for d in [self.size, self.size * 0.7] * 2 :
            self.myTurtle.forward(d)
            self.myTurtle.left(90)

# TODO: class Circle(Shape), class Triangle(Shape)
# TODO: class Palette - select(shapeClass), draw(x, y), clearAll()

turtle.title('도형 팔레트')
turtle.done()
`,
            solution: `import turtle
import random

## 클래스 선언 부분 ##
class Shape :
    def __init__(self, x, y) :
        self.myTurtle = turtle.Turtle('turtle')
        self.myTurtle.speed(0)
        self.cx, self.cy = x, y
        self.size = random.randrange(30, 100)

    def setPen(self) :
        self.myTurtle.pencolor((random.random(), random.random(), random.random()))
        self.myTurtle.pensize(random.randrange(1, 8))

    def start(self, x, y) :
        self.setPen()
        self.myTurtle.penup()
        self.myTurtle.goto(x, y)
        self.myTurtle.setheading(0)
        self.myTurtle.pendown()

    def drawShape(self) :
        raise NotImplementedError()

    def erase(self) :
        self.myTurtle.clear()
        self.myTurtle.hideturtle()

class Rectangle(Shape) :
    name = '사각형'
    def drawShape(self) :
        self.start(self.cx - self.size / 2, self.cy - self.size / 2)
        for d in [self.size, self.size * 0.7] * 2 :
            self.myTurtle.forward(d)
            self.myTurtle.left(90)

class Circle(Shape) :
    name = '원'
    def drawShape(self) :
        self.start(self.cx, self.cy - self.size / 2)
        self.myTurtle.circle(self.size / 2)

class Triangle(Shape) :
    name = '삼각형'
    def drawShape(self) :
        self.start(self.cx - self.size / 2, self.cy - self.size / 2)
        for _ in range(3) :
            self.myTurtle.forward(self.size)
            self.myTurtle.left(120)

class Palette :                       # 도형들을 '가지고' 관리하는 클래스
    def __init__(self) :
        self.shapes = []
        self.current = Rectangle      # 클래스 자체를 담아 둔다

    def select(self, shapeClass) :
        self.current = shapeClass
        turtle.title('도형 팔레트 - 현재: %s   (1 사각형 / 2 원 / 3 삼각형 / c 지우기)' % shapeClass.name)

    def draw(self, x, y) :
        shape = self.current(x, y)    # 고른 클래스로 인스턴스 생성
        shape.drawShape()
        self.shapes.append(shape)

    def clearAll(self) :
        for s in self.shapes :
            s.erase()
        self.shapes = []

## 메인 코드 부분 ##
palette = Palette()
turtle.onscreenclick(palette.draw, 1)
turtle.onkey(lambda : palette.select(Rectangle), '1')
turtle.onkey(lambda : palette.select(Circle), '2')
turtle.onkey(lambda : palette.select(Triangle), '3')
turtle.onkey(palette.clearAll, 'c')
turtle.listen()
palette.select(Rectangle)
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
            explain: '도형마다 그리는 방법이 다르므로 부모는 빈 껍데기만 두고 서브 클래스가 오버라이딩합니다(6교시 추상 메서드).' },
          { q: '도형 여러 개를 한 덩어리로 다루는 <code>ShapeGroup</code> 을 만들려고 합니다. 가장 알맞은 설계는?', options: ['<code>class ShapeGroup(Shape) :</code> 로 Shape 를 상속받는다', '<code>self.shapes = []</code> 에 도형 인스턴스들을 담는다 (컴포지션)', 'Shape 클래스 안에 리스트를 클래스 변수로 둔다', '도형마다 전역 변수를 하나씩 만든다'], answer: 1,
            explain: '“도형 묶음은 도형<b>이다</b>” 는 어색하고 “도형 묶음은 도형들을 <b>가진다</b>” 가 자연스럽습니다(has-a). 그래서 상속이 아니라 컴포지션으로 만듭니다. Shape 에 클래스 변수 리스트를 두면 3교시에서 본 “공유 리스트” 버그가 납니다.' },
          { q: 'Shape · Rectangle 구조에 <b>삼각형</b>을 새로 추가하려고 합니다. 새로 써야 하는 것은?', options: ['Shape 의 거북이 생성 코드와 setPen() 을 다시 쓴다', 'Triangle 의 생성자와 drawShape() 만 쓴다', 'Rectangle 을 고쳐서 삼각형도 그리게 한다', 'turtle 모듈을 새로 만든다'], answer: 1,
            explain: '공통 부분(거북이 생성 · 펜 설정 · 중심점)은 Shape 가 이미 맡고 있으므로 <b>다른 부분만</b> 쓰면 됩니다. 새 종류를 추가할 때 부모를 고치지 않아도 되는 것이 잘 나눈 설계의 신호입니다.' }
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
          { layout: 'bullets', title: '클래스를 설계하는 세 가지 질문', lead: '무엇을 여러 개 만들 것인가 → 무엇을 기억하나 → 무엇을 할 수 있나',
            bullets: ['① <b>여러 개 만들 것</b> = 클래스 — 도형 하나하나', '② <b>각자 기억할 것</b> = 필드 — 중심점 · 크기 · 내 거북이', '③ <b>할 수 있는 일</b> = 메서드 — 펜 설정 · 나를 그리기', '그 다음 “어느 도형에나 같은 것” 은 부모로 올린다', ['이름 짓기(PEP 8)', ['클래스는 <code>Shape</code>, 메서드는 동사로 <code>drawShape()</code>', '필드는 명사로 <code>width</code>, <code>myTurtle</code>']]],
            notes: '<p>📘 보충(설계 연습). 세 질문을 칠판에 적어 두고 다른 예(학생 성적 프로그램, 게임 몬스터)에도 적용해 보게 하면 좋습니다.</p><p>발문: “도서관 프로그램을 만든다면 무엇이 클래스가 될까요?” → 책, 회원. “책이 기억할 것은?” → 제목, 빌린 사람.</p><p>PEP 8 은 이름만 소개합니다. 이 강좌 코드는 강의자료를 따라 camelCase 를 쓰지만 실무는 snake_case 라는 점만 알려 주세요.</p><p>(4분)</p>' },
          { layout: 'code', title: '설계가 좋으면 도형 추가가 쉽다', code: `import turtle, random

class Shape :
    def __init__(self) :
        self.t = turtle.Turtle('turtle')
        self.t.speed(0)
    def setPen(self) :
        self.t.pencolor((random.random(), random.random(), random.random()))
    def drawShape(self) :
        raise NotImplementedError()

class Triangle(Shape) :
    def __init__(self, x, y) :
        super().__init__()
        self.cx, self.cy, self.size = x, y, random.randrange(40, 120)
    def drawShape(self) :
        self.setPen()
        self.t.penup(); self.t.goto(self.cx, self.cy); self.t.setheading(0); self.t.pendown()
        for _ in range(3) :
            self.t.forward(self.size); self.t.left(120)

for i in range(5) :
    Triangle(random.randint(-200, 200), random.randint(-150, 150)).drawShape()
turtle.done()`,
            points: ['Shape 코드는 <b>한 글자도 고치지 않았다</b>', '새 도형 = 생성자 + drawShape() 만', '부모의 <code>raise NotImplementedError()</code> = “꼭 채워라”'],
            notes: '<p>실행해서 삼각형 5개가 그려지는 것을 보여 줍니다.</p><p>발문: “Triangle 에서 drawShape() 를 빼면 어떻게 될까요?” → 부모의 raise 가 실행되어 바로 오류. 6교시 추상 메서드로 이어집니다.</p><p>(5분)</p>' },
          { layout: 'code', title: '도형 묶음 만들기 (컴포지션)', code: `import turtle

class Square :
    def __init__(self, x, y) :
        self.t = turtle.Turtle('turtle')
        self.cx, self.cy, self.size = x, y, 60
    def drawShape(self) :
        self.t.penup(); self.t.goto(self.cx, self.cy); self.t.pendown()
        for _ in range(4) :
            self.t.forward(self.size); self.t.left(90)

class ShapeGroup :            # 도형을 '가진다'
    def __init__(self) :
        self.shapes = []
    def add(self, s) :
        self.shapes.append(s)
    def drawAll(self) :
        for s in self.shapes :
            s.drawShape()
g = ShapeGroup()
for x in (-100, 50) :
    g.add(Square(x, 0))
g.drawAll()
turtle.done()`,
            points: ['ShapeGroup 은 Shape <b>가 아니다</b> → 상속 ✗', '도형들을 <b>가진다</b> → 컴포지션 ○', '<code>drawAll()</code> 은 종류를 묻지 않는다 (덕 타이핑)'],
            notes: '<p>4교시의 is-a / has-a 판단을 실제 프로그램에 적용하는 슬라이드입니다.</p><p>발문: “ShapeGroup 이 Shape 를 상속받으면 무엇이 이상할까요?” → 묶음에게 “너를 그려라” 라고 말하는 것이 어색합니다.</p><p>(4분)</p>' },
          { layout: 'practice', title: '🚀 프로젝트 12-5. 도형 팔레트', desc: '클릭하면 지금 고른 도형이 그려지는 그림판. 키 1 · 2 · 3 으로 사각형 · 원 · 삼각형을 바꾸고, c 로 모두 지웁니다.',
            starter: `import turtle, random

class Shape :
    def __init__(self, x, y) :
        self.t = turtle.Turtle('turtle')
        self.cx, self.cy, self.size = x, y, 60
    def drawShape(self) :
        raise NotImplementedError()

# TODO: Circle, Triangle, Palette
turtle.done()
`,
            solution: `import turtle, random

class Shape :
    def __init__(self, x, y) :
        self.t = turtle.Turtle('turtle')
        self.t.speed(0)
        self.cx, self.cy, self.size = x, y, random.randrange(30, 100)
    def start(self, x, y) :
        self.t.penup(); self.t.goto(x, y); self.t.setheading(0); self.t.pendown()
    def drawShape(self) :
        raise NotImplementedError()

class Circle(Shape) :
    name = '원'
    def drawShape(self) :
        self.start(self.cx, self.cy - self.size / 2)
        self.t.circle(self.size / 2)

class Triangle(Shape) :
    name = '삼각형'
    def drawShape(self) :
        self.start(self.cx - self.size / 2, self.cy - self.size / 2)
        for _ in range(3) :
            self.t.forward(self.size); self.t.left(120)

class Palette :
    def __init__(self) :
        self.shapes = []
        self.current = Circle          # 클래스 자체를 담아 둔다
    def select(self, shapeClass) :
        self.current = shapeClass
        turtle.title('현재 도형: %s' % shapeClass.name)
    def draw(self, x, y) :
        shape = self.current(x, y)
        shape.drawShape()
        self.shapes.append(shape)

palette = Palette()
turtle.onscreenclick(palette.draw, 1)
turtle.onkey(lambda : palette.select(Circle), '1')
turtle.onkey(lambda : palette.select(Triangle), '2')
turtle.listen()
palette.select(Circle)
turtle.done()
`,
            notes: '<p>학생 문서에는 사각형 · 지우기(c 키)까지 있습니다. 슬라이드는 원 · 삼각형만 남긴 축약본입니다.</p><p>가장 중요한 아이디어 두 가지: ① <b>클래스 자체를 변수에 담을 수 있다</b>(<code>self.current = Circle</code>, 괄호 없음) ② <code>onkey</code> 에 인수를 넘기려면 <code>lambda</code> 로 감싼다.</p><p>실행 후 창을 한 번 클릭해야 키보드가 먹는다는 점을 알려 주세요.</p><p>(10분)</p>' },
          { layout: 'quiz', title: '확인 문제', q: 'Rectangle 클래스에 setPen() 이 없는데도 self.setPen() 이 동작하는 이유는?', options: ['전역 함수라서', 'turtle 모듈 함수라서', 'Shape 에게 상속받아서', '오류가 난다'], answer: 2,
            explain: '서브 클래스는 슈퍼 클래스의 메서드를 물려받습니다.',
            notes: '<p>(2분)</p>' },
          { layout: 'practice', title: '실습 12-18. 정사각형 클래스', desc: 'Rectangle 을 상속받는 Square 를 만드세요. 부모 생성자를 부른 뒤 height = width 로만 바꿉니다.',
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
            notes: '<p>슬라이드용으로 Shape 없이 단순화한 버전입니다. 학생 문서의 실습 12-18 은 Code12-08 구조 그대로입니다.</p><p>포인트: 생성자에서 부모 생성자를 먼저 부르고 필요한 것만 바꾼다.</p><p>(5분)</p>' },
          { layout: 'summary', title: '5교시 정리',
            bullets: ['Shape: 공통(거북이 생성 · 펜 설정), drawShape() 는 빈 껍데기', 'Rectangle(Shape): 크기 · drawShape() 오버라이딩', '서브 생성자에서 <code>Shape.__init__(self)</code> (= <code>super().__init__()</code>)', '<code>turtle.onscreenclick(함수, 1)</code> → 클릭마다 새 인스턴스'],
            notes: '<p>다음 시간 예고: print(인스턴스), 인스턴스 + 인스턴스 가 가능할까? → 특별한 메서드.</p><p>(1분)</p>' }
        ]
      },
      // ================= 12-6 =================
      {
        id: 'ch12-6',
        title: '특별한 메서드와 추상 메서드',
        minutes: 50,
        goals: [
          '__del__, __repr__, __add__ 같은 특별한 메서드가 언제 자동 호출되는지 설명할 수 있다',
          '비교 메서드(__lt__, __eq__ 등)로 인스턴스끼리 비교 연산을 할 수 있다',
          '추상 메서드와 NotImplementedError 로 오버라이딩을 강제할 수 있다',
          '__str__ · __eq__ · __len__ · __getitem__ 으로 파이썬다운 클래스를 만들 수 있다',
          '사용자 정의 예외를 만들고, 객체를 JSON 으로 저장 · 복원할 수 있다'
        ],
        flow: [['도입', 3], ['특별한 메서드 개념', 6], ['Code12-09 Line 클래스', 12], ['__str__ · __eq__ · __len__ (중급)', 8], ['추상 메서드 · abc', 10], ['사용자 정의 예외 · JSON · assert', 6], ['정리 · 퀴즈', 5]],
        // (50분 수업: 중급 주제는 학급 수준에 따라 골라 다룹니다)
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
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: abc 모듈', html: '파이썬 표준 모듈 <code>abc</code>(Abstract Base Class)를 쓰면 더 엄격하게 만들 수 있습니다. 추상 메서드를 오버라이딩하지 않은 클래스는 <b>인스턴스를 만드는 순간</b> 오류가 납니다.<pre><code>from abc import ABC, abstractmethod\n\nclass Shape(ABC) :\n    @abstractmethod\n    def drawShape(self) :\n        pass\n\nclass Rectangle(Shape) :\n    pass\n\nr = Rectangle()   # TypeError: Can\'t instantiate abstract class ...</code></pre>' },

          { type: 'h', text: '__str__ 과 __repr__ — 두 가지 출력 모양' },
          { type: 'p', html: '파이썬에는 객체를 문자열로 바꾸는 메서드가 <b>두 개</b> 있습니다. 둘 다 있으면 <code>print()</code> 는 <code>__str__</code> 을 씁니다.' },
          { type: 'table', caption: '__str__ 과 __repr__', head: ['', '<code>__str__</code>', '<code>__repr__</code>'], rows: [
            ['누구를 위한 것', '<b>사용자</b> — 읽기 좋은 모양', '<b>개발자</b> — 정확한 모양'],
            ['언제 쓰이나', '<code>print(객체)</code>, <code>str(객체)</code>, f-string', '<code>repr(객체)</code>, <code>&gt;&gt;&gt;</code> 셸, 리스트 · 딕셔너리 안'],
            ['없으면', '<code>__repr__</code> 을 대신 쓴다', '<code>&lt;__main__.Point object at 0x…&gt;</code>'],
            ['권하는 내용', '"(3, 4) 위치"', '"Point(3, 4)" — 그대로 복사하면 다시 만들 수 있게']
          ] },
          { type: 'code', title: '추가 예제. __str__ 과 __repr__ 을 모두 만들기', code: `class Point :
    def __init__(self, x, y) :
        self.x = x
        self.y = y

    def __repr__(self) :          # 개발자용: 다시 만들 수 있는 모양
        return "Point(%d, %d)" % (self.x, self.y)

    def __str__(self) :           # 사용자용: 사람이 읽기 좋은 모양
        return "(%d, %d) 위치" % (self.x, self.y)

p = Point(3, 4)
print(p)                          # __str__ 이 있으면 이쪽
print(str(p))
print(repr(p))
print([p, p])                     # 리스트 안에서는 언제나 __repr__`,
            expect: `(3, 4) 위치
(3, 4) 위치
Point(3, 4)
[Point(3, 4), Point(3, 4)]`,
            desc: '<b>하나만 만든다면 <code>__repr__</code> 을 만드세요.</b> <code>__str__</code> 이 없으면 파이썬이 <code>__repr__</code> 을 대신 쓰기 때문에 print 도 잘 나옵니다. 반대로 <code>__str__</code> 만 만들면 리스트 안에서는 여전히 메모리 주소가 보입니다.' },

          { type: 'h', text: '__eq__ — 값이 같은지 비교하기' },
          { type: 'p', html: '<code>==</code> 를 정의하지 않으면 파이썬은 <b>같은 객체인지</b>(메모리 주소)만 비교합니다. 그래서 내용이 똑같은 인스턴스 둘도 <code>False</code> 가 나오죠. <code>__eq__</code> 를 만들면 “값이 같으면 같다” 고 판단하게 할 수 있습니다.' },
          { type: 'code', title: '추가 예제. __eq__ 와 __hash__', code: `class Money :
    def __init__(self, amount) :
        self.amount = amount

    def __repr__(self) :
        return "Money(%d)" % self.amount

    def __eq__(self, other) :
        if not isinstance(other, Money) :
            return NotImplemented      # 내가 모르는 타입이면 파이썬에게 맡긴다
        return self.amount == other.amount

    def __hash__(self) :               # 집합 · 딕셔너리 키로 쓰려면 필요
        return hash(self.amount)

a = Money(1000)
b = Money(1000)
c = a

print(a == b)        # 값이 같다 (__eq__)
print(a is b)        # 그러나 서로 다른 객체
print(a is c)
print(Money(1000) in [Money(500), Money(1000)])   # in 도 __eq__ 를 쓴다
print(len({Money(1000), Money(1000), Money(500)}))`,
            expect: `True
False
True
True
2`,
            desc: '<code>in</code> 연산자, <code>list.remove()</code>, <code>count()</code> 도 모두 <code>__eq__</code> 를 사용합니다. 주의할 점: <b><code>__eq__</code> 를 만들면 <code>__hash__</code> 가 자동으로 사라집니다.</b> 집합(set)이나 딕셔너리 키로 쓸 생각이라면 <code>__hash__</code> 도 함께 만들어야 합니다(2교시의 <code>@dataclass</code> 는 <code>eq</code>, <code>frozen</code> 설정으로 이것까지 처리해 줍니다).' },

          { type: 'h', text: '__len__ · __getitem__ — 파이썬다운 객체 만들기' },
          { type: 'p', html: '특별한 메서드의 진짜 힘은 <mark>내가 만든 클래스를 파이썬의 기본 자료형처럼 쓰게</mark> 만드는 데 있습니다. <code>__len__</code> 을 만들면 <code>len(객체)</code> 가 되고, <code>__getitem__</code> 을 만들면 <code>객체[0]</code> · <code>for</code> 문 · <code>in</code> 연산자까지 한꺼번에 동작합니다.' },
          { type: 'code', title: '추가 예제. 리스트처럼 쓸 수 있는 Playlist', code: `class Playlist :
    def __init__(self, name) :
        self.name = name
        self.songs = []

    def add(self, title) :
        self.songs.append(title)
        return self               # 자기 자신을 돌려주면 이어서 부를 수 있다

    def __len__(self) :           # len(객체)
        return len(self.songs)

    def __getitem__(self, i) :    # 객체[i], for 문, in 연산자
        return self.songs[i]

    def __str__(self) :
        return "%s (%d곡)" % (self.name, len(self))

p = Playlist("드라이브")
p.add("봄날").add("첫사랑").add("밤편지")

print(p)
print(len(p))
print(p[0], p[-1])
for song in p :                   # __getitem__ 덕분에 for 문이 된다!
    print("-", song)
print("첫사랑" in p)`,
            expect: `드라이브 (3곡)
3
봄날 밤편지
- 봄날
- 첫사랑
- 밤편지
True`,
            desc: '<code>p.add("봄날").add("첫사랑")</code> 처럼 이어 쓰는 것을 <b>메서드 체이닝</b>이라고 합니다(<code>return self</code> 덕분). 이렇게 만든 클래스는 사용하는 사람이 <b>새 사용법을 배울 필요가 없습니다</b> — 이미 아는 <code>len</code>, <code>for</code>, <code>in</code> 을 그대로 쓰면 되니까요. 이것이 “파이썬답다(Pythonic)” 는 말의 뜻입니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 어떤 특별한 메서드를 만들까', html: '<ul><li><b>거의 항상</b>: <code>__init__</code>, <code>__repr__</code></li><li><b>값을 담는 클래스</b>(돈 · 좌표 · 분수): <code>__eq__</code>, <code>__lt__</code>(정렬), 필요하면 <code>__hash__</code>, <code>__add__</code> 같은 연산자</li><li><b>여러 개를 담는 클래스</b>(재생 목록 · 장바구니): <code>__len__</code>, <code>__getitem__</code>, <code>__contains__</code></li><li><b>상황에 따라</b>: <code>__call__</code>(객체를 함수처럼), <code>__enter__</code> · <code>__exit__</code>(<code>with</code> 문에서 쓰기)</li></ul>반대로 <code>__del__</code> 은 <b>언제 불릴지 예측하기 어렵기 때문에</b> 실무에서는 거의 쓰지 않습니다. 파일이나 연결을 닫는 일은 <code>with</code> 문에 맡기세요.' },

          { type: 'h', text: 'abc 모듈로 만드는 진짜 추상 클래스' },
          { type: 'p', html: '<code>raise NotImplementedError()</code> 는 <b>그 메서드를 부를 때</b> 오류를 냅니다. 오버라이딩을 잊었어도 그 메서드를 부르기 전까지는 모르는 것이죠. <code>abc</code> 모듈을 쓰면 <mark>인스턴스를 만드는 순간</mark> 막아 줍니다 — 훨씬 일찍 알 수 있습니다.' },
          { type: 'code', title: '추가 예제. abc.ABC 와 @abstractmethod', code: `from abc import ABC, abstractmethod

class Figure(ABC) :                  # ABC 를 상속받으면 추상 클래스
    def __init__(self, name) :
        self.name = name

    @abstractmethod
    def area(self) :                 # 자식이 반드시 만들어야 하는 메서드
        pass

    def describe(self) :             # 보통 메서드도 함께 둘 수 있다
        return "%s의 넓이는 %.1f 입니다." % (self.name, self.area())

class Rect(Figure) :
    def __init__(self, w, h) :
        super().__init__("사각형")
        self.w, self.h = w, h

    def area(self) :
        return self.w * self.h

class Circle(Figure) :
    def __init__(self, r) :
        super().__init__("원")
        self.r = r

    def area(self) :
        return 3.14 * self.r ** 2

for f in [Rect(5, 10), Circle(5)] :
    print(f.describe())

class Triangle(Figure) :             # area() 만들기를 깜빡했다!
    pass

try :
    t = Triangle("삼각형")            # 만드는 순간 오류
except TypeError as e :
    print("오류 :", e)`,
            expect: `사각형의 넓이는 50.0 입니다.
원의 넓이는 78.5 입니다.
오류 : Can't instantiate abstract class Triangle without an implementation for abstract method 'area'`,
            desc: '<code>describe()</code> 를 보세요. 부모는 <code>area()</code> 가 <b>어떻게</b> 계산되는지 모르면서도 그것을 이용하는 메서드를 미리 만들어 둘 수 있습니다. 이것이 추상 클래스의 힘입니다 — <b>“약속만 정해 두고 구현은 자식에게 맡긴다.”</b>' },

          { type: 'h', text: '사용자 정의 예외 클래스' },
          { type: 'p', html: '11장에서 배운 예외도 사실 <b>클래스</b>입니다. <code>ValueError</code>, <code>ZeroDivisionError</code> 모두 <code>Exception</code> 을 상속받은 클래스죠. 그래서 <mark>내 프로그램만의 예외를 직접 만들 수 있습니다.</mark> <code>print()</code> 로 알리는 것과 달리, 예외는 <b>호출한 쪽이 반드시 처리하도록</b> 강제할 수 있습니다.' },
          { type: 'code', title: '추가 예제. 잔액 부족 예외 만들기', code: `class InsufficientFundsError(Exception) :   # Exception 을 상속받으면 끝!
    def __init__(self, need) :
        super().__init__("%d원이 모자랍니다." % need)
        self.need = need                    # 부족한 금액도 함께 실어 보낸다

class Account :
    def __init__(self, owner, balance = 0) :
        self.owner = owner
        self.balance = balance

    def withdraw(self, money) :
        if money > self.balance :
            raise InsufficientFundsError(money - self.balance)
        self.balance -= money
        return self.balance

acc = Account("홍길동", 10000)
print("출금 후 잔액 :", acc.withdraw(3000))

try :
    acc.withdraw(50000)
except InsufficientFundsError as e :
    print("출금 실패 :", e)
    print("부족한 금액 :", e.need)

print("잔액 :", acc.balance)`,
            expect: `출금 후 잔액 : 7000
출금 실패 : 43000원이 모자랍니다.
부족한 금액 : 43000
잔액 : 7000`,
            desc: '이름을 <code>~Error</code> 로 끝내는 것이 관례입니다. 예외 클래스에 <code>self.need</code> 처럼 <b>추가 정보</b>를 담아 보낼 수 있다는 점이 특히 유용합니다. 예외를 쓰면 “실패했는지” 를 <code>if</code> 로 일일이 검사하지 않아도 되고, 잘못된 상태로 프로그램이 계속 굴러가는 일을 막을 수 있습니다.' },

          { type: 'h', text: '객체를 파일(JSON)로 저장하고 다시 불러오기' },
          { type: 'p', html: '프로그램을 끄면 인스턴스는 사라집니다. 다음에도 쓰려면 파일에 저장해야 하죠. 사람이 읽을 수 있고 다른 프로그램과도 주고받기 쉬운 <b>JSON</b> 형식이 가장 많이 쓰입니다. 인스턴스를 <b>딕셔너리로 바꿔서</b> 저장하고, 불러올 때는 <b>대체 생성자</b>(2교시)로 되살립니다.' },
          { type: 'code', title: '추가 예제. 학생 객체를 JSON 파일로 저장 · 복원', code: `import json

class Student :
    def __init__(self, name, kor, eng) :
        self.name = name
        self.kor = kor
        self.eng = eng

    def toDict(self) :                     # 객체 → 딕셔너리
        return {"name" : self.name, "kor" : self.kor, "eng" : self.eng}

    @classmethod
    def fromDict(cls, d) :                 # 딕셔너리 → 객체
        return cls(d["name"], d["kor"], d["eng"])

    def __str__(self) :
        return "%s (국어 %d, 영어 %d)" % (self.name, self.kor, self.eng)

students = [Student("김하나", 90, 80), Student("이두리", 70, 65)]

## 저장하기 ##
with open("students.json", "w", encoding = "utf-8") as f :
    json.dump([s.toDict() for s in students], f, ensure_ascii = False, indent = 2)

## 불러오기 ##
with open("students.json", "r", encoding = "utf-8") as f :
    data = json.load(f)

loaded = [Student.fromDict(d) for d in data]
for s in loaded :
    print(s)
print("원래 객체와 같은 것인가 :", loaded[0] is students[0])

print(open("students.json", encoding = "utf-8").read())`,
            expect: `김하나 (국어 90, 영어 80)
이두리 (국어 70, 영어 65)
원래 객체와 같은 것인가 : False
[
  {
    "name": "김하나",
    "kor": 90,
    "eng": 80
  },
  {
    "name": "이두리",
    "kor": 70,
    "eng": 65
  }
]`,
            desc: '<code>ensure_ascii = False</code> 를 주어야 한글이 그대로 저장됩니다. 저장된 것은 <b>값(데이터)뿐</b>이라 불러온 것은 새로 만든 다른 객체입니다(<code>is</code> 가 False). <br>팁: 필드가 단순하다면 <code>toDict()</code> 대신 <code>s.__dict__</code> 를 그대로 써도 됩니다. 반대로 객체 안에 다른 객체가 들어 있다면 그 객체도 딕셔너리로 바꿔 주어야 합니다.' },

          { type: 'h', text: 'assert 로 클래스를 스스로 검증하기' },
          { type: 'p', html: '클래스를 만들었으면 <b>정말 맞게 동작하는지</b> 확인해야 합니다. 눈으로 출력을 보는 대신 <code>assert 조건</code> 을 쓰면 컴퓨터가 검사해 줍니다. 조건이 거짓이면 <code>AssertionError</code> 가 나고, 참이면 조용히 지나갑니다. 이것이 <b>단위 테스트(unit test)</b> 의 가장 단순한 형태입니다.' },
          { type: 'code', title: '추가 예제. assert 로 만든 간단한 단위 테스트', code: `class Money :
    def __init__(self, amount) :
        if amount < 0 :
            raise ValueError("금액은 0원 이상이어야 합니다.")
        self.amount = amount

    def __add__(self, other) :
        return Money(self.amount + other.amount)

    def __eq__(self, other) :
        return self.amount == other.amount

    def __repr__(self) :
        return "Money(%d)" % self.amount

## 테스트 ##
def testMoney() :
    assert Money(1000).amount == 1000, "생성이 잘못됨"
    assert Money(1000) + Money(500) == Money(1500), "덧셈이 잘못됨"
    assert Money(0) == Money(0)
    try :
        Money(-100)
        assert False, "음수인데 오류가 나지 않았다!"
    except ValueError :
        pass                      # 오류가 나는 것이 정상
    print("모든 테스트 통과!")

testMoney()
print(Money(1000) + Money(500))`,
            expect: `모든 테스트 통과!
Money(1500)`,
            desc: '<code>assert 조건, "메시지"</code> 형식으로 실패했을 때 보여 줄 설명을 붙일 수 있습니다. 코드를 고친 뒤 <code>testMoney()</code> 만 다시 실행하면 <b>망가진 곳이 없는지</b> 몇 초 만에 확인할 수 있습니다. 실무에서는 <code>unittest</code>(표준 모듈)나 <code>pytest</code> 를 쓰지만, 생각하는 방식은 똑같습니다.' },
          { type: 'callout', kind: 'warn', title: 'assert 는 테스트용', html: '<code>assert</code> 는 파이썬을 <code>-O</code> 옵션으로 실행하면 <b>모두 무시됩니다</b>. 그래서 사용자 입력 검사처럼 <b>실제로 꼭 막아야 하는 일</b>에는 쓰면 안 됩니다. 그런 곳에는 <code>if</code> + <code>raise ValueError(...)</code> 를 쓰세요. assert 는 “개발하는 동안 내 생각이 맞는지 확인하는 도구” 입니다.' }
        ],
        practice: [
          { title: '실습 12-19. 명함 클래스 (__str__ 과 __repr__)', level: 1,
            desc: '<p>이름 · 회사 · 전화번호를 가진 <code>Card</code> 클래스를 만드세요.</p><ul><li><code>__str__</code> — <code>이름 | 회사 | 전화번호</code> 형식 (사람이 읽기 좋은 모양)</li><li><code>__repr__</code> — <code>Card(\'이름\', \'회사\', \'전화번호\')</code> 형식 (개발자용)</li></ul><pre><code>김하나 | 파이썬소프트 | 010-1111-2222\n이두리 | 거북이랩 | 010-3333-4444\n[Card(\'김하나\', \'파이썬소프트\', \'010-1111-2222\'), Card(\'이두리\', \'거북이랩\', \'010-3333-4444\')]</code></pre>',
            hint: '<code>%r</code> 서식을 쓰면 따옴표가 붙은 모양(repr)으로 출력됩니다: <code>"Card(%r, %r, %r)" % (self.name, self.company, self.phone)</code>. 리스트를 출력하면 <code>__repr__</code> 이 쓰인다는 점도 확인해 보세요.',
            starter: `class Card :
    def __init__(self, name, company, phone) :
        self.name = name
        self.company = company
        self.phone = phone

    # TODO: __str__
    # TODO: __repr__

c1 = Card("김하나", "파이썬소프트", "010-1111-2222")
c2 = Card("이두리", "거북이랩", "010-3333-4444")
print(c1)
print(c2)
print([c1, c2])
`,
            solution: `class Card :
    def __init__(self, name, company, phone) :
        self.name = name
        self.company = company
        self.phone = phone

    def __str__(self) :
        return "%s | %s | %s" % (self.name, self.company, self.phone)

    def __repr__(self) :
        return "Card(%r, %r, %r)" % (self.name, self.company, self.phone)

c1 = Card("김하나", "파이썬소프트", "010-1111-2222")
c2 = Card("이두리", "거북이랩", "010-3333-4444")
print(c1)
print(c2)
print([c1, c2])
`,
            expect: `김하나 | 파이썬소프트 | 010-1111-2222
이두리 | 거북이랩 | 010-3333-4444
[Card('김하나', '파이썬소프트', '010-1111-2222'), Card('이두리', '거북이랩', '010-3333-4444')]` },
          { title: '실습 12-20. 장바구니 클래스 (len · for · [ ])', level: 1,
            desc: '<p><code>Cart</code> 클래스를 <b>리스트처럼</b> 쓸 수 있게 만드세요.</p><ul><li><code>add(name, price)</code> — <code>(이름, 가격)</code> 튜플을 목록에 넣는다</li><li><code>total()</code> — 전체 금액의 합</li><li><code>__len__</code> — <code>len(cart)</code> 가 담긴 개수를 알려 준다</li><li><code>__getitem__</code> — <code>cart[0]</code> 과 <code>for</code> 문이 되게 한다</li><li><code>__str__</code> — <code>하나의 장바구니 (3개, 9500원)</code></li></ul><pre><code>하나의 장바구니 (3개, 9500원)\n3\n- 사과 3000\n- 우유 2500\n- 빵 4000\n(\'사과\', 3000)</code></pre>',
            hint: '<code>__getitem__</code> 은 <code>return self.items[i]</code> 한 줄이면 됩니다. 합계는 <code>sum(price for name, price in self.items)</code>. <code>for name, price in cart :</code> 처럼 튜플 언패킹도 그대로 됩니다.',
            starter: `class Cart :
    def __init__(self, owner) :
        self.owner = owner
        self.items = []

    def add(self, name, price) :
        self.items.append((name, price))

    # TODO: total(), __len__, __getitem__, __str__

cart = Cart("하나")
cart.add("사과", 3000)
cart.add("우유", 2500)
cart.add("빵", 4000)
print(cart.items)
`,
            solution: `class Cart :
    def __init__(self, owner) :
        self.owner = owner
        self.items = []

    def add(self, name, price) :
        self.items.append((name, price))

    def total(self) :
        return sum(price for name, price in self.items)

    def __len__(self) :
        return len(self.items)

    def __getitem__(self, i) :
        return self.items[i]

    def __str__(self) :
        return "%s의 장바구니 (%d개, %d원)" % (self.owner, len(self), self.total())

cart = Cart("하나")
cart.add("사과", 3000)
cart.add("우유", 2500)
cart.add("빵", 4000)

print(cart)
print(len(cart))
for name, price in cart :
    print("-", name, price)
print(cart[0])
`,
            expect: `하나의 장바구니 (3개, 9500원)
3
- 사과 3000
- 우유 2500
- 빵 4000
('사과', 3000)` },
          { title: '실습 12-21. 돈(Money) 클래스', level: 2,
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
          { title: '실습 12-22. 넓이를 구하는 추상 메서드', level: 2,
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
사각형의 넓이 : 9` },
          { title: '실습 12-23. 사용자 정의 예외로 점수 지키기', level: 2,
            desc: '<p>0~100 을 벗어난 점수를 막는 <code>InvalidScoreError</code> 예외를 만들고, Student 클래스가 잘못된 점수를 받으면 <code>raise</code> 하게 하세요.</p><ul><li><code>InvalidScoreError(Exception)</code> — 생성자에서 점수를 받아 <code>N점은 올바른 점수가 아닙니다. (0~100)</code> 메시지를 만들고, <code>self.score</code> 에도 보관</li><li><code>Student.addScore(score)</code> — 범위를 벗어나면 예외를 일으키고, 정상이면 목록에 넣는다</li><li>메인 코드에서 <code>[90, 120, 80, -5, 70]</code> 을 차례로 넣으며 <code>try ~ except</code> 로 처리하고, 마지막에 평균을 출력</li></ul><pre><code>90점 등록\n등록 실패 : 120점은 올바른 점수가 아닙니다. (0~100)\n80점 등록\n등록 실패 : -5점은 올바른 점수가 아닙니다. (0~100)\n70점 등록\n김하나 평균 : 80.0</code></pre>',
            hint: '예외 클래스는 <code>class InvalidScoreError(Exception) :</code> 로 시작하고, 생성자 안에서 <code>super().__init__(메시지)</code> 를 부르면 <code>print(e)</code> 에 그 메시지가 나옵니다. 예외를 일으킬 때는 <code>raise InvalidScoreError(score)</code>.',
            starter: `# TODO: class InvalidScoreError(Exception)

class Student :
    def __init__(self, name) :
        self.name = name
        self.scores = []

    def addScore(self, score) :
        # TODO: 0~100 이 아니면 raise
        self.scores.append(score)

    def average(self) :
        if not self.scores :
            return 0
        return sum(self.scores) / len(self.scores)

s = Student("김하나")
for score in [90, 120, 80, -5, 70] :
    # TODO: try ~ except 로 등록 / 실패 출력
    pass
print("%s 평균 : %.1f" % (s.name, s.average()))
`,
            solution: `class InvalidScoreError(Exception) :
    def __init__(self, score) :
        super().__init__("%d점은 올바른 점수가 아닙니다. (0~100)" % score)
        self.score = score

class Student :
    def __init__(self, name) :
        self.name = name
        self.scores = []

    def addScore(self, score) :
        if score < 0 or score > 100 :
            raise InvalidScoreError(score)
        self.scores.append(score)

    def average(self) :
        if not self.scores :
            return 0
        return sum(self.scores) / len(self.scores)

s = Student("김하나")
for score in [90, 120, 80, -5, 70] :
    try :
        s.addScore(score)
        print("%d점 등록" % score)
    except InvalidScoreError as e :
        print("등록 실패 :", e)

print("%s 평균 : %.1f" % (s.name, s.average()))
`,
            expect: `90점 등록
등록 실패 : 120점은 올바른 점수가 아닙니다. (0~100)
80점 등록
등록 실패 : -5점은 올바른 점수가 아닙니다. (0~100)
70점 등록
김하나 평균 : 80.0` },
          { title: '🚀 프로젝트 12-6. 분수(Fraction) 클래스', level: 3,
            desc: '<p>연산자 오버로딩의 종합 연습입니다. <code>1/2 + 3/4</code> 를 <b>분수 그대로</b> 계산하는 클래스를 만듭니다. 파이썬의 기본 자료형처럼 자연스럽게 쓸 수 있게 만드는 것이 목표입니다.</p><p><b>요구 사항</b></p><ul><li>생성자 <code>__init__(self, top, bottom = 1)</code><ul><li>분모가 0 이면 <code>ZeroDivisionError("분모는 0이 될 수 없습니다.")</code> 를 <code>raise</code></li><li>분모가 음수면 부호를 분자로 옮긴다 (<code>1/-2</code> → <code>-1/2</code>)</li><li><code>math.gcd</code> 로 <b>자동 약분</b> (<code>2/4</code> → <code>1/2</code>)</li></ul></li><li><code>__str__</code> — <code>5/4</code>, 분모가 1이면 정수처럼 <code>2</code></li><li><code>__repr__</code> — <code>Fraction(1, 2)</code></li><li><code>__add__</code> · <code>__sub__</code> · <code>__mul__</code> — 결과도 <b>Fraction</b> 으로 돌려준다</li><li><code>__eq__</code> · <code>__lt__</code> — 약분된 값끼리 비교 (<code>__lt__</code> 가 있으면 <code>sorted()</code> 가 된다!)</li><li><code>__float__</code> — <code>float(분수)</code> 로 소수 값 얻기</li><li>마지막에 <code>assert</code> 로 스스로 검증</li></ul><pre><code>1/2 + 3/4 = 5/4\n1/2 - 3/4 = -1/4\n1/2 * 3/4 = 3/8\n1/2 &lt; 3/4 → True\nTrue\n2\n0.25\n[Fraction(1, 2), Fraction(2, 3), Fraction(3, 4)]\n오류 : 분모는 0이 될 수 없습니다.\n테스트 통과!</code></pre><p><b>여기까지 했다면 이렇게 더 해 보세요</b></p><ul><li><code>__truediv__</code>(나눗셈)와 <code>__neg__</code>(부호 바꾸기) 추가하기</li><li><code>Fraction(1, 2) + 1</code> 처럼 <b>정수와도</b> 더해지게 만들기 (other 가 int 면 <code>Fraction(other)</code> 로 바꾸기)</li><li>파이썬 표준 모듈 <code>fractions.Fraction</code> 과 결과를 비교해 보기</li></ul>',
            hint: '약분은 <code>g = gcd(abs(top), bottom)</code> 을 구한 뒤 분자 · 분모를 각각 <code>// g</code> 하면 됩니다(분자가 0이면 gcd 는 분모가 되어 0/1 이 됩니다). 덧셈은 통분: <code>(a/b) + (c/d) = (a*d + c*b) / (b*d)</code> — 만들어진 Fraction 이 생성자에서 알아서 약분해 줍니다. 크기 비교도 통분해서 <code>self.top * other.bottom &lt; other.top * self.bottom</code>.',
            starter: `from math import gcd

class Fraction :
    def __init__(self, top, bottom = 1) :
        # TODO: 분모 0 검사, 음수 부호 정리, 약분
        self.top = top
        self.bottom = bottom

    def __str__(self) :
        # TODO: 분모가 1이면 정수처럼
        return "%d/%d" % (self.top, self.bottom)

    # TODO: __repr__, __add__, __sub__, __mul__, __eq__, __lt__, __float__

a = Fraction(1, 2)
b = Fraction(3, 4)
print(a, b)
`,
            solution: `from math import gcd

class Fraction :
    def __init__(self, top, bottom = 1) :
        if bottom == 0 :
            raise ZeroDivisionError("분모는 0이 될 수 없습니다.")
        if bottom < 0 :                    # 부호는 분자가 가진다
            top, bottom = -top, -bottom
        g = gcd(abs(top), bottom)          # 자동 약분
        self.top = top // g
        self.bottom = bottom // g

    def __str__(self) :
        if self.bottom == 1 :
            return str(self.top)
        return "%d/%d" % (self.top, self.bottom)

    def __repr__(self) :
        return "Fraction(%d, %d)" % (self.top, self.bottom)

    def __add__(self, other) :
        return Fraction(self.top * other.bottom + other.top * self.bottom, self.bottom * other.bottom)

    def __sub__(self, other) :
        return Fraction(self.top * other.bottom - other.top * self.bottom, self.bottom * other.bottom)

    def __mul__(self, other) :
        return Fraction(self.top * other.top, self.bottom * other.bottom)

    def __eq__(self, other) :
        return self.top == other.top and self.bottom == other.bottom

    def __lt__(self, other) :
        return self.top * other.bottom < other.top * self.bottom

    def __float__(self) :
        return self.top / self.bottom

a = Fraction(1, 2)
b = Fraction(3, 4)

print(a, "+", b, "=", a + b)
print(a, "-", b, "=", a - b)
print(a, "*", b, "=", a * b)
print(a, "<", b, "→", a < b)
print(Fraction(2, 4) == Fraction(1, 2))
print(Fraction(6, 3))
print(float(Fraction(1, 4)))
print(sorted([Fraction(3, 4), Fraction(1, 2), Fraction(2, 3)]))

try :
    Fraction(1, 0)
except ZeroDivisionError as e :
    print("오류 :", e)

## 스스로 검증하기 ##
assert Fraction(2, 4) == Fraction(1, 2)
assert str(Fraction(1, 2) + Fraction(1, 2)) == "1"
assert Fraction(1, 3) < Fraction(1, 2)
print("테스트 통과!")
`,
            expect: `1/2 + 3/4 = 5/4
1/2 - 3/4 = -1/4
1/2 * 3/4 = 3/8
1/2 < 3/4 → True
True
2
0.25
[Fraction(1, 2), Fraction(2, 3), Fraction(3, 4)]
오류 : 분모는 0이 될 수 없습니다.
테스트 통과!` }
        ],
        quiz: [
          { q: '<code>print(인스턴스)</code> 를 실행할 때 자동으로 호출되어 출력할 문자열을 돌려주는 메서드는?', options: ['__init__()', '__del__()', '__repr__()', '__add__()'], answer: 2,
            explain: '__repr__() 이 돌려준 문자열이 출력됩니다.' },
          { q: 'Line 클래스에 <code>__add__(self, other): return self.length + other.length</code> 가 있을 때<pre><code>print(Line(10) + Line(25))</code></pre>의 결과는?', options: ['1025', '35', 'Line(35)', '오류'], answer: 1,
            explain: '<code>+</code> 는 __add__() 를 호출하고, 두 length 의 합 35 를 돌려줍니다.' },
          { q: '인스턴스끼리 <code>&lt;</code> 연산자로 비교할 때 호출되는 메서드는?', options: ['__lt__()', '__le__()', '__gt__()', '__eq__()'], answer: 0,
            explain: 'lt = less than(보다 작다). &lt;= 는 __le__, &gt; 는 __gt__, == 는 __eq__ 입니다.' },
          { q: '슈퍼 클래스의 추상 메서드를 <code>raise NotImplementedError()</code> 로 만들었다. 오버라이딩하지 않은 서브 클래스의 인스턴스로 그 메서드를 부르면?', options: ['아무 일도 일어나지 않는다', 'NotImplementedError 오류가 발생한다', '슈퍼 클래스의 pass 가 실행된다', '자동으로 오버라이딩된다'], answer: 1,
            explain: '부모의 메서드가 실행되면서 raise 로 오류가 발생합니다. 오버라이딩을 잊은 것을 바로 알 수 있습니다.' },
          { q: '클래스에 <code>__len__</code> 과 <code>__getitem__</code> 을 만들면 새로 할 수 있게 되는 일이 <b>아닌</b> 것은?', options: ['<code>len(객체)</code>', '<code>객체[0]</code>', '<code>for x in 객체 :</code>', '<code>객체1 + 객체2</code>'], answer: 3,
            explain: '덧셈은 <code>__add__</code> 가 담당합니다. <code>__getitem__</code> 하나만 있어도 인덱싱 · for 문 · <code>in</code> 연산이 모두 동작하는 것이 파이썬의 재미있는 점입니다.' },
          { q: '<code>abc</code> 모듈의 <code>@abstractmethod</code> 와 <code>raise NotImplementedError()</code> 의 가장 큰 차이는?', options: ['abc 쪽이 코드가 짧다', 'abc 는 <b>인스턴스를 만드는 순간</b> 막아 주고, raise 는 그 메서드를 <b>부를 때</b> 오류가 난다', 'raise 쪽은 상속을 못 쓴다', '차이가 없다'], answer: 1,
            explain: '오류를 <b>더 일찍</b> 알려 주는 것이 abc 의 장점입니다. <code>r = Triangle("삼각형")</code> 한 줄에서 바로 TypeError 가 나므로 오버라이딩을 잊은 클래스를 실행 즉시 찾을 수 있습니다.' }
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
          { layout: 'code', title: '__str__ 과 __repr__', code: `class Point :
    def __init__(self, x, y) :
        self.x, self.y = x, y

    def __repr__(self) :        # 개발자용: 다시 만들 수 있는 모양
        return "Point(%d, %d)" % (self.x, self.y)

    def __str__(self) :         # 사용자용: 읽기 좋은 모양
        return "(%d, %d) 위치" % (self.x, self.y)

p = Point(3, 4)
print(p)
print(repr(p))
print([p, p])`,
            points: ['<code>print()</code> 는 <code>__str__</code>, 리스트 안에서는 <code>__repr__</code>', '<code>__str__</code> 이 없으면 <code>__repr__</code> 을 대신 쓴다', '<b>하나만 만든다면 <code>__repr__</code></b>'],
            notes: '<p>📘 보충(중급). 출력: (3, 4) 위치 / Point(3, 4) / [Point(3, 4), Point(3, 4)].</p><p>발문: “<code>__str__</code> 만 만들면 리스트에는 무엇이 나올까요?” → 메모리 주소. 그래서 <code>__repr__</code> 이 먼저입니다.</p><p>(4분)</p>' },
          { layout: 'code', title: '__len__ · __getitem__ → 파이썬다운 객체', code: `class Playlist :
    def __init__(self, name) :
        self.name = name
        self.songs = []
    def add(self, title) :
        self.songs.append(title)
        return self
    def __len__(self) :
        return len(self.songs)
    def __getitem__(self, i) :
        return self.songs[i]

p = Playlist("드라이브")
p.add("봄날").add("첫사랑").add("밤편지")
print(len(p), p[0])
for song in p :
    print("-", song)
print("첫사랑" in p)`,
            points: ['<code>__len__</code> → <code>len(객체)</code>', '<code>__getitem__</code> → <code>객체[i]</code> · <code>for</code> · <code>in</code> 까지 한꺼번에!', '<code>return self</code> → <code>add().add()</code> 이어 쓰기'],
            notes: '<p>📘 보충(중급). 이 교시에서 가장 “와!” 하는 슬라이드입니다. <code>__getitem__</code> 하나로 for 문과 in 연산까지 동작하는 것을 실행해서 보여 주세요.</p><p>정리: 내가 만든 클래스를 <b>이미 아는 문법</b>으로 쓸 수 있게 만드는 것이 “파이썬답다” 는 뜻입니다.</p><p>(5분)</p>' },
          { layout: 'code', title: 'abc 로 만드는 진짜 추상 클래스', code: `from abc import ABC, abstractmethod

class Figure(ABC) :
    @abstractmethod
    def area(self) :
        pass
    def describe(self) :
        return "넓이 %.1f" % self.area()

class Rect(Figure) :
    def __init__(self, w, h) :
        self.w, self.h = w, h
    def area(self) :
        return self.w * self.h

class Triangle(Figure) :      # area() 를 깜빡!
    pass

print(Rect(5, 10).describe())
try :
    Triangle()
except TypeError as e :
    print("오류 :", e)`,
            points: ['<code>ABC</code> 상속 + <code>@abstractmethod</code>', '오버라이딩을 잊으면 <b>인스턴스를 만들 때</b> 오류', 'raise 방식보다 <b>더 일찍</b> 알려 준다', '부모는 <code>area()</code> 를 쓰는 메서드를 미리 만들 수 있다'],
            notes: '<p>📘 보충(중급). <code>describe()</code> 를 가리키며 “부모는 넓이를 구하는 방법을 모르는데도 그것을 쓰는 코드를 미리 쓸 수 있다” 를 강조하세요 — 약속(인터페이스)의 힘입니다.</p><p>(5분)</p>' },
          { layout: 'code', title: '사용자 정의 예외 클래스', code: `class InsufficientFundsError(Exception) :
    def __init__(self, need) :
        super().__init__("%d원이 모자랍니다." % need)
        self.need = need

class Account :
    def __init__(self, balance) :
        self.balance = balance
    def withdraw(self, money) :
        if money > self.balance :
            raise InsufficientFundsError(money - self.balance)
        self.balance -= money
        return self.balance

acc = Account(10000)
print(acc.withdraw(3000))
try :
    acc.withdraw(50000)
except InsufficientFundsError as e :
    print("실패 :", e, "/ 부족액", e.need)`,
            points: ['예외도 클래스! <code>Exception</code> 을 상속', '이름은 <code>~Error</code> 로 끝내는 관례', '<code>self.need</code> 처럼 <b>추가 정보</b>를 실어 보낼 수 있다', 'print 로 알리는 것과 달리 <b>무시할 수 없다</b>'],
            notes: '<p>11장의 예외 처리와 12장의 클래스가 만나는 지점입니다.</p><p>발문: “출금 실패를 print 로 알리면 무엇이 문제일까요?” → 부른 쪽이 성공/실패를 알 수 없고, 잘못된 상태로 계속 진행됩니다.</p><p>(5분)</p>' },
          { layout: 'code', title: 'assert 로 클래스 스스로 검증하기', code: `class Money :
    def __init__(self, amount) :
        if amount < 0 :
            raise ValueError("0원 이상이어야 합니다.")
        self.amount = amount
    def __add__(self, other) :
        return Money(self.amount + other.amount)
    def __eq__(self, other) :
        return self.amount == other.amount
    def __repr__(self) :
        return "Money(%d)" % self.amount

def testMoney() :
    assert Money(1000).amount == 1000
    assert Money(1000) + Money(500) == Money(1500)
    try :
        Money(-100)
        assert False, "음수인데 오류가 없다!"
    except ValueError :
        pass
    print("모든 테스트 통과!")

testMoney()`,
            points: ['<code>assert 조건, "메시지"</code>', '조건이 참이면 조용히 지나간다', '고친 뒤 테스트만 다시 실행 → 몇 초 만에 확인', '⚠ 사용자 입력 검사에는 쓰지 말 것'],
            notes: '<p>📘 보충(중급). 일부러 <code>__add__</code> 를 <code>-</code> 로 바꿔서 테스트가 <b>실패하는</b> 모습을 보여 주면 효과가 큽니다(AssertionError: 덧셈이 잘못됨).</p><p>실무의 unittest · pytest 도 생각하는 방식은 같다고 한 줄 소개합니다.</p><p>(4분)</p>' },
          { layout: 'practice', title: '🚀 프로젝트 12-6. 분수(Fraction) 클래스', desc: '1/2 + 3/4 를 분수 그대로 계산하는 클래스. 자동 약분 · 사칙연산 · 비교 · 정렬까지.',
            starter: `from math import gcd

class Fraction :
    def __init__(self, top, bottom = 1) :
        # TODO: 분모 0 검사, 약분
        self.top, self.bottom = top, bottom
    # TODO: __str__, __add__, __eq__, __lt__

print(Fraction(1, 2).top)
`,
            solution: `from math import gcd

class Fraction :
    def __init__(self, top, bottom = 1) :
        if bottom == 0 :
            raise ZeroDivisionError("분모는 0이 될 수 없습니다.")
        if bottom < 0 :
            top, bottom = -top, -bottom
        g = gcd(abs(top), bottom)
        self.top, self.bottom = top // g, bottom // g

    def __str__(self) :
        return str(self.top) if self.bottom == 1 else "%d/%d" % (self.top, self.bottom)

    def __repr__(self) :
        return "Fraction(%d, %d)" % (self.top, self.bottom)

    def __add__(self, other) :
        return Fraction(self.top * other.bottom + other.top * self.bottom, self.bottom * other.bottom)

    def __eq__(self, other) :
        return self.top == other.top and self.bottom == other.bottom

    def __lt__(self, other) :
        return self.top * other.bottom < other.top * self.bottom

print(Fraction(1, 2) + Fraction(3, 4))
print(Fraction(2, 4) == Fraction(1, 2))
print(sorted([Fraction(3, 4), Fraction(1, 2), Fraction(2, 3)]))
`,
            notes: '<p>학생 문서에는 뺄셈 · 곱셈 · float 변환 · assert 검증까지 있습니다.</p><p>지도 포인트: ① 약분을 <b>생성자에서</b> 하면 모든 연산 결과가 저절로 약분된다 ② 연산 결과로 <b>새 Fraction</b> 을 돌려준다 ③ <code>__lt__</code> 만 있으면 <code>sorted()</code> 가 공짜로 된다.</p><p>(10분, 남은 것은 과제)</p>' },
          { layout: 'quiz', title: '확인 문제', q: '__add__(self, other) 가 self.length + other.length 를 돌려줄 때<br>print(Line(10) + Line(25)) 의 결과는?', options: ['1025', '35', 'Line(35)', '오류'], answer: 1,
            explain: '+ 는 __add__() 를 호출하고 35 를 돌려줍니다.',
            notes: '<p>“__add__ 가 없으면?” 도 물어보세요 → TypeError: unsupported operand type(s) for +.</p><p>(2분)</p>' },
          { layout: 'practice', title: '실습 12-21. 돈(Money) 클래스', desc: 'print 하면 “12,000원”, + 하면 새 Money, &gt; 로 비교 가능한 Money 클래스를 만드세요.',
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
          '멀티 프로세싱의 개념과 멀티 스레드와의 차이를 설명할 수 있다',
          '경쟁 조건(race condition)이 왜 생기는지 설명하고, 상황에 맞는 동시 실행 방법을 고를 수 있다'
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
          { type: 'callout', kind: 'more', title: '📘 집 PC 에서 실행해 보기', html: '<a href="https://www.python.org" target="_blank">python.org</a> 에서 파이썬을 설치하면 IDLE 이 함께 설치됩니다. IDLE 에서 [File] → [New File] 로 Code12-12 를 붙여 넣고 F5 로 실행하면 스레드 결과를 볼 수 있습니다. Code12-13 은 파일로 저장한 뒤 명령 프롬프트(cmd)에서 <code>python 파일이름.py</code> 로 실행하세요.' },

          { type: 'h', text: '스레드가 같은 객체를 함께 고칠 때 — 경쟁 조건' },
          { type: 'p', html: '멀티 스레드의 가장 큰 장점은 <b>메모리를 함께 쓴다</b>는 것입니다. 그리고 가장 큰 위험도 바로 그것입니다. 두 스레드가 같은 인스턴스의 필드를 동시에 고치면 <mark>한쪽의 작업이 통째로 사라질 수 있습니다.</mark> 이것을 <b>경쟁 조건(race condition)</b> 이라고 합니다.' },
          { type: 'p', html: '<code>self.count += 1</code> 은 한 줄이지만 실제로는 <b>세 단계</b>입니다. ① 값을 읽고 ② 1을 더하고 ③ 다시 넣습니다. 스레드는 이 세 단계 사이에 끼어들 수 있습니다. 브라우저에서는 스레드를 만들 수 없으므로, <b>끼어드는 순간을 손으로 흉내</b> 내어 무슨 일이 벌어지는지 보겠습니다.' },
          { type: 'code', title: '추가 예제. 사라진 1 — 경쟁 조건 흉내 내기', code: `class Counter :
    def __init__(self) :
        self.count = 0

    def add(self) :
        value = self.count      # ① 읽고
        value = value + 1       # ② 더하고
        self.count = value      # ③ 쓴다   ← 여기 사이에 끼어들면?

## 스레드 A 와 B 가 번갈아 실행되는 상황을 손으로 흉내 내기 ##
c = Counter()
aValue = c.count                # A: ① 읽기 → 0
bValue = c.count                # B: ① 읽기 → 0   (A 가 아직 쓰기 전!)
c.count = aValue + 1            # A: ③ 쓰기 → 1
c.count = bValue + 1            # B: ③ 쓰기 → 1   (A 의 결과를 덮어씀)

print("두 번 더했는데 결과는 :", c.count)

## 끼어들지 않으면 정상 ##
c2 = Counter()
c2.add()
c2.add()
print("차례대로 더하면 :", c2.count)`,
            expect: `두 번 더했는데 결과는 : 1
차례대로 더하면 : 2`,
            desc: '두 번 더했는데 1 이 되었습니다. 진짜 스레드 프로그램에서는 이런 일이 <b>가끔만</b> 일어나기 때문에 더 무섭습니다 — 100번 중 99번은 잘 동작하다가 한 번 틀리는 버그가 되죠. 그래서 “여러 스레드가 함께 쓰는 값” 은 특별히 보호해야 합니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: Lock 으로 지키기', html: '<code>threading.Lock</code> 은 “한 번에 한 스레드만 들어가는 방” 을 만들어 줍니다. <code>with</code> 문과 함께 쓰는 것이 관례입니다.<pre><code>import threading\n\nclass Counter :\n    def __init__(self) :\n        self.count = 0\n        self.lock = threading.Lock()\n\n    def add(self) :\n        with self.lock :          # 한 번에 한 스레드만\n            self.count += 1</code></pre>다만 자물쇠를 잘못 쓰면 서로가 서로를 기다리며 영원히 멈추는 <b>교착 상태(deadlock)</b> 가 생길 수 있습니다. 그래서 실무에서는 “공유하는 값을 아예 만들지 않는” 설계(각 스레드가 결과만 돌려주고 마지막에 합치기)를 더 좋아합니다.' },

          { type: 'h', text: '스레드 · 프로세스 · 비동기 — 언제 무엇을 쓸까' },
          { type: 'p', html: '“동시에” 를 만드는 방법은 세 가지가 있습니다. 무엇을 고를지는 <b>기다리는 일인가, 계산하는 일인가</b> 로 판단합니다.' },
          { type: 'table', caption: '동시에 실행하는 세 가지 방법', head: ['방법', '알맞은 일', '이유', '예'], rows: [
            ['<b>멀티 스레드</b><br><code>threading</code>', '기다림이 많은 일', '기다리는 동안 다른 스레드가 일한다', '파일 읽기, 인터넷에서 내려받기'],
            ['<b>멀티 프로세싱</b><br><code>multiprocessing</code>', '계산이 많은 일', 'CPU 코어를 진짜로 여러 개 쓴다', '이미지 변환, 큰 수 계산'],
            ['<b>비동기</b><br><code>asyncio</code>', '기다림이 아주 많은 일', '스레드 없이 한 흐름에서 번갈아', '웹 서버, 채팅 프로그램'],
            ['<b>그냥 순서대로</b>', '나머지 대부분', '가장 간단하고 버그가 없다', '이 강좌의 거의 모든 예제']
          ] },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: concurrent.futures — 더 쉬운 방법', html: '요즘 파이썬에서는 <code>Thread</code> 를 직접 만들기보다 <code>concurrent.futures</code> 를 씁니다. 스레드를 몇 개 만들지, 언제 끝났는지, 결과를 어떻게 받을지를 알아서 처리해 줍니다.<pre><code>from concurrent.futures import ThreadPoolExecutor\n\ndef calcSum(n) :\n    return sum(range(1, n + 1))\n\nwith ThreadPoolExecutor(max_workers = 3) as pool :\n    results = pool.map(calcSum, [1000, 100000, 10000000])\n\nfor r in results :\n    print(r)</code></pre><code>ProcessPoolExecutor</code> 로 이름만 바꾸면 멀티 프로세싱이 됩니다. (이 코드도 브라우저에서는 실행되지 않습니다 — 집 PC 에서 해 보세요)' },
          { type: 'callout', kind: 'tip', title: '객체지향과 동시 실행', html: '이 교시의 예제들이 모두 <b>클래스</b>로 되어 있다는 점을 눈여겨보세요. “달리는 자동차”, “합을 구하는 계산기” 처럼 <mark>각자 자기 상태(이름 · 진행 정도)를 기억하는 일감</mark>을 만들 때 객체는 아주 잘 어울립니다. 스레드를 쓰든, 번갈아 실행하든, 순서대로 하든 <b>일감 클래스는 그대로</b>이고 “어떻게 돌릴지” 만 바뀝니다.' }
        ],
        practice: [
          { title: '실습 12-24. 다운로드 진행률 클래스', level: 1,
            desc: '<p>파일 하나를 내려받는 일을 <code>Download</code> 클래스로 만드세요. 한 번에 조금씩 진행하는 <code>step(amount)</code> 메서드가 핵심입니다.</p><ul><li>필드: <code>name</code>(파일 이름), <code>size</code>(전체 크기 MB), <code>done</code>(받은 크기, 처음 0)</li><li><code>step(amount)</code> — amount 만큼 받고, 전체 크기를 넘으면 전체 크기로 맞춘 뒤 <code>이름 : N% (받은/전체MB)</code> 출력</li><li><code>isDone()</code> — 다 받았으면 True</li></ul><pre><code>영화.mp4 : 30% (30/100MB)\n영화.mp4 : 60% (60/100MB)\n영화.mp4 : 90% (90/100MB)\n영화.mp4 : 100% (100/100MB)\n완료 : True</code></pre>',
            hint: '퍼센트는 <code>self.done * 100 // self.size</code> 로 구하면 정수로 나옵니다. <code>time.sleep(0.05)</code> 를 넣으면 진짜로 내려받는 느낌이 납니다.',
            starter: `import time

class Download :
    def __init__(self, name, size) :
        self.name = name
        self.size = size
        self.done = 0

    def step(self, amount) :
        # TODO: 받은 크기 늘리고, 넘치면 맞추고, 진행률 출력
        pass

    def isDone(self) :
        # TODO: 다 받았는지
        return False

d = Download("영화.mp4", 100)
for i in range(4) :
    d.step(30)
    time.sleep(0.05)
print("완료 :", d.isDone())
`,
            solution: `import time

class Download :
    def __init__(self, name, size) :
        self.name = name
        self.size = size
        self.done = 0

    def step(self, amount) :
        self.done += amount
        if self.done > self.size :
            self.done = self.size
        percent = self.done * 100 // self.size
        print("%s : %d%% (%d/%dMB)" % (self.name, percent, self.done, self.size))

    def isDone(self) :
        return self.done >= self.size

d = Download("영화.mp4", 100)
for i in range(4) :
    d.step(30)
    time.sleep(0.05)
print("완료 :", d.isDone())
`,
            expect: `영화.mp4 : 30% (30/100MB)
영화.mp4 : 60% (60/100MB)
영화.mp4 : 90% (90/100MB)
영화.mp4 : 100% (100/100MB)
완료 : True` },
          { title: '실습 12-25. 작업(Task) 클래스와 순차 실행', level: 1,
            desc: '<p>요리 작업을 <code>Task</code> 클래스로 만들고 <b>순서대로</b> 실행해 보세요. 스레드가 없으면 앞 작업이 끝나야 다음 작업이 시작된다는 것을 눈으로 확인하는 실습입니다.</p><ul><li>생성자: 작업 이름(<code>name</code>)과 걸리는 단계 수(<code>steps</code>)</li><li><code>run()</code> — <code>이름 작업 i/전체</code> 를 단계 수만큼 출력하고(<code>time.sleep(0.05)</code>), 마지막에 <code>이름 끝!</code> 출력</li></ul><pre><code>굽기 작업 1/2\n굽기 작업 2/2\n굽기 끝!\n끓이기 작업 1/3\n끓이기 작업 2/3\n끓이기 작업 3/3\n끓이기 끝!</code></pre>',
            hint: '<code>for i in range(1, self.steps + 1) :</code> 로 1부터 세면 <code>1/2</code>, <code>2/2</code> 처럼 출력하기 좋습니다.',
            starter: `import time

class Task :
    def __init__(self, name, steps) :
        self.name = name
        self.steps = steps

    def run(self) :
        # TODO: steps 번 반복하며 진행 상황 출력, 마지막에 "끝!"
        pass

tasks = [Task("굽기", 2), Task("끓이기", 3)]
for t in tasks :
    t.run()
`,
            solution: `import time

class Task :
    def __init__(self, name, steps) :
        self.name = name
        self.steps = steps

    def run(self) :
        for i in range(1, self.steps + 1) :
            print("%s 작업 %d/%d" % (self.name, i, self.steps))
            time.sleep(0.05)
        print("%s 끝!" % self.name)

tasks = [Task("굽기", 2), Task("끓이기", 3)]
for t in tasks :
    t.run()
`,
            expect: `굽기 작업 1/2
굽기 작업 2/2
굽기 끝!
끓이기 작업 1/3
끓이기 작업 2/3
끓이기 작업 3/3
끓이기 끝!` },
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
          { title: '실습 12-26. 번갈아 달리는 자동차 경주', level: 2,
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
            nondeterministic: true },
          { title: '실습 12-27. 번갈아 실행하는 스케줄러 만들기', level: 2,
            desc: '<p>스레드 없이 여러 작업을 “동시에” 진행하는 <b>스케줄러</b>를 객체지향으로 만듭니다. 운영체제가 스레드를 번갈아 실행하는 방식(라운드 로빈)을 흉내 내는 것입니다.</p><ul><li><code>Task</code> — 이름(name), 전체 단계 수(steps), 진행한 수(done). <code>step()</code> 은 <b>한 걸음만</b> 진행하고 <code>이름 done/steps</code> 출력, <code>isDone()</code> 은 끝났는지 알려 준다</li><li><code>Scheduler</code> — 작업들을 <b>가지고</b> 있다가(<code>add()</code>) <code>runAll()</code> 에서 <b>아직 안 끝난 작업만</b> 한 걸음씩 돌린다. 한 바퀴마다 <code>--- N번째 차례 ---</code> 출력, 모두 끝나면 <code>모든 작업 완료!</code></li></ul><pre><code>--- 1번째 차례 ---\n다운로드 1/3\n압축풀기 1/1\n설치 1/2\n--- 2번째 차례 ---\n다운로드 2/3\n설치 2/2\n--- 3번째 차례 ---\n다운로드 3/3\n모든 작업 완료!</code></pre>',
            hint: '아직 안 끝난 작업만 고르려면 <code>working = [t for t in self.tasks if not t.isDone()]</code>. 이 목록이 비면 <code>break</code> 로 반복을 끝냅니다. 차례 번호는 반복 안에서 1씩 늘립니다.',
            starter: `class Task :
    def __init__(self, name, steps) :
        self.name = name
        self.steps = steps
        self.done = 0

    def step(self) :
        # TODO: 한 걸음 진행하고 출력
        pass

    def isDone(self) :
        return self.done >= self.steps

class Scheduler :
    def __init__(self) :
        self.tasks = []

    def add(self, task) :
        self.tasks.append(task)

    def runAll(self) :
        # TODO: 안 끝난 작업만 한 걸음씩, 모두 끝날 때까지
        pass

s = Scheduler()
s.add(Task("다운로드", 3))
s.add(Task("압축풀기", 1))
s.add(Task("설치", 2))
s.runAll()
`,
            solution: `class Task :
    def __init__(self, name, steps) :
        self.name = name
        self.steps = steps
        self.done = 0

    def step(self) :                    # 한 걸음만 진행한다
        self.done += 1
        print("%s %d/%d" % (self.name, self.done, self.steps))

    def isDone(self) :
        return self.done >= self.steps

class Scheduler :                       # 작업들을 '가지고' 번갈아 돌린다
    def __init__(self) :
        self.tasks = []

    def add(self, task) :
        self.tasks.append(task)

    def runAll(self) :
        turn = 0
        while True :
            working = [t for t in self.tasks if not t.isDone()]
            if not working :
                break
            turn += 1
            print("--- %d번째 차례 ---" % turn)
            for t in working :
                t.step()
        print("모든 작업 완료!")

s = Scheduler()
s.add(Task("다운로드", 3))
s.add(Task("압축풀기", 1))
s.add(Task("설치", 2))
s.runAll()
`,
            expect: `--- 1번째 차례 ---
다운로드 1/3
압축풀기 1/1
설치 1/2
--- 2번째 차례 ---
다운로드 2/3
설치 2/2
--- 3번째 차례 ---
다운로드 3/3
모든 작업 완료!` }
        ],
        quiz: [
          { q: '멀티 스레드에 대한 설명으로 옳은 것은?', options: ['프로그램을 여러 개 동시에 실행하는 것', '프로그램 하나에서 여러 작업을 동시에 처리하는 기능', '클래스를 여러 개 상속받는 것', '메서드를 여러 번 오버라이딩하는 것'], answer: 1,
            explain: '멀티 스레드는 프로그램 하나 안에서 여러 작업 흐름을 동시에 진행하는 기능입니다. 프로그램 여러 개는 멀티 프로세싱입니다.' },
          { q: '<code>car1</code> 의 runCar() 메서드를 스레드로 실행하는 올바른 코드는?', options: ['threading.Thread(target = car1.runCar())', 'threading.Thread(target = car1.runCar)', 'threading.Thread(car1)', 'threading.runCar(car1)'], answer: 1,
            explain: 'target 에는 괄호 없이 메서드 자체를 넘깁니다. 괄호를 붙이면 그 자리에서 바로 실행되어 버립니다.' },
          { q: 'Code12-11(스레드 없음)에서 car1.runCar(), car2.runCar() 순서로 호출하면 출력은?', options: ['자동차1과 자동차2가 섞여서 나온다', '자동차1이 3번 다 나온 뒤 자동차2가 나온다', '자동차2가 먼저 나온다', '아무것도 출력되지 않는다'], answer: 1,
            explain: '일반 프로그램은 앞 작업(car1.runCar)이 끝나야 다음 작업을 시작합니다.' },
          { q: '멀티 프로세싱 코드에서 메인 코드를 <code>if __name__ == "__main__" :</code> 안에 넣는 이유는?', options: ['코드를 짧게 하려고', '새 프로세스가 파일을 다시 불러올 때 메인 코드가 또 실행되지 않게 하려고', '스레드를 쓰기 위해', '클래스를 상속하기 위해'], answer: 1,
            explain: '새 프로세스는 파일을 모듈로 다시 불러옵니다. 이 조건이 없으면 프로세스를 만드는 코드가 반복 실행되어 문제가 생깁니다.' },
          { q: '두 스레드가 같은 인스턴스의 <code>self.count += 1</code> 을 동시에 실행했더니 2가 아니라 1이 되었습니다. 원인은?', options: ['count 가 클래스 변수라서', '<code>+=</code> 는 읽기 · 더하기 · 쓰기 세 단계여서 그 사이에 끼어들 수 있기 때문(경쟁 조건)', '스레드는 숫자를 더할 수 없어서', 'time.sleep 을 넣지 않아서'], answer: 1,
            explain: '한 줄처럼 보여도 실제로는 세 단계입니다. 둘 다 0을 읽은 뒤 각각 1을 쓰면 한쪽의 작업이 사라집니다. <code>threading.Lock</code> 으로 한 번에 하나만 들어가게 막아야 합니다.' },
          { q: '큰 이미지 1000장을 작게 줄이는 <b>계산이 많은</b> 작업을 빠르게 하려면?', options: ['멀티 스레드 (threading) — GIL 때문에 파이썬 코드는 한 번에 하나만 실행된다', '멀티 프로세싱 (multiprocessing) — CPU 코어를 여러 개 쓴다', '그냥 for 문이 언제나 가장 빠르다', 'time.sleep 을 늘린다'], answer: 1,
            explain: '파이썬(CPython)에는 GIL 이 있어 계산 작업은 스레드를 늘려도 빨라지지 않습니다. 기다림이 많은 일(파일 · 네트워크)에는 스레드가, 계산이 많은 일에는 프로세스가 알맞습니다.' }
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
          { layout: 'code', title: '⚠ 사라진 1 — 경쟁 조건', code: `class Counter :
    def __init__(self) :
        self.count = 0

    def add(self) :
        value = self.count      # ① 읽고
        value = value + 1       # ② 더하고
        self.count = value      # ③ 쓴다

# 두 스레드가 끼어드는 상황을 손으로 흉내 내기
c = Counter()
aValue = c.count                # A: 읽기 → 0
bValue = c.count                # B: 읽기 → 0
c.count = aValue + 1            # A: 쓰기 → 1
c.count = bValue + 1            # B: 쓰기 → 1

print("두 번 더했는데 :", c.count)`,
            points: ['<code>self.count += 1</code> 은 사실 <b>세 단계</b>', '사이에 끼어들면 한쪽 작업이 사라진다', '진짜 스레드에서는 <b>가끔만</b> 생겨서 더 무섭다', '해결: <code>threading.Lock</code>'],
            notes: '<p>📘 보충(중급). 브라우저에서는 스레드를 못 만드니 “끼어드는 순간” 을 손으로 흉내 냈습니다. 출력은 1 입니다.</p><p>발문: “은행 계좌에서 이런 일이 생기면?” → 입금한 돈이 사라집니다. 동시성 버그가 왜 중요한지 실감하게 하세요.</p><p>(5분)</p>' },
          { layout: 'bullets', title: '공유 값을 지키는 방법 (중급)', lead: '여러 스레드가 같은 객체를 고칠 때는 보호 장치가 필요하다',
            bullets: ['<code>threading.Lock()</code> = 한 번에 한 스레드만 들어가는 방', '<code>with self.lock :</code> 안에서 공유 값을 고친다', '자물쇠를 잘못 쓰면 서로 기다리는 <b>교착 상태(deadlock)</b>', ['더 좋은 방법', ['공유하는 값을 아예 만들지 않기', '각자 결과만 돌려주고 마지막에 합치기', '<code>concurrent.futures</code> 의 <code>ThreadPoolExecutor</code> 사용']]],
            notes: '<p>📘 보충(중급). 코드는 학생 문서의 📘 상자에 있습니다.</p><p><code>ThreadPoolExecutor</code> 는 스레드 개수 · 종료 대기 · 결과 수집을 알아서 해 주고, 이름만 <code>ProcessPoolExecutor</code> 로 바꾸면 멀티 프로세싱이 된다는 점을 소개하세요.</p><p>시간이 없으면 “이런 것이 있다” 정도로 넘어가도 됩니다.</p><p>(3분)</p>' },
          { layout: 'table', title: '언제 무엇을 쓸까', lead: '기다리는 일인가, 계산하는 일인가로 판단한다', head: ['방법', '알맞은 일', '예'],
            rows: [['멀티 스레드 <code>threading</code>', '기다림이 많은 일', '파일 읽기, 내려받기'], ['멀티 프로세싱 <code>multiprocessing</code>', '계산이 많은 일 (CPU 여러 개)', '이미지 변환, 큰 수 계산'], ['비동기 <code>asyncio</code>', '기다림이 아주 많은 일', '웹 서버, 채팅'], ['그냥 순서대로', '나머지 대부분', '이 강좌의 거의 모든 예제']],
            notes: '<p>정리 슬라이드입니다. GIL 때문에 “계산이 많은 일 = 프로세스” 라는 점을 다시 강조하세요.</p><p>마지막 줄이 중요합니다: <b>대부분의 프로그램은 동시 실행이 필요 없습니다.</b> 필요할 때만 쓰는 도구라는 점을 알려 주세요.</p><p>(3분)</p>' },
          { layout: 'practice', title: '실습 12-27. 번갈아 실행하는 스케줄러', desc: 'Task(한 걸음씩 진행) 와 Scheduler(작업들을 가지고 번갈아 돌리기) 로 운영체제의 라운드 로빈을 흉내 내세요.',
            starter: `class Task :
    def __init__(self, name, steps) :
        self.name = name
        self.steps = steps
        self.done = 0
    # TODO: step(), isDone()

# TODO: class Scheduler - add(), runAll()
`,
            solution: `class Task :
    def __init__(self, name, steps) :
        self.name = name
        self.steps = steps
        self.done = 0

    def step(self) :
        self.done += 1
        print("%s %d/%d" % (self.name, self.done, self.steps))

    def isDone(self) :
        return self.done >= self.steps

class Scheduler :
    def __init__(self) :
        self.tasks = []

    def add(self, task) :
        self.tasks.append(task)

    def runAll(self) :
        turn = 0
        while True :
            working = [t for t in self.tasks if not t.isDone()]
            if not working :
                break
            turn += 1
            print("--- %d번째 차례 ---" % turn)
            for t in working :
                t.step()
        print("모든 작업 완료!")

s = Scheduler()
s.add(Task("다운로드", 3))
s.add(Task("압축풀기", 1))
s.add(Task("설치", 2))
s.runAll()
`,
            notes: '<p>12장의 마무리 실습입니다. 상속 없이 <b>컴포지션</b>(Scheduler 가 Task 들을 가진다)만으로 만드는 점을 짚어 주세요.</p><p>지도 포인트: 끝난 작업을 목록에서 빼는 부분(<code>if not t.isDone()</code>)이 핵심입니다. 압축풀기가 1번 만에 끝나 2번째 차례부터 빠지는 것을 출력에서 확인하게 하세요.</p><p>(8분)</p>' },
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
