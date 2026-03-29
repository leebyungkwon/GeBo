---
name: functional-visual-walkthrough
type: Skill
phase: Verify
description: |
  개발 완료된 결과물이 사용자의 비즈니스 요구사항과 디자인 시안에 100% 일치함을 실제 구동 화면과 증적(Evidence)으로 증명하는 하이퍼-워크스루 스킬.
  Business Path Validation, Visual Fidelity Proof, Snapshot Evidence 등을 제공합니다.
---

# Functional & Visual Walkthrough (FVW): Evidence Physics v5.0

## 1. Business Scenario Cross-Check (비즈니스 시나리오 교차 검증)

### 1.1 Happy-Path Verification Physics
- **Scenario Fidelity Calculus**: [PRD(01)] 및 [Service Flow(04)]에서 정의된 핵심 비즈니스 흐름을 실제 구동 환경에서 재현하고, 모든 데이터의 상태 전이(State Transition)가 수리적으로 정확한지 검증합니다.
- **Goal Completion Proof**: 사용자가 달성하고자 했던 최종 비즈니스 목적(예: 결제 완료, 가입 성공)이 물리적 DB에 정상 반영되었음을 쿼리 결과로 증명합니다.

### 1.2 Edge-Case Operational Logic
- **Negative Path Walkthrough**: 유효하지 않은 입력이나 중도 취소 상황에서 시스템이 사용자에게 적절한 피드백(Toast, Alert)을 제공하고, 데이터의 정체성(Identity)을 유지하는지 실제 구동으로 확인.

## 2. Visual & Interaction Fidelity Proof (시각적 및 인터랙션 무결성 증명)

### 2.1 UI/UX Determinism Audit
- **Design Mapping Physics**: [디자인 시안(02)] 및 [퍼블리싱 마크업(03)]과 실제 구현된 컴포넌트의 레이아웃, 컬러, 폰트, 간격(Spacing)이 시각적으로 일치함을 스크린샷 비교로 증명합니다.
- **Interaction Momentum Check**: 버튼 클릭, 모달 오픈, 페이지 전환 등의 애니메이션과 인터랙션이 설계된 '감각(Sensory)'과 일치하는지 물리적으로 검증.

### 2.2 Device & Environment Robustness
- **Environment Parity Trace**: 다양한 해상도(Responsive) 및 브라우저 환경에서 레이아웃 깨짐 없이 비즈니스 로직이 일관되게 수행됨을 증적(Evidence)으로 남깁니다.

---
> [!IMPORTANT]
> **"보지 못한 것은 믿을 수 없고, 증명되지 않은 것은 완료된 것이 아니다."** FVW v5.0은 기술적 감사를 넘어, 사용자에게 **'작동하는 실제'**를 증거로 제시하여 최종 반영의 신뢰를 확보하는 마지막 관문입니다.
