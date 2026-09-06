// Chapter 6 Interactive Canvas Drawers and Simulators (Two.js)
// Ⅵ. 평면도형 10대 인터랙티브 시뮬레이터 및 전 서브스텝 기하 렌더러

const ch6SimState = {
  rollPos: 0,           // 0-1 원주율 굴리기 진행률 (0 ~ 1)
  tearStep: 1,          // 1-1 삼각형 외각 찢어 붙이기 단계 (1: 원형, 2: 찢기, 3: 외각에 결합)
  boomA: 35,            // 1-3 부메랑 각도 A, B, C
  boomB: 45,
  boomC: 30,
  splitSides: 5,        // 2-1 n각형 대각선 분할 변의 수 (3 ~ 8)
  shrinkScale: 1,       // 2-3 다각형 축소 외각 합체 (1 -> 0.1)
  diagSides: 5,         // 3-1 대각선 연결망 n각형 (4 ~ 8)
  showAllDiags: false,  // 3-1 대각선 전체 표시 여부
  partSelect: 'sector', // 4-1 원의 요소 (sector: 부채꼴, segment: 활꼴, arc: 호, chord: 현)
  propAngleMult: 1,     // 4-3 중심각 배수 (1배, 2배, 3배)
  fanUnfoldStep: 1,     // 5-1 부채꼴 부채 펼치기 단계 (1: 부채꼴, 2: 조각 분할, 3: 직사각형 변환)
  tessPolygon: 'tri',   // 5-3 테셀레이션 다각형 (tri: 정삼각형, sq: 정사각형, pent: 정오각형, hex: 정육각형)
  tessCount: 1          // 5-3 테셀레이션 다각형 배치 개수
};
window.ch6SimState = ch6SimState;

function setupSubstepSimulator(two, code, simController) {
  if (!two) return;
  two.clear();
  if (simController) {
    simController.style.display = 'block';
  }

  const w = two.width || 600;
  const h = two.height || 480;
  const cx = w / 2;
  const cy = h / 2;

  // --- 0-1: [되짚어 보기 1] 원주율 pi 굴리기 시뮬레이터 (10대 시뮬레이터 #1) ---
  if (code === '0-1') {
    const progress = ch6SimState.rollPos; // 0 to 1
    const r = 40;
    const perimeter = 2 * Math.PI * r; // ~251.3px
    const startX = cx - 140;
    const groundY = cy + 40;

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">🔄 원주율(π) 굴리기 시뮬레이터 (교과서 178쪽)</span>
          <span id="pi-roll-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            지름 1일 때 굴러간 거리 = π ≈ 3.14
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <button class="tool-btn" style="background:#f0fdf4; color:#166534; font-weight:700;" onclick="rollPiCircle(0)">1. 출발점 (0)</button>
          <button class="tool-btn" style="background:#eff6ff; color:#1e40af; font-weight:800;" onclick="rollPiCircle(0.5)">2. 반 바퀴 (0.5π)</button>
          <button class="tool-btn" style="background:#fdf2f8; color:#be185d; font-weight:800;" onclick="rollPiCircle(1)">3. 한 바퀴 완주 (π ≈ 3.14d)</button>
        </div>
      `;
    }

    // Ground Number line
    const ground = two.makeLine(startX - 20, groundY, startX + perimeter + 40, groundY);
    ground.stroke = '#475569'; ground.linewidth = 3;

    // Ticks: 0, 1, 2, 3, pi
    const dPx = 2 * r;
    const ticks = [
      { x: startX, label: '0' },
      { x: startX + dPx, label: '1d' },
      { x: startX + 2 * dPx, label: '2d' },
      { x: startX + 3 * dPx, label: '3d' },
      { x: startX + perimeter, label: 'π·d (3.14d)' }
    ];

    ticks.forEach(t => {
      two.makeLine(t.x, groundY - 6, t.x, groundY + 6).stroke = '#475569';
      const txt = two.makeText(t.label, t.x, groundY + 22);
      txt.size = 11; txt.weight = 800;
      txt.fill = t.label.includes('π') ? '#ec4899' : '#475569';
    });

    // Rolled trace line
    const rolledDist = perimeter * progress;
    if (rolledDist > 0) {
      const trace = two.makeLine(startX, groundY, startX + rolledDist, groundY);
      trace.stroke = '#ec4899'; trace.linewidth = 5;
    }

    // Rolling Circle
    const curX = startX + rolledDist;
    const curY = groundY - r;
    const wheel = two.makeCircle(curX, curY, r);
    wheel.fill = 'rgba(2, 132, 199, 0.25)'; wheel.stroke = '#0284c7'; wheel.linewidth = 3;

    // Radius line inside wheel showing rotation
    const rotRad = progress * 2 * Math.PI;
    const pRimX = curX + r * Math.sin(rotRad);
    const pRimY = curY + r * Math.cos(rotRad);
    const spoke = two.makeLine(curX, curY, pRimX, pRimY);
    spoke.stroke = '#0284c7'; spoke.linewidth = 2.5;

    const redDot = two.makeCircle(pRimX, pRimY, 5);
    redDot.fill = '#ec4899'; redDot.stroke = '#fff'; redDot.linewidth = 2;

    const title = two.makeText('원의 둘레(원주)와 원주율: 원주 = 2πr = π × (지름)', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';

    const info = two.makeText(progress === 1 ? '🎉 지름이 d인 원이 1회전하면 정확히 π·d (약 3.14d)만큼 이동합니다!' : '버튼을 눌러 원을 굴려보세요.', cx, cy + 115);
    info.size = 14; info.weight = 800; info.fill = progress === 1 ? '#059669' : '#64748b';
  }

  // --- 0-2: [되짚어 보기 2] 다각형의 둘레와 넓이 ---
  else if (code === '0-2') {
    // Parallelogram & Trapezoid comparison
    const x1 = cx - 110, x2 = cx + 110;

    // Parallelogram
    const p1 = two.makePolygon(x1, cy, 55, 4);
    p1.fill = 'rgba(224, 242, 254, 0.6)'; p1.stroke = '#0284c7'; p1.linewidth = 2.5;
    two.makeText('평행사변형 넓이', x1, cy - 60).fill = '#0284c7';
    two.makeText('밑변 × 높이', x1, cy + 65).fill = '#1e293b';

    // Trapezoid
    const p2 = two.makePolygon(x2, cy, 55, 3);
    p2.fill = 'rgba(220, 252, 231, 0.6)'; p2.stroke = '#059669'; p2.linewidth = 2.5;
    two.makeText('사다리꼴 넓이', x2, cy - 60).fill = '#059669';
    two.makeText('(윗변 + 아랫변) × 높이 ÷ 2', x2, cy + 65).fill = '#1e293b';

    const title = two.makeText('다각형의 넓이 공식 복습', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';
  }

  // --- 0-3: [되짚어 보기 3] 정다각형의 성질 ---
  else if (code === '0-3') {
    const x1 = cx - 120, x2 = cx, x3 = cx + 120;

    const pTri = two.makePolygon(x1, cy, 45, 3); pTri.fill = 'rgba(254, 240, 138, 0.5)'; pTri.stroke = '#ca8a04';
    two.makeText('정삼각형', x1, cy + 60).fill = '#ca8a04';

    const pSq = two.makePolygon(x2, cy, 45, 4); pSq.fill = 'rgba(224, 242, 254, 0.5)'; pSq.stroke = '#0284c7';
    two.makeText('정사각형', x2, cy + 60).fill = '#0284c7';

    const pHex = two.makePolygon(x3, cy, 45, 6); pHex.fill = 'rgba(236, 72, 153, 0.2)'; pHex.stroke = '#ec4899';
    two.makeText('정육각형', x3, cy + 60).fill = '#ec4899';

    const title = two.makeText('정다각형의 성질: 모든 변의 길이가 같고, 모든 내각의 크기가 같다', cx, 40);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';
  }

  // --- 1-1: [6.1 개념] 삼각형 찢어 외각에 모으기 실험실 (10대 시뮬레이터 #2) ---
  else if (code === '1-1') {
    const step = ch6SimState.tearStep;

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">✂️ 삼각형 찢어 외각에 모으기 실험실 (교과서 182~184쪽)</span>
          <span id="triangle-ext-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            단계: ${step === 1 ? '1. 기본 삼각형' : (step === 2 ? '2. 두 내각 찢기' : '3. 외각에 나란히 포개기 (완성!)')}
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <button class="tool-btn ${step === 1 ? 'active' : ''}" style="font-weight:700;" onclick="setTearStep(1)">1. 원형 삼각형</button>
          <button class="tool-btn ${step === 2 ? 'active' : ''}" style="font-weight:700;" onclick="setTearStep(2)">2. 각 A, B 조각 분리</button>
          <button class="tool-btn ${step === 3 ? 'active' : ''}" style="font-weight:800; background:#dcfce7; color:#15803d;" onclick="setTearStep(3)">3. 외각에 찰칵 결합! (외각 = A + B)</button>
        </div>
      `;
    }

    const pA = { x: cx - 40, y: cy - 70 };
    const pB = { x: cx - 140, y: cy + 50 };
    const pC = { x: cx + 40, y: cy + 50 };
    const pExt = { x: cx + 160, y: cy + 50 }; // Extended line from BC

    // Extended baseline BC -> pExt
    const baseLine = two.makeLine(pB.x, pB.y, pExt.x, pExt.y);
    baseLine.stroke = '#64748b'; baseLine.linewidth = 2; baseLine.dashes = [5, 4];

    // Triangle ABC
    const tri = two.makePath(pA.x, pA.y, pB.x, pB.y, pC.x, pC.y, true);
    tri.fill = 'rgba(224, 242, 254, 0.4)'; tri.stroke = '#0284c7'; tri.linewidth = 3;

    // Angle markers
    if (step === 1) {
      // Angle A
      const arcA = two.makeArcSegment(pA.x, pA.y, 0, 30, 0.8, 2.2); arcA.fill = 'rgba(236, 72, 153, 0.4)'; arcA.stroke = '#ec4899';
      two.makeText('∠A', pA.x, pA.y + 42).fill = '#ec4899';

      // Angle B
      const arcB = two.makeArcSegment(pB.x, pB.y, 0, 30, -0.7, 0); arcB.fill = 'rgba(5, 150, 105, 0.4)'; arcB.stroke = '#059669';
      two.makeText('∠B', pB.x + 40, pB.y - 12).fill = '#059669';

      // Exterior Angle C
      const arcExt = two.makeArcSegment(pC.x, pC.y, 0, 38, -2.2, 0); arcExt.fill = 'rgba(217, 119, 6, 0.2)'; arcExt.stroke = '#d97706';
      two.makeText('외각 ∠ACD = ?', pC.x + 60, pC.y - 20).fill = '#d97706';
    } else if (step === 2) {
      // Torn Angle A & B floating
      const fanA = two.makeArcSegment(cx + 90, cy - 50, 0, 32, 0, 1.4); fanA.fill = 'rgba(236, 72, 153, 0.7)'; fanA.stroke = '#ec4899';
      two.makeText('조각 ∠A (이동 중)', cx + 90, cy - 15).fill = '#ec4899';

      const fanB = two.makeArcSegment(cx + 90, cy + 10, 0, 32, 0, 0.8); fanB.fill = 'rgba(5, 150, 105, 0.7)'; fanB.stroke = '#059669';
      two.makeText('조각 ∠B (이동 중)', cx + 90, cy + 35).fill = '#059669';
    } else if (step === 3) {
      // Both pieces assembled at exterior angle C!
      const fanB = two.makeArcSegment(pC.x, pC.y, 0, 38, -0.8, 0); fanB.fill = 'rgba(5, 150, 105, 0.7)'; fanB.stroke = '#059669';
      two.makeText('∠B', pC.x + 45, pC.y - 12).fill = '#059669';

      const fanA = two.makeArcSegment(pC.x, pC.y, 0, 38, -2.2, -0.8); fanA.fill = 'rgba(236, 72, 153, 0.7)'; fanA.stroke = '#ec4899';
      two.makeText('∠A', pC.x + 25, pC.y - 32).fill = '#ec4899';

      const res = two.makeText('외각 ∠ACD = ∠A + ∠B (완벽 일치!) ✨', cx + 60, cy - 80);
      res.size = 15; res.weight = 800; res.fill = '#15803d';
    }

    // Vertices
    two.makeText('A', pA.x, pA.y - 14).fill = '#1e293b';
    two.makeText('B', pB.x - 14, pB.y).fill = '#1e293b';
    two.makeText('C', pC.x - 10, pC.y + 20).fill = '#1e293b';
    two.makeText('D', pExt.x + 14, pExt.y).fill = '#64748b';

    const title = two.makeText('삼각형의 한 외각의 크기 = 이웃하지 않는 두 내각의 크기의 합', cx, 40);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';
  }

  // --- 1-2: [6.1 개념] 삼각형 한 외각의 성질 계산 ---
  else if (code === '1-2') {
    const pA = { x: cx - 20, y: cy - 60 };
    const pB = { x: cx - 120, y: cy + 40 };
    const pC = { x: cx + 60, y: cy + 40 };
    const pD = { x: cx + 150, y: cy + 40 };

    two.makePath(pA.x, pA.y, pB.x, pB.y, pC.x, pC.y, true).fill = 'rgba(224, 242, 254, 0.4)';
    two.makeLine(pB.x, pB.y, pD.x, pD.y).stroke = '#475569';

    two.makeText('65°', pA.x, pA.y + 28).fill = '#ec4899';
    two.makeText('55°', pB.x + 35, pB.y - 10).fill = '#059669';
    two.makeText('∠x = 65° + 55° = 120°', pC.x + 50, pC.y - 18).fill = '#d97706';

    const title = two.makeText('삼각형 외각 공식 계산 예제', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';
  }

  // --- 1-3: [6.1 응용] 부메랑(오목사각형) 외각 변형기 (10대 시뮬레이터 #3) ---
  else if (code === '1-3') {
    const a = ch6SimState.boomA;
    const b = ch6SimState.boomB;
    const c = ch6SimState.boomC;
    const sum = a + b + c;

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">🪃 부메랑(오목사각형) 외각 변형기 (교과서 185쪽)</span>
          <span id="boomerang-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            ∠x = ${a}° + ${b}° + ${c}° = ${sum}°
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <button class="tool-btn" style="background:#f0fdf4; color:#166534; font-weight:700;" onclick="setBoomerangAngles(30, 40, 25)">30°, 40°, 25° (합 95°)</button>
          <button class="tool-btn" style="background:#eff6ff; color:#1e40af; font-weight:800;" onclick="setBoomerangAngles(35, 45, 30)">35°, 45°, 30° (합 110° 기본)</button>
          <button class="tool-btn" style="background:#fef3c7; color:#92400e; font-weight:700;" onclick="setBoomerangAngles(40, 50, 35)">40°, 50°, 35° (합 125°)</button>
        </div>
      `;
    }

    const pA = { x: cx, y: cy - 70 };
    const pB = { x: cx - 110, y: cy + 50 };
    const pD = { x: cx, y: cy + 10 }; // Dent point
    const pC = { x: cx + 110, y: cy + 50 };

    // Boomerang polygon
    const boom = two.makePath(pA.x, pA.y, pB.x, pB.y, pD.x, pD.y, pC.x, pC.y, true);
    boom.fill = 'rgba(254, 240, 138, 0.4)'; boom.stroke = '#ca8a04'; boom.linewidth = 3;

    // Auxiliary dashed line from A through D
    const aux = two.makeLine(pA.x, pA.y, pD.x, pD.y + 45);
    aux.stroke = '#ec4899'; aux.linewidth = 2; aux.dashes = [4, 4];

    // Angles
    two.makeText(`${a}°`, pA.x, pA.y + 24).fill = '#ec4899';
    two.makeText(`${b}°`, pB.x + 35, pB.y - 12).fill = '#059669';
    two.makeText(`${c}°`, pC.x - 35, pC.y - 12).fill = '#0284c7';
    two.makeText(`∠x = ${sum}°`, pD.x, pD.y + 24).fill = '#dc2626';

    const title = two.makeText('부메랑 사각형의 비법: 안쪽 세 각의 합 = 오목한 바깥 각', cx, 40);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const proof = two.makeText(`보조선 AD를 그으면 두 외각의 합에 의해: ∠x = ${a}° + ${b}° + ${c}° = ${sum}°`, cx, cy + 115);
    proof.size = 14; proof.weight = 800; proof.fill = '#4f46e5';
  }

  // --- 1-4: [6.1 응용] 별 모양(오각별) 꼭짓점 각의 합 ---
  else if (code === '1-4') {
    const rOuter = 85, rInner = 38;
    const starPts = [];
    for (let i = 0; i < 10; i++) {
      const rad = (i * Math.PI / 5) - Math.PI / 2;
      const r = (i % 2 === 0) ? rOuter : rInner;
      starPts.push(cx + r * Math.cos(rad), cy + r * Math.sin(rad));
    }

    const star = two.makePolygon(cx, cy, 70, 5); // Fallback star
    star.fill = 'rgba(254, 240, 138, 0.4)'; star.stroke = '#ca8a04'; star.linewidth = 2.5;

    two.makeText('A', cx, cy - 70).fill = '#dc2626';
    two.makeText('B', cx - 70, cy - 20).fill = '#dc2626';
    two.makeText('C', cx - 45, cy + 60).fill = '#dc2626';
    two.makeText('D', cx + 45, cy + 60).fill = '#dc2626';
    two.makeText('E', cx + 70, cy - 20).fill = '#dc2626';

    const title = two.makeText('오각별의 5개 꼭짓점 각의 합: ∠A + ∠B + ∠C + ∠D + ∠E = 180°', cx, 40);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const desc = two.makeText('삼각형의 외각 성질을 2번 연속 적용하면 한 삼각형의 세 내각으로 모여 180°가 됩니다!', cx, cy + 115);
    desc.size = 13; desc.weight = 700; desc.fill = '#334155';
  }

  // --- 2-1: [6.2 개념] 한 꼭짓점 대각선 삼각형 분할기 (10대 시뮬레이터 #4) ---
  else if (code === '2-1') {
    const n = ch6SimState.splitSides;
    const triCount = n - 2;
    const totalSum = 180 * triCount;

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">📐 한 꼭짓점 대각선 삼각형 분할기 (교과서 186~188쪽)</span>
          <span id="poly-sum-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            ${n}각형: 삼각형 ${triCount}개 ➔ 내각의 합 = 180° × ${triCount} = ${totalSum}°
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <button class="tool-btn ${n === 4 ? 'active' : ''}" style="font-weight:700;" onclick="setSplitPolygon(4)">사각형 (2개)</button>
          <button class="tool-btn ${n === 5 ? 'active' : ''}" style="font-weight:700;" onclick="setSplitPolygon(5)">오각형 (3개)</button>
          <button class="tool-btn ${n === 6 ? 'active' : ''}" style="font-weight:700;" onclick="setSplitPolygon(6)">육각형 (4개)</button>
          <button class="tool-btn ${n === 8 ? 'active' : ''}" style="font-weight:700;" onclick="setSplitPolygon(8)">팔각형 (6개)</button>
        </div>
      `;
    }

    const r = 90;
    const polyPts = [];
    for (let i = 0; i < n; i++) {
      const rad = (i * 2 * Math.PI / n) - Math.PI / 2;
      polyPts.push({ x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) });
    }

    // Polygon boundary
    for (let i = 0; i < n; i++) {
      const next = (i + 1) % n;
      const l = two.makeLine(polyPts[i].x, polyPts[i].y, polyPts[next].x, polyPts[next].y);
      l.stroke = '#0284c7'; l.linewidth = 3;
    }

    // Diagonals from top vertex (idx 0)
    for (let i = 2; i < n - 1; i++) {
      const d = two.makeLine(polyPts[0].x, polyPts[0].y, polyPts[i].x, polyPts[i].y);
      d.stroke = '#ec4899'; d.linewidth = 2.5; d.dashes = [5, 4];
    }

    // Vertex markers
    polyPts.forEach((p, idx) => {
      const c = two.makeCircle(p.x, p.y, 5);
      c.fill = idx === 0 ? '#ec4899' : '#0284c7'; c.stroke = '#fff'; c.linewidth = 1.5;
    });

    const title = two.makeText(`${n}각형의 내각의 크기의 합 = 180° × (${n} - 2) = ${totalSum}°`, cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';

    const info = two.makeText(`한 꼭짓점에서 그을 수 있는 대각선으로 ${triCount}개의 삼각형으로 분할됩니다.`, cx, cy + 125);
    info.size = 14; info.weight = 800; info.fill = '#4f46e5';
  }

  // --- 2-2: [6.2 개념] 다각형 내각의 합 계산 ---
  else if (code === '2-2') {
    const title = two.makeText('다각형 내각의 합 공식: 180° × (n - 2)', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';

    const f1 = two.makeText('• 칠각형(n=7): 180° × (7 - 2) = 180° × 5 = 900°', cx, cy - 30);
    f1.size = 14; f1.weight = 700; f1.fill = '#0284c7';

    const f2 = two.makeText('• 십각형(n=10): 180° × (10 - 2) = 180° × 8 = 1440°', cx, cy + 10);
    f2.size = 14; f2.weight = 700; f2.fill = '#059669';

    const f3 = two.makeText('• 정육각형의 한 내각: 720° ÷ 6 = 120°', cx, cy + 50);
    f3.size = 14; f3.weight = 700; f3.fill = '#ec4899';
  }

  // --- 2-3: [6.2 개념] 다각형 축소 외각 360° 합체기 (10대 시뮬레이터 #5) ---
  else if (code === '2-3') {
    const scale = ch6SimState.shrinkScale;

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">🌀 다각형 축소 외각 360° 합체기 (교과서 190~191쪽)</span>
          <span id="shrink-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            ${scale <= 0.2 ? '✨ 모든 외각이 한 점에 모여 완벽한 360° 원 형성!' : '다각형 축소 중'}
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <button class="tool-btn" style="background:#f0fdf4; color:#166534; font-weight:700;" onclick="shrinkPolygon(1)">1. 기본 오각형 (외각 분산)</button>
          <button class="tool-btn" style="background:#eff6ff; color:#1e40af; font-weight:800;" onclick="shrinkPolygon(0.5)">2. 중간 축소</button>
          <button class="tool-btn" style="background:#fdf2f8; color:#be185d; font-weight:800;" onclick="shrinkPolygon(0.15)">3. 한 점으로 압축! (360° 완성)</button>
        </div>
      `;
    }

    const r = 90 * scale;
    const n = 5;
    const pts = [];
    for (let i = 0; i < n; i++) {
      const rad = (i * 2 * Math.PI / n) - Math.PI / 2;
      pts.push({ x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) });
    }

    // Polygon
    for (let i = 0; i < n; i++) {
      const next = (i + 1) % n;
      two.makeLine(pts[i].x, pts[i].y, pts[next].x, pts[next].y).stroke = '#94a3b8';
    }

    // Exterior angle fans at each vertex pointing outward
    const extCol = ['#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6'];
    for (let i = 0; i < n; i++) {
      const startRad = (i * 2 * Math.PI / n);
      const fan = two.makeArcSegment(pts[i].x, pts[i].y, 0, 36, startRad, startRad + (2 * Math.PI / n));
      fan.fill = extCol[i]; fan.opacity = 0.5; fan.stroke = extCol[i];
    }

    const title = two.makeText('모든 다각형의 외각의 크기의 합 = 360° (항상 일정!)', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';

    const info = two.makeText(scale <= 0.2 ? '🎉 오각형을 점으로 모으면 5개의 외각이 정확히 360° 원을 이룹니다!' : '다각형의 변의 수와 상관없이 외각의 총합은 항상 360°입니다.', cx, cy + 125);
    info.size = 14; info.weight = 800; info.fill = scale <= 0.2 ? '#059669' : '#475569';
  }

  // --- 2-4: [6.2 개념] 정다각형의 한 내각과 한 외각의 크기 ---
  else if (code === '2-4') {
    const title = two.makeText('정다각형의 한 내각과 한 외각', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';

    two.makeText('• 정n각형 한 외각 = 360° ÷ n', cx, cy - 20).fill = '#0284c7';
    two.makeText('• 정n각형 한 내각 = 180° - (한 외각)', cx, cy + 15).fill = '#059669';
    two.makeText('예: 정십이각형 한 외각 = 360° ÷ 12 = 30° ➔ 한 내각 = 150°', cx, cy + 55).fill = '#ec4899';
  }

  // --- 3-1: [6.3 개념] n각형 대각선 인터랙티브 연결망 (10대 시뮬레이터 #6) ---
  else if (code === '3-1') {
    const n = ch6SimState.diagSides;
    const totalDiags = (n * (n - 3)) / 2;
    const showAll = ch6SimState.showAllDiags;

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">🕸️ n각형 대각선 인터랙티브 연결망 (교과서 194~195쪽)</span>
          <span id="diag-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            ${n}각형 대각선 총수: ${n}×(${n}-3)÷2 = ${totalDiags}개
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <button class="tool-btn ${n === 4 ? 'active' : ''}" style="font-weight:700;" onclick="setDiagPolygon(4)">사각형 (2개)</button>
          <button class="tool-btn ${n === 5 ? 'active' : ''}" style="font-weight:700;" onclick="setDiagPolygon(5)">오각형 (5개)</button>
          <button class="tool-btn ${n === 6 ? 'active' : ''}" style="font-weight:700;" onclick="setDiagPolygon(6)">육각형 (9개)</button>
          <button class="tool-btn ${n === 8 ? 'active' : ''}" style="font-weight:700;" onclick="setDiagPolygon(8)">팔각형 (20개)</button>
          <button class="tool-btn" style="background:#dcfce7; color:#15803d; font-weight:800; border:1px solid #86efac;" onclick="toggleAllDiags()">
            ${showAll ? '대각선 숨기기' : '✨ 대각선 전체 그리기'}
          </button>
        </div>
      `;
    }

    const r = 90;
    const pts = [];
    for (let i = 0; i < n; i++) {
      const rad = (i * 2 * Math.PI / n) - Math.PI / 2;
      pts.push({ x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) });
    }

    // Boundary lines
    for (let i = 0; i < n; i++) {
      const next = (i + 1) % n;
      two.makeLine(pts[i].x, pts[i].y, pts[next].x, pts[next].y).stroke = '#0284c7';
    }

    // Draw Diagonals
    if (showAll) {
      for (let i = 0; i < n; i++) {
        for (let j = i + 2; j < n; j++) {
          if (i === 0 && j === n - 1) continue; // Boundary
          const d = two.makeLine(pts[i].x, pts[i].y, pts[j].x, pts[j].y);
          d.stroke = '#ec4899'; d.linewidth = 2;
        }
      }
    }

    // Vertices
    pts.forEach(p => {
      const c = two.makeCircle(p.x, p.y, 5.5);
      c.fill = '#4f46e5'; c.stroke = '#fff'; c.linewidth = 2;
    });

    const title = two.makeText(`${n}각형의 대각선의 총 개수 = ${n}(${n}-3)/2 = ${totalDiags}개`, cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';

    const desc = two.makeText(`한 꼭짓점에서 그을 수 있는 대각선 수: ${n} - 3 = ${n-3}개`, cx, cy + 125);
    desc.size = 14; desc.weight = 800; desc.fill = '#ec4899';
  }

  // --- 3-2: [6.3 개념] 대각선 공식 계산 ---
  else if (code === '3-2') {
    const title = two.makeText('대각선의 개수 공식 핵심 정리', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';

    two.makeText('• 한 꼭짓점에서 그을 수 있는 대각선: n - 3 (자기자신과 이웃 2개 제외)', cx, cy - 20).fill = '#0284c7';
    two.makeText('• 대각선의 총 개수: n(n - 3) ÷ 2 (양 끝점에서 2번씩 중복 계산되므로)', cx, cy + 15).fill = '#059669';
    two.makeText('예: 십이각형(n=12) 대각선 수 = 12 × 9 ÷ 2 = 54개', cx, cy + 55).fill = '#ec4899';
  }

  // --- 3-3: [6.3 응용] 대각선 개수를 이용한 다각형 역추적 ---
  else if (code === '3-3') {
    const title = two.makeText('대각선의 개수가 35개인 다각형 구하기', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';

    two.makeText('n(n - 3) / 2 = 35  ➔  n(n - 3) = 70', cx, cy - 20).fill = '#0284c7';
    two.makeText('연속한 두 수의 차가 3이고 곱이 70인 수: 10 × 7 = 70', cx, cy + 15).fill = '#059669';
    two.makeText('따라서 구하는 다각형은 "십각형(n=10)" 입니다!', cx, cy + 55).fill = '#ec4899';
  }

  // --- 4-1: [6.4 개념] 부채꼴 vs 활꼴 인터랙티브 해부도 (10대 시뮬레이터 #7) ---
  else if (code === '4-1') {
    const part = ch6SimState.partSelect;

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">🍕 부채꼴 vs 활꼴 인터랙티브 해부도 (교과서 196~198쪽)</span>
          <span id="part-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            선택 부위: ${part === 'sector' ? '부채꼴 (반지름 2개 + 호)' : (part === 'segment' ? '활꼴 (현 + 호)' : (part === 'arc' ? '호 (원주의 일부분)' : '현 (원 위의 두 점 선분)'))}
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <button class="tool-btn ${part === 'sector' ? 'active' : ''}" style="font-weight:700;" onclick="setCirclePart('sector')">부채꼴 (Sector)</button>
          <button class="tool-btn ${part === 'segment' ? 'active' : ''}" style="font-weight:700;" onclick="setCirclePart('segment')">활꼴 (Segment)</button>
          <button class="tool-btn ${part === 'arc' ? 'active' : ''}" style="font-weight:700;" onclick="setCirclePart('arc')">호 AB (Arc)</button>
          <button class="tool-btn ${part === 'chord' ? 'active' : ''}" style="font-weight:700;" onclick="setCirclePart('chord')">현 AB (Chord)</button>
        </div>
      `;
    }

    const r = 100;
    const rad1 = -Math.PI / 4;
    const rad2 = Math.PI / 3;

    // Full circle faint outline
    const baseC = two.makeCircle(cx, cy, r);
    baseC.fill = 'transparent'; baseC.stroke = '#cbd5e1'; baseC.linewidth = 2;

    const pA = { x: cx + r * Math.cos(rad1), y: cy + r * Math.sin(rad1) };
    const pB = { x: cx + r * Math.cos(rad2), y: cy + r * Math.sin(rad2) };

    if (part === 'sector') {
      const sector = two.makeArcSegment(cx, cy, 0, r, rad1, rad2);
      sector.fill = 'rgba(236, 72, 153, 0.35)'; sector.stroke = '#ec4899'; sector.linewidth = 3;
    } else if (part === 'segment') {
      const segment = two.makePath(pA.x, pA.y, pB.x, pB.y);
      segment.stroke = '#059669'; segment.linewidth = 3;
      // Arc highlight
      const arc = two.makeArcSegment(cx, cy, r - 3, r + 3, rad1, rad2);
      arc.fill = '#059669';
    } else if (part === 'arc') {
      const arc = two.makeArcSegment(cx, cy, r - 3, r + 3, rad1, rad2);
      arc.fill = '#0284c7';
    } else if (part === 'chord') {
      const chord = two.makeLine(pA.x, pA.y, pB.x, pB.y);
      chord.stroke = '#d97706'; chord.linewidth = 4;
    }

    // Radii OA, OB
    two.makeLine(cx, cy, pA.x, pA.y).stroke = '#64748b';
    two.makeLine(cx, cy, pB.x, pB.y).stroke = '#64748b';

    // Points O, A, B
    two.makeCircle(cx, cy, 5).fill = '#1e293b';
    two.makeText('O', cx - 14, cy - 10).fill = '#1e293b';
    two.makeCircle(pA.x, pA.y, 5).fill = '#ec4899';
    two.makeText('A', pA.x + 14, pA.y - 10).fill = '#ec4899';
    two.makeCircle(pB.x, pB.y, 5).fill = '#0284c7';
    two.makeText('B', pB.x + 14, pB.y + 10).fill = '#0284c7';

    const title = two.makeText('원의 구성 요소: 호, 현, 중심각, 부채꼴, 활꼴', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';

    const desc = two.makeText('부채꼴은 두 반지름과 호로 둘러싸인 도형이고, 활꼴은 현과 호로 둘러싸인 도형입니다.', cx, cy + 125);
    desc.size = 13; desc.weight = 700; desc.fill = '#475569';
  }

  // --- 4-2: [6.4 개념] 기호 표기법 (호 AB vs 선분 AB) ---
  else if (code === '4-2') {
    const title = two.makeText('호(Arc)와 현(Chord)의 기호 표기법', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';

    two.makeText('• 호 AB: 원 위의 두 점 A, B를 잇는 곡선 (기호: ⌒AB)', cx, cy - 20).fill = '#0284c7';
    two.makeText('• 현 AB: 원 위의 두 점 A, B를 잇는 선분 (기호: 선분 AB)', cx, cy + 15).fill = '#059669';
    two.makeText('• 활꼴과 부채꼴이 같아질 때: 중심각이 180°인 반원일 때!', cx, cy + 55).fill = '#ec4899';
  }

  // --- 4-3: [6.4 탐구] 중심각 vs 호·넓이·현 정비례 검증기 (10대 시뮬레이터 #8) ---
  else if (code === '4-3') {
    const mult = ch6SimState.propAngleMult; // 1, 2, 3
    const baseAngle = 40;
    const curAngle = baseAngle * mult;

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">⚖️ 중심각 vs 호·넓이·현 정비례 검증기 (교과서 198~201쪽)</span>
          <span id="prop-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            중심각: ${curAngle}° (${mult}배) ➔ 호: ${mult}배, 넓이: ${mult}배 | 현: ${mult}배 아님!
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <button class="tool-btn ${mult === 1 ? 'active' : ''}" style="font-weight:700;" onclick="setPropAngle(1)">1배 (40°)</button>
          <button class="tool-btn ${mult === 2 ? 'active' : ''}" style="font-weight:700;" onclick="setPropAngle(2)">2배 (80°)</button>
          <button class="tool-btn ${mult === 3 ? 'active' : ''}" style="font-weight:700;" onclick="setPropAngle(3)">3배 (120°)</button>
        </div>
      `;
    }

    const r = 90;
    const rad1 = -Math.PI / 2;
    const rad2 = rad1 + (curAngle * Math.PI / 180);

    // Sector
    const sec = two.makeArcSegment(cx, cy, 0, r, rad1, rad2);
    sec.fill = 'rgba(2, 132, 199, 0.3)'; sec.stroke = '#0284c7'; sec.linewidth = 2.5;

    // Chord line
    const p1 = { x: cx + r * Math.cos(rad1), y: cy + r * Math.sin(rad1) };
    const p2 = { x: cx + r * Math.cos(rad2), y: cy + r * Math.sin(rad2) };
    const chord = two.makeLine(p1.x, p1.y, p2.x, p2.y);
    chord.stroke = '#dc2626'; chord.linewidth = 3;

    two.makeText(`중심각 ${curAngle}°`, cx + 35, cy - 20).fill = '#0284c7';
    two.makeText('현 (빨간선)', (p1.x + p2.x) / 2 + 30, (p1.y + p2.y) / 2).fill = '#dc2626';

    const title = two.makeText('핵심 법칙: 호와 넓이는 정비례하지만, 현은 정비례하지 않는다!', cx, 40);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const warning = two.makeText('⚠️ 삼각형에서 두 변의 합은 다른 한 변보다 크므로, 현의 길이는 2배보다 작습니다!', cx, cy + 125);
    warning.size = 13.5; warning.weight = 800; warning.fill = '#dc2626';
  }

  // --- 5-1: [6.5 개념] 부채꼴 부채 펼치기 & 직사각형 변환기 (10대 시뮬레이터 #9) ---
  else if (code === '5-1') {
    const step = ch6SimState.fanUnfoldStep;

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">📐 부채꼴 부채 펼치기 & 직사각형 변환기 (교과서 202~205쪽)</span>
          <span id="unfold-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            ${step === 1 ? '1. 부채꼴 S' : (step === 2 ? '2. 잘게 쪼갠 부채꼴' : '3. 직사각형 변환 (S = 1/2·r·l)')}
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <button class="tool-btn ${step === 1 ? 'active' : ''}" style="font-weight:700;" onclick="setFanUnfoldStep(1)">1. 부채꼴 모양</button>
          <button class="tool-btn ${step === 2 ? 'active' : ''}" style="font-weight:700;" onclick="setFanUnfoldStep(2)">2. 조각 지그재그 분할</button>
          <button class="tool-btn ${step === 3 ? 'active' : ''}" style="font-weight:800; background:#dcfce7; color:#15803d;" onclick="setFanUnfoldStep(3)">3. 직사각형 변환 완료!</button>
        </div>
      `;
    }

    if (step === 1) {
      const sec = two.makeArcSegment(cx, cy + 20, 0, 95, -Math.PI * 0.75, -Math.PI * 0.25);
      sec.fill = 'rgba(236, 72, 153, 0.35)'; sec.stroke = '#ec4899'; sec.linewidth = 3;
      two.makeText('반지름 r', cx - 50, cy - 30).fill = '#1e293b';
      two.makeText('호의 길이 l', cx, cy - 90).fill = '#ec4899';
    } else if (step === 2) {
      // Divided sectors
      for (let i = 0; i < 6; i++) {
        const xOffset = cx - 100 + i * 35;
        const tri = two.makePolygon(xOffset, cy, 30, 3);
        tri.fill = (i % 2 === 0) ? 'rgba(2, 132, 199, 0.4)' : 'rgba(236, 72, 153, 0.4)';
        tri.stroke = '#0284c7';
      }
      two.makeText('부채꼴을 잘게 잘라 엇갈려 맞물립니다...', cx, cy + 60).fill = '#64748b';
    } else if (step === 3) {
      // Rectangle
      const rect = two.makeRectangle(cx, cy, 180, 70);
      rect.fill = 'rgba(5, 150, 105, 0.25)'; rect.stroke = '#059669'; rect.linewidth = 3;
      two.makeText('가로 = 1/2 × l (호의 절반)', cx, cy + 55).fill = '#059669';
      two.makeText('세로 = r', cx - 110, cy).fill = '#059669';
      two.makeText('넓이 S = 가로 × 세로 = (1/2·l) × r = 1/2·r·l ✨', cx, cy - 55).fill = '#15803d';
    }

    const title = two.makeText('부채꼴의 넓이 공식 유도: S = 1/2 · r · l', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';
  }

  // --- 5-2: [6.5 공식] 호와 넓이 계산 ---
  else if (code === '5-2') {
    const title = two.makeText('부채꼴 호의 길이와 넓이 공식 계산', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';

    two.makeText('반지름 r = 6 cm, 중심각 x = 60° 일 때:', cx, cy - 30).fill = '#1e293b';
    two.makeText('• 호의 길이 l = 2π × 6 × (60/360) = 2π cm', cx, cy + 5).fill = '#0284c7';
    two.makeText('• 넓이 S = π × 6² × (60/360) = 6π cm²', cx, cy + 40).fill = '#ec4899';
  }

  // --- 5-3: [6.5 창의융합] 정다각형 테셀레이션 평면 채우기 실험실 (10대 시뮬레이터 #10) ---
  else if (code === '5-3') {
    const type = ch6SimState.tessPolygon; // tri, sq, pent, hex

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">🧩 정다각형 테셀레이션 평면 채우기 (교과서 208~209쪽)</span>
          <span id="tess-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            ${type === 'tri' ? '정삼각형 (60° × 6 = 360° 성공!)' : (type === 'sq' ? '정사각형 (90° × 4 = 360° 성공!)' : (type === 'hex' ? '정육각형 (120° × 3 = 360° 성공!)' : '정오각형 (108° × 3 = 324° 틈새 실패!)'))}
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <button class="tool-btn ${type === 'tri' ? 'active' : ''}" style="font-weight:700;" onclick="setTessPolygon('tri')">정삼각형 (60°)</button>
          <button class="tool-btn ${type === 'sq' ? 'active' : ''}" style="font-weight:700;" onclick="setTessPolygon('sq')">정사각형 (90°)</button>
          <button class="tool-btn ${type === 'pent' ? 'active' : ''}" style="font-weight:800; background:#fee2e2; color:#b91c1c;" onclick="setTessPolygon('pent')">정오각형 (108° 불가)</button>
          <button class="tool-btn ${type === 'hex' ? 'active' : ''}" style="font-weight:700;" onclick="setTessPolygon('hex')">정육각형 (120°)</button>
        </div>
      `;
    }

    // Center meeting point
    two.makeCircle(cx, cy, 5).fill = '#dc2626';

    if (type === 'sq') {
      // 4 squares meeting at center
      const s = 45;
      two.makeRectangle(cx - s/2, cy - s/2, s, s).fill = 'rgba(2, 132, 199, 0.4)';
      two.makeRectangle(cx + s/2, cy - s/2, s, s).fill = 'rgba(5, 150, 105, 0.4)';
      two.makeRectangle(cx - s/2, cy + s/2, s, s).fill = 'rgba(217, 119, 6, 0.4)';
      two.makeRectangle(cx + s/2, cy + s/2, s, s).fill = 'rgba(236, 72, 153, 0.4)';
      two.makeText('90° × 4 = 360° (빈틈없이 포개어짐!)', cx, cy + 70).fill = '#059669';
    } else if (type === 'hex') {
      // 3 hexagons meeting at center
      for (let i = 0; i < 3; i++) {
        const rad = i * 2 * Math.PI / 3;
        const hex = two.makePolygon(cx + 40 * Math.cos(rad), cy + 40 * Math.sin(rad), 30, 6);
        hex.fill = 'rgba(236, 72, 153, 0.3)'; hex.stroke = '#ec4899';
      }
      two.makeText('120° × 3 = 360° (벌집 모양 완벽 채움!)', cx, cy + 70).fill = '#059669';
    } else if (type === 'pent') {
      // 3 pentagons leaving gap 36°
      for (let i = 0; i < 3; i++) {
        const rad = i * 108 * Math.PI / 180;
        const p = two.makePolygon(cx + 40 * Math.cos(rad), cy + 40 * Math.sin(rad), 30, 5);
        p.fill = 'rgba(220, 38, 38, 0.25)'; p.stroke = '#dc2626';
      }
      two.makeText('108° × 3 = 324° ➔ 36° 빈틈 발생으로 테셀레이션 불가!', cx, cy + 75).fill = '#dc2626';
    } else {
      // 6 triangles
      for (let i = 0; i < 6; i++) {
        const rad = i * Math.PI / 3;
        const t = two.makePolygon(cx + 35 * Math.cos(rad), cy + 35 * Math.sin(rad), 25, 3);
        t.fill = 'rgba(2, 132, 199, 0.3)'; t.stroke = '#0284c7';
      }
      two.makeText('60° × 6 = 360° (완벽 채움!)', cx, cy + 70).fill = '#059669';
    }

    const title = two.makeText('평면 테셀레이션 조건: 한 점에 모이는 내각의 합 = 360°', cx, 40);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';
  }

  two.update();
}

// Window interactive helper methods
window.rollPiCircle = function(pos) {
  ch6SimState.rollPos = pos;
  const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
  if (two) setupSubstepSimulator(two, '0-1', document.getElementById('interactive-sim-controller'));
};

window.setTearStep = function(step) {
  if (typeof window.startSmoothLerp === 'function') {
    window.startSmoothLerp('tearStep', () => ch6SimState.tearStep, (v) => {
      ch6SimState.tearStep = Math.round(v);
      const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
      if (two) setupSubstepSimulator(two, '1-1', document.getElementById('interactive-sim-controller'));
    }, step);
  } else {
    ch6SimState.tearStep = step;
    const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
    if (two) setupSubstepSimulator(two, '1-1', document.getElementById('interactive-sim-controller'));
  }
};

window.setBoomerangAngles = function(a, b, c) {
  ch6SimState.boomA = a;
  ch6SimState.boomB = b;
  ch6SimState.boomC = c;
  const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
  if (two) setupSubstepSimulator(two, '1-3', document.getElementById('interactive-sim-controller'));
};

window.setSplitPolygon = function(n) {
  ch6SimState.splitSides = n;
  const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
  if (two) setupSubstepSimulator(two, '2-1', document.getElementById('interactive-sim-controller'));
};

window.shrinkPolygon = function(scale) {
  ch6SimState.shrinkScale = scale;
  const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
  if (two) setupSubstepSimulator(two, '2-3', document.getElementById('interactive-sim-controller'));
};

window.setDiagPolygon = function(n) {
  ch6SimState.diagSides = n;
  ch6SimState.showAllDiags = false;
  const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
  if (two) setupSubstepSimulator(two, '3-1', document.getElementById('interactive-sim-controller'));
};

window.toggleAllDiags = function() {
  ch6SimState.showAllDiags = !ch6SimState.showAllDiags;
  const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
  if (two) setupSubstepSimulator(two, '3-1', document.getElementById('interactive-sim-controller'));
};

window.setCirclePart = function(part) {
  ch6SimState.partSelect = part;
  const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
  if (two) setupSubstepSimulator(two, '4-1', document.getElementById('interactive-sim-controller'));
};

window.setPropAngle = function(mult) {
  if (typeof window.startSmoothLerp === 'function') {
    window.startSmoothLerp('propAngleMult', () => ch6SimState.propAngleMult, (v) => {
      ch6SimState.propAngleMult = Math.round(v);
      const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
      if (two) setupSubstepSimulator(two, '4-3', document.getElementById('interactive-sim-controller'));
    }, mult);
  } else {
    ch6SimState.propAngleMult = mult;
    const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
    if (two) setupSubstepSimulator(two, '4-3', document.getElementById('interactive-sim-controller'));
  }
};

window.setFanUnfoldStep = function(step) {
  if (typeof window.startSmoothLerp === 'function') {
    window.startSmoothLerp('fanUnfoldStep', () => ch6SimState.fanUnfoldStep, (v) => {
      ch6SimState.fanUnfoldStep = Math.round(v);
      const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
      if (two) setupSubstepSimulator(two, '5-1', document.getElementById('interactive-sim-controller'));
    }, step);
  } else {
    ch6SimState.fanUnfoldStep = step;
    const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
    if (two) setupSubstepSimulator(two, '5-1', document.getElementById('interactive-sim-controller'));
  }
};

window.setTessPolygon = function(type) {
  ch6SimState.tessPolygon = type;
  const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
  if (two) setupSubstepSimulator(two, '5-3', document.getElementById('interactive-sim-controller'));
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    setupSubstepSimulatorCode: setupSubstepSimulator.toString()
  };
}
