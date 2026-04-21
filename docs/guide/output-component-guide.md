# Output 컴포넌트 가이드

> 경로: `bo/src/app/admin/templates/make/_shared/components/renderer/`
> 마지막 업데이트: 2026-04-17

---

## 목차

1. [개요 — Output 컴포넌트 계층 구조](#1-개요--output-컴포넌트-계층-구조)
2. [⛔ 렌더러 적용 범위 및 인라인 금지 원칙](#2--렌더러-적용-범위-및-인라인-금지-원칙)
3. [RendererMode — preview vs live](#3-renderermode--preview-vs-live)
4. [WidgetRenderer — 최상위 통합 Dispatcher](#4-widgetrenderer--최상위-통합-dispatcher)
5. [SearchRenderer — 검색폼 렌더러](#5-searchrenderer--검색폼-렌더러)
6. [FieldRenderer — 공통 단일 필드 렌더러](#6-fieldrenderer--공통-단일-필드-렌더러)
7. [TableRenderer — 테이블 전체 렌더러](#7-tablerenderer--테이블-전체-렌더러)
8. [TableCellRenderer — 테이블 단일 셀 렌더러](#8-tablecellrenderer--테이블-단일-셀-렌더러)
9. [FormRenderer — 폼 위젯 렌더러](#9-formrenderer--폼-위젯-렌더러)
10. [SpaceRenderer — 공간영역 렌더러](#10-spacerenderer--공간영역-렌더러)
11. [SearchFieldRenderer — re-export (하위 호환)](#11-searchfieldrenderer--re-export-하위-호환)
12. [파일 간 의존관계](#12-파일-간-의존관계)
13. [핵심 설계 원칙](#13-핵심-설계-원칙)
14. [새 위젯 타입 추가 방법](#14-새-위젯-타입-추가-방법)

---

## 1. 개요 — Output 컴포넌트 계층 구조

Output 컴포넌트(렌더러)는 빌더에서 구성한 위젯 설정값을 **화면에 실제로 그리는** 역할을 합니다.
빌더의 미리보기(preview)와 실제 서비스 페이지(live) 모두 **동일한 렌더러 컴포넌트를 재사용**합니다.

```
WidgetRenderer                         ← 위젯 타입별 Dispatcher (최상위)
│
├── SearchRenderer                     ← 검색폼 전체 렌더러 (행 + 필드 구조)
│   ├── SearchForm / SearchRow / SearchField  (@/components/search — 공통 UI)
│   └── FieldRenderer                  ← 단일 필드 렌더러 (Search + Form 공통)
│
├── TableRenderer                      ← 테이블 전체 렌더러 (헤더 + 바디 + 페이지)
│   └── TableCellRenderer             ← 단일 셀 렌더러 (타입별 분기)
│
├── FormRenderer                       ← 폼 위젯 렌더러 (CSS Grid)
│   └── FieldRenderer                  ← 단일 필드 렌더러 (재사용)
│
└── SpaceRenderer                      ← 공간영역 렌더러 (Text / Button 아이템)
```

**핵심 원칙 (Core Principles):**
- **Generator-Renderer Separation**: 코드 생성 로직(Generator)은 설정을 TSX 문자열로 변환하는 '순수 함수'로 존재하며, 이를 페이지에 그리는 로직(Renderer)과 엄격히 분리합니다.
- **Consistent Output Pattern**: 모든 생성된 코드는 동일한 `WidgetRenderer`를 경유하도록 설계되어야 합니다.
- **Zero-Manual-Rendering in Generated Code**: 생성된 파일 내부에 조건부 렌더링을 위한 복잡한 `switch/if` 문을 지양하고, `WidgetRenderer`에 필요한 Props만 깔끔하게 넘기는 구조를 유지합니다.
- **Shared Utils Only**: 생성된 코드에서 사용하는 모든 유틸리티는 `_shared/utils.ts`를 참조하여 중복 선언을 방지합니다.

---

---

## 2. ⛔ 렌더러 적용 범위 및 인라인 금지 원칙

---

> # ⛔ 절대 원칙 ⛔
>
> ## 렌더러가 사용되는 모든 곳에서 반드시 공통 렌더러 컴포넌트를 통해야 합니다.
> ## **각자 인라인으로 렌더링 코드를 작성하는 것은 절대 금지입니다.**
>
> ### ❌ 절대 금지
> - 페이지 파일 내부에서 `<div>`, `<table>`, `<input>` 등으로 위젯 UI를 직접 렌더링하는 것
> - 공통 렌더러를 우회하여 별도 서브컴포넌트(`ContentRenderer` 등)를 파일 내부에 인라인 정의하는 것
> - 위젯 타입별 렌더러를 직접 import하여 각 페이지 파일에서 직접 분기 처리하는 것
>
> ### ✅ 반드시 이렇게
> - 렌더링이 필요한 **모든 곳**에서 `WidgetRenderer` 단 하나만 사용
> - 데이터 fetch·state 관리만 페이지 파일에서 처리, **렌더링 로직은 WidgetRenderer에 위임**
> - 새 위젯 타입 추가 시 `WidgetRenderer` 내부에서 분기 추가 (14섹션 참조)

---

### 렌더러 적용 대상 (3곳 전부 동일 원칙)

| 구분 | 파일 경로 | 상태 |
|---|---|---|
| **① 빌더 미리보기** | `make/widget/page.tsx` (미리보기 패널 내부) | ✅ `WidgetRenderer` 사용 |
| **② 생성파일** | `app/admin/generated/[slug]/page.tsx` | ✅ `WidgetRenderer` 사용 |
| **③ 빌더연동 메뉴페이지** | `app/admin/templates/widget/[slug]/page.tsx` | ✅ `WidgetRenderer` 사용 |

**세 곳의 렌더링 코드는 반드시 동일한 `WidgetRenderer`를 경유해야 합니다.**
그래야 위젯 디자인·동작이 미리보기 ↔ 실제 페이지 사이에서 항상 일치합니다.

---

### 올바른 패턴 vs 잘못된 패턴

```tsx
// ✅ 올바른 패턴 — WidgetRenderer 하나만 사용
import { WidgetRenderer } from '@/app/admin/templates/make/_shared/components/renderer';

// 페이지 파일에서는 data/state만 관리
const [tableData, setTableData] = useState([]);
const [searchValues, setSearchValues] = useState({});

// 렌더링은 WidgetRenderer에 전부 위임
return (
    <WidgetRenderer
        mode="live"
        widget={widget}
        tableData={tableData}
        tableLoading={loading}
        searchValues={searchValues}
        onSearch={handleSearch}
        handlers={{ onEdit, onDelete }}
    />
);
```

```tsx
// ❌ 잘못된 패턴 — 페이지 파일 내부에서 직접 분기·렌더링
import { SearchRenderer, TableRenderer, FormRenderer } from '...';

// 페이지 파일이 위젯 타입 분기까지 담당 → 금지
function ContentRenderer({ widget }) {
    if (widget.type === 'search') return <SearchRenderer ... />;
    if (widget.type === 'table') return <TableRenderer ... />;
    // ...
}
```

---

### 왜 이 원칙이 중요한가

```
WidgetRenderer를 거치지 않으면 발생하는 문제:

① 빌더 미리보기에서는 A 디자인
   생성파일 또는 메뉴페이지에서는 B 디자인
   → 사용자가 빌더에서 본 것과 실제 페이지가 달라짐

② 새 위젯 타입 추가 시
   WidgetRenderer에만 추가하면 끝나야 하는데
   생성파일, 메뉴페이지 각자 수정해야 함
   → 수정 누락 = 버그 발생

③ 인라인 분기 코드가 곳곳에 산재
   → 유지보수 비용 폭증, 중복 로직 불일치
```

---

## 3. RendererMode — preview vs live

```ts
type RendererMode = 'preview' | 'live';
```

| 구분 | preview | live |
|---|---|---|
| **사용처** | 빌더 페이지 미리보기 패널 | 실제 서비스 페이지 (`generated/[slug]/page.tsx` 등) |
| **인터랙션** | disabled — 클릭·입력 불가 | 활성화 — 실제 동작 |
| **데이터** | 샘플 데이터 (하드코딩) | API 실데이터 |
| **핸들러** | 전달하지 않음 (noop) | onSearch / onSort / onPageChange 등 전달 |
| **페이지네이션** | 샘플 3페이지 disabled | 실제 페이지 수·번호 |
| **정렬 아이콘** | 표시하되 클릭 불가 | 클릭 시 onSort 호출 |

---

## 4. WidgetRenderer — 최상위 통합 Dispatcher

> 파일: `renderer/WidgetRenderer.tsx`

`widget.type`에 따라 알맞은 하위 렌더러로 자동 분기하는 **진입점** 컴포넌트입니다.
빌더 페이지, 실제 서비스 페이지 모두 이 컴포넌트 하나로 위젯을 렌더링합니다.

**Props:**

```ts
interface WidgetRendererProps {
    mode: RendererMode;
    widget: AnyWidget | null;
    /** Form 위젯 그리드 열 수 (부모 위젯의 colSpan, 기본 12) */
    contentColSpan?: number;

    /* ── live 모드 전용 — search ── */
    /** 검색폼 접기/펼치기 여부 */
    collapsible?: boolean;
    codeGroups?: CodeGroupDef[];
    searchValues?: Record<string, string>;
    onSearchChange?: (fieldId: string, value: string) => void;
    onSearch?: () => void;
    onReset?: () => void;

    /* ── live 모드 전용 — table ── */
    handlers?: TableActionHandlers;      // 테이블 액션 핸들러 (수정·상세·삭제·파일)
    tableData?: Record<string, unknown>[]; // 테이블 실데이터 rows
    tableLoading?: boolean;              // 초기/검색 로딩 여부
    sortKey?: string | null;
    sortDir?: 'asc' | 'desc';
    onSort?: (accessor: string, dir: 'asc' | 'desc') => void;
    totalElements?: number;
    totalPages?: number;
    currentPage?: number;
    onPageChange?: (page: number) => void;
    /** 무한스크롤 다음 페이지 로드 콜백 */
    onLoadMore?: () => void;
    /** 무한스크롤 추가 로딩 여부 (기존 데이터 유지 + 하단 스피너) */
    appendLoading?: boolean;
    hasMore?: boolean;
}
```

**위젯 타입별 분기:**

| widget.type | 렌더링 결과 |
|---|---|
| `null` | 빈 div |
| `'text'` | 텍스트 박스 (단순 텍스트 표시) |
| `'search'` | SearchRenderer |
| `'table'` | TableRenderer |
| `'form'` | FormRenderer |
| `'space'` | SpaceRenderer |

**사용법:**

```tsx
// 빌더 미리보기 패널 — preview 모드
<WidgetRenderer mode="preview" widget={widget} contentColSpan={content.colSpan} />
```

```tsx
// 실제 서비스 페이지 — live 모드 (search + table 연동)
<WidgetRenderer
    mode="live"
    widget={searchWidget}
    collapsible={config.collapsible}
    codeGroups={codeGroups}
    searchValues={searchValues}
    onSearchChange={updateValue}
    onSearch={handleSearch}
    onReset={resetValues}
/>

<WidgetRenderer
    mode="live"
    widget={tableWidget}
    codeGroups={codeGroups}
    handlers={tableHandlers}
    tableData={tableData}
    tableLoading={dataLoading}
    sortKey={sortKey}
    sortDir={sortDir}
    onSort={(accessor, dir) => { setSortKey(accessor); setSortDir(dir); fetchData(0, undefined, undefined, false, accessor, dir); }}
    totalElements={totalElements}
    totalPages={totalPages}
    currentPage={currentPage}
    onPageChange={(page) => fetchData(page)}
    onLoadMore={handleLoadMore}
    appendLoading={appendLoading}
    hasMore={hasMore}
/>
```

---

### ConfigJson → AnyWidget 변환 패턴 (`generated/[slug]/page.tsx`)

생성파일은 구형 ConfigJson 포맷(`fieldRows` / `tableColumns`)으로 설정을 저장합니다.
WidgetRenderer에 전달하기 위해 `useMemo`로 위젯 객체를 변환합니다.

```tsx
// ConfigJson → SearchWidget 변환
const searchWidget = useMemo<SearchWidget | null>(() => {
    if (!config || config.fieldRows.length === 0) return null;
    return {
        type: 'search',
        widgetId: 'main-search',
        contentKey: 'search',
        connectedSlug: dataSlug,
        rows: config.fieldRows,
    };
}, [config, dataSlug]);

// ConfigJson → TableWidget 변환
const tableWidget = useMemo<TableWidget | null>(() => {
    if (!config || config.tableColumns.length === 0) return null;
    return {
        type: 'table',
        widgetId: 'main-table',
        contentKey: 'table',
        columns: config.tableColumns,
        connectedSearchIds: config.fieldRows.length > 0 ? ['main-search'] : [],
        pageSize: config.pageSize ?? DEFAULT_PAGE_SIZE,
        displayMode: config.displayMode ?? 'pagination',
    };
}, [config]);
```

---

## 5. SearchRenderer — 검색폼 렌더러

> 파일: `renderer/SearchRenderer.tsx`

`SearchRowConfig[]` 구조를 **행(Row) → 필드(Field)** 계층으로 렌더링하는 컴포넌트입니다.

**Props:**

```ts
interface SearchRendererProps {
    mode: RendererMode;
    rows: SearchRowConfig[];
    /* live 모드 전용 */
    values?: Record<string, string>;          // 필드별 현재 값
    onChangeValues?: (fieldId: string, value: string) => void;
    onSearch?: () => void;
    onReset?: () => void;
    collapsible?: boolean;                    // 검색폼 접기/펼치기 기능
    codeGroups?: CodeGroupDef[];
}
```

**렌더링 구조:**

```
SearchForm (collapsible 설정 — preview에서는 무시)
└── SearchRow (row.cols 기준 열 레이아웃)
    └── SearchField (라벨 + colSpan + required 표시)
        └── FieldRenderer (실제 입력 컴포넌트)
```

**preview vs live:**

| 항목 | preview | live |
|---|---|---|
| `collapsible` | 무시 (항상 펼쳐진 상태) | 설정값 그대로 적용 |
| `onSearch / onReset` | noop | 실제 호출 |
| 필드 값 | 빈 값 (입력 disabled) | `values` 상태로 제어 |

---

## 6. FieldRenderer — 공통 단일 필드 렌더러

> 파일: `renderer/FieldRenderer.tsx`

**SearchRenderer와 FormRenderer 모두 재사용**하는 단일 필드 렌더링 컴포넌트입니다.
`field.type`에 따라 적절한 입력 UI를 렌더링하며, preview에서는 disabled 처리합니다.

**Props:**

```ts
interface FieldRendererProps {
    mode: RendererMode;
    field: SearchFieldConfig;
    value?: string;
    onChange?: (v: string) => void;
    codeGroups?: CodeGroupDef[];
}
```

**필드 타입별 동작:**

| 타입 | 렌더링 | 값 형식 |
|---|---|---|
| `input` | text input | 단순 문자열 |
| `select` | 드롭다운 (SelectArrow 포함) | 단순 문자열 |
| `date` | date input | `YYYY-MM-DD` |
| `dateRange` | date 2개 (시작~종료) | `YYYY-MM-DD~YYYY-MM-DD` |
| `radio` | 라디오 버튼 그룹 | 단순 문자열 |
| `checkbox` | 체크박스 그룹 | `값1,값2,값3` (쉼표 구분) |
| `button` | 버튼 그룹 (단일/다중선택) | 단일: 문자열 / 다중: `값1,값2` |

**공통코드 연동:**

```ts
// codeGroupCode가 있으면 codeGroups에서 옵션 조회 → 없으면 field.options 사용
const resolveOptions = () => { ... };
```

옵션 형식: `라벨:값` (예: `활성:active`) — `parseOpt()` 유틸로 파싱

**preview 처리:**
- `input`, `select`, `date`, `dateRange`: `disabled` 속성 적용
- `radio` : preview 시 3개 샘플 옵션만 표시
- `button` / `checkbox`: 클릭해도 상태 변경 없음 (onChange undefined)

---

## 7. TableRenderer — 테이블 전체 렌더러

> 파일: `renderer/TableRenderer.tsx`

헤더 + 바디 + 페이지네이션/무한스크롤을 통합한 테이블 렌더러입니다.

**Props:**

```ts
interface TableRendererProps {
    mode: RendererMode;
    columns: TableColumnConfig[];
    /* live 모드 전용 */
    data?: Record<string, unknown>[];
    isLoading?: boolean;
    sortKey?: string | null;
    sortDir?: 'asc' | 'desc';
    onSort?: (accessor: string, dir: 'asc' | 'desc') => void;
    codeGroups?: CodeGroupDef[];
    handlers?: TableActionHandlers;
    /* 페이지네이션 */
    pageSize?: number;          // 페이지당 행 수 (preview에서는 샘플 행 수)
    totalElements?: number;
    totalPages?: number;
    currentPage?: number;       // 0-based
    onPageChange?: (page: number) => void;
    displayMode?: 'pagination' | 'scroll';
    /* 무한스크롤 전용 (displayMode='scroll') */
    onLoadMore?: () => void;
    appendLoading?: boolean;
    hasMore?: boolean;
}
```

**displayMode별 동작:**

| 항목 | `pagination` | `scroll` |
|---|---|---|
| 페이지네이션 UI | 표시 | 숨김 |
| 무한스크롤 sentinel | 없음 | 하단에 `<div ref={sentinelRef}>` 렌더링 |
| preview 표시 | 샘플 페이지 버튼 3개 (disabled) | "↓ 무한스크롤 모드" 인디케이터 |

**무한스크롤 상세 (scroll + live):**

```
1. IntersectionObserver → sentinel div 감지 → onLoadMore() 호출
2. stale closure 방지: onLoadMoreRef = useRef(onLoadMore)
3. 재트리거 effect:
   - isLoading / appendLoading 변화 감지
   - 초기 로드 완료 후 sentinel이 여전히 뷰포트에 있으면 자동 재호출
   (이유: 마운트 시 Observer 발동해도 데이터 없어 early return → 초기 로드 완료 후 재발동 필요)
```

**preview 샘플:**
- 기본 5행 (`PREVIEW_ROW_COUNT`), `pageSize` prop으로 조절
- 정렬 아이콘 표시 (클릭 불가)
- 헤더 카운트: "00건" 표시

---

## 8. TableCellRenderer — 테이블 단일 셀 렌더러

> 파일: `renderer/TableCellRenderer.tsx`

TableRenderer 내부에서 사용하는 **단일 셀 렌더링** 컴포넌트입니다.
`col.cellType`에 따라 다른 UI와 로직을 적용합니다.

**Props:**

```ts
interface TableCellRendererProps {
    mode: RendererMode;
    col: TableColumnConfig;
    row?: Record<string, unknown>;   // live 전용 — 행 데이터
    rowIndex?: number;               // preview 전용 — 순환 인덱스 (0~4)
    codeGroups?: CodeGroupDef[];
    handlers?: TableActionHandlers;
}
```

**셀 타입별 동작:**

| cellType | preview | live |
|---|---|---|
| `text` (기본) | "샘플 텍스트" | 공통코드 연동(codeGroupCode) / 숫자 포맷(toLocaleString) |
| `badge` | cellOptions 순환 표시 (rowIndex % len) | value와 cellOptions 매칭 → 텍스트·색상 |
| `boolean` | rowIndex % 2 교대 | Boolean(value) → trueText / falseText |
| `actions` | 버튼 표시 (클릭 없음) | onEdit / onDetail / onDelete / customActions 호출 |
| `file` | "2" 샘플 표시 | Array.length 표시, onFileClick 호출 |

**Tailwind purge 방지:**

동적 문자열로 클래스를 조합하면 Tailwind가 빌드 시 제거합니다.
이를 방지하기 위해 **정적 맵**을 사용합니다:

```ts
// ✅ 올바른 방식 — 정적 맵에서 조회
const BADGE_CLS: Record<string, string> = {
    blue:   'bg-blue-100 text-blue-700',
    green:  'bg-green-100 text-green-700',
    // ...
};
const cls = BADGE_CLS[color] ?? BADGE_CLS.gray;

// ❌ 잘못된 방식 — 동적 문자열 조합 (Tailwind purge 대상)
const cls = `bg-${color}-100 text-${color}-700`;
```

**공통코드 복수값 처리:**

```ts
// text 셀에서 value가 쉼표 구분 복수값일 때
strVal.split(',').map(v => codeLookup(v)).join(', ')
```

---

## 9. FormRenderer — 폼 위젯 렌더러

> 파일: `renderer/FormRenderer.tsx`

`FormFieldItem[]`을 **CSS Grid 12칸 레이아웃**으로 렌더링하는 컴포넌트입니다.

**Props:**

```ts
interface FormRendererProps {
    mode: RendererMode;
    fields: FormFieldItem[];
    contentColSpan?: number;   // 부모 위젯 grid 열 수 (기본 12)
}
```

**레이아웃 방식:**

```
CSS Grid — gridTemplateColumns: repeat(contentColSpan, 1fr)
각 필드: gridColumn: span colSpan / gridRow: span rowSpan
기본 gridAutoRows: 68px
```

- `contentColSpan`: 위젯이 배치된 부모 grid의 열 수. WidgetRenderer가 전달.
- `colSpan`: 필드가 차지하는 열 수 (1~12)
- `rowSpan`: 필드가 차지하는 행 수 (1~20) — textarea처럼 세로로 긴 필드에 사용

**렌더링 구조:**

```
<div style={{ display: 'grid', gridTemplateColumns: repeat(n, 1fr) }}>
    {fields.map(field => (
        <div style={{ gridColumn: span colSpan, gridRow: span rowSpan }}>
            <label>{field.label}</label>
            <FieldRenderer mode={mode} field={field} />
        </div>
    ))}
</div>
```

---

## 10. SpaceRenderer — 공간영역 렌더러

> 파일: `renderer/SpaceRenderer.tsx`

`SpaceItem[]`을 순서대로 렌더링하는 공간영역 위젯 렌더러입니다.
Text 아이템과 Button 아이템을 자유롭게 배치합니다.

**Props:**

```ts
interface SpaceRendererProps {
    mode: RendererMode;   // 현재 미분기 (향후 확장 대비)
    items: SpaceItem[];
}
```

**아이템 타입별 렌더링:**

| item.type | 렌더링 |
|---|---|
| `text` | `<p>` 태그 (whitespace-pre-wrap 적용) |
| `button` | 색상 지정 버튼 (SPACE_BTN_CLS 정적 맵으로 Tailwind purge 방지) |

**버튼 색상 맵 (`SPACE_BTN_CLS`):**

```ts
// SpaceBuilder의 SPACE_BTN_COLORS와 대응되는 렌더러용 정적 맵
const SPACE_BTN_CLS: Record<string, string> = {
    black:  'bg-slate-900 text-white',
    green:  'bg-emerald-500 text-white',
    blue:   'bg-blue-500 text-white',
    yellow: 'bg-yellow-400 text-slate-900',
    red:    'bg-red-500 text-white',
    gray:   'bg-slate-400 text-white',
    pink:   'bg-pink-400 text-white',
};
```

**현재 미구현 사항:**

버튼의 `connType` / `popupSlug` / `connectedSlug` / `apiId` 등 연결 설정은 렌더러에서 아직 동작하지 않습니다.
(SpaceBuilder에서 설정은 가능하나, SpaceRenderer의 클릭 이벤트 연동이 미개발 상태)

---

---

## 11. Generator — 코드 생성 표준 정의

빌더의 최종 결과물인 **생성된 TSX 코드**가 지향해야 할 표준 구조입니다.

### 11-1. 설계의 의도 (Standardization Intent)
우리가 빌더 페이지에서 인라인 로직을 제거하는 것과 마찬가지로, **생성된 코드 역시 '깨끗한 상태'를 유지**해야 합니다. 생성된 파일이 수천 줄의 인라인 JSX로 가득 차는 것을 막고, 오직 해당 화면의 **'상태 선언'과 '데이터 매핑'**에만 집중하게 하는 것이 목적입니다.

### 11-2. 코드 생성기(Generator) 위치 및 구조
- **경로**: `_shared/generators/*.ts`
- **구조**: `buildXxxTsxFile(...)` 함수로 명명하며, `Config` 객체를 입력받아 문자열을 반환합니다.
- **금지 사항**: 빌더 페이지(`page.tsx`) 내부에 `generateXxx` 함수를 인라인으로 작성하지 마십시오. 반드시 외부 파일로 분리하여 빌더와 생성기 간의 결합도를 낮춰야 합니다.

### 11-3. 생성된 파일의 표준 구성 (Example: Layer)
생성된 파일은 아래와 같은 레이아웃을 따릅니다:
1.  **Imports**: 필요한 공통 컴포넌트(`LayerPopupRenderer` 등) 및 유틸리티
2.  **Popup Map/Meta**: 개발자 방식 팝업 매핑 등 정적 정보
3.  **State/Handlers**: 화면 동작을 위한 `useState`, `useEffect`, `api` 호출 로직
4.  **WidgetRenderer 호출**: 모든 렌더링 로직은 담당 렌더러에 위임

```tsx
// ✅ 생성물의 표준 지향점
export default function GeneratedLayer({ isOpen, onClose }) {
  // 1. 상태 및 데이터 관리
  const [formData, setFormData] = useState({});

  // 2. 렌더링은 렌더러에 위임 (No-Inline JSX)
  return (
    <WidgetRenderer
      mode="live"
      widget={layerConfig} // Generator가 미리 조립한 위젯 객체
      formData={formData}
      onChange={setFormData}
      onClose={onClose}
    />
  );
}
```

---

## 12. SearchFieldRenderer — re-export (하위 호환)

## 12. 파일 간 의존관계

```
WidgetRenderer
├── SearchRenderer
│   ├── SearchForm          (@/components/search — 외부 공통 UI)
│   ├── SearchRow           (@/components/search — 외부 공통 UI)
│   ├── SearchField         (@/components/search — 외부 공통 UI)
│   └── FieldRenderer
│       ├── SelectArrow     (공통 UI 컴포넌트)
│       └── parseOpt()      (utils 파일)
│
├── TableRenderer
│   └── TableCellRenderer
│
├── FormRenderer
│   └── FieldRenderer       (SearchRenderer와 공유)
│
└── SpaceRenderer

SearchFieldRenderer = FieldRenderer (re-export)
```

**외부 공통 컴포넌트 (`@/components/search`):**
- `SearchForm`: 검색폼 외곽 틀, collapsible 지원
- `SearchRow`: 행 레이아웃 (grid)
- `SearchField`: 라벨 + 필드 래퍼

---

## 13. 핵심 설계 원칙

### 13-1. Mode 분기 원칙

모든 렌더러는 `mode` prop 하나로 preview/live를 분기합니다.
별도 컴포넌트를 만들지 않고, **하나의 컴포넌트에서 조건부 렌더링**으로 처리합니다.

```tsx
// ✅ 올바른 방식
const isPreview = mode === 'preview';
<button onClick={!isPreview ? handleClick : undefined} />

// ❌ 잘못된 방식
const Preview = () => <div>...</div>;
const Live    = () => <div>...</div>;
mode === 'preview' ? <Preview /> : <Live />;
```

### 13-2. Tailwind purge 방지

동적 문자열로 Tailwind 클래스를 조합하면 프로덕션 빌드에서 스타일이 사라집니다.
색상·상태에 따른 클래스는 반드시 **정적 맵(Record)**으로 관리합니다.

```ts
// ✅ 정적 맵 방식 (purge 안전)
const BADGE_CLS = { blue: 'bg-blue-100 text-blue-700', ... };

// ❌ 동적 조합 방식 (purge 위험)
const cls = `bg-${color}-100 text-${color}-700`;
```

### 13-3. FieldRenderer 공통 재사용

SearchRenderer와 FormRenderer는 **필드 렌더링 로직을 공유**합니다.
필드 타입에 새 동작을 추가할 때 FieldRenderer 한 곳만 수정하면 양쪽 모두 반영됩니다.

### 13-4. 공통코드(codeGroups) 연동

화면에 코드값 대신 이름을 표시할 때 codeGroups를 활용합니다.

```ts
// codeGroupCode로 그룹 조회 → option.value === 셀 값 → option.label 반환
const label = codeGroups
    .find(g => g.groupCode === col.codeGroupCode)
    ?.options.find(o => o.value === cellValue)
    ?.label ?? cellValue;
```

### 13-5. 무한스크롤 stale closure 방지

IntersectionObserver 콜백에서 최신 함수를 참조하려면 ref 패턴을 사용합니다.

```ts
const onLoadMoreRef = useRef(onLoadMore);
useEffect(() => { onLoadMoreRef.current = onLoadMore; }); // 매 렌더마다 최신화

// Observer 콜백에서는 ref.current 호출
observer = new IntersectionObserver(() => onLoadMoreRef.current?.());
```

---

## 14. 새 위젯 타입 추가 방법

새 위젯 타입이 필요할 경우 아래 순서로 추가합니다.

```
1. renderer/types.ts
   AnyWidget 유니온에 새 타입 추가
   예) type AnyWidget = ... | MyNewWidget;

2. renderer/MyNewRenderer.tsx 생성
   mode: RendererMode prop 필수
   preview/live 분기 구현

3. renderer/index.ts
   export { MyNewRenderer } from './MyNewRenderer'; 추가

4. renderer/WidgetRenderer.tsx
   widget.type === 'myNew' 분기 추가
   → <MyNewRenderer mode={mode} ... />

5. (빌더) _shared/components/builder/MyNewBuilder.tsx 생성
   → input-component-guide.md 참조

6. (빌더) widget/page.tsx 또는 list/page.tsx
   새 위젯 타입 case 추가
   → <MyNewBuilder widget={...} onChange={...} />

7. (빌더 미리보기) WidgetRenderer에 이미 연결되어 있으므로
   미리보기 패널은 자동 반영됨
```

> ⚠️ 빌더 미리보기와 실제 렌더러는 **동일한 WidgetRenderer를 사용**합니다.
> 렌더러 디자인을 정의했다면, 빌더 미리보기도 자동으로 같은 디자인 적용됩니다.
> 미리보기와 렌더러 디자인이 달라지는 것은 **표준화 원칙 위반**입니다.

### 15. 결론: "의도된 격리"
인풋(빌더)과 아웃풋(렌더러/생성파일) 가이드의 핵심은 **"격리"**입니다.
- **Input**: 편집하는 도구 (무엇을 그릴지**결정**)
- **Output**: 그리는 결과 (결정된 것을**표현**)
이 두 세계 사이에는 `Config`와 `Dispatcher`라는 다리만 존재해야 합니다. 빌더 페이지에 렌더링 로직이 섞여 들어오는 순간, 시스템의 확장성은 무너지게 됨을 강조합니다.
