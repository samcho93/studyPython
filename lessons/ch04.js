/* Chapter 04. 연산자 (강의자료: 파이썬 for Beginner 3판 Chapter 04) */
(function () {
  /* ---------- 그림 도우미 (비트 연산 · 시프트) ---------- */
  function bitFig(op, a, b, r, la, lb, lr, note) {
    var n = a.length, bw = Math.max(46, String(a[0]).length * 16 + 14), cw = bw + 12, x0 = 90, W = x0 + n * cw + 250, s = '';
    s += '<svg viewBox="0 0 ' + W + ' 250" width="100%" style="max-width:' + W + 'px" font-family="monospace">';
    s += '<text x="' + (x0 + n * cw / 2) + '" y="20" text-anchor="middle" font-size="17" fill="var(--warn)" font-weight="bold">2진수</text>';
    s += '<text x="' + (x0 + n * cw + 170) + '" y="20" text-anchor="middle" font-size="17" fill="var(--warn)" font-weight="bold">값</text>';
    for (var i = 0; i < n; i++) {
      var x = x0 + i * cw, h = bw / 2;
      s += '<rect x="' + x + '" y="32" width="' + bw + '" height="88" rx="9" fill="var(--card)" stroke="var(--danger)" stroke-width="2"/>';
      s += '<text x="' + (x + h) + '" y="66" text-anchor="middle" font-size="24" font-weight="bold" fill="var(--fg)">' + a[i] + '</text>';
      s += '<text x="' + (x + h) + '" y="106" text-anchor="middle" font-size="24" font-weight="bold" fill="var(--fg)">' + b[i] + '</text>';
      s += '<path d="M' + (x + h) + ' 142 V172" stroke="var(--warn)" stroke-width="5"/><path d="M' + (x + h - 10) + ' 168 L' + (x + h) + ' 182 L' + (x + h + 10) + ' 168 Z" fill="var(--warn)"/>';
      s += '<text x="' + (x + h) + '" y="212" text-anchor="middle" font-size="26" font-weight="bold" fill="var(--accent)">' + r[i] + '</text>';
    }
    s += '<text x="' + (x0 - 40) + '" y="108" text-anchor="middle" font-size="28" font-weight="bold" fill="var(--fg)">' + op + '</text>';
    s += '<path d="M' + (x0 - 12) + ' 112 V130 H' + (x0 + n * cw) + '" fill="none" stroke="var(--muted)" stroke-width="2"/>';
    var xr = x0 + n * cw + 10;
    s += '<text x="' + xr + '" y="66" font-size="18" fill="var(--muted)">⟵ ' + la + '</text>';
    s += '<text x="' + xr + '" y="106" font-size="18" fill="var(--muted)">⟵ ' + lb + '</text>';
    s += '<text x="' + xr + '" y="212" font-size="18" font-weight="bold" fill="var(--accent)">⟶ ' + lr + '</text>';
    if (note) s += '<text x="' + xr + '" y="160" font-size="16" fill="var(--ok)">' + note + '</text>';
    s += '<text x="' + (x0 + n * cw / 2) + '" y="242" text-anchor="middle" font-size="15" fill="var(--muted)">각 자리(비트)끼리 따로 계산한다</text>';
    return s + '</svg>';
  }

  function shiftFig(dir, bits, k, from, to) {
    var cw = 46, x0 = 150, n = bits.length, W = x0 + n * cw + 170, s = '', i;
    var res = dir === 'L' ? bits.slice(k) + '0'.repeat(k) : '0'.repeat(k) + bits.slice(0, n - k);
    s += '<svg viewBox="0 0 ' + W + ' 270" width="100%" style="max-width:' + W + 'px" font-family="monospace">';
    s += '<text x="' + (x0 + n * cw / 2) + '" y="20" text-anchor="middle" font-size="17" fill="var(--ok)" font-weight="bold">' + (dir === 'L' ? '왼쪽' : '오른쪽') + '으로 ' + k + '칸 이동 (' + (dir === 'L' ? '&lt;&lt;' : '&gt;&gt;') + ' ' + k + ')</text>';
    s += '<text x="60" y="64" text-anchor="middle" font-size="22" font-weight="bold" fill="var(--warn)">' + from + '</text>';
    s += '<text x="60" y="184" text-anchor="middle" font-size="22" font-weight="bold" fill="var(--warn)">' + to + '</text>';
    s += '<path d="M60 76 V150" stroke="var(--warn)" stroke-width="4"/><path d="M50 146 L60 162 L70 146 Z" fill="var(--warn)"/>';
    for (i = 0; i < n; i++) {
      var x = x0 + i * cw;
      s += '<rect x="' + x + '" y="40" width="' + cw + '" height="36" fill="var(--card)" stroke="var(--fg)" stroke-width="1.5"/>';
      s += '<text x="' + (x + cw / 2) + '" y="65" text-anchor="middle" font-size="20" font-weight="bold" fill="var(--fg)">' + bits[i] + '</text>';
      var fill = (dir === 'L' ? i >= n - k : i < k);
      s += '<rect x="' + x + '" y="160" width="' + cw + '" height="36" fill="' + (fill ? 'var(--accent2)' : 'var(--card)') + '" fill-opacity="' + (fill ? '0.35' : '1') + '" stroke="var(--fg)" stroke-width="1.5"/>';
      s += '<text x="' + (x + cw / 2) + '" y="185" text-anchor="middle" font-size="20" font-weight="bold" fill="var(--fg)">' + res[i] + '</text>';
      var j = dir === 'L' ? i - k : i + k;
      s += '<line x1="' + (x + cw / 2) + '" y1="78" x2="' + (x0 + j * cw + cw / 2) + '" y2="156" stroke="var(--danger)" stroke-width="1.6" opacity="0.8"/>';
    }
    for (i = 0; i < k; i++) {
      var lx = dir === 'L' ? x0 - (k - i) * (cw + 6) - 8 : x0 + n * cw + 14 + i * (cw + 6);
      var lb = dir === 'L' ? bits[i] : bits[n - k + i];
      s += '<rect x="' + lx + '" y="160" width="' + cw + '" height="36" fill="none" stroke="var(--muted)" stroke-dasharray="5 4" stroke-width="1.5"/>';
      s += '<text x="' + (lx + cw / 2) + '" y="185" text-anchor="middle" font-size="20" fill="var(--muted)">' + lb + '</text>';
    }
    var lostX = dir === 'L' ? x0 - 60 : x0 + n * cw + 60;
    var fillX = dir === 'L' ? x0 + (n - 1) * cw : x0 + cw;
    s += '<text x="' + lostX + '" y="228" text-anchor="middle" font-size="16" fill="var(--muted)">밀려난 ' + k + '비트는 사라짐</text>';
    s += '<text x="' + fillX + '" y="252" text-anchor="middle" font-size="16" fill="var(--accent2)">빈 자리는 0으로 채움</text>';
    return s + '</svg>';
  }

  var PROG2 = "import turtle\nimport random\n\n## 전역 변수 선언 부분 ##\nswidth, sheight, pSize, exitCount = 300, 300, 3, 0\nr, g, b, angle, dist, curX, curY = [0] * 7\n\n## 메인 코드 부분 ##\nturtle.title('거북이가 맘대로 다니기')\nturtle.shape('turtle')\nturtle.pensize(pSize)\nturtle.setup(width = swidth + 30, height = sheight + 30)\nturtle.screensize(swidth, sheight)\n\nwhile True :\n    r = random.random()\n    g = random.random()\n    b = random.random()\n    turtle.pencolor((r, g, b))\n\n    angle = random.randrange(0, 360)\n    dist = random.randrange(1, 100)\n    turtle.left(angle)\n    turtle.forward(dist)\n    curX = turtle.xcor()\n    curY = turtle.ycor()\n\n    if (-swidth / 2 <= curX and curX <= swidth / 2) and (-sheight / 2 <= curY and curY <= sheight / 2) :\n        pass\n    else :\n        turtle.penup()\n        turtle.goto(0, 0)\n        turtle.pendown()\n\n        exitCount += 1\n        if exitCount >= 5 :\n            break\n\nturtle.done()\n";

  var PROG1 = '## 변수 선언 부분 ##\nmoney, c500, c100, c50, c10 = 0, 0, 0, 0, 0\n\n## 메인 코드 부분 ##\nmoney = int(input("교환할 돈은 얼마? "))\n\nc500 = money // 500\nmoney %= 500\n\nc100 = money // 100\nmoney %= 100\n\nc50 = money // 50\nmoney %= 50\n\nc10 = money // 10\nmoney %= 10\n\nprint("\\n 500원짜리 ==> %d개" % c500)\nprint(" 100원짜리  ==> %d개" % c100)\nprint(" 50원짜리 ==> %d개" % c50)\nprint(" 10원짜리  ==> %d개" % c10)\nprint(" 바꾸지 못한 잔돈 ==> %d원 \\n" % money)\n';

  var PROG1_OUT = '교환할 돈은 얼마? 7777\n\n 500원짜리 ==> 15개\n 100원짜리  ==> 2개\n 50원짜리 ==> 1개\n 10원짜리  ==> 2개\n 바꾸지 못한 잔돈 ==> 7원';

  var CONSOLE1 = '<div style="font-family:monospace;font-size:15px;line-height:1.55;background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px 18px;max-width:520px;white-space:pre;color:var(--fg)">' +
    '<span style="color:var(--muted)">교환할 돈은 얼마? </span><b style="color:var(--accent)">7777</b>\n\n 500원짜리 ==&gt; 15개\n 100원짜리  ==&gt; 2개\n 50원짜리 ==&gt; 1개\n 10원짜리  ==&gt; 2개\n 바꾸지 못한 잔돈 ==&gt; 7원</div>';

  var WALK = '<svg viewBox="0 0 360 360" width="100%" style="max-width:360px">' +
    '<rect x="5" y="5" width="350" height="350" rx="6" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>' +
    '<rect x="30" y="30" width="300" height="300" fill="none" stroke="var(--muted)" stroke-dasharray="6 5"/>' +
    '<g stroke-width="3" fill="none" stroke-linecap="round">' +
    '<polyline points="180,180 230,150 250,200 210,240 260,260 300,230" stroke="#c0392b"/>' +
    '<polyline points="300,230 330,262" stroke="#8e44ad"/>' +
    '<polyline points="180,180 140,140 90,160 110,90 60,70" stroke="#27ae60"/>' +
    '<polyline points="60,70 20,40" stroke="#2980b9"/>' +
    '<polyline points="180,180 150,230 100,250 120,300 80,320" stroke="#d35400"/>' +
    '<polyline points="180,180 200,110 250,90 280,120 300,60" stroke="#16a085"/>' +
    '<polyline points="300,60 345,30" stroke="#7f8c8d"/>' +
    '</g><circle cx="180" cy="180" r="7" fill="var(--fg)"/>' +
    '<text x="180" y="350" text-anchor="middle" font-size="13" fill="var(--muted)">점선 = 화면 경계 (300×300)</text></svg>';

  PY_COURSE.addChapter({
    id: 'ch04',
    no: '04',
    title: '연산자',
    subtitle: '산술 · 대입 · 관계 · 논리 · 비트 연산자와 우선순위',
    summary: '더하기 · 빼기 같은 산술 연산자부터 비교(관계) · 논리 · 비트 연산자까지 파이썬의 연산자를 모두 배우고, 연산자 우선순위와 형 변환을 익힙니다. 나아가 음수에서의 몫 · 나머지, divmod 와 math 모듈, 비교 체이닝과 단락 평가, == 와 is, 실수 비교, 비트 플래그처럼 실무에서 쓰는 내용까지 다룹니다. 배운 연산자로 동전 교환 · 거북이 프로그램은 물론 BMI 계산기, 대출 이자 계산기, 입력 검증기, 권한 관리, 거스름돈 계산기를 직접 만듭니다.',
    goals: [
      '더하기 · 빼기 · 곱하기 · 나누기 · 몫 · 나머지 · 제곱 등 산술 연산자를 사용할 수 있다',
      'int() · float() · str() 로 문자열과 숫자를 서로 변환할 수 있다',
      '대입 연산자(+=, -=, //= …)로 변수의 값을 누적해서 바꿀 수 있다',
      '관계 · 논리 · 비트 연산자의 결과를 예측할 수 있다',
      '연산자 우선순위를 이해하고 괄호로 계산 순서를 정할 수 있다',
      'divmod() · 내장 함수 · math 모듈로 계산을 더 간단하게 쓸 수 있다',
      '비교 체이닝 · 단락 평가 · == 와 is 의 차이 · 실수 비교 방법을 설명할 수 있다',
      '비트 플래그와 마스크로 권한 · 색상 같은 실전 데이터를 다룰 수 있다',
      '산술 연산자로 동전 교환 프로그램을, 논리 연산자로 마음대로 이동하는 거북이 프로그램을 만들 수 있다',
      'BMI · 대출 이자 · 입력 검증 · 권한 관리 · 거스름돈 계산기 같은 작은 프로그램을 스스로 만들 수 있다'
    ],
    sections: [
      /* ═════════════════════════ 4-1 ═════════════════════════ */
      {
        id: 'ch04-1',
        title: '이 장에서 만들 프로그램 · 산술 연산자',
        minutes: 50,
        goals: [
          '이 장에서 만들 두 프로그램(동전 교환, 마음대로 이동하는 거북이)의 동작을 설명할 수 있다',
          '연산자와 피연산자의 뜻을 말할 수 있다',
          '산술 연산자 +, -, *, /, //, %, ** 의 결과를 예측할 수 있다',
          '산술 연산자의 우선순위와 괄호의 역할을 설명할 수 있다',
          '음수가 섞인 // 와 % 의 결과를 설명하고 divmod() 를 쓸 수 있다',
          'abs · round · pow · min · max · sum 과 math 모듈의 함수를 활용할 수 있다'
        ],
        flow: [['도입: 만들 프로그램 미리 보기', 6], ['연산자 · 산술 연산자 7가지', 12], ['// 와 % (음수 포함) · divmod', 10], ['산술 연산자 우선순위', 8], ['내장 함수 · math 모듈', 7], ['퀴즈 · 실습 · 정리', 7]],
        content: [
          { type: 'h', text: '이 장에서 만들 프로그램' },
          { type: 'p', html: '이번 장에서는 계산에 쓰이는 여러 가지 <b>연산자(operator)</b>를 배웁니다. 연산자를 다 배우고 나면 다음 두 프로그램을 직접 만들 수 있습니다.' },
          { type: 'p', html: '<b>[프로그램 1] 동전 교환</b> — 돈을 입력하면 500원 · 100원 · 50원 · 10원짜리 동전 몇 개로 바꿀 수 있는지, 그리고 동전으로 못 바꾸는 잔돈이 얼마인지 알려 줍니다. 핵심은 <b>몫(<code>//</code>)</b>과 <b>나머지(<code>%</code>)</b> 연산자입니다.' },
          { type: 'figure', caption: '[프로그램 1] 실행 결과 — 7777원을 입력했을 때', html: CONSOLE1 },
          { type: 'p', html: '<b>[프로그램 2] 마음대로 이동하는 거북이</b> — 거북이가 무작위 방향 · 무작위 거리로 계속 돌아다니며 선을 그립니다. 거북이가 화면 밖으로 나가면 다시 가운데로 데려옵니다. "화면 안에 있는가?"를 판단할 때 <b>관계 연산자</b>와 <b>논리 연산자(<code>and</code>)</b>를 씁니다.' },
          { type: 'figure', caption: '[프로그램 2] 실행 모습 — 여러 색의 선이 가운데에서 시작해 화면 곳곳으로 뻗어 나간다', html: WALK },

          { type: 'h', text: '연산자와 피연산자' },
          { type: 'p', html: '<code>5 + 3</code> 에서 <code>+</code> 처럼 "무엇을 계산하라"는 기호를 <b>연산자</b>, 계산의 재료가 되는 <code>5</code>, <code>3</code> 을 <b>피연산자(operand)</b>라고 합니다. 연산자와 피연산자를 묶은 <code>5 + 3</code> 전체는 <b>식(expression)</b>이며, 식은 계산이 끝나면 하나의 <b>값</b>이 됩니다.' },
          { type: 'figure', caption: '연산자 · 피연산자 · 식', html: `<svg viewBox="0 0 640 220" width="100%" style="max-width:640px" font-family="sans-serif">
  <text x="100" y="28" text-anchor="middle" font-size="18" fill="var(--muted)">피연산자</text>
  <text x="250" y="28" text-anchor="middle" font-size="18" fill="var(--muted)">연산자</text>
  <text x="400" y="28" text-anchor="middle" font-size="18" fill="var(--muted)">피연산자</text>
  <rect x="55" y="45" width="90" height="90" rx="12" fill="var(--ok)" opacity="0.85"/>
  <rect x="205" y="45" width="90" height="90" rx="12" fill="var(--danger)" opacity="0.85"/>
  <rect x="355" y="45" width="90" height="90" rx="12" fill="var(--ok)" opacity="0.85"/>
  <text x="100" y="103" text-anchor="middle" font-size="40" font-weight="bold" fill="#fff">5</text>
  <text x="250" y="103" text-anchor="middle" font-size="40" font-weight="bold" fill="#fff">+</text>
  <text x="400" y="103" text-anchor="middle" font-size="40" font-weight="bold" fill="#fff">3</text>
  <text x="495" y="103" text-anchor="middle" font-size="36" fill="var(--fg)">→</text>
  <rect x="540" y="55" width="80" height="70" rx="12" fill="var(--accent)" opacity="0.9"/>
  <text x="580" y="103" text-anchor="middle" font-size="36" font-weight="bold" fill="#fff">8</text>
  <path d="M100 145 V170 H400 V145" fill="none" stroke="var(--muted)" stroke-width="2"/>
  <text x="250" y="200" text-anchor="middle" font-size="18" fill="var(--fg)">식(expression) — 계산하면 값 하나가 된다</text>
</svg>` },

          { type: 'h', text: '산술 연산자의 종류' },
          { type: 'p', html: '<b>산술 연산자</b>는 사칙연산처럼 수를 계산하는 연산자입니다. 수학 기호와 비슷하지만 곱하기가 <code>×</code> 대신 <code>*</code>, 나누기가 <code>÷</code> 대신 <code>/</code> 라는 점, 그리고 <b>몫 <code>//</code></b>, <b>나머지 <code>%</code></b>, <b>제곱 <code>**</code></b> 이 따로 있다는 점이 다릅니다. 표의 <code>=</code> 는 계산이 아니라 값을 변수에 넣는 <b>대입 연산자</b>입니다.' },
          { type: 'table', caption: '표 4-1 산술 연산자의 종류', head: ['연산자', '의미', '사용 예', '설명'], rows: [
            ['<code>=</code>', '대입 연산자', '<code>a = 3</code>', '정수 3 을 a 에 대입'],
            ['<code>+</code>', '더하기', '<code>a = 5 + 3</code>', '5 와 3 을 더한 값(8)을 a 에 대입'],
            ['<code>-</code>', '빼기', '<code>a = 5 - 3</code>', '5 에서 3 을 뺀 값(2)을 a 에 대입'],
            ['<code>*</code>', '곱하기', '<code>a = 5 * 3</code>', '5 와 3 을 곱한 값(15)을 a 에 대입'],
            ['<code>/</code>', '나누기', '<code>a = 5 / 3</code>', '5 를 3 으로 나눈 값(1.666…)을 a 에 대입'],
            ['<code>//</code>', '나누기(몫)', '<code>a = 5 // 3</code>', '5 를 3 으로 나눈 뒤 소수점 아래를 버린 값(1)을 a 에 대입'],
            ['<code>%</code>', '나머지값', '<code>a = 5 % 3</code>', '5 를 3 으로 나눈 나머지(2)를 a 에 대입'],
            ['<code>**</code>', '제곱', '<code>a = 5 ** 3</code>', '5 의 3제곱(125)을 a 에 대입']
          ] },
          { type: 'code', title: '예제. 산술 연산자 7가지 사용하기', code: 'a = 5; b = 3\nprint(a + b, a - b, a * b, a / b, a // b, a % b, a ** b)', expect: '8 2 15 1.6666666666666667 1 2 125',
            desc: '<code>a // b</code> 는 5 를 3 으로 나눈 <b>몫</b> 1, <code>a % b</code> 는 <b>나머지</b> 2 입니다. <code>a / b</code> 는 나누어떨어지지 않으므로 실수 <code>1.6666666666666667</code> 이 나옵니다(마지막 자리는 컴퓨터가 실수를 저장하는 방식 때문에 7 로 반올림되어 보입니다).' },
          { type: 'figure', caption: '17 을 5 로 나눌 때 — / 는 정확한 나눗셈, // 는 몫, % 는 나머지', html: `<svg viewBox="0 0 640 230" width="100%" style="max-width:640px" font-family="sans-serif">
  <g font-size="30" font-weight="bold" fill="var(--fg)">
    <text x="40" y="70">17 ÷ 5</text>
  </g>
  <text x="175" y="70" font-size="30" fill="var(--muted)">=</text>
  <rect x="215" y="35" width="70" height="50" rx="10" fill="var(--accent)" opacity="0.9"/>
  <text x="250" y="71" text-anchor="middle" font-size="30" font-weight="bold" fill="#fff">3</text>
  <text x="305" y="71" font-size="24" fill="var(--fg)">…</text>
  <rect x="340" y="35" width="70" height="50" rx="10" fill="var(--accent2)" opacity="0.9"/>
  <text x="375" y="71" text-anchor="middle" font-size="30" font-weight="bold" fill="#fff">2</text>
  <text x="250" y="112" text-anchor="middle" font-size="17" fill="var(--accent)">몫</text>
  <text x="375" y="112" text-anchor="middle" font-size="17" fill="var(--accent2)">나머지</text>
  <g font-family="monospace" font-size="21">
    <text x="40" y="160" fill="var(--fg)">17 / 5  → 3.4</text>
    <text x="330" y="160" fill="var(--muted)">정확한 나눗셈 (항상 실수)</text>
    <text x="40" y="192" fill="var(--accent)">17 // 5 → 3</text>
    <text x="330" y="192" fill="var(--muted)">몫 (소수점 아래 버림)</text>
    <text x="40" y="224" fill="var(--accent2)">17 % 5  → 2</text>
    <text x="330" y="224" fill="var(--muted)">나머지 (17 = 5×3 + 2)</text>
  </g>
</svg>` },
          { type: 'callout', kind: 'tip', title: '세미콜론(;)과 콤마(,)', html: '세미콜론 <code>;</code> 은 한 줄에 여러 문장을 쓸 때 문장과 문장을 완전히 나눠 줍니다. 그래서 <code>a = 5; b = 3</code> 은 두 줄로 <code>a = 5</code>, <code>b = 3</code> 을 쓴 것과 똑같습니다. 또 콤마로 값을 나열해 <code>a, b = 5, 3</code> 처럼 여러 변수에 한꺼번에 대입할 수도 있습니다.' },
          { type: 'code', title: '예제. 값을 대입하는 세 가지 방법', code: 'a = 5\nb = 3\nprint(a, b)\n\na = 5; b = 3\nprint(a, b)\n\na, b = 5, 3\nprint(a, b)', expect: '5 3\n5 3\n5 3',
            desc: '세 방법 모두 결과가 같습니다. 보통은 한 줄에 한 문장을 쓰는 것이 가장 읽기 쉽고, 관련 있는 변수 몇 개를 함께 정할 때 콤마 방식을 씁니다. 세미콜론은 파이썬에서 잘 쓰지 않습니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: / 는 항상 실수, 음수의 // 와 %', html: '<ul><li><code>/</code> 의 결과는 나누어떨어져도 <b>항상 실수(float)</b>입니다. <code>6 / 3</code> 은 <code>2</code> 가 아니라 <code>2.0</code> 입니다.</li><li><code>//</code> 는 "소수점 버림"이라기보다 <b>더 작은 쪽 정수로 내림(floor)</b>입니다. 양수에서는 같지만 음수에서는 다릅니다: <code>-7 // 2</code> 는 -3.5 를 내린 <code>-4</code>.</li><li>그래서 <code>-7 % 2</code> 는 <code>1</code> 입니다. 파이썬은 항상 <code>a == (a // b) * b + a % b</code> 가 성립하도록 계산합니다.</li><li><code>divmod(17, 5)</code> 는 몫과 나머지를 한 번에 <code>(3, 2)</code> 로 돌려줍니다.</li><li>0 으로 나누면(<code>/</code>, <code>//</code>, <code>%</code> 모두) <code>ZeroDivisionError</code> 오류가 납니다.</li></ul>' },
          { type: 'code', repl: true, title: '추가 예제. >>> 셸에서 나눗셈 연산 확인하기', code: '6 / 3\n17 / 5\n17 // 5\n17 % 5\n-7 // 2\n-7 % 2\ndivmod(17, 5)\n2 ** 10', expect: '>>> 6 / 3\n2.0\n>>> 17 / 5\n3.4\n>>> 17 // 5\n3\n>>> 17 % 5\n2\n>>> -7 // 2\n-4\n>>> -7 % 2\n1\n>>> divmod(17, 5)\n(3, 2)\n>>> 2 ** 10\n1024\n>>>',
            desc: '<code>>>></code> 셸(대화형 모드)에서는 식을 입력하기만 해도 결과가 바로 나옵니다. ▶ 실행을 누르면 콘솔의 <code>>>></code> 셸에서 한 줄씩 실행됩니다.' },
          { type: 'code', title: '추가 예제. 0 으로 나누면?', code: 'a = 10\nprint(a / 0)', expectError: true, expect: 'Traceback (most recent call last):\n  File "main.py", line 2, in <module>\n    print(a / 0)\n          ~~^~~\nZeroDivisionError: division by zero',
            desc: '둘째 줄에서 <code>ZeroDivisionError</code> 가 나며 프로그램이 멈춥니다. <code>~~^~~</code> 표시가 오류가 난 연산 위치를 가리킵니다. 오류 메시지의 마지막 줄을 먼저 읽는 습관을 들이세요.' },

          { type: 'h', text: '산술 연산자의 우선순위' },
          { type: 'p', html: '연산자가 여러 개 섞인 식은 정해진 순서, 즉 <b>우선순위(precedence)</b>에 따라 계산됩니다. 산술 연산자의 규칙은 수학 시간에 배운 것과 같습니다.' },
          { type: 'code', title: '예제. 연산자가 여러 개인 식', code: 'a, b, c = 2, 3, 4\nprint(a + b - c, a + b * c, a * b / c)', expect: '1 14 1.5',
            desc: '<code>a + b - c</code> 는 덧셈 · 뺄셈만 있으므로 왼쪽부터 계산해 <code>(2+3)-4 = 1</code>. <code>a + b * c</code> 는 곱셈이 먼저라서 <code>2 + 12 = 14</code>. <code>a * b / c</code> 는 곱셈 · 나눗셈끼리라 왼쪽부터 <code>6 / 4 = 1.5</code> 입니다.' },
          { type: 'p', html: '<code>a + b - c</code> 는 ❶ <code>(a + b) - c</code> 로 계산하든 ❷ <code>a + (b - c)</code> 로 계산하든 결과가 1 로 같습니다. 덧셈과 뺄셈은 우선순위가 같기 때문입니다. 이렇게 우선순위가 같은 연산자끼리는 <b>왼쪽에서 오른쪽</b>으로 계산하는 것이 원칙입니다.' },
          { type: 'p', html: '하지만 <code>a + b * c</code> 는 순서에 따라 결과가 달라집니다.' },
          { type: 'figure', caption: 'a + b * c (a=2, b=3, c=4) — 괄호가 없으면 곱셈이 먼저 계산된다', html: `<svg viewBox="0 0 700 250" width="100%" style="max-width:700px" font-family="monospace">
  <text x="20" y="40" font-size="20" fill="var(--danger)">❶ (a + b) * c</text>
  <text x="250" y="40" font-size="20" fill="var(--fg)">→ (2 + 3) * 4 → 5 * 4 → 20</text>
  <text x="20" y="80" font-size="20" fill="var(--ok)">❷ a + (b * c)</text>
  <text x="250" y="80" font-size="20" fill="var(--fg)">→ 2 + (3 * 4) → 2 + 12 → 14</text>
  <line x1="20" y1="100" x2="680" y2="100" stroke="var(--line)"/>
  <text x="350" y="128" text-anchor="middle" font-size="18" fill="var(--muted)">괄호 없이 a + b * c 를 쓰면 ❷ 처럼 계산</text>
  <g font-size="28" font-weight="bold" text-anchor="middle">
    <circle cx="350" cy="160" r="22" fill="var(--accent)" opacity="0.9"/><text x="350" y="170" fill="#fff">+</text>
    <circle cx="260" cy="220" r="20" fill="var(--card)" stroke="var(--fg)"/><text x="260" y="230" fill="var(--fg)">2</text>
    <circle cx="440" cy="215" r="22" fill="var(--accent2)" opacity="0.9"/><text x="440" y="225" fill="#fff">*</text>
  </g>
  <line x1="335" y1="176" x2="272" y2="204" stroke="var(--fg)" stroke-width="2"/>
  <line x1="365" y1="176" x2="425" y2="198" stroke="var(--fg)" stroke-width="2"/>
  <text x="520" y="205" font-size="18" fill="var(--accent2)">① 3 * 4 = 12 (먼저)</text>
  <text x="520" y="235" font-size="18" fill="var(--accent)">② 2 + 12 = 14</text>
  <text x="60" y="160" font-size="16" fill="var(--muted)">아래쪽(트리의 잎)부터 계산</text>
</svg>` },
          { type: 'code', title: '예제. 괄호로 계산 순서 바꾸기', code: 'a, b, c = 2, 3, 4\nprint((a + b) * c)\nprint(a + (b * c))\nprint(a + b * c)', expect: '20\n14\n14',
            desc: '괄호가 없으면 <code>a + b * c</code> 는 ❷ 와 같은 14 가 됩니다. 덧셈을 먼저 하고 싶으면 반드시 괄호를 씁니다.' },
          { type: 'list', items: [
            '<b>괄호 <code>()</code></b> 안이 가장 먼저 계산된다.',
            '그다음 <b>곱셈 · 나눗셈</b>(<code>*</code>, <code>/</code>, <code>//</code>, <code>%</code>), 마지막이 <b>덧셈 · 뺄셈</b>(<code>+</code>, <code>-</code>)이다.',
            '우선순위가 같은 것끼리(덧셈 · 뺄셈끼리, 곱셈 · 나눗셈끼리)는 <b>왼쪽에서 오른쪽</b>으로 계산한다.',
            '<code>a = b + c * d</code> 는 <code>a = b + (c * d)</code> 와 같다. 헷갈리면 괄호를 써서 뜻을 분명히 하자.'
          ] },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 제곱 ** 은 오른쪽부터', html: '<code>**</code> 는 곱셈보다도 우선순위가 높고, 특이하게 <b>오른쪽에서 왼쪽</b>으로 계산합니다. <code>2 ** 3 ** 2</code> 는 <code>2 ** (3 ** 2) = 2 ** 9 = 512</code> 입니다. 또 <code>-2 ** 2</code> 는 <code>-(2 ** 2) = -4</code> 이니, 음수를 제곱하려면 <code>(-2) ** 2</code> 처럼 괄호를 씁니다.' },
          { type: 'code', repl: true, title: '추가 예제. 제곱 연산자의 계산 방향', code: '2 ** 3 ** 2\n(2 ** 3) ** 2\n-2 ** 2\n(-2) ** 2', expect: '>>> 2 ** 3 ** 2\n512\n>>> (2 ** 3) ** 2\n64\n>>> -2 ** 2\n-4\n>>> (-2) ** 2\n4\n>>>' },

          { type: 'h', text: '한 걸음 더 ① 나눗셈 삼형제를 정확히: / · // · %' },
          { type: 'p', html: '나눗셈이 세 종류나 되는 이유는 <b>필요한 답이 서로 다르기 때문</b>입니다. "1인분이 정확히 얼마?"는 <code>/</code>, "몇 개씩 줄 수 있나?"는 <code>//</code>, "그러고 남는 건?"은 <code>%</code> 입니다. 그런데 <code>//</code> 를 "소수점 버리기"로만 외우면 <b>음수에서 틀립니다</b>. 파이썬의 <code>//</code> 는 정확히는 <b>내림(floor)</b>, 즉 수직선에서 <b>왼쪽(작은 쪽)으로 내리는</b> 연산입니다.' },
          { type: 'table', caption: '7 과 -7 을 2 로 나눠 보기', head: ['식', '결과', '읽는 법'], rows: [
            ['<code>7 / 2</code>', '<code>3.5</code>', '정확한 나눗셈 (항상 실수)'],
            ['<code>7 // 2</code>', '<code>3</code>', '3.5 를 내리면 3'],
            ['<code>-7 / 2</code>', '<code>-3.5</code>', '정확한 나눗셈'],
            ['<code>-7 // 2</code>', '<code>-4</code>', '-3.5 를 <b>내리면</b> -4 (버림이라면 -3 이었을 것)'],
            ['<code>-7 % 2</code>', '<code>1</code>', '나머지의 부호는 <b>나누는 수</b>를 따라간다'],
            ['<code>7 % -2</code>', '<code>-1</code>', '나누는 수가 음수라 나머지도 음수']
          ] },
          { type: 'code', title: '추가 예제. 음수가 섞인 나눗셈', code: 'print(7 / 2, 7 // 2, 7 % 2)\nprint(-7 / 2, -7 // 2, -7 % 2)\nprint(7 // -2, 7 % -2)\nprint(divmod(-7, 2))\nprint(-7 == (-7 // 2) * 2 + (-7 % 2))',
            expect: '3.5 3 1\n-3.5 -4 1\n-4 -1\n(-4, 1)\nTrue',
            desc: '마지막 줄이 <code>True</code> 인 것이 핵심입니다. 파이썬은 어떤 수든 <b><code>a == (a // b) * b + a % b</code></b> 가 성립하도록 <code>//</code> 와 <code>%</code> 를 짝지어 정의합니다. 그래서 <code>//</code> 를 내림으로 정하면 나머지는 자연히 나누는 수와 같은 부호가 됩니다. <code>divmod(a, b)</code> 는 이 몫과 나머지를 한 번에 <code>(몫, 나머지)</code> 로 돌려줍니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: C · 자바와 결과가 다른 이유', html: 'C · 자바 · 자바스크립트는 나눗셈에서 <b>0 쪽으로 버림(truncate)</b>을 하기 때문에 <code>-7 / 2</code> 가 -3, <code>-7 % 2</code> 가 -1 입니다. 파이썬은 <b>내림(floor)</b>을 선택했습니다. 덕분에 <code>%</code> 의 결과가 항상 0 이상(나누는 수가 양수일 때)이 되어, 각도 · 요일 · 배열 인덱스를 "돌려 쓰는" 계산이 훨씬 안전합니다. 다른 언어와 같은 버림 나눗셈이 필요하면 <code>int(a / b)</code> 나 <code>math.fmod(a, b)</code> 를 쓸 수 있습니다.' },
          { type: 'code', title: '추가 예제. 나머지 연산의 쓸모 (각도 · 요일 · 자릿수)', code: 'angle = -30\nprint(angle % 360)\nprint((angle + 720) % 360)\n\nday = 3\nprint((day + 10) % 7)\n\nprint(17 % 2, 18 % 2)\nprint(1234567 % 10, 1234567 // 10 % 10)',
            expect: '330\n330\n6\n1 0\n7 6',
            desc: '<code>% 360</code> 은 각도를 0~359 범위로 <b>되돌려 감는</b> 계산입니다. 음수여도 파이썬은 양수 결과를 주므로 <code>+720</code> 같은 보정이 필요 없습니다. <code>(day + 10) % 7</code> 은 "목요일(3)에서 10일 뒤는 무슨 요일?"(6 = 일요일), <code>% 2</code> 는 짝수 · 홀수 판별, <code>% 10</code> 과 <code>// 10</code> 조합은 자릿수 뽑기에 쓰입니다.' },

          { type: 'h', text: '한 걸음 더 ② 계산을 돕는 내장 함수' },
          { type: 'p', html: '파이썬에는 <code>import</code> 없이 바로 쓸 수 있는 <b>내장 함수(built-in function)</b>가 있습니다. 계산에 자주 쓰는 것만 모아 보면 다음과 같습니다. 직접 식을 짜기 전에 "이미 있는 함수인가?"를 먼저 떠올리는 습관이 좋은 코드를 만듭니다.' },
          { type: 'table', caption: '계산에 자주 쓰는 내장 함수', head: ['함수', '하는 일', '예 → 결과'], rows: [
            ['<code>abs(x)</code>', '절댓값', '<code>abs(-7)</code> → 7'],
            ['<code>round(x, n)</code>', '반올림(n 자리까지)', '<code>round(3.14159, 2)</code> → 3.14'],
            ['<code>pow(a, b)</code>', '거듭제곱 (<code>a ** b</code> 와 같음)', '<code>pow(2, 10)</code> → 1024'],
            ['<code>pow(a, b, m)</code>', '거듭제곱의 나머지 (암호에 쓰임)', '<code>pow(2, 10, 1000)</code> → 24'],
            ['<code>min()</code> · <code>max()</code>', '가장 작은 · 큰 값', '<code>max(3, 9, 4)</code> → 9'],
            ['<code>sum()</code>', '여러 수의 합', '<code>sum([3, 9, 4])</code> → 16'],
            ['<code>divmod(a, b)</code>', '몫과 나머지를 한 번에', '<code>divmod(17, 5)</code> → (3, 2)']
          ] },
          { type: 'code', title: '추가 예제. 내장 함수로 계산하기', code: 'print(abs(-7), pow(2, 10), pow(2, 10, 1000))\nprint(min(3, 9, 4), max(3, 9, 4), sum([3, 9, 4]))\nprint(round(3.14159, 2), round(2.5), round(3.5))\nprint(divmod(17, 5))',
            expect: '7 1024 24\n3 9 16\n3.14 2 4\n(3, 2)',
            desc: '<code>sum([3, 9, 4])</code> 의 대괄호는 <b>리스트</b>(7장)입니다. 지금은 "여러 값을 한 묶음으로 넘기는 방법" 정도로 보면 됩니다. 셋째 줄의 <code>round(2.5)</code> 가 3 이 아니라 <b>2</b> 인 것에 주목하세요.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: round(2.5) 가 왜 2 일까 (은행가 반올림)', html: '학교에서 배운 "5 는 무조건 올림"과 달리, 파이썬의 <code>round()</code> 는 <b>정확히 0.5 일 때 짝수 쪽으로</b> 반올림합니다(<code>round(2.5)</code> → 2, <code>round(3.5)</code> → 4). 늘 올리면 많은 수를 더할 때 합계가 계속 커지는 편향이 생기기 때문에, 통계 · 금융에서 쓰는 이 방식(은행가 반올림, banker\'s rounding)을 표준으로 삼았습니다. 게다가 <code>round(2.675, 2)</code> 가 2.67 이 되는 일도 있는데, 이는 2.675 가 2진 실수로 정확히 표현되지 않기 때문입니다. <b>돈 계산</b>처럼 오차가 곧 사고가 되는 곳에서는 <code>decimal</code> 모듈이나 "원 단위 정수로 계산하기"를 씁니다.' },

          { type: 'h', text: '한 걸음 더 ③ math 모듈 맛보기' },
          { type: 'p', html: '제곱근 · 삼각함수 · 원주율처럼 더 전문적인 계산은 <b>math 모듈</b>에 들어 있습니다. 모듈은 "관련 있는 함수를 모아 둔 상자"이고, <code>import math</code> 로 상자를 열어 <code>math.sqrt(2)</code> 처럼 씁니다(모듈은 9장에서 자세히 배웁니다).' },
          { type: 'code', title: '추가 예제. math 모듈의 자주 쓰는 함수', code: 'import math\n\nprint(math.pi, math.e)\nprint(math.sqrt(2), 2 ** 0.5)\nprint(math.floor(-3.2), math.ceil(-3.2), math.trunc(-3.2))\nprint(math.gcd(24, 36), math.factorial(5))\nprint(math.hypot(3, 4), round(math.degrees(math.pi), 1))',
            expect: '3.141592653589793 2.718281828459045\n1.4142135623730951 1.4142135623730951\n-4 -3 -3\n12 120\n5.0 180.0',
            desc: '<code>math.sqrt(2)</code> 와 <code>2 ** 0.5</code> 는 결과가 같습니다. <code>floor</code>(내림) · <code>ceil</code>(올림) · <code>trunc</code>(0 쪽으로 버림)의 차이는 <b>음수에서</b> 드러납니다: -3.2 는 각각 -4, -3, -3. <code>gcd</code> 는 최대공약수, <code>factorial</code> 은 계승(5! = 120), <code>hypot(3, 4)</code> 는 직각삼각형의 빗변 길이입니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: math 에 또 무엇이 있나', html: '<ul><li><code>math.inf</code>(무한대) · <code>math.nan</code>(숫자가 아님) — 최솟값을 찾을 때 시작값으로 <code>math.inf</code> 를 자주 씁니다.</li><li><code>math.isclose(a, b)</code> — 실수를 "거의 같은가"로 비교 (3교시에서 다룹니다).</li><li><code>math.log(x)</code>, <code>math.log10(x)</code>, <code>math.sin/cos/tan</code>(단위는 라디안), <code>math.radians()</code> · <code>math.degrees()</code>.</li><li>정수만 쓰는 계산이라면 <code>math.isqrt(n)</code>(정수 제곱근)처럼 오차가 없는 함수가 따로 있습니다.</li></ul>' }
        ],
        practice: [
          { title: '실습 4-1. 두 수의 산술 연산', level: 1,
            desc: '<p>정수 두 개를 입력받아 <code>+ - * / // % **</code> 7가지 연산 결과를 한 줄씩 출력하세요.</p><p>예) 17 과 5 를 입력하면 <code>17 + 5 = 22</code>, <code>17 - 5 = 12</code> … 처럼 출력합니다.</p>',
            hint: '<code>int(input(...))</code> 로 입력받고, <code>print(a, "+", b, "=", a + b)</code> 처럼 쉼표로 나열하면 사이에 공백이 들어갑니다.',
            starter: 'a = int(input("첫 번째 수 : "))\nb = int(input("두 번째 수 : "))\n\n# TODO: 7가지 연산 결과를 출력하세요\nprint(a, "+", b, "=", a + b)\n',
            solution: 'a = int(input("첫 번째 수 : "))\nb = int(input("두 번째 수 : "))\n\nprint(a, "+", b, "=", a + b)\nprint(a, "-", b, "=", a - b)\nprint(a, "*", b, "=", a * b)\nprint(a, "/", b, "=", a / b)\nprint(a, "//", b, "=", a // b)\nprint(a, "%", b, "=", a % b)\nprint(a, "**", b, "=", a ** b)\n',
            stdin: '17\n5\n',
            expect: '첫 번째 수 : 17\n두 번째 수 : 5\n17 + 5 = 22\n17 - 5 = 12\n17 * 5 = 85\n17 / 5 = 3.4\n17 // 5 = 3\n17 % 5 = 2\n17 ** 5 = 1419857' },
          { title: '실습 4-2. 원의 넓이와 둘레', level: 1,
            desc: '<p>반지름을 입력받아 원의 넓이(πr²)와 둘레(2πr)를 <b>소수점 아래 두 자리까지</b> 출력하세요.</p><p>예) 반지름 3 → <code>넓이 : 28.27 cm2</code>, <code>둘레 : 18.85 cm</code></p>',
            hint: '<code>import math</code> 후 <code>math.pi</code> 를 씁니다. 제곱은 <code>r ** 2</code>, 소수점 두 자리 출력은 <code>"%.2f" % 값</code> 또는 <code>round(값, 2)</code> 입니다. 반지름은 소수일 수 있으니 <code>float(input(...))</code> 로 받으세요.',
            starter: 'import math\n\nr = float(input("반지름(cm) : "))\n\n# TODO: 넓이와 둘레를 구해 소수점 두 자리까지 출력\narea = 0\nlength = 0\n\nprint("넓이 : %.2f cm2" % area)\n',
            solution: 'import math\n\nr = float(input("반지름(cm) : "))\n\narea = math.pi * r ** 2\nlength = 2 * math.pi * r\n\nprint("넓이 : %.2f cm2" % area)\nprint("둘레 : %.2f cm" % length)\nprint("반올림한 넓이 :", round(area, 2))\n',
            stdin: '3\n',
            expect: '반지름(cm) : 3\n넓이 : 28.27 cm2\n둘레 : 18.85 cm\n반올림한 넓이 : 28.27' },
          { title: '실습 4-3. 초를 시 · 분 · 초로 바꾸기', level: 2,
            desc: '<p>초(second)를 입력받아 몇 시간 몇 분 몇 초인지 출력하세요. 예) <code>3725</code> → <code>1시간 2분 5초</code></p>',
            hint: '1시간 = 3600초, 1분 = 60초입니다. <code>//</code> 로 몫을 구하고 <code>%</code> 로 남은 초를 구하는 과정을 반복합니다. ([프로그램 1] 동전 교환과 같은 원리!)',
            starter: 'sec = int(input("초 : "))\n\n# TODO: 시간, 분, 초 구하기\nhour = 0\nminute = 0\n\nprint(hour, "시간", minute, "분", sec, "초")\n',
            solution: 'sec = int(input("초 : "))\n\nhour = sec // 3600\nsec = sec % 3600\nminute = sec // 60\nsec = sec % 60\n\nprint("%d시간 %d분 %d초" % (hour, minute, sec))\n',
            stdin: '3725\n',
            expect: '초 : 3725\n1시간 2분 5초' },
          { title: '실습 4-4. 피자 나눠 먹기 (divmod)', level: 2,
            desc: '<p>피자 조각 수와 사람 수를 입력받아 다음을 출력하세요.</p><ul><li>한 사람이 몇 조각씩 먹을 수 있는지 (몫)</li><li>남는 조각은 몇 개인지 (나머지)</li><li>남는 조각 없이 <b>공평하게</b> 나누려면 몇 조각이 더 필요한지</li></ul><p>예) 17 조각, 5 명 → 3조각씩, 2조각 남음, 3조각 더 필요</p>',
            hint: '몫과 나머지는 <code>each, left = divmod(slices, people)</code> 로 한 번에 구할 수 있습니다. 더 필요한 조각 수는 <code>(people - left) % people</code> — 남는 게 0 일 때 0 이 나오도록 다시 <code>% people</code> 을 합니다.',
            starter: 'slices = int(input("피자 조각 수 : "))\npeople = int(input("사람 수 : "))\n\n# TODO: divmod 로 몫과 나머지 구하기\neach, left = 0, 0\n\nprint("한 사람이 %d조각씩" % each)\n',
            solution: 'slices = int(input("피자 조각 수 : "))\npeople = int(input("사람 수 : "))\n\neach, left = divmod(slices, people)\n\nprint("한 사람이 %d조각씩" % each)\nprint("남는 조각 : %d조각" % left)\nprint("공평하게 더 나누려면 %d조각이 더 필요" % ((people - left) % people))\n',
            stdin: '17\n5\n',
            expect: '피자 조각 수 : 17\n사람 수 : 5\n한 사람이 3조각씩\n남는 조각 : 2조각\n공평하게 더 나누려면 3조각이 더 필요' },
          { title: '🚀 프로젝트 4-5. 건강 계산기 (BMI · 체감 온도)', level: 3,
            desc: '<p>키 · 몸무게 · 기온 · 풍속을 입력받아 건강 지표를 계산하는 프로그램을 만드세요. 이번 교시에서 배운 <b>산술 연산자 · 제곱 · 내장 함수</b>를 모두 씁니다.</p><ul><li><b>입력</b>: 키(cm), 몸무게(kg), 기온(℃), 풍속(km/h) — 소수가 올 수 있으므로 <code>float()</code></li><li><b>BMI</b> = 몸무게 ÷ (키[m])² → 소수 첫째 자리까지</li><li><b>표준 체중</b> = 22 × (키[m])² → 소수 첫째 자리까지</li><li><b>비만도</b>(%) = 몸무게 ÷ 표준 체중 × 100</li><li><b>체감 온도</b> = 13.12 + 0.6215T − 11.37V<sup>0.16</sup> + 0.3965TV<sup>0.16</sup> (T: 기온, V: 풍속)</li><li>마지막에 BMI 가 정상 범위(18.5 이상 23 미만)인지 <code>True</code> / <code>False</code> 로 출력</li></ul><pre>키(cm) : 175\n몸무게(kg) : 70\n기온(C) : -5\n풍속(km/h) : 20\nBMI : 22.9\n표준 체중 : 67.4kg\n비만도 : 103.9%\n체감 온도 : -11.6도\n정상 체중 범위(18.5 이상 23 미만)인가? True</pre><p><b>여기까지 했다면</b> ① 체지방률 추정식 넣기, ② 하루 권장 열량(남 66.5+13.75W+5.0H−6.78A) 추가하기, ③ 프로그램을 "입력 → 계산 → 출력" 세 구역 주석으로 정리하기에 도전해 보세요.</p>',
            hint: '키는 cm 로 받아 <code>m = height / 100</code> 으로 바꾸고, 제곱은 <code>m ** 2</code> 입니다. <code>V ** 0.16</code> 처럼 <b>지수가 소수</b>여도 <code>**</code> 로 계산됩니다. <code>%</code> 기호를 그대로 출력하려면 서식 문자열에 <code>%%</code> 라고 두 번 씁니다.',
            starter: '## 입력 부분 ##\nheight = float(input("키(cm) : "))\nweight = float(input("몸무게(kg) : "))\ntemp = float(input("기온(C) : "))\nwind = float(input("풍속(km/h) : "))\n\n## 계산 부분 ##\nm = height / 100\nbmi = 0\n# TODO: bmi, 표준 체중, 비만도, 체감 온도 계산\n\n## 출력 부분 ##\nprint("BMI : %.1f" % bmi)\n',
            solution: '## 입력 부분 ##\nheight = float(input("키(cm) : "))\nweight = float(input("몸무게(kg) : "))\ntemp = float(input("기온(C) : "))\nwind = float(input("풍속(km/h) : "))\n\n## 계산 부분 ##\nm = height / 100\nbmi = weight / m ** 2\nstandard = 22 * m ** 2\nratio = weight / standard * 100\nchill = 13.12 + 0.6215 * temp - 11.37 * wind ** 0.16 + 0.3965 * temp * wind ** 0.16\n\n## 출력 부분 ##\nprint("BMI : %.1f" % bmi)\nprint("표준 체중 : %.1fkg" % standard)\nprint("비만도 : %.1f%%" % ratio)\nprint("체감 온도 : %.1f도" % chill)\nprint("정상 체중 범위(18.5 이상 23 미만)인가?", 18.5 <= bmi < 23)\n',
            stdin: '175\n70\n-5\n20\n',
            expect: '키(cm) : 175\n몸무게(kg) : 70\n기온(C) : -5\n풍속(km/h) : 20\nBMI : 22.9\n표준 체중 : 67.4kg\n비만도 : 103.9%\n체감 온도 : -11.6도\n정상 체중 범위(18.5 이상 23 미만)인가? True' }
        ],
        quiz: [
          { q: '다음 코드의 실행 결과는?<pre><code>print(17 // 5, 17 % 5)</code></pre>', options: ['3 2', '3.4 2', '2 3', '3 3.4'], answer: 0,
            explain: '<code>//</code> 는 몫(3), <code>%</code> 는 나머지(2)입니다. 17 = 5 × 3 + 2.' },
          { q: '<code>print(6 / 3)</code> 의 결과는?', options: ['2', '2.0', '0', '오류'], answer: 1,
            explain: '<code>/</code> 의 결과는 나누어떨어져도 항상 실수(float)입니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>a, b, c = 2, 3, 4\nprint(a + b * c)</code></pre>', options: ['20', '14', '24', '9'], answer: 1,
            explain: '곱셈이 덧셈보다 먼저: 3 * 4 = 12, 2 + 12 = 14.' },
          { q: '<code>2 ** 3 ** 2</code> 의 값은?', options: ['64', '512', '36', '12'], answer: 1,
            explain: '<code>**</code> 는 오른쪽부터 계산합니다. 3 ** 2 = 9, 2 ** 9 = 512.' },
          { q: '다음 코드의 실행 결과는?<pre><code>print(-7 // 2, -7 % 2)</code></pre>', options: ['-3 -1', '-4 1', '-3 1', '-4 -1'], answer: 1,
            explain: '<code>//</code> 는 버림이 아니라 <b>내림</b>이라 -3.5 → -4 입니다. 그리고 <code>a == (a // b) * b + a % b</code> 가 성립해야 하므로 나머지는 1 이 됩니다.' },
          { q: '<code>print(round(2.5), round(3.5))</code> 의 결과는?', options: ['3 4', '2 4', '2 3', '3 3'], answer: 1,
            explain: '파이썬의 <code>round()</code> 는 정확히 0.5 일 때 <b>짝수 쪽</b>으로 반올림합니다(은행가 반올림). 2.5 → 2, 3.5 → 4.' }
        ],
        slides: [
          { layout: 'title', title: '연산자', subtitle: '이 장에서 만들 프로그램 · 산술 연산자', badge: 'Chapter 04 · 1교시',
            notes: '<p>4장은 "계산"의 장입니다. 3장까지 변수와 입력을 배웠으니, 이제 변수에 든 값으로 무엇을 할 수 있는지를 배웁니다.</p><p>발문: "계산기에는 어떤 버튼들이 있나요?" → 사칙연산 외에 몫 · 나머지 · 제곱이 파이썬에 따로 있다는 것으로 연결합니다.</p>' },
          { layout: 'diagram', title: '[프로그램 1] 동전 교환', html: CONSOLE1, caption: '돈을 입력하면 500 · 100 · 50 · 10원 동전 개수와 잔돈을 알려 준다',
            notes: '<p>완성 프로그램을 먼저 실행해 보여 줍니다(2교시 끝의 [프로그램 1] 코드). 7777 외에 학생이 부르는 금액으로 한두 번 더 실행합니다.</p><p>발문: "7777원을 500원짜리로 몇 개까지 바꿀 수 있을까? 어떻게 계산했어?" → 나누기의 몫과 나머지가 핵심이라는 것을 스스로 말하게 합니다.</p>' },
          { layout: 'diagram', title: '[프로그램 2] 마음대로 이동하는 거북이', html: WALK, caption: '무작위 방향 · 거리로 이동, 화면을 벗어나면 가운데로 복귀',
            notes: '<p>3교시 끝의 [프로그램 2]를 실행해 보여 줍니다. 거북이가 경계 밖으로 나갈 때 가운데로 돌아오는 순간을 짚어 줍니다.</p><p>"화면 안에 있다"를 어떻게 식으로 표현할지 궁금증만 남기고 넘어갑니다(관계 · 논리 연산자에서 해결).</p>' },
          { layout: 'table', title: '산술 연산자의 종류', lead: '곱하기는 *, 나누기는 /, 그리고 몫 // · 나머지 % · 제곱 **',
            head: ['연산자', '의미', '예', '결과'], rows: [
              ['<code>+</code>', '더하기', '<code>5 + 3</code>', '8'], ['<code>-</code>', '빼기', '<code>5 - 3</code>', '2'],
              ['<code>*</code>', '곱하기', '<code>5 * 3</code>', '15'], ['<code>/</code>', '나누기', '<code>5 / 3</code>', '1.666…'],
              ['<code>//</code>', '몫', '<code>5 // 3</code>', '1'], ['<code>%</code>', '나머지', '<code>5 % 3</code>', '2'],
              ['<code>**</code>', '제곱', '<code>5 ** 3</code>', '125']
            ],
            notes: '<p>연산자와 피연산자 용어를 먼저 짚고 표로 들어갑니다. <code>=</code> 는 "같다"가 아니라 "오른쪽 값을 왼쪽 변수에 넣는다"는 점을 다시 강조합니다(관계 연산자 <code>==</code> 와 구분은 3교시).</p><p>학생들이 가장 낯설어하는 것은 <code>//</code> 와 <code>%</code> 입니다. 초등학교 나눗셈 "몫과 나머지"를 떠올리게 하세요.</p>' },
          { layout: 'code', title: '산술 연산자 7가지', code: 'a = 5; b = 3\nprint(a + b, a - b, a * b, a / b, a // b, a % b, a ** b)',
            points: ['결과: <code>8 2 15 1.6666666666666667 1 2 125</code>', '<code>/</code> 는 항상 실수 결과', '<code>//</code> 몫, <code>%</code> 나머지', '<code>;</code> 는 한 줄에 두 문장을 쓸 때 구분'],
            notes: '<p>실행 전에 결과를 먼저 예측하게 합니다(공책에 적기). 1.6666666666666667 의 끝자리 7 은 "컴퓨터의 실수 표현 한계" 정도로만 짧게 언급합니다.</p><p>a, b 값을 17, 5 로 바꿔 다시 실행해 봅니다.</p>' },
          { layout: 'diagram', title: '/ · // · % 의 차이', html: `<svg viewBox="0 0 640 230" width="100%" font-family="monospace">
  <text x="320" y="50" text-anchor="middle" font-size="34" font-weight="bold" fill="var(--fg)">17 ÷ 5 = 3 … 2</text>
  <text x="40" y="115" font-size="28" fill="var(--fg)">17 / 5  → 3.4</text>
  <text x="40" y="160" font-size="28" fill="var(--accent)">17 // 5 → 3  (몫)</text>
  <text x="40" y="205" font-size="28" fill="var(--accent2)">17 % 5  → 2  (나머지)</text>
</svg>`, caption: '몫과 나머지는 동전 교환 · 시간 변환 · 짝수 판별에 두루 쓰인다',
            notes: '<p>발문: "어떤 수가 짝수인지 알아보려면 어떤 연산자를 쓸까?" → <code>% 2</code> 가 0 인지 보면 됩니다.</p><p>음수의 <code>//</code>(내림)는 더 알아보기 수준이므로 질문이 나올 때만 설명합니다.</p>' },
          { layout: 'two', title: '값을 대입하는 방법', left: { title: '세미콜론 ;', code: 'a = 5; b = 3\nprint(a, b)' }, right: { title: '콤마 ,', code: 'a, b = 5, 3\nprint(a, b)' },
            notes: '<p>두 코드 모두 <code>5 3</code> 을 출력합니다. 세미콜론은 "줄바꿈 대신", 콤마는 "여러 변수에 한꺼번에"라고 정리합니다.</p><p>파이썬 스타일 가이드(PEP 8)는 세미콜론 사용을 권하지 않는다는 점도 언급합니다. 교재 예제에서만 짧게 쓰려고 쓴 것입니다.</p>' },
          { layout: 'code', title: '산술 연산자의 우선순위', code: 'a, b, c = 2, 3, 4\nprint(a + b - c, a + b * c, a * b / c)\nprint((a + b) * c, a + (b * c))',
            points: ['결과: <code>1 14 1.5</code> / <code>20 14</code>', '괄호 → 곱셈 · 나눗셈 → 덧셈 · 뺄셈', '같은 순위끼리는 왼쪽부터', '헷갈리면 괄호!'],
            notes: '<p>칠판에 <code>2 + 3 * 4</code> 를 쓰고 답을 물어봅니다. 20 이라고 답하는 학생이 꼭 있습니다 → 수학과 같은 규칙임을 확인.</p><p><code>a + b - c</code> 는 어떤 순서든 같은 결과라는 점, <code>a * b / c</code> 는 왼쪽부터 계산한다는 점을 짚어 줍니다.</p>' },
          { layout: 'code', title: '음수가 섞이면? // 는 버림이 아니라 내림', code: 'print(7 / 2, 7 // 2, 7 % 2)\nprint(-7 / 2, -7 // 2, -7 % 2)\nprint(divmod(-7, 2))\nprint(-7 == (-7 // 2) * 2 + (-7 % 2))',
            points: ['결과: <code>3.5 3 1</code> / <code>-3.5 -4 1</code>', '<code>-7 // 2</code> 는 -3 이 아니라 <b>-4</b>', '나머지 부호는 <b>나누는 수</b>를 따라간다', '<code>a == (a // b) * b + a % b</code> 가 항상 성립'],
            notes: '<p>먼저 <code>-7 // 2</code> 의 답을 예측하게 합니다. 대부분 -3 이라고 답합니다. 수직선을 그려 "-3.5 에서 왼쪽으로 내린다"를 보여 주세요.</p><p>C · 자바는 -3 이 나온다는 점, 파이썬이 내림을 택한 덕분에 <code>% 360</code>, <code>% 7</code> 같은 "되돌려 감기" 계산이 안전하다는 점을 덧붙입니다. 시간이 없으면 마지막 줄(항등식)만 강조해도 됩니다.</p>' },
          { layout: 'code', title: '계산을 돕는 내장 함수', code: 'print(abs(-7), pow(2, 10), pow(2, 10, 1000))\nprint(min(3, 9, 4), max(3, 9, 4), sum([3, 9, 4]))\nprint(round(3.14159, 2), round(2.5), round(3.5))\nprint(divmod(17, 5))',
            points: ['<code>abs</code> 절댓값 · <code>pow</code> 거듭제곱', '<code>min</code> · <code>max</code> · <code>sum</code>', '<code>divmod</code> → (몫, 나머지)', '<code>round(2.5)</code> 는 3 이 아니라 <b>2</b>!'],
            notes: '<p>"직접 식을 짜기 전에 이미 있는 함수인지 찾아본다"는 습관을 강조합니다.</p><p><code>round(2.5)</code> = 2 는 은행가 반올림(정확히 0.5 면 짝수 쪽) 때문입니다. 늘 올리면 합계가 커지는 편향이 생긴다는 이유를 짧게 설명하고, 돈 계산은 정수나 decimal 로 한다고 덧붙입니다.</p>' },
          { layout: 'code', title: 'math 모듈 맛보기', code: 'import math\n\nprint(math.pi, math.sqrt(2))\nprint(math.floor(-3.2), math.ceil(-3.2), math.trunc(-3.2))\nprint(math.gcd(24, 36), math.factorial(5))\nprint(math.hypot(3, 4))',
            points: ['<code>import math</code> 로 상자 열기', '<code>math.sqrt(2)</code> = <code>2 ** 0.5</code>', 'floor · ceil · trunc 는 <b>음수</b>에서 차이', '모듈은 9장에서 자세히'],
            notes: '<p>모듈 = 관련 함수를 모아 둔 상자. 여기서는 "필요한 계산은 대부분 이미 만들어져 있다"는 감만 주면 충분합니다.</p><p>-3.2 을 floor/ceil/trunc 에 넣으면 -4 / -3 / -3. 칠판 수직선으로 한 번 더 확인합니다. 다음 실습(원의 넓이)에서 <code>math.pi</code> 를 씁니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>print(7 // 2 + 7 % 2 * 10)</code> 의 결과는?', options: ['13', '4', '35', '3.5'], answer: 0,
            explain: '<code>7 // 2 = 3</code>, <code>7 % 2 * 10 = 1 * 10 = 10</code>, 3 + 10 = 13. //, %, * 는 같은 순위라 왼쪽부터, + 는 마지막입니다.',
            notes: '<p>1분 동안 혼자 풀게 한 뒤 답을 공개합니다. 틀린 학생에게는 식을 괄호로 나눠 다시 써 보게 합니다: <code>(7 // 2) + ((7 % 2) * 10)</code>.</p>' },
          { layout: 'practice', title: '실습 4-3. 초를 시 · 분 · 초로', desc: '초를 입력받아 <b>몇 시간 몇 분 몇 초</b>인지 출력하세요. (3725 → 1시간 2분 5초)',
            starter: 'sec = int(input("초 : "))\n\n# TODO: 시간, 분, 초 구하기\n',
            solution: 'sec = int(input("초 : "))\n\nhour = sec // 3600\nsec = sec % 3600\nminute = sec // 60\nsec = sec % 60\n\nprint("%d시간 %d분 %d초" % (hour, minute, sec))\n', stdin: '3725\n',
            notes: '<p>5분 정도 시간을 줍니다. 막히는 학생에게는 "3725 초 안에 3600 초(1시간)가 몇 번 들어 있지?"라고 물어봅니다.</p><p>이 문제는 다음 시간 동전 교환 프로그램과 구조가 똑같습니다 — 미리 복선으로 알려 줍니다.</p>' },
          { layout: 'practice', title: '🚀 프로젝트 4-5. 건강 계산기', desc: '키 · 몸무게 · 기온 · 풍속을 입력받아 <b>BMI · 표준 체중 · 비만도 · 체감 온도</b>를 계산하세요. (체감 온도 = 13.12 + 0.6215T − 11.37V<sup>0.16</sup> + 0.3965TV<sup>0.16</sup>)',
            starter: 'height = float(input("키(cm) : "))\nweight = float(input("몸무게(kg) : "))\ntemp = float(input("기온(C) : "))\nwind = float(input("풍속(km/h) : "))\n\nm = height / 100\n# TODO: bmi, 표준 체중, 비만도, 체감 온도\n',
            solution: 'height = float(input("키(cm) : "))\nweight = float(input("몸무게(kg) : "))\ntemp = float(input("기온(C) : "))\nwind = float(input("풍속(km/h) : "))\n\nm = height / 100\nbmi = weight / m ** 2\nstandard = 22 * m ** 2\nchill = 13.12 + 0.6215 * temp - 11.37 * wind ** 0.16 + 0.3965 * temp * wind ** 0.16\n\nprint("BMI : %.1f" % bmi)\nprint("표준 체중 : %.1fkg" % standard)\nprint("비만도 : %.1f%%" % (weight / standard * 100))\nprint("체감 온도 : %.1f도" % chill)\n', stdin: '175\n70\n-5\n20\n',
            notes: '<p>이번 장의 첫 미니 프로젝트입니다. 시간이 부족하면 BMI 까지만 수업에서 함께 만들고 체감 온도는 과제로 냅니다.</p><p>지도 포인트: ① 키는 cm 로 받아 m 로 바꾸기, ② <code>V ** 0.16</code> 처럼 지수가 소수여도 된다는 것, ③ <code>%%</code> 로 퍼센트 기호 출력하기, ④ "입력 → 계산 → 출력" 구역 나누기.</p>' },
          { layout: 'summary', title: '1교시 정리', bullets: [
            '연산자 = 계산 기호, 피연산자 = 계산 재료',
            '산술 연산자: <code>+ - * / // % **</code>',
            '<code>/</code> 는 항상 실수, <code>//</code> 는 <b>내림</b>(음수 주의), <code>%</code> 나머지',
            '<code>divmod()</code> · <code>abs</code> · <code>round</code> · <code>pow</code> · <code>min</code> · <code>max</code> · <code>sum</code> · <code>math</code> 모듈',
            '우선순위: 괄호 → 제곱 → 곱셈 · 나눗셈 → 덧셈 · 뺄셈 (같으면 왼쪽부터)',
            '<code>;</code> 로 문장 구분, <code>a, b = 5, 3</code> 으로 동시 대입'
          ], notes: '<p>다음 시간: 문자열 ↔ 숫자 변환과 대입 연산자, 그리고 [프로그램 1] 동전 교환을 완성합니다.</p>' }
        ]
      },

      /* ═════════════════════════ 4-2 ═════════════════════════ */
      {
        id: 'ch04-2',
        title: '형 변환 · 대입 연산자 · [프로그램 1] 동전 교환',
        minutes: 50,
        goals: [
          'int() · float() 로 문자열을 숫자로, str() 로 숫자를 문자열로 바꿀 수 있다',
          '+=, -=, *=, /=, //=, %=, **= 대입 연산자의 뜻을 설명할 수 있다',
          '// 와 % 를 반복해서 동전 교환 프로그램을 완성할 수 있다',
          '파이썬에 증감 연산자(++)가 없는 이유를 설명할 수 있다',
          '+= 가 불변 값과 가변 값에서 어떻게 다르게 동작하는지 설명할 수 있다'
        ],
        flow: [['복습: // 와 %', 3], ['문자열 ↔ 숫자 변환', 12], ['대입 연산자 · ++ 가 없는 이유', 10], ['[프로그램 1] 동전 교환 완성', 15], ['+= 의 정체 · 연산자와 자료형', 5], ['실습 · 정리', 5]],
        content: [
          { type: 'h', text: '문자열과 숫자의 상호 변환' },
          { type: 'p', html: '<code>"100"</code> 처럼 따옴표 안에 숫자가 들어 있으면 겉보기에는 숫자지만 실제로는 <b>문자열</b>입니다. 문자열로는 산술 계산을 할 수 없으므로, 계산하려면 먼저 숫자로 바꿔야 합니다. 이렇게 자료형을 바꾸는 것을 <b>형 변환(type conversion)</b>이라고 합니다.' },
          { type: 'list', items: [
            '<code>int("100")</code> → 정수 <code>100</code> : 문자열을 <b>정수</b>로',
            '<code>float("100.123")</code> → 실수 <code>100.123</code> : 문자열을 <b>실수</b>로',
            '<code>str(100)</code> → 문자열 <code>"100"</code> : 숫자를 <b>문자열</b>로'
          ] },
          { type: 'figure', caption: '문자열과 숫자 사이의 형 변환 함수', html: `<svg viewBox="0 0 660 230" width="100%" style="max-width:660px" font-family="sans-serif">
  <rect x="30" y="75" width="190" height="80" rx="14" fill="var(--warn)" opacity="0.85"/>
  <text x="125" y="108" text-anchor="middle" font-size="18" fill="#fff">문자열 (str)</text>
  <text x="125" y="138" text-anchor="middle" font-size="22" font-weight="bold" fill="#fff" font-family="monospace">"100"</text>
  <rect x="440" y="20" width="190" height="80" rx="14" fill="var(--accent)" opacity="0.9"/>
  <text x="535" y="53" text-anchor="middle" font-size="18" fill="#fff">정수 (int)</text>
  <text x="535" y="83" text-anchor="middle" font-size="22" font-weight="bold" fill="#fff" font-family="monospace">100</text>
  <rect x="440" y="130" width="190" height="80" rx="14" fill="var(--accent2)" opacity="0.9"/>
  <text x="535" y="163" text-anchor="middle" font-size="18" fill="#fff">실수 (float)</text>
  <text x="535" y="193" text-anchor="middle" font-size="22" font-weight="bold" fill="#fff" font-family="monospace">100.123</text>
  <g stroke-width="3" fill="none">
    <path d="M225 95 Q330 30 432 55" stroke="var(--accent)"/><path d="M424 45 L436 56 L421 64" stroke="var(--accent)"/>
    <path d="M432 75 Q330 120 228 115" stroke="var(--warn)" stroke-dasharray="7 5"/>
    <path d="M225 135 Q330 200 432 175" stroke="var(--accent2)"/><path d="M422 166 L436 175 L423 185" stroke="var(--accent2)"/>
  </g>
  <text x="325" y="42" text-anchor="middle" font-size="18" fill="var(--accent)" font-family="monospace">int()</text>
  <text x="330" y="112" text-anchor="middle" font-size="18" fill="var(--warn)" font-family="monospace">str()</text>
  <text x="325" y="212" text-anchor="middle" font-size="18" fill="var(--accent2)" font-family="monospace">float()</text>
</svg>` },
          { type: 'code', title: '예제. 문자열을 숫자로 바꿔 계산하기', code: 's1, s2, s3 = "100", "100.123", "99999999999999999999"\nprint(int(s1) + 1, float(s2) + 1, int(s3) + 1)', expect: '101 101.123 100000000000000000000',
            desc: '<code>int(s1)</code> 이 정수 100 이 되어 1 을 더하면 101, <code>float(s2)</code> 는 실수 100.123 이 되어 101.123 입니다. 파이썬의 정수는 크기 제한이 없어서 아주 큰 수 <code>s3</code> 도 정확하게 계산됩니다.' },
          { type: 'p', html: '반대로 숫자를 문자열로 바꿀 때는 <code>str()</code> 함수를 씁니다. 문자열끼리 <code>+</code> 하면 더하기가 아니라 <b>이어 붙이기(연결)</b>가 됩니다.' },
          { type: 'code', repl: true, title: '예제. 숫자를 문자열로 바꿔 연결하기', code: "a = 100; b = 100.123\nstr(a) + '1'; str(b) + '1'", expect: ">>> a = 100; b = 100.123\n>>> str(a) + '1'; str(b) + '1'\n'1001'\n'100.1231'\n>>>",
            desc: '<code>str(a)</code> 가 문자열 <code>\'100\'</code> 이 되고, 여기에 문자열 <code>\'1\'</code> 을 이어 붙여 <code>\'1001\'</code> 이 됩니다. 101 이 아니라는 점에 주의! 셸은 문자열 결과를 따옴표와 함께 보여 줍니다.' },
          { type: 'callout', kind: 'warn', title: '흔한 실수: 문자열과 숫자를 바로 더하기', html: '<code>"100" + 1</code> 처럼 문자열과 숫자를 <code>+</code> 로 바로 연결하면 <code>TypeError</code> 가 납니다. 파이썬은 "숫자 덧셈"인지 "문자열 연결"인지 대신 정해 주지 않습니다. 또 <code>int("100.123")</code> 처럼 소수점이 있는 문자열을 <code>int()</code> 로 바꾸면 <code>ValueError</code> 가 납니다(<code>int(float("100.123"))</code> 처럼 두 단계로 바꿉니다).' },
          { type: 'code', title: '추가 예제. 문자열 + 숫자 오류', desc: '<code>s</code> 는 문자열 "100" 이라서 숫자 1 과 <code>+</code> 할 수 없습니다. <code>int(s) + 1</code> 또는 <code>s + "1"</code> 로 고칩니다.',
            code: 's = "100"\nprint(s + 1)', expectError: true, expect: 'Traceback (most recent call last):\n  File "main.py", line 2, in <module>\n    print(s + 1)\n          ~~^~~\nTypeError: can only concatenate str (not "int") to str' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: input() 은 항상 문자열', html: '<code>input()</code> 으로 받은 값은 숫자를 입력해도 <b>문자열</b>입니다. 그래서 계산에 쓰려면 <code>int(input(...))</code> 처럼 감싸야 합니다. 값의 자료형은 <code>type()</code> 으로 확인할 수 있습니다. 또 <code>int(3.99)</code> 는 반올림이 아니라 <b>소수점 아래를 잘라</b> <code>3</code> 이 되고, 반올림은 <code>round(3.99)</code> → <code>4</code> 로 합니다.' },
          { type: 'code', repl: true, title: '추가 예제. type() · int() · round()', code: 'type("100")\ntype(int("100"))\ntype(float("100"))\nint(3.99)\nround(3.99)\nint(float("100.123"))', expect: ">>> type(\"100\")\n<class 'str'>\n>>> type(int(\"100\"))\n<class 'int'>\n>>> type(float(\"100\"))\n<class 'float'>\n>>> int(3.99)\n3\n>>> round(3.99)\n4\n>>> int(float(\"100.123\"))\n100\n>>>" },

          { type: 'h', text: '대입 연산자' },
          { type: 'p', html: '<code>=</code> 외에도 "계산한 다음 다시 그 변수에 넣는" 대입 연산자가 있습니다. 예를 들어 <code>a += 3</code> 은 "a 에 3 을 더해서 다시 a 에 넣어라", 즉 <code>a = a + 3</code> 과 같습니다. 산술 연산자 뒤에 <code>=</code> 를 붙인 모양이라 외우기 쉽습니다.' },
          { type: 'table', caption: '표 4-2 대입 연산자의 종류', head: ['연산자', '사용 예', '설명'], rows: [
            ['<code>+=</code>', '<code>a += 3</code>', '<code>a = a + 3</code> 과 동일'],
            ['<code>-=</code>', '<code>a -= 3</code>', '<code>a = a - 3</code> 과 동일'],
            ['<code>*=</code>', '<code>a *= 3</code>', '<code>a = a * 3</code> 과 동일'],
            ['<code>/=</code>', '<code>a /= 3</code>', '<code>a = a / 3</code> 과 동일'],
            ['<code>//=</code>', '<code>a //= 3</code>', '<code>a = a // 3</code> 과 동일'],
            ['<code>%=</code>', '<code>a %= 3</code>', '<code>a = a % 3</code> 과 동일'],
            ['<code>**=</code>', '<code>a **= 3</code>', '<code>a = a ** 3</code> 과 동일']
          ] },
          { type: 'code', title: '예제. 대입 연산자로 값 누적하기', code: 'a = 10\na += 5; print(a)\na -= 5; print(a)\na *= 5; print(a)\na /= 5; print(a)\na //= 5; print(a)\na %= 5; print(a)\na **= 5; print(a)', expect: '15\n10\n50\n10.0\n2.0\n2.0\n32.0',
            desc: 'a 는 10 에서 시작해 한 줄씩 지날 때마다 값이 바뀝니다(누적). <code>a /= 5</code> 에서 <code>/</code> 가 실수를 만들기 때문에 그 뒤로는 계속 <code>10.0</code>, <code>2.0</code> … 처럼 실수로 나옵니다.' },
          { type: 'figure', caption: '대입 연산자가 실행될 때마다 바뀌는 a 의 값', html: (function () {
            var steps = [['시작', '10'], ['+= 5', '15'], ['-= 5', '10'], ['*= 5', '50'], ['/= 5', '10.0'], ['//= 5', '2.0'], ['%= 5', '2.0'], ['**= 5', '32.0']];
            var s = '<svg viewBox="0 0 760 150" width="100%" style="max-width:760px" font-family="monospace">';
            steps.forEach(function (st, i) {
              var x = 10 + i * 94, isF = i >= 4;
              s += '<rect x="' + x + '" y="60" width="80" height="54" rx="10" fill="' + (isF ? 'var(--accent2)' : 'var(--accent)') + '" opacity="0.88"/>';
              s += '<text x="' + (x + 40) + '" y="95" text-anchor="middle" font-size="21" font-weight="bold" fill="#fff">' + st[1] + '</text>';
              s += '<text x="' + (x + 40) + '" y="45" text-anchor="middle" font-size="17" fill="var(--fg)">' + st[0] + '</text>';
              if (i) s += '<text x="' + (x - 7) + '" y="93" text-anchor="middle" font-size="16" fill="var(--muted)">›</text>';
            });
            s += '<text x="380" y="140" text-anchor="middle" font-size="15" fill="var(--muted)">/= 이후로는 실수(float)가 된다</text>';
            return s + '</svg>';
          })() },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 파이썬에는 ++ 가 없다', html: 'C · 자바에서는 1 증가를 <code>a++</code> 로 쓰지만 파이썬에는 <b>증감 연산자가 없습니다</b>. <code>a++</code> 는 문법 오류(SyntaxError)이고, <code>++a</code> 는 오류는 아니지만 <code>+(+a)</code>(부호 <code>+</code> 를 두 번 붙인 것)로 해석되어 값이 바뀌지 않습니다. 1 증가는 <code>a += 1</code> 로 씁니다.<br>왜 없앴을까요? <code>a++</code> 는 "값을 쓰면서 동시에 변수를 바꾸는" 연산이라 <code>b = a++ + ++a</code> 같은 식에서 읽기 어려운 코드가 생기고, 파이썬은 <b>"한 줄은 한 가지 일만"</b>이라는 원칙을 택했기 때문입니다. <code>+=</code> 만 있어도 충분하고 뜻이 분명합니다.' },
          { type: 'code', title: '추가 예제. a++ 는 문법 오류', code: 'a = 5\na++', expectError: true, expect: '  File "main.py", line 2\n    a++\n       ^\nSyntaxError: invalid syntax',
            desc: '<b>SyntaxError</b> 는 프로그램이 <b>시작도 하기 전에</b> 나는 오류입니다(문장 구조 자체가 틀림). 그래서 1행의 <code>a = 5</code> 도 실행되지 않습니다. <code>^</code> 표시가 파이썬이 "여기서 막혔다"고 알려 주는 위치입니다.' },
          { type: 'code', repl: true, title: '추가 예제. ++a 는 오류가 아니지만 값도 그대로', code: 'a = 5\na += 1\na\n++a\na', expect: '>>> a = 5\n>>> a += 1\n>>> a\n6\n>>> ++a\n6\n>>> a\n6\n>>>',
            desc: '<code>++a</code> 는 <code>+(+a)</code> 이므로 a 의 값을 두 번 "그대로" 읽을 뿐, a 를 바꾸지 않습니다. 다른 언어를 먼저 배운 사람이 자주 겪는 함정입니다.' },

          { type: 'h', text: '[프로그램 1]의 완성: 동전 교환' },
          { type: 'p', html: '이제 동전 교환 프로그램을 만들 수 있습니다. 아이디어는 간단합니다. <b>큰 동전부터</b> 몫(<code>//</code>)으로 개수를 구하고, 나머지(<code>%</code>)를 다음 동전으로 넘기는 일을 반복합니다.' },
          { type: 'figure', caption: '7777원을 동전으로 바꾸는 과정 — // 로 개수, % 로 남은 돈', html: (function () {
            var st = [['7777', '500', '15', '277'], ['277', '100', '2', '77'], ['77', '50', '1', '27'], ['27', '10', '2', '7']];
            var s = '<svg viewBox="0 0 760 250" width="100%" style="max-width:760px" font-family="sans-serif">';
            st.forEach(function (r, i) {
              var x = 10 + i * 185;
              s += '<rect x="' + x + '" y="20" width="150" height="46" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>';
              s += '<text x="' + (x + 75) + '" y="51" text-anchor="middle" font-size="21" font-weight="bold" fill="var(--fg)">' + r[0] + '원</text>';
              s += '<text x="' + (x + 75) + '" y="100" text-anchor="middle" font-size="16" fill="var(--muted)" font-family="monospace">// ' + r[1] + '  |  % ' + r[1] + '</text>';
              s += '<circle cx="' + (x + 40) + '" cy="155" r="34" fill="var(--warn)" opacity="0.85"/>';
              s += '<text x="' + (x + 40) + '" y="152" text-anchor="middle" font-size="15" fill="#fff">' + r[1] + '원</text>';
              s += '<text x="' + (x + 40) + '" y="172" text-anchor="middle" font-size="17" font-weight="bold" fill="#fff">× ' + r[2] + '</text>';
              s += '<text x="' + (x + 115) + '" y="160" text-anchor="middle" font-size="16" fill="var(--accent2)">남은 돈</text>';
              s += '<text x="' + (x + 115) + '" y="182" text-anchor="middle" font-size="19" font-weight="bold" fill="var(--accent2)">' + r[3] + '원</text>';
              if (i < 3) s += '<path d="M' + (x + 115) + ' 195 Q' + (x + 160) + ' 235 ' + (x + 200) + ' 70" fill="none" stroke="var(--accent2)" stroke-width="2" stroke-dasharray="5 4"/>';
            });
            s += '<text x="380" y="243" text-anchor="middle" font-size="15" fill="var(--muted)">마지막에 남은 7원은 동전으로 바꿀 수 없는 잔돈</text>';
            return s + '</svg>';
          })() },
          { type: 'code', title: 'Code04-01. [프로그램 1] 완성: 동전 교환', code: PROG1, stdin: '7777\n', expect: PROG1_OUT,
            desc: '실행한 뒤 콘솔에 금액을 입력하세요. "예시 입력으로 실행"을 누르면 7777 이 자동으로 입력됩니다.' },
          { type: 'list', items: [
            '<code>2행</code>: 교환할 돈(money)과 500 · 100 · 50 · 10원짜리 동전 개수를 저장할 변수를 모두 0 으로 준비한다.',
            '<code>5행</code>: 금액을 입력받아 <code>int()</code> 로 정수로 바꾼다.',
            '<code>7행</code>: 500원짜리 동전 개수 = 돈 ÷ 500 의 <b>몫</b>.',
            '<code>8행</code>: <code>money %= 500</code> — 500 으로 나눈 <b>나머지</b>를 다시 money 에 저장한다(<code>money = money % 500</code> 과 같다).',
            '<code>10~11행</code> 100원, <code>13~14행</code> 50원, <code>16~17행</code> 10원도 같은 방식으로 구한다.',
            '<code>19~23행</code>: 결과 출력. 마지막 money 에는 10 미만의 값, 즉 바꿀 수 없는 잔돈이 남는다.'
          ] },
          { type: 'callout', kind: 'info', title: '%d 서식', html: '<code>"%d개" % c500</code> 는 문자열 안의 <code>%d</code> 자리에 정수 c500 의 값을 끼워 넣는 <b>서식 문자열</b>입니다(3장 참고). 여기서의 <code>%</code> 는 나머지 연산자가 아니라 서식 연산자로 쓰인 것입니다. 앞이 문자열이면 서식, 숫자면 나머지 연산으로 동작합니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: divmod() 와 f-string 으로 더 짧게', html: '<code>divmod(money, 500)</code> 는 몫과 나머지를 한 번에 돌려주므로 <code>c500, money = divmod(money, 500)</code> 한 줄로 두 줄을 대신할 수 있습니다. 출력은 최신 파이썬의 <b>f-string</b>(<code>f"{c500}개"</code>)을 쓰면 변수 이름을 문자열 안에 바로 적을 수 있습니다.' },
          { type: 'code', title: '추가 예제. divmod() 와 f-string 으로 만든 동전 교환', code: 'money = int(input("교환할 돈은 얼마? "))\n\nc500, money = divmod(money, 500)\nc100, money = divmod(money, 100)\nc50, money = divmod(money, 50)\nc10, money = divmod(money, 10)\n\nprint(f"500원 {c500}개, 100원 {c100}개, 50원 {c50}개, 10원 {c10}개")\nprint(f"바꾸지 못한 잔돈 {money}원")', stdin: '7777\n', expect: '교환할 돈은 얼마? 7777\n500원 15개, 100원 2개, 50원 1개, 10원 2개\n바꾸지 못한 잔돈 7원' },

          { type: 'h', text: '한 걸음 더 ① 형 변환 자세히 보기' },
          { type: 'p', html: '<code>int()</code> 는 <b>진법</b>을 두 번째 인자로 받을 수 있고, <code>int(실수)</code> 는 반올림이 아니라 <b>0 쪽으로 버림</b>입니다. 이런 세부 규칙을 알아 두면 "왜 내 계산이 1 차이가 나지?" 하는 상황을 줄일 수 있습니다.' },
          { type: 'code', title: '추가 예제. 형 변환의 세부 규칙', code: 'print(int("ff", 16), int("1010", 2), int("777", 8))\nprint(float("3.14"), float("1e3"))\nprint(int(-3.9), round(-3.5), round(-2.5))\nprint(str(3.14) + "!", repr("abc"))\nprint("3.14".isdigit(), "314".isdigit())',
            expect: '255 10 511\n3.14 1000.0\n-3 -4 -2\n3.14! \'abc\'\nFalse True',
            desc: '<code>int("ff", 16)</code> 은 16진수 문자열을 정수로 바꿉니다. <code>int(-3.9)</code> 가 -4 가 아니라 <b>-3</b> 인 것에 주의하세요(0 쪽으로 버림). <code>repr()</code> 은 "파이썬이 보는 모습 그대로" 보여 주는 함수여서 문자열에 따옴표가 붙습니다 — 값이 문자열인지 숫자인지 헷갈릴 때 디버깅에 아주 좋습니다. <code>"314".isdigit()</code> 은 "이 문자열이 숫자로만 되어 있는가?"를 알려 줍니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 입력이 숫자가 아닐 때', html: '<code>int(input())</code> 에 사용자가 <code>abc</code> 를 입력하면 <code>ValueError: invalid literal for int() with base 10: \'abc\'</code> 로 프로그램이 멈춥니다. 실무에서는 이럴 때 ① <code>isdigit()</code> 으로 미리 검사하거나, ② <code>try ~ except</code> 로 오류를 잡아 다시 묻습니다(예외 처리는 12장). 지금은 "입력값은 항상 의심한다"는 감각만 챙기면 충분합니다.' },

          { type: 'h', text: '한 걸음 더 ② a += b 는 정확히 무슨 뜻일까' },
          { type: 'p', html: '<code>a += b</code> 를 "<code>a = a + b</code> 의 줄임"이라고 배웠지만, 정확히 말하면 조금 다릅니다. 파이썬에서 변수는 <b>값이 담긴 상자</b>가 아니라 <b>값에 붙인 이름표</b>입니다. 숫자 · 문자열처럼 <b>바꿀 수 없는(불변, immutable)</b> 값은 <code>+=</code> 를 해도 새 값을 만들어 이름표를 옮기지만, 리스트처럼 <b>바꿀 수 있는(가변, mutable)</b> 값은 <code>+=</code> 가 <b>그 자리에서</b> 내용을 늘립니다.' },
          { type: 'code', title: '추가 예제. += 가 원본을 바꿀 때와 바꾸지 않을 때', code: 'nums = [1, 2]\nsame = nums\nnums += [3]\nprint(nums, same, nums is same)\n\nnums2 = [1, 2]\nsame2 = nums2\nnums2 = nums2 + [3]\nprint(nums2, same2, nums2 is same2)\n\ntext = "파이"\nbefore = text\ntext += "썬"\nprint(text, before)',
            expect: '[1, 2, 3] [1, 2, 3] True\n[1, 2, 3] [1, 2] False\n파이썬 파이',
            desc: '<code>nums += [3]</code> 은 리스트를 <b>그 자리에서</b> 늘리므로 같은 리스트를 보고 있던 <code>same</code> 까지 같이 바뀝니다(<code>is</code> 도 True). 반면 <code>nums2 = nums2 + [3]</code> 은 <b>새 리스트</b>를 만들어 이름만 옮기므로 <code>same2</code> 는 그대로입니다. 문자열은 불변이라 언제나 새 문자열이 만들어집니다. 리스트는 7장에서 배우지만, <code>+=</code> 의 정체를 이해해 두면 나중에 "왜 원본이 바뀌었지?" 하는 버그를 피할 수 있습니다.' },
          { type: 'figure', caption: '숫자 · 문자열(불변)과 리스트(가변)에서의 += 차이', html: `<svg viewBox="0 0 720 240" width="100%" style="max-width:720px" font-family="sans-serif">
  <text x="180" y="24" text-anchor="middle" font-size="18" font-weight="bold" fill="var(--warn)">불변: text += "썬"</text>
  <text x="540" y="24" text-anchor="middle" font-size="18" font-weight="bold" fill="var(--ok)">가변: nums += [3]</text>
  <rect x="40" y="45" width="110" height="46" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <text x="95" y="75" text-anchor="middle" font-size="19" font-family="monospace" fill="var(--fg)">"파이"</text>
  <rect x="215" y="45" width="130" height="46" rx="10" fill="var(--accent)" opacity="0.9"/>
  <text x="280" y="75" text-anchor="middle" font-size="19" font-family="monospace" fill="#fff">"파이썬"</text>
  <path d="M155 68 H208" stroke="var(--muted)" stroke-width="2"/><path d="M203 62 L212 68 L203 74 Z" fill="var(--muted)"/>
  <text x="95" y="120" text-anchor="middle" font-size="16" fill="var(--muted)">원래 값은 그대로</text>
  <text x="280" y="120" text-anchor="middle" font-size="16" fill="var(--accent)">새 값을 만들어 이름표 이동</text>
  <text x="60" y="160" font-size="17" font-family="monospace" fill="var(--fg)">text ─┐</text>
  <text x="60" y="185" font-size="17" font-family="monospace" fill="var(--muted)">before ─→ "파이"</text>
  <text x="120" y="160" font-size="17" font-family="monospace" fill="var(--accent)">└→ "파이썬"</text>
  <rect x="420" y="45" width="230" height="46" rx="10" fill="var(--ok)" opacity="0.85"/>
  <text x="535" y="75" text-anchor="middle" font-size="19" font-family="monospace" fill="#fff">[1, 2] → [1, 2, 3]</text>
  <text x="535" y="120" text-anchor="middle" font-size="16" fill="var(--ok)">같은 리스트를 그 자리에서 수정</text>
  <text x="430" y="160" font-size="17" font-family="monospace" fill="var(--fg)">nums ─┐</text>
  <text x="430" y="185" font-size="17" font-family="monospace" fill="var(--fg)">same ─┘→ 같은 리스트 하나</text>
  <text x="360" y="225" text-anchor="middle" font-size="15" fill="var(--muted)">변수는 "상자"가 아니라 값에 붙인 "이름표"</text>
</svg>` },

          { type: 'h', text: '한 걸음 더 ③ + 와 * 는 숫자만의 것이 아니다' },
          { type: 'p', html: '같은 연산자라도 <b>피연산자의 자료형에 따라 하는 일이 달라집니다</b>(이것을 연산자 오버로딩이라고 합니다). 문자열의 <code>+</code> 는 이어 붙이기, <code>*</code> 는 반복입니다. 줄 구분선을 만들 때 <code>"=" * 30</code> 은 아주 자주 쓰는 관용구입니다.' },
          { type: 'code', title: '추가 예제. 문자열 · 리스트에 쓰는 + 와 *', code: 'print("=" * 30)\nprint("파이썬 " * 3)\nprint("Hello, " + "world!")\nprint([1, 2] * 2)\nprint("3" * 3, 3 * 3)',
            expect: '==============================\n파이썬 파이썬 파이썬\nHello, world!\n[1, 2, 1, 2]\n333 9',
            desc: '마지막 줄이 핵심입니다. <code>"3" * 3</code> 은 문자열 반복이라 <code>333</code>, <code>3 * 3</code> 은 곱셈이라 <code>9</code>. 같은 <code>*</code> 인데 자료형에 따라 뜻이 달라지므로, <code>input()</code> 으로 받은 값이 문자열이라는 사실을 늘 기억해야 합니다.' }
        ],
        practice: [
          { title: 'SELF STUDY 4-1. 지폐로 교환하기', level: 2,
            desc: '<p>돈(예: 777777)을 입력하면 5만 원, 1만 원, 5000원, 1000원 지폐로 교환하는 프로그램을 작성하세요. 지폐로 바꾸지 못한 돈도 출력합니다.</p><pre>지폐로 교환할 돈은 얼마? 777777\n\n 50000원짜리 ==> 15장\n 10000원짜리 ==> 2장\n 5000원짜리 ==> 1장\n 1000원짜리 ==> 2장\n 지폐로 바꾸지 못한 돈 ==> 777원</pre>',
            hint: 'Code04-01 의 500 · 100 · 50 · 10 을 50000 · 10000 · 5000 · 1000 으로 바꾸면 됩니다.',
            starter: 'money = int(input("지폐로 교환할 돈은 얼마? "))\nc50000, c10000, c5000, c1000 = 0, 0, 0, 0\n\n# TODO: // 와 %= 로 지폐 장수 구하기\n\nprint("\\n 50000원짜리 ==> %d장" % c50000)\n',
            solution: 'money, c50000, c10000, c5000, c1000 = 0, 0, 0, 0, 0\n\nmoney = int(input("지폐로 교환할 돈은 얼마? "))\n\nc50000 = money // 50000\nmoney %= 50000\n\nc10000 = money // 10000\nmoney %= 10000\n\nc5000 = money // 5000\nmoney %= 5000\n\nc1000 = money // 1000\nmoney %= 1000\n\nprint("\\n 50000원짜리 ==> %d장" % c50000)\nprint(" 10000원짜리 ==> %d장" % c10000)\nprint(" 5000원짜리 ==> %d장" % c5000)\nprint(" 1000원짜리 ==> %d장" % c1000)\nprint(" 지폐로 바꾸지 못한 돈 ==> %d원 \\n" % money)\n',
            stdin: '777777\n',
            expect: '지폐로 교환할 돈은 얼마? 777777\n\n 50000원짜리 ==> 15장\n 10000원짜리 ==> 2장\n 5000원짜리 ==> 1장\n 1000원짜리 ==> 2장\n 지폐로 바꾸지 못한 돈 ==> 777원' },
          { title: '실습 4-6. 문자열 연결과 숫자 덧셈', level: 1,
            desc: '<p>숫자 두 개를 입력받아 <b>문자열로 이어 붙인 결과</b>와 <b>숫자로 더한 결과</b>를 모두 출력하세요.</p><p>예) 100 과 23 입력 → <code>문자열 연결 : 10023</code>, <code>숫자 덧셈 : 123</code></p>',
            hint: '<code>input()</code> 의 결과는 문자열이므로 그대로 <code>+</code> 하면 연결, <code>int()</code> 로 바꾼 뒤 <code>+</code> 하면 덧셈입니다.',
            starter: 's1 = input("첫 번째 수 : ")\ns2 = input("두 번째 수 : ")\n\n# TODO: 문자열 연결 결과와 숫자 덧셈 결과 출력\n',
            solution: 's1 = input("첫 번째 수 : ")\ns2 = input("두 번째 수 : ")\n\nprint("문자열 연결 :", s1 + s2)\nprint("숫자 덧셈 :", int(s1) + int(s2))\n',
            stdin: '100\n23\n',
            expect: '첫 번째 수 : 100\n두 번째 수 : 23\n문자열 연결 : 10023\n숫자 덧셈 : 123' },
          { title: '실습 4-7. 용돈 기입장 (대입 연산자 누적)', level: 1,
            desc: '<p>이번 달 용돈을 입력받아 아래 일이 차례로 일어난 뒤 남은 돈을 단계마다 출력하세요. <b>반드시 대입 연산자(<code>-=</code>, <code>+=</code>, <code>//=</code>)</b>를 사용합니다.</p><ol><li>점심값 4500원을 쓴다</li><li>음료 1500원을 쓴다</li><li>심부름 보상 10000원을 받는다</li><li>남은 돈의 절반을 저축한다 (정수 나눗셈)</li></ol><p>예) 50000 → 45500 → 44000 → 54000 → 27000</p>',
            hint: '<code>money -= 4500</code> 처럼 한 줄씩 값을 바꾸고 그때마다 <code>print()</code> 합니다. 절반은 <code>money //= 2</code> (실수가 되지 않게 <code>//=</code> 를 씁니다).',
            starter: 'money = int(input("이번 달 용돈 : "))\n\n# TODO: -= , += , //= 로 단계마다 금액 바꾸고 출력\nmoney -= 4500\nprint("점심 후 :", money)\n',
            solution: 'money = int(input("이번 달 용돈 : "))\n\nmoney -= 4500\nprint("점심 후 :", money)\n\nmoney -= 1500\nprint("음료 후 :", money)\n\nmoney += 10000\nprint("심부름 보상 후 :", money)\n\nmoney //= 2\nprint("절반 저축 후 남은 돈 :", money)\n',
            stdin: '50000\n',
            expect: '이번 달 용돈 : 50000\n점심 후 : 45500\n음료 후 : 44000\n심부름 보상 후 : 54000\n절반 저축 후 남은 돈 : 27000' },
          { title: '실습 4-8. 할인가와 부가세 계산', level: 2,
            desc: '<p>정가와 할인율(%)을 입력받아 다음을 출력하세요.</p><ul><li>할인가 = 정가 × (100 − 할인율) ÷ 100 (원 단위 정수, 버림)</li><li>부가세 = 할인가의 10% (버림)</li><li>최종 결제 금액 = 할인가 + 부가세에서 <b>100원 미만을 잘라 낸 값</b></li></ul><p>예) 정가 17900, 할인율 15 → 할인가 15215, 부가세 1521, 최종 16700</p>',
            hint: '돈 계산은 실수 오차를 피하려고 <b>정수</b>로 합니다. <code>price * (100 - rate) // 100</code> 처럼 곱한 뒤 <code>//</code> 하세요. 100원 미만 자르기는 <code>total // 100 * 100</code> 입니다. 서식 문자열에서 % 기호 자체는 <code>%%</code> 로 씁니다.',
            starter: 'price = int(input("정가 : "))\nrate = int(input("할인율(%) : "))\n\n# TODO: 할인가, 부가세, 최종 금액 계산\nsale = 0\n\nprint("할인가 : %d원" % sale)\n',
            solution: 'price = int(input("정가 : "))\nrate = int(input("할인율(%) : "))\n\nsale = price * (100 - rate) // 100\ntax = sale // 10\ntotal = sale + tax\ntotal = total // 100 * 100\n\nprint("할인가 : %d원" % sale)\nprint("부가세(10%%) : %d원" % tax)\nprint("최종 결제 금액 : %d원" % total)\n',
            stdin: '17900\n15\n',
            expect: '정가 : 17900\n할인율(%) : 15\n할인가 : 15215원\n부가세(10%) : 1521원\n최종 결제 금액 : 16700원' },
          { title: '🚀 프로젝트 4-9. 대출 이자 계산기', level: 3,
            desc: '<p>원금 · 연이율 · 기간을 입력받아 <b>단리 · 복리 · 원리금 균등 상환</b>을 한 번에 비교하는 계산기를 만드세요.</p><ul><li><b>입력</b>: 대출 원금(원, 정수), 연이율(%, 실수), 기간(년, 정수)</li><li><b>단리 이자</b> = 원금 × 이율 × 기간 (이율 r = 연이율 ÷ 100)</li><li><b>복리 총액</b> = 원금 × (1 + r)<sup>기간</sup> → 복리 이자 = 총액 − 원금</li><li><b>원리금 균등 월 상환액</b> = P × mr × (1+mr)<sup>n</sup> ÷ ((1+mr)<sup>n</sup> − 1) &nbsp;(mr = r ÷ 12, n = 기간 × 12)</li><li>모든 금액은 <code>%d</code> 로 원 단위만 출력</li></ul><pre>대출 원금(원) : 10000000\n연이율(%) : 4.5\n기간(년) : 3\n단리 이자 : 1350000원\n단리 총액 : 11350000원\n복리 이자 : 1411661원\n복리 총액 : 11411661원\n원리금 균등 월 상환액 : 297469원\n총 상환액 : 10708892원</pre><p><b>여기까지 했다면</b> ① 총 이자 부담액(총 상환액 − 원금)도 출력하기, ② 중도 상환 수수료(잔액의 1.2%) 더하기, ③ 월 상환액을 1원 단위에서 올림 처리하기(<code>math.ceil</code>)에 도전해 보세요.</p>',
            hint: '<code>(1 + r) ** years</code> 처럼 <b>제곱 연산자</b>를 쓰면 복리가 한 줄로 계산됩니다. 연이율은 소수가 올 수 있으니 <code>float(input(...))</code>, 원금은 <code>int(input(...))</code> 로 받습니다. <code>%d</code> 서식은 실수를 넣어도 소수점 아래를 잘라 정수로 보여 줍니다.',
            starter: '## 입력 부분 ##\nprincipal = int(input("대출 원금(원) : "))\nrate = float(input("연이율(%) : "))\nyears = int(input("기간(년) : "))\n\n## 계산 부분 ##\nr = rate / 100\nsimple = 0\ncompound = 0\npay = 0\n# TODO: 단리 · 복리 · 월 상환액 계산\n\n## 출력 부분 ##\nprint("단리 이자 : %d원" % simple)\n',
            solution: '## 입력 부분 ##\nprincipal = int(input("대출 원금(원) : "))\nrate = float(input("연이율(%) : "))\nyears = int(input("기간(년) : "))\n\n## 계산 부분 ##\nr = rate / 100\nsimple = principal * r * years\ncompound = principal * (1 + r) ** years - principal\n\nmonths = years * 12\nmr = r / 12\npay = principal * mr * (1 + mr) ** months / ((1 + mr) ** months - 1)\n\n## 출력 부분 ##\nprint("단리 이자 : %d원" % simple)\nprint("단리 총액 : %d원" % (principal + simple))\nprint("복리 이자 : %d원" % compound)\nprint("복리 총액 : %d원" % (principal + compound))\nprint("원리금 균등 월 상환액 : %d원" % pay)\nprint("총 상환액 : %d원" % (pay * months))\n',
            stdin: '10000000\n4.5\n3\n',
            expect: '대출 원금(원) : 10000000\n연이율(%) : 4.5\n기간(년) : 3\n단리 이자 : 1350000원\n단리 총액 : 11350000원\n복리 이자 : 1411661원\n복리 총액 : 11411661원\n원리금 균등 월 상환액 : 297469원\n총 상환액 : 10708892원' }
        ],
        quiz: [
          { q: "다음 코드의 실행 결과는?<pre><code>a = 100\nprint(str(a) + '1')</code></pre>", options: ['101', '1001', "'100' '1'", '오류'], answer: 1,
            explain: '<code>str(a)</code> 는 문자열 <code>"100"</code>, 여기에 <code>"1"</code> 을 이어 붙이면 <code>1001</code> 입니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>a = 10\na += 5\na //= 4\nprint(a)</code></pre>', options: ['3', '3.75', '15', '2'], answer: 0,
            explain: 'a = 10 + 5 = 15, 15 // 4 = 3 입니다.' },
          { q: 'Code04-01 에서 <code>money %= 500</code> 과 같은 뜻의 문장은?', options: ['<code>money = money // 500</code>', '<code>money = money % 500</code>', '<code>money = 500 % money</code>', '<code>money % 500 = money</code>'], answer: 1,
            explain: '<code>a %= b</code> 는 <code>a = a % b</code> 와 같습니다.' },
          { q: '1234원을 Code04-01 로 교환하면 바꾸지 못한 잔돈은?', options: ['4원', '34원', '0원', '14원'], answer: 0,
            explain: '500×2=1000(남 234) → 100×2(남 34) → 50×0(남 34) → 10×3(남 4). 잔돈은 4원입니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>nums = [1, 2]\nsame = nums\nnums += [3]\nprint(same)</code></pre>', options: ['[1, 2]', '[1, 2, 3]', '[3]', '오류'], answer: 1,
            explain: '리스트는 <b>가변</b>이라 <code>+=</code> 가 그 자리에서 내용을 늘립니다. <code>same</code> 은 같은 리스트를 가리키는 다른 이름표이므로 함께 바뀝니다.' },
          { q: '다음 중 실행하면 <b>SyntaxError</b> 가 나는 것은?', options: ['<code>a += 1</code>', '<code>a++</code>', '<code>++a</code>', '<code>a = a + 1</code>'], answer: 1,
            explain: '파이썬에는 증감 연산자가 없습니다. <code>a++</code> 는 문법 오류이고, <code>++a</code> 는 <code>+(+a)</code> 로 해석되어 오류는 없지만 값도 바뀌지 않습니다.' }
        ],
        slides: [
          { layout: 'title', title: '형 변환 · 대입 연산자', subtitle: '[프로그램 1] 동전 교환 완성', badge: 'Chapter 04 · 2교시',
            notes: '<p>복습 발문: "17 // 5 와 17 % 5 는?" (3, 2) — 오늘 동전 교환에서 계속 쓸 연산입니다.</p>' },
          { layout: 'bullets', title: '문자열 ↔ 숫자 변환', lead: '"100" 은 숫자처럼 보여도 문자열!', bullets: [
            '<code>int("100")</code> → 정수 100',
            '<code>float("100.123")</code> → 실수 100.123',
            '<code>str(100)</code> → 문자열 "100"',
            ['문자열끼리 <code>+</code> 는 <b>연결</b>', ['<code>"100" + "1"</code> → <code>"1001"</code>']],
            '<code>input()</code> 의 결과는 항상 문자열'
          ], notes: '<p>3장에서 <code>int(input())</code> 을 써 봤으니 왜 감쌌는지 여기서 이유를 정리합니다.</p><p>발문: "<code>"100" + 1</code> 은 어떻게 될까?" → 직접 실행해 TypeError 를 보여 줍니다.</p>' },
          { layout: 'code', title: '문자열을 숫자로', code: 's1, s2, s3 = "100", "100.123", "99999999999999999999"\nprint(int(s1) + 1, float(s2) + 1, int(s3) + 1)',
            points: ['결과: <code>101 101.123 100000000000000000000</code>', '파이썬 정수는 크기 제한이 없다', '<code>int("100.123")</code> 은 ValueError'],
            notes: '<p>s3 의 아주 큰 수에 1 을 더해도 정확히 계산된다는 점이 다른 언어와 다른 파이썬의 장점입니다.</p><p>시간이 되면 <code>int("100.123")</code> 을 실행해 ValueError 를 보여 줍니다.</p>' },
          { layout: 'code', repl: true, title: '숫자를 문자열로', code: "a = 100; b = 100.123\nstr(a) + '1'; str(b) + '1'",
            points: ["결과: <code>'1001'</code>, <code>'100.1231'</code>", '101 이 아니라 1001!', '셸은 문자열을 따옴표와 함께 보여 준다'],
            notes: '<p>▶ 로 콘솔 셸에서 실행합니다. 세미콜론으로 나눈 두 식의 결과가 각각 한 줄씩 나오는 것을 확인합니다.</p>' },
          { layout: 'table', title: '대입 연산자', lead: 'a += 3 은 a = a + 3 의 줄임', head: ['연산자', '예', '같은 뜻'], rows: [
            ['<code>+=</code>', '<code>a += 3</code>', '<code>a = a + 3</code>'], ['<code>-=</code>', '<code>a -= 3</code>', '<code>a = a - 3</code>'],
            ['<code>*=</code>', '<code>a *= 3</code>', '<code>a = a * 3</code>'], ['<code>/=</code>', '<code>a /= 3</code>', '<code>a = a / 3</code>'],
            ['<code>//=</code>', '<code>a //= 3</code>', '<code>a = a // 3</code>'], ['<code>%=</code>', '<code>a %= 3</code>', '<code>a = a % 3</code>'],
            ['<code>**=</code>', '<code>a **= 3</code>', '<code>a = a ** 3</code>']
          ], notes: '<p><code>a = a + 3</code> 을 수학식으로 보면 말이 안 되지만, "오른쪽을 계산해서 왼쪽에 넣는다"로 읽으면 자연스럽다는 점을 다시 강조합니다.</p><p>파이썬에는 <code>a++</code> 가 없다는 것도 여기서 언급합니다(다른 언어를 아는 학생 대비).</p>' },
          { layout: 'code', title: '대입 연산자로 값 누적', code: 'a = 10\na += 5; print(a)\na -= 5; print(a)\na *= 5; print(a)\na /= 5; print(a)\na //= 5; print(a)\na %= 5; print(a)\na **= 5; print(a)',
            points: ['15 → 10 → 50 → 10.0 → 2.0 → 2.0 → 32.0', '<code>/=</code> 이후는 실수', '한 줄씩 값이 누적된다'],
            notes: '<p>실행 전 학생들에게 각 줄의 결과를 예측해 적게 합니다. 대부분 <code>10.0</code> 부터 실수가 되는 것을 놓칩니다.</p>' },
          { layout: 'two', title: '+= 의 두 얼굴 (불변 vs 가변)', lead: '변수는 상자가 아니라 값에 붙인 이름표',
            left: { title: '문자열(불변) — 새 값', code: 'text = "파이"\nbefore = text\ntext += "썬"\nprint(text, before)' },
            right: { title: '리스트(가변) — 그 자리에서', code: 'nums = [1, 2]\nsame = nums\nnums += [3]\nprint(nums, same, nums is same)' },
            notes: '<p>왼쪽은 <code>파이썬 파이</code>, 오른쪽은 <code>[1, 2, 3] [1, 2, 3] True</code>. 리스트는 7장에서 배우지만, "<code>+=</code> 가 원본을 바꿀 수도 있다"는 사실을 미리 보여 주면 나중에 큰 버그를 막습니다.</p><p>발문: "오른쪽에서 same 은 왜 같이 바뀌었을까?" → 이름표 두 개가 같은 리스트를 가리키기 때문입니다.</p>' },
          { layout: 'code', title: '형 변환 자세히 보기', code: 'print(int("ff", 16), int("1010", 2))\nprint(int(-3.9), round(-3.5), round(-2.5))\nprint(str(3.14) + "!", repr("abc"))\nprint("3.14".isdigit(), "314".isdigit())',
            points: ['<code>int(문자열, 진법)</code> 도 가능', '<code>int(-3.9)</code> 는 <b>-3</b> (0 쪽으로 버림)', '<code>repr()</code> 로 "문자열인지 숫자인지" 확인', '<code>isdigit()</code> 으로 입력 검사'],
            notes: '<p>결과: <code>255 10</code> / <code>-3 -4 -2</code> / <code>3.14! \'abc\'</code> / <code>False True</code>.</p><p>디버깅 팁으로 <code>type()</code> 과 <code>repr()</code> 을 함께 소개합니다. 사용자가 숫자가 아닌 값을 넣으면 ValueError 가 난다는 것도 실행해 보여 주고, 해결은 12장(예외 처리)이라고 예고합니다.</p>' },
          { layout: 'diagram', title: '동전 교환의 원리', html: `<svg viewBox="0 0 700 260" width="100%" font-family="monospace">
  <g font-size="24" fill="var(--fg)">
    <text x="30" y="50">7777 // 500 = <tspan fill="var(--accent)" font-weight="bold">15개</tspan></text><text x="400" y="50">7777 % 500 = <tspan fill="var(--accent2)" font-weight="bold">277</tspan></text>
    <text x="30" y="105">277 // 100 = <tspan fill="var(--accent)" font-weight="bold">2개</tspan></text><text x="400" y="105">277 % 100 = <tspan fill="var(--accent2)" font-weight="bold">77</tspan></text>
    <text x="30" y="160">77 // 50 = <tspan fill="var(--accent)" font-weight="bold">1개</tspan></text><text x="400" y="160">77 % 50 = <tspan fill="var(--accent2)" font-weight="bold">27</tspan></text>
    <text x="30" y="215">27 // 10 = <tspan fill="var(--accent)" font-weight="bold">2개</tspan></text><text x="400" y="215">27 % 10 = <tspan fill="var(--accent2)" font-weight="bold">7</tspan> (잔돈)</text>
  </g>
</svg>`, caption: '큰 동전부터: // 로 개수, % 로 남은 돈을 다음 단계로',
            notes: '<p>코드를 보기 전에 칠판에서 손으로 계산해 봅니다. 규칙이 반복된다는 것을 학생이 먼저 발견하게 하면 코드가 쉽게 읽힙니다.</p>' },
          { layout: 'code', title: 'Code04-01. 동전 교환', code: PROG1, stdin: '7777\n',
            points: ['<code>money // 500</code> → 500원 개수', '<code>money %= 500</code> → 남은 돈', '같은 패턴을 100 · 50 · 10 에 반복', '"예시 입력" 7777'],
            notes: '<p>교사 화면에서 실행 → 7777 입력. 다른 금액(예: 12340, 5)도 넣어 봅니다. 5 를 넣으면 모든 동전이 0개, 잔돈 5원.</p><p>2행에서 변수를 미리 0 으로 만드는 이유: "사용할 변수를 한눈에 보이게 선언하는 교재 스타일"이라고 설명합니다(파이썬에서 필수는 아님).</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '1234원을 동전 교환하면 10원짜리는 몇 개?', options: ['3개', '4개', '2개', '0개'], answer: 0,
            explain: '1234 → 500×2(234) → 100×2(34) → 50×0(34) → 10×3(4). 10원짜리 3개, 잔돈 4원.',
            notes: '<p>손으로 풀게 한 뒤 프로그램에 1234 를 넣어 확인합니다.</p>' },
          { layout: 'practice', title: 'SELF STUDY 4-1. 지폐로 교환', desc: '돈을 입력하면 <b>5만 원 · 1만 원 · 5000원 · 1000원</b> 지폐로 교환하는 프로그램을 작성하세요. (777777 → 15장, 2장, 1장, 2장, 777원)',
            starter: 'money = int(input("지폐로 교환할 돈은 얼마? "))\n\n# TODO: 50000, 10000, 5000, 1000 지폐 장수 구하기\n',
            solution: 'money = int(input("지폐로 교환할 돈은 얼마? "))\n\nc50000 = money // 50000\nmoney %= 50000\nc10000 = money // 10000\nmoney %= 10000\nc5000 = money // 5000\nmoney %= 5000\nc1000 = money // 1000\nmoney %= 1000\n\nprint("\\n 50000원짜리 ==> %d장" % c50000)\nprint(" 10000원짜리 ==> %d장" % c10000)\nprint(" 5000원짜리 ==> %d장" % c5000)\nprint(" 1000원짜리 ==> %d장" % c1000)\nprint(" 지폐로 바꾸지 못한 돈 ==> %d원" % money)\n', stdin: '777777\n',
            notes: '<p>Code04-01 을 복사해 숫자만 바꾸면 되는 문제입니다. 빨리 끝낸 학생에게는 divmod() 버전으로 줄여 보게 합니다.</p>' },
          { layout: 'practice', title: '🚀 프로젝트 4-9. 대출 이자 계산기', desc: '원금 · 연이율 · 기간을 입력받아 <b>단리 이자 · 복리 총액 · 원리금 균등 월 상환액</b>을 출력하세요. (월 상환액 = P·mr·(1+mr)<sup>n</sup> ÷ ((1+mr)<sup>n</sup> − 1))',
            starter: 'principal = int(input("대출 원금(원) : "))\nrate = float(input("연이율(%) : "))\nyears = int(input("기간(년) : "))\n\nr = rate / 100\n# TODO: 단리 · 복리 · 월 상환액\n',
            solution: 'principal = int(input("대출 원금(원) : "))\nrate = float(input("연이율(%) : "))\nyears = int(input("기간(년) : "))\n\nr = rate / 100\nsimple = principal * r * years\ncompound = principal * (1 + r) ** years - principal\n\nmonths = years * 12\nmr = r / 12\npay = principal * mr * (1 + mr) ** months / ((1 + mr) ** months - 1)\n\nprint("단리 이자 : %d원" % simple)\nprint("복리 이자 : %d원" % compound)\nprint("월 상환액 : %d원" % pay)\n', stdin: '10000000\n4.5\n3\n',
            notes: '<p>결과: 단리 1350000원, 복리 1411661원, 월 상환액 297469원. "같은 4.5%인데 왜 복리가 더 많을까?"로 이자의 개념을 이야기합니다.</p><p>수식이 길어 보이지만 쓰는 연산자는 <code>+ - * / **</code> 뿐입니다. 괄호 위치를 칠판에 한 번 함께 써 보고 시작하게 하세요. 심화: 총 상환액 − 원금으로 총 이자 부담액 계산.</p>' },
          { layout: 'summary', title: '2교시 정리', bullets: [
            '<code>int()</code> · <code>float()</code> : 문자열 → 숫자, <code>str()</code> : 숫자 → 문자열',
            '문자열 <code>+</code> 는 연결, <code>*</code> 는 반복 (<code>"=" * 30</code>)',
            '대입 연산자 <code>+= -= *= /= //= %= **=</code>, 파이썬에 <code>++</code> 는 없다',
            '<code>+=</code> 는 불변 값이면 새 값, 가변 값(리스트)이면 그 자리에서 변경',
            '동전 교환 = <code>//</code> 로 개수, <code>%=</code> 로 남은 돈 (반복)'
          ], notes: '<p>다음 시간: 크기를 비교하는 관계 연산자와 and · or · not 논리 연산자, 그리고 [프로그램 2] 거북이.</p>' }
        ]
      },

      /* ═════════════════════════ 4-3 ═════════════════════════ */
      {
        id: 'ch04-3',
        title: '관계 연산자 · 논리 연산자 · [프로그램 2] 거북이',
        minutes: 50,
        goals: [
          '관계 연산자 ==, !=, >, <, >=, <= 의 결과가 True/False 임을 설명할 수 있다',
          '= (대입)와 == (같다)를 구분할 수 있다',
          'and · or · not 으로 여러 조건을 결합할 수 있다',
          '0 은 False, 0 이 아닌 수는 True 로 취급됨을 설명할 수 있다',
          '논리 연산자로 화면 경계를 검사하는 거북이 프로그램을 완성할 수 있다',
          '0 <= x <= 100 처럼 비교를 이어 쓸 수 있고, and · or 가 값을 돌려준다는 것을 설명할 수 있다',
          '== 와 is 의 차이를 알고, 실수는 math.isclose() 로 비교해야 하는 이유를 말할 수 있다'
        ],
        flow: [['도입: 크다 · 작다 · 같다', 3], ['관계 연산자 · = 와 == · 체이닝', 12], ['논리 연산자 · 참/거짓 값 · 단락 평가', 12], ['[프로그램 2] 거북이 완성', 13], ['== 와 is · 실수 비교', 5], ['퀴즈 · 정리', 5]],
        content: [
          { type: 'h', text: '관계 연산자' },
          { type: 'p', html: '<b>관계 연산자(비교 연산자)</b>는 두 값이 큰지, 작은지, 같은지를 비교합니다. 결과는 숫자가 아니라 <b>참(<code>True</code>)</b> 또는 <b>거짓(<code>False</code>)</b> 둘 중 하나입니다. 관계 연산자는 혼자 쓰이기보다 주로 조건문(<code>if</code>)이나 반복문(<code>while</code>)의 조건으로 쓰입니다.' },
          { type: 'figure', caption: '그림 4-1 관계 연산자의 기본 개념', html: `<svg viewBox="0 0 520 160" width="100%" style="max-width:520px" font-family="sans-serif">
  <text x="30" y="92" font-size="40" fill="var(--fg)" font-family="monospace">a &lt; b</text>
  <text x="170" y="92" font-size="36" fill="var(--fg)">=</text>
  <path d="M225 35 Q205 35 205 60 V70 Q205 80 195 80 Q205 80 205 90 V100 Q205 125 225 125" fill="none" stroke="var(--fg)" stroke-width="3"/>
  <text x="240" y="62" font-size="24" fill="var(--fg)">참</text><text x="290" y="62" font-size="24" fill="var(--ok)" font-weight="bold">: True</text>
  <text x="240" y="118" font-size="24" fill="var(--fg)">거짓</text><text x="290" y="118" font-size="24" fill="var(--danger)" font-weight="bold">: False</text>
</svg>` },
          { type: 'table', caption: '표 4-3 관계 연산자의 종류', head: ['연산자', '의미', '설명'], rows: [
            ['<code>==</code>', '같다', '두 값이 동일하면 참'],
            ['<code>!=</code>', '같지 않다', '두 값이 다르면 참'],
            ['<code>&gt;</code>', '크다', '왼쪽이 크면 참'],
            ['<code>&lt;</code>', '작다', '왼쪽이 작으면 참'],
            ['<code>&gt;=</code>', '크거나 같다', '왼쪽이 크거나 같으면 참'],
            ['<code>&lt;=</code>', '작거나 같다', '왼쪽이 작거나 같으면 참']
          ] },
          { type: 'code', title: '예제. 관계 연산자 6가지', code: 'a, b = 100, 200\nprint(a == b , a != b,  a > b , a < b , a >= b , a <= b)', expect: 'False True False True False True',
            desc: '<code>a == b</code> 는 "100 이 200 과 같다"는 뜻이므로 거짓(False)입니다. <code>a != b</code> 는 "다르다"이므로 참(True)입니다.' },
          { type: 'callout', kind: 'warn', title: '= 와 == 를 혼동하지 마세요', html: '<code>=</code> 는 "오른쪽 값을 왼쪽 변수에 넣어라"라는 <b>대입</b>이고, <code>==</code> 는 "두 값이 같은가?"를 묻는 <b>관계 연산자</b>입니다. 비교하려고 <code>print(a = b)</code> 처럼 <code>=</code> 하나만 쓰면 오류가 납니다. 또 <code>&gt;=</code>, <code>&lt;=</code>, <code>!=</code> 는 두 글자 사이에 공백을 넣으면 안 되고, <code>=&gt;</code> 처럼 순서를 바꿔 써도 안 됩니다.' },
          { type: 'code', title: '예제. == 대신 = 를 쓴 실수', code: 'a, b = 100, 200\nprint(a = b)', expectError: true, expect: "Traceback (most recent call last):\n  File \"main.py\", line 2, in <module>\n    print(a = b)\n    ~~~~~^^^^^^^\nTypeError: print() got an unexpected keyword argument 'a'",
            desc: '<code>print()</code> 괄호 안의 <code>a = b</code> 는 "a 라는 이름의 옵션에 b 를 넘긴다"로 해석되어, print() 에는 그런 옵션이 없다는 <code>TypeError</code> 가 납니다. IDLE 에서는 빨간 오류 메시지로 보입니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 비교를 이어 쓰기 (체이닝)', html: '파이썬은 수학처럼 <code>100 &lt; a &lt; 200</code> 이라고 비교를 이어 쓸 수 있습니다. 이것은 <code>(100 &lt; a) and (a &lt; 200)</code> 과 같은 뜻입니다. 문자열도 비교할 수 있는데, 사전 순서(정확히는 문자 코드 순서)로 비교합니다: <code>"apple" &lt; "banana"</code> → True. 실수는 오차가 있어서 <code>0.1 + 0.2 == 0.3</code> 이 <b>False</b> 라는 점도 알아 두세요.' },
          { type: 'code', repl: true, title: '추가 예제. 비교 이어 쓰기 · 문자열 비교 · 실수 비교', code: 'a = 150\n100 < a < 200\n"apple" < "banana"\n"A" == "a"\n0.1 + 0.2 == 0.3\n0.1 + 0.2', expect: '>>> a = 150\n>>> 100 < a < 200\nTrue\n>>> "apple" < "banana"\nTrue\n>>> "A" == "a"\nFalse\n>>> 0.1 + 0.2 == 0.3\nFalse\n>>> 0.1 + 0.2\n0.30000000000000004\n>>>' },

          { type: 'h', text: '논리 연산자' },
          { type: 'p', html: '"a 가 100 과 200 사이에 있다"처럼 조건이 두 개 이상이면 <b>논리 연산자</b>로 묶습니다. 파이썬의 논리 연산자는 영어 단어 그대로 <code>and</code>(그리고), <code>or</code>(또는), <code>not</code>(부정) 세 가지입니다.' },
          { type: 'code', title: '예제. a 가 100 과 200 사이에 있는지 검사하기', code: 'a = 150\nprint((a > 100) and (a < 200))', expect: 'True' },
          { type: 'table', caption: '표 4-4 논리 연산자의 종류', head: ['연산자', '의미', '설명', '사용 예'], rows: [
            ['<code>and</code> (논리곱)', '~이고, 그리고', '둘 다 참이어야 참', '<code>(a &gt; 100) and (a &lt; 200)</code>'],
            ['<code>or</code> (논리합)', '~이거나, 또는', '둘 중 하나만 참이어도 참', '<code>(a == 100) or (a == 200)</code>'],
            ['<code>not</code> (논리부정)', '~아니다, 부정', '참이면 거짓, 거짓이면 참', '<code>not(a &lt; 100)</code>']
          ] },
          { type: 'figure', caption: 'and · or · not 의 진리표 — T = True, F = False', html: (function () {
            var s = '<svg viewBox="0 0 700 220" width="100%" style="max-width:700px" font-family="monospace">';
            function tbl(x, title, rows) {
              var t = '<text x="' + (x + 100) + '" y="24" text-anchor="middle" font-size="20" font-weight="bold" fill="var(--accent)">' + title + '</text>';
              rows.forEach(function (r, i) {
                var y = 40 + i * 42;
                t += '<rect x="' + x + '" y="' + y + '" width="200" height="38" rx="6" fill="var(--card)" stroke="var(--line)"/>';
                t += '<text x="' + (x + 12) + '" y="' + (y + 26) + '" font-size="18" fill="var(--fg)">' + r[0] + '</text>';
                t += '<text x="' + (x + 188) + '" y="' + (y + 26) + '" text-anchor="end" font-size="20" font-weight="bold" fill="' + (r[1] === 'T' ? 'var(--ok)' : 'var(--danger)') + '">' + r[1] + '</text>';
              });
              return t;
            }
            s += tbl(10, 'A and B', [['T and T', 'T'], ['T and F', 'F'], ['F and T', 'F'], ['F and F', 'F']]);
            s += tbl(250, 'A or B', [['T or T', 'T'], ['T or F', 'T'], ['F or T', 'T'], ['F or F', 'F']]);
            s += tbl(490, 'not A', [['not T', 'F'], ['not F', 'T']]);
            return s + '</svg>';
          })() },
          { type: 'code', repl: true, title: '예제. 논리 연산자 사용하기', code: 'a = 99\n(a > 100) and (a < 200)\n(a > 100) or (a < 200)\nnot(a == 100)', expect: '>>> a = 99\n>>> (a > 100) and (a < 200)\nFalse\n>>> (a > 100) or (a < 200)\nTrue\n>>> not(a == 100)\nTrue\n>>>',
            desc: 'a 가 99 이므로 <code>a > 100</code> 은 False, <code>a < 200</code> 은 True 입니다. and 는 둘 다 참이어야 하므로 False, or 는 하나만 참이어도 되므로 True, <code>a == 100</code> 이 False 이니 not 을 붙이면 True 입니다.' },
          { type: 'figure', caption: '(a > 100) and (a < 200) 을 수직선으로 보기 — 두 조건이 겹치는 구간만 True', html: `<svg viewBox="0 0 680 170" width="100%" style="max-width:680px" font-family="sans-serif">
  <line x1="30" y1="120" x2="650" y2="120" stroke="var(--fg)" stroke-width="2"/>
  <circle cx="200" cy="120" r="7" fill="var(--card)" stroke="var(--fg)" stroke-width="2"/><text x="200" y="152" text-anchor="middle" font-size="18" fill="var(--fg)">100</text>
  <circle cx="480" cy="120" r="7" fill="var(--card)" stroke="var(--fg)" stroke-width="2"/><text x="480" y="152" text-anchor="middle" font-size="18" fill="var(--fg)">200</text>
  <line x1="207" y1="40" x2="650" y2="40" stroke="var(--accent)" stroke-width="6"/><text x="560" y="30" font-size="16" fill="var(--accent)">a &gt; 100</text>
  <line x1="30" y1="70" x2="473" y2="70" stroke="var(--accent2)" stroke-width="6"/><text x="40" y="60" font-size="16" fill="var(--accent2)">a &lt; 200</text>
  <rect x="207" y="100" width="266" height="40" fill="var(--ok)" opacity="0.28"/>
  <text x="340" y="112" text-anchor="middle" font-size="16" font-weight="bold" fill="var(--ok)">and → True</text>
  <circle cx="190" cy="120" r="5" fill="var(--danger)"/><text x="150" y="105" font-size="15" fill="var(--danger)">a=99</text>
</svg>` },
          { type: 'h', text: '숫자도 참 · 거짓이 된다' },
          { type: 'p', html: '조건 자리에는 True/False 뿐 아니라 숫자도 올 수 있습니다. 이때 <b>0 은 거짓(False)</b>, <b>0 이 아닌 수는 모두 참(True)</b>으로 취급합니다.' },
          { type: 'code', repl: true, title: '예제. 숫자를 조건으로 쓰기', code: 'if(1234) : print("참이면 보여요")\n\nif(0) : print("거짓이면 안 보여요")\n\nbool(0)', expect: '>>> if(1234) : print("참이면 보여요")\n... \n참이면 보여요\n>>> if(0) : print("거짓이면 안 보여요")\n... \n>>> bool(0)\nFalse\n>>>',
            desc: '셸에서 <code>if</code> 문을 입력하면 한 줄로 끝나도 <code>...</code> 가 나오며 다음 줄을 기다립니다. 그래서 각 줄 끝에서 <b>Enter 를 두 번</b> 눌러야 실행됩니다. 1234 는 참이라 글자가 출력되고, 0 은 거짓이라 아무것도 출력되지 않습니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: bool() 과 "거짓으로 취급되는 값"', html: '<code>bool()</code> 함수로 어떤 값이 참/거짓 중 무엇으로 취급되는지 확인할 수 있습니다. 숫자 <code>0</code>, <code>0.0</code>, 빈 문자열 <code>""</code>, <code>None</code>, 빈 리스트 <code>[]</code> 는 거짓이고 나머지는 대부분 참입니다. 또 <code>True</code> 와 <code>False</code> 는 사실 정수 1 과 0 처럼 계산됩니다: <code>True + True</code> → <code>2</code>.' },
          { type: 'code', repl: true, title: '추가 예제. bool() 로 참/거짓 확인하기', code: 'bool(1234)\nbool(0)\nbool(-1)\nbool("")\nbool("0")\nTrue + True', expect: '>>> bool(1234)\nTrue\n>>> bool(0)\nFalse\n>>> bool(-1)\nTrue\n>>> bool("")\nFalse\n>>> bool("0")\nTrue\n>>> True + True\n2\n>>>',
            desc: '<code>"0"</code> 은 숫자 0 이 아니라 글자 하나가 든 문자열이므로 참입니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 단락 평가(short-circuit)', html: '<code>A and B</code> 에서 A 가 이미 거짓이면 결과는 무조건 거짓이므로 파이썬은 <b>B 를 계산하지 않습니다</b>. 마찬가지로 <code>A or B</code> 에서 A 가 참이면 B 를 보지 않습니다. 그래서 <code>(b != 0) and (a / b > 1)</code> 처럼 쓰면 b 가 0 일 때 나눗셈 오류를 피할 수 있습니다.' },
          { type: 'code', title: '추가 예제. 단락 평가로 0 나누기 피하기', code: 'a, b = 10, 0\nprint((b != 0) and (a / b > 1))\nb = 5\nprint((b != 0) and (a / b > 1))', expect: 'False\nTrue',
            desc: '첫 번째는 <code>b != 0</code> 이 False 라서 뒤의 <code>a / b</code> 를 아예 계산하지 않으므로 오류가 나지 않습니다.' },

          { type: 'h', text: '[프로그램 2]의 완성: 마음대로 이동하는 거북이' },
          { type: 'p', html: '거북이 프로그램에는 아직 배우지 않은 <code>if ~ else</code> 문이 나옵니다. 조건식이 참이면 <code>if</code> 아래를, 거짓이면 <code>else</code> 아래를 실행한다는 것만 알면 됩니다(자세한 내용은 5장).' },
          { type: 'code', run: false, title: 'if ~ else 문의 형식', code: 'if 조건식 :\n    참일 때 수행\nelse :\n    거짓일 때 수행' },
          { type: 'p', html: '거북이가 화면 안에 있는지는 x 좌표와 y 좌표를 각각 검사해야 합니다. 화면 폭이 <code>swidth</code> 이고 가운데가 (0, 0) 이므로 x 는 <code>-swidth/2</code> 부터 <code>swidth/2</code> 사이, y 는 <code>-sheight/2</code> 부터 <code>sheight/2</code> 사이여야 합니다. 네 조건이 <b>모두</b> 참이어야 하므로 <code>and</code> 로 묶습니다.' },
          { type: 'figure', caption: '화면 안에 있는 조건 — x 범위 and y 범위', html: `<svg viewBox="0 0 640 330" width="100%" style="max-width:640px" font-family="sans-serif">
  <rect x="120" y="30" width="270" height="270" fill="var(--ok)" opacity="0.12" stroke="var(--ok)" stroke-width="2"/>
  <line x1="60" y1="165" x2="450" y2="165" stroke="var(--muted)" stroke-dasharray="4 4"/>
  <line x1="255" y1="10" x2="255" y2="320" stroke="var(--muted)" stroke-dasharray="4 4"/>
  <circle cx="255" cy="165" r="5" fill="var(--fg)"/><text x="262" y="185" font-size="15" fill="var(--fg)">(0, 0)</text>
  <text x="120" y="318" text-anchor="middle" font-size="15" fill="var(--accent)">-150</text>
  <text x="390" y="318" text-anchor="middle" font-size="15" fill="var(--accent)">150</text>
  <text x="108" y="36" text-anchor="end" font-size="15" fill="var(--accent2)">150</text>
  <text x="108" y="300" text-anchor="end" font-size="15" fill="var(--accent2)">-150</text>
  <circle cx="320" cy="110" r="7" fill="var(--ok)"/><text x="332" y="106" font-size="15" fill="var(--ok)">안 → pass</text>
  <circle cx="425" cy="230" r="7" fill="var(--danger)"/><text x="400" y="262" font-size="15" fill="var(--danger)">밖 → (0,0)으로</text>
  <g font-family="monospace" font-size="15" fill="var(--fg)">
    <text x="470" y="80" fill="var(--accent)">-swidth/2 &lt;= curX</text>
    <text x="470" y="102" fill="var(--accent)">and curX &lt;= swidth/2</text>
    <text x="520" y="135" font-weight="bold" fill="var(--fg)">and</text>
    <text x="470" y="168" fill="var(--accent2)">-sheight/2 &lt;= curY</text>
    <text x="470" y="190" fill="var(--accent2)">and curY &lt;= sheight/2</text>
  </g>
  <text x="530" y="228" text-anchor="middle" font-size="14" fill="var(--muted)">swidth = sheight = 300</text>
</svg>` },
          { type: 'code', title: 'Code04-02. [프로그램 2] 완성: 마음대로 이동하는 거북이', code: PROG2,
            desc: '실행하면 거북이 창이 뜨고, 거북이가 무작위로 돌아다니다 <b>화면을 5번 벗어나면</b> 멈춥니다. 실행할 때마다 그림이 달라집니다.' },
          { type: 'list', items: [
            '<code>1~2행</code>: 거북이 그래픽(turtle)과 난수(random) 모듈을 불러온다.',
            '<code>5행</code>: 화면 폭 · 높이 300, 펜 두께 3, 화면을 벗어난 횟수 exitCount 를 0 으로 준비한다.',
            '<code>6행</code>: <code>[0] * 7</code> 은 0 이 7개 든 리스트 <code>[0, 0, 0, 0, 0, 0, 0]</code> 로, 변수 7개를 한꺼번에 0 으로 만든다.',
            '<code>12~13행</code>: <code>setup()</code> 으로 창 크기를 화면보다 30 씩 크게, <code>screensize()</code> 로 그림 영역을 300×300 으로 정한다.',
            '<code>15행</code>: <code>while True :</code> 는 아래 블록을 계속 반복한다(<code>break</code> 를 만나면 끝남).',
            '<code>16~19행</code>: 0 이상 1 미만의 난수 3개로 (빨강, 초록, 파랑) 색을 만들어 펜 색으로 정한다.',
            '<code>21~24행</code>: 0~359도 중 무작위로 돌고, 1~99 중 무작위 거리만큼 앞으로 간다.',
            '<code>25~26행</code>: 거북이의 현재 x, y 좌표를 얻는다.',
            '<code>28행</code>: 논리 연산자로 화면 안에 있는지 검사한다. 안이면 <code>pass</code>(아무것도 안 함).',
            '<code>30~33행</code>: 밖이면 펜을 들고 가운데 (0, 0) 으로 이동한 뒤 다시 펜을 내린다.',
            '<code>35~37행</code>: 벗어난 횟수를 1 늘리고, 5번 이상이면 <code>break</code> 로 반복을 끝낸다.'
          ] },
          { type: 'callout', kind: 'info', title: '웹 강좌에서의 실행', html: '교재의 거북이 프로그램은 창을 닫을 때까지 계속 돌기도 하지만, 여기서는 교재 코드대로 <b>화면을 5번 벗어나면 끝나도록</b> 되어 있어 브라우저에서도 안전하게 실행됩니다. 거북이 창은 프로그램이 끝나도 남아 있으며 ✕ 로 닫습니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: random 모듈의 두 함수', html: '<code>random.random()</code> 은 0.0 이상 1.0 미만의 실수를, <code>random.randrange(a, b)</code> 는 a 이상 <b>b 미만</b>의 정수를 무작위로 돌려줍니다. 그래서 <code>randrange(0, 360)</code> 은 0~359 입니다. 거북이의 <code>pencolor((r, g, b))</code> 는 기본 설정에서 0.0~1.0 사이의 실수 세 개로 색을 만듭니다.' },
          { type: 'code', title: '추가 예제. 28행의 조건을 체이닝으로 더 짧게', code: 'swidth, sheight = 300, 300\ncurX, curY = 120, -170\n\ninside1 = (-swidth / 2 <= curX and curX <= swidth / 2) and (-sheight / 2 <= curY and curY <= sheight / 2)\ninside2 = (-swidth / 2 <= curX <= swidth / 2) and (-sheight / 2 <= curY <= sheight / 2)\nprint(inside1, inside2)\nprint("x 는 안쪽?", -swidth / 2 <= curX <= swidth / 2)\nprint("y 는 안쪽?", -sheight / 2 <= curY <= sheight / 2)', expect: 'False False\nx 는 안쪽? True\ny 는 안쪽? False',
            desc: 'x(120)는 범위 안이지만 y(-170)가 -150 보다 작아서 전체 결과는 False 입니다. 두 방식의 결과는 항상 같습니다.' },

          { type: 'h', text: '한 걸음 더 ① 비교를 이어 쓰기 (체이닝)' },
          { type: 'p', html: '"점수가 0 이상 100 이하"를 수학에서는 <code>0 ≤ score ≤ 100</code> 이라고 씁니다. 파이썬은 이 표기를 <b>그대로</b> 허용합니다. <code>0 &lt;= score &lt;= 100</code> 은 <code>0 &lt;= score and score &lt;= 100</code> 과 같은 뜻이면서 훨씬 읽기 쉽고, 가운데 값(<code>score</code>)을 <b>한 번만 계산</b>한다는 장점도 있습니다(함수 호출이 들어갈 때 중요합니다).' },
          { type: 'code', title: '추가 예제. 비교 이어 쓰기(체이닝)의 규칙', code: 'score = 87\nprint(0 <= score <= 100)\nprint(0 <= score and score <= 100)\n\na, b, c = 1, 1, 1\nprint(a == b == c)\n\nx, y, z = 3, 3, 5\nprint(x == y == z)\nprint(1 < 3 > 2)',
            expect: 'True\nTrue\nTrue\nFalse\nTrue',
            desc: '<code>a == b == c</code> 는 "세 값이 모두 같은가"입니다(<code>(a == b) and (b == c)</code>). <code>1 &lt; 3 &gt; 2</code> 처럼 방향이 다른 비교도 이어 쓸 수 있지만 읽기 어려우므로 권하지 않습니다. 대부분의 언어에는 없는 파이썬의 편리한 문법입니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 다른 언어에서는 왜 안 될까', html: 'C · 자바에서 <code>0 &lt;= x &lt;= 100</code> 을 쓰면 먼저 <code>0 &lt;= x</code> 가 <code>true</code>(=1) 로 계산되고, 그 <code>1</code> 을 다시 100 과 비교해 <b>언제나 참</b>이 되는 유명한 버그가 생깁니다. 파이썬은 이런 식을 <b>비교의 연속</b>으로 특별히 해석해서 이 함정을 없앴습니다. 범위 검사는 되도록 체이닝으로 쓰세요 — 의도가 눈에 보입니다.' },

          { type: 'h', text: '한 걸음 더 ② and · or 는 True/False 가 아니라 "값"을 돌려준다' },
          { type: 'p', html: '파이썬의 <code>and</code> · <code>or</code> 는 단락 평가를 하면서 <b>마지막으로 본 피연산자를 그대로 돌려줍니다</b>. <code>3 and 5</code> 의 결과는 True 가 아니라 <code>5</code> 이고, <code>0 or 5</code> 의 결과는 <code>5</code> 입니다. 조건문에서는 어차피 참/거짓으로 판단되므로 티가 안 나지만, 이 성질을 알면 <b><code>이름 = 입력값 or "기본값"</code></b> 같은 짧은 관용구를 쓸 수 있습니다.' },
          { type: 'code', title: '추가 예제. 논리 연산이 돌려주는 값', code: 'print("" or "손님")\nprint("철수" or "손님")\nprint(3 and 5, 0 and 5, 3 or 5, 0 or 5)\nprint(bool(3 and 5))\n\nnickname = input("별명(Enter 로 건너뛰기) : ") or "익명"\nprint("안녕하세요,", nickname, "님")',
            stdin: '\n', expect: '손님\n철수\n5 0 3 5\nTrue\n별명(Enter 로 건너뛰기) : \n안녕하세요, 익명 님',
            desc: '<code>or</code> 는 <b>앞이 참이면 앞의 값</b>, 거짓이면 뒤의 값을 돌려줍니다. 빈 문자열 <code>""</code> 은 거짓이므로 <code>input() or "익명"</code> 은 "그냥 Enter 를 누르면 익명"이 됩니다. <code>and</code> 는 반대로 앞이 거짓이면 앞의 값, 참이면 뒤의 값입니다.' },
          { type: 'callout', kind: 'warn', title: 'or 기본값의 함정', html: '<code>수량 = 입력값 or 10</code> 처럼 쓰면 사용자가 일부러 <b>0</b> 을 넣어도 0 이 거짓이라 10 으로 바뀌어 버립니다. "값이 없을 때만" 기본값을 쓰고 싶다면 <code>if 값 is None :</code> 으로 명시적으로 검사하세요. 짧은 코드보다 <b>정확한 코드</b>가 먼저입니다.' },
          { type: 'code', title: '추가 예제. 흔한 버그 — x == 1 or 2', code: 'menu = 3\n\nprint(menu == 1 or 2)\nprint(menu == 1 or menu == 2)\nprint(menu in (1, 2))\nprint(bool(menu == 1 or 2))',
            expect: '2\nFalse\nFalse\nTrue',
            desc: '<code>menu == 1 or 2</code> 는 "menu 가 1 이거나 2"라는 뜻이 <b>아닙니다</b>. <code>(menu == 1) or 2</code> 로 계산되어 <code>False or 2</code> → <code>2</code>, 즉 조건으로 쓰면 <b>항상 참</b>이 되는 버그입니다. 바르게 쓰려면 비교를 두 번 쓰거나(<code>menu == 1 or menu == 2</code>), 더 파이썬답게 <code>menu in (1, 2)</code> 라고 씁니다.' },

          { type: 'h', text: '한 걸음 더 ③ == 와 is 는 다르다' },
          { type: 'p', html: '<code>==</code> 는 "<b>값</b>이 같은가", <code>is</code> 는 "<b>같은 객체</b>(메모리의 같은 자리)인가"를 묻습니다. 겉보기 값이 같아도 서로 다른 객체일 수 있습니다. <code>id()</code> 함수로 객체의 고유 번호(주소 같은 것)를 볼 수 있습니다.' },
          { type: 'code', title: '추가 예제. == 와 is 의 차이', code: 'a = [1, 2, 3]\nb = [1, 2, 3]\nc = a\n\nprint(a == b, a is b)\nprint(a == c, a is c)\nprint(id(a) == id(c))\n\nvalue = None\nprint(value is None, value == None)',
            expect: 'True False\nTrue True\nTrue\nTrue True',
            desc: '<code>a</code> 와 <code>b</code> 는 내용이 같지만 따로 만들어진 <b>다른</b> 리스트라 <code>a is b</code> 는 False 입니다. <code>c = a</code> 는 같은 리스트에 이름표를 하나 더 붙인 것이라 <code>a is c</code> 가 True 입니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 언제 is 를 쓰나', html: '<ul><li><b><code>None</code> · <code>True</code> · <code>False</code> 와 비교할 때만</b> <code>is</code> 를 씁니다: <code>if value is None :</code> (PEP 8 권장). 이 세 값은 프로그램 전체에 하나씩만 존재하기 때문입니다.</li><li>숫자나 문자열을 <code>is</code> 로 비교하면 안 됩니다. 파이썬은 작은 정수(-5~256)와 짧은 문자열을 <b>미리 만들어 재사용(캐싱)</b>하기 때문에 <code>a is b</code> 가 어떤 값에서는 True, 어떤 값에서는 False 가 되어 실행 환경에 따라 결과가 달라집니다.</li><li>값 비교는 언제나 <code>==</code>. 이 구분은 나중에 리스트 · 객체를 다룰 때 "복사했는데 원본이 바뀌는" 문제를 이해하는 열쇠가 됩니다.</li></ul>' },

          { type: 'h', text: '한 걸음 더 ④ 실수는 == 로 비교하지 않는다' },
          { type: 'p', html: '컴퓨터는 실수를 2진수로 저장하는데, 0.1 이나 0.3 은 2진수로 <b>정확히 표현할 수 없습니다</b>(10진수로 1/3 을 정확히 못 쓰는 것과 같습니다). 그래서 아주 작은 오차가 남고, <code>0.1 + 0.2 == 0.3</code> 이 False 가 됩니다.' },
          { type: 'code', title: '추가 예제. 실수를 안전하게 비교하는 법', code: 'import math\n\nx = 0.1 + 0.2\nprint(x)\nprint(x == 0.3)\nprint(math.isclose(x, 0.3))\nprint(round(x, 10) == round(0.3, 10))\nprint(abs(x - 0.3) < 1e-9)',
            expect: '0.30000000000000004\nFalse\nTrue\nTrue\nTrue',
            desc: '해결책은 세 가지입니다. ① <code>math.isclose(a, b)</code> 로 "거의 같은가"를 묻기(권장), ② <code>round()</code> 로 자릿수를 맞춰 비교하기, ③ <code>abs(a - b) &lt; 아주 작은 수</code> 로 차이를 보기. 돈 계산처럼 오차가 허용되지 않는 곳에서는 아예 <b>정수(원 단위)</b>로 계산하거나 <code>decimal</code> 모듈을 씁니다.' }
        ],
        practice: [
          { title: '실습 4-10. 점수 범위 검사 (체이닝)', level: 1,
            desc: '<p>점수를 입력받아 아래 네 가지를 <code>True</code> / <code>False</code> 로 출력하세요. <b>비교 이어 쓰기(체이닝)</b>를 꼭 사용합니다.</p><ol><li>0 ~ 100 범위인가?</li><li>60 점 이상인가?</li><li>유효한 점수이면서 합격인가? (둘 다 만족)</li><li>범위를 벗어났는가? (<code>not</code> 사용)</li></ol>',
            hint: '범위 검사는 <code>0 &lt;= score &lt;= 100</code> 처럼 한 줄로 씁니다. 세 번째는 <code>and</code>, 네 번째는 <code>not</code> 을 앞에 붙이면 됩니다(<code>not</code> 은 비교보다 나중에 계산되므로 괄호가 없어도 됩니다).',
            starter: 'score = int(input("점수 : "))\n\n# TODO: 체이닝 · and · not 으로 네 가지 판정 출력\nprint("0 ~ 100 범위인가?", False)\n',
            solution: 'score = int(input("점수 : "))\n\nprint("0 ~ 100 범위인가?", 0 <= score <= 100)\nprint("60 점 이상인가?", score >= 60)\nprint("유효한 점수이면서 합격인가?", 0 <= score <= 100 and score >= 60)\nprint("범위를 벗어났는가?", not 0 <= score <= 100)\n',
            stdin: '87\n',
            expect: '점수 : 87\n0 ~ 100 범위인가? True\n60 점 이상인가? True\n유효한 점수이면서 합격인가? True\n범위를 벗어났는가? False' },
          { title: '실습 4-11. or 로 기본값 채우기', level: 1,
            desc: '<p>이름과 도시를 입력받되, <b>그냥 Enter 를 누르면</b> 각각 "손님", "서울"이 되도록 하세요. 그리고 이름을 실제로 입력했는지도 True / False 로 출력합니다.</p><p>예) 이름은 빈칸, 도시는 부산 → <code>손님 님, 오늘 부산 날씨가 좋네요</code></p>',
            hint: '<code>input("이름 : ") or "손님"</code> — 빈 문자열은 거짓이므로 <code>or</code> 뒤의 값이 선택됩니다. "예시 입력으로 실행"을 누르면 첫 줄은 빈 입력, 둘째 줄은 부산이 들어갑니다.',
            starter: 'name = input("이름 : ")\ncity = input("도시 : ")\n\n# TODO: or 로 기본값을 채우세요\nprint(name, "님, 오늘", city, "날씨가 좋네요")\n',
            solution: 'name = input("이름 : ") or "손님"\ncity = input("도시 : ") or "서울"\n\nprint(name, "님, 오늘", city, "날씨가 좋네요")\nprint("이름을 입력했나요?", name != "손님")\n',
            stdin: '\n부산\n',
            expect: '이름 : \n도시 : 부산\n손님 님, 오늘 부산 날씨가 좋네요\n이름을 입력했나요? False' },
          { title: '실습 4-12. 윤년 판별식', level: 2,
            desc: '<p>연도를 입력받아 윤년이면 True, 아니면 False 를 출력하세요. 윤년의 조건은 다음과 같습니다.</p><ul><li>4 로 나누어떨어지고 100 으로 나누어떨어지지 않는 해, <b>또는</b></li><li>400 으로 나누어떨어지는 해</li></ul><p>예) 2024 → True, 1900 → False, 2000 → True</p>',
            hint: '"나누어떨어진다"는 <code>year % 4 == 0</code> 입니다. <code>(… and …) or …</code> 형태로 조건을 묶어 보세요.',
            starter: 'year = int(input("연도 : "))\n\n# TODO: 윤년 조건식을 완성하세요\nleap = False\n\nprint(year, "년은 윤년?", leap)\n',
            solution: 'year = int(input("연도 : "))\n\nleap = (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)\n\nprint(year, "년은 윤년?", leap)\n',
            stdin: '1900\n',
            expect: '연도 : 1900\n1900 년은 윤년? False' },
          { title: '실습 4-13. 거북이 프로그램 바꿔 보기', level: 2,
            desc: '<p>Code04-02 를 다음처럼 바꿔 보세요.</p><ul><li>화면 크기를 400×400 으로 한다.</li><li>화면을 <b>3번</b> 벗어나면 끝낸다.</li><li>화면을 벗어나 가운데로 돌아올 때마다 <code>turtle.stamp()</code> 로 거북이 도장을 찍는다.</li></ul>',
            hint: '<code>swidth, sheight</code> 값과 <code>exitCount >= 5</code> 의 숫자를 바꾸고, <code>goto(0, 0)</code> 다음에 <code>turtle.stamp()</code> 를 넣습니다.',
            starter: "import turtle\nimport random\n\nswidth, sheight, pSize, exitCount = 300, 300, 3, 0\n\nturtle.shape('turtle')\nturtle.pensize(pSize)\nturtle.setup(width = swidth + 30, height = sheight + 30)\nturtle.screensize(swidth, sheight)\n\n# TODO: Code04-02 의 while 문을 옮겨 오고 바꿔 보세요\n\nturtle.done()\n",
            solution: "import turtle\nimport random\n\nswidth, sheight, pSize, exitCount = 400, 400, 3, 0\n\nturtle.title('거북이 도장 찍기')\nturtle.shape('turtle')\nturtle.pensize(pSize)\nturtle.setup(width = swidth + 30, height = sheight + 30)\nturtle.screensize(swidth, sheight)\n\nwhile True :\n    turtle.pencolor((random.random(), random.random(), random.random()))\n    turtle.left(random.randrange(0, 360))\n    turtle.forward(random.randrange(1, 100))\n    curX = turtle.xcor()\n    curY = turtle.ycor()\n\n    if (-swidth / 2 <= curX and curX <= swidth / 2) and (-sheight / 2 <= curY and curY <= sheight / 2) :\n        pass\n    else :\n        turtle.penup()\n        turtle.goto(0, 0)\n        turtle.stamp()\n        turtle.pendown()\n\n        exitCount += 1\n        if exitCount >= 3 :\n            break\n\nturtle.done()\n",
            nondeterministic: true },
          { title: '🚀 프로젝트 4-14. 회원 가입 입력 검증기', level: 3,
            desc: '<p>회원 가입 화면이 하는 일은 결국 <b>여러 조건을 확인하는 것</b>입니다. 관계 · 논리 연산자만으로 검증기를 만들어 보세요.</p><ul><li><b>입력</b>: 아이디, 나이, 비밀번호, 비밀번호 확인</li><li><b>규칙 1</b> 아이디 길이가 4 이상 12 이하 (체이닝 사용, 길이는 <code>len()</code>)</li><li><b>규칙 2</b> 나이가 14 이상 120 이하</li><li><b>규칙 3</b> 비밀번호가 8자 이상 <b>이고</b> 아이디와 다름</li><li><b>규칙 4</b> 비밀번호와 확인이 일치</li><li>네 규칙을 각각 True / False 로 출력하고, <b>모두 만족할 때만</b> 가입 가능을 True 로 출력</li><li>마지막 줄에 <code>not</code> 을 써서 "문제가 있는 항목이 있나요?"도 출력</li></ul><pre>아이디 : pyuser\n나이 : 17\n비밀번호 : secret12\n비밀번호 확인 : secret12\n아이디 길이(4~12) : True\n나이 범위(14~120) : True\n비밀번호 규칙(8자 이상, 아이디와 다름) : True\n비밀번호 확인 일치 : True\n가입 가능 : True\n문제가 있는 항목이 있나요? False</pre><p><b>여기까지 했다면</b> ① 비밀번호에 숫자가 들어 있는지 검사(<code>any(c.isdigit() for c in pw)</code>), ② 아이디가 영문으로 시작하는지(<code>user_id[0].isalpha()</code>), ③ 통과하지 못한 항목만 골라 안내 문구 출력(5장 if 문)에 도전해 보세요.</p>',
            hint: '각 규칙의 결과를 <code>id_ok</code>, <code>age_ok</code> … 처럼 <b>이름 있는 변수</b>에 담으면 마지막 줄이 <code>id_ok and age_ok and pw_ok and same_ok</code> 로 깔끔해집니다. 긴 조건식을 한 줄에 몰아 쓰지 말고 이렇게 나누는 것이 실무에서도 권장되는 방식입니다.',
            starter: '## 입력 부분 ##\nuser_id = input("아이디 : ")\nage = int(input("나이 : "))\npw = input("비밀번호 : ")\npw2 = input("비밀번호 확인 : ")\n\n## 검사 부분 ##\nid_ok = False\nage_ok = False\npw_ok = False\nsame_ok = False\n# TODO: 네 가지 규칙을 조건식으로 채우세요\n\n## 출력 부분 ##\nprint("아이디 길이(4~12) :", id_ok)\n',
            solution: '## 입력 부분 ##\nuser_id = input("아이디 : ")\nage = int(input("나이 : "))\npw = input("비밀번호 : ")\npw2 = input("비밀번호 확인 : ")\n\n## 검사 부분 ##\nid_ok = 4 <= len(user_id) <= 12\nage_ok = 14 <= age <= 120\npw_ok = len(pw) >= 8 and pw != user_id\nsame_ok = pw == pw2\nall_ok = id_ok and age_ok and pw_ok and same_ok\n\n## 출력 부분 ##\nprint("아이디 길이(4~12) :", id_ok)\nprint("나이 범위(14~120) :", age_ok)\nprint("비밀번호 규칙(8자 이상, 아이디와 다름) :", pw_ok)\nprint("비밀번호 확인 일치 :", same_ok)\nprint("가입 가능 :", all_ok)\nprint("문제가 있는 항목이 있나요?", not all_ok)\n',
            stdin: 'pyuser\n17\nsecret12\nsecret12\n',
            expect: '아이디 : pyuser\n나이 : 17\n비밀번호 : secret12\n비밀번호 확인 : secret12\n아이디 길이(4~12) : True\n나이 범위(14~120) : True\n비밀번호 규칙(8자 이상, 아이디와 다름) : True\n비밀번호 확인 일치 : True\n가입 가능 : True\n문제가 있는 항목이 있나요? False' }
        ],
        quiz: [
          { q: '다음 코드의 실행 결과는?<pre><code>a, b = 100, 200\nprint(a != b, a &gt;= b)</code></pre>', options: ['True False', 'False True', 'True True', 'False False'], answer: 0,
            explain: '100 과 200 은 다르므로 <code>!=</code> 는 True, 100 이 200 보다 크거나 같지 않으므로 <code>>=</code> 는 False.' },
          { q: '<code>a = 99</code> 일 때 <code>(a &gt; 100) or (a &lt; 200)</code> 의 결과는?', options: ['True', 'False', '99', '오류'], answer: 0,
            explain: '<code>a < 200</code> 이 True 이므로 or 의 결과는 True 입니다.' },
          { q: '다음 중 결과가 <b>False</b> 인 것은?', options: ['<code>bool(-1)</code>', '<code>bool("0")</code>', '<code>bool(0)</code>', '<code>not False</code>'], answer: 2,
            explain: '숫자 0 만 거짓입니다. -1 은 0 이 아닌 수, "0" 은 비어 있지 않은 문자열이라 참입니다.' },
          { q: 'Code04-02 에서 거북이가 화면 밖으로 나가면 일어나는 일이 <b>아닌</b> 것은?', options: ['펜을 들고 (0, 0) 으로 이동한다', 'exitCount 가 1 증가한다', 'exitCount 가 5 이상이면 반복을 끝낸다', '화면 크기가 두 배로 커진다'], answer: 3,
            explain: '화면 크기는 처음에 한 번 정한 뒤 바뀌지 않습니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>print("" or "손님", 3 and 5)</code></pre>', options: ['True True', '손님 5', '손님 3', 'True 5'], answer: 1,
            explain: '<code>and</code> · <code>or</code> 는 True/False 가 아니라 <b>마지막으로 본 피연산자</b>를 돌려줍니다. 빈 문자열은 거짓이라 <code>or</code> 뒤의 "손님", <code>3 and 5</code> 는 앞이 참이므로 뒤의 5.' },
          { q: '<code>menu = 3</code> 일 때 "menu 가 1 또는 2 인가?"를 <b>잘못</b> 쓴 것은?', options: ['<code>menu == 1 or menu == 2</code>', '<code>menu in (1, 2)</code>', '<code>menu == 1 or 2</code>', '<code>(menu == 1) or (menu == 2)</code>'], answer: 2,
            explain: '<code>menu == 1 or 2</code> 는 <code>(menu == 1) or 2</code> 로 계산되어 결과가 <code>2</code>(참으로 취급)가 됩니다. 조건으로 쓰면 언제나 참이 되는 유명한 버그입니다.' }
        ],
        slides: [
          { layout: 'title', title: '관계 연산자 · 논리 연산자', subtitle: '[프로그램 2] 마음대로 이동하는 거북이', badge: 'Chapter 04 · 3교시',
            notes: '<p>도입 발문: "키가 150 보다 크고 180 보다 작은 사람만 놀이기구를 탈 수 있다면, 컴퓨터는 이걸 어떻게 판단할까?"</p>' },
          { layout: 'table', title: '관계 연산자', lead: '결과는 항상 True 또는 False', head: ['연산자', '의미', '100 ? 200'], rows: [
            ['<code>==</code>', '같다', 'False'], ['<code>!=</code>', '같지 않다', 'True'], ['<code>&gt;</code>', '크다', 'False'],
            ['<code>&lt;</code>', '작다', 'True'], ['<code>&gt;=</code>', '크거나 같다', 'False'], ['<code>&lt;=</code>', '작거나 같다', 'True']
          ], notes: '<p>오른쪽 열을 가리고 학생들에게 하나씩 답하게 한 뒤 공개합니다.</p><p>관계 연산자는 대부분 if · while 의 조건으로 쓰인다는 점을 언급합니다(5장 · 6장 복선).</p>' },
          { layout: 'two', title: '= 와 == 는 다르다', left: { title: '== 비교 (True/False)', code: 'a, b = 100, 200\nprint(a == b, a != b)' }, right: { title: '= 대입 → 오류', code: 'a, b = 100, 200\nprint(a = b)', run: false },
            notes: '<p>오른쪽 코드는 실제로 편집기에 붙여 실행해 TypeError 를 보여 줍니다(슬라이드에서는 실행 버튼을 막아 둠).</p><p>"=는 넣기, ==는 묻기" 라고 짧게 외우게 합니다.</p>' },
          { layout: 'code', title: '비교를 이어 쓰기 (체이닝)', code: 'score = 87\nprint(0 <= score <= 100)\nprint(0 <= score and score <= 100)\n\na, b, c = 1, 1, 1\nprint(a == b == c)\nprint(1 < 3 > 2)',
            points: ['수학처럼 <code>0 &lt;= x &lt;= 100</code> 가능', '<code>and</code> 로 쓴 것과 같은 뜻', '가운데 값은 <b>한 번만</b> 계산', 'C · 자바에서는 항상 참이 되는 버그'],
            notes: '<p>범위 검사는 체이닝으로 쓰는 것이 의도가 가장 잘 드러난다는 점을 강조합니다. 거북이 프로그램의 긴 조건식도 이 표기로 짧아집니다.</p><p>다른 언어를 아는 학생에게: C 에서는 <code>0 &lt;= x</code> 의 결과 1 이 다시 100 과 비교되어 언제나 참이 됩니다. 파이썬이 이 함정을 없앴다고 설명하세요.</p>' },
          { layout: 'table', title: '논리 연산자', lead: '여러 조건을 묶을 때', head: ['연산자', '의미', '예'], rows: [
            ['<code>and</code>', '둘 다 참이어야 참', '<code>(a &gt; 100) and (a &lt; 200)</code>'],
            ['<code>or</code>', '하나만 참이어도 참', '<code>(a == 100) or (a == 200)</code>'],
            ['<code>not</code>', '참 ↔ 거짓 뒤집기', '<code>not(a &lt; 100)</code>']
          ], notes: '<p>놀이기구 예시로 돌아가서 <code>(키 > 150) and (키 < 180)</code> 을 함께 만들어 봅니다.</p><p>파이썬은 <code>&&</code>, <code>||</code>, <code>!</code> 대신 영어 단어를 쓴다는 점(다른 언어 경험자 대비)을 언급합니다.</p>' },
          { layout: 'code', repl: true, title: '논리 연산자 실행', code: 'a = 99\n(a > 100) and (a < 200)\n(a > 100) or (a < 200)\nnot(a == 100)',
            points: ['결과: False, True, True', 'and: 하나라도 False 면 False', 'or: 하나라도 True 면 True', 'not: 뒤집기'],
            notes: '<p>a 를 150, 250 으로 바꿔 다시 실행해 보며 결과가 어떻게 바뀌는지 표로 정리합니다.</p>' },
          { layout: 'code', repl: true, title: '0 은 False, 나머지 숫자는 True', code: 'if(1234) : print("참이면 보여요")\n\nif(0) : print("거짓이면 안 보여요")\n',
            points: ['셸에서 if 는 Enter 두 번', '1234 → 참 → 출력', '0 → 거짓 → 출력 없음', '<code>bool(값)</code> 으로 확인 가능'],
            notes: '<p>IDLE 에서처럼 콘솔 셸에서도 <code>...</code> 가 나오면 빈 줄로 블록을 닫아야 합니다.</p><p>발문: "-1 은 참일까 거짓일까?" → <code>bool(-1)</code> 을 실행해 확인합니다.</p>' },
          { layout: 'two', title: 'and · or 는 "값"을 돌려준다', lead: '단락 평가: 결과가 정해지면 뒤는 보지 않는다',
            left: { title: '돌려주는 값', code: 'print("" or "손님")\nprint(3 and 5, 0 and 5)\nprint(3 or 5, 0 or 5)' },
            right: { title: '흔한 버그', code: 'menu = 3\nprint(menu == 1 or 2)\nprint(menu == 1 or menu == 2)\nprint(menu in (1, 2))' },
            notes: '<p>왼쪽 결과: <code>손님</code> / <code>5 0</code> / <code>3 5</code>. 오른쪽 결과: <code>2</code> / <code>False</code> / <code>False</code>.</p><p>오른쪽 첫 줄이 왜 2 인지 함께 분해합니다: <code>(menu == 1) or 2</code> → <code>False or 2</code> → <code>2</code>. 조건으로 쓰면 항상 참이 되는 버그라는 점을 꼭 짚어 주세요. 활용: <code>input() or "익명"</code> 으로 기본값 채우기.</p>' },
          { layout: 'code', title: '== 와 is · 실수 비교', code: 'import math\n\na = [1, 2, 3]\nb = [1, 2, 3]\nprint(a == b, a is b)\n\nprint(0.1 + 0.2)\nprint(0.1 + 0.2 == 0.3)\nprint(math.isclose(0.1 + 0.2, 0.3))',
            points: ['<code>==</code> 값 비교 / <code>is</code> 같은 객체인가', '<code>is</code> 는 <code>None</code> 비교에만 사용', '0.1 + 0.2 는 0.30000000000000004', '실수는 <code>math.isclose()</code> 로 비교'],
            notes: '<p>결과: <code>True False</code> / <code>0.30000000000000004</code> / <code>False</code> / <code>True</code>.</p><p>실수 오차는 "10진수로 1/3 을 정확히 못 쓰는 것과 같다"는 비유가 잘 통합니다. 돈 계산은 정수(원 단위)로 하라는 실무 원칙까지 이어서 말해 주세요.</p>' },
          { layout: 'diagram', title: '거북이가 화면 안에 있을 조건', html: `<svg viewBox="0 0 640 320" width="100%" font-family="sans-serif">
  <rect x="60" y="20" width="280" height="280" fill="var(--ok)" opacity="0.12" stroke="var(--ok)" stroke-width="3"/>
  <circle cx="200" cy="160" r="6" fill="var(--fg)"/><text x="208" y="180" font-size="18" fill="var(--fg)">(0,0)</text>
  <text x="60" y="318" text-anchor="middle" font-size="18" fill="var(--accent)">-150</text><text x="340" y="318" text-anchor="middle" font-size="18" fill="var(--accent)">150</text>
  <g font-family="monospace" font-size="20">
    <text x="370" y="90" fill="var(--accent)">-150 &lt;= curX &lt;= 150</text>
    <text x="470" y="150" font-weight="bold" fill="var(--fg)">and</text>
    <text x="370" y="210" fill="var(--accent2)">-150 &lt;= curY &lt;= 150</text>
  </g>
</svg>`, caption: '네 개의 비교를 and 로 묶는다 (swidth = sheight = 300)',
            notes: '<p>칠판에 좌표평면을 그리고, 어떤 점이 안이고 어떤 점이 밖인지 학생들이 말하게 합니다. 그다음 "x 는 어떤 범위?" "y 는?" "둘을 어떻게 연결?" 순서로 조건식을 함께 만듭니다.</p>' },
          { layout: 'code', title: 'Code04-02. 마음대로 이동하는 거북이 (요약본)', code: "import turtle, random\nswidth, sheight, exitCount = 300, 300, 0\nturtle.title('거북이가 맘대로 다니기')\nturtle.shape('turtle'); turtle.pensize(3)\nturtle.setup(width = swidth + 30, height = sheight + 30)\nturtle.screensize(swidth, sheight)\n\nwhile True :\n    turtle.pencolor((random.random(), random.random(), random.random()))\n    turtle.left(random.randrange(0, 360))\n    turtle.forward(random.randrange(1, 100))\n    curX, curY = turtle.xcor(), turtle.ycor()\n    if (-swidth/2 <= curX and curX <= swidth/2) and (-sheight/2 <= curY and curY <= sheight/2) :\n        pass\n    else :\n        turtle.penup(); turtle.goto(0, 0); turtle.pendown()\n        exitCount += 1\n        if exitCount >= 5 :\n            break\n\nturtle.done()",
            points: ['무작위 색 · 각도 · 거리', 'and 로 화면 안인지 검사', '밖이면 (0, 0) 으로 복귀', '5번 벗어나면 break'],
            notes: '<p>슬라이드에는 한 화면에 들어가도록 줄인 버전을 넣었습니다. 학생 문서의 Code04-02 가 교재 원본(39행)입니다.</p><p>실행해서 거북이가 경계를 넘을 때 가운데로 돌아오는 모습을 함께 봅니다. while/break 는 6장에서 자세히 배운다고만 말해 줍니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: 'swidth = 300 일 때 curX = 160, curY = 0 이면 <code>(-swidth/2 &lt;= curX and curX &lt;= swidth/2) and (-150 &lt;= curY &lt;= 150)</code> 는?', options: ['True', 'False', '160', '오류'], answer: 1,
            explain: 'curX(160) 가 150 보다 커서 앞쪽 괄호가 False → and 전체도 False. 거북이는 화면 밖에 있습니다.',
            notes: '<p>and 는 하나만 False 여도 전체가 False 라는 점을 다시 확인합니다.</p>' },
          { layout: 'practice', title: '실습 4-12. 윤년 판별식', desc: '연도를 입력받아 윤년이면 True 를 출력하세요. (4 로 나누어떨어지고 100 으로는 안 나누어떨어지거나, 400 으로 나누어떨어지는 해)',
            starter: 'year = int(input("연도 : "))\n\n# TODO: 윤년 조건식\n',
            solution: 'year = int(input("연도 : "))\n\nleap = (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)\n\nprint(year, "년은 윤년?", leap)\n', stdin: '2024\n',
            notes: '<p>산술(%) · 관계(==, !=) · 논리(and, or) 연산자를 한 식에서 모두 쓰는 문제입니다. 2024, 1900, 2000 을 넣어 확인하게 합니다.</p>' },
          { layout: 'practice', title: '🚀 프로젝트 4-14. 회원 가입 검증기', desc: '아이디(4~12자) · 나이(14~120) · 비밀번호(8자 이상, 아이디와 다름) · 비밀번호 확인을 검사해 각 규칙과 최종 가입 가능 여부를 True / False 로 출력하세요.',
            starter: 'user_id = input("아이디 : ")\nage = int(input("나이 : "))\npw = input("비밀번호 : ")\npw2 = input("비밀번호 확인 : ")\n\n# TODO: 규칙을 조건식으로\n',
            solution: 'user_id = input("아이디 : ")\nage = int(input("나이 : "))\npw = input("비밀번호 : ")\npw2 = input("비밀번호 확인 : ")\n\nid_ok = 4 <= len(user_id) <= 12\nage_ok = 14 <= age <= 120\npw_ok = len(pw) >= 8 and pw != user_id\nsame_ok = pw == pw2\nall_ok = id_ok and age_ok and pw_ok and same_ok\n\nprint("아이디 :", id_ok, "/ 나이 :", age_ok)\nprint("비밀번호 :", pw_ok, "/ 확인 :", same_ok)\nprint("가입 가능 :", all_ok)\n', stdin: 'pyuser\n17\nsecret12\nsecret12\n',
            notes: '<p>실전에서 회원 가입 화면이 하는 일이 바로 이것이라고 이야기하면 동기가 생깁니다.</p><p>지도 포인트: 조건마다 <code>id_ok</code> 처럼 <b>이름 있는 변수</b>에 담기 → 마지막 줄이 짧고 읽기 쉬워집니다. 일부러 짧은 비밀번호나 다른 확인값을 넣어 False 가 나오는 것도 보여 주세요.</p>' },
          { layout: 'summary', title: '3교시 정리', bullets: [
            '관계 연산자 <code>== != &gt; &lt; &gt;= &lt;=</code> → True / False',
            '<code>=</code> 는 대입, <code>==</code> 는 값 비교, <code>is</code> 는 같은 객체인가',
            '범위 검사는 체이닝으로: <code>0 &lt;= x &lt;= 100</code>',
            '<code>and</code> · <code>or</code> 는 단락 평가 + <b>값</b>을 돌려준다 (<code>입력 or 기본값</code>)',
            '0 은 False, 0 이 아닌 수는 True / 실수는 <code>math.isclose()</code> 로 비교',
            '거북이 프로그램: and 로 화면 경계 검사'
          ], notes: '<p>다음 시간: 정수를 2진수 비트 단위로 계산하는 비트 연산자.</p>' }
        ]
      },

      /* ═════════════════════════ 4-4 ═════════════════════════ */
      {
        id: 'ch04-4',
        title: '비트 연산자',
        minutes: 50,
        goals: [
          '10진수를 2진수 · 16진수로 나타내고 bin() · hex() 로 확인할 수 있다',
          '&, |, ^ 연산을 비트 단위로 계산할 수 있다',
          '마스크(mask)를 이용해 원하는 비트만 남기거나 바꿀 수 있다',
          '~ (비트 부정)과 2의 보수의 관계를 설명할 수 있다',
          '<<, >> 시프트 연산이 2의 거듭제곱 곱셈 · 나눗셈과 같음을 설명할 수 있다',
          '비트 플래그로 여러 개의 켜짐 · 꺼짐 상태를 정수 하나에 담고 켜기 · 끄기 · 검사할 수 있다',
          '시프트와 마스크로 RGB 색상 값을 분해하고 합칠 수 있다'
        ],
        flow: [['2진수 복습 · 비트 연산자 종류', 6], ['& | ^', 12], ['마스크 · Code04-03', 8], ['~ 와 2의 보수', 4], ['시프트 · Code04-04', 8], ['비트 플래그 · 색상 다루기', 8], ['정리', 4]],
        content: [
          { type: 'h', text: '비트 연산자의 개념' },
          { type: 'p', html: '컴퓨터는 모든 수를 0 과 1 로 된 <b>2진수</b>로 저장합니다. 2진수의 한 자리를 <b>비트(bit)</b>라고 하며, <b>비트 연산자</b>는 정수를 2진수로 바꾼 뒤 <b>같은 자리의 비트끼리</b> 계산합니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 2진수 · 16진수 빠르게 복습', html: '<ul><li>10진수 10 = 8 + 2 = <code>1010</code>₂ (자리값 8 · 4 · 2 · 1)</li><li>파이썬에서 2진수는 <code>0b1010</code>, 16진수는 <code>0xFF</code> 처럼 앞에 <code>0b</code>, <code>0x</code> 를 붙여 씁니다.</li><li><code>bin(10)</code> → <code>\'0b1010\'</code>, <code>hex(255)</code> → <code>\'0xff\'</code>, <code>int(\'1010\', 2)</code> → <code>10</code></li><li>16진수 한 자리는 2진수 4비트와 딱 맞습니다: <code>0xF</code> = <code>1111</code>₂, <code>0x41</code> = <code>0100 0001</code>₂</li></ul>' },
          { type: 'code', repl: true, title: '추가 예제. 진법 변환 함수', code: 'bin(10)\nbin(7)\n0b1010\nhex(255)\n0xFF\nint("1010", 2)', expect: ">>> bin(10)\n'0b1010'\n>>> bin(7)\n'0b111'\n>>> 0b1010\n10\n>>> hex(255)\n'0xff'\n>>> 0xFF\n255\n>>> int(\"1010\", 2)\n10\n>>>" },
          { type: 'table', caption: '표 4-5 비트 연산자의 종류', head: ['연산자', '의미', '설명'], rows: [
            ['<code>&amp;</code>', '비트 논리곱(and)', '둘 다 1 이면 1'],
            ['<code>|</code>', '비트 논리합(or)', '둘 중 하나만 1 이어도 1'],
            ['<code>^</code>', '비트 배타적 논리합(xor)', '둘이 같으면 0, 다르면 1'],
            ['<code>~</code>', '비트 부정', '1 은 0 으로, 0 은 1 로 바꿈'],
            ['<code>&lt;&lt;</code>', '비트 이동(왼쪽)', '비트를 왼쪽으로 시프트(shift)'],
            ['<code>&gt;&gt;</code>', '비트 이동(오른쪽)', '비트를 오른쪽으로 시프트(shift)']
          ] },

          { type: 'h', text: '비트 논리곱(&)' },
          { type: 'p', html: '<code>&amp;</code> 는 같은 자리의 두 비트가 <b>모두 1 일 때만</b> 1 을 만듭니다. 비트 연산에서는 0 을 False, 1 을 True 로 보면 되므로 논리 연산자 <code>and</code> 와 규칙이 같습니다. 차이는 <code>and</code> 의 결과가 True/False 인 반면, <code>&amp;</code> 는 비트별로 계산한 <b>정수</b>를 돌려준다는 것입니다.' },
          { type: 'table', head: ['A', 'B', 'A & B'], rows: [['0', '0', '0'], ['0', '1', '0'], ['1', '0', '0'], ['1', '1', '<b>1</b>']] },
          { type: 'figure', caption: '그림 4-2 비트 논리곱의 예 — 10 & 7 = 2', html: bitFig('&amp;', '1010', '0111', '0010', '10', '7', '2', '각 비트별로 and 연산') },
          { type: 'code', repl: true, title: '예제. 비트 논리곱', code: '10 & 7\n123 & 456\n0xFFFF & 0x0000', expect: '>>> 10 & 7\n2\n>>> 123 & 456\n72\n>>> 0xFFFF & 0x0000\n0\n>>>',
            desc: '<code>123 & 456</code> 은 <code>1111011</code>₂ 과 <code>111001000</code>₂ 의 비트 논리곱입니다. 자릿수가 다르면 짧은 쪽 앞을 0 으로 채워 <code>001111011</code> 로 맞춘 뒤 계산하면 <code>001001000</code>₂ = 72 가 됩니다. 어떤 수든 0 과 <code>&</code> 하면 모든 비트가 0 이 되므로 결과는 0 입니다.' },
          { type: 'figure', caption: '123 & 456 — 자릿수를 맞추고(앞에 0 채움) 비트별로 계산', html: bitFig('&amp;', '001111011', '111001000', '001001000', '123', '456', '72') },

          { type: 'h', text: '비트 논리합(|)' },
          { type: 'p', html: '<code>|</code> 는 두 비트 중 <b>하나라도 1</b> 이면 1 을 만듭니다(키보드에서 Shift + <code>\\</code> 키).' },
          { type: 'table', head: ['A', 'B', 'A | B'], rows: [['0', '0', '0'], ['0', '1', '<b>1</b>'], ['1', '0', '<b>1</b>'], ['1', '1', '<b>1</b>']] },
          { type: 'figure', caption: '비트 논리합의 예 — 10 | 7 = 15', html: bitFig('|', '1010', '0111', '1111', '10', '7', '15', '각 비트별로 or 연산') },
          { type: 'code', repl: true, title: '예제. 비트 논리합', code: '10 | 7\n123 | 456\n0xFFFF | 0x0000\nhex(0xFFFF | 0x0000)', expect: ">>> 10 | 7\n15\n>>> 123 | 456\n507\n>>> 0xFFFF | 0x0000\n65535\n>>> hex(0xFFFF | 0x0000)\n'0xffff'\n>>>",
            desc: '<code>0xFFFF | 0x0000</code> 은 <code>0xFFFF</code> 그대로이며, 셸은 10진수 65535 로 보여 줍니다. 16진수로 보고 싶으면 <code>hex()</code> 함수를 씁니다.' },

          { type: 'h', text: '비트 배타적 논리합(^)' },
          { type: 'p', html: '<code>^</code> (xor, exclusive or)는 두 비트가 <b>다르면 1, 같으면 0</b> 입니다. "둘 중 하나만" 1 일 때 1 이라고 기억하면 됩니다.' },
          { type: 'table', head: ['A', 'B', 'A ^ B'], rows: [['0', '0', '0'], ['0', '1', '<b>1</b>'], ['1', '0', '<b>1</b>'], ['1', '1', '0']] },
          { type: 'figure', caption: '그림 4-4 비트 배타적 논리합의 예 — 10 ^ 7 = 13', html: bitFig('^', '1010', '0111', '1101', '10', '7', '13', '각 비트별로 xor 연산') },
          { type: 'code', repl: true, title: '예제. 비트 배타적 논리합', code: '10 ^ 7\n123 ^ 456\n0xFFFF ^ 0x0000', expect: '>>> 10 ^ 7\n13\n>>> 123 ^ 456\n435\n>>> 0xFFFF ^ 0x0000\n65535\n>>>' },
          { type: 'callout', kind: 'warn', title: '^ 는 제곱이 아니다', html: '수학이나 엑셀에서는 <code>2^3</code> 이 2 의 3제곱이지만, 파이썬의 <code>^</code> 는 <b>비트 xor</b> 입니다. <code>2 ^ 3</code> 은 <code>10</code>₂ xor <code>11</code>₂ = <code>01</code>₂ = <b>1</b> 입니다. 제곱은 <code>2 ** 3</code> 으로 씁니다.' },

          { type: 'h', text: '비트 연산 활용: 마스크' },
          { type: 'p', html: '<b>마스크(mask)</b>는 필요한 비트만 걸러 내거나 바꾸기 위해 준비한 비트 무늬입니다. 가면(mask)이 얼굴 일부만 가리듯, 마스크와 <code>&amp;</code> · <code>|</code> · <code>^</code> 연산을 해서 원하는 자리만 조작합니다.' },
          { type: 'code', title: 'Code04-03. 비트 연산 활용 (마스크)', code: 'a = ord(\'A\')\nmask = 0x0F\n\nprint("%x & %x = %x" % (a, mask, a & mask))\nprint("%X | %X = %X" % (a, mask, a | mask))\n\nmask = ord(\'a\') - ord(\'A\')\n\nb = a ^ mask\nprint("%c ^ %d = %c" % (a, mask, b))\na = b ^ mask\nprint("%c ^ %d = %c" % (b, mask, a))',
            expect: '41 & f = 1\n41 | F = 4F\nA ^ 32 = a\na ^ 32 = A',
            desc: '<code>ord(\'A\')</code> 는 문자 A 의 코드값 65(16진수 0x41)입니다. <code>%x</code> 는 16진수 소문자, <code>%X</code> 는 대문자, <code>%c</code> 는 코드값을 문자로 출력하는 서식입니다. (교재는 5행 서식 문자열에 <code>&amp;</code> 로 적었지만 실제 연산이 <code>|</code> 이므로 <code>|</code> 로 고쳤습니다.)' },
          { type: 'list', items: [
            '<code>2행</code>: 마스크를 16진수 <code>0x0F</code>, 즉 2진수 <code>0000 1111</code> 로 정한다.',
            '<code>4행</code>: <code>&amp;</code> 마스크 → 앞 4비트는 무조건 <code>0000</code>, 뒤 4비트는 원래 값 그대로 (그림 4-5).',
            '<code>5행</code>: <code>|</code> 마스크 → 앞 4비트는 원래 값 그대로, 뒤 4비트는 무조건 <code>1111</code> (그림 4-6).',
            '<code>7행</code>: 소문자 a(0x61)와 대문자 A(0x41)의 차이 0x20 = 32 = <code>0010 0000</code>₂ 을 마스크로 쓴다.',
            '<code>9행</code>: A 와 32 를 xor 하면 소문자 a 로, <code>11행</code>: 다시 32 와 xor 하면 A 로 원상 복귀한다.'
          ] },
          { type: 'figure', caption: '그림 4-5 마스크 0x0F 를 사용한 비트 논리곱 결과 — 앞 4비트는 0000, 뒤 4비트는 원래값', html: bitFig('&amp;', ['0100', '0001'], ['0000', '1111'], ['0000', '0001'], "'A' 는 0x41", '마스크(0x0F)', '0x01') },
          { type: 'figure', caption: '그림 4-6 마스크 0x0F 를 사용한 비트 논리합 결과 — 앞 4비트는 원래값, 뒤 4비트는 1111', html: bitFig('|', ['0100', '0001'], ['0000', '1111'], ['0100', '1111'], "'A' 는 0x41", '마스크(0x0F)', '0x4F') },
          { type: 'figure', caption: 'xor 로 대문자 ↔ 소문자 바꾸기 — 32(0010 0000)의 1 자리만 뒤집힌다', html: bitFig('^', ['0100', '0001'], ['0010', '0000'], ['0110', '0001'], "'A' (0x41)", '마스크 32 (0x20)', "'a' (0x61)") },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: xor 를 두 번 하면 원래대로', html: '같은 값으로 xor 를 두 번 하면 원래 값으로 돌아옵니다: <code>(a ^ m) ^ m == a</code>. 1 과 xor 한 비트는 뒤집히고, 한 번 더 뒤집으면 제자리이기 때문입니다. 이 성질은 간단한 암호화, 두 변수 값 바꾸기 같은 곳에 쓰입니다. 참고로 문자열의 대소문자는 실제로는 <code>"A".lower()</code>, <code>"a".upper()</code> 로 바꾸는 것이 편합니다.' },

          { type: 'h', text: '비트 부정(~)과 2의 보수' },
          { type: 'p', html: '<code>~</code> 는 두 수가 아니라 <b>하나의 수</b>만 가지고 모든 비트를 반대로(0 ↔ 1) 뒤집습니다. 그래서 <b>보수 연산자</b>라고도 합니다. 비트를 뒤집은 값을 <b>1의 보수</b>, 여기에 1 을 더한 값을 <b>2의 보수</b>라고 하는데, 컴퓨터는 2의 보수를 <b>음수</b>로 사용합니다. 즉 <code>~a + 1</code> 은 <code>-a</code> 입니다.' },
          { type: 'figure', caption: '8비트로 본 12 의 2의 보수 — 뒤집고(~) 1 을 더하면 -12', html: `<svg viewBox="0 0 700 200" width="100%" style="max-width:700px" font-family="monospace">
  <g font-size="22">
    <text x="20" y="45" fill="var(--fg)">12</text><text x="200" y="45" fill="var(--fg)">0000 1100</text>
    <text x="20" y="100" fill="var(--accent)">~12</text><text x="200" y="100" fill="var(--accent)">1111 0011</text><text x="400" y="100" font-size="17" fill="var(--muted)">1의 보수 (= -13)</text>
    <text x="20" y="155" fill="var(--accent2)">~12 + 1</text><text x="200" y="155" fill="var(--accent2)">1111 0100</text><text x="400" y="155" font-size="17" fill="var(--muted)">2의 보수 (= -12)</text>
  </g>
  <path d="M180 55 Q165 72 180 88" fill="none" stroke="var(--accent)" stroke-width="2"/><text x="120" y="78" font-size="15" fill="var(--accent)">뒤집기</text>
  <path d="M180 110 Q165 127 180 143" fill="none" stroke="var(--accent2)" stroke-width="2"/><text x="130" y="133" font-size="15" fill="var(--accent2)">+1</text>
</svg>` },
          { type: 'code', repl: true, title: '예제. 비트 부정으로 음수 만들기', code: 'a = 12345\n~a + 1\n~a', expect: '>>> a = 12345\n>>> ~a + 1\n-12345\n>>> ~a\n-12346\n>>>',
            desc: '정수에 비트 부정을 한 뒤 1 을 더하면 그 수의 음수가 됩니다. 그래서 <code>~a</code> 자체는 항상 <code>-a - 1</code> 입니다.' },

          { type: 'h', text: '시프트 연산자' },
          { type: 'p', html: '<b>시프트(shift) 연산자</b>는 비트 전체를 왼쪽(<code>&lt;&lt;</code>) 또는 오른쪽(<code>&gt;&gt;</code>)으로 정한 칸 수만큼 밀어 냅니다.' },
          { type: 'p', html: '<b>왼쪽 시프트</b> <code>a &lt;&lt; n</code> : 비트를 왼쪽으로 n 칸 밀고 오른쪽 빈자리는 0 으로 채웁니다. 한 칸 밀 때마다 값이 2 배가 되므로 <b>2ⁿ 을 곱한 것</b>과 같습니다.' },
          { type: 'figure', caption: '그림 4-7 26 의 왼쪽으로 2칸 시프트 연산 — 26 × 2² = 104', html: shiftFig('L', '00011010', 2, '26', '104') },
          { type: 'code', repl: true, title: '예제. 왼쪽 시프트', code: 'a = 10\na << 1; a << 2; a << 3; a << 4', expect: '>>> a = 10\n>>> a << 1; a << 2; a << 3; a << 4\n20\n40\n80\n160\n>>>',
            desc: '10 을 1칸 밀면 ×2 = 20, 2칸은 ×4 = 40, 3칸은 ×8 = 80, 4칸은 ×16 = 160 입니다.' },
          { type: 'p', html: '<b>오른쪽 시프트</b> <code>a &gt;&gt; n</code> : 비트를 오른쪽으로 n 칸 밀고, 오른쪽 끝에서 밀려난 비트는 사라집니다. 왼쪽 빈자리는 부호 비트(양수면 0)로 채웁니다. 한 칸마다 2 로 나눈 <b>몫</b>이 되므로 <code>a // 2ⁿ</code> 과 같습니다.' },
          { type: 'figure', caption: '그림 4-8 26 의 오른쪽으로 2칸 시프트 연산 — 26 // 2² = 6', html: shiftFig('R', '00011010', 2, '26', '6') },
          { type: 'code', repl: true, title: '예제. 오른쪽 시프트', code: 'a = 10\na >> 1; a >> 2; a >> 3; a >> 4', expect: '>>> a = 10\n>>> a >> 1; a >> 2; a >> 3; a >> 4\n5\n2\n1\n0\n>>>',
            desc: '10 // 2 = 5, 10 // 4 = 2, 10 // 8 = 1, 10 // 16 = 0 과 같습니다.' },
          { type: 'code', title: 'Code04-04. 시프트 연산 반복하기', code: 'a = 100\nresult = 0\ni = 0\n\nfor i in range(1, 5) :\n    result = a << i\n    print("%d << %d = %d" % (a, i, result))\n\nfor i in range(1, 5) :\n    result = a >> i\n    print("%d >> %d = %d" % (a, i, result))',
            expect: '100 << 1 = 200\n100 << 2 = 400\n100 << 3 = 800\n100 << 4 = 1600\n100 >> 1 = 50\n100 >> 2 = 25\n100 >> 3 = 12\n100 >> 4 = 6',
            desc: '<code>for i in range(1, 5) :</code> 는 i 를 1, 2, 3, 4 로 바꾸며 아래 두 줄을 4번 반복합니다(반복문은 6장에서 자세히 배웁니다). 100 >> 3 은 100 // 8 = 12.5 의 몫이라 12 입니다.' },

          { type: 'h', text: '한 걸음 더 ① 비트 플래그 — 스위치 여러 개를 정수 하나에' },
          { type: 'p', html: '"읽기 가능 / 쓰기 가능 / 실행 가능"처럼 <b>켜짐 · 꺼짐 스위치가 여러 개</b>일 때, 변수를 여러 개 만드는 대신 <b>정수 하나의 비트들</b>에 담는 방법을 <b>비트 플래그(flag)</b>라고 합니다. 값을 하나만 주고받으면 되고, 여러 조건을 한 번의 연산으로 검사할 수 있어 운영체제 · 게임 · 네트워크 프로그램에서 지금도 널리 쓰입니다.' },
          { type: 'table', caption: '비트 플래그의 네 가지 관용구', head: ['하고 싶은 일', '식', '이유'], rows: [
            ['권한 <b>켜기</b>', '<code>perm |= WRITE</code>', '<code>|</code> 는 1 인 자리를 1 로 만든다'],
            ['권한 <b>끄기</b>', '<code>perm &amp;= ~WRITE</code>', '<code>~WRITE</code> 는 그 자리만 0 인 마스크'],
            ['권한 <b>검사</b>', '<code>perm &amp; WRITE != 0</code>', '그 자리가 1 이면 0 이 아닌 값이 나온다'],
            ['권한 <b>뒤집기</b>', '<code>perm ^= READ</code>', 'xor 는 1 과 만난 비트를 뒤집는다'],
            ['여러 권한 <b>합치기</b>', '<code>READ | WRITE</code>', '스위치를 동시에 여러 개 켠다']
          ] },
          { type: 'code', title: '추가 예제. 비트 플래그로 권한 다루기', code: 'READ = 0b001\nWRITE = 0b010\nEXEC = 0b100\n\nperm = READ | WRITE\nprint(perm, bin(perm))\nprint("읽기 가능?", perm & READ != 0)\nprint("실행 가능?", perm & EXEC != 0)\n\nperm |= EXEC\nprint("실행 추가 :", format(perm, "03b"))\nperm &= ~WRITE\nprint("쓰기 제거 :", format(perm, "03b"))\nperm ^= READ\nprint("읽기 토글 :", format(perm, "03b"))',
            expect: '3 0b11\n읽기 가능? True\n실행 가능? False\n실행 추가 : 111\n쓰기 제거 : 101\n읽기 토글 : 100',
            desc: '권한 상수를 <code>0b001</code>, <code>0b010</code>, <code>0b100</code> 처럼 <b>비트가 하나씩만 켜진 값</b>(1, 2, 4, 8 …)으로 잡는 것이 핵심입니다. <code>format(perm, "03b")</code> 은 3자리 2진수로 예쁘게 출력하는 서식입니다. 비교 연산자보다 비트 연산자가 먼저 계산되므로 <code>perm &amp; READ != 0</code> 은 <code>(perm &amp; READ) != 0</code> 으로 동작하지만, 읽는 사람을 위해 괄호를 넣어 주면 더 좋습니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 실제로 쓰이는 비트 플래그', html: '<ul><li>리눅스 파일 권한 <code>chmod 755</code> 의 7 · 5 · 5 는 각각 <code>rwx</code> 세 비트입니다(7 = 111 = 읽기 + 쓰기 + 실행).</li><li>게임 캐릭터의 상태(중독 · 기절 · 무적)나 그래픽 옵션처럼 "동시에 여러 개가 켜질 수 있는" 정보에 적합합니다.</li><li>파이썬다운 방법: 표준 라이브러리 <code>enum.Flag</code> 를 쓰면 <code>Perm.READ | Perm.WRITE</code> 처럼 <b>이름이 보이는</b> 플래그를 만들 수 있습니다(진짜 프로젝트에서는 이쪽을 권합니다).</li><li><code>perm.bit_count()</code> 는 켜진 비트의 개수, 즉 "가진 권한 수"를 알려 줍니다.</li></ul>' },

          { type: 'h', text: '한 걸음 더 ② 마스크와 시프트로 색 다루기' },
          { type: 'p', html: '화면의 색은 빨강 · 초록 · 파랑(RGB) 각각 0~255, 즉 <b>8비트씩 24비트</b>로 표현합니다. <code>0x3498DB</code> 처럼 정수 하나에 세 성분이 들어 있으므로, 원하는 성분을 꺼내려면 <b>시프트로 자리를 옮기고 마스크로 잘라 냅니다</b>. 비트 연산이 실제로 쓰이는 가장 흔한 예입니다.' },
          { type: 'code', title: '추가 예제. 색상 값 분해하고 다시 합치기', code: 'color = 0x3498DB\n\nr = (color >> 16) & 0xFF\ng = (color >> 8) & 0xFF\nb = color & 0xFF\nprint(r, g, b)\n\nback = (r << 16) | (g << 8) | b\nprint(hex(back), back == color)\nprint(format(color, "024b"))\nprint("어둡게:", hex((r >> 1 << 16) | (g >> 1 << 8) | (b >> 1)))',
            expect: '52 152 219\n0x3498db True\n001101001001100011011011\n어둡게: 0x1a4c6d',
            desc: '<code>color >> 16</code> 으로 빨강 성분을 맨 아래로 내린 뒤 <code>&amp; 0xFF</code> 로 아래 8비트만 남깁니다. 반대로 합칠 때는 <code>&lt;&lt;</code> 로 자리를 올린 뒤 <code>|</code> 로 겹칩니다. 마지막 줄의 <code>&gt;&gt; 1</code> 은 각 성분을 절반으로 줄이는 것 — 색이 어두워집니다.' },

          { type: 'h', text: '한 걸음 더 ③ 2진수 예쁘게 출력하기' },
          { type: 'code', title: '추가 예제. bin() · format() · bit_length()', code: 'n = 13\nprint(bin(n), bin(n)[2:])\nprint(format(n, "08b"), format(255, "#010b"))\nprint(n.bit_length(), n.bit_count())\nprint(int("1101", 2), int("0b1101", 0))',
            expect: '0b1101 1101\n00001101 0b11111111\n4 3\n13 13',
            desc: '<code>bin()</code> 은 앞에 <code>0b</code> 가 붙은 문자열을 줍니다. 자릿수를 맞춰 보여 주려면 <code>format(n, "08b")</code>(8자리, 앞을 0 으로 채움)가 편합니다. <code>bit_length()</code> 는 그 수를 표현하는 데 필요한 비트 수, <code>bit_count()</code> 는 1 인 비트의 개수입니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 시프트가 곱셈보다 빠른가?', html: '옛날에는 <code>x &lt;&lt; 1</code> 이 <code>x * 2</code> 보다 빨라서 일부러 시프트를 썼습니다. 지금은 컴파일러 · 인터프리터가 알아서 최적화하므로 <b>속도 차이를 노려 시프트를 쓸 이유는 거의 없습니다</b>. 2배 · 절반이 목적이면 <code>x * 2</code>, <code>x // 2</code> 라고 쓰는 편이 읽기 쉽습니다. 시프트는 "비트 자리를 옮긴다"는 뜻이 필요할 때(플래그 · 색상 · 프로토콜) 쓰세요. 참고로 <code>x &lt;&lt; -1</code> 처럼 음수만큼 밀면 <code>ValueError: negative shift count</code> 가 납니다.' }
        ],
        practice: [
          { title: '실습 4-15. 비트 연산으로 홀수 · 짝수 알아보기', level: 1,
            desc: '<p>정수를 입력받아 2진수 모양과 <code>num & 1</code> 의 값을 출력하세요. 2진수의 마지막 비트가 1 이면 홀수, 0 이면 짝수입니다.</p><p>예) 13 → <code>13 의 2진수 : 0b1101</code>, <code>13 & 1 = 1</code>, <code>홀수인가? True</code></p>',
            hint: '<code>bin(num)</code> 으로 2진수 문자열을 얻고, <code>num & 1 == 1</code> 로 홀수 여부를 확인합니다. 파이썬에서는 <code>&</code> 가 <code>==</code> 보다 먼저 계산됩니다.',
            starter: 'num = int(input("정수 : "))\n\n# TODO: 2진수, num & 1, 홀수 여부 출력\n',
            solution: 'num = int(input("정수 : "))\n\nprint(num, "의 2진수 :", bin(num))\nprint(num, "& 1 =", num & 1)\nprint("홀수인가?", num & 1 == 1)\n',
            stdin: '13\n',
            expect: '정수 : 13\n13 의 2진수 : 0b1101\n13 & 1 = 1\n홀수인가? True' },
          { title: '실습 4-16. xor 로 대소문자 바꾸기', level: 2,
            desc: '<p>영문자 한 글자를 입력받아 대문자면 소문자로, 소문자면 대문자로 바꿔 출력하세요. Code04-03 처럼 <code>^ 32</code> 를 사용합니다.</p><p>예) <code>g</code> → <code>g → G</code></p>',
            hint: '<code>ord()</code> 로 코드값을 얻고 <code>^ 32</code> 를 한 다음 <code>chr()</code> 로 다시 문자로 바꿉니다.',
            starter: 'ch = input("영문자 한 글자 : ")\n\n# TODO: ord(), ^, chr() 사용\n',
            solution: 'ch = input("영문자 한 글자 : ")\n\ncode = ord(ch) ^ 32\nprint(ch, "→", chr(code))\n',
            stdin: 'g\n',
            expect: '영문자 한 글자 : g\ng → G' },
          { title: '실습 4-17. 시프트로 2의 거듭제곱 표 만들기', level: 1,
            desc: '<p><code>1 &lt;&lt; i</code> 를 이용해 2⁰ 부터 2¹⁰ 까지 출력하세요. 각 줄은 <code>1 &lt;&lt; 3 = 8</code> 처럼 씁니다.</p>',
            hint: 'Code04-04 의 <code>for i in range(…)</code> 를 참고하세요. 0 부터 10 까지는 <code>range(0, 11)</code> 입니다.',
            starter: 'for i in range(0, 11) :\n    # TODO: 1 << i 를 출력\n    pass\n',
            solution: 'for i in range(0, 11) :\n    print("1 << %d = %d" % (i, 1 << i))\n',
            expect: '1 << 0 = 1\n1 << 1 = 2\n1 << 2 = 4\n1 << 3 = 8\n1 << 4 = 16\n1 << 5 = 32\n1 << 6 = 64\n1 << 7 = 128\n1 << 8 = 256\n1 << 9 = 512\n1 << 10 = 1024' },
          { title: '실습 4-18. RGB 색상 합치고 분해하기', level: 2,
            desc: '<p>빨강 · 초록 · 파랑 값(0~255)을 입력받아 <b>24비트 색상 값 하나</b>로 합치고, 그 값을 10진수 · 16진수 · 2진수로 출력한 뒤 다시 세 성분으로 분해해 보이세요.</p><p>예) 52, 152, 219 → 색상 값 3447003, 16진수 0x3498db</p>',
            hint: '합치기는 <code>(r &lt;&lt; 16) | (g &lt;&lt; 8) | b</code>, 분해는 <code>(color &gt;&gt; 16) &amp; 0xFF</code> 처럼 <b>시프트로 옮기고 마스크로 자르기</b>입니다. 출력 서식은 <code>format(color, "#08x")</code>(16진수), <code>format(color, "024b")</code>(2진수)를 쓰세요.',
            starter: 'r = int(input("빨강(0~255) : "))\ng = int(input("초록(0~255) : "))\nb = int(input("파랑(0~255) : "))\n\n# TODO: 시프트와 | 로 합치기\ncolor = 0\n\nprint("색상 값 :", color)\n',
            solution: 'r = int(input("빨강(0~255) : "))\ng = int(input("초록(0~255) : "))\nb = int(input("파랑(0~255) : "))\n\ncolor = (r << 16) | (g << 8) | b\n\nprint("색상 값 :", color)\nprint("16진수 :", format(color, "#08x"))\nprint("2진수 :", format(color, "024b"))\nprint("다시 분해 :", (color >> 16) & 0xFF, (color >> 8) & 0xFF, color & 0xFF)\n',
            stdin: '52\n152\n219\n',
            expect: '빨강(0~255) : 52\n초록(0~255) : 152\n파랑(0~255) : 219\n색상 값 : 3447003\n16진수 : 0x3498db\n2진수 : 001101001001100011011011\n다시 분해 : 52 152 219' },
          { title: '🚀 프로젝트 4-19. 비트 플래그로 만드는 권한 관리', level: 3,
            desc: '<p>파일 권한 시스템을 비트 플래그로 만들어 보세요. 정수 하나로 네 가지 권한을 관리합니다.</p><ul><li><b>권한 상수</b>: 읽기 1, 쓰기 2, 실행 4, 관리자 8 (<code>READ, WRITE, EXEC, ADMIN = 1, 2, 4, 8</code>)</li><li><b>입력</b>: 현재 권한(정수), 추가할 권한(정수), 제거할 권한(정수)</li><li>현재 · 추가 후 · 제거 후 권한을 <b>4자리 2진수</b>로 출력 (<code>format(perm, "04b")</code>)</li><li>추가는 <code>|=</code>, 제거는 <code>&amp;= ~</code> 로 처리</li><li>마지막에 네 권한을 각각 True / False 로, 가진 권한 개수도 출력</li></ul><pre>현재 권한(정수) : 3\n추가할 권한(정수) : 4\n제거할 권한(정수) : 2\n현재   : 0011\n추가 후 : 0111\n제거 후 : 0101\n읽기 : True\n쓰기 : False\n실행 : True\n관리자 : False\n가진 권한 개수 : 2</pre><p><b>여기까지 했다면</b> ① 권한을 <code>^=</code> 로 토글하는 기능 추가, ② 리눅스처럼 <code>rwx</code> 문자열로 표시하기, ③ 표준 라이브러리 <code>enum.Flag</code> 로 다시 만들어 보기에 도전해 보세요.</p>',
            hint: '권한 검사는 <code>perm &amp; READ != 0</code> 입니다(0 이 아니면 그 비트가 켜져 있다는 뜻). 제거할 때 <code>~remove</code> 는 "지울 자리만 0, 나머지는 1"인 마스크가 되어 다른 권한을 건드리지 않습니다. 켜진 비트 수는 <code>perm.bit_count()</code>.',
            starter: '## 권한 상수 (비트 플래그) ##\nREAD, WRITE, EXEC, ADMIN = 1, 2, 4, 8\n\n## 입력 부분 ##\nperm = int(input("현재 권한(정수) : "))\nadd = int(input("추가할 권한(정수) : "))\nremove = int(input("제거할 권한(정수) : "))\n\n## 계산 부분 ##\nprint("현재   :", format(perm, "04b"))\n# TODO: |= 로 추가, &= ~ 로 제거\n\n## 출력 부분 ##\nprint("읽기 :", perm & READ != 0)\n',
            solution: '## 권한 상수 (비트 플래그) ##\nREAD, WRITE, EXEC, ADMIN = 1, 2, 4, 8\n\n## 입력 부분 ##\nperm = int(input("현재 권한(정수) : "))\nadd = int(input("추가할 권한(정수) : "))\nremove = int(input("제거할 권한(정수) : "))\n\n## 계산 부분 ##\nprint("현재   :", format(perm, "04b"))\nperm |= add\nprint("추가 후 :", format(perm, "04b"))\nperm &= ~remove\nprint("제거 후 :", format(perm, "04b"))\n\n## 출력 부분 ##\nprint("읽기 :", perm & READ != 0)\nprint("쓰기 :", perm & WRITE != 0)\nprint("실행 :", perm & EXEC != 0)\nprint("관리자 :", perm & ADMIN != 0)\nprint("가진 권한 개수 :", perm.bit_count())\n',
            stdin: '3\n4\n2\n',
            expect: '현재 권한(정수) : 3\n추가할 권한(정수) : 4\n제거할 권한(정수) : 2\n현재   : 0011\n추가 후 : 0111\n제거 후 : 0101\n읽기 : True\n쓰기 : False\n실행 : True\n관리자 : False\n가진 권한 개수 : 2' }
        ],
        quiz: [
          { q: '<code>print(10 &amp; 7, 10 | 7, 10 ^ 7)</code> 의 결과는?', options: ['2 15 13', '15 2 13', '2 13 15', '17 3 1000'], answer: 0,
            explain: '1010 & 0111 = 0010(2), 1010 | 0111 = 1111(15), 1010 ^ 0111 = 1101(13).' },
          { q: '<code>print(2 ^ 3)</code> 의 결과는?', options: ['8', '9', '1', '6'], answer: 2,
            explain: '<code>^</code> 는 제곱이 아니라 xor 입니다. 10 ^ 11 = 01 → 1. 제곱은 <code>2 ** 3</code>.' },
          { q: '<code>a = 20</code> 일 때 <code>~a + 1</code> 의 값은?', options: ['21', '-20', '-21', '19'], answer: 1,
            explain: '비트 부정 후 1 을 더한 2의 보수는 그 수의 음수입니다.' },
          { q: '<code>print(3 &lt;&lt; 4, 100 &gt;&gt; 2)</code> 의 결과는?', options: ['48 25', '12 400', '7 98', '81 50'], answer: 0,
            explain: '3 × 2⁴ = 48, 100 // 2² = 25.' },
          { q: "<code>chr(ord('b') ^ 32)</code> 의 결과는?", options: ["'B'", "'b'", "'c'", '98'], answer: 0,
            explain: '소문자와 대문자는 코드값이 32 차이이며, 32 를 xor 하면 그 비트가 뒤집혀 대문자 B 가 됩니다.' },
          { q: '<code>READ, WRITE = 1, 2</code> 이고 <code>perm = 3</code> 일 때, <b>쓰기 권한만 제거</b>하는 식은?', options: ['<code>perm -= WRITE</code>', '<code>perm &amp;= ~WRITE</code>', '<code>perm |= WRITE</code>', '<code>perm ^= READ</code>'], answer: 1,
            explain: '<code>~WRITE</code> 는 쓰기 자리만 0 이고 나머지는 1 인 마스크라, <code>&amp;</code> 하면 그 비트만 꺼지고 다른 권한은 그대로 남습니다. (<code>-=</code> 는 권한이 없을 때 값이 망가집니다.)' }
        ],
        slides: [
          { layout: 'title', title: '비트 연산자', subtitle: '& · | · ^ · ~ · << · >>', badge: 'Chapter 04 · 4교시',
            notes: '<p>비트 연산자는 초보자에게 가장 어려운 부분입니다. 2진수 복습에 충분히 시간을 쓰고, 모든 예를 4비트 · 8비트 그림으로 설명합니다.</p><p>"어디에 쓰나?" 질문이 나오면: 그래픽 색상 처리, 네트워크 주소, 권한 플래그, 암호화 등.</p>' },
          { layout: 'code', repl: true, title: '2진수 · 16진수 복습', code: 'bin(10)\nbin(7)\nhex(255)\n0b1010\n0xFF',
            points: ['<code>bin()</code> 2진수 문자열', '<code>hex()</code> 16진수 문자열', '<code>0b</code> · <code>0x</code> 로 직접 쓰기', '16진수 1자리 = 4비트'],
            notes: '<p>칠판에 8 4 2 1 자리값을 쓰고 10 = 1010, 7 = 0111 을 함께 변환합니다. 이 두 수가 이후 예제에서 계속 쓰입니다.</p>' },
          { layout: 'table', title: '비트 연산자의 종류', lead: '같은 자리의 비트끼리 계산', head: ['연산자', '의미', '규칙'], rows: [
            ['<code>&amp;</code>', '비트 논리곱', '둘 다 1 이면 1'], ['<code>|</code>', '비트 논리합', '하나라도 1 이면 1'],
            ['<code>^</code>', '배타적 논리합', '다르면 1, 같으면 0'], ['<code>~</code>', '비트 부정', '0 ↔ 1 뒤집기'],
            ['<code>&lt;&lt;</code>', '왼쪽 시프트', '×2ⁿ'], ['<code>&gt;&gt;</code>', '오른쪽 시프트', '÷2ⁿ (몫)']
          ], notes: '<p>and/or 와 &/| 의 차이: and 는 True/False, & 는 정수 결과. "비트 연산은 0 과 1 뿐이니 0 은 False, 1 은 True 로 보면 규칙은 같다"고 설명합니다.</p>' },
          { layout: 'diagram', title: '비트 논리곱 10 & 7', html: bitFig('&amp;', '1010', '0111', '0010', '10', '7', '2', '각 비트별로 and'), caption: '그림 4-2 — 둘 다 1 인 자리만 1',
            notes: '<p>자리마다 손가락으로 짚으며 "둘 다 1?" 을 묻습니다. 셋째 자리만 1 → 0010 = 2.</p><p>이어서 123 & 456 = 72 는 자릿수가 달라 앞을 0 으로 채운다는 점만 언급합니다.</p>' },
          { layout: 'two', title: '| 와 ^', left: { title: '비트 논리합 |', code: 'print(10 | 7, 123 | 456)\nprint(0xFFFF | 0x0000)\nprint(hex(0xFFFF | 0x0000))' }, right: { title: '배타적 논리합 ^', code: 'print(10 ^ 7, 123 ^ 456)\nprint(0xFFFF ^ 0x0000)\nprint(2 ^ 3, 2 ** 3)' },
            notes: '<p>결과: 왼쪽 15 507 / 65535 / 0xffff, 오른쪽 13 435 / 65535 / 1 8.</p><p><code>2 ^ 3</code> 이 8 이 아니라 1 이라는 점을 꼭 보여 줍니다(흔한 실수).</p>' },
          { layout: 'diagram', title: '배타적 논리합 10 ^ 7', html: bitFig('^', '1010', '0111', '1101', '10', '7', '13', '각 비트별로 xor'), caption: '그림 4-4 — 두 비트가 다르면 1',
            notes: '<p>xor 는 "다르면 1". 둘째 · 넷째 자리처럼 서로 다른 곳만 1 이 됩니다.</p>' },
          { layout: 'code', title: 'Code04-03. 마스크 활용', code: 'a = ord(\'A\')\nmask = 0x0F\n\nprint("%x & %x = %x" % (a, mask, a & mask))\nprint("%X | %X = %X" % (a, mask, a | mask))\n\nmask = ord(\'a\') - ord(\'A\')\n\nb = a ^ mask\nprint("%c ^ %d = %c" % (a, mask, b))\na = b ^ mask\nprint("%c ^ %d = %c" % (b, mask, a))',
            points: ['0x0F = 0000 1111', '& 마스크: 뒤 4비트만 남김', '| 마스크: 뒤 4비트를 1111 로', '^ 32: 대소문자 전환'],
            notes: '<p>출력: <code>41 & f = 1</code>, <code>41 | F = 4F</code>, <code>A ^ 32 = a</code>, <code>a ^ 32 = A</code>.</p><p>교재 5행 서식 문자열의 & 는 | 의 오타라 고쳐 넣었다고 알려 줍니다. %x, %X, %c 서식도 짧게 설명합니다.</p>' },
          { layout: 'diagram', title: '마스크 0x0F 의 효과', html: bitFig('&amp;', ['0100', '0001'], ['0000', '1111'], ['0000', '0001'], "'A' = 0x41", '마스크 0x0F', '0x01'), caption: '그림 4-5 — & 0x0F 는 앞 4비트를 지우고 뒤 4비트만 남긴다 (| 0x0F 는 뒤 4비트를 1111 로)',
            notes: '<p>| 마스크(그림 4-6)는 학생 문서에 그림이 있습니다. 결과 0x4F 를 직접 계산하게 해 봅니다.</p>' },
          { layout: 'code', repl: true, title: '비트 부정 ~ 과 2의 보수', code: 'a = 12345\n~a + 1\n~a',
            points: ['~ : 모든 비트 뒤집기 (1의 보수)', '1의 보수 + 1 = 2의 보수', '<code>~a + 1 == -a</code>', '<code>~a == -a - 1</code>'],
            notes: '<p>컴퓨터가 음수를 2의 보수로 저장한다는 사실만 이해하면 충분합니다. 8비트 그림(학생 문서)으로 12 → -12 를 보여 줍니다.</p>' },
          { layout: 'diagram', title: '왼쪽 시프트 26 << 2', html: shiftFig('L', '00011010', 2, '26', '104'), caption: '그림 4-7 — 한 칸마다 ×2, 2칸이면 ×4',
            notes: '<p>10진수에서 오른쪽에 0 을 붙이면 ×10 이 되듯, 2진수에서는 ×2 가 된다는 비유가 효과적입니다.</p>' },
          { layout: 'diagram', title: '오른쪽 시프트 26 >> 2', html: shiftFig('R', '00011010', 2, '26', '6'), caption: '그림 4-8 — 한 칸마다 ÷2 (몫), 밀려난 비트는 사라짐',
            notes: '<p>26 ÷ 4 = 6.5 → 몫 6. 밀려난 <code>10</code> 두 비트가 나머지 2 에 해당한다는 것도 짚어 줄 수 있습니다.</p>' },
          { layout: 'code', title: 'Code04-04. 시프트 반복', code: 'a = 100\nresult = 0\ni = 0\n\nfor i in range(1, 5) :\n    result = a << i\n    print("%d << %d = %d" % (a, i, result))\n\nfor i in range(1, 5) :\n    result = a >> i\n    print("%d >> %d = %d" % (a, i, result))',
            points: ['200 400 800 1600', '50 25 12 6', '<code>range(1, 5)</code> → 1, 2, 3, 4'],
            notes: '<p>for 문은 아직 배우지 않았으므로 "i 가 1 부터 4 까지 바뀌며 두 줄을 반복"이라고만 설명합니다.</p>' },
          { layout: 'code', title: '실전! 비트 플래그로 권한 관리', code: 'READ, WRITE, EXEC = 1, 2, 4\n\nperm = READ | WRITE\nprint(perm, format(perm, "03b"))\nprint("읽기?", perm & READ != 0)\nprint("실행?", perm & EXEC != 0)\n\nperm |= EXEC\nperm &= ~WRITE\nprint(format(perm, "03b"), perm.bit_count())',
            points: ['상수는 1, 2, 4, 8 … (비트 하나씩)', '켜기 <code>|=</code> · 끄기 <code>&amp;= ~</code>', '검사 <code>perm &amp; READ != 0</code>', '리눅스 <code>chmod 755</code> 가 바로 이것'],
            notes: '<p>"스위치 여러 개를 정수 하나에 담는다"가 핵심입니다. 결과: <code>3 011</code> / True / False / <code>101 2</code>.</p><p>발문: "권한을 뺄 때 <code>perm -= WRITE</code> 로 하면 안 될까?" → 원래 없던 권한을 빼면 값이 망가집니다. 그래서 <code>&amp;= ~</code> 를 씁니다. 실무에서는 <code>enum.Flag</code> 를 쓴다는 것도 한 줄 언급하세요.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>print(10 &amp; 7, 10 | 7, 10 ^ 7)</code> 의 결과는?', options: ['2 15 13', '15 2 13', '2 13 15', '17 3 1000'], answer: 0,
            explain: '1010 과 0111 을 비트별로: & → 0010, | → 1111, ^ → 1101.',
            notes: '<p>종이에 4비트로 적어 풀게 합니다.</p>' },
          { layout: 'practice', title: '🚀 프로젝트 4-19. 권한 관리', desc: '현재 권한 · 추가할 권한 · 제거할 권한을 입력받아 <b>4자리 2진수</b>로 변화를 보여 주고, 네 권한(읽기 1 · 쓰기 2 · 실행 4 · 관리자 8)의 보유 여부를 출력하세요.',
            starter: 'READ, WRITE, EXEC, ADMIN = 1, 2, 4, 8\n\nperm = int(input("현재 권한(정수) : "))\nadd = int(input("추가할 권한(정수) : "))\nremove = int(input("제거할 권한(정수) : "))\n\n# TODO: |= 로 추가, &= ~ 로 제거\n',
            solution: 'READ, WRITE, EXEC, ADMIN = 1, 2, 4, 8\n\nperm = int(input("현재 권한(정수) : "))\nadd = int(input("추가할 권한(정수) : "))\nremove = int(input("제거할 권한(정수) : "))\n\nperm |= add\nperm &= ~remove\nprint("최종 :", format(perm, "04b"))\n\nprint("읽기 :", perm & READ != 0)\nprint("쓰기 :", perm & WRITE != 0)\nprint("실행 :", perm & EXEC != 0)\nprint("관리자 :", perm & ADMIN != 0)\n', stdin: '3\n4\n2\n',
            notes: '<p>입력 3, 4, 2 → 최종 0101(읽기 · 실행). 학생마다 다른 숫자를 넣어 결과를 예측하게 하면 좋습니다.</p><p>학생 문서에는 단계별 출력과 <code>bit_count()</code> 까지 포함된 전체 요구 사항이 있습니다. 여유가 없으면 추가 · 제거까지만 수업에서 하고 나머지는 과제로 냅니다.</p>' },
          { layout: 'summary', title: '4교시 정리', bullets: [
            '비트 연산 = 2진수 같은 자리끼리 계산',
            '<code>&amp;</code> 둘 다 1, <code>|</code> 하나라도 1, <code>^</code> 서로 다르면 1',
            '마스크로 원하는 비트만 남기기 · 켜기 · 뒤집기',
            '<code>~a + 1 == -a</code> (2의 보수)',
            '<code>&lt;&lt; n</code> 은 ×2ⁿ, <code>&gt;&gt; n</code> 은 ÷2ⁿ 의 몫',
            '비트 플래그: 켜기 <code>|=</code> · 끄기 <code>&amp;= ~</code> · 검사 <code>&amp;</code> · 토글 <code>^=</code>',
            '색상(RGB)은 시프트 + 마스크로 분해 · 합성'
          ], notes: '<p>다음 시간: 모든 연산자의 우선순위를 정리하고 종합 문제를 풉니다.</p>' }
        ]
      },

      /* ═════════════════════════ 4-5 ═════════════════════════ */
      {
        id: 'ch04-5',
        title: '연산자 우선순위와 종합 정리',
        minutes: 50,
        goals: [
          '여러 종류의 연산자가 섞인 식의 계산 순서를 우선순위 표로 설명할 수 있다',
          'not · and · or 의 우선순위 차이로 생기는 결과를 예측할 수 있다',
          '괄호를 사용해 의도한 계산 순서를 분명하게 나타낼 수 있다',
          '4장의 연산자를 조합해 간단한 계산 프로그램을 작성할 수 있다',
          '우선순위 때문에 생기는 대표적인 버그를 찾아 괄호로 고칠 수 있다',
          '조건 표현식과 operator 모듈이 무엇인지 설명할 수 있다'
        ],
        flow: [['우선순위 표', 8], ['섞인 식 계산해 보기', 12], ['조건 표현식 · 흔한 버그 모음', 10], ['operator 모듈 · 남은 연산자', 5], ['종합 실습 · 프로젝트', 10], ['장 정리', 5]],
        content: [
          { type: 'h', text: '연산자 우선순위' },
          { type: 'p', html: '지금까지 배운 연산자가 한 식에 섞여 있으면 어느 것부터 계산할까요? 파이썬은 연산자마다 정해진 <b>우선순위</b>가 있어서 순위가 높은 것부터 계산합니다. 순위가 같으면 왼쪽부터 계산합니다(<code>**</code> 만 오른쪽부터).' },
          { type: 'table', caption: '표 4-6 연산자 우선순위 (1 이 가장 먼저)', head: ['우선순위', '연산자', '의미'], rows: [
            ['1', '<code>() [] {}</code>', '괄호, 리스트, 딕셔너리, 세트 등'],
            ['2', '<code>**</code>', '지수(제곱)'],
            ['3', '<code>+ - ~</code>', '단항 연산자 (<code>-a</code>, <code>~a</code> 처럼 피연산자가 하나)'],
            ['4', '<code>* / % //</code>', '산술 연산자 (곱셈 · 나눗셈)'],
            ['5', '<code>+ -</code>', '산술 연산자 (덧셈 · 뺄셈)'],
            ['6', '<code>&lt;&lt; &gt;&gt;</code>', '비트 시프트 연산자'],
            ['7', '<code>&amp;</code>', '비트 논리곱'],
            ['8', '<code>^</code>', '비트 배타적 논리합'],
            ['9', '<code>|</code>', '비트 논리합'],
            ['10', '<code>&lt; &gt; &gt;= &lt;=</code>', '관계 연산자'],
            ['11', '<code>== !=</code>', '동등 연산자'],
            ['12', '<code>= %= /= //= -= += *= **=</code>', '대입 연산자'],
            ['13', '<code>not</code>', '논리 연산자'],
            ['14', '<code>and</code>', '논리 연산자'],
            ['15', '<code>or</code>', '논리 연산자'],
            ['16', '<code>if ~ else</code>', '비교식(조건 표현식)']
          ] },
          { type: 'callout', kind: 'info', title: '표를 읽는 법 — 큰 흐름만 기억하기', html: '모두 외울 필요는 없습니다. <b>괄호 → 제곱 → 산술(곱셈 · 나눗셈 → 덧셈 · 뺄셈) → 비트 → 비교 → not → and → or</b> 의 큰 흐름만 기억하고, 헷갈리면 괄호를 쓰면 됩니다. 참고로 공식 문서에서는 관계 · 동등 연산자(<code>&lt; &gt; == !=</code> 등)가 모두 같은 순위이고, 대입(<code>=</code>, <code>+=</code> …)은 식이 아니라 "문장"이라 가장 마지막에 이뤄집니다.' },
          { type: 'figure', caption: '연산자 우선순위의 큰 흐름 — 위에서 아래로 계산된다', html: (function () {
            var lv = [['( )', '괄호', 'var(--danger)'], ['**', '제곱', 'var(--warn)'], ['+x  -x  ~x', '단항', 'var(--warn)'], ['*  /  //  %', '곱셈 · 나눗셈', 'var(--accent)'], ['+  -', '덧셈 · 뺄셈', 'var(--accent)'], ['<<  >>  &  ^  |', '비트', 'var(--accent2)'], ['<  >  <=  >=  ==  !=', '비교', 'var(--ok)'], ['not → and → or', '논리', 'var(--muted)']];
            var s = '<svg viewBox="0 0 640 380" width="100%" style="max-width:640px" font-family="sans-serif">';
            lv.forEach(function (l, i) {
              var y = 10 + i * 45, w = 560 - i * 30, x = (640 - w) / 2;
              s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="38" rx="8" fill="' + l[2] + '" opacity="0.85"/>';
              s += '<text x="' + (x + 16) + '" y="' + (y + 26) + '" font-size="19" font-weight="bold" fill="#fff" font-family="monospace">' + l[0].replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</text>';
              s += '<text x="' + (x + w - 14) + '" y="' + (y + 26) + '" text-anchor="end" font-size="16" fill="#fff">' + l[1] + '</text>';
            });
            s += '<text x="320" y="375" text-anchor="middle" font-size="15" fill="var(--muted)">위쪽이 먼저 · 같은 줄은 왼쪽부터(** 는 오른쪽부터)</text>';
            return s + '</svg>';
          })() },
          { type: 'h', text: '섞인 식 계산해 보기' },
          { type: 'code', repl: true, title: '추가 예제. 여러 연산자가 섞인 식', code: '2 + 3 * 4 ** 2\n(2 + 3) * 4 ** 2\n10 - 4 - 3\n100 // 7 % 3\n1 + 2 << 1\n5 > 3 and 2 > 4\nnot 5 > 3', expect: '>>> 2 + 3 * 4 ** 2\n50\n>>> (2 + 3) * 4 ** 2\n80\n>>> 10 - 4 - 3\n3\n>>> 100 // 7 % 3\n2\n>>> 1 + 2 << 1\n6\n>>> 5 > 3 and 2 > 4\nFalse\n>>> not 5 > 3\nFalse\n>>>',
            desc: '<code>2 + 3 * 4 ** 2</code> → 제곱 16 → 곱셈 48 → 덧셈 50. <code>10 - 4 - 3</code> 은 왼쪽부터 (10-4)-3 = 3. <code>100 // 7 % 3</code> 은 같은 순위라 왼쪽부터 14 % 3 = 2. <code>1 + 2 << 1</code> 은 덧셈이 시프트보다 먼저라 3 << 1 = 6. <code>not 5 > 3</code> 은 비교가 먼저라 <code>not True</code> = False.' },
          { type: 'figure', caption: '2 + 3 * 4 ** 2 의 계산 순서', html: `<svg viewBox="0 0 620 200" width="100%" style="max-width:620px" font-family="monospace">
  <text x="30" y="40" font-size="26" fill="var(--fg)">2 + 3 * <tspan fill="var(--warn)" font-weight="bold">4 ** 2</tspan></text>
  <text x="330" y="40" font-size="17" fill="var(--warn)">① 제곱: 16</text>
  <text x="30" y="95" font-size="26" fill="var(--fg)">2 + <tspan fill="var(--accent)" font-weight="bold">3 * 16</tspan></text>
  <text x="330" y="95" font-size="17" fill="var(--accent)">② 곱셈: 48</text>
  <text x="30" y="150" font-size="26" fill="var(--fg)"><tspan fill="var(--accent2)" font-weight="bold">2 + 48</tspan></text>
  <text x="330" y="150" font-size="17" fill="var(--accent2)">③ 덧셈: 50</text>
  <text x="30" y="192" font-size="26" font-weight="bold" fill="var(--ok)">50</text>
</svg>` },
          { type: 'callout', kind: 'warn', title: 'not · and · or 의 순서 함정', html: '논리 연산자는 <b>not → and → or</b> 순서입니다. 그래서 <code>True or True and False</code> 는 <code>True or (True and False)</code> = <b>True</b> 입니다. 왼쪽부터 계산해 <code>(True or True) and False</code> = False 로 생각하기 쉬우니, and 와 or 를 섞을 때는 괄호로 뜻을 분명히 하세요.' },
          { type: 'code', title: '추가 예제. and 와 or 를 섞을 때', code: 'print(True or True and False)\nprint((True or True) and False)\n\nage = 15\nprint(age < 13 or age >= 65 and age < 100)\nprint((age < 13 or age >= 65) and age < 100)', expect: 'True\nFalse\nFalse\nFalse',
            desc: '첫 두 줄은 괄호 위치만 다른데 결과가 다릅니다. 아래 두 줄은 이번에는 결과가 같지만, 괄호가 있는 쪽이 "13 세 미만이거나 65 세 이상이면서, 100 세 미만"이라는 뜻을 훨씬 분명하게 보여 줍니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 파이썬의 & 와 == 순서', html: 'C · 자바에서는 <code>x &amp; 1 == 0</code> 이 <code>x &amp; (1 == 0)</code> 으로 계산되어 흔한 버그가 되지만, 파이썬은 비트 연산자가 비교 연산자보다 우선순위가 높아서 <code>(x &amp; 1) == 0</code> 으로 계산됩니다. 그래도 읽는 사람을 위해 괄호를 쓰는 편이 좋습니다.' },
          { type: 'h', text: '조건 표현식 (if ~ else)' },
          { type: 'p', html: '우선순위 표의 마지막 16순위 <code>if ~ else</code> 는 조건에 따라 두 값 중 하나를 고르는 <b>식</b>입니다. <code>값1 if 조건 else 값2</code> 형태로, 조건이 참이면 값1, 거짓이면 값2 가 됩니다. 가장 늦게 계산되므로 앞뒤의 식이 모두 계산된 뒤에 선택됩니다.' },
          { type: 'code', title: '추가 예제. 조건 표현식으로 짝수 · 홀수 고르기', code: 'num = 7\nresult = "짝수" if num % 2 == 0 else "홀수"\nprint(num, "은(는)", result)\n\nnum = 10\nprint(num, "은(는)", "짝수" if num % 2 == 0 else "홀수")', expect: '7 은(는) 홀수\n10 은(는) 짝수',
            desc: '<code>num % 2 == 0</code> 이 먼저 계산되고(산술 → 비교), 그 결과로 "짝수" 또는 "홀수" 가 선택됩니다. if 문은 5장에서 자세히 배웁니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 조건 표현식은 언제 쓰나', html: '조건 표현식은 <b>두 값 중 하나를 고르는 아주 짧은 선택</b>에만 씁니다. <code>msg = "합격" if score &gt;= 60 else "불합격"</code> 처럼요. <code>"A" if s &gt;= 90 else "B" if s &gt;= 80 else "C"</code> 처럼 <b>중첩</b>하기 시작하면 읽기 어려워지므로, 그때는 5장의 <code>if ~ elif ~ else</code> 문으로 씁니다. "한 줄에 넣을 수 있다"와 "한 줄에 넣어야 한다"는 다릅니다.' },

          { type: 'h', text: '한 걸음 더 ① 우선순위 때문에 생기는 흔한 버그' },
          { type: 'p', html: '우선순위를 외우는 것보다 <b>자주 틀리는 자리를 아는 것</b>이 실전에서 훨씬 도움이 됩니다. 아래 다섯 가지는 초보자는 물론 경력자도 가끔 실수하는 대표 사례입니다.' },
          { type: 'table', caption: '자주 틀리는 다섯 가지', head: ['쓴 식', '실제 계산', '의도한 식'], rows: [
            ['<code>-2 ** 2</code>', '<code>-(2 ** 2)</code> → <b>-4</b>', '<code>(-2) ** 2</code> → 4'],
            ['<code>1 + 2 &lt;&lt; 1</code>', '<code>(1 + 2) &lt;&lt; 1</code> → <b>6</b>', '<code>1 + (2 &lt;&lt; 1)</code> → 5'],
            ['<code>not a == b</code>', '<code>not (a == b)</code> (다행히 의도대로)', '더 분명하게는 <code>a != b</code>'],
            ['<code>x == 1 or 2</code>', '<code>(x == 1) or 2</code> → 항상 참', '<code>x == 1 or x == 2</code>'],
            ['<code>kor + eng + mat / 3</code>', '<code>kor + eng + (mat / 3)</code>', '<code>(kor + eng + mat) / 3</code>']
          ] },
          { type: 'code', title: '추가 예제. 흔한 버그를 눈으로 확인하기', code: 'print(-2 ** 2, (-2) ** 2)\nprint(1 + 2 << 1, 1 + (2 << 1))\nprint(not 1 == 2, not (1 == 2))\nprint(True or True and False, (True or True) and False)\nprint(0.1 + 0.2 == 0.3, round(0.1 + 0.2, 2) == 0.3)',
            expect: '-4 4\n6 5\nTrue True\nTrue False\nFalse True',
            desc: '각 줄의 왼쪽이 "괄호 없이 쓴 결과", 오른쪽이 "괄호를 넣은 결과"입니다. 두 값이 다른 줄(1 · 2 · 4행)이 바로 버그가 숨는 자리입니다. 마지막 줄은 우선순위가 아니라 <b>실수 오차</b> 때문에 갈리는 경우입니다.' },
          { type: 'code', title: '추가 예제. 평균 계산의 괄호 한 쌍', code: 'kor, eng, mat = 90, 85, 95\n\nprint(kor + eng + mat / 3)\nprint((kor + eng + mat) / 3)\nprint(round((kor + eng + mat) / 3, 1))\nprint(max(kor, eng, mat), min(kor, eng, mat), sum([kor, eng, mat]))',
            expect: '206.66666666666666\n90.0\n90.0\n95 85 270',
            desc: '첫 줄은 수학 점수만 3 으로 나눈 뒤 더한 값입니다. 오류도 없이 "그럴듯한 숫자"가 나오기 때문에 더 위험합니다. <b>평균을 구할 때는 괄호를 반드시</b> 씁니다.' },
          { type: 'callout', kind: 'tip', title: '괄호와 공백으로 의도를 드러내기', html: '파이썬 스타일 가이드(PEP 8)는 <b>우선순위가 높은 연산자 주위의 공백을 좁혀</b> 계산 순서를 눈에 보이게 하라고 권합니다. <code>a*b + c*d</code>, <code>x**2 + y**2</code> 처럼요. 그리고 "괄호가 없어도 되는데 넣으면 초보 같다"는 생각은 버리세요. <b>읽는 사람이 1초라도 멈칫한다면 괄호를 넣는 것이 옳습니다.</b>' },

          { type: 'h', text: '한 걸음 더 ② operator 모듈 — 연산자를 함수처럼 쓰기' },
          { type: 'p', html: '<code>+</code> 나 <code>*</code> 같은 연산자는 사실 내부적으로 함수 호출입니다. 표준 라이브러리 <b>operator 모듈</b>은 그 함수들을 이름으로 꺼내 쓸 수 있게 해 줍니다. "어떤 계산을 할지"를 <b>변수에 담아 나중에 정하고</b> 싶을 때(계산기 프로그램, 정렬 기준 지정 등) 쓰입니다.' },
          { type: 'code', title: '추가 예제. operator 모듈 맛보기', code: 'import operator\n\nprint(operator.add(3, 4), operator.mul(3, 4), operator.floordiv(17, 5))\nprint(operator.lt(3, 4), operator.eq("a", "a"), operator.not_(True))\nprint(operator.and_(10, 7), operator.xor(10, 7), operator.pow(2, 10))\n\ncalc = operator.mul\nprint(calc(6, 7))',
            expect: '7 12 3\nTrue True False\n2 13 1024\n42',
            desc: '<code>calc = operator.mul</code> 처럼 <b>연산 자체를 변수에 담을 수 있다</b>는 점이 핵심입니다. <code>and_</code> · <code>not_</code> 처럼 이름 뒤에 밑줄이 붙은 것은 <code>and</code>, <code>not</code> 이 파이썬의 예약어라서입니다. 지금 당장 쓰지 않더라도 "연산자도 결국 함수"라는 관점을 알아 두면 나중에 <code>sorted(…, key=…)</code> 같은 코드가 쉬워집니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 4장에서 다루지 않은 연산자들', html: '<ul><li><b>멤버 연산자</b> <code>in</code> · <code>not in</code> — "안에 들어 있는가" (<code>3 in (1, 2, 3)</code>, <code>"a" in "cat"</code>). 7장 리스트에서 본격적으로 씁니다.</li><li><b>동일성 연산자</b> <code>is</code> · <code>is not</code> — 3교시에서 배운 "같은 객체인가".</li><li><b>대입 표현식</b> <code>:=</code> (왈러스 연산자, 3.8+) — 값을 변수에 넣으면서 동시에 그 값을 쓰는 식. <code>if (n := len(s)) &gt; 10 :</code> 처럼 씁니다. 편리하지만 남용하면 읽기 어려우니 나중에.</li><li>모두 우선순위 표에서 비교 연산자와 같은 줄(<code>in</code>, <code>is</code>)이거나 가장 낮은 쪽(<code>:=</code>)에 있습니다.</li></ul>' },

          { type: 'h', text: '4장 연산자 한눈에 보기' },
          { type: 'table', caption: '4장에서 배운 연산자 정리', head: ['분류', '연산자', '결과', '예'], rows: [
            ['산술', '<code>+ - * / // % **</code>', '숫자', '<code>7 // 2</code> → 3'],
            ['대입', '<code>= += -= *= /= //= %= **=</code>', '(변수에 저장)', '<code>a += 1</code>'],
            ['관계', '<code>== != &gt; &lt; &gt;= &lt;=</code>', 'True/False', '<code>3 &gt; 2</code> → True'],
            ['논리', '<code>and or not</code>', 'True/False(또는 피연산자)', '<code>not True</code> → False'],
            ['비트', '<code>&amp; | ^ ~ &lt;&lt; &gt;&gt;</code>', '정수', '<code>10 &amp; 7</code> → 2'],
            ['형 변환', '<code>int() float() str()</code>', '바뀐 자료형', '<code>int("5")</code> → 5'],
            ['멤버 · 동일성', '<code>in</code> <code>not in</code> <code>is</code> <code>is not</code>', 'True/False', '<code>3 in (1, 2, 3)</code> → True'],
            ['조건 표현식', '<code>값1 if 조건 else 값2</code>', '두 값 중 하나', '<code>"짝수" if n % 2 == 0 else "홀수"</code>']
          ] }
        ],
        practice: [
          { title: '실습 4-20. 식의 계산 순서 예측하기', level: 1,
            desc: '<p>아래 코드의 각 줄 결과를 <b>먼저 공책에 예측</b>한 다음 실행해서 확인하세요. 예측이 틀린 줄은 괄호를 넣어 계산 순서를 표시해 보세요.</p>',
            hint: '제곱 → 곱셈 · 나눗셈 → 덧셈 · 뺄셈 → 시프트 → 비트 → 비교 → not → and → or 순서입니다.',
            starter: 'print(10 + 2 * 3 ** 2)\nprint(20 // 3 * 3 + 20 % 3)\nprint(8 >> 1 + 1)\nprint(3 + 4 > 6 and not 1 == 2)\nprint(0 or 5 > 3 and 2)\n',
            solution: 'print(10 + 2 * 3 ** 2)            # 10 + (2 * (3 ** 2)) = 28\nprint(20 // 3 * 3 + 20 % 3)       # ((20 // 3) * 3) + (20 % 3) = 18 + 2 = 20\nprint(8 >> 1 + 1)                 # 8 >> (1 + 1) = 2\nprint(3 + 4 > 6 and not 1 == 2)   # (7 > 6) and (not False) = True\nprint(0 or 5 > 3 and 2)           # 0 or (True and 2) = 2\n',
            expect: '28\n20\n2\nTrue\n2' },
          { title: '실습 4-21. 괄호로 버그 고치기', level: 1,
            desc: '<p>아래 네 줄은 모두 <b>의도와 다른 결과</b>가 나옵니다. 괄호를 넣어(또는 식을 바꿔) 의도대로 고치세요.</p><ol><li>세 과목 평균을 구하려 했다 → <code>90.0</code> 이 나와야 한다</li><li>-2 의 제곱을 구하려 했다 → <code>4</code> 가 나와야 한다</li><li>2 를 4배(<code>&lt;&lt; 2</code>)한 값에 1 을 더하려 했다 → <code>9</code> 가 나와야 한다</li><li>x 가 1 또는 2 인지 묻고 싶었다 (x = 3) → <code>False</code> 가 나와야 한다</li></ol>',
            hint: '① 덧셈이 먼저 끝나야 하니 괄호. ② <code>-2 ** 2</code> 는 <code>-(2 ** 2)</code>. ③ 덧셈이 시프트보다 <b>먼저</b> 계산되므로 시프트 쪽에 괄호가 필요합니다. ④ <code>x == 1 or 2</code> 는 <code>(x == 1) or 2</code> 로 계산됩니다.',
            starter: 'kor, eng, mat = 90, 85, 95\nprint(kor + eng + mat / 3)\n\nprint(-2 ** 2)\n\nprint(1 + 2 << 2)\n\nx = 3\nprint(x == 1 or 2)\n',
            solution: 'kor, eng, mat = 90, 85, 95\nprint((kor + eng + mat) / 3)\n\nprint((-2) ** 2)\n\nprint(1 + (2 << 2))\n\nx = 3\nprint(x == 1 or x == 2)\n',
            expect: '90.0\n4\n9\nFalse' },
          { title: '실습 4-22. 각 자리 숫자의 합', level: 2,
            desc: '<p>세 자리 정수를 입력받아 백의 자리, 십의 자리, 일의 자리 숫자와 그 합을 출력하세요.</p><p>예) 357 → <code>백 : 3, 십 : 5, 일 : 7</code>, <code>합계 : 15</code></p>',
            hint: '백의 자리는 <code>num // 100</code>, 십의 자리는 <code>num // 10 % 10</code>, 일의 자리는 <code>num % 10</code> 입니다. <code>//</code> 와 <code>%</code> 는 같은 순위라 왼쪽부터 계산됩니다.',
            starter: 'num = int(input("세 자리 정수 : "))\n\n# TODO: 각 자리 숫자 구하기\nd100 = 0\nd10 = 0\nd1 = 0\n\nprint("백 : %d, 십 : %d, 일 : %d" % (d100, d10, d1))\n',
            solution: 'num = int(input("세 자리 정수 : "))\n\nd100 = num // 100\nd10 = num // 10 % 10\nd1 = num % 10\n\nprint("백 : %d, 십 : %d, 일 : %d" % (d100, d10, d1))\nprint("합계 :", d100 + d10 + d1)\n',
            stdin: '357\n',
            expect: '세 자리 정수 : 357\n백 : 3, 십 : 5, 일 : 7\n합계 : 15' },
          { title: '실습 4-23. 성적 요약 (내장 함수 + 조건 표현식)', level: 2,
            desc: '<p>국어 · 영어 · 수학 점수를 입력받아 다음을 출력하세요.</p><ul><li>합계와 평균(소수 첫째 자리까지)</li><li>최고 점수와 최저 점수 (<code>max()</code>, <code>min()</code>)</li><li>평균 60 점 이상이면 <code>합격</code>, 아니면 <code>불합격</code> (<b>조건 표현식</b> 사용)</li><li>전 과목이 60 점 이상인지 True / False</li></ul>',
            hint: '평균은 <code>(kor + eng + mat) / 3</code> — <b>괄호</b>를 빠뜨리면 수학 점수만 나눠집니다. 판정은 <code>"합격" if avg &gt;= 60 else "불합격"</code>, 전 과목 검사는 <code>min(kor, eng, mat) &gt;= 60</code> 한 줄이면 됩니다.',
            starter: 'kor = int(input("국어 : "))\neng = int(input("영어 : "))\nmat = int(input("수학 : "))\n\n# TODO: 합계 · 평균 · 최고 · 최저 · 판정\ntotal = 0\navg = 0\n\nprint("합계 :", total)\n',
            solution: 'kor = int(input("국어 : "))\neng = int(input("영어 : "))\nmat = int(input("수학 : "))\n\ntotal = kor + eng + mat\navg = total / 3\n\nprint("합계 :", total)\nprint("평균 : %.1f" % avg)\nprint("최고 : %d, 최저 : %d" % (max(kor, eng, mat), min(kor, eng, mat)))\nprint("판정 :", "합격" if avg >= 60 else "불합격")\nprint("전 과목 60점 이상?", min(kor, eng, mat) >= 60)\n',
            stdin: '90\n85\n95\n',
            expect: '국어 : 90\n영어 : 85\n수학 : 95\n합계 : 270\n평균 : 90.0\n최고 : 95, 최저 : 85\n판정 : 합격\n전 과목 60점 이상? True' },
          { title: '🚀 프로젝트 4-24. 거스름돈 최적 계산기', level: 3,
            desc: '<p>4장의 마무리 프로젝트입니다. 물건값과 낸 돈을 입력받아 <b>가장 적은 장수 · 개수</b>로 거스름돈을 주는 계산기를 만드세요.</p><ul><li><b>입력</b>: 물건값, 낸 돈 (정수)</li><li>거스름돈 = 낸 돈 − 물건값 을 먼저 출력</li><li><b>큰 단위부터</b> 50000 · 10000 · 5000 · 1000원 지폐, 500 · 100 · 50 · 10원 동전 순으로 나눈다</li><li>각 단계는 <code>divmod()</code> 한 줄로 (몫 = 장수 · 개수, 나머지 = 다음 단계로)</li><li>10원 단위로 떨어지지 않아 거슬러 줄 수 없는 돈도 출력</li><li>마지막에 <b>총 지폐 수와 총 동전 수</b>를 출력</li></ul><pre>물건값 : 17300\n낸 돈 : 100000\n거스름돈 : 82700원\n50000원 1장, 10000원 3장, 5000원 0장, 1000원 2장\n500원 1개, 100원 2개, 50원 0개, 10원 0개\n거슬러 줄 수 없는 돈 : 0원\n지폐 6장 + 동전 3개</pre><p><b>여기까지 했다면</b> ① 낸 돈이 물건값보다 적으면 "돈이 모자랍니다"를 출력하기(5장 if), ② 5만 · 1만 원권만 쓰는 ATM 버전 만들기, ③ 장수를 <code>list</code> 와 <code>for</code> 로 처리해 코드를 절반으로 줄이기(6 · 7장)에 도전해 보세요.</p>',
            hint: '<code>n50000, change = divmod(change, 50000)</code> 처럼 <b>같은 패턴을 단위만 바꿔</b> 반복하면 됩니다. 큰 단위부터 처리해야 "가장 적은 장수"가 됩니다(이것을 탐욕 알고리즘이라고 합니다). 우리나라 화폐 단위에서는 이 방법이 언제나 최적입니다.',
            starter: '## 입력 부분 ##\nprice = int(input("물건값 : "))\npaid = int(input("낸 돈 : "))\n\nchange = paid - price\nprint("거스름돈 : %d원" % change)\n\n## 계산 부분 ##\nn50000, change = divmod(change, 50000)\n# TODO: 10000, 5000, 1000, 500, 100, 50, 10 도 같은 방식으로\n',
            solution: '## 입력 부분 ##\nprice = int(input("물건값 : "))\npaid = int(input("낸 돈 : "))\n\nchange = paid - price\nprint("거스름돈 : %d원" % change)\n\n## 계산 부분 ##\nn50000, change = divmod(change, 50000)\nn10000, change = divmod(change, 10000)\nn5000, change = divmod(change, 5000)\nn1000, change = divmod(change, 1000)\nn500, change = divmod(change, 500)\nn100, change = divmod(change, 100)\nn50, change = divmod(change, 50)\nn10, change = divmod(change, 10)\n\n## 출력 부분 ##\nprint("50000원 %d장, 10000원 %d장, 5000원 %d장, 1000원 %d장" % (n50000, n10000, n5000, n1000))\nprint("500원 %d개, 100원 %d개, 50원 %d개, 10원 %d개" % (n500, n100, n50, n10))\nprint("거슬러 줄 수 없는 돈 : %d원" % change)\nprint("지폐 %d장 + 동전 %d개" % (n50000 + n10000 + n5000 + n1000, n500 + n100 + n50 + n10))\n',
            stdin: '17300\n100000\n',
            expect: '물건값 : 17300\n낸 돈 : 100000\n거스름돈 : 82700원\n50000원 1장, 10000원 3장, 5000원 0장, 1000원 2장\n500원 1개, 100원 2개, 50원 0개, 10원 0개\n거슬러 줄 수 없는 돈 : 0원\n지폐 6장 + 동전 3개' }
        ],
        quiz: [
          { q: '<code>print(2 + 3 * 4 ** 2)</code> 의 결과는?', options: ['50', '400', '146', '80'], answer: 0,
            explain: '4 ** 2 = 16 → 3 * 16 = 48 → 2 + 48 = 50.' },
          { q: '<code>print(True or True and False)</code> 의 결과는?', options: ['True', 'False', 'None', '오류'], answer: 0,
            explain: 'and 가 먼저: True and False = False → True or False = True.' },
          { q: '다음 중 우선순위가 <b>가장 높은</b> 연산자는?', options: ['<code>and</code>', '<code>==</code>', '<code>**</code>', '<code>+</code>'], answer: 2,
            explain: '괄호를 빼면 제곱 <code>**</code> 이 가장 먼저 계산됩니다.' },
          { q: '<code>print(1 + 2 &lt;&lt; 1)</code> 의 결과는?', options: ['5', '6', '3', '4'], answer: 1,
            explain: '덧셈이 시프트보다 먼저: (1 + 2) << 1 = 3 × 2 = 6.' },
          { q: '<code>x = 5</code> 일 때 <code>"양수" if x &gt; 0 else "양수 아님"</code> 의 값은?', options: ['"양수"', '"양수 아님"', 'True', '5'], answer: 0,
            explain: '조건 <code>x > 0</code> 이 True 이므로 if 앞의 값이 선택됩니다.' },
          { q: '세 과목 점수 90, 85, 95 의 평균을 구하려고 <code>print(90 + 85 + 95 / 3)</code> 라고 썼다. 무엇이 잘못됐나?', options: ['나눗셈은 <code>//</code> 를 써야 한다', '95 만 3 으로 나뉘어 버린다', '실수라서 오차가 생긴다', '잘못된 곳이 없다'], answer: 1,
            explain: '나눗셈이 덧셈보다 먼저 계산되어 <code>90 + 85 + (95 / 3)</code> 이 됩니다. 오류가 나지 않고 그럴듯한 숫자가 나오기 때문에 더 위험합니다. <code>(90 + 85 + 95) / 3</code> 처럼 괄호가 필요합니다.' }
        ],
        slides: [
          { layout: 'title', title: '연산자 우선순위', subtitle: '섞여 있는 식은 어디부터?', badge: 'Chapter 04 · 5교시',
            notes: '<p>도입 발문: "<code>2 + 3 * 4 ** 2</code> 는 얼마일까?" 답을 여러 개 받아 칠판에 적어 두고, 수업 중에 확인합니다.</p>' },
          { layout: 'table', title: '연산자 우선순위 (표 4-6 요약)', lead: '위쪽이 먼저, 헷갈리면 괄호', head: ['순위', '연산자', '의미'], rows: [
            ['1', '<code>()</code>', '괄호'], ['2', '<code>**</code>', '제곱'], ['3', '<code>+x -x ~x</code>', '단항'],
            ['4 · 5', '<code>* / // %</code> → <code>+ -</code>', '산술'], ['6~9', '<code>&lt;&lt; &gt;&gt;</code> → <code>&amp;</code> → <code>^</code> → <code>|</code>', '비트'],
            ['10 · 11', '<code>&lt; &gt; &lt;= &gt;= == !=</code>', '비교'], ['13~15', '<code>not</code> → <code>and</code> → <code>or</code>', '논리'], ['16', '<code>if ~ else</code>', '조건 표현식']
          ], notes: '<p>교재 표 4-6 은 16단계입니다. 학생 문서에 전체 표가 있으니 슬라이드에서는 큰 흐름만 봅니다.</p><p>대입 연산자(12순위)는 사실 식이 아니라 문장이어서 항상 가장 마지막에 일어난다고 보충합니다.</p>' },
          { layout: 'diagram', title: '2 + 3 * 4 ** 2', html: `<svg viewBox="0 0 640 220" width="100%" font-family="monospace">
  <text x="30" y="50" font-size="30" fill="var(--fg)">2 + 3 * <tspan fill="var(--warn)" font-weight="bold">4 ** 2</tspan></text><text x="380" y="50" font-size="22" fill="var(--warn)">① 16</text>
  <text x="30" y="110" font-size="30" fill="var(--fg)">2 + <tspan fill="var(--accent)" font-weight="bold">3 * 16</tspan></text><text x="380" y="110" font-size="22" fill="var(--accent)">② 48</text>
  <text x="30" y="170" font-size="30" fill="var(--accent2)" font-weight="bold">2 + 48</text><text x="380" y="170" font-size="22" fill="var(--accent2)">③ 50</text>
</svg>`, caption: '제곱 → 곱셈 → 덧셈',
            notes: '<p>도입에서 적어 둔 답들과 비교합니다. 괄호로 <code>(2 + 3) * 4 ** 2</code> 를 쓰면 80 이 된다는 것도 보여 줍니다.</p>' },
          { layout: 'code', repl: true, title: '섞인 식 확인하기', code: '2 + 3 * 4 ** 2\n10 - 4 - 3\n100 // 7 % 3\n1 + 2 << 1\nnot 5 > 3',
            points: ['50 / 3 / 2 / 6 / False', '같은 순위는 왼쪽부터', '산술이 시프트보다 먼저', '비교가 not 보다 먼저'],
            notes: '<p>한 줄씩 실행하기 전에 손을 들어 예측하게 합니다. 특히 <code>1 + 2 << 1</code> 은 많이 틀립니다.</p>' },
          { layout: 'two', title: 'and 와 or 를 섞으면?', left: { title: '괄호 없음', code: 'print(True or True and False)' }, right: { title: '괄호 있음', code: 'print((True or True) and False)' },
            notes: '<p>왼쪽 True, 오른쪽 False. and 가 or 보다 먼저라는 점, 섞어 쓸 땐 괄호로 의도를 드러내라는 점을 강조합니다.</p>' },
          { layout: 'code', title: '조건 표현식 (16순위)', code: 'num = 7\nresult = "짝수" if num % 2 == 0 else "홀수"\nprint(num, "은(는)", result)',
            points: ['<code>값1 if 조건 else 값2</code>', '가장 마지막에 선택', '5장 if 문의 한 줄 버전'],
            notes: '<p>표 4-6 의 마지막 줄을 실제 코드로 보여 주는 슬라이드입니다. 5장 if 문의 예고편 정도로 가볍게 다룹니다.</p>' },
          { layout: 'table', title: '우선순위가 만드는 흔한 버그', lead: '외우기보다 "자주 틀리는 자리"를 기억하자', head: ['쓴 식', '실제 계산', '의도한 식'], rows: [
            ['<code>-2 ** 2</code>', '<code>-(2 ** 2)</code> → <b>-4</b>', '<code>(-2) ** 2</code> → 4'],
            ['<code>1 + 2 &lt;&lt; 1</code>', '<code>(1 + 2) &lt;&lt; 1</code> → <b>6</b>', '<code>1 + (2 &lt;&lt; 1)</code> → 5'],
            ['<code>x == 1 or 2</code>', '<code>(x == 1) or 2</code> → 항상 참', '<code>x == 1 or x == 2</code>'],
            ['<code>kor + eng + mat / 3</code>', '수학 점수만 3 으로 나뉨', '<code>(kor + eng + mat) / 3</code>']
          ],
            notes: '<p>네 줄 모두 <b>오류 없이 그럴듯한 값</b>이 나온다는 점이 무섭습니다. 그래서 테스트가 필요하다는 이야기로 이어가도 좋습니다.</p><p>평균 버그는 실제로 학생 과제에서 가장 많이 나오는 실수입니다. 다음 실습(성적 요약)에서 다시 만납니다.</p>' },
          { layout: 'code', title: '버그를 눈으로 확인하기', code: 'print(-2 ** 2, (-2) ** 2)\nprint(1 + 2 << 1, 1 + (2 << 1))\nprint(True or True and False, (True or True) and False)\nprint(0.1 + 0.2 == 0.3)',
            points: ['왼쪽 = 괄호 없이, 오른쪽 = 괄호 넣고', '결과: <code>-4 4</code> / <code>6 5</code> / <code>True False</code>', '마지막 줄은 실수 오차 문제', '헷갈리면 괄호 — 읽는 사람을 위해'],
            notes: '<p>한 줄씩 예측 → 실행으로 확인합니다. 마지막 줄은 우선순위가 아니라 실수 표현의 한계 때문이라는 점을 구분해 주세요.</p><p>PEP 8 팁: <code>a*b + c*d</code> 처럼 우선순위가 높은 연산자의 공백을 좁혀 쓰면 계산 순서가 눈에 보입니다.</p>' },
          { layout: 'code', title: 'operator 모듈 맛보기', code: 'import operator\n\nprint(operator.add(3, 4), operator.mul(3, 4))\nprint(operator.lt(3, 4), operator.eq("a", "a"))\nprint(operator.and_(10, 7), operator.xor(10, 7))\n\ncalc = operator.mul\nprint(calc(6, 7))',
            points: ['연산자도 사실은 <b>함수</b>', '<code>calc = operator.mul</code> 처럼 변수에 담기', '<code>and_</code> · <code>not_</code> 은 예약어라 밑줄', '나중에 <code>sorted(key=…)</code> 로 이어짐'],
            notes: '<p>중급 학습자를 위한 보너스 슬라이드입니다. 결과: <code>7 12</code> / <code>True True</code> / <code>2 13</code> / <code>42</code>.</p><p>"계산 방법 자체를 값처럼 다룰 수 있다"는 감만 주면 충분합니다. 시간이 부족하면 건너뛰고 학생 문서로 안내하세요.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>print(20 // 3 * 3 + 20 % 3)</code> 의 결과는?', options: ['20', '18', '8', '6'], answer: 0,
            explain: '((20 // 3) * 3) + (20 % 3) = 18 + 2 = 20. 몫과 나머지로 원래 수를 되돌리는 식입니다.',
            notes: '<p>"a == (a // b) * b + a % b" 성질을 다시 확인하는 문제입니다.</p>' },
          { layout: 'practice', title: '실습 4-22. 각 자리 숫자의 합', desc: '세 자리 정수를 입력받아 백 · 십 · 일의 자리 숫자와 그 합을 출력하세요. (357 → 3, 5, 7, 합계 15)',
            starter: 'num = int(input("세 자리 정수 : "))\n\n# TODO: //, % 로 각 자리 구하기\n',
            solution: 'num = int(input("세 자리 정수 : "))\n\nd100 = num // 100\nd10 = num // 10 % 10\nd1 = num % 10\n\nprint("백 : %d, 십 : %d, 일 : %d" % (d100, d10, d1))\nprint("합계 :", d100 + d10 + d1)\n', stdin: '357\n',
            notes: '<p><code>num // 10 % 10</code> 이 왼쪽부터 계산된다는 점이 핵심입니다. 빨리 끝낸 학생은 네 자리 수로 확장해 보게 합니다.</p>' },
          { layout: 'practice', title: '🚀 프로젝트 4-24. 거스름돈 최적 계산기', desc: '물건값과 낸 돈을 입력받아 <b>가장 적은 장수 · 개수</b>로 거스름돈을 계산하세요. 50000 · 10000 · 5000 · 1000원 지폐와 500 · 100 · 50 · 10원 동전, 그리고 거슬러 줄 수 없는 돈까지 출력합니다.',
            starter: 'price = int(input("물건값 : "))\npaid = int(input("낸 돈 : "))\n\nchange = paid - price\nprint("거스름돈 : %d원" % change)\n\n# TODO: divmod 를 단위별로 반복\n',
            solution: 'price = int(input("물건값 : "))\npaid = int(input("낸 돈 : "))\n\nchange = paid - price\nprint("거스름돈 : %d원" % change)\n\nn50000, change = divmod(change, 50000)\nn10000, change = divmod(change, 10000)\nn5000, change = divmod(change, 5000)\nn1000, change = divmod(change, 1000)\nn500, change = divmod(change, 500)\nn100, change = divmod(change, 100)\nn50, change = divmod(change, 50)\nn10, change = divmod(change, 10)\n\nprint("지폐 : %d %d %d %d" % (n50000, n10000, n5000, n1000))\nprint("동전 : %d %d %d %d" % (n500, n100, n50, n10))\nprint("남은 돈 : %d원" % change)\n', stdin: '17300\n100000\n',
            notes: '<p>4장 전체를 묶는 마무리 프로젝트입니다. 1교시의 동전 교환과 같은 패턴이지만 단위가 8개로 늘었습니다.</p><p>큰 단위부터 나눠야 장수가 최소가 된다는 점(탐욕 알고리즘)을 짚어 주고, "만약 화폐 단위가 1, 3, 4원이라면?"이라는 질문으로 알고리즘 수업의 씨앗을 뿌려도 좋습니다.</p>' },
          { layout: 'summary', title: '4장 정리', bullets: [
            '산술 <code>+ - * / // % **</code> · 대입 <code>+= -= …</code> · <code>divmod()</code>',
            '형 변환 <code>int() float() str()</code>, <code>input()</code> 은 항상 문자열',
            '관계 <code>== != &gt; &lt; &gt;= &lt;=</code> · 체이닝 · 논리 <code>and or not</code>(값을 돌려준다)',
            '비트 <code>&amp; | ^ ~ &lt;&lt; &gt;&gt;</code> · 비트 플래그 · 마스크',
            '우선순위: 괄호 → ** → 산술 → 비트 → 비교 → not → and → or',
            '동전 교환 · 거북이 · BMI · 대출 · 검증기 · 권한 · 거스름돈까지 완성!'
          ], notes: '<p>다음 장(5장 조건문)에서는 오늘 배운 관계 · 논리 연산자로 if 문의 조건을 만듭니다. 연산자가 익숙하지 않은 학생은 4장 퀴즈를 다시 풀어 보게 합니다.</p><p>프로젝트 6개 중 하나를 골라 집에서 확장해 오는 과제를 내면 5장으로 자연스럽게 이어집니다.</p>' }
        ]
      }
    ]
  });
})();
