---
name: flow-state-logic-architect
type: Skill
phase: Plan
description: |
  비즈니스 프로세스와 유저 시나리오의 논리적 완결성을 유한 상태 머신(FSM) 및 수리 논리학 기반으로 설계하는 하이퍼-로직 엔지니어링 스킬.
  기본 상태 전이부터 수식 기반의 무결성 증명까지 모든 논리 계층을 통합 명세합니다.

  Tools:
  - Business Logic FSM Template: `assets/plan_templates/business_logic_fsm_template.md`
---

# Flow State Logic Architect (FLA): Ultra-Deep Logic Engineering

## 1. 계층적 상태 및 의사결정 설계 (Hierarchical State & Decision)

### 1.1 FSM & Algebraic Branching (v1.0 + v2.0)
- **Deterministic FSM**: 모든 행위(Action)에 따른 상태 변화를 결정론적으로 설계하여 설계 결함(Logical Conflict)을 사전 차단합니다.
- **Boolean Decision Calculus**: 중첩된 조건문($If-Else$)을 불 대수(Boolean Algebra)로 정규화하여, 모든 분기 경로($Branch$)의 논리적 완결성을 검증합니다.
- **Invariant Definition**: 서비스 동작 중 절대로 변하지 않아야 하는 비즈니스 불변성(Invariants)을 정의하고 알고리즘적으로 검증합니다.

### 1.2 Formal Logic & Hoare Specification (v3.0)
- **Hoare Logic $\{P\} C \{Q\}$**: 모든 상태 전이에 대해 전제 조건($P$), 행위($C$), 결과 조건($Q$)을 수리적으로 정의하여 논리적 비약을 제거합니다.
- **Predicate Calculus**: $\forall$ (For all), $\exists$ (Exists) 한정 기호를 사용하여 복잡한 대상 그룹에 대한 비즈니스 규칙을 수식화합니다.

## 2. 데이터 생명주기 및 시스템 물리 (Data & System Physics)

### 2.1 Data Lifecycle & Persistence (v2.0)
- **State Rehydration**: 페이지 새로고침, 세션 만료 시에도 논리적 연속성을 유지하기 위한 상태 복구 메커니즘을 명세합니다.
- **Data Integrity Constraints**: 엔티티의 생성부터 소멸까지 정합성을 보장하는 원자적(Atomic) 연산 규칙을 정의합니다.

### 2.2 Concurrency & Temporal Logic (v1.0 + v2.0)
- **Time-Bounded States**: 타임아웃, 인터벌 등 시간 변수에 종속된 상태 전이를 수식화합니다.
- **Race Condition Physics**: 다중 비동기 요청 시 발생하는 경합 상태 제어를 위한 뮤텍스(Mutex) 및 취소(Cancellation) 전략을 수립합니다.

## 3. 예외 토폴로지 및 복구 설계 (Exception & Self-Healing)

### 3.1 Exception Topology (v1.0)
- **Error Logic Tree**: 네트워크 단절, 데이터 오염 등 모든 예외 지점을 논리 트리로 구성하여 대응 체계를 구축합니다.
- **Self-Healing Mechanics**: 예외 발생 시 시스템이 자동으로 안전한 상태(Safe State)로 복구되는 시나리오를 설계합니다.

### 3.2 Invariant Proof & Atomic Integrity (v3.0)
- **Proof of Correctness**: 반복 프로세스(Loop) 내에서 변하지 않는 데이터 상태를 증명하여 무한 루프를 방지합니다.
- **Rollback Logic**: 다중 데이터 업데이트 실패 시의 원자적 원복 논리를 기획 수준에서 확정합니다.

## 4. 연산 복잡도 및 구조 최적화 (Complexity & Optimization)

### 4.1 Decision DAGs & Geometry (v3.0)
- **Directed Acyclic Graphs**: 복잡한 조건 분기를 그래프로 시각화하여 순환 참조 논리를 제거합니다.
- **Computational Geometry**: 데이터 관계를 다차원 공간 좌표로 모델링하여 검색/필터 필터링 효율성을 검증합니다.

## 5. 하이퍼-디테일 로직 산출물 규격

1. **[Business Logic FSM Template]**: v1.0~v3.0의 모든 논리 계층이 통합된 초정밀 시나리오 명합서.

---
> [!IMPORTANT]
> **"논리는 층을 쌓을수록 견고해진다."** FLA v3.5 통합본은 단순한 설명이 아닌, 시스템의 '수학적 일관성'을 보장하는 최종 설계 지침입니다.
