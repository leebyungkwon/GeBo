# Python Library Selection & Usage Spec (v4.0 Hyper-Deep)
## Project: [Project Name] | Auditor: Technical Architect (PEL Master)
### 📚 Python 라이브러리 에코시스템 통합 활용 및 가이드 명세서

본 문서는 프로젝트에 도입되는 모든 Python 라이브러리의 **공식 가이드 좌표**, **비동기 동작 정책**, 그리고 **도구 간 시너지 무결성**을 보증하는 초정밀 명세서입니다.

---

### 1. Async Framework & Validation (프레임워크 및 검증)
| 라이브러리 그룹 | 추천 스택 | 공식 가이드 좌표 (Quick Link) | 물리적 핵심 정책 |
| :--- | :---: | :--- | :--- |
| **Web Framework** | FastAPI | [Guide](https://fastapi.tiangolo.com/) | Asyncio 기반 비차단 루프 최적화 |
| **Validation** | Pydantic v2 | [Guide](https://docs.pydantic.dev/) | Rust 엔진 기반 고속 타입 검증 |
| **Security** | Python-JOSE | [Docs](https://python-jose.readthedocs.io/) | JWT 클레임 암호화 물리 보증 |

### 2. Async Persistence & Mapping Matrix (비동기 영속성)
| 도구명 | 핵심 기능 | 공식 가이드 좌표 | 하이퍼-딥 최적화 포인트 |
| :--- | :---: | :--- | :--- |
| **SQLAlchemy** | Async ORM | [Reference](https://docs.sqlalchemy.org/) | `AsyncSession` 트랜잭션 원자성 |
| **Tortoise ORM** | Schema Design | [Reference](https://tortoise.github.io/) | Django 스타일 비동기 매핑 무결성 |
| **Redis-py** | Async Cache | [GitHub](https://github.com/redis/redis-py) | 커넥션 풀 고갈(Starvation) 방어 |

#### 🚀 [Hyper-Deep] ORM Prefetch & Buffer Physics (100배 심화)
- **Relationship Matrix**: `selectinload` 사용 시의 SQL 쿼리 분할 물리와 N+1 방지 임계점 산출.
- **Model Conversion Cost**: Pydantic 모델과 ORM 엔티티 간의 변환 오버헤드 측정 및 `from_attributes` 최적화.

### 3. Task & Messaging Infrastructure (작업 및 메시징)
| 라이브러리 | 적용 기술 | 공식 가이드 좌표 | 물리적 제약 조건 (Constraint) |
| :--- | :---: | :--- | :--- |
| **Celery** | Distributed Tasks | [Guide](https://docs.celeryq.dev/) | Task Ack/Retry 지수 백오프 물리 |
| **Loguru** | Structured Log | [GitHub](https://github.com/Delgan/loguru) | 비동기 Thread-safe 로깅 물리 |

### 4. Testing & Dependency Governance (테스팅 및 거버넌스)
| 도구명 | 역할 | 공식 가이드 좌표 | 물리적 격리 수준 |
| :--- | :---: | :--- | :--- |
| **Pytest** | Test Runner | [Reference](https://docs.pytest.org/) | 비동기 피처 스코핑 무결성 |
| **Poetry** | Package Mgmt | [Site](https://python-poetry.org/) | `pyproject.toml` 기반 버전 결정론 |

---

### 5. Library Mastery Checklist (최종 시스템 체크리스트)
- [ ] **[Async Check]**: 모든 라이브러리가 이벤트 루프를 차단(Blocking)하지 않고 비동기로 동작하는가? (O/X)
- [ ] **[Validation Check]**: 입출력 데이터가 Pydantic 모델을 통해 누락 없이 물리적으로 검증되었는가? (O/X)
- [ ] **[Concurrency Check]**: 전역 상태를 공유하는 라이브러리 사용 시 비동기 락(Async Lock)이 설계되었는가? (O/X)
- [ ] **[Tracing Check]**: 외부 API 호출 라이브러리(httpx 등) 사용 시 `X-Trace-Id`가 전파되는가? (O/X)

---
> [!IMPORTANT]
> **"비동기 도구의 정밀한 조율이 고성능 파이썬 시스템을 만든다."** 본 명세서는 최신 Python 에코시스템의 정수를 프로젝트에 물리적으로 이식하여, 생산성과 성능이라는 상충하는 두 가치를 동시에 극대화합니다.
