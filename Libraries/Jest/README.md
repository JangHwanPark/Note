## Jest란 ?
- JavaScript 코드를 테스트하는 테스트 프레임워크
- `describe` 로 테스트를 묶고, `test` 또는 `it` 으로 테스트를 만들고, `expect` 와 매처(Matcher)로 결과를 확인한다
- Vitest는 Vite 기반의 테스트 프레임워크로, Jest와 비슷한 API를 쓴다

### 테스트 프레임워크 (Test Framework)
framework의 사전적 의미는 뼈대, 틀이다.
테스트 프레임워크는 테스트를 찾고, 실행하고, 결과를 모아 보여 주는 틀을 미리 갖춰 둔 도구다. 개발자는 정해진 자리(`describe`, `test`)에 확인할 내용만 채우면 되고, 어떤 파일을 언제 실행할지와 결과를 어떻게 보여 줄지는 Jest가 맡는다.

### 이 노트의 실행 환경
- 1~5장 예시는 Jest 30.5.2, Node.js 22.13.0, Windows에서 실행했다
- 6장은 Vitest 5.0.5에서 실행했다
- 버전에 따라 오류 메시지와 설정이 달라지는 부분은 각 장에 버전을 함께 적었다

<br/>

## 목차
1. [테스트 스위트와 테스트 케이스](./01_테스트%20스위트와%20테스트%20케이스(Test%20Suite%20and%20Test%20Case)/README.md) : describe와 test로 테스트를 묶고 만드는 법, 실행 결과에서 스위트를 세는 단위
2. [매처](./02_매처(Matchers)/README.md) : toBe와 toEqual의 차이, 숫자, 문자열, 배열, 예외를 확인하는 매처와 실패 메시지 읽기
3. [비동기 코드 테스트](./03_비동기%20코드%20테스트(Async%20Testing)/README.md) : done, Promise, async/await로 결과를 기다리는 법과 기다리지 않으면 생기는 일
4. [모의 함수](./04_모의%20함수(Mock%20Function)/README.md) : jest.fn으로 호출과 인수, 반환값을 기록하고 확인하기
5. [Jest 오류 모음](./05_Jest%20오류%20모음(Jest%20Errors)/README.md) : describe를 못 찾는 타입 오류, ESM과 JSX를 읽지 못하는 오류와 Babel 설정
6. [Vitest 설치와 설정](./06_Vitest%20설치와%20설정(Vitest%20Setup)/README.md) : Jest를 지우고 Vitest와 jsdom, jest-dom으로 React 컴포넌트를 테스트하는 설정

<br/>

## 더 볼 것 (TODO)
- 모의 함수 이어서: jest.spyOn, jest.mock으로 모듈 통째로 바꾸기
- 가짜 타이머(jest.useFakeTimers)로 setTimeout 기다리지 않고 테스트하기
- beforeEach, afterEach 같은 준비와 정리 코드
- TypeScript 파일을 ts-jest 또는 Babel로 테스트하는 설정
- 스냅숏 테스트
