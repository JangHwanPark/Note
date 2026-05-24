# 테스트 프로세스 (ISTQB 5단계)

> **한 줄**: 모든 테스트 활동의 표준 흐름 = **계획 → 분석/설계 → 구현 → 실행 → 완료**.

> **외우는 팁**: **"계분구실완"**

## 5단계

| 단계 | 활동 | 산출물 |
|---|---|---|
| 1. **계획 (Planning)** | 범위·일정·리소스·환경·전략 결정 | Test Plan, Test Strategy |
| 2. **분석 / 설계 (Analysis & Design)** | 요구사항 분석 → 테스트 조건 도출 → TC 설계 | 테스트 조건, TC, 데이터 명세 |
| 3. **구현 (Implementation)** | TC 그룹화·우선순위, 환경·데이터·자동화 스크립트 준비 | 테스트 스위트, 자동화 코드, 환경 |
| 4. **실행 (Execution)** | TC 실행 → 결과 기록 → 결함 등록 → 재실행 | 실행 결과, 결함 리포트 |
| 5. **완료 (Closure)** | 종료 기준 점검, 자산 보관, 교훈 정리 | Test Summary Report, 회고 |

## 단계별 핵심 산출물

### 1. 계획
- 범위 (In / Out of scope)
- 일정 (Entry / Exit criteria)
- 리스크 식별 + 우선순위
- 환경 / 도구 / 인력

### 2. 분석 / 설계
- 요구사항 ↔ 테스트 조건 (Test Condition) 매핑
- 설계 기법 적용 ([test-design-techniques](../test-design-techniques/README.md))
- TC, 데이터 명세, 우선순위

### 3. 구현
- TC 그룹화 (스모크 / 회귀 / 기능별)
- 자동화 스크립트 작성
- 테스트 데이터 / 환경 세팅

### 4. 실행
- TC 실행 → Pass / Fail 기록
- Fail 시 결함 리포트 ([defect-lifecycle](../defect-lifecycle/README.md))
- 수정 후 Retest + Regression ([retest-vs-regression](../retest-vs-regression/README.md))

### 5. 완료
- Exit criteria 충족 확인
- 미해결 결함 정리 (Deferred 처리)
- TC / 자동화 / 결함 데이터 자산화
- 회고 (다음 릴리즈에 반영)

## 면접 답변 템플릿 (30초)
> "ISTQB 테스트 프로세스는 계획 → 분석/설계 → 구현 → 실행 → 완료의 5단계입니다. 계획에서 범위·일정·리스크를 정하고, 분석/설계에서 요구사항을 테스트 조건과 TC로 변환하며, 구현에서 TC와 환경·자동화 스크립트를 준비합니다. 실행 단계에서 TC를 실제로 돌려 결함을 등록하고 Retest와 회귀를 수행하며, 완료 단계에서 Exit Criteria 충족을 확인하고 자산화와 회고로 마무리합니다."

## 관련 개념
- [SDLC](../sdlc/README.md) — 개발 전체 생애주기 (테스트 프로세스는 그 안에서 반복)
- [V-Model](../v-model/README.md) — 개발-테스트 단계 1:1 매핑
- [Verification vs Validation](../verification-vs-validation/README.md) — 각 단계가 V인지 V인지
- [테스트 설계 기법](../test-design-techniques/README.md) — 2단계의 핵심 활동
- [버그 생명주기](../defect-lifecycle/README.md) — 4단계 실행의 결과
- [Retest vs Regression](../retest-vs-regression/README.md) — 4단계 실행의 검증 방식
