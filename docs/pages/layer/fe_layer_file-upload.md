# 파일 업로드 필드 타입 FE 상세 설계서 (Service Screen Plan)

## 1. 개요 및 퍼블리싱 자산 연결

- **설계 목적**: 레이어 팝업 빌더에 `file` 타입 필드를 추가하여, 파일 업로드 UI를 코드 없이 구성할 수 있도록 한다.
- **대상 화면**: `Make > Layer` 빌더 (`bo/src/app/admin/templates/make/layer/page.tsx`)
- **참조 자산**:
  - 빌더 페이지: `bo/src/app/admin/templates/make/layer/page.tsx`
  - 공통 타입: `bo/src/app/admin/templates/make/_shared/types.ts`
  - Validation 섹션: `bo/src/app/admin/templates/make/_shared/components/ValidationSection.tsx`
  - 필드 타입 목록: `bo/src/app/admin/templates/make/_shared/components/FieldPickerTypeList.tsx`
- **참조 페이지 (통일성 기준)**: `bo/src/app/admin/templates/make/layer/page.tsx` 내 기존 필드 타입 패턴

---

## 2. 데이터 마스터 및 유효성 검사 (Master Validation Table)

### 2.1 File 타입 전용 설정 필드 (`LayerFieldConfig` 확장)

| 필드명 (UI) | Key | 타입 | 필수 | 기본값 | 검증 규칙 | 에러 메시지 |
|:---|:---|:---|:---|:---|:---|:---|
| 최대 파일 수 | `maxFileCount` | Number | N | `1` | 양의 정수, 1 이상 20 이하 | 최대 파일 수는 1~20 사이의 정수여야 합니다. |
| 개당 최대 용량 | `maxFileSizeMB` | Number | N | `10` | 양의 정수, 1 이상 100 이하 | 개당 용량은 1~100 사이의 정수여야 합니다. |
| 전체 최대 용량 | `maxTotalSizeMB` | Number | N | `20` | 양의 정수, `maxFileSizeMB` 이상 | 전체 용량은 개당 최대 용량(NMB) 이상이어야 합니다. |
| 허용 유형 모드 | `fileTypeMode` | `'doc' \| 'image' \| 'custom' \| ''` | N | `''` (모든 형식 허용) | - | - |
| 허용 확장자 목록 | `allowedExtensions` | `string[]` | N | `[]` (모든 형식 허용) | 커스텀 모드에서만 직접 입력. 각 항목은 `/^\.[a-zA-Z0-9]+$/` 정규식 충족 | 확장자는 점(.)으로 시작하는 영문/숫자여야 합니다. (예: .jpg) |

**fileTypeMode 프리셋 확장자:**

| 모드 | 적용 확장자 |
|:---|:---|
| `doc` (문서) | `.pdf .doc .docx .xls .xlsx .ppt .pptx .txt .hwp` |
| `image` (이미지) | `.jpg .jpeg .png .gif .webp .svg .bmp` |
| `custom` (커스텀) | `allowedExtensions` 배열 직접 사용 |
| `''` (미선택) | 모든 파일 형식 허용 (`accept` 속성 미적용) |

### 2.2 기존 공통 필드 (file 타입에도 적용)

| 필드명 (UI) | Key | 적용 여부 | 비고 |
|:---|:---|:---|:---|
| 라벨 | `label` | ✅ | 필수 |
| 필드 키 | `fieldKey` | ✅ | 미입력 시 라벨 자동변환 |
| ColSpan | `colSpan` | ✅ | 기본 2 (파일 업로드는 공간 필요) |
| RowSpan | `rowSpan` | ✅ | 기본 1 |
| 필수 여부 | `required` | ✅ | - |
| Placeholder | `placeholder` | ❌ | 파일 업로드에 불필요 |
| options / codeGroupCode | - | ❌ | 파일 업로드에 불필요 |

### 2.3 런타임 Validation 시나리오 (Layer 팝업 저장 버튼 클릭 시)

| 검증 순서 | 조건 | 에러 메시지 | 처리 방식 |
|:---|:---|:---|:---|
| 1 | `required=true`이고 선택된 파일 0개 | `"{라벨}은(는) 필수입니다."` | 저장 중단, 메시지 표시 |
| 2 | 선택된 파일 수 > `maxFileCount` | `"파일은 최대 {N}개까지 첨부할 수 있습니다."` | 저장 중단, 메시지 표시 |
| 3 | 개별 파일 크기 > `maxFileSizeMB` MB | `"'{파일명}'의 크기가 {N}MB를 초과합니다."` | 저장 중단, 메시지 표시 |
| 4 | 전체 파일 크기 합계 > `maxTotalSizeMB` MB | `"첨부 파일의 전체 크기는 {N}MB를 초과할 수 없습니다."` | 저장 중단, 메시지 표시 |
| 5 | 허용되지 않는 확장자 파일 포함 | `"허용되지 않는 파일 형식입니다. ({허용목록}만 가능)"` | 저장 중단, 메시지 표시 |

---

## 3. 기능 상세 구현 로직

### 3.1 타입 변경 내역

#### `LayerFieldType` 유니온 타입 확장

```
기존: 'input' | 'select' | 'textarea' | 'date' | 'radio' | 'checkbox'
변경: 'input' | 'select' | 'textarea' | 'date' | 'radio' | 'checkbox' | 'file'
```

#### `LayerFieldConfig` 인터페이스 신규 필드

```typescript
maxFileCount?: number;                          // 최대 파일 수 (기본 1, 범위 1~20)
maxFileSizeMB?: number;                         // 개당 최대 용량 MB (기본 10, 범위 1~100)
maxTotalSizeMB?: number;                        // 전체 최대 용량 MB (기본 20)
fileTypeMode?: 'doc' | 'image' | 'custom' | ''; // 허용 유형 모드 (기본 '' = 모두 허용)
allowedExtensions?: string[];                   // 커스텀 모드 시 확장자 목록 (예: ['.jpg', '.png'])
```

### 3.2 `FIELD_TYPES` 배열 추가 항목

```typescript
{ type: 'file', label: 'File', desc: '파일 업로드', defaultColSpan: 2, defaultRowSpan: 1 }
```

### 3.3 필드 추가 다이얼로그 — file 타입 전용 설정 패널 UI

File 타입 선택 시 아래 설정 항목을 순서대로 표시한다.

```
[라벨 입력]
[Key 입력]
[ColSpan 버튼 토글: 1 2 3 4 5]
[RowSpan 버튼 토글: 1 2 3]

── 파일 업로드 설정 ──────────────────
최대 파일 수       [ 1 ] 개   (1~20)
개당 최대 용량     [ 10 ] MB  (1~100)
전체 최대 용량     [ 20 ] MB

허용 파일 유형
  ● 전체  ○ 문서  ○ 이미지  ○ 커스텀

  [커스텀 선택 시에만 표시]
  확장자 입력: [ .pdf        ] [추가]
  적용 목록:   [.pdf ×] [.csv ×] [.json ×]

── Validation ──────────────────────
☐ 필수 항목
```

**허용 파일 유형 동작 규칙:**

| 선택 | `fileTypeMode` | `allowedExtensions` 처리 |
|:---|:---|:---|
| 전체 | `''` | `[]` (accept 미적용) |
| 문서 | `'doc'` | `[]` (프리셋 상수로 런타임 결정) |
| 이미지 | `'image'` | `[]` (프리셋 상수로 런타임 결정) |
| 커스텀 | `'custom'` | 사용자 입력 배열 그대로 사용 |

**커스텀 확장자 입력 규칙:**
- 입력값 앞에 `.`이 없으면 자동으로 `.` 붙여줌 (예: `zip` → `.zip`)
- 정규식 `/^\.[a-zA-Z0-9]+$/` 불충족 시 추가 버튼 비활성화 + 인라인 에러: `"영문/숫자 확장자만 입력 가능합니다. (예: .jpg)"`
- 중복 입력 시 추가 버튼 비활성화 + 인라인 에러: `"이미 추가된 확장자입니다."`
- `maxTotalSizeMB` 입력 필드는 `maxFileSizeMB` 값보다 작으면 자동으로 `maxFileSizeMB`와 동일한 값으로 보정한다. (에러 표시 없이 조용히 보정)

### 3.4 필드 편집 패널 — file 타입 전용 설정 항목

기존 편집 패널 패턴과 동일하게, 필드 클릭 시 인라인 에디터로 표시한다.

표시 항목:
- 라벨, ColSpan, RowSpan, Key (공통)
- 파일 업로드 설정 4개 항목 (추가 다이얼로그와 동일)
- 필수 여부 토글
- 읽기 전용(readonly) 토글

### 3.5 미리보기 렌더링 (Preview)

```
┌──────────────────────────────────────────────────┐
│ {라벨} {*필수표시}                               │
│ ┌──────────────────────────────────────────────┐ │
│ │  📎 파일 선택  또는 여기에 드래그 & 드롭      │ │
│ └──────────────────────────────────────────────┘ │
│ 최대 {N}개 · 개당 {N}MB · 전체 {N}MB            │
│ 허용: {확장자 목록}  ← allowedExtensions 있을 때만 표시 │
└──────────────────────────────────────────────────┘
```

- 파일 선택 버튼은 `<input type="file" />` (실제 파일 선택 불필요, 외형만 표현)
- 제한 정보 텍스트는 `text-xs text-slate-500` 스타일로 표시
- `fileTypeMode`가 `''`(전체)이면 허용 형식 줄을 표시하지 않는다.
- `fileTypeMode`가 `'doc'`이면 `문서 파일만 허용`, `'image'`이면 `이미지 파일만 허용`, `'custom'`이면 확장자 목록을 표시한다.

### 3.6 TSX 생성 코드 (`buildLayerTsx`) 반영

file 타입 필드가 포함된 템플릿을 생성할 때:

```tsx
{/* 파일 업로드 필드 */}
<div>
  <label>{라벨}{required && <span className="text-red-500 ml-1">*</span>}</label>
  <input
    type="file"
    multiple={maxFileCount > 1}
    // fileTypeMode에 따라 accept 결정
    // 'doc'  → ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.hwp"
    // 'image'→ ".jpg,.jpeg,.png,.gif,.webp,.svg,.bmp"
    // 'custom'→ allowedExtensions.join(',')
    // ''     → accept 속성 없음 (모든 파일)
    accept="{계산된 accept 문자열}"
    onChange={(e) => handleFileChange('{fieldKey}', e.files, {
      maxCount: {maxFileCount},
      maxSizeMB: {maxFileSizeMB},
      maxTotalMB: {maxTotalSizeMB},
      allowedExtensions: {allowedExtensions 배열},
    })}
    className="..."
  />
  <p className="text-xs text-slate-500">
    최대 {maxFileCount}개 · 개당 {maxFileSizeMB}MB · 전체 {maxTotalSizeMB}MB
  </p>
</div>
```

**프리셋 상수 (layer/page.tsx 내 정의):**

```typescript
// 허용 파일 유형 프리셋 확장자 상수
const FILE_TYPE_PRESETS = {
  doc:   ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.hwp'],
  image: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'],
} as const;

// fileTypeMode로 accept 문자열 계산
function getAcceptString(mode: string, customExts: string[]): string {
  if (mode === 'doc')    return FILE_TYPE_PRESETS.doc.join(',');
  if (mode === 'image')  return FILE_TYPE_PRESETS.image.join(',');
  if (mode === 'custom') return customExts.join(',');
  return ''; // 전체 허용
}
```

---

## 4. 예외 처리 (Edge Cases)

### 4.1 입력 & 데이터 검증

| 상황 | 처리 방식 |
|:---|:---|
| maxTotalSizeMB < maxFileSizeMB | maxTotalSizeMB를 maxFileSizeMB와 동일하게 자동 보정 |
| maxFileCount = 0 또는 음수 | 입력 필드 min=1 속성으로 입력 자체를 차단 |
| maxFileSizeMB = 0 또는 음수 | 입력 필드 min=1 속성으로 입력 자체를 차단 |
| 커스텀 확장자에 `.` 없이 입력 (예: `jpg`) | 자동으로 `.jpg`로 변환 후 추가 |
| 커스텀 확장자 정규식 불충족 (예: `.jpg!`) | 추가 버튼 비활성화 + 인라인 에러 표시 |
| 커스텀 확장자 중복 입력 | 추가 버튼 비활성화 + 인라인 에러 표시 |
| 커스텀 모드에서 allowedExtensions 빈 배열로 저장 | 저장은 허용, 런타임에서 모든 파일 허용으로 동작 |
| fileTypeMode 변경 시 (문서→이미지 등) | allowedExtensions 배열 초기화 (`[]`) |

### 4.2 UX & 인터랙션

| 상황 | 처리 방식 |
|:---|:---|
| 미리보기에서 파일 선택 클릭 | 실제 선택 불필요, 빌더 내에서는 인터랙션 없음 (디자인 전용) |
| 설정값 미입력(undefined) 상태로 저장 | 기본값(maxFileCount=1, maxFileSizeMB=10, maxTotalSizeMB=20)으로 저장 |

### 4.3 런타임 (생성된 페이지에서)

| 상황 | 처리 방식 |
|:---|:---|
| 동일 파일 중복 첨부 | 파일명+크기 기준으로 중복 제거 후 토스트 안내 |
| 브라우저가 drag & drop 미지원 | `input[type=file]` 버튼 방식으로 fallback |

---

## 5. 개발 체크리스트 (FE 개발 완료 후 검증 필수)

| # | 항목 | 검증 방법 |
|:---|:---|:---|
| 1 | `LayerFieldType`에 `'file'` 추가됨 | TypeScript 컴파일 오류 없음 확인 |
| 2 | `LayerFieldConfig`에 5개 신규 필드 추가됨 (`fileTypeMode`, `allowedExtensions` 포함) | 타입 정의 코드 확인 |
| 3 | `FIELD_TYPES` 배열에 file 항목 추가됨 | 빌더 필드 타입 목록에 "File 파일 업로드" 표시 확인 |
| 4 | 필드 추가 다이얼로그에서 File 선택 시 전용 설정 항목 표시 | UI 직접 확인 |
| 5 | maxFileCount 입력 범위 1~20 제한 동작 | 0 입력 불가, 21 입력 불가 확인 |
| 6 | maxFileSizeMB 입력 범위 1~100 제한 동작 | 0 입력 불가 확인 |
| 7 | maxTotalSizeMB < maxFileSizeMB 시 자동 보정 동작 | 개당 10MB 설정 후 전체 5MB 입력 → 10MB로 보정 확인 |
| 8 | 허용 파일 유형 라디오 버튼 4개 표시 (전체/문서/이미지/커스텀) | UI 직접 확인 |
| 9 | 커스텀 선택 시에만 확장자 입력 UI 표시 | 전체/문서/이미지 선택 시 입력 UI 미표시 확인 |
| 10 | 커스텀 확장자 `.` 없이 입력 시 자동 변환 (`jpg` → `.jpg`) | 직접 입력 테스트 |
| 11 | 커스텀 확장자 정규식 불충족 또는 중복 입력 시 추가 버튼 비활성화 + 에러 표시 | `.jpg!` 입력, 동일 확장자 재입력 테스트 |
| 12 | 미리보기에 파일 드롭존 UI 렌더링 | 빌더 우측 미리보기에서 file 타입 필드 표시 확인 |
| 13 | 미리보기 허용 형식 텍스트: 전체=미표시, 문서="문서 파일만 허용", 이미지="이미지 파일만 허용", 커스텀=확장자 목록 | 각 모드 전환 후 미리보기 확인 |
| 14 | `FILE_TYPE_PRESETS` 상수 정의 및 `getAcceptString()` 함수 구현 | 코드 확인 |
| 15 | 필드 편집 패널에서 file 타입 전용 설정 편집 가능 | 필드 클릭 후 인라인 에디터에서 설정값 변경 확인 |
| 16 | `buildLayerTsx()`에서 fileTypeMode에 따라 accept 값 올바르게 생성 | 코드 뷰에서 각 모드별 생성 코드 확인 |
| 17 | `npx tsc --noEmit` 오류 없음 | 터미널에서 직접 실행, EXIT CODE 0 확인 |
