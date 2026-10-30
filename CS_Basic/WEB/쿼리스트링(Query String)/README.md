## 쿼리스트링이란 ?
- 주소(URL, Uniform Resource Locator) 끝의 `?` 뒤에 붙는 부분. 같은 자원을 어떤 조건으로 달라고 할지 서버에 알린다
- 보통 `이름=값` 쌍을 `&`로 이어 쓴다. `?sort=rating&page=2`라면 평점순으로 2쪽을 달라는 뜻이다
- [HTTP 메서드와 상태 코드](../HTTP%20메서드와%20상태%20코드(HTTP%20Methods%20and%20Status%20Codes)/README.md) 문서에서 본 GET 요청이 조건을 보낼 때 주로 쓰는 자리다

### 쿼리 (Query)
사전적 의미는 질문, 문의다. 라틴어 quaere(물어라)에서 온 말이다.
공학적으로는 원하는 데이터를 달라고 묻는 요청을 말한다. 데이터베이스에 보내는 SQL 문도 쿼리라고 부른다.

### 스트링 (String)
사전적 의미는 끈, 실에 꿴 줄이다.
공학적으로는 글자를 한 줄로 꿰어 놓은 데이터, 곧 문자열을 말한다. 쿼리스트링은 서버에게 묻는 질문을 주소에 문자열로 적어 붙인 것이다.

<br/>

## 목록 화면의 정렬 버튼으로 이해하기
배달앱에서 보는 화면은 늘 치킨집 목록이다. 화면 위의 정렬과 필터 버튼만 바꾸면 같은 목록이 다른 순서와 개수로 나온다.

경로(`/stores`)가 어떤 목록인지를 정한다면, 쿼리스트링은 그 정렬, 필터 버튼을 어떻게 눌러 두었는지를 적은 것이다.

```
https://example.com/stores?sort=rating&limit=2
                   ------- --------------------
                   어떤 목록  보는 조건 (평점순, 2곳만)
```

<br/>

## 생김새와 규칙
주소는 여러 부분으로 나뉘고, 쿼리스트링은 경로 뒤, `#` 앞에 온다.

```
https://example.com:443/stores?sort=distance&page=2#review
-----   ----------- --- ------ -------------------- ------
스킴     호스트      포트  경로    쿼리스트링             프래그먼트
```

스킴(Scheme)은 어떤 방식으로 접속할지(https), 호스트(Host)는 어느 서버인지, 포트(Port)는 그 서버의 몇 번 문인지, 경로(Path)는 서버 안의 어느 자원인지를 나타낸다.

- 쿼리스트링은 `?` 다음부터 `#` 앞까지, `#`이 없으면 주소 끝까지다
- `이름=값` 쌍을 `&`로 잇는다. 이 쌍 하나를 쿼리 매개변수(Query Parameter)라고 하고, 흔히 쿼리 파라미터라고 부른다. Parameter는 결과를 정하는 조건 값이라는 뜻으로, 함수에 넘기는 매개변수와 같은 말이다
- 값을 비워 둘 수도 있고(`?q=`), 같은 이름을 여러 번 쓸 수도 있다(`?tag=치킨&tag=피자`)
- `#` 뒤의 프래그먼트(Fragment, 조각)는 서버로 보내지 않고 브라우저 안에서만 쓴다. 주로 페이지 안의 특정 위치를 가리킬 때 쓴다

인터넷 표준 문서(RFC, Request for Comments) 중 주소의 문법을 정한 RFC 3986은 쿼리를 `?` 뒤의 부분이라고만 정하고, 그 안을 `이름=값&이름=값`으로 쓰라고 정하지는 않는다. 이 모양은 HTML 폼이 값을 보내는 방식에서 굳어진 관례이고, 브라우저와 대부분의 서버가 이 관례대로 읽는다.

<br/>

## 왜 필요할까
같은 자원에 조건만 다르게 붙여 요청하고 싶은 일이 많다. 검색어, 정렬 기준, 쪽 번호, 필터 같은 것이다.

POST 요청이라면 이런 값을 본문에 넣을 수 있다. 하지만 조회에 쓰는 GET 요청은 본문을 쓰지 않는다. HTTP 명세(RFC 9110)는 GET 요청에 본문이 와도 정해진 의미가 없다고 적고 있어서, 서버나 중간의 프록시가 본문을 무시하거나 요청을 거절할 수 있다. 그래서 GET의 조건은 주소 자체에 적는다.

주소에 적으면 따라오는 장점도 있다. 주소만 복사하면 같은 검색 결과를 다른 사람에게 보여 줄 수 있고, 즐겨찾기에 저장하거나 뒤로 가기로 돌아와도 같은 조건이 유지된다. 정렬 버튼을 눌러 둔 상태 그대로 화면 주소를 건네면, 받은 사람도 같은 순서의 목록을 보게 된다.

<br/>

## 어떻게 동작할까
1. 클라이언트가 조건을 `이름=값` 쌍으로 만들어 주소 뒤에 붙인다. 브라우저에서 검색창에 글자를 넣고 제출하면, GET 방식의 HTML 폼은 입력칸 이름과 값을 이 모양으로 붙여 준다
2. 요청 줄에 경로와 쿼리스트링이 함께 실려 서버로 간다. `GET /stores?sort=rating&limit=2 HTTP/1.1` 같은 모양이다(HTTP/1.1 기준. HTTP/2부터는 요청 줄 대신 :path라는 자리에 경로와 쿼리스트링이 함께 실린다)
3. 서버는 `?` 뒤를 잘라 `&`로 나누고, 다시 `=`로 나눠 이름과 값을 꺼낸다. 다 나눈 뒤에 인코딩된 글자를 원래대로 푼다(인코딩은 아래 절에서 본다)
4. 꺼낸 값으로 데이터를 고르고 정렬해서 응답한다

서버가 받는 값은 모두 문자열이다. `page=2`의 2도 숫자가 아니라 문자열 `"2"`로 도착하므로, 숫자로 쓰려면 서버가 직접 바꿔야 한다. 이름이 아예 없으면 값이 없다고 처리해야 하니 기본값도 서버가 정해 둔다.

<br/>

## 특수 문자와 한글은 인코딩해서 보낸다
주소에는 영문자, 숫자, 몇몇 기호만 그대로 쓸 수 있다. 띄어쓰기나 한글은 주소에 그대로 넣을 수 없다. 또 `&`와 `=`는 쿼리스트링을 나누는 기호이고, `#`은 프래그먼트가 시작된다는 표시이며, 폼 방식으로 읽으면 `+`는 띄어쓰기로 바뀐다. 그래서 값 안에 이 글자들이 들어 있으면 그대로 보낼 수 없다.

이런 글자는 퍼센트 인코딩(Percent-encoding)으로 바꿔 보낸다. 글자를 UTF-8 바이트로 바꾸고, 바이트 하나를 `%`와 16진수 두 자리로 적는 방식이다. 치킨은 `%EC%B9%98%ED%82%A8`이 된다. 외국으로 편지를 보낼 때 한글 주소를 그쪽 우편 체계가 읽을 수 있는 로마자로 바꿔 적는 것과 같다. 받는 쪽은 정해진 규칙대로 다시 원래 주소로 읽는다. 어떤 글자를 바꾸고 어떤 글자를 남기는지는 [퍼센트 인코딩](../퍼센트%20인코딩(Percent-Encoding)/README.md) 노트에 정리했다.

값 안에 `&`가 들어 있으면 인코딩이 꼭 필요하다. 검색어가 `a&b`인데 그대로 `?q=a&b`로 보내면, 서버는 q가 `a`이고 이름이 `b`인 매개변수가 하나 더 있다고 읽는다. `&`를 `%26`으로 바꿔 `?q=a%26b`로 보내면, 서버가 `&`로 먼저 나눈 다음에 인코딩을 풀기 때문에 `%26`은 구분 기호로 오해받지 않고 검색어 하나로 도착한다.

띄어쓰기는 두 가지로 적힌다. 퍼센트 인코딩으로는 `%20`이고, HTML 폼 방식(application/x-www-form-urlencoded)으로는 `+`다. 자바스크립트의 URLSearchParams는 폼 방식을 따르므로 만들 때는 `+`로 적고, 읽을 때는 `+`와 `%20`을 모두 띄어쓰기로 바꾼다. 반면 decodeURIComponent는 `%20`만 풀고 `+`는 그대로 둔다. 서버가 어느 방식으로 푸느냐에 따라 결과가 달라지는 셈이다.

그래서 글자 `+` 자체를 보내려면 `%2B`로 인코딩해야 한다. `?q=C++`로 보내면 폼 방식으로 읽는 서버에는 C 뒤에 띄어쓰기 두 칸이 붙은 값으로 도착한다.

```js
const params = new URLSearchParams({ q: '양념 & 후라이드', page: 1 });
console.log(params.toString());
// q=%EC%96%91%EB%85%90+%26+%ED%9B%84%EB%9D%BC%EC%9D%B4%EB%93%9C&page=1

console.log(encodeURIComponent('양념 & 후라이드'));
// %EC%96%91%EB%85%90%20%26%20%ED%9B%84%EB%9D%BC%EC%9D%B4%EB%93%9C

console.log(new URLSearchParams('q=a+b').get('q'));   // a b
console.log(new URLSearchParams('q=a%20b').get('q')); // a b
console.log(decodeURIComponent('a+b'));               // a+b

console.log(JSON.stringify(new URLSearchParams('q=C++').get('q'))); // "C  "
console.log(new URLSearchParams({ q: 'C++' }).toString());           // q=C%2B%2B
```

브라우저 주소창에는 한글이 그대로 보이는 경우가 많은데, 화면에 보기 좋게 풀어서 보여 줄 뿐 실제 요청에는 인코딩된 값이 나간다.

<br/>

## 경로에 넣을까, 쿼리스트링에 넣을까
값을 주소에 넣는 자리는 경로와 쿼리스트링 두 곳이다.

경로에는 어떤 자원인지를 가리키는 값을 넣는다. `/stores/3`은 3번 가게라는 자원 하나를 가리키고, 3이 빠지면 다른 자원이 된다.

쿼리스트링에는 같은 자원을 어떻게 보여 줄지 정하는 선택 조건을 넣는다. `/stores?sort=rating`에서 sort가 빠져도 가게 목록이라는 자원은 그대로이고, 순서만 기본값으로 바뀐다. 검색, 정렬, 필터, 쪽 나누기(페이지네이션, Pagination)가 대표적이다.

딱 떨어지는 규칙은 아니고 관례다. 빠져도 되는 값이면 쿼리스트링, 빠지면 다른 것을 가리키게 되는 값이면 경로라고 생각하면 대부분 맞는다.

<br/>

## 주의할 점
- 주소는 여러 곳에 남는다. 브라우저 방문 기록과 서버 접속 기록(로그)에 쿼리스트링까지 함께 남는다. 브라우저가 다른 주소로 요청할 때 붙이는 Referer 헤더(요청을 보낸 페이지 주소)에도 실릴 수 있다. 지금 브라우저들은 기본적으로 같은 사이트 안에서는 쿼리스트링을 포함한 전체 주소를, 다른 사이트에는 도메인까지만 보내지만, 사이트가 정책을 바꾸면 다른 사이트에도 쿼리스트링까지 간다(MDN Referrer-Policy 문서 기준). 그래서 비밀번호나 토큰 같은 비밀 값은 쿼리스트링에 넣지 않는다. [HTTP 헤더](../HTTP%20헤더(HTTP%20Headers)/README.md)의 Authorization이나 POST 본문으로 보낸다
- 주소 길이에는 한계가 있다. RFC 9110은 주소를 최소 8000바이트까지는 처리할 수 있게 만들라고 권하지만, 실제 한계는 브라우저와 서버마다 다르다. 한계를 넘으면 서버가 414 URI Too Long으로 거절할 수 있다. 조건이 아주 길어지면 POST 본문에 담아 보내는 방식을 생각한다
- 값은 항상 문자열로 도착하고, 빠지거나 이상한 값이 올 수도 있다. 서버는 숫자로 바꿀 수 있는지, 허용한 값인지 확인하고 기본값을 둔다
- 같은 이름이 여러 번 왔을 때 첫 값을 쓸지, 마지막 값을 쓸지, 목록으로 모을지는 서버 프로그램마다 다르다. 같은 이름을 여러 번 보내는 쪽이라면 서버가 어떻게 읽는지 확인한다

<br/>

## 코드로 보기
Node.js v24.22.1에서 실행했다. 먼저 주소를 나눠 보면 각 부분이 어떻게 꺼내지는지 보인다.

```js
const url = new URL('https://example.com/stores?sort=distance&page=2&tag=치킨&tag=피자#review');

console.log(url.pathname);                        // /stores
console.log(url.search);                          // ?sort=distance&page=2&tag=%EC%B9%98%ED%82%A8&tag=%ED%94%BC%EC%9E%90
console.log(url.hash);                            // #review
console.log(url.searchParams.get('sort'));        // distance
console.log(typeof url.searchParams.get('page')); // string
console.log(url.searchParams.getAll('tag'));      // [ '치킨', '피자' ]
console.log(url.searchParams.get('size'));        // null
```

한글로 쓴 tag 값이 search에서는 인코딩되어 있고, searchParams로 꺼내면 다시 한글로 풀린다. page는 숫자처럼 보여도 문자열이고, 없는 이름을 꺼내면 null이 나온다. search는 앞의 `?`까지 함께 돌려준다.

다음은 Node.js http 모듈로 만든 서버다. 가게 목록을 쿼리스트링의 sort와 limit에 따라 정렬하고 자른다. 클라이언트 쪽 fetch는 Node.js 18 이상에서 따로 설치 없이 쓸 수 있다.

```js
// server.js
const http = require('http');

const stores = [
  { name: '바삭치킨', distance: 1.2, rating: 4.5 },
  { name: '양념명가', distance: 0.4, rating: 4.8 },
  { name: '간장한마리', distance: 2.5, rating: 4.1 },
];

http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname !== '/stores') {
    res.writeHead(404);
    return res.end();
  }

  // 쿼리스트링 값은 항상 문자열이다. 없으면 null이 나오므로 기본값을 정해 둔다
  const sort = url.searchParams.get('sort') ?? 'distance';
  const limit = Number(url.searchParams.get('limit') ?? 10);

  const result = [...stores]
    .sort((a, b) => (sort === 'rating' ? b.rating - a.rating : a.distance - b.distance))
    .slice(0, limit)
    .map((store) => store.name);

  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(result));
}).listen(3000);
```

```js
// client.js
const base = 'http://localhost:3000/stores';

(async () => {
  // 1. 조건 없이 요청하면 기본값(가까운 순)
  console.log(await (await fetch(base)).text());
  // ["양념명가","바삭치킨","간장한마리"]

  // 2. 같은 주소에 조건만 바꿔 요청
  console.log(await (await fetch(`${base}?sort=rating&limit=2`)).text());
  // ["양념명가","바삭치킨"]

  // 3. URLSearchParams로 쿼리스트링을 만든다
  const params = new URLSearchParams({ sort: 'distance', limit: 1 });
  console.log(`${base}?${params}`);
  // http://localhost:3000/stores?sort=distance&limit=1
  console.log(await (await fetch(`${base}?${params}`)).text());
  // ["양념명가"]
})();
```

세 요청 모두 경로는 `/stores` 하나다. 쿼리스트링만 바꿨는데 순서와 개수가 다른 목록이 돌아온다. 이 예시는 limit에 글자나 음수가 와도 확인하지 않는데, 실제 서버라면 주의할 점에 적은 대로 값을 검사해야 한다.

<br/>

## 더 볼 것 (TODO)
- [퍼센트 인코딩 자세히 (예약 문자, encodeURI와 encodeURIComponent의 차이)](../퍼센트%20인코딩(Percent-Encoding)/README.md)
- [POST 본문의 폼 인코딩 (application/x-www-form-urlencoded와 multipart/form-data)](../폼%20인코딩(Form%20Encoding)/README.md)
- [쿼리스트링과 캐시 (쿼리스트링이 다르면 다른 저장본으로 다루는 이유)](../HTTP%20캐시(HTTP%20Caching)/README.md)
- [쪽 나누기 방식 비교 (쪽 번호 방식과 커서 방식)](../페이지네이션(Pagination)/README.md)
- 프론트엔드에서 쿼리스트링으로 화면 상태(검색어, 필터) 유지하기 (별도 문서)
