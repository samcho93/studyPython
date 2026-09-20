/* 파이썬 강좌 커리큘럼 (강의자료 lecture/ChNN_*.pptx 기준)
 * 각 챕터의 상세 내용은 lessons/<id>.js 에서 PY_COURSE.addChapter({...}) 로 등록한다.
 */
window.PY_COURSE = {
  title: '파이썬 프로그래밍',
  teacherPass: 'py2026',   // 교사용 화면 비밀번호 (바꿔서 쓰세요)
  subtitle: '강의자료 기반 웹 실습 강좌',
  order: [
    { id: 'ch01', no: '01', title: '파이썬 들여다보기', icon: '🐍', src: 'Ch01_파이썬 들여다보기.pptx' },
    { id: 'ch02', no: '02', title: '미리 만드는 쓸 만한 프로그램', icon: '🐢', src: 'Ch02_미리 만드는 쓸 만한 프로그램.pptx' },
    { id: 'ch03', no: '03', title: '변수와 데이터형', icon: '📦', src: 'Ch03_변수와 데이터형.pptx' },
    { id: 'ch04', no: '04', title: '연산자', icon: '➗', src: 'Ch04_연산자.pptx' },
    { id: 'ch05', no: '05', title: '조건문', icon: '🔀', src: 'Ch05_조건문.pptx' },
    { id: 'ch06', no: '06', title: '반복문', icon: '🔁', src: 'Ch06_반복문.pptx' },
    { id: 'ch07', no: '07', title: '리스트, 튜플, 딕셔너리', icon: '🗃️', src: 'Ch07_리스트, 튜플, 딕셔너리.pptx' },
    { id: 'ch08', no: '08', title: '문자열', icon: '🔤', src: 'Ch08_문자열.pptx' },
    { id: 'ch09', no: '09', title: '함수와 모듈', icon: '🔧', src: 'Ch09_함수와 모듈.pptx' },
    { id: 'ch10', no: '10', title: '윈도 프로그래밍', icon: '🪟', src: 'Ch10_윈도 프로그래밍.pptx' },
    { id: 'ch11', no: '11', title: '파일 입출력', icon: '💾', src: 'Ch11_파일 입출력.pptx' },
    { id: 'ch12', no: '12', title: '객체지향 프로그래밍', icon: '🧱', src: 'Ch12_객체지향 프로그래밍.pptx' },
    { id: 'ch13', no: '13', title: '데이터베이스', icon: '🗄️', src: 'Ch13_데이터베이스.pptx' },
    { id: 'ch14', no: '14', title: '미니 프로젝트', icon: '🎮', src: 'Ch14_미니 프로젝트.pptx' }
  ],
  chapters: {},
  addChapter: function (ch) { this.chapters[ch.id] = ch; }
};
