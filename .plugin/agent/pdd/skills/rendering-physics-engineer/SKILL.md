---
name: rendering-physics-engineer
type: Skill
phase: Publish
description: |
  브라우저 렌더링 파이프라인(Reflow/Repaint/Composite)을 물리적으로 제어하고 최적화하는 하이퍼-퍼포먼스 엔지니어링 스킬.
  GPU 가속 레이어 설계 및 CSS 런타임 성능 예산을 관리합니다.

  Tools:
  - Rendering Performance Spec: `assets/publish_templates/rendering_performance_spec.md`
---

# Rendering Physics Engineer (RPE): The Performance Calculus

## 1. 렌더링 파이프라인 물리 제어 (Pipeline Physics Control)

RPE는 마크업을 단순한 구조가 아닌, 브라우저가 최소한의 에너지로 최대한 빠르게 처리할 수 있는 **'연산 최적화 상태'**로 전환하는 스킬입니다.

### 1.1 CSS Containment & Layout Isolation (레이아웃 격리)
- **Containment Strategy**: 특정 컴포넌트의 변화가 전체 페이지의 리플로우를 트리거하지 않도록 `contain: layout size style;`을 전략적으로 주입합니다.
- **Boundary Math**: DOM 트리 깊이에 따른 레이아웃 연산 비용($O(N)$)을 상수로 제어하기 위해 렌더링 경계(Rendering Boundaries)를 물리적으로 분리합니다.

### 1.2 GPU Layer Topology & Composite Optimization (GPU 가속 공학)
- **Layer Promotion Governance**: `will-change: transform;`을 오남용하지 않고, GPU 메모리(VRAM) 소비량과 합성(Compositing) 오버헤드를 계산하여 불필요한 레이어 분리를 억제합니다.
- **Hardware-Accelerated Properties**: 오직 GPU가 처리할 수 있는 4가지 속성(`Transform`, `Opacity`, `Filter`, `Clip-path`)만을 활용한 'Zero-CPU Paint' 모션을 강제합니다.

### 1.3 Performance Budget & Runtime Calculus (성능 예산 및 연산)
- **CSS Variable Engine**: 런타임에 CSS 변수를 수정할 때 발생하는 'Style Recalculation' 비용을 최소화하기 위해 컴포넌트 스코프를 제한하고 전역 전파를 차단합니다.
- **Critical Rendering Path (CRP)**: FCP(First Contentful Paint)를 0.8s 이내로 단축하기 위해 초기 뷰포트 내의 CSS를 `Inline-Critical CSS`로 자동 분리하는 전략을 수행합니다.

## 2. 하이퍼-디테일 성능 산출물 규격

1. **[Rendering Performance Spec]**: 컴포넌트별 렌더링 비용 실측 수치와 GPU 레이어 설계도가 포함된 고성능 퍼블리싱 명세서. (v2.0)

---
> [!IMPORTANT]
> **"0.1ms의 프레임 드랍은 사용자 인지 흐름의 단절이다."** RPE v2.0은 브라우저 하드웨어를 한계까지 활용하는 고효율 비주얼 엔진을 설계하는 것을 목표로 합니다.
