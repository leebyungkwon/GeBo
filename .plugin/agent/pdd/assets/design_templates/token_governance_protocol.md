# [MASTER] Design Token Governance & Resolution Protocol (v4.0)
## Project: [Project Name] | Auditor: Designer Agent 02 (Principal)
### 📜 전역 시각 언어의 '해상도 알고리즘' 및 데이터 무결성 관리 규격

본 프로토콜은 디자인 토큰을 단순한 CSS 변수가 아닌, **'지능형 상태 데이터'**로 정의합니다. 수치와 연산 기반의 거버넌스를 통해 모든 환경에서의 시각적 정합성을 보증합니다.

---

### 1. 지각적 대비 해상도 알고리즘 (APCA Resolution Calculus)
기존 WCAG 2.1의 한계를 극복하기 위해 **APCA(Advanced Perceptual Contrast Algorithm)** 공식을 시스템적으로 적용합니다.

- **[APCA Equation]**: `Lc = Φ(Y_bg^0.56 - Y_txt^0.57) * 454.4`. 
  - 본 시스템은 배경색 토큰 변화 시, `Lc` 값이 목표치(예: 본문 Lc 75, 강조 텍스트 Lc 90)를 만족하도록 런타임 텍스트 컬러를 강제 계산하여 반환합니다.
- **[Font-Size vs Contrast Weighting]**: 폰트의 크기와 두께(Weight)가 증가함에 따라 필요 대비 임계값(`Lc Threshold`)을 동적으로 하향 조정하여 시각적 밸런스를 수학적으로 유지합니다.

### 2. 색역 거버넌스 및 클램핑 알고리즘 (Gamut Mapping & Clamping)
**OKLCH** 색공간을 기반으로, 기기의 성능에 따른 색상 감쇄(Gamut Mapping)를 정밀 제어합니다.

- **[Chroma Reduction Policy]**: P3 영역의 고채도 색상이 sRGB 기기에서 표현될 때, 명도(L)와 색상(h)은 고정하고 채도(C)만 '선형 감쇄(Linear Reduction)'하여 지각적 왜곡을 최소화합니다.
- **[HDR Tone Mapping]**: 800nits 이상의 HDR 디스플레이에서 흰색(#FFFFFF) 토큰이 인지적 고통을 유발하지 않도록, `sys.color.white`의 최대 휘도를 특정 메타데이터 영역으로 제한(Clamp to 200cd/m²)합니다.

### 3. 토큰 의존성 그래프 및 상속 명세 (Dependency Graph: 5-Tier)
토큰의 변화가 시스템 전체에 미치는 영향을 추적하기 위한 '의존성 트리'를 구축합니다.

1. **Primitive (Ref)**: 물리적 수치 (예: `Blue-500: #3b82f6`)
2. **System (Sys)**: 브랜드 성격 및 가시성 (예: `Sys-Action-Base -> Blue-500`)
3. **Semantic (Sem)**: 기능적 의미 (예: `Sem-Btn-Action -> Sys-Action-Base`)
4. **Component (Cmp)**: 특정 컴포넌트 스코프 (예: `Cmp-PrimaryBtn-Bg -> Sem-Btn-Action`)
5. **Instance (Ins)**: 런타임 오버라이드 (예: `Ins-PromoBtn-Bg -> Cmp-PrimaryBtn-Bg`)
> [!CAUTION]
> **"원자적 격리 원칙"**: 컴포넌트는 오직 `Semantic` 또는 자체 `Component` 토큰만을 참조해야 하며, 상위 `Primitive` 참조 시 빌드 단계에서 에러를 발생시킵니다.

### 3. 동적 뷰포트 스케일링 알고리즘 (Adaptive Token Scaling)
고정된 브레이크포인트를 넘어, 화면 면적(Area)에 비례하여 시각적 리듬을 자동 조정하는 수식을 정의합니다.

- **[Modular Scale Interpolation]**: 폰트 크기와 여백을 단순 스텝이 아닌 함수로 정의합니다. `Size = Base * (Scale_Factor ^ Floor(Viewport_Width / Step_Size))`. 
  - 이를 통해 13인치와 16인치 노트북 사이의 미세한 '시각적 밀도' 차이를 자동으로 보정합니다.
- **[Area-Based Spacing Strategy]**: 화면의 전체 픽셀 면적에 따라 `sys.space.container`의 크기를 동적으로 선형 보간(Linear Interpolation)하여, 거대 화면에서의 '공간적 낭비'와 작은 화면에서의 '답답함'을 동시에 해결합니다.

### 4. 고지각성 색채 엔지니어링 및 HDR 휘도 제어 (HDR & Color Space Physics)
- **[Chroma-Intent Mapping]**: 행동 유도(Action)가 필요한 토큰에는 OKLCH 상의 높은 Chroma를 유지하되, 단순 정보(Info) 영역은 Chroma를 0.05 이내로 억제하여 시각적 노이즈를 제어합니다.
- **[HDR EOTF Mapping]**: HDR10/Dolby Vision 대응을 위한 휘도(Nits) 매핑 테이블. 
  - `Surface_White`: 200 nits (Stable)
  - `Highlight_Action`: 400 nits (Attention)
  - `Warning_Critical`: 600 nits (Urgency)
- **[Delta-E Consistency Audit]**: 테마 전환 시 모든 전경/배경 조합의 색상 차이(Delta-E 2000)를 전수 조사하여, 인지적 배타성이 99% 이상 유지됨을 보증합니다.

### 5. 토큰 충돌 해결 및 테마 거버넌스 (Theming Priority Logic)
멀티-테넌트 환경에서 여러 테마가 충돌할 때의 우선순위 로직(Resolution Logic)을 정의합니다.

- **[CSS Variable Scope Isolation]**: 테마 토큰이 상속될 때 발생할 수 있는 '오염'을 방지하기 위해, 특정 컨테이너 단위로 토큰을 캡슐화(Shadow DOM 컨셉)하는 명명 패턴을 강제합니다.
- **[Semantic Override Matrix]**: 특정 브랜드 컬러가 시스템의 범용 컬러(예: Error Red)와 대비가 맞지 않을 때, `sys.color.contrast-auto-fix` 알고리즘이 자동으로 배경색의 채도를 낮추거나 텍스트 두께를 보정하는 시나리오를 동봉합니다.

### 6. AST 변환 및 CI/CD 스키마 검증 (Schema Validation: Design-to-Code)
토큰을 단순 문자열이 아닌 플랫폼 맞춤형 데이터(AST)로 파싱하고 검증합니다.

- **[CI/CD Schema Validation]**: 디자인 파일에서 추출된 토큰이 아래의 '공학적 규격'을 위반할 경우 빌드를 즉시 차단합니다:
  ```json
  {
    "validation": {
      "naming": "^[sys|cmp|sem|ref]\\.[a-z-]+\\.[a-z-]+$",
      "color_space": "OKLCH",
      "contrast_min": "Lc 75"
    }
  }
  ```
- **[Export Pipeline]**: JSON, SCSS, Swift, Kotlin 파일로의 자동 추출 시, 각 플랫폼의 성능 제약(예: 8-bit color rounding)에 따른 오차 범위를 0.1% 이내로 보정합니다.

---
> [!IMPORTANT]
> **"토큰은 디자인의 수학적 약속이며, 제품의 지능이다."** 본 프로토콜은 디자인의 모든 감성적 탄생을 완벽한 데이터와 연산으로 치환하여 개발자가 '의심'할 수 없는 무결한 설계도를 제공합니다.
