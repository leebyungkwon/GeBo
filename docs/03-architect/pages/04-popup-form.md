# 구현 기획서: 팝업 등록/수정 폼 (Popup Form)
> **경로**: `/admin/popups/new`, `/admin/popups/[id]/edit` | **상태**: 설계 완료

---

## 1. 디자인 참조
![팝업 등록/수정 폼](../../02-design/screen_02_popup_form.png)
- **테마**: 2컬럼 레이아웃 (좌: 폼, 우: 미리보기)
- **컴포넌트**: `ImageUploader`, `DatePicker`, `Switch`, `PreviewCanvas`

---

## 2. 화면 상세 명세 (Screen Specs)

### 2.1. 조회 및 렌더링 명세 (View Spec)
- **사용 API**: 
  - `GET /api/v1/popups/[id]`: 수정 모드일 경우 기존 데이터 조회
- **실시간 미리보기**: 
  - 이미지 업로드 시 즉시 우측 미리보기 패널에 렌더링.
  - 디바이스 탭(PC/Mobile) 선택에 따라 미리보기 사이즈 페어링 변경.

### 2.2. 입력 및 검증 명세 (Input & Validation Spec)
표 형식을 사용하여 모든 입력을 정의한다.
| 필드명 | 입력타입 | 필수 | 클라이언트 검증 (Zod) | 백엔드 검증 (Java) | 메시지 |
|-------|---------|:---:|-------------------|-------------------|-------------------|
| **title** | `text` | ✅ | `.min(1).max(100)` | `@NotBlank`, `@Size(max=100)` | "제목은 필수이며 100자 이내입니다." |
| **linkUrl** | `text` | ❌ | `.url().optional()` | `@URL` | "올바른 URL 형식이 아닙니다." |
| **startAt** | `datetime` | ✅ | `z.date()` | `@NotNull` | "시작 일시를 선택해 주세요." |
| **endAt** | `datetime` | ✅ | `z.date()` | `@NotNull` | "종료 일시는 필수입니다." |
| **imagePc** | `file` | ✅ | `z.instanceof(File)` | - | "PC 이미지는 필수입니다." |
| **isActive** | `switch` | ✅ | `z.boolean()` | `@NotNull` | - |

---

## 3. 이벤트 파이프라인 (Event Pipeline)

### 3.1. 이미지 업로드 (`onChange`)
1. **[Step 1] Local Preview**: `URL.createObjectURL`을 사용하여 브라우저 메모리에 미리보기 이미지 생성.
2. **[Step 2] State Sync**: `formState`에 파일 객체 저장 및 미리보기 URL 업데이트.

### 3.2. 저장 버튼 클릭 (`onSubmit`)
1. **[Step 1] Validation (Client)**: Zod 스키마 검증.
2. **[Step 2] Loading**: `isPending: true` 및 제출 버튼 비활성화.
3. **[Step 3] API Integration**: `FormData` 생성 및 전송.
4. **[Step 4] Validation (Server)**: 
   - DTO `@Valid` 검증.
   - 시작/종료 일시 논리적 선후 관계 체크.
5. **[Step 5] Success**: 토스트 표시 후 목록으로 이동.
6. **[Step 6] Error**: HTTP 상태코드별 매핑 에러 처리.

---

## 4. 관련 코드 구조 (Reference Structure)

### Frontend (Next.js)
- `src/app/admin/popups/new/page.tsx`: 등록 페이지
- `src/app/admin/popups/[id]/edit/page.tsx`: 수정 페이지
- `src/components/popups/PopupForm.tsx`: 재사용 가능한 폼 컴포넌트

### Backend (Spring Boot)
- `PopupController.java`: `POST(Multipart)`, `PUT(Multipart)` 요청 처리
- `FileStorageService.java`: S3/R2 이미지 저장 처리
