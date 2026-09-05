// Chapter 3 Interactive Canvas Drawers and Simulators (Two.js)

const simState = {
  boxVal: 3,
  ratioVal: '20/50',
  revStep: 0,
  iceQty: 4,
  ruleIdx: 0,
  bookDays: 5,
  negExprIdx: 0,
  polyMode: 'all',
  rectMode: 'dist',
  likeStep: 'split',
  bracketStep: 1,
  eqType: 'equation',
  eqX: 2,
  solX: 3,
  eqProp: 'init',
  transStep: 1,
  algStep: 1,
  magicMode: 'decimal',
  consecX: 19,
  magicX: 7,
  magicStep: 6,
  propQuizIdx: 1
};
window.simState = simState;

function setupSubstepSimulator(two, code, simController) {
  if (!two) return;
  two.clear();
  if (simController) {
    simController.style.display = 'block';
  }

  if (code === '0-1') {
    // [되짚어 보기 1] 초등 미지수 수평 저울
    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#1e40af; font-size:0.92rem;">⚖️ 초등 미지수 수평 저울 (교과서 68쪽)</span>
          <span id="box-scale-status" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            현재 □ = ${simState.boxVal} (좌: ${3 * simState.boxVal + 5} vs 우: 20)
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button class="tool-btn" style="background:#eff6ff; color:#1d4ed8; font-weight:700;" onclick="setBoxScale(1)">□ = 1 (좌 8 &lt; 우 20)</button>
          <button class="tool-btn" style="background:#eff6ff; color:#1d4ed8; font-weight:700;" onclick="setBoxScale(3)">□ = 3 (좌 14 &lt; 우 20)</button>
          <button class="tool-btn" style="background:#dcfce7; color:#15803d; font-weight:800; border:1px solid #86efac;" onclick="setBoxScale(5)">✨ □ = 5 (좌 20 = 우 20 수평!)</button>
          <button class="tool-btn" style="background:#fee2e2; color:#b91c1c; font-weight:700;" onclick="setBoxScale(7)">□ = 7 (좌 26 &gt; 우 20)</button>
        </div>
      `;
    }
    renderBoxScaleCanvas(two, simState.boxVal);
  }
  else if (code === '0-2') {
    // [되짚어 보기 2] 비와 비율 막대
    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#0f766e; font-size:0.92rem;">🍫 비와 비율 비교 막대 (초등 5~6학년)</span>
          <span id="ratio-badge" style="background:#f0fdfa; color:#0d9488; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #99f6e4;">
            비율: ${simState.ratioVal}
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button class="tool-btn" style="background:#f0fdfa; color:#0f766e; font-weight:800;" onclick="setRatioVal('20/50')">남학생 20명 / 전체 50명 (2/5 = 0.4)</button>
          <button class="tool-btn" style="background:#f1f5f9; color:#334155; font-weight:700;" onclick="setRatioVal('10/50')">10명 / 50명 (1/5 = 0.2)</button>
          <button class="tool-btn" style="background:#f1f5f9; color:#334155; font-weight:700;" onclick="setRatioVal('25/50')">25명 / 50명 (1/2 = 0.5)</button>
          <button class="tool-btn" style="background:#f1f5f9; color:#334155; font-weight:700;" onclick="setRatioVal('40/50')">40명 / 50명 (4/5 = 0.8)</button>
        </div>
      `;
    }
    renderRatioBarCanvas(two, simState.ratioVal);
  }
  else if (code === '0-3') {
    // [되짚어 보기 3] 거꾸로 계산하기
    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#7c3aed; font-size:0.92rem;">🔄 거꾸로 계산하기 역산 순서도</span>
          <span id="rev-badge" style="background:#f5f3ff; color:#6d28d9; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #ddd6fe;">
            어떤 수 □ = 5
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button class="tool-btn" style="background:#f5f3ff; color:#6d28d9; font-weight:700;" onclick="setRevStep(0)">1. 원래 연산: (□ + 4) × 3 = 27</button>
          <button class="tool-btn" style="background:#f5f3ff; color:#6d28d9; font-weight:700;" onclick="setRevStep(1)">2. 거꾸로 1단계: 27 ÷ 3 = 9</button>
          <button class="tool-btn" style="background:#dcfce7; color:#15803d; font-weight:800;" onclick="setRevStep(2)">3. 거꾸로 2단계: 9 - 4 = 5 [완료!]</button>
        </div>
      `;
    }
    renderReverseCalcCanvas(two, simState.revStep);
  }
  else if (code === '1-1') {
    // [교과서 70쪽] 문자의 사용: 아이스크림 구매 영수증
    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">🍦 아이스크림 구매 영수증 시뮬레이터 (교과서 70쪽)</span>
          <span id="receipt-badge" style="background:#e0f2fe; color:#0369a1; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bae6fd;">
            합계: 3,500 × ${simState.iceQty} = ${(3500 * simState.iceQty).toLocaleString()}원
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button class="tool-btn" style="background:#e0f2fe; color:#0369a1; font-weight:700;" onclick="setIceQty(1)">아이스크림 x = 1개</button>
          <button class="tool-btn" style="background:#e0f2fe; color:#0369a1; font-weight:700;" onclick="setIceQty(2)">x = 2개 (7,000원)</button>
          <button class="tool-btn" style="background:#e0f2fe; color:#0369a1; font-weight:700;" onclick="setIceQty(4)">x = 4개 (14,000원)</button>
          <button class="tool-btn" style="background:#e0f2fe; color:#0369a1; font-weight:700;" onclick="setIceQty(10)">x = 10개 (35,000원)</button>
        </div>
      `;
    }
    renderReceiptCanvas(two, simState.iceQty);
  }
  else if (code === '1-2') {
    // [교과서 72~73쪽] 곱셈·나눗셈 기호 생략 압축기
    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#c026d3; font-size:0.92rem;">✂️ 곱셈·나눗셈 기호 생략 압축기 (교과서 72~73쪽)</span>
          <span id="omission-badge" style="background:#fae8ff; color:#a21caf; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #f5d0fe;">
            기호 생략 4대 원칙
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button class="tool-btn" style="background:#fae8ff; color:#a21caf; font-weight:700;" onclick="setRuleIdx(0)">규칙 1: a × (-3) ➔ -3a (수 앞)</button>
          <button class="tool-btn" style="background:#fae8ff; color:#a21caf; font-weight:700;" onclick="setRuleIdx(1)">규칙 2: x ÷ 4 ➔ x/4 (분수 꼴)</button>
          <button class="tool-btn" style="background:#fae8ff; color:#a21caf; font-weight:700;" onclick="setRuleIdx(2)">규칙 3: a × b × a ➔ a²b (알파벳순·거듭제곱)</button>
          <button class="tool-btn" style="background:#fae8ff; color:#a21caf; font-weight:700;" onclick="setRuleIdx(3)">규칙 4: (x+y) ÷ 2 ➔ (x+y)/2 (괄호식)</button>
        </div>
      `;
    }
    renderSymbolOmissionCanvas(two, simState.ruleIdx);
  }
  else if (code === '1-3') {
    // [교과서 76쪽] 400쪽 독서 진행 게이지와 대입
    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#d97706; font-size:0.92rem;">📖 400쪽 독서 진행 게이지와 대입 (교과서 76쪽)</span>
          <span id="book-badge" style="background:#fef3c7; color:#b45309; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #fde68a;">
            ${simState.bookDays}일차: 남은 쪽수 ${400 - 10 * simState.bookDays}쪽
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button class="tool-btn" style="background:#fef3c7; color:#b45309; font-weight:700;" onclick="setBookDays(0)">x = 0일 (400쪽 남음)</button>
          <button class="tool-btn" style="background:#fef3c7; color:#b45309; font-weight:700;" onclick="setBookDays(5)">x = 5일 (350쪽 남음)</button>
          <button class="tool-btn" style="background:#fef3c7; color:#b45309; font-weight:700;" onclick="setBookDays(10)">x = 10일 (300쪽 남음)</button>
          <button class="tool-btn" style="background:#fef3c7; color:#b45309; font-weight:700;" onclick="setBookDays(20)">x = 20일 (200쪽 남음)</button>
          <button class="tool-btn" style="background:#dcfce7; color:#15803d; font-weight:800;" onclick="setBookDays(40)">x = 40일 (0쪽, 완독!)</button>
        </div>
      `;
    }
    renderBookGaugeCanvas(two, simState.bookDays);
  }
  else if (code === '1-4') {
    // [교과서 77쪽] 음수 대입 주의보 - 괄호 보호막
    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#dc2626; font-size:0.92rem;">🛡️ 음수 대입 주의보: 괄호 보호막 (x = -2)</span>
          <span id="neg-badge" style="background:#fee2e2; color:#b91c1c; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #fecaca;">
            주의: -2² ≠ (-2)²
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button class="tool-btn" style="background:#fee2e2; color:#b91c1c; font-weight:700;" onclick="setNegExpr(0)">-x ➔ -(-2) = +2</button>
          <button class="tool-btn" style="background:#fee2e2; color:#b91c1c; font-weight:700;" onclick="setNegExpr(1)">x² ➔ (-2)² = 4</button>
          <button class="tool-btn" style="background:#fee2e2; color:#b91c1c; font-weight:700;" onclick="setNegExpr(2)">-x² ➔ -(-2)² = -4</button>
          <button class="tool-btn" style="background:#fee2e2; color:#b91c1c; font-weight:700;" onclick="setNegExpr(3)">3 - 2x ➔ 3 - 2(-2) = 7</button>
        </div>
      `;
    }
    renderNegSubstituteCanvas(two, simState.negExprIdx);
  }
  else if (code === '2-1') {
    // [교과서 80쪽] 다항식 구조 해부 실험실
    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#4f46e5; font-size:0.92rem;">🔬 다항식 구조 해부: 3x² - 5x + 7 (교과서 80쪽)</span>
          <span id="poly-badge" style="background:#eef2ff; color:#4338ca; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #c7d2fe;">
            다항식 구성 요소 탐색
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button class="tool-btn" style="background:#eef2ff; color:#4338ca; font-weight:700;" onclick="setPolyMode('all')">전체 항 분리: 3x², -5x, 7</button>
          <button class="tool-btn" style="background:#eef2ff; color:#4338ca; font-weight:700;" onclick="setPolyMode('coef2')">x²의 계수: 3</button>
          <button class="tool-btn" style="background:#fee2e2; color:#b91c1c; font-weight:700;" onclick="setPolyMode('coef1')">x의 계수: -5 (부호 포함!)</button>
          <button class="tool-btn" style="background:#eef2ff; color:#4338ca; font-weight:700;" onclick="setPolyMode('const')">상수항: 7</button>
          <button class="tool-btn" style="background:#dcfce7; color:#15803d; font-weight:800;" onclick="setPolyMode('deg')">차수: 2차식</button>
        </div>
      `;
    }
    renderPolyStructureCanvas(two, simState.polyMode);
  }
  else if (code === '2-2') {
    // [교과서 82쪽] 직사각형 면적 모델과 분배법칙
    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#0891b2; font-size:0.92rem;">📐 직사각형 면적 모델과 분배법칙 (교과서 82쪽)</span>
          <span id="rect-badge" style="background:#ecfeff; color:#0e7490; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #a5f3fc;">
            넓이 = 가로 × 세로
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button class="tool-btn" style="background:#ecfeff; color:#0e7490; font-weight:700;" onclick="setRectMode('bundle')">묶인 형태: 3(x + 2)</button>
          <button class="tool-btn" style="background:#ecfeff; color:#0e7490; font-weight:700;" onclick="setRectMode('dist')">전개 분할: 3x + 6</button>
          <button class="tool-btn" style="background:#fee2e2; color:#b91c1c; font-weight:700;" onclick="setRectMode('neg')">음수 분배: -4(2x - 3) = -8x + 12</button>
        </div>
      `;
    }
    renderRectDistCanvas(two, simState.rectMode);
  }
  else if (code === '2-3') {
    // [교과서 84쪽] 동류항 대수 막대 타일 모으기
    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#16a34a; font-size:0.92rem;">🟩 동류항 대수 타일 모으기: (4x + 3) + (2x - 5)</span>
          <span id="like-badge" style="background:#f0fdf4; color:#15803d; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bbf7d0;">
            동류항: 문자와 차수가 같은 항
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button class="tool-btn" style="background:#f0fdf4; color:#15803d; font-weight:700;" onclick="setLikeTiles('split')">1단계: 타일 나열하기</button>
          <button class="tool-btn" style="background:#f0fdf4; color:#15803d; font-weight:700;" onclick="setLikeTiles('merge')">2단계: 동류항끼리 모으기 (4x+2x) + (3-5)</button>
          <button class="tool-btn" style="background:#dcfce7; color:#15803d; font-weight:800;" onclick="setLikeTiles('cancel')">3단계: 상쇄 및 최종 정리 ➔ 6x - 2</button>
        </div>
      `;
    }
    renderLikeTermTilesCanvas(two, simState.likeStep);
  }
  else if (code === '2-4') {
    // [교과서 85쪽] 괄호 앞 마이너스 부호 분배기
    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#ea580c; font-size:0.92rem;">🔀 괄호 앞 부호 분배기: (3x + 2) - (2x - 3)</span>
          <span id="bracket-badge" style="background:#fff7ed; color:#c2410c; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #fed7aa;">
            -(2x - 3) = -2x + 3 부호 반전 주의!
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button class="tool-btn" style="background:#fff7ed; color:#c2410c; font-weight:700;" onclick="setBracketStep(1)">1단계: 원래 식 확인</button>
          <button class="tool-btn" style="background:#fee2e2; color:#b91c1c; font-weight:700;" onclick="setBracketStep(2)">2단계: 괄호 풀기 (부호 반전! 3x+2 - 2x+3)</button>
          <button class="tool-btn" style="background:#dcfce7; color:#15803d; font-weight:800;" onclick="setBracketStep(3)">3단계: 동류항 계산 ➔ x + 5</button>
        </div>
      `;
    }
    renderBracketDistCanvas(two, simState.bracketStep);
  }
  else if (code === '3-1') {
    // [교과서 86쪽] 등식과 항등식 판정 저울
    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#4f46e5; font-size:0.92rem;">⚖️ 등식과 항등식 판정 저울 (교과서 86쪽)</span>
          <span id="eq-badge" style="background:#eef2ff; color:#4338ca; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #c7d2fe;">
            ${simState.eqType === 'equation' ? '방정식: 특정 x에서만 참' : '항등식: 모든 x에서 항상 참'}
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button class="tool-btn" style="background:#eef2ff; color:#4338ca; font-weight:700;" onclick="setEqType('equation')">방정식: 2x + 1 = 5</button>
          <button class="tool-btn" style="background:#eef2ff; color:#4338ca; font-weight:700;" onclick="setEqType('identity')">항등식: 2(x + 1) = 2x + 2</button>
          <button class="tool-btn" style="background:#f1f5f9; color:#334155;" onclick="setEqX(1)">x = 1</button>
          <button class="tool-btn" style="background:#f1f5f9; color:#334155;" onclick="setEqX(2)">x = 2</button>
          <button class="tool-btn" style="background:#f1f5f9; color:#334155;" onclick="setEqX(3)">x = 3</button>
        </div>
      `;
    }
    renderEqVsIdentityCanvas(two, simState.eqType, simState.eqX);
  }
  else if (code === '3-2') {
    // [교과서 87쪽] 참/거짓 판별기와 방정식의 해
    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#d97706; font-size:0.92rem;">💡 방정식의 해 판별기: 3x - 2 = 7 (교과서 87쪽)</span>
          <span id="sol-badge" style="background:#fef3c7; color:#b45309; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #fde68a;">
            후보 수 대입 검증
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button class="tool-btn" style="background:#fef3c7; color:#b45309; font-weight:700;" onclick="setSolX(1)">x = 1 대입 (좌 1 ≠ 우 7)</button>
          <button class="tool-btn" style="background:#fef3c7; color:#b45309; font-weight:700;" onclick="setSolX(2)">x = 2 대입 (좌 4 ≠ 우 7)</button>
          <button class="tool-btn" style="background:#dcfce7; color:#15803d; font-weight:800; border:1px solid #86efac;" onclick="setSolX(3)">✨ x = 3 대입 (좌 7 = 우 7 참! [해])</button>
          <button class="tool-btn" style="background:#fef3c7; color:#b45309; font-weight:700;" onclick="setSolX(4)">x = 4 대입 (좌 10 ≠ 우 7)</button>
        </div>
      `;
    }
    renderSolutionFinderCanvas(two, simState.solX);
  }
  else if (code === '3-3') {
    // [교과서 88~89쪽] 등식의 성질 양팔 저울 실험실
    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#2563eb; font-size:0.92rem;">⚖️ 등식의 성질 양팔 저울 실험실: x - 3 = 5</span>
          <span id="prop-badge" style="background:#eff6ff; color:#1d4ed8; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bfdbfe;">
            등식의 성질 1: 양변에 같은 수를 더해도 등식은 성립한다
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button class="tool-btn" style="background:#dcfce7; color:#15803d; font-weight:800; border:1px solid #86efac;" onclick="applyProp('add3')">✨ 양변에 +3 더하기 ➔ x = 8 [해 완성!]</button>
          <button class="tool-btn" style="background:#eff6ff; color:#1d4ed8; font-weight:700;" onclick="applyProp('sub3')">양변에서 -3 빼기 ➔ x - 6 = 2</button>
          <button class="tool-btn" style="background:#eff6ff; color:#1d4ed8; font-weight:700;" onclick="applyProp('mul2')">양변에 ×2 곱하기 ➔ 2x - 6 = 10</button>
          <button class="tool-btn" style="background:#f1f5f9; color:#475569; font-weight:700;" onclick="applyProp('init')">🔄 처음으로 초기화</button>
        </div>
      `;
    }
    renderPropertiesCanvas(two, simState.eqProp);
  }
  else if (code === '3-4') {
    // [3.3 형성평가] 등식의 성질 OX 판별 퀴즈
    if (simController) {
      const pIdx = simState.propQuizIdx || 1;
      const labels = ['덧셈 법칙 (+c)', '뺄셈 법칙 (-c)', '곱셈 법칙 (×c)', '나눗셈 법칙 (÷c, c≠0)', '⚠️ c=0 주의 반례'];
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#0369a1; font-size:0.92rem;">⚖️ 등식의 성질 4대 기본 법칙 &amp; OX 검증 칠판 (교과서 90쪽)</span>
          <span id="prop-badge" style="background:#f0f9ff; color:#0284c7; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bae6fd;">
            규칙 ${pIdx}: ${labels[pIdx - 1]}
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button class="tool-btn" style="background:#eff6ff; color:#1d4ed8; font-weight:700;" onclick="setPropQuiz(1)">① a=b ➔ a+c = b+c</button>
          <button class="tool-btn" style="background:#eff6ff; color:#1d4ed8; font-weight:700;" onclick="setPropQuiz(2)">② a=b ➔ a-c = b-c</button>
          <button class="tool-btn" style="background:#eff6ff; color:#1d4ed8; font-weight:700;" onclick="setPropQuiz(3)">③ a=b ➔ ac = bc</button>
          <button class="tool-btn" style="background:#eff6ff; color:#1d4ed8; font-weight:700;" onclick="setPropQuiz(4)">④ a=b ➔ a/c = b/c (c≠0)</button>
          <button class="tool-btn" style="background:#fee2e2; color:#b91c1c; font-weight:800; border:1px solid #fca5a5;" onclick="setPropQuiz(5)">⚠️ ac=bc ➔ a=b 거짓 반례 (c=0)</button>
        </div>
      `;
    }
    renderPropQuizCanvas(two, simState.propQuizIdx || 1);
  }
  else if (code === '4-1') {
    // [교과서 92쪽] 이항 부호 반전 브릿지
    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#b45309; font-size:0.92rem;">🌉 이항(移項) 부호 반전 브릿지: 3x + 5 = 11 (교과서 92쪽)</span>
          <span id="trans-badge" style="background:#fef3c7; color:#b45309; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #fde68a;">
            이항 원리: 등호를 넘어가면 부호가 반대로 바뀐다!
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button class="tool-btn" style="background:#fef3c7; color:#b45309; font-weight:700;" onclick="setTransStep(1)">1단계: 좌변 +5 항 출발 대기</button>
          <button class="tool-btn" style="background:#fee2e2; color:#b91c1c; font-weight:700;" onclick="setTransStep(2)">2단계: 등호(=) 다리 통과 중 (+5 ➔ -5 부호 반전!)</button>
          <button class="tool-btn" style="background:#dcfce7; color:#15803d; font-weight:800;" onclick="setTransStep(3)">3단계: 우변 안착 ➔ 3x = 11 - 5 = 6 (x = 2)</button>
        </div>
      `;
    }
    renderTranspositionCanvas(two, simState.transStep);
  }
  else if (code === '4-2') {
    // [교과서 94쪽] 일차방정식 풀이 4단계 표준 알고리즘
    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#047857; font-size:0.92rem;">📋 일차방정식 풀이 4단계 알고리즘: 5x - 4 = 2x + 5</span>
          <span id="alg-badge" style="background:#ecfdf5; color:#047857; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #a7f3d0;">
            표준 풀이 단계 진행
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button class="tool-btn" style="background:#ecfdf5; color:#047857; font-weight:700;" onclick="setAlgStep(1)">1단계: 이항 (5x - 2x = 5 + 4)</button>
          <button class="tool-btn" style="background:#ecfdf5; color:#047857; font-weight:700;" onclick="setAlgStep(2)">2단계: ax = b 정리 (3x = 9)</button>
          <button class="tool-btn" style="background:#ecfdf5; color:#047857; font-weight:700;" onclick="setAlgStep(3)">3단계: 양변 3으로 나누기 (x = 3)</button>
          <button class="tool-btn" style="background:#dcfce7; color:#15803d; font-weight:800;" onclick="setAlgStep(4)">4단계: 검산 (좌변 11 = 우변 11 참!)</button>
        </div>
      `;
    }
    renderAlgStepsCanvas(two, simState.algStep);
  }
  else if (code === '4-3') {
    // [교과서 96~97쪽] 복잡한 일차방정식 계수 정수화 마법
    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#7c3aed; font-size:0.92rem;">🧙 복잡한 일차방정식 계수 정수화 마법 (교과서 96~97쪽)</span>
          <span id="magic-badge" style="background:#f5f3ff; color:#6d28d9; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #ddd6fe;">
            계수를 정수로 변환하기
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button class="tool-btn" style="background:#f5f3ff; color:#6d28d9; font-weight:700;" onclick="setMagicMode('decimal')">소수: 0.3x - 0.2 = 0.7 ➔ 양변 ×10 ➔ 3x - 2 = 7</button>
          <button class="tool-btn" style="background:#f5f3ff; color:#6d28d9; font-weight:700;" onclick="setMagicMode('fraction')">분수: x/2 - x/3 = 1 ➔ 양변 ×6 ➔ 3x - 2x = 6</button>
          <button class="tool-btn" style="background:#f5f3ff; color:#6d28d9; font-weight:700;" onclick="setMagicMode('bracket')">괄호: 2(x - 1) = x + 3 ➔ 분배법칙 ➔ 2x - 2 = x + 3</button>
        </div>
      `;
    }
    renderMagicEqCanvas(two, simState.magicMode);
  }
  else if (code === '5-1') {
    // [교과서 99쪽] 연속하는 세 자연수의 합 모델
    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#0369a1; font-size:0.92rem;">📏 연속하는 세 자연수의 합: (x-1) + x + (x+1) = 57</span>
          <span id="consec-badge" style="background:#e0f2fe; color:#0369a1; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #bae6fd;">
            현재 가운데 수 x = ${simState.consecX} (합: ${3 * simState.consecX})
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button class="tool-btn" style="background:#e0f2fe; color:#0369a1; font-weight:700;" onclick="setConsecX(18)">x = 18 (17+18+19 = 54 &lt; 57)</button>
          <button class="tool-btn" style="background:#dcfce7; color:#15803d; font-weight:800;" onclick="setConsecX(19)">✨ x = 19 (18+19+20 = 57 [정답!])</button>
          <button class="tool-btn" style="background:#e0f2fe; color:#0369a1; font-weight:700;" onclick="setConsecX(20)">x = 20 (19+20+21 = 60 &gt; 57)</button>
        </div>
      `;
    }
    renderConsecutiveCanvas(two, simState.consecX);
  }
  else if (code === '5-2') {
    // [교과서 102쪽 창의 프로젝트] 생각한 수 맞추기 수학 마술사
    if (simController) {
      simController.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-weight:800; color:#4338ca; font-size:0.92rem;">🎩 생각한 수 맞추기 수학 마술사 (교과서 102쪽)</span>
          <span id="magic-step-badge" style="background:#eef2ff; color:#4338ca; font-weight:800; padding:3px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #c7d2fe;">
            마술 단계: ${simState.magicStep}단계 (x = ${simState.magicX})
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <span style="font-size:0.82rem; font-weight:700;">처음 생각한 수 x:</span>
          <input type="number" id="sim-magic-input" min="1" max="99" value="${simState.magicX}" style="width:60px; padding:3px 6px; font-weight:800; text-align:center; border:2px solid #cbd5e1; border-radius:6px;" onchange="setMagicX(this.value)">
          <button class="tool-btn" style="background:#eef2ff; color:#4338ca;" onclick="setMagicStep(1)">1단계: x</button>
          <button class="tool-btn" style="background:#eef2ff; color:#4338ca;" onclick="setMagicStep(2)">2단계: +4</button>
          <button class="tool-btn" style="background:#eef2ff; color:#4338ca;" onclick="setMagicStep(3)">3단계: ×2</button>
          <button class="tool-btn" style="background:#eef2ff; color:#4338ca;" onclick="setMagicStep(4)">4단계: -6</button>
          <button class="tool-btn" style="background:#eef2ff; color:#4338ca;" onclick="setMagicStep(5)">5단계: ÷2</button>
          <button class="tool-btn" style="background:#dcfce7; color:#15803d; font-weight:800;" onclick="setMagicStep(6)">✨ 6단계: -x [마술 완성!]</button>
        </div>
      `;
    }
    renderMathMagicCanvas(two, simState.magicX, simState.magicStep);
  }
  else {
    renderDefaultConceptCanvas(two, code, simController);
  }
}

// --- TWO.JS DETAILED SIMULATOR DRAWERS ---

function renderBoxScaleCanvas(two, boxVal) {
  two.clear();
  const cx = two.width / 2, cy = 180;
  const title = two.makeText('3 × □ + 5 = 20 수평 저울 탐구 (교과서 68쪽)', cx, 30);
  title.size = 15; title.weight = 800; title.fill = '#1e293b';

  const leftWeight = 3 * boxVal + 5;
  const rightWeight = 20;
  const diff = leftWeight - rightWeight;
  const angle = Math.max(-0.25, Math.min(0.25, diff * 0.025));

  // Stand
  const stand = two.makePolygon(cx, cy + 100, 45, 3);
  stand.fill = '#94a3b8'; stand.stroke = '#64748b'; stand.linewidth = 2;
  const pin = two.makeCircle(cx, cy, 8);
  pin.fill = '#334155';

  // Beam group
  const beamGroup = two.makeGroup();
  const beam = two.makeLine(-170, 0, 170, 0);
  beam.linewidth = 6; beam.stroke = '#334155';
  beamGroup.add(beam);

  // Left pan
  const leftPan = two.makeLine(-150, 0, -150, 60);
  leftPan.linewidth = 2; leftPan.stroke = '#2563eb';
  const leftPlate = two.makeLine(-195, 60, -105, 60);
  leftPlate.linewidth = 5; leftPlate.stroke = '#2563eb';
  beamGroup.add(leftPan, leftPlate);

  // Left weights on pan
  for (let i = 0; i < 3; i++) {
    const b = two.makeRectangle(-180 + i * 30, 45, 24, 24);
    b.fill = '#bfdbfe'; b.stroke = '#2563eb'; b.linewidth = 1.5;
    const bt = two.makeText('□', -180 + i * 30, 45);
    bt.size = 13; bt.weight = 800; bt.fill = '#1d4ed8';
    beamGroup.add(b, bt);
  }
  const w5 = two.makeCircle(-150, 20, 10);
  w5.fill = '#fed7aa'; w5.stroke = '#ea580c'; w5.linewidth = 1.5;
  const w5t = two.makeText('+5', -150, 20);
  w5t.size = 10; w5t.weight = 800; w5t.fill = '#c2410c';
  beamGroup.add(w5, w5t);

  // Right pan
  const rightPan = two.makeLine(150, 0, 150, 60);
  rightPan.linewidth = 2; rightPan.stroke = '#059669';
  const rightPlate = two.makeLine(105, 60, 195, 60);
  rightPlate.linewidth = 5; rightPlate.stroke = '#059669';
  beamGroup.add(rightPan, rightPlate);

  // Right weight 20
  const rw = two.makeRectangle(150, 40, 50, 34);
  rw.fill = '#bbf7d0'; rw.stroke = '#059669'; rw.linewidth = 2;
  const rwt = two.makeText('20', 150, 40);
  rwt.size = 16; rwt.weight = 800; rwt.fill = '#15803d';
  beamGroup.add(rw, rwt);

  beamGroup.translation.set(cx, cy);
  beamGroup.rotation = angle;

  // Status info text below
  const statusBox = two.makeRectangle(cx, cy + 135, 380, 40);
  statusBox.linewidth = 1.5;
  let msg = '';
  if (boxVal === 5) {
    statusBox.fill = '#f0fdf4'; statusBox.stroke = '#22c55e';
    msg = '✨ 완벽한 수평 균형! 3 × 5 + 5 = 20 ➔ □의 값은 5입니다.';
  } else if (boxVal < 5) {
    statusBox.fill = '#eff6ff'; statusBox.stroke = '#3b82f6';
    msg = `⚖️ 오른쪽으로 기울어짐: 좌변 ${leftWeight} < 우변 20 (□를 늘리세요)`;
  } else {
    statusBox.fill = '#fef2f2'; statusBox.stroke = '#ef4444';
    msg = `⚖️ 왼쪽으로 기울어짐: 좌변 ${leftWeight} > 우변 20 (□를 줄이세요)`;
  }
  const stText = two.makeText(msg, cx, cy + 135);
  stText.size = 13; stText.weight = 700;
  stText.fill = (boxVal === 5) ? '#15803d' : (boxVal < 5 ? '#1e40af' : '#b91c1c');

  two.update();
}

function renderRatioBarCanvas(two, ratioStr) {
  two.clear();
  const cx = two.width / 2, cy = 160;
  const title = two.makeText('비와 비율 막대 모델 (전체에 대한 부분의 비율)', cx, 35);
  title.size = 15; title.weight = 800; title.fill = '#1e293b';

  const parts = ratioStr.split('/').map(Number);
  const num = parts[0] || 20;
  const den = parts[1] || 50;
  const fraction = num / den;

  // Total bar (50)
  const barW = 340, barH = 40;
  const totalBar = two.makeRectangle(cx, cy - 20, barW, barH);
  totalBar.fill = '#f1f5f9'; totalBar.stroke = '#94a3b8'; totalBar.linewidth = 2;

  // Filled portion
  const fillW = barW * fraction;
  const filledBar = two.makeRectangle(cx - barW / 2 + fillW / 2, cy - 20, fillW, barH);
  filledBar.fill = '#38bdf8'; filledBar.stroke = '#0284c7'; filledBar.linewidth = 2;

  // Labels
  const lbl1 = two.makeText(`해당 인원: ${num}명`, cx - barW / 2 + fillW / 2, cy - 20);
  lbl1.size = 13; lbl1.weight = 800; lbl1.fill = '#0369a1';

  const lbl2 = two.makeText(`전체 인원: ${den}명`, cx, cy + 35);
  lbl2.size = 13; lbl2.weight = 700; lbl2.fill = '#64748b';

  const ratioCard = two.makeRectangle(cx, cy + 90, 360, 48);
  ratioCard.fill = '#f0fdf4'; ratioCard.stroke = '#22c55e'; ratioCard.linewidth = 1.5;
  const ratioTxt = two.makeText(`비율 = ${num}/${den} = ${(num/den).toFixed(2)} (${Math.round(fraction*100)}%)`, cx, cy + 90);
  ratioTxt.size = 15; ratioTxt.weight = 800; ratioTxt.fill = '#15803d';

  two.update();
}

function renderReverseCalcCanvas(two, step) {
  two.clear();
  const cx = two.width / 2, cy = 160;
  const title = two.makeText('거꾸로 계산하기 (역연산 다이어그램)', cx, 30);
  title.size = 15; title.weight = 800; title.fill = '#1e293b';

  // Forward step line
  two.makeText('정방향: 어떤 수 □ 에 4를 더한 후 3을 곱함 ➔ 27', cx, 65).weight = 700;

  // 3 boxes
  const b1 = two.makeRectangle(cx - 130, 110, 70, 40);
  b1.fill = '#eff6ff'; b1.stroke = '#3b82f6';
  two.makeText('□', cx - 130, 110).size = 16;

  const a1 = two.makeText('➔ (+4) ➔', cx - 50, 110);
  a1.size = 12; a1.fill = '#64748b';

  const b2 = two.makeRectangle(cx + 30, 110, 70, 40);
  b2.fill = '#eff6ff'; b2.stroke = '#3b82f6';
  two.makeText('□ + 4', cx + 30, 110).size = 14;

  const a2 = two.makeText('➔ (×3) ➔', cx + 110, 110);
  a2.size = 12; a2.fill = '#64748b';

  const b3 = two.makeRectangle(cx + 170, 110, 60, 40);
  b3.fill = '#fef3c7'; b3.stroke = '#f59e0b';
  two.makeText('27', cx + 170, 110).size = 16;

  // Reverse step line below
  const revCard = two.makeRectangle(cx, 210, 380, 75);
  revCard.fill = '#f0fdf4'; revCard.stroke = '#16a34a'; revCard.linewidth = 2;

  let r1 = '역방향 1단계: 27 ÷ 3 = 9';
  let r2 = '역방향 2단계: 9 - 4 = 5 ➔ 어떤 수 □ = 5';
  if (step === 0) {
    r1 = '대기: 우측 [2단계: 27 ÷ 3 = 9] 버튼을 눌러보세요';
    r2 = '';
  } else if (step === 1) {
    r2 = '진행 중: 우측 [3단계: 9 - 4 = 5] 버튼을 눌러 마무리하세요';
  }
  const rt1 = two.makeText(r1, cx, 195);
  rt1.size = 13; rt1.weight = 800; rt1.fill = '#15803d';
  const rt2 = two.makeText(r2, cx, 225);
  rt2.size = 13; rt2.weight = 800; rt2.fill = '#047857';

  two.update();
}

function renderReceiptCanvas(two, qty) {
  two.clear();
  const cx = two.width / 2, cy = 160;
  const title = two.makeText('🍦 아이스크림 구매 영수증 (교과서 70쪽)', cx, 30);
  title.size = 15; title.weight = 800; title.fill = '#1e293b';

  // Receipt paper
  const paper = two.makeRectangle(cx, cy + 20, 280, 220);
  paper.fill = '#ffffff'; paper.stroke = '#cbd5e1'; paper.linewidth = 2;

  const rTitle = two.makeText('=== PANGPANG RECEIPT ===', cx, cy - 65);
  rTitle.size = 12; rTitle.weight = 700; rTitle.fill = '#64748b';

  const line1 = two.makeLine(cx - 120, cy - 45, cx + 120, cy - 45);
  line1.stroke = '#e2e8f0'; line1.linewidth = 1;

  const itemTxt = two.makeText(`바닐라 아이스크림 (x = ${qty}개)`, cx - 30, cy - 25);
  itemTxt.size = 13; itemTxt.weight = 700; itemTxt.fill = '#1e293b';

  const unitTxt = two.makeText(`단가: 3,500원`, cx - 50, cy);
  unitTxt.size = 12; unitTxt.fill = '#64748b';

  const line2 = two.makeLine(cx - 120, cy + 25, cx + 120, cy + 25);
  line2.stroke = '#e2e8f0'; line2.linewidth = 1;

  const totalTxt = two.makeText(`합계: ${(3500 * qty).toLocaleString()} 원`, cx, cy + 50);
  totalTxt.size = 16; totalTxt.weight = 800; totalTxt.fill = '#2563eb';

  const exprTxt = two.makeText(`문자를 사용한 식: 3500 × x (원)`, cx, cy + 85);
  exprTxt.size = 13; exprTxt.weight = 800; exprTxt.fill = '#059669';

  two.update();
}

function renderSymbolOmissionCanvas(two, ruleIdx) {
  two.clear();
  const cx = two.width / 2, cy = 160;
  const title = two.makeText('곱셈·나눗셈 기호 생략 규칙 (교과서 72~73쪽)', cx, 30);
  title.size = 15; title.weight = 800; title.fill = '#1e293b';

  const rules = [
    { before: 'a × (-3)', after: '-3a', note: '수는 문자 앞에 쓴다. (1 또는 -1에서 1은 생략)' },
    { before: 'x ÷ 4', after: 'x / 4', note: '나눗셈 기호 ÷는 생략하고 분수의 꼴로 나타낸다.' },
    { before: 'a × b × a', after: 'a²b', note: '문자는 보통 알파벳 순서로, 같은 문자는 거듭제곱으로 나타낸다.' },
    { before: '(x + y) ÷ 2', after: '(x + y) / 2', note: '괄호가 있는 식의 나눗셈도 괄호를 분자로 하여 분수 꼴로 쓴다.' }
  ];
  const cur = rules[ruleIdx] || rules[0];

  // Left before box
  const bBox = two.makeRectangle(cx - 100, cy - 20, 140, 60);
  bBox.fill = '#f8fafc'; bBox.stroke = '#94a3b8'; bBox.linewidth = 1.5;
  const bTxt = two.makeText(cur.before, cx - 100, cy - 20);
  bTxt.size = 16; bTxt.weight = 800; bTxt.fill = '#475569';

  // Middle arrow
  const arr = two.makeText('✂️ ➔', cx, cy - 20);
  arr.size = 20;

  // Right after box
  const aBox = two.makeRectangle(cx + 100, cy - 20, 140, 60);
  aBox.fill = '#fae8ff'; aBox.stroke = '#c026d3'; aBox.linewidth = 2;
  const aTxt = two.makeText(cur.after, cx + 100, cy - 20);
  aTxt.size = 18; aTxt.weight = 900; aTxt.fill = '#9333ea';

  // Explanation note box
  const noteBox = two.makeRectangle(cx, cy + 65, 380, 50);
  noteBox.fill = '#fdf4ff'; noteBox.stroke = '#f0abfc'; noteBox.linewidth = 1.5;
  const noteTxt = two.makeText(cur.note, cx, cy + 65);
  noteTxt.size = 12; noteTxt.weight = 700; noteTxt.fill = '#a21caf';

  two.update();
}

function renderBookGaugeCanvas(two, days) {
  two.clear();
  const cx = two.width / 2, cy = 160;
  const title = two.makeText('📖 400쪽 독서 진행 게이지 (교과서 76쪽)', cx, 30);
  title.size = 15; title.weight = 800; title.fill = '#1e293b';

  const totalPages = 400;
  const pagesPerDay = 10;
  const readPages = Math.min(400, days * pagesPerDay);
  const remainPages = Math.max(0, totalPages - readPages);

  // Gauge bar background
  const barW = 340, barH = 34;
  const bgBar = two.makeRectangle(cx, cy - 30, barW, barH);
  bgBar.fill = '#e2e8f0'; bgBar.stroke = '#94a3b8'; bgBar.linewidth = 1.5;

  // Read portion
  const readW = (readPages / totalPages) * barW;
  if (readW > 0) {
    const rBar = two.makeRectangle(cx - barW / 2 + readW / 2, cy - 30, readW, barH);
    rBar.fill = '#22c55e'; rBar.stroke = '#16a34a'; rBar.linewidth = 1;
  }

  // Remaining portion
  const remW = barW - readW;
  if (remW > 0) {
    const remBar = two.makeRectangle(cx + barW / 2 - remW / 2, cy - 30, remW, barH);
    remBar.fill = '#38bdf8'; remBar.stroke = '#0284c7'; remBar.linewidth = 1;
  }

  // Bar text labels
  const readLbl = two.makeText(`읽은 쪽수: ${readPages}쪽 (${days}일 × 10쪽)`, cx - 80, cy + 15);
  readLbl.size = 12; readLbl.weight = 700; readLbl.fill = '#15803d';

  const remLbl = two.makeText(`남은 쪽수: ${remainPages}쪽`, cx + 90, cy + 15);
  remLbl.size = 12; remLbl.weight = 700; remLbl.fill = '#0369a1';

  // Formula card
  const formCard = two.makeRectangle(cx, cy + 70, 360, 50);
  formCard.fill = '#f0fdf4'; formCard.stroke = '#22c55e'; formCard.linewidth = 2;
  const formTxt = two.makeText(`남은 쪽수의 식: 400 - 10x ➔ x=${days} 대입 시 ${remainPages}쪽`, cx, cy + 70);
  formTxt.size = 13; formTxt.weight = 800; formTxt.fill = '#166534';

  two.update();
}

function renderNegSubstituteCanvas(two, exprIdx) {
  two.clear();
  const cx = two.width / 2, cy = 160;
  const title = two.makeText('🛡️ 음수 대입 시 괄호 보호막 (x = -2) [교과서 77쪽]', cx, 30);
  title.size = 15; title.weight = 800; title.fill = '#1e293b';

  const items = [
    { exp: '-x', shield: '- ( -2 )', res: '+2', desc: '앞의 마이너스와 음수의 마이너스가 만나 +2가 됨' },
    { exp: 'x²', shield: '( -2 )²', res: '+4', desc: '(-2) × (-2) = +4 (음수 곱하기 음수는 양수)' },
    { exp: '-x²', shield: '- ( -2 )²', res: '-4', desc: '거듭제곱을 먼저 계산 (-2)² = 4 한 뒤 마이너스 부호 붙음 ➔ -4' },
    { exp: '3 - 2x', shield: '3 - 2( -2 )', res: '7', desc: '곱셈 먼저: -2 × (-2) = +4, 따라서 3 + 4 = 7' }
  ];
  const cur = items[exprIdx] || items[0];

  // Card
  const card = two.makeRectangle(cx, cy, 360, 160);
  card.fill = '#fff7ed'; card.stroke = '#ea580c'; card.linewidth = 2;

  const t1 = two.makeText(`원래 식: ${cur.exp}`, cx, cy - 50);
  t1.size = 16; t1.weight = 800; t1.fill = '#9a3412';

  const t2 = two.makeText(`🛡️ 괄호 대입: ${cur.shield}`, cx, cy - 15);
  t2.size = 18; t2.weight = 900; t2.fill = '#c2410c';

  const t3 = two.makeText(`계산 결과 = ${cur.res}`, cx, cy + 22);
  t3.size = 17; t3.weight = 800; t3.fill = '#15803d';

  const t4 = two.makeText(cur.desc, cx, cy + 55);
  t4.size = 12; t4.weight = 600; t4.fill = '#64748b';

  two.update();
}

function renderPolyStructureCanvas(two, mode) {
  two.clear();
  const cx = two.width / 2, cy = 160;
  const title = two.makeText('🔬 다항식 3x² - 5x + 7 구조 해부도 (교과서 80쪽)', cx, 30);
  title.size = 15; title.weight = 800; title.fill = '#1e293b';

  // 3 Term blocks
  const t1 = two.makeRectangle(cx - 120, cy - 20, 95, 70);
  t1.fill = (mode === 'coef2' || mode === 'all') ? '#dbeafe' : '#f8fafc';
  t1.stroke = (mode === 'coef2') ? '#1d4ed8' : '#cbd5e1';
  t1.linewidth = (mode === 'coef2') ? 3 : 1.5;
  two.makeText('3x²', cx - 120, cy - 30).size = 18;
  two.makeText('x²의 계수: 3', cx - 120, cy - 5).size = 11;
  two.makeText('차수: 2', cx - 120, cy + 10).size = 11;

  const t2 = two.makeRectangle(cx, cy - 20, 95, 70);
  t2.fill = (mode === 'coef1' || mode === 'all') ? '#fee2e2' : '#f8fafc';
  t2.stroke = (mode === 'coef1') ? '#dc2626' : '#cbd5e1';
  t2.linewidth = (mode === 'coef1') ? 3 : 1.5;
  two.makeText('-5x', cx, cy - 30).size = 18;
  two.makeText('x의 계수: -5', cx, cy - 5).size = 11;
  two.makeText('차수: 1', cx, cy + 10).size = 11;

  const t3 = two.makeRectangle(cx + 120, cy - 20, 95, 70);
  t3.fill = (mode === 'const' || mode === 'all') ? '#fef3c7' : '#f8fafc';
  t3.stroke = (mode === 'const') ? '#d97706' : '#cbd5e1';
  t3.linewidth = (mode === 'const') ? 3 : 1.5;
  two.makeText('+7', cx + 120, cy - 30).size = 18;
  two.makeText('상수항: 7', cx + 120, cy - 5).size = 11;
  two.makeText('차수: 0', cx + 120, cy + 10).size = 11;

  // Bottom info
  const infoBox = two.makeRectangle(cx, cy + 70, 360, 46);
  infoBox.fill = '#f0fdf4'; infoBox.stroke = '#22c55e'; infoBox.linewidth = 1.5;
  let msg = '다항식의 차수: 가장 높은 차수인 2차 (이 다항식은 2차식입니다)';
  if (mode === 'coef1') msg = '⚠️ 주의: x의 계수는 5가 아니라 부호를 포함한 -5 입니다!';
  if (mode === 'const') msg = '상수항: 수만으로 이루어진 항 ➔ 7';
  const itxt = two.makeText(msg, cx, cy + 70);
  itxt.size = 12; itxt.weight = 800; itxt.fill = '#15803d';

  two.update();
}

function renderRectDistCanvas(two, mode) {
  two.clear();
  const cx = two.width / 2, cy = 160;
  const title = two.makeText('📐 직사각형 넓이 모델과 분배법칙 (교과서 82쪽)', cx, 30);
  title.size = 15; title.weight = 800; title.fill = '#1e293b';

  // Rectangle left (3 * x)
  const r1 = two.makeRectangle(cx - 50, cy - 10, 140, 90);
  r1.fill = '#93c5fd'; r1.stroke = '#2563eb'; r1.linewidth = 2;
  two.makeText('가로: x', cx - 50, cy - 70).size = 13;
  two.makeText('넓이: 3x', cx - 50, cy - 10).size = 16;

  // Rectangle right (3 * 2)
  const r2 = two.makeRectangle(cx + 70, cy - 10, 80, 90);
  r2.fill = '#fde047'; r2.stroke = '#ca8a04'; r2.linewidth = 2;
  two.makeText('가로: 2', cx + 70, cy - 70).size = 13;
  two.makeText('넓이: 6', cx + 70, cy - 10).size = 16;

  // Left vertical height label
  two.makeText('세로: 3', cx - 150, cy - 10).size = 14;

  // Bottom formula
  const fBox = two.makeRectangle(cx, cy + 75, 360, 42);
  fBox.fill = '#eff6ff'; fBox.stroke = '#3b82f6'; fBox.linewidth = 1.5;
  const fTxt = two.makeText('전체 넓이 = 3(x + 2) = 3 × x + 3 × 2 = 3x + 6', cx, cy + 75);
  fTxt.size = 13; fTxt.weight = 800; fTxt.fill = '#1d4ed8';

  two.update();
}

function renderLikeTermTilesCanvas(two, step) {
  two.clear();
  const cx = two.width / 2, cy = 160;
  const title = two.makeText('🟩 동류항 대수 막대 타일 모으기 (교과서 84쪽)', cx, 30);
  title.size = 15; title.weight = 800; title.fill = '#1e293b';

  two.makeText('식: (4x + 3) + (2x - 5)', cx, 60).size = 14;

  // Step 1: Split
  if (step === 'split') {
    two.makeText('[1단계: 타일 나열]', cx, 95).size = 13;
    // Group A: 4x, +3
    for (let i = 0; i < 4; i++) {
      const r = two.makeRectangle(cx - 150 + i * 22, 135, 18, 50);
      r.fill = '#86efac'; r.stroke = '#16a34a';
      two.makeText('x', cx - 150 + i * 22, 135).size = 11;
    }
    for (let i = 0; i < 3; i++) {
      const c = two.makeRectangle(cx - 40 + i * 20, 135, 16, 16);
      c.fill = '#fde047'; c.stroke = '#ca8a04';
      two.makeText('+1', cx - 40 + i * 20, 135).size = 9;
    }

    // Group B: 2x, -5
    for (let i = 0; i < 2; i++) {
      const r = two.makeRectangle(cx + 45 + i * 22, 135, 18, 50);
      r.fill = '#86efac'; r.stroke = '#16a34a';
      two.makeText('x', cx + 45 + i * 22, 135).size = 11;
    }
    for (let i = 0; i < 5; i++) {
      const c = two.makeRectangle(cx + 105 + i * 18, 135, 16, 16);
      c.fill = '#fca5a5'; c.stroke = '#dc2626';
      two.makeText('-1', cx + 105 + i * 18, 135).size = 9;
    }
  }
  // Step 2: Merge like terms
  else if (step === 'merge') {
    two.makeText('[2단계: 동류항끼리 모으기 (4x+2x) + (3-5)]', cx, 95).size = 13;
    // 6 x-bars together
    for (let i = 0; i < 6; i++) {
      const r = two.makeRectangle(cx - 130 + i * 24, 135, 20, 55);
      r.fill = '#86efac'; r.stroke = '#16a34a';
      two.makeText('x', cx - 130 + i * 24, 135).size = 12;
    }
    // Constants side by side
    for (let i = 0; i < 3; i++) {
      const c = two.makeRectangle(cx + 40 + i * 22, 125, 18, 18);
      c.fill = '#fde047'; c.stroke = '#ca8a04';
      two.makeText('+1', cx + 40 + i * 22, 125).size = 10;
    }
    for (let i = 0; i < 5; i++) {
      const c = two.makeRectangle(cx + 40 + i * 22, 155, 18, 18);
      c.fill = '#fca5a5'; c.stroke = '#dc2626';
      two.makeText('-1', cx + 40 + i * 22, 155).size = 10;
    }
  }
  // Step 3: Cancel and result
  else {
    two.makeText('[3단계: (+1)+(-1)=0 상쇄 및 최종 정리]', cx, 95).size = 13;
    for (let i = 0; i < 6; i++) {
      const r = two.makeRectangle(cx - 120 + i * 25, 135, 20, 55);
      r.fill = '#86efac'; r.stroke = '#16a34a';
      two.makeText('x', cx - 120 + i * 25, 135).size = 12;
    }
    for (let i = 0; i < 2; i++) {
      const c = two.makeRectangle(cx + 65 + i * 24, 135, 20, 20);
      c.fill = '#fca5a5'; c.stroke = '#dc2626';
      two.makeText('-1', cx + 65 + i * 24, 135).size = 11;
    }

    const resBox = two.makeRectangle(cx, 205, 340, 36);
    resBox.fill = '#f0fdf4'; resBox.stroke = '#16a34a'; resBox.linewidth = 2;
    const resTxt = two.makeText('최종 정리 결과: 6x - 2', cx, 205);
    resTxt.size = 15; resTxt.weight = 800; resTxt.fill = '#15803d';
  }

  two.update();
}

function renderBracketDistCanvas(two, step) {
  two.clear();
  const cx = two.width / 2, cy = 160;
  const title = two.makeText('🔀 괄호 앞 마이너스 부호 분배 (교과서 85쪽)', cx, 30);
  title.size = 15; title.weight = 800; title.fill = '#1e293b';

  const card = two.makeRectangle(cx, cy, 370, 160);
  card.fill = '#fff7ed'; card.stroke = '#ea580c'; card.linewidth = 2;

  two.makeText('원래 식: (3x + 2) - (2x - 3)', cx, cy - 50).size = 16;

  let line2 = '대기: 아래 버튼으로 부호를 분배해 보세요.';
  let line3 = '';
  if (step >= 2) {
    line2 = '⚡ 괄호 풀기: 3x + 2 - 2x + 3  (부호 반전!)';
  }
  if (step >= 3) {
    line3 = '✨ 동류항 정리: (3-2)x + (2+3) = x + 5';
  }

  const t2 = two.makeText(line2, cx, cy - 10);
  t2.size = 14; t2.weight = 800; t2.fill = (step >= 2) ? '#c2410c' : '#64748b';

  const t3 = two.makeText(line3, cx, cy + 30);
  t3.size = 15; t3.weight = 900; t3.fill = '#15803d';

  two.update();
}

function renderEqVsIdentityCanvas(two, eqType, xVal) {
  two.clear();
  const cx = two.width / 2, cy = 175;
  const title = two.makeText('⚖️ 등식과 항등식 판정 저울 (교과서 86쪽)', cx, 30);
  title.size = 15; title.weight = 800; title.fill = '#1e293b';

  let leftVal = 0, rightVal = 0, eqText = '';
  if (eqType === 'equation') {
    leftVal = 2 * xVal + 1;
    rightVal = 5;
    eqText = `방정식: 2x + 1 = 5 (현재 x=${xVal} 대입)`;
  } else {
    leftVal = 2 * (xVal + 1);
    rightVal = 2 * xVal + 2;
    eqText = `항등식: 2(x + 1) = 2x + 2 (현재 x=${xVal} 대입)`;
  }

  two.makeText(eqText, cx, 60).size = 14;

  const diff = leftVal - rightVal;
  const angle = Math.max(-0.25, Math.min(0.25, diff * 0.03));

  // Stand
  two.makePolygon(cx, cy + 90, 40, 3).fill = '#94a3b8';
  two.makeCircle(cx, cy, 7).fill = '#334155';

  // Beam group
  const bg = two.makeGroup();
  bg.add(two.makeLine(-150, 0, 150, 0));
  bg.add(two.makeLine(-130, 0, -130, 50));
  bg.add(two.makeLine(-170, 50, -90, 50));
  bg.add(two.makeLine(130, 0, 130, 50));
  bg.add(two.makeLine(90, 50, 170, 50));

  const lt = two.makeText(`좌변: ${leftVal}`, -130, 30);
  lt.size = 14; lt.weight = 800;
  const rt = two.makeText(`우변: ${rightVal}`, 130, 30);
  rt.size = 14; rt.weight = 800;
  bg.add(lt, rt);

  bg.translation.set(cx, cy);
  bg.rotation = angle;

  // Status card below
  const sc = two.makeRectangle(cx, cy + 120, 380, 42);
  sc.linewidth = 1.5;
  let msg = '';
  if (leftVal === rightVal) {
    sc.fill = '#f0fdf4'; sc.stroke = '#22c55e';
    msg = `✨ 수평 일치! (${leftVal} = ${rightVal}) ➔ 등식이 성립함 (참)`;
  } else {
    sc.fill = '#fef2f2'; sc.stroke = '#ef4444';
    msg = `기울어짐 (좌변 ${leftVal} ≠ 우변 ${rightVal}) ➔ 등식이 성립하지 않음 (거짓)`;
  }
  const st = two.makeText(msg, cx, cy + 120);
  st.size = 12; st.weight = 800; st.fill = (leftVal === rightVal) ? '#15803d' : '#b91c1c';

  two.update();
}

function renderSolutionFinderCanvas(two, xVal) {
  two.clear();
  const cx = two.width / 2, cy = 160;
  const title = two.makeText('💡 방정식의 해 판별기: 3x - 2 = 7 (교과서 87쪽)', cx, 30);
  title.size = 15; title.weight = 800; title.fill = '#1e293b';

  const leftVal = 3 * xVal - 2;
  const rightVal = 7;
  const isSol = (leftVal === rightVal);

  const card = two.makeRectangle(cx, cy, 360, 150);
  card.fill = isSol ? '#f0fdf4' : '#fff1f2';
  card.stroke = isSol ? '#22c55e' : '#f43f5e';
  card.linewidth = 2;

  two.makeText(`대입한 미지수의 값: x = ${xVal}`, cx, cy - 45).size = 14;
  two.makeText(`좌변: 3 × ${xVal} - 2 = ${leftVal}`, cx, cy - 15).size = 16;
  two.makeText(`우변: 7`, cx, cy + 15).size = 16;

  const led = two.makeText(isSol ? '🏆 [참] x = 3 은 이 방정식의 해(근)입니다!' : '❌ [거짓] 좌변과 우변이 같지 않으므로 해가 아닙니다.', cx, cy + 50);
  led.size = 13; led.weight = 800; led.fill = isSol ? '#15803d' : '#be123c';

  two.update();
}

function renderPropertiesCanvas(two, act) {
  two.clear();
  const cx = two.width / 2, cy = 160;
  const title = two.makeText('⚖️ 등식의 성질 양팔 저울 실험실 (교과서 88~89쪽)', cx, 30);
  title.size = 15; title.weight = 800; title.fill = '#1e293b';

  let lEq = 'x - 3', rEq = '5', desc = '원래 방정식: x - 3 = 5 (평형 상태)';
  if (act === 'add3') {
    lEq = 'x'; rEq = '8';
    desc = '✨ 양변에 +3을 더하여 좌변에 x만 남김! 해는 x = 8 입니다.';
  } else if (act === 'sub3') {
    lEq = 'x - 6'; rEq = '2';
    desc = '양변에서 -3을 빼도 등식은 성립하지만, 좌변이 복잡해집니다.';
  } else if (act === 'mul2') {
    lEq = '2x - 6'; rEq = '10';
    desc = '양변에 2를 곱해도 평형은 완벽히 유지됩니다.';
  }

  // Stand
  two.makePolygon(cx, cy + 80, 40, 3).fill = '#94a3b8';
  two.makeCircle(cx, cy, 7).fill = '#334155';

  // Horizontal beam
  const beam = two.makeLine(cx - 150, cy, cx + 150, cy);
  beam.linewidth = 6; beam.stroke = '#334155';

  // Left pan
  two.makeLine(cx - 130, cy, cx - 130, cy + 50).stroke = '#2563eb';
  two.makeLine(cx - 170, cy + 50, cx - 90, cy + 50).stroke = '#2563eb';
  const lt = two.makeText(lEq, cx - 130, cy + 30);
  lt.size = 16; lt.weight = 800; lt.fill = '#1d4ed8';

  // Right pan
  two.makeLine(cx + 130, cy, cx + 130, cy + 50).stroke = '#059669';
  two.makeLine(cx + 90, cy + 50, cx + 170, cy + 50).stroke = '#059669';
  const rt = two.makeText(rEq, cx + 130, cy + 30);
  rt.size = 16; rt.weight = 800; rt.fill = '#047857';

  // Info banner
  const ib = two.makeRectangle(cx, cy + 115, 380, 40);
  ib.fill = (act === 'add3') ? '#f0fdf4' : '#eff6ff';
  ib.stroke = (act === 'add3') ? '#22c55e' : '#3b82f6';
  const it = two.makeText(desc, cx, cy + 115);
  it.size = 12; it.weight = 800; it.fill = (act === 'add3') ? '#15803d' : '#1e40af';

  two.update();
}

function renderPropQuizCanvas(two, idx) {
  two.clear();
  const cx = two.width / 2, cy = 150;
  const title = two.makeText('⚖️ 등식의 성질 4대 기본 법칙 & OX 원리 칠판 (교과서 90쪽)', cx, 30);
  title.size = 14; title.weight = 800; title.fill = '#0369a1';

  const props = [
    { name: '1. 덧셈의 성질', form: 'a = b 이면  a + c = b + c', desc: '양변에 같은 수를 더해도 등식은 항상 성립합니다.', isTrue: true, col: '#15803d', bg: '#f0fdf4' },
    { name: '2. 뺄셈의 성질', form: 'a = b 이면  a - c = b - c', desc: '양변에서 같은 수를 빼도 등식은 항상 성립합니다.', isTrue: true, col: '#15803d', bg: '#f0fdf4' },
    { name: '3. 곱셈의 성질', form: 'a = b 이면  ac = bc', desc: '양변에 같은 수를 곱해도 등식은 항상 성립합니다.', isTrue: true, col: '#15803d', bg: '#f0fdf4' },
    { name: '4. 나눗셈의 성질', form: 'a = b 이면  a / c = b / c  (단, c ≠ 0)', desc: '0이 아닌 같은 수로 나누어야 등식이 성립합니다! (0으로 나눌 수 없음)', isTrue: true, col: '#0284c7', bg: '#f0f9ff' },
    { name: '⚠️ 주의! 역의 반례', form: 'ac = bc 이면 항상 a = b 일까? (거짓!)', desc: 'c = 0 일 때: 3 × 0 = 5 × 0 (0 = 0 참) 이지만 3 ≠ 5 입니다!', isTrue: false, col: '#b91c1c', bg: '#fef2f2' }
  ];

  const p = props[(idx || 1) - 1] || props[0];

  // Main board card
  const board = two.makeRoundedRectangle(cx, cy, 380, 150, 12);
  board.fill = p.bg; board.stroke = p.col; board.linewidth = 2;

  const tName = two.makeText(`[${p.name}]`, cx, cy - 45);
  tName.size = 15; tName.weight = 800; tName.fill = p.col;

  const tForm = two.makeText(p.form, cx, cy - 15);
  tForm.size = 15; tForm.weight = 800; tForm.fill = '#1e293b';

  const tDesc = two.makeText(p.desc, cx, cy + 18);
  tDesc.size = 12; tDesc.weight = 700; tDesc.fill = '#334155';

  const badgeBox = two.makeRoundedRectangle(cx, cy + 48, 170, 24, 6);
  badgeBox.fill = p.isTrue ? '#dcfce7' : '#fee2e2';
  badgeBox.stroke = p.col;
  const tBadge = two.makeText(p.isTrue ? '✅ 참 (항상 성립)' : '❌ 거짓 (c=0 반례 주의)', cx, cy + 48);
  tBadge.size = 12; tBadge.weight = 800; tBadge.fill = p.col;

  // Bottom hint note
  const noteBox = two.makeRectangle(cx, cy + 115, 380, 36);
  noteBox.fill = '#ffffff'; noteBox.stroke = '#cbd5e1'; noteBox.linewidth = 1;
  const tNote = two.makeText('💡 2번 문제(ac=bc ➔ a=b) 풀 때 c=0 인 반례를 반드시 떠올려보세요!', cx, cy + 115);
  tNote.size = 11; tNote.weight = 700; tNote.fill = '#0284c7';

  two.update();
}

function setPropQuiz(idx) {
  if (window.SoundFX && window.SoundFX.click) window.SoundFX.click();
  simState.propQuizIdx = idx;
  const badge = document.getElementById('prop-badge');
  const labels = ['덧셈 법칙 (+c)', '뺄셈 법칙 (-c)', '곱셈 법칙 (×c)', '나눗셈 법칙 (÷c, c≠0)', '⚠️ c=0 주의 반례'];
  if (badge) badge.innerText = `규칙 ${idx}: ${labels[idx - 1]}`;
  if (twoInstance) renderPropQuizCanvas(twoInstance, idx);
}
window.setPropQuiz = setPropQuiz;

function renderTranspositionCanvas(two, step) {
  two.clear();
  const cx = two.width / 2, cy = 160;
  const title = two.makeText('🌉 이항(移項) 부호 반전 브릿지: 3x + 5 = 11 (교과서 92쪽)', cx, 30);
  title.size = 15; title.weight = 800; title.fill = '#1e293b';

  // Equals Bridge
  const bridge = two.makeRectangle(cx, cy, 60, 80);
  bridge.fill = '#f8fafc'; bridge.stroke = '#cbd5e1'; bridge.linewidth = 2;
  const eqSign = two.makeText('=', cx, cy);
  eqSign.size = 32; eqSign.weight = 900; eqSign.fill = '#475569';

  // Left Bank
  two.makeText('좌변', cx - 120, cy - 50).size = 13;
  const lx = two.makeText('3x', cx - 140, cy);
  lx.size = 20; lx.weight = 800; lx.fill = '#1d4ed8';

  // Right Bank
  two.makeText('우변', cx + 120, cy - 50).size = 13;
  const r11 = two.makeText('11', cx + 140, cy);
  r11.size = 20; r11.weight = 800; r11.fill = '#047857';

  // Moving term tile
  let posX = cx - 80, posY = cy, tTxt = '+5', tFill = '#dbeafe', tStroke = '#2563eb', tCol = '#1d4ed8';
  if (step === 2) {
    posX = cx; posY = cy - 45;
    tTxt = '부호 반전!'; tFill = '#fef08a'; tStroke = '#ca8a04'; tCol = '#854d0e';
  } else if (step === 3) {
    posX = cx + 80; posY = cy;
    tTxt = '-5'; tFill = '#fee2e2'; tStroke = '#dc2626'; tCol = '#b91c1c';
  }

  const mBox = two.makeRectangle(posX, posY, 65, 35);
  mBox.fill = tFill; mBox.stroke = tStroke; mBox.linewidth = 2;
  const mTxt = two.makeText(tTxt, posX, posY);
  mTxt.size = 14; mTxt.weight = 800; mTxt.fill = tCol;

  // Bottom banner
  const bb = two.makeRectangle(cx, cy + 85, 380, 42);
  bb.fill = '#f0fdf4'; bb.stroke = '#22c55e';
  let bMsg = '1단계: 좌변의 +5를 우변으로 옮길 준비';
  if (step === 2) bMsg = '2단계: 등호를 넘어가며 부호가 + 에서 - 로 바뀜!';
  if (step === 3) bMsg = '3단계: 3x = 11 - 5 ➔ 3x = 6 (x = 2)';
  const bt = two.makeText(bMsg, cx, cy + 85);
  bt.size = 12; bt.weight = 800; bt.fill = '#15803d';

  two.update();
}

function renderAlgStepsCanvas(two, step) {
  two.clear();
  const cx = two.width / 2, cy = 160;
  const title = two.makeText('📋 일차방정식 풀이 4단계 표준 알고리즘: 5x - 4 = 2x + 5', cx, 30);
  title.size = 15; title.weight = 800; title.fill = '#1e293b';

  const steps = [
    { num: '1단계', title: '이항하기', math: '5x - 2x = 5 + 4' },
    { num: '2단계', title: 'ax = b 정리', math: '3x = 9' },
    { num: '3단계', title: '계수로 나누기', math: 'x = 3' },
    { num: '4단계', title: '검산하기', math: '좌 11 = 우 11 (참)' }
  ];

  for (let i = 0; i < 4; i++) {
    const x = cx - 135 + i * 90;
    const card = two.makeRectangle(x, cy, 80, 110);
    const isActive = (step === i + 1);
    card.fill = isActive ? '#dcfce7' : '#f8fafc';
    card.stroke = isActive ? '#16a34a' : '#cbd5e1';
    card.linewidth = isActive ? 3 : 1;

    two.makeText(steps[i].num, x, cy - 35).size = 11;
    two.makeText(steps[i].title, x, cy - 15).size = 11;
    const m = two.makeText(steps[i].math, x, cy + 20);
    m.size = 11; m.weight = 800; m.fill = isActive ? '#15803d' : '#475569';
  }

  two.update();
}

function renderMagicEqCanvas(two, mode) {
  two.clear();
  const cx = two.width / 2, cy = 160;
  const title = two.makeText('🧙 복잡한 일차방정식 계수 정수화 마법 (교과서 96~97쪽)', cx, 30);
  title.size = 15; title.weight = 800; title.fill = '#1e293b';

  let t1 = '', mult = '', t2 = '', fin = '';
  if (mode === 'decimal') {
    t1 = '소수 방정식: 0.3x - 0.2 = 0.7';
    mult = '🪄 양변에 10 곱하기 (×10)';
    t2 = '정수 계수: 3x - 2 = 7';
    fin = '이항하여 풀기: 3x = 9 ➔ x = 3';
  } else if (mode === 'fraction') {
    t1 = '분수 방정식: x/2 - x/3 = 1';
    mult = '🪄 분모의 최소공배수 6 곱하기 (×6)';
    t2 = '정수 계수: 3x - 2x = 6';
    fin = '동류항 정리: x = 6';
  } else {
    t1 = '괄호 방정식: 2(x - 1) = x + 3';
    mult = '🪄 분배법칙으로 괄호 전개';
    t2 = '전개된 식: 2x - 2 = x + 3';
    fin = '이항하여 풀기: 2x - x = 3 + 2 ➔ x = 5';
  }

  const card = two.makeRectangle(cx, cy, 360, 150);
  card.fill = '#faf5ff'; card.stroke = '#a855f7'; card.linewidth = 2;

  two.makeText(t1, cx, cy - 45).size = 15;
  const mTxt = two.makeText(mult, cx, cy - 15);
  mTxt.size = 14; mTxt.weight = 800; mTxt.fill = '#7e22ce';

  const t2Txt = two.makeText(t2, cx, cy + 15);
  t2Txt.size = 16; t2Txt.weight = 900; t2Txt.fill = '#6b21a8';

  const fTxt = two.makeText(fin, cx, cy + 45);
  fTxt.size = 13; fTxt.weight = 700; fTxt.fill = '#15803d';

  two.update();
}

function renderConsecutiveCanvas(two, xVal) {
  two.clear();
  const cx = two.width / 2, cy = 160;
  const title = two.makeText('📏 연속하는 세 자연수의 합: (x-1) + x + (x+1) = 57', cx, 30);
  title.size = 15; title.weight = 800; title.fill = '#1e293b';

  const sum = 3 * xVal;
  const isTarget = (sum === 57);

  // 3 bars
  const nums = [xVal - 1, xVal, xVal + 1];
  const colors = ['#93c5fd', '#60a5fa', '#3b82f6'];
  for (let i = 0; i < 3; i++) {
    const bar = two.makeRectangle(cx, cy - 30 + i * 32, nums[i] * 8, 22);
    bar.fill = colors[i]; bar.stroke = '#1d4ed8';
    two.makeText(`${i===0?'첫째 수 (x-1)':i===1?'가운데 수 x':'셋째 수 (x+1)'}: ${nums[i]}`, cx, cy - 30 + i * 32).size = 12;
  }

  // Sum readout
  const sBox = two.makeRectangle(cx, cy + 85, 360, 40);
  sBox.fill = isTarget ? '#f0fdf4' : '#eff6ff';
  sBox.stroke = isTarget ? '#22c55e' : '#3b82f6';
  sBox.linewidth = 2;

  const sTxt = two.makeText(`합계: ${nums[0]} + ${nums[1]} + ${nums[2]} = ${sum} ${isTarget ? '🎉 (목표 57 일치!)' : '(목표 57 아님)'}`, cx, cy + 85);
  sTxt.size = 13; sTxt.weight = 800; sTxt.fill = isTarget ? '#15803d' : '#1e40af';

  two.update();
}

function renderMathMagicCanvas(two, xVal, step) {
  two.clear();
  const cx = two.width / 2, cy = 160;
  const title = two.makeText('🎩 생각한 수 맞추기 수학 마술사 (교과서 102쪽)', cx, 30);
  title.size = 15; title.weight = 800; title.fill = '#1e293b';

  const steps = [
    { name: '1. 수 생각하기', exp: 'x', val: xVal },
    { name: '2. 4 더하기', exp: 'x + 4', val: xVal + 4 },
    { name: '3. 2 곱하기', exp: '2x + 8', val: (xVal + 4) * 2 },
    { name: '4. 6 빼기', exp: '2x + 2', val: (xVal + 4) * 2 - 6 },
    { name: '5. 2로 나누기', exp: 'x + 1', val: ((xVal + 4) * 2 - 6) / 2 },
    { name: '6. 처음 수 x 빼기', exp: '1', val: 1 }
  ];

  // Grid of steps
  for (let i = 0; i < 6; i++) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = cx - 120 + col * 120;
    const y = cy - 35 + row * 65;

    const box = two.makeRectangle(x, y, 110, 52);
    const isCurrent = (step === i + 1);
    box.fill = isCurrent ? '#fef08a' : (i + 1 < step ? '#dcfce7' : '#f8fafc');
    box.stroke = isCurrent ? '#ca8a04' : (i + 1 < step ? '#16a34a' : '#cbd5e1');
    box.linewidth = isCurrent ? 2.5 : 1;

    two.makeText(steps[i].name, x, y - 13).size = 10;
    const eTxt = two.makeText(steps[i].exp, x, y + 2);
    eTxt.size = 11; eTxt.weight = 800; eTxt.fill = '#2563eb';
    const vTxt = two.makeText(`값: ${steps[i].val}`, x, y + 15);
    vTxt.size = 11; vTxt.weight = 700; vTxt.fill = '#1e293b';
  }

  // Climax banner
  const ban = two.makeRectangle(cx, cy + 95, 370, 36);
  ban.fill = '#eff6ff'; ban.stroke = '#3b82f6';
  const bTxt = two.makeText('마술의 비밀: 마지막에 x를 빼므로 어떤 수를 생각해도 결과는 항상 1!', cx, cy + 95);
  bTxt.size = 11; bTxt.weight = 800; bTxt.fill = '#1d4ed8';

  two.update();
}

function renderDefaultConceptCanvas(two, code, simController) {
  two.clear();
  const cx = two.width / 2, cy = 160;
  const title = two.makeText('📐 3단원 문자와 식 개념 탐구 실험실', cx, 40);
  title.size = 16; title.weight = 800; title.fill = '#1e293b';

  const board = two.makeRectangle(cx, cy, 360, 160);
  board.fill = '#f8fafc'; board.stroke = '#cbd5e1'; board.linewidth = 2;

  two.makeText('우측의 탐구 문제를 확인하고 정답을 작성해 보세요.', cx, cy - 20).size = 14;
  two.makeText('좌측 시뮬레이터를 통해 교과서 속 수학 원리를 직접 조작할 수 있습니다.', cx, cy + 15).size = 12;

  two.update();
}

// --- CONTROLLER ACTION FUNCTIONS ---

function setBoxScale(v) {
  if (window.SoundFX && window.SoundFX.click) window.SoundFX.click();
  simState.boxVal = parseInt(v);
  const badge = document.getElementById('box-scale-status');
  if (badge) badge.innerText = `현재 □ = ${v} (좌: ${3 * v + 5} vs 우: 20)`;
  if (twoInstance) renderBoxScaleCanvas(twoInstance, simState.boxVal);
}
window.setBoxScale = setBoxScale;

function setRatioVal(r) {
  if (window.SoundFX && window.SoundFX.click) window.SoundFX.click();
  simState.ratioVal = r;
  const badge = document.getElementById('ratio-badge');
  if (badge) badge.innerText = `비율: ${r}`;
  if (twoInstance) renderRatioBarCanvas(twoInstance, r);
}
window.setRatioVal = setRatioVal;

function setRevStep(s) {
  if (window.SoundFX && window.SoundFX.click) window.SoundFX.click();
  simState.revStep = s;
  if (twoInstance) renderReverseCalcCanvas(twoInstance, s);
}
window.setRevStep = setRevStep;

function setIceQty(q) {
  if (window.SoundFX && window.SoundFX.click) window.SoundFX.click();
  simState.iceQty = parseInt(q);
  const badge = document.getElementById('receipt-badge');
  if (badge) badge.innerText = `합계: 3,500 × ${q} = ${(3500 * q).toLocaleString()}원`;
  if (twoInstance) renderReceiptCanvas(twoInstance, simState.iceQty);
}
window.setIceQty = setIceQty;

function setRuleIdx(idx) {
  if (window.SoundFX && window.SoundFX.click) window.SoundFX.click();
  simState.ruleIdx = idx;
  if (twoInstance) renderSymbolOmissionCanvas(twoInstance, idx);
}
window.setRuleIdx = setRuleIdx;

function setBookDays(d) {
  if (window.SoundFX && window.SoundFX.click) window.SoundFX.click();
  simState.bookDays = parseInt(d);
  const badge = document.getElementById('book-badge');
  if (badge) badge.innerText = `${d}일차: 남은 쪽수 ${400 - 10 * d}쪽`;
  if (twoInstance) renderBookGaugeCanvas(twoInstance, simState.bookDays);
}
window.setBookDays = setBookDays;

function setNegExpr(i) {
  if (window.SoundFX && window.SoundFX.click) window.SoundFX.click();
  simState.negExprIdx = i;
  if (twoInstance) renderNegSubstituteCanvas(twoInstance, i);
}
window.setNegExpr = setNegExpr;

function setPolyMode(m) {
  if (window.SoundFX && window.SoundFX.click) window.SoundFX.click();
  simState.polyMode = m;
  if (twoInstance) renderPolyStructureCanvas(twoInstance, m);
}
window.setPolyMode = setPolyMode;

function setRectMode(m) {
  if (window.SoundFX && window.SoundFX.click) window.SoundFX.click();
  simState.rectMode = m;
  if (twoInstance) renderRectDistCanvas(twoInstance, m);
}
window.setRectMode = setRectMode;

function setLikeTiles(s) {
  if (window.SoundFX && window.SoundFX.click) window.SoundFX.click();
  simState.likeStep = s;
  if (twoInstance) renderLikeTermTilesCanvas(twoInstance, s);
}
window.setLikeTiles = setLikeTiles;

function setBracketStep(s) {
  if (window.SoundFX && window.SoundFX.click) window.SoundFX.click();
  simState.bracketStep = s;
  if (twoInstance) renderBracketDistCanvas(twoInstance, s);
}
window.setBracketStep = setBracketStep;

function setEqType(t) {
  if (window.SoundFX && window.SoundFX.click) window.SoundFX.click();
  simState.eqType = t;
  const badge = document.getElementById('eq-badge');
  if (badge) badge.innerText = (t === 'equation' ? '방정식: 특정 x에서만 참' : '항등식: 모든 x에서 항상 참');
  if (twoInstance) renderEqVsIdentityCanvas(twoInstance, t, simState.eqX);
}
window.setEqType = setEqType;

function setEqX(x) {
  if (window.SoundFX && window.SoundFX.click) window.SoundFX.click();
  simState.eqX = parseInt(x);
  if (twoInstance) renderEqVsIdentityCanvas(twoInstance, simState.eqType, simState.eqX);
}
window.setEqX = setEqX;

function setSolX(x) {
  if (window.SoundFX && window.SoundFX.click) window.SoundFX.click();
  simState.solX = parseInt(x);
  if (twoInstance) renderSolutionFinderCanvas(twoInstance, simState.solX);
}
window.setSolX = setSolX;

function applyProp(act) {
  if (window.SoundFX && window.SoundFX.click) window.SoundFX.click();
  simState.eqProp = act;
  const badge = document.getElementById('prop-badge');
  if (badge) {
    if (act === 'add3') badge.innerText = '등식의 성질 1: 양변에 3을 더하여 x = 8 도출!';
    else if (act === 'sub3') badge.innerText = '등식의 성질 2: 양변에서 3을 뺌';
    else if (act === 'mul2') badge.innerText = '등식의 성질 3: 양변에 2를 곱함';
    else badge.innerText = '원래 방정식: x - 3 = 5';
  }
  if (twoInstance) renderPropertiesCanvas(twoInstance, act);
}
window.applyProp = applyProp;

function setTransStep(s) {
  if (window.SoundFX && window.SoundFX.click) window.SoundFX.click();
  simState.transStep = s;
  if (twoInstance) renderTranspositionCanvas(twoInstance, s);
}
window.setTransStep = setTransStep;

function setAlgStep(s) {
  if (window.SoundFX && window.SoundFX.click) window.SoundFX.click();
  simState.algStep = s;
  if (twoInstance) renderAlgStepsCanvas(twoInstance, s);
}
window.setAlgStep = setAlgStep;

function setMagicMode(m) {
  if (window.SoundFX && window.SoundFX.click) window.SoundFX.click();
  simState.magicMode = m;
  if (twoInstance) renderMagicEqCanvas(twoInstance, m);
}
window.setMagicMode = setMagicMode;

function setConsecX(x) {
  if (window.SoundFX && window.SoundFX.click) window.SoundFX.click();
  simState.consecX = parseInt(x);
  const badge = document.getElementById('consec-badge');
  if (badge) badge.innerText = `현재 가운데 수 x = ${x} (합: ${3 * x})`;
  if (twoInstance) renderConsecutiveCanvas(twoInstance, simState.consecX);
}
window.setConsecX = setConsecX;

function setMagicX(x) {
  simState.magicX = parseInt(x) || 7;
  if (twoInstance) renderMathMagicCanvas(twoInstance, simState.magicX, simState.magicStep);
}
window.setMagicX = setMagicX;

function setMagicStep(s) {
  if (window.SoundFX && window.SoundFX.click) window.SoundFX.click();
  simState.magicStep = s;
  const badge = document.getElementById('magic-step-badge');
  if (badge) badge.innerText = `마술 단계: ${s}단계 (x = ${simState.magicX})`;
  if (twoInstance) renderMathMagicCanvas(twoInstance, simState.magicX, s);
}
window.setMagicStep = setMagicStep;
