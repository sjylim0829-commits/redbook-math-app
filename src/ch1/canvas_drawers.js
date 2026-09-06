// src/ch1/canvas_drawers.js
// Chapter 1: Interactive Two.js Canvas Engines for all 57 Substeps
// 규칙 10 & 11 완전 준수 (소단원 확인하기 1문항 1페이지 및 마무리하기 전용 탭 14문항 1페이지)

(function() {
  const simState = {
    tileRows: 2,
    tileCols: 6,
    foundTileFactors: new Set(['2x6']),
    isDraggingHandle: false,
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
    jumpPosA: 0,
    jumpPosB: 0,
    isDraggingJumperA: false,
    isDraggingJumperB: false,
    foundCommonMultiples: new Set(),
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

  // --- 0-1 Interactive Tile Array Helpers ---
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

  // 0-1 Interactive Tile Array Drag Engine (Pointer Events)
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

  // --- 0-2 Interactive Venn Diagram Helpers & Pointer Engine ---
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
      const radius = 85;
      const offset = 65;
      const cAx = cx - offset;
      const cAy = cy;
      const cBx = cx + offset;
      const cBy = cy;
      const trayY = cy + 120;
      const spacing = 42;
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
        return { x: geom.cx - 95, y: geom.cy + yOff };
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
        return { x: geom.cx + 95, y: geom.cy + yOff };
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
        if (Math.hypot(mx - pos.x, my - pos.y) < 22) {
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
          if (Math.hypot(mx - pos.x, my - pos.y) < 22) {
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
          // Explanatory hint for incorrect placement
          if (card.target === 'both') {
            simState.vennHintMsg = `💡 [힌트] ${card.num}은(는) 12와 18의 공통 약수예요! 가운데 교집합 영역에 넣어보세요.`;
          } else if (card.num === 4 || card.num === 12) {
            simState.vennHintMsg = `⚠️ [주의] ${card.num}은(는) 12의 약수이지만 18의 약수는 아니에요 (18 ÷ ${card.num} 나누어떨어지지 않음).`;
          } else if (card.num === 9 || card.num === 18) {
            simState.vennHintMsg = `⚠️ [주의] ${card.num}은(는) 18의 약수이지만 12의 약수는 아니에요 (12 ÷ ${card.num} 나누어떨어지지 않음).`;
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

  // --- 0-3 Interactive Number Line Jump Helpers & Pointer Engine ---
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
      const jumperAy = cy - 24;
      const jumperBy = cy + 24;
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

      if (distA < 26) {
        simState.isDraggingJumperA = true;
        simState.isDraggingJumperB = false;
        container.style.cursor = 'grabbing';
        try { container.setPointerCapture(e.pointerId); } catch(err){}
        e.preventDefault();
      } else if (distB < 26) {
        simState.isDraggingJumperB = true;
        simState.isDraggingJumperA = false;
        container.style.cursor = 'grabbing';
        try { container.setPointerCapture(e.pointerId); } catch(err){}
        e.preventDefault();
      } else {
        if (Math.abs(my - geom.cy) < 40 && mx >= geom.startX - 15 && mx <= geom.width - geom.padX + 15) {
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
        const v = (mx - geom.startX) / geom.stepX;
        const snapped = Math.max(0, Math.min(24, Math.round(v / 4) * 4));
        if (snapped !== simState.jumpPosA) {
          simState.jumpPosA = snapped;
          checkLcmArrival();
          updateJumpControllerUI();
          renderLcmJumpCanvas(two, 4, 6);
        }
      } else if (simState.isDraggingJumperB) {
        const v = (mx - geom.startX) / geom.stepX;
        const snapped = Math.max(0, Math.min(24, Math.round(v / 6) * 6));
        if (snapped !== simState.jumpPosB) {
          simState.jumpPosB = snapped;
          checkLcmArrival();
          updateJumpControllerUI();
          renderLcmJumpCanvas(two, 4, 6);
        }
      } else {
        const distA = Math.hypot(mx - geom.jumperAx, my - geom.jumperAy);
        const distB = Math.hypot(mx - geom.jumperBx, my - geom.jumperBy);
        if (distA < 26 || distB < 26) {
          container.style.cursor = 'grab';
        } else if (Math.abs(my - geom.cy) < 30 && mx >= geom.startX && mx <= geom.width - geom.padX) {
          container.style.cursor = 'pointer';
        } else {
          container.style.cursor = 'default';
        }
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

  window.setSieveStep = function(step) {
    simState.sieveStep = step;
    if (window.currentTwo && state.subStep === '1-2') {
      renderSieveCanvas(window.currentTwo, step);
    }
  };

  window.toggleCalendarDate = function(day) {
    if (simState.calendarSelected.has(day)) {
      simState.calendarSelected.delete(day);
    } else {
      simState.calendarSelected.add(day);
    }
    const countSpan = document.getElementById('cal-selected-count');
    if (countSpan) countSpan.innerText = `${simState.calendarSelected.size}개`;
    if (window.currentTwo && state.subStep === '5-1') {
      renderCalendarCanvas(window.currentTwo);
    }
  };

  window.runCodingAlgo = function() {
    const input = document.getElementById('algo-input-val');
    const val = parseInt(input ? input.value : '115') || 115;
    simState.algoNum = val;
    simState.algoRunning = true;

    let isPrime = true;
    if (val < 2) isPrime = false;
    else {
      for (let i = 2; i * i <= val; i++) {
        if (val % i === 0) { isPrime = false; break; }
      }
    }

    const resBox = document.getElementById('algo-result-box');
    if (resBox) {
      resBox.style.display = 'block';
      resBox.innerHTML = `💻 실행 결과: <b>${val}</b>은(는) <b>${isPrime ? '소수' : '합성수'}</b>입니다!`;
    }

    if (window.currentTwo && state.subStep === '4-10') {
      renderAlgoCanvas(window.currentTwo, val, isPrime);
    }
  };

  window.toggleGearRotation = function() {
    simState.isGearRotating = !simState.isGearRotating;
    const btn = document.getElementById('gear-rot-btn');
    if (btn) btn.innerText = simState.isGearRotating ? '⏹ 회전 정지' : '▶ 톱니 회전 시작';

    if (simState.isGearRotating) {
      function anim() {
        if (!simState.isGearRotating) return;
        simState.gearAngle += 0.03;
        if (window.currentTwo && state.subStep === '4-2') {
          renderGearsCanvas(window.currentTwo, simState.gearAngle);
        }
        requestAnimationFrame(anim);
      }
      requestAnimationFrame(anim);
    }
  };

  // ==========================================
  // Simulator Dispatcher for 57 Substeps
  // ==========================================
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
                <span style="font-weight:800; color:#0284c7; font-size:0.9rem;">🧱 타일 직사각형 탐구:</span>
                <span style="font-size:0.8rem; color:#64748b;">(모서리 ⤢ 드래그 또는 버튼 조절)</span>
              </div>
              <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                <div style="display:inline-flex; border:1px solid #cbd5e1; border-radius:6px; overflow:hidden;">
                  <button class="btn" style="padding:3px 8px; font-size:0.78rem; background:#f8fafc; border-right:1px solid #cbd5e1;" onclick="changeTileDim(-1, 0)" title="세로 1칸 줄이기">세로 -</button>
                  <button class="btn" style="padding:3px 8px; font-size:0.78rem; background:#f8fafc;" onclick="changeTileDim(1, 0)" title="세로 1칸 늘리기">세로 +</button>
                </div>
                <div style="display:inline-flex; border:1px solid #cbd5e1; border-radius:6px; overflow:hidden;">
                  <button class="btn" style="padding:3px 8px; font-size:0.78rem; background:#f8fafc; border-right:1px solid #cbd5e1;" onclick="changeTileDim(0, -1)" title="가로 1칸 줄이기">가로 -</button>
                  <button class="btn" style="padding:3px 8px; font-size:0.78rem; background:#f8fafc;" onclick="changeTileDim(0, 1)" title="가로 1칸 늘리기">가로 +</button>
                </div>
                <div style="display:flex; gap:4px;">
                  <button class="btn" style="padding:3px 7px; background:#e0f2fe; color:#0369a1; font-weight:700; font-size:0.78rem;" onclick="setTileArray(1, 12)">1×12</button>
                  <button class="btn" style="padding:3px 7px; background:#e0f2fe; color:#0369a1; font-weight:700; font-size:0.78rem;" onclick="setTileArray(2, 6)">2×6</button>
                  <button class="btn" style="padding:3px 7px; background:#e0f2fe; color:#0369a1; font-weight:700; font-size:0.78rem;" onclick="setTileArray(3, 4)">3×4</button>
                </div>
              </div>
              <span id="tile-array-badge" style="background:#f0fdf4; color:#166534; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.8rem; border:1px solid #86efac;">
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
                <span style="font-weight:800; color:#0284c7; font-size:0.9rem;">⭕ 공약수 벤다이어그램 탐구:</span>
                <span style="font-size:0.8rem; color:#64748b;">(아래 수 카드를 드래그하여 알맞은 원 안으로 넣어보세요)</span>
              </div>
              <div style="display:flex; align-items:center; gap:6px;">
                <button class="btn" style="padding:3px 8px; font-size:0.78rem; background:#f1f5f9;" onclick="resetVennCards()">🔄 카드 초기화</button>
                <button class="btn" style="padding:3px 8px; font-size:0.78rem; background:#e0f2fe; color:#0369a1; font-weight:700;" onclick="autoPlaceVennCards()">💡 자동 완성</button>
                <span id="venn-progress-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.8rem; border:1px solid #bfdbfe;">
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
                <button class="btn" style="padding:4px 10px; font-size:0.82rem; background:#e0f2fe; color:#0369a1; font-weight:800; border:1px solid #7dd3fc;" onclick="stepJumperA(4)">🐰 4 도약 (+4)</button>
                <button class="btn" style="padding:4px 10px; font-size:0.82rem; background:#ffedd5; color:#c2410c; font-weight:800; border:1px solid #fdba74;" onclick="stepJumperB(6)">🐸 6 도약 (+6)</button>
                <button class="btn" style="padding:4px 8px; font-size:0.78rem; background:#f1f5f9; color:#475569;" onclick="resetJumpers()">🔄 초기화</button>
                <button class="btn" style="padding:4px 8px; font-size:0.78rem; background:#fef3c7; color:#b45309; font-weight:700;" onclick="autoDemoJumps()">💡 12 발견 시연</button>
              </div>
              <span id="jump-progress-badge" style="background:#f8fafc; color:#475569; font-weight:800; padding:4px 12px; border-radius:12px; font-size:0.8rem; border:1px solid #e2e8f0;">
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
              <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">⚖️ 자연수 약수 개수 분류 저울:</span>
              <span style="background:#f1f5f9; color:#475569; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                1개: 1 / 2개: 소수 / 3개 이상: 합성수
              </span>
            </div>
          `;
        }
        renderClassifyCanvas(two, 2);
        break;

      // ----------------------------------------
      // Tab 1: 소수와 합성수 (1-1 ~ 1-9)
      // ----------------------------------------
      case '1-1':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">🏷️ 소수(약수 2개) vs 합성수(약수 3개 이상):</span>
              <span style="background:#fee2e2; color:#991b1b; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                1은 소수도 아니고 합성수도 아닙니다!
              </span>
            </div>
          `;
        }
        renderPrimeBoxesCanvas(two);
        break;

      case '1-2':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">🔬 에라토스테네스의 체 단계별 실행:</span>
              <div style="display:flex; gap:4px; flex-wrap:wrap;">
                <button class="btn" style="background:#f1f5f9; font-weight:700; font-size:0.8rem;" onclick="setSieveStep(1)">1: 1 지우기</button>
                <button class="btn" style="background:#f1f5f9; font-weight:700; font-size:0.8rem;" onclick="setSieveStep(2)">2: 2의 배수</button>
                <button class="btn" style="background:#f1f5f9; font-weight:700; font-size:0.8rem;" onclick="setSieveStep(3)">3: 3의 배수</button>
                <button class="btn" style="background:#f1f5f9; font-weight:700; font-size:0.8rem;" onclick="setSieveStep(4)">4: 5의 배수</button>
                <button class="btn" style="background:#f1f5f9; font-weight:700; font-size:0.8rem;" onclick="setSieveStep(5)">5: 7의 배수</button>
                <button class="btn" style="background:#e0f2fe; color:#0369a1; font-weight:800; font-size:0.8rem;" onclick="setSieveStep(6)">6: 소수 15개 완성</button>
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
              <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">📄 거듭제곱과 밑·지수 시각화:</span>
              <span style="background:#eff6ff; color:#1e40af; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                밑(Base): 곱하는 수 / 지수(Exponent): 곱한 횟수
              </span>
            </div>
          `;
        }
        renderPowerCanvas(two, 2, 4);
        break;

      case '1-4':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">🔍 수 카드 판별기: 8, 17, 39, 53 소수/합성수 분류</span>
          `;
        }
        renderPrimeCardCheckCanvas(two, [8, 17, 39, 53]);
        break;

      case '1-5':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">🌿 거듭제곱 표현 변환 다이어그램</span>
          `;
        }
        renderPowerTreeCanvas(two, "5⁴ / 2·3²·5 / 3²·7⁵");
        break;

      case '1-6':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">⚖️ 명제 진위 판정 O/X 보드</span>
          `;
        }
        renderTruthBoardCanvas(two);
        break;

      case '1-7':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">🦠 10분마다 2배씩 늘어나는 세균 배가 증식 시뮬레이터</span>
          `;
        }
        renderBacteriaGraphCanvas(two, 60);
        break;

      case '1-8':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">📐 지수 방정식 눈금 비교기 (2^a=64, (1/3)^b=1/27)</span>
          `;
        }
        renderExponentEquationCanvas(two);
        break;

      case '1-9':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">🚂 1부터 30까지 역 열차 승객 하차 시뮬레이터:</span>
              <span style="background:#fef3c7; color:#92400e; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                약수의 개수만큼 승객이 하차합니다!
              </span>
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
              <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">🧩 12의 소인수 블록 분해기:</span>
              <span style="background:#f0fdf4; color:#166534; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                소수인 약수: 2, 3
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
              <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">🌳 소인수분해 가지치기 분기도(Tree):</span>
              <span style="background:#eff6ff; color:#1e40af; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                끝마디가 모두 소수가 될 때까지 분해!
              </span>
            </div>
          `;
        }
        renderFactorTreeCanvas(two, 36);
        break;

      case '2-3':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">🧱 거듭제곱 꼴 소인수 조립기:</span>
              <span style="background:#f1f5f9; color:#475569; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                27=3³, 36=2²·3², 80=2⁴·5
              </span>
            </div>
          `;
        }
        renderPrimeFactorTilesCanvas(two);
        break;

      case '2-4':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">🏷️ 소인수 추출기 (15, 22, 49, 70)</span>
          `;
        }
        renderPrimeFactorTagsCanvas(two, 70, [2, 5, 7]);
        break;

      case '2-5':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">➗ 세로 나눗셈 소인수분해 계산기 (34, 75, 96, 120)</span>
          `;
        }
        renderVerticalDivisionCanvas(two, 120);
        break;

      case '2-6':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">📊 연속 곱 2×3×4×5×6 소인수 2 지수 분해 막대</span>
          `;
        }
        renderContinuousProductCanvas(two);
        break;

      case '2-7':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">⚖️ 지수 짝수 맞추기 제곱수 만들기 (56 = 2³·7 ➔ ×14)</span>
          `;
        }
        renderSquareMakeCanvas(two, 56, 14);
        break;

      case '2-8':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">🔎 선우·은서 조건 만족 수 탐색기 (소인수 2개, 합 18)</span>
          `;
        }
        renderConditionFilterCanvas(two);
        break;

      case '2-9':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">📐 2차원 약수 곱셈 격자표 & 개수 공식:</span>
              <span style="background:#f0fdf4; color:#166534; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
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
              <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">🟦 정사각형 타일 바닥 채우기 (서로소 탐색):</span>
              <span style="background:#eff6ff; color:#1e40af; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                공약수가 1뿐인 관계: 서로소
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
              <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">⚖️ 공통 소인수 지수 비교 저울 (최대공약수):</span>
              <span style="background:#fef3c7; color:#92400e; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                지수가 작거나 같은 것을 택하여 곱합니다!
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
              <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">🔢 세 수 세로셈 소인수 정렬기:</span>
              <span style="background:#f1f5f9; color:#475569; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                60, 72, 150 ➔ 세로 정렬 공통 소인수 곱
              </span>
            </div>
          `;
        }
        renderThreeNumGcdCanvas(two);
        break;

      case '3-4':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">⚖️ 두 수 최대공약수 비교판 (2·7² & 2²·3²·7 / 84 & 150)</span>
          `;
        }
        renderGcdPairCompareCanvas(two, 84, 150);
        break;

      case '3-5':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">🔢 세 수 최대공약수 세로 정렬판 (52, 65, 91)</span>
          `;
        }
        renderThreeNumGcdCanvas(two);
        break;

      case '3-6':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">📏 20~30 수직선 중 15(=3·5)와 서로소 체질기</span>
          `;
        }
        renderCoprimeLineCanvas(two);
        break;

      case '3-7':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">⚖️ 지수 미지수 100 일치 저울 (2^a·5³·7 & 2³·3·5^b)</span>
          `;
        }
        renderGcdBalanceCanvas(two, 100, 100);
        break;

      case '3-8':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">📐 105/□, 350/□ 분수 약분 시각화 저울</span>
          `;
        }
        renderFractionReduceCanvas(two, 105, 350);
        break;

      case '3-9':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">📦 나머지 보정 큐브 모델 (107-2, 153-3, 90)</span>
          `;
        }
        renderRemainderGcdCanvas(two);
        break;

      case '3-10':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">🕸️ 21과의 최대공약수 7인 수 관계망:</span>
              <span style="background:#f0fdf4; color:#166534; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                7 × k (k는 3과 서로소) ➔ 14, 28, 35, 49
              </span>
            </div>
          `;
        }
        renderGcdRelationsCanvas(two);
        break;

      // ----------------------------------------
      // Tab 4: 최소공배수 (4-1 ~ 4-10)
      // ----------------------------------------
      case '4-1':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">⚽ 동시 개최 주기 회전 시뮬레이터:</span>
              <span style="background:#eff6ff; color:#1e40af; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                4년 주기 & 3년 주기 ➔ 최소공배수 12년
              </span>
            </div>
          `;
        }
        renderLcmBalanceCanvas(two, 4, 3);
        break;

      case '4-2':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">⚙️ 맞물린 톱니바퀴 (24개, 36개) 회전 시뮬레이터:</span>
              <button id="gear-rot-btn" class="btn" style="background:#0284c7; color:#ffffff; font-weight:800; font-size:0.82rem;" onclick="toggleGearRotation()">
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
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">📏 두 수 최소공배수 수직선 (3²·11 & 3·5·11 / 21 & 27)</span>
          `;
        }
        renderLcmBalanceCanvas(two, 21, 27);
        break;

      case '4-4':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">📊 세 수 거듭제곱 지수 확장기 (6, 42, 63)</span>
          `;
        }
        renderLcmMultiCanvas(two, 6, 42, 63);
        break;

      case '4-5':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">⚖️ 분수 통분 배수 저울 (1/70, 1/98 ➔ 최소공배수 490)</span>
          `;
        }
        renderFractionLcmCanvas(two, 70, 98);
        break;

      case '4-6':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">⚖️ 공통 배수 미지수 A 저울 (3A, 4A, 5A ➔ LCM 360)</span>
          `;
        }
        renderVariableLcmCanvas(two);
        break;

      case '4-7':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">🧩 지수 조합 매트릭스 (□·5³ ➔ 가능한 수들)</span>
          `;
        }
        renderLcmMultiCanvas(two, 75, 250, 500);
        break;

      case '4-8':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">🏃 18과 45의 세 자리 공배수 도약기 (LCM 90 ➔ 180)</span>
          `;
        }
        renderThreeDigitLcmCanvas(two, 90);
        break;

      case '4-9':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">⚖️ 합 44, GCD 4, LCM 72 관계형 천칭:</span>
              <span style="background:#fef3c7; color:#92400e; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                두 수: 8과 36
              </span>
            </div>
          `;
        }
        renderSumGcdLcmCanvas(two, 44, 4, 72);
        break;

      case '4-10':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">💻 알지오매스 소수 판별 코딩 러너:</span>
              <div style="display:flex; align-items:center; gap:6px;">
                <input type="number" id="algo-input-val" class="form-control" style="width:90px; padding:4px 8px; font-weight:700;" value="${simState.algoNum}">
                <button class="btn btn-primary" style="padding:4px 12px; font-weight:800; font-size:0.82rem;" onclick="runCodingAlgo()">알고리즘 실행</button>
              </div>
              <div id="algo-result-box" style="display:none; background:#eff6ff; color:#1e40af; padding:4px 10px; border-radius:6px; font-size:0.82rem; font-weight:800;"></div>
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
              <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">📅 달력 속 31일까지의 날짜 중 소수 탐색:</span>
              <span style="background:#f0fdf4; color:#166534; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
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
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">⚖️ 4가지 명제 검증 보드 (ㄱ, ㄴ, ㄷ, ㄹ)</span>
          `;
        }
        renderTruthBoardCanvas(two);
        break;

      case '5-3':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">🔄 일의 자리 주기 원환 회전 휠 (3의 거듭제곱: 3-9-7-1 / 5: 5)</span>
          `;
        }
        renderCycleWheelCanvas(two, 3, 13);
        break;

      case '5-4':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">🌳 330의 소인수분해 나무 (330 = 2 × 3 × 5 × 11)</span>
          `;
        }
        renderFactorTreeCanvas(two, 330);
        break;

      case '5-5':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">⚖️ 나눗셈 제곱수 소거 저울 (84 ÷ 21 = 4 = 2²)</span>
          `;
        }
        renderSquareMakeCanvas(two, 84, 21);
        break;

      case '5-6':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">⭕ 서로소 판정 벤다이어그램 (35와 2·3²)</span>
          `;
        }
        renderVennCanvas(two, 35, 18);
        break;

      case '5-7':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">🧱 두 수 소인수분해 지수 비교 블록</span>
          `;
        }
        renderGcdBalanceCanvas(two, 120, 84);
        break;

      case '5-8':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">⚖️ 두 수의 곱 = GCD × LCM 저울 (A × 36 = 12 × 180)</span>
          `;
        }
        renderGcdRelationsCanvas(two);
        break;

      case '5-9':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">📊 비 3:7, LCM 420인 두 수의 비율 막대</span>
          `;
        }
        renderVariableLcmCanvas(two);
        break;

      case '5-10':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">🔗 세 분수 곱셈 연쇄 체인 (9/5, 36/7, 15/14 ➔ 70/3)</span>
          `;
        }
        renderFractionScaleCanvas(two);
        break;

      case '5-11':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">📝 11번 서술형: 126의 최대 소인수 7, 45의 최소 소인수 3</span>
          `;
        }
        renderProofStepCanvas(two);
        break;

      case '5-12':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">📝 12번 서술형: 1부터 12까지의 연속 곱 소인수분해</span>
          `;
        }
        renderContinuousProductCanvas(two);
        break;

      case '5-13':
        if (simController) {
          simController.innerHTML = `
            <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">📝 13번 서술형: 세 수 72, 60, A의 최대공약수 6 조건</span>
          `;
        }
        renderThreeNumGcdCanvas(two);
        break;

      case '5-14':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">🌲 14번 서술형: 최대공약수 / 최소공배수 연결 트리</span>
              <span style="background:#fef3c7; color:#92400e; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                A=36, B=18, C=108 ➔ A+B+C = 162
              </span>
            </div>
          `;
        }
        renderGcdLcmConnectCanvas(two);
        break;

      // ----------------------------------------
      // Tab 6: 창의융합 프로젝트 (6-1)
      // ----------------------------------------
      case '6-1':
        if (simController) {
          simController.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">🎨 몬드리안 직사각형 분할 실험실:</span>
              <span style="background:#eff6ff; color:#1e40af; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
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
  // Detailed Two.js Rendering Functions
  // ==========================================

  function renderTileArrayCanvas(two, r, c) {
    if (!two) return;
    two.clear();

    const cx = two.width / 2;
    const cy = two.height / 2 + 16;
    const maxDim = Math.max(r, c, 6);
    const size = Math.max(22, Math.min(36, Math.floor(250 / maxDim)));
    const startX = cx - (c * size) / 2;
    const startY = cy - (r * size) / 2;
    const totalCells = r * c;
    const isExact12 = (totalCells === 12);

    // 1. Top Collection Bar: 6 factor pairs of 12
    const allPairs = [
      { key: '1x12', label: '1 × 12' },
      { key: '2x6', label: '2 × 6' },
      { key: '3x4', label: '3 × 4' },
      { key: '4x3', label: '4 × 3' },
      { key: '6x2', label: '6 × 2' },
      { key: '12x1', label: '12 × 1' }
    ];

    const topY = 28;
    const headerTitle = two.makeText("🏆 12개 타일로 만들 수 있는 직사각형 모양 수집기 (약수 탐구)", cx, topY - 14);
    headerTitle.size = 11; headerTitle.weight = 800; headerTitle.fill = '#475569';

    const pillW = 48;
    const pillH = 20;
    const totalPillsW = allPairs.length * (pillW + 6) - 6;
    const pillStartX = cx - totalPillsW / 2 + pillW / 2;

    allPairs.forEach((pair, idx) => {
      const px = pillStartX + idx * (pillW + 6);
      const isFound = simState.foundTileFactors.has(pair.key);
      const pill = two.makeRoundedRectangle(px, topY + 8, pillW, pillH, 6);
      if (isFound) {
        pill.fill = '#ecfdf5';
        pill.stroke = '#10b981';
        pill.linewidth = 1.5;
        const t = two.makeText(pair.label, px, topY + 8);
        t.size = 10; t.weight = 800; t.fill = '#065f46';
      } else {
        pill.fill = '#f8fafc';
        pill.stroke = '#cbd5e1';
        pill.linewidth = 1;
        const t = two.makeText("? × ?", px, topY + 8);
        t.size = 10; t.weight = 600; t.fill = '#94a3b8';
      }
    });

    // 2. Faint workspace guide grid background
    const bgW = Math.max(c * size + 40, 240);
    const bgH = Math.max(r * size + 40, 180);
    const bgBox = two.makeRoundedRectangle(cx, cy, bgW, bgH, 12);
    bgBox.fill = '#f8fafc';
    bgBox.stroke = '#e2e8f0';
    bgBox.linewidth = 1.5;

    // 3. Dimension indicators (Top: Width, Left: Height)
    const dimTopY = startY - 14;
    const topArrow = two.makeLine(startX, dimTopY, startX + c * size, dimTopY);
    topArrow.stroke = '#0284c7'; topArrow.linewidth = 1.5;
    two.makeLine(startX, dimTopY - 4, startX, dimTopY + 4).stroke = '#0284c7';
    two.makeLine(startX + c * size, dimTopY - 4, startX + c * size, dimTopY + 4).stroke = '#0284c7';
    const topLabel = two.makeText(`가로 ${c}칸`, cx, dimTopY - 9);
    topLabel.size = 11; topLabel.weight = 800; topLabel.fill = '#0284c7';

    const dimLeftX = startX - 16;
    const leftArrow = two.makeLine(dimLeftX, startY, dimLeftX, startY + r * size);
    leftArrow.stroke = '#0284c7'; leftArrow.linewidth = 1.5;
    two.makeLine(dimLeftX - 4, startY, dimLeftX + 4, startY).stroke = '#0284c7';
    two.makeLine(dimLeftX - 4, startY + r * size, dimLeftX + 4, startY + r * size).stroke = '#0284c7';
    const leftLabel = two.makeText(`세로 ${r}칸`, dimLeftX - 16, cy);
    leftLabel.size = 11; leftLabel.weight = 800; leftLabel.fill = '#0284c7';
    leftLabel.rotation = -Math.PI / 2;

    // 4. Render Grid Cells & Tiles
    for (let i = 0; i < r; i++) {
      for (let j = 0; j < c; j++) {
        const cellNum = i * c + j + 1;
        const tx = startX + j * size + size / 2;
        const ty = startY + i * size + size / 2;

        if (cellNum <= 12) {
          // Real tile of the 12
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
          numT.size = Math.max(10, Math.floor(size * 0.42));
          numT.weight = 800;
          numT.fill = '#ffffff';
        } else {
          // Empty excess cell (red dotted)
          const emptyCell = two.makeRoundedRectangle(tx, ty, size - 3, size - 3, 4);
          emptyCell.fill = 'rgba(239, 68, 68, 0.08)';
          emptyCell.stroke = '#f87171';
          emptyCell.linewidth = 1.5;
          const warnT = two.makeText("빈칸", tx, ty);
          warnT.size = Math.max(9, Math.floor(size * 0.35));
          warnT.weight = 700;
          warnT.fill = '#ef4444';
        }
      }
    }

    // 5. Interactive Corner Drag Handle at bottom-right
    const handleX = startX + c * size;
    const handleY = startY + r * size;

    // Pulsing aura circle
    const aura = two.makeCircle(handleX, handleY, 20);
    aura.fill = 'rgba(99, 102, 241, 0.22)';
    aura.noStroke();

    // Solid inner handle
    const handleCircle = two.makeCircle(handleX, handleY, 12);
    handleCircle.fill = '#4f46e5';
    handleCircle.stroke = '#ffffff';
    handleCircle.linewidth = 2.5;

    // Resize arrows icon
    const icon = two.makeText("⤢", handleX, handleY);
    icon.size = 12; icon.weight = 800; icon.fill = '#ffffff';

    // 6. Bottom Status & Discovery Feedback
    const botY = cy + (r * size) / 2 + 28;

    if (isExact12) {
      const banner = two.makeRoundedRectangle(cx, botY, 320, 28, 14);
      banner.fill = '#f0fdf4';
      banner.stroke = '#22c55e';
      banner.linewidth = 2;

      const t = two.makeText(`🎉 [직사각형 완성!] ${r} × ${c} = 12 ➔ 12의 약수: ${r}, ${c}`, cx, botY);
      t.size = 12; t.weight = 800; t.fill = '#15803d';
    } else if (totalCells < 12) {
      const banner = two.makeRoundedRectangle(cx, botY, 300, 26, 13);
      banner.fill = '#fffbeb';
      banner.stroke = '#f59e0b';
      banner.linewidth = 1.5;

      const t = two.makeText(`⚠️ 현재 ${totalCells}칸: 12개 중 ${12 - totalCells}개 타일이 덜 채워짐`, cx, botY);
      t.size = 11; t.weight = 700; t.fill = '#b45309';
    } else {
      const banner = two.makeRoundedRectangle(cx, botY, 320, 26, 13);
      banner.fill = '#fef2f2';
      banner.stroke = '#ef4444';
      banner.linewidth = 1.5;

      const t = two.makeText(`⚠️ 현재 ${totalCells}칸: 12개 타일 초과로 ${totalCells - 12}칸이 비어있음`, cx, botY);
      t.size = 11; t.weight = 700; t.fill = '#b91c1c';
    }

    // Helper text
    const guideT = two.makeText("🖐️ 우하단 보라색 모서리 핸들을 잡고 드래그하여 직사각형을 완성해보세요!", cx, botY + 24);
    guideT.size = 10; guideT.weight = 600; guideT.fill = '#64748b';

    two.update();
  }

  function renderVennCanvas(two, nA, nB) {
    if (!two) return;
    two.clear();

    const cx = two.width / 2;
    const cy = two.height / 2 - 20;
    const radius = 85;
    const offset = 65;
    const cAx = cx - offset;
    const cAy = cy;
    const cBx = cx + offset;
    const cBy = cy;

    // 1. Venn Circles
    const c1 = two.makeCircle(cAx, cAy, radius);
    c1.fill = 'rgba(59, 130, 246, 0.18)';
    c1.stroke = '#2563eb';
    c1.linewidth = 2.5;

    const c2 = two.makeCircle(cBx, cBy, radius);
    c2.fill = 'rgba(244, 63, 94, 0.18)';
    c2.stroke = '#e11d48';
    c2.linewidth = 2.5;

    // Region Labels
    const tA = two.makeText(`${nA}의 약수`, cAx - 35, cAy - radius - 14);
    tA.fill = '#1d4ed8'; tA.weight = 800; tA.size = 13;

    const tB = two.makeText(`${nB}의 약수`, cBx + 35, cBy - radius - 14);
    tB.fill = '#be123c'; tB.weight = 800; tB.size = 13;

    const tBoth = two.makeText("공약수 (A ∩ B)", cx, cAy - radius - 14);
    tBoth.fill = '#7c3aed'; tBoth.weight = 800; tBoth.size = 13;

    // Subtle drop targets indicator if empty
    const onlyACount = simState.vennCards.filter(c => c.currentArea === 'onlyA').length;
    if (onlyACount === 0) {
      const gA = two.makeText("여기에 12만의 약수 배치", cAx - 20, cAy);
      gA.size = 10; gA.fill = '#94a3b8'; gA.weight = 600;
    }
    const onlyBCount = simState.vennCards.filter(c => c.currentArea === 'onlyB').length;
    if (onlyBCount === 0) {
      const gB = two.makeText("여기에 18만의 약수 배치", cBx + 20, cAy);
      gB.size = 10; gB.fill = '#94a3b8'; gB.weight = 600;
    }
    const bothCount = simState.vennCards.filter(c => c.currentArea === 'both').length;
    if (bothCount === 0) {
      const gBoth = two.makeText("공통 약수", cx, cy);
      gBoth.size = 10; gBoth.fill = '#a855f7'; gBoth.weight = 700;
    }

    // 2. Tray Box at Bottom
    const trayY = cy + 120;
    const trayBox = two.makeRoundedRectangle(cx, trayY, 390, 48, 10);
    trayBox.fill = '#f8fafc';
    trayBox.stroke = '#cbd5e1';
    trayBox.linewidth = 1.5;

    const trayLabel = two.makeText("📦 수 카드 보관함 (마우스/터치로 원 안으로 끌어다 놓으세요)", cx, trayY - 30);
    trayLabel.size = 10; trayLabel.fill = '#64748b'; trayLabel.weight = 700;

    // 3. Render Cards
    const spacing = 42;
    const trayStartX = cx - (8 * spacing) / 2 + spacing / 2;

    simState.vennCards.forEach((card, i) => {
      // If currently dragging this card, skip drawing in static slot
      if (simState.activeVennDragIndex === i) return;

      let px = trayStartX + i * spacing;
      let py = trayY;

      if (card.currentArea === 'onlyA') {
        const aCards = simState.vennCards.filter(c => c.currentArea === 'onlyA');
        const posIdx = aCards.indexOf(card);
        px = cx - 95;
        py = cy + ((posIdx === 0) ? -26 : 25);
      } else if (card.currentArea === 'both') {
        const bothCards = simState.vennCards.filter(c => c.currentArea === 'both');
        const posIdx = bothCards.indexOf(card);
        const ySlots = [-45, -15, 15, 45];
        px = cx;
        py = cy + (ySlots[posIdx] || 0);
      } else if (card.currentArea === 'onlyB') {
        const bCards = simState.vennCards.filter(c => c.currentArea === 'onlyB');
        const posIdx = bCards.indexOf(card);
        px = cx + 95;
        py = cy + ((posIdx === 0) ? -26 : 25);
      }

      // Draw Card Tile
      const cardBox = two.makeRoundedRectangle(px, py, 32, 32, 6);
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
      txt.size = 13; txt.weight = 800;
      txt.fill = (card.currentArea === 'both') ? '#6b21a8' : (card.currentArea === 'onlyA' ? '#1e40af' : (card.currentArea === 'onlyB' ? '#9f1239' : '#1e293b'));

      // If all 8 cards placed and this card is 6 (GCD), crown it!
      const totalPlaced = simState.vennCards.filter(c => c.currentArea === c.target).length;
      if (totalPlaced === 8 && card.num === 6 && card.currentArea === 'both') {
        cardBox.fill = '#fef08a';
        cardBox.stroke = '#eab308';
        cardBox.linewidth = 2.5;
        const crown = two.makeText("👑", px, py - 20);
        crown.size = 14;
      }
    });

    // 4. Render Active Dragging Card
    if (simState.activeVennDragIndex >= 0) {
      const card = simState.vennCards[simState.activeVennDragIndex];
      const dx = simState.vennDragPos.x;
      const dy = simState.vennDragPos.y;

      const shadow = two.makeRoundedRectangle(dx + 3, dy + 3, 38, 38, 8);
      shadow.fill = 'rgba(0,0,0,0.15)'; shadow.noStroke();

      const dragCard = two.makeRoundedRectangle(dx, dy, 36, 36, 8);
      dragCard.fill = '#ffffff';
      dragCard.stroke = '#4f46e5';
      dragCard.linewidth = 2.5;

      const dragTxt = two.makeText(String(card.num), dx, dy);
      dragTxt.size = 15; dragTxt.weight = 800; dragTxt.fill = '#4338ca';
    }

    // 5. Dynamic Discovery & Feedback Banner
    const totalPlaced = simState.vennCards.filter(c => c.currentArea === c.target).length;
    const bannerY = cy + 62;

    if (totalPlaced === 8) {
      const banner = two.makeRoundedRectangle(cx, bannerY, 390, 28, 14);
      banner.fill = '#f0fdf4';
      banner.stroke = '#22c55e';
      banner.linewidth = 2;

      const t = two.makeText("🎉 [분류 완료!] 공약수: 1, 2, 3, 6 ➔ 최대공약수 = 6 👑", cx, bannerY);
      t.size = 12; t.weight = 800; t.fill = '#15803d';
    } else if (simState.vennHintMsg) {
      const banner = two.makeRoundedRectangle(cx, bannerY, 390, 26, 13);
      banner.fill = '#fffbeb';
      banner.stroke = '#f59e0b';
      banner.linewidth = 1.5;

      const t = two.makeText(simState.vennHintMsg, cx, bannerY);
      t.size = 10.5; t.weight = 700; t.fill = '#b45309';
    }

    two.update();
  }

  function renderLcmJumpCanvas(two, a = 4, b = 6) {
    two.clear();
    const width = two.width, height = two.height;
    const maxVal = 24;
    const padX = 55;
    const stepX = (width - padX * 2) / maxVal;
    const startX = padX;
    const endX = width - padX;
    const cy = height / 2;

    // Background decorative guide
    const bgCard = two.makeRoundedRectangle(width / 2, height / 2, width - 20, height - 20, 10);
    bgCard.fill = '#f8fafc';
    bgCard.stroke = '#e2e8f0';
    bgCard.linewidth = 1;

    // Header Legend on Canvas
    const legendA = two.makeText("🐰 4씩 도약 (토끼)", startX + 55, 24);
    legendA.size = 11.5; legendA.weight = 800; legendA.fill = '#0284c7';

    const legendB = two.makeText("🐸 6씩 도약 (개구리)", startX + 185, 24);
    legendB.size = 11.5; legendB.weight = 800; legendB.fill = '#ea580c';

    const hintTxt = two.makeText("💡 말을 마우스로 드래그하거나 도약 버튼을 눌러보세요", width - 150, 24);
    hintTxt.size = 10.5; hintTxt.fill = '#64748b'; hintTxt.alignment = 'right';

    // Highlight vertical bands for discovered common multiples (12, 24)
    [12, 24].forEach(cVal => {
      const cxPos = startX + cVal * stepX;
      const isReachedBoth = (simState.jumpPosA === cVal && simState.jumpPosB === cVal);
      const isDiscovered = simState.foundCommonMultiples.has(cVal);

      if (isReachedBoth || isDiscovered) {
        const band = two.makeRoundedRectangle(cxPos, cy, 26, height - 60, 6);
        band.fill = isReachedBoth ? 'rgba(16, 185, 129, 0.16)' : 'rgba(245, 158, 11, 0.08)';
        band.stroke = isReachedBoth ? '#10b981' : '#f59e0b';
        band.linewidth = isReachedBoth ? 2 : 1;
        band.dashes = isReachedBoth ? [] : [4, 4];
      }
    });

    // The Main Number Line
    const line = two.makeLine(startX - 15, cy, endX + 22, cy);
    line.stroke = '#334155'; line.linewidth = 2.5;

    // Arrowhead at right
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

    // Tick marks and Labels
    for (let i = 0; i <= maxVal; i++) {
      const x = startX + i * stepX;
      const isEven = (i % 2 === 0);
      const isMul4 = (i > 0 && i % 4 === 0);
      const isMul6 = (i > 0 && i % 6 === 0);
      const isCommon = (i > 0 && i % 12 === 0);

      const tickLen = isEven ? 6 : 3.5;
      const tick = two.makeLine(x, cy - tickLen, x, cy + tickLen);
      tick.stroke = isCommon ? '#10b981' : (isEven ? '#475569' : '#cbd5e1');
      tick.linewidth = isCommon ? 2.5 : (isEven ? 1.8 : 1);

      if (isEven) {
        const lbl = two.makeText(String(i), x, cy + 17);
        lbl.size = isCommon ? 12.5 : 11;
        lbl.weight = isCommon ? 900 : (isMul4 || isMul6 ? 700 : 500);
        lbl.fill = isCommon ? '#059669' : (isMul4 ? '#0284c7' : (isMul6 ? '#ea580c' : '#475569'));
      }
    }

    // Jump Arcs for A (Rabbit / 4)
    for (let k = 0; k < simState.jumpPosA; k += a) {
      const x1 = startX + k * stepX;
      const x2 = startX + (k + a) * stepX;
      const arcMidX = (x1 + x2) / 2;
      const arcMidY = cy - 38;
      const arc = two.makeCurve(x1, cy, arcMidX, arcMidY, x2, cy, true);
      arc.stroke = '#0284c7'; arc.linewidth = 2.5; arc.noFill();

      // +4 indicator at apex
      const plusA = two.makeText("+4", arcMidX, arcMidY - 7);
      plusA.size = 10; plusA.weight = 800; plusA.fill = '#0284c7';

      // Small baseline landing point
      const pDot = two.makeCircle(x2, cy, 3.5);
      pDot.fill = '#0284c7'; pDot.stroke = '#ffffff'; pDot.linewidth = 1;
    }

    // Jump Arcs for B (Frog / 6)
    for (let k = 0; k < simState.jumpPosB; k += b) {
      const x1 = startX + k * stepX;
      const x2 = startX + (k + b) * stepX;
      const arcMidX = (x1 + x2) / 2;
      const arcMidY = cy + 42;
      const arc = two.makeCurve(x1, cy, arcMidX, arcMidY, x2, cy, true);
      arc.stroke = '#ea580c'; arc.linewidth = 2.5; arc.noFill();

      // +6 indicator at apex
      const plusB = two.makeText("+6", arcMidX, arcMidY + 14);
      plusB.size = 10; plusB.weight = 800; plusB.fill = '#ea580c';

      // Small baseline landing point
      const pDot = two.makeCircle(x2, cy, 3.5);
      pDot.fill = '#ea580c'; pDot.stroke = '#ffffff'; pDot.linewidth = 1;
    }

    // Common Landing Celebration Effects (when both jumpers meet at same point > 0)
    if (simState.jumpPosA > 0 && simState.jumpPosA === simState.jumpPosB) {
      const cVal = simState.jumpPosA;
      const xMeet = startX + cVal * stepX;

      // Connecting energy beam between jumpers
      const beam = two.makeLine(xMeet, cy - 24, xMeet, cy + 24);
      beam.stroke = '#10b981'; beam.linewidth = 3.5;

      // Central landing beacon
      const beaconAura = two.makeCircle(xMeet, cy, 15);
      beaconAura.fill = 'rgba(16, 185, 129, 0.3)'; beaconAura.stroke = 'transparent';

      const beaconDot = two.makeCircle(xMeet, cy, 7);
      beaconDot.fill = '#10b981'; beaconDot.stroke = '#ffffff'; beaconDot.linewidth = 2;

      // Crown / Star celebration badge
      const isFirst = (cVal === 12);
      const crownBg = two.makeRoundedRectangle(xMeet, cy - 64, isFirst ? 180 : 130, 26, 13);
      crownBg.fill = '#fef3c7'; crownBg.stroke = '#f59e0b'; crownBg.linewidth = 1.5;

      const crownTxt = two.makeText(
        isFirst ? "👑 12 (첫 공배수 = 최소공배수!)" : "⭐ 24 (두 번째 공배수)",
        xMeet, cy - 64
      );
      crownTxt.size = 10.5; crownTxt.weight = 800; crownTxt.fill = '#92400e';
    }

    // Jumper A Token (Rabbit / 4)
    const curAx = startX + simState.jumpPosA * stepX;
    const curAy = cy - 24;

    // Guide line from jumper A to baseline
    const guideA = two.makeLine(curAx, curAy, curAx, cy);
    guideA.stroke = '#0284c7'; guideA.linewidth = 1.5; guideA.dashes = [3, 3];

    const auraA = two.makeCircle(curAx, curAy, 18);
    auraA.fill = 'rgba(2, 132, 199, 0.2)'; auraA.stroke = 'transparent';

    const tokenA = two.makeCircle(curAx, curAy, 12);
    tokenA.fill = '#0284c7'; tokenA.stroke = '#ffffff'; tokenA.linewidth = 2;

    const lblA = two.makeText("🐰", curAx, curAy - 1);
    lblA.size = 11;

    // Jumper B Token (Frog / 6)
    const curBx = startX + simState.jumpPosB * stepX;
    const curBy = cy + 24;

    // Guide line from jumper B to baseline
    const guideB = two.makeLine(curBx, curBy, curBx, cy);
    guideB.stroke = '#ea580c'; guideB.linewidth = 1.5; guideB.dashes = [3, 3];

    const auraB = two.makeCircle(curBx, curBy, 18);
    auraB.fill = 'rgba(234, 88, 12, 0.2)'; auraB.stroke = 'transparent';

    const tokenB = two.makeCircle(curBx, curBy, 12);
    tokenB.fill = '#ea580c'; tokenB.stroke = '#ffffff'; tokenB.linewidth = 2;

    const lblB = two.makeText("🐸", curBx, curBy - 1);
    lblB.size = 11;

    two.update();
  }

  function renderClassifyCanvas(two, selectedN) {
    const cx = two.width / 2;
    const cy = two.height / 2;

    const b1 = two.makeRoundedRectangle(cx - 130, cy, 100, 120, 8);
    b1.fill = '#f1f5f9'; b1.stroke = '#94a3b8'; b1.linewidth = 2;
    const t1 = two.makeText("약수 1개\n\n1", cx - 130, cy - 20);
    t1.weight = 800; t1.fill = '#475569';

    const b2 = two.makeRoundedRectangle(cx, cy, 100, 120, 8);
    b2.fill = '#eff6ff'; b2.stroke = '#3b82f6'; b2.linewidth = 2;
    const t2 = two.makeText("약수 2개\n(소수)\n2, 3, 5, 7...", cx, cy - 15);
    t2.weight = 800; t2.fill = '#1d4ed8';

    const b3 = two.makeRoundedRectangle(cx + 130, cy, 100, 120, 8);
    b3.fill = '#fef2f2'; b3.stroke = '#ef4444'; b3.linewidth = 2;
    const t3 = two.makeText("약수 3개 이상\n(합성수)\n4, 6, 8, 9...", cx + 130, cy - 15);
    t3.weight = 800; t3.fill = '#b91c1c';
  }

  function renderPrimeBoxesCanvas(two) {
    const cx = two.width / 2;
    const cy = two.height / 2;

    const r1 = two.makeRoundedRectangle(cx - 100, cy, 140, 130, 8);
    r1.fill = '#dbeafe'; r1.stroke = '#2563eb'; r1.linewidth = 2;
    const t1 = two.makeText("소수 (Prime)\n약수가 1과 자기자신\n(총 2개)\n예: 2, 3, 5, 7, 11...", cx - 100, cy);
    t1.weight = 800; t1.fill = '#1e3a8a'; t1.size = 12;

    const r2 = two.makeRoundedRectangle(cx + 100, cy, 140, 130, 8);
    r2.fill = '#fee2e2'; r2.stroke = '#dc2626'; r2.linewidth = 2;
    const t2 = two.makeText("합성수 (Composite)\n1과 자기자신 이외\n약수가 있는 수\n예: 4, 6, 8, 9, 10...", cx + 100, cy);
    t2.weight = 800; t2.fill = '#7f1d1d'; t2.size = 12;
  }

  function renderSieveCanvas(two, step) {
    const cx = two.width / 2;
    const cy = two.height / 2;
    const startX = cx - 150;
    const startY = cy - 70;
    const primes = new Set([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]);

    for (let n = 1; n <= 50; n++) {
      const col = (n - 1) % 10;
      const row = Math.floor((n - 1) / 10);
      const x = startX + col * 32;
      const y = startY + row * 28;

      let isErased = false;
      if (step >= 1 && n === 1) isErased = true;
      if (step >= 2 && n > 2 && n % 2 === 0) isErased = true;
      if (step >= 3 && n > 3 && n % 3 === 0) isErased = true;
      if (step >= 4 && n > 5 && n % 5 === 0) isErased = true;
      if (step >= 5 && n > 7 && n % 7 === 0) isErased = true;

      const isP = primes.has(n);
      const rect = two.makeRoundedRectangle(x, y, 28, 24, 4);

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
      txt.size = 11;
      txt.weight = 800;
      txt.fill = isErased ? '#94a3b8' : (step === 6 && isP ? '#854d0e' : '#1e293b');
    }
  }

  function renderPowerCanvas(two, b, e) {
    const cx = two.width / 2;
    const cy = two.height / 2;

    const baseBox = two.makeRoundedRectangle(cx - 30, cy + 10, 55, 60, 6);
    baseBox.fill = '#dbeafe'; baseBox.stroke = '#2563eb'; baseBox.linewidth = 2;
    const baseTxt = two.makeText(String(b), cx - 30, cy + 12);
    baseTxt.size = 32; baseTxt.weight = 800; baseTxt.fill = '#1e3a8a';

    const expBox = two.makeRoundedRectangle(cx + 25, cy - 25, 40, 40, 6);
    expBox.fill = '#fef3c7'; expBox.stroke = '#d97706'; expBox.linewidth = 2;
    const expTxt = two.makeText(String(e), cx + 25, cy - 23);
    expTxt.size = 20; expTxt.weight = 800; expTxt.fill = '#92400e';

    const label = two.makeText("밑 (Base)             지수 (Exp)", cx, cy + 60);
    label.weight = 800; label.fill = '#475569'; label.size = 13;
  }

  function renderPrimeCardCheckCanvas(two, numbers) {
    const cx = two.width / 2;
    const cy = two.height / 2;
    const startX = cx - ((numbers.length - 1) * 60) / 2;

    numbers.forEach((num, idx) => {
      const x = startX + idx * 60;
      const card = two.makeRoundedRectangle(x, cy, 50, 65, 6);
      card.fill = '#ffffff'; card.stroke = '#0284c7'; card.linewidth = 2;

      const txt = two.makeText(String(num), x, cy - 6);
      txt.size = 16; txt.weight = 800; txt.fill = '#0f172a';

      const tag = two.makeText("수 카드", x, cy + 18);
      tag.size = 10; tag.fill = '#64748b'; tag.weight = 700;
    });
  }

  function renderPowerTreeCanvas(two, text) {
    const cx = two.width / 2;
    const cy = two.height / 2;
    const bg = two.makeRoundedRectangle(cx, cy, 260, 80, 8);
    bg.fill = '#f8fafc'; bg.stroke = '#38bdf8'; bg.linewidth = 2;

    const t = two.makeText(text, cx, cy);
    t.size = 18; t.weight = 800; t.fill = '#0369a1';
  }

  function renderTruthBoardCanvas(two) {
    const cx = two.width / 2;
    const cy = two.height / 2;
    const rect = two.makeRoundedRectangle(cx, cy, 280, 100, 8);
    rect.fill = '#f0fdf4'; rect.stroke = '#16a34a'; rect.linewidth = 2;

    const title = two.makeText("명제 진위 판정 보드", cx, cy - 25);
    title.size = 14; title.weight = 800; title.fill = '#166534';

    const sub = two.makeText("참(O) / 거짓(X) 논리 추론", cx, cy + 10);
    sub.size = 13; sub.weight = 700; sub.fill = '#15803d';
  }

  function renderBacteriaGraphCanvas(two, minutes) {
    const cx = two.width / 2;
    const cy = two.height / 2;
    const curve = two.makeCurve(cx - 100, cy + 40, cx - 40, cy + 30, cx + 20, cy, cx + 80, cy - 45, true);
    curve.stroke = '#ec4899'; curve.linewidth = 3; curve.noFill();

    const t = two.makeText("10분: 2배 ➔ 60분: 2⁶ = 64배!", cx, cy + 60);
    t.size = 13; t.weight = 800; t.fill = '#9d174d';
  }

  function renderExponentEquationCanvas(two) {
    const cx = two.width / 2;
    const cy = two.height / 2;
    const rect = two.makeRoundedRectangle(cx, cy, 280, 90, 8);
    rect.fill = '#eff6ff'; rect.stroke = '#3b82f6'; rect.linewidth = 2;

    const t1 = two.makeText("2^a = 64 = 2⁶ ➔ a = 6", cx, cy - 15);
    t1.size = 13; t1.weight = 800; t1.fill = '#1d4ed8';

    const t2 = two.makeText("(1/3)^b = 1/27 = (1/3)³ ➔ b = 3", cx, cy + 15);
    t2.size = 13; t2.weight = 800; t2.fill = '#1d4ed8';
  }

  function renderTrainStationCanvas(two) {
    const cx = two.width / 2;
    const cy = two.height / 2;
    const line = two.makeLine(30, cy, two.width - 30, cy);
    line.stroke = '#3b82f6'; line.linewidth = 3;

    for (let st = 1; st <= 6; st++) {
      const x = 40 + st * 45;
      const dot = two.makeCircle(x, cy, 5);
      dot.fill = '#2563eb';
      const label = two.makeText(`${st}역`, x, cy + 16);
      label.size = 10; label.weight = 700; label.fill = '#1e3a8a';
    }

    const banner = two.makeText("배수 역마다 하차: 승객 수 = 역 번호의 약수 개수", cx, cy - 35);
    banner.weight = 800; banner.fill = '#1e40af'; banner.size = 12;
  }

  function renderBlockSplitCanvas(two, n) {
    const cx = two.width / 2;
    const cy = two.height / 2;

    const top = two.makeRoundedRectangle(cx, cy - 40, 70, 36, 6);
    top.fill = '#e0e7ff'; top.stroke = '#4f46e5'; top.linewidth = 2;
    const tTop = two.makeText(String(n), cx, cy - 40);
    tTop.weight = 800; tTop.size = 16; tTop.fill = '#3730a3';

    const l1 = two.makeLine(cx, cy - 22, cx - 45, cy + 15);
    l1.stroke = '#6366f1'; l1.linewidth = 2;
    const l2 = two.makeLine(cx, cy - 22, cx + 45, cy + 15);
    l2.stroke = '#6366f1'; l2.linewidth = 2;

    const bLeft = two.makeRoundedRectangle(cx - 45, cy + 25, 45, 30, 4);
    bLeft.fill = '#fef08a'; bLeft.stroke = '#eab308'; bLeft.linewidth = 2;
    const tL = two.makeText("2", cx - 45, cy + 25);
    tL.weight = 800; tL.fill = '#854d0e';

    const bRight = two.makeRoundedRectangle(cx + 45, cy + 25, 45, 30, 4);
    bRight.fill = '#f1f5f9'; bRight.stroke = '#94a3b8'; bRight.linewidth = 2;
    const tR = two.makeText("6", cx + 45, cy + 25);
    tR.weight = 800; tR.fill = '#334155';
  }

  function renderFactorTreeCanvas(two, n) {
    const cx = two.width / 2;
    const cy = two.height / 2;

    const root = two.makeCircle(cx, cy - 50, 18);
    root.fill = '#e0e7ff'; root.stroke = '#4338ca'; root.linewidth = 2;
    const tR = two.makeText(String(n), cx, cy - 50);
    tR.weight = 800; tR.size = 12; tR.fill = '#312e81';

    const n1 = two.makeCircle(cx - 50, cy, 14);
    n1.fill = '#fef08a'; n1.stroke = '#ca8a04'; n1.linewidth = 2;
    const tn1 = two.makeText("2", cx - 50, cy);
    tn1.weight = 800; tn1.size = 11; tn1.fill = '#713f12';

    const n2 = two.makeCircle(cx + 50, cy, 14);
    n2.fill = '#e0e7ff'; n2.stroke = '#4338ca'; n2.linewidth = 2;
    const tn2 = two.makeText(String(n / 2), cx + 50, cy);
    tn2.weight = 800; tn2.size = 11; tn2.fill = '#312e81';

    two.makeLine(cx, cy - 32, cx - 50, cy - 14);
    two.makeLine(cx, cy - 32, cx + 50, cy - 14);
  }

  function renderPrimeFactorTilesCanvas(two) {
    const cx = two.width / 2;
    const cy = two.height / 2;
    const rect = two.makeRoundedRectangle(cx, cy, 260, 80, 8);
    rect.fill = '#f8fafc'; rect.stroke = '#0284c7'; rect.linewidth = 2;

    const t = two.makeText("소인수 거듭제곱 타일: 2⁴ × 5", cx, cy);
    t.size = 16; t.weight = 800; t.fill = '#0369a1';
  }

  function renderPrimeFactorTagsCanvas(two, num, factors) {
    const cx = two.width / 2;
    const cy = two.height / 2;
    const box = two.makeRoundedRectangle(cx, cy, 260, 80, 8);
    box.fill = '#eff6ff'; box.stroke = '#3b82f6'; box.linewidth = 2;

    const txt = two.makeText(`${num}의 소인수: ${factors.join(', ')}`, cx, cy);
    txt.size = 16; txt.weight = 800; txt.fill = '#1d4ed8';
  }

  function renderVerticalDivisionCanvas(two, num) {
    const cx = two.width / 2;
    const cy = two.height / 2;
    const rect = two.makeRoundedRectangle(cx, cy, 260, 90, 8);
    rect.fill = '#f8fafc'; rect.stroke = '#64748b'; rect.linewidth = 2;

    const t1 = two.makeText(`2 ) ${num}`, cx - 40, cy - 20);
    t1.size = 14; t1.weight = 800; t1.fill = '#0f172a';

    const t2 = two.makeText(`2 ) ${num / 2}`, cx - 40, cy + 10);
    t2.size = 14; t2.weight = 800; t2.fill = '#0f172a';
  }

  function renderContinuousProductCanvas(two) {
    const cx = two.width / 2;
    const cy = two.height / 2;
    const rect = two.makeRoundedRectangle(cx, cy, 270, 80, 8);
    rect.fill = '#fefce8'; rect.stroke = '#ca8a04'; rect.linewidth = 2;

    const t = two.makeText("2 × 3 × 4 × 5 × 6 = 2⁴ × 3² × 5", cx, cy);
    t.size = 14; t.weight = 800; t.fill = '#854d0e';
  }

  function renderSquareMakeCanvas(two, num, missing) {
    const cx = two.width / 2;
    const cy = two.height / 2;
    const box = two.makeRoundedRectangle(cx, cy, 270, 80, 8);
    box.fill = '#fdf2f8'; box.stroke = '#db2777'; box.linewidth = 2;

    const t = two.makeText(`${num} × [ ${missing} ] = 제곱수`, cx, cy);
    t.size = 16; t.weight = 800; t.fill = '#9d174d';
  }

  function renderConditionFilterCanvas(two) {
    const cx = two.width / 2;
    const cy = two.height / 2;
    const box = two.makeRoundedRectangle(cx, cy, 260, 80, 8);
    box.fill = '#f0fdf4'; box.stroke = '#16a34a'; box.linewidth = 2;

    const t = two.makeText("소인수 합 18 ➔ (5, 13) 65 / (7, 11) 77", cx, cy);
    t.size = 13; t.weight = 800; t.fill = '#166534';
  }

  function renderFactorGridCanvas(two, n) {
    const cx = two.width / 2;
    const cy = two.height / 2;
    const rect = two.makeRoundedRectangle(cx, cy, 250, 100, 6);
    rect.fill = '#f8fafc'; rect.stroke = '#64748b'; rect.linewidth = 2;

    const label = two.makeText("18의 약수 격자: (1+2) × (1+1) = 6개", cx, cy);
    label.weight = 800; label.size = 13; label.fill = '#0f172a';
  }

  function renderTilingSquareCanvas(two) {
    const cx = two.width / 2;
    const cy = two.height / 2;
    const outer = two.makeRectangle(cx, cy, 180, 120);
    outer.fill = '#f1f5f9'; outer.stroke = '#0284c7'; outer.linewidth = 2;

    const tile = two.makeRectangle(cx - 45, cy - 15, 60, 60);
    tile.fill = '#bae6fd'; tile.stroke = '#0369a1'; tile.linewidth = 2;

    const t = two.makeText("최대 정사각형 타일 한 변 = GCD", cx, cy + 50);
    t.size = 12; t.weight = 800; t.fill = '#0369a1';
  }

  function renderGcdBalanceCanvas(two, a, b) {
    const cx = two.width / 2;
    const cy = two.height / 2;
    const r1 = two.makeRoundedRectangle(cx - 65, cy, 95, 60, 6);
    r1.fill = '#e0e7ff'; r1.stroke = '#4338ca'; r1.linewidth = 2;
    const t1 = two.makeText(String(a), cx - 65, cy);
    t1.weight = 800; t1.fill = '#312e81';

    const r2 = two.makeRoundedRectangle(cx + 65, cy, 95, 60, 6);
    r2.fill = '#fef3c7'; r2.stroke = '#d97706'; r2.linewidth = 2;
    const t2 = two.makeText(String(b), cx + 65, cy);
    t2.weight = 800; t2.fill = '#78350f';
  }

  function renderThreeNumGcdCanvas(two) {
    const cx = two.width / 2;
    const cy = two.height / 2;
    const rect = two.makeRoundedRectangle(cx, cy, 270, 90, 8);
    rect.fill = '#f8fafc'; rect.stroke = '#3b82f6'; rect.linewidth = 2;

    const txt = two.makeText("세 수 소인수 세로 정렬 및 공통 소인수 곱", cx, cy);
    txt.size = 13; txt.weight = 800; txt.fill = '#1d4ed8';
  }

  function renderGcdPairCompareCanvas(two, a, b) {
    renderGcdBalanceCanvas(two, a, b);
  }

  function renderCoprimeLineCanvas(two) {
    const cx = two.width / 2;
    const cy = two.height / 2;
    const line = two.makeLine(30, cy, two.width - 30, cy);
    line.stroke = '#64748b'; line.linewidth = 2;

    const t = two.makeText("15의 소인수(3, 5)의 배수를 제외한 수: 22, 23, 26, 28, 29", cx, cy - 25);
    t.size = 11; t.weight = 800; t.fill = '#0284c7';
  }

  function renderFractionReduceCanvas(two, n1, n2) {
    const cx = two.width / 2;
    const cy = two.height / 2;
    const box = two.makeRoundedRectangle(cx, cy, 260, 80, 8);
    box.fill = '#eff6ff'; box.stroke = '#2563eb'; box.linewidth = 2;

    const t = two.makeText(`${n1}/□ 와 ${n2}/□ ➔ 최대공약수 = 35`, cx, cy);
    t.size = 14; t.weight = 800; t.fill = '#1e3a8a';
  }

  function renderRemainderGcdCanvas(two) {
    const cx = two.width / 2;
    const cy = two.height / 2;
    const box = two.makeRoundedRectangle(cx, cy, 270, 80, 8);
    box.fill = '#f0fdf4'; box.stroke = '#16a34a'; box.linewidth = 2;

    const t = two.makeText("107-2=105, 153-3=150, 90 ➔ GCD = 15", cx, cy);
    t.size = 13; t.weight = 800; t.fill = '#166534';
  }

  function renderGcdRelationsCanvas(two) {
    const cx = two.width / 2;
    const cy = two.height / 2;
    const circle = two.makeCircle(cx, cy, 45);
    circle.fill = '#fdf4ff'; circle.stroke = '#c026d3'; circle.linewidth = 2;
    const t = two.makeText("A × B = G × L", cx, cy);
    t.weight = 800; t.size = 14; t.fill = '#86198f';
  }

  function renderLcmBalanceCanvas(two, a, b) {
    renderGcdBalanceCanvas(two, a, b);
  }

  function renderLcmMultiCanvas(two, a, b, c) {
    const cx = two.width / 2;
    const cy = two.height / 2;
    const box = two.makeRoundedRectangle(cx, cy, 260, 80, 8);
    box.fill = '#eff6ff'; box.stroke = '#0284c7'; box.linewidth = 2;

    const t = two.makeText(`${a}, ${b}, ${c} 최소공배수 확장`, cx, cy);
    t.size = 14; t.weight = 800; t.fill = '#0369a1';
  }

  function renderFractionLcmCanvas(two, d1, d2) {
    const cx = two.width / 2;
    const cy = two.height / 2;
    const box = two.makeRoundedRectangle(cx, cy, 260, 80, 8);
    box.fill = '#fefce8'; box.stroke = '#ca8a04'; box.linewidth = 2;

    const t = two.makeText(`1/${d1}, 1/${d2} ➔ 분모 최소공배수: 490`, cx, cy);
    t.size = 14; t.weight = 800; t.fill = '#854d0e';
  }

  function renderVariableLcmCanvas(two) {
    const cx = two.width / 2;
    const cy = two.height / 2;
    const box = two.makeRoundedRectangle(cx, cy, 260, 80, 8);
    box.fill = '#f8fafc'; box.stroke = '#475569'; box.linewidth = 2;

    const t = two.makeText("3A, 4A, 5A ➔ LCM = 60A = 360 ➔ A=6", cx, cy);
    t.size = 13; t.weight = 800; t.fill = '#0f172a';
  }

  function renderThreeDigitLcmCanvas(two, base) {
    const cx = two.width / 2;
    const cy = two.height / 2;
    const box = two.makeRoundedRectangle(cx, cy, 260, 80, 8);
    box.fill = '#eff6ff'; box.stroke = '#3b82f6'; box.linewidth = 2;

    const t = two.makeText(`최소공배수 ${base} ➔ 세 자리 배수: 180`, cx, cy);
    t.size = 14; t.weight = 800; t.fill = '#1d4ed8';
  }

  function renderSumGcdLcmCanvas(two, sum, gcd, lcm) {
    const cx = two.width / 2;
    const cy = two.height / 2;
    const box = two.makeRoundedRectangle(cx, cy, 260, 80, 8);
    box.fill = '#f0fdf4'; box.stroke = '#16a34a'; box.linewidth = 2;

    const t = two.makeText(`합: ${sum}, GCD: ${gcd}, LCM: ${lcm} ➔ (8, 36)`, cx, cy);
    t.size = 13; t.weight = 800; t.fill = '#166534';
  }

  function renderGearsCanvas(two, angle) {
    const cx = two.width / 2;
    const cy = two.height / 2;

    const g1 = two.makeCircle(cx - 50, cy, 40);
    g1.fill = '#e0f2fe'; g1.stroke = '#0284c7'; g1.linewidth = 3;
    g1.rotation = angle;

    const g2 = two.makeCircle(cx + 45, cy, 55);
    g2.fill = '#fef3c7'; g2.stroke = '#d97706'; g2.linewidth = 3;
    g2.rotation = -angle * (24 / 36);

    const txt = two.makeText("최초 재맞물림 = 72번째 톱니", cx, cy + 70);
    txt.size = 13; txt.weight = 800; txt.fill = '#0f172a';
  }

  function renderFractionScaleCanvas(two) {
    const cx = two.width / 2;
    const cy = two.height / 2;
    const box = two.makeRoundedRectangle(cx, cy, 260, 80, 8);
    box.fill = '#eff6ff'; box.stroke = '#2563eb'; box.linewidth = 2;

    const t = two.makeText("분자 LCM=70 / 분모 GCD=3 ➔ 70/3", cx, cy);
    t.size = 14; t.weight = 800; t.fill = '#1e3a8a';
  }

  function renderAlgoCanvas(two, n, isPrime) {
    const cx = two.width / 2;
    const cy = two.height / 2;
    const box = two.makeRoundedRectangle(cx, cy, 260, 80, 8);
    box.fill = isPrime ? '#f0fdf4' : '#fef2f2';
    box.stroke = isPrime ? '#16a34a' : '#ef4444';
    box.linewidth = 2;

    const t = two.makeText(`수: ${n} ➔ 판별: ${isPrime ? '소수' : '합성수'}`, cx, cy);
    t.size = 15; t.weight = 800; t.fill = isPrime ? '#166534' : '#991b1b';
  }

  function renderCalendarCanvas(two) {
    const cx = two.width / 2;
    const cy = two.height / 2;
    const primes = new Set(simState.calendarPrimes);
    const startX = cx - 100;
    const startY = cy - 70;

    for (let d = 1; d <= 31; d++) {
      const col = (d - 1) % 7;
      const row = Math.floor((d - 1) / 7);
      const x = startX + col * 32;
      const y = startY + row * 28;

      const circle = two.makeCircle(x, y, 12);
      if (primes.has(d)) {
        circle.fill = '#fef08a'; circle.stroke = '#ca8a04'; circle.linewidth = 2;
      } else {
        circle.fill = '#ffffff'; circle.stroke = '#cbd5e1';
      }

      const txt = two.makeText(String(d), x, y + 1);
      txt.size = 10; txt.weight = 800;
      txt.fill = primes.has(d) ? '#854d0e' : '#475569';
    }
  }

  function renderCycleWheelCanvas(two, base, exp) {
    const cx = two.width / 2;
    const cy = two.height / 2;
    const circle = two.makeCircle(cx, cy, 50);
    circle.fill = '#f0fdf4'; circle.stroke = '#16a34a'; circle.linewidth = 2;

    const t = two.makeText("3 주기: 3, 9, 7, 1 (4개 반복)\n5 주기: 5", cx, cy);
    t.size = 12; t.weight = 800; t.fill = '#166534';
  }

  function renderGcdLcmConnectCanvas(two) {
    const cx = two.width / 2;
    const cy = two.height / 2;

    const aBox = two.makeRoundedRectangle(cx - 60, cy - 30, 45, 30, 4);
    aBox.fill = '#e0e7ff'; aBox.stroke = '#4f46e5';
    const ta = two.makeText("A=36", cx - 60, cy - 30); ta.size = 11; ta.weight = 800;

    const bBox = two.makeRoundedRectangle(cx, cy - 30, 45, 30, 4);
    bBox.fill = '#fef3c7'; bBox.stroke = '#d97706';
    const tb = two.makeText("B=18", cx, cy - 30); tb.size = 11; tb.weight = 800;

    const cBox = two.makeRoundedRectangle(cx + 60, cy - 30, 50, 30, 4);
    cBox.fill = '#f0fdf4'; cBox.stroke = '#16a34a';
    const tc = two.makeText("C=108", cx + 60, cy - 30); tc.size = 11; tc.weight = 800;

    const sumTxt = two.makeText("A + B + C = 36 + 18 + 108 = 162", cx, cy + 30);
    sumTxt.size = 13; sumTxt.weight = 800; sumTxt.fill = '#0f172a';
  }

  function renderProofStepCanvas(two) {
    const cx = two.width / 2;
    const cy = two.height / 2;
    const board = two.makeRoundedRectangle(cx, cy, 270, 90, 8);
    board.fill = '#1e293b'; board.stroke = '#334155'; board.linewidth = 2;

    const t = two.makeText("서술형 단계별 논리 전개 칠판\n(소인수분해 ➔ 조건 판정 ➔ 합 계산)", cx, cy);
    t.size = 12; t.weight = 800; t.fill = '#f8fafc';
  }

  function renderMondrianCanvas(two) {
    const cx = two.width / 2;
    const cy = two.height / 2;

    const r1 = two.makeRectangle(cx - 40, cy - 30, 60, 50);
    r1.fill = '#ef4444'; r1.stroke = '#0f172a'; r1.linewidth = 3;

    const r2 = two.makeRectangle(cx + 40, cy - 30, 80, 50);
    r2.fill = '#3b82f6'; r2.stroke = '#0f172a'; r2.linewidth = 3;

    const r3 = two.makeRectangle(cx - 40, cy + 35, 60, 60);
    r3.fill = '#eab308'; r3.stroke = '#0f172a'; r3.linewidth = 3;

    const r4 = two.makeRectangle(cx + 40, cy + 35, 80, 60);
    r4.fill = '#ffffff'; r4.stroke = '#0f172a'; r4.linewidth = 3;

    const txt = two.makeText("넓이 = 주어진 수 (직사각형 분할)", cx, cy + 75);
    txt.size = 12; txt.weight = 800; txt.fill = '#0f172a';
  }

  function renderDefaultCanvas(two, code) {
    const cx = two.width / 2;
    const cy = two.height / 2;
    const rect = two.makeRoundedRectangle(cx, cy, 260, 80, 8);
    rect.fill = '#f8fafc'; rect.stroke = '#cbd5e1'; rect.linewidth = 2;

    const t = two.makeText(`서브스텝 [${code}] 시뮬레이터`, cx, cy);
    t.size = 14; t.weight = 800; t.fill = '#0284c7';
  }
})();
