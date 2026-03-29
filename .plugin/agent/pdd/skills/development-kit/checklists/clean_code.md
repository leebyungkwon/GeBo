# Advanced Code Quality & Architecture Audit

## 1. SOLID Principles
- [ ] **SRP (Single Responsibility)**: 컴포넌트/함수가 단 하나의 '변경의 이유'만 가지는가?
- [ ] **OCP (Open/Closed)**: 기능 추가 시 기존 코드를 수정하지 않고 확장(Extension) 가능한가?
- [ ] **LSP (Liskov Substitution)**: 상속받은 클래스가 부모 클래스의 역할을 깨뜨리지 않는가?
- [ ] **ISP (Interface Segregation)**: 클라이언트가 안 쓰는 메소드에 의존하지 않게 인터페이스를 쪼갰는가?
- [ ] **DIP (Dependency Inversion)**: 고수준 모듈이 저수준(DB, UI)에 의존하지 않고, 둘 다 추상화(Interface)에 의존하는가?

## 2. Functional Purity & State
- [ ] **Immutability**: 변수(`let`) 대신 상수(`const`)를 기본으로 사용하고, 객체 수정 시 복사본을 만드는가?
- [ ] **Side Effects**: 함수가 외부 상태를 변경하지 않고(Pure), 입력값에 대해서만 결과를 반환하는가?

## 3. Scalable Structure (Check dependencies)
- [ ] **No Circular Dependency**: 순환 참조(A->B->A)가 없는가?
- [ ] **Layer Violation**: Domain 레이어에서 UI나 DB 라이브러리를 import하지 않았는가?
- [ ] **Feature Slicing**: 기능별로 폴더가 잘 격리되어 있는가? (Horizontal Slicing)

## 4. Type Safety (TypeScript)
- [ ] **No `any`**: `any` 타입을 절대 사용하지 않았는가? (Generic이나 unknown 사용)
- [ ] **Strict Null Checks**: `null`이나 `undefined` 가능성을 명시적으로 처리했는가?
