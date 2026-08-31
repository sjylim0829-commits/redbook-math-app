# 📐 영서중학교 디지털 수학 인터랙티브 웹 앱 개발 및 유지보수 규칙
(Youngseo Digital Math Interactive App Development Rules & Guidelines)

본 문서는 **중1 수학(좌표평면과 그래프)** 및 **중2 수학(삼각형의 성질)** 등 영서중학교 수학 대화형 탐구 웹 애플리케이션의 개발 표준, UI/UX 디자인 원칙, 기하/좌표 엔진 아키텍처, LMS 연동 규격을 체계적으로 정리한 자체 참조용 작업 규칙입니다.

---

## 1. 🏗️ 기술 스택 및 아키텍처 표준 (Tech Stack & Architecture)

### 1.1 기본 구성 원칙
- **독립 실행형 단일 파일(Single File Bundle) 구조**: 각 학년별/단원별 웹페이지(`g1_coordinate.html`, `g2_geometry.html` 등)는 단독으로도 완전히 기능할 수 있도록 HTML + CSS + JS가 조화롭게 통합된 고성능 아키텍처를 유지합니다.
- **포털 허브(`portal.html`) 연계**: 메인 포털에서 전체 학년 진입, 교사 원격 해금 제어, LMS 통합 관리를 수행합니다.
- **외부 필수 라이브러리 (CDN 경량 로드)**:
  - `KaTeX` (`katex.min.js`, `katex.min.css`, `auto-render.min.js`): 수식 표기 ($\LaTeX$ 렌더링)
  - `Supabase JS` (`@supabase/supabase-js@2`): 실시간 양방향 클라우드 DB & 관제 통신
  - `Two.js` 또는 `HTML5 Canvas 2D`: 60fps 고성능 기하/좌표 렌더러
  - `Web Audio API`: 브라우저 내장 오디오 신디사이저 (별도 음원 파일 의존성 없이 동적 사운드 생성)

### 1.2 모듈별 테마 컬러 시스템 (Design Tokens)
```css
:root {
  /* 학년별 테마 */
  --g1-primary: #0284c7;        /* 중1: 스카이블루 */
  --g1-gradient: linear-gradient(135deg, #0284c7, #38bdf8);
  --g2-primary: #4f46e5;        /* 중2: 인디고 바이올렛 */
  --g2-gradient: linear-gradient(135deg, #4f46e5, #818cf8);
  
  /* 공통 액센트 및 상태 */
  --accent-pink: #ec4899;       /* 둔각/보물/히든 강조 */
  --success-green: #059669;     /* 정답/인증 성공 */
  --warning-amber: #d97706;     /* 힌트/경고 */
  --error-red: #dc2626;         /* 오답/오류 */
  
  /* 배경 및 타이포그래피 */
  --bg-main: #f8fafc;
  --bg-card: #ffffff;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --border-color: #cbd5e1;
  --font-sans: 'Pretendard', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
```

---

## 2. 📚 5단계 탐구 학습 설계 표준 (Pedagogical Flow)

모든 수학 단원은 **5단계 탐구 학습 흐름(Inquiry Learning Cycle)**을 기본 뼈대로 구현합니다.

| 단계 | 명칭 | 주요 목적 | 인터랙션 특징 |
|---|---|---|---|
| **0단계** | **되짚어보기 / 튜토리얼** | 선수 학습 회상 및 캔버스 조작 도구 숙달 | 점 찍기, 선분 잇기, 점 드래그, 좌표 읽기 등 인터페이스 튜토리얼 |
| **1단계** | **개념 탐구 / 발견** | 수학적 불변량과 성질의 직관적 조작 및 발견 | 도형 변형, 좌표 이동에 따른 수치/각도 실시간 동적 계산 및 피드백 |
| **2단계** | **수학적 정당화 / 증명** | 논리적 연역 추론 및 기하학적 증명 과정 체험 | 단계별 논리 빈칸 채우기, 합동 조건 대입, 대칭성 시각화 |
| **3단계** | **정리 및 형성평가** | 핵심 개념 점검 및 즉각적인 피드백 퀴즈 | 인터랙티브 선다형/단답형, 단계별 풀이 해설, 실시간 정오답 판정 |
| **4~5단계** | **생각 넓히기 / 히든 미션** | 심화 발전 과제, 실생활 연계, 보물찾기 게임 | 2~3단계 통과 시 동적 해금되는 챌린지 미션 (성취감 극대화) |

---

## 3. 🎨 레이아웃 및 UX/UI 설계 규칙 (Layout & UX Rules)

### 3.1 화면 분할 구조 (Split-View Layout)
- **높이 100vh 고정 레이아웃 (`overflow: hidden`)**:
  - **상단 Header (48px)**: 로고, 단원명 뱃지, 현재 학습자 정보, 교사 모드 토글 버튼.
  - **상단 Tab Bar (42px)**: 0~5단계 대단원 탭 (잠금 🔒 / 해금 🔓 / 완료 ✅ 인디케이터 표시).
  - **하위 Substep Pills (36px)**: 세부 활동 단계(예: 4.1-1, 4.1-2 ...) 캡슐형 네비게이션.
  - **본문 (2-Column Grid / Flex)**:
    - **좌측 (Canvas Interactive Pane)**: 55~60% 너비. 2D 좌표평면/기하 작도 영역, 툴바(선택, 점 추가, 선분, 각도, 그리드 토글, 리셋, 줌 컨트롤).
    - **우측 (Instruction & Question Pane)**: 40~45% 너비 (`overflow-y: auto`). 학습 목표, 단계별 발문, LaTeX 수식 안내, 인터랙티브 답변 입력란, 피드백 박스, '다음 단계' 이동 버튼.

### 3.2 조작성 및 캔버스 인터랙션 표준
1. **스마트 자석 스냅 (Magnetic Snapping)**:
   - 점 드래그 시 정수 격자점(좌표평면) 또는 특정 기하 점(꼭짓점, 중점, 수선의 발)에 근접(15px 이내)하면 자석처럼 자동 스냅.
2. **멀티 디바이스 터치/마우스 통합**:
   - `pointerdown`, `pointermove`, `pointerup`, `pointercancel` 이벤트로 통일하여 태블릿(iPad, Galaxy Tab) 및 PC 마우스 완벽 호환.
   - 핀치 줌(Pinch-to-zoom) 및 2핑거 패닝(Pan) 지원.
3. **실시간 기하 수치 동적 라벨링**:
   - 선분 길이($\overline{AB}$), 각도($\angle ABC$), 꼭짓점 좌표($(x, y)$), 사분면 판정 등을 조작 즉시 60fps로 실시간 재계산 및 렌더링.
4. **접근성 및 시각적 명확성**:
   - 드래그 가능한 제어점은 굵은 테두리와 펄스(Pulse) 애니메이션을 부여하여 조작 가능한 요소임을 명시.

---

## 4. 🔊 오디오 및 마이크로 인터랙션 (Sound & Micro-Interactions)

외부 음원 파일 누락 위험을 방지하기 위해 **Web Audio API 오실레이터(Synthesizer)**를 자체 내장합니다.

```javascript
const SoundFX = {
  ctx: null,
  init() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  },
  playTone(freq, duration, type = 'sine', gainVal = 0.15) {
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  },
  // 사운드 프리셋
  pop() { this.playTone(600, 0.08, 'triangle', 0.12); },
  success() {
    this.playTone(523.25, 0.1, 'sine'); // C5
    setTimeout(() => this.playTone(659.25, 0.1, 'sine'), 80); // E5
    setTimeout(() => this.playTone(783.99, 0.25, 'sine'), 160); // G5
  },
  error() { this.playTone(180, 0.25, 'sawtooth', 0.2); },
  unlock() {
    this.playTone(440, 0.08, 'sine');
    setTimeout(() => this.playTone(880, 0.2, 'triangle'), 100);
  }
};
```

---

## 5. 🛡️ 교사 관리자 모드 & LMS 관제 규격 (Teacher Mode & LMS Specs)

### 5.1 인증 및 보안 규칙
- **공통 마스터 비밀번호**: `260523`
- 비밀번호 인증 시 교사 권한 활성화:
  - 모든 잠금(🔒) 단계 즉시 무제한 해금.
  - 학생 화면 5x5 실시간 모니터링 대시보드 접근 가능.
  - 학생 전용 해금 범위 일괄 설정(원격 잠금/해금 제어).

### 5.2 5x5 관제 그리드 (Classroom Monitoring)
- **구성**: 학년별 1반~8반, 각 반당 1~25번 (반별 25명 5x5 그리드 매트릭스).
- **실시간 데이터 동기화**:
  - 학생의 현재 단계(`currentStep`), 답안 제출 여부(`status: 'active' | 'submitted' | 'stuck'`), 마지막 캔버스 상태 썸네일.
  - 1:1 고화질 확대 뷰어 및 원격 힌트 전송 기능 탑재.

### 5.3 LMS Integration 데이터 스키마
```javascript
const studentDataSchema = {
  id: "20101",          // 학번 (학년 2 + 반 01 + 번호 01)
  name: "홍길동",
  grade: "2",
  classNum: "1",
  currentStep: "6.1-2",
  completedSteps: ["0-1", "0-2", "6.1-1"],
  canvasState: { /* 점/도형 좌표 직렬화 데이터 */ },
  answers: { "step1_q1": "이등변삼각형" },
  updatedAt: new Date().toISOString()
};
```

---

## 6. 📐 수식 렌더링 및 LaTeX 표준 (KaTeX Guidelines)

1. **인라인 및 블록 수식 표준**:
   - 인라인 수식: `$x$`, `$\angle A$`, `$\overline{AB} = \overline{AC}$`
   - 블록 수식: `$$\triangle ABC \equiv \triangle DEF \; (\text{RHS 합동})$$`
2. **동적 DOM 수식 갱신 시 필수 처리**:
   - innerHTML로 동적 텍스트를 삽입한 후에는 반드시 `renderMathInElement(document.body, ...)` 또는 `katex.render(expr, el)`를 호출하여 실시간 렌더링을 보장합니다.

---

## 7. 🚀 신규 단원/페이지 추가 시 개발 체크리스트

1. [ ] **단원 테마 컬러 및 뱃지 설정**: 학년별 테마 컬러 및 단원 뱃지 명시.
2. [ ] **5단계 탐구 시나리오 설계**: 0(선수/조작) $\rightarrow$ 1(탐구/불변량) $\rightarrow$ 2(정당화/증명) $\rightarrow$ 3(정리/퀴즈) $\rightarrow$ 4/5(심화/히든).
3. [ ] **반응형 캔버스 2D 엔진 초기화**: 캔버스 크기 리사이즈 핸들러 및 디바이스 픽셀 비율(DPR) 보정.
4. [ ] **스마트 스냅 & 드래그 인터랙션 구현**: 꼭짓점, 격자점 스냅 및 60fps 재계산.
5. [ ] **Web Audio 피드백 연동**: 정답, 오답, 클릭, 해금 사운드 트리거.
6. [ ] **LMS SDK (`lms-integration.js`) 연동**: 로그인, 로컬 캐시, 단계 잠금/해금, 제출 동기화.
7. [ ] **교사용 5x5 관제실 및 마스터 패스워드 (`260523`, `260831`) 검증**.
8. [ ] **포털(`portal.html`) 카드 등록 및 링크 연동**.

---

## 8. 🔄 Git 자동 반영 및 버전 관리 규칙 (Git Workflow & Instant Sync)

1. **수정사항 즉시 Git 반영 원칙**:
   - 코드, 스타일, 설정, 데이터 스키마 또는 문서에 수정/추가/삭제 작업이 완료되면 **지체 없이 즉시 `git add`, `git commit`, `git push`를 실행하여 원격 저장소(`origin/main`)에 변경사항을 반영**합니다.
2. **명확한 커밋 메시지 작성**:
   - 작업 단위별로 명확하고 직관적인 커밋 메시지(예: `feat: ...`, `fix: ...`, `docs: ...`, `refactor: ...`)를 작성하여 이력을 체계적으로 관리합니다.
3. **원격 저장소 동기화 유지**:
   - 항상 로컬 작업 내역과 원격 저장소(`origin/main`)의 동기화 상태를 최신으로 유지합니다.

