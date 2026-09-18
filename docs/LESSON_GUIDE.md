# 강좌 콘텐츠 작성 가이드 (파이썬)

각 챕터는 `lessons/<id>.js` 파일 하나로 작성합니다. (id: `ch01` … `ch14`)
파일은 **평범한 브라우저 스크립트**이며 `PY_COURSE.addChapter({...})` 를 한 번 호출합니다.
(모듈 문법 `import/export` 금지, 전역 변수 추가 금지 — 필요하면 즉시 실행 함수 `(function(){ ... })();` 안에서 상수를 만드세요)

같은 데이터로 두 화면이 만들어집니다.

- **학생용**: 섹션(교시) 단위 문서 — 학습 목표 → 본문(`content`) → 실습 과제(`practice`) → 퀴즈(`quiz`)
- **교사용**: 섹션별 PPT 형태 슬라이드(`slides`) + 교사 노트(`notes`) + 수업 흐름(`flow`) + 정답

코드는 **브라우저 안의 파이썬(Pyodide, Python 3.14)** 에서 실행됩니다. 설치 · 서버가 필요 없습니다.
강의자료의 IDLE(대화형 모드 · 스크립트 모드) 대신 이 강좌의 **편집기 + 콘솔 + `>>>` 셸**을 사용합니다.

## 1. 챕터 구조

```js
PY_COURSE.addChapter({
  id: 'ch05',
  no: '05',
  title: '조건문',
  subtitle: 'if · elif · else',
  summary: '조건에 따라 다른 코드를 실행하는 if 문을 배우고, 거북이 그래픽과 계산기 프로그램을 만듭니다.',
  goals: ['if 문의 형식과 들여쓰기 규칙을 설명할 수 있다', '...'],
  sections: [ /* 섹션(교시) 목록 */ ]
});
```

## 2. 섹션(교시) 구조

강의자료의 Section 하나를 기본 단위로 하되, 내용이 많으면 2개로 나누고 적으면 합칩니다. (섹션 1개 ≈ 45~50분 수업)
`Section 01 이 장에서 만들 프로그램` 은 보통 첫 교시의 도입부로 넣고, `[프로그램 N]의 완성` 은 해당 내용을 배운 교시의 마지막 부분(또는 별도 교시)에 넣습니다.

```js
{
  id: 'ch05-1',                       // 챕터id-번호 (전체에서 유일)
  title: 'if 문의 기본',
  minutes: 50,
  goals: ['조건식의 결과가 True/False 임을 이해한다', '...'],
  flow: [['도입', 5], ['개념 설명', 15], ['예제 실습', 20], ['정리 · 퀴즈', 10]],   // 교사용 수업 흐름 [이름, 분]
  content: [ /* 본문 블록 */ ],
  practice: [ /* 실습 과제 */ ],
  quiz: [ /* 퀴즈 */ ],
  slides: [ /* 교사용 슬라이드 */ ]
}
```

## 3. 본문 블록 (`content`)

모든 `html` 필드는 HTML 문자열입니다. 인라인 코드는 `<code>…</code>`, 강조는 `<b>`, `<mark>` 사용.
템플릿 문자열(백틱)을 쓸 때는 코드 안의 `${` 와 백틱, 역슬래시에 주의하세요 (`\${`, `` \` ``, `\\n`).
**파이썬 코드 문자열 안의 `\n` 은 JS 문자열에서 `\\n` 으로 써야** 파이썬 코드에 `\n` 이 들어갑니다.

| type | 필드 | 설명 |
|---|---|---|
| `h` | `text` | 소제목 |
| `p` | `html` | 문단 |
| `list` | `items: [html]`, `ordered?` | 목록 |
| `table` | `head: [..]`, `rows: [[..]]`, `caption?` | 표 (셀은 html) |
| `code` | `title`, `code`, `stdin?`, `expect?`, `desc?`, `run?`, `repl?`, `dialogs?`, `expectError?`, `nondeterministic?` | 파이썬 코드 (기본: 실행 가능) |
| `callout` | `kind: 'tip'\|'warn'\|'info'\|'more'`, `title?`, `html` | 강조 상자. **`more` = 📘 더 알아보기 (강의자료에 없는 보충 내용)** |
| `figure` | `html`, `caption?` | 그림 (인라인 SVG 또는 HTML, CSS 변수 사용 가능) |

### `code` 블록 규칙 (중요)

- **그대로 실행되는 완전한 프로그램**이어야 합니다. 앞 예제의 변수에 기대지 마세요.
- `title`: 강의자료의 코드 번호를 유지합니다. 예: `'Code05-01. 기본 if 문'`, `'[프로그램 1] 완성: 무지개 색상의 원'`.
  강의자료 코드 조각(몇 줄만 바꾸는 예)은 **완성된 코드**로 만들어 넣습니다. 추가 예제는 `'추가 예제. …'`.
  오타는 바로잡고, 코드 스타일(변수 이름 · 구조)은 강의자료를 최대한 따릅니다.
- `desc`: 코드 아래 짧은 해설(html). 줄 번호로 설명할 때는 `<code>3행</code>` 형식.
- **`input()`** 을 쓰는 예제는 `stdin` 에 검증용 입력을 넣습니다. 예: `stdin: '100\n50\n'`
  - 학생 화면에서는 ▶ 실행 후 콘솔 입력칸에 직접 입력하고, **"예시 입력으로 실행"** 버튼을 누르면 `stdin` 이 자동 입력됩니다.
  - 미리 넣은 입력은 터미널처럼 **화면에 함께 표시**됩니다. 따라서 `expect` 에도 입력값이 들어갑니다.
    예: `input('숫자 : ')` 에 `10` 입력 → expect 는 `'숫자 : 10\n...'`
- `expect`: **실제 실행 결과**(표준 출력 + 표준 오류)를 그대로 넣습니다. 검증 도구가 비교합니다. (줄 끝 공백 · 끝의 빈 줄은 무시)
  - 난수 · 날짜 · 시간 · 집합 순서처럼 실행마다 달라지는 결과는 `nondeterministic: true` 로 하고 `expect` 를 생략합니다.
    (`random.seed(…)` 로 결과를 고정할 수 있으면 고정하고 expect 를 넣어도 됩니다)
- 오류를 일부러 보여 주는 예제는 `expectError: true` (종료 코드 ≠ 0 허용). traceback 도 expect 에 넣을 수 있습니다:
  ```
  Traceback (most recent call last):
    File "main.py", line 2, in <module>
      print(10 / 0)
            ~~~^~~
  ZeroDivisionError: division by zero
  ```
  (실제 모양은 `node tools/validate.js chNN --print` 로 확인해서 넣으세요)
- **대화형 모드(IDLE 셸 `>>>`) 예제**는 `repl: true` 로 표시합니다. `code` 에는 `>>>` 없이 **입력할 줄만** 씁니다.
  화면에는 줄 앞에 `>>>`/`...` 가 붙어 보이고, ▶ 실행하면 콘솔의 `>>>` 셸에서 한 줄씩 실행됩니다.
  `expect` 는 셸 화면 그대로입니다. 예:
  ```js
  { type: 'code', repl: true, title: '대화형 모드에서 계산하기', code: '100 + 200\na = 5\na * 3\nprint("hello")',
    expect: '>>> 100 + 200\n300\n>>> a = 5\n>>> a * 3\n15\n>>> print("hello")\nhello\n>>>' }
  ```
  들여쓴 블록(for · if · def)은 끝에 빈 줄을 넣어 닫습니다 (`...` 다음 빈 줄). 셸 예제 안에서는 `input()` 을 쓰지 마세요.
- 문법 조각(실행 불가)은 `run: false` — 꼭 필요한 경우에만 사용하세요. 가능하면 실행 가능한 형태로 만드세요.
- **여러 파일**(내가 만든 모듈, 읽을 데이터 파일)이 필요하면 한 코드 안에서 파일 구분 주석을 씁니다.
  마지막 구역이 실행할 프로그램(main.py)이고, 앞의 구역들은 작업 폴더에 파일로 저장됩니다.
  ```python
  # ===== File: Module1.py =====
  def func1():
      print("Module1.py의 func1()이 호출됨.")
  # ===== File: main.py =====
  import Module1
  Module1.func1()
  ```
  데이터 파일도 같은 방식으로 만들 수 있습니다: `# ===== File: data1.txt =====` 다음 줄부터 파일 내용.
- **파일 입출력**: 프로그램의 현재 폴더는 **작업 폴더**입니다. 경로는 **상대 경로**만 씁니다 (`'data1.txt'`, `'GIF/dog.gif'`).
  강의자료의 `C:/CookPython/…`, `C:/Windows/win.ini` 같은 경로는 작업 폴더의 파일로 바꾸고, 바꾼 이유를 한 줄로 알려 주세요.
  각 예제는 스스로 완결되어야 합니다 (읽기 예제라면 먼저 파일을 만들거나, 파일 구분 주석 · assets 파일을 사용).
- 실행 시간은 수 초 이내. 끝나지 않는 반복(무한 루프)은 GUI 이벤트 루프를 빼고는 쓰지 마세요.

### GUI 예제 (turtle · tkinter · pygame)

브라우저에서는 강좌용 호환 모듈이 페이지 위에 창을 띄웁니다. **표준 모듈과 같은 코드**로 작성하세요.

- **turtle**: `forward/fd, back, left/lt, right/rt, goto/setpos, setx, sety, setheading/seth, home, circle, dot, stamp,
  penup/pu, pendown/pd, pensize/width, pencolor, fillcolor, color, begin_fill, end_fill, write, shape, shapesize/turtlesize,
  speed, hideturtle, showturtle, position/pos, xcor, ycor, heading, towards, distance, clear, reset,
  Screen(), Turtle(), bgcolor, bgpic, title, setup, screensize, window_width, window_height, colormode, tracer, update,
  onscreenclick/onclick, onkey/onkeypress/onkeyrelease, listen, ontimer, textinput, numinput, register_shape(gif), done, mainloop, exitonclick, bye`
  (모듈 함수와 Turtle 객체 메서드 모두). 기본 창 크기는 640×520 입니다.
- **tkinter**: `Tk, Toplevel, Frame, LabelFrame, Label, Button, Entry, Text, Checkbutton, Radiobutton, Listbox, Scale, Spinbox,
  Canvas(선 · 사각형 · 원 · 호 · 다각형 · 글자 · 이미지, move, coords, delete, itemconfig, tag_bind …), Menu(메뉴 막대 · 팝업),
  Scrollbar(모양만), OptionMenu, PhotoImage(GIF · PNG 파일, width/height 빈 이미지, put · get · zoom · subsample · copy),
  StringVar · IntVar · DoubleVar · BooleanVar, pack · grid · place, bind(마우스 · 키보드 이벤트), after, mainloop`
  과 `tkinter.messagebox`, `tkinter.simpledialog`(askinteger · askfloat · askstring), `tkinter.filedialog`(askopenfilename ·
  asksaveasfilename — 작업 폴더의 파일 목록 + 내 PC 파일 올리기), `tkinter.colorchooser`, `tkinter.ttk`(기본 모양).
- **pygame**: `init, display.set_mode/set_caption/update/flip, Surface(fill, blit, get_rect, get_size), image.load, transform
  (scale · rotate · flip), draw(rect · circle · ellipse · line · lines · polygon · arc), font.SysFont/Font.render, event.get
  (QUIT · KEYDOWN · KEYUP · MOUSE*), key.get_pressed, mouse.get_pos, time.Clock.tick, time.get_ticks, Rect(충돌 판정),
  sprite(Sprite · Group · spritecollide), mixer(소리 파일이 있을 때)`.
- **Pillow(PIL)**: 실제 Pillow 가 자동으로 로드됩니다. `from PIL import ImageTk` 의 `ImageTk.PhotoImage(pil이미지)` 도 됩니다.
- 프로그램이 끝나도 창이 열려 있으면 IDLE 처럼 창이 계속 동작합니다(이벤트 처리). 창의 ✕ 로 닫습니다.
- GUI 예제는 보통 출력이 없으므로 `expect` 를 넣지 않아도 됩니다 (검증 도구가 오류 없이 끝나는지만 확인).
  검증 도구는 화면 없이 실행합니다: `mainloop()` · `done()` 은 바로 끝나고, pygame 은 몇 프레임 뒤 QUIT 이벤트를 받습니다.
- 대화상자(`simpledialog.askinteger`, `turtle.textinput`, `filedialog.askopenfilename` …)가 있는 예제는 검증용 응답을
  `dialogs: [값, …]` 로 순서대로 넣습니다. 예: `dialogs: ['안녕하세요']`, `dialogs: ['GIF/dog.gif']`.
  (응답이 없으면 `None`, 파일 대화상자는 `''` — 이때 프로그램이 오류 없이 끝나야 합니다)

### 예제용 파일 (assets)

그림 · 소리 · 데이터 파일은 `assets/` 에 넣습니다. 브라우저에서도 검증 도구에서도 **작업 폴더에 같은 경로로 복사**됩니다.

- 폴더 예: `assets/GIF/…`(tkinter 사진 · 그림, **GIF**), `assets/RAW/…`(RAW 흑백 영상), `assets/images/…`(PNG/JPG), `assets/game/…`(게임 그림).
  코드에서는 `PhotoImage(file='GIF/dog.gif')` 처럼 씁니다.
- 저작권이 있는 교재 그림을 쓰지 않고, **파이썬(Pillow)으로 직접 만든 그림**을 씁니다. 만드는 스크립트는
  `tools/assets/<chNN>_assets.py` 로 저장해 다시 만들 수 있게 하세요. (크기는 작게: 그림 1장 수십 KB 이하, 챕터 전체 1MB 이하)
- 파일을 추가하거나 바꾼 뒤에는 `python tools/build-assets.py` 로 `assets/manifest.json` 을 다시 만듭니다.
- 다른 챕터가 만든 파일을 덮어쓰지 마세요 (같은 이름이 있으면 챕터 이름을 붙인 폴더 사용).

## 4. 실습 과제 (`practice`)

```js
{
  title: 'SELF STUDY 5-1. 짝수 · 홀수 판별',   // 강의자료의 SELF STUDY / 연습문제는 번호 유지, 새 과제는 '실습 5-1. …'
  level: 1,                         // 1 기초, 2 응용, 3 도전
  desc: '<p>정수를 입력받아 짝수인지 홀수인지 출력하세요.</p>',
  hint: '<code>%</code> 연산자로 2로 나눈 나머지를 구합니다.',
  starter: 'num = int(input("정수 : "))\n# TODO: 짝수/홀수 판별\n',
  solution: 'num = int(input("정수 : "))\nif num % 2 == 0:\n    print("짝수")\nelse:\n    print("홀수")\n',
  stdin: '7\n',                     // 선택
  expect: '정수 : 7\n홀수',          // 정답 코드의 실행 결과 (선택, nondeterministic 이면 생략)
  nondeterministic: false,
  dialogs: []                       // GUI 대화상자 응답 (선택)
}
```

- `starter` 는 **문법 오류 없이 실행되는** 뼈대 코드로 작성합니다 (TODO 주석). 입력 부족 · 결과 없음은 괜찮습니다.
- `solution` 은 교사용 화면에서만 보입니다. 반드시 실행 가능해야 합니다.
- 강의자료의 SELF STUDY · 연습문제가 있으면 포함하고, 섹션마다 1~3개.

## 5. 퀴즈 (`quiz`)

```js
{ q: '다음 코드의 실행 결과는?<pre><code>a = 10\nif a > 5:\n    print("크다")\nelse:\n    print("작다")</code></pre>',
  options: ['크다', '작다', '오류', '아무것도 출력되지 않는다'], answer: 0,
  explain: '<code>a > 5</code> 가 True 이므로 if 블록이 실행됩니다.' }
```

- 섹션마다 3~5문항, 4지선다(`answer` 는 0부터 시작하는 인덱스). 코드 결과 예측형 문제 권장.
  (`q` 안의 `<pre><code>` 에서 `<`, `>` 는 `&lt;`, `&gt;` 로 쓰는 것이 안전합니다)

## 6. 교사용 슬라이드 (`slides`)

16:9 PPT 한 장 = 객체 하나. **한 장에 너무 많이 넣지 마세요** (불릿 3~6개, 한 줄 40자 안팎, 코드 18줄 이내).
모든 슬라이드에 `notes`(교사 노트: 말할 내용, 학생에게 던질 발문, 주의점, 시간)를 html 로 작성합니다.

| layout | 필드 |
|---|---|
| `title` | `title`, `subtitle?`, `badge?` — 섹션 첫 장 |
| `bullets` | `title`, `bullets: [html \| [html, [하위 html…]]]`, `lead?` (상단 한 줄 요약) |
| `code` | `title`, `code`, `stdin?`, `repl?`, `points?: [html]` (코드 옆 설명 2~4개), `run?`, `dialogs?` — 교사 화면에서 편집 · 실행 가능 |
| `two` | `title`, `left: {title, bullets? \| html? \| code? , repl?}`, `right: {…}` — 비교 |
| `table` | `title`, `head`, `rows`, `lead?` |
| `diagram` | `title`, `html` (인라인 SVG/HTML), `caption?` |
| `quiz` | `title`, `q`, `options`, `answer`, `explain` — 클릭하면 정답 공개 |
| `practice` | `title`, `desc`, `starter`, `solution`, `stdin?` — 교사가 정답 실행 가능 |
| `summary` | `title`, `bullets` — 섹션 마지막 장 |

섹션 한 개당 슬라이드 8~14장 권장: `title` → 개념(bullets/diagram/table) → 예제(code) … → quiz → practice → summary.
`code` 슬라이드의 코드는 본문 예제와 같거나 더 짧게 줄인 버전이며, 역시 **실행 가능한 완전한 프로그램**이어야 합니다
(`expect` 는 넣지 않아도 되지만 오류 없이 실행되어야 합니다). 대화형 예제는 `repl: true`.

### 다이어그램(figure / diagram) 스타일

- 인라인 `<svg viewBox="0 0 W H">` 권장, 폭 100%. 색은 CSS 변수를 사용: `var(--fg)`, `var(--muted)`, `var(--accent)`,
  `var(--accent2)`, `var(--ok)`, `var(--warn)`, `var(--danger)`, `var(--card)`, `var(--line)`.
- 글꼴 크기는 슬라이드 기준 18~24(viewBox 단위 1280×720 기준)로 크게.
- 강의자료의 그림(메모리 상자 · 흐름도 · 순서도 · 실행 화면)은 SVG 로 다시 그려 넣으면 좋습니다.

## 7. 내용 작성 원칙

1. 강의자료(PPT)의 **모든 개념과 코드 예제**를 빠짐없이 옮깁니다 (설치 화면 캡처 설명 등은 요약).
   코드는 슬라이드 그림 속에 있으므로 이미지를 보고 정확히 옮기세요.
2. 문장은 강의자료를 그대로 베끼지 말고 **새로 풀어 씁니다** (원본 저작권 보호). 코드는 강의자료를 따릅니다.
3. 강의자료에 없는 **보충 설명**을 추가합니다: 왜 그런지, 흔한 실수와 오류 메시지, 동작 원리(메모리 · 참조),
   파이썬다운 방법, 최신 파이썬 문법(f-string 등) → `callout kind:'more'` 또는 추가 예제.
4. 초보자 눈높이: 짧은 문장, 비유, 단계별 설명. 용어는 처음 나올 때 영어 병기.
5. IDLE 사용법은 이 웹 강좌 기준으로 바꿔 설명합니다 (IDLE 대화형 모드 → 콘솔의 `>>> 셸`, 스크립트 모드 → 편집기 + ▶ 실행,
   F5 → Ctrl+Enter). 집에서 IDLE 을 설치해 쓰는 방법은 `more` 상자로 짧게 안내합니다.
6. 모든 예제는 검증 도구로 실행해 확인합니다.

## 8. 검증

로컬 파이썬(3.14 권장, 브라우저와 같은 버전)과 Node.js 가 필요합니다. Pillow 가 설치되어 있어야 PIL 예제를 검증합니다.

```bash
node tools/validate.js ch05                 # 스키마 + 모든 코드 실행 + expect 비교
node tools/validate.js ch05 --print         # 실제 출력 보기 (expect 작성용)
node tools/validate.js all
python tools/build-assets.py                # assets/manifest.json 다시 만들기
```
