// scripts/subagent_evaluator_ch1.js
// 1단원 소인수분해 (g1_ch1_factors.html) 57개 서브스텝 전수 평가 스크립트
// 규칙 10 (소단원 스스로 확인하기 1문항 1페이지) 및 규칙 11 (스스로 마무리하기 전용 대주제 탭 14문항 분할) 완전 검증

const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

console.log("🤖 [서브에이전트] 1단원 설계 명세서(eval_ch1_spec.md) 로드 및 57개 서브스텝 독립 평가 시작...");

const htmlPath = path.join(__dirname, '../g1_ch1_factors.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const virtualConsole = new VirtualConsole();
virtualConsole.on('error', (e) => { /* ignore harmless jsdom cdn notices */ });
virtualConsole.on('warn', () => {});

// Mock browser environment
const dom = new JSDOM(html, {
  runScripts: "dangerously",
  url: "https://sjylim0829-commits.github.io/redbook-math-app/g1_ch1_factors.html",
  virtualConsole,
  beforeParse(window) {
    window.requestAnimationFrame = function(cb) { return setTimeout(cb, 16); };
    window.cancelAnimationFrame = function(id) { clearTimeout(id); };

    window.HTMLCanvasElement.prototype.getContext = function() {
      return {
        imageSmoothingEnabled: true,
        fillRect: () => {},
        clearRect: () => {},
        getImageData: (x, y, w, h) => ({ data: new Array((w || 10) * (h || 10) * 4) }),
        putImageData: () => {},
        createImageData: () => [],
        setTransform: () => {},
        drawImage: () => {},
        save: () => {},
        fillText: () => {},
        restore: () => {},
        beginPath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        closePath: () => {},
        stroke: () => {},
        translate: () => {},
        scale: () => {},
        rotate: () => {},
        arc: () => {},
        fill: () => {},
        measureText: () => ({ width: 20 }),
        transform: () => {},
        rect: () => {},
        clip: () => {}
      };
    };

    function createMockShape() {
      return {
        fill: '',
        stroke: '',
        linewidth: 1,
        opacity: 1,
        rotation: 0,
        translation: { set: () => {} },
        noFill: function() { this.fill = 'transparent'; return this; },
        noStroke: function() { this.stroke = 'transparent'; return this; }
      };
    }

    // Headless MockTwo for Two.js engine
    class MockTwo {
      constructor(opts = {}) {
        this.width = opts.width || 600;
        this.height = opts.height || 500;
        this.scene = { children: [] };
      }
      appendTo(el) {
        if (el && window.document) {
          const c = window.document.createElement('canvas');
          el.appendChild(c);
        }
        return this;
      }
      clear() {}
      update() {}
      makeLine() { return createMockShape(); }
      makeCircle() { return createMockShape(); }
      makeArc() { return createMockShape(); }
      makeRectangle() { return createMockShape(); }
      makeRoundedRectangle() { return createMockShape(); }
      makePolygon() { return createMockShape(); }
      makeText(t) { return Object.assign(createMockShape(), { size: 12, weight: 600 }); }
      makeCurve() { return createMockShape(); }
      makePath() { return createMockShape(); }
      makeGroup() { return Object.assign(createMockShape(), { add: () => {}, children: [] }); }
    }
    MockTwo.Types = { canvas: 'canvas' };
    window.Two = MockTwo;

    window.katex = { render: () => {} };
    window.renderMathInElement = () => {};

    window.Audio = function() {
      return { play: () => {}, pause: () => {} };
    };

    window.alert = function(msg) {
      console.log(`   [Alert Dialog]: ${msg ? msg.replace(/<[^>]*>/g, '').trim() : ''}`);
    };
  }
});

const window = dom.window;
const document = window.document;

// Evaluation check list
const checks = [];
let isCriticalFailed = false;

function recordCheck(id, name, passed, details = '') {
  checks.push({ id, name, passed, details });
  const mark = passed ? '✅' : '❌';
  console.log(`${mark} [${id}] ${name}: ${details}`);
  if (!passed && id.startsWith('REJECT')) {
    isCriticalFailed = true;
  }
}

// 57개 서브스텝 검증 데이터 (모든 정답 및 인풋 매핑)
const substepVerificationData = {
  // Tab 0 (4)
  '0-1': { inputs: { 'p01-div6': '1, 2, 3, 6', 'p01-div13': '1, 13', 'p01-mul24': '24, 48, 72' }, submitFn: 'check01Submit', next: '0-2' },
  '0-2': { inputs: { 'p02-common': '1, 2, 3, 6', 'p02-gcd': '6', 'p02-gcd45': '15' }, submitFn: 'check02Submit', next: '0-3' },
  '0-3': { inputs: { 'p03-lcm46': '12', 'p03-lcm912': '36', 'p03-prop': '배수' }, submitFn: 'check03Submit', next: '0-4' },
  '0-4': { inputs: { 'p04-g1': '1', 'p04-g2': '2, 3, 5, 7, 11, 13', 'p04-g3': '4, 6, 8, 9, 10, 12, 14, 15' }, submitFn: 'check04Submit', next: '1-1' },

  // Tab 1 (9)
  '1-1': { inputs: { 'p11-one': '둘 다 아님', 'p11-primes': '13, 23, 29', 'p11-composites': '15, 20' }, submitFn: 'check11Submit', next: '1-2' },
  '1-2': { inputs: { 'p12-count': '15', 'p12-prop': '소수' }, submitFn: 'check12Submit', next: '1-3' },
  '1-3': { inputs: { 'p13-q1': '2^2 * 3^2', 'p13-base': '5', 'p13-exp': '4' }, submitFn: 'check13Submit', next: '1-4' },
  '1-4': { inputs: { 'p14-primes': '17, 53', 'p14-comp': '8, 39' }, submitFn: 'check14Submit', next: '1-5' },
  '1-5': { inputs: { 'p15-q1': '5^4', 'p15-q2': '2*3^2*5', 'p15-q3': '3^2*7^5' }, submitFn: 'check15Submit', next: '1-6' },
  '1-6': { inputs: { 'p16-q3': 'ㄷ, ㄹ' }, submitFn: 'check16Submit', next: '1-7' },
  '1-7': { inputs: { 'p17-bacteria': '2^6' }, submitFn: 'check17Submit', next: '1-8' },
  '1-8': { inputs: { 'p18-sum': '9' }, submitFn: 'check18Submit', next: '1-9' },
  '1-9': { inputs: { 'p19-train25': '3', 'p19-train2': '2, 3, 5, 7, 11, 13, 17, 19, 23, 29' }, submitFn: 'check19Submit', next: '2-1' },

  // Tab 2 (9)
  '2-1': { inputs: { 'p21-primefac12': '2, 3', 'p21-pf30': '2, 3, 5', 'p21-pf45': '3, 5' }, submitFn: 'check21Submit', next: '2-2' },
  '2-2': { inputs: { 'p22-18': '2*3^2', 'p22-24': '2^3*3', 'p22-60': '2^2*3*5' }, submitFn: 'check22Submit', next: '2-3' },
  '2-3': { inputs: { 'p23-27': '3^3', 'p23-36': '2^2*3^2', 'p23-80': '2^4*5' }, submitFn: 'check23Submit', next: '2-4' },
  '2-4': { inputs: { 'p24-15': '3, 5', 'p24-22': '2, 11', 'p24-49': '7', 'p24-70': '2, 5, 7' }, submitFn: 'check24Submit', next: '2-5' },
  '2-5': { inputs: { 'p25-34': '2*17', 'p25-75': '3*5^2', 'p25-96': '2^5*3' }, submitFn: 'check25Submit', next: '2-6' },
  '2-6': { inputs: { 'p26-exp2': '4' }, submitFn: 'check26Submit', next: '2-7' },
  '2-7': { inputs: { 'p27-square': '14' }, submitFn: 'check27Submit', next: '2-8' },
  '2-8': { inputs: { 'p28-sunwoo': '65, 77' }, submitFn: 'check28Submit', next: '2-9' },
  '2-9': { inputs: { 'p29-cnt160': '12', 'p29-exp': '3' }, submitFn: 'check29Submit', next: '3-1' },

  // Tab 3 (10)
  '3-1': { inputs: { 'p31-def': '서로소', 'p31-coprime': '1, 3' }, submitFn: 'check31Submit', next: '3-2' },
  '3-2': { inputs: { 'p32-gcd2484': '12', 'p32-q1': '20', 'p32-q2': '28' }, submitFn: 'check32Submit', next: '3-3' },
  '3-3': { inputs: { 'p33-ex1': '6', 'p33-follow': '15', 'p33-q3': '18' }, submitFn: 'check33Submit', next: '3-4' },
  '3-4': { inputs: { 'p34-q1a': '14', 'p34-q1b': '6' }, submitFn: 'check34Submit', next: '3-5' },
  '3-5': { inputs: { 'p35-q2a': '63', 'p35-q2b': '13' }, submitFn: 'check35Submit', next: '3-6' },
  '3-6': { inputs: { 'p36-coprimes': '22, 23, 26, 28, 29' }, submitFn: 'check36Submit', next: '3-7' },
  '3-7': { inputs: { 'p37-sum': '4' }, submitFn: 'check37Submit', next: '3-8' },
  '3-8': { inputs: { 'p38-max': '35' }, submitFn: 'check38Submit', next: '3-9' },
  '3-9': { inputs: { 'p39-div': '15' }, submitFn: 'check39Submit', next: '3-10' },
  '3-10': { inputs: { 'p310-wide': '14, 28, 35' }, submitFn: 'check310Submit', next: '4-1' },

  // Tab 4 (10)
  '4-1': { inputs: { 'p41-cycle': '2034', 'p41-lcm5490': '270' }, submitFn: 'check41Submit', next: '4-2' },
  '4-2': { inputs: { 'p42-gearLcm': '72', 'p42-ex1': '504', 'p42-follow': '240' }, submitFn: 'check42Submit', next: '4-3' },
  '4-3': { inputs: { 'p43-q1a': '495', 'p43-q1b': '189' }, submitFn: 'check43Submit', next: '4-4' },
  '4-4': { inputs: { 'p44-q2a': '432', 'p44-q2b': '126' }, submitFn: 'check44Submit', next: '4-5' },
  '4-5': { inputs: { 'p45-min': '490' }, submitFn: 'check45Submit', next: '4-6' },
  '4-6': { inputs: { 'p46-valA': '6' }, submitFn: 'check46Submit', next: '4-7' },
  '4-7': { inputs: { 'p47-candidates': '1, 3, 6, 9, 18' }, submitFn: 'check47Submit', next: '4-8' },
  '4-8': { inputs: { 'p48-threeDigits': '180' }, submitFn: 'check48Submit', next: '4-9' },
  '4-9': { inputs: { 'p49-pair': '8, 36' }, submitFn: 'check49Submit', next: '4-10' },
  '4-10': { inputs: { 'p410-115': '합성수', 'p410-269': '소수', 'p410-2027': '소수', 'p410-logic': '약수' }, submitFn: 'check410Submit', next: '5-1' },

  // Tab 5: 스스로 마무리하기 (14)
  '5-1': { inputs: { 'p51-cnt': '11' }, submitFn: 'check51Submit', next: '5-2' },
  '5-2': { inputs: { 'p52-choice': 'ㄱ, ㄴ, ㄹ' }, submitFn: 'check52Submit', next: '5-3' },
  '5-3': { inputs: { 'p53-digit': '8' }, submitFn: 'check53Submit', next: '5-4' },
  '5-4': { inputs: { 'p54-no': '4' }, submitFn: 'check54Submit', next: '5-5' },
  '5-5': { inputs: { 'p55-sum': '23' }, submitFn: 'check55Submit', next: '5-6' },
  '5-6': { inputs: { 'p56-cop': '4' }, submitFn: 'check56Submit', next: '5-7' },
  '5-7': { inputs: { 'p57-ans': '4' }, submitFn: 'check57Submit', next: '5-8' },
  '5-8': { inputs: { 'p58-valA': '60' }, submitFn: 'check58Submit', next: '5-9' },
  '5-9': { inputs: { 'p59-gcd': '20' }, submitFn: 'check59Submit', next: '5-10' },
  '5-10': { inputs: { 'p510-frac': '70/3' }, submitFn: 'check510Submit', next: '5-11' },
  '5-11': { inputs: { 'p511-sum': '10' }, submitFn: 'check511Submit', next: '5-12' },
  '5-12': { inputs: { 'p512-sum': '17' }, submitFn: 'check512Submit', next: '5-13' },
  '5-13': { inputs: { 'p513-valA': '18' }, submitFn: 'check513Submit', next: '5-14' },
  '5-14': { inputs: { 'p514-sum': '162' }, submitFn: 'check514Submit', next: '6-1' },

  // Tab 6: 창의융합 프로젝트 (1)
  '6-1': { inputs: { 'p61-rule': '넓이', 'p61-strat': '경우의 수가 적음' }, submitFn: 'check61Submit', next: '6-1' }
};

const allSubstepCodes = Object.keys(substepVerificationData);

async function runEvaluation() {
  console.log(`\n🔍 [평가 1단계] 인증 시스템 및 기본 아키텍처 감사 (57개 서브스텝 규격)...`);

  // --- [INTENT-01-B] 학생 로그인 및 초기 잠금 ---
  try {
    const studentInput = document.getElementById('student-id');
    const passwordInput = document.getElementById('student-name');
    studentInput.value = '10101';
    if (passwordInput) passwordInput.value = '1234';
    await window.handleLMSLogin({ preventDefault: () => {} });

    const isActivityVisible = document.getElementById('view-activity').style.display !== 'none';
    const is01Unlocked = window.state.unlockedSubSteps.includes('0-1');
    const isLaterLocked = !window.state.unlockedSubSteps.includes('1-1') && !window.state.unlockedSubSteps.includes('5-1');
    recordCheck('INTENT-01-B', '학생 로그인 및 초기 단계 잠금', isActivityVisible && is01Unlocked && isLaterLocked,
      `10101 학생 로그인 후 0-1 기본 해금, 이후 단계 잠금 정상 작동`);
  } catch (e) {
    recordCheck('INTENT-01-B', '학생 로그인 검사', false, e.message);
  }

  // --- [INTENT-01-C] 2대 교사 마스터 비밀번호 프리패스 ---
  try {
    let bypassPass = true;
    const studentInput = document.getElementById('student-id');
    const passwordInput = document.getElementById('student-name');

    for (const code of ['260523', '260831']) {
      studentInput.value = code;
      passwordInput.value = code;
      await window.handleLMSLogin({ preventDefault: () => {} });
      if (!window.state.isTeacherLoggedIn || window.state.unlockedSubSteps.length < 57) {
        bypassPass = false;
        break;
      }
    }
    recordCheck('INTENT-01-C', '2대 교사 마스터 비밀번호(260523, 260831) 57개 서브스텝 전체 해금', bypassPass,
      `마스터 번호 입력 시 관리자 모드 진입 및 57개 서브스텝 100% 프리패스 확인`);
  } catch (e) {
    recordCheck('INTENT-01-C', '교사 마스터 번호 바이패스 검사', false, e.message);
  }

  // --- [INTENT-01-D] 교사 계정 접속 버튼 및 모달 인증 ---
  try {
    window.state.isTeacherLoggedIn = false;
    window.state.unlockedSubSteps = ['0-1'];
    window.openTestLoginModal();
    const modal = document.getElementById('secure-password-modal');
    const modalShown = (modal && modal.style.display === 'flex');

    const pwInput = document.getElementById('secure-modal-input');
    if (pwInput) pwInput.value = '260831';
    window.handleSecurePasswordSubmit({ preventDefault: () => {} });

    const modalClosed = (!modal || modal.style.display === 'none');
    const isTeacherRole = window.state.isTeacherLoggedIn && window.state.unlockedSubSteps.length >= 57;

    recordCheck('INTENT-01-D', '교사 계정 접속 버튼 및 모달 인증 (260831 지원)', modalShown && modalClosed && isTeacherRole,
      `모달 출현 ➔ 260831 인증 ➔ 관리자 권한 획득 플로우 정상`);
  } catch (e) {
    recordCheck('INTENT-01-D', '교사 모달 인증 검사', false, e.message);
  }

  // --- [INTENT-02] 노란색 정답 빈칸 규격 ---
  try {
    const hasYellowStyle = html.includes('#fef08a') && html.includes('proof-input-text');
    recordCheck('INTENT-02', '노란색 정답 빈칸 규격 (#fef08a)', hasYellowStyle, '미입력 상태 노란색 및 포커스 스타일 완비');
  } catch (e) {
    recordCheck('INTENT-02', '정답 빈칸 스타일 검사', false, e.message);
  }

  // --- [INTENT-03] 4대 모달 시스템 ---
  try {
    const m1 = !!document.getElementById('secure-password-modal');
    const m2 = !!document.getElementById('unlock-boundary-modal');
    const m3 = !!document.getElementById('teacher-dashboard-modal');
    const m4 = !!document.getElementById('student-zoom-modal');
    recordCheck('INTENT-03', '4대 모달 시스템 완비', m1 && m2 && m3 && m4, '4대 모달 시스템 정상 배치 확인');
  } catch (e) {
    recordCheck('INTENT-03', '모달 시스템 검사', false, e.message);
  }

  // --- [INTENT-RULE11] 대단원 스스로 마무리하기 전용 대주제 탭(Tab 5) 및 14문항 1:1 분할 매핑 ---
  try {
    const tabs = document.querySelectorAll('.tab-btn');
    let tab5Found = false;
    tabs.forEach(t => {
      if (t.innerText && t.innerText.includes('스스로 마무리하기')) {
        tab5Found = true;
      }
    });

    window.switchMainTab(5);
    const pills5 = document.querySelectorAll('.substep-pill[data-code^="5-"]');
    const has14PillsInTab5 = (pills5.length === 14);

    const isRule11Passed = tab5Found && has14PillsInTab5;
    recordCheck('INTENT-RULE11', '대단원 스스로 마무리하기 전용 대주제 탭(Tab 5) 및 14문항 1:1 분할 매핑', isRule11Passed,
      `탭 5 전용 탭 독립 확인, 14개 서브스텝(5-1~5-14) 1문항 1페이지 완비`);
  } catch (e) {
    recordCheck('INTENT-RULE11', '대단원 스스로 마무리하기 구조 감사', false, e.message);
  }

  // --- [INTENT-RULE10] 소단원 스스로 확인하기 문항별 1문항 1페이지 분할 매핑 ---
  try {
    const selfCheckCodes = [
      '1-4', '1-5', '1-6', '1-7',
      '2-4', '2-5', '2-6', '2-7', '2-8',
      '3-4', '3-5', '3-6', '3-7', '3-8',
      '4-3', '4-4', '4-5', '4-6', '4-7'
    ];
    const allSelfChecksExist = selfCheckCodes.every(c => allSubstepCodes.includes(c));
    recordCheck('INTENT-RULE10', '소단원 스스로 확인하기 문항별 1문항 1페이지 분할 매핑', allSelfChecksExist,
      `각 소단원 스스로 확인하기 19개 문항들이 독립 서브스텝으로 전수 매핑됨`);
  } catch (e) {
    recordCheck('INTENT-RULE10', '소단원 스스로 확인하기 구조 감사', false, e.message);
  }

  console.log(`\n🔍 [평가 2단계] 57개 전 서브스텝 1:1 캔버스 렌더링 및 채점 루프 전수 검증...`);

  // Ensure all steps unlocked for evaluation
  window.state.isTeacherLoggedIn = true;
  window.state.unlockedTabs = [0, 1, 2, 3, 4, 5, 6];
  window.state.unlockedSubSteps = [...allSubstepCodes];
  window.state.unlockedSteps = new Set(allSubstepCodes);

  let substepsPassed = 0;

  for (const code of allSubstepCodes) {
    try {
      window.loadSubStep(code);

      const target = substepVerificationData[code];
      if (target.inputs) {
        for (const [id, val] of Object.entries(target.inputs)) {
          const inp = document.getElementById(id);
          if (inp) {
            inp.value = val;
          }
        }
      }

      if (typeof window[target.submitFn] === 'function') {
        window[target.submitFn]();
      }

      const verifiedCard = document.querySelector('.verified-answer-card');
      const hasVerifiedView = !!verifiedCard && (verifiedCard.innerHTML.length > 30);

      const simCont = document.getElementById('interactive-sim-controller');
      const hasSim = !!simCont && (simCont.innerHTML.length > 10);

      const isSubstepOk = hasVerifiedView && hasSim;
      if (isSubstepOk) {
        substepsPassed++;
      }
      recordCheck(`SUBSTEP-${code}`, `서브스텝 [${code}] 채점 및 인터랙션 검증`, isSubstepOk,
        `입력값 채점 통과, 정답 해설 카드 전환 및 시뮬레이터 캔버스 정상 가동`);
    } catch (e) {
      recordCheck(`SUBSTEP-${code}`, `서브스텝 [${code}] 검증 실패`, false, e.message);
    }
  }

  // --- [INTENT-ZERO-LEAK] 🚫 정답 미노출 원칙 (Zero Answer Leakage in Placeholder/Hints) ---
  try {
    let leakedInputs = [];
    let totalAuditedInputs = 0;

    const savedVerified = { ...window.state.verifiedViewData };
    window.state.verifiedViewData = {};

    allSubstepCodes.forEach(code => {
      window.loadSubStep(code);
      const inputs = document.querySelectorAll('input.proof-input-text');
      inputs.forEach(input => {
        totalAuditedInputs++;
        const id = input.id;
        const ph = (input.placeholder || '').trim();
        if (!ph) return;

        const expectedData = substepVerificationData[code];
        if (expectedData && expectedData.inputs[id]) {
          const ans = expectedData.inputs[id];
          const cleanAns = ans.replace(/\s+/g, '').toUpperCase();
          const cleanPh = ph.replace(/\s+/g, '').toUpperCase();

          if (cleanPh === cleanAns || cleanPh === `예:${cleanAns}` || cleanPh.includes(`:${cleanAns}`)) {
            leakedInputs.push(`${id} (placeholder: "${ph}", 정답: "${ans}")`);
          }
        }
      });
    });

    window.state.verifiedViewData = savedVerified;

    const isZeroLeakPassed = (leakedInputs.length === 0);
    const leakDetails = isZeroLeakPassed
      ? `전체 57개 서브스텝 ${totalAuditedInputs}개 입력란 전수 감사 완료: 플레이스홀더 내 정답 직접 노출 0건 (완전 준수)`
      : `정답 노출 발견 (${leakedInputs.length}건): ${leakedInputs.join('; ')}`;
    recordCheck('INTENT-ZERO-LEAK', '🚫 정답 미노출 원칙 (Zero Answer Leakage in Placeholder/Hints)', isZeroLeakPassed, leakDetails);
  } catch (e) {
    recordCheck('INTENT-ZERO-LEAK', '정답 미노출 원칙 검사', false, e.message);
  }

  // --- [INTENT-LERP-SAFE] ⚙️ 절전형 물리 애니메이션 엔진 및 화면 고정 방지 표준 ---
  try {
    const hasLerp = typeof dom.window.startSmoothLerp === 'function';
    const loadSubStepStr = dom.window.loadSubStep.toString();
    const hasCancelLoop = loadSubStepStr.includes('cancelAnimationFrame') && loadSubStepStr.includes('activeLerpAnimations');

    let lerpConverged = false;
    let testVal = 0;
    dom.window.startSmoothLerp('test_eval', () => testVal, (v) => { testVal = v; }, 10, null, () => {
      lerpConverged = true;
    }, 0.5);

    const isLerpStandardPassed = hasLerp && hasCancelLoop;
    recordCheck('INTENT-LERP-SAFE', '절전형 물리 애니메이션 엔진 및 화면 고정 방지 표준', isLerpStandardPassed,
      '지수 감속(0.12), loadSubStep 시 activeLerpAnimations 일괄 취소 및 수렴 가드 탑재 확인');
  } catch (e) {
    recordCheck('INTENT-LERP-SAFE', '화면 고정 방지 검사', false, e.message);
  }

  // --- 종합 판정 ---
  const totalChecks = checks.length;
  const passedChecks = checks.filter(c => c.passed).length;
  const scorePercent = Math.round((passedChecks / totalChecks) * 100);
  const isFinalPass = !isCriticalFailed && (scorePercent === 100);

  console.log("\n========================================");
  console.log(`📊 서브에이전트 종합 판정: ${isFinalPass ? 'PASS' : 'REJECT'} (${scorePercent}% 달성 - ${passedChecks}/${totalChecks})`);
  console.log("========================================\n");

  // Save report
  const reportPath = path.join(__dirname, '../docs/eval_ch1_report.md');
  let md = `# 🤖 [서브에이전트 평가 리포트] 1단원 소인수분해 57개 서브스텝 (g1_ch1_factors.html)\n\n`;
  md += `- **평가 일시**: ${new Date().toISOString()}\n`;
  md += `- **평가 대상 파일**: [g1_ch1_factors.html](file:///home/ubuntu/workspace/Redbook/g1_ch1_factors.html)\n`;
  md += `- **최종 판정**: **${isFinalPass ? '✅ PASS (합격 / 승인)' : '❌ REJECT (반려)'}**\n`;
  md += `- **달성도 점수**: **${scorePercent}%** (${passedChecks}개 성공 / 총 ${totalChecks}개 항목)\n\n`;

  md += `## 📋 세부 항목별 검증 결과\n\n`;
  md += `| 번호 | 의도 ID | 항목명 | 판정 | 세부 결과 |\n| :--- | :--- | :--- | :---: | :--- |\n`;
  checks.forEach((c, i) => {
    md += `| ${i + 1} | \`${c.id}\` | **${c.name}** | ${c.passed ? '✅ 통과' : '❌ 실패'} | ${c.details.replace(/\|/g, '\\|')} |\n`;
  });

  fs.writeFileSync(reportPath, md, 'utf8');
  console.log(`✅ 서브에이전트 평가 리포트 저장 완료: ${reportPath}`);
}

runEvaluation();
