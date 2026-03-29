# 사용자 관리 구현 화면 설계 (Implementation Screen Design)

확정된 **시안 C (Corporate & Professional)** 컨셉을 바탕으로 한 세부 화면 설계서입니다.

---

## 1. 관리자 목록 화면 (Admin List View)
![관리자 목록](./design_option_c_corporate.png)

- **목적**: 시스템에 등록된 모든 관리자의 현황을 파악하고 관리하기 위한 메인 화면.
- **주요 구성**:
    - **Global Utility Header**: 전체/활성/잠금 계정 수 요약 대시보드 위젯.
    - **Advanced Search Bar**: 이름, 이메일, 사번 통합 검색 및 권한 필터링.
    - **Data Grid (Table)**: 
        - 컬럼: 프로필, 이름, ID(이메일), 사번, 권한, 상태(Badge), 등록일, 관리(액션 버튼).
        - 상태 표현: 활성(Green), 잠금(Red), 비활성(Grey).
- **클릭 액션 / 연동**:
    - [신규 관리자 등록] 버튼 클릭 시 우측 Drawer 오픈.
    - 목록 내 행(Row) 클릭 또는 [수정] 버튼 클릭 시 해당 관리자 수정 Drawer 오픈.
    - [삭제] 버튼 클릭 시 2단계 확인 모달 팝업.
- **접근 권한**: SUPER_ADMIN (목록 조회 및 관리), EDITOR (조회 전용).

---

## 2. 관리자 등록/수정 화면 (Admin Form Drawer)
*(디자인 컨셉: 목록 우측에서 슬라이드되는 사이드 패널)*

- **목적**: 신규 관리자 정보를 입력하거나 기존 정보를 수정.
- **주요 구성**:
    - **Form Sections**: 기본 정보(이름, 이메일, 사번), 권한 설정(Radio/Select), 상태 설정(Toggle).
    - **Submit Actions**: [저장], [취소] 버튼 (상단/하단 고정).
- **클릭 액션 / 연동**:
    - 저장 시 API 통신 후 성공 토스트 메시지 노출 및 목록 새로고침.
    - 취소 시 변경사항 무시하고 Drawer Close.
- **접근 권한**: SUPER_ADMIN.

---

## 3. 계정 삭제 확인 (Delete Confirmation Modal)
- **목적**: 실수로 인한 계정 삭제를 방지하기 위한 최종 확인 단계.
- **주요 구성**: 주의 아이콘, 삭제 대상 정보, 주의 문구, [삭제하기]/[취소] 버튼.
- **접근 권한**: SUPER_ADMIN.

---

**[Next Step]**: 디자인 단계가 성공적으로 마무리되었습니다. 확정된 디자인 및 명세를 바탕으로 **[Phase 3: Publisher]** 단계로 넘어가 마크업 설계를 진행할까요?
