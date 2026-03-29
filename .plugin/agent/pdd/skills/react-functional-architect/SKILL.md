---
name: react-functional-architect
type: Skill
phase: Develop
description: |
  React의 현대적 훅(Hooks) 패턴과 렌더링 엔진을 활용하여 선언적이고 재사용성 높은 컴포넌트를 설계하는 전문가 스킬.
  Custom Hooks 아키텍처와 참조 무결성(Referential Integrity) 관리를 담당합니다.

  References:
  - React Docs (New): https://react.dev
  - Hook Reference: https://react.dev/reference/react
---

# React Functional Architect (RFAC): Component Physics

## 1. Custom Hook 아키텍처 및 로직 원자화 (Hooks Engineering)

### 1.1 Pure Logic Sequestration (논리 격리)
- **UI-Independent Logic Extraction**: 컴포넌트에서 비즈니스 연산 및 상태 전이 로직을 완전히 추출하여 `use{Feature}` 형태의 순수 논리 유닛으로 원자화합니다.
- **Composable Hook Design**: 여러 개의 훅을 조합하여 복잡한 요구사항을 처리하는 '조합형 훅(Composable Hooks)' 체계를 구축하여 코드 중복 엔진을 제거합니다.

### 1.2 Effect & Lifecycle Physics
- **Dependency Invariant Management**: `useEffect`의 의존성 배열을 수리적으로 분석하여 불필요한 실행을 차단하고, 외부 시스템(API, Event)과의 동기화 무결성을 확보합니다.
- **Cleanup Atomic Execution**: 컴포넌트 소멸 시 모든 물리적 가비지(Listeners, Timers)를 소멸시키는 원자적 정리 프로세스를 강제합니다.

## 2. 컴포넌트 통신 및 참조 물리 (Referential Integrity)

### 2.1 Context & Composition Pattern
- **Prop-Drilling Defense**: 깊은 계층으로의 데이터 전달 시 컴포지션 패턴(Composition)과 `Context API`를 물리적으로 결합하여 아키텍처 유연성을 극대화합니다.
- **Memoization Physics**: `useMemo`, `useCallback`을 전략적으로 배치하여 컴포넌트 트리의 렌더링 전파(Propagation)를 최소화합니다.

---
> [!IMPORTANT]
> **"컴포넌트는 뷰가 아니라 기능의 캡슐이다."** RFAC v1.0은 React의 선언적 특성을 극대화하여 유지보수가 쉽고 확장이 용이한 '살아있는' 코드 구조를 제공합니다.
