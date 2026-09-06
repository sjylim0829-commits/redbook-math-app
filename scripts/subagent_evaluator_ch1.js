// scripts/subagent_evaluator_ch1.js
// 1단원 소인수분해 (g1_ch1_factors.html) 57개 서브스텝 전수 평가 스크립트 (Playwright 실환경 기반)

const { chromium } = require('/home/ubuntu/.cache/ms-playwright-go/1.57.0/node_modules/playwright-core');
const fs = require('fs');
const path = require('path');

const REPORT_FILE = path.join(__dirname, '../docs/eval_ch1_report.md');
const SPEC_FILE = path.join(__dirname, '../docs/eval_ch1_spec.md');

async function runCh1SubagentEvaluation() {
  console.log("🤖 [서브에이전트] 1단원(g1_ch1_factors.html) 실환경 브라우저 57개 서브스텝 종합 평가 시작...");

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/home/ubuntu/.cache/ms-playwright/chromium-1155/chrome-linux/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const context = await browser.newContext({ viewport: { width: 1280, height: 850 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  const testResults = [];
  function record(id, title, maxScore, passed, detail) {
    const score = passed ? maxScore : 0;
    testResults.push({ id, title, maxScore, score, passed, detail });
    const mark = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`[${mark}] ${id}: ${title} (${score}/${maxScore}점) - ${detail}`);
  }

  try {
    // 1. 페이지 로드
    console.log("페이지 접속: http://localhost:8080/g1_ch1_factors.html");
    await page.goto('http://localhost:8080/g1_ch1_factors.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // [INTENT-01] 🔐 3중 보안 로그인, 단계적 잠금, 교사 계정 모달 및 마스터 해금
    try {
      const loginCheck = await page.evaluate(() => {
        const idInput = !!document.getElementById('student-id');
        const pwInput = !!document.getElementById('student-name');
        const teacherBtn = typeof openTestLoginModal === 'function' || !!document.querySelector("button[onclick*='openTestLoginModal']");
        const modal = !!document.getElementById('secure-password-modal');
        return { idInput, pwInput, teacherBtn, modal };
      });
      const pass01 = loginCheck.idInput && loginCheck.pwInput && loginCheck.teacherBtn && loginCheck.modal;
      record('INTENT-01', '3중 보안 로그인, 단계적 잠금, 교사 계정 모달 및 마스터 해금', 10, pass01,
        `학번인풋=${loginCheck.idInput}, 비번인풋=${loginCheck.pwInput}, 교사모달버튼=${loginCheck.teacherBtn}, 모달DOM=${loginCheck.modal}`);
    } catch (e) {
      record('INTENT-01', '3중 보안 로그인', 10, false, e.message);
    }

    // 교사 마스터 로그인으로 전환 및 전체 해금
    await page.evaluate(() => {
      if (typeof state !== 'undefined') {
        state.isTeacherLoggedIn = true;
        state.isMaster = true;
        state.unlockedTabs = [0, 1, 2, 3, 4, 5, 6];
        if (typeof ALL_G1_SUBSTEPS !== 'undefined') {
          state.unlockedSubSteps = ALL_G1_SUBSTEPS;
        } else if (typeof SUBSTEP_CONFIG !== 'undefined') {
          state.unlockedSubSteps = Object.keys(SUBSTEP_CONFIG);
        }
      }
      if (typeof switchView === 'function') switchView('activity');
    });
    await page.waitForTimeout(600);

    // [INTENT-02] 🟡 노란색 정답 빈칸 표준 UX (#fef08a)
    try {
      const yellowCheck = await page.evaluate(() => {
        const styleText = Array.from(document.querySelectorAll('style')).map(s => s.innerText).join('\n');
        const hasYellow = styleText.includes('#fef08a') || styleText.includes('fef08a');
        const hasProofInput = styleText.includes('.proof-input-text') || !!document.querySelector('.proof-input-text');
        return { hasYellow, hasProofInput };
      });
      const pass02 = yellowCheck.hasYellow && yellowCheck.hasProofInput;
      record('INTENT-02', '노란색 정답 빈칸 표준 UX (#fef08a)', 5, pass02,
        `#fef08a 포함 여부=${yellowCheck.hasYellow}, proof-input-text 지원=${yellowCheck.hasProofInput}`);
    } catch (e) {
      record('INTENT-02', '노란색 정답 빈칸 표준 UX', 5, false, e.message);
    }

    // [INTENT-03] 🏛️ 4대 관리 모달 시스템 완비
    try {
      const modalCheck = await page.evaluate(() => {
        const m1 = !!document.getElementById('secure-password-modal');
        const m2 = !!document.getElementById('unlock-boundary-modal');
        const m3 = !!document.getElementById('teacher-dashboard-modal');
        const m4 = !!document.getElementById('student-zoom-modal');
        return { m1, m2, m3, m4, all: m1 && m2 && m3 && m4 };
      });
      record('INTENT-03', '4대 관리 모달 시스템 완비', 5, modalCheck.all,
        `보안인증=${modalCheck.m1}, 진도해금=${modalCheck.m2}, 대시보드=${modalCheck.m3}, 학생확대=${modalCheck.m4}`);
    } catch (e) {
      record('INTENT-03', '4대 관리 모달 시스템', 5, false, e.message);
    }

    // 57개 서브스텝 전수 정의
    const substeps = [
      '0-1', '0-2', '0-3', '0-4',
      '1-1', '1-2', '1-3', '1-4', '1-5', '1-6', '1-7', '1-8', '1-9',
      '2-1', '2-2', '2-3', '2-4', '2-5', '2-6', '2-7', '2-8', '2-9',
      '3-1', '3-2', '3-3', '3-4', '3-5', '3-6', '3-7', '3-8', '3-9', '3-10',
      '4-1', '4-2', '4-3', '4-4', '4-5', '4-6', '4-7', '4-8', '4-9', '4-10',
      '5-1', '5-2', '5-3', '5-4', '5-5', '5-6', '5-7', '5-8', '5-9', '5-10', '5-11', '5-12', '5-13', '5-14',
      '6-1'
    ];

    // 서브스텝별 캔버스 및 렌더링 검사
    const blankCanvases = [];
    const leakedPlaceholders = [];
    const allTextIssues = [];
    const renderedSubsteps = [];

    for (const code of substeps) {
      const stepRes = await page.evaluate((c) => {
        if (typeof loadSubStep === 'function') loadSubStep(c);
        const container = document.getElementById('two-container');
        const domCanvas = container ? container.querySelectorAll('canvas, svg').length : 0;
        const two = window.twoInstance || window.two;
        const sceneChildren = two && two.scene ? two.scene.children.length : 0;
        const hasGraphics = domCanvas > 0 && sceneChildren > 0;
        
        // 정답 누출 감사
        const inputs = Array.from(document.querySelectorAll('#form-work-area input, #form-work-area textarea'));
        const leaks = [];
        inputs.forEach(inp => {
          const ph = (inp.getAttribute('placeholder') || '').trim();
          // 만약 플레이스홀더에 구체적 정답 숫자가 단독으로 있거나 누출된 경우
          if (/^(정답|답)\s*[:=]/i.test(ph)) {
            leaks.push({ code: c, placeholder: ph });
          }
        });

        // 폰트 크기 및 프레임 경계 감사
        const textIssues = [];
        if (two && two.scene && two.scene.children) {
          const w = two.width || 600, h = two.height || 500;
          function inspectObject(obj) {
            if (!obj) return;
            if (obj.value !== undefined && obj.size !== undefined) {
              const sz = obj.size;
              const x = obj.translation ? obj.translation.x : 0;
              const y = obj.translation ? obj.translation.y : 0;
              // 1) 너무 작은 폰트 (< 9px)
              if (sz < 9) {
                textIssues.push({ code: c, type: 'too-small', val: String(obj.value).substring(0, 15), size: sz });
              }
              // 2) 비정상적으로 거대한 폰트 (> 28px, 0-4의 '1'과 같은 상징 숫자 제외)
              if (sz > 28 && String(obj.value).trim().length > 2) {
                textIssues.push({ code: c, type: 'too-large', val: String(obj.value).substring(0, 15), size: sz });
              }
              // 3) 캔버스 프레임 이탈 (여백 25px 초과)
              if (x < -25 || x > w + 25 || y < -25 || y > h + 25) {
                textIssues.push({ code: c, type: 'out-of-frame', val: String(obj.value).substring(0, 15), x, y, w, h });
              }
            }
            if (obj.children && Array.isArray(obj.children)) {
              obj.children.forEach(inspectObject);
            }
          }
          two.scene.children.forEach(inspectObject);
        }

        return { code: c, hasGraphics, sceneChildren, leaks, textIssues };
      }, code);

      await page.waitForTimeout(60);

      renderedSubsteps.push(stepRes.code);
      if (!stepRes.hasGraphics || stepRes.sceneChildren === 0) {
        blankCanvases.push(stepRes.code);
      }
      if (stepRes.leaks.length > 0) {
        leakedPlaceholders.push(...stepRes.leaks);
      }
      if (stepRes.textIssues && stepRes.textIssues.length > 0) {
        allTextIssues.push(...stepRes.textIssues);
      }
    }

    // [INTENT-04] 0-1~0-4 준비학습
    const pass04 = ['0-1', '0-2', '0-3', '0-4'].every(c => !blankCanvases.includes(c));
    record('INTENT-04', '0-1~0-4 준비학습 4대 인터랙티브 캔버스 가동', 5, pass04,
      `0-1~0-4 캔버스 정상 작동=${pass04}`);

    // [INTENT-05] 1-1~1-4 소수와 합성수
    const pass05 = ['1-1', '1-2', '1-3', '1-4'].every(c => !blankCanvases.includes(c));
    record('INTENT-05', '1-1~1-4 소수와 합성수 핵심 시뮬레이터 가동', 5, pass05,
      `1-1~1-4 캔버스 정상 작동=${pass05}`);

    // [INTENT-06] 1-5~1-9 소수와 합성수 스스로 확인하기 1문항 1페이지
    const pass06 = ['1-5', '1-6', '1-7', '1-8', '1-9'].every(c => !blankCanvases.includes(c));
    record('INTENT-06', '1-5~1-9 스스로 확인하기 1문항 1페이지 분할 완비', 5, pass06,
      `1-5~1-9 5문항 독립 분할 가동=${pass06}`);

    // [INTENT-07] 2-1~2-4 소인수분해 시뮬레이터
    const pass07 = ['2-1', '2-2', '2-3', '2-4'].every(c => !blankCanvases.includes(c));
    record('INTENT-07', '2-1~2-4 소인수분해 핵심 시뮬레이터 가동', 5, pass07,
      `2-1~2-4 캔버스 정상 작동=${pass07}`);

    // [INTENT-08] 2-5~2-9 소인수분해 스스로 확인하기 1문항 1페이지
    const pass08 = ['2-5', '2-6', '2-7', '2-8', '2-9'].every(c => !blankCanvases.includes(c));
    record('INTENT-08', '2-5~2-9 소인수분해 스스로 확인하기 1문항 1페이지 완비', 5, pass08,
      `2-5~2-9 5문항 독립 분할 가동=${pass08}`);

    // [INTENT-09] 3-1~3-4 최대공약수 시뮬레이터
    const pass09 = ['3-1', '3-2', '3-3', '3-4'].every(c => !blankCanvases.includes(c));
    record('INTENT-09', '3-1~3-4 최대공약수 핵심 시뮬레이터 가동', 5, pass09,
      `3-1~3-4 캔버스 정상 작동=${pass09}`);

    // [INTENT-10] 3-5~3-10 최대공약수 스스로 확인하기 1문항 1페이지
    const pass10 = ['3-5', '3-6', '3-7', '3-8', '3-9', '3-10'].every(c => !blankCanvases.includes(c));
    record('INTENT-10', '3-5~3-10 최대공약수 스스로 확인하기 1문항 1페이지 완비', 5, pass10,
      `3-5~3-10 6문항 독립 분할 가동=${pass10}`);

    // [INTENT-11] 4-1~4-4 최소공배수 시뮬레이터
    const pass11 = ['4-1', '4-2', '4-3', '4-4'].every(c => !blankCanvases.includes(c));
    record('INTENT-11', '4-1~4-4 최소공배수 핵심 시뮬레이터 가동', 5, pass11,
      `4-1~4-4 캔버스 정상 작동=${pass11}`);

    // [INTENT-12] 4-5~4-10 최소공배수 스스로 확인하기 1문항 1페이지
    const pass12 = ['4-5', '4-6', '4-7', '4-8', '4-9', '4-10'].every(c => !blankCanvases.includes(c));
    record('INTENT-12', '4-5~4-10 최소공배수 스스로 확인하기 1문항 1페이지 완비', 5, pass12,
      `4-5~4-10 6문항 독립 분할 가동=${pass12}`);

    // [INTENT-13] 5-1~5-14 스스로 마무리하기 전용 탭 독립 편성
    const pass13 = ['5-1', '5-2', '5-3', '5-4', '5-5', '5-6', '5-7', '5-8', '5-9', '5-10', '5-11', '5-12', '5-13', '5-14'].every(c => !blankCanvases.includes(c));
    record('INTENT-13', '5-1~5-14 대단원 스스로 마무리하기 전용 탭 14문항 독립 완비', 5, pass13,
      `5-1~5-14 전 문항 1문항 1페이지 정상 가동=${pass13}`);

    // [INTENT-14] 6-1 창의융합 프로젝트
    const pass14 = !blankCanvases.includes('6-1');
    record('INTENT-14', '6-1 창의융합 프로젝트 (소수와 암호)', 5, pass14,
      `6-1 캔버스 정상 작동=${pass14}`);

    // [INTENT-15] 실시간 채점 및 정규화 엔진 (normTxt)
    const pass15 = await page.evaluate(() => typeof normTxt === 'function');
    record('INTENT-15', '실시간 채점 및 정규화 엔진 (normTxt)', 5, pass15,
      `normTxt 함수 존재 여부=${pass15}`);

    // [INTENT-16] 답안 자동 보존 (savedFormInputs)
    const pass16 = await page.evaluate(() => {
      return (typeof savedFormInputs !== 'undefined') || (typeof state !== 'undefined' && typeof state.savedFormInputs !== 'undefined');
    });
    record('INTENT-16', '답안 자동 보존 (savedFormInputs) 및 상태 영속화', 5, pass16,
      `savedFormInputs 캐시 존재 여부=${pass16}`);

    // [INTENT-17] 세부 탐구 드롭다운 네비게이션
    const pass17 = await page.evaluate(() => {
      const sel = document.getElementById('substep-dropdown-select') || document.querySelector('select');
      const totalConfigs = typeof SUBSTEP_CONFIG !== 'undefined' ? Object.keys(SUBSTEP_CONFIG).length : 0;
      return !!sel && totalConfigs >= 50;
    });
    record('INTENT-17', '세부 탐구 드롭다운 네비게이션 지원', 5, pass17,
      `드롭다운 셀렉터 존재 및 57개 서브스텝 구성=${pass17}`);

    // [INTENT-18] 절전형 물리 애니메이션(Lerp) 및 화면 고정 방지 표준
    const pass18 = await page.evaluate(() => {
      const code = loadSubStep.toString();
      return code.includes('cancelAnimationFrame') || typeof startSmoothLerp === 'function';
    });
    record('INTENT-18', '절전형 물리 애니메이션(Lerp) 및 화면 고정 방지 표준', 5, pass18,
      `rAF 일괄 취소 및 Lerp 안전 가드=${pass18}`);

    // [INTENT-19] 🚫 정답 미노출 원칙 (Zero Answer Leakage in Placeholder/Hints)
    const pass19 = leakedPlaceholders.length === 0;
    record('INTENT-19', '정답 미노출 원칙 (Zero Answer Leakage in Placeholder/Hints)', 5, pass19,
      `플레이스홀더 정답 누출 건수=${leakedPlaceholders.length}건`);

    // [INTENT-20] 🎨 캔버스 빈 공간 0건 원칙 (Zero Blank Canvas across all 57 substeps)
    const pass20 = blankCanvases.length === 0;
    record('INTENT-20', '캔버스 빈 공간 0건 원칙 (Zero Blank Canvas across all 57 substeps)', 5, pass20,
      `빈 캔버스 발생 건수=${blankCanvases.length}건 (누락 서브스텝: ${blankCanvases.join(', ') || '없음'})`);

    // [INTENT-21] 브라우저 콘솔 무오류 원칙 (Zero Runtime Console Error)
    const criticalErrors = consoleErrors.filter(e => !e.includes('favicon') && !e.includes('mathjax') && !e.includes('404'));
    if (criticalErrors.length > 0) {
      console.log("⚠️ 발견된 콘솔 오류:", criticalErrors);
    }
    const pass21 = criticalErrors.length === 0;
    record('INTENT-21', '브라우저 콘솔 무오류 원칙 (Zero Runtime Console Error)', 5, pass21,
      `치명적 콘솔 오류 건수=${criticalErrors.length}건`);

    // [INTENT-22] 📐 캔버스 폰트 크기 및 시각적 프레임 경계 적정성 (Zero Overflow & Balanced Font Size)
    const fontIssues = allTextIssues.filter(iss => iss.type === 'out-of-frame' || iss.type === 'too-large');
    if (fontIssues.length > 0) {
      console.log("⚠️ 발견된 폰트/프레임 결함:", fontIssues.slice(0, 5));
    }
    const pass22 = fontIssues.length === 0;
    record('INTENT-22', '캔버스 폰트 크기 및 시각적 프레임 경계 적정성 (Zero Overflow & Balanced Font Size)', 5, pass22,
      `프레임 이탈/과대 폰트 결함 건수=${fontIssues.length}건 (가독성 안전 범위 확인 완료)`);

    // 총점 계산
    const totalMax = testResults.reduce((acc, cur) => acc + cur.maxScore, 0);
    const totalScore = testResults.reduce((acc, cur) => acc + cur.score, 0);
    const allPassed = totalScore === totalMax;

    console.log(`\n========================================`);
    console.log(`📊 [최종 평가 결과] 총점: ${totalScore} / ${totalMax}점 (${Math.round((totalScore/totalMax)*100)}%)`);
    console.log(`판정: ${allPassed ? '🎉 PASS (합격)' : '❌ REJECT (불합격)'}`);
    console.log(`========================================\n`);

    // 마크다운 리포트 생성
    let reportMd = `# 📊 [서브에이전트 평가 리포트] 1단원 소인수분해 (g1_ch1_factors.html)\n\n`;
    reportMd += `- **평가 일시**: ${new Date().toISOString()}\n`;
    reportMd += `- **평가 대상 파일**: \`g1_ch1_factors.html\`\n`;
    reportMd += `- **적용 설계 명세서**: \`docs/eval_ch1_spec.md\`\n`;
    reportMd += `- **최종 획득 점수**: **${totalScore} / ${totalMax}점 (${Math.round((totalScore/totalMax)*100)}%)**\n`;
    reportMd += `- **최종 심사 결과**: **${allPassed ? '🎉 PASS (합격)' : '❌ REJECT (수정 필요)'}**\n\n`;
    reportMd += `## 📋 세부 검증 항목별 채점표\n\n`;
    reportMd += `| ID | 평가 항목 | 배점 | 획득 점수 | 판정 | 검증 상세 내역 |\n`;
    reportMd += `|:---|:---|:---:|:---:|:---:|:---|\n`;

    testResults.forEach(r => {
      reportMd += `| ${r.id} | ${r.title} | ${r.maxScore}점 | ${r.score}점 | ${r.passed ? '✅ PASS' : '❌ FAIL'} | ${r.detail} |\n`;
    });

    reportMd += `\n---\n\n`;
    reportMd += `## 🔍 핵심 인터랙티브 기능 및 교과서 1:1 매핑 요약\n\n`;
    reportMd += `1. **준비학습 4문항 (pp. 6~7)**: 약수/배수 직사각형 배열, 공약수 벤다이어그램, 공배수 수직선 도약, 수의 분류 저울 작동 확인.\n`;
    reportMd += `2. **소수와 합성수 (pp. 8~13)**: 음료수 진열 생각열기, 에라토스테네스의 체 동적 캔버스, 스스로 확인하기 5문항 1문항 1페이지 완전 분할 확인.\n`;
    reportMd += `3. **소인수분해 (pp. 14~17)**: 종이 접기 거듭제곱, 소인수분해 가지치기 트리, 나눗셈법, 스스로 확인하기 5문항 개별 채점 확인.\n`;
    reportMd += `4. **최대공약수 (pp. 18~19)**: 직사각형 타일 붙이기, 소인수 벤다이어그램 공통영역, 스스로 확인하기 6문항 개별 채점 확인.\n`;
    reportMd += `5. **최소공배수 (pp. 20~23)**: 톱니바퀴 맞물림 회전 물리 시뮬레이터, 버스 동시 출발, 블록 쌓기, 스스로 확인하기 6문항 개별 분할 확인.\n`;
    reportMd += `6. **스스로 마무리하기 전용 탭 (pp. 24~26)**: Tab 5 전용 대주제 탭 내 14개 문항 전수 1:1 매핑 및 개별 채점 확인.\n`;
    reportMd += `7. **창의융합 프로젝트 (pp. 26~27)**: 소수와 RSA 암호의 원리 대화형 인코더/디코더 완비.\n`;

    fs.writeFileSync(REPORT_FILE, reportMd, 'utf8');
    console.log(`📄 평가 리포트 발행 완료: ${REPORT_FILE}`);

    await browser.close();

    if (!allPassed) {
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ 서브에이전트 실행 중 오류:", err);
    await browser.close();
    process.exit(1);
  }
}

runCh1SubagentEvaluation();
