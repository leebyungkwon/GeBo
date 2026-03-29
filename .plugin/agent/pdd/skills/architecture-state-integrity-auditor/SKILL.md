---
name: architecture-state-integrity-auditor
type: Skill
phase: Develop
description: |
  기획 명세(FLA, DSE)를 기반으로 구현된 코드의 아키텍처와 상태 로직 무결성을 전수 감사하는 하이퍼-엔지니어링 스킬.
  컴포넌트 위계, 상태 전이, 타입 안전성(Type-Safety)의 완벽한 매핑을 보장합니다.

  Tools:
  - FE Implementation Fidelity Report: `assets/develop_templates/fe_implementation_fidelity_report.md`
---

# Architecture & State Integrity Auditor (ASIA): Implementation Guard

## 1. 아키텍처 및 위계 무결성 감사 (Architectural Integrity Audit)

ASIA는 코드가 기획에서 정의된 **'시스템 자산 위계'**를 충족하는지 구조적으로 검증합니다.

### 1.1 Atomic Component Mapping Audit
- **Hierarchy Verification**: `GCO`에서 정의된 아토믹 디자인 위계(Atom -> Molecule -> Organism)가 실제 파일 시스템 구조와 `Props` 주입 경로에서 100% 일치하는지 분석합니다.
- **Constraint-Based Prop Validation**: 컴포넌트에 주입되는 `Props`의 물리적 제약 조건이 기획상 밸리데이션 규칙과 기술적으로 정렬되었는지 확인합니다.

### 1.2 Structural Decoupling Enforcement
- **Logic-View Separation Physics**: 비즈니스 로직(Custom Hooks)과 UI 컴포넌트 간의 관심사 분리가 엄격히 실행되었는지 감사하여, 기획서의 '순수 논리'가 오염되지 않았음을 증명합니다.
- **Dependency Entanglement Check**: 컴포넌트 간의 순환 참조나 불필요한 의존성 엔트로피를 측정하여 아키텍처 수명을 보장합니다.

## 2. 상태 및 타입 무결성 엔지니어링 (State & Type-Safe Engineering)

### 2.1 State Calculus & Discriminated Unions (상태 전이 물리 대수)
- **Sum Type State Modeling**: `isLoading`, `isError` 같은 불리언 조합 대신 위계적 상태를 `type State = | { type: 'IDLE' } | { type: 'LOADING' } ...` 와 같은 서로소 합집합(Discriminated Unions)으로 모델링하여 불가능한 상태의 조합을 컴파일 타임에 차단합니다.
- **FSM Logic Binding**: `FLA`의 전제 조건($P$)과 결과 조건($Q$)을 수리적으로 매핑하는 `State Reducer` 또는 `Action Handler`의 인터페이스를 엄격히 정의합니다.

### 2.2 Schema Engineering Protocol (스키마 엔지니어링)
- **DSE Physics Mapping**: `DSE`에서 정의된 `Decimal`, `ISO8601` 등의 특수 타입을 처리하기 위한 전용 `Zod Transformer` 체인을 구축하여 데이터 정합성을 물리적으로 강제합니다.
- **Generic Protocol Synergy**: API 요청과 응답의 페이로드 구조가 기획서의 `Interface Spec`과 단 1비트의 타입 오차도 없도록 `Zod.infer<typeof schema>` 기반의 타입 추출을 전사적으로 적용합니다.

### 2.3 Component Contract & Slot Governance (컴포넌트 계약)
- **Prop-Invariants Check**: 컴포넌트 내부에서 변하지 않아야 하는 상숫값과 가변 `Props` 간의 충돌을 방지하기 위한 `Readonly` 속성 및 상속 관계를 정의합니다.
- **Slot Topology Verification**: `GCO` 추출 자산의 `Slot` 영역에 주입되는 하위 노드가 기획서의 시맨틱 위계를 파괴하지 않는지 위계적 감사를 수행합니다.

## 3. 예외 핸들링 아키텍처 (Error Logic Physics)

### 3.1 Error Code Bank Mapping
- **DSE Error-to-UI Mapping**: `DSE`에서 정의된 `ERR_4001` 등의 시스템 에러 코드를 실제 UI 컴포넌트(Toast, Modal)와 연결하는 `Error Boundary` 및 `Interceptor` 전략을 구체화합니다.
- **Atomic Rollback Implementation**: 비동기 통신 실패 시 클라이언트 상태를 이전의 안전한 상태(Safe State)로 되돌리는 롤백 물리 로직을 구현에 주입합니다.

## 4. 하이퍼-디테일 구현 무결성 산출물 규격

1. **[FE Implementation Fidelity Report]**: 컴포넌트 아키텍처, 상태 전이 무결성 점수, 타입 정합성 결과가 포함된 초정밀 구현 감사 리포트.

---
> [!IMPORTANT]
> **"코드는 기획의 물리적 실체여야 한다."** ASIA는 기획의 잉크가 코드의 비트(Bit)로 변하는 과정에서 발생하는 모든 '논리적 표류(Logical Drift)'를 소멸시킵니다.
