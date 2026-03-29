# 기술 스택 및 설계 방향 협의 (Tech Stack & Scope Proposal)

안녕하세요, **Technical Architect** 입니다.
PM → Designer 단계의 산출물(PRD + 구현 화면 7종)을 모두 검토했습니다. 본격적인 설계 도면(`system_architecture.md`) 작성에 앞서, 아키텍트 지침에 따라 아래 **3가지 항목에 대한 협의**가 필요합니다.

---

## 1. 구현 범위(Scale) 선택

| 옵션 | 설명 | 적합한 상황 |
|------|------|-----------|
| **[A] MVP - 빠른 출시** | Must Have 기능에 집중, 최소한의 공통 추상화 | 빠른 실증(PoC) 후 시장 반응 보고 확장 |
| **[B] 중/대규모 확장형** | 처음부터 다국어(글로벌) 확장, 고급 RBAC, 공통 훅/유틸 완비 | 처음부터 프로덕션 레디 상태로 진입 |

---

## 2. 소스코드 수준(Code Complexity) 선택

| 옵션 | 설명 | 특징 |
|------|------|------|
| **[A] 최신 고급 패턴** | Server Components, Custom Hooks, Repository Pattern 등 고도화 | 확장성 최고, 초반 진입 비용 높음 |
| **[B] 중간 단계** | 적절한 추상화 + 가독성 균형 (권장) | 유지보수 쉽고 생산성 높음 |
| **[C] 직관적 절차형** | 복잡한 추상화 없이 읽기 쉬운 절차적 코드 | 빠른 구현, 복잡한 기능 추가 시 리팩토링 필요 |

---

## 3. 기술 스택 선택

### 3.1 Frontend

| 옵션 | 기술 | 장점 | 단점 |
|------|------|------|------|
| **[A] Next.js (App Router) + Tailwind** | 최신 RSC 기반 풀스택 | 서버컴포넌트 / API Routes 통합 / 최고 생산성 | 학습곡선 있음 |
| **[B] React (Vite) + Tailwind** | 순수 CSR 방식 | 단순하고 가벼움 / 빠른 개발 | 별도 API 서버 필요 |
| **[C] Next.js + Shadcn UI** | A안에 Shadcn 컴포넌트 추가 | 디자인 시스템 완비(버튼/테이블/폼 컴포넌트 기성품) | Shadcn 스타일 커스터마이징 필요 |

### 3.2 Backend / API

| 옵션 | 기술 | 장점 | 단점 |
|------|------|------|------|
| **[A] Next.js Route Handlers (BFF)** | 프론트와 동일 레포에서 API 서빙 | 추가 서버 없음 / 인프라 비용 최소화 | 백엔드만 독립 스케일아웃 불가 |
| **[B] NestJS (Node.js) 분리** | 완전 분리된 RESTful API 서버 | 백엔드 독립 확장 / 타입 강력 | 두 개의 레포 운영 / 초기 설정 비용 |

### 3.3 Database

| 옵션 | 기술 | 장점 | 단점 |
|------|------|------|------|
| **[A] PostgreSQL (Supabase - 무료)** | Supabase 무료 티어 + Prisma ORM | 무료 500MB / Auth 내장 / 관계형 최강 | 무료 프로젝트 7일 미접속 시 일시 중단 |
| **[B] PostgreSQL (Neon DB - 무료)** | Neon Serverless + Prisma ORM | 항상 켜져있는 무료 DB / 브랜치 기능 | Supabase처럼 Auth 내장 없음 |
| **[C] MySQL (PlanetScale - 무료)** | PlanetScale + Prisma ORM | 친숙한 MySQL 문법 / 브랜치 기능 | 2024년 무료 티어 종료 - **현재 유료만 가능** |

> ⚠️ **참고**: PlanetScale([C]안)은 2024년 4월부로 무료 티어를 공식 폐지하였습니다. PostgreSQL 계열 (A 또는 B)을 강력히 권장합니다.

---

**[Decision]**: 위 1, 2, 3항목에서 각각 선호하시는 알파벳을 조합해 알려주세요.
(예: "1-A, 2-B, 3은 FE-C / BE-A / DB-A로 가자")

선택해 주시는 즉시, DB ERD, API 명세서, 시스템 다이어그램, 화면-라우팅 맵을 포함한 완전한 설계 문서를 작성해 드립니다!
