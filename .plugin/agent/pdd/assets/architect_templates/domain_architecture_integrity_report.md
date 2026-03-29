# Domain Architecture Integrity Report (v3.0)
## Project: [Project Name] | Auditor: Technical Architect (DDA Master)
### 🏛️ 도메인 아키텍처 및 논리적 경계 무결성 분석 보고서

본 보고서는 아키텍처의 물리적 안전성을 입증하는 프로필 설계 감사서입니다. 주니어 개발자도 각 항목을 명확히 이해하고 작성할 수 있도록 'Step-by-Step 가이드'를 포함합니다.

---

### 1. Strategic Domain Topology (전략적 도메인 위상)
| Bounded Context | Core Domain Type | Context Mapping Pattern | Upstream/Downstream | 무결성 지수 |
| :--- | :---: | :--- | :---: | :---: |
| **[도메인/패키지명]** | [Core/Supporting] | [ACL/OHS/SharedKernel] | [U/D] | [0~1.0] |

- **[작성 가이드]**:
  - `Bounded Context`: 실무 패키지 이름을 적으세요. (예: `com.project.order`)
  - `Domain Type`: 비즈니스 핵심이면 `Core`, 보조면 `Supporting`이라고 적으세요.
  - `Mapping Pattern`: 외부 데이터를 변환해서 쓰면 `ACL`, 우리 데이터를 외부에 제공하면 `OHS`입니다.

#### 🌐 Context Diagram Matrix
- **[Inter-context Bridge]**: 도메인 간에 어떤 데이터(이벤트)를 주고받는지 화살표로 설명하세요.
  - (예) 주문 도메인(OrderPlaced) -> 재고 도메인(StockDeduction)
- **[Separation Proof]**: DB 테이블 이름 앞에 `ORD_`, `USR_` 처럼 도메인을 식별하는 물리적 접두사가 있는지 확인하세요.

### 2. Tactical Aggregate Calculus (전술적 애그리거트 대수)
| Aggregate Root | Depth | 구성 Entity/VO 수 | 비즈니스 가드 (Invariants) 상세 | 트랜잭션 전파 범위 |
| :--- | :---: | :---: | :--- | :---: |
| **[루트 엔티티명]** | [깊이] | [개수] | [반드시 지켜져야 할 비즈니스 규칙] | [Atomic/Async] |

- **[작성 가이드]**:
  - `Depth`: 루트 아래로 객체가 몇 단계까지 내려가는지 적으세요. (가급적 2단계 이내 권장)
  - `Invariants 상세`: "주문 완료 상태에서는 수량을 변경할 수 없다"와 같은 **'절대 법칙'**을 한 줄로 적으세요.

#### 🧩 Aggregate Physics Audit
- **[Reference Check]**: 엔티티 내부에 다른 테이블 객체를 직접 넣지 않고 `Long userId` 처럼 ID로만 연결했는지 체크하세요. (Yes/No)
- **[Size Density]**: 하나가 너무 크면 관리가 힘듭니다. 객체 수가 10개를 넘으면 분리를 검토하세요.

### 3. Layered Physics & Dependency Audit (레이어 무결성 감사)
| Layer | 수직 격리 무결성 | 핵심 규칙 위반 (Violation) | 개선 조치 (Mitigation) |
| :--- | :---: | :--- | :--- |
| **Interface** | [Pass/Fail] | Controller에 비즈니스 로직 존재 여부 | Service로 로직 이전 |
| **Application** | [Pass/Fail] | Service가 DB에 직접 쿼리 날리는지 여부 | Repository 레이어 활용 |
| **Domain** | [Pass/Fail] | Entity에 `@Service` 같은 외부 어노테이션 유입 | 순수 자바 객체(POJO)로 정제 |

### 4. Language & Ubiquitous Consistency (용어 정합성)
- **[Dictionary Sync]**: [DB 컬럼명] - [변수명] - [기획서 용어]가 모두 같나요? (예: `USER_NM` == `userName` == `성명`)
- **[Ambiguity Resolution]**: 'Account'가 '계좌'인지 '계정'인지 헷갈리게 쓰이고 있지는 않나요? 명확히 정의하세요.

### 5. Domain Event & Eventual Consistency Logic (비동기 정합성)
- **[Event Schema]**: 이벤트 객체 안에 꼭 필요한 최소한의 데이터만 넣었나요?
- **[Recovery Path]**: 만약 비동기 처리가 실패했을 때, "어떻게 되살릴 것인가" 혹은 "어떻게 실패했다고 알릴 것인가"를 적으세요.
  - (예) 재시도 로직 3회 시행 후 실패 시 관리자 알림 발송.


---
### 🛠️ Domain Architecture Hyper-Integrity Checklist (v4.0)

#### 1. Strategic & Context Mapping (전략적 무결성)
- [ ] **[Namespace Isolation]**: 각 Bounded Context가 물리적 패키지/네임스페이스로 100% 격리되었는가?
- [ ] **[ACL Translator]**: 외부 도메인 모델이 우리 도메인 코어 내부로 단 한 줄도 유입되지 않았는가? (Adapter 존재 확인)
- [ ] **[Ubiquitous Language]**: 코드상의 클래스/변수명이 기획자 및 도메인 전문가의 언어와 수리적으로 일치하는가?

#### 2. Tactical Aggregate Physics (전술적 무결성)
- [ ] **[No Direct Reference]**: 애그리거트 간 참조 시 객체가 아닌 오직 `ID (Long/UUID)`만을 사용했는가?
- [ ] **[Encapsulated Invariants]**: 엔티티의 상태 변경이 `Setter`가 아닌 도메인 메서드 내부의 '가드 로직'을 통과하는가?
- [ ] **[VO Immutability]**: 모든 Value Object는 `final` 필드로 구성되어 있으며, 변경 시 새로운 인스턴스를 반환하는가?
- [ ] **[Aggregate Size]**: 단일 트랜잭션 내에서 수정되는 객체 수가 물리적 한계(권장 10개 미만) 이내인가?

#### 3. Layered Purity & Dependency (레이어 무결성)
- [ ] **[DIP Fulfillment]**: 도메인 레이어가 인프라(DB, 외부 API)에 의존하지 않고, 인터페이스를 통해 의존성이 역전되었는가?
- [ ] **[Single Purpose Service]**: Application Service는 오직 흐름 제어(Orchestration)만 담당하고, 비즈니스 계산은 도메인 모델에 위임했는가?
- [ ] **[POJO Purity]**: 도메인 엔티티가 프레임워크 전용 어노테이션(JPA 제외)이나 기술적 종속성으로부터 자유로운가?

#### 4. Event & Consistency Calculus (정합성 무결성)
- [ ] **[Atomicity Guard]**: 도메인 상태 변화와 이벤트 발행이 `Outbox Pattern` 등을 통해 원자적으로 보장되는가?
- [ ] **[Event Minimalism]**: 이벤트 페이로드에 불필요한 데이터 없이 '식별자'와 '핵심 변화'만 포함되었는가?
- [ ] **[Idempotent Consumer]**: 비동기 이벤트 수신 측에서 중복 처리를 방지하는 멱등성 로직이 설계되었는가?

---
> [!IMPORTANT]
> **"체크리스트는 사고를 방지하는 마지막 방어선이다."** 모든 항목이 `[x]`로 채워졌을 때, 비로소 이 시스템은 어떠한 비즈니스 파고에도 무너지지 않는 수리적 무결성을 갖추게 됩니다.
