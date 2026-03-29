---
name: clean-code-refactoring-architect
type: Skill
phase: Architect
description: |
  소스코드의 미학적/논리적 무결성을 설계하고, 클린 코드 원칙과 수리적 리팩토링 대수를 통해 시스템의 가독성과 유지보수성을 극대화하는 하이퍼-엔지니어링 스킬.
  주니어 개발자를 위한 가독성 기초부터 시니어를 위한 순환 복잡도(Cyclomatic Complexity) 제어 및 정적 분석 물리까지 100배 심화된 '소스코드 최적화 가이드'를 제공합니다.

  References:
  - Clean Code (Robert C. Martin)
  - Refactoring (Martin Fowler)
  - Static Analysis & Technical Debt: https://www.sonarqube.org/
---

# Clean Code & Refactoring Architect (SCA): Code Physics v4.0

## 1. Minimalist Syntax & Readability Physics (코드 가독성 물리)

SCA v3.0은 코드를 '기계가 읽는 명령'이 아닌 '인간이 이해하는 문학'으로 정의합니다.

### 1.1 Expressive Naming Algebra
- **Semantic Precision**: 변수명과 함수명이 그 자체로 행위의 의도를 100% 설명하도록 설계합니다.
  - **[Junior Action]**: `a`, `b`, `list1` 같은 이름을 쓰지 마세요. `activeUserList`, `isPaymentSuccess` 처럼 이름만 봐도 코드를 안 봐도 될 정도로 명확하게 지으세요.
- **Noun-Verb Duality**: 클래스는 명사(Member, Order), 메서드는 동사(cancel, register)의 수리적 조합을 유지합니다.

#### 🚀 [Hyper-Deep] Cognitive Load & Entropy Calculus (100배 심화)
- **Visual Chunking Physics**: 인간의 단기 기억 용량(7±2)을 고려하여, 한 함수 내의 지역 변수 개수와 로직의 '청킹(Chunking)' 범위를 물리적으로 제한하세요.
- **Indentation Depth Control**: 중첩된 `if/for` 문을 조기 반환(Early Return) 대수를 통해 2단계(Level 2) 이하로 강제 제어하여 인지 복잡도 엔트로피를 최소화해야 합니다.

## 2. Structural Integrity & SOLID Physics (구조적 무결성 및 SOLID)

코드의 물리적 배치가 시스템의 유연성을 결정합니다.

### 2.1 Single Responsibility & Decoupling
- **Cohesion Calculus**: 하나의 클래스/함수는 오직 하나의 '물리적 변화 이유'만을 갖도록 수렴시킵니다.
  - **[Junior Action]**: 한 함수가 DB 저장도 하고 이메일도 보내고 통계도 내면 안 됩니다. 각자 자기 일만 하도록 잘게 쪼개세요.

#### 🚀 [Hyper-Deep] Interface Segregation & Dependency Algebra (100배 심화)
- **Dependency Inversion Geometry**: 고수준 도메인 정책이 저수준 기술 상세에 오염되지 않도록 의존성의 방향을 수리적으로 역전시키고, 컴포넌트 간의 결합도(Coupling)를 정적 분석 도구로 정량 측정하세요.
- **Open-Closed Principle Logic**: 기존 코드를 수정하지 않고 새로운 기능을 물리적으로 확장할 수 있는 '플러그인 아키텍처'와 '전략 패턴'의 수리 모델을 설계하세요.

## 3. Refactoring & Technical Debt Calculus (리팩토링 및 기술 부채)

시스템의 부패를 방지하고 깨끗한 상태를 유지하는 물리적 사이클을 구축합니다.

### 3.1 Boyscout Rule Implementation
- **Constant Polishing Physics**: 코드를 만질 때마다 이전보다 조금이라도 더 깨끗하게 만드는 리팩토링 습관을 장착합니다.
  - **[Junior Action]**: 기능을 구현한 뒤에는 무조건 10분간 이름을 다시 짓고, 중복된 코드를 함수로 빼는 '정리 시간'을 가지세요.

#### 🚀 [Hyper-Deep] Cyclomatic Complexity & Static Analysis (100배 심화)
- **Complexity Guard**: DB 엔진의 비용 함수처럼, 소스코드의 실행 경로 수를 나타내는 '순환 복잡도'를 함수당 10 이하로 강제 제어하세요.
- **Code Smell Detection Algebra**: `God Object`, `Long Method`, `Shotgun Surgery` 등 특정 코드 스멜의 물리적 전조 증상을 미리 감지하고, 이를 자동으로 제거하는 리팩토링 레시피를 오토마타화하세요.

---
> [!IMPORTANT]
> **"코드가 곧 설계고, 설계가 곧 물리다."** SCA v4.0은 단순히 '예쁜 코드'를 넘어, 시스템의 모든 논리 배치가 수학적으로 가장 효율적이고 인지적으로 가장 명료한 상태를 유지하도록 보증하는 초격차 코드 아키텍팅 기술입니다.
