---
name: java-library-ecosystem-mastery
type: Skill
phase: Architect
description: |
  Java 백엔드 개발의 핵심 라이브러리 및 프레임워크 에코시스템을 수리적으로 지휘하고, 최적의 도구 선택과 물리적 조합을 보증하는 하이퍼-엔지니어링 스킬.
  Spring Boot Starter, Querydsl, MapStruct, JUnit 5 등 주요 라이브러리의 기저 동작 원리와 시니어급 아키텍팅 레퍼런스를 제공합니다.

  Official Reference Guides:
  - Spring Boot Spec (3.4.x): https://docs.spring.io/spring-boot/docs/3.4.x/reference/html/
  - Querydsl Mastery: http://querydsl.com/static/querydsl/latest/reference/html/
  - MapStruct Reference: https://mapstruct.org/documentation/stable/reference/html/
  - JUnit 5 Deep Dive: https://junit.org/junit5/docs/current/user-guide/
  - Spring Security Architecture: https://docs.spring.io/spring-security/reference/index.html
  - Redisson (Redis) Wiki: https://github.com/redisson/redisson/wiki
  - Project Reactor (Flux/Mono): https://projectreactor.io/docs/core/release/reference/
---

# Java Library & Ecosystem Mastery (JEL): Toolbox Physics v5.0 (Hyper-Deep)

## 1. Core Framework & Bootstrapping Physics (코어 및 부트스트래핑)

### 1.1 Spring Boot Starter Hierarchy & Conditionals
- **Auto-configuration Algebra**: `spring.factories` 엔진이 수백 개의 빈을 로드하는 물리적 순서를 `@AutoConfigureAfter`로 제약하고, `@ConditionalOnProperty/MissingBean` 대수를 통해 충돌 엔트로피를 0으로 제어합니다.
- **Guide**: [Spring Boot Features](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html)

#### 🚀 [Hyper-Deep] Context Refresh & Warm-up (100배 심화)
- **ApplicationContext Physics**: 빈 생성 시 발생하는 순환 참조(Circular Dependency)의 물리적 그래프를 분석하고, `Lazy` 초기화와 `ObjectProvider`를 통한 런타임 주입 시점 최적화를 설계하세요.
- **Custom Starter Engineering**: 사내 공통 라이브러리를 위한 커스텀 스타터 제작 시, `META-INF/spring-autoconfigure-metadata.properties`를 활용한 컴파일 타임 필터링 물리 구조를 구축하세요.

## 2. Dynamic Persistence & Mapping Calculus (영속성 및 매핑 대수)

### 2.1 Querydsl & Type-safe Predicates
- **BooleanExpression Composition**: `BooleanBuilder`의 가변 엔트로피를 배제하고, `where()` 절 내에서 재사용 가능한 `BooleanExpression` 순수 함수 결합 모델을 구축합니다.
- **Guide**: [Querydsl Reference](http://querydsl.com/static/querydsl/latest/reference/html/)

### 2.2 MapStruct & Performance Mapping
- **Lombok Integration Physics**: Lombok의 `@Builder`와 MapStruct의 `@Mapper`가 충돌하지 않도록 `MappingTarget` 및 `Builder` 패턴의 물리적 우선순위를 설계합니다.
- **Guide**: [MapStruct Documentation](https://mapstruct.org/documentation/stable/reference/html/)

#### 🚀 [Hyper-Deep] Bytecode Generation & APT Registry (100배 심화)
- **APT Physics**: 코드 생성 도구(Querydsl/MapStruct)가 `AbstractProcessor`를 통해 Java AST(Abstract Syntax Tree)를 수정하는 물리적 과정을 분석하고, 증분 빌드(Incremental Build) 시의 캐시 무결성을 확보하세요.
- **Generic Mapper Algebra**: 반복되는 매핑 로직을 줄이기 위한 `GenericMapper<E, D>` 인터페이스와 Java Generic Type Erasure를 극복하는 런타임 타입 토큰 물리 설계를 수행하세요.

## 3. Distributed Cache & Messaging Physics (분산 캐시 및 메시징)

### 3.1 Redis (Lettuce vs Redisson)
- **Concurrency Locking**: Lettuce의 Netty 비동기 엔진과 Redisson의 분산 서버 간 `RLock` 물리적 점유 메커니즘을 비교 분석하여 최적의 락 위상을 설계합니다.
- **Guide**: [Redisson Wiki](https://github.com/redisson/redisson/wiki)

### 3.2 Message Broker Starters (Kafka/RabbitMQ)
- **Producer/Consumer Topology**: `spring-kafka`의 `Acknowledgment` 물리 모드(Manual_Immediate vs batch)에 따른 메시지 유실 엔트로피를 수리적으로 계산합니다.

#### 🚀 [Hyper-Deep] Serialization & Buffer Physics (100배 심화)
- **Jackson Custom Deserializer**: 다형성(Polymorphism)을 가진 JSON 데이터 역직렬화 시 `StdDeserializer`를 통한 물리적 타입 식별 및 `JsonNode` 트리 탐색 비용 최적화.
- **Protobuf Integration**: 대규모 트래픽 환경에서 JSON 오버헤드를 줄이기 위한 gRPC/Protobuf 라이브러리의 바이너리 패킹 효율 및 메모리 버퍼 복사 제로화(Zero-copy) 전략.

## 4. Security & Observability Ecosystem (보안 및 관측성)

### 4.1 Spring Security & JWT
- **Filter Chain Architecture**: `SecurityFilterChain` 내부의 15개 이상의 기본 필터 물리적 위치를 조정하여 인증/인가 성능을 최적화합니다.
- **Guide**: [Spring Security Reference](https://docs.spring.io/spring-security/reference/index.html)

### 4.2 Actuator & Micrometer
- **Metrics Topology**: JVM 메모리, 커넥션 풀 상태, 커스텀 비즈니스 메트릭을 `Prometheus` 형식으로 노출하는 관측성 물리 구조 설계.

#### 🚀 [Hyper-Deep] Aspect-Oriented Monitoring (100배 심화)
- **Micrometer Trace Physics**: OpenTelemetry 라이브러리와 연동하여 각 라이브러리(JDBC, Jedis, RestTemplate)의 내부 실행 지연을 Trace-Context에 물리적으로 강제 바인딩하는 '자동 인스트루멘테이션' 물리 설계.

---
> [!IMPORTANT]
> **"라이브러리를 넘어서는 아키텍트가 생태계를 지배한다."** JEL v5.0은 단순히 '사용법'을 아는 단계를 넘어, 각 도구가 Java 런타임과 하드웨어 리소스를 어떻게 물리적으로 점유하고 상호작용하는지 100% 통제하는 초격차 마스터리의 최종본입니다.
