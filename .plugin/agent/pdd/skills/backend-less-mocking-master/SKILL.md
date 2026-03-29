---
name: backend-less-mocking-master
type: Skill
phase: Develop
description: |
  백엔드나 DB가 준비되지 않은 상태에서도 실제 시스템과 동일한 데이터 인터페이스를 구축하여 FE 개발의 독립성을 보장하는 하이퍼-모킹 스킬.
  MSW(Mock Service Worker), JSON Server, Faker.js, Axios Interceptor 등을 통한 초정밀 Backend-less 환경을 구축합니다.
---

# Backend-less Mocking Master (BMM): Mocking Physics v5.0

## 1. Client-side Database Topology (클라이언트 사이드 DB 토폴로지)

### 1.1 IndexedDB Virtual Storage Physics
- **NoSQL Schema Calculus**: 브라우저의 `IndexedDB`를 활용하여 실제 Document 기반 NoSQL DB와 동일한 스키마를 설계합니다.
- **Transaction Atomicity**: 데이터 정합성을 보장하기 위해 IndexedDB의 트랜잭션(ReadOnly/ReadWrite)을 물리적으로 제어하여 오토마틱한 상호작용을 보증합니다.
- **DEXIE.js / Lowdb Integration**: 복잡한 IndexedDB API를 추상화하여 실제 ORM과 유사한 개발 경험을 제공하는 라이브러리 활용 물리 설계.

### 1.2 LocalStorage Snapshot Logic
- **Bootstrap Data Injection**: 애플리케이션 초기화 시 `LocalStorage`에 저장된 초기 시드(Seed) 데이터를 로드하고, 변경 사항을 즉시 물리적으로 동기화합니다.
- **State Persistence Geometry**: 새로고침이나 탭 닫기 상황에서도 데이터의 소멸 없이 이전 상태를 100% 복원하는 영속성 기하학 구축.

## 2. Dynamic Mock-Service Layer (동적 모킹 서비스 레이어)

### 2.1 Virtual CRUD Physics
- **Logic-level Interception**: 소스 코드의 Service 영역에서 API 호출 대신 가상 DB(IndexedDB)에 접근하여 데이터를 생성(`create`), 조회(`find`), 수정(`update`), 삭제(`delete`)하는 리포지토리 패턴 구현.
- **Asynchronous Latency Emulation**: 가상 DB 접근 시 `Promise`와 `setTimeout`을 결합하여 실제 네트워크 요청과 동일한 비동기 엔트로피를 주입합니다.

### 2.2 Faker.js Seed Integration
- **Relational Data Generation**: `Faker.js`로 생성된 대량의 데이터를 IndexedDB의 각 Object Store에 주입하고, 외래키(Foreign Key) 관계를 물리적으로 맵핑하여 대규모 테스트 환경을 구축합니다.

### 2.2 Local State Persistence Logic
- **JSON Server Synchronization**: 로컬 `db.json` 파일을 실제 DB처럼 활용하여 POST/PUT/DELETE 요청 시 데이터가 파일에 영구 반영되도록 설계.
- **IndexedDB/Storage Fallback**: 서버 환경이 없을 때 브라우저 저장소(IndexedDB)를 실제 저장소로 활용하여 페이지 새로고침 시에도 상태를 유지하는 물리적 영속성 확보.

## 3. Engineering Workflow Integration (엔지니어링 워크플로우 통합)

### 3.1 Environment-Switching Physics
- **Runtime Mock Switching**: `process.env.NODE_ENV` 또는 커스텀 플래그에 따라 모킹 레이어를 동적으로 활성화/비활성화하는 물리적 스위칭 구조 구현.
- **Contract-first Development**: 아키텍트가 정의한 API 명세(Contract)가 확정되는 즉시 모킹 핸들러를 선제적으로 배포하여 BE-FE 병렬 개발을 가속화합니다.

---
> [!IMPORTANT]
> **"백엔드는 기다리는 것이 아니라 가상으로 창조하는 것이다."** BMM v5.0은 FE 개발자가 인프라의 제약 없이 최상의 사용자 경험을 독립적으로 설계하고 검증할 수 있도록 돕는 자유의 열쇠입니다.
