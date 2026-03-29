# Zero-Defect Handoff Manager: The Decisive Governance Engine [GATE 2]

## 1. 무결성 거버넌스 감사 프로토콜 (The Zero-Defect Audit)

PM은 기획서(`plan_{page}.md`)를 하위 직군에 이관하기 전, 결함률 0% 수렴을 위해 **'150개 항목 전수 감사'**를 가동합니다.

### 1.1 하이퍼-로지컬 인과 관계 검증 (Deterministic Logic)
- **Mathematical Closure**: 모든 비즈니스 규칙이 `If-Then-Else` 원자 단위로 기술되어 논리적 허점이 전무한가?
- **Zero-Ambiguity Scrutiny**: 주관적 형용사를 배제하고 수학적 완결성을 가진 확정적 로직만을 기술했는가?

### 1.2 The Unhappy Path 20: 극한 시나리오 시뮬레이션
20가지 극한 상황을 대입하여 기획서의 방어 로직이 완벽한지 자가 검증합니다.
- **Side-Effect Map**: 특정 필드 수정이 연관된 타 모듈(API, DB, UI)에 미치는 연쇄 반응을 전수 매핑합니다.
1. **Partial Success Recovery**: 복합 트랜잭션 중 특정 API만 성공하고 나머지는 실패했을 때의 복구(Rollback) 정책 및 사용자 안내.
2. **Ghost Submits (Idempotency)**: 네트워크 지연으로 인한 중복 클릭 시, 서버 측에서 고유 요청ID를 식별하여 중복 처리를 차단하는 기획적 명시.
3. **Boundary Buffer Stress**: 입력 필드에 수만 자의 텍스트, 이모지, 특수문자, 고해상도 이미지가 들어올 때의 시스템 한계 대응.
4. **Token/Session Expiry Flow**: 긴 작업 도중 세션이 만료되었을 때, 입력 데이터의 휘발 방지(Auto-Save) 및 재로그인 후 복구 프로토콜.
5. **Cross-Entity Conflict**: A 관리자의 수정이 B 관리자의 정책(권한 변경 등)과 실시간 충돌할 때의 우선순위(Override) 규칙.
6. **Localization Layout Stress**: 다국어 적용 시 텍스트 길이가 3배 이상 길어질 때의 UI 깨짐(Truncation) 대응.
7. **Accessibility (WCAG 2.1)**: 스크린 리더, 키보드 포커스 순서, 명도 대비 등 장애 사용자의 완결적 태스크 완료 보장.
8. **Versioning/Legacy Crash**: 구버전 앱/브라우저 사용자가 신규 필드가 포함된 기능을 호출할 때의 하위 호환성(Fallback).
9. **Infrastructure Outage**: DB, Redis, 외부 결제 모듈 장애 시의 정적(Static) 모드 전환 및 서비스 지속 방안.
10. **Resource Exhaustion Logic**: 모바일 배터리 5% 미만, 메모리 부족 상황에서의 연산 부하 최적화 기획.
11. **Concurrency Lock (Sheet level)**: 여러 관리자가 동시에 대량 엑셀 업로드를 수행할 때의 순차 큐(Queue) 처리 및 중복 방지.
12. **Search Index Gap (Consistency)**: 데이터 등록 즉시 검색 결과에 노출되지 않는 '인덱싱 지연' 시간 동안의 가상 반영(Optimistic UI).
13. **Permission Escalation Prevention**: URL 파라미터 조작으로 타인의 API를 호출할 때의 서버 측 검증 요건(ACL) 전수 명시.
14. **Data Privacy Masking**: 조회 권한 등급에 따른 민감 데이터(개인정보)의 단계별 마스킹/복호화 자동화 정책.
15. **System Latency Visual**: 3초/10초/30초 이상의 지연 발생 시 단계별 프로그레스바 및 예상 대기/취소 대안 안내.
16. **Bulk Action Interrupt**: 1,000건 이상의 데이터 일괄 삭제/수정 도중 브라우저가 종료될 때의 '부분 완료' 상태 관리 정책.
17. **Dependency Failure Flow**: 연동된 3rd Party 서비스(메일 서버, 카카오톡 알림톡 등)가 응답하지 않을 때의 대기열(Queue) 관리.
18. **Navigation Interruption**: 사용자가 저장하지 않고 뒤로 가기/탭 닫기 시도의 'Dirty Check' 및 경고 인터랙션.
19. **Cache Invalidation**: 데이터 수정 시 브라우저/CDN/Redis 캐시를 즉시 파기(Purge)할지 지연 반영할지에 대한 정책.
20. **Audit Trail Logging**: 모든 비정상 동작 및 에러 발생 시 관리자 대시보드에서 추적 가능한 로그 레벨 정의.

### 1.3 Poka-Yoke (실수 방지) 메커니즘 설계
디자이너와 개발자가 실수하고 싶어도 할 수 없게 만드는 기획적 장치입니다.
- **Atomic Spec Writing**: 기능을 더 이상 쪼갤 수 없는 '원자 단위'로 기술하여 해석의 여지를 0개로 차단합니다.
- **Constraint Matrix**: 필드 간의 상호 의존 관계(A를 선택하면 B는 무조건 활성화 등)를 논리 행렬로 제공합니다.

## 2. 역수용(Reverse Handoff) 및 DoR 검증 SOP

1.  **Strict DoR Scrutiny**: `zero_defect_governance_checklist.md`의 **150개 세부 항목**을 전수 조사합니다. (95점 미만 이관 금지)
2.  **Impact Dependency Map**: 특정 기능 변경 시 연쇄적으로 영향을 받는 파일 및 로직 목록을 '사이드 이펙트 지도'로 작성하여 개발자에게 전달합니다.
3.  **Inverse Briefing Ritual**: 디자이너와 개발자가 PM에게 기획 내용을 '역으로 설명'하게 하고, 의도와 1% 이상의 오차가 발견되면 즉시 반려합니다.
4.  **Zero-Question Assurance**: 이관 후 '로직 확인용 질문'이 단 1건이라도 발생할 경우, PM은 이를 '자산의 결함'으로 인정하고 RCA(Root Cause Analysis)를 수행하여 템플릿을 개선합니다.

---
> [!IMPORTANT]
> **"기획은 코딩의 설계도이자, 프로젝트의 헌법이다."** PM은 하위 공정이 '의문'을 품지 않고 '수행'만 하도록 완벽한 논리의 절대 성벽을 구축해야 합니다.
