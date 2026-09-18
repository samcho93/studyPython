/* Chapter 05. 조건문 (파이썬 for Beginner 3판 Ch05) */
(function () {
  /* ================================================================
     SVG 그리기 도우미 (순서도 · 코드 상자)
     ================================================================ */
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const MK = '<defs><marker id="c5ah" markerWidth="16" markerHeight="16" refX="14" refY="8" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L16,8 L0,16 z" fill="var(--muted)"/></marker></defs>';
  const SVG = (w, h, label, body, style) => `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="${label}"${style ? ` style="${style}"` : ''}>${MK}${body}</svg>`;

  // 글자 ('|' 로 줄바꿈)
  const T = (x, y, s, o = {}) => {
    const lines = String(s).split('|');
    const size = o.size || 22, lh = Math.round(size * 1.3);
    const y0 = Math.round(y - ((lines.length - 1) * lh) / 2 + size * 0.36);
    const st = (o.mono ? "font-family:Consolas,'D2Coding',monospace;" : '') + (o.bold ? 'font-weight:700;' : '') + `font-size:${size}px;fill:${o.fill || 'var(--fg)'}`;
    return `<text x="${x}" y="${y0}" text-anchor="${o.anchor || 'middle'}" style="${st}">` +
      lines.map((l, i) => `<tspan x="${x}" dy="${i ? lh : 0}">${esc(l)}</tspan>`).join('') + '</text>';
  };
  const BOX = (cx, cy, w, h, s, o = {}) =>
    `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="10" fill="var(--card)" stroke="${o.stroke || 'var(--accent)'}" stroke-width="3"/>` + T(cx, cy, s, o);
  const DIA = (cx, cy, w, h, s, o = {}) =>
    `<polygon points="${cx},${cy - h / 2} ${cx + w / 2},${cy} ${cx},${cy + h / 2} ${cx - w / 2},${cy}" fill="var(--card)" stroke="${o.stroke || 'var(--warn)'}" stroke-width="3"/>` + T(cx, cy, s, o);
  const ARR = (d, c) => `<path d="${d}" fill="none" stroke="${c || 'var(--muted)'}" stroke-width="3" marker-end="url(#c5ah)"/>`;
  const LINE = (d, c) => `<path d="${d}" fill="none" stroke="${c || 'var(--muted)'}" stroke-width="3"/>`;
  const YES = (x, y, a) => T(x, y, '참', { fill: 'var(--ok)', bold: true, anchor: a || 'start', size: 20 });
  const NO = (x, y, a) => T(x, y, '거짓', { fill: 'var(--danger)', bold: true, anchor: a || 'start', size: 20 });

  // 코드 상자: 줄 앞 공백 수만큼 들여 씀
  const LH = 38;
  const CODE = (x, y, w, lines, o = {}) => {
    const h = 30 + lines.length * LH;
    let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>`;
    lines.forEach((l, i) => {
      const ind = l.length - l.replace(/^ +/, '').length;
      if (l.trim()) s += T(x + 20 + ind * 12.2, y + 34 + i * LH, l.trim(), { mono: true, anchor: 'start', size: o.size || 21, fill: o.fill });
    });
    return s;
  };
  // 코드 상자 안의 i0~i1 줄 강조
  const HL = (x, y, w, i0, i1, color) =>
    `<rect x="${x + 8}" y="${y + 34 + i0 * LH - 26}" width="${w - 16}" height="${(i1 - i0 + 1) * LH - 2}" rx="6" fill="${color}" fill-opacity="0.16" stroke="${color}" stroke-width="2" stroke-dasharray="6 5"/>`;

  /* ---------- 그림 5-1 if 문의 형식과 순서도 ---------- */
  const FIG_IF = SVG(1280, 500, 'if 문의 형식과 순서도',
    T(250, 110, '형식', { bold: true, size: 24 }) +
    CODE(60, 140, 380, ['if 조건식 :', '    실행할 문장']) +
    T(250, 290, '조건식 뒤에 콜론( : )', { size: 20, fill: 'var(--muted)' }) +
    T(250, 322, '실행할 문장은 들여쓰기', { size: 20, fill: 'var(--muted)' }) +
    ARR('M820,20 L820,70') +
    DIA(820, 120, 320, 100, 'if 조건식') +
    ARR('M820,170 L820,240') + YES(836, 205) +
    BOX(820, 275, 320, 70, '실행할 문장') +
    ARR('M980,120 L1100,120 L1100,400 L824,400') + NO(995, 100) +
    ARR('M820,310 L820,480'));

  /* ---------- 그림 5-2 if 문 실행 과정 ---------- */
  const FIG_IF_RUN = SVG(1280, 560, 'if 문 실행 과정',
    CODE(40, 190, 400, ['a = 99', 'if a < 100 :', '    print("100보다 작군요.")'], { size: 20 }) +
    BOX(760, 50, 340, 60, 'a에 99 대입') +
    ARR('M760,80 L760,125') +
    DIA(760, 190, 360, 130, 'a가 100보다|작은가?') +
    ARR('M760,255 L760,315', 'var(--ok)') + YES(776, 288) +
    BOX(760, 350, 400, 66, '"100보다 작군요." 출력', { stroke: 'var(--ok)' }) +
    ARR('M760,383 L760,475') +
    BOX(760, 505, 340, 60, '프로그램 종료') +
    ARR('M940,190 L1090,190 L1090,430 L764,430') + NO(955, 170) +
    T(240, 380, 'a = 99 → 조건이 참', { size: 20, fill: 'var(--ok)', bold: true }) +
    T(240, 412, '초록색 길로 실행된다', { size: 20, fill: 'var(--muted)' }));

  /* ---------- Code05-01 · 05-02 블록 비교 ---------- */
  const B1 = ['a = 200', '', 'if a < 100 :', '    print("100보다 작군요.")', 'print("거짓이므로 이 문장은 안 보이겠죠?")', '', 'print("프로그램 끝")'];
  const B2 = ['a = 200', '', 'if a < 100 :', '    print("100보다 작군요.")', '    print("거짓이므로 이 문장은 안 보이겠죠?")', '', 'print("프로그램 끝")'];
  const FIG_BLOCK = SVG(1280, 470, '들여쓰기로 정해지는 if 블록',
    T(320, 30, 'Code05-01 — 5행은 들여쓰지 않음', { bold: true, size: 22 }) +
    CODE(20, 55, 600, B1, { size: 18 }) + HL(20, 55, 600, 3, 3, 'var(--accent)') +
    T(320, 400, 'if 블록은 4행 한 줄뿐', { size: 20, fill: 'var(--accent)', bold: true }) +
    T(320, 432, '5행은 조건과 상관없이 항상 실행', { size: 20, fill: 'var(--muted)' }) +
    T(960, 30, 'Code05-02 — 4~5행 모두 들여씀', { bold: true, size: 22 }) +
    CODE(660, 55, 600, B2, { size: 18 }) + HL(660, 55, 600, 3, 4, 'var(--accent2)') +
    T(960, 400, 'if 블록은 4~5행 두 줄', { size: 20, fill: 'var(--accent2)', bold: true }) +
    T(960, 432, '조건이 거짓이면 두 줄 모두 건너뜀', { size: 20, fill: 'var(--muted)' }));

  /* ---------- 그림 5-3 if~else 문의 형식과 순서도 ---------- */
  const FIG_IFELSE = SVG(1280, 470, 'if~else 문의 형식과 순서도',
    T(210, 90, '형식', { bold: true, size: 24 }) +
    CODE(30, 120, 360, ['if 조건식 :', '    실행할 문장 1', 'else :', '    실행할 문장 2']) +
    ARR('M700,15 L700,55') +
    DIA(700, 105, 320, 100, 'if 조건식') +
    ARR('M700,155 L700,225') + YES(716, 192) +
    BOX(700, 260, 280, 70, '실행할 문장 1') +
    ARR('M860,105 L1060,105 L1060,225') + NO(880, 85) +
    BOX(1060, 260, 280, 70, '실행할 문장 2') +
    ARR('M1060,295 L1060,360 L704,360') +
    ARR('M700,295 L700,455'));

  /* ---------- 그림 5-4 Code05-03 실행 과정 ---------- */
  const FIG_0503 = SVG(1280, 590, 'Code05-03 실행 과정',
    CODE(20, 150, 420, ['a = 200', '', 'if a < 100 :', '    print("100보다 작군요.")', 'else :', '    print("100보다 크군요.")'], { size: 19 }) +
    BOX(700, 45, 300, 56, 'a에 200 대입') +
    ARR('M700,73 L700,115') +
    DIA(700, 180, 340, 130, 'a가 100보다|작은가?') +
    ARR('M700,245 L700,317') + YES(716, 285) +
    BOX(700, 350, 340, 66, '"100보다 작군요." 출력', { stroke: 'var(--line)', fill: 'var(--muted)' }) +
    ARR('M870,180 L1075,180 L1075,317', 'var(--danger)') + NO(890, 160) +
    BOX(1075, 350, 340, 66, '"100보다 크군요." 출력', { stroke: 'var(--danger)' }) +
    ARR('M1075,383 L1075,440 L704,440', 'var(--danger)') +
    ARR('M700,383 L700,510') +
    BOX(700, 545, 300, 56, '프로그램 종료') +
    T(230, 450, 'a = 200 → 조건이 거짓', { size: 20, fill: 'var(--danger)', bold: true }) +
    T(230, 482, '빨간 길(else 블록)로 실행', { size: 20, fill: 'var(--muted)' }));

  /* ---------- 그림 5-5 중첩 if 문의 형식과 순서도 ---------- */
  const FIG_NESTED = SVG(1280, 600, '중첩 if 문의 형식과 순서도',
    T(215, 80, '형식', { bold: true, size: 24 }) +
    CODE(20, 110, 400, ['if 조건식 1 :', '    if 조건식 2 :', '        실행할 문장 1', '    else :', '        실행할 문장 2', 'else :', '    실행할 문장 3'], { size: 20 }) +
    ARR('M780,10 L780,45') +
    DIA(780, 90, 280, 90, '조건식 1') +
    ARR('M780,135 L780,195') + YES(796, 165) +
    DIA(780, 240, 280, 90, '조건식 2') +
    ARR('M920,90 L1130,90 L1130,375') + NO(935, 70) +
    ARR('M640,240 L540,240 L540,375') + YES(600, 220, 'middle') +
    ARR('M780,285 L780,375') + NO(796, 330) +
    BOX(540, 410, 210, 70, '실행할 문장 1') +
    BOX(780, 410, 210, 70, '실행할 문장 2') +
    BOX(1130, 410, 210, 70, '실행할 문장 3') +
    LINE('M540,445 L540,500 L1130,500 L1130,445') + LINE('M780,445 L780,500') +
    ARR('M780,500 L780,580'));

  /* ---------- 계단식(if~elif) 순서도 만들기 ---------- */
  function cascade(o) {
    const n = o.conds.length, dx = o.dx, dy = o.dy, x0 = o.x0, bw = o.bw, dw = o.dw;
    const y0 = 150;
    let s = BOX(x0, 50, o.startW || bw, 54, o.start) + ARR(`M${x0},77 L${x0},${y0 - 35}`);
    for (let i = 0; i < n; i++) {
      const cx = x0 + dx * i, cy = y0 + dy * i;
      s += DIA(cx, cy, dw, 70, o.conds[i], { size: 20 });
      s += ARR(`M${cx},${cy + 35} L${cx},${cy + dy - 27}`) + YES(cx + 10, cy + 50);
      s += ARR(`M${cx + dw / 2},${cy} L${cx + dx},${cy} L${cx + dx},${cy + dy - (i < n - 1 ? 35 : 27)}`) + NO(cx + dw / 2 + 8, cy - 18);
      s += BOX(cx, cy + dy, bw, 54, o.outs[i], { size: 20 });
    }
    s += BOX(x0 + dx * n, y0 + dy * n, bw, 54, o.outs[n], { size: 20 });
    const busY = y0 + dy * n + 70;
    for (let i = 0; i <= n; i++) {
      const x = x0 + dx * i, yb = (i < n ? y0 + dy * (i + 1) : y0 + dy * n) + 27;
      s += LINE(`M${x},${yb} L${x},${busY}`);
    }
    const mid = (x0 + x0 + dx * n) / 2;
    s += LINE(`M${x0},${busY} L${x0 + dx * n},${busY}`) + ARR(`M${mid},${busY} L${mid},${busY + 38}`);
    s += BOX(mid, busY + 65, o.endW || 380, 54, o.end, { size: 20 });
    return SVG(1280, busY + 100, o.label, s);
  }

  /* ---------- 그림 5-6 Code05-07 실행 과정 ---------- */
  const FIG_GRADE = cascade({
    label: 'Code05-07 실행 과정 (학점 계산 순서도)', x0: 150, dx: 235, dy: 85, bw: 180, dw: 200,
    start: 'score 값 입력', startW: 220,
    conds: ['score ≥ 90', 'score ≥ 80', 'score ≥ 70', 'score ≥ 60'],
    outs: ['"A" 출력', '"B" 출력', '"C" 출력', '"D" 출력', '"F" 출력'],
    end: '"학점입니다. ^^" 출력'
  });

  /* ---------- [프로그램 2] 순서도 ---------- */
  const FIG_CALC = cascade({
    label: '종합 계산기 순서도', x0: 250, dx: 420, dy: 110, bw: 380, dw: 250,
    start: 'select 입력 (1 또는 2)', startW: 320,
    conds: ['select == 1', 'select == 2'],
    outs: ['수식 입력 → eval() → 결과 출력', '두 수 입력 → for 로 합계 → 출력', '"1 또는 2만 입력해야…" 출력'],
    end: '프로그램 종료', endW: 300
  });

  /* ---------- elif 검사 과정 (score = 77) ---------- */
  const FIG_ELIF_TRACE = (() => {
    const rows = [
      ['if score >= 90 :', 'print("A")', '77 >= 90 → False', 'var(--danger)', '건너뜀'],
      ['elif score >= 80 :', 'print("B")', '77 >= 80 → False', 'var(--danger)', '건너뜀'],
      ['elif score >= 70 :', 'print("C")', '77 >= 70 → True', 'var(--ok)', '실행!'],
      ['elif score >= 60 :', 'print("D")', '검사하지 않음', 'var(--muted)', '—'],
      ['else :', 'print("F")', '검사하지 않음', 'var(--muted)', '—']
    ];
    let s = T(640, 30, 'score = 77 을 입력했을 때', { bold: true, size: 24 });
    rows.forEach((r, i) => {
      const y = 60 + i * 76, on = i === 2;
      s += `<rect x="40" y="${y}" width="1200" height="64" rx="10" fill="var(--card)" stroke="${r[3]}" stroke-width="${on ? 4 : 2}"${i > 2 ? ' stroke-dasharray="8 6" opacity="0.7"' : ''}/>`;
      s += T(70, y + 32, r[0], { mono: true, anchor: 'start', size: 22 });
      s += T(360, y + 32, r[1], { mono: true, anchor: 'start', size: 22, fill: on ? 'var(--ok)' : 'var(--muted)' });
      s += T(820, y + 32, r[2], { size: 22, fill: r[3], bold: i < 3 });
      s += T(1140, y + 32, r[4], { size: 22, fill: r[3], bold: on });
    });
    s += T(640, 470, '위에서부터 차례로 검사 → 처음으로 참인 블록 하나만 실행하고 나머지는 모두 건너뛴다', { size: 21, fill: 'var(--muted)' });
    return SVG(1280, 500, 'elif 검사 과정', s);
  })();

  /* ---------- 조건부 표현식 구조 ---------- */
  const FIG_TERNARY = (() => {
    const tk = [
      ['res =', 150, 'var(--line)', ''], ["'합격'", 150, 'var(--ok)', '② 참일 때의 값'], ['if', 80, 'var(--line)', ''],
      ['jumsu >= 60', 250, 'var(--warn)', '① 조건식 (먼저 계산)'], ['else', 100, 'var(--line)', ''], ["'불합격'", 170, 'var(--danger)', '③ 거짓일 때의 값']
    ];
    let x = 95, s = '';
    s += T(640, 40, "res = '합격' if jumsu >= 60 else '불합격'", { mono: true, size: 26, bold: true });
    tk.forEach((t) => {
      s += `<rect x="${x}" y="90" width="${t[1]}" height="70" rx="10" fill="var(--card)" stroke="${t[2]}" stroke-width="3"/>`;
      s += T(x + t[1] / 2, 125, t[0], { mono: true, size: 26 });
      if (t[3]) {
        s += LINE(`M${x + t[1] / 2},165 L${x + t[1] / 2},205`, t[2]);
        s += T(x + t[1] / 2, 230, t[3], { size: 21, fill: t[2], bold: true });
      }
      x += t[1] + 16;
    });
    s += T(640, 300, 'jumsu = 55 → 조건식이 False → 오른쪽 값 \'불합격\' 이 res 에 들어간다', { size: 21, fill: 'var(--muted)' });
    s += T(640, 335, '“값1 if 조건 else 값2” 전체가 하나의 값이 되는 식(expression)', { size: 21, fill: 'var(--muted)' });
    return SVG(1280, 360, '조건부 표현식의 구조', s);
  })();

  /* ---------- 반지름에 따른 색 (1~36) ---------- */
  const pick = (r) => (r % 6 === 0 ? 'red' : r % 5 === 0 ? 'orange' : r % 4 === 0 ? 'yellow' : r % 3 === 0 ? 'green' : r % 2 === 0 ? 'blue' : 'navy');
  const FIG_DOTS = (() => {
    let s = '';
    for (let r = 1; r <= 36; r++) {
      const i = r - 1, x = 90 + (i % 12) * 100, y = 70 + Math.floor(i / 12) * 125;
      s += `<circle cx="${x}" cy="${y}" r="30" fill="${pick(r)}" stroke="var(--line)" stroke-width="2"/>`;
      s += T(x, y + 52, String(r), { size: 20, bold: true });
    }
    const leg = [['red', '6의 배수'], ['orange', '5의 배수'], ['yellow', '4의 배수'], ['green', '3의 배수'], ['blue', '2의 배수'], ['navy', '나머지']];
    leg.forEach((l, i) => {
      const x = 80 + i * 200;
      s += `<circle cx="${x}" cy="435" r="14" fill="${l[0]}" stroke="var(--line)" stroke-width="2"/>` + T(x + 24, 435, l[1], { anchor: 'start', size: 20 });
    });
    return SVG(1280, 470, '반지름 1~36의 펜 색', s);
  })();

  /* ---------- [프로그램 1] 완성 화면 미리보기 ---------- */
  const FIG_RAINBOW = (() => {
    const pick2 = (r) => (pick(r) === 'navy' ? '#000080' : pick(r) === 'yellow' ? '#ffd400' : pick(r));
    let s = '<rect x="0" y="0" width="560" height="540" rx="8" fill="#ffffff" stroke="#999" stroke-width="2"/>';
    for (let r = 2; r <= 249; r += 3) s += `<circle cx="280" cy="${520 - r}" r="${r}" fill="none" stroke="${pick2(r)}" stroke-width="1.6"/>`;
    s += '<path d="M268,512 L292,520 L268,528 z" fill="#000"/>';
    return SVG(560, 540, '[프로그램 1] 실행 결과 미리보기', s, 'max-width:460px;display:block;margin:0 auto');
  })();

  /* ---------- 리스트 ---------- */
  const FIG_LIST = (() => {
    const items = ['사과', '배', '딸기', '포도'];
    let s = T(120, 115, 'fruit', { mono: true, size: 30, bold: true, fill: 'var(--accent)' }) + ARR('M180,110 L245,110', 'var(--accent)');
    items.forEach((t, i) => {
      const x = 250 + i * 160;
      s += T(x + 75, 55, `[${i}]`, { mono: true, size: 20, fill: 'var(--muted)' });
      s += `<rect x="${x}" y="75" width="150" height="70" rx="8" fill="var(--card)" stroke="${t === '딸기' ? 'var(--ok)' : 'var(--accent)'}" stroke-width="3"/>` + T(x + 75, 110, `'${t}'`, { size: 26 });
    });
    s += `<rect x="890" y="75" width="150" height="70" rx="8" fill="var(--card)" stroke="var(--accent2)" stroke-width="3" stroke-dasharray="8 6"/>` + T(965, 110, "'귤'", { size: 26, fill: 'var(--accent2)' });
    s += T(965, 55, '[4]', { mono: true, size: 20, fill: 'var(--accent2)' });
    s += T(965, 175, 'fruit.append(\'귤\')', { mono: true, size: 20, fill: 'var(--accent2)' }) + T(965, 203, '→ 맨 뒤에 추가', { size: 19, fill: 'var(--accent2)' });
    s += CODE(120, 245, 1040, ["'딸기' in fruit        # True  → 리스트 안에 있다", "'수박' in fruit        # False → 리스트 안에 없다", "'수박' not in fruit    # True  → 없으면 참"], { size: 22 });
    return SVG(1280, 395, '리스트와 in 연산자', s);
  })();

  /* ---------- [프로그램 2] 실행 화면 (콘솔 모양) ---------- */
  const CONSOLE = (txt) => `<pre style="margin:0;padding:14px 18px;border-radius:10px;background:var(--card);border:1px solid var(--line);font-family:Consolas,'D2Coding',monospace;font-size:15px;line-height:1.65;white-space:pre-wrap">${txt}</pre>`;
  const IN = (s) => `<b style="color:var(--accent)">${s}</b>`;
  const CALC_SCREEN = CONSOLE(
    `<span style="color:var(--muted)">── 첫 번째 실행 ──</span>\n1. 입력한 수식 계산  2. 두 수 사이의 합계 : ${IN('1')}\n *** 수식을 입력하세요 : ${IN('3*4/2-5')}\n 3*4/2-5 결과는   1.0입니다.\n` +
    `<span style="color:var(--muted)">── 두 번째 실행 ──</span>\n1. 입력한 수식 계산  2. 두 수 사이의 합계 : ${IN('2')}\n *** 첫 번째 숫자를 입력하세요 : ${IN('1')}\n *** 두 번째 숫자를 입력하세요 : ${IN('10')}\n1+...+10는 55입니다.`);

  /* ---------- 공통 코드 ---------- */
  const CODE0509 = `import turtle

## 전역 변수 선언 부분 ##
swidth, sheight = 500, 500

## 메인 코드 부분 ##
turtle.title('무지개색 원그리기')
turtle.shape('turtle')
turtle.setup(width = swidth + 50, height = sheight + 50)
turtle.screensize(swidth, sheight)
turtle.penup()
turtle.goto(0, -sheight / 2)
turtle.pendown()
turtle.speed(10)

for radius in range(1, 250) :
    if radius % 6 == 0 :
        turtle.pencolor('red')
    elif radius % 5 == 0 :
        turtle.pencolor('orange')
    elif radius % 4 == 0 :
        turtle.pencolor('yellow')
    elif radius % 3 == 0 :
        turtle.pencolor('green')
    elif radius % 2 == 0 :
        turtle.pencolor('blue')
    elif radius % 1 == 0 :
        turtle.pencolor('navy')
    else :
        turtle.pencolor('purple')

    turtle.circle(radius)

turtle.done()`;

  const CODE0511 = `## 변수 선언 부분 ##
select, answer, numStr, num1, num2 = 0, 0, "", 0, 0

## 메인 코드 부분 ##
select = int(input("1. 입력한 수식 계산  2. 두 수 사이의 합계 : "))

if select == 1 :
    numStr = input(" *** 수식을 입력하세요 : ")
    answer = eval(numStr)
    print(" %s 결과는 %5.1f입니다. " % (numStr, answer))
elif select == 2 :
    num1 = int(input(" *** 첫 번째 숫자를 입력하세요 : "))
    num2 = int(input(" *** 두 번째 숫자를 입력하세요 : "))
    for i in range(num1, num2 + 1) :
        answer = answer + i
    print("%d+...+%d는 %d입니다. " % (num1, num2, answer))
else :
    print("1 또는 2만 입력해야 합니다.")`;

  const CODE0507 = `score = int(input("점수를 입력하세요 : "))

if score >= 90 :
    print("A")
else :
    if score >= 80 :
        print("B")
    else :
        if score >= 70 :
            print("C")
        else :
            if score >= 60 :
                print("D")
            else :
                print("F")

print("학점입니다. ^^")`;

  const CODE0508 = `score = int(input("점수를 입력하세요 : "))

if score >= 90 :
    print("A")
elif score >= 80 :
    print("B")
elif score >= 70 :
    print("C")
elif score >= 60 :
    print("D")
else :
    print("F")

print("학점입니다. ^^")`;

  const SELF51 = `score = int(input("점수를 입력하세요 : "))

if score >= 95 :
    print("A+")
elif score >= 90 :
    print("A0")
elif score >= 85 :
    print("B+")
elif score >= 80 :
    print("B0")
elif score >= 75 :
    print("C+")
elif score >= 70 :
    print("C0")
elif score >= 65 :
    print("D+")
elif score >= 60 :
    print("D0")
else :
    print("F")

print("학점입니다. ^^")
`;

  const SELF52 = `num1 = int(input(" *** 첫 번째 숫자를 입력하세요 : "))
num2 = int(input(" *** 두 번째 숫자를 입력하세요 : "))
num3 = int(input(" *** 더할 숫자를 입력하세요 : "))
answer = 0

for i in range(num1, num2 + 1, num3) :
    answer = answer + i

print("%d+%d+...+%d는 %d입니다." % (num1, num1 + num3, num2, answer))
`;

  const SELF53 = `num = int(input(" *** 숫자를 입력하세요 : "))
isPrime = True

if num < 2 :
    isPrime = False

for i in range(2, num) :
    if num % i == 0 :
        isPrime = False

if isPrime :
    print(" %d는 소수입니다." % num)
else :
    print(" %d는 소수가 아닙니다." % num)
`;

  /* ================================================================ */
  PY_COURSE.addChapter({
    id: 'ch05',
    no: '05',
    title: '조건문',
    subtitle: 'if · else · elif · 조건부 표현식',
    summary: '조건에 따라 서로 다른 코드를 실행하는 if 문(기본 if, if~else, 중첩 if, if~elif~else)과 조건부 표현식을 배우고, 거북이 그래픽으로 무지개 색상의 원을, 조건 분기로 종합 계산기를 만듭니다.',
    goals: [
      '조건문의 대표 형태인 기본 if 문과 중첩 if 문의 형식과 사용법을 익힌다',
      '들여쓰기로 만들어지는 블록의 의미를 이해하고 들여쓰기 오류를 고칠 수 있다',
      'if~elif~else 와 조건부 표현식으로 여러 갈래의 조건을 간결하게 표현할 수 있다',
      '리스트 · in 연산자 · random 과 함께 조건문을 다양하게 활용할 수 있다',
      '조건문과 간단한 for 반복문으로 무지개 색상의 원과 종합 계산기 프로그램을 만든다'
    ],
    sections: [
      /* ===================== ch05-1 ===================== */
      {
        id: 'ch05-1',
        title: '기본 if 문과 들여쓰기',
        minutes: 50,
        goals: [
          '이 장에서 만들 두 프로그램(무지개 원, 종합 계산기)을 미리 살펴본다',
          '조건식의 결과가 True 또는 False 라는 것을 셸에서 확인할 수 있다',
          'if 문의 형식(콜론, 들여쓰기)과 실행 흐름을 순서도로 설명할 수 있다',
          '들여쓰기에 따라 if 블록의 범위가 달라지는 것을 이해하고 들여쓰기 오류를 고칠 수 있다'
        ],
        flow: [['도입: 이 장에서 만들 프로그램', 5], ['조건식과 True/False', 8], ['if 문의 형식 · 순서도', 12], ['블록과 들여쓰기 (Code05-01, 02)', 12], ['들여쓰기 오류 · 퀴즈 · 실습', 13]],
        content: [
          { type: 'h', text: '이 장에서 만들 프로그램' },
          { type: 'p', html: '이번 장에서는 “<b>만약 ~라면 이렇게, 아니라면 저렇게</b>” 처럼 상황에 따라 다른 일을 하는 프로그램을 만드는 방법, 즉 <b>조건문(conditional statement)</b>을 배웁니다. 장을 마치면 다음 두 프로그램을 직접 완성하게 됩니다.' },
          { type: 'p', html: '<b>[프로그램 1] 무지개 색상의 원</b> — 거북이가 반지름을 1씩 키우며 원을 약 250개 그립니다. 이때 <code>if</code> 문으로 반지름에 따라 펜 색을 바꾸어 무지개처럼 알록달록한 그림이 됩니다.' },
          { type: 'figure', html: FIG_RAINBOW, caption: '[프로그램 1] 무지개 색상의 원 — 완성 화면 (4교시에 완성)' },
          { type: 'p', html: '<b>[프로그램 2] 종합 계산기</b> — 기능이 두 가지인 계산기입니다. 1을 고르면 입력한 수식(예: <code>3*4/2-5</code>)을 계산하고, 2를 고르면 두 수 사이의 모든 정수를 더합니다. 사용자가 무엇을 골랐는지에 따라 실행할 코드가 달라지므로 역시 조건문이 핵심입니다.' },
          { type: 'figure', html: CALC_SCREEN, caption: '[프로그램 2] 종합 계산기 — 실행 화면 (파란 굵은 글씨가 사용자가 입력한 값, 5교시에 완성)' },
          { type: 'h', text: '조건문이란?' },
          { type: 'p', html: '지금까지 만든 프로그램은 위에서 아래로 <b>모든 줄을 차례대로</b> 실행했습니다. 하지만 실제 프로그램은 “비밀번호가 맞으면 로그인, 틀리면 경고”, “점수가 90점 이상이면 A 학점”처럼 <b>조건에 따라 길이 갈라지는</b> 경우가 대부분입니다.' },
          { type: 'p', html: '일상에서도 우리는 늘 조건문을 씁니다. “<b>비가 오면</b> 우산을 챙긴다.” 여기서 “비가 온다”가 <b>조건</b>, “우산을 챙긴다”가 조건이 참일 때 <b>실행할 문장</b>입니다. 파이썬에서는 이것을 <code>if</code> 라는 키워드로 표현합니다.' },
          { type: 'h', text: '조건식 — 결과는 True 또는 False' },
          { type: 'p', html: '<code>if</code> 뒤에 오는 <b>조건식</b>은 계산 결과가 <b>참(True)</b> 또는 <b>거짓(False)</b> 둘 중 하나가 되는 식입니다. 4장에서 배운 비교 연산자가 대표적인 조건식입니다. 콘솔의 <code>&gt;&gt;&gt;</code> 셸에서 직접 확인해 봅시다.' },
          { type: 'code', repl: true, title: '셸에서 조건식의 결과 확인하기', code: 'a = 99\na < 100\na > 100\na == 99\na != 99\ntype(a < 100)',
            expect: '>>> a = 99\n>>> a < 100\nTrue\n>>> a > 100\nFalse\n>>> a == 99\nTrue\n>>> a != 99\nFalse\n>>> type(a < 100)\n<class \'bool\'>\n>>>',
            desc: '조건식의 결과인 <code>True</code>/<code>False</code> 는 <b>불(bool)형</b> 값입니다. 첫 글자가 대문자라는 점에 주의하세요 (<code>true</code> 라고 쓰면 오류).' },
          { type: 'table', head: ['연산자', '의미', '예 (a = 99)', '결과'], rows: [
            ['<code>==</code>', '같다', '<code>a == 99</code>', 'True'],
            ['<code>!=</code>', '같지 않다', '<code>a != 99</code>', 'False'],
            ['<code>&lt;</code>', '작다', '<code>a &lt; 100</code>', 'True'],
            ['<code>&gt;</code>', '크다', '<code>a &gt; 100</code>', 'False'],
            ['<code>&lt;=</code>', '작거나 같다', '<code>a &lt;= 99</code>', 'True'],
            ['<code>&gt;=</code>', '크거나 같다', '<code>a &gt;= 100</code>', 'False']
          ], caption: '조건식에 자주 쓰는 비교 연산자 (4장 복습)' },
          { type: 'callout', kind: 'warn', title: '= 와 == 를 헷갈리지 마세요', html: '<code>a = 99</code> 는 a 에 99를 <b>대입</b>하는 문장이고, <code>a == 99</code> 는 a 가 99와 <b>같은지 묻는</b> 조건식입니다. <code>if a = 99 :</code> 처럼 쓰면 <code>SyntaxError: invalid syntax. Maybe you meant \'==\' or \':=\' instead of \'=\'?</code> 오류가 납니다. 파이썬이 친절하게 <code>==</code> 를 쓰려던 것 아니냐고 알려 줍니다.' },
          { type: 'h', text: 'if 문의 형식' },
          { type: 'p', html: '가장 기본적인 if 문은 “조건식이 참이면 실행할 문장을 실행하고, 거짓이면 아무것도 하지 않고 지나간다”는 구조입니다.' },
          { type: 'figure', html: FIG_IF, caption: '그림 5-1 if 문의 형식과 순서도' },
          { type: 'list', items: [
            '<code>if</code> 다음에 <b>조건식</b>을 쓰고, 끝에 반드시 <b>콜론(<code>:</code>)</b>을 붙입니다.',
            '조건이 참일 때 실행할 문장은 다음 줄에 <b>들여쓰기</b>(보통 공백 4칸)를 해서 씁니다.',
            '순서도에서 <b>마름모</b>는 조건 판단, <b>사각형</b>은 실행할 문장입니다. 조건이 거짓이면 오른쪽 길로 돌아가 실행할 문장을 건너뜁니다.'
          ] },
          { type: 'code', title: '기본 if 문', code: 'a = 99\nif a < 100 :\n    print("100보다 작군요.")', expect: '100보다 작군요.',
            desc: '<code>a &lt; 100</code> 은 <code>99 &lt; 100</code> 이므로 True 입니다. 조건이 참이니 들여쓴 <code>3행</code>이 실행됩니다.' },
          { type: 'figure', html: FIG_IF_RUN, caption: '그림 5-2 if 문 실행 과정 — a 가 99이면 조건이 참이므로 출력문을 실행한다' },
          { type: 'callout', kind: 'info', title: '셸(>>>)에서 if 문 써 보기', html: '셸에서도 if 문을 쓸 수 있습니다. <code>if a &lt; 100 :</code> 을 입력하고 Enter 를 누르면 프롬프트가 <code>...</code> 으로 바뀌며 “블록이 이어진다”는 것을 알려 줍니다. 블록을 다 쓴 뒤에는 <b>빈 줄에서 Enter</b> 를 한 번 더 눌러야 if 문이 실행됩니다. 여러 줄짜리 프로그램은 편집기에 쓰고 ▶ 실행(Ctrl+Enter)하는 편이 훨씬 편합니다.' },
          { type: 'code', repl: true, title: '셸에서 if 문 실행하기', code: 'a = 99\nif a < 100 :\n    print("100보다 작군요.")\n',
            expect: '>>> a = 99\n>>> if a < 100 :\n...     print("100보다 작군요.")\n...\n100보다 작군요.\n>>>' },
          { type: 'h', text: '조건이 거짓일 때 — 블록과 들여쓰기' },
          { type: 'p', html: '이번에는 a 에 200을 넣어 조건이 <b>거짓</b>이 되게 해 봅시다. 조건이 거짓이면 들여쓴 문장은 건너뜁니다. 그런데 들여쓰지 <b>않은</b> 문장은 어떻게 될까요?' },
          { type: 'code', title: 'Code05-01. 조건이 거짓일 때 (실행할 문장 1개)', code: `a = 200

if a < 100 :
    print("100보다 작군요.")
print("거짓이므로 이 문장은 안 보이겠죠?")

print("프로그램 끝")`, expect: '거짓이므로 이 문장은 안 보이겠죠?\n프로그램 끝',
            desc: '<code>200 &lt; 100</code> 은 거짓이므로 들여쓴 <code>4행</code>만 건너뜁니다. <code>5행</code>은 들여쓰지 않았기 때문에 <b>if 문과 상관없는 다음 문장</b>입니다. 그래서 “안 보이겠죠?” 라는 문장이 버젓이 출력됩니다.' },
          { type: 'p', html: '조건이 참일 때 여러 문장을 실행하고 싶다면, 실행할 문장을 <b>모두 같은 깊이로 들여쓰기</b>하면 됩니다.' },
          { type: 'code', title: 'Code05-02. if 문에서 두 문장 이상 실행하기', code: `a = 200

if a < 100 :
    print("100보다 작군요.")
    print("거짓이므로 이 문장은 안 보이겠죠?")

print("프로그램 끝")`, expect: '프로그램 끝',
            desc: '<code>4~5행</code>이 모두 if 블록 안에 있으므로 조건이 거짓이면 두 줄 다 건너뛰고 <code>7행</code>만 실행됩니다.' },
          { type: 'figure', html: FIG_BLOCK, caption: '같은 코드라도 들여쓰기에 따라 if 블록의 범위가 달라진다' },
          { type: 'callout', kind: 'tip', title: '블록(block)이란?', html: '같은 깊이로 들여쓴 문장들의 묶음을 <b>블록</b>이라고 합니다. C · 자바 같은 언어는 중괄호 <code>{ }</code> 로 블록을 표시하지만, 파이썬은 <b>들여쓰기 자체가 문법</b>입니다. 그래서 파이썬에서 들여쓰기는 “보기 좋게”가 아니라 “프로그램의 의미”를 결정합니다.' },
          { type: 'h', text: '들여쓰기 오류' },
          { type: 'p', html: '같은 블록에 속한 문장은 <b>들여쓰기 칸 수가 정확히 같아야</b> 합니다. 아래처럼 한 줄은 8칸, 다음 줄은 4칸으로 들여쓰면 파이썬은 두 번째 줄이 어느 블록에 속하는지 알 수 없어 실행 자체를 거부합니다.' },
          { type: 'code', title: '들여쓰기 오류 예 (강의자료 Tip)', code: `a = 200
if a < 100 :
        print("100보다 작군요.")
    print("거짓이므로 이 문장은 안 보이겠죠?")`, expectError: true,
            expect: `  File "main.py", line 4
    print("거짓이므로 이 문장은 안 보이겠죠?")
                                ^
IndentationError: unindent does not match any outer indentation level`,
            desc: '<code>IndentationError</code> 는 문법 오류의 한 종류라서, 프로그램이 <b>한 줄도 실행되지 않습니다</b> (1행의 대입조차 실행되지 않음). 오류 메시지의 <code>line 4</code> 를 보고 해당 줄의 들여쓰기를 위 줄과 맞추면 됩니다.' },
          { type: 'p', html: 'if 문과 관련해 초보자가 자주 만나는 오류를 더 살펴봅시다. 오류 메시지를 읽는 연습을 해 두면 스스로 고칠 수 있습니다.' },
          { type: 'code', title: '추가 예제. 콜론(:)을 빠뜨렸을 때', code: 'a = 99\nif a < 100\n    print("100보다 작군요.")', expectError: true,
            expect: `  File "main.py", line 2
    if a < 100
              ^
SyntaxError: expected ':'`,
            desc: '파이썬이 <code>2행</code> 끝에 콜론이 있어야 한다고 정확히 알려 줍니다.' },
          { type: 'code', title: '추가 예제. 들여쓰기를 하지 않았을 때', code: 'a = 99\nif a < 100 :\nprint("100보다 작군요.")', expectError: true,
            expect: `  File "main.py", line 3
    print("100보다 작군요.")
    ^^^^^
IndentationError: expected an indented block after 'if' statement on line 2`,
            desc: 'if 문 다음에는 들여쓴 블록이 <b>최소 한 줄</b>은 있어야 합니다.' },
          { type: 'table', head: ['오류 메시지', '원인', '고치는 방법'], rows: [
            ["<code>SyntaxError: expected ':'</code>", '조건식 끝에 콜론이 없음', '<code>if 조건식 :</code> 처럼 콜론 추가'],
            ["<code>IndentationError: expected an indented block…</code>", 'if 다음 줄을 들여쓰지 않음', '실행할 문장을 4칸 들여쓰기'],
            ['<code>IndentationError: unindent does not match…</code>', '같은 블록의 들여쓰기 칸 수가 다름', '위 줄과 칸 수를 똑같이 맞추기'],
            ['<code>IndentationError: unexpected indent</code>', '들여쓸 필요가 없는 줄을 들여씀', '앞쪽 공백 지우기']
          ], caption: 'if 문에서 자주 만나는 오류' },
          { type: 'callout', kind: 'more', title: '📘 들여쓰기는 몇 칸? 탭? 공백?', html: '<ul><li>파이썬 공식 스타일 가이드(PEP 8)는 <b>공백 4칸</b>을 권장합니다. 이 강좌의 예제도 모두 4칸입니다.</li><li>탭(Tab)과 공백(Space)을 한 블록 안에 섞어 쓰면 눈으로는 같아 보여도 오류가 납니다 (<code>TabError</code>). 대부분의 편집기는 Tab 키를 누르면 공백 4칸을 넣어 주므로 Tab 키를 써도 괜찮습니다.</li><li>강의자료는 <code>if a &lt; 100 :</code> 처럼 콜론 앞에 한 칸을 띄우지만, <code>if a &lt; 100:</code> 처럼 붙여 써도 똑같이 동작합니다. PEP 8 은 붙여 쓰는 쪽을 권장합니다.</li></ul>' },
          { type: 'callout', kind: 'more', title: '📘 아직 쓸 내용이 없을 때 — pass', html: '블록에는 최소 한 줄이 있어야 하므로, 나중에 채울 자리를 비워 두고 싶을 때는 “아무것도 하지 않는” 문장인 <code>pass</code> 를 씁니다.<pre><code>if a &lt; 100 :\n    pass      # TODO: 나중에 작성</code></pre>' },
          { type: 'code', title: '추가 예제. 입력값으로 if 문 실행하기', code: `age = int(input("나이를 입력하세요 : "))

if age >= 20 :
    print("성인입니다.")
    print("투표에 참여할 수 있습니다.")

print("입력해 주셔서 감사합니다.")`, stdin: '25\n', expect: '나이를 입력하세요 : 25\n성인입니다.\n투표에 참여할 수 있습니다.\n입력해 주셔서 감사합니다.',
            desc: '▶ 실행한 뒤 콘솔에 직접 여러 나이를 입력해 보세요. 19를 입력하면 마지막 줄만 출력됩니다. <code>input()</code> 은 항상 문자열을 돌려주므로 <code>int()</code> 로 정수로 바꿔야 <code>&gt;=</code> 비교를 할 수 있습니다.' }
        ],
        practice: [
          {
            title: '실습 5-1. 절댓값 구하기',
            level: 1,
            desc: '<p>정수를 하나 입력받아, 음수이면 <code>-1</code> 을 곱해 양수로 바꾼 뒤 “절댓값은 ○입니다.” 를 출력하세요. (else 없이 기본 if 문만 사용)</p><pre>정수를 입력하세요 : -7\n절댓값은 7입니다.</pre>',
            hint: '<code>if num &lt; 0 :</code> 블록 안에서 <code>num = num * -1</code>. 출력문은 if 블록 <b>밖</b>(들여쓰기 없이)에 둡니다.',
            starter: 'num = int(input("정수를 입력하세요 : "))\n\n# TODO: 음수이면 양수로 바꾸기\n\nprint("절댓값은 %d입니다." % num)\n',
            solution: 'num = int(input("정수를 입력하세요 : "))\n\nif num < 0 :\n    num = num * -1\n\nprint("절댓값은 %d입니다." % num)\n',
            stdin: '-7\n',
            expect: '정수를 입력하세요 : -7\n절댓값은 7입니다.'
          },
          {
            title: '실습 5-2. 놀이기구 탑승 안내',
            level: 1,
            desc: '<p>키(cm)를 입력받아 120 이상이면 “탑승할 수 있습니다.” 와 “안전바를 꼭 내려 주세요.” 두 줄을 출력하고, 키와 관계없이 마지막에 “즐거운 하루 되세요!” 를 출력하세요.</p><pre>키를 입력하세요(cm) : 130\n탑승할 수 있습니다.\n안전바를 꼭 내려 주세요.\n즐거운 하루 되세요!</pre>',
            hint: 'if 블록에 두 줄을 같은 깊이로 들여쓰고, 마지막 print 는 들여쓰지 않습니다. 110을 입력해 마지막 줄만 나오는지도 확인해 보세요.',
            starter: 'height = int(input("키를 입력하세요(cm) : "))\n\n# TODO: 120 이상이면 두 줄 출력\n\n# TODO: 항상 출력되는 인사\n',
            solution: 'height = int(input("키를 입력하세요(cm) : "))\n\nif height >= 120 :\n    print("탑승할 수 있습니다.")\n    print("안전바를 꼭 내려 주세요.")\n\nprint("즐거운 하루 되세요!")\n',
            stdin: '130\n',
            expect: '키를 입력하세요(cm) : 130\n탑승할 수 있습니다.\n안전바를 꼭 내려 주세요.\n즐거운 하루 되세요!'
          }
        ],
        quiz: [
          { q: '다음 코드의 실행 결과는?<pre><code>a = 99\nif a &lt; 100 :\n    print("작다")</code></pre>', options: ['작다', '아무것도 출력되지 않는다', 'True', '오류가 발생한다'], answer: 0, explain: '<code>99 &lt; 100</code> 은 True 이므로 들여쓴 print 문이 실행됩니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>a = 200\nif a &lt; 100 :\n    print("A")\nprint("B")</code></pre>', options: ['A', 'B', 'A 와 B 두 줄', '아무것도 출력되지 않는다'], answer: 1, explain: '조건이 거짓이므로 들여쓴 <code>print("A")</code> 만 건너뜁니다. <code>print("B")</code> 는 들여쓰지 않아 if 문 밖에 있으므로 항상 실행됩니다.' },
          { q: 'if 문에 대한 설명으로 <b>틀린</b> 것은?', options: ['조건식 뒤에는 콜론(:)을 붙인다', '조건이 참일 때 실행할 문장은 들여쓰기한다', '들여쓰기는 보기 좋으라고 하는 것이라 생략해도 된다', '같은 블록의 문장은 들여쓰기 칸 수가 같아야 한다'], answer: 2, explain: '파이썬에서 들여쓰기는 블록을 정하는 <b>문법</b>입니다. 생략하면 IndentationError 가 납니다.' },
          { q: '<code>a = 5</code> 일 때 셸에서 <code>a == 5</code> 를 입력한 결과는?', options: ['5', 'True', 'true', 'a 에 5가 대입된다'], answer: 1, explain: '<code>==</code> 는 같은지 비교하는 연산자이고 결과는 불형 값 <code>True</code> 입니다 (첫 글자 대문자).' },
          { q: '<code>if a &lt; 100</code> 을 실행했더니 <code>SyntaxError: expected \':\'</code> 가 났다. 원인은?', options: ['a 에 값이 없다', '조건식 끝에 콜론이 없다', '들여쓰기를 하지 않았다', '100 을 따옴표로 감싸야 한다'], answer: 1, explain: '오류 메시지 그대로 콜론(<code>:</code>)이 필요하다는 뜻입니다.' }
        ],
        slides: [
          { layout: 'title', title: '기본 if 문과 들여쓰기', subtitle: 'Chapter 05 조건문 · Section 01~02', badge: '05-1',
            notes: '<p><b>[도입 1분]</b> “게임에서 체력이 0이 되면 게임 오버, 아니면 계속 — 이런 판단은 프로그램이 어떻게 할까요?” 로 시작합니다.</p><p>오늘 목표: 조건식이 True/False 가 된다는 것, if 문의 형식, 그리고 파이썬에서 가장 중요한 <b>들여쓰기</b>.</p>' },
          { layout: 'two', title: '이 장에서 만들 프로그램',
            left: { title: '[프로그램 1] 무지개 색상의 원', html: FIG_RAINBOW },
            right: { title: '[프로그램 2] 종합 계산기', bullets: ['1 → 입력한 수식 계산 (<code>3*4/2-5</code>)', '2 → 두 수 사이의 합계 (1~10 → 55)', '고른 번호에 따라 <b>다른 코드</b>가 실행됨', '핵심 도구: <b>if · elif · else</b>'] },
            notes: '<p><b>[3분]</b> 완성 화면을 먼저 보여 주고 동기를 부여합니다. “원 250개의 색을 하나하나 지정하려면? → 조건문으로 규칙을 정하면 된다.”</p><p>계산기는 사용자의 선택에 따라 갈라지는 프로그램이라는 점만 짚고, 자세한 코드는 마지막 교시에 다룬다고 예고합니다.</p>' },
          { layout: 'bullets', title: '조건문이란?', lead: '조건에 따라 실행할 코드를 고르는 문장',
            bullets: ['지금까지: 위에서 아래로 <b>모든 줄</b>을 차례로 실행', '조건문: 조건에 따라 <b>길이 갈라짐</b>', ['“비가 오면 → 우산을 챙긴다”', '비가 온다 = <b>조건</b>, 우산 = <b>실행할 문장</b>'], '파이썬 키워드: <code>if</code>, <code>else</code>, <code>elif</code>'],
            notes: '<p><b>[2분]</b> 학생들에게 일상 속 “만약 ~라면” 문장을 두세 개 말하게 합니다 (예: 배고프면 밥을 먹는다).</p><p>그중 하나를 골라 “조건”과 “실행할 문장”을 구분해 보게 하세요.</p>' },
          { layout: 'code', title: '조건식 — 결과는 True / False', repl: true, code: 'a = 99\na < 100\na > 100\na == 99\na != 99\ntype(a < 100)',
            points: ['비교 결과는 <code>True</code> / <code>False</code>', '자료형은 <b>bool</b> (불형)', '<code>=</code> 대입 vs <code>==</code> 비교'],
            notes: '<p><b>[5분]</b> 한 줄씩 실행하기 전에 결과를 예측하게 합니다. <code>true</code>(소문자)로 써서 NameError 가 나는 모습도 보여 주면 좋습니다.</p><p>발문: “<code>a = 99</code> 와 <code>a == 99</code> 의 차이는?” — 대입 vs 질문.</p>' },
          { layout: 'diagram', title: 'if 문의 형식과 순서도', html: FIG_IF, caption: '그림 5-1 — 조건식이 참이면 실행, 거짓이면 건너뜀',
            notes: '<p><b>[4분]</b> 순서도 기호: 마름모 = 판단, 사각형 = 처리. 화살표를 손가락으로 따라가며 참/거짓 두 길을 설명합니다.</p><p>형식에서 <b>콜론</b>과 <b>들여쓰기</b> 두 가지에 동그라미를 쳐 주세요. 오늘 가장 많이 틀리는 부분입니다.</p>' },
          { layout: 'code', title: '기본 if 문', code: 'a = 99\nif a < 100 :\n    print("100보다 작군요.")',
            points: ['<code>99 &lt; 100</code> → True', '들여쓴 3행 실행', 'a 를 200으로 바꾸면?'],
            notes: '<p><b>[3분]</b> 실행 후 1행을 <code>a = 200</code> 으로 바꿔 다시 실행 → 아무것도 출력되지 않음을 확인합니다. “오류가 아니라 정상입니다. 조건이 거짓이라 건너뛴 거예요.”</p>' },
          { layout: 'diagram', title: 'if 문 실행 과정', html: FIG_IF_RUN, caption: '그림 5-2 — a = 99 이면 초록색 길로 실행',
            notes: '<p><b>[2분]</b> 실제 값(99)을 넣어 순서도를 따라가게 합니다. “a 가 150이면 어느 길?” 하고 물어 거짓 경로도 확인합니다.</p>' },
          { layout: 'code', title: 'Code05-01. 조건이 거짓일 때', code: 'a = 200\n\nif a < 100 :\n    print("100보다 작군요.")\nprint("거짓이므로 이 문장은 안 보이겠죠?")\n\nprint("프로그램 끝")',
            points: ['200 &lt; 100 → False', '4행만 건너뜀', '5행은 <b>들여쓰기 없음</b> → if 밖'],
            notes: '<p><b>[3분]</b> 실행 전에 “몇 줄이 출력될까요?” 투표. 많은 학생이 1줄(프로그램 끝)이라고 답합니다. 실행해서 2줄이 나오는 것을 보고 “왜?”를 묻습니다.</p><p>정답: 5행은 들여쓰지 않았으므로 if 문에 속하지 않는다.</p>' },
          { layout: 'diagram', title: 'Code05-02. 들여쓰기가 블록을 정한다', html: FIG_BLOCK, caption: '같은 깊이로 들여쓴 줄들 = 하나의 블록',
            notes: '<p><b>[4분]</b> 5행 앞에 공백 4칸을 넣는 것만으로 결과가 달라집니다. 직접 편집기에서 Code05-01 의 5행을 들여써서 Code05-02 로 바꾸고 실행해 보세요 → “프로그램 끝” 한 줄.</p><p>C/자바의 중괄호 <code>{ }</code> 대신 파이썬은 들여쓰기로 블록을 표시한다는 점을 강조합니다.</p>' },
          { layout: 'two', title: '들여쓰기 오류와 고친 코드',
            left: { title: '✗ 오류 (8칸 / 4칸)', html: '<pre><code>if a &lt; 100 :\n        print("100보다 작군요.")\n    print("거짓이므로 …")</code></pre><p><code>IndentationError: unindent does not match any outer indentation level</code></p><p>→ 프로그램이 <b>한 줄도</b> 실행되지 않음</p>' },
            right: { title: '✓ 고친 코드 (모두 4칸)', code: 'a = 200\nif a < 100 :\n    print("100보다 작군요.")\n    print("거짓이므로 이 문장은 안 보이겠죠?")\nprint("프로그램 끝")' },
            notes: '<p><b>[4분]</b> 왼쪽 코드를 직접 입력해 오류 메시지를 함께 읽습니다. <code>line 4</code> 와 <code>^</code> 표시로 위치를 찾는 법을 보여 주세요.</p><p>콜론 누락(<code>expected \':\'</code>), 들여쓰기 누락(<code>expected an indented block</code>)도 즉석에서 만들어 보여 줍니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '다음 코드의 실행 결과는?<pre><code>a = 200\nif a &lt; 100 :\n    print("A")\nprint("B")</code></pre>', options: ['A', 'B', 'A 와 B 두 줄', '아무것도 출력되지 않는다'], answer: 1, explain: '조건이 거짓이라 A 는 건너뛰지만, 들여쓰지 않은 print("B") 는 if 밖이므로 항상 실행됩니다.',
            notes: '<p><b>[2분]</b> 틀린 학생이 많으면 FIG_BLOCK 슬라이드로 돌아가 블록 범위를 다시 표시합니다.</p>' },
          { layout: 'practice', title: '실습 5-2. 놀이기구 탑승 안내', desc: '키가 120 이상이면 두 줄(탑승 가능, 안전바 안내)을 출력하고, 마지막에 항상 “즐거운 하루 되세요!” 를 출력하세요.',
            starter: 'height = int(input("키를 입력하세요(cm) : "))\n\n# TODO: 120 이상이면 두 줄 출력\n\n# TODO: 항상 출력되는 인사\n',
            solution: 'height = int(input("키를 입력하세요(cm) : "))\n\nif height >= 120 :\n    print("탑승할 수 있습니다.")\n    print("안전바를 꼭 내려 주세요.")\n\nprint("즐거운 하루 되세요!")\n', stdin: '130\n',
            notes: '<p><b>[8분]</b> 130 과 110 두 값으로 모두 실행해 보게 합니다. 순회하며 마지막 print 를 들여쓴 학생(110 입력 시 아무것도 안 나옴)을 찾아 블록 개념을 다시 짚어 주세요.</p><p>빨리 끝난 학생은 실습 5-1(절댓값)을 이어서 합니다.</p>' },
          { layout: 'summary', title: '정리', bullets: ['조건식의 결과는 <code>True</code> / <code>False</code> (bool)', '<code>if 조건식 :</code> — 콜론 필수', '참일 때 실행할 문장은 <b>들여쓰기</b>(공백 4칸)', '같은 깊이로 들여쓴 줄 = <b>블록</b>, 들여쓰기가 범위를 결정', '들여쓰기가 어긋나면 <code>IndentationError</code>'],
            notes: '<p><b>[1분]</b> 다음 시간 예고: “조건이 거짓일 때도 무언가를 하고 싶다면? → else”</p>' }
        ]
      },

      /* ===================== ch05-2 ===================== */
      {
        id: 'ch05-2',
        title: 'if~else 문',
        minutes: 50,
        goals: [
          'if~else 문의 형식과 순서도를 설명할 수 있다',
          '조건이 참일 때와 거짓일 때 서로 다른 블록을 실행하는 프로그램을 작성할 수 있다',
          '% 연산자와 if~else 로 짝수 · 홀수를 판별할 수 있다',
          'and · or · not 과 참/거짓으로 취급되는 값을 조건식에 활용할 수 있다'
        ],
        flow: [['복습 · if~else 형식', 7], ['Code05-03, 04 와 순서도', 12], ['짝수 · 홀수 판별 (Code05-05)', 10], ['논리 연산 · random 활용', 11], ['퀴즈 · 실습', 10]],
        content: [
          { type: 'h', text: 'if~else 문의 형식' },
          { type: 'p', html: '기본 if 문은 조건이 거짓이면 그냥 지나갔습니다. 하지만 “100보다 작으면 ‘작다’, <b>그렇지 않으면</b> ‘크다’” 처럼 조건이 거짓일 때도 해야 할 일이 있는 경우가 많습니다. 이럴 때 <code>else</code> 를 씁니다.' },
          { type: 'figure', html: FIG_IFELSE, caption: '그림 5-3 if~else 문의 형식과 순서도' },
          { type: 'list', items: [
            '조건식이 참이면 <b>실행할 문장 1</b>(if 블록), 거짓이면 <b>실행할 문장 2</b>(else 블록)를 실행합니다.',
            '두 블록 중 <b>반드시 하나만</b> 실행됩니다. 둘 다 실행되거나, 둘 다 건너뛰는 일은 없습니다.',
            '<code>else</code> 는 조건식이 없고 바로 콜론을 붙입니다: <code>else :</code>. <code>if</code> 와 <b>같은 깊이</b>로 씁니다.'
          ] },
          { type: 'code', title: 'Code05-03. if~else 문', code: `a = 200

if a < 100 :
    print("100보다 작군요.")
else :
    print("100보다 크군요.")`, expect: '100보다 크군요.',
            desc: '<code>200 &lt; 100</code> 은 거짓이므로 if 블록(<code>4행</code>)은 건너뛰고 else 블록(<code>6행</code>)이 실행됩니다.' },
          { type: 'figure', html: FIG_0503, caption: '그림 5-4 Code05-03.py 실행 과정 — a 가 200이므로 거짓(빨간) 경로' },
          { type: 'callout', kind: 'info', title: '엄밀히 말하면 “크거나 같군요”', html: 'a 가 정확히 100이면 <code>100 &lt; 100</code> 이 거짓이라 “100보다 크군요.” 가 출력됩니다. else 는 “조건이 아닌 <b>나머지 모든 경우</b>”라는 점을 기억하세요. 경계값(100)을 넣어 실행해 보는 습관을 들이면 이런 실수를 빨리 찾을 수 있습니다.' },
          { type: 'p', html: 'if 블록과 else 블록에도 각각 여러 문장을 넣을 수 있습니다. 들여쓰기만 잘 맞추면 됩니다.' },
          { type: 'code', title: 'Code05-04. 블록마다 여러 문장 실행하기', code: `a = 200

if a < 100 :
    print("100보다 작군요.")
    print("참이면 이 문장도 보이겠죠?")
else :
    print("100보다 크군요.")
    print("거짓이면 이 문장도 보이겠죠?")

print("프로그램 끝")`, expect: '100보다 크군요.\n거짓이면 이 문장도 보이겠죠?\n프로그램 끝',
            desc: '거짓이므로 else 블록의 <code>7~8행</code>이 실행되고, if~else 문이 끝난 뒤 들여쓰지 않은 <code>10행</code>이 실행됩니다. a 를 50으로 바꾸면 <code>4~5행</code>과 <code>10행</code>이 출력됩니다.' },
          { type: 'h', text: '예: 입력한 숫자가 짝수인지 홀수인지' },
          { type: 'p', html: '어떤 수를 2로 나눈 <b>나머지</b>가 0이면 짝수, 1이면 홀수입니다. 나머지 연산자 <code>%</code> 와 if~else 를 함께 쓰면 짝수 · 홀수를 판별할 수 있습니다.' },
          { type: 'code', title: 'Code05-05. 짝수 · 홀수 판별', code: `a = int(input("정수를 입력하세요 : "))

if a % 2 == 0 :
    print("짝수를 입력했군요.")
else :
    print("홀수를 입력했군요.")`, stdin: '125\n', expect: '정수를 입력하세요 : 125\n홀수를 입력했군요.',
            desc: '<code>125 % 2</code> 는 1이므로 <code>1 == 0</code> 은 거짓 → else 블록이 실행됩니다. ▶ 실행 후 짝수도 입력해 보세요. <code>%</code> 와 <code>==</code> 중 <code>%</code> 가 먼저 계산됩니다 (산술 연산자가 비교 연산자보다 우선).' },
          { type: 'code', repl: true, title: '셸에서 나머지 확인하기', code: '125 % 2\n124 % 2\n125 % 2 == 0\n124 % 2 == 0',
            expect: '>>> 125 % 2\n1\n>>> 124 % 2\n0\n>>> 125 % 2 == 0\nFalse\n>>> 124 % 2 == 0\nTrue\n>>>' },
          { type: 'callout', kind: 'tip', title: '배수 판별 공식', html: '“a 가 n 의 배수인가?” 는 언제나 <code>a % n == 0</code> 으로 확인합니다. 3의 배수는 <code>a % 3 == 0</code>, 5의 배수는 <code>a % 5 == 0</code>. 이 공식은 [프로그램 1] 무지개 원에서도 그대로 쓰입니다.' },
          { type: 'h', text: '조건식을 더 풍부하게 — and · or · not' },
          { type: 'p', html: '조건이 두 개 이상이면 논리 연산자로 묶습니다. <code>and</code> 는 “둘 다 참”, <code>or</code> 는 “하나라도 참”, <code>not</code> 은 “참/거짓 뒤집기”입니다.' },
          { type: 'code', title: '추가 예제. and 로 범위 검사하기', code: `score = int(input("점수를 입력하세요 : "))

if score >= 0 and score <= 100 :
    print("올바른 점수입니다.")
else :
    print("점수는 0~100 사이여야 합니다.")`, stdin: '120\n', expect: '점수를 입력하세요 : 120\n점수는 0~100 사이여야 합니다.',
            desc: '<code>120 &gt;= 0</code> 은 참이지만 <code>120 &lt;= 100</code> 이 거짓이므로 <code>and</code> 전체는 거짓입니다.' },
          { type: 'callout', kind: 'more', title: '📘 파이썬만의 연쇄 비교', html: '파이썬은 수학처럼 <code>0 &lt;= score &lt;= 100</code> 이라고 쓸 수 있습니다. 이것은 <code>0 &lt;= score and score &lt;= 100</code> 과 같은 뜻입니다. 대부분의 다른 언어(C, 자바)에서는 이렇게 쓸 수 없으니 파이썬의 장점으로 기억해 두세요.' },
          { type: 'code', title: '추가 예제. or 로 여러 값 중 하나인지 검사하기', code: `answer = input("계속할까요? (y/n) : ")

if answer == "y" or answer == "Y" :
    print("계속 진행합니다.")
else :
    print("프로그램을 마칩니다.")`, stdin: 'Y\n', expect: '계속할까요? (y/n) : Y\n계속 진행합니다.',
            desc: '소문자 <code>y</code> 와 대문자 <code>Y</code> 둘 다 허용합니다. 문자열도 <code>==</code> 로 비교할 수 있으며 대소문자를 구분합니다.' },
          { type: 'callout', kind: 'warn', title: '흔한 실수: or 의 오른쪽을 빠뜨리기', html: '<code>if answer == "y" or "Y" :</code> 라고 쓰면 <b>항상 참</b>이 됩니다. <code>or</code> 의 오른쪽 <code>"Y"</code> 가 “비어 있지 않은 문자열 = 참”으로 판단되기 때문입니다. 반드시 <code>answer == "y" or answer == "Y"</code> 처럼 양쪽 모두 완전한 조건식으로 쓰세요.' },
          { type: 'callout', kind: 'more', title: '📘 참/거짓으로 취급되는 값 (truthiness)', html: '조건식 자리에는 True/False 가 아닌 값도 올 수 있습니다. 파이썬은 <code>0</code>, <code>0.0</code>, 빈 문자열 <code>""</code>, 빈 리스트 <code>[]</code>, <code>None</code> 을 <b>거짓</b>으로, 나머지는 모두 <b>참</b>으로 취급합니다. <code>bool()</code> 함수로 확인할 수 있습니다.' },
          { type: 'code', repl: true, title: '추가 예제. bool() 로 참/거짓 확인하기', code: 'bool(0)\nbool(15)\nbool("")\nbool("파이썬")\nnot True',
            expect: '>>> bool(0)\nFalse\n>>> bool(15)\nTrue\n>>> bool("")\nFalse\n>>> bool("파이썬")\nTrue\n>>> not True\nFalse\n>>>' },
          { type: 'h', text: 'random 과 함께 쓰기 — 동전 던지기' },
          { type: 'p', html: '<code>random</code> 모듈의 <code>random.randint(a, b)</code> 는 a 이상 b 이하의 정수 하나를 무작위로 돌려줍니다. 결과가 매번 달라지므로 if~else 와 함께 쓰면 간단한 게임을 만들 수 있습니다.' },
          { type: 'code', title: '추가 예제. 동전 던지기', code: `import random

coin = random.randint(0, 1)

if coin == 0 :
    print("앞면이 나왔습니다.")
else :
    print("뒷면이 나왔습니다.")`, nondeterministic: true,
            desc: '실행할 때마다 결과가 달라집니다. 여러 번 ▶ 실행해 보세요. <code>coin</code> 은 0 또는 1이므로 else 는 “1일 때”와 같은 뜻입니다.' },
          { type: 'code', title: '추가 예제. 숫자 맞히기 (한 번의 기회)', code: `import random

secret = random.randint(1, 5)
guess = int(input("1~5 중 숫자 하나를 맞혀 보세요 : "))

if guess == secret :
    print("정답입니다! 축하합니다.")
else :
    print("아쉽네요. 정답은 %d였습니다." % secret)`, stdin: '3\n', nondeterministic: true,
            desc: '컴퓨터가 고른 수와 입력한 수를 <code>==</code> 로 비교합니다. 5장 뒤에서 배울 반복문을 쓰면 여러 번 기회를 주는 게임으로 발전시킬 수 있습니다.' }
        ],
        practice: [
          {
            title: '실습 5-3. 합격 · 불합격 판정',
            level: 1,
            desc: '<p>점수를 입력받아 60점 이상이면 “합격입니다.”, 아니면 “불합격입니다.” 를 출력하고, 마지막에 항상 “수고하셨습니다.” 를 출력하세요.</p><pre>점수를 입력하세요 : 58\n불합격입니다.\n수고하셨습니다.</pre>',
            hint: '<code>if score &gt;= 60 :</code> / <code>else :</code>. 마지막 print 는 들여쓰지 않습니다.',
            starter: 'score = int(input("점수를 입력하세요 : "))\n\n# TODO: if~else 로 합격/불합격 출력\n\nprint("수고하셨습니다.")\n',
            solution: 'score = int(input("점수를 입력하세요 : "))\n\nif score >= 60 :\n    print("합격입니다.")\nelse :\n    print("불합격입니다.")\n\nprint("수고하셨습니다.")\n',
            stdin: '58\n',
            expect: '점수를 입력하세요 : 58\n불합격입니다.\n수고하셨습니다.'
          },
          {
            title: '실습 5-4. 3의 배수 박수 게임',
            level: 2,
            desc: '<p>정수를 입력받아 3의 배수이면 “짝!”, 아니면 입력한 숫자를 그대로 출력하세요.</p><pre>숫자를 입력하세요 : 9\n짝!</pre>',
            hint: '배수 판별 공식 <code>num % 3 == 0</code> 을 사용합니다. else 블록에서는 <code>print(num)</code>.',
            starter: 'num = int(input("숫자를 입력하세요 : "))\n\n# TODO: 3의 배수이면 "짝!", 아니면 숫자 출력\n',
            solution: 'num = int(input("숫자를 입력하세요 : "))\n\nif num % 3 == 0 :\n    print("짝!")\nelse :\n    print(num)\n',
            stdin: '9\n',
            expect: '숫자를 입력하세요 : 9\n짝!'
          },
          {
            title: '실습 5-5. 주사위 홀짝 게임',
            level: 2,
            desc: '<p>“홀” 또는 “짝” 을 입력받고, 컴퓨터가 주사위(1~6)를 굴립니다. 주사위 눈이 홀수인지 짝수인지 판별해 맞혔으면 “맞혔습니다!”, 틀렸으면 “틀렸습니다!” 를 출력하세요. 주사위 눈도 함께 출력합니다.</p><pre>홀 또는 짝을 입력하세요 : 홀\n주사위 눈 : 3\n맞혔습니다!</pre>',
            hint: '먼저 <code>if dice % 2 == 1 :</code> 로 결과(<code>"홀"</code>/<code>"짝"</code>)를 변수에 담은 뒤, 두 번째 if~else 로 입력값과 비교합니다.',
            starter: 'import random\n\nchoice = input("홀 또는 짝을 입력하세요 : ")\ndice = random.randint(1, 6)\nprint("주사위 눈 :", dice)\n\n# TODO: 주사위 눈이 홀수인지 짝수인지 result 변수에 저장\n\n# TODO: choice 와 result 가 같으면 "맞혔습니다!", 다르면 "틀렸습니다!"\n',
            solution: 'import random\n\nchoice = input("홀 또는 짝을 입력하세요 : ")\ndice = random.randint(1, 6)\nprint("주사위 눈 :", dice)\n\nif dice % 2 == 1 :\n    result = "홀"\nelse :\n    result = "짝"\n\nif choice == result :\n    print("맞혔습니다!")\nelse :\n    print("틀렸습니다!")\n',
            stdin: '홀\n',
            nondeterministic: true
          }
        ],
        quiz: [
          { q: '다음 코드의 실행 결과는?<pre><code>a = 100\nif a &lt; 100 :\n    print("작다")\nelse :\n    print("크다")</code></pre>', options: ['작다', '크다', '작다, 크다 두 줄', '아무것도 출력되지 않는다'], answer: 1, explain: '<code>100 &lt; 100</code> 은 거짓이므로 else 블록이 실행됩니다. 경계값에 주의하세요.' },
          { q: 'if~else 문에 대한 설명으로 옳은 것은?', options: ['else 뒤에도 조건식을 써야 한다', 'if 블록과 else 블록이 둘 다 실행될 수 있다', '두 블록 중 반드시 하나만 실행된다', 'else 는 if 보다 한 단계 더 들여쓴다'], answer: 2, explain: '조건이 참이면 if 블록, 거짓이면 else 블록 — 항상 정확히 하나만 실행됩니다. else 는 조건식 없이 if 와 같은 깊이로 씁니다.' },
          { q: '<code>a</code> 가 홀수인지 판별하는 조건식으로 알맞은 것은?', options: ['<code>a / 2 == 1</code>', '<code>a % 2 == 1</code>', '<code>a // 2 == 0</code>', '<code>a % 2 = 1</code>'], answer: 1, explain: '2로 나눈 <b>나머지</b>(<code>%</code>)가 1이면 홀수입니다. <code>=</code> 는 대입이므로 조건식에 쓸 수 없습니다.' },
          { q: '<code>x = 15</code> 일 때 <code>10 &lt; x &lt; 20 and x % 5 == 0</code> 의 결과는?', options: ['True', 'False', '15', '오류'], answer: 0, explain: '<code>10 &lt; 15 &lt; 20</code> 은 참, <code>15 % 5 == 0</code> 도 참 → 둘 다 참이므로 and 결과는 True.' },
          { q: '다음 중 조건식 자리에서 <b>거짓</b>으로 취급되는 값은?', options: ['<code>-1</code>', '<code>"0"</code>', '<code>""</code>', '<code>[0]</code>'], answer: 2, explain: '빈 문자열 <code>""</code> 은 거짓입니다. <code>"0"</code> 은 글자가 하나 있는 문자열, <code>[0]</code> 은 항목이 하나 있는 리스트라서 참입니다.' }
        ],
        slides: [
          { layout: 'title', title: 'if~else 문', subtitle: 'Chapter 05 조건문 · Section 02', badge: '05-2',
            notes: '<p><b>[도입 1분]</b> 지난 시간 복습: “조건이 거짓이면 기본 if 문은 무엇을 하나요?” → 아무것도 안 한다. “거짓일 때도 무언가 하려면?” 으로 else 를 도입합니다.</p>' },
          { layout: 'diagram', title: 'if~else 문의 형식과 순서도', html: FIG_IFELSE, caption: '그림 5-3 — 참이면 문장 1, 거짓이면 문장 2',
            notes: '<p><b>[4분]</b> 기본 if 순서도와 비교: 거짓 쪽에도 사각형이 생겼습니다. “두 길 중 한 길만 간다 — 갈림길”.</p><p>else 는 조건식이 없고, if 와 같은 깊이로 쓴다는 점을 형식에서 표시해 주세요.</p>' },
          { layout: 'code', title: 'Code05-03. if~else 문', code: 'a = 200\n\nif a < 100 :\n    print("100보다 작군요.")\nelse :\n    print("100보다 크군요.")',
            points: ['200 &lt; 100 → False', 'else 블록(6행) 실행', 'a = 100 이면? (경계값)'],
            notes: '<p><b>[3분]</b> a 를 50, 100, 200 으로 바꿔 가며 실행합니다. 100일 때 “크군요”가 나오는 것을 보고 else 는 “나머지 전부”라는 점을 확인합니다.</p>' },
          { layout: 'diagram', title: 'Code05-03 실행 과정', html: FIG_0503, caption: '그림 5-4 — a = 200 이므로 빨간(거짓) 경로',
            notes: '<p><b>[2분]</b> 학생 한 명에게 순서도를 따라 말로 설명하게 합니다.</p>' },
          { layout: 'code', title: 'Code05-04. 블록마다 여러 문장', code: 'a = 200\n\nif a < 100 :\n    print("100보다 작군요.")\n    print("참이면 이 문장도 보이겠죠?")\nelse :\n    print("100보다 크군요.")\n    print("거짓이면 이 문장도 보이겠죠?")\n\nprint("프로그램 끝")',
            points: ['if 블록: 4~5행', 'else 블록: 7~8행', '10행은 항상 실행'],
            notes: '<p><b>[3분]</b> 출력 3줄을 예측하게 한 뒤 실행합니다. 이어서 10행을 들여쓰면 어떻게 될지(else 블록에 포함 → a 가 50이면 “프로그램 끝”이 안 나옴) 질문합니다.</p>' },
          { layout: 'code', title: 'Code05-05. 짝수 · 홀수 판별', code: 'a = int(input("정수를 입력하세요 : "))\n\nif a % 2 == 0 :\n    print("짝수를 입력했군요.")\nelse :\n    print("홀수를 입력했군요.")', stdin: '125\n',
            points: ['<code>%</code> : 나눈 나머지', '나머지 0 → 짝수', '배수 판별: <code>a % n == 0</code>'],
            notes: '<p><b>[5분]</b> “예시 입력으로 실행”(125) 후, 직접 124, 0, -3 을 입력해 봅니다. -3 % 2 는 파이썬에서 1이므로 홀수로 제대로 판별됩니다.</p><p>배수 판별 공식은 프로그램 1에서 다시 나오니 꼭 칠판에 적어 두세요.</p>' },
          { layout: 'table', title: '조건식을 풍부하게', head: ['표현', '의미', '예'], rows: [
            ['<code>and</code>', '둘 다 참', '<code>score &gt;= 0 and score &lt;= 100</code>'],
            ['<code>or</code>', '하나라도 참', '<code>ans == "y" or ans == "Y"</code>'],
            ['<code>not</code>', '참/거짓 뒤집기', '<code>not (a &gt; 10)</code>'],
            ['연쇄 비교', '파이썬 전용', '<code>0 &lt;= score &lt;= 100</code>'],
            ['거짓인 값', '0, "", [], None', '<code>bool("")</code> → False']
          ], lead: '논리 연산자와 참/거짓으로 취급되는 값',
            notes: '<p><b>[5분]</b> 4장에서 배운 논리 연산자를 조건문과 연결합니다.</p><p>주의: <code>ans == "y" or "Y"</code> 는 항상 참! 직접 실행해서 보여 주면 기억에 오래 남습니다.</p>' },
          { layout: 'code', title: 'random 과 if~else — 동전 던지기', code: 'import random\n\ncoin = random.randint(0, 1)\n\nif coin == 0 :\n    print("앞면이 나왔습니다.")\nelse :\n    print("뒷면이 나왔습니다.")',
            points: ['<code>randint(0, 1)</code> → 0 또는 1', '실행할 때마다 결과가 다름', '게임의 기본 재료'],
            notes: '<p><b>[3분]</b> 학생들에게 앞/뒤를 예측하게 한 뒤 여러 번 실행합니다. 5번 중 몇 번 맞혔는지 세어 보는 것도 재미있습니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>a</code> 가 홀수인지 판별하는 조건식은?', options: ['<code>a / 2 == 1</code>', '<code>a % 2 == 1</code>', '<code>a // 2 == 0</code>', '<code>a % 2 = 1</code>'], answer: 1, explain: '나머지 연산자 %, 비교는 == 를 사용합니다.',
            notes: '<p><b>[2분]</b> 오답 ①(<code>/</code>)을 고른 학생에게 셸에서 <code>7 / 2</code> 를 계산해 보게 하세요 (3.5).</p>' },
          { layout: 'practice', title: '실습 5-4. 3의 배수 박수 게임', desc: '정수를 입력받아 3의 배수이면 “짝!”, 아니면 숫자를 그대로 출력하세요.',
            starter: 'num = int(input("숫자를 입력하세요 : "))\n\n# TODO: 3의 배수이면 "짝!", 아니면 숫자 출력\n',
            solution: 'num = int(input("숫자를 입력하세요 : "))\n\nif num % 3 == 0 :\n    print("짝!")\nelse :\n    print(num)\n', stdin: '9\n',
            notes: '<p><b>[8분]</b> 실습 5-3(합격/불합격)을 먼저 하고 5-4로 넘어가도 좋습니다. 도전 과제로 실습 5-5(주사위 홀짝)를 제시합니다 — if~else 를 두 번 쓰는 구조라 다음 시간(중첩 if)의 좋은 다리가 됩니다.</p>' },
          { layout: 'summary', title: '정리', bullets: ['<code>if 조건 :</code> … <code>else :</code> … — 둘 중 <b>하나만</b> 실행', 'else 는 조건식 없이, if 와 같은 깊이', '짝수/홀수 · 배수 판별: <code>a % n == 0</code>', '<code>and</code> · <code>or</code> · <code>not</code>, 연쇄 비교 <code>0 &lt;= x &lt;= 100</code>', '<code>random.randint()</code> 와 조합하면 간단한 게임'],
            notes: '<p><b>[1분]</b> 다음 시간 예고: “갈림길이 3개 이상이면? 예) 학점 A, B, C, D, F” → 중첩 if 와 elif.</p>' }
        ]
      },

      /* ===================== ch05-3 ===================== */
      {
        id: 'ch05-3',
        title: '중첩 if 문과 if~elif~else',
        minutes: 50,
        goals: [
          'if 문 안에 if 문이 들어가는 중첩 if 문의 실행 흐름을 순서도로 따라갈 수 있다',
          '중첩 if 문으로 작성한 학점 계산 프로그램을 if~elif~else 로 바꿔 쓸 수 있다',
          'elif 는 위에서부터 차례로 검사하고 처음 참인 블록 하나만 실행한다는 것을 설명할 수 있다',
          '조건을 검사하는 순서가 결과에 영향을 준다는 것을 이해한다'
        ],
        flow: [['중첩 if 형식 · Code05-06', 10], ['학점 계산: 중첩 if (Code05-07)', 10], ['if~elif~else (Code05-08)', 12], ['조건 순서 · match 미리보기', 6], ['퀴즈 · SELF STUDY 5-1', 12]],
        content: [
          { type: 'h', text: '중첩 if 문 (if~else~if~else)' },
          { type: 'p', html: '<b>중첩 if 문(nested if)</b>은 if 문을 한 번 실행한 뒤, 그 결과 안에서 <b>if 문을 다시 실행</b>하는 구조입니다. 갈림길을 지나 또 갈림길을 만나는 것과 같습니다. 안쪽 if 문은 바깥 if(또는 else) 블록의 일부이므로 한 단계 더 들여씁니다.' },
          { type: 'figure', html: FIG_NESTED, caption: '그림 5-5 중첩 if 문의 형식과 순서도' },
          { type: 'list', items: [
            '조건식 1이 참이면 → 안쪽 if 문으로 들어가 조건식 2를 검사합니다. 조건식 2가 참이면 문장 1, 거짓이면 문장 2.',
            '조건식 1이 거짓이면 → 조건식 2는 <b>검사하지도 않고</b> 바깥 else 의 문장 3을 실행합니다.',
            '결국 문장 1 · 2 · 3 중 <b>하나만</b> 실행됩니다.'
          ] },
          { type: 'code', title: 'Code05-06. 중첩 if 문', code: `a = 75

if a > 50 :
    if a < 100 :
        print("50보다 크고 100보다 작군요.")
    else :
        print("와~~ 100보다 크군요.")
else :
    print("에고~ 50보다 작군요.")`, expect: '50보다 크고 100보다 작군요.',
            desc: '<code>75 &gt; 50</code> 이 참이므로 안쪽 if 로 들어갑니다. <code>75 &lt; 100</code> 도 참이므로 <code>5행</code>이 실행됩니다. 안쪽 if~else 는 8칸, 바깥 else 블록은 4칸 들여썼다는 점을 눈여겨보세요.' },
          { type: 'table', head: ['a 의 값', '바깥 조건 a &gt; 50', '안쪽 조건 a &lt; 100', '출력'], rows: [
            ['75', 'True', 'True', '50보다 크고 100보다 작군요.'],
            ['120', 'True', 'False', '와~~ 100보다 크군요.'],
            ['30', 'False', '(검사 안 함)', '에고~ 50보다 작군요.'],
            ['50', 'False', '(검사 안 함)', '에고~ 50보다 작군요.']
          ], caption: 'Code05-06 에 여러 값을 넣어 따라가 보기 — a = 50 은 “50보다 작다”가 아니라 “같다”이지만 else 로 간다' },
          { type: 'callout', kind: 'tip', title: '중첩 if 를 and 로 바꿀 수도 있다', html: '<code>if a &gt; 50 :</code> 안에 <code>if a &lt; 100 :</code> 이 있는 구조는 “둘 다 참”일 때 문장 1을 실행하므로 <code>if a &gt; 50 and a &lt; 100 :</code> 과 비슷합니다. 다만 각 경우마다 다른 메시지를 출력해야 할 때는 중첩 if 가 더 자연스럽습니다.' },
          { type: 'h', text: '학점 계산 — 중첩 if 로 여러 갈래 나누기' },
          { type: 'p', html: '점수를 입력받아 90점 이상은 A, 80점 이상은 B, 70점 이상은 C, 60점 이상은 D, 나머지는 F 를 출력해 봅시다. 갈래가 5개이므로 if~else 를 4번 중첩해야 합니다.' },
          { type: 'figure', html: FIG_GRADE, caption: '그림 5-6 Code05-07.py 실행 과정 — 거짓이면 오른쪽 아래로 내려가며 다음 조건을 검사' },
          { type: 'code', title: 'Code05-07. 중첩 if 문으로 학점 계산', code: CODE0507, stdin: '85\n', expect: '점수를 입력하세요 : 85\nB\n학점입니다. ^^',
            desc: '85점은 <code>score &gt;= 90</code> 이 거짓 → else 로 가서 <code>score &gt;= 80</code> 이 참 → “B” 출력. 중첩될수록 들여쓰기가 점점 깊어져(최대 16칸) 읽기 어려워집니다. (강의자료는 순서도만 싣고 있어, 순서도를 그대로 코드로 옮겼습니다.)' },
          { type: 'h', text: 'if~elif~else 문' },
          { type: 'p', html: '위 코드처럼 “else 안에 if” 가 계속 이어질 때는 <code>else :</code> + <code>if</code> 를 합친 <b><code>elif</code></b>(else if 의 줄임)를 쓰면 들여쓰기가 깊어지지 않고 훨씬 깔끔해집니다. 실행 결과는 Code05-07 과 똑같습니다.' },
          { type: 'code', title: 'Code05-08. if~elif~else 문으로 학점 계산', code: CODE0508, stdin: '77\n', expect: '점수를 입력하세요 : 77\nC\n학점입니다. ^^',
            desc: '<code>if</code> 는 맨 처음 한 번, <code>elif</code> 는 필요한 만큼 여러 번, <code>else</code> 는 맨 마지막에 한 번(생략 가능) 씁니다. 모두 <b>같은 깊이</b>로 씁니다.' },
          { type: 'figure', html: FIG_ELIF_TRACE, caption: 'elif 검사 과정 — 처음으로 참이 되는 곳에서 멈춘다' },
          { type: 'table', head: ['', '중첩 if (Code05-07)', 'if~elif~else (Code05-08)'], rows: [
            ['코드 줄 수', '17줄', '14줄'],
            ['들여쓰기 깊이', '갈래가 늘수록 계속 깊어짐', '항상 한 단계'],
            ['읽기 쉬움', '오른쪽으로 밀려 읽기 어려움', '위에서 아래로 목록처럼 읽힘'],
            ['실행 결과', '같음', '같음']
          ], caption: '갈래가 여러 개인 조건은 elif 로 쓰는 것이 파이썬다운 방법' },
          { type: 'callout', kind: 'warn', title: '조건을 검사하는 순서가 중요하다', html: 'elif 는 위에서부터 검사하다 처음 참인 곳에서 멈춥니다. 그래서 <b>범위가 좁은(엄격한) 조건부터</b> 써야 합니다. 아래 예제처럼 <code>score &gt;= 60</code> 을 맨 위에 두면 95점도 60 이상이므로 “D”가 출력됩니다.' },
          { type: 'code', title: '추가 예제. 조건 순서를 잘못 쓴 학점 계산', code: `score = 95

if score >= 60 :
    print("D")
elif score >= 70 :
    print("C")
elif score >= 80 :
    print("B")
elif score >= 90 :
    print("A")
else :
    print("F")`, expect: 'D',
            desc: '오류는 나지 않지만 결과가 틀립니다. 이런 오류를 <b>논리 오류</b>라고 하며, 파이썬이 알려 주지 않으므로 여러 값을 넣어 직접 확인해야 합니다.' },
          { type: 'callout', kind: 'more', title: '📘 elif 와 “if 를 여러 번” 은 다르다', html: '<code>elif</code> 대신 <code>if</code> 를 여러 번 나란히 쓰면 각 if 가 <b>독립적으로</b> 모두 검사됩니다. 예를 들어 95점이면 <code>if score &gt;= 90</code>, <code>if score &gt;= 80</code>, … 이 전부 참이 되어 A, B, C, D 가 모두 출력됩니다. “여러 갈래 중 하나만” 고르고 싶다면 반드시 elif 를 쓰세요.' },
          { type: 'code', title: '추가 예제. random 점수로 학점 매기기', code: `import random

score = random.randint(0, 100)
print("이번 점수 :", score)

if score >= 90 :
    grade = "A"
elif score >= 80 :
    grade = "B"
elif score >= 70 :
    grade = "C"
elif score >= 60 :
    grade = "D"
else :
    grade = "F"

print("학점 :", grade)`, nondeterministic: true,
            desc: 'print 를 각 블록에 쓰는 대신 결과를 <code>grade</code> 변수에 담아 마지막에 한 번만 출력했습니다. 이렇게 하면 출력 형식을 바꿀 때 한 곳만 고치면 됩니다.' }
        ],
        practice: [
          {
            title: 'SELF STUDY 5-1. 학점을 더 세분화하기',
            level: 2,
            desc: '<p>Code05-08 을 다음 기준처럼 세분화하세요.</p><p>95점 이상: A+, 90점 이상: A0, 85점 이상: B+, 80점 이상: B0, 75점 이상: C+, 70점 이상: C0, 65점 이상: D+, 60점 이상: D0, 60점 미만: F</p><pre>점수를 입력하세요 : 85\nB+\n학점입니다. ^^</pre>',
            hint: 'Code05-08 의 elif 사이사이에 5점 단위 조건을 끼워 넣습니다. <b>높은 점수부터</b> 검사해야 합니다.',
            starter: 'score = int(input("점수를 입력하세요 : "))\n\nif score >= 95 :\n    print("A+")\n# TODO: 90, 85, 80, 75, 70, 65, 60 기준을 elif 로 추가\nelse :\n    print("F")\n\nprint("학점입니다. ^^")\n',
            solution: SELF51,
            stdin: '85\n',
            expect: '점수를 입력하세요 : 85\nB+\n학점입니다. ^^'
          },
          {
            title: '실습 5-6. 윤년 판별기',
            level: 3,
            desc: '<p>연도를 입력받아 윤년인지 판별하세요. 윤년 규칙: ① 4로 나누어떨어지면 윤년, ② 그중 100으로 나누어떨어지면 평년, ③ 그중 400으로 나누어떨어지면 다시 윤년. <b>중첩 if 문</b>으로 작성해 보세요.</p><pre>연도를 입력하세요 : 1900\n1900년은 평년입니다.</pre>',
            hint: '<code>if year % 4 == 0 :</code> 안에 <code>if year % 100 == 0 :</code>, 그 안에 <code>if year % 400 == 0 :</code>. 2024(윤년), 1900(평년), 2000(윤년), 2023(평년)으로 확인하세요.',
            starter: 'year = int(input("연도를 입력하세요 : "))\n\n# TODO: 중첩 if 로 윤년/평년 판별\n',
            solution: 'year = int(input("연도를 입력하세요 : "))\n\nif year % 4 == 0 :\n    if year % 100 == 0 :\n        if year % 400 == 0 :\n            print("%d년은 윤년입니다." % year)\n        else :\n            print("%d년은 평년입니다." % year)\n    else :\n        print("%d년은 윤년입니다." % year)\nelse :\n    print("%d년은 평년입니다." % year)\n',
            stdin: '1900\n',
            expect: '연도를 입력하세요 : 1900\n1900년은 평년입니다.'
          }
        ],
        quiz: [
          { q: '다음 코드의 실행 결과는?<pre><code>a = 120\nif a &gt; 50 :\n    if a &lt; 100 :\n        print("가")\n    else :\n        print("나")\nelse :\n    print("다")</code></pre>', options: ['가', '나', '다', '가, 나 두 줄'], answer: 1, explain: '<code>120 &gt; 50</code> 참 → 안쪽 if 로 들어가 <code>120 &lt; 100</code> 거짓 → 안쪽 else 의 “나”.' },
          { q: 'score 가 85일 때 출력은?<pre><code>if score &gt;= 90 :\n    print("A")\nelif score &gt;= 80 :\n    print("B")\nelif score &gt;= 70 :\n    print("C")\nelse :\n    print("F")</code></pre>', options: ['A', 'B', 'B 와 C 두 줄', 'F'], answer: 1, explain: '처음으로 참이 되는 <code>score &gt;= 80</code> 에서 “B” 를 출력하고, 나머지 elif · else 는 검사하지 않습니다.' },
          { q: 'if~elif~else 에 대한 설명으로 <b>틀린</b> 것은?', options: ['elif 는 여러 번 쓸 수 있다', 'else 는 생략할 수 있다', '참인 조건이 여러 개면 해당 블록이 모두 실행된다', 'if, elif, else 는 같은 깊이로 쓴다'], answer: 2, explain: '위에서부터 검사해 <b>처음</b> 참인 블록 하나만 실행합니다.' },
          { q: '95점이 “D” 로 출력되는 잘못된 코드의 원인은?<pre><code>if score &gt;= 60 :\n    print("D")\nelif score &gt;= 90 :\n    print("A")</code></pre>', options: ['elif 대신 else 를 써야 해서', '넓은 범위의 조건(>= 60)을 먼저 검사해서', 'score 가 문자열이라서', '들여쓰기가 틀려서'], answer: 1, explain: '95 도 60 이상이므로 첫 조건에서 멈춥니다. 엄격한(좁은) 조건부터 검사해야 합니다.' },
          { q: '<code>elif</code> 는 무엇의 줄임말인가?', options: ['else if', 'else list', 'element if', 'end if'], answer: 0, explain: '<code>else :</code> 안에 <code>if</code> 가 들어가는 구조를 한 줄로 줄인 것이 <code>elif</code> 입니다.' }
        ],
        slides: [
          { layout: 'title', title: '중첩 if 문과 if~elif~else', subtitle: 'Chapter 05 조건문 · Section 03', badge: '05-3',
            notes: '<p><b>[도입 1분]</b> “성적표의 학점은 몇 가지죠? A, B, C, D, F — 다섯 갈래입니다. if~else 는 두 갈래뿐인데 어떻게 할까요?”</p>' },
          { layout: 'diagram', title: '중첩 if 문의 형식과 순서도', html: FIG_NESTED, caption: '그림 5-5 — if 안에 또 if',
            notes: '<p><b>[4분]</b> 조건식 1이 거짓이면 조건식 2는 검사조차 하지 않는다는 점을 강조합니다. 안쪽 if 는 한 단계 더 들여쓴다는 점을 형식에서 보여 주세요.</p>' },
          { layout: 'code', title: 'Code05-06. 중첩 if 문', code: 'a = 75\n\nif a > 50 :\n    if a < 100 :\n        print("50보다 크고 100보다 작군요.")\n    else :\n        print("와~~ 100보다 크군요.")\nelse :\n    print("에고~ 50보다 작군요.")',
            points: ['바깥 if: 4칸 / 안쪽 if: 8칸', 'a = 75 → 참, 참', 'a = 120, 30 으로 바꿔 보기'],
            notes: '<p><b>[5분]</b> a 값을 75 → 120 → 30 으로 바꿔 세 메시지를 모두 출력해 봅니다. 각 else 가 어느 if 와 짝인지 <b>세로 줄</b>(들여쓰기 위치)로 찾는 방법을 보여 주세요.</p>' },
          { layout: 'diagram', title: '학점 계산 순서도 (Code05-07)', html: FIG_GRADE, caption: '그림 5-6 — 거짓이면 다음 조건으로',
            notes: '<p><b>[3분]</b> 85점을 넣어 손가락으로 따라갑니다: 90? 거짓 → 80? 참 → B → 학점입니다.</p><p>“이걸 중첩 if 로 쓰면 들여쓰기가 몇 단계가 될까요?” 하고 다음 슬라이드로.</p>' },
          { layout: 'code', title: 'Code05-07. 중첩 if 로 학점 계산', code: CODE0507, stdin: '85\n',
            points: ['else 안에 if 가 4번', '들여쓰기가 계단처럼 깊어짐', '읽기 · 고치기 어려움'],
            notes: '<p><b>[4분]</b> 실행해서 결과를 확인한 뒤 “코드 모양이 어떤가요?” — 오른쪽으로 밀려 나가는 계단 모양. 갈래가 10개면? 이 불편함이 elif 의 동기입니다.</p>' },
          { layout: 'code', title: 'Code05-08. if~elif~else', code: CODE0508, stdin: '77\n',
            points: ['<code>elif</code> = else + if', 'if · elif · else 모두 같은 깊이', '결과는 Code05-07 과 같음'],
            notes: '<p><b>[5분]</b> 두 코드를 나란히 띄워 비교합니다. 같은 점수(85, 77, 55)로 두 코드를 실행해 결과가 같다는 것을 확인하세요.</p>' },
          { layout: 'diagram', title: 'elif 는 처음 참인 곳에서 멈춘다', html: FIG_ELIF_TRACE, caption: 'score = 77 → 세 번째 조건에서 C 출력, 나머지는 검사 안 함',
            notes: '<p><b>[3분]</b> 발문: “77은 60 이상이기도 한데 왜 D 는 안 나올까요?” → 이미 C 에서 멈췄기 때문.</p>' },
          { layout: 'two', title: '조건 순서가 중요하다',
            left: { title: '✗ 넓은 조건부터 (95 → D)', code: 'score = 95\n\nif score >= 60 :\n    print("D")\nelif score >= 90 :\n    print("A")\nelse :\n    print("F")' },
            right: { title: '✓ 좁은 조건부터 (95 → A)', code: 'score = 95\n\nif score >= 90 :\n    print("A")\nelif score >= 60 :\n    print("D")\nelse :\n    print("F")' },
            notes: '<p><b>[4분]</b> 두 코드를 실행해 비교합니다. 오류 메시지가 없는 “논리 오류”라서 더 위험하다는 점을 강조하세요.</p><p>추가: elif 대신 if 를 여러 번 쓰면 모두 검사되어 여러 줄이 출력된다는 것도 즉석에서 보여 줄 수 있습니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: 'score 가 85일 때 출력은?<pre><code>if score &gt;= 90 :\n    print("A")\nelif score &gt;= 80 :\n    print("B")\nelif score &gt;= 70 :\n    print("C")\nelse :\n    print("F")</code></pre>', options: ['A', 'B', 'B 와 C 두 줄', 'F'], answer: 1, explain: '처음으로 참인 score >= 80 에서 B 를 출력하고 끝납니다.',
            notes: '<p><b>[2분]</b> “B 와 C 두 줄” 을 고른 학생이 있다면 elif 와 if 의 차이를 다시 설명합니다.</p>' },
          { layout: 'practice', title: 'SELF STUDY 5-1. 학점 세분화', desc: '95↑ A+, 90↑ A0, 85↑ B+, 80↑ B0, 75↑ C+, 70↑ C0, 65↑ D+, 60↑ D0, 나머지 F 로 Code05-08 을 세분화하세요. (85 → B+)',
            starter: 'score = int(input("점수를 입력하세요 : "))\n\nif score >= 95 :\n    print("A+")\n# TODO: 90, 85, 80, 75, 70, 65, 60 기준을 elif 로 추가\nelse :\n    print("F")\n\nprint("학점입니다. ^^")\n',
            solution: SELF51, stdin: '85\n',
            notes: '<p><b>[10분]</b> 조건 순서를 거꾸로 쓴 학생이 없는지 확인합니다. 경계값(95, 94, 60, 59)으로 테스트하는 법을 알려 주세요.</p><p>도전: 실습 5-6 윤년 판별(중첩 if).</p>' },
          { layout: 'summary', title: '정리', bullets: ['중첩 if: if 블록 안에 또 if — 한 단계 더 들여쓰기', '갈래가 많으면 중첩이 깊어져 읽기 어려움', '<code>if ~ elif ~ elif ~ else</code> — 같은 깊이로 깔끔하게', '위에서부터 검사, <b>처음 참인 블록 하나만</b> 실행', '<b>좁은 조건부터</b> 검사해야 논리 오류가 없다'],
            notes: '<p><b>[1분]</b> 다음 시간: if~else 를 한 줄로 줄이는 조건부 표현식, 그리고 [프로그램 1] 무지개 원 완성!</p>' }
        ]
      },

      /* ===================== ch05-4 ===================== */
      {
        id: 'ch05-4',
        title: '조건부 표현식과 [프로그램 1] 무지개 원',
        minutes: 50,
        goals: [
          '삼항 연산자(조건부 표현식)로 if~else 를 한 줄로 줄일 수 있다',
          'for 문과 range() 로 같은 동작을 여러 번 반복하는 방법을 맛본다',
          'elif 와 % 연산자로 반지름에 따라 펜 색을 고르는 규칙을 이해한다',
          '거북이 그래픽으로 [프로그램 1] 무지개 색상의 원을 완성한다'
        ],
        flow: [['조건부 표현식', 12], ['반복문 맛보기: for · range', 8], ['[프로그램 1] 설계 · 색 규칙', 10], ['[프로그램 1] 완성 · 변형', 12], ['퀴즈 · 실습', 8]],
        content: [
          { type: 'h', text: '삼항 연산자를 사용한 if 문 (조건부 표현식)' },
          { type: 'p', html: '조건에 따라 변수에 <b>값 하나를 골라 넣는</b> if~else 문은 자주 등장합니다. 예를 들어 점수가 60 이상이면 “합격”, 아니면 “불합격”을 변수에 넣는 코드를 봅시다.' },
          { type: 'code', title: '삼항 연산자 사용 전 (if~else 문)', code: `jumsu = 55
res = ''
if jumsu >= 60 :
    res = '합격'
else :
    res = '불합격'
print(res)`, expect: '불합격',
            desc: '<code>3~6행</code> 네 줄이 하는 일은 결국 “res 에 둘 중 하나의 값을 넣는 것” 뿐입니다.' },
          { type: 'p', html: '파이썬에서는 이 네 줄을 <b>한 줄</b>로 줄일 수 있습니다. 이를 <b>삼항 연산자</b> 또는 <b>조건부 표현식(conditional expression)</b>이라고 합니다. 형식은 <code>참일 때의 값 if 조건식 else 거짓일 때의 값</code> 입니다.' },
          { type: 'code', title: '삼항 연산자 사용 후 (3~6행을 한 줄로)', code: `jumsu = 55
res = '합격' if jumsu >= 60 else '불합격'
print(res)`, expect: '불합격' },
          { type: 'figure', html: FIG_TERNARY, caption: '조건부 표현식의 구조 — 가운데 조건식을 먼저 계산하고, 결과에 따라 왼쪽 또는 오른쪽 값을 고른다' },
          { type: 'callout', kind: 'warn', title: '다른 언어와 순서가 다르다', html: 'C · 자바의 삼항 연산자는 <code>조건 ? 참값 : 거짓값</code> 순서이지만, 파이썬은 <code>참값 if 조건 else 거짓값</code> 순서입니다. 영어 문장 “<i>pass</i> if score ≥ 60, else <i>fail</i>” 처럼 읽으면 기억하기 쉽습니다. 또 조건부 표현식에서는 <b>else 를 생략할 수 없습니다</b>.' },
          { type: 'code', title: '추가 예제. 조건부 표현식 활용', code: `a = int(input("첫 번째 수 : "))
b = int(input("두 번째 수 : "))

bigger = a if a > b else b
print("더 큰 수는", bigger)

kind = "짝수" if a % 2 == 0 else "홀수"
print(a, "는(은)", kind)

print("같은 수입니다." if a == b else "다른 수입니다.")`, stdin: '7\n12\n', expect: '첫 번째 수 : 7\n두 번째 수 : 12\n더 큰 수는 12\n7 는(은) 홀수\n다른 수입니다.',
            desc: '조건부 표현식은 <b>값</b>이 되므로 변수에 대입할 수도 있고, <code>print()</code> 의 괄호 안에 바로 넣을 수도 있습니다.' },
          { type: 'callout', kind: 'more', title: '📘 언제 조건부 표현식을 쓸까?', html: '“둘 중 하나의 <b>값</b>을 고르는” 간단한 경우에만 쓰세요. 블록 안에서 여러 문장을 실행해야 하거나, 갈래가 셋 이상이면 일반 if 문이 훨씬 읽기 쉽습니다. 조건부 표현식을 겹쳐 쓰는 것(<code>"A" if s &gt;= 90 else "B" if s &gt;= 80 else "C"</code>)도 가능하지만 권장하지 않습니다.' },
          { type: 'h', text: '반복문 맛보기 — for 와 range()' },
          { type: 'p', html: '[프로그램 1]은 원을 약 250개 그립니다. <code>turtle.circle()</code> 을 250줄 쓸 수는 없으니, 같은 일을 여러 번 반복해 주는 <b>for 문</b>을 잠깐 빌려 씁니다. (반복문은 6장에서 자세히 배웁니다.)' },
          { type: 'code', title: '추가 예제. for 문과 range() 맛보기', code: `for radius in range(1, 6) :
    print("반지름", radius, "인 원을 그립니다.")

print("반복 끝")`, expect: '반지름 1 인 원을 그립니다.\n반지름 2 인 원을 그립니다.\n반지름 3 인 원을 그립니다.\n반지름 4 인 원을 그립니다.\n반지름 5 인 원을 그립니다.\n반복 끝',
            desc: '<code>range(1, 6)</code> 은 1부터 <b>6 직전</b>(5)까지의 수를 차례로 만들어 줍니다. 그 수가 하나씩 <code>radius</code> 에 들어가며 들여쓴 블록이 반복 실행됩니다. if 문처럼 콜론과 들여쓰기 규칙이 똑같습니다.' },
          { type: 'code', title: '추가 예제. 반복문 안에서 if 문 쓰기', code: `for num in range(1, 11) :
    if num % 2 == 0 :
        print(num, "짝수")
    else :
        print(num, "홀수")`, expect: '1 홀수\n2 짝수\n3 홀수\n4 짝수\n5 홀수\n6 짝수\n7 홀수\n8 짝수\n9 홀수\n10 짝수',
            desc: 'for 블록(4칸) 안에 if~else 블록(8칸)이 들어 있습니다. 반복할 때마다 조건을 새로 검사하므로 줄마다 결과가 달라집니다. [프로그램 1]이 바로 이 구조입니다.' },
          { type: 'h', text: '[프로그램 1] 무지개 색상의 원 — 설계' },
          { type: 'p', html: '거북이를 화면 아래쪽 가운데에 두고 <code>turtle.circle(radius)</code> 로 원을 그리면, 거북이가 서 있는 점에서 시작해 왼쪽으로 돌며 원을 그리고 제자리로 돌아옵니다. 반지름을 1부터 249까지 늘려 가며 그리면 모든 원이 아래쪽 한 점에서 만나는 그림이 됩니다.' },
          { type: 'p', html: '색은 반지름에 따라 다음 <b>규칙</b>으로 고릅니다. 위에서부터 차례로 검사하므로 12는 6의 배수(빨강)이자 4 · 3 · 2 의 배수이지만 <b>처음 참인</b> 빨강이 됩니다.' },
          { type: 'table', head: ['조건 (위에서부터 검사)', '펜 색', '예 (반지름)'], rows: [
            ['<code>radius % 6 == 0</code>', '<span style="color:red">■</span> red', '6, 12, 18, 24 …'],
            ['<code>radius % 5 == 0</code>', '<span style="color:orange">■</span> orange', '5, 10, 15, 20, 25 …'],
            ['<code>radius % 4 == 0</code>', '<span style="color:#e6c200">■</span> yellow', '4, 8, 16, 28 …'],
            ['<code>radius % 3 == 0</code>', '<span style="color:green">■</span> green', '3, 9, 21, 27 …'],
            ['<code>radius % 2 == 0</code>', '<span style="color:blue">■</span> blue', '2, 14, 22, 26 …'],
            ['<code>radius % 1 == 0</code>', '<span style="color:navy">■</span> navyblue', '1, 7, 11, 13 … (나머지 전부)'],
            ['else', '<span style="color:purple">■</span> purple', '실행되지 않음 (모든 정수는 1의 배수)']
          ], caption: '[프로그램 1]의 색 규칙' },
          { type: 'figure', html: FIG_DOTS, caption: '반지름 1~36 에 적용된 색 — 6의 배수가 가장 먼저 검사되므로 12, 24, 30 도 빨강' },
          { type: 'callout', kind: 'info', title: 'else 의 purple 은 왜 안 나올까?', html: '어떤 정수든 1로 나누면 나머지가 0이므로 <code>radius % 1 == 0</code> 은 <b>항상 참</b>입니다. 따라서 마지막 <code>else</code> 블록은 실행될 일이 없습니다. 강의자료 코드를 그대로 두었지만, <code>elif radius % 1 == 0 :</code> 을 지우고 그 자리를 <code>else :</code> 로 해도 결과가 같습니다.' },
          { type: 'h', text: '[프로그램 1]의 완성' },
          { type: 'p', html: '먼저 창과 거북이를 준비하는 부분(<code>1~14행</code>)입니다. <code>swidth, sheight = 500, 500</code> 은 두 변수에 값을 한꺼번에 넣는 문장이고, <code>setup()</code> 으로 창 크기를, <code>screensize()</code> 로 그림판 크기를 정합니다. <code>penup()</code> 으로 펜을 든 채 <code>goto(0, -250)</code> 으로 아래쪽 가운데로 이동한 뒤 <code>pendown()</code> 으로 펜을 내립니다.' },
          { type: 'code', title: 'Code05-09 앞부분. 창과 거북이 준비하기', code: `import turtle

## 전역 변수 선언 부분 ##
swidth, sheight = 500, 500

## 메인 코드 부분 ##
turtle.title('무지개색 원그리기')
turtle.shape('turtle')
turtle.setup(width = swidth + 50, height = sheight + 50)
turtle.screensize(swidth, sheight)
turtle.penup()
turtle.goto(0, -sheight / 2)
turtle.pendown()
turtle.speed(10)

turtle.circle(100)
turtle.circle(200)

turtle.done()`, desc: '앞부분만 실행해 보기 위해 원 두 개(반지름 100, 200)를 그려 보았습니다. 두 원이 아래쪽 한 점에서 만나는 것을 확인하세요.' },
          { type: 'code', title: '[프로그램 1] 완성: Code05-09. 무지개 색상의 원', code: CODE0509,
            desc: '<code>16행</code>의 for 문이 반지름 1~249 로 반복하고, 반복할 때마다 <code>17~30행</code>의 if~elif~else 가 펜 색을 고른 뒤 <code>32행</code>에서 원을 그립니다. 원이 249개라 그리는 데 시간이 걸립니다. 빨리 보고 싶다면 <code>speed(10)</code> 을 <code>speed(0)</code>(가장 빠름)으로 바꿔 보세요.' },
          { type: 'callout', kind: 'warn', title: '브라우저에서는 navyblue 대신 navy', html: '강의자료의 <code>turtle.pencolor(\'navyblue\')</code> 는 PC 의 파이썬(tkinter)에서는 남색으로 그려지지만, 이 강좌의 브라우저 화면은 웹 색 이름을 쓰기 때문에 <code>navyblue</code> 를 알아보지 못해 검은색으로 그려집니다. 그래서 위 코드는 같은 색인 <code>\'navy\'</code> 로 바꾸었습니다. 집에서 IDLE 로 실행할 때는 <code>navyblue</code> 로 써도 됩니다.' },
          { type: 'figure', html: FIG_RAINBOW, caption: '[프로그램 1] 실행 결과 (그림은 원을 3개마다 하나씩만 그린 미리보기)' },
          { type: 'callout', kind: 'more', title: '📘 PC 의 IDLE 에서 실행하려면', html: '집에서 파이썬을 설치했다면 IDLE 에서 [File] → [New File] 로 새 파일을 열고 코드를 붙여 넣은 뒤 저장하고 <b>F5</b> 로 실행합니다. 거북이 창은 <code>turtle.done()</code> 덕분에 닫기 전까지 유지됩니다. 이 강좌에서는 편집기에서 ▶ 실행(Ctrl+Enter)하면 페이지 위에 거북이 창이 뜹니다.' },
          { type: 'code', title: '추가 예제. 조건부 표현식으로 두 가지 색 번갈아 쓰기', code: `import turtle

turtle.shape('turtle')
turtle.penup()
turtle.goto(0, -200)
turtle.pendown()
turtle.speed(0)
turtle.pensize(2)

for radius in range(10, 200, 10) :
    turtle.pencolor('red' if radius % 20 == 0 else 'blue')
    turtle.circle(radius)

turtle.done()`,
            desc: '색이 두 가지뿐이면 if~else 대신 조건부 표현식 한 줄로 충분합니다. <code>range(10, 200, 10)</code> 은 10, 20, 30, … 190 처럼 10씩 커지는 수를 만듭니다.' }
        ],
        practice: [
          {
            title: '실습 5-7. 조건부 표현식으로 바꾸기',
            level: 1,
            desc: '<p>아래 if~else 문을 조건부 표현식 한 줄로 바꾸세요. 실행 결과는 같아야 합니다.</p><pre>temp = 31\nif temp >= 30 :\n    msg = "더워요"\nelse :\n    msg = "괜찮아요"\nprint(msg)</pre>',
            hint: '<code>msg = 참일 때의 값 if 조건식 else 거짓일 때의 값</code>',
            starter: 'temp = 31\n\n# TODO: 조건부 표현식 한 줄로 msg 정하기\nmsg = ""\n\nprint(msg)\n',
            solution: 'temp = 31\n\nmsg = "더워요" if temp >= 30 else "괜찮아요"\n\nprint(msg)\n',
            expect: '더워요'
          },
          {
            title: '실습 5-8. 나만의 무지개 원',
            level: 2,
            desc: '<p>Code05-09 를 변형해, 반지름을 <b>5씩</b> 늘리며(5, 10, 15, … 245) 원을 그리고, 색 규칙을 다음처럼 바꾸세요.</p><ul><li>반지름이 100 미만: <code>\'purple\'</code></li><li>100 이상 200 미만: <code>\'green\'</code></li><li>200 이상: <code>\'orange\'</code></li></ul>',
            hint: '<code>for radius in range(5, 250, 5) :</code> 안에서 <code>if radius &lt; 100 :</code> / <code>elif radius &lt; 200 :</code> / <code>else :</code>.',
            starter: 'import turtle\n\nturtle.shape(\'turtle\')\nturtle.penup()\nturtle.goto(0, -250)\nturtle.pendown()\nturtle.speed(0)\n\nfor radius in range(5, 250, 5) :\n    # TODO: 반지름에 따라 펜 색 정하기\n    turtle.circle(radius)\n\nturtle.done()\n',
            solution: 'import turtle\n\nturtle.shape(\'turtle\')\nturtle.penup()\nturtle.goto(0, -250)\nturtle.pendown()\nturtle.speed(0)\n\nfor radius in range(5, 250, 5) :\n    if radius < 100 :\n        turtle.pencolor(\'purple\')\n    elif radius < 200 :\n        turtle.pencolor(\'green\')\n    else :\n        turtle.pencolor(\'orange\')\n    turtle.circle(radius)\n\nturtle.done()\n'
          }
        ],
        quiz: [
          { q: `다음 코드의 실행 결과는?<pre><code>jumsu = 75\nres = '합격' if jumsu &gt;= 60 else '불합격'\nprint(res)</code></pre>`, options: ['합격', '불합격', 'True', '오류'], answer: 0, explain: '<code>75 &gt;= 60</code> 이 참이므로 if 왼쪽의 값 \'합격\' 이 res 에 들어갑니다.' },
          { q: '파이썬 조건부 표현식의 올바른 형식은?', options: ['<code>조건 ? 참값 : 거짓값</code>', '<code>참값 if 조건 else 거짓값</code>', '<code>if 조건 참값 else 거짓값</code>', '<code>참값 if 조건</code>'], answer: 1, explain: '파이썬은 <code>참값 if 조건 else 거짓값</code> 순서이며 else 를 생략할 수 없습니다. ①은 C · 자바의 형식입니다.' },
          { q: '<code>for radius in range(1, 250)</code> 에서 radius 가 가지는 마지막 값은?', options: ['1', '248', '249', '250'], answer: 2, explain: 'range(시작, 끝) 은 끝 값 <b>직전</b>까지 만듭니다. 1 ~ 249.' },
          { q: '[프로그램 1]의 색 규칙에서 반지름 30 의 펜 색은?', options: ['red (6의 배수)', 'orange (5의 배수)', 'green (3의 배수)', 'blue (2의 배수)'], answer: 0, explain: '30 은 6 · 5 · 3 · 2 의 배수이지만, 가장 먼저 검사하는 <code>radius % 6 == 0</code> 이 참이므로 red 입니다.' },
          { q: '[프로그램 1]에서 마지막 <code>else :</code> 의 purple 이 한 번도 쓰이지 않는 이유는?', options: ['purple 은 turtle 에 없는 색이라서', '<code>radius % 1 == 0</code> 이 항상 참이라서', 'range 에 0 이 포함되지 않아서', 'else 는 for 문 안에서 동작하지 않아서'], answer: 1, explain: '모든 정수는 1로 나누어떨어지므로 그 바로 앞의 elif 가 항상 참입니다.' }
        ],
        slides: [
          { layout: 'title', title: '조건부 표현식과 [프로그램 1]', subtitle: 'Chapter 05 조건문 · Section 03 — 무지개 색상의 원', badge: '05-4',
            notes: '<p><b>[도입 1분]</b> 오늘은 짧게 쓰는 요령(조건부 표현식)을 익히고, 지금까지 배운 elif 로 첫 번째 완성 프로그램을 만듭니다.</p>' },
          { layout: 'two', title: '삼항 연산자를 사용한 if 문',
            left: { title: 'if~else (7줄)', code: "jumsu = 55\nres = ''\nif jumsu >= 60 :\n    res = '합격'\nelse :\n    res = '불합격'\nprint(res)" },
            right: { title: '조건부 표현식 (3줄)', code: "jumsu = 55\nres = '합격' if jumsu >= 60 else '불합격'\nprint(res)" },
            notes: '<p><b>[4분]</b> 3~6행이 “res 에 둘 중 하나의 값을 넣는 일”만 한다는 점을 먼저 확인시키고 오른쪽의 한 줄로 줄입니다. 두 코드 모두 실행해 결과가 같음을 보여 주세요.</p>' },
          { layout: 'diagram', title: '조건부 표현식의 구조', html: FIG_TERNARY, caption: '참값 if 조건식 else 거짓값',
            notes: '<p><b>[3분]</b> 읽는 순서는 “가운데(조건) → 왼쪽 또는 오른쪽”. 자바/C 를 아는 학생에게는 <code>? :</code> 와 순서가 다르다는 점을 짚어 줍니다.</p><p>else 를 빼면 SyntaxError 가 난다는 것도 보여 주세요.</p>' },
          { layout: 'code', title: '조건부 표현식 활용', code: 'a = int(input("첫 번째 수 : "))\nb = int(input("두 번째 수 : "))\n\nbigger = a if a > b else b\nprint("더 큰 수는", bigger)\n\nprint("같은 수입니다." if a == b else "다른 수입니다.")', stdin: '7\n12\n',
            points: ['결과가 <b>값</b>이므로 대입 가능', 'print() 안에 바로 넣기도 가능', '간단한 두 갈래에만 사용'],
            notes: '<p><b>[3분]</b> 같은 수(5, 5)를 넣어 마지막 줄이 바뀌는 것도 확인합니다.</p>' },
          { layout: 'code', title: '반복문 맛보기: for · range()', code: 'for num in range(1, 11) :\n    if num % 2 == 0 :\n        print(num, "짝수")\n    else :\n        print(num, "홀수")',
            points: ['<code>range(1, 11)</code> → 1~10', '블록을 10번 반복 실행', '반복할 때마다 if 로 판단'],
            notes: '<p><b>[6분]</b> 반복문은 6장에서 자세히 배우므로 “range 의 수가 하나씩 변수에 들어가며 블록이 반복된다” 정도만 설명합니다.</p><p>들여쓰기 두 단계(for 4칸, if 블록 8칸)를 강조하세요. 프로그램 1의 구조와 똑같습니다.</p>' },
          { layout: 'bullets', title: '[프로그램 1] 설계', lead: '반지름 1~249 의 원을 아래쪽 한 점에서 그린다',
            bullets: ['거북이를 <code>goto(0, -250)</code> — 아래쪽 가운데로', '<code>circle(radius)</code> — 제자리에서 출발해 한 바퀴', '반지름에 따라 <b>if~elif</b> 로 펜 색 결정', ['6의 배수 → red, 5 → orange, 4 → yellow', '3 → green, 2 → blue, 나머지 → navy'], '위에서부터 검사: 12 는 red (6이 먼저)'],
            notes: '<p><b>[4분]</b> 칠판에 반지름 1~12 를 쓰고 학생들과 함께 색을 정해 봅니다. 12 를 두고 “빨강? 노랑? 초록? 파랑?” 논쟁을 시킨 뒤 “elif 는 처음 참에서 멈춘다” 로 정리합니다.</p>' },
          { layout: 'diagram', title: '반지름에 따른 펜 색', html: FIG_DOTS, caption: '반지름 1~36 — 6의 배수가 가장 먼저 검사된다',
            notes: '<p><b>[2분]</b> 짝수 중 파랑이 드문 이유(6 · 4 의 배수가 먼저 가져감), 홀수는 대부분 navy 라는 점을 그림에서 찾게 합니다.</p><p>else 의 purple 은 절대 나오지 않는다 — <code>radius % 1 == 0</code> 은 항상 참.</p>' },
          { layout: 'code', title: 'Code05-09 앞부분: 창과 거북이 준비', code: "import turtle\n\nswidth, sheight = 500, 500\n\nturtle.title('무지개색 원그리기')\nturtle.shape('turtle')\nturtle.setup(width = swidth + 50, height = sheight + 50)\nturtle.screensize(swidth, sheight)\nturtle.penup()\nturtle.goto(0, -sheight / 2)\nturtle.pendown()\nturtle.speed(10)\n\nturtle.circle(100)\nturtle.circle(200)\nturtle.done()",
            points: ['<code>swidth, sheight = 500, 500</code> 동시 대입', 'penup → goto → pendown', '원 두 개가 아래 한 점에서 만남'],
            notes: '<p><b>[3분]</b> 전체 코드를 한 번에 치기 전에 준비 부분만 실행해 원의 위치를 확인합니다. <code>goto(0, -sheight / 2)</code> 의 y 가 -250.0 이라는 점도 짚어 줍니다.</p>' },
          { layout: 'code', title: '[프로그램 1] 완성 (Code05-09 반복 부분)', code: "import turtle\n\nturtle.shape('turtle')\nturtle.penup()\nturtle.goto(0, -250)\nturtle.pendown()\nturtle.speed(0)\n\nfor radius in range(1, 250) :\n    if radius % 6 == 0 :\n        turtle.pencolor('red')\n    elif radius % 5 == 0 :\n        turtle.pencolor('orange')\n    elif radius % 4 == 0 :\n        turtle.pencolor('yellow')\n    elif radius % 3 == 0 :\n        turtle.pencolor('green')\n    elif radius % 2 == 0 :\n        turtle.pencolor('blue')\n    else :\n        turtle.pencolor('navy')\n    turtle.circle(radius)\n\nturtle.done()",
            points: ['for 로 반지름 1~249 반복', 'if~elif 로 색 선택 → circle()', '<code>navyblue</code> → 브라우저에선 <code>navy</code>', '전체 코드는 학생 문서 참고'],
            notes: '<p><b>[8분]</b> 슬라이드에는 18줄 제한 때문에 창 설정을 줄이고, 항상 참인 <code>radius % 1 == 0</code> 을 else 로 합친 버전을 실었습니다. 학생 문서의 Code05-09 가 강의자료 원본입니다.</p><p>speed(0) 은 가장 빠른 속도. 수업 시간이 부족하면 이 값을 쓰세요. navyblue 는 tkinter 전용 색 이름이라 브라우저에서는 navy 로 바꿨다는 점을 알려 주세요.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '[프로그램 1]에서 반지름 30 의 펜 색은?', options: ['red (6의 배수)', 'orange (5의 배수)', 'green (3의 배수)', 'blue (2의 배수)'], answer: 0, explain: '30 은 여러 수의 배수이지만 가장 먼저 검사하는 6의 배수 조건에서 멈춥니다.',
            notes: '<p><b>[2분]</b> 이어서 “반지름 25 는?” (orange), “반지름 49 는?” (navy) 를 구두로 물어봅니다.</p>' },
          { layout: 'practice', title: '실습 5-8. 나만의 무지개 원', desc: '반지름을 5씩 늘리며(5~245) 원을 그리고, 100 미만 purple / 200 미만 green / 나머지 orange 로 색을 정하세요.',
            starter: "import turtle\n\nturtle.shape('turtle')\nturtle.penup()\nturtle.goto(0, -250)\nturtle.pendown()\nturtle.speed(0)\n\nfor radius in range(5, 250, 5) :\n    # TODO: 반지름에 따라 펜 색 정하기\n    turtle.circle(radius)\n\nturtle.done()\n",
            solution: "import turtle\n\nturtle.shape('turtle')\nturtle.penup()\nturtle.goto(0, -250)\nturtle.pendown()\nturtle.speed(0)\n\nfor radius in range(5, 250, 5) :\n    if radius < 100 :\n        turtle.pencolor('purple')\n    elif radius < 200 :\n        turtle.pencolor('green')\n    else :\n        turtle.pencolor('orange')\n    turtle.circle(radius)\n\nturtle.done()\n",
            notes: '<p><b>[8분]</b> 자유롭게 색 규칙을 바꿔 보게 하고, 멋진 작품은 화면을 공유해 발표시킵니다. <code>turtle.pensize(3)</code> 을 추가하면 색이 더 선명해집니다.</p>' },
          { layout: 'summary', title: '정리', bullets: ['조건부 표현식: <code>참값 if 조건 else 거짓값</code>', '둘 중 하나의 <b>값</b>을 고를 때 한 줄로', '<code>for 변수 in range(시작, 끝)</code> — 끝 직전까지 반복', '반복 + if~elif → 반복마다 다른 동작', '[프로그램 1] 완성: 반지름의 배수 규칙으로 무지개 색'],
            notes: '<p><b>[1분]</b> 다음 시간: 리스트와 <code>in</code>, 그리고 [프로그램 2] 종합 계산기.</p>' }
        ]
      },

      /* ===================== ch05-5 ===================== */
      {
        id: 'ch05-5',
        title: 'if 문 응용과 [프로그램 2] 종합 계산기',
        minutes: 50,
        goals: [
          '리스트를 만들고 append() 로 항목을 추가할 수 있다',
          'in · not in 연산자로 리스트에 항목이 있는지 조건을 검사할 수 있다',
          'random 과 리스트 · 조건문을 함께 활용할 수 있다',
          'if~elif~else 와 eval() 을 이용해 [프로그램 2] 종합 계산기를 완성한다'
        ],
        flow: [['리스트 · append', 8], ['in / not in 과 if (Code05-10)', 12], ['[프로그램 2] 설계 · 완성', 15], ['eval 주의 · match 미리보기', 5], ['SELF STUDY 5-2, 5-3', 10]],
        content: [
          { type: 'h', text: '리스트와 함께 사용하기' },
          { type: 'p', html: '<b>리스트(list)</b>는 데이터 여러 개를 한곳에 담아 놓은 것입니다. 대괄호 <code>[ ]</code> 로 묶고 그 안에 값들을 쉼표로 구분해 넣습니다. 변수 하나에 값을 여러 개 담을 수 있는 “칸이 여러 개인 상자”라고 생각하면 됩니다. (리스트는 8장에서 자세히 배웁니다.)' },
          { type: 'code', title: '리스트 만들기', code: `fruit = ['사과', '배', '딸기', '포도']
print(fruit)`, expect: "['사과', '배', '딸기', '포도']",
            desc: 'fruit 변수에 값 4개를 리스트 하나로 묶어 대입했습니다.' },
          { type: 'p', html: '리스트 이름 뒤에 <code>.append(값)</code> 을 붙이면 리스트의 <b>맨 뒤에</b> 항목을 추가할 수 있습니다.' },
          { type: 'code', title: '리스트에 항목 추가하기 — append()', code: `fruit = ['사과', '배', '딸기', '포도']
fruit.append('귤')
print(fruit)`, expect: "['사과', '배', '딸기', '포도', '귤']" },
          { type: 'figure', html: FIG_LIST, caption: '리스트의 구조와 append() · in 연산자' },
          { type: 'h', text: 'if 항목 in 리스트' },
          { type: 'p', html: '<code>항목 in 리스트</code> 는 리스트에 해당 항목이 <b>있으면 True</b>, 없으면 False 가 되는 조건식입니다. 반대로 <code>항목 not in 리스트</code> 는 <b>없으면 True</b> 입니다. 이 조건식을 if 문과 함께 쓰면 “목록에 있는지” 를 아주 쉽게 검사할 수 있습니다.' },
          { type: 'code', title: 'if 항목 in 리스트', code: `fruit = ['사과', '배', '딸기', '포도']

if '딸기' in fruit :
    print("딸기가 있네요. ^^")`, expect: '딸기가 있네요. ^^' },
          { type: 'code', repl: true, title: '셸에서 in · not in 확인하기', code: "fruit = ['사과', '배', '딸기', '포도']\n'딸기' in fruit\n'수박' in fruit\n'수박' not in fruit\n'a' in 'banana'",
            expect: ">>> fruit = ['사과', '배', '딸기', '포도']\n>>> '딸기' in fruit\nTrue\n>>> '수박' in fruit\nFalse\n>>> '수박' not in fruit\nTrue\n>>> 'a' in 'banana'\nTrue\n>>>",
            desc: '<code>in</code> 은 문자열에도 쓸 수 있습니다. <code>\'a\' in \'banana\'</code> 는 “banana 안에 a 라는 글자가 있는가?” 입니다.' },
          { type: 'code', title: '추가 예제. 메뉴에 있는 음식인지 확인하기', code: `menu = ['김밥', '라면', '떡볶이', '순대']
food = input("주문할 음식을 입력하세요 : ")

if food in menu :
    print(food, "주문이 접수되었습니다.")
else :
    print("죄송합니다.", food, "은(는) 메뉴에 없습니다.")`, stdin: '짜장면\n', expect: '주문할 음식을 입력하세요 : 짜장면\n죄송합니다. 짜장면 은(는) 메뉴에 없습니다.',
            desc: 'in 이 없었다면 <code>food == \'김밥\' or food == \'라면\' or …</code> 처럼 길게 써야 했을 것입니다.' },
          { type: 'h', text: '예: 0~9 중에서 리스트에 없는 숫자 찾기' },
          { type: 'p', html: '0~9 사이의 숫자를 무작위로 10개 뽑아 리스트에 넣은 뒤, 0부터 9까지 각 숫자가 리스트에 <b>없는지</b> 검사해 봅시다. 무작위로 뽑으면 같은 숫자가 여러 번 나오기도 하므로 빠지는 숫자가 생깁니다.' },
          { type: 'code', title: 'Code05-10. 리스트 안에 없는 숫자 찾기', code: `import random

numbers = []
for num in range(0, 10) :
    numbers.append(random.randrange(0, 10))

print("생성된 리스트", numbers)

for num in range(0, 10) :
    if num not in numbers :
        print("숫자 %d는(은) 리스트에 없네요." % num)`, nondeterministic: true,
            desc: '<code>3행</code> <code>numbers = []</code> 는 빈 리스트입니다. <code>random.randrange(0, 10)</code> 은 0~9 중 하나를 무작위로 골라 줍니다. <code>4~5행</code>에서 10번 반복하며 리스트에 추가하고, <code>9~11행</code>에서 0~9 를 하나씩 <code>not in</code> 으로 검사합니다. 실행할 때마다 결과가 다릅니다.' },
          { type: 'callout', kind: 'more', title: '📘 random.seed() 로 결과 고정하기', html: '난수는 실행할 때마다 달라서 수업 중에 같은 화면을 보기 어렵습니다. <code>random.seed(숫자)</code> 를 먼저 호출하면 같은 “씨앗”에서는 항상 같은 난수가 순서대로 나옵니다. 게임을 테스트하거나 결과를 재현해야 할 때 유용합니다.' },
          { type: 'code', title: '추가 예제. seed 로 고정한 Code05-10', code: `import random

random.seed(5)

numbers = []
for num in range(0, 10) :
    numbers.append(random.randrange(0, 10))

print("생성된 리스트", numbers)

for num in range(0, 10) :
    if num not in numbers :
        print("숫자 %d는(은) 리스트에 없네요." % num)`, expect: '생성된 리스트 [9, 4, 5, 8, 0, 7, 3, 0, 2, 1]\n숫자 6는(은) 리스트에 없네요.',
            desc: '<code>random.seed(5)</code> 한 줄만 추가했습니다. 몇 번을 실행해도 결과가 같습니다. 숫자를 바꾸면 다른 (하지만 역시 고정된) 결과가 나옵니다.' },
          { type: 'h', text: '[프로그램 2] 종합 계산기 — 설계' },
          { type: 'p', html: '종합 계산기는 먼저 메뉴 번호(1 또는 2)를 입력받고, 번호에 따라 세 갈래로 나뉩니다. 갈래가 셋이므로 <b>if~elif~else</b> 가 딱 맞습니다.' },
          { type: 'figure', html: FIG_CALC, caption: '[프로그램 2] 종합 계산기의 흐름' },
          { type: 'list', items: [
            '<b>1번 — 입력한 수식 계산</b>: 사용자가 입력한 <code>"3*4/2-5"</code> 같은 <b>문자열</b>을 <code>eval()</code> 함수에 넣으면 파이썬 식으로 계산한 결과를 돌려줍니다.',
            '<b>2번 — 두 수 사이의 합계</b>: 첫 번째 수부터 두 번째 수까지 for 문으로 하나씩 더합니다. <code>range(num1, num2 + 1)</code> 처럼 끝 값에 1을 더해야 num2 까지 포함됩니다.',
            '<b>그 밖의 번호</b>: “1 또는 2만 입력해야 합니다.” 를 출력합니다.'
          ] },
          { type: 'code', repl: true, title: 'eval() 함수 알아보기', code: "eval('3*4/2-5')\neval('100 + 200')\n'100 + 200'",
            expect: ">>> eval('3*4/2-5')\n1.0\n>>> eval('100 + 200')\n300\n>>> '100 + 200'\n'100 + 200'\n>>>",
            desc: '<code>\'100 + 200\'</code> 은 그냥 글자일 뿐이지만, <code>eval()</code> 에 넣으면 식으로 계산됩니다. <code>3*4/2-5</code> 는 나눗셈 <code>/</code> 때문에 실수 1.0 이 됩니다.' },
          { type: 'h', text: '[프로그램 2]의 완성' },
          { type: 'code', title: '[프로그램 2] 완성: Code05-11. 종합 계산기 (1번 선택)', code: CODE0511, stdin: '1\n3*4/2-5\n',
            expect: '1. 입력한 수식 계산  2. 두 수 사이의 합계 : 1\n *** 수식을 입력하세요 : 3*4/2-5\n 3*4/2-5 결과는   1.0입니다.',
            desc: '<code>2행</code>은 다섯 변수에 초깃값을 한꺼번에 넣습니다. <code>10행</code>의 <code>%5.1f</code> 는 “전체 5칸, 소수점 아래 1자리 실수” 형식이라 <code>1.0</code> 앞에 공백 2칸이 생깁니다. <code>%s</code> 에는 입력한 수식 문자열이 들어갑니다.' },
          { type: 'code', title: 'Code05-11. 종합 계산기 (2번 선택)', code: CODE0511, stdin: '2\n1\n10\n',
            expect: '1. 입력한 수식 계산  2. 두 수 사이의 합계 : 2\n *** 첫 번째 숫자를 입력하세요 : 1\n *** 두 번째 숫자를 입력하세요 : 10\n1+...+10는 55입니다.',
            desc: '같은 코드에 2번을 입력한 경우입니다. <code>14~15행</code>의 for 문이 i = 1, 2, …, 10 을 차례로 <code>answer</code> 에 더합니다. answer 가 <code>2행</code>에서 0으로 시작했기 때문에 합계를 바로 누적할 수 있습니다.' },
          { type: 'code', title: 'Code05-11. 종합 계산기 (잘못된 번호)', code: CODE0511, stdin: '3\n',
            expect: '1. 입력한 수식 계산  2. 두 수 사이의 합계 : 3\n1 또는 2만 입력해야 합니다.',
            desc: '1도 2도 아니므로 else 블록이 실행됩니다. 프로그램을 만들 때는 이렇게 <b>예상하지 못한 입력</b>도 처리해 두는 것이 좋습니다.' },
          { type: 'table', head: ['선택', '입력 예', 'answer 계산', '출력'], rows: [
            ['1', '<code>3*4/2-5</code>', '<code>eval("3*4/2-5")</code> → 1.0', '<code>3*4/2-5 결과는   1.0입니다.</code>'],
            ['1', '<code>(10+20)*3</code>', '<code>eval("(10+20)*3")</code> → 90', '<code>(10+20)*3 결과는  90.0입니다.</code>'],
            ['2', '1, 10', '1+2+…+10 = 55', '<code>1+...+10는 55입니다.</code>'],
            ['2', '1, 100', '1+2+…+100 = 5050', '<code>1+...+100는 5050입니다.</code>'],
            ['3', '—', '—', '<code>1 또는 2만 입력해야 합니다.</code>']
          ], caption: '종합 계산기에 여러 값을 넣어 보기' },
          { type: 'callout', kind: 'warn', title: 'eval() 은 편리하지만 위험하다', html: '<code>eval()</code> 은 입력된 문자열을 <b>파이썬 코드로 실행</b>합니다. 계산식만 들어온다면 편리하지만, 악의적인 사용자가 파일을 지우는 코드 같은 것을 입력하면 그대로 실행될 수 있습니다. 연습용 프로그램에서만 쓰고, 다른 사람이 입력하는 실제 서비스에서는 사용하지 마세요. 또 <code>3*/4</code> 처럼 식이 잘못되면 <code>SyntaxError</code>, <code>1/0</code> 이면 <code>ZeroDivisionError</code> 가 납니다.' },
          { type: 'callout', kind: 'more', title: '📘 f-string 으로 출력하기', html: '강의자료의 <code>%</code> 서식 대신 최신 파이썬에서 많이 쓰는 <b>f-string</b> 으로도 같은 출력을 만들 수 있습니다.<pre><code>print(f" {numStr} 결과는 {answer:5.1f}입니다. ")\nprint(f"{num1}+...+{num2}는 {answer}입니다. ")</code></pre>중괄호 안에 변수를 바로 쓰고, <code>:5.1f</code> 로 형식을 지정합니다.' },
          { type: 'callout', kind: 'more', title: '📘 match 문 (파이썬 3.10 이상)', html: '값이 1인지, 2인지, 그 밖인지처럼 <b>하나의 값을 여러 경우와 비교</b>할 때는 <code>match</code> 문도 쓸 수 있습니다. <code>case _</code> 는 “나머지 모든 경우”로 else 와 같은 역할입니다. 아래 예제를 실행해 보세요.' },
          { type: 'code', title: '추가 예제. match 문으로 메뉴 고르기', code: `select = 2

match select :
    case 1 :
        print("입력한 수식을 계산합니다.")
    case 2 :
        print("두 수 사이의 합계를 구합니다.")
    case _ :
        print("1 또는 2만 입력해야 합니다.")`, expect: '두 수 사이의 합계를 구합니다.',
            desc: '대부분의 경우 if~elif~else 로 충분하며, 이 강좌에서도 if 문을 주로 사용합니다.' }
        ],
        practice: [
          {
            title: 'SELF STUDY 5-2. 증가하는 숫자도 입력받는 합계',
            level: 2,
            desc: '<p>[프로그램 2]의 두 번째 기능처럼 두 숫자를 입력받아 그 사이의 합계를 구하되, 1씩 증가하지 않고 <b>증가하는 숫자도 입력</b>받으세요. 예를 들어 1, 100, 3 을 입력하면 1+4+7+…+100 의 합계를 구합니다.</p><pre> *** 첫 번째 숫자를 입력하세요 : 1\n *** 두 번째 숫자를 입력하세요 : 100\n *** 더할 숫자를 입력하세요 : 3\n1+4+...+100는 1717입니다.</pre>',
            hint: '<code>range(시작값, 끝값+1, 증가값)</code> 형식으로 사용합니다. 출력의 두 번째 수는 <code>num1 + num3</code> 입니다.',
            starter: 'num1 = int(input(" *** 첫 번째 숫자를 입력하세요 : "))\nnum2 = int(input(" *** 두 번째 숫자를 입력하세요 : "))\nnum3 = int(input(" *** 더할 숫자를 입력하세요 : "))\nanswer = 0\n\n# TODO: range(시작값, 끝값+1, 증가값) 으로 합계 구하기\n\nprint("%d+%d+...+%d는 %d입니다." % (num1, num1 + num3, num2, answer))\n',
            solution: SELF52,
            stdin: '1\n100\n3\n',
            expect: ' *** 첫 번째 숫자를 입력하세요 : 1\n *** 두 번째 숫자를 입력하세요 : 100\n *** 더할 숫자를 입력하세요 : 3\n1+4+...+100는 1717입니다.'
          },
          {
            title: 'SELF STUDY 5-3. 소수 판별하기',
            level: 3,
            desc: '<p>숫자를 하나 입력받아 그 숫자가 소수인지 판별하세요. 소수란 2부터 자기 자신-1 까지의 수로 나눴을 때 <b>나누어떨어지는 수가 하나도 없는</b> 수입니다. 예를 들어 7은 2, 3, 4, 5, 6 으로 나누어떨어지지 않으므로 소수입니다.</p><pre> *** 숫자를 입력하세요 : 13\n 13는 소수입니다.</pre><pre> *** 숫자를 입력하세요 : 77\n 77는 소수가 아닙니다.</pre>',
            hint: '처음에 <code>isPrime = True</code> 로 두고, <code>for i in range(2, num) :</code> 안에서 <code>num % i == 0</code> 이면 <code>isPrime = False</code> 로 바꿉니다. 반복이 끝난 뒤 isPrime 으로 판단합니다. (1 이하는 소수가 아닙니다)',
            starter: 'num = int(input(" *** 숫자를 입력하세요 : "))\nisPrime = True\n\n# TODO: 2 ~ num-1 로 나누어 보기\n\n# TODO: isPrime 에 따라 결과 출력\n',
            solution: SELF53,
            stdin: '13\n',
            expect: ' *** 숫자를 입력하세요 : 13\n 13는 소수입니다.'
          },
          {
            title: '실습 5-9. 가위바위보 게임',
            level: 3,
            desc: '<p>사용자에게 “가위”, “바위”, “보” 중 하나를 입력받고, 컴퓨터는 리스트에서 무작위로 하나를 고릅니다. 비기면 “비겼습니다.”, 이기면 “이겼습니다!”, 지면 “졌습니다.” 를 출력하세요. 목록에 없는 말을 입력하면 “가위, 바위, 보 중에서 입력하세요.” 를 출력합니다.</p>',
            hint: '<code>random.choice(리스트)</code> 는 리스트에서 하나를 무작위로 고릅니다. 먼저 <code>not in</code> 으로 입력을 검사하고, 이기는 경우 3가지를 <code>or</code> 로 묶어 보세요.',
            starter: 'import random\n\nhands = [\'가위\', \'바위\', \'보\']\nme = input("가위, 바위, 보 : ")\ncom = random.choice(hands)\nprint("컴퓨터 :", com)\n\n# TODO: 입력 검사 → 비김 → 이김 → 짐 순서로 판단\n',
            solution: 'import random\n\nhands = [\'가위\', \'바위\', \'보\']\nme = input("가위, 바위, 보 : ")\ncom = random.choice(hands)\nprint("컴퓨터 :", com)\n\nif me not in hands :\n    print("가위, 바위, 보 중에서 입력하세요.")\nelif me == com :\n    print("비겼습니다.")\nelif (me == \'가위\' and com == \'보\') or (me == \'바위\' and com == \'가위\') or (me == \'보\' and com == \'바위\') :\n    print("이겼습니다!")\nelse :\n    print("졌습니다.")\n',
            stdin: '바위\n',
            nondeterministic: true
          }
        ],
        quiz: [
          { q: `다음 코드의 실행 결과는?<pre><code>fruit = ['사과', '배']\nfruit.append('귤')\nprint(fruit)</code></pre>`, options: ["['사과', '배']", "['귤', '사과', '배']", "['사과', '배', '귤']", '오류'], answer: 2, explain: '<code>append()</code> 는 리스트의 맨 뒤에 항목을 추가합니다.' },
          { q: `<code>nums = [1, 3, 5]</code> 일 때 결과가 <b>True</b> 인 것은?`, options: ['<code>2 in nums</code>', '<code>3 not in nums</code>', '<code>5 in nums</code>', '<code>[1] in nums</code>'], answer: 2, explain: '5 는 리스트 안에 있으므로 <code>5 in nums</code> 가 True 입니다. <code>[1]</code> 은 숫자 1이 아니라 “리스트 [1]” 이라 항목이 아닙니다.' },
          { q: '<code>eval("10 + 5 * 2")</code> 의 결과는?', options: ['"10 + 5 * 2"', '30', '20', '오류'], answer: 2, explain: '문자열을 파이썬 식으로 계산합니다. 곱셈이 먼저이므로 10 + 10 = 20.' },
          { q: '1부터 10까지의 합을 구하려고 할 때 알맞은 반복 범위는?', options: ['<code>range(1, 10)</code>', '<code>range(1, 11)</code>', '<code>range(0, 10)</code>', '<code>range(10)</code>'], answer: 1, explain: 'range 는 끝 값 직전까지이므로 10을 포함하려면 끝 값을 11(= num2 + 1)로 해야 합니다.' },
          { q: '종합 계산기에서 메뉴로 3을 입력하면 어떻게 되는가?', options: ['수식 계산을 한다', '합계를 구한다', '“1 또는 2만 입력해야 합니다.” 를 출력한다', 'ValueError 가 난다'], answer: 2, explain: 'select == 1 도, select == 2 도 거짓이므로 else 블록이 실행됩니다.' }
        ],
        slides: [
          { layout: 'title', title: 'if 문 응용과 [프로그램 2]', subtitle: 'Chapter 05 조건문 · Section 04 — 종합 계산기', badge: '05-5',
            notes: '<p><b>[도입 1분]</b> “장바구니에 우유가 들어 있는지 확인하려면?” — 여러 값을 담는 리스트와, 그 안에 있는지 묻는 <code>in</code> 을 배웁니다. 그리고 이 장의 마지막 프로그램인 종합 계산기를 완성합니다.</p>' },
          { layout: 'code', title: '리스트 만들기와 append()', code: "fruit = ['사과', '배', '딸기', '포도']\nprint(fruit)\n\nfruit.append('귤')\nprint(fruit)",
            points: ['리스트 = 여러 데이터를 한곳에', '대괄호 <code>[ ]</code> 로 묶고 쉼표로 구분', '<code>append()</code> → 맨 뒤에 추가'],
            notes: '<p><b>[4분]</b> 리스트는 8장에서 자세히 배우므로 오늘은 만들기 · 추가하기 · in 검사 세 가지만 합니다.</p><p>비유: 칸이 여러 개인 서랍장, 각 칸에 번호(0부터)가 붙어 있음.</p>' },
          { layout: 'diagram', title: '리스트와 in 연산자', html: FIG_LIST, caption: '항목 in 리스트 → 있으면 True',
            notes: '<p><b>[3분]</b> 인덱스가 0부터 시작한다는 것만 가볍게 짚고 넘어갑니다. not in 은 “없으면 참” — 헷갈리기 쉬우니 셸에서 직접 확인시키세요.</p>' },
          { layout: 'code', title: 'if 항목 in 리스트', code: "fruit = ['사과', '배', '딸기', '포도']\n\nif '딸기' in fruit :\n    print(\"딸기가 있네요. ^^\")\n\nif '수박' not in fruit :\n    print(\"수박은 없네요.\")",
            points: ['<code>in</code> : 있으면 True', '<code>not in</code> : 없으면 True', '<code>or</code> 여러 개를 대신함'],
            notes: '<p><b>[3분]</b> <code>\'딸기\'</code> 를 <code>\'바나나\'</code> 로 바꿔 실행해 봅니다. 문자열에도 in 이 된다는 것(<code>\'a\' in \'banana\'</code>)을 보너스로 보여 주세요.</p>' },
          { layout: 'code', title: 'Code05-10. 리스트에 없는 숫자 찾기', code: 'import random\n\nnumbers = []\nfor num in range(0, 10) :\n    numbers.append(random.randrange(0, 10))\n\nprint("생성된 리스트", numbers)\n\nfor num in range(0, 10) :\n    if num not in numbers :\n        print("숫자 %d는(은) 리스트에 없네요." % num)',
            points: ['<code>[]</code> 빈 리스트에서 시작', 'randrange(0, 10) → 0~9 무작위', '<code>not in</code> 으로 빠진 숫자 찾기'],
            notes: '<p><b>[6분]</b> 여러 번 실행해 결과가 매번 다르다는 것을 보여 줍니다. 발문: “빠진 숫자가 하나도 없을 수도 있을까요?” (가능은 하지만 확률이 매우 낮음 — 10!/10^10 ≈ 0.036%).</p><p>random.seed(5) 를 넣으면 결과가 고정된다는 것도 시연하세요.</p>' },
          { layout: 'diagram', title: '[프로그램 2] 종합 계산기의 흐름', html: FIG_CALC, caption: '메뉴 번호에 따라 세 갈래 → if~elif~else',
            notes: '<p><b>[3분]</b> 먼저 완성 프로그램을 실행해 보여 준 뒤 순서도로 구조를 설명합니다. 갈래가 3개이므로 elif 가 필요합니다.</p>' },
          { layout: 'code', title: 'eval() — 문자열을 식으로 계산', repl: true, code: "eval('3*4/2-5')\neval('100 + 200')\n'100 + 200'",
            points: ['문자열 → 파이썬 식으로 계산', '입력한 수식을 그대로 계산', '⚠ 실제 서비스에서는 위험'],
            notes: '<p><b>[2분]</b> eval 은 입력을 코드로 실행하므로 보안상 위험하다는 점을 꼭 언급하세요. 연습용 계산기에서만 씁니다.</p>' },
          { layout: 'code', title: '[프로그램 2] 완성: Code05-11', code: CODE0511, stdin: '1\n3*4/2-5\n',
            points: ['2행: 다섯 변수 동시 초기화', '<code>%5.1f</code> : 5칸, 소수 1자리', '<code>range(num1, num2 + 1)</code>', 'else : 잘못된 번호 처리'],
            notes: '<p><b>[8분]</b> “예시 입력으로 실행”(1, 3*4/2-5) 후 다시 실행해 2, 1, 10 을 직접 입력합니다. 3 을 넣어 else 도 확인하세요.</p><p>흔한 질문: “num2 + 1 은 왜?” → range 는 끝 값 직전까지. “answer 를 왜 0으로 시작?” → 누적 합의 출발점.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '1부터 10까지의 합을 구하려면 for 문의 범위는?', options: ['<code>range(1, 10)</code>', '<code>range(1, 11)</code>', '<code>range(0, 10)</code>', '<code>range(10)</code>'], answer: 1, explain: 'range 는 끝 값 직전까지 — 10을 포함하려면 11.',
            notes: '<p><b>[2분]</b> 틀린 학생에게는 셸에서 <code>list(range(1, 10))</code> 을 출력해 보게 합니다.</p>' },
          { layout: 'practice', title: 'SELF STUDY 5-2. 증가값도 입력받는 합계', desc: '두 숫자와 증가값을 입력받아 합계를 구하세요. 1, 100, 3 → 1+4+...+100는 1717입니다.',
            starter: 'num1 = int(input(" *** 첫 번째 숫자를 입력하세요 : "))\nnum2 = int(input(" *** 두 번째 숫자를 입력하세요 : "))\nnum3 = int(input(" *** 더할 숫자를 입력하세요 : "))\nanswer = 0\n\n# TODO: range(시작값, 끝값+1, 증가값) 으로 합계 구하기\n\nprint("%d+%d+...+%d는 %d입니다." % (num1, num1 + num3, num2, answer))\n',
            solution: SELF52, stdin: '1\n100\n3\n',
            notes: '<p><b>[5분]</b> 힌트: range 의 세 번째 값이 증가값. 결과 1717 이 나오는지 확인합니다.</p>' },
          { layout: 'practice', title: 'SELF STUDY 5-3. 소수 판별', desc: '숫자를 입력받아 소수인지 판별하세요. (13 → 소수, 77 → 소수가 아님)',
            starter: 'num = int(input(" *** 숫자를 입력하세요 : "))\nisPrime = True\n\n# TODO: 2 ~ num-1 로 나누어 보기\n\n# TODO: isPrime 에 따라 결과 출력\n',
            solution: SELF53, stdin: '13\n',
            notes: '<p><b>[5분]</b> “깃발(flag) 변수” 기법을 소개합니다: 처음엔 소수라고 가정(True), 나누어떨어지는 수를 하나라도 찾으면 False 로 내림. 77 = 7 × 11 로 확인하세요.</p><p>빨리 끝난 학생은 실습 5-9 가위바위보 게임에 도전합니다.</p>' },
          { layout: 'summary', title: '5장 전체 정리', bullets: ['<code>if</code> / <code>if~else</code> / 중첩 if / <code>if~elif~else</code>', '콜론과 <b>들여쓰기</b>가 블록을 만든다', '조건부 표현식: <code>참값 if 조건 else 거짓값</code>', '<code>in</code> · <code>not in</code> 으로 리스트 검사, <code>append()</code> 로 추가', '[프로그램 1] 무지개 원 · [프로그램 2] 종합 계산기 완성'],
            notes: '<p><b>[2분]</b> 다음 장 예고: 이번 장에서 맛본 for 문을 본격적으로 — 6장 반복문. “원 249개를 그렸던 그 힘!”</p>' }
        ]
      }
    ]
  });
})();
