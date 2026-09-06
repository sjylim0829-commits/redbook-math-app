# 🤖 작업 규칙 및 가이드라인 (Work Rules & Guidelines)

## 1. 🔄 수정사항 즉시 Git 반영 규칙 (Instant Git Sync Rule)
- 코드 수정, 신규 기능 추가, 버그 수정, 문서 갱신 등 **어떠한 수정사항이 발생하면 작업 완료 즉시 `git add`, `git commit`, `git push`를 실행하여 원격 저장소(`origin/main`)에 반영**합니다.
- 커밋 메시지는 작업 내용을 명확하게 설명하는 형태(예: `feat: 중1 좌표평면 교사 비밀번호 260831 추가`, `fix: ...`)로 작성합니다.

## 2. 📐 수학 웹 애플리케이션 개발 규칙
- 기본 개발 표준 및 가이드라인: [`.agents/rules/math_webpage_guidelines.md`](file:///.agents/rules/math_webpage_guidelines.md)
- 교과서 기반 대화형 웹페이지 자동 제작 규칙:
  - [Part 1: 핵심 철학 및 캔버스·빈칸 설계](file:///.agents/rules/textbook_to_interactive_web_rules_part1.md)
  - [Part 2: 상태 관리, 물리 애니메이션, 품질 검증 및 문항 구조](file:///.agents/rules/textbook_to_interactive_web_rules_part2.md)
  - [마스터 인덱스 안내](file:///.agents/rules/textbook_to_interactive_web_rules.md)
  - 교과서 지면 제공 시 1:1 서브스텝 매핑, 좌표평면/캔버스 렌더링 규격, 빈칸 뚫기 원칙, 동적 점 드래그/스마트 스냅, 정규화 채점(`normTxt`) 등 상세 규칙 준수.
- 교사 마스터 비밀번호(`260523`, `260831`) 및 관리자 인증 로직은 페이지 상에 노출되지 않도록 철저히 관리합니다.

## 3. 🚫 정답 미노출 원칙 (Zero Answer Leakage in Placeholder/Hints)
- 학생이 답을 입력하는 빈칸의 `placeholder`, 안내 문구, 힌트 예시 등에 **해당 문제의 실제 정답(숫자, 수식, 텍스트 등)을 절대 직접적으로 노출하지 않습니다**.
- `placeholder`는 오직 입력 형식 안내(예: `placeholder="숫자 입력"`, `placeholder="기호 입력 (예: >, <)"`, `placeholder="소수 또는 합성수"`, `placeholder="예: 2, 3, 5 (작은 수부터)"`) 목적으로만 구성합니다.
- 서브에이전트 검증 루프는 모든 입력 필드의 `placeholder` 및 인접 힌트 텍스트에 실제 채점 정답이 노출되었는지 전수 감사하며, 정답 누출이 발견될 시 즉시 반려(`REJECT`)합니다.

## 4. 📄 소단원 '스스로 확인하기' 1문항 1페이지 원칙 (1 Question = 1 Substep)
- 교과서 각 소단원 말미의 '스스로 확인하기'에 수록된 모든 문항은 결코 한 화면에 병합하지 않고, **문제 1개당 독립된 1개 서브스텝(1페이지)**으로 분할하여 전용 시뮬레이터와 채점 폼을 배정합니다.

## 5. 🏆 대단원 '스스로 마무리하기' 전용 대주제 탭 및 1문항 1페이지 원칙
- 교과서 대단원 권말의 '스스로 마무리하기'는 다른 소단원/프로젝트와 섞지 않고 **별도의 독립 대주제 탭(예: Tab 5)**으로 단독 편성합니다.
- 수록된 모든 문항(01번~14번 등)을 **문제 1개당 1페이지(1 서브스텝)**로 1:1 완전 매핑하며, 후속 프로젝트(창의융합 등)는 별도 탭으로 연계합니다.

