# [MASTER] Micro-Interaction & Motion Physics Spec
## Subject: [Hyper-Detailed Component/Transition Protocol]

### 1. 물리적 모션 알고리즘 (Motion Physics Algorithms)
인터랙션은 감각적인 '움직임'이 아니라 **'물리학적 수식'** 기반의 데이터여야 합니다.

| 동작 유형 (Action Type) | Easing (Cubic-Bezier / Spring) | Duration | Offset (Delta) | Kinetic Intent (의도) |
| :--- | :--- | :---: | :---: | :--- |
| **Material Entry** | `cubic-bezier(0, 0.7, 0.3, 1)` | 350ms | 30px (Y-up) | 중력 가속도를 이기는 탄력적 등장 |
| **Subtle State Change** | `cubic-bezier(0.4, 0, 0.2, 1)` | 180ms | Scale 1.02 | 인지적 저항 없는 매끄러운 상태 전환 |
| **Urgent Error Shake** | `spring(1, 100, 10, 0)` | 450ms | 8px (X-axis) | 물리적 경고 및 즉각적 인지 유도 |
| **Infinite Progress** | `linear` | 2.0s/rev | Rotate 360 | 작업 연속성에 대한 무한 신뢰성 부여 |
| **Layer Modal Surface** | `cubic-bezier(0.2, 1.2, 0.4, 1)` | 400ms | Scale 0.9->1 | 공간적 팽창감을 통한 최상위 집중 유도 |

### 2. 레이어 계층 및 심도 거버넌스 (Physical Elevation Engineering)
사용자의 뇌가 정보의 중첩 관계를 '물리적 심도'로 인지하도록 설계합니다.

- **Baseline Surface (0dp)**: 시스템 배경. (Hex: 시스템 기본배경 토큰)
- **Content Card (2dp)**: 기본 상호작용 영역. (Shadow: `0 2px 4px rgba(0,0,0,0.12)`)
- **Nav/Sticky Header (8dp)**: 고정된 조작 지점. (Shadow: `0 4px 8px rgba(0,0,0,0.18)`)
- **Floating System (16dp)**: 일시적 조작 요소(Popovers). (Shadow: `0 8px 16px rgba(0,0,0,0.24)`)
- **Modal/Alert (24dp)**: 최상단 차단 요소. (Shadow: `0 12px 24px rgba(0,0,0,0.32)` + Overlay: `rgba(0,0,0,0.5)`)

### 3. 오케스트레이션 및 시퀀싱 (Sequence & Rhythm)
요소 간의 율동감(Rhythm)을 밀리초 단위로 제어합니다.

- **Staggering Gap**: 리스트 아이템 순차 노출 간격은 정확히 **40ms**로 고정하여 시선 흐름을 부드럽게 유도합니다.
- **Chaining Factor**: 이전 애니메이션이 80% 진행되었을 때 다음 애니메이션이 트리거되도록 중첩(Overlap) 설계를 수행합니다.
- **Interruption Policy**: 애니메이션 중 사용자 인터럽트 발생 시, 현재 위치에서 즉시 새로운 벡터로 이동하는 **'벨로시티 계승(Velocity Inheritance)'** 정책을 적용합니다.

---
> [!IMPORTANT]
> 본 명세는 단순한 수치를 넘어, 개발자가 별도의 디자인 질문 없이 '완벽한 햅틱 감각'을 코드로 구현하도록 가이드하는 **'물리적 설계도'**입니다.
