---
name: advanced-state-management-orchestrator
type: Skill
phase: Develop
description: |
  서버 상태(Server State)와 클라이언트 전역 상태(Global UI State)의 싱크 및 데이터 흐름을 오케스트레이션하는 하이퍼-엔지니어링 스킬.
  TanStack Query, Zustand, Pinia 등을 활용한 비동기 물리 제어를 담당합니다.

  References:
  - TanStack Query: https://tanstack.com/query/latest/docs/framework/react/overview
  - Zustand: https://zustand.demo.pmnd.rs/
  - Pinia: https://pinia.vuejs.org/
---

# Advanced State Management Orchestrator (ASMO): Data Sync Physics

## 1. 서버 상태 동기화 및 캐싱 물리 (Server State Orchestration)

### 1.1 Cache Invalidation & Refetching Calculus
- **Stale-While-Revalidate Engine**: 데이터의 신선도(StaleTime)와 캐시 유지 시간(CacheTime)을 수리적으로 설계하여 불필요한 네트워크 요청 엔트로피를 제거합니다.
- **Manual Query Invalidation**: 뮤테이션(Mutation) 성공 시 관련 쿼리를 원자적으로 무효화(Invalidate)하여 UI-서버 데이터 싱크 무결성을 확보합니다.

### 1.2 Optimistic Update & Rollback Mechanics
- **Predictive UI Physics**: 서버 응답 이전에 UI를 즉시 업데이트하고, 실패 시 이전 상태로 정밀하게 롤백(Atomic Rollback)하는 낙관적 업데이트 로직을 구축합니다.
- **Parallel & Dependent Queries**: 다발적인 비동기 요청을 병렬 처리하거나, 의존 관계(Dependent)에 따라 순차 실행하는 물리적 실행 경로를 최적화합니다.

## 2. 클라이언트 전역 상태 및 스토어 설계 (Global UI State Physics)

### 2.1 Store Fragmentation Strategy
- **Atomic State Pattern**: 거대한 단일 스토어 대신 기능 단위로 분절된 '원자적 스토어(Atomic Stores)' 아키텍처를 적용하여 불필요한 렌더링 전파(Re-rendering Propagation)를 차단합니다.
- **Setter/Getter Calculus**: 상태 변경 경로를 명확히 정의(Actions/Reducers)하여 상태 추적 가능성(Traceability)을 100% 확보합니다.

### 2.2 Cross-Agent Data Flow Binding
- **State Hydration Physics**: 서버 사이드에서 생성된 초기 상태를 클라이언트 스토어로 물리적으로 주입(Hydration)하고, 로컬 스토리지와의 영속성(Persistence) 동기화를 제어합니다.

---
> [!IMPORTANT]
> **"상태는 흐르는 에너지이자 정적인 진실이다."** ASMO v1.0은 비동기 세상의 불확실성을 수리적으로 통제하여, 사용자에게 항상 신뢰할 수 있는 데이터를 가장 빠른 물리적 속도로 전달합니다.
