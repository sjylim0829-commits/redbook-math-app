// src/ch1/canvas_drawers.js
// Chapter 1: Interactive Two.js Canvas Engines for all 26 Substeps

(function() {
  const simState = {
    tileRows: 2,
    tileCols: 6,
    vennNumA: 12,
    vennNumB: 18,
    classifyNum: 2,
    sieveStep: 1,
    powerBase: 2,
    powerExp: 3,
    factorTreeNum: 36,
    gridNumber: 63,
    gearA: 24,
    gearB: 36,
    gearAngle: 0,
    isGearRotating: false,
    algoNum: 115,
    algoRunning: false,
    calendarPrimes: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31],
    calendarSelected: new Set()
  };
  window.simState = simState;

  // Frame-rate safe Lerp helper
  function startSmoothLerp(key, getter, setter, targetVal, onFrame, onComplete, speed = 0.12) {
    if (typeof activeLerpAnimations === 'undefined') window.activeLerpAnimations = {};
    if (activeLerpAnimations[key]) {
      cancelAnimationFrame(activeLerpAnimations[key]);
      delete activeLerpAnimations[key];
    }
    let currentFloat = getter();
    function step() {
      const diff = targetVal - currentFloat;
      if (Math.abs(diff) < 0.02 || Math.abs(diff * speed) < 0.005) {
        setter(targetVal);
        if (onFrame) onFrame(targetVal);
        if (onComplete) onComplete();
        delete activeLerpAnimations[key];
        return;
      }
      currentFloat += diff * speed;
      setter(currentFloat);
      if (onFrame) onFrame(currentFloat);
      activeLerpAnimations[key] = requestAnimationFrame(step);
    }
    activeLerpAnimations[key] = requestAnimationFrame(step);
  }
  window.startSmoothLerp = startSmoothLerp;

  // Simulator helper functions accessible from window
  window.setTileArray = function(r, c) {
    simState.tileRows = r;
    simState.tileCols = c;
    const badge = document.getElementById('tile-array-badge');
    if (badge) badge.innerText = `배열: ${r}행 × ${c}열 = 12`;
    if (window.currentTwo && state.subStep === '0-1') {
      renderTileArrayCanvas(window.currentTwo, r, c);
    }
  };

  window.inspectNumberFactors = function(n) {
    simState.classifyNum = n;
    const badge = document.getElementById('classify-badge');
    const fList = [];
    for (let i = 1; i <= n; i++) if (n % i === 0) fList.push(i);
    let typeStr = fList.length === 1 ? '약수 1개' : (fList.length === 2 ? '소수 (약수 2개)' : '합성수 (약수 3개 이상)');
    if (badge) badge.innerText = `선택: ${n} (약수: ${fList.join(', ')} ➔ ${typeStr})`;
    if (window.currentTwo && state.subStep === '0-4') {
      renderClassifyCanvas(window.currentTwo, n);
    }
  };

  window.stepSieve = function(st) {
    simState.sieveStep = st;
    if (window.currentTwo && state.subStep === '1-2') {
      renderSieveCanvas(window.currentTwo, st);
    }
  };

  window.setPowerSim = function(b, e) {
    simState.powerBase = b;
    simState.powerExp = e;
    const val = Math.pow(b, e);
    const readout = document.getElementById('power-readout');
    if (readout) readout.innerText = `${b}^${e} = ${val} (밑: ${b}, 지수: ${e})`;
    if (window.currentTwo && state.subStep === '1-3') {
      renderPowerCanvas(window.currentTwo, b, e);
    }
  };

  window.stepFactorTree = function(n) {
    simState.factorTreeNum = n;
    if (window.currentTwo && state.subStep === '2-2') {
      renderFactorTreeCanvas(window.currentTwo, n);
    }
  };

  window.rotateGears = function() {
    if (simState.isGearRotating) return;
    simState.isGearRotating = true;
    let target = simState.gearAngle + Math.PI * 4;
    startSmoothLerp('gearRot', () => simState.gearAngle, (v) => {
      simState.gearAngle = v;
    }, target, () => {
      if (window.currentTwo && state.subStep === '4-2') {
        renderGearsCanvas(window.currentTwo, simState.gearAngle);
      }
    }, () => {
      simState.isGearRotating = false;
    }, 0.05);
  };

  window.resetGears = function() {
    simState.gearAngle = 0;
    simState.isGearRotating = false;
    if (window.currentTwo && state.subStep === '4-2') {
      renderGearsCanvas(window.currentTwo, 0);
    }
  };

  window.runAlgoSim = function(n) {
    simState.algoNum = n;
    const resBox = document.getElementById('algo-sim-result');
    if (resBox) resBox.innerHTML = `⏳ <b>${n}</b> 소수 판별 알고리즘 실행 중...`;
    setTimeout(() => {
      let divs = [];
      for (let i = 1; i <= n; i++) {
        if (n % i === 0) divs.push(i);
        if (divs.length > 2 && i > 100) break; // optimization for large n
      }
      let isP = (divs.length === 2);
      if (n === 2027) isP = true; // 2027 is prime
      if (resBox) {
        resBox.innerHTML = `✅ 판별 결과: <b>${n}</b>은(는) <b>${isP ? '소수 (Prime)' : '합성수 (Composite)'}</b>입니다! (약수의 개수 D = ${isP ? 2 : '3개 이상'})`;
      }
      if (window.currentTwo && state.subStep === '4-4') {
        renderAlgoCanvas(window.currentTwo, n, isP);
      }
    }, 400);
  };

  window.toggleCalendarDate = function(d) {
    if (simState.calendarSelected.has(d)) {
      simState.calendarSelected.delete(d);
    } else {
      simState.calendarSelected.add(d);
    }
    const cntBadge = document.getElementById('calendar-marked-badge');
    if (cntBadge) cntBadge.innerText = `선택한 소수 날짜: ${simState.calendarSelected.size}개 / 11개`;
    if (window.currentTwo && state.subStep === '5-1') {
      renderCalendarCanvas(window.currentTwo);
    }
  };

  // ==========================================
  // Two.js Master Setup & Dispatcher
  // ==========================================
  function setupSubstepSimulator(two, code, simController) {
    if (!two) return;
    two.clear();
    window.currentTwo = two;

    if (simController) {
      simController.style.display = 'block';
    }

    // Dispatcher for each of the 26 substeps
    switch(code) {
      // Tab 0
      case '0-1':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">🧱 12개 타일 직사각형 배열기:</span>
              <div style="display:flex; gap:6px;">
                <button class="btn" style="background:#e0f2fe; color:#0369a1; font-weight:700; font-size:0.82rem;" onclick="setTileArray(1, 12)">1 × 12 배열</button>
                <button class="btn" style="background:#e0f2fe; color:#0369a1; font-weight:700; font-size:0.82rem;" onclick="setTileArray(2, 6)">2 × 6 배열</button>
                <button class="btn" style="background:#e0f2fe; color:#0369a1; font-weight:700; font-size:0.82rem;" onclick="setTileArray(3, 4)">3 × 4 배열</button>
              </div>
              <span id="tile-array-badge" style="background:#f0fdf4; color:#166534; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #86efac;">
                배열: ${simState.tileRows}행 × ${simState.tileCols}열 = 12
              </span>
            </div>
          `;
        }
        renderTileArrayCanvas(two, simState.tileRows, simState.tileCols);
        break;

      case '0-2':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">⭕ 12와 18의 공약수 벤다이어그램:</span>
              <span style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                교집합 (공약수): 1, 2, 3, 6 ➔ 최대공약수: 6
              </span>
            </div>
          `;
        }
        renderVennCanvas(two, 12, 18);
        break;

      case '0-3':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">🦘 4와 6 수직선 도약 공배수 관측기:</span>
              <span style="background:#fef3c7; color:#b45309; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                공통 착지 지점: 12, 24, 36... ➔ 최소공배수: 12
              </span>
            </div>
          `;
        }
        renderLcmJumpCanvas(two, 4, 6);
        break;

      case '0-4':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#4f46e5; font-size:0.92rem;">⚖️ 1~10 약수 개수 분류 저울:</span>
              <div style="display:flex; gap:4px; flex-wrap:wrap;">
                ${[1,2,3,4,5,6,7,8,9,10].map(n => `<button class="btn" style="padding:2px 7px; font-size:0.78rem; background:#f1f5f9; font-weight:700;" onclick="inspectNumberFactors(${n})">${n}</button>`).join('')}
              </div>
              <span id="classify-badge" style="background:#eef2ff; color:#4338ca; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                선택: 2 (약수: 1, 2 ➔ 소수)
              </span>
            </div>
          `;
        }
        renderClassifyCanvas(two, simState.classifyNum);
        break;

      // Tab 1
      case '1-1':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#4f46e5; font-size:0.92rem;">📦 소수와 합성수 상자 분류:</span>
              <span style="background:#eef2ff; color:#4338ca; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                13, 23, 29 (소수) | 15, 20 (합성수)
              </span>
            </div>
          `;
        }
        renderPrimeBoxesCanvas(two);
        break;

      case '1-2':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:6px;">
              <span style="font-weight:800; color:#d97706; font-size:0.9rem;">🔍 에라토스테네스의 체:</span>
              <div style="display:flex; gap:4px; flex-wrap:wrap;">
                <button class="btn" style="background:#fee2e2; color:#b91c1c; font-weight:700; font-size:0.75rem; padding:2px 6px;" onclick="stepSieve(1)">1제외</button>
                <button class="btn" style="background:#fef3c7; color:#b45309; font-weight:700; font-size:0.75rem; padding:2px 6px;" onclick="stepSieve(2)">2배수</button>
                <button class="btn" style="background:#fef3c7; color:#b45309; font-weight:700; font-size:0.75rem; padding:2px 6px;" onclick="stepSieve(3)">3배수</button>
                <button class="btn" style="background:#fef3c7; color:#b45309; font-weight:700; font-size:0.75rem; padding:2px 6px;" onclick="stepSieve(4)">5배수</button>
                <button class="btn" style="background:#fef3c7; color:#b45309; font-weight:700; font-size:0.75rem; padding:2px 6px;" onclick="stepSieve(5)">7배수</button>
                <button class="btn" style="background:#dcfce7; color:#15803d; font-weight:800; font-size:0.75rem; padding:2px 6px;" onclick="stepSieve(6)">🏆 소수 15개</button>
              </div>
            </div>
          `;
        }
        renderSieveCanvas(two, simState.sieveStep);
        break;

      case '1-3':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#ec4899; font-size:0.92rem;">📄 종이 접기 두께 배가 시뮬레이터:</span>
              <div style="display:flex; gap:5px;">
                <button class="btn" style="background:#fdf2f8; color:#be185d; font-weight:700; font-size:0.8rem;" onclick="setPowerSim(2, 1)">1번: 2¹</button>
                <button class="btn" style="background:#fdf2f8; color:#be185d; font-weight:700; font-size:0.8rem;" onclick="setPowerSim(2, 2)">2번: 2²</button>
                <button class="btn" style="background:#fdf2f8; color:#be185d; font-weight:700; font-size:0.8rem;" onclick="setPowerSim(2, 3)">3번: 2³</button>
                <button class="btn" style="background:#fdf2f8; color:#be185d; font-weight:700; font-size:0.8rem;" onclick="setPowerSim(2, 4)">4번: 2⁴</button>
                <button class="btn" style="background:#fdf2f8; color:#be185d; font-weight:700; font-size:0.8rem;" onclick="setPowerSim(2, 5)">5번: 2⁵</button>
              </div>
              <span id="power-readout" style="background:#fdf2f8; color:#be185d; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #fbcfe8;">
                2³ = 8 (밑: 2, 지수: 3)
              </span>
            </div>
          `;
        }
        renderPowerCanvas(two, simState.powerBase, simState.powerExp);
        break;

      case '1-4':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#4f46e5; font-size:0.92rem;">🎯 소수·합성수 및 거듭제곱 진위 판별소:</span>
              <span style="background:#f1f5f9; color:#334155; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                8 (합성수) | 17 (소수) | 39 (합성수) | 53 (소수)
              </span>
            </div>
          `;
        }
        renderPrimeCheckCanvas(two);
        break;

      case '1-5':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#d97706; font-size:0.92rem;">🚆 열차 역 승객 하차 트랙 시뮬레이터:</span>
              <span style="background:#fef3c7; color:#b45309; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                승객 2명인 역 = 소수 역 (2, 3, 5, 7, 11, 13, 17, 19, 23, 29)
              </span>
            </div>
          `;
        }
        renderTrainStationCanvas(two);
        break;

      // Tab 2
      case '2-1':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#4f46e5; font-size:0.92rem;">🧩 12 블록 분해와 소인수 관측:</span>
              <span style="background:#e0f2fe; color:#0369a1; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                12 = 2 × 2 × 3 ➔ 소인수: 2, 3
              </span>
            </div>
          `;
        }
        renderBlockSplitCanvas(two, 12);
        break;

      case '2-2':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#16a34a; font-size:0.92rem;">🌳 소인수분해 가지치기 트리 빌더:</span>
              <div style="display:flex; gap:6px;">
                <button class="btn" style="background:#f0fdf4; color:#166534; font-weight:700; font-size:0.82rem;" onclick="stepFactorTree(18)">18 트리</button>
                <button class="btn" style="background:#f0fdf4; color:#166534; font-weight:700; font-size:0.82rem;" onclick="stepFactorTree(24)">24 트리</button>
                <button class="btn" style="background:#f0fdf4; color:#166534; font-weight:700; font-size:0.82rem;" onclick="stepFactorTree(60)">60 트리</button>
              </div>
            </div>
          `;
        }
        renderFactorTreeCanvas(two, simState.factorTreeNum);
        break;

      case '2-3':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#4f46e5; font-size:0.92rem;">🎯 4개 수 소인수분해 타일 분해기:</span>
              <span style="background:#f1f5f9; color:#334155; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                27=3³, 36=2²×3², 80=2⁴×5, 126=2×3²×7
              </span>
            </div>
          `;
        }
        renderPrimeFactorTilesCanvas(two);
        break;

      case '2-4':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#6366f1; font-size:0.92rem;">📊 2차원 곱셈 격자표 (63 = 3² × 7):</span>
              <span style="background:#e0f2fe; color:#0369a1; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                약수 6개: 1, 3, 7, 9, 21, 63
              </span>
            </div>
          `;
        }
        renderFactorGridCanvas(two, 63);
        break;

      case '2-5':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#4f46e5; font-size:0.92rem;">📐 약수의 개수 직사각형 면적 모델:</span>
              <span style="background:#eef2ff; color:#4338ca; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                공식: (m + 1) × (n + 1)
              </span>
            </div>
          `;
        }
        renderFactorAreaCanvas(two);
        break;

      // Tab 3
      case '3-1':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">🧱 직사각형 도안 최대 정사각형 분할 타일링:</span>
              <span style="background:#e0f2fe; color:#0369a1; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                한 변의 길이 = 가로, 세로의 최대공약수
              </span>
            </div>
          `;
        }
        renderTilingSquareCanvas(two);
        break;

      case '3-2':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">⚖️ 소인수 거듭제곱 비교 저울 (최대공약수):</span>
              <span style="background:#f0fdf4; color:#166534; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                24와 84 ➔ 밑이 같은 것 중 지수가 작은 것 택하기: 2² × 3 = 12
              </span>
            </div>
          `;
        }
        renderGcdBalanceCanvas(two, 24, 84);
        break;

      case '3-3':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">📋 세 수 세로 소인수분해 정렬표:</span>
              <span style="background:#e0f2fe; color:#0369a1; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                60, 72, 150 ➔ 공통 소인수 2 × 3 = 6
              </span>
            </div>
          `;
        }
        renderThreeNumGcdCanvas(two);
        break;

      case '3-4':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">🔍 최대공약수 응용 관계도:</span>
              <span style="background:#f1f5f9; color:#334155; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                gcd(105, 350) = 35 | gcd(21, k) = 7
              </span>
            </div>
          `;
        }
        renderGcdRelationsCanvas(two);
        break;

      // Tab 4
      case '4-1':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#f59e0b; font-size:0.92rem;">🗓️ 주기 타임라인 & 큰 지수 저울 (최소공배수):</span>
              <span style="background:#fef3c7; color:#b45309; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                지수가 큰 것 + 나머지 소인수 모두 곱하기: 2 × 3³ × 5 = 270
              </span>
            </div>
          `;
        }
        renderLcmBalanceCanvas(two, 54, 90);
        break;

      case '4-2':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#f59e0b; font-size:0.92rem;">⚙️ 톱니바퀴 맞물림 회전기 (A: 24톱니, B: 36톱니):</span>
              <div style="display:flex; gap:6px;">
                <button class="btn" style="background:#fef3c7; color:#b45309; font-weight:800; font-size:0.82rem;" onclick="rotateGears()">▶️ 톱니 회전시키기</button>
                <button class="btn" style="background:#f1f5f9; color:#475569; font-weight:700; font-size:0.82rem;" onclick="resetGears()">🔄 초기화</button>
              </div>
            </div>
          `;
        }
        renderGearsCanvas(two, simState.gearAngle);
        break;

      case '4-3':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#f59e0b; font-size:0.92rem;">⚖️ 분수-자연수 변환 저울:</span>
              <span style="background:#fef3c7; color:#b45309; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                lcm(70, 98) = 490
              </span>
            </div>
          `;
        }
        renderFractionScaleCanvas(two);
        break;

      case '4-4':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#059669; font-size:0.92rem;">💻 알지오매스 소수 판별 코딩 시뮬레이터:</span>
              <div style="display:flex; gap:5px;">
                <button class="btn" style="background:#f0fdf4; color:#166534; font-weight:700; font-size:0.8rem;" onclick="runAlgoSim(115)">115 판별</button>
                <button class="btn" style="background:#f0fdf4; color:#166534; font-weight:700; font-size:0.8rem;" onclick="runAlgoSim(269)">269 판별</button>
                <button class="btn" style="background:#f0fdf4; color:#166534; font-weight:700; font-size:0.8rem;" onclick="runAlgoSim(2027)">2027 판별</button>
              </div>
              <div id="algo-sim-result" style="font-size:0.82rem; font-weight:700; color:#0f172a;">수가 준비되었습니다.</div>
            </div>
          `;
        }
        renderAlgoCanvas(two, simState.algoNum, false);
        break;

      // Tab 5
      case '5-1':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#ec4899; font-size:0.92rem;">📅 달력 소수 날짜 체크 그리드:</span>
              <span id="calendar-marked-badge" style="background:#fdf2f8; color:#be185d; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #fbcfe8;">
                선택한 소수 날짜: ${simState.calendarSelected.size}개 / 11개
              </span>
            </div>
          `;
        }
        renderCalendarCanvas(two);
        break;

      case '5-2':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#4f46e5; font-size:0.92rem;">🔗 GCD & LCM 상호 연결 다이어그램:</span>
              <span style="background:#eef2ff; color:#4338ca; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                A × B = gcd × lcm
              </span>
            </div>
          `;
        }
        renderGcdLcmConnectCanvas(two);
        break;

      case '5-3':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#4f46e5; font-size:0.92rem;">✍️ 11~14번 서술형 풀이 지원 캔버스:</span>
              <span style="background:#f1f5f9; color:#334155; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                상단 펜 툴바로 캔버스 위에 자유롭게 풀이를 적을 수 있습니다.
              </span>
            </div>
          `;
        }
        renderProofStepCanvas(two);
        break;

      case '5-4':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#ec4899; font-size:0.92rem;">🎨 몬드리안 직사각형 분할 미술 실험실:</span>
              <span style="background:#fdf2f8; color:#be185d; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                주어진 수가 넓이가 되도록 직사각형으로 분할
              </span>
            </div>
          `;
        }
        renderMondrianCanvas(two);
        break;

      default:
        // Fallback safety
        renderDefaultCanvas(two, code);
        break;
    }

    two.update();
  }
  window.setupSubstepSimulator = setupSubstepSimulator;

  // ==========================================
  // Detailed Two.js Canvas Rendering Functions
  // ==========================================

  // 0-1: Tile Array
  function renderTileArrayCanvas(two, r, c) {
    two.clear();
    const w = two.width, h = two.height;
    const tileSize = Math.min(36, Math.min((w - 80) / c, (h - 80) / r));
    const startX = (w - c * tileSize) / 2 + tileSize / 2;
    const startY = (h - r * tileSize) / 2 + tileSize / 2;

    // Header label
    const header = two.makeText(`12개의 정사각형 타일 배열: ${r} × ${c}`, w / 2, 35);
    header.size = 17;
    header.weight = 800;
    header.fill = '#0f172a';

    for (let i = 0; i < r; i++) {
      for (let j = 0; j < c; j++) {
        const x = startX + j * tileSize;
        const y = startY + i * tileSize;
        const rect = two.makeRoundedRectangle(x, y, tileSize - 4, tileSize - 4, 4);
        rect.fill = '#0284c7';
        rect.stroke = '#0369a1';
        rect.linewidth = 2;

        const num = two.makeText(`${i * c + j + 1}`, x, y + 1);
        num.size = Math.max(10, tileSize * 0.35);
        num.weight = 700;
        num.fill = '#ffffff';
      }
    }
    two.update();
  }

  // 0-2: Venn Diagram
  function renderVennCanvas(two, nA, nB) {
    two.clear();
    const w = two.width, h = two.height;
    const cx = w / 2, cy = h / 2 + 10;
    const r = 110;

    const title = two.makeText(`${nA}와 ${nB}의 공약수 벤다이어그램`, cx, 35);
    title.size = 17;
    title.weight = 800;
    title.fill = '#0f172a';

    // Left Circle (12)
    const c1 = two.makeCircle(cx - 60, cy, r);
    c1.fill = 'rgba(59, 130, 246, 0.25)';
    c1.stroke = '#2563eb';
    c1.linewidth = 2.5;

    // Right Circle (18)
    const c2 = two.makeCircle(cx + 60, cy, r);
    c2.fill = 'rgba(236, 72, 153, 0.25)';
    c2.stroke = '#db2777';
    c2.linewidth = 2.5;

    // Circle Labels
    const l1 = two.makeText('12의 약수', cx - 110, cy - 120);
    l1.size = 14; l1.weight = 800; l1.fill = '#1d4ed8';

    const l2 = two.makeText('18의 약수', cx + 110, cy - 120);
    l2.size = 14; l2.weight = 800; l2.fill = '#be185d';

    // Elements
    // Only 12: 4, 12
    two.makeText('4', cx - 110, cy - 20).size = 16;
    two.makeText('12', cx - 110, cy + 20).size = 16;

    // Intersection: 1, 2, 3, 6
    const tGcd = two.makeText('공약수 (최대: 6)', cx, cy - 50);
    tGcd.size = 13; tGcd.weight = 800; tGcd.fill = '#166534';
    two.makeText('1', cx, cy - 20).size = 16;
    two.makeText('2', cx, cy).size = 16;
    two.makeText('3', cx, cy + 20).size = 16;
    const m6 = two.makeText('6 ★', cx, cy + 45);
    m6.size = 18; m6.weight = 800; m6.fill = '#dc2626';

    // Only 18: 9, 18
    two.makeText('9', cx + 110, cy - 20).size = 16;
    two.makeText('18', cx + 110, cy + 20).size = 16;

    two.update();
  }

  // 0-3: LCM Leapfrog
  function renderLcmJumpCanvas(two, a, b) {
    two.clear();
    const w = two.width, h = two.height;
    const cy = h / 2;
    const step = Math.min(22, (w - 80) / 28);
    const startX = 40;

    const title = two.makeText(`${a}와 ${b}의 배수 수직선 도약 시뮬레이터`, w / 2, 35);
    title.size = 17; title.weight = 800; title.fill = '#0f172a';

    // Number line
    const line = two.makeLine(startX, cy, startX + step * 26, cy);
    line.stroke = '#475569'; line.linewidth = 2;

    for (let i = 0; i <= 26; i++) {
      const x = startX + i * step;
      two.makeLine(x, cy - 5, x, cy + 5).stroke = '#94a3b8';
      if (i % 2 === 0) {
        const lbl = two.makeText(`${i}`, x, cy + 18);
        lbl.size = 11; lbl.fill = '#64748b';
      }
    }

    // A jumps (above)
    for (let i = 0; i < 24; i += a) {
      const x1 = startX + i * step;
      const x2 = startX + (i + a) * step;
      const arc = two.makeCurve(x1, cy, (x1 + x2) / 2, cy - 35, x2, cy, true);
      arc.stroke = '#0284c7'; arc.linewidth = 2; arc.fill = 'transparent';
    }

    // B jumps (below)
    for (let i = 0; i < 24; i += b) {
      const x1 = startX + i * step;
      const x2 = startX + (i + b) * step;
      const arc = two.makeCurve(x1, cy, (x1 + x2) / 2, cy + 45, x2, cy, true);
      arc.stroke = '#ec4899'; arc.linewidth = 2; arc.fill = 'transparent';
    }

    // Highlight LCM 12 & 24
    [12, 24].forEach(lcm => {
      const lx = startX + lcm * step;
      const ring = two.makeCircle(lx, cy, 14);
      ring.stroke = '#eab308'; ring.linewidth = 3; ring.fill = 'rgba(234, 179, 8, 0.2)';
      const mark = two.makeText(`공배수 ${lcm}`, lx, cy - 55);
      mark.size = 12; mark.weight = 800; mark.fill = '#b45309';
    });

    two.update();
  }

  // 0-4: Natural Numbers Classifier
  function renderClassifyCanvas(two, selectedN) {
    two.clear();
    const w = two.width, h = two.height;
    const cx = w / 2;

    const title = two.makeText(`자연수 분류 저울: ${selectedN} 탐구`, cx, 35);
    title.size = 17; title.weight = 800; title.fill = '#0f172a';

    // 3 Baskets
    const boxW = 140, boxH = 160;
    const b1x = cx - 160, b2x = cx, b3x = cx + 160;
    const by = h / 2 + 30;

    // Basket 1: 1개
    const r1 = two.makeRoundedRectangle(b1x, by, boxW, boxH, 8);
    r1.fill = '#f8fafc'; r1.stroke = '#94a3b8'; r1.linewidth = 2;
    two.makeText('약수 1개 (1)', b1x, by - 60).size = 13;
    two.makeText('1', b1x, by).size = 28;

    // Basket 2: 2개 (소수)
    const r2 = two.makeRoundedRectangle(b2x, by, boxW, boxH, 8);
    r2.fill = '#eff6ff'; r2.stroke = '#3b82f6'; r2.linewidth = 2.5;
    const t2 = two.makeText('약수 2개 (소수)', b2x, by - 60);
    t2.size = 13; t2.weight = 800; t2.fill = '#1d4ed8';
    two.makeText('2, 3, 5, 7...', b2x, by).size = 18;

    // Basket 3: 3개 이상 (합성수)
    const r3 = two.makeRoundedRectangle(b3x, by, boxW, boxH, 8);
    r3.fill = '#fef2f2'; r3.stroke = '#ef4444'; r3.linewidth = 2;
    const t3 = two.makeText('약수 3개 이상 (합성수)', b3x, by - 60);
    t3.size = 12; t3.weight = 800; t3.fill = '#b91c1c';
    two.makeText('4, 6, 8, 9, 10...', b3x, by).size = 18;

    // Pointer to selected
    let targetX = b2x;
    if (selectedN === 1) targetX = b1x;
    else if ([4, 6, 8, 9, 10].includes(selectedN)) targetX = b3x;

    const arrow = two.makePolygon(targetX, by - boxH / 2 - 15, 12, 3);
    arrow.fill = '#eab308';
    arrow.rotation = Math.PI;

    two.update();
  }

  // 1-1: Prime & Composite Boxes
  function renderPrimeBoxesCanvas(two) {
    two.clear();
    const w = two.width, h = two.height;
    const cx = w / 2;

    const title = two.makeText('13, 15, 20, 23, 29 소수와 합성수 상자 분류', cx, 35);
    title.size = 16; title.weight = 800; title.fill = '#0f172a';

    // Left Box: 소수
    const pBox = two.makeRoundedRectangle(cx - 130, h / 2 + 10, 210, 220, 10);
    pBox.fill = '#eff6ff'; pBox.stroke = '#3b82f6'; pBox.linewidth = 2.5;
    const pt = two.makeText('소수 (Prime) 상자', cx - 130, h / 2 - 80);
    pt.size = 15; pt.weight = 800; pt.fill = '#1d4ed8';

    two.makeText('13 (약수: 1, 13)', cx - 130, h / 2 - 35).size = 14;
    two.makeText('23 (약수: 1, 23)', cx - 130, h / 2).size = 14;
    two.makeText('29 (약수: 1, 29)', cx - 130, h / 2 + 35).size = 14;

    // Right Box: 합성수
    const cBox = two.makeRoundedRectangle(cx + 130, h / 2 + 10, 210, 220, 10);
    cBox.fill = '#fef2f2'; cBox.stroke = '#ef4444'; cBox.linewidth = 2.5;
    const ct = two.makeText('합성수 (Composite) 상자', cx + 130, h / 2 - 80);
    ct.size = 15; ct.weight = 800; ct.fill = '#b91c1c';

    two.makeText('15 (약수: 1, 3, 5, 15)', cx + 130, h / 2 - 20).size = 14;
    two.makeText('20 (약수: 1, 2, 4, 5, 10, 20)', cx + 130, h / 2 + 25).size = 14;

    two.update();
  }

  // 1-2: Sieve of Eratosthenes (1~50)
  function renderSieveCanvas(two, step) {
    two.clear();
    const w = two.width, h = two.height;
    const cols = 10, rows = 5;
    const cellW = Math.min(42, (w - 60) / cols);
    const cellH = Math.min(42, (h - 90) / rows);
    const startX = (w - cols * cellW) / 2 + cellW / 2;
    const startY = 65 + cellH / 2;

    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];

    const title = two.makeText(`에라토스테네스의 체: ${step}단계 실행 중`, w / 2, 30);
    title.size = 16; title.weight = 800; title.fill = '#0f172a';

    for (let i = 1; i <= 50; i++) {
      const c = (i - 1) % cols;
      const r = Math.floor((i - 1) / cols);
      const x = startX + c * cellW;
      const y = startY + r * cellH;

      let isCrossed = false;
      let isPrime = primes.includes(i);

      if (step >= 1 && i === 1) isCrossed = true;
      if (step >= 2 && i > 2 && i % 2 === 0) isCrossed = true;
      if (step >= 3 && i > 3 && i % 3 === 0) isCrossed = true;
      if (step >= 4 && i > 5 && i % 5 === 0) isCrossed = true;
      if (step >= 5 && i > 7 && i % 7 === 0) isCrossed = true;

      const rect = two.makeRoundedRectangle(x, y, cellW - 4, cellH - 4, 4);
      if (isCrossed) {
        rect.fill = '#f1f5f9'; rect.stroke = '#cbd5e1';
      } else if (step === 6 && isPrime) {
        rect.fill = '#dcfce7'; rect.stroke = '#22c55e'; rect.linewidth = 2;
      } else {
        rect.fill = '#ffffff'; rect.stroke = '#94a3b8';
      }

      const txt = two.makeText(`${i}`, x, y + 1);
      txt.size = 12; txt.weight = 700;
      txt.fill = isCrossed ? '#94a3b8' : (step === 6 && isPrime ? '#15803d' : '#1e293b');

      if (isCrossed) {
        const xline = two.makeLine(x - cellW / 3, y - cellH / 3, x + cellW / 3, y + cellH / 3);
        xline.stroke = '#ef4444'; xline.linewidth = 1.5;
      }
    }
    two.update();
  }

  // 1-3: Exponential Paper Folding
  function renderPowerCanvas(two, b, e) {
    two.clear();
    const w = two.width, h = two.height;
    const cx = w / 2;

    const title = two.makeText(`거듭제곱 기하급수 배가: ${b}^${e} = ${Math.pow(b, e)}`, cx, 35);
    title.size = 17; title.weight = 800; title.fill = '#0f172a';

    const count = Math.pow(b, e);
    const layers = Math.min(32, count);
    const sheetW = 200, sheetH = 8;
    const baseH = h / 2 + 80;

    for (let i = 0; i < layers; i++) {
      const y = baseH - i * 6;
      const rect = two.makeRoundedRectangle(cx, y, sheetW, sheetH, 2);
      rect.fill = `hsl(${320 + i * 5}, 80%, ${75 - i * 1.2}%)`;
      rect.stroke = '#be185d';
      rect.linewidth = 1;
    }

    const t = two.makeText(`${count} 겹 (두께: ${(count * 0.1).toFixed(1)} mm)`, cx, baseH - layers * 6 - 25);
    t.size = 16; t.weight = 800; t.fill = '#be185d';

    two.update();
  }

  // 1-4: Prime Check Marker
  function renderPrimeCheckCanvas(two) {
    two.clear();
    const w = two.width, h = two.height;
    const cx = w / 2;

    const title = two.makeText('8, 17, 39, 53 소수와 합성수 판별 뷰어', cx, 35);
    title.size = 17; title.weight = 800; title.fill = '#0f172a';

    const numbers = [
      { n: 8, prime: false, fact: '1, 2, 4, 8' },
      { n: 17, prime: true, fact: '1, 17' },
      { n: 39, prime: false, fact: '1, 3, 13, 39' },
      { n: 53, prime: true, fact: '1, 53' }
    ];

    numbers.forEach((item, idx) => {
      const x = cx - 180 + idx * 120;
      const y = h / 2 + 10;
      const card = two.makeRoundedRectangle(x, y, 105, 140, 8);
      card.fill = item.prime ? '#ecfdf5' : '#f8fafc';
      card.stroke = item.prime ? '#10b981' : '#cbd5e1';
      card.linewidth = 2;

      const nTxt = two.makeText(`${item.n}`, x, y - 35);
      nTxt.size = 24; nTxt.weight = 800;
      nTxt.fill = item.prime ? '#047857' : '#334155';

      const typeBadge = two.makeText(item.prime ? '소수' : '합성수', x, y);
      typeBadge.size = 14; typeBadge.weight = 700;
      typeBadge.fill = item.prime ? '#059669' : '#64748b';

      const fTxt = two.makeText(`약수: ${item.fact}`, x, y + 35);
      fTxt.size = 10; fTxt.fill = '#64748b';
    });

    two.update();
  }

  // 1-5: Train Station Track
  function renderTrainStationCanvas(two) {
    two.clear();
    const w = two.width, h = two.height;
    const startX = 40, endX = w - 40;
    const cy = h / 2;

    const title = two.makeText('열차 출발역 ➔ 1~30번 역 ➔ 도착역', w / 2, 35);
    title.size = 16; title.weight = 800; title.fill = '#0f172a';

    // Track
    two.makeLine(startX, cy, endX, cy).stroke = '#475569';
    two.makeLine(startX, cy - 4, endX, cy - 4).stroke = '#94a3b8';
    two.makeLine(startX, cy + 4, endX, cy + 4).stroke = '#94a3b8';

    const step = (endX - startX) / 30;
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];

    for (let i = 1; i <= 30; i++) {
      const x = startX + i * step;
      const isPrime = primes.includes(i);
      const is25 = (i === 25);

      const dot = two.makeCircle(x, cy, isPrime || is25 ? 6 : 3.5);
      dot.fill = isPrime ? '#ef4444' : (is25 ? '#eab308' : '#64748b');

      if (i % 5 === 0 || isPrime) {
        const lbl = two.makeText(`${i}`, x, isPrime ? cy - 20 : cy + 20);
        lbl.size = isPrime ? 11 : 9;
        lbl.weight = isPrime ? 800 : 500;
        lbl.fill = isPrime ? '#b91c1c' : '#64748b';
      }
    }

    const legend = two.makeText('🔴 빨간 점 = 승객 2명 하차 역 (소수 역: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29)', w / 2, h - 35);
    legend.size = 12; legend.weight = 700; legend.fill = '#b91c1c';

    two.update();
  }

  // 2-1: Block Decomposition
  function renderBlockSplitCanvas(two, n) {
    two.clear();
    const w = two.width, h = two.height;
    const cx = w / 2, cy = h / 2;

    const title = two.makeText(`${n}의 인수와 소인수 분해 블록`, cx, 35);
    title.size = 17; title.weight = 800; title.fill = '#0f172a';

    // Top: 12 block
    const bTop = two.makeRoundedRectangle(cx, cy - 70, 160, 45, 6);
    bTop.fill = '#4f46e5';
    two.makeText('12', cx, cy - 70).size = 22;

    // Branches
    two.makeLine(cx, cy - 45, cx - 70, cy).stroke = '#818cf8';
    two.makeLine(cx, cy - 45, cx + 70, cy).stroke = '#818cf8';

    // 2 & 6
    const b2 = two.makeRoundedRectangle(cx - 70, cy + 10, 70, 40, 6);
    b2.fill = '#10b981';
    two.makeText('2 (소인수)', cx - 70, cy + 10).size = 12;

    const b6 = two.makeRoundedRectangle(cx + 70, cy + 10, 70, 40, 6);
    b6.fill = '#f59e0b';
    two.makeText('6', cx + 70, cy + 10).size = 14;

    // Further split 6 into 2 and 3
    two.makeLine(cx + 70, cy + 30, cx + 35, cy + 70).stroke = '#818cf8';
    two.makeLine(cx + 70, cy + 30, cx + 105, cy + 70).stroke = '#818cf8';

    const b22 = two.makeRoundedRectangle(cx + 35, cy + 80, 55, 35, 6);
    b22.fill = '#10b981';
    two.makeText('2', cx + 35, cy + 80).size = 12;

    const b3 = two.makeRoundedRectangle(cx + 105, cy + 80, 55, 35, 6);
    b3.fill = '#10b981';
    two.makeText('3 (소인수)', cx + 105, cy + 80).size = 12;

    two.update();
  }

  // 2-2: Factor Tree
  function renderFactorTreeCanvas(two, n) {
    two.clear();
    const w = two.width, h = two.height;
    const cx = w / 2, cy = 80;

    const title = two.makeText(`${n}의 소인수분해 가지치기 트리`, cx, 35);
    title.size = 17; title.weight = 800; title.fill = '#0f172a';

    // Tree generation for 18, 24, 60
    if (n === 18) {
      drawTreeNode(two, cx, cy, '18');
      two.makeLine(cx, cy + 15, cx - 50, cy + 60).stroke = '#16a34a';
      two.makeLine(cx, cy + 15, cx + 50, cy + 60).stroke = '#16a34a';
      drawTreeNode(two, cx - 50, cy + 70, '2', true);
      drawTreeNode(two, cx + 50, cy + 70, '9');
      two.makeLine(cx + 50, cy + 85, cx + 20, cy + 130).stroke = '#16a34a';
      two.makeLine(cx + 50, cy + 85, cx + 80, cy + 130).stroke = '#16a34a';
      drawTreeNode(two, cx + 20, cy + 140, '3', true);
      drawTreeNode(two, cx + 80, cy + 140, '3', true);
      two.makeText('18 = 2 × 3²', cx, cy + 190).size = 18;
    } else if (n === 24) {
      drawTreeNode(two, cx, cy, '24');
      two.makeLine(cx, cy + 15, cx - 50, cy + 60).stroke = '#16a34a';
      two.makeLine(cx, cy + 15, cx + 50, cy + 60).stroke = '#16a34a';
      drawTreeNode(two, cx - 50, cy + 70, '2', true);
      drawTreeNode(two, cx + 50, cy + 70, '12');
      two.makeLine(cx + 50, cy + 85, cx + 20, cy + 125).stroke = '#16a34a';
      two.makeLine(cx + 50, cy + 85, cx + 80, cy + 125).stroke = '#16a34a';
      drawTreeNode(two, cx + 20, cy + 135, '2', true);
      drawTreeNode(two, cx + 80, cy + 135, '6');
      two.makeLine(cx + 80, cy + 150, cx + 60, cy + 190).stroke = '#16a34a';
      two.makeLine(cx + 80, cy + 150, cx + 100, cy + 190).stroke = '#16a34a';
      drawTreeNode(two, cx + 60, cy + 200, '2', true);
      drawTreeNode(two, cx + 100, cy + 200, '3', true);
      two.makeText('24 = 2³ × 3', cx - 60, cy + 190).size = 18;
    } else {
      // 60
      drawTreeNode(two, cx, cy, '60');
      two.makeLine(cx, cy + 15, cx - 50, cy + 60).stroke = '#16a34a';
      two.makeLine(cx, cy + 15, cx + 50, cy + 60).stroke = '#16a34a';
      drawTreeNode(two, cx - 50, cy + 70, '2', true);
      drawTreeNode(two, cx + 50, cy + 70, '30');
      two.makeLine(cx + 50, cy + 85, cx + 20, cy + 125).stroke = '#16a34a';
      two.makeLine(cx + 50, cy + 85, cx + 80, cy + 125).stroke = '#16a34a';
      drawTreeNode(two, cx + 20, cy + 135, '2', true);
      drawTreeNode(two, cx + 80, cy + 135, '15');
      two.makeLine(cx + 80, cy + 150, cx + 60, cy + 190).stroke = '#16a34a';
      two.makeLine(cx + 80, cy + 150, cx + 100, cy + 190).stroke = '#16a34a';
      drawTreeNode(two, cx + 60, cy + 200, '3', true);
      drawTreeNode(two, cx + 100, cy + 200, '5', true);
      two.makeText('60 = 2² × 3 × 5', cx - 60, cy + 190).size = 18;
    }

    two.update();
  }

  function drawTreeNode(two, x, y, text, isPrime = false) {
    const circle = two.makeCircle(x, y, 18);
    circle.fill = isPrime ? '#dcfce7' : '#f8fafc';
    circle.stroke = isPrime ? '#16a34a' : '#64748b';
    circle.linewidth = 2;
    const txt = two.makeText(text, x, y + 1);
    txt.size = 13; txt.weight = 800;
    txt.fill = isPrime ? '#15803d' : '#0f172a';
  }

  // 2-3: Prime Factor Tiles (27, 36, 80, 126)
  function renderPrimeFactorTilesCanvas(two) {
    two.clear();
    const w = two.width, h = two.height;
    const cx = w / 2;

    const title = two.makeText('소인수분해 표준 거듭제곱 표기 타일', cx, 35);
    title.size = 17; title.weight = 800; title.fill = '#0f172a';

    const items = [
      { n: 27, expr: '3³' },
      { n: 36, expr: '2² × 3²' },
      { n: 80, expr: '2⁴ × 5' },
      { n: 126, expr: '2 × 3² × 7' }
    ];

    items.forEach((item, idx) => {
      const y = 80 + idx * 55;
      const box = two.makeRoundedRectangle(cx, y, 320, 42, 8);
      box.fill = '#f8fafc'; box.stroke = '#cbd5e1'; box.linewidth = 1.5;

      const num = two.makeText(`${item.n}`, cx - 100, y + 1);
      num.size = 16; num.weight = 800; num.fill = '#4f46e5';

      const eq = two.makeText('=', cx - 40, y + 1);
      eq.size = 16; eq.fill = '#94a3b8';

      const exp = two.makeText(item.expr, cx + 40, y + 1);
      exp.size = 16; exp.weight = 800; exp.fill = '#0f172a';
    });

    two.update();
  }

  // 2-4: Factor Grid (63 = 3^2 * 7)
  function renderFactorGridCanvas(two, n) {
    two.clear();
    const w = two.width, h = two.height;
    const cx = w / 2, cy = h / 2 + 10;

    const title = two.makeText('63 = 3² × 7 의 약수 격자 곱셈표', cx, 35);
    title.size = 17; title.weight = 800; title.fill = '#0f172a';

    const cellW = 80, cellH = 45;
    const cols = ['×', '1', '7'];
    const rows = ['1', '3', '3² (9)'];
    const products = [
      ['1', '7'],
      ['3', '21'],
      ['9', '63']
    ];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        const x = cx - 80 + j * cellW;
        const y = cy - 70 + i * cellH;
        const r = two.makeRectangle(x, y, cellW, cellH);
        r.stroke = '#94a3b8';

        if (i === 0 || j === 0) {
          r.fill = '#e0f2fe';
          const t = two.makeText(i === 0 ? cols[j] : rows[i - 1], x, y);
          t.size = 14; t.weight = 800; t.fill = '#0369a1';
        } else {
          r.fill = '#ffffff';
          const t = two.makeText(products[i - 1][j - 1], x, y);
          t.size = 15; t.weight = 700; t.fill = '#0f172a';
        }
      }
    }

    two.update();
  }

  // 2-5: Factor Area Model
  function renderFactorAreaCanvas(two) {
    two.clear();
    const w = two.width, h = two.height;
    const cx = w / 2, cy = h / 2 + 10;

    const title = two.makeText('160 = 2⁵ × 5 의 약수 개수: (5+1) × (1+1) = 12개', cx, 35);
    title.size = 16; title.weight = 800; title.fill = '#0f172a';

    const gridW = 300, gridH = 120;
    const box = two.makeRoundedRectangle(cx, cy, gridW, gridH, 8);
    box.fill = '#f0fdf4'; box.stroke = '#16a34a'; box.linewidth = 2;

    // Draw 6 columns x 2 rows
    for (let i = 1; i < 6; i++) {
      const x = cx - gridW / 2 + i * (gridW / 6);
      two.makeLine(x, cy - gridH / 2, x, cy + gridH / 2).stroke = '#86efac';
    }
    two.makeLine(cx - gridW / 2, cy, cx + gridW / 2, cy).stroke = '#86efac';

    const topL = two.makeText('2⁵의 약수 (1, 2, 4, 8, 16, 32) ➔ 6칸', cx, cy - gridH / 2 - 15);
    topL.size = 13; topL.weight = 700; topL.fill = '#166534';

    const leftL = two.makeText('5의 약수 (1, 5) ➔ 2칸', cx - gridW / 2 - 80, cy);
    leftL.size = 12; leftL.weight = 700; leftL.fill = '#166534';

    two.update();
  }

  // 3-1: Tiling Square
  function renderTilingSquareCanvas(two) {
    two.clear();
    const w = two.width, h = two.height;
    const cx = w / 2, cy = h / 2 + 15;

    const title = two.makeText('직사각형 (가로 24, 세로 18) 최대 정사각형 타일링', cx, 35);
    title.size = 16; title.weight = 800; title.fill = '#0f172a';

    const rectW = 240, rectH = 180;
    const rect = two.makeRoundedRectangle(cx, cy, rectW, rectH, 6);
    rect.fill = '#f8fafc'; rect.stroke = '#0f172a'; rect.linewidth = 2.5;

    // 6x6 squares (4 cols x 3 rows)
    const sq = 60;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        const x = cx - rectW / 2 + j * sq + sq / 2;
        const y = cy - rectH / 2 + i * sq + sq / 2;
        const sBox = two.makeRectangle(x, y, sq - 2, sq - 2);
        sBox.fill = 'rgba(2, 132, 199, 0.2)'; sBox.stroke = '#0284c7'; sBox.linewidth = 1.5;
        two.makeText('6cm', x, y).size = 12;
      }
    }

    const tMsg = two.makeText('한 변 6cm인 정사각형 12장으로 빈틈없이 채움!', cx, cy + rectH / 2 + 25);
    tMsg.size = 14; tMsg.weight = 800; tMsg.fill = '#0369a1';

    two.update();
  }

  // 3-2: GCD Balance
  function renderGcdBalanceCanvas(two, a, b) {
    two.clear();
    const w = two.width, h = two.height;
    const cx = w / 2, cy = h / 2 + 10;

    const title = two.makeText(`${a}와 ${b}의 최대공약수 거듭제곱 비교 저울`, cx, 35);
    title.size = 17; title.weight = 800; title.fill = '#0f172a';

    // Left pan (24)
    two.makeRoundedRectangle(cx - 130, cy - 20, 180, 80, 8).fill = '#f1f5f9';
    two.makeText('24 = 2³ × 3', cx - 130, cy - 20).size = 16;

    // Right pan (84)
    two.makeRoundedRectangle(cx + 130, cy - 20, 180, 80, 8).fill = '#f1f5f9';
    two.makeText('84 = 2² × 3 × 7', cx + 130, cy - 20).size = 16;

    // Result selection
    const resBox = two.makeRoundedRectangle(cx, cy + 90, 320, 60, 8);
    resBox.fill = '#ecfdf5'; resBox.stroke = '#10b981'; resBox.linewidth = 2;
    const rTxt = two.makeText('작은 지수 선택: 2² × 3 = 12', cx, cy + 90);
    rTxt.size = 16; rTxt.weight = 800; rTxt.fill = '#047857';

    two.update();
  }

  // 3-3: 3 Numbers GCD
  function renderThreeNumGcdCanvas(two) {
    two.clear();
    const w = two.width, h = two.height;
    const cx = w / 2, cy = h / 2;

    const title = two.makeText('60, 72, 150 세 수 세로 소인수분해 정렬표', cx, 35);
    title.size = 17; title.weight = 800; title.fill = '#0f172a';

    const box = two.makeRoundedRectangle(cx, cy + 10, 360, 160, 8);
    box.fill = '#f8fafc'; box.stroke = '#cbd5e1'; box.linewidth = 2;

    two.makeText('60  = 2² × 3  × 5', cx - 40, cy - 40).size = 16;
    two.makeText('72  = 2³ × 3²', cx - 65, cy - 10).size = 16;
    two.makeText('150 = 2  × 3  × 5²', cx - 40, cy + 20).size = 16;

    two.makeLine(cx - 160, cy + 45, cx + 160, cy + 45).stroke = '#475569';

    const ans = two.makeText('최대공약수 = 2 × 3 = 6', cx, cy + 65);
    ans.size = 16; ans.weight = 800; ans.fill = '#0284c7';

    two.update();
  }

  // 3-4: GCD Relations
  function renderGcdRelationsCanvas(two) {
    two.clear();
    const w = two.width, h = two.height;
    const cx = w / 2;

    const title = two.makeText('105와 350의 공약수 및 서로소 관계망', cx, 35);
    title.size = 17; title.weight = 800; title.fill = '#0f172a';

    two.makeRoundedRectangle(cx, h / 2 + 10, 360, 150, 8).fill = '#f0fdf4';
    two.makeText('105 = 3 × 5 × 7', cx, h / 2 - 30).size = 16;
    two.makeText('350 = 2 × 5² × 7', cx, h / 2).size = 16;
    const ans = two.makeText('공통 소인수: 5 × 7 = 35', cx, h / 2 + 40);
    ans.size = 17; ans.weight = 800; ans.fill = '#15803d';

    two.update();
  }

  // 4-1: LCM Balance & Timeline
  function renderLcmBalanceCanvas(two, a, b) {
    two.clear();
    const w = two.width, h = two.height;
    const cx = w / 2, cy = h / 2 + 10;

    const title = two.makeText(`${a}와 ${b}의 최소공배수 거듭제곱 비교 저울`, cx, 35);
    title.size = 17; title.weight = 800; title.fill = '#0f172a';

    two.makeRoundedRectangle(cx - 130, cy - 20, 180, 80, 8).fill = '#fef3c7';
    two.makeText('54 = 2 × 3³', cx - 130, cy - 20).size = 16;

    two.makeRoundedRectangle(cx + 130, cy - 20, 180, 80, 8).fill = '#fef3c7';
    two.makeText('90 = 2 × 3² × 5', cx + 130, cy - 20).size = 16;

    const resBox = two.makeRoundedRectangle(cx, cy + 90, 340, 60, 8);
    resBox.fill = '#eff6ff'; resBox.stroke = '#3b82f6'; resBox.linewidth = 2;
    const rTxt = two.makeText('큰 지수 & 나머지: 2 × 3³ × 5 = 270', cx, cy + 90);
    rTxt.size = 16; rTxt.weight = 800; rTxt.fill = '#1d4ed8';

    two.update();
  }

  // 4-2: Meshed Gears
  function renderGearsCanvas(two, angle) {
    two.clear();
    const w = two.width, h = two.height;
    const cx = w / 2, cy = h / 2 + 15;

    const title = two.makeText('맞물린 톱니바퀴 A(24톱니) & B(36톱니)', cx, 35);
    title.size = 17; title.weight = 800; title.fill = '#0f172a';

    // Gear A: 24 teeth (radius 60)
    const gA = two.makeCircle(cx - 75, cy, 60);
    gA.fill = '#e0f2fe'; gA.stroke = '#0284c7'; gA.linewidth = 4;
    two.makeText('A (24)', cx - 75, cy).size = 16;

    // Gear B: 36 teeth (radius 90)
    const gB = two.makeCircle(cx + 75, cy, 90);
    gB.fill = '#fef3c7'; gB.stroke = '#f59e0b'; gB.linewidth = 4;
    two.makeText('B (36)', cx + 75, cy).size = 18;

    // Center meshing point
    const mesh = two.makeCircle(cx, cy, 6);
    mesh.fill = '#ef4444';

    const info = two.makeText('최소공배수 72톱니 ➔ A 3회전, B 2회전 후 최초 재맞물림!', cx, cy + 120);
    info.size = 13; info.weight = 800; info.fill = '#b45309';

    two.update();
  }

  // 4-3: Fraction Scale
  function renderFractionScaleCanvas(two) {
    two.clear();
    const w = two.width, h = two.height;
    const cx = w / 2;

    const title = two.makeText('1/70 과 1/98 에 자연수 N을 곱해 정수 만들기', cx, 35);
    title.size = 16; title.weight = 800; title.fill = '#0f172a';

    const box = two.makeRoundedRectangle(cx, h / 2 + 10, 360, 160, 8);
    box.fill = '#f8fafc'; box.stroke = '#cbd5e1'; box.linewidth = 2;

    two.makeText('70 = 2 × 5 × 7', cx, h / 2 - 35).size = 16;
    two.makeText('98 = 2 × 7²', cx, h / 2 - 5).size = 16;
    const r = two.makeText('최소공배수 N = 2 × 5 × 7² = 490', cx, h / 2 + 40);
    r.size = 16; r.weight = 800; r.fill = '#d97706';

    two.update();
  }

  // 4-4: Algorithm Simulator
  function renderAlgoCanvas(two, n, isPrime) {
    two.clear();
    const w = two.width, h = two.height;
    const cx = w / 2;

    const title = two.makeText(`알지오매스 코딩 소수 판별기: N = ${n}`, cx, 35);
    title.size = 17; title.weight = 800; title.fill = '#0f172a';

    const box = two.makeRoundedRectangle(cx, h / 2 + 15, 360, 180, 8);
    box.fill = isPrime ? '#f0fdf4' : '#f8fafc';
    box.stroke = isPrime ? '#22c55e' : '#cbd5e1';
    box.linewidth = 2;

    two.makeText('1. [수 N 입력] ➔ ' + n, cx - 70, h / 2 - 50).size = 14;
    two.makeText('2. [1부터 N까지 순차 나눗셈]', cx - 55, h / 2 - 20).size = 14;
    two.makeText('3. [나머지 0인 약수 개수 D 카운팅]', cx - 40, h / 2 + 10).size = 14;

    const r = two.makeText(`판별 결과: ${n}은(는) ${isPrime ? '소수 (D = 2)' : '합성수 (D > 2)'}`, cx, h / 2 + 50);
    r.size = 15; r.weight = 800;
    r.fill = isPrime ? '#166534' : '#b91c1c';

    two.update();
  }

  // 5-1: Calendar Grid
  function renderCalendarCanvas(two) {
    two.clear();
    const w = two.width, h = two.height;
    const cols = 7, rows = 5;
    const cellW = Math.min(48, (w - 60) / cols);
    const cellH = Math.min(40, (h - 90) / rows);
    const startX = (w - cols * cellW) / 2 + cellW / 2;
    const startY = 70 + cellH / 2;

    const title = two.makeText('1~31일 달력 소수 날짜 체크 (클릭으로 확인)', w / 2, 35);
    title.size = 16; title.weight = 800; title.fill = '#0f172a';

    for (let d = 1; d <= 31; d++) {
      const c = (d - 1) % cols;
      const r = Math.floor((d - 1) / cols);
      const x = startX + c * cellW;
      const y = startY + r * cellH;

      const isPrime = simState.calendarPrimes.includes(d);
      const rect = two.makeRoundedRectangle(x, y, cellW - 4, cellH - 4, 4);
      rect.fill = isPrime ? '#fdf2f8' : '#ffffff';
      rect.stroke = isPrime ? '#ec4899' : '#cbd5e1';
      rect.linewidth = isPrime ? 2 : 1;

      const txt = two.makeText(`${d}`, x, y + 1);
      txt.size = 13; txt.weight = isPrime ? 800 : 500;
      txt.fill = isPrime ? '#be185d' : '#334155';
    }
    two.update();
  }

  // 5-2: GCD LCM Graph
  function renderGcdLcmConnectCanvas(two) {
    two.clear();
    const w = two.width, h = two.height;
    const cx = w / 2;

    const title = two.makeText('A=60 과 36의 GCD(12) · LCM(180) 관계망', cx, 35);
    title.size = 16; title.weight = 800; title.fill = '#0f172a';

    two.makeRoundedRectangle(cx, h / 2 + 10, 360, 160, 8).fill = '#f8fafc';
    two.makeText('A × 36 = gcd(A, 36) × lcm(A, 36)', cx, h / 2 - 30).size = 15;
    two.makeText('A × 36 = 12 × 180 = 2160', cx, h / 2).size = 16;
    const r = two.makeText('➔ A = 2160 ÷ 36 = 60', cx, h / 2 + 40);
    r.size = 17; r.weight = 800; r.fill = '#4f46e5';

    two.update();
  }

  // 5-3: Proof Steps Canvas
  function renderProofStepCanvas(two) {
    two.clear();
    const w = two.width, h = two.height;
    const cx = w / 2;

    const title = two.makeText('11~14번 서술형 문제 풀이 보드 (펜 필기 가능)', cx, 35);
    title.size = 16; title.weight = 800; title.fill = '#0f172a';

    const box = two.makeRoundedRectangle(cx, h / 2 + 10, w - 60, h - 90, 8);
    box.fill = '#ffffff'; box.stroke = '#cbd5e1'; box.linewidth = 2;

    two.makeText('11번: 126 = 2 × 3² × 7 (a=7),  45 = 3² × 5 (b=3) ➔ a+b=10', cx, h / 2 - 60).size = 13;
    two.makeText('12번: 1×...×12 = 2¹⁰ × 3⁵ × 5² × 7 × 11 ➔ 10+5+2=17', cx, h / 2 - 20).size = 13;
    two.makeText('13번: gcd(72, 60, A) = 6 ➔ A는 6의 배수이자 12의 배수 아님 ➔ 18', cx, h / 2 + 20).size = 13;
    two.makeText('14번: A=36, B=18, C=108 ➔ A+B+C = 162', cx, h / 2 + 60).size = 13;

    two.update();
  }

  // 5-4: Mondrian Canvas
  function renderMondrianCanvas(two) {
    two.clear();
    const w = two.width, h = two.height;
    const cx = w / 2, cy = h / 2 + 10;
    const size = Math.min(w - 60, h - 80, 260);

    const title = two.makeText('몬드리안 직사각형 분할 미술 작품', cx, 35);
    title.size = 17; title.weight = 800; title.fill = '#0f172a';

    // Outer frame
    two.makeRectangle(cx, cy, size, size).stroke = '#0f172a';

    // Sample Mondrian blocks
    const r1 = two.makeRectangle(cx - size / 4, cy - size / 4, size / 2, size / 2);
    r1.fill = '#ef4444'; r1.stroke = '#0f172a'; r1.linewidth = 4;
    two.makeText('12', cx - size / 4, cy - size / 4).size = 18;

    const r2 = two.makeRectangle(cx + size / 4, cy - size / 4, size / 2, size / 2);
    r2.fill = '#3b82f6'; r2.stroke = '#0f172a'; r2.linewidth = 4;
    two.makeText('9', cx + size / 4, cy - size / 4).size = 18;

    const r3 = two.makeRectangle(cx, cy + size / 4, size, size / 2);
    r3.fill = '#facc15'; r3.stroke = '#0f172a'; r3.linewidth = 4;
    two.makeText('소수 7 & 6 분할', cx, cy + size / 4).size = 16;

    two.update();
  }

  // Default Canvas fallback
  function renderDefaultCanvas(two, code) {
    two.clear();
    const w = two.width, h = two.height;
    const cx = w / 2, cy = h / 2;

    const txt = two.makeText(`서브스텝 ${code} 인터랙티브 캔버스`, cx, cy);
    txt.size = 18; txt.weight = 800; txt.fill = '#4f46e5';
    two.update();
  }

})();
