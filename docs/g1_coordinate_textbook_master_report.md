# 📘 중1 수학 교과서 대비 `g1_coordinate` 반영 분석 및 표준 개발 규격서
> **부제**: 교과서 지면을 100% 디지털 인터랙티브 웹 앱으로 변환한 설계 메커니즘, UI/UX 프레임 구조, 학생 로그인 및 DB 동기화 아키텍처, 타 단원 제작을 위한 마스터 템플릿 가이드

---

## 1. 🧭 개요 및 목적

본 보고서는 **[YBM] 중등 수학 1 교사용 교과서(4단원 좌표평면과 그래프, 104~129쪽)**와 이를 완벽하게 웹 애플리케이션으로 구현한 **`g1_coordinate.html`**을 정밀 대조 분석한 표준 설계 문서입니다.

향후 제작될 중1 다른 단원(1단원 소인수분해, 2단원 정수와 유리수, 3단원 문자와 일차방정식, 5단원 기본 도형, 6단원 평면도형, 7단원 입체도형, 8단원 통계 등)을 제작할 때 **동일한 프레임워크, 동일한 로그인/DB 엔진, 동일한 캔버스-폼 인터랙션 규격을 100% 재사용**할 수 있도록 모든 설계 요소와 코드 패턴을 체계화하였습니다.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             [YBM] 중1 교사용 교과서 지면                         │
│     생각열기(도입) ───> 본문 개념 및 기호 ───> 확인 문제 ───> 스스로 확인하기/생각넓히기 │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │ 1:1 디지털 트윈(Digital Twin) 변환
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                   Redbook 표준 디지털 수학 인터랙티브 웹 앱 (`g1_coordinate`)        │
├──────────────────────────────────────────────────────────────────────────────────┤
│ [상단] 앱 헤더 (학습자 프로필 / 교사 마스터 뱃지) & 중단원 탭바 & 세부 서브스텝 필(Pills)│
├────────────────────────────────────────┬─────────────────────────────────────────┤
│    [좌측] 60fps 인터랙티브 캔버스 (50%)    │      [우측] 대화형 탐구 워크 폼 (50%)     │
│  • Two.js 벡터 그래픽 동적 렌더링       │  • 🎯 오늘의 수학 탐구 미션 배너 (KaTeX)  │
│  • 마우스/터치 점 드래그 & 자석 스냅   │  • 문맥형 인라인 빈칸 (.proof-input)    │
│  • 실시간 물리 시뮬레이터 (물병, 회전 등)│  • 텍스트 정규화 실시간 채점 (normTxt)   │
│  • 투명 펜 드로잉 오버레이 레이어        │  • 정답 해설 카드 전환 + Confetti 폭죽   │
├────────────────────────────────────────┴─────────────────────────────────────────┤
│ [백엔드] 4계층 실시간 동기화 (Supabase + Cloud DB + Monday LMS Bridge + LocalCache) │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 📖 교과서 지면 ➔ 웹 인터랙션 반영 메커니즘

`g1_coordinate`는 교과서 지면을 단순히 스캔하거나 텍스트를 옮겨 적는 방식을 철저히 배제하고, **학생이 직접 조작하며 개념을 발견하는 8대 변환 패턴**을 적용했습니다:

### 2.1 8대 핵심 변환 공식

| 교과서 지면 요소 | `g1_coordinate` 디지털 변환 방식 | 기술 구현체 | 교육적 기대 효과 |
| :--- | :--- | :--- | :--- |
| **정적 삽화 및 다이어그램** | 해상도 무손실 벡터 그래픽 애니메이션 | `Two.js` 2D 엔진 | 고해상도 태블릿/스마트폰 환경에서도 픽셀 깨짐 없는 선명한 시각화 |
| **본문 개념 설명** | 실시간 점 드래그 및 자석 스냅 | `drawDraggablePoint` (Two.js) | 개념을 '읽는' 것이 아닌 점을 직접 끌어보며 수치 변화를 '체험' |
| **점 찍기 및 좌표 표현** | 캔버스 모눈 클릭 토글 (Plotting) | `drawGraphPointsCanvas` | 클릭 시 즉시 점이 찍히고 좌표 라벨이 뜨는 능동적 조작 |
| **다양한 실생활 상황** | 16종 독립 실시간 물리/상황 시뮬레이터 | 대관람차, 물병, 풀장 시뮬레이터 | 실생활 현상과 꺾은선/곡선 그래프의 관계를 직관화 |
| **보조선/작도형 문항** | 투명 펜 드로잉 오버레이 레이어 | `<canvas id="freehand-drawing">` | 화면 위에 직접 손글씨/보조선을 긋고 지울 수 있는 필기 환경 제공 |
| **개념 확인 및 서술형 문장** | 문맥형 인라인 빈칸 + KaTeX 수식 | `<input class="proof-input-text">` | 문맥의 흐름 속에서 자연스럽게 핵심 용어 및 좌표를 입력 |
| **정답 및 오답 판정** | 정규화 채점 + 즉각적 피드백 카드 | `normTxt()`, Confetti 사운드 | 띄어쓰기/어미 차이로 인한 억울한 오답 방지, 즉시 성취감 부여 |
| **단계별 학습 흐름** | 탭별 해금 잠금 장치 (`🔒` ➔ `🔓`) | `unlockNextStep(tabIndex)` | 선수 단계 미통과 시 다음 단계 접근을 차단하여 학습 결손 예방 |

### 2.2 스포일러 방지 원칙 (Zero Answer Leakage)
* 교과서 지면에 쓰여 있는 사분면 부호($(+, +), (-, +)$ 등)나 정답을 캔버스나 플레이스홀더에 미리 적어두지 않습니다.
* `placeholder="좌표 기호 입력"`, `placeholder="수 입력"`처럼 **입력 형식만 안내**하고 학생이 직접 탐구하여 도출하도록 유도합니다.

---

## 3. 🖥️ 전체적인 UI/UX 프레임 아키텍처

`g1_coordinate.html`은 전체 화면을 효율적으로 분할한 **3-Tier 레이아웃**과 **3개의 독립 뷰(View Panel)**로 구성되어 있습니다.

### 3.1 화면 계층 구조

```html
<body>
  <!-- Tier 1: 상단 헤더 (높이: 48px) -->
  <header class="app-header">
    <div class="logo-group">...</div>
    <div class="user-meta-group">
      <span id="current-user-info">👤 로그인 필요</span>
      <button onclick="openTeacherAdminModal()">⚙️ 교사 관리</button>
    </div>
  </header>

  <!-- Tier 2-A: 중단원 대단원 탭바 (높이: 42px) -->
  <nav class="tab-bar-container">
    <button class="tab-btn active" data-tab="0">0. 되짚어보기</button>
    <button class="tab-btn locked" data-tab="1">🔒 1. 순서쌍과 좌표</button>
    <button class="tab-btn locked" data-tab="2">🔒 2. 사분면</button>
    <button class="tab-btn locked" data-tab="3">🔒 3. 그래프와 해석</button>
    <button class="tab-btn locked" data-tab="4">🔒 4. 정비례</button>
    <button class="tab-btn locked" data-tab="5">🔒 5. 반비례</button>
  </nav>

  <!-- Tier 2-B: 세부 서브스텝 필바 (높이: 36px) -->
  <div class="substep-bar">
    <span>📑 세부 탐구 활동:</span>
    <div id="substep-pills-container">
      <span class="substep-pill active">0-1. 대응 관계</span>
      <span class="substep-pill locked-pill">🔒 0-2. 수직선</span>
      <span class="substep-pill locked-pill">🔒 0-3. 식의 값</span>
    </div>
  </div>

  <!-- Tier 3: 메인 뷰 컨테이너 (남은 높이 100vh - 126px) -->
  <main class="main-container">
    <!-- VIEW 1: 학생 로그인 화면 -->
    <section id="view-login" class="view-panel active">...</section>

    <!-- VIEW 2: 본 활동 50:50 분할 탐구 화면 -->
    <section id="view-activity" class="view-panel">
      <!-- 좌측 50%: 60fps Two.js 벡터 그래픽 캔버스 -->
      <div class="plane-section">
        <div class="plane-toolbar">...</div>
        <div class="two-plane-wrapper">
          <div id="two-container"></div>
          <canvas id="freehand-drawing-canvas"></canvas>
        </div>
      </div>
      <!-- 우측 50%: 미션 배너 & 인라인 입력 폼 워크에어리어 -->
      <div class="sidebar-section">
        <div class="mission-card">...</div>
        <div id="form-work-area">...</div>
      </div>
    </section>

    <!-- VIEW 3: 교사용 실시간 5x5 모니터링 관제실 -->
    <section id="view-teacher-dashboard" class="view-panel">...</section>
  </main>
</body>
```

---

## 4. 🔐 학생 로그인 및 인증 메커니즘

`g1_coordinate`는 학교 현장의 다양한 네트워크 환경과 수업 상황을 고려하여 **4중 하이브리드 인증 시스템**을 탑재하고 있습니다:

```
                  ┌─────────────────────────────────────┐
                  │          학생 로그인 요청           │
                  │       (학번 5자리 + 비밀번호)       │
                  └──────────────────┬──────────────────┘
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           ▼                         ▼                         ▼
   [루트 1: 교사 마스터]       [루트 2: Iframe LMS]        [루트 3: Supabase DB]
   비밀번호: 260523 / 260831   상위 Monday LMS 창 연동     'students' 테이블 조회
   ➔ 즉시 관리자 권한 승격    ➔ postMessage 자동 로그인    ➔ 학번/비밀번호 매칭
   ➔ 전 페이지 원클릭 해금    ➔ 별도 입력 없이 직행       ➔ 진도율 실시간 복원
           │                         │                         │
           └─────────────────────────┼─────────────────────────┘
                                     ▼
                  ┌─────────────────────────────────────┐
                  │    세션 상태 저장 및 활동 뷰 전환   │
                  │ • state.currentUser 설정            │
                  │ • localStorage 로컬 캐시 영속화     │
                  │ • switchView('activity') ➔ 활동 시작│
                  └─────────────────────────────────────┘
```

1. **영서중 수학 LMS Supabase DB 인증 (Primary)**:
   * `students` 테이블에서 학생 학번(`id`)을 조회하여 암호화/비밀번호 일치 확인.
   * 인증 성공 시 학생의 학년(`grade: 1`), 반(`class_num`), 이름(`name`) 객체 반환.
2. **교사 마스터 바이패스 (Teacher Override)**:
   * 마스터 패스워드(`260523`, `260831`): 교사가 입력 시 즉시 관리자 권한을 획득하며 모든 잠금을 해제하고 관제실로 직행.
3. **상위 LMS Iframe 무입력 자동 인증 (Seamless Single Sign-On)**:
   * 학생이 Monday LMS(`curlymath.vercel.app`)에서 본 웹 앱을 열면, 상위 창에서 `MATH_LMS_INIT_STUDENT` 메시지를 발송하여 아이디/비밀번호 입력 창 없이 바로 직전 단계로 자동 로드.
4. **로컬 스토리지 캐시 폴백 (Offline Resilience)**:
   * `localStorage.getItem('redbook_g1_current_user')`에 사용자 정보를 보관하여 네트워크가 불안정하거나 새로고침해도 로그인이 풀리지 않음.

---

## 5. 🗄️ 데이터베이스 연결 및 4계층 실시간 동기화 아키텍처

학생의 탐구 활동 기록, 제출한 답안, 현재 진도 위치는 **4단계 중첩 백엔드 동기화 파이프라인**을 통해 영구 저장됩니다:

```
[학생이 캔버스 조작 및 빈칸 정답 제출]
                 │
                 ▼
 ┌───────────────────────────────────────────────────────────┐
 │ 1단계: 로컬 캐시 영속화 (Zero Lag Local Storage)          │
 │  • localStorage: redbook_g1_progress_<학번> 저장          │
 │  • 탭 이동이나 브라우저 새로고침 시 1초 만에 상태 복구    │
 └─────────────────────────────┬─────────────────────────────┘
                               │
                               ▼
 ┌───────────────────────────────────────────────────────────┐
 │ 2단계: 크로스 디바이스 클라우드 공유 스토어 (Live Cloud DB)│
 │  • api.restful-api.dev 전용 객체 PUT 통신                 │
 │  • PC에서 풀던 단계를 태블릿/스마트폰에서 열어도 동일 복원 │
 └─────────────────────────────┬─────────────────────────────┘
                               │
                               ▼
 ┌───────────────────────────────────────────────────────────┐
 │ 3단계: Supabase 중앙 DB 영구 저장 (School Master DB)      │
 │  • 테이블: 'activity_submissions'                         │
 │  • 항목: student_id, grade(1), activity_title, answer, 점수│
 └─────────────────────────────┬─────────────────────────────┘
                               │
                               ▼
 ┌───────────────────────────────────────────────────────────┐
 │ 4단계: 상위 Monday LMS 포털 전송 (Iframe Bridge)          │
 │  • window.parent.postMessage({ type: 'MATH_LMS_SUBMIT' }) │
 │  • Monday LMS 학생 포트폴리오 및 AI 세특 자동 생성 연동   │
 └───────────────────────────────────────────────────────────┘
```

* **교사용 원격 해금 제어 (`SYS_UNLOCK_G1`)**:
  * 교사가 관제실에서 "오늘 수업은 2-2까지만 푼다"고 설정하면, `SYS_UNLOCK_G1` 레코드가 Supabase 및 Cloud DB에 기록되어 **모든 학생의 화면에서 2-2 이후 단계가 일괄 잠금** 처리됩니다.

---

## 6. 📐 타 단원(1, 2, 3, 5, 6, 7, 8단원) 개발을 위한 마스터 규격 가이드

다른 단원을 개발할 때는 본 `g1_coordinate`의 구조를 그대로 유지하고 **오직 3가지만 단원 내용에 맞게 교체**하면 즉시 새로운 단원 웹 앱이 완성됩니다:

### 6.1 단원 개발 시 수정/정의할 3대 요소

1. **상단 탭 및 서브스텝 정의 (`substeps_data.js`)**:
   * 대단원 중단원 탭 이름(예: `1. 소인수분해`, `2. 최대공약수와 최소공배수` 등).
   * 각 지면 페이지별 서브스텝 코드(`1-1`, `1-2`, ...)와 미션 설명문.
2. **좌측 캔버스 드로잉 핸들러 (`canvas_drawers.js`)**:
   * 각 단계별 Two.js 그래픽 함수(예: 거듭제곱 바둑알 캔버스, 수직선 약수 캔버스 등).
3. **우측 인라인 입력 폼 및 채점기 (`validation_handlers.js`)**:
   * 문제 문장, 빈칸 input 태그, `normTxt` 정답 정규식.

### 6.2 타 단원 개발용 마스터 서브스텝 템플릿 코드 스니펫

```javascript
// [표준 서브스텝 데이터 객체 규격]
const SUBSTEPS_CONFIG = {
  // 예: 중1 1단원 소인수분해
  "1-1": {
    mainTab: 1,
    title: "1-1. 거듭제곱의 뜻",
    pageTextbook: "교과서 10쪽 [생각열기]",
    missionText: "세균 1마리가 1시간마다 2배로 늘어날 때, 4시간 후의 세균 수를 거듭제곱으로 나타내어 보세요.",
    canvasDrawer: "drawBacteriaCanvas", // Two.js 렌더링 함수명
    interactiveType: "slider",          // slider, drag, plotting, table 중 선택
    formHtml: `
      <div class="question-card">
        <p>2를 4번 곱한 것을 거듭제곱으로 나타내면?</p>
        <div class="proof-step-box">
          2 × 2 × 2 × 2 = 2<sup style="font-size:0.8em;"><input type="text" class="proof-input-text" id="ans-power" placeholder="지수"></sup>
        </div>
        <button class="btn btn-primary" onclick="validateStep_1_1()">정답 확인</button>
      </div>
    `,
    validator: function() {
      const val = document.getElementById('ans-power').value.trim();
      if (val === '4') {
        return { success: true, answerText: "2^4", score: 100 };
      }
      return { success: false, hint: "2를 몇 번 곱했는지 세어보세요!" };
    }
  }
};
```

---

## 7. 🎯 결론 및 기대 효과

1. **개발 생산성 500% 향상**:
   * 로그인, 레이아웃 프레임, DB 연동, 사운드, Confetti, 교사 관제실이 이미 완성되어 있으므로, 새로운 단원은 교과서 지면을 분석하여 **캔버스 그리기 + 빈칸 폼 매핑**만 진행하면 1~2일 내에 단원 하나를 완벽하게 뽑아낼 수 있습니다.
2. **100% 일관된 학생 학습 경험**:
   * 학생들은 1단원부터 8단원까지 동일한 UX, 동일한 조작 방식, 동일한 학번 로그인으로 수업에 참여하므로 조작법에 대한 인지 과부하가 0이 됩니다.
3. **생기부 세특 자동화 완성**:
   * 모든 단원의 제출 기록이 동일한 규격(`activity_submissions`)으로 Supabase 및 Monday LMS에 적재되어, 학기 말 학생별 세특(수학적 탐구력, 끈기, 자기주도성)이 자동으로 산출됩니다.
