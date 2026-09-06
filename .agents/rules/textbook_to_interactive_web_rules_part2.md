# 📘 교과서 기반 인터랙티브 수학 웹 애플리케이션 제작 규칙 (Part 2)
## 상태 관리, 물리 애니메이션, 품질 검증 및 문항 구조
(Textbook-to-Interactive Math Web App Generation Rules - Part 2)

본 문서는 **중1 수학(좌표평면과 그래프: `g1_coordinate.html`)** 구현 사례를 바탕으로, 교과서 지면(이미지, 텍스트, 단원 내용)이 주어졌을 때 **영서중학교 디지털 수학 인터랙티브 웹 앱으로 자동 변환·개발하기 위한 핵심 아키텍처 및 상세 제작 표준(Part 2)**입니다.

> 🔗 **연계 문서 안내**:
> - [Part 1: 핵심 철학 및 캔버스·빈칸 설계](file:///home/ubuntu/workspace/Redbook/.agents/rules/textbook_to_interactive_web_rules_part1.md)
> - [기본 개발 표준 가이드라인](file:///home/ubuntu/workspace/Redbook/.agents/rules/math_webpage_guidelines.md)

---

## 5. ⚙️ 데이터 상태 관리 및 영속화 규칙 (State & LMS)

### 5.1 전역 State 스키마
```javascript
const state = {
  studentId: '10101',
  studentName: '학생',
  isTeacherLoggedIn: false,
  currentMainTab: 0,
  subStep: '1-1',
  tool: 'select',
  unlockedTabs: [0],
  unlockedSubSteps: ['0-1'],
  completedSubSteps: [],
  pointP: { x: 3, y: 2, label: 'P' },
  savedFormInputs: {},          // 단계별 작성 중인 인풋 값 자동 저장 캐시
  verifiedViewData: {}          // 완료된 단계의 정답 화면 캐시
};
```

### 5.2 답안 자동 저장 및 복원
- 학생이 다른 탭을 둘러보고 돌아왔을 때 입력했던 텍스트나 조작 상태가 초기화되지 않도록 `saveCurrentFormInputs()` 및 `restoreFormInputs()`를 필수 탑재.
- 실시간 타이핑 중 1초 디바운스로 LMS에 학습 진행률 동기화 (`attachRealtimeInputTracker()`).

### 5.3 교사 관리자 모드
- **마스터 패스워드**: `260523`, `260831`
- 교사 모드 진입 시:
  - 5x5 관제실 실시간 대시보드 (`render5x5StudentGridG1`).
  - [🔓 학생 해금 범위 설정]: 학생들의 진도 상한선을 교사가 원격 제어.
  - [🔑 교사 패스 (Pass)]: 수업 시연 중 즉시 다음 단계 강제 통과.

---

## 6. 🧩 교과서 요소를 웹 인터랙션으로 변환하는 8대 핵심 디자인 패턴

모든 단원(1, 2, 3, 5, 6, 7, 8단원) 개발 시 교과서 4단원(`g1_coordinate.html`) 벤치마크에서 확립된 다음 **8대 변환 공식**을 기계적으로 적용합니다:

```
[패턴 1] 정적 삽화/다이어그램 ───> Two.js 벡터 애니메이션 및 기하 렌더러
[패턴 2] 본문 개념 설명 ─────────> 실시간 드래그 & 스마트 자석 스냅 인터랙터
[패턴 3] 좌표/위치 찾기 문항 ────> 다중 점 목표 배치 미션 & 실시간 상태 뱃지
[패턴 4] 보조선/작도형 문항 ─────> 투명 펜 드로잉 오버레이 레이어
[패턴 5] 개념 정의 및 수식 ─────> 인라인 괄호 빈칸 (.proof-input-text) & KaTeX
[패턴 6] 오개념/주의사항 ────────> 스포일러 방지형 [주의 / 핵심 팁] 카드
[패턴 7] 제출 및 정답 확인 ─────> 폭죽(Confetti) + 음향 + 해설 요약 카드 전환
[패턴 8] 교과서 흐름/페이지 ─────> 상단 대단원 탭 + 하단 서브스텝 필(Pills)
```

1. **패턴 1 (정적 삽화 $\rightarrow$ Two.js 동적 캔버스)**: 교과서의 그림을 캡처하지 않고 순수 Two.js 코드로 직접 그려 Retina 해상도와 동적 애니메이션 지원.
2. **패턴 2 (본문 개념 $\rightarrow$ 실시간 드래그 & 스마트 자석 스냅)**: 수학적 대상을 잡고 움직이며 변화를 체득. 격자 정수 단위 자동 반올림 스냅(`Math.round((mx - cx) / step)`) 적용.
3. **패턴 3 (좌표/위치 찾기 $\rightarrow$ 다중 점 목표 배치 미션)**: 목표 위치로 점/객체를 옮기면 실시간 뱃지(`완료!`)로 게이미피케이션 피드백.
4. **패턴 4 (보조선/작도 $\rightarrow$ 투명 펜 드로잉 오버레이)**: Two.js 위에 투명 캔버스 레이어를 얹어 태블릿 펜이나 마우스로 보조선 긋기 및 지우기 지원.
5. **패턴 5 (개념/수식 $\rightarrow$ 인라인 괄호 빈칸 & KaTeX)**: 문맥 속 `.proof-input-text` 빈칸과 `normTxt` 정규화 채점으로 공백/기호 유연 처리.
6. **패턴 6 (오개념/주의 $\rightarrow$ 스포일러 방지 팁 카드)**: placeholder나 힌트에 정답을 직접 노출하지 않고 입력 형식만 안내 (Zero Answer Leakage).
7. **패턴 7 (제출 $\rightarrow$ 축하 및 해설 카드 전환)**: 정답 시 경쾌한 사운드 + 색종이 폭죽(`launchConfetti()`) + 깔끔한 정답 해설 카드(`.verified-answer-card`) 전환.
8. **패턴 8 (교과서 위계 $\rightarrow$ 잠금 해금 내비게이션)**: 이전 단계를 완료해야 다음 서브스텝이 열리는 빗장 구조(`🔒`)와 교사 마스터 키(`260523`, `260831`).

---

## 7. ⚡ 프레임 기반 물리 애니메이션 및 화면 고정 방지 표준 규격

시뮬레이터 조작 후 서브스텝 전환 시 화면이 멈추거나 캔버스가 이전 단계로 강제 고정되는 현상을 원천 차단하기 위해 다음 표준을 엄격히 적용합니다:

### 7.1 `startSmoothLerp` 수렴 안전 가드
- 매 프레임 `getter()`를 재호출하지 않고 내부 부동소수점 변수(`currentFloat`)를 유지하여 지수 감속을 계산합니다.
- 변화량이 임계치 미만일 때 최종 목표값(`targetVal`)으로 즉시 강제 안착하고 `requestAnimationFrame`을 완전히 종료합니다:
```javascript
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
```

### 7.2 `loadSubStep` 진입 시 잔류 애니메이션 전량 정리
서브스텝을 변경할 때 실행 중인 모든 애니메이션 루프를 즉시 취소하여 새 페이지 캔버스 오염을 방지합니다:
```javascript
if (typeof activeLerpAnimations !== 'undefined') {
  for (const k in activeLerpAnimations) {
    if (activeLerpAnimations[k]) {
      cancelAnimationFrame(activeLerpAnimations[k]);
      delete activeLerpAnimations[k];
    }
  }
}
```

### 7.3 시뮬레이터 콜백 내 현재 서브스텝 가드
- 시뮬레이터 컨트롤러 콜백에서 `state.subStep === expectedCode`를 확인하여, 다른 화면에 있을 때 이전 시뮬레이터 캔버스가 다시 그려지는 것을 방지합니다.

---

## 8. 🤖 서브에이전트 검증 규칙 및 8대 무조건 반려(REJECT) 원칙

서브에이전트가 단원 페이지를 자동 평가할 때 다음 8대 필수 탈락 기준 중 **단 하나라도 위반하면 전체 완성도 점수와 무관하게 즉시 반려(`REJECT`)**합니다:

1. **[REJECT-01] 학생 로그인 실패**:
   - 학번 `10101`, 이름 입력 후 활동 뷰로 정상 전환되지 않거나 `0-1` 서브스텝이 열리지 않을 때.
2. **[REJECT-02] 교사 마스터 비밀번호(260523, 260831) 인증 실패**:
   - `student-id`에 `260523` 또는 `260831` 입력 시 즉시 전체 해금 프리패스 실패 시.
   - `🔑 교사 계정 접속` 버튼 클릭 시 `#secure-password-modal`이 출현하지 않거나, 모달에서 `260523` 또는 `260831` 입력 후 관리자 모드 진입에 실패할 때.
3. **[REJECT-03] 정답 미노출 원칙 위반 (Zero Answer Leakage)**:
   - 모든 `.proof-input-text`의 `placeholder`, 주변 안내문구, 레이블 등에 해당 문제의 **실제 채점 정답(숫자, 수식, 텍스트)이 직접 노출**되었을 때.
4. **[REJECT-04] 좌측 캔버스 비어있음(Blank Canvas)**:
   - 특정 서브스텝에서 좌측 캔버스 드로잉 함수가 누락되었거나 런타임 오류가 발생하여 빈 화면으로 방치될 때.
5. **[REJECT-05] 화면 고정 버그 (Screen Freeze) 및 잔류 애니메이션**:
   - 시뮬레이터 버튼 조작 후 다른 서브스텝으로 이동 시 좌측 캔버스가 전환되지 않고 이전 시뮬레이터 화면으로 고정될 때.
   - `loadSubStep`에 `activeLerpAnimations` 취소 로직이 누락되었을 때.
6. **[REJECT-06] 소단원 '스스로 확인하기' 1문항 1페이지 원칙 위반**:
   - 각 소단원 말미의 '스스로 확인하기'에 수록된 문항들을 한 페이지에 다수 합산하여 작성하고 1문제당 1페이지로 독립 분할하지 않았을 때.
7. **[REJECT-07] 대단원 '스스로 마무리하기' 전용 대주제 탭 미분리 및 1문항 1페이지 원칙 위반**:
   - 대단원 권말의 '스스로 마무리하기'가 별도의 독립 대주제 탭으로 분리되지 않고 타 소단원/프로젝트와 혼합되었거나, 수록 문항이 문제 1개당 1페이지로 분할되지 않았을 때.
8. **[REJECT-08] 기준 페이지(g1_coordinate.html) 대비 질적 완성도 미달**:
   - Two.js 동적 그래픽, KaTeX 수식 렌더링, 4대 모달, 5x5 관제 대시보드, normTxt 채점 UX, 5종 사운드 등 기준 규격 대비 달성률이 90% 미만일 때.
9. **[REJECT-09] 가짜 텍스트 카드 캔버스(`renderProblemSupportCanvas`) 날림 처리 및 실질적 조작성 결여**:
   - 사각형 박스에 텍스트 몇 줄 띄우고 "자유 펜 풀이 영역"이라며 서브스텝을 날림 처리하는 껍데기 캔버스 구현이 단 1건이라도 발견될 때.
   - 마우스/터치 조작(드래그, 클릭 플로팅, 슬라이더 조작, 동적 애니메이션, 물리 시뮬레이션) 없이 정적 메모장으로 방치된 서브스텝이 존재할 때.
10. **[REJECT-10] 캔버스 폰트 비대화 및 프레임 경계 침범(Overflow)**:
   - 캔버스 폰트 크기 가로채기 배율이 1.15배를 초과하거나 최소 크기를 14px 이상으로 강제하여 작은 셀/박스에서 텍스트가 삐져나올 때.
   - 텍스트나 그래픽 요소가 캔버스 뷰포트 또는 컴포넌트 프레임 경계를 침범(Overflow)하거나 잘리는 현상이 감지될 때.

---

## 9. 📋 타 단원 개발 지시 및 검증 13대 체크리스트

1. [ ] **지면 분할 무손실성**: 교과서 지면의 생각열기, 개념정리, 문제, 스스로 확인하기, 생각넓히기가 빠짐없이 1:1 서브스텝으로 분할 매핑되었는가?
2. [ ] **소단원 '스스로 확인하기' 1문항 1페이지**: 소단원별 스스로 확인하기의 모든 문항이 문항당 1개의 독립 서브스텝(Two.js 시뮬레이터+폼)으로 분할되었는가?
3. [ ] **대단원 '스스로 마무리하기' 전용 탭 독립**: 권말 스스로 마무리하기가 타 단원과 섞이지 않고 별도 대주제 탭으로 단독 편성되었는가?
4. [ ] **대단원 '스스로 마무리하기' 1문항 1페이지**: 스스로 마무리하기의 전 문항(기본, 표준, 발전/서술형)이 문제 1개당 1페이지(1 서브스텝)로 완전 분할되었는가?
5. [ ] **가짜 텍스트 카드 캔버스 0건**: `renderProblemSupportCanvas`와 같은 껍데기 텍스트 박스/메모장 캔버스가 전무하고, 모든 서브스텝에 고유한 실시간 조작 인터랙터가 작동하는가?
6. [ ] **동적 조작성(Interactivity & Action-Reaction)**: 정적인 그림 감상이 아니라, 학생이 슬라이더, 드래그, 클릭 플로팅 조작 시 화면과 상태가 즉시 반응하는가?
7. [ ] **폰트 크기 및 프레임 안전성**: 폰트가 과도하게 비대하지 않고(1.08~1.12배 기준), 캔버스 뷰포트 및 셀/박스 경계를 벗어나는 텍스트/도형이 0건인가?
8. [ ] **수식 KaTeX 표준화**: 모든 수학 기호, 변수, 수식에 `$x$`, `$\overline{AB}$`, `$y=ax$` 등의 LaTeX 문법이 적용되었는가?
9. [ ] **정답 미노출 원칙(Zero Answer Leakage)**: 모든 인풋의 `placeholder`에 실제 정답이 누출되지 않았는가?
10. [ ] **부드러운 애니메이션 수렴**: `startSmoothLerp`를 사용할 때 부동소수점 추적(`currentFloat`)과 임계 스냅 조건이 적용되어 무한 루프가 발생하지 않는가?
11. [ ] **페이지 이동 시 애니메이션 취소**: `loadSubStep` 진입 시 `activeLerpAnimations`를 일괄 취소하여 화면 고정 버그를 예방하였는가?
12. [ ] **2대 교사 마스터 비밀번호 지원**: `260523` 및 `260831` 프리패스 및 모달이 정상 작동하는가?
13. [ ] **작업 즉시 Git 원격 동기화**: 작업 완료 즉시 `git add`, `git commit`, `git push origin main`이 수행되었는가?

---

## 10. 📝 소단원 '스스로 확인하기' 1문항 1페이지 상세 표준 (1 Question = 1 Substep)
1. **분할 원칙**: 교과서 각 소단원 말미에 배치된 '스스로 확인하기'(보통 4~6문항 구성)는 절대로 한 화면에 2개 이상의 문항을 병합하지 않습니다.
2. **독립된 UX**: 각 문항마다 번호(`[1.1 확인 1]`, `[1.1 확인 2]` 등)를 명시하고, 좌측에는 해당 문항의 수학적 시각화/인터랙티브 캔버스를, 우측에는 해당 문항 전용 입력폼 및 채점 피드백을 배치합니다.
3. **독립 채점 및 해설 카드**: 각 문항 제출 시 개별 유효성 검사, Confetti 축하, 그리고 해당 문항 전용 정답 해설 카드로 전환되어야 합니다.

---

## 11. 🏆 대단원 '스스로 마무리하기' 전용 탭 편성 및 1문항 1페이지 상세 표준
1. **대주제 탭 분리**: 대단원 권말의 '스스로 마무리하기'(통상 10~15문항)는 본문 소단원 탭(예: 1~4단원)과 완전히 분리된 **별도의 대주제 탭(예: Tab 5. 스스로 마무리하기)**으로 단독 개설합니다.
2. **전 문항 1문항 1페이지 완전 매핑**: 기본 문제, 표준 문제, 발전/서술형 문제를 가리지 않고 교과서의 문항 번호(01번~14번 등)를 1:1로 서브스텝(`5-1` ~ `5-14`)에 배정합니다.
3. **창의융합 프로젝트 별도 탭 분리**: 스스로 마무리하기 뒤에 이어지는 교과서 '창의융합 프로젝트'는 스스로 마무리하기 탭에 합치지 않고, 별도의 후속 탭(예: Tab 6. 창의융합 프로젝트)으로 분리 구성합니다.
