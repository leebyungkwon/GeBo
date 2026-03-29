---
name: discovery-scoping-facilitator
type: Skill
phase: Discovery / Scoping / Strategy
description: |
  사용자의 파편화된 아이디어를 비즈니스 임팩트, 데이터 아키텍처, 운영 거버넌스 관점에서 통합 분석하여 '전략적 요구사항 정의서'로 승화시키는 초전문가용 기획 스킬입니다.
  단순 수렴을 넘어, 문제의 본질(Problem Space)과 해결책의 구조(Solution Space)를 분리하여 프로젝트의 성공 궤도를 설계합니다.

  Tools:
  - notify_user (전략적 인터뷰 캔버스 기반 질문)
  - search_web (산업 표준 기술 스택 및 Global Best Practice 벤치마킹)
  - read_file / view_file (프로젝트 히스토리 및 기존 산출물 정합성 확인)

  Resources (Assets):
  - Strategic Interview Canvas: `assets/pm_templates/discovery_canvas.md`
  - Entity Relationship Mapper: `assets/pm_templates/entity_relationship_mapper.md`
---

# Discovery & Scoping Facilitator: Strategic Architecture

## 1. 전략적 발굴 프레임워크 (Strategic Discovery Framework)

PM은 아이디어를 분석하기 전, 아래의 **'3단 심층 분석 캔버스'**를 통해 요구사항의 유전자를 해독합니다.

### 1.1 Problem-Solution Fit 감사 (The 5-Whys & 1-How)
표면적 요청(Solution) 뒤에 숨겨진 실질적 결핍(Problem)을 도출합니다.
- **Root Cause Analysis**: "이 기능이 없을 때 발생하는 운영상의 병목(Bottleneck)을 수치화하면?"
- **North Star Metric (NSM)**: 이 기능의 성패를 가를 단 하나의 핵심 지표(예: Task 성료 시간 30% 단축)를 정의합니다.
- **Counter-Metric**: 본 기능 도입 시 나빠질 수 있는 지표(예: UI 복잡도 증가)를 미리 식별하여 균형을 맞춥니다.

### 1.2 논리적 데이터 모델링 및 리니지 (Logical Data Architecture)
기획 단계에서 데이터의 뼈대를 세워 설계 누락을 원천 차단합니다.
- **Core Entities & Attributes**: 필수 데이터 객체(Domain Object)와 그 핵심 속성을 식별합니다. (예: Order - Status, Amount, UserRef)
- **Conceptual ERD**: 데이터 간의 카디널리티(1:1, 1:N, N:M)와 '영속성(Persistence)' 요건을 정의합니다.
- **Data Lifecycle (CRUD)**: 데이터가 생성(C)되어 최종적으로 아카이빙(D)되는 전 과정을 상태 전이 규칙(State Transition Rules) 기반으로 설계합니다.

### 1.3 기술 혁신 및 자산 활용 분석 (Innovation & Heritage Audit)
단순한 기능 정의를 넘어, '어떤 방식'으로 구현하는 것이 비즈니스적으로 최적인지 분석합니다.
- **Innovation Radar**: 본 요구사항을 해결하기 위한 신기술(AI, 차세대 라이브러리, 새로운 아키텍처 패턴 등)의 도입이 혁신적 가치를 주는가?
- **Legacy Leverage**: 기존에 구축된 레거시 시스템이나 기술 자산 중 재사용 가능한 것이 있는가? (구현 비용 절감 및 안정성 확보)
- **Technical Feasibility Hypothesis**: 기획 단계에서 기술적 한계를 미리 예측하고, "이 기술을 쓰면 이런 혁신이 가능하다"는 가설을 세웁니다.

## 2. 정밀 스코핑 및 거버넌스 정의 (Scoping & Governance)

아이디어의 확장성을 고려하되, 당장의 구현 범위를 날카롭게 확정(Scoping)합니다.

### 2.1 MoSCoW 기반 프로젝트 바운더리
- **Must-Have (MVP)**: 비즈니스 가치를 입증하기 위한 최소 기능 세트.
- **Should-Have**: 향후 고도화 시 최우선 순위로 고려될 기능 (기술적 구조에는 미리 반영).
- **Non-Goals (Constraint)**: 사용자 기대치를 관리하기 위해 명시적으로 '개발 안 함'을 선언하는 영역.

### 2.2 리스크 및 의존성 매트릭스 (Technical Dependency)
- **External Dependency**: 외부 API 연동 지연, 타 팀과의 협의 사항 등 외부 변수를 식별합니다.
- **Technical Debt Forecast**: 이번 일정 내 구현을 위해 감수해야 할 기술적 부채와 상환 계획을 명시합니다.

## 3. 실행 및 핸드오버 프로토콜 (Execution SOP)

1.  **Strategic Context Discovery**: `notify_user`를 통해 위 캔버스 기반의 **'입체적 질문 셋트'**를 전달합니다. 이때 단순히 묻는 것이 아니라, 리서치 결과를 포함한 **'가설(Hypothesis)'**을 함께 제시하여 사용자의 통찰을 이끌어냅니다.
2.  **Asset Drafting**: 사용자의 답변이 수집되면 아래 자산을 즉시 작성합니다.
    - `assets/pm_templates/discovery_canvas.md`를 채워 전략 방향 확정.
    - `assets/pm_templates/entity_relationship_mapper.md`를 채워 데이터 기반 설계 초안 작성.
3.  **Logic Reconciliation**: 사용자의 답변이 기존 시스템 구조와 충돌할 경우, 기술적 타당성(Feasibility)를 근거로 대안을 제시하는 'Negotiator' 역할을 수행합니다.
4.  **Requirement Ingestion**: 승인된 스코프를 `plan_{page}.md`의 '1. 개요'부터 '5. 비즈니스 로직'까지 구조화된 형태로 즉시 이식합니다.

---
> [!IMPORTANT]
> **"최악의 PM은 받아쓰기만 하는 PM이다."** 비즈니스 요구사항을 가장 경제적이고 견고한 논리 구조로 치환하는 **'시스템 설계자'**로서의 전문성을 발휘하십시오.
