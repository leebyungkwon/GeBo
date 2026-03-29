---
name: java-backend-mastery
type: Skill
phase: Architect
description: |
  Java 및 Spring Boot 생태계를 활용하여 엔터프라이즈급 백엔드 시스템을 설계하고 병목 현상을 해결하는 하이퍼-마스터리 스킬.
  Spring Cloud, JPA 무결성, JVM 튜닝 등 Java 기반 백엔드의 핵심 기능과 레퍼런스를 집대성하여 시니어급 기술 품질을 보증합니다.

  References:
  - Spring Docs (3.4.x): https://docs.spring.io/spring-boot/docs/3.4.x/reference/html/
  - Java 21 Features: https://openjdk.org/projects/jdk/21/
  - Baeldung Java & Spring: https://www.baeldung.com/
  - Effective Java (Joshua Bloch)
  - Java Performance: The Definitive Guide (Scott Oaks)
---

# Java Backend Mastery (JBM): Enterprise Physics v4.0

## 1. Spring Framework Core Mastery (스프링 코어 마스터리)

### 1.1 Bean Lifecycle & Dependency Geometry
- **Initialization Physics**: `@PostConstruct`, `@PreDestroy`, 그리고 `InitializingBean` 인터페이스를 통한 빈의 생명주기 제어 및 의존성 주입 시점의 무결성 확보.
- **Proxying Strategy**: `@Transactional` 및 `@Cacheable`이 실행되는 Proxy 위상(JDK Proxy vs CGLIB) 분석 및 `Self-invocation` 방어.
  - **[Junior Action]**: 한 서비스 내에서 같은 서비스의 다른 `@Transactional` 메서드를 호출하지 마세요. 프록시를 타지 않아 트랜잭션이 작동하지 않습니다.

### 1.2 Spring WebFlux & Reactive Physics
- **Non-blocking Event Loop**: Netty 기반의 이벤트 루프 모델을 이해하고, `Mono/Flux`를 활용한 반응형 프로그래밍으로 고밀도 트래픽을 처리합니다.
- **Backpressure Calculus**: 스트림 처리 속도를 제어하여 컨슈머 부하를 방지하는 대수적 설계.

## 2. Persistence & JPA Integrity (영속성 및 JPA 무결성)

### 2.1 Hibernate Engine & Query optimization
- **N+1 Logic Defense**: `FetchJoin`, `EntityGraph`를 활용한 과도한 쿼리 발생 물리적 차단.
- **Bulk Operation Algebra**: 대량 데이터 처리 시 엔티티 매니저 캐시를 무력화하고 JDBC Direct Insert로 전환하는 임계점 산출.
  - **[Junior Action]**: `saveAll()` 대신 수천 건 데이터는 `JdbcTemplate.batchUpdate()` 사용을 고려하세요. 영속성 컨텍스트 부하가 시스템을 멈추게 할 수 있습니다.

### 2.2 Transactional Propagation Physics
- **Isolation Integrity**: `REQUIRED`, `REQUIRES_NEW` 등 전파 속성에 따른 물리적 커넥션 점유 시간 및 데드락 확률 제어.

## 3. Java Ecosystem Expansion (Java 생태계 확장)

### 3.1 Stream API & Collection Physics
- **Parallel Stream Calculus**: 대용량 리스트 처리 시 ForkJoinPool 성능 부하와 데이터 순서성 무결성 확보.
- **Optional Monad Strategy**: 로직 내에서 Null-safety를 보장하기 위한 Monadic 처리 및 성능 오버헤드 분석.

### 3.2 Resilience & Cloud Native
- **Circuit Breaker Geometry**: Resilience4j를 활용한 서킷 오픈/하프오픈 상태의 물리적 전이 조건 설계.
- **Spring Cloud Gateway Physics**: 글로벌 라우팅 및 필터링 시 발생하는 지연(Latency)의 정량 분석.

---
> [!IMPORTANT]
> **"Java는 엔터프라이즈의 표준이자 물리다."** JBM v4.0은 단순히 코드를 짜는 것을 넘어, 수천만 명의 사용자가 사용하는 시스템의 견고함을 Java 생태계의 모든 권능을 통해 보증하는 초격차 마스터리의 정수를 담고 있습니다.
