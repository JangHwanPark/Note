## FSD란 ?
- FSD(Feature-Sliced Design)는 프론트엔드 코드를 레이어(Layer), 슬라이스(Slice), 세그먼트(Segment) 세 단계로 나눠 배치하는 방법론이다
- 레이어는 코드의 책임에 따라 위아래로, 슬라이스는 비즈니스 도메인에 따라 옆으로 나눈다
- 위 레이어는 아래 레이어만 가져다 쓸 수 있어서, 코드가 서로 얽히지 않게 막는다
- 이 노트는 FSD 공식 문서(v2.1)의 Layers 레퍼런스를 2026-10-22에 확인한 내용을 기준으로 정리했다

### Feature-Sliced
feature는 기능, slice는 얇게 자른 조각이다. 앱을 기능 단위의 조각으로 잘라 둔다는 뜻으로 이 이름이 붙었다.

서랍장에 비유할 수 있다. 서랍 칸(레이어)은 위에서 아래로 쌓여 있고, 한 칸 안은 칸막이(슬라이스)로 물건 종류별로 나뉜다. 위 칸에서는 아래 칸 물건을 꺼내 쓸 수 있지만, 아래 칸에서 위 칸 물건에 손대지는 않는다.

<br/>

## 왜 필요할까
폴더를 `components`, `hooks`, `utils` 처럼 코드 종류로만 나누면, 기능 하나를 고칠 때 여러 폴더를 오가야 한다. 프로젝트가 커질수록 어느 파일이 어느 파일을 쓰는지 알기 어려워지고, 서로가 서로를 가져다 쓰는 순환 참조도 생긴다.

FSD는 두 가지 규칙으로 이를 막는다. 하나는 코드를 기능(도메인) 단위로 모으는 것이고, 다른 하나는 가져다 쓰는 방향을 위에서 아래 한쪽으로만 허용하는 것이다.

<br/>

## 레이어 (Layer)
레이어는 위에서 아래로 일곱 개이고, 위로 갈수록 책임이 크다. 모든 레이어를 다 쓸 필요는 없고, 필요한 것만 만든다.

| 레이어 | 역할 | 예시 |
| --- | --- | --- |
| app | 앱 전체를 실행하는 데 필요한 것. 라우팅, 전역 Provider, 전역 스타일 | `App.tsx`, 전역 컨텍스트 초기화 |
| processes | 사용 중단(deprecated). 여러 페이지에 걸친 흐름을 두던 곳 | 내용은 features와 app으로 옮긴다 |
| pages | 페이지 하나, 또는 페이지의 큰 부분 | `/login`, `/dashboard` |
| widgets | 여러 기능과 엔티티를 조합한 큰 UI 덩어리 | 헤더, 사이드바, 대시보드 카드 묶음 |
| features | 사용자에게 가치를 주는 동작(사용자 시나리오) | 로그인 폼 제출, 스터디룸 만들기 |
| entities | 프로젝트가 다루는 비즈니스 대상 | `User`, `StudyRoom` 과 그 API 요청, 표시용 UI |
| shared | 프로젝트와 상관없이 다시 쓸 수 있는 것 | 버튼, API 클라이언트, 공통 타입, 유틸 |

공식 문서는 processes 레이어에 "This layer has been deprecated"라고 적고, 그 내용을 features와 app으로 옮기라고 안내한다.

<br/>

## 슬라이스 (Slice)
슬라이스는 레이어 안을 비즈니스 도메인별로 나눈 폴더다. pages, widgets, features, entities 네 레이어가 슬라이스를 가진다. app과 shared는 보통 슬라이스 없이 바로 세그먼트로 나눈다.

```text
src/
  app/
  pages/
    login/
    dashboard/
  features/
    auth/
  entities/
    user/
    study-room/
  shared/
    ui/
    api/
```

<br/>

## 세그먼트 (Segment)
세그먼트는 슬라이스 안을 코드의 쓰임에 따라 나눈 폴더다. 흔히 `ui`(화면), `api`(백엔드 요청), `model`(상태와 비즈니스 로직), `lib`(내부 도구), `config`(설정)를 쓴다.

```text
entities/user/
  ui/
  api/
  model/
```

<br/>

## 가져다 쓰는 규칙
공식 문서의 규칙은 "A module (file) in a slice can only import other slices when they are located on layers strictly below."이다. 슬라이스 안의 파일은 자기보다 엄격하게 아래 레이어에 있는 슬라이스만 가져다 쓸 수 있다.

그래서 두 가지가 막힌다.

- 아래 레이어가 위 레이어를 가져다 쓰는 것. entities가 features를 가져다 쓸 수 없다
- 같은 레이어의 다른 슬라이스를 가져다 쓰는 것. `features/auth` 가 `features/study-room` 을 가져다 쓸 수 없다

두 기능을 함께 써야 한다면 더 위 레이어(widgets나 pages)에서 조합한다. app과 shared는 슬라이스가 없으므로 예외로, 각자의 세그먼트끼리는 자유롭게 가져다 쓸 수 있다.

<br/>

## 참고 자료
- [Feature-Sliced Design: Layers](https://feature-sliced.design/docs/reference/layers)
- [Feature-Sliced Design: Overview](https://feature-sliced.design/docs/get-started/overview)

<br/>

## 더 볼 것 (TODO)
- 슬라이스의 공개 API(`index.ts`)로 내부를 숨기는 방법
- 같은 레이어의 엔티티끼리 서로 참조해야 할 때 쓰는 `@x` 표기
- Next.js App Router의 `app` 폴더와 FSD의 app, pages 레이어를 함께 두는 방법
