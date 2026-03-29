# Edge Case Discovery Checklist

## 1. Input & Data Validation
- [ ] **Empty State**: 데이터가 0개일 때 화면이 깨지지 않고 안내 문구가 뜨는가?
- [ ] **Max Limit**: 입력 가능한 최대 글자 수나 최대 아이템 개수 제한이 있는가?
- [ ] **Special Characters**: 이모지(😀)나 특수문자 입력 시 시스템이 처리 가능한가?
- [ ] **Whitspace**: 앞뒤 공백만 있는 입력(Space)을 "내용 없음"으로 처리하는가?

## 2. System & Network
- [ ] **Offline**: 인터넷 연결이 끊겼을 때 앱이 멈추지 않고 적절히 반응하는가?
- [ ] **Latency**: 저장/로딩 중일 때 로딩 인디케이터(Spinner)가 뜨는가?
- [ ] **Crash Recovery**: 앱이 강제 종료된 후 재실행하면 작성 중이던 데이터가 남아있는가?

## 3. UX & Interaction
- [ ] **Double Click**: 버튼을 빠르게 두 번 누르면 중복 요청이 가는가? (Debounce 처리 여부)
- [ ] **Back Button**: 뒤로 가기를 눌렀을 때, 저장되지 않은 데이터에 대해 경고하는가?
- [ ] **Refresh**: 새로고침(F5) 시 현재 상태(필터, 스크롤 위치)가 유지되는가?

## 4. Security & Privacy
- [ ] **Sensitive Data**: 비밀번호가 마스킹(****) 처리되는가?
- [ ] **Session Timeout**: 오랫동안 활동이 없으면 자동 로그아웃 되는가?
