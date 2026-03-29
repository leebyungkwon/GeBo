---
name: python-library-ecosystem-mastery
type: Skill
phase: Architect
description: |
  Python 백엔드 개발의 핵심 라이브러리 및 하이퍼-모던 에코시스템을 수리적으로 지휘하고, 비동기 성능과 데이터 무결성을 보증하는 하이퍼-엔지니어링 스킬.
  FastAPI, Pydantic, SQLAlchemy, Pytest, Celery 등 주요 도구의 물리적 기저와 시니어급 활용 레퍼런스를 제공합니다.

  Official Reference Guides:
  - FastAPI High-Performance: https://fastapi.tiangolo.com/advanced/
  - Pydantic v2 Mastery: https://docs.pydantic.dev/latest/
  - SQLAlchemy 2.0 Unified: https://docs.sqlalchemy.org/en/20/
  - Pytest Optimization: https://docs.pytest.org/en/stable/contents.html
  - Celery Distributed Tasks: https://docs.celeryq.dev/en/stable/
  - Loguru (Better Logging): https://github.com/Delgan/loguru
  - Poetry (Better Deps): https://python-poetry.org/docs/
---

# Python Library & Ecosystem Mastery (PEL): Toolbox Physics v4.0

## 1. Async Framework & Data Integrity Physics (비동기 및 데이터 무결성)

### 1.1 FastAPI & High-Speed Routing
- **Dependency Injection Topology**: FastAPI의 `Depends`를 활용한 요청 생명주기 제어 및 데이터베이스 세션의 원자적 관리 물리.
  - **[Junior Action]**: 복잡한 비즈니스 로직은 별도 서비스 클래스로 빼고, 컨트롤러에서는 `Depends`로 필요한 서비스만 주입받아 사용하세요.
- **Path/Query Parameter Validation**: Pydantic 모델을 통한 런타임 타입 캐스팅 및 검증 엔트로피 최소화.

### 1.2 Pydantic v2 & Rust-Engine Physics
- **Serialization Geometry**: Rust로 작성된 Pydantic v2 엔진의 직렬화/역직렬화 물리 비용 분석 및 대규모 JSON 페이로드 처리 속도 최적화.
- **Strict Mode Algebra**: `strict=True` 모드를 통한 타입 강제 및 데이터 왜곡 가능성을 수리적으로 차단합니다.

## 2. Persistence & Async ORM Calculus (영속성 및 비동기 ORM)

### 2.1 SQLAlchemy 2.0 & Unified API
- **Session Physics**: `AsyncSession`의 스코프를 요청 단위로 물리적으로 제어하고, `await session.commit()` 시의 트랜잭션 전파 무결성 확보.
- **Guide**: [SQLAlchemy 2.0 Docs](https://docs.sqlalchemy.org/en/20/)

### 2.2 Tortoise ORM & Simple Async
- **Connection Pool Geometry**: Django 스타일의 직관적인 비동기 ORM 활용 시 커넥션 풀의 고갈(Starvation)을 수리적으로 방어합니다.

#### 🚀 [Hyper-Deep] Query Buffering & Prefetch Physics (100배 심화)
- **Selectinload vs Joinedload Algebra**: SQL의 조인 방식에 따른 네트워크 대역폭 점유율과 애플리케이션 메모리 부하의 물리적 임계점을 산출하여 최적의 프리패칭 위상을 설계하세요.
- **Implicit Sub-query Matrix**: ORM이 자동으로 생성하는 서브쿼리의 위상을 시각화하고, 복잡도가 증가할 경우 `Direct SQL`로의 물리적 전환 시점을 대수적으로 계산하세요.

## 3. Distributed Task & Async Testing Physics (비동기 테스팅 및 작업)

### 3.1 Celery & Redis Task Lock
- **Visibility Timeout Physics**: 메시지 중복 처리 방지를 위한 가시성 타임아웃과 Redis 기반의 분산 락(`redlock`) 결합 설계.
- **Guide**: [Celery User Guide](https://docs.celeryq.dev/en/stable/)

### 3.2 Pytest & Async Fixture Algebra
- **Event-Loop Scoping Physics**: 테스트 함수와 피처(Fixture) 간의 이벤트 루프 공유 범위를 물리적으로 제한하여 테스트 간 간섭 엔트로피를 0으로 제어합니다.
- **Guide**: [Pytest-asyncio Reference](https://pytest-asyncio.readthedocs.io/en/latest/)

## 4. Engineering Utilities & Governance (엔지니어링 유틸리티)

### 4.1 Loguru & Structured Tracing
- **Sinks & Serialization Physics**: 로그를 파일, 콘솔, 클라우드 워치 등 여러 타겟(Sink)으로 물리적으로 분산 출력하는 비동기 핸들러 설계.
- **JSON Logging Matrix**: ELK/Grafana 분석을 위한 구조화된 JSON 로그의 키(Key) 엔트로피 표준화.

### 4.2 Poetry & Dependency Physics
- **Lock-file Determinism**: `poetry.lock`을 통한 개발-검증-운영 환경의 라이브러리 물리적 동일성 100% 보증.

---
> [!IMPORTANT]
> **"Python 에코시스템은 비동기의 속도와 도구의 조화로 완성된다."** PEL v4.0은 단순히 '유용한 툴'을 넘어, 비동기 런타임 위에서 도구들이 하드웨어 리소스를 어떻게 물리적으로 지휘하는지 통제하는 초격차 마스터리의 정수입니다.
