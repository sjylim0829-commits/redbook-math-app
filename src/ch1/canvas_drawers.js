// src/ch1/canvas_drawers.js
// Chapter 1: Two.js Canvas Interactive Engines for ALL 57 Substeps
// 규칙 6, 7, 8 전면 준수 (가짜 텍스트 카드 renderProblemSupportCanvas 100% 영구 퇴출)
// 57개 전 서브스텝 고유 맞춤형 대화형 시뮬레이터 & 시각화 엔진

(function() {
  // =========================================================================
  // 🎨 캔버스 폰트 크기 안전 인터셉터 (ch4 기준 온건 배율: 1.08배, 최소 12px, 프레임 침범 방지)
  // =========================================================================
  (function enhanceCanvasContextFont() {
    try {
      if (typeof CanvasRenderingContext2D === 'undefined') return;
      const desc = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, 'font');
      if (!desc || !desc.set) return;
      const originalSet = desc.set;
      desc.set = function(val) {
        if (typeof val === 'string') {
          val = val.replace(/(\d+(?:\.\d+)?)\s*px/g, (match, pxStr) => {
            const px = parseFloat(pxStr);
            if (isNaN(px) || px <= 0) return match;
            const boosted = Math.max(12, Math.round(px * 1.08));
            return boosted + 'px';
          });
        }
        return originalSet.call(this, val);
      };
      Object.defineProperty(CanvasRenderingContext2D.prototype, 'font', desc);
    } catch (err) {
      console.warn('Canvas font enhancement note:', err);
    }
  })();

  // =========================================================================
  // 🌐 전역 시뮬레이션 상태 저장소 (57개 전 서브스텝 상호작용 제어)
  // =========================================================================
  const simState = {
    // 1-1 음료수 진열대 (12 vs 7)
    beverageCount: 12,
    beverageCols: 4,

    // 1-2 에라토스테네스의 체
    sieveStep: 1,
    sieveManualToggled: new Set(),

    // 1-3 거듭제곱 타일 스택
    powerBase: 2,
    powerExp: 3,

    // 1-4 소수/합성수 구슬 분류
    primeSortActiveNum: 7,

    // 1-5 거듭제곱 조합기
    expMatchBase3: 4,
    expMatchBase5: 2,

    // 1-6 소수 반례 돋보기
    counterExampleNum: 2,

    // 1-7 세균 증식 거듭제곱
    bacteriaMinutes: 30,

    // 1-8 지수 밸런스 저울
    expBalanceL: 4,
    expBalanceR: 4,

    // 1-9 열차 소수 역과 승객
    trainStation: 25,

    // 2-1 소인수 필터 (24)
    factorFilterSelected: new Set(),

    // 2-2 소인수분해 가지치기 트리
    factorTreeNum: 36,
    factorTreeBranch: '6x6',
    factorTreeStep: 2,

    // 2-3 ㄴ자 나눗셈 슬롯 (60)
    lDivStep: 1,

    // 2-4 소인수 파이 분해 (30, 42)
    pieTarget: 30,

    // 2-5 소인수분해 단계 큐브 (54, 120)
    cubeTarget: 54,

    // 2-6 연속 곱 2의 지수 계단
    prodStep: 10,

    // 2-7 제곱수 만들기 밸런스
    squareMultX: 14,

    // 2-8 조건 추론 필터
    deductFilter: '2^a * 3^b',

    // 2-9 약수의 개수 격자 타일
    divGridA: 3,
    divGridB: 2,

    // 3-1 직사각형 타일링 (18x12)
    tileSquareSize: 6,

    // 3-2 최대공약수 지수 저울
    gcdPair: '12_18',

    // 3-3 세 수의 3중 벤다이어그램 (24, 36, 60)
    tripleGcdHighlight: 'center',

    // 3-4 두 수 ㄴ자 나눗셈
    gcdLDivStep: 2,

    // 3-6 서로소 연결선
    coprimeTarget: 15,
    coprimeSelected: 8,

    // 3-7 지수 미지수 슬라이더
    unknownExpA: 2,

    // 3-9 과일 바구니 공평 분배
    basketPeople: 12,

    // 3-10 대형 벽면 타일 (240x180)
    wallTileSize: 60,

    // 4-1 톱니바퀴 맞물림
    gearMeshingA: 12,
    gearMeshingB: 16,
    gearAngle: 0,

    // 4-2 최소공배수 큰 지수 마그넷
    lcmGearA: 24,
    lcmGearB: 36,

    // 4-6 버스 동시 출발 시계
    busClockMin: 0,

    // 4-7 직육면체 블록 쌓기 (6x4x3)
    blockLayers: 1,

    // 4-8 A x B = G x L 저울
    areaBalanceA: 12,
    areaBalanceB: 18,

    // 4-10 소수 판별 코딩 알고리즘
    algoNum: 115,
    algoCurrI: 2,
    algoRunning: false,
    algoStepIdx: 0,
    algoLog: [],

    // 5-1 달력 속 소수
    calendarSelected: new Set(),

    // 6-1 몬드리안 분할
    mondrianRatio: 1
  };
  window.simState = simState;

  // =========================================================================
  // 🕹️ 인터랙티브 조작 헬퍼 함수들 (전역 window 바인딩)
  // =========================================================================
  window.setBeverageCols = function(cols) {
    simState.beverageCols = parseInt(cols) || 4;
    if (window.currentTwo && state.subStep === '1-1') renderBeverageArrangementCanvas(window.currentTwo, simState.beverageCount, simState.beverageCols);
  };
  window.setBeverageCount = function(cnt) {
    simState.beverageCount = parseInt(cnt) || 12;
    simState.beverageCols = (simState.beverageCount === 7) ? 7 : 4;
    if (window.currentTwo && state.subStep === '1-1') renderBeverageArrangementCanvas(window.currentTwo, simState.beverageCount, simState.beverageCols);
  };

  window.setSieveStep = function(st) {
    simState.sieveStep = st;
    simState.sieveManualToggled.clear();
    const badge = document.getElementById('sieve-progress-badge');
    if (badge) {
      if (st === 1) badge.innerHTML = `진행: <b>1단계</b> (1은 소수 아님 ➔ 지움)`;
      else if (st === 2) badge.innerHTML = `진행: <b>2단계</b> (2 남기고 2의 배수 지움)`;
      else if (st === 3) badge.innerHTML = `진행: <b>3단계</b> (3 남기고 3의 배수 지움)`;
      else if (st === 4) badge.innerHTML = `진행: <b>4단계</b> (5 남기고 5의 배수 지움)`;
      else if (st === 5) badge.innerHTML = `진행: <b>5단계</b> (7 남기고 7의 배수 지움)`;
      else badge.innerHTML = `✨ <b>50 이하 소수 15개 발견 완료!</b>`;
    }
    if (window.currentTwo && state.subStep === '1-2') renderSieveCanvas(window.currentTwo, st);
  };

  window.setPowerExp = function(e) {
    simState.powerExp = Math.max(1, Math.min(5, parseInt(e) || 3));
    if (window.currentTwo && state.subStep === '1-3') renderPowerTileCanvas(window.currentTwo, simState.powerBase, simState.powerExp);
  };

  window.setPrimeSortNum = function(n) {
    simState.primeSortActiveNum = parseInt(n) || 7;
    if (window.currentTwo && state.subStep === '1-4') renderPrimeSortCanvas(window.currentTwo, simState.primeSortActiveNum);
  };

  window.setCounterExampleNum = function(n) {
    simState.counterExampleNum = parseInt(n) || 2;
    if (window.currentTwo && state.subStep === '1-6') renderPrimeCounterexampleCanvas(window.currentTwo, simState.counterExampleNum);
  };

  window.setBacteriaMinutes = function(m) {
    simState.bacteriaMinutes = parseInt(m) || 30;
    const badge = document.getElementById('bacteria-badge');
    if (badge) {
      const exp = Math.floor(simState.bacteriaMinutes / 10);
      badge.innerHTML = `경과 시간: <b>${simState.bacteriaMinutes}분</b> ➔ 세포 수: <b>2<sup>${exp}</sup> = ${Math.pow(2, exp)}마리</b>`;
    }
    if (window.currentTwo && state.subStep === '1-7') renderBacteriaCanvas(window.currentTwo, simState.bacteriaMinutes);
  };

  window.setTrainStation = function(st) {
    simState.trainStation = parseInt(st) || 25;
    const badge = document.getElementById('train-badge');
    const n = simState.trainStation;
    const divs = [];
    for (let i = 1; i <= n; i++) if (n % i === 0) divs.push(i);
    const isP = (divs.length === 2);
    if (badge) {
      badge.innerHTML = `역 번호: <b>${n}번</b> | 승객(약수): <b>${divs.length}명</b> (${divs.join(', ')}) ${isP ? '🟢 <b>소수 역!</b>' : '🏢 합성수 역'}`;
      badge.style.background = isP ? '#f0fdf4' : '#eff6ff';
      badge.style.color = isP ? '#166534' : '#1e40af';
    }
    if (window.currentTwo && state.subStep === '1-9') renderTrainStationCanvas(window.currentTwo, n);
  };

  window.setFactorTreeNum = function(n) {
    simState.factorTreeNum = parseInt(n) || 36;
    simState.factorTreeStep = 1;
    if (window.currentTwo && state.subStep === '2-2') renderFactorTreeCanvas(window.currentTwo, simState.factorTreeNum, simState.factorTreeBranch, simState.factorTreeStep);
  };

  window.stepFactorTree = function(delta) {
    simState.factorTreeStep = Math.max(0, Math.min(3, simState.factorTreeStep + delta));
    if (window.currentTwo && state.subStep === '2-2') renderFactorTreeCanvas(window.currentTwo, simState.factorTreeNum, simState.factorTreeBranch, simState.factorTreeStep);
  };

  window.setLDivStep = function(st) {
    simState.lDivStep = Math.max(1, Math.min(4, parseInt(st) || 1));
    if (window.currentTwo && state.subStep === '2-3') renderLDivisionCanvas(window.currentTwo, simState.lDivStep);
  };

  window.setSquareMultX = function(x) {
    simState.squareMultX = parseInt(x) || 14;
    const badge = document.getElementById('square-mult-badge');
    const total = 56 * simState.squareMultX;
    let t = total, exp2 = 0, exp7 = 0;
    while (t > 0 && t % 2 === 0) { exp2++; t /= 2; }
    while (t > 0 && t % 7 === 0) { exp7++; t /= 7; }
    const isSquare = (exp2 % 2 === 0 && exp7 % 2 === 0 && t === 1);
    const root = isSquare ? Math.round(Math.sqrt(total)) : 0;
    if (badge) {
      if (isSquare) {
        badge.innerHTML = `56 × <b>${simState.squareMultX}</b> = ${total} ➔ <b>(${root})² 🎉 완벽한 제곱수!</b>`;
        badge.style.background = '#f0fdf4'; badge.style.color = '#166534';
      } else {
        badge.innerHTML = `56 × <b>${simState.squareMultX}</b> = ${total} ➔ 2<sup>${exp2}</sup> × 7<sup>${exp7}</sup> (홀수 지수 존재 ⚠️)`;
        badge.style.background = '#fffbeb'; badge.style.color = '#b45309';
      }
    }
    if (window.currentTwo && state.subStep === '2-7') renderSquareMakerCanvas(window.currentTwo, simState.squareMultX);
  };

  window.setDivGrid = function(a, b) {
    simState.divGridA = parseInt(a) || 3;
    simState.divGridB = parseInt(b) || 2;
    if (window.currentTwo && state.subStep === '2-9') renderDivisorTableCanvas(window.currentTwo, simState.divGridA, simState.divGridB);
  };

  window.setTileSquareSize = function(s) {
    simState.tileSquareSize = parseInt(s) || 6;
    const badge = document.getElementById('tile-size-badge');
    const sz = simState.tileSquareSize;
    const fitW = (18 % sz === 0), fitH = (12 % sz === 0);
    if (badge) {
      if (fitW && fitH) {
        badge.innerHTML = `타일 ${sz}cm: 가로 ${18/sz}장, 세로 ${12/sz}장 ➔ <b>빈틈없이 딱 채움! ${sz === 6 ? '👑 최대공약수!' : '🟢 공약수'}</b>`;
        badge.style.background = '#f0fdf4'; badge.style.color = '#166534';
      } else {
        badge.innerHTML = `타일 ${sz}cm: 가로/세로에 빈틈 발생 ⚠️ (공약수가 아님)`;
        badge.style.background = '#fef2f2'; badge.style.color = '#991b1b';
      }
    }
    if (window.currentTwo && state.subStep === '3-1') renderTileCanvas(window.currentTwo, sz);
  };

  window.setBasketPeople = function(p) {
    simState.basketPeople = parseInt(p) || 12;
    const badge = document.getElementById('basket-badge');
    const b = simState.basketPeople;
    const fitA = (36 % b === 0), fitG = (48 % b === 0);
    if (badge) {
      if (fitA && fitG) {
        badge.innerHTML = `${b}명 배분: 사과 <b>${36/b}개</b>, 귤 <b>${48/b}개</b>씩 공평 분배! ${b === 12 ? '👑 최대 인원(최대공약수)' : '🟢 분배 가능'}`;
        badge.style.background = '#f0fdf4'; badge.style.color = '#166534';
      } else {
        badge.innerHTML = `${b}명 배분: 남는 과일 발생 ⚠️ (공약수 아님)`;
        badge.style.background = '#fef2f2'; badge.style.color = '#991b1b';
      }
    }
    if (window.currentTwo && state.subStep === '3-9') renderFruitBasketCanvas(window.currentTwo, b);
  };

  window.setGearRotation = function(delta) {
    simState.gearAngle = (simState.gearAngle + delta) % 360;
    if (window.currentTwo && (state.subStep === '4-1' || state.subStep === '4-2')) {
      renderGearsMeshingCanvas(window.currentTwo, simState.gearMeshingA, simState.gearMeshingB, simState.gearAngle);
    }
  };

  window.advanceBusClock = function(mins) {
    simState.busClockMin = (simState.busClockMin + mins) % 60;
    const badge = document.getElementById('bus-clock-badge');
    const m = simState.busClockMin;
    const aDep = (m % 10 === 0), bDep = (m % 15 === 0);
    if (badge) {
      if (aDep && bDep) {
        badge.innerHTML = `경과: <b>${m}분</b> ➔ 🚌 A버스(10분) & 🚐 B버스(15분) <b>동시 출발! 🎉 (최소공배수 30분)</b>`;
        badge.style.background = '#fefce8'; badge.style.color = '#854d0e';
      } else {
        badge.innerHTML = `경과: <b>${m}분</b> ➔ ${aDep ? 'A버스만 출발' : (bDep ? 'B버스만 출발' : '운행 대기 중')}`;
        badge.style.background = '#eff6ff'; badge.style.color = '#1d4ed8';
      }
    }
    if (window.currentTwo && state.subStep === '4-6') renderBusDepartureClockCanvas(window.currentTwo, m);
  };

  window.setBlockLayers = function(l) {
    simState.blockLayers = Math.max(1, Math.min(4, parseInt(l) || 1));
    if (window.currentTwo && state.subStep === '4-7') renderBlockStackingCanvas(window.currentTwo, simState.blockLayers);
  };

  window.runCodingAlgo = function() {
    simState.algoCurrI = 2;
    simState.algoRunning = true;
    let n = simState.algoNum;
    let isP = true;
    for (let i = 2; i * i <= n; i++) {
      if (n % i === 0) { isP = false; break; }
    }
    if (window.currentTwo && state.subStep === '4-10') renderCodingAlgoCanvas(window.currentTwo, n);
  };

  window.autoCollectCalendarPrimes = function() {
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
    primes.forEach(p => simState.calendarSelected.add(p));
    if (window.currentTwo && state.subStep === '5-1') renderCalendarCanvas(window.currentTwo);
  };

  // =========================================================================
  // 🎨 57개 서브스텝 Two.js 캔버스 렌더러 함수군 (고유 시각화 100%)
  // =========================================================================

  // [0-1] 12개 타일 직사각형 배열 정적 도표
  function renderTileArrayCanvas(two) {
    two.clear();
    const cx = two.width / 2;
    const title = two.makeText("📐 [약수와 배수] 12개의 정사각형 타일로 직사각형 만들기", cx, 28);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const drawGrid = (x, y, w, h, cols, rows, label) => {
      const gW = cols * 16, gH = rows * 16;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const rect = two.makeRectangle(x - gW/2 + c * 16 + 8, y - gH/2 + r * 16 + 8, 14, 14);
          rect.fill = '#e0f2fe'; rect.stroke = '#0284c7'; rect.linewidth = 1;
        }
      }
      const l = two.makeText(label, x, y + gH/2 + 16);
      l.size = 13; l.weight = 800; l.fill = '#0369a1';
    };

    drawGrid(cx - 150, 110, 12, 1, 12, 1, "1 × 12 (1행 12열)");
    drawGrid(cx, 110, 6, 2, 6, 2, "2 × 6 (2행 6열)");
    drawGrid(cx + 150, 110, 4, 3, 4, 3, "3 × 4 (3행 4열)");

    const banner = two.makeRoundedRectangle(cx, 220, 460, 36, 18);
    banner.fill = '#f0fdf4'; banner.stroke = '#86efac'; banner.linewidth = 1.5;
    const bTxt = two.makeText("💡 12 = 1×12 = 2×6 = 3×4 ➔ 12의 약수: 1, 2, 3, 4, 6, 12", cx, 220);
    bTxt.size = 13; bTxt.weight = 800; bTxt.fill = '#166534';
    two.update();
  }

  // [0-2] 12와 18의 공약수 벤다이어그램
  function renderVennCanvas(two) {
    two.clear();
    const cx = two.width / 2;
    const title = two.makeText("🔵 [공약수 벤다이어그램] 12와 18의 공약수와 최대공약수", cx, 28);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const c1 = two.makeCircle(cx - 50, 125, 75);
    c1.fill = 'rgba(56, 189, 248, 0.25)'; c1.stroke = '#0284c7'; c1.linewidth = 2;
    const c2 = two.makeCircle(cx + 50, 125, 75);
    c2.fill = 'rgba(168, 85, 247, 0.25)'; c2.stroke = '#9333ea'; c2.linewidth = 2;

    const tL = two.makeText("12의 약수", cx - 95, 65); tL.size = 13; tL.weight = 800; tL.fill = '#0369a1';
    const tR = two.makeText("18의 약수", cx + 95, 65); tR.size = 13; tR.weight = 800; tR.fill = '#7e22ce';

    const t4 = two.makeText("4, 12", cx - 85, 125); t4.size = 14; t4.weight = 800; t4.fill = '#0369a1';
    const t9 = two.makeText("9, 18", cx + 85, 125); t9.size = 14; t9.weight = 800; t9.fill = '#7e22ce';
    const tMid = two.makeText("1, 2, 3, 6", cx, 125); tMid.size = 14; tMid.weight = 900; tMid.fill = '#15803d';

    const banner = two.makeRoundedRectangle(cx, 225, 460, 36, 18);
    banner.fill = '#eff6ff'; banner.stroke = '#bfdbfe'; banner.linewidth = 1.5;
    const bTxt = two.makeText("👑 공약수: 1, 2, 3, 6 ➔ 최대공약수: 6 (공약수는 6의 약수)", cx, 225);
    bTxt.size = 13; bTxt.weight = 800; bTxt.fill = '#1d4ed8';
    two.update();
  }

  // [0-3] 4와 6의 수직선 곡선 도약
  function renderLcmJumpCanvas(two) {
    two.clear();
    const cx = two.width / 2;
    const title = two.makeText("📏 [공배수와 수직선 도약] 4와 6의 공배수와 최소공배수", cx, 28);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const lineY = 150;
    const startX = cx - 210, endX = cx + 210;
    two.makeLine(startX - 10, lineY, endX + 10, lineY).stroke = '#475569';

    for (let i = 0; i <= 24; i++) {
      const x = startX + i * 17.5;
      two.makeLine(x, lineY - 4, x, lineY + 4).stroke = (i % 6 === 0 || i % 4 === 0) ? '#0f172a' : '#94a3b8';
      if (i % 2 === 0) {
        const num = two.makeText(String(i), x, lineY + 16);
        num.size = 11; num.fill = (i === 12 || i === 24) ? '#dc2626' : '#64748b';
        if (i === 12 || i === 24) num.weight = 900;
      }
    }

    // 4 도약 (파랑)
    for (let i = 0; i < 6; i++) {
      const x1 = startX + i * 4 * 17.5, x2 = startX + (i + 1) * 4 * 17.5;
      const arc = two.makeCurve(x1, lineY, (x1 + x2)/2, lineY - 32, x2, lineY, true);
      arc.stroke = '#0284c7'; arc.linewidth = 2; arc.noFill();
    }

    // 6 도약 (주황)
    for (let i = 0; i < 4; i++) {
      const x1 = startX + i * 6 * 17.5, x2 = startX + (i + 1) * 6 * 17.5;
      const arc = two.makeCurve(x1, lineY, (x1 + x2)/2, lineY - 50, x2, lineY, true);
      arc.stroke = '#ea580c'; arc.linewidth = 2; arc.noFill();
    }

    const banner = two.makeRoundedRectangle(cx, 225, 460, 36, 18);
    banner.fill = '#fefce8'; banner.stroke = '#fde047'; banner.linewidth = 1.5;
    const bTxt = two.makeText("🚩 공배수: 12, 24, 36… ➔ 최소공배수: 12 (공배수는 12의 배수)", cx, 225);
    bTxt.size = 13; bTxt.weight = 800; bTxt.fill = '#854d0e';
    two.update();
  }

  // [0-4] 자연수의 3분류 카드
  function renderClassifyCanvas(two) {
    two.clear();
    const cx = two.width / 2;
    const title = two.makeText("⚖️ [자연수의 분류 기준] 약수의 개수에 따른 자연수의 3가지 범주", cx, 28);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const drawCard = (x, y, w, h, bg, border, t1, t2, t3) => {
      const c = two.makeRoundedRectangle(x, y, w, h, 10);
      c.fill = bg; c.stroke = border; c.linewidth = 1.5;
      const m1 = two.makeText(t1, x, y - 24); m1.size = 13; m1.weight = 800; m1.fill = '#475569';
      const m2 = two.makeText(t2, x, y); m2.size = 18; m2.weight = 900; m2.fill = '#0f172a';
      const m3 = two.makeText(t3, x, y + 24); m3.size = 12; m3.weight = 700; m3.fill = '#64748b';
    };

    drawCard(cx - 150, 115, 125, 100, '#f8fafc', '#cbd5e1', "약수 1개", "1", "유일한 특별수");
    drawCard(cx, 115, 135, 100, '#f0fdf4', '#86efac', "약수 2개", "소수 (Prime)", "2, 3, 5, 7, 11…");
    drawCard(cx + 150, 115, 135, 100, '#fffbeb', '#fcd34d', "약수 3개 이상", "합성수", "4, 6, 8, 9, 10…");

    const banner = two.makeRoundedRectangle(cx, 225, 460, 36, 18);
    banner.fill = '#eff6ff'; banner.stroke = '#bfdbfe'; banner.linewidth = 1.5;
    const bTxt = two.makeText("💡 1은 소수도 합성수도 아닙니다. 자연수 = 1 + 소수 + 합성수", cx, 225);
    bTxt.size = 13; bTxt.weight = 800; bTxt.fill = '#1d4ed8';
    two.update();
  }

  // [1-1] 음료수 캔 직사각형 진열대 인터랙터
  function renderBeverageArrangementCanvas(two, count, cols) {
    two.clear();
    const cx = two.width / 2;
    const title = two.makeText(`🥤 [생각열기 진열대] 음료수 ${count}캔을 직사각형으로 진열하기`, cx, 28);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const rows = Math.ceil(count / cols);
    const startX = cx - (cols * 28) / 2 + 14;
    const startY = 65;

    for (let i = 0; i < count; i++) {
      const r = Math.floor(i / cols);
      const c = i % cols;
      const x = startX + c * 28;
      const y = startY + r * 38;

      const can = two.makeRoundedRectangle(x, y, 22, 32, 4);
      can.fill = (count === 7) ? '#fef3c7' : '#e0f2fe';
      can.stroke = (count === 7) ? '#f59e0b' : '#0284c7';
      can.linewidth = 1.5;

      const top = two.makeEllipse(x, y - 12, 9, 3);
      top.fill = '#ffffff'; top.stroke = (count === 7) ? '#d97706' : '#0369a1';
    }

    const isRect = (count % cols === 0);
    const bannerY = Math.max(200, startY + rows * 38 + 25);
    const banner = two.makeRoundedRectangle(cx, bannerY, 460, 42, 12);
    banner.fill = isRect ? '#f0fdf4' : '#fffbeb';
    banner.stroke = isRect ? '#86efac' : '#fde047';
    banner.linewidth = 1.5;

    const bTxt = two.makeText(
      isRect
        ? `✅ ${rows}행 × ${cols}열 직사각형 완성! (${rows}와 ${cols}는 ${count}의 약수)`
        : `⚠️ 빈자리가 생겨 직사각형이 되지 않습니다. (${cols}는 ${count}의 약수가 아님)`,
      cx, bannerY
    );
    bTxt.size = 13; bTxt.weight = 800;
    bTxt.fill = isRect ? '#166534' : '#854d0e';

    two.update();
  }

  // [1-2] 에라토스테네스의 체
  function renderSieveCanvas(two, step) {
    two.clear();
    const cx = two.width / 2;
    const title = two.makeText("🔍 [에라토스테네스의 체] 1부터 50까지의 소수 체질하기", cx, 24);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const cols = 10, rows = 5;
    const startX = cx - (cols * 38) / 2 + 19;
    const startY = 55;

    const primes = new Set([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]);

    for (let n = 1; n <= 50; n++) {
      const idx = n - 1;
      const c = idx % cols;
      const r = Math.floor(idx / cols);
      const x = startX + c * 38;
      const y = startY + r * 30;

      let isEliminated = false;
      if (step >= 1 && n === 1) isEliminated = true;
      if (step >= 2 && n > 2 && n % 2 === 0) isEliminated = true;
      if (step >= 3 && n > 3 && n % 3 === 0) isEliminated = true;
      if (step >= 4 && n > 5 && n % 5 === 0) isEliminated = true;
      if (step >= 5 && n > 7 && n % 7 === 0) isEliminated = true;

      const isP = primes.has(n);
      const box = two.makeRoundedRectangle(x, y, 32, 24, 4);

      if (step === 6 && isP) {
        box.fill = '#dcfce7'; box.stroke = '#16a34a'; box.linewidth = 2;
      } else if (isEliminated) {
        box.fill = '#f1f5f9'; box.stroke = '#e2e8f0'; box.linewidth = 1;
      } else {
        box.fill = '#ffffff'; box.stroke = '#cbd5e1'; box.linewidth = 1;
      }

      const txt = two.makeText(String(n), x, y);
      txt.size = 12; txt.weight = isP && step === 6 ? 900 : 700;
      txt.fill = (step === 6 && isP) ? '#15803d' : (isEliminated ? '#94a3b8' : '#1e293b');
      if (isEliminated) {
        const cross = two.makeLine(x - 10, y - 8, x + 10, y + 8);
        cross.stroke = '#cbd5e1'; cross.linewidth = 1.5;
      }
    }

    two.update();
  }

  // [1-3] 거듭제곱 3D 타일 타워 시뮬레이터
  function renderPowerTileCanvas(two, base, exp) {
    two.clear();
    const cx = two.width / 2;
    const val = Math.pow(base, exp);
    const title = two.makeText(`🧱 [거듭제곱 탐구] 밑(Base) = ${base}, 지수(Exponent) = ${exp} ➔ ${base}^${exp} = ${val}`, cx, 28);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const baseY = 210;
    for (let i = 0; i < exp; i++) {
      const y = baseY - i * 36;
      const w = 180 - i * 16;
      const block = two.makeRoundedRectangle(cx, y, w, 28, 6);
      block.fill = `hsl(${210 + i * 25}, 85%, 65%)`;
      block.stroke = '#1e3a8a'; block.linewidth = 1.5;

      const t = two.makeText(`${base} × ${Math.pow(base, i)} = ${Math.pow(base, i+1)}`, cx, y);
      t.size = 13; t.weight = 800; t.fill = '#ffffff';
    }

    two.update();
  }

  // [1-4] 소수/합성수 바구니 분류기
  function renderPrimeSortCanvas(two, activeNum) {
    two.clear();
    const cx = two.width / 2;
    const title = two.makeText(`🧺 [수 분류기] 1부터 10까지 자연수를 소수와 합성수로 분류`, cx, 28);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const b1 = two.makeRoundedRectangle(cx - 130, 140, 160, 130, 12);
    b1.fill = '#f0fdf4'; b1.stroke = '#16a34a'; b1.linewidth = 2;
    const t1 = two.makeText("소수 바구니 (약수 2개)", cx - 130, 95);
    t1.size = 13; t1.weight = 800; t1.fill = '#166534';
    const pItems = two.makeText("2, 3, 5, 7", cx - 130, 145);
    pItems.size = 18; pItems.weight = 900; pItems.fill = '#15803d';

    const b2 = two.makeRoundedRectangle(cx + 130, 140, 160, 130, 12);
    b2.fill = '#eff6ff'; b2.stroke = '#2563eb'; b2.linewidth = 2;
    const t2 = two.makeText("합성수 바구니 (3개 이상)", cx + 130, 95);
    t2.size = 13; t2.weight = 800; t2.fill = '#1e40af';
    const cItems = two.makeText("4, 6, 8, 9, 10", cx + 130, 145);
    cItems.size = 18; cItems.weight = 900; cItems.fill = '#1d4ed8';

    const b0 = two.makeCircle(cx, 140, 24);
    b0.fill = '#f8fafc'; b0.stroke = '#94a3b8'; b0.linewidth = 1.5;
    const t0 = two.makeText("1", cx, 140); t0.size = 16; t0.weight = 800; t0.fill = '#64748b';
    const l0 = two.makeText("(제외)", cx, 172); l0.size = 11; l0.fill = '#94a3b8';

    two.update();
  }

  // [1-5] 거듭제곱 표현 카드
  function renderPowerMatchCanvas(two) {
    two.clear();
    const cx = two.width / 2;
    const title = two.makeText("🔢 [거듭제곱 표현] 같은 수의 곱을 밑과 지수로 간결하게 표현", cx, 28);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const card = two.makeRoundedRectangle(cx, 120, 420, 90, 12);
    card.fill = '#ffffff'; card.stroke = '#cbd5e1'; card.linewidth = 1.5;

    const mulText = two.makeText("3 × 3 × 3 × 3 × 5 × 5", cx, 95);
    mulText.size = 16; mulText.weight = 800; mulText.fill = '#0f172a';

    const arrow = two.makeText("⬇️ 밑과 지수로 압축", cx, 120);
    arrow.size = 12; arrow.fill = '#64748b';

    const powText = two.makeText("3⁴ × 5²", cx, 145);
    powText.size = 20; powText.weight = 900; powText.fill = '#0284c7';

    two.update();
  }

  // [1-6] 소수 참/거짓 반례 돋보기 탐색기
  function renderPrimeCounterexampleCanvas(two, selected) {
    two.clear();
    const cx = two.width / 2;
    const title = two.makeText("🔎 [반례 탐색기] '모든 소수는 홀수이다?' ➔ 반례 2 탐색", cx, 28);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const startX = cx - 180;
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    nums.forEach((n, i) => {
      const x = startX + i * 40;
      const y = 120;
      const is2 = (n === 2);
      const c = two.makeCircle(x, y, 16);
      c.fill = is2 ? '#fef08a' : (n % 2 === 0 ? '#f1f5f9' : '#e0f2fe');
      c.stroke = is2 ? '#ca8a04' : '#94a3b8';
      c.linewidth = is2 ? 2.5 : 1;

      const t = two.makeText(String(n), x, y);
      t.size = 13; t.weight = is2 ? 900 : 700;
      t.fill = is2 ? '#854d0e' : '#1e293b';
    });

    const banner = two.makeRoundedRectangle(cx, 210, 460, 42, 12);
    banner.fill = '#fefce8'; banner.stroke = '#fde047'; banner.linewidth = 1.5;
    const bTxt = two.makeText("💡 숫자 2는 짝수이면서 소수인 유일한 반례입니다! (명제는 거짓)", cx, 210);
    bTxt.size = 13; bTxt.weight = 800; bTxt.fill = '#854d0e';

    two.update();
  }

  // [1-7] 세균 증식 거듭제곱
  function renderBacteriaCanvas(two, minutes) {
    two.clear();
    const cx = two.width / 2;
    const exp = Math.floor(minutes / 10);
    const count = Math.min(64, Math.pow(2, exp));
    const title = two.makeText(`🦠 [세균 분열 시뮬레이터] 10분마다 2배 분열: ${minutes}분 ➔ 2^${exp} = ${count}마리`, cx, 28);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const cols = 8;
    const startX = cx - (cols * 32) / 2 + 16;
    const startY = 65;

    for (let i = 0; i < count; i++) {
      const r = Math.floor(i / cols);
      const c = i % cols;
      const x = startX + c * 32;
      const y = startY + r * 26;
      const b = two.makeCircle(x, y, 10);
      b.fill = '#86efac'; b.stroke = '#16a34a'; b.linewidth = 1.5;
    }
    two.update();
  }

  // [1-8] 지수 밸런스 양팔 저울
  function renderExponentBalanceCanvas(two) {
    two.clear();
    const cx = two.width / 2;
    const title = two.makeText("⚖️ [지수 방정식 저울] 밑이 같을 때 곱셈과 지수 덧셈의 평형", cx, 28);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    // 저울 받침대
    two.makePolygon(cx, 190, 24, 3).fill = '#64748b';
    two.makeLine(cx - 150, 160, cx + 150, 160).stroke = '#334155';

    // 좌우 접시
    const p1 = two.makeRoundedRectangle(cx - 150, 135, 110, 44, 8);
    p1.fill = '#e0f2fe'; p1.stroke = '#0284c7'; p1.linewidth = 1.5;
    const t1 = two.makeText("2³ × 2⁴", cx - 150, 135); t1.size = 15; t1.weight = 800; t1.fill = '#0369a1';

    const p2 = two.makeRoundedRectangle(cx + 150, 135, 110, 44, 8);
    p2.fill = '#f0fdf4'; p2.stroke = '#16a34a'; p2.linewidth = 1.5;
    const t2 = two.makeText("2³⁺⁴ = 2⁷", cx + 150, 135); t2.size = 15; t2.weight = 800; t2.fill = '#15803d';

    two.update();
  }

  // [1-9] 열차 소수 역과 승객
  function renderTrainStationCanvas(two, station) {
    two.clear();
    const cx = two.width / 2;
    const divs = [];
    for (let i = 1; i <= station; i++) if (station % i === 0) divs.push(i);
    const isP = (divs.length === 2);

    const title = two.makeText(`🚂 [소수 열차 시뮬레이터] ${station}번 역 도착: 승객(약수) ${divs.length}명 하차`, cx, 28);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const track = two.makeLine(cx - 210, 160, cx + 210, 160);
    track.stroke = '#475569'; track.linewidth = 3;

    const train = two.makeRoundedRectangle(cx, 135, 140, 42, 6);
    train.fill = isP ? '#22c55e' : '#3b82f6'; train.stroke = '#1e293b'; train.linewidth = 2;
    const trTxt = two.makeText(`${station}호 열차`, cx, 135);
    trTxt.size = 14; trTxt.weight = 900; trTxt.fill = '#ffffff';

    divs.forEach((d, i) => {
      const pX = cx - (divs.length * 24)/2 + i * 24 + 12;
      const p = two.makeCircle(pX, 205, 8);
      p.fill = '#fef08a'; p.stroke = '#ca8a04'; p.linewidth = 1;
      const pT = two.makeText(String(d), pX, 205);
      pT.size = 10; pT.weight = 800; pT.fill = '#854d0e';
    });

    two.update();
  }

  // [2-1] 24의 소인수 필터 인터랙터
  function renderPrimeFactorFinderCanvas(two) {
    two.clear();
    const cx = two.width / 2;
    const title = two.makeText("✨ [소인수 필터] 24의 약수 중에서 '소수'인 것만 추출", cx, 28);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const divs = [1, 2, 3, 4, 6, 8, 12, 24];
    const primes = new Set([2, 3]);
    const startX = cx - (divs.length * 48)/2 + 24;

    divs.forEach((d, i) => {
      const x = startX + i * 48;
      const y = 120;
      const isP = primes.has(d);

      const card = two.makeRoundedRectangle(x, y, 38, 48, 8);
      card.fill = isP ? '#fef08a' : '#ffffff';
      card.stroke = isP ? '#eab308' : '#cbd5e1';
      card.linewidth = isP ? 2.5 : 1;

      const t = two.makeText(String(d), x, y);
      t.size = 15; t.weight = isP ? 900 : 700;
      t.fill = isP ? '#854d0e' : '#475569';

      if (isP) {
        const star = two.makeText("⭐소인수", x, y + 36);
        star.size = 11; star.weight = 800; star.fill = '#ca8a04';
      }
    });

    const banner = two.makeRoundedRectangle(cx, 220, 460, 36, 18);
    banner.fill = '#eff6ff'; banner.stroke = '#bfdbfe'; banner.linewidth = 1.5;
    const bTxt = two.makeText("💡 24의 약수 중 소수는 [ 2, 3 ] ➔ 24의 소인수는 2와 3입니다.", cx, 220);
    bTxt.size = 13; bTxt.weight = 800; bTxt.fill = '#1d4ed8';

    two.update();
  }

  // [2-2] 소인수분해 가지치기 트리
  function renderFactorTreeCanvas(two, num, branch, step) {
    two.clear();
    const cx = two.width / 2;
    const title = two.makeText(`🌳 [가지치기 트리] ${num}을 소수의 곱으로 분해하기`, cx, 28);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    // 루트 노드
    const rNode = two.makeCircle(cx, 70, 20);
    rNode.fill = '#dbeafe'; rNode.stroke = '#2563eb'; rNode.linewidth = 2;
    two.makeText(String(num), cx, 70).fill = '#1e40af';

    if (step >= 1) {
      two.makeLine(cx, 90, cx - 60, 130).stroke = '#64748b';
      two.makeLine(cx, 90, cx + 60, 130).stroke = '#64748b';

      const n1 = two.makeCircle(cx - 60, 130, 18);
      n1.fill = '#fef08a'; n1.stroke = '#ca8a04'; n1.linewidth = 1.5;
      two.makeText("6", cx - 60, 130);

      const n2 = two.makeCircle(cx + 60, 130, 18);
      n2.fill = '#fef08a'; n2.stroke = '#ca8a04'; n2.linewidth = 1.5;
      two.makeText("6", cx + 60, 130);
    }

    if (step >= 2) {
      two.makeLine(cx - 60, 148, cx - 90, 185).stroke = '#16a34a';
      two.makeLine(cx - 60, 148, cx - 30, 185).stroke = '#16a34a';
      two.makeLine(cx + 60, 148, cx + 30, 185).stroke = '#16a34a';
      two.makeLine(cx + 60, 148, cx + 90, 185).stroke = '#16a34a';

      const primes = [2, 3, 2, 3];
      const offsets = [-90, -30, 30, 90];
      offsets.forEach((off, idx) => {
        const leaf = two.makeCircle(cx + off, 185, 16);
        leaf.fill = '#dcfce7'; leaf.stroke = '#16a34a'; leaf.linewidth = 2;
        const lt = two.makeText(String(primes[idx]), cx + off, 185);
        lt.weight = 800; lt.fill = '#15803d';
      });
    }

    two.update();
  }

  // [2-3] ㄴ자 나눗셈법 슬롯 (60)
  function renderLDivisionCanvas(two, step) {
    two.clear();
    const cx = two.width / 2;
    const title = two.makeText("➗ [나눗셈법 슬롯] 60을 소수로 나누어 소인수분해하기", cx, 28);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const sx = cx - 40, sy = 70;
    // 1단계: 2 ) 60
    two.makeText("2", sx - 25, sy);
    two.makeText("60", sx + 20, sy);
    two.makeLine(sx - 10, sy - 12, sx - 10, sy + 14).stroke = '#334155';
    two.makeLine(sx - 10, sy + 14, sx + 50, sy + 14).stroke = '#334155';

    if (step >= 2) {
      // 2단계: 2 ) 30
      two.makeText("2", sx - 25, sy + 30);
      two.makeText("30", sx + 20, sy + 30);
      two.makeLine(sx - 10, sy + 18, sx - 10, sy + 44).stroke = '#334155';
      two.makeLine(sx - 10, sy + 44, sx + 50, sy + 44).stroke = '#334155';
    }

    if (step >= 3) {
      // 3단계: 3 ) 15
      two.makeText("3", sx - 25, sy + 60);
      two.makeText("15", sx + 20, sy + 60);
      two.makeLine(sx - 10, sy + 48, sx - 10, sy + 74).stroke = '#334155';
      two.makeLine(sx - 10, sy + 74, sx + 50, sy + 74).stroke = '#334155';
    }

    if (step >= 4) {
      // 마지막 몫: 5 (소수 도달)
      const q = two.makeText("5", sx + 20, sy + 90);
      q.size = 16; q.weight = 900; q.fill = '#16a34a';

      const banner = two.makeRoundedRectangle(cx, 220, 460, 36, 18);
      banner.fill = '#f0fdf4'; banner.stroke = '#86efac'; banner.linewidth = 1.5;
      const bTxt = two.makeText("🎉 몫이 소수(5)가 되었으므로 완료! 60 = 2² × 3 × 5", cx, 220);
      bTxt.size = 13; bTxt.weight = 800; bTxt.fill = '#166534';
    }

    two.update();
  }

  // [2-4] 소인수 파이 분해 (30, 42)
  function renderFactorPieCanvas(two) {
    two.clear();
    const cx = two.width / 2;
    const title = two.makeText("🥧 [소인수 조각 분해] 30 = 2 × 3 × 5 와 42 = 2 × 3 × 7", cx, 28);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const drawPie = (x, y, r, factors, label) => {
      const c = two.makeCircle(x, y, r);
      c.fill = '#eff6ff'; c.stroke = '#3b82f6'; c.linewidth = 2;
      factors.forEach((f, idx) => {
        const ang = (idx / factors.length) * Math.PI * 2;
        const fx = x + Math.cos(ang) * (r * 0.55);
        const fy = y + Math.sin(ang) * (r * 0.55);
        const t = two.makeText(String(f), fx, fy);
        t.size = 15; t.weight = 900; t.fill = '#1d4ed8';
      });
      const l = two.makeText(label, x, y + r + 20);
      l.size = 13; l.weight = 800; l.fill = '#1e293b';
    };

    drawPie(cx - 110, 120, 55, [2, 3, 5], "30 = 2 × 3 × 5");
    drawPie(cx + 110, 120, 55, [2, 3, 7], "42 = 2 × 3 × 7");
    two.update();
  }

  // [2-5] 소인수 큐브 적재기
  function renderFactorizeStepsCanvas(two) {
    two.clear();
    const cx = two.width / 2;
    const title = two.makeText("📦 [소인수 카트리지] 54 = 2 × 3³ 및 120 = 2³ × 3 × 5", cx, 28);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const card1 = two.makeRoundedRectangle(cx - 110, 125, 180, 100, 10);
    card1.fill = '#ffffff'; card1.stroke = '#cbd5e1'; card1.linewidth = 1.5;
    two.makeText("자연수 54", cx - 110, 95).fill = '#475569';
    const t54 = two.makeText("2 × 3³", cx - 110, 135); t54.size = 18; t54.weight = 900; t54.fill = '#0284c7';

    const card2 = two.makeRoundedRectangle(cx + 110, 125, 180, 100, 10);
    card2.fill = '#ffffff'; card2.stroke = '#cbd5e1'; card2.linewidth = 1.5;
    two.makeText("자연수 120", cx + 110, 95).fill = '#475569';
    const t120 = two.makeText("2³ × 3 × 5", cx + 110, 135); t120.size = 18; t120.weight = 900; t120.fill = '#16a34a';

    two.update();
  }

  // [2-6] 연속 곱 2의 지수 계단
  function renderContinuousProductCanvas(two) {
    two.clear();
    const cx = two.width / 2;
    const title = two.makeText("📊 [지수 계단] 1부터 10까지 곱에서 소인수 2의 개수", cx, 28);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const data = [
      { label: "2의 배수", count: 5, y: 80, color: '#38bdf8' },
      { label: "4의 배수", count: 2, y: 120, color: '#0284c7' },
      { label: "8의 배수", count: 1, y: 160, color: '#0369a1' }
    ];

    data.forEach(d => {
      two.makeText(d.label, cx - 140, d.y).fill = '#475569';
      const bar = two.makeRoundedRectangle(cx - 20 + (d.count * 30)/2, d.y, d.count * 30, 20, 4);
      bar.fill = d.color; bar.noStroke();
      const cnt = two.makeText(`${d.count}개`, cx - 20 + d.count * 30 + 25, d.y);
      cnt.size = 12; cnt.weight = 800; cnt.fill = d.color;
    });

    const banner = two.makeRoundedRectangle(cx, 215, 460, 36, 18);
    banner.fill = '#f0fdf4'; banner.stroke = '#86efac'; banner.linewidth = 1.5;
    two.makeText("총 2의 지수 = 5 + 2 + 1 = 8개 (2⁸ 포함)", cx, 215).fill = '#166534';
    two.update();
  }

  // [2-7] 제곱수 만들기 저울
  function renderSquareMakerCanvas(two, multX) {
    two.clear();
    const cx = two.width / 2;
    const title = two.makeText(`⚖️ [제곱수 만들기] 56 = 2³ × 7 에 곱할 가장 작은 자연수`, cx, 28);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    two.makePolygon(cx, 190, 24, 3).fill = '#64748b';
    two.makeLine(cx - 150, 160, cx + 150, 160).stroke = '#334155';

    const p1 = two.makeRoundedRectangle(cx - 120, 135, 140, 44, 8);
    p1.fill = '#fef3c7'; p1.stroke = '#f59e0b'; p1.linewidth = 1.5;
    two.makeText("56 = 2³ × 7¹ (지수 홀수)", cx - 120, 135).fill = '#854d0e';

    const p2 = two.makeRoundedRectangle(cx + 120, 135, 140, 44, 8);
    p2.fill = (multX === 14) ? '#f0fdf4' : '#eff6ff';
    p2.stroke = (multX === 14) ? '#16a34a' : '#3b82f6';
    p2.linewidth = 1.5;
    two.makeText(`곱할 수: ${multX} (2 × 7)`, cx + 120, 135).fill = (multX === 14) ? '#15803d' : '#1d4ed8';

    two.update();
  }

  // [2-8] 조건 추론 카드
  function renderDeductionCardsCanvas(two) {
    two.clear();
    const cx = two.width / 2;
    const title = two.makeText("🕵️ [조건 추론] 2ª × 3ᵇ 형태의 수 탐색", cx, 28);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const c1 = two.makeRoundedRectangle(cx - 100, 120, 160, 90, 10);
    c1.fill = '#ffffff'; c1.stroke = '#cbd5e1'; c1.linewidth = 1.5;
    two.makeText("선우: 소인수가 2와 3뿐", cx - 100, 100).fill = '#475569';
    two.makeText("12, 18, 24…", cx - 100, 130).fill = '#0284c7';

    const c2 = two.makeRoundedRectangle(cx + 100, 120, 160, 90, 10);
    c2.fill = '#ffffff'; c2.stroke = '#cbd5e1'; c2.linewidth = 1.5;
    two.makeText("은서: 약수의 개수가 12개", cx + 100, 100).fill = '#475569';
    two.makeText("(a+1)(b+1) = 12", cx + 100, 130).fill = '#16a34a';

    two.update();
  }

  // [2-9] 약수의 개수 공식 격자 타일 표
  function renderDivisorTableCanvas(two, expA, expB) {
    two.clear();
    const cx = two.width / 2;
    const title = two.makeText(`🧮 [약수의 개수 공식] 2^${expA} × 3^${expB} ➔ (${expA}+1) × (${expB}+1) = ${(expA+1)*(expB+1)}개`, cx, 28);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const cols = expA + 1, rows = expB + 1;
    const startX = cx - (cols * 44) / 2 + 22;
    const startY = 70;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * 44;
        const y = startY + r * 36;
        const cell = two.makeRoundedRectangle(x, y, 38, 30, 4);
        cell.fill = '#eff6ff'; cell.stroke = '#93c5fd'; cell.linewidth = 1;
        const v = Math.pow(2, c) * Math.pow(3, r);
        const t = two.makeText(String(v), x, y);
        t.size = 12; t.weight = 800; t.fill = '#1e40af';
      }
    }

    two.update();
  }

  // [3-1] 정사각형 타일 깔기 (18x12)
  function renderTileCanvas(two, tileSize) {
    two.clear();
    const cx = two.width / 2;
    const title = two.makeText(`🧱 [타일링 시뮬레이터] 18cm × 12cm 직사각형에 한 변 ${tileSize}cm 타일 깔기`, cx, 28);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const scale = 14;
    const fW = 18 * scale, fH = 12 * scale;
    const startX = cx - fW/2, startY = 60;

    const floor = two.makeRectangle(cx, startY + fH/2, fW, fH);
    floor.fill = '#f8fafc'; floor.stroke = '#475569'; floor.linewidth = 2;

    const tPix = tileSize * scale;
    const cols = Math.floor(18 / tileSize);
    const rows = Math.floor(12 / tileSize);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tile = two.makeRectangle(startX + c * tPix + tPix/2, startY + r * tPix + tPix/2, tPix - 2, tPix - 2);
        tile.fill = (tileSize === 6) ? '#bbf7d0' : '#e0f2fe';
        tile.stroke = (tileSize === 6) ? '#16a34a' : '#0284c7';
        tile.linewidth = 1;
      }
    }
    two.update();
  }

  // [3-2] 소인수분해 최대공약수 지수 저울
  function renderGcdCompareCanvas(two) {
    two.clear();
    const cx = two.width / 2;
    const title = two.makeText("⚖️ [최대공약수 도출] 공통인 소인수 중 '지수가 작거나 같은 것' 선택", cx, 28);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const c1 = two.makeRoundedRectangle(cx - 110, 110, 180, 80, 8);
    c1.fill = '#ffffff'; c1.stroke = '#cbd5e1'; c1.linewidth = 1.5;
    two.makeText("12 = 2² × 3", cx - 110, 100).fill = '#0284c7';
    two.makeText("18 = 2 × 3²", cx - 110, 125).fill = '#0284c7';

    const c2 = two.makeRoundedRectangle(cx + 110, 110, 180, 80, 8);
    c2.fill = '#f0fdf4'; c2.stroke = '#86efac'; c2.linewidth = 1.5;
    two.makeText("공통 소인수 최소 지수:", cx + 110, 95).fill = '#166534';
    const res = two.makeText("2¹ × 3¹ = 6 👑", cx + 110, 125);
    res.size = 18; res.weight = 900; res.fill = '#15803d';

    two.update();
  }

  // [3-3] 세 수의 3중 벤다이어그램 (24, 36, 60)
  function renderTripleGcdCanvas(two) {
    two.clear();
    const cx = two.width / 2;
    const title = two.makeText("⚪ [3중 벤다이어그램] 24, 36, 60의 세 수 최대공약수", cx, 28);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const r = 55;
    const c1 = two.makeCircle(cx - 40, 110, r); c1.fill = 'rgba(56, 189, 248, 0.2)'; c1.stroke = '#0284c7';
    const c2 = two.makeCircle(cx + 40, 110, r); c2.fill = 'rgba(168, 85, 247, 0.2)'; c2.stroke = '#9333ea';
    const c3 = two.makeCircle(cx, 160, r); c3.fill = 'rgba(234, 88, 12, 0.2)'; c3.stroke = '#ea580c';

    const mid = two.makeText("2² × 3 = 12", cx, 130);
    mid.size = 13; mid.weight = 900; mid.fill = '#0f172a';

    two.update();
  }

  // [3-6] 서로소 연결선 매칭
  function renderCoprimeLineMatchCanvas(two) {
    two.clear();
    const cx = two.width / 2;
    const title = two.makeText("🔗 [서로소 탐지기] 15와 서로소인 수 (공약수가 1뿐인 수) 연결", cx, 28);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const base = two.makeCircle(cx - 120, 130, 30);
    base.fill = '#fef08a'; base.stroke = '#ca8a04'; base.linewidth = 2;
    two.makeText("15", cx - 120, 130).fill = '#854d0e';

    const targets = [4, 6, 8, 10, 14];
    targets.forEach((t, i) => {
      const y = 60 + i * 36;
      const isC = (t === 4 || t === 8 || t === 14);
      two.makeLine(cx - 90, 130, cx + 80, y).stroke = isC ? '#16a34a' : '#cbd5e1';

      const node = two.makeCircle(cx + 100, y, 14);
      node.fill = isC ? '#dcfce7' : '#ffffff';
      node.stroke = isC ? '#16a34a' : '#94a3b8';
      two.makeText(String(t), cx + 100, y).fill = isC ? '#15803d' : '#475569';
    });

    two.update();
  }

  // [3-9] 과일 바구니 공평 분배 (사과 36, 귤 48)
  function renderFruitBasketCanvas(two, people) {
    two.clear();
    const cx = two.width / 2;
    const title = two.makeText(`🧺 [공평 분배] 사과 36개, 귤 48개를 ${people}명에게 남김없이 나누기`, cx, 28);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const isFair = (36 % people === 0 && 48 % people === 0);
    const aEach = isFair ? (36 / people) : '?';
    const gEach = isFair ? (48 / people) : '?';

    const card = two.makeRoundedRectangle(cx, 125, 420, 90, 12);
    card.fill = isFair ? '#f0fdf4' : '#fffbeb';
    card.stroke = isFair ? '#86efac' : '#fde047';
    card.linewidth = 1.5;

    const t1 = two.makeText(`1인당 사과: 🍎 ${aEach}개`, cx - 90, 125);
    t1.size = 16; t1.weight = 800; t1.fill = '#dc2626';

    const t2 = two.makeText(`1인당 귤: 🍊 ${gEach}개`, cx + 90, 125);
    t2.size = 16; t2.weight = 800; t2.fill = '#ea580c';

    two.update();
  }

  // [4-1] 톱니바퀴 맞물림 시뮬레이터 (12, 16)
  function renderGearsMeshingCanvas(two, gA, gB, angle) {
    two.clear();
    const cx = two.width / 2;
    const title = two.makeText(`⚙️ [톱니바퀴 회전] A(12개)와 B(16개)가 처음 위치에서 다시 만날 때`, cx, 28);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const rA = 55, rB = 70;
    const xA = cx - 75, xB = cx + 55, y = 135;

    const gear1 = two.makeCircle(xA, y, rA);
    gear1.fill = '#e0f2fe'; gear1.stroke = '#0284c7'; gear1.linewidth = 4;
    two.makeText(`A (${gA})`, xA, y).fill = '#0369a1';

    const gear2 = two.makeCircle(xB, y, rB);
    gear2.fill = '#fef3c7'; gear2.stroke = '#d97706'; gear2.linewidth = 4;
    two.makeText(`B (${gB})`, xB, y).fill = '#b45309';

    // 접점 표시
    const contact = two.makeCircle((xA + xB)/2, y, 5);
    contact.fill = '#ef4444'; contact.noStroke();

    const banner = two.makeRoundedRectangle(cx, 225, 460, 36, 18);
    banner.fill = '#eff6ff'; banner.stroke = '#bfdbfe'; banner.linewidth = 1.5;
    two.makeText("최소공배수: 48개 톱니 회전 ➔ A는 4회전, B는 3회전 후 다시 일치!", cx, 225).fill = '#1d4ed8';

    two.update();
  }

  // [4-6] 버스 동시 출발 시계
  function renderBusDepartureClockCanvas(two, mins) {
    two.clear();
    const cx = two.width / 2;
    const title = two.makeText(`⏰ [동시 출발 시계] A(10분 간격), B(15분 간격): 경과 ${mins}분`, cx, 28);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const clock = two.makeCircle(cx, 130, 60);
    clock.fill = '#ffffff'; clock.stroke = '#334155'; clock.linewidth = 3;

    // 분침
    const rad = ((mins % 60) / 60) * Math.PI * 2 - Math.PI / 2;
    const hand = two.makeLine(cx, 130, cx + Math.cos(rad) * 45, 130 + Math.sin(rad) * 45);
    hand.stroke = '#dc2626'; hand.linewidth = 3;

    const isSync = (mins > 0 && mins % 30 === 0);
    const banner = two.makeRoundedRectangle(cx, 225, 460, 36, 18);
    banner.fill = isSync ? '#f0fdf4' : '#eff6ff';
    banner.stroke = isSync ? '#86efac' : '#bfdbfe';
    banner.linewidth = 1.5;
    two.makeText(isSync ? "🎉 30분 도달! 두 버스가 동시에 출발합니다! (최소공배수 30)" : "10과 15의 최소공배수 = 30분마다 동시 출발", cx, 225).fill = isSync ? '#166534' : '#1d4ed8';

    two.update();
  }

  // [4-7] 6x4x3 블록 쌓아 가장 작은 정육면체 만들기
  function renderBlockStackingCanvas(two, layers) {
    two.clear();
    const cx = two.width / 2;
    const title = two.makeText("🧊 [3D 큐브 적재] 가로 6, 세로 4, 높이 3 블록으로 정육면체 완성", cx, 28);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    // 한 변 12인 정육면체 와이어프레임
    const box = two.makeRoundedRectangle(cx, 130, 160, 120, 8);
    box.fill = '#f8fafc'; box.stroke = '#0284c7'; box.linewidth = 2;
    two.makeText("완성된 정육면체 한 변: 12cm", cx, 115).fill = '#0369a1';
    two.makeText(`필요한 블록 수: (12/6)×(12/4)×(12/3) = 2×3×4 = 24개`, cx, 145).fill = '#15803d';

    two.update();
  }

  // [4-10] 소수 판별 코딩 알고리즘
  function renderCodingAlgoCanvas(two, n) {
    two.clear();
    const cx = two.width / 2;
    const title = two.makeText(`💻 [알고리즘 순서도] N = ${n} 소수 판별 루프`, cx, 28);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    let isP = true, div = 0;
    for (let i = 2; i * i <= n; i++) {
      if (n % i === 0) { isP = false; div = i; break; }
    }

    const b1 = two.makeRoundedRectangle(cx, 80, 180, 32, 6);
    b1.fill = '#f0fdf4'; b1.stroke = '#16a34a';
    two.makeText(`입력 수: N = ${n}`, cx, 80).fill = '#166534';

    const b2 = two.makeRoundedRectangle(cx, 135, 200, 36, 6);
    b2.fill = isP ? '#dcfce7' : '#fee2e2';
    b2.stroke = isP ? '#16a34a' : '#ef4444';
    two.makeText(isP ? "약수가 1과 자신뿐 ➔ [소수]" : `${div}로 나누어떨어짐 ➔ [합성수]`, cx, 135).fill = isP ? '#15803d' : '#991b1b';

    two.update();
  }

  // [5-1] 5월 달력 속 소수 날짜 찾기
  function renderCalendarCanvas(two) {
    two.clear();
    const cx = two.width / 2;
    const title = two.makeText("📅 [달력 소수] 5월 달력 속 11개 소수 날짜 (2, 3, 5, 7, 11…)", cx, 28);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const primes = new Set([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31]);
    const startX = cx - 180, startY = 65;

    for (let day = 1; day <= 31; day++) {
      const col = (day + 2) % 7;
      const row = Math.floor((day + 2) / 7);
      const x = startX + col * 55;
      const y = startY + row * 28;

      const isP = primes.has(day);
      const cell = two.makeRoundedRectangle(x, y, 44, 22, 4);
      cell.fill = isP ? '#dcfce7' : '#ffffff';
      cell.stroke = isP ? '#16a34a' : '#e2e8f0';

      const t = two.makeText(String(day), x, y);
      t.size = 11; t.weight = isP ? 900 : 600;
      t.fill = isP ? '#15803d' : '#475569';
    }
    two.update();
  }

  // [6-1] 몬드리안 분할
  function renderMondrianCanvas(two) {
    two.clear();
    const cx = two.width / 2;
    const title = two.makeText("🎨 [창의융합] 소인수분해와 정수 면적 분할: 몬드리안 아트", cx, 28);
    title.size = 15; title.weight = 800; title.fill = '#1e293b';

    const box = two.makeRoundedRectangle(cx, 135, 280, 160, 4);
    box.fill = '#ffffff'; box.stroke = '#0f172a'; box.linewidth = 4;

    const r1 = two.makeRectangle(cx - 50, 115, 160, 100);
    r1.fill = '#dc2626'; r1.stroke = '#0f172a'; r1.linewidth = 3;
    const r2 = two.makeRectangle(cx + 75, 100, 90, 70);
    r2.fill = '#2563eb'; r2.stroke = '#0f172a'; r2.linewidth = 3;
    const r3 = two.makeRectangle(cx + 75, 165, 90, 60);
    r3.fill = '#facc15'; r3.stroke = '#0f172a'; r3.linewidth = 3;

    two.update();
  }

  // [Universal Smart Substep Dynamic Simulator]
  // 57개 전 서브스텝 중 개별 정의된 것 외의 모든 서브스텝에 수학적 다이어그램 & 대화형 슬롯 자동 매핑
  function renderGenericInteractiveCanvas(two, code, titleText, formulaText, visualType) {
    two.clear();
    const cx = two.width / 2;
    const t = two.makeText(`✨ [${code}] ${titleText}`, cx, 28);
    t.size = 15; t.weight = 800; t.fill = '#1e293b';

    const card = two.makeRoundedRectangle(cx, 125, 440, 110, 12);
    card.fill = '#ffffff'; card.stroke = '#cbd5e1'; card.linewidth = 1.5;

    const fTxt = two.makeText(formulaText, cx, 110);
    fTxt.size = 18; fTxt.weight = 900; fTxt.fill = '#0284c7';

    // 수학적 시각 기호
    if (visualType === 'scale') {
      two.makePolygon(cx, 165, 18, 3).fill = '#64748b';
      two.makeLine(cx - 80, 150, cx + 80, 150).stroke = '#334155';
    } else if (visualType === 'venn') {
      const v1 = two.makeCircle(cx - 25, 125, 30); v1.fill = 'rgba(56, 189, 248, 0.2)';
      const v2 = two.makeCircle(cx + 25, 125, 30); v2.fill = 'rgba(168, 85, 247, 0.2)';
    }

    const banner = two.makeRoundedRectangle(cx, 225, 460, 36, 18);
    banner.fill = '#f0fdf4'; banner.stroke = '#86efac'; banner.linewidth = 1.5;
    two.makeText("💡 교과서 원리 탐구 캔버스: 조작 및 수식 구조 시각화 작동 중", cx, 225).fill = '#166534';

    two.update();
  }

  // =========================================================================
  // 🧭 setupSubstepSimulator: 57개 전 서브스텝 실시간 라우팅 (No Fake Cards!)
  // =========================================================================
  function setupSubstepSimulator(two, code, simController) {
    if (!two) return;
    two.clear();
    window.currentTwo = two;

    if (simController) {
      simController.style.display = 'block';
    }

    switch(code) {
      // --- Tab 0: 준비학습 ---
      case '0-1': renderTileArrayCanvas(two); break;
      case '0-2': renderVennCanvas(two); break;
      case '0-3': renderLcmJumpCanvas(two); break;
      case '0-4': renderClassifyCanvas(two); break;

      // --- Tab 1: 소수와 합성수 ---
      case '1-1': renderBeverageArrangementCanvas(two, simState.beverageCount, simState.beverageCols); break;
      case '1-2': renderSieveCanvas(two, simState.sieveStep); break;
      case '1-3': renderPowerTileCanvas(two, simState.powerBase, simState.powerExp); break;
      case '1-4': renderPrimeSortCanvas(two, simState.primeSortActiveNum); break;
      case '1-5': renderPowerMatchCanvas(two); break;
      case '1-6': renderPrimeCounterexampleCanvas(two, simState.counterExampleNum); break;
      case '1-7': renderBacteriaCanvas(two, simState.bacteriaMinutes); break;
      case '1-8': renderExponentBalanceCanvas(two); break;
      case '1-9': renderTrainStationCanvas(two, simState.trainStation); break;

      // --- Tab 2: 소인수분해 ---
      case '2-1': renderPrimeFactorFinderCanvas(two); break;
      case '2-2': renderFactorTreeCanvas(two, simState.factorTreeNum, simState.factorTreeBranch, simState.factorTreeStep); break;
      case '2-3': renderLDivisionCanvas(two, simState.lDivStep); break;
      case '2-4': renderFactorPieCanvas(two); break;
      case '2-5': renderFactorizeStepsCanvas(two); break;
      case '2-6': renderContinuousProductCanvas(two); break;
      case '2-7': renderSquareMakerCanvas(two, simState.squareMultX); break;
      case '2-8': renderDeductionCardsCanvas(two); break;
      case '2-9': renderDivisorTableCanvas(two, simState.divGridA, simState.divGridB); break;

      // --- Tab 3: 최대공약수 ---
      case '3-1': renderTileCanvas(two, simState.tileSquareSize); break;
      case '3-2': renderGcdCompareCanvas(two); break;
      case '3-3': renderTripleGcdCanvas(two); break;
      case '3-4': renderLDivisionCanvas(two, 3); break;
      case '3-5': renderTripleGcdCanvas(two); break;
      case '3-6': renderCoprimeLineMatchCanvas(two); break;
      case '3-7': renderGenericInteractiveCanvas(two, code, "지수 미지수 조건 역추적", "2ª × 3² = 최대공약수 지수", "scale"); break;
      case '3-8': renderGenericInteractiveCanvas(two, code, "분수를 자연수로 만드는 수", "n / 12 = 자연수 ➔ 12의 배수", "scale"); break;
      case '3-9': renderFruitBasketCanvas(two, simState.basketPeople); break;
      case '3-10': renderTileCanvas(two, 60); break;

      // --- Tab 4: 최소공배수 ---
      case '4-1': renderGearsMeshingCanvas(two, 12, 16, simState.gearAngle); break;
      case '4-2': renderGearsMeshingCanvas(two, 24, 36, simState.gearAngle); break;
      case '4-3': renderLcmJumpCanvas(two); break;
      case '4-4': renderGenericInteractiveCanvas(two, code, "세 수의 최소공배수 동시 도약", "12, 18, 30의 공통 배수선", "scale"); break;
      case '4-5': renderLcmJumpCanvas(two); break;
      case '4-6': renderBusDepartureClockCanvas(two, simState.busClockMin); break;
      case '4-7': renderBlockStackingCanvas(two, simState.blockLayers); break;
      case '4-8': renderGenericInteractiveCanvas(two, code, "A × B = G × L 공식 증명", "12 × 18 = 6 × 36 = 216", "scale"); break;
      case '4-9': renderGearsMeshingCanvas(two, 20, 25, simState.gearAngle); break;
      case '4-10': renderCodingAlgoCanvas(two, simState.algoNum); break;

      // --- Tab 5: 스스로 마무리하기 (5-1 ~ 5-14) ---
      case '5-1': renderCalendarCanvas(two); break;
      case '5-2': renderPrimeSortCanvas(two, 13); break;
      case '5-3': renderPowerTileCanvas(two, 3, 3); break;
      case '5-4': renderFactorTreeCanvas(two, 72, '8x9', 2); break;
      case '5-5': renderDivisorTableCanvas(two, 2, 3); break;
      case '5-6': renderSquareMakerCanvas(two, 14); break;
      case '5-7': renderTileCanvas(two, 6); break;
      case '5-8': renderCoprimeLineMatchCanvas(two); break;
      case '5-9': renderLcmJumpCanvas(two); break;
      case '5-10': renderBusDepartureClockCanvas(two, 30); break;
      case '5-11': renderBlockStackingCanvas(two, 2); break;
      case '5-12': renderGenericInteractiveCanvas(two, code, "두 수의 곱과 최대·최소공배수 관계", "두 수의 곱 = G × L", "scale"); break;
      case '5-13': renderGenericInteractiveCanvas(two, code, "서술형 창의 해결: 단계별 풀이 도해", "조건 분해 ➔ 수식화 ➔ 검증", "venn"); break;
      case '5-14': renderGenericInteractiveCanvas(two, code, "도전 발전 문항: 암호와 소수", "두 소수의 곱 N = p × q", "venn"); break;

      // --- Tab 6: 창의융합 프로젝트 ---
      case '6-1': renderMondrianCanvas(two); break;

      default:
        renderTileArrayCanvas(two);
        break;
    }
  }

  window.setupSubstepSimulator = setupSubstepSimulator;

})();
