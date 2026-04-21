# Input 컴포넌트 가이드

> 경로: `bo/src/app/admin/templates/make/_shared/components/`
> 마지막 업데이트: 2026-04-17

---

## 목차

1. [개요 — Input 컴포넌트 계층 구조](#1-개요--input-컴포넌트-계층-구조)
2. [컨텐츠 컴포넌트 (빌더 패널)](#2-컨텐츠-컴포넌트-빌더-패널)
3. [필드 컴포넌트 (builder/fields/)](#3-필드-컴포넌트-builderfields)
4. [공통 서브 컴포넌트](#4-공통-서브-컴포넌트)
5. [컴포넌트 간 연결 흐름](#5-컴포넌트-간-연결-흐름)
6. [필드 컴포넌트 재활용 현황](#6-필드-컴포넌트-재활용-현황)
7. [새 필드 타입 추가 방법](#7-새-필드-타입-추가-방법)

---

## 1. 개요 — Input 컴포넌트 계층 구조

빌더의 Input 영역(설정 패널)은 크게 **컨텐츠 컴포넌트**와 **필드 컴포넌트** 두 계층으로 구성됩니다.

```
빌더 페이지 (list/page.tsx, widget/page.tsx 등)
│
├── 컨텐츠 컴포넌트 (위젯 타입별 설정 패널)
│     ├── SearchBuilder.tsx   — 검색폼 행/필드 구성
│     ├── FormBuilder.tsx     — 폼 위젯 필드 구성
│     ├── TableBuilder.tsx    — 테이블 컬럼 구성
│     └── SpaceBuilder.tsx    — 공간영역 Text/Button 아이템 구성
│
└── 필드 컴포넌트 (builder/fields/)
      │
      ├── ─── SearchField / FormField 계열 ───
      │     ├── _FieldBase.tsx       — 라벨·Key·ColSpan·RowSpan 공통 베이스
      │     ├── _FieldOptions.tsx    — 옵션 입력 + 공통코드 연동 공통 섹션
      │     ├── _ToggleRow.tsx       — 토글 행 공통 UI
      │     ├── InputField.tsx
      │     ├── SelectField.tsx
      │     ├── DateField.tsx
      │     ├── DateRangeField.tsx
      │     ├── RadioField.tsx
      │     ├── CheckboxField.tsx
      │     ├── ButtonField.tsx
      │     ├── TextareaField.tsx
      │     └── ActionButtonField.tsx
      │
      └── ─── TableColumn 계열 (TableBuilder 전용) ───
            ├── ColumnBaseField.tsx    — 헤더명·Key·너비·정렬 공통 베이스
            ├── BadgeOptionsField.tsx  — 배지 옵션(모양·아이콘·색상) 설정
            ├── TextCodeGroupField.tsx — 공통코드 연동 표시방식 설정
            ├── BooleanTextField.tsx   — True/False 표시 텍스트 설정
            └── ActionsField.tsx       — 액션 버튼(수정·상세·삭제·커스텀) 설정
```

**핵심 원칙 (Standardization Strategy):**
- **No-Inline Rendering**: 빌더 페이지(`page.tsx`)와 주요 컨텐츠 컴포넌트 내부에서 설정 UI용 HTML/JSX를 직접 작성하는 것을 엄격히 금지합니다.
- **Dispatcher 기반 분리**: 필드 설정은 `CommonFieldDispatcher`, 빌더 설정은 `CommonBuilderDispatcher`를 통해 호출하여 빌더 본체와 설정 UI 간의 결합도를 최소화합니다.
- **L3 Component Extraction (L3 컴포넌트 추출)**: 버튼 추가/삭제 등 복잡한 UI 로직이 포함된 경우, 이를 독립적인 L3 컴포넌트(예: `LayerButtonBuilder`)로 추출하여 격리합니다.
- **Pure Configuration**: 모든 데이터 통신 및 상태 관리는 페이지(L1)에서 시도하고, 인풋 컴포넌트는 오직 `onChange` 콜백을 통해서만 상위로 데이터를 전달합니다.
- **Typed Config**: `_shared/types.ts`의 공통 타입을 엄격히 준수하여 빌더 간 호환성을 보장합니다.

---

## 2. 컨텐츠 컴포넌트 (빌더 패널)

### 2-1. SearchBuilder

> 파일: `_shared/components/SearchBuilder.tsx`

검색폼의 **행(Row) + 필드(Field)** 구조를 관리하는 빌더 패널입니다.

**역할:**
- 행 추가/삭제/정렬 (DnD)
- 행 내 필드 추가/삭제/정렬 (DnD)
- 필드 타입 선택 → 해당 FieldComponent 렌더링
- `SearchRowConfig[]` 형태로 상위에 반환

**데이터 구조:**
```
SearchRowConfig[]
  └── rows[]: { id, cols, fields: SearchFieldConfig[] }
        └── fields[]: { id, type, label, fieldKey, colSpan, ... }
```

**사용처:**
- `list/page.tsx` — List 빌더 검색폼
- `widget/page.tsx` — Widget 빌더 Search 위젯

```tsx
// 사용법
<SearchBuilder rows={rows} onChange={setRows} />
```

---

### 2-2. FormBuilder

> 파일: `_shared/components/builder/FormBuilder.tsx`

폼 위젯의 **플랫 필드 목록**을 관리하는 빌더 패널입니다.

**역할:**
- 필드 추가/삭제/정렬 (DnD)
- 필드 타입 선택 → 해당 FieldComponent 렌더링
- SearchBuilder와 달리 **Row 개념 없음** — 각 필드마다 colSpan·rowSpan 개별 지정
- `FormWidget` 형태로 상위에 반환

**SearchBuilder와의 차이:**

| 항목 | SearchBuilder | FormBuilder |
|---|---|---|
| 구조 | Row → Field 2계층 | Field 단일 계층 |
| colSpan | 1~5 (행 칸 수 기준) | 숫자 직접 입력 (1~12) |
| rowSpan | 없음 | 있음 (필드 세로 높이) |
| 사용 위젯 | Search | Form |

**FormFieldItem 타입:**
```ts
// SearchFieldConfig를 확장 (colSpan, rowSpan 재정의)
interface FormFieldItem extends Omit<SearchFieldConfig, 'colSpan'> {
    colSpan: number;   // 1~12 (12칸 그리드)
    rowSpan: number;   // 1~20 (행 높이 배수)
}
```

```tsx
// 사용법
<FormBuilder widget={formWidget} onChange={setFormWidget} slugOptions={slugOptions} />
```

---

### 2-3. TableBuilder

> 파일: `_shared/components/builder/TableBuilder.tsx`

테이블의 **컬럼 목록**을 관리하는 빌더 패널입니다.

**역할:**
- 표시 방식(pagination/scroll), 페이지당 건수 설정
- 컬럼 추가/삭제/정렬
- 셀 타입 선택 → `TableColumn 계열` 필드 컴포넌트로 세부 설정
- `TableWidget` 형태로 상위에 반환

**컬럼 편집 구조 (pendingCol 패턴):**

컬럼 편집 상태를 단일 `pendingCol` 객체로 통합 관리합니다.

```ts
// null = 다이얼로그 닫힘
// cellType 미설정 = Phase 1 (셀 타입 선택 단계)
// cellType 설정   = Phase 2 (세부 설정 단계)
const [pendingCol, setPendingCol] = useState<Partial<TableColumnConfig> | null>(null);
```

**컬럼 설정 패널 구성 (renderColumnEdit):**

```tsx
// ✅ 모든 컬럼 설정은 TableColumn 계열 컴포넌트로 조립 — 인라인 HTML 금지
const patch = (p: Partial<TableColumnConfig>) => updateColumn(col.id, p);

<ColumnBaseField values={col} onChange={patch} />
{col.cellType === 'badge'   && <BadgeOptionsField   values={col} onChange={patch} />}
{col.cellType === 'text'    && <TextCodeGroupField  values={col} onChange={patch}
                                  codeGroups={codeGroups} codeGroupsLoading={false} />}
{col.cellType === 'boolean' && <BooleanTextField    values={col} onChange={patch} />}
{col.cellType === 'actions' && <ActionsField        values={col} onChange={patch}
                                  layerTemplates={layerTemplates}
                                  onRequestLayerTemplates={loadLayerTemplates} />}
```

**컬럼 추가 다이얼로그도 동일한 컴포넌트 재사용:**

Phase 2(세부 설정)에서 `renderColumnEdit`과 완전히 동일한 5개 컴포넌트를 사용합니다.
별도 인라인 UI 없이 진정한 재사용 구조입니다.

```tsx
// 사용법
<TableBuilder
    widget={tableWidget}
    onChange={setTableWidget}
    codeGroups={codeGroups}
    layerTemplates={layerTemplates}
/>
```

---

### 2-4. SpaceBuilder (공간영역)

> 파일: `_shared/components/builder/SpaceBuilder.tsx`

Text 아이템과 Button 아이템을 자유롭게 배치하는 **공간영역 위젯**의 설정 패널입니다.

**역할:**
- Text 아이템 추가 (텍스트 내용 입력)
- Button 아이템 추가 (라벨·색상·연결 타입 설정)
- 아이템 삭제/정렬
- `SpaceWidget` 형태로 상위에 반환

```tsx
// 사용법
<SpaceBuilder
    widget={spaceWidget}
    onChange={setSpaceWidget}
    layerTemplates={layerTemplates}
    slugOptions={slugOptions}
    apiOptions={apiOptions}
/>
```

**Button 연결 타입 (connType):**

| 타입 | 설명 |
|---|---|
| 없음 | 클릭 시 동작 없음 |
| `popup` | Layer 빌더 팝업 연결 (LAYER 템플릿 slug 선택) |
| `path` | 로컬 컴포넌트 파일명 직접 입력 (개발자 방식) |
| `slug` | Slug 레지스트리에서 slug 선택 |
| `api` | API 관리에서 등록된 API 선택 |

**데이터 구조:**
```
SpaceWidget
  └── items[]: SpaceItem
        ├── type: 'text' | 'button'
        ├── content: string        (text 전용)
        ├── label: string          (button 전용)
        ├── color: string          (button 전용)
        ├── connType: '' | 'popup' | 'path' | 'slug' | 'api'
        ├── popupSlug?: string
        ├── pathComponent?: string
        ├── dbSlug?: string
        └── apiId?: number
```

---

### 2-5. LayerBuilder / LayerButtonBuilder

> 파일: `_shared/components/builder/LayerButtonBuilder.tsx`

Layer 팝업의 **폼 구조 + 하단 버튼**을 관리하는 표준화된 빌더 체계입니다.

**설계 의도:**
Layer 빌더는 기존의 거대 인라인 로직을 제거하고, 레이어 본연의 설정에 집중하도록 설계되었습니다. 특히 하단 버튼 관리는 복잡한 정렬 및 추가/삭제 로직을 포함하므로 `LayerButtonBuilder`라는 전용 L3 컴포넌트로 분리되었습니다.

**역할:**
- **LayerBuilder**: `CommonFieldDispatcher`를 사용하여 레이어 구성 필드를 편집
- **LayerButtonBuilder**: 레이어 하단 버튼의 레이블, 타입, 액션을 관리하며 순서 변경(DnD/UP/DOWN) 지원
- **No-Inline Rendering**: 레이어 빌더 페이지(`layer/page.tsx`)는 더 이상 설정 UI 로직을 가지지 않으며, 오직 상태 전달만 담당

```tsx
// Layer 빌더 페이지에서의 표준 호출 예시
<LayerButtonBuilder
    buttons={layerButtons}
    onChange={setLayerButtons}
    onAdd={() => addLayerButton()}
/>
```

## 3. 필드 컴포넌트 (builder/fields/)

> 경로: `_shared/components/builder/fields/`

빌더 컴포넌트가 **공통으로 재사용**하는 필드 설정 컴포넌트 모음입니다.
두 계열로 나뉩니다.

---

### SearchField / FormField 계열

SearchBuilder, FormBuilder가 공통으로 사용하는 컴포넌트입니다.

#### 3-1. _FieldBase (내부 공통 베이스)

> 파일: `builder/fields/_FieldBase.tsx`

모든 SearchField/FormField 컴포넌트 내부에서 사용하는 **공통 입력 베이스**입니다.
직접 사용하지 않고 각 FieldXxx 컴포넌트 내부에서만 사용합니다.

**담당하는 공통 항목:**

| 항목 | 설명 |
|---|---|
| **라벨** | 필드 위에 표시되는 이름 (필수) |
| **라벨 2** | DateRange 전용 두 번째 라벨 |
| **Key** | API 파라미터 키 (영문, 필수) |
| **ColSpan** | 행 내 칸 수. `button` 모드(1~5 버튼)·`number` 모드(직접 입력) 중 하나로 표시 |
| **RowSpan** | 세로 높이 배수. `rowSpanConfig` prop 전달 시에만 표시 (FormBuilder 전용) |

**ColSpan 모드 (`ColSpanMode` 타입):**
```ts
// 버튼 선택 방식 (SearchBuilder: 1~5 버튼)
{ type: 'button', options: [1,2,3,4,5], minSpan?: number }

// 숫자 직접 입력 방식 (FormBuilder: 1~12)
{ type: 'number', min: 1, max: 12 }
```

---

#### 3-2. _FieldOptions (옵션 공통 섹션)

> 파일: `builder/fields/_FieldOptions.tsx`

Select / Radio / Checkbox / Button 필드에서 공통으로 사용하는 **옵션 입력 + 공통코드 연동 섹션**입니다.

**담당 항목:**
- 옵션 텍스트 입력 (textarea, 줄바꿈으로 구분)
- 공통코드 그룹 연동 선택 (`CodeGroupSelector`)
- 옵션 형식: `라벨:값` (예: `활성:active`)

**옵션 입력 형식:**
```
활성:active
비활성:inactive
대기:pending
```
> `라벨`은 화면에 표시되는 텍스트, `값`은 API 파라미터로 전송되는 실제 값.
> 콜론(`:`) 구분자 없이 단순 텍스트만 입력하면 라벨=값으로 동일하게 처리됩니다.

---

#### 3-3. 개별 SearchField/FormField 컴포넌트

모든 필드 컴포넌트는 동일한 `FieldEditProps` 인터페이스를 받습니다:

```ts
interface FieldEditProps {
    values: FieldEditValues;         // 현재 필드 설정값
    onChange: (updates) => void;     // 변경 핸들러
    colSpanMode: ColSpanMode;        // ColSpan 표시 모드
    rowSpanConfig?: { min, max };    // RowSpan 설정 (FormBuilder에서만 전달)
    codeGroups: CodeGroupDef[];      // 공통코드 목록
    codeGroupsLoading: boolean;
    autoFocus?: boolean;
    onLabelKeyDown?: handler;
}
```

| 컴포넌트 | 주요 설정 항목 |
|---|---|
| `InputField` | 라벨·Key·ColSpan / Placeholder / 유효성 검사 (필수·글자수·정규식) |
| `SelectField` | 라벨·Key·ColSpan / Placeholder / 옵션(`_FieldOptions`) / 필수 |
| `DateField` | 라벨·Key·ColSpan / 필수 |
| `DateRangeField` | 라벨1·라벨2·Key·ColSpan(min:2) / 필수 |
| `RadioField` | 라벨·Key·ColSpan / 옵션(`_FieldOptions`) / 필수 |
| `CheckboxField` | 라벨·Key·ColSpan / 옵션(`_FieldOptions`) / 필수·최소~최대 선택 수 |
| `ButtonField` | 라벨·Key·ColSpan / 옵션(`_FieldOptions`) / 다중선택 토글 / 필수 |
| `TextareaField` | 라벨·Key·ColSpan / Placeholder / Rows(높이) / 유효성 검사 |
| `ActionButtonField` | 액션 실행 버튼 (검색폼 내 버튼 배치용) |

---

### TableColumn 계열

TableBuilder가 **컬럼 셀 타입별 세부 설정**에 사용하는 컴포넌트입니다.

#### 3-4. ColEditProps — TableColumn 계열 공통 인터페이스

```ts
/**
 * TableColumn 계열 필드 컴포넌트 공통 Props
 * values: 현재 컬럼 설정값 (부분 객체 허용)
 * onChange: 변경된 속성만 patch 방식으로 전달
 */
interface ColEditProps {
    values: Partial<TableColumnConfig>;
    onChange: (patch: Partial<TableColumnConfig>) => void;
}
```

---

#### 3-5. ColumnBaseField — 컬럼 공통 베이스

> 파일: `builder/fields/ColumnBaseField.tsx`

모든 셀 타입에 공통으로 표시되는 **컬럼 기본 설정** 컴포넌트입니다.

| 설정 항목 | 설명 |
|---|---|
| 헤더명 | 컬럼 헤더에 표시되는 텍스트 |
| Key (accessor) | 데이터에서 값을 꺼낼 필드명 (actions 타입 제외) |
| 너비 + 단위 | 숫자 입력 + px/% 단위 선택 |
| 정렬 | left / center / right |
| 정렬 활성화 | 클릭 시 테이블 sort 발동 여부 체크박스 |

```ts
// autoFocus: 컬럼 추가 다이얼로그에서 포커스 자동 이동 (기본 false)
interface ColumnBaseFieldProps extends ColEditProps {
    autoFocus?: boolean;
}
```

---

#### 3-6. BadgeOptionsField — 배지 타입 설정

> 파일: `builder/fields/BadgeOptionsField.tsx`

`cellType === 'badge'` 컬럼에서 사용하는 배지 옵션 설정 컴포넌트입니다.

| 설정 항목 | 설명 |
|---|---|
| 배지 모양 | 둥근(rounded-full) / 각진(rounded) 선택 |
| 아이콘 표시 | 토글 ON → 배지 앞 원형 아이콘 표시 |
| 옵션 rows | 값(value) · 표시 텍스트 · 색상 선택 · 삭제 |
| 옵션 추가 | [+ 옵션 추가] 버튼 |

**색상 팔레트 (`PRESET_COLORS`):**

```ts
// TableCellRenderer의 BADGE_CLS 맵과 대응됨
export const PRESET_COLORS = [
    { name: 'gray',   value: 'gray'   },
    { name: 'blue',   value: 'blue'   },
    { name: 'green',  value: 'green'  },
    { name: 'yellow', value: 'yellow' },
    { name: 'red',    value: 'red'    },
    { name: 'purple', value: 'purple' },
    { name: 'pink',   value: 'pink'   },
    { name: 'indigo', value: 'indigo' },
];
```

---

#### 3-7. TextCodeGroupField — 텍스트/공통코드 연동 설정

> 파일: `builder/fields/TextCodeGroupField.tsx`

`cellType === 'text'` 컬럼에서 사용하는 공통코드 연동 설정 컴포넌트입니다.

| 설정 항목 | 설명 |
|---|---|
| 공통코드 그룹 | `CodeGroupSelector` — 코드 그룹 선택 |
| 표시방식 | 이름만 / 코드값만 / 이름(코드값) 토글 |

```ts
// 추가 Props (ColEditProps 확장)
interface TextCodeGroupFieldProps extends ColEditProps {
    codeGroups: CodeGroupDef[];
    codeGroupsLoading: boolean;
}
```

---

#### 3-8. BooleanTextField — Boolean 표시 텍스트 설정

> 파일: `builder/fields/BooleanTextField.tsx`

`cellType === 'boolean'` 컬럼에서 사용하는 True/False 표시 텍스트 설정 컴포넌트입니다.

| 설정 항목 | 설명 |
|---|---|
| True 텍스트 | Boolean true일 때 표시할 문자열 (예: `활성`) |
| False 텍스트 | Boolean false일 때 표시할 문자열 (예: `비활성`) |

---

#### 3-9. ActionsField — 액션 버튼 설정

> 파일: `builder/fields/ActionsField.tsx`

`cellType === 'actions'` 컬럼에서 사용하는 액션 버튼 설정 컴포넌트입니다.

| 설정 항목 | 설명 |
|---|---|
| 프리셋 액션 | 수정·상세·삭제 체크박스 + 팝업/경로 연결 설정 |
| 커스텀 버튼 | 버튼 rows (라벨·색상·팝업 slug·경로) |
| 버튼 추가 | [+ 버튼 추가] 버튼 |

**커스텀 액션 색상 (`CUSTOM_ACTION_COLORS`):**

```ts
// TableCellRenderer의 커스텀 버튼 클래스와 대응됨
export const CUSTOM_ACTION_COLORS = [
    { value: 'blue',    label: '파란색', cls: 'bg-blue-500 text-white'    },
    { value: 'green',   label: '초록색', cls: 'bg-emerald-500 text-white' },
    { value: 'red',     label: '빨간색', cls: 'bg-red-500 text-white'     },
    { value: 'gray',    label: '회색',   cls: 'bg-slate-400 text-white'   },
    { value: 'yellow',  label: '노란색', cls: 'bg-yellow-400 text-slate-900' },
    { value: 'purple',  label: '보라색', cls: 'bg-purple-500 text-white'  },
];
```

```ts
// 추가 Props (ColEditProps 확장)
interface ActionsFieldProps extends ColEditProps {
    layerTemplates: TemplateItem[];
    onRequestLayerTemplates: () => void;   // 팝업 열릴 때 lazy loading
}
```

---

## 4. 공통 서브 컴포넌트

필드 컴포넌트 내부에서 조합하여 사용하는 공통 UI 조각들입니다.

| 파일 | 역할 |
|---|---|
| `FieldPickerTypeList.tsx` | 필드 타입 선택 목록 UI (타입 이름·설명 표시, 선택 시 콜백) |
| `ValidationSection.tsx` | 필수 여부 토글 + 필드 유형별 유효성 검사 입력 (글자 수 / 선택 수 / 정규식) |
| `CodeGroupSelector.tsx` | 공통코드 그룹 드롭다운 선택 UI |
| `OptionInputRows.tsx` | 옵션 줄바꿈 입력 textarea |
| `DndWrappers.tsx` | 행/필드 DnD 드래그 핸들 래퍼 |
| `RowHeader.tsx` | 검색 행 헤더 (행 번호·칸수·삭제 버튼) |

---

## 5. 컴포넌트 간 연결 흐름

### SearchBuilder에서 필드 추가 흐름

```
[+ 필드 추가] 클릭
    ↓
FieldPickerTypeList — 타입 선택
    ↓
타입에 맞는 FieldXxx 컴포넌트 렌더링
 (InputField / SelectField / DateField / ...)
    ↓
FieldBase — 라벨, Key, ColSpan 입력
    ↓ (옵션이 있는 타입)
_FieldOptions — 옵션 직접 입력 또는 공통코드 선택
    ↓ (유효성 검사)
ValidationSection — 필수 여부 / 글자 수 / 선택 수 등
    ↓
[추가] → rows 상태 업데이트 → SearchBuilder 재렌더링
```

### FormBuilder에서 필드 추가 흐름

```
[+ 필드 추가] 클릭
    ↓
FieldPickerTypeList — 타입 선택
    ↓
타입에 맞는 FieldXxx 컴포넌트 렌더링
 (colSpanMode: number 방식 / rowSpanConfig 추가 전달)
    ↓
FieldBase — 라벨, Key, ColSpan(숫자입력), RowSpan 입력
    ↓
[추가] → fields 상태 업데이트 → FormBuilder 재렌더링
```

### TableBuilder에서 컬럼 추가/편집 흐름

```
[+ 컬럼 추가] 클릭
    ↓
Phase 1: 셀 타입 선택 (text / badge / boolean / actions)
    ↓
Phase 2: pendingCol.cellType 설정 →
    ColumnBaseField (공통 베이스)
    + cellType별 전용 컴포넌트:
      badge   → BadgeOptionsField
      text    → TextCodeGroupField
      boolean → BooleanTextField
      actions → ActionsField
    ↓
[확인] → columns 상태에 추가

기존 컬럼 클릭 (인라인 편집):
    ↓
renderColumnEdit() — Phase 2와 동일한 5개 컴포넌트 재사용
    ↓
onChange patch → columns 상태 즉시 업데이트
```

---

## 6. 필드 컴포넌트 재활용 및 디스패처 연동

모든 컨텐츠 컴포넌트는 직접 필드를 렌더링하지 않고, 공통 디스패처를 통해 필드 설정 UI를 호출합니다.

| 컨텐츠 컴포넌트 | 연동 방식 | 인라인 HTML | 설계 특징 |
|---|---|:---:|---|
| **SearchBuilder** | `CommonFieldDispatcher` | ❌ | 행(Row) 기반 필드 배치 및 타입별 디스패칭 |
| **FormBuilder** | `CommonFieldDispatcher` | ❌ | 12칸 그리드 기반 자유 배치 및 디스패칭 |
| **LayerBuilder** | `CommonFieldDispatcher` | ❌ | 섹션별 필드 구성 및 디스패칭 |
| **TableBuilder** | 전용 TableColumn 계열 | ❌ | 컬럼 셀 타입별 고정 설정 UI 제공 |
| **SpaceBuilder** | 직접 구현 (전환 예정) | ✅ | 아이템 구조 고유 (향후 L3 아키텍처로 통합 대상) |

### 6-1. 설계의 의도 (Design Intent)

우리가 지향하는 "표준화된 인풋 시스템"의 핵심은 **"빌더가 필드를 몰라야 한다"**는 것입니다.
- 빌더는 필드의 데이터 구조(`Config`)만 관리합니다.
- 필드를 어떻게 편집할지는 `CommonFieldDispatcher`가 결정합니다.
- 실제 편집 UI는 `builder/fields/` 에 위치한 컴포넌트들이 담당합니다.

이러한 **3계층 구조(Page-Dispatcher-Field)**를 통해 빌더 페이지 코드량을 획기적으로 줄이고, 새로운 필드 타입 추가 시 기존 빌더들을 수정할 필요가 없는 **확장성**을 확보합니다.

---

## 7. 새 필드 타입 추가 방법

### SearchField/FormField 계열에 새 타입 추가

```
1. types.ts
   SearchFieldType 유니온에 새 타입 추가
   예) | 'textarea'

2. builder/fields/TextareaField.tsx 생성
   FieldEditProps를 받아 FieldBase + 필요한 설정 UI 구성

3. builder/fields/index.ts
   export { TextareaField } from './TextareaField'; 추가

4. SearchBuilder.tsx
   FIELD_TYPES 배열에 새 타입 항목 추가
   import TextareaField 추가 후 renderFieldEdit() 분기에 case 추가

5. FormBuilder.tsx (Form에서도 지원 시)
   FORM_FIELD_TYPES 배열에 추가
   renderFieldEdit() 분기에 case 추가

6. renderer/FieldRenderer.tsx
   switch(field.type) case 'textarea': 렌더링 추가
   → 미리보기/실제 페이지 자동 반영
```

> ⚠️ FieldRenderer는 SearchRenderer와 FormRenderer가 **공통으로 재사용**합니다.
> 새 타입을 FieldRenderer에 한 번만 추가하면 미리보기·실제 페이지 모두 자동 반영됩니다.

### TableColumn 계열에 새 셀 타입 추가

```
1. types.ts
   CellType 유니온에 새 타입 추가
   예) | 'rating'

2. builder/fields/RatingField.tsx 생성
   ColEditProps를 받아 셀 타입 전용 설정 UI 구성

3. builder/fields/index.ts
   export { RatingField } from './RatingField'; 추가
   export type { ColEditProps } from './col-types'; (이미 있음)

4. TableBuilder.tsx
   renderColumnEdit() 및 Phase 2 다이얼로그에 분기 추가
   {col.cellType === 'rating' && <RatingField values={col} onChange={patch} />}

5. renderer/TableCellRenderer.tsx
   cellType === 'rating' 케이스 렌더링 추가
   → preview / live 모드 분기 구현
```
