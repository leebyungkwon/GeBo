---
name: domain-driven-design-architect
type: Skill
phase: Architect
description: |
  비즈니스 도메인의 복잡성을 수리적으로 분해하고, 경계(Bounded Context)와 애그리거트(Aggregate)를 통해 시스템의 논리적 무결성을 설계하는 하이퍼-엔지니어링 스킬.
  단순 구조 설계를 넘어, 주니어 개발자도 즉시 코드로 이식 가능한 수준의 '초정밀 도메인 구현 매뉴얼'을 제공합니다.

  References:
  - DDD Patterns: https://martinfowler.com/tags/domain%20driven%20design.html
  - Tactical DDD: https://www.domainlanguage.com/ddd/patterns/
  - Implementing DDD (Vaughn Vernon): Strategic & Tactical Patterns
---

# Domain-Driven Design Architect (DDA): Architecture Physics v3.0 (Junior Guide)

## 1. Context Mapping Physics (비즈니스 은하계 매핑)

DDA v3.0은 도메인 간의 물리적 흐름을 주니어도 한눈에 이해할 수 있는 규격으로 정의합니다.

### 1.1 Context Relationship Patterns
- **ACL (Anti-Corruption Layer) Logic**: 외부 시스템이나 하위 도메인(Legacy)의 오염된 데이터가 클린 도메인으로 침투하지 못하도록 물리적인 변환기(Translator/Adapter)를 강제 배치합니다.
  - **[Junior Action]**: 외부 API 응답을 도메인 내부에서 바로 사용하지 마세요. 반드시 `ExternalApiAdapter`를 거쳐 우리 도메인의 `Entity`나 `VO`로 변환하여 사용해야 합니다.
  - **[Example]**: `externalOrder.get_status()` -> `InternalOrderMapper.toDomain(externalOrder)`
- **OHS (Open Host Service) & PL (Published Language)**: 핵심 도메인이 다수의 소비자에게 일관된 인터페이스를 제공하도록 표준 프로토콜과 공유 데이터 규격을 정의합니다.
  - **[Junior Action]**: 우리 도메인 데이터를 외부로 줄 때, 내부 DB 구조를 그대로 노출하지 마세요. 별도의 `ResponseDTO`를 만들어 공통된 포맷으로 반환하세요.
- **Separate Ways Calculus**: 도메인 간의 결합 비용이 협력 이득보다 클 경우, 물리적으로 완전히 분리하여 정합성 비용을 0으로 만듭니다.
  - **[Junior Action]**: 두 도메인이 너무 꼬여있다면 억지로 합치지 말고, 아예 남남처럼 대하세요. API 호출이나 이벤트로만 통신합니다.

### 1.2 Ubiquitous Language & Mapping Calculus
- **Namespace Collision Defense**: 동일 명칭(예: 'Account')이 Context마다 다른 물리적 의미(은행 계좌 vs 사용자 계정)를 가질 때, 이를 명확한 코드 네임스페이스와 패키지 물리로 격리하여 논리적 충돌을 차단합니다.
  - **[Junior Action]**: 패키지 구조를 `com.project.account.domain`과 `com.project.billing.domain`으로 엄격히 나누세요. 클래스 이름이 같더라도 패키지로 구분하여 혼선을 방지합니다.

## 2. Tactical Design Calculus (전술적 도메인 대수)

개발자가 코드로 구현할 '원자적 규칙'을 정의합니다.

### 2.1 Aggregate Root Physics (원자적 무결성)
- **Reference By ID Only**: 애그리거트 간의 객체 참조는 메모리 주소가 아닌 'ID'만을 사용하여 기술적 결합도를 물리적으로 제거하고 조회의 유연성을 확보합니다.
  - **[Junior Action]**: `Order` 엔티티 안에 `User` 객체를 통째로 넣지 마세요. `userId` 필드만 선언하여 ID로 참조하세요. (예: `private Long userId;`)
- **Aggregate Size Limit**: 하나의 애그리거트는 런타임 시 단일 트랜잭션 내에서 처리될 수 있는 최소한의 객체 조합으로 구성하여 경합(Contention) 엔트로피를 최소화합니다.
  - **[Junior Action]**: 하나의 테이블에 데이터 수정을 수십 개씩 묶지 마세요. 정말 같이 바뀌어야 하는 것들만 한 묶음(Aggregate)으로 만듭니다.
- **Invariant Guard Injection**: 모든 도메인 상태 변경은 애그리거트 루트 내부에 캡슐화된 `verify{Rule}()` 메서드를 통과해야만 물리적으로 저장 가능하도록 설계합니다.
  - **[Junior Action]**: Setter를 쓰지 마세요. 메서드 이름을 `changeStatus()`, `updateAddress()`처럼 비즈니스 행위로 짓고, 메서드 시작 부분에서 `if(!valid) throw Error` 가드를 먼저 실행하세요.

### 2.2 Entity vs Value Object (VO) Engineering
- **VO Totality & Side-Effect Free**: 값 객체는 모든 필드가 생성 시 확정되는 불변성(Immutability)을 지녀야 하며, 비즈니스 연산 수행 시 새로운 VO를 반환하는 '순수 함수형 물리'를 따릅니다.
  - **[Junior Action]**: `Address` 같은 클래스에 수정을 가할 때는 필드 값을 바꾸지 말고, 수정된 값이 포함된 `new Address()`를 새로 만드세요.
- **Identity Maintenance**: 엔티티는 시간에 따른 속성 변화 속에서도 '연속적 식별성(Global Identity)'이 보존되도록 생성 및 소멸 로직을 물리적으로 관리합니다.
  - **[Junior Action]**: 엔티티는 반드시 `@Id`가 있어야 하며, 이 ID는 객체의 내용이 바뀌어도 절대 변하지 않아야 합니다.

## 3. 도메인 서비스 및 이벤트 물리 (Orchestration Physics)

도메인 간의 협력과 비동기 흐름을 제어합니다.

### 3.1 Domain Services & Logic Sequestration
- **Logic Purity Audit**: 상태를 가지지 않는 순수 비즈니스 정책(Complex Calculation, Validation)만을 도메인 서비스로 격리하여 엔티티 모델의 비대화를 방지합니다.
  - **[Junior Action]**: "이 로직은 A 엔티티에도, B 엔티티에도 넣기 애매한데?" 싶다면 `DomainService` 클래스를 만들어 그곳에 공유 로직을 넣으세요.
- **Infrastructure Abstraction**: 레포지토리(Repository)나 외부 API 연동 인터페이스를 도메인 레이어에 정의하고, 구체 구현은 인프라 레이어로 밀어내는 **의존성 역전(DIP) 물리**를 100% 실천합니다.
  - **[Junior Action]**: 도메인 코드에서는 `OrderRepository` 인터페이스만 정의하고 쓰세요. 실제 DB 쿼리를 날리는 `JpaOrderRepository`는 인프라 패키지로 보내버리세요.

### 3.2 Domain Event & Eventual Consistency
- **Saga Pattern & Outbox Physics**: 분산 무결성이 필요한 경우, 도메인 이벤트를 활용하여 '결과적 정합성(Eventual Consistency)'을 수리적으로 설계합니다. Transactional Outbox 패턴을 주입하여 도메인 상태 변화와 이벤트 발행의 원자성을 보장합니다.
  - **[Junior Action]**: 다른 도메인에 일을 시키고 싶을 때 직접 메서드를 부르지 마세요. `domainEvents.publish(new OrderCompleted())`라고 이벤트를 던지고 잊으세요. 그 뒷일은 이벤트 수신자가 알아서 합니다.

---
> [!IMPORTANT]
> **"주니어의 코드에서 시니어의 아키텍처가 느껴지게 하라."** DDA v3.0은 모든 '모호함'을 제거하고, 개발자가 '기계적으로' 올바른 아키텍처를 구현할 수 있도록 물리적 강제성을 부여합니다.
