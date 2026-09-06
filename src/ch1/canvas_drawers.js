// src/ch1/canvas_drawers.js
// Chapter 1: Interactive Two.js Canvas Engines for all 57 Substeps
// 규칙 10 & 11 완전 준수 (소단원 확인하기 1문항 1페이지 및 마무리하기 전용 탭 14문항 1페이지)
// Type A (핵심 인터랙티브 캔버스 15종) & Type B (정갈한 시각 지원 + 자유 펜 풀이 캔버스 42종)
// 태블릿 가독성 대폭 향상 (최소 폰트 14px, 핵심 수치 18~22px) 및 Zero Answer Leakage 철저 준수

(function() {
  const simState = {
    // 0-1
    tileRows: 2,
    tileCols: 6,
    foundTileFactors: new Set(['2x6']),
    isDraggingHandle: false,

    // 0-2
    vennCards: [
      { id: 1, num: 1, target: 'both', currentArea: 'tray' },
      { id: 2, num: 2, target: 'both', currentArea: 'tray' },
      { id: 3, num: 3, target: 'both', currentArea: 'tray' },
      { id: 4, num: 4, target: 'onlyA', currentArea: 'tray' },
      { id: 6, num: 6, target: 'both', currentArea: 'tray' },
      { id: 9, num: 9, target: 'onlyB', currentArea: 'tray' },
      { id: 12, num: 12, target: 'onlyA', currentArea: 'tray' },
      { id: 18, num: 18, target: 'onlyB', currentArea: 'tray' }
    ],
    activeVennDragIndex: -1,
    vennDragPos: { x: 0, y: 0 },
    vennHintMsg: '',
    vennNumA: 12,
    vennNumB: 18,

    // 0-3
    jumpPosA: 0,
    jumpPosB: 0,
    isDraggingJumperA: false,
    isDraggingJumperB: false,
    foundCommonMultiples: new Set(),

    // 0-4
    classifyNum: 2,
    classifyCounts: { one: 0, prime: 0, comp: 0 },

    // 1-1
    primeTileN: 6,

    // 1-2
    sieveStep: 1,

    // 1-7
    bacteriaMinutes: 30,

    // 1-9
    trainStation: 6,

    // 2-2
    factorTreeNum: 36,
    factorTreeStep: 2,

    // 2-3
    vertDivNum: 80,
    vertDivStep: 2,

    // 2-9
    gridNumber: 63,
    factorGridCells: new Set(),

    // 3-2
    gcdExpA: 2,
    gcdExpB: 1,

    // 4-2
    gearA: 24,
    gearB: 36,
    gearAngle: 0,
    isGearRotating: false,

    // 4-10
    algoNum: 115,
    algoRunning: false,
    algoResult: '',

    // 5-1
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

  // ==========================================
  // 0-1 Interactive Tile Array Helpers
  // ==========================================
  window.changeTileDim = function(deltaR, deltaC) {
    const newR = Math.max(1, Math.min(12, simState.tileRows + deltaR));
    const newC = Math.max(1, Math.min(12, simState.tileCols + deltaC));
    window.setTileArray(newR, newC);
  };

  window.setTileArray = function(r, c) {
    simState.tileRows = r;
    simState.tileCols = c;
    if (r * c === 12) {
      simState.foundTileFactors.add(`${r}x${c}`);
    }
    updateTileControllerUI();
    if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '0-1') {
      renderTileArrayCanvas(window.currentTwo, r, c);
    }
  };

  function updateTileControllerUI() {
    const badge = document.getElementById('tile-array-badge');
    const r = simState.tileRows;
    const c = simState.tileCols;
    const total = r * c;
    const isMatched = (total === 12);
    if (badge) {
      badge.innerHTML = `현재: <b>${r}행 × ${c}열 = ${total}칸</b> ${isMatched ? '🎉 (12개 완성!)' : (total < 12 ? `(⚠️ ${12 - total}개 부족)` : `(⚠️ ${total - 12}개 초과)`)}`;
      badge.style.background = isMatched ? '#f0fdf4' : (total < 12 ? '#fffbeb' : '#fef2f2');
      badge.style.color = isMatched ? '#166534' : (total < 12 ? '#b45309' : '#b91c1c');
      badge.style.border = isMatched ? '1px solid #86efac' : (total < 12 ? '1px solid #fde68a' : '1px solid #fca5a5');
    }
  }

  function setupTileArrayInteractiveEvents(two, container) {
    if (!container) return;
    container.style.touchAction = 'none';

    function getLayout() {
      const cx = two.width / 2;
      const cy = two.height / 2 + 18;
      const r = simState.tileRows;
      const c = simState.tileCols;
      const maxDim = Math.max(r, c, 6);
      const size = Math.max(22, Math.min(36, Math.floor(250 / maxDim)));
      const startX = cx - (c * size) / 2;
      const startY = cy - (r * size) / 2;
      const handleX = startX + c * size;
      const handleY = startY + r * size;
      return { cx, cy, r, c, size, startX, startY, handleX, handleY };
    }

    container.onpointerdown = (e) => {
      if (typeof state === 'undefined' || state.subStep !== '0-1') return;
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const layout = getLayout();
      const distHandle = Math.hypot(mx - layout.handleX, my - layout.handleY);
      const nearRight = Math.abs(mx - layout.handleX) < 28 && my >= layout.startY - 10 && my <= layout.handleY + 28;
      const nearBottom = Math.abs(my - layout.handleY) < 28 && mx >= layout.startX - 10 && mx <= layout.handleX + 28;

      if (distHandle < 34 || nearRight || nearBottom) {
        simState.isDraggingHandle = true;
        try { container.setPointerCapture(e.pointerId); } catch(err){}
        container.style.cursor = 'nwse-resize';
        handlePointerMove(mx, my);
      }
    };

    container.onpointermove = (e) => {
      if (typeof state === 'undefined' || state.subStep !== '0-1') return;
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      if (simState.isDraggingHandle) {
        handlePointerMove(mx, my);
      } else {
        const layout = getLayout();
        const distHandle = Math.hypot(mx - layout.handleX, my - layout.handleY);
        const nearRight = Math.abs(mx - layout.handleX) < 28 && my >= layout.startY - 10 && my <= layout.handleY + 28;
        const nearBottom = Math.abs(my - layout.handleY) < 28 && mx >= layout.startX - 10 && mx <= layout.handleX + 28;
        container.style.cursor = (distHandle < 34 || nearRight || nearBottom) ? 'nwse-resize' : 'default';
      }
    };

    container.onpointerup = container.onpointercancel = (e) => {
      if (simState.isDraggingHandle) {
        simState.isDraggingHandle = false;
        container.style.cursor = 'default';
        try { container.releasePointerCapture(e.pointerId); } catch(err){}
        renderTileArrayCanvas(two, simState.tileRows, simState.tileCols);
      }
    };

    function handlePointerMove(mx, my) {
      const layout = getLayout();
      let newCols = Math.round((mx - layout.startX) / layout.size);
      let newRows = Math.round((my - layout.startY) / layout.size);

      newCols = Math.max(1, Math.min(12, newCols));
      newRows = Math.max(1, Math.min(12, newRows));

      if (newCols !== simState.tileCols || newRows !== simState.tileRows) {
        simState.tileCols = newCols;
        simState.tileRows = newRows;

        if (newRows * newCols === 12) {
          const key = `${newRows}x${newCols}`;
          if (!simState.foundTileFactors.has(key)) {
            simState.foundTileFactors.add(key);
            if (typeof playSound === 'function') playSound('chime');
          }
        }
        updateTileControllerUI();
        renderTileArrayCanvas(two, simState.tileRows, simState.tileCols);
      }
    }
  }

  // ==========================================
  // 0-2 Interactive Venn Diagram Helpers
  // ==========================================
  window.resetVennCards = function() {
    simState.vennCards.forEach(c => c.currentArea = 'tray');
    simState.vennHintMsg = '';
    updateVennProgressBadge();
    if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '0-2') {
      renderVennCanvas(window.currentTwo, 12, 18);
    }
  };

  window.autoPlaceVennCards = function() {
    simState.vennCards.forEach(c => c.currentArea = c.target);
    simState.vennHintMsg = '';
    updateVennProgressBadge();
    if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '0-2') {
      renderVennCanvas(window.currentTwo, 12, 18);
    }
  };

  function updateVennProgressBadge() {
    const badge = document.getElementById('venn-progress-badge');
    const placedCount = simState.vennCards.filter(c => c.currentArea === c.target).length;
    if (badge) {
      const isAllPlaced = (placedCount === 8);
      badge.innerHTML = isAllPlaced
        ? `배치 진행: <b>8 / 8개 완료! 👑 최대공약수 발견</b>`
        : `배치 진행: <b>${placedCount} / 8개 완료</b>`;
      badge.style.background = isAllPlaced ? '#f0fdf4' : '#eff6ff';
      badge.style.color = isAllPlaced ? '#166534' : '#1d4ed8';
      badge.style.border = isAllPlaced ? '1px solid #86efac' : '1px solid #bfdbfe';
    }
  }

  function setupVennInteractiveEvents(two, container) {
    if (!container) return;
    container.style.touchAction = 'none';

    function getVennGeometry() {
      const cx = two.width / 2;
      const cy = two.height / 2 - 20;
      const radius = 90;
      const offset = 70;
      const cAx = cx - offset;
      const cAy = cy;
      const cBx = cx + offset;
      const cBy = cy;
      const trayY = cy + 125;
      const spacing = 44;
      const trayStartX = cx - (8 * spacing) / 2 + spacing / 2;
      return { cx, cy, radius, offset, cAx, cAy, cBx, cBy, trayY, spacing, trayStartX };
    }

    function getCardVisualPos(card, index, geom) {
      if (card.currentArea === 'tray') {
        return { x: geom.trayStartX + index * geom.spacing, y: geom.trayY };
      }
      if (card.currentArea === 'onlyA') {
        const aCards = simState.vennCards.filter(c => c.currentArea === 'onlyA');
        const posIdx = aCards.indexOf(card);
        const yOff = (posIdx === 0) ? -28 : 25;
        return { x: geom.cx - 100, y: geom.cy + yOff };
      }
      if (card.currentArea === 'both') {
        const bothCards = simState.vennCards.filter(c => c.currentArea === 'both');
        const posIdx = bothCards.indexOf(card);
        const ySlots = [-45, -15, 15, 45];
        return { x: geom.cx, y: geom.cy + (ySlots[posIdx] || 0) };
      }
      if (card.currentArea === 'onlyB') {
        const bCards = simState.vennCards.filter(c => c.currentArea === 'onlyB');
        const posIdx = bCards.indexOf(card);
        const yOff = (posIdx === 0) ? -28 : 25;
        return { x: geom.cx + 100, y: geom.cy + yOff };
      }
      return { x: geom.cx, y: geom.trayY };
    }

    container.onpointerdown = (e) => {
      if (typeof state === 'undefined' || state.subStep !== '0-2') return;
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const geom = getVennGeometry();
      let clickedIdx = -1;

      for (let i = 0; i < simState.vennCards.length; i++) {
        const card = simState.vennCards[i];
        const pos = getCardVisualPos(card, i, geom);
        if (Math.hypot(mx - pos.x, my - pos.y) < 24) {
          clickedIdx = i;
          break;
        }
      }

      if (clickedIdx >= 0) {
        simState.activeVennDragIndex = clickedIdx;
        simState.vennDragPos = { x: mx, y: my };
        simState.vennHintMsg = '';
        try { container.setPointerCapture(e.pointerId); } catch(err){}
        container.style.cursor = 'grabbing';
        renderVennCanvas(two, 12, 18);
      }
    };

    container.onpointermove = (e) => {
      if (typeof state === 'undefined' || state.subStep !== '0-2') return;
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      if (simState.activeVennDragIndex >= 0) {
        simState.vennDragPos = { x: mx, y: my };
        renderVennCanvas(two, 12, 18);
      } else {
        const geom = getVennGeometry();
        let hovering = false;
        for (let i = 0; i < simState.vennCards.length; i++) {
          const card = simState.vennCards[i];
          const pos = getCardVisualPos(card, i, geom);
          if (Math.hypot(mx - pos.x, my - pos.y) < 24) {
            hovering = true;
            break;
          }
        }
        container.style.cursor = hovering ? 'grab' : 'default';
      }
    };

    container.onpointerup = container.onpointercancel = (e) => {
      if (simState.activeVennDragIndex >= 0) {
        const rect = container.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const geom = getVennGeometry();

        const card = simState.vennCards[simState.activeVennDragIndex];
        const distA = Math.hypot(mx - geom.cAx, my - geom.cAy);
        const distB = Math.hypot(mx - geom.cBx, my - geom.cBy);
        const inA = (distA <= geom.radius);
        const inB = (distB <= geom.radius);

        let dropArea = 'tray';
        if (inA && inB) dropArea = 'both';
        else if (inA && !inB) dropArea = 'onlyA';
        else if (!inA && inB) dropArea = 'onlyB';

        if (dropArea === card.target) {
          card.currentArea = dropArea;
          if (typeof playSound === 'function') playSound('chime');
          simState.vennHintMsg = '';
        } else if (dropArea !== 'tray') {
          if (card.target === 'both') {
            simState.vennHintMsg = `💡 [힌트] ${card.num}은(는) 12와 18의 공통 약수예요! 가운데 교집합 영역에 넣어보세요.`;
          } else if (card.num === 4 || card.num === 12) {
            simState.vennHintMsg = `⚠️ [주의] ${card.num}은(는) 12의 약수이지만 18의 약수는 아니에요.`;
          } else if (card.num === 9 || card.num === 18) {
            simState.vennHintMsg = `⚠️ [주의] ${card.num}은(는) 18의 약수이지만 12의 약수는 아니에요.`;
          }
          card.currentArea = 'tray';
        } else {
          card.currentArea = 'tray';
        }

        simState.activeVennDragIndex = -1;
        container.style.cursor = 'default';
        try { container.releasePointerCapture(e.pointerId); } catch(err){}
        updateVennProgressBadge();
        renderVennCanvas(two, 12, 18);
      }
    };
  }

  // ==========================================
  // 0-3 Interactive Number Line Jump Helpers
  // ==========================================
  window.stepJumperA = function(delta = 4) {
    let next = simState.jumpPosA + delta;
    if (next > 24) next = 0;
    simState.jumpPosA = next;
    checkLcmArrival();
    updateJumpControllerUI();
    if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '0-3') {
      renderLcmJumpCanvas(window.currentTwo, 4, 6);
    }
  };

  window.stepJumperB = function(delta = 6) {
    let next = simState.jumpPosB + delta;
    if (next > 24) next = 0;
    simState.jumpPosB = next;
    checkLcmArrival();
    updateJumpControllerUI();
    if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '0-3') {
      renderLcmJumpCanvas(window.currentTwo, 4, 6);
    }
  };

  window.resetJumpers = function() {
    simState.jumpPosA = 0;
    simState.jumpPosB = 0;
    simState.foundCommonMultiples.clear();
    updateJumpControllerUI();
    if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '0-3') {
      renderLcmJumpCanvas(window.currentTwo, 4, 6);
    }
  };

  window.autoDemoJumps = function() {
    simState.jumpPosA = 12;
    simState.jumpPosB = 12;
    checkLcmArrival();
    updateJumpControllerUI();
    if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '0-3') {
      renderLcmJumpCanvas(window.currentTwo, 4, 6);
    }
  };

  function checkLcmArrival() {
    if (simState.jumpPosA > 0 && simState.jumpPosA === simState.jumpPosB) {
      const match = simState.jumpPosA;
      if (!simState.foundCommonMultiples.has(match)) {
        simState.foundCommonMultiples.add(match);
        if (typeof playSound === 'function') playSound('chime');
      }
    }
  }

  function updateJumpControllerUI() {
    const badge = document.getElementById('jump-progress-badge');
    if (!badge) return;
    const isBothAt12 = (simState.jumpPosA === 12 && simState.jumpPosB === 12);
    const isBothAt24 = (simState.jumpPosA === 24 && simState.jumpPosB === 24);
    const hasCommon = simState.foundCommonMultiples.size > 0;

    if (isBothAt12) {
      badge.innerHTML = `🎉 공통 착지점 <b>12</b> 발견! (첫 공배수 = <b>최소공배수</b>)`;
      badge.style.background = '#f0fdf4';
      badge.style.color = '#166534';
      badge.style.border = '1px solid #86efac';
    } else if (isBothAt24) {
      badge.innerHTML = `🎉 두 번째 공통 착지점 <b>24</b> 발견! (12의 배수)`;
      badge.style.background = '#fefce8';
      badge.style.color = '#854d0e';
      badge.style.border = '1px solid #fde047';
    } else if (hasCommon) {
      const list = Array.from(simState.foundCommonMultiples).sort((a,b)=>a-b).join(', ');
      badge.innerHTML = `발견한 공배수: <b>${list}</b> | 토끼: ${simState.jumpPosA}, 개구리: ${simState.jumpPosB}`;
      badge.style.background = '#eff6ff';
      badge.style.color = '#1d4ed8';
      badge.style.border = '1px solid #bfdbfe';
    } else {
      badge.innerHTML = `도약 진행: 🐰토끼 <b>${simState.jumpPosA}</b> | 🐸개구리 <b>${simState.jumpPosB}</b> (공통 눈금을 찾아보세요)`;
      badge.style.background = '#f8fafc';
      badge.style.color = '#475569';
      badge.style.border = '1px solid #e2e8f0';
    }
  }

  function setupJumpInteractiveEvents(two, container) {
    if (!container) return;
    container.style.touchAction = 'none';

    function getJumpGeometry() {
      const width = two.width, height = two.height;
      const maxVal = 24;
      const padX = 55;
      const stepX = (width - padX * 2) / maxVal;
      const startX = padX;
      const cy = height / 2;
      const jumperAy = cy - 26;
      const jumperBy = cy + 26;
      const jumperAx = startX + simState.jumpPosA * stepX;
      const jumperBx = startX + simState.jumpPosB * stepX;
      return { width, height, maxVal, padX, stepX, startX, cy, jumperAy, jumperBy, jumperAx, jumperBx };
    }

    container.onpointerdown = (e) => {
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const geom = getJumpGeometry();

      const distA = Math.hypot(mx - geom.jumperAx, my - geom.jumperAy);
      const distB = Math.hypot(mx - geom.jumperBx, my - geom.jumperBy);

      if (distA < 28) {
        simState.isDraggingJumperA = true;
        simState.isDraggingJumperB = false;
        container.style.cursor = 'grabbing';
        try { container.setPointerCapture(e.pointerId); } catch(err){}
        e.preventDefault();
      } else if (distB < 28) {
        simState.isDraggingJumperB = true;
        simState.isDraggingJumperA = false;
        container.style.cursor = 'grabbing';
        try { container.setPointerCapture(e.pointerId); } catch(err){}
        e.preventDefault();
      } else {
        if (Math.abs(my - geom.cy) < 45 && mx >= geom.startX - 15 && mx <= geom.width - geom.padX + 15) {
          const v = (mx - geom.startX) / geom.stepX;
          if (my < geom.cy) {
            const snapped = Math.max(0, Math.min(24, Math.round(v / 4) * 4));
            simState.jumpPosA = snapped;
            checkLcmArrival();
            updateJumpControllerUI();
            renderLcmJumpCanvas(two, 4, 6);
          } else {
            const snapped = Math.max(0, Math.min(24, Math.round(v / 6) * 6));
            simState.jumpPosB = snapped;
            checkLcmArrival();
            updateJumpControllerUI();
            renderLcmJumpCanvas(two, 4, 6);
          }
        }
      }
    };

    container.onpointermove = (e) => {
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const geom = getJumpGeometry();

      if (simState.isDraggingJumperA) {
        const raw = (mx - geom.startX) / geom.stepX;
        const snapped = Math.max(0, Math.min(24, Math.round(raw / 4) * 4));
        if (snapped !== simState.jumpPosA) {
          simState.jumpPosA = snapped;
          checkLcmArrival();
          updateJumpControllerUI();
          renderLcmJumpCanvas(two, 4, 6);
        }
      } else if (simState.isDraggingJumperB) {
        const raw = (mx - geom.startX) / geom.stepX;
        const snapped = Math.max(0, Math.min(24, Math.round(raw / 6) * 6));
        if (snapped !== simState.jumpPosB) {
          simState.jumpPosB = snapped;
          checkLcmArrival();
          updateJumpControllerUI();
          renderLcmJumpCanvas(two, 4, 6);
        }
      } else {
        const distA = Math.hypot(mx - geom.jumperAx, my - geom.jumperAy);
        const distB = Math.hypot(mx - geom.jumperBx, my - geom.jumperBy);
        container.style.cursor = (distA < 28 || distB < 28) ? 'grab' : 'default';
      }
    };

    container.onpointerup = container.onpointercancel = (e) => {
      if (simState.isDraggingJumperA || simState.isDraggingJumperB) {
        simState.isDraggingJumperA = false;
        simState.isDraggingJumperB = false;
        container.style.cursor = 'default';
        try { container.releasePointerCapture(e.pointerId); } catch(err){}
        renderLcmJumpCanvas(two, 4, 6);
      }
    };
  }

  // ==========================================
  // Additional Type A Interactive Helpers
  // ==========================================
  window.setClassifyNum = function(n) {
    simState.classifyNum = n;
    if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '0-4') {
      renderClassifyCanvas(window.currentTwo, n);
    }
  };

  window.changePrimeTileN = function(delta) {
    simState.primeTileN = Math.max(2, Math.min(20, simState.primeTileN + delta));
    const badge = document.getElementById('prime-tile-badge');
    if (badge) badge.innerText = `현재 수: ${simState.primeTileN}`;
    if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '1-1') {
      renderPrimeBoxesCanvas(window.currentTwo);
    }
  };

  window.setSieveStep = function(st) {
    simState.sieveStep = st;
    if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '1-2') {
      renderSieveCanvas(window.currentTwo, st);
    }
  };

  window.setBacteriaMinutes = function(m) {
    simState.bacteriaMinutes = m;
    const badge = document.getElementById('bacteria-badge');
    if (badge) badge.innerText = `경과 시간: ${m}분`;
    if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '1-7') {
      renderBacteriaGraphCanvas(window.currentTwo, m);
    }
  };

  window.setTrainStation = function(st) {
    simState.trainStation = Math.max(1, Math.min(30, st));
    const badge = document.getElementById('train-badge');
    if (badge) badge.innerText = `현재 역: ${simState.trainStation}번 역`;
    if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '1-9') {
      renderTrainStationCanvas(window.currentTwo);
    }
  };

  window.setFactorTreeStep = function(st) {
    simState.factorTreeStep = st;
    if (window.currentTwo && typeof state !== 'undefined' && (state.subStep === '2-2' || state.subStep === '5-4')) {
      renderFactorTreeCanvas(window.currentTwo, state.subStep === '5-4' ? 330 : 36);
    }
  };

  window.setVertDivStep = function(st) {
    simState.vertDivStep = st;
    if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '2-3') {
      renderVerticalDivisionCanvas(window.currentTwo, 80);
    }
  };

  window.toggleGearRotation = function() {
    simState.isGearRotating = !simState.isGearRotating;
    const btn = document.getElementById('gear-rot-btn');
    if (btn) {
      btn.innerText = simState.isGearRotating ? '⏹ 회전 정지' : '▶ 톱니 회전 시작';
      btn.style.background = simState.isGearRotating ? '#ef4444' : '#0284c7';
    }
    if (simState.isGearRotating) {
      function anim() {
        if (!simState.isGearRotating) return;
        simState.gearAngle += 0.03;
        if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '4-2') {
          renderGearsCanvas(window.currentTwo, simState.gearAngle);
        }
        requestAnimationFrame(anim);
      }
      requestAnimationFrame(anim);
    }
  };

  window.runCodingAlgo = function() {
    const input = document.getElementById('algo-input-val');
    const val = parseInt(input ? input.value : '115') || 115;
    simState.algoNum = val;
    let isP = true;
    if (val <= 1) isP = false;
    else {
      for (let i = 2; i * i <= val; i++) {
        if (val % i === 0) { isP = false; break; }
      }
    }
    simState.algoResult = isP ? '소수' : '합성수';
    const resBox = document.getElementById('algo-result-box');
    if (resBox) {
      resBox.style.display = 'inline-block';
      resBox.innerHTML = `판별 결과: <b>${val}</b>은(는) <b>${simState.algoResult}</b>입니다!`;
      resBox.style.background = isP ? '#f0fdf4' : '#fef2f2';
      resBox.style.color = isP ? '#166534' : '#991b1b';
    }
    if (window.currentTwo && typeof state !== 'undefined' && state.subStep === '4-10') {
      renderAlgoCanvas(window.currentTwo, val, isP);
    }
  };

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
      // ----------------------------------------
      case '0-1':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <div style="display:flex; align-items:center; gap:6px;">
                <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">🧱 타일 직사각형 조작:</span>
                <span style="font-size:0.85rem; color:#64748b;">(우하단 모서리 ⤢ 드래그 또는 버튼 조절)</span>
              </div>
              <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                <div style="display:inline-flex; border:1px solid #cbd5e1; border-radius:6px; overflow:hidden;">
                  <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#f8fafc; border-right:1px solid #cbd5e1;" onclick="changeTileDim(-1, 0)">세로 -</button>
                  <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#f8fafc;" onclick="changeTileDim(1, 0)">세로 +</button>
                </div>
                <div style="display:inline-flex; border:1px solid #cbd5e1; border-radius:6px; overflow:hidden;">
                  <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#f8fafc; border-right:1px solid #cbd5e1;" onclick="changeTileDim(0, -1)">가로 -</button>
                  <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#f8fafc;" onclick="changeTileDim(0, 1)">가로 +</button>
                </div>
                <div style="display:flex; gap:4px;">
                  <button class="btn" style="padding:4px 8px; background:#e0f2fe; color:#0369a1; font-weight:800; font-size:0.82rem;" onclick="setTileArray(1, 12)">1×12</button>
                  <button class="btn" style="padding:4px 8px; background:#e0f2fe; color:#0369a1; font-weight:800; font-size:0.82rem;" onclick="setTileArray(2, 6)">2×6</button>
                  <button class="btn" style="padding:4px 8px; background:#e0f2fe; color:#0369a1; font-weight:800; font-size:0.82rem;" onclick="setTileArray(3, 4)">3×4</button>
                </div>
              </div>
              <span id="tile-array-badge" style="background:#f0fdf4; color:#166534; font-weight:800; padding:4px 12px; border-radius:12px; font-size:0.85rem; border:1px solid #86efac;">
                현재: 2행 × 6열 = 12칸 🎉 (12개 완성!)
              </span>
            </div>
          `;
        }
        setupTileArrayInteractiveEvents(two, document.getElementById('two-container'));
        renderTileArrayCanvas(two, simState.tileRows, simState.tileCols);
        break;

      case '0-2':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <div style="display:flex; align-items:center; gap:6px;">
                <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">⭕ 공약수 벤다이어그램 탐구:</span>
                <span style="font-size:0.85rem; color:#64748b;">(아래 수 카드를 드래그하여 알맞은 원 안으로 넣어보세요)</span>
              </div>
              <div style="display:flex; align-items:center; gap:6px;">
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#f1f5f9;" onclick="resetVennCards()">🔄 카드 초기화</button>
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#e0f2fe; color:#0369a1; font-weight:800;" onclick="autoPlaceVennCards()">💡 자동 완성</button>
                <span id="venn-progress-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:4px 12px; border-radius:12px; font-size:0.85rem; border:1px solid #bfdbfe;">
                  배치 진행: 0 / 8개 완료
                </span>
              </div>
            </div>
          `;
        }
        setupVennInteractiveEvents(two, document.getElementById('two-container'));
        renderVennCanvas(two, 12, 18);
        break;

      case '0-3':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                <button class="btn" style="padding:4px 11px; font-size:0.85rem; background:#e0f2fe; color:#0369a1; font-weight:800; border:1px solid #7dd3fc;" onclick="stepJumperA(4)">🐰 4 도약 (+4)</button>
                <button class="btn" style="padding:4px 11px; font-size:0.85rem; background:#ffedd5; color:#c2410c; font-weight:800; border:1px solid #fdba74;" onclick="stepJumperB(6)">🐸 6 도약 (+6)</button>
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#f1f5f9; color:#475569;" onclick="resetJumpers()">🔄 초기화</button>
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#fef3c7; color:#b45309; font-weight:800;" onclick="autoDemoJumps()">💡 12 발견 시연</button>
              </div>
              <span id="jump-progress-badge" style="background:#f8fafc; color:#475569; font-weight:800; padding:4px 14px; border-radius:12px; font-size:0.85rem; border:1px solid #e2e8f0;">
                도약 진행: 🐰토끼 0 | 🐸개구리 0 (공통 눈금을 찾아보세요)
              </span>
            </div>
          `;
        }
        setupJumpInteractiveEvents(two, document.getElementById('two-container'));
        renderLcmJumpCanvas(two, 4, 6);
        updateJumpControllerUI();
        break;

      case '0-4':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">⚖️ 자연수의 3분류 저울 (약수 개수 기준):</span>
              <div style="display:flex; gap:4px;">
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#f1f5f9;" onclick="setClassifyNum(1)">1 관찰</button>
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#e0f2fe; color:#0369a1; font-weight:800;" onclick="setClassifyNum(7)">7 (소수)</button>
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#fef2f2; color:#b91c1c; font-weight:800;" onclick="setClassifyNum(12)">12 (합성수)</button>
              </div>
            </div>
          `;
        }
        renderClassifyCanvas(two, simState.classifyNum);
        break;

      // ----------------------------------------
      // Tab 1: 소수와 합성수 (1-1 ~ 1-9)
      // ----------------------------------------
      case '1-1':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">🏷️ 소수 vs 합성수 직사각형 타일 판별기:</span>
              <div style="display:flex; align-items:center; gap:6px;">
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#f1f5f9;" onclick="changePrimeTileN(-1)">수 감소 (-)</button>
                <button class="btn" style="padding:4px 9px; font-size:0.82rem; background:#f1f5f9;" onclick="changePrimeTileN(1)">수 증가 (+)</button>
                <span id="prime-tile-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.85rem;">
                  현재 수: ${simState.primeTileN}
                </span>
              </div>
            </div>
          `;
        }
        renderPrimeBoxesCanvas(two);
        break;

      case '1-2':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">🔬 에라토스테네스의 체 단계별 실행:</span>
              <div style="display:flex; gap:4px; flex-wrap:wrap;">
                <button class="btn" style="background:#f1f5f9; font-weight:700; font-size:0.82rem; padding:4px 8px;" onclick="setSieveStep(1)">1: 1 지우기</button>
                <button class="btn" style="background:#f1f5f9; font-weight:700; font-size:0.82rem; padding:4px 8px;" onclick="setSieveStep(2)">2: 2의 배수</button>
                <button class="btn" style="background:#f1f5f9; font-weight:700; font-size:0.82rem; padding:4px 8px;" onclick="setSieveStep(3)">3: 3의 배수</button>
                <button class="btn" style="background:#f1f5f9; font-weight:700; font-size:0.82rem; padding:4px 8px;" onclick="setSieveStep(4)">4: 5의 배수</button>
                <button class="btn" style="background:#f1f5f9; font-weight:700; font-size:0.82rem; padding:4px 8px;" onclick="setSieveStep(5)">5: 7의 배수</button>
                <button class="btn" style="background:#e0f2fe; color:#0369a1; font-weight:800; font-size:0.82rem; padding:4px 8px;" onclick="setSieveStep(6)">6: 완성</button>
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
              <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">📄 거듭제곱과 밑·지수 구조 시각화:</span>
              <span style="background:#eff6ff; color:#1e40af; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.85rem;">
                밑(Base): 곱하는 수 / 지수(Exponent): 곱한 횟수
              </span>
            </div>
          `;
        }
        renderPowerCanvas(two, 5, 4);
        break;

      case '1-4':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">🔍 1-4 수 카드 판별: 8, 17, 39, 53을 소수와 합성수로 분류</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '1-4 스스로 확인하기 1번',
          title: '소수와 합성수 판별하기',
          given: '수 카드: 8, 17, 39, 53',
          guide: '💡 각 수의 약수를 구하여 약수가 2개면 소수, 3개 이상이면 합성수로 분류하세요.'
        });
        break;

      case '1-5':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">🌿 1-5 거듭제곱 표현 변환 다이어그램</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '1-5 스스로 확인하기 2번',
          title: '거듭제곱 꼴로 표현하기',
          given: '(1) 5×5×5×5  |  (2) 2×3×3×5  |  (3) 3×3×7×7×7×7×7',
          guide: '💡 같은 소인수를 묶어 밑과 지수의 거듭제곱 꼴로 정돈해보세요.'
        });
        break;

      case '1-6':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">⚖️ 1-6 명제 진위 판정 논리 보드 (O/X 추론)</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '1-6 스스로 확인하기 3번',
          title: '소수와 합성수의 성질 진위 판정',
          given: 'ㄱ. 가장 작은 소수는 2이다. / ㄴ. 모든 짝수는 합성수이다. / ㄷ. 소수는 약수가 2개이다.',
          guide: '💡 반례가 존재하는지 확인하며 각 명제의 참(O)과 거짓(X)을 판별하세요.'
        });
        break;

      case '1-7':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">🦠 세균 배가 증식 시뮬레이터 (10분마다 2배):</span>
              <div style="display:flex; align-items:center; gap:6px;">
                <button class="btn" style="padding:4px 8px; font-size:0.82rem; background:#f1f5f9;" onclick="setBacteriaMinutes(10)">10분</button>
                <button class="btn" style="padding:4px 8px; font-size:0.82rem; background:#f1f5f9;" onclick="setBacteriaMinutes(30)">30분</button>
                <button class="btn" style="padding:4px 8px; font-size:0.82rem; background:#e0f2fe; color:#0369a1; font-weight:800;" onclick="setBacteriaMinutes(60)">60분</button>
                <span id="bacteria-badge" style="background:#fdf2f8; color:#9d174d; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.85rem;">
                  경과 시간: ${simState.bacteriaMinutes}분
                </span>
              </div>
            </div>
          `;
        }
        renderBacteriaGraphCanvas(two, simState.bacteriaMinutes);
        break;

      case '1-8':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">📐 1-8 지수방정식 밑 통일 비교판</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '1-8 스스로 확인하기 4번',
          title: '지수방정식의 미지수 구하기',
          given: '2^a = 64,  (1/3)^b = 1/27',
          guide: '💡 양변의 밑을 2와 1/3로 통일한 후 지수를 비교하여 a와 b를 구해보세요.'
        });
        break;

      case '1-9':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">🚂 1부터 30까지 역 열차 승객 하차 시뮬레이터:</span>
              <div style="display:flex; align-items:center; gap:6px;">
                <button class="btn" style="padding:4px 8px; font-size:0.82rem; background:#f1f5f9;" onclick="setTrainStation(simState.trainStation - 1)">◀ 이전 역</button>
                <button class="btn" style="padding:4px 8px; font-size:0.82rem; background:#f1f5f9;" onclick="setTrainStation(simState.trainStation + 1)">다음 역 ▶</button>
                <span id="train-badge" style="background:#fef3c7; color:#92400e; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.85rem;">
                  현재 역: ${simState.trainStation}번 역
                </span>
              </div>
            </div>
          `;
        }
        renderTrainStationCanvas(two);
        break;

      // ----------------------------------------
      // Tab 2: 소인수분해 (2-1 ~ 2-9)
      // ----------------------------------------
      case '2-1':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">🧩 12의 소인수 블록 분해 개념도:</span>
              <span style="background:#f0fdf4; color:#166534; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.85rem;">
                소인수: 인수(약수) 중에서 소수인 것
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
              <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">🌳 소인수분해 가지치기 분기도(Tree):</span>
              <div style="display:flex; gap:4px;">
                <button class="btn" style="padding:4px 8px; font-size:0.82rem; background:#f1f5f9;" onclick="setFactorTreeStep(1)">1단계: 2×18</button>
                <button class="btn" style="padding:4px 8px; font-size:0.82rem; background:#e0f2fe; color:#0369a1; font-weight:800;" onclick="setFactorTreeStep(2)">2단계: 소인수 완성</button>
              </div>
            </div>
          `;
        }
        renderFactorTreeCanvas(two, 36);
        break;

      case '2-3':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">🧱 세로 나눗셈 소인수분해 스텝퍼 (80의 분해):</span>
              <div style="display:flex; gap:4px;">
                <button class="btn" style="padding:4px 8px; font-size:0.82rem; background:#f1f5f9;" onclick="setVertDivStep(1)">1단계</button>
                <button class="btn" style="padding:4px 8px; font-size:0.82rem; background:#f1f5f9;" onclick="setVertDivStep(2)">2단계</button>
                <button class="btn" style="padding:4px 8px; font-size:0.82rem; background:#e0f2fe; color:#0369a1; font-weight:800;" onclick="setVertDivStep(3)">전체 완성</button>
              </div>
            </div>
          `;
        }
        renderVerticalDivisionCanvas(two, 80);
        break;

      case '2-4':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">🏷️ 2-4 소인수 추출: 15, 22, 49, 70의 소인수 구하기</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '2-4 스스로 확인하기 1번',
          title: '주어진 수의 소인수 모두 구하기',
          given: '대상 수: 15,  22,  49,  70',
          guide: '💡 각 수를 소인수분해하여 곱해진 밑(소수)들을 빠짐없이 나열하세요.'
        });
        break;

      case '2-5':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">➗ 2-5 소인수분해하여 거듭제곱 꼴로 나타내기 (34, 75, 96)</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '2-5 스스로 확인하기 2번',
          title: '소인수분해하여 거듭제곱으로 표현',
          given: '대상 수: 34,  75,  96',
          guide: '💡 세로 나눗셈 또는 나뭇가지 그림을 이용하여 소수의 거듭제곱 꼴로 나타내세요.'
        });
        break;

      case '2-6':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">📊 2-6 연속 곱 2×3×4×5×6 소인수 2의 지수 탐구</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '2-6 스스로 확인하기 3번',
          title: '연속된 곱의 소인수분해와 지수',
          given: '2 × 3 × 4 × 5 × 6 = 2^a × 3^b × 5^c',
          guide: '💡 4 = 2², 6 = 2×3과 같이 합성수를 소수의 곱으로 분해하여 2의 총 개수를 세어보세요.'
        });
        break;

      case '2-7':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">⚖️ 2-7 제곱수 만들기: 가장 작은 자연수 곱하기</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '2-7 스스로 확인하기 4번',
          title: '어떤 자연수의 제곱 만들기',
          given: '56 × x = (자연수)²',
          guide: '💡 56을 소인수분해한 후 모든 소인수의 지수가 짝수가 되도록 부족한 소수를 곱해주세요.'
        });
        break;

      case '2-8':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">🔎 2-8 선우·은서 조건 만족 수 탐색 (소인수 2개, 합 18)</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '2-8 스스로 확인하기 5번',
          title: '조건을 만족하는 두 자리 자연수 찾기',
          given: '조건: 소인수가 2개뿐이고, 두 소인수의 합이 18인 두 자리 자연수',
          guide: '💡 합이 18이 되는 두 소수 쌍(5+13, 7+11)을 찾아 각각 곱해보세요.'
        });
        break;

      case '2-9':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">📐 2차원 약수 곱셈 격자표 & 개수 공식:</span>
              <span style="background:#f0fdf4; color:#166534; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.85rem;">
                약수의 개수 = (a + 1)(b + 1)
              </span>
            </div>
          `;
        }
        renderFactorGridCanvas(two, 63);
        break;

      // ----------------------------------------
      // Tab 3: 최대공약수 (3-1 ~ 3-10)
      // ----------------------------------------
      case '3-1':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">🟦 서로소 개념과 정사각형 타일 바닥 채우기:</span>
              <span style="background:#eff6ff; color:#1e40af; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.85rem;">
                공약수가 1뿐인 두 수의 관계: 서로소
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
              <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">⚖️ 공통 소인수 지수 비교 저울 (최대공약수):</span>
              <span style="background:#fef3c7; color:#92400e; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.85rem;">
                공통 소인수 중 지수가 작거나 같은 것을 택하여 곱합니다!
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
              <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">🔢 세 수 최대공약수 세로 정렬판:</span>
              <span style="background:#f1f5f9; color:#475569; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.85rem;">
                세 수 60, 72, 150의 공통 소인수 곱
              </span>
            </div>
          `;
        }
        renderThreeNumGcdCanvas(two);
        break;

      case '3-4':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">⚖️ 3-4 두 수의 최대공약수 구하기 (2·7² & 2²·3²·7 / 84 & 150)</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '3-4 스스로 확인하기 1번',
          title: '두 수의 최대공약수 구하기',
          given: '(1) 2×7²,  2²×3²×7   |   (2) 84,  150',
          guide: '💡 공통인 소인수 중 지수가 작거나 같은 것을 택하여 모두 곱하세요.'
        });
        break;

      case '3-5':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">🔢 3-5 세 수의 최대공약수 구하기 (52, 65, 91)</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '3-5 스스로 확인하기 2번',
          title: '세 수의 최대공약수 구하기',
          given: '(1) 3²×7,  3³×7²,  3×7²×11   |   (2) 52,  65,  91',
          guide: '💡 세 수 모두에 공통으로 들어있는 소인수를 찾아 지수가 가장 작은 것을 택하세요.'
        });
        break;

      case '3-6':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">📏 3-6 20보다 크고 30보다 작은 자연수 중 15와 서로소인 수</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '3-6 스스로 확인하기 3번',
          title: '15와 서로소인 수 찾기',
          given: '범위: 20 < x < 30 인 자연수 x   /   기준: 15 = 3 × 5',
          guide: '💡 15의 소인수인 3과 5의 배수를 제외한 수들을 골라보세요.'
        });
        break;

      case '3-7':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">⚖️ 3-7 최대공약수가 100일 때 미지수 지수 a, b 구하기</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '3-7 스스로 확인하기 4번',
          title: '최대공약수 조건으로 지수 맞추기',
          given: '두 수: 2^a × 5³ × 7,   2³ × 3 × 5^b   /   최대공약수: 100 = 2² × 5²',
          guide: '💡 공통 소인수 2와 5의 작은 쪽 지수가 각각 2가 되도록 a와 b를 결정하세요.'
        });
        break;

      case '3-8':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">📐 3-8 105/N, 350/N 을 모두 자연수로 만드는 가장 큰 N</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '3-8 스스로 확인하기 5번',
          title: '분수를 자연수로 만드는 수 구하기',
          given: '105/N 과 350/N 이 모두 자연수가 됨',
          guide: '💡 N은 105와 350의 공약수이어야 하므로, 가장 큰 N은 두 수의 최대공약수입니다.'
        });
        break;

      case '3-9':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">📦 3-9 나머지가 생기는 나눗셈의 최대 제수 구하기</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '3-9 스스로 확인하기 6번',
          title: '나머지 보정 최대공약수 활용',
          given: '107을 나누면 2가 남고, 153을 나누면 3이 남고, 90은 나누어떨어짐',
          guide: '💡 남는 나머지를 각각 뺀 수 (107-2=105, 153-3=150, 90)의 최대공약수를 구하세요.'
        });
        break;

      case '3-10':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">🕸️ 3-10 21과의 최대공약수가 7인 50 이하의 자연수</span>
              <span style="background:#f0fdf4; color:#166534; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.85rem;">
                7 × k (k는 3과 서로소)
              </span>
            </div>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '3-10 스스로 확인하기 7번',
          title: '최대공약수가 주어진 수의 조건 탐색',
          given: '21 = 3 × 7 과의 최대공약수가 7인 50 이하의 자연수',
          guide: '💡 7의 배수 중 3의 배수를 제외한 수(7×1, 7×2, 7×4, 7×5 등)를 찾아보세요.'
        });
        break;

      // ----------------------------------------
      // Tab 4: 최소공배수 (4-1 ~ 4-10)
      // ----------------------------------------
      case '4-1':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">⚽ 동시 개최 주기 회전 시뮬레이터:</span>
              <span style="background:#eff6ff; color:#1e40af; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.85rem;">
                두 주기의 공통 배수 = 최소공배수의 배수
              </span>
            </div>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '4-1 개념 탐구',
          title: '동시 개최 주기와 최소공배수',
          given: '올림픽(4년 주기), 아시안게임(4년 주기), 월드컵(4년 주기) 등의 랑데부',
          guide: '💡 다음 동시 개최 연도는 각 주기의 최소공배수를 더하여 계산합니다.'
        });
        break;

      case '4-2':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">⚙️ 맞물린 톱니바퀴 (24개, 36개) 회전 시뮬레이터:</span>
              <button id="gear-rot-btn" class="btn" style="background:#0284c7; color:#ffffff; font-weight:800; font-size:0.85rem; padding:4px 12px;" onclick="toggleGearRotation()">
                ${simState.isGearRotating ? '⏹ 회전 정지' : '▶ 톱니 회전 시작'}
              </button>
            </div>
          `;
        }
        renderGearsCanvas(two, simState.gearAngle);
        break;

      case '4-3':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">📏 4-3 두 수의 최소공배수 구하기 (3²·11 & 3·5·11 / 21 & 27)</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '4-3 스스로 확인하기 1번',
          title: '두 수의 최소공배수 구하기',
          given: '(1) 3²×11,  3×5×11   |   (2) 21,  27',
          guide: '💡 모든 소인수를 곱하되 지수가 크거나 같은 것을 택하여 곱하세요.'
        });
        break;

      case '4-4':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">📊 4-4 세 수의 최소공배수 구하기 (6, 42, 63)</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '4-4 스스로 확인하기 2번',
          title: '세 수의 최소공배수 구하기',
          given: '(1) 2⁴×3³,  2²×3×5,  2³×3²×5²   |   (2) 6,  42,  63',
          guide: '💡 세 수의 모든 소인수 중 가장 높은 지수를 택하여 곱하세요.'
        });
        break;

      case '4-5':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">⚖️ 4-5 분수를 자연수로 만드는 가장 작은 자연수 구하기</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '4-5 스스로 확인하기 3번',
          title: '분수 통분과 최소공배수 활용',
          given: '1/70 과 1/98 에 곱하여 모두 자연수가 되게 하는 가장 작은 자연수 N',
          guide: '💡 N은 두 분모 70과 98의 공배수이어야 하므로, 최소공배수를 구하면 됩니다.'
        });
        break;

      case '4-6':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">⚖️ 4-6 3A, 4A, 5A의 최소공배수가 360일 때 자연수 A</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '4-6 스스로 확인하기 4번',
          title: '미지수가 포함된 세 수의 최소공배수',
          given: '세 수: 3A,  4A,  5A   /   최소공배수: 360',
          guide: '💡 3, 4, 5의 최소공배수는 60이므로, 세 수의 최소공배수는 60 × A 가 됩니다.'
        });
        break;

      case '4-7':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">🧩 4-7 두 수의 최소공배수가 500일 때 가능한 자연수 후보</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '4-7 스스로 확인하기 5번',
          title: '최소공배수 지수 조합 탐색',
          given: '두 수: 2² × 5³,   □ × 5³   /   최소공배수: 500 = 2² × 5³',
          guide: '💡 빈칸에 들어갈 수는 2²의 약수(1, 2, 4)와 5의 거듭제곱 조합을 검토하세요.'
        });
        break;

      case '4-8':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">🏃 4-8 18과 45의 공배수 중 가장 작은 세 자리 자연수</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '4-8 스스로 확인하기 6번',
          title: '공배수 중 조건에 맞는 수 찾기',
          given: '두 수 18과 45의 공배수 중 가장 작은 세 자리 자연수',
          guide: '💡 18과 45의 최소공배수 L을 구한 후, L의 배수 중 100 이상인 최솟값을 찾으세요.'
        });
        break;

      case '4-9':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">⚖️ 4-9 합 44, GCD 4, LCM 72 관계형 천칭</span>
              <span style="background:#fef3c7; color:#92400e; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.85rem;">
                A = 4a, B = 4b (a, b 서로소)
              </span>
            </div>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '4-9 스스로 확인하기 7번',
          title: '합과 GCD, LCM이 주어진 두 자연수',
          given: '두 수의 합: 44,   최대공약수(G): 4,   최소공배수(L): 72',
          guide: '💡 A = 4a, B = 4b라 하면 a + b = 11 이고 a × b = 18 인 서로소 쌍을 찾으세요.'
        });
        break;

      case '4-10':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">💻 알지오매스 소수 판별 코딩 러너:</span>
              <div style="display:flex; align-items:center; gap:6px;">
                <input type="number" id="algo-input-val" class="form-control" style="width:90px; padding:4px 8px; font-weight:700;" value="${simState.algoNum}">
                <button class="btn btn-primary" style="padding:4px 12px; font-weight:800; font-size:0.85rem;" onclick="runCodingAlgo()">알고리즘 실행</button>
              </div>
              <div id="algo-result-box" style="display:none; background:#eff6ff; color:#1e40af; padding:4px 10px; border-radius:6px; font-size:0.85rem; font-weight:800;"></div>
            </div>
          `;
        }
        renderAlgoCanvas(two, simState.algoNum, false);
        break;

      // ----------------------------------------
      // Tab 5: 스스로 마무리하기 (5-1 ~ 5-14)
      // ----------------------------------------
      case '5-1':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">📅 달력 속 31일까지의 날짜 중 소수 탐색:</span>
              <span style="background:#f0fdf4; color:#166534; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.85rem;">
                선택된 소수 날짜: <b id="cal-selected-count">${simState.calendarSelected.size}개</b> / 총 11개
              </span>
            </div>
          `;
        }
        renderCalendarCanvas(two);
        break;

      case '5-2':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">⚖️ 5-2 명제 진위 판정 (ㄱ, ㄴ, ㄷ, ㄹ)</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '대단원 스스로 마무리하기 02번',
          title: '소수와 합성수 명제 진위 판정',
          given: 'ㄱ. 모든 소수는 홀수이다. / ㄴ. 10 이하의 소수는 4개이다. / ㄷ. 가장 작은 합성수는 4이다. / ㄹ. 자연수는 1, 소수, 합성수이다.',
          guide: '💡 2는 짝수이면서 유일한 소수라는 점과 각 명제의 정의를 꼼꼼히 확인하세요.'
        });
        break;

      case '5-3':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">🔄 5-3 거듭제곱 계산 결과의 일의 자리 숫자 규칙 탐색</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '대단원 스스로 마무리하기 03번',
          title: '거듭제곱의 일의 자리 숫자 규칙',
          given: '3¹³,  5²⁰ 의 일의 자리 숫자 계산',
          guide: '💡 3의 거듭제곱의 일의 자리는 3, 9, 7, 1 (4개 주기)로 반복됩니다.'
        });
        break;

      case '5-4':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">🌳 5-4 330의 소인수분해와 약수가 아닌 것 찾기</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '대단원 스스로 마무리하기 04번',
          title: '330의 소인수분해와 약수 판별',
          given: '대상 수: 330',
          guide: '💡 330을 소인수분해하여 그 소인수들의 곱으로 나타낼 수 없는 보기를 고르세요.'
        });
        break;

      case '5-5':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">⚖️ 5-5 나눗셈으로 제곱수 만들기 (84 ÷ x = y²)</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '대단원 스스로 마무리하기 05번',
          title: '자연수로 나누어 제곱수 만들기',
          given: '84 ÷ x = y² (가장 작은 자연수 x, 그때의 y)',
          guide: '💡 84를 소인수분해하여 지수가 홀수인 소인수들을 묶어 x로 소거하세요.'
        });
        break;

      case '5-6':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">⭕ 5-6 35와 서로소인 수 찾기</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '대단원 스스로 마무리하기 06번',
          title: '35와 서로소인 수 판별',
          given: '35 = 5 × 7',
          guide: '💡 35의 소인수인 5와 7을 소인수로 갖지 않는 보기를 찾으세요.'
        });
        break;

      case '5-7':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">🧱 5-7 두 수의 최대공약수와 최소공배수 구하기</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '대단원 스스로 마무리하기 07번',
          title: '소인수분해 꼴에서 GCD와 LCM 구하기',
          given: '두 수: 2³ × 3² × 5,   2² × 3³ × 7',
          guide: '💡 최대공약수는 작은 지수, 최소공배수는 큰 지수를 택하여 계산하세요.'
        });
        break;

      case '5-8':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">⚖️ 5-8 두 수의 곱과 최대공약수·최소공배수의 관계</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '대단원 스스로 마무리하기 08번',
          title: 'A × B = G × L 관계 공식',
          given: '두 자연수 A와 36   /   최대공약수: 12,   최소공배수: 180',
          guide: '💡 공식 A × 36 = 12 × 180 을 세워 미지수 A의 값을 계산해보세요.'
        });
        break;

      case '5-9':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">📊 5-9 두 자연수의 비가 3:7이고 최소공배수가 420일 때 최대공약수</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '대단원 스스로 마무리하기 09번',
          title: '비율과 최소공배수를 이용한 GCD 구하기',
          given: '두 수 A : B = 3 : 7   /   최소공배수: 420',
          guide: '💡 두 수를 3g, 7g라 두면 최소공배수는 21g = 420 이 됩니다.'
        });
        break;

      case '5-10':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">🔗 5-10 세 분수를 자연수로 만드는 가장 작은 기약분수</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '대단원 스스로 마무리하기 10번',
          title: '분수 곱셈의 자연수 조건',
          given: '세 분수 9/5,  36/7,  15/14 에 곱하여 모두 자연수가 되게 하는 기약분수',
          guide: '💡 구하는 분수는 (분모들의 최소공배수) / (분자들의 최대공약수) 꼴입니다.'
        });
        break;

      case '5-11':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">📝 5-11 서술형: 126의 최대 소인수와 45의 최소 소인수</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '대단원 스스로 마무리하기 11번 (서술형)',
          title: '소인수분해를 이용한 최대·최소 소인수',
          given: '126의 가장 큰 소인수 A,  45의 가장 작은 소인수 B',
          guide: '💡 126과 45를 각각 소인수분해하여 소인수 목록을 적고 A와 B의 합을 구하세요.'
        });
        break;

      case '5-12':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">📝 5-12 서술형: 1부터 12까지의 곱 소인수분해</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '대단원 스스로 마무리하기 12번 (서술형)',
          title: '연속 곱의 소인수별 지수 구하기',
          given: '1 × 2 × 3 × ... × 12 = 2^a × 3^b × 5^c × 7^d × 11^e',
          guide: '💡 1부터 12까지 각 수에 포함된 2의 개수와 3의 개수를 세어 지수의 합을 구하세요.'
        });
        break;

      case '5-13':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">📝 5-13 서술형: 세 수 72, 60, A의 최대공약수가 6일 때 가장 작은 A</span>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '대단원 스스로 마무리하기 13번 (서술형)',
          title: '세 수의 공통 소인수 조건 탐색',
          given: '세 수 72, 60, A   /   최대공약수: 6 = 2 × 3',
          guide: '💡 A는 6의 배수이면서, 4나 9의 배수가 되지 않도록 조건을 만족하는 최솟값을 찾으세요.'
        });
        break;

      case '5-14':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">🌲 5-14 서술형: 최대공약수 / 최소공배수 연결 트리</span>
              <span style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.85rem;">
                미지수 A, B, C를 단계별로 역추적
              </span>
            </div>
          `;
        }
        renderProblemSupportCanvas(two, {
          badge: '대단원 스스로 마무리하기 14번 (서술형)',
          title: '연결 관계망을 통한 미지수 구하기',
          given: 'A와 24의 GCD=12, LCM=72  /  B와 24의 관계  /  C의 값',
          guide: '💡 두 수의 곱과 GCD·LCM 관계 공식을 각 노드에 적용하여 A, B, C의 합을 구하세요.'
        });
        break;

      // ----------------------------------------
      // Tab 6: 창의융합 프로젝트 (6-1)
      // ----------------------------------------
      case '6-1':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.95rem;">🎨 몬드리안 직사각형 분할 실험실:</span>
              <span style="background:#eff6ff; color:#1e40af; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.85rem;">
                넓이가 주어진 수와 같은 직사각형들로 판을 빈틈없이 채웁니다!
              </span>
            </div>
          `;
        }
        renderMondrianCanvas(two);
        break;

      default:
        renderDefaultCanvas(two, code);
        break;
    }
    two.update();
  }
  window.setupSubstepSimulator = setupSubstepSimulator;

  // ==========================================
  // Detailed Two.js Rendering Functions (Type A & Legacy)
  // 태블릿 가독성 대폭 향상 (폰트 크기 14~24px)
  // ==========================================

  function renderTileArrayCanvas(two, r, c) {
    if (!two) return;
    two.clear();

    const cx = two.width / 2;
    const cy = two.height / 2 + 16;
    const maxDim = Math.max(r, c, 6);
    const size = Math.max(24, Math.min(38, Math.floor(260 / maxDim)));
    const startX = cx - (c * size) / 2;
    const startY = cy - (r * size) / 2;
    const totalCells = r * c;
    const isExact12 = (totalCells === 12);

    const allPairs = [
      { key: '1x12', label: '1 × 12' },
      { key: '2x6', label: '2 × 6' },
      { key: '3x4', label: '3 × 4' },
      { key: '4x3', label: '4 × 3' },
      { key: '6x2', label: '6 × 2' },
      { key: '12x1', label: '12 × 1' }
    ];

    const topY = 28;
    const headerTitle = two.makeText("🏆 12개 타일로 만들 수 있는 직사각형 모양 수집기", cx, topY - 14);
    headerTitle.size = 17; headerTitle.weight = 800; headerTitle.fill = '#1e293b';

    const pillW = 56;
    const pillH = 24;
    const totalPillsW = allPairs.length * (pillW + 6) - 6;
    const pillStartX = cx - totalPillsW / 2 + pillW / 2;

    allPairs.forEach((pair, idx) => {
      const px = pillStartX + idx * (pillW + 6);
      const isFound = simState.foundTileFactors.has(pair.key);
      const pill = two.makeRoundedRectangle(px, topY + 12, pillW, pillH, 6);
      if (isFound) {
        pill.fill = '#ecfdf5';
        pill.stroke = '#10b981';
        pill.linewidth = 1.5;
        const t = two.makeText(pair.label, px, topY + 12);
        t.size = 13; t.weight = 800; t.fill = '#065f46';
      } else {
        pill.fill = '#f8fafc';
        pill.stroke = '#cbd5e1';
        pill.linewidth = 1;
        const t = two.makeText("? × ?", px, topY + 12);
        t.size = 13; t.weight = 600; t.fill = '#94a3b8';
      }
    });

    const bgW = Math.max(c * size + 44, 250);
    const bgH = Math.max(r * size + 44, 190);
    const bgBox = two.makeRoundedRectangle(cx, cy, bgW, bgH, 12);
    bgBox.fill = '#f8fafc';
    bgBox.stroke = '#e2e8f0';
    bgBox.linewidth = 1.5;

    const dimTopY = startY - 16;
    const topArrow = two.makeLine(startX, dimTopY, startX + c * size, dimTopY);
    topArrow.stroke = '#0284c7'; topArrow.linewidth = 2;
    two.makeLine(startX, dimTopY - 5, startX, dimTopY + 5).stroke = '#0284c7';
    two.makeLine(startX + c * size, dimTopY - 5, startX + c * size, dimTopY + 5).stroke = '#0284c7';
    const topLabel = two.makeText(`가로 ${c}칸`, cx, dimTopY - 11);
    topLabel.size = 15; topLabel.weight = 800; topLabel.fill = '#0284c7';

    const dimLeftX = startX - 18;
    const leftArrow = two.makeLine(dimLeftX, startY, dimLeftX, startY + r * size);
    leftArrow.stroke = '#0284c7'; leftArrow.linewidth = 2;
    two.makeLine(dimLeftX - 5, startY, dimLeftX + 5, startY).stroke = '#0284c7';
    two.makeLine(dimLeftX - 5, startY + r * size, dimLeftX + 5, startY + r * size).stroke = '#0284c7';
    const leftLabel = two.makeText(`세로 ${r}칸`, dimLeftX - 18, cy);
    leftLabel.size = 15; leftLabel.weight = 800; leftLabel.fill = '#0284c7';
    leftLabel.rotation = -Math.PI / 2;

    for (let i = 0; i < r; i++) {
      for (let j = 0; j < c; j++) {
        const cellNum = i * c + j + 1;
        const tx = startX + j * size + size / 2;
        const ty = startY + i * size + size / 2;

        if (cellNum <= 12) {
          const tile = two.makeRoundedRectangle(tx, ty, size - 3, size - 3, 4);
          if (isExact12) {
            tile.fill = '#0284c7';
            tile.stroke = '#0369a1';
            tile.linewidth = 2;
          } else {
            tile.fill = '#38bdf8';
            tile.stroke = '#0284c7';
            tile.linewidth = 1.5;
          }
          const numT = two.makeText(String(cellNum), tx, ty);
          numT.size = Math.max(12, Math.floor(size * 0.44));
          numT.weight = 800;
          numT.fill = '#ffffff';
        } else {
          const emptyCell = two.makeRoundedRectangle(tx, ty, size - 3, size - 3, 4);
          emptyCell.fill = 'rgba(239, 68, 68, 0.08)';
          emptyCell.stroke = '#f87171';
          emptyCell.linewidth = 1.5;
          const warnT = two.makeText("빈칸", tx, ty);
          warnT.size = Math.max(11, Math.floor(size * 0.36));
          warnT.weight = 700;
          warnT.fill = '#ef4444';
        }
      }
    }

    const handleX = startX + c * size;
    const handleY = startY + r * size;

    const aura = two.makeCircle(handleX, handleY, 22);
    aura.fill = 'rgba(99, 102, 241, 0.22)';
    aura.noStroke();

    const handleCircle = two.makeCircle(handleX, handleY, 13);
    handleCircle.fill = '#4f46e5';
    handleCircle.stroke = '#ffffff';
    handleCircle.linewidth = 2.5;

    const icon = two.makeText("⤢", handleX, handleY);
    icon.size = 14; icon.weight = 800; icon.fill = '#ffffff';

    const botY = cy + (r * size) / 2 + 30;

    if (isExact12) {
      const banner = two.makeRoundedRectangle(cx, botY, 360, 32, 16);
      banner.fill = '#f0fdf4';
      banner.stroke = '#22c55e';
      banner.linewidth = 2;

      const t = two.makeText(`🎉 [직사각형 완성!] ${r} × ${c} = 12 ➔ 12의 약수: ${r}, ${c}`, cx, botY);
      t.size = 14; t.weight = 800; t.fill = '#15803d';
    } else if (totalCells < 12) {
      const banner = two.makeRoundedRectangle(cx, botY, 340, 30, 15);
      banner.fill = '#fffbeb';
      banner.stroke = '#f59e0b';
      banner.linewidth = 1.5;

      const t = two.makeText(`⚠️ 현재 ${totalCells}칸: 12개 중 ${12 - totalCells}개 타일이 덜 채워짐`, cx, botY);
      t.size = 13; t.weight = 700; t.fill = '#b45309';
    } else {
      const banner = two.makeRoundedRectangle(cx, botY, 350, 30, 15);
      banner.fill = '#fef2f2';
      banner.stroke = '#ef4444';
      banner.linewidth = 1.5;

      const t = two.makeText(`⚠️ 현재 ${totalCells}칸: 12개 타일 초과로 ${totalCells - 12}칸이 비어있음`, cx, botY);
      t.size = 13; t.weight = 700; t.fill = '#b91c1c';
    }

    const guideT = two.makeText("🖐️ 우하단 보라색 모서리 핸들을 잡고 드래그하여 직사각형을 완성해보세요!", cx, botY + 28);
    guideT.size = 13; guideT.weight = 600; guideT.fill = '#64748b';

    two.update();
  }

  function renderVennCanvas(two, nA, nB) {
    if (!two) return;
    two.clear();

    const cx = two.width / 2;
    const cy = two.height / 2 - 20;
    const radius = 90;
    const offset = 70;
    const cAx = cx - offset;
    const cAy = cy;
    const cBx = cx + offset;
    const cBy = cy;

    const c1 = two.makeCircle(cAx, cAy, radius);
    c1.fill = 'rgba(59, 130, 246, 0.18)';
    c1.stroke = '#2563eb';
    c1.linewidth = 2.5;

    const c2 = two.makeCircle(cBx, cBy, radius);
    c2.fill = 'rgba(244, 63, 94, 0.18)';
    c2.stroke = '#e11d48';
    c2.linewidth = 2.5;

    const tA = two.makeText(`${nA}의 약수`, cAx - 35, cAy - radius - 16);
    tA.fill = '#1d4ed8'; tA.weight = 800; tA.size = 16;

    const tB = two.makeText(`${nB}의 약수`, cBx + 35, cBy - radius - 16);
    tB.fill = '#be123c'; tB.weight = 800; tB.size = 16;

    const tBoth = two.makeText("공약수 (A ∩ B)", cx, cAy - radius - 16);
    tBoth.fill = '#7c3aed'; tBoth.weight = 800; tBoth.size = 16;

    const trayY = cy + 125;
    const trayBox = two.makeRoundedRectangle(cx, trayY, 410, 52, 10);
    trayBox.fill = '#f8fafc';
    trayBox.stroke = '#cbd5e1';
    trayBox.linewidth = 1.5;

    const trayLabel = two.makeText("📦 수 카드 보관함 (마우스/터치로 원 안으로 끌어다 놓으세요)", cx, trayY - 34);
    trayLabel.size = 14; trayLabel.fill = '#475569'; trayLabel.weight = 700;

    const spacing = 44;
    const trayStartX = cx - (8 * spacing) / 2 + spacing / 2;

    simState.vennCards.forEach((card, i) => {
      if (simState.activeVennDragIndex === i) return;

      let px = trayStartX + i * spacing;
      let py = trayY;

      if (card.currentArea === 'onlyA') {
        const aCards = simState.vennCards.filter(c => c.currentArea === 'onlyA');
        const posIdx = aCards.indexOf(card);
        px = cx - 100;
        py = cy + ((posIdx === 0) ? -28 : 26);
      } else if (card.currentArea === 'both') {
        const bothCards = simState.vennCards.filter(c => c.currentArea === 'both');
        const posIdx = bothCards.indexOf(card);
        const ySlots = [-45, -15, 15, 45];
        px = cx;
        py = cy + (ySlots[posIdx] || 0);
      } else if (card.currentArea === 'onlyB') {
        const bCards = simState.vennCards.filter(c => c.currentArea === 'onlyB');
        const posIdx = bCards.indexOf(card);
        px = cx + 100;
        py = cy + ((posIdx === 0) ? -28 : 26);
      }

      const cardBox = two.makeRoundedRectangle(px, py, 34, 34, 6);
      if (card.currentArea === 'tray') {
        cardBox.fill = '#ffffff';
        cardBox.stroke = '#94a3b8';
        cardBox.linewidth = 1.5;
      } else if (card.currentArea === 'both') {
        cardBox.fill = '#faf5ff';
        cardBox.stroke = '#9333ea';
        cardBox.linewidth = 2;
      } else if (card.currentArea === 'onlyA') {
        cardBox.fill = '#eff6ff';
        cardBox.stroke = '#2563eb';
        cardBox.linewidth = 2;
      } else {
        cardBox.fill = '#fff1f2';
        cardBox.stroke = '#e11d48';
        cardBox.linewidth = 2;
      }

      const txt = two.makeText(String(card.num), px, py);
      txt.size = 16; txt.weight = 800;
      txt.fill = (card.currentArea === 'both') ? '#6b21a8' : (card.currentArea === 'onlyA' ? '#1e40af' : (card.currentArea === 'onlyB' ? '#9f1239' : '#1e293b'));

      const totalPlaced = simState.vennCards.filter(c => c.currentArea === c.target).length;
      if (totalPlaced === 8 && card.num === 6 && card.currentArea === 'both') {
        cardBox.fill = '#fef08a';
        cardBox.stroke = '#eab308';
        cardBox.linewidth = 2.5;
        const crown = two.makeText("👑", px, py - 22);
        crown.size = 16;
      }
    });

    if (simState.activeVennDragIndex >= 0) {
      const card = simState.vennCards[simState.activeVennDragIndex];
      const dx = simState.vennDragPos.x;
      const dy = simState.vennDragPos.y;

      const shadow = two.makeRoundedRectangle(dx + 3, dy + 3, 40, 40, 8);
      shadow.fill = 'rgba(0,0,0,0.15)'; shadow.noStroke();

      const dragCard = two.makeRoundedRectangle(dx, dy, 38, 38, 8);
      dragCard.fill = '#ffffff';
      dragCard.stroke = '#4f46e5';
      dragCard.linewidth = 2.5;

      const dragTxt = two.makeText(String(card.num), dx, dy);
      dragTxt.size = 18; dragTxt.weight = 800; dragTxt.fill = '#4338ca';
    }

    const totalPlaced = simState.vennCards.filter(c => c.currentArea === c.target).length;
    const bannerY = cy + 62;

    if (totalPlaced === 8) {
      const banner = two.makeRoundedRectangle(cx, bannerY, 410, 32, 16);
      banner.fill = '#f0fdf4';
      banner.stroke = '#22c55e';
      banner.linewidth = 2;

      const t = two.makeText("🎉 [분류 완료!] 공약수: 1, 2, 3, 6 ➔ 최대공약수 = 6 👑", cx, bannerY);
      t.size = 15; t.weight = 800; t.fill = '#15803d';
    } else if (simState.vennHintMsg) {
      const banner = two.makeRoundedRectangle(cx, bannerY, 410, 30, 15);
      banner.fill = '#fffbeb';
      banner.stroke = '#f59e0b';
      banner.linewidth = 1.5;

      const t = two.makeText(simState.vennHintMsg, cx, bannerY);
      t.size = 13.5; t.weight = 700; t.fill = '#b45309';
    }

    two.update();
  }

  function renderLcmJumpCanvas(two, a = 4, b = 6) {
    if (!two) return;
    two.clear();
    const width = two.width, height = two.height;
    const maxVal = 24;
    const padX = 55;
    const stepX = (width - padX * 2) / maxVal;
    const startX = padX;
    const endX = width - padX;
    const cy = height / 2;

    const bgCard = two.makeRoundedRectangle(width / 2, height / 2, width - 20, height - 20, 10);
    bgCard.fill = '#f8fafc';
    bgCard.stroke = '#e2e8f0';
    bgCard.linewidth = 1;

    const legendA = two.makeText("🐰 4씩 도약 (토끼)", startX + 70, 26);
    legendA.size = 15; legendA.weight = 800; legendA.fill = '#0284c7';

    const legendB = two.makeText("🐸 6씩 도약 (개구리)", startX + 220, 26);
    legendB.size = 15; legendB.weight = 800; legendB.fill = '#ea580c';

    const hintTxt = two.makeText("💡 말을 드래그하거나 도약 버튼을 눌러보세요", width - 170, 26);
    hintTxt.size = 13.5; hintTxt.fill = '#64748b'; hintTxt.alignment = 'right';

    [12, 24].forEach(cVal => {
      const cxPos = startX + cVal * stepX;
      const isReachedBoth = (simState.jumpPosA === cVal && simState.jumpPosB === cVal);
      const isDiscovered = simState.foundCommonMultiples.has(cVal);

      if (isReachedBoth || isDiscovered) {
        const band = two.makeRoundedRectangle(cxPos, cy, 28, height - 60, 6);
        band.fill = isReachedBoth ? 'rgba(16, 185, 129, 0.16)' : 'rgba(245, 158, 11, 0.08)';
        band.stroke = isReachedBoth ? '#10b981' : '#f59e0b';
        band.linewidth = isReachedBoth ? 2 : 1;
        band.dashes = isReachedBoth ? [] : [4, 4];
      }
    });

    const line = two.makeLine(startX - 15, cy, endX + 22, cy);
    line.stroke = '#334155'; line.linewidth = 2.5;

    if (typeof two.makePath === 'function') {
      const arrow = two.makePath(
        endX + 22, cy,
        endX + 13, cy - 5,
        endX + 15, cy,
        endX + 13, cy + 5,
        true
      );
      arrow.fill = '#334155'; arrow.stroke = '#334155';
    } else {
      two.makeLine(endX + 13, cy - 5, endX + 22, cy);
      two.makeLine(endX + 13, cy + 5, endX + 22, cy);
    }

    for (let i = 0; i <= maxVal; i++) {
      const x = startX + i * stepX;
      const isEven = (i % 2 === 0);
      const isMul4 = (i > 0 && i % 4 === 0);
      const isMul6 = (i > 0 && i % 6 === 0);
      const isCommon = (i > 0 && i % 12 === 0);

      const tickLen = isEven ? 7 : 4;
      const tick = two.makeLine(x, cy - tickLen, x, cy + tickLen);
      tick.stroke = isCommon ? '#10b981' : (isEven ? '#475569' : '#cbd5e1');
      tick.linewidth = isCommon ? 2.5 : (isEven ? 1.8 : 1);

      if (isEven) {
        const lbl = two.makeText(String(i), x, cy + 20);
        lbl.size = isCommon ? 15 : 13.5;
        lbl.weight = isCommon ? 900 : (isMul4 || isMul6 ? 800 : 600);
        lbl.fill = isCommon ? '#059669' : (isMul4 ? '#0284c7' : (isMul6 ? '#ea580c' : '#475569'));
      }
    }

    for (let k = 0; k < simState.jumpPosA; k += a) {
      const x1 = startX + k * stepX;
      const x2 = startX + (k + a) * stepX;
      const arcMidX = (x1 + x2) / 2;
      const arcMidY = cy - 40;
      const arc = two.makeCurve(x1, cy, arcMidX, arcMidY, x2, cy, true);
      arc.stroke = '#0284c7'; arc.linewidth = 2.5; arc.noFill();

      const plusA = two.makeText("+4", arcMidX, arcMidY - 9);
      plusA.size = 13; plusA.weight = 800; plusA.fill = '#0284c7';

      const pDot = two.makeCircle(x2, cy, 4);
      pDot.fill = '#0284c7'; pDot.stroke = '#ffffff'; pDot.linewidth = 1;
    }

    for (let k = 0; k < simState.jumpPosB; k += b) {
      const x1 = startX + k * stepX;
      const x2 = startX + (k + b) * stepX;
      const arcMidX = (x1 + x2) / 2;
      const arcMidY = cy + 44;
      const arc = two.makeCurve(x1, cy, arcMidX, arcMidY, x2, cy, true);
      arc.stroke = '#ea580c'; arc.linewidth = 2.5; arc.noFill();

      const plusB = two.makeText("+6", arcMidX, arcMidY + 16);
      plusB.size = 13; plusB.weight = 800; plusB.fill = '#ea580c';

      const pDot = two.makeCircle(x2, cy, 4);
      pDot.fill = '#ea580c'; pDot.stroke = '#ffffff'; pDot.linewidth = 1;
    }

    if (simState.jumpPosA > 0 && simState.jumpPosA === simState.jumpPosB) {
      const cVal = simState.jumpPosA;
      const xMeet = startX + cVal * stepX;

      const beam = two.makeLine(xMeet, cy - 26, xMeet, cy + 26);
      beam.stroke = '#10b981'; beam.linewidth = 3.5;

      const beaconAura = two.makeCircle(xMeet, cy, 16);
      beaconAura.fill = 'rgba(16, 185, 129, 0.3)'; beaconAura.stroke = 'transparent';

      const beaconDot = two.makeCircle(xMeet, cy, 8);
      beaconDot.fill = '#10b981'; beaconDot.stroke = '#ffffff'; beaconDot.linewidth = 2;

      const isFirst = (cVal === 12);
      const crownBg = two.makeRoundedRectangle(xMeet, cy - 70, isFirst ? 210 : 160, 30, 15);
      crownBg.fill = '#fef3c7'; crownBg.stroke = '#f59e0b'; crownBg.linewidth = 1.5;

      const crownTxt = two.makeText(
        isFirst ? "👑 12 (첫 공배수 = 최소공배수!)" : "⭐ 24 (두 번째 공배수)",
        xMeet, cy - 70
      );
      crownTxt.size = 13.5; crownTxt.weight = 800; crownTxt.fill = '#92400e';
    }

    const curAx = startX + simState.jumpPosA * stepX;
    const curAy = cy - 26;
    const guideA = two.makeLine(curAx, curAy, curAx, cy);
    guideA.stroke = '#0284c7'; guideA.linewidth = 1.5; guideA.dashes = [3, 3];

    const auraA = two.makeCircle(curAx, curAy, 20);
    auraA.fill = 'rgba(2, 132, 199, 0.2)'; auraA.stroke = 'transparent';

    const tokenA = two.makeCircle(curAx, curAy, 14);
    tokenA.fill = '#0284c7'; tokenA.stroke = '#ffffff'; tokenA.linewidth = 2;

    const lblA = two.makeText("🐰", curAx, curAy - 1);
    lblA.size = 13;

    const curBx = startX + simState.jumpPosB * stepX;
    const curBy = cy + 26;
    const guideB = two.makeLine(curBx, curBy, curBx, cy);
    guideB.stroke = '#ea580c'; guideB.linewidth = 1.5; guideB.dashes = [3, 3];

    const auraB = two.makeCircle(curBx, curBy, 20);
    auraB.fill = 'rgba(234, 88, 12, 0.2)'; auraB.stroke = 'transparent';

    const tokenB = two.makeCircle(curBx, curBy, 14);
    tokenB.fill = '#ea580c'; tokenB.stroke = '#ffffff'; tokenB.linewidth = 2;

    const lblB = two.makeText("🐸", curBx, curBy - 1);
    lblB.size = 13;

    two.update();
  }

  function renderClassifyCanvas(two, selectedN) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;
    const cy = two.height / 2;

    const title = two.makeText(`자연수 약수 개수 분류 탐구 (현재 관찰 수: ${selectedN})`, cx, cy - 85);
    title.size = 17; title.weight = 800; title.fill = '#1e293b';

    const b1 = two.makeRoundedRectangle(cx - 150, cy + 10, 130, 140, 10);
    b1.fill = '#f1f5f9'; b1.stroke = '#94a3b8'; b1.linewidth = 2;
    const t1 = two.makeText("약수 1개\n\n1\n(유일)", cx - 150, cy - 10);
    t1.weight = 800; t1.fill = '#475569'; t1.size = 15;

    const b2 = two.makeRoundedRectangle(cx, cy + 10, 130, 140, 10);
    b2.fill = '#eff6ff'; b2.stroke = '#3b82f6'; b2.linewidth = 2;
    const t2 = two.makeText("약수 2개\n(소수)\n\n2, 3, 5, 7, 11...", cx, cy - 10);
    t2.weight = 800; t2.fill = '#1d4ed8'; t2.size = 15;

    const b3 = two.makeRoundedRectangle(cx + 150, cy + 10, 130, 140, 10);
    b3.fill = '#fef2f2'; b3.stroke = '#ef4444'; b3.linewidth = 2;
    const t3 = two.makeText("약수 3개 이상\n(합성수)\n\n4, 6, 8, 9, 10...", cx + 150, cy - 10);
    t3.weight = 800; t3.fill = '#b91c1c'; t3.size = 15;

    two.update();
  }

  function renderPrimeBoxesCanvas(two) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;
    const cy = two.height / 2;
    const n = simState.primeTileN || 6;

    let isP = true;
    if (n <= 1) isP = false;
    else {
      for (let i = 2; i * i <= n; i++) {
        if (n % i === 0) { isP = false; break; }
      }
    }

    const title = two.makeText(`수 [ ${n} ] 타일 직사각형 배열 판별기`, cx, cy - 85);
    title.size = 18; title.weight = 800; title.fill = '#1e293b';

    const r1 = two.makeRoundedRectangle(cx - 130, cy + 15, 170, 140, 10);
    r1.fill = isP ? '#eff6ff' : '#f8fafc';
    r1.stroke = isP ? '#2563eb' : '#cbd5e1';
    r1.linewidth = isP ? 3 : 1.5;
    const t1 = two.makeText("소수 (Prime)\n\n1줄로만 배열 가능\n(약수가 1과 자기자신뿐)", cx - 130, cy + 10);
    t1.weight = 800; t1.fill = isP ? '#1e40af' : '#64748b'; t1.size = 15;

    const r2 = two.makeRoundedRectangle(cx + 130, cy + 15, 170, 140, 10);
    r2.fill = !isP ? '#fee2e2' : '#f8fafc';
    r2.stroke = !isP ? '#dc2626' : '#cbd5e1';
    r2.linewidth = !isP ? 3 : 1.5;
    const t2 = two.makeText("합성수 (Composite)\n\n여러 행/열 직사각형 배열 가능\n(약수가 3개 이상)", cx + 130, cy + 10);
    t2.weight = 800; t2.fill = !isP ? '#991b1b' : '#64748b'; t2.size = 15;

    two.update();
  }

  function renderSieveCanvas(two, step) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;
    const cy = two.height / 2;
    const startX = cx - 165;
    const startY = cy - 75;
    const primes = new Set([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]);

    const title = two.makeText("🔬 에라토스테네스의 체 (1부터 50까지)", cx, startY - 26);
    title.size = 17; title.weight = 800; title.fill = '#1e293b';

    for (let n = 1; n <= 50; n++) {
      const col = (n - 1) % 10;
      const row = Math.floor((n - 1) / 10);
      const x = startX + col * 36;
      const y = startY + row * 32;

      let isErased = false;
      if (step >= 1 && n === 1) isErased = true;
      if (step >= 2 && n > 2 && n % 2 === 0) isErased = true;
      if (step >= 3 && n > 3 && n % 3 === 0) isErased = true;
      if (step >= 4 && n > 5 && n % 5 === 0) isErased = true;
      if (step >= 5 && n > 7 && n % 7 === 0) isErased = true;

      const isP = primes.has(n);
      const rect = two.makeRoundedRectangle(x, y, 32, 28, 4);

      if (isErased) {
        rect.fill = '#f1f5f9';
        rect.stroke = '#cbd5e1';
      } else if (step === 6 && isP) {
        rect.fill = '#fef08a';
        rect.stroke = '#eab308';
        rect.linewidth = 2;
      } else {
        rect.fill = '#ffffff';
        rect.stroke = '#94a3b8';
      }

      const txt = two.makeText(String(n), x, y + 1);
      txt.size = 14;
      txt.weight = 800;
      txt.fill = isErased ? '#94a3b8' : (step === 6 && isP ? '#854d0e' : '#1e293b');
    }

    two.update();
  }

  function renderPowerCanvas(two, b, e) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;
    const cy = two.height / 2;

    const title = two.makeText("거듭제곱과 밑·지수의 구조", cx, cy - 80);
    title.size = 18; title.weight = 800; title.fill = '#1e293b';

    const baseBox = two.makeRoundedRectangle(cx - 35, cy + 10, 65, 70, 8);
    baseBox.fill = '#dbeafe'; baseBox.stroke = '#2563eb'; baseBox.linewidth = 2;
    const baseTxt = two.makeText(String(b), cx - 35, cy + 12);
    baseTxt.size = 36; baseTxt.weight = 800; baseTxt.fill = '#1e3a8a';

    const expBox = two.makeRoundedRectangle(cx + 30, cy - 30, 48, 48, 8);
    expBox.fill = '#fef3c7'; expBox.stroke = '#d97706'; expBox.linewidth = 2;
    const expTxt = two.makeText(String(e), cx + 30, cy - 28);
    expTxt.size = 24; expTxt.weight = 800; expTxt.fill = '#92400e';

    const label = two.makeText("밑 (Base: 곱하는 수)         지수 (Exp: 곱한 횟수)", cx, cy + 75);
    label.weight = 800; label.fill = '#475569'; label.size = 16;

    two.update();
  }

  function renderBacteriaGraphCanvas(two, minutes) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;
    const cy = two.height / 2;

    const title = two.makeText(`세균 배가 증식 시뮬레이터 (경과 시간: ${minutes}분)`, cx, cy - 75);
    title.size = 17; title.weight = 800; title.fill = '#1e293b';

    const curve = two.makeCurve(cx - 120, cy + 40, cx - 50, cy + 30, cx + 20, cy, cx + 90, cy - 45, true);
    curve.stroke = '#ec4899'; curve.linewidth = 3.5; curve.noFill();

    const exp = Math.floor(minutes / 10);
    const count = Math.pow(2, exp);
    const t = two.makeText(`10분마다 2배 ➔ ${minutes}분 경과 시: 2^${exp} = ${count}마리`, cx, cy + 65);
    t.size = 16; t.weight = 800; t.fill = '#9d174d';

    two.update();
  }

  function renderTrainStationCanvas(two) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;
    const cy = two.height / 2;
    const st = simState.trainStation || 6;

    const banner = two.makeText(`🚂 ${st}번 역 열차 하차 시뮬레이터`, cx, cy - 65);
    banner.weight = 800; banner.fill = '#1e40af'; banner.size = 18;

    const line = two.makeLine(40, cy, two.width - 40, cy);
    line.stroke = '#3b82f6'; line.linewidth = 3.5;

    let factors = [];
    for (let i = 1; i <= st; i++) {
      if (st % i === 0) factors.push(i);
    }

    const t = two.makeText(`${st}의 약수: [ ${factors.join(', ')} ] ➔ 하차 승객: ${factors.length}명`, cx, cy + 50);
    t.size = 16; t.weight = 800; t.fill = '#15803d';

    two.update();
  }

  function renderBlockSplitCanvas(two, n) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;
    const cy = two.height / 2;

    const title = two.makeText(`${n}의 소인수 블록 분해`, cx, cy - 75);
    title.size = 18; title.weight = 800; title.fill = '#1e293b';

    const top = two.makeRoundedRectangle(cx, cy - 30, 80, 42, 8);
    top.fill = '#e0e7ff'; top.stroke = '#4f46e5'; top.linewidth = 2;
    const tTop = two.makeText(String(n), cx, cy - 30);
    tTop.weight = 800; tTop.size = 18; tTop.fill = '#3730a3';

    two.makeLine(cx, cy - 8, cx - 55, cy + 30).stroke = '#6366f1';
    two.makeLine(cx, cy - 8, cx + 55, cy + 30).stroke = '#6366f1';

    const bLeft = two.makeRoundedRectangle(cx - 55, cy + 40, 55, 36, 6);
    bLeft.fill = '#fef08a'; bLeft.stroke = '#eab308'; bLeft.linewidth = 2;
    const tL = two.makeText("2 (소수)", cx - 55, cy + 40);
    tL.weight = 800; tL.fill = '#854d0e'; tL.size = 13;

    const bRight = two.makeRoundedRectangle(cx + 55, cy + 40, 55, 36, 6);
    bRight.fill = '#f1f5f9'; bRight.stroke = '#94a3b8'; bRight.linewidth = 2;
    const tR = two.makeText(String(n / 2), cx + 55, cy + 40);
    tR.weight = 800; tR.fill = '#334155'; tR.size = 15;

    two.update();
  }

  function renderFactorTreeCanvas(two, n) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;
    const cy = two.height / 2;

    const title = two.makeText(`${n}의 소인수분해 나뭇가지 그림`, cx, cy - 80);
    title.size = 18; title.weight = 800; title.fill = '#1e293b';

    const root = two.makeCircle(cx, cy - 35, 24);
    root.fill = '#e0e7ff'; root.stroke = '#4338ca'; root.linewidth = 2;
    const tR = two.makeText(String(n), cx, cy - 35);
    tR.weight = 800; tR.size = 16; tR.fill = '#312e81';

    const n1 = two.makeCircle(cx - 60, cy + 35, 20);
    n1.fill = '#fef08a'; n1.stroke = '#ca8a04'; n1.linewidth = 2;
    const tn1 = two.makeText("2", cx - 60, cy + 35);
    tn1.weight = 800; tn1.size = 15; tn1.fill = '#713f12';

    const n2 = two.makeCircle(cx + 60, cy + 35, 20);
    n2.fill = '#e0e7ff'; n2.stroke = '#4338ca'; n2.linewidth = 2;
    const tn2 = two.makeText(String(n / 2), cx + 60, cy + 35);
    tn2.weight = 800; tn2.size = 15; tn2.fill = '#312e81';

    two.makeLine(cx, cy - 11, cx - 60, cy + 15).stroke = '#4338ca';
    two.makeLine(cx, cy - 11, cx + 60, cy + 15).stroke = '#4338ca';

    two.update();
  }

  function renderVerticalDivisionCanvas(two, num) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;
    const cy = two.height / 2;

    const title = two.makeText(`${num}의 세로 나눗셈 소인수분해`, cx, cy - 75);
    title.size = 18; title.weight = 800; title.fill = '#1e293b';

    const rect = two.makeRoundedRectangle(cx, cy + 10, 300, 110, 10);
    rect.fill = '#f8fafc'; rect.stroke = '#64748b'; rect.linewidth = 2;

    const t1 = two.makeText(`2 )  ${num}`, cx - 40, cy - 15);
    t1.size = 18; t1.weight = 800; t1.fill = '#0f172a';

    const t2 = two.makeText(`2 )  ${num / 2}`, cx - 40, cy + 20);
    t2.size = 18; t2.weight = 800; t2.fill = '#0f172a';

    two.update();
  }

  function renderFactorGridCanvas(two, n) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;
    const cy = two.height / 2;

    const title = two.makeText("2차원 약수 곱셈 격자표", cx, cy - 75);
    title.size = 18; title.weight = 800; title.fill = '#1e293b';

    const rect = two.makeRoundedRectangle(cx, cy + 10, 320, 110, 8);
    rect.fill = '#f8fafc'; rect.stroke = '#0284c7'; rect.linewidth = 2;

    const label = two.makeText("약수의 개수 = (지수 + 1) × (지수 + 1)", cx, cy + 10);
    label.weight = 800; label.size = 16; label.fill = '#0369a1';

    two.update();
  }

  function renderTilingSquareCanvas(two) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;
    const cy = two.height / 2;

    const title = two.makeText("정사각형 타일 채우기와 서로소", cx, cy - 75);
    title.size = 18; title.weight = 800; title.fill = '#1e293b';

    const outer = two.makeRectangle(cx, cy + 5, 200, 130);
    outer.fill = '#f1f5f9'; outer.stroke = '#0284c7'; outer.linewidth = 2;

    const tile = two.makeRectangle(cx - 50, cy - 10, 65, 65);
    tile.fill = '#bae6fd'; tile.stroke = '#0369a1'; tile.linewidth = 2;

    const t = two.makeText("최대 정사각형 타일 한 변 = 최대공약수", cx, cy + 55);
    t.size = 15; t.weight = 800; t.fill = '#0369a1';

    two.update();
  }

  function renderGcdBalanceCanvas(two, a, b) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;
    const cy = two.height / 2;

    const title = two.makeText(`공통 소인수 지수 비교 저울`, cx, cy - 75);
    title.size = 18; title.weight = 800; title.fill = '#1e293b';

    const r1 = two.makeRoundedRectangle(cx - 80, cy + 10, 110, 70, 8);
    r1.fill = '#e0e7ff'; r1.stroke = '#4338ca'; r1.linewidth = 2;
    const t1 = two.makeText(String(a), cx - 80, cy + 10);
    t1.weight = 800; t1.fill = '#312e81'; t1.size = 18;

    const r2 = two.makeRoundedRectangle(cx + 80, cy + 10, 110, 70, 8);
    r2.fill = '#fef3c7'; r2.stroke = '#d97706'; r2.linewidth = 2;
    const t2 = two.makeText(String(b), cx + 80, cy + 10);
    t2.weight = 800; t2.fill = '#78350f'; t2.size = 18;

    two.update();
  }

  function renderThreeNumGcdCanvas(two) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;
    const cy = two.height / 2;

    const title = two.makeText("세 수의 최대공약수 세로 정렬판", cx, cy - 65);
    title.size = 18; title.weight = 800; title.fill = '#1e293b';

    const rect = two.makeRoundedRectangle(cx, cy + 15, 320, 100, 10);
    rect.fill = '#f8fafc'; rect.stroke = '#3b82f6'; rect.linewidth = 2;

    const txt = two.makeText("세 수의 공통 소인수 중 가장 작은 지수 곱", cx, cy + 15);
    txt.size = 15; txt.weight = 800; txt.fill = '#1d4ed8';

    two.update();
  }

  function renderGearsCanvas(two, angle) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;
    const cy = two.height / 2;

    const title = two.makeText("맞물린 톱니바퀴 회전 시뮬레이터", cx, cy - 80);
    title.size = 18; title.weight = 800; title.fill = '#1e293b';

    const g1 = two.makeCircle(cx - 60, cy, 45);
    g1.fill = '#e0f2fe'; g1.stroke = '#0284c7'; g1.linewidth = 3;
    g1.rotation = angle;
    const tg1 = two.makeText("24톱니", cx - 60, cy);
    tg1.size = 14; tg1.weight = 800; tg1.fill = '#0369a1';

    const g2 = two.makeCircle(cx + 55, cy, 60);
    g2.fill = '#fef3c7'; g2.stroke = '#d97706'; g2.linewidth = 3;
    g2.rotation = -angle * (24 / 36);
    const tg2 = two.makeText("36톱니", cx + 55, cy);
    tg2.size = 15; tg2.weight = 800; tg2.fill = '#92400e';

    const txt = two.makeText("처음으로 다시 맞물릴 때까지 돌아간 톱니 수 = 최소공배수", cx, cy + 80);
    txt.size = 15; txt.weight = 800; txt.fill = '#0f172a';

    two.update();
  }

  function renderAlgoCanvas(two, n, isPrime) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;
    const cy = two.height / 2;

    const title = two.makeText("알지오매스 소수 판별 코딩 알고리즘", cx, cy - 75);
    title.size = 18; title.weight = 800; title.fill = '#1e293b';

    const box = two.makeRoundedRectangle(cx, cy + 10, 320, 90, 10);
    box.fill = isPrime ? '#f0fdf4' : '#fef2f2';
    box.stroke = isPrime ? '#16a34a' : '#ef4444';
    box.linewidth = 2;

    const t = two.makeText(`검사 수: ${n} ➔ 알고리즘 판별: ${isPrime ? '소수' : '합성수'}`, cx, cy + 10);
    t.size = 16; t.weight = 800; t.fill = isPrime ? '#166534' : '#991b1b';

    two.update();
  }

  function renderCalendarCanvas(two) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;
    const cy = two.height / 2;
    const primes = new Set(simState.calendarPrimes);
    const startX = cx - 110;
    const startY = cy - 75;

    const title = two.makeText("📅 달력 속 31일까지의 날짜 중 소수 찾기", cx, startY - 26);
    title.size = 17; title.weight = 800; title.fill = '#1e293b';

    for (let d = 1; d <= 31; d++) {
      const col = (d - 1) % 7;
      const row = Math.floor((d - 1) / 7);
      const x = startX + col * 36;
      const y = startY + row * 32;

      const circle = two.makeCircle(x, y, 14);
      if (primes.has(d)) {
        circle.fill = '#fef08a'; circle.stroke = '#ca8a04'; circle.linewidth = 2;
      } else {
        circle.fill = '#ffffff'; circle.stroke = '#cbd5e1';
      }

      const txt = two.makeText(String(d), x, y + 1);
      txt.size = 13; txt.weight = 800;
      txt.fill = primes.has(d) ? '#854d0e' : '#475569';
    }

    two.update();
  }

  function renderMondrianCanvas(two) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;
    const cy = two.height / 2;

    const title = two.makeText("🎨 몬드리안 직사각형 분할 아트", cx, cy - 80);
    title.size = 18; title.weight = 800; title.fill = '#1e293b';

    const r1 = two.makeRectangle(cx - 50, cy - 20, 80, 60);
    r1.fill = '#ef4444'; r1.stroke = '#0f172a'; r1.linewidth = 3;

    const r2 = two.makeRectangle(cx + 50, cy - 20, 100, 60);
    r2.fill = '#3b82f6'; r2.stroke = '#0f172a'; r2.linewidth = 3;

    const r3 = two.makeRectangle(cx - 50, cy + 45, 80, 70);
    r3.fill = '#eab308'; r3.stroke = '#0f172a'; r3.linewidth = 3;

    const r4 = two.makeRectangle(cx + 50, cy + 45, 100, 70);
    r4.fill = '#ffffff'; r4.stroke = '#0f172a'; r4.linewidth = 3;

    const txt = two.makeText("넓이 = 주어진 수 (직사각형 분할)", cx, cy + 95);
    txt.size = 15; txt.weight = 800; txt.fill = '#0f172a';

    two.update();
  }

  function renderDefaultCanvas(two, code) {
    if (!two) return;
    two.clear();
    const cx = two.width / 2;
    const cy = two.height / 2;
    const rect = two.makeRoundedRectangle(cx, cy, 300, 90, 10);
    rect.fill = '#f8fafc'; rect.stroke = '#cbd5e1'; rect.linewidth = 2;

    const t = two.makeText(`서브스텝 [${code}] 시뮬레이터`, cx, cy);
    t.size = 16; t.weight = 800; t.fill = '#0284c7';
    two.update();
  }

})();
