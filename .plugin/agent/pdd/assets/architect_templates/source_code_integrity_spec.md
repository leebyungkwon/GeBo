# Source Code Integrity Spec (v4.0 Hyper-Deep)
## Project: [Project Name] | Auditor: Technical Architect (SCA Master)
### 💻 소스코드 클린 지수 및 리팩토링 무결성 명세서

본 문서는 시스템의 소스코드가 논리적/미학적으로 완벽한 상태를 유지하고 있는지 정량적으로 감사하고 가이드하는 **초정밀 코드 품질 명세서**입니다.

---

### 1. Code Readability & Naming Norms (가독성 및 명명 규격)
| 구분 | 설계 원칙 | 주니어 가상 가이드 (Example) | 무결성 지수 |
| :--- | :--- | :--- | :---: |
| **Variable** | Intent-Revealing | `x` (X) -> `retryCount` (O) | 1.00 |
| **Function** | Command-Query Separation | `saveAndGet()` (X) -> `save()` / `get()` (O) | 0.98 |
| **Class** | Noun-focused | `ManagingOrder` (X) -> `OrderManager` (O) | 0.99 |

- **[Junior Guide]**: 이름이 길어지는 것을 두려워하지 마세요. 명확하지 않은 것보다 긴 것이 백배 낫습니다.

### 2. Logical Complexity Control (논리 복잡도 제어)
| 감사 항목 | 목표 수치 (Target) | 물리적 제어 기법 | 측정 도구 |
| :--- | :---: | :--- | :---: |
| **Cyclomatic Complexity** | < 10 | Early Return, Method Extraction | SonarLint |
| **Indentation Depth** | < 2 | Guard Clauses, Strategy Pattern | IDE Metrics |
| **Line Count (Method)** | < 15 Lines | Single Responsibility Principle | Static Check |

#### 🚀 [Hyper-Deep] Cognitive Load & Entropy Matrix (100배 심화)
- **Cognitive Complexity Analysis**: 단순 분기점을 넘어 시각적 중첩과 논리적 맥락 전환 횟수를 수리적으로 합산하여 인지 부하가 15를 넘지 않도록 강제.
- **Coupling Entropy**: 컴포넌트 간 유입(Afferent) 및 유출(Efferent) 결합도를 계산하여 시스템의 불안정성 지수(Instability)를 0.5 이하로 관리.

### 3. SOLID Compliance Audit (SOLID 준수 감사)
- **[S] Single Responsibility**: 클래스가 한 가지 역할만 수행하는가?
- **[O] Open-Closed**: 확장에 열려 있고 수정에 닫혀 있는가? (Pattern 적용 여부)
- **[D] Dependency Inversion**: 구체 클래스가 아닌 인터페이스에 의존하는가?

#### 🚀 [Hyper-Deep] Refactoring Calculus (100배 심화)
- **Shotgun Surgery Defense**: 필드 하나 변경 시 여러 클래스를 수정해야 하는 물리적 비효율 탐지 및 해결.
- **Inappropriate Intimacy Extraction**: 서로의 내부 구현에 너무 깊게 관여하는 클래스 간의 관계를 물리적으로 절단하고 메세지 기반 통신으로 전환.

### 4. Code Hygiene Checklist (소스코드 위생 체크)
- [ ] 의미 없는 주석(이미 이름으로 설명되는 것)을 모두 제거했는가? (O/X)
- [ ] 매직 넘버(Magic Number)를 상수로 치환했는가? (O/X)
- [ ] 사용하지 않는 코드(Dead Code)를 물리적으로 삭제했는가? (O/X)
- [ ] 중복 코드(DRY 원칙)를 발견하여 공통 모듈로 통합했는가? (O/X)

---
> [!IMPORTANT]
> **"읽히지 않는 코드는 쓰레기다."** 본 명세서는 시스템의 혈관인 소스코드가 단 한 줄의 오염도 없이 흐르도록 보증하며, 개발자가 코드를 읽는 것만으로도 전체 설계를 완벽히 파악할 수 있는 초동적 코드 환경을 구축합니다.
