# UI Motion & Interaction Guide

## 1. Motion Principles
Motion should be **Purposeful**, not decorative.
- **Informative**: 관계를 보여줌 (메뉴가 버튼에서 펼쳐짐).
- **Focused**: 시선을 유도함 (중요한 알림이 튀어오름).
- **Expressive**: 브랜드 성격을 보여줌 (부드러운 바운스 vs 딱딱한 슬라이드).

## 2. Transition Standards

### Duration (Speed)
- **Instant**: `100ms` (Hover effects, Color change)
- **Fast**: `200ms` (Dropdown open, Toggle switch)
- **Normal**: `300ms` (Modal open, Page transition)
- **Slow**: `500ms+` (Complex layout changes)

### Easing (Curve)
- **Ease-Out** (`cubic-bezier(0, 0, 0.2, 1)`): 들어올 때 사용 (빠르게 시작 -> 천천히 정지). 대부분의 UI 진입 애니메이션.
- **Ease-In** (`cubic-bezier(0.4, 0, 1, 1)`): 나갈 때 사용 (천천히 시작 -> 빠르게 가속). 화면에서 사라지는 요소.

## 3. Micro-Interaction Examples

### Button Click (Feedback)
- **State**: `Active` (Press)
- **Action**: Scale down to `95%`
- **Duration**: `100ms`

### Skeleton Loading (Progress)
- **Effect**: Shimmer (Left to Right gradient pulse)
- **Loop**: Infinite
- **Duration**: `1.5s`

### Toast Message (Notification)
- **Enter**: Slide Up + Fade In (`300ms ease-out`)
- **Hold**: Visible for `3000ms`
- **Exit**: Fade Out (`200ms ease-in`)

## 4. Developer Handoff Checklist
- [ ] 애니메이션의 **Duration**과 **Easing Function**을 명시했는가?
- [ ] **Trigger** (무엇을 했을 때 시작되는가)가 명확한가?
- [ ] 성능에 영향을 주는 속성(`width`, `top` 등) 대신 GPU 가속 속성(`transform`, `opacity`)을 사용했는가?
