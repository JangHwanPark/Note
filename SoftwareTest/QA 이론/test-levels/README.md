# 테스트 레벨 (Test Levels)

> **한 줄**: 무엇을 테스트하는가에 따라 **4단계**. Unit → Integration → System → Acceptance.

> **외우는 팁**: **"단통시인"** — 단위·통합·시스템·인수

## 4단계

| # | 레벨 | 검증 대상 | 누가 | 도구 예시 |
|---|---|---|---|---|
| 1 | **단위 (Unit)** | 함수 / 메소드 / 클래스 | 개발자 | Jest, JUnit, Vitest, pytest |
| 2 | **통합 (Integration)** | 모듈 / 컴포넌트 간 인터페이스 | 개발자 / SDET | Postman, Newman, 통합 테스트 프레임워크 |
| 3 | **시스템 (System)** | 전체 시스템 (E2E) | QA / SDET | Playwright, Selenium, Cypress |
| 4 | **인수 (Acceptance)** | 사용자 요구사항 충족 | QA / PO / 사용자 | UAT (User Acceptance Testing) |

## 단위 테스트 (Unit)
- **격리**: 외부 의존(DB / API) 모킹
- **빠름**: 밀리초 단위, 수천 개 가능
- **AAA 패턴**: Arrange → Act → Assert
- **TDD 의 기본 단위**

## 통합 테스트 (Integration)
- **모듈 간 연결 검증**: 모듈 A 호출 시 모듈 B가 올바르게 반응하는가
- **두 가지 접근**:
  - Big Bang: 모두 결합 후 한 번에
  - Incremental: Top-down / Bottom-up
- **API 테스트가 대표적 통합 테스트** (Grey Box)

## 시스템 테스트 (System)
- **전체 시스템 동작** 검증 (End-to-End)
- 사용자 시나리오 기반
- **기능 + 비기능** 모두 포함 (성능 / 보안 / 호환성)
- 본 레포의 [packages/playwright-suite/](../../../packages/playwright-suite/), [apps/demo-web/](../../../apps/demo-web/) 이 여기 해당

## 인수 테스트 (Acceptance)
- **사용자 / 비즈니스 관점**에서 요구사항 충족 여부
- **UAT** (User Acceptance Testing) — 실제 사용자
- **BAT** (Business Acceptance Testing) — 비즈니스 요구사항
- **알파 / 베타 테스트** — 출시 전 검증

## 테스트 피라미드

```
          /\
         /  \      <- 인수 / E2E (적게)
        /────\
       /      \    <- 통합 (중간)
      /────────\
     /          \  <- 단위 (많이)
    /────────────\
```
- 아래로 갈수록 **빠르고 많이**
- 위로 갈수록 **느리고 적게**
- 깨졌을 때 디버깅 비용도 위로 갈수록 ↑

## 면접 답변 템플릿 (30초)
> "테스트 레벨은 무엇을 테스트하는가에 따라 단위·통합·시스템·인수 4단계로 나뉩니다. 단위는 함수 / 메소드, 통합은 모듈 간 인터페이스, 시스템은 전체 E2E, 인수는 사용자 요구사항 충족 여부를 검증합니다. 테스트 피라미드 관점에서는 단위 테스트를 가장 많이 두고 E2E를 적게 가져가는 것이 효율적입니다."

## 관련 개념
- [V-Model](../v-model/README.md) — 각 레벨에 대응되는 개발 단계
- [테스트 타입](../test-types/README.md) — 어떤 종류의 테스트를 수행하는가 (직교 개념)
- [Black / White / Grey Box](../black-white-grey-box/README.md) — 어느 레벨에서 어떤 박스를 쓰는가
