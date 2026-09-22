/* Chapter 06. 반복문 (강의자료: Ch06_반복문.pptx) */
(function () {
  /* ── 공통 그림 조각 ── */
  const TERM = 'background:var(--term-bg,#1e1e1e);color:var(--term-fg,#e6e6e6);padding:10px 14px;border-radius:8px;font-size:13px;line-height:1.35;overflow-x:auto;margin:0;font-family:monospace;white-space:pre';

  const GUGU_OUT = `#  2단  ##  3단  ##  4단  ##  5단  ##  6단  ##  7단  ##  8단  ##  9단  #
 2X  1=  2 3X  1=  3 4X  1=  4 5X  1=  5 6X  1=  6 7X  1=  7 8X  1=  8 9X  1=  9
 2X  2=  4 3X  2=  6 4X  2=  8 5X  2= 10 6X  2= 12 7X  2= 14 8X  2= 16 9X  2= 18
 2X  3=  6 3X  3=  9 4X  3= 12 5X  3= 15 6X  3= 18 7X  3= 21 8X  3= 24 9X  3= 27
 2X  4=  8 3X  4= 12 4X  4= 16 5X  4= 20 6X  4= 24 7X  4= 28 8X  4= 32 9X  4= 36
 2X  5= 10 3X  5= 15 4X  5= 20 5X  5= 25 6X  5= 30 7X  5= 35 8X  5= 40 9X  5= 45
 2X  6= 12 3X  6= 18 4X  6= 24 5X  6= 30 6X  6= 36 7X  6= 42 8X  6= 48 9X  6= 54
 2X  7= 14 3X  7= 21 4X  7= 28 5X  7= 35 6X  7= 42 7X  7= 49 8X  7= 56 9X  7= 63
 2X  8= 16 3X  8= 24 4X  8= 32 5X  8= 40 6X  8= 48 7X  8= 56 8X  8= 64 9X  8= 72
 2X  9= 18 3X  9= 27 4X  9= 36 5X  9= 45 6X  9= 54 7X  9= 63 8X  9= 72 9X  9= 81`;

  const DIAMOND_OUT = `        ★
      ★★★
    ★★★★★
  ★★★★★★★
★★★★★★★★★
  ★★★★★★★
    ★★★★★
      ★★★
        ★`;

  const HEART_OUT = DIAMOND_OUT.replace(/★/g, '♥');

  /* 구구단 출력 결과를 만드는 도우미 (expect 용) */
  const p2 = (n) => String(n).padStart(2);
  const range = (a, b, s) => { const r = []; for (let x = a; s > 0 ? x < b : x > b; x += s) r.push(x); return r; };
  // Code06-07: 2단~9단 세로 출력 (title=true 면 SELF STUDY 6-3 처럼 단 제목 포함)
  const guguVertical = (title) => range(2, 10, 1).map((i) => (title ? `## ${i}단 ##\n` : '') +
    range(1, 10, 1).map((k) => `${i} X ${k} = ${p2(i * k)}`).join('\n') + '\n').join('\n');
  // Code06-08: 가로 출력 (rev=true 면 SELF STUDY 6-4 처럼 거꾸로)
  const guguHorizontal = (rev) => {
    const dans = rev ? range(9, 1, -1) : range(2, 10, 1);
    const muls = rev ? range(9, 0, -1) : range(1, 10, 1);
    return [dans.map((i) => `#  ${i}단  #`).join('')]
      .concat(muls.map((i) => dans.map((k) => `${p2(k)}X ${p2(i)}= ${p2(k * i)}`).join(''))).join('\n');
  };

  /* ════════════════════════════════════════════════════════════════
     6-1. 반복문의 필요성과 for 문
     ════════════════════════════════════════════════════════════════ */
  const S1 = {
    id: 'ch06-1',
    title: '반복문의 필요성과 for 문',
    minutes: 50,
    goals: [
      '같은 코드를 여러 번 실행해야 할 때 반복문이 필요한 이유를 설명할 수 있다',
      'for 문과 range(시작값, 끝값+1, 증가값)의 형식을 알고, 만들어지는 값을 예측할 수 있다',
      '반복 변수 i 를 반복 블록 안에서 사용하고, 값이 필요 없으면 _ 를 쓸 수 있다',
      '합계 변수를 0 으로 초기화하고 for 문으로 1~10 의 합계를 구할 수 있다'
    ],
    flow: [['도입: 이 장에서 만들 프로그램', 5], ['반복문의 필요성', 5], ['for 문 · range()', 15], ['i 값 사용 · 거꾸로 · end', 10], ['for 문으로 합계 구하기', 10], ['퀴즈 · 정리', 5]],
    content: [
      { type: 'h', text: '이 장에서 만들 프로그램' },
      { type: 'p', html: '이번 장에서는 <b>같은 일을 여러 번 되풀이하는 문장</b>, 즉 <b>반복문(loop)</b>을 배웁니다. 반복문을 익히고 나면 아래 두 프로그램을 몇 줄 안 되는 코드로 만들 수 있습니다.' },
      { type: 'list', items: [
        '<b>[프로그램 1] 구구단 출력</b> — <code>for</code> 문을 두 겹으로 겹쳐(중첩 for 문) 2단~9단을 가로로 나란히 출력합니다.',
        '<b>[프로그램 2] 마름모 모양 출력</b> — <code>while</code> 문으로 공백과 별(★)의 개수를 줄마다 바꾸어 마름모를 그립니다.'
      ] },
      { type: 'figure', caption: '[프로그램 1] 구구단 출력(위)과 [프로그램 2] 마름모 모양 출력(아래)의 실행 결과', html: `<div style="display:flex;flex-direction:column;gap:10px">
<pre style="${TERM}">${GUGU_OUT}</pre>
<pre style="${TERM};font-size:15px;line-height:1.15">${DIAMOND_OUT}</pre>
</div>` },
      { type: 'callout', kind: 'info', title: '이 장의 흐름', html: '기본 <code>for</code> 문 → 중첩 <code>for</code> 문 → <b>[프로그램 1] 완성</b> → <code>while</code> 문 · 무한 루프 → <code>break</code> · <code>continue</code> → <b>[프로그램 2] 완성</b> 순서로 진행합니다.' },

      { type: 'h', text: '반복문의 개념과 필요성' },
      { type: 'p', html: '"안녕하세요? for 문을 공부 중입니다. ^^" 라는 문장을 3번 출력하고 싶다고 합시다. 지금까지 배운 방법으로는 <code>print()</code> 를 <b>3번 복사해 붙여 넣는</b> 수밖에 없습니다.' },
      { type: 'code', title: 'Code06-01(1). 반복문을 사용하지 않는 경우', code: `print("안녕하세요? for 문을 공부 중입니다. ^^")
print("안녕하세요? for 문을 공부 중입니다. ^^")
print("안녕하세요? for 문을 공부 중입니다. ^^")`, expect: `안녕하세요? for 문을 공부 중입니다. ^^
안녕하세요? for 문을 공부 중입니다. ^^
안녕하세요? for 문을 공부 중입니다. ^^` },
      { type: 'p', html: '3번이면 참을 만하지만 100번, 1000번이라면 어떨까요? 문장을 조금 고치려면 복사한 줄을 <b>전부</b> 고쳐야 합니다. 반복문을 쓰면 "이 문장을 3번 실행하라" 고 <b>한 번만</b> 적으면 됩니다.' },
      { type: 'code', title: 'Code06-01(2). 반복문을 사용한 경우', code: `for i in range(0, 3, 1) :
    print("안녕하세요? for 문을 공부 중입니다. ^^")`, expect: `안녕하세요? for 문을 공부 중입니다. ^^
안녕하세요? for 문을 공부 중입니다. ^^
안녕하세요? for 문을 공부 중입니다. ^^`, desc: '<code>range(0, 3, 1)</code> 의 <code>3</code> 을 <code>100</code> 으로 바꾸면 100번 출력됩니다. 코드 길이는 그대로 2줄입니다.' },
      { type: 'callout', kind: 'tip', title: '반복문 = 컴퓨터가 가장 잘하는 일', html: '사람은 같은 일을 1000번 하면 지치고 실수하지만, 컴퓨터는 1억 번도 정확하게 반복합니다. 프로그래밍에서 "반복" 은 조건문(5장)과 함께 <b>프로그램의 흐름을 바꾸는 두 기둥</b>입니다.' },

      { type: 'h', text: 'for 문의 기본 형식' },
      { type: 'code', title: 'for 문의 형식', run: false, code: `for 변수 in range(시작값, 끝값+1, 증가값) :
    이 부분을 반복` },
      { type: 'list', items: [
        '<code>range(시작값, 끝값+1, 증가값)</code> 이 <b>반복할 값들의 목록</b>을 만들고, <code>for</code> 문은 그 값을 하나씩 꺼내 <b>변수</b>에 넣은 뒤 아래 블록을 실행합니다.',
        '<code>range()</code> 의 두 번째 값은 <b>포함되지 않습니다</b>. 그래서 끝값까지 반복하려면 <b>끝값+1</b> 을 적습니다.',
        '줄 끝의 <b>콜론(<code>:</code>)</b> 과, 반복할 문장의 <b>들여쓰기(공백 4칸)</b> 는 if 문과 똑같이 필수입니다.',
        '들여쓰기가 끝나는 곳이 반복 블록의 끝입니다. 들여쓰지 않은 다음 문장은 반복이 <b>모두 끝난 뒤 한 번</b> 실행됩니다.'
      ] },
      { type: 'figure', caption: 'for 문의 동작 순서 — range() 에 남은 값이 있는 동안 블록을 반복한다', html: `<svg viewBox="0 0 640 330" width="100%" style="max-width:640px" font-family="sans-serif">
  <defs><marker id="a6f1" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--muted)"/></marker></defs>
  <g font-size="15" text-anchor="middle">
    <rect x="170" y="8" width="120" height="34" rx="17" fill="var(--warn)"/><text x="230" y="30" fill="#fff" font-weight="bold">시작</text>
    <polygon points="230,70 360,115 230,160 100,115" fill="var(--ok)" opacity=".9"/><text x="230" y="112" fill="#fff" font-weight="bold">range() 에</text><text x="230" y="131" fill="#fff" font-weight="bold">남은 값이 있나?</text>
    <rect x="410" y="95" width="200" height="40" rx="8" fill="var(--accent2)" opacity=".9"/><text x="510" y="120" fill="#fff">변수 ← 다음 값</text>
    <rect x="410" y="175" width="200" height="40" rx="8" fill="var(--accent)" opacity=".9"/><text x="510" y="200" fill="#fff">반복할 문장들 실행</text>
    <rect x="130" y="270" width="200" height="40" rx="8" fill="var(--card)" stroke="var(--line)" stroke-width="2"/><text x="230" y="295" fill="var(--fg)">for 문 다음 문장</text>
  </g>
  <g stroke="var(--muted)" stroke-width="2" fill="none" marker-end="url(#a6f1)">
    <line x1="230" y1="42" x2="230" y2="66"/>
    <line x1="360" y1="115" x2="406" y2="115"/>
    <line x1="510" y1="135" x2="510" y2="171"/>
    <path d="M510 215 V245 H40 V115 H96"/>
    <line x1="230" y1="160" x2="230" y2="266"/>
  </g>
  <g font-size="14" fill="var(--fg)"><text x="368" y="106">예</text><text x="238" y="185">아니요(반복 끝)</text><text x="50" y="238" fill="var(--muted)">다시 확인</text></g>
</svg>` },
      { type: 'p', html: '<code>range(0, 3, 1)</code> 은 "0부터 시작해서 1씩 늘리되 3 <b>직전</b>까지" 의 값, 즉 <code>0, 1, 2</code> 를 만듭니다. 그래서 파이썬은 내부적으로 아래 두 코드를 <b>똑같이</b> 처리합니다. 오른쪽처럼 <b>대괄호 <code>[ ]</code> 로 값을 직접 나열</b>한 것을 <b>리스트(list)</b>라고 하며, 7장에서 자세히 배웁니다.' },
      { type: 'code', title: '예. range() 함수를 사용한 for 문', code: `for i in range(0, 3, 1) :
    print("안녕하세요? for 문을 공부 중입니다. ^^")`, expect: `안녕하세요? for 문을 공부 중입니다. ^^
안녕하세요? for 문을 공부 중입니다. ^^
안녕하세요? for 문을 공부 중입니다. ^^` },
      { type: 'code', title: '예. range(0, 3, 1) 을 [0, 1, 2] 로 바꾼 for 문', code: `for i in [0, 1, 2] :
    print("안녕하세요? for 문을 공부 중입니다. ^^")`, expect: `안녕하세요? for 문을 공부 중입니다. ^^
안녕하세요? for 문을 공부 중입니다. ^^
안녕하세요? for 문을 공부 중입니다. ^^`, desc: '값 목록이 <code>[0, 1, 2]</code> 로 세 개이므로 3번 반복합니다. 결과가 위 코드와 완전히 같습니다.' },
      { type: 'p', html: '<code>range()</code> 가 어떤 값을 만드는지 궁금하면 <code>list()</code> 로 감싸서 <code>&gt;&gt;&gt;</code> 셸에서 확인해 보세요.' },
      { type: 'code', repl: true, title: '대화형 모드에서 range() 가 만드는 값 확인하기', code: `list(range(0, 3, 1))
list(range(1, 6))
list(range(5))
list(range(2, -1, -1))
list(range(1, 10, 3))`, expect: `>>> list(range(0, 3, 1))
[0, 1, 2]
>>> list(range(1, 6))
[1, 2, 3, 4, 5]
>>> list(range(5))
[0, 1, 2, 3, 4]
>>> list(range(2, -1, -1))
[2, 1, 0]
>>> list(range(1, 10, 3))
[1, 4, 7]
>>>` },
      { type: 'table', caption: 'range() 함수의 세 가지 사용법', head: ['형태', '의미', '예', '만들어지는 값'], rows: [
        ['<code>range(끝값)</code>', '0부터 끝값 직전까지 1씩 증가', '<code>range(5)</code>', '0, 1, 2, 3, 4'],
        ['<code>range(시작값, 끝값)</code>', '시작값부터 끝값 직전까지 1씩 증가', '<code>range(1, 6)</code>', '1, 2, 3, 4, 5'],
        ['<code>range(시작값, 끝값, 증가값)</code>', '증가값만큼 건너뛰며 증가(음수면 감소)', '<code>range(1, 10, 3)</code>', '1, 4, 7']
      ] },
      { type: 'callout', kind: 'warn', title: '끝값은 포함되지 않는다!', html: '<code>range(1, 10)</code> 은 1~<b>9</b> 입니다. 1~10 을 원하면 <code>range(1, 11)</code> 처럼 <b>끝값+1</b> 을 써야 합니다. 초보자가 가장 많이 틀리는 부분이니 "두 번째 값 <b>직전</b>에서 멈춘다" 고 기억하세요.' },

      { type: 'h', text: '반복 변수 i 를 블록 안에서 사용하기' },
      { type: 'p', html: '<code>for i in …</code> 의 <code>i</code> 는 반복할 때마다 <b>다음 값으로 바뀌는 보통 변수</b>입니다. 따라서 반복 블록 안에서 <code>i</code> 의 값을 출력하거나 계산에 쓸 수 있습니다.' },
      { type: 'code', title: '예. i 값을 코드 안에서 사용하기', code: `for i in range(0, 3, 1) :
    print("%d : 안녕하세요? for 문을 공부 중입니다. ^^" % i)`, expect: `0 : 안녕하세요? for 문을 공부 중입니다. ^^
1 : 안녕하세요? for 문을 공부 중입니다. ^^
2 : 안녕하세요? for 문을 공부 중입니다. ^^`, desc: '첫 번째 반복에서 <code>i</code> 는 0, 두 번째에서 1, 세 번째에서 2 입니다. <code>%d</code> 자리에 그 값이 들어갑니다.' },
      { type: 'callout', kind: 'tip', title: 'Tip. i 를 쓰지 않을 때는 _ (언더바)', html: '반복 횟수만 필요하고 변수 값은 쓰지 않는다면 <code>i</code> 대신 <b><code>_</code>(언더바)</b> 를 써도 됩니다. "이 변수는 쓰지 않는다" 는 뜻을 읽는 사람에게 알려 주는 관례입니다.' },
      { type: 'code', title: '예. i 대신 _ 를 사용한 for 문', code: `for _ in range(0, 3, 1) :
    print("안녕하세요? for 문을 공부 중입니다. ^^")`, expect: `안녕하세요? for 문을 공부 중입니다. ^^
안녕하세요? for 문을 공부 중입니다. ^^
안녕하세요? for 문을 공부 중입니다. ^^` },
      { type: 'p', html: '증가값을 <b>음수</b>로 주면 값이 줄어듭니다. 아래 코드는 시작값 2 에서 1씩 줄여 0 이 될 때까지, 즉 <code>2, 1, 0</code> 으로 3번 실행합니다. 끝값을 <code>-1</code> 로 적어야 0 까지 포함된다는 점에 주의하세요.' },
      { type: 'code', title: '예. range() 의 시작값 2, i 값을 1씩 줄이기', code: `for i in range(2, -1, -1) :
    print("%d : 안녕하세요? for 문을 공부 중입니다. ^^" % i)`, expect: `2 : 안녕하세요? for 문을 공부 중입니다. ^^
1 : 안녕하세요? for 문을 공부 중입니다. ^^
0 : 안녕하세요? for 문을 공부 중입니다. ^^` },
      { type: 'p', html: '<code>print()</code> 는 출력 후 자동으로 줄을 바꿉니다. <code>end = " "</code> 를 주면 줄을 바꾸는 대신 <b>공백 한 칸</b>을 붙이므로 숫자들이 한 줄에 나란히 출력됩니다.' },
      { type: 'code', title: '예. 1~5 의 숫자들을 차례로 출력하기', code: `for i in range(1, 6, 1) :
    print("%d " % i, end = " ")`, expect: `1  2  3  4  5`, desc: '<code>"%d "</code> 의 공백 1칸 + <code>end</code> 의 공백 1칸이 합쳐져 숫자 사이가 두 칸씩 띄어집니다.' },
      { type: 'callout', kind: 'more', title: '📘 더 알아보기: print() 의 end 와 sep', html: '<code>print()</code> 는 기본으로 <code>end="\\n"</code>(줄바꿈)을 끝에 붙입니다. <code>end=""</code> 로 하면 아무것도 붙이지 않고, <code>end=", "</code> 처럼 원하는 글자를 붙일 수도 있습니다. 여러 값을 출력할 때 사이에 들어가는 글자는 <code>sep</code> 로 정합니다. 예) <code>print(1, 2, 3, sep="-")</code> → <code>1-2-3</code>' },
      { type: 'callout', kind: 'warn', title: '흔한 실수: 콜론과 들여쓰기', html: '<code>for i in range(3)</code> 뒤에 <code>:</code> 를 빠뜨리면 <code>SyntaxError: expected \':\'</code>, 반복할 문장을 들여쓰지 않으면 <code>IndentationError: expected an indented block</code> 오류가 납니다. 아래 예제를 실행해 오류 메시지를 직접 확인해 보세요.' },
      { type: 'code', title: '추가 예제. 콜론(:)을 빠뜨린 for 문', expectError: true, code: `for i in range(3)
    print(i)`, expect: `  File "main.py", line 1
    for i in range(3)
                     ^
SyntaxError: expected ':'`, desc: '오류 위치 표시(<code>^</code>)가 줄 끝을 가리킵니다. <code>range(3)</code> 뒤에 <code>:</code> 를 붙이면 0, 1, 2 가 출력됩니다.' },

      { type: 'h', text: 'for 문을 활용한 합계 구하기' },
      { type: 'p', html: '1부터 10까지의 합계를 구해 봅시다. for 문을 배우기 전이라면 숫자를 모두 적어 더해야 합니다.' },
      { type: 'code', title: '예. for 문 없이 1~10 의 합계 구하기', code: `hap = 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10
print("1에서 10까지의 합계 : %d" % hap)`, expect: `1에서 10까지의 합계 : 55` },
      { type: 'p', html: '1~1000 의 합계라면 이 방법은 쓸 수 없습니다. 먼저 for 문으로 어떻게 할지 <b>우리말로</b> 적어 봅니다. 이렇게 코드 대신 일의 순서를 글로 적은 것을 <b>의사 코드(pseudo code)</b>라고 합니다.' },
      { type: 'code', title: 'for 문 작성 내용 (의사 코드)', run: false, code: `1부터 10까지 변할 i 변수 준비

for i 변수가 1을 시작으로 10까지 1씩 증가
    hap값에 i값을 더해 줌

hap값 출력` },
      { type: 'p', html: '이 내용을 그대로 코드로 옮기면 다음과 같습니다. 그런데 실행하면 오류가 납니다.' },
      { type: 'code', title: 'Code06-02(1). for 문으로 1~10 의 합계 구하기 (오류)', expectError: true, code: `i = 0

for i in range(1, 11, 1) :
    hap = hap + i

print("1에서 10까지의 합계 : %d" % hap)`, expect: `Traceback (most recent call last):
  File "main.py", line 4, in <module>
    hap = hap + i
          ^^^
NameError: name 'hap' is not defined. Did you mean: 'map'?`, desc: '<code>4행</code>의 <code>hap = hap + i</code> 는 "지금 hap 값에 i 를 더해서 다시 hap 에 넣어라" 라는 뜻입니다. 그런데 처음 실행할 때는 <b>hap 이라는 변수가 아직 없으므로</b> 더할 수가 없습니다.' },
      { type: 'p', html: '해결 방법은 반복을 시작하기 전에 <b>hap 을 0 으로 만들어 두는 것(초기화)</b>입니다. 1행을 <code>i, hap = 0, 0</code> 으로 바꿉니다.' },
      { type: 'code', title: 'Code06-02(2). hap 초기화 코드 추가', code: `i, hap = 0, 0

for i in range(1, 11, 1) :
    hap = hap + i

print("1에서 10까지의 합계 : %d" % hap)`, expect: `1에서 10까지의 합계 : 55`, desc: '<code>1행</code>에서 hap 을 0 으로 초기화했습니다. <code>6행</code>은 들여쓰지 않았으므로 반복이 <b>모두 끝난 뒤 한 번만</b> 실행됩니다.' },
      { type: 'figure', caption: '그림 6-1 i 와 hap 변수값의 변화 — 이전 hap 에 i 를 더한 값이 새 hap 이 된다', html: `<svg viewBox="0 0 620 470" width="100%" style="max-width:620px" font-family="sans-serif">
  <defs><marker id="a6h1" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--danger)"/></marker></defs>
  <g font-size="17" text-anchor="middle" font-weight="bold">
    <rect x="160" y="8" width="70" height="32" fill="var(--card)" stroke="var(--line)" stroke-width="2"/><text x="195" y="30" fill="var(--fg)">i</text>
    <rect x="460" y="8" width="80" height="32" fill="var(--card)" stroke="var(--line)" stroke-width="2"/><text x="500" y="30" fill="var(--fg)">hap</text>
    <rect x="460" y="52" width="80" height="34" fill="var(--danger)" opacity=".25"/><text x="500" y="75" fill="var(--fg)">0</text>
  </g>
  <g font-size="17" text-anchor="middle">
    ${[[1, 1], [2, 3], [3, 6], [9, 45], [10, 55]].map(([i, h], n) => {
      const y = 110 + n * 70 + (n >= 3 ? 30 : 0);
      return `<text x="80" y="${y + 22}" fill="var(--danger)" font-weight="bold">제${i}회</text>
    <rect x="160" y="${y}" width="70" height="34" fill="var(--danger)" opacity=".25"/><text x="195" y="${y + 23}" fill="var(--fg)" font-weight="bold">${i}</text>
    <rect x="320" y="${y}" width="70" height="34" fill="var(--accent)" opacity=".25"/><text x="355" y="${y + 24}" fill="var(--fg)" font-weight="bold">+</text>
    <rect x="460" y="${y}" width="80" height="34" fill="var(--danger)" opacity=".25"/><text x="500" y="${y + 23}" fill="var(--fg)" font-weight="bold">${h}</text>
    <line x1="232" y1="${y + 17}" x2="314" y2="${y + 17}" stroke="var(--danger)" stroke-width="2" marker-end="url(#a6h1)"/>
    <line x1="392" y1="${y + 17}" x2="454" y2="${y + 17}" stroke="var(--danger)" stroke-width="2" marker-end="url(#a6h1)"/>`;
    }).join('\n    ')}
    <text x="355" y="318" fill="var(--muted)" font-size="26">⋮</text>
  </g>
  <g stroke="var(--danger)" stroke-width="2" fill="none" marker-end="url(#a6h1)">
    <path d="M540 69 H570 V98 H355 V106"/>
    <path d="M540 127 H570 V165 H355 V176"/>
    <path d="M540 197 H570 V235 H355 V246"/>
    <path d="M570 322 V335 H355 V346"/>
    <path d="M540 367 H570 V405 H355 V416"/>
  </g>
  <path d="M540 267 H570 V300" stroke="var(--danger)" stroke-width="2" fill="none" stroke-dasharray="4 4"/>
</svg>` },
      { type: 'table', caption: 'Code06-02(2) 의 반복 과정 추적', head: ['회차', 'i', '실행 전 hap', '<code>hap = hap + i</code>', '실행 후 hap'], rows: [
        ['1회', '1', '0', '0 + 1', '1'],
        ['2회', '2', '1', '1 + 2', '3'],
        ['3회', '3', '3', '3 + 3', '6'],
        ['…', '…', '…', '…', '…'],
        ['9회', '9', '36', '36 + 9', '45'],
        ['10회', '10', '45', '45 + 10', '<b>55</b>']
      ] },
      { type: 'callout', kind: 'info', title: '누적 합계의 3단계 공식', html: '① 반복 <b>전</b>: 합계 변수를 0 으로 초기화 → ② 반복 <b>안</b>: <code>hap = hap + i</code> 로 계속 더하기 → ③ 반복 <b>후</b>: 결과 출력. 이 모양은 앞으로 수없이 등장하니 꼭 익혀 두세요. (곱을 누적할 때는 초기값이 0 이 아니라 <b>1</b> 이어야 합니다!)' },
      { type: 'callout', kind: 'more', title: '📘 더 알아보기: i = 0 은 꼭 필요할까?', html: '강의자료 코드는 <code>i, hap = 0, 0</code> 처럼 변수를 미리 선언하는 습관을 따릅니다. 사실 파이썬에서 <code>for i in …</code> 의 <code>i</code> 는 for 문이 알아서 값을 넣으므로 미리 만들 필요가 없습니다. 하지만 <code>hap</code> 처럼 <b>자기 자신을 사용해 값을 바꾸는 변수</b>는 반드시 초기화해야 합니다. 참고로 파이썬에는 합계를 구하는 내장 함수도 있습니다: <code>sum(range(1, 11))</code> → <code>55</code>' }
    ],
    practice: [
      {
        title: '실습 6-1. 카운트다운', level: 1,
        desc: '<p>for 문과 <code>range()</code> 를 사용해 10부터 1까지 거꾸로 한 줄에 출력한 뒤, 다음 줄에 <code>발사!</code> 를 출력하세요.</p><pre>10 9 8 7 6 5 4 3 2 1\n발사!</pre>',
        hint: '증가값이 <code>-1</code> 이고, 1까지 포함하려면 끝값은 <code>0</code> 입니다. 한 줄에 출력하려면 <code>end=" "</code>, 마지막에 <code>print()</code> 로 줄을 바꿉니다.',
        starter: `# TODO: 10부터 1까지 거꾸로 한 줄에 출력

# TODO: 줄을 바꾸고 "발사!" 출력
`,
        solution: `for i in range(10, 0, -1) :
    print(i, end=" ")
print()
print("발사!")
`,
        expect: `10 9 8 7 6 5 4 3 2 1
발사!`
      },
      {
        title: '실습 6-2. 1부터 n까지의 곱', level: 2,
        desc: '<p>정수 n 을 입력받아 1×2×…×n 의 값(팩토리얼)을 for 문으로 구해 출력하세요.</p><pre>숫자를 입력하세요 : 5\n1부터 5까지의 곱 : 120</pre>',
        hint: '곱을 누적할 변수는 <b>1</b> 로 초기화해야 합니다. 0 으로 시작하면 무엇을 곱해도 0 입니다.',
        starter: `n = int(input("숫자를 입력하세요 : "))
gop = 1
# TODO: for 문으로 1부터 n까지 gop 에 곱하기

print("1부터 %d까지의 곱 : %d" % (n, gop))
`,
        solution: `n = int(input("숫자를 입력하세요 : "))
gop = 1
for i in range(1, n + 1) :
    gop = gop * i

print("1부터 %d까지의 곱 : %d" % (n, gop))
`,
        stdin: '5\n',
        expect: `숫자를 입력하세요 : 5
1부터 5까지의 곱 : 120`
      }
    ],
    quiz: [
      { q: '<code>range(1, 5)</code> 가 만드는 값은?', options: ['1, 2, 3, 4, 5', '1, 2, 3, 4', '0, 1, 2, 3, 4', '2, 3, 4, 5'], answer: 1, explain: '두 번째 값(끝값)은 포함되지 않으므로 1~4 입니다.' },
      { q: '다음 코드의 실행 결과는?<pre><code>for i in range(2, -1, -1) :\n    print(i, end=" ")</code></pre>', options: ['2 1 0', '2 1', '2 1 0 -1', '아무것도 출력되지 않는다'], answer: 0, explain: '2 에서 시작해 1씩 줄이며 -1 직전(0)까지 반복합니다.' },
      { q: '다음 코드에서 오류가 나는 이유는?<pre><code>for i in range(1, 11) :\n    hap = hap + i\nprint(hap)</code></pre>', options: ['range() 의 끝값이 틀렸다', 'hap 을 반복 전에 초기화하지 않았다', 'print() 가 들여쓰기되지 않았다', 'i 를 미리 선언하지 않았다'], answer: 1, explain: '처음 <code>hap + i</code> 를 계산할 때 hap 이 없어서 <code>NameError</code> 가 납니다. 반복 전에 <code>hap = 0</code> 이 필요합니다.' },
      { q: '<code>for _ in range(3):</code> 의 <code>_</code> 에 대한 설명으로 옳은 것은?', options: ['문법 오류이다', '반복 횟수를 0으로 만든다', '값을 쓰지 않는 반복 변수라는 뜻의 관례이다', '반복을 무한히 계속한다'], answer: 2, explain: '<code>_</code> 도 보통 변수 이름이지만, "값을 쓰지 않는다" 는 의미로 관례적으로 사용합니다.' }
    ],
    slides: [
      { layout: 'title', title: '반복문의 필요성과 for 문', subtitle: 'Chapter 06 반복문 · Section 01~02', badge: '6-1',
        notes: '<p>(1분) 발문: "칠판에 \'떠들지 않겠습니다\' 를 100번 쓰라는 벌을 받았다면? 컴퓨터라면?" — 같은 일을 되풀이하는 것이 오늘의 주제입니다.</p><p>이 장은 5교시 분량: ① for 문 기초 ② for 문 활용 ③ 중첩 for · 구구단 ④ while ⑤ break/continue · 마름모.</p>' },
      { layout: 'diagram', title: '이 장에서 만들 프로그램', html: `<div style="display:flex;gap:18px;align-items:flex-start;justify-content:center;flex-wrap:wrap">
<div style="flex:1 1 560px;max-width:760px"><div style="font-weight:bold;margin-bottom:6px">[프로그램 1] 구구단 출력 — for 문</div><pre style="${TERM};font-size:12px">${GUGU_OUT}</pre></div>
<div style="flex:0 0 240px"><div style="font-weight:bold;margin-bottom:6px">[프로그램 2] 마름모 — while 문</div><pre style="${TERM};font-size:18px;line-height:1.1">${DIAMOND_OUT}</pre></div>
</div>`, caption: '이 장을 마치면 두 프로그램을 직접 만들 수 있다',
        notes: '<p>(3분) 두 결과를 보여 주고 "print() 로 한 줄씩 쓰면 몇 줄이 필요할까?" 물어봅니다. 구구단은 10줄, 마름모는 9줄이지만, 7단까지 · 크기 20 마름모로 바꾸라고 하면 손으로는 감당이 안 됩니다.</p><p>반복문을 쓰면 크기가 바뀌어도 코드는 거의 그대로라는 점을 예고합니다.</p>' },
      { layout: 'two', title: '반복문이 필요한 이유',
        left: { title: 'Code06-01(1) 반복문 없이', code: `print("안녕하세요? for 문을 공부 중입니다. ^^")
print("안녕하세요? for 문을 공부 중입니다. ^^")
print("안녕하세요? for 문을 공부 중입니다. ^^")` },
        right: { title: 'Code06-01(2) for 문 사용', code: `for i in range(0, 3, 1) :
    print("안녕하세요? for 문을 공부 중입니다. ^^")` },
        notes: '<p>(3분) 두 코드를 각각 실행해 결과가 같음을 확인합니다.</p><p>발문: "100번으로 바꾸려면 각각 무엇을 고쳐야 할까?" → 왼쪽은 97줄 추가, 오른쪽은 숫자 3 → 100 하나만.</p>' },
      { layout: 'code', title: 'for 문의 기본 형식', code: `for i in range(0, 3, 1) :
    print("반복되는 문장")
    print("이것도 반복")
print("반복이 끝난 뒤 한 번만")`, points: ['<code>for 변수 in range(시작값, 끝값+1, 증가값) :</code>', 'range() 가 값 목록을 만들고, 하나씩 <b>변수</b>에 넣어 반복', '<b>콜론</b>과 <b>들여쓰기 4칸</b>은 필수', '들여쓰기가 끝나면 반복 블록도 끝'],
        notes: '<p>(4분) 실행 후 "반복되는 문장" 3번, "이것도 반복" 3번이 번갈아 나오고, 마지막 줄은 1번만 나오는 것을 확인합니다.</p><p>마지막 줄을 들여쓰기해서 다시 실행 → 3번 출력. 들여쓰기가 곧 "블록의 범위" 입니다.</p>' },
      { layout: 'diagram', title: 'for 문의 동작 순서', html: `<svg viewBox="0 0 1280 560" width="100%" font-family="sans-serif">
  <defs><marker id="a6f1s" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--muted)"/></marker></defs>
  <g font-size="28" text-anchor="middle" font-weight="bold">
    <rect x="330" y="10" width="220" height="60" rx="30" fill="var(--warn)"/><text x="440" y="50" fill="#fff">시작</text>
    <polygon points="440,110 640,190 440,270 240,190" fill="var(--ok)"/><text x="440" y="182" fill="#fff">range() 에</text><text x="440" y="216" fill="#fff">남은 값?</text>
    <rect x="740" y="155" width="400" height="70" rx="12" fill="var(--accent2)"/><text x="940" y="200" fill="#fff">i ← 다음 값 (0 → 1 → 2)</text>
    <rect x="740" y="290" width="400" height="70" rx="12" fill="var(--accent)"/><text x="940" y="335" fill="#fff">반복할 문장들 실행</text>
    <rect x="290" y="470" width="300" height="70" rx="12" fill="var(--card)" stroke="var(--line)" stroke-width="3"/><text x="440" y="515" fill="var(--fg)">for 문 다음 문장</text>
  </g>
  <g stroke="var(--muted)" stroke-width="4" fill="none" marker-end="url(#a6f1s)">
    <line x1="440" y1="70" x2="440" y2="104"/><line x1="640" y1="190" x2="734" y2="190"/><line x1="940" y1="225" x2="940" y2="284"/>
    <path d="M940 360 V410 H120 V190 H234"/><line x1="440" y1="270" x2="440" y2="464"/>
  </g>
  <g font-size="26" fill="var(--fg)"><text x="660" y="175">예</text><text x="455" y="330">아니요</text><text x="140" y="400" fill="var(--muted)">다시 확인</text></g>
</svg>`, caption: '값이 남아 있는 동안 블록 실행 → 다시 확인, 값이 없으면 반복 종료',
        notes: '<p>(3분) range(0, 3, 1) 기준으로 손가락으로 따라가며 i=0 → 실행 → i=1 → 실행 → i=2 → 실행 → 남은 값 없음 → 종료. 총 3번.</p>' },
      { layout: 'code', title: 'range() 가 만드는 값 확인', repl: true, code: `list(range(0, 3, 1))
list(range(1, 6))
list(range(5))
list(range(2, -1, -1))
list(range(1, 10, 3))`, points: ['<code>list()</code> 로 감싸면 값 목록이 보인다', '<b>끝값은 포함 안 됨</b> → 끝값+1', '시작값 생략 시 0, 증가값 생략 시 1', '증가값이 음수면 거꾸로'],
        notes: '<p>(4분) 실행 전에 학생들에게 결과를 먼저 예측하게 하세요. 특히 <code>range(2, -1, -1)</code> 에서 "-1 이 왜 들어가나?" 를 토론합니다.</p><p>내부적으로 <code>range(0, 3, 1)</code> ≒ <code>[0, 1, 2]</code> — for i in [0, 1, 2] 와 같다는 점을 연결합니다.</p>' },
      { layout: 'table', title: 'range() 의 세 가지 형태', head: ['형태', '예', '값'], rows: [
        ['<code>range(끝값)</code>', '<code>range(5)</code>', '0 1 2 3 4'],
        ['<code>range(시작값, 끝값)</code>', '<code>range(1, 6)</code>', '1 2 3 4 5'],
        ['<code>range(시작, 끝, 증가)</code>', '<code>range(1, 10, 3)</code>', '1 4 7'],
        ['증가값이 음수', '<code>range(2, -1, -1)</code>', '2 1 0']
      ], lead: '두 번째 값(끝값) <b>직전</b>에서 멈춘다',
        notes: '<p>(2분) 발문: "1부터 100까지 짝수만 만들려면?" → <code>range(2, 101, 2)</code>. "10부터 1까지?" → <code>range(10, 0, -1)</code>.</p>' },
      { layout: 'two', title: 'i 값 사용하기 · _ (언더바)',
        left: { title: 'i 값을 출력에 사용', code: `for i in range(0, 3, 1) :
    print("%d : 안녕하세요? for 문을 공부 중입니다. ^^" % i)` },
        right: { title: 'Tip. i 를 안 쓰면 _', code: `for _ in range(0, 3, 1) :
    print("안녕하세요? for 문을 공부 중입니다. ^^")` },
        notes: '<p>(3분) i 가 0, 1, 2 로 바뀌는 것을 출력으로 확인합니다. 사람이 세는 1, 2, 3 으로 보이게 하려면? → <code>i + 1</code> 을 출력하거나 <code>range(1, 4)</code>.</p><p><code>_</code> 는 특별한 문법이 아니라 "안 쓰는 변수" 라는 약속입니다.</p>' },
      { layout: 'two', title: '거꾸로 반복 · 한 줄에 출력',
        left: { title: 'range(2, -1, -1)', code: `for i in range(2, -1, -1) :
    print("%d : 안녕하세요? for 문을 공부 중입니다. ^^" % i)` },
        right: { title: 'end = " " 로 한 줄에', code: `for i in range(1, 6, 1) :
    print("%d " % i, end = " ")` },
        notes: '<p>(3분) 왼쪽: 끝값을 0 으로 쓰면 2, 1 만 나온다는 것을 직접 바꿔서 확인시키세요.</p><p>오른쪽: <code>end</code> 를 지우고 실행 → 세로로 출력. <code>end=","</code> 로 바꿔 보기.</p>' },
      { layout: 'code', title: 'Code06-02(1) — 왜 오류일까?', expectError: true, code: `i = 0

for i in range(1, 11, 1) :
    hap = hap + i

print("1에서 10까지의 합계 : %d" % hap)`, points: ['의사 코드를 그대로 옮긴 코드', '<code>NameError: name \'hap\' is not defined</code>', '첫 반복에서 hap 이 아직 없음', '→ 반복 <b>전에</b> 초기화 필요'],
        notes: '<p>(3분) 먼저 실행해서 오류를 보여 주고, "4행을 처음 실행하는 순간 hap 에는 무엇이 들어 있나?" 를 묻습니다.</p><p>오류 메시지의 줄 번호(line 4)와 ^^^ 표시를 읽는 연습도 함께.</p>' },
      { layout: 'code', title: 'Code06-02(2). 1~10 의 합계', code: `i, hap = 0, 0

for i in range(1, 11, 1) :
    hap = hap + i

print("1에서 10까지의 합계 : %d" % hap)`, points: ['① 반복 전: <code>hap = 0</code>', '② 반복 안: <code>hap = hap + i</code>', '③ 반복 후: 출력 (들여쓰기 X)', '<code>11</code> → <code>101</code> 로 바꾸면 1~100 합계'],
        notes: '<p>(3분) 실행 → 55. 이어서 11 → 101 로 바꿔 5050 확인.</p><p>발문: "print 를 들여쓰기하면?" → 합계가 10번(1, 3, 6, …, 55) 출력. 직접 해 보게 하세요.</p>' },
      { layout: 'diagram', title: '그림 6-1 i 와 hap 변수값의 변화', html: `<svg viewBox="0 0 1280 560" width="100%" font-family="sans-serif">
  <defs><marker id="a6h1s" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--danger)"/></marker></defs>
  <g font-size="26" text-anchor="middle" font-weight="bold" fill="var(--fg)">
    <text x="130" y="40">회차</text><text x="330" y="40">i</text><text x="620" y="40">이전 hap + i</text><text x="930" y="40">새 hap</text>
    ${[[1, 0, 1], [2, 1, 3], [3, 3, 6], [4, 6, 10], [9, 36, 45], [10, 45, 55]].map(([i, p, h], n) => {
      const y = 70 + n * 78 + (n >= 4 ? 20 : 0);
      return `<text x="130" y="${y + 38}" fill="var(--danger)">제${i}회</text>
    <rect x="280" y="${y}" width="100" height="56" rx="8" fill="var(--danger)" opacity=".22"/><text x="330" y="${y + 38}">${i}</text>
    <rect x="500" y="${y}" width="240" height="56" rx="8" fill="var(--accent)" opacity=".22"/><text x="620" y="${y + 38}">${p} + ${i}</text>
    <rect x="870" y="${y}" width="120" height="56" rx="8" fill="var(--danger)" opacity=".22"/><text x="930" y="${y + 38}">${h}</text>
    <line x1="384" y1="${y + 28}" x2="494" y2="${y + 28}" stroke="var(--danger)" stroke-width="3" marker-end="url(#a6h1s)"/>
    <line x1="744" y1="${y + 28}" x2="864" y2="${y + 28}" stroke="var(--danger)" stroke-width="3" marker-end="url(#a6h1s)"/>`;
    }).join('\n    ')}
    <text x="620" y="400" fill="var(--muted)">⋮</text>
  </g>
  <text x="1030" y="200" font-size="24" fill="var(--muted)">새 hap 이</text>
  <text x="1030" y="235" font-size="24" fill="var(--muted)">다음 회차의</text>
  <text x="1030" y="270" font-size="24" fill="var(--muted)">이전 hap</text>
</svg>`, caption: 'hap 은 0 → 1 → 3 → 6 → 10 → … → 45 → 55 로 누적된다',
        notes: '<p>(3분) 표를 함께 채워 가는 방식으로 진행하면 좋습니다: 칠판에 회차/i/hap 3열을 그리고 학생들이 불러 주게 하세요.</p><p>누적 합계 3단계 공식(초기화 → 누적 → 출력)을 강조.</p>' },
      { layout: 'quiz', title: '확인 문제', q: '다음 코드의 출력은?<br><code>hap = 0<br>for i in range(1, 5) :<br>&nbsp;&nbsp;&nbsp;&nbsp;hap = hap + i<br>print(hap)</code>', options: ['10', '15', '4', '6'], answer: 0, explain: 'range(1, 5) 는 1, 2, 3, 4 → 합계 10. 끝값 5 는 포함되지 않습니다.',
        notes: '<p>(2분) 15 를 고르는 학생이 많을 것입니다. 앞의 range 슬라이드로 돌아가 다시 확인시키세요.</p>' },
      { layout: 'practice', title: '실습 6-1. 카운트다운', desc: '10부터 1까지 거꾸로 한 줄에 출력한 뒤, 다음 줄에 "발사!" 를 출력하세요.',
        starter: `# TODO: 10부터 1까지 거꾸로 한 줄에 출력

# TODO: 줄을 바꾸고 "발사!" 출력
`, solution: `for i in range(10, 0, -1) :
    print(i, end=" ")
print()
print("발사!")
`,
        notes: '<p>(4분) 막히는 학생에게: "range 의 증가값을 음수로", "끝값은 멈출 값 하나 더 아래". 마지막 <code>print()</code> 가 줄바꿈 역할을 한다는 것도 짚어 주세요.</p>' },
      { layout: 'summary', title: '정리', bullets: [
        '반복문: 같은 코드를 여러 번 실행 — 코드가 짧고 고치기 쉽다',
        '<code>for 변수 in range(시작값, 끝값+1, 증가값) :</code> + 들여쓰기 블록',
        'range() 의 끝값은 포함되지 않는다 · 증가값이 음수면 감소',
        '반복 변수 i 를 블록 안에서 사용 가능 · 안 쓰면 <code>_</code>',
        '누적 합계: 반복 전 <code>hap = 0</code> → 반복 안 <code>hap = hap + i</code> → 반복 후 출력'
      ], notes: '<p>(1분) 다음 시간: 홀수만 더하기, 키보드로 입력한 값까지 합계, 구구단 한 단 출력.</p>' }
    ]
  };

  /* ════════════════════════════════════════════════════════════════
     6-2. for 문 활용 — 조건에 맞는 합계와 입력
     ════════════════════════════════════════════════════════════════ */
  const S2 = {
    id: 'ch06-2',
    title: 'for 문 활용: 입력값까지의 합계와 구구단 한 단',
    minutes: 50,
    goals: [
      '증가값을 조절해 홀수 · 배수만 골라 더할 수 있다',
      'input() 으로 입력받은 값을 range() 의 시작값 · 끝값 · 증가값으로 사용할 수 있다',
      '입력한 단의 구구단을 for 문으로 출력할 수 있다'
    ],
    flow: [['복습: 누적 합계 공식', 5], ['홀수의 합계 (Code06-03)', 10], ['입력값까지의 합계 (Code06-04, 05)', 15], ['구구단 한 단 (Code06-06)', 10], ['SELF STUDY · 퀴즈', 10]],
    content: [
      { type: 'h', text: '500과 1000 사이에 있는 홀수의 합계' },
      { type: 'p', html: '지난 시간의 누적 합계 코드에서 <code>range()</code> 만 바꾸면 여러 가지 합계를 구할 수 있습니다. 500 과 1000 사이의 홀수는 <b>501 부터 2씩 증가</b>하는 수이므로 <code>range(501, 1001, 2)</code> 를 씁니다.' },
      { type: 'code', title: 'Code06-03. 500과 1000 사이에 있는 홀수의 합계', code: `i, hap = 0, 0

for i in range(501, 1001, 2) :
    hap = hap + i

print("500과 1000 사이에 있는 홀수의 합계 : %d" % hap)`, expect: `500과 1000 사이에 있는 홀수의 합계 : 187500`, desc: 'i 는 501, 503, 505, …, 999 로 변합니다. 끝값 1001 은 포함되지 않지만 어차피 1000 보다 크므로 결과에 영향이 없습니다.' },
      { type: 'callout', kind: 'more', title: '📘 더 알아보기: if 문으로 홀수 고르기', html: '증가값 대신 5장에서 배운 <b>if 문</b>으로 홀수를 골라도 같은 결과가 나옵니다. 모든 수를 한 번씩 검사하므로 반복 횟수는 두 배지만, "어떤 조건을 만족하는 수만 더하기" 처럼 <b>규칙이 복잡할 때</b> 쓸 수 있는 더 일반적인 방법입니다.' },
      { type: 'code', title: '추가 예제. if 문으로 홀수만 골라 더하기', code: `hap = 0

for i in range(500, 1001) :
    if i % 2 == 1 :
        hap = hap + i

print("500과 1000 사이에 있는 홀수의 합계 : %d" % hap)`, expect: `500과 1000 사이에 있는 홀수의 합계 : 187500`, desc: '<code>i % 2 == 1</code> 은 "2로 나눈 나머지가 1", 즉 홀수라는 조건입니다. if 문이 for 문 안에 있으므로 <b>8칸</b> 들여쓰기합니다.' },

      { type: 'h', text: '키보드로 입력한 값까지 합계 구하기' },
      { type: 'p', html: '끝값을 코드에 고정하지 않고 <b>사용자가 입력한 수</b>까지 더하도록 바꿔 봅시다. <code>input()</code> 으로 받은 값은 문자열이므로 <code>int()</code> 로 정수로 바꾼 뒤, <code>range(1, num + 1, 1)</code> 의 끝값 자리에 넣습니다.' },
      { type: 'code', title: 'Code06-04. 키보드로 입력한 수까지의 합계', code: `i, hap = 0, 0
num = 0

num = int(input("값을 입력하세요 : "))

for i in range(1, num + 1, 1) :
    hap = hap + i

print("1에서 %d까지의 합계 : %d" % (num, hap))`, stdin: '100\n', expect: `값을 입력하세요 : 100
1에서 100까지의 합계 : 5050`, desc: '입력 예: <code>100</code>. <code>num + 1</code> 로 적어야 입력한 수(100)까지 포함됩니다. <code>9행</code>처럼 <code>%d</code> 가 두 개면 값도 <code>(num, hap)</code> 처럼 괄호로 묶어 순서대로 줍니다.' },
      { type: 'callout', kind: 'tip', title: '다른 값도 입력해 보기', html: '10 → 55, 1000 → 500500. 0 이나 음수를 입력하면? <code>range(1, 1)</code> 처럼 <b>값이 하나도 없는 범위</b>가 되어 반복을 한 번도 하지 않으므로 합계는 0 입니다. 오류는 나지 않습니다.' },
      { type: 'p', html: '시작값 · 끝값 · 증가값을 <b>모두</b> 입력받을 수도 있습니다.' },
      { type: 'code', title: 'Code06-05. 시작값, 끝값, 증가값을 모두 입력받기', code: `i, hap = 0, 0
num1, num2, num3 = 0, 0, 0

num1 = int(input("시작값을 입력하세요 : "))
num2 = int(input("끝값을 입력하세요 : "))
num3 = int(input("증가값을 입력하세요 : "))

for i in range(num1, num2 + 1, num3) :
    hap = hap + i

print("%d에서 %d까지 %d씩 증가시킨 값의 합계 : %d" % (num1, num2, num3, hap))`, stdin: '2\n300\n3\n', expect: `시작값을 입력하세요 : 2
끝값을 입력하세요 : 300
증가값을 입력하세요 : 3
2에서 300까지 3씩 증가시킨 값의 합계 : 15050`, desc: '입력 예: <code>2</code>, <code>300</code>, <code>3</code> → 2, 5, 8, …, 299 를 더합니다. 300 은 2 에서 3씩 더해서는 나오지 않는 수이므로 포함되지 않습니다.' },
      { type: 'callout', kind: 'warn', title: '증가값에 0 을 입력하면?', html: '<code>range()</code> 의 증가값이 0 이면 영원히 끝에 닿을 수 없으므로 파이썬은 <code>ValueError</code> 를 냅니다. 사용자가 이상한 값을 넣을 수 있다는 점을 늘 생각해야 합니다. (예외 처리는 뒤에서 배웁니다)' },
      { type: 'code', title: '추가 예제. 증가값이 0 인 range()', expectError: true, code: `for i in range(1, 10, 0) :
    print(i)`, expect: `Traceback (most recent call last):
  File "main.py", line 1, in <module>
    for i in range(1, 10, 0) :
             ~~~~~^^^^^^^^^^
ValueError: range() arg 3 must not be zero` },

      { type: 'h', text: '입력한 단의 구구단 출력하기' },
      { type: 'p', html: '구구단 한 단은 <b>단(dan)은 고정</b>이고 곱하는 수만 1~9 로 바뀝니다. 그러니 곱하는 수를 반복 변수 <code>i</code> 로 만들면 됩니다.' },
      { type: 'code', title: 'Code06-06. 입력한 단의 구구단 출력', code: `i, dan = 0, 0

dan = int(input("단을 입력하세요 : "))

for i in range(1, 10, 1) :
    print("%d  X  %d  = %2d" % (dan, i, dan * i))`, stdin: '7\n', expect: `단을 입력하세요 : 7
7  X  1  =  7
7  X  2  = 14
7  X  3  = 21
7  X  4  = 28
7  X  5  = 35
7  X  6  = 42
7  X  7  = 49
7  X  8  = 56
7  X  9  = 63`, desc: '<code>%2d</code> 는 "두 칸을 확보하고 오른쪽에 맞춰 정수 출력" 입니다. 한 자리 수 7 앞에 공백이 한 칸 생겨 두 자리 수들과 줄이 맞습니다.' },
      { type: 'callout', kind: 'more', title: '📘 더 알아보기: f-string 으로 쓰기', html: '요즘 파이썬 코드에서는 <code>%</code> 서식 대신 <b>f-string</b> 을 많이 씁니다. <code>{값:2d}</code> 가 <code>%2d</code> 와 같은 뜻입니다.<pre><code>for i in range(1, 10) :\n    print(f"{dan}  X  {i}  = {dan * i:2d}")</code></pre>' },
      { type: 'code', title: '추가 예제. f-string 으로 쓴 구구단 한 단', code: `dan = int(input("단을 입력하세요 : "))

for i in range(1, 10) :
    print(f"{dan}  X  {i}  = {dan * i:2d}")`, stdin: '3\n', expect: `단을 입력하세요 : 3
3  X  1  =  3
3  X  2  =  6
3  X  3  =  9
3  X  4  = 12
3  X  5  = 15
3  X  6  = 18
3  X  7  = 21
3  X  8  = 24
3  X  9  = 27` }
    ],
    practice: [
      {
        title: 'SELF STUDY 6-1. 7의 배수 합계', level: 1,
        desc: '<p>Code06-03 을 0 과 100 사이에 있는 <b>7의 배수</b>의 합계를 구하도록 수정해 보세요.</p><pre>0과 100 사이에 있는 7의 배수 합계 : 735</pre>',
        hint: '7의 배수는 7부터 7씩 증가합니다: <code>range(7, 101, 7)</code> (0 부터 시작해도 결과는 같습니다)',
        starter: `i, hap = 0, 0

# TODO: range() 를 7의 배수가 나오도록 바꾸기
for i in range(501, 1001, 2) :
    hap = hap + i

print("0과 100 사이에 있는 7의 배수 합계 : %d" % hap)
`,
        solution: `i, hap = 0, 0

for i in range(0, 101, 7) :
    hap = hap + i

print("0과 100 사이에 있는 7의 배수 합계 : %d" % hap)
`,
        expect: `0과 100 사이에 있는 7의 배수 합계 : 735`
      },
      {
        title: 'SELF STUDY 6-2. 구구단을 거꾸로 출력', level: 1,
        desc: '<p>Code06-06 을 수정해서 입력한 단을 <b>거꾸로</b>(×9 부터 ×1 까지) 출력하도록 해 보세요.</p><pre>단을 입력하세요 : 7\n7  X  9  = 63\n7  X  8  = 56\n… 중략 …\n7  X  1  =  7</pre><p>(강의자료의 출력 예시는 곱하는 수와 단의 위치가 뒤섞여 있어 바로잡았습니다.)</p>',
        hint: '<code>range(9, 0, -1)</code> 은 9, 8, …, 1 을 만듭니다.',
        starter: `i, dan = 0, 0

dan = int(input("단을 입력하세요 : "))

# TODO: range() 를 거꾸로 바꾸기
for i in range(1, 10, 1) :
    print("%d  X  %d  = %2d" % (dan, i, dan * i))
`,
        solution: `i, dan = 0, 0

dan = int(input("단을 입력하세요 : "))

for i in range(9, 0, -1) :
    print("%d  X  %d  = %2d" % (dan, i, dan * i))
`,
        stdin: '7\n',
        expect: `단을 입력하세요 : 7
7  X  9  = 63
7  X  8  = 56
7  X  7  = 49
7  X  6  = 42
7  X  5  = 35
7  X  4  = 28
7  X  3  = 21
7  X  2  = 14
7  X  1  =  7`
      },
      {
        title: '실습 6-3. 입력한 수의 약수 출력', level: 2,
        desc: '<p>정수를 입력받아 그 수의 <b>약수</b>(나누어떨어지게 하는 수)를 한 줄에 출력하고, 약수의 개수도 출력하세요.</p><pre>정수를 입력하세요 : 12\n1 2 3 4 6 12\n약수의 개수 : 6</pre>',
        hint: '1 부터 입력한 수까지 반복하면서 <code>num % i == 0</code> 이면 출력하고 개수를 1 늘립니다.',
        starter: `num = int(input("정수를 입력하세요 : "))
count = 0
# TODO: 1부터 num 까지 반복하며 약수이면 출력하고 count 를 1 증가

print()
print("약수의 개수 : %d" % count)
`,
        solution: `num = int(input("정수를 입력하세요 : "))
count = 0
for i in range(1, num + 1) :
    if num % i == 0 :
        print(i, end=" ")
        count = count + 1

print()
print("약수의 개수 : %d" % count)
`,
        stdin: '12\n',
        expect: `정수를 입력하세요 : 12
1 2 3 4 6 12
약수의 개수 : 6`
      }
    ],
    quiz: [
      { q: '500 과 1000 사이의 홀수를 모두 만드는 range() 는?', options: ['range(500, 1000, 2)', 'range(501, 1001, 2)', 'range(501, 1000)', 'range(1, 1001, 2)'], answer: 1, explain: '501 에서 시작해 2씩 증가하면 모두 홀수입니다. 끝값 1001 은 포함되지 않습니다.' },
      { q: '입력한 수 num 까지 포함해 1부터 반복하려면?', options: ['range(1, num)', 'range(0, num)', 'range(1, num + 1)', 'range(num)'], answer: 2, explain: '끝값은 포함되지 않으므로 <code>num + 1</code> 을 써야 num 까지 반복합니다.' },
      { q: '다음 코드에서 3을 입력했을 때 출력은?<pre><code>n = int(input())\nhap = 0\nfor i in range(n, 0, -1) :\n    hap = hap + i\nprint(hap)</code></pre>', options: ['3', '5', '6', '0'], answer: 2, explain: 'i 는 3, 2, 1 → 합계 6.' },
      { q: '<code>print("%2d" % 7)</code> 의 출력은?', options: ['7', ' 7 (앞에 공백 1칸)', '07', '77'], answer: 1, explain: '<code>%2d</code> 는 2칸을 확보하고 오른쪽 정렬하므로 7 앞에 공백이 하나 생깁니다.' }
    ],
    slides: [
      { layout: 'title', title: 'for 문 활용', subtitle: '홀수의 합계 · 입력값까지의 합계 · 구구단 한 단', badge: '6-2',
        notes: '<p>(1분) 복습 발문: "1~10 합계 코드에서 꼭 필요한 3단계는?" → 초기화, 누적, 출력. 오늘은 range() 의 세 값을 바꾸고, 입력으로 받는 연습을 합니다.</p>' },
      { layout: 'code', title: 'Code06-03. 500~1000 사이 홀수의 합계', code: `i, hap = 0, 0

for i in range(501, 1001, 2) :
    hap = hap + i

print("500과 1000 사이에 있는 홀수의 합계 : %d" % hap)`, points: ['501 부터 <b>2씩</b> 증가 → 홀수만', '누적 합계 구조는 그대로', '결과: 187500'],
        notes: '<p>(3분) 발문: "짝수의 합계로 바꾸려면?" → <code>range(500, 1001, 2)</code>. 직접 바꿔 실행(188250).</p>' },
      { layout: 'two', title: '홀수 고르기 — 두 가지 방법',
        left: { title: '증가값 2 로 건너뛰기', code: `hap = 0
for i in range(501, 1001, 2) :
    hap = hap + i
print(hap)` },
        right: { title: 'if 문으로 고르기', code: `hap = 0
for i in range(500, 1001) :
    if i % 2 == 1 :
        hap = hap + i
print(hap)` },
        notes: '<p>(3분) 두 방법 모두 187500. 오른쪽은 5장 if 문과 결합한 형태 — 조건이 복잡할 때(예: 3의 배수이면서 5의 배수가 아닌 수) 유용합니다.</p><p>들여쓰기 8칸(for 안의 if 안) 을 짚어 주세요.</p>' },
      { layout: 'code', title: 'Code06-04. 입력한 수까지의 합계', code: `i, hap = 0, 0
num = 0

num = int(input("값을 입력하세요 : "))

for i in range(1, num + 1, 1) :
    hap = hap + i

print("1에서 %d까지의 합계 : %d" % (num, hap))`, stdin: '100\n', points: ['<code>int(input())</code> 으로 정수 입력', '끝값 자리에 <b>num + 1</b>', '<code>%d</code> 두 개 → <code>(num, hap)</code>'],
        notes: '<p>(4분) 100 → 5050, 10 → 55 를 각각 입력. 0 을 입력하면? → 반복 0회, 합계 0 (오류 아님).</p><p>가우스 일화(1~100 합을 순식간에)를 곁들이면 좋습니다.</p>' },
      { layout: 'code', title: 'Code06-05. 시작 · 끝 · 증가값 입력', code: `i, hap = 0, 0
num1, num2, num3 = 0, 0, 0

num1 = int(input("시작값을 입력하세요 : "))
num2 = int(input("끝값을 입력하세요 : "))
num3 = int(input("증가값을 입력하세요 : "))

for i in range(num1, num2 + 1, num3) :
    hap = hap + i

print("%d에서 %d까지 %d씩 증가시킨 값의 합계 : %d" % (num1, num2, num3, hap))`, stdin: '2\n300\n3\n', points: ['range() 의 세 값 모두 변수', '입력 2, 300, 3 → 15050', '증가값 0 → <code>ValueError</code>'],
        notes: '<p>(4분) 예시 입력으로 실행 후, 증가값에 0 을 넣어 오류를 보여 줍니다. "사용자는 늘 예상 밖의 값을 넣는다" — 입력 검사의 필요성.</p>' },
      { layout: 'code', title: 'Code06-06. 입력한 단의 구구단', code: `i, dan = 0, 0

dan = int(input("단을 입력하세요 : "))

for i in range(1, 10, 1) :
    print("%d  X  %d  = %2d" % (dan, i, dan * i))`, stdin: '7\n', points: ['단은 고정, 곱하는 수 i 만 1~9', '<code>%2d</code>: 2칸 오른쪽 정렬', '줄이 가지런히 맞는다'],
        notes: '<p>(4분) <code>%2d</code> 를 <code>%d</code> 로 바꿔 실행 → 7 과 14 의 줄이 어긋나는 것을 비교.</p><p>발문: "2단부터 9단까지 전부 출력하려면?" → 다음 시간의 중첩 for 문 예고.</p>' },
      { layout: 'code', title: '📘 f-string 으로 쓴 구구단', code: `dan = int(input("단을 입력하세요 : "))

for i in range(1, 10) :
    print(f"{dan}  X  {i}  = {dan * i:2d}")`, stdin: '3\n', points: ['<code>f"…{값}…"</code> 안에 변수 직접', '<code>{값:2d}</code> = <code>%2d</code>', '최신 파이썬에서 가장 많이 쓰는 방식'],
        notes: '<p>(2분) 보충 내용. 교재는 % 서식을 쓰지만, 실무 코드를 읽을 때 f-string 을 많이 만나게 된다는 정도로 소개.</p>' },
      { layout: 'quiz', title: '확인 문제', q: '<code>range(2, 11, 3)</code> 으로 만든 값의 합계는?', options: ['15', '26', '20', '18'], answer: 0, explain: '2, 5, 8 → 15. 11 은 포함되지 않고, 2 + 3×3 = 11 도 끝값이므로 제외됩니다.',
        notes: '<p>(2분) 값을 먼저 나열하게 한 뒤 합계를 구하게 하세요.</p>' },
      { layout: 'practice', title: 'SELF STUDY 6-1. 7의 배수 합계', desc: 'Code06-03 을 0과 100 사이에 있는 7의 배수 합계를 구하도록 수정해 보세요. (결과: 735)',
        starter: `i, hap = 0, 0

for i in range(501, 1001, 2) :
    hap = hap + i

print("0과 100 사이에 있는 7의 배수 합계 : %d" % hap)
`, solution: `i, hap = 0, 0

for i in range(0, 101, 7) :
    hap = hap + i

print("0과 100 사이에 있는 7의 배수 합계 : %d" % hap)
`,
        notes: '<p>(3분) range(7, 101, 7) 로 해도 정답입니다. if 문으로 <code>i % 7 == 0</code> 을 검사한 풀이도 인정해 주세요.</p>' },
      { layout: 'practice', title: 'SELF STUDY 6-2. 구구단 거꾸로', desc: 'Code06-06 을 수정해서 입력한 단을 ×9 부터 ×1 까지 거꾸로 출력하세요.', stdin: '7\n',
        starter: `dan = int(input("단을 입력하세요 : "))

for i in range(1, 10, 1) :
    print("%d  X  %d  = %2d" % (dan, i, dan * i))
`, solution: `dan = int(input("단을 입력하세요 : "))

for i in range(9, 0, -1) :
    print("%d  X  %d  = %2d" % (dan, i, dan * i))
`,
        notes: '<p>(3분) 교재 출력 예시(9 X 7 = 63, 8 X 2 = 56 …)는 오타입니다. "7 X 9 = 63 … 7 X 1 = 7" 이 올바른 결과라고 안내하세요.</p>' },
      { layout: 'summary', title: '정리', bullets: [
        '증가값으로 홀수 · 배수만 골라 반복 (<code>range(501, 1001, 2)</code>)',
        'if 문과 결합하면 더 복잡한 조건도 가능',
        '입력값을 range() 에 넣기: <code>range(1, num + 1)</code>',
        '증가값 0 은 <code>ValueError</code>',
        '구구단 한 단: 단 고정, 곱하는 수를 반복 변수로 · <code>%2d</code> 로 정렬'
      ], notes: '<p>(1분) 다음 시간: for 문 안에 for 문 — 중첩 for 문과 [프로그램 1] 구구단 완성.</p>' }
    ]
  };

  /* ════════════════════════════════════════════════════════════════
     6-3. 중첩 for 문과 [프로그램 1] 구구단
     ════════════════════════════════════════════════════════════════ */
  const S3 = {
    id: 'ch06-3',
    title: '중첩 for 문과 [프로그램 1] 구구단 출력',
    minutes: 50,
    goals: [
      'for 문 안에 for 문이 들어간 중첩 for 문의 실행 순서를 설명할 수 있다',
      '바깥 · 안쪽 반복 변수의 변화를 표로 추적할 수 있다',
      '중첩 for 문으로 2단~9단 구구단을 세로 · 가로로 출력할 수 있다'
    ],
    flow: [['도입: 시계의 시침과 분침', 5], ['중첩 for 문의 형식 · 처리 순서', 15], ['2단~9단 구구단 (Code06-07)', 10], ['[프로그램 1] 완성 (Code06-08)', 15], ['퀴즈 · 정리', 5]],
    content: [
      { type: 'h', text: '중첩 for 문의 개념' },
      { type: 'p', html: '<b>중첩 for 문(nested for)</b>은 for 문 안에 또 다른 for 문이 들어 있는 형태입니다. 바깥 for 문이 한 번 돌 때마다 안쪽 for 문은 <b>처음부터 끝까지 전부</b> 반복합니다.' },
      { type: 'p', html: '시계를 떠올려 보세요. 시침이 한 칸 움직이는 동안 분침은 한 바퀴(60번)를 돕니다. 시침이 바깥 for 문, 분침이 안쪽 for 문입니다. 바깥이 3번, 안쪽이 2번 반복하면 안쪽 블록은 모두 <b>3 × 2 = 6번</b> 실행됩니다.' },
      { type: 'figure', caption: '그림 6-2 중첩 for 문의 작동 개념', html: `<svg viewBox="0 0 620 300" width="100%" style="max-width:620px" font-family="sans-serif">
  <defs>
    <marker id="a6n1" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--danger)"/></marker>
    <marker id="a6n2" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/></marker>
  </defs>
  <g fill="none" stroke-dasharray="6 5" stroke-width="2">
    <ellipse cx="310" cy="160" rx="290" ry="130" stroke="var(--danger)"/>
    <ellipse cx="310" cy="160" rx="270" ry="116" stroke="var(--danger)"/>
    <ellipse cx="310" cy="160" rx="250" ry="102" stroke="var(--danger)"/>
    <ellipse cx="310" cy="190" rx="150" ry="52" stroke="var(--accent)"/>
    <ellipse cx="310" cy="190" rx="130" ry="40" stroke="var(--accent)"/>
  </g>
  <g stroke-width="2" fill="none">
    <path d="M330 30 L350 30" stroke="var(--danger)" marker-end="url(#a6n1)"/>
    <path d="M330 138 L350 138" stroke="var(--accent)" marker-end="url(#a6n2)"/>
  </g>
  <g font-size="17" text-anchor="middle" font-weight="bold" fill="var(--fg)">
    <text x="310" y="95">바깥 for 문 (총 3회 반복)</text>
    <text x="310" y="125" fill="var(--accent)">안쪽 for 문 (각각 2회 반복 = 총 6회)</text>
    <text x="310" y="197">반복할 문장들</text>
  </g>
</svg>` },
      { type: 'h', text: '중첩 for 문의 기본 형식' },
      { type: 'code', title: '예. 중첩 for 문의 기본 형식', code: `for i in range(0, 3, 1) :
    for k in range(0, 2, 1) :
        print("파이썬은 꿀잼입니다. ^^ (i값 : %d, k값 : %d)" % (i, k))`, expect: `파이썬은 꿀잼입니다. ^^ (i값 : 0, k값 : 0)
파이썬은 꿀잼입니다. ^^ (i값 : 0, k값 : 1)
파이썬은 꿀잼입니다. ^^ (i값 : 1, k값 : 0)
파이썬은 꿀잼입니다. ^^ (i값 : 1, k값 : 1)
파이썬은 꿀잼입니다. ^^ (i값 : 2, k값 : 0)
파이썬은 꿀잼입니다. ^^ (i값 : 2, k값 : 1)`, desc: '안쪽 for 문은 바깥 for 문 안에 있으므로 4칸, 안쪽 for 문이 반복할 <code>print()</code> 는 다시 4칸을 더해 <b>8칸</b> 들여씁니다.' },
      { type: 'h', text: '처리 순서' },
      { type: 'p', html: '바깥 변수 <code>i</code> 는 0, 1, 2 로 한 번씩 바뀌고 끝나지만, 안쪽 변수 <code>k</code> 는 <b>i 가 바뀔 때마다 0 과 1 을 다시 반복</b>합니다.' },
      { type: 'list', ordered: true, items: [
        '바깥 for 문 1회: <code>i</code> 에 0 대입 → 안쪽 for 문 1회: <code>k</code> 에 0 대입 후 print() / 안쪽 2회: <code>k</code> 에 1 대입 후 print()',
        '바깥 for 문 2회: <code>i</code> 에 1 대입 → 안쪽 for 문 1회: <code>k</code> 에 0 대입 후 print() / 안쪽 2회: <code>k</code> 에 1 대입 후 print()',
        '바깥 for 문 3회: <code>i</code> 에 2 대입 → 안쪽 for 문 1회: <code>k</code> 에 0 대입 후 print() / 안쪽 2회: <code>k</code> 에 1 대입 후 print()'
      ] },
      { type: 'figure', caption: '그림 6-3 중첩 for 문에서 i 와 k 값 변화', html: `<svg viewBox="0 0 560 330" width="100%" style="max-width:560px" font-family="sans-serif">
  <defs>
    <marker id="a6k1" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--danger)"/></marker>
    <marker id="a6k2" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/></marker>
  </defs>
  <g font-size="16" text-anchor="middle" font-weight="bold">
    <rect x="160" y="6" width="60" height="28" fill="var(--card)" stroke="var(--line)"/><text x="190" y="26" fill="var(--fg)">i값</text>
    <rect x="310" y="6" width="60" height="28" fill="var(--card)" stroke="var(--line)"/><text x="340" y="26" fill="var(--fg)">k값</text>
    ${[0, 1, 2].map((i) => {
      const y = 45 + i * 97;
      return `<text x="60" y="${y + 38}" fill="var(--danger)">제${i + 1}회</text>
    <rect x="160" y="${y + 18}" width="60" height="34" fill="var(--danger)" opacity=".25"/><text x="190" y="${y + 41}" fill="var(--fg)">${i}</text>
    <line x1="222" y1="${y + 35}" x2="302" y2="${y + 35}" stroke="var(--danger)" stroke-width="2" marker-end="url(#a6k1)"/>
    <rect x="310" y="${y}" width="60" height="32" fill="var(--accent)" opacity=".25"/><text x="340" y="${y + 22}" fill="var(--fg)">0</text>
    <rect x="310" y="${y + 38}" width="60" height="32" fill="var(--accent)" opacity=".25"/><text x="340" y="${y + 60}" fill="var(--fg)">1</text>
    <path d="M372 ${y + 16} H400 V${y + 54} H378" fill="none" stroke="var(--accent)" stroke-width="2" marker-end="url(#a6k2)"/>
    <text x="460" y="${y + 41}" fill="var(--fg)" font-weight="normal">안쪽 for 문</text>`;
    }).join('\n    ')}
  </g>
  <g stroke="var(--danger)" stroke-width="2" fill="none" marker-end="url(#a6k1)">
    <path d="M160 80 H135 V175 H154"/><path d="M160 177 H135 V272 H154"/>
  </g>
  <g font-size="14" fill="var(--fg)"><text x="90" y="133">바깥 for 문</text><text x="90" y="230">바깥 for 문</text></g>
</svg>` },
      { type: 'table', caption: '중첩 for 문의 실행 순서 추적', head: ['print() 실행 순서', '바깥 i', '안쪽 k', '설명'], rows: [
        ['1번째', '0', '0', 'i = 0 이 되고, 안쪽 반복 시작'],
        ['2번째', '0', '1', '안쪽 반복 끝 → 바깥으로'],
        ['3번째', '1', '0', 'i = 1 이 되고, k 는 <b>다시 0 부터</b>'],
        ['4번째', '1', '1', '안쪽 반복 끝 → 바깥으로'],
        ['5번째', '2', '0', 'i = 2 가 되고, k 는 다시 0 부터'],
        ['6번째', '2', '1', '안쪽 · 바깥 모두 끝']
      ] },
      { type: 'callout', kind: 'tip', title: '안쪽 블록의 실행 횟수 = 바깥 횟수 × 안쪽 횟수', html: '바깥 3회 × 안쪽 2회 = 6회. 구구단(2~9단 × 1~9)이라면 8 × 9 = <b>72회</b> 입니다. 중첩 for 문의 결과를 예측할 때는 먼저 "몇 번 실행되는가" 를 계산해 보세요.' },
      { type: 'callout', kind: 'warn', title: '흔한 실수: 안쪽과 바깥 변수 이름을 같게 쓰기', html: '안쪽 for 문에서도 <code>i</code> 를 쓰면 바깥의 <code>i</code> 값이 덮어써집니다. 파이썬은 바깥 반복의 다음 값을 range() 에서 다시 꺼내므로 반복 횟수는 유지되지만, 안쪽 반복이 끝난 뒤 <code>i</code> 를 쓰는 코드는 엉뚱한 값을 보게 됩니다. <b>바깥은 i, 안쪽은 k(또는 j)</b> 처럼 다른 이름을 쓰세요.' },

      { type: 'h', text: '중첩 for 문의 활용: 2단부터 9단까지 구구단' },
      { type: 'p', html: '구구단에서 바뀌는 것은 두 가지입니다. <b>단</b>(2~9)과 <b>곱하는 수</b>(1~9). 단이 하나 바뀔 때마다 곱하는 수는 1~9 를 다시 반복하므로, 단을 바깥 변수 <code>i</code>, 곱하는 수를 안쪽 변수 <code>k</code> 로 정하면 됩니다.' },
      { type: 'figure', caption: '그림 6-4 구구단에서 i 와 k 변수 추출 — 바깥 for 문: i(단), 안쪽 for 문: k(곱하는 수)', html: `<svg viewBox="0 0 660 330" width="100%" style="max-width:660px" font-family="sans-serif">
  <defs>
    <marker id="a6g1" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--danger)"/></marker>
    <marker id="a6g2" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/></marker>
  </defs>
  <text x="330" y="18" text-anchor="middle" font-size="14" font-weight="bold" fill="var(--danger)">2에서 9까지 증가 후 종료 (바깥 for 문 : i 변수)</text>
  <line x1="20" y1="30" x2="640" y2="30" stroke="var(--danger)" stroke-width="2" marker-end="url(#a6g1)"/>
  <g font-size="14" font-family="monospace" fill="var(--fg)">
    ${[2, 3, 4, 9].map((d, c) => {
      const x = 20 + c * 160 + (c === 3 ? 0 : 0);
      const rows = range(1, 10, 1).map((k, r) => `<text x="${x + 10}" y="${70 + r * 22}"><tspan fill="var(--danger)" font-weight="bold">${d}</tspan> × <tspan fill="var(--accent)" font-weight="bold">${k}</tspan> = ${p2(d * k)}</text>`).join('');
      return `<rect x="${x}" y="48" width="120" height="208" rx="6" fill="var(--card)" stroke="var(--line)"/>${rows}
    <rect x="${x + 40}" y="54" width="20" height="200" rx="4" fill="none" stroke="var(--accent)" stroke-width="1.5"/>
    <circle cx="${x + 18}" cy="65" r="11" fill="none" stroke="var(--danger)" stroke-width="2"/>`;
    }).join('\n    ')}
    <text x="490" y="160" font-size="22" fill="var(--muted)">…</text>
  </g>
  <path d="M70 268 V285 H550 V268" fill="none" stroke="var(--accent)" stroke-width="2"/>
  <line x1="310" y1="285" x2="310" y2="300" stroke="var(--accent)" stroke-width="2"/>
  <text x="330" y="318" text-anchor="middle" font-size="14" font-weight="bold" fill="var(--accent)">1에서 9까지 계속 반복해서 증가 (안쪽 for 문 : k 변수)</text>
</svg>` },
      { type: 'code', title: 'Code06-07. 2단부터 9단까지 구구단 출력', code: `i, k = 0, 0

for i in range(2, 10, 1) :
    for k in range(1, 10, 1) :
        print("%d X %d = %2d" % (i, k, i * k))
    print("")`, expect: guguVertical(false), desc: '<code>6행</code>의 <code>print("")</code> 는 안쪽 for 문 <b>밖</b>(4칸 들여쓰기)에 있으므로 한 단이 끝날 때마다 한 번씩 실행되어 단 사이에 빈 줄을 넣습니다.' },
      { type: 'callout', kind: 'info', title: 'print("") 의 들여쓰기 위치에 따라', html: '<ul><li><b>8칸</b>(안쪽 for 문 안): 곱셈 한 줄마다 빈 줄 → 72번</li><li><b>4칸</b>(바깥 for 문 안): 한 단이 끝날 때마다 빈 줄 → 8번</li><li><b>0칸</b>(for 문 밖): 모든 단이 끝난 뒤 빈 줄 → 1번</li></ul>같은 문장이라도 들여쓰기에 따라 실행 횟수가 완전히 달라집니다.' },

      { type: 'h', text: '[프로그램 1]의 완성: 구구단을 가로로 출력하기' },
      { type: 'p', html: 'Code06-07 은 단을 <b>세로</b>로 출력합니다. 이제 처음에 본 [프로그램 1]처럼 2단~9단을 <b>가로로 나란히</b> 출력해 봅시다. 여기서 중요한 사실이 있습니다. 화면(콘솔)은 <b>위에서 아래로, 왼쪽에서 오른쪽으로만</b> 출력됩니다. 일단 줄을 바꿔 아래로 내려가면 <b>다시 위로 올라가서 출력할 수 없습니다.</b>' },
      { type: 'p', html: '그러므로 "2단 전체를 쓰고 3단을 옆에 쓰는" 방식은 불가능합니다. 대신 <b>한 줄씩</b> 생각해야 합니다. 첫째 줄에는 <code>2×1, 3×1, …, 9×1</code>, 둘째 줄에는 <code>2×2, 3×2, …, 9×2</code> … 이렇게 <b>가로 먼저</b> 출력합니다. 즉, 이번에는 바깥 for 문이 <b>곱하는 수</b>(1~9, 9줄), 안쪽 for 문이 <b>단</b>(2~9, 한 줄 안의 8칸)입니다.' },
      { type: 'figure', caption: '그림 6-5 구구단에서 i 와 k 변수 추출 (단 가로 먼저 출력) — 바깥 for 문: i(곱하는 수, 줄), 안쪽 for 문: k(단, 칸)', html: `<svg viewBox="0 0 700 300" width="100%" style="max-width:700px" font-family="sans-serif">
  <defs><marker id="a6g3" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/></marker></defs>
  <g font-size="13" font-family="monospace" fill="var(--fg)">
    ${range(1, 10, 1).map((i, r) => {
      const y = 40 + r * 26;
      const cells = [2, 3, 4, 9].map((k, c) => `<text x="${40 + c * 140 + (c === 3 ? 20 : 0)}" y="${y}"><tspan fill="var(--accent)" font-weight="bold">${k}</tspan> × <tspan fill="var(--danger)" font-weight="bold">${i}</tspan> = ${p2(k * i)}</text>`).join('');
      return `${cells}<line x1="30" y1="${y + 6}" x2="610" y2="${y + 6}" stroke="var(--accent)" stroke-width="1.2" marker-end="url(#a6g3)"/><text x="622" y="${y + 4}" font-family="sans-serif" fill="var(--accent)">${i}회</text>`;
    }).join('\n    ')}
    <text x="470" y="140" font-size="20" fill="var(--muted)">…</text>
  </g>
  <text x="330" y="290" text-anchor="middle" font-size="14" font-weight="bold" fill="var(--danger)">1에서 9까지 증가 후 종료 (바깥 for 문 : i 변수) — 한 줄(회)마다 안쪽 k 가 2~9 로 변함</text>
</svg>` },
      { type: 'p', html: '한 줄에 들어갈 8개의 식을 <b>문자열 변수 <code>guguLine</code> 에 이어 붙여</b> 한 줄을 완성한 뒤, 한 번에 <code>print()</code> 합니다. 문자열끼리 <code>+</code> 하면 이어 붙는다는 것(4장)을 이용합니다.' },
      { type: 'code', title: 'Code06-08. [프로그램 1] 완성: 구구단 가로 출력', code: `## 전역 변수 선언 부분 ##
i, k, guguLine = 0, 0, ""

## 메인 코드 부분 ##
for i in range(2, 10) :
    guguLine = guguLine + ("#  %d단  #" % i)

print(guguLine)

for i in range(1, 10) :
    guguLine = ""
    for k in range(2, 10) :
        guguLine = guguLine + str("%2dX %2d= %2d" % (k, i, k * i))
    print(guguLine)`, expect: GUGU_OUT, desc: '<code>5~8행</code>: 제목 줄 "#  2단  #…#  9단  #" 을 만들어 출력합니다. <code>10행</code>: 바깥 for 문은 곱하는 수 i(1~9) → 9줄. <code>11행</code>: 새 줄을 시작할 때마다 <code>guguLine</code> 을 빈 문자열로 비웁니다. <code>12~13행</code>: 안쪽 for 문이 단 k(2~9)의 식 8개를 이어 붙이고, <code>14행</code>에서 완성된 한 줄을 출력합니다.' },
      { type: 'table', caption: 'Code06-07 과 Code06-08 의 반복 변수 비교', head: ['', '바깥 for 문', '안쪽 for 문', '출력 모양'], rows: [
        ['Code06-07 (세로)', '<code>i</code> = 단 (2~9)', '<code>k</code> = 곱하는 수 (1~9)', '한 단을 세로로 쭉 → 다음 단'],
        ['Code06-08 (가로)', '<code>i</code> = 곱하는 수 (1~9) = <b>줄</b>', '<code>k</code> = 단 (2~9) = <b>칸</b>', '한 줄에 모든 단의 같은 곱셈']
      ] },
      { type: 'callout', kind: 'warn', title: 'guguLine = "" 을 빠뜨리면?', html: '<code>11행</code>을 지우면 앞 줄의 내용이 지워지지 않고 계속 이어 붙어서, 줄이 점점 길어지는 이상한 결과가 나옵니다. <b>누적 변수는 새로 누적을 시작할 때마다 초기화</b>한다는 점은 합계(<code>hap = 0</code>)와 같습니다. 직접 지워서 실행해 보세요.' },
      { type: 'callout', kind: 'more', title: '📘 더 알아보기: 문자열을 모으지 않고 end="" 로 출력하기', html: '<code>print(…, end="")</code> 로 줄을 바꾸지 않고 이어서 출력한 뒤, 안쪽 반복이 끝나면 <code>print()</code> 로 줄만 바꿔도 결과는 같습니다. 또 <code>"%2dX %2d= %2d" % (…)</code> 의 결과는 이미 문자열이므로 <code>str()</code> 로 감싸지 않아도 됩니다.' },
      { type: 'code', title: '추가 예제. end="" 를 사용한 가로 구구단', code: `for i in range(2, 10) :
    print("#  %d단  #" % i, end="")
print()

for i in range(1, 10) :
    for k in range(2, 10) :
        print("%2dX %2d= %2d" % (k, i, k * i), end="")
    print()`, expect: GUGU_OUT },

      { type: 'h', text: '중첩 for 문으로 모양 만들기' },
      { type: 'p', html: '중첩 for 문은 <b>줄(바깥)</b>과 <b>칸(안쪽)</b>이 있는 모든 모양에 쓸 수 있습니다. 안쪽 반복 횟수를 바깥 변수 <code>i</code> 에 따라 바꾸면 삼각형이 됩니다. 이 원리가 [프로그램 2] 마름모의 기초입니다.' },
      { type: 'code', title: '추가 예제. 별로 직각삼각형 그리기', code: `for i in range(1, 6) :
    for k in range(0, i) :
        print("*", end="")
    print()`, expect: `*
**
***
****
*****`, desc: 'i 번째 줄에서 안쪽 for 문은 <code>range(0, i)</code> 이므로 정확히 i 번 반복합니다. → 1줄에 1개, 2줄에 2개, …' },
      { type: 'callout', kind: 'more', title: '📘 더 알아보기: 문자열 곱하기', html: '파이썬에서는 <code>"*" * 3</code> 이 <code>"***"</code> 입니다. 그래서 위 삼각형은 <code>for i in range(1, 6): print("*" * i)</code> 한 줄 반복으로도 그릴 수 있습니다. 다만 반복문 원리를 익히는 단계이므로 우선 중첩 for 문으로 연습하세요.' }
    ],
    practice: [
      {
        title: 'SELF STUDY 6-3. 단의 제목 출력', level: 1,
        desc: '<p>Code06-07 을 수정해서 각 단의 제목(<code>## 2단 ##</code>)이 먼저 출력되도록 해 보세요.</p><pre>## 2단 ##\n2 X 1 =  2\n2 X 2 =  4\n2 X 3 =  6\n…</pre>',
        hint: '제목은 한 단에 한 번 → 바깥 for 문 안, 안쪽 for 문 <b>앞</b>(4칸 들여쓰기)에 넣습니다.',
        starter: `i, k = 0, 0

for i in range(2, 10, 1) :
    # TODO: 단의 제목 출력
    for k in range(1, 10, 1) :
        print("%d X %d = %2d" % (i, k, i * k))
    print("")
`,
        solution: `i, k = 0, 0

for i in range(2, 10, 1) :
    print("## %d단 ##" % i)
    for k in range(1, 10, 1) :
        print("%d X %d = %2d" % (i, k, i * k))
    print("")
`,
        expect: guguVertical(true)
      },
      {
        title: 'SELF STUDY 6-4. 가로 구구단을 거꾸로', level: 2,
        desc: '<p>Code06-08 을 수정해서 구구단이 <b>거꾸로</b>(9단 → 2단, ×9 → ×1) 출력되도록 해 보세요.</p><pre>#  9단  ##  8단  #…#  2단  #\n 9X  9= 81 8X  9= 72 …</pre>',
        hint: 'range() 의 값을 큰 값에서 작은 값으로 바꿉니다: <code>range(9, 1, -1)</code>, <code>range(9, 0, -1)</code>',
        starter: `i, k, guguLine = 0, 0, ""

# TODO: 세 곳의 range() 를 거꾸로 바꾸기
for i in range(2, 10) :
    guguLine = guguLine + ("#  %d단  #" % i)

print(guguLine)

for i in range(1, 10) :
    guguLine = ""
    for k in range(2, 10) :
        guguLine = guguLine + str("%2dX %2d= %2d" % (k, i, k * i))
    print(guguLine)
`,
        solution: `i, k, guguLine = 0, 0, ""

for i in range(9, 1, -1) :
    guguLine = guguLine + ("#  %d단  #" % i)

print(guguLine)

for i in range(9, 0, -1) :
    guguLine = ""
    for k in range(9, 1, -1) :
        guguLine = guguLine + str("%2dX %2d= %2d" % (k, i, k * i))
    print(guguLine)
`,
        expect: guguHorizontal(true)
      },
      {
        title: '실습 6-4. 거꾸로 된 직각삼각형', level: 2,
        desc: '<p>줄 수를 입력받아, 첫 줄에 그 개수만큼 <code>*</code> 를 출력하고 한 줄씩 1개씩 줄어드는 삼각형을 중첩 for 문으로 출력하세요.</p><pre>줄 수 : 4\n****\n***\n**\n*</pre>',
        hint: '바깥 for 문은 <code>range(n, 0, -1)</code>, 안쪽은 <code>range(0, i)</code>',
        starter: `n = int(input("줄 수 : "))
# TODO: 중첩 for 문으로 삼각형 출력
`,
        solution: `n = int(input("줄 수 : "))
for i in range(n, 0, -1) :
    for k in range(0, i) :
        print("*", end="")
    print()
`,
        stdin: '4\n',
        expect: `줄 수 : 4
****
***
**
*`
      }
    ],
    quiz: [
      { q: '다음 코드에서 print() 는 모두 몇 번 실행될까요?<pre><code>for i in range(0, 4) :\n    for k in range(0, 3) :\n        print(i, k)</code></pre>', options: ['4번', '7번', '12번', '3번'], answer: 2, explain: '바깥 4회 × 안쪽 3회 = 12회.' },
      { q: '다음 코드의 출력 마지막 줄은?<pre><code>for i in range(1, 3) :\n    for k in range(1, 3) :\n        print(i * k)</code></pre>', options: ['2', '3', '4', '6'], answer: 2, explain: '마지막 반복은 i = 2, k = 2 → 4.' },
      { q: 'Code06-08 에서 구구단을 <b>가로로</b> 출력하기 위해 바깥 for 문이 담당하는 것은?', options: ['단 (2~9)', '곱하는 수 (1~9), 즉 출력할 줄', '제목 줄', '빈 줄'], answer: 1, explain: '화면은 위로 되돌아갈 수 없으므로 한 줄씩 완성합니다. 바깥은 줄(곱하는 수), 안쪽은 칸(단)입니다.' },
      { q: '다음 코드의 출력은?<pre><code>for i in range(1, 4) :\n    for k in range(0, i) :\n        print("#", end="")\n    print()</code></pre>', options: ['###<br>###<br>###', '#<br>##<br>###', '###<br>##<br>#', '#<br>#<br>#'], answer: 1, explain: 'i 번째 줄에서 안쪽이 i 번 반복하므로 1개, 2개, 3개.' }
    ],
    slides: [
      { layout: 'title', title: '중첩 for 문과 [프로그램 1]', subtitle: 'for 문 안의 for 문 · 구구단 출력', badge: '6-3',
        notes: '<p>(1분) 발문: "시계의 분침이 한 바퀴 도는 동안 시침은 몇 칸?" — 한 칸. 바깥 반복 1번에 안쪽 반복 전체. 오늘의 핵심입니다.</p>' },
      { layout: 'diagram', title: '그림 6-2 중첩 for 문의 작동 개념', html: `<svg viewBox="0 0 1280 560" width="100%" font-family="sans-serif">
  <g fill="none" stroke-dasharray="12 9" stroke-width="4">
    <ellipse cx="640" cy="290" rx="600" ry="250" stroke="var(--danger)"/>
    <ellipse cx="640" cy="290" rx="560" ry="222" stroke="var(--danger)"/>
    <ellipse cx="640" cy="290" rx="520" ry="194" stroke="var(--danger)"/>
    <ellipse cx="640" cy="350" rx="300" ry="100" stroke="var(--accent)"/>
    <ellipse cx="640" cy="350" rx="260" ry="76" stroke="var(--accent)"/>
  </g>
  <g font-size="34" text-anchor="middle" font-weight="bold" fill="var(--fg)">
    <text x="640" y="170">바깥 for 문 (총 3회 반복)</text>
    <text x="640" y="230" fill="var(--accent)">안쪽 for 문 (각각 2회 반복 = 총 6회)</text>
    <text x="640" y="362">반복할 문장들</text>
  </g>
</svg>`, caption: '바깥이 1번 돌 때마다 안쪽은 처음부터 끝까지 전부 돈다',
        notes: '<p>(3분) 빨간 고리 3개 = 바깥 3회, 초록 고리 2개가 각 바퀴마다 = 안쪽 2 × 3 = 6회.</p><p>운동장 비유: "운동장을 3바퀴 도는데, 한 바퀴 돌 때마다 줄넘기 2번" → 줄넘기 총 6번.</p>' },
      { layout: 'code', title: '중첩 for 문의 기본 형식', code: `for i in range(0, 3, 1) :
    for k in range(0, 2, 1) :
        print("파이썬은 꿀잼입니다. ^^ (i값 : %d, k값 : %d)" % (i, k))`, points: ['안쪽 for 문은 <b>4칸</b>, 그 블록은 <b>8칸</b>', 'i: 0 → 1 → 2 (한 번씩)', 'k: 0, 1 을 i 마다 <b>다시</b> 반복', '총 3 × 2 = 6줄 출력'],
        notes: '<p>(4분) 실행 전에 출력 6줄을 학생들이 먼저 적게 하세요. 그 다음 실행해 비교.</p><p>range(0, 2, 1) → range(0, 3, 1) 로 바꾸면 몇 줄? (9줄)</p>' },
      { layout: 'bullets', title: '처리 순서', lead: '외부 변수 i 는 0, 1, 2 로 한 번씩, 내부 변수 k 는 0 과 1 을 계속 반복', bullets: [
        '❶ 외부 1회: i ← 0 → 내부 1회 k ← 0 print() → 내부 2회 k ← 1 print()',
        '❷ 외부 2회: i ← 1 → 내부 1회 k ← 0 print() → 내부 2회 k ← 1 print()',
        '❸ 외부 3회: i ← 2 → 내부 1회 k ← 0 print() → 내부 2회 k ← 1 print()',
        '안쪽이 끝나야 바깥의 다음 회차로 넘어간다'
      ], notes: '<p>(3분) "k 가 1 에서 끝났는데 다음에 왜 0 이 되나요?" 라는 질문이 꼭 나옵니다. 안쪽 for 문이 <b>새로 시작</b>되면서 range(0, 2) 를 처음부터 다시 꺼내기 때문입니다.</p>' },
      { layout: 'diagram', title: '그림 6-3 i 와 k 값 변화', html: `<svg viewBox="0 0 1280 560" width="100%" font-family="sans-serif">
  <defs>
    <marker id="a6k1s" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--danger)"/></marker>
    <marker id="a6k2s" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/></marker>
  </defs>
  <g font-size="30" text-anchor="middle" font-weight="bold">
    <text x="440" y="40" fill="var(--fg)">i값</text><text x="720" y="40" fill="var(--fg)">k값</text>
    ${[0, 1, 2].map((i) => {
      const y = 60 + i * 165;
      return `<text x="220" y="${y + 75}" fill="var(--danger)">제${i + 1}회</text>
    <rect x="390" y="${y + 40}" width="100" height="56" rx="6" fill="var(--danger)" opacity=".25"/><text x="440" y="${y + 78}" fill="var(--fg)">${i}</text>
    <line x1="494" y1="${y + 68}" x2="660" y2="${y + 68}" stroke="var(--danger)" stroke-width="4" marker-end="url(#a6k1s)"/>
    <rect x="670" y="${y}" width="100" height="56" rx="6" fill="var(--accent)" opacity=".25"/><text x="720" y="${y + 38}" fill="var(--fg)">0</text>
    <rect x="670" y="${y + 70}" width="100" height="56" rx="6" fill="var(--accent)" opacity=".25"/><text x="720" y="${y + 108}" fill="var(--fg)">1</text>
    <path d="M774 ${y + 28} H830 V${y + 98} H780" fill="none" stroke="var(--accent)" stroke-width="4" marker-end="url(#a6k2s)"/>
    <text x="960" y="${y + 75}" fill="var(--accent)" font-weight="normal">내부 for 문</text>`;
    }).join('\n    ')}
  </g>
  <g stroke="var(--danger)" stroke-width="4" fill="none" marker-end="url(#a6k1s)">
    <path d="M390 118 H340 V283 H384"/><path d="M390 303 H340 V448 H384"/>
  </g>
</svg>`, caption: 'i 는 한 번씩, k 는 i 가 바뀔 때마다 0 → 1 을 되풀이',
        notes: '<p>(2분) 앞의 코드 결과 6줄과 그림을 나란히 놓고 대응시켜 보세요.</p>' },
      { layout: 'diagram', title: '그림 6-4 구구단에서 i 와 k 추출', html: `<svg viewBox="0 0 1280 560" width="100%" font-family="sans-serif">
  <defs><marker id="a6g1s" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--danger)"/></marker></defs>
  <text x="640" y="30" text-anchor="middle" font-size="24" font-weight="bold" fill="var(--danger)">2에서 9까지 증가 후 종료 (바깥 for 문 : i 변수)</text>
  <line x1="40" y1="48" x2="1240" y2="48" stroke="var(--danger)" stroke-width="4" marker-end="url(#a6g1s)"/>
  <g font-size="24" font-family="monospace" fill="var(--fg)">
    ${[2, 3, 4, 9].map((d, c) => {
      const x = 60 + c * 300;
      const rows = range(1, 10, 1).map((k, r) => `<text x="${x + 20}" y="${110 + r * 42}"><tspan fill="var(--danger)" font-weight="bold">${d}</tspan> × <tspan fill="var(--accent)" font-weight="bold">${k}</tspan> = ${p2(d * k)}</text>`).join('');
      return `<rect x="${x}" y="72" width="220" height="400" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>${rows}`;
    }).join('\n    ')}
    <text x="930" y="280" font-size="40" fill="var(--muted)">…</text>
  </g>
  <text x="640" y="520" text-anchor="middle" font-size="24" font-weight="bold" fill="var(--accent)">1에서 9까지 계속 반복해서 증가 (안쪽 for 문 : k 변수)</text>
</svg>`, caption: '단 = 바깥 변수 i, 곱하는 수 = 안쪽 변수 k',
        notes: '<p>(2분) 발문: "무엇이 한 번씩 바뀌고, 무엇이 계속 되풀이되나?" → 단은 한 번씩(바깥), 곱하는 수는 단마다 1~9 되풀이(안쪽).</p>' },
      { layout: 'code', title: 'Code06-07. 2단~9단 구구단', code: `i, k = 0, 0

for i in range(2, 10, 1) :
    for k in range(1, 10, 1) :
        print("%d X %d = %2d" % (i, k, i * k))
    print("")`, points: ['바깥 i: 단 2~9', '안쪽 k: 곱하는 수 1~9', '<code>print("")</code> 는 4칸 → 단마다 빈 줄', '총 72개의 식'],
        notes: '<p>(4분) <code>print("")</code> 를 8칸, 0칸으로 옮겨 실행해 차이를 보여 주세요. 들여쓰기 = 실행 횟수.</p>' },
      { layout: 'diagram', title: '그림 6-5 가로 먼저 출력하기', html: `<svg viewBox="0 0 1280 560" width="100%" font-family="sans-serif">
  <defs><marker id="a6g3s" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/></marker></defs>
  <g font-size="24" font-family="monospace" fill="var(--fg)">
    ${range(1, 10, 1).map((i, r) => {
      const y = 50 + r * 50;
      const cells = [2, 3, 4, 9].map((k, c) => `<text x="${70 + c * 250 + (c === 3 ? 40 : 0)}" y="${y}"><tspan fill="var(--accent)" font-weight="bold">${k}</tspan> × <tspan fill="var(--danger)" font-weight="bold">${i}</tspan> = ${p2(k * i)}</text>`).join('');
      return `${cells}<line x1="50" y1="${y + 12}" x2="1130" y2="${y + 12}" stroke="var(--accent)" stroke-width="2" marker-end="url(#a6g3s)"/><text x="1150" y="${y + 8}" font-family="sans-serif" fill="var(--accent)">${i}회</text>`;
    }).join('\n    ')}
    <text x="840" y="260" font-size="36" fill="var(--muted)">…</text>
  </g>
  <text x="620" y="545" text-anchor="middle" font-size="24" font-weight="bold" fill="var(--danger)">바깥 i = 곱하는 수(줄) 1~9 · 안쪽 k = 단(칸) 2~9</text>
</svg>`, caption: '콘솔은 위로 되돌아갈 수 없다 → 한 줄(가로)씩 완성해서 출력',
        notes: '<p>(4분) 핵심 발문: "2단을 세로로 다 쓴 뒤, 3단을 그 옆에 쓸 수 있을까?" — 콘솔(타자기)은 커서를 위로 올릴 수 없습니다. 그러니 1번째 줄에 모든 단의 ×1 을 써야 합니다.</p><p>그래서 바깥/안쪽 변수의 역할이 Code06-07 과 뒤바뀝니다.</p>' },
      { layout: 'code', title: 'Code06-08. [프로그램 1] 완성', code: `## 전역 변수 선언 부분 ##
i, k, guguLine = 0, 0, ""

## 메인 코드 부분 ##
for i in range(2, 10) :
    guguLine = guguLine + ("#  %d단  #" % i)

print(guguLine)

for i in range(1, 10) :
    guguLine = ""
    for k in range(2, 10) :
        guguLine = guguLine + str("%2dX %2d= %2d" % (k, i, k * i))
    print(guguLine)`, points: ['5~8행: 제목 줄 만들기', '11행: 줄마다 <code>guguLine = ""</code>', '12~13행: 한 줄에 8개 식 이어 붙이기', '14행: 완성된 줄 출력'],
        notes: '<p>(5분) 실행해 [프로그램 1] 과 같은지 확인. 11행을 주석 처리하고 실행해 "초기화를 빼먹으면" 어떻게 되는지 보여 주세요.</p><p>제목 줄의 # 과 공백이 표와 줄이 맞도록 계산된 것이라는 점도 언급(각 칸 10글자).</p>' },
      { layout: 'two', title: '같은 결과, 다른 방법',
        left: { title: '문자열에 모아서 한 번에', code: `for i in range(1, 4) :
    line = ""
    for k in range(2, 5) :
        line = line + "%2dX%2d=%3d " % (k, i, k * i)
    print(line)` },
        right: { title: 'end="" 로 이어서 출력', code: `for i in range(1, 4) :
    for k in range(2, 5) :
        print("%2dX%2d=%3d " % (k, i, k * i), end="")
    print()` },
        notes: '<p>(2분) 보충 슬라이드. 둘 다 결과가 같습니다. 문자열을 모으는 방식은 나중에 파일로 저장하거나 가공할 때 편리합니다.</p>' },
      { layout: 'code', title: '추가 예제. 별로 직각삼각형', code: `for i in range(1, 6) :
    for k in range(0, i) :
        print("*", end="")
    print()`, points: ['바깥 i = 줄 번호', '안쪽 반복 횟수가 <b>i 에 따라</b> 변함', '→ [프로그램 2] 마름모의 기초'],
        notes: '<p>(3분) 안쪽 range(0, i) 를 range(0, 6 - i) 로 바꾸면? → 거꾸로 삼각형. 학생들이 예측하게 한 뒤 실행.</p>' },
      { layout: 'quiz', title: '확인 문제', q: '<code>for i in range(0, 4) :<br>&nbsp;&nbsp;&nbsp;&nbsp;for k in range(0, 3) :<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;print(i, k)</code><br>print() 는 모두 몇 번 실행될까?', options: ['4번', '7번', '12번', '3번'], answer: 2, explain: '바깥 4 × 안쪽 3 = 12번.',
        notes: '<p>(1분) 7번(4 + 3)을 고르는 오답이 흔합니다. "곱하기" 임을 강조.</p>' },
      { layout: 'practice', title: 'SELF STUDY 6-3. 단의 제목 출력', desc: 'Code06-07 을 각 단의 제목(## 2단 ##)이 출력되도록 수정해 보세요.',
        starter: `i, k = 0, 0

for i in range(2, 10, 1) :
    # TODO: 단의 제목 출력
    for k in range(1, 10, 1) :
        print("%d X %d = %2d" % (i, k, i * k))
    print("")
`, solution: `i, k = 0, 0

for i in range(2, 10, 1) :
    print("## %d단 ##" % i)
    for k in range(1, 10, 1) :
        print("%d X %d = %2d" % (i, k, i * k))
    print("")
`,
        notes: '<p>(3분) 제목 print 를 8칸에 넣으면 제목이 곱셈마다 나옵니다 — 흔한 오답을 보여 주며 들여쓰기 위치를 다시 강조.</p>' },
      { layout: 'practice', title: 'SELF STUDY 6-4. 가로 구구단 거꾸로', desc: 'Code06-08 을 구구단이 거꾸로 출력되도록 수정해 보세요. (힌트: range() 의 값을 큰 값에서 작은 값으로)',
        starter: `i, k, guguLine = 0, 0, ""

for i in range(2, 10) :
    guguLine = guguLine + ("#  %d단  #" % i)
print(guguLine)

for i in range(1, 10) :
    guguLine = ""
    for k in range(2, 10) :
        guguLine = guguLine + str("%2dX %2d= %2d" % (k, i, k * i))
    print(guguLine)
`, solution: `i, k, guguLine = 0, 0, ""

for i in range(9, 1, -1) :
    guguLine = guguLine + ("#  %d단  #" % i)
print(guguLine)

for i in range(9, 0, -1) :
    guguLine = ""
    for k in range(9, 1, -1) :
        guguLine = guguLine + str("%2dX %2d= %2d" % (k, i, k * i))
    print(guguLine)
`,
        notes: '<p>(4분) 세 곳의 range() 를 모두 바꿔야 합니다. 제목 줄만 바꾸고 본문을 안 바꾸면 제목과 내용이 어긋나는 것을 보여 주세요.</p>' },
      { layout: 'summary', title: '정리', bullets: [
        '중첩 for 문: 바깥 1회마다 안쪽 전체 반복 → 실행 횟수 = 바깥 × 안쪽',
        '안쪽 변수는 바깥이 바뀔 때마다 처음 값부터 다시 시작',
        '들여쓰기 위치(4칸 / 8칸)에 따라 실행 횟수가 달라진다',
        '콘솔은 위로 되돌아갈 수 없다 → 가로 출력은 한 줄씩 완성',
        '[프로그램 1]: 바깥 = 곱하는 수(줄), 안쪽 = 단(칸), guguLine 에 이어 붙여 출력'
      ], notes: '<p>(1분) 다음 시간: 횟수가 아니라 조건으로 반복하는 while 문과 무한 루프.</p>' }
    ]
  };

  /* while 문 순서도 (조건식 텍스트, 마커 id, 크기) */
  const whileFlow = (cond, id, big) => {
    const s = big ? 2 : 1;
    const fs = big ? 30 : 16;
    return `<svg viewBox="0 0 ${560 * s} ${280 * s}" width="100%" ${big ? '' : 'style="max-width:560px"'} font-family="sans-serif">
  <defs><marker id="${id}" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--danger)"/></marker></defs>
  <g transform="scale(${s})">
  <text x="240" y="18" text-anchor="middle" font-size="${fs / s + 1}" fill="var(--fg)">시작</text>
  <line x1="240" y1="24" x2="240" y2="52" stroke="var(--danger)" stroke-width="2" marker-end="url(#${id})"/>
  <text x="140" y="80" font-size="${fs / s + 1}" font-weight="bold" fill="var(--danger)">while</text>
  <rect x="190" y="58" width="130" height="36" rx="6" fill="var(--card)" stroke="var(--danger)" stroke-width="2"/>
  <text x="255" y="82" text-anchor="middle" font-size="${fs / s}" fill="var(--fg)">${cond}</text>
  <line x1="240" y1="94" x2="240" y2="170" stroke="var(--danger)" stroke-width="2" marker-end="url(#${id})"/>
  <text x="248" y="138" font-size="${fs / s - 2}" fill="var(--ok)">참(True)</text>
  <rect x="180" y="176" width="150" height="36" rx="6" fill="var(--card)" stroke="var(--danger)" stroke-width="2"/>
  <text x="255" y="200" text-anchor="middle" font-size="${fs / s}" fill="var(--fg)">반복할 문장들</text>
  <path d="M330 194 H420 V76 H326" fill="none" stroke="var(--danger)" stroke-width="2" marker-end="url(#${id})"/>
  <circle cx="375" cy="135" r="30" fill="none" stroke="var(--accent)" stroke-width="3" stroke-dasharray="120 30"/>
  <text x="375" y="131" text-anchor="middle" font-size="${fs / s - 3}" fill="var(--fg)">이곳을</text><text x="375" y="147" text-anchor="middle" font-size="${fs / s - 3}" fill="var(--fg)">반복</text>
  ${cond === 'True :' ? `<text x="240" y="250" text-anchor="middle" font-size="${fs / s - 2}" fill="var(--muted)">거짓이 되는 일이 없다 → 끝나지 않음</text>` :
    `<path d="M190 76 H60 V250 H230" fill="none" stroke="var(--muted)" stroke-width="2" marker-end="url(#${id})"/><text x="66" y="160" font-size="${fs / s - 2}" fill="var(--muted)">거짓(False)</text><text x="240" y="255" font-size="${fs / s}" fill="var(--fg)">while 문 다음 문장</text>`}
  </g>
</svg>`;
  };

  /* ════════════════════════════════════════════════════════════════
     6-4. while 문과 무한 루프
     ════════════════════════════════════════════════════════════════ */
  const S4 = {
    id: 'ch06-4',
    title: 'while 문과 무한 루프',
    minutes: 50,
    goals: [
      'for 문과 while 문의 차이(횟수 vs 조건)를 설명할 수 있다',
      'for 문으로 작성한 반복을 while 문(초기값 · 조건식 · 증감식)으로 바꿀 수 있다',
      'while True 로 만든 무한 루프의 동작과 멈추는 방법을 안다',
      '무한 루프 안에서 input() 으로 반복 계산하는 프로그램을 만들 수 있다'
    ],
    flow: [['도입: for 와 while 의 차이', 5], ['while 문의 형식 · 순서도', 10], ['for → while 바꾸기 (Code06-09)', 10], ['무한 루프 (Code06-10, 11)', 15], ['SELF STUDY · 퀴즈', 10]],
    content: [
      { type: 'h', text: 'for 문과 while 문 비교' },
      { type: 'p', html: '<code>for 변수 in range(시작값, 끝값+1, 증가값)</code> 형식의 for 문은 <b>반복할 횟수를 range() 로 미리 정해 놓고</b> 그만큼 반복합니다. 반면 <b>while 문</b>은 횟수를 정하기보다 <b>조건식이 참(True)인 동안</b> 계속 반복합니다. "10번 반복해" 가 for 문이라면, "배가 부를 때까지 먹어" 가 while 문입니다.' },
      { type: 'code', title: 'while 문의 형식', run: false, code: `while 조건식 :
    반복할 문장들` },
      { type: 'figure', caption: '그림 6-6 while 문의 형식과 순서도 — ❶ 조건식을 검사하고, 참이면 ❷ 문장들을 실행한 뒤 다시 ❶ 로', html: whileFlow('조건식 :', 'a6w1', false) },
      { type: 'list', items: [
        '❶ 조건식을 검사합니다. <b>참</b>이면 ❷ 로, <b>거짓</b>이면 while 문을 빠져나갑니다.',
        '❷ 반복할 문장들을 실행하고 다시 ❶ 로 돌아갑니다.',
        '처음부터 조건식이 거짓이면 반복할 문장들은 <b>한 번도</b> 실행되지 않습니다.'
      ] },

      { type: 'h', text: 'for 문처럼 사용하는 while 문' },
      { type: 'p', html: 'while 문으로 for 문과 똑같은 일을 하려면 <b>세 가지</b>를 직접 챙겨야 합니다. ① 변수의 <b>시작값</b>을 while 문 전에 넣고, ② 조건식에서 <b>끝값</b>과 비교하고, ③ 반복 블록의 끝에서 변수를 <b>증가값</b>만큼 바꿉니다. for 문에서는 range() 가 이 세 가지를 대신 해 줍니다.' },
      { type: 'code', title: 'for 문과 비슷하게 사용하는 while 문의 형식', run: false, code: `변수 = 시작값
while 변수 < 끝값 :
    이 부분을 반복
    변수 = 변수 + 증가값` },
      { type: 'p', html: '"안녕하세요?~" 를 3번 출력하는 for 문을 while 문으로 바꿔 봅시다.' },
      { type: 'code', title: '예. for 문으로 문장을 3회 출력하기', code: `for i in range(0, 3, 1) :
    print("%d : 안녕하세요? for 문을 공부 중입니다. ^^" % i)`, expect: `0 : 안녕하세요? for 문을 공부 중입니다. ^^
1 : 안녕하세요? for 문을 공부 중입니다. ^^
2 : 안녕하세요? for 문을 공부 중입니다. ^^` },
      { type: 'code', title: '예. while 문으로 문장을 3회 출력하기', code: `i = 0
while i < 3 :
    print("%d : 안녕하세요? while 문을 공부 중입니다. ^^" % i)
    i = i + 1`, expect: `0 : 안녕하세요? while 문을 공부 중입니다. ^^
1 : 안녕하세요? while 문을 공부 중입니다. ^^
2 : 안녕하세요? while 문을 공부 중입니다. ^^`, desc: '<code>1행</code>: 시작값, <code>2행</code>: 끝값과 비교, <code>4행</code>: 증가. i 가 3 이 되는 순간 <code>i &lt; 3</code> 이 거짓이 되어 반복이 끝납니다.' },
      { type: 'table', caption: 'range(0, 3, 1) 의 세 값이 while 문에서 들어가는 자리', head: ['역할', 'for 문', 'while 문'], rows: [
        ['시작값', '<code>range(<b>0</b>, 3, 1)</code>', '<code>i = <b>0</b></code> (while 문 앞)'],
        ['끝값', '<code>range(0, <b>3</b>, 1)</code>', '<code>while i &lt; <b>3</b> :</code>'],
        ['증가값', '<code>range(0, 3, <b>1</b>)</code>', '<code>i = i + <b>1</b></code> (블록 마지막)']
      ] },
      { type: 'callout', kind: 'warn', title: '가장 흔한 실수: 증가식을 빠뜨리기', html: '<code>i = i + 1</code> 을 빠뜨리면 i 는 영원히 0 이고 <code>i &lt; 3</code> 도 영원히 참이므로 <b>끝나지 않는 반복(무한 루프)</b>이 됩니다. 이 강좌에서 실행하다 멈추지 않으면 콘솔의 <b>■ 중지</b> 버튼(또는 입력칸에서 <kbd>Ctrl</kbd>+<kbd>C</kbd>)을 누르세요.' },
      { type: 'p', html: 'Code06-02(2) 에서 for 문으로 만든 1~10 의 합계도 while 문으로 바꿀 수 있습니다.' },
      { type: 'code', title: 'Code06-09. while 문으로 1에서 10까지의 합계 구하기', code: `i, hap = 0, 0

i = 1
while i < 11 :
    hap = hap + i
    i = i + 1

print("1에서 10까지의 합계 : %d" % hap)`, expect: `1에서 10까지의 합계 : 55`, desc: '<code>3행</code>: 시작값 1, <code>4행</code>: 끝값 10 까지(11 미만), <code>6행</code>: 1씩 증가. <code>5행</code>과 <code>6행</code>의 순서를 바꾸면 결과가 어떻게 될지 생각해 보세요. (2~11 을 더해 65)' },
      { type: 'callout', kind: 'more', title: '📘 더 알아보기: 복합 대입 연산자 +=', html: '<code>i = i + 1</code> 은 <code>i += 1</code> 로, <code>hap = hap + i</code> 는 <code>hap += i</code> 로 줄여 쓸 수 있습니다(3장). 뒤의 예제(Code06-13, 06-15)에서 이 형태를 씁니다. <code>-=</code>, <code>*=</code>, <code>//=</code> 도 같은 방식입니다.' },
      { type: 'callout', kind: 'tip', title: '언제 for, 언제 while?', html: '<ul><li><b>반복 횟수를 미리 알 때</b>(1~100, 구구단 9줄, 리스트의 모든 값) → <code>for</code></li><li><b>언제 끝날지 모르고 조건으로 끝낼 때</b>(사용자가 0 을 입력할 때까지, 합계가 1000 이 넘을 때까지) → <code>while</code></li></ul>' },

      { type: 'h', text: '무한 루프를 하는 while 문' },
      { type: 'p', html: 'while 문의 조건식 자리에 <code>True</code> 를 직접 쓰면 조건이 <b>항상 참</b>이므로 반복이 영원히 계속됩니다. 이것을 <b>무한 루프(infinite loop)</b>라고 합니다. 실수로 생기면 버그지만, <b>일부러</b> 만들어 "사용자가 그만둘 때까지 계속 동작하는 프로그램"(계산기, 게임, 메뉴 화면 등)에 씁니다.' },
      { type: 'figure', caption: '그림 6-7 while 문을 이용한 무한 루프', html: whileFlow('True :', 'a6w2', false) },
      { type: 'code', title: '예. 무한 루프 (실행하지 마세요!)', run: false, code: `while True :
    print("ㅋ ", end = " ")`, desc: '출력 결과: <code>ㅋ  ㅋ  ㅋ  ㅋ  ㅋ  …</code> 가 끝없이 반복됩니다. 이 코드는 멈추지 않으므로 여기서는 실행 버튼을 두지 않았습니다. 편집기에 직접 붙여 실행해 봤다면 <b>■ 중지</b>로 멈추세요.' },
      { type: 'callout', kind: 'info', title: '무한 루프를 멈추는 방법', html: '<ul><li>IDLE 이나 명령 프롬프트: <kbd>Ctrl</kbd>+<kbd>C</kbd> → <code>KeyboardInterrupt</code> 로 중단</li><li>이 웹 강좌: 콘솔의 <b>■ 중지</b> 버튼 (입력 대기 중이면 입력칸에서 <kbd>Ctrl</kbd>+<kbd>C</kbd>)</li><li>프로그램 안에서: <code>break</code> 문 (다음 교시)</li></ul>' },
      { type: 'p', html: '무한 루프 안에 <code>input()</code> 을 넣으면, 두 수를 입력받아 합계를 출력하는 일을 <b>계속</b> 반복하는 프로그램이 됩니다.' },
      { type: 'code', title: 'Code06-10. 무한 루프로 두 숫자의 합계를 반복 계산', expectError: true, code: `hap = 0
a, b = 0, 0

while True :
    a = int(input("더할 첫 번째 수를 입력하세요 : "))
    b = int(input("더할 두 번째 수를 입력하세요 : "))
    hap = a + b
    print("%d + %d = %d" % (a, b, hap))`, stdin: '55\n22\n77\n128\n', expect: `더할 첫 번째 수를 입력하세요 : 55
더할 두 번째 수를 입력하세요 : 22
55 + 22 = 77
더할 첫 번째 수를 입력하세요 : 77
더할 두 번째 수를 입력하세요 : 128
77 + 128 = 205
더할 첫 번째 수를 입력하세요 : Traceback (most recent call last):
  File "main.py", line 5, in <module>
    a = int(input("더할 첫 번째 수를 입력하세요 : "))
            ~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
EOFError: EOF when reading a line`, desc: '예시 입력: <code>55</code>, <code>22</code>, <code>77</code>, <code>128</code>. 계산이 끝나면 다시 첫 번째 수를 묻습니다. 직접 실행하면 계속 입력을 기다리므로 <b>■ 중지</b>로 끝냅니다. "예시 입력으로 실행" 은 준비한 입력이 바닥나면 <code>EOFError</code>(더 읽을 입력이 없음)로 멈춥니다.' },
      { type: 'p', html: '조금 더 발전시켜, 연산자까지 입력받아 덧셈 · 뺄셈 · 곱셈 · 나눗셈 · 나머지 · 몫 · 제곱을 계산하는 계산기를 만들어 봅시다. 5장의 <code>if ~ elif ~ else</code> 를 무한 루프 안에 넣었습니다. 사용자가 <kbd>Ctrl</kbd>+<kbd>C</kbd>(■ 중지)를 누를 때까지 계속 계산합니다.' },
      { type: 'code', title: 'Code06-11. Ctrl+C 를 누를 때까지 계속 계산하는 계산기', expectError: true, code: `ch = ""
a, b = 0, 0

while True :
    a = int(input("계산할 첫 번째 수를 입력하세요 : "))
    b = int(input("계산할 두 번째 수를 입력하세요 : "))
    ch = input("계산할 연산자를 입력하세요 : ")

    if (ch == "+") :
        print("%d + %d = %d" % (a, b, a + b))
    elif (ch == "-") :
        print("%d - %d = %d" % (a, b, a - b))
    elif (ch == "*") :
        print("%d * %d = %d" % (a, b, a * b))
    elif (ch == "/") :
        print("%d / %d = %5.2f" % (a, b, a / b))
    elif (ch == "%") :
        print("%d %% %d = %d" % (a, b, a % b))
    elif (ch == "//") :
        print("%d // %d = %d" % (a, b, a // b))
    elif (ch == "**") :
        print("%d ** %d = %d" % (a, b, a ** b))
    else :
        print("연산자를 잘못 입력했습니다.")`, stdin: '22\n33\n*\n10\n4\n%\n', expect: `계산할 첫 번째 수를 입력하세요 : 22
계산할 두 번째 수를 입력하세요 : 33
계산할 연산자를 입력하세요 : *
22 * 33 = 726
계산할 첫 번째 수를 입력하세요 : 10
계산할 두 번째 수를 입력하세요 : 4
계산할 연산자를 입력하세요 : %
10 % 4 = 2
계산할 첫 번째 수를 입력하세요 : Traceback (most recent call last):
  File "main.py", line 5, in <module>
    a = int(input("계산할 첫 번째 수를 입력하세요 : "))
            ~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
EOFError: EOF when reading a line`, desc: '예시 입력의 마지막 줄 뒤에서 멈추는 <code>EOFError</code> 는 Code06-10 과 같은 이유입니다(직접 실행하면 계속 입력을 기다리므로 ■ 중지로 끝냅니다).예시 입력: <code>22</code>, <code>33</code>, <code>*</code>, <code>10</code>, <code>4</code>, <code>%</code>. <code>18행</code>의 <code>%%</code> 는 % 서식 안에서 <b>% 글자 자체</b>를 출력하는 방법입니다. <code>16행</code>의 <code>%5.2f</code> 는 전체 5칸, 소수점 아래 2자리 실수입니다.' },
      { type: 'callout', kind: 'more', title: '📘 더 알아보기: 끝낼 방법을 프로그램 안에 두자', html: 'Ctrl+C 로 강제로 멈추는 것은 사용자에게 친절하지 않습니다. 보통은 "0 을 입력하면 종료", "q 를 입력하면 종료" 같은 <b>종료 조건</b>을 만들어 둡니다. 다음 교시의 <code>break</code> 문이 바로 그 도구입니다. 또 while 문 조건식에 변수를 두어 끝낼 수도 있습니다.' },
      { type: 'code', title: '추가 예제. 조건식 변수로 끝내는 while 문', code: `answer = ""
count = 0

while answer != "n" :
    count = count + 1
    print("%d번째 인사: 안녕하세요!" % count)
    answer = input("계속할까요? (y/n) : ")

print("프로그램을 끝냅니다.")`, stdin: 'y\ny\nn\n', expect: `1번째 인사: 안녕하세요!
계속할까요? (y/n) : y
2번째 인사: 안녕하세요!
계속할까요? (y/n) : y
3번째 인사: 안녕하세요!
계속할까요? (y/n) : n
프로그램을 끝냅니다.`, desc: '<code>answer</code> 가 "n" 이 되면 조건식 <code>answer != "n"</code> 이 거짓이 되어 반복이 끝납니다. 처음에는 answer 가 빈 문자열이라 조건이 참이므로 적어도 한 번은 실행됩니다.' }
    ],
    practice: [
      {
        title: 'SELF STUDY 6-5. Code06-05 를 while 문으로', level: 2,
        desc: '<p>시작값 · 끝값 · 증가값을 입력받아 합계를 구하는 Code06-05 를 <b>while 문</b>으로 수정해 보세요. (힌트: Code06-09 를 참고)</p><pre>시작값을 입력하세요 : 2\n끝값을 입력하세요 : 300\n증가값을 입력하세요 : 3\n2에서 300까지 3씩 증가시킨 값의 합계 : 15050</pre>',
        hint: '<code>i = num1</code> → <code>while i &lt;= num2 :</code> (또는 <code>i &lt; num2 + 1</code>) → 블록 끝에서 <code>i = i + num3</code>',
        starter: `i, hap = 0, 0
num1, num2, num3 = 0, 0, 0

num1 = int(input("시작값을 입력하세요 : "))
num2 = int(input("끝값을 입력하세요 : "))
num3 = int(input("증가값을 입력하세요 : "))

# TODO: while 문으로 num1 부터 num2 까지 num3 씩 증가시키며 hap 에 더하기

print("%d에서 %d까지 %d씩 증가시킨 값의 합계 : %d" % (num1, num2, num3, hap))
`,
        solution: `i, hap = 0, 0
num1, num2, num3 = 0, 0, 0

num1 = int(input("시작값을 입력하세요 : "))
num2 = int(input("끝값을 입력하세요 : "))
num3 = int(input("증가값을 입력하세요 : "))

i = num1
while i < num2 + 1 :
    hap = hap + i
    i = i + num3

print("%d에서 %d까지 %d씩 증가시킨 값의 합계 : %d" % (num1, num2, num3, hap))
`,
        stdin: '2\n300\n3\n',
        expect: `시작값을 입력하세요 : 2
끝값을 입력하세요 : 300
증가값을 입력하세요 : 3
2에서 300까지 3씩 증가시킨 값의 합계 : 15050`
      },
      {
        title: '실습 6-5. 저금통 목표 금액', level: 2,
        desc: '<p>매일 저금할 금액을 입력받아, 모은 돈이 <b>10000원 이상</b>이 될 때까지 날짜와 누적 금액을 출력하세요. (while 문, 조건식 사용)</p><pre>하루에 저금할 금액 : 3000\n1일째 : 3000원\n2일째 : 6000원\n3일째 : 9000원\n4일째 : 12000원\n목표 달성까지 4일 걸렸습니다.</pre>',
        hint: '<code>while total &lt; 10000 :</code> 안에서 날짜를 1 늘리고 금액을 더합니다.',
        starter: `money = int(input("하루에 저금할 금액 : "))
total, day = 0, 0
# TODO: total 이 10000 미만인 동안 반복

print("목표 달성까지 %d일 걸렸습니다." % day)
`,
        solution: `money = int(input("하루에 저금할 금액 : "))
total, day = 0, 0
while total < 10000 :
    day += 1
    total += money
    print("%d일째 : %d원" % (day, total))

print("목표 달성까지 %d일 걸렸습니다." % day)
`,
        stdin: '3000\n',
        expect: `하루에 저금할 금액 : 3000
1일째 : 3000원
2일째 : 6000원
3일째 : 9000원
4일째 : 12000원
목표 달성까지 4일 걸렸습니다.`
      }
    ],
    quiz: [
      { q: '다음 코드의 출력은?<pre><code>i = 0\nwhile i &lt; 3 :\n    print(i, end=" ")\n    i = i + 1</code></pre>', options: ['0 1 2', '1 2 3', '0 1 2 3', '무한 반복'], answer: 0, explain: 'i 가 0, 1, 2 일 때 출력하고, 3 이 되면 조건이 거짓이 되어 끝납니다.' },
      { q: '다음 코드의 문제점은?<pre><code>i = 1\nhap = 0\nwhile i &lt; 11 :\n    hap = hap + i\nprint(hap)</code></pre>', options: ['hap 을 초기화하지 않았다', 'i 를 증가시키지 않아 무한 루프가 된다', '조건식에 콜론이 없다', '문제없이 55 를 출력한다'], answer: 1, explain: 'i 가 계속 1 이므로 <code>i &lt; 11</code> 이 항상 참 → 무한 루프입니다.' },
      { q: '<code>while True :</code> 에 대한 설명으로 옳은 것은?', options: ['한 번만 실행된다', '문법 오류이다', '조건이 항상 참이라 무한 루프가 된다', '한 번도 실행되지 않는다'], answer: 2, explain: 'True 는 항상 참이므로 break 등으로 빠져나가지 않는 한 끝나지 않습니다.' },
      { q: '처음부터 조건식이 거짓인 while 문의 블록은 몇 번 실행될까요?<pre><code>n = 10\nwhile n &lt; 5 :\n    print(n)\n    n += 1</code></pre>', options: ['0번', '1번', '5번', '무한 번'], answer: 0, explain: '조건식을 먼저 검사하므로 처음부터 거짓이면 한 번도 실행되지 않습니다.' },
      { q: 'Code06-11 에서 <code>print("%d %% %d = %d" % (10, 4, 2))</code> 의 출력은?', options: ['10 %% 4 = 2', '10 % 4 = 2', '10 4 = 2', '오류'], answer: 1, explain: '% 서식 문자열 안에서 <code>%%</code> 는 % 글자 하나를 뜻합니다.' }
    ],
    slides: [
      { layout: 'title', title: 'while 문과 무한 루프', subtitle: 'Chapter 06 · Section 04', badge: '6-4',
        notes: '<p>(1분) 발문: "밥을 10숟가락 먹어라 vs 배부를 때까지 먹어라 — 어느 쪽이 for, 어느 쪽이 while?" 오늘은 조건으로 반복하는 while 문입니다.</p>' },
      { layout: 'diagram', title: 'for 문과 while 문 비교', html: whileFlow('조건식 :', 'a6w1s', true), caption: 'for: range() 로 횟수를 정해 반복 · while: 조건식이 참인 동안 반복',
        notes: '<p>(3분) ❶ 조건 검사 → 참이면 ❷ 실행 → 다시 ❶. 거짓이면 while 문 다음으로. "조건을 먼저 검사한다" — 처음부터 거짓이면 0번 실행.</p>' },
      { layout: 'two', title: '같은 반복, 두 가지 문법',
        left: { title: 'for 문', code: `for i in range(0, 3, 1) :
    print("%d : 안녕하세요? for 문을 공부 중입니다. ^^" % i)` },
        right: { title: 'while 문', code: `i = 0
while i < 3 :
    print("%d : 안녕하세요? while 문을 공부 중입니다. ^^" % i)
    i = i + 1` },
        notes: '<p>(4분) range(0, 3, 1) 의 0 / 3 / 1 이 while 문의 어디로 갔는지 색칠하듯 짚어 보세요: 시작값 → 1행, 끝값 → 조건식, 증가값 → 마지막 줄.</p>' },
      { layout: 'table', title: 'range() 의 세 값이 들어가는 자리', head: ['역할', 'for 문', 'while 문'], rows: [
        ['시작값', '<code>range(<b>0</b>, 3, 1)</code>', '<code>i = 0</code> (앞)'],
        ['끝값', '<code>range(0, <b>3</b>, 1)</code>', '<code>while i &lt; 3 :</code>'],
        ['증가값', '<code>range(0, 3, <b>1</b>)</code>', '<code>i = i + 1</code> (블록 끝)']
      ], lead: 'while 문은 세 가지를 직접 챙겨야 한다 — 하나라도 빠지면 오류 또는 무한 루프',
        notes: '<p>(2분) 증가식을 빠뜨리면 무한 루프. 실제로 한번 지워서 실행 → ■ 중지 버튼 사용법을 시연하세요.</p>' },
      { layout: 'code', title: 'Code06-09. while 문으로 1~10 합계', code: `i, hap = 0, 0

i = 1
while i < 11 :
    hap = hap + i
    i = i + 1

print("1에서 10까지의 합계 : %d" % hap)`, points: ['3행 시작값 · 4행 조건 · 6행 증가', 'Code06-02(2) 와 결과 같음 (55)', '5, 6행 순서를 바꾸면? → 65'],
        notes: '<p>(4분) 5행과 6행을 바꿔 실행 → 65(2~11 합). 증가 위치가 결과를 바꾼다는 것을 직접 확인.</p>' },
      { layout: 'diagram', title: '그림 6-7 while True — 무한 루프', html: whileFlow('True :', 'a6w2s', true), caption: '조건식이 항상 참 → 반복이 끝나지 않는다',
        notes: '<p>(2분) 무한 루프는 버그일 수도, 의도일 수도 있습니다. 게임 · 서버 · 메뉴 프로그램은 대부분 의도된 무한 루프입니다.</p>' },
      { layout: 'bullets', title: '무한 루프 예와 멈추는 방법', lead: '<code>while True : print("ㅋ ", end = " ")</code> → ㅋ ㅋ ㅋ ㅋ … 무한 반복', bullets: [
        'IDLE · 명령 프롬프트: <kbd>Ctrl</kbd>+<kbd>C</kbd> → KeyboardInterrupt',
        '이 강좌: 콘솔의 <b>■ 중지</b> 버튼',
        '입력 대기 중이면 입력칸에서 <kbd>Ctrl</kbd>+<kbd>C</kbd>',
        '프로그램 스스로 끝내기: <code>break</code> (다음 교시)'
      ], notes: '<p>(3분) "ㅋ" 무한 루프를 에디터에 직접 입력해 실행 → 콘솔이 쏟아지는 것을 보여 주고 ■ 중지. 실행 전 "멈추는 방법을 먼저 알고 실행하자" 라고 강조합니다.</p>' },
      { layout: 'code', title: 'Code06-10. 무한 루프로 합계 반복', expectError: true, code: `hap = 0
a, b = 0, 0

while True :
    a = int(input("더할 첫 번째 수를 입력하세요 : "))
    b = int(input("더할 두 번째 수를 입력하세요 : "))
    hap = a + b
    print("%d + %d = %d" % (a, b, hap))`, stdin: '55\n22\n77\n128\n', points: ['입력 → 계산 → 출력을 <b>끝없이</b> 반복', '멈추려면 ■ 중지', '예시 입력이 바닥나면 EOFError'],
        notes: '<p>(4분) ▶ 실행 후 직접 숫자를 몇 번 입력해 보고 ■ 중지. 끝낼 방법이 없다는 불편함을 느끼게 하면 break 로 자연스럽게 연결됩니다.</p>' },
      { layout: 'code', title: 'Code06-11. 계산기 (1/2) — 입력', expectError: true, code: `ch = ""
a, b = 0, 0

while True :
    a = int(input("계산할 첫 번째 수를 입력하세요 : "))
    b = int(input("계산할 두 번째 수를 입력하세요 : "))
    ch = input("계산할 연산자를 입력하세요 : ")

    if (ch == "+") :
        print("%d + %d = %d" % (a, b, a + b))
    elif (ch == "-") :
        print("%d - %d = %d" % (a, b, a - b))
    elif (ch == "*") :
        print("%d * %d = %d" % (a, b, a * b))
    else :
        print("연산자를 잘못 입력했습니다.")`, stdin: '22\n33\n*\n', points: ['무한 루프 + if~elif~else', '연산자는 문자열로 입력 (int 변환 X)', '전체 코드(7개 연산자)는 학생 문서 참고'],
        notes: '<p>(4분) 슬라이드용으로 +, -, * 만 남긴 축약 버전입니다. 학생 문서의 Code06-11 에는 /, %, //, ** 까지 있습니다. <code>%%</code> 와 <code>%5.2f</code> 를 거기서 설명해 주세요.</p>' },
      { layout: 'code', title: '추가 예제. 조건식 변수로 끝내기', code: `answer = ""
count = 0

while answer != "n" :
    count = count + 1
    print("%d번째 인사: 안녕하세요!" % count)
    answer = input("계속할까요? (y/n) : ")

print("프로그램을 끝냅니다.")`, stdin: 'y\ny\nn\n', points: ['True 대신 <b>조건식</b>으로 종료', 'n 을 입력하면 조건이 거짓 → 종료', '처음엔 answer 가 "" 라서 참'],
        notes: '<p>(3분) 무한 루프를 쓰지 않고도 "사용자가 원할 때까지" 반복할 수 있습니다. 다음 교시 break 와 비교해 볼 예제.</p>' },
      { layout: 'quiz', title: '확인 문제', q: '<code>i = 1<br>while i &lt; 11 :<br>&nbsp;&nbsp;&nbsp;&nbsp;hap = hap + i</code><br>이 코드의 가장 큰 문제는?', options: ['hap 초기화 누락만 문제', 'i 를 증가시키지 않아 무한 루프', 'while 문에는 콜론이 필요 없다', '문제 없다'], answer: 1, explain: 'hap 초기화도 빠졌지만(NameError), 그걸 고쳐도 i 증가가 없어 끝나지 않습니다.',
        notes: '<p>(2분) 두 가지 문제가 모두 있다는 것을 짚어 주세요 — 첫 실행에서는 NameError 가 먼저 납니다.</p>' },
      { layout: 'practice', title: 'SELF STUDY 6-5. Code06-05 를 while 문으로', desc: '시작값 · 끝값 · 증가값을 입력받아 합계를 구하는 Code06-05 를 while 문으로 바꾸세요. (힌트: Code06-09)', stdin: '2\n300\n3\n',
        starter: `i, hap = 0, 0
num1 = int(input("시작값을 입력하세요 : "))
num2 = int(input("끝값을 입력하세요 : "))
num3 = int(input("증가값을 입력하세요 : "))

# TODO: while 문으로 합계 구하기

print("%d에서 %d까지 %d씩 증가시킨 값의 합계 : %d" % (num1, num2, num3, hap))
`, solution: `i, hap = 0, 0
num1 = int(input("시작값을 입력하세요 : "))
num2 = int(input("끝값을 입력하세요 : "))
num3 = int(input("증가값을 입력하세요 : "))

i = num1
while i < num2 + 1 :
    hap = hap + i
    i = i + num3

print("%d에서 %d까지 %d씩 증가시킨 값의 합계 : %d" % (num1, num2, num3, hap))
`,
        notes: '<p>(5분) <code>while i &lt;= num2</code> 도 정답. 증가를 <code>i = i + 1</code> 로 잘못 쓰는 경우가 많으니 확인하세요.</p>' },
      { layout: 'summary', title: '정리', bullets: [
        'for: 횟수를 정해 반복 · while: 조건식이 참인 동안 반복',
        'while 문은 시작값(앞) · 조건식 · 증가식(블록 끝)을 직접 작성',
        '증가식을 빠뜨리면 무한 루프 → ■ 중지 / Ctrl+C',
        '<code>while True :</code> 는 의도적인 무한 루프 — 계산기 · 메뉴 · 게임',
        '끝낼 방법은 프로그램 안에 두자 → 다음 교시 break'
      ], notes: '<p>(1분) 다음 시간: 반복을 빠져나가는 break, 건너뛰는 continue, 그리고 [프로그램 2] 마름모.</p>' }
    ]
  };

  /* ════════════════════════════════════════════════════════════════
     6-5. break · continue 와 [프로그램 2] 마름모
     ════════════════════════════════════════════════════════════════ */
  const DIAMOND_CODE = `## 전역 변수 선언 부분 ##
i, k = 0, 0

## 메인 코드 부분 ##
i = 0
while i < 9 :
    if i < 5 :
        k = 0
        while k < 4 - i :
            print('  ', end = '')
            k += 1
        k = 0
        while k < i * 2 + 1 :
            print('\\u2605', end = '')
            k += 1
    else :
        k = 0
        while k < i - 4 :
            print('  ', end = '')
            k += 1
        k = 0
        while k < (9 - i) * 2 - 1 :
            print('\\u2605', end = '')
            k += 1
    print()
    i += 1`;

  const S5 = {
    id: 'ch06-5',
    title: 'break · continue 와 [프로그램 2] 마름모 출력',
    minutes: 50,
    goals: [
      'break 문으로 반복문을 즉시 빠져나갈 수 있다',
      '무한 루프에 종료 조건(0 입력 등)을 넣어 스스로 끝나는 프로그램을 만들 수 있다',
      'continue 문으로 이번 반복의 나머지를 건너뛸 수 있다',
      '중첩 while 문으로 공백과 별의 개수를 조절해 마름모를 출력할 수 있다'
    ],
    flow: [['복습: 무한 루프의 불편함', 3], ['break 문 (Code06-12, 13)', 15], ['continue 문 (Code06-14)', 10], ['[프로그램 2] 완성 (Code06-15)', 15], ['퀴즈 · 정리', 7]],
    content: [
      { type: 'h', text: '반복문을 탈출시키는 break 문' },
      { type: 'p', html: '<b>break 문</b>은 반복문(for, while) 안에서 실행되는 순간, 남은 반복과 상관없이 <b>무조건 반복문 밖으로 탈출</b>합니다. 로켓이 발사대를 떠나듯, 반복문 다음 문장으로 곧장 이동합니다. 계속되는 반복을 <b>논리적으로 빠져나가는</b> 방법입니다.' },
      { type: 'figure', caption: '그림 6-8 break 문의 작동 — 반복문 안의 break 는 무조건 반복문 밖으로 탈출', html: `<svg viewBox="0 0 560 250" width="100%" style="max-width:560px" font-family="sans-serif">
  <defs><marker id="a6b1" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--danger)"/></marker></defs>
  <rect x="40" y="10" width="300" height="170" rx="10" fill="none" stroke="var(--line)" stroke-width="2" stroke-dasharray="6 4"/>
  <text x="190" y="34" text-anchor="middle" font-size="16" font-weight="bold" fill="var(--fg)">반복문 for, while</text>
  <text x="190" y="62" text-anchor="middle" font-size="18" fill="var(--warn)">· · ·</text>
  <rect x="130" y="75" width="120" height="40" rx="8" fill="var(--ok)"/><text x="190" y="102" text-anchor="middle" font-size="18" font-weight="bold" fill="#fff">break</text>
  <text x="190" y="140" text-anchor="middle" font-size="18" fill="var(--warn)">· · ·</text>
  <text x="190" y="165" text-anchor="middle" font-size="13" fill="var(--muted)">(건너뜀)</text>
  <path d="M250 95 H440 V215 H200" fill="none" stroke="var(--danger)" stroke-width="2.5" marker-end="url(#a6b1)"/>
  <text x="450" y="150" font-size="15" fill="var(--fg)">무조건</text><text x="450" y="170" font-size="15" fill="var(--fg)">반복문 밖으로</text><text x="450" y="190" font-size="15" fill="var(--fg)">탈출 🚀</text>
  <text x="80" y="220" font-size="16" fill="var(--fg)">반복문 다음 문장</text>
</svg>` },
      { type: 'code', title: '예. break 문을 만나면 바로 탈출', code: `for i in range(1, 100) :
    print("for 문을 %d번 실행했습니다." % i)
    break`, expect: `for 문을 1번 실행했습니다.`, desc: 'range(1, 100) 이므로 99번 반복해야 하지만, 첫 번째 반복에서 <code>break</code> 를 만나 바로 끝납니다. 이렇게 무조건 break 를 쓰는 일은 드물고, 보통은 <b>if 문과 함께</b> "어떤 조건이 되면 탈출" 하는 형태로 씁니다.' },
      { type: 'p', html: 'Code06-10 은 끝낼 방법이 없어 Ctrl+C 로 강제로 멈춰야 했습니다. <b>첫 번째 수에 0 을 입력하면</b> break 로 빠져나오도록 고쳐 봅시다.' },
      { type: 'code', title: 'Code06-12. 첫 번째 수에 0 을 입력하면 종료하기', code: `hap = 0
a, b = 0, 0

while True :
    a = int(input("더할 첫 번째 수를 입력하세요 : "))
    if a == 0 :
        break
    b = int(input("더할 두 번째 수를 입력하세요 : "))
    hap = a + b
    print("%d + %d = %d" % (a, b, hap))

print("0을 입력해 반복문을 탈출했습니다.")`, stdin: '55\n22\n77\n128\n0\n', expect: `더할 첫 번째 수를 입력하세요 : 55
더할 두 번째 수를 입력하세요 : 22
55 + 22 = 77
더할 첫 번째 수를 입력하세요 : 77
더할 두 번째 수를 입력하세요 : 128
77 + 128 = 205
더할 첫 번째 수를 입력하세요 : 0
0을 입력해 반복문을 탈출했습니다.`, desc: '예시 입력: <code>55 22 77 128 0</code>. <code>6~7행</code>: a 가 0 이면 두 번째 수를 묻지도 않고 while 문을 빠져나가 <code>12행</code>을 실행합니다. 이처럼 "이 값이 들어오면 끝" 이라고 정해 둔 특별한 입력값을 <b>센티널(sentinel, 보초) 값</b>이라고 합니다.' },
      { type: 'figure', caption: 'Code06-12 의 흐름 — break 는 while 문 전체를 끝낸다', html: `<svg viewBox="0 0 600 330" width="100%" style="max-width:600px" font-family="sans-serif">
  <defs><marker id="a6b2" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--muted)"/></marker></defs>
  <g font-size="14" text-anchor="middle">
    <rect x="200" y="10" width="160" height="34" rx="6" fill="var(--card)" stroke="var(--danger)" stroke-width="2"/><text x="280" y="32" fill="var(--fg)">while True :</text>
    <rect x="180" y="64" width="200" height="34" rx="6" fill="var(--accent2)" opacity=".9"/><text x="280" y="86" fill="#fff">a 입력</text>
    <polygon points="280,114 350,146 280,178 210,146" fill="var(--ok)"/><text x="280" y="151" fill="#fff" font-weight="bold">a == 0 ?</text>
    <rect x="180" y="196" width="200" height="34" rx="6" fill="var(--accent2)" opacity=".9"/><text x="280" y="218" fill="#fff">b 입력 · 합계 출력</text>
    <rect x="420" y="270" width="170" height="40" rx="6" fill="var(--card)" stroke="var(--line)" stroke-width="2"/><text x="505" y="288" fill="var(--fg)">"0을 입력해</text><text x="505" y="304" fill="var(--fg)">탈출했습니다."</text>
  </g>
  <g stroke="var(--muted)" stroke-width="2" fill="none" marker-end="url(#a6b2)">
    <line x1="280" y1="44" x2="280" y2="60"/><line x1="280" y1="98" x2="280" y2="110"/><line x1="280" y1="178" x2="280" y2="192"/>
    <path d="M180 213 H120 V27 H196"/>
  </g>
  <path d="M350 146 H505 V264" fill="none" stroke="var(--danger)" stroke-width="2.5" marker-end="url(#a6b2)"/>
  <g font-size="13" fill="var(--fg)"><text x="360" y="138" fill="var(--danger)" font-weight="bold">예 → break!</text><text x="288" y="190">아니요</text><text x="60" y="120" fill="var(--muted)">반복</text></g>
</svg>` },
      { type: 'callout', kind: 'warn', title: 'break 는 가장 가까운 반복문 하나만 탈출', html: '중첩 반복문 안쪽에서 <code>break</code> 를 쓰면 <b>안쪽 반복문만</b> 끝나고, 바깥 반복문은 계속 돕니다. 바깥까지 모두 끝내려면 바깥에서도 따로 break 해야 합니다.' },
      { type: 'code', title: '추가 예제. 중첩 for 문 안의 break', code: `for i in range(1, 4) :
    for k in range(1, 4) :
        if k == 2 :
            break
        print("i = %d, k = %d" % (i, k))
    print("--- 바깥 반복 %d회 끝" % i)`, expect: `i = 1, k = 1
--- 바깥 반복 1회 끝
i = 2, k = 1
--- 바깥 반복 2회 끝
i = 3, k = 1
--- 바깥 반복 3회 끝`, desc: 'k 가 2 가 되면 안쪽 for 문만 끝나고, 바깥 for 문은 3회 모두 실행됩니다.' },
      { type: 'p', html: 'break 는 "조건을 만족하는 <b>첫 지점</b>" 을 찾을 때도 유용합니다. 1부터 차례로 더해 가다가 합계가 처음으로 1000 이상이 되는 순간 멈추면, 그때의 i 가 답입니다.' },
      { type: 'code', title: 'Code06-13. 누적 합계가 1000 이상이 되는 시작 지점 알기', code: `hap, i = 0, 0

for i in range(1, 101) :
    hap += i

    if hap >= 1000 :
        break

print("1~100의 합계를 최초로 1000이 넘게 하는 숫자 : %d" % i)`, expect: `1~100의 합계를 최초로 1000이 넘게 하는 숫자 : 45`, desc: '1~44 의 합은 990, 1~45 의 합은 1035 입니다. 45 를 더한 순간 1000 을 넘으므로 break 되고, 반복문이 끝난 뒤에도 <code>i</code> 에는 마지막 값 45 가 남아 있습니다.' },

      { type: 'h', text: '반복문으로 다시 돌아가게 하는 continue 문' },
      { type: 'p', html: '<b>continue 문</b>은 반복문 안에서 실행되면 블록의 <b>나머지 부분을 건너뛰고</b> 반복문의 처음(for 문은 다음 값, while 문은 조건식 검사)으로 돌아갑니다. break 가 "반복 그만!" 이라면 continue 는 "이번 회차만 패스!" 입니다.' },
      { type: 'figure', caption: '그림 6-9 continue 문의 작동 — 아래 문장을 무조건 건너뛴 뒤 다시 반복문으로 돌아간다', html: `<svg viewBox="0 0 560 240" width="100%" style="max-width:560px" font-family="sans-serif">
  <defs><marker id="a6c1" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--danger)"/></marker></defs>
  <text x="300" y="30" font-size="16" font-weight="bold" fill="var(--fg)">반복문 for, while</text>
  <text x="330" y="70" text-anchor="middle" font-size="18" fill="var(--warn)">· · ·</text>
  <rect x="260" y="85" width="140" height="40" rx="8" fill="var(--ok)"/><text x="330" y="112" text-anchor="middle" font-size="18" font-weight="bold" fill="#fff">continue</text>
  <text x="330" y="152" text-anchor="middle" font-size="18" fill="var(--warn)">· · ·</text>
  <text x="330" y="172" text-anchor="middle" font-size="13" fill="var(--muted)">(이번 회차는 건너뜀)</text>
  <path d="M400 105 H470 V210 H150 V26 H290" fill="none" stroke="var(--danger)" stroke-width="2.5" marker-end="url(#a6c1)"/>
  <text x="480" y="150" font-size="14" fill="var(--fg)">무조건</text><text x="480" y="168" font-size="14" fill="var(--fg)">끝으로</text><text x="480" y="186" font-size="14" fill="var(--fg)">건너뛴 후</text>
  <text x="20" y="110" font-size="14" fill="var(--fg)">다시 반복문으로</text><text x="20" y="128" font-size="14" fill="var(--fg)">돌아감 🛸</text>
</svg>` },
      { type: 'code', title: 'Code06-14. 1~100 의 합계에서 3의 배수 제외하기', code: `hap, i = 0, 0

for i in range(1, 101) :
    if i % 3 == 0 :
        continue

    hap += i

print("1~100의 합계(3의 배수 제외) : %d" % hap)`, expect: `1~100의 합계(3의 배수 제외) : 3367`, desc: '<code>4~5행</code>: i 가 3의 배수이면 <code>7행</code>(더하기)을 건너뛰고 다음 i 로 넘어갑니다. 1~100 전체 합 5050 에서 3의 배수 합 1683 을 뺀 값과 같습니다.' },
      { type: 'table', caption: 'break 와 continue 비교', head: ['', 'break', 'continue'], rows: [
        ['하는 일', '반복문을 <b>완전히</b> 끝냄', '<b>이번 회차</b>만 건너뜀'],
        ['다음 실행 위치', '반복문 <b>다음</b> 문장', '반복문의 <b>처음</b> (다음 값 / 조건식)'],
        ['비유', '수업 끝! 집에 간다', '이 문제는 패스, 다음 문제'],
        ['예', 'Code06-12, 06-13', 'Code06-14']
      ] },
      { type: 'callout', kind: 'warn', title: 'while 문에서 continue 를 쓸 때 주의', html: 'while 문에서 증가식(<code>i += 1</code>)이 continue <b>아래</b>에 있으면, continue 로 건너뛸 때 증가식도 건너뛰어 i 가 그대로 → <b>무한 루프</b>가 됩니다. while 문에서는 증가식을 continue 보다 <b>먼저</b> 실행하세요.' },
      { type: 'code', title: '추가 예제. while 문에서 continue 를 안전하게 쓰기', code: `hap, i = 0, 0

while i < 100 :
    i += 1            # 증가식을 continue 보다 먼저!
    if i % 3 == 0 :
        continue
    hap += i

print("1~100의 합계(3의 배수 제외) : %d" % hap)`, expect: `1~100의 합계(3의 배수 제외) : 3367` },

      { type: 'h', text: '[프로그램 2]의 완성: 마름모 모양 출력' },
      { type: 'p', html: '마름모는 별 문자 ★ 로 그립니다. ★ 는 키보드에 없는 글자지만 <b>유니코드(Unicode)</b> 번호 <code>2605</code>(16진수)를 <code>\'\\u2605\'</code> 처럼 쓰면 출력할 수 있습니다.' },
      { type: 'code', title: '예. 별 모양의 글자 출력하기', code: `print('\\u2605')`, expect: `★` },
      { type: 'p', html: '마름모 9줄을 줄 번호 <code>i</code>(0~8)로 분석해 봅시다. 각 줄은 <b>앞쪽 공백</b> + <b>별</b>로 이루어집니다. ★ 가 보통 글자 2칸 너비이므로 공백도 <code>\'  \'</code>(2칸)씩 찍습니다.' },
      { type: 'table', caption: '마름모의 줄별 공백과 별의 개수', head: ['줄 i', '공백(2칸) 개수', '별 개수', '규칙'], rows: [
        ['0', '4', '1', '<b>윗부분</b> (i &lt; 5)<br>공백 = <code>4 - i</code><br>별 = <code>i * 2 + 1</code>'],
        ['1', '3', '3', ''], ['2', '2', '5', ''], ['3', '1', '7', ''], ['4', '0', '9', ''],
        ['5', '1', '7', '<b>아랫부분</b> (i >= 5)<br>공백 = <code>i - 4</code><br>별 = <code>(9 - i) * 2 - 1</code>'],
        ['6', '2', '5', ''], ['7', '3', '3', ''], ['8', '4', '1', '']
      ] },
      { type: 'code', title: 'Code06-15. [프로그램 2] 완성: while 문으로 마름모 출력', code: DIAMOND_CODE, expect: DIAMOND_OUT, desc: '<code>6행</code>: 바깥 while 문이 줄 i 를 0~8 로 바꿉니다. <code>7행</code>: 위쪽 5줄(i &lt; 5)과 아래쪽 4줄을 if~else 로 나눕니다. <code>9~11행 / 18~20행</code>: 안쪽 while 문이 공백을, <code>13~15행 / 22~24행</code>: 별을 찍습니다. 안쪽 while 문마다 <code>k = 0</code> 으로 <b>새로 초기화</b>하는 것을 잊지 마세요. <code>25행</code>의 <code>print()</code> 가 한 줄을 끝냅니다.' },
      { type: 'callout', kind: 'info', title: '공백이 1칸으로 보인다면', html: '브라우저 글꼴에 따라 ★ 가 한 칸 너비로 보여 마름모가 조금 찌그러질 수 있습니다. 그럴 때는 공백을 <code>\' \'</code>(1칸)로 바꿔 보세요. 반복 구조는 그대로입니다.' },
      { type: 'callout', kind: 'more', title: '📘 더 알아보기: 한 줄로 쓰는 마름모', html: '문자열 곱하기를 쓰면 안쪽 반복을 없앨 수 있습니다.<pre><code>for i in range(9) :\n    n = 4 - abs(4 - i)      # 0,1,2,3,4,3,2,1,0\n    print("  " * (4 - n) + "\\u2605" * (n * 2 + 1))</code></pre><code>abs()</code> 는 절댓값 함수입니다. 윗부분 · 아랫부분을 하나의 식으로 합친 방법입니다.' },
      { type: 'code', title: '추가 예제. 문자열 곱하기로 만든 마름모', code: `for i in range(9) :
    n = 4 - abs(4 - i)
    print("  " * (4 - n) + "\\u2605" * (n * 2 + 1))`, expect: DIAMOND_OUT }
    ],
    practice: [
      {
        title: 'SELF STUDY 6-6. $ 를 입력하면 종료', level: 2,
        desc: '<p><code>$</code> 를 입력하면 while 문을 빠져나가도록 Code06-12 를 수정해 보세요.</p><pre>더할 첫 번째 수를 입력하세요 : 55\n더할 두 번째 수를 입력하세요 : 22\n55 + 22 = 77\n더할 첫 번째 수를 입력하세요 : $\n$를 입력해 반복문을 탈출했습니다.</pre>',
        hint: '입력을 바로 <code>int()</code> 로 바꾸면 <code>$</code> 에서 오류가 납니다. 먼저 문자열로 받아 <code>$</code> 인지 검사한 뒤, 아니면 <code>int()</code> 로 바꿉니다.',
        starter: `hap = 0
a, b = 0, 0

while True :
    a = input("더할 첫 번째 수를 입력하세요 : ")
    # TODO: a 가 "$" 이면 break, 아니면 정수로 바꾸기
    b = int(input("더할 두 번째 수를 입력하세요 : "))
    hap = a + b
    print("%d + %d = %d" % (a, b, hap))

print("$를 입력해 반복문을 탈출했습니다.")
`,
        solution: `hap = 0
a, b = 0, 0

while True :
    a = input("더할 첫 번째 수를 입력하세요 : ")
    if a == "$" :
        break
    a = int(a)
    b = int(input("더할 두 번째 수를 입력하세요 : "))
    hap = a + b
    print("%d + %d = %d" % (a, b, hap))

print("$를 입력해 반복문을 탈출했습니다.")
`,
        stdin: '55\n22\n$\n',
        expect: `더할 첫 번째 수를 입력하세요 : 55
더할 두 번째 수를 입력하세요 : 22
55 + 22 = 77
더할 첫 번째 수를 입력하세요 : $
$를 입력해 반복문을 탈출했습니다.`
      },
      {
        title: 'SELF STUDY 6-7. Code06-13 을 while 문으로', level: 2,
        desc: '<p>Code06-13 을 while 문으로 변경해 보세요. 출력 결과는 같아야 합니다.</p><pre>1~100의 합계를 최초로 1000이 넘게 하는 숫자 : 45</pre>',
        hint: '<code>i = 1</code> 부터 <code>while i &lt; 101 :</code>, 더한 뒤 1000 이상이면 break, 아니면 <code>i += 1</code>. (break 가 증가식보다 먼저 와야 i 가 45 로 남습니다)',
        starter: `hap, i = 0, 0

# TODO: while 문으로 바꾸기

print("1~100의 합계를 최초로 1000이 넘게 하는 숫자 : %d" % i)
`,
        solution: `hap, i = 0, 0

i = 1
while i < 101 :
    hap += i
    if hap >= 1000 :
        break
    i += 1

print("1~100의 합계를 최초로 1000이 넘게 하는 숫자 : %d" % i)
`,
        expect: `1~100의 합계를 최초로 1000이 넘게 하는 숫자 : 45`
      },
      {
        title: 'SELF STUDY 6-8. for 문으로 하트 마름모', level: 3,
        desc: '<p>Code06-15 를 <b>모두 for 문</b>으로 변경해 보세요. 출력은 하트 모양을 사용합니다. 하트 모양의 유니코드는 16진수 <code>2665</code> 입니다.</p><pre>' + HEART_OUT + '</pre>',
        hint: '<code>while k &lt; 4 - i :</code> … <code>k += 1</code> 은 <code>for k in range(0, 4 - i) :</code> 한 줄로 바뀝니다. 바깥도 <code>for i in range(0, 9) :</code>. 하트는 <code>\'\\u2665\'</code>',
        starter: `i, k = 0, 0

for i in range(0, 9) :
    if i < 5 :
        # TODO: 공백 4 - i 개, 하트 i * 2 + 1 개
        pass
    else :
        # TODO: 공백 i - 4 개, 하트 (9 - i) * 2 - 1 개
        pass
    print()
`,
        solution: `i, k = 0, 0

for i in range(0, 9) :
    if i < 5 :
        for k in range(0, 4 - i) :
            print('  ', end = '')
        for k in range(0, i * 2 + 1) :
            print('\\u2665', end = '')
    else :
        for k in range(0, i - 4) :
            print('  ', end = '')
        for k in range(0, (9 - i) * 2 - 1) :
            print('\\u2665', end = '')
    print()
`,
        expect: HEART_OUT
      },
      {
        title: '실습 6-6. 소수(素數) 판별', level: 3,
        desc: '<p>2 이상의 정수를 입력받아 소수(1과 자기 자신으로만 나누어떨어지는 수)인지 판별하세요. 2 부터 차례로 나누어 보다가 <b>나누어떨어지는 수를 찾으면 break</b> 합니다.</p><pre>정수를 입력하세요 : 91\n91 은(는) 7 로 나누어떨어지므로 소수가 아닙니다.</pre>',
        hint: '<code>is_prime = True</code> 로 시작 → <code>for d in range(2, n)</code> 에서 <code>n % d == 0</code> 이면 False 로 바꾸고 break.',
        starter: `n = int(input("정수를 입력하세요 : "))
is_prime = True
# TODO: 2 부터 n-1 까지 나누어 보기 (나누어떨어지면 break)

`,
        solution: `n = int(input("정수를 입력하세요 : "))
is_prime = True
for d in range(2, n) :
    if n % d == 0 :
        is_prime = False
        break

if is_prime :
    print("%d 은(는) 소수입니다." % n)
else :
    print("%d 은(는) %d 로 나누어떨어지므로 소수가 아닙니다." % (n, d))
`,
        stdin: '91\n',
        expect: `정수를 입력하세요 : 91
91 은(는) 7 로 나누어떨어지므로 소수가 아닙니다.`
      }
    ],
    quiz: [
      { q: '다음 코드의 출력은?<pre><code>for i in range(1, 10) :\n    if i == 4 :\n        break\n    print(i, end=" ")</code></pre>', options: ['1 2 3', '1 2 3 4', '4', '1 2 3 5 6 7 8 9'], answer: 0, explain: 'i 가 4 가 되면 print 전에 break 되므로 1 2 3 만 출력됩니다.' },
      { q: '다음 코드의 출력은?<pre><code>for i in range(1, 6) :\n    if i % 2 == 0 :\n        continue\n    print(i, end=" ")</code></pre>', options: ['2 4', '1 3 5', '1 2 3 4 5', '1'], answer: 1, explain: '짝수일 때 continue 로 print 를 건너뛰므로 홀수만 출력됩니다.' },
      { q: 'break 와 continue 에 대한 설명으로 옳은 것은?', options: ['둘 다 반복문을 완전히 끝낸다', 'break 는 반복문을 끝내고, continue 는 이번 회차의 나머지를 건너뛴다', 'continue 는 반복문을 끝내고, break 는 건너뛴다', 'if 문 안에서만 쓸 수 있다'], answer: 1, explain: 'break = 반복 종료, continue = 다음 회차로.' },
      { q: '중첩 for 문의 <b>안쪽</b>에서 break 가 실행되면?', options: ['프로그램 전체가 끝난다', '바깥과 안쪽 반복문이 모두 끝난다', '안쪽 반복문만 끝나고 바깥 반복문은 계속된다', '오류가 난다'], answer: 2, explain: 'break 는 자신을 감싸는 가장 가까운 반복문 하나만 탈출합니다.' },
      { q: 'Code06-15 마름모의 윗부분(i &lt; 5)에서 i 번째 줄의 별 개수는?', options: ['i', 'i * 2', 'i * 2 + 1', '4 - i'], answer: 2, explain: 'i = 0,1,2,3,4 → 별 1,3,5,7,9 개 = i * 2 + 1.' }
    ],
    slides: [
      { layout: 'title', title: 'break · continue 와 [프로그램 2]', subtitle: 'Chapter 06 · Section 05', badge: '6-5',
        notes: '<p>(1분) 복습 발문: "Code06-10 계산기를 끝내려면 어떻게 했나요?" — ■ 중지(Ctrl+C). 프로그램이 스스로 끝낼 수 있게 만드는 것이 오늘의 첫 주제입니다.</p>' },
      { layout: 'diagram', title: '그림 6-8 break 문의 작동', html: `<svg viewBox="0 0 1280 560" width="100%" font-family="sans-serif">
  <defs><marker id="a6b1s" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--danger)"/></marker></defs>
  <rect x="160" y="30" width="600" height="360" rx="20" fill="none" stroke="var(--line)" stroke-width="4" stroke-dasharray="14 10"/>
  <text x="460" y="80" text-anchor="middle" font-size="34" font-weight="bold" fill="var(--fg)">반복문 for, while</text>
  <text x="460" y="140" text-anchor="middle" font-size="36" fill="var(--warn)">· · ·</text>
  <rect x="340" y="170" width="240" height="80" rx="16" fill="var(--ok)"/><text x="460" y="224" text-anchor="middle" font-size="38" font-weight="bold" fill="#fff">break</text>
  <text x="460" y="310" text-anchor="middle" font-size="36" fill="var(--warn)">· · ·</text>
  <text x="460" y="355" text-anchor="middle" font-size="26" fill="var(--muted)">(실행되지 않음)</text>
  <path d="M580 210 H980 V470 H420" fill="none" stroke="var(--danger)" stroke-width="6" marker-end="url(#a6b1s)"/>
  <text x="1010" y="300" font-size="30" fill="var(--fg)">무조건</text><text x="1010" y="345" font-size="30" fill="var(--fg)">반복문 밖으로</text><text x="1010" y="390" font-size="30" fill="var(--fg)">탈출 🚀</text>
  <text x="160" y="482" font-size="32" fill="var(--fg)">반복문 다음 문장</text>
</svg>`, caption: 'break 를 만나면 남은 반복과 상관없이 즉시 탈출',
        notes: '<p>(2분) 로켓 비유: 발사하면 뒤를 돌아보지 않는다. 비상구 비유도 좋습니다.</p>' },
      { layout: 'code', title: 'break 의 기본 동작', code: `for i in range(1, 100) :
    print("for 문을 %d번 실행했습니다." % i)
    break`, points: ['99번 반복할 예정이었지만', '첫 회차에서 break → 1번만 실행', '실제로는 <b>if 문과 함께</b> 사용'],
        notes: '<p>(2분) break 를 print 위로 옮기면? → 아무것도 출력되지 않음. 예측하게 해 보세요.</p>' },
      { layout: 'code', title: 'Code06-12. 0 을 입력하면 종료', code: `hap = 0
a, b = 0, 0

while True :
    a = int(input("더할 첫 번째 수를 입력하세요 : "))
    if a == 0 :
        break
    b = int(input("더할 두 번째 수를 입력하세요 : "))
    hap = a + b
    print("%d + %d = %d" % (a, b, hap))

print("0을 입력해 반복문을 탈출했습니다.")`, stdin: '55\n22\n77\n128\n0\n', points: ['무한 루프 + <b>종료 조건</b>', '0 = 센티널(보초) 값', 'break 후 12행 실행'],
        notes: '<p>(4분) Code06-10 과 비교: 딱 두 줄(6~7행) 추가로 프로그램이 스스로 끝납니다. 예시 입력 후 직접 입력으로도 실행.</p><p>발문: "0 + 5 를 계산하고 싶으면?" → 센티널 값의 한계. SELF STUDY 6-6 의 $ 로 연결.</p>' },
      { layout: 'code', title: 'Code06-13. 합계가 1000 이상이 되는 지점', code: `hap, i = 0, 0

for i in range(1, 101) :
    hap += i

    if hap >= 1000 :
        break

print("1~100의 합계를 최초로 1000이 넘게 하는 숫자 : %d" % i)`, points: ['조건을 처음 만족하는 곳에서 멈춤', 'break 후에도 i 는 45 로 남아 있다', '1~44 합 990, 1~45 합 1035'],
        notes: '<p>(3분) 반복문이 끝난 뒤에도 반복 변수 값을 쓸 수 있다는 점이 포인트입니다. break 없이 실행하면 i 는 100.</p>' },
      { layout: 'diagram', title: '그림 6-9 continue 문의 작동', html: `<svg viewBox="0 0 1280 560" width="100%" font-family="sans-serif">
  <defs><marker id="a6c1s" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--danger)"/></marker></defs>
  <text x="620" y="70" font-size="34" font-weight="bold" fill="var(--fg)">반복문 for, while</text>
  <text x="720" y="150" text-anchor="middle" font-size="36" fill="var(--warn)">· · ·</text>
  <rect x="580" y="180" width="280" height="80" rx="16" fill="var(--ok)"/><text x="720" y="234" text-anchor="middle" font-size="38" font-weight="bold" fill="#fff">continue</text>
  <text x="720" y="320" text-anchor="middle" font-size="36" fill="var(--warn)">· · ·</text>
  <text x="720" y="360" text-anchor="middle" font-size="26" fill="var(--muted)">(이번 회차는 건너뜀)</text>
  <path d="M860 220 H1020 V460 H360 V58 H600" fill="none" stroke="var(--danger)" stroke-width="6" marker-end="url(#a6c1s)"/>
  <text x="1040" y="300" font-size="28" fill="var(--fg)">무조건</text><text x="1040" y="340" font-size="28" fill="var(--fg)">끝으로</text><text x="1040" y="380" font-size="28" fill="var(--fg)">건너뛴 후</text>
  <text x="60" y="250" font-size="28" fill="var(--fg)">다시 반복문으로</text><text x="60" y="290" font-size="28" fill="var(--fg)">돌아감 🛸</text>
</svg>`, caption: 'continue: 이번 회차의 나머지를 건너뛰고 다음 회차로',
        notes: '<p>(2분) break = "수업 끝", continue = "이 문제 패스, 다음 문제". 반복문 자체는 계속된다는 점이 차이입니다.</p>' },
      { layout: 'code', title: 'Code06-14. 3의 배수를 빼고 더하기', code: `hap, i = 0, 0

for i in range(1, 101) :
    if i % 3 == 0 :
        continue

    hap += i

print("1~100의 합계(3의 배수 제외) : %d" % hap)`, points: ['3의 배수면 7행을 건너뜀', '결과 3367 = 5050 − 1683', '<code>if i % 3 != 0 : hap += i</code> 와 같다'],
        notes: '<p>(3분) continue 없이 조건을 뒤집어도 같은 결과. continue 는 "예외 상황을 먼저 걸러내는" 스타일에 유용합니다.</p><p>while 문에서 continue 쓸 때 증가식을 먼저 두지 않으면 무한 루프가 된다는 점을 꼭 경고하세요.</p>' },
      { layout: 'table', title: 'break vs continue', head: ['', 'break', 'continue'], rows: [
        ['하는 일', '반복문을 완전히 끝냄', '이번 회차만 건너뜀'],
        ['다음 위치', '반복문 다음 문장', '반복문의 처음'],
        ['중첩 반복문', '가장 가까운 반복문만 탈출', '가장 가까운 반복문의 다음 회차'],
        ['예제', 'Code06-12, 13', 'Code06-14']
      ], notes: '<p>(2분) 퀴즈처럼 진행: 짝수만 출력하려면? 처음으로 7의 배수가 나오면 멈추려면? 어느 쪽을 써야 할지 묻습니다.</p>' },
      { layout: 'code', title: '[프로그램 2] 준비 — 별 글자와 규칙', code: `print('\\u2605')
for i in range(0, 5) :
    print("i=%d : 공백 %d개, 별 %d개" % (i, 4 - i, i * 2 + 1))
for i in range(5, 9) :
    print("i=%d : 공백 %d개, 별 %d개" % (i, i - 4, (9 - i) * 2 - 1))`, points: ['<code>\'\\u2605\'</code> = ★ (유니코드)', '윗부분: 공백 4−i, 별 i×2+1', '아랫부분: 공백 i−4, 별 (9−i)×2−1'],
        notes: '<p>(4분) 코드보다 규칙 찾기가 핵심입니다. 칠판에 마름모를 그리고 줄마다 공백 · 별 개수를 학생들이 세어 표를 만들게 한 뒤, 이 코드로 확인하세요.</p>' },
      { layout: 'code', title: 'Code06-15. [프로그램 2] 완성', code: DIAMOND_CODE.split('\n').slice(4).join('\n'), points: ['바깥 while: 줄 i (0~8)', 'if/else: 윗부분 · 아랫부분', '안쪽 while: 공백, 별', '안쪽마다 <code>k = 0</code> 초기화!'],
        notes: '<p>(6분) 실행해서 [프로그램 2] 와 같은지 확인. 12행의 <code>k = 0</code> 을 지우면 별이 안 찍히는 것을 보여 주세요 — 누적 변수 초기화와 같은 원리.</p><p>9를 다른 수로 바꾸면 크기가 바뀌도록 하려면? 도전 과제로 제시해도 좋습니다.</p>' },
      { layout: 'quiz', title: '확인 문제', q: '<code>for i in range(1, 6) :<br>&nbsp;&nbsp;&nbsp;&nbsp;if i % 2 == 0 :<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;continue<br>&nbsp;&nbsp;&nbsp;&nbsp;print(i, end=" ")</code><br>의 출력은?', options: ['2 4', '1 3 5', '1', '1 2 3 4 5'], answer: 1, explain: '짝수일 때 print 를 건너뛰므로 홀수만 출력됩니다.',
        notes: '<p>(1분) continue 를 break 로 바꾸면? → "1" 만 출력. 바로 이어서 물어보세요.</p>' },
      { layout: 'practice', title: 'SELF STUDY 6-6. $ 를 입력하면 종료', desc: '$ 를 입력하면 while 문을 빠져나가도록 Code06-12 를 수정해 보세요.', stdin: '55\n22\n$\n',
        starter: `hap = 0
while True :
    a = input("더할 첫 번째 수를 입력하세요 : ")
    # TODO: "$" 이면 break, 아니면 정수로 변환
    b = int(input("더할 두 번째 수를 입력하세요 : "))
    hap = a + b
    print("%d + %d = %d" % (a, b, hap))
print("$를 입력해 반복문을 탈출했습니다.")
`, solution: `hap = 0
while True :
    a = input("더할 첫 번째 수를 입력하세요 : ")
    if a == "$" :
        break
    a = int(a)
    b = int(input("더할 두 번째 수를 입력하세요 : "))
    hap = a + b
    print("%d + %d = %d" % (a, b, hap))
print("$를 입력해 반복문을 탈출했습니다.")
`,
        notes: '<p>(4분) int(input()) 을 그대로 두고 "$" 와 비교하면 ValueError — 흔한 오답을 먼저 보여 주세요. 문자열로 받아 검사 → 변환 순서가 핵심.</p>' },
      { layout: 'practice', title: 'SELF STUDY 6-8. for 문으로 하트 마름모', desc: 'Code06-15 를 모두 for 문으로 바꾸고, 하트(유니코드 2665)로 출력해 보세요.',
        starter: `for i in range(0, 9) :
    if i < 5 :
        # TODO: 공백 4 - i 개, 하트 i * 2 + 1 개
        pass
    else :
        # TODO: 공백 i - 4 개, 하트 (9 - i) * 2 - 1 개
        pass
    print()
`, solution: `for i in range(0, 9) :
    if i < 5 :
        for k in range(0, 4 - i) :
            print('  ', end = '')
        for k in range(0, i * 2 + 1) :
            print('\\u2665', end = '')
    else :
        for k in range(0, i - 4) :
            print('  ', end = '')
        for k in range(0, (9 - i) * 2 - 1) :
            print('\\u2665', end = '')
    print()
`,
        notes: '<p>(5분) while 문의 "k = 0 / while k &lt; n / k += 1" 세 줄이 for 문 한 줄로 줄어드는 것을 강조. SELF STUDY 6-7(Code06-13 을 while 로)은 과제로 내 주세요.</p>' },
      { layout: 'summary', title: '정리', bullets: [
        '<code>break</code>: 반복문을 즉시 탈출 — if 와 함께 종료 조건으로 사용',
        '무한 루프 + break + 센티널 값(0, $) = 스스로 끝나는 프로그램',
        '<code>continue</code>: 이번 회차의 나머지를 건너뛰고 다음 회차로',
        '중첩 반복문에서는 가장 가까운 반복문 하나에만 적용',
        '[프로그램 2]: 줄마다 공백 · 별 개수의 규칙을 찾아 중첩 반복으로 출력'
      ], notes: '<p>(2분) 6장 전체 정리: for(횟수) · 중첩 for(줄×칸) · while(조건) · break/continue(흐름 제어). 다음 장은 여러 값을 한꺼번에 다루는 리스트입니다.</p>' }
    ]
  };

  PY_COURSE.addChapter({
    id: 'ch06',
    no: '06',
    title: '반복문',
    subtitle: 'for · while · break · continue',
    summary: '같은 코드를 여러 번 실행하는 반복문을 배웁니다. range() 와 함께 쓰는 for 문, for 문 안의 for 문(중첩 for 문), 조건이 참인 동안 반복하는 while 문과 무한 루프, 반복의 흐름을 바꾸는 break · continue 를 익히고, 구구단과 마름모 모양을 출력하는 프로그램을 만듭니다.',
    goals: [
      '기본 for 문과 range() 함수의 형식과 사용법을 익힌다',
      '중첩 for 문의 실행 순서를 설명하고 구구단을 출력할 수 있다',
      'for 문과 비슷한 while 문의 형식과 무한 루프의 사용법을 익힌다',
      'break 문과 continue 문으로 반복의 흐름을 제어할 수 있다',
      '반복문으로 구구단과 마름모 모양을 출력하는 프로그램을 만든다'
    ],
    sections: [S1, S2, S3, S4, S5]
  });
})();
