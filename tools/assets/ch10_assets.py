"""Chapter 10 (윈도 프로그래밍) 예제용 GIF 그림 만들기

    python tools/assets/ch10_assets.py
    python tools/build-assets.py

교재의 사진(저작권)을 쓰지 않고 Pillow 로 직접 그린 그림을 만든다.
만드는 파일 (assets/GIF/)
  dog.gif, dog2.gif, cat.gif, cat2.gif, rabbit.gif      : 동물 그림 (200x200)
  froyo.gif ~ nougat.gif (9개)                           : 과자 아이콘 (64x64, Code10-11 의 3x3 배치)
  jeju1.gif ~ jeju9.gif                                  : 풍경 그림 (600x400, 사진 앨범)
  painting1.gif ~ painting4.gif                          : 명화 느낌의 그림 (280x340, 명화 감상)
"""
import math
import os
import random

from PIL import Image, ImageDraw, ImageFont

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'assets', 'GIF')
os.makedirs(OUT, exist_ok=True)
random.seed(10)


def font(size):
    for f in ('C:/Windows/Fonts/malgunbd.ttf', 'C:/Windows/Fonts/malgun.ttf',
              '/usr/share/fonts/truetype/nanum/NanumGothicBold.ttf', '/System/Library/Fonts/AppleSDGothicNeo.ttc'):
        if os.path.exists(f):
            try:
                return ImageFont.truetype(f, size)
            except Exception:
                pass
    try:
        return ImageFont.load_default(size)
    except Exception:
        return ImageFont.load_default()


def save(img, name, colors=64):
    p = img.convert('RGB').quantize(colors=colors, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    path = os.path.join(OUT, name)
    p.save(path, optimize=True)
    print('%-18s %4dx%-4d %6.1f KB' % (name, img.width, img.height, os.path.getsize(path) / 1024))


def vgrad(d, box, top, bottom, steps=24):
    x0, y0, x1, y1 = box
    h = y1 - y0
    for i in range(steps):
        t = i / (steps - 1)
        c = tuple(int(top[k] + (bottom[k] - top[k]) * t) for k in range(3))
        d.rectangle([x0, y0 + h * i // steps, x1, y0 + h * (i + 1) // steps], fill=c)


def label(d, xy, text, size, fill=(255, 255, 255), shadow=(0, 0, 0)):
    f = font(size)
    x, y = xy
    d.text((x + 2, y + 2), text, font=f, fill=shadow)
    d.text((x, y), text, font=f, fill=fill)


# ------------------------------------------------------------------ 동물 (200x200)
def dog(name, fur, ear, bg1, bg2, text):
    im = Image.new('RGB', (200, 200))
    d = ImageDraw.Draw(im)
    vgrad(d, (0, 0, 200, 200), bg1, bg2)
    d.ellipse([10, 150, 190, 230], fill=tuple(max(0, c - 30) for c in bg2))       # 풀밭
    d.ellipse([45, 120, 155, 215], fill=fur)                                        # 몸
    d.ellipse([28, 40, 72, 120], fill=ear)                                          # 귀
    d.ellipse([128, 40, 172, 120], fill=ear)
    d.ellipse([45, 35, 155, 145], fill=fur)                                         # 얼굴
    d.ellipse([72, 85, 128, 135], fill=(250, 240, 225))                             # 주둥이
    d.ellipse([75, 70, 91, 88], fill=(40, 30, 30)); d.ellipse([79, 73, 84, 78], fill='white')
    d.ellipse([109, 70, 125, 88], fill=(40, 30, 30)); d.ellipse([113, 73, 118, 78], fill='white')
    d.ellipse([90, 92, 110, 106], fill=(30, 25, 25))                                # 코
    d.arc([84, 100, 100, 118], 20, 160, fill=(60, 40, 40), width=2)
    d.arc([100, 100, 116, 118], 20, 160, fill=(60, 40, 40), width=2)
    d.ellipse([93, 114, 107, 130], fill=(235, 110, 120))                            # 혀
    label(d, (8, 6), text, 16)
    save(im, name)


def cat(name, fur, stripe, bg1, bg2, text, yawn=False):
    im = Image.new('RGB', (200, 200))
    d = ImageDraw.Draw(im)
    vgrad(d, (0, 0, 200, 200), bg1, bg2)
    d.ellipse([40, 125, 160, 220], fill=fur)
    d.polygon([(45, 80), (60, 20), (95, 55)], fill=fur)                             # 귀
    d.polygon([(155, 80), (140, 20), (105, 55)], fill=fur)
    d.polygon([(58, 68), (64, 34), (86, 56)], fill=(245, 170, 180))
    d.polygon([(142, 68), (136, 34), (114, 56)], fill=(245, 170, 180))
    d.ellipse([40, 40, 160, 150], fill=fur)
    for k in range(3):                                                              # 줄무늬
        d.line([(100, 44 + k * 8), (100 - 14 + k * 4, 60 + k * 8)], fill=stripe, width=4)
        d.line([(100, 44 + k * 8), (100 + 14 - k * 4, 60 + k * 8)], fill=stripe, width=4)
    if yawn:
        d.arc([62, 78, 90, 96], 200, 340, fill=(40, 30, 30), width=3)
        d.arc([110, 78, 138, 96], 200, 340, fill=(40, 30, 30), width=3)
        d.ellipse([82, 100, 118, 140], fill=(150, 40, 50)); d.ellipse([90, 120, 110, 138], fill=(235, 110, 120))
    else:
        d.ellipse([64, 76, 88, 98], fill=(120, 170, 60)); d.ellipse([72, 78, 80, 96], fill=(20, 20, 20))
        d.ellipse([112, 76, 136, 98], fill=(120, 170, 60)); d.ellipse([120, 78, 128, 96], fill=(20, 20, 20))
        d.polygon([(93, 106), (107, 106), (100, 114)], fill=(235, 120, 130))
        d.arc([88, 108, 100, 124], 0, 180, fill=(60, 40, 40), width=2)
        d.arc([100, 108, 112, 124], 0, 180, fill=(60, 40, 40), width=2)
    for s in (-1, 1):                                                               # 수염
        for k in range(3):
            d.line([(100 + s * 22, 112 + k * 5), (100 + s * 70, 100 + k * 12)], fill=(250, 250, 250), width=1)
    label(d, (8, 6), text, 16)
    save(im, name)


def rabbit():
    im = Image.new('RGB', (200, 200))
    d = ImageDraw.Draw(im)
    for r in range(140, 0, -10):                                                    # 둥근 배경
        c = 60 + (140 - r)
        d.ellipse([100 - r, 100 - r, 100 + r, 100 + r], fill=(c, c, c + 10))
    fur = (205, 165, 110)
    d.ellipse([45, 115, 165, 205], fill=fur)
    d.ellipse([62, 8, 92, 95], fill=fur); d.ellipse([70, 20, 86, 85], fill=(240, 180, 175))
    d.ellipse([108, 8, 138, 95], fill=fur); d.ellipse([114, 20, 130, 85], fill=(240, 180, 175))
    d.ellipse([55, 60, 145, 150], fill=fur)
    d.ellipse([74, 88, 90, 104], fill=(30, 20, 20)); d.ellipse([110, 88, 126, 104], fill=(30, 20, 20))
    d.ellipse([78, 90, 83, 95], fill='white'); d.ellipse([114, 90, 119, 95], fill='white')
    d.ellipse([94, 110, 106, 118], fill=(230, 120, 130))
    d.ellipse([60, 170, 140, 210], fill=(245, 215, 190))                            # 손
    label(d, (8, 6), '토끼', 16)
    save(im, 'rabbit.gif')


# ------------------------------------------------------------------ 과자 아이콘 (64x64)
def icon(name, text, draw):
    im = Image.new('RGB', (64, 64), (255, 255, 255))
    d = ImageDraw.Draw(im)
    draw(d)
    f = font(10)
    w = d.textlength(text, font=f)
    d.rectangle([0, 51, 64, 64], fill=(250, 250, 250))
    d.text(((64 - w) / 2, 51), text, font=f, fill=(60, 60, 60))
    save(im, name, colors=32)


def _froyo(d):          # 아이스크림 콘
    d.polygon([(22, 26), (42, 26), (32, 50)], fill=(215, 160, 80))
    d.ellipse([18, 8, 46, 32], fill=(250, 200, 220)); d.ellipse([26, 2, 38, 14], fill=(250, 220, 230))


def _ginger(d):         # 진저브레드 쿠키
    c = (175, 105, 55)
    d.ellipse([24, 4, 40, 20], fill=c); d.rectangle([22, 18, 42, 40], fill=c)
    d.line([(22, 22), (10, 30)], fill=c, width=7); d.line([(42, 22), (54, 30)], fill=c, width=7)
    d.line([(26, 38), (20, 50)], fill=c, width=7); d.line([(38, 38), (44, 50)], fill=c, width=7)
    for y in (24, 30, 36):
        d.ellipse([30, y, 34, y + 4], fill='white')


def _honey(d):          # 벌집
    for r in range(3):
        for k in range(4):
            cx, cy = 12 + k * 13 + (r % 2) * 6, 12 + r * 12
            d.regular_polygon((cx, cy, 7), 6, fill=(245, 190, 40), outline=(200, 140, 20))


def _icecream(d):       # 아이스크림 샌드위치
    d.rounded_rectangle([8, 12, 56, 22], 3, fill=(90, 50, 30))
    d.rectangle([8, 22, 56, 34], fill=(250, 250, 245))
    d.rounded_rectangle([8, 34, 56, 44], 3, fill=(90, 50, 30))


def _jelly(d):          # 젤리빈 병
    d.rounded_rectangle([12, 8, 52, 48], 8, fill=(225, 240, 245), outline=(150, 190, 200))
    for i in range(14):
        x, y = random.randint(16, 42), random.randint(14, 40)
        d.ellipse([x, y, x + 8, y + 5], fill=random.choice([(230, 60, 60), (60, 160, 60), (240, 200, 40), (60, 100, 220), (230, 120, 200)]))


def _kitkat(d):         # 초콜릿 막대
    for k in range(4):
        d.rounded_rectangle([8 + k * 12, 6, 17 + k * 12, 46], 3, fill=(120, 65, 35), outline=(80, 40, 20))


def _lolli(d):          # 롤리팝
    d.line([(32, 30), (32, 50)], fill=(200, 200, 200), width=3)
    cols = [(240, 80, 80), (250, 200, 60), (80, 180, 90), (90, 140, 230)]
    for i, r in enumerate(range(20, 0, -4)):
        d.ellipse([32 - r, 24 - r, 32 + r, 24 + r], fill=cols[i % 4])


def _marsh(d):          # 마시멜로
    for x, y in ((10, 20), (30, 12), (26, 30)):
        d.rounded_rectangle([x, y, x + 22, y + 18], 7, fill=(252, 250, 245), outline=(200, 195, 190))


def _nougat(d):         # 누가
    d.rounded_rectangle([8, 14, 56, 44], 4, fill=(250, 240, 225), outline=(210, 190, 160))
    for x, y, c in ((16, 20, (220, 60, 70)), (36, 24, (120, 180, 80)), (24, 32, (200, 150, 90)), (44, 34, (220, 60, 70))):
        d.ellipse([x, y, x + 7, y + 7], fill=c)


# ------------------------------------------------------------------ 풍경 (600x400)
W, H = 600, 400


def land(name, title, sky, sea, draw):
    im = Image.new('RGB', (W, H))
    d = ImageDraw.Draw(im)
    vgrad(d, (0, 0, W, 250), sky[0], sky[1], 20)
    vgrad(d, (0, 250, W, H), sea[0], sea[1], 12)
    draw(d)
    label(d, (18, 12), title, 28)
    save(im, name, colors=48)


def clouds(d, n=5, y=(75, 150)):
    for _ in range(n):
        x, yy = random.randint(0, W - 80), random.randint(*y)
        for k in range(4):
            r = random.randint(14, 26)
            d.ellipse([x + k * 20 - r, yy - r, x + k * 20 + r, yy + r], fill=(250, 250, 252))


def waves(d, y0=260, col=(200, 225, 245)):
    for _ in range(60):
        x, y = random.randint(0, W), random.randint(y0, H)
        d.line([(x, y), (x + random.randint(10, 30), y)], fill=col, width=1)


def _j1(d):     # 바다 위 섬 두 개
    clouds(d)
    d.polygon([(60, 255), (200, 170), (330, 255)], fill=(70, 95, 90))
    d.polygon([(360, 255), (400, 150), (450, 140), (500, 200), (520, 255)], fill=(110, 80, 70))
    d.polygon([(400, 150), (450, 140), (470, 160), (410, 165)], fill=(90, 150, 70))
    waves(d)


def _j2(d):     # 하늘에서 본 섬
    d.rectangle([0, 0, W, H], fill=(40, 80, 130))
    vgrad(d, (0, 0, W, H), (90, 130, 180), (15, 35, 70), 20)
    d.ellipse([150, 170, 470, 260], fill=(230, 235, 230))
    d.ellipse([160, 175, 460, 250], fill=(150, 140, 90))
    d.ellipse([220, 185, 380, 235], fill=(110, 130, 70))
    waves(d, 120, (120, 150, 190))


def _j3(d):     # 들꽃 언덕
    clouds(d, 7, (75, 170))
    d.polygon([(0, 230), (180, 205), (300, 215), (450, 190), (W, 220), (W, H), (0, H)], fill=(40, 90, 40))
    vgrad(d, (0, 260, W, H), (50, 110, 45), (20, 60, 25), 8)
    for _ in range(140):
        x, y = random.randint(0, W), random.randint(250, H)
        r = random.randint(3, 7)
        d.ellipse([x - r, y - r, x + r, y + r], fill=(245, 245, 235))


def _j4(d):     # 성산 일출봉 느낌
    d.polygon([(120, 250), (200, 120), (400, 110), (480, 250)], fill=(95, 120, 70))
    d.polygon([(200, 120), (400, 110), (380, 135), (220, 140)], fill=(70, 95, 55))
    d.ellipse([500, 40, 560, 100], fill=(255, 220, 120))
    waves(d)


def _j5(d):     # 한라산 설경
    d.polygon([(0, 250), (300, 90), (W, 250)], fill=(90, 100, 120))
    d.polygon([(250, 118), (300, 90), (350, 118), (325, 128), (300, 115), (275, 128)], fill=(250, 250, 255))
    for x in range(10, W, 30):
        d.polygon([(x, 250), (x + 12, 215), (x + 24, 250)], fill=(40, 80, 60))


def _j6(d):     # 해변과 야자수
    clouds(d, 3)
    d.polygon([(0, 330), (W, 290), (W, H), (0, H)], fill=(240, 220, 170))
    d.line([(470, 330), (490, 200)], fill=(120, 80, 40), width=10)
    for a in range(0, 360, 60):
        x = 490 + 60 * math.cos(math.radians(a)); y = 200 + 30 * math.sin(math.radians(a))
        d.line([(490, 200), (x, y)], fill=(40, 130, 60), width=8)


def _j7(d):     # 유채꽃 밭
    clouds(d, 4)
    d.polygon([(0, 200), (W, 180), (W, H), (0, H)], fill=(70, 130, 60))
    for _ in range(260):
        x, y = random.randint(0, W), random.randint(200, H)
        d.ellipse([x - 4, y - 4, x + 4, y + 4], fill=(250, 220, 40))


def _j8(d):     # 폭포
    d.rectangle([0, 60, W, H], fill=(60, 80, 60))
    d.rectangle([250, 60, 350, 330], fill=(230, 240, 250))
    for x in range(252, 350, 8):
        d.line([(x, 60), (x, 330)], fill=(190, 215, 235), width=2)
    d.ellipse([180, 300, 420, 380], fill=(100, 160, 190))


def _j9(d):     # 돌하르방과 노을
    vgrad(d, (0, 0, W, 250), (250, 150, 90), (250, 210, 150), 16)
    d.ellipse([260, 170, 340, 250], fill=(255, 200, 90))
    c = (80, 80, 85)
    d.rounded_rectangle([90, 150, 170, 330], 30, fill=c)
    d.ellipse([85, 90, 175, 180], fill=c); d.rectangle([80, 80, 180, 105], fill=c)
    d.ellipse([105, 125, 120, 140], fill=(50, 50, 55)); d.ellipse([140, 125, 155, 140], fill=(50, 50, 55))


# ------------------------------------------------------------------ 명화 느낌 (280x340)
PW, PH = 280, 340


def frame(im, d, title):
    d.rectangle([0, 0, PW - 1, PH - 1], outline=(120, 90, 40), width=8)
    f = font(14)
    w = d.textlength(title, font=f)
    d.rectangle([(PW - w) / 2 - 6, PH - 30, (PW + w) / 2 + 6, PH - 10], fill=(245, 240, 225))
    d.text(((PW - w) / 2, PH - 30), title, font=f, fill=(60, 50, 40))


def _starry(name):
    im = Image.new('RGB', (PW, PH), (25, 45, 110))
    d = ImageDraw.Draw(im)
    for k in range(40):                                                             # 소용돌이 하늘
        cx, cy = 90 + 100 * (k % 2), 110
        r = 10 + k * 3
        d.arc([cx - r, cy - r * 0.6, cx + r, cy + r * 0.6], k * 25, k * 25 + 200, fill=random.choice([(70, 110, 190), (140, 170, 220), (40, 70, 150)]), width=3)
    for x, y in ((40, 40), (230, 60), (150, 30), (60, 170), (220, 170)):
        for r, c in ((18, (250, 230, 120)), (10, (255, 250, 200))):
            d.ellipse([x - r, y - r, x + r, y + r], fill=c)
    d.polygon([(0, 260), (70, 220), (140, 240), (220, 215), (PW, 235), (PW, PH), (0, PH)], fill=(30, 60, 70))
    d.polygon([(30, PH), (45, 120), (60, PH)], fill=(20, 30, 25))                   # 나무
    frame(im, d, '별이 빛나는 밤 풍')
    save(im, name)


def _mondrian(name):
    im = Image.new('RGB', (PW, PH), (245, 242, 235))
    d = ImageDraw.Draw(im)
    for box, c in (([8, 8, 150, 170], (220, 40, 40)), ([200, 220, 272, 332], (40, 70, 170)), ([8, 250, 90, 332], (245, 205, 40)), ([200, 8, 272, 90], (245, 205, 40))):
        d.rectangle(box, fill=c)
    for x in (150, 200, 90):
        d.rectangle([x, 0, x + 8, PH], fill=(20, 20, 20))
    for y in (170, 90, 250):
        d.rectangle([0, y, PW, y + 8], fill=(20, 20, 20))
    frame(im, d, '빨강 · 파랑 · 노랑의 구성 풍')
    save(im, name, colors=16)


def _waterlily(name):
    im = Image.new('RGB', (PW, PH))
    d = ImageDraw.Draw(im)
    vgrad(d, (0, 0, PW, PH), (120, 160, 190), (60, 110, 120), 16)
    for _ in range(500):                                                            # 붓 터치
        x, y = random.randint(0, PW), random.randint(0, PH)
        d.line([(x, y), (x + random.randint(4, 12), y + random.randint(-2, 2))], fill=random.choice([(140, 180, 200), (90, 140, 150), (170, 200, 210), (80, 120, 130)]), width=2)
    for _ in range(9):
        x, y = random.randint(20, PW - 60), random.randint(30, PH - 80)
        d.ellipse([x, y, x + 50, y + 18], fill=(70, 130, 70))
        d.ellipse([x + 18, y - 4, x + 32, y + 8], fill=random.choice([(240, 170, 190), (250, 240, 240)]))
    frame(im, d, '수련 풍')
    save(im, name)


def _circles(name):
    im = Image.new('RGB', (PW, PH), (40, 40, 50))
    d = ImageDraw.Draw(im)
    cols = [(230, 80, 60), (250, 200, 60), (70, 150, 220), (120, 200, 120), (200, 110, 200), (245, 245, 240)]
    for r in range(4):
        for k in range(3):
            cx, cy = 50 + k * 90, 45 + r * 75
            for i, rr in enumerate(range(36, 0, -9)):
                c = cols[(r * 3 + k + i) % len(cols)]
                d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=c)
    frame(im, d, '동심원 풍')
    save(im, name, colors=32)


if __name__ == '__main__':
    dog('dog.gif', (235, 205, 150), (190, 140, 90), (150, 200, 110), (80, 140, 60), '강아지')
    dog('dog2.gif', (210, 150, 90), (170, 110, 60), (140, 160, 190), (90, 100, 130), '강아지 2')
    cat('cat.gif', (245, 240, 235), (60, 60, 60), (200, 150, 150), (140, 100, 100), '고양이', yawn=True)
    cat('cat2.gif', (240, 170, 90), (200, 120, 50), (150, 200, 120), (90, 150, 70), '고양이 2')
    rabbit()
    for fn, t, f in (('froyo.gif', 'Froyo', _froyo), ('gingerbread.gif', 'Gingerbread', _ginger), ('honeycomb.gif', 'Honeycomb', _honey),
                     ('icecream.gif', 'Ice Cream', _icecream), ('jellybean.gif', 'Jelly Bean', _jelly), ('kitkat.gif', 'KitKat', _kitkat),
                     ('lollipop.gif', 'Lollipop', _lolli), ('marshmallow.gif', 'Marshmallow', _marsh), ('nougat.gif', 'Nougat', _nougat)):
        icon(fn, t, f)
    scenes = [_j1, _j2, _j3, _j4, _j5, _j6, _j7, _j8, _j9]
    titles = ['바다와 섬', '하늘에서 본 섬', '들꽃 언덕', '해돋이 봉우리', '눈 덮인 산', '야자수 해변', '노란 꽃밭', '폭포', '노을과 돌하르방']
    for i, (fn, t) in enumerate(zip(scenes, titles)):
        land('jeju%d.gif' % (i + 1), '제주 %d · %s' % (i + 1, t), ((70, 130, 210), (190, 220, 245)), ((40, 90, 160), (15, 40, 90)), fn)
    _starry('painting1.gif')
    _mondrian('painting2.gif')
    _waterlily('painting3.gif')
    _circles('painting4.gif')
