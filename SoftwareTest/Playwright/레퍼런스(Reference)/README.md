# Playwright Reference

학습용 API·문법 정리 노트. 결정 노트(`01. 폴더 위치 정하기` 같은 회고 형식)와 분리된 레퍼런스 트랙.

## 파일

| # | 제목 | 핵심 |
| --- | --- | --- |
| 01 | [describe 언제 쓰나](./01_describe%20언제%20쓰나(When%20to%20Use%20describe)/README.md) | 그룹화 판단 기준 |
| 02 | [test 객체 API](./02_test%20객체%20API(test%20API)/README.md) | 메서드·describe 변형·fixture |
| 03 | [expect 객체 API](./03_expect%20객체%20API(expect%20API)/README.md) | web-first assertion 자동 wait |
| 04 | [page 객체 주요 메서드](./04_page%20객체%20주요%20메서드(page%20Methods)/README.md) | spec 90%를 차지하는 API |
| 05 | [Locator 우선순위](./05_Locator%20우선순위(Locator%20Priority)/README.md) | getByRole 1순위 이유 |
| 06 | [Locator 공식 문서 링크](./06_Locator%20공식%20문서%20링크(Locator%20Docs)/README.md) | getByRole 등 공식 API + WAI-ARIA role |
| 07 | [playwright.config.ts](./07_playwright.config.ts(Playwright%20Config)/README.md) | 설정 파일 역할·옵션·webServer |
| 08 | [실무 E2E 예외 케이스 정리](./08_실무%20E2E%20예외%20케이스(E2E%20Edge%20Cases)/README.md) | 타이밍·격리·인증·외부의존·DOM·인프라 예외 사례 모음 |

## 읽는 순서

`02 → 04 → 05 → 03 → 01 → 07 → 08` 순이 자연스러움. test 등록 → 요소 조작 → 셀렉터 안정성 → 검증 → 그룹화 → 전역 설정 → 실전 예외 대응 순서로 spec 짤 때 마주치는 순서와 일치.
