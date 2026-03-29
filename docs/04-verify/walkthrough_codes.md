# 워크스루 — 공통코드 관리 (codes)

- **작성일**: 2026-03-23

---

## 1. 주요 사용자 흐름

### 흐름 A: 코드 그룹 생성
1. `/admin/settings/codes` 진입 → 그룹 목록 API 자동 호출
2. "그룹 추가" 버튼 클릭 → 우측 패널 생성 폼 전환, 그룹코드 자동 포커싱
3. 그룹코드 입력 (소문자 자동 대문자 변환, 30자 제한) → 그룹명 입력
4. "그룹 추가" 버튼 또는 Enter 키 → API `POST /api/v1/codes` 호출
5. 성공 시 토스트 + 목록 새로고침 + 생성 모드 해제

### 흐름 B: 코드 그룹 수정
1. 목록에서 그룹 클릭 → 우측 상세 패널 바인딩
2. 그룹명/설명/사용여부 변경 → "수정됨" 뱃지 표시
3. 비활성 전환 시 하위 코드 경고 confirm
4. "저장" 버튼 → API `PUT /api/v1/codes/{id}` 호출
5. 변경사항 없으면 "변경사항이 없습니다" 안내

### 흐름 C: 코드 상세 추가/편집/삭제
1. 그룹 선택 후 하단 코드 테이블 표시
2. "코드 추가" 버튼 → 인라인 추가 행 (자동 포커싱)
3. 코드값/코드명 입력 후 Enter 또는 ✓ → `POST /api/v1/codes/{groupId}/details`
4. 편집 버튼 → 해당 행 인라인 편집 모드 전환 (Enter 저장 / Escape 취소)
5. Y/N 토글 → `PUT` 호출로 active 즉시 변경

---

## 2. 핵심 설계 결정사항

| 항목 | 결정 내용 |
|:---|:---|
| 그룹코드 수정 불가 | 생성 후 `groupCode`는 BE에서 무시, FE에서 `disabled` 처리 |
| 하위 코드 연쇄 삭제 | `CascadeType.ALL` + `orphanRemoval=true` |
| 사용여부 토글 | PUT 호출 시 `code`, `name`, `sortOrder`, `active` 전체 전송 필수 |
| 중복 방지 | 그룹코드: 전체 유일 / 코드값: 동일 그룹 내 유일 (UNIQUE 제약) |
| 초기 데이터 | STATUS / CATEGORY / PRIORITY 3개 그룹 + 10개 코드 자동 삽입 |
| 메뉴 등록 | `DataInitializer.initCodesMenu()` — 멱등성 보장, 기존 DB에도 적용 |

---

## 3. 수정 이력

| 단계 | 내용 |
|:---|:---|
| 07 BE 개발 | `CodeGroupRequest.groupCode` @NotBlank 추가, 잘못된 에러코드 제거, `initCodesMenu()` 추가 |
| 08 Verifier | 사용여부 토글 400 오류 수정, Zustand 직접 뮤테이션 제거, Escape 키 처리 추가, RoleDrawer TS 오류 수정 |
