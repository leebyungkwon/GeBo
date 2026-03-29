---
name: integrity-reliability-auditor
type: Skill
phase: Verify
description: |
  설계 명세와 물리 소스 코드 간의 수리적 일관성을 전수 감사하고, 정적 무결성을 보증하는 하이퍼-감사 스킬.
  Data Dictionary, Spec, ERD와 실제 코드(Java/Python) 간의 1:1 매핑 무결성을 검증합니다.
---

# Integrity & Reliability Auditor (IRA): Spec Mapping Physics v4.0

## 1. Physical Mapping & Negative Audit (물격 매핑 및 네거티브 감사)

### 1.1 Data Dictionary & Shadow Field Detection
- **Naming Determinism**: [데이터 사전]에 명시된 명칭 외에 에이전트가 임의로 추가한 필드나 약어, 주석 등을 '불순물'로 간주하여 전수 적발합니다.
- **Shadow Object Detection**: DTO나 Entity 내부에 설계서에 없는 필드가 단 하나라도 존재할 경우, 정보 유출 및 아키텍처 오염으로 간주하여 REJECT 판정합니다.

### 1.2 Constraint Integrity & Over-Architecture Audit
- **Validation Calculus**: 설계서보다 과하게 설정되거나 다르게 설정된 모든 유효성 검사 로직의 '의도치 않은 사이드 이펙트'를 물리적으로 산출합니다.
- **Nullability Mismatch Trace**: DB와 코드 간의 Null 정책 불일치뿐만 아니라, 설계서에 없는 비즈니스 하드코딩(Default value 등)을 추적합니다.

## 2. Spec-Code Zero-Divergence Calculus (제로-다이버전스 대수)

### 2.1 Shadow Logic & Autonomous Modification Detection
- **Full-Spectrum Comparison**: 소스 코드의 모든 라인을 설계서의 기능 노드와 대조하여, **설계서에 없는 모든 '자율적 로직(Shadow Logic)'을 적발**합니다.
- **The "Why" Audit**: 에이전트가 "더 나은 성능"을 위해 임의로 변경한 구간(Shadow Refactoring)을 공정 위반으로 규정하고 원복 시나리오를 강제합니다.
- **Z-Logic Scanning**: 비즈니스 로직 사이에 숨겨진 조건문(`if`), 예외 처리 등이 설계서의 흐름도(Flow)와 100% 일치하는지 오토마타 검증.

### 2.2 Ghost API & Interface Audit
- **Ghost Endpoint Scanners**: 설계서(OpenAPI/Spec)에 정의되지 않은 숨겨진 API 엔드포인트나 테스트용 컨트롤러가 물리 소스에 잔존하는지 실시간 감시.

---
> [!IMPORTANT]
> **"설계는 곧 법이며, 코드는 그 현현이다."** IRA v4.0은 설계와 구현 사이의 단 1%의 불일치도 허용하지 않는 결벽적 정적 무결성을 보증합니다.
