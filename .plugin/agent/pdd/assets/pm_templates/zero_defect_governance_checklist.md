# [Template] The Absolute Zero-Defect Governance Checklist (150+ Items)
## Subject: [Functional Page/Module Name]
## Status: [Internal Audit Ongoing]

---

### 1. 비즈니스 아키텍처 및 논리 무결성 (Section A: Architecture & Logic) [40 Items]
- **[Global Policies]**
    - [ ] **Multi-Timezone**: 전 세계 기준 시간(UTC)과 사용자 로컬 시간의 변환 로직이 서버와 클라이언트 양측에서 정의되었는가?
    - [ ] **Currency Handling**: 금액 표시 시 소수점 처리 정책(반올림/절삭)과 통화 기호 노출 위치가 명확한가?
    - [ ] **Language Scalability**: 텍스트 길이가 극단적으로 긴 언어(예: 독일어) 대비 UI 레이아웃의 유연성이 확보되었는가?
- **[Logical Flow]**
    - [ ] **State Closure**: 모든 상태(Status) 전이가 논리적으로 닫혀 있으며, '고립된 상태'가 존재하지 않는가?
    - [ ] **Recursive Logic**: 자기 참조 데이터나 순환 구조가 발생할 경우, 무한 루프 방지를 위한 최대 깊이(Depth)가 정의되었는가?
    - [ ] **Pre-conditions (DoR)**: 기능 실행을 위해 반드시 선행되어야 할 타 모듈의 데이터 상태가 확정되었는가?
- **[Exception Resilience]**
    - [ ] **Race Condition**: 두 사용자가 동시에 저장 버튼을 누를 때의 버전 충돌(Conflict) 해결 정책이 있는가?
    - [ ] **Transaction Atomicity**: A 데이터 저장 성공 시 B 데이터 저장 실패 상황에 대한 롤백 시나리오가 있는가?
    - [ ] **Partial Failure**: API 묶음 요청 중 일부만 성공했을 때의 사용자 알림 및 복구 수준이 정의되었는가?

### 2. 하이퍼 UX/UI 및 인터랙션 상세 (Section B: UX/UI Deep-Dive) [45 Items]
- **[Atomic UI States]**
    - [ ] **The 8 States**: Normal, Hover, Active, Focus, Disabled, Loading, Selected, Error 상태가 모든 요소에 정의되었는가?
    - [ ] **Skeleton UI**: 데이터 로딩 중 단순히 'Loading' 텍스트가 아닌, 레이아웃 구조를 반영한 스켈레톤 UI 가이드가 있는가?
    - [ ] **Empty State**: 데이터가 0건일 때 사용자의 다음 행동(CTA)을 유도하는 가이드가 있는가?
- **[Validation & Feedback]**
    - [ ] **Input Constraints**:
        - [ ] 모든 입력 필드의 Byte 단위 최대 길이 제약. (UTF-8 고려)
        - [ ] 공백(Space)만 입력 시 처리 정책 및 Trim(앞뒤 공백 제거) 여부.
        - [ ] 허용되지 않는 특수문자 및 금칙어 필터링 정책.
    - [ ] **Error Feedbacks**:
        - [ ] 에러 발생 위치(Inline)와 전역 메시지(Toast/Modal)의 구분.
        - [ ] 기술적인 에러가 아닌, 사용자 언어(Biz-term)로 번역된 에러 메시지 매핑.
- **[Behavioral Psychology]**
    - [ ] **Double-Click Prevention**: 버튼 클릭 후 응답 전까지 중복 클릭을 원천 차단하는 인터랙션(Debounce/Throttle)이 정의되었는가?
    - [ ] **Navigation Guard**: 폼 작성 중 페이지 이탈 시 '저장되지 않은 변경사항'에 대한 경고 인터랙션이 있는가?

### 3. 데이터 보안, 아키텍처 및 API (Section C: Data & API Integrity) [35 Items]
- **[Data Modeling]**
    - [ ] **Field Integrity**: 모든 필드의 데이터 타입, Null 허용 여부, 기본값(Default)이 DB 설계서 수준으로 확정되었는가?
    - [ ] **Naming Standard**: 프로젝트 공통 용어 사전에 따른 필드명 및 API 엔드포인트 규칙을 준수했는가?
    - [ ] **Data Retention**: 삭제 요청 시 즉각적인 영구 삭제(Hard)인지 보관 후 삭제(Soft)인지에 대한 정책이 있는가?
- **[Security & Privacy]**
    - [ ] **RBAC (Role-Based Access Control)**:
        - [ ] 각 역할(Admin, User, Viewer 등)별 버튼/필드 단위의 가시성 매트릭스.
        - [ ] 권한 없는 사용자가 URL 직접 접근 시 403 에러 처리 정책.
    - [ ] **Privacy Masking**: 민감 정보(전화번호, 주소 등)의 뒷자리 마스킹 규칙 및 해제 권한 계층 정의.
    - [ ] **Audit Trail**: 누가, 언제, 어떤 IP에서 어떤 데이터를 이전값 -> 이후값으로 변경했는지 기록할 로깅 요건.

### 4. 비기능적 요건 및 성능 보증 (Section D: Non-Functional) [30 Items]
- **[Performance & Reliability]**
    - [ ] **Scalability Barrier**: 목록 조회 시 1만 건 이상의 데이터가 발생할 경우의 페이징(Offset vs Cursor) 정책.
    - [ ] **Search Indexing**: 검색 필드로 지정된 항목들의 DB 인덱싱 효율성과 검색 조건(Exact vs Full-text) 명시.
    - [ ] **Asset Optimization**: 이미지 업로드 시 최대 용량 제한 및 서버 측 리사이징 규격이 있는가?
- **[Infrastructure Fallback]**
    - [ ] **External API Timeout**: 연동된 외부 서비스(결제, SMS 등)의 응답 지연 시 타임아웃(예: 5초) 및 Fallback UI.
    - [ ] **Cache Strategy**: 특정 데이터의 브라우저/서버 캐싱 유지 시간(TTL) 및 즉시 갱신(Purge) 시점 정의.
    - [ ] **Maintenance Mode**: 시스템 정기 점검 시 데이터 정합성 파괴 방지를 위한 읽기 전용(Read-only) 전환 안내.

---

### 최종 무결성 성적표 (The Governance Scorecard)
| 도메인 | 총 항목 수 | 통과 수 | 준수율 (%) | 리스크 등급 |
| :--- | :---: | :---: | :---: | :---: |
| **A. 아키텍처/논리** | 40 | 0 | 0% | [LOW/MID/CRITICAL] |
| **B. UX/UI 상세** | 45 | 0 | 0% | [LOW/MID/CRITICAL] |
| **C. 데이터/API/보안** | 35 | 0 | 0% | [LOW/MID/CRITICAL] |
| **D. 비기능/성능** | 30 | 0 | 0% | [LOW/MID/CRITICAL] |
| **합계** | **150** | **0** | **0%** | **REJECTED** |

- **가중치 점수**: `(합계 준수율 * 1.0)`
- **Auditor의 최종 확언**:
  > 본 기획서는 150개 항목의 무결성 검사를 마쳤으며, 하위 공정(디자인/개발)에서 단 1건의 질문도 발생시키지 않을 수준의 정밀도를 확보하였으므로 이관을 승인합니다. 

- **Auditor Name**: [Senior PM Agent 01]
- **Approval Date**: [YYYY-MM-DD]
