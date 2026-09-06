# 📘 교과서 기반 인터랙티브 수학 웹 애플리케이션 제작 규칙 (Index)
(Textbook-to-Interactive Math Web App Generation Rules - Master Index)

본 문서는 가독성 및 컨텍스트 최적화(단일 파일 12,000자 초과 방지)를 위해 다음 2개의 전용 규칙 파일로 분할되었습니다. 각 세부 사항은 해당 문서를 참조하십시오:

---

### 1. [Part 1: 핵심 철학 및 캔버스·빈칸 설계](file:///home/ubuntu/workspace/Redbook/.agents/rules/textbook_to_interactive_web_rules_part1.md)
- **1. 🧭 전체 개발 철학 및 변환 원칙**: 지면 1:1 대화형 인터랙션화, 5단계 탐구 순환, 싱글 파일 번들
- **2. 📚 교과서 코너별 웹 인터랙션 매핑 표준**: 되짚어보기, 생각열기, 개념 학습, 문제/예제, 스스로 확인하기, 생각 넓히기
- **3. 📐 좌표평면 및 기하 캔버스 구성 상세 규칙 (Canvas Engine)**: 그리드 규격, 사분면 시각화, 인터랙티브 점 드래그 & 스마트 자석 스냅, 캔버스 클릭 점 찍기(Plotting), 투명 펜 드로잉 오버레이
- **4. 🔲 빈칸(Blank / Input) 설계 및 채점·검증 규칙**: 5대 핵심 빈칸 영역, 인풋 UI 스타일, 정답 미노출 원칙(Zero Answer Leakage), `normTxt` 정규화 채점, 피드백 & 해설 카드

---

### 2. [Part 2: 상태 관리, 물리 애니메이션, 품질 검증 및 문항 구조](file:///home/ubuntu/workspace/Redbook/.agents/rules/textbook_to_interactive_web_rules_part2.md)
- **5. ⚙️ 데이터 상태 관리 및 영속화 규칙**: 전역 State 스키마, 자동 저장/복원, 교사 관리자 모드(`260523`, `260831`)
- **6. 🧩 교과서 요소를 웹 인터랙션으로 변환하는 8대 핵심 디자인 패턴**: 정적 삽화 $\rightarrow$ Two.js, 실시간 드래그, 다중 점 목표 배치 등
- **7. ⚡ 프레임 기반 물리 애니메이션 및 화면 고정 방지 표준 규격**: `startSmoothLerp` 수렴 안전 가드, `activeLerpAnimations` 취소 로직
- **8. 🤖 서브에이전트 검증 규칙 및 8대 무조건 반려(REJECT) 원칙**: 로그인, 교사 패스워드, 정답 미노출, 빈 캔버스, 화면 고정, 1문항 1페이지 등 8대 기준
- **9. 📋 타 단원 개발 지시 및 검증 11대 체크리스트**: 지면 무손실, 동적 조작성, KaTeX 표준, Git 즉시 동기화 등
- **10. 📝 소단원 '스스로 확인하기' 1문항 1페이지 상세 표준 (1 Question = 1 Substep)**
- **11. 🏆 대단원 '스스로 마무리하기' 전용 탭 편성 및 1문항 1페이지 상세 표준 (Tab 5)**
