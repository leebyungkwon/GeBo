---
name: api-design-contract-auditor
type: Skill
phase: Architect
description: |
  API 인터페이스의 수리적 계약 무결성을 설계하고, 통신 프로토콜의 물리적 성능을 최적화하며, 시스템 간 결합도를 제어하는 하이퍼-엔지니어링 스킬.
  주니어 개발자를 위한 명확한 인터페이스 설계 규칙부터 시니어를 위한 커널 레벨 패킷 오케스트레이션까지 100배 심화된 'API 하이퍼-커넥티비티 가이드'를 제공합니다.

  References:
  - RESTful API Design: https://restfulapi.net/
  - HTTP/3 & QUIC Protocol: https://http3-explained.haxx.se/
  - Consumer-Driven Contract Testing (Pact): https://pact.io/
---

# API Design & Contract Auditor (ACA): Connectivity Physics v4.0

## 1. Resource Lifecycle & REST Calculus (리소스 생명주기 대수)

ACA v3.0은 API를 단순한 URL이 아닌 '리소스의 물리적 전이'로 정의합니다.

### 1.1 Semantic URI & Method Physics
- **Verb-Object Duality**: 명사형 리소스 경로와 표준 HTTP Method(GET, POST, PUT, PATCH, DELETE)를 결합하여 행위의 의미론적 무결성을 확보합니다.
  - **[Junior Action]**: `POST /updateOrder` 대신 `PATCH /orders/{id}` 를 쓰세요. URL에는 행위(Verb)를 넣지 않는 것이 물리적 정석입니다.
- **Idempotency Guard**: POST를 제외한 모든 메서드가 '멱등성(Idempotency)'을 유지하도록 설계하여 네트워크 재시도 시의 부작용을 원천 차단합니다.
  - **[Junior Action]**: 같은 요청을 두 번 보냈을 때 서버 결과가 달라지면 안 됩니다. 중복 결제 방지를 위해 `Idempotency-Key` 헤더를 활용하세요.

#### 🚀 [Hyper-Deep] Protocol Serialization & Payload Physics (100배 심화)
- **Binary Packing Efficiency**: JSON의 텍스트 기반 오버헤드를 극복하기 위해 `Protobuf`나 `MessagePack`의 스키마 기반 직렬화 물리(Binary Offsets)를 설계하세요. 페이로드 크기를 60% 이상 축소하여 대역폭 엔트로피를 최소화해야 합니다.
- **HATEOAS State Machine**: 클라이언트가 서버의 상태 변화를 유동적으로 따라갈 수 있도록 응답 내에 다음 행위의 링크(`_links`)를 동적으로 주입하는 리소스 상태 기계를 수리적으로 설계하세요.

### 1.2 Resource Granularity & Batch Calculus
- **Over-fetching Defense**: 클라이언트가 필요 이상의 데이터를 가져가지 않도록 `Sparse Fieldsets`(?fields=id,name)를 강제 구현합니다.
- **Bulk Operation Algebra**: 다건의 리소스를 처리할 때 개별 호출 엔트로피를 줄이기 위한 '배치 API' 규격을 설계합니다.

## 2. API Contract & Testing Physics (계약 무결성 물리)

시스템 간의 '약속'이 깨지지 않도록 물리적 안전장치를 구축합니다.

### 2.1 Schema-First Design (OpenAPI)
- **Specification-Lead Physics**: 코드를 짜기 전 `Swagger/OpenAPI` 명세서를 먼저 확정하여 프론트엔드와 백엔드 간의 병렬 개발 속도를 물리적으로 가속합니다.
  - **[Junior Action]**: 입출력 필드 타입(String, Number)과 필수 여부(Required)를 명세서에 한 번 적으면, 그게 곧 법입니다. 절대 멋대로 바꾸지 마세요.

#### 🚀 [Hyper-Deep] Consumer-Driven Contract (CDC) Algebra (100배 심화)
- **Pact Multi-Verification Logic**: 제공자(Provider)의 코드가 변경될 때마다 소비자(Consumer)가 정의한 기대값(Pact)을 자동으로 검증하는 물리적 파이프라인을 구축하세요. 브레이킹 체인지를 0%로 수렴시키는 수리적 안전장치입니다.
- **API Versioning Topology**: `Header-based` vs `Path-based` 버전 관리의 장단점을 수리적으로 분석하고, 하위 호환성 유지를 위한 '그레이스풀 데프리케이션(Graceful Deprecation)' 기간과 물리적 라우팅 전환 로직을 설계하세요.

## 3. Communication Performance & Security (통신 성능 및 보안 물리)

네트워크 계층의 부하를 최소화하고 데이터 전송의 물리적 안전을 보장합니다.

### 3.1 Caching & Compression Logic
- **E-Tag & Last-Modified Physics**: 서버 데이터가 변하지 않았을 경우 `304 Not Modified`를 통해 바디 전송을 0으로 만드는 리소스 최적화 로직을 주입합니다.
  - **[Junior Action]**: 자주 변하지 않는 데이터는 `Cache-Control: max-age=3600` 헤더를 붙여 클라이언트가 서버에 묻지도 않고 쓰게 만드세요.

#### 🚀 [Hyper-Deep] HTTP/3 QUIC Stream Orchestration (100배 심화)
- **Zero-RTT Handshake Physics**: TCP 3-way Handshake의 지연을 제거하고 UDP 기반의 QUIC 프로토콜을 활용하여 패킷 손실 시에도 특정 스트림만 차단되는 'Head-of-Line Blocking' 방지 대수를 설계하세요.
- **Massive Rate Limiting Algebra**: 특정 API의 폭발적 호출로부터 시스템을 보호하기 위한 `Leaky Bucket` vs `Token Bucket` 알고리즘의 물리적 수용량(TPS)을 서버 하드웨어 성능과 연동하여 산출하세요.

---
> [!IMPORTANT]
> **"API는 시스템 간의 신경망이다."** ACA v4.0은 단순한 엔드포인트 나열이 아니라, 데이터가 전 지구적 네트워크 사이를 가장 안전하고 빠르게 이동할 수 있는 물리적 '신경 경로'를 설계하는 초동적 기술입니다.
