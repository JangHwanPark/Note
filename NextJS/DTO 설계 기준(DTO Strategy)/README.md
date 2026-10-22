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
값이 만들어질 때부터 규칙을 지켜야 하는 경우에는 클래스가 낫다. 생성자에서 검증하면 잘못된 값으로는 객체 자체가 만들어지지 않고, 그 값과 관련된 규칙을 한곳에 모을 수 있다.

```ts
class ProjectName {
  private constructor(readonly value: string) {}

  static create(raw: string) {
    const trimmed = raw.trim();
    if (trimmed.length === 0 || trimmed.length > 50) {
      throw new Error('프로젝트 이름은 1~50자여야 한다');
    }
    return new ProjectName(trimmed);
  }
}

const name = ProjectName.create(input.name);
await db.insert(projects).values({ projectId, name: name.value, description });
```

생성자를 private으로 막아 두면 `create()`를 거치지 않고는 인스턴스를 만들 수 없어서, 코드 어디서든 ProjectName이면 이미 검증된 값이라고 믿을 수 있다.

DB에 넣을 때는 위처럼 다시 Plain Object로 풀어서 넘긴다. 서버 컴포넌트에서 클라이언트 컴포넌트로 넘기는 props도 직렬화할 수 있는 값만 가능해서 클래스 인스턴스는 넘길 수 없다. 클래스는 서버 안에서 규칙을 지키는 데만 쓰고, 경계를 넘는 데이터는 인터페이스로 둔다.
