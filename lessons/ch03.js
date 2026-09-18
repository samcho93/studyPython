/* Chapter 03. 변수와 데이터형
 * 강의자료: 파이썬 for Beginner 3판 Chapter 03 (슬라이드 36장)
 */
(function () {
  /* ───────── 그림 도우미 (이 파일 안에서만 사용) ───────── */
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // 콘솔(실행 화면) 모양의 그림
  const consoleFig = (text, title) => `<div style="border:2px solid var(--line);border-radius:10px;overflow:hidden;max-width:640px;margin:0 auto;background:var(--card)">
  <div style="padding:6px 12px;font-size:14px;color:var(--muted);border-bottom:1px solid var(--line)">▶ ${esc(title || '실행 결과')}</div>
  <pre style="margin:0;padding:12px 16px;font-size:16px;line-height:1.45;color:var(--fg);background:transparent;white-space:pre">${esc(text)}</pre></div>`;

  // 서식 자릿수 그림: 칸(그릇)에 글자가 하나씩 들어가는 모양
  function boxRows(rows) {
    const step = 64, cw = 54, x0 = 210;
    let y = 24;
    const parts = [];
    rows.forEach((r) => {
      parts.push(`<text x="20" y="${y + 32}" font-size="24" font-weight="bold" font-family="monospace" fill="var(--accent)">${esc(r.label)}</text>`);
      parts.push(`<text x="178" y="${y + 32}" font-size="24" fill="var(--muted)">→</text>`);
      r.cells.forEach((c, i) => {
        const x = x0 + i * step, hi = (r.hi || []).includes(i);
        parts.push(`<path d="M${x} ${y + 6} V${y + 48} H${x + cw} V${y + 6}" fill="none" stroke="${hi ? 'var(--accent2)' : 'var(--muted)'}" stroke-width="${hi ? 4 : 2.5}"/>`);
        if (c !== '') parts.push(`<text x="${x + cw / 2}" y="${y + 38}" text-anchor="middle" font-size="26" font-family="monospace" font-weight="bold" fill="${hi ? 'var(--accent2)' : 'var(--fg)'}">${esc(c)}</text>`);
      });
      const nx = x0 + r.cells.length * step + 16;
      (r.note || '').split('|').forEach((t, k) => parts.push(`<text x="${nx}" y="${y + 26 + k * 26}" font-size="19" fill="var(--fg)">${esc(t)}</text>`));
      y += 58;
      if (r.brace) {
        const x1 = x0, x2 = x0 + (r.cells.length - 1) * step + cw, m = (x1 + x2) / 2;
        parts.push(`<path d="M${x1} ${y} q0 12 12 12 H${m - 10} l10 10 l10 -10 H${x2 - 12} q12 0 12 -12" fill="none" stroke="var(--accent)" stroke-width="2.5"/>`);
        parts.push(`<text x="${m}" y="${y + 50}" text-anchor="middle" font-size="19" fill="var(--muted)">${esc(r.brace)}</text>`);
        y += 58;
      }
      y += 18;
    });
    return `<svg viewBox="0 0 1280 ${y}" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" style="width:100%">${parts.join('')}</svg>`;
  }

  // 변수 = 그릇(컵) 그림
  function cup(x, y, name, value, sub, color, crossed) {
    color = color || 'var(--accent)';
    let s = `<path d="M${x} ${y} L${x + 20} ${y + 110} H${x + 110} L${x + 130} ${y} Z" fill="var(--card)" stroke="${color}" stroke-width="4"/>`;
    s += `<path d="M${x + 8} ${y + 40} L${x + 20} ${y + 110} H${x + 110} L${x + 122} ${y + 40} Z" fill="${color}" opacity="0.25"/>`;
    if (value !== '') s += `<text x="${x + 65}" y="${y + 80}" text-anchor="middle" font-size="26" font-weight="bold" font-family="monospace" fill="var(--fg)">${esc(value)}</text>`;
    if (crossed) s += `<path d="M${x + 10} ${y + 10} L${x + 120} ${y + 105} M${x + 120} ${y + 10} L${x + 10} ${y + 105}" stroke="var(--danger)" stroke-width="4"/>`;
    s += `<text x="${x + 65}" y="${y + 145}" text-anchor="middle" font-size="22" font-weight="bold" fill="${color}">${esc(name)}</text>`;
    if (sub) s += `<text x="${x + 65}" y="${y + 172}" text-anchor="middle" font-size="18" fill="var(--muted)">${esc(sub)}</text>`;
    return s;
  }
  const svg = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" style="width:100%"><defs><marker id="ar3" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="var(--accent2)"/></marker></defs>${body}</svg>`;

  /* ───────── 자주 쓰는 그림 ───────── */
  const FIG_PRINT_PAIR = svg(1280, 330, `
  <text x="640" y="40" text-anchor="middle" font-size="22" fill="var(--muted)">서식 문자(%d)의 개수 = % 뒤에 오는 값의 개수</text>
  <g font-family="monospace" font-size="34" fill="var(--fg)">
    <text x="120" y="175">print(</text><text x="265" y="175">"</text>
    <text x="330" y="175" text-anchor="middle" font-weight="bold" fill="var(--accent)">%d</text>
    <text x="440" y="175" text-anchor="middle" font-weight="bold" fill="var(--accent2)">%d</text>
    <text x="490" y="175">"</text>
    <text x="560" y="175" text-anchor="middle" font-weight="bold" fill="var(--danger)">%</text>
    <text x="620" y="175">(</text>
    <text x="700" y="175" text-anchor="middle" font-weight="bold" fill="var(--accent)">100</text>
    <text x="765" y="175">,</text>
    <text x="840" y="175" text-anchor="middle" font-weight="bold" fill="var(--accent2)">200</text>
    <text x="905" y="175">))</text>
  </g>
  <circle cx="560" cy="163" r="30" fill="none" stroke="var(--danger)" stroke-width="3"/>
  <path d="M700 135 V85 H330 V132" fill="none" stroke="var(--accent)" stroke-width="3" marker-end="url(#ar3)"/>
  <path d="M840 190 V250 H440 V195" fill="none" stroke="var(--accent2)" stroke-width="3" marker-end="url(#ar3)"/>
  <text x="515" y="75" text-anchor="middle" font-size="20" fill="var(--accent)">첫 번째 값 → 첫 번째 %d</text>
  <text x="640" y="285" text-anchor="middle" font-size="20" fill="var(--accent2)">두 번째 값 → 두 번째 %d</text>
  <text x="640" y="320" text-anchor="middle" font-size="20" fill="var(--fg)">출력: <tspan font-family="monospace" font-weight="bold">100 200</tspan></text>`);

  const FIG_PRINT_MISMATCH = svg(1280, 400, `
  <g font-family="monospace" font-size="30" fill="var(--fg)">
    <text x="90" y="200">print(</text><text x="215" y="200">"</text>
    <text x="270" y="200" text-anchor="middle" font-weight="bold" fill="var(--accent)">%d</text><text x="330" y="200" text-anchor="middle">/</text>
    <text x="390" y="200" text-anchor="middle" font-weight="bold" fill="var(--accent2)">%d</text><text x="450" y="200" text-anchor="middle">=</text>
    <text x="510" y="200" text-anchor="middle" font-weight="bold" fill="var(--ok)">%d</text><text x="555" y="200">"</text>
    <text x="620" y="200" text-anchor="middle">%</text><text x="670" y="200">(</text>
    <text x="740" y="200" text-anchor="middle" font-weight="bold" fill="var(--accent)">100</text><text x="790" y="200">,</text>
    <text x="860" y="200" text-anchor="middle" font-weight="bold" fill="var(--accent2)">200</text><text x="910" y="200">,</text>
    <text x="985" y="200" text-anchor="middle" font-weight="bold" fill="var(--ok)">0.5</text><text x="1040" y="200">))</text>
  </g>
  <path d="M740 170 V120 H270 V160" fill="none" stroke="var(--accent)" stroke-width="3" marker-end="url(#ar3)"/>
  <path d="M860 170 V90 H390 V160" fill="none" stroke="var(--accent2)" stroke-width="3" marker-end="url(#ar3)"/>
  <path d="M985 170 V60 H510 V160" fill="none" stroke="var(--ok)" stroke-width="3" marker-end="url(#ar3)"/>
  <g font-size="19" fill="var(--muted)" text-anchor="middle"><text x="270" y="250">정수로 표시</text><text x="390" y="250">정수로 표시</text><text x="510" y="250">정수로 표시</text></g>
  <g font-size="30" font-weight="bold" font-family="monospace" text-anchor="middle"><text x="270" y="300" fill="var(--accent)">100</text><text x="390" y="300" fill="var(--accent2)">200</text><text x="510" y="300" fill="var(--danger)">0</text></g>
  <text x="640" y="370" text-anchor="middle" font-size="21" fill="var(--fg)">0.5 를 <tspan fill="var(--danger)" font-weight="bold">%d(정수)</tspan> 자리에 넣으면 소수점 아래가 잘려 <tspan font-weight="bold">0</tspan> 이 된다 → <tspan font-family="monospace" fill="var(--ok)" font-weight="bold">%5.1f</tspan> 로 바꾸자</text>`);

  const FIG_INT_BOX = boxRows([
    { label: '"%d"', cells: ['1', '2', '3'], note: '숫자의 자릿수만큼만 차지' },
    { label: '"%5d"', cells: ['', '', '1', '2', '3'], hi: [0, 1], note: '다섯 칸 확보 후|오른쪽에 붙여서 정렬', brace: '다섯 자리 확보' },
    { label: '"%05d"', cells: ['0', '0', '1', '2', '3'], hi: [0, 1], note: '다섯 칸 확보 후 오른쪽 정렬|빈칸은 0 으로 채움', brace: '다섯 자리 확보' }
  ]);
  const FIG_FLOAT_BOX = boxRows([
    { label: '"%f"', cells: ['1', '2', '3', '.', '4', '5', '0', '0', '0', '0'], hi: [4, 5, 6, 7, 8, 9], note: '소수점 아래|항상 여섯 자리' },
    { label: '"%7.1f"', cells: ['', '', '1', '2', '3', '.', '5'], hi: [6], note: '소수점 아래 한 자리만 출력|(둘째 자리에서 반올림)', brace: '전체 일곱 자리 확보 (점 포함)' },
    { label: '"%7.3f"', cells: ['1', '2', '3', '.', '4', '5', '0'], hi: [4, 5, 6], note: '소수점 아래 셋째 자리까지|모자란 자리는 0 으로 채움', brace: '전체 일곱 자리 확보 (점 포함)' }
  ]);
  const FIG_STR_BOX = boxRows([
    { label: '"%s"', cells: ['P', 'y', 't', 'h', 'o', 'n'], note: '글자 수만큼만 차지' },
    { label: '"%10s"', cells: ['', '', '', '', 'P', 'y', 't', 'h', 'o', 'n'], hi: [0, 1, 2, 3], note: '열 칸 확보 후|오른쪽 정렬', brace: '열 자리 확보' }
  ]);

  const FIG_FORMAT = svg(1280, 360, `
  <g font-family="monospace" font-size="30" fill="var(--fg)">
    <text x="60" y="190">print(</text><text x="178" y="190">"</text>
    <text x="250" y="190" text-anchor="middle" font-weight="bold" fill="var(--accent)">{0:d}</text>
    <text x="385" y="190" text-anchor="middle" font-weight="bold" fill="var(--accent2)">{1:5d}</text>
    <text x="530" y="190" text-anchor="middle" font-weight="bold" fill="var(--ok)">{2:05d}</text>
    <text x="608" y="190">".</text><text x="645" y="190" fill="var(--danger)">format</text><text x="760" y="190">(</text>
    <text x="830" y="190" text-anchor="middle" font-weight="bold" fill="var(--accent)">123</text><text x="878" y="190">,</text>
    <text x="945" y="190" text-anchor="middle" font-weight="bold" fill="var(--accent2)">123</text><text x="993" y="190">,</text>
    <text x="1060" y="190" text-anchor="middle" font-weight="bold" fill="var(--ok)">123</text><text x="1110" y="190">))</text>
  </g>
  <g font-size="18" fill="var(--muted)" text-anchor="middle"><text x="830" y="230">0번째</text><text x="945" y="230">1번째</text><text x="1060" y="230">2번째</text></g>
  <path d="M830 160 V120 H250 V155" fill="none" stroke="var(--accent)" stroke-width="3" marker-end="url(#ar3)"/>
  <path d="M945 160 V90 H385 V155" fill="none" stroke="var(--accent2)" stroke-width="3" marker-end="url(#ar3)"/>
  <path d="M1060 160 V60 H530 V155" fill="none" stroke="var(--ok)" stroke-width="3" marker-end="url(#ar3)"/>
  <g font-size="30" font-weight="bold" font-family="monospace" text-anchor="middle"><text x="250" y="300" fill="var(--accent)">123</text><text x="385" y="300" fill="var(--accent2)">□□123</text><text x="530" y="300" fill="var(--ok)">00123</text></g>
  <text x="640" y="345" text-anchor="middle" font-size="19" fill="var(--muted)">{번호:서식} — 번호는 format( ) 안의 값 순서(0부터), 서식은 % 방식과 같다 (□ = 빈칸)</text>`);

  const FIG_CUPS = svg(1280, 330, `
  ${cup(90, 60, 'boolVar', 'True', '불형 변수', 'var(--warn)')}
  ${cup(400, 60, 'intVar', '0', '정수형 변수', 'var(--accent)')}
  ${cup(710, 60, 'floatVar', '0.0', '실수형 변수', 'var(--ok)')}
  ${cup(1020, 60, 'strVar', '""', '문자열 변수', 'var(--accent2)')}
  <text x="640" y="315" text-anchor="middle" font-size="20" fill="var(--muted)">변수 = 값을 담는 이름 붙은 그릇 · 담긴 값의 종류가 곧 변수의 데이터형</text>`);

  const FIG_REASSIGN = svg(1280, 360, `
  <g font-size="26" font-weight="bold" text-anchor="middle" font-family="monospace">
    <text x="155" y="40" fill="var(--warn)">False</text><text x="465" y="40" fill="var(--accent)">100</text>
    <text x="775" y="40" fill="var(--ok)">123.45</text><text x="1085" y="40" fill="var(--accent2)">"안녕?"</text></g>
  <g stroke="var(--muted)" stroke-width="3" marker-end="url(#ar3)"><line x1="155" y1="50" x2="155" y2="95"/><line x1="465" y1="50" x2="465" y2="95"/><line x1="775" y1="50" x2="775" y2="95"/><line x1="1085" y1="50" x2="1085" y2="95"/></g>
  ${cup(90, 110, 'boolVar', 'True', '불형 변수', 'var(--warn)', true)}
  ${cup(400, 110, 'intVar', '0', '정수형 변수', 'var(--accent)', true)}
  ${cup(710, 110, 'floatVar', '0.0', '실수형 변수', 'var(--ok)', true)}
  ${cup(1020, 110, 'strVar', '""', '문자열 변수', 'var(--accent2)', true)}
  <text x="640" y="350" text-anchor="middle" font-size="20" fill="var(--muted)">새 값을 대입하면 원래 있던 값(✕)은 사라지고 새 값으로 바뀐다</text>`);

  const FIG_ASSIGN3 = svg(1280, 420, `
  <text x="200" y="36" text-anchor="middle" font-size="22" font-family="monospace" font-weight="bold" fill="var(--fg)">var1 = var2</text>
  ${cup(40, 150, 'var1', '200', '', 'var(--accent)')}
  <text x="215" y="230" font-size="40" fill="var(--muted)">=</text>
  ${cup(260, 150, 'var2', '200', '', 'var(--accent)')}
  <path d="M325 140 V80 H105 V140" fill="none" stroke="var(--accent2)" stroke-width="3" marker-end="url(#ar3)"/>
  <text x="215" y="70" text-anchor="middle" font-size="17" fill="var(--accent2)">var2 의 값만 복사</text>

  <text x="640" y="36" text-anchor="middle" font-size="22" font-family="monospace" font-weight="bold" fill="var(--fg)">var1 = 100 + 100</text>
  ${cup(470, 150, 'var1', '200', '', 'var(--accent)')}
  <text x="640" y="230" font-size="40" fill="var(--muted)">=</text>
  <text x="720" y="232" text-anchor="middle" font-size="30" font-weight="bold" fill="var(--fg)">100 + 100</text>
  <circle cx="720" cy="120" r="24" fill="var(--ok)"/><text x="720" y="128" text-anchor="middle" font-size="18" font-weight="bold" fill="#fff">200</text>
  <path d="M720 195 V150" stroke="var(--ok)" stroke-width="3" marker-end="url(#ar3)"/>
  <path d="M696 120 H535 V140" fill="none" stroke="var(--accent2)" stroke-width="3" marker-end="url(#ar3)"/>
  <text x="720" y="80" text-anchor="middle" font-size="17" fill="var(--ok)">① 먼저 계산</text>
  <text x="590" y="108" text-anchor="middle" font-size="17" fill="var(--accent2)">② 결과 대입</text>

  <text x="1080" y="36" text-anchor="middle" font-size="22" font-family="monospace" font-weight="bold" fill="var(--fg)">var1 = var2 + 100</text>
  ${cup(880, 150, 'var1', '300', '', 'var(--accent)')}
  <text x="1030" y="230" font-size="40" fill="var(--muted)">=</text>
  ${cup(1070, 150, 'var2', '200', '', 'var(--accent)')}
  <text x="1245" y="232" text-anchor="middle" font-size="26" font-weight="bold" fill="var(--fg)">+100</text>
  <circle cx="1170" cy="100" r="24" fill="var(--ok)"/><text x="1170" y="108" text-anchor="middle" font-size="18" font-weight="bold" fill="#fff">300</text>
  <path d="M1146 100 H945 V140" fill="none" stroke="var(--accent2)" stroke-width="3" marker-end="url(#ar3)"/>
  <text x="1080" y="400" text-anchor="middle" font-size="18" fill="var(--muted)">var2(200) 를 꺼내 100 을 더한 뒤 대입</text>
  <text x="215" y="400" text-anchor="middle" font-size="18" fill="var(--muted)">변수 → 변수 (값 복사)</text>
  <text x="640" y="400" text-anchor="middle" font-size="18" fill="var(--muted)">계산 결과 → 변수</text>`);

  const FIG_CHAIN = svg(1280, 380, `
  <text x="640" y="36" text-anchor="middle" font-size="24" font-family="monospace" font-weight="bold" fill="var(--fg)">var1 = var2 = var3 = var4 = 100</text>
  ${cup(40, 170, 'var1', '100', '', 'var(--accent)')}
  <text x="205" y="250" font-size="36" fill="var(--muted)">=</text>
  ${cup(270, 170, 'var2', '100', '', 'var(--accent)')}
  <text x="435" y="250" font-size="36" fill="var(--muted)">=</text>
  ${cup(500, 170, 'var3', '100', '', 'var(--accent)')}
  <text x="665" y="250" font-size="36" fill="var(--muted)">=</text>
  ${cup(730, 170, 'var4', '100', '', 'var(--accent)')}
  <text x="895" y="250" font-size="36" fill="var(--muted)">=</text>
  <text x="990" y="252" text-anchor="middle" font-size="36" font-weight="bold" fill="var(--fg)">100</text>
  <path d="M990 215 V120 H795 V160" fill="none" stroke="var(--accent2)" stroke-width="3" marker-end="url(#ar3)"/>
  <path d="M795 120 V110 H565 V160" fill="none" stroke="var(--accent2)" stroke-width="3" stroke-dasharray="6 4" marker-end="url(#ar3)"/>
  <path d="M565 110 V100 H335 V160" fill="none" stroke="var(--accent2)" stroke-width="3" stroke-dasharray="6 4" marker-end="url(#ar3)"/>
  <path d="M335 100 V90 H105 V160" fill="none" stroke="var(--accent2)" stroke-width="3" stroke-dasharray="6 4" marker-end="url(#ar3)"/>
  <g font-size="18" font-weight="bold" fill="var(--accent2)" text-anchor="middle"><text x="900" y="112">① 100 → var4</text><text x="680" y="100">② → var3</text><text x="450" y="90">③ → var2</text><text x="220" y="80">④ → var1</text></g>
  <text x="1100" y="330" text-anchor="middle" font-size="19" fill="var(--muted)">오른쪽에서 왼쪽으로</text>`);

  const FIG_SELF = svg(1280, 360, `
  <text x="640" y="36" text-anchor="middle" font-size="26" font-family="monospace" font-weight="bold" fill="var(--fg)">var1 = var1 + 200</text>
  ${cup(330, 150, 'var1', '300', '계산 후', 'var(--accent)')}
  <text x="520" y="230" font-size="44" fill="var(--muted)">=</text>
  ${cup(600, 150, 'var1', '100', '계산 전', 'var(--accent)')}
  <text x="800" y="232" font-size="36" font-weight="bold" fill="var(--fg)">+ 200</text>
  <circle cx="760" cy="100" r="26" fill="var(--ok)"/><text x="760" y="108" text-anchor="middle" font-size="19" font-weight="bold" fill="#fff">300</text>
  <text x="850" y="90" font-size="18" fill="var(--ok)">① 현재 값 100 + 200 을 먼저 계산</text>
  <path d="M734 100 H395 V140" fill="none" stroke="var(--accent2)" stroke-width="3" marker-end="url(#ar3)"/>
  <text x="560" y="88" text-anchor="middle" font-size="18" fill="var(--accent2)">② 결과를 자기 자신에게 다시 대입</text>
  <text x="530" y="350" text-anchor="middle" font-size="20" fill="var(--accent)">← 같은 그릇 →</text>`);

  const FIG_PLATE = svg(1280, 300, `
  <rect x="40" y="30" width="580" height="240" rx="18" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
  <text x="330" y="75" text-anchor="middle" font-size="26" font-family="monospace" font-weight="bold" fill="var(--danger)">10 = 100   ✘</text>
  <circle cx="160" cy="175" r="60" fill="none" stroke="var(--muted)" stroke-width="3" stroke-dasharray="8 6"/>
  <text x="160" y="182" text-anchor="middle" font-size="22" fill="var(--muted)">그릇 없음</text>
  <path d="M470 175 H260" stroke="var(--danger)" stroke-width="5" marker-end="url(#ar3)"/>
  <text x="520" y="185" text-anchor="middle" font-size="30" font-weight="bold" fill="var(--fg)">100</text>
  <text x="365" y="240" text-anchor="middle" font-size="19" fill="var(--danger)">10 은 값일 뿐, 담을 곳이 아니다</text>
  <rect x="660" y="30" width="580" height="240" rx="18" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="950" y="75" text-anchor="middle" font-size="26" font-family="monospace" font-weight="bold" fill="var(--ok)">var = 100   ✔</text>
  ${cup(715, 110, 'var', '', '', 'var(--ok)')}
  <path d="M1090 175 H870" stroke="var(--ok)" stroke-width="5" marker-end="url(#ar3)"/>
  <text x="1140" y="185" text-anchor="middle" font-size="30" font-weight="bold" fill="var(--fg)">100</text>`);

  // 전기 스위치(전구) 2개로 표현할 수 있는 경우
  const FIG_BULBS = (function () {
    const cases = [[0, 0], [0, 1], [1, 0], [1, 1]];
    let s = '<g font-size="22" fill="var(--fg)"><text x="30" y="95">스위치</text><text x="30" y="170">의미</text><text x="30" y="235">2진수</text><text x="30" y="295">10진수</text></g>';
    cases.forEach((c, i) => {
      const x = 230 + i * 260;
      c.forEach((b, k) => {
        const cx = x + k * 80;
        s += `<circle cx="${cx}" cy="85" r="32" fill="${b ? 'var(--warn)' : 'var(--line)'}" stroke="${b ? 'var(--danger)' : 'var(--muted)'}" stroke-width="3"/>`;
        s += `<text x="${cx}" y="94" text-anchor="middle" font-size="24">${b ? '💡' : ''}</text>`;
      });
      s += `<text x="${x + 40}" y="170" text-anchor="middle" font-size="20" fill="var(--muted)">${c.map((b) => (b ? '켜짐' : '꺼짐')).join(', ')}</text>`;
      s += `<text x="${x + 40}" y="235" text-anchor="middle" font-size="28" font-family="monospace" font-weight="bold" fill="var(--accent)">${c.join('')}</text>`;
      s += `<text x="${x + 40}" y="295" text-anchor="middle" font-size="28" font-family="monospace" font-weight="bold" fill="var(--accent2)">${c[0] * 2 + c[1]}</text>`;
    });
    s += '<line x1="30" y1="200" x2="1250" y2="200" stroke="var(--line)" stroke-width="2"/><line x1="30" y1="260" x2="1250" y2="260" stroke="var(--line)" stroke-width="2"/>';
    s += '<text x="640" y="345" text-anchor="middle" font-size="21" fill="var(--fg)">스위치(비트) n 개로 표현할 수 있는 가짓수 = <tspan font-weight="bold" fill="var(--danger)">2ⁿ</tspan>  (2개 → 4가지)</text>';
    return svg(1280, 365, s);
  })();

  // 2진수 10010011 → 10진수 147
  const FIG_BIN2DEC = (function () {
    const bits = [1, 0, 0, 1, 0, 0, 1, 1], sup = ['⁷', '⁶', '⁵', '⁴', '³', '²', '¹', '⁰'];
    let s = '<g font-size="22" fill="var(--accent)" font-weight="bold"><text x="30" y="60">2진수</text><text x="30" y="360">10진수</text></g>';
    bits.forEach((b, i) => {
      const x = 230 + i * 120, v = b * Math.pow(2, 7 - i);
      s += `<text x="${x}" y="60" text-anchor="middle" font-size="34" font-weight="bold" font-family="monospace" fill="var(--fg)">${b}</text>`;
      s += `<text x="${x}" y="105" text-anchor="middle" font-size="24" fill="var(--muted)">×</text>`;
      s += `<text x="${x}" y="150" text-anchor="middle" font-size="28" fill="var(--fg)">2${sup[i]}</text>`;
      s += `<text x="${x}" y="190" text-anchor="middle" font-size="24" fill="var(--muted)">=</text>`;
      s += `<text x="${x}" y="235" text-anchor="middle" font-size="28" font-weight="bold" fill="${v ? 'var(--accent2)' : 'var(--muted)'}">${v}</text>`;
    });
    s += '<path d="M230 260 V290 H1070 V260" fill="none" stroke="var(--accent)" stroke-width="3"/><path d="M650 290 V320" stroke="var(--accent)" stroke-width="3" marker-end="url(#ar3)"/>';
    s += '<text x="650" y="365" text-anchor="middle" font-size="34" font-weight="bold" fill="var(--danger)">128 + 16 + 2 + 1 = 147</text>';
    return svg(1280, 385, s);
  })();

  // 2진수 → 16진수(4자리씩) → 10진수
  const FIG_BIN2HEX = svg(1280, 400, `
  <g font-size="22" font-weight="bold" fill="var(--accent)"><text x="30" y="60">2진수</text><text x="30" y="215">16진수</text><text x="30" y="370">10진수</text></g>
  <rect x="200" y="20" width="420" height="120" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <rect x="680" y="20" width="420" height="120" rx="14" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
  <g font-family="monospace" font-size="34" font-weight="bold" fill="var(--fg)" text-anchor="middle">
    <text x="260" y="65">1</text><text x="360" y="65">0</text><text x="460" y="65">0</text><text x="560" y="65">1</text>
    <text x="740" y="65">0</text><text x="840" y="65">0</text><text x="940" y="65">1</text><text x="1040" y="65">1</text></g>
  <g font-size="20" fill="var(--muted)" text-anchor="middle">
    <text x="260" y="95">×2³</text><text x="360" y="95">×2²</text><text x="460" y="95">×2¹</text><text x="560" y="95">×2⁰</text>
    <text x="740" y="95">×2³</text><text x="840" y="95">×2²</text><text x="940" y="95">×2¹</text><text x="1040" y="95">×2⁰</text></g>
  <text x="410" y="128" text-anchor="middle" font-size="22" fill="var(--fg)">8 + 0 + 0 + 1</text>
  <text x="890" y="128" text-anchor="middle" font-size="22" fill="var(--fg)">0 + 0 + 2 + 1</text>
  <path d="M410 145 V180" stroke="var(--accent)" stroke-width="3" marker-end="url(#ar3)"/><path d="M890 145 V180" stroke="var(--accent2)" stroke-width="3" marker-end="url(#ar3)"/>
  <text x="410" y="225" text-anchor="middle" font-size="36" font-weight="bold" fill="var(--accent)">9</text>
  <text x="890" y="225" text-anchor="middle" font-size="36" font-weight="bold" fill="var(--accent2)">3</text>
  <text x="410" y="270" text-anchor="middle" font-size="24" fill="var(--fg)">9 × 16¹ = 144</text>
  <text x="890" y="270" text-anchor="middle" font-size="24" fill="var(--fg)">3 × 16⁰ = 3</text>
  <path d="M410 285 V310 H890 V285" fill="none" stroke="var(--muted)" stroke-width="3"/><path d="M650 310 V330" stroke="var(--muted)" stroke-width="3" marker-end="url(#ar3)"/>
  <text x="650" y="375" text-anchor="middle" font-size="34" font-weight="bold" fill="var(--danger)">144 + 3 = 147</text>`);

  // 10진수 13 → 2진수 (2로 계속 나누기)
  const FIG_DEC2BIN = (function () {
    const steps = [[13, 6, 1], [6, 3, 0], [3, 1, 1]];
    let s = '';
    steps.forEach((st, i) => {
      const y = 60 + i * 70;
      s += `<text x="120" y="${y}" font-size="30" font-weight="bold" fill="var(--muted)">2</text>`;
      s += `<path d="M150 ${y - 32} V${y + 10} H290" fill="none" stroke="var(--fg)" stroke-width="2.5"/>`;
      s += `<text x="220" y="${y}" text-anchor="middle" font-size="30" font-family="monospace" font-weight="bold" fill="var(--fg)">${st[0]}</text>`;
      s += `<text x="340" y="${y}" font-size="20" fill="var(--muted)">÷ 2 = 몫 ${st[1]}</text>`;
      s += `<text x="560" y="${y}" font-size="20" fill="var(--muted)">나머지</text>`;
      s += `<circle cx="680" cy="${y - 10}" r="24" fill="none" stroke="var(--danger)" stroke-width="3"/><text x="680" y="${y}" text-anchor="middle" font-size="28" font-weight="bold" fill="var(--danger)">${st[2]}</text>`;
    });
    s += '<text x="220" y="270" text-anchor="middle" font-size="30" font-family="monospace" font-weight="bold" fill="var(--danger)">1</text><circle cx="220" cy="260" r="24" fill="none" stroke="var(--danger)" stroke-width="3"/>';
    s += '<text x="340" y="270" font-size="20" fill="var(--muted)">마지막 몫 (더 나눌 수 없음)</text>';
    s += '<path d="M220 290 V310 H760 V30" fill="none" stroke="var(--accent2)" stroke-width="3" marker-end="url(#ar3)"/>';
    s += '<text x="800" y="120" font-size="21" fill="var(--accent2)">아래에서 위로 읽는다</text>';
    s += '<text x="800" y="160" font-size="20" fill="var(--fg)">마지막 몫 1 → 나머지 1 → 0 → 1</text>';
    s += '<text x="800" y="230" font-size="40" font-weight="bold" font-family="monospace" fill="var(--danger)">13 = 1101₂</text>';
    s += '<text x="800" y="275" font-size="19" fill="var(--muted)">검산: 8 + 4 + 0 + 1 = 13</text>';
    return svg(1280, 330, s);
  })();

  // 16진수 ↔ 2진수: 한 자리 = 4비트
  const FIG_HEXBIN = (function () {
    const grp = (x0, hex, color) => {
      let s = '';
      hex.split('').forEach((h, i) => {
        const x = x0 + i * 140, b = parseInt(h, 16).toString(2).padStart(4, '0');
        s += `<text x="${x}" y="70" text-anchor="middle" font-size="36" font-weight="bold" font-family="monospace" fill="${color}">${h}</text>`;
        s += `<path d="M${x} 85 V125" stroke="${color}" stroke-width="3" marker-end="url(#ar3)"/>`;
        s += `<rect x="${x - 60}" y="135" width="120" height="50" rx="8" fill="var(--card)" stroke="${color}" stroke-width="2.5"/>`;
        s += `<text x="${x}" y="170" text-anchor="middle" font-size="28" font-family="monospace" font-weight="bold" fill="var(--fg)">${b}</text>`;
      });
      return s;
    };
    let s = '<g font-size="20" font-weight="bold" fill="var(--muted)"><text x="20" y="70">16진수</text><text x="20" y="168">2진수</text></g>';
    s += grp(230, '13', 'var(--accent)');
    s += grp(700, 'C5F7', 'var(--accent2)');
    s += '<text x="300" y="250" text-anchor="middle" font-size="26" font-family="monospace" fill="var(--fg)"><tspan fill="var(--muted)">000</tspan>1 0011₂</text>';
    s += '<text x="910" y="250" text-anchor="middle" font-size="26" font-family="monospace" fill="var(--fg)">1100 0101 1111 0111₂</text>';
    s += '<text x="300" y="290" text-anchor="middle" font-size="18" fill="var(--muted)">앞쪽 0 은 생략 → 10011₂</text>';
    s += '<text x="910" y="290" text-anchor="middle" font-size="18" fill="var(--muted)">10진수(50679)를 거칠 필요가 없다</text>';
    return svg(1280, 310, s);
  })();

  const HEX_TABLE_ROWS = Array.from({ length: 16 }, (_, i) => [String(i).padStart(2, '0'), i.toString(2).padStart(4, '0'), i.toString(16).toUpperCase()]);
  const HEX_TABLE_ROWS2 = Array.from({ length: 8 }, (_, i) => [String(i), i.toString(2).padStart(4, '0'), (i + 8).toString(16).toUpperCase(), (i + 8).toString(2)]);

  PY_COURSE.addChapter({
    id: 'ch03',
    no: '03',
    title: '변수와 데이터형',
    subtitle: 'print() 서식 · 변수 · 진수 변환 · 기본 데이터형',
    summary: 'print() 함수의 서식 문자(%d · %f · %s)와 format(), 이스케이프 문자로 원하는 모양의 출력을 만들고, 값을 담는 그릇인 변수의 규칙과 사용법을 익힙니다. 비트 · 바이트와 2 · 8 · 10 · 16진수 변환 원리를 배운 뒤, 정수 · 실수 · 불 · 문자열 등 파이썬의 기본 데이터형을 살펴봅니다. 별표 다이아몬드 출력 프로그램과 진수 변환 프로그램을 완성합니다.',
    goals: [
      'print() 함수와 서식 문자(%d, %5d, %f, %s)로 원하는 형식의 출력을 만들 수 있다',
      'format() 함수와 이스케이프 문자(\\n, \\t 등)를 사용할 수 있다',
      '변수명 규칙을 지켜 변수를 만들고, 다양한 방식으로 값을 대입할 수 있다',
      '비트 · 바이트의 개념을 이해하고 2 · 8 · 10 · 16진수를 서로 변환할 수 있다',
      '정수 · 실수 · 불 · 문자열 데이터형의 특징을 설명하고 type() 으로 확인할 수 있다',
      '별표 다이아몬드 출력 프로그램과 진수 변환 프로그램을 만들 수 있다'
    ],
    sections: [
      /* ───────────────────────── 1교시: print() 서식 ───────────────────────── */
      {
        id: 'ch03-1',
        title: 'print() 함수와 서식 문자',
        minutes: 50,
        goals: [
          '따옴표 안의 100(문자)과 따옴표 없는 100(숫자)의 차이를 설명할 수 있다',
          '서식 문자와 % 뒤의 값의 개수 · 종류를 맞출 수 있다',
          '%d, %5d, %05d, %f, %7.1f, %s, %10s 로 자릿수를 맞춰 출력할 수 있다'
        ],
        flow: [['도입: 이 장에서 만들 프로그램', 5], ['문자 100 vs 숫자 100', 8], ['서식 문자와 값의 짝', 12], ['자릿수 지정 (Code03-01)', 15], ['실습 · 퀴즈', 10]],
        content: [
          { type: 'h', text: '이 장에서 만들 프로그램' },
          { type: 'p', html: '이번 장에서는 두 개의 프로그램을 완성합니다. 하나는 <b>별표(*)로 다이아몬드 모양을 그리는 프로그램</b>이고, 다른 하나는 <b>2 · 8 · 10 · 16진수 중 하나를 골라 값을 넣으면 모든 진수로 바꿔 보여 주는 프로그램</b>입니다. 두 프로그램을 만들려면 출력 모양을 다듬는 방법(print 서식), 값을 기억해 두는 방법(변수), 숫자를 표현하는 여러 방법(진수)을 알아야 합니다.' },
          { type: 'figure', html: `<div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center">${consoleFig('    *\n   ***\n  *****\n *******\n*********\n *******\n  *****\n   ***\n    *', '[프로그램 1] 다이아몬드 모양 출력')}${consoleFig('입력 진수 결정(16/10/8/2) : 16\n값 입력 : FF\n16진수 ==>  0xff\n10진수 ==>  255\n 8진수 ==>  0o377\n 2진수 ==>  0b11111111', '[프로그램 2] 진수 변환')}</div>`, caption: '이 장에서 완성할 두 프로그램의 실행 결과 ([프로그램 2]의 16 과 FF 는 사용자가 입력한 값)' },

          { type: 'h', text: 'print() 함수의 기본: 문자 100 과 숫자 100' },
          { type: 'p', html: '<code>print()</code> 는 괄호 안의 내용을 화면(콘솔)에 보여 주는 함수입니다. 1장에서는 <code>print("안녕하세요?")</code> 처럼 따옴표 안의 글자를 그대로 출력했습니다. 그런데 따옴표 안에 숫자를 넣으면 어떻게 될까요?' },
          { type: 'code', title: '추가 예제. print() 함수의 서식 ➊~➍', code: 'print("안녕하세요?")\nprint("100")               # ➊ 문자 100\nprint("%d" % 100)          # ➋ 숫자 100\nprint("100 + 100")         # ➌ 글자 그대로\nprint("%d" % (100 + 100))  # ➍ 계산 결과 200',
            expect: '안녕하세요?\n100\n100\n100 + 100\n200',
            desc: '<code>2행</code>과 <code>3행</code>은 화면에 똑같이 <code>100</code> 이 보이지만 의미가 다릅니다. <code>"100"</code> 은 따옴표로 감쌌으므로 <b>글자 1, 0, 0 이 이어진 문자열</b>(일영영)이고, <code>%d</code> 자리에 들어간 <code>100</code> 은 <b>숫자 백</b>입니다. <code>4행</code>은 따옴표 안이므로 계산하지 않고 글자 그대로, <code>5행</code>은 <code>100 + 100</code> 을 먼저 계산한 숫자 200 을 출력합니다.' },
          { type: 'callout', kind: 'tip', title: '따옴표 = “글자로 취급해 줘”', html: '따옴표(<code>" "</code> 또는 <code>\' \'</code>) 안에 들어간 내용은 숫자처럼 보여도 <b>무조건 문자(문자열)</b>입니다. 그래서 <code>"100 + 100"</code> 은 계산되지 않습니다. 숫자로 계산하고 싶다면 따옴표 밖에 써야 합니다.' },

          { type: 'h', text: '서식 문자와 % 연산자' },
          { type: 'p', html: '<code>"%d" % 100</code> 에서 <code>%d</code> 는 <b>“여기에 정수(decimal)가 들어갈 자리”</b>라는 표시이고, 문자열 뒤의 <code>%</code> 는 <b>“오른쪽 값을 왼쪽 자리에 채워 넣어라”</b>라는 뜻입니다. 이런 자리 표시를 <b>서식 문자(format specifier)</b>라고 합니다. 값이 여러 개이면 괄호로 묶어 순서대로 씁니다.' },
          { type: 'figure', html: FIG_PRINT_PAIR, caption: '그림 3-1. 서식과 숫자의 대응 — 서식 문자 개수와 값의 개수가 같아야 한다' },
          { type: 'p', html: '서식 문자와 값의 <b>개수가 맞지 않으면 오류</b>가 발생합니다. 값이 남는 경우(➎)와 모자라는 경우(➏)를 직접 실행해 봅시다.' },
          { type: 'code', title: '추가 예제. ➎ 값이 서식 문자보다 많을 때', code: 'print("%d" % (100, 200))', expectError: true,
            expect: 'Traceback (most recent call last):\n  File "main.py", line 1, in <module>\n    print("%d" % (100, 200))\n          ~~~~~^~~~~~~~~~~~\nTypeError: not all arguments converted during string formatting',
            desc: '“모든 값을 문자열로 바꾸지 못했다(자리가 모자란다)”는 <code>TypeError</code> 입니다. 숫자 2개를 출력하려면 <code>%d</code> 도 2개가 필요합니다.' },
          { type: 'code', title: '추가 예제. ➏ 서식 문자가 값보다 많을 때', code: 'print("%d %d" % (100))', expectError: true,
            expect: 'Traceback (most recent call last):\n  File "main.py", line 1, in <module>\n    print("%d %d" % (100))\n          ~~~~~~~~^~~~~~~\nTypeError: not enough arguments for format string',
            desc: '“서식 문자열에 넣을 값이 부족하다”는 오류입니다. 이 경우는 <code>%d</code> 하나를 지우면 해결됩니다.' },
          { type: 'code', title: '추가 예제. 서식 문자와 값의 개수를 맞춘 코드', code: 'print("%d %d" % (100, 200))\nprint("%d" % 100)', expect: '100 200\n100' },

          { type: 'h', text: '값의 종류와 서식이 맞지 않을 때' },
          { type: 'p', html: '개수가 맞아도 <b>종류</b>가 맞지 않으면 원하지 않는 결과가 나옵니다. 아래 코드는 오류 없이 실행되지만, 100/200 의 결과가 <code>0.5</code> 가 아니라 <code>0</code> 으로 찍힙니다.' },
          { type: 'code', title: '추가 예제. 서식과 숫자의 불일치', code: 'print("%d / %d = %d" % (100, 200, 0.5))', expect: '100 / 200 = 0',
            desc: '세 번째 <code>%d</code> 는 <b>정수</b> 자리입니다. 실수 0.5 를 정수 자리에 넣으니 소수점 아래가 잘려 <code>0</code> 이 되었습니다.' },
          { type: 'figure', html: FIG_PRINT_MISMATCH, caption: '그림 3-2. 서식과 숫자의 불일치 상황' },
          { type: 'code', title: '추가 예제. 실수 서식(%f)으로 고친 코드', code: 'print("%d / %d = %5.1f" % (100, 200, 0.5))', expect: '100 / 200 =   0.5',
            desc: '<code>%5.1f</code> 는 “전체 5칸, 소수점 아래 1자리의 실수”입니다. <code>0.5</code> 는 3칸이므로 앞에 빈칸 2개가 붙습니다.' },
          { type: 'table', head: ['서식', '값의 예', '설명'], rows: [
            ['<code>%d</code>, <code>%x</code>, <code>%o</code>', '10, 100, 1234', '정수 (10진수, 16진수, 8진수)'],
            ['<code>%f</code>', '0.5, 1.0, 3.14', '실수 (소수점이 붙은 수)'],
            ['<code>%c</code>', '"b", "한"', '한 글자'],
            ['<code>%s</code>', '"안녕", "abcdefg", "a"', '문자열 (두 글자 이상도 가능)']
          ], caption: '표 3-1. print() 함수에서 사용할 수 있는 서식' },
          { type: 'code', title: '추가 예제. 표 3-1 의 서식 모두 써 보기', code: 'print("%d %x %o" % (255, 255, 255))\nprint("%f" % 3.14)\nprint("%c%c" % ("b", "한"))\nprint("%s, %s!" % ("안녕", "파이썬"))',
            expect: '255 ff 377\n3.140000\nb한\n안녕, 파이썬!',
            desc: '같은 255 라도 <code>%d</code> 는 10진수, <code>%x</code> 는 16진수(ff), <code>%o</code> 는 8진수(377)로 보여 줍니다. 진수는 4교시에서 자세히 배웁니다.' },

          { type: 'h', text: 'print() 함수를 사용한 깔끔한 출력: 자릿수 지정' },
          { type: 'p', html: '서식 문자 가운데에 숫자를 넣으면 <b>몇 칸을 차지할지</b> 정할 수 있습니다. 여러 줄의 숫자를 오른쪽 끝에 맞춰 표처럼 정렬할 때 아주 유용합니다.' },
          { type: 'code', title: 'Code03-01. 서식 문자로 자릿수 지정하기', code: 'print("%d" % 123)\nprint("%5d" % 123)\nprint("%05d" % 123)\n\nprint("%f" % 123.45)\nprint("%7.1f" % 123.45)\nprint("%7.3f" % 123.45)\n\nprint("%s" % "Python")\nprint("%10s" % "Python")',
            expect: '123\n  123\n00123\n123.450000\n  123.5\n123.450\nPython\n    Python',
            desc: '<code>1~3행</code> 정수, <code>5~7행</code> 실수, <code>9~10행</code> 문자열의 자릿수 지정입니다. 아래 그림으로 한 칸 한 칸 확인해 봅시다.' },
          { type: 'figure', html: FIG_INT_BOX, caption: '그림 3-3. 정수형 데이터의 서식 지정 (Code03-01 1~3행)' },
          { type: 'list', items: [
            '<code>%d</code>: 숫자의 자릿수(123 → 3칸)만큼만 차지합니다.',
            '<code>%5d</code>: 먼저 <b>다섯 칸</b>을 확보하고 숫자를 <b>오른쪽</b>에 붙입니다. 남은 왼쪽 두 칸은 빈칸입니다.',
            '<code>%05d</code>: 다섯 칸을 확보하되 남는 칸을 <b>0 으로 채웁니다</b>. 주문 번호 00123, 시각 09:05 처럼 자릿수를 고정할 때 씁니다.'
          ] },
          { type: 'figure', html: FIG_FLOAT_BOX, caption: '그림 3-4. 실수형 데이터의 서식 지정 (Code03-01 5~7행)' },
          { type: 'list', items: [
            '<code>%f</code>: 소수점 아래를 <b>항상 여섯 자리</b>까지 출력합니다. (123.45 → 123.450000)',
            '<code>%7.1f</code>: 점(.)까지 포함해 <b>전체 7칸</b>, 소수점 아래 <b>1자리</b>. 둘째 자리에서 반올림해 123.5 가 됩니다.',
            '<code>%7.3f</code>: 전체 7칸, 소수점 아래 3자리. 모자란 자리는 0 으로 채워 123.450 이 됩니다.'
          ] },
          { type: 'figure', html: FIG_STR_BOX, caption: '그림 3-5. 문자열 데이터의 서식 지정 (Code03-01 9~10행)' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 왼쪽 정렬과 전체 폭보다 긴 값', html: '폭 앞에 <code>-</code> 를 붙이면 <b>왼쪽 정렬</b>이 됩니다: <code>"%-10s|" % "Python"</code> → <code>Python    |</code>. 또 값이 지정한 폭보다 길면 잘리지 않고 <b>값 전체가 그대로</b> 출력됩니다: <code>"%3d" % 123456</code> → <code>123456</code>. 폭은 “최소 칸 수”라고 기억하세요.' },
          { type: 'code', title: '추가 예제. 자릿수 지정으로 표 만들기', code: 'print("%-8s%6s%8s" % ("item", "count", "price"))\nprint("%-8s%6d%8.1f" % ("apple", 3, 1.5))\nprint("%-8s%6d%8.1f" % ("banana", 12, 0.25))\nprint("%-8s%6d%8.1f" % ("melon", 1, 12.0))',
            expect: 'item     count   price\napple        3     1.5\nbanana      12     0.2\nmelon        1    12.0',
            desc: '글자는 왼쪽(<code>%-8s</code>), 숫자는 오른쪽(<code>%6d</code>, <code>%8.1f</code>) 정렬하면 표처럼 깔끔해집니다. 0.25 가 0.2 로 보이는 까닭은 컴퓨터가 실수를 2진수로 저장하며 생기는 아주 작은 오차 때문에 “0.25 에 가장 가까운 짝수 쪽”으로 반올림하기 때문입니다. (한글은 화면에서 영문 두 칸 너비로 보여 줄이 어긋날 수 있어 영어 이름을 썼습니다.)' }
        ],
        practice: [
          { title: '실습 3-1. 나의 정보 서식 출력', level: 1,
            desc: '<p>이름(문자열), 나이(정수), 키(실수)를 <b>% 서식 문자</b>로 출력하세요. 키는 소수점 아래 한 자리까지 출력합니다.</p><pre>이름 : 홍길동\n나이 : 17세\n키 : 172.5cm</pre>',
            hint: '<code>%s</code>, <code>%d</code>, <code>%.1f</code> 를 사용합니다. <code>%.1f</code> 처럼 전체 폭을 생략하고 소수점 자릿수만 쓸 수도 있습니다.',
            starter: '# 이름, 나이, 키를 서식 문자로 출력하세요\nprint("이름 : %s" % "홍길동")\n# TODO: 나이 (정수)\n# TODO: 키 (실수, 소수점 아래 한 자리)\n',
            solution: 'print("이름 : %s" % "홍길동")\nprint("나이 : %d세" % 17)\nprint("키 : %.1fcm" % 172.46)\n',
            expect: '이름 : 홍길동\n나이 : 17세\n키 : 172.5cm' },
          { title: '실습 3-2. 오른쪽 끝을 맞춘 숫자', level: 2,
            desc: '<p>숫자 7, 65, 432, 1024 를 <b>여섯 칸</b>에 오른쪽 정렬해 한 줄씩 출력하고, 마지막 줄에는 같은 숫자 1024 를 <b>0 으로 채운 여섯 자리</b>로 출력하세요.</p><pre>     7\n    65\n   432\n  1024\n001024</pre>',
            hint: '<code>%6d</code> 와 <code>%06d</code>',
            starter: 'print("%6d" % 7)\n# TODO: 65, 432, 1024\n# TODO: 1024 를 0 으로 채운 여섯 자리로\n',
            solution: 'print("%6d" % 7)\nprint("%6d" % 65)\nprint("%6d" % 432)\nprint("%6d" % 1024)\nprint("%06d" % 1024)\n',
            expect: '     7\n    65\n   432\n  1024\n001024' }
        ],
        quiz: [
          { q: '다음 코드의 실행 결과는?<pre><code>print("100 + 100")</code></pre>', options: ['200', '100 + 100', '100100', '오류'], answer: 1,
            explain: '따옴표 안의 내용은 계산하지 않고 글자 그대로 출력합니다.' },
          { q: '다음 코드를 실행하면 어떻게 될까?<pre><code>print("%d %d" % (100))</code></pre>', options: ['100 100', '100', '100 0', 'TypeError 오류'], answer: 3,
            explain: '<code>%d</code> 는 2개인데 값은 1개뿐이라 <code>not enough arguments for format string</code> 오류가 발생합니다.' },
          { q: '<code>print("%05d" % 42)</code> 의 출력은?', options: ['42', '   42', '00042', '42000'], answer: 2,
            explain: '다섯 칸을 확보하고 오른쪽 정렬한 뒤 빈칸을 0 으로 채웁니다.' },
          { q: '<code>print("%7.2f" % 3.14159)</code> 의 출력은? (□는 빈칸)', options: ['3.14', '□□□3.14', '3.141590', '□□□□3.1'], answer: 1,
            explain: '소수점 아래 2자리(3.14, 4칸)를 전체 7칸에 오른쪽 정렬하므로 앞에 빈칸 3개가 붙습니다.' },
          { q: '<code>print("%d / %d = %d" % (100, 200, 0.5))</code> 의 출력은?', options: ['100 / 200 = 0.5', '100 / 200 = 0', '오류', '100 / 200 = 1'], answer: 1,
            explain: '0.5 가 정수 자리(%d)에 들어가 소수점 아래가 버려지므로 0 이 됩니다. 실수는 %f 로 출력해야 합니다.' }
        ],
        slides: [
          { layout: 'title', title: 'print() 함수와 서식 문자', subtitle: 'Chapter 03 변수와 데이터형 · Section 01~02', badge: '1교시',
            notes: '<p>3장 시작. 2장까지는 출력하고 계산만 했다면, 이번 장부터 “보기 좋게 출력”하고 “값을 기억”하는 방법을 배운다고 소개합니다.</p><p><b>발문</b>: “계산기 앱에서 결과가 0.5000000 처럼 나오면 보기 좋을까요?”</p><p>시간: 1분</p>' },
          { layout: 'two', title: '이 장에서 만들 프로그램',
            left: { title: '[프로그램 1] 다이아몬드 출력', html: `<pre style="font-size:20px;line-height:1.3">    *\n   ***\n  *****\n *******\n*********\n *******\n  *****\n   ***\n    *</pre>` },
            right: { title: '[프로그램 2] 진수 변환', html: `<pre style="font-size:17px;line-height:1.4">입력 진수 결정(16/10/8/2) : 16\n값 입력 : FF\n16진수 ==>  0xff\n10진수 ==>  255\n 8진수 ==>  0o377\n 2진수 ==>  0b11111111</pre>` },
            notes: '<p>완성된 두 프로그램을 먼저 보여 주고 목표를 제시합니다. 프로그램 1은 오늘(1~2교시), 프로그램 2는 4교시에 완성합니다.</p><p><b>발문</b>: “FF 가 255 라는데, 이게 무슨 뜻일까요?” — 궁금증만 남기고 넘어갑니다.</p><p>시간: 3분</p>' },
          { layout: 'code', title: '문자 100 vs 숫자 100', code: 'print("안녕하세요?")\nprint("100")               # ➊ 문자 100\nprint("%d" % 100)          # ➋ 숫자 100\nprint("100 + 100")         # ➌ 글자 그대로\nprint("%d" % (100 + 100))  # ➍ 계산 결과 200',
            points: ['➊ 따옴표 안 → 무조건 문자 (일영영)', '➋ %d 자리 → 숫자 (백)', '➌ 계산 안 됨, ➍ 계산 후 출력', '%d = 정수가 들어갈 자리'],
            notes: '<p>실행 전 결과를 예측하게 합니다. ➊과 ➋는 화면상 똑같이 보인다는 점이 포인트 — “보이는 모양은 같아도 컴퓨터 안에서는 다르다”.</p><p>➌을 <code>print(100 + 100)</code> 으로 바꿔 실행해 보여 주면 따옴표의 역할이 분명해집니다.</p><p>시간: 5분</p>' },
          { layout: 'diagram', title: '서식 문자와 값의 짝 맞추기', html: FIG_PRINT_PAIR, caption: '그림 3-1. %d 개수 = 값의 개수',
            notes: '<p>% 연산자 왼쪽은 “틀(자리)”, 오른쪽은 “채울 값”이라고 설명합니다. 빈칸 채우기 시험지에 비유하면 좋습니다: 빈칸 2개 → 답 2개.</p><p>시간: 3분</p>' },
          { layout: 'code', repl: true, title: '짝이 맞지 않으면? (➎ ➏)', code: 'print("%d" % (100, 200))\nprint("%d %d" % (100))\nprint("%d %d" % (100, 200))',
            points: ['➎ 값이 남음 → not all arguments converted', '➏ 값이 모자람 → not enough arguments', '둘 다 TypeError', '개수를 맞추면 정상 출력'],
            notes: '<p>셸에서 한 줄씩 실행해 오류 메시지를 함께 읽습니다. 오류 메시지의 마지막 줄만 읽어도 원인을 알 수 있다는 습관을 길러 줍니다.</p><p>시간: 4분</p>' },
          { layout: 'diagram', title: '종류가 맞지 않으면?', html: FIG_PRINT_MISMATCH, caption: '그림 3-2. 0.5 가 정수 자리에 들어가 0 이 됨',
            notes: '<p>오류가 나지 않아서 더 위험한 경우라고 강조합니다. “틀린 답이 조용히 나오는 버그”.</p><p>고친 코드: <code>print("%d / %d = %5.1f" % (100, 200, 0.5))</code> → <code>100 / 200 =   0.5</code></p><p>시간: 3분</p>' },
          { layout: 'table', title: '표 3-1. print() 에서 쓰는 서식', head: ['서식', '값의 예', '설명'], rows: [
            ['%d, %x, %o', '10, 100, 1234', '정수 (10 · 16 · 8진수)'], ['%f', '0.5, 1.0, 3.14', '실수'], ['%c', '"b", "한"', '한 글자'], ['%s', '"안녕", "abcdefg"', '문자열']],
            lead: 'd = decimal(정수), f = float(실수), c = character, s = string',
            notes: '<p>영어 머리글자로 외우게 합니다. 실제로는 %d, %f, %s 세 가지를 가장 많이 씁니다.</p><p>%x, %o 는 4교시 진수 변환과 연결됩니다.</p><p>시간: 2분</p>' },
          { layout: 'code', title: 'Code03-01. 자릿수 지정하기', code: 'print("%d" % 123)\nprint("%5d" % 123)\nprint("%05d" % 123)\n\nprint("%f" % 123.45)\nprint("%7.1f" % 123.45)\nprint("%7.3f" % 123.45)\n\nprint("%s" % "Python")\nprint("%10s" % "Python")',
            points: ['%5d → 5칸 확보, 오른쪽 정렬', '%05d → 빈칸을 0 으로', '%7.1f → 전체 7칸, 소수 1자리', '%10s → 10칸, 오른쪽 정렬'],
            notes: '<p>실행 결과의 빈칸이 잘 보이도록 콘솔을 확대해서 보여 줍니다.</p><p><b>발문</b>: “%7.1f 에서 7 에는 점(.)도 포함될까요?” → 포함(123.5 는 5칸 + 빈칸 2칸).</p><p>시간: 6분</p>' },
          { layout: 'diagram', title: '정수 서식: %d · %5d · %05d', html: FIG_INT_BOX, caption: '그림 3-3. 칸을 먼저 확보하고 오른쪽부터 채운다',
            notes: '<p>칸(그릇)을 그려 가며 설명합니다. 학생에게 <code>%6d</code> 로 123 을 출력하면 빈칸이 몇 개인지 물어봅니다(3개).</p><p>시간: 3분</p>' },
          { layout: 'diagram', title: '실수 · 문자열 서식', html: FIG_FLOAT_BOX + FIG_STR_BOX, caption: '그림 3-4 · 3-5. %f 는 소수 6자리, %7.1f 는 둘째 자리에서 반올림',
            notes: '<p>%f 의 기본 소수 6자리, 반올림 규칙을 짚습니다. 문자열도 같은 원리(%10s)라는 점을 연결합니다.</p><p>시간: 3분</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>print("%7.2f" % 3.14159)</code> 의 출력은? (□는 빈칸)', options: ['3.14', '□□□3.14', '3.141590', '□□□□3.1'], answer: 1,
            explain: '3.14 는 4칸 → 7칸 중 앞 3칸이 빈칸',
            notes: '<p>3.141590 을 고른 학생은 %f 와 혼동한 것입니다. 점도 한 칸을 차지한다는 점을 다시 확인합니다.</p><p>시간: 2분</p>' },
          { layout: 'practice', title: '실습 3-1. 나의 정보 서식 출력', desc: '이름(%s), 나이(%d), 키(%.1f)를 서식 문자로 출력하세요.',
            starter: 'print("이름 : %s" % "홍길동")\n# TODO: 나이 (정수)\n# TODO: 키 (실수, 소수점 아래 한 자리)\n',
            solution: 'print("이름 : %s" % "홍길동")\nprint("나이 : %d세" % 17)\nprint("키 : %.1fcm" % 172.46)\n',
            notes: '<p>각자 자신의 정보로 바꿔 출력하게 합니다. <code>%.1fcm</code> 처럼 서식 바로 뒤에 글자를 붙여도 된다는 점을 보여 줍니다.</p><p>시간: 6분</p>' },
          { layout: 'summary', title: '정리', bullets: ['따옴표 안 = 문자, %d 자리 = 숫자', '서식 문자 개수 = % 뒤 값의 개수 (다르면 TypeError)', '%d 정수 · %f 실수 · %s 문자열 · %c 한 글자', '%5d 5칸 오른쪽 정렬, %05d 0 채움', '%7.1f 전체 7칸 · 소수 1자리, %10s 10칸'],
            notes: '<p>다음 시간: format() 함수, 이스케이프 문자(\\n, \\t), [프로그램 1] 다이아몬드 완성.</p><p>시간: 2분</p>' }
        ]
      },

      /* ───────────────────────── 2교시: format() · 이스케이프 · 프로그램 1 ───────────────────────── */
      {
        id: 'ch03-2',
        title: 'format() · 이스케이프 문자와 [프로그램 1]',
        minutes: 50,
        goals: [
          '"{0:5d}".format(값) 형식으로 서식과 출력 순서를 지정할 수 있다',
          '\\n, \\t, \\\\, \\", \\\' 등 이스케이프 문자의 역할을 설명할 수 있다',
          'print() 함수로 별표 다이아몬드 모양을 출력할 수 있다'
        ],
        flow: [['복습 · format()', 12], ['이스케이프 문자 (Code03-02)', 13], ['[프로그램 1] 다이아몬드', 10], ['SELF STUDY 3-1 · 퀴즈', 15]],
        content: [
          { type: 'h', text: 'format() 함수와 { } 로 서식 지정하기' },
          { type: 'p', html: '앞에서 배운 <code>%</code> 방식 말고도 문자열의 <b><code>format()</code> 함수</b>를 쓰는 방법이 있습니다. 문자열 안에 <code>{번호:서식}</code> 모양으로 자리를 만들고, <code>.format(값0, 값1, …)</code> 으로 값을 넘겨 줍니다. 서식 부분(<code>d</code>, <code>5d</code>, <code>05d</code>)은 % 방식과 같습니다.' },
          { type: 'code', title: '추가 예제. % 방식과 format() 방식 비교', code: 'print("%d  %5d  %05d" % (123, 123, 123))\nprint("{0:d}  {1:5d}  {2:05d}".format(123, 123, 123))',
            expect: '123    123  00123\n123    123  00123',
            desc: '두 줄의 결과가 똑같습니다. <code>{0:d}</code> 는 “0번째 값을 정수로”, <code>{1:5d}</code> 는 “1번째 값을 5칸 정수로”, <code>{2:05d}</code> 는 “2번째 값을 0 으로 채운 5칸 정수로”라는 뜻입니다.' },
          { type: 'figure', html: FIG_FORMAT, caption: '그림 3-6. format() 함수의 사용 — 번호는 0부터 센다' },
          { type: 'p', html: 'format() 방식의 장점은 <b>번호로 값을 골라 쓸 수 있다</b>는 것입니다. 값의 순서와 다르게 출력하거나, 같은 값을 여러 번 쓸 수도 있습니다.' },
          { type: 'code', title: '추가 예제. format() 으로 출력 순서 지정', code: 'print("{2:d}  {1:d}  {0:d}".format(100, 200, 300))', expect: '300  200  100',
            desc: '<code>{2:d}</code> 가 맨 앞에 있으므로 2번째 값(300)이 먼저 출력됩니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 번호 생략과 f-문자열', html: '<p>번호를 생략하면 앞에서부터 차례로 채웁니다: <code>"{} + {} = {}".format(1, 2, 3)</code> → <code>1 + 2 = 3</code>. 서식이 필요 없으면 <code>:d</code> 도 생략할 수 있습니다.</p><p>파이썬 3.6 부터는 문자열 앞에 <code>f</code> 를 붙이는 <b>f-문자열(f-string)</b>이 생겨, 중괄호 안에 <b>값이나 변수를 직접</b> 쓸 수 있습니다. 요즘 가장 많이 쓰는 방식이지만, 변수를 배운 뒤(3교시)에 쓰면 더 편리합니다.</p>' },
          { type: 'code', title: '추가 예제. 세 가지 서식 방식 한눈에 보기', code: 'print("%5d|%7.2f|%s" % (42, 3.14159, "hi"))\nprint("{0:5d}|{1:7.2f}|{2}".format(42, 3.14159, "hi"))\nprint(f"{42:5d}|{3.14159:7.2f}|{\'hi\'}")',
            expect: '   42|   3.14|hi\n   42|   3.14|hi\n   42|   3.14|hi',
            desc: '% 방식 → format() → f-문자열. 모두 같은 결과를 냅니다. 이 강좌는 강의자료를 따라 % 방식과 format() 을 주로 쓰고, f-문자열은 보충으로 소개합니다.' },

          { type: 'h', text: '강제로 줄 바꾸기: \\n' },
          { type: 'p', html: '<code>print()</code> 는 한 번 호출할 때마다 내용을 출력하고 <b>자동으로 줄을 바꿉니다</b>. 한 번의 print() 안에서 줄을 바꾸고 싶다면 문자열 중간에 <code>\\n</code>(역슬래시 + n)을 넣습니다. n 은 new line(새 줄)의 머리글자입니다.' },
          { type: 'code', title: '추가 예제. \\n 으로 행 넘기기', code: String.raw`print("한 행입니다. 또 한 행입니다.")
print("한 행입니다. \n또 한 행입니다.")`, expect: '한 행입니다. 또 한 행입니다.\n한 행입니다.\n또 한 행입니다.',
            desc: '<code>2행</code>은 print() 하나지만 <code>\\n</code> 위치에서 줄이 바뀌어 두 줄로 출력됩니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: print() 의 sep 와 end', html: '<code>print(값1, 값2)</code> 처럼 쉼표로 여러 값을 넘기면 사이에 빈칸 하나를 넣어 출력합니다. 사이에 넣을 글자는 <code>sep=</code> 로, 끝에 붙일 글자(기본값 <code>\\n</code>)는 <code>end=</code> 로 바꿀 수 있습니다. <code>end=""</code> 를 쓰면 줄을 바꾸지 않고 다음 print() 가 이어서 출력합니다.' },
          { type: 'code', title: '추가 예제. sep 와 end 사용하기', code: 'print("2026", "09", "18", sep="-")\nprint("줄을 ", end="")\nprint("바꾸지 않아요")\nprint("A", "B", "C")',
            expect: '2026-09-18\n줄을 바꾸지 않아요\nA B C' },

          { type: 'h', text: '이스케이프 문자' },
          { type: 'p', html: '<code>\\n</code> 처럼 <b>역슬래시(\\) 뒤에 한 글자를 붙여 특별한 뜻</b>을 나타내는 것을 <b>이스케이프 문자(escape character)</b>라고 합니다. 원래 글자의 뜻에서 “탈출(escape)”해 다른 역할을 한다는 의미입니다.' },
          { type: 'table', head: ['이스케이프 문자', '역할', '설명'], rows: [
            ['<code>\\n</code>', '새로운 줄로 이동', '<kbd>Enter</kbd> 를 누른 효과'],
            ['<code>\\t</code>', '다음 탭 위치로 이동', '<kbd>Tab</kbd> 을 누른 효과'],
            ['<code>\\b</code>', '뒤로 한 칸 이동', '<kbd>Backspace</kbd> 를 누른 효과'],
            ['<code>\\\\</code>', '<code>\\</code> 출력', '역슬래시 자체를 출력'],
            ['<code>\\\'</code>', '<code>\'</code> 출력', '작은따옴표 출력'],
            ['<code>\\"</code>', '<code>"</code> 출력', '큰따옴표 출력']
          ], caption: '표 3-2. 이스케이프 문자' },
          { type: 'code', title: 'Code03-02. 이스케이프 문자 사용하기', code: String.raw`print("\n줄바꿈\n연습 ")
print("\t탭키\t연습")
print("글자가 \"강조\"되는 효과1")
print("글자가 \'강조\'되는 효과2")
print("\\\\\\ 역슬래시 세 개 출력")
print(r"\n \t \" \\를 그대로 출력")`,
            expect: '\n줄바꿈\n연습\n\t탭키\t연습\n글자가 "강조"되는 효과1\n글자가 \'강조\'되는 효과2\n' + String.raw`\\\ 역슬래시 세 개 출력` + '\n' + String.raw`\n \t \" \\를 그대로 출력`,
            desc: '<code>1행</code> 맨 앞의 <code>\\n</code> 때문에 빈 줄이 먼저 출력됩니다. <code>2행</code> <code>\\t</code> 는 탭 간격만큼 띄웁니다. <code>3~4행</code> 따옴표 앞에 역슬래시를 붙이면 문자열을 끝내는 기호가 아니라 <b>글자</b>로 출력됩니다. <code>5행</code> <code>\\\\</code> 두 개가 역슬래시 하나이므로 6개 → 3개. <code>6행</code> 문자열 앞에 <code>r</code> 을 붙이면 <b>raw(날것) 문자열</b>이 되어 이스케이프 문자를 해석하지 않고 그대로 출력합니다.' },
          { type: 'callout', kind: 'info', title: '역슬래시(\\)와 원화 기호(₩)', html: '한글 윈도우의 일부 글꼴(IDLE 기본 글꼴 등)은 역슬래시 <code>\\</code> 를 원화 기호 <code>₩</code> 로 보여 줍니다. 모양만 다를 뿐 <b>같은 글자</b>입니다. 키보드의 <kbd>₩</kbd> 키(Enter 위)를 누르면 입력됩니다.' },
          { type: 'callout', kind: 'warn', title: '흔한 실수: 파일 경로의 역슬래시', html: '<code>print("C:\\new\\test")</code> 는 <code>\\n</code> 과 <code>\\t</code> 가 이스케이프 문자로 해석되어 이상하게 출력됩니다. 역슬래시를 두 번 쓰거나(<code>"C:\\\\new\\\\test"</code>) raw 문자열(<code>r"C:\\new\\test"</code>)을 사용하세요. <code>\\b</code> 는 콘솔 종류에 따라 다르게 보일 수 있어 이 강좌에서는 예제로 쓰지 않습니다.' },
          { type: 'code', title: '추가 예제. 경로 출력의 함정', code: String.raw`print("C:\new\test")
print("C:\\new\\test")
print(r"C:\new\test")`, expect: 'C:\new\test\n' +String.raw`C:\new\test` + '\n' + String.raw`C:\new\test`,
            desc: '<code>1행</code>은 <code>\\n</code> 에서 줄이 바뀌고 <code>\\t</code> 가 탭이 되어 <code>C:</code> / <code>ew&nbsp;&nbsp;&nbsp;&nbsp;est</code> 두 줄이 됩니다. <code>2~3행</code>처럼 써야 의도대로 출력됩니다.' },

          { type: 'h', text: '[프로그램 1]의 완성: 다이아몬드 모양 출력' },
          { type: 'p', html: '이제 print() 만으로 별표 다이아몬드를 그려 봅시다. 한 줄의 폭을 9칸으로 정하고, 별표 개수를 1 → 3 → 5 → 7 → 9 → 7 → 5 → 3 → 1 로 바꾸면서 <b>양쪽 빈칸으로 가운데를 맞춥니다</b>. 별이 2개 늘 때마다 왼쪽 빈칸은 1칸 줄어듭니다.' },
          { type: 'code', title: '[프로그램 1] 완성: Code03-03. 다이아몬드 모양 출력', code: 'print("    *    ")\nprint("   ***   ")\nprint("  *****  ")\nprint(" ******* ")\nprint("*********")\nprint(" ******* ")\nprint("  *****  ")\nprint("   ***   ")\nprint("    *    ")',
            expect: '    *\n   ***\n  *****\n *******\n*********\n *******\n  *****\n   ***\n    *',
            desc: '각 줄의 “왼쪽 빈칸 수 + 별 수 + 오른쪽 빈칸 수 = 9” 입니다. 오른쪽 빈칸은 눈에 보이지 않으므로 생략해도 결과는 같습니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 문자열 곱하기로 줄 만들기', html: '파이썬은 <code>"*" * 5</code> 처럼 <b>문자열에 정수를 곱하면 그 횟수만큼 반복</b>한 문자열을 만듭니다(<code>*****</code>). 빈칸도 <code>" " * 4</code> 로 만들 수 있으므로, 빈칸 수와 별 수만 계산하면 됩니다. 뒤에서 배울 반복문(for)과 함께 쓰면 몇 줄짜리 다이아몬드든 짧은 코드로 그릴 수 있습니다.' },
          { type: 'code', title: '추가 예제. 문자열 곱하기로 그린 다이아몬드 (미리 보기)', code: 'print(" " * 4 + "*" * 1)\nprint(" " * 3 + "*" * 3)\nprint(" " * 2 + "*" * 5)\nprint(" " * 1 + "*" * 7)\nprint(" " * 0 + "*" * 9)\n\n# 반복문(7장)을 쓰면 더 짧아집니다\nfor n in [7, 5, 3, 1]:\n    print(" " * ((9 - n) // 2) + "*" * n)',
            expect: '    *\n   ***\n  *****\n *******\n*********\n *******\n  *****\n   ***\n    *',
            desc: '<code>8~9행</code>은 아직 배우지 않은 반복문입니다. “이런 방법도 있구나” 정도로만 보고 넘어가세요. <code>(9 - n) // 2</code> 는 왼쪽 빈칸 수를 계산하는 식입니다.' }
        ],
        practice: [
          { title: 'SELF STUDY 3-1. 모래시계 모양 출력', level: 1,
            desc: '<p>별표가 다음과 같이 출력되도록 print() 문을 작성해 보세요.</p><pre>*********\n *******\n  *****\n   ***\n    *\n   ***\n  *****\n *******\n*********</pre>',
            hint: '[프로그램 1] 다이아몬드의 줄 순서를 뒤집은 모양입니다. 가운데 줄의 별이 1개입니다.',
            starter: 'print("*********")\nprint(" ******* ")\n# TODO: 나머지 줄을 완성하세요\n',
            solution: 'print("*********")\nprint(" ******* ")\nprint("  *****  ")\nprint("   ***   ")\nprint("    *    ")\nprint("   ***   ")\nprint("  *****  ")\nprint(" ******* ")\nprint("*********")\n',
            expect: '*********\n *******\n  *****\n   ***\n    *\n   ***\n  *****\n *******\n*********' },
          { title: '실습 3-3. print() 한 번으로 성적표 출력', level: 2,
            desc: '<p><b>print() 를 한 번만</b> 사용하여 다음과 같이 출력하세요. 각 열 사이는 탭(<code>\\t</code>)으로 띄우고, 줄은 <code>\\n</code> 으로 바꿉니다. 마지막 줄의 과목명은 큰따옴표로 감쌉니다.</p><pre>이름\t국어\t수학\n철수\t90\t85\n영희\t100\t95\n"과목"은 2개</pre>',
            hint: '<code>"이름\\t국어\\t수학\\n철수…"</code> 처럼 한 문자열에 모두 넣습니다. 문자열 안의 큰따옴표는 <code>\\"</code> 로 씁니다.',
            starter: '# print() 를 한 번만 사용하세요\nprint("이름\\t국어\\t수학")\n',
            solution: 'print("이름\\t국어\\t수학\\n철수\\t90\\t85\\n영희\\t100\\t95\\n\\"과목\\"은 2개")\n',
            expect: '이름\t국어\t수학\n철수\t90\t85\n영희\t100\t95\n"과목"은 2개' },
          { title: '실습 3-4. format() 으로 순서 바꾸기', level: 2,
            desc: '<p><code>.format("사과", "바나나", "체리")</code> 의 값 순서는 그대로 두고, 문자열의 <code>{번호}</code> 만 바꿔서 다음과 같이 출력하세요.</p><pre>체리 - 바나나 - 사과\n사과 사과 사과</pre>',
            hint: '<code>{2}</code> 는 세 번째 값(체리)입니다. 같은 번호를 여러 번 써도 됩니다.',
            starter: 'print("{0} - {1} - {2}".format("사과", "바나나", "체리"))\n# TODO: 첫 줄의 번호 순서를 바꾸고, 둘째 줄을 추가하세요\n',
            solution: 'print("{2} - {1} - {0}".format("사과", "바나나", "체리"))\nprint("{0} {0} {0}".format("사과", "바나나", "체리"))\n',
            expect: '체리 - 바나나 - 사과\n사과 사과 사과' }
        ],
        quiz: [
          { q: '다음 코드의 실행 결과는?<pre><code>print("{2:d} {0:d} {1:d}".format(10, 20, 30))</code></pre>', options: ['10 20 30', '30 10 20', '20 30 10', '30 20 10'], answer: 1,
            explain: '{2} → 30, {0} → 10, {1} → 20 순서로 출력됩니다. 번호는 0부터 셉니다.' },
          { q: '<code>print("A\\nB")</code> 의 실행 결과로 옳은 것은?', options: ['A\\nB', 'AnB', 'A 와 B 가 두 줄로 출력', 'A B'], answer: 2,
            explain: '<code>\\n</code> 은 줄 바꿈 이스케이프 문자입니다.' },
          { q: '화면에 역슬래시 <b>하나</b>(<code>\\</code>)를 출력하려면 문자열 안에 무엇을 써야 할까?', options: ['\\', '\\\\', '\\b', '/'], answer: 1,
            explain: '역슬래시는 이스케이프 문자의 시작 기호이므로, 글자 그대로 출력하려면 <code>\\\\</code> 처럼 두 번 씁니다.' },
          { q: '<code>print(r"a\\tb")</code> 의 실행 결과는?', options: ['a    b (탭)', 'a\\tb', 'ab', 'r"a\\tb"'], answer: 1,
            explain: 'r 을 붙인 raw 문자열은 이스케이프 문자를 해석하지 않고 그대로 출력합니다.' },
          { q: '[프로그램 1]에서 폭이 9칸일 때, 별이 5개인 줄의 왼쪽 빈칸은 몇 개인가?', options: ['1개', '2개', '4개', '5개'], answer: 1,
            explain: '(9 − 5) ÷ 2 = 2 칸입니다.' }
        ],
        slides: [
          { layout: 'title', title: 'format() · 이스케이프 문자와 [프로그램 1]', subtitle: 'Chapter 03 · Section 02', badge: '2교시',
            notes: '<p>1교시 복습: <code>print("%5d" % 123)</code> 결과를 묻고 시작합니다.</p><p>오늘은 서식을 지정하는 두 번째 방법(format), 특수 문자(이스케이프), 그리고 [프로그램 1]을 완성합니다.</p><p>시간: 2분</p>' },
          { layout: 'code', title: '% 방식 vs format() 방식', code: 'print("%d  %5d  %05d" % (123, 123, 123))\nprint("{0:d}  {1:5d}  {2:05d}".format(123, 123, 123))\nprint("{2:d}  {1:d}  {0:d}".format(100, 200, 300))',
            points: ['{번호:서식} 으로 자리 표시', '번호는 0부터, format() 안의 값 순서', '서식(d, 5d, 05d)은 % 방식과 같음', '번호로 출력 순서를 바꿀 수 있다'],
            notes: '<p>1~2행 결과가 같음을 확인하고, 3행에서 순서가 뒤집히는 것을 보여 줍니다.</p><p><b>발문</b>: “{0} {0} {0} 처럼 같은 번호를 여러 번 쓰면?” — 직접 바꿔 실행.</p><p>시간: 5분</p>' },
          { layout: 'diagram', title: 'format() 함수의 사용', html: FIG_FORMAT, caption: '그림 3-6. 0번째 · 1번째 · 2번째 값이 각 자리로',
            notes: '<p>화살표를 따라가며 값이 어디로 들어가는지 짚습니다. 번호가 1부터가 아니라 <b>0부터</b>라는 점이 가장 헷갈리는 부분입니다.</p><p>시간: 3분</p>' },
          { layout: 'code', title: '더 알아보기: f-문자열', code: 'print("%5d|%7.2f|%s" % (42, 3.14159, "hi"))\nprint("{0:5d}|{1:7.2f}|{2}".format(42, 3.14159, "hi"))\nprint(f"{42:5d}|{3.14159:7.2f}|{\'hi\'}")',
            points: ['세 줄 모두 같은 결과', 'f"…{값:서식}…" — 요즘 가장 많이 쓰는 방식', '변수와 함께 쓸 때 편리 (3교시 이후)'],
            notes: '<p>강의자료 범위 밖의 보충 내용입니다. 시간이 부족하면 건너뛰어도 됩니다. 인터넷 예제 코드에서 f"…" 를 자주 보게 되니 “이런 것도 있다” 정도만 알려 줍니다.</p><p>시간: 3분</p>' },
          { layout: 'code', title: '\\n 으로 강제 행 넘기기', code: String.raw`print("한 행입니다. 또 한 행입니다.")
print("한 행입니다. \n또 한 행입니다.")
print("2026", "09", "18", sep="-")
print("줄을 ", end="")
print("바꾸지 않아요")`,
            points: ['print() 는 끝에서 자동 줄 바꿈', '문자열 안의 \\n → 그 자리에서 줄 바꿈', '(보충) sep= 사이 글자, end= 끝 글자'],
            notes: '<p>1~2행이 핵심. sep/end 는 보충이지만 뒤 장(반복문)에서 <code>end=""</code> 를 많이 쓰므로 미리 한 번 보여 줍니다.</p><p>시간: 4분</p>' },
          { layout: 'table', title: '표 3-2. 이스케이프 문자', head: ['문자', '역할', '설명'], rows: [
            ['\\n', '새 줄로 이동', 'Enter 효과'], ['\\t', '다음 탭으로 이동', 'Tab 효과'], ['\\b', '뒤로 한 칸', 'Backspace 효과'], ['\\\\', '\\ 출력', ''], ['\\\'', '\' 출력', ''], ['\\"', '" 출력', '']],
            lead: '역슬래시(\\) + 한 글자 = 특별한 의미',
            notes: '<p>한글 윈도우에서는 \\ 가 ₩ 로 보일 수 있다는 점을 알려 줍니다(같은 글자).</p><p>시간: 3분</p>' },
          { layout: 'code', title: 'Code03-02. 이스케이프 문자 사용하기', code: String.raw`print("\n줄바꿈\n연습 ")
print("\t탭키\t연습")
print("글자가 \"강조\"되는 효과1")
print("글자가 \'강조\'되는 효과2")
print("\\\\\\ 역슬래시 세 개 출력")
print(r"\n \t \" \\를 그대로 출력")`,
            points: ['1행: 맨 앞 \\n → 빈 줄 먼저', '3~4행: \\" \\\' → 따옴표 글자', '5행: \\\\ 여섯 개 → \\ 세 개', '6행: r"…" raw 문자열 → 해석 안 함'],
            notes: '<p>실행 전에 각 줄의 결과를 예측해 보게 합니다. 5행은 거의 모든 학생이 틀립니다 — 두 개가 한 쌍이라는 점을 강조.</p><p>파일 경로 <code>"C:\\new\\test"</code> 함정도 함께 시연하면 좋습니다.</p><p>시간: 7분</p>' },
          { layout: 'code', title: '[프로그램 1] 완성: Code03-03', code: 'print("    *    ")\nprint("   ***   ")\nprint("  *****  ")\nprint(" ******* ")\nprint("*********")\nprint(" ******* ")\nprint("  *****  ")\nprint("   ***   ")\nprint("    *    ")',
            points: ['한 줄의 폭 = 9칸', '별 1 → 3 → 5 → 7 → 9 → … → 1', '왼쪽 빈칸 = (9 − 별 수) ÷ 2', '오른쪽 빈칸은 생략 가능'],
            notes: '<p>학생들이 직접 칸을 세어 입력하게 한 뒤 선생님 코드를 보여 줍니다. 빈칸 수를 틀리면 모양이 찌그러지므로 편집기의 고정폭 글꼴의 필요성도 언급합니다.</p><p>시간: 6분</p>' },
          { layout: 'code', title: '미리 보기: 문자열 곱하기', code: 'print(" " * 4 + "*" * 1)\nprint(" " * 3 + "*" * 3)\nprint(" " * 2 + "*" * 5)\nprint(" " * 1 + "*" * 7)\nprint("*" * 9)',
            points: ['"*" * 5 → *****', '문자열 + 문자열 → 이어 붙이기', '반복문(for)과 함께 쓰면 더 짧게'],
            notes: '<p>보충 내용. 문자열 연산은 뒤에서 다시 배우지만, 규칙성을 찾아 코드를 줄이는 사고를 맛보게 합니다.</p><p>시간: 3분</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>print("{2:d} {0:d} {1:d}".format(10, 20, 30))</code> 의 출력은?', options: ['10 20 30', '30 10 20', '20 30 10', '30 20 10'], answer: 1,
            explain: '{2}→30, {0}→10, {1}→20',
            notes: '<p>번호를 1부터 세는 학생은 “20 30 10” 등을 고릅니다. 0부터 센다는 점 재확인.</p><p>시간: 2분</p>' },
          { layout: 'practice', title: 'SELF STUDY 3-1. 모래시계 모양', desc: '별표가 9 → 7 → 5 → 3 → 1 → 3 → 5 → 7 → 9 개가 되도록 가운데 정렬해 출력하세요.',
            starter: 'print("*********")\nprint(" ******* ")\n# TODO: 나머지 줄을 완성하세요\n',
            solution: 'print("*********")\nprint(" ******* ")\nprint("  *****  ")\nprint("   ***   ")\nprint("    *    ")\nprint("   ***   ")\nprint("  *****  ")\nprint(" ******* ")\nprint("*********")\n',
            notes: '<p>빨리 끝낸 학생에게는 실습 3-3(print 한 번으로 성적표)을 추가 과제로 줍니다.</p><p>시간: 8분</p>' },
          { layout: 'summary', title: '정리', bullets: ['"{0:5d}".format(값) — 번호(0부터)와 서식', 'format() 은 번호로 출력 순서를 바꿀 수 있다', '이스케이프: \\n 줄 바꿈, \\t 탭, \\\\ \\\' \\" 글자 출력', 'r"…" raw 문자열은 이스케이프를 해석하지 않는다', '[프로그램 1] 빈칸 + 별로 가운데 정렬'],
            notes: '<p>다음 시간: 값을 기억하는 그릇, <b>변수</b>.</p><p>시간: 2분</p>' }
        ]
      },

      /* ───────────────────────── 3교시: 변수 ───────────────────────── */
      {
        id: 'ch03-3',
        title: '변수의 선언과 사용',
        minutes: 50,
        goals: [
          '변수를 “값을 담는 이름 붙은 그릇”으로 설명할 수 있다',
          'type() 함수로 변수의 데이터형을 확인할 수 있다',
          '변수명 규칙에 맞는 이름과 틀린 이름을 구분할 수 있다',
          '값 · 변수 · 계산식을 변수에 대입하고, 대입 연산자의 동작 순서를 설명할 수 있다'
        ],
        flow: [['변수 = 그릇', 8], ['선언 · type()', 8], ['변수명 규칙', 8], ['변수의 사용 (1)~(5)', 16], ['실습 · 퀴즈', 10]],
        content: [
          { type: 'h', text: '변수의 선언' },
          { type: 'p', html: '<b>변수(variable)</b>는 값을 저장해 두는 <b>메모리 공간</b>입니다. 부엌의 그릇에 음식을 담아 두듯, 프로그램은 변수에 값을 담아 두었다가 필요할 때 꺼내 씁니다. 그릇마다 이름표를 붙여 두는데, 이 이름이 바로 <b>변수명</b>입니다.' },
          { type: 'p', html: '<b>변수 선언</b>은 “이런 그릇을 쓰겠다”고 미리 준비하는 것입니다. C/C++ 이나 자바는 반드시 변수를 선언한 뒤에 써야 하지만, 파이썬은 <b>값을 처음 넣는 순간 변수가 자동으로 만들어지므로</b> 따로 선언하지 않아도 됩니다. 다만 코드가 길어지면 어떤 변수를 쓸지 앞부분에서 미리 정리해 두는 것이 읽기 좋고 실수도 줄여 줍니다.' },
          { type: 'code', title: '추가 예제. 변수 준비하기 (선언)', code: 'boolVar = True\nintVar = 0\nfloatVar = 0.0\nstrVar = ""\n\nprint(boolVar, intVar, floatVar, strVar)',
            expect: 'True 0 0.0',
            desc: '가장 많이 쓰는 네 종류의 변수입니다. <code>1행</code> 불형(Boolean, True 또는 False), <code>2행</code> 정수형, <code>3행</code> 실수형, <code>4행</code> 문자열(빈 문자열 <code>""</code>). 빈 문자열은 출력해도 아무것도 보이지 않습니다.' },
          { type: 'figure', html: FIG_CUPS, caption: '그림 3-7. 변수의 종류 — 담긴 값에 따라 그릇의 종류가 정해진다' },
          { type: 'callout', kind: 'tip', title: 'TIP. 여러 변수를 한 줄에', html: '위의 네 줄은 <code>boolVar, intVar, floatVar, strVar = True, 0, 0.0, ""</code> 처럼 한 줄로 쓸 수도 있습니다. 왼쪽 변수와 오른쪽 값이 <b>순서대로 짝지어</b> 들어갑니다. 개수가 다르면 오류가 납니다.' },
          { type: 'p', html: '변수에 어떤 종류(데이터형)의 값이 들어 있는지는 <code>type()</code> 함수로 확인합니다. 대화형 모드(<code>&gt;&gt;&gt;</code> 셸)에서 확인해 봅시다.' },
          { type: 'code', repl: true, title: '추가 예제. type() 함수로 데이터형 확인', code: 'boolVar, intVar, floatVar, strVar = True, 0, 0.0, ""\ntype(boolVar), type(intVar), type(floatVar), type(strVar)',
            expect: ">>> boolVar, intVar, floatVar, strVar = True, 0, 0.0, \"\"\n>>> type(boolVar), type(intVar), type(floatVar), type(strVar)\n(<class 'bool'>, <class 'int'>, <class 'float'>, <class 'str'>)\n>>>",
            desc: '<code>bool</code>(불형), <code>int</code>(정수), <code>float</code>(실수), <code>str</code>(문자열)로 만들어진 것을 확인할 수 있습니다. 셸에서는 print() 없이 값만 입력해도 결과가 보입니다. 쉼표로 여러 개를 쓰면 괄호로 묶여 한꺼번에 표시됩니다.' },
          { type: 'callout', kind: 'info', title: '대화형 모드 = 콘솔의 >>> 셸', html: '강의자료의 IDLE 셸 화면(<code>&gt;&gt;&gt;</code>) 예제는 이 강좌에서 <b>콘솔의 >>> 셸</b>에서 실행됩니다. 셸 예제의 ▶ 실행 버튼을 누르면 한 줄씩 입력되며 결과가 표시됩니다. 셸은 식의 값을 자동으로 보여 주지만, <b>편집기(스크립트)에서는 print() 를 써야</b> 결과가 보입니다.' },

          { type: 'h', text: '변수명 규칙' },
          { type: 'list', items: [
            '<b>대 · 소문자를 구분합니다.</b> <code>myVar</code> 와 <code>MyVar</code> 는 서로 다른 변수입니다.',
            '<b>문자, 숫자, 언더바(_)</b>를 쓸 수 있지만 <b>숫자로 시작하면 안 됩니다.</b> <code>var2</code>(O), <code>_var</code>(O), <code>var_2</code>(O), <code>2Var</code>(X)',
            '<b>예약어는 변수명으로 쓸 수 없습니다.</b> 예약어(keyword)는 파이썬이 이미 특별한 뜻으로 쓰는 단어입니다: <code>True, False, None, and, or, not, break, continue, return, if, else, elif, for, while, except, finally, global, import, try</code> 등',
            '공백(띄어쓰기)이나 <code>- + ! @</code> 같은 특수 문자도 쓸 수 없습니다.'
          ] },
          { type: 'table', head: ['변수명', '가능?', '이유'], rows: [
            ['<code>myVar</code>', '✅', '영문자로 시작'],
            ['<code>var_2</code>', '✅', '숫자와 언더바는 중간 · 끝에 가능'],
            ['<code>_var</code>', '✅', '언더바로 시작 가능'],
            ['<code>2Var</code>', '❌', '숫자로 시작'],
            ['<code>my var</code>', '❌', '공백 포함'],
            ['<code>my-var</code>', '❌', '<code>-</code> 는 빼기 연산자'],
            ['<code>for</code>', '❌', '예약어'],
            ['<code>For</code>', '✅ (비권장)', '대소문자가 달라 예약어가 아님']
          ], caption: '변수명 판정 연습' },
          { type: 'code', title: '추가 예제. 파이썬의 예약어 전체 보기', code: 'import keyword\nprint(keyword.kwlist)\nprint(len(keyword.kwlist), "개")',
            expect: "['False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield']\n35 개",
            desc: '<code>keyword</code> 모듈에 파이썬 예약어 목록이 들어 있습니다. 외울 필요는 없고, 편집기에서 색이 다르게 칠해지는 단어는 변수명으로 쓰지 않는다고 기억하면 됩니다.' },
          { type: 'code', title: '추가 예제. 숫자로 시작하는 변수명', code: '2Var = 100\nprint(2Var)', expectError: true,
            expect: '  File "main.py", line 1\n    2Var = 100\n    ^\nSyntaxError: invalid decimal literal',
            desc: '규칙을 어기면 프로그램이 아예 시작되지 않고 <code>SyntaxError</code>(문법 오류)가 발생합니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 좋은 변수 이름 짓기', html: '<p>규칙은 아니지만 모두가 지키는 <b>관례</b>도 있습니다. 파이썬 공식 스타일 가이드(PEP 8)는 변수명을 <b>소문자 + 언더바</b>(<code>my_score</code>, snake_case)로 쓰도록 권합니다. 강의자료는 <code>myVar</code>, <code>boolVar</code> 처럼 두 번째 단어를 대문자로 시작하는 camelCase 를 쓰는데, 이것도 흔히 쓰입니다. 어느 쪽이든 <b>한 프로그램 안에서 통일</b>하세요.</p><p><code>a</code>, <code>b</code> 보다는 <code>price</code>, <code>count</code> 처럼 <b>뜻이 드러나는 이름</b>이 좋습니다. 한글 변수명(<code>점수 = 90</code>)도 동작하지만 권장하지 않습니다. 또 <code>print</code>, <code>type</code>, <code>int</code> 같은 내장 함수 이름을 변수명으로 쓰면 그 함수를 더 이상 쓸 수 없게 되니 주의하세요.</p>' },

          { type: 'h', text: '변수의 사용 (1): 값 대입하기' },
          { type: 'p', html: '변수는 값을 담아야(<b>대입, assignment</b>) 사용할 수 있습니다. <code>=</code> 는 수학의 “같다”가 아니라 <mark>오른쪽의 값을 왼쪽 변수에 넣어라</mark>라는 <b>대입 연산자</b>입니다. 이미 값이 있는 변수에 새 값을 넣으면 <b>기존 값은 사라지고</b> 새 값으로 바뀝니다.' },
          { type: 'code', title: '추가 예제. 변수에 새 값 대입하기', code: 'boolVar, intVar, floatVar, strVar = True, 0, 0.0, ""\nprint(boolVar, intVar, floatVar, strVar)\n\nboolVar = False\nintVar = 100\nfloatVar = 123.45\nstrVar = "안녕?"\nprint(boolVar, intVar, floatVar, strVar)',
            expect: 'True 0 0.0\nFalse 100 123.45 안녕?' },
          { type: 'figure', html: FIG_REASSIGN, caption: '그림 3-8. 변수에 값을 대입해 새로운 값으로 변경된 상태' },
          { type: 'p', html: '변수에는 숫자뿐 아니라 <b>다른 변수의 값</b>이나 <b>계산 결과</b>도 넣을 수 있습니다. 오른쪽에 계산식이 있으면 파이썬은 <b>먼저 오른쪽을 계산</b>한 뒤 그 결과를 왼쪽 변수에 넣습니다.' },
          { type: 'code', title: '추가 예제. 변수 · 계산 결과를 대입하기', code: 'var2 = 200\nvar1 = var2          # 변수의 값을 대입\nprint(var1)\n\nvar1 = 100 + 100     # 계산 결과를 대입\nprint(var1)\n\nvar1 = var2 + 100    # 변수와 숫자를 연산한 결과를 대입\nprint(var1)',
            expect: '200\n200\n300',
            desc: '<code>2행</code> var2 의 값(200)만 <b>복사</b>해서 var1 에 넣습니다. var2 는 그대로 200 입니다. <code>5행</code> 100 + 100 을 먼저 계산(200)한 뒤 대입합니다. <code>8행</code> var2 의 값 200 을 꺼내 100 을 더한 300 을 대입합니다.' },
          { type: 'figure', html: FIG_ASSIGN3, caption: '그림 3-9 · 3-10 · 3-11. 변수를 · 숫자끼리 연산한 결과를 · 변수와 숫자를 연산한 결과를 대입하는 방식' },

          { type: 'h', text: '변수의 사용 (3): 연속 대입' },
          { type: 'p', html: '여러 변수에 같은 값을 한꺼번에 넣을 때는 <code>=</code> 를 이어서 씁니다. 동작은 <b>오른쪽에서 왼쪽으로</b> 차례로 전달되는 것과 같습니다.' },
          { type: 'code', title: '추가 예제. 연속된 값을 대입하는 방식', code: 'var1 = var2 = var3 = var4 = 100\nprint(var1, var2, var3, var4)\n\n# 위 한 줄은 다음 네 줄과 같은 결과\nvar4 = 100\nvar3 = var4\nvar2 = var3\nvar1 = var2\nprint(var1, var2, var3, var4)',
            expect: '100 100 100 100\n100 100 100 100' },
          { type: 'figure', html: FIG_CHAIN, caption: '그림 3-12. 연속된 값을 대입하는 방식 (➊ → ➍ 순서)' },

          { type: 'h', text: '변수의 사용 (4): 자신의 값에 다시 대입' },
          { type: 'p', html: '<code>var1 = var1 + 200</code> 은 수학식으로 보면 말이 안 되지만, 프로그램에서는 아주 자주 씁니다. “var1 의 <b>현재 값</b>에 200 을 더해서, 그 결과를 <b>다시 var1 에</b> 넣어라”는 뜻입니다. 점수 누적, 개수 세기 등에 쓰입니다.' },
          { type: 'code', title: '추가 예제. 연산 결과를 자신의 값으로 다시 대입', code: 'var1 = 100\nvar1 = var1 + 200\nprint(var1)\n\nvar1 += 200     # var1 = var1 + 200 의 줄임 표현\nprint(var1)',
            expect: '300\n500',
            desc: '<code>5행</code>의 <code>+=</code> 는 <b>복합 대입 연산자</b>로, <code>var1 = var1 + 200</code> 을 짧게 쓴 것입니다. <code>-=</code>, <code>*=</code>, <code>/=</code> 도 있습니다. (4장 연산자에서 자세히 배웁니다)' },
          { type: 'figure', html: FIG_SELF, caption: '그림 3-13. 연산 결과를 자신의 값에 다시 대입하는 방식' },
          { type: 'callout', kind: 'warn', title: '흔한 실수: 값을 넣기 전에 사용하기', html: '처음 만든 변수에 <code>count = count + 1</code> 을 하면, 오른쪽의 count 를 계산할 수 없어 <code>NameError: name \'count\' is not defined</code> 오류가 납니다. 먼저 <code>count = 0</code> 처럼 <b>처음 값을 넣어 두어야</b> 합니다.' },
          { type: 'code', title: '추가 예제. 값을 넣지 않은 변수 사용 (NameError)', code: 'score = 90\nscore = score + 5\nprint(scroe)', expectError: true,
            expect: "Traceback (most recent call last):\n  File \"main.py\", line 3, in <module>\n    print(scroe)\n          ^^^^^\nNameError: name 'scroe' is not defined. Did you mean: 'score'?",
            desc: '<code>3행</code>에서 변수명을 잘못 입력(오타)했습니다. 파이썬은 없는 변수로 판단하고, 비슷한 이름(<code>score</code>)을 추천해 줍니다.' },

          { type: 'h', text: '변수의 사용 (5): 데이터형이 바뀌는 변수와 대입의 방향' },
          { type: 'p', html: '파이썬의 변수는 <b>값을 넣는 순간마다 데이터형이 바뀔 수 있는</b> 유연한 구조입니다. 정수를 담았던 변수에 실수를 넣으면 그 순간부터 실수형 변수가 됩니다. 국그릇이 밥그릇으로 바뀌는 셈이지요.' },
          { type: 'code', repl: true, title: '추가 예제. 값에 따라 바뀌는 변수의 데이터형', code: 'myVar = 100\ntype(myVar)\nmyVar = 100.0\ntype(myVar)',
            expect: ">>> myVar = 100\n>>> type(myVar)\n<class 'int'>\n>>> myVar = 100.0\n>>> type(myVar)\n<class 'float'>\n>>>",
            desc: '<code>myVar = 100</code> 으로 정수형 변수(국그릇)가 만들어졌다가, <code>myVar = 100.0</code> 을 넣는 순간 실수형 변수(밥그릇)로 바뀝니다.' },
          { type: 'p', html: '대입 연산자의 <b>왼쪽에는 반드시 변수(그릇)만</b> 올 수 있습니다. 오른쪽에는 값, 변수, 계산식, 함수 호출 등 <b>무엇이든</b> 올 수 있습니다. <code>10 = 100</code> 은 “숫자 10 에 100 을 넣어라”는 뜻이 되는데, 10 은 담을 그릇이 아니므로 오류입니다.' },
          { type: 'figure', html: FIG_PLATE, caption: '그림 3-14 · 3-15. 왼쪽에 값을 넣을 그릇이 없으면 대입할 수 없다' },
          { type: 'code', repl: true, title: '추가 예제. 대입 연산자 왼쪽에 값이 오면', code: '10 = 100\nvar = 100\nvar',
            expect: '>>> 10 = 100\n  File "<stdin>", line 1\n    10 = 100\n    ^^\nSyntaxError: cannot assign to literal here. Maybe you meant \'==\' instead of \'=\'?\n>>> var = 100\n>>> var\n100\n>>>',
            desc: '파이썬은 “값(literal)에는 대입할 수 없다. 혹시 같은지 비교하는 <code>==</code> 를 쓰려던 것 아니냐”고 알려 줍니다. <code>==</code> 는 4장에서 배웁니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 변수는 값에 붙인 이름표', html: '<p>이 강좌는 이해하기 쉽도록 변수를 “그릇”으로 설명하지만, 파이썬 내부에서는 값(객체)이 메모리 어딘가에 만들어지고 변수는 그 값에 <b>붙은 이름표</b>처럼 동작합니다. <code>var1 = var2</code> 는 같은 값에 이름표를 하나 더 붙이는 것이고, 이후 <code>var2 = 300</code> 을 하면 var2 이름표만 새 값으로 옮겨 가므로 var1 은 그대로입니다.</p><p>숫자 · 문자열처럼 <b>바꿀 수 없는 값</b>에서는 그릇 비유와 결과가 같습니다. 리스트를 배우는 8장에서 이 차이가 중요해집니다.</p>' },
          { type: 'code', title: '추가 예제. 두 변수의 값 교환하기', code: 'a = 3\nb = 7\nprint("교환 전:", a, b)\n\ntemp = a     # 빈 그릇에 a 의 값을 잠시 옮겨 둔다\na = b\nb = temp\nprint("교환 후:", a, b)\n\na, b = b, a  # 파이썬다운 방법: 한 줄로 교환\nprint("다시 교환:", a, b)',
            expect: '교환 전: 3 7\n교환 후: 7 3\n다시 교환: 3 7',
            desc: '두 컵의 음료를 바꾸려면 빈 컵(<code>temp</code>)이 하나 더 필요합니다. <code>temp</code> 없이 <code>a = b</code>, <code>b = a</code> 를 하면 두 변수 모두 7 이 되어 버립니다. 파이썬은 <code>a, b = b, a</code> 로 한 번에 바꿀 수도 있습니다.' }
        ],
        practice: [
          { title: '실습 3-5. 변수 값 추적하기', level: 1,
            desc: '<p>다음 코드를 실행하기 <b>전에</b> 각 print() 의 결과를 종이에 예측해 보고, 실행해서 확인하세요. 그리고 마지막에 <code>total</code> 에 <code>a + b + c</code> 를 넣어 출력하는 코드를 추가하세요.</p>',
            hint: '각 줄이 실행된 뒤 a, b, c 의 값을 표로 적어 가며 따라가 보세요. 대입은 오른쪽을 먼저 계산합니다.',
            starter: 'a = 10\nb = a + 5\na = a * 2\nc = a + b\nprint(a, b, c)\nb = b + c\nprint(a, b, c)\n# TODO: total 에 a + b + c 를 넣고 출력\n',
            solution: 'a = 10\nb = a + 5\na = a * 2\nc = a + b\nprint(a, b, c)\nb = b + c\nprint(a, b, c)\ntotal = a + b + c\nprint(total)\n',
            expect: '20 15 35\n20 50 35\n105' },
          { title: '실습 3-6. 컵 바꾸기 (값 교환)', level: 2,
            desc: '<p>변수 <code>cup1 = "우유"</code>, <code>cup2 = "주스"</code> 가 있습니다. 빈 컵 변수 <code>temp</code> 를 사용해 두 컵의 내용을 바꾼 뒤 출력하세요.</p><pre>cup1 : 주스\ncup2 : 우유</pre>',
            hint: '① temp ← cup1, ② cup1 ← cup2, ③ cup2 ← temp',
            starter: 'cup1 = "우유"\ncup2 = "주스"\n# TODO: temp 를 이용해 값 교환\n\nprint("cup1 :", cup1)\nprint("cup2 :", cup2)\n',
            solution: 'cup1 = "우유"\ncup2 = "주스"\ntemp = cup1\ncup1 = cup2\ncup2 = temp\n\nprint("cup1 :", cup1)\nprint("cup2 :", cup2)\n',
            expect: 'cup1 : 주스\ncup2 : 우유' }
        ],
        quiz: [
          { q: '변수명으로 사용할 수 <b>없는</b> 것은?', options: ['_count', 'myVar2', '2ndVar', 'my_var'], answer: 2,
            explain: '변수명은 숫자로 시작할 수 없습니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>x = 5\nx = x + 3\nx = x * 2\nprint(x)</code></pre>', options: ['5', '8', '13', '16'], answer: 3,
            explain: 'x 는 5 → 8 → 16 으로 바뀝니다. 새 값을 대입하면 이전 값은 사라집니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>a = 100\nb = a\na = 200\nprint(b)</code></pre>', options: ['100', '200', '300', '오류'], answer: 0,
            explain: '<code>b = a</code> 는 그 순간 a 의 값(100)을 b 에 복사합니다. 이후 a 가 바뀌어도 b 는 100 입니다.' },
          { q: '<code>myVar = 100.0</code> 을 실행한 뒤 <code>type(myVar)</code> 의 결과는?', options: ['&lt;class \'int\'&gt;', '&lt;class \'float\'&gt;', '&lt;class \'str\'&gt;', '&lt;class \'bool\'&gt;'], answer: 1,
            explain: '소수점이 있는 100.0 은 실수(float)입니다.' },
          { q: '다음 중 오류가 발생하는 것은?', options: ['var = 10', 'var = var2 = 10', '10 = var', 'var = 10 + 20'], answer: 2,
            explain: '대입 연산자의 왼쪽에는 변수만 올 수 있습니다. 10 은 값이지 그릇이 아닙니다.' }
        ],
        slides: [
          { layout: 'title', title: '변수의 선언과 사용', subtitle: 'Chapter 03 · Section 03', badge: '3교시',
            notes: '<p><b>발문</b>: “게임 점수는 계속 바뀌는데, 컴퓨터는 그 점수를 어디에 기억해 둘까요?”</p><p>오늘은 값을 기억하는 그릇, 변수를 배웁니다.</p><p>시간: 2분</p>' },
          { layout: 'bullets', title: '변수 = 값을 담는 그릇', lead: '변수는 값을 저장하는 메모리 공간(그릇)',
            bullets: ['변수 선언 = 그릇을 준비하는 것', ['파이썬은 값을 넣는 순간 자동으로 생성', 'C/C++ · 자바는 반드시 먼저 선언'], '그래도 긴 코드는 쓸 변수를 미리 준비하면 좋다', '가장 많이 쓰는 4종류: 불형 · 정수형 · 실수형 · 문자열'],
            notes: '<p>실제 그릇(컵, 머그잔 등) 사진이나 실물을 보여 주면 효과적입니다. 그릇의 “이름표” = 변수명.</p><p>시간: 3분</p>' },
          { layout: 'diagram', title: '변수의 종류', html: FIG_CUPS, caption: '그림 3-7. boolVar = True · intVar = 0 · floatVar = 0.0 · strVar = ""',
            notes: '<p>네 변수를 준비하는 코드와 연결합니다. TIP: <code>boolVar, intVar, floatVar, strVar = True, 0, 0.0, ""</code> 한 줄로도 가능.</p><p>시간: 3분</p>' },
          { layout: 'code', repl: true, title: 'type() 으로 데이터형 확인', code: 'boolVar, intVar, floatVar, strVar = True, 0, 0.0, ""\ntype(boolVar), type(intVar), type(floatVar), type(strVar)',
            points: ['bool = 불형 (True/False)', 'int = 정수, float = 실수', 'str = 문자열', '셸은 print() 없이도 값 표시'],
            notes: '<p>셸에서 직접 실행합니다. 스크립트에서는 <code>print(type(intVar))</code> 처럼 print() 로 감싸야 보인다는 차이도 짚습니다.</p><p>시간: 4분</p>' },
          { layout: 'table', title: '변수명 규칙: 가능할까?', head: ['변수명', '판정'], rows: [
            ['myVar / MyVar', '✅ 서로 다른 변수 (대소문자 구분)'], ['var2 · _var · var_2', '✅ 문자 · 숫자 · 언더바'], ['2Var', '❌ 숫자로 시작'], ['my var · my-var', '❌ 공백 · 특수 문자'], ['for · if · True', '❌ 예약어']],
            lead: '대소문자 구분 · 숫자로 시작 ✘ · 예약어 ✘',
            notes: '<p>판정 열을 가리고 학생에게 O/X 를 외치게 합니다.</p><p>강의자료의 예약어 목록 중 “gloval” 은 <b>global</b> 의 오타입니다. <code>import keyword; print(keyword.kwlist)</code> 로 전체(35개)를 보여 줄 수 있습니다.</p><p>시간: 4분</p>' },
          { layout: 'diagram', title: '변수의 사용 (1): 새 값 대입', html: FIG_REASSIGN, caption: '그림 3-8. 기존 값은 사라지고 새 값으로',
            notes: '<p><code>=</code> 는 “같다”가 아니라 “넣어라(대입)”라는 점을 가장 먼저 강조합니다.</p><p><b>발문</b>: “컵에 물이 있는데 주스를 부으면?” — 물을 버리고 주스만.</p><p>시간: 3분</p>' },
          { layout: 'diagram', title: '변수의 사용 (1)~(2): 변수 · 계산 결과 대입', html: FIG_ASSIGN3, caption: '오른쪽을 먼저 계산 → 결과를 왼쪽에',
            notes: '<p><code>var1 = var2</code> 는 var2 의 값만 “복사”된다는 점. 이후 var2 를 바꿔도 var1 은 그대로입니다(퀴즈로 확인).</p><p>시간: 4분</p>' },
          { layout: 'diagram', title: '변수의 사용 (3): 연속 대입', html: FIG_CHAIN, caption: '그림 3-12. var1 = var2 = var3 = var4 = 100',
            notes: '<p>오른쪽에서 왼쪽으로 전달되는 순서(➊→➍)를 따라갑니다. 네 줄로 풀어 쓴 코드와 같다는 점을 보여 줍니다.</p><p>시간: 2분</p>' },
          { layout: 'diagram', title: '변수의 사용 (4): 자신에게 다시 대입', html: FIG_SELF, caption: '그림 3-13. var1 = var1 + 200',
            notes: '<p>수학식이 아님을 강조. ① 현재 값으로 계산 ② 결과를 자기 자신에게.</p><p>보충: <code>var1 += 200</code> 과 같다. 값을 넣지 않은 변수에 하면 NameError.</p><p>시간: 3분</p>' },
          { layout: 'code', repl: true, title: '변수의 사용 (5): 유연한 데이터형', code: 'myVar = 100\ntype(myVar)\nmyVar = 100.0\ntype(myVar)\n10 = 100',
            points: ['값을 넣는 순간 데이터형 결정', '정수 → 실수 변수로 바뀜 (국그릇 → 밥그릇)', '왼쪽에는 변수만! 10 = 100 은 오류'],
            notes: '<p>마지막 줄의 SyntaxError 메시지 “Maybe you meant \'==\'” 를 함께 읽습니다. 피자를 담을 접시가 없으면 대입할 수 없다는 그림 3-14/3-15 비유를 사용하세요.</p><p>시간: 4분</p>' },
          { layout: 'code', title: '보충: 두 변수의 값 교환', code: 'a = 3\nb = 7\ntemp = a\na = b\nb = temp\nprint(a, b)\n\na, b = b, a\nprint(a, b)',
            points: ['빈 컵(temp)이 하나 더 필요', 'temp 없이 a = b; b = a → 둘 다 7', '파이썬: a, b = b, a'],
            notes: '<p><b>발문</b>: “temp 없이 바꾸면 어떻게 될까요?” 예측 → 실행.</p><p>시간: 4분</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '실행 결과는?<pre><code>a = 100\nb = a\na = 200\nprint(b)</code></pre>', options: ['100', '200', '300', '오류'], answer: 0,
            explain: 'b = a 는 그 순간의 값(100)을 복사',
            notes: '<p>200 을 고른 학생에게는 “b 에는 a 라는 이름이 아니라 100 이라는 값이 들어갔다”고 설명합니다.</p><p>시간: 2분</p>' },
          { layout: 'practice', title: '실습 3-5. 변수 값 추적하기', desc: '실행 전에 각 print() 결과를 예측하고, total = a + b + c 를 추가해 출력하세요.',
            starter: 'a = 10\nb = a + 5\na = a * 2\nc = a + b\nprint(a, b, c)\nb = b + c\nprint(a, b, c)\n# TODO: total 에 a + b + c 를 넣고 출력\n',
            solution: 'a = 10\nb = a + 5\na = a * 2\nc = a + b\nprint(a, b, c)\nb = b + c\nprint(a, b, c)\ntotal = a + b + c\nprint(total)\n',
            notes: '<p>칠판에 a, b, c 열의 표를 그려 한 줄씩 값을 채워 가며 함께 추적합니다.</p><p>시간: 6분</p>' },
          { layout: 'summary', title: '정리', bullets: ['변수 = 값을 담는 이름 붙은 그릇 (파이썬은 선언 없이 대입으로 생성)', 'type() 으로 bool · int · float · str 확인', '규칙: 대소문자 구분, 숫자 시작 ✘, 예약어 ✘', '= 는 대입: 오른쪽 계산 → 왼쪽 변수에', '연속 대입, 자기 자신에게 다시 대입, 데이터형은 바뀔 수 있다'],
            notes: '<p>다음 시간: 컴퓨터가 값을 표현하는 방법 — 비트 · 바이트와 진수.</p><p>시간: 2분</p>' }
        ]
      },

      /* ───────────────────────── 4교시: 비트 · 바이트 · 진수 ───────────────────────── */
      {
        id: 'ch03-4',
        title: '데이터 표현 단위와 진수 변환',
        minutes: 50,
        goals: [
          '비트와 바이트의 관계를 설명하고, n 비트로 표현할 수 있는 가짓수(2ⁿ)를 계산할 수 있다',
          '2진수 ↔ 10진수 ↔ 16진수를 손으로 변환할 수 있다',
          'bin() · oct() · hex() · int(값, 진수) 로 진수를 변환할 수 있다',
          '[프로그램 2] 진수 변환 프로그램을 완성할 수 있다'
        ],
        flow: [['비트와 바이트', 10], ['진수 변환 원리', 15], ['파이썬 진수 함수', 8], ['[프로그램 2] · SELF STUDY 3-2', 12], ['퀴즈', 5]],
        content: [
          { type: 'h', text: '비트와 바이트' },
          { type: 'p', html: '컴퓨터는 전기가 흐르는지(1) 흐르지 않는지(0) 두 가지 상태만 구별합니다. 이 0 또는 1 하나를 저장하는 가장 작은 단위를 <b>비트(bit)</b>라고 합니다. 비트 <b>8개</b>를 묶은 단위는 <b>바이트(byte)</b>입니다.' },
          { type: 'p', html: '비트 1개로는 두 가지(0, 1)밖에 표현하지 못하지만, 비트를 여러 개 모으면 표현할 수 있는 경우가 늘어납니다. 전기 스위치 2개가 있다면 “꺼짐 · 꺼짐”, “꺼짐 · 켜짐”, “켜짐 · 꺼짐”, “켜짐 · 켜짐” 네 가지를 만들 수 있습니다. 이것을 0과 1로 적으면 2진수 00, 01, 10, 11 이고, 10진수로는 0, 1, 2, 3 입니다.' },
          { type: 'figure', html: FIG_BULBS, caption: '그림 3-16. 전기 스위치 2개와 2진수, 10진수의 비교' },
          { type: 'callout', kind: 'tip', title: 'n 개의 스위치(비트)로 표현할 수 있는 가짓수 = 2ⁿ', html: '스위치가 하나 늘 때마다 경우의 수가 두 배가 됩니다. 1비트 → 2가지, 2비트 → 4가지, 4비트 → 16가지, 8비트(1바이트) → 256가지.' },
          { type: 'code', title: '추가 예제. 비트 수에 따른 가짓수 계산', code: 'print("1비트 :", 2 ** 1)\nprint("2비트 :", 2 ** 2)\nprint("4비트 :", 2 ** 4)\nprint("8비트(1바이트) :", 2 ** 8)\nprint("16비트(2바이트) :", 2 ** 16)\nprint("32비트(4바이트) :", 2 ** 32)\nprint("64비트(8바이트) :", 2 ** 64)',
            expect: '1비트 : 2\n2비트 : 4\n4비트 : 16\n8비트(1바이트) : 256\n16비트(2바이트) : 65536\n32비트(4바이트) : 4294967296\n64비트(8바이트) : 18446744073709551616',
            desc: '<code>**</code> 는 거듭제곱 연산자입니다(5교시). 32비트는 약 42억, 64비트는 약 1800경 가지를 표현할 수 있습니다.' },
          { type: 'table', head: ['10진수(0~9)', '2진수(0~1)', '16진수(0~F)'], rows: HEX_TABLE_ROWS, caption: '표 3-3. 10진수, 2진수, 16진수 변환표' },
          { type: 'p', html: '10진수는 0~9 의 10개 숫자를 쓰고, 2진수는 0과 1만 씁니다. <b>16진수</b>는 한 자리에 16가지가 필요하므로 0~9 다음에 <b>A(10), B(11), C(12), D(13), E(14), F(15)</b> 를 씁니다. 표를 보면 <b>2진수 4자리가 16진수 1자리</b>와 정확히 대응한다는 것을 알 수 있습니다.' },
          { type: 'table', head: ['비트 수', '바이트 수', '표현 개수', '2진수', '10진수', '16진수'], rows: [
            ['1', '', '2¹ = 2', '0~1', '0~1', '0~1'],
            ['2', '', '2² = 4', '0~11', '0~3', '0~3'],
            ['4', '', '2⁴ = 16', '0~1111', '0~15', '0~F'],
            ['8', '1', '2⁸ = 256', '0~11111111', '0~255', '0~FF'],
            ['16', '2', '2¹⁶ = 65536', '0~11111111 11111111', '0~65535', '0~FFFF'],
            ['32', '4', '2³² = 약 42억', '0~…', '0~약 42억', '0~FFFF FFFF'],
            ['64', '8', '2⁶⁴ = 약 1800경', '0~……', '0~약 1800경', '0~……']
          ], caption: '표 3-4. 비트와 바이트 크기에 따른 숫자의 범위' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 왜 16진수를 쓸까?', html: '2진수는 금방 길어져 읽기 어렵습니다(255 = 11111111). 16진수는 2진수 4자리를 한 글자로 줄여 주므로 1바이트를 딱 두 글자(FF)로 쓸 수 있습니다. 그래서 웹 색상(<code>#FF8800</code>), 메모리 주소, 파일 내용 등을 16진수로 표시합니다. 색상 <code>#FF8800</code> 은 빨강 FF(255), 초록 88(136), 파랑 00(0) 입니다.' },

          { type: 'h', text: '진수 변환 (1): 2진수 → 10진수' },
          { type: 'p', html: '10진수 <code>147</code> 이 1×100 + 4×10 + 7×1 이듯, 2진수의 각 자리는 오른쪽부터 <b>1, 2, 4, 8, 16, 32, 64, 128</b>(2⁰, 2¹, 2², …)의 무게를 가집니다. <b>1인 자리의 무게를 모두 더하면</b> 10진수가 됩니다.' },
          { type: 'figure', html: FIG_BIN2DEC, caption: '그림 3-17. 2진수 10010011 을 10진수로 변환하는 방법' },
          { type: 'p', html: '또 다른 방법으로, 2진수를 <b>4자리씩 끊어 16진수로 먼저 바꾼 뒤</b> 10진수로 바꿀 수도 있습니다. 1001 → 9, 0011 → 3 이므로 16진수 93 이고, 9×16 + 3×1 = 147 입니다.' },
          { type: 'figure', html: FIG_BIN2HEX, caption: '그림 3-18. 2진수를 16진수로 변환한 후 10진수로 변환하는 방법' },

          { type: 'h', text: '진수 변환 (2): 10진수 → 2진수' },
          { type: 'p', html: '10진수를 2진수로 바꿀 때는 <b>2로 계속 나누면서 나머지를 적고</b>, 더 이상 나눌 수 없으면 <b>마지막 몫부터 나머지를 거꾸로(아래에서 위로)</b> 읽습니다.' },
          { type: 'figure', html: FIG_DEC2BIN, caption: '그림 3-19. 10진수 13 을 2진수로 변환하는 방법' },
          { type: 'p', html: '16진수도 같은 방법으로 바꿀 수 있습니다. 16진수 13₁₆ 은 10진수로 1×16 + 3 = 19 이므로, 19 를 2로 계속 나누면 나머지가 1, 1, 0, 0 이고 마지막 몫이 1 → <b>10011₂</b> 입니다.' },
          { type: 'table', head: ['나누는 수', '몫', '나머지'], rows: [['19 ÷ 2', '9', '<b>1</b>'], ['9 ÷ 2', '4', '<b>1</b>'], ['4 ÷ 2', '2', '<b>0</b>'], ['2 ÷ 2', '<b>1</b> (마지막 몫)', '<b>0</b>']], caption: '그림 3-20. 16진수 13(= 10진수 19)을 2진수로 변환 → 아래에서 위로 읽어 10011₂' },

          { type: 'h', text: '진수 변환 (3): 16진수 ↔ 2진수는 4자리씩' },
          { type: 'p', html: '16진수 한 자리는 2진수 네 자리와 짝이므로, <b>표 3-5 만 알면 10진수를 거치지 않고</b> 바로 바꿀 수 있습니다. 16진수의 각 자리를 4자리 2진수로 바꿔 이어 붙이면 됩니다. 반대로 2진수를 16진수로 바꿀 때는 오른쪽부터 4자리씩 끊습니다.' },
          { type: 'table', head: ['16진수', '2진수', '16진수', '2진수'], rows: HEX_TABLE_ROWS2, caption: '표 3-5. 16진수, 2진수 변환표' },
          { type: 'figure', html: FIG_HEXBIN, caption: '그림 3-21 · 3-22. 16진수를 2진수로 변환하는 예 (13₁₆, C5F7₁₆)' },
          { type: 'callout', kind: 'tip', title: 'TIP', html: '16진수 C5F7₁₆ 을 10진수로 바꾸면 50679 이지만, 2진수로 바꿀 때는 굳이 10진수를 계산할 필요가 없습니다. 4자리씩 바로 바꾸는 편이 훨씬 빠릅니다.' },

          { type: 'h', text: '파이썬으로 진수 변환하기' },
          { type: 'p', html: '파이썬에서는 숫자 앞에 <b>접두어</b>를 붙여 진수를 나타냅니다: 2진수 <code>0b</code>(binary), 8진수 <code>0o</code>(octal), 16진수 <code>0x</code>(hexadecimal). 그리고 <code>bin()</code>, <code>oct()</code>, <code>hex()</code> 함수는 숫자를 각각 2 · 8 · 16진수 <b>문자열</b>로 바꿔 줍니다.' },
          { type: 'code', repl: true, title: '추가 예제. bin() · oct() · hex() 함수', code: 'bin(11); bin(0o11); bin(0x11)\noct(11); oct(0b11); oct(0x11)\nhex(11); hex(0b11); hex(0o11)',
            expect: ">>> bin(11); bin(0o11); bin(0x11)\n'0b1011'\n'0b1001'\n'0b10001'\n>>> oct(11); oct(0b11); oct(0x11)\n'0o13'\n'0o3'\n'0o21'\n>>> hex(11); hex(0b11); hex(0o11)\n'0xb'\n'0x3'\n'0x9'\n>>>",
            desc: '<code>;</code>(세미콜론)은 한 줄에 여러 문장을 쓸 때 문장을 구분합니다. <code>0o11</code> 은 8진수 11(= 10진수 9), <code>0x11</code> 은 16진수 11(= 10진수 17)입니다. 결과가 <code>\'0b1011\'</code> 처럼 따옴표로 둘러싸인 것은 결과가 <b>문자열</b>이라는 뜻입니다.' },
          { type: 'p', html: '반대로 진수를 나타내는 <b>문자열을 10진수 정수로</b> 바꿀 때는 <code>int(문자열, 진수)</code> 를 씁니다. 사용자가 키보드로 입력한 값은 문자열이므로, [프로그램 2]에서 이 방법을 사용합니다.' },
          { type: 'code', repl: true, title: '추가 예제. int(문자열, 진수)로 10진수 만들기', code: 'int("FF", 16)\nint("377", 8)\nint("11111111", 2)\nint("255", 10)\nint("0xff", 16)',
            expect: ">>> int(\"FF\", 16)\n255\n>>> int(\"377\", 8)\n255\n>>> int(\"11111111\", 2)\n255\n>>> int(\"255\", 10)\n255\n>>> int(\"0xff\", 16)\n255\n>>>",
            desc: '16진수 FF, 8진수 377, 2진수 11111111 은 모두 10진수 255 입니다. 16진수는 대 · 소문자를 가리지 않고, 접두어(0x)가 붙어 있어도 됩니다.' },

          { type: 'h', text: '[프로그램 2]의 완성: 진수 변환' },
          { type: 'p', html: '사용자에게 먼저 <b>어떤 진수로 입력할지</b>(16/10/8/2)를 묻고, 그 진수의 <b>값</b>을 입력받습니다. 입력값을 <code>int(값, 진수)</code> 로 10진수 정수 <code>num10</code> 으로 바꾼 뒤, <code>hex()</code>, <code>oct()</code>, <code>bin()</code> 으로 각 진수를 출력합니다. <code>if</code> 문은 5장에서 배우지만, “조건이 맞으면 들여쓴 줄을 실행한다”는 정도로 이해하면 충분합니다.' },
          { type: 'code', title: '[프로그램 2] 완성: Code03-04. 진수 변환', code: 'sel = int(input("입력 진수 결정(16/10/8/2) : "))\nnum = input("값 입력 : ")\n\nif sel == 16 :\n    num10 = int(num, 16)\nif sel == 10 :\n    num10 = int(num, 10)\nif sel == 8 :\n    num10 = int(num, 8)\nif sel == 2 :\n    num10 = int(num, 2)\n\nprint("16진수 ==> ", hex(num10))\nprint("10진수 ==> ", num10)\nprint(" 8진수 ==> ", oct(num10))\nprint(" 2진수 ==> ", bin(num10))',
            stdin: '16\nFF\n',
            expect: '입력 진수 결정(16/10/8/2) : 16\n값 입력 : FF\n16진수 ==>  0xff\n10진수 ==>  255\n 8진수 ==>  0o377\n 2진수 ==>  0b11111111',
            desc: '<code>1행</code> 입력한 진수는 숫자로 비교해야 하므로 <code>int()</code> 로 바꿉니다. <code>2행</code> 값은 FF 처럼 글자가 섞일 수 있으므로 문자열 그대로 둡니다. <code>4~11행</code> 선택한 진수에 맞춰 10진수로 변환. <code>13~16행</code> 각 진수로 출력합니다. print() 에 쉼표로 값을 이어 쓰면 사이에 빈칸이 하나 들어가서 <code>==&gt;</code> 뒤가 두 칸이 됩니다.' },
          { type: 'code', title: '추가 예제. [프로그램 2]를 2진수 입력으로 실행', code: 'sel = int(input("입력 진수 결정(16/10/8/2) : "))\nnum = input("값 입력 : ")\n\nif sel == 16 :\n    num10 = int(num, 16)\nif sel == 10 :\n    num10 = int(num, 10)\nif sel == 8 :\n    num10 = int(num, 8)\nif sel == 2 :\n    num10 = int(num, 2)\n\nprint("16진수 ==> ", hex(num10))\nprint("10진수 ==> ", num10)\nprint(" 8진수 ==> ", oct(num10))\nprint(" 2진수 ==> ", bin(num10))',
            stdin: '2\n10010011\n',
            expect: '입력 진수 결정(16/10/8/2) : 2\n값 입력 : 10010011\n16진수 ==>  0x93\n10진수 ==>  147\n 8진수 ==>  0o223\n 2진수 ==>  0b10010011',
            desc: '그림 3-17 · 3-18 에서 손으로 계산한 10010011₂ = 93₁₆ = 147 을 프로그램으로 확인했습니다.' },
          { type: 'callout', kind: 'warn', title: '진수에 맞지 않는 값을 입력하면?', html: '2진수를 골랐는데 <code>123</code> 을 입력하면 2진수에는 2, 3 이 없으므로 <code>ValueError: invalid literal for int() with base 2: \'123\'</code> 오류가 납니다. 또 16/10/8/2 가 아닌 숫자(예: 5)를 고르면 어떤 if 문도 실행되지 않아 <code>num10</code> 이 만들어지지 않으므로 <code>NameError</code> 가 납니다. 이 문제를 해결하는 것이 SELF STUDY 3-2 입니다.' },
          { type: 'code', title: '추가 예제. 진수에 맞지 않는 값 (ValueError)', code: 'num10 = int("123", 2)\nprint(num10)', expectError: true,
            expect: "Traceback (most recent call last):\n  File \"main.py\", line 1, in <module>\n    num10 = int(\"123\", 2)\nValueError: invalid literal for int() with base 2: '123'" },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 접두어 없이, 자릿수 맞춰 출력하기', html: '<code>format(값, "b")</code> · <code>"o"</code> · <code>"x"</code> · <code>"X"</code> 를 쓰면 접두어(0b, 0o, 0x) 없이 변환됩니다. <code>"08b"</code> 처럼 폭과 0 채우기를 함께 쓰면 1바이트(8비트) 모양으로 맞출 수 있습니다. f-문자열에서도 <code>f"{num:08b}"</code> 처럼 쓸 수 있습니다.' },
          { type: 'code', title: '추가 예제. format() 함수로 진수 변환', code: 'num = 147\nprint(format(num, "b"), format(num, "o"), format(num, "x"), format(num, "X"))\nprint(format(13, "08b"))\nprint(f"{num:#x} {num:08b}")',
            expect: '10010011 223 93 93\n00001101\n0x93 10010011' }
        ],
        practice: [
          { title: 'SELF STUDY 3-2. 잘못된 진수 선택 처리', level: 2,
            desc: '<p>Code03-04 는 16, 10, 8, 2 이외의 숫자를 입력하면 오류가 발생합니다. 16, 10, 8, 2 외의 숫자를 입력하면 <b>“16, 10, 8, 2 숫자 중 하나만 입력하세요.”</b> 라는 메시지를 출력하고 프로그램을 종료하도록 if 문을 추가해 보세요.</p><pre>입력 진수 결정(16/10/8/2) : 5\n16, 10, 8, 2 숫자 중 하나만 입력하세요.</pre>',
            hint: '힌트1: 같지 않다는 <code>!=</code> 로 비교합니다. 힌트2: 여러 조건이 동시에 참이어야 하는 관계 연산자는 <code>and</code> 를 사용합니다. 프로그램 종료는 <code>import sys</code> 후 <code>sys.exit()</code> 를 씁니다.',
            starter: 'import sys\n\nsel = int(input("입력 진수 결정(16/10/8/2) : "))\n# TODO: sel 이 16, 10, 8, 2 가 모두 아니면 메시지 출력 후 sys.exit()\n\nnum = input("값 입력 : ")\n\nif sel == 16 :\n    num10 = int(num, 16)\nif sel == 10 :\n    num10 = int(num, 10)\nif sel == 8 :\n    num10 = int(num, 8)\nif sel == 2 :\n    num10 = int(num, 2)\n\nprint("16진수 ==> ", hex(num10))\nprint("10진수 ==> ", num10)\nprint(" 8진수 ==> ", oct(num10))\nprint(" 2진수 ==> ", bin(num10))\n',
            solution: 'import sys\n\nsel = int(input("입력 진수 결정(16/10/8/2) : "))\nif sel != 16 and sel != 10 and sel != 8 and sel != 2 :\n    print("16, 10, 8, 2 숫자 중 하나만 입력하세요.")\n    sys.exit()\n\nnum = input("값 입력 : ")\n\nif sel == 16 :\n    num10 = int(num, 16)\nif sel == 10 :\n    num10 = int(num, 10)\nif sel == 8 :\n    num10 = int(num, 8)\nif sel == 2 :\n    num10 = int(num, 2)\n\nprint("16진수 ==> ", hex(num10))\nprint("10진수 ==> ", num10)\nprint(" 8진수 ==> ", oct(num10))\nprint(" 2진수 ==> ", bin(num10))\n',
            stdin: '5\n',
            expect: '입력 진수 결정(16/10/8/2) : 5\n16, 10, 8, 2 숫자 중 하나만 입력하세요.' },
          { title: '실습 3-7. 10진수를 여러 진수로', level: 1,
            desc: '<p>10진수 정수 하나를 입력받아 2진수, 8진수, 16진수로 출력하세요.</p><pre>10진수 입력 : 200\n2진수 : 0b11001000\n8진수 : 0o310\n16진수 : 0xc8</pre>',
            hint: '<code>int(input(…))</code> 로 정수를 받은 뒤 <code>bin()</code>, <code>oct()</code>, <code>hex()</code> 를 사용합니다.',
            starter: 'num = int(input("10진수 입력 : "))\n# TODO: 2진수, 8진수, 16진수 출력\n',
            solution: 'num = int(input("10진수 입력 : "))\nprint("2진수 :", bin(num))\nprint("8진수 :", oct(num))\nprint("16진수 :", hex(num))\n',
            stdin: '200\n',
            expect: '10진수 입력 : 200\n2진수 : 0b11001000\n8진수 : 0o310\n16진수 : 0xc8' },
          { title: '실습 3-8. 웹 색상 코드 해석하기', level: 3,
            desc: '<p>웹 색상 <code>#FF8800</code> 은 두 글자씩 빨강(FF) · 초록(88) · 파랑(00) 의 밝기를 16진수로 나타냅니다. 세 값을 10진수로 바꿔 출력하세요.</p><pre>빨강 : 255\n초록 : 136\n파랑 : 0</pre>',
            hint: '<code>int("FF", 16)</code>',
            starter: 'red = "FF"\ngreen = "88"\nblue = "00"\n# TODO: 각각 10진수로 바꿔 출력\n',
            solution: 'red = "FF"\ngreen = "88"\nblue = "00"\nprint("빨강 :", int(red, 16))\nprint("초록 :", int(green, 16))\nprint("파랑 :", int(blue, 16))\n',
            expect: '빨강 : 255\n초록 : 136\n파랑 : 0' }
        ],
        quiz: [
          { q: '8비트(1바이트)로 표현할 수 있는 서로 다른 값은 몇 가지인가?', options: ['8', '16', '255', '256'], answer: 3,
            explain: '2⁸ = 256 가지(0~255)입니다. 255 는 가장 큰 값이고, 가짓수는 0 을 포함해 256 입니다.' },
          { q: '2진수 <code>1011</code> 을 10진수로 바꾸면?', options: ['9', '11', '13', '1011'], answer: 1,
            explain: '8 + 0 + 2 + 1 = 11' },
          { q: '10진수 <code>10</code> 을 16진수로 바꾸면?', options: ['10', 'A', 'F', '1010'], answer: 1,
            explain: '16진수는 10 을 A 로 씁니다. (1010 은 2진수)' },
          { q: '다음 코드의 실행 결과는?<pre><code>print(int("1F", 16))</code></pre>', options: ['1F', '31', '0x1f', '116'], answer: 1,
            explain: '1×16 + 15 = 31' },
          { q: '<code>print(hex(255))</code> 의 출력은?', options: ['FF', '0xff', '0o377', '0b11111111'], answer: 1,
            explain: 'hex() 는 0x 접두어가 붙은 소문자 16진수 문자열을 돌려줍니다.' }
        ],
        slides: [
          { layout: 'title', title: '데이터 표현 단위와 진수 변환', subtitle: 'Chapter 03 · Section 04', badge: '4교시',
            notes: '<p><b>발문</b>: “컴퓨터는 0 과 1 만 안다는데, 어떻게 255 같은 큰 수를 기억할까요?”</p><p>시간: 1분</p>' },
          { layout: 'diagram', title: '비트: 0 과 1', html: FIG_BULBS, caption: '그림 3-16. 스위치 2개 → 4가지 (00 · 01 · 10 · 11)',
            notes: '<p>비트 = 가장 작은 단위, 바이트 = 비트 8개. 교실 전등 스위치 2개로 시연하면 좋습니다.</p><p><b>발문</b>: “스위치가 3개면 몇 가지?” → 8가지 (2³).</p><p>시간: 5분</p>' },
          { layout: 'table', title: '표 3-4. 비트 수와 표현 범위', head: ['비트', '바이트', '가짓수', '10진수', '16진수'], rows: [
            ['1', '', '2', '0~1', '0~1'], ['4', '', '16', '0~15', '0~F'], ['8', '1', '256', '0~255', '0~FF'], ['16', '2', '65536', '0~65535', '0~FFFF'], ['32', '4', '약 42억', '0~약 42억', '0~FFFF FFFF'], ['64', '8', '약 1800경', '0~약 1800경', '…']],
            lead: 'n 비트 → 2ⁿ 가지',
            notes: '<p>표 3-3(0~15 변환표)은 학생 문서에 있으니 함께 보게 합니다. 16진수 한 자리 = 4비트, 두 자리 = 1바이트라는 점에 주목.</p><p>시간: 3분</p>' },
          { layout: 'diagram', title: '2진수 → 10진수', html: FIG_BIN2DEC, caption: '그림 3-17. 1 인 자리의 무게(2의 거듭제곱)를 더한다',
            notes: '<p>10진수 147 = 1×100 + 4×10 + 7×1 과 같은 원리라고 먼저 설명한 뒤 2진수로 넘어갑니다.</p><p>시간: 4분</p>' },
          { layout: 'diagram', title: '2진수 → 16진수 → 10진수', html: FIG_BIN2HEX, caption: '그림 3-18. 4자리씩 끊어 16진수로',
            notes: '<p>1001 → 9, 0011 → 3 → 93₁₆ → 9×16 + 3 = 147. 그림 3-17과 결과가 같음을 확인합니다.</p><p>시간: 3분</p>' },
          { layout: 'diagram', title: '10진수 → 2진수', html: FIG_DEC2BIN, caption: '그림 3-19. 2로 나눈 나머지를 아래에서 위로',
            notes: '<p>칠판에서 학생과 함께 25 를 변환해 봅니다(11001). 16진수 13₁₆ 도 10진수 19 로 바꾼 뒤 같은 방법 → 10011₂ (그림 3-20).</p><p>시간: 4분</p>' },
          { layout: 'diagram', title: '16진수 ↔ 2진수: 한 자리 = 4비트', html: FIG_HEXBIN, caption: '그림 3-21 · 3-22. 10진수를 거치지 않고 바로',
            notes: '<p>표 3-5(16진수-2진수 변환표)를 보며 C → 1100, 5 → 0101, F → 1111, 7 → 0111.</p><p>시간: 3분</p>' },
          { layout: 'code', repl: true, title: '파이썬의 진수 함수', code: 'bin(11); bin(0o11); bin(0x11)\noct(11); oct(0b11); oct(0x11)\nhex(11); hex(0b11); hex(0o11)\nint("FF", 16)\nint("11111111", 2)',
            points: ['접두어: 0b 2진수 · 0o 8진수 · 0x 16진수', 'bin() · oct() · hex() → 진수 문자열', 'int("문자열", 진수) → 10진수 정수'],
            notes: '<p>결과에 따옴표가 붙은 것은 문자열이라는 뜻. int() 는 반대 방향(문자열 → 정수)이라는 점을 대비시킵니다.</p><p>시간: 4분</p>' },
          { layout: 'code', title: '[프로그램 2] 완성: Code03-04', code: 'sel = int(input("입력 진수 결정(16/10/8/2) : "))\nnum = input("값 입력 : ")\n\nif sel == 16 :\n    num10 = int(num, 16)\nif sel == 10 :\n    num10 = int(num, 10)\nif sel == 8 :\n    num10 = int(num, 8)\nif sel == 2 :\n    num10 = int(num, 2)\n\nprint("16진수 ==> ", hex(num10))\nprint("10진수 ==> ", num10)\nprint(" 8진수 ==> ", oct(num10))\nprint(" 2진수 ==> ", bin(num10))',
            stdin: '16\nFF\n',
            points: ['sel: 진수 선택 (정수로 변환)', 'num: 값은 문자열 그대로 (FF 등)', 'int(num, 진수) → 10진수 num10', 'hex · oct · bin 으로 출력'],
            notes: '<p>▶ 실행 후 콘솔에 16, FF 를 입력합니다(또는 예시 입력). 2 → 10010011 로도 실행해 147 을 확인.</p><p>if 문은 5장에서 배우므로 “조건이 맞으면 들여쓴 줄 실행” 정도로만 설명합니다.</p><p>시간: 6분</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>print(int("1F", 16))</code> 의 출력은?', options: ['1F', '31', '0x1f', '116'], answer: 1,
            explain: '1×16 + F(15) = 31',
            notes: '<p>116 을 고른 학생은 F 를 15 로 바꾼 뒤 이어 붙인 경우입니다. 자리의 무게(16)를 다시 설명합니다.</p><p>시간: 2분</p>' },
          { layout: 'practice', title: 'SELF STUDY 3-2. 잘못된 진수 선택 처리', desc: '16, 10, 8, 2 외의 숫자를 입력하면 “16, 10, 8, 2 숫자 중 하나만 입력하세요.” 를 출력하고 종료하세요. (힌트: != 와 and)',
            starter: 'import sys\n\nsel = int(input("입력 진수 결정(16/10/8/2) : "))\n# TODO: sel 이 16, 10, 8, 2 가 모두 아니면 메시지 출력 후 sys.exit()\n\nnum = input("값 입력 : ")\nif sel == 16 :\n    num10 = int(num, 16)\nif sel == 10 :\n    num10 = int(num, 10)\nif sel == 8 :\n    num10 = int(num, 8)\nif sel == 2 :\n    num10 = int(num, 2)\nprint("10진수 ==> ", num10)\n',
            solution: 'import sys\n\nsel = int(input("입력 진수 결정(16/10/8/2) : "))\nif sel != 16 and sel != 10 and sel != 8 and sel != 2 :\n    print("16, 10, 8, 2 숫자 중 하나만 입력하세요.")\n    sys.exit()\n\nnum = input("값 입력 : ")\nif sel == 16 :\n    num10 = int(num, 16)\nif sel == 10 :\n    num10 = int(num, 10)\nif sel == 8 :\n    num10 = int(num, 8)\nif sel == 2 :\n    num10 = int(num, 2)\nprint("10진수 ==> ", num10)\n',
            stdin: '5\n',
            notes: '<p>and/!= 는 다음 장 내용이므로 힌트를 적극적으로 줍니다. 강의자료(IDLE)는 <code>exit()</code> 로 종료하며 “Kill?” 창이 뜨지만, 이 강좌에서는 <code>sys.exit()</code> 로 깔끔하게 끝납니다.</p><p>시간: 8분</p>' },
          { layout: 'summary', title: '정리', bullets: ['비트(0/1) 8개 = 1바이트, n 비트 → 2ⁿ 가지', '2→10: 1 인 자리의 무게를 더한다', '10→2: 2로 나눈 나머지를 거꾸로', '16진수 1자리 = 2진수 4자리', 'bin · oct · hex, int(문자열, 진수)'],
            notes: '<p>다음 시간: 파이썬의 기본 데이터형 — 정수 · 실수 · 불 · 문자열.</p><p>시간: 2분</p>' }
        ]
      },

      /* ───────────────────────── 5교시: 기본 데이터형 ───────────────────────── */
      {
        id: 'ch03-5',
        title: '기본 데이터형',
        minutes: 50,
        goals: [
          '정수형과 실수형의 특징을 설명하고, 진수 · 지수 표기로 숫자를 쓸 수 있다',
          '+, -, *, /, **, %, // 연산의 결과를 예측할 수 있다',
          '불형이 True/False 만 저장하며 비교 결과를 담을 수 있음을 안다',
          '작은따옴표 · 큰따옴표 · 따옴표 3개와 이스케이프로 문자열을 만들 수 있다',
          'if __name__ == "__main__": 으로 이루어진 프로그램 구조를 이해한다'
        ],
        flow: [['숫자형(정수 · 실수)', 15], ['불형', 5], ['문자열', 12], ['프로그램 구조 (Code03-05)', 6], ['실습 · 퀴즈', 12]],
        content: [
          { type: 'h', text: '숫자형 (1): 정수형' },
          { type: 'p', html: '<b>정수형(int, integer)</b>은 소수점이 없는 수(…, -2, -1, 0, 1, 2, …)입니다. 파이썬의 정수는 다른 언어와 달리 <b>크기 제한이 거의 없어서</b>, 100의 100제곱처럼 엄청나게 큰 수도 정확하게 계산합니다.' },
          { type: 'code', repl: true, title: '추가 예제. 정수형 확인', code: 'a = 123\ntype(a)',
            expect: ">>> a = 123\n>>> type(a)\n<class 'int'>\n>>>" },
          { type: 'code', title: '추가 예제. 아주 큰 정수', code: 'a = 100 ** 100\nprint(a)\nprint(len(str(a)), "자리")',
            expect: '1' + '0'.repeat(200) + '\n201 자리',
            desc: '<code>**</code> 는 거듭제곱입니다. 100¹⁰⁰ 은 1 뒤에 0 이 200개 붙은 201자리 수입니다. <code>3행</code>의 <code>str()</code> 은 숫자를 문자열로, <code>len()</code> 은 글자 수를 세는 함수입니다.' },
          { type: 'p', html: '정수는 10진수 말고도 앞 시간에 배운 <b>접두어</b>를 붙여 16진수(<code>0x</code>), 8진수(<code>0o</code>), 2진수(<code>0b</code>)로 쓸 수 있습니다. 어떻게 쓰든 저장되는 값은 같은 정수이며, print() 하면 10진수로 보여 줍니다.' },
          { type: 'code', title: '추가 예제. 16진수 · 8진수 · 2진수로 정수 쓰기', code: 'a = 0xFF\nb = 0o77\nc = 0b1111\nprint(a, b, c)',
            expect: '255 63 15' },

          { type: 'h', text: '숫자형 (2): 실수형' },
          { type: 'p', html: '<b>실수형(float)</b>은 소수점이 있는 수입니다. 아주 크거나 작은 수는 <b>지수 표기</b>로 쓸 수 있는데, <code>3.14e5</code> 는 3.14 × 10⁵ = 314000.0 을 뜻합니다. (e 는 exponent, 지수)' },
          { type: 'code', title: '추가 예제. 실수형과 지수 표기', code: 'a = 3.14\nb = 3.14e5\nprint(a, b)\nprint(type(a), type(b))',
            expect: "3.14 314000.0\n<class 'float'> <class 'float'>" },

          { type: 'h', text: '숫자형 (3): 연산' },
          { type: 'p', html: '정수와 실수는 사칙 연산 <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code> 를 할 수 있습니다. 그 밖에 제곱 <code>**</code>, 나머지 <code>%</code>, 나눈 뒤 소수점 아래를 버리는 몫 <code>//</code> 연산자도 있습니다.' },
          { type: 'code', title: '추가 예제. 사칙 연산', code: 'a = 10; b = 20\nprint(a + b, a - b, a * b, a / b)',
            expect: '30 -10 200 0.5',
            desc: '<code>;</code> 로 한 줄에 두 문장을 썼습니다. <code>/</code> 는 나누어떨어지지 않으면 실수 결과(0.5)를 냅니다.' },
          { type: 'code', title: '추가 예제. 제곱 · 나머지 · 몫', code: 'a, b = 9, 2\nprint(a ** b, a % b, a // b)',
            expect: '81 1 4',
            desc: '9² = 81, 9 ÷ 2 의 나머지 1, 몫 4 입니다.' },
          { type: 'table', head: ['연산자', '의미', '예', '결과'], rows: [
            ['<code>+</code>', '더하기', '<code>10 + 20</code>', '30'],
            ['<code>-</code>', '빼기', '<code>10 - 20</code>', '-10'],
            ['<code>*</code>', '곱하기', '<code>10 * 20</code>', '200'],
            ['<code>/</code>', '나누기 (결과는 항상 실수)', '<code>10 / 20</code>, <code>10 / 5</code>', '0.5, 2.0'],
            ['<code>**</code>', '거듭제곱', '<code>9 ** 2</code>', '81'],
            ['<code>%</code>', '나머지', '<code>9 % 2</code>', '1'],
            ['<code>//</code>', '몫 (소수점 아래 버림)', '<code>9 // 2</code>', '4']
          ], caption: '숫자형의 연산자' },
          { type: 'callout', kind: 'warn', title: '/ 의 결과는 항상 실수', html: '<code>10 / 5</code> 는 나누어떨어져도 <code>2</code> 가 아니라 <code>2.0</code>(실수)입니다. 정수 결과가 필요하면 <code>//</code> 를 쓰세요. 또 <b>0으로 나누면</b> <code>ZeroDivisionError: division by zero</code> 오류가 발생합니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 실수는 아주 작은 오차가 있다', html: '<p>컴퓨터는 실수를 2진수로 저장하는데, 0.1 같은 수는 2진수로 정확히 나타낼 수 없어 아주 작은 오차가 생깁니다. 그래서 <code>0.1 + 0.2</code> 는 <code>0.30000000000000004</code> 가 됩니다. 파이썬만의 문제가 아니라 거의 모든 프로그래밍 언어가 같습니다.</p><p>출력할 때는 <code>"%.2f"</code> 나 <code>round(값, 자릿수)</code> 로 자릿수를 정리하면 됩니다.</p>' },
          { type: 'code', title: '추가 예제. 실수의 오차와 반올림', code: 'print(0.1 + 0.2)\nprint(round(0.1 + 0.2, 2))\nprint("%.2f" % (0.1 + 0.2))\nprint(10 / 5, 10 // 5, type(10 / 5))',
            expect: "0.30000000000000004\n0.3\n0.30\n2.0 2 <class 'float'>" },

          { type: 'h', text: '불형' },
          { type: 'p', html: '<b>불형(bool, Boolean)</b>은 <b>참(True)</b> 또는 <b>거짓(False)</b> 두 값만 저장합니다. 첫 글자는 반드시 대문자로 씁니다(<code>true</code> 는 오류). 불형은 “100 과 100 이 같은가?”, “10 이 100 보다 큰가?” 같은 <b>비교의 결과</b>를 저장하는 데 많이 쓰입니다.' },
          { type: 'code', repl: true, title: '추가 예제. 불형 확인', code: 'a = True\ntype(a)',
            expect: ">>> a = True\n>>> type(a)\n<class 'bool'>\n>>>" },
          { type: 'code', title: '추가 예제. 비교의 결과를 불형으로 저장', code: 'a = (100 == 100)\nb = (10 > 100)\nprint(a, b)',
            expect: 'True False',
            desc: '<code>==</code> 는 “같은가?”를 묻는 비교 연산자입니다(대입 <code>=</code> 과 다름). 100 == 100 은 참(True), 10 &gt; 100 은 거짓(False)입니다. 비교 연산자는 4장, 이를 활용하는 if 문은 5장에서 자세히 배웁니다.' },

          { type: 'h', text: '문자열 (1): 따옴표로 감싸기' },
          { type: 'p', html: '<b>문자열(str, string)</b>은 <code>\'abc\'</code>, <code>"파이썬 만세"</code>, <code>"1"</code> 처럼 <b>글자들을 모아 놓은 것</b>입니다. 문자열은 양쪽을 <b>큰따옴표(")</b>나 <b>작은따옴표(\')</b>로 감싸야 합니다. 어느 것을 써도 같은 문자열이지만, 시작과 끝의 따옴표 종류는 같아야 합니다.' },
          { type: 'code', repl: true, title: '추가 예제. 문자열 만들기', code: 'a = "파이썬 만세"\na\nprint(a)\ntype(a)',
            expect: ">>> a = \"파이썬 만세\"\n>>> a\n'파이썬 만세'\n>>> print(a)\n파이썬 만세\n>>> type(a)\n<class 'str'>\n>>>",
            desc: '셸에서 변수 이름만 입력하면 <b>따옴표가 붙은 모양</b>(<code>\'파이썬 만세\'</code>)으로 보여 줍니다. “이 값은 문자열이다”라는 표시입니다. print() 는 따옴표 없이 내용만 출력합니다.' },
          { type: 'p', html: '문자열 중간에 작은따옴표나 큰따옴표를 넣고 싶다면, <b>문자열을 다른 종류의 따옴표로 감싸면</b> 됩니다.' },
          { type: 'code', repl: true, title: '추가 예제. 문자열 속의 따옴표', code: '"작은따옴표는 \' 모양이다."\n\'큰따옴표는 " 모양이다.\'',
            expect: ">>> \"작은따옴표는 ' 모양이다.\"\n\"작은따옴표는 ' 모양이다.\"\n>>> '큰따옴표는 \" 모양이다.'\n'큰따옴표는 \" 모양이다.'\n>>>" },

          { type: 'h', text: '문자열 (2): 이스케이프와 여러 줄 문자열' },
          { type: 'p', html: '2교시에 배운 이스케이프 문자도 쓸 수 있습니다. 역슬래시(\\) 뒤에 따옴표를 쓰면 문자열의 끝이 아니라 <b>글자</b>로 인식합니다. 문자열을 여러 줄로 만들려면 중간에 <code>\\n</code> 을 넣거나, <b>따옴표 3개</b>(<code>"""</code> 또는 <code>\'\'\'</code>)로 감쌉니다.' },
          { type: 'code', title: '추가 예제. 역슬래시로 따옴표 넣기', code: String.raw`a = "이건 큰따옴표 \" 모양."
b = '이건 작은따옴표 \' 모양.'
print(a, b)`, expect: '이건 큰따옴표 " 모양. 이건 작은따옴표 \' 모양.' },
          { type: 'code', title: '추가 예제. \\n 으로 여러 줄 문자열', code: String.raw`a = '파이썬 \n만세'
print(a)`, expect: '파이썬\n만세' },
          { type: 'code', repl: true, title: '추가 예제. 따옴표 3개로 여러 줄 문자열', code: 'a = """파이썬\n만세"""\na\nprint(a)',
            expect: ">>> a = \"\"\"파이썬\n... 만세\"\"\"\n>>> a\n'파이썬\\n만세'\n>>> print(a)\n파이썬\n만세\n>>>",
            desc: '따옴표 3개 안에서는 <kbd>Enter</kbd> 로 줄을 바꿔 그대로 쓸 수 있습니다. 셸에 값을 표시하면 줄 바꿈이 <code>\\n</code> 으로 보이는 것을 확인할 수 있습니다. 셸에서 문자열이 끝나지 않은 줄 다음에는 <code>...</code> 프롬프트가 나옵니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: 데이터형 바꾸기와 input()', html: '<p><code>int()</code>, <code>float()</code>, <code>str()</code>, <code>bool()</code> 로 값의 데이터형을 바꿀 수 있습니다. 특히 <code>input()</code> 으로 받은 값은 숫자를 입력해도 <b>항상 문자열</b>이므로, 계산하려면 <code>int()</code> 나 <code>float()</code> 로 바꿔야 합니다. 문자열끼리 <code>+</code> 하면 계산이 아니라 <b>이어 붙이기</b>가 됩니다.</p>' },
          { type: 'code', title: '추가 예제. input() 값은 문자열', code: 'a = input("첫 번째 수 : ")\nb = input("두 번째 수 : ")\nprint(a + b, type(a))\nprint(int(a) + int(b))\nprint(float(a) + 0.5, str(100) + "점")',
            stdin: '100\n200\n',
            expect: "첫 번째 수 : 100\n두 번째 수 : 200\n100200 <class 'str'>\n300\n100.5 100점",
            desc: '<code>3행</code> 문자열 "100" 과 "200" 을 이어 붙여 100200 이 되었습니다. <code>4행</code> int() 로 정수로 바꾼 뒤 더해야 300 이 됩니다.' },

          { type: 'h', text: '파이썬 프로그램의 구조 (Code03-05)' },
          { type: 'p', html: '앞으로 프로그램이 길어지면 코드를 <b>함수 선언 부분 → 전역 변수 선언 부분 → 메인 코드 부분</b>으로 나누어 쓰는 것이 좋습니다. 강의자료의 다음 코드는 이 구조를 보여 줍니다. 함수(<code>def</code>)는 9장에서 자세히 배우므로 지금은 구조만 눈에 익혀 두세요.' },
          { type: 'code', title: 'Code03-05. 파이썬 프로그램의 기본 구조', code: "## 함수 선언 부분 ##\ndef myFunc() :\n    print('함수를 호출함.')\n\n## 전역 변수 선언 부분 ##\ngVar = 100\n\n## 메인 코드 부분 ##\nif __name__ == '__main__' :\n    print('메인 함수 부분이 실행됩니다.')\n    myFunc()\n    print('전역 변수 값:', gVar)",
            expect: '메인 함수 부분이 실행됩니다.\n함수를 호출함.\n전역 변수 값: 100',
            desc: '<code>2~3행</code> <code>myFunc()</code> 라는 함수를 만들어 두기만 합니다(아직 실행 안 됨). <code>6행</code> 프로그램 전체에서 쓸 변수(전역 변수). <code>9행</code> <code>if __name__ == \'__main__\' :</code> 은 “이 파일을 직접 실행했을 때 여기부터 시작하라”는 뜻으로, C/자바의 main() 함수와 같은 역할입니다. <code>11행</code>에서 비로소 함수가 호출되어 “함수를 호출함.”이 출력됩니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기: __name__ 은 무엇일까?', html: '<code>__name__</code> 은 파이썬이 자동으로 만들어 두는 특별한 변수입니다. 파일을 <b>직접 실행</b>하면 <code>\'__main__\'</code> 이 들어 있고, 다른 파일에서 <code>import</code> 로 불러 쓰면 그 파일(모듈)의 이름이 들어 있습니다. 그래서 이 if 문 아래의 코드는 직접 실행할 때만 동작하고, 모듈로 불러 쓸 때는 실행되지 않습니다. (모듈은 9장에서 배웁니다)' }
        ],
        practice: [
          { title: '실습 3-9. 두 수의 연산 결과', level: 1,
            desc: '<p>정수 두 개를 입력받아 더하기, 빼기, 곱하기, 나누기, 몫, 나머지, 제곱을 출력하세요.</p><pre>첫 번째 수 : 9\n두 번째 수 : 2\n9 + 2 = 11\n9 - 2 = 7\n9 * 2 = 18\n9 / 2 = 4.5\n9 // 2 = 4\n9 % 2 = 1\n9 ** 2 = 81</pre>',
            hint: '입력값은 문자열이므로 <code>int(input(…))</code> 로 정수로 바꿉니다. 출력은 <code>print(a, "+", b, "=", a + b)</code> 처럼 쉼표로 이어 씁니다.',
            starter: 'a = int(input("첫 번째 수 : "))\nb = int(input("두 번째 수 : "))\nprint(a, "+", b, "=", a + b)\n# TODO: 나머지 연산도 출력\n',
            solution: 'a = int(input("첫 번째 수 : "))\nb = int(input("두 번째 수 : "))\nprint(a, "+", b, "=", a + b)\nprint(a, "-", b, "=", a - b)\nprint(a, "*", b, "=", a * b)\nprint(a, "/", b, "=", a / b)\nprint(a, "//", b, "=", a // b)\nprint(a, "%", b, "=", a % b)\nprint(a, "**", b, "=", a ** b)\n',
            stdin: '9\n2\n',
            expect: '첫 번째 수 : 9\n두 번째 수 : 2\n9 + 2 = 11\n9 - 2 = 7\n9 * 2 = 18\n9 / 2 = 4.5\n9 // 2 = 4\n9 % 2 = 1\n9 ** 2 = 81' },
          { title: '실습 3-10. 초를 분과 초로', level: 2,
            desc: '<p>초(정수)를 입력받아 몇 분 몇 초인지 출력하세요. 초는 <b>두 자리(0 채움)</b>로 출력합니다.</p><pre>초 입력 : 135\n2분 15초\n2:15</pre>',
            hint: '분 = 초 // 60, 남은 초 = 초 % 60. 두 번째 줄은 <code>"%d:%02d"</code> 서식을 사용합니다.',
            starter: 'sec = int(input("초 입력 : "))\n# TODO: 분과 남은 초를 계산해 출력\n',
            solution: 'sec = int(input("초 입력 : "))\nminute = sec // 60\nremain = sec % 60\nprint("%d분 %d초" % (minute, remain))\nprint("%d:%02d" % (minute, remain))\n',
            stdin: '135\n',
            expect: '초 입력 : 135\n2분 15초\n2:15' },
          { title: '실습 3-11. 데이터형 맞히기', level: 1,
            desc: '<p>다음 다섯 값의 데이터형을 예측한 뒤, <code>type()</code> 으로 출력해 확인하세요: <code>10</code>, <code>10.0</code>, <code>"10"</code>, <code>10 &gt; 5</code>, <code>10 / 5</code></p>',
            hint: '<code>print(type(10))</code> 처럼 씁니다. 나누기(/)의 결과는 항상 실수입니다.',
            starter: 'print(type(10))\n# TODO: 나머지 네 값의 type() 출력\n',
            solution: 'print(type(10))\nprint(type(10.0))\nprint(type("10"))\nprint(type(10 > 5))\nprint(type(10 / 5))\n',
            expect: "<class 'int'>\n<class 'float'>\n<class 'str'>\n<class 'bool'>\n<class 'float'>" }
        ],
        quiz: [
          { q: '<code>print(9 // 2, 9 % 2)</code> 의 출력은?', options: ['4.5 1', '4 1', '4 0.5', '1 4'], answer: 1,
            explain: '<code>//</code> 는 몫(4), <code>%</code> 는 나머지(1)입니다.' },
          { q: '<code>print(10 / 5)</code> 의 출력은?', options: ['2', '2.0', '2.00', '0'], answer: 1,
            explain: '<code>/</code> 의 결과는 나누어떨어져도 항상 실수입니다.' },
          { q: '<code>b = 3.14e2</code> 일 때 <code>print(b)</code> 의 출력은?', options: ['3.14e2', '314', '314.0', '0.0314'], answer: 2,
            explain: '3.14 × 10² = 314.0, 실수형입니다.' },
          { q: '다음 코드의 실행 결과는?<pre><code>a = (10 &gt; 100)\nprint(a)</code></pre>', options: ['True', 'False', '10', '오류'], answer: 1,
            explain: '10 은 100 보다 크지 않으므로 False 가 저장됩니다.' },
          { q: '다음 중 <b>오류가 발생하는</b> 문자열은?', options: ['"I\'m OK"', '\'He said "Hi"\'', '"파이썬\'', '"""여러 줄"""'], answer: 2,
            explain: '시작은 큰따옴표, 끝은 작은따옴표로 짝이 맞지 않아 문법 오류(SyntaxError)가 발생합니다.' }
        ],
        slides: [
          { layout: 'title', title: '기본 데이터형', subtitle: 'Chapter 03 · Section 05', badge: '5교시',
            notes: '<p>3교시에 type() 으로 본 bool · int · float · str 을 하나씩 자세히 살펴봅니다.</p><p>시간: 1분</p>' },
          { layout: 'code', title: '숫자형 (1): 정수형', code: 'a = 123\nprint(type(a))\n\na = 100 ** 100\nprint(a)\n\na = 0xFF\nb = 0o77\nc = 0b1111\nprint(a, b, c)',
            points: ['int: 소수점 없는 수', '크기 제한이 거의 없다 (100¹⁰⁰ 도 OK)', '0x · 0o · 0b 접두어로 진수 표기', '출력은 10진수로'],
            notes: '<p>100 ** 100 결과가 콘솔에 길게 출력되는 것을 보여 주며 “다른 언어는 이 계산에서 오류가 나거나 틀린 값이 나온다”고 비교합니다.</p><p>시간: 4분</p>' },
          { layout: 'code', title: '숫자형 (2): 실수형', code: 'a = 3.14\nb = 3.14e5\nprint(a, b)\nprint(0.1 + 0.2)\nprint(round(0.1 + 0.2, 2))',
            points: ['float: 소수점 있는 수', '3.14e5 = 3.14 × 10⁵', '(보충) 실수에는 아주 작은 오차', 'round() · %.2f 로 정리'],
            notes: '<p>0.1 + 0.2 결과에 학생들이 놀라는 순간을 활용합니다. “컴퓨터가 틀린 게 아니라 2진수 표현의 한계”.</p><p>시간: 4분</p>' },
          { layout: 'table', title: '숫자형 (3): 연산자', head: ['연산자', '의미', '예', '결과'], rows: [
            ['+ - *', '더하기 · 빼기 · 곱하기', '10 + 20', '30'], ['/', '나누기 (항상 실수)', '10 / 20', '0.5'], ['**', '거듭제곱', '9 ** 2', '81'], ['%', '나머지', '9 % 2', '1'], ['//', '몫 (소수점 버림)', '9 // 2', '4']],
            lead: '정수 · 실수 모두 사용 가능',
            notes: '<p>%, // 는 짝수/홀수 판별, 시간 계산(초 → 분)에 자주 쓰인다는 예를 들어 줍니다.</p><p>시간: 3분</p>' },
          { layout: 'code', title: '연산 확인', code: 'a = 10; b = 20\nprint(a + b, a - b, a * b, a / b)\n\na, b = 9, 2\nprint(a ** b, a % b, a // b)',
            points: ['; 로 한 줄에 두 문장', 'a / b → 0.5 (실수)', '9 ** 2 = 81, 9 % 2 = 1, 9 // 2 = 4'],
            notes: '<p>실행 전에 결과를 예측하게 합니다. <code>a, b = 9, 2</code> 는 3교시의 여러 변수 한 번에 대입과 연결됩니다.</p><p>시간: 3분</p>' },
          { layout: 'code', title: '불형', code: 'a = True\nprint(type(a))\n\na = (100 == 100)\nb = (10 > 100)\nprint(a, b)',
            points: ['bool: True / False 만 저장', '첫 글자 대문자 (true ✘)', '비교의 결과를 저장', '== 비교 vs = 대입'],
            notes: '<p>== 와 = 의 차이를 확실히 짚습니다. 4장 비교 연산자 · 5장 if 문의 기초가 됩니다.</p><p>시간: 3분</p>' },
          { layout: 'code', repl: true, title: '문자열 (1): 따옴표', code: 'a = "파이썬 만세"\na\nprint(a)\ntype(a)\n"작은따옴표는 \' 모양이다."\n\'큰따옴표는 " 모양이다.\'',
            points: ['" " 또는 \' \' 로 감싼다', '셸의 값 표시에는 따옴표가 붙는다', '안에 따옴표를 넣으려면 다른 따옴표로 감싸기'],
            notes: '<p>셸에서 <code>a</code> 와 <code>print(a)</code> 의 차이(따옴표 유무)를 보여 줍니다.</p><p>시간: 4분</p>' },
          { layout: 'code', title: '문자열 (2): 이스케이프와 여러 줄', code: String.raw`a = "이건 큰따옴표 \" 모양."
b = '이건 작은따옴표 \' 모양.'
print(a, b)

a = '파이썬 \n만세'
print(a)

a = """파이썬
만세"""
print(a)`,
            points: ['\\" \\\' → 따옴표 글자', '\\n → 줄 바꿈', '""" … """ → 여러 줄을 그대로'],
            notes: '<p>따옴표 3개는 긴 안내문이나 설명 글(docstring)에 많이 쓰인다고 덧붙입니다.</p><p>시간: 4분</p>' },
          { layout: 'code', title: '보충: input() 은 문자열', code: 'a = input("첫 번째 수 : ")\nb = input("두 번째 수 : ")\nprint(a + b)\nprint(int(a) + int(b))',
            stdin: '100\n200\n',
            points: ['input() 결과는 항상 str', '"100" + "200" → "100200"', 'int() · float() 로 바꿔서 계산'],
            notes: '<p>학생들이 가장 많이 겪는 실수입니다. [프로그램 2]에서 <code>int(input(…))</code> 을 쓴 이유와 연결합니다.</p><p>시간: 4분</p>' },
          { layout: 'code', title: 'Code03-05. 프로그램의 기본 구조', code: "## 함수 선언 부분 ##\ndef myFunc() :\n    print('함수를 호출함.')\n\n## 전역 변수 선언 부분 ##\ngVar = 100\n\n## 메인 코드 부분 ##\nif __name__ == '__main__' :\n    print('메인 함수 부분이 실행됩니다.')\n    myFunc()\n    print('전역 변수 값:', gVar)",
            points: ['함수 선언 → 전역 변수 → 메인 코드', 'def 는 만들어 두기만 (호출 시 실행)', "if __name__ == '__main__': = 시작 지점"],
            notes: '<p>함수 · 모듈은 9장에서 배우므로 구조만 소개합니다. 출력 순서를 예측하게 하면 “함수는 호출해야 실행된다”는 점을 자연스럽게 알게 됩니다.</p><p>시간: 5분</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>print(9 // 2, 9 % 2, 10 / 5)</code> 의 출력은?', options: ['4 1 2', '4.5 1 2.0', '4 1 2.0', '4 0 2'], answer: 2,
            explain: '몫 4, 나머지 1, / 는 항상 실수 → 2.0',
            notes: '<p>10 / 5 → 2 를 고른 학생이 많습니다. / 는 항상 실수!</p><p>시간: 2분</p>' },
          { layout: 'practice', title: '실습 3-10. 초를 분과 초로', desc: '초를 입력받아 "2분 15초" 와 "2:15" 형식으로 출력하세요. (// 와 %, %02d 활용)',
            starter: 'sec = int(input("초 입력 : "))\n# TODO: 분과 남은 초를 계산해 출력\n',
            solution: 'sec = int(input("초 입력 : "))\nminute = sec // 60\nremain = sec % 60\nprint("%d분 %d초" % (minute, remain))\nprint("%d:%02d" % (minute, remain))\n',
            stdin: '135\n',
            notes: '<p>1교시의 %02d 서식과 오늘의 //, % 를 함께 쓰는 종합 문제입니다. 65초 → 1:05 로도 확인하게 합니다.</p><p>시간: 7분</p>' },
          { layout: 'summary', title: '3장 정리', bullets: ['int: 크기 제한 없는 정수, 0x · 0o · 0b 표기', 'float: 실수, 3.14e5 지수 표기, / 는 항상 실수', '연산자: + - * / ** % //', 'bool: True / False, 비교 결과 저장', 'str: " " · \' \' · """ """, 이스케이프, input() 은 문자열'],
            notes: '<p>3장 전체 복습: print 서식 → 변수 → 진수 → 데이터형. 두 프로그램(다이아몬드, 진수 변환)을 다시 실행해 보며 마무리합니다.</p><p>다음 장: 연산자.</p><p>시간: 3분</p>' }
        ]
      }
    ]
  });
})();
