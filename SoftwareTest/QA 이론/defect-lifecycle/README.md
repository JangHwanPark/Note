# 버그(결함) 생명주기 (Defect Life Cycle)

> **한 줄**: 결함이 발견되어 종료되기까지의 **상태 흐름**. Jira / 사내 BTS의 워크플로우와 직접 매핑.

## 기본 상태 흐름

```
New → Assigned → Open → Fixed → Retest
                  │              │
                  ├─ Deferred    ├── Verified → Closed
                  ├─ Rejected    └── Reopened → (Assigned로 복귀)
                  └─ Duplicate
```

## 상태별 의미

| 상태 | 의미 | 다음 상태 후보 |
|---|---|---|
| **New** | QA가 막 등록한 결함 | Assigned / Rejected / Duplicate / Deferred |
| **Assigned** | 담당 개발자에게 할당됨 | Open |
| **Open** | 개발자가 수정 작업 중 | Fixed / Deferred / Rejected |
| **Fixed** | 개발자가 수정 완료 / QA 검증 대기 | Retest |
| **Retest** | QA가 수정 확인 검증 중 | Verified / Reopened |
| **Verified** | Retest 통과 (회귀 검증 전) | Closed |
| **Closed** | 회귀 검증까지 마무리, 최종 종료 | — |
| **Reopened** | Retest 실패 또는 회귀 결함 재발 | Assigned로 복귀 |
| **Rejected** | 결함 아님 (사양·환경·오해) | — |
| **Duplicate** | 기존 결함과 중복 | — |
| **Deferred** | 인지하지만 이번 릴리즈에는 수정 안 함 | 차기 릴리즈에 Open으로 복귀 |

> 회사 / 팀마다 명칭은 다르지만 흐름은 비슷. Jira 기본 워크플로우와 거의 동일.

## 핵심 분기 포인트

### Rejected 처리 사유
- 명세상 정상 동작 (사양 미숙지)
- 환경 / 데이터 문제 (제품 결함 아님)
- 재현 불가
- 중복 (이 경우 Duplicate로 분리)

### Deferred 결정 기준
- 영향도(Severity) 낮음 + 우회 방법 있음
- 수정 비용이 영향 대비 큼
- 릴리즈 일정 우선

### Reopened 트리거
- Retest 실패 (수정이 결함을 해결하지 못함)
- 회귀 검증 중 동일 결함 재발
- 다른 환경 / 권한에서 같은 결함 재현

## QA가 결함을 잘 등록하는 법
- **재현 절차** (Pre-condition + Steps)를 명확히
- **Expected vs Actual** 분리
- **Severity / Priority** 둘 다 명시 ([severity-vs-priority](../severity-vs-priority/README.md))
- **환경 정보** (OS / 브라우저 / 빌드 / 계정 권한)
- **증거** (스크린샷 / 영상 / 콘솔 로그 / 네트워크)
- **영향 범위 추정** (회귀 범위 산정에 도움)

## 면접 답변 템플릿 (30초)
> "결함 생명주기는 QA가 결함을 등록한 New 상태에서 시작해 Assigned → Open → Fixed → Retest를 거쳐, Retest 통과 시 Verified → Closed로, 실패 시 Reopened되어 Assigned로 복귀하는 상태 흐름입니다. 분기로는 사양·환경 문제인 Rejected, 중복인 Duplicate, 이번 릴리즈에 수정하지 않을 Deferred가 있습니다. 결함 등록 시에는 재현 절차, Expected/Actual, Severity/Priority, 환경 정보, 증거를 반드시 포함해 개발자가 바로 수정 작업에 들어갈 수 있게 합니다."

## 관련 개념
- [Retest vs Regression](../retest-vs-regression/README.md) — Fixed → Closed로 가는 두 검증 단계
- [Severity vs Priority](../severity-vs-priority/README.md) — 결함 등록 시 필수 필드
- [테스트 프로세스](../test-process/README.md) — 실행 단계의 산출물로서의 결함
