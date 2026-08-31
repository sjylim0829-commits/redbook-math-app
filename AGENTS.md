# 🤖 작업 규칙 및 가이드라인 (Work Rules & Guidelines)

## 1. 🔄 수정사항 즉시 Git 반영 규칙 (Instant Git Sync Rule)
- 코드 수정, 신규 기능 추가, 버그 수정, 문서 갱신 등 **어떠한 수정사항이 발생하면 작업 완료 즉시 `git add`, `git commit`, `git push`를 실행하여 원격 저장소(`origin/main`)에 반영**합니다.
- 커밋 메시지는 작업 내용을 명확하게 설명하는 형태(예: `feat: 중1 좌표평면 교사 비밀번호 260831 추가`, `fix: ...`)로 작성합니다.

## 2. 📐 수학 웹 애플리케이션 개발 규칙
- 상세 규칙은 [`.agents/rules/math_webpage_guidelines.md`](file:///.agents/rules/math_webpage_guidelines.md)를 준수합니다.
- 교사 마스터 비밀번호(`260523`, `260831`) 및 관리자 인증 로직은 페이지 상에 노출되지 않도록 철저히 관리합니다.
