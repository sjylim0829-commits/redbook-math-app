# 🤖 작업 규칙 및 가이드라인 (Work Rules & Guidelines)

## 1. 🔄 수정사항 즉시 Git 반영 규칙 (Instant Git Sync Rule)
- 코드 수정, 신규 기능 추가, 버그 수정, 문서 갱신 등 **어떠한 수정사항이 발생하면 작업 완료 즉시 `git add`, `git commit`, `git push`를 실행하여 원격 저장소(`origin/main`)에 반영**합니다.
- 커밋 메시지는 작업 내용을 명확하게 설명하는 형태(예: `feat: 중1 좌표평면 교사 비밀번호 260831 추가`, `fix: ...`)로 작성합니다.

## 2. 📐 수학 웹 애플리케이션 개발 규칙
- 기본 개발 표준 및 가이드라인: [`.agents/rules/math_webpage_guidelines.md`](file:///.agents/rules/math_webpage_guidelines.md)
- 교과서 기반 대화형 웹페이지 자동 제작 규칙: [`.agents/rules/textbook_to_interactive_web_rules.md`](file:///.agents/rules/textbook_to_interactive_web_rules.md)
  - 교과서 지면 제공 시 1:1 서브스텝 매핑, 좌표평면/캔버스 렌더링 규격, 빈칸 뚫기 원칙, 동적 점 드래그/스마트 스냅, 정규화 채점(`normTxt`) 등 상세 규칙 준수.
- 교사 마스터 비밀번호(`260523`, `260831`) 및 관리자 인증 로직은 페이지 상에 노출되지 않도록 철저히 관리합니다.

## 3. 🚫 정답 미노출 원칙 (Zero Answer Leakage in Placeholder/Hints)
- 학생이 답을 입력하는 빈칸의 `placeholder`, 안내 문구, 힌트 예시 등에 **해당 문제의 실제 정답(숫자, 수식, 텍스트 등)을 절대 직접적으로 노출하지 않습니다**.
- `placeholder`는 오직 입력 형식 안내(예: `placeholder="숫자 입력"`, `placeholder="기호 입력 (예: >, <)"`, `placeholder="소수 또는 합성수"`, `placeholder="예: 2, 3, 5 (작은 수부터)"`) 목적으로만 구성합니다.
- 서브에이전트 검증 루프는 모든 입력 필드의 `placeholder` 및 인접 힌트 텍스트에 실제 채점 정답이 노출되었는지 전수 감사하며, 정답 누출이 발견될 시 즉시 반려(`REJECT`)합니다.

