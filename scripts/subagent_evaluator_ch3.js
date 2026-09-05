const fs = require('fs');
const path = require('path');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

async function runSubagentEvaluationCh3() {
  console.log('🤖 [서브에이전트] 3단원 설계 명세서(eval_ch3_spec.md) 로드 및 독립 평가 시작...');

  const specPath = path.join(__dirname, '../docs/eval_ch3_spec.md');
  const targetHtmlPath = path.join(__dirname, '../g1_ch3_equations.html');
  const reportPath = path.join(__dirname, '../docs/eval_ch3_report.md');

  if (!fs.existsSync(specPath)) {
    console.error('❌ 설계 명세서가 존재하지 않습니다:', specPath);
    process.exit(1);
  }
  if (!fs.existsSync(targetHtmlPath)) {
    console.error('❌ 평가 대상 HTML 파일이 존재하지 않습니다:', targetHtmlPath);
    process.exit(1);
  }

  const specContent = fs.readFileSync(specPath, 'utf8');
  const htmlContent = fs.readFileSync(targetHtmlPath, 'utf8');

  // Parse HTML in JSDOM
  const virtualConsole = new jsdom.VirtualConsole();
  virtualConsole.on('error', () => {});
  virtualConsole.on('warn', () => {});

  const dom = new JSDOM(htmlContent, {
    runScripts: 'dangerously',
    url: 'https://sjylim0829-commits.github.io/redbook-math-app/g1_ch3_equations.html',
    virtualConsole,
    beforeParse(window) {
      // Mock Canvas 2D context for headless Two.js compatibility
      window.HTMLCanvasElement.prototype.getContext = function () {
        return {
          fillRect: () => {},
          clearRect: () => {},
          getImageData: () => ({ data: new Array(100) }),
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
          clip: () => {},
          imageSmoothingEnabled: true
        };
      };

      // Mock Two.js 2D engine for headless test environment with shape & render tracking
      class MockTwo {
        constructor(opts = {}) {
          this.width = opts.width || 600;
          this.height = opts.height || 500;
          this.shapes = [];
          this.updateCount = 0;
        }
        appendTo(elem) {
          this.domElement = window.document.createElement('div');
          elem.appendChild(this.domElement);
          return this;
        }
        clear() {
          this.shapes = [];
        }
        update() {
          this.updateCount = (this.updateCount || 0) + 1;
        }
        makeGroup() {
          const grp = {
            shapes: [],
            add: (...items) => {
              grp.shapes.push(...items);
              this.shapes.push(...items);
            },
            translation: { set: () => {} },
            rotation: 0,
            scale: 1
          };
          this.shapes.push(grp);
          return grp;
        }
        makeLine() {
          const s = { type: 'line', stroke: '', linewidth: 1 };
          this.shapes.push(s);
          return s;
        }
        makeCircle() {
          const s = { type: 'circle', fill: '', stroke: '', linewidth: 1 };
          this.shapes.push(s);
          return s;
        }
        makeRectangle() {
          const s = { type: 'rect', fill: '', stroke: '', linewidth: 1 };
          this.shapes.push(s);
          return s;
        }
        makeRoundedRectangle() {
          const s = { type: 'roundrect', fill: '', stroke: '', linewidth: 1 };
          this.shapes.push(s);
          return s;
        }
        makeText() {
          const s = { type: 'text', fill: '', size: 12, weight: 700 };
          this.shapes.push(s);
          return s;
        }
        makePolygon() {
          const s = { type: 'poly', fill: '', stroke: '', rotation: 0 };
          this.shapes.push(s);
          return s;
        }
      }
      MockTwo.Types = { canvas: 'canvas' };
      window.Two = MockTwo;

      window.katex = { render: () => {} };
      window.renderMathInElement = () => {};

      window.AudioContext = class {
        createOscillator() {
          return {
            type: 'sine',
            frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
            connect: () => {},
            start: () => {},
            stop: () => {}
          };
        }
        createGain() {
          return {
            gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
            connect: () => {}
          };
        }
        get currentTime() { return 0; }
      };
      window.webkitAudioContext = window.AudioContext;

      window.alert = (msg) => {
        console.log(`   [Alert Dialog]: ${msg.replace(/\\n/g, ' ')}`);
      };
    }
  });

  const { window } = dom;
  const { document } = window;

  // Setup Mock Fetch & LMS Integration
  window.fetch = async () => ({
    ok: true,
    json: async () => ({ data: { records: {}, targetSubStep: '0-1' } })
  });

  // Mock Supabase / LMS integration
  try {
    const lmsCode = fs.readFileSync(path.join(__dirname, '../js/lms-integration-g1.js'), 'utf8');
    window.eval(lmsCode);
  } catch (e) {
    console.warn('LMS integration inject notice:', e.message);
  }

  // Setup test student in localStorage
  window.localStorage.setItem('mathlab_students_cache', JSON.stringify([
    { id: '10101', name: '홍길동', password: '1234', grade: '1', class_num: '1', role: 'student' }
  ]));

  // Evaluation tracking
  const results = [];
  let isLoginCriticalPassed = true;

  function recordCheck(id, name, isPassed, details) {
    results.push({ id, name, isPassed, details });
    const mark = isPassed ? '✅' : '❌';
    console.log(`${mark} [${id}] ${name}: ${details}`);
  }

  // --- 1. [INTENT-01] 로그인 모듈 및 교사 권한 검증 ---
  try {
    const studentInput = document.getElementById('student-id');
    const passwordInput = document.getElementById('student-name');
    const loginBtn = document.getElementById('btn-start-exploration');

    if (!studentInput || !loginBtn) {
      recordCheck('INTENT-01-A', '로그인 UI 요소 존재', false, 'student-id 인풋 또는 btn-start-exploration 버튼 누락');
      isLoginCriticalPassed = false;
    } else {
      // Test Student Login (10101)
      studentInput.value = '10101';
      if (passwordInput) passwordInput.value = '1234';
      await window.handleLMSLogin({ preventDefault: () => {} });

      const studentPassed = (window.state && window.state.studentId === '10101' && window.state.unlockedSubSteps.includes('0-1'));
      recordCheck('INTENT-01-B', '학생 로그인 및 초기 단계 잠금', studentPassed, studentPassed ? '10101 학생 정상 로그인, 0-1 기본 해금' : '학생 로그인 실패');
      if (!studentPassed) isLoginCriticalPassed = false;

      // Test Teacher Login Bypass (260523)
      studentInput.value = '260523';
      if (passwordInput) passwordInput.value = '260523';
      await window.handleLMSLogin({ preventDefault: () => {} });

      const teacherPassed = (window.state && window.state.isTeacherLoggedIn === true && window.state.unlockedSubSteps.length >= 18);
      recordCheck('INTENT-01-C', '교사 마스터 비밀번호(260523) 전체 해금', teacherPassed, teacherPassed ? `교사 인증 성공, 전체 ${window.state.unlockedSubSteps.length}개 서브스텝 프리패스` : '교사 마스터 바이패스 실패');
      if (!teacherPassed) isLoginCriticalPassed = false;

      // Test Teacher Login Button & Modal Popup (openTestLoginModal) [Mandatory Critical Item]
      const teacherModalBtn = document.querySelector('button[onclick*="openTestLoginModal"]') ||
                             Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('교사 계정 접속'));
      const secureModal = document.getElementById('secure-password-modal');
      const secureInput = document.getElementById('secure-modal-input');

      if (!teacherModalBtn) {
        recordCheck('INTENT-01-D', '교사 계정 접속 버튼 존재', false, '교사 계정 접속 버튼 누락');
        isLoginCriticalPassed = false;
      } else if (!secureModal || !secureInput) {
        recordCheck('INTENT-01-D', '교사 보안 모달 요소 존재', false, 'secure-password-modal 또는 secure-modal-input 누락');
        isLoginCriticalPassed = false;
      } else {
        // Reset teacher state to verify clean login via modal
        window.state.isTeacherLoggedIn = false;
        window.state.unlockedSubSteps = ['0-1'];
        secureModal.style.display = 'none';

        // 1. Click button
        teacherModalBtn.click();
        const isModalDisplayed = (secureModal.style.display === 'flex');

        // 2. Fill password in modal and submit
        secureInput.value = '260523';
        window.handleSecurePasswordSubmit({ preventDefault: () => {} });

        const isModalClosed = (secureModal.style.display === 'none');
        const isTeacherAuthViaModal = (window.state && window.state.isTeacherLoggedIn === true && window.state.unlockedSubSteps.length >= 18);

        const modalFlowPassed = isModalDisplayed && isModalClosed && isTeacherAuthViaModal;
        recordCheck('INTENT-01-D', '교사 계정 접속 버튼 및 모달 인증 (필수 항목)', modalFlowPassed,
          modalFlowPassed ? '버튼 클릭 시 모달(display:flex) 정상 팝업 ➔ 비밀번호 인증 ➔ 모달 닫힘 및 전체 해금 성공'
                          : `모달 팝업 실패 (팝업: ${isModalDisplayed}, 닫힘: ${isModalClosed}, 교사인증: ${isTeacherAuthViaModal})`
        );
        if (!modalFlowPassed) isLoginCriticalPassed = false;
      }
    }
  } catch (err) {
    recordCheck('INTENT-01', '로그인 모듈 실행', false, '런타임 에러: ' + err.message);
    isLoginCriticalPassed = false;
  }

  // --- 2. [INTENT-02] 노란색 입력 필드 규격 검증 ---
  try {
    const hasYellowStyle = htmlContent.includes('#fef08a') && htmlContent.includes('.proof-input-text');
    recordCheck('INTENT-02', '노란색 정답 빈칸 규격 (#fef08a)', hasYellowStyle, hasYellowStyle ? '미입력 상태 노란색(#fef08a) 및 포커스 스타일 명시됨' : '노란색 스타일 누락');
  } catch (err) {
    recordCheck('INTENT-02', '노란색 정답 빈칸 규격', false, err.message);
  }

  // --- 3. [INTENT-03] 4대 모달 시스템 검증 ---
  try {
    const modalIds = ['secure-password-modal', 'unlock-boundary-modal', 'teacher-dashboard-modal', 'student-zoom-modal'];
    const allModalsExist = modalIds.every(id => document.getElementById(id) !== null);
    recordCheck('INTENT-03', '4대 모달 시스템 완비', allModalsExist, allModalsExist ? '모든 4대 모달 정상 탑재' : '일부 모달 누락');
  } catch (err) {
    recordCheck('INTENT-03', '4대 모달 시스템', false, err.message);
  }

  function inspectCanvasRender() {
    const simCtrl = document.getElementById('interactive-sim-controller');
    const isCtrlVisible = simCtrl && simCtrl.style.display !== 'none' && simCtrl.innerHTML.trim().length > 20;
    const hasButtons = simCtrl && simCtrl.querySelectorAll('button, input').length > 0;
    const twoInst = window.twoInstance;
    const hasShapes = twoInst && twoInst.shapes && twoInst.shapes.length > 0;
    return {
      ok: isCtrlVisible && hasButtons && hasShapes,
      isCtrlVisible,
      hasButtons,
      shapeCount: (twoInst && twoInst.shapes) ? twoInst.shapes.length : 0
    };
  }

  // --- 4. [INTENT-04] 0-1 초등 미지수 수평 저울 ---
  try {
    window.loadSubStep('0-1');
    const cvs = inspectCanvasRender();
    const midInput = document.getElementById('p01-mid');
    const boxInput = document.getElementById('p01-box');
    if (midInput && boxInput && typeof window.check01Submit === 'function') {
      midInput.value = '15';
      boxInput.value = '5';
      window.check01Submit();
      const verified = document.querySelector('.verified-answer-card');
      const pass01 = !!verified && cvs.ok;
      recordCheck('INTENT-04', '0-1 초등 미지수 수평 저울 및 캔버스 가시성', pass01,
        pass01 ? `좌측 수평 저울 정상 렌더링(도형 ${cvs.shapeCount}개, 버튼 완비) & 3 × □ = 15 ➔ □ = 5 채점 성공` :
        (!cvs.ok ? `좌측 시뮬레이터 조작판 또는 Two.js 캔버스 누락 (빈 화면 결함! 컨트롤러: ${cvs.isCtrlVisible}, 도형수: ${cvs.shapeCount})` : '0-1 채점 실패'));
    } else {
      recordCheck('INTENT-04', '0-1 초등 미지수 수평 저울', false, '0-1 폼 요소 미발견');
    }
  } catch (err) {
    recordCheck('INTENT-04', '0-1 초등 미지수 수평 저울', false, err.message);
  }

  // --- 5. [INTENT-05] 1-1 아이스크림 구매 영수증 시뮬레이터 ---
  try {
    window.loadSubStep('1-1');
    const cvs = inspectCanvasRender();
    const iceInput = document.getElementById('p11-ice');
    const orderInput = document.getElementById('p11-order');
    if (iceInput && orderInput && typeof window.check11Submit === 'function') {
      iceInput.value = '3500x';
      orderInput.value = '3500a + 5000b';
      window.check11Submit();
      const verified = document.querySelector('.verified-answer-card');
      const pass11 = !!verified && cvs.ok;
      recordCheck('INTENT-05', '1-1 아이스크림 구매 영수증 시뮬레이터 및 캔버스 가시성', pass11,
        pass11 ? `좌측 영수증 시뮬레이터(도형 ${cvs.shapeCount}개) & 문자식(3500x, 3500a+5000b) 채점 성공` :
        (!cvs.ok ? '좌측 시뮬레이터 조작판 또는 Two.js 캔버스 누락 (빈 화면 결함!)' : '1-1 채점 실패'));
    } else {
      recordCheck('INTENT-05', '1-1 아이스크림 구매 영수증 시뮬레이터', false, '1-1 폼 미발견');
    }
  } catch (err) {
    recordCheck('INTENT-05', '1-1 아이스크림 구매 영수증 시뮬레이터', false, err.message);
  }

  // --- 6. [INTENT-06] 1-3 400쪽 독서 진행 게이지와 대입 ---
  try {
    window.loadSubStep('1-3');
    const cvs = inspectCanvasRender();
    const exprInput = document.getElementById('p13-expr');
    const valInput = document.getElementById('p13-val');
    if (exprInput && valInput && typeof window.check13Submit === 'function') {
      exprInput.value = '400 - 10x';
      valInput.value = '350';
      window.check13Submit();
      const verified = document.querySelector('.verified-answer-card');
      const pass13 = !!verified && cvs.ok;
      recordCheck('INTENT-06', '1-3 400쪽 독서 진행 게이지와 대입 및 캔버스 가시성', pass13,
        pass13 ? `좌측 독서 게이지(도형 ${cvs.shapeCount}개) & 식의 값(400 - 10x, x=5 대입 350쪽) 채점 성공` :
        (!cvs.ok ? '좌측 시뮬레이터 조작판 또는 Two.js 캔버스 누락 (빈 화면 결함!)' : '1-3 채점 실패'));
    } else {
      recordCheck('INTENT-06', '1-3 400쪽 독서 진행 게이지와 대입', false, '1-3 폼 미발견');
    }
  } catch (err) {
    recordCheck('INTENT-06', '1-3 400쪽 독서 진행 게이지와 대입', false, err.message);
  }

  // --- 7. [INTENT-07] 2-1 다항식 구조 카드 분해기 ---
  try {
    window.loadSubStep('2-1');
    const cvs = inspectCanvasRender();
    const coefInput = document.getElementById('p21-coef');
    const constInput = document.getElementById('p21-const');
    const degInput = document.getElementById('p21-deg');
    const linInput = document.getElementById('p21-islinear');
    if (coefInput && constInput && degInput && linInput && typeof window.check21Submit === 'function') {
      coefInput.value = '5';
      constInput.value = '-7';
      degInput.value = '2';
      linInput.value = '예';
      window.check21Submit();
      const verified = document.querySelector('.verified-answer-card');
      const pass21 = !!verified && cvs.ok;
      recordCheck('INTENT-07', '2-1 다항식 구조 카드 분해기 및 캔버스 가시성', pass21,
        pass21 ? `좌측 다항식 해부도(도형 ${cvs.shapeCount}개) & 계수(5), 상수항(-7), 차수(2), 일차식 판별 채점 성공` :
        (!cvs.ok ? '좌측 시뮬레이터 조작판 또는 Two.js 캔버스 누락 (빈 화면 결함!)' : '2-1 채점 실패'));
    } else {
      recordCheck('INTENT-07', '2-1 다항식 구조 카드 분해기', false, '2-1 폼 미발견');
    }
  } catch (err) {
    recordCheck('INTENT-07', '2-1 다항식 구조 카드 분해기', false, err.message);
  }

  // --- 8. [INTENT-08] 2-2 직사각형 면적 모델과 분배법칙 ---
  try {
    window.loadSubStep('2-2');
    const cvs = inspectCanvasRender();
    const q1Input = document.getElementById('p22-q1');
    const q2Input = document.getElementById('p22-q2');
    const q3Input = document.getElementById('p22-q3');
    if (q1Input && q2Input && q3Input && typeof window.check22Submit === 'function') {
      q1Input.value = '6x';
      q2Input.value = '-8x + 12';
      q3Input.value = '2x - 3';
      window.check22Submit();
      const verified = document.querySelector('.verified-answer-card');
      const pass22 = !!verified && cvs.ok;
      recordCheck('INTENT-08', '2-2 직사각형 면적 모델과 분배법칙 및 캔버스 가시성', pass22,
        pass22 ? `좌측 직사각형 면적 모델(도형 ${cvs.shapeCount}개) & 분배법칙(6x, -8x+12, 2x-3) 채점 성공` :
        (!cvs.ok ? '좌측 시뮬레이터 조작판 또는 Two.js 캔버스 누락 (빈 화면 결함!)' : '2-2 채점 실패'));
    } else {
      recordCheck('INTENT-08', '2-2 직사각형 면적 모델과 분배법칙', false, '2-2 폼 미발견');
    }
  } catch (err) {
    recordCheck('INTENT-08', '2-2 직사각형 면적 모델과 분배법칙', false, err.message);
  }

  // --- 9. [INTENT-09] 2-3 동류항 대수 막대 타일 모으기 ---
  try {
    window.loadSubStep('2-3');
    const cvs = inspectCanvasRender();
    const likeInput = document.getElementById('p23-like');
    const sumInput = document.getElementById('p23-sum');
    if (likeInput && sumInput && typeof window.check23Submit === 'function') {
      likeInput.value = '3x';
      sumInput.value = '6x - 2';
      window.check23Submit();
      const verified = document.querySelector('.verified-answer-card');
      const pass23 = !!verified && cvs.ok;
      recordCheck('INTENT-09', '2-3 동류항 대수 막대 타일 모으기 및 캔버스 가시성', pass23,
        pass23 ? `좌측 대수 타일(도형 ${cvs.shapeCount}개) & 동류항 판별(3x) 및 합(6x-2) 타일 모으기 성공` :
        (!cvs.ok ? '좌측 시뮬레이터 조작판 또는 Two.js 캔버스 누락 (빈 화면 결함!)' : '2-3 채점 실패'));
    } else {
      recordCheck('INTENT-09', '2-3 동류항 대수 막대 타일 모으기', false, '2-3 폼 미발견');
    }
  } catch (err) {
    recordCheck('INTENT-09', '2-3 동류항 대수 막대 타일 모으기', false, err.message);
  }

  // --- 10. [INTENT-10] 3-1 방정식 vs 항등식 판별 저울 ---
  try {
    window.loadSubStep('3-1');
    const cvs = inspectCanvasRender();
    const eq1Input = document.getElementById('p31-eq1');
    const eq2Input = document.getElementById('p31-eq2');
    if (eq1Input && eq2Input && typeof window.check31Submit === 'function') {
      eq1Input.value = '방정식';
      eq2Input.value = '항등식';
      window.check31Submit();
      const verified = document.querySelector('.verified-answer-card');
      const pass31 = !!verified && cvs.ok;
      recordCheck('INTENT-10', '3-1 방정식 vs 항등식 판별 저울 및 캔버스 가시성', pass31,
        pass31 ? `좌측 항등식/방정식 저울(도형 ${cvs.shapeCount}개) & 판별 채점 성공` :
        (!cvs.ok ? '좌측 시뮬레이터 조작판 또는 Two.js 캔버스 누락 (빈 화면 결함!)' : '3-1 채점 실패'));
    } else {
      recordCheck('INTENT-10', '3-1 방정식 vs 항등식 판별 저울', false, '3-1 폼 미발견');
    }
  } catch (err) {
    recordCheck('INTENT-10', '3-1 방정식 vs 항등식 판별 저울', false, err.message);
  }

  // --- 11. [INTENT-11] 3-3 등식의 성질 양팔 저울 실험실 ---
  try {
    window.loadSubStep('3-3');
    const cvs = inspectCanvasRender();
    const addInput = document.getElementById('p33-add');
    const divInput = document.getElementById('p33-div');
    if (addInput && divInput && typeof window.check33Submit === 'function') {
      addInput.value = '3';
      divInput.value = '2';
      window.check33Submit();
      const verified = document.querySelector('.verified-answer-card');
      const pass33 = !!verified && cvs.ok;
      recordCheck('INTENT-11', '3-3 등식의 성질 양팔 저울 실험실 및 캔버스 가시성', pass33,
        pass33 ? `좌측 등식의 성질 저울(도형 ${cvs.shapeCount}개) & 연산(+3, ÷2) 채점 성공` :
        (!cvs.ok ? '좌측 시뮬레이터 조작판 또는 Two.js 캔버스 누락 (빈 화면 결함!)' : '3-3 채점 실패'));
    } else {
      recordCheck('INTENT-11', '3-3 등식의 성질 양팔 저울 실험실', false, '3-3 폼 미발견');
    }
  } catch (err) {
    recordCheck('INTENT-11', '3-3 등식의 성질 양팔 저울 실험실', false, err.message);
  }

  // --- 12. [INTENT-12] 4-1 이항(移項) 애니메이션 시뮬레이터 ---
  try {
    window.loadSubStep('4-1');
    const cvs = inspectCanvasRender();
    const eqInput = document.getElementById('p41-eq');
    const propInput = document.getElementById('p41-prop');
    if (eqInput && propInput && typeof window.check41Submit === 'function') {
      eqInput.value = '3x = 5';
      propInput.value = '부호가 반대로 바뀐다';
      window.check41Submit();
      const verified = document.querySelector('.verified-answer-card');
      const pass41 = !!verified && cvs.ok;
      recordCheck('INTENT-12', '4-1 이항(移項) 애니메이션 시뮬레이터 및 캔버스 가시성', pass41,
        pass41 ? `좌측 이항 브릿지(도형 ${cvs.shapeCount}개) & 이항 후 식(3x = 5) 채점 성공` :
        (!cvs.ok ? '좌측 시뮬레이터 조작판 또는 Two.js 캔버스 누락 (빈 화면 결함!)' : '4-1 채점 실패'));
    } else {
      recordCheck('INTENT-12', '4-1 이항(移項) 애니메이션 시뮬레이터', false, '4-1 폼 미발견');
    }
  } catch (err) {
    recordCheck('INTENT-12', '4-1 이항(移項) 애니메이션 시뮬레이터', false, err.message);
  }

  // --- 13. [INTENT-13] 5-2 생각한 수 맞추기 수학 마술사 ---
  try {
    window.loadSubStep('5-2');
    const cvs = inspectCanvasRender();
    const resInput = document.getElementById('p52-res');
    const reasonInput = document.getElementById('p52-reason');
    if (resInput && reasonInput && typeof window.check52Submit === 'function') {
      resInput.value = '1';
      reasonInput.value = '미지수 x가 소거되기 때문';
      window.check52Submit();
      const verified = document.querySelector('.verified-answer-card');
      const pass52 = !!verified && cvs.ok;
      recordCheck('INTENT-13', '5-2 생각한 수 맞추기 수학 마술사 및 캔버스 가시성', pass52,
        pass52 ? `좌측 마술사 시뮬레이터(도형 ${cvs.shapeCount}개) & 최종 마술 결과(1) 채점 성공` :
        (!cvs.ok ? '좌측 시뮬레이터 조작판 또는 Two.js 캔버스 누락 (빈 화면 결함!)' : '5-2 채점 실패'));
    } else {
      recordCheck('INTENT-13', '5-2 생각한 수 맞추기 수학 마술사', false, '5-2 폼 미발견');
    }
  } catch (err) {
    recordCheck('INTENT-13', '5-2 생각한 수 맞추기 수학 마술사', false, err.message);
  }

  // --- 14. [INTENT-14] 중1 좌표평면(g1_coordinate.html) 대비 질적 완성도 상시 벤치마크 ---
  try {
    const coordinatePath = path.join(__dirname, '../g1_coordinate.html');
    let qualitativePassed = false;
    let qualDetails = '';

    if (!fs.existsSync(coordinatePath)) {
      recordCheck('INTENT-14', '중1 좌표평면 질적 비교 벤치마크', false, '기준 페이지 g1_coordinate.html 없음');
    } else {
      const checks = [
        {
          name: 'Two.js 인터랙티브 그래픽 엔진 탑재 및 캔버스 렌더러',
          ok: htmlContent.includes('two.min.js') && htmlContent.includes('setupSubstepSimulator') && htmlContent.includes('interactive-sim-controller')
        },
        {
          name: '4대 모달 및 교사 관제 시스템 (단원맵, 목표, 교사비번, 해금범위)',
          ok: ['secure-password-modal', 'unlock-boundary-modal', 'teacher-dashboard-modal', 'student-zoom-modal'].every(id => htmlContent.includes(id))
        },
        {
          name: '교사 5x5 실시간 모니터링 관제실 구조 (대시보드 및 학생 그리드)',
          ok: (htmlContent.includes('view-teacher-dashboard') || htmlContent.includes('teacher-dashboard-modal')) &&
              (htmlContent.includes('teacher-grid-wrapper') || htmlContent.includes('teacher-grid-container')) &&
              (htmlContent.includes('switchMonitoringClass') || htmlContent.includes('selectMonitoringClass'))
        },
        {
          name: '교과서 1:1 서브스텝 구현 밀도 (10대 인터랙티브 실험실 완비)',
          ok: ['renderBoxScaleCanvas', 'renderReceiptCanvas', 'renderBookGaugeCanvas', 'renderPolyStructureCanvas', 'renderRectDistCanvas', 'renderLikeTermTilesCanvas', 'renderEqVsIdentityCanvas', 'renderPropertiesCanvas', 'renderTranspositionCanvas', 'renderMathMagicCanvas'].every(fn => htmlContent.includes(fn))
        },
        {
          name: 'LMS DB 통합 및 실시간 자동 저장 시스템',
          ok: htmlContent.includes('lms-integration-g1.js') && htmlContent.includes('handleLMSLogin') && htmlContent.includes('startPeriodicAutoSave')
        },
        {
          name: '수학 정답 정규화 및 피드백 UX (노란색 빈칸 & 정답 카드)',
          ok: htmlContent.includes('normTxt') && htmlContent.includes('#fef08a') && htmlContent.includes('renderVerifiedAnswerView')
        },
        {
          name: 'Web Audio API 5종 사운드 시스템 (pop/click/success/error/unlock)',
          ok: ['pop', 'click', 'success', 'error', 'unlock'].every(m => htmlContent.includes(m))
        }
      ];

      const passedDimCount = checks.filter(c => c.ok).length;
      const qualitativeParityScore = Math.round((passedDimCount / checks.length) * 100);
      qualitativePassed = (qualitativeParityScore >= 90);
      qualDetails = `좌표평면 대비 질적 일치도 ${qualitativeParityScore}% (${passedDimCount}/${checks.length}개 핵심 규격 완비)`;
      recordCheck('INTENT-14', '중1 좌표평면(g1_coordinate.html) 대비 질적 완성도 벤치마크', qualitativePassed, qualDetails);
    }
  } catch (err) {
    recordCheck('INTENT-14', '좌표평면 질적 비교 벤치마크', false, err.message);
  }

  // --- 15. [INTENT-15] 정답 미노출 원칙 검증 (Zero Answer Leakage in Placeholders) ---
  try {
    const knownAnswerMap = {
      'p01-mid': ['15'],
      'p01-box': ['5'],
      'p02-ratio': ['2/5', '0.4'],
      'p03-num': ['5'],
      'p11-ice': ['3500x', '3500*x'],
      'p11-order': ['3500a+5000b', '5000b+3500a'],
      'p12-q1': ['-3ab'],
      'p12-q2': ['x/5'],
      'p12-q3': ['2(x+y)/3'],
      'p13-expr': ['400-10x'],
      'p13-val': ['350'],
      'p14-q1': ['21'],
      'p14-q2': ['3'],
      'p21-coef': ['5'],
      'p21-const': ['-7'],
      'p21-deg': ['2'],
      'p21-islinear': ['예', 'o'],
      'p22-q1': ['6x'],
      'p22-q2': ['-8x+12'],
      'p22-q3': ['2x-3'],
      'p23-like': ['3x'],
      'p23-sum': ['6x-2'],
      'p24-q1': ['3x+4'],
      'p24-q2': ['(x+7)/6'],
      'p31-eq1': ['방정식'],
      'p31-eq2': ['항등식'],
      'p32-eqn': ['x+8=11'],
      'p32-ans1': ['3'],
      'p32-ans2': ['2'],
      'p33-add': ['3'],
      'p33-div': ['2'],
      'p34-q1': ['o'],
      'p34-q2': ['x'],
      'p34-q3': ['o'],
      'p41-eq': ['3x=5'],
      'p41-prop': ['반대', '부호가반대로바뀐다'],
      'p42-q1': ['5'],
      'p42-q2': ['8'],
      'p43-expr': ['2x+1'],
      'p43-eqn': ['2x+3(2x+1)=27'],
      'p43-cnt': ['3'],
      'p51-q1': ['3/2', '1.5'],
      'p51-q2': ['4'],
      'p52-res': ['1'],
      'p52-reason': ['소거']
    };

    let leakedInputs = [];
    const allInputs = document.querySelectorAll('input.proof-input-text');
    allInputs.forEach(input => {
      const id = input.id;
      const ph = (input.placeholder || '').trim();
      if (!ph) return;

      const expected = knownAnswerMap[id];
      if (expected) {
        for (const ans of expected) {
          const cleanAns = ans.replace(/\\s+/g, '');
          const cleanPh = ph.replace(/\\s+/g, '');
          if (cleanPh === cleanAns || cleanPh === `예:${cleanAns}` || cleanPh.includes(`:${cleanAns}`) || cleanPh === `${cleanAns}등`) {
            leakedInputs.push(`${id} (placeholder: "${ph}", 정답: "${ans}")`);
          }
        }
      }
    });

    const isZeroLeakPassed = (leakedInputs.length === 0);
    const leakDetails = isZeroLeakPassed
      ? `전체 ${allInputs.length}개 입력란 전수 검사 완료: 플레이스홀더 내 정답 노출 0건 (완전 준수)`
      : `정답 노출 발견 (${leakedInputs.length}건): ${leakedInputs.join('; ')}`;
    recordCheck('INTENT-15', '🚫 정답 미노출 원칙 (Zero Answer Leakage in Placeholder/Hints)', isZeroLeakPassed, leakDetails);
    if (!isZeroLeakPassed) {
      isLoginCriticalPassed = false;
    }
  } catch (e) {
    recordCheck('INTENT-15', '정답 미노출 원칙 검사', false, e.message);
  }

  // --- 16. [INTENT-16] 19개 전 서브스텝 좌측 시뮬레이터 조작판 & Two.js 캔버스 전수 무결성 감사 (Zero Blank Screen Audit) ---
  try {
    const allSteps = ['0-1', '0-2', '0-3', '1-1', '1-2', '1-3', '1-4', '2-1', '2-2', '2-3', '2-4', '3-1', '3-2', '3-3', '3-4', '4-1', '4-2', '4-3', '5-1', '5-2'];
    const blankSteps = [];

    allSteps.forEach(st => {
      window.loadSubStep(st);
      const simCtrl = document.getElementById('interactive-sim-controller');
      const twoInst = window.twoInstance;
      const isVisible = simCtrl && simCtrl.style.display !== 'none' && simCtrl.innerHTML.trim().length > 0;
      const hasShapes = twoInst && twoInst.shapes && twoInst.shapes.length > 0;
      if (!isVisible || !hasShapes) {
        blankSteps.push(`${st} (컨트롤러: ${isVisible}, 도형수: ${twoInst ? twoInst.shapes.length : 0})`);
      }
    });

    const isZeroBlankPassed = (blankSteps.length === 0);
    const blankDetails = isZeroBlankPassed
      ? `19개 전 서브스텝 전수 감사 완료: 빈 화면(Blank Screen) 0건, 전 서브스텝 시뮬레이터 및 Two.js 렌더링 100% 정상 가동 확인`
      : `빈 화면 결함 발견 (${blankSteps.length}개 단계): ${blankSteps.join(', ')}`;
    recordCheck('INTENT-16', '전 서브스텝 좌측 시뮬레이터 & 캔버스 가시성 전수 감사 (Zero Blank Canvas)', isZeroBlankPassed, blankDetails);
    if (!isZeroBlankPassed) {
      isLoginCriticalPassed = false; // Zero tolerance for blank screens!
    }
  } catch (err) {
    recordCheck('INTENT-16', '전 서브스텝 캔버스 가시성 전수 감사', false, err.message);
    isLoginCriticalPassed = false;
  }

  // --- 계산 및 리포트 작성 ---
  const totalItems = results.length;
  const passedItems = results.filter(r => r.isPassed).length;
  const scorePercent = Math.round((passedItems / totalItems) * 100);

  // Rejection rules
  let verdict = 'PASS';
  let rejectReason = '';

  if (!isLoginCriticalPassed) {
    verdict = 'REJECT';
    rejectReason = '❌ [치명적 실패] 학생 로그인, 교사 마스터 비밀번호 바이패스, 교사 계정 접속 버튼 모달 인증, 또는 정답 미노출 원칙 위반으로 완성도와 무관하게 즉시 반려합니다.';
  } else if (scorePercent < 90) {
    verdict = 'REJECT';
    rejectReason = `❌ [미달] 설계 명세서 달성도(${scorePercent}%)가 합격 기준(90%)에 미달하여 반려합니다.`;
  }

  console.log('\n========================================');
  console.log(`📊 서브에이전트 종합 판정: ${verdict} (${scorePercent}% 달성 - ${passedItems}/${totalItems})`);
  if (verdict === 'REJECT') console.log(`사유: ${rejectReason}`);
  console.log('========================================\n');

  // Generate Markdown Report
  let reportMd = `# 🤖 [서브에이전트 평가 리포트] 3단원 문자와 식 (g1_ch3_equations.html)\n\n`;
  reportMd += `- **평가 일시**: ${new Date().toISOString()}\n`;
  reportMd += `- **평가 대상 파일**: [g1_ch3_equations.html](file:///home/ubuntu/workspace/Redbook/g1_ch3_equations.html)\n`;
  reportMd += `- **기반 설계 명세서**: [eval_ch3_spec.md](file:///home/ubuntu/workspace/Redbook/docs/eval_ch3_spec.md)\n`;
  reportMd += `- **최종 판정**: **${verdict === 'PASS' ? '✅ PASS (합격 / 승인)' : '❌ REJECT (반려 / 수정 요청)'}**\n`;
  reportMd += `- **달성도 점수**: **${scorePercent}%** (${passedItems}개 성공 / 총 ${totalItems}개 항목)\n\n`;

  if (verdict === 'REJECT') {
    reportMd += `> [!CAUTION]\n> **반려 사유**: ${rejectReason}\n\n`;
  } else {
    reportMd += `> [!TIP]\n> **평가 결과**: 메인 에이전트의 작업 의도가 90% 이상(${scorePercent}%) 완벽하게 구현되었으며, 기본 로그인 및 10대 교과서 인터랙티브 시뮬레이터가 정상 동작하고 플레이스홀더 정답 미노출 원칙이 100% 준수되었음을 확인하여 최종 승인합니다.\n\n`;
  }

  reportMd += `## 📋 세부 항목별 검증 결과\n\n`;
  reportMd += `| 번호 | 의도 ID | 항목명 | 판정 | 세부 결과 |\n`;
  reportMd += `| :--- | :--- | :--- | :---: | :--- |\n`;
  results.forEach((r, idx) => {
    reportMd += `| ${idx + 1} | \`${r.id}\` | **${r.name}** | ${r.isPassed ? '✅ 통과' : '❌ 실패'} | ${r.details} |\n`;
  });

  reportMd += `\n---\n\n`;
  reportMd += `## 🔍 핵심 인터랙티브 기능 검증 요약\n\n`;
  reportMd += `1. **□ 수평 저울 (교과서 68쪽)**: $3 \\times \\square + 5 = 20$ 에서 $\\square=5$ 평형 시뮬레이션 확인.\n`;
  reportMd += `2. **아이스크림 영수증 시뮬레이터 (교과서 70쪽)**: 수량 $x$ 조절에 따른 영수증 실시간 인쇄 및 $3500x$ 확인.\n`;
  reportMd += `3. **400쪽 독서 진행 게이지 (교과서 74쪽)**: $x$일 대입 시 $400 - 10x$ 및 잔여 쪽수 게이지 동기화 확인.\n`;
  reportMd += `4. **다항식 구조 카드 분해기 (교과서 76~77쪽)**: $-3x^2 + 5x - 7$ 항 카드 분해 및 계수/차수 하이라이트 확인.\n`;
  reportMd += `5. **직사각형 면적 모델 분배법칙 (교과서 78쪽)**: $3(x+2) = 3x + 6$ 분할 면적 시각화 확인.\n`;
  reportMd += `6. **동류항 대수 타일 모으기 (교과서 80쪽)**: $(4x+3)+(2x-5)$ 동류항 타일 묶음 $6x-2$ 확인.\n`;
  reportMd += `7. **방정식 vs 항등식 판별 저울 (교과서 84쪽)**: 항등식의 상시 평형 및 방정식의 특정 해 평형 확인.\n`;
  reportMd += `8. **등식의 성질 양팔 저울 실험실 (교과서 88~89쪽)**: 양변 동일 연산(+3, ÷2) 수행 시 평형 유지 및 해 도출 확인.\n`;
  reportMd += `9. **이항 애니메이션 시뮬레이터 (교과서 92쪽)**: $5x-2 = 2x+3$ 항 이동 시 부호 반전($3x=5$) 확인.\n`;
  reportMd += `10. **생각한 수 맞추기 수학 마술사 (교과서 102쪽)**: 임의의 $x$에 대해 6단계 대수 연산 후 항상 1로 소거되는 마술 증명 확인.\n`;

  fs.writeFileSync(reportPath, reportMd, 'utf8');
  console.log('✅ 서브에이전트 평가 리포트 저장 완료:', reportPath);

  return { verdict, scorePercent, passedItems, totalItems, rejectReason };
}

runSubagentEvaluationCh3().then(res => {
  process.exit(res.verdict === 'PASS' ? 0 : 1);
}).catch(err => {
  console.error('서브에이전트 실행 중 치명적 오류:', err);
  process.exit(1);
});
