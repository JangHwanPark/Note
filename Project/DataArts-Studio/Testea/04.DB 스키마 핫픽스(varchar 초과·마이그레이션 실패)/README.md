## DB 스키마 핫픽스 — varchar 초과 오류와 마이그레이션 실패

> 트러블슈팅 기록 | 2026년 2월 26일

### 이슈 요약

| 항목 | 내용                                                          |
|---|-------------------------------------------------------------|
| **증상** | 테스트 케이스·스위트 저장 시 문자열 길이 초과 에러 발생                            |
| **원인** | Drizzle ORM에서 `varchar()` length 미지정 시 PostgreSQL 기본값 제한 적용 |
| **영향** | 프로덕션 환경에서 일정 길이 이상의 데이터 저장 불가                               |
| **심각도** | 서비스 장애 - 사용자가 정상적으로 데이터를 입력해도 저장 실패                         |

<br/>

## 발생 경위

프로덕션에서 테스트 케이스를 작성하던 중, name이나 steps 필드에 긴 텍스트를 입력하면 저장이 실패하는 현상이 발생했다. 에러 메시지는 PostgreSQL의 `value too long for type character varying` 이었다.

스키마를 확인해보니 원인은 명확했다. Drizzle ORM에서 `varchar()` 를 length 없이 선언한 컬럼들이 문제였다.

```ts
// Before — length 미지정
name: t.varchar('name').notNull(),
description: varchar('description'),
status: varchar('status'),
```

PostgreSQL에서 `varchar` without length는 사실상 `text`와 동일하게 동작하지만, Drizzle ORM이 마이그레이션을 생성할 때 기본 길이 제한을 적용하는 경우가 있었다. 실제로 짧은 텍스트에서는 문제가 없었기 때문에 개발·테스트 단계에서 발견되지 않았고, **실 사용자가 충분히 긴 텍스트를 입력한 시점에서야 드러난 이슈**였다.

<br/>

## 대응

### 1단계: 작업 중이던 코드 보존 (13:49)

```
bfdccc7  On dev: dev-wip-before-hotfix
```

핫픽스 전에 진행 중이던 작업을 `git stash`로 보존했다. 핫픽스와 진행 중인 기능 개발을 섞지 않기 위한 조치.

### 2단계: 스키마 수정 + 마이그레이션 SQL 작성 (13:52)

```
bf6ca3a  hotfix(schema): varchar → text 컬럼 타입 변경으로 문자열 초과 오류 수정
```

컬럼을 두 가지 기준으로 분류해서 처리했다:

**콘텐츠성 컬럼 → `text`로 변경:**

| 테이블 | 컬럼 |
|---|---|
| `test_cases` | `name`, `steps`, `pre_condition`, `expected_result` |
| `test_suites` | `name`, `description` |
| `test_case_versions` | `name` |
| `test_runs` | `name` |

사용자가 자유롭게 입력하는 필드는 길이 제한이 불필요하다. `text` 타입이 적합하다.

**enum성 컬럼 → `varchar(length)` 명시적 지정:**

| 테이블 | 컬럼 | length |
|---|---|---|
| `test_cases` | `test_type`, `case_key` | 50, 20 |
| `test_runs` | `status` | 20 |
| `test_case_runs` | `status`, `source_type` | 20, 20 |

상태값·분류값은 길이가 예측 가능하므로 명시적 제한을 두는 것이 맞다. 잘못된 데이터 유입을 DB 레벨에서 방지할 수 있다.

마이그레이션 SQL:

```sql
-- PostgreSQL에서 ALTER TYPE varchar → text는 데이터 손실 없이 즉시 수행됩니다.
ALTER TABLE "test_cases" ALTER COLUMN "name" SET DATA TYPE text;
ALTER TABLE "test_cases" ALTER COLUMN "steps" SET DATA TYPE text;
-- ...
ALTER TABLE "test_runs" ALTER COLUMN "status" SET DATA TYPE varchar(20);
```

### 3단계: 마이그레이션 실패 → 즉시 수정 (13:52)

```
ab04836  hotfix(migration): 존재하지 않는 테이블 마이그레이션 쿼리 제거
```

2단계의 마이그레이션을 실행했더니 **바로 실패**했다. 원인은 `test_case_versions`와 `test_case_templates` 테이블에 대한 ALTER 구문이 포함되어 있었는데, 이 테이블들은 스키마에는 정의되어 있지만 **실제 DB에는 아직 생성되지 않은 상태**였다.

```sql
-- 이 구문들이 에러를 발생시킴
ALTER TABLE "test_case_versions" ALTER COLUMN "name" SET DATA TYPE text;       -- ❌ 테이블 없음
ALTER TABLE "test_case_templates" ALTER COLUMN "test_type" SET DATA TYPE varchar(50); -- ❌ 테이블 없음
```

스키마 코드에 테이블 정의가 있으니 마이그레이션도 자연스럽게 포함시켰는데, 실제 DB와 스키마 코드 사이의 **동기화 불일치**가 있었던 것이다. 해당 ALTER 구문을 제거하고 다시 실행해서 해결했다.

<br/>

## 근본 원인 분석

이 이슈는 세 가지 문제가 겹쳐서 발생했다:

**1. ORM 기본값에 대한 가정**

`varchar()` 를 length 없이 쓰면 "무제한"일 거라는 암묵적 가정이 있었다. PostgreSQL 자체는 맞지만, ORM 레이어에서의 동작은 다를 수 있다. **ORM의 동작을 DB의 동작과 동일하다고 가정하면 안 된다.**

**2. 테스트 데이터의 한계**

개발 단계에서 사용한 테스트 데이터는 짧은 텍스트였다. "테스트 케이스 1", "로그인 확인" 같은 짧은 문자열로는 varchar 제한에 걸리지 않는다. **실 사용자는 개발자의 테스트 데이터보다 훨씬 다양하게 입력한다.**

**3. 스키마 코드와 실제 DB의 불일치**

`test_case_versions`, `test_case_templates`는 코드에만 존재하고 DB에는 없었다. 마이그레이션을 작성할 때 코드만 보고 작성하면 이런 불일치를 놓친다. **마이그레이션 전에 실제 DB 상태를 확인해야 한다.**

<br/>

## 교훈

1. **콘텐츠성 컬럼은 처음부터 `text`로** — 사용자 입력을 받는 필드에 `varchar`를 쓸 이유가 없다. enum·상태값만 `varchar(length)`로 제한한다.
2. **마이그레이션은 실제 DB 기준으로** — 스키마 코드가 아니라 실제 DB에 존재하는 테이블 기준으로 작성한다. `\dt` 한 번이면 확인할 수 있다.
3. **핫픽스 전에 WIP 보존** — 핫픽스와 기능 개발 코드를 섞으면 롤백이 어려워진다. `git stash` 또는 별도 브랜치로 분리하는 습관이 필요하다.
