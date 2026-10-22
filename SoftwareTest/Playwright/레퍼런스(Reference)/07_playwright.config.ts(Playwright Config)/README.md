# playwright.config.ts

`playwright.config.ts`는 Playwright runner의 **전역 설정 파일**이다. `.json`이 아니라 `.ts` 코드 파일이라는 점이 핵심 — 실행 시점에 평가되므로 환경 분기(`isCI` 같은 조건)와 동적 계산이 자유롭다.

```ts
import { defineConfig, devices } from '@playwright/test';
export default defineConfig({ /* ... */ });
```

## 하는 일 4가지

| # | 카테고리 | 대표 옵션 |
| --- | --- | --- |
| 1 | 테스트를 **어디서** 찾을지 | `testDir`, glob 패턴 |
| 2 | 테스트를 **어떻게** 돌릴지 | `timeout`, `retries`, `workers`, `reporter`, `forbidOnly` |
| 3 | 테스트가 **어떤 환경**에서 돌지 | `use.baseURL`, `use.permissions`, `projects` |
| 4 | 테스트 **전 서버 준비** | `webServer` (자동 기동/종료) |

## spec과의 관계

```
playwright.config.ts          ← runner 시작 시 한 번 읽음 (전역 룰)
└─ e2e/**/*.spec.ts           ← config 기반으로 실행됨 (개별 테스트)
   └─ test.use({ ... })       ← spec 단위로 config 일부 오버라이드 가능
```

- config의 `use.permissions`가 비어있어도, 특정 spec 안에서 `test.use({ permissions: ['clipboard-read', 'clipboard-write'] })`로 그 파일만 켤 수 있다.
- config의 `timeout: 60_000`도 spec 안에서 `test.setTimeout(120_000)`으로 케이스별 늘릴 수 있다.

오버라이드 범위: **`test.use`는 describe/파일 단위**까지 가능하지만, test 한 개에는 적용 불가. 단일 테스트는 `test.setTimeout`, `test.slow()` 등 개별 API 사용.

## `defineConfig`는 그냥 타입 헬퍼

```ts
export default defineConfig({ /* ... */ });
// 실은 이거랑 동일:
export default { /* ... */ } satisfies PlaywrightTestConfig;
```

런타임 마법 없음. IDE 자동완성/타입체크 받기 위한 wrapper일 뿐이다.

## 자주 쓰는 옵션 모음

| 옵션 | 의미 | 예시 값 |
| --- | --- | --- |
| `testDir` | spec 검색 루트 | `'./e2e'` |
| `timeout` | test 함수 1개의 최대 실행 시간 | `60_000` |
| `forbidOnly` | `test.only`가 남아있으면 실패 처리 | `!!process.env.CI` |
| `retries` | 실패 시 재시도 횟수 | `isCI ? 2 : 0` |
| `workers` | 병렬 worker 수 | `isCI ? 1 : undefined` |
| `reporter` | 결과 출력 형식 | `'list'`, `[['list'], ['html']]` |
| `use.baseURL` | `page.goto('/')`의 기준 URL | `'http://localhost:3000'` |
| `use.trace` | 실패 시 trace.zip 저장 | `'retain-on-failure'` |
| `use.screenshot` | 실패 시 스크린샷 | `'only-on-failure'` |
| `projects` | 브라우저/디바이스 매트릭스 | `[{ name: 'chromium', use: devices['Desktop Chrome'] }]` |
| `webServer` | spec 실행 전 자동 기동할 서버 | 아래 참고 |

## `webServer` 옵션 (다른 config 툴에 없는 폭)

`next.config.ts`, `tailwind.config.ts` 같은 다른 config 파일은 "툴의 동작"만 정의한다. Playwright는 한 발 더 나가서 **테스트 환경(서버) 자체를 준비**한다.

```ts
webServer: {
  command: 'pnpm --filter web dev',
  url: 'http://localhost:3000',
  reuseExistingServer: !isCI,   // 로컬: 이미 떠있으면 재사용 / CI: 항상 새로
  timeout: 120_000,             // 서버 첫 기동까지 여유
  stdout: 'ignore',
  stderr: 'pipe',
}
```

- 로컬에선 `pnpm exec playwright test`만 쳐도 dev 서버 자동 기동.
- CI에선 매번 fresh 서버가 떠서 spec 끝나면 자동 종료.
- production build 정확도가 필요하면 `command`를 `pnpm build && pnpm start`로 교체. 빌드 시간 +1~2분 트레이드.

## 결론

`.json` 설정 파일과 똑같이 "툴 행동을 정의한다"는 결의 파일이지만,
- `.ts` 코드라 환경 분기 자유롭고
- `webServer`로 환경 준비까지 책임지는 폭이 넓다.

이 두 가지가 다른 툴의 config와 가장 다른 점.
