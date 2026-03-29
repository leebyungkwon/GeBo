# Python Security Implementation Spec (v4.0 Hyper-Deep)
## Project: [Project Name] | Auditor: Technical Architect (PSA Master)
### 🔒 Python 비동기 보안 아키텍처 및 구현 명세서

본 문서는 프로젝트의 모든 Python 보안 요소가 **FastAPI/FastAPI-Users 표준 및 수리적 비동기 보안 원칙**을 엄격히 준수하고 있는지 규정하는 초정밀 명세서입니다.

---

### 1. Framework Security & Identity (프레임워크 및 신원)
| 보안 영역 | 기술 스택 (Tech Stack) | 주요 라이브러리 | 물리적 핵심 정책 |
| :--- | :---: | :---: | :--- |
| **Auth Engine** | FastAPI Security | `Depends(OAuth2)` | 비동기 Scopes 기반 권한 분리 |
| **Identity** | OAuth2 / OIDC | `python-jose` | 비대칭 RS256 서명 강제 |
| **Validation** | Pydantic v2 | `pydantic[email]` | 엄격 타입(Strict) 검증 및 정제 |

- **[Junior Guide]**: API의 모든 엔드포인트는 기본적으로 `Authenticated` 상태여야 하며, 명시적으로 `Public`인 경우만 제외 처리하세요.

### 2. Data Protection & Cryptography (데이터 보호 및 암호학)
| 보호 대상 | 암호화 알고리즘 | 라이브러리 (Lib) | 키 관리 정책 |
| :--- | :---: | :---: | :--- |
| **Secrets** | AES-256-CFB / Fernet | `cryptography` | 환경 변수 및 Vault 격리 |
| **Passwords** | Argon2 / BCrypt | `passlib` | 해시 전용 Salt 물리 보증 |
| **Token** | JWT (Stateless) | `python-jose` | 만료 시간(exp) 강제 검증 |

#### 🚀 [Hyper-Deep] Async Serialization Hygiene (100배 심화)
- **Injection Defense**: Pydantic 모델의 `Field` 클래스를 활용한 Regex 기반 입력값 물리적 필터링.
- **Model Exclusion**: 응답 모델 반환 시 `exclude_unset=True` 및 `exclude={"internal_field"}`를 통한 의도치 않은 데이터 노출 물리적 차단.

### 3. Middleware & Perimeter Defense (미들웨어 및 경계 방어)
| 차단 항목 | 적용 기술 | 설정 파라미터 | 비고 |
| :--- | :---: | :---: | :--- |
| **CORS** | FastAPI CORS | `allow_origins=WHITELIST` | 와일드카드 사용 절대 금지 |
| **DoS** | SlowAPI | `Fixed Window` | IP 기반 비동기 속도 제한 |
| **Headers** | Secure Header MW | `HSTS, CSP` | 브라우저 보안 정책 강제 |

### 4. Secure Auditing & Governance (보안 관리)
| 감사 도구 | 적용 포인트 | 실행 주기 | 물리적 대응 정책 |
| :--- | :---: | :---: | :--- |
| **Bandit** | Source Code | CI/CD 단계 | 취약 코드 발견 시 배포 Stop |
| **Safety** | Dependencies | 빌드 시 | CVE 취약 패키지 즉시 교체 |
| **Gitleaks** | Git History | 커밋 시 | 시크릿 유출 시 키 즉시 무효화 |

---

### 5. Python Security Checklist (최종 시스템 체크리스트)
- [ ] **[Loop Check]**: 인증 처리 중 차단(Blocking) IO가 발생하여 이벤트 루프를 저해하지 않는가? (O/X)
- [ ] **[JWT Check]**: 토큰의 서명 알고리즘이 약한 것(MD5, SHA1 등)을 사용하지 않는가? (O/X)
- [ ] **[Sanitizing Check]**: 모든 사용자 입력이 Pydantic 모델을 거쳐 정규화 및 정제되었는가? (O/X)
- [ ] **[Logging Check]**: 로그에 토큰 정보를 포함한 민감 정보가 텍스트로 남지 않는가? (O/X)

---
> [!IMPORTANT]
> **"보안은 가장 약한 코드 한 줄의 강도와 같다."** 본 명세서는 Python 비동기 생태계의 모든 보안 역량을 집결시켜, 개발 속도와 보안성이라는 상충하는 두 가치를 물리적으로 조화시키고 시스템의 신뢰도를 극대화합니다.
