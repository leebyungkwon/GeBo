# Backend-less Mocking Spec (v5.0 Hyper-Deep)
## Project: [Project Name] | Engineer: FE Developer (BMM Master)
### 🎭 백엔드리스 모킹 및 데이터 인터페이스 명세서

본 문서는 백엔드 시스템 미완성 시 FE 개발의 연속성을 보장하기 위해 적용되는 **모킹 정책 및 데이터 규격**을 정의하는 기술 명세서입니다.

---

### 1. Client-side Persistence Infrastructure (클라이언트 영속성 인프라)
| 구분 | 기술 스택 | 시스템 역할 | 상세 물리 정책 |
| :--- | :---: | :---: | :--- |
| **Storage** | IndexedDB (Dexie.js) | 메인 Database | 대량 데이터 저장 및 관계형 쿼리 처리 |
| **Storage** | LocalStorage | 세션/설정 저장소 | 단순 키-값 형태의 상태 유지 |
| **Data Gen** | Faker.js | 시드 데이터 생성 | 초기 DB 팝업을 위한 자동 생성 로직 |
| **Latency** | Promise + Delay | 비동기 시뮬레이션 | 500~1000ms 강제 지연 주입 |

- **[Master Guide]**: 외부 서버 없이 오직 브라우저 내부 저장소만 사용하여 실제 BE 연동 시의 데이터 흐름을 100% 모사하십시오.

### 2. Virtual DB Schema & Sync Matrix (가상 DB 스키마 및 동기화 매트릭스)
| Object Store (Table) | 주요 필드 (Schema) | 시드 수량 | 영속성 정책 |
| :--- | :--- | :---: | :--- |
| `members` | `id(PK), email, name, role` | 50 건 | 새로고침 후에도 유지 (Persistent) |
| `posts` | `id, title, contents, writerId` | 200 건 | `members`와 관계형 연동 |
| `session` | `token, lastLoginTs` | 1 건 | LocalStorage 즉시 동기화 |

#### 🚀 [Hyper-Deep] Dynamic Relation Mocking (100배 심화)
- **Nested Faker Logic**: `faker.helpers.multiple()`을 활용한 댓글-게시글-작성자 간의 비대칭 관계형 데이터 생성.
- **Conditional Status**: 특정 파라미터(`?case=error`) 주입 시 의도적으로 에러 객체를 반환하는 디버깅 채널 구축.

### 3. Mocking Health & Cleanup (모킹 관리 및 정리)
| 관리 항목 | 실행 지침 | 비고 |
| :--- | :--- | :--- |
| **Auto-Disable** | Prodcution 빌드 시 모킹 모듈 완전 제외 | `import.meta.env` 활용 |
| **Contract Sync** | API 명세(Swagger) 변경 시 핸들러 동시 업데이트 | 정합성 유지 |
| **Audit** | 모킹 데이터와 실제 데이터 간의 불일치 여부 정기 검사 | Verifier 협업 |

---

### 4. BMM Implementation Checklist (모킹 구현 체크리스트)
- [ ] 실제 네트워크 환경처럼 로딩(Loading)과 에러(Error) 상태가 모두 구현되었는가? (O/X)
- [ ] 새로고침 시에도 모킹된 데이터의 상태가 유지되도록 영속성이 고려되었는가? (O/X)
- [ ] API 명세서의 필드 타입과 모킹 데이터의 타입이 수리적으로 일치하는가? (O/X)

---
> [!IMPORTANT]
> **"가상은 실제를 완벽하게 모사해야 한다."** 본 명세서를 통해 구축된Backend-less 환경은 추후 실제 백엔드 연동 시 '설정 변경 단 한 줄'로 전환될 수 있는 완벽한 투명성을 지향합니다.
