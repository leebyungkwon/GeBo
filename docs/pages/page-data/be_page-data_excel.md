# 페이지 데이터 엑셀 다운로드 BE 설계서

## 1. 개요

- **기능**: 페이지 메이커 List 화면의 데이터를 엑셀(xlsx) 또는 CSV 파일로 전체 다운로드
- **공통화 목표**: `ExcelService`를 별도 공통 서비스로 분리하여 다른 기능에서도 재사용
- **신규 테이블**: 없음 — 기존 `page_data` 테이블 읽기 전용
- **관련 설계서**: [be_page-data.md](./be_page-data.md)

---

## 2. 파일 구조

```
com.ge.bo/
├── common/
│   └── excel/
│       └── ExcelService.java          # 신규 — 공통 엑셀/CSV 생성 서비스
├── service/
│   └── PageDataService.java           # 기존 수정 — exportAll() 메서드 추가
└── controller/
    └── PageDataController.java        # 기존 수정 — GET /{slug}/export 추가
```

---

## 3. API 엔드포인트 명세

| Method | URL | 설명 | 권한 | 성공 코드 |
|:---|:---|:---|:---|:---|
| GET | `/api/v1/page-data/{slug}/export` | 전체 데이터 엑셀/CSV 다운로드 | 인증된 관리자 | 200 |

### 3.1 요청

```
GET /api/v1/page-data/{slug}/export?format=xlsx&name=홍길동&status=active
```

**Path Variable:**

| 파라미터 | 타입 | 필수 | 설명 |
|:---|:---|:---|:---|
| slug | String | Y | 페이지 식별자 |

**Query Params:**

| 파라미터 | 타입 | 기본값 | 설명 |
|:---|:---|:---|:---|
| format | String | `xlsx` | 파일 형식 (`xlsx` \| `csv`) |
| headers | String | - | 컬럼 헤더 목록 (쉼표 구분, 예: `이름,이메일,상태`) |
| keys | String | - | data_json 키 목록 (쉼표 구분, 헤더와 순서 일치, 예: `name,email,status`) |
| 그 외 | String | - | 검색 조건 (기존 목록 조회와 동일) |

### 3.2 응답

```
HTTP 200 OK
Content-Type: application/octet-stream
Content-Disposition: attachment; filename="{slug}_20260331.xlsx"

[바이너리 파일 데이터]
```

---

## 4. 클래스 설계

### 4.1 ExcelService (신규 — 공통)

```java
package com.ge.bo.common.excel;

@Service
public class ExcelService {

    /**
     * xlsx 파일 생성
     * @param headers  컬럼 헤더 목록 (예: ["이름", "이메일", "상태"])
     * @param keys     data_json 키 목록 (헤더와 순서 일치, 예: ["name", "email", "status"])
     * @param rows     데이터 목록 (Map<키, 값>)
     * @param sheetName 시트명
     * @return xlsx 바이트 배열
     */
    public byte[] buildXlsx(List<String> headers, List<String> keys,
                             List<Map<String, Object>> rows, String sheetName);

    /**
     * CSV 파일 생성 (UTF-8 BOM 포함 — 엑셀 한글 깨짐 방지)
     * @param headers  컬럼 헤더 목록
     * @param keys     data_json 키 목록
     * @param rows     데이터 목록
     * @return csv 바이트 배열 (BOM + UTF-8)
     */
    public byte[] buildCsv(List<String> headers, List<String> keys,
                            List<Map<String, Object>> rows);
}
```

**사용 라이브러리**: Apache POI (`org.apache.poi:poi-ooxml:5.3.0`)

### 4.2 PageDataService — exportAll() 추가

```java
/**
 * 전체 데이터 조회 (LIMIT/OFFSET 없음 — 엑셀 다운로드 전용)
 * @param slug         페이지 식별자
 * @param allParams    검색 조건 (기존 search()와 동일 파라미터)
 * @return 전체 데이터 목록
 */
public List<Map<String, Object>> exportAll(String slug, Map<String, String> allParams);
```

- 기존 `search()`의 WHERE 절 생성 로직 재사용
- `ORDER BY created_at DESC` 정렬 유지
- LIMIT/OFFSET 미적용

### 4.3 PageDataController — export 엔드포인트 추가

```java
/**
 * GET /api/v1/page-data/{slug}/export
 * 전체 데이터를 xlsx 또는 csv로 다운로드
 */
@GetMapping("/{slug}/export")
public ResponseEntity<byte[]> export(
    @PathVariable String slug,
    @RequestParam(defaultValue = "xlsx") String format,
    @RequestParam(required = false) String headers,   // 쉼표 구분 헤더
    @RequestParam(required = false) String keys,      // 쉼표 구분 키
    @RequestParam Map<String, String> allParams
);
```

---

## 5. 비즈니스 로직 흐름

```mermaid
flowchart TD
    A["GET /{slug}/export?format=xlsx&headers=이름,이메일&keys=name,email&name=홍길동"] --> B[format 파라미터 추출]
    B --> C[headers/keys 파라미터를 List로 파싱]
    C --> D["PageDataService.exportAll(slug, 검색조건)"]
    D --> E[WHERE 절 동적 생성 - search()와 동일]
    E --> F[LIMIT/OFFSET 없이 전체 조회]
    F --> G{format?}
    G -- xlsx --> H["ExcelService.buildXlsx(headers, keys, rows, slug)"]
    G -- csv --> I["ExcelService.buildCsv(headers, keys, rows)"]
    H --> J["Content-Type: application/octet-stream"]
    I --> J
    J --> K["Content-Disposition: attachment; filename={slug}_{yyyyMMdd}.xlsx/csv"]
    K --> L[200 OK + 바이너리]
```

---

## 6. 예외 처리

| 상황 | HTTP | 처리 방식 |
|:---|:---|:---|
| 데이터 0건 | 200 | 헤더만 있는 빈 파일 반환 |
| format 값 이상 | 200 | 기본값 xlsx로 처리 |
| 미인증 | 401 | 기존 Security 설정 그대로 |

---

## 7. BE 개발 체크리스트

- [ ] `ExcelService.buildXlsx()` — POI XSSFWorkbook으로 xlsx 생성
- [ ] `ExcelService.buildCsv()` — UTF-8 BOM 포함 CSV 생성
- [ ] `PageDataService.exportAll()` — LIMIT 없는 전체 조회
- [ ] `PageDataController.export()` — format/headers/keys 파라미터 처리
- [ ] 응답 헤더 `Content-Disposition` 파일명 정상 설정
- [ ] `build.gradle` POI 의존성 추가
- [ ] `./gradlew build` 오류 없음
- [ ] FE에서 엑셀 버튼 클릭 시 파일 다운로드 정상 동작
