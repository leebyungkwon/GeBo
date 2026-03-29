---
name: python-security-cryptography-architect
type: Skill
phase: Architect
description: |
  Python 비동기 환경에서의 보안 아키텍처를 설계하고, 고성능 암호화 및 데이터 무결성을 수리적으로 구현하는 하이퍼-엔지니어링 스킬.
  FastAPI Security 위상, Pydantic 새니타이징, Cryptography(PyCa) 대수, 비동기 세션 물리 등 Python 보안의 핵심 기술과 레퍼런스를 제공합니다.

  References:
  - FastAPI Security Deep Dive: https://fastapi.tiangolo.com/tutorial/security/
  - Python Cryptography Authority (PyCa): https://cryptography.io/en/latest/
  - OWASP Top 10 for Python: https://owasp.org/www-project-python-honeypot/
  - Python-JOSE (JWT): https://python-jose.readthedocs.io/
  - Passlib (Password Hashing): https://passlib.readthedocs.io/
---

# Python Security & Cryptography Architect (PSA): Async Security Physics v4.0

## 1. Async Framework & Auth Topology (비동기 보안 위상)

### 1.1 FastAPI OAuth2 & Dependency Physics
- **Async Dependency Injection**: `Depends()`를 활용한 비동기 인증/인가 필터의 물리적 실행 순서와 리소스 점유 최적화를 설계합니다.
- **Security Scopes Algebra**: `SecurityScopes`를 활용한 정밀한 접근 권한 분리 및 비동기 요청 단위의 권한 검증 무결성 확보.
  - **[Junior Action]**: 매 요청마다 DB 조회가 필요한 인증 보다는 JWT의 클레임을 활용한 무상태(Stateless) 검증을 우선하세요.

### 1.2 Pydantic Data Sanitization Matrix
- **Field-level Sanitization Logic**: `Annotated`와 `Validator`를 결합하여 입력 데이터의 XSS/SQL Injection 위협을 물리적 진입 단계에서 차단합니다.
- **Strict Parsing Physics**: `model_validate(strict=True)` 모드를 통한 타입 강제 및 묵시적 데이터 변환으로 인한 보안 취약점 배제.

## 2. Token & Encryption Physics (토큰 및 암호화 물리)

### 2.1 Python-JOSE & JWT Integrity
- **Asymmetric Signature Algebra**: `cryptography` 백엔드를 사용한 `RS256` 서명 생성 및 검증의 물리적 성능 한계 산출.
- **Exp/Nbf/Iss Validation**: 토큰의 생명주기와 발행처를 비동기 이벤트 루프 차단 없이 고속으로 검증하는 대수적 처리.

### 2.2 PyCa (cryptography) Implementation
- **Fernet & AEAD Logic**: `cryptography.fernet`을 활용한 대칭 키 암호화 시, 인증된 암호화(AEAD)를 통한 데이터 변조 탐지 무결성 확보.
- **SecretKey Derivation (PBKDF2/Scrypt)**: 낮은 엔트로피의 비밀번호로부터 강력한 물리적 암호 키를 생성하기 위한 반복 횟수(Iterations) 대수 설계.
  - **[Junior Action]**: `OS.urandom()`을 활용한 암호학적 난수 생성기를 사용하고, 고정된 Salt를 절대 사용하지 마세요.

## 3. Distributed Task & Session Security (분산 보안 물리)

### 3.1 Redis-py Async Lock
- **Session Fingerprinting**: 비동기 Redis를 활용하여 토큰 세션의 지문(Fingerprint)을 물리적으로 관리하고, 다중 로그인 및 토큰 탈취를 감지하는 오토마타 설계.
- **Rate-Limiting Algebra**: `SlowAPi` 또는 Redis 윈도우 카운터를 통한 비동기 레벨의 서비스 거부 공격(DoS) 물리적 방어.

## 4. Engineering Governance & Audit (엔지니어링 거버넌스)

### 4.1 Safety & Bandit Analysis
- **Static Vulnerability Physics**: `Bandit`을 사용하여 소스코드 내 하드코딩된 비밀번호, 안전하지 않은 함수 사용 등을 물리적으로 상시 모니터링합니다.
- **Dependency Audit (Safety)**: `Safety` 도구를 통해 설치된 패키지 중 알려진 취약점이 있는 사양을 실시간 감지하고 차단합니다.

### 4.2 Logging & Masking Physics
- **Loguru Masking Logic**: 로그 출력 시 개인정보(PII)와 시크릿이 노출되지 않도록 `filter` 및 `serialize` 레이어에서의 물리적 마스킹 처리.

---
> [!IMPORTANT]
> **"비동기 보안은 속도와 안전의 정교한 매핑이다."** PSA v4.0은 Python의 유연함을 유지하면서도, 비동기 런타임이 가질 수 있는 보안적 허점을 수리적 무결성으로 보완하여 시스템의 신뢰 엔진을 구축하는 정수입니다.
