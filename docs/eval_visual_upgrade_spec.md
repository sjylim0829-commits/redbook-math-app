# 📋 [설계 명세서] 중1 수학 웹 앱 시각/애니메이션 고도화 전단원 검증 (eval_visual_upgrade_spec.md)

본 문서는 **Redbook 메인 에이전트**가 중학교 1학년 수학 웹 애플리케이션 전체(1단원 ~ 8단원)를 대상으로 단행한 **[시각/애니메이션 고도화 - 저사양 환경 최적화]**의 개발 의도와 검증 기준을 정의한 명세서입니다.  
**독립 서브에이전트**는 본 명세서를 기반으로 8개 전 단원 HTML 파일의 브라우저 DOM/JS 런타임 환경에서 기능들을 전수 검증하며, **90% 이상의 달성도**를 기록할 때 최종 통과(`PASS`) 판정을 부여합니다.

---

## 🎯 1. 고도화 배경 및 교육적 목표
1. **저사양 에이전트 환경(AWS Lightsail 1vCPU, 1~2GB RAM) 절대 최적화**:
   - 무거운 Node.js 번들러(`webpack`, `vite` 등) 도입 금지.
   - 순수 HTML5 + 브라우저 내장 Canvas 2D + 바닐라 JS(ES6+) 단일 파일 체계 유지.
2. **동적 학습 몰입도 극대화**:
   - **프레임 기반 부드러운 물리 애니메이션 (Lerp 감속)**: 수치 조작 시 즉각적인 순간이동 대신 지수 감속(`dx * 0.12`)으로 우아하게 이동하며, 목표 도달 시 루프를 즉각 종료(`cancelAnimationFrame`)하여 전력과 CPU를 보존.
   - **Zero-Dependency 캔버스 콘페티 (축하 폭죽)**: 외부 라이브러리 없이 순수 Canvas 2D 45개 파티클 폭죽으로 정답 성취감 배가.
   - **게이미피케이션 & 네온 UI**: 노란 정답 빈칸 포커스 시 GPU 가속 네온 글로우 및 `scale(1.04)` 확대 효과.

---

## 🧩 2. 핵심 설계 의도 (Intents) 및 검증 항목

### [INTENT-01] 🚫 Zero-Build & 경량 단일 파일 원칙
- 외부 빌드 번들러(webpack, vite, rollup 등) 의존성 0건.
- 순수 단일 HTML 파일로 즉시 브라우저에서 실행 가능한 노빌드 구조 유지.

### [INTENT-02] 🌟 게이미피케이션 & 네온 UI CSS (전 단원 100% 적용)
- `.proof-input-text`에 포커스 시 부드러운 네온 글로우(`box-shadow: 0 0 0 2px #6366f1, 0 0 16px rgba(99, 102, 241, 0.45)`) 적용.
- 포커스 시 GPU 하드웨어 가속 미세 확대(`transform: scale(1.04); will-change: transform;`) 및 트랜지션 적용.

### [INTENT-03] 🪅 스프링 바운스 축하 카드 (`bounceInCard` 애니메이션)
- 정답 확인 카드(`.verified-answer-card`) 등장 시 쫀득한 스프링 바운스(`cubic-bezier(0.34, 1.56, 0.64, 1)`) 애니메이션 탑재.

### [INTENT-04] 🎊 Zero-Dependency Canvas 2D 콘페티 엔진 (`launchConfetti`)
- 외부 라이브러리 설치 없이 순수 Canvas 2D 기반 초경량 폭죽 엔진 탑재.
- 1.2초간 45개 다채로운 색상의 종이 조각이 중력/공기저항에 따라 흩날린 후 DOM에서 자동 소멸.

### [INTENT-05] ⚙️ 절전형 물리 애니메이션 엔진 (`startSmoothLerp`)
- 상태 변화 시 지수 감속(`current += diff * 0.12`) 물리 이동.
- 오차 0.005 미만 수렴 시 즉시 `cancelAnimationFrame`으로 루프를 영구 중단하여 CPU 점유율 0% 유지.

### [INTENT-06] 🚀 정답 통과 시 콘페티 자동 발사 연동
- `renderVerifiedAnswerView()` 실행 시 자동으로 `launchConfetti()`가 호출되어 시각적 축하 피드백 제공.

### [INTENT-07] 📚 8개 전 단원 일괄 탑재 및 패리티 검증
- 다음 8개 대상 파일 전체에 고도화 모듈이 100% 누락 없이 적용되어야 함:
  1. `g1_ch1_factors.html` (1단원 소인수분해)
  2. `g1_ch2_integers.html` (2단원 정수와 유리수)
  3. `g1_ch3_equations.html` (3단원 문자와 식)
  4. `g1_coordinate.html` (4단원 좌표평면과 그래프)
  5. `g1_ch5_geometry_base.html` (5단원 기본 도형)
  6. `g1_ch6_plane_figures.html` (6단원 평면도형)
  7. `g1_ch7_solid_figures.html` (7단원 입체도형)
  8. `g1_ch8_statistics.html` (8단원 자료의 정리와 해석)

### [INTENT-08] 🚫 정답 미노출 원칙 (Zero Answer Leakage)
- 고도화 반영 후에도 모든 입력 필드의 `placeholder`에 정답 누출이 0건이어야 함.

### [INTENT-09] 🎨 캔버스 빈 공간 0건 원칙 (Zero Blank Canvas)
- 각 단원의 Two.js / Canvas 시뮬레이터가 정상적으로 그래픽 객체를 생성하고 렌더링해야 함.

### [INTENT-10] 🔐 보안 및 교사 마스터 바이패스 보존
- 교사 마스터 비밀번호(`260523`, `260831`) 인증 및 4대 모달 시스템이 100% 정상 보존되어야 함.

---

## 📊 3. 평가 배점표 (100점 만점)
| ID | 평가 항목 | 배점 | 비고 |
|:---|:---|:---:|:---|
| INTENT-01 | Zero-Build & 경량 단일 파일 원칙 | 10점 | 외부 번들러 부재 확인 |
| INTENT-02 | 게이미피케이션 & 네온 UI CSS | 15점 | 포커스 글로우 및 scale(1.04) |
| INTENT-03 | 스프링 바운스 축하 카드 애니메이션 | 10점 | bounceInCard 키프레임 |
| INTENT-04 | Canvas 2D 콘페티 엔진 탑재 | 15점 | launchConfetti 함수 완비 |
| INTENT-05 | 절전형 물리 애니메이션 엔진 탑재 | 10점 | startSmoothLerp 및 rAF 제어 |
| INTENT-06 | 정답 통과 시 콘페티 자동 발사 연동 | 10점 | renderVerifiedAnswerView 연동 |
| INTENT-07 | 8개 전 단원 일괄 탑재 및 패리티 | 15점 | 8개 HTML 파일 전수 확인 |
| INTENT-08 | 정답 미노출 원칙 전수 감사 | 5점 | placeholder 정답 유출 0건 |
| INTENT-09 | 캔버스 빈 공간 0건 전수 감사 | 5점 | 캔버스 렌더러 무결성 |
| INTENT-10 | 보안 및 교사 마스터 바이패스 보존 | 5점 | 마스터 비밀번호 및 모달 |
| **합계** | **총 10개 핵심 항목** | **100점** | **90점 이상 합격 (PASS)** |
