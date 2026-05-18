## 공식 문서
[Playwright 공식 문서](https://playwright.dev/?utm_source=chatgpt.com)
[Playwright Getting Started](https://playwright.dev/docs/intro?utm_source=chatgpt.com)
[Playwright Test API](https://playwright.dev/docs/api/class-test?utm_source=chatgpt.com)
[Playwright Locators 가이드](https://playwright.dev/docs/locators?utm_source=chatgpt.com)
[Playwright Codegen(자동 코드 생성)](https://playwright.dev/docs/codegen?utm_source=chatgpt.com)

## Playwright
웹 테스트를 위한 E2E 테스트 프레임워크

[설치](https://playwright.dev/docs/intro)

### 테스트 실행 명령어
```text
// 전체 테스트
npx playwright test

// 특정 디렉터리에서
pnpm e2e e2e/tests/access/project-access.spec.ts

// 레포 루트에서 실행
pnpm --filter web e2e e2e/tests/access/project-access.spec.ts

// 파일 내부에서 제목으로 특정 테스트 1개
pnpm e2e e2e/tests/access/project-access.spec.ts -g "title contains"

// 브라우저 띄워서 눈으로 보면서
pnpm e2e e2e/tests/access/project-access.spec.ts --headed

// UI 모드
pnpm e2e:ui e2e/tests/access/project-access.spec.ts
```