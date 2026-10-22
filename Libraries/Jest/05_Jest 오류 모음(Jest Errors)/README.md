## 자주 만난 오류
- Jest를 설치하고 처음 테스트를 돌릴 때 자주 만나는 오류와 해결법을 모은 장
- 대부분 테스트 코드가 아니라 설정 문제다. TypeScript가 Jest 함수를 모르거나, Jest가 파일 문법을 읽지 못하는 경우다
- 확인한 환경은 Jest 30.5.2, babel-jest 30.5.2, @babel/core와 프리셋 7.29.7, TypeScript 5.6.3, Node.js 22.13.0이다

<br/>

## describe, it, expect를 찾지 못하는 타입 오류
TypeScript로 테스트 파일을 쓰면 아래 오류가 난다.

```text
a.test.ts(1,1): error TS2593: Cannot find name 'describe'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.
a.test.ts(1,39): error TS2304: Cannot find name 'expect'.
```

### 왜 날까
`describe`, `it`, `expect` 는 import 없이 쓰지만 JavaScript 기본 기능이 아니다. Jest가 테스트를 실행할 때 전역에 넣어 주는 함수라서, TypeScript는 따로 타입 정의를 받기 전에는 이 이름들을 모른다.

### 해결
타입 정의 패키지를 설치한다. 확인한 버전은 @types/jest 30.0.0이다.

```shell
npm install --save-dev @types/jest
```

`tsconfig.json` 에 `types` 옵션이 없으면 설치만으로 해결된다. TypeScript 5.6.3은 `types` 가 없을 때 `node_modules/@types` 아래 패키지를 모두 불러온다. TypeScript 6.0에서 이 기본값이 바뀌었다는 이야기가 있는데, 실행해 보지 않았다(확인 필요). 그 버전에서는 `types` 에 `jest` 를 직접 적는 쪽이 안전하다.

`types` 옵션이 있으면 거기에 적힌 패키지만 불러오므로 `jest` 를 직접 넣어야 한다. `types: ["node"]` 처럼 jest가 빠져 있으면 설치해도 같은 오류가 난다.

```json
{
  "compilerOptions": {
    "types": ["jest"]
  }
}
```

TypeScript 5.6.3에서 `types: ["jest"]` 만 넣고 `module`, `moduleResolution` 을 정하지 않았을 때는 `Cannot find module 'expect'` 같은 오류가 @types/jest 안에서 났다. `"module": "nodenext", "moduleResolution": "nodenext"` 를 함께 정하자 통과했고, `"module": "esnext", "moduleResolution": "bundler"` 로도 통과했다.

둘 중 무엇을 고를지는 프로젝트에 따른다. `nodenext` 는 Node.js의 모듈 규칙을 그대로 따르므로, `package.json` 에 `"type": "module"` 이 있는 프로젝트에서는 상대 경로 import에 확장자를 붙여야 한다. 확장자 없이 `import { x } from "./m"` 으로 쓰면 `error TS2835: Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './m.js'?` 가 났다. Vite 같은 번들러를 쓰는 프로젝트라면 확장자 없이 쓰는 `bundler` 가 맞다.

<br/>

## ESM 문법을 읽지 못하는 오류
`import`, `export` 를 쓴 파일을 아무 설정 없이 테스트하면 Jest 30.5.2와 Node.js 22.13.0에서 아래 오류가 난다.

```text
● Test suite failed to run

  Must use import to load ES Module: ...\esm.test.js

  The file contains ESM syntax (import/export) that could not be executed as CommonJS. Either:
    - Configure a transform (e.g. babel-jest) that compiles this file to CommonJS (see https://jestjs.io/docs/code-transformation)
    - If the file is in "node_modules", allow it to be transformed by adjusting "transformIgnorePatterns" (see https://jestjs.io/docs/configuration#transformignorepatterns-arraystring)
    - Use Node v24.9+ where Jest supports require(esm) natively (see https://jestjs.io/docs/ecmascript-modules#require-of-esm)
```

Jest는 기본적으로 테스트 파일을 CommonJS(`require`, `module.exports`) 방식으로 불러온다. Babel 설정 파일이 없으면 babel-jest가 `import` 를 바꾸지 않으므로 그대로 남아 실패한다. 아래 Babel 설정에서 `@babel/preset-env` 를 넣으면 `import` 를 `require` 로 바꿔 통과한다.

메시지의 세 번째 항목처럼 Node.js 24.9 이상에서는 Jest가 ESM을 직접 불러올 수 있다고 안내한다. 이 경우는 실행해 보지 않았다(확인 필요).

<br/>

## Jest encountered an unexpected token
Babel 설정에 `@babel/preset-env` 만 있고 JSX를 쓴 파일을 불러오면 아래 오류가 난다.

```text
● Test suite failed to run

  Jest encountered an unexpected token

  Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

  Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

  By default "node_modules" folder is ignored by transformers.

  ...

  Details:

  SyntaxError: ...\Hello.js: Support for the experimental syntax 'jsx' isn't currently enabled (1:28):

  > 1 | export const Hello = () => <h1>hi</h1>;
      |                            ^

  Add @babel/preset-react (https://github.com/babel/babel/tree/main/packages/babel-preset-react) to the 'presets' section of your Babel config to enable transformation.
```

### 왜 날까
Jest는 실행하기 전에 파일을 babel-jest로 변환하고, 변환 규칙은 Babel 설정을 따른다. JSX처럼 Node.js가 모르는 문법이 있는데 그 문법을 바꿀 프리셋이 없으면, 변환되지 않은 채로 남아 문법 오류가 난다. 메시지 위쪽은 모든 경우에 같은 안내문이고, 원인은 아래쪽 `Details` 에 나온다. 위 경우는 Babel이 직접 `@babel/preset-react` 를 넣으라고 알려 준다.

`node_modules` 안의 파일은 기본적으로 변환하지 않는다. 내 코드가 아니라 설치한 패키지가 ESM이나 JSX로 배포된 경우에도 같은 오류가 나는데, 이때는 `transformIgnorePatterns` 로 그 패키지를 변환 대상에 넣어야 한다. 이 경우는 실행해 보지 않았다(확인 필요).

### Babel 설치
```shell
npm install --save-dev @babel/core @babel/preset-env @babel/preset-react
```

babel-jest는 jest를 설치할 때 함께 설치되므로 따로 설치하지 않아도 된다. Jest 30.5.2에서 `npm ls babel-jest` 로 jest 아래에 babel-jest 30.5.2가 들어 있는 것을 확인했다.

### Babel 설정
프로젝트 루트에 `babel.config.json` 을 만든다. `.babelrc` 도 동작하지만 그 파일이 속한 패키지 안의 파일에만 적용된다.

```json
{
  "presets": [
    ["@babel/preset-env", { "targets": { "node": "current" } }],
    ["@babel/preset-react", { "runtime": "automatic" }]
  ]
}
```

프리셋(preset)은 미리 정해 둔 설정 묶음이라는 뜻이다. 플러그인 여러 개를 상황별로 묶어 두어서, 필요한 변환을 하나씩 고르지 않아도 된다.

- `@babel/preset-env` 는 최신 JavaScript 문법을 대상 환경이 이해하는 문법으로 바꾼다. 테스트는 Node.js에서 돌기 때문에 `targets: { node: "current" }` 로 지금 쓰는 Node.js 버전에 맞춘다. Jest가 쓸 수 있도록 `import` 를 `require` 로 바꾸는 일도 여기서 한다
- `@babel/preset-react` 는 JSX를 일반 함수 호출로 바꾼다. `runtime: "automatic"` 이면 파일마다 `import React` 를 쓰지 않아도 된다

이 설정으로 ESM, JSX, 클래스 필드(`count = 0`, `#secret`)를 쓴 테스트가 모두 통과했다.

### 클래스 필드 플러그인은 따로 필요 없다
인터넷의 Babel 설정 예제에는 `@babel/plugin-proposal-class-properties` 를 넣은 것이 많다. 클래스 필드가 아직 제안 단계일 때 필요했던 플러그인이다. 지금은 ECMAScript 표준(ES2022)에 들어가 `@babel/preset-env` 가 처리하고, npm에서는 아래처럼 사용 중단으로 표시돼 있다.

```text
This proposal has been merged to the ECMAScript standard and thus this plugin is no longer maintained. Please use @babel/plugin-transform-class-properties instead.
```

위 설정에서 이 플러그인 없이 클래스 필드와 비공개 필드를 쓴 테스트가 통과하는 것을 확인했다.

### jest.config.js의 transform
Jest의 기본 `transform` 은 이미 `.js`, `.jsx`, `.ts`, `.tsx` 파일(정규식 `\.[jt]sx?$`)을 babel-jest로 변환한다. 단, `.ts` 파일을 babel-jest로 넘겨도 Babel 설정에 `@babel/preset-typescript` 가 없으면 타입 표기를 읽지 못한다. 위 설정 그대로 `const n: number = 1;` 이 든 테스트를 돌리면 `Jest encountered an unexpected token` 과 함께 `SyntaxError: ... Missing initializer in const declaration.` 가 났고, `@babel/preset-typescript`(7.29.7)를 `presets` 에 더하자 통과했다. Babel은 타입을 지우기만 하고 타입 검사는 하지 않으므로, 타입 오류는 `tsc` 로 따로 확인한다. `npx jest --showConfig` 로 확인할 수 있다.

```text
"transform": [
  [
    "\\.[jt]sx?$",
    "...\\node_modules\\babel-jest\\build\\index.js",
    {}
  ]
]
```

그래서 Babel만 쓸 때는 `jest.config.js` 에 `transform` 을 적지 않아도 된다. 다른 변환기(ts-jest 등)를 함께 쓰거나 대상 파일을 바꾸고 싶을 때만 직접 적는다. 직접 적으면 기본값을 덮어쓰므로, 필요한 확장자를 모두 넣어야 한다.

```js
module.exports = {
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
};
```

<br/>

[목차](../README.md) | 이전 장: [모의 함수](../04_모의%20함수(Mock%20Function)/README.md) | 다음 장: [Vitest 설치와 설정](../06_Vitest%20설치와%20설정(Vitest%20Setup)/README.md)
