# 레이어 팝업 빌더 FE 상세 설계서 (Service Screen Plan)

## 1. 개요 및 퍼블리싱 자산 연결

- **설계 목적**: 코드 없이 팝업 폼 구조를 시각적으로 구성하고, TSX 컴포넌트 코드를 자동 생성/저장하는 도구 제공
- **참조 자산**:
  - 페이지: `bo/src/app/admin/templates/make/layer/page.tsx`
  - API 클라이언트: `bo/src/lib/api.ts`
  - 상태관리: 전역 상태 없음 (페이지 내 지역 상태 전용)
- **참조 페이지 (통일성 기준)**: `bo/src/app/admin/templates/make/list/page.tsx`

---

## 2. 데이터 마스터 및 유효성 검사 (Master Validation Table)

### 2.1 팝업 기본 설정 필드

| 필드명 (UI) | Key | 타입 | 필수 | 검증 규칙 | 비고 |
|:---|:---|:---|:---|:---|:---|
| 팝업 유형 | `layerType` | `'center' \| 'right'` | Y | 중앙 팝업 / 우측 드로어 | 헤더 탭으로 전환 |
| 팝업 제목 | `layerTitle` | String | N | 최대 100자 / 빈값 시 '레이어 팝업' 기본값 사용 | 미리보기·생성 코드에 반영 |
| 팝업 너비 | `layerWidth` | `'sm' \| 'md' \| 'lg' \| 'xl'` | Y | 중앙 팝업 유형에서만 노출 | sm=384px / md=448px / lg=512px / xl=576px |

### 2.2 폼 필드 설정 (LayerFieldConfig)

| 필드명 (UI) | Key | 타입 | 필수 | 검증 규칙 | 에러 메시지 |
|:---|:---|:---|:---|:---|:---|
| 라벨 | `label` | String | Y | 1자 이상 (공백만 불가) | 라벨을 입력해주세요. |
| 필드 키 | `fieldKey` | String | N | 영문+숫자+_ / 미입력 시 라벨 자동변환 | - |
| 유형 | `type` | LayerFieldType | Y | input/select/textarea/date/radio/checkbox | - |
| 열 너비 | `colSpan` | `1 \| 2` | Y | 1열 또는 2열 | - |
| Placeholder | `placeholder` | String | N | input/textarea/select에서만 사용 | - |
| 필수 여부 | `required` | Boolean | N | - | - |
| 옵션 목록 | `options` | String[] | 조건부 | select/radio/checkbox 유형 시 1개 이상 필수 | 옵션을 1개 이상 입력해주세요. |
| 행 수 | `rows` | Number | N | textarea 전용, 2~10 사이 | - |
| 최소 글자 | `minLength` | Number | N | input 전용, 양의 정수 | - |
| 최대 글자 | `maxLength` | Number | N | input/textarea 전용, 양의 정수 | - |
| 정규식 패턴 | `pattern` | String | N | input 전용, 유효한 정규식 문자열 | - |
| 패턴 설명 | `patternDesc` | String | N | pattern 입력 시 노출 | - |
| 최소 선택 | `minSelect` | Number | N | checkbox 전용, 양의 정수 | - |
| 최대 선택 | `maxSelect` | Number | N | checkbox 전용, 양의 정수 | - |

### 2.3 저장/생성 모달 필드

| 필드명 (UI) | Key | 타입 | 필수 | 검증 규칙 | 에러 메시지 |
|:---|:---|:---|:---|:---|:---|
| 템플릿 이름 | `name` | String | Y | 1자 이상 | 템플릿 이름을 입력해주세요. |
| Slug | `slug` | String | Y | 1자 이상 (중복 시 BE 409 반환) | Slug를 입력해주세요. |
| 설명 | `description` | String | N | 최대 200자 | - |
| 생성 Slug | `generateSlug` | String | Y | 1자 이상 | Slug를 입력해주세요. |

### 2.4 필드별 상세 Validation 시나리오

#### 2.4.1 필드 추가 — 라벨 (`label`)

| 검증 시점 | 조건 | 결과 | 에러 메시지 |
|:---|:---|:---|:---|
| 추가 버튼 클릭 | 빈 문자열 또는 공백만 입력 | 버튼 disabled (클릭 불가) | - |
| 추가 버튼 클릭 | 정상 입력 | `confirmAddField()` 실행 | - |

#### 2.4.2 필드 추가 — 옵션 (select/radio/checkbox)

| 검증 시점 | 조건 | 결과 |
|:---|:---|:---|
| 추가 버튼 클릭 | 유효 옵션(text 있는 항목) 0개 | 버튼 disabled (클릭 불가) |
| 추가 버튼 클릭 | 유효 옵션 1개 이상 | 추가 진행 (value 없으면 text를 value로 사용) |

#### 2.4.3 저장 모달 — 이름/Slug

| 검증 시점 | 조건 | 결과 |
|:---|:---|:---|
| 저장 버튼 | 이름 또는 Slug 빈 값 | 버튼 disabled |
| 저장 API 응답 | 409 Conflict | 에러 토스트 (응답 message 표시) |

---

## 3. 기능 상세 구현 로직 (Functional Implementation Logic)

### 3.1 이벤트 및 핸들러 명세

| 대상 | 이벤트 | 동작 및 상세 로직 | 연동 API |
|:---|:---|:---|:---|
| 팝업 유형 탭 | Click | `layerType` 전환 → 미리보기 즉시 전환 | - |
| 팝업 제목 | onChange | `layerTitle` 업데이트 → 미리보기 즉시 반영 | - |
| 팝업 너비 | onChange | `layerWidth` 업데이트 → 미리보기 즉시 반영 (center 유형만) | - |
| 왼쪽 패널 닫기(X) | Click | `leftPanelOpen = false` → 그리드 1열로 전환 | - |
| 왼쪽 패널 열기(아이콘) | Click | `leftPanelOpen = true` → 그리드 2열로 전환 | - |
| 미리보기/코드 탭 | Click | `activeTab` 전환 | - |
| 행 추가 버튼 | Click | `fieldRows`에 빈 행 추가 (`uid()` ID 생성) | - |
| 행 삭제 버튼 | Click | 해당 행 제거 + `showFieldPicker` 초기화 | - |
| 행 이동 (↑↓) | Click | `fieldRows` 배열 내 인덱스 교환 | - |
| 필드 추가 버튼 | Click | `showFieldPicker = rowIdx` → 유형 선택 다이얼로그 표시 | - |
| 유형 선택 | Click | `pendingType` 설정 + 관련 상태 초기화 → 세부 설정 폼 표시 | - |
| 유형 변경 링크 | Click | `pendingType = null` → 유형 선택 화면으로 돌아감 | - |
| 추가 확인 버튼 | Click | validation → `newField` 생성 → 해당 행에 push → `pendingType/Label` 초기화 | - |
| 추가 취소 버튼 | Click | `pendingType/Label/FieldKey`, `showFieldPicker` 초기화 | - |
| 필드 아이템 | Click | `editingField` 토글 (같은 ID 재클릭 시 닫힘) | - |
| 필드 편집 (인라인) | onChange | `updateField(id, updates)` → `fieldRows` 즉시 업데이트 | - |
| 필드 삭제 | Click | `removeField(rowIdx, id)` → 행이 비면 행도 자동 제거 + `editingField` 초기화 | - |
| 필드 이동 (↑↓) | Click | `moveField(rowIdx, fieldIdx, dir)` → 같은 행 내 순서 교환 | - |
| 불러오기 버튼 | Click | `showLoadModal = true` → 즉시 `GET /page-templates` 호출 | `GET /api/v1/page-templates` |
| 불러오기 목록 선택 | Click | `restoreFromConfigJson()` → 상태 복원 + `currentTemplateId/Name` 설정 | - |
| 저장 버튼 | Click | `showSaveModal = true` + `saveModalName` 현재 템플릿명으로 초기화 | - |
| 저장 확인 | Click | validation → `currentTemplateId` 유무에 따라 POST/PUT → 성공 시 토스트 + 모달 닫기 | `POST /api/v1/page-templates` 또는 `PUT /api/v1/page-templates/{id}` |
| 생성 버튼 | Click | `showGenerateModal = true` + `generateSlug` 현재 slug로 초기화 | - |
| 생성 확인 | Click | validation → `buildLayerTsx()` 실행 → `currentTemplateId` 유무에 따라 POST/PUT (tsxCode 포함) → 성공 시 토스트 | `POST /api/v1/page-templates` 또는 `PUT /api/v1/page-templates/{id}` |
| 코드 복사 버튼 | Click | `navigator.clipboard.writeText(generatedCode)` → `copied = true` → 2초 후 복원 | - |
| 미리보기 필드 | onChange | `previewValues[field.id]` 업데이트 (인터랙티브 미리보기) | - |

### 3.2 화면 상태 변화 (State Transition)

**페이지 지역 상태 목록**:

| 상태명 | 타입 | 초기값 | 설명 |
|:---|:---|:---|:---|
| `fieldRows` | `LayerRowConfig[]` | `[]` | 구성된 폼 행 + 필드 전체 |
| `layerTitle` | `string` | `'레이어 팝업'` | 팝업 제목 |
| `layerType` | `'center' \| 'right'` | `'center'` | 팝업 유형 |
| `layerWidth` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | 팝업 너비 (중앙만) |
| `leftPanelOpen` | `boolean` | `true` | 왼쪽 빌더 패널 표시 여부 |
| `activeTab` | `'preview' \| 'code'` | `'preview'` | 우측 탭 |
| `copied` | `boolean` | `false` | 코드 복사 완료 상태 (2초 후 false) |
| `showFieldPicker` | `number \| null` | `null` | 필드 추가 다이얼로그를 열 행 인덱스 |
| `pendingType` | `LayerFieldType \| null` | `null` | 추가 중인 필드 유형 |
| `pendingLabel` | `string` | `''` | 추가 중인 라벨 |
| `pendingFieldKey` | `string` | `''` | 추가 중인 필드 키 |
| `pendingColSpan` | `1 \| 2` | `1` | 추가 중인 열 너비 |
| `pendingPlaceholder` | `string` | `''` | 추가 중인 Placeholder |
| `pendingRequired` | `boolean` | `false` | 추가 중인 필수 여부 |
| `pendingRows` | `number` | `3` | 추가 중인 textarea 행 수 |
| `pendingOptions` | `{text, value}[]` | `[]` | 추가 중인 옵션 목록 |
| `pendingMinLength` | `number \| undefined` | `undefined` | 최소 글자 수 |
| `pendingMaxLength` | `number \| undefined` | `undefined` | 최대 글자 수 |
| `pendingPattern` | `string` | `''` | 정규식 패턴 |
| `pendingPatternDesc` | `string` | `''` | 패턴 설명 |
| `pendingMinSelect` | `number \| undefined` | `undefined` | 최소 선택 수 |
| `pendingMaxSelect` | `number \| undefined` | `undefined` | 최대 선택 수 |
| `editingField` | `string \| null` | `null` | 인라인 편집 중인 필드 ID |
| `previewValues` | `Record<string, string>` | `{}` | 미리보기 인터랙티브 값 |
| `currentTemplateId` | `number \| null` | `null` | 현재 불러온/저장된 템플릿 ID |
| `currentTemplateName` | `string` | `''` | 현재 템플릿 이름 (헤더 배지 표시) |
| `showSaveModal` | `boolean` | `false` | 저장 모달 표시 |
| `saveModalName` | `string` | `''` | 저장 모달 — 이름 입력값 |
| `saveModalSlug` | `string` | `''` | 저장 모달 — Slug 입력값 |
| `saveModalDesc` | `string` | `''` | 저장 모달 — 설명 입력값 |
| `isSaving` | `boolean` | `false` | 저장 API 호출 중 (중복 클릭 방지) |
| `showLoadModal` | `boolean` | `false` | 불러오기 모달 표시 |
| `templateList` | `{id, name, slug, configJson}[]` | `[]` | 불러오기 목록 |
| `isLoadingList` | `boolean` | `false` | 목록 로딩 중 |
| `showGenerateModal` | `boolean` | `false` | 생성 모달 표시 |
| `generateSlug` | `string` | `''` | 생성 모달 — Slug 입력값 |
| `isGenerating` | `boolean` | `false` | 생성 API 호출 중 (중복 클릭 방지) |

**주요 상태 전이 흐름**:

1. 페이지 진입 → 빈 상태 (필드 없음 → dashed 박스 빈 상태 미리보기 표시)
2. 행 추가 → `fieldRows`에 빈 행 추가 → "필드 추가" 버튼 표시
3. 필드 추가 다이얼로그 열기 → 유형 선택 → 세부 설정 → 추가 확인 → `fieldRows` 업데이트 → 미리보기 즉시 반영
4. 불러오기 클릭 → 목록 API 호출 → 선택 → `restoreFromConfigJson()` → 상태 전체 복원
5. 저장 클릭 → 모달 → 이름/Slug 입력 → API 호출 → 성공 시 `currentTemplateId/Name` 업데이트 + 헤더 배지 표시
6. 생성 클릭 → 모달 → Slug 입력 → `buildLayerTsx()` → API 호출 (tsxCode 포함) → 성공 토스트

### 3.3 API 엔드포인트 명세

| Method | URL | 설명 | Request Body | Response |
|:---|:---|:---|:---|:---|
| GET | `/api/v1/page-templates` | 저장된 템플릿 전체 목록 조회 | - | `PageTemplate[]` |
| POST | `/api/v1/page-templates` | 신규 템플릿 저장 | `{ name, slug, description, configJson, tsxCode? }` | `PageTemplate` |
| PUT | `/api/v1/page-templates/{id}` | 기존 템플릿 수정 (저장/생성 공용) | `{ name, slug, description, configJson, tsxCode? }` | `PageTemplate` |

> `tsxCode`는 "생성" 버튼 시에만 포함. "저장" 버튼은 `configJson`만 전송.

**PageTemplate 응답 타입**:

```typescript
interface PageTemplate {
  id: number;
  name: string;
  slug: string;
  description?: string;
  configJson: string;   // JSON.stringify({ fieldRows, layerTitle, layerType, layerWidth })
  pageUrl?: string;     // TSX 생성 시 반환되는 접근 경로
}
```

**configJson 내부 구조**:

```json
{
  "fieldRows": [{ "id": "l1", "fields": [...] }],
  "layerTitle": "팝업 제목",
  "layerType": "center",
  "layerWidth": "md"
}
```

### 3.4 API 에러 핸들링

| HTTP 상태 | 상황 | FE 처리 |
|:---|:---|:---|
| 400 | 잘못된 요청 / Validation 실패 | 에러 토스트 (응답 message 표시) |
| 401 | 인증 만료 | 로그인 페이지 리다이렉트 (api 인터셉터) |
| 403 | 권한 없음 | 에러 토스트 "접근 권한이 없습니다." |
| 409 | Slug 중복 | 에러 토스트 (응답 message 표시) |
| 500 | 서버 오류 | 에러 토스트 "서버 오류가 발생했습니다." |
| 네트워크 | 연결 실패 | 에러 토스트 "네트워크 오류가 발생했습니다." |

---

## 4. 예외 및 특수 정책 (Special Policies)

| 정책 | 상세 |
|:---|:---|
| **코드 자동 생성** | `buildLayerTsx()` — `fieldRows` 변경 시 즉시(실시간) 재계산 (`generatedCode` = `useMemo` 없이 렌더마다 재계산) |
| **configJson 복원** | `restoreFromConfigJson()` 실패 시 에러 토스트만 표시 (기존 상태 유지) |
| **필드 삭제 시 행 자동 정리** | 행의 마지막 필드 삭제 시 해당 행도 자동 제거 |
| **옵션 value 자동 채움** | 옵션 추가 시 value 미입력이면 text 값을 value로 사용 |
| **fieldKey 자동 변환** | 미입력 시 `varName(label)` 함수로 자동변환: 특수문자 → `_`, 숫자 시작 → `field_` 접두어 |
| **저장 vs 생성 구분** | "저장"은 configJson만 (DB 렌더용), "생성"은 tsxCode 포함 (TSX 파일 생성용) |
| **중복 클릭 방지** | `isSaving`, `isGenerating` 동안 확인 버튼 disabled |
| **복사 피드백** | 복사 성공 시 버튼 텍스트 "복사됨"으로 2초간 변경 후 복원 |
| **왼쪽 패널 sticky** | `sticky top-4` — 스크롤 시 패널 고정 |
| **빈 상태 미리보기** | 필드 없을 때: dashed border 박스 (bg 없음), 필드 있을 때: `bg-slate-100` wrapper로 감쌈 |

---

## 5. FE 개발 체크리스트 (05단계 검증 필수)

> ⚠️ **모든 항목이 ✅가 될 때까지 사용자에게 완료 보고를 할 수 없다.**

### 5.1 기본 레이아웃 및 초기 렌더링
- [ ] 페이지 진입 시 왼쪽 패널(340px) + 오른쪽 패널 그리드가 표시되는가?
- [ ] 필드가 없을 때 dashed 박스 빈 상태 UI가 표시되는가?
- [ ] 헤더에 "레이어 팝업 빌더" 제목과 부제목이 표시되는가?
- [ ] `currentTemplateName`이 있을 때 헤더 배지가 표시되는가?

### 5.2 팝업 유형 탭 (왼쪽 패널 헤더)
- [ ] "중앙 팝업" / "우측 드로어" 탭이 pill 스타일로 표시되는가?
- [ ] 탭 클릭 시 `layerType`이 전환되는가?
- [ ] 탭 전환 시 미리보기가 즉시 전환되는가?
- [ ] 활성 탭이 bg-white + shadow-sm으로 강조되는가?
- [ ] "우측 드로어" 선택 시 팝업 너비 설정이 숨겨지는가?

### 5.3 왼쪽 패널 열기/닫기
- [ ] X 버튼 클릭 시 왼쪽 패널이 닫히고 그리드가 1열로 전환되는가?
- [ ] 패널 닫힘 상태에서 열기(PanelLeftOpen) 아이콘이 표시되는가?
- [ ] 열기 아이콘 클릭 시 패널이 다시 열리는가?
- [ ] 왼쪽 패널이 `sticky top-4`로 고정되는가?
- [ ] 왼쪽 패널 콘텐츠가 뷰포트 높이에 맞춰 세로 스크롤되는가?

### 5.4 팝업 기본 설정 (팝업 제목 / 너비)
- [ ] 팝업 제목 입력 시 미리보기에 즉시 반영되는가?
- [ ] 중앙 팝업 유형에서 팝업 너비 select가 표시되는가?
- [ ] 우측 드로어 유형에서 팝업 너비 select가 숨겨지는가?
- [ ] 팝업 너비 변경 시 미리보기 팝업 크기가 즉시 변경되는가?

### 5.5 행 추가/삭제/이동
- [ ] "행 추가" 버튼 클릭 시 행이 추가되는가?
- [ ] 행 삭제 버튼 클릭 시 해당 행이 제거되는가?
- [ ] 행 이동 ↑ 클릭 시 위로 이동하는가?
- [ ] 행 이동 ↓ 클릭 시 아래로 이동하는가?
- [ ] 첫 번째 행의 ↑ 버튼이 disabled인가?
- [ ] 마지막 행의 ↓ 버튼이 disabled인가?
- [ ] 필드가 남아있는 상태에서 행 삭제 시 필드도 함께 제거되는가?

### 5.6 필드 추가 다이얼로그
- [ ] "필드 추가" 버튼 클릭 시 유형 선택 다이얼로그가 표시되는가?
- [ ] 6가지 유형(Input/Select/Textarea/Date/Radio/Checkbox)이 표시되는가?
- [ ] 유형 클릭 시 세부 설정 폼으로 전환되는가?
- [ ] "← 유형 변경" 링크 클릭 시 유형 선택 화면으로 돌아가는가?
- [ ] 라벨 빈 값일 때 "추가" 버튼이 disabled인가?
- [ ] select/radio/checkbox 유형에서 옵션 0개일 때 "추가" 버튼이 disabled인가?
- [ ] 추가 성공 후 다이얼로그가 닫히고 필드가 해당 행에 추가되는가?
- [ ] 추가 성공 후 미리보기에 즉시 반영되는가?
- [ ] "취소" 버튼 클릭 시 다이얼로그가 닫히는가?
- [ ] textarea 유형 선택 시 "행 수" 설정이 표시되는가?
- [ ] input 유형 선택 시 Validation 섹션(최소/최대/패턴)이 표시되는가?
- [ ] checkbox 유형 선택 시 "선택 제한" 섹션(최소/최대 선택)이 표시되는가?
- [ ] pattern 입력 시 "패턴 설명" 입력 필드가 표시되는가?
- [ ] 옵션 "추가" 버튼으로 행이 추가되는가?
- [ ] 옵션 X 버튼으로 해당 옵션이 삭제되는가?

### 5.7 필드 인라인 편집
- [ ] 필드 아이템 클릭 시 인라인 편집 패널이 펼쳐지는가?
- [ ] 동일 필드 재클릭 시 편집 패널이 닫히는가?
- [ ] 라벨 변경 시 `updateField()` 호출 → 미리보기에 즉시 반영되는가?
- [ ] ColSpan 변경 시 미리보기 레이아웃이 즉시 변경되는가?
- [ ] Key 입력 변경이 정상 저장되는가?
- [ ] Placeholder 변경 시 미리보기에 즉시 반영되는가?
- [ ] "필수 항목" 체크 시 라벨 옆 * 표시가 나타나는가?
- [ ] select/radio/checkbox 유형에서 옵션 편집이 가능한가?
- [ ] textarea 유형에서 "행 수" 편집이 가능한가?
- [ ] 활성 편집 패널이 `border-slate-900 bg-slate-50`으로 강조되는가?

### 5.8 필드 삭제/이동
- [ ] 필드 삭제 버튼 클릭 시 해당 필드가 제거되는가?
- [ ] 행의 마지막 필드 삭제 시 행도 자동 제거되는가?
- [ ] 삭제된 필드가 `editingField`였다면 편집 상태가 초기화되는가?
- [ ] 필드 이동 ↑/↓ 클릭 시 같은 행 내에서 순서가 변경되는가?
- [ ] 첫 번째 필드 ↑, 마지막 필드 ↓가 disabled인가?

### 5.9 미리보기 (Preview)
- [ ] 필드가 있을 때 bg-slate-100 배경 wrapper 안에 미리보기가 표시되는가?
- [ ] 중앙 팝업 미리보기가 팝업 카드 형태로 중앙에 표시되는가?
- [ ] 우측 드로어 미리보기가 420px 너비 패널로 오른쪽에 표시되는가?
- [ ] 미리보기 필드가 인터랙티브하게 동작하는가? (값 입력 가능)
- [ ] 2열 필드(colSpan=2)가 전체 너비로 표시되는가?
- [ ] select 필드에 옵션이 없을 때 더미 옵션(옵션1/2/3)이 표시되는가?

### 5.10 코드 뷰 (Code)
- [ ] "코드" 탭 클릭 시 생성된 TSX 코드가 표시되는가?
- [ ] 필드가 없을 때 `// 폼 필드를 추가해주세요` 메시지가 표시되는가?
- [ ] 코드가 `bg-[#161929]` 다크 배경으로 표시되는가?
- [ ] 필드 변경 시 코드가 즉시 업데이트되는가?

### 5.11 코드 복사
- [ ] "코드 복사" 버튼 클릭 시 클립보드에 복사되는가?
- [ ] 복사 성공 시 버튼이 "복사됨"으로 변경되는가?
- [ ] 2초 후 버튼이 "코드 복사"로 복원되는가?

### 5.12 저장 모달
- [ ] "저장" 버튼 클릭 시 모달이 열리는가?
- [ ] 모달 열릴 때 `saveModalName`이 현재 템플릿명으로 초기화되는가?
- [ ] 이름 또는 Slug가 빈 값일 때 "저장" 버튼이 disabled인가?
- [ ] 신규 저장 시 `POST /page-templates` 호출되는가?
- [ ] 기존 템플릿(`currentTemplateId` 있음) 저장 시 `PUT /page-templates/{id}` 호출되는가?
- [ ] 저장 성공 시 성공 토스트가 표시되는가?
- [ ] 저장 성공 시 헤더 배지가 업데이트되는가?
- [ ] 저장 성공 시 모달이 닫히는가?
- [ ] 저장 중 중복 클릭이 방지되는가?
- [ ] 배경(오버레이) 클릭 시 모달이 닫히는가?
- [ ] Slug 중복 시 409 에러 토스트가 표시되는가?

### 5.13 불러오기 모달
- [ ] "불러오기" 버튼 클릭 시 모달이 열리고 즉시 목록 API가 호출되는가?
- [ ] 로딩 중 스피너가 표시되는가?
- [ ] 저장된 템플릿이 없을 때 "저장된 템플릿이 없습니다." 메시지가 표시되는가?
- [ ] 목록에서 항목 클릭 시 `restoreFromConfigJson()`으로 상태가 복원되는가?
- [ ] 현재 불러온 템플릿에 "현재" 배지가 표시되는가?
- [ ] 불러오기 성공 시 성공 토스트가 표시되는가?
- [ ] 불러오기 성공 시 모달이 닫히는가?
- [ ] "닫기" 버튼 또는 배경 클릭 시 모달이 닫히는가?
- [ ] configJson 파싱 실패 시 에러 토스트가 표시되는가?

### 5.14 생성 모달 (TSX 파일 생성)
- [ ] "생성" 버튼 클릭 시 모달이 열리는가?
- [ ] 모달 열릴 때 `generateSlug`가 `saveModalSlug`로 초기화되는가?
- [ ] Slug가 빈 값일 때 "생성" 버튼이 disabled인가?
- [ ] `currentTemplateId` 없을 때 `POST` 호출되는가?
- [ ] `currentTemplateId` 있을 때 `PUT` 호출되는가?
- [ ] 요청 body에 `tsxCode`가 포함되는가?
- [ ] 생성 성공 시 `pageUrl`이 포함된 성공 토스트가 표시되는가?
- [ ] 생성 성공 시 모달이 닫히는가?
- [ ] 생성 중 중복 클릭이 방지되는가?
- [ ] 배경(오버레이) 클릭 시 모달이 닫히는가?

### 5.15 API 에러 핸들링
- [ ] API 400 에러 시 에러 토스트가 표시되는가?
- [ ] API 401 에러 시 로그인 리다이렉트되는가?
- [ ] API 409 에러 시 중복 메시지 토스트가 표시되는가?
- [ ] API 500 에러 시 서버 오류 토스트가 표시되는가?

### 5.16 UI/UX 일관성 (Make > List 기준)
- [ ] 페이지 헤더 구조가 List 페이지와 동일한가? (`text-lg font-bold` + 부제목)
- [ ] 왼쪽 패널 너비(340px)가 List 페이지와 동일한가?
- [ ] 탭 스타일(`bg-slate-100 p-0.5 rounded-md` pill)이 List 페이지와 동일한가?
- [ ] 빈 상태 UI(dashed border 박스)가 List 페이지와 동일한가?
- [ ] 오른쪽 툴바 버튼 배치가 List 페이지와 동일한가?
- [ ] 모달 스타일(헤더/바디/푸터 구조)이 List 페이지와 동일한가?
- [ ] 토스트 위치가 프로젝트 표준과 일치하는가?
- [ ] 버튼 스타일이 프로젝트 표준과 일치하는가?

### 5.17 코드 품질
- [ ] `tsc --noEmit` 실행 결과 신규 에러가 없는가?
- [ ] 불필요한 `console.log`가 제거되었는가?
- [ ] 미사용 import/변수가 없는가?
- [ ] 컴포넌트 props 타입이 명시적으로 정의되었는가?
