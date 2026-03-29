# Language Level Mastery Spec (v4.0 Hyper-Deep)
## Project: [Project Name] | Designer: Technical Architect (LME Master)
### 🧠 언어 레벨 동작 물리 및 런타임 최적화 명세서

본 문서는 사용 중인 프로그래밍 언어의 런타임 엔진이 데이터를 어떻게 물리적으로 처리하고 최적화하는지 보증하는 **초정밀 언어 마스터리 명세서**입니다.

---

### 1. Language & Runtime Environment (언어 및 환경)
| 항목 | 사양 (Specification) | 런타임 엔진 (Engine) | 비고 |
| :--- | :---: | :--- | :--- |
| **Language** | Java 21 | OpenJDK HotSpot JVM | 최신 LTS 버전 기준 |
| **Memory Model** | JMM (Java Memory Model) | ZGC (Scalable Low Latency) | 저지연 최적화 |

### 2. Memory Allocation & GC Strategy (메모리 및 GC)
| 메모리 영역 | 관리 정책 | 물리적 제약 (Size) | 최적화 기법 |
| :--- | :--- | :---: | :--- |
| **Heap** | Generational / Region-based | Xmx: 8GB / Xms: 8GB | Pause Time < 10ms 목표 |
| **Metaspace** | Class Metadata Store | Max: 512MB | Dynamic Resizing 제어 |

#### 🚀 [Hyper-Deep] Memory Physics Matrix (100배 심화)
- **Object Layout**: 객체 헤더(Mark Word + Class Pointer) 12Bytes 및 8Bytes 패딩 정렬을 고려한 데이터 구조 설계.
- **GC Trigger Algebra**: 힙 점유율 70% 도달 시 동시성 사이클(Concurrent Cycle) 시작 수리 모델링 및 단편화(Fragmentation) 지수 5% 이내 관리.

### 3. Concurrency & Locking Spec (동시성 명세)
| 동시성 기법 | 적용 대상 | 제어 로직 | 경합 지수 (Contention) |
| :--- | :---: | :--- | :---: |
| **Virtual Thread** | IO-bound Tasks | Project Loom (Carrier Thread mapping) | Zero Switch Overhead |
| **Atomic/CAS** | Counters / Flags | `CompareAndSet` (Non-blocking) | Very Low |

#### 🚀 [Hyper-Deep] Synchronization Calculus (100배 심화)
- **Biased Locking Physics**: 특정 스레드의 독점적 사용 시 발생하는 락 편향(Biasing) 해제 비용 계산.
- **Instruction Reordering Guard**: 핵심 변수에 대한 `Acquire/Release` 시맨틱 준수 증명 및 CPU 캐시 가시성 보증.

### 4. Language Idioms & Type Calculus (언어 이식 및 타입)
- **[Junior Action]**: `Null-safe` 처리를 위해 `Optional`을 사용하되, 필드나 파라미터에는 사용하지 마세요 (반환값으로만 사용).
- **[Purity Check]**: 핵심 도메인 로직은 입출력이 명확한 순수 함수(Pure Function)로 구성되었는가?

#### 🚀 [Hyper-Deep] Compiler Optimization Guard (100배 심화)
- **Tiered Compilation**: C1(Client) 및 C2(Server) 컴파일러의 메서드 인라이닝 임계치(`MaxInlineSize`) 분석 및 최적 유도.
- **Generic Erasure Matrix**: 런타임 시 타입 정보 소멸(Erasure)에 대비한 `Reflection` 및 `TypeToken` 활용 무결성 검증.

### 5. Language Mastery Checklist (최종 마스터리 체크)
- [ ] 불필요한 `Auto-boxing`으로 메모리/CPU를 낭비하지 않는가? (O/X)
- [ ] 루프 내에서 불변 객체(String 등)를 반복 생성하지 않았는가? (O/X)
- [ ] 자원 반납이 필요한 객체(`Closeable`)에 `try-with-resources`를 적용했는가? (O/X)
- [ ] 동시성 처리가 필요한 컬렉션에 적절한 `Concurrent` 패키지를 사용했는가? (O/X)

---
> [!IMPORTANT]
> **"기계의 언어를 이해하는 자가 시스템을 지배한다."** 본 명세서는 단순한 코딩 규칙을 넘어, 프로그래밍 언어의 런타임 엔진이 가진 모든 물리적 권능을 100% 활용하도록 보증하는 초격차 마스터 바이블입니다.
