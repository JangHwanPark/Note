## 폼 인코딩이란 ?
- HTML 폼에 입력한 값들을 HTTP 요청 본문(Body) 하나로 만드는 규칙. 이름과 값의 쌍 여러 개를 본문 하나에 담고, 받는 쪽이 다시 쌍으로 나눌 수 있게 하는 방법을 정한다
- 주로 쓰는 방식은 application/x-www-form-urlencoded와 multipart/form-data 두 가지다. HTML 폼은 여기에 text/plain까지 세 가지를 고를 수 있다
- 어느 방식으로 만들었는지는 요청의 [Content-Type 헤더](../HTTP%20헤더(HTTP%20Headers)/README.md#content-type)에 적고, 받는 쪽은 그 값을 보고 같은 규칙으로 본문을 다시 나눈다

[쿼리스트링](../쿼리스트링(Query%20String)/README.md#특수-문자와-한글은-인코딩해서-보낸다)과 [퍼센트 인코딩](../퍼센트%20인코딩(Percent-Encoding)/README.md) 노트에서 폼 방식은 띄어쓰기를 `+`로 적는다는 것까지 봤다. 그 노트들은 주소에 값을 싣는 이야기였고, 이 노트는 POST 요청의 본문에 값을 싣는 이야기다. 두 방식이 본문을 실제로 어떤 바이트로 만드는지, 파일을 보낼 때 왜 multipart가 필요한지, JSON 본문과는 무엇이 다른지를 본다.

### 폼 (Form)
사전적 의미는 모양, 형식이고, 여기서는 정해진 칸을 채워 내는 서식(양식)이라는 뜻이다. 주민센터의 신청서처럼 이름, 주소, 연락처 칸이 미리 그려져 있고 사람은 빈칸만 채운다.
공학적으로는 웹 페이지에서 사용자 입력을 받아 서버로 보내는 입력 양식을 말한다. HTML의 `<form>` 요소 안에 입력칸들이 들어 있고, 입력칸마다 name 속성으로 이름이 붙는다. 제출하면 이름과 입력값이 쌍으로 서버에 간다.

### 인코딩 (Encoding)
정보를 정해진 규칙에 따라 다른 표현으로 바꾸는 일이다. 단어의 뜻은 [퍼센트 인코딩](../퍼센트%20인코딩(Percent-Encoding)/README.md) 노트에서 정리했다.
폼 인코딩에서 바꾸는 대상은 글자 하나가 아니라 폼 전체다. 이름과 값의 목록을 상대가 다시 목록으로 되돌릴 수 있는 본문 하나로 바꾼다.

<br/>

## 왜 필요할까
HTTP 본문은 그냥 바이트의 연속이다. 본문 안에 칸막이가 따로 있지 않다. 그런데 폼에는 값이 여러 개 있다. 이름이 menu이고 값이 양념 치킨인 것, 이름이 qty이고 값이 2인 것을 한 본문에 담으려면 어디까지가 이름이고 어디서 값이 시작하며 어디서 다음 쌍으로 넘어가는지를 정해야 한다.

또 하나는 받는 쪽과의 약속이다. 보내는 쪽이 아무리 잘 나눠 담아도 받는 쪽이 같은 규칙을 모르면 되돌릴 수 없다. 그래서 규칙에 이름([MIME 타입](../HTTP%20헤더(HTTP%20Headers)/README.md#content-type))을 붙이고, 이 이름을 Content-Type에 적어 보낸다. 받는 쪽은 이름을 보고 어떤 규칙으로 풀지 고른다.

<br/>

## 어디서 고를까
HTML 폼은 enctype(encoding type) 속성으로 방식을 고른다. HTML 표준(4.10.19.6절)은 쓸 수 있는 값을 셋으로 정한다.

- application/x-www-form-urlencoded. 속성을 적지 않거나 잘못 적으면 이 값이 된다
- multipart/form-data
- text/plain

이 enctype이 쓰이는 것은 POST로 보낼 때다. HTML 표준의 폼 제출 절차(4.10.22.3절)는 http, https 주소에 GET으로 보내면 enctype과 상관없이 폼 방식으로 만든 문자열을 주소의 쿼리에 붙이고, POST로 보낼 때만 enctype에 따라 본문을 만든다. 쿼리스트링 노트에서 본 검색창 제출이 GET 쪽이고, 이 노트는 POST 쪽이다.

스크립트로 보낼 때는 본문에 무엇을 넣느냐가 방식을 정한다. 이 노트의 예시처럼 URLSearchParams를 넣으면 폼 방식, FormData를 넣으면 multipart/form-data가 된다(Fetch 표준 5.2절).

<br/>

## application/x-www-form-urlencoded
이름이 길지만 뜻은 단순하다. www-form은 웹 폼, urlencoded는 주소(URL)에 쓰는 방식으로 인코딩했다는 뜻이다. 이 노트에서는 앞의 노트들처럼 폼 방식이라고 부른다.

### 본문을 만드는 방법
쿼리스트링과 같은 모양을 본문에 그대로 쓴다. WHATWG URL 표준 5.2절의 쓰는 절차는 아래와 같다.

1. 이름과 값을 각각 UTF-8 바이트로 바꾸고, 영문, 숫자, `*`, `-`, `.`, `_`가 아닌 바이트는 퍼센트 인코딩한다. 띄어쓰기만은 `%20`이 아니라 `+`로 적는다
2. 이름과 값 사이에 `=`를 넣는다
3. 쌍과 쌍 사이에 `&`를 넣는다

읽는 절차(5.1절)는 거꾸로다. `&`로 나누고, 첫 `=`로 이름과 값을 나누고, `+`를 띄어쓰기로 바꾼 뒤 퍼센트 인코딩을 푼다. 나눈 다음에 풀기 때문에 값 안의 `&`가 `%26`으로 와 있으면 구분 기호로 오해받지 않는다.

신청서 내용을 전화로 불러 주는 것과 비슷하다. 칸 이름과 내용을 한 줄로 이어 말하되, 칸 사이에는 "다음"이라고 말하기로 약속한다. 내용 안에 "다음"이라는 말이 있으면 그대로 말하지 않고 미리 정한 다른 말로 바꿔 부른다.

URLSearchParams를 본문으로 넣은 요청을 만들어 실제 본문을 찍어 봤다. Request는 요청을 보내지 않고 만들기만 하는 도구라서 서버 없이도 본문을 읽어 볼 수 있다. 이 노트의 코드는 모두 Windows의 Node.js v24.22.1에서 실행했다.

```js
const params = new URLSearchParams({ menu: '양념 치킨', memo: 'a&b=c+d' });
const r1 = new Request('http://localhost/order', { method: 'POST', body: params });
console.log(r1.headers.get('content-type'));
// application/x-www-form-urlencoded;charset=UTF-8
console.log(await r1.text());
// menu=%EC%96%91%EB%85%90+%EC%B9%98%ED%82%A8&memo=a%26b%3Dc%2Bd
```

한글은 UTF-8 바이트마다 `%XX`가 되었고, 띄어쓰기는 `+`, 값 안의 `&` `=` `+`는 `%26` `%3D` `%2B`가 되었다. Content-Type은 직접 적지 않았는데도 붙었다. Fetch 표준 5.2절은 본문으로 URLSearchParams를 받으면 Content-Type을 `application/x-www-form-urlencoded;charset=UTF-8`로 정하라고 한다.

### 장점과 한계
본문이 짧다. RFC 7578 5.3절도 이 형식이 꽤 간결하다(quite compact)고 적는다. 대신 같은 절은 값마다 따로 형식(Content-Type)이나 문자 인코딩을 붙일 방법이 없다고 지적한다. 모든 값은 글자로만 다뤄진다.

그리고 영문, 숫자, 기호 네 개와 띄어쓰기를 뺀 모든 바이트가 세 글자(`%XX`)로 늘어난다. 한글이나 이진 데이터가 많을수록 본문이 커진다.

<br/>

## multipart/form-data
### 멀티파트 (Multipart)
multi는 여럿, part는 부분이라는 뜻이다. 여러 부분으로 이루어졌다는 말이다.
공학적으로는 본문 하나를 여러 부분(part)으로 나누고, 부분마다 자기 헤더와 내용을 따로 갖게 하는 형식을 말한다. MIME의 multipart 형식(RFC 2046 5.1절)에서 왔다. RFC 7578 4절은 multipart/form-data가 이 모델을 따르고, 본문은 경계(boundary)로 나뉜 부분들의 연속이라고 정한다. 이 노트에서는 이후 multipart라고 쓴다.

택배 상자 하나에 칸막이를 세우고 칸마다 물건을 넣은 뒤, 칸마다 이 칸에는 무엇이 들었는지 적은 라벨을 붙이는 것과 같다. 칸막이가 boundary이고, 라벨이 부분마다 붙는 헤더다.

### 본문을 만드는 방법
같은 값에 작은 파일 하나를 더해 FormData로 요청을 만들어 봤다. Blob은 자바스크립트에서 파일처럼 다룰 수 있는 바이트 묶음이다. 여기서는 실제 파일 대신 썼다.

```js
const form = new FormData();
form.append('menu', '양념 치킨');
form.append('photo', new Blob(['hello'], { type: 'text/plain' }), 'memo.txt');
const r2 = new Request('http://localhost/order', { method: 'POST', body: form });
console.log(r2.headers.get('content-type'));
console.log(await r2.text());
```

```
multipart/form-data; boundary=----formdata-undici-088178392892
------formdata-undici-088178392892
Content-Disposition: form-data; name="menu"

양념 치킨
------formdata-undici-088178392892
Content-Disposition: form-data; name="photo"; filename="memo.txt"
Content-Type: text/plain

hello
------formdata-undici-088178392892--
```

boundary 값의 뒤쪽 숫자는 실행할 때마다 바뀐다. 위 값은 한 번 실행했을 때 나온 값이고, 다시 실행하면 다른 숫자가 나왔다. `----formdata-undici-`라는 앞부분은 Node.js의 fetch 구현(undici)이 붙이는 것이다. 브라우저는 자기 방식으로 boundary를 만들고, 그 모양은 이 노트에서 확인하지 않았다. 같은 본문을 `JSON.stringify`로 찍어 보면 줄 끝이 모두 `\r\n`이었다. CR(Carriage Return)과 LF(Line Feed) 두 글자를 이어 줄바꿈을 나타내는 방식이다.

본문을 위에서부터 읽으면 이렇다.

- Content-Type의 boundary 매개변수가 경계로 쓸 문자열을 알린다. 받는 쪽은 본문을 읽기 전에 이 값부터 안다
- 본문에서는 boundary 값 앞에 `--`를 붙인 줄이 경계 줄이다(RFC 7578 4.1절, RFC 2046 5.1.1절). 위에서는 boundary 값이 이미 `----`로 시작해서 경계 줄의 앞쪽 대시가 여섯 개가 되었다
- 경계 줄 다음에는 그 부분의 헤더가 오고, 빈 줄 하나 뒤에 내용이 온다
- 부분마다 Content-Disposition 헤더가 꼭 있어야 하고, 값은 form-data이며 name 매개변수에 입력칸 이름을 적는다(RFC 7578 4.2절)
- 파일이면 filename 매개변수로 파일 이름을 함께 적으라고 권한다(4.2절). 부분의 Content-Type은 적지 않으면 text/plain으로 보고, 파일이면 알맞은 형식이나 application/octet-stream을 적으라고 권한다(4.4절). HTML 표준(4.10.22.8절)은 파일이 아닌 값의 부분에는 Content-Type을 붙이지 않게 한다. 위 결과에서도 menu 부분에는 Content-Type이 없다
- 마지막 경계 줄은 뒤에 `--`가 하나 더 붙는다. 여기서 본문이 끝난다는 표시다(RFC 2046 5.1.1절)

### Disposition과 boundary
Content-Disposition의 disposition은 배치, 처리라는 뜻이다. 이 내용을 어떻게 다룰지 알리는 헤더라는 이름이다. multipart/form-data에서는 이 부분이 폼 데이터이고(form-data), 폼의 어느 입력칸에서 왔는지(name)를 알리는 데 쓴다. 이 헤더 자체는 RFC 2183이 정한 것인데, RFC 2183은 이 노트를 쓰며 직접 읽지 않았다.

boundary는 경계, 국경선이라는 뜻이다. 부분과 부분 사이의 경계선이 된다. RFC 2046 5.1.1절은 경계 문자열이 부분 내용 안에 나오면 안 되고, 앞의 대시 두 개를 빼고 70글자를 넘으면 안 된다고 정한다. 내용 안에 같은 줄이 있으면 받는 쪽이 거기서 부분이 끝났다고 잘못 읽기 때문이다. 그래서 보내는 쪽은 내용에 나올 가능성이 거의 없는 무작위 문자열을 고른다. 위 실행에서 매번 숫자가 바뀐 것도 그래서다. 무작위로 고른 문자열이 내용과 겹치지 않는다는 보장을 구현이 어떻게 하는지는 확인하지 못했다(확인 필요).

### 퍼센트 인코딩을 하지 않는다
위 결과에서 양념 치킨은 `%EC%96%91...`이 아니라 한글 그대로 들어 있다. multipart는 구분을 경계 줄로 하므로, 내용 안의 `&`나 `=`, 띄어쓰기를 바꿀 필요가 없다. 내용은 바이트 그대로 실린다. fetch에 FormData를 넣으면 UTF-8을 쓰고(Fetch 표준 5.2절), HTML 폼은 폼의 문자 인코딩을 쓴다(HTML 표준 4.10.22.8절).

이름과 파일 이름은 헤더 줄 안에 큰따옴표로 감싸 들어가므로, 큰따옴표와 줄바꿈만은 `%22`, `%0D`, `%0A`로 바꾼다(HTML 표준 4.10.22.8절). 한글 파일 이름으로 확인해 봤다.

```js
const f = new FormData();
f.append('na"me', 'a\nb');
f.append('file', new Blob([new Uint8Array([0x00, 0xff, 0x0d, 0x0a])]), '치킨 "메뉴".png');
const r = new Request('http://localhost/', { method: 'POST', body: f });
console.log(JSON.stringify(await r.text()));
// (결과 중 두 부분의 헤더와 첫 부분의 내용만 옮김)
// Content-Disposition: form-data; name=\"na%22me\"\r\n\r\na\r\nb\r\n
// Content-Disposition: form-data; name=\"file\"; filename=\"치킨 %22메뉴%22.png\"\r\nContent-Type: application/octet-stream\r\n
```

`\"`는 JSON 문자열 안의 큰따옴표 표시다. 이름의 `"`는 `%22`가 되었고, 한글 파일 이름은 바꾸지 않고 UTF-8 그대로 들어갔다. 값 안의 줄바꿈 `\n`은 `\r\n`으로 바뀌었는데, HTML 표준 4.10.22.8절이 파일이 아닌 값의 줄바꿈을 CR LF로 맞추게 하기 때문이다. 형식을 적지 않은 Blob에는 application/octet-stream이 붙었다. 파일 이름의 문자 인코딩을 다루는 방법은 구현마다 차이가 있어서(RFC 7578 4.2절, 5.1절) TODO로 남긴다.

<br/>

## 파일 업로드에는 왜 multipart가 필요할까
이유는 두 가지다.

첫째, 폼 방식에는 파일을 담을 자리가 없다. 폼 방식은 이름과 문자열 값의 쌍만 다룬다. HTML 표준 4.10.22.6절은 폼 방식과 text/plain으로 보낼 때 파일 입력칸의 값을 파일 이름 문자열로 바꾸라고 정한다. 그래서 파일 입력칸이 있는 폼을 enctype 없이 POST로 제출하면 파일 내용은 가지 않고 이름만 간다. 파일 이름, 파일 형식 같은 정보를 붙일 칸도 없다. 이 동작을 브라우저에서 직접 확인하지는 못했다(표준 문구 기준).

둘째, 억지로 담으면 커진다. 파일 내용을 글자로 바꿔 폼 방식에 넣는다고 해 보자. 0부터 255까지 256개 바이트를 폼 방식 규칙(영문, 숫자, `*`, `-`, `.`, `_`는 그대로, 띄어쓰기는 `+`, 나머지는 `%XX`)대로 바꾸는 함수를 직접 써서 길이를 쟀다.

```js
const bytes = Uint8Array.from({ length: 256 }, (_, i) => i);
const safe = /[A-Za-z0-9*\-._]/;
const encoded = [...bytes]
  .map((b) => {
    const c = String.fromCharCode(b);
    if (b === 0x20) return '+';
    return safe.test(c) ? c : '%' + b.toString(16).toUpperCase().padStart(2, '0');
  })
  .join('');
console.log(bytes.length, encoded.length); // 256 634
```

256바이트가 634바이트가 되었다. 그대로 두는 66개와 `+` 한 글자가 되는 띄어쓰기를 뺀 189개 바이트가 세 글자씩 되었기 때문이다. 사진이나 압축 파일처럼 바이트 값이 고르게 퍼져 있는 데이터라면 대략 이 정도로 커진다고 볼 수 있다.

multipart는 부분 내용을 그대로 싣는다. 바이트를 바꾸지 않으니 커지지 않고, 부분마다 헤더가 있으니 파일 이름(filename)과 형식(Content-Type)도 함께 보낼 수 있다. 붙는 것은 경계 줄과 부분 헤더뿐이다. RFC 7578 4.7절도 HTTP처럼 이진 데이터를 그대로 보낼 수 있는 곳에서는 부분마다 내용을 다시 인코딩하는(Content-Transfer-Encoding) 방식을 쓰지 말라고 정한다.

한 입력칸에 파일을 여러 개 고르면 파일마다 부분을 따로 만들고 name을 같게 둔다(RFC 7578 4.3절). 받는 쪽은 같은 이름의 부분을 합치지 말아야 하고, 중간에서 순서를 바꾸면 안 된다(5.2절).

<br/>

## text/plain
HTML 폼이 고를 수 있는 세 번째 방식이다. HTML 표준 4.10.22.9절의 절차는 단순하다. 이름, `=`, 값을 잇고 쌍마다 줄바꿈(CR LF)을 붙인다. 아무 글자도 바꾸지 않는다.

```
menu=양념 치킨
qty=2
```

(위는 표준 절차대로 손으로 적은 모양이고, 브라우저에서 실행해 확인하지는 않았다.)

같은 절은 이 형식이 사람이 읽으라고 만든 것이고, 컴퓨터가 믿고 해석할 수는 없다고 적는다. 값 안에 줄바꿈이나 `=`가 있어도 바꾸지 않으니, 값 안의 줄바꿈과 쌍을 나누는 줄바꿈을 구분할 방법이 없기 때문이다. 그래서 서버가 읽을 데이터를 보내는 데는 쓰지 않는 것이 좋다.

[CORS](../CORS(Cross-Origin%20Resource%20Sharing)/README.md#단순-요청의-조건) 노트에서 단순 요청의 Content-Type이 application/x-www-form-urlencoded, multipart/form-data, text/plain 셋뿐이라고 했는데, 바로 이 세 가지 폼 인코딩이다. HTML 폼으로 원래 보낼 수 있던 모양이라 Content-Type 때문에 사전 요청이 붙지는 않는다.

<br/>

## JSON 본문과의 차이
JSON 본문은 폼 인코딩이 아니다. HTML 폼이 만들 수 있는 형식 목록에 없고, 스크립트(fetch 등)로만 보낸다. 그래도 같은 POST 본문 자리에 쓰이니 차이를 짚어 둔다.

- 값의 모양이 다르다. 폼 인코딩에서 파일이 아닌 값은 모두 문자열이다. 서버가 받은 qty의 2는 문자열 `"2"`다. JSON은 숫자 2, 참거짓, 배열, 객체를 구분해 보낼 수 있다. 폼 방식으로 배열이나 중첩된 값을 보내려면 `tag=a&tag=b`나 `user[name]=...` 같은 관례를 써야 하는데, WHATWG URL 표준 5절이 정하는 것은 이름과 값 쌍의 목록뿐이라 이런 관례는 서버 도구마다 다르게 읽는다
- 파일을 담는 방법이 없다. JSON은 글자로 된 형식이라 이진 데이터를 그대로 넣을 수 없고, Base64 같은 방식으로 글자로 바꿔 넣는다. Base64는 3바이트를 4글자로 적어서, 위의 256바이트는 344글자가 되었다(`Buffer.from(bytes).toString('base64').length`). 폼 방식보다는 덜 커지지만 multipart처럼 그대로 싣지는 못한다
- Content-Type을 직접 적어야 한다. fetch에 `JSON.stringify(...)` 결과인 문자열을 본문으로 넣으면 Content-Type은 text/plain;charset=UTF-8이 된다(Fetch 표준 5.2절, Node.js에서도 같은 값이 나왔다). application/json으로 보내려면 헤더를 직접 넣어야 한다. 이 값은 단순 요청 목록 밖이라 다른 출처로 보내면 사전 요청이 붙는다

그래서 화면 없이 프로그램끼리 구조가 있는 데이터를 주고받는 API에서는 JSON을, HTML 폼 제출과 파일 업로드에는 폼 인코딩을 주로 쓴다. 파일과 구조 있는 데이터를 함께 보내야 하면 multipart의 한 부분에 JSON 문자열을 넣는 방법도 쓰인다(별도 주제로 TODO에 남긴다).

<br/>

## 언제 어느 것을 쓸까
| 구분 | 폼 방식 (urlencoded) | multipart/form-data | JSON (application/json) |
| --- | --- | --- | --- |
| 값의 종류 | 문자열 쌍 | 문자열과 파일 | 문자열, 숫자, 참거짓, null, 배열, 객체 |
| 구분 방법 | `&`와 `=`, 값은 퍼센트 인코딩 | 경계 줄, 내용은 그대로 | JSON 문법(따옴표, 괄호) |
| 파일 | 담을 수 없다(이름만 간다) | 그대로 담는다 | 글자로 바꿔야 한다(Base64 등) |
| HTML 폼으로 보내기 | 된다(기본값) | 된다 | 안 된다 |
| Content-Type 때문에 붙는 사전 요청 | 없다 | 없다 | 있다 |

글자 값 몇 개만 POST로 보내는 폼(로그인, 댓글)은 폼 방식으로 충분하다. 본문이 짧고, 거의 모든 서버 도구가 읽을 수 있다. 파일이 하나라도 섞이면 multipart를 쓴다. HTML 폼이라면 `<form method="post" enctype="multipart/form-data">`처럼 적어야 하고, 적지 않으면 앞에서 본 대로 파일 이름만 간다.

같은 값(menu와 qty) 두 개를 세 방식으로 만들어 본문 크기를 재 봤다.

```js
const data = { menu: '양념 치킨', qty: '2' };
const form = new FormData();
for (const [name, value] of Object.entries(data)) form.append(name, value);
const json = JSON.stringify({ menu: '양념 치킨', qty: 2 });

const size = async (body) => (await new Request('http://localhost/', { method: 'POST', body }).arrayBuffer()).byteLength;
console.log(await size(new URLSearchParams(data))); // 48
console.log(await size(form));                      // 221
console.log(await size(json));                      // 32
```

multipart의 크기는 이 실행에서 Node.js가 만든 boundary 길이(32글자) 기준이고, boundary가 길거나 짧으면 달라진다. 값이 짧은 폼에서는 경계 줄과 부분 헤더가 내용보다 커서 multipart가 가장 길다. 반대로 파일처럼 큰 이진 데이터에서는 바이트를 바꾸지 않는 multipart가 가장 작다.

<br/>

## 받는 쪽은 어떻게 읽을까
받는 쪽이 할 일은 보내는 쪽의 거꾸로다. Content-Type을 보고 규칙을 고른 뒤 본문을 나눈다. multipart라면 Content-Type에서 boundary 값을 꺼내고, 경계 줄을 찾아 부분을 나누고, 부분마다 헤더와 내용을 나눈다.

Node.js의 Response는 formData()라는 메서드로 두 형식을 모두 읽을 수 있다. 본문을 그대로 받아 이 메서드에 넘기는 작은 서버로 확인했다.

```js
// server.js
const http = require('http');

http.createServer(async (req, res) => {
  const pieces = [];
  for await (const piece of req) pieces.push(piece);
  const raw = Buffer.concat(pieces);
  const type = req.headers['content-type'];

  // 받은 본문을 Content-Type에 맞게 다시 읽는다
  const parsed = await new Response(raw, { headers: { 'content-type': type } }).formData();
  const fields = {};
  for (const [name, value] of parsed) {
    fields[name] = typeof value === 'string' ? value : `파일 ${value.name}, ${value.size}바이트, ${value.type}`;
  }

  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ type, length: raw.length, fields }));
}).listen(3000);
```

```js
// client.js
const url = 'http://localhost:3000/order';

(async () => {
  // 1. 폼 방식
  const params = new URLSearchParams({ menu: '양념 치킨', qty: '2' });
  console.log(await (await fetch(url, { method: 'POST', body: params })).text());
  // {"type":"application/x-www-form-urlencoded;charset=UTF-8","length":48,"fields":{"menu":"양념 치킨","qty":"2"}}

  // 2. multipart, 파일 포함
  const form = new FormData();
  form.append('menu', '양념 치킨');
  form.append('qty', '2');
  form.append('photo', new Blob([new Uint8Array([0x89, 0x50, 0x4e, 0x47])], { type: 'image/png' }), 'chicken.png');
  console.log(await (await fetch(url, { method: 'POST', body: form })).text());
  // {"type":"multipart/form-data; boundary=----formdata-undici-073351994282","length":360,"fields":{"menu":"양념 치킨","qty":"2","photo":"파일 chicken.png, 4바이트, image/png"}}
})();
```

서버 코드는 하나이고, 서버는 Content-Type만 보고 어느 규칙으로 읽을지 골랐다. 두 요청 모두 menu와 qty를 꺼냈고, qty는 두 경우 모두 문자열 `"2"`로 도착했다. 두 번째 응답의 boundary는 실행할 때마다 바뀌는 값이다. 실제 서버 프로그램은 보통 프레임워크나 라이브러리가 이 일을 대신하는데, 도구마다 사용법이 달라 별도 문서로 미룬다.

<br/>

## 주의할 점
- 파일 이름을 그대로 믿지 않는다. RFC 7578 4.2절은 받은 filename을 그대로 쓰지 말고, 자기 파일 시스템 규칙에 맞는지 확인해 필요하면 바꾸고, 이름에 든 디렉터리 경로 정보는 쓰지 말라고 한다. 7절도 파일 이름 때문에 받는 쪽의 파일을 덮어쓰지 않게 조심하라고 적는다. `../`가 든 이름을 그대로 저장 경로에 붙이면 엉뚱한 폴더에 쓸 수 있다
- 파일 내용도 믿지 않는다. 7절은 multipart로 받은 파일에 실행 가능한 내용이 들어 있을 수 있으니 대비하라고 한다. 부분의 Content-Type도 보내는 쪽이 적은 값일 뿐이라 실제 내용과 다를 수 있다
- 폼 인코딩은 내용을 숨기지 않는다. 퍼센트 인코딩도 boundary도 누구나 되돌릴 수 있는 규칙이다. RFC 7578 7절은 multipart/form-data 자체에 무결성 확인이나 기밀성 같은 보안 기능이 없다고 적는다. 비밀 값은 HTTPS로 보낸다
- Content-Type을 손으로 적을 때 조심한다. multipart는 Content-Type의 boundary 값과 본문의 경계 줄이 같아야 읽힌다. Node.js에서 FormData를 본문으로 넣으면서 Content-Type을 `multipart/form-data`로만 직접 적어 봤더니, 직접 적은 값이 그대로 쓰여 boundary 매개변수가 빠졌다. 본문에는 경계 줄이 있지만 받는 쪽은 그 값을 알 수 없어서, 이 Content-Type으로 formData()를 부르면 `TypeError: Failed to parse body as FormData.` 가 났다. FormData를 넣을 때는 Content-Type을 적지 않고 도구가 붙이게 둔다. 브라우저의 동작은 확인하지 않았다

<br/>

## 정리
- 폼 인코딩은 폼의 이름과 값 쌍들을 본문 하나로 만드는 규칙이고, 어느 규칙을 썼는지는 Content-Type에 적는다
- 폼 방식(application/x-www-form-urlencoded)은 쿼리스트링과 같은 모양을 본문에 쓴다. 짧지만 문자열만 담고, 영문, 숫자, `* - . _`와 띄어쓰기 밖의 바이트는 세 글자로 늘어난다
- multipart/form-data는 경계 줄로 부분을 나누고 부분마다 헤더를 둔다. 내용은 바꾸지 않고 그대로 싣기 때문에 파일 업로드에 쓴다
- text/plain은 사람이 읽기 위한 형식이라 서버가 믿고 해석할 수 없다
- JSON 본문은 폼 인코딩이 아니며, 값의 종류를 구분해 보낼 수 있지만 HTML 폼으로는 보낼 수 없다. Content-Type을 application/json으로 적으면 다른 출처에는 사전 요청이 붙는다

<br/>

## 참고 자료
- WHATWG, [HTML Living Standard](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html) (2026년 10월 26일 갱신판을 2026년 10월 29일에 확인). 4.10.19.6절 Form submission attributes(enctype), 4.10.22.3절 Form submission algorithm, 4.10.22.4절 Constructing the entry list, 4.10.22.6절 Converting an entry list to a list of name-value pairs, 4.10.22.8절 Multipart form data, 4.10.22.9절 Plain text form data
- WHATWG, [URL Standard](https://url.spec.whatwg.org/) (2026년 10월 19일 갱신판을 2026년 10월 29일에 확인). 1.3절 Percent-encoded bytes(application/x-www-form-urlencoded percent-encode set), 5절 application/x-www-form-urlencoded(5.1 parsing, 5.2 serializing)
- WHATWG, [Fetch Standard](https://fetch.spec.whatwg.org/) (2026년 10월 19일 갱신판을 2026년 10월 29일에 확인). 5.2절 BodyInit unions(extract a body)
- IETF, [RFC 7578 Returning Values from Forms: multipart/form-data](https://www.rfc-editor.org/rfc/rfc7578) (2015). 4절 Definition of multipart/form-data(4.1 boundary, 4.2 Content-Disposition, 4.3 여러 파일, 4.4 Content-Type, 4.7 Content-Transfer-Encoding), 5.1절 Non-ASCII Field Names and Values, 5.2절 Ordered Fields and Duplicated Field Names, 5.3절 Interoperability with Web Applications, 7절 Security Considerations
- IETF, [RFC 2046 MIME Part Two: Media Types](https://www.rfc-editor.org/rfc/rfc2046) (1996). 5.1.1절 Common Syntax(경계 줄과 마지막 줄, 70글자 제한)

<br/>

## 더 볼 것 (TODO)
- 서버 프레임워크에서 폼 본문과 파일 읽기 (Express의 body 파서와 multer 같은 도구, 별도 문서)
- 프론트엔드에서 FormData로 파일 업로드하기와 업로드 진행률 표시 (별도 문서)
- 큰 파일 업로드 방식 (스트리밍으로 받기, 나눠 올리기와 이어 올리기, 미리 서명된 주소로 저장소에 바로 올리기)
- multipart 한 부분에 JSON을 넣어 파일과 구조 있는 데이터를 함께 보내기
- 폼 인코딩과 문자 인코딩 (폼의 accept-charset, _charset_ 필드, UTF-8이 아닌 페이지에서 제출할 때, multipart 헤더 안의 한글 파일 이름 처리가 구현마다 다른 문제)
- 업로드 파일 검사 (확장자와 실제 형식 확인, 크기 제한, 저장 경로 처리)
- Base64 인코딩과 data: URL
