---
name: nextjs-app-router-guru
type: Skill
phase: Develop
description: |
  Next.js App Router 아키텍처의 물리적 구조와 렌더링 세그먼트를 마스터하여 최상의 Full-stack FE를 구현하는 스킬.
  Server Components, Streaming, Caching 전략의 수리적 최적화를 담당합니다.

  References:
  - Official Docs: https://nextjs.org/docs
  - Patterns: https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns
---

# Next.js App-Router Guru (NARG): Architecture Physics

## 1. 렌더링 세그먼트 및 하이드레이션 물리 (Rendering Mechanics)

### 1.1 Server/Client Component Composition
- **Boundary Optimization**: `Server Components`와 `Client Components`의 경계를 물리적으로 어디에 설정할 것인지 결정하여, 브라우저로 전송되는 JS 번들 엔트로피를 최소화합니다.
- **Interleaving Rules**: 서버 컴포넌트 내부의 클라이언트 컴포넌트, 그리고 다시 그 자식으로 서버 컴포넌트를 주입하는 '인터리빙(Interleaving)' 패턴의 물리적 제약을 준수합니다.

### 1.2 Streaming & Suspense Engineering
- **Component-Level Streaming**: `Suspense` 바운더리를 수리적으로 설계하여, 데이터 로딩이 긴 영역(Slow Fetch)을 독립적인 청크로 스트리밍하고 사용자 인지 LCP를 낮춥니다.
- **Progressive Hydration Physics**: 스트리밍된 HTML 조각이 브라우저에서 부분적으로 하이드레이션되는 순서를 제어하여 인터랙션 우선순위를 확보합니다.

## 2. 데이터 페칭 및 캐싱 전략 (Data & Caching Calculus)

### 2.1 Full Route Cache & Request Memoization
- **Caching Taxonomy**: `Static Rendering`과 `Dynamic Rendering`의 분기점을 명확히 하고, `fetch` 옵션(`force-cache`, `no-store`)을 통해 데이터 신선도와 물리적 응답 속도를 조절합니다.
- **Revalidation Physics**: `Incremental Static Regeneration (ISR)` 기법을 적용하여 트래픽 부하를 서버 리소스 엔트로피로부터 격리합니다.

### 2.2 Server Actions & Security Binding
- **Atomic Mutation Physics**: `Server Actions`를 사용하여 클라이언트-서버 간의 API 오버헤드를 제거하고, `useFormStatus`, `useFormState`를 통한 낙관적 업데이트 로직을 주입합니다.

---
> [!IMPORTANT]
> **"프레임워크는 도구가 아니라 시스템의 골격이다."** NARG v1.0은 Next.js가 제공하는 모든 물리적 이점을 기획 로직과 1:1로 결합하여 결함 없는 고성능 애플리케이션을 완성합니다.
