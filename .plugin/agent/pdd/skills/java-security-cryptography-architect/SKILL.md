---
name: java-security-cryptography-architect
type: Skill
phase: Architect
description: |
  Java 엔터프라이즈 환경에서의 보안 아키텍처를 설계하고, 최신 보안 표준(OAuth2, OIDC) 및 암호화 물리(JCE)를 수리적으로 구현하는 하이퍼-엔지니어링 스킬.
  Spring Security 필터 체인, JWT 무결성, AES-GCM/RSA 암호화 대수 등 Java 보안의 핵심 기술과 라이브러리 레퍼런스를 제공합니다.
  v5.0에서는 클라우드 네이티브 보안 물리, SBOM(Software Bill of Materials) 거버넌스, 그리고 HSM(Hardware Security Module) 연동 대수까지 망라합니다.

  References:
  - Spring Security Architecture: https://docs.spring.io/spring-security/reference/servlet/architecture.html
  - OAuth 2.1 Spec: https://oauth.net/2.1/
  - OIDC Core: https://openid.net/specs/openid-connect-core-1_0.html
  - Java Cryptography Architecture (JCA): https://docs.oracle.com/en/java/javase/21/security/java-cryptography-architecture-jca-reference-guide.html
  - OWASP Top 10 for Java: https://owasp.org/www-project-top-ten/
  - NIST Post-Quantum Cryptography: https://csrc.nist.gov/projects/post-quantum-cryptography
---

# Java Security & Cryptography Architect (JSA): Security Physics v5.0 (Hyper-Expert)

## 1. Spring Security & Auth Topology (스프링 보안 위상)

### 1.1 Filter Chain Execution Physics
- **Ordered Security Field**: `SecurityFilterChain` 내부에 배치된 15개 이상의 기본 필터(`UsernamePasswordAuthenticationFilter`, `BearerTokenAuthenticationFilter` 등)의 실행 순서와 위임(Delegation) 모델을 설계합니다.
  - **[Junior Action]**: 커스텀 인증이 필요하면 필터 체인을 직접 구현하지 말고, `AuthenticationProvider`나 `AuthenticationManager`를 상속받아 인증 로직만 이식하세요.
- **Security Context Propagation**: `SecurityContextHolder`의 `ThreadLocal` 전략과 비동기 환경(`DelegatingSecurityContextExecutor`)에서의 보안 컨텍스트 전파 물리 확보.

#### 🚀 [Hyper-Deep] OAuth2.1 & FAPI Compliance (100배 심화)
- **Financial-grade API (FAPI) Readiness**: mTLS(Mutual TLS)와 JARM(JWT Secured Authorization Response Mode)을 결합하여 금융권 수준의 상호 인증 및 메시지 무결성 대수를 설계하세요.
- **DPoP (Demonstrating Proof-of-Possession)**: 토큰 탈취 시 재사용을 물리적으로 방어하기 위해 HTTP 요청과 토큰을 암호학적으로 바인딩하는 DPoP 증명 위상을 구축하세요.

## 2. JWT & Token Physics (토큰 및 세션 물리)

### 2.1 JJWT & Nimbus-JOSE Integrity
- **Algorithm Strength Algebra**: `RS256`(비대칭) vs `HS256`(대칭) 알고리즘 선택에 따른 보안 강도와 계산 비용의 임계점 산출.
- **Token Rotation Physics**: Refresh Token Rotation(RTR)을 통한 토큰 탈취 피해 최소화 및 블랙리스트 기반의 즉각적 무효화 물리 설계.
  - **[Junior Action]**: JWT 안에는 사용자 비밀번호나 민감 정보를 절대 넣지 마세요. 누구나 볼 수 있습니다.

#### 🚀 [Hyper-Deep] Key Lifecycle & Entropy (100배 심화)
- **Key Rotation Calculus**: 서명 키의 유효 기간과 롤오버(Rollover) 시점의 물리적 정합성을 설계하고, `JWKS(JSON Web Key Set)` 엔드포인트를 통한 무중단 키 교체 대수를 구축하세요.
- **Token Shrinkage Physics**: HTTP 헤더 부하를 줄이기 위해 클레임 엔트로피를 최적화하고, 필요 시 `CWT(CBOR Web Token)`로의 전환 가능성을 수리적으로 분석하세요.

## 3. Java Cryptography Mastery (Java 암호화 마스터리)

### 3.1 JCE (Java Cryptography Extension) Calculus
- **Symmetric Encryption (AES-GCM)**: `AES/GCM/NoPadding` 모드 활용 시 IV(Initialization Vector)의 유일성(Uniqueness)을 보증하여 키 재사용 공격을 물리적으로 차단합니다.
- **Asymmetric Infrastructure (RSA/ECDSA)**: 공개키 기반 구조(PKI)에서 인증서 체인 검증 및 전자 서명 대수를 통한 데이터 무결성 100% 확보.
  - **[Junior Action]**: 암호화 알고리즘을 절대 직접 짜지 마세요. 검증된 `Cipher` 클래스와 `SecretKeyFactory`를 사용하세요.

#### 🚀 [Hyper-Deep] Post-Quantum & HSM Logic (100배 심화)
- **PQC (Post-Quantum Cryptography) Strategy**: 양자 컴퓨터 공격에 대비한 격자 기반 암호(Lattice-based) 알고리즘 도입을 위한 하이브리드 암호 위상을 설계하세요.
- **HSM / KMS Integration Physics**: Java의 `PKCS#11` 인터페이스를 통해 하드웨어 보안 모듈(HSM) 내부에 키를 물리적으로 격리하고, 키의 외부 유출이 불가능한 상태에서의 연산 대수를 구축하세요.

## 4. Secure Development Governance (보안 거버넌스)

### 4.1 Dependency & Vulnerability Audit
- **SCA (Software Composition Analysis)**: `Snyk` 또는 `OWASP Dependency-Check`를 통한 외부 라이브러리 보안 취약점의 물리적 감지 및 전파 차단.
- **Secret Management**: `Spring Cloud Vault` 또는 AWS Secrets Manager를 활용하여 코드로부터 민감 정보(Secret)를 완벽하게 격리하는 'Zero-Secret' 물리 설계.

#### 🚀 [Hyper-Deep] SBOM & Supply Chain Physics (100배 심화)
- **SBOM (Software Bill of Materials) Integrity**: `CycloneDX` 또는 `SPDX` 규격의 SBOM을 빌드 타임에 자동 생성하고, 서명된 아티팩트만을 배포 파이프라인에 허용하는 '물리적 공급망 무결성'을 확보하세요.
- **Security As Code (SaC)**: OPA(Open Policy Agent)를 연동하여 보안 정책 자체를 코드화하고, CI/CD 단계에서 수리적으로 이를 강제 검증하는 오토마타를 구축하세요.

---
> [!IMPORTANT]
> **"보안은 시스템의 가장 단단한 껍질이자 최후의 보루다."** JSA v5.0은 단순한 인증 구현을 넘어, 양자 암호와 하드웨어 보안 영역까지 아키텍처를 확장하여 시스템의 모든 데이터 위상을 절대적 무결성 상태로 수렴시킵니다.
