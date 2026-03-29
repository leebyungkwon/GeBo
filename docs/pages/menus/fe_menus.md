# 메뉴 관리 FE 상세 설계서 (Service Screen Plan)

## 1. 개요 및 퍼블리싱 자산 연결

- **설계 목적**: BO/FO 시스템 메뉴의 CRUD와 역할별 접근 권한 매핑을 프론트엔드 레벨에서 보장
- **참조 자산**:
  - 페이지: `bo/src/app/admin/settings/menus/page.tsx`
  - 컴포넌트: `bo/src/components/menus/MenuTree.tsx`, `MenuDetail.tsx`, `MenuRoleMatrix.tsx`, `MenuAddModal.tsx`
  - 상태관리: `bo/src/store/useMenuStore.ts`

---

## 2. 데이터 마스터 및 유효성 검사 (Master Validation Table)

### 2.1 Menu 엔티티 — 필드별 검증

| 필드명 (UI) | Key | 타입 | 필수 | 검증 규칙 | 에러 메시지 |
|:---|:---|:---|:---|:---|:---|
| 메뉴명 | `name` | String | Y | 공백 제외 1~50자, `^[가-힣a-zA-Z0-9\s\-_()]{1,50}$` | 메뉴명은 1~50자로 입력해주세요. |
| URL | `url` | String | N (대메뉴) / Y (하위메뉴) | 빈 문자열 허용(대메뉴), 하위메뉴는 `/`로 시작 필수 `^\/[a-zA-Z0-9\-_\/]*$` | URL은 /로 시작하는 경로를 입력해주세요. |
| 아이콘 | `icon` | String | Y | 프리셋 목록 내 값만 허용 | 아이콘을 선택해주세요. |
| 상위메뉴 | `parentId` | Number \| null | N | null이면 대메뉴, 값이면 해당 ID가 존재해야 함 | 유효하지 않은 상위 메뉴입니다. |
| 메뉴구분 | `menuType` | Enum | Y | `'BO'` \| `'FO'` 중 하나 | - |
| 정렬순서 | `sortOrder` | Number | Y | 양의 정수, 1 이상, 소수점 불허 | 정렬 순서는 1 이상의 정수를 입력해주세요. |
| 노출여부 | `visible` | Boolean | Y | true/false | - |

### 2.2 필드별 상세 Validation 시나리오

#### 2.2.1 메뉴명 (`name`)

| 검증 시점 | 조건 | 결과 | 에러 메시지 |
|:---|:---|:---|:---|
| onChange + onBlur | 빈 문자열 | 에러 표시 (빨간 테두리 + 메시지) | 메뉴명을 입력해주세요. |
| onChange + onBlur | 공백만 입력 (예: `"   "`) | 에러 표시 | 메뉴명을 입력해주세요. |
| onChange | 50자 초과 입력 시도 | 입력 차단 (maxLength) | - |
| onBlur | 특수문자 포함 (예: `<script>`, `@#$`) | 에러 표시 | 메뉴명은 한글, 영문, 숫자, 공백, -, _, ()만 사용 가능합니다. |
| 저장/추가 시 | 같은 parentId + menuType 내 동일 name 존재 | API 409 → 에러 토스트 | 이미 동일한 이름의 메뉴가 존재합니다. |
| onChange | 앞뒤 공백 포함 입력 | 저장 시 자동 trim 처리 | - |

#### 2.2.2 URL (`url`)

| 검증 시점 | 조건 | 결과 | 에러 메시지 |
|:---|:---|:---|:---|
| onBlur | 대메뉴인데 URL 비어있음 | 허용 (대메뉴는 URL 선택사항) | - |
| onBlur | 하위메뉴인데 URL 비어있음 | 에러 표시 | 하위 메뉴는 URL을 입력해야 합니다. |
| onBlur | `/`로 시작하지 않음 (예: `admin/users`) | 에러 표시 | URL은 /로 시작해야 합니다. |
| onBlur | 허용되지 않는 문자 포함 (한글, 공백 등) | 에러 표시 | URL은 영문, 숫자, -, _, /만 사용 가능합니다. |
| 저장/추가 시 | 동일 URL이 이미 존재 | API 409 → 에러 토스트 | 이미 사용 중인 URL입니다. |
| onBlur | 연속 슬래시 (예: `//admin`) | 에러 표시 | URL에 연속 슬래시(//)는 사용할 수 없습니다. |
| onBlur | 마지막 문자가 `/` (예: `/admin/`) | 자동 제거 (trailing slash strip) | - |

#### 2.2.3 정렬순서 (`sortOrder`)

| 검증 시점 | 조건 | 결과 | 에러 메시지 |
|:---|:---|:---|:---|
| onChange | 0 이하 입력 | 에러 표시 | 정렬 순서는 1 이상이어야 합니다. |
| onChange | 소수점 입력 (예: `1.5`) | 입력 차단 (정수만 허용) | - |
| onChange | 음수 입력 (예: `-1`) | 입력 차단 | - |
| onChange | 빈 값 | 에러 표시 | 정렬 순서를 입력해주세요. |
| onChange | 999 초과 | 에러 표시 | 정렬 순서는 999 이하여야 합니다. |

#### 2.2.4 아이콘 (`icon`)

| 검증 시점 | 조건 | 결과 | 에러 메시지 |
|:---|:---|:---|:---|
| 저장/추가 시 | 프리셋 목록에 없는 값 | 에러 표시 | 아이콘을 선택해주세요. |
| 초기값 | select 기본값 | 첫 번째 프리셋 자동 선택 | - |

### 2.3 RoleMenu 매핑

| 필드명 | Key | 타입 | 필수 | 검증 규칙 | 에러 메시지 |
|:---|:---|:---|:---|:---|:---|
| 메뉴 ID | `menuId` | Number | Y | 유효한 Menu ID | - |
| 역할 ID | `roleId` | Number | Y | 유효한 Role ID | - |
| 접근권한 | `hasAccess` | Boolean | Y | true/false | - |

### 2.4 복합 Validation (Cross-Field)

| 조건 | 검증 규칙 | 에러 메시지 |
|:---|:---|:---|
| 대메뉴에 URL 입력 | 경고만 표시 (차단하지 않음) | 대메뉴는 일반적으로 URL을 비워둡니다. 계속하시겠습니까? |
| 하위메뉴인데 parentId가 null | 추가 시 차단 | 하위 메뉴는 상위 메뉴를 선택해야 합니다. |
| 대메뉴 숨김 시 하위메뉴 존재 | 경고 confirm | 하위 메뉴도 함께 숨김 처리됩니다. 계속하시겠습니까? |
| 자기 자신을 상위메뉴로 선택 | 차단 | 자기 자신을 상위 메뉴로 설정할 수 없습니다. |
| 3depth 이상 중첩 시도 | 차단 (2depth까지만 허용) | 메뉴는 2단계까지만 생성할 수 있습니다. |

---

## 3. 신규 공통 모듈 추출 명세 (Commonality Extraction)

### 3.1 TreeView 컴포넌트
- **모듈명**: `TreeView`
- **용도**: 계층형 데이터를 트리 형태로 표시 (메뉴 관리 외 카테고리 관리 등에서 재사용 가능)
- **Props**:
  - `items: TreeItem[]` — 트리 데이터
  - `selectedId: number | null` — 선택된 노드 ID
  - `onSelect: (item: TreeItem) => void` — 선택 콜백
  - `onMove: (id: number, direction: 'up' | 'down') => void` — 순서 이동
- **Events**: `onSelect`, `onMove`

### 3.2 RoleCheckMatrix 컴포넌트
- **모듈명**: `RoleCheckMatrix`
- **용도**: 역할별 접근 권한 체크박스 그리드 (메뉴 권한 외 기능 권한에서도 재사용 가능)
- **Props**:
  - `roles: Role[]` — 역할 목록
  - `mappings: { roleId: number; hasAccess: boolean }[]` — 매핑 데이터
  - `onChange: (roleId: number, hasAccess: boolean) => void` — 변경 콜백

---

## 4. 기능 상세 구현 로직 (Functional Implementation Logic)

### 4.1 이벤트 및 핸들러 명세

| 대상 | 이벤트 | 동작 및 상세 로직 | 연동 API |
|:---|:---|:---|:---|
| BO/FO 탭 | Click | `activeTab` 변경 → 해당 타입 메뉴 목록 재조회, `selectedMenu` 초기화 | `GET /api/v1/menus?type={BO\|FO}` |
| 트리 노드 | Click | `selectedMenu` 설정 → 상세 편집 패널에 데이터 바인딩, 역할 매핑 조회 | `GET /api/v1/menus/{id}/roles` |
| 펼치기/접기 | Click | 해당 노드의 `expanded` 로컬 상태 토글 (API 호출 없음) | - |
| 순서 이동 (↑↓) | Click | 동일 depth 형제 노드 간 `sortOrder` 교환 → API 호출 | `PATCH /api/v1/menus/{id}/sort` |
| 메뉴 추가 버튼 | Click | `isAddModalOpen = true` → 모달 표시 | - |
| 모달 > 추가 버튼 | Click | validation 수행 → 메뉴 생성 API 호출 → 성공 시 모달 닫기 + 트리 새로고침 + 토스트 | `POST /api/v1/menus` |
| 모달 > 취소 버튼 | Click | 입력값 초기화 + 모달 닫기 | - |
| 모달 > 배경 클릭 | Click | 입력값이 있으면 confirm("작성 중인 내용이 있습니다. 닫으시겠습니까?"), 없으면 바로 닫기 | - |
| 모달 > Enter 키 | KeyDown | 메뉴명 input에서 Enter → 추가 버튼과 동일 동작 | - |
| 모달 > Escape 키 | KeyDown | 취소 버튼과 동일 동작 | - |
| 상세 > 저장 버튼 | Click | validation 수행 → 메뉴 수정 API 호출 → 성공 시 트리 새로고침 + 토스트 | `PUT /api/v1/menus/{id}` |
| 상세 > 삭제 버튼 | Click | confirm 다이얼로그 → 승인 시 삭제 API 호출 → 성공 시 `selectedMenu` 초기화 + 트리 새로고침 + 토스트 | `DELETE /api/v1/menus/{id}` |
| 상세 > 메뉴명 input | onBlur | trim 처리 + 빈 값 체크 + 패턴 체크 → 에러 표시 | - |
| 상세 > URL input | onBlur | trim + trailing slash 제거 + 패턴 체크 → 에러 표시 | - |
| 역할 체크박스 | Change | 즉시 매핑 API 호출 (낙관적 업데이트), 실패 시 롤백 | `PUT /api/v1/menus/{menuId}/roles/{roleId}` |
| 노출여부 토글 | Click | 로컬 상태만 변경 (저장 버튼 클릭 시 일괄 반영) | - |
| 메뉴 선택 변경 | Click | 편집 중 저장하지 않은 변경사항 있으면 confirm("저장하지 않은 변경사항이 있습니다. 이동하시겠습니까?") | - |

### 4.2 화면 상태 변화 (State Transition)

**전역 상태** (useMenuStore):
| 상태명 | 타입 | 초기값 | 설명 |
|:---|:---|:---|:---|
| `menus` | `MenuItem[]` | `[]` | 트리 구조 메뉴 목록 |
| `roles` | `Role[]` | `[]` | 전체 역할 목록 |
| `roleMenuMappings` | `MenuRoleMapping[]` | `[]` | 선택 메뉴의 역할 매핑 |
| `selectedMenu` | `MenuItem \| null` | `null` | 선택된 메뉴 |
| `activeTab` | `'BO' \| 'FO'` | `'BO'` | 현재 탭 |
| `isLoading` | `boolean` | `false` | 로딩 상태 |
| `isAddModalOpen` | `boolean` | `false` | 추가 모달 노출 |

**지역 상태** (MenuDetail 내부):
| 상태명 | 타입 | 설명 |
|:---|:---|:---|
| `name` | `string` | 편집 중인 메뉴명 |
| `url` | `string` | 편집 중인 URL |
| `icon` | `string` | 편집 중인 아이콘 |
| `sortOrder` | `number` | 편집 중인 정렬 순서 |
| `visible` | `boolean` | 편집 중인 노출 여부 |
| `nameError` | `string` | 메뉴명 에러 메시지 |
| `urlError` | `string` | URL 에러 메시지 |
| `sortOrderError` | `string` | 정렬순서 에러 메시지 |
| `isDirty` | `boolean` | 변경사항 존재 여부 (원본 대비) |

**지역 상태** (MenuAddModal 내부):
| 상태명 | 타입 | 설명 |
|:---|:---|:---|
| `name` | `string` | 입력 중인 메뉴명 |
| `url` | `string` | 입력 중인 URL |
| `parentId` | `number \| null` | 선택한 상위 메뉴 |
| `icon` | `string` | 선택한 아이콘 |
| `nameError` | `string` | 메뉴명 에러 메시지 |
| `urlError` | `string` | URL 에러 메시지 |
| `isSubmitting` | `boolean` | 제출 중 여부 (중복 클릭 방지) |

**상태 전이 흐름**:
1. 페이지 진입 → `isLoading = true` → `fetchMenus()` + `fetchRoles()` → `isLoading = false`
2. 메뉴 없음 → Empty UI (폴더 아이콘 + "등록된 메뉴가 없습니다")
3. 메뉴 선택 → `selectedMenu` 설정 → `fetchRoleMenuMappings()` → 상세 패널 렌더링
4. 편집 중 다른 메뉴 선택 → `isDirty` 확인 → true이면 confirm → 승인 시 이동
5. 저장 클릭 → validation → 실패 시 첫 에러 필드 포커싱 → 성공 시 API 호출
6. 저장 성공 → 토스트 "메뉴가 저장되었습니다." → `isDirty = false` → 트리 새로고침
7. 저장 실패 → 에러 토스트 (API 응답 메시지 표시)
8. 삭제 클릭 → confirm → 승인 시 API 호출
9. 삭제 성공 → 토스트 "메뉴가 삭제되었습니다." → `selectedMenu = null` → 트리 새로고침
10. 추가 모달 열기 → 빈 폼 표시
11. 추가 클릭 → validation → `isSubmitting = true` → API 호출 → 성공 시 모달 닫기 + 초기화 + 트리 새로고침
12. 추가 실패 → `isSubmitting = false` → 에러 토스트

### 4.3 API 엔드포인트 명세

| Method | URL | 설명 | Request Body | Response |
|:---|:---|:---|:---|:---|
| GET | `/api/v1/menus?type={BO\|FO}` | 타입별 메뉴 목록 조회 | - | `MenuItem[]` |
| GET | `/api/v1/menus/{id}` | 메뉴 단건 조회 | - | `MenuItem` |
| POST | `/api/v1/menus` | 메뉴 생성 | `{ name, url, icon, parentId, menuType, sortOrder, visible }` | `MenuItem` |
| PUT | `/api/v1/menus/{id}` | 메뉴 수정 | `{ name, url, icon, sortOrder, visible }` | `MenuItem` |
| DELETE | `/api/v1/menus/{id}` | 메뉴 삭제 (하위 포함) | - | `void` |
| PATCH | `/api/v1/menus/{id}/sort` | 정렬 순서 변경 | `{ sortOrder }` | `void` |
| GET | `/api/v1/menus/{id}/roles` | 메뉴별 역할 매핑 조회 | - | `MenuRoleMapping[]` |
| PUT | `/api/v1/menus/{menuId}/roles/{roleId}` | 역할 매핑 변경 | `{ hasAccess: boolean }` | `void` |

### 4.4 API 에러 핸들링

| HTTP 상태 | 상황 | FE 처리 |
|:---|:---|:---|
| 400 | 잘못된 요청 (필수값 누락, 자기 삭제 시도) | 에러 토스트 (응답 message 표시) |
| 401 | 인증 만료 | 로그인 페이지 리다이렉트 |
| 403 | 권한 없음 | 에러 토스트 "접근 권한이 없습니다." |
| 404 | 존재하지 않는 메뉴 | 에러 토스트 + 트리 새로고침 |
| 409 | 중복 (메뉴명 또는 URL) | 에러 토스트 (응답 message 표시) + 해당 필드 에러 표시 |
| 500 | 서버 오류 | 에러 토스트 "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." |

---

## 5. 공통 모듈 및 유틸리티 활용 (Infrastructure Binding)

| 구분 | 모듈 | 용도 |
|:---|:---|:---|
| UI | `sonner` (toast) | 성공/에러 피드백 |
| UI | `lucide-react` | 아이콘 |
| UI | `ConfirmModal` | 삭제 confirm 다이얼로그 |
| 상태 | `zustand` | 전역 상태 관리 |
| API | `axios` (예정) | HTTP 클라이언트 |

---

## 6. 예외 및 보안 정책 (Special Policies)

| 정책 | 상세 |
|:---|:---|
| **대메뉴 삭제 시 하위 연쇄 삭제** | confirm에 "하위 메뉴도 함께 삭제됩니다" 경고 문구 포함 |
| **중복 메뉴명 방지** | 같은 parentId + menuType 내에서 동일 name 불허 (BE에서 409 응답) |
| **권한 체크 즉시 반영** | 체크박스 변경 시 낙관적 업데이트 + API 호출, 실패 시 롤백 + 에러 토스트 |
| **자기 자신 삭제 방지** | 메뉴 관리 메뉴 자체는 삭제 불가 (BE에서 400 응답) |
| **Role-Based UI** | ADMIN 역할만 메뉴 관리 접근 가능 (라우트 가드) |
| **중복 클릭 방지** | 저장/추가/삭제 버튼 클릭 시 `isSubmitting` 동안 버튼 disabled |
| **XSS 방지** | 메뉴명/URL 입력 시 `<`, `>`, `"`, `'` 문자 입력 차단 |
| **세션 만료** | API 401 응답 시 자동 로그인 페이지 이동 |
| **미저장 데이터 보호** | 편집 중 페이지 이탈 시 `beforeunload` 이벤트로 경고 |

---

## 7. FE 개발 체크리스트 (05단계 검증 필수)

> ⚠️ **이 체크리스트는 05단계 FE Developer가 개발 완료 후 반드시 항목별로 검증하고 ✅/❌ 표시해야 한다.**
> 모든 항목이 ✅가 될 때까지 사용자에게 완료 보고를 할 수 없다.

### 7.1 페이지 진입 및 초기 렌더링
- [ ] 페이지 진입 시 BO 탭이 기본 선택되는가?
- [ ] 페이지 진입 시 메뉴 목록 API가 호출되는가?
- [ ] 페이지 진입 시 역할 목록 API가 호출되는가?
- [ ] 로딩 중 스피너가 표시되는가?
- [ ] 메뉴가 없을 때 Empty UI가 표시되는가?
- [ ] API 에러 시 에러 토스트가 표시되는가?

### 7.2 BO/FO 탭 전환
- [ ] BO 탭 클릭 시 BO 메뉴만 조회되는가?
- [ ] FO 탭 클릭 시 FO 메뉴만 조회되는가?
- [ ] 탭 전환 시 `selectedMenu`가 초기화되는가?
- [ ] 탭 전환 시 상세 편집 패널이 빈 상태("메뉴를 선택하세요")로 돌아가는가?
- [ ] 탭 전환 시 편집 중 미저장 데이터가 있으면 confirm이 뜨는가?

### 7.3 메뉴 트리
- [ ] 대메뉴가 트리 루트로 표시되는가?
- [ ] 하위메뉴가 대메뉴 하위에 들여쓰기되어 표시되는가?
- [ ] 하위메뉴가 있는 대메뉴에 펼치기/접기(▶/▼) 아이콘이 표시되는가?
- [ ] 펼치기/접기 클릭 시 하위메뉴가 토글되는가?
- [ ] 메뉴 클릭 시 선택 상태(배경색 변경)가 되는가?
- [ ] 숨김 메뉴에 EyeOff 아이콘이 표시되는가?
- [ ] 순서 이동(↑) 클릭 시 이전 형제 메뉴와 순서가 교환되는가?
- [ ] 순서 이동(↓) 클릭 시 다음 형제 메뉴와 순서가 교환되는가?
- [ ] 첫 번째 메뉴의 ↑ 버튼이 비활성화되는가?
- [ ] 마지막 메뉴의 ↓ 버튼이 비활성화되는가?
- [ ] 순서 변경 후 트리가 즉시 반영되는가?
- [ ] 대메뉴와 하위메뉴의 아이콘이 다르게 표시되는가? (Folder / FileText)

### 7.4 메뉴 상세 편집 (MenuDetail)
- [ ] 메뉴 미선택 시 빈 상태 안내 UI가 표시되는가?
- [ ] 메뉴 선택 시 메뉴명, URL, 아이콘, 정렬순서, 노출여부가 올바르게 바인딩되는가?
- [ ] 대메뉴 선택 시 "대메뉴" 뱃지가 표시되는가?
- [ ] 하위메뉴 선택 시 "하위메뉴" 뱃지가 표시되는가?
- [ ] 다른 메뉴 선택 시 이전 편집 내용이 새 메뉴 데이터로 교체되는가?
- [ ] 편집 중 다른 메뉴 선택 시 미저장 confirm이 동작하는가?

### 7.5 메뉴명 Validation
- [ ] 빈 값 입력 시 에러 메시지 "메뉴명을 입력해주세요."가 표시되는가?
- [ ] 공백만 입력 시 에러 메시지가 표시되는가?
- [ ] 50자 초과 입력이 차단되는가 (maxLength)?
- [ ] 특수문자(`<`, `>`, `@`, `#` 등) 입력 시 에러 메시지가 표시되는가?
- [ ] 저장 시 앞뒤 공백이 자동 trim되는가?
- [ ] 중복 메뉴명 저장 시 API 409 에러 토스트가 표시되는가?

### 7.6 URL Validation
- [ ] 대메뉴의 URL이 비어있어도 저장 가능한가?
- [ ] 하위메뉴의 URL이 비어있으면 에러가 표시되는가?
- [ ] `/`로 시작하지 않는 URL 입력 시 에러가 표시되는가?
- [ ] 한글/공백 포함 URL 입력 시 에러가 표시되는가?
- [ ] 연속 슬래시(`//`) 입력 시 에러가 표시되는가?
- [ ] trailing slash(`/admin/`)가 자동 제거되는가?
- [ ] 중복 URL 저장 시 API 409 에러 토스트가 표시되는가?

### 7.7 정렬순서 Validation
- [ ] 0 이하 입력 시 에러가 표시되는가?
- [ ] 소수점 입력이 차단되는가?
- [ ] 음수 입력이 차단되는가?
- [ ] 빈 값 입력 시 에러가 표시되는가?
- [ ] 999 초과 입력 시 에러가 표시되는가?

### 7.8 저장 기능
- [ ] validation 실패 시 API 요청이 차단되는가?
- [ ] validation 실패 시 첫 번째 에러 필드로 포커싱되는가?
- [ ] 저장 버튼 클릭 시 중복 클릭이 방지되는가 (isSubmitting)?
- [ ] 저장 성공 시 "메뉴가 저장되었습니다." 토스트가 표시되는가?
- [ ] 저장 성공 후 트리가 새로고침되는가?
- [ ] 저장 실패 시 에러 토스트가 표시되는가?
- [ ] 변경사항 없이 저장 클릭 시 불필요한 API 호출이 방지되는가?

### 7.9 삭제 기능
- [ ] 삭제 버튼 클릭 시 confirm 다이얼로그가 표시되는가?
- [ ] 대메뉴 삭제 시 "하위 메뉴도 함께 삭제됩니다" 경고가 표시되는가?
- [ ] 하위메뉴 삭제 시 해당 메뉴명만 표시되는가?
- [ ] confirm에서 취소 클릭 시 삭제가 취소되는가?
- [ ] 삭제 성공 시 "메뉴가 삭제되었습니다." 토스트가 표시되는가?
- [ ] 삭제 성공 시 selectedMenu가 초기화되는가?
- [ ] 삭제 성공 후 트리가 새로고침되는가?
- [ ] 메뉴 관리 메뉴 자체 삭제 시도 시 차단되는가?

### 7.10 메뉴 추가 모달 (MenuAddModal)
- [ ] 추가 버튼 클릭 시 모달이 열리는가?
- [ ] 모달 열릴 때 입력값이 초기화되는가?
- [ ] 상위 메뉴 select에 현재 탭의 대메뉴 목록이 표시되는가?
- [ ] "없음 (대메뉴)" 선택 시 parentId가 null로 설정되는가?
- [ ] 메뉴명 빈 값일 때 추가 버튼이 disabled되는가?
- [ ] 메뉴명 입력 후 Enter 키로 추가가 가능한가?
- [ ] Escape 키로 모달이 닫히는가?
- [ ] 배경 클릭으로 모달이 닫히는가?
- [ ] 입력값이 있는 상태에서 배경 클릭 시 confirm이 뜨는가?
- [ ] 추가 성공 시 "'{name}' 메뉴가 추가되었습니다." 토스트가 표시되는가?
- [ ] 추가 성공 시 모달이 닫히고 입력값이 초기화되는가?
- [ ] 추가 성공 후 트리가 새로고침되는가?
- [ ] 추가 중 중복 클릭이 방지되는가 (isSubmitting)?
- [ ] 3depth 하위메뉴 추가 시도 시 차단되는가?
- [ ] BO 탭에서 추가한 메뉴가 BO에만 나타나는가?
- [ ] FO 탭에서 추가한 메뉴가 FO에만 나타나는가?

### 7.11 역할별 권한 (MenuRoleMatrix)
- [ ] 메뉴 선택 시 역할별 권한 매핑이 조회되는가?
- [ ] 각 역할의 체크박스 상태가 올바르게 표시되는가?
- [ ] 체크박스 변경 시 즉시 API 호출이 되는가 (낙관적 업데이트)?
- [ ] API 성공 시 체크 상태가 유지되는가?
- [ ] API 실패 시 체크 상태가 롤백되는가?
- [ ] API 실패 시 에러 토스트가 표시되는가?
- [ ] 역할명과 역할 코드(font-mono)가 함께 표시되는가?
- [ ] 접근 권한이 있는 역할의 체크박스 테두리가 강조되는가?

### 7.12 에러 핸들링
- [ ] API 400 에러 시 에러 토스트가 표시되는가?
- [ ] API 401 에러 시 로그인 페이지로 리다이렉트되는가?
- [ ] API 403 에러 시 "접근 권한이 없습니다." 토스트가 표시되는가?
- [ ] API 404 에러 시 에러 토스트 + 트리 새로고침이 되는가?
- [ ] API 409 에러 시 중복 메시지가 토스트 + 필드 에러로 표시되는가?
- [ ] API 500 에러 시 "서버 오류" 토스트가 표시되는가?
- [ ] 네트워크 에러 시 "네트워크 연결을 확인해주세요." 토스트가 표시되는가?

### 7.13 보안 및 방어적 설계
- [ ] XSS 문자(`<`, `>`, `"`, `'`) 입력이 차단되는가?
- [ ] 저장/추가/삭제 시 중복 클릭이 방지되는가?
- [ ] 편집 중 페이지 이탈(브라우저 닫기, 뒤로가기) 시 beforeunload 경고가 뜨는가?
- [ ] ADMIN 역할이 아닌 사용자가 접근 시 차단되는가?

### 7.14 UI/UX 일관성
- [ ] 로딩 스피너 디자인이 프로젝트 표준과 일치하는가?
- [ ] 토스트 메시지 위치가 프로젝트 표준과 일치하는가?
- [ ] 버튼 스타일(primary/secondary/danger)이 프로젝트 표준과 일치하는가?
- [ ] 입력 필드 에러 시 빨간 테두리 + 에러 메시지가 필드 하단에 표시되는가?
- [ ] 선택된 트리 노드 스타일이 시각적으로 명확한가?
- [ ] 반응형 레이아웃이 적용되어 있는가? (최소 1280px 이상)

### 7.15 상태 관리 및 데이터 흐름
- [ ] zustand store의 모든 action이 올바르게 동작하는가?
- [ ] 트리 빌더(buildTree)가 sortOrder 기준으로 정렬하는가?
- [ ] selectedMenu 변경 시 roleMenuMappings가 재조회되는가?
- [ ] 목 데이터(MOCK_MENUS 등)가 완전히 제거되고 API로 대체되었는가?
- [ ] API 응답 데이터가 올바르게 트리 구조로 변환되는가?

### 7.16 코드 품질
- [ ] `tsc --noEmit` 실행 결과 신규 에러가 없는가?
- [ ] 하드코딩된 문자열(에러 메시지 등)이 상수로 관리되는가?
- [ ] 불필요한 console.log가 제거되었는가?
- [ ] 컴포넌트 props 타입이 명시적으로 정의되었는가?
- [ ] useEffect 의존성 배열이 올바르게 설정되었는가?
- [ ] 메모리 누수(unmount 시 cleanup)가 처리되었는가?
