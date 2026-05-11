# SubList 컨텐츠 컴포넌트 FE 상세 설계서

> 작성일: 2026-05-02
> 버전: v0.2 (2026-05-04 전면 개정)

---

## 1. 개요

### 1.1 설계 목적

다건 행(Row) 배열을 입력·삭제할 수 있는 **독립적인 컨텐츠 컴포넌트**를 제공한다.

Form 컨텐츠와 별개로 존재하며, Form과 동일하게 **`connectedSlug`** 를 통해 자체 API에 연동하고, **Action Button**을 통해 저장한다.

### 1.2 Form 컨텐츠와의 관계

| 항목 | Form 컨텐츠 | SubList 컨텐츠 |
|---|---|---|
| 독립성 | 독립 컨텐츠 | 독립 컨텐츠 (Form의 하위가 아님) |
| API 연동 | `connectedSlug` | `connectedSlug` (동일 패턴) |
| 저장 트리거 | Action Button 연결 | Action Button 연결 (동일 패턴) |
| 저장 Button | 전용 또는 공유 가능 | 전용 또는 Form과 동일 Button 공유 가능 |
| 데이터 구조 | 단일 레코드 (`dataJson`) | 행 배열 (`dataJson`) |

### 1.3 사용 시나리오

```
[ 페이지 레이아웃 ]

  ┌─ Form 컨텐츠 ──────────────────────────┐
  │  connectedSlug: 'board-master'         │
  │  제목 [________________]               │
  │  내용 [________________]               │
  └────────────────────────────────────────┘

  ┌─ SubList 컨텐츠 ───────────────────────┐
  │  connectedSlug: 'board-detail'         │
  │  SubList 3개               [+ 추가]   │
  │  정보1  정보2  정보3  삭제             │
  │  [inp]  [inp]  [inp]  🗑️             │
  │  [inp]  [inp]  [inp]  🗑️             │
  └────────────────────────────────────────┘

  ┌─ Space 컨텐츠 (버튼 영역) ────────────┐
  │  [저장] ← Form + SubList 동시 연결    │
  │  [취소]                               │
  └────────────────────────────────────────┘
```

### 1.4 참조 파일

| 역할 | 경로 |
|---|---|
| 빌더 설정 UI | `bo/src/app/admin/templates/make/_shared/components/builder/SubListBuilder.tsx` |
| 렌더러 | `bo/src/app/admin/templates/make/_shared/components/renderer/SubListRenderer.tsx` |
| 위젯 타입 정의 | `bo/src/app/admin/templates/make/_shared/components/renderer/types.ts` |
| 버튼 빌더 | `bo/src/app/admin/templates/make/_shared/components/builder/fields/ActionButtonField.tsx` |
| 빌더 분기 허브 | `bo/src/app/admin/templates/make/_shared/components/builder/CommonBuilderDispatcher.tsx` |
| 렌더러 분기 허브 | `bo/src/app/admin/templates/make/_shared/components/renderer/WidgetRenderer.tsx` |
| 템플릿 확인 페이지 | `bo/src/app/admin/templates/builder-contents-layout/page.tsx` |

---

## 2. 타입 정의

### 2.1 SubListColumn — 컬럼 설정

```ts
interface SubListColumn {
    id: string;                  // 컬럼 고유 ID (자동 생성)
    key: string;                 // 데이터 키 (영문 필수)
    label: string;               // 헤더 표시명
    type: SubListColumnType;     // 셀 입력 타입
    required?: boolean;          // 필수 여부
    placeholder?: string;        // 입력 placeholder
    options?: string[];          // select 타입 전용 옵션 목록
    codeGroup?: string;          // 공통코드 그룹 연결 (select 타입)
    maxFileCount?: number;       // file/image 타입 최대 파일 수
    maxFileSizeMB?: number;      // file/image 타입 최대 파일 크기
    fileTypeMode?: string;       // file 타입 허용 형식 (doc/image/video/custom)
}

/** 컬럼 셀 입력 타입 */
type SubListColumnType =
    | 'input'      // 텍스트 입력
    | 'select'     // 셀렉트 (옵션 또는 공통코드)
    | 'date'       // 날짜 선택
    | 'dateRange'  // 날짜 범위 (from~to)
    | 'textarea'   // 여러 줄 텍스트
    | 'file'       // 파일 첨부
    | 'image';     // 이미지 업로드
```

### 2.2 SubListWidget — 위젯 설정

```ts
interface SubListWidget {
    type: 'sublist';
    widgetId: string;
    connectedSlug?: string;      // ★ API 연동 대상 slug (Form과 동일 패턴)
    contentKey: string;          // 위젯 식별 키 (영문 필수, 페이지 내 고유)
    title?: string;              // 헤더 타이틀
    addButtonLabel?: string;     // 추가 버튼 텍스트 (기본 '추가')
    maxRows?: number;            // 최대 행 수 (0 = 제한 없음)
    showBorder?: boolean;        // 테두리 표시 여부 (기본 true)
    columns: SubListColumn[];    // 컬럼 설정 목록
}
```

### 2.3 AnyWidget 유니온 확장

```ts
export type AnyWidget =
    | TextWidget
    | SearchWidget
    | TableWidget
    | FormWidget
    | SpaceWidget
    | CategoryWidget
    | SubListWidget;  // ← 추가됨
```

### 2.4 행 데이터 구조 (런타임)

```ts
/** 렌더러 내부에서 관리하는 행 데이터 */
interface SubListRow {
    _rowId: string;          // 행 고유 키 (UI 전용, API 전송 제외)
    [key: string]: unknown;  // 컬럼 key → 값 매핑
}
```

### 2.5 Action Button — SubList 연결 타입 확장

```ts
// ActionButtonField 기존 connType에 'sublist' 추가
interface ActionButtonConfig extends SearchFieldConfig {
    connType: '' | 'form' | 'sublist' | 'popup' | 'path' | 'close';

    // SubList 연결 (connType='sublist')
    connectedSubListWidgetId?: string;  // 연결할 SubList widgetId
    sublistAction?: 'save';             // 실행할 동작 (현재는 저장만)
}
```

---

## 3. 빌더 설정 UI (SubListBuilder)

### 3.1 설정 패널 구성

```
┌─ SubList 설정 ──────────────────────────────────┐
│ [기본 설정]                                       │
│   연결 Slug     [ board-detail       ]  ← ★ 신규 │
│   Content Key   [ boardDetails       ]           │
│   타이틀        [ 상세 정보          ]            │
│   추가버튼 텍스트 [ + 추가           ]            │
│   최대 행 수    [ 0  ] (0 = 무제한)               │
│   테두리 표시   [ ON / OFF ]                      │
│                                                   │
│ [컬럼 설정]                                       │
│  ┌───────────────────────────────────────────┐   │
│  │ # │ 헤더명 │  Key  │  타입  │ 필수 │ 관리 │   │
│  │ 1 │ 정보1  │ info1 │ input  │  ✅  │ ✏️🗑 │   │
│  │ 2 │ 정보2  │ info2 │ select │      │ ✏️🗑 │   │
│  └───────────────────────────────────────────┘   │
│  [+ 컬럼 추가]                                    │
└───────────────────────────────────────────────────┘
```

### 3.2 기본 설정 항목 상세

| 항목 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| 연결 Slug | string | `''` | API 저장 대상 slug (Form의 connectedSlug와 동일 패턴) |
| Content Key | string | `''` | 위젯 식별 키 (페이지 내 고유, 영문 필수) |
| 타이틀 | string | `''` | 헤더 왼쪽 표시 텍스트 |
| 추가버튼 텍스트 | string | `'추가'` | 추가 버튼 레이블 |
| 최대 행 수 | number | `0` | 0 = 무제한, 초과 시 추가 버튼 비활성 |
| 테두리 표시 | boolean | `true` | 컴포넌트 외곽 테두리 |

### 3.3 컬럼 타입별 추가 설정

| 타입 | 추가 설정 항목 |
|---|---|
| `input` | Placeholder, 필수 여부 |
| `select` | 옵션 목록 직접 입력 or 공통코드 그룹 연결 |
| `date` | 필수 여부 |
| `dateRange` | 필수 여부 |
| `textarea` | Placeholder, 필수 여부 |
| `file` | 최대 파일 수, 최대 파일 크기(MB), 허용 형식 |
| `image` | 최대 파일 수 |

---

## 4. 렌더러 UI (SubListRenderer)

### 4.1 UI 구조

```
┌─ [타이틀] N개                            [+ 추가] ─┐  ← 헤더
├──────┬──────┬──────┬──────┬──────┬───────────────┤
│ 헤더1│ 헤더2│ 헤더3│ 헤더4│ 헤더5│     삭제       │  ← 컬럼헤더
├──────┼──────┼──────┼──────┼──────┼───────────────┤
│[inp] │[inp] │[inp] │[inp] │[inp] │      🗑️       │  ← 행 (항상 입력 필드)
├──────┼──────┼──────┼──────┼──────┼───────────────┤
│[inp] │[inp] │[inp] │[inp] │[inp] │      🗑️       │  ← 행 (항상 입력 필드)
└──────┴──────┴──────┴──────┴──────┴───────────────┘
│ 등록된 항목이 없습니다.                             │  ← 빈 상태 (live 모드)
└────────────────────────────────────────────────────┘
```

### 4.2 모드별 동작

| 모드 | 동작 |
|---|---|
| **preview** | 샘플 1행 표시, 모든 버튼 disabled, 입력 불가 |
| **live** | 실제 입력 동작, 행 추가/삭제 가능 |

### 4.3 행 구조

행 상태 구분 없음. **모든 행은 항상 입력 필드로 표시된다.**

| 요소 | 설명 |
|---|---|
| 각 셀 | FieldRenderer 입력 컴포넌트 |
| 삭제 버튼 | 🗑️ — confirm 후 행 제거 |

> `+ 추가` 클릭 시 빈 행이 즉시 추가됨.

### 4.4 헤더 영역 구성

| 요소 | 조건 | 설명 |
|---|---|---|
| 타이틀 | `title` 설정 시 표시 | 좌측 텍스트 |
| 행 수 카운트 | 항상 표시 | `N개` 형식 |
| 추가 버튼 | 항상 표시 | `maxRows` 초과 또는 preview 시 disabled |

---

## 5. 데이터 흐름

### 5.1 저장 흐름

```
[+ 추가] 클릭 → 빈 행 추가 → 사용자 입력
                                   │
                                   ▼
                         SubListRenderer 내부 rows 상태 유지

[저장 버튼] 클릭 (connType='sublist', connectedSubListWidgetId)
                                   │
                                   ▼
               WidgetRenderer.handleSubListAction()
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
          rows 배열 수집                  connectedSlug 조회
          (_rowId 제외)                  (widget.connectedSlug)
                    │
                    ▼
          POST/PUT /page-data/{connectedSlug}
          { dataJson: [ { col1: val1, col2: val2 }, ... ] }
```

### 5.2 조회 흐름 (수정 모드)

```
페이지 진입 (editId 있음)
        │
        ▼
GET /page-data/{connectedSlug}/{editId}
        │
        ▼
{ dataJson: [ { col1: val1, col2: val2 }, ... ] }
        │
        ▼
SubListRenderer rows 초기값으로 주입
(externalRows prop → useState 초기화)
```

### 5.3 Button 연결 구조 — ActionButtonField 확장

```
빌더에서 버튼 설정:
  connType = 'sublist'
  connectedSubListWidgetId = SubList의 widgetId
  sublistAction = 'save'

런타임 저장 흐름:
  SpaceRenderer
    └─ handleButtonClick()
         └─ onSubListAction?.(connectedSubListWidgetId, sublistAction)
              └─ WidgetRenderer.handleSubListAction()
                   └─ rows 수집 → API 호출
```

### 5.4 Form + SubList 동일 버튼 공유 시

```
버튼에 Form과 SubList 모두 연결:
  connType = 'form'         → Form 저장
  connType = 'sublist'      → SubList 저장

두 개의 버튼 설정을 하나의 버튼에 순서대로 실행하거나,
별도 버튼으로 분리하는 방식 중 선택.
```

### 5.5 WidgetRenderer Props 확장

```ts
interface WidgetRendererProps {
    // ... 기존 props ...

    /** SubList 행 데이터 (widgetId별 매핑) */
    subListValues?: Record<string, SubListRow[]>;

    /** SubList 행 변경 콜백 */
    onSubListChange?: (widgetId: string, rows: SubListRow[]) => void;

    /** SubList 저장 액션 콜백 (Space 버튼 → WidgetRenderer) */
    onSubListAction?: (widgetId: string, action: 'save') => void;
}
```

---

## 6. 이벤트 및 핸들러 명세

| 대상 | 이벤트 | 동작 |
|---|---|---|
| `+ 추가` 버튼 | Click | 빈 행을 rows에 즉시 추가 |
| 각 셀 입력 | onChange | 해당 행의 해당 컬럼 값 업데이트 |
| `🗑️` 삭제 | Click | confirm(`삭제하시겠습니까?`) → rows 배열에서 행 제거 |
| 저장 Button | Click | WidgetRenderer가 rows 수집 → `POST/PUT /page-data/{connectedSlug}` |

---

## 7. 유효성 검사

### 7.1 컬럼 Key 규칙 (빌더)

| 검증 시점 | 조건 | 처리 |
|---|---|---|
| 빌더 저장 시 | Key 빈 값 | 에러 표시 — Key를 입력하세요 |
| 빌더 저장 시 | 한글/특수문자 포함 | 에러 표시 — 영문·숫자·_ 만 사용 가능 |
| 빌더 저장 시 | 동일 위젯 내 Key 중복 | 에러 표시 — 이미 사용 중인 Key입니다 |

### 7.2 렌더러 동작 규칙

| 조건 | 처리 |
|---|---|
| `maxRows` 초과 | `+ 추가` 버튼 disabled |
| preview 모드 | 모든 버튼 disabled, 입력 불가 |

---

## 8. builder-contents-layout 반영

### 8.1 서브리스트 탭

`builder-contents-layout/page.tsx` 에 `서브리스트` 탭 + 샘플 위젯 데이터 추가되어 있음.

### 8.2 샘플 위젯 데이터

```ts
const SAMPLE_SUBLIST: SubListWidget = {
    type: 'sublist',
    widgetId: 'guide-sublist',
    connectedSlug: 'board-detail',   // ← 추가
    contentKey: 'boardDetails',
    title: '상세 정보',
    addButtonLabel: '+ 추가',
    showBorder: true,
    columns: [
        { id: 'c1', key: 'info1', label: '정보1', type: 'input', required: true },
        { id: 'c2', key: 'info2', label: '정보2', type: 'input' },
        { id: 'c3', key: 'info3', label: '정보3', type: 'select' },
        { id: 'c4', key: 'info4', label: '정보4', type: 'date' },
        { id: 'c5', key: 'info5', label: '정보5', type: 'textarea' },
        { id: 'c6', key: 'info6', label: '정보6', type: 'file' },
    ],
};
```

---

## 9. 수정/추가 파일 목록

| 파일 | 작업 내용 |
|---|---|
| `renderer/types.ts` | `SubListWidget`에 `connectedSlug` 추가 |
| `builder/SubListBuilder.tsx` | `connectedSlug` 입력 필드 추가 |
| `renderer/SubListRenderer.tsx` | 행 항상 입력 필드 표시, `externalRows` 동기화 useEffect 추가 |
| `renderer/WidgetRenderer.tsx` | `subListValues`, `onSubListChange`, `onSubListAction` props 추가 + 저장 핸들러 구현 |
| `renderer/PageGridRenderer.tsx` | sublist 관련 props 자식 WidgetRenderer에 전파 |
| `builder/fields/ActionButtonField.tsx` | `connType='sublist'` 분기 추가 |
| `renderer/SpaceRenderer.tsx` | `onSubListAction` 콜백 연결 |
| `make/quick-detail/page.tsx` | SubList 저장 상태 관리 추가 |

---

## 10. FE 개발 체크리스트

> ⚠️ **모든 항목이 ✅가 될 때까지 완료 보고 불가**

### 10.1 타입 및 구조

- [ ] `SubListWidget`에 `connectedSlug` 필드가 추가되었는가?
- [ ] `ActionButtonConfig`에 `connType='sublist'`, `connectedSubListWidgetId`, `sublistAction` 필드가 추가되었는가?
- [ ] `WidgetRendererProps`에 `subListValues`, `onSubListChange`, `onSubListAction` props가 추가되었는가?

### 10.2 빌더 (SubListBuilder)

- [ ] `connectedSlug` 입력 필드가 빌더에 표시되는가?
- [ ] `contentKey` 영문 검증이 동작하는가?
- [ ] 컬럼 추가/편집/삭제/순서변경이 동작하는가?
- [ ] 컬럼 Key 영문 및 중복 검증이 동작하는가?

### 10.3 버튼 연결 (ActionButtonField)

- [ ] `connType='sublist'` 선택 시 SubList 위젯 목록이 표시되는가?
- [ ] SubList 선택 시 `connectedSubListWidgetId`가 저장되는가?
- [ ] 저장 동작이 선택 가능한가? (`sublistAction='save'`)

### 10.4 렌더러 — preview 모드

- [ ] 샘플 1행이 입력 필드(disabled)로 표시되는가?
- [ ] 추가 버튼이 disabled 상태인가?
- [ ] 삭제 버튼이 disabled 상태인가?
- [ ] preview UI와 live UI가 동일하게 보이는가?

### 10.5 렌더러 — live 모드

- [ ] `+ 추가` 클릭 시 빈 행이 즉시 추가되는가?
- [ ] `+ 추가` 여러 번 클릭 시 행이 계속 추가되는가?
- [ ] 각 셀 입력 시 해당 행의 값이 업데이트되는가?
- [ ] `🗑️` 클릭 시 confirm이 표시되는가?
- [ ] confirm 확인 시 해당 행이 제거되는가?
- [ ] `maxRows` 초과 시 `+ 추가` 버튼이 disabled되는가?

### 10.6 저장 흐름

- [ ] 저장 Button 클릭 시 `onSubListAction` 콜백이 호출되는가?
- [ ] `WidgetRenderer`가 rows를 수집해 `POST/PUT /page-data/{connectedSlug}` 를 호출하는가?
- [ ] 수정 모드 진입 시 기존 rows 데이터가 렌더러에 채워지는가?
- [ ] `externalRows` prop 변경 시 내부 rows 상태가 동기화되는가?

### 10.7 Rule 10 준수

- [ ] 인라인 코딩이 없는가?
- [ ] `builder-contents-layout` 서브리스트 탭에서 확인 가능한가?
- [ ] preview 모드와 live 모드의 UI가 동일한가?
- [ ] `RendererContainer`를 사용하는가?

### 10.8 코드 품질

- [ ] `tsc --noEmit` 실행 결과 신규 에러가 없는가?
- [ ] 불필요한 `console.log`가 없는가?
- [ ] 모든 주석이 한글로 작성되었는가?
