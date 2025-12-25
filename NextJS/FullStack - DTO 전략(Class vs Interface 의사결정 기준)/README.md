# [FullStack] DTO 전략: Class vs Interface 의사결정 기준
NextJS 풀스택에서는 대부분 인터페이스/타입(alias)을 쓰고 클래스는 `진짜 객체가 필요한 경우`에만 쓴다. 대부분의 Next 기반 SaaS/MVP에서는 95%가 interface/type으로 끝난다.
- 인터페이스/type → 데이터 구조 정의용(껍데기). 거의 모든 DTO, 서버 입력값 검증 타입).
- 클래스 → 생성자, 메서드, 불변성 보장, 도메인 규칙을 넣어야 할 때만 사용.

<br/>

## 왜 DTO는 대부분 인터페이스로 쓰나요?
### 직렬화/역직렬화 때문에
서버에서 DB로 데이터를 넣는 순간 "DTO"는 그저 JSON 오브젝트 형태의 데이터다.
Next 서버는 네트워크 직렬화를 하지 않더라도, DB 클라이언트(Supabase Drizzle Prisma)는 JS Plain Object만 받는다.
```js
const dto = { projectId, name, description };
await db.insert(projects).values(dto);
```
여기에 클래스 인스턴스를 넣어도 결국 JSON.stringify()를 하면 메서드 다 사라지고 데이터만 남는다.

- DB 단 → Plain Object만 유효 
- TypeScript 인터페이스만 있어도 충분함

<br/>

## 그럼 어디서 클래스를 쓰는가?
### 값에 규칙이나 검증이 붙는 도메인 모델