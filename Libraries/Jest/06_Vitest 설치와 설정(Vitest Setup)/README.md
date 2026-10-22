## Vitest란 ?
- Vite 위에서 동작하는 테스트 프레임워크. [공식 문서](https://vitest.dev/)
- `describe`, `it`, `expect` 처럼 Jest와 거의 같은 API를 써서 Jest 테스트를 크게 고치지 않고 옮길 수 있다
- Vite 프로젝트라면 `vite.config.ts` 의 플러그인과 경로 별칭을 테스트에서도 함께 쓸 수 있다(아래 설정 참고). 5장에서 본 Babel 설정이 따로 필요 없다
- 이 장은 Vitest 5.0.5, jsdom 29.1.1, @testing-library/react 16.3.3, @testing-library/jest-dom 7.0.1, React 19.3.1에서 확인했다

<br/>

## 왜 옮길까
Vite로 만든 React 프로젝트에서 Jest를 쓰려면 Vite와 별개로 Babel이나 ts-jest 설정을 갖춰야 한다. 앱은 Vite가 변환하고 테스트는 Babel이 변환하니, 같은 코드를 두 가지 방식으로 변환하는 셈이고 한쪽에서만 되는 문법이 생기기 쉽다. Vitest는 Vite의 변환을 그대로 써서 이 이중 설정이 없어진다. 단, 테스트 설정 파일을 따로 만들 때는 앱 설정을 합쳐 줘야 한다. 아래 설정 단계에서 다룬다.

<br/>

## 1. Jest 제거
Jest가 설치되어 있다면 관련 패키지를 지운다.

```shell
npm uninstall jest ts-jest babel-jest @types/jest
```

<br/>

## 2. Vitest와 테스트 도구 설치
```shell
npm install --save-dev vitest jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom
```

- `vitest` 는 테스트를 실행한다
- `jsdom` 은 Node.js 안에서 브라우저의 `document`, `window` 를 흉내 낸다. React 컴포넌트를 그려 보려면 필요하다
- `@testing-library/react` 는 컴포넌트를 그리고 화면에서 요소를 찾는 함수(`render`, `screen`)를 준다. `@testing-library/dom` 은 이 패키지가 함께 요구하는 패키지다
- `@testing-library/jest-dom` 은 `toHaveTextContent`, `toBeInTheDocument` 처럼 DOM 상태를 확인하는 매처를 더한다

TypeScript 프로젝트라면 `@types/react`, `@types/react-dom` 도 있어야 JSX 타입 검사가 통과한다.

<br/>

## 3. 설정
### package.json
`scripts` 에 test 명령을 추가한다.

```json
"scripts": {
  "test": "vitest"
}
```

### vitest.config.ts
```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',             // 테스트를 jsdom이 흉내 낸 브라우저 환경에서 실행
    globals: true,                    // describe, it, expect를 import 없이 사용
    setupFiles: './vitest.setup.ts',  // 테스트 파일보다 먼저 실행할 파일
  },
});
```

두 파일이 모두 있으면 `vitest.config.ts` 가 우선하고, `vite.config.ts` 는 읽지 않는다. `vite.config.ts` 에 `environment: 'node'` 를 두고 확인했을 때 `vitest.config.ts` 의 jsdom 설정으로 통과했고, `vitest.config.ts` 를 치우자 `ReferenceError: document is not defined` 로 실패했다.

그래서 `vite.config.ts` 에 플러그인이나 경로 별칭(`@` 를 `src` 로 바꾸는 설정 등)이 있는 프로젝트에서 위처럼 `vitest.config.ts` 를 따로 두면, 테스트에서는 그 설정이 빠진다. 별칭을 쓴 `import { Button } from '@/Button'` 이 Vitest 5.0.5에서 `Error: Failed to resolve import "@/Button" from "src/Alias.test.tsx". Does the file exist?` 로 실패했다.

방법은 두 가지다. `vite.config.ts` 에 `test` 항목을 바로 넣어 파일 하나로 쓰거나, `vitest.config.ts` 에서 `mergeConfig` 로 앱 설정을 합친다.

```ts
// vitest.config.ts
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './vitest.setup.ts',
    },
  }),
);
```

이렇게 합치자 같은 별칭 테스트가 통과했다(Vite 8.3.5, @vitejs/plugin-react 6.1.2).

### vitest.setup.ts
jest-dom 매처를 Vitest의 `expect` 에 등록한다.

```ts
import '@testing-library/jest-dom/vitest';
```

이 줄이 없으면 Vitest 5.0.5에서 jest-dom 매처를 쓰는 순간 `Error: Invalid Chai property: toHaveTextContent` 로 실패한다. Vitest의 `expect` 는 Chai라는 검증 라이브러리 위에 만들어져 있어서, 등록되지 않은 매처를 Chai의 없는 속성으로 본다.

### tsconfig.json
`globals: true` 로 `describe` 를 import 없이 쓰면, TypeScript도 이 전역 함수의 타입을 알아야 한다. `types` 에 `vitest/globals` 를 넣는다.

```json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  },
  "include": ["src", "vitest.setup.ts"]
}
```

빠뜨리면 `describe` 를 찾지 못하는 오류가 난다. 5장의 Jest 타입 오류와 같은 원인이다. 오류 번호는 `tsconfig.json` 에 따라 다르다. `types` 옵션이 아예 없으면 TS2582(`Try npm i --save-dev @types/jest or ...` 까지만 안내)가, `types: []` 처럼 옵션이 있으면 TS2593(`... and then add 'jest' or 'mocha' to the types field` 까지 안내)이 났다. 메시지는 둘 다 `@types/jest` 를 설치하라고 하지만, Vitest에서는 그 대신 `vitest/globals` 를 `types` 에 넣는다.

<br/>

## 4. 테스트 작성과 실행
```tsx
// src/Button.tsx
export const Button = ({ label }: { label: string }) => <button>{label}</button>;
```

```tsx
// src/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('라벨을 보여 준다', () => {
    render(<Button label="저장" />);
    expect(screen.getByRole('button')).toHaveTextContent('저장');
  });
});
```

위 설정으로 `npx vitest --run` 을 실행하면 `Test Files  1 passed (1)`, `Tests  1 passed (1)` 이 나온다. `tsc` 타입 검사도 통과했다.

### 자주 쓰는 명령
- `npm test` 또는 `npx vitest` 는 파일이 바뀔 때마다 다시 실행하는 감시(watch) 모드로 실행한다
- `npx vitest --run` 은 감시 없이 한 번만 실행하고 끝낸다. CI에서 쓴다
- `npx vitest --run src/Button.test.tsx` 처럼 경로를 주면 그 파일만 실행한다. `Button` 처럼 이름 일부만 줘도 경로에 그 글자가 들어간 파일을 실행한다. 맞는 파일이 없으면 `No test files found, exiting with code 1` 로 끝난다
- `npx vitest --clearCache` 는 Vitest 캐시를 지우기만 하고 테스트는 실행하지 않는다. 지운 뒤 `npm test` 로 다시 실행한다. 캐시 때문에 고친 내용이 반영되지 않는 것 같을 때 쓴다

<br/>

[목차](../README.md) | 이전 장: [Jest 오류 모음](../05_Jest%20오류%20모음(Jest%20Errors)/README.md)
