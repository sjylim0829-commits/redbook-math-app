// Chapter 7 Interactive Canvas Drawers and Simulators (Two.js)
// Ⅶ. 입체도형 10대 인터랙티브 시뮬레이터 및 전 서브스텝 기하 렌더러

const ch7SimState = {
  polyFoldStep: 1,      // 1-1 다면체 전개도 접기 단계 (1: 전개도, 2: 반접힘, 3: 완전 조립 입체)
  platonicType: 'tetra',// 1-3 정다면체 선택 (tetra: 정사면체, cube: 정육면체, octa: 정팔면체, dodeca: 정십이면체, icosa: 정이십면체)
  eulerPoly: 'cube',    // 1-4 오일러 정리 다면체 (cube, tetra, octa, pentaprism, hexapyramid)
  revType: 'cylinder',  // 2-1 회전체 선택 (cylinder, cone, frustum, sphere)
  revProgress: 1,       // 2-1 회전 진행도 (0 ~ 1)
  sliceType: 'axis',    // 2-3 회전체 단면 (axis: 회전축 포함, perp: 회전축 수직)
  prismUnfold: 1,       // 3-1 기둥 전개도 펼침 단계 (1: 입체, 2: 반펼침, 3: 전개도)
  waterStep: 1,         // 4-1 뿔의 부피 물 채우기 단계 (1: 1/3, 2: 2/3, 3: 3/3 가득 참)
  sphereCordStep: 1,    // 5-1 구의 겉넓이 끈 감기 단계 (1: 반구 끈 감기, 2: 풀기, 3: 원 4개 매칭)
  archimedesView: 'all' // 5-3 아르키메데스 3:2:1 (all: 3개 동시, cylinder, sphere, cone)
};
window.ch7SimState = ch7SimState;

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

  // --- 0-1: [되짚어 보기 1] 직육면체와 각기둥 (초등 5~6학년) ---
  if (code === '0-1') {
    // 3D Cuboid Isometric wireframe
    const x1 = cx - 120, y1 = cy - 20;
    const cw = 110, ch = 80, cd = 50;

    // Front rect
    two.makeRectangle(x1, y1, cw, ch).fill = 'rgba(2, 132, 199, 0.2)';
    two.makeRectangle(x1, y1, cw, ch).stroke = '#0284c7';
    // Back rect
    two.makeRectangle(x1 + cd*0.6, y1 - cd*0.5, cw, ch).stroke = '#94a3b8';
    // Connect corners
    two.makeLine(x1 - cw/2, y1 - ch/2, x1 - cw/2 + cd*0.6, y1 - ch/2 - cd*0.5).stroke = '#0284c7';
    two.makeLine(x1 + cw/2, y1 - ch/2, x1 + cw/2 + cd*0.6, y1 - ch/2 - cd*0.5).stroke = '#0284c7';
    two.makeLine(x1 + cw/2, y1 + ch/2, x1 + cw/2 + cd*0.6, y1 + ch/2 - cd*0.5).stroke = '#0284c7';

    // Labels
    two.makeText('직육면체 (사각기둥)', x1, y1 + ch/2 + 35).fill = '#0284c7';
    two.makeText('꼭짓점 8개, 모서리 12개, 면 6개', x1, y1 + ch/2 + 55).fill = '#475569';

    // Right: Triangular Prism
    const x2 = cx + 120, y2 = cy - 20;
    const tri1 = two.makePolygon(x2, y2 - 40, 45, 3); tri1.fill = 'rgba(5, 150, 105, 0.2)'; tri1.stroke = '#059669';
    const tri2 = two.makePolygon(x2, y2 + 40, 45, 3); tri2.fill = 'rgba(5, 150, 105, 0.2)'; tri2.stroke = '#059669';
    two.makeLine(x2 - 35, y2 - 20, x2 - 35, y2 + 60).stroke = '#059669';
    two.makeLine(x2 + 35, y2 - 20, x2 + 35, y2 + 60).stroke = '#059669';
    two.makeLine(x2, y2 - 75, x2, y2 + 5).stroke = '#059669';

    two.makeText('삼각기둥', x2, y2 + 75).fill = '#059669';
    two.makeText('꼭짓점 6개, 모서리 9개, 면 5개', x2, y2 + 95).fill = '#475569';

    const title = two.makeText('초등 복습: 직육면체와 각기둥의 꼭짓점·모서리·면', cx, 40);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';
  }

  // --- 0-2: [되짚어 보기 2] 원기둥과 원뿔의 구성 요소 (초등 6학년) ---
  else if (code === '0-2') {
    const x1 = cx - 110, y1 = cy;
    // Cylinder
    two.makeEllipse(x1, y1 - 45, 45, 16).fill = 'rgba(236, 72, 153, 0.25)'; two.makeEllipse(x1, y1 - 45, 45, 16).stroke = '#ec4899';
    two.makeEllipse(x1, y1 + 45, 45, 16).fill = 'rgba(236, 72, 153, 0.25)'; two.makeEllipse(x1, y1 + 45, 45, 16).stroke = '#ec4899';
    two.makeLine(x1 - 45, y1 - 45, x1 - 45, y1 + 45).stroke = '#ec4899';
    two.makeLine(x1 + 45, y1 - 45, x1 + 45, y1 + 45).stroke = '#ec4899';

    two.makeText('원기둥 (밑면 2개, 옆면 굽은 면)', x1, y1 + 80).fill = '#ec4899';

    // Cone
    const x2 = cx + 110, y2 = cy;
    two.makeEllipse(x2, y2 + 45, 45, 16).fill = 'rgba(217, 119, 6, 0.25)'; two.makeEllipse(x2, y2 + 45, 45, 16).stroke = '#d97706';
    two.makeLine(x2 - 45, y2 + 45, x2, y2 - 50).stroke = '#d97706';
    two.makeLine(x2 + 45, y2 + 45, x2, y2 - 50).stroke = '#d97706';
    two.makeCircle(x2, y2 - 50, 4).fill = '#dc2626';

    two.makeText('원뿔 (꼭짓점 1개, 밑면 1개)', x2, y2 + 80).fill = '#d97706';

    const title = two.makeText('초등 복습: 원기둥과 원뿔의 구성 요소', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';
  }

  // --- 0-3: [되짚어 보기 3] 직육면체 겉넓이와 부피 기초 (초등 6학년) ---
  else if (code === '0-3') {
    const x = cx, y = cy - 10;
    two.makeRectangle(x, y, 140, 90).fill = 'rgba(99, 102, 241, 0.2)'; two.makeRectangle(x, y, 140, 90).stroke = '#4f46e5';
    two.makeRectangle(x + 35, y - 30, 140, 90).stroke = '#94a3b8';
    two.makeLine(x - 70, y - 45, x - 35, y - 75).stroke = '#4f46e5';
    two.makeLine(x + 70, y - 45, x + 105, y - 75).stroke = '#4f46e5';
    two.makeLine(x + 70, y + 45, x + 105, y + 15).stroke = '#4f46e5';

    two.makeText('가로 4 cm', x, y + 60).fill = '#1e293b';
    two.makeText('세로 3 cm', x + 95, y - 20).fill = '#1e293b';
    two.makeText('높이 5 cm', x - 90, y).fill = '#1e293b';

    two.makeText('• 겉넓이 = 2 × (4×3 + 3×5 + 4×5) = 2 × 47 = 94 cm²', cx, cy + 90).fill = '#0284c7';
    two.makeText('• 부피 = 4 × 3 × 5 = 60 cm³', cx, cy + 115).fill = '#059669';

    const title = two.makeText('초등 복습: 직육면체의 겉넓이와 부피 공식', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';
  }

  // --- 1-1: [7.1 개념열기] 다면체 전개도 접기 & 입체 조립기 (10대 시뮬레이터 #1) ---
  else if (code === '1-1') {
    const step = ch7SimState.polyFoldStep; // 1: 전개도, 2: 반접힘, 3: 입체 완성

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">📦 다면체 전개도 접기 & 입체 조립기 (교과서 212~214쪽)</span>
          <span id="fold-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            ${step === 1 ? '1. 평면 전개도 펼침' : (step === 2 ? '2. 옆면 45° 접힘 진행 중' : '3. 완벽한 사각뿔 입체 조립 완료! ✨')}
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <button class="tool-btn ${step === 1 ? 'active' : ''}" style="font-weight:700;" onclick="setPolyFoldStep(1)">1. 평면 전개도</button>
          <button class="tool-btn ${step === 2 ? 'active' : ''}" style="font-weight:700;" onclick="setPolyFoldStep(2)">2. 45° 입체 접기</button>
          <button class="tool-btn ${step === 3 ? 'active' : ''}" style="font-weight:800; background:#dcfce7; color:#15803d;" onclick="setPolyFoldStep(3)">3. 사각뿔 입체 완성! (오면체)</button>
        </div>
      `;
    }

    if (step === 1) {
      // Net of square pyramid: square at center + 4 triangles
      const s = 65;
      two.makeRectangle(cx, cy, s, s).fill = 'rgba(2, 132, 199, 0.3)'; two.makeRectangle(cx, cy, s, s).stroke = '#0284c7';
      // Top tri
      two.makePath(cx - s/2, cy - s/2, cx + s/2, cy - s/2, cx, cy - s/2 - 60, true).fill = 'rgba(236, 72, 153, 0.25)';
      // Bottom tri
      two.makePath(cx - s/2, cy + s/2, cx + s/2, cy + s/2, cx, cy + s/2 + 60, true).fill = 'rgba(236, 72, 153, 0.25)';
      // Left tri
      two.makePath(cx - s/2, cy - s/2, cx - s/2, cy + s/2, cx - s/2 - 60, cy, true).fill = 'rgba(236, 72, 153, 0.25)';
      // Right tri
      two.makePath(cx + s/2, cy - s/2, cx + s/2, cy + s/2, cx + s/2 + 60, cy, true).fill = 'rgba(236, 72, 153, 0.25)';

      two.makeText('밑면 (정사각형)', cx, cy).fill = '#0284c7';
      two.makeText('옆면 4개 (이등변삼각형)', cx, cy - 85).fill = '#ec4899';
    } else if (step === 2) {
      // Semi-folded
      const s = 65;
      two.makeRectangle(cx, cy + 20, s, s * 0.7).fill = 'rgba(2, 132, 199, 0.3)';
      two.makePath(cx - s/2, cy + 20 - s*0.35, cx + s/2, cy + 20 - s*0.35, cx, cy - 40, true).stroke = '#ec4899';
      two.makePath(cx - s/2, cy + 20 + s*0.35, cx + s/2, cy + 20 + s*0.35, cx, cy - 40, true).stroke = '#ec4899';
      two.makeText('모든 옆면이 꼭짓점을 향해 모여드는 중...', cx, cy + 85).fill = '#475569';
    } else if (step === 3) {
      // 3D Square Pyramid wireframe
      const bx = cx, by = cy + 40;
      const bw = 90, bh = 40, topY = cy - 70;
      two.makePolygon(bx, by, 50, 4).fill = 'rgba(2, 132, 199, 0.25)';
      two.makeLine(bx - 45, by, bx, topY).stroke = '#0284c7'; two.makeLine(bx - 45, by, bx, topY).linewidth = 2.5;
      two.makeLine(bx + 45, by, bx, topY).stroke = '#0284c7'; two.makeLine(bx + 45, by, bx, topY).linewidth = 2.5;
      two.makeLine(bx, by + 25, bx, topY).stroke = '#0284c7'; two.makeLine(bx, by + 25, bx, topY).linewidth = 2.5;
      const hiddenLine = two.makeLine(bx, by - 25, bx, topY); hiddenLine.stroke = '#94a3b8'; hiddenLine.dashes = [4, 4];

      two.makeCircle(bx, topY, 5).fill = '#dc2626';
      two.makeText('사각뿔 완성: 면 5개(오면체), 모서리 8개, 꼭짓점 5개', cx, cy + 85).fill = '#15803d';
    }

    const title = two.makeText('다면체: 다각형인 면으로만 둘러싸인 입체도형 (면의 수에 따라 사면체, 오면체...)', cx, 40);
    title.size = 14.5; title.weight = 800; title.fill = '#1e293b';
  }

  // --- 1-2: [7.1 개념학습] 각기둥, 각뿔, 각뿔대 ---
  else if (code === '1-2') {
    const x1 = cx - 140, x2 = cx, x3 = cx + 140;
    const y = cy - 10;

    // Prism
    two.makeRectangle(x1, y, 60, 80).fill = 'rgba(2, 132, 199, 0.2)'; two.makeRectangle(x1, y, 60, 80).stroke = '#0284c7';
    two.makeText('n각기둥', x1, y + 60).fill = '#0284c7';
    two.makeText('면: n + 2', x1, y + 80).fill = '#1e293b';
    two.makeText('모서리: 3n', x1, y + 98).fill = '#1e293b';
    two.makeText('꼭짓점: 2n', x1, y + 116).fill = '#1e293b';

    // Pyramid
    two.makePath(x2 - 35, y + 40, x2 + 35, y + 40, x2, y - 40, true).fill = 'rgba(236, 72, 153, 0.2)';
    two.makeText('n각뿔', x2, y + 60).fill = '#ec4899';
    two.makeText('면: n + 1', x2, y + 80).fill = '#1e293b';
    two.makeText('모서리: 2n', x2, y + 98).fill = '#1e293b';
    two.makeText('꼭짓점: n + 1', x2, y + 116).fill = '#1e293b';

    // Frustum
    two.makePath(x3 - 40, y + 40, x3 + 40, y + 40, x3 + 22, y - 40, x3 - 22, y - 40, true).fill = 'rgba(5, 150, 105, 0.2)';
    two.makeText('n각뿔대', x3, y + 60).fill = '#059669';
    two.makeText('면: n + 2', x3, y + 80).fill = '#1e293b';
    two.makeText('모서리: 3n', x3, y + 98).fill = '#1e293b';
    two.makeText('꼭짓점: 2n', x3, y + 116).fill = '#1e293b';

    const title = two.makeText('각기둥, 각뿔, 각뿔대의 면, 모서리, 꼭짓점의 개수 공식', cx, 40);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';
  }

  // --- 1-3: [7.1 탐구활동] 5가지 정다면체 회전 갤러리 (10대 시뮬레이터 #2) ---
  else if (code === '1-3') {
    const p = ch7SimState.platonicType;

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">💎 5가지 정다면체 3D 갤러리 (교과서 215~217쪽)</span>
          <span id="platonic-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            ${p === 'tetra' ? '정사면체 (정삼각형 4개, 꼭짓점 4, 모서리 6)' : (p === 'cube' ? '정육면체 (정사각형 6개, 꼭짓점 8, 모서리 12)' : (p === 'octa' ? '정팔면체 (정삼각형 8개, 꼭짓점 6, 모서리 12)' : (p === 'dodeca' ? '정십이면체 (정오각형 12개, 꼭짓점 20, 모서리 30)' : '정이십면체 (정삼각형 20개, 꼭짓점 12, 모서리 30)')))}
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <button class="tool-btn ${p === 'tetra' ? 'active' : ''}" style="font-weight:700;" onclick="setPlatonicType('tetra')">1. 정사면체</button>
          <button class="tool-btn ${p === 'cube' ? 'active' : ''}" style="font-weight:700;" onclick="setPlatonicType('cube')">2. 정육면체</button>
          <button class="tool-btn ${p === 'octa' ? 'active' : ''}" style="font-weight:700;" onclick="setPlatonicType('octa')">3. 정팔면체</button>
          <button class="tool-btn ${p === 'dodeca' ? 'active' : ''}" style="font-weight:700;" onclick="setPlatonicType('dodeca')">4. 정십이면체</button>
          <button class="tool-btn ${p === 'icosa' ? 'active' : ''}" style="font-weight:700;" onclick="setPlatonicType('icosa')">5. 정이십면체</button>
        </div>
      `;
    }

    if (p === 'tetra') {
      const top = { x: cx, y: cy - 70 };
      const b1 = { x: cx - 60, y: cy + 40 };
      const b2 = { x: cx + 60, y: cy + 40 };
      const b3 = { x: cx, y: cy + 60 };
      two.makePath(top.x, top.y, b1.x, b1.y, b3.x, b3.y, true).fill = 'rgba(236, 72, 153, 0.35)';
      two.makePath(top.x, top.y, b2.x, b2.y, b3.x, b3.y, true).fill = 'rgba(236, 72, 153, 0.2)';
      two.makeText('면의 모양: 정삼각형 (한 꼭짓점에 3개 모임)', cx, cy + 95).fill = '#ec4899';
    } else if (p === 'cube') {
      two.makeRectangle(cx - 15, cy + 15, 80, 80).fill = 'rgba(2, 132, 199, 0.35)';
      two.makeRectangle(cx + 15, cy - 15, 80, 80).stroke = '#0284c7';
      two.makeLine(cx - 55, cy - 25, cx - 25, cy - 55).stroke = '#0284c7';
      two.makeLine(cx + 25, cy - 25, cx + 55, cy - 55).stroke = '#0284c7';
      two.makeLine(cx + 25, cy + 55, cx + 55, cy + 25).stroke = '#0284c7';
      two.makeText('면의 모양: 정사각형 (한 꼭짓점에 3개 모임)', cx, cy + 95).fill = '#0284c7';
    } else if (p === 'octa') {
      two.makePolygon(cx, cy, 65, 4).fill = 'rgba(5, 150, 105, 0.3)';
      two.makeLine(cx - 65, cy, cx, cy - 75).stroke = '#059669'; two.makeLine(cx + 65, cy, cx, cy - 75).stroke = '#059669';
      two.makeLine(cx - 65, cy, cx, cy + 75).stroke = '#059669'; two.makeLine(cx + 65, cy, cx, cy + 75).stroke = '#059669';
      two.makeText('면의 모양: 정삼각형 (한 꼭짓점에 4개 모임)', cx, cy + 95).fill = '#059669';
    } else if (p === 'dodeca') {
      two.makePolygon(cx, cy, 70, 5).fill = 'rgba(217, 119, 6, 0.3)';
      for (let i = 0; i < 5; i++) {
        const rad = i * 2 * Math.PI / 5 - Math.PI / 2;
        two.makeCircle(cx + 70 * Math.cos(rad), cy + 70 * Math.sin(rad), 4).fill = '#d97706';
      }
      two.makeText('면의 모양: 정오각형 (한 꼭짓점에 3개 모임)', cx, cy + 95).fill = '#d97706';
    } else {
      two.makePolygon(cx, cy, 75, 6).fill = 'rgba(124, 58, 237, 0.3)';
      two.makeLine(cx, cy - 75, cx, cy + 75).stroke = '#7c3aed';
      two.makeText('면의 모양: 정삼각형 (한 꼭짓점에 5개 모임)', cx, cy + 95).fill = '#7c3aed';
    }

    const title = two.makeText('정다면체는 오직 5가지만 존재한다! (한 꼭짓점에 모인 내각의 합 < 360°)', cx, 40);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';
  }

  // --- 1-4: [7.1 공식유도] 오일러 다면체 정리 실험실 (10대 시뮬레이터 #3) ---
  else if (code === '1-4') {
    const poly = ch7SimState.eulerPoly;
    let v = 8, e = 12, f = 6, name = '정육면체';
    if (poly === 'tetra') { v = 4; e = 6; f = 4; name = '정사면체'; }
    else if (poly === 'octa') { v = 6; e = 12; f = 8; name = '정팔면체'; }
    else if (poly === 'pentaprism') { v = 10; e = 15; f = 7; name = '오각기둥'; }
    else if (poly === 'hexapyramid') { v = 7; e = 12; f = 7; name = '육각뿔'; }

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">📐 오일러 다면체 정리 실험실: v - e + f = 2 (교과서 217쪽)</span>
          <span id="euler-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            ${name}: ${v} - ${e} + ${f} = ${v - e + f} (항상 2 성립!) ✨
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <button class="tool-btn ${poly === 'cube' ? 'active' : ''}" style="font-weight:700;" onclick="setEulerPoly('cube')">정육면체</button>
          <button class="tool-btn ${poly === 'tetra' ? 'active' : ''}" style="font-weight:700;" onclick="setEulerPoly('tetra')">정사면체</button>
          <button class="tool-btn ${poly === 'octa' ? 'active' : ''}" style="font-weight:700;" onclick="setEulerPoly('octa')">정팔면체</button>
          <button class="tool-btn ${poly === 'pentaprism' ? 'active' : ''}" style="font-weight:700;" onclick="setEulerPoly('pentaprism')">오각기둥</button>
          <button class="tool-btn ${poly === 'hexapyramid' ? 'active' : ''}" style="font-weight:700;" onclick="setEulerPoly('hexapyramid')">육각뿔</button>
        </div>
      `;
    }

    // Card showing formula
    const card = two.makeRoundedRectangle(cx, cy, 260, 120, 12);
    card.fill = 'rgba(240, 253, 244, 0.7)'; card.stroke = '#86efac'; card.linewidth = 2;

    two.makeText(`${name}의 오일러 공식 검증`, cx, cy - 35).fill = '#15803d';
    two.makeText(`꼭짓점(v) = ${v},  모서리(e) = ${e},  면(f) = ${f}`, cx, cy - 5).fill = '#1e293b';
    const resTxt = two.makeText(`v - e + f = ${v} - ${e} + ${f} = 2 ✨`, cx, cy + 28);
    resTxt.size = 16; resTxt.weight = 800; resTxt.fill = '#059669';

    const title = two.makeText('모든 다면체에서 항상 성립하는 법칙: 꼭짓점 - 모서리 + 면 = 2', cx, 40);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';
  }

  // --- 2-1: [7.2 개념열기] 회전체 360° 고속 회전 생성기 (10대 시뮬레이터 #4) ---
  else if (code === '2-1') {
    const t = ch7SimState.revType; // cylinder, cone, frustum, sphere
    const prog = ch7SimState.revProgress;

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">🌀 회전체 360° 고속 회전 생성기 (교과서 218~220쪽)</span>
          <span id="rev-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            ${t === 'cylinder' ? '직사각형 회전 ➔ 원기둥' : (t === 'cone' ? '직각삼각형 회전 ➔ 원뿔' : (t === 'frustum' ? '사다리꼴 회전 ➔ 원뿔대' : '반원 회전 ➔ 구'))}
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <button class="tool-btn ${t === 'cylinder' ? 'active' : ''}" style="font-weight:700;" onclick="setRevType('cylinder')">1. 원기둥</button>
          <button class="tool-btn ${t === 'cone' ? 'active' : ''}" style="font-weight:700;" onclick="setRevType('cone')">2. 원뿔</button>
          <button class="tool-btn ${t === 'frustum' ? 'active' : ''}" style="font-weight:700;" onclick="setRevType('frustum')">3. 원뿔대</button>
          <button class="tool-btn ${t === 'sphere' ? 'active' : ''}" style="font-weight:700;" onclick="setRevType('sphere')">4. 구</button>
        </div>
      `;
    }

    // Rotation axis line
    const axis = two.makeLine(cx, cy - 90, cx, cy + 90);
    axis.stroke = '#dc2626'; axis.linewidth = 2.5; axis.dashes = [5, 4];
    two.makeText('회전축 l', cx, cy - 100).fill = '#dc2626';

    if (t === 'cylinder') {
      // 2D plane generator: rectangle on right of axis
      two.makeRectangle(cx + 35, cy, 70, 100).fill = 'rgba(2, 132, 199, 0.4)'; two.makeRectangle(cx + 35, cy, 70, 100).stroke = '#0284c7';
      // 3D Revolution ellipses
      two.makeEllipse(cx, cy - 50, 70, 18).stroke = '#0284c7';
      two.makeEllipse(cx, cy + 50, 70, 18).stroke = '#0284c7';
      two.makeLine(cx - 70, cy - 50, cx - 70, cy + 50).stroke = '#0284c7';
      two.makeText('직사각형 1회전 ➔ 원기둥 완성', cx, cy + 85).fill = '#0284c7';
    } else if (t === 'cone') {
      two.makePath(cx, cy + 50, cx + 70, cy + 50, cx, cy - 50, true).fill = 'rgba(236, 72, 153, 0.4)';
      two.makeEllipse(cx, cy + 50, 70, 18).stroke = '#ec4899';
      two.makeLine(cx - 70, cy + 50, cx, cy - 50).stroke = '#ec4899';
      two.makeText('직각삼각형 1회전 ➔ 원뿔 완성', cx, cy + 85).fill = '#ec4899';
    } else if (t === 'frustum') {
      two.makePath(cx, cy + 50, cx + 70, cy + 50, cx + 40, cy - 40, cx, cy - 40, true).fill = 'rgba(5, 150, 105, 0.4)';
      two.makeEllipse(cx, cy - 40, 40, 12).stroke = '#059669';
      two.makeEllipse(cx, cy + 50, 70, 18).stroke = '#059669';
      two.makeLine(cx - 70, cy + 50, cx - 40, cy - 40).stroke = '#059669';
      two.makeText('사다리꼴 1회전 ➔ 원뿔대 완성', cx, cy + 85).fill = '#059669';
    } else {
      two.makeArcSegment(cx, cy, 0, 70, -Math.PI/2, Math.PI/2).fill = 'rgba(217, 119, 6, 0.4)';
      two.makeCircle(cx, cy, 70).stroke = '#d97706';
      two.makeEllipse(cx, cy, 70, 20).stroke = '#d97706';
      two.makeText('반원 1회전 ➔ 구 완성', cx, cy + 85).fill = '#d97706';
    }

    const title = two.makeText('평면도형을 한 직선(회전축)을 중심으로 1회전 시켜 생기는 입체도형 = 회전체', cx, 40);
    title.size = 14.5; title.weight = 800; title.fill = '#1e293b';
  }

  // --- 2-2: [7.2 개념학습] 회전체의 구성 요소 ---
  else if (code === '2-2') {
    const title = two.makeText('회전체의 구성 요소: 회전축, 모선, 밑면, 옆면', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';

    two.makeText('• 회전축: 회전시킬 때 축이 되는 직선 l', cx, cy - 30).fill = '#0284c7';
    two.makeText('• 모선: 회전하여 옆면을 만드는 선분', cx, cy + 5).fill = '#ec4899';
    two.makeText('• 원뿔대: 원뿔을 밑면에 평행한 평면으로 잘라 생기는 두 입체도형 중 원뿔이 아닌 부분', cx, cy + 40).fill = '#059669';
  }

  // --- 2-3: [7.2 단면탐색] 회전체 단면 슬라이서 (10대 시뮬레이터 #5) ---
  else if (code === '2-3') {
    const s = ch7SimState.sliceType; // axis (선대칭), perp (원)

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">🔪 회전체 단면 슬라이서 (교과서 221~222쪽)</span>
          <span id="slice-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            ${s === 'axis' ? '회전축을 포함하는 평면으로 자른 단면 ➔ 회전축에 선대칭!' : '회전축에 수직인 평면으로 자른 단면 ➔ 항상 원!'}
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <button class="tool-btn ${s === 'axis' ? 'active' : ''}" style="font-weight:700;" onclick="setSliceType('axis')">1. 회전축 포함 단면 (선대칭)</button>
          <button class="tool-btn ${s === 'perp' ? 'active' : ''}" style="font-weight:700;" onclick="setSliceType('perp')">2. 회전축 수직 단면 (항상 원)</button>
        </div>
      `;
    }

    if (s === 'axis') {
      // Cone cut by axis -> Isosceles triangle
      const tri = two.makePolygon(cx, cy, 65, 3);
      tri.fill = 'rgba(236, 72, 153, 0.4)'; tri.stroke = '#ec4899'; tri.linewidth = 3;
      const axis = two.makeLine(cx, cy - 80, cx, cy + 80);
      axis.stroke = '#dc2626'; axis.dashes = [4, 4];
      two.makeText('원뿔을 회전축 포함 평면으로 자르면: 이등변삼각형 (회전축 선대칭)', cx, cy + 85).fill = '#ec4899';
    } else {
      // Cut perpendicular -> perfect circle
      const circ = two.makeCircle(cx, cy, 55);
      circ.fill = 'rgba(2, 132, 199, 0.4)'; circ.stroke = '#0284c7'; circ.linewidth = 3;
      two.makeText('원뿔, 원기둥, 구 등을 회전축에 수직으로 자르면: 항상 원!', cx, cy + 85).fill = '#0284c7';
    }

    const title = two.makeText('회전체 단면의 2대 절대 법칙', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';
  }

  // --- 2-4: [7.2 전개도] 회전체의 전개도 ---
  else if (code === '2-4') {
    const title = two.makeText('원기둥과 원뿔의 전개도 핵심', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';

    two.makeText('• 원기둥 전개도: 합동인 두 원(밑면) + 직사각형(옆면)', cx, cy - 25).fill = '#0284c7';
    two.makeText('• 옆면 직사각형의 가로 길이 = 밑면 원의 둘레 (2πr)', cx, cy + 5).fill = '#ec4899';
    two.makeText('• 원뿔 전개도: 원(밑면) + 부채꼴(옆면, 호의 길이 = 2πr)', cx, cy + 35).fill = '#059669';
  }

  // --- 3-1: [7.3 공식유도] 기둥 전개도 펼치기 & 겉넓이 계산기 (10대 시뮬레이터 #6) ---
  else if (code === '3-1') {
    const st = ch7SimState.prismUnfold;

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">📐 기둥 전개도 펼치기 & 겉넓이 계산기 (교과서 223~225쪽)</span>
          <span id="prism-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            겉넓이 공식 = (밑넓이 × 2) + 옆넓이
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <button class="tool-btn ${st === 1 ? 'active' : ''}" style="font-weight:700;" onclick="setPrismUnfold(1)">1. 입체 원기둥</button>
          <button class="tool-btn ${st === 2 ? 'active' : ''}" style="font-weight:700;" onclick="setPrismUnfold(2)">2. 전개도 완전 펼침</button>
        </div>
      `;
    }

    if (st === 1) {
      // 3D cylinder
      two.makeEllipse(cx, cy - 40, 50, 18).fill = 'rgba(2, 132, 199, 0.3)';
      two.makeEllipse(cx, cy + 40, 50, 18).fill = 'rgba(2, 132, 199, 0.3)';
      two.makeLine(cx - 50, cy - 40, cx - 50, cy + 40).stroke = '#0284c7';
      two.makeLine(cx + 50, cy - 40, cx + 50, cy + 40).stroke = '#0284c7';
      two.makeText('반지름 r, 높이 h', cx, cy).fill = '#1e293b';
    } else {
      // Net: rect + 2 circles
      two.makeRectangle(cx, cy, 180, 70).fill = 'rgba(5, 150, 105, 0.25)'; two.makeRectangle(cx, cy, 180, 70).stroke = '#059669';
      two.makeCircle(cx, cy - 55, 20).fill = 'rgba(2, 132, 199, 0.3)'; two.makeCircle(cx, cy - 55, 20).stroke = '#0284c7';
      two.makeCircle(cx, cy + 55, 20).fill = 'rgba(2, 132, 199, 0.3)'; two.makeCircle(cx, cy + 55, 20).stroke = '#0284c7';
      two.makeText('가로 = 2πr (밑면 둘레)', cx, cy - 5).fill = '#059669';
      two.makeText('세로 = h', cx - 110, cy).fill = '#059669';
      two.makeText('밑넓이 πr²', cx, cy - 55).fill = '#0284c7';
      two.makeText('밑넓이 πr²', cx, cy + 55).fill = '#0284c7';
    }

    const title = two.makeText('기둥의 겉넓이 = (밑넓이 × 2) + 옆넓이 = 2πr² + 2πrh', cx, 40);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';
  }

  // --- 3-2: [7.3 공식적용] 원기둥 겉넓이 계산 ---
  else if (code === '3-2') {
    const title = two.makeText('원기둥 겉넓이 계산 예제', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';

    two.makeText('반지름 r = 3 cm, 높이 h = 5 cm 일 때:', cx, cy - 30).fill = '#1e293b';
    two.makeText('• 밑넓이 × 2 = (π × 3²) × 2 = 18π cm²', cx, cy + 5).fill = '#0284c7';
    two.makeText('• 옆넓이 = (2π × 3) × 5 = 30π cm²', cx, cy + 35).fill = '#059669';
    two.makeText('• 겉넓이 = 18π + 30π = 48π cm²', cx, cy + 65).fill = '#ec4899';
  }

  // --- 3-3: [7.3 부피공식] 기둥의 부피 (V = Sh) ---
  else if (code === '3-3') {
    const title = two.makeText('기둥의 부피 공식: V = 밑넓이(S) × 높이(h)', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';

    two.makeText('반지름 r = 3 cm, 높이 h = 5 cm 인 원기둥의 부피:', cx, cy - 20).fill = '#1e293b';
    two.makeText('V = Sh = (π × 3²) × 5 = 9π × 5 = 45π cm³', cx, cy + 25).fill = '#4f46e5';
  }

  // --- 4-1: [7.4 공식유도] 뿔의 부피 물 채우기 실험실 (10대 시뮬레이터 #7) ---
  else if (code === '4-1') {
    const step = ch7SimState.waterStep; // 1: 1/3, 2: 2/3, 3: 3/3

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">💧 뿔의 부피 물 채우기 실험실 (교과서 228~230쪽)</span>
          <span id="water-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            ${step === 1 ? '원뿔 1번 부음 ➔ 원기둥 높이의 1/3 채움' : (step === 2 ? '원뿔 2번 부음 ➔ 원기둥 높이의 2/3 채움' : '원뿔 3번 부음 ➔ 원기둥 완벽히 가득 참! (V = 1/3 Sh)')}
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <button class="tool-btn ${step === 1 ? 'active' : ''}" style="font-weight:700;" onclick="setWaterStep(1)">1. 원뿔 1번 (1/3)</button>
          <button class="tool-btn ${step === 2 ? 'active' : ''}" style="font-weight:700;" onclick="setWaterStep(2)">2. 원뿔 2번 (2/3)</button>
          <button class="tool-btn ${step === 3 ? 'active' : ''}" style="font-weight:800; background:#dcfce7; color:#15803d;" onclick="setWaterStep(3)">3. 원뿔 3번 (3/3 가득 참!)</button>
        </div>
      `;
    }

    // Left: Cone pourer
    const cx1 = cx - 110;
    two.makePath(cx1 - 40, cy - 20, cx1 + 40, cy - 20, cx1, cy + 50, true).fill = 'rgba(236, 72, 153, 0.3)';
    two.makeText('밑면과 높이가 같은 원뿔', cx1, cy + 75).fill = '#ec4899';

    // Right: Cylinder beaker
    const cx2 = cx + 110;
    const cylH = 110;
    two.makeRectangle(cx2, cy, 80, cylH).stroke = '#0284c7'; two.makeRectangle(cx2, cy, 80, cylH).linewidth = 2.5;

    // Water level inside cylinder
    const fillH = (cylH / 3) * step;
    const fillY = cy + cylH/2 - fillH/2;
    const water = two.makeRectangle(cx2, fillY, 78, fillH);
    water.fill = 'rgba(2, 132, 199, 0.5)';

    two.makeText(`물높이: ${step}/3`, cx2, cy - 65).fill = '#0284c7';

    const title = two.makeText('밑면과 높이가 같은 뿔의 부피 = 기둥 부피의 1/3 (V = 1/3 · S · h)', cx, 40);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';
  }

  // --- 4-2: [7.4 공식적용] 뿔의 겉넓이 계산 ---
  else if (code === '4-2') {
    const title = two.makeText('원뿔의 겉넓이 계산 공식', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';

    two.makeText('밑면 반지름 r = 4 cm, 모선 l = 10 cm 인 원뿔:', cx, cy - 25).fill = '#1e293b';
    two.makeText('• 밑넓이 = π × 4² = 16π cm²', cx, cy + 5).fill = '#0284c7';
    two.makeText('• 옆넓이 = π × r × l = π × 4 × 10 = 40π cm²', cx, cy + 35).fill = '#ec4899';
    two.makeText('• 겉넓이 S = 16π + 40π = 56π cm²', cx, cy + 65).fill = '#059669';
  }

  // --- 4-3: [7.4 공식적용] 사각뿔 부피 계산 ---
  else if (code === '4-3') {
    const title = two.makeText('각뿔의 부피 계산 공식', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';

    two.makeText('밑면이 한 변 6 cm인 정사각형이고 높이 h = 8 cm인 사각뿔:', cx, cy - 25).fill = '#1e293b';
    two.makeText('• 밑넓이 S = 6 × 6 = 36 cm²', cx, cy + 5).fill = '#0284c7';
    two.makeText('• 부피 V = 1/3 × S × h = 1/3 × 36 × 8 = 96 cm³', cx, cy + 40).fill = '#ec4899';
  }

  // --- 5-1: [7.5 공식유도] 구의 겉넓이 끈 감기 실험실 (10대 시뮬레이터 #8) ---
  else if (code === '5-1') {
    const step = ch7SimState.sphereCordStep; // 1: 감기, 2: 풀기, 3: 원 4개 일치

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">🧶 구의 겉넓이 끈 감기 실험실 (교과서 233~235쪽)</span>
          <span id="cord-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            ${step === 1 ? '1. 반지름 r인 반구에 끈을 빈틈없이 감음' : (step === 2 ? '2. 끈을 풀어 평면에 펼치기' : '3. 반지름 r인 평면 원 4개를 완벽히 채움! (S = 4πr²)')}
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <button class="tool-btn ${step === 1 ? 'active' : ''}" style="font-weight:700;" onclick="setSphereCordStep(1)">1. 반구에 끈 감기</button>
          <button class="tool-btn ${step === 2 ? 'active' : ''}" style="font-weight:700;" onclick="setSphereCordStep(2)">2. 끈 풀기</button>
          <button class="tool-btn ${step === 3 ? 'active' : ''}" style="font-weight:800; background:#dcfce7; color:#15803d;" onclick="setSphereCordStep(3)">3. 원 4개 완성! (4πr²)</button>
        </div>
      `;
    }

    if (step === 1) {
      // Hemisphere with winding cords
      two.makeArcSegment(cx, cy, 0, 70, -Math.PI, 0).fill = 'rgba(236, 72, 153, 0.4)';
      two.makeEllipse(cx, cy, 70, 20).stroke = '#ec4899';
      two.makeText('반지름 r인 반구의 곡면에 끈을 감습니다...', cx, cy + 60).fill = '#ec4899';
    } else if (step === 2) {
      // Unwound cords
      two.makeLine(cx - 140, cy, cx + 140, cy).stroke = '#ec4899'; two.makeLine(cx - 140, cy, cx + 140, cy).linewidth = 4;
      two.makeText('풀어낸 끈의 면적을 원형으로 감아보면...', cx, cy + 40).fill = '#475569';
    } else {
      // 4 Circles of radius r
      const offsets = [
        { x: cx - 75, y: cy - 35 },
        { x: cx + 75, y: cy - 35 },
        { x: cx - 75, y: cy + 45 },
        { x: cx + 75, y: cy + 45 }
      ];
      offsets.forEach((o, i) => {
        two.makeCircle(o.x, o.y, 35).fill = 'rgba(236, 72, 153, 0.35)'; two.makeCircle(o.x, o.y, 35).stroke = '#ec4899';
        two.makeText(`원 ${i+1}: πr²`, o.x, o.y).fill = '#ec4899';
      });
      two.makeText('반지름 r인 구의 겉넓이 = 4 × πr² = 4πr² ✨', cx, cy + 95).fill = '#15803d';
    }

    const title = two.makeText('구의 겉넓이 공식 유도: S = 4πr²', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';
  }

  // --- 5-2: [7.5 공식유도] 구의 부피 계산 ---
  else if (code === '5-2') {
    const title = two.makeText('구의 부피 공식: V = 4/3 · π · r³', cx, 40);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';

    two.makeText('반지름 r = 3 cm 인 구의 부피 계산:', cx, cy - 25).fill = '#1e293b';
    two.makeText('V = 4/3 × π × 3³ = 4/3 × 27π = 36π cm³', cx, cy + 15).fill = '#0284c7';
  }

  // --- 5-3: [7.5 창의융합] 아르키메데스 원기둥:구:원뿔 부피비 3:2:1 (10대 시뮬레이터 #10) ---
  else if (code === '5-3') {
    const v = ch7SimState.archimedesView;

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">🏛️ 아르키메데스의 묘비: 원기둥·구·원뿔 부피비 3:2:1 (교과서 241쪽)</span>
          <span id="arch-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            부피비: 원기둥(3) : 구(2) : 원뿔(1) = 3 : 2 : 1
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <button class="tool-btn ${v === 'all' ? 'active' : ''}" style="font-weight:700;" onclick="setArchimedesView('all')">1. 3개 도형 동시 비교</button>
          <button class="tool-btn ${v === 'cylinder' ? 'active' : ''}" style="font-weight:700;" onclick="setArchimedesView('cylinder')">2. 원기둥 (3)</button>
          <button class="tool-btn ${v === 'sphere' ? 'active' : ''}" style="font-weight:700;" onclick="setArchimedesView('sphere')">3. 구 (2)</button>
          <button class="tool-btn ${v === 'cone' ? 'active' : ''}" style="font-weight:700;" onclick="setArchimedesView('cone')">4. 원뿔 (1)</button>
        </div>
      `;
    }

    const x1 = cx - 140, x2 = cx, x3 = cx + 140;

    // Cylinder (3)
    two.makeRectangle(x1, cy, 70, 70).fill = 'rgba(2, 132, 199, 0.3)';
    two.makeText('원기둥', x1, cy - 50).fill = '#0284c7';
    two.makeText('V = 2πr³', x1, cy + 50).fill = '#0284c7';
    two.makeText('(비율 3)', x1, cy + 70).fill = '#0284c7';

    // Sphere (2)
    two.makeCircle(x2, cy, 35).fill = 'rgba(236, 72, 153, 0.3)';
    two.makeText('구', x2, cy - 50).fill = '#ec4899';
    two.makeText('V = 4/3 πr³', x2, cy + 50).fill = '#ec4899';
    two.makeText('(비율 2)', x2, cy + 70).fill = '#ec4899';

    // Cone (1)
    two.makePath(x3 - 35, cy + 35, x3 + 35, cy + 35, x3, cy - 35, true).fill = 'rgba(5, 150, 105, 0.3)';
    two.makeText('원뿔', x3, cy - 50).fill = '#059669';
    two.makeText('V = 2/3 πr³', x3, cy + 50).fill = '#059669';
    two.makeText('(비율 1)', x3, cy + 70).fill = '#059669';

    const title = two.makeText('아르키메데스가 가장 자랑스러워한 발견: 원기둥 : 구 : 원뿔 = 3 : 2 : 1', cx, 40);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';
  }

  two.update();
}

// Window interactive helper methods
window.setPolyFoldStep = function(step) {
  if (typeof window.startSmoothLerp === 'function') {
    window.startSmoothLerp('polyFoldStep', () => ch7SimState.polyFoldStep, (v) => {
      ch7SimState.polyFoldStep = Math.round(v);
      const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
      if (two) setupSubstepSimulator(two, '1-1', document.getElementById('interactive-sim-controller'));
    }, step);
  } else {
    ch7SimState.polyFoldStep = step;
    const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
    if (two) setupSubstepSimulator(two, '1-1', document.getElementById('interactive-sim-controller'));
  }
};

window.setPlatonicType = function(type) {
  ch7SimState.platonicType = type;
  const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
  if (two) setupSubstepSimulator(two, '1-3', document.getElementById('interactive-sim-controller'));
};

window.setEulerPoly = function(p) {
  ch7SimState.eulerPoly = p;
  const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
  if (two) setupSubstepSimulator(two, '1-4', document.getElementById('interactive-sim-controller'));
};

window.setRevType = function(type) {
  ch7SimState.revType = type;
  const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
  if (two) setupSubstepSimulator(two, '2-1', document.getElementById('interactive-sim-controller'));
};

window.setSliceType = function(s) {
  ch7SimState.sliceType = s;
  const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
  if (two) setupSubstepSimulator(two, '2-3', document.getElementById('interactive-sim-controller'));
};

window.setPrismUnfold = function(st) {
  if (typeof window.startSmoothLerp === 'function') {
    window.startSmoothLerp('prismUnfold', () => ch7SimState.prismUnfold, (v) => {
      ch7SimState.prismUnfold = Math.round(v);
      const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
      if (two) setupSubstepSimulator(two, '3-1', document.getElementById('interactive-sim-controller'));
    }, st);
  } else {
    ch7SimState.prismUnfold = st;
    const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
    if (two) setupSubstepSimulator(two, '3-1', document.getElementById('interactive-sim-controller'));
  }
};

window.setWaterStep = function(step) {
  if (typeof window.startSmoothLerp === 'function') {
    window.startSmoothLerp('waterStep', () => ch7SimState.waterStep, (v) => {
      ch7SimState.waterStep = Math.round(v);
      const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
      if (two) setupSubstepSimulator(two, '4-1', document.getElementById('interactive-sim-controller'));
    }, step);
  } else {
    ch7SimState.waterStep = step;
    const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
    if (two) setupSubstepSimulator(two, '4-1', document.getElementById('interactive-sim-controller'));
  }
};

window.setSphereCordStep = function(step) {
  if (typeof window.startSmoothLerp === 'function') {
    window.startSmoothLerp('sphereCordStep', () => ch7SimState.sphereCordStep, (v) => {
      ch7SimState.sphereCordStep = Math.round(v);
      const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
      if (two) setupSubstepSimulator(two, '5-1', document.getElementById('interactive-sim-controller'));
    }, step);
  } else {
    ch7SimState.sphereCordStep = step;
    const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
    if (two) setupSubstepSimulator(two, '5-1', document.getElementById('interactive-sim-controller'));
  }
};

window.setArchimedesView = function(view) {
  ch7SimState.archimedesView = view;
  const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
  if (two) setupSubstepSimulator(two, '5-3', document.getElementById('interactive-sim-controller'));
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    setupSubstepSimulatorCode: setupSubstepSimulator.toString()
  };
}
