---
name: visual-context-provider
type: Skill
phase: Pre-Planning (Screen Context)
description: |
  기획 업무(Step 04) 시작 전, 대상 페이지의 시각적 형태를 확보하고 분석하는 스킬입니다.
  HTML 소스 확인, 사용자 캡처 요청, 혹은 에이전트 직접 캡처를 통해 'Visual Context'를 완성합니다.

  Tools:
  - browser_subagent (직접 캡처용)
  - read_file / view_file (HTML 분석용)
---

# Visual Context Provider Skill Instructions

## 1. 사용 시점
- 04. Service Planner가 기획 업무를 시작하기 직전 동시 수행.
- 대상 화면의 구체적인 UI 구성이나 기존 데이터 항목이 불분명할 때 필수 사용.

## 2. 시각적 자산 확보 프로세스 (4단계)

### Step 1: HTML 정적 분석
- 먼저 대상 페이지의 `index.html` 혹은 관련 컴포넌트 소스가 있는지 확인합니다.
- 코드가 존재한다면 내용을 읽어 주요 필드와 구조를 파악합니다.

### Step 2: 사용자 캡처 협업 요청
- 사용자에게 다음과 같이 정중히 요청합니다.
- "> 기획을 더 정교하게 진행하기 위해 현재 화면의 캡처 이미지가 필요합니다. 직접 캡처해서 전달해 주시겠습니까, 아니면 제가 브라우저를 띄워 직접 캡처할까요?"

### Step 3: 선택적 자동 캡처 수행
- 사용자가 거절하거나 에이전트에게 위임할 경우, `browser_subagent`를 사용하여 다음을 수행합니다.
  - 대상 URL에 접속 (Local 혹은 Dev 환경).
  - 전체 화면 혹은 핵심 영역 스크린샷 채득.
  - 이미지 파일 저장: `docs/pages/{page}/cap_{page}.png`.

### Step 4: 컨텍스트 바인딩
- 확보된 이미지 경로를 메모리에 유지하고, `fe_{page}.md` 설계서 최상단에 다음과 같이 임베드합니다.
- `![Reference Screen](./cap_{page}.png)`

## 3. 주의 사항
- 직접 캡처 시, 민감한 정보(개인정보 등)가 포함되지 않도록 주의합니다.
- 확보된 시각 정보와 기획 문서가 서로 충돌할 경우, 기획자의 의도(PRD)를 우선하되 시각적 불합리함이 있다면 사용자에게 질문합니다.
