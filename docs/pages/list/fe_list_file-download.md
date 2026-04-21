# List 첨부파일 다운로드 FE 상세 설계서

> **기능명**: file-download
> **작성일**: 2026-03-30
> **변경 요약**: List 테이블에 `file` 셀 타입 추가 — 첨부파일 수 표시 및 클릭 시 파일 뷰어 팝업 제공
> **기반 버전**: `fe_list_v2.md` (버튼 영역 추가)
> **참조 파일**:
> - `bo/src/app/admin/templates/make/list/page.tsx` (List 빌더)
> - `bo/src/app/admin/generated/[slug]/page.tsx` (동적 렌더러)
> - `bo/src/components/layer/LayerPopupRenderer.tsx` (파일 다운로드 패턴 참조)
> - `docs/pages/layer/fe_layer_file-upload.md` (파일 업로드 필드 설계)

---

## 1. 개요

- **설계 목적**: 레이어 팝업으로 업로드된 파일을 List 화면에서 조회·다운로드할 수 있도록 한다.
- **핵심 시나리오**:
  1. 테이블에 "첨부파일" 컬럼 → 해당 레코드의 총 파일 수 표시 (`📎 3` / 파일 없으면 `-`)
  2. 셀 클릭 → **FileViewerPopup** 오픈
  3. 팝업에서 파일 그룹별 목록 확인 + 파일명 클릭으로 다운로드

- **다중 그룹 구조**: 하나의 레코드에 여러 file 필드가 존재할 수 있음
  ```
  data_json: { "a": "텍스트", "files": [1, 2], "docs": [3] }
                                └── 그룹1 (2개) └── 그룹2 (1개)
  ```
  → 팝업에서 그룹별로 구분해 표시. 그룹 라벨은 연결된 Layer 슬러그의 필드 라벨 참조.

---

## 2. 데이터 마스터 및 유효성 검사

### 2.1 `CellType` 타입 확장

```
기존: 'text' | 'badge' | 'boolean' | 'actions'
변경: 'text' | 'badge' | 'boolean' | 'actions' | 'file'
```

### 2.2 `TableColumnConfig` 신규 필드

| 필드명 (UI) | Key | 타입 | 필수 | 기본값 | 설명 |
|:---|:---|:---|:---|:---|:---|
| 연결 레이어 슬러그 | `fileLayerSlug` | `string` | `file` 타입 시 필수 | `''` | 파일 그룹 라벨 참조용 Layer 슬러그 |

> `accessor` 필드는 `file` 타입에서 미사용. `fileLayerSlug`로 연결된 Layer config에서 `type === 'file'`인 모든 필드를 자동 탐색한다.

### 2.3 빌더 설정 Validation

| 검증 조건 | 에러 메시지 | 처리 방식 |
|:---|:---|:---|
| `cellType === 'file'`이고 `fileLayerSlug` 비어있음 | `"파일 셀 타입은 연결 레이어 슬러그가 필요합니다."` | 저장/생성 버튼 클릭 시 차단 |

---

## 3. 신규 공통 모듈: `FileViewerPopup`

**컴포넌트 경로**: `bo/src/components/layer/FileViewerPopup.tsx`
(LayerPopupRenderer.tsx와 동일 디렉토리 — 파일 다운로드 로직 참조)

### 3.1 Props

| Prop | 타입 | 필수 | 설명 |
|:---|:---|:---|:---|
| `open` | `boolean` | Y | 팝업 열림 여부 |
| `onClose` | `() => void` | Y | 닫기 콜백 |
| `layerSlug` | `string` | Y | Layer 템플릿 슬러그 (파일 필드 정의 참조) |
| `rowData` | `Record<string, unknown>` | Y | 해당 레코드 전체 data_json |

### 3.2 내부 동작 흐름

```
open=true
  │
  ├─ 1. GET /api/v1/page-templates/by-slug/{layerSlug}
  │      → configJson 파싱 → type==='file'인 필드만 추출
  │      → fileFields: { label, fieldKey }[]
  │
  ├─ 2. 각 fileField에서 fileIds 추출
  │      fileIds = rowData[fileField.fieldKey] as number[]
  │      (값이 없거나 배열이 아니면 빈 배열)
  │
  ├─ 3. 전체 fileIds 합산 → GET /api/page-files/meta?ids={ids}
  │      → fileMeta: { id, origName, fileSize }[]
  │
  └─ 4. fileField별로 fileMeta 분류 → 그룹별 렌더링
```

### 3.3 UI 레이아웃

```
┌─────────────────────────────────────────┐
│  📎 첨부파일                        [X] │
├─────────────────────────────────────────┤
│                                         │
│  ── 파일 (2개) ───────────────────────  │
│  [📄 report.jpg          1.2MB ↓다운]  │
│  [📄 screenshot.png      0.5MB ↓다운]  │
│                                         │
│  ── 문서파일 (1개) ──────────────────   │
│  [📄 manual.pdf          3.1MB ↓다운]  │
│                                         │
│  (파일 없는 그룹은 표시 안 함)          │
└─────────────────────────────────────────┘
         [닫기]
```

### 3.4 상태 정의

| 상태명 | 타입 | 초기값 | 설명 |
|:---|:---|:---|:---|
| `loading` | `boolean` | `false` | 메타 로딩 중 |
| `error` | `string \| null` | `null` | 로딩 오류 메시지 |
| `fileGroups` | `FileGroup[]` | `[]` | 그룹별 파일 목록 |
| `downloading` | `number \| null` | `null` | 다운로드 중인 파일 ID |

```typescript
interface FileGroup {
  label: string;        // 필드 라벨 (예: "파일", "문서파일")
  fieldKey: string;     // data_json 키
  files: FileMeta[];    // 해당 그룹 파일 목록
}

interface FileMeta {
  id: number;
  origName: string;
  fileSize: number;     // bytes
}
```

### 3.5 상태별 UI

| 상태 | 표시 내용 |
|:---|:---|
| `loading=true` | 스피너 + "파일 목록을 불러오는 중..." |
| `error !== null` | 에러 아이콘 + 오류 메시지 |
| 모든 그룹 파일 0개 | "첨부된 파일이 없습니다." |
| 정상 | 그룹별 파일 목록 |

---

## 4. 기능 상세 구현 로직

### 4.1 List 빌더 — `file` 셀 타입 추가

#### 4.1.1 컬럼 추가 다이얼로그 변경

셀 타입 목록에 `file` 추가:

| 타입 | 라벨 | 설명 |
|:---|:---|:---|
| `file` | 📎 첨부파일 | 파일 수 표시 + 뷰어 팝업 |

`file` 선택 시 표시 항목:
```
셀 타입: [📎 첨부파일]
연결 레이어 슬러그: [ file1          ]  ← 필수 입력
헤더: [ 첨부파일      ]
너비: [ 80 ] px
정렬: 가운데
```
> `accessor`, `sortable`, `cellOptions` 등 파일 타입에 불필요한 항목은 표시 안 함.

#### 4.1.2 미리보기 렌더링

```
┌──────────────────────┐
│ 📎 2                 │  ← 샘플 숫자 표시
└──────────────────────┘
```
(빌더 미리보기에서는 고정값 `2`로 표시)

### 4.2 동적 렌더러 (`[slug]/page.tsx`) — `file` 셀 렌더링

#### 4.2.1 파일 수 계산 (컴포넌트 마운트 시)

`cellType === 'file'`인 컬럼이 있는 경우:
1. `useEffect`에서 `fileLayerSlug`로 Layer config 로드 (1회)
2. Layer config의 `type === 'file'` 필드 목록 추출 → `fileFields`로 저장
3. 테이블 데이터 로드 후 각 row에서 `fileFields`의 fieldKey로 ID 합산 → 총 파일 수 계산

```typescript
// 파일 수 계산 예시
const getFileCount = (row: Record<string, unknown>, fileFields: FileFieldDef[]): number => {
  return fileFields.reduce((total, f) => {
    const ids = row[f.fieldKey];
    return total + (Array.isArray(ids) ? ids.length : 0);
  }, 0);
};
```

#### 4.2.2 셀 렌더링

| 파일 수 | 표시 | 클릭 동작 |
|:---|:---|:---|
| 0 | `-` (텍스트, 클릭 불가) | 없음 |
| 1 이상 | `📎 {N}` (버튼 스타일) | FileViewerPopup 오픈 |

```tsx
// file 셀 렌더링 예시
case 'file': {
  const count = getFileCount(row, fileFieldsRef.current);
  if (count === 0) return <span className="text-slate-300">-</span>;
  return (
    <button
      onClick={() => { setViewerRow(row); setViewerOpen(true); }}
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-all"
    >
      <Paperclip className="w-3 h-3" />{count}
    </button>
  );
}
```

#### 4.2.3 신규 상태 (렌더러)

| 상태명 | 타입 | 초기값 | 설명 |
|:---|:---|:---|:---|
| `viewerOpen` | `boolean` | `false` | FileViewerPopup 열림 여부 |
| `viewerRow` | `Record<string, unknown> \| null` | `null` | 팝업에 전달할 row 데이터 |
| `fileFields` | `FileFieldDef[]` | `[]` | Layer에서 로드한 file 필드 정의 목록 |
| `fileLayerSlug` | `string` | `''` | file 셀 타입 컬럼의 연결 슬러그 |

```typescript
interface FileFieldDef {
  fieldKey: string;
  label: string;
}
```

### 4.3 API 연동 명세

| # | API | 호출 주체 | 타이밍 | 설명 |
|:---|:---|:---|:---|:---|
| 1 | `GET /api/v1/page-templates/by-slug/{slug}` | 렌더러 / FileViewerPopup | 마운트 1회 | Layer configJson 로드 |
| 2 | `GET /api/page-files/meta?ids={ids}` | FileViewerPopup | open=true 시 | 파일 메타데이터 일괄 조회 |
| 3 | `GET /api/page-files/{id}` | FileViewerPopup | 다운로드 클릭 시 | 파일 스트리밍 다운로드 (blob) |

> API 2, 3은 `/api/v1`이 아닌 `/api` 경로 사용 (`LayerPopupRenderer.tsx`의 `FILE_API_BASE` 패턴 동일 적용)

---

## 5. 예외 처리 (Edge Cases)

| 상황 | 처리 방식 |
|:---|:---|
| `fileLayerSlug`가 유효하지 않은 슬러그 | 팝업에서 에러 메시지 표시: "파일 설정을 불러올 수 없습니다." |
| Layer config에 file 타입 필드 없음 | "첨부된 파일이 없습니다." 표시 |
| 파일 메타 조회 실패 | 에러 메시지 표시: "파일 목록을 불러오지 못했습니다." |
| 다운로드 실패 | `toast.error('파일 다운로드 중 오류가 발생했습니다.')` |
| 다운로드 중 동일 파일 재클릭 | `downloading === id`인 동안 버튼 비활성화 + 스피너 표시 |
| rowData의 fileField 값이 빈 배열 | 해당 그룹 표시 안 함 (파일 0개 그룹 미표시) |
| rowData의 fileField 값이 number[] 아님 | 빈 배열로 처리 |
| 파일 수 0인 row의 셀 클릭 | 클릭 이벤트 없음 (버튼 미표시) |

---

## 6. 공통 모듈 및 유틸리티 활용

- **다운로드 로직**: `LayerPopupRenderer.tsx`의 `downloadFile` 함수와 동일 패턴 적용 (blob URL → a 태그 클릭 → revokeObjectURL)
- **FILE_API_BASE**: `LayerPopupRenderer.tsx`에 정의된 상수와 동일하게 적용
- **api 인스턴스**: `@/lib/api` 공통 axios 인스턴스 사용
- **toast**: `sonner` 라이브러리 공통 사용

---

## 7. FE 개발 체크리스트 (05단계 검증 필수)

> ⚠️ 모든 항목 ✅ 전까지 완료 보고 금지

| # | 항목 | 검증 방법 |
|:---|:---|:---|
| 1 | `CellType`에 `'file'` 추가됨 | TypeScript 컴파일 오류 없음 |
| 2 | `TableColumnConfig`에 `fileLayerSlug?: string` 추가됨 | 타입 정의 확인 |
| 3 | List 빌더 컬럼 추가 다이얼로그에 `📎 첨부파일` 타입 표시 | UI 직접 확인 |
| 4 | `file` 타입 선택 시 `fileLayerSlug` 입력란 표시 (accessor 입력란 미표시) | UI 직접 확인 |
| 5 | `fileLayerSlug` 미입력 시 저장/생성 버튼 클릭 시 에러 토스트 차단 | 빈 슬러그로 저장 시도 |
| 6 | 빌더 미리보기에서 file 셀이 `📎 2` 형태로 표시됨 | 미리보기 탭 확인 |
| 7 | `FileViewerPopup.tsx` 컴포넌트 생성됨 | 파일 존재 확인 |
| 8 | 렌더러에서 `file` 셀 타입 컬럼 마운트 시 Layer config 1회 로드 | 네트워크 탭 요청 1회 확인 |
| 9 | 파일 수 0인 row → 셀에 `-` 표시, 클릭 불가 | 직접 확인 |
| 10 | 파일 수 1 이상인 row → `📎 N` 버튼 표시 및 클릭 시 팝업 오픈 | 직접 확인 |
| 11 | FileViewerPopup에서 파일 메타 로딩 중 스피너 표시 | 네트워크 속도 저하 후 확인 |
| 12 | FileViewerPopup에서 파일 그룹별 분류 표시 (그룹 라벨 + 파일 목록) | 다중 file 필드 레코드 확인 |
| 13 | 파일 없는 그룹은 팝업에 미표시 | 한 그룹만 파일 있는 레코드 확인 |
| 14 | 파일명 클릭 시 다운로드 동작 (브라우저 저장 다이얼로그) | 직접 다운로드 테스트 |
| 15 | 다운로드 중 동일 파일 버튼 비활성화 + 스피너 표시 | 큰 파일로 테스트 |
| 16 | 다운로드 실패 시 에러 토스트 표시 | 네트워크 차단 후 테스트 |
| 17 | `npx tsc --noEmit` 오류 없음 | 터미널 실행, EXIT CODE 0 |
