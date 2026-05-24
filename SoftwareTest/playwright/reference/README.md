# Playwright Reference

학습용 API·문법 정리 노트. 결정 노트(`01. 폴더 위치 정하기` 같은 회고 형식)와 분리된 레퍼런스 트랙.

## 파일

| # | 제목 | 핵심 |
| --- | --- | --- |
| 01 | [describe 언제 쓰나](./01.%20describe%20%EC%96%B8%EC%A0%9C%20%EC%93%B0%EB%82%98.md) | 그룹화 판단 기준 |
| 02 | [test 객체 API](./02.%20test%20%EA%B0%9D%EC%B2%B4%20API.md) | 메서드·describe 변형·fixture |
| 03 | [expect 객체 API](./03.%20expect%20%EA%B0%9D%EC%B2%B4%20API.md) | web-first assertion 자동 wait |
| 04 | [page 객체 주요 메서드](./04.%20page%20%EA%B0%9D%EC%B2%B4%20%EC%A3%BC%EC%9A%94%20%EB%A9%94%EC%84%9C%EB%93%9C.md) | spec 90%를 차지하는 API |
| 05 | [Locator 우선순위](./05.%20Locator%20%EC%9A%B0%EC%84%A0%EC%88%9C%EC%9C%84.md) | getByRole 1순위 이유 |
| 06 | [Locator 공식 문서 링크](./06.%20Locator%20%EA%B3%B5%EC%8B%9D%20%EB%AC%B8%EC%84%9C%20%EB%A7%81%ED%81%AC.md) | getByRole 등 공식 API + WAI-ARIA role |
| 07 | [playwright.config.ts](./07.%20playwright.config.ts.md) | 설정 파일 역할·옵션·webServer |
| 08 | [실무 E2E 예외 케이스 정리](./08.%20%EC%8B%A4%EB%AC%B4%20E2E%20%EC%98%88%EC%99%B8%20%EC%BC%80%EC%9D%B4%EC%8A%A4%20%EC%A0%95%EB%A6%AC.md) | 타이밍·격리·인증·외부의존·DOM·인프라 예외 사례 모음 |

## 읽는 순서

`02 → 04 → 05 → 03 → 01 → 07 → 08` 순이 자연스러움. test 등록 → 요소 조작 → 셀렉터 안정성 → 검증 → 그룹화 → 전역 설정 → 실전 예외 대응 순서로 spec 짤 때 마주치는 순서와 일치.
