import re

# Read template
with open('/home/ubuntu/workspace/Redbook/g1_ch1_factors.html', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace Header and Titles
code = code.replace('중1 수학: 1. 소인수분해', '중1 수학: 2. 정수와 유리수')
code = code.replace('중1 수학 1단원', '중1 수학 2단원')
code = code.replace('🔢 1. 소인수분해', '🌡️ 2. 정수와 유리수')
code = code.replace('학번과 비밀번호를 입력하고 1단원 소인수분해 탐구를 시작하세요!', '학번과 비밀번호를 입력하고 2단원 정수와 유리수 탐구를 시작하세요!')
code = code.replace('🔢 소인수분해 대화형 탐구실', '🌡️ 정수와 유리수 대화형 탐구실')
code = code.replace('select-unlock-substep-ch1', 'select-unlock-substep-ch2')
code = code.replace('applyGlobalUnlockStepCh1', 'applyGlobalUnlockStepCh2')

# Theme Color: Blue-Cyan
code = code.replace('--primary-color: #6366f1;', '--primary-color: #0284c7;')
code = code.replace('--primary-hover: #4f46e5;', '--primary-hover: #0369a1;')
code = code.replace('linear-gradient(135deg, #6366f1, #8b5cf6)', 'linear-gradient(135deg, #0284c7, #38bdf8)')
code = code.replace('linear-gradient(135deg, #6366f1, #4f46e5)', 'linear-gradient(135deg, #0284c7, #0369a1)')

# Main Navigation Tabs
ch2_tabs = '''    <button id="tab-0" class="tab-btn active" onclick="switchMainTab(0)">0. 되짚어 보기 🔓</button>
    <button id="tab-1" class="tab-btn" onclick="switchMainTab(1)">2.1 정수와 유리수 🔒</button>
    <button id="tab-2" class="tab-btn" onclick="switchMainTab(2)">2.2 대소 관계와 절댓값 🔒</button>
    <button id="tab-3" class="tab-btn" onclick="switchMainTab(3)">2.3 덧셈과 뺄셈 🔒</button>
    <button id="tab-4" class="tab-btn" onclick="switchMainTab(4)">2.4 곱셈과 나눗셈 🔒</button>
    <button id="tab-5" class="tab-btn" onclick="switchMainTab(5)">2.5 스스로 마무리하기 🔒</button>'''
code = re.sub(r'<nav id="main-tab-bar".*?</nav>', f'<nav id="main-tab-bar" class="tab-bar-container">\n{ch2_tabs}\n  </nav>', code, flags=re.DOTALL)

# JS Replacement
js_content = r'''
    const state = {
      studentId: '10101',
      studentName: '학생',
      isTeacherLoggedIn: false,
      currentMainTab: 0,
      subStep: '0-1',
      tool: 'select',
      unlockedTabs: [0],
      unlockedSubSteps: ['0-1'],
      completedSubSteps: [],
      savedFormInputs: {},
      verifiedViewData: {}
    };

    const ALL_CH2_SUBSTEPS = [
      '0-1', '0-2', '0-3',
      '1-1', '1-2', '1-3', '1-4',
      '2-1', '2-2', '2-3', '2-4',
      '3-1', '3-2', '3-3', '3-4',
      '4-1', '4-2', '4-3', '4-4',
      '5-1'
    ];

    const SUBSTEP_TITLES = {
      '0-1': '0. 되짚어보기 1 (분수와 소수)',
      '0-2': '0. 되짚어보기 2 (수 크기 비교)',
      '0-3': '0. 되짚어보기 3 (분수 곱셈)',
      '1-1': '2.1 생각열기 (기온과 부호)',
      '1-2': '2.1 양수와 음수의 뜻',
      '1-3': '2.1 정수와 유리수의 분류',
      '1-4': '2.1 수직선 위의 점 표현',
      '2-1': '2.2 생각열기 (별의 등급)',
      '2-2': '2.2 절댓값의 뜻과 기호',
      '2-3': '2.2 수의 대소 관계',
      '2-4': '2.2 부등호의 사용',
      '3-1': '2.3 생각열기 (엘리베이터 이동)',
      '3-2': '2.3 정수와 유리수의 덧셈',
      '3-3': '2.3 덧셈의 연산법칙',
      '3-4': '2.3 정수와 유리수의 뺄셈',
      '4-1': '2.4 생각열기 (수위 변화와 곱셈)',
      '4-2': '2.4 정수와 유리수의 곱셈',
      '4-3': '2.4 나눗셈과 역수',
      '4-4': '2.4 사칙연산 혼합 계산',
      '5-1': '2.5 스스로 마무리하기 (총정리)'
    };

    function saveCurrentFormInputs(subStepCode) {
      const code = subStepCode || state.subStep;
      if (!code) return;
      if (!state.savedFormInputs) state.savedFormInputs = {};
      if (!state.savedFormInputs[code]) state.savedFormInputs[code] = {};
      const formArea = document.getElementById('form-work-area');
      if (!formArea) return;
      const elements = formArea.querySelectorAll('input, textarea, select');
      elements.forEach((el, idx) => {
        const key = el.id || el.name || `field_${idx}`;
        state.savedFormInputs[code][key] = el.value;
      });
    }

    function restoreFormInputs(subStepCode) {
      const code = subStepCode || state.subStep;
      if (!code || !state.savedFormInputs || !state.savedFormInputs[code]) return;
      const formArea = document.getElementById('form-work-area');
      if (!formArea) return;
      const saved = state.savedFormInputs[code];
      const elements = formArea.querySelectorAll('input, textarea, select');
      elements.forEach((el, idx) => {
        const key = el.id || el.name || `field_${idx}`;
        if (saved[key] !== undefined) el.value = saved[key];
      });
    }

    let twoInstance = null;
    function initTwoEngine() {
      const container = document.getElementById('two-container');
      if (!container) return null;
      container.innerHTML = '';
      const width = container.clientWidth || 800;
      const height = container.clientHeight || 500;
      twoInstance = new Two({ width, height, type: Two.Types.canvas, autostart: true }).appendTo(container);
      return { two: twoInstance, width, height, cx: width / 2, cy: height / 2 };
    }

    function formatMathText(txt) {
      if (typeof katex === 'undefined') return txt;
      return txt.replace(/\$(.*?)\$/g, (m, math) => {
        try { return katex.renderToString(math, { throwOnError: false }); } catch(e) { return math; }
      });
    }

    function renderMathInPage(targetElement = null) {
      const el = targetElement || document.body;
      if (window.renderMathInElement) {
        try {
          window.renderMathInElement(el, {
            delimiters: [{ left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false }],
            ignoredTags: ["script", "noscript", "style", "textarea", "input"],
            throwOnError: false
          });
        } catch(e) {}
      }
    }

    function switchView(viewName) {
      document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
      const target = document.getElementById(`view-${viewName}`);
      if (target) target.classList.add('active');
    }

    function handleLMSLogin(e) {
      e.preventDefault();
      state.studentId = document.getElementById('student-id').value.trim() || '10101';
      state.studentName = document.getElementById('student-name').value.trim() || '학생';
      const disp = document.getElementById('current-user-info');
      if (disp) disp.innerText = `👤 ${state.studentId} ${state.studentName}`;
      switchView('activity');
      loadSubStep(state.subStep || '0-1');
    }

    function switchMainTab(tabIdx) {
      if (!state.unlockedTabs.includes(tabIdx) && !state.isTeacherLoggedIn) {
        alert("🔒 이전 단원을 먼저 완료하셔야 진행할 수 있습니다!");
        return;
      }
      state.currentMainTab = tabIdx;
      document.querySelectorAll('.tab-btn').forEach((btn, i) => {
        if (i === tabIdx) btn.classList.add('active');
        else btn.classList.remove('active');
      });
      updateSubStepPills(tabIdx);

      const prefix = `${tabIdx}-`;
      const firstSub = ALL_CH2_SUBSTEPS.find(code => code.startsWith(prefix) && (state.unlockedSubSteps.includes(code) || state.isTeacherLoggedIn));
      if (firstSub) loadSubStep(firstSub);
    }

    function updateSubStepPills(mainIdx) {
      const container = document.getElementById('substep-pills-container');
      if (!container) return;
      container.innerHTML = '';

      const pillsConfig = {
        0: [
          { code: '0-1', label: '1. 분수와 소수' },
          { code: '0-2', label: '2. 수 크기 비교' },
          { code: '0-3', label: '3. 분수 곱셈' }
        ],
        1: [
          { code: '1-1', label: '1. 생각열기 (기온과 부호)' },
          { code: '1-2', label: '2. 양수와 음수의 뜻' },
          { code: '1-3', label: '3. 정수와 유리수의 분류' },
          { code: '1-4', label: '4. 수직선 위의 점 표현' }
        ],
        2: [
          { code: '2-1', label: '1. 생각열기 (별의 등급)' },
          { code: '2-2', label: '2. 절댓값의 뜻과 기호' },
          { code: '2-3', label: '3. 수의 대소 관계' },
          { code: '2-4', label: '4. 부등호의 사용' }
        ],
        3: [
          { code: '3-1', label: '1. 생각열기 (엘리베이터)' },
          { code: '3-2', label: '2. 덧셈의 계산 원리' },
          { code: '3-3', label: '3. 덧셈의 연산법칙' },
          { code: '3-4', label: '4. 뺄셈의 계산 원리' }
        ],
        4: [
          { code: '4-1', label: '1. 생각열기 (수위 변화)' },
          { code: '4-2', label: '2. 곱셈의 부호 규칙' },
          { code: '4-3', label: '3. 나눗셈과 역수' },
          { code: '4-4', label: '4. 사칙연산 혼합 계산' }
        ],
        5: [
          { code: '5-1', label: '1. 스스로 마무리하기 (총정리)' }
        ]
      };

      const pills = pillsConfig[mainIdx] || [];
      pills.forEach(p => {
        const btn = document.createElement('button');
        const isUnlocked = state.unlockedSubSteps.includes(p.code) || state.isTeacherLoggedIn;
        const isActive = (state.subStep === p.code);
        const isCompleted = state.completedSubSteps.includes(p.code);

        let extraClass = '';
        if (isActive) extraClass += ' active';
        if (!isUnlocked) extraClass += ' locked-pill';
        if (isCompleted) extraClass += ' completed';

        btn.className = `substep-pill ${extraClass}`;
        let prefix = isCompleted ? '✅ ' : (isUnlocked ? '' : '🔒 ');
        btn.innerText = `${prefix}${p.label}`;

        if (isUnlocked) {
          btn.onclick = () => loadSubStep(p.code);
        } else {
          btn.onclick = () => alert("🔒 이전 세부활동을 먼저 완료하셔야 진행할 수 있습니다!");
        }
        container.appendChild(btn);
      });
    }

    function loadSubStep(subStepCode) {
      if (!state.unlockedSubSteps.includes(subStepCode) && !state.isTeacherLoggedIn) {
        alert("🔒 해당 페이지는 아직 잠겨 있습니다!");
        return;
      }
      if (state.subStep && state.subStep !== subStepCode) saveCurrentFormInputs(state.subStep);
      state.subStep = subStepCode;

      const mainTabIdx = parseInt(subStepCode.split('-')[0]);
      state.currentMainTab = mainTabIdx;
      document.querySelectorAll('.tab-btn').forEach((btn, i) => {
        if (i === mainTabIdx) btn.classList.add('active');
        else btn.classList.remove('active');
      });
      updateSubStepPills(mainTabIdx);

      const engine = initTwoEngine();
      const setMissionUI = (mText) => {
        document.getElementById('mission-text').innerHTML = formatMathText(mText);
      };
      const formArea = document.getElementById('form-work-area');
      formArea.innerHTML = '';

      if (subStepCode === '0-1') {
        setMissionUI("<b>[되짚어보기 1] 자연수와 분수 (초3~6)</b><br>다음 수 중에서 자연수를 모두 고르고 분수를 소수로 나타내시오.");
        drawNumberLineBasicCanvas(engine.two);
        formArea.innerHTML = `
          <div class="card">
            <div style="font-size:0.92rem; font-weight:700; color:#1e293b; margin-bottom:10px;">
              [1] 보기에서 <b>자연수</b>를 모두 고르시오: $1, \\frac{3}{4}, 3.14, 9, 100$
            </div>
            <div style="font-size:0.88rem; line-height:2.0; margin-bottom:12px;">
              자연수: ( <input type="text" id="p01-ans1" class="proof-input-text" style="width:140px;" placeholder="예: 1, 9, 100"> )
            </div>
            <div style="font-size:0.92rem; font-weight:700; color:#1e293b; margin-bottom:10px;">
              [2] $\\frac{3}{10}$을 소수로 나타내시오: ( <input type="text" id="p01-ans2" class="proof-input-text" style="width:60px;"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check01Submit()">✅ 제출 및 채점</button>
          </div>
        `;
      } else if (subStepCode === '0-2') {
        setMissionUI("<b>[되짚어보기 2] 두 수의 크기 비교 (초3~4)</b><br>두 수의 크기를 비교하여 부등호(&gt;, &lt;)를 쓰시오.");
        drawCompareCanvas(engine.two);
        formArea.innerHTML = `
          <div class="card">
            <div style="font-size:0.92rem; font-weight:700; color:#1e293b; margin-bottom:10px;">다음 빈칸에 알맞은 부등호(&gt; 또는 &lt;)를 쓰시오:</div>
            <div style="font-size:0.9rem; line-height:2.2; margin-bottom:14px;">
              (1) 2 ( <input type="text" id="p02-q1" class="proof-input-text" style="width:50px;"> ) 5<br>
              (2) 0.5 ( <input type="text" id="p02-q2" class="proof-input-text" style="width:50px;"> ) 0.05
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check02Submit()">✅ 제출 및 채점</button>
          </div>
        `;
      } else if (subStepCode === '0-3') {
        setMissionUI("<b>[되짚어보기 3] 분수의 곱셈 (초5~6)</b><br>다음 분수의 곱셈을 계산하여 기약분수로 나타내시오.");
        drawFractionCanvas(engine.two);
        formArea.innerHTML = `
          <div class="card">
            <div style="font-size:0.92rem; font-weight:700; color:#1e293b; margin-bottom:10px;">[문제] $\\frac{2}{5} \\times \\frac{3}{4}$를 계산하시오:</div>
            <div style="font-size:0.9rem; line-height:2.0; margin-bottom:14px;">답 = ( <input type="text" id="p03-ans" class="proof-input-text" style="width:70px;" placeholder="예: 3/10"> )</div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check03Submit()">🏆 되짚어보기 완료! (2.1 정수와 유리수 해금)</button>
          </div>
        `;
      } else if (subStepCode === '1-1') {
        setMissionUI("<b>[2.1 생각열기] 기온과 부호 (교과서 p.30)</b><br>영상 $8^\\circ\\text{C}$는 $+8^\\circ\\text{C}$, 영하 $4^\\circ\\text{C}$는 $-4^\\circ\\text{C}$로 나타냅니다.");
        drawThermometerCanvas(engine.two);
        formArea.innerHTML = `
          <div class="card">
            <div style="font-size:0.92rem; font-weight:800; color:#0284c7; margin-bottom:10px;">🌡️ 서로 반대되는 성질을 부호로 나타내기</div>
            <div style="font-size:0.88rem; line-height:2.2; margin-bottom:14px;">
              • 영하 $2^\\circ\\text{C}$를 부호로 나타내면: ( <input type="text" id="p11-t1" class="proof-input-text" style="width:65px;"> )$^\\circ\\text{C}$<br>
              • 영상 $12^\\circ\\text{C}$를 부호로 나타내면: ( <input type="text" id="p11-t2" class="proof-input-text" style="width:65px;"> )$^\\circ\\text{C}$<br>
              • 500원 이익을 $+500$원으로 나타낼 때, 300원 손해는 ( <input type="text" id="p11-t3" class="proof-input-text" style="width:75px;"> )원이다.
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check11Submit()">🚀 제출 후 [양수와 음수의 뜻] ➔</button>
          </div>
        `;
      } else if (subStepCode === '1-2') {
        setMissionUI("<b>[2.1 개념학습] 양수와 음수의 뜻 (교과서 p.31)</b><br>0보다 큰 수인 양수와 0보다 작은 수인 음수, 그리고 기준이 되는 0의 의미를 탐구해 보세요.");
        drawSignConceptCanvas(engine.two);
        formArea.innerHTML = `
          <div class="card">
            <div style="font-size:0.92rem; font-weight:800; color:#0284c7; margin-bottom:10px;">📖 양수와 음수</div>
            <div style="font-size:0.88rem; line-height:2.0; margin-bottom:12px;">
              ① 0보다 큰 수에 양의 부호 $+$를 붙인 수를 ( <input type="text" id="p12-pos" class="proof-input-text" style="width:65px;"> )(이)라 한다.<br>
              ② 0보다 작은 수에 음의 부호 $-$를 붙인 수를 ( <input type="text" id="p12-neg" class="proof-input-text" style="width:65px;"> )(이)라 한다.<br>
              ③ <b>0</b>은 양수인가요 음수인가요? ➔ 0은 양수도 아니고 음수도 ( <input type="text" id="p12-zero" class="proof-input-text" style="width:80px;" placeholder="아니다"> ).
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check12Submit()">✅ 제출 및 채점</button>
          </div>
        `;
      } else if (subStepCode === '1-3') {
        setMissionUI("<b>[2.1 개념학습] 정수와 유리수의 분류 (교과서 p.32~33)</b><br>정수와 유리수의 전체 분류 체계를 학습하세요.");
        drawNumberClassificationCanvas(engine.two);
        formArea.innerHTML = `
          <div class="card">
            <div style="font-size:0.92rem; font-weight:800; color:#0284c7; margin-bottom:10px;">📊 정수와 유리수의 분류 체계</div>
            <div style="font-size:0.88rem; line-height:2.0; margin-bottom:14px;">
              • 양의 정수(자연수), ( <input type="text" id="p13-z" class="proof-input-text" style="width:45px;"> ), 음의 정수를 통틀어 <b>정수</b>라고 한다.<br>
              • 양의 유리수, 0, 음의 유리수를 통틀어 ( <input type="text" id="p13-q" class="proof-input-text" style="width:75px;"> )(이)라고 한다.<br>
              • 다음 수 중 정수가 아닌 유리수는? ( $2, -5, 0, \\frac{3}{4}, +7$ 중 택1 ) ➔ ( <input type="text" id="p13-ans" class="proof-input-text" style="width:65px;"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check13Submit()">✅ 제출 및 채점</button>
          </div>
        `;
      } else if (subStepCode === '1-4') {
        setMissionUI("<b>[2.1 문제] 수직선 위의 점 표현 (교과서 p.34~35)</b><br>수직선 위에 점의 위치를 파악해 보세요.");
        drawIntegerNumberLineCanvas(engine.two);
        formArea.innerHTML = `
          <div class="card">
            <div style="font-size:0.92rem; font-weight:800; color:#0284c7; margin-bottom:10px;">📍 수직선 위의 세 점 A, B, C의 좌표</div>
            <div style="font-size:0.88rem; line-height:2.2; margin-bottom:14px;">
              • 점 A(-3): ( <input type="text" id="p14-a" class="proof-input-text" style="width:60px;"> )<br>
              • 점 B(-1.5): ( <input type="text" id="p14-b" class="proof-input-text" style="width:60px;"> )<br>
              • 점 C(+2): ( <input type="text" id="p14-c" class="proof-input-text" style="width:60px;"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:11px; font-weight:800;" onclick="check14Submit()">🏆 2.1 완수! [2.2 대소 관계와 절댓값] 해금</button>
          </div>
        `;
      } else if (subStepCode === '2-1') {
        setMissionUI("<b>[2.2 생각열기] 별의 등급과 음수 (교과서 p.36)</b><br>시리우스는 $-1.46$등급입니다. 수가 작을수록 더 밝습니다.");
        drawStarCanvas(engine.two);
        formArea.innerHTML = `
          <div class="card">
            <div style="font-size:0.88rem; line-height:2.0; margin-bottom:12px;">
              • 1등급 별과 -1.46등급 별 중 더 밝은 별은 ( <input type="text" id="p21-star" class="proof-input-text" style="width:90px;" placeholder="시리우스"> )이다.<br>
              • 수직선에서 더 왼쪽에 있는 수는 더 ( <input type="text" id="p21-left" class="proof-input-text" style="width:60px;" placeholder="작다"> ).
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check21Submit()">✅ 제출 및 다음 단계 ➔</button>
          </div>
        `;
      } else if (subStepCode === '2-2') {
        setMissionUI("<b>[2.2 개념학습] 절댓값의 뜻과 기호 (교과서 p.37)</b><br>원점 0과 어떤 수를 나타내는 점 사이의 거리를 '절댓값'이라 하고 기호 $|a|$로 나타냅니다.");
        drawAbsoluteCanvas(engine.two);
        formArea.innerHTML = `
          <div class="card">
            <div style="font-size:0.88rem; line-height:2.2; margin-bottom:14px;">
              ① $|+3| = ($ <input type="text" id="p22-a1" class="proof-input-text" style="width:50px;"> $)$<br>
              ② $|-4| = ($ <input type="text" id="p22-a2" class="proof-input-text" style="width:50px;"> $)$<br>
              ③ $|0| = ($ <input type="text" id="p22-a3" class="proof-input-text" style="width:50px;"> $)$<br>
              ④ 절댓값이 5인 수는 ( <input type="text" id="p22-a4" class="proof-input-text" style="width:85px;" placeholder="+5, -5"> )의 2개이다.
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check22Submit()">✅ 제출 및 채점</button>
          </div>
        `;
      } else if (subStepCode === '2-3') {
        setMissionUI("<b>[2.2 개념학습] 수의 대소 관계 (교과서 p.38)</b><br>음수는 0보다 작고 양수는 0보다 크며, 음수끼리는 절댓값이 큰 수가 더 작습니다.");
        drawCompareCanvas(engine.two);
        formArea.innerHTML = `
          <div class="card">
            <div style="font-size:0.9rem; line-height:2.2; margin-bottom:14px;">
              부등호(&gt; 또는 &lt;)를 알맞게 써넣으시오:<br>
              (1) $-3$ ( <input type="text" id="p23-q1" class="proof-input-text" style="width:45px;"> ) $0$<br>
              (2) $-5$ ( <input type="text" id="p23-q2" class="proof-input-text" style="width:45px;"> ) $-2$<br>
              (3) $-\\frac{2}{3}$ ( <input type="text" id="p23-q3" class="proof-input-text" style="width:45px;"> ) $+\\frac{1}{2}$
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check23Submit()">✅ 제출 및 채점</button>
          </div>
        `;
      } else if (subStepCode === '2-4') {
        setMissionUI("<b>[2.2 개념학습] 부등호의 사용 (교과서 p.39)</b><br>이상($\\ge$), 이하($\\le$), 초과($>$), 미만($<$)의 수학적 표현을 익히세요.");
        drawCompareCanvas(engine.two);
        formArea.innerHTML = `
          <div class="card">
            <div style="font-size:0.88rem; line-height:2.0; margin-bottom:14px;">
              • $x$는 $-2$ 이상이고 $5$ 미만이다 ➔ <b>$-2$ ( <input type="text" id="p24-s1" class="proof-input-text" style="width:45px;" placeholder="<="> ) $x$ ( <input type="text" id="p24-s2" class="proof-input-text" style="width:45px;" placeholder="<"> ) $5$</b><br>
              • $y$는 $3$보다 크지 않다 ➔ <b>$y$ ( <input type="text" id="p24-s3" class="proof-input-text" style="width:45px;" placeholder="<="> ) $3$</b>
            </div>
            <button class="btn btn-primary" style="width:100%; padding:11px; font-weight:800;" onclick="check24Submit()">🏆 2.2 완수! [2.3 덧셈과 뺄셈] 해금</button>
          </div>
        `;
      } else if (subStepCode === '3-1') {
        setMissionUI("<b>[2.3 생각열기] 엘리베이터 이동과 덧셈 (교과서 p.40)</b><br>위로 3개 층, 아래로 5개 층을 이동한 위치를 계산해 보세요.");
        drawElevatorCanvas(engine.two);
        formArea.innerHTML = `
          <div class="card">
            <div style="font-size:0.88rem; line-height:2.0; margin-bottom:14px;">
              • 식: $(+3) + (-5) = ($ <input type="text" id="p31-ans" class="proof-input-text" style="width:60px;"> $)$
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check31Submit()">✅ 제출 및 다음 단계 ➔</button>
          </div>
        `;
      } else if (subStepCode === '3-2') {
        setMissionUI("<b>[2.3 개념학습] 덧셈의 계산 원리 (교과서 p.41~42)</b><br>정수와 유리수의 덧셈을 연습하세요.");
        drawVectorAdditionCanvas(engine.two);
        formArea.innerHTML = `
          <div class="card">
            <div style="font-size:0.88rem; line-height:2.2; margin-bottom:14px;">
              (1) $(+3) + (+5) = ($ <input type="text" id="p32-q1" class="proof-input-text" style="width:65px;"> $)$<br>
              (2) $(-4) + (-3) = ($ <input type="text" id="p32-q2" class="proof-input-text" style="width:65px;"> $)$<br>
              (3) $(+7) + (-2) = ($ <input type="text" id="p32-q3" class="proof-input-text" style="width:65px;"> $)$<br>
              (4) $(-6) + (+1) = ($ <input type="text" id="p32-q4" class="proof-input-text" style="width:65px;"> $)$
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check32Submit()">✅ 제출 및 채점</button>
          </div>
        `;
      } else if (subStepCode === '3-3') {
        setMissionUI("<b>[2.3 개념학습] 덧셈의 연산법칙 (교과서 p.43)</b><br>교환법칙과 결합법칙을 활용하여 계산을 간편하게 해보세요.");
        drawVectorAdditionCanvas(engine.two);
        formArea.innerHTML = `
          <div class="card">
            <div style="font-size:0.88rem; line-height:2.0; margin-bottom:14px;">
              $(-12) + (+25) + (+12) = ($ <input type="text" id="p33-ans" class="proof-input-text" style="width:65px;"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check33Submit()">✅ 제출 및 채점</button>
          </div>
        `;
      } else if (subStepCode === '3-4') {
        setMissionUI("<b>[2.3 개념학습] 뺄셈의 계산 원리 (교과서 p.46~48)</b><br>두 수의 뺄셈은 빼는 수의 부호를 바꾸어 더합니다.");
        drawVectorAdditionCanvas(engine.two);
        formArea.innerHTML = `
          <div class="card">
            <div style="font-size:0.88rem; line-height:2.2; margin-bottom:14px;">
              (1) $(+5) - (+3) = ($ <input type="text" id="p34-q1" class="proof-input-text" style="width:65px;"> $)$<br>
              (2) $(+2) - (-6) = ($ <input type="text" id="p34-q2" class="proof-input-text" style="width:65px;"> $)$<br>
              (3) $(-4) - (+5) = ($ <input type="text" id="p34-q3" class="proof-input-text" style="width:65px;"> $)$<br>
              (4) $(-3) - (-7) = ($ <input type="text" id="p34-q4" class="proof-input-text" style="width:65px;"> $)$
            </div>
            <button class="btn btn-primary" style="width:100%; padding:11px; font-weight:800;" onclick="check34Submit()">🏆 2.3 완수! [2.4 곱셈과 나눗셈] 해금</button>
          </div>
        `;
      } else if (subStepCode === '4-1') {
        setMissionUI("<b>[2.4 생각열기] 물탱크 수위 변화와 곱셈 (교과서 p.51)</b><br>매분 2cm씩 수위가 변할 때 부호의 곱셈 규칙을 알아봅시다.");
        drawWaterTankCanvas(engine.two);
        formArea.innerHTML = `
          <div class="card">
            <div style="font-size:0.88rem; line-height:2.0; margin-bottom:14px;">
              • $(+2) \\times (+3) = ($ <input type="text" id="p41-a1" class="proof-input-text" style="width:60px;"> $)$<br>
              • $(-2) \\times (+3) = ($ <input type="text" id="p41-a2" class="proof-input-text" style="width:60px;"> $)$<br>
              • $(-2) \\times (-3) = ($ <input type="text" id="p41-a3" class="proof-input-text" style="width:60px;"> $)$
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check41Submit()">✅ 제출 및 다음 단계 ➔</button>
          </div>
        `;
      } else if (subStepCode === '4-2') {
        setMissionUI("<b>[2.4 개념학습] 곱셈의 부호 규칙 (교과서 p.52~54)</b><br>동부호는 $+$, 이부호는 $-$입니다.");
        drawSignMultiplicationCanvas(engine.two);
        formArea.innerHTML = `
          <div class="card">
            <div style="font-size:0.88rem; line-height:2.2; margin-bottom:14px;">
              (1) $(+4) \\times (+3) = ($ <input type="text" id="p42-q1" class="proof-input-text" style="width:60px;"> $)$<br>
              (2) $(-5) \\times (-6) = ($ <input type="text" id="p42-q2" class="proof-input-text" style="width:60px;"> $)$<br>
              (3) $(+7) \\times (-2) = ($ <input type="text" id="p42-q3" class="proof-input-text" style="width:60px;"> $)$<br>
              (4) $(-2)^3 = ($ <input type="text" id="p42-q4" class="proof-input-text" style="width:60px;"> $)$
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check42Submit()">✅ 제출 및 채점</button>
          </div>
        `;
      } else if (subStepCode === '4-3') {
        setMissionUI("<b>[2.4 개념학습] 나눗셈과 역수 (교과서 p.58~60)</b><br>두 수의 곱이 1이 될 때 역수라고 합니다.");
        drawReciprocalCanvas(engine.two);
        formArea.innerHTML = `
          <div class="card">
            <div style="font-size:0.88rem; line-height:2.2; margin-bottom:14px;">
              • $-\\frac{3}{4}$의 역수: ( <input type="text" id="p43-rec" class="proof-input-text" style="width:70px;" placeholder="-4/3"> )<br>
              • $(-12) \\div (+3) = ($ <input type="text" id="p43-q1" class="proof-input-text" style="width:60px;"> $)$<br>
              • $(-8) \\div \\left(-\\frac{2}{3}\\right) = ($ <input type="text" id="p43-q2" class="proof-input-text" style="width:60px;"> $)$
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check43Submit()">✅ 제출 및 채점</button>
          </div>
        `;
      } else if (subStepCode === '4-4') {
        setMissionUI("<b>[2.4 문제] 사칙연산 혼합 계산 (교과서 p.61~62)</b><br>계산 순서를 지켜 정확하게 풀어보세요.");
        drawOperationOrderCanvas(engine.two);
        formArea.innerHTML = `
          <div class="card">
            <div style="font-size:0.9rem; line-height:2.2; margin-bottom:14px;">
              [계산 문제] $5 - (-2)^2 \\times 3 + 4 = ($ <input type="text" id="p44-ans" class="proof-input-text" style="width:70px;"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:11px; font-weight:800;" onclick="check44Submit()">🏆 2.4 완수! [2.5 스스로 마무리하기] 해금</button>
          </div>
        `;
      } else if (subStepCode === '5-1') {
        setMissionUI("<b>[2.5 스스로 마무리하기] 2단원 정수와 유리수 총정리 형성평가 (교과서 p.64~66)</b><br>정수와 유리수 대단원 종합 평가입니다.");
        drawTrophyCanvas(engine.two);
        formArea.innerHTML = `
          <div class="card">
            <div style="font-size:0.92rem; font-weight:800; color:#0284c7; margin-bottom:10px;">[1] 다음 수 중 음의 유리수를 모두 쓰시오: $+3, -2.5, 0, -7, +\\frac{1}{2}$</div>
            <div style="font-size:0.88rem; line-height:2.0; margin-bottom:12px;">( <input type="text" id="p51-q1" class="proof-input-text" style="width:140px;" placeholder="-2.5, -7"> )</div>
            <div style="font-size:0.92rem; font-weight:800; color:#0284c7; margin-bottom:10px;">[2] $|x| = 6$인 $x$의 값을 모두 쓰시오:</div>
            <div style="font-size:0.88rem; line-height:2.0; margin-bottom:12px;">( <input type="text" id="p51-q2" class="proof-input-text" style="width:120px;" placeholder="+6, -6"> )</div>
            <div style="font-size:0.92rem; font-weight:800; color:#0284c7; margin-bottom:10px;">[3] $(-3) + (-4) \\times (-2) - 1 = ($ <input type="text" id="p51-q3" class="proof-input-text" style="width:60px;"> )</div>
            <button class="btn btn-primary" style="width:100%; padding:13px; font-weight:800;" onclick="check51Submit()">🎓 2단원 정수와 유리수 최종 완료 및 인증서 획득!</button>
          </div>
        `;
      }

      restoreFormInputs(subStepCode);
      renderMathInPage(formArea);
      renderMathInPage(document.getElementById('mission-text'));
    }

    // --- TWO.JS 2D CANVAS RENDERERS ---
    function drawNumberLineBasicCanvas(two) {
      if (!two) return; two.clear();
      const cx = two.width / 2, cy = two.height / 2;
      two.makeLine(50, cy, two.width - 50, cy).stroke = '#1e293b';
      for (let i = 0; i <= 10; i++) {
        const x = 70 + i * ((two.width - 140) / 10);
        two.makeLine(x, cy - 6, x, cy + 6).stroke = '#64748b';
        two.makeText(String(i), x, cy + 22).size = 13;
      }
      two.update();
    }

    function drawCompareCanvas(two) {
      if (!two) return; two.clear();
      const cx = two.width / 2, cy = two.height / 2;
      const rect = two.makeRoundedRectangle(cx, cy, 460, 180, 14);
      rect.fill = '#f8fafc'; rect.stroke = '#0284c7'; rect.linewidth = 2;
      two.makeText('수직선에서 오른쪽으로 갈수록 커진다!', cx, cy - 30).size = 17;
      two.makeText('음수 < 0 < 양수', cx, cy + 25).size = 24;
      two.update();
    }

    function drawFractionCanvas(two) {
      if (!two) return; two.clear();
      const cx = two.width / 2, cy = two.height / 2;
      two.makeText('(2/5) × (3/4) = 6/20 = 3/10', cx, cy).size = 20;
      two.update();
    }

    function drawThermometerCanvas(two) {
      if (!two) return; two.clear();
      const cx = two.width / 2, cy = two.height / 2;
      two.makeRoundedRectangle(cx, cy, 30, 220, 15).fill = '#f1f5f9';
      two.makeCircle(cx, cy + 110, 25).fill = '#ef4444';
      two.makeRectangle(cx, cy + 40, 14, 140).fill = '#ef4444';
      two.makeText('영상 (+)', cx + 55, cy - 50).size = 15;
      two.makeText('0℃ (기준)', cx + 60, cy).size = 15;
      two.makeText('영하 (-)', cx + 55, cy + 50).size = 15;
      two.update();
    }

    function drawSignConceptCanvas(two) {
      if (!two) return; two.clear();
      const cx = two.width / 2, cy = two.height / 2;
      two.makeRoundedRectangle(cx - 130, cy, 180, 160, 14).fill = '#fee2e2';
      two.makeText('음수 (-)\n0보다 작은 수\n-1, -2.5', cx - 130, cy).size = 16;
      two.makeCircle(cx, cy, 30).fill = '#f1f5f9';
      two.makeText('0', cx, cy).size = 16;
      two.makeRoundedRectangle(cx + 130, cy, 180, 160, 14).fill = '#e0f2fe';
      two.makeText('양수 (+)\n0보다 큰 수\n+1, +2.5', cx + 130, cy).size = 16;
      two.update();
    }

    function drawNumberClassificationCanvas(two) {
      if (!two) return; two.clear();
      const cx = two.width / 2, cy = two.height / 2;
      two.makeText('유리수: 분수 (b/a, a≠0) 꼴로 나타낼 수 있는 수\n\n정수: 양의 정수, 0, 음의 정수\n정수가 아닌 유리수: 1/2, -0.75, 3/4', cx, cy).size = 16;
      two.update();
    }

    function drawIntegerNumberLineCanvas(two) {
      if (!two) return; two.clear();
      const cx = two.width / 2, cy = two.height / 2;
      two.makeLine(50, cy, two.width - 50, cy).stroke = '#1e293b';
      for (let i = -5; i <= 5; i++) {
        const x = cx + i * 45;
        two.makeLine(x, cy - 6, x, cy + 6).stroke = (i === 0) ? '#ef4444' : '#64748b';
        two.makeText(String(i), x, cy + 22).size = 13;
      }
      two.update();
    }

    function drawStarCanvas(two) {
      if (!two) return; two.clear();
      const cx = two.width / 2, cy = two.height / 2;
      two.makeText('⭐ 시리우스: -1.46등급   <   ✨ 북극성: +2.0등급\n수가 작을수록 더 밝다!', cx, cy).size = 18;
      two.update();
    }

    function drawAbsoluteCanvas(two) {
      if (!two) return; two.clear();
      const cx = two.width / 2, cy = two.height / 2;
      two.makeLine(60, cy, two.width - 60, cy).stroke = '#1e293b';
      for (let i = -4; i <= 4; i++) {
        const x = cx + i * 45;
        two.makeLine(x, cy - 6, x, cy + 6).stroke = '#64748b';
        two.makeText(String(i), x, cy + 22).size = 13;
      }
      two.makeText('|-3| = 3  (원점으로부터의 거리 = 3)\n|+3| = 3  (원점으로부터의 거리 = 3)', cx, cy - 60).size = 16;
      two.update();
    }

    function drawElevatorCanvas(two) {
      if (!two) return; two.clear();
      const cx = two.width / 2, cy = two.height / 2;
      two.makeText('🏢 엘리베이터 이동: (+3) + (-5) = -2 (지하 2층)', cx, cy).size = 18;
      two.update();
    }

    function drawVectorAdditionCanvas(two) {
      if (!two) return; two.clear();
      const cx = two.width / 2, cy = two.height / 2;
      two.makeLine(50, cy, two.width - 50, cy).stroke = '#1e293b';
      for (let i = -5; i <= 5; i++) {
        const x = cx + i * 40;
        two.makeLine(x, cy - 6, x, cy + 6).stroke = '#64748b';
        two.makeText(String(i), x, cy + 22).size = 12;
      }
      two.makeText('수직선 이동: (+3) ➔ 3칸 오른쪽, (-5) ➔ 5칸 왼쪽 ➔ 위치 -2', cx, cy - 50).size = 16;
      two.update();
    }

    function drawWaterTankCanvas(two) {
      if (!two) return; two.clear();
      const cx = two.width / 2, cy = two.height / 2;
      two.makeText('수위 변화: (-2) × (-3) = +6 (3분 전에는 6cm 더 높았다!)', cx, cy).size = 17;
      two.update();
    }

    function drawSignMultiplicationCanvas(two) {
      if (!two) return; two.clear();
      const cx = two.width / 2, cy = two.height / 2;
      two.makeText('(+) × (+) = (+)\n(-) × (-) = (+)\n(+) × (-) = (-)\n(-) × (+) = (-)', cx, cy).size = 20;
      two.update();
    }

    function drawReciprocalCanvas(two) {
      if (!two) return; two.clear();
      const cx = two.width / 2, cy = two.height / 2;
      two.makeText('역수: 두 수의 곱이 1이 되는 수\n-3/4 × (-4/3) = 1 ➔ 역수는 -4/3', cx, cy).size = 18;
      two.update();
    }

    function drawOperationOrderCanvas(two) {
      if (!two) return; two.clear();
      const cx = two.width / 2, cy = two.height / 2;
      two.makeText('계산 순서: 거듭제곱 ➔ 괄호 ➔ 곱셈/나눗셈 ➔ 덧셈/뺄셈', cx, cy).size = 18;
      two.update();
    }

    function drawTrophyCanvas(two) {
      if (!two) return; two.clear();
      const cx = two.width / 2, cy = two.height / 2;
      two.makeText('🏆\n2단원 정수와 유리수 완주를 축하합니다!', cx, cy).size = 22;
      two.update();
    }

    // --- CHECKERS ---
    function normTxt(v) { return v ? v.trim().replace(/\s+/g, '').toUpperCase() : ''; }

    function showInlineErrorNotice(msg) {
      const formArea = document.getElementById('form-work-area');
      if (!formArea) return;
      let errBox = formArea.querySelector('.proof-error-notice');
      if (!errBox) {
        errBox = document.createElement('div');
        errBox.className = 'proof-error-notice';
        const card = formArea.querySelector('.card') || formArea;
        card.appendChild(errBox);
      }
      errBox.innerHTML = `<div>${String(msg).replace(/\n/g, '<br>')}</div>`;
      errBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function renderVerifiedAnswerView(titleHtml, contentHtml, nextStepCode) {
      if (!state.completedSubSteps.includes(state.subStep)) state.completedSubSteps.push(state.subStep);
      if (nextStepCode && !state.unlockedSubSteps.includes(nextStepCode)) state.unlockedSubSteps.push(nextStepCode);

      if (nextStepCode) {
        const nextMain = parseInt(nextStepCode.split('-')[0]);
        if (!state.unlockedTabs.includes(nextMain)) state.unlockedTabs.push(nextMain);
      }

      const formArea = document.getElementById('form-work-area');
      if (!formArea) return;
      formArea.innerHTML = `
        <div class="verified-answer-card">
          <h4>✅ 정답 확인 및 개념 완수!</h4>
          <div style="font-size:0.95rem; font-weight:800; color:#065f46; margin-bottom:8px;">${titleHtml}</div>
          <div style="font-size:0.88rem; color:#047857; line-height:1.7; margin-bottom:14px;">${contentHtml}</div>
          <button class="btn btn-primary" style="background:#059669; font-size:1rem; padding:12px; width:100%; font-weight:800;" onclick="loadSubStep('${nextStepCode}')">
            🚀 다음 단계로 진행하기 ➔
          </button>
        </div>
      `;
      renderMathInPage(formArea);
    }

    function check01Submit() {
      const a1 = normTxt(document.getElementById('p01-ans1').value);
      const a2 = normTxt(document.getElementById('p01-ans2').value);
      if (a1.includes('1') && a1.includes('9') && a1.includes('100') && a2 === '0.3') {
        renderVerifiedAnswerView("되짚어보기 1 완수!", "• 자연수: <b>1, 9, 100</b>, 소수: <b>0.3</b>", "0-2");
      } else showInlineErrorNotice("자연수(1, 9, 100)와 소수(0.3)를 확인하세요!");
    }

    function check02Submit() {
      const q1 = normTxt(document.getElementById('p02-q1').value);
      const q2 = normTxt(document.getElementById('p02-q2').value);
      if ((q1 === '<' || q1.includes('작')) && (q2 === '>' || q2.includes('크'))) {
        renderVerifiedAnswerView("되짚어보기 2 완수!", "2 < 5, 0.5 > 0.05", "0-3");
      } else showInlineErrorNotice("부등호(<, >)를 확인하세요!");
    }

    function check03Submit() {
      const ans = normTxt(document.getElementById('p03-ans').value);
      if (ans === '3/10' || ans === '0.3') {
        renderVerifiedAnswerView("되짚어보기 3 완수! [2.1 정수와 유리수] 해금!", "(2/5) × (3/4) = <b>3/10</b>", "1-1");
      } else showInlineErrorNotice("3/10을 입력하세요!");
    }

    function check11Submit() {
      const t1 = normTxt(document.getElementById('p11-t1').value);
      const t2 = normTxt(document.getElementById('p11-t2').value);
      const t3 = normTxt(document.getElementById('p11-t3').value);
      if (t1.includes('-2') && t2.includes('+12') && t3.includes('-300')) {
        renderVerifiedAnswerView("2.1 생각열기 완수!", "-2℃, +12℃, -300원", "1-2");
      } else showInlineErrorNotice("-2, +12, -300을 확인하세요!");
    }

    function check12Submit() {
      const pos = normTxt(document.getElementById('p12-pos').value);
      const neg = normTxt(document.getElementById('p12-neg').value);
      const zero = normTxt(document.getElementById('p12-zero').value);
      if (pos.includes('양수') && neg.includes('음수') && zero.includes('아니')) {
        renderVerifiedAnswerView("양수와 음수 완수!", "양수, 음수, 0은 양수도 음수도 아니다", "1-3");
      } else showInlineErrorNotice("양수, 음수 및 0의 성질을 확인하세요!");
    }

    function check13Submit() {
      const z = normTxt(document.getElementById('p13-z').value);
      const q = normTxt(document.getElementById('p13-q').value);
      const ans = normTxt(document.getElementById('p13-ans').value);
      if (z === '0' && q.includes('유리수') && ans.includes('3/4')) {
        renderVerifiedAnswerView("정수와 유리수 분류 완수!", "0, 유리수, 3/4", "1-4");
      } else showInlineErrorNotice("0, 유리수, 3/4를 확인하세요!");
    }

    function check14Submit() {
      const a = normTxt(document.getElementById('p14-a').value);
      const b = normTxt(document.getElementById('p14-b').value);
      const c = normTxt(document.getElementById('p14-c').value);
      if (a.includes('-3') && b.includes('-1.5') && (c.includes('+2') || c.includes('2'))) {
        renderVerifiedAnswerView("🏆 2.1 완수! [2.2 대소 관계와 절댓값] 해금!", "A: -3, B: -1.5, C: +2", "2-1");
      } else showInlineErrorNotice("-3, -1.5, +2를 확인하세요!");
    }

    function check21Submit() {
      const star = normTxt(document.getElementById('p21-star').value);
      const left = normTxt(document.getElementById('p21-left').value);
      if (star.includes('시리우스') && (left.includes('작') || left.includes('SMALL'))) {
        renderVerifiedAnswerView("2.2 생각열기 완수!", "시리우스, 작다", "2-2");
      } else showInlineErrorNotice("시리우스와 '작다'를 확인하세요!");
    }

    function check22Submit() {
      const a1 = normTxt(document.getElementById('p22-a1').value);
      const a2 = normTxt(document.getElementById('p22-a2').value);
      const a3 = normTxt(document.getElementById('p22-a3').value);
      const a4 = normTxt(document.getElementById('p22-a4').value);
      if (a1 === '3' && a2 === '4' && a3 === '0' && a4.includes('5') && a4.includes('-5')) {
        renderVerifiedAnswerView("절댓값 완수!", "|+3|=3, |-4|=4, |0|=0, 절댓값 5인 수: +5, -5", "2-3");
      } else showInlineErrorNotice("3, 4, 0 및 +5, -5를 확인하세요!");
    }

    function check23Submit() {
      const q1 = normTxt(document.getElementById('p23-q1').value);
      const q2 = normTxt(document.getElementById('p23-q2').value);
      const q3 = normTxt(document.getElementById('p23-q3').value);
      if (q1 === '<' && q2 === '<' && q3 === '<') {
        renderVerifiedAnswerView("수의 대소 관계 완수!", "-3 < 0, -5 < -2, -2/3 < +1/2", "2-4");
      } else showInlineErrorNotice("부등호(<)를 확인하세요!");
    }

    function check24Submit() {
      const s1 = normTxt(document.getElementById('p24-s1').value);
      const s2 = normTxt(document.getElementById('p24-s2').value);
      const s3 = normTxt(document.getElementById('p24-s3').value);
      if ((s1 === '<=' || s1 === '≤') && s2 === '<' && (s3 === '<=' || s3 === '≤')) {
        renderVerifiedAnswerView("🏆 2.2 완수! [2.3 덧셈과 뺄셈] 해금!", "-2 ≤ x < 5, y ≤ 3", "3-1");
      } else showInlineErrorNotice("부등호(<=, <)를 확인하세요!");
    }

    function check31Submit() {
      const ans = normTxt(document.getElementById('p31-ans').value);
      if (ans === '-2') {
        renderVerifiedAnswerView("3.1 생각열기 완수!", "(+3) + (-5) = -2", "3-2");
      } else showInlineErrorNotice("-2를 입력하세요!");
    }

    function check32Submit() {
      const q1 = normTxt(document.getElementById('p32-q1').value);
      const q2 = normTxt(document.getElementById('p32-q2').value);
      const q3 = normTxt(document.getElementById('p32-q3').value);
      const q4 = normTxt(document.getElementById('p32-q4').value);
      if (q1.includes('8') && q2.includes('-7') && q3.includes('5') && q4.includes('-5')) {
        renderVerifiedAnswerView("덧셈의 계산 원리 완수!", "+8, -7, +5, -5", "3-3");
      } else showInlineErrorNotice("+8, -7, +5, -5를 확인하세요!");
    }

    function check33Submit() {
      const ans = normTxt(document.getElementById('p33-ans').value);
      if (ans.includes('25')) {
        renderVerifiedAnswerView("덧셈의 연산법칙 완수!", "+25", "3-4");
      } else showInlineErrorNotice("25를 입력하세요!");
    }

    function check34Submit() {
      const q1 = normTxt(document.getElementById('p34-q1').value);
      const q2 = normTxt(document.getElementById('p34-q2').value);
      const q3 = normTxt(document.getElementById('p34-q3').value);
      const q4 = normTxt(document.getElementById('p34-q4').value);
      if (q1.includes('2') && q2.includes('8') && q3.includes('-9') && q4.includes('4')) {
        renderVerifiedAnswerView("🏆 2.3 완수! [2.4 곱셈과 나눗셈] 해금!", "+2, +8, -9, +4", "4-1");
      } else showInlineErrorNotice("+2, +8, -9, +4를 확인하세요!");
    }

    function check41Submit() {
      const a1 = normTxt(document.getElementById('p41-a1').value);
      const a2 = normTxt(document.getElementById('p41-a2').value);
      const a3 = normTxt(document.getElementById('p41-a3').value);
      if (a1.includes('6') && a2.includes('-6') && a3.includes('6')) {
        renderVerifiedAnswerView("2.4 생각열기 완수!", "+6, -6, +6", "4-2");
      } else showInlineErrorNotice("+6, -6, +6을 확인하세요!");
    }

    function check42Submit() {
      const q1 = normTxt(document.getElementById('p42-q1').value);
      const q2 = normTxt(document.getElementById('p42-q2').value);
      const q3 = normTxt(document.getElementById('p42-q3').value);
      const q4 = normTxt(document.getElementById('p42-q4').value);
      if (q1.includes('12') && q2.includes('30') && q3.includes('-14') && q4.includes('-8')) {
        renderVerifiedAnswerView("곱셈의 부호 규칙 완수!", "+12, +30, -14, -8", "4-3");
      } else showInlineErrorNotice("+12, +30, -14, -8을 확인하세요!");
    }

    function check43Submit() {
      const rec = normTxt(document.getElementById('p43-rec').value);
      const q1 = normTxt(document.getElementById('p43-q1').value);
      const q2 = normTxt(document.getElementById('p43-q2').value);
      if (rec.includes('-4/3') && q1.includes('-4') && q2.includes('12')) {
        renderVerifiedAnswerView("나눗셈과 역수 완수!", "-4/3, -4, 12", "4-4");
      } else showInlineErrorNotice("-4/3, -4, 12를 확인하세요!");
    }

    function check44Submit() {
      const ans = normTxt(document.getElementById('p44-ans').value);
      if (ans.includes('-3')) {
        renderVerifiedAnswerView("🏆 2.4 완수! [2.5 스스로 마무리하기] 해금!", "5 - 12 + 4 = -3", "5-1");
      } else showInlineErrorNotice("답: -3을 확인하세요!");
    }

    function check51Submit() {
      const q1 = normTxt(document.getElementById('p51-q1').value);
      const q2 = normTxt(document.getElementById('p51-q2').value);
      const q3 = normTxt(document.getElementById('p51-q3').value);
      if (q1.includes('-2.5') && q1.includes('-7') && q2.includes('6') && q2.includes('-6') && q3.includes('4')) {
        renderVerifiedAnswerView("🎉 2단원 정수와 유리수 전체 마스터 달성!", "음의 유리수: -2.5, -7 / |x|=6: +6, -6 / 계산 결과: 4", "5-1");
      } else showInlineErrorNotice("형성평가 문항을 다시 확인하고 제출하세요!");
    }

    // Teacher & Pass
    function openTeacherPassModal() { openSecurePasswordModal('teacher_pass', '교사 패스 (Pass)', '교사 비밀번호를 입력하세요.'); }
    function openTestLoginModal() { openSecurePasswordModal('teacher_login', '교사 계정 보안 접속', '교사 전용 마스터 비밀번호를 입력하세요.'); }
    let currentSecureAction = null;
    function openSecurePasswordModal(action, title, desc) {
      currentSecureAction = action;
      document.getElementById('secure-modal-title').innerText = title;
      document.getElementById('secure-modal-desc').innerText = desc;
      const inp = document.getElementById('secure-password-input');
      inp.value = '';
      document.getElementById('secure-password-modal').style.display = 'flex';
      setTimeout(() => inp.focus(), 100);
    }
    function closeSecurePasswordModal() { document.getElementById('secure-password-modal').style.display = 'none'; }
    function verifySecurePassword() {
      const pwd = document.getElementById('secure-password-input').value.trim();
      if (pwd === '260523' || pwd === '260831') {
        closeSecurePasswordModal();
        if (currentSecureAction === 'teacher_login') {
          state.isTeacherLoggedIn = true;
          state.unlockedTabs = [0, 1, 2, 3, 4, 5];
          state.unlockedSubSteps = ALL_CH2_SUBSTEPS;
          document.getElementById('btn-header-unlock-boundary').style.display = 'inline-block';
          document.getElementById('btn-header-teacher-dashboard').style.display = 'inline-block';
          document.getElementById('current-user-info').innerText = '👨‍🏫 교사 관리자 모드';
          switchView('activity');
          loadSubStep(state.subStep || '0-1');
        } else if (currentSecureAction === 'teacher_pass') {
          const curIdx = ALL_CH2_SUBSTEPS.indexOf(state.subStep);
          if (curIdx !== -1 && curIdx < ALL_CH2_SUBSTEPS.length - 1) {
            const nextSub = ALL_CH2_SUBSTEPS[curIdx + 1];
            state.completedSubSteps.push(state.subStep);
            state.unlockedSubSteps.push(nextSub);
            loadSubStep(nextSub);
          }
        }
      } else alert("❌ 비밀번호가 올바르지 않습니다.");
    }
    function openUnlockBoundaryModal() {
      const modal = document.getElementById('unlock-boundary-modal');
      const select = document.getElementById('select-unlock-substep-ch2');
      if (select) {
        select.innerHTML = '';
        ALL_CH2_SUBSTEPS.forEach(c => {
          const opt = document.createElement('option');
          opt.value = c;
          opt.innerText = `[${c}] ${SUBSTEP_TITLES[c] || c}`;
          select.appendChild(opt);
        });
      }
      if (modal) modal.style.display = 'flex';
    }
    function closeUnlockBoundaryModal() { document.getElementById('unlock-boundary-modal').style.display = 'none'; }
    function applyGlobalUnlockStepCh2() {
      const select = document.getElementById('select-unlock-substep-ch2');
      if (!select) return;
      const target = select.value;
      const targetIdx = ALL_CH2_SUBSTEPS.indexOf(target);
      if (targetIdx !== -1) {
        state.unlockedSubSteps = ALL_CH2_SUBSTEPS.slice(0, targetIdx + 1);
        const maxTab = parseInt(target.split('-')[0]);
        for (let t = 0; t <= maxTab; t++) {
          if (!state.unlockedTabs.includes(t)) state.unlockedTabs.push(t);
        }
        updateSubStepPills(state.currentMainTab);
        alert(`🔓 [${target}] 까지 학생 해금 범위가 설정되었습니다.`);
      }
      closeUnlockBoundaryModal();
    }
    function openTeacherDashboardModal() { switchView('teacher-dashboard'); renderTeacherGrid(); }
    function returnToStudentView() { switchView('activity'); }
    function renderTeacherGrid() {
      const container = document.getElementById('teacher-grid-container');
      if (!container) return;
      container.innerHTML = '';
      for (let i = 1; i <= 25; i++) {
        const id = `101${String(i).padStart(2, '0')}`;
        const card = document.createElement('div');
        card.className = 'card';
        card.style.padding = '10px';
        card.innerHTML = `<div style="font-weight:800;">👤 ${id} 학생</div><div>단계: ${state.subStep}</div><div style="color:#059669; font-weight:700;">🟢 학습 중</div>`;
        container.appendChild(card);
      }
    }
    function setTool(t) { state.tool = t; }
    function resetCanvasView() { if (twoInstance) loadSubStep(state.subStep); }

    window.addEventListener('DOMContentLoaded', () => {
      switchMainTab(0);
      loadSubStep('0-1');
    });
'''

code = re.sub(r'<script>.*?</script>', lambda m: f'<script>{js_content}\n  </script>', code, flags=re.DOTALL)

with open('/home/ubuntu/workspace/Redbook/g1_ch2_integers.html', 'w', encoding='utf-8') as f:
    f.write(code)

print("g1_ch2_integers.html complete! File size:", len(code))
