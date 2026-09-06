// Chapter 8 Interactive Canvas Drawers and Simulators (Two.js)
// Ⅷ. 자료의 정리와 해석 10대 인터랙티브 시뮬레이터 및 전 서브스텝 통계 시각화 렌더러

const ch8SimState = {
  seesawFulcrum: 8,       // 1-1 시소 저울 받침점 위치 (평균: 8)
  outlierVal: 25,         // 1-2 이상치 슬라이더 (기본 25, 5~50 조절)
  medianMode: 'odd',      // 1-3 중앙값 데이터 모드 ('odd': 5개, 'even': 6개)
  stemLeafSorted: true,   // 2-1 줄기와 잎 정렬 토글
  stemLeafSelected: 3,    // 2-2 줄기 선택 하이라이트
  classWidth: 10,         // 3-1 도수분포표 계급의 크기 (5, 10, 20)
  histoHighlightIdx: -1,  // 4-1 히스토그램 막대 마우스 호버/하이라이트
  polygonMorphStep: 1,    // 4-3 히스토그램 ↔ 도수분포다각형 변환 단계 (1: 히스토그램, 2: 중점 표시, 3: 다각형 선분 연결 및 삼각형 합동)
  relFreqView: 'table',   // 5-1 상대도수 뷰 ('table', 'bar')
  overlapGroup: 'both'    // 5-2 두 집단 비교 ('A', 'B', 'both')
};
window.ch8SimState = ch8SimState;

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

  // --- 0-1: [되짚어 보기 1] 초등 막대그래프와 수의 범위 (교과서 244쪽) ---
  if (code === '0-1') {
    const title = two.makeText('초등 복습: 막대그래프와 수의 범위 (이상·미만)', cx, 35);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    // Bar chart: 과일 선호도 (감: 3, 배: 4, 사과: 6, 귤: 8)
    const fruits = [
      { name: '감', count: 3, color: '#f59e0b' },
      { name: '배', count: 4, color: '#10b981' },
      { name: '사과', count: 6, color: '#ef4444' },
      { name: '귤', count: 8, color: '#f97316' }
    ];
    const chartLeft = cx - 160;
    const chartBottom = cy + 50;
    const barW = 55;
    const maxH = 140;

    // Axes
    two.makeLine(chartLeft - 10, chartBottom, chartLeft + 270, chartBottom).stroke = '#475569';
    two.makeLine(chartLeft - 10, chartBottom, chartLeft - 10, chartBottom - maxH - 20).stroke = '#475569';

    fruits.forEach((f, i) => {
      const bx = chartLeft + i * 65 + 30;
      const bh = (f.count / 10) * maxH;
      const by = chartBottom - bh / 2;
      const rect = two.makeRectangle(bx, by, barW, bh);
      rect.fill = f.color;
      rect.stroke = '#334155';
      two.makeText(f.name, bx, chartBottom + 18).fill = '#1e293b';
      two.makeText(`${f.count}명`, bx, by - bh/2 - 10).fill = f.color;
    });

    two.makeText('총 조사 학생 수 = 3 + 4 + 6 + 8 = 21명 (가장 많은 과일: 귤 8명)', cx, cy + 90).fill = '#0284c7';
    two.makeText('수의 범위: 40 이상 55 미만 ➔ 40 ≤ x < 55 (42, 46, 50 ➔ 3개)', cx, cy + 115).fill = '#475569';
  }

  // --- 0-2: [되짚어 보기 2] 초등 꺾은선그래프와 변화 경향 ---
  else if (code === '0-2') {
    const title = two.makeText('초등 복습: 꺾은선그래프 (시간에 따른 연속적 변화)', cx, 35);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    // Temperature line graph (월~금)
    const days = ['월', '화', '수', '목', '금'];
    const temps = [14, 16, 15, 19, 22];
    const gx = cx - 140, gy = cy + 30;
    const gw = 280, gh = 120;

    // Grid
    two.makeLine(gx, gy, gx + gw, gy).stroke = '#64748b';
    two.makeLine(gx, gy, gx, gy - gh).stroke = '#64748b';

    for (let i = 0; i < days.length; i++) {
      const px = gx + i * (gw / (days.length - 1));
      const py = gy - ((temps[i] - 10) / 15) * gh;
      two.makeCircle(px, py, 5).fill = '#2563eb';
      two.makeText(`${temps[i]}°C`, px, py - 14).fill = '#2563eb';
      two.makeText(days[i], px, gy + 18).fill = '#1e293b';
      if (i > 0) {
        const prevX = gx + (i - 1) * (gw / (days.length - 1));
        const prevY = gy - ((temps[i - 1] - 10) / 15) * gh;
        two.makeLine(prevX, prevY, px, py).stroke = '#2563eb';
        two.makeLine(prevX, prevY, px, py).linewidth = 2.5;
      }
    }

    two.makeText('꺾은선그래프는 연속적인 양의 증가·감소 경향을 한눈에 파악하는 데 효과적입니다.', cx, cy + 85).fill = '#059669';
    two.makeText('목요일에서 금요일 사이에 기온이 가장 크게 상승했습니다. (+3°C)', cx, cy + 110).fill = '#475569';
  }

  // --- 0-3: [되짚어 보기 3] 초등 평균의 개념과 계산 ---
  else if (code === '0-3') {
    const title = two.makeText('초등 복습: 평균(Mean)의 원리 = 고르게 맞추기', cx, 35);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    // 4 students sleep hours: 6, 7, 7, 8
    const hours = [6, 7, 7, 8];
    const mean = 7;
    const bx = cx - 120, by = cy + 20;

    hours.forEach((hVal, idx) => {
      const x = bx + idx * 75;
      const hPix = hVal * 15;
      two.makeRectangle(x, by - hPix/2, 45, hPix).fill = 'rgba(79, 70, 229, 0.3)';
      two.makeRectangle(x, by - hPix/2, 45, hPix).stroke = '#4f46e5';
      two.makeText(`${hVal}시간`, x, by - hPix - 12).fill = '#4f46e5';
      two.makeText(`${idx+1}일차`, x, by + 18).fill = '#64748b';
    });

    // Mean reference line
    const meanPix = mean * 15;
    const meanLine = two.makeLine(bx - 30, by - meanPix, bx + 260, by - meanPix);
    meanLine.stroke = '#dc2626';
    meanLine.linewidth = 2;
    meanLine.dashes = [5, 4];
    two.makeText(`평균 = 7시간`, bx + 295, by - meanPix).fill = '#dc2626';

    two.makeText('평균 = (변량의 총합) ÷ (변량의 개수) = (6 + 7 + 7 + 8) ÷ 4 = 28 ÷ 4 = 7시간', cx, cy + 85).fill = '#1e293b';
  }

  // --- 1-1: [8.1 개념열기] 대푯값 시소 저울 시뮬레이터 (10대 시뮬레이터 #1) ---
  else if (code === '1-1') {
    const fulcrum = ch8SimState.seesawFulcrum; // 8이 평균
    const weights = [2, 3, 5, 5, 25]; // 턱걸이 데이터
    const mean = 8;
    const isBalanced = (fulcrum === mean);

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">⚖️ 대푯값 시소 저울 시뮬레이터 (교과서 244~247쪽)</span>
          <span id="seesaw-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            ${isBalanced ? '🎉 시소 수평 균형 달성! 받침점 = 평균(8)' : `받침점: ${fulcrum} ➔ 불균형 (평형 아님)`}
          </span>
        </div>
        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
          <span style="font-size:0.88rem; font-weight:700; color:#475569;">받침점 이동:</span>
          <button class="tool-btn ${fulcrum === 5 ? 'active' : ''}" onclick="setSeesawFulcrum(5)">받침점: 5 (중앙값 위치)</button>
          <button class="tool-btn ${fulcrum === 8 ? 'active' : ''}" style="font-weight:800; background:#dcfce7; color:#15803d;" onclick="setSeesawFulcrum(8)">받침점: 8 (평균 위치 ➔ 균형!)</button>
          <button class="tool-btn ${fulcrum === 10 ? 'active' : ''}" onclick="setSeesawFulcrum(10)">받침점: 10</button>
        </div>
      `;
    }

    // Plank
    const plankY = cy + 20;
    const tilt = isBalanced ? 0 : (fulcrum < mean ? -0.06 : 0.06);
    const plankGrp = two.makeGroup();

    // Plank bar (representing values 0 ~ 26)
    const scale = 14; // pixels per unit
    const minVal = 0, maxVal = 26;
    const pLen = (maxVal - minVal) * scale;
    const plank = two.makeRoundedRectangle(cx, plankY, pLen + 40, 10, 4);
    plank.fill = '#64748b';

    // Fulcrum triangle
    const fx = cx + (fulcrum - 13) * scale;
    const fTriangle = two.makePolygon(fx, plankY + 22, 22, 3);
    fTriangle.fill = isBalanced ? '#16a34a' : '#ea580c';

    // Weights on plank
    weights.forEach(wVal => {
      const wx = cx + (wVal - 13) * scale;
      const c = two.makeCircle(wx, plankY - 14, 9);
      c.fill = (wVal === 25) ? '#ef4444' : '#0284c7';
      c.stroke = '#1e293b';
      two.makeText(`${wVal}`, wx, plankY - 30).fill = (wVal === 25) ? '#ef4444' : '#0284c7';
    });

    const title = two.makeText('평균(Mean)의 물리적 본질: 수직선 상 데이터 무게들의 무게중심(받침점)', cx, 35);
    title.size = 14.5; title.weight = 800; title.fill = '#1e293b';

    two.makeText(`자료: 2, 3, 5, 5, 25 (총합 = 40) ➔ 평균 = 40 ÷ 5 = 8회`, cx, cy + 85).fill = '#1e293b';
    two.makeText(`특징: 25라는 극단적인 이상치 때문에 평균 8은 5명 중 4명(2, 3, 5, 5)보다 큽니다!`, cx, cy + 110).fill = '#dc2626';
  }

  // --- 1-2: [8.1 개념학습] 이상치(Outlier) 왜곡 실험실 (10대 시뮬레이터 #2) ---
  else if (code === '1-2') {
    const outVal = ch8SimState.outlierVal; // 5 ~ 50
    const base = [2, 3, 5, 5];
    const sum = base.reduce((a, b) => a + b, 0) + outVal;
    const curMean = (sum / 5).toFixed(1);
    const curMedian = 5; // always 5 when sorted: 2, 3, 5, 5, outVal
    const curMode = 5;

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">🚨 이상치(Outlier) 왜곡 인터랙터 (교과서 248~249쪽)</span>
          <span style="background:#fef2f2; color:#b91c1c; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #fecaca;">
            이상치 = ${outVal}회 ➔ 평균: ${curMean}회 | 중앙값: ${curMedian}회 (견고함)
          </span>
        </div>
        <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
          <span style="font-size:0.85rem; font-weight:700;">이상치 슬라이더:</span>
          <input type="range" min="5" max="50" value="${outVal}" style="width:200px;" oninput="setOutlierVal(this.value)">
          <span style="font-weight:800; color:#ef4444;">${outVal}회</span>
          <button class="tool-btn" onclick="setOutlierVal(5)">최소 5</button>
          <button class="tool-btn" onclick="setOutlierVal(25)">기본 25</button>
          <button class="tool-btn" onclick="setOutlierVal(50)">극단 50</button>
        </div>
      `;
    }

    const title = two.makeText('이상치가 존재할 때: 평균은 왜곡되지만, 중앙값은 자료를 잘 대표함', cx, 35);
    title.size = 14.5; title.weight = 800; title.fill = '#1e293b';

    // Bar comparison: Mean vs Median
    const bx1 = cx - 90, bx2 = cx + 90, by = cy + 40;
    const maxBarH = 140;

    // Mean bar
    const meanH = Math.min((parseFloat(curMean) / 15) * 100, maxBarH);
    two.makeRectangle(bx1, by - meanH/2, 80, meanH).fill = 'rgba(239, 68, 68, 0.3)';
    two.makeRectangle(bx1, by - meanH/2, 80, meanH).stroke = '#ef4444';
    two.makeText(`평균`, bx1, by + 20).fill = '#1e293b';
    two.makeText(`${curMean}회`, bx1, by - meanH - 12).fill = '#ef4444';

    // Median bar
    const medH = (curMedian / 15) * 100;
    two.makeRectangle(bx2, by - medH/2, 80, medH).fill = 'rgba(16, 185, 129, 0.3)';
    two.makeRectangle(bx2, by - medH/2, 80, medH).stroke = '#10b981';
    two.makeText(`중앙값 (대표)`, bx2, by + 20).fill = '#1e293b';
    two.makeText(`${curMedian}회`, bx2, by - medH - 12).fill = '#10b981';

    two.makeText(`자료: 2, 3, 5, 5, [${outVal}]`, cx, cy - 65).fill = '#1e293b';
    two.makeText(`이상치가 매우 크거나 작은 경우, 평균보다 '중앙값'이 자료 전체를 더 정확히 대표합니다.`, cx, cy + 95).fill = '#0284c7';
  }

  // --- 1-3: [8.1 심화학습] 중앙값과 최빈값 탐색기 (10대 시뮬레이터 #3) ---
  else if (code === '1-3') {
    const mode = ch8SimState.medianMode; // 'odd' vs 'even'
    const oddData = [3, 7, 8, 12, 15]; // 중앙값: 8
    const evenData = [4, 7, 9, 12, 14, 18]; // 중앙값: (9+12)/2 = 10.5

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">🔍 데이터 정렬 및 중앙값·최빈값 탐색기 (교과서 250~251쪽)</span>
          <span style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            ${mode === 'odd' ? '홀수 개(5개) ➔ 가운데 1개: 8' : '짝수 개(6개) ➔ 가운데 2개 평균: 10.5'}
          </span>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="tool-btn ${mode === 'odd' ? 'active' : ''}" onclick="setMedianMode('odd')">1. 홀수 개 자료 (5개)</button>
          <button class="tool-btn ${mode === 'even' ? 'active' : ''}" onclick="setMedianMode('even')">2. 짝수 개 자료 (6개)</button>
        </div>
      `;
    }

    const title = two.makeText('중앙값(Median) 구하는 법: 크기순 나열 후 홀수 개 vs 짝수 개', cx, 35);
    title.size = 14.5; title.weight = 800; title.fill = '#1e293b';

    const currentArr = (mode === 'odd') ? oddData : evenData;
    const startX = cx - ((currentArr.length - 1) * 35);
    const itemY = cy + 5;

    currentArr.forEach((val, idx) => {
      const x = startX + idx * 70;
      let isMid = false;
      if (mode === 'odd' && idx === 2) isMid = true;
      if (mode === 'even' && (idx === 2 || idx === 3)) isMid = true;

      const rect = two.makeRoundedRectangle(x, itemY, 52, 45, 8);
      rect.fill = isMid ? 'rgba(16, 185, 129, 0.25)' : '#ffffff';
      rect.stroke = isMid ? '#10b981' : '#cbd5e1';
      rect.linewidth = isMid ? 2.5 : 1;

      const txt = two.makeText(`${val}`, x, itemY);
      txt.size = 16; txt.weight = 800;
      txt.fill = isMid ? '#047857' : '#1e293b';
      two.makeText(`${idx + 1}번째`, x, itemY + 36).fill = '#64748b';
    });

    if (mode === 'odd') {
      two.makeText('자료가 홀수 개(5개)일 때: 정확히 정중앙인 3번째 값 ➔ 중앙값 = 8', cx, cy + 85).fill = '#059669';
    } else {
      two.makeText('자료가 짝수 개(6개)일 때: 가운데 3번째(9)와 4번째(12)의 평균 ➔ (9 + 12) ÷ 2 = 10.5', cx, cy + 85).fill = '#059669';
    }
  }

  // --- 2-1: [8.2 개념열기] 줄기와 잎 그림 인터랙티브 정렬기 (10대 시뮬레이터 #4) ---
  else if (code === '2-1') {
    const isSorted = ch8SimState.stemLeafSorted;

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">🌱 줄기와 잎 그림 인터랙티브 정렬기 (교과서 252~255쪽)</span>
          <span style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            ${isSorted ? '✅ 잎이 작은 수부터 정렬됨' : '⚠️ 원자료 수집 순서대로 나열됨'}
          </span>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="tool-btn ${isSorted ? 'active' : ''}" onclick="toggleStemSort(true)">작은 수부터 정렬 (완성도)</button>
          <button class="tool-btn ${!isSorted ? 'active' : ''}" onclick="toggleStemSort(false)">원자료 수집 순서</button>
        </div>
      `;
    }

    const title = two.makeText('줄기와 잎 그림: 십의 자리(줄기)와 일의 자리(잎)로 자료 시각화', cx, 35);
    title.size = 14.5; title.weight = 800; title.fill = '#1e293b';

    // Data table layout
    const tableX = cx, tableY = cy + 10;
    const stems = [1, 2, 3, 4];
    const leavesUnsorted = [
      [8, 4, 7],
      [5, 1, 3, 8, 2],
      [6, 0, 4, 9, 2, 5],
      [1, 7]
    ];
    const leavesSorted = [
      [4, 7, 8],
      [1, 2, 3, 5, 8],
      [0, 2, 4, 5, 6, 9],
      [1, 7]
    ];
    const leaves = isSorted ? leavesSorted : leavesUnsorted;

    // Stem-Leaf Table Header
    two.makeRectangle(tableX, tableY - 60, 280, 28).fill = '#f1f5f9';
    two.makeText('줄기 (십의 자리)', tableX - 70, tableY - 60).fill = '#1e40af';
    two.makeText('잎 (일의 자리)', tableX + 50, tableY - 60).fill = '#1e40af';
    two.makeLine(tableX - 10, tableY - 74, tableX - 10, tableY + 65).stroke = '#3b82f6';
    two.makeLine(tableX - 10, tableY - 74, tableX - 10, tableY + 65).linewidth = 2;

    stems.forEach((st, idx) => {
      const y = tableY - 30 + idx * 28;
      two.makeText(`${st}`, tableX - 70, y).fill = '#1e293b';
      const leafStr = leaves[idx].join('    ');
      const lText = two.makeText(leafStr, tableX + 15 + leaves[idx].length * 10, y);
      lText.fill = '#059669'; lText.weight = 700;
    });

    two.makeText('설명: 1 | 4 는 14회를 나타냄 (중복되는 잎도 중복 횟수만큼 모두 적음)', cx, cy + 90).fill = '#475569';
  }

  // --- 2-2: [8.2 개념학습] 줄기와 잎 그림의 해석 ---
  else if (code === '2-2') {
    const title = two.makeText('줄기와 잎 그림의 해석: 최댓값, 최솟값 및 특정 조건 탐색', cx, 35);
    title.size = 14.5; title.weight = 800; title.fill = '#1e293b';

    // Highlight Stem 3
    const tx = cx, ty = cy + 10;
    two.makeRectangle(tx, ty - 60, 280, 28).fill = '#f1f5f9';
    two.makeText('줄기', tx - 70, ty - 60).fill = '#1e40af';
    two.makeText('잎', tx + 50, ty - 60).fill = '#1e40af';
    two.makeLine(tx - 10, ty - 74, tx - 10, ty + 65).stroke = '#3b82f6';

    const rows = [
      { s: 1, l: '4    7    8' },
      { s: 2, l: '1    2    3    5    8' },
      { s: 3, l: '0    2    4    5    6    9', hl: true },
      { s: 4, l: '1    7' }
    ];

    rows.forEach((r, i) => {
      const y = ty - 30 + i * 28;
      if (r.hl) {
        two.makeRectangle(tx + 20, y, 220, 24).fill = 'rgba(254, 240, 138, 0.5)';
      }
      two.makeText(`${r.s}`, tx - 70, y).fill = '#1e293b';
      two.makeText(r.l, tx + 50, y).fill = r.hl ? '#d97706' : '#059669';
    });

    two.makeText('• 최솟값 = 14, 최댓값 = 47', cx, cy + 85).fill = '#1e293b';
    two.makeText('• 30회 이상인 학생 수 = 줄기 3 (6명) + 줄기 4 (2명) = 8명', cx, cy + 110).fill = '#0284c7';
  }

  // --- 2-3: [8.2 장단점분석] 줄기와 잎 그림의 장단점 ---
  else if (code === '2-3') {
    const title = two.makeText('줄기와 잎 그림의 장단점 비교', cx, 35);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const bx1 = cx - 120, bx2 = cx + 120, by = cy + 10;
    // Advantage card
    two.makeRoundedRectangle(bx1, by, 210, 120, 10).fill = '#ecfdf5';
    two.makeRoundedRectangle(bx1, by, 210, 120, 10).stroke = '#10b981';
    two.makeText('✨ 장점', bx1, by - 40).fill = '#047857';
    two.makeText('1. 원자료의 크기를', bx1, by - 10).fill = '#1e293b';
    two.makeText('그대로 보존함', bx1, by + 10).fill = '#1e293b';
    two.makeText('2. 분포 형태를 바로 봄', bx1, by + 30).fill = '#1e293b';

    // Disadvantage card
    two.makeRoundedRectangle(bx2, by, 210, 120, 10).fill = '#fef2f2';
    two.makeRoundedRectangle(bx2, by, 210, 120, 10).stroke = '#ef4444';
    two.makeText('⚠️ 단점', bx2, by - 40).fill = '#b91c1c';
    two.makeText('1. 자료의 개수가', bx2, by - 10).fill = '#1e293b';
    two.makeText('매우 많으면 부적합', bx2, by + 10).fill = '#1e293b';
    two.makeText('2. 일일이 적기 번거로움', bx2, by + 30).fill = '#1e293b';

    two.makeText('자료가 수백~수천 개로 많아지면 ➔ 도수분포표와 히스토그램을 사용합니다!', cx, cy + 95).fill = '#2563eb';
  }

  // --- 3-1: [8.3 개념열기] 도수분포표 계급 구간 슬라이더 (10대 시뮬레이터 #5) ---
  else if (code === '3-1') {
    const cWidth = ch8SimState.classWidth; // 5, 10, 20
    const classCount = (cWidth === 5 ? 8 : (cWidth === 10 ? 4 : 2));

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">📊 도수분포표 계급 구간 슬라이더 (교과서 256~259쪽)</span>
          <span style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            계급의 크기 = ${cWidth}점 ➔ 계급의 개수 = ${classCount}개
          </span>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="tool-btn ${cWidth === 5 ? 'active' : ''}" onclick="setClassWidth(5)">계급의 크기: 5점 (8개 계급)</button>
          <button class="tool-btn ${cWidth === 10 ? 'active' : ''}" style="font-weight:800; background:#dcfce7; color:#15803d;" onclick="setClassWidth(10)">계급의 크기: 10점 (표준 4개 계급)</button>
          <button class="tool-btn ${cWidth === 20 ? 'active' : ''}" onclick="setClassWidth(20)">계급의 크기: 20점 (2개 계급)</button>
        </div>
      `;
    }

    const title = two.makeText('도수분포표: 변량을 일정한 구간(계급)으로 나누어 도수 정리', cx, 35);
    title.size = 14.5; title.weight = 800; title.fill = '#1e293b';

    // Draw Frequency Table Mock
    const tx = cx, ty = cy + 15;
    two.makeRectangle(tx, ty - 60, 320, 28).fill = '#f1f5f9';
    two.makeText('계급 (점수)', tx - 70, ty - 60).fill = '#1e40af';
    two.makeText('도수 (명)', tx + 70, ty - 60).fill = '#1e40af';
    two.makeLine(tx, ty - 74, tx, ty + 50).stroke = '#94a3b8';

    if (cWidth === 10) {
      const rows = [
        { label: '60 이상 ~ 70 미만', f: 4 },
        { label: '70 이상 ~ 80 미만', f: 10 },
        { label: '80 이상 ~ 90 미만', f: 11 },
        { label: '90 이상 ~ 100 미만', f: 5 }
      ];
      rows.forEach((r, i) => {
        const y = ty - 32 + i * 24;
        two.makeText(r.label, tx - 70, y).fill = '#1e293b';
        two.makeText(`${r.f}`, tx + 70, y).fill = '#059669';
      });
      two.makeRectangle(tx, ty + 62, 320, 24).fill = '#e2e8f0';
      two.makeText('합계', tx - 70, ty + 62).fill = '#1e293b';
      two.makeText('30', tx + 70, ty + 62).fill = '#1e40af';
    } else {
      two.makeText(`계급의 크기가 ${cWidth}점일 때 계급이 ${classCount}개로 자동 분할됩니다.`, tx, ty).fill = '#475569';
    }

    two.makeText('• 계급의 크기 = 계급의 양 끝값의 차 (예: 70 - 60 = 10점)', cx, cy + 95).fill = '#0284c7';
  }

  // --- 3-2: [8.3 개념학습] 계급값과 도수의 분포 ---
  else if (code === '3-2') {
    const title = two.makeText('계급값(Class Mark) = 계급의 중앙에 위치하는 대표값', cx, 35);
    title.size = 14.5; title.weight = 800; title.fill = '#1e293b';

    const tx = cx, ty = cy + 15;
    two.makeRectangle(tx, ty - 60, 360, 28).fill = '#f1f5f9';
    two.makeText('계급', tx - 110, ty - 60).fill = '#1e40af';
    two.makeText('계급값 (중앙)', tx, ty - 60).fill = '#dc2626';
    two.makeText('도수', tx + 110, ty - 60).fill = '#059669';

    const rows = [
      { c: '60 ~ 70', m: '65', f: 4 },
      { c: '70 ~ 80', m: '75', f: 10 },
      { c: '80 ~ 90', m: '85', f: 11 },
      { c: '90 ~ 100', m: '95', f: 5 }
    ];
    rows.forEach((r, i) => {
      const y = ty - 32 + i * 26;
      two.makeText(r.c, tx - 110, y).fill = '#1e293b';
      two.makeText(r.m, tx, y).fill = '#dc2626';
      two.makeText(`${r.f}`, tx + 110, y).fill = '#059669';
    });

    two.makeText('계급값 구하는 공식 = (계급의 양 끝값의 합) ÷ 2', cx, cy + 85).fill = '#1e293b';
    two.makeText('예: 60 이상 ~ 70 미만의 계급값 = (60 + 70) ÷ 2 = 65점', cx, cy + 110).fill = '#0284c7';
  }

  // --- 3-3: [8.3 심화학습] 도수분포표 미지수 A, B 역추적 ---
  else if (code === '3-3') {
    const title = two.makeText('도수분포표 미지수 역추적: 총합과 비율 조건 활용', cx, 35);
    title.size = 14.5; title.weight = 800; title.fill = '#1e293b';

    const tx = cx, ty = cy + 10;
    two.makeRectangle(tx, ty - 60, 320, 28).fill = '#f1f5f9';
    two.makeText('계급 (점수)', tx - 70, ty - 60).fill = '#1e40af';
    two.makeText('도수 (명)', tx + 70, ty - 60).fill = '#1e40af';

    two.makeText('60 ~ 70', tx - 70, ty - 32).fill = '#1e293b'; two.makeText('4', tx + 70, ty - 32).fill = '#059669';
    two.makeText('70 ~ 80', tx - 70, ty - 6).fill = '#1e293b'; two.makeText('A = 10', tx + 70, ty - 6).fill = '#dc2626';
    two.makeText('80 ~ 90', tx - 70, ty + 20).fill = '#1e293b'; two.makeText('11', tx + 70, ty + 20).fill = '#059669';
    two.makeText('90 ~ 100', tx - 70, ty + 46).fill = '#1e293b'; two.makeText('5', tx + 70, ty + 46).fill = '#059669';

    two.makeRectangle(tx, ty + 72, 320, 24).fill = '#e2e8f0';
    two.makeText('합계', tx - 70, ty + 72).fill = '#1e293b'; two.makeText('30', tx + 70, ty + 72).fill = '#1e40af';

    two.makeText('미지수 A = (전체 총합 30) - (4 + 11 + 5) = 30 - 20 = 10명', cx, cy + 105).fill = '#dc2626';
  }

  // --- 4-1: [8.4 개념열기] 히스토그램 막대 인터랙터 (10대 시뮬레이터 #6) ---
  else if (code === '4-1') {
    const title = two.makeText('히스토그램(Histogram): 가로축=계급, 세로축=도수 직사각형', cx, 35);
    title.size = 14.5; title.weight = 800; title.fill = '#1e293b';

    const left = cx - 140, bottom = cy + 50;
    const barWidth = 65;
    const freqs = [4, 10, 11, 5];
    const labels = ['60', '70', '80', '90', '100'];

    // Axes
    two.makeLine(left - 10, bottom, left + 270, bottom).stroke = '#334155';
    two.makeLine(left - 10, bottom, left - 10, bottom - 130).stroke = '#334155';

    freqs.forEach((f, i) => {
      const bx = left + i * barWidth + barWidth/2;
      const bh = f * 10;
      const by = bottom - bh / 2;
      const rect = two.makeRectangle(bx, by, barWidth, bh);
      rect.fill = 'rgba(79, 70, 229, 0.25)';
      rect.stroke = '#4f46e5';
      two.makeText(`${f}`, bx, by - bh/2 - 10).fill = '#4f46e5';
    });

    labels.forEach((lb, i) => {
      two.makeText(lb, left + i * barWidth, bottom + 18).fill = '#64748b';
    });

    two.makeText('각 직사각형의 넓이 = (계급의 크기) × (그 계급의 도수)', cx, cy + 90).fill = '#1e293b';
  }

  // --- 4-2: [8.4 공식적용] 히스토그램 직사각형 넓이의 총합 ---
  else if (code === '4-2') {
    const title = two.makeText('히스토그램 직사각형 넓이의 총합 공식', cx, 35);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    two.makeText('계급의 크기 = 10, 도수의 총합 = 25 인 히스토그램:', cx, cy - 30).fill = '#1e293b';
    two.makeText('• 직사각형 넓이의 합 = (10 × f₁) + (10 × f₂) + ... + (10 × fₖ)', cx, cy + 5).fill = '#4f46e5';
    two.makeText('• = 10 × (f₁ + f₂ + ... + fₖ) = (계급의 크기) × (도수의 총합)', cx, cy + 35).fill = '#059669';
    two.makeText('• = 10 × 25 = 250', cx, cy + 70).fill = '#dc2626';
    two.makeText('직사각형들의 넓이의 총합은 항상 (계급의 크기) × (도수의 총합)과 같습니다.', cx, cy + 105).fill = '#475569';
  }

  // --- 4-3: [8.4 모핑변환] 히스토그램 ↔ 도수분포다각형 변환기 (10대 시뮬레이터 #7) ---
  else if (code === '4-3') {
    const step = ch8SimState.polygonMorphStep; // 1: 히스토그램, 2: 중점 표시, 3: 다각형 선분 연결 및 삼각형 합동

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">📐 히스토그램 ↔ 도수분포다각형 모핑 변환기 (교과서 264~267쪽)</span>
          <span style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            ${step === 1 ? '1. 히스토그램 막대' : (step === 2 ? '2. 윗변의 중점 및 양 끝 0인 점 찍기' : '3. 선분 연결 및 넓이 일치 증명 (삼각형 합동)')}
          </span>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="tool-btn ${step === 1 ? 'active' : ''}" onclick="setPolygonMorphStep(1)">1. 히스토그램</button>
          <button class="tool-btn ${step === 2 ? 'active' : ''}" onclick="setPolygonMorphStep(2)">2. 중점 찍기</button>
          <button class="tool-btn ${step === 3 ? 'active' : ''}" style="font-weight:800; background:#dcfce7; color:#15803d;" onclick="setPolygonMorphStep(3)">3. 도수분포다각형 완성 & 넓이 증명</button>
        </div>
      `;
    }

    const title = two.makeText('도수분포다각형과 가로축으로 둘러싸인 넓이 = 히스토그램 직사각형 넓이의 합', cx, 35);
    title.size = 14; title.weight = 800; title.fill = '#1e293b';

    const left = cx - 140, bottom = cy + 45;
    const barWidth = 60;
    const freqs = [4, 10, 11, 5];
    const points = [{ x: left - barWidth/2, y: bottom }]; // start at 0

    // Draw Histogram bars
    freqs.forEach((f, i) => {
      const bx = left + i * barWidth + barWidth/2;
      const bh = f * 10;
      const by = bottom - bh / 2;
      two.makeRectangle(bx, by, barWidth, bh).fill = 'rgba(79, 70, 229, 0.2)';
      two.makeRectangle(bx, by, barWidth, bh).stroke = '#4f46e5';
      points.push({ x: bx, y: bottom - bh });
    });
    points.push({ x: left + freqs.length * barWidth + barWidth/2, y: bottom }); // end at 0

    // Step 2 & 3: Midpoints
    if (step >= 2) {
      points.forEach(pt => {
        two.makeCircle(pt.x, pt.y, 5).fill = '#dc2626';
      });
    }

    // Step 3: Poly lines
    if (step === 3) {
      for (let i = 0; i < points.length - 1; i++) {
        const line = two.makeLine(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
        line.stroke = '#ef4444';
        line.linewidth = 2.5;
      }
      two.makeText('잘려나간 삼각형 = 새로 채워진 삼각형 (합동) ➔ 둘러싸인 넓이는 완벽히 같습니다!', cx, cy + 85).fill = '#dc2626';
    } else {
      two.makeText('히스토그램 각 직사각형의 윗변의 중점을 찍고 양 끝에 도수가 0인 계급을 덧붙입니다.', cx, cy + 85).fill = '#059669';
    }
  }

  // --- 5-1: [8.5 개념열기] 상대도수 자동 계산기 (10대 시뮬레이터 #8) ---
  else if (code === '5-1') {
    const title = two.makeText('상대도수(Relative Frequency): 그 계급의 도수 ÷ 도수의 총합', cx, 35);
    title.size = 14.5; title.weight = 800; title.fill = '#1e293b';

    const tx = cx, ty = cy + 10;
    two.makeRectangle(tx, ty - 60, 360, 28).fill = '#f1f5f9';
    two.makeText('계급', tx - 110, ty - 60).fill = '#1e40af';
    two.makeText('도수', tx - 10, ty - 60).fill = '#1e293b';
    two.makeText('상대도수 (비율)', tx + 100, ty - 60).fill = '#2563eb';

    const rows = [
      { c: '60 ~ 70', f: 4, rel: '0.16' },
      { c: '70 ~ 80', f: 10, rel: '0.40' },
      { c: '80 ~ 90', f: 8, rel: '0.32' },
      { c: '90 ~ 100', f: 3, rel: '0.12' }
    ];

    rows.forEach((r, i) => {
      const y = ty - 32 + i * 26;
      two.makeText(r.c, tx - 110, y).fill = '#1e293b';
      two.makeText(`${r.f}`, tx - 10, y).fill = '#1e293b';
      two.makeText(r.rel, tx + 100, y).fill = '#2563eb';
    });

    two.makeRectangle(tx, ty + 68, 360, 24).fill = '#e2e8f0';
    two.makeText('합계', tx - 110, ty + 68).fill = '#1e293b';
    two.makeText('25', tx - 10, ty + 68).fill = '#1e293b';
    two.makeText('1.00 (100%)', tx + 100, ty + 68).fill = '#dc2626';

    two.makeText('상대도수의 총합은 항상 1 (또는 1.00) 입니다.', cx, cy + 105).fill = '#dc2626';
  }

  // --- 5-2: [8.5 두집단비교] 두 집단 상대도수 중첩 비교 (10대 시뮬레이터 #9) ---
  else if (code === '5-2') {
    const group = ch8SimState.overlapGroup; // 'A', 'B', 'both'

    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">👥 두 집단 상대도수 중첩 비교 (교과서 272~275쪽)</span>
          <span style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            A반: 20명 (파랑) vs B반: 40명 (주황) ➔ 총인원이 달라도 비율 직접 비교!
          </span>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="tool-btn ${group === 'A' ? 'active' : ''}" onclick="setOverlapGroup('A')">A반만 보기 (20명)</button>
          <button class="tool-btn ${group === 'B' ? 'active' : ''}" onclick="setOverlapGroup('B')">B반만 보기 (40명)</button>
          <button class="tool-btn ${group === 'both' ? 'active' : ''}" style="font-weight:800; background:#dcfce7; color:#15803d;" onclick="setOverlapGroup('both')">두 반 중첩 비교 (권장)</button>
        </div>
      `;
    }

    const title = two.makeText('도수의 총합이 다른 두 집단의 비교: 상대도수분포다각형으로 한눈에 파악', cx, 35);
    title.size = 14; title.weight = 800; title.fill = '#1e293b';

    const left = cx - 140, bottom = cy + 45;
    const barWidth = 60;
    const ptsA = [{ x: left - barWidth/2, y: bottom }, { x: left + 30, y: bottom - 30 }, { x: left + 90, y: bottom - 80 }, { x: left + 150, y: bottom - 50 }, { x: left + 210, y: bottom - 20 }, { x: left + 270, y: bottom }];
    const ptsB = [{ x: left - barWidth/2, y: bottom }, { x: left + 30, y: bottom - 15 }, { x: left + 90, y: bottom - 40 }, { x: left + 150, y: bottom - 90 }, { x: left + 210, y: bottom - 60 }, { x: left + 270, y: bottom }];

    // Axes
    two.makeLine(left - 10, bottom, left + 270, bottom).stroke = '#334155';
    two.makeLine(left - 10, bottom, left - 10, bottom - 120).stroke = '#334155';

    if (group === 'A' || group === 'both') {
      for (let i = 0; i < ptsA.length - 1; i++) {
        const l = two.makeLine(ptsA[i].x, ptsA[i].y, ptsA[i+1].x, ptsA[i+1].y);
        l.stroke = '#2563eb'; l.linewidth = 2.5;
      }
    }
    if (group === 'B' || group === 'both') {
      for (let i = 0; i < ptsB.length - 1; i++) {
        const l = two.makeLine(ptsB[i].x, ptsB[i].y, ptsB[i+1].x, ptsB[i+1].y);
        l.stroke = '#ea580c'; l.linewidth = 2.5;
      }
    }

    two.makeText('도수의 총합이 다르면 일반 도수는 비교 불가 ➔ 상대도수로 변환하면 그래프 형태 비교 가능', cx, cy + 85).fill = '#1e293b';
    two.makeText('B반(주황)의 그래프가 A반(파랑)보다 오른쪽으로 치우쳐 있어 독서량이 더 많은 경향이 있습니다.', cx, cy + 110).fill = '#ea580c';
  }

  // --- 5-3: [8.5 넓이증명] 상대도수 그래프 둘러싸인 넓이 총합 증명 (10대 시뮬레이터 #10) ---
  else if (code === '5-3') {
    const title = two.makeText('상대도수분포다각형과 가로축으로 둘러싸인 넓이 = (계급의 크기) × 1', cx, 35);
    title.size = 14; title.weight = 800; title.fill = '#1e293b';

    two.makeText('계급의 크기가 2 일 때:', cx, cy - 35).fill = '#1e293b';
    two.makeText('• 둘러싸인 넓이 = (계급의 크기) × (상대도수의 총합)', cx, cy - 5).fill = '#4f46e5';
    two.makeText('• 상대도수의 총합은 항상 1 이므로:', cx, cy + 25).fill = '#059669';
    two.makeText('• 넓이 = 2 × 1 = 2', cx, cy + 55).fill = '#dc2626';

    two.makeText('도수의 총합이 아무리 커지거나 작아져도, 상대도수 다각형의 넓이는 항상 계급의 크기와 같습니다!', cx, cy + 95).fill = '#1e293b';
  }

  two.update();
}

// Window interactive helper methods
window.setSeesawFulcrum = function(f) {
  if (typeof window.startSmoothLerp === 'function') {
    window.startSmoothLerp('seesawFulcrum', () => ch8SimState.seesawFulcrum, (v) => {
      ch8SimState.seesawFulcrum = Math.round(v);
      const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
      if (two) setupSubstepSimulator(two, '1-1', document.getElementById('interactive-sim-controller'));
    }, f);
  } else {
    ch8SimState.seesawFulcrum = f;
    const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
    if (two) setupSubstepSimulator(two, '1-1', document.getElementById('interactive-sim-controller'));
  }
};

window.setOutlierVal = function(v) {
  const target = parseInt(v) || 25;
  if (typeof window.startSmoothLerp === 'function') {
    window.startSmoothLerp('outlierVal', () => ch8SimState.outlierVal, (val) => {
      ch8SimState.outlierVal = Math.round(val);
      const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
      if (two) setupSubstepSimulator(two, '1-2', document.getElementById('interactive-sim-controller'));
    }, target);
  } else {
    ch8SimState.outlierVal = target;
    const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
    if (two) setupSubstepSimulator(two, '1-2', document.getElementById('interactive-sim-controller'));
  }
};

window.setMedianMode = function(m) {
  ch8SimState.medianMode = m;
  const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
  if (two) setupSubstepSimulator(two, '1-3', document.getElementById('interactive-sim-controller'));
};

window.toggleStemSort = function(b) {
  ch8SimState.stemLeafSorted = b;
  const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
  if (two) setupSubstepSimulator(two, '2-1', document.getElementById('interactive-sim-controller'));
};

window.setClassWidth = function(w) {
  ch8SimState.classWidth = w;
  const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
  if (two) setupSubstepSimulator(two, '3-1', document.getElementById('interactive-sim-controller'));
};

window.setPolygonMorphStep = function(s) {
  if (typeof window.startSmoothLerp === 'function') {
    window.startSmoothLerp('polygonMorphStep', () => ch8SimState.polygonMorphStep, (v) => {
      ch8SimState.polygonMorphStep = Math.round(v);
      const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
      if (two) setupSubstepSimulator(two, '4-3', document.getElementById('interactive-sim-controller'));
    }, s);
  } else {
    ch8SimState.polygonMorphStep = s;
    const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
    if (two) setupSubstepSimulator(two, '4-3', document.getElementById('interactive-sim-controller'));
  }
};

window.setOverlapGroup = function(g) {
  ch8SimState.overlapGroup = g;
  const two = window.twoInstance || (window.getTwoInstance ? window.getTwoInstance() : null);
  if (two) setupSubstepSimulator(two, '5-2', document.getElementById('interactive-sim-controller'));
};
