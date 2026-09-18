/* Chapter 01. 파이썬 들여다보기
 * 강의자료: Ch01_파이썬 들여다보기.pptx (Section 01 ~ 03)
 */
(function () {
  /* ───────────── 공용 그림(SVG) ───────────── */
  const FIG_PROGRAMMER = `<svg viewBox="0 0 1280 440" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <defs><marker id="c1arrA" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="var(--ok)"/></marker></defs>
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
  <defs><marker id="c1arrB" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="var(--fg)"/></marker></defs>
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
  <defs><marker id="c1arrC" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="var(--fg)"/></marker></defs>
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
  <defs><marker id="c1arrD" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="var(--fg)"/></marker></defs>
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
        minutes: 45,
        goals: [
          '프로그래밍 언어와 프로그래머의 의미를 자신의 말로 설명할 수 있다',
          '컴퓨터가 기계어만 이해하기 때문에 프로그래밍 언어가 필요하다는 것을 이해한다',
          '대표적인 프로그래밍 언어(C/C++, 자바, HTML, PHP, 파이썬 등)와 쓰임새를 말할 수 있다',
          '이 강좌의 편집기에서 print() 로 첫 코드를 실행해 볼 수 있다'
        ],
        flow: [['도입: 이 장에서 배울 내용', 5], ['프로그래밍 언어 · 프로그래머', 12], ['프로그래밍 언어의 종류 · 순위', 13], ['첫 코드 실행 체험', 8], ['정리 · 퀴즈', 7]],
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
          { type: 'callout', kind: 'tip', title: '어떤 언어를 먼저 배워야 할까?', html: '첫 언어로는 <b>문법이 간단하고 결과를 바로 확인할 수 있는 언어</b>가 좋습니다. 프로그래밍의 핵심 개념(변수, 조건문, 반복문, 함수)은 거의 모든 언어에 공통이므로, 파이썬으로 개념을 익혀 두면 나중에 다른 언어도 훨씬 빨리 배울 수 있습니다.' }
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
            explain: 'HTML 은 제목 · 문단 · 그림 같은 문서 구조를 표시하는 마크업 언어입니다.' }
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
          'C · 자바 · 파이썬의 Hello World 프로그램을 비교할 수 있다'
        ],
        flow: [['파이썬의 역사 · 다양한 파이썬', 8], ['파이썬의 특징 · 단점', 12], ['실행 화면 · print() 기초', 12], ['컴파일러 언어 vs 스크립트 언어', 10], ['Hello World 비교 · 정리 · 퀴즈', 8]],
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

          { type: 'h', text: 'Hello World 프로그램' },
          { type: 'p', html: '화면에 <code>Hello, world!</code> 를 출력하는 <b>Hello World 프로그램</b>은 대부분의 프로그래밍 책에서 가장 먼저 만드는 예제입니다. 1978년 브라이언 커니핸과 데니스 리치가 쓴 책 <b>『The C Programming Language』</b>에서 처음 쓰인 것으로 알려져 있습니다. 같은 일을 하는 프로그램을 세 언어로 비교해 봅시다.' },
          { type: 'figure', html: HELLO_LANGS, caption: 'C · 자바 · 파이썬의 Hello World 프로그램 비교' },
          { type: 'code', title: '추가 예제. 파이썬의 Hello World', code: `print("Hello, world!")`, expect: 'Hello, world!', desc: 'C 는 6줄, 자바는 5줄이 필요했지만 파이썬은 <b>단 한 줄</b>입니다. 파이썬은 <code>#include</code>, <code>main()</code>, 클래스, 세미콜론(<code>;</code>), 중괄호(<code>{ }</code>) 없이도 프로그램이 됩니다. 이것이 파이썬이 "배우기 쉬운 언어"로 불리는 이유입니다.' }
        ],
        practice: [
          {
            title: '실습 1-3. 파이썬 소개 카드 만들기',
            level: 1,
            desc: '<p><code>print()</code> 를 사용하여 아래와 같은 파이썬 소개 카드를 출력하세요. 3행은 <code>2026 - 1991</code> 을 <b>계산식</b>으로 넣어 출력합니다.</p><pre>==============================\n파이썬(Python) 소개\n공개 후 35 년이 지났습니다.\n만든 사람: 귀도 반 로섬\n==============================</pre>',
            hint: '3행은 <code>print("공개 후", 2026 - 1991, "년이 지났습니다.")</code> 처럼 쉼표로 글자와 계산식을 이어서 씁니다.',
            starter: 'print("==============================")\n# TODO: 제목, 공개 후 지난 햇수(계산식), 만든 사람을 출력\n\nprint("==============================")\n',
            solution: 'print("==============================")\nprint("파이썬(Python) 소개")\nprint("공개 후", 2026 - 1991, "년이 지났습니다.")\nprint("만든 사람: 귀도 반 로섬")\nprint("==============================")\n',
            expect: '==============================\n파이썬(Python) 소개\n공개 후 35 년이 지났습니다.\n만든 사람: 귀도 반 로섬\n=============================='
          },
          {
            title: '실습 1-4. sep 과 end 사용하기',
            level: 2,
            desc: '<p><code>print()</code> 의 <code>sep</code>, <code>end</code> 를 사용하여 아래와 같이 출력하세요. 첫 줄은 <code>print()</code> 한 번에 <code>"010"</code>, <code>"1234"</code>, <code>"5678"</code> 세 값을 넣어 만들고, 둘째 줄은 <code>print()</code> 두 번으로 만듭니다.</p><pre>010-1234-5678\nPython is fun!</pre>',
            hint: '<code>sep="-"</code> 은 값 사이에 <code>-</code> 를 넣고, <code>end=" "</code> 는 줄을 바꾸는 대신 공백을 넣습니다.',
            starter: '# TODO: sep 을 사용해 전화번호 출력\n\n# TODO: end 를 사용해 두 번의 print() 를 한 줄로 출력\n',
            solution: 'print("010", "1234", "5678", sep="-")\nprint("Python", end=" ")\nprint("is fun!")\n',
            expect: '010-1234-5678\nPython is fun!'
          }
        ],
        quiz: [
          { q: '파이썬을 만든 사람과 처음 공개한 연도로 옳은 것은?', options: ['데니스 리치, 1978년', '귀도 반 로섬, 1991년', '제임스 고슬링, 1995년', '팀 버너스리, 1991년'], answer: 1,
            explain: '파이썬은 <b>귀도 반 로섬</b>이 C 언어로 만들어 <b>1991년</b>에 공개했습니다.' },
          { q: '다음 중 파이썬의 특징으로 알맞지 <b>않은</b> 것은?', options: ['무료로 사용할 수 있다', '읽기 쉽고 사용하기 쉽다', '외부 라이브러리가 풍부하다', '컴파일러 언어라서 C 언어보다 실행 속도가 빠르다'], answer: 3,
            explain: '파이썬은 <b>스크립트 언어</b>이기 때문에 C 같은 컴파일러 언어보다 <b>느린</b> 것이 단점입니다.' },
          { q: '소스 코드를 한 줄씩 읽어 바로 실행하고 별도의 실행 파일을 만들지 않는 프로그램은?', options: ['컴파일러', '인터프리터', '운영체제', '텍스트 편집기'], answer: 1,
            explain: '<b>인터프리터</b>는 한 줄씩 번역하며 실행합니다. 컴파일러는 전체를 번역해 실행 파일을 만듭니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>print("A", "B", "C", sep="*")</code></pre>', options: ['A B C', 'ABC', 'A*B*C', '*A*B*C*'], answer: 2,
            explain: '<code>sep="*"</code> 은 값과 값 <b>사이</b>에 <code>*</code> 를 넣습니다.' },
          { q: '다음 코드를 실행하면 화면에 어떻게 출력될까요?<pre><code>print("하나")\nprint("둘)\nprint("셋")</code></pre>', options: ['하나 만 출력되고 오류', '하나, 둘 까지 출력되고 오류', '아무것도 출력되지 않고 SyntaxError', '하나, 둘), 셋 이 출력된다'], answer: 2,
            explain: '따옴표가 닫히지 않은 <b>문법 오류</b>는 실행 전에 발견되므로 첫 줄도 실행되지 않습니다.' }
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
          { layout: 'diagram', title: '파이썬의 실행 화면', html: IDLE_HELLO, caption: '그림 1-6 >>> 다음에 print("Hello, world!") 입력 → Enter',
            notes: '<p>강의자료 10쪽. <code>&gt;&gt;&gt;</code> 는 "입력하세요"라는 프롬프트라고 설명합니다.</p><p>print 는 "출력하다" → 괄호 안의 것을 화면에 출력.</p><p>이 강좌에서는 콘솔의 <b>&gt;&gt;&gt; 셸</b> 버튼이 IDLE 셸 역할을 한다는 것을 보여 줍니다.</p><p>시간: 2분</p>' },
          { layout: 'code', title: 'print() 기초', code: `print("Hello, world!")
print('작은따옴표도 됩니다')
print(3.14 * 2)
print("사과", "바나나", "딸기")
print()
print("2026", "09", "18", sep="-")
print("같은 줄에 ", end="")
print("이어서 출력")`,
            points: ['따옴표 <code>"</code> <code>\'</code> 둘 다 가능', '쉼표 → 한 칸 띄어 출력', '<code>print()</code> → 빈 줄', '<code>sep</code>: 사이 글자, <code>end</code>: 끝 글자'],
            notes: '<p>📘 보충 내용입니다. 앞으로 모든 장에서 print() 를 쓰므로 여기서 기본을 확실히 다집니다.</p><p>sep · end 는 한 번 보여 주고, 실습 1-4 에서 직접 써 보게 합니다.</p><p>시간: 6분</p>' },
          { layout: 'diagram', title: '컴파일러 언어 vs 스크립트 언어', html: FIG_COMPILE, caption: '전체를 번역해 실행 파일을 만들까, 한 줄씩 번역하며 실행할까',
            notes: '<p>강의자료 11쪽 "여기서 잠깐". 번역가(책 전체 번역) vs 동시통역사(한 문장씩) 비유를 씁니다.</p><p>컴파일러 언어: 실행 빠름, 배우는 데 오래 걸림. 스크립트 언어: 빨리 배움, 결과 바로 확인.</p><p>시간: 5분</p>' },
          { layout: 'code', title: '한 줄씩 실행되는 것 확인하기', code: `print("1번째 줄 실행")
print("2번째 줄 실행")
print(3 / 0)
print("4번째 줄은 실행되지 않음")`, expectError: true,
            points: ['1 · 2행은 출력된다', '3행에서 ZeroDivisionError', '4행은 실행되지 않는다', '📘 문법 오류는 1행도 실행 안 됨'],
            notes: '<p>실행하면 오류가 나는 것이 정상입니다. 빨간 오류 메시지의 <code>line 3</code> 을 함께 읽습니다.</p><p>심화: 파이썬은 먼저 바이트코드로 번역하므로 <b>문법 오류</b>는 첫 줄도 실행되지 않는다는 차이를 본문 예제로 보여 줍니다.</p><p>시간: 4분</p>' },
          { layout: 'two', title: '여기서 잠깐: Hello World 프로그램',
            left: { title: 'C 프로그램', code: '#include <stdio.h>\nint main()\n{\n    printf("Hello, world!\\n");\n    return 0;\n}', run: false },
            right: { title: '파이썬 프로그램', code: 'print("Hello, world!")' },
            notes: '<p>강의자료 12쪽. 자바 버전(5줄)은 본문에 있습니다. 1978년 『The C Programming Language』에서 처음 쓰였다는 일화를 소개합니다.</p><p><b>발문</b>: "파이썬 코드에는 없는 것이 무엇인가요?" → <code>#include</code>, <code>main</code>, 중괄호, 세미콜론.</p><p>시간: 3분</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '파이썬에 대한 설명으로 옳지 <b>않은</b> 것은?', options: ['귀도 반 로섬이 1991년에 발표했다', '무료로 사용할 수 있다', '컴파일러 언어라서 C 보다 빠르다', '외부 라이브러리가 풍부하다'], answer: 2,
            explain: '파이썬은 스크립트 언어라서 컴파일러 언어보다 느린 편입니다.',
            notes: '<p>오답을 고른 학생에게 컴파일러 · 인터프리터 비유를 다시 설명합니다.</p><p>시간: 2분</p>' },
          { layout: 'practice', title: '실습 1-3. 파이썬 소개 카드', desc: '제목, 공개 후 지난 햇수(<code>2026 - 1991</code> 계산식), 만든 사람을 출력하는 소개 카드를 만드세요.',
            starter: 'print("==============================")\n# TODO: 제목, 공개 후 지난 햇수(계산식), 만든 사람을 출력\n\nprint("==============================")\n',
            solution: 'print("==============================")\nprint("파이썬(Python) 소개")\nprint("공개 후", 2026 - 1991, "년이 지났습니다.")\nprint("만든 사람: 귀도 반 로섬")\nprint("==============================")\n',
            notes: '<p>5분 개별 실습. 쉼표로 글자와 계산식을 함께 출력하는 방법을 확인합니다.</p><p>빨리 끝낸 학생은 실습 1-4(sep · end)에 도전하게 합니다.</p><p>시간: 5분</p>' },
          { layout: 'summary', title: '정리', bullets: ['파이썬: 귀도 반 로섬, 1991년, 비단뱀 로고', '장점: 무료 · 쉬움 · IoT · 라이브러리 · 웹 프레임워크', '단점: 느린 속도, 모바일 · 하드웨어 제어 약함', 'print(): 괄호 안의 것을 화면에 출력', '컴파일러 = 전체 번역, 인터프리터 = 한 줄씩 실행'],
            notes: '<p>다음 시간 예고: 내 컴퓨터에 파이썬을 설치하고 IDLE 을 실행해 봅니다.</p><p>시간: 2분</p>' }
        ]
      },

      /* ───────────────────────── Section 03 ───────────────────────── */
      {
        id: 'ch01-3',
        title: '파이썬 설치와 실행',
        minutes: 45,
        goals: [
          '내 윈도의 버전과 시스템 종류(64bit/32bit)를 확인하고 파일 확장명을 표시할 수 있다',
          'python.org 에서 파이썬을 내려받아 설치하는 과정을 순서대로 설명할 수 있다',
          '파이썬 2.x 와 3.x 의 차이와, 3.x 를 써야 하는 이유를 말할 수 있다',
          'IDLE 을 실행하고 종료할 수 있으며, 이 강좌의 편집기 · 콘솔 · >>> 셸과 대응시킬 수 있다'
        ],
        flow: [['이 강좌의 실행 환경', 7], ['윈도 버전 · 시스템 종류 확인', 8], ['파이썬 다운로드 · 2.x 와 3.x', 10], ['설치 과정', 12], ['IDLE 실행 · 종료 · 정리', 8]],
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
          { type: 'p', html: 'IDLE 을 끝낼 때는 메뉴에서 <b>[File]-[Exit]</b> 을 선택하거나 단축키 <kbd>Ctrl</kbd>+<kbd>Q</kbd> 를 누릅니다. 창의 ✕ 버튼을 눌러도 됩니다. 이 강좌에서는 따로 종료할 필요가 없고, 콘솔의 <b>⌫ 지우기</b> 버튼으로 화면을 깨끗하게 지울 수 있습니다.' }
        ],
        practice: [
          {
            title: '실습 1-5. 설치 순서 정리하기',
            level: 1,
            desc: '<p>파이썬 설치 과정을 순서대로 출력하는 프로그램을 만드세요.</p><pre>[파이썬 설치 순서]\n1. python.org 에서 설치 파일 다운로드\n2. Add Python to PATH 체크\n3. Customize installation → Next\n4. 설치 위치 변경 → Install\n5. Close\n총 5 단계</pre>',
            hint: '마지막 줄은 <code>print("총", 5, "단계")</code> 처럼 쉼표로 이어서 출력합니다.',
            starter: 'print("[파이썬 설치 순서]")\n# TODO: 1 ~ 5 단계를 출력\n\n# TODO: "총 5 단계" 출력\n',
            solution: 'print("[파이썬 설치 순서]")\nprint("1. python.org 에서 설치 파일 다운로드")\nprint("2. Add Python to PATH 체크")\nprint("3. Customize installation → Next")\nprint("4. 설치 위치 변경 → Install")\nprint("5. Close")\nprint("총", 5, "단계")\n',
            expect: '[파이썬 설치 순서]\n1. python.org 에서 설치 파일 다운로드\n2. Add Python to PATH 체크\n3. Customize installation → Next\n4. 설치 위치 변경 → Install\n5. Close\n총 5 단계'
          },
          {
            title: '실습 1-6. 파이썬 2 코드를 파이썬 3 으로 고치기',
            level: 2,
            desc: '<p>아래는 파이썬 2 방식으로 작성된 코드입니다. 파이썬 3 에서 실행되도록 고쳐 보세요. (뼈대 코드에서는 오류가 나지 않도록 주석 처리해 두었습니다. <code>#</code> 을 지우고 고치세요)</p><pre>print "Python 2 는 끝났습니다."\nprint "이제는 Python", 3</pre><p>실행 결과:</p><pre>Python 2 는 끝났습니다.\n이제는 Python 3</pre>',
            hint: '파이썬 3 에서 <code>print</code> 는 함수이므로 출력할 내용을 반드시 괄호 <code>( )</code> 안에 넣어야 합니다.',
            starter: '# print "Python 2 는 끝났습니다."\n# print "이제는 Python", 3\n',
            solution: 'print("Python 2 는 끝났습니다.")\nprint("이제는 Python", 3)\n',
            expect: 'Python 2 는 끝났습니다.\n이제는 Python 3'
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
            explain: 'IDLE 을 실행하면 <b>파이썬 셸(IDLE Shell)</b>이 <b>대화형 모드</b>로 나타나고 <code>&gt;&gt;&gt;</code> 프롬프트가 표시됩니다.' }
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
          { layout: 'quiz', title: '확인 퀴즈', q: '파이썬 설치 첫 화면에서 꼭 체크해야 하는 항목은?', options: ['Install launcher for all users', 'Add Python 3.x to PATH', 'Documentation', 'Precompile standard library'], answer: 1,
            explain: 'PATH 에 등록해야 명령 프롬프트 어디서든 python 명령을 쓸 수 있습니다.',
            notes: '<p>설치 과정에서 가장 많이 실수하는 부분이므로 한 번 더 확인합니다.</p><p>시간: 1분</p>' },
          { layout: 'practice', title: '실습 1-6. 파이썬 2 코드를 3 으로 고치기', desc: '파이썬 2 방식의 <code>print "…"</code> 두 줄을 파이썬 3 에서 실행되도록 고치세요.',
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
          '주석을 달고, 흔한 오류 메시지(NameError, SyntaxError, IndentationError)를 읽고 고칠 수 있다'
        ],
        flow: [['대화형 모드: 예1 ~ 예3', 12], ['산술 연산자 맛보기', 8], ['스크립트 모드 · 두 모드 비교', 12], ['주석 · 흔한 오류', 10], ['장 정리 · 퀴즈', 8]],
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

          { type: 'h', text: '1장 요약' },
          { type: 'list', items: [
            '<b>프로그래밍 언어</b>는 컴퓨터가 이해하는 말로 소프트웨어를 만드는 도구이고, <b>프로그래머</b>는 이를 사용해 소프트웨어를 만드는 사람입니다.',
            '<b>파이썬</b>은 귀도 반 로섬이 1991년에 발표한 언어로, 무료이고 읽기 쉬우며 라이브러리가 풍부합니다. 스크립트 언어라서 컴파일러 언어보다 느린 것이 단점입니다.',
            '파이썬은 <code>python.org</code> 에서 내려받아 설치하며, 설치할 때 <b>Add Python to PATH</b> 를 체크합니다. 설치하면 <b>IDLE</b> 이 함께 설치됩니다.',
            '<b>대화형 모드</b>(IDLE 셸, 이 강좌의 &gt;&gt;&gt; 셸)는 한 줄씩 입력해 바로 결과를 보고, <b>스크립트 모드</b>(편집기 + ▶ 실행)는 여러 줄을 작성해 한꺼번에 실행합니다.',
            '<code>print()</code> 는 괄호 안의 내용을 화면에 출력합니다. 글자는 따옴표로 감싸고, 계산식은 따옴표 없이 씁니다.'
          ] }
        ],
        practice: [
          {
            title: '실습 1-7. 대화형 모드 예제를 스크립트로',
            level: 1,
            desc: '<p>대화형 모드에서 입력했던 다음 식들의 결과를 <b>스크립트 모드</b>에서 출력하세요. 각 줄은 <code>식 = 결과</code> 형태로 출력합니다.</p><pre>10 + 20 = 30\n9876 * 27 - 32767 = 233885\n2 ** 10 = 1024\n7 // 2 = 3\n7 % 2 = 1</pre>',
            hint: '<code>print("10 + 20 =", 10 + 20)</code> 처럼 식은 따옴표 안(글자)과 밖(계산)에 두 번 씁니다.',
            starter: 'print("10 + 20 =", 10 + 20)\n# TODO: 나머지 네 줄을 같은 방법으로 출력\n',
            solution: 'print("10 + 20 =", 10 + 20)\nprint("9876 * 27 - 32767 =", 9876 * 27 - 32767)\nprint("2 ** 10 =", 2 ** 10)\nprint("7 // 2 =", 7 // 2)\nprint("7 % 2 =", 7 % 2)\n',
            expect: '10 + 20 = 30\n9876 * 27 - 32767 = 233885\n2 ** 10 = 1024\n7 // 2 = 3\n7 % 2 = 1'
          },
          {
            title: '실습 1-8. 오류 고치기',
            level: 2,
            desc: '<p>뼈대 코드에는 오류가 세 군데 있습니다. 실행해서 오류 메시지를 읽고 하나씩 고쳐 아래와 같이 출력되게 하세요. (한 번에 하나의 오류만 보이므로 고치고 → 실행을 반복합니다)</p><pre>파이썬 공부 1일차\n오늘 공부한 시간: 90 분\n오늘의 한마디: 오류는 친구다!</pre>',
            hint: '① 대소문자(<code>Print</code>) ② 계산식 앞뒤의 쉼표 ③ 이름의 철자(<code>pritn</code>) 를 확인하세요.',
            starter: 'Print("파이썬 공부 1일차")\nprint("오늘 공부한 시간:", 60 + 30, "분")\npritn("오늘의 한마디: 오류는 친구다!")\n',
            solution: 'print("파이썬 공부 1일차")\nprint("오늘 공부한 시간:", 60 + 30, "분")\nprint("오늘의 한마디: 오류는 친구다!")\n',
            expect: '파이썬 공부 1일차\n오늘 공부한 시간: 90 분\n오늘의 한마디: 오류는 친구다!'
          },
          {
            title: '실습 1-9. 도전! 글자로 그림 그리기',
            level: 3,
            desc: '<p><code>print()</code> 만 사용하여 아래와 같은 파이썬 뱀 그림과 문구를 출력하세요. 마지막 줄의 숫자는 <code>1991</code> 과 <code>2026 - 1991</code> 을 계산식으로 넣습니다.</p><pre>   ____\n  / . .\\\n  \\  ---&lt;\n   \\  /\n __/ /\n&lt;___/\nPython 1991 ~ (35 살)</pre>',
            hint: '역슬래시 <code>\\</code> 를 문자열에 넣을 때는 <code>\\\\</code> 처럼 두 번 씁니다. 마지막 줄은 <code>print("Python", 1991, "~ (" ...</code> 보다 <code>sep</code> 를 활용하면 편합니다.',
            starter: 'print("   ____")\n# TODO: 나머지 그림을 한 줄씩 출력 (역슬래시는 \\\\ 로 입력)\n\n# TODO: Python 1991 ~ (35 살) 출력\n',
            solution: 'print("   ____")\nprint("  / . .\\\\")\nprint("  \\\\  ---<")\nprint("   \\\\  /")\nprint(" __/ /")\nprint("<___/")\nprint("Python ", 1991, " ~ (", 2026 - 1991, " 살)", sep="")\n',
            expect: '   ____\n  / . .\\\n  \\  ---<\n   \\  /\n __/ /\n<___/\nPython 1991 ~ (35 살)'
          }
        ],
        quiz: [
          { q: '대화형 모드(&gt;&gt;&gt;)에서 <code>9876 * 27 - 32767</code> 을 입력하고 Enter 를 누르면?', options: ['233885 가 출력된다', '9876 * 27 - 32767 이 그대로 출력된다', 'print() 가 없어서 아무것도 출력되지 않는다', 'SyntaxError 가 발생한다'], answer: 0,
            explain: '대화형 모드에서는 식의 결과가 자동으로 표시됩니다. 9876×27 = 266652, 266652 − 32767 = 233885.' },
          { q: '스크립트 모드에서 다음 코드를 실행한 결과는?<pre><code>10 + 20\nprint(3 * 4)</code></pre>', options: ['30 과 12', '12', '30', '아무것도 출력되지 않는다'], answer: 1,
            explain: '스크립트 모드에서는 <code>print()</code> 로 출력한 것만 화면에 나타납니다. 1행은 계산만 하고 버려집니다.' },
          { q: '<code>7 // 2</code> 와 <code>7 % 2</code> 의 결과를 순서대로 고르면?', options: ['3.5, 1', '3, 1', '3, 3.5', '1, 3'], answer: 1,
            explain: '<code>//</code> 는 몫(3), <code>%</code> 는 나머지(1)입니다. <code>/</code> 는 3.5 입니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code># print("A")\nprint("B")  # print("C")</code></pre>', options: ['A B C', 'B C', 'B', 'A'], answer: 2,
            explain: '<code>#</code> 뒤는 주석이므로 실행되지 않습니다. <code>print("B")</code> 만 실행됩니다.' },
          { q: '<code>Print("Hi")</code> 를 실행했을 때 발생하는 오류는?', options: ['SyntaxError', 'NameError', 'IndentationError', 'ZeroDivisionError'], answer: 1,
            explain: '파이썬은 대소문자를 구별하므로 <code>Print</code> 라는 이름을 찾지 못해 <b>NameError</b> 가 발생합니다.' }
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
          { layout: 'diagram', title: '대화형 모드 vs 스크립트 모드', html: FIG_MODES, caption: '한 줄씩 바로바로 vs 여러 줄을 작성해 한꺼번에',
            notes: '<p>대화형 모드의 한계(저장 안 됨, 여러 줄 수정 어려움) → 스크립트 모드가 필요한 이유를 설명합니다.</p><p>IDLE 에서는 [File]-[New File] → 저장 → F5, 이 강좌에서는 편집기 + ▶ 실행(Ctrl+Enter).</p><p>시간: 4분</p>' },
          { layout: 'code', title: '스크립트 모드로 실행하기', code: `print("Hello, world!")
print(10 + 20)
print(9876 * 27 - 32767)
10 + 20`,
            points: ['세 줄이 위에서 아래로 한꺼번에 실행', '계산 결과도 <code>print()</code> 로 출력', '4행: print 없으면 <b>아무것도 안 보임</b>', '편집기 + ▶ 실행 (Ctrl+Enter)'],
            notes: '<p>실행 결과가 3줄뿐인 것을 확인시키고, 4행이 왜 출력되지 않는지 질문합니다.</p><p>시간: 4분</p>' },
          { layout: 'table', title: '두 모드 비교', head: ['', '대화형 모드', '스크립트 모드'], rows: [
            ['입력', '한 줄씩', '여러 줄'], ['결과', '자동 표시', 'print() 필요'], ['저장', '안 됨', '.py 파일'], ['쓰임', '계산 · 실험', '실제 프로그램'], ['이 강좌', '&gt;&gt;&gt; 셸', '편집기 + ▶ 실행']],
            notes: '<p>표를 보며 정리합니다. 앞으로의 예제는 대부분 스크립트 모드이고, 간단히 확인할 때는 셸을 쓰면 된다고 안내합니다.</p><p>시간: 2분</p>' },
          { layout: 'code', title: '📘 주석(#)', code: `# 나의 첫 파이썬 프로그램
# 작성자: 홍길동

print("주석은 실행되지 않습니다.")   # 줄 끝 주석
# print("이 줄은 실행되지 않습니다.")
print("프로그램 끝")`,
            points: ['<code>#</code> 뒤는 실행하지 않음', '코드 설명 메모', '잠시 실행을 막을 때', '단축키: 편집기에서 줄 주석 토글'],
            notes: '<p>보충 내용입니다. 5행의 <code>#</code> 을 지우고 실행해 보게 합니다.</p><p>시간: 3분</p>' },
          { layout: 'table', title: '📘 처음 만나는 오류', head: ['오류', '원인 예', '고치기'], rows: [
            ['SyntaxError', '<code>print("Hi"</code> · <code>print "Hi"</code>', '괄호 · 따옴표 짝'], ['NameError', '<code>Print("Hi")</code>', '소문자 print'], ['IndentationError', '줄 앞 공백', '공백 삭제'], ['ZeroDivisionError', '<code>10 / 0</code>', '0 으로 나누지 않기']],
            notes: '<p>오류 메시지는 <b>마지막 줄(종류와 이유)</b>과 <b>line 번호</b>를 먼저 읽는다고 알려 줍니다.</p><p>둥근 따옴표(“ ”)를 복사해 붙여 넣으면 오류가 난다는 점도 경고합니다.</p><p>시간: 5분</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '스크립트 모드에서 실행한 결과는?<pre><code>10 + 20\nprint(3 * 4)</code></pre>', options: ['30 과 12', '12', '30', '아무것도 출력되지 않는다'], answer: 1,
            explain: '스크립트 모드에서는 print() 로 출력한 것만 보입니다.',
            notes: '<p>대화형 모드와 헷갈리는 학생이 많은 문제입니다. 오답이 많으면 직접 실행해서 확인합니다.</p><p>시간: 2분</p>' },
          { layout: 'practice', title: '실습 1-8. 오류 고치기', desc: '오류 세 군데(<code>Print</code>, <code>pritn</code> 등)를 오류 메시지를 읽으며 하나씩 고치세요.',
            starter: 'Print("파이썬 공부 1일차")\nprint("오늘 공부한 시간:", 60 + 30, "분")\npritn("오늘의 한마디: 오류는 친구다!")\n',
            solution: 'print("파이썬 공부 1일차")\nprint("오늘 공부한 시간:", 60 + 30, "분")\nprint("오늘의 한마디: 오류는 친구다!")\n',
            notes: '<p>"고치고 → 실행 → 다음 오류 메시지 읽기" 과정을 경험하게 하는 것이 목적입니다. 정답을 바로 알려 주지 말고 메시지의 마지막 줄을 읽게 합니다.</p><p>시간: 4분</p>' },
          { layout: 'summary', title: '1장 정리', bullets: ['프로그래밍 언어 · 프로그래머 · 파이썬(1991, 귀도 반 로섬)', '파이썬: 쉽고 무료, 라이브러리 풍부 / 느린 속도', '설치: python.org → PATH 체크 → IDLE', '대화형 모드: &gt;&gt;&gt; 한 줄씩, 결과 자동 표시', '스크립트 모드: 편집기 + ▶ 실행, print() 로 출력'],
            notes: '<p>1장 전체를 정리합니다. 다음 장 예고: 변수와 입력(input) — 사용자와 대화하는 프로그램 만들기.</p><p>과제: 실습 1-9(글자 그림) 도전.</p><p>시간: 3분</p>' }
        ]
      }
    ]
  });
})();
