## Prettier 설정 파일
- Prettier가 코드 모양을 바꿀 때 따를 규칙을 정해 두는 것
- 프로젝트 루트에 `.prettierrc` 같은 설정 파일을 두고 옵션 이름과 값을 적는다. 적지 않은 옵션은 기본값을 쓴다
- 포맷하지 않을 파일은 `.prettierignore` 에 적는다
- 이 문서의 기본값과 동작은 Prettier 3.9.10에서 `getSupportInfo()` 로 옵션 목록을 뽑고, 직접 포맷해 확인했다

### 포매터 (Formatter)
format의 사전적 의미는 형식, 판형이다. 책의 판형처럼 내용이 아니라 모양을 정하는 틀이다.
공학적으로 포매터는 코드의 동작은 그대로 두고 들여쓰기, 줄바꿈, 따옴표 같은 모양만 정해진 규칙대로 다시 쓰는 도구다. Prettier는 코드를 한 번 구문 트리로 읽은 뒤 규칙에 맞춰 처음부터 다시 출력하기 때문에, 원래 어떻게 줄을 나눴는지와 상관없이 같은 결과가 나온다.

문서 양식에 맞춰 글을 다시 찍어 내는 인쇄소와 같다. 원고를 어떻게 써 왔든 나오는 책의 판형은 똑같다.

<br/>

## 왜 필요할까
사람마다 세미콜론, 따옴표, 줄바꿈 습관이 다르다. 규칙 없이 함께 작업하면 리뷰에서 모양 차이가 내용보다 먼저 눈에 띄고, 같은 줄을 서로 고쳐 쓰면서 의미 없는 diff가 생긴다. 설정 파일을 저장소에 넣어 두면 누가 저장하든 같은 모양이 나온다.

<br/>

## 설정 파일 예시
```json
{
  "semi": false,
  "singleQuote": true,
  "overrides": [
    { "files": "*.test.js", "options": { "printWidth": 120 } }
  ]
}
```

이 `.prettierrc` 를 둔 폴더에서 `const  a=1` 을 포맷하면 `const a = 1` 이 된다. 결과에 세미콜론이 붙지 않은 것은 `semi: false` 때문이다. `overrides` 는 옵션이 아니라 설정 파일에서만 쓰는 항목으로, `files` 에 맞는 파일에만 `options` 를 덮어쓴다.

<br/>

## 코드 모양 옵션
| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| printWidth | 80 | 한 줄 길이 기준. 넘으면 줄을 나눈다 |
| tabWidth | 2 | 들여쓰기 한 단계의 칸 수 |
| useTabs | false | true이면 공백 대신 탭으로 들여쓴다 |
| semi | true | 문장 끝에 세미콜론을 붙인다 |
| singleQuote | false | true이면 작은따옴표를 쓴다 |
| jsxSingleQuote | false | JSX 속성에 작은따옴표를 쓴다 |
| trailingComma | "all" | 여러 줄로 나뉜 목록 끝에 쉼표를 붙이는 범위 ("all", "es5", "none") |
| bracketSpacing | true | `{ foo: bar }` 처럼 중괄호 안쪽에 공백을 둔다 |
| bracketSameLine | false | 여러 줄로 나뉜 JSX, HTML 여는 태그의 `>` 를 마지막 속성 줄 끝에 붙인다 |
| objectWrap | "preserve" | 원래 코드에서 여는 중괄호와 첫 속성 사이에 줄바꿈이 있으면 객체를 여러 줄로 둔다. "collapse"는 printWidth 안에 들어가면 한 줄로 합친다 |
| arrowParens | "always" | 매개변수가 하나인 화살표 함수에도 괄호를 쓴다 ("always", "avoid") |
| endOfLine | "lf" | 줄바꿈 문자 ("lf", "crlf", "cr", "auto") |
| quoteProps | "as-needed" | 객체 키에 따옴표를 붙이는 기준 ("as-needed", "consistent", "preserve") |
| proseWrap | "preserve" | 마크다운 문단을 printWidth에 맞춰 나눌지 ("always", "never", "preserve") |
| htmlWhitespaceSensitivity | "css" | HTML 공백을 다루는 기준 ("css", "strict", "ignore") |
| embeddedLanguageFormatting | "auto" | 코드 안에 들어 있는 다른 언어(템플릿 리터럴 안의 CSS 등)도 포맷할지 ("auto", "off") |
| singleAttributePerLine | false | HTML, JSX 속성을 한 줄에 하나씩 쓴다 |

### trailingComma 기본값
Prettier 2.8.8의 기본값은 "es5"이고 3.9.10은 "all"이다(두 버전의 `getSupportInfo()` 로 확인). 바뀐 시점은 3.0.0이다. 3.9.10에서 긴 함수 매개변수를 포맷하면 기본값으로는 마지막 매개변수 뒤에도 쉼표가 붙고, "es5"로 두면 붙지 않는다. "es5"는 ES5에서도 문법 오류가 아닌 곳(객체, 배열)에만 붙이는 설정이라 함수 매개변수는 빠진다.

```js
// 기본값 "all"
function g(
  aaaaaaaaaaaaaaaaaaaaaaaaa,
  bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb,
  cccccccccccccccccccccccccc,
) {}
```

### bracketSameLine
속성이 많아 여는 태그가 여러 줄로 나뉠 때 `>` 를 어디에 둘지만 정한다. 기본값 false이면 `>` 가 따로 한 줄을 차지하고, true이면 마지막 속성 뒤에 붙는다.

```jsx
// bracketSameLine: true
<button
  className="aaaaaaaaaaaaaaaaaaaa"
  onClick={handleClickaaaaaaaaaaaaa}
  disabled>
  Click
</button>
```

<br/>

## 파서와 파일 경로
| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| parser | 없음 | 쓸 파서(babel, typescript, css, json, markdown 등). 보통 파일 확장자로 알아서 고른다 |
| filepath | 없음 | 파일 경로. CLI 밖에서 문자열을 포맷할 때 이 경로의 확장자로 파서를 고른다 |

<br/>

## 프라그마 옵션
프라그마(Pragma)는 컴파일러나 도구에게 주는 지시를 코드 안에 적어 둔 것을 말한다. Prettier에서는 파일 맨 위의 `@format`, `@prettier` 주석이 프라그마다.

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| requirePragma | false | 파일 맨 위에 `@format` 이나 `@prettier` 주석이 있는 파일만 포맷한다 |
| insertPragma | false | 포맷한 파일 맨 위에 `@format` 주석을 넣는다. 주석 모양은 언어를 따른다 |

insertPragma로 들어가는 주석은 JavaScript와 CSS는 `/** @format */`, 마크다운은 `<!-- @format -->`, YAML은 `# @format` 이었다.

requirePragma를 켜고 주석 없는 `const  a=1` 을 넣으면 그대로 돌려준다. `/** @format */` 이나 `/** @prettier */` 가 있으면 포맷한다. 기존 프로젝트에 Prettier를 조금씩 들일 때 쓴다.

`// prettier-ignore` 는 프라그마가 아니다. 바로 다음 코드 하나만 포맷하지 않게 하는 주석이고, 옵션 없이 쓴다.

<br/>

## .prettierignore
포맷하지 않을 파일을 `.gitignore` 와 같은 문법으로 적는다.

```text
dist
build
package-lock.json
yarn.lock
```

Prettier 3.9.10의 `--ignore-path` 기본값은 `.gitignore` 와 `.prettierignore` 두 파일이다. 그래서 `.gitignore` 에 이미 있는 경로는 따로 적지 않아도 빠진다. 다만 읽는 것은 Prettier를 실행한 폴더의 `.gitignore` 하나뿐이다. 하위 폴더 `sub/.gitignore` 에 `dist` 를 적고 상위 폴더에서 `prettier --check .` 를 돌리면 `sub/dist` 의 파일도 검사됐고, `sub` 폴더에서 돌릴 때만 빠졌다. `node_modules` 도 기본으로 건너뛴다(`--with-node-modules` 를 줄 때만 포함). `.gitignore` 에 `dist` 만 적은 폴더에서 `prettier --check .` 를 돌려 dist와 node_modules 안의 파일이 검사되지 않는 것을 확인했다.

<br/>

## 참고 자료
- [Prettier Options](https://prettier.io/docs/options)
- [Prettier Ignoring Code](https://prettier.io/docs/ignore)
- [Prettier 3.0 릴리스 노트](https://prettier.io/blog/2023/07/05/3.0.0)

<br/>

## 더 볼 것 (TODO)
- ESLint와 Prettier 함께 쓰기 (eslint-config-prettier)
- 저장할 때 자동 포맷과 커밋 전 검사 (lint-staged)
