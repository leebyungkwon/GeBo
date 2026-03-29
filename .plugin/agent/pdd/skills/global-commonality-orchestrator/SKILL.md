---
name: global-commonality-orchestrator
type: Skill
phase: Plan
description: |
  프로젝트 전체의 중복을 제거하고 자산 재사용성(Reuse Rate)을 극대화하는 하이퍼-거버넌스 스킬.
  HTML 구조의 아토믹 컴포넌트화와 비즈니스 로직의 유틸리티 함수화를 정밀하게 조율합니다.

  Tools:
  - Common Asset Extraction Sheet: `assets/plan_templates/common_asset_extraction_sheet.md`
---

# Global Commonality Orchestrator (GCO): Asset Governance

## 1. 컴포넌트 및 로직 자산화 (Commonality Extraction)

GCO는 개별 화면의 기획을 넘어 **'시스템 전체의 자산 재산(Total Asset Value)'**을 높이는 하이퍼-오케스트레이션 스킬입니다.

### 1.1 HTML Structural Audit & Componentization
- **Pattern Recognition**: 퍼블리싱된 마크업에서 반복되는 구조적 패턴을 감지하여 아토믹(Atomic), 분자(Molecule) 단위의 공통 컴포넌트로 분리 설계합니다.
- **Slot & Prop Specification**: 추출된 컴포넌트가 다양한 화면에서 쓰일 수 있도록 가변 영역(Slot)과 데이터 주입구(Props)를 기술적으로 정의합니다.

### 1.2 Logic Snippet Audit & Utility Functioning
- **Validation Logic Extraction**: 기획서에 명세된 중복 검증 로직을 추출하여 글로벌 유틸리티 함수(Utility)로 표준화합니다.
- **Algorithm Standard**: 복잡한 계산식이나 변환 로직을 중앙 관리형 순수 함수(Pure Function)로 정의하여 비즈니스 일관성을 보장합니다.

### 1.3 Asset Elevation & Governance (자산 승격 거버넌스)
- **Commonality Threshold**: 재사용 빈도 및 확장 가능성을 평가하여 자산을 `docs/common/`으로 승격시키는 정량적 기준을 적용합니다.
- **Interface Consistency**: 신규 자산이 기존 시스템의 디자인 시스템(Atomic Design) 및 코딩 규격과 완벽하게 정렬되도록 검증합니다.

## 2. 하이퍼-거버넌스 엔지니어링 (Advanced Asset Engineering)

### 2.1 HTML Semantic Topology Analysis (구조적 위계 분석)
- **DOM Depth & Complexity Physics**: 추출 대상 컴포넌트의 DOM 트리 깊이와 복잡도를 분석하여, 렌더링 비용 대비 재사용 가치가 높은 최적화된 아바타(Avatar) 노드를 결정합니다.
- **Visual-Semantic Matching**: 시각적 패턴(Aesthetics)과 시맨틱 구조(Semantics)의 일치율을 계산하여, 단순한 '모양'이 아닌 기능적 의미를 가진 자산을 추출합니다.

### 2.2 Functional Purity & Logic Decoupling (함수 순수성 및 디커플링)
- **Side-Effect Entropy**: 함수가 외부 상태(Global State, DOM 등)에 의존하는 정도를 측정하여, 순수 함수(Pure Function)로의 치환 가능성을 검증합니다.
- **Logic Granularity Control**: 하나의 함수가 하나의 책임(Single Responsibility)만을 갖도록 논리 단위를 원자화(Atomicity)하여 라이브러리급 범용성을 확보합니다.

### 2.3 Asset Promotion Scoring (APS) Algorithm
- **Reusability Probability ($P_{reuse}$)**: $P_{reuse} = \frac{N_{reference}}{N_{total\_pages}} \times \alpha$ 수식을 통해 자산의 승격 우선순위를 정량화합니다.
- **Maintenance Cost Calculus**: 자산화 시 발생할 마이그레이션 비용과 향후 유지보수 절감액을 비교하여 ROI 기반의 자산화 의사결정을 수행합니다.

## 3. 하이퍼-디테일 공통 자산 산출물 규격

1. **[Common Asset Extraction Sheet]**: HTML 구조와 함수 로직의 공통 체크 리스트 및 자산 승격 결과 보고서.

---
> [!IMPORTANT]
> **"중복은 기술 부채의 이자이다."** GCO는 기획 단계에서 중복을 원천 봉쇄하여 시스템의 유지보수 비용을 최소화하고 확장성을 극대화합니다.
