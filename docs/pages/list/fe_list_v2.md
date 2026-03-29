# 페이지 메이커 List — 버튼 영역 추가 FE 설계서 (v2)

> **버전**: v2
> **작성일**: 2026-03-27
> **변경 요약**: 페이지 메이커 List에 버튼 영역(버튼 바) 기능 추가
> **기반 버전**: v1 — 기존 `list/page.tsx` 구현 (검색폼 + 테이블)
> **참조 파일**:
> - `bo/src/app/admin/templates/make/list/page.tsx`
> - `bo/src/app/admin/generated/[slug]/page.tsx`
> - `bo/src/app/admin/templates/make/_shared/types.ts`

---

## 1. 개요 및 퍼블리싱 자산 연결

- **설계 목적**: 페이지 메이커로 생성한 List 페이지에 버튼 영역(등록, 엑셀다운로드 등)을 추가·배치할 수 있는 기능 제공
- **기능 위치**: 버튼은 `검색폼 위(above)` 또는 `검색폼과 테이블 사이(between)` 두 위치 중 선택 가능
- **참조 자산**:
  - 페이지 메이커 빌더: `bo/src/app/admin/templates/make/list/page.tsx`
  - 동적 렌더러: `bo/src/app/admin/generated/[slug]/page.tsx`
  - 공통 타입: `bo/src/app/admin/templates/make/_shared/types.ts`
  - 공통 스타일: `bo/src/app/admin/templates/make/_shared/styles.ts`
  - 공통 유틸: `bo/src/app/admin/templates/make/_shared/utils.ts`

---

## 2. 데이터 마스터 및 유효성 검사 (Master Validation Table)

### 2.1 ButtonConfig 타입 (신규)

| 필드명 (UI) | Key | 타입 | 필수 | 검증 규칙 | 에러 메시지 |
|:---|:---|:---|:---|:---|:---|
| 버튼 ID | `id` | String | Y | 자동 생성 (createIdGenerator) | — |
| 버튼 라벨 | `label` | String | Y | 1자 이상, 공백만 불가 | 버튼 라벨을 입력해주세요. |
| 버튼 유형 | `type` | `'primary' \| 'secondary' \| 'danger'` | Y | 3가지 중 하나 | — |
| 버튼 액션 | `action` | `'register' \| 'excel' \| 'custom'` | Y | 3가지 중 하나 | — |
| 팝업 Slug | `popupSlug` | String | 조건부 | action이 `register`이고 팝업 연동 시 필수 | 팝업 Slug를 입력해주세요. |
| 아이콘 | `icon` | String | N | lucide-react 아이콘명 (예: Plus, Download) | — |

### 2.2 ConfigJson 구조 변경 (신규 필드)

| 필드명 | Key | 타입 | 기본값 | 설명 |
|:---|:---|:---|:---|:---|
| 버튼 목록 | `buttons` | `ButtonConfig[]` | `[]` | 버튼 설정 배열 (없으면 버튼 영역 미출력) |
| 버튼 위치 | `buttonPosition` | `'above' \| 'between'` | `'between'` | above=검색 위, between=검색-테이블 사이 |

### 2.3 버튼 위치 정의

| 값 | 위치 | 설명 |
|:---|:---|:---|
| `above` | 검색폼 위 | 페이지 상단 헤더 바로 아래, 검색폼 위 |
| `between` | 검색폼과 테이블 사이 | 검색폼 아래, 테이블 위 |

### 2.4 버튼 액션 정의

| 값 | 동작 | 비고 |
|:---|:---|:---|
| `register` | 등록 팝업 오픈 또는 등록 페이지 이동 | `popupSlug` 있으면 레이어 팝업 오픈, 없으면 기본 동작 |
| `excel` | 엑셀 다운로드 | 현재 검색 조건 기준으로 다운로드 (향후 연동) |
| `custom` | 사용자 정의 | 빌더에서 직접 라벨만 설정, 로직은 TSX 생성 시 포함 |

---

## 3. 신규 공통 모듈 추출 명세

### 3.1 ButtonConfig 타입 — `_shared/types.ts`에 추가

```typescript
/** 버튼 유형 */
export type ButtonType = 'primary' | 'secondary' | 'danger';

/** 버튼 액션 */
export type ButtonAction = 'register' | 'excel' | 'custom';

/** 버튼 위치 */
export type ButtonPosition = 'above' | 'between';

/** 버튼 설정 */
export interface ButtonConfig {
    id: string;
    label: string;
    type: ButtonType;
    action: ButtonAction;
    popupSlug?: string;  // action이 'register'이고 팝업 연동 시
    icon?: string;       // lucide-react 아이콘명
}
```

### 3.2 ButtonBar 공통 컴포넌트 — `_shared/components/ButtonBar.tsx` (신규)

- **역할**: 버튼 목록을 받아 우측 정렬로 렌더링하는 공통 컴포넌트
- **Props**:
  - `buttons: ButtonConfig[]` — 버튼 설정 목록
  - `onButtonClick?: (btn: ButtonConfig) => void` — 버튼 클릭 핸들러
- **사용처**: 동적 렌더러(`[slug]/page.tsx`), 미리보기 영역

---

## 4. 기능 상세 구현 로직

### 4.1 페이지 메이커 빌더 (`list/page.tsx`) — 버튼 설정 패널

#### 이벤트 핸들러 명세

| 대상 | 이벤트 | 동작 |
|:---|:---|:---|
| 버튼 추가 버튼 | Click | 기본 ButtonConfig 생성 → `buttons` 배열에 추가 |
| 버튼 라벨 input | onChange | 해당 버튼의 `label` 업데이트 |
| 버튼 유형 select | onChange | 해당 버튼의 `type` 업데이트 |
| 버튼 액션 select | onChange | 해당 버튼의 `action` 업데이트, `register` 선택 시 popupSlug 입력 필드 노출 |
| 아이콘 input | onChange | 해당 버튼의 `icon` 업데이트 |
| 팝업Slug input | onChange | 해당 버튼의 `popupSlug` 업데이트 |
| 버튼 삭제 | Click | 해당 버튼 `buttons` 배열에서 제거 |
| 위로/아래로 이동 | Click | 배열 내 순서 변경 (기존 RowHeader 패턴 동일) |
| 버튼 위치 select | onChange | `buttonPosition` 값 업데이트 |

#### 화면 상태 변화

```
buttons: ButtonConfig[]          // 버튼 목록 (기존 fieldRows와 동일 패턴)
buttonPosition: 'above' | 'between'  // 버튼 위치 (기본: 'between')
```

#### UI 배치 (설정 패널 내)

```
[설정 패널]
├── 검색 필드 설정 (기존)
├── 테이블 컬럼 설정 (기존)
└── 버튼 설정 (신규) ──────────────────────────
    ├── 버튼 위치: [검색 위 ▼] or [검색-테이블 사이 ▼]
    ├── [+ 버튼 추가]
    └── 버튼 목록
        └── [버튼 N] ↑↓ 🗑
            ├── 라벨: [____________]
            ├── 유형: [primary ▼]
            ├── 액션: [register ▼]
            ├── 아이콘: [Plus      ] (선택)
            └── (action=register 시) 팝업Slug: [______]
```

### 4.2 미리보기 패널 — 버튼 영역 실시간 반영

| 상태 | 동작 |
|:---|:---|
| `buttonPosition === 'above'` | 검색폼 위에 버튼 그룹 렌더링 |
| `buttonPosition === 'between'` | 검색폼 아래, 테이블 위에 버튼 그룹 렌더링 |
| `buttons.length === 0` | 버튼 영역 미출력 |

### 4.3 configJson 저장 — 기존 buildConfigJson에 buttons 포함

```typescript
// 저장 시 configJson에 포함
const configJson = JSON.stringify({
    fieldRows,
    tableColumns,
    collapsible,
    buttons,          // 신규
    buttonPosition,   // 신규
});
```

### 4.4 동적 렌더러 (`[slug]/page.tsx`) — 버튼 렌더링

#### ConfigJson 타입 변경

```typescript
interface ConfigJson {
    fieldRows: SearchRowConfig[];
    tableColumns: TableColumnConfig[];
    collapsible: boolean;
    buttons?: ButtonConfig[];           // 신규 (없으면 버튼 영역 미출력)
    buttonPosition?: ButtonPosition;    // 신규 (기본: 'between')
}
```

#### 버튼 렌더링 위치 분기

```
[페이지 구조]
├── 페이지 헤더
├── (buttonPosition === 'above') → 버튼 바 렌더링
├── 검색폼
├── (buttonPosition === 'between') → 버튼 바 렌더링
└── 테이블
```

#### 버튼 클릭 핸들러

| action | 동작 |
|:---|:---|
| `register` + `popupSlug` 있음 | `LayerPopupRenderer` 오픈 (기존 패턴 동일) |
| `register` + `popupSlug` 없음 | `console.log` 또는 toast (향후 연동) |
| `excel` | toast('엑셀 다운로드는 추후 연동 예정') |
| `custom` | 아무 동작 없음 (TSX 생성 후 커스터마이징 용도) |

### 4.5 buildTsxFile — 버튼 코드 생성 포함

버튼이 1개 이상 있을 경우 생성 TSX에 포함:

```tsx
// 버튼 바 렌더링 (예시)
const ButtonBar = () => (
    <div className="flex items-center justify-end gap-2">
        <button className="...">등록</button>
        <button className="...">엑셀다운로드</button>
    </div>
);
```

---

## 5. 공통 모듈 및 유틸리티 활용

| 모듈 | 활용 내용 |
|:---|:---|
| `_shared/styles.ts` | `btnPrimary`, `btnSecondary` — 버튼 스타일 |
| `_shared/types.ts` | `ButtonConfig`, `ButtonPosition`, `ButtonType`, `ButtonAction` 추가 |
| `_shared/utils.ts` | `createIdGenerator` — 버튼 id 생성 |
| `_shared/components/RowHeader.tsx` | 버튼 이동/삭제 버튼 (기존 패턴 재사용) |
| `LayerPopupRenderer` | register 액션 + popupSlug 연동 |

---

## 6. 예외 및 보안 정책

| 예외 상황 | 처리 방법 |
|:---|:---|
| `buttons` 필드 없는 기존 템플릿 불러오기 | `buttons: []`, `buttonPosition: 'between'` 기본값 적용 |
| 버튼 라벨 빈값으로 저장 시도 | 저장 전 validation — "버튼 라벨을 입력해주세요." toast |
| `register` 액션에 popupSlug 미입력 | popupSlug 없어도 저장 가능 (클릭 시 기본 동작) |
| 버튼 0개 상태 | 버튼 영역 자체를 렌더링하지 않음 (조건부 렌더링) |

---

## 7. FE 개발 체크리스트 (05단계 검증 필수)

> ⚠️ **이 체크리스트는 05단계 FE Developer가 개발 완료 후 반드시 항목별로 검증하고 ✅/❌ 표시해야 한다.**

---

### 7.1 타입 정의 (`_shared/types.ts`)

| # | 검증 항목 | 결과 |
|:---|:---|:---:|
| 1 | `ButtonType` = `'primary' \| 'secondary' \| 'blue' \| 'success' \| 'danger'` 5가지 정의 | ✅ |
| 2 | `ButtonAction` = `'register' \| 'excel' \| 'custom'` 3가지 정의 | ✅ |
| 3 | `ButtonPosition` = `'above' \| 'between'` 정의 | ✅ |
| 4 | `ButtonConfig` 인터페이스: `id`, `label`, `type`, `action`, `popupSlug?` 포함 | ✅ |
| 5 | `ButtonConfig`에 `icon` 필드가 **없는지** 확인 (퍼블 단계에서 제거됨) | ✅ |

---

### 7.2 빌더 UI (`make/list/page.tsx`)

#### 7.2.1 탭 및 상태
| # | 검증 항목 | 결과 |
|:---|:---|:---:|
| 1 | `activeTab` 타입이 `'search' \| 'table' \| 'button'` 3가지인가 | ✅ |
| 2 | `buttons: ButtonConfig[]`, `buttonPosition: ButtonPosition` state가 선언되었는가 | ✅ |
| 3 | 설정 패널 탭에 "버튼" 탭이 추가되었고 클릭 시 버튼 탭으로 전환되는가 | ✅ |
| 4 | 버튼 탭 클릭 시 LAYER 템플릿 목록이 lazy 로딩되는가 (`loadLayerTemplates` 호출) | ✅ |

#### 7.2.2 버튼 위치 설정
| # | 검증 항목 | 결과 |
|:---|:---|:---:|
| 1 | 버튼 위치 select에 `above`(검색폼 위), `between`(검색폼-테이블 사이) 옵션이 존재하는가 | ✅ |
| 2 | 위치 변경 시 `buttonPosition` state가 즉시 갱신되는가 | ✅ |

#### 7.2.3 버튼 목록 편집
| # | 검증 항목 | 결과 |
|:---|:---|:---:|
| 1 | "버튼 추가" 클릭 시 기본값(`label:'버튼'`, `type:'primary'`, `action:'custom'`)으로 추가되는가 | ✅ |
| 2 | 라벨 입력 시 해당 버튼의 `label`이 즉시 반영되는가 | ✅ |
| 3 | 유형 select에 5가지(`primary/secondary/blue/success/danger`) 옵션이 모두 있는가 | ✅ |
| 4 | 액션 select에 3가지(`register/excel/custom`) 옵션이 모두 있는가 | ✅ |
| 5 | ↑↓ 버튼으로 순서 변경이 동작하는가 | ✅ |
| 6 | 삭제 버튼 클릭 시 해당 버튼이 목록에서 제거되는가 | ✅ |
| 7 | 버튼 0개 상태에서 점선(dashed) 빈 상태 안내가 표시되는가 | ✅ |

#### 7.2.4 팝업 연결 (연결 팝업 select)
| # | 검증 항목 | 결과 |
|:---|:---|:---:|
| 1 | `action=register` 선택 시 "연결 팝업" select가 노출되는가 | ✅ |
| 2 | `action=custom` 선택 시에도 "연결 팝업" select가 노출되는가 | ✅ |
| 3 | `action=excel` 선택 시 "연결 팝업" select가 **미노출**되는가 | ✅ |
| 4 | "연결 팝업" select에 LAYER 타입 템플릿 목록이 정상 표시되는가 | ✅ |
| 5 | LAYER 템플릿이 없을 때 "등록된 LAYER 팝업이 없습니다." 안내가 표시되는가 | ✅ |
| 6 | `register → custom` 전환 시 기존 popupSlug가 유지되는가 | ✅ |
| 7 | `register → excel` 전환 시 popupSlug가 초기화되는가 | ✅ |

#### 7.2.5 헤더 뱃지 색상
| # | 검증 항목 | 결과 |
|:---|:---|:---:|
| 1 | `primary` → 검정 뱃지 | ✅ |
| 2 | `secondary` → 흰 배경 테두리 뱃지 | ✅ |
| 3 | `blue` → 파란 뱃지 | ✅ |
| 4 | `success` → 초록 뱃지 | ✅ |
| 5 | `danger` → 빨간 뱃지 | ✅ |

---

### 7.3 미리보기 반영 (`make/list/page.tsx`)

| # | 검증 항목 | 결과 |
|:---|:---|:---:|
| 1 | `buttonPosition=above` 시 검색폼 **위**에 버튼 바가 렌더링되는가 | ✅ |
| 2 | `buttonPosition=between` 시 검색폼 **아래, 테이블 위**에 버튼 바가 렌더링되는가 | ✅ |
| 3 | `buttons.length === 0` 시 버튼 바 영역이 **미출력**되는가 | ✅ |
| 4 | `primary` 버튼이 검정 배경으로 렌더링되는가 | ✅ |
| 5 | `blue` 버튼이 파란 배경으로 렌더링되는가 | ✅ |
| 6 | `success` 버튼이 초록 배경으로 렌더링되는가 | ✅ |
| 7 | `danger` 버튼이 빨간 배경으로 렌더링되는가 | ✅ |
| 8 | `secondary` 버튼이 테두리 스타일로 렌더링되는가 | ✅ |

---

### 7.4 configJson 저장/불러오기

| # | 검증 항목 | 결과 |
|:---|:---|:---:|
| 1 | 저장 시 configJson에 `buttons` 배열이 포함되는가 | ✅ |
| 2 | 저장 시 configJson에 `buttonPosition` 값이 포함되는가 | ✅ |
| 3 | 불러오기 시 `buttons` 배열이 순서 포함하여 완전히 복원되는가 | ✅ |
| 4 | 불러오기 시 각 버튼의 `label`, `type`, `action`, `popupSlug`가 모두 복원되는가 | ✅ |
| 5 | 불러오기 시 `buttonPosition`이 복원되는가 | ✅ |
| 6 | 기존 템플릿(`buttons` 필드 없음) 불러올 때 `buttons=[]`, `buttonPosition='between'` 기본값이 적용되는가 | ✅ |

---

### 7.5 동적 렌더러 (`[slug]/page.tsx`)

#### 7.5.1 타입 및 구조
| # | 검증 항목 | 결과 |
|:---|:---|:---:|
| 1 | `ConfigJson`에 `buttons?: ButtonConfig[]` 추가되었는가 | ✅ |
| 2 | `ConfigJson`에 `buttonPosition?: ButtonPosition` 추가되었는가 | ✅ |
| 3 | `ButtonConfig`, `ButtonType`, `ButtonAction`, `ButtonPosition` 타입이 선언되었는가 | ✅ |

#### 7.5.2 렌더링 위치
| # | 검증 항목 | 결과 |
|:---|:---|:---:|
| 1 | `buttonPosition=above` 시 검색폼 위에 버튼 바가 렌더링되는가 | ✅ |
| 2 | `buttonPosition=between` 시 검색폼 아래, 테이블 위에 버튼 바가 렌더링되는가 | ✅ |
| 3 | `buttons` 없거나 0개인 경우 버튼 바가 렌더링되지 않는가 | ✅ |
| 4 | 버튼 타입별 색상(primary/secondary/blue/success/danger)이 올바르게 적용되는가 | ✅ |

#### 7.5.3 버튼 클릭 핸들러
| # | 검증 항목 | 결과 |
|:---|:---|:---:|
| 1 | `action=register` + popupSlug 있음 → LayerPopupRenderer가 오픈되는가 | ✅ |
| 2 | `action=register` + popupSlug 없음 → toast 안내가 표시되는가 | ✅ |
| 3 | `action=excel` → `toast('엑셀 다운로드는 추후 연동 예정')` 표시되는가 | ✅ |
| 4 | `action=custom` + popupSlug 있음 → LayerPopupRenderer가 오픈되는가 | ✅ |
| 5 | `action=custom` + popupSlug 없음 → 아무 동작 없는가 (오류 없음) | ✅ |

#### 7.5.4 하위 호환
| # | 검증 항목 | 결과 |
|:---|:---|:---:|
| 1 | `buttons` 필드가 없는 기존 템플릿도 정상 렌더링되는가 | ✅ |
| 2 | `buttonPosition` 미설정 시 `'between'` 기본값이 적용되는가 | ✅ |

---

### 7.6 buildTsxFile

| # | 검증 항목 | 결과 |
|:---|:---|:---:|
| 1 | `buttons`가 1개 이상일 때 TSX에 버튼 바 렌더링 코드가 포함되는가 | ✅ |
| 2 | `buttons`가 0개일 때 버튼 관련 코드가 생성되지 않는가 | ✅ |
| 3 | `buttonPosition`에 따라 버튼 바 위치 코드가 올바르게 생성되는가 | ✅ |
| 4 | 각 버튼의 `type`에 맞는 Tailwind 클래스가 생성 코드에 포함되는가 | ✅ |

---

### 7.7 코드 품질

| # | 검증 항목 | 결과 |
|:---|:---|:---:|
| 1 | `npx tsc --noEmit` 오류 없음 | ✅ |
| 2 | 기존 검색폼 동작(검색, 초기화, validation) 회귀 없음 | ✅ |
| 3 | 기존 테이블 동작(정렬, 셀 렌더링, 팝업 연결) 회귀 없음 | ✅ |
| 4 | 기존 템플릿 저장/불러오기 동작 회귀 없음 | ✅ |
