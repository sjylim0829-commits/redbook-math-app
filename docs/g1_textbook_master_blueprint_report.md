# 📘 [Redbook 표준 개발 명세서] 중1 교과서 1:1 반영 체계, `g1_coordinate` 전체 프레임·로그인·DB 아키텍처 분석 및 타 단원 복제 마스터 가이드

> **문서 버전**: v2.0 (Master Unified Blueprint)  
> **기준 레퍼런스 웹 앱**: `web_app/g1_coordinate.html`  
> **기준 교과서**: `[YBM] 중등 수학 1-1 교사용 교과서.pdf` (IV. 좌표평면과 그래프, 104~129쪽)  
> **적용 대상**: 중1 전 단원(1단원 소인수분해, 2단원 정수와 유리수, 3단원 문자와 식, 5단원 기본 도형, 6단원 평면도형, 7단원 입체도형, 8단원 통계)

---

## 1. 🧭 개요 및 분석 목적

본 보고서는 **[YBM] 중등 수학 1-1 교사용 교과서(4단원 좌표평면과 그래프)**와 이를 디지털 인터랙티브 웹 앱으로 완벽하게 구현한 기준 모델 **`g1_coordinate.html`**을 1대1로 정밀 대조 분석한 표준 개발 명세서입니다.

향후 제작되는 모든 단원은 **`g1_coordinate.html`의 578줄 CSS 디자인 시스템, 상단 헤더, 2단 내비게이션(탭바+필바), 2열 분할 탐구 레이아웃, 3개 뷰(View) 전환 체계, 3대 모달(비밀번호, 해금 범위, 1:1 확대 Zoom), LMS 학번 로그인 및 Supabase Cloud DB 동기화 엔진을 100% 동일하게 유지·계승**하며, 오직 단원의 수학적 내용(캔버스 조작 및 문항 폼)만 교체하는 방식으로 개발됩니다.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                         [YBM] 중1-1 교사용 교과서 지면                           │
│  [되짚어보기] ➔ [생각열기] ➔ [개념/기호] ➔ [문제] ➔ [스스로확인하기] ➔ [생각넓히기/마무리] │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │ 1:1 디지털 트윈(Digital Twin) 변환
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│              Redbook 표준 대화형 웹 앱 프레임워크 (`g1_coordinate.html`)          │
├──────────────────────────────────────────────────────────────────────────────────┤
│ [Tier 1] 상단 헤더 (단원 뱃지, 사용자 프로필, 해금 제어, 5x5 관제실, 교사 패스 버튼)      │
│ [Tier 2] 상단 메인 탭바 (소단원 분류) + 하단 서브스텝 필바 (1문항 1서브스텝 Pills)       │
├────────────────────────────────────────┬─────────────────────────────────────────┤
│    [좌측 캔버스 영역] (flex: 1.15)     │      [우측 문제/폼 영역] (flex: 0.85)     │
│  • 60fps Two.js 동적 벡터 그래픽       │  • 오늘의 탐구 미션 카드 (KaTeX 수식)   │
│  • 점/선 마우스·터치 드래그 & 자석스냅 │  • 문맥형 인라인 괄호 빈칸 (.proof-input)│
│  • 기하학적 구속조건(Constraint) 실시간 │  • 중립 안내 Placeholder (스포일러 금지) │
│  • 투명 펜 드로잉 오버레이 레이어(3색) │  • 실시간 정답 판정 및 해설 피드백 카드  │
├────────────────────────────────────────┴─────────────────────────────────────────┤
│ [백엔드] 3계층 실시간 동기화 (Supabase Cloud DB + LMS Bridge SDK + LocalStorage)│
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 📖 교과서 지면 ➔ `g1_coordinate` 1:1 반영 메커니즘

`g1_coordinate`는 교과서 지면의 활자를 단순 텍스트로 옮겨 적는 방식을 배제하고, **학생이 수학적 대상을 직접 조작하고 발견하는 대화형 인지 도구(Cognitive Interactive Tool)**로 1:1 재창조하였습니다.

### 2.1 교과서 요소별 1:1 디지털 전환 원칙

| 교과서 지면 구성 요소 | `g1_coordinate` 디지털 변환 방식 | 기술적 구현체 | 교육적 가치 및 조작성 |
|:---|:---|:---|:---|
| **0. 되짚어 보기 (선수학습)** | 초등 연계 선수 개념 확인 서브스텝 (`0-1`, `0-2`, `0-3`) | 수직선/대응표 Two.js 캔버스 + 확인 폼 | 본 단원 학습 전 결손 요소를 진단하고 즉시 보완 |
| **생각 열기 (도입 삽화)** | 실생활 상황을 인터랙티브하게 재현한 캔버스 | 도로변 건물 배치, 자석 게시판 등 벡터 그래픽 | 실생활 상황에서 수학적 개념(수직선, 순서쌍)의 필요성 유도 |
| **본문 개념 및 기호 정의** | 조작을 통해 기호의 정의를 체험하는 동적 캔버스 | `drawDraggablePoint` (마우스/터치 드래그) | 점을 직접 움직이며 좌표 기호 $P(a, b)$, 사분면 부호 발견 |
| **본문 확인 문제 (1, 2, 3번)** | 캔버스 좌표 확인 및 인라인 빈칸 풀이 | `proof-input-text` + KaTeX 수식 | 교과서 문제의 문맥을 그대로 유지한 채 인터랙티브 풀이 |
| **생각 나누기** | 학생의 자유로운 수학적 추론 작성 서술 폼 | `<textarea>` + LMS DB 기록 | 정형화된 정답 없이 학생의 창의적 의견을 DB에 보존 |
| **스스로 확인하기 (소단원 마무리)** | **1문항 1서브스텝 독립 분리 원칙** (1문항당 개별 캔버스 & 폼) | 개별 Substep 코드 (`2-3`~`2-7`, `3-13`~`3-15`) | 문항별 집중도 극대화 및 학생별 취약 문항 정밀 추적 |
| **생각 넓히기 (심화 탐구)** | 복합적 문제 해결을 위한 전용 특수 캔버스 | 보물지도 탐구(좌표축 작도 및 보물 찾기) | 단순 계산을 넘어 수학적 직관력과 탐구력 신장 |
| **스스로 마무리하기 (대단원)** | **독립 메인 탭 승격 및 전 문항 1:1 개별 분리** | 독립 Tab + 1~14번 전 문항 개별 서브스텝 | 대단원 총괄 평가를 누락 없이 100% 디지털화 |

### 2.2 4대 인터랙티브 UI 규칙 준수

1. **정답 스포일러 방지 (Placeholder 절대 금지 원칙)**:
   - 입력창(`input`, `textarea`)의 `placeholder`에 정답이나 힌트성 번호(예: `"1사분면"`, `"네 개로 나뉜 면"`, `"2"`)를 미리 노출하는 것을 엄격히 금지합니다.
   - 항상 `placeholder="입력"`, `placeholder="답 입력"`, `placeholder="부호 (+/-)"` 등 중립적인 안내 문구만 사용합니다.
2. **60fps 무지연 렌더링 & 넓은 터치 Hit-test**:
   - Two.js / Canvas 렌더러를 사용하여 모바일/태블릿 터치 시에도 지연(Lag) 없는 60fps 반응성을 보장합니다.
   - 드래그 가능한 점(Point)의 시각적 반경이 8px일 때, 터치 감지 영역은 24px 이상으로 넓게 잡아 손가락 조작성을 극대화합니다.
3. **자석 스냅 (Grid & Point Snapping)**:
   - 점을 드래그할 때 정수 좌표 격자 근처로 접근하면 자동으로 `snapVal(val, 30)`에 의해 착 붙는 자석 효과를 적용하여 정밀 조작을 지원합니다.
4. **KaTeX 수식 연동**:
   - 문제 지문 및 피드백 카드의 모든 수식($\angle A$, $P(a, b)$, $y=ax$, $2^3 \times 5$)을 KaTeX 라이브러리로 미려하게 렌더링합니다.

---

## 3. 🖥️ 웹 앱의 전체적인 프레임 구조 (100% 복제 기준 규격)

`g1_coordinate.html`은 상단 헤더, 2단 내비게이션, 2열 분할 메인 컨테이너, 3개 독립 뷰 체계, 3대 모달 시스템으로 완벽히 모듈화되어 있습니다.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [헤더: app-header] 높이 48px                                                           │
│  [중1 수학] 📐 4. 좌표평면과 그래프       👤 학생(10101)  [🔓해금설정] [📊5x5관제] [🔑패스] [로그아웃]│
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [메인 탭바: tab-bar-container] 높이 42px                                                │
│  [0.되짚어보기 🔓] [4.1순서쌍과좌표 🔒] [4.2사분면 🔒] [4.3그래프 🔒] [4.4정비례 🔒] [4.5반비례 🔒]     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [서브스텝 필바: substep-bar] 높이 36px                                                  │
│  📑 세부 탐구 활동: [0-1. 대응 관계] [🔒 0-2. 수직선] [🔒 0-3. 식의 값]                  │
├──────────────────────────────────────────────────────────┬─────────────────────────────┤
│   좌측: 60fps Two.js 캔버스 영역 (.plane-section)          │ 우측: 미션/폼 영역 (.sidebar)│
│   ┌────────────────────────────────────────────────────┐ │ ┌─────────────────────────┐ │
│   │ [툴바: plane-toolbar] 🖐️선택 ✏️판서(청/적/흑/지우개)  │ │ │ [미션: mission-card]    │ │
│   ├────────────────────────────────────────────────────┤ │ │  오늘의 수학 탐구 목표   │ │
│   │ [Two.js 캔버스 (#two-container)]                   │ │ ├─────────────────────────┤ │
│   │  • 기하학적 도형, 그래프, 동적 점 드래그 조작        │ │ │ [폼: form-work-area]    │ │
│   │ -------------------------------------------------- │ │ │  인라인 빈칸 입력창     │ │
│   │ [판서 레이어 (#freehand-drawing-canvas)]           │ │ │  (.proof-input-text)    │ │
│   │  • 실시간 투명 필기 오버레이                       │ │ │  [✅ 제출 및 채점 버튼]  │ │
│   └────────────────────────────────────────────────────┘ │ └─────────────────────────┘ │
└──────────────────────────────────────────────────────────┴─────────────────────────────┘
```

### 3.1 3개 뷰(View Panel) 분리 체계
- **`#view-login`**:
  - LMS 5자리 학번(`10101` 등) 로그인 카드.
  - 학생 접속 시작 버튼, 교사 비밀번호 모달 호출 버튼, 5x5 관제실 직행 버튼 구비.
- **`#view-activity`**:
  - 실제 수업과 학생 활동이 진행되는 메인 분할 작업 공간.
  - 좌측 캔버스(60%) + 우측 문제 폼(40%)의 2열 반응형 그리드.
- **`#view-teacher-dashboard`**:
  - 교사 전용 5x5 실시간 학생 모니터링 관제실.
  - 1반~8반 반별 필터 탭, 25명 슬롯 실시간 상태 카드(활동중/제출완료/도움필요), 통계 스트립 완비.

### 3.2 3대 모달 시스템 (Modals)
1. **보안 비밀번호 인증 모달 (`#secure-password-modal`)**:
   - 교사 접속, 교사 패스(Pass), 관제실 진입 시 마스터 비밀번호(`950420`, 하위호환 `661227`) 인증.
2. **학생 해금 범위 설정 모달 (`#unlock-boundary-modal`)**:
   - 교사가 학생들에게 공개할 최대 진도 범위를 드롭다운(`<select id="select-unlock-substep-g1">`) 및 소단원 프리셋 버튼으로 원클릭 지정.
   - 설정 시 `localStorage` 및 DB에 저장되어 모든 학생의 잠금(`🔒` $\to$ `🔓`)이 즉시 갱신됨.
3. **1:1 학생 캔버스 확대 Zoom 모달 (`#student-zoom-modal` / `#zoom-student-modal`)**:
   - 5x5 관제실에서 특정 학생 카드 클릭 시 팝업.
   - 좌측에 학생의 실시간 캔버스 화면을 100% 동일하게 미러링 렌더링.
   - 우측에 학생 입력 답안, 진도율, [원격 패스] 버튼, [실시간 힌트/칭찬 전송] 버튼 탑재.

### 3.3 CSS 디자인 시스템 핵심 토큰 (578줄 표준 보존)
```css
:root {
  --primary-color: #4f46e5;      /* Indigo-600 (메인 브랜드/활성 탭) */
  --primary-hover: #4338ca;      /* Indigo-700 */
  --secondary-color: #0284c7;    /* Sky-600 (서브스텝 활성/강조) */
  --accent-color: #ec4899;       /* Pink-500 (포인트/강조) */
  --success-color: #059669;      /* Emerald-600 (정답/통과) */
  --warning-color: #d97706;      /* Amber-600 (주의/미입력) */
  --bg-main: #f8fafc;            /* Slate-50 (메인 배경) */
  --bg-card: #ffffff;            /* Card 흰색 */
  --text-primary: #0f172a;       /* Slate-900 (기본 텍스트) */
  --text-secondary: #475569;     /* Slate-600 (보조 텍스트) */
  --border-color: #cbd5e1;       /* Slate-300 (경계선) */
  --font-sans: 'Pretendard', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
```

---

## 4. 🔐 학생 로그인 및 세션 관리 아키텍처

`g1_coordinate`는 정교한 학번 체계와 교사 권한 승격, 세션 영속화 메커니즘을 내장하고 있습니다.

### 4.1 5자리 학번 규칙 및 학급 판정 알고리즘
- **학번 체계**: `10311` (1학년 3반 11번), `10805` (1학년 8반 5번).
  - 1번째 자리: 학년 (`1`)
  - 2번째 자리: 고정 `0`
  - 3번째 자리: 학급 (`1`~`8`반)
  - 4~5번째 자리: 출석 번호 (`01`~`25`번)
- **학급 판정 함수 (`getStudentClassNumberG1`)**:
```javascript
function getStudentClassNumberG1(id) {
  if (!id || id.length < 3) return 1;
  const digit3 = parseInt(id.charAt(2), 10);
  return (isNaN(digit3) || digit3 < 1 || digit3 > 8) ? 1 : digit3;
}
```

### 4.2 로그인 인증 플로우
1. **학생 일반 로그인**:
   - 학번 5자리 + 비밀번호 입력 $\implies$ `LMSIntegration.loginStudent(studentId, password)` 호출.
   - Supabase DB의 `students` 테이블을 조회하여 인증.
   - 인증 성공 시 `state.currentUser`, `state.studentId`에 저장 및 `localStorage.setItem('redbook_g1_current_user', ...)` 캐싱.
   - 학생의 기존 진도(`student_progress`)를 불러와 직전 학습 단계로 자동 이동.
2. **교사 마스터 비밀번호 바이패스**:
   - 비밀번호 입력창에 `950420` 또는 `661227` 입력 시 학번 무관 **교사 관리자 권한 즉시 승격**.
   - `state.isTeacherLoggedIn = true`, 모든 탭과 서브스텝 잠금 일괄 해제(`🔓`).
   - 상단 헤더에 `[🔓 학생 해금 범위 설정]` 버튼 노출.
3. **상위 LMS Iframe 무입력 자동 로그인 (`postMessage`)**:
   - 학교 포털이나 상위 LMS 내부에서 iframe으로 임베드된 경우, `MATH_LMS_INIT_STUDENT` 이벤트를 수신하여 별도 입력창 없이 즉시 자동 로그인.

---

## 5. 🗄️ 데이터베이스 연결 및 실시간 동기화 아키텍처

`g1_coordinate`는 외부 SDK인 **Supabase JS 클라이언트(`@supabase/supabase-js@2`)**와 자체 래퍼인 **`js/lms-integration.js`**를 통해 무결점 클라우드 동기화를 수행합니다.

### 5.1 Supabase Cloud DB 연결 설정
```javascript
const SUPABASE_URL = 'https://agcmetuneycqzhvshmoe.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_r_0ZhunAe99ftol-JqL5qg_ADZ1BH_X';
const APP_ID = 'math_1_coordinate_graph'; // 단원별 고유 APP_ID 부여
```

### 5.2 3대 핵심 데이터베이스 테이블 스키마

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Supabase Cloud Database                         │
├──────────────────┬──────────────────────┬──────────────────────────────┤
│ 1. students      │ 2. student_progress  │ 3. activity_submissions      │
│  (학생 기본 정보)│  (단원별 진도 추적)  │  (문제 풀이 및 활동 로그)    │
├──────────────────┼──────────────────────┼──────────────────────────────┤
│ • id (TEXT, PK)  │ • id (BIGINT, PK)    │ • id (BIGINT, PK)            │
│ • name (TEXT)    │ • student_id (TEXT)  │ • student_id (TEXT)          │
│ • password (TEXT)│ • app_id (TEXT)      │ • student_name (TEXT)        │
│ • grade (INT)    │ • sub_step (TEXT)    │ • grade (INT), class_num(INT)│
│ • class_num (INT)│ • completed_steps    │ • activity_title (TEXT)      │
│ • created_at     │   (TEXT ARRAY)       │ • answer_text (TEXT)         │
│                  │ • updated_at         │ • score (INT), submitted_at  │
└──────────────────┴──────────────────────┴──────────────────────────────┘
```

1. **`students` 테이블**:
   - 학생 인증의 원천. 학번, 이름, 소속 학년/반 검증.
2. **`student_progress` 테이블**:
   - 학생이 현재 어디까지 풀었는지 기록하는 진도 테이블.
   - `student_id`와 `app_id` 복합 조건으로 학생별 마지막 위치(`sub_step`)와 완료한 단계 목록(`completed_steps: ['0-1', '0-2', ...]`)을 영구 저장.
3. **`activity_submissions` 테이블**:
   - 학생이 정답 확인 버튼을 누를 때마다 채점 결과와 입력한 답안 전문(`answer_text`), 획득 점수(`score: 100`)를 실시간 인서트.
   - 교사 관제 대시보드의 실시간 답안 미러링 및 학기말 학교생활기록부 수학 세특 자동 산출의 기초 데이터로 활용.

### 5.3 오프라인 및 네트워크 단절 대비 3중 Fallback 메커니즘
- **1차 (클라우드 DB)**: Supabase REST API 통신.
- **2차 (로컬 캐시)**: 네트워크 오류 시 즉시 `localStorage.setItem('redbook_g1_progress_' + studentId, ...)`에 저장하여 브라우저 새로고침이나 재접속 시 100% 복원.
- **3차 (15초 주기 자동 저장)**: `startPeriodicAutoSave()`를 통해 학생이 제출 버튼을 누르지 않고 작성 중이더라도 15초마다 임시 입력값을 백그라운드에서 자동 보존.

---

## 6. 📐 타 단원 개발을 위한 마스터 템플릿 복제 레시피 (Developer Recipe)

향후 중1 1~8단원 제작 시 개발자는 다음 규칙에 따라 **절대 변경하지 말아야 할 프레임**과 **단원 내용에 맞게 교체할 콘텐츠**를 명확히 구분하여 작업합니다.

### 6.1 절대 변경하지 않는 불변 영역 (100% Freeze)
1. **`<head>` 영역의 578줄 CSS 전체**:
   - 디자인 토큰, 폰트, 버튼 크기, 2열 분할 그리드, 모달 스타일 유지.
2. **상단 헤더(`app-header`) 및 3개 뷰 구조**:
   - `#view-login`, `#view-activity`, `#view-teacher-dashboard`.
3. **교사 관제 대시보드 엔진 (`render5x5StudentGridG1`, `openStudentZoomModal`)**:
   - 1반~8반 필터, 25명 카드 그리드, Zoom 모달.
4. **인증 및 모달 함수군**:
   - `handleLMSLogin`, `handleSecurePasswordSubmit`, `openUnlockBoundaryModal`, `applyGlobalUnlockStepG1`.
5. **Two.js 엔진 초기화 및 판서 오버레이 레이어**:
   - `initTwoEngine`, `initFreehandDrawingCanvas`, 3색 펜 및 지우개 모드.

### 6.2 단원별로 교체/주입하는 가변 영역 (Content Injection)

1. **상단 타이틀 및 단원 태그 배지**:
   - 예: `🌱 1. 소인수분해`, `➕ 2. 정수와 유리수`, `📐 5. 기본 도형`
2. **단원 고유 `APP_ID` 및 서브스텝 상수**:
   - `APP_ID = 'math_1_prime_factorization';`
   - `ALL_SUBSTEPS = ['0-1', '0-2', '1-1', ..., '5-15'];`
3. **단원 탭 구성 (`tabSubSteps`)**:
   - 메인 탭바의 대단원/소단원 버튼 텍스트와 각 탭에 매핑된 서브스텝 배열.
   - **스스로 확인하기 전수 1문항 1스텝 분리**.
   - **대단원 스스로 마무리하기 탭 승격 및 1문항 1스텝 분리**.
4. **서브스텝 데이터 맵 (`subStepDataMap`)**:
   - 각 단계의 `mission`(KaTeX 수식 포함), `canvas`(렌더러 타입), `form`(인라인 입력 HTML).
5. **단계별 채점 함수 (`checkStep_X_Y()`)**:
   - 텍스트 정규화(`normStr`), 숫자 집합 일치 판정(`checkNumberSet`), `gradeStep(curCode, isPass, passHtml, hintHtml, nextCode)`.

### 6.3 표준 채점 및 단계 전진 함수 (`gradeStep`)
```javascript
function gradeStep(code, isCorrect, solutionHtml, hintHtml, nextCode) {
  const resultDiv = document.getElementById('grade-result-' + code.replace(/-/g, '_'));
  if (!resultDiv) return;

  if (isCorrect) {
    resultDiv.style.display = 'block';
    resultDiv.className = 'grade-box success-box';
    resultDiv.innerHTML = `
      <div style="font-weight:800; font-size:1.02rem; color:#15803d; margin-bottom:6px;">
        🎉 정답입니다! 참 잘했습니다!
      </div>
      <div style="font-size:0.88rem; color:#166534; line-height:1.6;">${solutionHtml}</div>
      ${nextCode ? `<button class="btn btn-primary" style="margin-top:10px; width:100%;" onclick="loadSubStep('${nextCode}')">다음 단계로 이동 ➔</button>` : ''}
    `;
    if (!state.completedSubSteps.includes(code)) state.completedSubSteps.push(code);
    if (nextCode && !state.unlockedSubSteps.includes(nextCode)) {
      state.unlockedSubSteps.push(nextCode);
      const nextTab = parseInt(nextCode.split('-')[0]);
      if (!state.unlockedMainTabs.includes(nextTab)) state.unlockedMainTabs.push(nextTab);
    }
    updateSubStepPills(state.currentMainTab);
    updateMainTabLocks();
  } else {
    resultDiv.style.display = 'block';
    resultDiv.className = 'grade-box error-box';
    resultDiv.innerHTML = `
      <div style="font-weight:800; font-size:0.95rem; color:#b91c1c; margin-bottom:4px;">
        💡 다시 한 번 생각해 볼까요?
      </div>
      <div style="font-size:0.85rem; color:#991b1b; line-height:1.55;">${hintHtml}</div>
    `;
  }
  renderMathInPage(resultDiv);
}
```

---

## 7. 🎯 결론 및 기대 효과

1. **설계의 일관성과 인지 부하 제로(Zero Cognitive Load)**:
   - 학생들은 1단원부터 8단원까지 로그인 방법, 캔버스 조작법, 빈칸 제출법, 교사 패스 방식이 100% 동일하므로 UI 조작에 따른 인지 과부하 없이 오직 수학적 사고에만 집중할 수 있습니다.
2. **교사의 완벽한 수업 통제권 확보**:
   - 모든 단원에서 동일한 마스터 비밀번호(`950420`)로 인증하고, 동일한 해금 제어 모달로 수업 진도를 통제하며, 5x5 관제실에서 학생들의 캔버스를 1:1로 실시간 확인 및 원격 지원할 수 있습니다.
3. **폭발적인 개발 속도와 품질 보증**:
   - `g1_coordinate.html`이라는 완성형 마스터 아키텍처가 확립되었으므로, 다음 단원 개발 시 프레임워크나 CSS를 재설계할 필요 없이 교과서 PDF 분석 $\to$ 데이터 모듈화 $\to$ 캔버스 렌더러 작성만으로 100% 완성도와 자동화 QA를 보장할 수 있습니다.
