> ## Jest 관련 타입 오류 해결 (describe, it, expect 인식 안됨)
- Jest 타입 정의가 설치되지 않아서 발생하며, `@types/jest`를 설치하면 해결된다.
- `npm install --save-dev @types/jest`
- `tsconfig.json`내 `types`옵션을 추가하면 Jest 관련 타입을 자동으로 로드한다.