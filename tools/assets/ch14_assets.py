"""Chapter 14 (미니 프로젝트) 예제 그림 만들기

    python tools/assets/ch14_assets.py

- assets/JPG/picture01.jpg ~ picture04.jpg : [프로젝트 1] 미니 포토샵에서 열어 볼 사진 (직접 그린 그림)
- assets/game/ship02.png, monster01~10.png, missile.png : [프로젝트 2] 슈팅 게임 그림 (배경 투명 PNG)

교재 그림(저작권)을 쓰지 않고 Pillow 로 직접 그린다. 난수 씨앗을 고정해서 항상 같은 그림이 나온다.
"""
import math
import os
import random

from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'assets')
JPG = os.path.join(ROOT, 'JPG')
GAME = os.path.join(ROOT, 'game')
os.makedirs(JPG, exist_ok=True)
os.makedirs(GAME, exist_ok=True)

S = 3  # 크게 그린 뒤 줄여서 부드럽게(안티에일리어싱)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(len(a)))


def vgrad(img, box, top, bottom):
    d = ImageDraw.Draw(img)
    x0, y0, x1, y1 = box
    for y in range(y0, y1):
        d.line([(x0, y), (x1, y)], fill=lerp(top, bottom, (y - y0) / max(1, (y1 - y0 - 1))))


def noise(img, amount, seed):
    rnd = random.Random(seed)
    px = img.load()
    w, h = img.size
    for _ in range(w * h // 3):
        x, y = rnd.randrange(w), rnd.randrange(h)
        r, g, b = px[x, y][:3]
        n = rnd.randint(-amount, amount)
        px[x, y] = (max(0, min(255, r + n)), max(0, min(255, g + n)), max(0, min(255, b + n)))


def save_jpg(img, name):
    img.save(os.path.join(JPG, name), quality=86, optimize=True)


# ---------------------------------------------------------------- 사진 1: 산과 호수 풍경
def picture01():
    W, H = 320, 240
    im = Image.new('RGB', (W * S, H * S))
    d = ImageDraw.Draw(im)
    vgrad(im, (0, 0, W * S, 150 * S), (90, 160, 230), (205, 230, 250))
    d.ellipse([235 * S, 25 * S, 275 * S, 65 * S], fill=(255, 236, 150))
    for cx, cy, r in [(60, 40, 16), (82, 36, 20), (104, 42, 14), (180, 60, 12), (198, 56, 16), (214, 62, 11)]:
        d.ellipse([(cx - r) * S, (cy - r) * S, (cx + r) * S, (cy + r) * S], fill=(250, 250, 252))
    # 먼 산 · 가까운 산
    d.polygon([(0, 150 * S), (0, 110 * S), (60 * S, 70 * S), (120 * S, 115 * S), (170 * S, 80 * S), (240 * S, 125 * S),
               (290 * S, 90 * S), (320 * S, 110 * S), (320 * S, 150 * S)], fill=(120, 140, 170))
    d.polygon([(60 * S, 70 * S), (72 * S, 78 * S), (50 * S, 78 * S)], fill=(240, 244, 250))
    d.polygon([(170 * S, 80 * S), (184 * S, 90 * S), (158 * S, 89 * S)], fill=(240, 244, 250))
    d.polygon([(0, 155 * S), (0, 130 * S), (80 * S, 100 * S), (150 * S, 135 * S), (230 * S, 110 * S), (320 * S, 140 * S),
               (320 * S, 155 * S)], fill=(60, 120, 70))
    # 호수
    vgrad(im, (0, 150 * S, W * S, 200 * S), (110, 170, 215), (60, 110, 170))
    d = ImageDraw.Draw(im)
    for i in range(14):
        y = (156 + i * 3) * S
        x = (20 + (i * 53) % 280) * S
        d.line([(x, y), (x + 30 * S, y)], fill=(170, 210, 240), width=S)
    # 풀밭 · 꽃 · 나무
    vgrad(im, (0, 200 * S, W * S, H * S), (90, 160, 60), (50, 110, 40))
    d = ImageDraw.Draw(im)
    rnd = random.Random(1)
    for _ in range(40):
        x, y = rnd.randrange(W), rnd.randrange(205, H)
        c = rnd.choice([(255, 90, 110), (255, 220, 70), (250, 250, 250), (200, 110, 230)])
        d.ellipse([(x - 2) * S, (y - 2) * S, (x + 2) * S, (y + 2) * S], fill=c)
    for tx, th in [(28, 70), (58, 55), (285, 75)]:
        d.rectangle([(tx - 3) * S, (215 - 20) * S, (tx + 3) * S, 218 * S], fill=(110, 70, 40))
        d.polygon([(tx * S, (215 - th) * S), ((tx - 18) * S, 200 * S), ((tx + 18) * S, 200 * S)], fill=(35, 95, 50))
    # 작은 집
    d.rectangle([200 * S, 185 * S, 240 * S, 215 * S], fill=(240, 220, 180))
    d.polygon([(195 * S, 187 * S), (220 * S, 168 * S), (245 * S, 187 * S)], fill=(190, 60, 50))
    d.rectangle([215 * S, 198 * S, 225 * S, 215 * S], fill=(120, 80, 50))
    d.rectangle([203 * S, 192 * S, 211 * S, 200 * S], fill=(140, 200, 240))
    im = im.resize((W, H), Image.LANCZOS)
    noise(im, 6, 11)
    save_jpg(im, 'picture01.jpg')


# ---------------------------------------------------------------- 사진 2: 코스모스 꽃밭 (세로 사진)
def picture02():
    W, H = 240, 300
    im = Image.new('RGB', (W * S, H * S))
    vgrad(im, (0, 0, W * S, H * S), (60, 90, 55), (25, 50, 30))
    d = ImageDraw.Draw(im)
    rnd = random.Random(2)
    for _ in range(90):  # 흐릿한 배경 잎
        x, y = rnd.randrange(W), rnd.randrange(H)
        r = rnd.randint(4, 14)
        c = rnd.choice([(70, 110, 60), (90, 130, 70), (40, 70, 40), (110, 140, 90)])
        d.ellipse([(x - r) * S, (y - r) * S, (x + r) * S, (y + r) * S], fill=c)
    im = im.filter(ImageFilter.GaussianBlur(5 * S))
    d = ImageDraw.Draw(im)
    flowers = [(80, 80, 30, (235, 130, 190)), (165, 130, 26, (250, 160, 210)), (95, 190, 34, (220, 100, 170)),
               (185, 235, 22, (245, 190, 225)), (45, 260, 18, (230, 120, 180))]
    for fx, fy, r, col in flowers:
        d.line([(fx * S, (fy + r // 2) * S), ((fx + 8) * S, H * S)], fill=(70, 120, 50), width=3 * S)
    for fx, fy, r, col in flowers:
        for k in range(8):
            a = k * math.pi / 4
            px, py = fx + math.cos(a) * r * 0.62, fy + math.sin(a) * r * 0.62
            pr = r * 0.42
            d.ellipse([(px - pr) * S, (py - pr) * S, (px + pr) * S, (py + pr) * S], fill=col,
                      outline=lerp(col, (120, 40, 90), 0.4), width=S)
        cr = r * 0.25
        d.ellipse([(fx - cr) * S, (fy - cr) * S, (fx + cr) * S, (fy + cr) * S], fill=(250, 200, 40))
        d.ellipse([(fx - cr / 2) * S, (fy - cr / 2) * S, (fx + cr / 2) * S, (fy + cr / 2) * S], fill=(210, 140, 20))
    im = im.resize((W, H), Image.LANCZOS)
    noise(im, 5, 12)
    save_jpg(im, 'picture02.jpg')


# ---------------------------------------------------------------- 사진 3: 호수의 해넘이 (가로로 긴 사진)
def picture03():
    W, H = 320, 200
    im = Image.new('RGB', (W * S, H * S))
    vgrad(im, (0, 0, W * S, 70 * S), (70, 90, 150), (240, 150, 90))
    vgrad(im, (0, 70 * S, W * S, 125 * S), (240, 150, 90), (255, 200, 110))
    d = ImageDraw.Draw(im)
    rnd = random.Random(3)
    for _ in range(60):  # 조각구름
        x, y = rnd.randrange(W), rnd.randrange(10, 80)
        w = rnd.randint(8, 22)
        d.ellipse([(x - w) * S, (y - 3) * S, (x + w) * S, (y + 3) * S], fill=(250, 210, 190) if y > 45 else (170, 150, 180))
    d.ellipse([140 * S, 95 * S, 180 * S, 135 * S], fill=(255, 235, 170))
    # 도시 실루엣
    x = 0
    while x < W:
        bw, bh = rnd.randint(10, 26), rnd.randint(8, 38)
        d.rectangle([x * S, (125 - bh) * S, (x + bw) * S, 126 * S], fill=(45, 35, 55))
        x += bw
    # 물
    vgrad(im, (0, 126 * S, W * S, H * S), (230, 140, 80), (40, 40, 70))
    d = ImageDraw.Draw(im)
    for i in range(30):
        y = rnd.randint(128, H - 2)
        cx = 160 + rnd.randint(-40, 40) * (y - 120) / 60
        w = rnd.randint(6, 26)
        d.line([((cx - w) * S, y * S), ((cx + w) * S, y * S)], fill=(255, 220, 150), width=S)
    d.polygon([(220 * S, 160 * S), (300 * S, 160 * S), (290 * S, 168 * S), (228 * S, 168 * S)], fill=(35, 25, 40))
    d.line([(262 * S, 160 * S), (262 * S, 135 * S)], fill=(35, 25, 40), width=2 * S)
    im = im.resize((W, H), Image.LANCZOS)
    noise(im, 5, 13)
    save_jpg(im, 'picture03.jpg')


# ---------------------------------------------------------------- 사진 4: 고양이 얼굴 (정사각형)
def picture04():
    W = H = 260
    im = Image.new('RGB', (W * S, H * S))
    vgrad(im, (0, 0, W * S, H * S), (180, 215, 240), (240, 225, 200))
    d = ImageDraw.Draw(im)
    for i in range(0, W, 26):  # 벽지 줄무늬
        d.rectangle([i * S, 0, (i + 8) * S, H * S], fill=(200, 225, 245))
    c = (240, 160, 70)
    dk = (190, 110, 40)
    d.polygon([(55 * S, 110 * S), (70 * S, 30 * S), (120 * S, 80 * S)], fill=c)
    d.polygon([(205 * S, 110 * S), (190 * S, 30 * S), (140 * S, 80 * S)], fill=c)
    d.polygon([(70 * S, 95 * S), (76 * S, 50 * S), (105 * S, 80 * S)], fill=(250, 190, 190))
    d.polygon([(190 * S, 95 * S), (184 * S, 50 * S), (155 * S, 80 * S)], fill=(250, 190, 190))
    d.ellipse([40 * S, 60 * S, 220 * S, 230 * S], fill=c)
    for k in range(3):  # 이마 줄무늬
        d.line([((110 + k * 20) * S, 68 * S), ((115 + k * 15) * S, 100 * S)], fill=dk, width=5 * S)
    d.ellipse([90 * S, 150 * S, 170 * S, 215 * S], fill=(255, 240, 225))
    for ex in (95, 165):
        d.ellipse([(ex - 20) * S, 115 * S, (ex + 20) * S, 150 * S], fill=(255, 255, 255))
        d.ellipse([(ex - 12) * S, 118 * S, (ex + 12) * S, 148 * S], fill=(90, 170, 60))
        d.ellipse([(ex - 5) * S, 122 * S, (ex + 5) * S, 144 * S], fill=(20, 20, 20))
        d.ellipse([(ex - 9) * S, 123 * S, (ex - 3) * S, 129 * S], fill=(255, 255, 255))
    d.polygon([(122 * S, 162 * S), (138 * S, 162 * S), (130 * S, 172 * S)], fill=(230, 110, 130))
    d.arc([112 * S, 162 * S, 130 * S, 185 * S], 0, 180, fill=(80, 50, 40), width=2 * S)
    d.arc([130 * S, 162 * S, 148 * S, 185 * S], 0, 180, fill=(80, 50, 40), width=2 * S)
    for sgn in (-1, 1):
        for k in range(3):
            y = 170 + k * 9
            d.line([((130 + sgn * 25) * S, y * S), ((130 + sgn * 90) * S, (y - 10 + k * 10) * S)], fill=(90, 70, 60), width=S)
    im = im.resize((W, H), Image.LANCZOS)
    noise(im, 4, 14)
    save_jpg(im, 'picture04.jpg')


# ---------------------------------------------------------------- 게임: 우주선
def ship02():
    W, H = 48, 64
    im = Image.new('RGBA', (W * S * 2, H * S * 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    k = S * 2
    body, dark = (185, 45, 95), (70, 20, 45)
    d.polygon([(4 * k, 46 * k), (14 * k, 30 * k), (16 * k, 50 * k)], fill=body, outline=dark, width=k)
    d.polygon([(44 * k, 46 * k), (34 * k, 30 * k), (32 * k, 50 * k)], fill=body, outline=dark, width=k)
    d.polygon([(18 * k, 50 * k), (24 * k, 62 * k), (30 * k, 50 * k)], fill=(250, 150, 40))
    d.polygon([(21 * k, 50 * k), (24 * k, 57 * k), (27 * k, 50 * k)], fill=(255, 230, 90))
    d.ellipse([12 * k, 2 * k, 36 * k, 54 * k], fill=body, outline=dark, width=k)
    d.ellipse([17 * k, 16 * k, 31 * k, 30 * k], fill=(230, 240, 250), outline=dark, width=k)
    d.ellipse([20 * k, 19 * k, 28 * k, 27 * k], fill=(120, 190, 230))
    im = im.resize((W, H), Image.LANCZOS)
    im.save(os.path.join(GAME, 'ship02.png'), optimize=True)


# ---------------------------------------------------------------- 게임: 우주괴물 10종
MONSTERS = [
    ((80, 120, 210), 'horns'), ((200, 50, 50), 'beard'), ((170, 190, 40), 'scar'), ((170, 90, 60), 'brick'),
    ((160, 100, 80), 'bandana'), ((190, 190, 200), 'halo'), ((40, 60, 180), 'plain'), ((90, 80, 170), 'hat'),
    ((235, 235, 240), 'crown'), ((90, 110, 40), 'beret'),
]


def monster(idx, color, deco):
    W, H = 60, 52
    k = S * 2
    im = Image.new('RGBA', (W * k, H * k), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    dark = lerp(color, (0, 0, 0), 0.45)
    light = lerp(color, (255, 255, 255), 0.45)
    # 그림자
    d.ellipse([8 * k, 46 * k, 52 * k, 51 * k], fill=(0, 0, 0, 70))
    # 몸통 (유령 모양)
    d.ellipse([8 * k, 10 * k, 52 * k, 44 * k], fill=color, outline=dark, width=k)
    d.rectangle([8 * k, 27 * k, 52 * k, 44 * k], fill=color)
    d.line([(8 * k, 27 * k), (8 * k, 45 * k)], fill=dark, width=k)
    d.line([(52 * k, 27 * k), (52 * k, 45 * k)], fill=dark, width=k)
    for i in range(4):  # 아래쪽 물결
        x0 = 8 + i * 11
        d.pieslice([x0 * k, 39 * k, (x0 + 11) * k, 50 * k], 0, 180, fill=color, outline=dark, width=k)
    d.ellipse([15 * k, 14 * k, 27 * k, 22 * k], fill=light)  # 반짝임
    if deco == 'brick':
        for row in range(4):
            y = 18 + row * 7
            d.line([(10 * k, y * k), (50 * k, y * k)], fill=dark, width=k)
            for col in range(5):
                x = 10 + col * 9 + (4 if row % 2 else 0)
                d.line([(x * k, y * k), (x * k, (y + 7) * k)], fill=dark, width=k)
    # 눈
    for ex in (24, 36):
        d.ellipse([(ex - 6) * k, 18 * k, (ex + 6) * k, 31 * k], fill=(255, 255, 255), outline=(40, 40, 40), width=k)
        d.ellipse([(ex - 2) * k, 22 * k, (ex + 3) * k, 28 * k], fill=(20, 20, 20))
    if deco in ('crown',):
        d.polygon([(22 * k, 36 * k), (38 * k, 36 * k), (33 * k, 50 * k), (27 * k, 50 * k)], fill=(220, 60, 90))
    else:
        d.arc([23 * k, 30 * k, 37 * k, 38 * k], 20, 160, fill=(60, 20, 20), width=k)
    # 장식
    if deco == 'horns':
        d.polygon([(10 * k, 18 * k), (2 * k, 4 * k), (18 * k, 12 * k)], fill=(150, 170, 230), outline=dark)
        d.polygon([(50 * k, 18 * k), (58 * k, 4 * k), (42 * k, 12 * k)], fill=(150, 170, 230), outline=dark)
    elif deco == 'beard':
        d.polygon([(18 * k, 34 * k), (42 * k, 34 * k), (30 * k, 47 * k)], fill=(245, 245, 245))
        d.pieslice([12 * k, 2 * k, 48 * k, 26 * k], 180, 360, fill=(230, 60, 60))
        d.ellipse([44 * k, 2 * k, 52 * k, 10 * k], fill=(255, 255, 255))
    elif deco == 'scar':
        d.line([(16 * k, 16 * k), (44 * k, 30 * k)], fill=(200, 40, 40), width=2 * k)
        d.line([(0, 34 * k), (14 * k, 30 * k)], fill=(120, 120, 130), width=k)
    elif deco == 'bandana':
        d.pieslice([8 * k, 6 * k, 52 * k, 30 * k], 180, 360, fill=(200, 40, 40))
        d.polygon([(50 * k, 14 * k), (58 * k, 8 * k), (58 * k, 20 * k)], fill=(200, 40, 40))
        d.line([(18 * k, 18 * k), (42 * k, 30 * k)], fill=(20, 20, 20), width=k)
    elif deco == 'halo':
        d.ellipse([16 * k, 1 * k, 44 * k, 8 * k], outline=(230, 200, 40), width=2 * k)
        d.polygon([(8 * k, 24 * k), (0, 18 * k), (2 * k, 30 * k)], fill=(250, 250, 250), outline=(150, 150, 160))
        d.polygon([(52 * k, 24 * k), (60 * k, 18 * k), (58 * k, 30 * k)], fill=(250, 250, 250), outline=(150, 150, 160))
    elif deco == 'hat':
        d.ellipse([6 * k, 9 * k, 54 * k, 16 * k], fill=(140, 110, 70))
        d.rectangle([18 * k, 2 * k, 42 * k, 12 * k], fill=(140, 110, 70))
        d.line([(10 * k, 36 * k), (50 * k, 36 * k)], fill=(210, 40, 40), width=2 * k)
    elif deco == 'crown':
        d.polygon([(20 * k, 12 * k), (20 * k, 2 * k), (25 * k, 7 * k), (30 * k, 1 * k), (35 * k, 7 * k), (40 * k, 2 * k),
                   (40 * k, 12 * k)], fill=(245, 200, 40), outline=(180, 130, 20))
    elif deco == 'beret':
        d.ellipse([14 * k, 3 * k, 50 * k, 14 * k], fill=(120, 60, 40))
        d.ellipse([22 * k, 34 * k, 38 * k, 40 * k], fill=(40, 170, 60))
    im = im.resize((W, H), Image.LANCZOS)
    im.save(os.path.join(GAME, 'monster%02d.png' % idx), optimize=True)


# ---------------------------------------------------------------- 게임: 미사일
def missile():
    W, H = 12, 28
    k = S * 2
    im = Image.new('RGBA', (W * k, H * k), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.polygon([(6 * k, 0), (8 * k, 4 * k), (4 * k, 4 * k)], fill=(250, 200, 60))
    d.rectangle([5 * k, 3 * k, 7 * k, 20 * k], fill=(200, 40, 50))
    d.rectangle([1 * k, 18 * k, 11 * k, 20 * k], fill=(40, 30, 30))
    for x in (1, 5, 9):
        d.rectangle([x * k, 20 * k, (x + 2) * k, 26 * k], fill=(40, 30, 30))
    im = im.resize((W, H), Image.LANCZOS)
    im.save(os.path.join(GAME, 'missile.png'), optimize=True)


if __name__ == '__main__':
    picture01()
    picture02()
    picture03()
    picture04()
    ship02()
    for i, (c, deco) in enumerate(MONSTERS, 1):
        monster(i, c, deco)
    missile()
    total = 0
    for folder in (JPG, GAME):
        for f in sorted(os.listdir(folder)):
            p = os.path.join(folder, f)
            total += os.path.getsize(p)
            print('%-16s %6.1f KB' % (f, os.path.getsize(p) / 1024))
    print('합계 %.1f KB' % (total / 1024))
