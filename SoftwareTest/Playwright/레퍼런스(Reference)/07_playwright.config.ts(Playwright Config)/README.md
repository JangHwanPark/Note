## playwright.config.ts란 ?
- Playwright 테스트 러너(test runner)가 실행을 시작할 때 읽는 전역 설정 파일이다
- `.json` 이 아니라 `.ts` 코드 파일이라서 실행할 때 평가된다. 그래서 `isCI` 같은 조건으로 값을 나누거나 계산해서 넣을 수 있다
- 이 장의 기본값과 동작은 @playwright/test 1.64.1의 타입 정의와 실행 결과로 확인했다

```ts
import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI; // 아래 예시 값의 isCI는 이 상수다

export default defineConfig({ /* ... */ });
```

### 설정 (Configuration)
configuration의 사전적 의미는 구성, 배치다. 여러 부분을 어떻게 짜 맞출지 정한 모양을 말한다.
공학적으로는 프로그램 코드를 고치지 않고 동작을 바꾸도록 바깥에 적어 두는 값들을 말한다. Playwright에서는 테스트를 어디서 찾고, 어떻게 돌리고, 어떤 브라우저 환경에서 돌릴지를 이 파일에 적는다.

<br/>

## 하는 일 네 가지
| 하는 일 | 대표 옵션 |
| --- | --- |
| 테스트를 어디서 찾을지 | `testDir`, `testMatch` |
| 테스트를 어떻게 돌릴지 | `timeout`, `retries`, `workers`, `reporter`, `forbidOnly` |
| 테스트가 어떤 환경에서 돌지 | `use.baseURL`, `use.permissions`, `projects` |
| 테스트 전에 서버를 준비할지 | `webServer`(자동으로 띄우고 끄기) |

<br/>

## spec과의 관계
```
playwright.config.ts          ← 러너가 시작할 때 한 번 읽는다(전역 규칙)
└─ e2e/**/*.spec.ts           ← config를 바탕으로 실행된다(개별 테스트)
   └─ test.use({ ... })       ← 파일이나 describe 단위로 config 일부를 덮어쓴다
```

- config의 `use.permissions` 가 비어 있어도, 특정 spec 파일에서 `test.use({ permissions: ['clipboard-read', 'clipboard-write'] })` 로 그 파일만 켤 수 있다
- config의 `timeout: 60_000` 도 spec 안에서 `test.setTimeout(120_000)` 으로 테스트마다 늘릴 수 있다

`test.use` 는 파일 최상위나 `describe` 안에서만 부를 수 있다. 테스트 함수 안에서 부르면 `Playwright Test did not expect test.use() to be called here.` 오류가 난다(실행해 확인). 테스트 하나만 바꾸려면 `test.setTimeout`, `test.slow()` 같은 개별 API를 쓴다.

<br/>

## defineConfig가 하는 일
```ts
export default defineConfig({ /* ... */ });

// 타입만 보면 아래와 거의 같다
import type { PlaywrightTestConfig } from '@playwright/test';
export default { /* ... */ } satisfies PlaywrightTestConfig;
```

주된 목적은 에디터에서 자동 완성과 타입 검사를 받는 것이다. 다만 아무 일도 안 하는 함수는 아니다. 1.64.1 소스를 보면 `defineConfig(base, extra)` 처럼 설정 여러 개를 넘기면 `use`, `expect`, `webServer` 등을 합쳐 하나로 만들고, `defineConfig` 를 썼다는 표시를 남긴다. 설정을 하나만 넘기면 사실상 그대로 돌려준다.

<br/>

## 자주 쓰는 옵션
| 옵션 | 뜻 | 예시 값 | 기본값 |
| --- | --- | --- | --- |
| `testDir` | spec을 찾기 시작할 폴더 | `'./e2e'` | config 파일이 있는 폴더 |
| `timeout` | 테스트 하나가 쓸 수 있는 최대 시간(ms) | `60_000` | 30초 |
| `forbidOnly` | `test.only` 가 남아 있으면 실패 처리 | `!!process.env.CI` | `false` |
| `retries` | 실패했을 때 다시 돌리는 횟수 | `isCI ? 2 : 0` | 0 |
| `workers` | 병렬로 돌릴 워커(worker) 수 | `isCI ? 1 : undefined` | 논리 CPU 코어 수의 절반 |
| `reporter` | 결과 출력 형식 | `'list'`, `[['list'], ['html']]` | 로컬 `list`, CI `dot` |
| `use.baseURL` | `page.goto('/')` 의 기준 URL | `'http://localhost:3000'` | 없음 |
| `use.trace` | trace 파일을 남기는 조건 | `'retain-on-failure'` | `'off'` |
| `use.screenshot` | 스크린샷을 남기는 조건 | `'only-on-failure'` | `'off'` |
| `projects` | 브라우저, 기기 조합 | `[{ name: 'chromium', use: devices['Desktop Chrome'] }]` | 없음 |
| `webServer` | spec 실행 전에 띄울 서버 | 아래 참고 | 없음 |

`timeout`, `forbidOnly`, `retries`, `use.trace`, `use.screenshot` 의 기본값은 설정 없이 돌린 테스트에서 값을 찍어 확인했다(30000, `false`, 0, `"off"`, `"off"`). `testDir`, `workers`, `webServer` 기본값은 1.64.1 타입 정의의 설명, `reporter` 기본값은 공식 문서를 기준으로 적었다.

<br/>

## webServer 옵션
`next.config.ts`, `tailwind.config.ts` 같은 설정 파일은 그 도구가 어떻게 동작할지만 정한다. Playwright 설정은 여기서 한 걸음 더 나가 테스트할 서버까지 준비한다.

```ts
webServer: {
  command: 'pnpm --filter web dev',
  url: 'http://localhost:3000',
  reuseExistingServer: !isCI,   // 로컬은 이미 떠 있으면 다시 쓰고, CI는 항상 새로 띄운다
  timeout: 120_000,             // 서버가 처음 뜰 때까지 기다리는 시간(기본 60초)
  stdout: 'ignore',             // 기본값 'ignore'
  stderr: 'pipe',               // 기본값 'pipe'
}
```

- 로컬에서는 `pnpm exec playwright test` 만 실행해도 dev 서버가 자동으로 뜬다
- CI에서는 매번 새 서버가 뜨고, spec이 끝나면 자동으로 꺼진다
- 프로덕션 빌드와 같은 조건에서 확인하려면 `command` 를 `pnpm build && pnpm start` 로 바꾼다. 빌드 시간만큼 실행이 길어진다

정리하면 이 파일도 다른 설정 파일처럼 도구의 동작을 정하지만, `.ts` 코드라서 환경에 따라 값을 나누기 쉽고 `webServer` 로 테스트 환경 준비까지 맡는다는 점이 다르다.

<br/>

## 참고 자료
- [Test configuration](https://playwright.dev/docs/test-configuration)
- [Web server](https://playwright.dev/docs/test-webserver)
- [Reporters](https://playwright.dev/docs/test-reporters)

<br/>

[목차](../README.md) | [이전 장: Locator 공식 문서 링크](../06_Locator%20공식%20문서%20링크(Locator%20Docs)/README.md) | [다음 장: 실무 E2E 예외 케이스](../08_실무%20E2E%20예외%20케이스(E2E%20Edge%20Cases)/README.md)
