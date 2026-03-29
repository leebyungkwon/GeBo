# Data-Payload Interface Spec (v1.0)
## Project: [Project Name] | Architect: Planner Agent 04 (DSE Master)
### 📊 데이터 필드 규격 및 인터페이스 정밀 명세서

본 문서는 화면에서 다루는 모든 데이터의 물리적 성질과 통신 규격을 공학적으로 정의한 명세입니다.

---

### 1. 엔티티 데이터 스키마 (Entity Schema Definition)
| 필드명 (Key) | 데이터 타입 | 필수(Y/N) | 기본값 (Default) | 제약 조건 (Constraints) | 설명 (Description) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `memberId` | `UUID/v4` | Y | `AUTO` | `Primary Key`, `Unique` | 회원 고유 식별자 |
| `authLevel` | `Enum[0-9]` | Y | `0` | `0:Guest, 1:User, 9:Admin` | 사용자 권한 레벨 |
| `lastLogin` | `ISO8601` | N | `null` | `YYYY-MM-DDTHH:mm:ssZ` | 최종 로그인 시각 |
| `balance` | `Decimal(15,2)` | Y | `0.00` | `Value >= 0` | 사용자 잔액 (소수점 2자리) |

### 2. API 페이로드 명세 (API Payload Interface)
#### [API ID: AUTH_001] 로그인 시도
- **Endpoint**: `POST /api/v1/auth/login`
- **Request Body**:
  ```json
  {
    "identity": "String(8,12) | Required",
    "credential": "String(Hash) | Required",
    "deviceInfo": {
      "os": "String | Enum(iOS, Android, Web)",
      "version": "String"
    }
  }
  ```
- **Response (Success 200)**:
  ```json
  {
    "token": "JWT_Access_Token",
    "expiresAt": "Unix_Timestamp",
    "userProfile": "Member_Entity_Fragment"
  }
  ```

### 3. 데이터 생명주기 및 의존성 관계 (Lifecycle & Dependency)
- **[Lifecycle Plan]**:
  - `Member` 생성 시 `Point_Account` 자동 연 생성 (1:1 관계).
  - `Member` 탈퇴(Delete) 시 법적 근거에 따른 5년간 `History_Log` 보관 후 물리 삭제.
- **[Dependency Mapping]**:
  - `Order` 엔티티는 반드시 `Product.stock > 0`인 상태에서만 `ST_CREATE`로 진입 가능.

### 4. 에러 코드 거버넌스 (System Error Codes)
| 코드 (Code) | HTTP 상태 | 메시지 (Message) | 대응 액션 (Action) |
| :--- | :--- | :--- | :--- |
| `ERR_4001` | 400 | "입력값이 형식에 맞지 않습니다." | 필드 밸리데이션 재확인 유도 |
| `ERR_4010` | 401 | "인증 토큰이 만료되었습니다." | 로그인 화면 자동 리다이렉트 |
| `ERR_5003` | 503 | "일시적인 시스템 오류입니다." | 지수 백오프(Exponential Backoff) 재시도 |

### 5. 관계 대수 및 멱등성 정밀 명세 (Relational & Idempotency Spec)
#### [Relational Complexity]
- **Dependency**: $Member \to AuthLevel$ (Full Functional Dependency)
- **Join Path**: $Order \bowtie Item \bowtie Product$ ($O(N \log M)$ 복잡도 제어)

#### [Idempotency & Concurrency]
- **Idempotency-Key Header**: `X-Idempotency-Key: UUID_v4` (24시간 유효)
- **Concurrency Control**: `ETag` (Strong Validation) 또는 `version` 필드 기반의 CAS(Compare-And-Swap) 연산 정의.

### 6. 데이터 무결성 및 인덱싱 물리 (Data Integrity & Indexing)
- **[Constraint Matrix]**:
  - `Member.balance` 업데이트 시: $Balance_{new} = Balance_{old} + \Delta$ WHERE $Balance_{old} + \Delta \ge 0$.
  - 데이터 원자성($Atomicity$): 트랜잭션 내 다중 엔티티 수정 시 전수 롤백 규칙 명문화.
- **[Indexing Strategy]**:
  - 자주 조회되는 필드(`memberId`, `lastLogin`)에 대한 B-Tree 인덱스 설계 및 카디널리티(Cardinality) 분석 결과 반영.

---
> [!IMPORTANT]
> **"데이터 아키텍처의 견고함이 성능의 상한선을 결정한다."** DSE v2.0은 기획 단계에서 이미 DB 튜닝 및 API 동시성 제어 전략을 확정하여 기술적 부채를 소멸시킵니다.

---
> [!NOTE]
> DSE 명세는 기획자가 백엔드/DB 설계자와 소통하는 **'공용 프로토콜'**입니다. 이 문서를 통해 데이터의 정합성과 시스템 안정성을 최상단에서 제어합니다.
