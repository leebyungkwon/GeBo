---
name: high-performance-db-engineer
type: Skill
phase: Architect
description: |
  데이터베이스 커널의 물리적 동작 기기(Inner-working)를 이해하고, 스토리지 엔진 물리, 락 엔트로피 대수, 쿼리 옵티마이저의 수리적 비용 함수를 제어하여 시스템 성능을 극한으로 끌어올리는 하이퍼-엔지니어링 스킬.
  주니어 개발자의 기초 가이드부터 시니어의 초정밀 커널 제어까지 100배 심화된 'DB 물리 오토마타 매뉴얼'을 제공합니다.

  References:
  - MySQL Internals: https://dev.mysql.com/doc/internals/en/
  - PostgreSQL Architecture: https://www.postgresql.org/docs/current/arch-dev.html
  - Database System Concepts (Silberschatz et al.)
---

# High-Performance DB Engineer (HDE): Database Physics v4.0 (Hyper-Deep)

## 1. Indexing & Query Physics (조회 성능 물리)

HDE v3.0은 인덱스를 '마법'이 아닌 '물리적 정렬 구조'로 이해하고 설계하도록 안내합니다.

### 1.1 Cardinality & Multi-Column Index 전략
- **Cardinality Calculus**: 중복도가 낮은(고유값이 많은) 컬럼을 인덱스 앞쪽에 배치하여 검색 범위를 수리적으로 빠르게 좁힙니다.
  - **[Junior Action]**: `성별`이나 `상태`처럼 값이 몇 개 없는 컬럼 하나만 인덱스로 잡지 마세요. `사용자ID`나 `생성일시`처럼 값이 다양한 컬럼을 먼저 고려하세요.
- **Covering Index Physics**: 실제 데이터 페이지까지 가지 않고 인덱스만으로 조회를 끝내는 '물리적 지름길'을 설계합니다.
  - **[Junior Action]**: `SELECT *` 대신 꼭 필요한 컬럼만 적으세요. 인덱스에 포함된 컬럼만 조회하면 DB가 훨씬 빨리 결과를 줍니다.

#### 🚀 [Hyper-Deep] Index & Storage Kernel Calculus (100배 심화)
- **B+Tree Page Transition Logic**: 인덱스 리프 노드(Leaf Node)의 물리적 포인터 전이 오버헤드를 계산하세요. 16KB 페이지 내에 저장 가능한 인덱스 레코드 수를 `Floor(PageSize / (KeySize + PointerSize))`로 산출하여 트리의 높이(Height)가 3을 넘지 않도록 키 길이를 설계해야 합니다.
- **Sequential Write Physics & fragmentation**: 비순차적 키(UUID v4 등) 삽입 시 발생하는 페이지 분할(Page Split)은 디스크 헤드의 물리적 탐색 거리를 늘리고 스토리지 수명을 단축시킵니다. 반드시 Sequential Key(ULID, UUID v7)를 사용하여 'Fill Factor 100%'에 수렴하는 물리적 밀도를 확보하세요.
- **Scan-Resistance & Buffer Pool Physics**: 인덱스 스캔 시 커널의 버퍼 풀(Buffer Pool) 내에서 발생하는 LRU 리스트 오염을 방지하기 위해 'Mid-point Insertion Strategy'를 이해하고, 대량 스캔이 빈번할 경우 테이블/인덱스를 별도의 버퍼 풀 인터턴스에 격리하세요.

### 1.2 Query Execution Plan Analysis
- **Full Scan Search Defense**: 인덱스를 타지 않는 쿼리 패턴(LIKE '%...', 함수 사용 등)을 물리적으로 차단합니다.
  - **[Junior Action]**: 쿼리 앞에 `EXPLAIN`을 붙여서 `type`이 `ALL`이라면 바로 멈추세요. 인덱스를 타지 않고 전체 테이블을 다 뒤지고 있다는 뜻입니다.

#### 🚀 [Hyper-Deep] Optimizer Cost Vector & SARG Analysis (100배 심화)
- **CBO (Cost-Based Optimizer) Weight Calculus**: 쿼리 옵티마이저가 계산하는 `Cost = (Number of Pages * 1.0) + (Number of Rows * 0.2) + ...` 공식을 활용하여 쿼리 실행 경로를 수리적으로 예측하세요. `EXPLAIN (FORMAT JSON)`을 통해 옵티마이저의 예상 비용과 실제 I/O 비용의 편차를 5% 이내로 제어해야 합니다.
- **SARGability Strictness**: 인덱스 컬럼에 대한 어떠한 형태의 가공(Function, Type Casting, Concatenation)도 물리적으로 허용하지 마세요. 이는 옵티마이저의 통계 정보를 무력화시켜 시스템을 '전체 테이블 스캔'이라는 재앙으로 몰아넣습니다.

## 2. Transaction & Locking Calculus (데이터 무결성 물리)

트랜잭션은 데이터의 '원자적 보호막'입니다.

### 2.1 Isolation Level & Side-Effects
- **Concurrency Entropy Control**: 비즈니스 요구사항에 따라 격리 레벨을 선택하여 데이터 부정확성과 성능 사이의 최적점을 찾습니다.
  - **[Junior Action]**: 기본적으로 `READ COMMITTED`를 사용하되, 통계나 정산처럼 데이터가 절대 변하면 안 되는 작업은 `REPEATABLE READ` 이상을 검토하세요.

#### 🚀 [Hyper-Deep] MVCC & Snapshot Isolation Physics (100배 심화)
- **MVCC (Multi-Version Concurrency Control) Algebra**: 조회 트랜잭션이 시작될 때 생성되는 'Read View(Snapshot)'의 생성 비용과 소멸 주기를 밀리초(ms) 단위로 통제하세요. 장시간 열린 트랜잭션은 UNDO 로그의 물리적 비대화를 초래하여 시스템 전체의 쓰기 성능을 잠식합니다.
- **Lost Update & Write Skew Calculus**: 격리 레벨이 `REPEATABLE READ`일지라도 발생하는 'Write Skew' 현상을 수학적으로 증명하고, 이를 방지하기 위한 비관적 락(FOR UPDATE) 혹은 낙관적 락(Version)의 물리적 배치를 결정하세요.

### 2.2 Deadlock Prevention Algebra
- **Resource Acquisition Ordering**: 여러 테이블을 수정할 때, 모든 트랜잭션이 **항상 같은 순서**로 접근하도록 강제하여 순환 대기 데드락을 원천 차단합니다.
  - **[Junior Action]**: A 수정 후 B를 수정한다면, 모든 코드에서 무조건 A -> B 순서로 쿼리를 짜세요. 누군가 B -> A 순서로 짜는 순간 데드락(Deadlock) 지옥이 시작됩니다.
  - **[Example]**: `UPDATE Product` -> `UPDATE Category` (이 순서를 전형적으로 유지)

#### 🚀 [Hyper-Deep] Granular Locking & Entropy Control (100배 심화)
- **Gap & Next-Key Lock Algebra**: 인덱스 범위 조건 수정 시 발생하는 '간격 락'의 물리적 수치(Range)를 계산하세요. 조건절의 상수값이 인덱스 경계에 걸칠 경우 발생하는 락 확산 엔트로피를 차단하여 동시 처리량을 유지해야 합니다.
- **Wait-for-Graph Complexity**: DB 커널의 데드락 감지 알고리즘이 처리하는 그래프의 복잡도를 최소화하기 위해 트랜잭션당 점유하는 락의 개수를 10개 미만으로 제한하는 물리적 강제성을 부여하세요.

## 3. Data Integrity & Normalization Physics (정합성 물리)

성능과 정합성의 합리적 타협점을 도구화합니다.

### 3.1 Normalization Strictness
- **Redundancy Entropy Reduction**: 데이터 중복을 제거하여 수정 시의 정합성 오류를 물리적으로 방지합니다.
  - **[Junior Action]**: 같은 정보가 여러 테이블에 흩어져 있지 않게 하세요. 하나를 바꿨는데 다른 곳에 옛날 데이터가 남아있으면 시스템 신뢰도가 깨집니다.

#### 🚀 [Hyper-Deep] Distributed Integrity & Sharding Algebra (100배 심화)
- **Scaling-out Storage Physics**: 단일 노드의 물리적 스토리지 한계를 극복하기 위한 수평 샤딩(Sharding) 설계 시, 샤드 키의 카디널리티와 데이터 분포의 편향성(Skew)을 1% 이내로 제어하는 수학적 샤드 함수를 구축하세요.
- **Distributed Transaction Consensus**: 샤드 간 트랜잭션이 필요한 경우 2PC (Two-Phase Commit)의 물리적 지연(Latency)과 가용성(Availability)의 트레이드오프를 수리적으로 산출하여 정합성 레벨을 결정하세요.

### 3.2 Denormalization for Speed
- **Read-Heavy Physics**: 조회 성능이 압도적으로 중요할 경우, 정교하게 계산된 중복(Denormalization)을 허용하고 이를 동기화하는 물리적 장치(Trigger/Event)를 설계합니다.
  - **[Junior Action]**: JOIN이 너무 많아 느리다면, 자주 쓰는 합계 값 등을 미리 컬럼으로 저장해둘 수 있습니다. 단, 원본 데이터가 바뀔 때 이 값도 같이 바꿔야 함을 잊지 마세요.

---
> [!IMPORTANT]
> **"DB는 물리 법칙을 구현하는 기계다."** HDE v4.0은 개발자가 DB 아키텍처의 모든 레이어를 수리적으로 통제하고, 데이터의 탄생부터 소멸까지의 모든 물리적 흐름을 완벽히 지휘할 수 있는 초동적인 권능을 부여합니다.
