# [사용자 관리] FE 상세 설계서 (Frontend Technical Spec)

> 최종 수정: 2026-03-18 17:18

> **v2 업데이트** _(2026-03-18 17:18)_: 권한관리(Roles API) 연동 반영 — 역할 목록 동적 로딩으로 변경

---

## 1. 컴포넌트 구조 및 공통화 (Component Architecture)

```
src/app/admin/settings/users/page.tsx         ← Container
src/components/admin-users/
  ├── AdminDashboard.tsx                       ← 상단 통계 위젯
  ├── AdminListToolbar.tsx                     ← 검색 + 역할 필터 (동적)
  ├── AdminTable.tsx                           ← 사용자 목록 그리드
  └── AdminDrawer.tsx                          ← 등록/수정 사이드 패널 (역할 동적)
src/store/useAdminStore.ts                     ← Admin 상태 관리
src/store/useRoleStore.ts                      ← Role 목록 (공유 스토어)
src/lib/validations/admin.ts                  ← Zod 스키마
```

---

## 2. 데이터 마스터 및 유효성 검사 (Master Validation Table) _(2026-03-18 17:18 추가)_

### 2.1 Admin 인터페이스 변경

| 필드 | 기존 타입 | 변경 타입 | 이유 |
|:---|:---|:---|:---|
| `role` | `'SUPER_ADMIN' \| 'EDITOR'` | `string` | 동적 역할 코드 수용 |

### 2.2 adminSchema 변경

| 필드 | 기존 | 변경 | 에러 메시지 |
|:---|:---|:---|:---|
| `role` | `z.enum(["SUPER_ADMIN", "EDITOR"])` | `z.string().min(1, "권한을 선택해 주세요.")` | "권한을 선택해 주세요." |

### 2.3 역할 데이터 구조 (useRoleStore.Role)

| 필드 | 타입 | 용도 |
|:---|:---|:---|
| `code` | `string` | select `value` 값으로 사용 |
| `displayName` | `string` | select `option` 표시 텍스트 |
| `color` | `string` | 색상 뱃지 표시 (선택적) |
| `isSystem` | `boolean` | 시스템 역할 여부 구분 |

---

## 3. 상태 관리 설계 (State Design) _(2026-03-18 17:18 추가)_

### 3.1 useAdminStore — 변경 사항

- `Admin.role` 타입: `'SUPER_ADMIN' | 'EDITOR'` → `string`
- 나머지 상태/액션 변경 없음

### 3.2 useRoleStore — 공유 활용

`AdminDrawer`와 `AdminListToolbar`는 기존 `useRoleStore`를 직접 참조합니다.
별도 역할 fetch 로직을 추가하지 않고 공유 스토어를 재활용합니다.

| 컴포넌트 | 사용하는 상태 | 호출 액션 |
|:---|:---|:---|
| `AdminDrawer` | `roles`, `isLoading` | `fetchRoles()` (마운트 시, roles가 비어있을 때만) |
| `AdminListToolbar` | `roles` | 별도 호출 없음 (Drawer에서 로드된 값 재활용) |

### 3.3 역할 로딩 시점 및 조건

```
AdminDrawer 오픈 시:
  if (roles.length === 0) → fetchRoles() 호출
  else → 기존 캐시 사용 (불필요한 API 중복 호출 방지)
```

---

## 4. 기능 상세 구현 로직 (Functional Implementation Logic) _(2026-03-18 17:18 추가)_

### 4.1 AdminDrawer — 역할 Select 변경

| 항목 | 기존 | 변경 후 |
|:---|:---|:---|
| 옵션 구성 | `<option value="SUPER_ADMIN">최고 관리자</option>` 하드코딩 | `roles.map(r => <option value={r.code}>{r.displayName}</option>)` 동적 생성 |
| 기본값 | `'EDITOR'` 고정 | 첫 번째 비시스템 역할 코드 또는 `''` |
| 로딩 중 처리 | 없음 | `disabled` + `placeholder` ("역할 불러오는 중...") |
| 에러 처리 | 없음 | roles 로드 실패 시 "역할 목록을 불러올 수 없습니다" 안내 |

### 4.2 AdminListToolbar — 역할 필터 변경

| 항목 | 기존 | 변경 후 |
|:---|:---|:---|
| 전체 옵션 | `<option value="ALL">권한 · 전체</option>` | 유지 |
| 역할 옵션 | `SUPER_ADMIN`, `EDITOR` 하드코딩 | `roles.map(r => <option value={r.code}>{r.displayName}</option>)` 동적 생성 |
| 로딩 중 처리 | 없음 | roles가 비어있으면 전체 옵션만 표시 |

### 4.3 상태 전이 흐름

```
[AdminDrawer 오픈]
  → roles.length === 0 ? fetchRoles() : skip
  → isLoading(roles) === true → select disabled, "불러오는 중..."
  → isLoading(roles) === false, roles.length > 0 → 동적 옵션 렌더
  → isLoading(roles) === false, roles.length === 0 → 에러 안내 표시
```

---

## 5. 예외 및 보안 정책 (Special Policies) _(2026-03-18 17:18 추가)_

| 상황 | 처리 방식 |
|:---|:---|
| 역할 API 호출 실패 | select 비활성화 + "역할 목록을 불러올 수 없습니다." 텍스트 표시 |
| 역할 목록이 빈 배열 | select에 "등록된 역할이 없습니다" 비활성 옵션 표시 |
| 기존 관리자의 role 코드가 현재 역할 목록에 없는 경우 | 현재 값 그대로 표시 (삭제된 역할 코드 보존) |
| 폼 제출 시 role이 빈 값 | Zod 검증 → "권한을 선택해 주세요." 에러 메시지 |

---

## 6. API 연동 명세 _(2026-03-18 17:18 추가)_

| 액션 | Method | Endpoint | 비고 |
|:---|:---|:---|:---|
| 역할 목록 조회 | `GET` | `/api/v1/roles` | `useRoleStore.fetchRoles()` 재활용 |
| 관리자 등록 | `POST` | `/api/v1/admins` | `role` 필드: 동적 코드 문자열 전송 |
| 관리자 수정 | `PATCH` | `/api/v1/admins/{id}` | `role` 필드 포함 |

---

## 7. 개발자 핸드오버 체크리스트 _(2026-03-18 17:18 추가)_

- [ ] `Admin.role` 타입을 `string`으로 변경했는가?
- [ ] `adminSchema`의 `role` 검증을 `z.string().min(1)`으로 변경했는가?
- [ ] `AdminDrawer`에서 `useRoleStore`를 import하여 동적 옵션을 렌더링했는가?
- [ ] `AdminListToolbar`에서 `useRoleStore`를 import하여 동적 필터를 렌더링했는가?
- [ ] 역할 로딩 중 select 비활성화 처리가 되어 있는가?
- [ ] 역할 API 실패 시 예외 처리가 되어 있는가?
- [ ] 기존 하드코딩된 `SUPER_ADMIN`, `EDITOR` enum 잔재가 제거되었는가?
