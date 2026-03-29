---
name: python-backend-mastery
type: Skill
phase: Architect
description: |
  Python 및 FastAPI/Django 생태계를 활용하여 고성능 비동기 백엔드 시스템과 데이터 중심 애플리케이션을 구축하는 하이퍼-마스터리 스킬.
  Asyncio 물리, Pydantic 데이터 무결성, ORM 최적화 등 Python 기반 백엔드의 핵심 기능과 레퍼런스를 집대성합니다.

  References:
  - FastAPI Docs: https://fastapi.tiangolo.com/
  - Python Asyncio: https://docs.python.org/3/library/asyncio.html
  - Real Python Backend: https://realpython.com/
  - High Performance Python (Micha Gorelick & Ian Ozsvald)
---

# Python Backend Mastery (PBM): Speed & Agility Physics v4.0

## 1. Asyncio & Performance Physics (비동기 및 성능 물리)

### 1.1 Event Loop & Coroutine Mastery
- **Non-blocking IO Physics**: `await`가 CPU를 놓아주는 시점과 커널 IO 대기 중 다른 작업을 수행하는 물리적 메커니즘을 설계합니다.
  - **[Junior Action]**: `async` 함수 안에서 `time.sleep()`이나 CPU 부하가 큰 동기 로직을 돌리지 마세요. 전체 서버가 멈춥니다. 반드시 `await asyncio.sleep()`을 쓰세요.
- **Context Management Algebra**: `contextvars`를 통해 비동기 스택 간 요청 컨텍스트를 안전하게 전파하는 물리적 위상 설계.

### 1.2 Pydantic & Data Integrity
- **Type-Hint Driven Serialization**: 데이터 검증과 직렬화를 Rust 기반 엔진(Pydantic v2)의 물리적 속도로 처리하여 데이터 무결성을 컴파일 타임급으로 확보합니다.
- **Schema Calculus**: 복잡한 중첩 모델링 시 순환 참조 방지 및 메모리 사용량 최적화 대수.

## 2. ORM & Query Optimization (ORM 및 쿼리 최적화)

### 2.1 Tortoise/SQLAlchemy Topology
- **Relationship Prefetching Logic**: Django/SQLAlchemy 사용 시 `select_related` (Join) vs `prefetch_related` (Multiple Query) 선택의 물리적 비용 분석.
- **Async Connection Pool Physics**: 데이터베이스 커넥션 풀의 크기와 비동기 워커(Worker) 개수의 수리적 상관관계 산출.

### 2.2 Migrations & Integrity
- **Alembic/Django Migrations**: 마이그레이션 시 발생하는 테이블 락(Table Lock)의 물리적 영향도 분석 및 Zero-downtime 스키마 변경 전략.

## 3. Python Ecosystem Mastery (Python 생태계 마스터리)

### 3.1 Dependency Management & Virtualization
- **Poetry/uv Physics**: 패키지 의존성 충돌을 수리적으로 해결하고, 런타임 이미지 크기를 최소화하기 위한 빌드 최적화.
- **Pytest Testing Algebra**: `conftest.py` 및 `fixture layering`을 통한 테스트 환경의 물리적 격리 및 속도 극대화.

### 3.2 Deployment & Scaling
- **Gunicorn/Uvicorn Worker Tuning**: CPU 코어 수와 워커 프로세스 개수(`2n + 1`)의 상관관계를 하드웨어 리소스와 매핑하여 최적화.
- **Celery & Task Queue Calculus**: 분산 작업 큐의 가시성 타임아웃(Visibility Timeout) 및 결과 저장소(Result Backend)의 물리적 부하 제어.

---
> [!IMPORTANT]
> **"Python은 생산성의 도구이자 성능의 예술이다."** PBM v4.0은 언어의 유연함을 유지하면서도, 물리적 병목을 해결하고 데이터의 무결성을 극한으로 끌어올려 Python 기반 시스템의 성공을 기술적으로 보증합니다.
