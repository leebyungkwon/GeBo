---
name: cross-platform-fidelity-auditor
type: Skill
phase: Develop
description: |
  브라우저 엔진(Blink, WebKit, Gecko)별 레이아웃 물리 차이와 자바스크립트 런타임 이질성을 해결하고,
  실제 구현체가 디자인 시안 및 퍼블리싱 마크업과 100% 일치하도록 감사하는 하이퍼-엔지니어링 스킬.

  Tools:
  - Cross-Platform Fidelity Report: `assets/develop_templates/cross_platform_fidelity_report.md`
---

# Cross-Platform Fidelity Auditor (CPFA): Environmental Consistency

## 1. 저수준 렌더링 엔진 물리 감사 (Low-Level Engine Disparity Audit)

CPFA는 표면적인 마크업 해석을 넘어, 브라우저 엔진의 커널 수준 렌더링 물리 이질성을 해결합니다.

### 1.1 Rendering Artifacts & Antialiasing Physics
- **Sub-pixel Antialiasing Alignment**: Blink(Chrome)와 WebKit(Safari)의 글꼴 렌더링 알고리즘(LCD vs Grayscale antialiasing) 차이를 분석하고, CSS `font-smooth` 및 자산 보정을 통해 모든 환경에서 동일한 시각적 무게(Visual Weight)를 구현합니다.
- **Color Space & ICC Profile Mapping**: sRGB, Display P3 등 브라우저와 OS OS OS OS가 지원하는 색역(Color Space) 물리 현상을 추적하여, 고사양 디스플레이에서도 색상 왜곡 없는 프리미엄 피델리티를 유지합니다.

### 1.2 Constraint-based Layout Topology
- **Box-Model Precision Engineering**: 1px 미만의 서브픽셀 연산 방식이 엔진별(Blink vs Gecko)로 상이함에 따라 발생하는 누적 레이아웃 오차를 수리적으로 계산하여 보정합니다.
- **Hardware-Accelerated Layer Physics**: 브라우저가 생성하는 그래픽 레이어(Composited Layers)의 개수와 메모리 점유 방식을 감사하여, 특정 엔진에서만 발생하는 레이어 겹침 및 깜빡임 현상을 원천 차단합니다.

## 2. 네트워크 프로토콜 및 환경 물리 (Environmental & Network Physics)

실행 환경의 네트워크 전송 물리 특성이 비즈니스 로직의 반응성에 미치는 영향을 제어합니다.

### 2.1 Transport Layer Heterogeneity (QUIC vs TCP)
- **Congestion Control Physics**: OS의 TCP 스택과 브라우저의 HTTP/3(QUIC) 엔진 간의 혼잡 제어(Congestion Control) 차이를 분석하고, 초기 윈도우 크기(initcwd) 조절 등을 통해 전 세계 어디서나 일관된 데이터 전송 물리 속도를 보장합니다.
- **TLS Handshake Latency Normalization**: 실행 환경별 TLS 핸드쉐이크 지연 시간을 측정하고, 0-RTT/1-RTT 최적화를 통해 보안 프로토콜 물리 오버헤드를 최소화합니다.

### 2.2 Hardware Sync & Motion Physics
- **Variable Refresh Rate (VRR) Synchronization**: 60Hz, 120Hz(ProMotion) 등 장치 주사율에 따른 애니메이션 프레임 보간(Interpolation) 물리 로직을 정교화하여, 어떤 화면에서도 잔상 없는 부드러운 움직임을 강제합니다.
- **Display Latency (Input-to-Photon) Calibration**: 사용자 입력부터 실제 픽셀 변화(Photon)까지의 물리적 지연 시간을 브라우저 이벤트 루프 레벨에서 추적하고 보정합니다.

## 3. 초정밀 구현 피델리티 감사 (Extreme Fidelity Engine)

순수 비즈니스 로직이 모든 실행 환경에서 동일한 입출력 인과관계를 가짐을 보장합니다.

### 2.1 JS Engine Compatibility Physics
- **ECMAScript Feature Mapping**: V8, JSCore, Spidermonkey 엔진 간의 최신 문법(Optional Chaining, Nullish Coalescing 등) 지원 범위를 매핑하고, 필요시 물리적 폴리필(Polyfill)을 주입합니다.
- **Temporal & Intl API Consistency**: 서버와 클라이언트, 그리고 브라우저 간의 시간대(Timezone) 및 로케일(Locale) 처리 물리 로직이 단 1초의 오차도 없이 일치하도록 정규화합니다.

### 2.2 Event Loop & Input Physics
- **Pointer/Touch Event Unification**: 마우스 클릭과 터치 인터랙션의 물리적 특성(버블링 시간차, 압력 감지 등)을 통합하여 크로스 플랫폼 환경에서 동일한 사용자 반응 속도를 보장합니다.
- **Passive Listener Optimization**: 스크롤 및 터치 이벤트 핸들러의 성능 최적화를 위해 브라우저 엔진에 힌트를 제공하는 패시브 리스너(Passive Listeners) 전략을 전수 적용합니다.

## 3. 초정밀 구현 피델리티 감사 (Extreme Fidelity Engine)

### 3.1 SSIM-based Visual Regression
- **Structural Similarity (SSIM) Indexing**: 단순 픽셀 비교를 넘어 이미지의 구조적 유사도(SSIM) 알고리즘을 사용하여 기획안(Designer Artifact)과 실제 구현체의 시각적 상관계수를 데이터로 증명합니다.
- **Sub-atomic Layout Audit**: DOM 트리의 시맨틱 위계와 위상(Topology)이 컴포넌트화 과정에서 훼손되지 않았음을 수학적으로 감사하여 구조적 무결성을 증명합니다.

---
> [!IMPORTANT]
> **"환경의 파편화는 하이퍼-엔지니어링으로 정복된다."** CPFA v2.0은 브라우저 커널과 네트워크 스택의 보이지 않는 물리까지 제어하여, 지리적/기술적 환경에 상관없는 '절대적 구현 피델리티'를 구현합니다.
