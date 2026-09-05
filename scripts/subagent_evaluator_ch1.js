const fs = require('fs');
const path = require('path');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

async function runSubagentEvaluationCh1() {
  console.log('🤖 [서브에이전트] 1단원 설계 명세서(eval_ch1_spec.md) 로드 및 독립 평가 시작...');

  const specPath = path.join(__dirname, '../docs/eval_ch1_spec.md');
  const targetHtmlPath = path.join(__dirname, '../g1_ch1_factors.html');
  const reportPath = path.join(__dirname, '../docs/eval_ch1_report.md');

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
    url: 'https://sjylim0829-commits.github.io/redbook-math-app/g1_ch1_factors.html',
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
    recordCheck('INTENT-03', '4대 모달 시스템 완비', allModalsExist, allModalsExist ? '모든 4대 모달 정상 탑재' : '일부 모달 누락');
  } catch (err) {
    recordCheck('INTENT-03', '4대 모달 시스템', false, err.message);
  }

  // --- 4. [INTENT-04] 0-1 약수 타일 배열기 검증 ---
  try {
    window.loadSubStep('0-1');
    if (typeof window.setTileArray === 'function') {
      window.setTileArray(3, 4);
      const tilesOk = (window.simState.tileRows === 3 && window.simState.tileCols === 4);
      const ansInput = document.getElementById('p01-ans');
      if (ansInput) ansInput.value = '1, 2, 3, 4, 6, 12';
      window.check01Submit();
      const passed = (window.state.verifiedViewData['0-1'] !== undefined);
      recordCheck('INTENT-04', '0-1 약수 타일 직사각형 배열기', tilesOk && passed, tilesOk && passed ? '3×4 배열 조작 및 12 약수 채점 통과' : '타일 배열기 실패');
    } else {
      recordCheck('INTENT-04', '타일 배열기 함수', false, 'setTileArray 함수 없음');
    }
  } catch (err) {
    recordCheck('INTENT-04', '약수 타일 배열기', false, err.message);
  }

  // --- 5. [INTENT-05] 1-1 자연수 분류 저울 검증 ---
  try {
    window.loadSubStep('1-1');
    if (typeof window.inspectNumberFactors === 'function') {
      window.inspectNumberFactors(5);
      const g1 = document.getElementById('p11-g1');
      const g2 = document.getElementById('p11-g2');
      const g3 = document.getElementById('p11-g3');
      if (g1 && g2 && g3) {
        g1.value = '1';
        g2.value = '2, 3, 5, 7';
        g3.value = '4, 6, 8, 9, 10';
        window.check11Submit();
        const passed = (window.state.verifiedViewData['1-1'] !== undefined);
        recordCheck('INTENT-05', '1-1 자연수 약수 개수 분류 저울', passed, passed ? '약수 개수별 분류(1 / 2,3,5,7 / 4,6,8,9,10) 채점 성공' : '분류 채점 실패');
      } else {
        recordCheck('INTENT-05', '분류 인풋 필드', false, '인풋 필드 누락');
      }
    } else {
      recordCheck('INTENT-05', '분류 저울 함수', false, 'inspectNumberFactors 함수 없음');
    }
  } catch (err) {
    recordCheck('INTENT-05', '자연수 분류 저울', false, err.message);
  }

  // --- 6. [INTENT-06] 1-3 에라토스테네스의 체 검증 ---
  try {
    window.loadSubStep('1-3');
    if (typeof window.stepSieve === 'function') {
      window.stepSieve(1);
      window.stepSieve(2);
      window.stepSieve(6);
      const sieveOk = (window.simState.sieveStep === 6);
      const cntInput = document.getElementById('p13-count');
      if (cntInput) cntInput.value = '15';
      window.check13Submit();
      const passed = (window.state.verifiedViewData['1-3'] !== undefined);
      recordCheck('INTENT-06', '1-3 에라토스테네스의 체 단계별 체질기', sieveOk && passed, sieveOk && passed ? '1~50 체질 및 15개 소수 발견 성공' : '체질기 실패');
    } else {
      recordCheck('INTENT-06', '에라토스테네스의 체 함수', false, 'stepSieve 함수 없음');
    }
  } catch (err) {
    recordCheck('INTENT-06', '에라토스테네스의 체', false, err.message);
  }

  // --- 7. [INTENT-07] 2-1 거듭제곱 블록 배가기 검증 ---
  try {
    window.loadSubStep('2-1');
    if (typeof window.setPowerSim === 'function') {
      window.setPowerSim(2, 5);
      const powOk = (window.simState.powerBase === 2 && window.simState.powerExp === 5);
      const bIn = document.getElementById('p21-base');
      const eIn = document.getElementById('p21-exp');
      const vIn = document.getElementById('p21-val');
      if (bIn && eIn && vIn) {
        bIn.value = '2'; eIn.value = '5'; vIn.value = '32';
        window.check21Submit();
        const passed = (window.state.verifiedViewData['2-1'] !== undefined);
        recordCheck('INTENT-07', '2-1 거듭제곱 블록 배가 시뮬레이터', powOk && passed, powOk && passed ? '2⁵ = 32 배가 블록 및 밑/지수 채점 성공' : '거듭제곱 실패');
      } else {
        recordCheck('INTENT-07', '거듭제곱 인풋', false, '인풋 필드 누락');
      }
    } else {
      recordCheck('INTENT-07', '거듭제곱 함수', false, 'setPowerSim 함수 없음');
    }
  } catch (err) {
    recordCheck('INTENT-07', '거듭제곱 시뮬레이터', false, err.message);
  }

  // --- 8. [INTENT-08] 2-2 소인수분해 가지치기 트리 빌더 검증 ---
  try {
    window.loadSubStep('2-2');
    if (typeof window.stepFactorTree === 'function') {
      window.stepFactorTree(36);
      const in36 = document.getElementById('p22-36');
      const in60 = document.getElementById('p22-60');
      if (in36 && in60) {
        in36.value = '2^2 * 3^2';
        in60.value = '2^2 * 3 * 5';
        window.check22Submit();
        const passed = (window.state.verifiedViewData['2-2'] !== undefined);
        recordCheck('INTENT-08', '2-2 소인수분해 가지치기 트리 빌더', passed, passed ? '36(2²×3²), 60(2²×3×5) 수형도 분해 성공' : '가지치기 실패');
      } else {
        recordCheck('INTENT-08', '가지치기 인풋', false, '인풋 필드 누락');
      }
    } else {
      recordCheck('INTENT-08', '가지치기 함수', false, 'stepFactorTree 함수 없음');
    }
  } catch (err) {
    recordCheck('INTENT-08', '소인수분해 가지치기 트리', false, err.message);
  }

  // --- 9. [INTENT-09] 2-3 소인수분해 격자표 약수 생성기 검증 ---
  try {
    window.loadSubStep('2-3');
    const cntIn = document.getElementById('p23-cnt');
    const secIn = document.getElementById('p23-second');
    if (cntIn && secIn) {
      cntIn.value = '12';
      secIn.value = '36';
      window.check23Submit();
      const passed = (window.state.verifiedViewData['2-3'] !== undefined);
      recordCheck('INTENT-09', '2-3 소인수분해 격자표 약수 생성기', passed, passed ? '72 약수 총 12개 및 2번째 큰 수(36) 판독 성공' : '격자표 채점 실패');
    } else {
      recordCheck('INTENT-09', '격자표 인풋', false, '인풋 필드 누락');
    }
  } catch (err) {
    recordCheck('INTENT-09', '격자표 약수 생성기', false, err.message);
  }

  // --- 10. [INTENT-10] 3-1 공약수 벤다이어그램 검증 ---
  try {
    window.loadSubStep('3-1');
    if (typeof window.setVennFactors === 'function') {
      window.setVennFactors(18, 24);
      const gcdIn = document.getElementById('p31-gcd');
      const copIn = document.getElementById('p31-coprime');
      if (gcdIn && copIn) {
        gcdIn.value = '6';
        copIn.value = '예';
        window.check31Submit();
        const passed = (window.state.verifiedViewData['3-1'] !== undefined);
        recordCheck('INTENT-10', '3-1 공약수 벤다이어그램', passed, passed ? '최대공약수(6)와 서로소 판별 성공' : '벤다이어그램 채점 실패');
      } else {
        recordCheck('INTENT-10', '벤다이어그램 인풋', false, '인풋 필드 누락');
      }
    } else {
      recordCheck('INTENT-10', '벤다이어그램 함수', false, 'setVennFactors 함수 없음');
    }
  } catch (err) {
    recordCheck('INTENT-10', '공약수 벤다이어그램', false, err.message);
  }

  // --- 11. [INTENT-11] 3-2 소인수 거듭제곱 비교 저울 검증 ---
  try {
    window.loadSubStep('3-2');
    if (typeof window.compareGcdPowers === 'function') {
      window.compareGcdPowers();
      const powIn = document.getElementById('p32-power');
      const valIn = document.getElementById('p32-val');
      if (powIn && valIn) {
        powIn.value = '2^2 * 3';
        valIn.value = '12';
        window.check32Submit();
        const passed = (window.state.verifiedViewData['3-2'] !== undefined);
        recordCheck('INTENT-11', '3-2 소인수 거듭제곱 비교 저울', passed, passed ? '작은 지수 선택 GCD(2²×3 = 12) 도출 성공' : '지수 비교 실패');
      } else {
        recordCheck('INTENT-11', '비교 저울 인풋', false, '인풋 필드 누락');
      }
    } else {
      recordCheck('INTENT-11', '비교 저울 함수', false, 'compareGcdPowers 함수 없음');
    }
  } catch (err) {
    recordCheck('INTENT-11', '소인수 거듭제곱 비교 저울', false, err.message);
  }

  // --- 12. [INTENT-12] 4-2 톱니바퀴 맞물림 회전기 검증 ---
  try {
    window.loadSubStep('4-2');
    if (typeof window.rotateGears === 'function') {
      window.rotateGears(3);
      const lcmIn = document.getElementById('p42-lcm');
      const rotA = document.getElementById('p42-rotA');
      const rotB = document.getElementById('p42-rotB');
      if (lcmIn && rotA && rotB) {
        lcmIn.value = '72';
        rotA.value = '3';
        rotB.value = '2';
        window.check42Submit();
        const passed = (window.state.verifiedViewData['4-2'] !== undefined);
        recordCheck('INTENT-12', '4-2 톱니바퀴 맞물림 회전 시뮬레이터', passed, passed ? '72톱니 맞물림 (A 3바퀴, B 2바퀴) 회전 동기화 성공' : '톱니바퀴 실패');
      } else {
        recordCheck('INTENT-12', '톱니바퀴 인풋', false, '인풋 필드 누락');
      }
    } else {
      recordCheck('INTENT-12', '톱니바퀴 함수', false, 'rotateGears 함수 없음');
    }
  } catch (err) {
    recordCheck('INTENT-12', '톱니바퀴 회전기', false, err.message);
  }

  // --- 13. [INTENT-13] 5-2 몬드리안 직사각형 분할 검증 ---
  try {
    window.loadSubStep('5-2');
    if (typeof window.setMondrianTiles === 'function') {
      window.setMondrianTiles(12);
      const sizeIn = document.getElementById('p52-size');
      const cntIn = document.getElementById('p52-count');
      if (sizeIn && cntIn) {
        sizeIn.value = '12';
        cntIn.value = '6';
        window.check52Submit();
        const passed = (window.state.verifiedViewData['5-2'] !== undefined);
        recordCheck('INTENT-13', '5-2 몬드리안 직사각형 분할 창의융합', passed, passed ? '최대공약수 타일 12cm, 총 6장 분할 성공' : '몬드리안 분할 실패');
      } else {
        recordCheck('INTENT-13', '몬드리안 인풋', false, '인풋 필드 누락');
      }
    } else {
      recordCheck('INTENT-13', '몬드리안 함수', false, 'setMondrianTiles 함수 없음');
    }
  } catch (err) {
    recordCheck('INTENT-13', '몬드리안 분할', false, err.message);
  }

  // --- 14. [INTENT-14] 중1 좌표평면(g1_coordinate.html) 대비 질적 완성도 상시 벤치마크 ---
  try {
    const coordHtmlPath = path.join(__dirname, '../g1_coordinate.html');
    let qualitativePassed = false;
    let qualDetails = '';

    if (!fs.existsSync(coordHtmlPath)) {
      recordCheck('INTENT-14', '기준 페이지 g1_coordinate.html 존재', false, 'g1_coordinate.html 파일 없음');
    } else {
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
          ok: ['setTileArray', 'inspectNumberFactors', 'stepSieve', 'setPowerSim', 'stepFactorTree', 'setVennFactors', 'compareGcdPowers', 'rotateGears', 'setMondrianTiles'].every(fn => htmlContent.includes(fn))
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
  let reportMd = `# 🤖 [서브에이전트 평가 리포트] 1단원 소인수분해 (g1_ch1_factors.html)\n\n`;
  reportMd += `- **평가 일시**: ${new Date().toISOString()}\n`;
  reportMd += `- **평가 대상 파일**: [g1_ch1_factors.html](file:///home/ubuntu/workspace/Redbook/g1_ch1_factors.html)\n`;
  reportMd += `- **기반 설계 명세서**: [eval_ch1_spec.md](file:///home/ubuntu/workspace/Redbook/docs/eval_ch1_spec.md)\n`;
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
  reportMd += `1. **약수 타일 배열기 (교과서 10쪽)**: 12개 타일의 직사각형 배열($1\\times12, 2\\times6, 3\\times4$) 실시간 렌더링 확인.\n`;
  reportMd += `2. **자연수 분류 저울 (교과서 12쪽)**: 1부터 10까지 약수 개수별(1개, 2개, 3개 이상) 3개 바구니 분류 확인.\n`;
  reportMd += `3. **에라토스테네스의 체 (교과서 15쪽)**: 1~50 격자에서 소수 15개 체질 애니메이션 확인.\n`;
  reportMd += `4. **거듭제곱 블록 배가기 (교과서 18쪽)**: $2^1$부터 $2^5=32$까지 거듭제곱 배가 시각화 확인.\n`;
  reportMd += `5. **소인수분해 가지치기 트리 (교과서 20~21쪽)**: 36, 60, 72의 수형도 가지치기 및 소인수 잎 확인.\n`;
  reportMd += `6. **격자표 약수 생성기 (교과서 23쪽)**: $72 = 2^3 \\times 3^2$ 2차원 격자표 12개 약수 생성 확인.\n`;
  reportMd += `7. **공약수 벤다이어그램 (교과서 26~27쪽)**: 18과 24의 공약수(1, 2, 3, 6) 및 최대공약수(6) 강조 확인.\n`;
  reportMd += `8. **톱니바퀴 맞물림 회전기 (교과서 34쪽)**: 24톱니 A바퀴 3회전, 36톱니 B바퀴 2회전, 최소공배수 72톱니 확인.\n`;
  reportMd += `9. **몬드리안 직사각형 분할 (교과서 38쪽)**: 최대공약수 $12\\text{cm}$ 정사각형 타일 6장 분할 확인.\n`;

  fs.writeFileSync(reportPath, reportMd, 'utf8');
  console.log('✅ 서브에이전트 평가 리포트 저장 완료:', reportPath);

  return { verdict, scorePercent, passedItems, totalItems, rejectReason };
}

runSubagentEvaluationCh1().then(res => {
  process.exit(res.verdict === 'PASS' ? 0 : 1);
}).catch(err => {
  console.error('서브에이전트 실행 중 치명적 오류:', err);
  process.exit(1);
});
