# Common Asset Extraction Sheet (v1.0)
## Project: [Project Name] | Auditor: Planner Agent 04 (GCO Master)
### 💎 HTML/함수 공통 체크 및 자산 승격 명세서

본 문서는 특정 화면에 국한되지 않고, 프로젝트 전체의 마크업과 스크립트를 전수 조사하여 발견된 **'모든 반복 패턴'**을 동적으로 기록합니다. 아래 예시는 참조용이며, 실제 수행 시 에이전트가 탐지한 모든 자산이 이곳에 실시간으로 매핑됩니다.

---

### 1. HTML 구조 공통 체크 및 컴포넌트화 (HTML Audit)
> [!NOTE]
> 에이전트는 **Pattern Recognition Engine**을 통해 2회 이상 반복되는 모든 DOM 구조를 감지합니다.

| 추출 대상 (Target) | 식별된 패턴 (Pattern) | 승격 레벨 (Level) | Props/Slots 규격 | 비고 (Note) |
| :--- | :--- | :--- | :--- | :--- |
| **[EXAMPLE]** Search Bar | `Label + Input + Button` | Molecule | `fields: Array` | 예시 항목 |
| **[DETECTED] New Asset** | *동적 감지된 패턴 기술* | *Level 결정* | *규격 자동 생성* | *발견된 파일 경로* |

### 2. 함수/로직 공통 체크 및 유틸리티화 (Logic Audit)
> [!NOTE]
> **Logic Snippet Audit**을 통해 비즈니스 연산, 유효성 검사, 데이터 파싱 등의 중복 로직을 원자화합니다.

| 추출 로직 (Logic Name) | 중복 감지 지점 | 함수 규격 (Interface) | 수리적 정의 / 정규식 | 승격 여부 |
| :--- | :--- | :--- | :--- | :--- |
| **[EXAMPLE]** calc_vat | 결제, 환불 등 | `(p) -> n` | $p \times 0.1$ | 예시 항목 |
| **[DETECTED] New Logic** | *감지된 위치* | *인터페이스 설계* | *수식/로직 정의* | **승격(Utility)** |

### 3. 자산 승격 및 거버넌스 리포트 (Governance)
- **[New Common Assets]**: 본 화면 설계를 통해 `docs/common/`에 새롭게 추가될 자산 리스트.
- **[Legacy Match Rate]**: 기존 공통 자산 활용률 (%) -> **Target: 70% 이상**.
- **[Refactoring Guide]**: 기존 공통 자산 중 현재 요건을 반영하기 위해 확장이 필요한 항목(Breaking Change 여부 포함).

### 4. 최종 컴포넌트 아키텍처 (Topology)
- [Component Map]: 현재 페이지의 DOM 트리와 공통 컴포넌트 간의 매핑 구조도 (Top-Down).
- [State Distribution]: 공통 컴포넌트로 전파(Prop Drilling)될 상태와 자식으로부터 전래될 이벤트 정의.

### 5. 자산 승격 엔진 및 물리 수식 (Promotion Engine)
#### [Asset Promotion Scoring - APS]
- **Score**: $\text{APS} = (W_{reuse} \times R) - (W_{cost} \times C)$
  - $R$ (Reusability): 예상 사용 횟수 (1~10)
  - $C$ (Complexity): 통합/추출 난이도 (1~5)
  - **Decision**: $\text{APS} > 7.5 \implies$ **즉시 승격**, $\text{APS} > 4.0 \implies$ **대기/관찰**

#### [Logic Purity Audit]
- **Dependency Map**: `None` (Pure) | `LocalState` (Hook) | `GlobalStore` (Redux)
- **Idempotency Proof**: 동일 입력에 대해 항상 동일한 출력/구조를 보장하는가? (Yes/No)

### 6. 마이그레이션 임팩트 및 거버넌스 (Migration & Governance)
- **[Aesthetics Collision]**: 기존 디자인 시스템과의 시각적 충돌 지점 및 신규 토큰 정의 요건.
- **[Refactoring Anchor]**: 공통 자산 적용 시 수정이 필요한 기존 페이지의 앵커(Anchor) 포인트 리스트.
- **[Version Evolution]**: 자산의 버전 관리 전략 (v1.0.0 -> v1.1.0) 및 하위 호환성 파괴 지점 고지.

---
> [!IMPORTANT]
> **"자산화는 시스템의 엔트로피를 줄이는 가장 고차원적인 엔지니어링이다."** GCO v2.0은 정량적 데이터를 기반으로 중복을 제거하여 프로젝트의 물리적 수명을 영구히 연장합니다.
