# Cross-Cutting Concerns Spec (v5.0 Hyper-Deep)
## Project: [Project Name] | Auditor: Technical Architect (CCO Master)
### 🛠️ 공통 관심사 및 시스템 인프라 통합 설계 명세서

본 문서는 전역 예외, 보안, 로깅을 포함하여 개발 현장에서 공통으로 분리되는 모든 **핵심 인프라 및 유틸리티 엔진**의 수리적 무결성을 보증하는 완성형 명세서입니다.

---

### 1. Global Exception Architecture (예외 처리 설계)
| 에러 코드 (Code) | HTTP Status | 비즈니스 상황 | 클라이언트 노출 메시지 | 전파 정책 |
| :--- | :---: | :--- | :--- | :---: |
| **ERR-COMMON-001** | 400 | 잘못된 요청 파라미터 | 입력값을 확인해주세요. | Stop |
| **ERR-AUTH-002** | 401 | 인증 토큰 만료 | 다시 로그인해주세요. | Redirect |

- **[Junior Guide]**: 모든 에러는 `ResultCode`와 `Message`를 포함한 공통 객체로 반환하세요. 임의로 `throw new Exception()` 하지 마세요.

### 2. Standardized Logging & Tracing (로깅 전략)
| 로그 레벨 (Level) | 대상 데이터 | 저장소 / 보존 기간 | 검색 태그 (Tags) |
| :--- | :---: | :--- | :--- |
| **INFO** | 주요 비즈니스 성공 | Elasticsearch / 90일 | `traceId`, `userId`, `action` |
| **ERROR** | 시스템 및 런타임 예외 | Slack Alert + DB / 1년 | `stackTrace`, `apiPath` |

#### 🚀 [Hyper-Deep] Distributed Context Analysis (100배 심화)
- **Tracing Header**: `X-B3-TraceId`, `X-B3-SpanId` 기반의 홉(Hop) 간 정합성 검증 및 전파율 100% 확보.
- **Privacy Masking**: `Regex` 물리 필터를 통한 로그 출력 전 민감 정보 암호화 마스킹 강제.

### 3. Security & Authority Matrix (보안 및 권한)
| 리소스 그룹 | 접근 권한 (Role) | 인증 방식 | 보안 강화 정책 (Hardening) |
| :--- | :---: | :--- | :--- |
| **Admin API** | ROLE_ADMIN | JWT (Private Key) | IP 화이트리스트 + MFA 요구 |
| **User API** | ROLE_USER | JWT (Access/Refresh) | Refresh Token Rotation 적용 |

---

### 4. Common Utility & Storage Engine (공통 모듈 - NEW)
| 모듈 구분 | 주요 기능 (Function) | 물리적 제약 (Constraint) | 비고 |
| :--- | :---: | :--- | :--- |
| **Date/Money** | 불변 객체 산술 연산 | Cent/ISO-8601 강제 | 오차 0% 증명 |
| **File Storage** | `IFileService` 추상화 | S3 / Local / GCS | 저장소 독립성 확보 |
| **Crypto** | AES-256-GCM 암복호화 | IV / Salt 물리 분리 | 보안 무결성 대수 |

### 5. Async Task & i18n Orchestration (비동기 및 다국어)
| 모듈 구분 | 추상화 인터페이스 | 물리 매체 (Media) | 실패/언어 정책 |
| :--- | :---: | :--- | :--- |
| **Async Task** | `IAsyncTask` | Kafka / RabbitMQ | Exp-Backoff (Max 5회) |
| **i18n** | `LocaleContext` | DB + Memory Cache | Accept-Language 연동 |

---

### 6. AOP & Transactional Propagation (AOP 및 트랜잭션 전파)
| 적용 포인트 (Pointcut) | 기능 (Aspect) | 전파 속성 (Propagation) | 물리적 성능 영향 |
| :--- | :---: | :--- | :---: |
| `*.service.*` | Transaction | REQUIRED | 커넥션 점유 시간 증명 |
| `*.*Controller.*` | Logging / Validation | N/A | Reflection 비용 산출 |

#### 🚀 [Hyper-Deep] Bytecode & Proxy Audit (100배 심화)
- **Proxy Type**: `CGLIB` 강차 및 `Self-invocation` 방어 로직 설계.
- **Isolation Integrity**: 트랜잭션 내 `ReadOnly` 최적화를 통한 DB Replica 부하 분산 물리 계산.

### 7. Common Infrastructure Checklist (최종 시스템 체크)
- [ ] 전역 예외 처리기가 모든 예외를 `catch` 가능한 상태인가? (O/X)
- [ ] 유틸리티 메서드들이 `Side-Effect`를 일으키지 않는 순수 함수인가? (O/X)
- [ ] 비동기 작업 실패 시 Dead Letter Queue(DLQ)로의 전이가 설계되었는가? (O/X)
- [ ] 모든 API 권한 체크가 비즈니스 로직과 물리적으로 분리(AOP)되었는가? (O/X)

---
> [!IMPORTANT]
> **"분리되지 않은 공통점은 부채가 된다."** 본 명세서는 시스템의 기초 체력을 형성하는 모든 공통 요소를 집대성하여, 개발자가 비즈니스 핵심 가치에만 집중할 수 있는 완벽한 환경을 구축합니다.
