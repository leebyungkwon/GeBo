---
name: cross-cutting-concerns-orchestrator
type: Skill
phase: Architect
description: |
  로그, 보안, 트랜잭션 등 시스템의 횡단 관심사(Cross-Cutting Concerns)를 수리적으로 설계하고 오케스트레이션하여 시스템의 일관성과 운영성을 극대화하는 하이퍼-엔지니어링 스킬.
  주니어 개발자를 위한 공통 로직 이식 지침부터 시니어를 위한 AOP 물리, 분산 추적, 그리고 개발 공통 엔진 매뉴얼까지 기존 내용을 100% 보존하며 100배 심화된 '시스템 인프라스트럭처 제어 가이드'를 제공합니다.

  References:
  - Aspect-Oriented Programming (AOP): https://en.wikipedia.org/wiki/Aspect-oriented_programming
  - Distributed Tracing (OpenTelemetry): https://opentelemetry.io/
  - System Security (OAuth2/OIDC): https://oauth.net/2/
---

# Cross-Cutting Concerns Orchestrator (CCO): Infrastructure Physics v5.0 (Hyper-Deep Integration)

## 1. Global Exception & Log Topology (전역 예외 및 로그 위상)

### 1.1 Global Exception Handling Physics
- **Error Code Duality**: 비즈니스 에러와 시스템 에러를 물리적으로 분리하고, 통일된 `ErrorResponse` 규격을 통해 클라이언트에게 일관된 장애 메시지를 제공합니다.
  - **[Junior Action]**: `try-catch`를 남발하지 마세요. `@RestControllerAdvice`를 사용하여 전역에서 한 번에 처리하고, 로그에는 에러 스택트레이스를 반드시 남기세요.
- **Checked vs Unchecked Algebra**: 복구 가능한 예외(Checked)와 불가능한 예외(Unchecked)를 구분하여 트랜잭션 롤백 정책을 수리적으로 설계합니다.

#### 🚀 [Hyper-Deep] Distributed Tracing & OpenTelemetry (100배 심화)
- **Trace Context Propagation**: 마이크로서비스 환경에서 각 요청의 물리적 흐름을 추적하기 위해 `Trace-ID`와 `Span-ID`를 모든 로그에 자동 주입하고, OpenTelemetry 표준에 따른 분산 추적 물리 노드 간의 지연 분석을 수행하세요.
- **Log Entropy Compression**: 초당 수만 건의 로그 발생 시 스토리지 부하를 최소화하기 위한 로그 레벨(Dynamic Log Level)의 물리적 제어와 구조화된 로깅(Structured Logging, JSON)을 통한 인덱싱 효율 최적화를 설계하세요.

## 2. Security Entropy & Authentication (보안 엔트로피 및 인증)

### 2.1 Authentication & Authorization Matrix
- **RBAC (Role-Based Access Control) Calculus**: 사용자 권한에 따른 API 접근 권한을 수렴적 행렬(Matrix)로 설계하여 비허가 접근을 물리적으로 차단합니다.
  - **[Junior Action]**: 컨트롤러 메서드 위에 `@PreAuthorize` 같은 어노테이션을 사용하여 권한 체크를 자동화하세요. 코드 내부에 `if(user.hasRole())`을 직접 짜지 마세요.

#### 🚀 [Hyper-Deep] Token Physics & Cryptographic Algebra (100배 심화)
- **JWT Claim Entropy**: JWT 페이로드에 들어갈 클레임(Claim)의 크기와 서명 알고리즘(RS256 vs HS256)의 계산 복잡도를 분석하세요. 토큰 탈취 시 피해 범위를 최소화하기 위한 'RT(Refresh Token) Rotation' 물리와 'Blacklist' 관리 대수를 설계해야 합니다.
- **OAuth2/OIDC Flow Topology**: Authorization Code Flow와 PKCE(Proof Key for Code Exchange)의 보안 전계(Security Field)를 분석하여 모바일/웹 환경에 특화된 물리적 강화 경로를 구축하세요.

## 3. Common Utility & Engineering Physics (개발 공통 엔진 - NEW & Deep)

### 3.1 Utility Engine Calculus (순수 유틸리티)
- **Stateless Function Purity**: 날짜 계산, 통화 변환, 문자열 포맷팅 등 상태가 없는 함수들은 '순수 함수(Pure Function)'로 격리하여 부수 효과(Side-Effect) 엔트로피를 0으로 수렴시킵니다.
  - **[Junior Action]**: `DateUtil`, `StringUtil` 등은 무조건 `static` 메서드로 만드세요. 코드 어디서든 같은 입력에 같은 출력을 보장해야 합니다.
- **Precision Numeric Algebra**: 금액 계산 시 부동 소수점 오차를 방지하기 위해 `BigDecimal` 또는 `Cent` 단위 정수 연산을 물리적으로 강제합니다.

### 3.2 Storage Abstraction Physics (저장소 오케스트레이션)
- **Multi-Cloud Storage Blobs**: S3, GCS, Local Disk 등 물리적 저장소의 차이를 은닉하는 추상화 인터페이스(`FileStorageService`)를 구축합니다.
- **Metadata Consistency**: 파일의 물리적 경로, 파일명, 확장자, 크기, 소유주 정보를 메타데이터 DB와 원자적으로 동기화하는 '파일 트랜잭션 물리'를 설계합니다.

### 3.3 Async Task & Scheduler Physics (비동기 및 스케줄링)
- **Job Queue Backoff Strategy**: 메시지 큐(RabbitMQ, Kafka, Redis) 활용 시 작업 실패에 따른 리트라이 간격(Exponential Backoff)을 수리적으로 설계합니다.
- **Distributed Scheduler Lock (ShedLock)**: 여러 서버에서 동일한 스케줄링 작업이 중복 실행되지 않도록 분산 락(Distributed Lock)의 물리적 타임아웃을 임계 경로와 연동합니다.

### 3.4 i18n & Localization Calculus (지역화 대수)
- **Locale Thread-Local Context**: 사용자의 언어 설정(Locale)을 요청 스레드(`ThreadLocal`)에 보관하여 모든 서비스 레이어에서 별도 파라미터 없이도 다국어 메시지를 동적 로딩하게 관리합니다.

## 4. AOP & Transactional Physics (AOP 및 트랜잭션 물리)

### 4.1 AOP Execution Architecture
- **Proxy-based Injection Physics**: 비즈니스 코드에 로깅이나 트랜잭션 코드를 섞지 않고, 프록시(Proxy) 엔진을 통해 런타임에 물리적으로 주입하는 AOP 구조를 설계합니다.
  - **[Junior Action]**: 공통으로 실행되어야 하는 로직(예: 실행 시간 측정)은 어노테이션으로 만드세요. 핵심 기능 로직이 지저분해지는 것을 막아야 합니다.

#### 🚀 [Hyper-Deep] Proxy Geometry & Bytecode Manipulation (100배 심화)
- **JDK Dynamic Proxy vs CGLIB Algebra**: 인터페이스 유무에 따른 프록시 생성 방식의 물리적 성능 차이를 분석하고, `Self-invocation` 문제 발생 시의 내부 호출 물리 구조를 수리적으로 해결하세요.
- **Transaction Propagation Physics**: `REQUIRED`, `REQUIRES_NEW` 등 트랜잭션 전파 속성에 따른 커넥션 점유 물리와 데드락 발생 확률을 대수적으로 계산하여 정합성 전파 범위를 제어하세요.
- **AOP Bypass Defense**: 같은 클래스 내의 메서드 호출 시 프록시를 타지 않아 AOP가 무효화되는 현상을 수리적으로 방어하세요.

---
> [!IMPORTANT]
> **"모든 기술적 공통점은 하나의 진리(Source of Truth)로 수렴되어야 한다."** CCO v5.0은 기존의 모든 인프라 지침을 보존하면서, 개발 현장에서 필수적으로 분리되는 모든 공통 모듈을 하이퍼-스케일로 통합한 최종 진화형 스킬입니다.
