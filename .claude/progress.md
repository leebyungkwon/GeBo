# 프로젝트 진행 현황 (Bo 백오피스)

> 마지막 업데이트: 2026-03-29 (Database > Entity 페이지 + 메뉴 등록 완료)

---

## 프로젝트 구조

- **FE**: `bo/` — Next.js 15 (App Router, Turbopack), Port 3002
- **BE**: `bo-api/` — Spring Boot 3 (JPA, PostgreSQL), Port 8002
- **DB**: PostgreSQL 16, `bo` 데이터베이스

---

## 완료된 작업

### 1. 페이지 메이커 공통코드 연동
- `SearchFieldConfig`에 `codeGroupCode` 필드 추가
- select/radio/checkbox 필드 추가 시 "공통코드" 모드 선택 가능
- 공통코드 미존재 시 더미 옵션 표시 버그 수정

### 2. 페이지 템플릿 BE 구현 (신규)
- 엔티티: `PageTemplate` (id, name, slug, description, configJson, collapsible, filePath)
- API: `GET /api/v1/page-templates`, `GET /{id}`, `GET /by-slug/{slug}`, `POST`, `PUT /{id}`, `DELETE /{id}`
- `PageTemplateFileService`: TSX 파일 쓰기/삭제, 경로 traversal 방어
- `application.yml`: `page-template.output-dir: "../bo/src/app/admin/generated"`
- ErrorCode 추가: `PAGE_TEMPLATE_NOT_FOUND`, `PAGE_TEMPLATE_NAME_DUPLICATE`, `PAGE_TEMPLATE_SLUG_DUPLICATE`, `PAGE_TEMPLATE_FILE_ERROR`

### 3. 페이지 메이커 저장/불러오기/생성 버튼
- **저장**: configJson만 DB 저장 (tsxCode 없음) → POST/PUT `/page-templates`
- **불러오기**: 저장된 템플릿 목록 → 선택 시 configJson 복원
- **생성**: `buildTsxFile()`로 완전한 React 컴포넌트 생성 → BE 파일 쓰기
- 페이지명 입력 → `toSlug()` 자동 slug 생성 (한글은 `page-{timestamp}`)
- `varName()` 버그 수정: 숫자 시작 label → `field_` prefix 추가

### 4. TSX 파일 생성 (`buildTsxFile` 함수)
- `'use client'` + import + `export default function GeneratedPage()` 포함한 완전한 컴포넌트 생성
- 필요한 lucide-react 아이콘만 선택적 import
- 공통코드 연동 필드 존재 시 `useCodeStore` import 자동 포함
- 기존 `currentCode`(코드 조각)는 프리뷰용으로 유지, 파일 생성은 `buildTsxFile` 사용

### 5. 동적 라우트 페이지 (`[slug]/page.tsx`)
- 경로: `bo/src/app/admin/generated/[slug]/page.tsx`
- slug로 BE API 조회 → configJson 파싱 → 검색폼 + 테이블 동적 렌더링
- Next.js 15 `params` Promise 처리: `React.use(params)` 사용
- `useCodeStore`로 공통코드 연동 필드 처리
- TSX 파일 없으면 이 파일이 폴백으로 동작

### 6. 메뉴-템플릿 연동 (`MenuDetail.tsx`)
- URL 필드 옆 "페이지 메이커 연동" 버튼
- 저장된 템플릿 목록 드롭다운 → 선택 시 URL 자동 입력 (`/admin/generated/{slug}`)

### 7. 브레드크럼 메뉴명 반영
- `useMenuStore`에 `navMenus` + `fetchNavMenus()` 추가 (사이드바/헤더 전용 BO 메뉴)
- `Sidebar.tsx`: 로컬 state → `useMenuStore.navMenus` 사용
- `Header.tsx`: URL 세그먼트 방식 → 메뉴 트리 재귀 탐색으로 메뉴명 표시
- `[slug]/page.tsx`: `<h1>` 제목을 메뉴명 우선으로 표시 (`menuName || templateName`)

### 17. Database > Entity 페이지 (FE 완료 + 메뉴 등록)

- **페이지**: `bo/src/app/admin/database/entities/page.tsx` (신규 생성)
  - 구조: Database > Tables 페이지와 완전 동일 패턴 (2단 레이아웃)
- **기존 구현 확인**: BE(Controller/Service/DTO), FE(Store/Component) 모두 이미 구현되어 있었음
  - `DatabaseController` — `GET /api/v1/database/entities`, `GET /api/v1/database/entities/{entityName}/fields`
  - `DatabaseService` — JPA `EntityManagerFactory.getMetamodel()` 기반 런타임 메타데이터 조회
  - `EntityInfoResponse`, `FieldInfoResponse` record DTO
  - `useEntityStore.ts` — Zustand 스토어 (useDatabaseStore와 동일 패턴)
  - `EntityList.tsx`, `EntityFields.tsx` 컴포넌트
- **DataInitializer** — `initDatabaseMenu()` 추가:
  - DATABASE 카테고리 → Database 그룹 → Table(`/admin/database/tables`) + Entity(`/admin/database/entities`)
  - SUPER_ADMIN 역할에 메뉴 권한 자동 부여, 멱등성 보장

### 16. Make > Layer DB 연동 (List와 동일 패턴 통일)

- **`layer/page.tsx`** 업데이트:
  - `useDatabaseStore` import 추가 (tables, selectedTable, selectTable, isDbLoading, isColumnsLoading, fetchTables)
  - `SYSTEM_COLUMNS` 상수 추가 (List와 동일)
  - `dataSource: 'json' | 'db'` + `dbTableSearch` state 추가
  - 템플릿 목록 로딩: on-demand(async) → 마운트 시 자동 로드(`useEffect` 1회) 로 변경 (List와 동일)
  - `toggleTemplateDropdown`: async → 단순 토글 함수로 변경
  - `layerTypeTemplates`: `templateList.filter(t => t.templateType === 'LAYER')` 필터 변수 추가
  - 드롭다운에서 `templateList` → `layerTypeTemplates` 교체
  - **데이터 소스 탭 UI** 추가 (공통(JSON) | DB 연동) — List와 동일 디자인
  - **DB 테이블 선택 패널** 추가: 검색 + 목록 + "자동 적용" 버튼 — List와 동일 디자인
  - `handleDbAutoApply`: DB 컬럼 → Layer 폼 필드 자동 생성 (PK/시스템컬럼 제외, 2칸 row 패킹)
    - boolean/tinyint(1) → select, datetime/timestamp → date, text/longtext → textarea(rowSpan=2), 나머지 → input

### 15. 페이지 메이커 — rowSpan 지원 + Row 접기/펼치기

- **Layer 페이지 메이커** (`layer/page.tsx`):
  - `LayerFieldConfig`에 `rowSpan?: 1|2|3` 추가
  - `FIELD_TYPES`에 `defaultRowSpan` 추가 (textarea=2, 나머지=1)
  - 필드 추가 다이얼로그 + 편집 패널에 **ColSpan / RowSpan** 선택 UI 추가
  - 프리뷰 + 생성 TSX에 `gridRow: span N` 반영
  - 필드 목록 뱃지: `C×2`, `R×2` 형식 표시
- **List/Layer 공통** — Row 접기/펼치기:
  - `RowHeader` 컴포넌트에 `collapsed?`, `onToggleCollapse?` props 추가
  - 헤더 클릭 → 접기/펼치기, 버튼 영역은 `stopPropagation`
  - `collapsedRows: Set<string>` state + `toggleRowCollapse` 함수
  - List/Layer 양쪽 모두 적용 완료

---

### 9. 레이어 팝업 빌더 (PDD 8단계 완료)

- **페이지**: `bo/src/app/admin/templates/make/layer/page.tsx`
- **팝업 유형**: 중앙 팝업(center) / 우측 드로어(right) — 헤더 탭 전환
- **빌더 기능**: 행 추가/삭제/이동 + 6가지 필드(input/select/textarea/date/radio/checkbox) 추가/편집/삭제/이동
- **저장**: configJson만 DB 저장 → POST/PUT `/api/v1/page-templates`
- **불러오기**: 저장된 템플릿 목록 → LAYER 타입만 필터링 (`templateType === 'LAYER'`)
- **생성**: `buildLayerTsx()`로 TSX 컴포넌트 생성 → BE 파일 쓰기 (tsxCode 포함)
- **미리보기**: CenterPreview / RightPreview 컴포넌트 (인터랙티브) + 저장 버튼 required 검증
- **공통코드 연동**: select/radio/checkbox 필드에 "수동 입력 | 공통코드" 탭 — List 페이지와 동일 패턴
- **코드 뷰**: 생성 TSX 코드 실시간 표시 + 클립보드 복사, 공통코드 필드 시 `useCodeStore` import 자동 포함
- **UI**: Make > List 페이지와 통일성 있는 레이아웃 (grid 2열, pill 탭, dashed 빈 상태)
- **PDD 문서**: `docs/pages/layer/fe_layer.md`, `docs/pages/layer/be_layer.md`
- **수정**: `Sidebar.tsx` TS 오류 3개 수정 (optional chaining 적용)

### 10. PDD 워크플로우 규칙 강화

- `CLAUDE.md` 규칙 11 추가: 신규 파일 생성 전 기존 파일 참조 의무
- `.plugin/agent/pdd/workflow_guide.md` 3.4 퍼블리싱 단계에 기존 파일 참조 필수 규칙 추가 (3개 항목)

### 11. 페이지 메이커 공통체계 리팩터링 (Rule 9)

- **목표**: list/page.tsx ↔ layer/page.tsx UI 불일치 10개 해소, 코드 중복 제거
- **공통 모듈 신규 생성** (`make/_shared/`):
  - `styles.ts`: `inputCls`, `selectCls`, `btnPrimary`, `btnSecondary`
  - `types.ts`: `CodeGroupDef`, `TemplateItem`
  - `utils.ts`: `parseOpt`, `needsOptions`, `varName`, `toSlug`, `createIdGenerator`
  - `components/SelectArrow.tsx`: SVG 화살표 아이콘
  - `components/RowHeader.tsx`: Row N 라벨 + 열 수 탭 + 이동/삭제 버튼
  - `components/OptionInputRows.tsx`: text:value 옵션 행 입력 (stringsToOpts/optsToStrings 유틸 포함)
  - `components/CodeGroupSelector.tsx`: 공통코드 그룹 선택 드롭다운
  - `components/ValidationSection.tsx`: 필수항목 토글 + input/checkbox Validation 입력
  - `components/FieldPickerTypeList.tsx`: 필드 유형 선택 목록
  - `components/TemplateModals.tsx`: SaveModal / LoadModal / GenerateModal
- **layer/page.tsx 리팩터링**: 위 공통 모듈 적용, 로컬 중복 정의 제거, 모달 교체, UI 통일
- **list/page.tsx 리팩터링**: 동일하게 공통 모듈 적용, RowHeader/FieldPickerTypeList/CodeGroupSelector/OptionInputRows/ValidationSection/모달 교체
- TypeScript 컴파일 오류 없음 (tsc --noEmit EXIT:0)

### 12. 페이지 메이커 List — 불러오기 드롭다운 + 팝업 미리보기 연동

- **불러오기 UI 변경**: 상단 툴바 "불러오기" 버튼 제거 → 설정 패널 상단 드롭다운 selectbox로 교체
  - 마운트 시 자동 로드 (`useEffect` → `GET /page-templates`)
  - LIST 타입 템플릿만 필터링
  - 각 항목에 인라인 수정(이름/slug) + 삭제 기능
- **slug/설명 미리채움 버그 수정**: 수정 모달 열 때 기존 slug·description이 비워지던 문제 수정
  - `handleSaveOpen`: `currentTemplateId` 없을 때만 slug/desc 초기화
  - `handleLoadSelect`: `setSaveModalDesc(tpl.description || '')` 추가
- **`TemplateItem` 타입 수정**: `description?: string` 필드 추가 (`_shared/types.ts`)
- **`buildTsxFile` 팝업 코드 생성 완료**:
  - actions 컬럼에 `editPopupSlug` / `detailPopupSlug` 있으면 `LayerPopupRenderer` import 자동 추가
  - `popupOpen`, `popupSlug`, `popupData` state 생성
  - 버튼 onClick 핸들러 → `setPopupSlug(...); setPopupData(row); setPopupOpen(true)`
  - `<LayerPopupRenderer>` JSX 렌더링 포함
- **미리보기 팝업 즉시 오픈**:
  - `list/page.tsx`에 `LayerPopupRenderer` import 추가
  - `previewPopupOpen`, `previewPopupSlug` state 추가
  - 미리보기 수정/상세 버튼에 popup slug 연결 시 클릭하면 즉시 팝업 오픈
- **DB 저장 렌더러 (`[slug]/page.tsx`) 현황**:
  - 검색폼 + 테이블 헤더는 configJson으로 동적 렌더링 ✅
  - 테이블 데이터 CRUD API 연동 완료 ✅ (항목 13 참조)

### 13. 페이지 메이커 동적 렌더러 CRUD API 연동

- **`bo/src/app/admin/generated/[slug]/page.tsx`** 업데이트:
  - `fetchData(page, sv?, cfg?)`: `GET /api/v1/page-data/{slug}` 호출, 검색 파라미터/페이지 전달
  - 초기 진입 시 자동 데이터 로드 (config 파싱 완료 후 `fetchData(0, {}, cfg)`)
  - 검색폼 onSearch → `fetchData(0)`, 초기화 → `fetchData(0, {})`
  - 테이블 tbody: 로딩 스피너 → 데이터 없음 → 데이터 행 동적 렌더링
  - `renderCell()`: text/badge/boolean/actions 셀 타입별 렌더링
  - 수정 버튼: register 버튼의 popupSlug 재사용, editId + editRowData 전달
  - 삭제 버튼: confirm 후 `DELETE /api/v1/page-data/{slug}/{id}` → 목록 새로고침
  - 페이지네이션: 현재 페이지 중심 최대 5개 번호 + 이전/다음 버튼
  - 전체 건수(totalElements) 테이블 상단 표시

- **`bo/src/components/layer/LayerPopupRenderer.tsx`** 업데이트:
  - Props 추가: `listSlug?`, `editId?`, `onSaved?`
  - `handleSave()`: fieldKey 기준으로 dataJson 구성 → POST(신규)/PUT(수정) 자동 분기
  - `layerButtons`: configJson에 있으면 그대로, 없으면 DEFAULT_LAYER_BUTTONS(닫기/저장) 사용
  - 버튼 타입 5종(primary/secondary/blue/success/danger) 지원
  - 저장 중 버튼 비활성화 + "저장 중..." 텍스트

- **SearchFieldConfig에 `accessor?` 필드 추가**: 검색 API 파라미터 키 설정용
  - accessor 미설정 필드는 검색 파라미터에서 제외 (한글 label 등 방어)

### 8. 보안/인증 수정
- `SecurityConfig`: 미인증 요청 시 403 → 401 반환 (`authenticationEntryPoint` 추가)
- FE 인터셉터(`api.ts`)가 401 감지 → Refresh Token 갱신 → 자동 로그인 리다이렉트 정상 동작

---

### 14. Database > Table 조회 페이지 (FE+BE 완료)

- **페이지**: `bo/src/app/admin/database/tables/page.tsx`
- **컴포넌트**: `bo/src/components/database/TableList.tsx` (좌측), `bo/src/components/database/TableColumns.tsx` (우측)
- **스토어**: `bo/src/store/useDatabaseStore.ts` (테이블 목록 + 컬럼 캐시)
- **BE**: `DatabaseController` → `DatabaseService` (JdbcTemplate + information_schema 직접 쿼리)
- **API**: `GET /api/v1/database/tables`, `GET /api/v1/database/tables/{tableName}/columns`
- **메뉴**: Database > Table (id=42, `/admin/database/tables`)
- **특이사항**: 단순 읽기 전용, JPA 엔티티 없이 JdbcTemplate 사용

---

## 현재 DB 상태

```sql
-- page_template 테이블
id=1, name='테스트페이지', slug='1'
id=2, name='page-1774335482868', slug='page-1774335482868'

-- menu 테이블 (테스트 카테고리)
id=35, name='테스트', is_category=true (수동 수정됨)
  └─ DB저장페이지 → /admin/generated/1
  └─ 생성페이지   → /admin/generated/page-1774335482868
```

---

## 아키텍처 결정 사항

### DB 렌더 vs TSX 파일 생성

| | DB 저장 방식 | TSX 파일 생성 방식 |
|---|---|---|
| 사용자 | 운영자/기획자 | 개발자 |
| 목적 | 빠른 페이지 운영 | 코드 기반 커스터마이징 |
| 반영 | 즉시 | git 커밋 → 빌드 배포 |
| WAS 다중화 | ✅ 문제없음 | ❌ 파일시스템 공유 필요 |
| next build 필요 | ❌ 불필요 | ✅ 운영환경에서 필요 |

**결론**: 운영은 DB 렌더 방식, TSX 생성은 개발자 보일러플레이트 용도

---

## 주요 파일 위치

| 파일 | 역할 |
|---|---|
| `bo/src/app/admin/templates/make/list/page.tsx` | 페이지 메이커 List (저장/불러오기/생성 버튼 포함) |
| `bo/src/app/admin/templates/make/layer/page.tsx` | 레이어 팝업 빌더 (중앙 팝업 / 우측 드로어) |
| `docs/pages/layer/fe_layer.md` | 레이어 팝업 빌더 FE 설계서 |
| `docs/pages/layer/be_layer.md` | 레이어 팝업 빌더 BE 설계서 |
| `bo/src/app/admin/generated/[slug]/page.tsx` | DB configJson 기반 동적 렌더러 |
| `bo/src/components/menus/MenuDetail.tsx` | 메뉴 관리 + 페이지 메이커 연동 |
| `bo/src/store/useMenuStore.ts` | 메뉴 상태 + navMenus (브레드크럼용) |
| `bo/src/components/layout/Header.tsx` | 브레드크럼 (메뉴 트리 재귀 탐색) |
| `bo/src/components/layout/Sidebar.tsx` | 사이드바 (navMenus 사용) |
| `bo-api/.../PageTemplateController.java` | 페이지 템플릿 CRUD API |
| `bo-api/.../PageTemplateService.java` | DB + 파일 이중 저장 로직 |
| `bo-api/.../PageTemplateFileService.java` | TSX 파일 쓰기/삭제 |
| `bo-api/.../SecurityConfig.java` | 401 반환 설정 |


## 해당 workflow도 체크
\docs\guide\page-maker-workflow.md
