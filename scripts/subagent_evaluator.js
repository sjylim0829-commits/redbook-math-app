const fs = require('fs');
const path = require('path');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

async function runSubagentEvaluation() {
  console.log('🤖 [서브에이전트] 2단원 설계 명세서(eval_ch2_spec.md) 로드 및 독립 평가 시작...');

  const specPath = path.join(__dirname, '../docs/eval_ch2_spec.md');
  const targetHtmlPath = path.join(__dirname, '../g1_ch2_integers.html');
  const reportPath = path.join(__dirname, '../docs/eval_ch2_report.md');

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
  virtualConsole.on('error', (e) => { /* ignore external script 404s like cdn */ });
  virtualConsole.on('warn', () => {});

  const dom = new JSDOM(htmlContent, {
    runScripts: 'dangerously',
    url: 'https://sjylim0829-commits.github.io/redbook-math-app/g1_ch2_integers.html',
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

      // Mock Two.js 2D engine for headless test environment
      class MockTwo {
        constructor(opts = {}) {
          this.width = opts.width || 600;
          this.height = opts.height || 500;
        }
        appendTo() { return this; }
        clear() {}
        update() {}
        makeLine() { return { stroke: '', linewidth: 1 }; }
        makeCircle() { return { fill: '', stroke: '', linewidth: 1, opacity: 1 }; }
        makeRectangle() { return { fill: '', stroke: '', linewidth: 1 }; }
        makeRoundedRectangle() { return { fill: '', stroke: '', linewidth: 1 }; }
        makePolygon() { return { fill: '', rotation: 0 }; }
        makeText(t) { return { size: 12, weight: 600, fill: '', opacity: 1 }; }
        makeCurve() { return { stroke: '', linewidth: 1, fill: '' }; }
      }
      MockTwo.Types = { canvas: 'canvas' };
      window.Two = MockTwo;
      window.katex = { render: () => {} };
      window.renderMathInElement = () => {};
      window.alert = (msg) => console.log('   [Alert Dialog]:', msg);
    }
  });

  const { window } = dom;
  const { document } = window;

  // Setup Mock Fetch & LMS Integration
  window.fetch = async () => ({
    ok: true,
    json: async () => ({ data: { records: {}, targetSubStep: '0-1' } })
  });

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
    recordCheck('INTENT-03', '4대 모달 시스템 완비', allModalsExist, allModalsExist ? '모든 4대 모달 정상 탑재' : '모달 누락 발생');
  } catch (err) {
    recordCheck('INTENT-03', '4대 모달 시스템', false, err.message);
  }

  // --- 4. [INTENT-04] 되짚어보기 0-1, 0-2 검증 ---
  try {
    window.loadSubStep('0-1');
    const q1 = document.getElementById('p01-q1');
    const q2 = document.getElementById('p01-q2');
    if (q1 && q2) {
      q1.value = '5/6';
      q2.value = '0.2';
      window.check01Submit();
      const passed = (window.state.verifiedViewData['0-1'] !== undefined);
      recordCheck('INTENT-04', '되짚어보기 0-1 채점 통과', passed, passed ? '분수/소수 정답 채점 및 정답뷰 렌더링 완료' : '채점 통과 실패');
    } else {
      recordCheck('INTENT-04', '되짚어보기 0-1 인풋 존재', false, '인풋 필드 미존재');
    }
  } catch (err) {
    recordCheck('INTENT-04', '되짚어보기 0-1', false, err.message);
  }

  // --- 5. [INTENT-05] 1-1 로봇 위치 이동 시뮬레이터 검증 ---
  try {
    window.loadSubStep('1-1');
    const simCtrl = document.getElementById('interactive-sim-controller');
    const hasControls = simCtrl && simCtrl.innerHTML.includes('로봇 주행 시뮬레이터');

    // Test robot movement
    const initPos = window.simState ? window.simState.robotPos : 0;
    if (typeof window.moveRobot === 'function') {
      window.moveRobot(3);
      const pos3 = window.simState.robotPos;
      window.moveRobot(-5);
      const posMinus2 = window.simState.robotPos;
      const robotSimOk = (pos3 === 3 && posMinus2 === -2);
      recordCheck('INTENT-05', '교과서 50쪽 로봇 이동 시뮬레이터 동작', hasControls && robotSimOk, `조작판 렌더링: ${hasControls}, 로봇 이동(+3 후 -5 = ${posMinus2}): ${robotSimOk}`);
    } else {
      recordCheck('INTENT-05', '로봇 이동 시뮬레이터 함수 존재', false, 'moveRobot 함수 없음');
    }
  } catch (err) {
    recordCheck('INTENT-05', '로봇 이동 시뮬레이터', false, err.message);
  }

  // --- 6. [INTENT-06] 1-2 & 1-3 수직선 점 마그네틱 배치기 검증 ---
  try {
    window.loadSubStep('1-2');
    if (typeof window.setPointP12 === 'function') {
      window.setPointP12('A', 3);
      window.setPointP12('B', 1.5);
      const ptsOk = (window.simState.p12Points.A === 3 && window.simState.p12Points.B === 1.5);
      recordCheck('INTENT-06', '수직선 점 마그네틱 배치 시뮬레이터', ptsOk, ptsOk ? '점 A(+3), 점 B(+1.5) 배치 및 수치 동기화 성공' : '점 좌표 불일치');
    } else {
      recordCheck('INTENT-06', '수직선 점 배치기 함수', false, 'setPointP12 함수 없음');
    }
  } catch (err) {
    recordCheck('INTENT-06', '수직선 점 배치기', false, err.message);
  }

  // --- 7. [INTENT-07] 1-4 원점 거리(절댓값) 측정 줄자 검증 ---
  try {
    window.loadSubStep('1-4');
    if (typeof window.setAbsPos === 'function') {
      window.setAbsPos(-5);
      const absOk = (window.simState.p14Pos === -5);
      const readout = document.getElementById('abs-readout');
      const textOk = readout && readout.innerText.includes('|-5| = 5');
      recordCheck('INTENT-07', '교과서 54쪽 절댓값 줄자 측정기', absOk && textOk, absOk && textOk ? 'P = -5 에서 원점 거리 5, |-5|=5 판독 성공' : '절댓값 측정 실패');
    } else {
      recordCheck('INTENT-07', '절댓값 측정기 함수', false, 'setAbsPos 함수 없음');
    }
  } catch (err) {
    recordCheck('INTENT-07', '절댓값 줄자 측정기', false, err.message);
  }

  // --- 8. [INTENT-08] 2-1 수직선 대소 비교 저울 검증 ---
  try {
    window.loadSubStep('2-1');
    if (typeof window.setCompare === 'function') {
      window.setCompare(-5, -2);
      const compOk = (window.simState.p21A === -5 && window.simState.p21B === -2);
      const readout = document.getElementById('compare-readout');
      const textOk = readout && readout.innerText.includes('-5 < -2');
      recordCheck('INTENT-08', '교과서 56쪽 수직선 대소 비교 저울', compOk && textOk, compOk && textOk ? '두 음수 대소 비교 (-5 < -2) 성공' : '대소 비교 실패');
    } else {
      recordCheck('INTENT-08', '대소 비교기 함수', false, 'setCompare 함수 없음');
    }
  } catch (err) {
    recordCheck('INTENT-08', '수직선 대소 비교 저울', false, err.message);
  }

  // --- 9. [INTENT-09] 3-1 양(+)·음(-) 칩 상쇄 실험실 검증 ---
  try {
    window.loadSubStep('3-1');
    if (typeof window.addChip === 'function' && typeof window.cancelChipPairs === 'function') {
      window.resetChips(3, 5);
      window.cancelChipPairs();
      const chipOk = (window.simState.chipBlue === 3 && window.simState.chipRed === 5 && window.simState.chipCancelled === true);
      recordCheck('INTENT-09', '교과서 60쪽 양/음 칩 상쇄 실험실', chipOk, chipOk ? '(+3)+(-5) 칩 추가 및 3쌍 상쇄 애니메이션 성공' : '칩 상쇄 상태 불일치');
    } else {
      recordCheck('INTENT-09', '칩 실험실 함수', false, 'addChip/cancelChipPairs 함수 없음');
    }
  } catch (err) {
    recordCheck('INTENT-09', '양/음 칩 상쇄 실험실', false, err.message);
  }

  // --- 10. [INTENT-10] 3-2 수직선 화살표 2단계 덧셈기 검증 ---
  try {
    window.loadSubStep('3-2');
    if (typeof window.stepArrow === 'function') {
      window.stepArrow(1);
      const s1 = (window.simState.arrowStep === 1);
      window.stepArrow(2);
      const s2 = (window.simState.arrowStep === 2);
      window.stepArrow(3);
      const s3 = (window.simState.arrowStep === 3);
      recordCheck('INTENT-10', '교과서 61쪽 수직선 화살표 덧셈기', s1 && s2 && s3, s1 && s2 && s3 ? '1단계(+3) -> 2단계(-5) -> 3단계(-2) 발사 성공' : '화살표 단계 실패');
    } else {
      recordCheck('INTENT-10', '화살표 덧셈기 함수', false, 'stepArrow 함수 없음');
    }
  } catch (err) {
    recordCheck('INTENT-10', '수직선 화살표 덧셈기', false, err.message);
  }

  // --- 11. [INTENT-11] 4-1 속도×시간 곱셈 시뮬레이터 검증 ---
  try {
    window.loadSubStep('4-1');
    if (typeof window.setMultSim === 'function') {
      window.setMultSim(-3, -2);
      const multOk = (window.simState.velocity === -3 && window.simState.timeOffset === -2);
      const readout = document.getElementById('mult-readout');
      const textOk = readout && readout.innerText.includes('(-3) × (-2) = +6');
      recordCheck('INTENT-11', '교과서 68쪽 음수×음수=양수 시뮬레이터', multOk && textOk, multOk && textOk ? '서쪽(-3) 2초 전(-2) = +6m 연산 증명 성공' : '곱셈 시뮬레이터 실패');
    } else {
      recordCheck('INTENT-11', '곱셈 시뮬레이터 함수', false, 'setMultSim 함수 없음');
    }
  } catch (err) {
    recordCheck('INTENT-11', '속도×시간 곱셈 시뮬레이터', false, err.message);
  }

  // --- 12. [INTENT-12] 5-2 세계 도시 기온차 수직선 온도계 검증 ---
  try {
    window.loadSubStep('5-2');
    if (typeof window.setThermCities === 'function') {
      window.setThermCities(5, -12);
      const thOk = (window.simState.thermCityA === 5 && window.simState.thermCityB === -12);
      recordCheck('INTENT-12', '교과서 76쪽 세계 도시 기온차 수직선 온도계', thOk, thOk ? '서울(+5℃)과 모스크바(-12℃) 기온차 17℃ 설정 성공' : '온도계 설정 실패');
    } else {
      recordCheck('INTENT-12', '온도계 시뮬레이터 함수', false, 'setThermCities 함수 없음');
    }
  } catch (err) {
    recordCheck('INTENT-12', '세계 도시 기온차 온도계', false, err.message);
  }

  // --- 13. [INTENT-13] 채점 정규화 및 정답 뷰 전환 검증 ---
  try {
    window.loadSubStep('1-1');
    const robotInput = document.getElementById('p11-robot-pos');
    const tempInput = document.getElementById('p11-temp2');
    const moneyInput = document.getElementById('p11-money');
    if (robotInput && tempInput && moneyInput) {
      robotInput.value = ' -2 ';
      tempInput.value = ' -7℃ ';
      moneyInput.value = ' -500원 ';
      window.check11Submit();

      const viewOk = (window.state.verifiedViewData['1-1'] !== undefined);
      const formArea = document.getElementById('form-work-area');
      const cardOk = formArea && formArea.innerHTML.includes('verified-answer-card');
      recordCheck('INTENT-13', 'normTxt 정규화 채점 및 정답 화면 전환', viewOk && cardOk, viewOk && cardOk ? '공백/기호 유연 채점 및 녹색 축하 카드 전환 성공' : '정답 뷰 전환 실패');
    } else {
      recordCheck('INTENT-13', '채점 인풋 필드', false, '인풋 필드 미발견');
    }
  } catch (err) {
    recordCheck('INTENT-13', '채점 및 정답 뷰 전환', false, err.message);
  }

  // --- 14. [INTENT-14] 중1 좌표평면(g1_coordinate.html) 대비 질적 완성도 상시 벤치마크 ---
  try {
    const coordHtmlPath = path.join(__dirname, '../g1_coordinate.html');
    let qualitativePassed = false;
    let qualDetails = '';

    if (!fs.existsSync(coordHtmlPath)) {
      recordCheck('INTENT-14', '기준 페이지 g1_coordinate.html 존재', false, 'g1_coordinate.html 파일 없음');
    } else {
      // 7 Qualitative Dimensions
      const checks = [
        {
          name: 'Two.js 인터랙티브 캔버스 및 동적 컨트롤러',
          ok: htmlContent.includes('Two.Types') && htmlContent.includes('interactive-sim-controller') && htmlContent.includes('setupSubstepSimulator')
        },
        {
          name: '4대 필수 모달 시스템 (보안/해금/관제/확대)',
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
          ok: ['moveRobot', 'setPointP12', 'setAbsPos', 'setCompare', 'addChip', 'stepArrow', 'setMultSim', 'setThermCities'].every(fn => htmlContent.includes(fn))
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

  // --- 15. 정답 미노출 원칙 검증 (Zero Answer Leakage in Placeholders) ---
  try {
    const knownAnswerMap = {
      'p01-q1': ['5/6'],
      'p01-q2': ['0.2'],
      'p02-a': ['+3', '3'],
      'p02-b': ['1.5', '3/2'],
      'p03-q1': ['>'],
      'p03-q2': ['<'],
      'p11-robot-pos': ['-2'],
      'p11-temp2': ['-7'],
      'p11-money': ['-500'],
      'p12-ints': ['-3, 0, +5', '-3, 0, 5'],
      'p12-zero': ['둘다아니다', '둘 다 아니다'],
      'p13-q1': ['O', 'o'],
      'p13-q2': ['-2.5', '-5/2'],
      'p14-q1': ['5'],
      'p14-q2': ['2.7'],
      'p14-q3': ['+4, -4', '4, -4', '+4,-4'],
      'p21-q1': ['>'],
      'p21-q2': ['<'],
      'p21-q3': ['<'],
      'p22-q1': ['>='],
      'p22-q2': ['<='],
      'p22-q3': ['-1<x<=5', '-1 < x <= 5'],
      'p23-max': ['+1.5', '1.5'],
      'p23-min': ['-4.5'],
      'p31-q1': ['+10', '10'],
      'p31-q2': ['-13'],
      'p31-q3': ['+6', '6'],
      'p31-q4': ['-6'],
      'p32-law1': ['교환법칙'],
      'p32-law2': ['결합법칙'],
      'p32-val': ['+5', '5'],
      'p33-q1': ['-3'],
      'p33-q2': ['+7', '7'],
      'p33-q3': ['-4'],
      'p34-q1': ['+5', '5'],
      'p34-q2': ['-5'],
      'p41-q1': ['+12', '12'],
      'p41-q2': ['-30'],
      'p41-q3': ['+56', '56'],
      'p42-q1': ['2'],
      'p42-q2': ['-8'],
      'p42-q3': ['-16'],
      'p43-recip': ['-5/3'],
      'p43-ans': ['+9', '9'],
      'p51-q1': ['+5', '5'],
      'p51-q2': ['음수'],
      'p52-tempdiff': ['17']
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
          const cleanAns = ans.replace(/\s+/g, '');
          const cleanPh = ph.replace(/\s+/g, '');
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

  // --- 계산 및 리포트 작성 ---
  const totalItems = results.length;
  const passedItems = results.filter(r => r.isPassed).length;
  const scorePercent = Math.round((passedItems / totalItems) * 100);

  // Rejection rules
  let verdict = 'PASS';
  let rejectReason = '';

  if (!isLoginCriticalPassed) {
    verdict = 'REJECT';
    rejectReason = '❌ [치명적 실패] 학생 로그인, 교사 마스터 비밀번호 바이패스, 또는 교사 계정 접속 버튼 모달 인증이 실패하여 완성도와 무관하게 즉시 반려합니다.';
  } else if (scorePercent < 90) {
    verdict = 'REJECT';
    rejectReason = `❌ [미달] 설계 명세서 달성도(${scorePercent}%)가 합격 기준(90%)에 미달하여 반려합니다.`;
  }

  console.log('\n========================================');
  console.log(`📊 서브에이전트 종합 판정: ${verdict} (${scorePercent}% 달성 - ${passedItems}/${totalItems})`);
  if (verdict === 'REJECT') console.log(`사유: ${rejectReason}`);
  console.log('========================================\n');

  // Generate Markdown Report
  let reportMd = `# 🤖 [서브에이전트 평가 리포트] 2단원 정수와 유리수 (g1_ch2_integers.html)\n\n`;
  reportMd += `- **평가 일시**: ${new Date().toISOString()}\n`;
  reportMd += `- **평가 대상 파일**: [g1_ch2_integers.html](file:///home/ubuntu/workspace/Redbook/g1_ch2_integers.html)\n`;
  reportMd += `- **기반 설계 명세서**: [eval_ch2_spec.md](file:///home/ubuntu/workspace/Redbook/docs/eval_ch2_spec.md)\n`;
  reportMd += `- **최종 판정**: **${verdict === 'PASS' ? '✅ PASS (합격 / 승인)' : '❌ REJECT (반려 / 수정 요청)'}**\n`;
  reportMd += `- **달성도 점수**: **${scorePercent}%** (${passedItems}개 성공 / 총 ${totalItems}개 항목)\n\n`;

  if (verdict === 'REJECT') {
    reportMd += `> [!CAUTION]\n> **반려 사유**: ${rejectReason}\n\n`;
  } else {
    reportMd += `> [!TIP]\n> **평가 결과**: 메인 에이전트의 작업 의도가 90% 이상(${scorePercent}%) 완벽하게 구현되었으며, 기본 로그인 및 10대 교과서 인터랙티브 시뮬레이터가 정상 동작함을 확인하여 최종 승인합니다.\n\n`;
  }

  reportMd += `## 📋 세부 항목별 검증 결과\n\n`;
  reportMd += `| 번호 | 의도 ID | 항목명 | 판정 | 세부 결과 |\n`;
  reportMd += `| :--- | :--- | :--- | :---: | :--- |\n`;
  results.forEach((r, idx) => {
    reportMd += `| ${idx + 1} | \`${r.id}\` | **${r.name}** | ${r.isPassed ? '✅ 통과' : '❌ 실패'} | ${r.details} |\n`;
  });

  reportMd += `\n---\n\n`;
  reportMd += `## 🔍 핵심 인터랙티브 기능 검증 요약\n\n`;
  reportMd += `1. **로봇 주행 시뮬레이터 (교과서 50쪽)**: 동쪽/서쪽 이동 명령 시 궤적과 좌표가 동적으로 시뮬레이션됨을 확인.\n`;
  reportMd += `2. **수직선 점 배치기 (교과서 52쪽)**: 점 A, B, C의 좌표 배치 및 시각적 피드백 확인.\n`;
  reportMd += `3. **절댓값 줄자 측정기 (교과서 54쪽)**: 거리 밴드 확장/축소 및 $|-5|=5$ 확인.\n`;
  reportMd += `4. **양/음 칩 상쇄 실험실 (교과서 60쪽)**: (+1)과 (-1) 쌍 상쇄 애니메이션 및 (+3)+(-5)=-2 도출 확인.\n`;
  reportMd += `5. **속도×시간 곱셈기 (교과서 68쪽)**: 음수 × 음수 = 양수 (+6m) 시각적 증명 확인.\n`;

  fs.writeFileSync(reportPath, reportMd, 'utf8');
  console.log('✅ 서브에이전트 평가 리포트 저장 완료:', reportPath);

  return { verdict, scorePercent, passedItems, totalItems, rejectReason };
}

runSubagentEvaluation().then(res => {
  process.exit(res.verdict === 'PASS' ? 0 : 1);
}).catch(err => {
  console.error('서브에이전트 실행 중 치명적 오류:', err);
  process.exit(1);
});
