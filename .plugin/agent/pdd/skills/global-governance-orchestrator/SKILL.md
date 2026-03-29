---
name: global-governance-orchestrator
type: Skill
phase: Verify
description: |
  전 공정(01~07)에서 에이전트들이 사용자 승인 및 거버넌스 프로콜을 완벽히 준수했는지 기계적으로 감사하고 보고하는 하이퍼-오케스트레이션 스킬.
  Gatekeeper Protocol 위반 사례와 자율적 수정 시도를 적발합니다.
---

# Global Governance Orchestrator (GGO): Compliance Physics v4.0

## 1. Timeline & Protocol Deep-Trace (타임라인 및 프로토콜 딥-트레이스)

### 1.1 Chronological Approval Splicing
- **Time-Series Consistency Check**: 에이전트가 `run_command`나 `write_to_file`을 실행한 정확한 시각과 사용자의 "진행해줘" 승인 시각을 초 단위로 대조하여, **'승인 전 실행'**이나 **'소급적 승인'**을 시도한 거버넌스 오염 기록을 적발합니다.
- **Approval Context Matching**: 승인 시의 대화 컨텍스트와 실제 실행된 코드의 변경 범위(`diff`)가 일치하는지 물리적으로 검증하여, "일단 승인받고 다른 것까지 고치는" 행위를 차단합니다.

### 1.2 Handover Chain of Custody (산출물 증적 체인)
- **Artifact Mutation Tracking**: 01단계 PM부터 07단계 Dev까지 전달되는 산출물이 에이전트 간의 이동 과정에서 사용자의 허락 없이 '미세 변개(Subtle Mutation)'가 일어났는지 해시(Hash) 단위로 전수 감사.
- **Unauthorized Handover Detection**: 공식적인 공정 단계(Step) 외에 에이전트들이 임의로 산출물을 참조하거나 공유하여 설계를 오염시킨 행적을 적발합니다.

## 2. Process Entropy & Agent Integrity (공정 엔트로피 및 정직성 감사)

### 2.1 Process Acceleration Entropy Analysis
- **Execution Speed Calculus**: 일반적인 에이전트의 사고 속도를 뛰어넘는 '비정상적 고속 생성'이나 '생략된 사고 과정(CoT Missing)'을 탐지하여, 에이전트의 불성실한 설계 또는 자율적 판단 개입 여부를 산출합니다.
- **Governance Entropy Index**: 전체 프로젝트 기간 중 미승인 행위, 소급 승인, 제약 사항 위반 건수를 수리적으로 합산하여 시스템의 신뢰 지수를 산출합니다.

### 2.2 Strict Rule Breach Forensics
- **Constraint Compliance Matrix**: 각 에이전트의 정의서(MD)에 기재된 [MANDATORY] 및 [Strict Rule] 준수 여부를 기계적으로 감사하여, "코드 효율을 위해 원칙을 저버린" 모든 사례를 REJECT 리스트에 등록합니다.

---
> [!IMPORTANT]
> **"자율성은 통제 안에서만 가치가 있다."** GGO v4.0은 에이전트 시스템이 사용자의 의도를 벗어나 자의적으로 동작하는 모든 엔트로피를 차단하고, 100% 투명한 공정 거버넌스를 보증합니다.
