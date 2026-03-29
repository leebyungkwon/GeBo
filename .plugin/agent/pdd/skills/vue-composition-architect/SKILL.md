---
name: vue-composition-architect
type: Skill
phase: Develop
description: |
  Vue 3의 Composition API와 Reactivity System의 물리적 동작 방식을 마스터하여,
  확장 가능하고 고성능의 Vue 애플리케이션을 설계하는 스킬.

  References:
  - Official Docs: https://vuejs.org/guide/introduction.html
  - Composition API: https://vuejs.org/guide/extras/composition-api-faq.html
---

# Vue Composition Architect (VCAR): Reactivity Physics

## 1. 반응형 시스템 및 데이터 흐름 (Reactivity Mechanics)

### 1.1 Proxy-based Reactivity Engineering
- **Ref/Reactive Calculus**: `ref`와 `reactive`의 물리적 차이(객체 래핑 vs 프록시 타겟)를 이해하고, 원시값과 참조값이 반응형 엔진에서 처리되는 방식을 최적화합니다.
- **Dependency Tracking Optimization**: `computed`와 `watchEffect`의 의존성 수집 메커니즘을 제어하여 불필요한 이펙트 실행 엔트로피를 최소화합니다.

### 1.2 Composables Pattern & Logic Extraction
- **Stateful Logic Reusability**: 로직을 `use{Feature}` 형태의 Composable로 추출하여 가독성과 재사용성을 극대화하는 '함수형 컴포지션' 아키텍처를 구축합니다.
- **Lifecycle Injection**: Composable 내부에서 `onMounted`, `onUnmounted` 등의 라이프사이클을 안전하게 주입하여 컴넌트와의 물리적 결합도를 낮춥니다.

## 2. 컴포넌트 통신 및 렌더링 무결성 (Component Physics)

### 2.1 Script Setup & Type Safety
- **Compiler Macro Engineering**: `<script setup>` 모드에서의 `defineProps`, `defineEmits` 매크로를 활용하여 컴파일 타임의 타입 무결성을 확보합니다.
- **Template-to-Script Integration**: 템플릿의 변수 바인딩과 스크립트의 반응형 데이터 간의 싱크를 0ms 지연으로 유지하는 물리 구조를 설계합니다.

### 2.2 Teleport & Fragment Control
- **DOM Hierarchy Manipulation**: `Teleport`를 사용하여 UI 논리적 위계와 물리적 DOM 위치를 분리(Portaling)하고, Fragment 레이아웃 무결성을 감사함.

---
> [!IMPORTANT]
> **"프레임워크는 논리의 그릇이다."** VCAR v1.0은 Vue의 간결함 속에 숨겨진 강력한 반응형 물리 엔진을 100% 인지하고 제어하여, 기획의 역동성을 완벽하게 구현합니다.
