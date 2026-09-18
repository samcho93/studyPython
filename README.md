# 🐍 파이썬 프로그래밍 웹 실습 강좌

강의자료(`lecture/Ch01 ~ Ch14`)를 바탕으로 개념 설명을 보강하고, **브라우저에서 파이썬 코드를 바로 실행**하며 배우는 웹 강좌입니다.
같은 콘텐츠를 **학생용(문서 + 실습)** 과 **교사용(PPT 슬라이드 + 교사 노트)** 두 화면으로 제공합니다.
설치할 것이 없습니다 — 파이썬은 브라우저 안(WebAssembly, [Pyodide](https://pyodide.org) · Python 3.14)에서 실행되고,
**거북이 그래픽(turtle) · tkinter 창 · pygame 게임 · Pillow · SQLite · 파일 입출력**까지 모두 페이지 안에서 동작합니다.

| 챕터 | 내용 | 챕터 | 내용 |
|---|---|---|---|
| 01 | 파이썬 들여다보기 | 08 | 문자열 |
| 02 | 미리 만드는 쓸 만한 프로그램 (계산기 · 거북이) | 09 | 함수와 모듈 |
| 03 | 변수와 데이터형 | 10 | 윈도 프로그래밍 (tkinter) |
| 04 | 연산자 | 11 | 파일 입출력 |
| 05 | 조건문 | 12 | 객체지향 프로그래밍 |
| 06 | 반복문 | 13 | 데이터베이스 (SQLite) |
| 07 | 리스트, 튜플, 딕셔너리 | 14 | 미니 프로젝트 (미니 포토샵 · 슈팅 게임) |

## 사용 방법

### GitHub Pages (서버 없이)

저장소 **Settings → Pages → Branch: `main` / root** 로 설정하면 `https://<사용자>.github.io/studyPython/` 에서 바로 사용합니다.

- 학생용: `…/studyPython/student.html`
- 교사용: `…/studyPython/teacher.html`

GitHub Pages 는 응답 헤더를 바꿀 수 없어서, 처음 접속할 때 서비스 워커(`coi-sw.js`)가 설치되고 페이지가 한 번 새로 고쳐집니다.
그러면 **교차 출처 격리(SharedArrayBuffer)** 가 켜져, 실행 중인 프로그램이 `input()` 으로 키보드 입력을 기다리고 GUI 창의 마우스 · 키보드 이벤트를 받을 수 있습니다.

### 내 PC 에서 (로컬 서버)

**필요한 것:** 파이썬 3.8 이상(서버용), 최신 브라우저(Chrome · Edge · Firefox · Safari), 인터넷 연결(파이썬 실행 환경 · 글꼴 · 편집기 CDN)

1. `start.bat` 더블클릭 (macOS / Linux: `./start.sh`) — 또는 `python server/serve.py`
2. 브라우저에서 http://localhost:8080/student.html (교사용: `teacher.html`)

`server/serve.py` 는 표준 라이브러리만 쓰는 작은 웹 서버입니다. 파이썬 코드는 서버가 아니라 **각자의 브라우저에서 실행**됩니다.

### 교실에서 함께 쓰기 (같은 네트워크)

교사 PC 에서 `start-lan.bat` (또는 `./start.sh --lan`) 을 실행하면 표시되는 주소(예: `http://192.168.0.10:8080`)로 학생 PC 가 접속합니다.
HTTP 로 LAN 접속하면 브라우저가 SharedArrayBuffer 를 막기 때문에, 이때는 실행 중 입력 · GUI 이벤트를 서버의 채널 API 로 전달합니다.
Windows 방화벽에서 포트를 허용해야 할 수 있습니다.

```bat
netsh advfirewall firewall add rule name="StudyPython" dir=in action=allow protocol=tcp localport=8080
```

> 가장 간단한 방법은 GitHub Pages 주소를 학생들에게 알려 주는 것입니다 (서버 불필요, HTTPS 라 입력도 실시간).

## 화면 구성

- **왼쪽** — 챕터/교시 목차, 학습 진도(브라우저에 저장), 검색, 학생용/교사용 전환, 파이썬 실행 환경 상태
- **가운데** — 📄 문서 보기(학습 목표 → 개념 → 예제 → 📘 더 알아보기 → 실습 과제 → 퀴즈) + 하단 코드 편집기
  또는 🖼️ 슬라이드 보기(16:9 PPT)
- **오른쪽** — 콘솔: 출력 · 오류(traceback 줄 클릭 → 편집기 이동 + 한국어 도움말), 실행 중 키보드 입력(`input()`),
  `>>> 셸`(IDLE 대화형 모드), 📁 작업 폴더(파일 입출력 결과 · 예제 그림 파일 보기 · 내려받기 · 올리기)
- **GUI 창** — turtle · tkinter · pygame 프로그램은 페이지 위에 떠 있는 창으로 열립니다 (끌어서 이동, ✕ 로 닫기)

## 학생용 · 교사용

| 페이지 | 기본 보기 | 기능 |
|---|---|---|
| `student.html` 🎓 | 문서형 강좌 | 예제 ▶ 실행 · 편집 · 콘솔 입력, `>>>` 대화형 예제, 실습 과제(시작 코드 · 힌트 · 기대 출력), 퀴즈 즉시 채점, 진도 저장, 슬라이드 보기 |
| `teacher.html` 🧑‍🏫 | PPT 슬라이드 | 슬라이드에서 코드 **직접 수정 · 실행**, ⛶ 전체 화면(결과 패널 · GUI 창 함께 표시), 교사 노트 · 수업 흐름, 퀴즈 정답 공개, 실습 정답 코드 표시 · 실행, 수업 타이머, 🖥 발표자 창 |

**슬라이드 단축키:** `←` `→` 이동 · `F` 전체 화면 · `R` 결과(콘솔) 패널 · `G` 슬라이드 목록 · `N` 교사 노트 · `B` 화면 가리기 · `T` 타이머 · 코드 편집기에서 `Ctrl+Enter` 실행

**발표자 창(`presenter.html`):** 프로젝터에는 강좌 창을 전체 화면으로, 교사 모니터에는 발표자 창(노트 · 다음 슬라이드 · 타이머)을 띄우면 함께 넘어갑니다.

**딥 링크:** `teacher.html#ch05-1@3` → 5장 1교시의 3번째 슬라이드

## 코드 실행 규칙

- 편집기의 코드는 `main.py` 로 실행됩니다. 오류가 나면 traceback 의 `File "main.py", line N` 을 눌러 해당 줄로 이동합니다.
- 여러 파일(내가 만든 모듈, 읽을 데이터 파일)이 필요하면 파일 구분 주석을 씁니다. 마지막 구역이 실행할 프로그램입니다.

  ```python
  # ===== File: Module1.py =====
  def func1():
      print("Module1.py의 func1()이 호출됨.")
  # ===== File: main.py =====
  import Module1
  Module1.func1()
  ```

- 프로그램의 현재 폴더는 **작업 폴더**(`/home/pyodide/work`)입니다. 예제용 그림 · 데이터 파일(`assets/`)이 미리 들어 있고,
  프로그램이 만든 파일은 콘솔의 📁 작업 폴더에서 보고 내려받을 수 있습니다. 페이지를 새로 고치면 처음 상태로 돌아갑니다.
- 끝나지 않는 프로그램은 **■ 중지**(또는 입력칸에서 `Ctrl+C`)로 멈춥니다.
- `turtle` · `tkinter` · `pygame` 은 브라우저용 **호환 모듈**(`py/`)입니다. 교재에 나오는 기능을 표준 모듈과 같은 코드로 지원합니다
  (지원 목록: `docs/LESSON_GUIDE.md`). 스레드(`threading`)처럼 브라우저에서 동작하지 않는 기능도 있습니다.

## 폴더 구조

```
index.html              강좌 메인 페이지 (?role=student|teacher)
student.html            학생용 진입 페이지
teacher.html            교사용 진입 페이지 (슬라이드)
presenter.html          발표자 창
coi-sw.js               교차 출처 격리 서비스 워커 (GitHub Pages 에서 input() 사용)
css/style.css           레이아웃 · 문서 · 콘솔 스타일 (라이트/다크)
css/slides.css          16:9 슬라이드 스타일
css/gui.css             파이썬 GUI 창 (tkinter · turtle · pygame) 스타일
js/course.js            커리큘럼 (챕터 목록)
js/app.js               네비게이션 · 문서 렌더링 · 에디터 · 진도 · 작업 폴더
js/slides.js            슬라이드 엔진 · 전체 화면 · 교사 노트 · 발표자 창 · 타이머
js/runner.js            콘솔 · 실행 · 오류 도움말
js/highlight.js         코드 강조 · 에디터 생성 · 공용 유틸
js/py-engine.js         파이썬 실행 엔진 (워커 관리 · 입력 채널)
js/py-worker.js         Pyodide 워커 (실행 · 입출력 · 작업 폴더)
js/gui.js               GUI 창 그리기 (위젯 배치 · 캔버스 · 메뉴 · 대화상자 · pygame 화면)
py/                     브라우저용 파이썬 모듈 (실행기 _runtime · GUI 브리지 _webgui · turtle · tkinter · pygame · PIL.ImageTk)
lessons/chNN.js         챕터별 강좌 콘텐츠 (문서 + 실습 + 퀴즈 + 슬라이드)
assets/                 예제용 그림 · 데이터 파일 (작업 폴더에 복사됨, manifest.json 목록)
server/serve.py         로컬 · 교실용 웹 서버 (COOP/COEP 헤더 + 입력 채널)
tools/validate.js       콘텐츠 검증 (모든 예제 실행 + 출력 비교, 로컬 파이썬 사용)
tools/build-assets.py   assets/manifest.json 만들기
tools/assets/           예제 그림 파일을 만드는 스크립트 (Pillow)
tools/check_slides.js   슬라이드 넘침 검사 (브라우저 콘솔)
docs/LESSON_GUIDE.md    콘텐츠 작성 가이드
lecture/                원본 강의자료 PPT (저작권 보호 자료 — 저장소에는 포함하지 않음)
```

## 콘텐츠 수정 · 검증

`docs/LESSON_GUIDE.md` 형식에 따라 `lessons/chNN.js` 를 수정한 뒤 검증합니다. (Node.js + 파이썬 3.14 권장 + Pillow)

```bash
node tools/validate.js all            # 모든 챕터: 구조 검사 + 모든 코드 실행 + expect 비교
node tools/validate.js ch05 --print   # 실제 출력 확인
python tools/build-assets.py          # assets/ 를 바꾼 뒤 목록 다시 만들기
```

검증 도구는 브라우저와 같은 실행기(`py/_runtime.py`)와 호환 모듈을 로컬 파이썬에서 화면 없이 실행합니다.

## 참고

- 파이썬 실행: [Pyodide](https://pyodide.org) (MPL-2.0), 코드 에디터: [CodeMirror 5](https://codemirror.net/5/), 글꼴: Pretendard, JetBrains Mono
- 원본 강의자료의 저작권은 저자에게 있습니다. 이 저장소는 강의자료를 바탕으로 새로 작성한 설명 · 예제 · 슬라이드와,
  직접 만든 예제 그림을 담고 있습니다.
