---
name: runtime-rendering-logic-engineer
type: Skill
phase: Develop
description: |
  브라우저의 런타임 렌더링 파이프라인을 프로파일링하고, React/Next.js 환경에서의 물리적 성능을 극대화하는 하이퍼-엔지니어링 스킬.
  메인 스레드 스케줄링, 메모리 물리 제어, 60fps 인터랙션 무결성을 보장합니다.

  Tools:
  - Rendering Performance Profile: `assets/develop_templates/rendering_performance_profile.md`
---

# Runtime Rendering Logic Engineer (RRLE): Physics of Execution

## 1. 브라우저 커널 기반 렌더링 물리 (Browser Kernel Rendering Physics)

RRLE는 Blink 엔진과 Skia 그래픽 라이브러리의 물리적 파이프라인을 직접 제어합니다.

### 1.1 Render Pipeline Micro-Orchestration
- **Layout & Paint Invalidation Minimization**: 특정 스타일 변경이 유발하는 `Recalculate Style` -> `Layout` -> `Update Layer Tree` -> `Paint` -> `Composite` 과정을 최소화하기 위해 '물리적 레이어 분리(Layerization)'를 수행합니다.
- **GPU Rasterization Calculus**: 복잡한 SVG나 CSS 효과를 CPU 래스터화가 아닌 GPU 가속 래스터화 경로로 강제 전송하여 메인 스레드 렌더링 병목을 0으로 수렴시킵니다.
- **Visual Display List Optimization**: Skia 엔진의 디스플레이 리스트를 최적화하여 그래픽 연산의 중복을 제거하고 비디오 메모리(VRAM) 전송 효율을 극대화합니다.

### 1.2 Resource Loading & Network Physics
- **Critical Path Re-Ordering**: `Priority Hints`를 사용하여 LCP(Largest Contentful Paint)에 기여하는 시각 자산의 네트워크 브로드캐스트 우선순위를 물리적으로 최상단으로 끌어올립니다.
- **Binary/Serialization Entropy Control**: 데이터 페칭 시 JSON 엔트로피를 분석하여 브라우저의 전력 소모와 CPU 역직렬화 오버헤드를 줄이는 '데이터 물리 압축' 기술을 적용합니다.

## 2. React 18+ Concurrent 엔진 물리 (Concurrent Interaction Physics)

### 2.1 Virtual DOM Fiber Scheduling
- **Priority-Based Fiber Re-Routing**: `startTransition`과 `useDeferredValue`를 사용하여 긴급한 UI 상호작용(입력)과 비긴급 보조 렌더링(리스트 업데이트)의 Fiber 작업을 수리적으로 격리/스케줄링합니다.
- **Selective Hydration Engine**: `Suspense`와 `Server Components`를 활용하여 페이지 전체가 아닌, 사용자 활성 영역(Active Viewport)부터 선택적으로 하이드레이션 에너지를 집중 투입하는 '지능적 하이드레이션 분배'를 설계합니다.

### 2.2 Re-rendering Entropy Defense
- **Referential Integrity Physics**: `useMemo`, `useCallback`을 넘어서는 '참조 무결성 강화'를 통해 상위 컴포넌트의 렌더링 에너지가 하위 컴포넌트로 전이(Propagation)되는 것을 물리적으로 차단합니다.
- **State Batching Calculus**: 다발적인 상태 변경을 단일 렌더링 프레임으로 묶는 배치(Batching) 로직을 정교화하여 브라우저의 불필요한 레이아웃 재계산을 방지합니다.

## 3. V8 엔진 메모리 물리 및 가비지 컬렉션 (Memory & GC Physics)

대규모 데이터와 복잡한 컴포넌트 환경에서의 자원 한계에 대응합니다.

### 2.1 Virtual List & DOM Conservation
- **Spatial Culling Physics**: 수천 개의 데이터를 렌더링할 때 사용자의 뷰포트 영역만 실제 DOM에 유지하고 나머지는 메모리 상의 메타데이터로 관리하는 '공간적 도태(Spatial Culling)' 기법을 강제합니다.
- **Object Pool Maintenance**: 빈번하게 생성/파괴되는 DOM 노드나 컴포넌트 객체를 재사용하는 '객체 풀(Object Pool)' 아키텍처를 주입하여 가비지 컬렉션(GC) 부하를 설계 레벨에서 통제합니다.

### 2.2 Memory Leak Telemetry
- **Closure-Scope Audit**: 클로저로 인해 해제되지 않는 메모리 참조 경로를 추적하고, 컴포넌트 언마운트 시점에 모든 리스너와 타이머를 물리적으로 소멸시키는 원자적 정리(Atomic Cleanup) 로직을 적용합니다.

## 3. 60fps 인터랙션 물리 (Micro-Interaction Physics)

사용자가 인지하는 '부드러움'을 수치로 보장합니다.

### 3.1 Composite-Only Animation
- **GPU Acceleration Logic**: CPU 연산(Layout/Paint)을 유발하는 속성 대신 GPU 가속(Transform/Opacity)만을 사용하는 'Composite-Only' 애니메이션 경로를 강제하여 프레임 드롭을 방지합니다.
- **Input Responsiveness Calculus**: 버튼 클릭부터 프레임 렌더링까지의 지연 시간(Latency)을 측정하고, 16.6ms(60fps) 이내에 첫 응답 프레임이 생성되도록 비동기 핸들러를 물리적으로 정렬합니다.

---
> [!IMPORTANT]
> **"성능은 기능의 전제 조건이다."** RRLE는 아무리 복잡한 로직이라도 사용자에게는 마치 물리 법칙처럼 즉각적이고 부드럽게 반응하는 '지연 없는 경험'을 제공합니다.
