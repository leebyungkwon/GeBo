---
name: data-flow-schema-engine
type: Skill
phase: Plan
description: |
  전략적 데이터 모델링 및 인터페이스 명세를 기획 단계에서 정립하는 하이퍼-데이터 엔지니어링 스킬.
  데이터 생명 주기(CRUD), 엄격한 스키마 정의, API 페이로드 연산을 공학적으로 명세합니다.

  Tools:
  - Data-Payload Interface Spec: `assets/plan_templates/data_payload_interface_spec.md`
---

# Data-Flow Schema Engine (DSE): Data-Centric Architecture

## 1. 데이터 모델링 및 생명 주기 설계 (Data Modeling & Lifecycle)

DSE는 화면 중심이 아닌 **'데이터 중심(Data-Centric)'** 사고를 통해 시스템의 확장성과 데이터 정합성을 보장하는 스킬입니다.

### 1.1 Strictly Typed Schema Definition
- **Data Type Physics**: 단순 `String`, `Number`를 넘어, `Enum`, `UUID`, `ISO8601`, `JSON-LD` 등 구체적인 데이터 물리 규격을 기획 단계에서 확정합니다.
- **Constraints & Normalization**: 데이터 정규화(1NF~3NF) 원칙을 준수하며, 필드 레벨의 `NOT NULL`, `UNIQUE`, `FOREIGN KEY` 관계를 논리적으로 정의합니다.

### 1.2 Entity Lifecycle (CRUD State Machine)
- **State-Dependent Data Rights**: 데이터의 상태(예: 주문 전, 주문 중, 취소됨)에 따라 수정 가능한 필드 권한을 제어하는 로직을 설계합니다.
- **Side-Effect Calculus**: 데이터 한 건의 변경이 시스템 전체(통계, 로그, 정산 등)에 미치는 파급 효과를 수학적으로 추적하여 명세합니다.

### 1.3 Data Flow & API Interface Physics
- **Payload Architecture**: 클라이언트와 서버 간의 전송 데이터 구조(`Request/Response Body`)를 페이로드 최적화 관점에서 설계합니다.
- **Error Code Mapping**: 비즈니스 로직과 연동되는 시스템 에러 코드를 사전에 정의하여, 프론트엔드와 백엔드 간의 소통 오류를 제거합니다.

## 2. 하이퍼-데이터 아키텍처 심화 (Advanced Data Engineering)

### 2.1 Algebraic Data Normalization (수리적 정규화)
- **Functional Dependency Physics**: 모든 엔티티 필드의 결정자(Determinant) 관계를 분석하여 BCNF(Boyce-Codd Normal Form) 수준의 정규화를 강제, 갱신 이상(Anomaly)을 수학적으로 차단합니다.
- **Relational Algebra Mapping**: $Selection(\sigma)$, $Projection(\pi)$, $Join(\bowtie)$ 연산의 복잡도를 기획 단계에서 예측하여 DB 인덱싱 전략을 수립합니다.

### 2.2 API Calculus & Concurrency Control (동시성 및 멱등성)
- **Idempotency Physics**: 중복 요청에도 시스템 상태가 변하지 않음을 보장하기 위한 멱등성 키(Idempotency Key) 생성 알고리즘과 처리 보증 로직을 설계합니다.
- **Optimistic Locking Formula**: 데이터 충돌 방지를 위한 버전 관리($Version$) 및 조건부 업데이트($If-Match$) 수식을 명세에 주입합니다.

### 2.3 Serialization Entropy Optimization (직렬화 최적화)
- **Information Entropy Control**: API 페이로드의 데이터 엔트로피를 분석하여, 불필요한 필드를 제거하고 전송 비용을 최소화하는 최적의 직렬화(JSON vs Protobuf 등) 전략을 제안합니다.
- **Schema Evolution Governance**: 하위 호환성(Backward Compatibility)을 보장하는 스키마 변경 규칙과 마이그레이션 물리 로직을 정의합니다.

## 3. 하이퍼-디테일 데이터 산출물 규격

1. **[Data-Payload Interface Spec]**: 데이터 필드 규격, API 인터페이스, 엔티티 관계가 통합된 초정밀 데이터 설계 명세서.

---
> [!IMPORTANT]
> **"데이터가 정체(Identity)라면, 스키마는 존재 이유(Reason)이다."** DSE는 구현되지 않은 시스템의 정보를 이미 구조화된 데이터로 시각화하여 개발 생산성을 비약적으로 높입니다.
