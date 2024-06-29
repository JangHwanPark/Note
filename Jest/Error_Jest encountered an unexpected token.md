```shell
● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.
```

Jest 에서 `unexpected token` 오류가 발생하는 이유는 `비표준 자바스크립트 문법`을 사용하거나 Jest 구성에 문제가 있기 때문이다.

비표준 자바스크립트 문법은 코드나 종속성이 최신 자바스크립트(ES6 이상) 문법을 사용하지만 Jest 가 이를 인식하지 못할 때 발생할 수 있다.

Jest 구성 문제는 Babel 성정이 올바르게 구성되지 않아서 최신 문법을 변환하지 못할 때 발생할 수 있다.

### <br>Babel 설치 방법
```shell
npm install --save-dev @babel/preset-env @babel/preset-react babel-jest @babel/core 
@babel/plugin-proposal-class-properties @babel/preset-env
```

또는 

```shell
yarn add --save-dev @babel/preset-env @babel/preset-react babel-jest @babel/core 
@babel/plugin-proposal-class-properties @babel/preset-env
```

### Babel 설정
`.babelrc` 파일을 생성한다. (또는 `babel.config.js`)<br>
예를들어 `.babelrc`는 다음과 같이 구성되어야한다.

```shell
{
    "presets": ["@babel/preset-env", "@babel/preset-react"],
    "plugins": ["@babel/plugin-proposal-class-properties"]
}
```

바벨 설정 파일의 `presets` 과 `plugins` 항목은 코드 변환에 사용되는 프리셋과 플러그인을 지정한다.  
`presets`은 특정 환경에서 코드를 변환하는데 필요한 모음을 정의한다. 바벨 프리셋은 여러 개의 플러그인을 포함하며 특정 환경 (최신 자바스크립트 문법, 리액트 등)에 맞춰 코드를 변환한다.

- `@babel/preset-env`는 최신 JavaScript 문법을 구형 브라우저나 환경에서도 동작할 수 있도록 변환한다. preset-env는 브라우저 호환성을 고려하여 필요한 변환을 자동으로 적용한다.

- `@babel/preset-react`는 React 코드(JSX 및 기타 React 관련 구문)를 일반 JavaScript로 변환합니다. 이를 통해 React 코드를 트랜스파일하고 실행할 수 있다.  

플러그인은 개별적으로 적용할 변환 기능을 정의한다. 플러그인은 특정 기능이나 문법을 지원하기 위해 사용된다.

- `@babel/plugin-proposal-class-properties`는 클래스 필드 문법을 지원한다.  
    예를들어 클래스 내부에서 필드를 정의하는 구문을 사용할 수 있게 해준다.

### <br>Jest 설정 파일 (jest.config.js) 확인
```shell
module.exports = {
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  // 기타 Jest 설정들...
};
```

- `^.+\\.(js|jsx)$`는 정규 표현식으로 `js`또는 `.jsx` 확장자를 가진 모든 파일을 나타낸다.
- `babel-jest`는 파일들은 `babel-jest` 를 사용하여 변환하라는 의미다. (`babel-jest`는 바벨을 사용하여 자바스크립트 파일을 변환하는 Jest 모듈이다.)