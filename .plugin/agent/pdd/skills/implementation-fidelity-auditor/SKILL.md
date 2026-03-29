---
name: implementation-fidelity-auditor
type: Skill
phase: Publish
description: |
  디자인 시안과 구현 코드 간의 '광학적 오차 0%'를 보장하는 하이퍼-정밀 마크업 감사 엔진.
  서브-픽셀 렌더링, 색역 매핑, 애니메이션 물리 동기화를 통해 디자인 명세를 물리적으로 복원합니다.

  Tools:
  - Markup Fidelity Audit Checklist: `assets/publish_templates/markup_fidelity_audit_checklist.md`
---

# Implementation Fidelity Auditor (IFA): The Optical Restoration Engine

## 1. 광학적 구현 무결성 감사 (Optical Fidelity Audit)

퍼블리셔는 단순히 코드를 짜는 것이 아니라, 디자이너가 의도한 **'시각적 물리량'**을 브라우저 런타임에서 완벽하게 재현해야 합니다.

### 1.1 Sub-Pixel Rasterization & Typography Geometry (v2.0)
- **Pixel Grid Snap Algorithm**: 단순 안티-앨리어싱을 넘어, `rendering-intent`를 수동 제어합니다. 소수점 좌표가 발생할 경우 아래 수식을 통해 가장 가까운 물리 픽셀 그리드에 정렬(Snap)하여 번짐을 0%로 수렴시킵니다.
  ```css
  /* [Constraint] Sub-pixel rounding error protection */
  image-rendering: -webkit-optimize-contrast;
  transform: translateZ(0) scale(1.0); /* Force Compositor Layer */
  ```
- **PPI-Responsive Weight Normalization**: `font-variation-settings: 'wght' calc(var(--base-weight) * (1 / var(--device-pixel-ratio)))`와 같은 수식을 사용하여 고해상도 디스플레이에서의 폰트 대비 뭉개짐을 수학적으로 보정합니다.

### 1.2 Multi-Gamut Projection & Color Calculus (v2.0)
- **OKLCH Perceptual Gamut Mapping**: sRGB의 한계를 넘는 P3 색역을 처리하기 위해 OKLCH 모델(`oklch(L C H)`)을 사용합니다. 
  - **Mapping Rule**: `L(lightness)` 축을 고정하고 `C(chroma)` 값을 `ΔE < 0.02` 수준까지 점진적으로 감쇄시키는 알고리즘을 소스에 주입하여 색상 왜곡 없는 폴백을 보장합니다.
- **APCA Lc Calculation Engine**: 대비 검사를 단순 Pass/Fail이 아닌, 텍스트 크기와 폰트 무게에 따른 `Lc(Lightness Contrast)` 임계값을 동적으로 계산하여 적용합니다.

### 1.3 Micro-Interaction Physics & Scheduling (v2.0)
- **V-Sync Synchronized Scheduler**: 모든 애니메이션은 브라우저의 전력 주기와 동기화됩니다. 
  ```javascript
  /* [Standard] Performance-First rAF Loop */
  function frameSync(timestamp) {
    if (timestamp - lastFrame > (1000 / targetFPS - 1)) {
      updatePhysics(); // 5ms budget
      renderLayer();  // Atomic update
    }
    requestAnimationFrame(frameSync);
  }
  ```
- **Zero-Latency Compositing**: `will-change` 속성을 남발하지 않고, 오직 `transform`과 `opacity`의 조합으로만 모션을 구성하여 레일웨이(Railway) 리플로우를 원천 차단(Total Zero-Reflow)합니다.

## 2. 하이퍼-디테일 구현 감사 산출물 규격

1. **[Markup Fidelity Audit Checklist]**: 렌더링 엔진의 소수점 좌표까지 추적하는 하드웨어 레벨의 무결성 검증 시트. (v2.0)

---
> [!IMPORTANT]
> **"코드의 심미성은 수학적 무결성에서 온다."** IFA v2.0은 퍼블리셔에게 단순 마크업이 아닌, 브라우저 렌더링 엔진을 위한 '최적의 물리 시나리오'를 설계할 것을 강제합니다.
