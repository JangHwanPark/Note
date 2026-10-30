## REST API 설계 원칙이란 ?
- REST는 웹이 커져도 잘 굴러가도록 Roy Fielding이 2000년 박사 논문에서 정리한 설계 방식(아키텍처 스타일)이다. 몇 가지 제약 조건(Constraint)의 묶음으로 정의된다
- REST API 설계 원칙은 이 생각을 HTTP API에 옮겨 쓰면서 업계에 굳어진 관례다. 주소는 자원을 가리키는 명사로 쓰고, 행위는 HTTP 메서드로 나타내고, 결과는 상태 코드로 알린다
- 관례는 표준이 아니다. 논문이 정한 제약 조건과 실무에서 말하는 REST API는 같지 않고, 회사와 팀마다 세부 규칙이 다르다

메서드의 뜻, 안전과 멱등, 상태 코드 하나하나의 의미는 [HTTP 메서드와 상태 코드](../HTTP%20메서드와%20상태%20코드(HTTP%20Methods%20and%20Status%20Codes)/README.md) 노트에 정리했다. 이 노트는 그 재료로 API의 주소와 응답을 어떻게 짜는지를 다룬다.

### REST (Representational State Transfer)
Representational은 표현의, State는 상태, Transfer는 옮김이라는 뜻이다. 이어 읽으면 표현된 상태를 옮긴다는 말이다.
공학적으로는 서버에 있는 자원의 상태를 JSON이나 HTML 같은 표현에 담아 클라이언트와 주고받는 방식이다. 클라이언트는 서버의 데이터 자체를 만지지 않고, 언제나 그 데이터를 담은 표현만 받고 보낸다. Fielding 논문 5장의 제목이 바로 Representational State Transfer (REST)다.

### API (Application Programming Interface)
Interface의 사전적 의미는 두 물체가 맞닿는 면, 경계면이다.
공학적으로 API는 프로그램끼리 서로의 기능을 쓰도록 정해 둔 약속된 접점이다. 웹에서 API라고 하면 보통 HTTP 요청으로 서버의 기능과 데이터를 쓰는 접점을 말한다. 화면을 그리는 HTML 대신 프로그램이 읽기 쉬운 JSON을 주고받는 경우가 많다.

<br/>

## 도서관으로 이해하기
도서관에는 책마다 청구기호가 붙어 있고, 대출 창구에서 하는 말은 보여 주세요, 폐기해 주세요처럼 몇 가지로 정해져 있다. 처음 가는 도서관이어도 청구기호와 창구의 말만 알면 책을 찾을 수 있다.

| 도서관 | REST API |
| --- | --- |
| 책 한 권 | 자원 (Resource) |
| 청구기호 | 자원을 가리키는 주소 (URI) |
| 종이책, 전자책, 오디오북 | 같은 자원의 여러 표현 (Representation) |
| 이 책 보여 주세요, 이 책 폐기해 주세요 | 정해진 메서드 (GET, DELETE 등) |
| 여기 있어요, 없는 책이에요 | 상태 코드 (200, 404 등) |

API도 주소 짓는 법과 메서드, 응답 모양을 일정하게 맞춰 두면, 처음 보는 API라도 문서 몇 줄만 읽고 쓸 수 있다. REST API 설계 원칙은 이 일정함을 만드는 규칙들이다.

<br/>

## REST의 출발: Fielding 논문의 제약 조건
### 아키텍처 스타일 (Architectural Style)
Style의 사전적 의미는 양식, 방식이다. 고딕 양식이라고 하면 특정 건물이 아니라 여러 건물이 공유하는 특징을 말한다.
공학적으로 아키텍처 스타일은 시스템을 어떻게 짤지에 대한 제약 조건의 묶음이다. 특정 프로그램이나 프로토콜이 아니다. Fielding의 논문 Architectural Styles and the Design of Network-based Software Architectures(2000, UC Irvine)는 5장에서 아무 제약도 없는 상태에서 출발해 제약을 하나씩 더해 가며 REST를 만든다(5.1.1절).

### 여섯 가지 제약 조건
| 제약 조건 | 논문 절 | 뜻 |
| --- | --- | --- |
| 클라이언트-서버 (Client-Server) | 5.1.2 | 화면을 맡는 쪽과 데이터를 맡는 쪽의 관심사를 나눈다 |
| 무상태 (Stateless) | 5.1.3 | 요청 하나에 그 요청을 이해하는 데 필요한 정보가 모두 들어 있어야 한다. 세션 상태는 클라이언트가 갖는다 |
| 캐시 (Cache) | 5.1.4 | 응답에 캐시해도 되는지 아닌지 표시가 있어야 한다 |
| 균일한 인터페이스 (Uniform Interface) | 5.1.5 | 모든 자원을 같은 방식으로 다룬다 |
| 계층화 시스템 (Layered System) | 5.1.6 | 중간에 프록시나 게이트웨이 같은 층을 둘 수 있고, 각 층은 바로 옆 층만 안다 |
| 주문형 코드 (Code-On-Demand) | 5.1.7 | 서버가 스크립트 같은 코드를 내려보내 클라이언트 기능을 늘릴 수 있다. 논문이 선택(optional) 제약이라고 밝힌다 |

무상태는 매번 처음 보는 직원이 앉는 민원 창구와 같다. 직원이 지난번 대화를 기억하지 못하니, 손님은 갈 때마다 필요한 서류를 다 챙겨 간다. 그 대신 어느 창구에 줄을 서도 일이 처리되므로 창구를 늘리기 쉽다. [로드 밸런싱](../../로드%20밸런싱(Load%20Balancing)/README.md)으로 서버를 여러 대 둘 때 이 성질이 도움이 된다.

### 균일한 인터페이스의 네 가지 조건
논문은 REST를 다른 스타일과 가르는 핵심이 균일한 인터페이스라고 하고, 이를 다시 네 가지 조건으로 나눈다(5.1.5절).

- 자원의 식별(Identification of Resources). 자원마다 그것을 가리키는 식별자가 있다
- 표현을 통한 자원 조작(Manipulation of Resources through Representations). 자원을 직접 건드리지 않고 표현을 주고받아 다룬다
- 자기 서술적 메시지(Self-descriptive Messages). 메시지만 보고도 어떻게 처리할지 알 수 있다. Content-Type 헤더가 본문이 무슨 형식인지 알려 주는 것이 예다
- 애플리케이션 상태의 엔진으로서의 하이퍼미디어(Hypermedia as the Engine of Application State, 줄여서 HATEOAS). 클라이언트는 응답에 담긴 링크를 따라가며 다음에 할 일을 고른다

어느 우체국에 가도 같은 양식의 송장을 쓰는 것과 같다. 우체국마다 그곳 업무에 꼭 맞춘 양식을 쓰면 조금 빠를 수는 있어도, 손님이 매번 새로 배워야 한다. 논문도 균일한 인터페이스는 정보를 표준 형식으로 옮기기 때문에 효율이 떨어진다는 대가가 있다고 적는다(5.1.5절).

<br/>

## 논문의 REST와 실무의 REST API
실무에서 REST API라고 부르는 것은 대개 아래 정도를 뜻한다.

- 주소는 자원을 가리키는 명사로 짓는다
- 행위는 HTTP 메서드로 나타낸다
- 결과는 상태 코드로 알린다
- 본문은 JSON으로 주고받는다

이것은 논문의 제약 조건 중 일부를 HTTP 위에서 지키는 관례다. 논문에는 URI를 명사로 쓰라거나 JSON을 쓰라는 말이 없다. HTTP 표준(RFC 9110)에도 주소를 어떻게 지으라는 규칙은 없다. 그래서 이 노트 뒤쪽에 나오는 주소 짓는 법, 페이지네이션 방식, 버전 관리 방식은 모두 표준이 아니라 널리 쓰이는 관례이고, 서비스마다 다르게 정한다.

Fielding 본인도 이 차이를 지적했다. 2008년 블로그 글 REST APIs must be hypertext-driven에서 HTTP 기반 인터페이스라면 뭐든 REST API라고 부르는 사람이 많아 답답하다고 쓰고, 하이퍼텍스트가 상태를 이끌지 않으면 REST가 아니라고 했다. 실무에서 REST API라고 부르는 것 중에는 HATEOAS를 따르지 않는 것이 흔하다(얼마나 되는지는 확인 필요). 이런 API는 엄밀히 말하면 REST의 일부 생각을 빌린 HTTP API다. 이 노트에서도 REST API는 실무에서 쓰는 넓은 뜻으로 쓴다.

<br/>

## 자원과 표현
### 자원 (Resource)
Resource의 사전적 의미는 자원, 필요할 때 꺼내 쓰는 원천이다.
공학적으로 자원은 이름을 붙여 가리킬 수 있는 모든 정보다. 논문은 이름 붙일 수 있는 정보라면 무엇이든 자원이 될 수 있다고 한다(5.2.1.1절). 사용자 한 명, 글 하나, 오늘의 날씨, 검색 결과 목록이 모두 자원이다. RFC 9110도 HTTP 요청의 대상을 자원이라고 부른다(3.1절).

자원은 데이터베이스의 표 한 줄과 같지 않다. 주문 하나가 여러 표에 나뉘어 저장돼 있어도 API에서는 주문 하나라는 자원으로 보여 줄 수 있다. 반대로 표 하나를 여러 자원으로 나눠 보여 줄 수도 있다. 자원은 저장 구조가 아니라 클라이언트가 다루고 싶은 단위로 정한다.

### 표현 (Representation)
Representation의 사전적 의미는 표현, 무언가를 대신 나타내 보인 것이다. 초상화가 사람을 대신 나타내듯, 실물 대신 내보이는 모습을 말한다.
공학적으로 표현은 자원의 어느 시점 상태를 담은 바이트와, 그 바이트를 설명하는 정보(메타데이터)다(논문 5.2.1.2절). 같은 사용자 정보라도 JSON으로 줄 수도, HTML 화면으로 줄 수도 있다. 같은 소설이 종이책, 전자책, 오디오북으로 나와도 소설은 하나인 것과 같다.

클라이언트가 어떤 표현을 원하는지는 [HTTP 헤더](../HTTP%20헤더(HTTP%20Headers)/README.md)의 Accept로 알리고, 서버는 Content-Type으로 무엇을 보냈는지 알린다.

### URI (Uniform Resource Identifier)
Uniform은 균일한, Identifier는 식별자라는 뜻이다. 자원을 균일한 방식으로 가리키는 식별자다. 우리가 흔히 쓰는 URL은 URI 중에서 자원이 어디 있는지(위치)까지 담은 것이다. 이 노트의 `/users/1` 같은 주소가 URI다.

<br/>

## URI는 명사로, 행위는 메서드로
### 왜 명사일까
HTTP에는 이미 행위를 나타내는 자리가 있다. 요청 첫 줄 맨 앞의 메서드다. 주소에도 동사를 넣으면 같은 뜻을 두 군데에 적게 된다.

```http
POST /getUser          (피할 예: 조회인데 POST, 주소에 동사)
POST /deleteUser?id=1  (피할 예: 삭제인데 POST)

GET    /users/1        (주소는 자원, 메서드가 행위)
DELETE /users/1
```

주소가 명사이면 메서드만 바꿔 같은 자원에 여러 행위를 할 수 있다. 도서관에서 청구기호는 그대로 두고 보여 주세요, 폐기해 주세요만 바꿔 말하는 것과 같다.

동사 주소가 단순히 보기 싫은 것만은 아니다. 조회를 POST로 하면 대부분의 HTTP 캐시가 저장하지 않는다([HTTP 캐시](../HTTP%20캐시(HTTP%20Caching)/README.md#캐시-키-cache-key) 참고). 메서드에 맞는 뜻이 지켜져야 캐시, 재시도, 검색 로봇 같은 도구가 제대로 돈다([안전과 멱등](../HTTP%20메서드와%20상태%20코드(HTTP%20Methods%20and%20Status%20Codes)/README.md#안전과-멱등) 참고).

### 흔히 쓰는 표기 관례
아래도 표준은 아니고 널리 쓰이는 관례다.

- 컬렉션은 복수형으로 쓴다(`/users`, `/orders`)
- 여러 단어는 하이픈으로 잇고 소문자로 쓴다(`/order-items`). RFC 3986은 스킴과 호스트를 빼면 대소문자를 구분하는 것으로 보므로(6.2.2.1절), 경로에 대소문자를 섞으면 `/Users` 와 `/users` 가 다른 주소가 되어 헷갈린다
- 주소에 파일 확장자를 붙이지 않는다(`/users/1.json` 대신 Accept 헤더로 형식을 고른다)
- 끝에 `/` 를 붙일지 말지를 정해 두고 한쪽으로 통일한다

### 명사로 나타내기 어려운 행위
결제 승인, 비밀번호 재설정 메일 보내기처럼 CRUD(생성, 조회, 수정, 삭제)로 딱 떨어지지 않는 행위도 있다. 이때 두 가지 방법을 흔히 쓴다.

하나는 행위의 결과를 자원으로 보는 것이다. 메일 보내기는 메일 발송 요청이라는 자원을 하나 만드는 일로 볼 수 있다(`POST /password-reset-requests`). 다른 하나는 동사를 그대로 쓰되 하위 경로로 두는 것이다(`POST /payments/7/cancel`). 앞쪽이 REST 관례에 더 가깝지만, 이름이 어색해지면 뒤쪽을 고르는 팀도 많다. 정답이 정해진 문제가 아니므로 한 API 안에서 방식을 통일하는 것이 더 중요하다.

<br/>

## 컬렉션과 단건
### 컬렉션 (Collection)
Collection의 사전적 의미는 모아 둔 것, 수집품이다.
공학적으로는 같은 종류의 자원을 모은 목록 자원을 말한다. `/books` 는 책 목록이라는 컬렉션이고, `/books/3` 은 그 안의 3번 책 한 권, 곧 단건 자원이다. 서가 전체와 서가에 꽂힌 책 한 권의 관계와 같다.

### 메서드와 짝짓기
관례적으로 아래처럼 짝을 맞춘다.

| 요청 | 뜻 | 흔히 쓰는 성공 응답 |
| --- | --- | --- |
| GET /books | 목록 조회 | 200 |
| POST /books | 컬렉션에 새 책 추가 | 201, Location 헤더 |
| GET /books/3 | 3번 책 조회 | 200 |
| PUT /books/3 | 3번 책 전체 교체 | 200 또는 204 |
| PATCH /books/3 | 3번 책 일부 수정 | 200 또는 204 |
| DELETE /books/3 | 3번 책 삭제 | 204 |

POST를 컬렉션에 보내는 이유는 새 자원의 번호를 서버가 정하기 때문이다. 클라이언트는 아직 번호를 모르니 `/books/4` 로 보낼 수 없다. RFC 9110은 POST로 새 자원을 만들었다면 201 Created와 함께 새 자원의 주소를 Location 헤더에 담아 보내라고 권한다(SHOULD)(9.3.3절). RFC는 꼭 지켜야 하는 것을 MUST, 특별한 이유가 없으면 따라야 하는 것을 SHOULD, 해도 되는 것을 MAY처럼 정해진 낱말로 구분해 적는다([UDP](../../Network/UDP(User%20Datagram%20Protocol)/README.md) 노트 참고). 이 노트의 괄호 속 영어 낱말이 그 표시다. 클라이언트는 이 주소로 방금 만든 자원을 다시 찾을 수 있다.

<br/>

## 중첩 경로
### 관계를 경로로 나타내기
어떤 자원이 다른 자원에 딸려 있으면 경로를 겹쳐 쓴다. `/authors/7/books` 는 7번 작가의 책 목록이다. 주소만 봐도 관계가 보인다. 아파트 주소를 동, 호 순서로 적는 것과 같다.

### 너무 깊게 겹치지 않는다
`/authors/7/books/3/reviews/12/comments` 처럼 깊어지면 몇 가지 문제가 생긴다. 주소가 길어지고, 클라이언트가 댓글 하나를 보려 해도 작가 번호와 책 번호를 다 알아야 한다. 리뷰 12번이 이미 하나뿐인 번호라면 앞의 경로는 덧붙인 정보일 뿐이다.

그래서 흔히 한 단계 정도만 겹치고, 단건은 바로 찾을 수 있는 짧은 주소를 둔다. 7번 작가의 책 목록은 `/authors/7/books`, 3번 책 자체는 `/books/3` 으로 찾는 식이다. 작가로 거른 목록은 쿼리스트링 필터(`/books?author=7`)로 나타낼 수도 있다. 둘 중 어느 쪽을 쓸지도 관례의 영역이다.

<br/>

## 필터, 정렬, 페이지네이션
### 쿼리스트링에 둔다
목록 자원을 어떤 조건으로 볼지는 [쿼리스트링](../쿼리스트링(Query%20String)/README.md)에 둔다. 쿼리스트링 노트의 [경로에 넣을까, 쿼리스트링에 넣을까](../쿼리스트링(Query%20String)/README.md#경로에-넣을까-쿼리스트링에-넣을까)에서 본 것처럼, 빠져도 같은 자원을 가리키는 선택 조건이기 때문이다.

```http
GET /books?author=hesse            (필터: 작가가 hesse인 책만)
GET /books?sort=-year              (정렬: 출간 연도 내림차순)
GET /books?limit=20&offset=40      (페이지네이션: 41번째부터 20권)
```

매개변수 이름(sort, limit, offset, page 등)과 내림차순을 `-` 로 나타내는 방식은 표준이 아니다. 서비스마다 다르므로 API 문서에 적어 둔다. 쿼리스트링이 다르면 [HTTP 캐시](../HTTP%20캐시(HTTP%20Caching)/README.md#캐시-키-cache-key)는 다른 저장본으로 보므로, 같은 조건은 같은 순서로 적도록 클라이언트끼리 맞춰 두면 캐시 적중에 도움이 된다.

### 페이지네이션 (Pagination)
Page는 쪽, Pagination은 쪽 번호를 매긴다는 뜻이다.
공학적으로는 긴 목록을 일정한 크기로 잘라 나눠 주는 것을 말한다. 책 십만 권을 한 번에 보내면 서버도 느리고 클라이언트도 다 받기 전에는 화면을 그리지 못한다. 그래서 몇 권씩 끊어 준다.

흔히 쓰는 방식은 두 가지다.

- 오프셋(Offset) 방식. 앞에서 몇 개를 건너뛰고 몇 개를 줄지 정한다(`?offset=40&limit=20`). 쪽 번호로 바로 건너뛰기 쉽다. Offset의 사전적 의미는 기준점에서 떨어진 거리다
- 커서(Cursor) 방식. 마지막으로 받은 항목을 표시해 두고 그 다음부터 달라고 한다(`?after=4&limit=2`). Cursor는 지금 위치를 표시하는 것을 말한다. 화면에서 글자를 쓸 자리를 알려 주는 깜빡이는 막대도 커서다. 책갈피를 꽂아 두고 거기서부터 읽는 것과 같다

오프셋 방식은 목록이 바뀌면 흔들린다. 1쪽을 보는 사이 맨 앞에 새 글이 올라오면, 모든 글이 한 칸씩 밀려 2쪽에서 이미 본 글을 또 보게 된다. 커서 방식은 몇 번째인지가 아니라 어디까지 봤는지를 기준으로 하므로 이 문제가 없다. 그 대신 커서 방식은 특정 쪽으로 바로 건너뛰기 어렵다.

```js
// drift.js: 오프셋 방식은 중간에 새 글이 끼면 같은 글을 두 번 본다
let posts = [5, 4, 3, 2, 1]; // 최신 글이 앞
const page = (offset) => posts.slice(offset, offset + 2);

console.log('1쪽', page(0)); // 1쪽 [ 5, 4 ]
posts = [6, ...posts];       // 1쪽을 보는 사이 새 글 6이 올라온다
console.log('2쪽', page(2)); // 2쪽 [ 4, 3 ]   4를 또 본다

// 커서 방식: 마지막으로 본 글 번호보다 작은 것부터 2개
posts = [5, 4, 3, 2, 1];
const after = (cursor) => posts.filter((id) => id < cursor).slice(0, 2);
console.log('1쪽', after(Infinity)); // 1쪽 [ 5, 4 ]
posts = [6, ...posts];
console.log('2쪽', after(4));        // 2쪽 [ 3, 2 ]
```

Node.js v24.22.1에서 실행한 결과다. 이 예시는 글 번호가 클수록 최신이라는 가정 위에서 번호를 커서로 썼다. 실제 서비스에서 커서 값을 무엇으로 만드는지는 정렬 기준에 따라 다르고, [페이지네이션](../페이지네이션(Pagination)/README.md) 노트에 정리했다.

### 다음 쪽 주소를 알려 주기
다음 쪽 주소를 클라이언트가 직접 만들게 할 수도 있고, 서버가 응답에 알려 줄 수도 있다. GitHub REST API는 응답의 link 헤더에 `<https://api.github.com/repositories/1300192/issues?page=4>; rel="next"` 같은 모양으로 다음 쪽, 이전 쪽, 첫 쪽, 마지막 쪽 주소를 담고, 이 주소로 다음 쪽을 요청하라고 안내한다(2026년 10월 확인). 응답 속 링크를 따라가는 방식이라 뒤에서 볼 HATEOAS의 생각과 닮았다.

<br/>

## 상태 코드 고르기
각 상태 코드의 뜻은 [자주 보는 상태 코드](../HTTP%20메서드와%20상태%20코드(HTTP%20Methods%20and%20Status%20Codes)/README.md#자주-보는-상태-코드)에 정리했다. 여기서는 API를 설계할 때 자주 고민하는 갈림길만 본다.

### 성공 응답
- 생성은 201과 Location 헤더. 생성한 자원을 본문에 담아 주면 클라이언트가 다시 조회하지 않아도 된다
- 돌려줄 본문이 없으면 204. RFC 9110은 204가 요청을 처리했고 더 보낼 내용이 없다는 뜻이라고 한다(15.3.5절)
- 처리를 바로 끝내지 못하고 접수만 했다면 202 Accepted. 접수했을 뿐 실제로 처리될지는 아직 모른다는 뜻이다(15.3.3절)

### 400과 422
본문이 JSON으로 읽히지 않으면 400 Bad Request다. 앞 노트에서는 필수 값 누락까지 400으로 묶었는데, 실무에서는 이 경우를 422로 나누는 서비스도 있다. 정리하면 JSON은 맞는데 필수 항목이 빠졌거나 값이 규칙에 맞지 않을 때는 400을 쓰는 서비스도 있고 422 Unprocessable Content를 쓰는 서비스도 있다. RFC 9110은 422를 형식과 문법은 맞지만 담긴 지시를 처리할 수 없을 때 쓰는 코드라고 정의한다(15.5.21절). 어느 쪽을 쓸지는 정해 두고 통일한다. 이 노트의 예시는 형식 오류에 400, 값 오류에 422를 썼다.

### 404와 403
권한 없는 사용자가 남의 자원을 요청하면 원칙대로는 403 Forbidden이다. 그런데 403을 주면 그 번호의 자원이 있다는 사실이 드러난다. 그래서 자원의 존재 자체를 숨기고 싶을 때는 404를 주기도 한다. RFC 9110도 대상 자원의 존재를 숨기고 싶은 서버는 403 대신 404로 답할 수 있다고 적는다(15.5.4절).

### 405와 409
주소는 맞는데 그 메서드를 받지 않으면 405 Method Not Allowed이고, Allow 헤더가 따라온다(앞 노트 참고). 지금 자원 상태와 부딪히면 409 Conflict다. RFC 9110은 409의 예로 다른 사람이 먼저 고친 자원을 PUT으로 덮어쓰려는 경우를 든다(15.5.10절). 이미 있는 아이디로 가입할 때 409를 쓰는 것은 흔한 관례다. 동시 수정을 조건부 요청으로 막을 때는 412 Precondition Failed가 쓰이기도 하는데, 이 부분은 TODO로 남긴다. [멱등 키](../멱등%20키(Idempotency%20Key)/README.md) 노트에서 본 처리 중인 키에 409를 쓰는 것도 같은 뜻이다.

<br/>

## 오류 응답 형식: Problem Details (RFC 9457)
### 왜 형식을 맞출까
상태 코드만으로는 무엇이 잘못됐는지 다 알릴 수 없다. 422를 받아도 어느 항목이 왜 틀렸는지는 본문을 봐야 안다. 그런데 서비스마다 오류 본문 모양이 제각각이면, 클라이언트는 API마다 오류를 읽는 코드를 새로 짜야 한다. RFC 9457 서론도 상태 코드가 오류를 설명하기에 늘 충분하지는 않고, 사람이 아닌 프로그램은 HTML 오류 페이지를 읽기 어렵다는 문제에서 출발한다(1절).

병원마다 진료 기록 양식이 같으면, 다른 병원으로 옮겨도 의사가 바로 읽을 수 있는 것과 같다.

### 문제 상세 (Problem Details)
RFC 9457(2023년 7월)은 HTTP API의 오류를 담는 JSON 형식을 정한 표준이다. 이전 판인 RFC 7807을 대체한다. 이 형식으로 보낼 때 Content-Type은 `application/problem+json` 이다(3절).

| 항목 | 뜻 | 절 |
| --- | --- | --- |
| type | 문제의 종류를 가리키는 URI. 클라이언트는 이 값으로 문제 종류를 구분해야 한다(MUST). 없으면 `about:blank` 로 본다 | 3.1.1 |
| status | 상태 코드 숫자. 참고용이고, 실제 응답의 상태 코드와 같아야 한다(MUST) | 3.1.2 |
| title | 문제 종류를 짧게 설명한 사람이 읽는 문장. 같은 종류면 바뀌지 않아야 한다(SHOULD NOT) | 3.1.3 |
| detail | 이번에 생긴 문제에 대한 설명. 디버깅 정보보다 클라이언트가 고치는 데 도움이 되는 내용을 쓴다 | 3.1.4 |
| instance | 이번에 생긴 문제 하나를 가리키는 URI | 3.1.5 |

RFC 9457의 예시는 아래와 같다(3절). 잔액이 모자라 구매를 거절한 응답이다.

```http
HTTP/1.1 403 Forbidden
Content-Type: application/problem+json
Content-Language: en

{
 "type": "https://example.com/probs/out-of-credit",
 "title": "You do not have enough credit.",
 "detail": "Your current balance is 30, but that costs 50.",
 "instance": "/account/12345/msgs/abc",
 "balance": 30,
 "accounts": ["/account/12345",
              "/account/67890"]
}
```

balance와 accounts는 표준 항목이 아니라 이 문제 종류가 덧붙인 확장 항목이다. 문제 종류마다 항목을 더할 수 있고(MAY), 클라이언트는 모르는 확장 항목을 무시해야 한다(MUST)(3.2절). 그래서 서버가 나중에 항목을 늘려도 기존 클라이언트가 깨지지 않는다.

### 쓸 때 주의할 점
- type이 `about:blank` 이면 상태 코드 이상의 뜻은 없다는 뜻이고, 이때 title은 상태 코드의 표준 문구(404라면 Not Found)와 같게 쓴다(SHOULD)(4.2.1절)
- 사람이 읽는 detail 문장을 프로그램이 잘라 읽으면 안 된다(SHOULD NOT). 프로그램이 써야 할 값은 확장 항목으로 준다(3.1.4절)
- 오류 정보로 서버 내부 사정을 흘리지 않는다. RFC 9457 보안 고려 사항은 스택 덤프 같은 구현 세부를 HTTP로 내보내지 말라고 권한다(5절)

<br/>

## 버전 관리
### 왜 필요할까
API는 한번 공개하면 내가 모르는 클라이언트들이 쓴다. 응답의 항목 이름 하나를 바꾸면 그 항목을 읽던 앱이 모두 깨진다. 기존 클라이언트가 고치지 않고 그대로 쓸 수 있는 성질을 하위 호환(Backward Compatibility)이라 하고, 이를 깨는 변경을 하위 호환을 깨는 변경(Breaking Change)이라고 한다. 이런 변경이 필요할 때 옛 방식을 쓰는 클라이언트를 위해 옛 버전을 한동안 함께 운영한다. 전화번호 국번이 바뀌어도 한동안 옛 번호로 걸면 안내 방송이 나오게 두는 것과 같다.

### 무엇이 하위 호환을 깨는 변경일까
GitHub REST API 문서는 하위 호환을 깨는 변경의 예로 작업 삭제, 매개변수나 응답 항목의 삭제와 이름 변경, 필수 매개변수 추가, 매개변수 타입 변경, 인증과 권한 요구 사항 변경을 들고, 새 작업, 선택 매개변수, 새 응답 항목 추가는 하위 호환을 지키는 추가 변경으로 본다(2026년 10월 확인). 추가 변경은 버전을 올리지 않고 반영할 수 있다. 앞에서 본 RFC 9457의 모르는 항목은 무시하라는 규칙도 같은 생각이다.

### 버전을 어디에 적을까
HTTP 표준에는 API 버전을 적는 자리가 정해져 있지 않다. 흔히 쓰는 방식은 아래 셋이다.

| 방식 | 예 | 장점 | 단점 |
| --- | --- | --- | --- |
| 경로 | `/v1/books` | 주소만 봐도 버전이 보이고, 브라우저로 바로 열어 보기 쉽다 | 같은 자원이 버전마다 다른 주소를 갖는다 |
| 헤더 | `X-GitHub-Api-Version: 2022-11-28` | 주소가 자원만 가리킨다 | 주소만 봐서는 버전을 알 수 없다 |
| 쿼리스트링 | `/books?version=1` | 붙이고 빼기 쉽다 | 선택 조건과 섞여 빠뜨리기 쉽다 |

GitHub REST API는 헤더 방식을 쓰고 날짜를 버전 이름으로 쓴다. 헤더를 빼면 2022-11-28 버전으로 처리하고, 새 버전이 나온 뒤 이전 버전을 최소 24개월 더 지원한다고 적고 있다(2026년 10월 확인). 경로 방식의 `/v1` 은 이 노트의 예시처럼 흔히 볼 수 있다. 어느 방식이 맞는지는 정해진 답이 없고, 한 API 안에서 하나로 통일하는 것이 중요하다.

<br/>

## HATEOAS가 실무에서 잘 안 쓰이는 이유
### HATEOAS란
Hypermedia는 링크로 다른 곳으로 건너갈 수 있는 매체, Engine은 움직이게 하는 힘, Application State는 클라이언트가 지금 어느 단계에 있는지를 말한다.
공학적으로는 서버가 응답에 다음에 할 수 있는 일을 링크로 담고, 클라이언트는 그 링크를 따라가며 진행하는 방식이다. 웹 브라우저가 바로 이렇게 움직인다. 사용자는 첫 주소 하나만 알고, 그 다음부터는 화면의 링크와 폼을 눌러 이동한다. Fielding은 2008년 글에서 REST API는 첫 주소(북마크)와 표준으로 정해진 미디어 타입 말고는 아무것도 미리 알지 않은 채로 들어갈 수 있어야 한다고 썼다.

```json
{
  "id": 3,
  "title": "수레바퀴 아래서",
  "links": {
    "self":   "/books/3",
    "author": "/authors/7",
    "borrow": "/books/3/loans"
  }
}
```

위는 생김새를 보여 주려고 만든 예시다. links라는 이름과 구조는 정해진 형식이 아니다. 대출 중인 책이라면 서버가 borrow 링크를 빼서, 지금은 빌릴 수 없다는 것을 링크의 유무로 알린다. 박물관의 안내 표지판을 따라 걷는 것과 같다. 관람객은 지도를 외우지 않아도 되고, 박물관이 동선을 바꾸면 표지판만 바꾸면 된다.

### 잘 안 쓰이는 이유
아래는 흔히 드는 이유를 정리한 것이다. 실제로 얼마나 쓰이는지 조사한 자료를 확인한 것은 아니다.

- 클라이언트를 만드는 사람이 API 문서를 읽고 주소와 흐름을 미리 코드에 적는다. 화면을 보고 판단하는 사람과 달리, 프로그램은 처음 보는 링크를 받아도 그것이 무슨 뜻인지 스스로 알지 못한다. 결국 링크 이름(rel)의 뜻을 미리 약속해야 하고, 그렇다면 주소를 미리 아는 것과 큰 차이가 없다고 느끼기 쉽다. Fielding은 이 약속을 서비스마다가 아니라 표준 미디어 타입에 두라고 하지만, 다음 항목처럼 JSON에는 그런 형식이 널리 자리 잡지 못했다
- JSON 자체에는 HTML의 `<a>` 태그 같은 링크 표기법이 없다. 링크를 어떤 이름과 구조로 담을지 서비스마다 따로 정해야 하고, 널리 통일된 형식이 없다
- 응답마다 링크를 계산해 넣는 일은 서버에 할 일을 늘리고 응답을 키운다. 당장 눈에 띄는 이득이 작아 보이니 뒤로 밀린다

그렇다고 생각 전체가 버려진 것은 아니다. 앞에서 본 GitHub의 link 헤더 페이지네이션, POST 뒤 201 응답의 Location 헤더는 모두 서버가 다음 주소를 알려 주는 방식이다. 실무는 HATEOAS를 통째로 따르기보다 이런 부분만 골라 쓰는 경우가 많다.

<br/>

## 코드로 보기
### 실행한 코드
Node.js v24.22.1의 http 모듈로 만든 작은 책 API다. 같은 파일에서 서버를 띄우고, fetch로 요청을 보낸 뒤 서버를 닫는다. 컬렉션과 단건, 필터와 정렬, 오프셋 페이지네이션, 201과 Location, 405와 Allow, RFC 9457 형식의 오류를 한 번에 보여 준다. 짧게 쓰려고 Content-Type 확인, 인증, PUT과 PATCH는 뺐다.

```js
// demo.js
const http = require('http');

const books = [
  { id: 1, title: '어린 왕자', author: 'saint-exupery', year: 1943 },
  { id: 2, title: '데미안', author: 'hesse', year: 1919 },
  { id: 3, title: '수레바퀴 아래서', author: 'hesse', year: 1906 },
];
let nextId = 4;

function send(res, status, body, headers = {}) {
  if (body === undefined) {
    res.writeHead(status, headers);
    return res.end();
  }
  res.writeHead(status, { 'Content-Type': 'application/json', ...headers });
  res.end(JSON.stringify(body));
}

// RFC 9457 문제 상세 형식으로 오류를 보낸다
function problem(res, status, title, detail, headers = {}) {
  const text = JSON.stringify({ type: 'about:blank', title, status, detail });
  res.writeHead(status, { 'Content-Type': 'application/problem+json', ...headers });
  res.end(text);
}

const server = http.createServer(async (req, res) => {
  let body = '';
  for await (const part of req) body += part;
  const url = new URL(req.url, 'http://localhost');
  const one = url.pathname.match(/^\/v1\/books\/(\d+)$/);

  // 컬렉션: /v1/books
  if (url.pathname === '/v1/books') {
    if (req.method === 'GET') {
      let list = books;
      const author = url.searchParams.get('author');
      if (author) list = list.filter((b) => b.author === author);
      if (url.searchParams.get('sort') === '-year') {
        list = [...list].sort((a, b) => b.year - a.year);
      }
      const limit = Number(url.searchParams.get('limit') ?? 10);
      const offset = Number(url.searchParams.get('offset') ?? 0);
      return send(res, 200, { items: list.slice(offset, offset + limit), total: list.length });
    }
    if (req.method === 'POST') {
      let input;
      try {
        input = JSON.parse(body);
      } catch {
        return problem(res, 400, 'Bad Request', '본문이 JSON 형식이 아니다');
      }
      if (typeof input?.title !== 'string' || input.title === '') {
        return problem(res, 422, 'Unprocessable Content', 'title은 비어 있지 않은 문자열이어야 한다');
      }
      const book = { id: nextId++, title: input.title, author: input.author, year: input.year };
      books.push(book);
      return send(res, 201, book, { Location: `/v1/books/${book.id}` });
    }
    return problem(res, 405, 'Method Not Allowed', `${req.method} 메서드는 이 주소에 쓸 수 없다`, {
      Allow: 'GET, POST',
    });
  }

  // 단건: /v1/books/{id}
  if (one) {
    const index = books.findIndex((b) => b.id === Number(one[1]));
    if (index === -1) return problem(res, 404, 'Not Found', `${one[1]}번 책은 없다`);
    if (req.method === 'GET') return send(res, 200, books[index]);
    if (req.method === 'DELETE') {
      books.splice(index, 1);
      return send(res, 204);
    }
    return problem(res, 405, 'Method Not Allowed', `${req.method} 메서드는 이 주소에 쓸 수 없다`, {
      Allow: 'GET, DELETE',
    });
  }

  problem(res, 404, 'Not Found', '없는 주소다');
});

async function call(method, path, body) {
  const res = await fetch('http://localhost:3000' + path, { method, body });
  const headers = ['content-type', 'location', 'allow']
    .filter((h) => res.headers.has(h))
    .map((h) => `${h}: ${res.headers.get(h)}`);
  console.log(method, path, res.status, ...headers);
  const text = await res.text();
  if (text) console.log('  ' + text);
}

server.listen(3000, async () => {
  await call('GET', '/v1/books?author=hesse&sort=-year');
  await call('GET', '/v1/books?limit=2&offset=2');
  await call('POST', '/v1/books', '{"title":"모모","author":"ende","year":1973}');
  await call('POST', '/v1/books', '{');
  await call('POST', '/v1/books', '{"author":"ende"}');
  await call('GET', '/v1/books/99');
  await call('PUT', '/v1/books');
  await call('DELETE', '/v1/books/4');
  server.close();
});
```

### 결과
`node demo.js` 로 실행한 출력이다.

```text
GET /v1/books?author=hesse&sort=-year 200 content-type: application/json
  {"items":[{"id":2,"title":"데미안","author":"hesse","year":1919},{"id":3,"title":"수레바퀴 아래서","author":"hesse","year":1906}],"total":2}
GET /v1/books?limit=2&offset=2 200 content-type: application/json
  {"items":[{"id":3,"title":"수레바퀴 아래서","author":"hesse","year":1906}],"total":3}
POST /v1/books 201 content-type: application/json location: /v1/books/4
  {"id":4,"title":"모모","author":"ende","year":1973}
POST /v1/books 400 content-type: application/problem+json
  {"type":"about:blank","title":"Bad Request","status":400,"detail":"본문이 JSON 형식이 아니다"}
POST /v1/books 422 content-type: application/problem+json
  {"type":"about:blank","title":"Unprocessable Content","status":422,"detail":"title은 비어 있지 않은 문자열이어야 한다"}
GET /v1/books/99 404 content-type: application/problem+json
  {"type":"about:blank","title":"Not Found","status":404,"detail":"99번 책은 없다"}
PUT /v1/books 405 content-type: application/problem+json allow: GET, POST
  {"type":"about:blank","title":"Method Not Allowed","status":405,"detail":"PUT 메서드는 이 주소에 쓸 수 없다"}
DELETE /v1/books/4 204
```

첫 줄은 같은 컬렉션에 필터와 정렬 조건만 붙여 hesse의 책을 최신순으로 받았다. 둘째 줄은 앞의 두 권을 건너뛰어 세 번째 책 한 권만 남았고, total로 전체가 몇 권인지 함께 알렸다. 생성은 201과 함께 Location 헤더에 새 책의 주소가 왔다. JSON이 깨진 요청은 400, title이 빠진 요청은 422로 갈렸다. 이 오류들과 없는 책, 받지 않는 메서드는 모두 같은 RFC 9457 형식으로 오류를 받았고, 405에는 Allow 헤더가 붙었다. 마지막 204는 본문이 없어 Content-Type도 없다.

<br/>

## 참고 자료
- Roy T. Fielding, [Architectural Styles and the Design of Network-based Software Architectures](https://ics.uci.edu/~fielding/pubs/dissertation/top.htm), UC Irvine 박사 논문, 2000. [5장 Representational State Transfer (REST)](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm) 5.1.1~5.1.7절, 5.2.1.1절, 5.2.1.2절
- Roy T. Fielding, [REST APIs must be hypertext-driven](https://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven), 2008-10-20
- RFC 9110, [HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html) 3.1절(Resources), 9.3.3절(POST), 15.3.3절(202 Accepted), 15.3.5절(204 No Content), 15.5.4절(403 Forbidden), 15.5.6절(405 Method Not Allowed), 15.5.10절(409 Conflict), 15.5.21절(422 Unprocessable Content)
- RFC 3986, [Uniform Resource Identifier (URI): Generic Syntax](https://www.rfc-editor.org/rfc/rfc3986.html) 6.2.2.1절(Case Normalization)
- RFC 9457, [Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html) 1절, 3절, 3.1.1~3.1.5절, 3.2절, 4.2.1절, 5절
- GitHub Docs, [Using pagination in the REST API](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api), [API Versions](https://docs.github.com/en/rest/about-the-rest-api/api-versions) (2026년 10월 확인)

<br/>

## 더 볼 것 (TODO)
- [커서 페이지네이션에서 커서 값을 만드는 방법과 정렬 기준이 여러 개일 때](../페이지네이션(Pagination)/README.md)
- 동시 수정 충돌 막기 (ETag와 If-Match를 쓰는 낙관적 동시성 제어)
- PUT과 PATCH 본문 형식 (JSON Patch, JSON Merge Patch)
- API 문서화와 명세 (OpenAPI)
- REST와 다른 API 방식 비교 (RPC, GraphQL, gRPC)
- 하이퍼미디어 형식과 링크 표기 (Web Linking RFC 8288, HAL 등)
- 인증과 인가를 API에 붙이는 방법 (토큰, OAuth)
- 요청 수 제한 (Rate Limiting)과 429 응답 설계
