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

  /* ================================================================ 프로젝트 진행 방법 · 확장 (추가) */
  /* 프로젝트 진행 5단계 */
  const SVG_PROCESS = SV(1280, 470,
    BOX(40, 60, 210, 90, '① 요구 사항', { b: true, fs: 21 }) + T(145, 175, '무엇을 만들까?', { fs: 17, c: 'var(--muted)' }) + T(145, 200, '입력 · 출력 · 규칙', { fs: 17, c: 'var(--muted)' }) +
    Ln(255, 105, 295, 105, { arrow: true, sw: 3 }) +
    BOX(300, 60, 210, 90, '② 기능 분해', { b: true, fs: 21 }) + T(405, 175, '큰 일 → 작은 일', { fs: 17, c: 'var(--muted)' }) + T(405, 200, '기능 하나 = 함수 하나', { fs: 17, c: 'var(--muted)' }) +
    Ln(515, 105, 555, 105, { arrow: true, sw: 3 }) +
    BOX(560, 60, 210, 90, '③ 단계별 개발', { b: true, fs: 21, s: 'var(--ok)' }) + T(665, 175, '작게 만들고', { fs: 17, c: 'var(--ok)' }) + T(665, 200, '계속 실행해 보기', { fs: 17, c: 'var(--ok)' }) +
    Ln(775, 105, 815, 105, { arrow: true, sw: 3 }) +
    BOX(820, 60, 210, 90, '④ 리팩터링', { b: true, fs: 21 }) + T(925, 175, '중복 없애기', { fs: 17, c: 'var(--muted)' }) + T(925, 200, '이름 · 구조 다듬기', { fs: 17, c: 'var(--muted)' }) +
    Ln(1035, 105, 1075, 105, { arrow: true, sw: 3 }) +
    BOX(1080, 60, 160, 90, '⑤ 확장', { b: true, fs: 21 }) + T(1160, 175, '기능 더하기', { fs: 17, c: 'var(--muted)' }) +
    `<path d="M925 240 V290 H665 V165" fill="none" stroke="var(--accent2)" stroke-width="3" stroke-dasharray="8 6" marker-end="url(#arr14)"/>` +
    T(795, 315, '다듬은 뒤 다시 ③ 으로 — 작은 바퀴를 여러 번 돈다', { fs: 19, c: 'var(--accent2)' }) +
    R(40, 350, 1200, 90, { dash: true, s: 'var(--warn)' }) +
    T(640, 385, '한 번에 완성하려고 하지 않는다. 20~30줄 쓸 때마다 ▶ 실행해서 “지금까지는 맞다” 를 확인한다.', { fs: 20 }) +
    T(640, 418, '오류는 마지막에 몰아서 만나는 것보다 방금 쓴 줄에서 만나는 편이 훨씬 고치기 쉽다.', { fs: 19, c: 'var(--muted)' }));

  /* 게임 루프 4단계 */
  const SVG_LOOP4 = SV(1280, 420,
    BOX(60, 60, 250, 80, '① 입력 (input)', { b: true, fs: 21, s: 'var(--accent2)' }) + T(185, 170, 'event.get()', { mono: true, fs: 17 }) + T(185, 196, '키 · 마우스 · 창 닫기', { fs: 16, c: 'var(--muted)' }) +
    Ln(315, 100, 355, 100, { arrow: true, sw: 3 }) +
    BOX(360, 60, 250, 80, '② 갱신 (update)', { b: true, fs: 21, s: 'var(--accent2)' }) + T(485, 170, '위치 · 점수 · 충돌', { fs: 17 }) + T(485, 196, '화면은 건드리지 않는다', { fs: 16, c: 'var(--muted)' }) +
    Ln(615, 100, 655, 100, { arrow: true, sw: 3 }) +
    BOX(660, 60, 250, 80, '③ 그리기 (draw)', { b: true, fs: 21, s: 'var(--accent2)' }) + T(785, 170, 'fill → blit → update()', { mono: true, fs: 16 }) + T(785, 196, '계산은 하지 않는다', { fs: 16, c: 'var(--muted)' }) +
    Ln(915, 100, 955, 100, { arrow: true, sw: 3 }) +
    BOX(960, 60, 250, 80, '④ 대기 (tick)', { b: true, fs: 21, s: 'var(--accent2)' }) + T(1085, 170, 'clock.tick(50)', { mono: true, fs: 17 }) + T(1085, 196, '초당 프레임 수를 맞춤', { fs: 16, c: 'var(--muted)' }) +
    `<path d="M1085 230 V265 H185 V150" fill="none" stroke="var(--ok)" stroke-width="3" marker-end="url(#arr14)"/>` +
    T(640, 300, '이 네 가지를 섞지 않는 것이 게임 코드를 읽기 쉽게 만드는 첫 번째 규칙', { fs: 20, b: true, c: 'var(--ok)' }) +
    T(640, 345, '②를 함수로 떼어 내면 화면 없이도 시험할 수 있다 → 버그를 찾기 쉬워진다', { fs: 19 }) +
    T(640, 385, '1 프레임 = ①②③④ 한 바퀴 · 1초에 50 프레임이면 50번 반복', { fs: 18, c: 'var(--muted)' }));

  /* 타자 연습 화면 구성 */
  const SVG_TYPING = SV(1280, 470,
    R(120, 40, 620, 380, { s: 'var(--accent)', sw: 3 }) + T(430, 30, '타자 연습 창 (560 × 300)', { fs: 18, c: 'var(--accent)' }) +
    T(430, 95, '따라 치고 엔터!', { fs: 18, c: 'var(--muted)' }) +
    R(160, 120, 540, 60, { f: 'var(--card)' }) + T(430, 160, '작게 만들고 자주 실행해 보자', { fs: 24, b: true, c: 'var(--accent2)' }) +
    T(180, 205, '① 제시 문장 (Label)', { fs: 16, a: 'start', c: 'var(--muted)' }) +
    R(160, 225, 540, 54, { f: 'var(--card)', s: 'var(--accent)' }) + T(180, 258, '작게 만들고 자|', { fs: 22, a: 'start', mono: true }) +
    T(180, 300, '② 입력칸 (Entry) — Return 키에 함수를 연결', { fs: 16, a: 'start', c: 'var(--muted)' }) +
    R(160, 320, 250, 46, { f: 'var(--card)' }) + T(285, 350, '3 / 8 문장', { fs: 19 }) +
    R(430, 320, 270, 46, { f: 'var(--card)' }) + T(565, 350, '정확도 96.5%', { fs: 19 }) +
    T(180, 395, '③ 상태 표시 (Label) — 진행 · 통계', { fs: 16, a: 'start', c: 'var(--muted)' }) +
    T(1010, 90, '화면에 보이는 것', { b: true, fs: 21 }) +
    T(1010, 130, '문장 · 입력칸 · 상태 3가지', { fs: 18 }) +
    T(1010, 190, '화면 뒤에 숨은 것(상태)', { b: true, fs: 21, c: 'var(--warn)' }) +
    T(1010, 230, "index  지금 몇 번째 문장", { fs: 17, mono: true }) +
    T(1010, 258, "chars  지금까지 친 글자 수", { fs: 17, mono: true }) +
    T(1010, 286, "acc    문장별 정확도 목록", { fs: 17, mono: true }) +
    T(1010, 314, "start  시작한 시각", { fs: 17, mono: true }) +
    T(1010, 370, '→ 흩어진 전역 변수 대신', { fs: 18, c: 'var(--ok)' }) +
    T(1010, 398, 'state 딕셔너리 하나에 모은다', { fs: 18, c: 'var(--ok)', b: true }));

  /* 값 → 픽셀 좌표 */
  const SVG_CHART = SV(1280, 480,
    Ln(160, 400, 1160, 400, { sw: 3, s: 'var(--fg)' }) + Ln(160, 400, 160, 70, { sw: 3, s: 'var(--fg)' }) +
    T(120, 405, '0', { fs: 18 }) + T(120, 245, '520', { fs: 18 }) + T(110, 85, '1040', { fs: 18 }) +
    Ln(160, 80, 1160, 80, { dash: true }) + Ln(160, 240, 1160, 240, { dash: true }) +
    R(220, 363, 90, 37, { f: 'var(--accent)', op: 0.85, s: 'var(--accent)', rx: 2 }) + T(265, 430, '1월', { fs: 17 }) + T(265, 350, '120', { fs: 16 }) +
    R(380, 240, 90, 160, { f: 'var(--accent)', op: 0.85, s: 'var(--accent)', rx: 2 }) + T(425, 430, '5월', { fs: 17 }) + T(425, 227, '520', { fs: 16 }) +
    R(540, 80, 90, 320, { f: 'var(--danger)', op: 0.85, s: 'var(--danger)', rx: 2 }) + T(585, 430, '8월', { fs: 17 }) + T(585, 67, '1040', { fs: 16 }) +
    T(900, 130, '값을 그대로 y 로 쓰면 안 된다', { fs: 20, b: true, c: 'var(--warn)' }) +
    T(900, 175, '화면 y 는 아래로 갈수록 커지기 때문', { fs: 18, c: 'var(--muted)' }) +
    R(720, 210, 400, 120, { s: 'var(--ok)' }) +
    T(920, 252, 'top = BASE - 값 / 최대값 * 높이', { fs: 21, mono: true, b: true }) +
    T(920, 295, '(BASE = 바닥 선의 y, 높이 = 그래프 영역)', { fs: 16, c: 'var(--muted)' }) +
    T(640, 468, '데이터의 값을 화면의 좌표로 바꾸는 이 계산을 스케일 변환(scaling)이라고 한다', { fs: 19, c: 'var(--muted)' }));

  /* ---------------- 프로젝트 진행 · 디버깅 · 구조화 예제 */
  const C_LOOP_PURE = String.raw`# 게임 루프를 pygame 없이 흉내 내 보기 (입력 → 갱신 → 그리기)
def update(state, keys) :          # ② 갱신 : 화면은 건드리지 않고 값만 바꾼다
    if 'LEFT' in keys :
        state['x'] -= 5
    if 'RIGHT' in keys :
        state['x'] += 5
    state['frame'] += 1

def draw(state) :                  # ③ 그리기 : 값을 보여 주기만 한다
    print('프레임 %d : 우주선 x = %d' % (state['frame'], state['x']))

state = {'x' : 250, 'frame' : 0}
inputs = [[], ['RIGHT'], ['RIGHT'], ['LEFT'], []]   # ① 입력 (실제로는 event.get())
for keys in inputs :               # 실제 게임에서는 while True 로 계속 돈다
    update(state, keys)
    draw(state)`;

  const C_DEBUG = String.raw`# "평균이 이상하다" 는 버그를 찾아가는 과정
scores = ['90', '80', '70']

print(scores)              # ① 눈으로 보면 숫자 같지만
print(type(scores[0]))     # ② 자료형을 확인하면 문자열이다
print(repr(scores[0]))     # ③ repr 은 따옴표까지 보여 준다

total = 0
for s in scores :
    total += int(s)        # ④ 그래서 int() 로 바꿔서 더해야 한다
print('평균 :', total / len(scores))`;

  const C_ASSERT = String.raw`def accuracy(target, typed) :
    """친 글자를 한 자씩 비교해 정확도(%)를 돌려준다"""
    hit = 0
    for i in range(min(len(target), len(typed))) :
        if target[i] == typed[i] :
            hit += 1
    return hit / max(len(target), 1) * 100

print('%.1f' % accuracy('파이썬은 재미있다', '파이썬은 재미있다'))
print('%.1f' % accuracy('파이썬은 재미있다', '파이썬은 재미없다'))
print('%.1f' % accuracy('파이썬은 재미있다', '파이썬'))
print('%.1f' % accuracy('파이썬은 재미있다', ''))

assert accuracy('abc', 'abc') == 100.0      # 스스로 검사하는 작은 시험
assert accuracy('abc', 'xyz') == 0.0
print('테스트 통과!')`;

  const C_UNDO = String.raw`history = []            # 되돌리기용 이전 상태 보관 (스택)
photo2 = '원본'

def apply(name) :
    global photo2
    history.append(photo2)          # ① 바꾸기 전 상태를 쌓아 두고
    photo2 = photo2 + ' → ' + name  # ② 가공한다
    print('처리 :', photo2)

def undo() :
    global photo2
    if len(history) == 0 :          # 되돌릴 것이 없으면
        print('되돌릴 작업이 없습니다')
        return
    photo2 = history.pop()          # 가장 최근 상태를 꺼낸다
    print('되돌림 :', photo2)

apply('흑백')
apply('블러')
undo()
undo()
undo()`;

  const C_BRIGHT_LOOP = String.raw`from PIL import Image, ImageEnhance

def bright_loop(img, value) :          # ① 점을 하나씩 돌며 밝기를 곱한다
    out = img.copy()
    w, h = out.size
    for y in range(h) :
        for x in range(w) :
            r, g, b = out.getpixel((x, y))
            out.putpixel((x, y), (min(255, int(r * value)), min(255, int(g * value)), min(255, int(b * value))))
    return out

def bright_lib(img, value) :           # ② 같은 일을 라이브러리에 맡긴다
    return ImageEnhance.Brightness(img).enhance(value)

photo = Image.open('JPG/picture03.jpg').convert('RGB').resize((40, 25))
a = bright_loop(photo, 1.5)
b = bright_lib(photo, 1.5)
print('원본 점    :', photo.getpixel((10, 10)))
print('직접 계산  :', a.getpixel((10, 10)))
print('라이브러리 :', b.getpixel((10, 10)))
print('같은 결과인가? :', a.getpixel((10, 10)) == b.getpixel((10, 10)))
print('점의 수 :', photo.width * photo.height)`;

  const C_SPEED = String.raw`import time
from PIL import Image, ImageOps

photo = Image.open('JPG/picture01.jpg').convert('RGB')
print('사진 크기 :', photo.size, '→ 점', photo.width * photo.height, '개')

start = time.perf_counter()
gray1 = photo.copy()
for y in range(gray1.height) :          # 방법 A : 점을 하나씩
    for x in range(gray1.width) :
        r, g, b = gray1.getpixel((x, y))
        v = int(r * 0.299 + g * 0.587 + b * 0.114)
        gray1.putpixel((x, y), (v, v, v))
ta = time.perf_counter() - start

start = time.perf_counter()
gray2 = ImageOps.grayscale(photo)       # 방법 B : 라이브러리에 맡기기
tb = time.perf_counter() - start

print('A 직접 반복 : %.3f 초' % ta)
print('B 라이브러리 : %.3f 초' % tb)
print('약 %.0f 배 차이' % (ta / max(tb, 0.000001)))`;

  const C_HIGHSCORE = String.raw`def load_best(fname) :
    try :
        with open(fname, encoding = 'utf-8') as f :
            return int(f.read().strip())
    except FileNotFoundError :      # 아직 파일이 없으면 최고 점수는 0
        return 0
    except ValueError :             # 파일 내용이 숫자가 아니면
        return 0

def save_best(fname, score) :
    with open(fname, 'w', encoding = 'utf-8') as f :
        f.write(str(score))

best = load_best('best.txt')
print('처음 최고 점수 :', best)

for score in [3, 7, 5] :
    if score > best :
        best = score
        save_best('best.txt', best)
        print(score, '점 → 신기록!')
    else :
        print(score, '점 (최고 기록은', best, '점)')

print('저장된 값 :', load_best('best.txt'))`;

  const C_LEVEL = String.raw`def level_of(score) :
    return min(5, 1 + score // 5)        # 5마리마다 한 단계, 최고 5단계

def monster_speed(score) :
    return 1 + score // 3                # 3마리마다 1씩 빨라짐

for score in [0, 2, 3, 8, 15, 30] :
    print('점수 %2d → 레벨 %d · 기본 속도 + %d' % (score, level_of(score), monster_speed(score) - 1))`;

  /* ---------------- 미니 포토샵 확장판 (리팩터링 · 되돌리기 · 저장 형식) */
  const C_PS_PLUS = String.raw`from tkinter import *
from tkinter import messagebox
from tkinter.filedialog import *
from PIL import Image, ImageFilter, ImageEnhance, ImageOps, ImageTk

## 함수 선언 부분 ##
def displayImage(img) :
    global canvas, paper
    if canvas != None :
        canvas.destroy()
    canvas = Canvas(window, width = img.width, height = img.height)
    paper = ImageTk.PhotoImage(img)
    canvas.create_image((img.width / 2, img.height / 2), image = paper, state = "normal")
    canvas.pack()

def func_open() :
    global photo, photo2, history
    fname = askopenfilename(parent = window, filetypes = (("그림 파일", "*.jpg *.png *.gif *.bmp"), ("모든 파일", "*.*")))
    if fname == "" :
        return
    photo = Image.open(fname).convert('RGB')
    photo2 = photo.copy()
    history = []
    displayImage(photo2)
    status.configure(text = "%s  (%d x %d)" % (fname, photo2.width, photo2.height))

def func_saveas() :
    if photo2 == None :
        messagebox.showwarning("알림", "먼저 사진을 여세요.")
        return
    fname = asksaveasfilename(parent = window, defaultextension = ".png",
                              filetypes = (("PNG 파일", "*.png"), ("JPG 파일", "*.jpg"), ("모든 파일", "*.*")))
    if fname == "" :
        return
    if fname.lower().endswith(".jpg") or fname.lower().endswith(".jpeg") :
        photo2.convert('RGB').save(fname, quality = 92)   # JPG 는 투명을 저장하지 못한다
    else :
        photo2.save(fname)
    status.configure(text = "저장함 : " + fname)

def apply_effect(name) :
    """메뉴 13개 대신 함수 하나 — 이름으로 효과를 찾아 쓴다"""
    global photo2
    if photo2 == None :
        messagebox.showwarning("알림", "먼저 [파일] → [열기] 로 사진을 여세요.")
        return
    history.append(photo2.copy())        # 되돌리기용으로 지금 상태를 저장
    if len(history) > 10 :               # 메모리를 아끼려고 10단계까지만
        history.pop(0)
    photo2 = EFFECT[name](photo2)        # 효과가 차곡차곡 누적된다
    displayImage(photo2)
    status.configure(text = "%s 적용  ·  되돌리기 %d 단계 가능" % (name, len(history)))

def func_undo() :
    global photo2
    if len(history) == 0 :
        messagebox.showinfo("되돌리기", "되돌릴 작업이 없습니다.")
        return
    photo2 = history.pop()
    displayImage(photo2)
    status.configure(text = "되돌림  ·  남은 단계 %d" % len(history))

## 전역 변수 선언 부분 ##
EFFECT = {
    "좌우 반전" : lambda img : img.transpose(Image.FLIP_LEFT_RIGHT),
    "상하 반전" : lambda img : img.transpose(Image.FLIP_TOP_BOTTOM),
    "90도 회전" : lambda img : img.rotate(90, expand = True),
    "밝게"      : lambda img : ImageEnhance.Brightness(img).enhance(1.3),
    "어둡게"    : lambda img : ImageEnhance.Brightness(img).enhance(0.7),
    "대비 세게" : lambda img : ImageEnhance.Contrast(img).enhance(1.5),
    "블러링"    : lambda img : img.filter(ImageFilter.BLUR),
    "엠보싱"    : lambda img : img.filter(ImageFilter.EMBOSS),
    "흑백"      : lambda img : ImageOps.grayscale(img).convert('RGB'),
}
canvas, paper = None, None
photo, photo2 = None, None
history = []

## 메인 코드 부분 ##
window = Tk()
window.geometry("420x360")
window.title("미니 포토샵 플러스")

mainMenu = Menu(window)
window.config(menu = mainMenu)

fileMenu = Menu(mainMenu)
mainMenu.add_cascade(label = "파일", menu = fileMenu)
fileMenu.add_command(label = "열기", command = func_open)
fileMenu.add_command(label = "다른 이름으로 저장", command = func_saveas)
fileMenu.add_separator()
fileMenu.add_command(label = "종료", command = window.destroy)

editMenu = Menu(mainMenu)
mainMenu.add_cascade(label = "편집", menu = editMenu)
editMenu.add_command(label = "되돌리기", command = func_undo)
editMenu.add_separator()
for name in EFFECT :                     # 메뉴를 반복문으로 만든다
    editMenu.add_command(label = name, command = lambda n = name : apply_effect(n))

status = Label(window, text = "[파일] → [열기] 로 사진을 여세요", bd = 1, relief = SUNKEN, anchor = W)
status.pack(side = BOTTOM, fill = X)

window.mainloop()`;

  const C_LAMBDA_TRAP = String.raw`# 반복문 안에서 함수를 만들 때 흔히 걸리는 함정
funcs1, funcs2 = [], []
for name in ['블러', '엠보싱', '흑백'] :
    funcs1.append(lambda : name)            # 이름만 빌려 쓴다 (나중에 읽음)
    funcs2.append(lambda n = name : n)      # 지금 값을 기본값으로 붙잡아 둔다

print('잘못된 방법 :', [f() for f in funcs1])
print('올바른 방법 :', [f() for f in funcs2])`;

  /* ---------------- 슈팅 게임 확장판 */
  const C_GAME_PLUS = String.raw`import pygame
import random
import sys

## 전역 변수 선언 부분 ##
SW, SH = 500, 700                                       # 화면 크기
BEST_FILE = 'best_score.txt'
MONSTER_IMAGE = ['game/monster%02d.png' % i for i in range(1, 11)]

## 함수 선언 부분 ##
def load_best() :
    try :
        with open(BEST_FILE, encoding = 'utf-8') as f :
            return int(f.read().strip())
    except (FileNotFoundError, ValueError) :            # 첫 실행이면 기록이 없다
        return 0

def save_best(score) :
    with open(BEST_FILE, 'w', encoding = 'utf-8') as f :
        f.write(str(score))

def new_monster(score) :
    """점수가 오를수록 빨라지는 새 우주괴물 한 마리를 만든다"""
    img = pygame.image.load(random.choice(MONSTER_IMAGE))
    return {'img' : img, 'size' : img.get_rect().size,
            'x' : 0, 'y' : random.randrange(0, int(SW * 0.3)),
            'speed' : random.randrange(1, 5) + score // 5}

def play_sound(snd) :
    if snd != None :          # 소리 파일이 없으면 조용히 넘어간다
        snd.play()

def draw_text(text, x, y) :
    monitor.blit(font.render(text, True, (255, 255, 255)), (x, y))

def game_over(state) :
    best = max(state['best'], state['score'])
    save_best(best)
    print('게임 오버! 점수 :', state['score'], '/ 최고 기록 :', best)
    pygame.quit()
    sys.exit()

def play_game() :
    ship = pygame.image.load('game/ship02.png')
    shipSize = ship.get_rect().size
    missile = pygame.image.load('game/missile.png')
    clock = pygame.time.Clock()

    state = {'x' : SW / 2, 'y' : SH * 0.8, 'dx' : 0, 'dy' : 0,
             'mx' : None, 'my' : None, 'score' : 0, 'life' : 3, 'best' : load_best()}
    monster = new_monster(0)

    while True :
        # ① 입력
        for e in pygame.event.get() :
            if e.type == pygame.QUIT :
                game_over(state)
            if e.type == pygame.KEYDOWN :
                if e.key == pygame.K_LEFT : state['dx'] = -6
                elif e.key == pygame.K_RIGHT : state['dx'] = +6
                elif e.key == pygame.K_UP : state['dy'] = -6
                elif e.key == pygame.K_DOWN : state['dy'] = +6
                elif e.key == pygame.K_SPACE and state['mx'] == None :
                    state['mx'] = state['x'] + shipSize[0] / 2
                    state['my'] = state['y']
                    play_sound(shoot)
            if e.type == pygame.KEYUP :
                state['dx'], state['dy'] = 0, 0

        # ② 갱신
        if 0 < state['x'] + state['dx'] <= SW - shipSize[0] :
            state['x'] += state['dx']
        if SH / 2 < state['y'] + state['dy'] <= SH - shipSize[1] :
            state['y'] += state['dy']

        monster['x'] += monster['speed']
        if monster['x'] > SW :                          # 놓쳤다 → 생명 하나 감소
            state['life'] -= 1
            monster = new_monster(state['score'])

        if state['mx'] != None :
            state['my'] -= 12
            if state['my'] < 0 :
                state['mx'], state['my'] = None, None

        if state['mx'] != None :
            box = pygame.Rect(monster['x'], monster['y'], monster['size'][0], monster['size'][1])
            if box.collidepoint(state['mx'], state['my']) :
                state['score'] += 1
                play_sound(boom)
                monster = new_monster(state['score'])
                state['mx'], state['my'] = None, None

        if state['life'] <= 0 :
            game_over(state)

        # ③ 그리기
        monitor.fill((18, 18, 40))
        monitor.blit(ship, (int(state['x']), int(state['y'])))
        monitor.blit(monster['img'], (int(monster['x']), int(monster['y'])))
        if state['mx'] != None :
            monitor.blit(missile, (int(state['mx']), int(state['my'])))
        draw_text('점수 %d   생명 %d   최고 %d   레벨 %d'
                  % (state['score'], state['life'], max(state['best'], state['score']), 1 + state['score'] // 5), 10, SH - 40)
        pygame.display.update()

        # ④ 대기
        clock.tick(50)

## 메인 코드 부분 ##
pygame.init()
monitor = pygame.display.set_mode((SW, SH))
pygame.display.set_caption('우주괴물 무찌르기 — 확장판')
font = pygame.font.SysFont('malgungothic', 18)
try :
    shoot = pygame.mixer.Sound('game/shoot.wav')
    boom = pygame.mixer.Sound('game/boom.wav')
except Exception :          # 소리 파일이 없어도 게임은 돌아가야 한다
    shoot, boom = None, None

play_game()`;

  /* ---------------- [프로젝트 3] 타자 연습 */
  const TY_LOAD = String.raw`def load_sentences(fname) :
    """문장 파일을 한 줄씩 읽어 리스트로 돌려준다"""
    lines = []
    with open(fname, encoding = 'utf-8') as f :
        for line in f :
            line = line.strip()
            if line != "" :
                lines.append(line)
    return lines`;

  const TY1 = String.raw`from tkinter import *

## 함수 선언 부분 ##
def load_sentences(fname) :
    lines = []
    with open(fname, encoding = 'utf-8') as f :
        for line in f :
            line = line.strip()
            if line != "" :
                lines.append(line)
    return lines

## 전역 변수 선언 부분 ##
sentences = load_sentences('ch14/typing.txt')

## 메인 코드 부분 ##
window = Tk()
window.title("타자 연습 — 1단계 : 화면")
window.geometry("560x260")

lblGuide = Label(window, text = "아래 문장을 그대로 치고 엔터!", font = ('맑은고딕', 11), fg = "gray")
lblGuide.pack(pady = 10)

lblQuestion = Label(window, text = sentences[0], font = ('맑은고딕', 16, 'bold'), fg = "navy")
lblQuestion.pack(pady = 10)

entAnswer = Entry(window, width = 40, font = ('맑은고딕', 13))
entAnswer.pack(pady = 10)
entAnswer.focus_set()

lblStatus = Label(window, text = "1 / %d 문장" % len(sentences), font = ('맑은고딕', 11))
lblStatus.pack(pady = 15)

window.mainloop()`;

  const TY2 = String.raw`from tkinter import *
import time

## 함수 선언 부분 ##
def load_sentences(fname) :
    lines = []
    with open(fname, encoding = 'utf-8') as f :
        for line in f :
            line = line.strip()
            if line != "" :
                lines.append(line)
    return lines

def accuracy(target, typed) :
    hit = 0
    for i in range(min(len(target), len(typed))) :
        if target[i] == typed[i] :
            hit += 1
    return hit / max(len(target), 1) * 100

def show_question() :
    lblQuestion.configure(text = sentences[state['index']])
    lblStatus.configure(text = "%d / %d 문장" % (state['index'] + 1, len(sentences)))
    entAnswer.delete(0, END)

def check(event = None) :        # Return 키가 부르면 event 가 들어온다
    typed = entAnswer.get()
    if typed == "" :             # 빈칸으로 엔터를 치면 무시한다
        return
    state['acc'].append(accuracy(sentences[state['index']], typed))
    state['chars'] += len(typed)
    state['index'] += 1
    if state['index'] < len(sentences) :
        show_question()
    else :
        finish()

def finish() :
    spent = time.time() - state['start']
    avg = sum(state['acc']) / len(state['acc'])
    lblQuestion.configure(text = "끝났습니다!")
    lblStatus.configure(text = "%.1f초 · 정확도 %.1f%% · %d글자" % (spent, avg, state['chars']))
    entAnswer.delete(0, END)

## 전역 변수 선언 부분 ##
sentences = load_sentences('ch14/typing.txt')
state = {'index' : 0, 'chars' : 0, 'acc' : [], 'start' : time.time()}

## 메인 코드 부분 ##
window = Tk()
window.title("타자 연습 — 2단계 : 채점")
window.geometry("560x260")

Label(window, text = "아래 문장을 그대로 치고 엔터!", font = ('맑은고딕', 11), fg = "gray").pack(pady = 10)
lblQuestion = Label(window, text = "", font = ('맑은고딕', 16, 'bold'), fg = "navy")
lblQuestion.pack(pady = 10)
entAnswer = Entry(window, width = 40, font = ('맑은고딕', 13))
entAnswer.pack(pady = 10)
entAnswer.bind('<Return>', check)        # 엔터 키에 함수를 연결
entAnswer.focus_set()
lblStatus = Label(window, text = "", font = ('맑은고딕', 11))
lblStatus.pack(pady = 15)

show_question()
window.mainloop()`;

  const TY3 = String.raw`from tkinter import *
import datetime
import time

## 함수 선언 부분 ##
def load_sentences(fname) :
    try :
        with open(fname, encoding = 'utf-8') as f :
            return [line.strip() for line in f if line.strip() != ""]
    except FileNotFoundError :           # 문장 파일이 없어도 프로그램은 돌아가야 한다
        return ['파이썬은 재미있다', '작게 만들고 자주 실행하자']

def accuracy(target, typed) :
    hit = 0
    for i in range(min(len(target), len(typed))) :
        if target[i] == typed[i] :
            hit += 1
    return hit / max(len(target), 1) * 100

def save_result(spent, chars, acc) :
    when = datetime.datetime.now().strftime('%Y-%m-%d %H:%M')
    with open(RESULT_FILE, 'a', encoding = 'utf-8') as f :          # 'a' = 이어 쓰기
        f.write('%s,%.1f초,%d타,%.1f%%\n' % (when, spent, chars, acc))

def recent_results(n = 3) :
    try :
        with open(RESULT_FILE, encoding = 'utf-8') as f :
            lines = [line.strip() for line in f if line.strip() != ""]
    except FileNotFoundError :
        return ["아직 기록이 없습니다"]
    return lines[-n:]

def show_question() :
    lblQuestion.configure(text = sentences[state['index']])
    lblStatus.configure(text = "%d / %d 문장" % (state['index'] + 1, len(sentences)))
    entAnswer.delete(0, END)
    entAnswer.focus_set()

def check(event = None) :
    typed = entAnswer.get()
    if typed == "" :
        return
    state['acc'].append(accuracy(sentences[state['index']], typed))
    state['chars'] += len(typed)
    state['index'] += 1
    if state['index'] < len(sentences) :
        show_question()
    else :
        finish()

def finish() :
    spent = max(0.1, time.time() - state['start'])       # 0 으로 나누지 않도록
    acc = sum(state['acc']) / len(state['acc'])
    speed = state['chars'] / spent * 60                  # 분당 타수
    lblQuestion.configure(text = "수고했어요!")
    lblStatus.configure(text = "%.1f초 · 분당 %.0f타 · 정확도 %.1f%%" % (spent, speed, acc))
    entAnswer.delete(0, END)
    save_result(spent, state['chars'], acc)
    lblRecord.configure(text = "최근 기록\n" + "\n".join(recent_results()))

def restart() :
    state['index'], state['chars'] = 0, 0
    state['acc'] = []
    state['start'] = time.time()
    show_question()

## 전역 변수 선언 부분 ##
RESULT_FILE = 'typing_result.txt'
sentences = load_sentences('ch14/typing.txt')
state = {'index' : 0, 'chars' : 0, 'acc' : [], 'start' : time.time()}

## 메인 코드 부분 ##
window = Tk()
window.title("타자 연습")
window.geometry("600x360")

Label(window, text = "아래 문장을 그대로 치고 엔터!", font = ('맑은고딕', 11), fg = "gray").pack(pady = 8)
lblQuestion = Label(window, text = "", font = ('맑은고딕', 16, 'bold'), fg = "navy")
lblQuestion.pack(pady = 8)
entAnswer = Entry(window, width = 40, font = ('맑은고딕', 13))
entAnswer.pack(pady = 8)
entAnswer.bind('<Return>', check)
lblStatus = Label(window, text = "", font = ('맑은고딕', 12))
lblStatus.pack(pady = 6)
Button(window, text = "다시 시작", command = restart).pack(pady = 4)
lblRecord = Label(window, text = "최근 기록\n" + "\n".join(recent_results()), font = ('맑은고딕', 10), fg = "gray")
lblRecord.pack(pady = 8)

show_question()
window.mainloop()`;

  const C_RESULT_FILE = String.raw`RESULT_FILE = 'typing_result.txt'

def save_result(when, spent, chars, acc) :
    with open(RESULT_FILE, 'a', encoding = 'utf-8') as f :   # 'a' = 이어 쓰기(덮어쓰지 않음)
        f.write('%s,%.1f초,%d타,%.1f%%\n' % (when, spent, chars, acc))

def recent_results(n = 3) :
    try :
        with open(RESULT_FILE, encoding = 'utf-8') as f :
            return [line.strip() for line in f if line.strip() != ""][-n:]
    except FileNotFoundError :
        return []

print('처음 기록 :', recent_results())
save_result('2026-03-02 10:00', 25.4, 120, 97.5)
save_result('2026-03-02 10:05', 22.1, 121, 99.0)
save_result('2026-03-02 10:11', 20.8, 122, 99.5)
save_result('2026-03-02 10:20', 19.3, 123, 100.0)
for line in recent_results() :
    print(line)`;

  /* ---------------- [프로젝트 4] CSV 막대그래프 */
  const CH_LOAD = String.raw`import csv

def load_sales(fname) :
    """CSV 파일을 읽어 (열 이름, 숫자 행 목록) 을 돌려준다"""
    rows = []
    with open(fname, encoding = 'utf-8') as f :
        reader = csv.reader(f)
        head = next(reader)                 # 첫 줄은 제목 줄
        for line in reader :
            rows.append([int(v) for v in line])
    return head, rows

head, rows = load_sales('ch14/sales.csv')
print('열 이름 :', head)
print('행 수   :', len(rows))
print('첫 행   :', rows[0])
print('끝 행   :', rows[-1])

ice = [r[1] for r in rows]
print('합계 :', sum(ice))
print('평균 : %.1f' % (sum(ice) / len(ice)))
print('최대 :', max(ice), '(', rows[ice.index(max(ice))][0], '월 )')
print('최소 :', min(ice), '(', rows[ice.index(min(ice))][0], '월 )')`;

  const C_SCALE = String.raw`CHART_H = 300          # 그래프 영역의 높이(픽셀)
BASE_Y = 340           # 막대가 서 있는 바닥 선의 y 좌표

def bar_top(value, vmax) :
    """값을 화면 y 좌표로 바꾼다 (값이 클수록 위 = y 가 작다)"""
    return BASE_Y - value / vmax * CHART_H

vmax = 1040
for v in [120, 520, 1040] :
    print(v, '→ y =', round(bar_top(v, vmax), 1), ', 막대 높이 =', round(BASE_Y - bar_top(v, vmax), 1))

print('0 의 y :', bar_top(0, vmax))
print('최대값의 y :', bar_top(vmax, vmax))`;

  const CH2 = String.raw`from tkinter import *
import csv

## 함수 선언 부분 ##
def load_sales(fname) :
    rows = []
    with open(fname, encoding = 'utf-8') as f :
        reader = csv.reader(f)
        head = next(reader)
        for line in reader :
            rows.append([int(v) for v in line])
    return head, rows

## 전역 변수 선언 부분 ##
W, H = 640, 400
LEFT, BASE, CHART_H = 70, 340, 260       # 왼쪽 여백 · 바닥 선 · 그래프 높이
head, rows = load_sales('ch14/sales.csv')
values = [r[1] for r in rows]
vmax = max(values)

## 메인 코드 부분 ##
window = Tk()
window.title("2단계 : 막대만 그리기")
canvas = Canvas(window, width = W, height = H, bg = "white")
canvas.pack()

for i in range(len(values)) :
    x = LEFT + i * 46
    top = BASE - values[i] / vmax * CHART_H       # 값 → 화면 좌표
    canvas.create_rectangle(x, top, x + 36, BASE, fill = "#4c8dff", outline = "")

window.mainloop()`;

  const CH3 = String.raw`from tkinter import *
from tkinter import messagebox
import csv

## 함수 선언 부분 ##
def load_sales(fname) :
    rows = []
    with open(fname, encoding = 'utf-8') as f :
        reader = csv.reader(f)
        head = next(reader)
        for line in reader :
            rows.append([int(v) for v in line])
    return head, rows

def summary(values) :
    """합계 · 평균 · 최대 · 최소를 한 번에 계산한다"""
    return {'합계' : sum(values), '평균' : sum(values) / len(values),
            '최대' : max(values), '최소' : min(values)}

def draw_chart(col) :
    canvas.delete(ALL)                                 # 다시 그리기 전에 지운다
    values = [r[col] for r in rows]
    vmax = max(values)
    st = summary(values)

    canvas.create_text(W / 2, 26, text = "월별 " + head[col] + " 판매량",
                       font = ('맑은고딕', 15, 'bold'))
    for k in range(0, 5) :                             # 가로 눈금선 5개
        v = vmax * k / 4
        y = BASE - v / vmax * CHART_H
        canvas.create_line(LEFT, y, W - 20, y, fill = "#dddddd")
        canvas.create_text(LEFT - 8, y, text = str(int(v)), anchor = E, font = ('맑은고딕', 9))

    avgY = BASE - st['평균'] / vmax * CHART_H           # 평균선
    canvas.create_line(LEFT, avgY, W - 20, avgY, fill = "red")
    canvas.create_text(W - 24, avgY - 10, text = "평균 %.0f" % st['평균'],
                       fill = "red", anchor = E, font = ('맑은고딕', 10))

    for i in range(len(rows)) :
        x = LEFT + i * 46
        top = BASE - values[i] / vmax * CHART_H
        color = "#ff7043" if values[i] == vmax else "#4c8dff"    # 최대값만 다른 색
        canvas.create_rectangle(x, top, x + 36, BASE, fill = color, outline = "")
        canvas.create_text(x + 18, top - 10, text = str(values[i]), font = ('맑은고딕', 9))
        canvas.create_text(x + 18, BASE + 16, text = "%d월" % rows[i][0], font = ('맑은고딕', 10))

    canvas.create_line(LEFT, BASE, W - 20, BASE)       # x 축
    canvas.create_line(LEFT, BASE, LEFT, 45)           # y 축
    lblInfo.configure(text = "합계 %d · 평균 %.1f · 최대 %d · 최소 %d"
                             % (st['합계'], st['평균'], st['최대'], st['최소']))

def change(value) :
    draw_chart(1 if value == head[1] else 2)

def save_summary() :
    with open('sales_summary.txt', 'w', encoding = 'utf-8') as f :
        for col in (1, 2) :
            st = summary([r[col] for r in rows])
            f.write("%s 합계 %d 평균 %.1f 최대 %d 최소 %d\n"
                    % (head[col], st['합계'], st['평균'], st['최대'], st['최소']))
    messagebox.showinfo("저장", "sales_summary.txt 로 저장했습니다.")

## 전역 변수 선언 부분 ##
W, H = 640, 400
LEFT, BASE, CHART_H = 70, 340, 260
head, rows = load_sales('ch14/sales.csv')

## 메인 코드 부분 ##
window = Tk()
window.title("월별 판매량 막대그래프")

topFrame = Frame(window)
topFrame.pack(pady = 6)
choice = StringVar(value = head[1])
OptionMenu(topFrame, choice, head[1], head[2], command = change).pack(side = LEFT, padx = 6)
Button(topFrame, text = "요약 저장", command = save_summary).pack(side = LEFT, padx = 6)

lblInfo = Label(window, text = "", font = ('맑은고딕', 11))
lblInfo.pack()
canvas = Canvas(window, width = W, height = H, bg = "white")
canvas.pack()

draw_chart(1)
window.mainloop()`;

  const C_SUMMARY_FILE = String.raw`import csv

def load_sales(fname) :
    rows = []
    with open(fname, encoding = 'utf-8') as f :
        reader = csv.reader(f)
        head = next(reader)
        for line in reader :
            rows.append([int(v) for v in line])
    return head, rows

def summary(values) :
    return {'합계' : sum(values), '평균' : sum(values) / len(values),
            '최대' : max(values), '최소' : min(values)}

head, rows = load_sales('ch14/sales.csv')
with open('sales_summary.txt', 'w', encoding = 'utf-8') as f :
    for col in (1, 2) :
        st = summary([r[col] for r in rows])
        f.write('%s 합계 %d 평균 %.1f 최대 %d 최소 %d\n'
                % (head[col], st['합계'], st['평균'], st['최대'], st['최소']))

with open('sales_summary.txt', encoding = 'utf-8') as f :
    print(f.read(), end = '')`;

  const C_MODULE_SPLIT = String.raw`# ===== File: salesdata.py =====
"""데이터를 읽고 통계를 내는 부분만 모은 모듈 (화면과 상관없다)"""
import csv

def load_sales(fname) :
    rows = []
    with open(fname, encoding = 'utf-8') as f :
        reader = csv.reader(f)
        head = next(reader)
        for line in reader :
            rows.append([int(v) for v in line])
    return head, rows

def summary(values) :
    return {'합계' : sum(values), '평균' : sum(values) / len(values),
            '최대' : max(values), '최소' : min(values)}

# ===== File: main.py =====
import salesdata

head, rows = salesdata.load_sales('ch14/sales.csv')
st = salesdata.summary([r[1] for r in rows])
print(head[1], '통계 :', st)
print('화면을 그리는 코드는 main.py 에, 계산하는 코드는 salesdata.py 에 둔다')`;

  PY_COURSE.addChapter({
    id: 'ch14',
    no: '14',
    title: '미니 프로젝트',
    subtitle: 'Pillow 미니 포토샵 · pygame 슈팅 게임',
    summary: '외부 라이브러리 Pillow 로 사진을 열고 확대 · 회전 · 밝기 · 필터 · 흑백 처리를 하는 [미니 포토샵]을 tkinter 메뉴로 만들고, pygame 으로 [우주괴물 무찌르기] 슈팅 게임을 기능별로 한 단계씩 완성합니다. 이어서 요구 사항 정리 → 기능 분해 → 단계별 개발 → 리팩터링 → 확장이라는 프로젝트 진행 방법을 직접 적용해 [타자 연습]과 [판매량 막대그래프] 두 프로젝트를 더 만들고, 코드 정리와 README 쓰기로 마무리합니다.',
    goals: [
      '프로젝트를 요구 사항 → 기능 분해 → 단계별 개발 → 리팩터링 → 확장의 순서로 진행할 수 있다',
      '화면 코드와 계산 코드를 나누고, 상태를 딕셔너리 · 클래스로 묶어 전역 변수를 줄일 수 있다',
      '외부 라이브러리(Pillow, pygame)를 설치하고 import 해서 활용할 수 있다',
      'tkinter 메뉴와 대화상자로 프로그램의 틀을 만들고 메뉴마다 함수를 연결할 수 있다',
      'Pillow 의 Image · ImageFilter · ImageEnhance · ImageOps 로 컬러 이미지를 처리할 수 있다',
      '원본과 결과 이미지를 나누어 관리하고 화면(캔버스)에 출력하는 구조를 설명할 수 있다',
      'pygame 의 게임 루프(이벤트 → 계산 → 그리기 → 업데이트)를 이해하고 키보드로 물체를 움직일 수 있다',
      '무작위 등장 · 미사일 발사 · 충돌 판정 · 점수 표시를 갖춘 슈팅 게임을 완성할 수 있다',
      '되돌리기 · 저장 형식 선택 · 난이도 · 생명 · 최고 점수 기록으로 프로그램을 확장할 수 있다',
      'tkinter 와 파일 · 시간을 엮어 타자 연습 프로그램을 스스로 설계해 만들 수 있다',
      'CSV 데이터를 읽어 통계를 내고 Canvas 에 막대그래프로 그릴 수 있다',
      '코드를 모듈로 나누어 정리하고 README 를 써서 프로젝트를 설명할 수 있다'
    ],
    sections: [
      /* ============================================================ 14-1 */
      {
        id: 'ch14-1',
        title: '미니 포토샵 준비: Pillow 와 메뉴 뼈대',
        minutes: 50,
        goals: [
          '프로젝트 진행 5단계(요구 사항 → 기능 분해 → 단계별 개발 → 리팩터링 → 확장)를 설명할 수 있다',
          'print · type · repr 로 버그를 좁혀 가는 디버깅 요령을 쓸 수 있다',
          '외부 라이브러리가 무엇인지 알고 pip 로 설치하는 방법을 설명할 수 있다',
          'Pillow 로 사진을 열어 크기 · 형식 · 점의 색을 알아낼 수 있다',
          '미니 포토샵의 메뉴 구성도를 보고 필요한 함수를 정리할 수 있다',
          'Menu · add_cascade · add_command · add_separator 로 메뉴 뼈대(Code14-01)를 만들 수 있다'
        ],
        flow: [['도입: 이 장에서 만들 네 프로그램', 4], ['프로젝트 진행 5단계 · 디버깅 요령', 8], ['외부 라이브러리와 Pillow 설치', 8], ['Pillow 로 사진 다루기', 10], ['메뉴 구성도 · Code14-01', 12], ['퀴즈 · 실습', 8]],
        content: [
          { type: 'h', text: '이 장에서 만들 두 프로그램' },
          { type: 'p', html: '마지막 장에서는 지금까지 배운 변수 · 조건문 · 반복문 · 함수 · 윈도 프로그래밍을 모두 모아 <b>제법 그럴듯한 프로그램 두 개</b>를 만듭니다. 둘 다 파이썬에 기본으로 들어 있지 않은 <b>외부 라이브러리</b>를 빌려 씁니다.' },
          { type: 'table', head: ['프로젝트', '무엇을 만드나', '사용하는 라이브러리'], rows: [
            ['[프로젝트 1] 미니 포토샵', '사진을 열어 확대 · 축소 · 반전 · 회전 · 밝기 조절 · 블러 · 엠보싱 · 흑백 처리를 하고 저장하는 프로그램', '<code>tkinter</code> (창 · 메뉴 · 대화상자) + <b>Pillow</b> (이미지 처리)'],
            ['[프로젝트 2] 우주괴물 무찌르기', '방향키로 우주선을 움직이고 스페이스바로 미사일을 쏘아 우주괴물을 맞히는 슈팅 게임', '<b>pygame</b> (게임 화면 · 키보드 · 그림)'],
            ['[프로젝트 3] 타자 연습 (14-6)', '제시 문장을 따라 치고 시간 · 분당 타수 · 정확도를 계산해 결과를 파일에 기록', '<code>tkinter</code> + <code>time</code> · <code>datetime</code> · 파일'],
            ['[프로젝트 4] 판매량 막대그래프 (14-7)', 'CSV 데이터를 읽어 통계를 내고 캔버스에 막대그래프로 그려 주는 프로그램', '<code>tkinter</code> Canvas + <code>csv</code>']
          ] },
          { type: 'p', html: '앞의 두 프로젝트는 강의자료를 따라 만들고, 뒤의 두 프로젝트(14-6 · 14-7)는 <b>같은 진행 방법을 스스로 적용</b>해 보는 연습입니다. 다루는 기술은 다르지만 만드는 <b>순서</b>는 똑같습니다.' },
          { type: 'p', html: '포토샵처럼 사진을 가공하는 프로그램을 <b>영상 처리(Image Processing) 프로그램</b>이라고 합니다. 영상 처리는 대학에서 한 과목으로 따로 배울 만큼 깊은 분야지만, 이 장에서는 어려운 이론 대신 <mark>Pillow 가 이미 만들어 둔 기능을 불러 써서 화면에 결과를 보여 주는 것</mark>에 집중합니다.' },
          { type: 'callout', kind: 'info', title: '큰 프로그램을 만드는 요령', html: '처음부터 완성된 코드를 한 번에 쓰려고 하지 마세요. ① 어떤 기능이 필요한지 <b>목록(구성도)</b>을 만들고 ② 각 기능을 <b>빈 함수(pass)</b>로 먼저 만들어 실행되는 뼈대를 세운 뒤 ③ 함수를 하나씩 채우며 매번 실행해 봅니다. 이 장의 두 프로젝트 모두 이 순서로 진행합니다.' },

          { type: 'h', text: '프로젝트는 이렇게 진행합니다' },
          { type: 'p', html: '이 장에서 배우는 것은 Pillow 와 pygame 의 사용법만이 아닙니다. 그보다 오래 쓸모 있는 것은 <b>프로그램 하나를 처음부터 끝까지 만들어 내는 순서</b>입니다. 실무에서도 규모만 다를 뿐 아래 다섯 단계를 그대로 반복합니다.' },
          { type: 'figure', html: SVG_PROCESS, caption: '프로젝트 진행 5단계 — ③ 과 ④ 사이를 여러 번 오간다' },
          { type: 'table', head: ['단계', '하는 일', '미니 포토샵에서는'], rows: [
            ['① 요구 사항', '무엇을 만들지 <b>한 문장</b>으로 적고, 입력 · 출력 · 규칙을 목록으로 정리', '“사진을 열어 여러 효과를 주고 저장하는 프로그램”'],
            ['② 기능 분해', '큰 일을 <b>기능 단위</b>로 쪼갠다. 기능 하나 = 함수 하나 = 메뉴 하나', '열기 · 저장 · 확대 · 축소 · 반전 · 회전 · 밝기 · 필터 · 흑백'],
            ['③ 단계별 개발', '<b>실행되는 뼈대</b>부터 만들고 기능을 하나씩 채운다. 채울 때마다 ▶ 실행', 'Code14-01 뼈대 → 14-02 열기 → 14-03 저장 → …'],
            ['④ 리팩터링', '동작은 그대로 두고 <b>중복 · 이름 · 구조</b>를 다듬는다', '13개 함수의 같은 부분을 <code>apply_effect()</code> 하나로'],
            ['⑤ 확장', '요구 사항을 더 붙인다 (되돌리기 · 저장 형식 · 최고 점수 …)', '14-3 의 “미니 포토샵 플러스”']
          ] },
          { type: 'callout', kind: 'more', title: '📘 요구 사항은 “장면” 으로 적으면 분명해집니다', html: '<p>“좋은 사진 편집기” 처럼 두루뭉술한 목표는 언제 끝났는지 알 수 없습니다. 대신 <b>사용자가 겪을 장면</b>으로 적어 보세요.</p><ul><li>프로그램을 켜면 빈 창과 메뉴 막대가 보인다</li><li>[파일] → [열기] 에서 <code>picture02.jpg</code> 를 고르면 창이 사진 크기로 바뀌고 사진이 나타난다</li><li>[이미지 처리(2)] → [흑백이미지] 를 누르면 같은 사진이 흑백으로 바뀐다</li><li>사진을 열지 않고 [흑백이미지] 를 눌러도 <b>오류 없이</b> 안내 문구만 나온다</li></ul><p>이렇게 적어 두면 그대로 <b>확인 목록(체크리스트)</b> 이 됩니다. 기능을 하나 채울 때마다 해당 줄에 표시하며 진행하세요.</p>' },

          { type: 'h', text: '작게 만들고 자주 실행하기 · 디버깅 요령' },
          { type: 'p', html: '초보자가 가장 자주 겪는 어려움은 “100줄을 다 쓰고 실행했더니 오류가 잔뜩” 입니다. <mark>20~30줄마다 한 번씩 실행</mark>하면, 오류의 원인은 거의 언제나 <b>방금 쓴 몇 줄</b> 안에 있습니다. 찾는 범위가 좁아지는 것이 핵심입니다.' },
          { type: 'list', items: [
            '<b>좁히기</b> — 오류가 난 줄 번호부터 확인합니다. 같은 코드를 새 파일에 <b>몇 줄만</b> 옮겨 실행해 보면 원인이 금방 드러납니다.',
            '<b>보기</b> — 의심스러운 변수를 <code>print(변수)</code>, <code>print(type(변수))</code>, <code>print(repr(변수))</code> 로 찍어 봅니다. 생각한 값 · 생각한 자료형이 맞는지 확인하는 것이 시작입니다.',
            '<b>고정하기</b> — 난수가 섞인 프로그램은 <code>random.seed(14)</code> 로 결과를 고정해 놓고 원인을 찾습니다.',
            '<b>나누기</b> — 화면에 그리는 코드와 계산하는 코드를 함수로 나누면, 계산 부분만 따로 실행해 시험할 수 있습니다 (이 장의 “화면 없이” 실습들이 그 방법입니다).',
            '<b>기록하기</b> — 고친 내용을 한 줄로 적어 두면 같은 실수를 두 번 하지 않습니다.'
          ] },
          { type: 'code', title: '추가 예제. print · type · repr 로 버그 찾아가기', code: C_DEBUG,
            expect: "['90', '80', '70']\n<class 'str'>\n'90'\n평균 : 80.0",
            desc: '<code>print(scores)</code> 만 보면 숫자처럼 보이지만 <code>type</code> 으로는 <code>str</code>, <code>repr</code> 로는 따옴표가 붙은 <code>\'90\'</code> 이 나옵니다. <b>보이는 것</b>과 <b>실제 값</b>이 다를 때 <code>repr</code> 이 큰 도움이 됩니다.' },
          { type: 'callout', kind: 'more', title: '📘 오류 메시지는 아래에서 위로 읽습니다', html: '<p>파이썬의 오류(traceback)는 <b>맨 마지막 줄</b>에 오류의 종류와 이유가, 그 위에 <b>어느 파일 몇 번째 줄</b>에서 났는지가 적혀 있습니다. 먼저 마지막 줄을 읽고, 그다음 내 파일에서 난 가장 아래쪽 줄 번호를 찾으면 됩니다.</p><ul><li><code>NameError: name \'func_blur\' is not defined</code> — 이름을 잘못 썼거나 아직 만들지 않은 함수</li><li><code>TypeError: \'NoneType\' object is not subscriptable</code> — <code>None</code> 이 들어 있는 변수를 썼다(대화상자에서 [취소]!)</li><li><code>FileNotFoundError</code> — 파일 이름 · 폴더 이름(<code>JPG/</code>, <code>game/</code>)을 확인</li><li><code>IndentationError</code> — 들여쓰기가 어긋났다(탭과 공백을 섞지 마세요)</li></ul>' },

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
          },
          {
            title: '실습 14-3. 사진 네 장 비교하기', level: 1,
            desc: '<p><code>JPG/picture01.jpg</code> ~ <code>picture04.jpg</code> 네 장을 차례로 열어 <b>파일 이름 · 크기 · 점의 수</b>를 출력하고, 마지막에 <b>전체 점의 수</b>와 <b>가장 큰 사진</b>의 이름을 출력하세요.</p>',
            hint: '가장 큰 것을 찾을 때는 “지금까지 가장 큰 값” 을 담는 변수(<code>bestPx</code>)를 0 으로 시작해 두고, 더 큰 값을 만나면 바꿔치기합니다.',
            starter: "from PIL import Image\n\nfiles = ['JPG/picture01.jpg', 'JPG/picture02.jpg', 'JPG/picture03.jpg', 'JPG/picture04.jpg']\ntotal = 0\nbest, bestPx = '', 0\nfor f in files :\n    img = Image.open(f)\n    # TODO: 점의 수를 구해 출력하고 total 에 더하기\n    # TODO: 지금까지 가장 큰 사진인지 확인\n    pass\nprint('전체 점의 수 :', total)\nprint('가장 큰 사진 :', best)\n",
            solution: "from PIL import Image\n\nfiles = ['JPG/picture01.jpg', 'JPG/picture02.jpg', 'JPG/picture03.jpg', 'JPG/picture04.jpg']\ntotal = 0\nbest, bestPx = '', 0\nfor f in files :\n    img = Image.open(f)\n    px = img.width * img.height\n    print(f, img.size, px, '점')\n    total += px\n    if px > bestPx :\n        best, bestPx = f, px\nprint('전체 점의 수 :', total)\nprint('가장 큰 사진 :', best)\n",
            expect: 'JPG/picture01.jpg (320, 240) 76800 점\nJPG/picture02.jpg (240, 300) 72000 점\nJPG/picture03.jpg (320, 200) 64000 점\nJPG/picture04.jpg (260, 260) 67600 점\n전체 점의 수 : 280400\n가장 큰 사진 : JPG/picture01.jpg'
          },
          {
            title: '실습 14-4. 요구 사항 → 기능 분해 → 뼈대 만들기 (그림판)', level: 2,
            desc: '<p>다음 요구 사항을 읽고 <b>메뉴 뼈대</b>를 만드세요. 함수는 아직 <code>pass</code> 로 두고, 메뉴를 누르면 무슨 기능인지 <code>print()</code> 로만 알려 주면 됩니다.</p><ul><li>[파일] 메뉴 — 새로 그리기 / 그림 저장 / 종료</li><li>[펜] 메뉴 — 검정 / 빨강 / 파랑 / 굵기 바꾸기</li></ul><p>즉 함수 7개와 메뉴 2개가 필요합니다. 이 뼈대는 14-6, 14-7 에서 만들 프로젝트의 출발점과 같은 모양입니다.</p>',
            hint: '<code>def func_new() : print("새로 그리기")</code> 처럼 한 줄짜리 함수 7개를 만들고, <code>Menu</code> → <code>add_cascade</code> → <code>add_command</code> 로 연결합니다. <code>command</code> 에는 괄호 없이 함수 이름만!',
            starter: "from tkinter import *\n\n## 함수 선언 부분 ##\ndef func_new() :\n    print('새로 그리기')\n\n# TODO: func_save, func_exit, func_black, func_red, func_blue, func_width 만들기\n\n## 메인 코드 부분 ##\nwindow = Tk()\nwindow.geometry('300x200')\nwindow.title('그림판 뼈대')\n\nmainMenu = Menu(window)\nwindow.config(menu = mainMenu)\n# TODO: [파일] · [펜] 메뉴 만들고 함수 연결하기\n\nwindow.mainloop()\n",
            solution: "from tkinter import *\n\n## 함수 선언 부분 ##\ndef func_new() :\n    print('새로 그리기')\n\ndef func_save() :\n    print('그림 저장')\n\ndef func_black() :\n    print('펜 색 : 검정')\n\ndef func_red() :\n    print('펜 색 : 빨강')\n\ndef func_blue() :\n    print('펜 색 : 파랑')\n\ndef func_width() :\n    print('굵기 바꾸기')\n\n## 메인 코드 부분 ##\nwindow = Tk()\nwindow.geometry('300x200')\nwindow.title('그림판 뼈대')\n\nmainMenu = Menu(window)\nwindow.config(menu = mainMenu)\n\nfileMenu = Menu(mainMenu)\nmainMenu.add_cascade(label = '파일', menu = fileMenu)\nfileMenu.add_command(label = '새로 그리기', command = func_new)\nfileMenu.add_command(label = '그림 저장', command = func_save)\nfileMenu.add_separator()\nfileMenu.add_command(label = '종료', command = window.destroy)\n\npenMenu = Menu(mainMenu)\nmainMenu.add_cascade(label = '펜', menu = penMenu)\npenMenu.add_command(label = '검정', command = func_black)\npenMenu.add_command(label = '빨강', command = func_red)\npenMenu.add_command(label = '파랑', command = func_blue)\npenMenu.add_separator()\npenMenu.add_command(label = '굵기 바꾸기', command = func_width)\n\nwindow.mainloop()\n"
          },
          {
            title: '실습 14-5. 고장난 메뉴 프로그램 고치기', level: 3,
            desc: '<p>아래 프로그램에는 <b>버그가 세 개</b> 있습니다. 실행해 보고 오류 메시지를 읽어 가며 하나씩 고치세요.</p><ol><li>실행하자마자 메시지 상자가 떠 버린다</li><li>[종료] 를 눌러도 아무 일이 없다 (연결한 이름이 잘못됨)</li><li>사진을 열기 전에 [정보] 를 누르면 오류가 난다 — <code>photo</code> 가 <code>None</code> 일 때를 대비해야 한다</li></ol><p>고친 뒤에는 시험 삼아 <code>func_info()</code> 를 사진 열기 전과 후에 한 번씩 불러 보세요.</p>',
            hint: '① <code>command = 함수이름()</code> 처럼 괄호를 붙이면 그 자리에서 실행됩니다. ② 선언한 함수 이름과 <code>command</code> 에 쓴 이름이 같은지 확인하세요. ③ <code>if photo == None : return</code> 으로 먼저 막습니다.',
            starter: "from tkinter import *\nfrom tkinter import messagebox\nfrom PIL import Image\n\nphoto = None\n\ndef func_open() :\n    global photo\n    photo = Image.open('JPG/picture03.jpg')\n    print('사진을 열었습니다')\n\ndef func_info() :\n    messagebox.showinfo('정보', '크기 : %d x %d' % (photo.width, photo.height))\n\nwindow = Tk()\nwindow.geometry('260x120')\nmainMenu = Menu(window)\nwindow.config(menu = mainMenu)\nfileMenu = Menu(mainMenu)\nmainMenu.add_cascade(label = '파일', menu = fileMenu)\nfileMenu.add_command(label = '열기', command = func_open)\nfileMenu.add_command(label = '정보', command = func_info())      # 버그 1\nfileMenu.add_command(label = '종료', command = func_quit)        # 버그 2\nwindow.mainloop()\n",
            solution: "from tkinter import *\nfrom tkinter import messagebox\nfrom PIL import Image\n\nphoto = None\n\ndef func_open() :\n    global photo\n    photo = Image.open('JPG/picture03.jpg')\n    print('사진을 열었습니다')\n\ndef func_info() :\n    if photo == None :                       # 버그 3 : 열기 전에도 안전하게\n        messagebox.showwarning('알림', '먼저 [열기] 를 누르세요.')\n        return\n    messagebox.showinfo('정보', '크기 : %d x %d' % (photo.width, photo.height))\n\ndef func_quit() :                            # 버그 2 : 없던 함수를 만든다\n    window.destroy()\n\nwindow = Tk()\nwindow.geometry('260x120')\nmainMenu = Menu(window)\nwindow.config(menu = mainMenu)\nfileMenu = Menu(mainMenu)\nmainMenu.add_cascade(label = '파일', menu = fileMenu)\nfileMenu.add_command(label = '열기', command = func_open)\nfileMenu.add_command(label = '정보', command = func_info)        # 버그 1 : 괄호 제거\nfileMenu.add_command(label = '종료', command = func_quit)\n\nfunc_info()        # 열기 전 : 안내만 나온다\nfunc_open()\nfunc_info()        # 연 뒤 : 크기가 나온다\nwindow.mainloop()\n",
            expect: '사진을 열었습니다'
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
            notes: '<p>포토샵 같은 프로그램을 영상 처리 프로그램이라고 부른다는 점, 영상 처리는 대학에서 따로 배우는 분야라는 점을 짧게 소개합니다. 이론보다 “라이브러리를 빌려 쓰는 법” 이 오늘의 핵심. 14-6 · 14-7 에서 타자 연습과 막대그래프 프로젝트를 하나씩 더 만든다고 예고합니다.</p>' },
          { layout: 'diagram', title: '프로젝트 진행 5단계', html: SVG_PROCESS, caption: '③ 단계별 개발 ↔ ④ 리팩터링 을 여러 번 오간다',
            notes: '<p>이 장의 진짜 주제입니다. “라이브러리 사용법은 검색하면 나오지만, 만드는 순서는 몸에 익혀야 한다” 고 말해 주세요.</p><p>발문: “지금까지 만든 프로그램 중 가장 길었던 것은 몇 줄이었나요? 한 번에 다 쓰고 실행했나요?” — 대부분 그렇게 하다 고생한 경험이 있습니다.</p><p>시간: 5분</p>' },
          { layout: 'bullets', title: '요구 사항은 “장면” 으로 적는다', lead: '언제 끝났는지 알 수 있게 적는 것이 좋은 요구 사항', bullets: [
            '❌ “좋은 사진 편집기를 만든다” — 끝을 알 수 없다',
            '⭕ “켜면 빈 창과 메뉴 막대가 보인다”',
            '⭕ “[열기] 로 picture02.jpg 를 고르면 사진이 나타난다”',
            '⭕ “사진을 열지 않고 [흑백] 을 눌러도 <b>오류 없이</b> 안내만 나온다”',
            '적어 둔 장면 목록이 그대로 <b>확인 목록</b>이 된다'
          ], notes: '<p>마지막 항목(예외 상황)을 특히 강조합니다. 초보자의 프로그램은 “정상적인 순서로 눌렀을 때만” 동작하는 경우가 많습니다. 실습 14-5 가 바로 그 연습입니다.</p>' },
          { layout: 'code', title: '디버깅: print · type · repr', code: C_DEBUG, points: ['보이는 값 ≠ 실제 값', '<code>type()</code> 으로 자료형 확인', '<code>repr()</code> 은 따옴표까지 보여 준다', '20~30줄마다 한 번씩 실행'],
            notes: '<p>실행해서 <code>&lt;class \'str\'&gt;</code> 이 나오는 순간을 보여 줍니다. 오류 메시지는 <b>마지막 줄부터</b> 읽는다는 것도 함께 알려 주세요.</p><p>시간: 4분</p>' },
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
          'asksaveasfile 과 save 로 처리한 이미지를 파일로 저장할 수 있다 (Code14-03)',
          '픽셀 · 채널 · 필터의 뜻을 설명하고 밝기 조절을 직접 계산해 볼 수 있다',
          '점마다 도는 반복과 라이브러리 호출의 성능 차이를 측정해 설명할 수 있다'
        ],
        flow: [['복습 · 기본 구조(그림 14-6)', 6], ['displayImage 원리', 12], ['func_open · 실행', 10], ['func_save · 저장 형식', 7], ['픽셀 · 채널 · 성능', 8], ['퀴즈 · 실습', 7]],
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
          { type: 'callout', kind: 'more', title: '📘 JPG 와 PNG 의 차이', html: '<b>JPG(JPEG)</b> 는 사람 눈에 잘 띄지 않는 정보를 버려서 파일을 작게 만드는 <b>손실 압축</b>입니다. 사진에 알맞지만 저장할 때마다 조금씩 화질이 떨어집니다. <b>PNG</b> 는 정보를 버리지 않는 <b>무손실 압축</b>이고 투명한 부분(알파)도 저장할 수 있어 그림 · 아이콘 · 게임 캐릭터에 알맞습니다. 슈팅 게임의 우주선과 괴물 그림이 PNG 인 이유입니다. 참고로 JPG 는 투명(RGBA)을 저장할 수 없어 RGBA 이미지를 .jpg 로 저장하면 오류가 나는데, 미니 포토샵은 열 때 <code>convert(\'RGB\')</code> 를 하므로 괜찮습니다.' },

          { type: 'h', text: '한 걸음 더: 픽셀 · 채널 · 필터라는 말' },
          { type: 'p', html: '이미지 처리를 하려면 용어 세 개만 알면 충분합니다.' },
          { type: 'table', head: ['용어', '뜻', '코드에서'], rows: [
            ['<b>픽셀</b> (pixel, 화소)', '사진을 이루는 점 하나. 320×240 사진에는 76,800개', '<code>getpixel((x, y))</code> · <code>putpixel</code>'],
            ['<b>채널</b> (channel)', '점 하나가 가진 값의 종류. RGB 는 빨강 · 초록 · 파랑 세 채널(각 0~255)', '<code>r, g, b = img.getpixel(...)</code>'],
            ['<b>필터</b> (filter)', '한 점의 새 색을 <b>주변 점들과 함께</b> 계산하는 방법. 블러 · 엠보싱 · 윤곽선이 모두 필터', '<code>img.filter(ImageFilter.BLUR)</code>']
          ] },
          { type: 'p', html: '<b>밝기 조절</b>은 필터가 아니라 점마다 독립적인 계산입니다. 각 채널 값에 같은 배율을 곱하고 255 를 넘으면 255 로 자릅니다(포화, saturation). 직접 반복문으로 만들어 보면 라이브러리가 하는 일이 분명해집니다.' },
          { type: 'code', title: '추가 예제. 밝기 조절을 직접 만들어 보기 (라이브러리와 비교)', code: C_BRIGHT_LOOP,
            expect: '원본 점    : (243, 165, 100)\n직접 계산  : (255, 247, 150)\n라이브러리 : (255, 247, 150)\n같은 결과인가? : True\n점의 수 : 1000',
            desc: '두 방법의 결과가 같습니다. <code>min(255, …)</code> 이 없으면 255 를 넘는 값 때문에 오류가 나거나 색이 이상해집니다. 이 예제는 사진을 40×25 로 <b>줄여서</b> 실험했습니다 — 큰 사진으로 바로 하면 오래 걸리기 때문입니다.' },
          { type: 'callout', kind: 'more', title: '📘 흑백 변환도 채널 계산이다', html: '<code>ImageOps.grayscale()</code> 은 각 점의 <code>R × 0.299 + G × 0.587 + B × 0.114</code> 를 계산해 <b>한 채널짜리</b>(모드 <code>L</code>) 이미지를 만듭니다. 초록의 계수가 가장 큰 이유는 사람 눈이 초록 빛에 가장 민감하기 때문입니다. 단순히 <code>(R + G + B) / 3</code> 으로 하면 빨강과 파랑이 실제보다 밝게 보입니다.' },

          { type: 'h', text: '성능 생각하기: 점마다 반복 vs 라이브러리' },
          { type: 'p', html: '<code>displayImage()</code> 가 느린 이유는 알고리즘이 나빠서가 아니라 <b>파이썬 반복문이 점 하나마다 도는 횟수</b>가 너무 많기 때문입니다. 320×240 이면 76,800번, 4배로 확대하면 1,228,800번입니다. Pillow 같은 라이브러리는 같은 계산을 C 언어로 미리 만들어 두고 <b>한 번의 호출로 전체 이미지를 처리</b>합니다.' },
          { type: 'code', title: '추가 예제. 얼마나 차이 날까? (직접 반복 vs 라이브러리)', code: C_SPEED, nondeterministic: true,
            desc: '<code>time.perf_counter()</code> 는 짧은 시간을 재는 데 쓰는 시계입니다. 컴퓨터마다 다르지만 보통 <b>수십 배</b> 차이가 납니다. 실행마다 값이 달라지므로 정확한 숫자보다 <b>자릿수</b>를 보세요.' },
          { type: 'callout', kind: 'more', title: '📘 “느리다” 를 해결하는 세 가지 순서', html: '<ol><li><b>안 해도 되는 일을 없앤다</b> — 매번 원본 전체를 다시 그리는 대신 바뀐 부분만 그린다.</li><li><b>더 좋은 도구에 맡긴다</b> — 픽셀 반복문 대신 Pillow · NumPy 의 함수를 쓴다(<code>ImageTk.PhotoImage</code> 로 바꾼 것이 바로 이것).</li><li><b>그래도 느리면 자료 구조를 바꾼다</b> — 리스트 대신 딕셔너리 · 집합으로 찾기 등.</li></ol><p>순서가 중요합니다. 코드를 비틀어 최적화하기 전에 먼저 “이 일을 꼭 해야 하나?” 를 묻습니다. 그리고 <b>측정하지 않고 추측으로 고치지 마세요</b> — 위 예제처럼 시간을 재 보는 것이 먼저입니다.</p>' }
        ],
        practice: [
          {
            title: '실습 14-6. 프로그램을 시작하자마자 사진 열기', level: 2,
            desc: '<p>Code14-02 를 고쳐서, 프로그램이 시작되면 메뉴를 누르지 않아도 <b>파일 열기 대화상자가 바로 뜨도록</b> 하세요. (<code>window.mainloop()</code> 바로 앞에서 함수를 한 번 부르면 됩니다.)</p>',
            hint: '메뉴가 부르는 함수도 평범한 함수입니다. <code>func_open()</code> 을 직접 호출하세요.',
            starter: ps(2).replace('window.mainloop()', '# TODO: 시작하자마자 파일 열기\nwindow.mainloop()'),
            solution: ps(2, { menu: 'func_open()      # 시작하자마자 파일 열기\n' }),
            dialogs: ['JPG/picture02.jpg']
          },
          {
            title: '실습 14-7. 사진 정보 한 줄 요약', level: 1,
            desc: '<p><code>JPG/picture01.jpg</code> 를 열어 폭 · 높이 · 전체 점(픽셀) 수를 출력하고, 복사본을 <code>small.png</code> 로 저장한 뒤 다시 열어 형식을 출력하세요.</p><p>출력 예: <code>320 x 240 = 76800 점</code> / <code>PNG</code></p>',
            hint: '점의 수는 폭 × 높이입니다. 저장 형식은 확장자로 정해집니다.',
            starter: "from PIL import Image\n\nphoto = Image.open('JPG/picture01.jpg')\n# TODO: 폭 x 높이 = 점의 수 출력\n# TODO: 복사본을 small.png 로 저장하고 다시 열어 format 출력\n",
            solution: "from PIL import Image\n\nphoto = Image.open('JPG/picture01.jpg')\nprint(photo.width, 'x', photo.height, '=', photo.width * photo.height, '점')\nphoto2 = photo.copy()\nphoto2.save('small.png')\nprint(Image.open('small.png').format)\n",
            expect: '320 x 240 = 76800 점\nPNG'
          },
          {
            title: '실습 14-8. 가운데 가로줄의 평균 색 구하기', level: 1,
            desc: '<p><code>JPG/picture03.jpg</code> 의 <b>세로 한가운데 가로줄</b>(<code>y = height // 2</code>)에 있는 점들의 R · G · B 평균을 구해 출력하고, 그 색을 <code>#rrggbb</code> 형식의 색 코드로도 출력하세요.</p>',
            hint: '<code>for x in range(photo.width)</code> 로 그 줄의 점을 모두 돌며 r, g, b 를 각각 더한 뒤 점의 수로 나눕니다. 색 코드는 <code>"#%02x%02x%02x" % (…)</code>.',
            starter: "from PIL import Image\n\nphoto = Image.open('JPG/picture03.jpg').convert('RGB')\ny = photo.height // 2\nrs, gs, bs = 0, 0, 0\n# TODO: 그 줄의 점을 모두 돌며 r, g, b 를 더하기\nn = photo.width\nprint('y =', y, '/ 점', n, '개')\n# TODO: 평균과 색 코드 출력\n",
            solution: "from PIL import Image\n\nphoto = Image.open('JPG/picture03.jpg').convert('RGB')\ny = photo.height // 2\nrs, gs, bs = 0, 0, 0\nfor x in range(photo.width) :\n    r, g, b = photo.getpixel((x, y))\n    rs += r\n    gs += g\n    bs += b\nn = photo.width\nprint('y =', y, '/ 점', n, '개')\nprint('평균 색 : (%d, %d, %d)' % (rs / n, gs / n, bs / n))\nprint('색 코드 : #%02x%02x%02x' % (rs // n, gs // n, bs // n))\n",
            expect: 'y = 100 / 점 320 개\n평균 색 : (158, 115, 80)\n색 코드 : #9e7350'
          },
          {
            title: '실습 14-9. 흑백 변환을 직접 만들어 라이브러리와 비교하기', level: 2,
            desc: '<p>컬러 이미지를 받아 <code>R × 0.299 + G × 0.587 + B × 0.114</code> 로 흑백(모드 <code>L</code>) 이미지를 만드는 함수 <code>my_gray(img)</code> 를 만들고, <code>ImageOps.grayscale()</code> 의 결과와 <b>가장 큰 차이</b>를 출력하세요. (사진은 30×30 으로 줄여서 실험합니다.)</p>',
            hint: '<code>Image.new(\'L\', img.size)</code> 로 빈 흑백 이미지를 만들고 <code>putpixel((x, y), 밝기)</code> 로 채웁니다. 모드 L 은 값 하나만 넣습니다.',
            starter: "from PIL import Image, ImageOps\n\ndef my_gray(img) :\n    out = Image.new('L', img.size)\n    # TODO: 모든 점을 돌며 밝기 계산해 넣기\n    return out\n\nphoto = Image.open('JPG/picture02.jpg').convert('RGB').resize((30, 30))\na = my_gray(photo)\nb = ImageOps.grayscale(photo)\n# TODO: 두 이미지의 가장 큰 차이 구하기\n",
            solution: "from PIL import Image, ImageOps\n\ndef my_gray(img) :\n    out = Image.new('L', img.size)\n    for y in range(img.height) :\n        for x in range(img.width) :\n            r, g, b = img.getpixel((x, y))\n            out.putpixel((x, y), int(r * 0.299 + g * 0.587 + b * 0.114))\n    return out\n\nphoto = Image.open('JPG/picture02.jpg').convert('RGB').resize((30, 30))\na = my_gray(photo)\nb = ImageOps.grayscale(photo)\n\nmaxdiff = 0\nfor y in range(30) :\n    for x in range(30) :\n        diff = abs(a.getpixel((x, y)) - b.getpixel((x, y)))\n        if diff > maxdiff :\n            maxdiff = diff\n\nprint('내 함수 모드 :', a.mode)\nprint('가장 큰 차이 :', maxdiff)\nprint('가운데 점 :', a.getpixel((15, 15)), b.getpixel((15, 15)))\n",
            expect: '내 함수 모드 : L\n가장 큰 차이 : 1\n가운데 점 : 101 101',
            nondeterministic: false
          },
          {
            title: '실습 14-10. 사진 뷰어 만들기 (설계부터)', level: 3,
            desc: '<p>메뉴 없이 <b>버튼만</b> 있는 작은 사진 뷰어를 설계해 만드세요.</p><ul><li>요구 사항 ① 창에 <code>JPG/picture01.jpg</code> 가 보인다</li><li>요구 사항 ② [다음 사진] 을 누르면 picture01 → 02 → 03 → 04 → 01 … 순서로 바뀐다</li><li>요구 사항 ③ 창 아래에 <b>파일 이름과 크기</b>가 보인다</li></ul><p>화면에 그리는 일은 <code>show()</code> 함수 하나에 모으고, 지금 몇 번째 사진인지는 변수 하나로 관리하세요. (이것이 14-6 · 14-7 프로젝트에서 쓸 구조와 같습니다.)</p>',
            hint: '<code>ImageTk.PhotoImage</code> 로 만든 이미지는 <b>전역 변수</b>에 담아 두어야 사라지지 않습니다. 다음 번호는 <code>idx = (idx + 1) % len(files)</code> 로 돌립니다.',
            starter: "from tkinter import *\nfrom PIL import Image, ImageTk\n\nfiles = ['JPG/picture01.jpg', 'JPG/picture02.jpg', 'JPG/picture03.jpg', 'JPG/picture04.jpg']\nidx = 0\ntkimg = None\n\ndef show() :\n    # TODO: files[idx] 를 열어 라벨에 넣고, 아래 상태 글도 바꾸기\n    pass\n\ndef next_photo() :\n    # TODO: idx 를 다음으로 옮기고 show()\n    pass\n\nwindow = Tk()\nwindow.title('사진 뷰어')\nlblImage = Label(window)\nlblImage.pack()\nButton(window, text = '다음 사진', command = next_photo).pack(pady = 4)\nlblInfo = Label(window, text = '')\nlblInfo.pack()\nshow()\nwindow.mainloop()\n",
            solution: "from tkinter import *\nfrom PIL import Image, ImageTk\n\nfiles = ['JPG/picture01.jpg', 'JPG/picture02.jpg', 'JPG/picture03.jpg', 'JPG/picture04.jpg']\nidx = 0\ntkimg = None\n\ndef show() :\n    global tkimg\n    img = Image.open(files[idx])\n    tkimg = ImageTk.PhotoImage(img)          # 전역 변수로 두어야 사라지지 않는다\n    lblImage.configure(image = tkimg)\n    lblInfo.configure(text = '%s  (%d x %d)' % (files[idx], img.width, img.height))\n    print(files[idx], img.size)\n\ndef next_photo() :\n    global idx\n    idx = (idx + 1) % len(files)             # 마지막 다음은 처음으로\n    show()\n\nwindow = Tk()\nwindow.title('사진 뷰어')\nlblImage = Label(window)\nlblImage.pack()\nButton(window, text = '다음 사진', command = next_photo).pack(pady = 4)\nlblInfo = Label(window, text = '')\nlblInfo.pack()\n\nshow()\nnext_photo()        # 시험 삼아 한 장 넘겨 본다\nwindow.mainloop()\n",
            expect: 'JPG/picture01.jpg (320, 240)\nJPG/picture02.jpg (240, 300)'
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
          { layout: 'two', title: '픽셀 · 채널 · 필터', left: { title: '용어', bullets: ['<b>픽셀</b> : 사진을 이루는 점 하나', '<b>채널</b> : 점이 가진 값 (R · G · B, 0~255)', '<b>필터</b> : 주변 점까지 보고 새 색을 계산', '밝기 조절은 필터가 아니라 점마다 곱하기'] }, right: { title: '직접 계산해 보면', code: 'from PIL import Image, ImageEnhance\n\nimg = Image.new(\'RGB\', (1, 1), (100, 50, 20))\nr, g, b = img.getpixel((0, 0))\nmine = (min(255, int(r * 1.5)), min(255, int(g * 1.5)), min(255, int(b * 1.5)))\nlib = ImageEnhance.Brightness(img).enhance(1.5)\nprint(mine)\nprint(lib.getpixel((0, 0)))' },
            notes: '<p>밝기 조절이 “각 채널에 같은 수를 곱하고 255 에서 자르기” 라는 것을 한 점으로 보여 줍니다. 본문의 40×25 예제로 사진 전체에도 똑같이 적용된다는 것을 확인시키세요.</p>' },
          { layout: 'code', title: '성능: 점마다 반복 vs 라이브러리', code: C_SPEED, points: ['76,800번 반복 vs 한 번 호출', '<code>time.perf_counter()</code> 로 측정', '보통 수십 배 차이', '추측하지 말고 재 본다'],
            notes: '<p>실제로 실행해 숫자를 보여 줍니다(컴퓨터마다 다름). 빠르게 만드는 순서 — ① 안 해도 되는 일 없애기 ② 좋은 도구에 맡기기 ③ 자료 구조 바꾸기 — 를 칠판에 적어 주세요. 14-3 의 ImageTk 전환이 ②의 예입니다.</p>' },
          { layout: 'practice', title: '실습 14-7. 사진 정보 한 줄 요약', desc: 'picture01.jpg 의 폭 × 높이 = 점의 수를 출력하고 small.png 로 저장 후 형식 확인',
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
        title: '미니 포토샵: 이미지 처리 기능과 완성 · 확장판',
        minutes: 50,
        goals: [
          'resize 로 이미지를 확대 · 축소하고 askinteger 로 배율을 입력받을 수 있다 (Code14-04)',
          'transpose 와 rotate 로 이미지를 반전 · 회전할 수 있다 (Code14-05, 06)',
          'ImageEnhance.Brightness 로 밝기를 조절할 수 있다 (Code14-07)',
          'ImageFilter 와 ImageOps 로 블러 · 엠보싱 · 흑백 효과를 줄 수 있다 (Code14-08, 09)',
          '모든 처리 함수가 같은 틀(복사 → 가공 → 출력)을 가진다는 것을 설명할 수 있다',
          '중복된 함수들을 딕셔너리 + 함수 하나로 리팩터링할 수 있다',
          '되돌리기 · 저장 형식 선택 · 안내 메시지로 프로그램을 확장할 수 있다'
        ],
        flow: [['처리 함수의 공통 틀', 4], ['확대 · 축소 · 반전 · 회전', 12], ['밝기 · 필터 · 흑백', 10], ['완성 코드 실행 · 빠른 출력', 8], ['확장: 리팩터링 · 되돌리기 · UX', 10], ['퀴즈 · 실습', 6]],
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
          { type: 'callout', kind: 'more', title: '📘 Pillow 에는 더 많은 기능이 있어요', html: '미니 포토샵에서 쓴 모듈은 Image · ImageFilter · ImageEnhance · ImageOps 뿐이지만, Pillow 에는 그림 위에 도형 · 글자를 그리는 <code>ImageDraw</code>, 두 사진을 합성하는 <code>Image.blend</code> · <code>paste</code>, 사진을 잘라 내는 <code>crop</code>, 썸네일을 만드는 <code>thumbnail</code> 등 훨씬 많은 기능이 있습니다. 공식 문서(pillow.readthedocs.io)의 Reference 를 둘러보고 나만의 메뉴를 추가해 보세요.' },

          { type: 'h', text: '확장 단계 ① 지금 프로그램의 불편한 점 찾기' },
          { type: 'p', html: '“완성” 은 끝이 아니라 <b>다음 단계의 출발점</b>입니다. 프로그램을 직접 써 보면서 불편한 점을 적어 보면 그것이 그대로 다음 요구 사항이 됩니다.' },
          { type: 'table', head: ['불편한 점', '왜 그런가', '어떻게 고칠까'], rows: [
            ['효과가 <b>쌓이지 않는다</b> (회전 후 흑백 → 흑백만)', '모든 함수가 <code>photo</code>(원본)를 복사해서 시작', '<code>photo2</code>(지금 화면)를 가공하도록 바꾼다'],
            ['<b>되돌릴 수 없다</b>', '이전 상태를 아무 데도 남기지 않음', '바꾸기 전 이미지를 <code>history</code> 리스트에 쌓는다'],
            ['사진을 열기 전에 메뉴를 누르면 <b>오류</b>', '<code>photo2</code> 가 <code>None</code> 인 경우를 확인하지 않음', '먼저 검사하고 <b>안내 문구</b>를 보여 준다'],
            ['저장 <b>형식을 고를 수 없다</b>', '확장자를 <code>.jpg</code> 로 고정', 'PNG · JPG 를 고르게 하고 형식에 맞게 저장'],
            ['같은 코드가 <b>13번 반복</b>된다', '함수마다 “복사 → 가공 → 출력” 을 그대로 씀', '가공하는 부분만 표로 만들고 함수 하나로 합친다']
          ] },

          { type: 'h', text: '확장 단계 ② 리팩터링: 비슷한 함수 13개를 하나로' },
          { type: 'p', html: '<b>리팩터링(refactoring)</b> 은 <mark>동작은 그대로 두고 코드의 구조만 고치는 일</mark>입니다. 기능을 더하는 것이 아니므로 결과 화면은 똑같아야 합니다. 미니 포토샵의 처리 함수들은 “가공하는 한 줄” 만 다르므로, 그 한 줄을 <b>딕셔너리의 값</b>으로 모으면 함수 하나로 충분합니다.' },
          { type: 'code', run: false, title: '리팩터링의 핵심 아이디어', code: 'EFFECT = {\n    "블러링" : lambda img : img.filter(ImageFilter.BLUR),\n    "엠보싱" : lambda img : img.filter(ImageFilter.EMBOSS),\n    "흑백"   : lambda img : ImageOps.grayscale(img).convert(\'RGB\'),\n}\n\ndef apply_effect(name) :      # 함수 13개 → 함수 1개\n    global photo2\n    photo2 = EFFECT[name](photo2)\n    displayImage(photo2)\n\nfor name in EFFECT :          # 메뉴도 반복문으로 만든다\n    editMenu.add_command(label = name, command = lambda n = name : apply_effect(n))',
            desc: '<code>lambda img : …</code> 는 “이미지를 받아 가공해 돌려주는 이름 없는 함수” 입니다. 딕셔너리에 <b>함수 자체를 값으로</b> 담아 두었다가 필요할 때 꺼내 부릅니다. 이렇게 하면 효과를 하나 더하는 일이 <b>딕셔너리에 한 줄 추가</b>로 끝납니다.' },
          { type: 'callout', kind: 'warn', title: 'lambda 를 반복문 안에서 만들 때의 함정', html: '<code>command = lambda : apply_effect(name)</code> 라고 쓰면 <b>모든 메뉴가 마지막 이름</b>으로 동작합니다. 람다 안의 <code>name</code> 은 “만들 때의 값” 이 아니라 “부를 때의 값” 을 읽기 때문입니다. 그래서 <code>lambda n = name : apply_effect(n)</code> 처럼 <b>기본값으로 지금 값을 붙잡아</b> 둡니다.' },
          { type: 'code', title: '추가 예제. 람다의 함정 직접 확인하기', code: C_LAMBDA_TRAP,
            expect: "잘못된 방법 : ['흑백', '흑백', '흑백']\n올바른 방법 : ['블러', '엠보싱', '흑백']",
            desc: '반복이 끝난 뒤 <code>name</code> 에는 마지막 값만 남아 있습니다. 기본값(<code>n = name</code>)은 함수를 <b>만드는 순간</b> 평가되므로 그때의 값이 그대로 보관됩니다.' },

          { type: 'h', text: '확장 단계 ③ 되돌리기 (Undo)' },
          { type: 'p', html: '되돌리기는 어렵지 않습니다. <b>바꾸기 직전의 상태를 리스트에 쌓아 두고</b>, 되돌릴 때 맨 뒤에서 하나 꺼내면(<code>pop()</code>) 됩니다. 이렇게 “나중에 넣은 것을 먼저 꺼내는” 구조를 <b>스택(stack)</b> 이라고 합니다.' },
          { type: 'code', title: '추가 예제. 되돌리기의 원리 (이미지 없이)', code: C_UNDO,
            expect: '처리 : 원본 → 흑백\n처리 : 원본 → 흑백 → 블러\n되돌림 : 원본 → 흑백\n되돌림 : 원본\n되돌릴 작업이 없습니다',
            desc: '이미지 대신 문자열로 실험해 본 것입니다. 실제 프로그램에서는 <code>history.append(photo2.copy())</code> 로 <b>복사본</b>을 쌓아야 합니다 — 같은 객체를 넣으면 나중에 함께 바뀌어 버립니다. 이미지가 크면 메모리를 많이 쓰므로 <b>10단계까지만</b> 보관하고 오래된 것은 <code>history.pop(0)</code> 으로 버립니다.' },

          { type: 'h', text: '확장 단계 ④ 미니 포토샵 플러스 (완성)' },
          { type: 'p', html: '위 네 가지를 모두 적용한 확장판입니다. 함수는 오히려 <b>줄었는데</b> 기능은 더 많아졌다는 점을 눈여겨보세요. 창 아래의 <b>상태 표시줄</b>이 지금 무슨 일이 일어났는지 계속 알려 줍니다.' },
          { type: 'code', title: '추가 예제. [프로젝트 1] 확장판 — 미니 포토샵 플러스', code: C_PS_PLUS,
            desc: '[파일] → [열기] 로 사진을 연 뒤 [편집] 메뉴의 효과를 <b>여러 번 겹쳐</b> 눌러 보세요(효과가 쌓입니다). [되돌리기] 로 한 단계씩 되돌아가고, [다른 이름으로 저장] 에서 <code>my.png</code> 또는 <code>my.jpg</code> 로 저장해 보세요.' },
          { type: 'callout', kind: 'more', title: '📘 사용자 경험(UX): 프로그램이 친절해지는 네 가지', html: '<ol><li><b>오류 대신 안내</b> — 사진을 열기 전에 효과를 누르면 빨간 오류(traceback) 대신 “먼저 사진을 여세요” 라고 알려 줍니다. 오류 메시지는 <b>무엇을 하면 되는지</b>를 담아야 합니다.</li><li><b>되돌리기</b> — 실수해도 괜찮다는 안심을 줍니다. 되돌릴 수 있는 프로그램은 사람을 과감하게 만듭니다.</li><li><b>상태 보여 주기</b> — 지금 어떤 파일을 열었는지, 방금 무엇을 했는지 상태 표시줄에 적어 둡니다.</li><li><b>저장 · 복구</b> — 사용자가 만든 결과를 잃지 않게 합니다. 저장할 때는 기본 확장자를 정해 주고, 덮어쓰기 전에 확인합니다.</li></ol><p>기능이 같아도 이 네 가지가 있으면 “쓸 만한 프로그램” 이 됩니다.</p>' }
        ],
        practice: [
          {
            title: '실습 14-11. 필터 네 가지를 한꺼번에 적용해 저장하기', level: 1,
            desc: '<p><code>JPG/picture04.jpg</code> 를 120×120 으로 줄인 뒤 <b>블러 · 윤곽선 · 엠보싱 · 선명하게</b> 네 필터를 각각 적용해 PNG 파일로 저장하고, 저장한 파일을 다시 열어 <b>이름 · 형식 · 크기 · 색 모드</b>를 출력하세요.</p>',
            hint: '필터를 딕셔너리에 모아 두면 <code>for</code> 한 번으로 끝납니다: <code>{\'blur\' : ImageFilter.BLUR, …}</code>',
            starter: "from PIL import Image, ImageFilter\n\nphoto = Image.open('JPG/picture04.jpg').convert('RGB').resize((120, 120))\nfilters = {'blur' : ImageFilter.BLUR, 'contour' : ImageFilter.CONTOUR,\n           'emboss' : ImageFilter.EMBOSS, 'sharpen' : ImageFilter.SHARPEN}\nfor name in filters :\n    # TODO: 필터 적용 → name + '.png' 로 저장 → 다시 열어 정보 출력\n    pass\n",
            solution: "from PIL import Image, ImageFilter\n\nphoto = Image.open('JPG/picture04.jpg').convert('RGB').resize((120, 120))\nfilters = {'blur' : ImageFilter.BLUR, 'contour' : ImageFilter.CONTOUR,\n           'emboss' : ImageFilter.EMBOSS, 'sharpen' : ImageFilter.SHARPEN}\nfor name in filters :\n    out = photo.filter(filters[name])\n    fname = name + '.png'\n    out.save(fname)\n    check = Image.open(fname)\n    print(name, check.format, check.size, check.mode)\n",
            expect: 'blur PNG (120, 120) RGB\ncontour PNG (120, 120) RGB\nemboss PNG (120, 120) RGB\nsharpen PNG (120, 120) RGB'
          },
          {
            title: '실습 14-12. ImageEnhance 네 가지 비교하기', level: 1,
            desc: '<p>색이 <code>(120, 60, 180)</code> 인 1×1 그림에 <b>밝기 · 대비 · 채도 · 선명도</b> 조절을 각각 <code>0.5</code> 로 적용하고 결과 색을 출력하세요. 어떤 것이 아무 변화가 없는지, 왜 그런지 생각해 보세요.</p>',
            hint: '도구 클래스를 딕셔너리에 담아 둡니다: <code>{\'밝기\' : ImageEnhance.Brightness, …}</code>. 값이 아니라 <b>클래스 자체</b>를 담는 것입니다.',
            starter: "from PIL import Image, ImageEnhance\n\nimg = Image.new('RGB', (1, 1), (120, 60, 180))\ntools = {'밝기' : ImageEnhance.Brightness, '대비' : ImageEnhance.Contrast,\n         '채도' : ImageEnhance.Color, '선명도' : ImageEnhance.Sharpness}\nprint('원본   :', img.getpixel((0, 0)))\n# TODO: 네 도구를 0.5 로 적용해 결과 출력\n",
            solution: "from PIL import Image, ImageEnhance\n\nimg = Image.new('RGB', (1, 1), (120, 60, 180))\ntools = {'밝기' : ImageEnhance.Brightness, '대비' : ImageEnhance.Contrast,\n         '채도' : ImageEnhance.Color, '선명도' : ImageEnhance.Sharpness}\nprint('원본   :', img.getpixel((0, 0)))\nfor name in tools :\n    out = tools[name](img).enhance(0.5)\n    print('%s 0.5 :' % name, out.getpixel((0, 0)))\n",
            expect: '원본   : (120, 60, 180)\n밝기 0.5 : (60, 30, 90)\n대비 0.5 : (106, 76, 136)\n채도 0.5 : (106, 76, 136)\n선명도 0.5 : (120, 60, 180)'
          },
          {
            title: '실습 14-13. [이미지 처리(3)] 메뉴 추가 (선명하게 · 윤곽선)', level: 2,
            desc: '<p>완성된 미니 포토샵에 <b>[이미지 처리(3)]</b> 메뉴를 추가하고 <b>[선명하게]</b>(<code>ImageFilter.SHARPEN</code>), <b>[윤곽선]</b>(<code>ImageFilter.CONTOUR</code>) 항목을 넣으세요.</p>',
            hint: 'func_blur() 를 복사해 필터 이름만 바꾼 함수 두 개를 만들고, image3Menu 를 add_cascade 로 붙입니다.',
            starter: ps(9, { fast: true }).replace('window.mainloop()', '# TODO: 이미지 처리(3) 메뉴와 두 함수 추가\nwindow.mainloop()'),
            solution: ps(9, { fast: true, funcs: P_EXTRA_FUNCS, menu: P_EXTRA_MENU })
          },
          {
            title: '실습 14-14. 확장판에 효과 두 개 더하기 (한 줄씩!)', level: 2,
            desc: '<p>“미니 포토샵 플러스” 의 <code>EFFECT</code> 딕셔너리에 효과 두 개를 추가하세요.</p><ul><li><b>세피아</b> — <code>ImageOps.colorize(ImageOps.grayscale(img), (60, 30, 10), (255, 230, 190))</code> (흑백으로 만든 뒤 어두운 곳은 갈색, 밝은 곳은 크림색으로 물들이기)</li><li><b>윤곽선</b> — <code>img.filter(ImageFilter.CONTOUR)</code></li></ul><p>메뉴를 따로 만들지 않아도 두 항목이 저절로 생기는 것을 확인하세요. 정답 코드는 시험 삼아 사진을 열고 두 효과를 겹쳐 준 뒤 한 번 되돌립니다.</p>',
            hint: '딕셔너리에 <code>"세피아" : lambda img : …,</code> 한 줄을 넣으면 <code>for name in EFFECT :</code> 반복문이 메뉴까지 만들어 줍니다. 이것이 리팩터링의 보람입니다.',
            starter: C_PS_PLUS.replace('\n}\ncanvas, paper', '\n    # TODO: "세피아" 와 "윤곽선" 효과를 한 줄씩 추가\n}\ncanvas, paper'),
            solution: C_PS_PLUS
              .replace('\n}\ncanvas, paper', '\n    "세피아"    : lambda img : ImageOps.colorize(ImageOps.grayscale(img), (60, 30, 10), (255, 230, 190)),\n    "윤곽선"    : lambda img : img.filter(ImageFilter.CONTOUR),\n}\ncanvas, paper')
              .replace('\nwindow.mainloop()', "\nphoto = Image.open('JPG/picture03.jpg').convert('RGB')   # 시험 삼아 직접 열어 본다\nphoto2 = photo.copy()\ndisplayImage(photo2)\napply_effect('세피아')\napply_effect('윤곽선')\nfunc_undo()\nprint('결과 크기 :', photo2.size)\n\nwindow.mainloop()"),
            expect: '결과 크기 : (320, 200)'
          },
          {
            title: '실습 14-15. 원본으로 되돌리기 · 취소에 대비하기', level: 3,
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
          { layout: 'bullets', title: '완성 다음은 확장 — 불편한 점 찾기', lead: '직접 써 보며 적은 불편이 곧 다음 요구 사항', bullets: [
            '효과가 <b>쌓이지 않는다</b> → photo2 를 가공하도록',
            '<b>되돌릴 수 없다</b> → history 리스트(스택)에 쌓기',
            '사진 없이 누르면 <b>오류</b> → 먼저 검사하고 안내',
            '저장 <b>형식 선택 불가</b> → PNG · JPG 고르기',
            '같은 코드 <b>13번 반복</b> → 딕셔너리 + 함수 하나'
          ], notes: '<p>학생들에게 직접 미니 포토샵을 2~3분 만져 보게 한 뒤 “불편한 점” 을 말하게 합니다. 대부분 이 다섯 가지를 스스로 찾아냅니다. 교사는 그것을 칠판에 적고 요구 사항으로 정리하는 시범을 보입니다.</p>' },
          { layout: 'code', title: '리팩터링: 함수 13개 → 1개', code: 'from PIL import Image, ImageFilter, ImageOps\n\nEFFECT = {\n    "블러링" : lambda img : img.filter(ImageFilter.BLUR),\n    "엠보싱" : lambda img : img.filter(ImageFilter.EMBOSS),\n    "흑백"   : lambda img : ImageOps.grayscale(img).convert(\'RGB\'),\n}\n\nphoto = Image.open(\'JPG/picture03.jpg\').convert(\'RGB\')\nfor name in EFFECT :\n    out = EFFECT[name](photo)       # 이름으로 효과를 꺼내 쓴다\n    print(name, out.size, out.mode)', points: ['값이 <b>함수</b>인 딕셔너리', '효과 추가 = 한 줄 추가', '메뉴도 <code>for</code> 로 생성', '<code>lambda n = name :</code> 로 값 붙잡기'],
            notes: '<p>실행하면 세 효과가 차례로 적용됩니다. “같은 모양의 코드가 여러 번 보이면 표로 만들 수 있다” 는 신호라고 정리해 주세요. 람다 함정(C_LAMBDA_TRAP)은 본문 예제로 확인시킵니다.</p>' },
          { layout: 'code', title: '되돌리기(Undo) 의 원리', code: C_UNDO, points: ['바꾸기 전 상태를 <code>append</code>', '되돌릴 때 <code>pop()</code>', '빈 스택 검사 필수', '이미지는 <code>copy()</code> 로 저장'],
            notes: '<p>스택 = 접시 쌓기. 맨 위부터 꺼낸다고 비유합니다. 이미지로 하면 메모리를 많이 쓰므로 10단계 제한을 두었다는 점도 설명하세요.</p>' },
          { layout: 'practice', title: '실습 14-13. [이미지 처리(3)] 메뉴', desc: '선명하게(SHARPEN) · 윤곽선(CONTOUR) 메뉴 추가 — 필터 비교 예제로 먼저 효과 확인',
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
          '우주선 그림을 불러와 방향키로 화면 아래쪽 절반 안에서 움직일 수 있다 (Code14-11)',
          '게임 루프를 입력 → 갱신 → 그리기 → 대기 네 단계로 나누어 설명할 수 있다',
          '전역 변수 대신 딕셔너리 · 클래스로 상태를 묶는 방법을 쓸 수 있다'
        ],
        flow: [['게임 소개 · pygame 설치', 4], ['기능 구성 · 주요 변수', 8], ['게임 루프 · Code14-10', 12], ['키보드 이벤트 · Code14-11', 12], ['루프 4단계 · 상태 묶기', 9], ['퀴즈 · 실습', 5]],
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
          { type: 'callout', kind: 'info', title: '줄 끝의 역슬래시(\\)', html: '<code>if … \\</code> 처럼 줄 끝에 역슬래시를 쓰면 “다음 줄에 이어진다” 는 뜻입니다. 조건이 길 때 두 줄로 나눠 쓸 수 있습니다. 괄호 <code>( )</code> 안이라면 역슬래시 없이도 줄을 바꿀 수 있습니다.' },

          { type: 'h', text: '한 걸음 더: 게임 루프를 네 단계로 나누어 생각하기' },
          { type: 'p', html: '게임 루프 안에 코드를 아무렇게나 쌓으면 금세 뒤죽박죽이 됩니다. 어떤 게임이든 루프 한 바퀴(= <b>1 프레임</b>)는 <mark>① 입력 → ② 갱신 → ③ 그리기 → ④ 대기</mark> 네 단계로 나뉩니다. 이 순서를 지키고 <b>서로 섞지 않는 것</b>이 게임 코드를 읽기 쉽게 만드는 첫 번째 규칙입니다.' },
          { type: 'figure', html: SVG_LOOP4, caption: '게임 루프 한 바퀴 = 1 프레임' },
          { type: 'table', head: ['단계', '하는 일', '하지 말아야 할 일'], rows: [
            ['① 입력', '<code>event.get()</code> 으로 키 · 마우스 · 창 닫기를 읽어 <b>의도</b>를 변수에 적는다', '여기서 바로 그리지 않는다'],
            ['② 갱신', '위치 · 점수 · 생명 · 충돌을 <b>계산만</b> 한다', '화면 함수를 부르지 않는다'],
            ['③ 그리기', '배경 → 물체 → 글자 순으로 그리고 <code>display.update()</code>', '여기서 값을 바꾸지 않는다'],
            ['④ 대기', '<code>clock.tick(50)</code> 으로 속도를 맞춘다', '<code>time.sleep()</code> 을 쓰지 않는다']
          ] },
          { type: 'p', html: '②를 함수로 떼어 내면 <b>화면 없이도 시험</b>할 수 있습니다. 아래 예제는 pygame 없이 게임 루프를 흉내 낸 것입니다 — 버그를 찾을 때 이렇게 쪼개 보면 원인이 금방 드러납니다.' },
          { type: 'code', title: '추가 예제. 게임 루프를 pygame 없이 흉내 내기', code: C_LOOP_PURE,
            expect: '프레임 1 : 우주선 x = 250\n프레임 2 : 우주선 x = 255\n프레임 3 : 우주선 x = 260\n프레임 4 : 우주선 x = 255\n프레임 5 : 우주선 x = 255',
            desc: '<code>update()</code> 는 <b>값만</b> 바꾸고 <code>draw()</code> 는 <b>보여 주기만</b> 합니다. 실제 게임에서는 <code>inputs</code> 대신 <code>pygame.event.get()</code> 이 들어올 뿐 구조는 똑같습니다.' },
          { type: 'callout', kind: 'more', title: '📘 프레임 수(FPS)와 움직이는 거리', html: '<p><code>clock.tick(50)</code> 은 “1초에 최대 50번” 을 뜻합니다. 우주선이 한 프레임에 5픽셀 움직이면 1초에 250픽셀을 갑니다. 그래서 <b>tick 값을 바꾸면 게임 속도가 통째로 바뀝니다</b>.</p><p>전문적인 게임은 컴퓨터마다 프레임 수가 달라도 같은 속도로 움직이도록, 지난 프레임에서 흐른 시간(<code>dt = clock.tick(60) / 1000</code>)을 곱해 <code>x += speed * dt</code> 처럼 계산합니다. 이것을 <b>델타 타임(delta time)</b> 방식이라고 합니다. 이 장에서는 이해하기 쉬운 고정 방식을 씁니다.</p>' },

          { type: 'h', text: '한 걸음 더: 전역 변수 줄이기' },
          { type: 'p', html: '교재 코드는 <code>ship, shipSize, monster, missile …</code> 처럼 전역 변수가 많고, 함수마다 <code>global</code> 을 길게 적어야 합니다. 전역 변수가 많으면 <b>누가 언제 바꿨는지 알기 어려워</b> 버그를 찾기 힘듭니다. 해결책은 두 가지입니다.' },
          { type: 'list', ordered: true, items: [
            '<b>딕셔너리 하나에 모으기</b> — <code>state = {\'x\' : 250, \'y\' : 560, \'score\' : 0}</code> 처럼 관련된 값을 한 덩어리로 묶습니다. 딕셔너리는 통째로 넘겨도 <b>안의 값을 바꿀 수 있으므로</b> <code>global</code> 이 필요 없습니다.',
            '<b>클래스로 만들기</b> — 값(위치 · 속도)과 그 값을 다루는 동작(움직이기)을 한 곳에 둡니다. 물체가 여러 개일 때 특히 편합니다.'
          ] },
          { type: 'code', title: '추가 예제. 우주선을 클래스로 만들어 보기', code: String.raw`class Ship :
    def __init__(self, x, y, speed) :
        self.x = x
        self.y = y
        self.speed = speed

    def move(self, dx, dy, maxX, maxY) :
        if 0 <= self.x + dx * self.speed <= maxX :      # 화면 안일 때만
            self.x += dx * self.speed
        if 0 <= self.y + dy * self.speed <= maxY :
            self.y += dy * self.speed

    def __str__(self) :
        return '우주선(%d, %d)' % (self.x, self.y)

ship = Ship(250, 560, 5)
ship.move(1, 0, 452, 636)       # 오른쪽으로
ship.move(0, -1, 452, 636)      # 위로
print(ship)
ship.move(-1, 0, 452, 636)      # 왼쪽으로
print(ship, '/ 속도', ship.speed)`,
            expect: '우주선(255, 555)\n우주선(250, 555) / 속도 5',
            desc: '<code>__str__</code> 을 만들어 두면 <code>print(객체)</code> 가 보기 좋게 나옵니다(디버깅에 아주 편합니다). 우주괴물이 여러 마리인 게임을 만들 때는 이렇게 클래스로 만들고 <b>리스트에 담아</b> 관리합니다.' },
          { type: 'callout', kind: 'more', title: '📘 어디까지 나눌까?', html: '규칙은 간단합니다. <b>같이 바뀌는 값끼리 묶고</b>(우주선의 x · y · 속도), <b>한 화면에 안 들어오는 함수는 쪼갭니다</b>(대략 30줄). 처음부터 완벽한 구조를 만들려고 시간을 쓰기보다, 일단 동작하게 만든 뒤 “같은 코드가 세 번 나오면 함수로, 관련 변수가 네 개를 넘으면 딕셔너리나 클래스로” 정도의 기준으로 다듬는 편이 빠릅니다.' }
        ],
        practice: [
          {
            title: '실습 14-16. 우주선을 더 빠르게, 화면 전체에서 움직이기', level: 2,
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
            title: '실습 14-17. 우주선 위치 계산 연습 (화면 없이)', level: 1,
            desc: '<p>화면 폭 500, 우주선 폭 48 일 때, 우주선이 x = 440 에서 오른쪽(dx = +5)으로 계속 움직인다고 합시다. Code14-11 의 조건 <code>0 &lt; shipX + dx and shipX + dx &lt;= swidth - shipSize[0]</code> 을 써서, 몇 번 움직인 뒤 멈추는지와 멈춘 위치를 출력하세요.</p>',
            hint: '<code>while</code> 로 조건이 참인 동안 <code>shipX += dx</code> 하고 횟수를 셉니다.',
            starter: "swidth = 500\nshipSize = (48, 64)\nshipX, dx = 440, 5\ncount = 0\n# TODO: 조건이 참인 동안 이동하고 횟수 세기\nprint(count, '번 이동, 위치', shipX)\n",
            solution: "swidth = 500\nshipSize = (48, 64)\nshipX, dx = 440, 5\ncount = 0\nwhile 0 < shipX + dx and shipX + dx <= swidth - shipSize[0] :\n    shipX += dx\n    count += 1\nprint(count, '번 이동, 위치', shipX)\n",
            expect: '2 번 이동, 위치 450'
          },
          {
            title: '실습 14-18. 프레임 수로 속도 계산하기', level: 1,
            desc: '<p>게임이 1초에 <b>50 프레임</b>이고 우주선이 한 프레임에 <b>5픽셀</b> 움직인다고 합시다.</p><ul><li>1초 · 2초 · 3초 동안 몇 픽셀을 움직이는지 출력하세요.</li><li>화면 폭 500, 우주선 폭 48 일 때 왼쪽 끝에서 오른쪽 끝까지 가는 데 몇 프레임 · 몇 초가 걸리는지 출력하세요.</li></ul>',
            hint: '1초에 움직이는 거리 = 프레임 수 × 한 프레임 이동량. 걸리는 프레임 = 거리 ÷ 이동량.',
            starter: "FPS = 50          # 1초에 그리는 프레임 수\nSTEP = 5          # 한 프레임에 움직이는 픽셀\n\nfor sec in [1, 2, 3] :\n    # TODO: sec 초 동안의 이동 거리 출력\n    pass\n\ndist = 500 - 48   # 왼쪽 끝에서 오른쪽 끝까지의 거리\n# TODO: 몇 프레임 · 몇 초인지 출력\n",
            solution: "FPS = 50          # 1초에 그리는 프레임 수\nSTEP = 5          # 한 프레임에 움직이는 픽셀\n\nfor sec in [1, 2, 3] :\n    print(sec, '초 →', FPS * STEP * sec, '픽셀')\n\ndist = 500 - 48   # 왼쪽 끝에서 오른쪽 끝까지의 거리\nframes = dist / STEP\nprint('화면 끝까지 : %.1f 프레임 = %.2f 초' % (frames, frames / FPS))\n",
            expect: '1 초 → 250 픽셀\n2 초 → 500 픽셀\n3 초 → 750 픽셀\n화면 끝까지 : 90.4 프레임 = 1.81 초'
          },
          {
            title: '실습 14-19. 갱신 함수에 경계와 발사 더하기', level: 2,
            desc: '<p>본문의 “게임 루프 흉내 내기” 예제를 고쳐 <b>화면 없이 시험</b>해 보세요.</p><ul><li>한 번에 <b>10픽셀</b> 움직인다</li><li>x 는 항상 <b>0 이상 452 이하</b>여야 한다 (넘으면 끝에 붙인다)</li><li>입력에 <code>\'FIRE\'</code> 가 들어오면 발사 횟수 <code>shots</code> 를 1 늘린다</li></ul><p>시작 위치 445, 입력이 <code>[[\'RIGHT\'], [\'RIGHT\'], [\'FIRE\'], [\'LEFT\', \'FIRE\'], [\'LEFT\']]</code> 일 때의 결과를 프레임마다 출력하세요.</p>',
            hint: '경계 처리는 <code>if state[\'x\'] &gt; 452 : state[\'x\'] = 452</code> 처럼 “넘으면 되돌리기” 로 간단히 합니다. 한 입력에 키가 두 개 들어올 수도 있습니다.',
            starter: "def update(state, keys) :\n    if 'LEFT' in keys :\n        state['x'] -= 10\n    if 'RIGHT' in keys :\n        state['x'] += 10\n    # TODO: 0 ~ 452 를 벗어나지 않게 하기\n    # TODO: 'FIRE' 가 있으면 shots 1 증가\n    state['frame'] += 1\n\ndef draw(state) :\n    print('프레임 %d : x = %d, 발사 %d' % (state['frame'], state['x'], state['shots']))\n\nstate = {'x' : 445, 'frame' : 0, 'shots' : 0}\ninputs = [['RIGHT'], ['RIGHT'], ['FIRE'], ['LEFT', 'FIRE'], ['LEFT']]\nfor keys in inputs :\n    update(state, keys)\n    draw(state)\n",
            solution: "def update(state, keys) :\n    if 'LEFT' in keys :\n        state['x'] -= 10\n    if 'RIGHT' in keys :\n        state['x'] += 10\n    if state['x'] < 0 :\n        state['x'] = 0\n    if state['x'] > 452 :\n        state['x'] = 452\n    if 'FIRE' in keys :\n        state['shots'] += 1\n    state['frame'] += 1\n\ndef draw(state) :\n    print('프레임 %d : x = %d, 발사 %d' % (state['frame'], state['x'], state['shots']))\n\nstate = {'x' : 445, 'frame' : 0, 'shots' : 0}\ninputs = [['RIGHT'], ['RIGHT'], ['FIRE'], ['LEFT', 'FIRE'], ['LEFT']]\nfor keys in inputs :\n    update(state, keys)\n    draw(state)\n",
            expect: '프레임 1 : x = 452, 발사 0\n프레임 2 : x = 452, 발사 0\n프레임 3 : x = 452, 발사 1\n프레임 4 : x = 442, 발사 2\n프레임 5 : x = 432, 발사 2'
          },
          {
            title: '실습 14-20. 벽에 튕기는 공 두 개', level: 3,
            desc: '<p>400×300 창 안에서 <b>공 두 개</b>가 서로 다른 속도 · 크기 · 색으로 움직이다가 벽에 닿으면 <b>튕기는</b> 프로그램을 만드세요.</p><ul><li>공 하나의 정보(x, y, dx, dy, 반지름, 색)를 <b>딕셔너리</b> 하나로 만들고, 공들을 <b>리스트</b>에 담습니다</li><li>게임 루프는 ① 입력 ② 갱신 ③ 그리기 ④ 대기 순서를 지킵니다</li><li>창의 [X] 를 누르면 <code>pygame.quit()</code> · <code>sys.exit()</code> 로 끝냅니다</li></ul>',
            hint: '튕기기는 부호 뒤집기입니다: 왼쪽 벽이나 오른쪽 벽에 닿으면 <code>b[\'dx\'] = -b[\'dx\']</code>. 공의 가장자리는 중심에서 반지름만큼 떨어져 있다는 점을 잊지 마세요.',
            starter: "import pygame\nimport sys\n\npygame.init()\nmonitor = pygame.display.set_mode((400, 300))\npygame.display.set_caption('튕기는 공')\nclock = pygame.time.Clock()\n\nballs = [{'x' : 50, 'y' : 40, 'dx' : 4, 'dy' : 3, 'r' : 14, 'c' : (250, 200, 80)}]\n# TODO: 공을 하나 더 넣기\n\nwhile True :\n    for e in pygame.event.get() :\n        if e.type == pygame.QUIT :\n            pygame.quit()\n            sys.exit()\n    # TODO: 공마다 위치를 바꾸고 벽에 닿으면 튕기기\n    monitor.fill((25, 25, 45))\n    # TODO: 공마다 그리기\n    pygame.display.update()\n    clock.tick(50)\n",
            solution: "import pygame\nimport sys\n\npygame.init()\nmonitor = pygame.display.set_mode((400, 300))\npygame.display.set_caption('튕기는 공')\nclock = pygame.time.Clock()\n\nballs = [{'x' : 50, 'y' : 40, 'dx' : 4, 'dy' : 3, 'r' : 14, 'c' : (250, 200, 80)},\n         {'x' : 300, 'y' : 200, 'dx' : -3, 'dy' : 5, 'r' : 22, 'c' : (120, 200, 250)}]\n\nwhile True :\n    # ① 입력\n    for e in pygame.event.get() :\n        if e.type == pygame.QUIT :\n            pygame.quit()\n            sys.exit()\n\n    # ② 갱신\n    for b in balls :\n        b['x'] += b['dx']\n        b['y'] += b['dy']\n        if b['x'] - b['r'] < 0 or b['x'] + b['r'] > 400 :\n            b['dx'] = -b['dx']\n        if b['y'] - b['r'] < 0 or b['y'] + b['r'] > 300 :\n            b['dy'] = -b['dy']\n\n    # ③ 그리기\n    monitor.fill((25, 25, 45))\n    for b in balls :\n        pygame.draw.circle(monitor, b['c'], (b['x'], b['y']), b['r'])\n    pygame.display.update()\n\n    # ④ 대기\n    clock.tick(50)\n"
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
          { layout: 'diagram', title: '루프 한 바퀴 = 입력 → 갱신 → 그리기 → 대기', html: SVG_LOOP4, caption: '네 단계를 섞지 않는 것이 첫 번째 규칙',
            notes: '<p>앞의 6단계 그림(SVG_LOOP)을 네 덩어리로 정리한 것입니다. “갱신에서는 그리지 않고, 그리기에서는 계산하지 않는다” 를 구호처럼 반복해 주세요. 14-5 의 확장판 코드가 이 주석 순서 그대로입니다.</p>' },
          { layout: 'code', title: '갱신 함수는 화면 없이 시험할 수 있다', code: C_LOOP_PURE, points: ['<code>update()</code> 는 값만 바꾼다', '<code>draw()</code> 는 보여 주기만', 'pygame 없이 실행 가능', '버그 찾기가 훨씬 쉬워진다'],
            notes: '<p>실습 14-19 로 이어집니다. 화면이 없으면 결과를 눈으로 확인하기 쉽고, 같은 입력으로 몇 번이든 다시 돌려볼 수 있다는 장점을 강조하세요.</p>' },
          { layout: 'practice', title: '실습 14-17. 우주선 위치 계산', desc: 'x=440 에서 dx=+5 로 움직일 때 몇 번 뒤 멈추나? (화면 폭 500, 우주선 폭 48)',
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
          'font 로 점수를 화면에 쓰고 슈팅 게임을 완성할 수 있다 (Code14-14)',
          '난이도 · 생명 · 최고 점수 · 효과음으로 게임을 확장할 수 있다',
          '파일에 기록을 남길 때 예외 처리로 첫 실행과 잘못된 내용을 대비할 수 있다'
        ],
        flow: [['우주괴물 등장 · 이동', 10], ['미사일 발사 · 이동', 10], ['충돌 판정 · 점수 · 완성', 13], ['확장: 난이도 · 생명 · 기록 · 소리', 10], ['정리 · 퀴즈 · 실습', 7]],
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
          { type: 'callout', kind: 'more', title: '📘 게임을 더 발전시켜 보기', html: '<ul><li>괴물이 오른쪽 끝을 그냥 지나가면 “놓친 수” 를 세고 3마리를 놓치면 게임 오버</li><li>점수가 오를수록 괴물 속도를 빠르게 (<code>randrange(1, 5 + fireCount // 5)</code>)</li><li><code>pygame.mixer.Sound(\'파일.wav\').play()</code> 로 발사 · 폭발 소리</li><li>미사일을 리스트로 관리해 여러 발 동시에 쏘기</li></ul>' },

          { type: 'h', text: '확장 단계 ① 무엇을 더할지 정하기' },
          { type: 'p', html: '게임이 “한 판 하고 싶어지는” 게임이 되려면 <b>목표 · 긴장 · 기록</b>이 필요합니다. 아래 네 가지가 그 최소 조합입니다.' },
          { type: 'table', head: ['확장', '왜 필요한가', '어떻게 구현하나'], rows: [
            ['<b>난이도</b>', '계속 같은 속도면 금방 지루하다', '점수에 따라 괴물 속도를 올린다 (<code>randrange(1, 5) + score // 5</code>)'],
            ['<b>생명</b>', '실패할 수 있어야 긴장이 생긴다', '괴물을 놓치면 <code>life -= 1</code>, 0 이면 게임 오버'],
            ['<b>최고 점수</b>', '다시 하고 싶은 이유를 만든다', '파일에 기록하고 시작할 때 읽어 온다'],
            ['<b>효과음</b>', '조작에 대한 반응이 있어야 손맛이 난다', '<code>pygame.mixer.Sound(\'game/shoot.wav\').play()</code>']
          ] },
          { type: 'code', title: '추가 예제. 점수에 따라 난이도 올리기', code: C_LEVEL,
            expect: '점수  0 → 레벨 1 · 기본 속도 + 0\n점수  2 → 레벨 1 · 기본 속도 + 0\n점수  3 → 레벨 1 · 기본 속도 + 1\n점수  8 → 레벨 2 · 기본 속도 + 2\n점수 15 → 레벨 4 · 기본 속도 + 5\n점수 30 → 레벨 5 · 기본 속도 + 10',
            desc: '<code>//</code> 는 몫만 남기는 나눗셈이라 “몇 마리마다 한 단계” 를 쉽게 표현합니다. <code>min(5, …)</code> 으로 <b>상한</b>을 두지 않으면 나중에 손댈 수 없을 만큼 빨라집니다 — 난이도는 반드시 한계를 정해 두세요.' },
          { type: 'h', text: '확장 단계 ② 최고 점수를 파일에 남기기' },
          { type: 'p', html: '프로그램이 끝나면 변수는 모두 사라집니다. 기록을 남기려면 <b>파일</b>에 써야 합니다. 이때 중요한 것은 <mark>파일이 아직 없는 첫 실행</mark>과 <mark>파일 내용이 망가진 경우</mark>를 모두 견디는 것입니다.' },
          { type: 'code', title: '추가 예제. 최고 점수 읽기 · 쓰기 (예외 처리 포함)', code: C_HIGHSCORE,
            expect: '처음 최고 점수 : 0\n3 점 → 신기록!\n7 점 → 신기록!\n5 점 (최고 기록은 7 점)\n저장된 값 : 7',
            desc: '<code>try … except FileNotFoundError</code> 로 첫 실행을, <code>except ValueError</code> 로 숫자가 아닌 내용을 막았습니다. 이렇게 <b>실패해도 프로그램이 멈추지 않게</b> 만드는 것이 사용자 경험의 기본입니다.' },
          { type: 'callout', kind: 'more', title: '📘 효과음 넣기', html: '<p>이 강좌의 작업 폴더에는 짧은 효과음 두 개가 준비되어 있습니다 — <code>game/shoot.wav</code>(발사), <code>game/boom.wav</code>(폭발). 파이썬으로 소리를 직접 합성해 만든 파일입니다.</p><pre><code>shoot = pygame.mixer.Sound(\'game/shoot.wav\')\nshoot.set_volume(0.5)\nshoot.play()</code></pre><p>소리 파일이 없는 환경에서도 게임이 돌아가야 하므로, 불러오는 부분을 <code>try … except</code> 로 감싸고 소리가 없으면 그냥 넘어가게 만드는 것이 좋습니다. 아래 확장판 코드가 그렇게 되어 있습니다.</p>' },

          { type: 'h', text: '확장 단계 ③ 슈팅 게임 확장판 (완성)' },
          { type: 'p', html: '네 가지 확장을 모두 넣고, 앞에서 배운 <b>루프 4단계</b>와 <b>state 딕셔너리</b>로 구조를 다시 짠 코드입니다. 전역 변수가 크게 줄어 <code>global</code> 선언이 한 줄도 없다는 점을 눈여겨보세요.' },
          { type: 'code', title: '추가 예제. [프로젝트 2] 확장판 — 난이도 · 생명 · 최고 점수 · 효과음', code: C_GAME_PLUS, nondeterministic: true,
            desc: '게임 창을 클릭한 뒤 방향키와 스페이스바로 즐겨 보세요. 괴물을 놓치면 생명이 줄고, 0 이 되면 콘솔에 최종 점수와 최고 기록이 출력되며 끝납니다. 다시 실행하면 <code>best_score.txt</code> 에서 최고 기록을 읽어 옵니다.' },
          { type: 'table', caption: '교재 코드와 확장판의 구조 비교', head: ['항목', '교재 Code14-14', '확장판'], rows: [
            ['전역 변수', '<code>monitor, ship, shipSize, monster, monsterImage, missile, r, g, b …</code>', '상수(<code>SW, SH, BEST_FILE</code>)와 <code>monitor, font</code> 정도'],
            ['<code>global</code> 선언', '함수마다 길게 나열', '없음 — <code>state</code> 딕셔너리를 넘겨 쓴다'],
            ['괴물 만들기', '같은 네 줄이 세 군데 반복', '<code>new_monster(score)</code> 함수 하나'],
            ['루프 안', '기능 주석이 순서 없이 섞임', '① 입력 ② 갱신 ③ 그리기 ④ 대기 로 구분'],
            ['충돌 판정', '부등호 네 개를 <code>and</code> 로', '<code>pygame.Rect(...).collidepoint(...)</code>']
          ] },
          { type: 'callout', kind: 'more', title: '📘 여기서 더 나아간다면', html: '<ul><li><b>미사일 여러 발</b> — <code>missiles = []</code> 리스트로 관리하고, 매 프레임 모두 움직인 뒤 화면 밖으로 나간 것만 지웁니다(실습 14-24).</li><li><b>괴물 여러 마리</b> — <code>monsters = [new_monster(0) for _ in range(3)]</code></li><li><b>스프라이트</b> — pygame 의 <code>sprite.Sprite</code> · <code>sprite.Group</code> · <code>spritecollide()</code> 를 쓰면 여러 물체의 이동 · 그리기 · 충돌을 한 줄씩으로 처리할 수 있습니다.</li><li><b>시작 화면 · 일시 정지</b> — <code>scene</code> 변수로 \'title\' · \'play\' · \'over\' 를 구분하고 루프 안에서 갈라 줍니다(상태 기계).</li></ul>' }
        ],
        practice: [
          {
            title: '실습 14-21. 놓친 우주괴물 세기 (게임 오버)', level: 3,
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
            title: '실습 14-22. 충돌 판정 표 만들기 (화면 없이)', level: 1,
            desc: '<p>우주괴물이 (200, 100) 에 있고 크기가 (60, 52) 일 때, 미사일 위치 (230, 120), (190, 120), (230, 160), (259, 151) 각각에 대해 맞았는지 출력하세요. Code14-14 와 같은 조건을 사용합니다.</p>',
            hint: '미사일 위치를 튜플의 리스트로 만들고 for 로 돌며 조건을 검사합니다.',
            starter: "monsterX, monsterY = 200, 100\nmonsterSize = (60, 52)\nfor missileX, missileY in [(230, 120), (190, 120), (230, 160), (259, 151)] :\n    # TODO: 맞았으면 '맞음', 아니면 '빗나감'\n    pass\n",
            solution: "monsterX, monsterY = 200, 100\nmonsterSize = (60, 52)\nfor missileX, missileY in [(230, 120), (190, 120), (230, 160), (259, 151)] :\n    if (monsterX < missileX and missileX < monsterX + monsterSize[0]) and \\\n        (monsterY < missileY and missileY < monsterY + monsterSize[1]) :\n        print(missileX, missileY, '맞음')\n    else :\n        print(missileX, missileY, '빗나감')\n",
            expect: '230 120 맞음\n190 120 빗나감\n230 160 빗나감\n259 151 맞음'
          },
          {
            title: '실습 14-23. 난이도 표 만들기', level: 1,
            desc: '<p>점수에 따라 <b>레벨 · 괴물 속도 범위 · 등급</b>이 어떻게 달라지는지 표로 출력하세요.</p><ul><li>레벨 = <code>min(5, 1 + 점수 // 5)</code></li><li>속도 범위 = <code>1 ~ (4 + 점수 // 5)</code></li><li>등급 = 20점 이상 “고수”, 10점 이상 “중수”, 그 밖에는 “초보”</li></ul><p>점수 0, 7, 12, 25 에 대해 출력합니다.</p>',
            hint: '등급은 <code>if … elif … else</code> 로 나누고, 큰 값부터 검사해야 합니다(20 을 먼저!).',
            starter: "def level_of(score) :\n    return min(5, 1 + score // 5)\n\ndef grade_of(score) :\n    # TODO: 20 이상 고수 / 10 이상 중수 / 나머지 초보\n    return ''\n\nfor score in [0, 7, 12, 25] :\n    # TODO: '점수 %2d : 레벨 %d, 속도 1~%d, %s' 형식으로 출력\n    pass\n",
            solution: "def level_of(score) :\n    return min(5, 1 + score // 5)\n\ndef grade_of(score) :\n    if score >= 20 :\n        return '고수'\n    elif score >= 10 :\n        return '중수'\n    else :\n        return '초보'\n\nfor score in [0, 7, 12, 25] :\n    print('점수 %2d : 레벨 %d, 속도 1~%d, %s'\n          % (score, level_of(score), 4 + score // 5, grade_of(score)))\n",
            expect: '점수  0 : 레벨 1, 속도 1~4, 초보\n점수  7 : 레벨 2, 속도 1~5, 초보\n점수 12 : 레벨 3, 속도 1~6, 중수\n점수 25 : 레벨 5, 속도 1~9, 고수'
          },
          {
            title: '실습 14-24. 미사일을 여러 발 쏘기 (확장판 고치기)', level: 2,
            desc: '<p>확장판 게임은 미사일을 <b>한 번에 한 발</b>만 쏠 수 있습니다. <code>state[\'mx\'], state[\'my\']</code> 대신 <b>미사일 리스트</b>를 써서 여러 발을 동시에 쏠 수 있게 고치세요.</p><ul><li>발사할 때 <code>state[\'shots\'].append({\'x\' : …, \'y\' : …})</code></li><li>갱신할 때 모든 미사일을 위로 옮기고, 화면 밖으로 나간 것과 괴물을 맞힌 것은 리스트에서 <b>지웁니다</b></li><li>그리기에서도 모든 미사일을 그립니다</li></ul>',
            hint: '반복하면서 리스트에서 지우면 건너뛰는 항목이 생깁니다. <b>남길 것만 모아 새 리스트를 만드는</b> 방법이 안전합니다: <code>state[\'shots\'] = keep</code>',
            starter: C_GAME_PLUS.replace("             'mx' : None, 'my' : None, 'score' : 0, 'life' : 3, 'best' : load_best()}", "             'shots' : [], 'score' : 0, 'life' : 3, 'best' : load_best()}\n    # TODO: mx · my 를 쓰는 부분을 모두 shots 리스트로 바꾸기"),
            solution: C_GAME_PLUS
              .replace("             'mx' : None, 'my' : None, 'score' : 0, 'life' : 3, 'best' : load_best()}", "             'shots' : [], 'score' : 0, 'life' : 3, 'best' : load_best()}")
              .replace("                elif e.key == pygame.K_SPACE and state['mx'] == None :\n                    state['mx'] = state['x'] + shipSize[0] / 2\n                    state['my'] = state['y']\n                    play_sound(shoot)", "                elif e.key == pygame.K_SPACE :\n                    state['shots'].append({'x' : state['x'] + shipSize[0] / 2, 'y' : state['y']})\n                    play_sound(shoot)")
              .replace("        if state['mx'] != None :\n            state['my'] -= 12\n            if state['my'] < 0 :\n                state['mx'], state['my'] = None, None\n\n        if state['mx'] != None :\n            box = pygame.Rect(monster['x'], monster['y'], monster['size'][0], monster['size'][1])\n            if box.collidepoint(state['mx'], state['my']) :\n                state['score'] += 1\n                play_sound(boom)\n                monster = new_monster(state['score'])\n                state['mx'], state['my'] = None, None", "        box = pygame.Rect(monster['x'], monster['y'], monster['size'][0], monster['size'][1])\n        keep = []                                       # 남길 미사일만 모은다\n        for m in state['shots'] :\n            m['y'] -= 12\n            if m['y'] < 0 :                             # 화면 위로 나감\n                continue\n            if box.collidepoint(m['x'], m['y']) :       # 맞힘\n                state['score'] += 1\n                play_sound(boom)\n                monster = new_monster(state['score'])\n                continue\n            keep.append(m)\n        state['shots'] = keep")
              .replace("        if state['mx'] != None :\n            monitor.blit(missile, (int(state['mx']), int(state['my'])))", "        for m in state['shots'] :\n            monitor.blit(missile, (int(m['x']), int(m['y'])))"),
            nondeterministic: true
          },
          {
            title: '실습 14-25. 상위 3위 기록표 만들기', level: 2,
            desc: '<p>게임이 끝날 때마다 점수를 파일 <code>rank.txt</code> 에 한 줄씩 이어 쓰고, <b>상위 3위</b>를 출력하는 함수를 만드세요.</p><p>점수 5, 12, 3, 20, 9 를 차례로 기록한 뒤 전체 기록 수와 1~3위를 출력합니다.</p>',
            hint: '<code>sorted(리스트, reverse = True)</code> 로 큰 값부터 정렬하고 <code>[:3]</code> 으로 앞 3개만 자릅니다. 순위 번호는 <code>enumerate(목록, 1)</code> 로 붙입니다.',
            starter: "RANK_FILE = 'rank.txt'\n\ndef add_score(score) :\n    # TODO: 파일에 한 줄 이어 쓰기 ('a' 모드)\n    pass\n\ndef load_scores() :\n    # TODO: 파일을 읽어 정수 리스트로 (없으면 빈 리스트)\n    return []\n\ndef top3() :\n    # TODO: 큰 값부터 3개\n    return []\n\nfor s in [5, 12, 3, 20, 9] :\n    add_score(s)\nprint('기록 수 :', len(load_scores()))\n",
            solution: "RANK_FILE = 'rank.txt'\n\ndef add_score(score) :\n    with open(RANK_FILE, 'a', encoding = 'utf-8') as f :\n        f.write(str(score) + '\\n')\n\ndef load_scores() :\n    try :\n        with open(RANK_FILE, encoding = 'utf-8') as f :\n            return [int(line) for line in f if line.strip() != '']\n    except FileNotFoundError :\n        return []\n\ndef top3() :\n    return sorted(load_scores(), reverse = True)[:3]\n\nfor s in [5, 12, 3, 20, 9] :\n    add_score(s)\nprint('기록 수 :', len(load_scores()))\nfor i, s in enumerate(top3(), 1) :\n    print('%d위 : %d점' % (i, s))\n",
            expect: '기록 수 : 5\n1위 : 20점\n2위 : 12점\n3위 : 9점'
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
          { layout: 'bullets', title: '확장: 목표 · 긴장 · 기록', lead: '“한 판 더” 하고 싶어지는 게임의 최소 조합', bullets: [
            '<b>난이도</b> — 점수에 따라 속도 상승 (상한을 꼭 둔다)',
            '<b>생명</b> — 놓치면 <code>life -= 1</code>, 0 이면 게임 오버',
            '<b>최고 점수</b> — 파일에 남기고 시작할 때 읽기',
            '<b>효과음</b> — <code>mixer.Sound(\'game/shoot.wav\').play()</code>',
            '구조도 함께 정리: 전역 변수 → <code>state</code> 딕셔너리'
          ], notes: '<p>확장 아이디어를 학생들에게 먼저 물어본 뒤 이 네 가지로 정리합니다. 난이도에 상한이 없으면 곧 플레이가 불가능해진다는 점을 실제로 보여 주면 재미있습니다.</p>' },
          { layout: 'code', title: '최고 점수 파일 (예외 처리)', code: C_HIGHSCORE.replace('    except ValueError :             # 파일 내용이 숫자가 아니면\n        return 0\n', ''), points: ['첫 실행 = 파일 없음', '<code>except FileNotFoundError</code>', '내용이 망가지면 <code>ValueError</code>', '실패해도 멈추지 않게'],
            notes: '<p>파일이 없을 때 그냥 오류로 죽는 프로그램과, 0 으로 시작하는 프로그램의 차이를 이야기합니다. “예외 처리는 사용자를 위한 배려” 라고 정리하세요.</p>' },
          { layout: 'practice', title: '실습 14-22. 충돌 판정 표', desc: '괴물 (200, 100), 크기 (60, 52) 일 때 미사일 네 위치의 맞음/빗나감 출력',
            starter: "monsterX, monsterY = 200, 100\nmonsterSize = (60, 52)\nfor missileX, missileY in [(230, 120), (190, 120), (230, 160), (259, 151)] :\n    # TODO\n    pass\n",
            solution: "monsterX, monsterY = 200, 100\nmonsterSize = (60, 52)\nfor missileX, missileY in [(230, 120), (190, 120), (230, 160), (259, 151)] :\n    if (monsterX < missileX and missileX < monsterX + monsterSize[0]) and \\\n        (monsterY < missileY and missileY < monsterY + monsterSize[1]) :\n        print(missileX, missileY, '맞음')\n    else :\n        print(missileX, missileY, '빗나감')\n",
            notes: '<p>도전 과제 실습 14-21(놓친 수 · 게임 오버)는 본문에서 진행합니다. 시간이 남으면 확장판 코드를 열어 두고 “더 발전시켜 보기” 목록 중 하나를 골라 보게 합니다.</p>' },
          { layout: 'summary', title: '[프로젝트 2] 정리', bullets: ['슈팅 게임: 게임 루프 안에서 위치 변경 · 그리기', 'None 으로 “없음” 표시, 좌표 비교로 충돌 판정', '확장: 난이도 · 생명 · 최고 점수 · 효과음', '구조 정리: 전역 변수 → <code>state</code> 딕셔너리 · 함수 분리', '다음 시간부터는 같은 방법으로 <b>새 프로젝트</b>를 만든다'],
            notes: '<p>두 프로젝트를 자기만의 기능으로 확장해 보는 것을 과제로 제안합니다. 14-6(타자 연습) · 14-7(막대그래프)에서는 강의자료 없이 요구 사항부터 스스로 만들어 본다고 예고하세요.</p>' }
        ]
      },

      /* ============================================================ 14-6 (추가) */
      {
        id: 'ch14-6',
        title: '[프로젝트 3] 타자 연습 만들기 (tkinter · 시간 · 파일)',
        minutes: 50,
        goals: [
          '요구 사항을 목록으로 적고 기능을 화면 · 채점 · 통계로 분해할 수 있다',
          '1단계 화면 → 2단계 동작 → 3단계 완성의 순서로 프로그램을 키워 갈 수 있다',
          'Entry 위젯과 <Return> 키 이벤트를 연결해 입력을 처리할 수 있다',
          '여러 상태 값을 딕셔너리 하나로 묶어 전역 변수를 줄일 수 있다',
          'time 으로 걸린 시간을 재고 정확도 · 분당 타수를 계산할 수 있다',
          '결과를 파일에 이어 쓰고 다시 읽어 최근 기록을 보여 줄 수 있다'
        ],
        flow: [['요구 사항 정리 · 기능 분해', 8], ['1단계 화면 만들기', 8], ['2단계 채점과 다음 문제', 12], ['3단계 통계 · 파일 기록', 12], ['확장 아이디어', 4], ['퀴즈 · 실습', 6]],
        content: [
          { type: 'h', text: '이번에는 처음부터 우리가 설계합니다' },
          { type: 'p', html: '앞의 두 프로젝트는 만들 것이 정해져 있었습니다. 이번에는 <b>요구 사항을 적는 일부터</b> 직접 해 봅니다. 만들 프로그램은 <b>타자 연습</b>입니다 — 화면에 나온 문장을 그대로 치고 엔터를 누르면 다음 문장이 나오고, 끝나면 <b>걸린 시간 · 분당 타수 · 정확도</b>를 알려 주며 결과를 파일에 남깁니다.' },
          { type: 'h', text: '① 요구 사항' },
          { type: 'list', ordered: true, items: [
            '프로그램을 켜면 문장 하나와 입력칸이 보이고, 커서가 입력칸에 있다.',
            '문장을 치고 <b>엔터</b>를 누르면 채점하고 다음 문장으로 넘어간다.',
            '화면에 “<b>3 / 8 문장</b>” 처럼 진행 상황이 보인다.',
            '문장을 모두 치면 <b>걸린 시간 · 분당 타수 · 정확도</b>를 보여 준다.',
            '결과 한 줄을 <b>파일에 기록</b>하고, 화면 아래에 최근 기록 3개를 보여 준다.',
            '[다시 시작] 을 누르면 처음부터 다시 할 수 있다.',
            '빈칸으로 엔터를 쳐도, 문장 파일이 없어도 <b>오류로 멈추지 않는다</b>.'
          ] },
          { type: 'h', text: '② 기능 분해 — 화면 / 상태 / 계산 / 저장' },
          { type: 'figure', html: SVG_TYPING, caption: '화면에 보이는 것과 화면 뒤에 숨은 것(상태)' },
          { type: 'table', head: ['덩어리', '필요한 것', '함수'], rows: [
            ['화면', '문장 Label · 입력 Entry · 상태 Label · 버튼', '<code>show_question()</code>'],
            ['상태', '몇 번째 문장 · 친 글자 수 · 문장별 정확도 · 시작 시각', '<code>state</code> 딕셔너리'],
            ['계산', '정확도(%) · 걸린 시간 · 분당 타수', '<code>accuracy()</code> · <code>finish()</code>'],
            ['저장', '결과 한 줄 기록 · 최근 기록 읽기', '<code>save_result()</code> · <code>recent_results()</code>'],
            ['데이터', '연습할 문장 목록', '<code>load_sentences()</code>']
          ] },
          { type: 'callout', kind: 'tip', title: '문장은 파일에서 읽습니다', html: '작업 폴더의 <code>ch14/typing.txt</code> 에 연습 문장 8개가 한 줄씩 들어 있습니다. 문장을 코드 안에 적지 않고 <b>파일에서 읽으면</b>, 문장을 바꾸고 싶을 때 코드를 건드릴 필요가 없습니다. 이렇게 “바뀌는 것(데이터)” 과 “바뀌지 않는 것(코드)” 을 떼어 놓는 것이 좋은 설계의 기본입니다.' },

          { type: 'h', text: '1단계 — 화면부터 만들기' },
          { type: 'p', html: '먼저 <b>움직이지 않는 화면</b>만 만듭니다. 이 단계의 목표는 “보이는 것이 다 있는가?” 뿐입니다. 아직 엔터를 눌러도 아무 일도 일어나지 않습니다.' },
          { type: 'code', title: '타자 연습 1단계. 화면 만들기', code: TY1,
            desc: '<code>pack(pady = …)</code> 으로 위젯 사이를 띄웠습니다. <code>entAnswer.focus_set()</code> 은 프로그램을 켜자마자 커서를 입력칸에 두어, 사용자가 바로 칠 수 있게 합니다 — 작지만 큰 배려입니다.' },
          { type: 'callout', kind: 'more', title: '📘 파일을 읽는 함수를 따로 만든 이유', html: '<code>load_sentences()</code> 는 화면과 아무 관련이 없습니다. 그래서 <b>화면 없이도 시험</b>할 수 있습니다. <code>print(load_sentences(\'ch14/typing.txt\'))</code> 만 해 보면 파일을 제대로 읽는지 바로 알 수 있지요. 화면을 만들기 전에 이런 부분부터 확인해 두면, 나중에 “화면이 안 나와요” 와 “파일을 못 읽어요” 를 헷갈리지 않습니다.' },

          { type: 'h', text: '2단계 — 엔터를 누르면 채점하고 다음 문장' },
          { type: 'p', html: '이제 <b>동작</b>을 넣습니다. 핵심은 두 가지입니다.' },
          { type: 'list', items: [
            '<b>키 이벤트 연결</b> — <code>entAnswer.bind(\'&lt;Return&gt;\', check)</code>. 엔터를 누르면 tkinter 가 <code>check(event)</code> 를 불러 줍니다. 그래서 <code>check()</code> 는 <code>def check(event = None)</code> 처럼 <b>매개변수 하나를 받을 준비</b>를 해 둡니다(버튼에서 부를 때는 값이 없으므로 기본값 None).',
            '<b>상태 관리</b> — 몇 번째 문장인지, 몇 글자를 쳤는지를 <code>state</code> 딕셔너리 하나에 모읍니다. 딕셔너리는 <b>안의 값을 바꾸어도 같은 객체</b>이므로 함수 안에서 <code>global</code> 없이 <code>state[\'index\'] += 1</code> 이 됩니다.'
          ] },
          { type: 'p', html: '정확도는 두 문장을 <b>한 글자씩</b> 비교해서 맞은 글자의 비율로 계산합니다. 계산만 하는 함수이므로 화면 없이 먼저 시험해 봅시다.' },
          { type: 'code', title: '추가 예제. 정확도 함수 먼저 만들고 시험하기', code: C_ASSERT,
            expect: '100.0\n88.9\n33.3\n0.0\n테스트 통과!',
            desc: '<code>assert 조건</code> 은 조건이 거짓이면 오류를 내며 멈춥니다. 이렇게 <b>스스로 검사하는 한 줄</b>을 붙여 두면, 나중에 함수를 고쳤을 때 잘못된 변경을 바로 알아챌 수 있습니다. <code>max(len(target), 1)</code> 은 빈 문장일 때 0 으로 나누는 것을 막습니다.' },
          { type: 'code', title: '타자 연습 2단계. 채점하고 다음 문장으로', code: TY2,
            desc: '<code>show_question()</code> 은 “지금 상태를 화면에 반영” 하는 함수이고, <code>check()</code> 는 “입력을 받아 상태를 바꾸는” 함수입니다. 게임 루프의 <b>그리기</b>와 <b>갱신</b>을 나눈 것과 똑같은 구조입니다.' },
          { type: 'callout', kind: 'warn', title: '흔한 실수 세 가지', html: '<ul><li><code>bind(\'&lt;Return&gt;\', check())</code> — 괄호를 붙이면 그 자리에서 한 번 실행되고 끝입니다. <code>check</code> 만 넘기세요.</li><li><code>def check() :</code> 로 만들면 <code>TypeError: check() takes 0 positional arguments but 1 was given</code> — 이벤트가 들어올 자리를 만들어야 합니다.</li><li>마지막 문장을 친 뒤 <code>state[\'index\']</code> 가 문장 수와 같아졌는데 <code>show_question()</code> 을 부르면 <code>IndexError</code> — <b>끝났는지 먼저 검사</b>해야 합니다.</li></ul>' },

          { type: 'h', text: '3단계 — 통계와 파일 기록 (완성)' },
          { type: 'p', html: '마지막으로 <b>결과를 남기는</b> 기능을 넣습니다. 파일을 <code>\'a\'</code>(append, 이어 쓰기) 모드로 열면 기존 내용을 지우지 않고 뒤에 한 줄을 덧붙입니다.' },
          { type: 'code', title: '추가 예제. 결과 파일에 이어 쓰고 최근 기록 읽기', code: C_RESULT_FILE,
            expect: '처음 기록 : []\n2026-03-02 10:05,22.1초,121타,99.0%\n2026-03-02 10:11,20.8초,122타,99.5%\n2026-03-02 10:20,19.3초,123타,100.0%',
            desc: '<code>[-3:]</code> 은 리스트의 <b>뒤에서 3개</b>를 잘라 냅니다. 기록이 3개보다 적어도 오류 없이 있는 만큼만 돌려줍니다. 실제 프로그램에서는 시각을 <code>datetime.datetime.now()</code> 로 얻지만, 여기서는 결과를 고정하려고 값을 직접 넘겼습니다.' },
          { type: 'p', html: '분당 타수는 <code>친 글자 수 ÷ 걸린 시간(초) × 60</code> 입니다. 걸린 시간이 0 에 가까우면 어마어마한 숫자가 나오므로 <code>max(0.1, …)</code> 으로 <b>바닥을 깔아 둡니다</b>.' },
          { type: 'code', title: '[프로젝트 3] 완성: 타자 연습', code: TY3,
            desc: '문장을 모두 치면 통계가 나오고 <code>typing_result.txt</code> 에 기록이 쌓입니다. [다시 시작] 을 누르면 상태만 초기화하고 화면을 다시 그립니다 — <b>프로그램을 껐다 켜지 않아도</b> 처음으로 돌아갈 수 있게 만드는 것이 좋은 설계입니다.' },
          { type: 'callout', kind: 'more', title: '📘 여기서 더 해 본다면', html: '<ul><li><b>틀린 글자 표시</b> — 입력칸의 글자와 제시 문장을 비교해 틀린 위치부터 빨간색으로 보여 주기 (<code>Text</code> 위젯의 태그 기능)</li><li><b>제한 시간</b> — <code>window.after(1000, tick)</code> 으로 1초마다 남은 시간을 줄이고 0 이 되면 종료</li><li><b>난이도</b> — 문장 파일을 쉬움 · 어려움으로 나누고 시작 화면에서 고르기</li><li><b>통계 화면</b> — 기록 파일을 읽어 날짜별 분당 타수를 14-7 에서 배울 막대그래프로 그리기</li><li><b>키보드 소리</b> — 글자를 칠 때마다 짧은 소리 재생</li></ul>' }
        ],
        practice: [
          {
            title: '실습 14-26. 문장 파일 살펴보기', level: 1,
            desc: '<p><code>ch14/typing.txt</code> 를 읽어 <b>문장 수</b>, <b>가장 긴 문장</b>, <b>글자 수 평균</b>을 출력하세요. (공백도 한 글자로 셉니다.)</p>',
            hint: '<code>max(리스트, key = len)</code> 은 가장 긴 문자열을 돌려줍니다. 평균은 전체 글자 수 ÷ 문장 수.',
            starter: "def load_sentences(fname) :\n    lines = []\n    with open(fname, encoding = 'utf-8') as f :\n        for line in f :\n            line = line.strip()\n            if line != '' :\n                lines.append(line)\n    return lines\n\nsentences = load_sentences('ch14/typing.txt')\nprint('문장 수 :', len(sentences))\n# TODO: 가장 긴 문장과 평균 글자 수 출력\n",
            solution: "def load_sentences(fname) :\n    lines = []\n    with open(fname, encoding = 'utf-8') as f :\n        for line in f :\n            line = line.strip()\n            if line != '' :\n                lines.append(line)\n    return lines\n\nsentences = load_sentences('ch14/typing.txt')\nprint('문장 수 :', len(sentences))\nlongest = max(sentences, key = len)\nprint('가장 긴 문장 :', longest, '(%d글자)' % len(longest))\ntotal = 0\nfor s in sentences :\n    total += len(s)\nprint('평균 글자 수 : %.1f' % (total / len(sentences)))\n",
            expect: '문장 수 : 8\n가장 긴 문장 : 파이썬은 배우기 쉬운 프로그래밍 언어이다 (22글자)\n평균 글자 수 : 17.9'
          },
          {
            title: '실습 14-27. 분당 타수 계산기', level: 1,
            desc: '<p>친 글자 수와 걸린 시간(초)을 받아 <b>분당 타수</b>를 돌려주는 함수 <code>speed(chars, spent)</code> 를 만드세요. 걸린 시간이 0 이거나 음수여도 오류가 나지 않아야 합니다(최소 0.1초로 봅니다).</p><p>(120글자, 30초) · (120글자, 60초) · (50글자, 0초) 세 경우를 출력하세요.</p>',
            hint: '<code>spent = max(0.1, spent)</code> 로 바닥을 깔아 둔 뒤 <code>chars / spent * 60</code> 을 계산합니다.',
            starter: "def speed(chars, spent) :\n    # TODO: 최소 0.1초로 보정한 뒤 분당 타수 계산\n    return 0\n\nfor chars, spent in [(120, 30), (120, 60), (50, 0)] :\n    print('%d글자 %.1f초 → 분당 %.0f타' % (chars, spent, speed(chars, spent)))\n",
            solution: "def speed(chars, spent) :\n    spent = max(0.1, spent)        # 0 으로 나누지 않도록\n    return chars / spent * 60\n\nfor chars, spent in [(120, 30), (120, 60), (50, 0)] :\n    print('%d글자 %.1f초 → 분당 %.0f타' % (chars, spent, speed(chars, spent)))\n",
            expect: '120글자 30.0초 → 분당 240타\n120글자 60.0초 → 분당 120타\n50글자 0.0초 → 분당 30000타'
          },
          {
            title: '실습 14-28. 정확도 함수 고치기 (길이가 다를 때)', level: 2,
            desc: '<p>본문의 <code>accuracy()</code> 는 <b>더 많이 친 경우</b>를 벌점 없이 넘어갑니다. 예를 들어 “파이썬” 을 “파이썬입니다” 로 쳐도 100% 가 나옵니다.</p><p>친 글자 수가 제시 문장보다 길면 그만큼 감점하도록 고치세요. 새 정확도 = <code>맞은 글자 수 ÷ max(제시 길이, 친 길이) × 100</code>.</p><p>비교를 위해 옛 함수와 새 함수의 결과를 함께 출력하세요.</p>',
            hint: '분모만 <code>max(len(target), len(typed), 1)</code> 로 바꾸면 됩니다. 두 함수를 모두 두고 비교해 보세요.',
            starter: "def accuracy(target, typed) :\n    hit = 0\n    for i in range(min(len(target), len(typed))) :\n        if target[i] == typed[i] :\n            hit += 1\n    return hit / max(len(target), 1) * 100\n\ndef accuracy2(target, typed) :\n    # TODO: 더 길게 친 경우도 감점되도록\n    return 0.0\n\nfor t in ['파이썬', '파이썬입니다', '파이선'] :\n    print(t, '→ 옛 %.1f' % accuracy('파이썬', t))\n",
            solution: "def accuracy(target, typed) :\n    hit = 0\n    for i in range(min(len(target), len(typed))) :\n        if target[i] == typed[i] :\n            hit += 1\n    return hit / max(len(target), 1) * 100\n\ndef accuracy2(target, typed) :\n    hit = 0\n    for i in range(min(len(target), len(typed))) :\n        if target[i] == typed[i] :\n            hit += 1\n    return hit / max(len(target), len(typed), 1) * 100\n\nfor t in ['파이썬', '파이썬입니다', '파이선'] :\n    print('%s → 옛 %.1f / 새 %.1f' % (t, accuracy('파이썬', t), accuracy2('파이썬', t)))\n",
            expect: '파이썬 → 옛 100.0 / 새 100.0\n파이썬입니다 → 옛 100.0 / 새 50.0\n파이선 → 옛 66.7 / 새 66.7'
          },
          {
            title: '실습 14-29. 남은 시간 표시하기 (after 사용)', level: 2,
            desc: '<p>타자 연습 창에 <b>제한 시간 30초</b>를 붙이세요.</p><ul><li>창 위쪽에 “남은 시간 : 30 초” 를 보여 준다</li><li><code>window.after(1000, tick)</code> 으로 <b>1초마다</b> 1씩 줄인다</li><li>0 이 되면 입력칸을 비우고 “시간 종료!” 를 보여 준다</li></ul>',
            hint: '<code>after</code> 는 “몇 밀리초 뒤에 이 함수를 한 번 불러 달라” 는 예약입니다. 계속 반복하려면 함수 안에서 <b>자기 자신을 다시 예약</b>합니다.',
            starter: "from tkinter import *\n\nwindow = Tk()\nwindow.title('남은 시간')\nwindow.geometry('300x120')\n\nleft = {'sec' : 30}\nlblTime = Label(window, text = '남은 시간 : 30 초', font = ('맑은고딕', 14))\nlblTime.pack(pady = 20)\n\ndef tick() :\n    # TODO: 1초 줄이고 화면에 표시, 0 보다 크면 다시 예약\n    pass\n\ntick()\nwindow.mainloop()\n",
            solution: "from tkinter import *\n\nwindow = Tk()\nwindow.title('남은 시간')\nwindow.geometry('300x120')\n\nleft = {'sec' : 30}\nlblTime = Label(window, text = '남은 시간 : 30 초', font = ('맑은고딕', 14))\nlblTime.pack(pady = 20)\n\ndef tick() :\n    if left['sec'] <= 0 :\n        lblTime.configure(text = '시간 종료!')\n        return\n    lblTime.configure(text = '남은 시간 : %d 초' % left['sec'])\n    left['sec'] -= 1\n    window.after(1000, tick)        # 1초 뒤에 자기 자신을 다시 부른다\n\ntick()\nwindow.mainloop()\n"
          },
          {
            title: '🚀 프로젝트 14-30. 낱말 맞히기 게임으로 바꾸기', level: 3,
            desc: '<p>타자 연습의 구조(문장 목록 → 하나씩 제시 → 입력 채점 → 통계 → 기록)를 그대로 빌려 <b>낱말 맞히기 게임</b>을 만드세요.</p><ul><li><b>입력</b> : 낱말의 뜻을 보여 주고(예: “파이썬을 만든 사람”), 답을 입력받는다</li><li><b>규칙</b> : 맞으면 점수 +10, 틀리면 정답을 알려 준다. 문제는 5개</li><li><b>출력</b> : 끝나면 점수와 맞힌 개수를 보여 주고 <code>quiz_result.txt</code> 에 한 줄 기록</li><li>문제는 <code>[(\'뜻\', \'정답\'), …]</code> 리스트로 만든다 (파일에서 읽어도 좋다)</li></ul><p>정답 코드는 화면 없이도 확인할 수 있도록 채점 함수 <code>grade()</code> 를 따로 만들고, 창을 띄우기 전에 몇 가지를 시험해 봅니다.</p>',
            hint: '구조는 타자 연습과 똑같습니다. <code>state = {\'index\' : 0, \'score\' : 0, \'hit\' : 0}</code> 로 시작하고, <code>check()</code> 안에서 정답과 비교하세요. 대소문자 · 앞뒤 공백은 <code>strip().lower()</code> 로 맞춰 줍니다.',
            starter: "from tkinter import *\n\nQUIZ = [('파이썬을 만든 사람', '귀도'), ('0 과 1 만 쓰는 수 체계', '이진법'),\n        ('반복을 뜻하는 영어 낱말', 'loop'), ('참과 거짓 자료형', 'bool'),\n        ('화면에 출력하는 함수', 'print')]\n\ndef grade(answer, correct) :\n    # TODO: 앞뒤 공백과 대소문자를 무시하고 비교\n    return False\n\nstate = {'index' : 0, 'score' : 0, 'hit' : 0}\n\nwindow = Tk()\nwindow.title('낱말 맞히기')\nwindow.geometry('460x220')\nlblQ = Label(window, text = QUIZ[0][0], font = ('맑은고딕', 15, 'bold'))\nlblQ.pack(pady = 16)\nentA = Entry(window, width = 24, font = ('맑은고딕', 13))\nentA.pack(pady = 8)\nlblS = Label(window, text = '1 / 5 문제', font = ('맑은고딕', 11))\nlblS.pack(pady = 10)\n# TODO: check() 를 만들고 entA 의 <Return> 에 연결\nwindow.mainloop()\n",
            solution: "from tkinter import *\n\nQUIZ = [('파이썬을 만든 사람', '귀도'), ('0 과 1 만 쓰는 수 체계', '이진법'),\n        ('반복을 뜻하는 영어 낱말', 'loop'), ('참과 거짓 자료형', 'bool'),\n        ('화면에 출력하는 함수', 'print')]\nRESULT_FILE = 'quiz_result.txt'\n\ndef grade(answer, correct) :\n    return answer.strip().lower() == correct.strip().lower()\n\ndef show() :\n    lblQ.configure(text = QUIZ[state['index']][0])\n    lblS.configure(text = '%d / %d 문제  ·  %d점' % (state['index'] + 1, len(QUIZ), state['score']))\n    entA.delete(0, END)\n    entA.focus_set()\n\ndef finish() :\n    lblQ.configure(text = '끝! %d문제 중 %d개 정답' % (len(QUIZ), state['hit']))\n    lblS.configure(text = '점수 %d점' % state['score'])\n    entA.delete(0, END)\n    with open(RESULT_FILE, 'a', encoding = 'utf-8') as f :\n        f.write('%d점 %d/%d\\n' % (state['score'], state['hit'], len(QUIZ)))\n\ndef check(event = None) :\n    answer = entA.get()\n    if answer == '' :\n        return\n    correct = QUIZ[state['index']][1]\n    if grade(answer, correct) :\n        state['score'] += 10\n        state['hit'] += 1\n        print('정답!')\n    else :\n        print('아쉬워요. 정답은', correct)\n    state['index'] += 1\n    if state['index'] < len(QUIZ) :\n        show()\n    else :\n        finish()\n\nstate = {'index' : 0, 'score' : 0, 'hit' : 0}\n\nprint(grade(' Loop ', 'loop'), grade('룹', 'loop'))     # 화면 없이 먼저 시험\n\nwindow = Tk()\nwindow.title('낱말 맞히기')\nwindow.geometry('460x220')\nlblQ = Label(window, text = '', font = ('맑은고딕', 15, 'bold'))\nlblQ.pack(pady = 16)\nentA = Entry(window, width = 24, font = ('맑은고딕', 13))\nentA.pack(pady = 8)\nentA.bind('<Return>', check)\nlblS = Label(window, text = '', font = ('맑은고딕', 11))\nlblS.pack(pady = 10)\n\nshow()\nwindow.mainloop()\n",
            expect: 'True False'
          }
        ],
        quiz: [
          { q: '<code>entAnswer.bind(\'&lt;Return&gt;\', check)</code> 로 연결할 때 <code>check</code> 함수의 올바른 정의는?', options: ['<code>def check() :</code>', '<code>def check(event = None) :</code>', '<code>def check(self) :</code>', '<code>def check(*) :</code>'], answer: 1,
            explain: '키 이벤트로 불릴 때는 이벤트 객체가 하나 전달됩니다. 버튼에서도 같은 함수를 쓰려면 기본값을 둔 <code>event = None</code> 이 편합니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>state = {\'n\' : 0}\ndef up() :\n    state[\'n\'] += 1\nup()\nup()\nprint(state[\'n\'])</code></pre>', options: ['0', '1', '2', '오류 (global 선언이 없음)'], answer: 2,
            explain: '<code>state</code> 라는 <b>이름</b>에 대입한 것이 아니라 딕셔너리 <b>안의 값</b>을 바꾼 것이므로 global 이 필요 없습니다. 그래서 전역 변수를 딕셔너리로 묶으면 편합니다.' },
          { q: '파일을 <code>open(fname, \'a\')</code> 로 여는 것의 뜻은?', options: ['기존 내용을 지우고 새로 쓴다', '기존 내용 뒤에 이어 쓴다', '읽기만 한다', '파일을 지운다'], answer: 1,
            explain: '<code>\'w\'</code> 는 덮어쓰기, <code>\'a\'</code> 는 이어 쓰기(append)입니다. 기록을 쌓을 때는 <code>\'a\'</code> 를 씁니다.' },
          { q: '<code>accuracy(\'abcd\', \'abxd\')</code> 의 결과는? (본문의 정확도 함수)', options: ['100.0', '75.0', '50.0', '25.0'], answer: 1,
            explain: '네 글자 중 a · b · d 세 글자가 같은 자리에 있으므로 3 / 4 × 100 = 75.0 입니다.' },
          { q: '다음 코드에는 버그가 있습니다. 무엇인가?<pre><code>def check(event = None) :\n    state[\'index\'] += 1\n    show_question()      # 다음 문장 보여 주기</code></pre>', options: ['event 를 쓰지 않아서', '마지막 문장 다음에도 show_question() 을 불러 IndexError 가 난다', 'state 에 global 이 없어서', '정확도를 계산하지 않아서'], answer: 1,
            explain: '<code>index</code> 가 문장 수와 같아지면 <code>sentences[index]</code> 가 없습니다. <b>끝났는지 먼저 검사</b>하고 끝이면 <code>finish()</code> 를 불러야 합니다.' },
          { q: '분당 타수를 계산할 때 <code>spent = max(0.1, spent)</code> 를 넣는 이유는?', options: ['시간을 정확히 재려고', '0 으로 나누기(ZeroDivisionError)와 말도 안 되는 값을 막으려고', '정확도를 올리려고', '파일에 쓰기 위해'], answer: 1,
            explain: '걸린 시간이 0 에 가까우면 나눗셈에서 오류가 나거나 터무니없이 큰 값이 나옵니다. 바닥값을 정해 두면 안전합니다.' }
        ],
        slides: [
          { layout: 'title', title: '[프로젝트 3] 타자 연습', subtitle: 'Chapter 14 · 14-6 — 요구 사항부터 스스로 만들기', badge: '14-6',
            notes: '<p>완성본을 먼저 한 번 시연하고 시작합니다(문장 8개를 빠르게 쳐서 통계 화면까지 보여 주기). “오늘은 교재 코드가 없습니다. 우리가 요구 사항부터 적습니다” 라고 선언하면 분위기가 달라집니다.</p><p>시간: 2분</p>' },
          { layout: 'bullets', title: '① 요구 사항 적기', lead: '무엇이 되면 “다 만든 것” 인가?', bullets: [
            '문장 하나와 입력칸이 보이고 커서가 입력칸에 있다',
            '치고 엔터 → 채점하고 다음 문장',
            '“3 / 8 문장” 처럼 진행 상황이 보인다',
            '끝나면 시간 · 분당 타수 · 정확도를 보여 준다',
            '결과를 파일에 남기고 최근 기록 3개를 보여 준다',
            '빈칸 엔터 · 파일 없음에도 <b>멈추지 않는다</b>'
          ], notes: '<p>마지막 줄(예외 상황)을 빠뜨리지 않는 것이 이 수업의 핵심 습관입니다. 학생들에게 “더 넣고 싶은 요구 사항” 을 두세 개 받아 칠판에 적어 두고, 나중에 확장 과제로 연결하세요.</p>' },
          { layout: 'diagram', title: '② 기능 분해 — 화면과 상태', html: SVG_TYPING, caption: '보이는 것 3가지 · 숨은 상태 4가지',
            notes: '<p>화면에 보이는 것과 보이지 않는 상태를 나누어 적게 하는 것이 설계의 시작입니다. 상태를 흩어진 전역 변수 4개로 두지 않고 state 딕셔너리 하나로 묶는다는 점을 강조하세요.</p>' },
          { layout: 'code', title: '1단계 — 화면만 만들기', code: TY1.replace("## 함수 선언 부분 ##\ndef load_sentences(fname) :\n    lines = []\n    with open(fname, encoding = 'utf-8') as f :\n        for line in f :\n            line = line.strip()\n            if line != \"\" :\n                lines.append(line)\n    return lines\n\n## 전역 변수 선언 부분 ##\nsentences = load_sentences('ch14/typing.txt')", "sentences = ['작게 만들고 자주 실행해 보자', '오늘도 한 줄씩 꾸준히 써 보자']").replace('lblGuide = Label', 'lbl1 = Label').replace('lblGuide.pack', 'lbl1.pack'),
            points: ['먼저 <b>움직이지 않는</b> 화면', '<code>pack(pady=…)</code> 로 간격', '<code>focus_set()</code> 으로 커서 위치', '여기까지 실행해 확인'],
            notes: '<p>슬라이드에서는 문장 파일 읽기를 빼고 짧게 줄였습니다. 본문 코드는 파일에서 읽습니다. 1단계의 목표는 “보이는 것이 다 있는가?” 뿐임을 강조하세요.</p>' },
          { layout: 'code', title: '계산 함수는 화면 없이 먼저 시험', code: C_ASSERT, points: ['정확도 = 맞은 글자 / 전체', '<code>assert</code> 로 스스로 검사', '<code>max(len, 1)</code> 로 0 나누기 방지'],
            notes: '<p>화면을 만들기 전에 계산 함수를 완성해 두면 나중에 “화면 문제” 와 “계산 문제” 를 헷갈리지 않습니다. assert 는 이 강좌에서 처음 나오므로 “조건이 거짓이면 멈춘다” 정도로 짧게 소개하세요.</p>' },
          { layout: 'two', title: '2단계 — 갱신과 그리기를 나눈다', left: { title: 'check() : 상태를 바꾼다', bullets: ['입력을 읽는다', '정확도 · 글자 수를 쌓는다', 'index 를 1 늘린다', '끝인지 검사한다'] }, right: { title: 'show_question() : 화면에 반영', bullets: ['문장 Label 바꾸기', '진행 상황 Label 바꾸기', '입력칸 비우기', '값을 계산하지 않는다'] },
            notes: '<p>게임 루프의 “갱신 / 그리기” 와 똑같은 구조라는 점을 반드시 연결해 주세요. 한 함수가 두 가지 일을 하기 시작하면 코드가 어려워집니다.</p>' },
          { layout: 'code', title: '엔터 키 연결하기', code: "from tkinter import *\n\nwindow = Tk()\nwindow.geometry('320x120')\n\ndef check(event = None) :          # 이벤트가 들어올 자리\n    print('입력 :', ent.get())\n    ent.delete(0, END)\n\nent = Entry(window, width = 24)\nent.pack(pady = 20)\nent.bind('<Return>', check)        # 괄호 없이 함수 이름만\nent.focus_set()\nButton(window, text = '확인', command = check).pack()\n\ncheck()      # 버튼처럼 값 없이 불러도 된다\nwindow.mainloop()", points: ['<code>bind(\'&lt;Return&gt;\', check)</code>', '<code>event = None</code> 기본값', '버튼과 같은 함수 공유', '괄호를 붙이면 즉시 실행'],
            notes: '<p>가장 자주 나오는 TypeError(“takes 0 positional arguments but 1 was given”)를 실제로 보여 준 뒤 고치면 기억에 오래 남습니다.</p>' },
          { layout: 'code', title: '3단계 — 결과를 파일에 남기기', code: C_RESULT_FILE, points: ['<code>\'a\'</code> = 이어 쓰기', '<code>[-3:]</code> = 뒤에서 3개', '파일이 없으면 빈 목록', '기록이 쌓이면 통계도 가능'],
            notes: '<p>실행할 때마다 기록이 늘어나는 것을 보여 주세요. 14-7 에서 이 기록 파일을 막대그래프로 그려 보는 확장을 예고하면 두 교시가 자연스럽게 이어집니다.</p>' },
          { layout: 'bullets', title: '완성 — 그리고 더 해 볼 것', bullets: [
            '분당 타수 = 글자 수 ÷ 초 × 60 (<code>max(0.1, …)</code>)',
            '[다시 시작] = 상태만 초기화하고 다시 그리기',
            '확장 ① 틀린 글자 빨갛게 표시',
            '확장 ② <code>after</code> 로 제한 시간',
            '확장 ③ 기록을 그래프로 (14-7)'
          ], notes: '<p>“껐다 켜지 않아도 처음으로 돌아갈 수 있어야 한다” 는 원칙을 강조합니다. 확장 항목은 실습 14-29 · 14-30 과 연결됩니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '함수 안에서 <code>state[\'n\'] += 1</code> 을 할 때 <code>global state</code> 가 필요할까?', options: ['필요하다', '필요 없다 (딕셔너리 안의 값을 바꾸는 것이므로)', 'state 가 리스트일 때만 필요하다', '함수 밖에서는 쓸 수 없다'], answer: 1,
            explain: '이름에 새로 대입할 때만 global 이 필요합니다. 딕셔너리 · 리스트 <b>안의 값</b>을 바꾸는 것은 대입이 아닙니다.',
            notes: '<p>이 차이를 정확히 아는 것이 전역 변수를 줄이는 첫걸음입니다. 헷갈리는 학생을 위해 <code>state = {}</code> (대입)과 <code>state[\'n\'] = 1</code> (변경)을 나란히 써 보여 주세요.</p>' },
          { layout: 'practice', title: '실습 14-27. 분당 타수 계산기', desc: '글자 수와 걸린 시간으로 분당 타수 구하기 (0초 대비)',
            starter: "def speed(chars, spent) :\n    # TODO\n    return 0\n\nprint(speed(120, 30))\n",
            solution: "def speed(chars, spent) :\n    spent = max(0.1, spent)\n    return chars / spent * 60\n\nfor chars, spent in [(120, 30), (120, 60), (50, 0)] :\n    print('%d글자 %.1f초 → 분당 %.0f타' % (chars, spent, speed(chars, spent)))\n",
            notes: '<p>5분. 0초 입력을 넣어 보게 해서 왜 바닥값이 필요한지 스스로 느끼게 합니다.</p>' },
          { layout: 'summary', title: '정리', bullets: ['요구 사항 → 기능 분해 → 1 · 2 · 3 단계', '화면(그리기)과 상태 변경(갱신)을 나눈다', '상태는 <code>state</code> 딕셔너리 하나로', '계산 함수는 화면 없이 <code>assert</code> 로 시험', '기록은 파일에 <code>\'a\'</code> 모드로 남긴다'],
            notes: '<p>다음 시간에는 같은 순서로 데이터(CSV)를 읽어 그림을 그리는 프로젝트를 만들고, 프로젝트를 남에게 보여 주는 방법(README)까지 다룬다고 예고합니다.</p>' }
        ]
      },

      /* ============================================================ 14-7 (추가) */
      {
        id: 'ch14-7',
        title: '[프로젝트 4] 데이터로 막대그래프 그리기 · 프로젝트 마무리',
        minutes: 50,
        goals: [
          'csv 모듈로 CSV 파일을 읽어 숫자 데이터로 바꿀 수 있다',
          '합계 · 평균 · 최대 · 최소 같은 기초 통계를 함수로 만들어 쓸 수 있다',
          '값을 화면 좌표로 바꾸는 스케일 변환을 이해하고 Canvas 에 막대를 그릴 수 있다',
          '축 · 눈금 · 값 · 평균선을 더해 읽을 수 있는 그래프를 완성할 수 있다',
          '계산 코드와 화면 코드를 모듈로 나누어 정리할 수 있다',
          'README 를 써서 내 프로젝트를 남에게 설명할 수 있다'
        ],
        flow: [['요구 사항 · CSV 읽기', 10], ['통계 함수 만들기', 8], ['1 · 2단계 막대 그리기', 12], ['3단계 완성 (축 · 평균선 · 저장)', 10], ['모듈 나누기 · README', 6], ['퀴즈 · 실습', 4]],
        content: [
          { type: 'h', text: '① 요구 사항 — 무엇을 만들까' },
          { type: 'p', html: '이번에는 <b>데이터</b>를 다룹니다. 작업 폴더의 <code>ch14/sales.csv</code> 에는 어느 가게의 <b>월별 판매량</b>이 들어 있습니다(아이스크림과 호빵). 이 숫자를 읽어 통계를 내고 <b>막대그래프</b>로 그려 주는 프로그램을 만듭니다.' },
          { type: 'list', ordered: true, items: [
            'CSV 파일을 읽어 <b>숫자</b>로 바꾼다 (파일의 내용은 모두 글자이다).',
            '합계 · 평균 · 최대 · 최소를 계산해 화면에 보여 준다.',
            '월별 값을 <b>막대그래프</b>로 그린다. 가장 큰 달은 다른 색으로 표시한다.',
            '세로축 눈금과 값, 가로축의 월 이름, 그래프 제목을 보여 준다.',
            '<b>평균선</b>을 빨간 선으로 그려 어느 달이 평균보다 높은지 한눈에 보이게 한다.',
            '위쪽 메뉴에서 <b>품목을 고르면</b> 그래프가 바뀐다.',
            '[요약 저장] 을 누르면 통계를 텍스트 파일로 저장한다.'
          ] },
          { type: 'h', text: '② CSV 파일 읽기' },
          { type: 'p', html: 'CSV(Comma-Separated Values)는 값을 쉼표로 구분한 아주 단순한 표 파일입니다. 엑셀 · 구글 시트에서도 읽고 쓸 수 있어 데이터를 주고받는 표준처럼 쓰입니다. 파이썬에는 <code>csv</code> 모듈이 기본으로 들어 있습니다.' },
          { type: 'code', run: false, title: 'ch14/sales.csv 의 내용 (앞부분)', code: '월,아이스크림,호빵\n1,120,430\n2,150,380\n3,240,260\n…' },
          { type: 'code', title: '데이터 1단계. CSV 읽고 통계 내기', code: CH_LOAD,
            expect: "열 이름 : ['월', '아이스크림', '호빵']\n행 수   : 12\n첫 행   : [1, 120, 430]\n끝 행   : [12, 140, 460]\n합계 : 5480\n평균 : 456.7\n최대 : 1040 ( 8 월 )\n최소 : 120 ( 1 월 )",
            desc: '<code>csv.reader(파일)</code> 는 한 줄을 <b>문자열 리스트</b>로 돌려줍니다. <code>next(reader)</code> 로 첫 줄(제목 줄)을 먼저 꺼내고, 나머지는 <code>int()</code> 로 바꿔 담았습니다. <code>[int(v) for v in line]</code> 은 “줄 안의 값을 모두 정수로” 라는 뜻의 <b>컴프리헨션</b>입니다.' },
          { type: 'callout', kind: 'warn', title: '파일에서 읽은 값은 모두 문자열', html: '<code>int()</code> 를 빼먹으면 <code>sum([\'120\', \'150\'])</code> 에서 <code>TypeError</code> 가 나거나, <code>max()</code> 가 글자 순서로 비교해 <b>\'9\' &gt; \'1040\'</b> 같은 엉뚱한 결과를 냅니다. 데이터를 읽은 <b>직후에 바로</b> 숫자로 바꾸는 습관을 들이세요.' },
          { type: 'callout', kind: 'more', title: '📘 csv.reader 대신 split(\',\') 를 쓰면 안 될까?', html: '데이터에 쉼표가 들어 있지 않다면 <code>line.split(\',\')</code> 로도 충분합니다. 하지만 값 안에 쉼표가 있는 경우(<code>"서울, 강남",120</code>)나 따옴표 · 줄바꿈이 들어간 경우를 <code>csv</code> 모듈은 알아서 처리해 줍니다. <b>표준 라이브러리가 있으면 쓰는 것</b>이 안전합니다. 데이터가 더 커지면 <code>pandas</code> 같은 전문 라이브러리로 넘어갑니다.' },

          { type: 'h', text: '③ 값을 화면 좌표로 — 스케일 변환' },
          { type: 'p', html: '그래프를 그릴 때 가장 먼저 부딪히는 문제는 <mark>판매량 1040 을 화면의 어디에 그릴 것인가</mark> 입니다. 화면의 y 좌표는 <b>아래로 갈수록 커지므로</b> 값을 그대로 쓸 수 없습니다.' },
          { type: 'figure', html: SVG_CHART, caption: '값 → 화면 좌표 변환 (스케일 변환)' },
          { type: 'code', title: '추가 예제. 값을 막대의 y 좌표로 바꾸기', code: C_SCALE,
            expect: '120 → y = 305.4 , 막대 높이 = 34.6\n520 → y = 190.0 , 막대 높이 = 150.0\n1040 → y = 40.0 , 막대 높이 = 300.0\n0 의 y : 340.0\n최대값의 y : 40.0',
            desc: '값을 <b>최대값으로 나누면</b> 0 ~ 1 사이의 비율이 되고, 거기에 그래프 높이를 곱하면 픽셀 높이가 됩니다. 바닥(<code>BASE_Y</code>)에서 그만큼 <b>빼면</b> 막대의 윗변 y 좌표입니다. 이 식 하나면 어떤 데이터든 그릴 수 있습니다.' },

          { type: 'h', text: '2단계 — 막대만 그려 보기' },
          { type: 'p', html: '축도 글자도 없이 <b>막대만</b> 그려 봅니다. 이 단계에서 확인할 것은 “막대의 높이가 데이터와 맞는가” 뿐입니다.' },
          { type: 'code', title: '데이터 2단계. 캔버스에 막대 그리기', code: CH2,
            desc: '<code>create_rectangle(x1, y1, x2, y2)</code> 는 왼쪽 위와 오른쪽 아래 두 점으로 사각형을 그립니다. <code>outline = ""</code> 로 테두리를 없애면 깔끔합니다. 막대 사이 간격은 <code>i * 46</code> 과 막대 폭 36 의 차이(10픽셀)로 생깁니다.' },
          { type: 'callout', kind: 'tip', title: '왜 상수를 위에 모아 둘까', html: '<code>W, H, LEFT, BASE, CHART_H</code> 처럼 <b>화면 크기와 여백을 대문자 이름의 상수</b>로 맨 위에 모아 두면, 그래프 크기를 바꿀 때 한 곳만 고치면 됩니다. 코드 여기저기에 <code>340</code>, <code>260</code> 같은 숫자가 흩어져 있는 것을 <b>매직 넘버</b>라고 하는데, 나중에 무슨 뜻인지 알 수 없어 고치기 어렵습니다.' },

          { type: 'h', text: '3단계 — 읽을 수 있는 그래프로 (완성)' },
          { type: 'p', html: '막대만 있는 그림은 “대충 이런 모양” 만 알려 줍니다. 아래 다섯 가지를 더하면 <b>읽을 수 있는</b> 그래프가 됩니다.' },
          { type: 'table', head: ['더할 것', '왜', '코드'], rows: [
            ['제목', '무엇에 대한 그래프인지', '<code>create_text(W / 2, 26, text = …)</code>'],
            ['세로 눈금 · 값', '막대의 크기를 숫자로 읽게', '<code>for k in range(0, 5)</code> 로 5칸'],
            ['가로 라벨', '어느 달인지', '<code>create_text(x + 18, BASE + 16, …)</code>'],
            ['평균선', '평균보다 높은 달을 한눈에', '빨간 <code>create_line</code>'],
            ['최대값 강조', '가장 중요한 값을 먼저 보이게', '색을 다르게 (<code>#ff7043</code>)']
          ] },
          { type: 'code', title: '[프로젝트 4] 완성: 월별 판매량 막대그래프', code: CH3,
            desc: '위쪽 메뉴에서 <b>아이스크림 ↔ 호빵</b>을 바꿔 보세요. <code>draw_chart()</code> 는 그릴 때마다 <code>canvas.delete(ALL)</code> 로 <b>먼저 지우고</b> 다시 그립니다 — 지우지 않으면 예전 막대 위에 새 막대가 겹쳐 그려집니다. [요약 저장] 을 누르면 <code>sales_summary.txt</code> 가 만들어집니다.' },
          { type: 'code', title: '추가 예제. 요약을 파일로 저장하기 (화면 없이)', code: C_SUMMARY_FILE,
            expect: '아이스크림 합계 5480 평균 456.7 최대 1040 최소 120\n호빵 합계 2450 평균 204.2 최대 460 최소 20',
            desc: '두 품목이 정반대로 움직입니다 — 여름에는 아이스크림, 겨울에는 호빵이 많이 팔립니다. <b>데이터에서 이야기를 읽어 내는 것</b>이 그래프를 그리는 진짜 이유입니다.' },
          { type: 'callout', kind: 'more', title: '📘 그래프를 그릴 때 지켜야 할 것', html: '<ul><li><b>0 에서 시작하기</b> — 막대그래프의 세로축이 0 이 아닌 값에서 시작하면 차이가 실제보다 크게 보여 사람을 속입니다.</li><li><b>단위 적기</b> — 숫자만 있으면 개수인지 금액인지 알 수 없습니다.</li><li><b>색은 뜻이 있을 때만</b> — 모든 막대를 무지개색으로 칠하면 오히려 읽기 어렵습니다. 강조할 것 하나만 다른 색으로.</li><li><b>알맞은 그림 고르기</b> — 항목 비교는 막대, 시간에 따른 변화는 꺾은선, 비율은 원그래프.</li></ul>' },

          { type: 'h', text: '프로젝트 마무리 ① 코드 정리와 모듈 나누기' },
          { type: 'p', html: '프로그램이 동작한 뒤에는 <b>정리</b>를 합니다. 가장 효과가 큰 것은 <mark>계산하는 코드와 화면을 그리는 코드를 떼어 놓는 것</mark>입니다. 계산 부분을 따로 모듈(파일)로 빼면 다른 프로그램에서 그대로 가져다 쓸 수 있고, 화면 없이 시험할 수도 있습니다.' },
          { type: 'code', title: '추가 예제. 계산 부분을 모듈로 분리하기', code: C_MODULE_SPLIT,
            expect: "아이스크림 통계 : {'합계': 5480, '평균': 456.6666666666667, '최대': 1040, '최소': 120}\n화면을 그리는 코드는 main.py 에, 계산하는 코드는 salesdata.py 에 둔다",
            desc: '<code>salesdata.py</code> 에는 tkinter 가 한 줄도 없습니다. 그래서 웹 프로그램에서도, 콘솔 프로그램에서도 똑같이 쓸 수 있습니다. 이렇게 <b>쓰임에 따라 파일을 나누는 것</b>을 모듈화라고 합니다.' },
          { type: 'list', items: [
            '<b>이름</b> — <code>a</code>, <code>tmp</code>, <code>data2</code> 대신 <code>values</code>, <code>avgY</code>, <code>load_sales</code> 처럼 뜻이 드러나게.',
            '<b>함수 길이</b> — 한 화면(30줄 안팎)을 넘으면 나눌 곳을 찾습니다.',
            '<b>매직 넘버</b> — 의미 있는 숫자는 대문자 상수로 올립니다.',
            '<b>주석</b> — “무엇을 하는지” 가 아니라 <b>“왜 그렇게 했는지”</b> 를 적습니다. (<code>x += 1  # x 를 1 늘림</code> 은 쓸모없는 주석)',
            '<b>죽은 코드 지우기</b> — 시험하느라 넣은 <code>print</code> 와 주석 처리한 옛 코드는 지웁니다.'
          ] },
          { type: 'h', text: '프로젝트 마무리 ② README 쓰기' },
          { type: 'p', html: '만든 프로그램을 남에게 보여 줄 때는 <b>README</b> 라는 설명 파일을 함께 둡니다(보통 <code>README.md</code>). 읽는 사람이 궁금해하는 것은 딱 다섯 가지입니다 — <b>무엇을 / 왜 / 어떻게 실행 / 무엇을 할 수 있는지 / 앞으로 할 일</b>.' },
          { type: 'callout', kind: 'info', title: 'README 예시 (판매량 그래프)', html: '<pre><code># 월별 판매량 막대그래프\n\nCSV 로 된 월별 판매 자료를 읽어 통계를 내고 막대그래프로 보여 주는\n작은 프로그램입니다. 파이썬 공부를 하며 만든 첫 데이터 시각화 예제입니다.\n\n## 실행 방법\n1. 파이썬 3.10 이상\n2. `python main.py`\n3. 같은 폴더에 `ch14/sales.csv` 가 있어야 합니다.\n\n## 기능\n- CSV 읽기, 합계 · 평균 · 최대 · 최소 계산\n- 막대그래프 (세로 눈금 · 평균선 · 최대값 강조)\n- 품목 선택, 요약 파일 저장\n\n## 파일 구성\n- `main.py` : 화면\n- `salesdata.py` : 데이터 읽기 · 통계\n\n## 앞으로 할 일\n- 꺾은선 그래프 추가\n- 그래프를 그림 파일로 저장</code></pre>' },
          { type: 'list', items: [
            '<b>첫 두 줄이 가장 중요합니다</b> — 무엇을 하는 프로그램인지 한 문장으로.',
            '<b>실행 방법</b>은 처음 보는 사람이 그대로 따라 할 수 있게 씁니다(필요한 파일 · 설치 명령 포함).',
            '<b>화면 사진</b>을 한 장 넣으면 설명 열 줄보다 낫습니다.',
            '<b>앞으로 할 일</b>을 적어 두면 “아직 못 한 것” 이 아니라 <b>“계획이 있는 프로젝트”</b> 로 보입니다.',
            '코드를 올릴 때는 개인 정보 · 비밀번호가 들어 있지 않은지 확인합니다.'
          ] },
          { type: 'h', text: '이 장을 마치며' },
          { type: 'list', items: [
            '네 프로젝트 모두 <b>요구 사항 → 기능 분해 → 단계별 개발 → 리팩터링 → 확장</b> 의 같은 순서로 만들었습니다.',
            '화면을 그리는 코드와 계산하는 코드를 나누면, <b>화면 없이 시험</b>할 수 있어 버그를 찾기 쉬워집니다.',
            '상태가 많아지면 딕셔너리나 클래스로 묶고, 같은 코드가 반복되면 표(딕셔너리)와 함수로 모읍니다.',
            '예외 처리와 안내 메시지, 되돌리기와 저장은 <b>사용자를 위한 배려</b>이자 프로그램의 완성도입니다.',
            '이제 필요한 것은 문법이 아니라 <b>만들고 싶은 것</b>입니다. 작게 시작해서 계속 키워 보세요.'
          ] }
        ],
        practice: [
          {
            title: '실습 14-31. 두 품목의 월별 차이 구하기', level: 1,
            desc: '<p><code>ch14/sales.csv</code> 를 읽어 달마다 <b>아이스크림 − 호빵</b> 을 계산하고, 차이가 가장 큰 달과 가장 작은 달을 출력하세요.</p><p>출력 예: <code>가장 큰 달 : 8월 : 1010</code></p>',
            hint: '차이를 리스트로 만든 뒤 <code>max()</code> · <code>min()</code> 과 <code>index()</code> 로 몇 번째인지 찾습니다.',
            starter: "import csv\n\nrows = []\nwith open('ch14/sales.csv', encoding = 'utf-8') as f :\n    reader = csv.reader(f)\n    head = next(reader)\n    for line in reader :\n        rows.append([int(v) for v in line])\n\ndiffs = []\n# TODO: 달마다 아이스크림 - 호빵 을 구해 diffs 에 넣기\n# TODO: 가장 큰 달 · 가장 작은 달 출력\n",
            solution: "import csv\n\nrows = []\nwith open('ch14/sales.csv', encoding = 'utf-8') as f :\n    reader = csv.reader(f)\n    head = next(reader)\n    for line in reader :\n        rows.append([int(v) for v in line])\n\ndiffs = []\nfor r in rows :\n    diffs.append(r[1] - r[2])\n\nbig = max(diffs)\nsmall = min(diffs)\nprint('가장 큰 달  : %d월 : %d' % (rows[diffs.index(big)][0], big))\nprint('가장 작은 달 : %d월 : %d' % (rows[diffs.index(small)][0], small))\n",
            expect: '가장 큰 달  : 8월 : 1010\n가장 작은 달 : 12월 : -320'
          },
          {
            title: '실습 14-32. 막대 좌표 계산표 만들기', level: 1,
            desc: '<p>그래프 높이 200, 바닥 <code>BASE_Y = 260</code>, 최대값 1000 일 때 값 0 · 250 · 500 · 1000 의 <b>막대 윗변 y 좌표</b>와 <b>막대 높이</b>를 출력하세요.</p>',
            hint: '<code>top = BASE_Y - 값 / 최대값 * 높이</code>. 막대 높이는 <code>BASE_Y - top</code> 입니다.',
            starter: "CHART_H = 200\nBASE_Y = 260\nVMAX = 1000\n\ndef bar_top(value) :\n    # TODO: 값을 y 좌표로 바꾸기\n    return 0\n\nfor v in [0, 250, 500, 1000] :\n    # TODO: '값 → y = …, 높이 = …' 형식으로 출력\n    pass\n",
            solution: "CHART_H = 200\nBASE_Y = 260\nVMAX = 1000\n\ndef bar_top(value) :\n    return BASE_Y - value / VMAX * CHART_H\n\nfor v in [0, 250, 500, 1000] :\n    top = bar_top(v)\n    print('%4d → y = %.1f, 높이 = %.1f' % (v, top, BASE_Y - top))\n",
            expect: '   0 → y = 260.0, 높이 = 0.0\n 250 → y = 210.0, 높이 = 50.0\n 500 → y = 160.0, 높이 = 100.0\n1000 → y = 60.0, 높이 = 200.0'
          },
          {
            title: '실습 14-33. 꺾은선 그래프로 바꾸기', level: 2,
            desc: '<p>2단계 코드(막대만 그리기)를 고쳐 <b>꺾은선 그래프</b>를 그리세요.</p><ul><li>달마다 점을 찍고(작은 원), 이웃한 점을 선으로 잇습니다</li><li>선 색은 파랑, 굵기는 3</li><li>가장 큰 값의 점은 빨간색으로 그립니다</li></ul>',
            hint: '점의 좌표를 먼저 리스트에 모아 두고(<code>points.append((x, y))</code>), 그다음 <code>create_line(x1, y1, x2, y2, width = 3)</code> 으로 이으면 쉽습니다. 작은 원은 <code>create_oval(x - 4, y - 4, x + 4, y + 4)</code>.',
            starter: CH2.replace('for i in range(len(values)) :\n    x = LEFT + i * 46\n    top = BASE - values[i] / vmax * CHART_H       # 값 → 화면 좌표\n    canvas.create_rectangle(x, top, x + 36, BASE, fill = "#4c8dff", outline = "")', 'points = []\nfor i in range(len(values)) :\n    x = LEFT + i * 46 + 18\n    y = BASE - values[i] / vmax * CHART_H\n    points.append((x, y))\n\n# TODO: 점을 선으로 잇고, 점마다 작은 원 그리기'),
            solution: CH2.replace('window.title("2단계 : 막대만 그리기")', 'window.title("꺾은선 그래프")').replace('for i in range(len(values)) :\n    x = LEFT + i * 46\n    top = BASE - values[i] / vmax * CHART_H       # 값 → 화면 좌표\n    canvas.create_rectangle(x, top, x + 36, BASE, fill = "#4c8dff", outline = "")', 'points = []\nfor i in range(len(values)) :\n    x = LEFT + i * 46 + 18\n    y = BASE - values[i] / vmax * CHART_H\n    points.append((x, y))\n\nfor i in range(len(points) - 1) :                  # 이웃한 두 점을 잇는다\n    x1, y1 = points[i]\n    x2, y2 = points[i + 1]\n    canvas.create_line(x1, y1, x2, y2, fill = "#2f6fe0", width = 3)\n\nfor i in range(len(points)) :\n    x, y = points[i]\n    color = "#ff3b30" if values[i] == vmax else "#2f6fe0"\n    canvas.create_oval(x - 4, y - 4, x + 4, y + 4, fill = color, outline = "")')
          },
          {
            title: '실습 14-34. 호빵 그래프를 함께 보기 (두 계열)', level: 2,
            desc: '<p>완성 코드를 고쳐 <b>두 품목을 한 화면에</b> 그리세요.</p><ul><li>막대를 반으로 나눠 왼쪽은 아이스크림(파랑), 오른쪽은 호빵(주황)</li><li>두 계열의 <b>공통 최대값</b>을 기준으로 높이를 계산해야 비교가 됩니다</li><li>오른쪽 위에 색 설명(범례)을 글자로 표시합니다</li></ul>',
            hint: '<code>vmax = max(max(ice), max(bread))</code> 로 공통 기준을 잡고, 막대 폭을 18 로 줄여 <code>x</code> 와 <code>x + 18</code> 두 개를 그립니다.',
            starter: CH2.replace("values = [r[1] for r in rows]\nvmax = max(values)", "ice = [r[1] for r in rows]\nbread = [r[2] for r in rows]\nvmax = max(max(ice), max(bread))     # 공통 기준").replace('for i in range(len(values)) :\n    x = LEFT + i * 46\n    top = BASE - values[i] / vmax * CHART_H       # 값 → 화면 좌표\n    canvas.create_rectangle(x, top, x + 36, BASE, fill = "#4c8dff", outline = "")', '# TODO: 한 달에 막대 두 개(폭 18)씩 그리고 범례 표시'),
            solution: CH2.replace('window.title("2단계 : 막대만 그리기")', 'window.title("아이스크림 vs 호빵")').replace("values = [r[1] for r in rows]\nvmax = max(values)", "ice = [r[1] for r in rows]\nbread = [r[2] for r in rows]\nvmax = max(max(ice), max(bread))     # 공통 기준으로 그려야 비교가 된다").replace('for i in range(len(values)) :\n    x = LEFT + i * 46\n    top = BASE - values[i] / vmax * CHART_H       # 값 → 화면 좌표\n    canvas.create_rectangle(x, top, x + 36, BASE, fill = "#4c8dff", outline = "")', 'for i in range(len(rows)) :\n    x = LEFT + i * 46\n    top1 = BASE - ice[i] / vmax * CHART_H\n    top2 = BASE - bread[i] / vmax * CHART_H\n    canvas.create_rectangle(x, top1, x + 18, BASE, fill = "#4c8dff", outline = "")\n    canvas.create_rectangle(x + 18, top2, x + 36, BASE, fill = "#ff9f43", outline = "")\n    canvas.create_text(x + 18, BASE + 14, text = "%d" % rows[i][0], font = (\'맑은고딕\', 9))\n\ncanvas.create_rectangle(W - 150, 20, W - 134, 34, fill = "#4c8dff", outline = "")\ncanvas.create_text(W - 90, 27, text = head[1], font = (\'맑은고딕\', 10))\ncanvas.create_rectangle(W - 150, 42, W - 134, 56, fill = "#ff9f43", outline = "")\ncanvas.create_text(W - 100, 49, text = head[2], font = (\'맑은고딕\', 10))')
          },
          {
            title: '🚀 프로젝트 14-35. 내 기록으로 그래프 그리기 + README', level: 3,
            desc: '<p>14-6 에서 만든 타자 연습의 기록 파일(<code>typing_result.txt</code>)을 읽어 <b>회차별 분당 타수</b>를 막대그래프로 그리는 프로그램을 만드세요.</p><ul><li><b>입력</b> : <code>날짜,걸린시간,타수,정확도</code> 형식의 줄들 (파일이 없으면 시험용 기록을 직접 만들어 쓴다)</li><li><b>출력</b> : 회차별 타수 막대그래프 + 평균선 + 최고 기록 강조</li><li><b>규칙</b> : 기록이 하나도 없으면 “아직 기록이 없습니다” 를 화면에 보여 주고 오류 없이 끝난다</li></ul><p>완성한 뒤 <b>README 를 다섯 줄 이상</b> 써서 무엇을 만들었는지, 어떻게 실행하는지 설명해 보세요.</p>',
            hint: '기록 줄을 <code>split(\',\')</code> 로 나누고 타수 칸에서 숫자만 꺼냅니다(<code>\'121타\'</code> → <code>int(\'121타\'.replace(\'타\', \'\'))</code>). 그래프 그리는 함수는 실습 14-32 의 <code>bar_top</code> 을 그대로 씁니다.',
            starter: "from tkinter import *\n\nRESULT_FILE = 'typing_result.txt'\nW, H, LEFT, BASE, CHART_H = 520, 320, 60, 260, 200\n\ndef load_records(fname) :\n    # TODO: 파일을 읽어 타수(정수) 리스트로. 파일이 없으면 빈 리스트\n    return []\n\nwindow = Tk()\nwindow.title('내 타자 기록')\ncanvas = Canvas(window, width = W, height = H, bg = 'white')\ncanvas.pack()\n\nrecords = load_records(RESULT_FILE)\n# TODO: 기록이 없으면 안내 글, 있으면 막대그래프와 평균선\n\nwindow.mainloop()\n",
            solution: "from tkinter import *\n\nRESULT_FILE = 'typing_result.txt'\nW, H, LEFT, BASE, CHART_H = 520, 320, 60, 260, 200\n\ndef load_records(fname) :\n    records = []\n    try :\n        with open(fname, encoding = 'utf-8') as f :\n            for line in f :\n                part = line.strip().split(',')\n                if len(part) >= 3 :\n                    records.append(int(part[2].replace('타', '')))\n    except FileNotFoundError :\n        return []\n    return records\n\ndef make_sample() :                       # 기록이 없을 때 쓸 시험용 자료\n    with open(RESULT_FILE, 'w', encoding = 'utf-8') as f :\n        for when, spent, chars, acc in [('1회', 30.0, 180, 95.0), ('2회', 28.0, 210, 96.0),\n                                        ('3회', 25.0, 240, 98.0), ('4회', 26.0, 225, 97.0)] :\n            f.write('%s,%.1f초,%d타,%.1f%%\\n' % (when, spent, chars, acc))\n\ndef draw(records) :\n    if len(records) == 0 :\n        canvas.create_text(W / 2, H / 2, text = '아직 기록이 없습니다', font = ('맑은고딕', 14))\n        return\n    vmax = max(records)\n    avg = sum(records) / len(records)\n    canvas.create_text(W / 2, 24, text = '회차별 분당 타수', font = ('맑은고딕', 14, 'bold'))\n    canvas.create_line(LEFT, BASE, W - 20, BASE)\n    for i in range(len(records)) :\n        x = LEFT + i * 50\n        top = BASE - records[i] / vmax * CHART_H\n        color = '#ff7043' if records[i] == vmax else '#4c8dff'\n        canvas.create_rectangle(x, top, x + 34, BASE, fill = color, outline = '')\n        canvas.create_text(x + 17, top - 10, text = str(records[i]), font = ('맑은고딕', 9))\n        canvas.create_text(x + 17, BASE + 14, text = '%d회' % (i + 1), font = ('맑은고딕', 9))\n    avgY = BASE - avg / vmax * CHART_H\n    canvas.create_line(LEFT, avgY, W - 20, avgY, fill = 'red')\n    canvas.create_text(W - 24, avgY - 10, text = '평균 %.0f타' % avg, fill = 'red', anchor = E, font = ('맑은고딕', 10))\n\nwindow = Tk()\nwindow.title('내 타자 기록')\ncanvas = Canvas(window, width = W, height = H, bg = 'white')\ncanvas.pack()\n\nrecords = load_records(RESULT_FILE)\nif len(records) == 0 :          # 기록이 없으면 시험용 자료를 만들어 보여 준다\n    make_sample()\n    records = load_records(RESULT_FILE)\nprint('기록', len(records), '개 / 최고', max(records), '타')\ndraw(records)\n\nwindow.mainloop()\n",
            expect: '기록 4 개 / 최고 240 타'
          }
        ],
        quiz: [
          { q: 'CSV 파일에서 읽은 <code>[\'1\', \'120\', \'430\']</code> 을 그대로 <code>max()</code> 에 넣으면?', options: ['430 이 나온다', '글자 순서로 비교해 <code>\'430\'</code> 이 나오지만 <code>\'9\'</code> 같은 값이 있으면 그것이 가장 커진다', '오류가 난다', '1 이 나온다'], answer: 1,
            explain: '문자열은 사전 순으로 비교합니다. <code>\'9\' &gt; \'430\'</code> 이므로 숫자로 바꾸지 않으면 엉뚱한 결과가 나옵니다.' },
          { q: '<code>next(reader)</code> 를 부르는 이유는?', options: ['파일을 닫으려고', '제목 줄(열 이름)을 먼저 꺼내 데이터와 분리하려고', '다음 파일을 읽으려고', '행 수를 세려고'], answer: 1,
            explain: 'CSV 의 첫 줄은 보통 열 이름입니다. 먼저 꺼내 두면 나머지 줄은 모두 데이터로 다룰 수 있습니다.' },
          { q: '바닥 <code>BASE = 340</code>, 그래프 높이 <code>CHART_H = 260</code>, 최대값 1040 일 때 값 520 의 막대 윗변 y 는?', options: ['210.0', '130.0', '520.0', '340.0'], answer: 0,
            explain: '<code>340 - 520 / 1040 * 260 = 340 - 130 = 210.0</code> 입니다.' },
          { q: '<code>draw_chart()</code> 의 첫 줄에 <code>canvas.delete(ALL)</code> 이 없으면?', options: ['아무 일도 없다', '예전 그래프 위에 새 그래프가 겹쳐 그려진다', '오류가 난다', '창이 닫힌다'], answer: 1,
            explain: '캔버스에 그린 항목은 지우기 전까지 남아 있습니다. 다시 그리기 전에는 지우는 것이 규칙입니다.' },
          { q: '막대그래프의 세로축을 0 이 아닌 값에서 시작하면 생기는 문제는?', options: ['그래프가 느려진다', '작은 차이가 실제보다 크게 보여 읽는 사람을 오해하게 만든다', '색이 이상해진다', '눈금을 그릴 수 없다'], answer: 1,
            explain: '막대의 <b>길이</b>로 크기를 비교하기 때문에, 시작점을 올리면 길이의 비율이 실제 값의 비율과 달라집니다.' },
          { q: 'README 에 꼭 들어가야 할 내용으로 가장 알맞지 <b>않은</b> 것은?', options: ['프로그램이 무엇을 하는지 한 문장 설명', '실행 방법과 필요한 파일', '기능 목록', '모든 함수의 전체 소스 코드'], answer: 3,
            explain: 'README 는 소스 코드를 옮겨 적는 곳이 아니라 <b>읽는 사람이 빨리 이해하고 실행해 보게 돕는</b> 안내문입니다.' }
        ],
        slides: [
          { layout: 'title', title: '[프로젝트 4] 데이터로 그래프 그리기', subtitle: 'Chapter 14 · 14-7 — CSV · Canvas · 프로젝트 마무리', badge: '14-7',
            notes: '<p>마지막 교시입니다. 완성된 그래프 화면을 먼저 보여 주고, 오늘은 “데이터 → 그림” 이라는 새로운 종류의 프로그램을 만든다고 소개합니다.</p><p>시간: 2분</p>' },
          { layout: 'bullets', title: '① 요구 사항', lead: '월별 판매 자료를 읽어 그래프로', bullets: [
            'CSV 를 읽어 <b>숫자</b>로 바꾼다',
            '합계 · 평균 · 최대 · 최소를 보여 준다',
            '월별 막대그래프 (최대값은 다른 색)',
            '눈금 · 값 · 월 이름 · 제목 · <b>평균선</b>',
            '품목 선택 / 요약 파일 저장'
          ], notes: '<p>요구 사항을 먼저 적는 습관을 다시 반복합니다. “평균선이 왜 필요할까?” 를 물어 보세요 — 어느 달이 평균보다 좋은지 한눈에 알기 위해서입니다.</p>' },
          { layout: 'code', title: 'CSV 읽고 통계 내기', code: CH_LOAD.replace("print('열 이름 :', head)\nprint('행 수   :', len(rows))\nprint('첫 행   :', rows[0])\nprint('끝 행   :', rows[-1])\n\n", "print(head, len(rows), rows[0])\n"), points: ['<code>csv.reader</code> → 문자열 리스트', '<code>next()</code> 로 제목 줄 분리', '<code>int()</code> 로 바로 변환', '통계는 <code>sum · max · min</code>'],
            notes: '<p>파일에서 읽은 값이 모두 문자열이라는 점을 꼭 실험으로 보여 주세요: <code>max([\'9\', \'1040\'])</code> 의 결과가 <code>\'9\'</code> 입니다.</p>' },
          { layout: 'diagram', title: '③ 값을 화면 좌표로 (스케일 변환)', html: SVG_CHART, caption: 'top = BASE − 값 / 최대값 × 높이',
            notes: '<p>오늘의 핵심 공식입니다. 화면의 y 가 아래로 커지기 때문에 <b>빼기</b>가 들어간다는 점을 칠판에 그려 설명하세요. 실습 14-32 로 손으로 계산해 보게 합니다.</p>' },
          { layout: 'code', title: '2단계 — 막대만 그려 본다', code: CH2.replace("## 함수 선언 부분 ##\ndef load_sales(fname) :\n    rows = []\n    with open(fname, encoding = 'utf-8') as f :\n        reader = csv.reader(f)\n        head = next(reader)\n        for line in reader :\n            rows.append([int(v) for v in line])\n    return head, rows\n\n## 전역 변수 선언 부분 ##\n", '').replace('import csv\n', '').replace("head, rows = load_sales('ch14/sales.csv')\nvalues = [r[1] for r in rows]", 'values = [120, 150, 240, 380, 520, 760, 980, 1040, 620, 330, 200, 140]'),
            points: ['축 · 글자 없이 막대만', '<code>create_rectangle(x1,y1,x2,y2)</code>', '간격 46 − 폭 36 = 10', '높이가 맞는지만 확인'],
            notes: '<p>슬라이드용으로 CSV 읽기를 빼고 값을 직접 적었습니다. “한 번에 완성하지 않는다” 는 원칙을 눈으로 보여 주는 단계입니다.</p>' },
          { layout: 'table', title: '3단계 — 읽을 수 있는 그래프로', head: ['더할 것', '왜 필요한가'], rows: [
            ['제목', '무엇에 대한 그래프인지'],
            ['세로 눈금 · 값', '막대 크기를 숫자로 읽게'],
            ['가로 라벨(월)', '어느 시점인지'],
            ['평균선', '평균보다 높은 달을 한눈에'],
            ['최대값 강조', '가장 중요한 값을 먼저']
          ], lead: '막대만 있는 그림은 “대충 이런 모양” 만 알려 준다',
            notes: '<p>완성 코드를 실행해 두고 항목을 하나씩 가리키며 설명합니다. 품목을 바꿔 두 그래프가 정반대 모양인 것을 보여 주면 데이터에서 이야기를 읽는 경험이 됩니다.</p>' },
          { layout: 'code', title: '다시 그리기 전에 지운다', code: "from tkinter import *\n\nwindow = Tk()\ncanvas = Canvas(window, width = 300, height = 160, bg = 'white')\ncanvas.pack()\ncount = {'n' : 0}\n\ndef redraw() :\n    canvas.delete(ALL)             # 이 줄이 없으면 겹쳐 그려진다\n    count['n'] += 1\n    canvas.create_rectangle(20, 140 - count['n'] * 20, 60, 140, fill = 'skyblue')\n    canvas.create_text(150, 20, text = '%d 번째 그리기' % count['n'])\n\nButton(window, text = '다시 그리기', command = redraw).pack()\nredraw()\nredraw()\nwindow.mainloop()", points: ['<code>canvas.delete(ALL)</code>', '지우지 않으면 누적', '“그리기 함수” 는 항상 처음부터'],
            notes: '<p>delete(ALL) 을 주석 처리하고 버튼을 여러 번 눌러 겹치는 모습을 보여 주면 이유가 분명해집니다.</p>' },
          { layout: 'two', title: '마무리 ① 모듈 나누기', left: { title: 'salesdata.py (계산)', bullets: ['CSV 읽기', '합계 · 평균 · 최대 · 최소', 'tkinter 가 한 줄도 없다', '화면 없이 시험 가능'] }, right: { title: 'main.py (화면)', bullets: ['창 · 캔버스 · 버튼', '그리기 · 사용자 입력', '계산은 모듈에 맡긴다', '다른 화면으로 교체 쉬움'] },
            notes: '<p>본문의 모듈 분리 예제를 실행해 보여 줍니다. “계산 코드에 tkinter 가 섞여 있지 않은가?” 를 정리의 기준으로 삼으라고 알려 주세요.</p>' },
          { layout: 'bullets', title: '마무리 ② 코드 정리 체크리스트', bullets: [
            '뜻이 드러나는 <b>이름</b> (<code>tmp</code> · <code>data2</code> 금지)',
            '함수는 한 화면(30줄) 안으로',
            '흩어진 숫자 → <b>대문자 상수</b>로 (매직 넘버)',
            '주석은 “무엇” 이 아니라 <b>“왜”</b>',
            '시험용 <code>print</code> 와 주석 처리한 옛 코드 지우기'
          ], notes: '<p>학생들이 만든 코드 하나를 화면에 띄워 함께 정리해 보면 가장 효과가 좋습니다. 정리 전후를 비교해 보여 주세요.</p>' },
          { layout: 'bullets', title: '마무리 ③ README 쓰기', lead: '읽는 사람이 궁금한 다섯 가지', bullets: [
            '<b>무엇을</b> 하는 프로그램인가 (첫 두 줄!)',
            '<b>왜</b> 만들었는가',
            '<b>어떻게 실행</b>하는가 (필요한 파일 · 명령)',
            '<b>어떤 기능</b>이 있는가',
            '<b>앞으로 할 일</b> — 계획이 있는 프로젝트로 보인다'
          ], notes: '<p>본문의 README 예시를 함께 읽습니다. 화면 사진 한 장의 힘, 그리고 올리기 전에 개인 정보를 확인하는 습관도 알려 주세요.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: 'BASE = 340, 높이 260, 최대값 1040 일 때 값 520 의 막대 윗변 y 는?', options: ['210.0', '130.0', '520.0', '340.0'], answer: 0,
            explain: '340 − 520 / 1040 × 260 = 340 − 130 = 210.0',
            notes: '<p>계산 과정을 칠판에 한 줄씩 적어 가며 풀어 줍니다.</p>' },
          { layout: 'practice', title: '실습 14-32. 막대 좌표 계산표', desc: '높이 200, BASE 260, 최대 1000 일 때 값 0 · 250 · 500 · 1000 의 y 와 막대 높이 출력',
            starter: "CHART_H = 200\nBASE_Y = 260\nVMAX = 1000\n\ndef bar_top(value) :\n    # TODO\n    return 0\n\nprint(bar_top(500))\n",
            solution: "CHART_H = 200\nBASE_Y = 260\nVMAX = 1000\n\ndef bar_top(value) :\n    return BASE_Y - value / VMAX * CHART_H\n\nfor v in [0, 250, 500, 1000] :\n    top = bar_top(v)\n    print('%4d → y = %.1f, 높이 = %.1f' % (v, top, BASE_Y - top))\n",
            notes: '<p>5분. 계산이 익숙해지면 그리기는 쉽습니다. 다 한 학생에게는 실습 14-33(꺾은선)으로 넘어가게 하세요.</p>' },
          { layout: 'summary', title: 'Chapter 14 정리', bullets: [
            '외부 라이브러리 · 표준 라이브러리를 빌려 큰 프로그램을 만들었다',
            '네 프로젝트 모두 <b>요구 사항 → 분해 → 단계별 개발 → 리팩터링 → 확장</b>',
            '화면과 계산을 나누면 화면 없이 시험할 수 있다',
            '상태는 묶고, 반복되는 코드는 표와 함수로 모은다',
            '이제 필요한 것은 문법이 아니라 <b>만들고 싶은 것</b>'
          ], notes: '<p>과정 전체를 마무리합니다. 각자 만들고 싶은 프로그램을 한 문장으로 적고, 요구 사항 5줄과 기능 분해를 해 보는 것을 마지막 과제로 내 주면 좋습니다.</p>' }
        ]
      }
    ]
  });
})();
