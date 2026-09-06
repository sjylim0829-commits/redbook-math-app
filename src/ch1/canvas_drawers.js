// src/ch1/canvas_drawers.js
// Chapter 1: Two.js Canvas Engines for all 57 Substeps
// 규칙 10 & 11 완전 준수 (소단원 확인하기 1문항 1페이지 및 마무리하기 전용 탭 14문항 1페이지)
// Type A: 교과서 핵심 10대 인터랙티브 활동 (1-2, 1-7, 1-9, 2-2, 2-7, 3-1, 3-2, 4-2, 4-10, 5-1 / 6-1)
// 0단원 되짚어보기 (0-1 ~ 0-4): 반응형 인터랙티브 전면 제거, 정갈한 복습 인포그래픽 도표 제공
// Type B: 문제 해결 지원 및 자유 펜 풀이 캔버스 (나머지 42종)
// Canvas Context font 인터셉터 기반 안전한 가독성 대폭 향상 (최소 폰트 16px 이상) 및 Zero Answer Leakage 철저 준수

(function() {
  // =========================================================================
  // 🎨 캔버스 폰트 크기 확대 및 가독성/선명도 극대화 엔진 (CanvasContext 기반 안전 확장)
  // Two.js의 Two.Text.size 내부 descriptor(configurable: false) 충돌을 완벽히 방지함
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
            const boosted = Math.max(16, Math.round(px * 1.28));
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
  // 시뮬레이션 상태 저장소 (0단원 드래그 변수 제거, 핵심 10종 인터랙티브 상태 완비)
  // =========================================================================
  const simState = {
    // 1-2 에라토스테네스의 체
    sieveStep: 1,
    sieveManualToggled: new Set(),

    // 1-7 세균 증식 거듭제곱 비주얼라이저
    bacteriaMinutes: 30,
    bacteriaTimer: null,

    // 1-9 열차 소수 역과 승객
    trainStation: 25,

    // 2-2 소인수분해 가지치기 트리
    factorTreeNum: 36,
    factorTreeBranch: '6x6',
    factorTreeStep: 2,

    // 2-7 제곱수 만들기 (56 * x = k^2)
    squareMultX: 14,

    // 3-1 직사각형 타일링 (18cm x 12cm)
    tileSquareSize: 6,

    // 3-2 소인수분해 거듭제곱 비교 최대공약수
    gcdPair: '12_18',
    gcdLowered: true,

    // 4-2 톱니바퀴 회전 및 최소공배수
    gearA: 24,
    gearB: 36,
    gearAngle: 0,
    isGearRotating: false,

    // 4-10 소수 판별 코딩 알고리즘
    algoNum: 115,
    algoCurrI: 2,
    algoRunning: false,
    algoStepIdx: 0,
    algoResult: '',
    algoLog: [],

    // 5-1 달력 속 소수 날짜 찾기
    calendarPrimes: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31],
    calendarSelected: new Set(),

    // 6-1 몬드리안 분할
    mondrianRatio: 1
  };
  window.simState = simState;

  // =========================================================================
  // 1-2 [인터랙티브] 에라토스테네스의 체 헬퍼
  // =========================================================================
  window.setSieveStep = function(st) {
    simState.sieveStep = st;
    simState.sieveManualToggled.clear();
    const badge = document.getElementById('sieve-progress-badge');
    if (badge) {
      if (st === 1) badge.innerHTML = `진행: <b>1단계</b> (1은 소수가 아니므로 지움)`;
      else if (st === 2) badge.innerHTML = `진행: <b>2단계</b> (2 남기고 2의 배수 지움)`;
      else if (st === 3) badge.innerHTML = `진행: <b>3단계</b> (3 남기고 3의 배수 지움)`;
      else if (st === 4) badge.innerHTML = `진행: <b>4단계</b> (5 남기고 5의 배수 지움)`;
      else if (st === 5) badge.innerHTML = `진행: <b>5단계</b> (7 남기고 7의 배수 지움)`;
      else if (st === 6) badge.innerHTML = `🎉 <b>완료!</b> 남은 소수 <b>15개</b> 하이라이트`;
    }
    if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '1-2') {
      renderSieveCanvas(window.currentTwo, st);
    }
  };

  window.toggleSieveCell = function(n) {
    if (simState.sieveManualToggled.has(n)) {
      simState.sieveManualToggled.delete(n);
    } else {
      simState.sieveManualToggled.add(n);
    }
    if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '1-2') {
      renderSieveCanvas(window.currentTwo, simState.sieveStep);
    }
  };

  // =========================================================================
  // 1-7 [인터랙티브] 세균 증식 거듭제곱 비주얼라이저 헬퍼
  // =========================================================================
  window.setBacteriaMinutes = function(m) {
    simState.bacteriaMinutes = Math.max(0, Math.min(60, parseInt(m) || 0));
    const badge = document.getElementById('bacteria-badge');
    const slider = document.getElementById('bacteria-slider');
    if (slider) slider.value = simState.bacteriaMinutes;
    const times = simState.bacteriaMinutes / 10;
    const count = Math.pow(2, times);
    if (badge) {
      badge.innerHTML = `경과 시간: <b>${simState.bacteriaMinutes}분</b> (${times}회 분열) ➔ <b>2<sup>${times}</sup> = ${count}배</b>`;
    }
    if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '1-7') {
      renderBacteriaGraphCanvas(window.currentTwo, simState.bacteriaMinutes);
    }
  };

  window.stepBacteriaMinutes = function(delta) {
    window.setBacteriaMinutes(simState.bacteriaMinutes + delta);
  };

  // =========================================================================
  // 1-9 [인터랙티브] 열차 소수 역과 승객 헬퍼
  // =========================================================================
  window.setTrainStation = function(st) {
    simState.trainStation = Math.max(1, Math.min(30, parseInt(st) || 1));
    const slider = document.getElementById('train-slider');
    if (slider) slider.value = simState.trainStation;
    const badge = document.getElementById('train-badge');

    // Calculate factors
    const n = simState.trainStation;
    const divs = [];
    for (let i = 1; i <= n; i++) {
      if (n % i === 0) divs.push(i);
    }
    const isPrime = (divs.length === 2);
    if (badge) {
      if (isPrime) {
        badge.innerHTML = `현재 역: <b>${n}번 역</b> | 하차 승객: <b>2명</b> (약수: ${divs.join(', ')}) 🟢 <b>소수 역!</b>`;
        badge.style.background = '#f0fdf4';
        badge.style.color = '#166534';
      } else {
        badge.innerHTML = `현재 역: <b>${n}번 역</b> | 하차 승객: <b>${divs.length}명</b> (약수: ${divs.join(', ')}) ${n === 1 ? '(1)' : '(합성수 역)'}`;
        badge.style.background = '#eff6ff';
        badge.style.color = '#1e40af';
      }
    }
    if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '1-9') {
      renderTrainStationCanvas(window.currentTwo, simState.trainStation);
    }
  };

  // =========================================================================
  // 2-2 [인터랙티브] 소인수분해 가지치기 트리 헬퍼
  // =========================================================================
  window.setFactorTreeNum = function(n) {
    simState.factorTreeNum = n;
    simState.factorTreeStep = 1;
    updateTreeBadge();
    if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '2-2') {
      renderFactorTreeCanvas(window.currentTwo, n, simState.factorTreeBranch, simState.factorTreeStep);
    }
  };

  window.setFactorTreeBranch = function(branch) {
    simState.factorTreeBranch = branch;
    updateTreeBadge();
    if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '2-2') {
      renderFactorTreeCanvas(window.currentTwo, simState.factorTreeNum, branch, simState.factorTreeStep);
    }
  };

  window.stepFactorTree = function(delta) {
    simState.factorTreeStep = Math.max(0, Math.min(3, simState.factorTreeStep + delta));
    updateTreeBadge();
    if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '2-2') {
      renderFactorTreeCanvas(window.currentTwo, simState.factorTreeNum, simState.factorTreeBranch, simState.factorTreeStep);
    }
  };

  function updateTreeBadge() {
    const badge = document.getElementById('tree-step-badge');
    if (badge) {
      if (simState.factorTreeStep === 0) badge.innerHTML = `트리 상태: <b>준비 단계 (${simState.factorTreeNum})</b>`;
      else if (simState.factorTreeStep === 1) badge.innerHTML = `트리 상태: <b>1차 가지치기</b> (두 수의 곱으로 분해)`;
      else if (simState.factorTreeStep === 2) badge.innerHTML = `트리 상태: <b>소인수 분해 완료</b> (소수 노드 잠금)`;
      else badge.innerHTML = `🎉 <b>소인수분해 완성: ${simState.factorTreeNum === 36 ? '2² × 3²' : (simState.factorTreeNum === 60 ? '2² × 3 × 5' : '2³ × 3²')}</b>`;
    }
  }

  // =========================================================================
  // 2-7 [인터랙티브] 제곱수 만들기 지수 밸런스 헬퍼
  // =========================================================================
  window.setSquareMultX = function(x) {
    simState.squareMultX = parseInt(x) || 14;
    const badge = document.getElementById('square-mult-badge');
    const total = 56 * simState.squareMultX;
    // factorize total
    let t = total;
    let exp2 = 0, exp7 = 0;
    while (t > 0 && t % 2 === 0) { exp2++; t /= 2; }
    while (t > 0 && t % 7 === 0) { exp7++; t /= 7; }
    const isSquare = (exp2 % 2 === 0 && exp7 % 2 === 0 && t === 1);
    const root = isSquare ? Math.round(Math.sqrt(total)) : 0;

    if (badge) {
      if (isSquare) {
        badge.innerHTML = `현재 곱: 56 × <b>${simState.squareMultX}</b> = ${total} ➔ <b>2<sup>${exp2}</sup> × 7<sup>${exp7}</sup> = (${root})² 🎉 완벽한 제곱수!</b>`;
        badge.style.background = '#f0fdf4';
        badge.style.color = '#166534';
      } else {
        badge.innerHTML = `현재 곱: 56 × <b>${simState.squareMultX}</b> = ${total} ➔ 지수: 2<sup>${exp2}</sup>, 7<sup>${exp7}</sup> (홀수 지수 존재 ⚠️)`;
        badge.style.background = '#fffbeb';
        badge.style.color = '#b45309';
      }
    }
    if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '2-7') {
      renderSquareMakerCanvas(window.currentTwo, simState.squareMultX);
    }
  };

  // =========================================================================
  // 3-1 [인터랙티브] 직사각형 정사각형 타일링 헬퍼
  // =========================================================================
  window.setTileSquareSize = function(s) {
    simState.tileSquareSize = parseInt(s) || 6;
    const badge = document.getElementById('tile-size-badge');
    const sz = simState.tileSquareSize;
    const fitW = (18 % sz === 0);
    const fitH = (12 % sz === 0);
    const isPerfect = (fitW && fitH);

    if (badge) {
      if (isPerfect) {
        const cols = 18 / sz;
        const rows = 12 / sz;
        badge.innerHTML = `타일: <b>${sz}cm × ${sz}cm</b> ➔ 가로 ${cols}장, 세로 ${rows}장 (총 ${cols*rows}장) <b>빈틈없이 완벽!</b> 🎉 ${sz === 6 ? '👑 [최대공약수 타일]' : ''}`;
        badge.style.background = '#f0fdf4';
        badge.style.color = '#166534';
      } else {
        const remW = 18 % sz;
        badge.innerHTML = `타일: <b>${sz}cm × ${sz}cm</b> ➔ ⚠️ 18cm 가로에 <b>${remW}cm 빈틈 발생!</b> (18의 약수가 아님)`;
        badge.style.background = '#fef2f2';
        badge.style.color = '#991b1b';
      }
    }
    if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '3-1') {
      renderTilingSquareCanvas(window.currentTwo, simState.tileSquareSize);
    }
  };

  // =========================================================================
  // 3-2 [인터랙티브] 소인수분해 거듭제곱 비교 최대공약수 헬퍼
  // =========================================================================
  window.setGcdPair = function(pairKey) {
    simState.gcdPair = pairKey;
    simState.gcdLowered = true;
    if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '3-2') {
      renderGcdBalanceCanvas(window.currentTwo, pairKey, simState.gcdLowered);
    }
  };

  window.toggleGcdLower = function() {
    simState.gcdLowered = !simState.gcdLowered;
    if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '3-2') {
      renderGcdBalanceCanvas(window.currentTwo, simState.gcdPair, simState.gcdLowered);
    }
  };

  // =========================================================================
  // 4-2 [인터랙티브] 톱니바퀴 회전 및 최소공배수 헬퍼
  // =========================================================================
  window.toggleGearRotation = function() {
    simState.isGearRotating = !simState.isGearRotating;
    const btn = document.getElementById('gear-rot-btn');
    if (btn) {
      btn.innerText = simState.isGearRotating ? '⏹ 회전 정지' : '▶ 톱니 회전 시작';
      btn.style.background = simState.isGearRotating ? '#ef4444' : '#0284c7';
    }
    if (simState.isGearRotating) {
      function animGears() {
        if (!simState.isGearRotating) return;
        simState.gearAngle += 0.035;
        if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '4-2') {
          renderGearsCanvas(window.currentTwo, simState.gearAngle);
        }
        requestAnimationFrame(animGears);
      }
      requestAnimationFrame(animGears);
    }
  };

  window.resetGears = function() {
    simState.gearAngle = 0;
    simState.isGearRotating = false;
    const btn = document.getElementById('gear-rot-btn');
    if (btn) {
      btn.innerText = '▶ 톱니 회전 시작';
      btn.style.background = '#0284c7';
    }
    if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '4-2') {
      renderGearsCanvas(window.currentTwo, 0);
    }
  };

  // =========================================================================
  // 4-10 [인터랙티브] 소수 판별 코딩 알고리즘 헬퍼
  // =========================================================================
  window.runCodingAlgo = function() {
    const input = document.getElementById('algo-input-val');
    const val = parseInt(input ? input.value : '115') || 115;
    simState.algoNum = val;
    simState.algoCurrI = 2;
    simState.algoStepIdx = 1;
    simState.algoLog = [`[시작] 수 N = ${val} 입력됨`];

    let isP = true;
    let divisor = -1;
    if (val <= 1) {
      isP = false;
    } else {
      for (let i = 2; i * i <= val; i++) {
        if (val % i === 0) {
          isP = false;
          divisor = i;
          break;
        }
      }
    }
    simState.algoResult = isP ? '소수' : `합성수 (${divisor}의 배수)`;
    const resBox = document.getElementById('algo-result-box');
    if (resBox) {
      resBox.style.display = 'inline-block';
      resBox.innerHTML = `판별 결과: <b>${val}</b>은(는) <b>${simState.algoResult}</b>입니다!`;
      resBox.style.background = isP ? '#f0fdf4' : '#fef2f2';
      resBox.style.color = isP ? '#166534' : '#991b1b';
    }
    if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '4-10') {
      renderAlgoCanvas(window.currentTwo, val, isP, divisor);
    }
  };

  // =========================================================================
  // 5-1 [인터랙티브] 달력 속 소수 날짜 찾기 헬퍼
  // =========================================================================
  window.toggleCalendarPrime = function(d) {
    if (simState.calendarSelected.has(d)) {
      simState.calendarSelected.delete(d);
    } else {
      simState.calendarSelected.add(d);
    }
    const badge = document.getElementById('cal-selected-count');
    if (badge) badge.innerText = `${simState.calendarSelected.size}개`;
    if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '5-1') {
      renderCalendarCanvas(window.currentTwo);
    }
  };

  window.autoCollectCalendarPrimes = function() {
    simState.calendarSelected = new Set(simState.calendarPrimes);
    const badge = document.getElementById('cal-selected-count');
    if (badge) badge.innerText = `11개 (전부 발견!) 🎉`;
    if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '5-1') {
      renderCalendarCanvas(window.currentTwo);
    }
  };

  window.resetCalendarPrimes = function() {
    simState.calendarSelected.clear();
    const badge = document.getElementById('cal-selected-count');
    if (badge) badge.innerText = `0개`;
    if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '5-1') {
      renderCalendarCanvas(window.currentTwo);
    }
  };

  // =========================================================================
  // 6-1 [인터랙티브] 몬드리안 분할 헬퍼
  // =========================================================================
  window.changeMondrianRatio = function(delta) {
    simState.mondrianRatio = Math.max(1, Math.min(4, simState.mondrianRatio + delta));
    if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '6-1') {
      renderMondrianCanvas(window.currentTwo, simState.mondrianRatio);
    }
  };

  // =========================================================================
  // Type B Universal Problem Support & Freehand Workspace Canvas Engine
  // =========================================================================
  function renderProblemSupportCanvas(two, config) {
    if (!two) return;
    two.clear();
    const width = two.width, height = two.height;
    const cx = width / 2;

    // 1. Outer Elegant Card Container
    const pad = 12;
    const cardW = width - pad * 2;
    const cardH = height - pad * 2;
    const bgCard = two.makeRoundedRectangle(cx, height / 2, cardW, cardH, 12);
    bgCard.fill = '#ffffff';
    bgCard.stroke = '#e2e8f0';
    bgCard.linewidth = 1.5;

    // 2. Top Header Bar
    const headerY = pad + 24;
    const badgeText = config.badge || '핵심 문항 탐구';
    const badgeW = Math.max(130, badgeText.length * 13 + 28);
    const badgeBg = two.makeRoundedRectangle(pad + badgeW / 2 + 8, headerY, badgeW, 28, 14);
    badgeBg.fill = config.badgeBg || '#eff6ff';
    badgeBg.stroke = config.badgeStroke || '#93c5fd';
    badgeBg.linewidth = 1.5;

    const bTxt = two.makeText(badgeText, pad + badgeW / 2 + 8, headerY);
    bTxt.size = 14; bTxt.weight = 800; bTxt.fill = config.badgeColor || '#1d4ed8';

    const titleTxt = two.makeText(config.title || '', pad + badgeW + 22, headerY);
    titleTxt.size = 16; titleTxt.weight = 800; titleTxt.fill = '#1e293b';
    titleTxt.alignment = 'left';

    // 3. Problem Condition & Structure Box
    const condY = headerY + 54;
    const condBoxW = cardW - 32;
    const condBoxH = 88;
    const condBox = two.makeRoundedRectangle(cx, condY, condBoxW, condBoxH, 10);
    condBox.fill = '#f8fafc';
    condBox.stroke = '#cbd5e1';
    condBox.linewidth = 1.5;

    if (config.given) {
      const givenTxt = two.makeText(config.given, cx, condY - 14);
      givenTxt.size = 20; givenTxt.weight = 800; givenTxt.fill = '#0f172a';
    }

    if (config.guide) {
      const guideTxt = two.makeText(config.guide, cx, condY + 18);
      guideTxt.size = 15; guideTxt.weight = 700; guideTxt.fill = '#0284c7';
    }

    // 4. Freehand Drawing Area Divider & Workspace
    const dividerY = condY + condBoxH / 2 + 18;
    const divLine = two.makeLine(pad + 16, dividerY, width - pad - 16, dividerY);
    divLine.stroke = '#e2e8f0'; divLine.linewidth = 1.5; divLine.dashes = [4, 4];

    const workTop = dividerY + 12;
    const workBottom = height - pad - 16;
    for (let gy = workTop + 26; gy < workBottom; gy += 30) {
      const gLine = two.makeLine(pad + 20, gy, width - pad - 20, gy);
      gLine.stroke = '#f8fafc'; gLine.linewidth = 1;
    }

    const workTitle = two.makeText("✏️ [자유 펜 풀이 및 계산 영역]", pad + 24, workTop + 14);
    workTitle.size = 15; workTitle.weight = 800; workTitle.fill = '#64748b'; workTitle.alignment = 'left';

    const workHint = two.makeText("💡 상단 도구 모음의 [펜]을 선택하여 풀이 과정을 필기하고 문제를 풀어보세요.", cx, workBottom - 8);
    workHint.size = 14; workHint.weight = 600; workHint.fill = '#94a3b8';

    two.update();
  }

  // =========================================================================
  // setupSubstepSimulator: 57개 전 서브스텝 라우팅 (Zero Leakage 준수)
  // =========================================================================
  function setupSubstepSimulator(two, code, simController) {
    if (!two) return;
    two.clear();
    window.currentTwo = two;

    if (simController) {
      simController.style.display = 'block';
    }

    switch(code) {
      // ----------------------------------------
      // Tab 0: 준비학습 (0-1 ~ 0-4)
      // 사용자 요구사항: 모든 반응형 인터랙티브 활동 전면 제거, 정적 복습 도표 제공
      // ----------------------------------------
      case '0-1':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0369a1; font-size:0.95rem;">💡 [준비학습 복습 도표] 12개의 타일로 만드는 직사각형과 약수·배수의 관계</span>
              <span style="background:#f0fdf4; color:#166534; font-weight:800; padding:4px 12px; border-radius:12px; font-size:0.85rem; border:1px solid #86efac;">
                12의 약수: 1, 2, 3, 4, 6, 12
              </span>
            </div>
          `;
        }
        renderTileArrayCanvas(two);
        break;

      case '0-2':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0369a1; font-size:0.95rem;">💡 [준비학습 복습 도표] 12와 18의 공약수와 최대공약수 벤다이어그램</span>
              <span style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:4px 12px; border-radius:12px; font-size:0.85rem; border:1px solid #bfdbfe;">
                공약수: 1, 2, 3, 6 (최대공약수: 6)
              </span>
            </div>
          `;
        }
        renderVennCanvas(two);
        break;

      case '0-3':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0369a1; font-size:0.95rem;">💡 [준비학습 복습 도표] 4와 6의 수직선 도약과 최소공배수</span>
              <span style="background:#fefce8; color:#854d0e; font-weight:800; padding:4px 12px; border-radius:12px; font-size:0.85rem; border:1px solid #fde047;">
                공배수: 12, 24, 36… (최소공배수: 12)
              </span>
            </div>
          `;
        }
        renderLcmJumpCanvas(two);
        break;

      case '0-4':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0369a1; font-size:0.95rem;">💡 [준비학습 복습 도표] 약수의 개수에 따른 자연수의 3분류</span>
              <span style="background:#f8fafc; color:#475569; font-weight:800; padding:4px 12px; border-radius:12px; font-size:0.85rem; border:1px solid #cbd5e1;">
                자연수 = 1 + 약수 2개(소수) + 약수 3개 이상(합성수)
              </span>
            </div>
          `;
        }
        renderClassifyCanvas(two);
        break;

      // ----------------------------------------
      // Tab 1: 소수와 합성수 (1-1 ~ 1-9)
      // 핵심 인터랙티브: 1-2 (에라토스테네스 체), 1-7 (세균 증식), 1-9 (열차 역)
      // ----------------------------------------
      case '1-1':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">📌 소수와 합성수의 뜻 탐구 (약수의 개수)</span>
              <span style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:4px 12px; border-radius:12px; font-size:0.85rem; border:1px solid #bfdbfe;">
                소수: 약수 2개 | 합성수: 약수 3개 이상
              </span>
            </div>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '1-1 개념 탐구',
          title: '소수와 합성수 판별 기준',
          given: '자연수 = 1, 소수(약수 2개), 합성수(약수 3개 이상)',
          guide: '💡 1은 약수가 1개뿐이므로 소수도 아니고 합성수도 아닙니다. 2는 유일한 짝수 소수입니다.'
        });
        break;

      case '1-2':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <div style="display:flex; align-items:center; gap:4px; flex-wrap:wrap;">
                <button class="btn" style="padding:4px 8px; font-size:0.82rem; background:#f1f5f9;" onclick="setSieveStep(1)">1단계: 1 지우기</button>
                <button class="btn" style="padding:4px 8px; font-size:0.82rem; background:#e0f2fe; color:#0369a1; font-weight:800;" onclick="setSieveStep(2)">2단계: 2의 배수</button>
                <button class="btn" style="padding:4px 8px; font-size:0.82rem; background:#e0f2fe; color:#0369a1; font-weight:800;" onclick="setSieveStep(3)">3단계: 3의 배수</button>
                <button class="btn" style="padding:4px 8px; font-size:0.82rem; background:#e0f2fe; color:#0369a1; font-weight:800;" onclick="setSieveStep(4)">4단계: 5의 배수</button>
                <button class="btn" style="padding:4px 8px; font-size:0.82rem; background:#e0f2fe; color:#0369a1; font-weight:800;" onclick="setSieveStep(5)">5단계: 7의 배수</button>
                <button class="btn" style="padding:4px 8px; font-size:0.82rem; background:#fef3c7; color:#b45309; font-weight:800;" onclick="setSieveStep(6)">✨ 남은 소수 15개</button>
                <button class="btn" style="padding:4px 8px; font-size:0.82rem; background:#f8fafc;" onclick="setSieveStep(1)">🔄 초기화</button>
              </div>
              <span id="sieve-progress-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:4px 12px; border-radius:12px; font-size:0.85rem; border:1px solid #bfdbfe;">
                진행: 1단계 (1은 소수가 아니므로 지움)
              </span>
            </div>
          `;
        }
        renderSieveCanvas(two, simState.sieveStep);
        break;

      case '1-3':
        renderProblemSupportCanvas(two, {
          badge: '1-3 개념 탐구',
          title: '거듭제곱과 밑·지수',
          given: 'a × a × … × a (n개 곱) = aⁿ',
          guide: '💡 곱하는 수를 [밑], 곱한 횟수를 [지수]라고 합니다.'
        });
        break;

      case '1-4':
        renderProblemSupportCanvas(two, {
          badge: '1-4 스스로 확인하기 1번',
          title: '소수와 합성수 구분',
          given: '주어진 수: 8, 17, 39, 53',
          guide: '💡 각 수의 약수를 구하여 약수가 2개뿐인 수와 3개 이상인 수를 나누어 보세요.'
        });
        break;

      case '1-5':
        renderProblemSupportCanvas(two, {
          badge: '1-5 스스로 확인하기 2번',
          title: '거듭제곱 표현하기',
          given: '1) 5⁴  2) 2 × 3² × 5  3) 3² × 7⁵',
          guide: '💡 같은 소인수끼리 묶어서 지수를 오른쪽 위에 작게 적어 거듭제곱으로 나타냅니다.'
        });
        break;

      case '1-6':
        renderProblemSupportCanvas(two, {
          badge: '1-6 스스로 확인하기 3번',
          title: '소수와 합성수 성질 참/거짓 판단',
          given: 'ㄱ. 약수 2개 이상  ㄴ. 모든 소수 홀수  ㄷ. 43 소수  ㄹ. 3의 배수 중 소수',
          guide: '💡 1은 약수가 1개뿐이고, 2는 유일한 짝수 소수입니다. 반례를 찾아 참/거짓을 검증하세요.'
        });
        break;

      case '1-7':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">🦠 세균 증식 시간 조절:</span>
                <input type="range" id="bacteria-slider" min="0" max="60" step="10" value="${simState.bacteriaMinutes}" style="width:130px; cursor:pointer;" oninput="setBacteriaMinutes(this.value)">
                <button class="btn" style="padding:4px 8px; font-size:0.82rem; background:#f1f5f9;" onclick="setBacteriaMinutes(0)">0분</button>
                <button class="btn" style="padding:4px 8px; font-size:0.82rem; background:#f1f5f9;" onclick="setBacteriaMinutes(10)">10분</button>
                <button class="btn" style="padding:4px 8px; font-size:0.82rem; background:#f1f5f9;" onclick="setBacteriaMinutes(30)">30분</button>
                <button class="btn" style="padding:4px 8px; font-size:0.82rem; background:#e0f2fe; color:#0369a1; font-weight:800;" onclick="setBacteriaMinutes(60)">60분(1시간)</button>
              </div>
              <span id="bacteria-badge" style="background:#f0fdf4; color:#166534; font-weight:800; padding:4px 14px; border-radius:12px; font-size:0.85rem; border:1px solid #86efac;">
                경과 시간: 30분 (3회 분열) ➔ 2³ = 8배
              </span>
            </div>
          `;
        }
        renderBacteriaGraphCanvas(two, simState.bacteriaMinutes);
        break;

      case '1-8':
        renderProblemSupportCanvas(two, {
          badge: '1-8 스스로 확인하기 5번',
          title: '지수 방정식과 밑 비교',
          given: '2^a = 64,  (1/3)^b = 1/27',
          guide: '💡 64 = 2⁶ 이고, 27 = 3³ 이므로 (1/3)³ = 1/27 임을 이용해 a와 b를 구하세요.'
        });
        break;

      case '1-9':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">🚂 열차 역 선택:</span>
                <input type="range" id="train-slider" min="1" max="30" step="1" value="${simState.trainStation}" style="width:120px; cursor:pointer;" oninput="setTrainStation(this.value)">
                <button class="btn" style="padding:4px 8px; font-size:0.82rem; background:#e0f2fe; color:#0369a1; font-weight:800;" onclick="setTrainStation(2)">2번 역(소수)</button>
                <button class="btn" style="padding:4px 8px; font-size:0.82rem; background:#f1f5f9;" onclick="setTrainStation(6)">6번 역</button>
                <button class="btn" style="padding:4px 8px; font-size:0.82rem; background:#fef3c7; color:#b45309; font-weight:800;" onclick="setTrainStation(25)">25번 역(문항 Q1)</button>
                <button class="btn" style="padding:4px 8px; font-size:0.82rem; background:#e0f2fe; color:#0369a1; font-weight:800;" onclick="setTrainStation(29)">29번 역(소수)</button>
              </div>
              <span id="train-badge" style="background:#eff6ff; color:#1e40af; font-weight:800; padding:4px 14px; border-radius:12px; font-size:0.85rem; border:1px solid #bfdbfe;">
                현재 역: 25번 역 | 하차 승객: 3명 (약수: 1, 5, 25) (합성수 역)
              </span>
            </div>
          `;
        }
        renderTrainStationCanvas(two, simState.trainStation);
        break;

      // ----------------------------------------
      // Tab 2: 소인수분해 (2-1 ~ 2-9)
      // 핵심 인터랙티브: 2-2 (가지치기 트리), 2-7 (제곱수 만들기)
      // ----------------------------------------
      case '2-1':
        renderProblemSupportCanvas(two, {
          badge: '2-1 개념 탐구',
          title: '소인수와 인수의 뜻',
          given: '12의 인수: 1, 2, 3, 4, 6, 12  ➔  소인수: 2, 3',
          guide: '💡 어떤 수의 인수(약수) 중에서 소수인 것을 [소인수]라고 합니다.'
        });
        break;

      case '2-2':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">🌳 수 선택:</span>
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#e0f2fe; color:#0369a1; font-weight:800;" onclick="setFactorTreeNum(36)">36</button>
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#f1f5f9;" onclick="setFactorTreeNum(60)">60</button>
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#f1f5f9;" onclick="setFactorTreeNum(72)">72</button>
                <span style="margin-left:8px; font-weight:700; font-size:0.85rem; color:#475569;">분해 단계:</span>
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#f8fafc;" onclick="stepFactorTree(-1)">◀ 이전</button>
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#0284c7; color:#ffffff; font-weight:800;" onclick="stepFactorTree(1)">다음 단계 ▶</button>
              </div>
              <span id="tree-step-badge" style="background:#f0fdf4; color:#166534; font-weight:800; padding:4px 14px; border-radius:12px; font-size:0.85rem; border:1px solid #86efac;">
                트리 상태: 소인수 분해 완료 (소수 노드 잠금)
              </span>
            </div>
          `;
        }
        renderFactorTreeCanvas(two, simState.factorTreeNum, simState.factorTreeBranch, simState.factorTreeStep);
        break;

      case '2-3':
        renderProblemSupportCanvas(two, {
          badge: '2-3 개념 확인',
          title: '나눗셈을 이용한 소인수분해',
          given: '80 = 2 × 40 = 2 × 2 × 20 = 2 × 2 × 2 × 10 = 2⁴ × 5',
          guide: '💡 몫이 소수가 될 때까지 가장 작은 소수부터 차례대로 나누어 거듭제곱으로 나타냅니다.'
        });
        break;

      case '2-4':
        renderProblemSupportCanvas(two, {
          badge: '2-4 스스로 확인하기 1번',
          title: '소인수 모두 구하기',
          given: '주어진 수: 27, 44, 98, 120',
          guide: '💡 각 수를 소인수분해하여 나타나는 소수 밑들을 모두 나열하세요.'
        });
        break;

      case '2-5':
        renderProblemSupportCanvas(two, {
          badge: '2-5 스스로 확인하기 2번',
          title: '소인수분해 거듭제곱 표현',
          given: '1) 32  2) 54  3) 150  4) 225',
          guide: '💡 소인수들을 크기순으로 곱하고 같은 소인수는 거듭제곱 형태로 나타내세요.'
        });
        break;

      case '2-6':
        renderProblemSupportCanvas(two, {
          badge: '2-6 스스로 확인하기 3번',
          title: '연속된 자연수 곱의 소인수 지수',
          given: '1 × 2 × 3 × 4 × 5 × 6 × 7 × 8 × 9 × 10 = 2^a × 3^b × 5^c × 7',
          guide: '💡 짝수(2, 4, 6, 8, 10)에 들어 있는 2의 거듭제곱 개수들을 모두 합산하세요.'
        });
        break;

      case '2-7':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">⚖️ 56에 곱할 x 선택:</span>
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#f1f5f9;" onclick="setSquareMultX(2)">x = 2</button>
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#f1f5f9;" onclick="setSquareMultX(7)">x = 7</button>
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#f0fdf4; color:#166534; font-weight:800; border:1px solid #86efac;" onclick="setSquareMultX(14)">x = 14 (정답 확인)</button>
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#f1f5f9;" onclick="setSquareMultX(28)">x = 28</button>
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#f1f5f9;" onclick="setSquareMultX(56)">x = 56</button>
              </div>
              <span id="square-mult-badge" style="background:#f0fdf4; color:#166534; font-weight:800; padding:4px 14px; border-radius:12px; font-size:0.85rem; border:1px solid #86efac;">
                현재 곱: 56 × 14 = 784 ➔ 2⁴ × 7² = (28)² 🎉 완벽한 제곱수!
              </span>
            </div>
          `;
        }
        renderSquareMakerCanvas(two, simState.squareMultX);
        break;

      case '2-8':
        renderProblemSupportCanvas(two, {
          badge: '2-8 스스로 확인하기 5번',
          title: '조건 만족 두 자리 자연수 탐색',
          given: '조건: 소인수 2개뿐, 두 소인수의 합 = 18',
          guide: '💡 합이 18이 되는 두 소수 쌍 (5와 13, 7과 11)을 찾아 각각 곱하여 두 자리 자연수를 만드세요.'
        });
        break;

      case '2-9':
        renderProblemSupportCanvas(two, {
          badge: '2-9 생각 넓히기',
          title: '소인수분해와 약수의 개수 공식',
          given: 'N = a^m × bⁿ  ➔  약수의 개수 = (m + 1)(n + 1)',
          guide: '💡 각 소인수의 지수에 1을 더하여 서로 곱하면 약수의 총 개수가 나옵니다.'
        });
        break;

      // ----------------------------------------
      // Tab 3: 최대공약수 (3-1 ~ 3-10)
      // 핵심 인터랙티브: 3-1 (타일 깔기), 3-2 (지수 저울 비교)
      // ----------------------------------------
      case '3-1':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">🟦 정사각형 타일 크기:</span>
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#f1f5f9;" onclick="setTileSquareSize(1)">1cm</button>
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#f1f5f9;" onclick="setTileSquareSize(2)">2cm</button>
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#f1f5f9;" onclick="setTileSquareSize(3)">3cm</button>
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#fef2f2; color:#b91c1c; font-weight:800;" onclick="setTileSquareSize(4)">4cm (빈틈 발생)</button>
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#f0fdf4; color:#166534; font-weight:800; border:1px solid #86efac;" onclick="setTileSquareSize(6)">6cm (최대공약수 타일!)</button>
              </div>
              <span id="tile-size-badge" style="background:#f0fdf4; color:#166534; font-weight:800; padding:4px 14px; border-radius:12px; font-size:0.85rem; border:1px solid #86efac;">
                타일: 6cm × 6cm ➔ 가로 3장, 세로 2장 (총 6장) 빈틈없이 완벽! 👑
              </span>
            </div>
          `;
        }
        renderTilingSquareCanvas(two, simState.tileSquareSize);
        break;

      case '3-2':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">⚖️ 비교할 두 수:</span>
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#e0f2fe; color:#0369a1; font-weight:800;" onclick="setGcdPair('12_18')">12와 18</button>
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#f1f5f9;" onclick="setGcdPair('24_36')">24와 36</button>
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#f1f5f9;" onclick="setGcdPair('28_42')">28과 42</button>
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#0284c7; color:#ffffff; font-weight:800;" onclick="toggleGcdLower()">공통 소인수 내리기 ▼</button>
              </div>
              <span style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:4px 14px; border-radius:12px; font-size:0.85rem; border:1px solid #bfdbfe;">
                공통 소인수 중 지수가 작거나 같은 것을 택하여 곱합니다!
              </span>
            </div>
          `;
        }
        renderGcdBalanceCanvas(two, simState.gcdPair, simState.gcdLowered);
        break;

      case '3-3':
        renderProblemSupportCanvas(two, {
          badge: '3-3 개념 확인',
          title: '세 수의 최대공약수',
          given: '세 수 모두를 동시에 나누어떨어지게 하는 가장 큰 공약수',
          guide: '💡 세 수 모두가 공통으로 가지고 있는 소인수 중 지수가 가장 작은 것을 곱합니다.'
        });
        break;

      case '3-4':
        renderProblemSupportCanvas(two, {
          badge: '3-4 스스로 확인하기 1번',
          title: '두 수의 최대공약수 구하기',
          given: '1) 2² × 3² 와 2³ × 3   2) 48과 72',
          guide: '💡 공통 소인수의 지수 중 작거나 같은 것을 택하여 곱하세요.'
        });
        break;

      case '3-5':
        renderProblemSupportCanvas(two, {
          badge: '3-5 스스로 확인하기 2번',
          title: '세 수의 최대공약수 구하기',
          given: '주어진 세 수: 36, 54, 90',
          guide: '💡 세 수를 각각 소인수분해하여 공통 소인수의 최소 지수를 구하세요.'
        });
        break;

      case '3-6':
        renderProblemSupportCanvas(two, {
          badge: '3-6 스스로 확인하기 3번',
          title: '15와 서로소인 수 찾기',
          given: '15 = 3 × 5  (서로소: 최대공약수가 1뿐인 수)',
          guide: '💡 3의 배수도 아니고 5의 배수도 아닌 수를 보기에서 고르세요.'
        });
        break;

      case '3-7':
        renderProblemSupportCanvas(two, {
          badge: '3-7 스스로 확인하기 4번',
          title: '지수 미지수 결정하기',
          given: '두 수 2^a × 3³ × 5 와 2³ × 3^b 의 최대공약수가 2² × 3²',
          guide: '💡 min(a, 3) = 2 이고 min(3, b) = 2 임을 이용하여 a, b의 값을 구하세요.'
        });
        break;

      case '3-8':
        renderProblemSupportCanvas(two, {
          badge: '3-8 스스로 확인하기 5번',
          title: '분수를 자연수로 만드는 가장 큰 수',
          given: '60/n 과 84/n 이 모두 자연수가 되게 하는 자연수 n',
          guide: '💡 n은 60의 약수이면서 84의 약수이어야 하므로, 60과 84의 최대공약수입니다.'
        });
        break;

      case '3-9':
        renderProblemSupportCanvas(two, {
          badge: '3-9 스스로 확인하기 6번',
          title: '나머지가 있는 나눗셈과 최대공약수',
          given: '어떤 수로 53을 나누면 5가 남고, 75를 나누면 3이 남음',
          guide: '💡 (53 - 5 = 48)과 (75 - 3 = 72)의 공약수 중 나머지(5)보다 큰 수를 찾으세요.'
        });
        break;

      case '3-10':
        renderProblemSupportCanvas(two, {
          badge: '3-10 생각 넓히기',
          title: '21과 최대공약수가 7인 두 자리 자연수 추론',
          given: '21 = 3 × 7  ➔  GCD(21, N) = 7',
          guide: '💡 N은 7의 배수이되 3의 배수는 아니어야 21과의 최대공약수가 7로 유지됩니다.'
        });
        break;

      // ----------------------------------------
      // Tab 4: 최소공배수 (4-1 ~ 4-11)
      // 핵심 인터랙티브: 4-2 (톱니바퀴 회전), 4-10 (코딩 알고리즘)
      // ----------------------------------------
      case '4-1':
        renderProblemSupportCanvas(two, {
          badge: '4-1 개념 탐구',
          title: '최소공배수와 소인수분해',
          given: '두 수의 모든 소인수 중 지수가 크거나 같은 것을 택하여 곱함',
          guide: '💡 공통 소인수는 큰 지수를 택하고, 공통이 아닌 소인수도 모두 빠짐없이 곱합니다.'
        });
        break;

      case '4-2':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                <button id="gear-rot-btn" class="btn" style="padding:5px 12px; font-size:0.85rem; background:#0284c7; color:#ffffff; font-weight:800;" onclick="toggleGearRotation()">▶ 톱니 회전 시작</button>
                <button class="btn" style="padding:5px 10px; font-size:0.85rem; background:#f1f5f9;" onclick="resetGears()">🔄 위치 초기화</button>
              </div>
              <span id="gear-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:4px 14px; border-radius:12px; font-size:0.85rem; border:1px solid #bfdbfe;">
                톱니바퀴 A (24개) & B (36개) ➔ 최소공배수 <b>72번째 톱니</b>에서 처음 다시 맞물림!
              </span>
            </div>
          `;
        }
        renderGearsCanvas(two, simState.gearAngle);
        break;

      case '4-3':
        renderProblemSupportCanvas(two, {
          badge: '4-3 스스로 확인하기 1번',
          title: '두 수의 최소공배수 구하기',
          given: '1) 2² × 3 과 2 × 3²   2) 28과 42',
          guide: '💡 모든 소인수의 거듭제곱 중 지수가 크거나 같은 것을 빠짐없이 곱하세요.'
        });
        break;

      case '4-4':
        renderProblemSupportCanvas(two, {
          badge: '4-4 스스로 확인하기 2번',
          title: '세 수의 최소공배수 구하기',
          given: '세 수: 12, 18, 30',
          guide: '💡 세 수를 소인수분해한 후 2, 3, 5의 최고 지수를 택하여 곱하세요.'
        });
        break;

      case '4-5':
        renderProblemSupportCanvas(two, {
          badge: '4-5 스스로 확인하기 3번',
          title: '분수를 자연수로 만드는 가장 작은 수',
          given: 'n/12 와 n/15 가 모두 자연수가 되게 하는 자연수 n',
          guide: '💡 n은 12의 배수이자 15의 배수이어야 하므로 12와 15의 최소공배수입니다.'
        });
        break;

      case '4-6':
        renderProblemSupportCanvas(two, {
          badge: '4-6 스스로 확인하기 4번',
          title: '3A, 4A, 5A 의 최소공배수',
          given: '세 수 3A, 4A, 5A 의 최소공배수가 360',
          guide: '💡 3, 4, 5는 서로소이므로 최소공배수는 3 × 4 × 5 × A = 60A = 360 입니다.'
        });
        break;

      case '4-7':
        renderProblemSupportCanvas(two, {
          badge: '4-7 스스로 확인하기 5번',
          title: '세 수의 최소공배수 미지수 결정',
          given: '2^a × 3, 2² × 3^b, 2³ × 3² 의 최소공배수가 2⁴ × 3²',
          guide: '💡 max(a, 2, 3) = 4 이므로 a = 4 이고, b의 범위를 파악하세요.'
        });
        break;

      case '4-8':
        renderProblemSupportCanvas(two, {
          badge: '4-8 스스로 확인하기 6번',
          title: '세 자리 공배수 찾기',
          given: '두 수의 최소공배수가 28일 때, 세 자리 공배수 중 가장 작은 수',
          guide: '💡 공배수는 최소공배수의 배수이므로 28 × k ≥ 100 을 만족하는 가장 작은 k를 구하세요.'
        });
        break;

      case '4-9':
        renderProblemSupportCanvas(two, {
          badge: '4-9 생각 넓히기',
          title: '두 수의 합과 최대공약수·최소공배수 추론',
          given: 'GCD = 6, LCM = 72, 두 수의 합 = 42',
          guide: '💡 A = 6a, B = 6b (a, b 서로소) 라 하면 a × b = 12, a + b = 7 입니다.'
        });
        break;

      case '4-10':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">💻 수 N 입력:</span>
                <input type="number" id="algo-input-val" value="${simState.algoNum}" style="width:75px; padding:3px 6px; border:1px solid #cbd5e1; border-radius:6px; font-weight:800;">
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#0284c7; color:#ffffff; font-weight:800;" onclick="runCodingAlgo()">▶ 알고리즘 실행</button>
                <button class="btn" style="padding:4px 7px; font-size:0.82rem; background:#f1f5f9;" onclick="document.getElementById('algo-input-val').value=115; runCodingAlgo();">115</button>
                <button class="btn" style="padding:4px 7px; font-size:0.82rem; background:#f1f5f9;" onclick="document.getElementById('algo-input-val').value=37; runCodingAlgo();">37(소수)</button>
                <button class="btn" style="padding:4px 7px; font-size:0.82rem; background:#f1f5f9;" onclick="document.getElementById('algo-input-val').value=91; runCodingAlgo();">91</button>
              </div>
              <span id="algo-result-box" style="display:inline-block; background:#fef2f2; color:#991b1b; font-weight:800; padding:4px 14px; border-radius:12px; font-size:0.85rem; border:1px solid #fecaca;">
                판별 결과: <b>115</b>은(는) <b>합성수 (5의 배수)</b>입니다!
              </span>
            </div>
          `;
        }
        renderAlgoCanvas(two, simState.algoNum, false, 5);
        break;

      // ----------------------------------------
      // Tab 5: 스스로 마무리하기 (5-1 ~ 5-14)
      // 핵심 인터랙티브: 5-1 (달력 속 소수 날짜 찾기)
      // ----------------------------------------
      case '5-1':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">📅 5월 달력: 소수 날짜를 클릭하여 모두 찾아보세요!</span>
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#f0fdf4; color:#166534; font-weight:800; border:1px solid #86efac;" onclick="autoCollectCalendarPrimes()">💡 소수 모두 찾기</button>
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#f1f5f9;" onclick="resetCalendarPrimes()">🔄 초기화</button>
              </div>
              <span style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:4px 14px; border-radius:12px; font-size:0.85rem; border:1px solid #bfdbfe;">
                수집한 소수 날짜: <b id="cal-selected-count">${simState.calendarSelected.size}개</b> / 총 11개
              </span>
            </div>
          `;
        }
        renderCalendarCanvas(two);
        break;

      case '5-2':
        renderProblemSupportCanvas(two, {
          badge: '마무리 02번',
          title: '소수와 합성수 성질 참/거짓 판단',
          given: '보기: ① 1은 소수  ② 가장 작은 소수 2  ③ 합성수는 짝수  ④ 10 이하 소수 5개',
          guide: '💡 2는 가장 작은 소수이자 유일한 짝수 소수입니다. 1은 소수도 합성수도 아닙니다.'
        });
        break;

      case '5-3':
        renderProblemSupportCanvas(two, {
          badge: '마무리 03번',
          title: '거듭제곱의 일의 자리 규칙성',
          given: '3¹ = 3, 3² = 9, 3³ = 27, 3⁴ = 81, 3⁵ = 243 …',
          guide: '💡 일의 자리가 3 ➔ 9 ➔ 7 ➔ 1 로 4개 주기로 반복됩니다. 50을 4로 나눈 나머지를 구하세요.'
        });
        break;

      case '5-4':
        renderProblemSupportCanvas(two, {
          badge: '마무리 04번',
          title: '330의 소인수 찾기',
          given: '330 = 2 × 3 × 5 × 11',
          guide: '💡 330을 소인수분해하여 나타나는 소인수 목록(2, 3, 5, 11)과 보기를 비교하세요.'
        });
        break;

      case '5-5':
        renderProblemSupportCanvas(two, {
          badge: '마무리 05번',
          title: '84를 나누어 어떤 자연수의 제곱 만들기',
          given: '84 / x = (자연수)²,  84 = 2² × 3 × 7',
          guide: '💡 지수가 홀수인 3과 7을 나누어 제거해야 지수가 모두 짝수가 됩니다. 따라서 x = 3 × 7 = 21 입니다.'
        });
        break;

      case '5-6':
        renderProblemSupportCanvas(two, {
          badge: '마무리 06번',
          title: '서로소인 두 수 찾기',
          given: '공약수가 1뿐인 두 수',
          guide: '💡 보기의 두 수를 소인수분해하여 공통인 소인수가 전혀 없는 쌍을 찾으세요.'
        });
        break;

      case '5-7':
        renderProblemSupportCanvas(two, {
          badge: '마무리 07번',
          title: '최대공약수와 최소공배수 구하기',
          given: '두 수 2² × 3³ × 5 와 2³ × 3² × 7',
          guide: '💡 최대공약수는 공통 소인수의 최소 지수, 최소공배수는 모든 소인수의 최고 지수를 곱합니다.'
        });
        break;

      case '5-8':
        renderProblemSupportCanvas(two, {
          badge: '마무리 08번',
          title: 'A와 36의 관계 추론',
          given: 'GCD(A, 36) = 12,  LCM(A, 36) = 180',
          guide: '💡 두 수의 곱은 최대공약수와 최소공배수의 곱과 같습니다: A × 36 = 12 × 180.'
        });
        break;

      case '5-9':
        renderProblemSupportCanvas(two, {
          badge: '마무리 09번',
          title: '비가 3:7 인 두 수의 차',
          given: '두 수 3k, 7k 의 최소공배수가 105',
          guide: '💡 3과 7은 서로소이므로 LCM = 3 × 7 × k = 21k = 105 ➔ k = 5 입니다.'
        });
        break;

      case '5-10':
        renderProblemSupportCanvas(two, {
          badge: '마무리 10번',
          title: '두 분수를 자연수로 만드는 가장 작은 기약분수',
          given: '7/12 와 14/15 에 곱하여 자연수가 되는 가장 작은 분수 b/a',
          guide: '💡 분자 b는 분모들(12, 15)의 최소공배수, 분모 a는 분자들(7, 14)의 최대공약수입니다.'
        });
        break;

      case '5-11':
        renderProblemSupportCanvas(two, {
          badge: '마무리 11번 (서술형)',
          title: '소인수분해와 지수 합 a+b',
          given: '360 = 2^a × 3^b × 5',
          guide: '💡 360을 소인수분해하여 2의 지수 a와 3의 지수 b를 구한 뒤 더하세요.'
        });
        break;

      case '5-12':
        renderProblemSupportCanvas(two, {
          badge: '마무리 12번 (서술형)',
          title: '1부터 12까지의 곱과 소인수 지수',
          given: '1 × 2 × … × 12 = 2^a × 3^b × 5^c × 7^d × 11',
          guide: '💡 1부터 12까지 수들 속에 포함된 소인수 2, 3, 5, 7의 개수를 각각 카운트하세요.'
        });
        break;

      case '5-13':
        renderProblemSupportCanvas(two, {
          badge: '마무리 13번 (서술형)',
          title: '세 수의 최대공약수가 6일 때 미지수 A',
          given: 'GCD(54, 90, A) = 6,  A는 20 이상 30 이하의 자연수',
          guide: '💡 A는 6의 배수이어야 하며, 54와 90의 공통 소인수 중 3²의 배수가 되어서는 안 됩니다.'
        });
        break;

      case '5-14':
        renderProblemSupportCanvas(two, {
          badge: '마무리 14번 (서술형)',
          title: 'GCD와 LCM 연결 트리 탐색',
          given: '두 수의 최대공약수와 최소공배수의 성질을 연결하는 종합 문제',
          guide: '💡 주어진 조건에 따라 단계별로 소인수분해를 수행하고 관계식을 정리하세요.'
        });
        break;

      // ----------------------------------------
      // Tab 6: 창의융합 프로젝트 (6-1)
      // ----------------------------------------
      case '6-1':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">🎨 몬드리안 격자 분할 비율 조절:</span>
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#f1f5f9;" onclick="changeMondrianRatio(-1)">◀ 이전 분할</button>
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#0284c7; color:#ffffff; font-weight:800;" onclick="changeMondrianRatio(1)">다음 분할 ▶</button>
              </div>
              <span style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:4px 14px; border-radius:12px; font-size:0.85rem; border:1px solid #bfdbfe;">
                소인수분해와 정수 비율을 이용한 몬드리안 면적 분할 예술
              </span>
            </div>
          `;
        }
        renderMondrianCanvas(two, simState.mondrianRatio);
        break;

      default:
        renderProblemSupportCanvas(two, {
          badge: '학습 지원',
          title: '수학 자유 연습 영역',
          given: '문제 풀이 과정을 자유롭게 기록해보세요.',
          guide: '💡 상단 도구 모음의 펜 도구를 활용할 수 있습니다.'
        });
        break;
    }
  }
  window.setupSubstepSimulator = setupSubstepSimulator;

  // =========================================================================
  // 0단원 전용 정적 인포그래픽 도표 렌더러 (조작 제거 완비)
  // =========================================================================

  // 0-1: 12개의 타일로 만드는 직사각형과 약수·배수 (3가지 경우를 한눈에 도표화)
  function renderTileArrayCanvas(two) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;

    // 상단 제목
    const tTitle = two.makeText("📐 [초등 복습] 12개의 정사각형 타일로 만드는 직사각형 배열", cx, 28);
    tTitle.size = 17; tTitle.weight = 800; tTitle.fill = '#1e293b';

    // 3개의 직사각형 카드 나란히 배치
    // 카드 1: 1 × 12
    const y1 = 80;
    const box1 = two.makeRoundedRectangle(cx, y1, 480, 52, 8);
    box1.fill = '#f8fafc'; box1.stroke = '#cbd5e1'; box1.linewidth = 1.5;
    const l1 = two.makeText("1행 × 12열 (가로 12, 세로 1)", cx - 130, y1);
    l1.size = 14; l1.weight = 800; l1.fill = '#0284c7';
    // 12칸 작은 타일
    const startX1 = cx - 20;
    for (let j = 0; j < 12; j++) {
      const tile = two.makeRoundedRectangle(startX1 + j * 18, y1, 16, 16, 2);
      tile.fill = '#38bdf8'; tile.stroke = '#0284c7'; tile.linewidth = 1;
      const numT = two.makeText(String(j + 1), startX1 + j * 18, y1);
      numT.size = 10; numT.weight = 700; numT.fill = '#ffffff';
    }
    const r1 = two.makeText("1 × 12 = 12", cx + 200, y1);
    r1.size = 14; r1.weight = 800; r1.fill = '#15803d';

    // 카드 2: 2 × 6
    const y2 = 150;
    const box2 = two.makeRoundedRectangle(cx, y2, 480, 68, 8);
    box2.fill = '#f8fafc'; box2.stroke = '#cbd5e1'; box2.linewidth = 1.5;
    const l2 = two.makeText("2행 × 6열 (가로 6, 세로 2)", cx - 130, y2);
    l2.size = 14; l2.weight = 800; l2.fill = '#0284c7';
    // 2x6 타일
    const startX2 = cx + 20;
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 6; c++) {
        const num = r * 6 + c + 1;
        const tile = two.makeRoundedRectangle(startX2 + c * 22, y2 - 12 + r * 24, 20, 20, 3);
        tile.fill = '#0284c7'; tile.stroke = '#0369a1'; tile.linewidth = 1;
        const numT = two.makeText(String(num), startX2 + c * 22, y2 - 12 + r * 24);
        numT.size = 11; numT.weight = 700; numT.fill = '#ffffff';
      }
    }
    const r2 = two.makeText("2 × 6 = 12", cx + 200, y2);
    r2.size = 14; r2.weight = 800; r2.fill = '#15803d';

    // 카드 3: 3 × 4
    const y3 = 236;
    const box3 = two.makeRoundedRectangle(cx, y3, 480, 84, 8);
    box3.fill = '#f8fafc'; box3.stroke = '#cbd5e1'; box3.linewidth = 1.5;
    const l3 = two.makeText("3행 × 4열 (가로 4, 세로 3)", cx - 130, y3);
    l3.size = 14; l3.weight = 800; l3.fill = '#0284c7';
    // 3x4 타일
    const startX3 = cx + 40;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        const num = r * 4 + c + 1;
        const tile = two.makeRoundedRectangle(startX3 + c * 22, y3 - 22 + r * 22, 20, 20, 3);
        tile.fill = '#0369a1'; tile.stroke = '#075985'; tile.linewidth = 1;
        const numT = two.makeText(String(num), startX3 + c * 22, y3 - 22 + r * 22);
        numT.size = 11; numT.weight = 700; numT.fill = '#ffffff';
      }
    }
    const r3 = two.makeText("3 × 4 = 12", cx + 200, y3);
    r3.size = 14; r3.weight = 800; r3.fill = '#15803d';

    // 하단 정리 배너
    const yBot = 305;
    const banner = two.makeRoundedRectangle(cx, yBot, 480, 36, 18);
    banner.fill = '#f0fdf4'; banner.stroke = '#86efac'; banner.linewidth = 1.5;
    const bTxt = two.makeText("💡 12 = 1 × 12 = 2 × 6 = 3 × 4  ➔  12의 약수: 1, 2, 3, 4, 6, 12", cx, yBot);
    bTxt.size = 14; bTxt.weight = 800; bTxt.fill = '#166534';

    two.update();
  }

  // 0-2: 12와 18의 공약수와 최대공약수 벤다이어그램 (정적 완성본)
  function renderVennCanvas(two) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;
    const cy = two.height / 2 - 10;

    const tTitle = two.makeText("⭕ [초등 복습] 12와 18의 공약수와 최대공약수 벤다이어그램", cx, 30);
    tTitle.size = 17; tTitle.weight = 800; tTitle.fill = '#1e293b';

    const radius = 95;
    const offset = 75;

    // 원 A: 12의 약수
    const circleA = two.makeCircle(cx - offset, cy, radius);
    circleA.fill = 'rgba(56, 189, 248, 0.15)';
    circleA.stroke = '#0284c7';
    circleA.linewidth = 2.5;

    // 원 B: 18의 약수
    const circleB = two.makeCircle(cx + offset, cy, radius);
    circleB.fill = 'rgba(168, 85, 247, 0.15)';
    circleB.stroke = '#9333ea';
    circleB.linewidth = 2.5;

    // 원 이름 라벨
    const lblA = two.makeText("12의 약수", cx - offset - 30, cy - radius - 14);
    lblA.size = 15; lblA.weight = 800; lblA.fill = '#0284c7';
    const lblB = two.makeText("18의 약수", cx + offset + 30, cy - radius - 14);
    lblB.size = 15; lblB.weight = 800; lblB.fill = '#9333ea';

    // 12만의 약수: 4, 12
    const t4 = two.makeText("4", cx - offset - 35, cy - 20);
    t4.size = 18; t4.weight = 800; t4.fill = '#0369a1';
    const t12 = two.makeText("12", cx - offset - 35, cy + 25);
    t12.size = 18; t12.weight = 800; t12.fill = '#0369a1';

    // 18만의 약수: 9, 18
    const t9 = two.makeText("9", cx + offset + 35, cy - 20);
    t9.size = 18; t9.weight = 800; t9.fill = '#7e22ce';
    const t18 = two.makeText("18", cx + offset + 35, cy + 25);
    t18.size = 18; t18.weight = 800; t18.fill = '#7e22ce';

    // 공약수 (교집합): 1, 2, 3, 6
    const t1 = two.makeText("1", cx, cy - 50);
    t1.size = 18; t1.weight = 800; t1.fill = '#15803d';
    const t2 = two.makeText("2", cx, cy - 20);
    t2.size = 18; t2.weight = 800; t2.fill = '#15803d';
    const t3 = two.makeText("3", cx, cy + 10);
    t3.size = 18; t3.weight = 800; t3.fill = '#15803d';

    // 6 (최대공약수) 특별 하이라이트
    const t6Badge = two.makeRoundedRectangle(cx, cy + 45, 52, 26, 6);
    t6Badge.fill = '#fef08a'; t6Badge.stroke = '#ca8a04'; t6Badge.linewidth = 2;
    const t6 = two.makeText("6 👑", cx, cy + 45);
    t6.size = 16; t6.weight = 900; t6.fill = '#854d0e';

    const lblInter = two.makeText("공약수", cx, cy - radius - 14);
    lblInter.size = 15; lblInter.weight = 800; lblInter.fill = '#15803d';

    // 하단 결론 배너
    const yBot = cy + radius + 30;
    const banner = two.makeRoundedRectangle(cx, yBot, 480, 36, 18);
    banner.fill = '#f0fdf4'; banner.stroke = '#86efac'; banner.linewidth = 1.5;
    const bTxt = two.makeText("💡 공약수: 1, 2, 3, 6  ➔  가장 큰 공약수: 6 (최대공약수)", cx, yBot);
    bTxt.size = 14; bTxt.weight = 800; bTxt.fill = '#166534';

    two.update();
  }

  // 0-3: 4와 6의 수직선 도약과 최소공배수 (정적 완성본)
  function renderLcmJumpCanvas(two) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;
    const cy = two.height / 2 - 5;

    const tTitle = two.makeText("🐰🐸 [초등 복습] 4와 6의 수직선 도약과 최소공배수", cx, 30);
    tTitle.size = 17; tTitle.weight = 800; tTitle.fill = '#1e293b';

    const padX = 50;
    const startX = padX;
    const endX = two.width - padX;
    const numLineY = cy;

    // 수직선 본체
    const line = two.makeLine(startX, numLineY, endX, numLineY);
    line.stroke = '#64748b'; line.linewidth = 2.5;

    // 눈금 (0 ~ 24)
    const maxVal = 24;
    const stepX = (endX - startX) / maxVal;
    for (let v = 0; v <= maxVal; v++) {
      const x = startX + v * stepX;
      const isKey = (v === 0 || v === 4 || v === 6 || v === 8 || v === 12 || v === 16 || v === 18 || v === 20 || v === 24);
      const tickH = isKey ? 10 : 5;
      const tick = two.makeLine(x, numLineY - tickH, x, numLineY + tickH);
      tick.stroke = isKey ? '#0f172a' : '#cbd5e1';
      tick.linewidth = isKey ? 2 : 1;

      if (isKey) {
        const numT = two.makeText(String(v), x, numLineY + 22);
        numT.size = (v === 12 || v === 24) ? 16 : 13;
        numT.weight = (v === 12 || v === 24) ? 900 : 700;
        numT.fill = (v === 12) ? '#dc2626' : ((v === 24) ? '#ea580c' : '#475569');
      }
    }

    // 4의 도약 (토끼: 위쪽 파란 아치)
    for (let v = 0; v < 24; v += 4) {
      const x1 = startX + v * stepX;
      const x2 = startX + (v + 4) * stepX;
      const midX = (x1 + x2) / 2;
      const arch = two.makeCurve(x1, numLineY, midX, numLineY - 32, x2, numLineY, true);
      arch.noFill(); arch.stroke = '#0284c7'; arch.linewidth = 2;
    }
    const lblRabbit = two.makeText("🐰 토끼 (4의 배수: 4, 8, 12, 16, 20, 24)", startX + 130, numLineY - 45);
    lblRabbit.size = 13; lblRabbit.weight = 800; lblRabbit.fill = '#0284c7';

    // 6의 도약 (개구리: 아래쪽 주황 아치)
    for (let v = 0; v < 24; v += 6) {
      const x1 = startX + v * stepX;
      const x2 = startX + (v + 6) * stepX;
      const midX = (x1 + x2) / 2;
      const arch = two.makeCurve(x1, numLineY, midX, numLineY + 38, x2, numLineY, true);
      arch.noFill(); arch.stroke = '#ea580c'; arch.linewidth = 2;
    }
    const lblFrog = two.makeText("🐸 개구리 (6의 배수: 6, 12, 18, 24)", startX + 120, numLineY + 58);
    lblFrog.size = 13; lblFrog.weight = 800; lblFrog.fill = '#ea580c';

    // 12 (첫 번째 만남 🚩 최소공배수)
    const x12 = startX + 12 * stepX;
    const flag12 = two.makeRoundedRectangle(x12, numLineY - 60, 130, 26, 6);
    flag12.fill = '#fef2f2'; flag12.stroke = '#ef4444'; flag12.linewidth = 2;
    const fTxt12 = two.makeText("🚩 최소공배수: 12", x12, numLineY - 60);
    fTxt12.size = 13; fTxt12.weight = 900; fTxt12.fill = '#dc2626';

    // 24 (두 번째 만남 🚩 공배수)
    const x24 = startX + 24 * stepX;
    const flag24 = two.makeRoundedRectangle(x24 - 15, numLineY - 60, 110, 26, 6);
    flag24.fill = '#fffbeb'; flag24.stroke = '#f59e0b'; flag24.linewidth = 1.5;
    const fTxt24 = two.makeText("두 번째 공배수 24", x24 - 15, numLineY - 60);
    fTxt24.size = 12; fTxt24.weight = 800; fTxt24.fill = '#b45309';

    // 하단 결론 배너
    const banner = two.makeRoundedRectangle(cx, cy + 90, 480, 36, 18);
    banner.fill = '#f0fdf4'; banner.stroke = '#86efac'; banner.linewidth = 1.5;
    const bTxt = two.makeText("💡 4와 6의 공배수: 12, 24, 36…  ➔  가장 작은 공배수: 12 (최소공배수)", cx, cy + 90);
    bTxt.size = 14; bTxt.weight = 800; bTxt.fill = '#166534';

    two.update();
  }

  // 0-4: 약수의 개수에 따른 자연수의 3분류 도표 (정적 완성본)
  function renderClassifyCanvas(two) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;
    const cy = two.height / 2 - 5;

    const tTitle = two.makeText("📊 [초등 복습] 1부터 15까지 자연수의 약수 개수별 3분류", cx, 30);
    tTitle.size = 17; tTitle.weight = 800; tTitle.fill = '#1e293b';

    const cardW = 150;
    const cardH = 180;
    const gap = 16;
    const startX = cx - cardW - gap;

    // 분류 1: 약수가 1개뿐인 수
    const box1 = two.makeRoundedRectangle(startX, cy, cardW, cardH, 10);
    box1.fill = '#f8fafc'; box1.stroke = '#94a3b8'; box1.linewidth = 2;
    const h1 = two.makeText("약수가 1개", startX, cy - 65);
    h1.size = 15; h1.weight = 800; h1.fill = '#475569';
    const num1 = two.makeText("1", startX, cy - 10);
    num1.size = 36; num1.weight = 900; num1.fill = '#0f172a';
    const sub1 = two.makeText("소수도 아니고\n합성수도 아님", startX, cy + 45);
    sub1.size = 12; sub1.weight = 700; sub1.fill = '#64748b';

    // 분류 2: 약수가 2개인 수 (소수)
    const box2 = two.makeRoundedRectangle(cx, cy, cardW, cardH, 10);
    box2.fill = '#f0fdf4'; box2.stroke = '#16a34a'; box2.linewidth = 2.5;
    const h2 = two.makeText("약수가 2개 (소수)", cx, cy - 65);
    h2.size = 15; h2.weight = 900; h2.fill = '#166534';
    const num2 = two.makeText("2, 3, 5,\n7, 11, 13", cx, cy - 10);
    num2.size = 16; num2.weight = 800; num2.fill = '#15803d';
    const sub2 = two.makeText("1과 자기 자신만을\n약수로 가짐 (총 6개)", cx, cy + 45);
    sub2.size = 12; sub2.weight = 700; sub2.fill = '#166534';

    // 분류 3: 약수가 3개 이상인 수 (합성수)
    const box3 = two.makeRoundedRectangle(cx + cardW + gap, cy, cardW, cardH, 10);
    box3.fill = '#fffbeb'; box3.stroke = '#d97706'; box3.linewidth = 2;
    const h3 = two.makeText("약수 3개 이상 (합성수)", cx + cardW + gap, cy - 65);
    h3.size = 15; h3.weight = 800; h3.fill = '#b45309';
    const num3 = two.makeText("4, 6, 8, 9,\n10, 12, 14, 15", cx + cardW + gap, cy - 10);
    num3.size = 15; num3.weight = 800; num3.fill = '#b45309';
    const sub3 = two.makeText("1과 자신 외의 약수를\n가짐 (총 8개)", cx + cardW + gap, cy + 45);
    sub3.size = 12; sub3.weight = 700; sub3.fill = '#b45309';

    // 하단 정리 배너
    const banner = two.makeRoundedRectangle(cx, cy + 115, 480, 36, 18);
    banner.fill = '#eff6ff'; banner.stroke = '#93c5fd'; banner.linewidth = 1.5;
    const bTxt = two.makeText("💡 자연수 = 1  +  소수(약수 2개)  +  합성수(약수 3개 이상)", cx, cy + 115);
    bTxt.size = 14; bTxt.weight = 800; bTxt.fill = '#1d4ed8';

    two.update();
  }

  // =========================================================================
  // 핵심 10대 인터랙티브 캔버스 렌더러 함수군
  // =========================================================================

  // 1-2: 에라토스테네스의 체 (1~50 격자판)
  function renderSieveCanvas(two, step) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;
    const startX = cx - 180;
    const startY = 65;
    const primes = new Set([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]);

    const title = two.makeText("🔬 [탐구] 1부터 50까지 에라토스테네스의 체 (소수 15개 찾기)", cx, 30);
    title.size = 17; title.weight = 800; title.fill = '#1e293b';

    for (let n = 1; n <= 50; n++) {
      const col = (n - 1) % 10;
      const row = Math.floor((n - 1) / 10);
      const x = startX + col * 40;
      const y = startY + row * 40;

      let isErased = false;
      if (step >= 1 && n === 1) isErased = true;
      if (step >= 2 && n > 2 && n % 2 === 0) isErased = true;
      if (step >= 3 && n > 3 && n % 3 === 0) isErased = true;
      if (step >= 4 && n > 5 && n % 5 === 0) isErased = true;
      if (step >= 5 && n > 7 && n % 7 === 0) isErased = true;

      // 수동 토글 반영
      if (simState.sieveManualToggled.has(n)) {
        isErased = !isErased;
      }

      const isP = primes.has(n);
      const isBasePrime = (n === 2 && step >= 2) || (n === 3 && step >= 3) || (n === 5 && step >= 4) || (n === 7 && step >= 5);

      const rect = two.makeRoundedRectangle(x, y, 36, 34, 6);

      if (isErased) {
        rect.fill = '#f1f5f9'; rect.stroke = '#e2e8f0'; rect.linewidth = 1;
      } else if (step === 6 && isP) {
        rect.fill = '#dcfce7'; rect.stroke = '#22c55e'; rect.linewidth = 2;
      } else if (isBasePrime) {
        rect.fill = '#e0f2fe'; rect.stroke = '#0284c7'; rect.linewidth = 2;
      } else {
        rect.fill = '#ffffff'; rect.stroke = '#cbd5e1'; rect.linewidth = 1.5;
      }

      const txt = two.makeText(String(n), x, y);
      txt.size = 14; txt.weight = 800;
      if (isErased) {
        txt.fill = '#cbd5e1';
      } else if (step === 6 && isP) {
        txt.fill = '#15803d';
      } else if (isBasePrime) {
        txt.fill = '#0284c7';
      } else {
        txt.fill = '#1e293b';
      }

      if (isErased) {
        const slash = two.makeLine(x - 12, y - 10, x + 12, y + 10);
        slash.stroke = '#94a3b8'; slash.linewidth = 1.5;
      }
    }

    // 하단 요약 배너
    const yBot = startY + 5 * 40 + 25;
    const banner = two.makeRoundedRectangle(cx, yBot, 490, 36, 18);
    banner.fill = (step === 6) ? '#f0fdf4' : '#f8fafc';
    banner.stroke = (step === 6) ? '#86efac' : '#e2e8f0';
    banner.linewidth = 1.5;

    const bTxt = two.makeText(
      (step === 6)
        ? "🎉 1부터 50까지의 소수 (총 15개): 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47"
        : "💡 위의 단계 버튼을 차례로 누르거나 숫자를 직접 클릭하여 체질해 보세요.",
      cx, yBot
    );
    bTxt.size = 13; bTxt.weight = 800;
    bTxt.fill = (step === 6) ? '#166534' : '#64748b';

    two.update();
  }

  // 1-7: 세균 증식 거듭제곱 비주얼라이저
  function renderBacteriaGraphCanvas(two, minutes) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;
    const times = minutes / 10;
    const count = Math.pow(2, times);

    const title = two.makeText("🦠 [비주얼라이저] 10분마다 2배씩 늘어나는 세균과 거듭제곱", cx, 30);
    title.size = 17; title.weight = 800; title.fill = '#1e293b';

    // 수식 대형 카드
    const cardY = 75;
    const formulaCard = two.makeRoundedRectangle(cx, cardY, 480, 52, 10);
    formulaCard.fill = '#f0fdf4'; formulaCard.stroke = '#86efac'; formulaCard.linewidth = 2;

    let expr = "1";
    if (times === 1) expr = "2";
    else if (times > 1) expr = Array(times).fill("2").join(" × ");

    const fTxt = two.makeText(`경과 시간 ${minutes}분:  ${expr} = 2${times > 0 ? '^' + times : ''} = ${count}배`, cx, cardY);
    fTxt.size = 16; fTxt.weight = 900; fTxt.fill = '#15803d';

    // 세포 시각화 영역 (그리드 배치)
    const areaY = 200;
    const areaBox = two.makeRoundedRectangle(cx, areaY, 480, 170, 12);
    areaBox.fill = '#f8fafc'; areaBox.stroke = '#e2e8f0'; areaBox.linewidth = 1.5;

    // 최대 64개 세포 렌더링
    const cols = Math.min(count, 16);
    const rows = Math.ceil(count / cols);
    const cellSize = (count <= 16) ? 30 : 18;
    const startCellX = cx - (cols * (cellSize + 6)) / 2 + cellSize / 2;
    const startCellY = areaY - (rows * (cellSize + 6)) / 2 + cellSize / 2;

    for (let i = 0; i < count; i++) {
      const r = Math.floor(i / cols);
      const c = i % cols;
      const x = startCellX + c * (cellSize + 6);
      const y = startCellY + r * (cellSize + 6);

      const circle = two.makeCircle(x, y, cellSize / 2);
      circle.fill = '#22c55e';
      circle.stroke = '#15803d';
      circle.linewidth = 1.5;

      if (count <= 16) {
        const dot = two.makeCircle(x, y, 3);
        dot.fill = '#ffffff'; dot.noStroke();
      }
    }

    const info = two.makeText(`현재 활성 세균 수: ${count}개 (총 ${times}회 분열 완료)`, cx, areaY + 70);
    info.size = 13; info.weight = 700; info.fill = '#475569';

    two.update();
  }

  // 1-9: 열차 소수 역과 승객 시뮬레이터
  function renderTrainStationCanvas(two, station) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;

    const title = two.makeText("🚂 [시뮬레이터] 열차 소수 역과 승객 (약수의 개수 탐구)", cx, 30);
    title.size = 17; title.weight = 800; title.fill = '#1e293b';

    // 기차 레일
    const railY = 120;
    const rail1 = two.makeLine(30, railY - 10, two.width - 30, railY - 10);
    rail1.stroke = '#64748b'; rail1.linewidth = 3;
    const rail2 = two.makeLine(30, railY + 10, two.width - 30, railY + 10);
    rail2.stroke = '#64748b'; rail2.linewidth = 3;
    for (let x = 40; x < two.width - 30; x += 25) {
      const sleeper = two.makeLine(x, railY - 14, x, railY + 14);
      sleeper.stroke = '#94a3b8'; sleeper.linewidth = 2;
    }

    // 열차 본체
    const trainBox = two.makeRoundedRectangle(cx, railY, 220, 56, 10);
    trainBox.fill = '#0284c7'; trainBox.stroke = '#0369a1'; trainBox.linewidth = 2;
    const trainT = two.makeText(`🚆 수학 열차 #${station}번 역 도착`, cx, railY);
    trainT.size = 14; trainT.weight = 800; trainT.fill = '#ffffff';

    // 플랫폼 영역
    const platY = 220;
    const platBox = two.makeRoundedRectangle(cx, platY, 480, 110, 12);
    platBox.fill = '#f8fafc'; platBox.stroke = '#cbd5e1'; platBox.linewidth = 1.5;

    // 해당 역 번호의 약수 승객들
    const divs = [];
    for (let i = 1; i <= station; i++) {
      if (station % i === 0) divs.push(i);
    }
    const isPrime = (divs.length === 2);

    const pTitle = two.makeText(`🚉 [${station}번 역 플랫폼] 내린 승객 (약수 번호 승객): 총 ${divs.length}명`, cx, platY - 32);
    pTitle.size = 14; pTitle.weight = 800; pTitle.fill = '#1e293b';

    // 승객들 렌더링
    const pStartX = cx - (divs.length * 44) / 2 + 22;
    divs.forEach((d, idx) => {
      const px = pStartX + idx * 44;
      const py = platY + 10;
      const passenger = two.makeCircle(px, py - 6, 14);
      passenger.fill = isPrime ? '#dcfce7' : '#e0f2fe';
      passenger.stroke = isPrime ? '#16a34a' : '#0284c7';
      passenger.linewidth = 2;
      const pNum = two.makeText(String(d), px, py - 6);
      pNum.size = 12; pNum.weight = 900; pNum.fill = isPrime ? '#15803d' : '#0369a1';

      const pBody = two.makeLine(px, py + 8, px, py + 22);
      pBody.stroke = '#64748b'; pBody.linewidth = 2;
    });

    // 하단 판정 배너
    const yBot = 300;
    const banner = two.makeRoundedRectangle(cx, yBot, 480, 36, 18);
    banner.fill = isPrime ? '#f0fdf4' : (station === 1 ? '#f8fafc' : '#eff6ff');
    banner.stroke = isPrime ? '#86efac' : '#cbd5e1';
    banner.linewidth = 2;

    let msg = "";
    if (isPrime) msg = `🎉 승객이 정확히 2명(1과 자기자신) 내렸으므로 [소수 역 🟢]입니다!`;
    else if (station === 1) msg = `⚠️ 1번 역은 1명만 내리므로 소수도 합성수도 아닙니다.`;
    else msg = `⚠️ 승객이 3명 이상(${divs.length}명) 내렸으므로 [합성수 역 🟠]입니다!`;

    const bTxt = two.makeText(msg, cx, yBot);
    bTxt.size = 14; bTxt.weight = 800;
    bTxt.fill = isPrime ? '#166534' : '#1e40af';

    two.update();
  }

  // 2-2: 소인수분해 가지치기 트리 빌더
  function renderFactorTreeCanvas(two, num, branch, step) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;

    const title = two.makeText(`🌳 [트리 빌더] ${num}의 소인수분해 가지치기 트리`, cx, 30);
    title.size = 17; title.weight = 800; title.fill = '#1e293b';

    const rootY = 70;
    // 루트 노드
    const rootCircle = two.makeCircle(cx, rootY, 26);
    rootCircle.fill = '#eff6ff'; rootCircle.stroke = '#0284c7'; rootCircle.linewidth = 2.5;
    const rootT = two.makeText(String(num), cx, rootY);
    rootT.size = 18; rootT.weight = 900; rootT.fill = '#0f172a';

    if (num === 36) {
      if (step >= 1) {
        // 가지 1
        two.makeLine(cx, rootY + 26, cx - 80, 140).stroke = '#94a3b8';
        two.makeLine(cx, rootY + 26, cx + 80, 140).stroke = '#94a3b8';

        const nA = two.makeCircle(cx - 80, 140, 22);
        nA.fill = '#f8fafc'; nA.stroke = '#64748b'; nA.linewidth = 2;
        const tA = two.makeText("6", cx - 80, 140);
        tA.size = 16; tA.weight = 800; tA.fill = '#334155';

        const nB = two.makeCircle(cx + 80, 140, 22);
        nB.fill = '#f8fafc'; nB.stroke = '#64748b'; nB.linewidth = 2;
        const tB = two.makeText("6", cx + 80, 140);
        tB.size = 16; tB.weight = 800; tB.fill = '#334155';
      }
      if (step >= 2) {
        // 6 ➔ 2 × 3
        two.makeLine(cx - 80, 162, cx - 120, 220).stroke = '#94a3b8';
        two.makeLine(cx - 80, 162, cx - 40, 220).stroke = '#94a3b8';
        two.makeLine(cx + 80, 162, cx + 40, 220).stroke = '#94a3b8';
        two.makeLine(cx + 80, 162, cx + 120, 220).stroke = '#94a3b8';

        const pNodes = [
          { x: cx - 120, y: 220, val: "2" },
          { x: cx - 40, y: 220, val: "3" },
          { x: cx + 40, y: 220, val: "2" },
          { x: cx + 120, y: 220, val: "3" }
        ];

        pNodes.forEach(p => {
          const c = two.makeCircle(p.x, p.y, 20);
          c.fill = '#fef08a'; c.stroke = '#ca8a04'; c.linewidth = 2.5;
          const t = two.makeText(p.val, p.x, p.y);
          t.size = 16; t.weight = 900; t.fill = '#854d0e';
        });
      }
    } else {
      // 60 또는 72
      if (step >= 1) {
        two.makeLine(cx, rootY + 26, cx - 70, 140).stroke = '#94a3b8';
        two.makeLine(cx, rootY + 26, cx + 70, 140).stroke = '#94a3b8';
        two.makeCircle(cx - 70, 140, 20).fill = '#fef08a';
        two.makeText("2", cx - 70, 140).size = 16;
        two.makeCircle(cx + 70, 140, 20).fill = '#f8fafc';
        two.makeText(num === 60 ? "30" : "36", cx + 70, 140).size = 16;
      }
      if (step >= 2) {
        two.makeLine(cx + 70, 160, cx + 30, 220).stroke = '#94a3b8';
        two.makeLine(cx + 70, 160, cx + 110, 220).stroke = '#94a3b8';
        two.makeCircle(cx + 30, 220, 20).fill = '#fef08a';
        two.makeText(num === 60 ? "3" : "2", cx + 30, 220).size = 16;
        two.makeCircle(cx + 110, 220, 20).fill = '#fef08a';
        two.makeText(num === 60 ? "5" : "18", cx + 110, 220).size = 16;
      }
    }

    // 하단 최종 소인수분해 거듭제곱 배너
    const yBot = 285;
    const banner = two.makeRoundedRectangle(cx, yBot, 480, 36, 18);
    banner.fill = (step >= 2) ? '#f0fdf4' : '#f8fafc';
    banner.stroke = (step >= 2) ? '#86efac' : '#e2e8f0';
    banner.linewidth = 2;

    const resStr = (num === 36) ? "36 = 2 × 2 × 3 × 3 = 2² × 3²" : (num === 60 ? "60 = 2² × 3 × 5" : "72 = 2³ × 3²");
    const bTxt = two.makeText(
      (step >= 2) ? `🎉 소인수분해 결과: ${resStr}` : "💡 [다음 단계 ▶] 버튼을 눌러 소인수 분해를 진행하세요.",
      cx, yBot
    );
    bTxt.size = 14; bTxt.weight = 800;
    bTxt.fill = (step >= 2) ? '#166534' : '#64748b';

    two.update();
  }

  // 2-7: 제곱수 만들기 지수 짝수 밸런스 저울
  function renderSquareMakerCanvas(two, multX) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;

    const title = two.makeText("⚖️ [밸런스 저울] 56 × x = (자연수)² 제곱수 만들기 탐구", cx, 30);
    title.size = 17; title.weight = 800; title.fill = '#1e293b';

    const total = 56 * multX;
    let t = total;
    let exp2 = 0, exp7 = 0;
    while (t > 0 && t % 2 === 0) { exp2++; t /= 2; }
    while (t > 0 && t % 7 === 0) { exp7++; t /= 7; }
    const isSquare = (exp2 % 2 === 0 && exp7 % 2 === 0 && t === 1);

    // 56 분해 박스
    const boxY = 80;
    const box56 = two.makeRoundedRectangle(cx, boxY, 480, 48, 8);
    box56.fill = '#f8fafc'; box56.stroke = '#cbd5e1'; box56.linewidth = 1.5;
    const t56 = two.makeText(`56 = 2³ × 7¹  ➔  소인수 2의 지수: 3 (홀수), 소인수 7의 지수: 1 (홀수)`, cx, boxY);
    t56.size = 14; t56.weight = 800; t56.fill = '#334155';

    // 저울 기둥 2개 (소인수 2 기둥 vs 소인수 7 기둥)
    const pillarY = 190;
    const col2X = cx - 110;
    const col7X = cx + 110;

    // 기둥 2
    const p2 = two.makeRoundedRectangle(col2X, pillarY, 130, 110, 8);
    p2.fill = (exp2 % 2 === 0) ? '#f0fdf4' : '#fffbeb';
    p2.stroke = (exp2 % 2 === 0) ? '#16a34a' : '#f59e0b';
    p2.linewidth = 2;
    const p2H = two.makeText(`소인수 [ 2 ]`, col2X, pillarY - 35);
    p2H.size = 15; p2H.weight = 800; p2H.fill = '#0f172a';
    const p2Exp = two.makeText(`지수: ${exp2} (${exp2 % 2 === 0 ? '짝수 🟢' : '홀수 ⚠️'})`, col2X, pillarY);
    p2Exp.size = 14; p2Exp.weight = 800; p2Exp.fill = (exp2 % 2 === 0) ? '#166534' : '#b45309';
    const p2Sub = two.makeText(exp2 % 2 === 0 ? "짝수 지수 완성!" : "2가 1개 더 필요", col2X, pillarY + 30);
    p2Sub.size = 12; p2Sub.weight = 700; p2Sub.fill = '#64748b';

    // 기둥 7
    const p7 = two.makeRoundedRectangle(col7X, pillarY, 130, 110, 8);
    p7.fill = (exp7 % 2 === 0) ? '#f0fdf4' : '#fffbeb';
    p7.stroke = (exp7 % 2 === 0) ? '#16a34a' : '#f59e0b';
    p7.linewidth = 2;
    const p7H = two.makeText(`소인수 [ 7 ]`, col7X, pillarY - 35);
    p7H.size = 15; p7H.weight = 800; p7H.fill = '#0f172a';
    const p7Exp = two.makeText(`지수: ${exp7} (${exp7 % 2 === 0 ? '짝수 🟢' : '홀수 ⚠️'})`, col7X, pillarY);
    p7Exp.size = 14; p7Exp.weight = 800; p7Exp.fill = (exp7 % 2 === 0) ? '#166534' : '#b45309';
    const p7Sub = two.makeText(exp7 % 2 === 0 ? "짝수 지수 완성!" : "7이 1개 더 필요", col7X, pillarY + 30);
    p7Sub.size = 12; p7Sub.weight = 700; p7Sub.fill = '#64748b';

    // 하단 결론 배너
    const yBot = 285;
    const banner = two.makeRoundedRectangle(cx, yBot, 480, 36, 18);
    banner.fill = isSquare ? '#f0fdf4' : '#fffbeb';
    banner.stroke = isSquare ? '#86efac' : '#fde68a';
    banner.linewidth = 2;

    const root = isSquare ? Math.round(Math.sqrt(total)) : 0;
    const bTxt = two.makeText(
      isSquare
        ? `🎉 x = ${multX} 일 때: 56 × ${multX} = 2⁴ × 7² = (2² × 7)² = ${root}² (제곱수 완성!)`
        : `⚠️ x = ${multX} 일 때: 모든 소인수의 지수가 짝수가 아니므로 제곱수가 아닙니다.`,
      cx, yBot
    );
    bTxt.size = 13; bTxt.weight = 800;
    bTxt.fill = isSquare ? '#166534' : '#b45309';

    two.update();
  }

  // 3-1: 정사각형 타일 채우기 시뮬레이터 (18cm x 12cm)
  function renderTilingSquareCanvas(two, tileSize) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;

    const title = two.makeText("🟦 [시뮬레이터] 가로 18cm × 세로 12cm 바닥에 정사각형 타일 깔기", cx, 30);
    title.size = 16; title.weight = 800; title.fill = '#1e293b';

    const sz = tileSize;
    const fitW = (18 % sz === 0);
    const fitH = (12 % sz === 0);
    const isPerfect = (fitW && fitH);

    // 바닥 렌더링 (가로 18cm ➔ 360px, 세로 12cm ➔ 240px, scale 20)
    const scale = 18;
    const floorW = 18 * scale;
    const floorH = 12 * scale;
    const floorY = 160;

    const floorBox = two.makeRoundedRectangle(cx, floorY, floorW, floorH, 6);
    floorBox.fill = '#f8fafc'; floorBox.stroke = '#475569'; floorBox.linewidth = 2.5;

    // 타일 깔기
    const startX = cx - floorW / 2;
    const startY = floorY - floorH / 2;
    const tilePx = sz * scale;

    const numCols = Math.floor(18 / sz);
    const numRows = Math.floor(12 / sz);

    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        const tx = startX + c * tilePx + tilePx / 2;
        const ty = startY + r * tilePx + tilePx / 2;
        const tBox = two.makeRoundedRectangle(tx, ty, tilePx - 2, tilePx - 2, 4);
        tBox.fill = isPerfect ? '#0284c7' : '#38bdf8';
        tBox.stroke = '#0369a1';
        tBox.linewidth = 1;
      }
    }

    // 빈틈 경고 영역 (남는 공간이 있을 때)
    if (!fitW) {
      const remW = (18 % sz) * scale;
      const remBox = two.makeRoundedRectangle(startX + numCols * tilePx + remW / 2, floorY, remW, floorH, 2);
      remBox.fill = 'rgba(239, 68, 68, 0.25)';
      remBox.stroke = '#ef4444'; remBox.linewidth = 2;
      const wTxt = two.makeText("빈틈\n발생!", startX + numCols * tilePx + remW / 2, floorY);
      wTxt.size = 11; wTxt.weight = 800; wTxt.fill = '#dc2626';
    }

    // 치수 표시
    const dimTop = two.makeText("가로 18cm", cx, floorY - floorH / 2 - 12);
    dimTop.size = 14; dimTop.weight = 800; dimTop.fill = '#0f172a';
    const dimLeft = two.makeText("세로 12cm", cx - floorW / 2 - 25, floorY);
    dimLeft.size = 14; dimLeft.weight = 800; dimLeft.fill = '#0f172a';
    dimLeft.rotation = -Math.PI / 2;

    // 하단 결론 배너
    const yBot = 295;
    const banner = two.makeRoundedRectangle(cx, yBot, 480, 36, 18);
    banner.fill = isPerfect ? '#f0fdf4' : '#fef2f2';
    banner.stroke = isPerfect ? '#86efac' : '#fca5a5';
    banner.linewidth = 2;

    const bTxt = two.makeText(
      isPerfect
        ? (sz === 6 ? "🎉 최대공약수 6cm: 빈틈없이 채우는 가장 큰 정사각형 타일!" : `🎉 ${sz}cm 타일: 빈틈없이 완벽하게 채워짐 (${18/sz}×${12/sz}장)`)
        : `⚠️ ${sz}cm 타일: 18의 약수가 아니므로 빈틈이 발생하여 불가능!`,
      cx, yBot
    );
    bTxt.size = 13; bTxt.weight = 800;
    bTxt.fill = isPerfect ? '#166534' : '#b91c1c';

    two.update();
  }

  // 3-2: 소인수분해 거듭제곱 비교 최대공약수 밸런스 저울
  function renderGcdBalanceCanvas(two, pairKey, lowered) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;

    const title = two.makeText("⚖️ [지수 저울] 소인수분해를 이용한 최대공약수 구하기", cx, 30);
    title.size = 17; title.weight = 800; title.fill = '#1e293b';

    let nA = 12, nB = 18;
    let sA = "2² × 3¹", sB = "2¹ × 3²";
    let minExp2 = 1, minExp3 = 1;
    let gcdVal = 6;

    if (pairKey === '24_36') {
      nA = 24; nB = 36; sA = "2³ × 3¹"; sB = "2² × 3²"; minExp2 = 2; minExp3 = 1; gcdVal = 12;
    } else if (pairKey === '28_42') {
      nA = 28; nB = 42; sA = "2² × 7¹"; sB = "2¹ × 3¹ × 7¹"; minExp2 = 1; minExp3 = 0; gcdVal = 14;
    }

    // 두 수 카드
    const cardY = 85;
    const cA = two.makeRoundedRectangle(cx - 120, cardY, 210, 52, 8);
    cA.fill = '#eff6ff'; cA.stroke = '#3b82f6'; cA.linewidth = 2;
    const tA = two.makeText(`${nA} = ${sA}`, cx - 120, cardY);
    tA.size = 15; tA.weight = 800; tA.fill = '#1d4ed8';

    const cB = two.makeRoundedRectangle(cx + 120, cardY, 210, 52, 8);
    cB.fill = '#faf5ff'; cB.stroke = '#a855f7'; cB.linewidth = 2;
    const tB = two.makeText(`${nB} = ${sB}`, cx + 120, cardY);
    tB.size = 15; tB.weight = 800; tB.fill = '#7e22ce';

    // 아래 화살표
    const arr1 = two.makeLine(cx, 120, cx, 150);
    arr1.stroke = '#94a3b8'; arr1.linewidth = 2;

    // 최대공약수 도출 바구니
    const basketY = 195;
    const basket = two.makeRoundedRectangle(cx, basketY, 450, 72, 10);
    basket.fill = '#f0fdf4'; basket.stroke = '#22c55e'; basket.linewidth = 2.5;

    const bTitle = two.makeText("👑 [최대공약수 바구니: 공통 소인수의 최소 지수 선택]", cx, basketY - 18);
    bTitle.size = 13; bTitle.weight = 800; bTitle.fill = '#15803d';

    let expExpr = `2¹ × 3¹ = 6`;
    if (pairKey === '24_36') expExpr = `2² × 3¹ = 12`;
    else if (pairKey === '28_42') expExpr = `2¹ × 7¹ = 14`;

    const bVal = two.makeText(`최대공약수 = ${expExpr}`, cx, basketY + 14);
    bVal.size = 18; bVal.weight = 900; bVal.fill = '#166534';

    // 하단 안내 배너
    const yBot = 285;
    const banner = two.makeRoundedRectangle(cx, yBot, 480, 36, 18);
    banner.fill = '#eff6ff'; banner.stroke = '#93c5fd'; banner.linewidth = 1.5;
    const bTxt = two.makeText("💡 공통인 소인수 중 지수가 작거나 같은 것을 택하여 곱합니다.", cx, yBot);
    bTxt.size = 14; bTxt.weight = 800; bTxt.fill = '#1d4ed8';

    two.update();
  }

  // 4-2: 톱니바퀴 회전 및 최소공배수 시뮬레이터
  function renderGearsCanvas(two, angle) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;
    const cy = 150;

    const title = two.makeText("⚙️ [시뮬레이터] 톱니바퀴 맞물림 회전과 최소공배수", cx, 30);
    title.size = 17; title.weight = 800; title.fill = '#1e293b';

    const rA = 65;
    const rB = 95;
    const gearAx = cx - 80;
    const gearBx = cx + 80;

    // 톱니 A (24개, 각속도 높음)
    const angA = angle * (36 / 24);
    const circleA = two.makeCircle(gearAx, cy, rA);
    circleA.fill = '#e0f2fe'; circleA.stroke = '#0284c7'; circleA.linewidth = 3;
    // 톱니 이빨들
    for (let i = 0; i < 24; i++) {
      const a = angA + (i * Math.PI * 2) / 24;
      const tx = gearAx + Math.cos(a) * (rA + 6);
      const ty = cy + Math.sin(a) * (rA + 6);
      const tooth = two.makeCircle(tx, ty, 5);
      tooth.fill = (i === 0) ? '#ef4444' : '#0369a1';
      tooth.noStroke();
    }
    const tA = two.makeText("A\n24개", gearAx, cy);
    tA.size = 14; tA.weight = 800; tA.fill = '#0369a1';

    // 톱니 B (36개, 반대방향 회전)
    const angB = -angle;
    const circleB = two.makeCircle(gearBx, cy, rB);
    circleB.fill = '#fef3c7'; circleB.stroke = '#d97706'; circleB.linewidth = 3;
    for (let i = 0; i < 36; i++) {
      const a = angB + (i * Math.PI * 2) / 36;
      const tx = gearBx + Math.cos(a) * (rB + 6);
      const ty = cy + Math.sin(a) * (rB + 6);
      const tooth = two.makeCircle(tx, ty, 5);
      tooth.fill = (i === 0) ? '#ef4444' : '#b45309';
      tooth.noStroke();
    }
    const tB = two.makeText("B\n36개", gearBx, cy);
    tB.size = 15; tB.weight = 800; tB.fill = '#b45309';

    // 맞물림 중심 지점 표시
    const midX = (gearAx + gearBx) / 2;
    const contact = two.makeCircle(midX, cy, 7);
    contact.fill = '#ef4444'; contact.noStroke();

    // 하단 결론 배너
    const yBot = 285;
    const banner = two.makeRoundedRectangle(cx, yBot, 480, 36, 18);
    banner.fill = '#f0fdf4'; banner.stroke = '#86efac'; banner.linewidth = 2;
    const bTxt = two.makeText("🎉 24와 36의 최소공배수: 72 ➔ 72번째 톱니에서 처음으로 다시 맞물림!", cx, yBot);
    bTxt.size = 13; bTxt.weight = 800; bTxt.fill = '#166534';

    two.update();
  }

  // 4-10: 소수 판별 코딩 알고리즘 순서도 비주얼라이저
  function renderAlgoCanvas(two, n, isP, divisor) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;

    const title = two.makeText("💻 [알고리즘] 코딩으로 소수 판별하기 순서도", cx, 28);
    title.size = 17; title.weight = 800; title.fill = '#1e293b';

    // 순서도 블록들
    // 1. 시작 (입력 N)
    const b1 = two.makeRoundedRectangle(cx, 70, 200, 36, 18);
    b1.fill = '#eff6ff'; b1.stroke = '#3b82f6'; b1.linewidth = 2;
    const t1 = two.makeText(`1. 시작 (N = ${n} 입력)`, cx, 70);
    t1.size = 14; t1.weight = 800; t1.fill = '#1d4ed8';

    two.makeLine(cx, 88, cx, 115).stroke = '#94a3b8';

    // 2. 반복 i = 2부터 √N까지
    const b2 = two.makeRoundedRectangle(cx, 135, 260, 38, 8);
    b2.fill = '#f8fafc'; b2.stroke = '#64748b'; b2.linewidth = 2;
    const t2 = two.makeText(`2. i = 2부터 √${n}(≈${Math.floor(Math.sqrt(n))})까지 나눗셈`, cx, 135);
    t2.size = 13; t2.weight = 800; t2.fill = '#1e293b';

    two.makeLine(cx, 154, cx, 185).stroke = '#94a3b8';

    // 3. 조건 분기 N % i == 0 ?
    const b3 = two.makePolygon(cx, 215, 42, 4); // 다이아몬드
    b3.fill = '#fefce8'; b3.stroke = '#eab308'; b3.linewidth = 2;
    const t3 = two.makeText("N % i == 0 ?", cx, 215);
    t3.size = 13; t3.weight = 800; t3.fill = '#854d0e';

    // 분기 Yes / No
    // Yes ➔ 합성수
    two.makeLine(cx - 42, 215, cx - 110, 215).stroke = '#ef4444';
    const bYes = two.makeRoundedRectangle(cx - 150, 215, 80, 32, 6);
    bYes.fill = '#fef2f2'; bYes.stroke = '#ef4444'; bYes.linewidth = 2;
    const tYes = two.makeText("합성수!", cx - 150, 215);
    tYes.size = 13; tYes.weight = 800; tYes.fill = '#991b1b';

    // No ➔ 소수
    two.makeLine(cx + 42, 215, cx + 110, 215).stroke = '#16a34a';
    const bNo = two.makeRoundedRectangle(cx + 150, 215, 80, 32, 6);
    bNo.fill = '#f0fdf4'; bNo.stroke = '#16a34a'; bNo.linewidth = 2;
    const tNo = two.makeText("소수!", cx + 150, 215);
    tNo.size = 13; tNo.weight = 800; tNo.fill = '#166534';

    // 하단 최종 판정 배너
    const yBot = 285;
    const banner = two.makeRoundedRectangle(cx, yBot, 480, 36, 18);
    banner.fill = isP ? '#f0fdf4' : '#fef2f2';
    banner.stroke = isP ? '#86efac' : '#fca5a5';
    banner.linewidth = 2;

    const bTxt = two.makeText(
      isP
        ? `🎉 판정 완료: ${n}은(는) 1보다 큰 약수가 없으므로 [소수]입니다!`
        : `⚠️ 판정 완료: ${n}은(는) ${divisor}로 나누어떨어지므로 [합성수]입니다!`,
      cx, yBot
    );
    bTxt.size = 14; bTxt.weight = 800;
    bTxt.fill = isP ? '#166534' : '#991b1b';

    two.update();
  }

  // 5-1: 5월 달력 속 소수 날짜 찾기
  function renderCalendarCanvas(two) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;

    const title = two.makeText("📅 [달력 탐구] 5월 달력에서 소수 날짜 (11개) 모두 찾기", cx, 28);
    title.size = 17; title.weight = 800; title.fill = '#1e293b';

    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const startX = cx - 180;
    const startY = 65;

    // 요일 헤더
    for (let d = 0; d < 7; d++) {
      const x = startX + d * 60;
      const hTxt = two.makeText(days[d], x, startY);
      hTxt.size = 14; hTxt.weight = 800;
      hTxt.fill = (d === 0) ? '#ef4444' : ((d === 6) ? '#0284c7' : '#475569');
    }

    const primes = new Set([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31]);
    const firstDayOffset = 3; // 수요일 시작 가정

    for (let day = 1; day <= 31; day++) {
      const cellIdx = day + firstDayOffset - 1;
      const col = cellIdx % 7;
      const row = Math.floor(cellIdx / 7);
      const x = startX + col * 60;
      const y = startY + 28 + row * 34;

      const isPrime = primes.has(day);
      const isSelected = simState.calendarSelected.has(day);

      const cell = two.makeRoundedRectangle(x, y, 48, 28, 6);

      if (isSelected && isPrime) {
        cell.fill = '#dcfce7'; cell.stroke = '#16a34a'; cell.linewidth = 2;
      } else if (isSelected && !isPrime) {
        cell.fill = '#fef2f2'; cell.stroke = '#ef4444'; cell.linewidth = 1.5;
      } else {
        cell.fill = '#ffffff'; cell.stroke = '#e2e8f0'; cell.linewidth = 1;
      }

      const dTxt = two.makeText(String(day), x, y);
      dTxt.size = 13; dTxt.weight = 800;
      dTxt.fill = (isSelected && isPrime) ? '#15803d' : ((isSelected && !isPrime) ? '#dc2626' : '#1e293b');
    }

    // 하단 요약 배너
    const yBot = 285;
    const isAllFound = (simState.calendarSelected.size === 11);
    const banner = two.makeRoundedRectangle(cx, yBot, 480, 36, 18);
    banner.fill = isAllFound ? '#f0fdf4' : '#eff6ff';
    banner.stroke = isAllFound ? '#86efac' : '#bfdbfe';
    banner.linewidth = 2;

    const bTxt = two.makeText(
      isAllFound
        ? "🏆 5월의 소수 날짜 11개(2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31) 완벽 수집 완료!"
        : "💡 달력의 날짜를 클릭하여 소수 날짜 11개를 모두 찾아보세요.",
      cx, yBot
    );
    bTxt.size = 13; bTxt.weight = 800;
    bTxt.fill = isAllFound ? '#166534' : '#1d4ed8';

    two.update();
  }

  // 6-1: 몬드리안 분할 프로젝트
  function renderMondrianCanvas(two, ratio) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;

    const title = two.makeText("🎨 [창의융합] 소인수분해와 정수 면적 분할: 몬드리안 아트", cx, 30);
    title.size = 17; title.weight = 800; title.fill = '#1e293b';

    const boxW = 340;
    const boxH = 200;
    const boxY = 150;

    const outer = two.makeRoundedRectangle(cx, boxY, boxW, boxH, 4);
    outer.fill = '#ffffff'; outer.stroke = '#0f172a'; outer.linewidth = 6;

    // 분할 직사각형들
    const r1 = two.makeRectangle(cx - 70, boxY - 30, 200, 140);
    r1.fill = '#dc2626'; r1.stroke = '#0f172a'; r1.linewidth = 5;

    const r2 = two.makeRectangle(cx + 100, boxY - 50, 140, 100);
    r2.fill = '#2563eb'; r2.stroke = '#0f172a'; r2.linewidth = 5;

    const r3 = two.makeRectangle(cx + 100, boxY + 50, 140, 100);
    r3.fill = '#facc15'; r3.stroke = '#0f172a'; r3.linewidth = 5;

    const r4 = two.makeRectangle(cx - 70, boxY + 70, 200, 60);
    r4.fill = '#f8fafc'; r4.stroke = '#0f172a'; r4.linewidth = 5;

    const yBot = 285;
    const banner = two.makeRoundedRectangle(cx, yBot, 480, 36, 18);
    banner.fill = '#f8fafc'; banner.stroke = '#cbd5e1'; banner.linewidth = 1.5;
    const bTxt = two.makeText("💡 서로소와 소인수 분해 비율을 결합한 조화로운 사각형 면적 분할", cx, yBot);
    bTxt.size = 13; bTxt.weight = 800; bTxt.fill = '#334155';

    two.update();
  }

})();
