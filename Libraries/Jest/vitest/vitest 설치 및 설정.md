## [Vitest 설치 및 설정](https://vitest.dev/)
### Jest가 설치되어 있다면 제거
- npm : `npm uninstall jest ts-jest babel-jest @types/jest`
- yarn : `yarn remove jest ts-jest babel-jest @types/jest`

<br/>

### Vitest 설치
- npm : `npm install --save-dev vitest @testing-library/react @testing-library/jest-dom`
- yarn : `yarn add --dev vitest @testing-library/react @testing-library/jest-dom`

<br/>

### JSDOM 설치
Vitest에서 React 테스트를 위해 jsdom이 필요
- `npm install --save-dev jsdom`

<br/>

### Vitest 설정
- `pakage.json`수정 : Vitest 실행을 위한 test 스크립트를 추가
```
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "test": "vitest"
}
```
- `vitest.config.ts` 생성
```
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', // 브라우저 환경 설정
    globals: true, // Jest 스타일의 describe, it, expect 사용 가능
  },
});
```
<br/>

### Vitest 실행
#### 기본 실행
- `npm test`, `npx vitest`

#### Watch 모드 없이 실행 (한 번만 실행)
- `npx vitest --run`

#### 특정 테스트만 실행
- `npx vitest src/components/Button.test.tsx`

#### 캐시 삭제 후 실행
- `npx vitest --clear`
- `npm test`