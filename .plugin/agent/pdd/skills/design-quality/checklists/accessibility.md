# Accessibility (A11y) Design Checklist

## 1. Color & Contrast (WCAG AA)
- [ ] **Text Contrast**: 일반 텍스트는 배경과 **4.5:1** 이상의 명도 대비를 가지는가? (Large Text는 3:1)
- [ ] **Color Independence**: 색상으로만 정보를 전달하지 않는가? (예: 에러 메시지는 빨간색 + 아이콘/텍스트로 구분)

## 2. Typography & Readability
- [ ] **Line Height**: 줄 간격(Line-height)이 글자 크기의 **1.5배** 이상인가?
- [ ] **Font Size**: 본문 폰트 크기가 최소 **16px** 이상인가? (모바일 기준)

## 3. Interaction Targets
- [ ] **Touch Target**: 모든 버튼과 터치 요소는 최소 **44x44px** (iOS) 또는 **48x48dp** (Android) 이상인가?
- [ ] **Focus State**: 키보드 탭(Tab) 이동 시 포커스 링이 명확하게 보이는가?

## 4. Forms & Feedback
- [ ] **Labels**: 모든 입력 필드(Input)에 명확한 라벨(Label)이 있는가? (Placeholder는 라벨이 아님)
- [ ] **Error Message**: 에러 발생 시 사용자가 무엇을 고쳐야 하는지 명확히 텍스트로 안내하는가?
