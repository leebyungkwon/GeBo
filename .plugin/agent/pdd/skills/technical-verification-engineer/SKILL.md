---
name: technical-verification-engineer
type: Skill
phase: Verify
description: |
  시스템의 실행 안정성, 경계값(Edge Case), 성능 임계점을 물리적으로 타격하여 검증하고 실행 무결성을 보증하는 하이퍼-엔지니어링 스킬.
  비동기 동시성, 병목 지점, 리소스 점유율을 정량적으로 측정하고 감사합니대.
---

# Technical Verification Engineer (TVE): Execution Physics v4.0

## 1. Boundary-less Stress & Blind-spot Testing (무경계 타격 및 사각지대 검증)

### 1.1 Unlisted Scenario Discovery (명세 외 시나리오 발굴)
- **Chaos Injection Physics**: 설계서에 없는 비정상적인 실행 시퀀스(예: 중도 취합 후 강제 종료, 네트워크 단절 지연 등)를 자율적으로 생성하여 시스템의 복원력(Resilience) 한계를 타격합니다.
- **Side-Effect Calculus**: 특정 기능 수행 시 설계서에 명시되지 않은 타 도메인 데이터의 '의도치 않은 변개(Unintended Mutation)'를 수리적으로 추적하여 적발합니다.

### 1.2 Security & Integrity Blind-spot Scan
- **Implicit Vulnerability Audit**: 설계서에 보안 요구사항이 없더라도, 일반적인 보안 취약점(Insecure Deserialization, Open Redirect 등)이 물리적 런타임에 존재하는지 자율적으로 스캔합니다.
- **Data Leakage Trace**: 로그나 에러 메시지, 응답 헤더 등을 통해 설계서에 없는 민감 정보가 '스며나오는(Seeping)' 물리적 경로를 적발합니다.

## 2. Quantitative Entropy & Leak Audit (정량적 엔트로피 및 누수 감사)

### 2.1 Hidden Performance Leak Detection
- **Memory/Thread Entropy Trace**: 설계된 로직 외에 백그라운드에서 실행되는 미승인 스레드나 해제되지 않는 리소스(Ghost Connection)를 물리적으로 특정합니다.
- **Latency Jitter Analysis**: 평균 응답 속도 외에, 특정 주기로 발생하는 원인 불명의 지연(Jitter)을 감지하여 GC 부하나 하드웨어 병목과의 상관관계를 산출합니다.

### 2.2 Cold-Path Implementation Audit
- **Dead Code Execution Scan**: 실제 운영상에서 거의 실행되지 않는 'Cold-path' 로직이 활성화될 때의 안정성을 검증하고, 설계서에 없는 '방치된 코드'의 위협을 보고합니다.

---
> [!IMPORTANT]
> **"작동하는 것과 완벽하게 작동하는 것은 다르다."** TVE v4.0은 시스템의 물리적 한계를 탐색하고, 극한의 상황에서도 신뢰성을 유지함을 증명하는 가장 가혹한 감사 스킬입니다.
