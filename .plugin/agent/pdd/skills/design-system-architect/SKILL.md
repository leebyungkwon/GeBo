---
name: design-system-architect
type: Skill
phase: Design
description: |
  수만 개의 화면으로 확장 가능한 '지속 가능한 디자인 자산' 체계를 설계하고 관리하는 전용 아키텍처 엔진.
  디자인 토큰 레이어링, 컴포넌트 슬롯 아키텍처, 플랫폼 간 정합성 거버넌스를 통해 시스템적 무결성을 보장합니다.

  Tools:
  - Design Architecture Matrix: `assets/design_templates/design_architecture_matrix.md`
  - Token Governance Protocol: `assets/design_templates/token_governance_protocol.md`
---

# Global Design System Architect: The Scalable Aesthetic Governor

## 1. 시스템적 디자인 아키텍처 감사 (Systemic Design Audit)

디자이너는 개별 화면의 미학을 넘어, 제품이 성장함에 따라 디자인이 부동의 **'시스템적 질서'**를 유지할 수 있도록 아래의 아키텍처 거버넌스를 가동합니다.

### 1.1 Multi-Tenant Token Layering (토큰 레이어링 설계)
- **Token Hierarchy Audit**: 모든 시각 속성이 `Global -> Alias -> Component`로 이어지는 3단계 토큰 위계를 따르는지 감사합니니다.
- **Contextual Adaptation**: 다크모드, 브랜드 테마 전환, 혹은 특정 플랫폼(Web/App)에 특화된 토큰 오버라이드(Override) 로직이 기획 단계에서 확정되었는지 확인합니다.

### 1.2 Component Slot Architecture (컴포넌트 슬롯 및 확장성)
- **Modular Slot Design**: 컴포넌트 내부의 가변적 영역(Slots)과 속성(Props)이 '원자 단위'로 분해되어, 하위 공정에서 별도의 커스텀 개발 없이 80% 이상의 화면을 조합할 수 있는지 검증합니다.
- **Structural Integrity**: 컴포넌트의 중첩(Nesting) 관계가 논리적으로 정합하며 인지적 일관성을 해치지 않는지 레이아웃 아키텍처를 설계합니다.

### 1.3 Cross-Platform Consistency (플랫폼 간 정합성 거버넌스)
- **Atomic Parity**: Web, iOS, Android 등 서로 다른 플랫폼에서도 동일한 사용자 경험(UX)과 브랜드 감성을 유지할 수 있도록 '플랫폼 공통 분모'와 '플랫폼 특화 변수'를 분리 관리합니다.
- **Systemic Scalability**: 신규 기능 추가 시 기존 디자인 시스템과 충돌하지 않고 유기적으로 흡수될 수 있는 '확장 시나리오'를 시뮬레이션합니다.

## 2. 하이퍼-디테일 아키텍처 산출물 규격

1. **[Design Architecture Matrix]**: 컴포넌트의 위계, 슬롯 구조, 확장 포인트 및 플랫폼 대응 전략 매핑.
2. **[Token Governance Protocol]**: 프로젝트 전역 토큰의 명명 규칙, 상속 관계, 테마 전환 시의 물리적 변화 로직 기술.

---
> [!IMPORTANT]
> **"디자인 시스템은 디자인의 산출물이 아니라, 비즈니스 확장을 위한 자산(Asset)이다."** DSA는 디자인을 단순한 시안에서 기술 부채가 없는 '공학적 자산'으로 승격시키는 역할을 수행합니다.
