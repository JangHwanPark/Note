## 코드 스타일 관련 속성
| 속성                         | 기본값         | 설명                                                     |
|----------------------------|-------------|--------------------------------------------------------|
| printWidth                 | 80          | 한 줄의 최대 길이(자동 줄바꿈 기준)                                  |
| tabWidth                   | 2           | 탭(\t)을 몇 개의 공백으로 변환할지 설정                               |
| useTabs                    | false       | true이면 공백 대신 탭(\t)을 사용                                 |
| semi                       | true        | true이면 세미콜론(;)을 강제                                     |
| singleQuote                | false       | true이면 작은 따옴표(') 사용, false이면 큰 따옴표(") 사용               |
| jsxSingleQuote             | false       | JSX에서 작은 따옴표 사용 여부                                     |
| trailingComma              | "es5"       | 객체, 배열 등의 마지막 요소에 콤마 추가 ("none", "es5", "all")         |
| bracketSpacing             | true        | { foo: bar }에서 {} 내부의 공백 여부                            |
| bracketSameLine            | false       | true이면 JSX 태그 >를 마지막 줄에 배치 <div>\n</div> → <div></div> |
| arrowParens                | "always"    | 화살표 함수에서 괄호 사용 ("always", "avoid")                     |
| endOfLine                  | "lf"        | 줄바꿈 스타일 ("lf", "crlf", "cr", "auto")                   |
| quoteProps                 | "as-needed" | 객체 속성의 따옴표 처리 ("as-needed", "consistent", "preserve")  |
| proseWrap                  | "preserve"  | 마크다운에서 텍스트 자동 줄바꿈 ("always", "never", "preserve")      |
| htmlWhitespaceSensitivity  | "css"       | HTML에서 공백을 다루는 방식 ("css", "strict", "ignore")          |
| embeddedLanguageFormatting | "auto"      | 코드 내 포함된 언어 포맷팅 처리 ("auto", "off")                     |

## 파일 형식 관련 속성
| 속성        | 기본값  | 설명                                       |
|-----------|------|------------------------------------------|
| overrides | []   | 특정 파일 형식에 대해 별도 설정 적용                    |
| parser    | auto | 사용할 파서 (babel, typescript, json, html 등) |
| filepath  | ""   | 파일 경로를 기반으로 적절한 파서를 선택                   |

## Prettier 실행 관련 옵션
| 속성               | 기본값   | 설명                                                          |
|------------------|-------|-------------------------------------------------------------|
| requirePragma    | false | /** @prettier */ 또는 /* prettier-ignore */ 같은 주석이 있어야만 포맷 적용 |
| insertPragma     | false | 파일 상단에 @format 같은 주석을 자동 추가                                 |

## .prettierignore 파일 (Prettier가 무시할 파일 설정)
.prettierignore 파일을 사용하면 특정 파일을 포맷팅 대상에서 제외할 수 있습니다.
```bash
node_modules
dist
build
package-lock.json
yarn.lock
```