# [Template] Professional Entity & Data Architect Mapper
## Subject: [Functional Domain Name]

### 1. Logical Data Model (Domain Objects)
- **Entity Object**: `[EntityName]` (e.g., `UserOrder`)
    - **Description**: 비즈니스적 의미와 역할.
    - **Attributes Map**:
        | Field Name | Type | Key | Validation | Persistence | Masking |
        | :--- | :--- | :--- | :--- | :--- | :--- |
        | `uuid` | String | PK | UUID v4 | Permanent | No |
        | `status` | Enum | - | [Pending, Paid] | Permanent | No |
        | `total_price` | Decimal | - | > 0 | Permanent | No |
        | `phone_num` | String | - | Regex | Permanent | Yes |

### 2. State & Lifecycle Governance
- **State Transition Rules**: 상태 변화를 일으키는 주체(Actor)와 트리거(API/Batch).
    - `Draft` -> `Active`: 사용자의 '저장' 요청 (Validation Logic 필수).
    - `Active` -> `Calculated`: 시스템 배치 작업에 의한 정산.
- **Retention Policy**: 데이터 보관 기간 및 아카이빙/파기 로직.

### 3. Data Integrity & Validation
- **Global Constraints**: 엔티티 간 정합성 유지 규칙 (e.g., 주문 금액은 상품 가격의 합과 같아야 함).
- **Edge-Case Validation**: 데이터 손실, 중복 서브밋, 세션 만료 시의 데이터 안정성 확보 방안.

### 4. Integration & Lineage (The Data Flow)
- **Producer (Source)**: 데이터가 발생하는 원천 (UI Form, Legacy DB, 외부 Webhook).
- **Consumer (Target)**: 데이터가 소비되는 곳 (Search Index, BI Dashboard, 3rd Party API).
- **Sync Pattern**: 동기(Synchronous) / 비동기(Asynchronous) 처리 구분.

### 5. Backend Implementation Hints (Developer Guide)
- **Indexing Strategy**: 조회가 빈번할 것으로 예상되는 필드 및 복합 인덱스 제안.
- **Table Name Suggestion**: 시스템 명명 규칙에 따른 물리 테이블 명 초안.
