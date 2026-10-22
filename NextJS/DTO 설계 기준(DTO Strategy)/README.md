## DTO를 클래스로 쓸까, 타입으로 쓸까
- Next.js로 풀스택을 만들 때 DTO는 대부분 `interface` 나 `type` 으로 쓰고, 클래스는 값에 규칙을 붙여야 할 때만 쓴다는 것이 내가 정한 기준이다
- `interface`, `type` 은 데이터의 모양만 정한다. 컴파일하면 사라지고 실행할 때는 평범한 객체만 남는다
- 클래스는 생성자, 메서드, 검증 같은 동작을 함께 묶을 때 쓴다
- `interface` 와 `type` 중 무엇을 고를지는 이 노트에서 다루지 않는다

### 데이터 전송 객체 (DTO, Data Transfer Object)
transfer의 사전적 의미는 옮기다, 넘겨주다이다. DTO는 데이터를 옮기려고 만든 객체, 즉 계층과 계층 사이(클라이언트와 서버, 서버와 DB)에서 데이터를 담아 나르는 그릇을 말한다. 나르는 것이 목적이라 보통 동작 없이 값만 담는다.

<br/>

## 왜 대부분 타입으로 쓸까
DTO가 지나가는 경계마다 데이터는 결국 평범한 객체(plain object)나 JSON으로 바뀐다. 클래스로 만들어도 경계를 넘는 순간 메서드는 남지 않는다.

- 클라이언트와 서버 사이는 HTTP라서 JSON으로 오간다. `JSON.stringify()` 를 거치면 클래스 인스턴스도 필드만 남고 메서드와 클래스 정보는 사라진다
- 서버 컴포넌트에서 클라이언트 컴포넌트로 넘기는 props는 React가 직렬화할 수 있는 값만 된다. 평범한 객체, 배열, 원시값, Date 등은 되지만 클래스 인스턴스는 넘길 수 없다(React 문서 'use client'의 직렬화 가능한 props 목록)
- DB에 넣을 때도 Drizzle, Prisma 같은 ORM에는 필드 값을 담은 객체를 넘긴다. TypeORM처럼 엔티티를 클래스로 정의하는 ORM도 있어서, 이 기준은 앞의 두 ORM을 쓸 때의 이야기다

```ts
type CreateProjectDto = { projectId: string; name: string; description: string }

const dto: CreateProjectDto = { projectId, name, description }
await db.insert(projects).values(dto)
```

값만 오가는 자리라면 `type` 하나로 모양을 정하는 것으로 충분하다. 클래스로 만들면 오히려 매번 인스턴스로 바꾸고 다시 풀어야 하는 일이 생긴다.

<br/>

## 그럼 클래스는 언제 쓸까
### 값에 규칙이나 검증이 붙는 도메인 모델
값이 만들어질 때부터 규칙을 지켜야 하는 경우에는 클래스가 낫다. 생성자에서 검증하면 잘못된 값으로는 객체 자체가 만들어지지 않고, 그 값과 관련된 규칙을 한곳에 모을 수 있다.

```ts
class ProjectName {
  private constructor(readonly value: string) {}

  static create(raw: string) {
    const trimmed = raw.trim()
    if (trimmed.length === 0 || trimmed.length > 50) {
      throw new Error('프로젝트 이름은 1~50자여야 한다')
    }
    return new ProjectName(trimmed)
  }
}

const name = ProjectName.create(input.name)
await db.insert(projects).values({ projectId, name: name.value, description })
```

생성자를 `private` 으로 막아 두면 `create()` 를 거치지 않고는 인스턴스를 만들 수 없다. 그래서 코드 어디서든 `ProjectName` 이면 이미 검증된 값이라고 믿을 수 있다.

DB에 넣을 때는 위처럼 다시 평범한 값으로 풀어서 넘긴다. 클래스는 서버 안에서 규칙을 지키는 데만 쓰고, 경계를 넘는 데이터는 타입으로 둔다.

### 입력 검증은 스키마 라이브러리로
요청 본문을 검증하는 일은 클래스 대신 Zod 같은 스키마 라이브러리로 하는 경우가 많다. 스키마 하나로 검증과 타입을 함께 얻을 수 있기 때문이다(`z.infer`). 이 부분은 Libraries 폴더 TODO에 남겨 두었다.

<br/>

## 정리
| 쓰는 자리 | 고르는 것 | 이유 |
| --- | --- | --- |
| API 요청과 응답 | `type`, `interface` | JSON으로 오가서 메서드가 남지 않는다 |
| 서버 컴포넌트에서 클라이언트 컴포넌트로 넘기는 props | `type`, `interface` | 클래스 인스턴스는 직렬화할 수 없다 |
| DB에 넣고 꺼내는 값(Drizzle, Prisma) | `type`, `interface` | ORM이 필드 값 객체를 주고받는다 |
| 생성 규칙이 있는 값(이름 길이, 금액 범위 등) | 클래스 | 만들 때 검증하고 규칙을 한곳에 모은다 |

<br/>

## 참고 자료
1. React 공식 문서, ['use client'의 직렬화 가능한 타입](https://react.dev/reference/rsc/use-client#serializable-types)

예시 코드는 개념을 보여 주는 조각이라 실행하지 않았다(`db`, `projects` 는 Drizzle 같은 ORM을 가정한 것이다).

<br/>

[목차](..)
