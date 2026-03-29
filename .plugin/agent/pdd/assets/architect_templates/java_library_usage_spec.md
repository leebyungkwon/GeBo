# Java Library Selection & Usage Spec (v5.0 Hyper-Deep)
## Project: [Project Name] | Auditor: Technical Architect (JEL Master)
### 📚 Java 라이브러리 에코시스템 통합 활용 및 가이드 명세서

본 문서는 시스템 개발에 사용되는 모든 핵심 라이브러리의 **공식 가이드 좌표**, **물리적 동작 정책**, 그리고 **도구 간 시너지 무결성**을 보증하는 초정밀 명세서입니다.

---

### 1. Framework & Core Ecosystem (프레임워크 코어)
| 항목 | 사양 (Specification) | 공식 가이드 좌표 (Quick Link) | 물리적 핵심 정책 |
| :--- | :---: | :--- | :--- |
| **Boot Core** | Spring Boot 3.4+ | [Guide](https://spring.io/projects/spring-boot) | 가상 스레드 및 최신 GraalVM 최적화 |
| **Security** | Spring Security | [Guide](https://spring.io/projects/spring-security) | Filter Chain 기반 보안 필드 구축 |
| **Validation** | Jakarta Bean Val | [Spec](https://beanvalidation.org/2.0/) | DTO 계층 데이터 무결성 강제 |

### 2. Persistence & Mapping Matrix (영속성 및 매핑)
| 도구명 | 핵심 기능 | 공식 가이드 좌표 | 하이퍼-딥 최적화 포인트 |
| :--- | :---: | :--- | :--- |
| **Querydsl** | Type-safe SQL | [Reference](http://querydsl.com/) | `BooleanExpression` 순수 함수 결합 |
| **MapStruct** | Model Mapping | [Reference](https://mapstruct.org/) | APT 기반 런타임 비용 0 소스 생성 |
| **Lombok** | Boilerplate | [Project](https://projectlombok.org/) | AST 변환을 통한 캡슐화 자동화 |

#### 🚀 [Hyper-Deep] APT Hierarchy & Compilation Physics (100배 심화)
- **Processor Order**: Lombok(@Getter/@Setter) -> MapStruct(Generated Implementation) 순의 물리적 컴파일 순서 보증.
- **Q-Class Registry**: Querydsl Q-Class의 물리적 경로(`generated` 폴더)를 IDE 소스 세트로 자동 포함하여 빌드 엔트로피 차단.

### 3. Messaging & Distributed Storage (메시징 및 분산 저장소)
| 라이브러리 | 적용 기술 | 공식 가이드 좌표 | 물리적 제약 조건 (Constraint) |
| :--- | :---: | :--- | :--- |
| **Redisson** | Redis Lock | [Wiki](https://github.com/redisson) | Watchdog 기반 락 자동 연장 물리 |
| **Spring Kafka** | Kafka Message | [Reference](https://spring.io/projects/spring-kafka) | `@KafkaListener` 병렬 워커 물리 제어 |

### 4. Observability & Monitoring (관측성)
| 도구명 | 역할 | 공식 가이드 좌표 | 데이터 물리 (Physical Data) |
| :--- | :---: | :--- | :--- |
| **Actuator** | Health/Metric | [Reference](https://spring.io/projects/spring-boot) | `/actuator/prometheus` 엔드포인트 물리 |
| **Micrometer** | Timings/Counts | [Site](https://micrometer.io/) | Tag 기반 다차원 메트릭 위상 설계 |

---

### 5. Library Mastery Checklist (최종 시스템 체크리스트)
- [ ] **[Guide Check]**: 모든 개발자가 위 기재된 공식 문서를 숙지하고 정책을 준수하는가? (O/X)
- [ ] **[Conflict Check]**: `dependency:tree`를 통해 버전 충돌 엔트로피가 완벽하게 배제되었는가? (O/X)
- [ ] **[Performance Check]**: MapStruct 등 코드 생성 도구가 런타임에 리플렉션을 단 1%도 사용하지 않는가? (O/X)
- [ ] **[Security Check]**: JJWT 등 토큰 라이브러리의 시크릿 키가 환경 변수로 물리적으로 분리되었는가? (O/X)
- [ ] **[Tracing Check]**: 모든 외부 라이브러리 호출 시 `traceId`가 물리적으로 전파되는가? (O/X)

---
> [!IMPORTANT]
> **"압도적인 도구 활용이 압도적인 아키텍처를 만든다."** 본 명세서는 글로벌 Java 생태계의 정수를 프로젝트에 물리적으로 이식하여, 단 한 줄의 코드나 단 하나의 라이브러리 선택도 실수 없이 완벽하게 동작하도록 보증합니다.
