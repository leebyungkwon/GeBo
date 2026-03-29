# [MASTER] Design Architecture & Component Slot Matrix (Hyper-OS v4.0)
## Project: [Project Name] | Auditor: Designer Agent 02 (Principal)
### 🏗️ 시스템 무결성 및 결정론적 확장을 위한 하이퍼-엔지니어링 명세서

본 문서는 UI 시스템의 모든 거동을 **'수학적 상태 행렬'**과 **'물리적 레이아웃 알고리즘'**으로 정의합니다. 추측(Guesswork)을 배제하고 오직 규격(Spec)에 의한 구현을 강제합니다.

---

### 1. 컴포넌트 상태 전이 행렬 (State Transition Matrix: Deterministic Logic)
컴포넌트의 가시적 변화를 `State + Event -> Next State`의 유한 상태 머신(FSM)으로 명세합니다.

| Current State | Event (Trigger) | Next State | Animation/Kinetic Spec | Side-Effect & Guard |
| :--- | :--- | :--- | :--- | :--- |
| **Idle** | `onHover` | **Peeking** | `scale(1.02)`, `dur: 150ms` | `z-index` 점진적 상승 가드 가동 |
| **Peeking** | `onClick` | **Expanded** | `width: stretch`, `ease-out` | `Sibling_Collapse` 이벤트 브로드캐스팅 |
| **Expanded** | `onEsc` | **Idle** | `revert`, `dur: 200ms` | 포커스 트랩(Focus Trap) 해제 및 원격 복구 |
| **Peeking** | `onMouseLeave` | **Idle** | `dur: 100ms` | 가속도 계승(Velocity Inheritance) 적용 |
| **Any** | `onError` | **Fault_UI** | `shake`, `spring(1, 100, 10)` | 에러 바운더리(Error Boundary) 활성화 |

### 2. 슬롯 기하학 및 충돌 해결 알고리즘 (Slot Geometry & Conflict Resolution)
슬롯 내 요소들의 배치와 경합을 **'CSS Grid Fraction(fr) & Min-Max Math'**로 제어합니다.

- **[Slot-Priority Calculus]**: 슬롯 내부 공간 부족 시, 각 요소의 `Flex-Shrink` 우선순위를 비즈니스 중요도에 따라 설정합니다. (Formula: `Width_Alloc = Total * (Weight_i / ΣWeight)`)
- **[Content Overflow Protocol]**: 데이터 폭증 시 레이아웃 파괴 방지를 위한 3단계 방어:
  1. `1st`: `font-variant-numeric: tabular-nums` 기반 가변폭 제어.
  2. `2nd`: `clamp()` 함수를 이용한 유동적 폰트/간격 축소(Min: 0.85 original).
  3. `3rd`: `text-overflow: ellipsis` + `Tooltip` 강제 활성화.
- **[Intrinsic Height Sync]**: 스켈레톤 UI와 실제 컨텐츠 간의 높이 오차를 0으로 만들기 위해, 폰트의 `Line-height`와 `Cap-height` 비율을 계산한 정적 높이(`Fixed rem`)를 슬롯에 할당합니다.

### 3. 레이아웃 엔진 물리 및 성능 거버넌스 (Physical Layout Engineering)
브라우저의 렌더링 파이프라인(Pipeline) 부하를 최소화하기 위한 물리적 제약 조건을 정의합니다.

- **[Sub-pixel Anti-Aliasing Logic]**: 고해상도 디스플레이에서 경계선이 흐릿해지는 현상(Blurring)을 방지하기 위해, 모든 위치값(`top`, `left`) 계산 시 `Math.round(value * dpr) / dpr` 수식을 적용하여 픽셀 그리드에 강제 정렬합니다.
- **[CSS Containment Level]**: 대규모 리플로우(Reflow) 방지를 위해 컴포넌트 단위로 `contain: layout size style` 속성을 적용합니다. 각 슬롯의 크기 변화가 상위 노드로 전파되는 범위(Scope)를 인지적으로 차단합니다.
- **[Component Performance Budget]**:
  - **Main Thread Occupancy**: 단일 컴포넌트 렌더링 시 JS 실행 시간 16ms(1frame) 이내 보증.
  - **Memory Footprint**: 컴포넌트 인스턴스당 메모리 점유율을 정량화하여, 리스트 100개 렌더링 시 메모리 누수 임계치(Tipping point)를 사전에 명세합니다.

### 4. 시맨틱 접근성 아키텍처 (A11y Node Topology)
단순 ARIA 속성을 넘어, 스크린 리더와의 '대화형 위상'을 설계합니다.

- **[Aria-Live Sequencing]**: 여러 슬롯에서 동시 다발적인 데이터 업데이트 발생 시, `aria-live`의 우선순위를 `polite`와 `assertive` 사이에서 큐(Queue) 알고리즘으로 관리하여 인지적 혼란을 방지합니다.
- **[Focus Trapping Physics]**: 모달이나 드로어(Drawer) 활성화 시, 탭 키 이동 경로를 순환(Circular) 구조로 고정하고, `aria-hidden`을 통해 배경 노드를 시각적 뿐만 아니라 물리적으로도 비가시화(Inert) 처리합니다.
- **[Interactive Node Density]**: 터치 타겟의 물리적 크기를 48dp 이상으로 유지하되, 인접 타겟 간의 '오클릭 방지 오차 범위(Fitts's Law Margin)'를 8dp 이상 확보합니다.

### 5. SSR/CSR 하이드레이션 및 상태 영속성 (Lifecycle & Persistence)
데이터 로딩과 렌더링 간의 '시간적 무결성'을 보장합니다.

- **[State Rehydration Protocol]**: SSR에서 생성된 초기 시각 상태가 클라이언트 JS 실행 전까지 '잠금(Lock)' 처리되는 시각적 가이드라인과, 하이드레이션 이후 상태 변화의 속도를 0ms로 동기화하는 로직을 포함합니다.
- **[Layout Shift Distance Calculation]**: 모든 이미지 및 미디어 슬롯에 `aspect-ratio`를 강제 할당하여, 리소스 로딩 전후의 `LHR(Layout Height Ratio)` 변화량을 0%로 고립시킵니다.

### 6. 플랫폼 AST 매핑 및 시맨틱 버저닝 (AST Mapping & SemVer)
디자인 데이터가 코드로 변환되는 과정에서 '의미의 손실'이 없음을 보장합니다.

- **[AST Schema Definition]**: 컴포넌트 구조를 아래 JSON 스키마로 강제 정의합니다:
  ```json
  { 
    "component": "BentoCard", 
    "physics": { "containment": "strict", "gpu_accel": true },
    "slots": { "header": { "priority": 1, "constraints": ["fixed-height"] } }, 
    "logic": "FSM_v5" 
  }
  ```
- **[Architecture SemVer]**:
  - **Major**: 슬롯 구조 파괴, 렌더링 엔진 기본값 변경 (Breaking Change)
  - **Minor**: 성능 최적화 파라미터 추가, 신규 시각 상태 추가
  - **Patch**: 0.01px 단위의 위치 보정, 접근성 레이블 수정

---
> [!IMPORTANT]
> **"이것은 그림이 아니라, 렌더링 가능한 논리다."** 본 매트릭스는 디자이너의 직관을 엔지니어링의 숫자로 변환하여 하위 공정의 모든 불확실성을 제거합니다.
