# expect 객체 API

`@playwright/test`의 `expect`는 **Playwright 전용 web-first assertion**이다. vitest의 `expect`와 import 출처도 다르고 동작도 다르다.

```ts
import { test, expect } from '@playwright/test';
```

## 핵심: 자동 wait 포함

가장 큰 차이. assertion이 **즉시 평가되지 않고, 조건이 충족될 때까지 자동으로 기다린다** (기본 5초).

```ts
// vitest 식 — 즉시 평가, 비동기 변화 못 잡음
expect(document.querySelector('.toast')).toBeVisible();

// Playwright — 토스트가 나타날 때까지 기다리고 평가
await expect(page.getByText('저장되었습니다')).toBeVisible();
```

이 덕분에 명시적 `waitFor` 거의 안 써도 된다. **`await expect(...)`만 잘 쓰면 flaky 줄어든다.**

## 자주 쓰는 matcher

### Locator 대상

| Matcher | 의미 |
| --- | --- |
| `toBeVisible()` | DOM에 있고 화면에 보임 |
| `toBeHidden()` | DOM에 없거나 안 보임 |
| `toBeEnabled()` / `toBeDisabled()` | 버튼 등 활성 상태 |
| `toBeChecked()` | 체크박스·라디오 체크됨 |
| `toBeFocused()` | 포커스됨 |
| `toBeEmpty()` | 텍스트 비어있음 |
| `toHaveText(text)` | 텍스트 일치 (정규식 OK) |
| `toContainText(text)` | 부분 일치 |
| `toHaveValue(value)` | input·textarea 값 |
| `toHaveAttribute(name, value)` | 속성 값 |
| `toHaveClass(cls)` | 클래스 |
| `toHaveCount(n)` | 매칭되는 요소 개수 |
| `toBeInViewport()` | 뷰포트 안에 있음 |

### Page 대상

| Matcher | 의미 |
| --- | --- |
| `toHaveURL(url)` | 현재 URL 일치 (정규식 OK) |
| `toHaveTitle(title)` | document.title |
| `toHaveScreenshot()` | 스크린샷 비교 (Visual Regression) |

### 일반 값 (즉시 평가)

```ts
expect(2 + 2).toBe(4);
expect({ a: 1 }).toEqual({ a: 1 });
expect([1, 2, 3]).toContain(2);
```

vitest와 동일. await 안 붙임.

## negation, soft, polling

```ts
// 부정
await expect(locator).not.toBeVisible();

// soft — 실패해도 멈추지 않음. 끝에서 모아서 보고
await expect.soft(locator).toHaveText('A');
await expect.soft(locator2).toHaveText('B');

// polling — 함수 반환값이 조건 충족할 때까지
await expect.poll(async () => {
  const res = await fetch('/api/status');
  return res.status;
}).toBe(200);
```

## 타임아웃 변경

```ts
await expect(locator).toBeVisible({ timeout: 10_000 });
```

기본 5초가 짧다 싶을 때만. 늘리는 게 답이 아닌 경우가 더 많다 — 그건 실제 느린 거.

## 자주 쓰는 패턴

### 토스트 표시 검증
```ts
await page.getByRole('button', { name: '저장' }).click();
await expect(page.getByText('저장되었습니다')).toBeVisible();
```

### 페이지 이동 검증
```ts
await page.getByRole('button', { name: '생성' }).click();
await expect(page).toHaveURL(/\/projects\/[\w-]+/);
```

### 폼 validation
```ts
await page.getByRole('button', { name: '다음' }).click();
await expect(page.getByText('이름을 입력하세요')).toBeVisible();
await expect(page.getByRole('button', { name: '다음' })).toBeDisabled();
```

### 목록 항목 개수
```ts
await expect(page.getByRole('listitem')).toHaveCount(5);
```

## vitest의 expect와 헷갈리지 말 것

| 항목 | vitest expect | Playwright expect |
| --- | --- | --- |
| import | `from 'vitest'` | `from '@playwright/test'` |
| async | 거의 동기 | 거의 async (`await` 필수) |
| 자동 wait | 없음 | **있음** (web-first) |
| matcher 대상 | 값·jest-dom 확장 | Locator·Page·일반 값 |

같은 spec 안에서 둘 다 쓰면 안 됨. Playwright 안에선 `'@playwright/test'` 것만.

## 한 줄 요약

> **Locator/Page 대상은 `await expect(...)`, 자동 wait가 핵심.** 명시적 waitFor를 안 쓰게 만드는 게 expect web-first assertion의 존재 이유.

## 공식 문서

- [Assertions](https://playwright.dev/docs/test-assertions)
- [LocatorAssertions](https://playwright.dev/docs/api/class-locatorassertions)
- [Soft / poll](https://playwright.dev/docs/test-assertions#soft-assertions)
