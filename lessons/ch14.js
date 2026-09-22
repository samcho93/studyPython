/* Chapter 14. 미니 프로젝트
 * 강의자료: Ch14_미니 프로젝트.pptx
 * Section 01 미니 포토샵 프로젝트 ([프로젝트 1], Code14-01 ~ Code14-09) → 교시 14-1 ~ 14-3
 * Section 02 슈팅 게임 프로젝트 ([프로젝트 2], Code14-10 ~ Code14-14) → 교시 14-4 ~ 14-5
 * - Pillow(PIL) 은 브라우저에 자동으로 준비된다. PIL.ImageTk 는 강좌용 모듈이 대신한다.
 * - 예제 사진: assets/JPG/picture01~04.jpg, 게임 그림: assets/game/ship02.png · monster01~10.png · missile.png
 *   (tools/assets/ch14_assets.py 로 직접 그린 그림 — 교재 그림 아님)
 */
(function () {
  /* ================================================================ SVG 도우미 */
  const SV = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" width="100%" xmlns="http://www.w3.org/2000/svg" role="img">${DEFS}${body}</svg>`;
  const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" text-anchor="${o.a || 'middle'}" font-size="${o.fs || 20}" fill="${o.c || 'var(--fg)'}"${o.b ? ' font-weight="bold"' : ''}${o.mono ? ' font-family="Consolas,monospace"' : ''}>${s}</text>`;
  const R = (x, y, w, h, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx == null ? 8 : o.rx}" fill="${o.f || 'var(--card)'}"${o.op ? ` fill-opacity="${o.op}"` : ''} stroke="${o.s || 'var(--line)'}" stroke-width="${o.sw || 2}"${o.dash ? ' stroke-dasharray="7 5"' : ''}/>`;
  const Ln = (x1, y1, x2, y2, o = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${o.s || 'var(--muted)'}" stroke-width="${o.sw || 2}"${o.dash ? ' stroke-dasharray="6 5"' : ''}${o.arrow ? ' marker-end="url(#arr14)"' : ''}/>`;
  const DEFS = `<defs><marker id="arr14" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--muted)"/></marker></defs>`;
  const BOX = (x, y, w, h, s, o = {}) => R(x, y, w, h, { s: o.s || 'var(--accent)', f: o.f, op: o.op }) + T(x + w / 2, y + h / 2 + 7, s, { fs: o.fs || 20, b: o.b, c: o.c });

  /* 그림 14-5 메뉴 구성도 */
  const menuCol = (x, head, items) => {
    let s = BOX(x, 30, 220, 50, head, { b: true, s: 'var(--accent2)' });
    const lx = x + 40;
    s += Ln(lx, 80, lx, 80 + items.length * 70 - 35, { s: 'var(--accent2)', sw: 3 });
    items.forEach((it, i) => {
      const y = 110 + i * 70;
      s += Ln(lx, y + 20, x + 90, y + 20, { s: 'var(--accent2)', sw: 3 });
      s += BOX(x + 90, y, 190, 42, it, { s: 'var(--accent2)', fs: 19 });
    });
    return s;
  };
  const SVG_MENU = SV(1280, 480, menuCol(80, '파일', ['파일 열기', '파일 저장', '프로그램 종료']) +
    menuCol(500, '이미지 처리(1)', ['확대', '축소', '상하 반전', '좌우 반전', '회전']) +
    menuCol(920, '이미지 처리(2)', ['밝게', '어둡게', '블러링', '엠보싱', '흑백이미지']) +
    T(640, 470, '미니 포토샵의 메뉴 구성도 — 메뉴 항목 하나 = 함수 하나', { fs: 18, c: 'var(--muted)' }));

  /* 그림 14-6 이미지 처리 기본 구조 */
  const pic = (x, y, w, h, flip) => {
    const sky = `<rect x="${x}" y="${flip ? y + h * 0.55 : y}" width="${w}" height="${h * 0.45}" fill="#8cc4ee"/>`;
    const grass = `<rect x="${x}" y="${flip ? y : y + h * 0.45}" width="${w}" height="${h * 0.55}" fill="#5aa05a"/>`;
    const sunY = flip ? y + h * 0.8 : y + h * 0.2;
    return sky + grass + `<circle cx="${x + w * 0.75}" cy="${sunY}" r="${h * 0.1}" fill="#ffe27a"/>` +
      `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="var(--line)" stroke-width="2"/>`;
  };
  const SVG_STRUCT = SV(1280, 560,
    R(60, 40, 900, 300, { s: 'var(--accent2)', sw: 3 }) + T(510, 30, '파이썬 프로그램', { b: true, c: 'var(--accent2)' }) +
    T(230, 85, '원본 이미지 (photo)', { b: true }) + pic(110, 105, 240, 180, false) +
    T(790, 85, '결과 이미지 (photo2)', { b: true }) + pic(670, 105, 240, 180, true) +
    Ln(390, 195, 630, 195, { arrow: true, sw: 3 }) + T(510, 180, '이미지 처리', { fs: 20 }) + T(510, 225, 'photo.copy() 후 가공', { fs: 17, c: 'var(--muted)', mono: true }) +
    Ln(790, 340, 790, 390, { arrow: true, sw: 3 }) + T(900, 372, 'displayImage()', { mono: true, c: 'var(--accent)' }) +
    R(640, 395, 300, 150, { f: '#222', s: '#555' }) + pic(680, 410, 220, 120, true) +
    T(1100, 450, '화면(캔버스)에 출력', { fs: 20 }) +
    T(230, 330, '파일에서 읽은 뒤 바꾸지 않는다', { fs: 17, c: 'var(--muted)' }) +
    T(300, 440, '원본은 그대로 두고', { fs: 20, c: 'var(--ok)', b: true }) +
    T(300, 475, '매번 원본의 복사본을 가공한다', { fs: 20, c: 'var(--ok)', b: true }));

  /* displayImage 의 원리: 픽셀 → 색 문자열 */
  const cell = (x, y, c, t) => `<rect x="${x}" y="${y}" width="70" height="70" fill="${c}" stroke="var(--line)" stroke-width="2"/>` + T(x + 35, y + 96, t, { fs: 15, mono: true, c: 'var(--muted)' });
  const SVG_RGBSTR = SV(1280, 470,
    T(230, 40, 'Pillow 이미지 (3 × 2 점)', { b: true }) +
    cell(110, 70, '#ff0000', '(0,0)') + cell(190, 70, '#00ff00', '(1,0)') + cell(270, 70, '#ff0000', '(2,0)') +
    cell(110, 190, '#ff0000', '(0,1)') + cell(190, 190, '#ff0000', '(1,1)') + cell(270, 190, '#0000ff', '(2,1)') +
    T(230, 330, 'getpixel((k, i)) → (r, g, b)', { mono: true, fs: 19 }) +
    Ln(400, 170, 520, 170, { arrow: true, sw: 3 }) + T(460, 155, '한 줄씩', { fs: 17 }) +
    R(530, 80, 700, 70, { s: 'var(--accent)' }) + T(880, 124, '{#ff0000 #00ff00 #ff0000 }', { mono: true, fs: 24 }) +
    R(530, 190, 700, 70, { s: 'var(--accent)' }) + T(880, 234, '{#ff0000 #ff0000 #0000ff }', { mono: true, fs: 24 }) +
    T(880, 300, '두 줄을 이어 붙인 rgbString 을 paper.put() 에 넘긴다', { fs: 19 }) +
    T(880, 340, '"#%02x%02x%02x " % (r, g, b) → 16진수 두 자리씩', { fs: 18, mono: true, c: 'var(--muted)' }) +
    T(640, 420, '점 하나하나를 문자열로 바꾸므로 사진이 크면 느리다 → ImageTk.PhotoImage 로 한 번에 바꾸는 방법도 있다', { fs: 18, c: 'var(--warn)' }));

  /* 그림 14-10 게임의 주요 변수 */
  const SVG_VARS = SV(1280, 640,
    Ln(470, 40, 540, 40, { arrow: true, sw: 3, s: 'var(--accent2)' }) + Ln(470, 40, 470, 100, { arrow: true, sw: 3, s: 'var(--accent2)' }) +
    T(470, 28, '기준점 (0, 0)', { fs: 17 }) + T(555, 46, 'X', { fs: 18 }) + T(470, 122, 'Y', { fs: 18 }) +
    R(480, 60, 330, 560, { f: '#e8b95e', s: '#8a6a2a', rx: 4 }) +
    `<circle cx="580" cy="150" r="34" fill="#6a4a3a"/><circle cx="570" cy="145" r="7" fill="#fff"/><circle cx="590" cy="145" r="7" fill="#fff"/>` +
    `<rect x="672" y="250" width="4" height="26" fill="#b0303a"/>` +
    `<path d="M680 470 q-20 30 -18 60 h36 q2 -30 -18 -60 z" fill="#b92d5f" stroke="#46142d" stroke-width="3"/>` +
    T(560, 600, '파괴한 우주괴물 수 : 1', { fs: 17 }) +
    Ln(420, 150, 540, 150, { dash: true, arrow: true }) + T(250, 110, '우주괴물 변수', { b: true, c: 'var(--danger)' }) +
    T(250, 140, '객체 : monster', { fs: 17 }) + T(250, 165, '크기 : monsterSize', { fs: 17 }) + T(250, 190, '속도 : monsterSpeed', { fs: 17 }) + T(250, 215, '위치 : monsterX, monsterY', { fs: 17 }) +
    Ln(440, 330, 478, 330, { dash: true, arrow: true }) + T(250, 310, '화면 변수', { b: true, c: 'var(--danger)' }) + T(250, 340, '화면 : monitor', { fs: 17 }) + T(250, 365, '폭과 높이 : swidth, sheight', { fs: 17 }) +
    Ln(440, 590, 520, 598, { dash: true, arrow: true }) + T(250, 560, '점수 변수', { b: true, c: 'var(--danger)' }) + T(250, 590, '맞힌 수 : fireCount', { fs: 17 }) +
    Ln(860, 262, 690, 262, { dash: true, arrow: true }) + T(1040, 240, '미사일 변수', { b: true, c: 'var(--danger)' }) + T(1040, 268, '객체 : missile', { fs: 17 }) + T(1040, 293, '위치 : missileX, missileY', { fs: 17 }) +
    Ln(860, 500, 712, 500, { dash: true, arrow: true }) + T(1040, 470, '우주선 변수', { b: true, c: 'var(--danger)' }) + T(1040, 498, '객체 : ship', { fs: 17 }) + T(1040, 523, '크기 : shipSize', { fs: 17 }) + T(1040, 548, '위치 : shipX, shipY', { fs: 17 }));

  /* 게임 루프 흐름 */
  const SVG_LOOP = SV(1280, 560,
    BOX(80, 30, 300, 56, '준비 (init · set_mode · 그림 load)', { fs: 18 }) + Ln(230, 86, 230, 120, { arrow: true }) +
    BOX(80, 120, 300, 56, 'playGame() : 변수 초기화', { fs: 18 }) + Ln(230, 176, 230, 215, { arrow: true }) +
    R(60, 215, 1160, 330, { s: 'var(--accent)', dash: true }) + T(160, 245, 'while True :', { mono: true, b: true, c: 'var(--accent)' }) +
    BOX(100, 265, 220, 60, '① tick(50) 기다리기', { fs: 18 }) + Ln(320, 295, 360, 295, { arrow: true }) +
    BOX(360, 265, 200, 60, '② 배경 칠하기', { fs: 18 }) + Ln(560, 295, 600, 295, { arrow: true }) +
    BOX(600, 265, 260, 60, '③ 이벤트 확인 (키보드)', { fs: 18 }) + Ln(860, 295, 900, 295, { arrow: true }) +
    BOX(900, 265, 280, 60, '④ 위치 계산 · 충돌 판정', { fs: 18 }) + Ln(1040, 325, 1040, 385, { arrow: true }) +
    BOX(820, 385, 360, 60, '⑤ blit 로 그리기 · 점수 쓰기', { fs: 18 }) + Ln(820, 415, 560, 415, { arrow: true }) +
    BOX(260, 385, 300, 60, '⑥ display.update()', { fs: 18, s: 'var(--ok)' }) + `<path d="M260 415 H200 V335" fill="none" stroke="var(--muted)" stroke-width="2" marker-end="url(#arr14)"/>` +
    T(640, 500, '1초에 약 50번 ①~⑥을 되풀이 → 그림이 움직이는 것처럼 보인다 (애니메이션)', { fs: 19 }) +
    T(750, 205, 'QUIT 이벤트(창 닫기) → pygame.quit() · sys.exit() 로 끝', { fs: 18, c: 'var(--danger)' }));

  /* 충돌 판정 그림 */
  const SVG_HIT = SV(1280, 460,
    R(380, 60, 300, 240, { s: 'var(--danger)', f: 'var(--danger)', op: 0.08, sw: 3 }) +
    T(530, 50, '우주괴물 사각형', { b: true, c: 'var(--danger)' }) +
    `<circle cx="380" cy="60" r="7" fill="var(--danger)"/>` + T(380, 330, '(monsterX, monsterY)', { mono: true, fs: 17 }) +
    Ln(380, 360, 680, 360, { arrow: true }) + T(530, 390, 'monsterSize[0] (폭)', { mono: true, fs: 17 }) +
    Ln(720, 60, 720, 300, { arrow: true }) + T(730, 185, 'monsterSize[1] (높이)', { mono: true, fs: 17, a: 'start' }) +
    `<rect x="505" y="170" width="8" height="30" fill="#b0303a"/><circle cx="505" cy="170" r="6" fill="var(--accent)"/>` +
    T(505, 225, '(missileX, missileY)', { mono: true, fs: 17, c: 'var(--accent)' }) +
    T(1030, 110, '맞았다 = 미사일 점이 사각형 안', { fs: 20, b: true }) +
    T(1030, 160, 'monsterX &lt; missileX &lt; monsterX + 폭', { fs: 18, mono: true }) +
    T(1030, 195, '그리고', { fs: 18 }) +
    T(1030, 230, 'monsterY &lt; missileY &lt; monsterY + 높이', { fs: 18, mono: true }) +
    T(640, 440, '화면 좌표는 왼쪽 위가 (0, 0), 아래로 갈수록 y 가 커진다', { fs: 18, c: 'var(--muted)' }));

  /* ================================================================ [프로젝트 1] 미니 포토샵 코드 조립 */
  const PS_HEAD = String.raw`from tkinter import *
from tkinter.filedialog import *
from tkinter.simpledialog import *
from PIL import Image, ImageFilter, ImageEnhance, ImageOps
`;
  const PS_HEAD_TK = PS_HEAD.replace('ImageOps\n', 'ImageOps, ImageTk\n');

  const PS_IMPL = {
    displayImage: String.raw`def displayImage(img, width, height) :
    global window, canvas, paper, photo, photo2, oriX, oriY

    window.geometry(str(width) + "x" + str(height))
    if canvas != None :
        canvas.destroy()

    canvas = Canvas(window, width = width, height = height)
    paper = PhotoImage(width = width, height = height)
    canvas.create_image((width / 2, height / 2), image = paper, state = "normal")
    rgbString = ""
    rgbImage = img.convert('RGB')
    for i in range(0, height) :
        tmpString = ""
        for k in range(0, width) :
            r, g, b = rgbImage.getpixel((k, i))
            tmpString += "#%02x%02x%02x " % (r, g, b)   # x 뒤에 한 칸 공백
        rgbString += "{" + tmpString + "} "            # } 뒤에 한 칸 공백
    paper.put(rgbString)
    canvas.pack()
`,
    func_open: String.raw`def func_open() :
    global window, canvas, paper, photo, photo2, oriX, oriY
    readFp = askopenfilename(parent = window, filetypes = (("모든 그림 파일", "*.jpg *.jpeg *.bmp *.png *.tif *.gif"), ("모든 파일", "*.*")))
    if readFp == "" :      # [취소]를 누른 경우
        return
    photo = Image.open(readFp).convert('RGB')
    oriX = photo.width
    oriY = photo.height

    photo2 = photo.copy()
    newX = photo2.width
    newY = photo2.height
    displayImage(photo2, newX, newY)
`,
    func_save: String.raw`def func_save() :
    global window, canvas, paper, photo, photo2, oriX, oriY

    if photo2 == None :
        return
    saveFp = asksaveasfile(parent = window, mode = "w", defaultextension = ".jpg",
                           filetypes = (("JPG 파일", "*.jpg *.jpeg"), ("모든 파일", "*.*")))
    if saveFp == None :    # [취소]를 누른 경우
        return
    photo2.save(saveFp.name)
`,
    func_exit: String.raw`def func_exit() :
    exit()
`,
    func_zoomin: String.raw`def func_zoomin() :
    global window, canvas, paper, photo, photo2, oriX, oriY
    scale = askinteger("확대", "확대할 배율을 입력하세요", minvalue = 2, maxvalue = 4)
    photo2 = photo.copy()
    photo2 = photo2.resize((int(oriX * scale), int(oriY * scale)))
    newX = photo2.width
    newY = photo2.height
    displayImage(photo2, newX, newY)
`,
    func_zoomout: String.raw`def func_zoomout() :
    global window, canvas, paper, photo, photo2, oriX, oriY
    scale = askinteger("축소", "축소할 배율을 입력하세요", minvalue = 2, maxvalue = 4)
    photo2 = photo.copy()
    photo2 = photo2.resize((int(oriX / scale), int(oriY / scale)))
    newX = photo2.width
    newY = photo2.height
    displayImage(photo2, newX, newY)
`,
    func_mirror1: String.raw`def func_mirror1() :
    global window, canvas, paper, photo, photo2, oriX, oriY
    photo2 = photo.copy()
    photo2 = photo2.transpose(Image.FLIP_TOP_BOTTOM)
    newX = photo2.width
    newY = photo2.height
    displayImage(photo2, newX, newY)
`,
    func_mirror2: String.raw`def func_mirror2() :
    global window, canvas, paper, photo, photo2, oriX, oriY
    photo2 = photo.copy()
    photo2 = photo2.transpose(Image.FLIP_LEFT_RIGHT)
    newX = photo2.width
    newY = photo2.height
    displayImage(photo2, newX, newY)
`,
    func_rotate: String.raw`def func_rotate() :
    global window, canvas, paper, photo, photo2, oriX, oriY
    degree = askinteger("회전", "회전할 각도를 입력하세요", minvalue = 0, maxvalue = 360)
    photo2 = photo.copy()
    photo2 = photo2.rotate(degree, expand = True)
    newX = photo2.width
    newY = photo2.height
    displayImage(photo2, newX, newY)
`,
    func_bright: String.raw`def func_bright() :
    global window, canvas, paper, photo, photo2, oriX, oriY
    value = askfloat("밝게", "값을 입력하세요(1.0~10.0)", minvalue = 1.0, maxvalue = 10.0)
    photo2 = photo.copy()
    photo2 = ImageEnhance.Brightness(photo2).enhance(value)
    newX = photo2.width
    newY = photo2.height
    displayImage(photo2, newX, newY)
`,
    func_dark: String.raw`def func_dark() :
    global window, canvas, paper, photo, photo2, oriX, oriY
    value = askfloat("어둡게", "값을 입력하세요(0.0~1.0)", minvalue = 0.0, maxvalue = 1.0)
    photo2 = photo.copy()
    photo2 = ImageEnhance.Brightness(photo2).enhance(value)
    newX = photo2.width
    newY = photo2.height
    displayImage(photo2, newX, newY)
`,
    func_blur: String.raw`def func_blur() :
    global window, canvas, paper, photo, photo2, oriX, oriY
    photo2 = photo.copy()
    photo2 = photo2.filter(ImageFilter.BLUR)
    newX = photo2.width
    newY = photo2.height
    displayImage(photo2, newX, newY)
`,
    func_embo: String.raw`def func_embo() :
    global window, canvas, paper, photo, photo2, oriX, oriY
    photo2 = photo.copy()
    photo2 = photo2.filter(ImageFilter.EMBOSS)
    newX = photo2.width
    newY = photo2.height
    displayImage(photo2, newX, newY)
`,
    func_bw: String.raw`def func_bw() :
    global window, canvas, paper, photo, photo2, oriX, oriY
    photo2 = photo.copy()
    photo2 = ImageOps.grayscale(photo2)
    newX = photo2.width
    newY = photo2.height
    displayImage(photo2, newX, newY)
`
  };

  const PS_FAST_DISPLAY = String.raw`def displayImage(img, width, height) :
    global window, canvas, paper, photo, photo2, oriX, oriY

    window.geometry(str(width) + "x" + str(height))
    if canvas != None :
        canvas.destroy()

    canvas = Canvas(window, width = width, height = height)
    paper = ImageTk.PhotoImage(img)     # Pillow 이미지를 한 번에 tkinter 이미지로 바꾼다
    canvas.create_image((width / 2, height / 2), image = paper, state = "normal")
    canvas.pack()
`;

  const PS_ORDER = [['displayImage', 2], ['func_open', 2], ['func_save', 3], ['func_exit', 0], ['func_zoomin', 4], ['func_zoomout', 4],
    ['func_mirror1', 5], ['func_mirror2', 5], ['func_rotate', 6], ['func_bright', 7], ['func_dark', 7], ['func_blur', 8], ['func_embo', 8], ['func_bw', 9]];

  const psStub = (name, n) => {
    const head = `def ${name}() :`;
    return head + ' '.repeat(Math.max(2, 22 - head.length)) + `# Code14-0${n}.py에서 구현\n    pass\n`;
  };

  const PS_GLOBAL = String.raw`## 전역 변수 선언 부분 ##
window, canvas, paper = None, None, None
photo, photo2 = None, None
oriX, oriY = 0, 0
`;

  const PS_MAIN = String.raw`## 메인 코드 부분 ##
window = Tk()
window.geometry("250x250")
window.title("미니 포토샵")

mainMenu = Menu(window)
window.config(menu = mainMenu)

fileMenu = Menu(mainMenu)
mainMenu.add_cascade(label = "파일", menu = fileMenu)
fileMenu.add_command(label = "파일 열기", command = func_open)
fileMenu.add_command(label = "파일 저장", command = func_save)
fileMenu.add_separator()
fileMenu.add_command(label = "프로그램 종료", command = func_exit)

image1Menu = Menu(mainMenu)
mainMenu.add_cascade(label = "이미지 처리(1)", menu = image1Menu)
image1Menu.add_command(label = "확대", command = func_zoomin)
image1Menu.add_command(label = "축소", command = func_zoomout)
image1Menu.add_separator()
image1Menu.add_command(label = "상하 반전", command = func_mirror1)
image1Menu.add_command(label = "좌우 반전", command = func_mirror2)
image1Menu.add_command(label = "회전", command = func_rotate)

image2Menu = Menu(mainMenu)
mainMenu.add_cascade(label = "이미지 처리(2)", menu = image2Menu)
image2Menu.add_command(label = "밝게", command = func_bright)
image2Menu.add_command(label = "어둡게", command = func_dark)
image2Menu.add_separator()
image2Menu.add_command(label = "블러링", command = func_blur)
image2Menu.add_command(label = "엠보싱", command = func_embo)
image2Menu.add_separator()
image2Menu.add_command(label = "흑백이미지", command = func_bw)
window.mainloop()
`;

  /* level: 구현된 코드 번호(2~9), o.fast: ImageTk 로 표시, o.funcs: 추가 함수, o.menu: mainloop 앞에 넣을 코드 */
  const ps = (level, o = {}) => {
    const funcs = PS_ORDER.map(([name, n]) => {
      if (name === 'displayImage' && o.fast) return PS_FAST_DISPLAY;
      if (n > level) return name === 'displayImage' ? psStub('displayImage', 2) : psStub(name, n);
      return PS_IMPL[name];
    }).join('\n');
    return (o.fast ? PS_HEAD_TK : PS_HEAD) + '\n## 함수 선언 부분 ##\n' + funcs + (o.funcs ? '\n' + o.funcs : '') + '\n' + PS_GLOBAL + '\n' +
      PS_MAIN.replace('window.mainloop()', (o.menu || '') + 'window.mainloop()');
  };

  /* ================================================================ [프로젝트 2] 슈팅 게임 코드 조립 (L = 10 ~ 14) */
  const game = (L) => {
    const g = [];
    const add = (s) => g.push(s);
    add(String.raw`import pygame
import random
import sys


## 함수 선언 부분 ##
# @기능 2-5 : 매개변수로 받은 객체를 화면에 그리는 함수를 선언한다.`);
    if (L >= 11) add(String.raw`def paintEntity(entity, x, y) :
    monitor.blit(entity, (int(x), int(y)))
`);
    add('# @기능 5-4 : 점수를 화면에 쓰는 함수를 선언한다.');
    if (L >= 14) add(String.raw`def writeScore(score) :
    myfont = pygame.font.SysFont('malgungothic', 20)    # 한글 폰트 (맑은 고딕)
    txt = myfont.render(u'파괴한 우주괴물 수 : ' + str(score), True, (255 - r, 255 - g, 255 - b))
    monitor.blit(txt, (10, sheight - 40))`);
    const gl = ['monitor'].concat(L >= 11 ? ['ship'] : [], L >= 12 ? ['monster'] : [], L >= 13 ? ['missile'] : []);
    add(String.raw`
def playGame() :
    global ${gl.join(', ')}

    r = random.randrange(0, 256)
    g = random.randrange(0, 256)
    b = random.randrange(0, 256)
`);
    add('    # @기능 2-2 : 우주선의 초기 위치 키보드를 눌렀을 때 이동량을 저장할 변수를 선언한다.');
    if (L >= 11) add(String.raw`    shipX = swidth / 2      # 우주선 위치
    shipY = sheight * 0.8
    dx, dy = 0, 0           # 키보드를 누를 때 우주선의 이동량
`);
    add('    # @기능 3-2 : 우주괴물을 무작위로 추출하고 크기와 위치를 설정한다.');
    if (L >= 12) add(String.raw`    monster = pygame.image.load(random.choice(monsterImage))
    monsterSize = monster.get_rect().size                  # 우주괴물 크기
    monsterX = 0
    monsterY = random.randrange(0, int(swidth * 0.3))     # 상위 30% 위치까지만
    monsterSpeed = random.randrange(1, 5)
`);
    add('    # @기능 4-2 : 미사일 좌표를 초기화한다.');
    if (L >= 13) add(String.raw`    missileX, missileY = None, None     # None은 미사일을 쏘지 않았다는 의미이다.`);
    add('    # @기능 5-1 : 맞힌 우주괴물 숫자를 저장할 변수를 선언한다.');
    if (L >= 14) add('    fireCount = 0');
    add(String.raw`
    # 무한 반복
    while True :
        (pygame.time.Clock()).tick(50)      # 게임 진행을 늦춘다(10~100 정도가 적당).
        monitor.fill((r, g, b))             # 화면 배경을 칠한다.

        # 키보드나 마우스 이벤트가 들어오는지 체크한다.
        for e in pygame.event.get() :
            if e.type in [pygame.QUIT] :
                pygame.quit()
                sys.exit()
`);
    if (L < 11) {
      add(String.raw`            # @기능 2-3 : 방향키에 따라 우주선이 움직이게 한다.
                # @기능 4-3 : 스페이스바를 누르면 미사일을 발사한다.
`);
    } else {
      add(String.raw`            # @기능 2-3 : 방향키에 따라 우주선이 움직이게 한다.
            # 방향키를 누르면 우주선이 이동한다(누르고 있으면 계속 이동한다).
            if e.type in [pygame.KEYDOWN] :
                if e.key == pygame.K_LEFT : dx = -5
                elif e.key == pygame.K_RIGHT : dx = +5
                elif e.key == pygame.K_UP : dy = -5
                elif e.key == pygame.K_DOWN : dy = +5
                # @기능 4-3 : 스페이스바를 누르면 미사일을 발사한다.` + (L >= 13 ? String.raw`
                elif e.key == pygame.K_SPACE :
                    if missileX == None :       # 미사일을 쏜 적이 없다면
                        missileX = shipX + shipSize[0] / 2
                        # 우주선 위치에서 미사일을 발사한다.
                        missileY = shipY` : '') + String.raw`

            # 방향키를 떼면 우주선이 멈춘다.
            if e.type in [pygame.KEYUP] :
                if e.key == pygame.K_LEFT or e.key == pygame.K_RIGHT \
                    or e.key == pygame.K_UP or e.key == pygame.K_DOWN : dx, dy = 0, 0
`);
    }
    add('        # @기능 2-4 : 우주선이 화면 안에서만 움직이게 한다.');
    if (L >= 11) add(String.raw`        if (0 < shipX + dx and shipX + dx <= swidth - shipSize[0]) \
            and (sheight / 2 < shipY + dy and shipY + dy <= sheight - shipSize[1]) :   # 화면의 중앙까지만
            shipX += dx
            shipY += dy
        paintEntity(ship, shipX, shipY)     # 우주선을 화면에 표시한다.
`);
    add('        # @기능 3-3 : 우주괴물이 자동으로 나타나 왼쪽에서 오른쪽으로 움직인다.');
    if (L >= 12) add(String.raw`        monsterX += monsterSpeed
        if monsterX > swidth :
            monsterX = 0
            monsterY = random.randrange(0, int(swidth * 0.3))
            # 우주괴물 이미지를 무작위로 선택한다.
            monster = pygame.image.load(random.choice(monsterImage))
            monsterSize = monster.get_rect().size
            monsterSpeed = random.randrange(1, 5)

        paintEntity(monster, monsterX, monsterY)
`);
    add('        # @기능 4-4 : 미사일을 화면에 표시한다.');
    if (L >= 13) add(String.raw`        if missileX != None :       # 총알을 쏘면 좌표를 위로 변경한다.
            missileY -= 10
            if missileY < 0 :
                missileX, missileY = None, None     # 총알이 사라진다.
        if missileX != None :       # 미사일을 쏜 적이 있으면 미사일을 그려 준다.
            paintEntity(missile, missileX, missileY)`);
    add('            # @기능 5-2 : 우주괴물이 미사일에 맞았는지 체크한다.');
    if (L >= 14) add(String.raw`            if (monsterX < missileX and missileX < monsterX + monsterSize[0]) and \
                (monsterY < missileY and missileY < monsterY + monsterSize[1]) :
                fireCount += 1

                # 우주괴물을 초기화한다(무작위 이미지로 다시 준비한다).
                monster = pygame.image.load(random.choice(monsterImage))
                monsterSize = monster.get_rect().size
                monsterX = 0
                monsterY = random.randrange(0, int(swidth * 0.3))
                monsterSpeed = random.randrange(1, 5)

                # 미사일을 초기화한다.
                missileX, missileY = None, None     # 총알이 사라진다.
`);
    add('        # @기능 5-3 : 점수를 화면에 쓰는 함수를 호출한다.');
    if (L >= 14) add('        writeScore(fireCount)');
    add(String.raw`
        # 화면을 업데이트한다.
        pygame.display.update()` + (L <= 11 ? "\n        print('~', end = '')" : '') + String.raw`


## 전역 변수 선언 부분 ##
r, g, b = [0] * 3                   # 게임 배경색
swidth, sheight = 500, 700          # 화면 크기
monitor = None                      # 게임 화면`);
    if (L >= 11) add('ship, shipSize = None, 0            # 우주선의 객체와 크기 변수');
    add('\n# @기능 3-1 : 무작위로 사용할 우주괴물 이미지를 10개 준비한다.');
    if (L >= 12) add(String.raw`monsterImage = ['game/monster01.png', 'game/monster02.png', 'game/monster03.png', 'game/monster04.png', \
                'game/monster05.png', 'game/monster06.png', 'game/monster07.png', 'game/monster08.png', \
                'game/monster09.png', 'game/monster10.png']
monster = None      # 우주괴물`);
    if (L >= 13) add('\nmissile = None      # 미사일');
    add(String.raw`

## 메인 코드 부분 ##
pygame.init()
monitor = pygame.display.set_mode((swidth, sheight))
pygame.display.set_caption('우주괴물 무찌르기')

# @기능 2-1 : 우주선 이미지를 준비하고 크기를 구한다.`);
    if (L >= 11) add(String.raw`ship = pygame.image.load('game/ship02.png')
shipSize = ship.get_rect().size`);
    add('\n# @기능 4-1 : 미사일 이미지를 추가한다.');
    if (L >= 13) add(String.raw`missile = pygame.image.load('game/missile.png')`);
    add('\nplayGame()\n');
    return g.join('\n');
  };

  /* ================================================================ 짧은 예제 (본문 · 슬라이드 공용) */
  const C_PIL_INFO = String.raw`from PIL import Image

photo = Image.open('JPG/picture01.jpg')
print('파일 형식 :', photo.format)
print('크기(폭, 높이) :', photo.size)
print('폭 :', photo.width, '/ 높이 :', photo.height)
print('색 모드 :', photo.mode)`;

  const C_PIL_PIXEL = String.raw`from PIL import Image

img = Image.new('RGB', (3, 2), (255, 0, 0))   # 폭 3, 높이 2 인 빨간 그림
img.putpixel((1, 0), (0, 255, 0))             # (1, 0) 점만 초록
img.putpixel((2, 1), (0, 0, 255))             # (2, 1) 점만 파랑
print(img.size)
print(img.getpixel((0, 0)))
print(img.getpixel((1, 0)))
print(img.getpixel((2, 1)))`;

  const C_PIL_SHOW = String.raw`from tkinter import *
from PIL import Image, ImageOps, ImageTk

window = Tk()
window.title("원본과 흑백 사진")

photo = Image.open('JPG/picture02.jpg')     # Pillow 로 사진 읽기
gray = ImageOps.grayscale(photo)            # 흑백으로 바꾼 복사본

img1 = ImageTk.PhotoImage(photo)            # tkinter 에서 쓸 수 있게 바꾸기
img2 = ImageTk.PhotoImage(gray)
Label(window, image = img1).pack(side = LEFT)
Label(window, image = img2).pack(side = LEFT)

window.mainloop()`;

  const C_MENU_MINI = String.raw`from tkinter import *
from tkinter import messagebox

def func_hello() :
    messagebox.showinfo("안녕", "메뉴를 눌렀어요!")

window = Tk()
window.geometry("250x150")
window.title("메뉴 연습")

mainMenu = Menu(window)
window.config(menu = mainMenu)

fileMenu = Menu(mainMenu)
mainMenu.add_cascade(label = "파일", menu = fileMenu)
fileMenu.add_command(label = "인사하기", command = func_hello)
fileMenu.add_separator()
fileMenu.add_command(label = "종료", command = window.destroy)

window.mainloop()`;

  const C_RGBSTR = String.raw`from PIL import Image

img = Image.new('RGB', (3, 2), (255, 0, 0))
img.putpixel((1, 0), (0, 255, 0))
img.putpixel((2, 1), (0, 0, 255))

width, height = img.size
rgbString = ""
for i in range(0, height) :          # 한 줄(행)씩
    tmpString = ""
    for k in range(0, width) :       # 그 줄의 점을 왼쪽부터
        r, g, b = img.getpixel((k, i))
        tmpString += "#%02x%02x%02x " % (r, g, b)
    rgbString += "{" + tmpString + "} "
print(rgbString)`;

  const C_HEX = String.raw`print("#%02x%02x%02x" % (255, 0, 16))
print("#%02x%02x%02x" % (18, 52, 86))
print("%x" % 255, "%02x" % 5, "%02X" % 171)`;

  const C_SAVE_DEMO = String.raw`from PIL import Image

photo = Image.open('JPG/picture04.jpg').convert('RGB')
photo2 = photo.copy()                       # 원본은 그대로 두고 복사본을 쓴다
photo2.save('copy_cat.png')                 # 확장자로 저장 형식이 정해진다
photo2.save('copy_cat.jpg', quality = 90)   # JPG 는 품질(1~95)을 줄 수 있다

check = Image.open('copy_cat.png')
print(check.format, check.size)
check = Image.open('copy_cat.jpg')
print(check.format, check.size)`;

  const C_PROC_ALL = String.raw`from PIL import Image, ImageFilter, ImageEnhance, ImageOps

photo = Image.open('JPG/picture03.jpg').convert('RGB')
oriX, oriY = photo.width, photo.height
print('원본       :', photo.size)

big = photo.resize((int(oriX * 2), int(oriY * 2)))
print('2배 확대   :', big.size)
small = photo.resize((int(oriX / 4), int(oriY / 4)))
print('1/4 축소   :', small.size)

updown = photo.transpose(Image.FLIP_TOP_BOTTOM)
print('상하 반전  :', updown.size)
rot = photo.rotate(90, expand = True)
print('90도 회전  :', rot.size)
rot45 = photo.rotate(45, expand = True)
print('45도 회전  :', rot45.size)

gray = ImageOps.grayscale(photo)
print('흑백       :', gray.size, gray.mode)`;

  const C_ENHANCE = String.raw`from PIL import Image, ImageEnhance, ImageOps

img = Image.new('RGB', (1, 1), (100, 50, 20))   # 점 하나짜리 그림
print('원본   :', img.getpixel((0, 0)))

bright = ImageEnhance.Brightness(img).enhance(2.0)
print('2.0배  :', bright.getpixel((0, 0)))
dark = ImageEnhance.Brightness(img).enhance(0.5)
print('0.5배  :', dark.getpixel((0, 0)))
same = ImageEnhance.Brightness(img).enhance(1.0)
print('1.0배  :', same.getpixel((0, 0)))

red = Image.new('RGB', (1, 1), (255, 0, 0))
print('빨강 → 흑백 :', ImageOps.grayscale(red).getpixel((0, 0)))`;

  const C_ROTATE_MINI = String.raw`from PIL import Image

photo = Image.open('JPG/picture01.jpg')
print(photo.size)
print(photo.rotate(90).size)                  # 크기 유지 (모서리가 잘린다)
print(photo.rotate(90, expand = True).size)   # 돌린 그림이 다 들어가게 넓힌다`;

  const C_FILTER_SHOW = String.raw`from tkinter import *
from PIL import Image, ImageFilter, ImageTk

window = Tk()
window.title("블러링과 엠보싱")
photo = Image.open('JPG/picture02.jpg').resize((160, 200))

img1 = ImageTk.PhotoImage(photo)
img2 = ImageTk.PhotoImage(photo.filter(ImageFilter.BLUR))
img3 = ImageTk.PhotoImage(photo.filter(ImageFilter.EMBOSS))
for im in (img1, img2, img3) :
    Label(window, image = im).pack(side = LEFT)

window.mainloop()`;

  const C_PG_MINI = String.raw`import pygame
import sys

pygame.init()
monitor = pygame.display.set_mode((300, 300))
pygame.display.set_caption('처음 만드는 pygame 창')
clock = pygame.time.Clock()

while True :
    clock.tick(50)                       # 1초에 50번 정도만 반복
    for e in pygame.event.get() :
        if e.type == pygame.QUIT :       # 창의 [X] 를 누르면
            pygame.quit()
            sys.exit()
    monitor.fill((150, 180, 90))         # 배경을 칠하고
    pygame.draw.circle(monitor, (255, 255, 255), (150, 150), 40)
    pygame.display.update()              # 화면에 반영`;

  const C_PG_KEYS = String.raw`import pygame
import sys

pygame.init()
monitor = pygame.display.set_mode((300, 300))
ship = pygame.image.load('game/ship02.png')
x, y, dx = 130, 200, 0
clock = pygame.time.Clock()

while True :
    clock.tick(50)
    for e in pygame.event.get() :
        if e.type == pygame.QUIT :
            pygame.quit()
            sys.exit()
        if e.type == pygame.KEYDOWN :
            if e.key == pygame.K_LEFT : dx = -5
            elif e.key == pygame.K_RIGHT : dx = +5
        if e.type == pygame.KEYUP : dx = 0
    x += dx
    monitor.fill((230, 230, 160))
    monitor.blit(ship, (x, y))
    pygame.display.update()`;

  const C_SIZE = String.raw`import pygame

pygame.init()
ship = pygame.image.load('game/ship02.png')
shipSize = ship.get_rect().size
print('우주선 크기 :', shipSize)
print('폭 :', shipSize[0], '/ 높이 :', shipSize[1])

swidth, sheight = 500, 700
shipX = swidth / 2
shipY = sheight * 0.8
print('처음 위치 :', shipX, shipY)`;

  const C_RANDOM_MON = String.raw`import random

monsterImage = ['game/monster01.png', 'game/monster02.png', 'game/monster03.png', 'game/monster04.png', \
                'game/monster05.png', 'game/monster06.png', 'game/monster07.png', 'game/monster08.png', \
                'game/monster09.png', 'game/monster10.png']
random.seed(14)          # 결과를 고정하려고 씨앗값을 정함 (게임에서는 쓰지 않음)
for i in range(3) :
    swidth = 500
    print(random.choice(monsterImage), random.randrange(0, int(swidth * 0.3)), random.randrange(1, 5))`;

  const C_MON_SHOW = String.raw`import pygame
import sys

pygame.init()
monitor = pygame.display.set_mode((680, 140))
pygame.display.set_caption('우주괴물 10종')
monsters = []
for i in range(1, 11) :
    monsters.append(pygame.image.load('game/monster%02d.png' % i))

while True :
    for e in pygame.event.get() :
        if e.type == pygame.QUIT :
            pygame.quit()
            sys.exit()
    monitor.fill((232, 185, 94))
    for i in range(10) :
        x = 10 + (i % 5) * 70 + (i // 5) * 340
        monitor.blit(monsters[i], (x, 40))
    pygame.display.update()`;

  const C_MISSILE_SIM = String.raw`missileX, missileY = None, None     # 아직 쏘지 않음
shipX, shipY, shipW = 226, 560, 48

# 스페이스바를 눌렀다고 치고 발사
if missileX == None :
    missileX = shipX + shipW / 2
    missileY = shipY
print('발사 위치 :', missileX, missileY)

count = 0
while missileX != None :
    missileY -= 10
    count += 1
    if missileY < 0 :
        missileX, missileY = None, None
print(count, '번 움직인 뒤 사라짐')`;

  const C_HIT_FUNC = String.raw`def isHit(monsterX, monsterY, monsterSize, missileX, missileY) :
    return (monsterX < missileX and missileX < monsterX + monsterSize[0]) and \
           (monsterY < missileY and missileY < monsterY + monsterSize[1])

size = (60, 52)                          # 우주괴물의 폭, 높이
print(isHit(100, 50, size, 130, 80))     # 사각형 한가운데
print(isHit(100, 50, size, 170, 80))     # 오른쪽 바깥 (170 > 100 + 60)
print(isHit(100, 50, size, 130, 110))    # 아래쪽 바깥 (110 > 50 + 52)
print(isHit(100, 50, size, 100, 80))     # 왼쪽 경계 (같으면 안 맞음)`;

  const C_RECT = String.raw`import pygame

monster = pygame.Rect(100, 50, 60, 52)     # x, y, 폭, 높이
missile = pygame.Rect(125, 90, 12, 28)
print(monster.colliderect(missile))        # 두 사각형이 겹치면 True
print(monster.collidepoint(130, 80))       # 점이 안에 있으면 True
missile.y = 200
print(monster.colliderect(missile))`;

  const C_SCOPE = String.raw`r, g, b = [0] * 3          # 전역 변수

def playGame() :
    r = 200                 # global 선언이 없으므로 지역 변수
    print('playGame 안의 r :', r)
    writeScore()

def writeScore() :
    print('writeScore 가 보는 r :', r, '→ 글자색', 255 - r)

playGame()`;

  /* 게임 코드 조각 (슬라이드용, 실행하지 않음) */
  const F_KEYS = String.raw`        for e in pygame.event.get() :
            if e.type in [pygame.QUIT] :
                pygame.quit()
                sys.exit()
            # 방향키를 누르면 우주선이 이동한다.
            if e.type in [pygame.KEYDOWN] :
                if e.key == pygame.K_LEFT : dx = -5
                elif e.key == pygame.K_RIGHT : dx = +5
                elif e.key == pygame.K_UP : dy = -5
                elif e.key == pygame.K_DOWN : dy = +5
            # 방향키를 떼면 우주선이 멈춘다.
            if e.type in [pygame.KEYUP] :
                if e.key == pygame.K_LEFT or e.key == pygame.K_RIGHT \
                    or e.key == pygame.K_UP or e.key == pygame.K_DOWN : dx, dy = 0, 0`;

  const F_BOUND = String.raw`        # @기능 2-4 : 우주선이 화면 안에서만 움직이게 한다.
        if (0 < shipX + dx and shipX + dx <= swidth - shipSize[0]) \
            and (sheight / 2 < shipY + dy and shipY + dy <= sheight - shipSize[1]) :
            shipX += dx
            shipY += dy
        paintEntity(ship, shipX, shipY)`;

  const F_MONSTER = String.raw`        # @기능 3-3 : 우주괴물이 왼쪽에서 오른쪽으로 움직인다.
        monsterX += monsterSpeed
        if monsterX > swidth :
            monsterX = 0
            monsterY = random.randrange(0, int(swidth * 0.3))
            monster = pygame.image.load(random.choice(monsterImage))
            monsterSize = monster.get_rect().size
            monsterSpeed = random.randrange(1, 5)

        paintEntity(monster, monsterX, monsterY)`;

  const F_FIRE = String.raw`                # @기능 4-3 : 스페이스바를 누르면 미사일을 발사한다.
                elif e.key == pygame.K_SPACE :
                    if missileX == None :
                        missileX = shipX + shipSize[0] / 2
                        missileY = shipY
        ...
        # @기능 4-4 : 미사일을 화면에 표시한다.
        if missileX != None :
            missileY -= 10
            if missileY < 0 :
                missileX, missileY = None, None
        if missileX != None :
            paintEntity(missile, missileX, missileY)`;

  const F_HIT = String.raw`            # @기능 5-2 : 우주괴물이 미사일에 맞았는지 체크한다.
            if (monsterX < missileX and missileX < monsterX + monsterSize[0]) and \
                (monsterY < missileY and missileY < monsterY + monsterSize[1]) :
                fireCount += 1
                monster = pygame.image.load(random.choice(monsterImage))
                monsterSize = monster.get_rect().size
                monsterX = 0
                monsterY = random.randrange(0, int(swidth * 0.3))
                monsterSpeed = random.randrange(1, 5)
                missileX, missileY = None, None
        # @기능 5-3 : 점수를 화면에 쓰는 함수를 호출한다.
        writeScore(fireCount)`;

  const F_SCORE = String.raw`# @기능 5-4 : 점수를 화면에 쓰는 함수를 선언한다.
def writeScore(score) :
    myfont = pygame.font.SysFont('malgungothic', 20)
    txt = myfont.render(u'파괴한 우주괴물 수 : ' + str(score), True,
                        (255 - r, 255 - g, 255 - b))
    monitor.blit(txt, (10, sheight - 40))`;

  /* ================================================================ 실습 코드 */
  const P_HELP_MENU_FUNCS = String.raw`def func_about() :
    messagebox.showinfo("미니 포토샵", "Pillow 로 만든 미니 포토샵 1.0")
`;
  const P_HELP_MENU = String.raw`helpMenu = Menu(mainMenu)
mainMenu.add_cascade(label = "도움말", menu = helpMenu)
helpMenu.add_command(label = "프로그램 정보", command = func_about)
`;

  const P_EXTRA_FUNCS = String.raw`def func_sharp() :
    global window, canvas, paper, photo, photo2, oriX, oriY
    photo2 = photo.copy()
    photo2 = photo2.filter(ImageFilter.SHARPEN)
    newX = photo2.width
    newY = photo2.height
    displayImage(photo2, newX, newY)

def func_contour() :
    global window, canvas, paper, photo, photo2, oriX, oriY
    photo2 = photo.copy()
    photo2 = photo2.filter(ImageFilter.CONTOUR)
    newX = photo2.width
    newY = photo2.height
    displayImage(photo2, newX, newY)
`;
  const P_EXTRA_MENU = String.raw`image3Menu = Menu(mainMenu)
mainMenu.add_cascade(label = "이미지 처리(3)", menu = image3Menu)
image3Menu.add_command(label = "선명하게", command = func_sharp)
image3Menu.add_command(label = "윤곽선", command = func_contour)
`;

  const P_RESET_FUNCS = String.raw`def func_reset() :
    global window, canvas, paper, photo, photo2, oriX, oriY
    if photo == None :
        return
    photo2 = photo.copy()
    displayImage(photo2, photo2.width, photo2.height)
`;

  PY_COURSE.addChapter({
    id: 'ch14',
    no: '14',
    title: '미니 프로젝트',
    subtitle: 'Pillow 미니 포토샵 · pygame 슈팅 게임',
    summary: '외부 라이브러리 Pillow 로 사진을 열고 확대 · 회전 · 밝기 · 필터 · 흑백 처리를 하는 [미니 포토샵]을 tkinter 메뉴로 만들고, pygame 으로 방향키로 우주선을 움직여 미사일로 우주괴물을 맞히는 [우주괴물 무찌르기] 슈팅 게임을 기능별로 한 단계씩 완성합니다.',
    goals: [
      '외부 라이브러리(Pillow, pygame)를 설치하고 import 해서 활용할 수 있다',
      'tkinter 메뉴와 대화상자로 프로그램의 틀을 만들고 메뉴마다 함수를 연결할 수 있다',
      'Pillow 의 Image · ImageFilter · ImageEnhance · ImageOps 로 컬러 이미지를 처리할 수 있다',
      '원본과 결과 이미지를 나누어 관리하고 화면(캔버스)에 출력하는 구조를 설명할 수 있다',
      'pygame 의 게임 루프(이벤트 → 계산 → 그리기 → 업데이트)를 이해하고 키보드로 물체를 움직일 수 있다',
      '무작위 등장 · 미사일 발사 · 충돌 판정 · 점수 표시를 갖춘 슈팅 게임을 완성할 수 있다'
    ],
    sections: [
      /* ============================================================ 14-1 */
      {
        id: 'ch14-1',
        title: '미니 포토샵 준비: Pillow 와 메뉴 뼈대',
        minutes: 50,
        goals: [
          '외부 라이브러리가 무엇인지 알고 pip 로 설치하는 방법을 설명할 수 있다',
          'Pillow 로 사진을 열어 크기 · 형식 · 점의 색을 알아낼 수 있다',
          '미니 포토샵의 메뉴 구성도를 보고 필요한 함수를 정리할 수 있다',
          'Menu · add_cascade · add_command · add_separator 로 메뉴 뼈대(Code14-01)를 만들 수 있다'
        ],
        flow: [['도입: 이 장에서 만들 두 프로그램', 5], ['외부 라이브러리와 Pillow 설치', 10], ['Pillow 로 사진 다루기', 12], ['메뉴 구성도 · Code14-01', 15], ['퀴즈 · 실습', 8]],
        content: [
          { type: 'h', text: '이 장에서 만들 두 프로그램' },
          { type: 'p', html: '마지막 장에서는 지금까지 배운 변수 · 조건문 · 반복문 · 함수 · 윈도 프로그래밍을 모두 모아 <b>제법 그럴듯한 프로그램 두 개</b>를 만듭니다. 둘 다 파이썬에 기본으로 들어 있지 않은 <b>외부 라이브러리</b>를 빌려 씁니다.' },
          { type: 'table', head: ['프로젝트', '무엇을 만드나', '사용하는 라이브러리'], rows: [
            ['[프로젝트 1] 미니 포토샵', '사진을 열어 확대 · 축소 · 반전 · 회전 · 밝기 조절 · 블러 · 엠보싱 · 흑백 처리를 하고 저장하는 프로그램', '<code>tkinter</code> (창 · 메뉴 · 대화상자) + <b>Pillow</b> (이미지 처리)'],
            ['[프로젝트 2] 우주괴물 무찌르기', '방향키로 우주선을 움직이고 스페이스바로 미사일을 쏘아 우주괴물을 맞히는 슈팅 게임', '<b>pygame</b> (게임 화면 · 키보드 · 그림)']
          ] },
          { type: 'p', html: '포토샵처럼 사진을 가공하는 프로그램을 <b>영상 처리(Image Processing) 프로그램</b>이라고 합니다. 영상 처리는 대학에서 한 과목으로 따로 배울 만큼 깊은 분야지만, 이 장에서는 어려운 이론 대신 <mark>Pillow 가 이미 만들어 둔 기능을 불러 써서 화면에 결과를 보여 주는 것</mark>에 집중합니다.' },
          { type: 'callout', kind: 'info', title: '큰 프로그램을 만드는 요령', html: '처음부터 완성된 코드를 한 번에 쓰려고 하지 마세요. ① 어떤 기능이 필요한지 <b>목록(구성도)</b>을 만들고 ② 각 기능을 <b>빈 함수(pass)</b>로 먼저 만들어 실행되는 뼈대를 세운 뒤 ③ 함수를 하나씩 채우며 매번 실행해 봅니다. 이 장의 두 프로젝트 모두 이 순서로 진행합니다.' },

          { type: 'h', text: '외부 라이브러리 설치' },
          { type: 'p', html: '파이썬을 설치하면 함께 들어오는 <code>random</code>, <code>tkinter</code>, <code>sqlite3</code> 같은 모듈을 <b>표준 라이브러리</b>라고 합니다. 이와 달리 다른 개발자들이 만들어 인터넷(PyPI, 파이썬 패키지 저장소)에 올려 둔 것을 <b>외부 라이브러리</b>(서드파티 라이브러리)라고 하며, 쓰기 전에 <code>pip</code> 라는 설치 도구로 내려받아야 합니다.' },
          { type: 'code', run: false, title: '명령 프롬프트(PowerShell)에서 Pillow 설치', code: 'pip install pillow' },
          { type: 'callout', kind: 'tip', title: '이 웹 강좌에서는 설치가 필요 없어요', html: '이 강좌의 파이썬(브라우저 안의 Pyodide)에는 <b>Pillow 와 pygame(강좌용 호환 모듈)이 이미 준비</b>되어 있습니다. 편집기에 <code>from PIL import Image</code> 를 쓰고 바로 ▶ 실행하면 됩니다. 사진은 작업 폴더의 <code>JPG/picture01.jpg</code> ~ <code>picture04.jpg</code> 를 사용합니다 (이 강좌를 위해 파이썬으로 직접 그린 그림입니다).' },
          { type: 'callout', kind: 'more', title: '📘 집에서 설치해 쓰려면', html: '<p>내 PC 에 설치한 파이썬(IDLE)으로 이 장을 따라 하려면 명령 프롬프트나 PowerShell 에서 다음을 실행합니다.</p><pre><code>pip install pillow\npip install pygame</code></pre><p><b>“pip 은(는) 내부 또는 외부 명령 … 이 아닙니다”</b> 라는 오류가 나면 파이썬 설치 때 <i>Add python.exe to PATH</i> 를 체크하지 않은 것입니다. 이때는 <code>py -m pip install pillow</code> 처럼 <code>py -m pip</code> 로 실행하거나, 파이썬 설치 폴더의 <code>Scripts</code> 폴더에서 터미널을 열어 다시 실행합니다. 설치가 되었는지는 IDLE 에서 <code>import PIL</code> 을 입력해 오류가 없으면 성공입니다.</p><p>참고: 설치할 때 이름은 <code>pillow</code> 지만 코드에서 부를 때는 옛 이름인 <code>PIL</code> 을 씁니다 (Python Imaging Library 의 뒤를 이은 라이브러리이기 때문).</p>' },

          { type: 'h', text: 'Pillow 로 사진 열어 보기' },
          { type: 'p', html: 'Pillow 의 중심은 <code>Image</code> 모듈입니다. <code>Image.open(파일이름)</code> 으로 사진을 읽으면 <b>이미지 객체</b>가 돌아오고, 이 객체의 속성과 메서드로 사진 정보를 알아내거나 가공합니다.' },
          { type: 'code', title: '추가 예제. Pillow 로 사진 정보 보기', code: C_PIL_INFO,
            expect: '파일 형식 : JPEG\n크기(폭, 높이) : (320, 240)\n폭 : 320 / 높이 : 240\n색 모드 : RGB',
            desc: '<code>size</code> 는 (폭, 높이) 튜플이고 <code>width</code> · <code>height</code> 로 따로 꺼낼 수도 있습니다. <code>mode</code> 가 <code>RGB</code> 이면 점마다 빨강 · 초록 · 파랑 세 값을 갖는 컬러 사진, <code>L</code> 이면 흑백(밝기 한 값) 사진입니다.' },
          { type: 'p', html: '디지털 사진은 아주 작은 점(<b>픽셀, pixel</b>)이 바둑판처럼 모인 것입니다. 각 점의 위치는 <code>(x, y)</code> 로 나타내며 <b>왼쪽 위가 (0, 0)</b>이고 오른쪽으로 갈수록 x, 아래로 갈수록 y 가 커집니다. <code>getpixel((x, y))</code> 는 그 점의 색 <code>(R, G, B)</code> 를 알려 줍니다.' },
          { type: 'code', title: '추가 예제. 점(픽셀)의 색 읽기와 쓰기', code: C_PIL_PIXEL,
            expect: '(3, 2)\n(255, 0, 0)\n(0, 255, 0)\n(0, 0, 255)',
            desc: '<code>Image.new(모드, (폭, 높이), 색)</code> 은 새 그림을 만들고, <code>putpixel</code> 로 점 하나의 색을 바꿉니다. 괄호가 두 겹인 이유는 좌표 <code>(x, y)</code> 를 튜플 하나로 넘기기 때문입니다.' },
          { type: 'p', html: 'Pillow 이미지를 tkinter 창에 보여 주려면 tkinter 가 이해하는 이미지로 바꿔야 합니다. 가장 간단한 방법은 <code>PIL.ImageTk.PhotoImage(이미지)</code> 입니다.' },
          { type: 'code', title: '추가 예제. Pillow 이미지를 tkinter 창에 표시하기', code: C_PIL_SHOW,
            desc: '<code>ImageOps.grayscale()</code> 은 흑백으로 바꾼 <b>새 이미지</b>를 돌려주므로 원본 <code>photo</code> 는 그대로 남습니다. ▶ 실행하면 창 하나에 컬러와 흑백 사진이 나란히 나타납니다.' },
          { type: 'callout', kind: 'warn', title: '이미지 변수는 살아 있어야 한다', html: 'tkinter 에서 이미지를 보여 줄 때 <code>img1</code> 같은 변수를 함수 안의 지역 변수로만 두면, 함수가 끝나는 순간 이미지가 사라져 빈 칸만 보일 수 있습니다(실제 tkinter). 그래서 미니 포토샵에서는 화면에 쓰는 이미지(<code>paper</code>)를 <b>전역 변수</b>로 둡니다.' },

          { type: 'h', text: '미니 포토샵 기능 구성' },
          { type: 'p', html: '미니 포토샵은 메뉴 막대에 <b>[파일] · [이미지 처리(1)] · [이미지 처리(2)]</b> 세 메뉴를 두고, 메뉴마다 아래 항목을 넣습니다.' },
          { type: 'figure', html: SVG_MENU, caption: '그림 14-5 미니 포토샵 메뉴 구성도' },
          { type: 'table', head: ['메뉴 항목', '함수 이름', '구현하는 코드'], rows: [
            ['파일 열기 / 파일 저장 / 프로그램 종료', '<code>func_open</code> / <code>func_save</code> / <code>func_exit</code>', 'Code14-02 / 14-03 / (바로 구현)'],
            ['확대 / 축소', '<code>func_zoomin</code> / <code>func_zoomout</code>', 'Code14-04'],
            ['상하 반전 / 좌우 반전', '<code>func_mirror1</code> / <code>func_mirror2</code>', 'Code14-05'],
            ['회전', '<code>func_rotate</code>', 'Code14-06'],
            ['밝게 / 어둡게', '<code>func_bright</code> / <code>func_dark</code>', 'Code14-07'],
            ['블러링 / 엠보싱', '<code>func_blur</code> / <code>func_embo</code>', 'Code14-08'],
            ['흑백이미지', '<code>func_bw</code>', 'Code14-09'],
            ['(화면에 이미지 출력)', '<code>displayImage</code>', 'Code14-02']
          ] },

          { type: 'h', text: '메뉴 구현과 함수 선언 (Code14-01)' },
          { type: 'p', html: '각 메뉴를 클릭했을 때 실행할 함수를 <b>이름만 먼저</b> 만들어 둡니다. 내용은 <code>pass</code>(아무것도 하지 않음)로 비워 두고, 나중에 해당 코드 번호에서 채웁니다. 이렇게 하면 메뉴가 모두 연결된 <b>실행 가능한 뼈대</b>가 생깁니다.' },
          { type: 'code', title: 'Code14-01. 미니 포토샵의 메뉴와 함수 뼈대', code: ps(1),
            desc: '<code>1~4행</code> tkinter 의 창 · 파일 대화상자 · 입력 대화상자와 Pillow 의 네 모듈을 가져옵니다. <code>함수 선언 부분</code> 은 모두 <code>pass</code> 이고 <code>func_exit()</code> 만 <code>exit()</code> 로 바로 구현했습니다. <code>전역 변수 선언 부분</code> 의 <code>window, canvas, paper</code> 는 창 · 그림판 · 그림판에 올릴 이미지, <code>photo, photo2</code> 는 원본과 결과 이미지, <code>oriX, oriY</code> 는 원본의 폭과 높이입니다. <code>메인 코드 부분</code> 에서 메뉴 막대(<code>mainMenu</code>)에 <code>add_cascade</code> 로 상위 메뉴 세 개를 달고, 각 상위 메뉴에 <code>add_command</code> 로 항목과 함수를 연결했습니다.' },
          { type: 'callout', kind: 'info', title: '강의자료와 달라진 점', html: '강의자료 83 · 84행은 블러링 · 엠보싱 메뉴에 <code>func_clear</code>, <code>func_unclear</code> 를 연결하고 있지만, 위에서 선언한 함수 이름은 <code>func_blur</code>, <code>func_embo</code> 입니다. 이름이 다르면 <code>NameError</code> 가 나므로 선언한 이름으로 맞췄습니다.' },
          { type: 'list', items: [
            '<code>Menu(window)</code> — 창에 붙일 <b>메뉴 막대</b>를 만들고 <code>window.config(menu = mainMenu)</code> 로 창에 등록합니다.',
            '<code>Menu(mainMenu)</code> + <code>add_cascade(label, menu)</code> — 메뉴 막대에 펼쳐지는 <b>상위 메뉴</b>를 답니다.',
            '<code>add_command(label, command)</code> — 상위 메뉴 안의 <b>항목</b>. 누르면 <code>command</code> 의 함수가 실행됩니다 (함수 이름 뒤에 괄호를 붙이지 않습니다!).',
            '<code>add_separator()</code> — 항목 사이에 구분선을 넣습니다.'
          ] },
          { type: 'callout', kind: 'warn', title: 'command 에 괄호를 붙이면?', html: '<code>command = func_open()</code> 처럼 괄호를 붙이면 메뉴를 만드는 순간 함수가 <b>바로 한 번 실행</b>되고, 그 결과(None)가 연결되어 정작 메뉴를 눌렀을 때는 아무 일도 일어나지 않습니다. 함수를 “나중에 불러 달라”고 맡길 때는 <code>func_open</code> 처럼 이름만 씁니다.' },
          { type: 'callout', kind: 'more', title: '📘 [프로그램 종료] 를 더 부드럽게', html: '<code>exit()</code> 는 파이썬 프로그램 전체를 끝냅니다. IDLE 이나 이 웹 강좌에서는 문제없지만, 창만 닫고 싶다면 <code>window.destroy()</code> 를 쓰는 것이 tkinter 다운 방법입니다. 아래 메뉴 연습 예제의 [종료] 항목이 그렇게 되어 있습니다.' },
          { type: 'code', title: '추가 예제. 메뉴 연습 (항목을 누르면 메시지 상자)', code: C_MENU_MINI,
            desc: '메뉴 하나에 항목 두 개만 둔 가장 작은 메뉴 프로그램입니다. [파일] → [인사하기] 를 눌러 보세요.' }
        ],
        practice: [
          {
            title: '실습 14-1. 다른 사진의 정보 출력하기', level: 1,
            desc: '<p><code>JPG/picture02.jpg</code> 와 <code>JPG/picture03.jpg</code> 를 차례로 열어 <b>파일 이름, 폭, 높이</b>를 출력하고, 폭이 높이보다 크면 “가로 사진”, 아니면 “세로 사진”이라고 출력하세요.</p>',
            hint: '파일 이름을 리스트에 넣고 <code>for</code> 로 돌면서 <code>Image.open()</code> 을 부르면 편합니다.',
            starter: "from PIL import Image\n\nfor fname in ['JPG/picture02.jpg', 'JPG/picture03.jpg'] :\n    # TODO: 사진을 열고 폭, 높이를 출력\n    # TODO: 가로 사진 / 세로 사진 판정\n    pass\n",
            solution: "from PIL import Image\n\nfor fname in ['JPG/picture02.jpg', 'JPG/picture03.jpg'] :\n    photo = Image.open(fname)\n    print(fname, photo.width, photo.height)\n    if photo.width > photo.height :\n        print('→ 가로 사진')\n    else :\n        print('→ 세로 사진')\n",
            expect: 'JPG/picture02.jpg 240 300\n→ 세로 사진\nJPG/picture03.jpg 320 200\n→ 가로 사진'
          },
          {
            title: '실습 14-2. 미니 포토샵에 [도움말] 메뉴 추가', level: 2,
            desc: '<p>Code14-01 에 <b>[도움말] → [프로그램 정보]</b> 메뉴를 추가하고, 누르면 메시지 상자에 “Pillow 로 만든 미니 포토샵 1.0” 이 나타나게 하세요.</p>',
            hint: '<code>from tkinter import messagebox</code> 를 추가하고, <code>func_about()</code> 함수를 만든 뒤 <code>helpMenu</code> 를 <code>add_cascade</code> 로 붙입니다.',
            starter: ps(1).replace('ImageOps\n', 'ImageOps\nfrom tkinter import messagebox\n').replace('window.mainloop()', '# TODO: 도움말 메뉴 만들기\nwindow.mainloop()'),
            solution: ps(1, { funcs: P_HELP_MENU_FUNCS, menu: P_HELP_MENU }).replace('ImageOps\n', 'ImageOps\nfrom tkinter import messagebox\n')
          }
        ],
        quiz: [
          { q: '내 PC 의 파이썬에 Pillow 를 설치하는 명령으로 알맞은 것은?', options: ['<code>pip install pillow</code>', '<code>import pillow</code>', '<code>python install PIL</code>', '<code>pip import pillow</code>'], answer: 0,
            explain: '외부 라이브러리는 명령 프롬프트에서 <code>pip install 이름</code> 으로 설치합니다. 코드 안에서는 <code>from PIL import Image</code> 처럼 <code>PIL</code> 이라는 이름으로 불러 씁니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>from PIL import Image\nimg = Image.new(\'RGB\', (4, 3), (0, 0, 0))\nprint(img.size, img.width)</code></pre>', options: ['(4, 3) 4', '(3, 4) 3', '(4, 3) 3', '12 4'], answer: 0,
            explain: '<code>size</code> 는 (폭, 높이) 순서의 튜플이고 <code>width</code> 는 폭입니다.' },
          { q: '메뉴 막대에 펼쳐지는 <b>상위 메뉴</b>(예: [파일])를 다는 메서드는?', options: ['<code>add_command()</code>', '<code>add_cascade()</code>', '<code>add_separator()</code>', '<code>config()</code>'], answer: 1,
            explain: '<code>add_cascade(label=…, menu=하위메뉴)</code> 로 상위 메뉴를 달고, 그 안의 항목은 <code>add_command()</code> 로 추가합니다.' },
          { q: 'Code14-01 에서 대부분의 함수 내용을 <code>pass</code> 로 둔 이유로 가장 알맞은 것은?', options: ['pass 가 있어야 메뉴가 빨라지기 때문', '함수 내용을 나중에 채우더라도 지금 당장 실행되는 뼈대를 만들기 위해', 'pass 는 함수를 지우는 명령이라서', '전역 변수를 만들기 위해'], answer: 1,
            explain: '함수 몸체가 비어 있으면 문법 오류이므로 “아무것도 하지 않음” 을 뜻하는 <code>pass</code> 를 넣어 두고, 기능을 하나씩 채워 갑니다.' },
          { q: '<code>fileMenu.add_command(label = "파일 열기", command = func_open())</code> 처럼 쓰면 어떻게 될까?', options: ['정상적으로 동작한다', '메뉴를 만들 때 func_open 이 바로 실행되고, 메뉴를 눌러도 아무 일도 일어나지 않는다', '메뉴가 두 번 만들어진다', '문법 오류가 난다'], answer: 1,
            explain: '괄호를 붙이면 그 자리에서 함수가 호출되고 반환값(None)이 command 로 연결됩니다. 함수 이름만 넘겨야 합니다.' }
        ],
        slides: [
          { layout: 'title', title: '미니 프로젝트', subtitle: 'Chapter 14 · 14-1 미니 포토샵 준비 — Pillow 와 메뉴 뼈대', badge: '14-1',
            notes: '<p>마지막 장입니다. 지금까지 배운 것을 모두 써서 “진짜 프로그램” 두 개를 만든다고 동기를 줍니다. 완성된 미니 포토샵과 슈팅 게임을 먼저 실행해 보여 주면 효과가 큽니다(14-3, 14-5 의 완성 코드).</p><p>시간: 2분</p>' },
          { layout: 'table', title: '이 장에서 만들 두 프로그램', head: ['프로젝트', '내용', '라이브러리'], rows: [
            ['미니 포토샵', '사진 열기 · 확대 · 반전 · 회전 · 밝기 · 필터 · 흑백 · 저장', 'tkinter + <b>Pillow</b>'],
            ['우주괴물 무찌르기', '방향키로 우주선 이동 · 미사일 발사 · 점수', '<b>pygame</b>']
          ], lead: '둘 다 파이썬에 기본으로 없는 <b>외부 라이브러리</b>를 씁니다',
            notes: '<p>포토샵 같은 프로그램을 영상 처리 프로그램이라고 부른다는 점, 영상 처리는 대학에서 따로 배우는 분야라는 점을 짧게 소개합니다. 이론보다 “라이브러리를 빌려 쓰는 법” 이 오늘의 핵심.</p>' },
          { layout: 'bullets', title: '외부 라이브러리와 pip', bullets: [
            '표준 라이브러리: 설치하면 함께 오는 모듈 (random, tkinter …)',
            '외부 라이브러리: 다른 개발자가 PyPI 에 올린 것 → <b>설치 필요</b>',
            ['설치 명령', ['<code>pip install pillow</code>', '<code>pip install pygame</code>']],
            '이 웹 강좌: Pillow · pygame 이 <mark>이미 준비됨</mark> → 바로 import',
            '설치 이름 <code>pillow</code> ↔ 코드 이름 <code>PIL</code>'
          ], notes: '<p>교재의 PowerShell 화면(pip install pillow → Successfully installed)을 설명합니다. pip 이 인식되지 않는 오류는 PATH 문제이며 <code>py -m pip</code> 로 해결할 수 있다고 알려 줍니다.</p><p>발문: “표준 라이브러리 중 우리가 써 본 것은?” (turtle, random, tkinter, sqlite3 …)</p>' },
          { layout: 'code', title: 'Pillow 로 사진 정보 보기', code: C_PIL_INFO, points: ['<code>Image.open()</code> → 이미지 객체', '<code>size</code> = (폭, 높이)', '<code>mode</code>: RGB 컬러 / L 흑백', '사진은 작업 폴더 <code>JPG/</code> 에 있음'],
            notes: '<p>직접 실행해 결과를 보여 줍니다. 다른 사진(picture02~04)으로 바꿔 보게 합니다.</p>' },
          { layout: 'code', title: '픽셀: 사진은 점들의 바둑판', code: C_PIL_PIXEL, points: ['왼쪽 위가 <code>(0, 0)</code>', '<code>getpixel((x, y))</code> → (R, G, B)', '<code>putpixel</code> 로 점 색 바꾸기'],
            notes: '<p>좌표가 튜플 하나로 들어가기 때문에 괄호가 두 겹이라는 점을 강조합니다. 이 개념은 Code14-02 의 displayImage 를 이해하는 데 꼭 필요합니다.</p>' },
          { layout: 'code', title: 'Pillow 이미지를 창에 보여 주기', code: C_PIL_SHOW, points: ['<code>ImageTk.PhotoImage(이미지)</code>', 'Label · Canvas 에 붙일 수 있다', '흑백 처리도 한 줄'],
            notes: '<p>미니 포토샵의 핵심 구조(Pillow 로 가공 → tkinter 로 표시)를 미리 맛보는 예제입니다. 이미지 변수를 지역 변수로만 두면 사라질 수 있다는 주의점도 함께 말합니다.</p>' },
          { layout: 'diagram', title: '미니 포토샵 메뉴 구성도', html: SVG_MENU, caption: '메뉴 항목 하나 = 함수 하나',
            notes: '<p>구성도를 보고 필요한 함수 목록을 학생들과 함께 뽑아 봅니다(13개 + displayImage). 큰 프로그램은 목록부터 만든다는 습관을 강조합니다.</p>' },
          { layout: 'two', title: 'Code14-01 의 세 부분', left: { title: '함수 선언 부분', code: psStub('func_open', 2) + '\n' + PS_IMPL.func_exit, run: false }, right: { title: '메인 코드 부분 (일부)', code: 'fileMenu = Menu(mainMenu)\nmainMenu.add_cascade(label = "파일", menu = fileMenu)\nfileMenu.add_command(label = "파일 열기", command = func_open)\nfileMenu.add_separator()', run: false },
            notes: '<p>함수는 pass 로 비워 두고 이름만 정했다는 점, 메뉴에는 함수 이름만(괄호 없이) 넘긴다는 점을 짚습니다. 전역 변수 7개의 역할도 여기서 소개합니다: window, canvas, paper, photo, photo2, oriX, oriY.</p>' },
          { layout: 'code', title: '메뉴 연습: 가장 작은 메뉴', code: C_MENU_MINI, points: ['<code>Menu(window)</code> → 메뉴 막대', '<code>add_cascade</code> → 상위 메뉴', '<code>add_command</code> → 항목', '<code>add_separator</code> → 구분선'],
            notes: '<p>Code14-01 전체는 길기 때문에 이 작은 예제로 메뉴 만드는 법을 먼저 익히고, 학생 화면에서 Code14-01 을 실행해 세 메뉴가 모두 뜨는지 확인시킵니다. 강의자료의 func_clear/func_unclear 오타도 여기서 언급.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '상위 메뉴 [파일] 을 메뉴 막대에 다는 메서드는?', options: ['add_command', 'add_cascade', 'add_separator', 'geometry'], answer: 1,
            explain: 'add_cascade 로 상위 메뉴, add_command 로 그 안의 항목을 추가합니다.', notes: '<p>손을 들어 답하게 한 뒤 정답을 공개합니다.</p>' },
          { layout: 'practice', title: '실습 14-2. [도움말] 메뉴 추가', desc: 'Code14-01 에 [도움말] → [프로그램 정보] 메뉴를 추가하고 메시지 상자를 띄우기',
            starter: C_MENU_MINI.replace('fileMenu.add_separator()\n', '# TODO: 도움말 메뉴\nfileMenu.add_separator()\n'),
            solution: C_MENU_MINI.replace('window.mainloop()', 'helpMenu = Menu(mainMenu)\nmainMenu.add_cascade(label = "도움말", menu = helpMenu)\nhelpMenu.add_command(label = "프로그램 정보", command = func_hello)\n\nwindow.mainloop()'),
            notes: '<p>슬라이드에서는 짧은 메뉴 예제로 풀이를 보여 주고, 학생들은 본문의 Code14-01 에 직접 추가하게 합니다. 8분.</p>' },
          { layout: 'summary', title: '정리', bullets: ['외부 라이브러리는 <code>pip install</code> 로 설치 (웹 강좌는 준비됨)', 'Pillow: <code>Image.open</code> · <code>size</code> · <code>getpixel</code>', '<code>ImageTk.PhotoImage</code> 로 창에 표시', '구성도 → 빈 함수(pass) 뼈대 → 하나씩 채우기', '메뉴: Menu · add_cascade · add_command · add_separator'],
            notes: '<p>다음 시간에는 뼈대의 displayImage · func_open · func_save 를 채워 사진을 실제로 열고 저장합니다.</p>' }
        ]
      },

      /* ============================================================ 14-2 */
      {
        id: 'ch14-2',
        title: '미니 포토샵: 이미지 열기 · 화면 출력 · 저장',
        minutes: 50,
        goals: [
          '원본 이미지(photo)와 결과 이미지(photo2)를 나누어 쓰는 이유를 설명할 수 있다',
          'displayImage() 가 픽셀 색을 문자열로 바꿔 캔버스에 그리는 과정을 설명할 수 있다',
          'askopenfilename 과 Image.open 으로 사진 파일을 열 수 있다 (Code14-02)',
          'asksaveasfile 과 save 로 처리한 이미지를 파일로 저장할 수 있다 (Code14-03)'
        ],
        flow: [['복습 · 기본 구조(그림 14-6)', 7], ['displayImage 원리', 15], ['func_open · 실행', 13], ['func_save · 저장 형식', 8], ['퀴즈 · 실습', 7]],
        content: [
          { type: 'h', text: '이미지를 처리하고 화면에 출력하는 기본 구조' },
          { type: 'p', html: '미니 포토샵은 이미지를 두 개 가지고 다닙니다. 파일에서 읽은 <b>원본 이미지 <code>photo</code></b> 와, 원본을 복사해 가공한 <b>결과 이미지 <code>photo2</code></b> 입니다. 메뉴를 누를 때마다 <mark>원본의 복사본(photo.copy())을 새로 만들어 가공</mark>하고, 그 결과를 <code>displayImage()</code> 로 화면에 그립니다.' },
          { type: 'figure', html: SVG_STRUCT, caption: '그림 14-6 이미지를 처리하고 화면에 출력하는 기본 구조' },
          { type: 'callout', kind: 'info', title: '왜 원본을 따로 남겨 둘까?', html: '결과 이미지를 계속 가공하면 축소 → 확대를 할 때 이미 줄어든 작은 사진을 키우게 되어 흐릿해집니다. 원본을 그대로 두면 어떤 처리를 해도 <b>항상 깨끗한 원본에서 다시 시작</b>할 수 있습니다. (그 대신 이 프로그램에서는 처리 효과가 누적되지 않습니다 — 예를 들어 “회전 후 흑백” 은 흑백만 적용됩니다.)' },

          { type: 'h', text: 'displayImage() — 이미지를 캔버스에 그리기' },
          { type: 'p', html: 'tkinter 의 <code>PhotoImage(width=폭, height=높이)</code> 는 빈 도화지 같은 이미지를 만들고, <code>put(색 문자열)</code> 으로 여러 점의 색을 한꺼번에 칠할 수 있습니다. 색 문자열은 <b>한 줄의 점 색을 중괄호 <code>{ }</code> 로 묶고, 줄을 이어 붙인</b> 모양입니다.' },
          { type: 'figure', html: SVG_RGBSTR, caption: 'Pillow 이미지의 점 색 → tkinter 의 색 문자열' },
          { type: 'code', title: '추가 예제. 색 문자열이 만들어지는 모습 (3×2 그림)', code: C_RGBSTR,
            expect: '{#ff0000 #00ff00 #ff0000 } {#ff0000 #ff0000 #0000ff }',
            desc: '바깥 반복(<code>i</code>)이 줄(행, y), 안쪽 반복(<code>k</code>)이 칸(열, x)입니다. <code>getpixel((k, i))</code> 의 순서가 (x, y) 라서 <code>(k, i)</code> 로 쓴다는 점에 주의하세요.' },
          { type: 'p', html: '<code>"#%02x%02x%02x " % (r, g, b)</code> 는 0~255 의 숫자 세 개를 <b>두 자리 16진수</b>로 바꿔 <code>#ff0010</code> 같은 색 코드로 만듭니다. <code>%02x</code> 는 “16진수(x)로, 두 자리(2), 빈자리는 0으로 채움(0)” 이라는 뜻입니다.' },
          { type: 'code', title: '추가 예제. %02x 서식 연습', code: C_HEX, expect: '#ff0010\n#123456\nff 05 AB' },
          { type: 'p', html: '이제 Code14-01 의 7행 <code>displayImage()</code> 를 다음과 같이 바꿉니다. 매개변수로 <b>보여 줄 이미지와 폭 · 높이</b>를 받습니다.' },
          { type: 'code', run: false, title: 'Code14-02 (1). displayImage() 함수', code: PS_IMPL.displayImage,
            desc: '<code>4행</code> 창 크기를 이미지 크기에 맞춥니다. <code>5~6행</code> 이전 캔버스가 있으면 없애고 <code>8행</code> 새로 만듭니다. <code>9~10행</code> 빈 이미지 <code>paper</code> 를 만들어 캔버스 가운데에 올립니다. <code>11~18행</code> 모든 점의 색을 문자열로 만들고 <code>19행</code> <code>put()</code> 으로 한 번에 칠한 뒤 <code>20행</code> 캔버스를 창에 붙입니다. <code>12행</code> 의 <code>convert(\'RGB\')</code> 는 흑백(L) 이미지도 (r, g, b) 세 값으로 읽을 수 있게 해 줍니다.' },

          { type: 'h', text: 'func_open() — 파일 열기' },
          { type: 'code', run: false, title: 'Code14-02 (2). func_open() 함수', code: PS_IMPL.func_open,
            desc: '<code>3행</code> 파일 열기 대화상자에서 고른 파일 경로를 받습니다. <code>6행</code> Pillow 로 열어 RGB 로 바꾼 것을 원본 <code>photo</code> 에, <code>7~8행</code> 원본의 폭 · 높이를 <code>oriX, oriY</code> 에 저장합니다. <code>10행</code> 원본을 복사해 <code>photo2</code> 를 만들고 <code>13행</code> 화면에 출력합니다.' },
          { type: 'callout', kind: 'info', title: '강의자료와 달라진 점', html: '<ul><li>파일 종류(filetypes)의 패턴을 <code>"*.jpg; *.jpeg; …"</code> 대신 <b>공백으로 구분</b>한 <code>"*.jpg *.jpeg …"</code> 로 썼습니다. tkinter 는 공백으로 구분한 목록을 표준으로 받습니다(윈도·맥·리눅스 공통).</li><li>대화상자에서 [취소] 를 누르면 빈 문자열 <code>""</code> 이 돌아와 <code>Image.open("")</code> 에서 오류가 나므로, 4~5행에 <code>return</code> 을 넣었습니다.</li></ul>' },
          { type: 'p', html: '두 함수를 Code14-01 에 넣은 완성 코드는 다음과 같습니다. ▶ 실행한 뒤 <b>[파일] → [파일 열기]</b> 에서 <code>JPG/picture02.jpg</code> 를 골라 보세요. 창이 사진 크기로 바뀌며 사진이 나타납니다.' },
          { type: 'code', title: 'Code14-02. 이미지 열기와 화면 출력 (전체 코드)', code: ps(2),
            desc: '아직 [파일 열기] 와 [프로그램 종료] 만 동작하고, 나머지 메뉴는 눌러도 아무 일도 일어나지 않습니다(pass).' },
          { type: 'callout', kind: 'warn', title: '사진이 나타나기까지 시간이 걸려요', html: 'displayImage() 는 점 하나하나를 반복문으로 문자열로 바꾸므로, 320×240 사진이면 점이 76,800개나 됩니다. 브라우저 안의 파이썬에서는 1~2초 정도 걸릴 수 있습니다. 14-3 에서 <code>ImageTk.PhotoImage</code> 로 한 번에 바꾸는 <b>빠른 방법</b>도 소개합니다.' },

          { type: 'h', text: 'func_save() — 이미지 저장 (Code14-03)' },
          { type: 'p', html: '처리한 결과 <code>photo2</code> 를 파일로 저장합니다. <code>asksaveasfile()</code> 은 저장할 파일을 고르게 한 뒤 <b>파일 객체</b>를 돌려주는데, 우리는 그 파일의 이름(<code>.name</code>)만 꺼내서 Pillow 의 <code>save()</code> 에 넘깁니다.' },
          { type: 'code', run: false, title: 'Code14-03. func_save() 함수', code: PS_IMPL.func_save,
            desc: '<code>4~5행</code> 아직 사진을 열지 않았다면(<code>photo2 == None</code>) 저장하지 않습니다. <code>6~7행</code> 기본 확장자를 <code>.jpg</code> 로 한 저장 대화상자를 띄웁니다. <code>10행</code> 파일 이름의 확장자를 보고 Pillow 가 알맞은 형식으로 저장합니다. (<code>8~9행</code> 의 [취소] 처리는 강의자료에 없는 부분을 보충했습니다.)' },
          { type: 'code', title: 'Code14-03. 이미지 저장 (전체 코드)', code: ps(3),
            desc: '[파일 열기] 로 사진을 연 뒤 [파일 저장] 에서 <code>my_photo.jpg</code> 처럼 이름을 입력해 저장해 보세요. 저장한 파일은 작업 폴더에 생기며 다시 [파일 열기] 로 열 수 있습니다.' },
          { type: 'p', html: '저장 형식은 확장자로 정해집니다. 대화상자 없이 Pillow 만으로 저장해 보면 다음과 같습니다.' },
          { type: 'code', title: '추가 예제. 확장자에 따라 다른 형식으로 저장하기', code: C_SAVE_DEMO,
            expect: 'PNG (260, 260)\nJPEG (260, 260)' },
          { type: 'callout', kind: 'more', title: '📘 JPG 와 PNG 의 차이', html: '<b>JPG(JPEG)</b> 는 사람 눈에 잘 띄지 않는 정보를 버려서 파일을 작게 만드는 <b>손실 압축</b>입니다. 사진에 알맞지만 저장할 때마다 조금씩 화질이 떨어집니다. <b>PNG</b> 는 정보를 버리지 않는 <b>무손실 압축</b>이고 투명한 부분(알파)도 저장할 수 있어 그림 · 아이콘 · 게임 캐릭터에 알맞습니다. 슈팅 게임의 우주선과 괴물 그림이 PNG 인 이유입니다. 참고로 JPG 는 투명(RGBA)을 저장할 수 없어 RGBA 이미지를 .jpg 로 저장하면 오류가 나는데, 미니 포토샵은 열 때 <code>convert(\'RGB\')</code> 를 하므로 괜찮습니다.' }
        ],
        practice: [
          {
            title: '실습 14-3. 프로그램을 시작하자마자 사진 열기', level: 2,
            desc: '<p>Code14-02 를 고쳐서, 프로그램이 시작되면 메뉴를 누르지 않아도 <b>파일 열기 대화상자가 바로 뜨도록</b> 하세요. (<code>window.mainloop()</code> 바로 앞에서 함수를 한 번 부르면 됩니다.)</p>',
            hint: '메뉴가 부르는 함수도 평범한 함수입니다. <code>func_open()</code> 을 직접 호출하세요.',
            starter: ps(2).replace('window.mainloop()', '# TODO: 시작하자마자 파일 열기\nwindow.mainloop()'),
            solution: ps(2, { menu: 'func_open()      # 시작하자마자 파일 열기\n' }),
            dialogs: ['JPG/picture02.jpg']
          },
          {
            title: '실습 14-4. 사진 정보 한 줄 요약', level: 1,
            desc: '<p><code>JPG/picture01.jpg</code> 를 열어 폭 · 높이 · 전체 점(픽셀) 수를 출력하고, 복사본을 <code>small.png</code> 로 저장한 뒤 다시 열어 형식을 출력하세요.</p><p>출력 예: <code>320 x 240 = 76800 점</code> / <code>PNG</code></p>',
            hint: '점의 수는 폭 × 높이입니다. 저장 형식은 확장자로 정해집니다.',
            starter: "from PIL import Image\n\nphoto = Image.open('JPG/picture01.jpg')\n# TODO: 폭 x 높이 = 점의 수 출력\n# TODO: 복사본을 small.png 로 저장하고 다시 열어 format 출력\n",
            solution: "from PIL import Image\n\nphoto = Image.open('JPG/picture01.jpg')\nprint(photo.width, 'x', photo.height, '=', photo.width * photo.height, '점')\nphoto2 = photo.copy()\nphoto2.save('small.png')\nprint(Image.open('small.png').format)\n",
            expect: '320 x 240 = 76800 점\nPNG'
          }
        ],
        quiz: [
          { q: '다음 코드의 실행 결과는?<pre><code>print("#%02x%02x%02x" % (0, 128, 255))</code></pre>', options: ['#0080ff', '#00128255', '#080ff', '#0x80xff'], answer: 0,
            explain: '0 → 00, 128 → 80, 255 → ff. <code>%02x</code> 는 두 자리 16진수입니다.' },
          { q: 'displayImage() 에서 <code>rgbImage.getpixel((k, i))</code> 의 k 와 i 는 각각 무엇인가?', options: ['k = x 좌표(열), i = y 좌표(행)', 'k = y 좌표, i = x 좌표', 'k = 빨강, i = 초록', 'k = 폭, i = 높이'], answer: 0,
            explain: '바깥 반복 i 가 행(높이 방향), 안쪽 반복 k 가 열(폭 방향)이고 getpixel 은 (x, y) 순서로 받으므로 (k, i) 입니다.' },
          { q: '미니 포토샵이 원본 <code>photo</code> 와 결과 <code>photo2</code> 를 따로 두는 가장 큰 이유는?', options: ['메모리를 아끼려고', '처리할 때마다 깨끗한 원본에서 다시 시작하기 위해', 'tkinter 가 이미지를 두 개 요구해서', '저장 기능이 photo 만 저장할 수 있어서'], answer: 1,
            explain: '결과를 계속 가공하면 화질이 떨어지거나 되돌릴 수 없습니다. 원본은 두고 복사본을 가공합니다.' },
          { q: 'Code14-03 의 <code>saveFp = asksaveasfile(…)</code> 에서 <code>saveFp.name</code> 은?', options: ['선택한 파일의 경로(이름) 문자열', '이미지의 폭', '파일의 내용', '대화상자의 제목'], answer: 0,
            explain: 'asksaveasfile 은 파일 객체를 돌려주고 <code>.name</code> 에 경로가 들어 있습니다. Pillow 의 save() 에 이 경로를 넘깁니다.' },
          { q: '파일 열기 대화상자에서 [취소] 를 누르면 askopenfilename() 은 무엇을 돌려주는가?', options: ['빈 문자열 ""', '0', '"취소"', '오류가 난다'], answer: 0,
            explain: '빈 문자열이 돌아오므로 이 경우 Image.open 을 부르지 말고 return 하는 것이 안전합니다.' }
        ],
        slides: [
          { layout: 'title', title: '이미지 열기 · 화면 출력 · 저장', subtitle: 'Chapter 14 · 14-2 — Code14-02 · Code14-03', badge: '14-2',
            notes: '<p>지난 시간의 뼈대(Code14-01)를 띄워 놓고, 오늘은 빈 함수 세 개(displayImage, func_open, func_save)를 채운다고 안내합니다.</p>' },
          { layout: 'diagram', title: '기본 구조: 원본과 결과', html: SVG_STRUCT, caption: '원본(photo)은 그대로, 복사본(photo2)을 가공해서 출력',
            notes: '<p>그림 14-6. 모든 처리 함수가 “photo2 = photo.copy() → 가공 → displayImage(photo2, …)” 라는 같은 모양이 된다는 것을 미리 예고합니다.</p><p>발문: “축소한 사진을 다시 확대하면 어떻게 될까?”</p>' },
          { layout: 'diagram', title: 'displayImage 의 원리', html: SVG_RGBSTR,
            notes: '<p>tkinter PhotoImage 의 put() 은 “{한 줄의 색들} {다음 줄} …” 모양의 문자열을 받는다는 점을 설명합니다. 점이 많으면 느리다는 점도 미리 말해 둡니다.</p>' },
          { layout: 'code', title: '색 문자열 만들기 (3×2 그림)', code: C_RGBSTR, points: ['바깥 i = 행(y), 안쪽 k = 열(x)', '<code>getpixel((k, i))</code>', '<code>%02x</code> = 두 자리 16진수'],
            notes: '<p>실행 결과를 칠판에 적고 그림과 대응시켜 봅니다. 교재 17 · 18행 주석의 “x 뒤에 한 칸 공백, } 뒤에 한 칸 공백” 이 왜 필요한지(색끼리, 줄끼리 구분) 묻습니다.</p>' },
          { layout: 'code', title: 'Code14-02 (1) displayImage()', code: PS_IMPL.displayImage, run: false, points: ['창 크기를 이미지에 맞춤', '캔버스를 새로 만들고', '빈 PhotoImage 에 put()', 'convert(\'RGB\') 로 흑백도 처리'],
            notes: '<p>4~10행은 “도화지 준비”, 11~19행은 “점 칠하기”, 20행은 “창에 붙이기” 로 세 덩어리로 나눠 설명합니다. global 선언이 필요한 이유(canvas, paper 를 함수 밖에서도 유지)를 짚습니다.</p>' },
          { layout: 'code', title: 'Code14-02 (2) func_open()', code: PS_IMPL.func_open, run: false, points: ['대화상자로 경로 받기', '<code>Image.open(경로).convert(\'RGB\')</code>', 'oriX, oriY = 원본 크기', 'photo2 = photo.copy()'],
            notes: '<p>filetypes 패턴은 공백으로 구분하는 것이 표준이라 교재와 조금 다르게 썼다고 알려 줍니다. [취소] 처리 2줄도 보충했습니다. 학생 화면에서 Code14-02 전체를 실행해 picture02.jpg 를 열게 합니다.</p>' },
          { layout: 'code', title: 'Code14-03 func_save()', code: PS_IMPL.func_save, run: false, points: ['열린 사진이 없으면 return', 'asksaveasfile → 파일 객체', '<code>photo2.save(saveFp.name)</code>', '확장자로 형식 결정'],
            notes: '<p>저장 후 다시 [파일 열기] 로 열어 확인하게 합니다. JPG/PNG 차이(손실/무손실, 투명)를 짧게 설명합니다.</p>' },
          { layout: 'code', title: '저장 형식 확인하기', code: C_SAVE_DEMO, points: ['.png → PNG', '.jpg → JPEG', 'quality 로 JPG 화질'],
            notes: '<p>대화상자 없이 save 만 따로 실험해 봅니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>"#%02x%02x%02x" % (0, 128, 255)</code> 의 결과는?', options: ['#0080ff', '#00128255', '#080ff', '#ff8000'], answer: 0,
            explain: '0→00, 128→80, 255→ff', notes: '<p>16진수를 처음 보는 학생이 있으면 128 = 8×16 이라서 80 이라고 풀어 줍니다.</p>' },
          { layout: 'practice', title: '실습 14-4. 사진 정보 한 줄 요약', desc: 'picture01.jpg 의 폭 × 높이 = 점의 수를 출력하고 small.png 로 저장 후 형식 확인',
            starter: "from PIL import Image\n\nphoto = Image.open('JPG/picture01.jpg')\n# TODO\n",
            solution: "from PIL import Image\n\nphoto = Image.open('JPG/picture01.jpg')\nprint(photo.width, 'x', photo.height, '=', photo.width * photo.height, '점')\nphoto2 = photo.copy()\nphoto2.save('small.png')\nprint(Image.open('small.png').format)\n",
            notes: '<p>실습 14-3(시작하자마자 열기)은 본문에서 각자 하도록 안내합니다. 7분.</p>' },
          { layout: 'summary', title: '정리', bullets: ['원본 <code>photo</code> · 결과 <code>photo2</code> 를 나눈다', 'displayImage: 점 색 → <code>{#rrggbb …}</code> 문자열 → <code>put()</code>', 'func_open: askopenfilename → Image.open → copy → 출력', 'func_save: asksaveasfile → <code>photo2.save(이름)</code>', '[취소] 하면 빈 값 → return 으로 대비'],
            notes: '<p>다음 시간: 확대 · 축소 · 반전 · 회전 · 밝기 · 필터 · 흑백을 모두 채워 미니 포토샵을 완성합니다.</p>' }
        ]
      },

      /* ============================================================ 14-3 */
      {
        id: 'ch14-3',
        title: '미니 포토샵: 이미지 처리 기능과 완성',
        minutes: 50,
        goals: [
          'resize 로 이미지를 확대 · 축소하고 askinteger 로 배율을 입력받을 수 있다 (Code14-04)',
          'transpose 와 rotate 로 이미지를 반전 · 회전할 수 있다 (Code14-05, 06)',
          'ImageEnhance.Brightness 로 밝기를 조절할 수 있다 (Code14-07)',
          'ImageFilter 와 ImageOps 로 블러 · 엠보싱 · 흑백 효과를 줄 수 있다 (Code14-08, 09)',
          '모든 처리 함수가 같은 틀(복사 → 가공 → 출력)을 가진다는 것을 설명할 수 있다'
        ],
        flow: [['처리 함수의 공통 틀', 5], ['확대 · 축소 · 반전 · 회전', 15], ['밝기 · 필터 · 흑백', 12], ['완성 코드 실행 · 빠른 출력', 10], ['퀴즈 · 실습', 8]],
        content: [
          { type: 'h', text: '처리 함수의 공통 틀' },
          { type: 'p', html: '이제부터 만드는 처리 함수는 모두 <b>같은 모양</b>입니다. 다른 곳은 가운데의 <mark>가공하는 한 줄</mark>(과 필요하면 값을 묻는 대화상자 한 줄)뿐입니다.' },
          { type: 'code', run: false, title: '처리 함수의 틀', code: 'def func_처리() :\n    global window, canvas, paper, photo, photo2, oriX, oriY\n    (필요하면) 값 = askinteger(…) 또는 askfloat(…)\n    photo2 = photo.copy()           # ① 원본 복사\n    photo2 = photo2.가공(…)          # ② 가공 (함수마다 다른 곳)\n    newX = photo2.width             # ③ 결과 크기\n    newY = photo2.height\n    displayImage(photo2, newX, newY)   # ④ 화면 출력' },
          { type: 'table', head: ['메뉴', '가공하는 줄', 'Pillow 모듈'], rows: [
            ['확대 / 축소', '<code>photo2.resize((새폭, 새높이))</code>', 'Image'],
            ['상하 / 좌우 반전', '<code>photo2.transpose(Image.FLIP_TOP_BOTTOM)</code> / <code>FLIP_LEFT_RIGHT</code>', 'Image'],
            ['회전', '<code>photo2.rotate(각도, expand=True)</code>', 'Image'],
            ['밝게 / 어둡게', '<code>ImageEnhance.Brightness(photo2).enhance(값)</code>', 'ImageEnhance'],
            ['블러링 / 엠보싱', '<code>photo2.filter(ImageFilter.BLUR)</code> / <code>EMBOSS</code>', 'ImageFilter'],
            ['흑백이미지', '<code>ImageOps.grayscale(photo2)</code>', 'ImageOps']
          ] },
          { type: 'p', html: '먼저 대화상자 없이 Pillow 만으로 각 처리의 결과 크기를 확인해 봅시다.' },
          { type: 'code', title: '추가 예제. 처리 결과 한눈에 보기 (Pillow 만 사용)', code: C_PROC_ALL,
            expect: '원본       : (320, 200)\n2배 확대   : (640, 400)\n1/4 축소   : (80, 50)\n상하 반전  : (320, 200)\n90도 회전  : (200, 320)\n45도 회전  : (368, 368)\n흑백       : (320, 200) L',
            desc: '45도로 돌리면 사진의 모서리가 삐져나오므로 <code>expand=True</code> 는 캔버스를 (368, 368) 으로 넓혀 줍니다. 넓어진 빈 곳은 검은색으로 채워집니다.' },

          { type: 'h', text: '이미지 확대 및 축소 (Code14-04)' },
          { type: 'code', run: false, title: 'Code14-04. func_zoomin() · func_zoomout()', code: PS_IMPL.func_zoomin + '\n' + PS_IMPL.func_zoomout,
            desc: '<code>3행</code> <code>askinteger(제목, 안내문, minvalue, maxvalue)</code> 는 정수를 입력받는 대화상자로, 2~4 범위만 받아들입니다. <code>5행</code> 원본 크기 <code>oriX, oriY</code> 에 배율을 곱한(축소는 나눈) 크기로 <code>resize()</code> 합니다. 크기는 정수여야 하므로 <code>int()</code> 로 감쌌습니다.' },
          { type: 'callout', kind: 'warn', title: '확대는 천천히', html: '4배로 확대하면 320×240 사진이 1280×960 이 되어 점이 120만 개가 넘습니다. 점 하나씩 문자열로 바꾸는 displayImage() 로는 브라우저에서 10초 이상 걸릴 수 있으니, 처음에는 <b>작은 사진(picture03)을 2배</b>로 해 보세요. 아래의 “빠른 displayImage” 를 쓰면 훨씬 빠릅니다.' },

          { type: 'h', text: '이미지 상하 및 좌우 반전 (Code14-05)' },
          { type: 'code', run: false, title: 'Code14-05. func_mirror1() · func_mirror2()', code: PS_IMPL.func_mirror1 + '\n' + PS_IMPL.func_mirror2,
            desc: '<code>transpose()</code> 는 이미지를 뒤집거나 90도 단위로 돌립니다. <code>FLIP_TOP_BOTTOM</code> 은 위아래(거꾸로 매달린 모습), <code>FLIP_LEFT_RIGHT</code> 는 좌우(거울에 비친 모습)를 바꿉니다.' },
          { type: 'callout', kind: 'more', title: '📘 transpose 의 다른 값', html: '<code>Image.ROTATE_90</code>, <code>Image.ROTATE_180</code>, <code>Image.ROTATE_270</code>(반시계 방향 회전), <code>Image.TRANSPOSE</code>(대각선 뒤집기)도 있습니다. 최신 Pillow 에서는 <code>Image.Transpose.FLIP_LEFT_RIGHT</code> 처럼 <code>Transpose</code> 안의 이름으로도 쓸 수 있습니다.' },

          { type: 'h', text: '이미지 회전 (Code14-06)' },
          { type: 'code', run: false, title: 'Code14-06. func_rotate()', code: PS_IMPL.func_rotate,
            desc: '<code>rotate(각도)</code> 는 <b>반시계 방향</b>으로 돌립니다. <code>expand=True</code> 를 주면 돌아간 그림이 잘리지 않도록 결과 이미지를 넓혀 줍니다.' },
          { type: 'code', title: '추가 예제. expand 가 있을 때와 없을 때', code: C_ROTATE_MINI, expect: '(320, 240)\n(320, 240)\n(240, 320)' },

          { type: 'h', text: '이미지 밝게 · 어둡게 (Code14-07)' },
          { type: 'code', run: false, title: 'Code14-07. func_bright() · func_dark()', code: PS_IMPL.func_bright + '\n' + PS_IMPL.func_dark,
            desc: '<code>askfloat()</code> 는 실수를 입력받습니다. <code>ImageEnhance.Brightness(이미지)</code> 로 밝기 조절 도구를 만들고 <code>enhance(값)</code> 을 부르면, <b>1.0 이 원래 밝기</b>, 1.0 보다 크면 밝게, 작으면 어둡게(0.0 은 완전히 검정) 됩니다.' },
          { type: 'code', title: '추가 예제. 밝기 값이 점의 색을 바꾸는 방법', code: C_ENHANCE,
            expect: '원본   : (100, 50, 20)\n2.0배  : (200, 100, 40)\n0.5배  : (50, 25, 10)\n1.0배  : (100, 50, 20)\n빨강 → 흑백 : 76',
            desc: '밝기 조절은 R, G, B 에 같은 배율을 곱하는 것입니다(255 를 넘으면 255). 흑백 변환은 사람 눈이 초록에 가장 민감하다는 점을 반영해 <code>R×0.299 + G×0.587 + B×0.114</code> 로 밝기 한 값을 계산합니다.' },
          { type: 'callout', kind: 'more', title: '📘 ImageEnhance 의 다른 도구', html: '<code>ImageEnhance.Contrast</code>(대비), <code>ImageEnhance.Color</code>(채도 — 0 이면 흑백), <code>ImageEnhance.Sharpness</code>(선명도)도 같은 방법(<code>도구(이미지).enhance(값)</code>)으로 씁니다.' },

          { type: 'h', text: '이미지에 특수 효과 주기 (Code14-08)' },
          { type: 'code', run: false, title: 'Code14-08. func_blur() · func_embo()', code: PS_IMPL.func_blur + '\n' + PS_IMPL.func_embo,
            desc: '<code>filter(필터)</code> 는 각 점을 <b>주변 점들과 함께 계산</b>해서 새 색을 정합니다. <code>BLUR</code> 는 주변과 평균을 내서 흐릿하게, <code>EMBOSS</code> 는 밝기 차이가 나는 경계만 도드라지게 해서 돌에 새긴 것 같은 효과를 냅니다.' },
          { type: 'code', title: '추가 예제. 원본 · 블러링 · 엠보싱 비교', code: C_FILTER_SHOW },
          { type: 'callout', kind: 'more', title: '📘 ImageFilter 의 다른 필터', html: '<code>CONTOUR</code>(윤곽선), <code>EDGE_ENHANCE</code>(경계 강조), <code>FIND_EDGES</code>(경계 찾기), <code>SHARPEN</code>(선명하게), <code>SMOOTH</code>(부드럽게), <code>GaussianBlur(반지름)</code>(강도를 정하는 흐림) 등이 있습니다.' },

          { type: 'h', text: '이미지를 흑백으로 변경 — [프로젝트 1] 의 완성 (Code14-09)' },
          { type: 'code', run: false, title: 'Code14-09. func_bw()', code: PS_IMPL.func_bw,
            desc: '<code>ImageOps.grayscale()</code> 은 컬러 이미지를 흑백(모드 L)으로 바꿉니다. displayImage() 는 12행에서 <code>convert(\'RGB\')</code> 를 하므로 흑백 이미지도 그대로 출력됩니다.' },
          { type: 'p', html: '지금까지의 함수를 모두 채운 미니 포토샵 완성 코드입니다. ▶ 실행하고 사진을 연 뒤 모든 메뉴를 차례로 눌러 보세요.' },
          { type: 'code', title: '[프로젝트 1] 완성: 미니 포토샵 (Code14-09 전체 코드)', code: ps(9),
            desc: '대화상자에 값을 넣지 않고 [취소] 를 누르면 <code>scale</code> 등이 <code>None</code> 이 되어 콘솔에 오류가 표시되지만 창은 계속 동작합니다 (tkinter 는 메뉴 함수의 오류를 출력만 하고 넘어갑니다). 실습 14-6 에서 이 부분을 고쳐 봅니다.' },

          { type: 'h', text: '더 빠르게: ImageTk 로 화면 출력하기' },
          { type: 'p', html: '<code>PIL.ImageTk.PhotoImage(이미지)</code> 는 Pillow 이미지를 <b>한 번에</b> tkinter 이미지로 바꿔 줍니다. displayImage() 의 반복문 10줄이 한 줄로 줄고, 큰 사진도 순식간에 나타납니다. 다른 함수는 하나도 고칠 필요가 없습니다. 이렇게 <mark>함수의 안쪽만 바꾸고 사용하는 쪽은 그대로 두는 것</mark>이 함수로 나누어 만든 프로그램의 장점입니다.' },
          { type: 'code', title: '추가 예제. 미니 포토샵 — 빠른 displayImage 버전', code: ps(9, { fast: true }),
            desc: '4행에 <code>ImageTk</code> 를 추가하고 displayImage() 만 바꿨습니다. 4배 확대도 바로 됩니다.' },
          { type: 'callout', kind: 'more', title: '📘 Pillow 에는 더 많은 기능이 있어요', html: '미니 포토샵에서 쓴 모듈은 Image · ImageFilter · ImageEnhance · ImageOps 뿐이지만, Pillow 에는 그림 위에 도형 · 글자를 그리는 <code>ImageDraw</code>, 두 사진을 합성하는 <code>Image.blend</code> · <code>paste</code>, 사진을 잘라 내는 <code>crop</code>, 썸네일을 만드는 <code>thumbnail</code> 등 훨씬 많은 기능이 있습니다. 공식 문서(pillow.readthedocs.io)의 Reference 를 둘러보고 나만의 메뉴를 추가해 보세요.' }
        ],
        practice: [
          {
            title: '실습 14-5. [이미지 처리(3)] 메뉴 추가 (선명하게 · 윤곽선)', level: 2,
            desc: '<p>완성된 미니 포토샵에 <b>[이미지 처리(3)]</b> 메뉴를 추가하고 <b>[선명하게]</b>(<code>ImageFilter.SHARPEN</code>), <b>[윤곽선]</b>(<code>ImageFilter.CONTOUR</code>) 항목을 넣으세요.</p>',
            hint: 'func_blur() 를 복사해 필터 이름만 바꾼 함수 두 개를 만들고, image3Menu 를 add_cascade 로 붙입니다.',
            starter: ps(9, { fast: true }).replace('window.mainloop()', '# TODO: 이미지 처리(3) 메뉴와 두 함수 추가\nwindow.mainloop()'),
            solution: ps(9, { fast: true, funcs: P_EXTRA_FUNCS, menu: P_EXTRA_MENU })
          },
          {
            title: '실습 14-6. 원본으로 되돌리기 · 취소에 대비하기', level: 3,
            desc: '<p>① [이미지 처리(1)] 메뉴 맨 아래에 <b>[원본으로]</b> 항목을 추가해, 누르면 원본 사진이 다시 보이게 하세요 (<code>func_reset</code>).<br>② 사진을 열지 않은 상태에서 [원본으로] 를 눌러도 오류가 나지 않게 하세요.</p><p>이 문제의 정답은 시험 삼아 시작하자마자 사진(<code>JPG/picture03.jpg</code>)을 열고, 좌우 반전한 뒤 원본으로 되돌립니다.</p>',
            hint: '<code>photo == None</code> 이면 return. 원본으로 되돌리기는 photo2 = photo.copy() 후 displayImage 입니다.',
            starter: ps(9, { fast: true }).replace('window.mainloop()', '# TODO: func_reset 함수와 [원본으로] 메뉴 추가\nwindow.mainloop()'),
            solution: ps(9, { fast: true, funcs: P_RESET_FUNCS,
              menu: 'image1Menu.add_separator()\nimage1Menu.add_command(label = "원본으로", command = func_reset)\n\nfunc_reset()       # 사진을 열기 전에 눌러도 오류가 없는지 확인\nfunc_open()        # 시험: 사진 열기\nfunc_mirror2()     # 좌우 반전\nfunc_reset()       # 원본으로\nprint("원본 크기 :", photo2.size)\n' }),
            dialogs: ['JPG/picture03.jpg'],
            expect: '원본 크기 : (320, 200)'
          }
        ],
        quiz: [
          { q: '원본이 320×240 일 때 func_zoomout() 에서 배율 4 를 입력하면 결과 크기는?', options: ['(80, 60)', '(1280, 960)', '(316, 236)', '(80, 240)'], answer: 0,
            explain: '<code>int(320 / 4), int(240 / 4)</code> = (80, 60) 입니다.' },
          { q: '거울에 비친 것처럼 <b>좌우</b>를 바꾸는 코드는?', options: ['<code>photo2.transpose(Image.FLIP_LEFT_RIGHT)</code>', '<code>photo2.transpose(Image.FLIP_TOP_BOTTOM)</code>', '<code>photo2.rotate(180)</code>', '<code>photo2.filter(ImageFilter.EMBOSS)</code>'], answer: 0,
            explain: 'FLIP_LEFT_RIGHT 가 좌우 반전(mirror2), FLIP_TOP_BOTTOM 이 상하 반전(mirror1)입니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>from PIL import Image, ImageEnhance\nimg = Image.new(\'RGB\', (1, 1), (40, 80, 120))\nimg = ImageEnhance.Brightness(img).enhance(1.5)\nprint(img.getpixel((0, 0)))</code></pre>', options: ['(60, 120, 180)', '(40, 80, 120)', '(41, 81, 121)', '(26, 53, 80)'], answer: 0,
            explain: '밝기 1.5배 → 각 값에 1.5 를 곱합니다.' },
          { q: '<code>photo.rotate(45, expand=True)</code> 에서 <code>expand=True</code> 의 역할은?', options: ['돌아간 그림이 잘리지 않도록 결과 크기를 넓힌다', '시계 방향으로 돌린다', '회전 후 확대한다', '회전 속도를 빠르게 한다'], answer: 0,
            explain: 'expand 가 없으면 원래 크기 안에 들어가지 않는 모서리가 잘립니다. 회전 방향은 반시계입니다.' },
          { q: '흑백 이미지로 바꾸는 코드와 그 결과의 색 모드가 바르게 짝지어진 것은?', options: ['<code>ImageOps.grayscale(img)</code> — L', '<code>ImageFilter.BLUR</code> — RGB', '<code>ImageEnhance.Brightness(img).enhance(0)</code> — L', '<code>img.transpose(Image.GRAY)</code> — 1'], answer: 0,
            explain: 'grayscale 은 밝기 한 값만 가진 모드 L 이미지를 돌려줍니다. 밝기 0 은 흑백이 아니라 완전한 검정(RGB)입니다.' }
        ],
        slides: [
          { layout: 'title', title: '이미지 처리 기능과 완성', subtitle: 'Chapter 14 · 14-3 — Code14-04 ~ Code14-09', badge: '14-3',
            notes: '<p>오늘 채울 함수 10개가 모두 같은 틀이라는 것을 먼저 보여 주면 부담이 줄어듭니다.</p>' },
          { layout: 'table', title: '처리 함수 = 같은 틀 + 한 줄', head: ['메뉴', '가공하는 줄'], rows: [
            ['확대 / 축소', '<code>resize((새폭, 새높이))</code>'],
            ['상하 / 좌우 반전', '<code>transpose(Image.FLIP_…)</code>'],
            ['회전', '<code>rotate(각도, expand=True)</code>'],
            ['밝게 / 어둡게', '<code>ImageEnhance.Brightness(…).enhance(값)</code>'],
            ['블러링 / 엠보싱', '<code>filter(ImageFilter.BLUR / EMBOSS)</code>'],
            ['흑백', '<code>ImageOps.grayscale(…)</code>']
          ], lead: 'photo.copy() → 가공 → displayImage(photo2, 폭, 높이)',
            notes: '<p>복사 → 가공 → 크기 → 출력 네 단계를 손가락으로 세며 반복시키면 학생들이 스스로 새 기능을 만들 수 있게 됩니다.</p>' },
          { layout: 'code', title: '처리 결과 한눈에 (Pillow 만)', code: C_PROC_ALL, points: ['대화상자 없이 결과 크기 확인', '90도 회전은 폭 · 높이가 바뀜', '45도는 (368, 368) 로 넓어짐'],
            notes: '<p>GUI 없이 먼저 결과를 확인하면 각 함수의 의미가 분명해집니다.</p>' },
          { layout: 'code', title: 'Code14-04 확대 · 축소', code: PS_IMPL.func_zoomin + '\n' + PS_IMPL.func_zoomout, run: false, points: ['askinteger(제목, 안내, min, max)', '원본 크기 oriX, oriY 기준', 'int() 로 정수 크기'],
            notes: '<p>원본 크기를 기준으로 하므로 “2배 확대 → 2배 확대” 를 해도 4배가 아니라 2배라는 점을 질문해 봅니다. 큰 배율은 느리다는 주의.</p>' },
          { layout: 'code', title: 'Code14-05 · 06 반전과 회전', code: PS_IMPL.func_mirror2 + '\n' + PS_IMPL.func_rotate, run: false, points: ['FLIP_LEFT_RIGHT = 거울', 'FLIP_TOP_BOTTOM = 위아래', 'rotate 는 반시계 방향', 'expand=True → 잘리지 않음'],
            notes: '<p>func_mirror1 은 FLIP_TOP_BOTTOM 만 다릅니다. 90도 회전에 expand 가 없으면 어떻게 되는지 추가 예제로 확인합니다.</p>' },
          { layout: 'code', title: 'Code14-07 밝게 · 어둡게', code: PS_IMPL.func_bright + '\n' + PS_IMPL.func_dark, run: false, points: ['askfloat → 실수 입력', '1.0 = 원래 밝기', '&gt;1 밝게, &lt;1 어둡게'],
            notes: '<p>두 함수의 가공 줄은 똑같고 입력 범위만 다르다는 점을 발견하게 합니다.</p>' },
          { layout: 'code', title: '밝기 값의 의미', code: C_ENHANCE, points: ['R, G, B 에 같은 배율', '흑백 = 0.299R + 0.587G + 0.114B'],
            notes: '<p>빨강(255,0,0)이 흑백으로 76 이 되는 이유: 255×0.299 ≈ 76.</p>' },
          { layout: 'code', title: 'Code14-08 · 09 필터와 흑백', code: PS_IMPL.func_blur + '\n' + PS_IMPL.func_bw, run: false, points: ['filter(ImageFilter.BLUR)', 'filter(ImageFilter.EMBOSS)', 'ImageOps.grayscale → 모드 L'],
            notes: '<p>func_embo 는 EMBOSS 만 다릅니다. 필터는 “주변 점과 함께 계산” 한다는 원리를 간단히 설명합니다.</p>' },
          { layout: 'code', title: '필터 비교', code: C_FILTER_SHOW, points: ['원본 · BLUR · EMBOSS 나란히', 'for 로 Label 3개'],
            notes: '<p>실행해서 세 사진을 비교합니다.</p>' },
          { layout: 'two', title: '느린 출력 vs 빠른 출력', left: { title: '교재 방식 (점마다 문자열)', bullets: ['getpixel 로 점 하나씩', '76,800번 반복 (320×240)', '원리를 배우기 좋음', '큰 사진은 느림'] }, right: { title: 'ImageTk 방식', code: 'paper = ImageTk.PhotoImage(img)\ncanvas.create_image((width / 2, height / 2),\n                    image = paper, state = "normal")', run: false },
            notes: '<p>displayImage 한 함수만 바꿨는데 전체 프로그램이 빨라진다 → 함수로 나눈 장점. 두 버전을 모두 실행해 속도를 비교해 보게 합니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '320×240 사진을 축소 배율 4 로 줄이면?', options: ['(80, 60)', '(1280, 960)', '(80, 240)', '(316, 236)'], answer: 0,
            explain: 'int(320/4), int(240/4)', notes: '<p>원본 기준이라는 점도 다시 확인.</p>' },
          { layout: 'practice', title: '실습 14-5. [이미지 처리(3)] 메뉴', desc: '선명하게(SHARPEN) · 윤곽선(CONTOUR) 메뉴 추가 — 필터 비교 예제로 먼저 효과 확인',
            starter: C_FILTER_SHOW.replace('window.mainloop()', '# TODO: BLUR, EMBOSS 를 SHARPEN, CONTOUR 로 바꿔 보기\nwindow.mainloop()'),
            solution: C_FILTER_SHOW.replace('BLUR', 'SHARPEN').replace('EMBOSS', 'CONTOUR'),
            notes: '<p>슬라이드에서는 필터만 바꿔 효과를 확인하고, 본문 실습 14-5 에서 메뉴까지 추가합니다. 실습 14-6(원본으로)은 도전 과제.</p>' },
          { layout: 'summary', title: '[프로젝트 1] 정리', bullets: ['모든 처리 = 복사 → 가공 → 출력', 'Image: resize · transpose · rotate', 'ImageEnhance.Brightness(…).enhance(값)', 'ImageFilter: BLUR · EMBOSS / ImageOps.grayscale', 'displayImage 만 바꿔 ImageTk 로 빠르게'],
            notes: '<p>다음 시간부터 [프로젝트 2] 슈팅 게임을 만듭니다.</p>' }
        ]
      },

      /* ============================================================ 14-4 */
      {
        id: 'ch14-4',
        title: '슈팅 게임: 게임 화면과 우주선 움직이기',
        minutes: 50,
        goals: [
          'pygame 게임 프로그램의 기본 구조(초기화 · 무한 반복 · 이벤트 · 화면 업데이트)를 설명할 수 있다',
          '게임에 필요한 기능과 주요 변수를 정리할 수 있다',
          '무작위 배경색의 기본 게임 화면을 만들 수 있다 (Code14-10)',
          '우주선 그림을 불러와 방향키로 화면 아래쪽 절반 안에서 움직일 수 있다 (Code14-11)'
        ],
        flow: [['게임 소개 · pygame 설치', 5], ['기능 구성 · 주요 변수', 10], ['게임 루프 · Code14-10', 15], ['키보드 이벤트 · Code14-11', 15], ['퀴즈 · 실습', 5]],
        content: [
          { type: 'h', text: '슈팅 게임 소개: 우주괴물 무찌르기' },
          { type: 'p', html: '[프로젝트 2] 는 화면 위쪽에서 왼쪽 → 오른쪽으로 지나가는 <b>우주괴물</b>을, 아래쪽의 <b>우주선</b>에서 <b>미사일</b>을 쏘아 맞히는 게임입니다. 맞힐 때마다 화면 아래에 <b>파괴한 우주괴물 수</b>가 1씩 올라갑니다.' },
          { type: 'p', html: '게임은 <b>pygame</b> 이라는 외부 라이브러리로 만듭니다. pygame 은 창 만들기, 그림 불러오기 · 그리기, 키보드 · 마우스 입력, 소리 등 게임에 필요한 기능을 모아 둔 라이브러리입니다.' },
          { type: 'code', run: false, title: '내 PC 에 pygame 설치하기 (명령 프롬프트)', code: 'pip install pygame' },
          { type: 'callout', kind: 'tip', title: '이 웹 강좌의 pygame', html: '이 강좌에는 표준 pygame 과 같은 이름으로 쓰는 <b>강좌용 pygame 호환 모듈</b>이 준비되어 있어 <code>import pygame</code> 만 하면 됩니다. 게임 창은 페이지 위에 뜨며, <b>게임 창을 한 번 클릭</b>해야 키보드 입력이 게임으로 들어갑니다. 게임 그림은 작업 폴더의 <code>game/</code> 폴더(<code>ship02.png</code>, <code>monster01.png</code> ~ <code>monster10.png</code>, <code>missile.png</code>)에 있습니다.' },
          { type: 'callout', kind: 'info', title: '강의자료와 달라진 점', html: '강의자료는 그림 파일을 프로그램과 같은 폴더에 두고 <code>\'ship02.png\'</code> 처럼 부릅니다. 이 강좌에서는 그림을 <code>game</code> 폴더에 모아 두었으므로 <code>\'game/ship02.png\'</code> 처럼 폴더 이름을 앞에 붙였습니다. 그림도 교재 그림이 아니라 파이썬으로 직접 그린 것입니다.' },

          { type: 'h', text: '가장 작은 pygame 프로그램' },
          { type: 'p', html: 'pygame 프로그램은 <b>① 초기화 → ② 창 만들기 → ③ 무한 반복(게임 루프)</b> 으로 이루어집니다. 게임 루프는 1초에 수십 번 “이벤트 확인 → 그리기 → 화면 업데이트” 를 되풀이하는데, 매번 조금씩 다른 위치에 그리면 물체가 움직이는 것처럼 보입니다 (만화 영화의 원리).' },
          { type: 'code', title: '추가 예제. 가장 작은 pygame 프로그램', code: C_PG_MINI, nondeterministic: true,
            desc: '<code>pygame.init()</code> 으로 pygame 을 준비하고 <code>display.set_mode((폭, 높이))</code> 로 창(화면 객체)을 만듭니다. <code>event.get()</code> 은 그동안 일어난 이벤트(키 누름, 창 닫기 …)를 목록으로 돌려주며, <code>QUIT</code> 은 창의 [X] 를 누른 것입니다. <code>fill</code> 로 배경을 칠하고 그 위에 그린 뒤 <code>display.update()</code> 를 해야 실제 화면에 보입니다.' },
          { type: 'figure', html: SVG_LOOP, caption: '게임 루프: 1초에 약 50번 되풀이된다' },
          { type: 'callout', kind: 'warn', title: '창 닫기(QUIT) 처리를 잊지 마세요', html: '게임 루프는 <code>while True</code> 인 무한 반복이므로, <code>QUIT</code> 이벤트에서 <code>pygame.quit()</code> 과 <code>sys.exit()</code> 로 끝내지 않으면 창의 [X] 를 눌러도 프로그램이 끝나지 않습니다.' },

          { type: 'h', text: '슈팅 게임 기능 구성' },
          { type: 'table', head: ['기능', '내용', '코드'], rows: [
            ['기능 1', '기본 화면 구성하기 (무작위 배경색)', 'Code14-10'],
            ['기능 2', '우주선 이미지를 추가하고 방향키로 움직이기', 'Code14-11'],
            ['기능 3', '우주괴물이 나타나면 자동으로 움직이기', 'Code14-12'],
            ['기능 4', '우주선에서 미사일 발사하기', 'Code14-13'],
            ['기능 5', '우주괴물 맞히고 점수 계산하기', 'Code14-14 (완성)']
          ] },
          { type: 'p', html: '코드 안의 <code># @기능 2-3 : …</code> 같은 주석은 “기능 2 의 3번째 단계를 넣을 자리” 라는 표시입니다. Code14-10 에 모든 자리를 주석으로 미리 표시해 두고, 단계마다 그 자리를 채웁니다.' },
          { type: 'h', text: '주요 변수 소개' },
          { type: 'figure', html: SVG_VARS, caption: '그림 14-10 게임의 주요 변수' },
          { type: 'table', head: ['대상', '변수', '뜻'], rows: [
            ['화면', '<code>monitor</code>, <code>swidth</code>, <code>sheight</code>', '게임 화면 객체, 화면 폭(500) · 높이(700)'],
            ['우주선', '<code>ship</code>, <code>shipSize</code>, <code>shipX</code>, <code>shipY</code>', '우주선 그림, (폭, 높이), 위치'],
            ['우주괴물', '<code>monster</code>, <code>monsterSize</code>, <code>monsterSpeed</code>, <code>monsterX</code>, <code>monsterY</code>', '괴물 그림, 크기, 속도, 위치'],
            ['미사일', '<code>missile</code>, <code>missileX</code>, <code>missileY</code>', '미사일 그림, 위치 (쏘지 않았으면 None)'],
            ['점수', '<code>fireCount</code>', '맞힌 우주괴물 수']
          ] },
          { type: 'code', title: '추가 예제. 우주괴물 10종 미리 보기', code: C_MON_SHOW, nondeterministic: true,
            desc: '<code>\'game/monster%02d.png\' % i</code> 는 i 를 두 자리로 채워 <code>monster01.png</code> ~ <code>monster10.png</code> 를 만듭니다. <code>blit(그림, (x, y))</code> 는 화면의 (x, y) 에 그림의 <b>왼쪽 위 모서리</b>를 맞춰 붙입니다.' },

          { type: 'h', text: '기본 화면 구성하기 (Code14-10)' },
          { type: 'code', title: 'Code14-10. 기본 화면 구성하기', code: game(10), nondeterministic: true,
            desc: '<code>함수 선언 부분</code> 의 <code>playGame()</code> 이 게임 전체를 진행합니다. 배경색 <code>r, g, b</code> 를 0~255 사이의 난수로 정하므로 실행할 때마다 배경색이 달라집니다. <code>while True</code> 안에서 <code>tick(50)</code> 으로 속도를 맞추고, 배경을 칠하고, 이벤트를 확인하고, 화면을 업데이트합니다. 마지막 줄의 <code>print(\'~\', end=\'\')</code> 는 반복이 계속 돌고 있음을 콘솔에서 확인하려고 넣은 것입니다. <code>메인 코드 부분</code> 에서 pygame 을 초기화하고 500×700 창을 만든 뒤 <code>playGame()</code> 을 부릅니다.' },
          { type: 'callout', kind: 'more', title: '📘 Clock 은 한 번만 만드는 것이 정석', html: '교재 코드 <code>(pygame.time.Clock()).tick(50)</code> 은 반복할 때마다 시계를 새로 만들어 “지금부터 1/50초” 를 기다립니다. 보통은 반복 전에 <code>clock = pygame.time.Clock()</code> 으로 한 번 만들고 반복 안에서 <code>clock.tick(50)</code> 을 부릅니다. 그러면 그리는 데 걸린 시간까지 계산해 <b>정확히 1초에 50번</b>을 맞춰 줍니다. <code>tick()</code> 의 숫자가 클수록 게임이 빨라집니다.' },

          { type: 'h', text: '우주선 이미지를 추가하고 방향키로 움직이기 (Code14-11)' },
          { type: 'p', html: '이번 단계에서 채울 곳은 교재의 번호 순서대로 다음과 같습니다.' },
          { type: 'list', ordered: true, items: [
            '전역 변수 <code>ship, shipSize = None, 0</code> — 우주선 그림과 크기를 담을 변수',
            '<code>@기능 2-1</code> — <code>pygame.image.load()</code> 로 우주선 그림을 불러오고 <code>get_rect().size</code> 로 (폭, 높이)를 구함',
            '<code>playGame()</code> 의 <code>global</code> 에 <code>ship</code> 추가',
            '<code>@기능 2-2</code> — 우주선의 처음 위치(가로 가운데, 높이의 80% 지점)와 이동량 <code>dx, dy</code>',
            '<code>@기능 2-3</code> — 방향키를 누르면(KEYDOWN) 이동량을 ±5 로, 떼면(KEYUP) 0 으로',
            '<code>@기능 2-4</code> — 움직인 위치가 화면 안(세로는 아래쪽 절반)일 때만 실제로 이동하고 우주선을 그림',
            '<code>@기능 2-5</code> — 그림을 (x, y) 에 그리는 함수 <code>paintEntity()</code>'
          ] },
          { type: 'code', title: '추가 예제. 그림 크기와 처음 위치 계산', code: C_SIZE, expect: '우주선 크기 : (48, 64)\n폭 : 48 / 높이 : 64\n처음 위치 : 250.0 560.0',
            desc: '<code>/</code> 나눗셈과 실수 곱셈의 결과는 실수(float)입니다. 그래서 <code>paintEntity()</code> 에서 <code>int(x), int(y)</code> 로 정수로 바꿔서 그립니다.' },
          { type: 'code', title: '추가 예제. 방향키로 우주선 움직이기 (작은 버전)', code: C_PG_KEYS, nondeterministic: true,
            desc: '<b>KEYDOWN</b>(키를 누른 순간)에 이동량을 정하고 <b>KEYUP</b>(키를 뗀 순간)에 0 으로 되돌립니다. 이동은 이벤트가 아니라 <b>매 반복마다</b> <code>x += dx</code> 로 일어나므로, 키를 누르고 있는 동안 계속 움직입니다.' },
          { type: 'code', title: 'Code14-11. 우주선 이미지를 추가하고 방향키로 움직이기', code: game(11), nondeterministic: true,
            desc: '▶ 실행한 뒤 게임 창을 클릭하고 방향키를 눌러 보세요. 우주선은 화면의 <b>아래쪽 절반</b> 안에서만 움직입니다. <code>@기능 2-4</code> 의 조건문은 “움직인 뒤의 위치(<code>shipX + dx</code>)” 가 화면 안일 때만 실제로 위치를 바꿉니다. 오른쪽 경계가 <code>swidth - shipSize[0]</code> 인 이유는 위치가 그림의 <b>왼쪽 위</b> 모서리이기 때문입니다.' },
          { type: 'callout', kind: 'more', title: '📘 key.get_pressed() 로 움직이는 방법', html: '<code>pressed = pygame.key.get_pressed()</code> 를 반복마다 부르면 지금 눌려 있는 키를 모두 알 수 있습니다. <code>if pressed[pygame.K_LEFT] : shipX -= 5</code> 처럼 쓰면 KEYUP 처리 없이도 되고, 두 키(←와 ↑)를 동시에 눌러 대각선으로 움직이기도 쉽습니다. 교재 방식은 한 방향키를 떼면 <code>dx, dy</code> 가 모두 0 이 되어 대각선 이동 중 한 키만 떼도 멈춥니다.' },
          { type: 'callout', kind: 'info', title: '줄 끝의 역슬래시(\\)', html: '<code>if … \\</code> 처럼 줄 끝에 역슬래시를 쓰면 “다음 줄에 이어진다” 는 뜻입니다. 조건이 길 때 두 줄로 나눠 쓸 수 있습니다. 괄호 <code>( )</code> 안이라면 역슬래시 없이도 줄을 바꿀 수 있습니다.' }
        ],
        practice: [
          {
            title: '실습 14-7. 우주선을 더 빠르게, 화면 전체에서 움직이기', level: 2,
            desc: '<p>작은 버전 예제를 고쳐서 ① 방향키 ↑ ↓ 도 처리하고 ② 한 번에 움직이는 거리를 <b>10</b> 으로 늘리고 ③ 우주선이 창(300×300) 밖으로 나가지 않게 하세요.</p>',
            hint: '<code>dy</code> 를 추가하고, 이동하기 전에 <code>0 &lt;= x + dx &lt;= 300 - 폭</code> 인지 확인합니다. 우주선 크기는 <code>ship.get_rect().size</code>.',
            starter: C_PG_KEYS.replace('x, y, dx = 130, 200, 0', 'x, y, dx = 130, 200, 0\n# TODO: dy 추가, 크기 구하기').replace('    x += dx', '    # TODO: 화면 안일 때만 이동\n    x += dx'),
            solution: String.raw`import pygame
import sys

pygame.init()
monitor = pygame.display.set_mode((300, 300))
ship = pygame.image.load('game/ship02.png')
shipW, shipH = ship.get_rect().size
x, y, dx, dy = 130, 200, 0, 0
clock = pygame.time.Clock()

while True :
    clock.tick(50)
    for e in pygame.event.get() :
        if e.type == pygame.QUIT :
            pygame.quit()
            sys.exit()
        if e.type == pygame.KEYDOWN :
            if e.key == pygame.K_LEFT : dx = -10
            elif e.key == pygame.K_RIGHT : dx = +10
            elif e.key == pygame.K_UP : dy = -10
            elif e.key == pygame.K_DOWN : dy = +10
        if e.type == pygame.KEYUP : dx, dy = 0, 0
    if 0 <= x + dx <= 300 - shipW :
        x += dx
    if 0 <= y + dy <= 300 - shipH :
        y += dy
    monitor.fill((230, 230, 160))
    monitor.blit(ship, (x, y))
    pygame.display.update()
`,
            nondeterministic: true
          },
          {
            title: '실습 14-8. 우주선 위치 계산 연습 (화면 없이)', level: 1,
            desc: '<p>화면 폭 500, 우주선 폭 48 일 때, 우주선이 x = 440 에서 오른쪽(dx = +5)으로 계속 움직인다고 합시다. Code14-11 의 조건 <code>0 &lt; shipX + dx and shipX + dx &lt;= swidth - shipSize[0]</code> 을 써서, 몇 번 움직인 뒤 멈추는지와 멈춘 위치를 출력하세요.</p>',
            hint: '<code>while</code> 로 조건이 참인 동안 <code>shipX += dx</code> 하고 횟수를 셉니다.',
            starter: "swidth = 500\nshipSize = (48, 64)\nshipX, dx = 440, 5\ncount = 0\n# TODO: 조건이 참인 동안 이동하고 횟수 세기\nprint(count, '번 이동, 위치', shipX)\n",
            solution: "swidth = 500\nshipSize = (48, 64)\nshipX, dx = 440, 5\ncount = 0\nwhile 0 < shipX + dx and shipX + dx <= swidth - shipSize[0] :\n    shipX += dx\n    count += 1\nprint(count, '번 이동, 위치', shipX)\n",
            expect: '2 번 이동, 위치 450'
          }
        ],
        quiz: [
          { q: 'pygame 게임 루프에서 <code>pygame.display.update()</code> 를 빼먹으면?', options: ['그린 내용이 실제 화면에 나타나지 않는다', '게임이 더 빨라진다', '키보드 입력을 받을 수 없다', '오류가 나며 끝난다'], answer: 0,
            explain: 'fill · blit 은 보이지 않는 화면에 그리는 것이고, update() 를 해야 창에 반영됩니다.' },
          { q: 'Code14-11 에서 <code>swidth, sheight = 500, 700</code> 일 때 우주선의 처음 위치 <code>shipX, shipY</code> 는?', options: ['250.0, 560.0', '500, 700', '250, 350', '0, 0'], answer: 0,
            explain: 'shipX = 500 / 2 = 250.0, shipY = 700 * 0.8 = 560.0' },
          { q: '방향키를 <b>누르고 있는 동안</b> 우주선이 계속 움직이는 이유는?', options: ['KEYDOWN 때 dx 를 정해 두고, 매 반복마다 shipX += dx 를 하기 때문', 'KEYDOWN 이벤트가 1초에 50번 발생하기 때문', 'tick(50) 이 키를 반복 입력하기 때문', 'blit 이 자동으로 움직이기 때문'], answer: 0,
            explain: 'KEYDOWN 은 누른 순간 한 번, KEYUP 은 뗀 순간 한 번 옵니다. 이동량을 변수에 저장해 두고 반복마다 더합니다.' },
          { q: '우주선이 오른쪽 경계를 넘지 않게 하는 조건이 <code>shipX + dx &lt;= swidth - shipSize[0]</code> 인 이유는?', options: ['(shipX, shipY) 가 그림의 왼쪽 위 모서리라서', 'shipSize[0] 이 높이라서', '화면 폭이 0 부터 시작해서', '미사일이 나갈 자리를 남기려고'], answer: 0,
            explain: '그림의 왼쪽 위가 기준이므로, 오른쪽 끝이 화면 안에 있으려면 x 가 (화면 폭 - 그림 폭) 이하여야 합니다.' },
          { q: 'Code14-11 에서 우주선이 화면의 위쪽 절반으로 올라갈 수 없는 이유는?', options: ['세로 조건이 <code>sheight / 2 &lt; shipY + dy</code> 이기 때문', 'K_UP 을 처리하지 않아서', 'tick(50) 때문', '배경색이 무작위라서'], answer: 0,
            explain: '세로 위치가 화면 높이의 절반보다 커야(아래쪽이어야) 이동합니다. 주석 “화면의 중앙까지만” 이 그 뜻입니다.' }
        ],
        slides: [
          { layout: 'title', title: '슈팅 게임: 화면과 우주선', subtitle: 'Chapter 14 · 14-4 — Code14-10 · Code14-11', badge: '14-4',
            notes: '<p>완성된 게임(14-5 의 [프로젝트 2] 완성 코드)을 먼저 한 판 보여 주고 시작합니다. 게임 창을 클릭해야 키 입력이 들어간다는 점을 꼭 알려 줍니다.</p>' },
          { layout: 'bullets', title: 'pygame 과 게임 루프', bullets: ['<code>pip install pygame</code> (웹 강좌는 준비됨)', '<code>pygame.init()</code> → <code>set_mode((폭, 높이))</code>', '<code>while True :</code> 게임 루프', ['루프 한 바퀴', ['이벤트 확인 → 위치 계산 → 그리기 → <code>display.update()</code>']], 'QUIT 이벤트에서 <code>pygame.quit()</code> · <code>sys.exit()</code>'],
            notes: '<p>게임 = 1초에 수십 장 그리는 만화 영화라는 비유를 씁니다.</p>' },
          { layout: 'code', title: '가장 작은 pygame 프로그램', code: C_PG_MINI, points: ['fill → 그리기 → update', 'tick(50) = 1초에 50번', 'QUIT 처리 필수'],
            notes: '<p>원의 위치를 바꿔 보거나 fill 을 반복 밖으로 빼면 어떻게 되는지 실험하게 합니다.</p>' },
          { layout: 'diagram', title: '게임 루프의 흐름', html: SVG_LOOP, notes: '<p>①~⑥ 순서를 짚으며 설명합니다. 앞으로 만드는 모든 기능이 이 루프 안의 ③④⑤ 에 들어간다고 예고합니다.</p>' },
          { layout: 'table', title: '기능 구성 (단계별 완성)', head: ['기능', '내용', '코드'], rows: [
            ['1', '기본 화면 (무작위 배경색)', '14-10'], ['2', '우주선 + 방향키', '14-11'], ['3', '우주괴물 자동 이동', '14-12'], ['4', '미사일 발사', '14-13'], ['5', '맞히기 · 점수', '14-14']
          ], lead: '<code># @기능 2-3</code> = 기능 2 의 3단계를 넣을 자리',
            notes: '<p>교재의 기능 1~5 화면을 차례로 설명합니다. 주석 표시 방식을 이해시키는 것이 중요합니다.</p>' },
          { layout: 'diagram', title: '주요 변수', html: SVG_VARS, notes: '<p>그림 14-10. 좌표의 기준점(0,0)이 왼쪽 위이고 y 가 아래로 커진다는 점을 반드시 확인합니다. 변수 이름을 미리 익혀 두면 코드 읽기가 쉬워집니다.</p>' },
          { layout: 'code', title: 'Code14-10 핵심: 게임 루프', code: C_PG_MINI.replace('    pygame.draw.circle(monitor, (255, 255, 255), (150, 150), 40)\n', ''), points: ['교재: 창 500×700, 배경 무작위', 'playGame() 안에 while True', '<code>print(\'~\', end=\'\')</code> 로 반복 확인'],
            notes: '<p>본문의 Code14-10 전체를 학생 화면에서 실행해, 실행할 때마다 배경색이 달라지는 것과 콘솔에 ~ 가 계속 찍히는 것을 확인합니다.</p>' },
          { layout: 'code', title: '그림 불러오기와 크기', code: C_SIZE, points: ['<code>image.load(\'game/ship02.png\')</code>', '<code>get_rect().size</code> → (폭, 높이)', '처음 위치: 가운데 · 80% 지점'],
            notes: '<p>교재는 파일을 같은 폴더에 두지만 여기서는 game/ 폴더를 붙인다고 안내합니다.</p>' },
          { layout: 'code', title: 'Code14-11 핵심: 방향키 이벤트', code: F_KEYS, run: false, points: ['KEYDOWN → 이동량 ±5', 'KEYUP → 이동량 0', '줄 끝 \\ = 다음 줄에 계속'],
            notes: '<p>이벤트는 누른 순간 / 뗀 순간 한 번씩만 온다는 점을 강조합니다.</p>' },
          { layout: 'code', title: 'Code14-11 핵심: 화면 안에서만', code: F_BOUND, run: false, points: ['움직인 뒤 위치를 미리 검사', '오른쪽 끝 = swidth - 폭', '세로는 아래쪽 절반만', 'paintEntity → blit'],
            notes: '<p>칠판에 화면 사각형을 그리고 우주선이 움직일 수 있는 영역(아래쪽 절반)을 색칠해 보입니다.</p>' },
          { layout: 'code', title: '방향키로 움직이기 (작은 버전)', code: C_PG_KEYS, points: ['게임 창을 클릭한 뒤 ← → 키', 'x += dx 는 매 반복'],
            notes: '<p>본문의 Code14-11 전체도 실행하게 합니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: 'swidth, sheight = 500, 700 일 때 shipX, shipY 의 처음 값은?', options: ['250.0, 560.0', '500, 700', '250, 350', '0, 0'], answer: 0,
            explain: '500/2, 700*0.8', notes: '<p>실수(float)가 되는 이유도 묻습니다.</p>' },
          { layout: 'practice', title: '실습 14-8. 우주선 위치 계산', desc: 'x=440 에서 dx=+5 로 움직일 때 몇 번 뒤 멈추나? (화면 폭 500, 우주선 폭 48)',
            starter: "swidth = 500\nshipSize = (48, 64)\nshipX, dx = 440, 5\ncount = 0\n# TODO\nprint(count, '번 이동, 위치', shipX)\n",
            solution: "swidth = 500\nshipSize = (48, 64)\nshipX, dx = 440, 5\ncount = 0\nwhile 0 < shipX + dx and shipX + dx <= swidth - shipSize[0] :\n    shipX += dx\n    count += 1\nprint(count, '번 이동, 위치', shipX)\n",
            notes: '<p>답: 2번, 450. 452 까지 갈 수 있지만 5씩 움직이므로 455 는 넘는다. 실습 14-7 은 게임 창으로 직접 실험.</p>' },
          { layout: 'summary', title: '정리', bullets: ['pygame: init → set_mode → while True 게임 루프', 'event.get(): QUIT · KEYDOWN · KEYUP', 'image.load · get_rect().size · blit', '이동량 dx, dy 를 저장 → 매 반복 더하기', '경계 검사: 움직인 뒤의 위치로 판단'],
            notes: '<p>다음 시간: 우주괴물 · 미사일 · 점수로 게임을 완성합니다.</p>' }
        ]
      },

      /* ============================================================ 14-5 */
      {
        id: 'ch14-5',
        title: '슈팅 게임: 우주괴물 · 미사일 · 점수와 완성',
        minutes: 50,
        goals: [
          'random.choice 와 randrange 로 우주괴물의 그림 · 위치 · 속도를 무작위로 정할 수 있다 (Code14-12)',
          'None 을 이용해 미사일을 “쏘지 않은 상태” 로 관리하고 발사 · 이동 · 소멸을 구현할 수 있다 (Code14-13)',
          '두 사각형 좌표를 비교해 충돌(맞힘)을 판정할 수 있다',
          'font 로 점수를 화면에 쓰고 슈팅 게임을 완성할 수 있다 (Code14-14)'
        ],
        flow: [['우주괴물 등장 · 이동', 12], ['미사일 발사 · 이동', 12], ['충돌 판정 · 점수 · 완성', 16], ['정리 · 퀴즈 · 실습', 10]],
        content: [
          { type: 'h', text: '우주괴물이 나타나면 자동으로 움직이기 (Code14-12)' },
          { type: 'p', html: '우주괴물 그림 10개의 파일 이름을 리스트 <code>monsterImage</code> 에 넣어 두고, 괴물이 나타날 때마다 <code>random.choice()</code> 로 하나를 고릅니다. 세로 위치는 화면 위쪽 30% 안에서, 속도는 1~4 사이에서 무작위로 정합니다.' },
          { type: 'code', title: '추가 예제. 무작위로 괴물 · 위치 · 속도 고르기', code: C_RANDOM_MON,
            expect: 'game/monster02.png 134 2\ngame/monster05.png 65 3\ngame/monster02.png 115 3',
            desc: '<code>random.randrange(0, int(swidth * 0.3))</code> 는 0 ~ 149, <code>random.randrange(1, 5)</code> 는 1 ~ 4 중 하나입니다 (끝 값은 포함하지 않음). <code>random.seed()</code> 는 예제 결과를 고정하려고 넣은 것으로 게임에서는 쓰지 않습니다.' },
          { type: 'p', html: '이번 단계에서 채울 곳:' },
          { type: 'list', ordered: true, items: [
            '<code>@기능 3-1</code> — 괴물 그림 파일 이름 리스트 <code>monsterImage</code> 와 전역 변수 <code>monster</code>',
            '<code>playGame()</code> 의 <code>global</code> 에 <code>monster</code> 추가',
            '<code>@기능 3-2</code> — 처음 괴물을 무작위로 골라 불러오고 크기 · 위치(<code>monsterX = 0</code>, 왼쪽 끝) · 속도를 정함',
            '<code>@기능 3-3</code> — 매 반복마다 <code>monsterX</code> 에 속도를 더해 오른쪽으로 움직이고, 화면 오른쪽 끝을 지나면 새 괴물로 바꿔 왼쪽에서 다시 등장'
          ] },
          { type: 'code', title: 'Code14-12. 우주괴물이 나타나면 자동으로 움직이기', code: game(12), nondeterministic: true,
            desc: '우주괴물은 키보드와 상관없이 스스로 움직입니다. 이벤트 처리(for 문) <b>바깥</b>, 매 반복마다 실행되는 곳에 이동 코드가 있기 때문입니다. 오른쪽 끝을 지나면(<code>monsterX &gt; swidth</code>) 위치 · 그림 · 크기 · 속도를 모두 새로 정합니다.' },

          { type: 'h', text: '우주선에서 미사일 발사하기 (Code14-13)' },
          { type: 'p', html: '미사일은 화면에 <b>한 번에 하나만</b> 날아가게 합니다. 이를 위해 미사일 좌표 <code>missileX, missileY</code> 에 <mark><code>None</code> 이 들어 있으면 “지금 날아가는 미사일이 없다”</mark> 는 뜻으로 약속합니다.' },
          { type: 'list', ordered: true, items: [
            '전역 변수 <code>missile = None</code>, <code>@기능 4-1</code> 에서 미사일 그림 불러오기',
            '<code>global</code> 에 <code>missile</code> 추가',
            '<code>@기능 4-2</code> — <code>missileX, missileY = None, None</code> (아직 쏘지 않음)',
            '<code>@기능 4-3</code> — 스페이스바(<code>K_SPACE</code>)를 눌렀고 날아가는 미사일이 없으면, 우주선 가운데 위치에서 발사',
            '<code>@기능 4-4</code> — 미사일이 있으면 매 반복 10 씩 위로(<code>missileY -= 10</code>), 화면 위로 나가면(<code>missileY &lt; 0</code>) 다시 None, 있으면 그리기'
          ] },
          { type: 'code', title: '추가 예제. 미사일의 일생 (화면 없이 흉내 내기)', code: C_MISSILE_SIM,
            expect: '발사 위치 : 250.0 560\n57 번 움직인 뒤 사라짐',
            desc: '560 에서 10 씩 올라가 56번째에 0, 57번째에 -10 이 되어 사라집니다. 1초에 50번 반복하므로 미사일은 약 1초 남짓 날아갑니다.' },
          { type: 'code', title: 'Code14-13. 우주선에서 미사일 발사하기', code: game(13), nondeterministic: true,
            desc: '게임 창을 클릭한 뒤 스페이스바를 눌러 보세요. 미사일이 날아가는 동안에는 스페이스바를 눌러도 새 미사일이 나가지 않습니다(<code>if missileX == None</code>). 아직 괴물을 맞혀도 아무 일도 일어나지 않습니다.' },
          { type: 'callout', kind: 'more', title: '📘 None 비교는 is 로', html: '교재는 <code>missileX == None</code>, <code>missileX != None</code> 으로 비교하지만, 파이썬에서는 <code>missileX is None</code>, <code>missileX is not None</code> 으로 쓰는 것을 권장합니다(PEP 8). 결과는 같습니다. 또 <code>if missileX :</code> 처럼 쓰면 안 됩니다 — 미사일의 x 가 0 이면 거짓으로 처리되기 때문입니다.' },

          { type: 'h', text: '우주괴물 맞히고 점수 계산하기 — [프로젝트 2] 의 완성 (Code14-14)' },
          { type: 'p', html: '미사일이 괴물에 “맞았다” 는 것은 <b>미사일의 기준점(왼쪽 위)이 괴물 그림의 사각형 안에 들어왔다</b>는 뜻으로 판단합니다. x 도 괴물의 왼쪽 끝과 오른쪽 끝 사이, y 도 위쪽 끝과 아래쪽 끝 사이에 있으면 맞은 것입니다.' },
          { type: 'figure', html: SVG_HIT, caption: '충돌 판정: 미사일 점이 우주괴물 사각형 안에 있는가?' },
          { type: 'code', title: '추가 예제. 충돌 판정 함수로 연습하기', code: C_HIT_FUNC, expect: 'True\nFalse\nFalse\nFalse',
            desc: '<code>and</code> 로 네 조건이 모두 참이어야 True 입니다. 경계와 같은 값이면(<code>&lt;</code> 이므로) 맞지 않은 것으로 봅니다.' },
          { type: 'list', ordered: true, items: [
            '<code>@기능 5-1</code> — 맞힌 수 <code>fireCount = 0</code>',
            '<code>@기능 5-2</code> — 날아가는 미사일이 괴물 사각형 안이면 <code>fireCount += 1</code>, 괴물을 새로 준비(왼쪽에서 다시 등장)하고 미사일을 없앰(None)',
            '<code>@기능 5-3</code> — 매 반복마다 <code>writeScore(fireCount)</code> 호출',
            '<code>@기능 5-4</code> — 점수를 화면 왼쪽 아래에 쓰는 함수 <code>writeScore()</code>'
          ] },
          { type: 'p', html: '글자를 화면에 쓰려면 ① 글꼴 객체를 만들고 ② <code>render(글자, 부드럽게, 색)</code> 로 <b>글자 그림</b>을 만든 뒤 ③ 다른 그림처럼 <code>blit()</code> 합니다.' },
          { type: 'code', run: false, title: 'Code14-14 (@기능 5-4). writeScore() 함수', code: F_SCORE,
            desc: '글자색을 <code>(255 - r, 255 - g, 255 - b)</code>, 즉 배경색의 <b>반대색(보색)</b>으로 해서 어떤 배경에서도 잘 보이게 하려는 의도입니다. 위치 <code>(10, sheight - 40)</code> 은 화면 왼쪽 아래입니다.' },
          { type: 'callout', kind: 'info', title: '강의자료와 달라진 점: 한글 글꼴', html: '강의자료는 <code>pygame.font.Font(\'NanumGothic.ttf\', 20)</code> 으로 나눔고딕 글꼴 <b>파일</b>을 씁니다. 이 파일이 프로그램 폴더에 없으면 실제 pygame 에서는 오류가 납니다. 그래서 윈도에 기본으로 있는 맑은 고딕을 이름으로 부르는 <code>pygame.font.SysFont(\'malgungothic\', 20)</code> 으로 바꿨습니다. pygame 의 기본 글꼴(<code>Font(None, 크기)</code>)은 한글을 표시하지 못해 □ 로 보이므로 한글 글꼴을 꼭 지정해야 합니다.' },
          { type: 'code', title: '[프로젝트 2] 완성: 우주괴물 무찌르기 (Code14-14 전체 코드)', code: game(14), nondeterministic: true,
            desc: '게임 창을 클릭하고 방향키로 움직이며 스페이스바로 미사일을 쏘세요. 우주괴물을 맞히면 괴물이 사라지고 왼쪽에서 새 괴물이 나타나며, 왼쪽 아래의 점수가 1 올라갑니다.' },
          { type: 'callout', kind: 'more', title: '📘 점수 글자색이 늘 흰색인 이유 (전역 · 지역 변수)', html: '<p>writeScore() 의 <code>r, g, b</code> 는 어디의 값일까요? playGame() 안의 <code>r = random.randrange(…)</code> 는 <code>global</code> 선언이 없으므로 <b>playGame 의 지역 변수</b>입니다. writeScore() 는 이 지역 변수를 볼 수 없고 <b>전역 변수</b> <code>r, g, b = [0] * 3</code> 을 읽습니다. 그래서 글자색은 항상 (255, 255, 255) 흰색입니다. 정말 보색으로 하려면 playGame() 의 global 에 <code>r, g, b</code> 를 추가하면 됩니다.</p>' },
          { type: 'code', title: '추가 예제. 함수가 보는 변수는 어느 것?', code: C_SCOPE,
            expect: 'playGame 안의 r : 200\nwriteScore 가 보는 r : 0 → 글자색 255' },
          { type: 'callout', kind: 'more', title: '📘 pygame.Rect 로 충돌 판정하기', html: 'pygame 은 사각형 객체 <code>pygame.Rect(x, y, 폭, 높이)</code> 와 충돌 판정 메서드를 제공합니다. <code>colliderect()</code> 는 두 사각형이 조금이라도 겹치면 True 이므로, 미사일 그림의 일부만 닿아도 맞은 것으로 처리할 수 있어 더 자연스럽습니다. 그림에서 바로 <code>ship.get_rect(topleft=(x, y))</code> 처럼 Rect 를 얻을 수도 있습니다.' },
          { type: 'code', title: '추가 예제. Rect 의 colliderect · collidepoint', code: C_RECT, expect: 'True\nTrue\nFalse' },

          { type: 'h', text: '이 장의 요약' },
          { type: 'list', items: [
            '외부 라이브러리는 <code>pip install 이름</code> 으로 설치하고 import 해서 씁니다 (Pillow → <code>PIL</code>, pygame).',
            '미니 포토샵: tkinter 메뉴로 기능을 나누고, 원본(photo)을 복사한 photo2 를 Pillow 로 가공해 displayImage() 로 출력했습니다.',
            'Pillow 의 <code>resize · transpose · rotate</code>, <code>ImageEnhance.Brightness</code>, <code>ImageFilter.BLUR · EMBOSS</code>, <code>ImageOps.grayscale</code> 을 사용했습니다.',
            '슈팅 게임: 게임 루프(이벤트 → 계산 → 그리기 → update) 안에서 우주선 · 우주괴물 · 미사일의 위치를 바꾸고, 좌표 비교로 충돌을 판정해 점수를 올렸습니다.',
            '큰 프로그램은 <b>기능 목록 → 뼈대(빈 함수 · 주석 자리) → 기능 하나씩 채우고 실행</b> 순서로 만듭니다.'
          ] },
          { type: 'callout', kind: 'more', title: '📘 게임을 더 발전시켜 보기', html: '<ul><li>괴물이 오른쪽 끝을 그냥 지나가면 “놓친 수” 를 세고 3마리를 놓치면 게임 오버</li><li>점수가 오를수록 괴물 속도를 빠르게 (<code>randrange(1, 5 + fireCount // 5)</code>)</li><li><code>pygame.mixer.Sound(\'파일.wav\').play()</code> 로 발사 · 폭발 소리</li><li>미사일을 리스트로 관리해 여러 발 동시에 쏘기</li></ul>' }
        ],
        practice: [
          {
            title: '실습 14-9. 놓친 우주괴물 세기 (게임 오버)', level: 3,
            desc: '<p>완성된 게임에서 우주괴물이 맞지 않고 오른쪽 끝을 지나가면 <b>놓친 수(missCount)</b>를 1 올리세요. 점수 옆에 놓친 수도 표시하고, <b>3마리를 놓치면</b> 콘솔에 “게임 오버! 점수 : N” 을 출력하고 게임을 끝내세요.</p>',
            hint: '<code>@기능 3-3</code> 의 <code>if monsterX &gt; swidth :</code> 안에서 <code>missCount += 1</code>. writeScore 에 매개변수를 하나 더 주거나 문자열을 바꿉니다. 끝낼 때는 <code>pygame.quit()</code> · <code>sys.exit()</code>.',
            starter: game(14).replace('    fireCount = 0', '    fireCount = 0\n    # TODO: missCount 변수'),
            solution: game(14)
              .replace('def writeScore(score) :', 'def writeScore(score, miss) :')
              .replace("u'파괴한 우주괴물 수 : ' + str(score)", "u'파괴한 우주괴물 수 : ' + str(score) + '   놓친 수 : ' + str(miss)")
              .replace('    fireCount = 0', '    fireCount = 0\n    missCount = 0')
              .replace('        if monsterX > swidth :\n            monsterX = 0', "        if monsterX > swidth :\n            missCount += 1\n            if missCount >= 3 :\n                print('게임 오버! 점수 :', fireCount)\n                pygame.quit()\n                sys.exit()\n            monsterX = 0")
              .replace('writeScore(fireCount)', 'writeScore(fireCount, missCount)'),
            nondeterministic: true
          },
          {
            title: '실습 14-10. 충돌 판정 표 만들기 (화면 없이)', level: 1,
            desc: '<p>우주괴물이 (200, 100) 에 있고 크기가 (60, 52) 일 때, 미사일 위치 (230, 120), (190, 120), (230, 160), (259, 151) 각각에 대해 맞았는지 출력하세요. Code14-14 와 같은 조건을 사용합니다.</p>',
            hint: '미사일 위치를 튜플의 리스트로 만들고 for 로 돌며 조건을 검사합니다.',
            starter: "monsterX, monsterY = 200, 100\nmonsterSize = (60, 52)\nfor missileX, missileY in [(230, 120), (190, 120), (230, 160), (259, 151)] :\n    # TODO: 맞았으면 '맞음', 아니면 '빗나감'\n    pass\n",
            solution: "monsterX, monsterY = 200, 100\nmonsterSize = (60, 52)\nfor missileX, missileY in [(230, 120), (190, 120), (230, 160), (259, 151)] :\n    if (monsterX < missileX and missileX < monsterX + monsterSize[0]) and \\\n        (monsterY < missileY and missileY < monsterY + monsterSize[1]) :\n        print(missileX, missileY, '맞음')\n    else :\n        print(missileX, missileY, '빗나감')\n",
            expect: '230 120 맞음\n190 120 빗나감\n230 160 빗나감\n259 151 맞음'
          }
        ],
        quiz: [
          { q: '<code>random.randrange(1, 5)</code> 가 돌려줄 수 <b>없는</b> 값은?', options: ['5', '1', '3', '4'], answer: 0,
            explain: 'randrange(시작, 끝) 은 끝 값을 포함하지 않으므로 1~4 입니다.' },
          { q: 'Code14-13 에서 <code>missileX, missileY = None, None</code> 이 뜻하는 것은?', options: ['지금 날아가는 미사일이 없다', '미사일이 화면 왼쪽 위에 있다', '미사일 그림을 불러오지 못했다', '미사일이 괴물을 맞혔다'], answer: 0,
            explain: 'None 을 “없음” 의 표시로 약속했습니다. 발사할 때 좌표가 정해지고, 화면 위로 나가거나 맞히면 다시 None 이 됩니다.' },
          { q: '괴물이 (100, 50), 크기 (60, 52) 일 때 맞은 것으로 판정되는 미사일 위치는?<pre><code>if (monsterX &lt; missileX and missileX &lt; monsterX + monsterSize[0]) and \\\n   (monsterY &lt; missileY and missileY &lt; monsterY + monsterSize[1]) :</code></pre>', options: ['(150, 90)', '(170, 90)', '(150, 110)', '(100, 60)'], answer: 0,
            explain: 'x 는 100 초과 160 미만, y 는 50 초과 102 미만이어야 합니다. (150, 90) 만 해당합니다.' },
          { q: 'pygame 에서 화면에 글자를 쓰는 올바른 순서는?', options: ['글꼴 만들기 → render 로 글자 그림 → blit', 'blit → render → 글꼴 만들기', 'print() 로 출력', 'fill 에 글자를 넘긴다'], answer: 0,
            explain: 'font.SysFont(…) 로 글꼴, render(글자, True, 색) 로 글자 그림(Surface)을 만든 뒤 blit 합니다.' },
          { q: 'writeScore() 안의 <code>r, g, b</code> 가 항상 0 인 이유는?', options: ['playGame() 의 r, g, b 는 지역 변수이고, writeScore 는 전역 r, g, b(0)를 읽기 때문', 'random 이 항상 0 을 돌려주기 때문', 'render 가 색을 무시하기 때문', 'tick(50) 때문'], answer: 0,
            explain: 'global 선언 없이 함수 안에서 대입한 변수는 지역 변수입니다. 다른 함수에서는 전역 변수만 보입니다.' }
        ],
        slides: [
          { layout: 'title', title: '우주괴물 · 미사일 · 점수', subtitle: 'Chapter 14 · 14-5 — Code14-12 ~ Code14-14 ([프로젝트 2] 완성)', badge: '14-5',
            notes: '<p>지난 시간의 Code14-11 을 띄워 두고 시작합니다. 오늘은 기능 3·4·5 를 채워 게임을 완성합니다.</p>' },
          { layout: 'code', title: '무작위로 괴물 고르기', code: C_RANDOM_MON, points: ['<code>random.choice(리스트)</code>', 'randrange 는 끝 값 제외', '위치: 위쪽 30%, 속도: 1~4'],
            notes: '<p>seed 는 결과 고정용이라 게임에서는 쓰지 않는다고 말합니다. 줄 끝 \\ 로 리스트를 여러 줄에 쓰는 것도 확인.</p>' },
          { layout: 'code', title: 'Code14-12 핵심: 괴물 자동 이동', code: F_MONSTER, run: false, points: ['이벤트와 무관 → 매 반복 이동', '오른쪽 끝을 지나면 새 괴물', '그림 · 크기 · 위치 · 속도 다시 정함'],
            notes: '<p>본문 Code14-12 전체를 실행해 괴물이 계속 바뀌며 나타나는 것을 확인합니다. 발문: “괴물이 오른쪽에서 왼쪽으로 가게 하려면?”</p>' },
          { layout: 'code', title: '미사일의 일생 (흉내 내기)', code: C_MISSILE_SIM, points: ['None = 미사일 없음', '발사: 우주선 가운데', '매 반복 y -= 10', 'y &lt; 0 이면 다시 None'],
            notes: '<p>화면 없이 while 로 미사일의 움직임을 흉내 내면 이해가 쉽습니다. 결과 57번.</p>' },
          { layout: 'code', title: 'Code14-13 핵심: 발사와 이동', code: F_FIRE, run: false, points: ['K_SPACE 로 발사', '날아가는 중엔 새로 못 쏨', '화면 위로 나가면 소멸'],
            notes: '<p>… 부분은 사이에 다른 코드가 있다는 표시입니다. 본문의 Code14-13 전체를 실행하게 합니다.</p>' },
          { layout: 'diagram', title: '충돌 판정의 원리', html: SVG_HIT, notes: '<p>괴물 사각형의 네 경계와 미사일 점을 비교합니다. 칠판에 수직선을 그려 x 범위, y 범위를 따로 생각하게 하면 좋습니다.</p>' },
          { layout: 'code', title: '충돌 판정 연습', code: C_HIT_FUNC, points: ['네 조건을 and 로', '경계와 같으면 안 맞음'],
            notes: '<p>값을 바꿔 가며 True/False 를 예측하게 합니다.</p>' },
          { layout: 'code', title: 'Code14-14 핵심: 맞히면 점수', code: F_HIT, run: false, points: ['fireCount += 1', '괴물 새로 준비', '미사일 None', '매 반복 writeScore'],
            notes: '<p>맞힌 뒤 괴물과 미사일을 “초기화” 하는 코드가 처음 준비 코드와 같다는 점 → 함수로 묶으면 더 좋다는 리팩터링 이야기도 할 수 있습니다.</p>' },
          { layout: 'code', title: '점수 쓰기: writeScore()', code: F_SCORE, run: false, points: ['SysFont(\'malgungothic\', 20)', 'render(글자, True, 색)', 'blit 으로 왼쪽 아래에'],
            notes: '<p>교재의 NanumGothic.ttf 파일 대신 맑은 고딕을 이름으로 부른다고 설명합니다. 글자색이 늘 흰색인 이유(지역/전역)를 퀴즈처럼 물어보세요.</p>' },
          { layout: 'code', title: '함수가 보는 변수', code: C_SCOPE, points: ['global 없으면 지역 변수', '다른 함수는 전역만 본다'],
            notes: '<p>9장 함수 단원 복습입니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '괴물 (100, 50), 크기 (60, 52) — 맞은 미사일 위치는?', options: ['(150, 90)', '(170, 90)', '(150, 110)', '(100, 60)'], answer: 0,
            explain: 'x: 100 초과 160 미만, y: 50 초과 102 미만', notes: '<p>경계값 (100, 60) 이 왜 빗나감인지도 묻습니다.</p>' },
          { layout: 'practice', title: '실습 14-10. 충돌 판정 표', desc: '괴물 (200, 100), 크기 (60, 52) 일 때 미사일 네 위치의 맞음/빗나감 출력',
            starter: "monsterX, monsterY = 200, 100\nmonsterSize = (60, 52)\nfor missileX, missileY in [(230, 120), (190, 120), (230, 160), (259, 151)] :\n    # TODO\n    pass\n",
            solution: "monsterX, monsterY = 200, 100\nmonsterSize = (60, 52)\nfor missileX, missileY in [(230, 120), (190, 120), (230, 160), (259, 151)] :\n    if (monsterX < missileX and missileX < monsterX + monsterSize[0]) and \\\n        (monsterY < missileY and missileY < monsterY + monsterSize[1]) :\n        print(missileX, missileY, '맞음')\n    else :\n        print(missileX, missileY, '빗나감')\n",
            notes: '<p>도전 과제 실습 14-9(놓친 수 · 게임 오버)는 본문에서 진행합니다. 시간이 남으면 “더 발전시켜 보기” 목록 중 하나를 골라 보게 합니다.</p>' },
          { layout: 'summary', title: 'Chapter 14 정리', bullets: ['외부 라이브러리: pip install → import', '미니 포토샵: 메뉴 · 원본 복사 · Pillow 가공 · 출력', '슈팅 게임: 게임 루프 안에서 위치 변경 · 그리기', 'None 으로 “없음” 표시, 좌표 비교로 충돌 판정', '큰 프로그램 = 뼈대 먼저, 기능 하나씩'],
            notes: '<p>과정 전체를 마무리합니다. 두 프로젝트를 자기만의 기능으로 확장해 보는 것을 과제로 제안합니다.</p>' }
        ]
      }
    ]
  });
})();
