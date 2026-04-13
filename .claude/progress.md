# 프로젝트 진행 현황 (Bo 백오피스)

> 마지막 업데이트: 2026-04-10 (방식 B — 개발자방식 List Builder generator 작업 진행중, 검증 미완료)

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

---

### 19. 레이어 팝업 빌더 — 파일 업로드 필드 타입 추가 (FE + BE 설계 + BE 개발 완료)

- **FE 구현** (`layer/page.tsx`):
  - `LayerFieldType`에 `'file'` 추가
  - `LayerFieldConfig`에 5개 신규 필드 추가 (`maxFileCount`, `maxFileSizeMB`, `maxTotalSizeMB`, `fileTypeMode`, `allowedExtensions`)
  - `FIELD_TYPES` 배열에 file 항목 추가 (defaultColSpan: 2)
  - `FILE_TYPE_PRESETS` 상수 + `getAcceptString()` 함수 추가
  - `ExtensionTagInput` 공통 컴포넌트 추가 (편집 패널용)
  - 필드 추가 다이얼로그 + 인라인 편집 패널에 file 전용 설정 UI 추가
  - `FieldPreview`에 file 미리보기 (드롭존 UI) 추가
  - `buildFieldsJsx()` + `buildLayerTsx()`에 file 코드 생성 로직 추가
  - `npx tsc --noEmit` EXIT:0 확인
- **BE 설계 문서**:
  - `docs/db/layer/db_layer_file-upload.md` — `page_file` 테이블 신규 설계
  - `docs/pages/layer/be_layer_file-upload.md` — 파일 업로드/다운로드/삭제/연결 API 4개 설계
- **BE 구현** (`bo-api`):
  - `ErrorCode` enum — `FILE_REQUIRED`, `FILE_EMPTY`, `FILE_NOT_FOUND`, `FILE_UPLOAD_FAILED` 4개 추가
  - `application.yml` — `file.upload-root: /uploads`, multipart 50MB/200MB 설정 추가
  - `PageFile.java` — 엔티티 신규 작성 (`page_file` 테이블 매핑)
  - `PageFileResponse.java` — 업로드/조회 응답 DTO
  - `PageFileLinkRequest.java` — data_id 연결 요청 DTO
  - `PageFileRepository.java` — `findByDataId`, `findByDataIdAndFieldKey` 쿼리 메서드
  - `PageFileService.java` — 업로드/다운로드/link/삭제/연관파일 일괄삭제
  - `PageFileController.java` — 4개 엔드포인트: POST/GET/PATCH/DELETE
  - `PageDataService.delete()` — 연관 `page_file` 먼저 삭제 후 `page_data` 삭제
  - `./gradlew build` BUILD SUCCESSFUL, 체크리스트 28항목 전수 ✅
  - **추가 개선 (LayerPopupRenderer.tsx)**:
    - 파일 필드 readonly 지원: 드롭존·새 파일 목록·X버튼 숨김
    - 기존 파일 파일명 클릭 → Blob URL 방식 다운로드 (`GET /api/page-files/{id}`)
    - 기존 파일 메타데이터 조회 API 추가 (`GET /api/page-files/meta?ids=...`)
    - 수정 모드에서 이름 변경 시 slug 자동갱신 방지 (`TemplateModals.tsx`)
    - 드래그&드롭 + 파일 타입 검증 + modeLabel 실제 확장자 목록 표시
    - fieldKey 필수 강제 (`layer/page.tsx`) — 파일 필드 2개 이상 시 키 충돌 방지
    - Windows file.transferTo() 버그 → Files.copy(InputStream) NIO 방식으로 수정 (`PageFileService.java`)

### 23. 페이지 메이커 — 방식 B (생성 방식) DB 저장 분리

- **핵심 변경**: [생성] 버튼이 DB에 저장하지 않고 파일만 생성하도록 수정
- **BE 신규**:
  - `PageTemplateGenerateRequest.java` — 파일 생성 전용 DTO (slug, tsxCode, templateType)
  - `PageTemplateService.generateFile()` — DB 저장 없이 파일만 쓰기 + pageUrl 반환
  - `PageTemplateController` — `POST /api/v1/page-templates/generate` 엔드포인트 추가
- **FE 수정**:
  - `list/page.tsx` `handleGenerateConfirm`: 기존 `/page-templates` 저장 → `/page-templates/generate` 호출로 변경
  - `layer/page.tsx` `handleGenerateConfirm`: 동일하게 `/page-templates/generate` 호출로 변경
  - `buildTsxFile` 내 `LayerPopupRenderer`(DB 의존) → `LayerPopup.tsx` 직접 import로 변경
    - 생성된 파일이 런타임 DB 의존 없이 동작
    - state: `popupEditId`, handler: edit=`setPopupEditId(row.id)`, detail=`setPopupData(row)`
    - JSX: `<LayerPopup onSave={async (data) => { ... }}>`  직접 API 호출
- **방식 구분 명확화**:
  - 방식 A (DB 저장): [저장/수정] → DB configJson 저장 → `[slug]/page.tsx` 공통 렌더러 → LayerPopupRenderer
  - 방식 B (파일 생성): [생성] → 파일만 생성 → `{slug}/page.tsx` 직접 코드 → LayerPopup.tsx 직접 import
- **가이드 문서**: `docs/guide/builder-guide.md` 방식 B 섹션 전면 재작성

### 22. 페이지 메이커 List — 엑셀 다운로드 기능

- **흐름**: 엑셀 버튼 클릭 → FE fetch → BE `/export` API → 전체 데이터 조회 → xlsx/csv 파일 생성 → 브라우저 자동 다운로드
- **검색 조건 유지**: 현재 화면 필터가 적용된 상태로 전체 다운로드
- **포맷 선택**: 버튼 설정 UI에서 Excel(.xlsx) / CSV(.csv) 선택 가능

**BE 신규/수정 파일:**
- `ExcelService.java` (신규) — 공통 엑셀/CSV 생성 서비스 (`buildXlsx()`, `buildCsv()`)
  - Apache POI 5.3.0 사용, UTF-8 BOM 포함 CSV로 한글 깨짐 방지
  - 다른 기능에서도 `excelService.buildXlsx(headers, keys, rows, sheetName)` 형태로 재사용 가능
- `PageDataService.java` — `exportAll()` 추가: LIMIT/OFFSET 없는 전체 조회
- `PageDataController.java` — `GET /{slug}/export?format=xlsx&headers=...&keys=...` 엔드포인트 추가
- `build.gradle` — Apache POI 의존성 추가 (`poi-ooxml:5.3.0`)

**FE 수정 파일:**
- `_shared/types.ts` — `ButtonConfig`에 `excelFormat?: 'xlsx' | 'csv'` 필드 추가
- `list/page.tsx` — 버튼 설정 UI에 파일 형식 셀렉트 추가 + `buildTsxFile` excel 코드 생성 실제 구현
- `[slug]/page.tsx` — `handleExcelDownload()` 함수 구현 (fetch → Blob → 브라우저 다운로드)

**설계 문서**: `docs/pages/page-data/be_page-data_excel.md`

### 20. Layer Popup Builder — DnD 전면 재설계

- **`useSortableRows.ts`** 완전 재작성:
  - **collision detection field/row 완전 분리**: field drag 시 row id 제외, row drag 시 field id 제외
    - 기존 `closestCenter`가 row/field 혼합 반환하던 문제 원천 차단
  - **`activeContainerIdRef`** 추가: cross-row 이동 후 React re-render 전 stale containerId 참조 방지 (ping-pong 방지)
  - **`crossRowMovedRef`** 추가: cross-row 이동 완료 후 handleDragEnd에서 same-row 재정렬 중복 실행 방지
  - **`RC_PREFIX = 'rc-'`** export: inner SortableContext id prefix 상수화
  - `useCallback([rowIds])` + `useMemo([fieldRows])`로 collision detection 함수 최신값 유지

- **`DndWrappers.tsx`** 업데이트:
  - `SortableRowWrapper` / `SortableFieldWrapper` — `data: { type: 'row' | 'field' }` 명시 추가
  - `setActivatorNodeRef`를 handleProps.ref로 전달 → grip handle 이외 영역에서 drag 불가
  - **`EmptyFieldDropZone`** 컴포넌트 추가: 빈 행에 필드 드래그 가능하도록 지원 (useDroppable 기반)

- **`layer/page.tsx`** 업데이트:
  - `EmptyFieldDropZone` import 추가 (빈 행 UI에 적용)
  - `closestCenter` import 제거 (useSortableRows로 이전)
  - **팝업 너비 확장**: `LAYER_WIDTH_MAP` — md=`max-w-2xl`, lg=`max-w-3xl`, xl=`max-w-4xl`
  - `findDuplicateKeys` import 추가 (fieldKey 중복 검사 강화)

### 21. 버그 수정

- **`TemplateModals.tsx`** — 수정 모드에서 이름 변경 시 slug 자동갱신 방지
  - 기존: `toSlug` 제공 시 항상 slug 자동갱신
  - 수정: `!isEdit` 조건 추가 → 신규 저장 모드에서만 slug 자동갱신, 수정 모드에서는 기존 slug 유지

- **`utils.ts`** — `findDuplicateKeys` 유틸 함수 추가
  - fieldKey 목록 중 중복된 값만 추출하여 반환
  - 파일 필드 2개 이상 등록 시 키 충돌 사전 방지용

### 24. 방식 B (개발자방식) — List Builder generator 작업 (미완성·진행중)

> **이 작업의 핵심 의도**: List Builder로 TSX 파일을 직접 생성하고, 메뉴에 slug를 등록하면 자동으로 CRUD가 동작하는 "개발자방식(방식 B)" 워크플로우를 만드는 것.
>
> ⚠️ **실제 상태**: generator 일부 버그 수정 및 기능 추가 작업을 했으나, 생성된 TSX 파일의 동작 검증이 충분히 되지 않아 **미완성**. 다음 대화에서 이어서 진행 필요.

---

#### ■ 개발자방식(방식 B) 워크플로우 전체 흐름

```
1. List Builder 화면 설정
   - 검색 필드 구성 (타입/타이틀 등)
   - 테이블 컬럼 구성
   - 버튼 및 actions 컬럼에 팝업 연결 설정
     - 관리자방식: DB slug (LayerPopupRenderer 사용)
     - 개발자방식: 로컬 파일명 (POPUP_MAP 직접 import)

2. TSX 파일 생성 모달
   - 폴더명 입력 (예: board2)
   - 파일명 입력 (예: page) → generated/board2/page.tsx 생성

3. 메뉴 관리 등록
   - 메뉴 URL: /admin/generated/board2
   - 메뉴 slug: board2 (page-data API 식별자)
   → slug가 없으면 데이터 조회 안 됨 (toast 경고)

4. 브라우저에서 해당 메뉴 진입
   - menuSlug가 navMenus에서 URL 매칭으로 자동 탐색
   - GET /api/v1/page-data/{slug} 호출 → 목록 표시
```

---

#### ■ buildTsxFile generator 코드 추가 작업 (list/page.tsx) — 검증 미완료

**추가된 생성 코드:**
- `findMenuSlug()` 함수: 메뉴 트리에서 현재 URL → slug 재귀 탐색
- `POPUP_MAP`: 개발자방식 로컬 파일 연결 (`{ '파일명': 컴포넌트 }`)
- `menuSlug` 선언: `usePathname` + `useMenuStore.navMenus` + `findMenuSlug` 조합
- `tablePopup` state: `{ type: 'slug' | 'path'; value: string; editId?: number }`
- `activePopup` state: `{ type: 'slug' | 'path'; value: string }`
- `fetchData(page, notify?)`: `GET /page-data/{menuSlug}` 실제 API 호출
- `useEffect([menuSlug])`: navMenus 로드 완료 후 자동 재실행 (타이밍 버그 방지)
- `handleButtonClick(action, popupType, popupValue)`: 등록 버튼 → 팝업 오픈
- 삭제 버튼: `api.delete('/page-data/' + menuSlug + '/' + id)` + `fetchData(0)` 재조회
- 팝업 렌더링 4종: tablePopup slug/path + activePopup slug/path

**버튼/actions 컬럼에 팝업 연결 옵션 추가 (빌더 UI):**
- 등록 버튼: "연결팝업(관리자방식)" 또는 "연결경로(개발자방식)" 입력 선택
- actions 컬럼 수정/상세 버튼: 동일하게 slug 또는 로컬 파일명 설정 가능
- `ColumnConfig` 타입에 `editFileLayerSlug`, `detailFileLayerSlug` 추가
- `ButtonConfig` 타입에 `popupSlug`, `fileLayerSlug` 기존 존재 확인 후 활용

---

#### ■ generator 버그 수정 시도 (list/page.tsx buildTsxFile)

생성된 TSX 파일에 문법 오류가 있었음. 수정 시도했으나 실제 동작 검증은 미완료:

| 버그 | 원인 | 수정 |
|---|---|---|
| `data.map` 닫기 오류 | `)}` → `))}`  | `lines.push(`${ind(7)}))`  + `}`)` |
| IIFE 닫기 오류 | `)()}` → `})()}` | tablePopup/activePopup path 팝업 렌더링 2곳 |
| return 다중 루트 | Fragment 없음 | `<>` / `</>` 추가 (line 841, 1125) |
| `fetchData(currentPage)` | `currentPage` 미정의 | `fetchData(0)` 로 수정 |
| `hasMore` 항상 true | `last` 필드 없음 | `setHasMore(page < (res.data.totalPages - 1))` |

---

#### ■ TSX 생성 모달 — 폴더/파일명 분리 입력

**변경 전**: 폴더명만 입력 → `generated/{폴더}/page.tsx` (파일명 고정)

**변경 후**: 폴더명 + 파일명 분리 입력 → `generated/{폴더}/{파일명}.tsx`

```
[폴더명 입력] / [파일명 입력] .tsx
예: board2 / page → generated/board2/page.tsx
예: board2 / ListPage → generated/board2/ListPage.tsx
```

**FE 수정:**
- `TemplateModals.tsx` — `GenerateModal` props에 `fileName`, `onFileNameChange` 추가
- `list/page.tsx` — `generateFileName` state 추가 (기본값: `page`), API에 `fileName` 전달
- `layer/page.tsx` — 동일 (`generateFileName` 기본값: `LayerPopup`)

**BE 수정:**
- `PageTemplateRequest.java` — `fileName` 선택 필드 추가
- `PageTemplateGenerateRequest.java` — `fileName` 선택 필드 추가
- `PageTemplateFileService.java` — `writeFile()` 오버로드: `customFileName` 파라미터 추가
- `PageTemplateService.java` — `generateFile()` 오버로드: `fileName` 전달
- `PageTemplateController.java` — `/generate` 엔드포인트에 `fileName` 전달

---

#### ■ 미완성 / 보류 항목

| 항목 | 상태 | 비고 |
|---|---|---|
| generator 전체 동작 검증 | ❌ 미완성 | 빌더로 TSX 생성 후 실제 페이지가 정상 동작하는지 검증 안 됨 |
| 스크롤 모드 무한스크롤 | ⏸ 보류 | IntersectionObserver + 데이터 append 미구현. 현재는 1페이지만 표시 |
| 팝업 연결 동작 검증 | ❌ 미완성 | 관리자방식(slug)/개발자방식(path) 팝업이 실제로 열리고 저장되는지 미검증 |
| `hasMore` "불러오는 중..." | 🔧 수정 시도 | `totalPages` 기반 hasMore 계산으로 변경했으나 완전 검증 미완 |

> 다음 작업 시작 전 반드시 빌더로 TSX 생성 → 실제 페이지 동작 테스트 먼저 진행할 것

---

#### ■ 핵심 파일 요약

| 파일 | 변경 내용 |
|---|---|
| `bo/src/app/admin/templates/make/list/page.tsx` | generator 전체 개선 + 버그 수정 + 생성 모달 개선 |
| `bo/src/app/admin/templates/make/layer/page.tsx` | 생성 모달 폴더/파일명 분리 |
| `bo/src/app/admin/templates/make/_shared/components/TemplateModals.tsx` | GenerateModal 폴더/파일명 분리 UI |
| `bo-api/.../PageTemplateRequest.java` | fileName 필드 추가 |
| `bo-api/.../PageTemplateGenerateRequest.java` | fileName 필드 추가 |
| `bo-api/.../PageTemplateFileService.java` | writeFile() 오버로드 |
| `bo-api/.../PageTemplateService.java` | generateFile() 오버로드 |

---

### 18. Git 원격 저장소 연동

- **원격 저장소**: `https://github.com/leebyungkwon/GeBo.git`
- **브랜치**: `master`
- **초기 커밋**: 515개 파일, 52,334줄
- **처리 사항**:
  - 루트 `.gitignore` 신규 생성 (node_modules, .env, .plugin 캐시 파일 제외)
  - `bo/.git` 제거 (Next.js 초기 커밋 1개만 있어 이력 손실 없음) → 단일 저장소로 통합
  - `git init` → `git remote add origin` → 최초 커밋 → `git push -u origin master` 완료
