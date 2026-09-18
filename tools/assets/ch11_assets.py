"""Chapter 11(파일 입출력) 예제용 파일 만들기

    python tools/assets/ch11_assets.py
    python tools/build-assets.py        # manifest.json 다시 만들기

만드는 파일 (모두 assets/ 아래 — 브라우저 · 검증 도구에서 작업 폴더로 복사됨)
- win.ini        : 윈도의 C:/Windows/win.ini 와 비슷한 작은 설정 파일 (type · copy 명령 예제용)
- data1.txt      : 세 줄짜리 텍스트 파일 (readline · readlines 예제용)
- normal.txt     : [프로그램 1] 암호화할 원본 파일
- security.txt   : normal.txt 를 [프로그램 1] 방식(+100)으로 암호화한 파일
- RAW/*.raw      : 256×256(또는 128×128) 흑백 RAW 영상 — 머리글 없이 밝기(0~255) 바이트만 나열
                   저작권 문제가 없도록 Pillow 로 직접 그린 그림입니다.
"""
import math
import os

from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'assets')
RAW = os.path.join(ROOT, 'RAW')
os.makedirs(RAW, exist_ok=True)


def write_text(name, text):
    with open(os.path.join(ROOT, name), 'w', encoding='utf-8', newline='\n') as fp:
        fp.write(text)


# ------------------------------------------------------------------ 텍스트 파일
write_text('win.ini', '; for 16-bit app support\n[fonts]\n[extensions]\n[mci extensions]\n[files]\n[Mail]\nMAPI=1\n')
write_text('data1.txt', 'CookBook 파이썬을 공부합니다.\n완전 재미있어요. ^^\n파이썬을 공부하기 잘했네요~~')
NORMAL = '안녕하세요?\n저는 Cookbook 파이썬을 즐겁게\n공부하고 있습니다. ^___^\n'
write_text('normal.txt', NORMAL)
write_text('security.txt', ''.join(chr(ord(ch) + 100) for ch in NORMAL))


# ------------------------------------------------------------------ RAW 영상
def save_raw(name, im):
    im = im.convert('L')
    with open(os.path.join(RAW, name), 'wb') as fp:
        fp.write(im.tobytes())
    print('RAW/%s  %dx%d  %d bytes' % (name, im.width, im.height, im.width * im.height))


def vgrad(w, h, top, bottom):
    im = Image.new('L', (w, h))
    px = im.load()
    for y in range(h):
        v = int(top + (bottom - top) * y / (h - 1))
        for x in range(w):
            px[x, y] = v
    return im


def shade_ball(im, cx, cy, r, base, light=60):
    """빛이 왼쪽 위에서 오는 공 모양 (나뭇잎 덩어리 등)"""
    px = im.load()
    lx, ly = cx - r * 0.4, cy - r * 0.45
    for y in range(max(0, int(cy - r)), min(im.height, int(cy + r) + 1)):
        for x in range(max(0, int(cx - r)), min(im.width, int(cx + r) + 1)):
            d = math.hypot(x - cx, y - cy)
            if d <= r:
                t = math.hypot(x - lx, y - ly) / (r * 1.5)
                v = base + light * (1 - min(1.0, t)) - 18 * (d / r) ** 3
                # 잎사귀 느낌의 잔무늬
                v += 10 * math.sin(x * 0.9) * math.cos(y * 0.8)
                px[x, y] = max(0, min(255, int(v)))


# 1) tree.raw : 하늘 · 해 · 언덕 · 나무
def make_tree():
    W = H = 256
    im = vgrad(W, H, 235, 175)
    d = ImageDraw.Draw(im)
    d.ellipse((190, 22, 236, 68), fill=250)                       # 해
    for k in range(3):                                            # 구름
        d.ellipse((24 + k * 22, 40 - (k % 2) * 8, 70 + k * 22, 70), fill=245)
    # 언덕(땅)
    px = im.load()
    for x in range(W):
        gy = int(190 + 14 * math.sin(x / 40.0))
        for y in range(gy, H):
            v = 120 - (y - gy) * 0.5 + 8 * math.sin(x * 1.3 + y * 0.7)
            px[x, y] = max(0, min(255, int(v)))
    # 줄기와 가지
    d.polygon([(118, 205), (138, 205), (134, 120), (122, 120)], fill=60)
    d.line((128, 150, 96, 118), fill=60, width=7)
    d.line((130, 140, 160, 112), fill=60, width=6)
    # 잎(음영이 있는 공 여러 개)
    for cx, cy, r, b in [(98, 110, 34, 95), (158, 106, 34, 90), (128, 80, 42, 105),
                         (104, 70, 28, 110), (152, 70, 28, 108), (128, 124, 30, 88)]:
        shade_ball(im, cx, cy, r, b)
    # 그림자
    d.ellipse((92, 200, 170, 214), fill=85)
    d.polygon([(118, 205), (138, 205), (136, 180), (120, 180)], fill=55)
    return im


# 2) face.raw : 사람 얼굴(안경 쓴 학생) 그림
def make_face():
    W = H = 256
    im = vgrad(W, H, 225, 150)
    d = ImageDraw.Draw(im)
    # 뒤쪽 건물 실루엣
    for i, (x, h) in enumerate([(0, 70), (30, 95), (62, 60), (180, 88), (212, 110), (236, 76)]):
        d.rectangle((x, 150 - h, x + 26, 170), fill=170 - i * 4)
        for wy in range(150 - h + 6, 165, 12):
            d.rectangle((x + 5, wy, x + 10, wy + 5), fill=200)
            d.rectangle((x + 15, wy, x + 20, wy + 5), fill=200)
    # 풀밭
    px = im.load()
    for y in range(165, H):
        for x in range(W):
            px[x, y] = max(0, min(255, int(150 + 30 * math.sin(x * 0.7 + y * 0.3) * math.cos(y * 0.9))))
    # 몸(검은 점퍼)
    d.polygon([(40, 256), (60, 205), (100, 188), (156, 188), (196, 205), (216, 256)], fill=35)
    d.line((128, 196, 128, 256), fill=80, width=2)                # 지퍼
    d.polygon([(108, 188), (128, 215), (148, 188)], fill=55)      # 옷깃
    # 목 · 얼굴
    d.rectangle((110, 160, 146, 196), fill=175)
    d.ellipse((82, 72, 174, 182), fill=190)
    d.ellipse((74, 112, 90, 140), fill=180)                       # 귀
    d.ellipse((166, 112, 182, 140), fill=180)
    # 머리카락
    d.chord((78, 52, 178, 140), 180, 360, fill=30)
    d.polygon([(80, 100), (92, 80), (110, 98), (128, 84), (146, 98), (164, 80), (176, 100)], fill=30)
    # 안경과 눈
    for ex in (106, 150):
        d.ellipse((ex - 17, 112, ex + 17, 140), outline=60, width=3)
        d.ellipse((ex - 5, 121, ex + 5, 131), fill=40)
    d.line((123, 124, 133, 124), fill=60, width=3)
    d.line((88, 120, 76, 116), fill=60, width=2)
    d.line((168, 120, 180, 116), fill=60, width=2)
    d.line((96, 104, 116, 102), fill=60, width=3)                  # 눈썹
    d.line((140, 102, 160, 104), fill=60, width=3)
    d.line((128, 132, 124, 152), fill=150, width=2)                # 코
    d.line((124, 152, 132, 152), fill=150, width=2)
    d.arc((110, 150, 146, 172), 20, 160, fill=110, width=3)        # 입
    return im.filter(ImageFilter.SMOOTH)


# 3) cat.raw : 고양이 얼굴
def make_cat():
    W = H = 256
    im = Image.new('L', (W, H))
    px = im.load()
    for y in range(H):
        for x in range(W):
            px[x, y] = 200 + int(25 * math.sin(x / 18.0) * math.sin(y / 18.0))   # 물방울 무늬 벽지
    d = ImageDraw.Draw(im)
    d.polygon([(52, 120), (70, 30), (118, 84)], fill=110)          # 귀
    d.polygon([(204, 120), (186, 30), (138, 84)], fill=110)
    d.polygon([(66, 104), (76, 52), (104, 84)], fill=170)
    d.polygon([(190, 104), (180, 52), (152, 84)], fill=170)
    d.ellipse((40, 66, 216, 226), fill=120)                        # 얼굴
    for k in range(3):                                             # 이마 줄무늬
        d.line((110 + k * 18, 74, 114 + k * 14, 104), fill=80, width=5)
    d.ellipse((72, 110, 118, 150), fill=235)                       # 눈
    d.ellipse((138, 110, 184, 150), fill=235)
    d.ellipse((88, 112, 102, 148), fill=15)
    d.ellipse((154, 112, 168, 148), fill=15)
    d.ellipse((91, 118, 96, 124), fill=255)
    d.ellipse((157, 118, 162, 124), fill=255)
    d.polygon([(118, 160), (138, 160), (128, 172)], fill=60)       # 코
    d.arc((104, 162, 128, 190), 0, 150, fill=40, width=3)          # 입
    d.arc((128, 162, 152, 190), 30, 180, fill=40, width=3)
    for dy in (-8, 4, 16):                                         # 수염
        d.line((100, 172, 30, 172 + dy * 2), fill=245, width=2)
        d.line((156, 172, 226, 172 + dy * 2), fill=245, width=2)
    return im.filter(ImageFilter.SMOOTH)


# 4) pattern.raw : 원형 그러데이션 + 동심원 (밝기 값 확인용)
def make_pattern():
    W = H = 256
    im = Image.new('L', (W, H))
    px = im.load()
    for y in range(H):
        for x in range(W):
            r = math.hypot(x - 128, y - 128)
            v = 255 - r * 1.4 + 40 * math.sin(r / 6.0)
            if x < 32:                                             # 왼쪽 띠 : 0~255 계단
                v = (y // 32) * 36
            px[x, y] = max(0, min(255, int(v)))
    return im


tree, face, cat, pattern = make_tree(), make_face(), make_cat(), make_pattern()
save_raw('tree.raw', tree)
save_raw('face.raw', face)
save_raw('cat.raw', cat)
save_raw('pattern.raw', pattern)
save_raw('face_128.raw', face.resize((128, 128), Image.LANCZOS))
save_raw('cat_128.raw', cat.resize((128, 128), Image.LANCZOS))

# 확인용 미리보기 PNG : 환경 변수 CH11_PREVIEW=폴더 를 주면 그 폴더에 저장
PREV = os.environ.get('CH11_PREVIEW')
if PREV:
    os.makedirs(PREV, exist_ok=True)
    for n, im in [('tree', tree), ('face', face), ('cat', cat), ('pattern', pattern)]:
        im.save(os.path.join(PREV, n + '.png'))
print('done')
