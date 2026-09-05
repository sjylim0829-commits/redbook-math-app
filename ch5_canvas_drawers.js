// Chapter 5 Interactive Canvas Drawers and Simulators (Two.js)
// Ⅴ. 도형의 기초 10대 인터랙티브 시뮬레이터 및 전 서브스텝 기하 렌더러

const ch5SimState = {
  angleVal: 60,         // 0-1 각도기 각도
  triangleA: 55,        // 0-2 삼각형 두 각
  triangleB: 65,
  prismType: 'prism',   // 1-1 3D 입체도형 타입 (prism: 오각기둥, pyramid: 사각뿔)
  highlightElem: 'all', // 1-1 하이라이트 (vertex, edge, all)
  lineType: 'ray',      // 1-2 직선 반직선 선분
  segLen: 24,           // 1-3 선분 길이
  scissorDeg: 65,       // 2-1 가위 맞꼭지각 각도
  perpDist: 15,         // 2-2 점과 직선 사이의 거리
  lineRel: 'parallel',  // 2-3 평면 위치관계 (intersect, parallel, coincident)
  cuboidEdge: 'AB',     // 2-4 직육면체 기준 모서리 (AB, BC, etc.)
  sliderOffset: 0,      // 3-1 동위각 슬라이딩 오프셋 (0 ~ 1)
  altAngle: 75,         // 3-2 엇각 각도
  showAuxLine: false,   // 3-3 꺾인선 보조선 표시 여부
  foldDeg: 40,          // 3-4 종이접기 각도
  compassStep: 1,       // 4-1 컴퍼스 작도 단계
  parallelStep: 1,      // 4-2 평행선 작도 단계
  triSides: [6, 8, 10], // 4-3 삼각형 세 변
  congruentMode: 'SAS', // 4-4 합동 조건 (SSS, SAS, ASA)
  isSnapped: false,     // 4-4 합동 결합 상태
  mandalaRays: 6,       // 5-2 기하학 문양 꽃잎 수
  mandalaStep: 3        // 5-2 작도 진행 단계
};
window.ch5SimState = ch5SimState;

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

  // --- 0-1: [되짚어 보기 1] 회전 각도기와 각 분류기 (10대 시뮬레이터 #1) ---
  if (code === '0-1') {
    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">📐 회전 각도기와 각 분류기 (교과서 134쪽)</span>
          <span id="protractor-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            현재 각도: ${ch5SimState.angleVal}° (${getAngleType(ch5SimState.angleVal)})
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <button class="tool-btn" style="background:#f0fdf4; color:#166534; font-weight:700;" onclick="setAngle(35)">35° (예각)</button>
          <button class="tool-btn" style="background:#fef3c7; color:#92400e; font-weight:800;" onclick="setAngle(90)">90° (직각)</button>
          <button class="tool-btn" style="background:#eff6ff; color:#1e40af; font-weight:700;" onclick="setAngle(130)">130° (둔각)</button>
          <button class="tool-btn" style="background:#fdf2f8; color:#9d174d; font-weight:700;" onclick="setAngle(180)">180° (평각)</button>
          <div style="display:flex; align-items:center; gap:6px; margin-left:auto;">
            <label style="font-size:0.8rem; font-weight:700; color:#475569;">각도 조절:</label>
            <input type="range" min="10" max="180" step="5" value="${ch5SimState.angleVal}" oninput="setAngle(parseInt(this.value))" style="width:110px; cursor:pointer;">
          </div>
        </div>
      `;
    }

    // Draw Protractor Semi-Circle
    const r = 160;
    const baseLine = two.makeLine(cx - r - 20, cy + 40, cx + r + 20, cy + 40);
    baseLine.stroke = '#94a3b8'; baseLine.linewidth = 2;

    // Protractor body
    const body = two.makeArcSegment(cx, cy + 40, 30, r, Math.PI, 0);
    body.fill = 'rgba(224, 242, 254, 0.5)';
    body.stroke = '#0284c7'; body.linewidth = 2;

    // Center point O
    const ptO = two.makeCircle(cx, cy + 40, 5);
    ptO.fill = '#1e293b'; ptO.stroke = '#fff'; ptO.linewidth = 2;
    const lblO = two.makeText('O', cx, cy + 58);
    lblO.size = 13; lblO.weight = 800; lblO.fill = '#1e293b';

    // Base Ray OA (East, 0 deg)
    const rayA = two.makeLine(cx, cy + 40, cx + r + 15, cy + 40);
    rayA.stroke = '#0284c7'; rayA.linewidth = 3;
    const ptA = two.makeCircle(cx + r + 15, cy + 40, 4); ptA.fill = '#0284c7';
    const lblA = two.makeText('A', cx + r + 28, cy + 40); lblA.size = 14; lblA.weight = 800; lblA.fill = '#0284c7';

    // Dynamic Rotating Ray OB
    const rad = (ch5SimState.angleVal * Math.PI) / 180;
    const bx = cx + (r + 15) * Math.cos(Math.PI - rad);
    const by = cy + 40 - (r + 15) * Math.sin(Math.PI - rad);
    const rayB = two.makeLine(cx, cy + 40, bx, by);
    rayB.stroke = '#ec4899'; rayB.linewidth = 3.5;
    const ptB = two.makeCircle(bx, by, 4); ptB.fill = '#ec4899';
    const lblB = two.makeText('B', bx - 10, by - 10); lblB.size = 14; lblB.weight = 800; lblB.fill = '#ec4899';

    // Angle Arc Sector
    const arcSector = two.makeArcSegment(cx, cy + 40, 0, 50, Math.PI - rad, Math.PI);
    arcSector.fill = 'rgba(236, 72, 153, 0.25)'; arcSector.stroke = '#ec4899'; arcSector.linewidth = 1.5;

    // Angle value text
    const midRad = Math.PI - rad / 2;
    const tx = cx + 80 * Math.cos(midRad);
    const ty = cy + 40 - 80 * Math.sin(midRad);
    const angTxt = two.makeText(`${ch5SimState.angleVal}°`, tx, ty);
    angTxt.size = 18; angTxt.weight = 800; angTxt.fill = '#ec4899';

    // Category Label
    const typeTxt = two.makeText(`[${getAngleType(ch5SimState.angleVal)}]`, cx, cy - 140);
    typeTxt.size = 20; typeTxt.weight = 800;
    typeTxt.fill = ch5SimState.angleVal < 90 ? '#166534' : (ch5SimState.angleVal === 90 ? '#d97706' : (ch5SimState.angleVal === 180 ? '#9d174d' : '#1d4ed8'));

    const desc = two.makeText(getAngleDesc(ch5SimState.angleVal), cx, cy - 110);
    desc.size = 13; desc.weight = 600; desc.fill = '#64748b';
  }

  // --- 0-2: [되짚어 보기 2] 삼각형 내각의 합 180° ---
  else if (code === '0-2') {
    const a1 = ch5SimState.triangleA;
    const a2 = ch5SimState.triangleB;
    const a3 = 180 - a1 - a2;

    const pA = { x: cx, y: cy - 90 };
    const pB = { x: cx - 140, y: cy + 70 };
    const pC = { x: cx + 130, y: cy + 70 };

    const tri = two.makePath(pA.x, pA.y, pB.x, pB.y, pC.x, pC.y, true);
    tri.fill = 'rgba(224, 242, 254, 0.4)'; tri.stroke = '#0284c7'; tri.linewidth = 3;

    // Angle Arcs
    const arcB = two.makeArcSegment(pB.x, pB.y, 0, 32, -0.8, 0); arcB.fill = 'rgba(5, 150, 105, 0.3)'; arcB.stroke = '#059669';
    const arcC = two.makeArcSegment(pC.x, pC.y, 0, 32, Math.PI, Math.PI + 0.8); arcC.fill = 'rgba(217, 119, 6, 0.3)'; arcC.stroke = '#d97706';
    const arcA = two.makeArcSegment(pA.x, pA.y, 0, 30, 0.8, 2.3); arcA.fill = 'rgba(236, 72, 153, 0.3)'; arcA.stroke = '#ec4899';

    const tB = two.makeText(`${a1}°`, pB.x + 42, pB.y - 12); tB.size = 14; tB.weight = 800; tB.fill = '#059669';
    const tC = two.makeText(`${a2}°`, pC.x - 42, pC.y - 12); tC.size = 14; tC.weight = 800; tC.fill = '#d97706';
    const tA = two.makeText(`∠A = ?`, pA.x, pA.y + 40); tA.size = 16; tA.weight = 800; tA.fill = '#ec4899';

    const title = two.makeText('삼각형의 세 내각의 크기의 합 = 180°', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';

    const formula = two.makeText(`∠A = 180° - (${a1}° + ${a2}°) = ${a3}°`, cx, cy + 125);
    formula.size = 16; formula.weight = 800; formula.fill = '#4f46e5';
  }

  // --- 0-3: [되짚어 보기 3] 합동인 도형의 성질 ---
  else if (code === '0-3') {
    const t1 = two.makePolygon(cx - 95, cy, 65, 3);
    t1.fill = 'rgba(224, 242, 254, 0.7)'; t1.stroke = '#0284c7'; t1.linewidth = 2.5;

    const t2 = two.makePolygon(cx + 95, cy, 65, 3);
    t2.fill = 'rgba(220, 252, 231, 0.7)'; t2.stroke = '#059669'; t2.linewidth = 2.5;

    const eqSign = two.makeText('≡', cx, cy - 5);
    eqSign.size = 32; eqSign.weight = 800; eqSign.fill = '#ec4899';

    const l1 = two.makeText('△ABC', cx - 95, cy + 65); l1.size = 15; l1.weight = 800; l1.fill = '#0284c7';
    const l2 = two.makeText('△DEF', cx + 95, cy + 65); l2.size = 15; l2.weight = 800; l2.fill = '#059669';

    const title = two.makeText('합동(≡): 완전히 포개어지는 도형', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';

    const desc = two.makeText('대응변의 길이가 같고, 대응각의 크기가 각각 서로 같다!', cx, cy + 115);
    desc.size = 14; desc.weight = 700; desc.fill = '#475569';
  }

  // --- 1-1: [5.1 개념] 입체도형 교점 & 교선 3D 분해기 (10대 시뮬레이터 #2) ---
  else if (code === '1-1') {
    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">💎 입체도형 교점 & 교선 3D 분해기 (교과서 136~137쪽)</span>
          <span id="prism-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            ${ch5SimState.prismType === 'prism' ? '오각기둥 (꼭짓점 10, 모서리 15)' : '사각뿔 (꼭짓점 5, 모서리 8)'}
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button class="tool-btn ${ch5SimState.prismType === 'prism' ? 'active' : ''}" style="font-weight:700;" onclick="setPrismModel('prism')">오각기둥 모델</button>
          <button class="tool-btn ${ch5SimState.prismType === 'pyramid' ? 'active' : ''}" style="font-weight:700;" onclick="setPrismModel('pyramid')">사각뿔 모델</button>
          <button class="tool-btn" style="background:#fef3c7; color:#92400e; font-weight:800;" onclick="highlightPrismPart('vertex')">🔴 교점(꼭짓점) 강조</button>
          <button class="tool-btn" style="background:#e0f2fe; color:#0369a1; font-weight:800;" onclick="highlightPrismPart('edge')">🔵 교선(모서리) 강조</button>
          <button class="tool-btn" style="background:#f1f5f9; color:#475569; font-weight:700;" onclick="highlightPrismPart('all')">전체 보기</button>
        </div>
      `;
    }

    if (ch5SimState.prismType === 'prism') {
      // Pentagonal Prism 3D projection
      const topR = 85, botR = 85;
      const topY = cy - 70, botY = cy + 70;
      const topPts = [];
      const botPts = [];

      for (let i = 0; i < 5; i++) {
        const rad = (i * 2 * Math.PI / 5) - Math.PI / 2;
        topPts.push({ x: cx + topR * Math.cos(rad) * 1.1, y: topY + topR * Math.sin(rad) * 0.45 });
        botPts.push({ x: cx + botR * Math.cos(rad) * 1.1, y: botY + botR * Math.sin(rad) * 0.45 });
      }

      // Draw Edges (교선)
      const edgeColor = ch5SimState.highlightElem === 'edge' ? '#0284c7' : '#94a3b8';
      const edgeWidth = ch5SimState.highlightElem === 'edge' ? 3.5 : 2;

      // Top polygon edges
      for (let i = 0; i < 5; i++) {
        const next = (i + 1) % 5;
        const line = two.makeLine(topPts[i].x, topPts[i].y, topPts[next].x, topPts[next].y);
        line.stroke = edgeColor; line.linewidth = edgeWidth;
      }
      // Bottom polygon edges
      for (let i = 0; i < 5; i++) {
        const next = (i + 1) % 5;
        const line = two.makeLine(botPts[i].x, botPts[i].y, botPts[next].x, botPts[next].y);
        line.stroke = edgeColor; line.linewidth = edgeWidth;
      }
      // Pillar edges
      for (let i = 0; i < 5; i++) {
        const line = two.makeLine(topPts[i].x, topPts[i].y, botPts[i].x, botPts[i].y);
        line.stroke = edgeColor; line.linewidth = edgeWidth;
      }

      // Draw Vertices (교점)
      const vColor = ch5SimState.highlightElem === 'vertex' ? '#ef4444' : '#4f46e5';
      const vRadius = ch5SimState.highlightElem === 'vertex' ? 6.5 : 4.5;

      topPts.concat(botPts).forEach((pt, idx) => {
        const circle = two.makeCircle(pt.x, pt.y, vRadius);
        circle.fill = vColor; circle.stroke = '#ffffff'; circle.linewidth = 2;
      });

      const title = two.makeText('오각기둥: 교점(꼭짓점) 10개, 교선(모서리) 15개', cx, 40);
      title.size = 15; title.weight = 800; title.fill = '#1e293b';

      const desc = two.makeText('선과 선, 선과 면이 만나는 점 = 교점 | 면과 면이 만나는 선 = 교선', cx, cy + 130);
      desc.size = 13; desc.weight = 700; desc.fill = '#475569';
    } else {
      // Pyramid model
      const topPt = { x: cx, y: cy - 90 };
      const basePts = [
        { x: cx - 90, y: cy + 40 },
        { x: cx + 20, y: cy + 30 },
        { x: cx + 100, y: cy + 60 },
        { x: cx - 10, y: cy + 80 }
      ];

      const edgeColor = ch5SimState.highlightElem === 'edge' ? '#0284c7' : '#94a3b8';
      const edgeWidth = ch5SimState.highlightElem === 'edge' ? 3.5 : 2;

      // Base edges
      for (let i = 0; i < 4; i++) {
        const next = (i + 1) % 4;
        const line = two.makeLine(basePts[i].x, basePts[i].y, basePts[next].x, basePts[next].y);
        line.stroke = edgeColor; line.linewidth = edgeWidth;
      }
      // Slanted edges
      basePts.forEach(pt => {
        const line = two.makeLine(topPt.x, topPt.y, pt.x, pt.y);
        line.stroke = edgeColor; line.linewidth = edgeWidth;
      });

      // Vertices
      const vColor = ch5SimState.highlightElem === 'vertex' ? '#ef4444' : '#4f46e5';
      const vRadius = ch5SimState.highlightElem === 'vertex' ? 6.5 : 4.5;

      [topPt].concat(basePts).forEach(pt => {
        const c = two.makeCircle(pt.x, pt.y, vRadius);
        c.fill = vColor; c.stroke = '#fff'; c.linewidth = 2;
      });

      const title = two.makeText('사각뿔: 교점(꼭짓점) 5개, 교선(모서리) 8개', cx, 40);
      title.size = 15; title.weight = 800; title.fill = '#1e293b';
      const desc = two.makeText('교점은 꼭짓점, 교선은 모서리의 개수와 정확히 일치합니다!', cx, cy + 130);
      desc.size = 13; desc.weight = 700; desc.fill = '#475569';
    }
  }

  // --- 1-2: [5.1 개념] 직선, 반직선, 선분의 기호 표기 ---
  else if (code === '1-2') {
    const y1 = cy - 60, y2 = cy + 10, y3 = cy + 80;

    // 1. Line AB
    const l1 = two.makeLine(cx - 150, y1, cx + 150, y1); l1.stroke = '#0284c7'; l1.linewidth = 2.5;
    const a1 = two.makeCircle(cx - 80, y1, 5); a1.fill = '#0284c7';
    const b1 = two.makeCircle(cx + 80, y1, 5); b1.fill = '#0284c7';
    two.makeText('A', cx - 80, y1 - 16).fill = '#0284c7';
    two.makeText('B', cx + 80, y1 - 16).fill = '#0284c7';
    const tLine = two.makeText('직선 AB = 직선 BA (양쪽으로 끝없이 연장)', cx, y1 + 22);
    tLine.size = 13; tLine.weight = 700; tLine.fill = '#1e293b';

    // 2. Ray AB
    const l2 = two.makeLine(cx - 80, y2, cx + 150, y2); l2.stroke = '#ec4899'; l2.linewidth = 3;
    const a2 = two.makeCircle(cx - 80, y2, 6); a2.fill = '#ec4899'; // start point
    const b2 = two.makeCircle(cx + 80, y2, 4); b2.fill = '#ec4899';
    two.makeText('시작점 A', cx - 80, y2 - 16).fill = '#ec4899';
    two.makeText('방향 B', cx + 80, y2 - 16).fill = '#ec4899';
    const tRay = two.makeText('반직선 AB ≠ 반직선 BA (시작점과 방향이 모두 같아야 동일!)', cx, y2 + 22);
    tRay.size = 13; tRay.weight = 700; tRay.fill = '#dc2626';

    // 3. Segment AB
    const l3 = two.makeLine(cx - 80, y3, cx + 80, y3); l3.stroke = '#059669'; l3.linewidth = 4;
    const a3 = two.makeCircle(cx - 80, y3, 6); a3.fill = '#059669';
    const b3 = two.makeCircle(cx + 80, y3, 6); b3.fill = '#059669';
    two.makeText('A', cx - 80, y3 - 16).fill = '#059669';
    two.makeText('B', cx + 80, y3 - 16).fill = '#059669';
    const tSeg = two.makeText('선분 AB = 선분 BA (점 A에서 B까지의 유한한 거리)', cx, y3 + 22);
    tSeg.size = 13; tSeg.weight = 700; tSeg.fill = '#059669';
  }

  // --- 1-3: [5.1 개념] 선분 2등분·4등분 중점 슬라이더 (10대 시뮬레이터 #3) ---
  else if (code === '1-3') {
    const totalLen = ch5SimState.segLen;
    const am = totalLen / 2;
    const an = am + (totalLen - am) / 2;

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">📏 선분 2등분·4등분 중점 슬라이더 (교과서 139~140쪽)</span>
          <span id="midpoint-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            AB = ${totalLen} cm | AM = ${am} cm | AN = ${an} cm
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <button class="tool-btn" style="background:#f0fdf4; color:#166534; font-weight:700;" onclick="setSegLength(16)">AB = 16 cm</button>
          <button class="tool-btn" style="background:#eff6ff; color:#1e40af; font-weight:800;" onclick="setSegLength(24)">AB = 24 cm (기본)</button>
          <button class="tool-btn" style="background:#fef3c7; color:#92400e; font-weight:700;" onclick="setSegLength(32)">AB = 32 cm</button>
        </div>
      `;
    }

    const scale = 11;
    const pAx = cx - (totalLen * scale) / 2;
    const pBx = cx + (totalLen * scale) / 2;
    const pMx = cx; // Midpoint M
    const pNx = pMx + (pBx - pMx) / 2; // Midpoint of MB is N
    const segY = cy;

    // Main line segment AB
    const seg = two.makeLine(pAx, segY, pBx, segY);
    seg.stroke = '#334155'; seg.linewidth = 4;

    // Segments AM, MN, NB highlight
    const segAM = two.makeLine(pAx, segY, pMx, segY); segAM.stroke = '#0284c7'; segAM.linewidth = 5;
    const segMN = two.makeLine(pMx, segY, pNx, segY); segMN.stroke = '#ec4899'; segMN.linewidth = 5;
    const segNB = two.makeLine(pNx, segY, pBx, segY); segNB.stroke = '#059669'; segNB.linewidth = 5;

    // Points
    [
      { x: pAx, label: 'A', col: '#0284c7' },
      { x: pMx, label: 'M (중점)', col: '#ec4899' },
      { x: pNx, label: 'N (MB의 중점)', col: '#059669' },
      { x: pBx, label: 'B', col: '#334155' }
    ].forEach(pt => {
      const c = two.makeCircle(pt.x, segY, 6.5);
      c.fill = pt.col; c.stroke = '#fff'; c.linewidth = 2;
      const t = two.makeText(pt.label, pt.x, segY - 20);
      t.size = 14; t.weight = 800; t.fill = pt.col;
    });

    // Distance indicators
    const dAM = two.makeText(`${am} cm`, (pAx + pMx) / 2, segY + 28); dAM.size = 13; dAM.weight = 800; dAM.fill = '#0284c7';
    const dMN = two.makeText(`${am / 2} cm`, (pMx + pNx) / 2, segY + 28); dMN.size = 13; dMN.weight = 800; dMN.fill = '#ec4899';
    const dNB = two.makeText(`${am / 2} cm`, (pNx + pBx) / 2, segY + 28); dNB.size = 13; dNB.weight = 800; dNB.fill = '#059669';

    const title = two.makeText(`선분 AB = ${totalLen} cm 일 때의 중점 관계`, cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';

    const totalLbl = two.makeText(`전체 길이: AB = ${totalLen} cm | AN = AM + MN = ${am} + ${am/2} = ${an} cm`, cx, cy + 85);
    totalLbl.size = 15; totalLbl.weight = 800; totalLbl.fill = '#4f46e5';
  }

  // --- 1-4: [5.1 확인] 한 평면 위 세 점과 선분, 반직선 개수 ---
  else if (code === '1-4') {
    const pts = [
      { x: cx - 110, y: cy + 40, name: 'A' },
      { x: cx + 110, y: cy + 40, name: 'B' },
      { x: cx, y: cy - 70, name: 'C' }
    ];

    // Triangle lines
    for (let i = 0; i < 3; i++) {
      const next = (i + 1) % 3;
      const l = two.makeLine(pts[i].x, pts[i].y, pts[next].x, pts[next].y);
      l.stroke = '#0284c7'; l.linewidth = 2.5;
    }

    pts.forEach(p => {
      const c = two.makeCircle(p.x, p.y, 7);
      c.fill = '#ec4899'; c.stroke = '#fff'; c.linewidth = 2;
      const t = two.makeText(p.name, p.x, p.y - 18);
      t.size = 16; t.weight = 800; t.fill = '#ec4899';
    });

    const title = two.makeText('한 직선 위에 있지 않은 세 점 A, B, C', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';

    const info = two.makeText('• 서로 다른 직선: 3개 (AB, BC, CA)', cx, cy + 90);
    info.size = 14; info.weight = 700; info.fill = '#334155';
    const info2 = two.makeText('• 서로 다른 반직선: 6개 (AB, BA, BC, CB, CA, AC)', cx, cy + 115);
    info2.size = 14; info2.weight = 700; info2.fill = '#059669';
  }

  // --- 2-1: [5.2 개념] 가위 회전 맞꼭지각 대칭 실험실 (10대 시뮬레이터 #4) ---
  else if (code === '2-1') {
    const deg = ch5SimState.scissorDeg;
    const supp = 180 - deg;

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">✂️ 가위 회전 맞꼭지각 대칭 실험실 (교과서 144~145쪽)</span>
          <span id="vertical-angle-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            맞꼭지각: ∠a = ∠c = ${deg}° | 이웃각: ∠b = ∠d = ${supp}°
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <button class="tool-btn" style="background:#fdf2f8; color:#be185d; font-weight:700;" onclick="setScissorAngle(45)">45° 실험</button>
          <button class="tool-btn" style="background:#eff6ff; color:#1e40af; font-weight:800;" onclick="setScissorAngle(65)">65° 실험 (기본)</button>
          <button class="tool-btn" style="background:#fef3c7; color:#92400e; font-weight:700;" onclick="setScissorAngle(90)">90° (직교)</button>
          <button class="tool-btn" style="background:#f0fdf4; color:#166534; font-weight:700;" onclick="setScissorAngle(115)">115° 실험</button>
          <div style="display:flex; align-items:center; gap:6px; margin-left:auto;">
            <label style="font-size:0.8rem; font-weight:700; color:#475569;">각도 슬라이더:</label>
            <input type="range" min="20" max="160" step="5" value="${deg}" oninput="setScissorAngle(parseInt(this.value))" style="width:110px; cursor:pointer;">
          </div>
        </div>
      `;
    }

    const len = 160;
    const rad1 = (deg * Math.PI / 180) / 2;
    const rad2 = -rad1;

    // Line 1 (slope +rad1)
    const l1 = two.makeLine(cx - len * Math.cos(rad1), cy - len * Math.sin(rad1), cx + len * Math.cos(rad1), cy + len * Math.sin(rad1));
    l1.stroke = '#0284c7'; l1.linewidth = 3.5;

    // Line 2 (slope -rad1)
    const l2 = two.makeLine(cx - len * Math.cos(rad2), cy - len * Math.sin(rad2), cx + len * Math.cos(rad2), cy + len * Math.sin(rad2));
    l2.stroke = '#4f46e5'; l2.linewidth = 3.5;

    // Intersection Center O
    const ptO = two.makeCircle(cx, cy, 6); ptO.fill = '#1e293b'; ptO.stroke = '#fff'; ptO.linewidth = 2;

    // Angle Arcs
    // Left & Right (맞꼭지각 deg)
    const arcLeft = two.makeArcSegment(cx, cy, 0, 45, Math.PI - rad1, Math.PI + rad1);
    arcLeft.fill = 'rgba(236, 72, 153, 0.3)'; arcLeft.stroke = '#ec4899'; arcLeft.linewidth = 2;

    const arcRight = two.makeArcSegment(cx, cy, 0, 45, -rad1, rad1);
    arcRight.fill = 'rgba(236, 72, 153, 0.3)'; arcRight.stroke = '#ec4899'; arcRight.linewidth = 2;

    // Top & Bottom (이웃각 supp)
    const arcTop = two.makeArcSegment(cx, cy, 0, 40, -Math.PI + rad1, -rad1);
    arcTop.fill = 'rgba(5, 150, 105, 0.2)'; arcTop.stroke = '#059669'; arcTop.linewidth = 1.5;

    // Labels
    const tA = two.makeText(`∠a = ${deg}°`, cx - 75, cy); tA.size = 15; tA.weight = 800; tA.fill = '#ec4899';
    const tC = two.makeText(`∠c = ${deg}°`, cx + 75, cy); tC.size = 15; tC.weight = 800; tC.fill = '#ec4899';
    const tB = two.makeText(`∠b = ${supp}°`, cx, cy - 65); tB.size = 14; tB.weight = 700; tB.fill = '#059669';
    const tD = two.makeText(`∠d = ${supp}°`, cx, cy + 65); tD.size = 14; tD.weight = 700; tD.fill = '#059669';

    const title = two.makeText('맞꼭지각의 성질: 마주 보는 두 각의 크기는 항상 같다!', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';

    const proof = two.makeText(`∠a + ∠b = 180° 이고 ∠c + ∠b = 180° 이므로  ∴ ∠a = ∠c`, cx, cy + 125);
    proof.size = 14; proof.weight = 800; proof.fill = '#be185d';
  }

  // --- 2-2: [5.2 개념] 직교와 수직이등분선 & 수선의 발 ---
  else if (code === '2-2') {
    // Horizontal line l
    const l = two.makeLine(cx - 150, cy + 30, cx + 150, cy + 30); l.stroke = '#334155'; l.linewidth = 3;
    two.makeText('직선 l', cx + 165, cy + 30).fill = '#334155';

    // Point P above
    const pP = { x: cx, y: cy - 70 };
    const ptP = two.makeCircle(pP.x, pP.y, 6); ptP.fill = '#ec4899'; ptP.stroke = '#fff'; ptP.linewidth = 2;
    two.makeText('점 P', pP.x, pP.y - 16).fill = '#ec4899';

    // Perpendicular line PH
    const linePH = two.makeLine(pP.x, pP.y, cx, cy + 30); linePH.stroke = '#0284c7'; linePH.linewidth = 2.5;

    // Foot of perpendicular H
    const ptH = two.makeCircle(cx, cy + 30, 5); ptH.fill = '#0284c7';
    two.makeText('수선의 발 H', cx, cy + 50).fill = '#0284c7';

    // Right angle mark
    const sq = two.makePath(cx, cy + 15, cx + 15, cy + 15, cx + 15, cy + 30);
    sq.fill = 'transparent'; sq.stroke = '#dc2626'; sq.linewidth = 2;

    const dText = two.makeText('점 P와 직선 l 사이의 거리 = 선분 PH의 길이', cx, cy - 10);
    dText.size = 13; dText.weight = 800; dText.fill = '#0284c7';

    const title = two.makeText('수직(직교, ⊥)과 수선의 발', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';
  }

  // --- 2-3: [5.2 개념] 평면에서 두 직선의 위치 관계 ---
  else if (code === '2-3') {
    // 3 panels for 1. Intersect, 2. Parallel, 3. Coincident
    const x1 = cx - 140, x2 = cx, x3 = cx + 140;

    // Panel 1: Intersect
    two.makeLine(x1 - 40, cy - 30, x1 + 40, cy + 30).stroke = '#0284c7';
    two.makeLine(x1 - 40, cy + 30, x1 + 40, cy - 30).stroke = '#ec4899';
    two.makeCircle(x1, cy, 4).fill = '#1e293b';
    two.makeText('1. 한 점에서 만난다', x1, cy + 55).fill = '#1e293b';
    two.makeText('(교점 1개)', x1, cy + 75).fill = '#64748b';

    // Panel 2: Parallel
    two.makeLine(x2 - 45, cy - 15, x2 + 45, cy - 15).stroke = '#0284c7';
    two.makeLine(x2 - 45, cy + 15, x2 + 45, cy + 15).stroke = '#059669';
    two.makeText('2. 평행하다 (l // m)', x2, cy + 55).fill = '#059669';
    two.makeText('(교점 없음, 만나지 않음)', x2, cy + 75).fill = '#64748b';

    // Panel 3: Coincident
    const lineCoin = two.makeLine(x3 - 45, cy, x3 + 45, cy); lineCoin.stroke = '#8b5cf6'; lineCoin.linewidth = 4;
    two.makeText('3. 일치한다', x3, cy + 55).fill = '#8b5cf6';
    two.makeText('(교점 무수히 많음)', x3, cy + 75).fill = '#64748b';

    const title = two.makeText('한 평면에서 두 직선의 3가지 위치 관계', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';
  }

  // --- 2-4: [5.2 개념] 3D 직육면체 꼬인 위치 탐색기 (10대 시뮬레이터 #5) ---
  else if (code === '2-4') {
    const curEdge = ch5SimState.cuboidEdge;

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">📦 3D 직육면체 꼬인 위치 탐색기 (교과서 150~152쪽)</span>
          <span id="cuboid-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            기준 모서리: ${curEdge} (꼬인 위치: 4개)
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <button class="tool-btn ${curEdge === 'AB' ? 'active' : ''}" style="font-weight:700;" onclick="setCuboidEdge('AB')">모서리 AB 기준</button>
          <button class="tool-btn ${curEdge === 'BC' ? 'active' : ''}" style="font-weight:700;" onclick="setCuboidEdge('BC')">모서리 BC 기준</button>
          <button class="tool-btn ${curEdge === 'AE' ? 'active' : ''}" style="font-weight:700;" onclick="setCuboidEdge('AE')">모서리 AE 기준</button>
          <span style="font-size:0.8rem; font-weight:700; color:#475569; margin-left:8px;">
            범례: <b style="color:#2563eb;">기준</b> | <b style="color:#16a34a;">평행</b> | <b style="color:#d97706;">만남</b> | <b style="color:#dc2626;">꼬인 위치</b>
          </span>
        </div>
      `;
    }

    // Cuboid 3D Isometric Projection Points
    const dx = 100, dy = 70, dz = 70;
    const vA = { x: cx - dx, y: cy - dy, name: 'A' };
    const vB = { x: cx + 10, y: cy - dy, name: 'B' };
    const vC = { x: cx + dx, y: cy - dy + 25, name: 'C' };
    const vD = { x: cx - dx + 90, y: cy - dy + 25, name: 'D' };

    const vE = { x: vA.x, y: vA.y + dz + 30, name: 'E' };
    const vF = { x: vB.x, y: vB.y + dz + 30, name: 'F' };
    const vG = { x: vC.x, y: vC.y + dz + 30, name: 'G' };
    const vH = { x: vD.x, y: vD.y + dz + 30, name: 'H' };

    const cuboidEdges = [
      { name: 'AB', p1: vA, p2: vB },
      { name: 'BC', p1: vB, p2: vC },
      { name: 'CD', p1: vC, p2: vD },
      { name: 'DA', p1: vD, p2: vA },
      { name: 'EF', p1: vE, p2: vF },
      { name: 'FG', p1: vF, p2: vG },
      { name: 'GH', p1: vG, p2: vH },
      { name: 'HE', p1: vH, p2: vE },
      { name: 'AE', p1: vA, p2: vE },
      { name: 'BF', p1: vB, p2: vF },
      { name: 'CG', p1: vC, p2: vG },
      { name: 'DH', p1: vD, p2: vH }
    ];

    // Relations for selected edge
    let rels = {
      base: ['AB'],
      parallel: ['CD', 'EF', 'GH'],
      intersect: ['BC', 'DA', 'AE', 'BF'],
      skew: ['CG', 'DH', 'FG', 'HE']
    };

    if (curEdge === 'BC') {
      rels = {
        base: ['BC'],
        parallel: ['AD', 'FG', 'EH'],
        intersect: ['AB', 'CD', 'BF', 'CG'],
        skew: ['AE', 'DH', 'EF', 'GH']
      };
    } else if (curEdge === 'AE') {
      rels = {
        base: ['AE'],
        parallel: ['BF', 'CG', 'DH'],
        intersect: ['AB', 'AD', 'EF', 'EH'],
        skew: ['BC', 'CD', 'FG', 'GH']
      };
    }

    cuboidEdges.forEach(e => {
      let strokeCol = '#94a3b8';
      let lw = 2;
      if (rels.base.includes(e.name)) {
        strokeCol = '#2563eb'; lw = 5;
      } else if (rels.parallel.includes(e.name)) {
        strokeCol = '#16a34a'; lw = 3.5;
      } else if (rels.intersect.includes(e.name)) {
        strokeCol = '#d97706'; lw = 3;
      } else if (rels.skew.includes(e.name)) {
        strokeCol = '#dc2626'; lw = 4;
      }

      const l = two.makeLine(e.p1.x, e.p1.y, e.p2.x, e.p2.y);
      l.stroke = strokeCol; l.linewidth = lw;
    });

    // Draw vertex markers & labels
    [vA, vB, vC, vD, vE, vF, vG, vH].forEach(pt => {
      const c = two.makeCircle(pt.x, pt.y, 4.5);
      c.fill = '#1e293b'; c.stroke = '#fff'; c.linewidth = 1.5;
      const t = two.makeText(pt.name, pt.x - 12, pt.y - 8);
      t.size = 13; t.weight = 800; t.fill = '#1e293b';
    });

    const title = two.makeText('공간에서 두 직선의 위치 관계: 꼬인 위치(Skew)', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';

    const desc = two.makeText('꼬인 위치: 공간에서 만나지도 않고 평행하지도 않은 두 직선!', cx, cy + 130);
    desc.size = 14; desc.weight = 800; desc.fill = '#dc2626';
  }

  // --- 3-1: [5.3 개념] 평행선 동위각 & 엇각 슬라이딩 투영기 (10대 시뮬레이터 #6) ---
  else if (code === '3-1') {
    const offset = ch5SimState.sliderOffset; // 0 to 1

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">📐 평행선 동위각 슬라이딩 투영기 (교과서 154~156쪽)</span>
          <span id="parallel-slide-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            ${offset === 1 ? '✨ 동위각 완벽 포개어짐 (크기 일치!)' : '동위각 슬라이딩 애니메이션'}
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <button class="tool-btn" style="background:#f0fdf4; color:#166534; font-weight:800;" onclick="slideCorrAngle(0)">1. 직선 l 위 동위각</button>
          <button class="tool-btn" style="background:#eff6ff; color:#1e40af; font-weight:800;" onclick="slideCorrAngle(0.5)">2. 슬라이딩 중 (이동)</button>
          <button class="tool-btn" style="background:#fdf2f8; color:#be185d; font-weight:800;" onclick="slideCorrAngle(1)">3. 직선 m 위 포개어짐 (일치!)</button>
        </div>
      `;
    }

    const yL = cy - 45;
    const yM = cy + 55;

    // Parallel lines l and m
    const lineL = two.makeLine(cx - 160, yL, cx + 160, yL); lineL.stroke = '#0284c7'; lineL.linewidth = 3.5;
    const lineM = two.makeLine(cx - 160, yM, cx + 160, yM); lineM.stroke = '#0284c7'; lineM.linewidth = 3.5;
    two.makeText('l', cx + 175, yL).fill = '#0284c7';
    two.makeText('m', cx + 175, yM).fill = '#0284c7';

    // Transversal line n (slope)
    const lineN = two.makeLine(cx - 70, yL - 60, cx + 70, yM + 60); lineN.stroke = '#4f46e5'; lineN.linewidth = 3;
    two.makeText('n', cx + 85, yM + 60).fill = '#4f46e5';

    // Intersection points
    const p1 = { x: cx - 15, y: yL };
    const p2 = { x: cx + 15, y: yM };

    // Moving corresponding angle fan
    const curX = p1.x + (p2.x - p1.x) * offset;
    const curY = p1.y + (p2.y - p1.y) * offset;

    const angleFan = two.makeArcSegment(curX, curY, 0, 36, -0.6, 0.5);
    angleFan.fill = 'rgba(236, 72, 153, 0.45)'; angleFan.stroke = '#ec4899'; angleFan.linewidth = 2.5;

    two.makeText('∠a', p1.x + 35, p1.y - 12).fill = '#ec4899';
    two.makeText('∠b', p2.x + 35, p2.y - 12).fill = '#ec4899';

    const title = two.makeText('평행선의 성질: l // m 이면 동위각의 크기가 서로 같다!', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';

    const result = two.makeText(offset === 1 ? '🎉 ∠a와 ∠b가 완벽하게 일치합니다! (∠a = ∠b)' : '슬라이드 버튼을 눌러 동위각이 일치하는 과정을 확인하세요.', cx, cy + 125);
    result.size = 14; result.weight = 800; result.fill = offset === 1 ? '#059669' : '#64748b';
  }

  // --- 3-2: [5.3 개념] 평행선 엇각 크기 증명 및 계산 ---
  else if (code === '3-2') {
    const deg = ch5SimState.altAngle;
    const yL = cy - 40, yM = cy + 50;

    two.makeLine(cx - 150, yL, cx + 150, yL).stroke = '#0284c7';
    two.makeLine(cx - 150, yM, cx + 150, yM).stroke = '#0284c7';
    two.makeLine(cx - 60, yL - 40, cx + 60, yM + 40).stroke = '#4f46e5';

    // Alternate interior angles (Z shape)
    const p1 = { x: cx - 15, y: yL };
    const p2 = { x: cx + 15, y: yM };

    // Angle 1: below line L, right of transversal
    const arc1 = two.makeArcSegment(p1.x, p1.y, 0, 32, 0.6, 1.8); arc1.fill = 'rgba(217, 119, 6, 0.35)'; arc1.stroke = '#d97706';
    // Angle 2: above line M, left of transversal
    const arc2 = two.makeArcSegment(p2.x, p2.y, 0, 32, -2.5, -1.3); arc2.fill = 'rgba(217, 119, 6, 0.35)'; arc2.stroke = '#d97706';

    two.makeText(`${deg}°`, p1.x + 15, p1.y + 22).fill = '#d97706';
    two.makeText(`∠x = ${deg}°`, p2.x - 25, p2.y - 20).fill = '#d97706';

    const title = two.makeText('평행선의 성질: l // m 이면 엇각의 크기가 서로 같다!', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';

    const zRule = two.makeText('알파벳 Z자 모양을 기억하세요! 엇갈린 위치의 두 각은 크기가 같습니다.', cx, cy + 115);
    zRule.size = 13; zRule.weight = 700; zRule.fill = '#475569';
  }

  // --- 3-3: [5.3 응용] 꺾인 선 평행 보조선 인터랙터 (10대 시뮬레이터 #7) ---
  else if (code === '3-3') {
    const showAux = ch5SimState.showAuxLine;

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">⚡ 꺾인 선 평행 보조선 인터랙터 (교과서 156~157쪽)</span>
          <span id="aux-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            보조선: ${showAux ? 'ON (위 40° + 아래 30° = 70°)' : 'OFF (보조선 켜기)'}
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <button class="tool-btn ${showAux ? 'active' : ''}" style="background:#dcfce7; color:#15803d; font-weight:800; border:1px solid #86efac;" onclick="toggleAuxLine()">
            ${showAux ? '🔍 평행 보조선 숨기기' : '✨ 꺾인 점에 평행 보조선(l\') 긋기'}
          </button>
        </div>
      `;
    }

    const yTop = cy - 70;
    const yBot = cy + 70;
    const pVertex = { x: cx - 40, y: cy };

    // Line l (top)
    const lineL = two.makeLine(cx - 160, yTop, cx + 160, yTop); lineL.stroke = '#0284c7'; lineL.linewidth = 3;
    two.makeText('l', cx + 175, yTop).fill = '#0284c7';

    // Line m (bottom)
    const lineM = two.makeLine(cx - 160, yBot, cx + 160, yBot); lineM.stroke = '#0284c7'; lineM.linewidth = 3;
    two.makeText('m', cx + 175, yBot).fill = '#0284c7';

    // Bent lines
    const seg1 = two.makeLine(cx + 60, yTop, pVertex.x, pVertex.y); seg1.stroke = '#ec4899'; seg1.linewidth = 3;
    const seg2 = two.makeLine(pVertex.x, pVertex.y, cx + 70, yBot); seg2.stroke = '#ec4899'; seg2.linewidth = 3;

    // Angle arcs
    two.makeText('40°', cx + 25, yTop + 20).fill = '#059669';
    two.makeText('30°', cx + 30, yBot - 20).fill = '#d97706';

    if (showAux) {
      // Auxiliary line l'
      const lineAux = two.makeLine(cx - 160, pVertex.y, cx + 160, pVertex.y);
      lineAux.stroke = '#10b981'; lineAux.linewidth = 2.5; lineAux.dashes = [6, 4];
      two.makeText("l' (보조선)", cx + 185, pVertex.y).fill = '#10b981';

      // Alternate angle highlights
      two.makeText('40° (위 엇각)', pVertex.x + 45, pVertex.y - 15).fill = '#059669';
      two.makeText('30° (아래 엇각)', pVertex.x + 45, pVertex.y + 15).fill = '#d97706';

      const sumTxt = two.makeText('∠x = 40° + 30° = 70°', cx, cy + 120);
      sumTxt.size = 16; sumTxt.weight = 800; sumTxt.fill = '#ec4899';
    } else {
      two.makeText('∠x = ?', pVertex.x + 40, pVertex.y).fill = '#ec4899';
    }

    const title = two.makeText('꺾인 선에서의 핵심 비법: 꺾인 점에 평행 보조선 긋기!', cx, 40);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';
  }

  // --- 3-4: [5.3 응용] 종이접기 평행선 엇각 응용 ---
  else if (code === '3-4') {
    const poly = two.makePolygon(cx, cy, 70, 4); poly.fill = 'rgba(254, 240, 138, 0.4)'; poly.stroke = '#ca8a04';
    const foldLine = two.makeLine(cx - 60, cy + 40, cx + 50, cy - 40); foldLine.stroke = '#dc2626'; foldLine.linewidth = 2.5; foldLine.dashes = [5, 3];

    const title = two.makeText('종이접기와 평행선의 성질', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';

    const desc = two.makeText('접은 각의 크기와 평행선 엇각의 크기가 같으므로 이등변삼각형이 됩니다!', cx, cy + 115);
    desc.size = 13; desc.weight = 700; desc.fill = '#334155';
  }

  // --- 4-1: [5.4 개념] 눈금 없는 자 & 컴퍼스 복사기 (10대 시뮬레이터 #8) ---
  else if (code === '4-1') {
    const step = ch5SimState.compassStep;

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">📐 눈금 없는 자 & 컴퍼스 선분 복사기 (교과서 160~162쪽)</span>
          <span id="compass-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            작도 단계: ${step}/3 단계
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <button class="tool-btn ${step === 1 ? 'active' : ''}" style="font-weight:700;" onclick="setCompassStep(1)">1. 눈금 없는 자로 반직선 PQ 긋기</button>
          <button class="tool-btn ${step === 2 ? 'active' : ''}" style="font-weight:700;" onclick="setCompassStep(2)">2. 컴퍼스로 선분 AB 길이 재기</button>
          <button class="tool-btn ${step === 3 ? 'active' : ''}" style="font-weight:800; background:#dcfce7; color:#15803d;" onclick="setCompassStep(3)">3. 점 P 중심 호 그려 점 C 찾기 (완성!)</button>
        </div>
      `;
    }

    const yA = cy - 50;
    const yP = cy + 45;

    // Original Segment AB
    const segAB = two.makeLine(cx - 120, yA, cx + 20, yA); segAB.stroke = '#0284c7'; segAB.linewidth = 3.5;
    const ptA = two.makeCircle(cx - 120, yA, 5); ptA.fill = '#0284c7';
    const ptB = two.makeCircle(cx + 20, yA, 5); ptB.fill = '#0284c7';
    two.makeText('A', cx - 120, yA - 16).fill = '#0284c7';
    two.makeText('B', cx + 20, yA - 16).fill = '#0284c7';
    two.makeText('주어진 선분 AB', cx - 50, yA - 18).fill = '#64748b';

    // Step 1: Ray PQ
    const rayPQ = two.makeLine(cx - 120, yP, cx + 140, yP); rayPQ.stroke = '#64748b'; rayPQ.linewidth = 2;
    const ptP = two.makeCircle(cx - 120, yP, 5); ptP.fill = '#1e293b';
    two.makeText('P', cx - 120, yP + 20).fill = '#1e293b';
    two.makeText('Q', cx + 140, yP + 20).fill = '#64748b';

    if (step >= 2) {
      // Compass needle on A, pencil on B
      const compassArc1 = two.makeArcSegment(cx + 20, yA, 0, 25, -0.8, 0.8);
      compassArc1.fill = 'transparent'; compassArc1.stroke = '#ec4899'; compassArc1.linewidth = 2;
      two.makeText('컴퍼스로 길이 측정', cx + 45, yA).fill = '#ec4899';
    }

    if (step === 3) {
      // Arc on ray PQ at distance AB (140px)
      const arcP = two.makeArcSegment(cx + 20, yP, 0, 30, -1.2, 1.2);
      arcP.fill = 'transparent'; arcP.stroke = '#dc2626'; arcP.linewidth = 2.5;

      const ptC = two.makeCircle(cx + 20, yP, 6); ptC.fill = '#15803d'; ptC.stroke = '#fff'; ptC.linewidth = 2;
      two.makeText('C', cx + 20, yP + 20).fill = '#15803d';

      // Highlight cloned segment PC
      const segPC = two.makeLine(cx - 120, yP, cx + 20, yP); segPC.stroke = '#15803d'; segPC.linewidth = 4.5;
      two.makeText('복사된 선분 PC = 선분 AB ✨', cx - 50, yP - 18).fill = '#15803d';
    }

    const title = two.makeText('선분의 작도: 컴퍼스는 길이를 재어 옮길 때 사용합니다!', cx, 40);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';
  }

  // --- 4-2: [5.4 작도] 크기가 같은 각과 평행선의 작도 ---
  else if (code === '4-2') {
    const xO = cx - 90, yO = cy + 20;
    const xP = cx + 90, yP = cy + 20;

    two.makeLine(xO, yO, xO + 90, yO).stroke = '#0284c7';
    two.makeLine(xO, yO, xO + 60, yO - 70).stroke = '#0284c7';
    const arcO = two.makeArcSegment(xO, yO, 0, 35, -0.8, 0); arcO.fill = 'rgba(2, 132, 199, 0.2)'; arcO.stroke = '#0284c7';
    two.makeText('∠XOY', xO + 30, yO + 20).fill = '#0284c7';

    two.makeLine(xP, yP, xP + 90, yP).stroke = '#059669';
    two.makeLine(xP, yP, xP + 60, yP - 70).stroke = '#059669';
    const arcP = two.makeArcSegment(xP, yP, 0, 35, -0.8, 0); arcP.fill = 'rgba(5, 150, 105, 0.2)'; arcP.stroke = '#059669';
    two.makeText('∠CPD', xP + 30, yP + 20).fill = '#059669';

    const title = two.makeText('크기가 같은 각의 작도: 동위각의 성질 이용', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';

    const desc = two.makeText('동위각의 크기가 같으면 두 직선은 서로 평행하다는 성질을 이용합니다.', cx, cy + 115);
    desc.size = 13; desc.weight = 700; desc.fill = '#475569';
  }

  // --- 4-3: [5.4 작도] 삼각형의 결정조건과 변의 길이 ---
  else if (code === '4-3') {
    const title = two.makeText('삼각형의 세 변의 길이 조건: a + b > c', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';

    const baseSeg = two.makeLine(cx - 80, cy + 30, cx + 80, cy + 30); baseSeg.stroke = '#1e293b'; baseSeg.linewidth = 4;
    two.makeText('가장 긴 변 c = 8', cx, cy + 50).fill = '#1e293b';

    two.makeLine(cx - 80, cy + 30, cx - 20, cy - 30).stroke = '#0284c7';
    two.makeText('a = 4', cx - 60, cy - 10).fill = '#0284c7';

    two.makeLine(cx + 80, cy + 30, cx - 20, cy - 30).stroke = '#ec4899';
    two.makeText('b = 5', cx + 40, cy - 10).fill = '#ec4899';

    const desc = two.makeText('가장 긴 변의 길이는 나머지 두 변의 길이의 합보다 반드시 작아야 합니다!', cx, cy + 115);
    desc.size = 14; desc.weight = 800; desc.fill = '#059669';
  }

  // --- 4-4: [5.4 개념] SSS·SAS·ASA 삼각형 합동 매칭 결합기 (10대 시뮬레이터 #9) ---
  else if (code === '4-4') {
    const mode = ch5SimState.congruentMode;
    const snapped = ch5SimState.isSnapped;

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">🧩 SSS·SAS·ASA 삼각형 합동 매칭 결합기 (교과서 170~172쪽)</span>
          <span id="congruent-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            조건: ${mode} 합동 ${snapped ? '(찰칵 결합 완벽 포개어짐!)' : '(결합 전)'}
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <button class="tool-btn ${mode === 'SSS' ? 'active' : ''}" style="font-weight:700;" onclick="setCongruentMode('SSS')">1. SSS (세 변)</button>
          <button class="tool-btn ${mode === 'SAS' ? 'active' : ''}" style="font-weight:700;" onclick="setCongruentMode('SAS')">2. SAS (두 변과 끼인각)</button>
          <button class="tool-btn ${mode === 'ASA' ? 'active' : ''}" style="font-weight:700;" onclick="setCongruentMode('ASA')">3. ASA (한 변과 양 끝각)</button>
          <button class="tool-btn" style="background:#dcfce7; color:#15803d; font-weight:800; border:1px solid #86efac;" onclick="snapTriangles()">
            ${snapped ? '🔄 분리하기' : '✨ 포개어 합동 찰칵 결합!'}
          </button>
        </div>
      `;
    }

    const t1X = snapped ? cx : cx - 95;
    const t2X = snapped ? cx : cx + 95;

    // Triangle 1
    const tri1 = two.makePolygon(t1X, cy, 65, 3);
    tri1.fill = 'rgba(2, 132, 199, 0.35)'; tri1.stroke = '#0284c7'; tri1.linewidth = 3;

    // Triangle 2
    const tri2 = two.makePolygon(t2X, cy, 65, 3);
    tri2.fill = 'rgba(236, 72, 153, 0.35)'; tri2.stroke = '#ec4899'; tri2.linewidth = 3;

    if (!snapped) {
      two.makeText('△ABC', t1X, cy + 70).fill = '#0284c7';
      two.makeText('△DEF', t2X, cy + 70).fill = '#ec4899';
    } else {
      const snapTxt = two.makeText('△ABC ≡ △DEF (완벽 합동!)', cx, cy + 75);
      snapTxt.size = 18; snapTxt.weight = 800; snapTxt.fill = '#15803d';
    }

    const title = two.makeText(`삼각형의 합동 조건: [${mode} 합동]`, cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';

    let condDesc = '';
    if (mode === 'SSS') condDesc = '대응하는 세 변의 길이가 각각 같을 때 (Side-Side-Side)';
    else if (mode === 'SAS') condDesc = '대응하는 두 변의 길이와 그 끼인각의 크기가 각각 같을 때 (Side-Angle-Side)';
    else if (mode === 'ASA') condDesc = '대응하는 한 변의 길이와 그 양 끝 각의 크기가 각각 같을 때 (Angle-Side-Angle)';

    const desc = two.makeText(condDesc, cx, cy + 120);
    desc.size = 13; desc.weight = 700; desc.fill = '#475569';
  }

  // --- 5-1: [5.5 마무리] 도형의 기초 핵심 문제 총정리 ---
  else if (code === '5-1') {
    const x1 = cx - 140, x2 = cx, x3 = cx + 140;

    two.makeLine(x1 - 40, cy - 20, x1 + 40, cy + 20).stroke = '#0284c7';
    two.makeLine(x1 - 40, cy + 20, x1 + 40, cy - 20).stroke = '#ec4899';
    two.makeText('1. 맞꼭지각', x1, cy + 45).fill = '#1e293b';

    two.makeRectangle(x2, cy - 5, 50, 40).stroke = '#dc2626';
    two.makeText('2. 꼬인 위치', x2, cy + 45).fill = '#1e293b';

    two.makePolygon(x3, cy - 5, 30, 3).stroke = '#059669';
    two.makeText('3. 삼각형 합동', x3, cy + 45).fill = '#1e293b';

    const title = two.makeText('5단원 도형의 기초 스스로 마무리하기', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';
  }

  // --- 5-2: [5.5 창의융합] 나만의 기하학 문양 컴퍼스 작도실 (10대 시뮬레이터 #10) ---
  else if (code === '5-2') {
    const step = ch5SimState.mandalaStep;

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">🌸 나만의 기하학 문양 컴퍼스 작도실 (교과서 176~177쪽)</span>
          <span id="mandala-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            꽃잎 문양 ${step}단계 작도 중
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <button class="tool-btn ${step === 1 ? 'active' : ''}" style="font-weight:700;" onclick="setMandalaStep(1)">1. 기본 원 그리기</button>
          <button class="tool-btn ${step === 2 ? 'active' : ''}" style="font-weight:700;" onclick="setMandalaStep(2)">2. 원주 위 원 2개 (꽃잎 시작)</button>
          <button class="tool-btn ${step === 3 ? 'active' : ''}" style="font-weight:800; background:#fdf2f8; color:#be185d;" onclick="setMandalaStep(3)">3. 6꽃잎 로제트 완성! (Flower of Life)</button>
        </div>
      `;
    }

    const r = 65;

    // Central Circle
    const c0 = two.makeCircle(cx, cy, r);
    c0.fill = 'transparent'; c0.stroke = '#0284c7'; c0.linewidth = 2.5;

    if (step >= 2) {
      for (let i = 0; i < (step === 2 ? 2 : 6); i++) {
        const rad = i * 2 * Math.PI / 6;
        const ox = cx + r * Math.cos(rad);
        const oy = cy + r * Math.sin(rad);
        const c = two.makeCircle(ox, oy, r);
        c.fill = 'rgba(236, 72, 153, 0.12)';
        c.stroke = '#ec4899';
        c.linewidth = 2;
      }
    }

    if (step === 3) {
      const cOuter = two.makeCircle(cx, cy, 2 * r);
      cOuter.fill = 'transparent'; cOuter.stroke = '#8b5cf6'; cOuter.linewidth = 2; cOuter.dashes = [4, 4];
    }

    const title = two.makeText('창의융합: 컴퍼스의 반지름을 유지하며 그린 6꽃잎 문양', cx, 40);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const desc = two.makeText('반지름의 길이를 그대로 유지한 채 원주 위의 점을 중심으로 원을 그리면 신비로운 문양이 탄생합니다!', cx, cy + 130);
    desc.size = 12.5; desc.weight = 700; desc.fill = '#475569';
  }

  two.update();
}

function getAngleType(deg) {
  if (deg < 90) return '예각';
  if (deg === 90) return '직각';
  if (deg < 180) return '둔각';
  return '평각';
}

function getAngleDesc(deg) {
  if (deg < 90) return '0°보다 크고 90°보다 작은 각 = 예각 (Acute Angle)';
  if (deg === 90) return '90°인 각 = 직각 (Right Angle)';
  if (deg < 180) return '90°보다 크고 180°보다 작은 각 = 둔각 (Obtuse Angle)';
  return '180°인 각 = 평각 (Straight Angle)';
}

window.setAngle = function(val) {
  ch5SimState.angleVal = val;
  const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
  if (two) setupSubstepSimulator(two, '0-1', document.getElementById('interactive-sim-controller'));
};

window.setPrismModel = function(type) {
  ch5SimState.prismType = type;
  const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
  if (two) setupSubstepSimulator(two, '1-1', document.getElementById('interactive-sim-controller'));
};

window.highlightPrismPart = function(part) {
  ch5SimState.highlightElem = part;
  const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
  if (two) setupSubstepSimulator(two, '1-1', document.getElementById('interactive-sim-controller'));
};

window.setSegLength = function(len) {
  ch5SimState.segLen = len;
  const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
  if (two) setupSubstepSimulator(two, '1-3', document.getElementById('interactive-sim-controller'));
};

window.setScissorAngle = function(deg) {
  ch5SimState.scissorDeg = deg;
  const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
  if (two) setupSubstepSimulator(two, '2-1', document.getElementById('interactive-sim-controller'));
};

window.setCuboidEdge = function(edge) {
  ch5SimState.cuboidEdge = edge;
  const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
  if (two) setupSubstepSimulator(two, '2-4', document.getElementById('interactive-sim-controller'));
};

window.slideCorrAngle = function(offset) {
  ch5SimState.sliderOffset = offset;
  const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
  if (two) setupSubstepSimulator(two, '3-1', document.getElementById('interactive-sim-controller'));
};

window.toggleAuxLine = function() {
  ch5SimState.showAuxLine = !ch5SimState.showAuxLine;
  const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
  if (two) setupSubstepSimulator(two, '3-3', document.getElementById('interactive-sim-controller'));
};

window.setCompassStep = function(step) {
  ch5SimState.compassStep = step;
  const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
  if (two) setupSubstepSimulator(two, '4-1', document.getElementById('interactive-sim-controller'));
};

window.setCongruentMode = function(mode) {
  ch5SimState.congruentMode = mode;
  ch5SimState.isSnapped = false;
  const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
  if (two) setupSubstepSimulator(two, '4-4', document.getElementById('interactive-sim-controller'));
};

window.snapTriangles = function() {
  ch5SimState.isSnapped = !ch5SimState.isSnapped;
  const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
  if (two) setupSubstepSimulator(two, '4-4', document.getElementById('interactive-sim-controller'));
};

window.setMandalaStep = function(step) {
  ch5SimState.mandalaStep = step;
  const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
  if (two) setupSubstepSimulator(two, '5-2', document.getElementById('interactive-sim-controller'));
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    setupSubstepSimulatorCode: setupSubstepSimulator.toString()
  };
}
