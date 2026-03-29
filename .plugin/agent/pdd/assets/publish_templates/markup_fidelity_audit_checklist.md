# [MASTER] Markup Fidelity Audit Checklist (v1.0)
## Project: [Project Name] | Auditor: Publisher Agent 03 (Principal)
### 🔍 디자인 명세의 광학적 복원을 위한 하이퍼-정밀 무결성 체크리스트

본 문서는 구현된 결과물이 디자인 시안의 모든 물리적/시각적 수치를 100% 반영했음을 증명합니다. **'Pixel Perfect'**를 넘어 **'Physics Perfect'**를 지향합니다.

### 1. 레이아웃 및 렌더링 기하학 (Layout & Geometry Math)
| 항목 (Metric) | 엔지니어링 검증 및 연산 수식 (Verification & Math) | 허용 오차 (Tolerance) |
| :--- | :--- | :--- |
| **Pixel Snap Match** | `floor(rect.left * dpr) / dpr`을 통한 실제 렌더링 픽셀 정렬 위치 확인 | ±0.01px |
| **Grid Determinism** | 부모 너비 `W`에 따른 컬럼 너비 `C = (W - (N-1)G) / N`의 소수점 처리 무결성 | 0px Error |
| **Box-Model Physics** | `box-sizing: border-box` 적용 후 `content-box` 실측 사이즈와 시안의 오차 | ±0.1px |
| **Raster-to-Vector** | SVG 노드의 `path` 데이터가 캔버스 좌표계에서 앨리어싱 없이 렌더링되는가? | Anti-Aliased |

### 2. 색채 공학 및 지각적 보정 (Color Science & Calibration)
- **[Delta-E ΔE_ab Analysis]**: 시안의 `#HEX`와 브라우저 추출 색상 간의 지각적 색차(`ΔE`) 측정.
  - **Goal**: `ΔE < 1.0` (인간의 눈으로 구별 불가능한 수준) 달성 여부.
- **[Gamut Projection Integrity]**: `oklch` 기반의 색상 변환 시 `L`값(Lightness)의 보존율이 99% 이상인가?
- **[Luminance Contrast (APCA)]**: 폰트 크기별 최소 필요 `Lc`값 (예: 16px/400w -> `Lc 75`) 준수 여부 실측.

### 3. 모션 물리 및 하드웨어 가속 (Motion Physics & HW Acceleration)
- **[Layer Tree Topology Audit]**: 
  - `chrome://inspect/#devices`를 통한 Layer Tree 분석. 
  - 불필요한 `Paint`를 유발하는 `Scroll-Parent`와의 컨텍스트 분리 여부 확인.
- **[Bézier Curvature Symmetry]**: 
  - `cubic-bezier(x1, y1, x2, y2)` 곡률의 변곡점(Inflection Point)이 디자인 가이드와 수학적으로 일치하는가?
- **[Jank-Free Assurance]**: 
  - 인터랙션 중 `Main Thread` 차단 시간이 `5ms` 이하로 유지되며, `Dropped Frames`가 0개인가?

### 4. 환경 대응 및 시공간 무결성 (Temporal Consistency)
- **[Device Pixel Ratio Compensate]**: 1x, 2x, 3x 디스플레이별 각기 다른 `Border-width` 외곽선 렌더링 오류(Hairline issue) 보정 여부.
- **[Thermal Guard]**: 모바일 환경에서 과도한 필터 효과로 인한 GPU 발열 및 스로틀링 발생 가능성 사전 체크.

---
> [!NOTE]
> IFA v2.0은 마크업을 단순한 웹 페이지가 아닌, 인간의 시각 시스템과 브라우저 하드웨어가 만나는 **'초정밀 광학 장치'**로 취급합니다.
