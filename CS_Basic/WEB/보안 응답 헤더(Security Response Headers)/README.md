## 보안 응답 헤더란 ?
- 서버가 응답에 붙여, 그 응답을 받은 브라우저에게 어떻게 행동하라고 지시하는 헤더들이다. 어떤 스크립트를 실행할지, HTTPS로만 접속할지, 다른 사이트 안에 끼워 넣어도 되는지 같은 것을 정한다
- 서버가 직접 막는 장치가 아니라 브라우저가 대신 지켜 주는 규칙이다. 그래서 이 헤더를 따르는 브라우저에서만 효과가 있다
- 헤더의 기본 모양은 [HTTP 헤더](../HTTP%20헤더(HTTP%20Headers)/README.md)에 정리했다. 이 문서는 그 노트의 TODO였던 보안 관련 응답 헤더를 다룬다

### 정책 (Policy)
사전적 의미는 방침, 어떤 일을 할 때 따르기로 정한 원칙이다.
공학적으로는 시스템이 무엇을 허락하고 무엇을 막을지 미리 적어 둔 규칙 묶음을 말한다. 이 문서에 나오는 헤더 이름에 Policy가 자주 붙는 이유가 이것이다. 서버가 방침을 적어 보내면 브라우저가 그 방침대로 판단한다.

<br/>

## 왜 서버가 아니라 브라우저에게 맡길까
서버의 일은 응답을 보내는 순간 끝난다. 그 뒤 페이지를 그리고, 스크립트를 실행하고, 다음 요청을 보내는 것은 모두 사용자의 브라우저다. 그런데 이 문서에서 다룰 공격은 대부분 바로 그 뒤에서 일어난다.

- 게시글에 숨어 들어온 스크립트가 페이지 안에서 실행된다(XSS)
- 사용자가 주소창에 http://로 들어온 첫 요청을 중간에서 가로채 HTTPS로 넘어가지 못하게 한다(다운그레이드)
- 다른 사이트가 우리 페이지를 투명하게 만들어 자기 화면 위에 덮어 두고 사용자의 클릭을 훔친다(클릭재킹)

서버는 이 순간에 그 자리에 없다. 그래서 응답에 이 페이지를 다룰 때 지킬 규칙을 적어 보내고, 현장에 있는 브라우저가 그 규칙을 지키게 한다. 집을 비우는 주인이 집을 봐 주는 사람에게 모르는 사람은 들이지 말라는 당부 메모를 남기는 것과 같다.

이 방식에는 한계도 따라온다. 메모를 읽고 지키는 사람이 있어야 효과가 있다. [CORS](../CORS(Cross-Origin%20Resource%20Sharing)/README.md#cors는-브라우저가-지키는-규칙이다) 노트에서 본 것처럼 curl이나 서버끼리의 요청은 이 헤더들을 그냥 무시한다. 보안 응답 헤더는 사용자의 브라우저 안에서 벌어지는 공격의 피해를 줄이는 장치이지, 서버를 직접 지키는 장치가 아니다. 또 서버가 보내지 않으면 아무 일도 일어나지 않는다. 아래 [코드로 보기](#코드로-보기)에서 보듯 example.com은 이 문서의 헤더를 하나도 보내지 않는다.

<br/>

## Content-Security-Policy (CSP)
### 이름의 뜻
Content는 내용물, Security는 보안, Policy는 방침이다. 합치면 콘텐츠 보안 방침, 보통 줄여서 CSP라고 부른다.
공학적으로는 이 페이지가 어디서 온 스크립트, 이미지, 스타일 같은 자원을 불러오고 실행해도 되는지 서버가 목록으로 알려 주는 헤더다. 브라우저는 목록에 없는 자원을 불러오거나 실행하지 않는다. W3C가 정리 중인 명세는 Content Security Policy Level 3이고, 이 문서는 2026년 10월 27일자 편집자 초안(Editor's Draft)을 기준으로 했다.

### XSS 피해를 줄이는 방식
XSS(Cross-Site Scripting, 교차 사이트 스크립팅)가 무엇이고 어떻게 쿠키를 훔치는지는 [쿠키](../쿠키(Cookie)/README.md#xss로-쿠키-훔치기) 노트에 정리했다. 그 노트에서 본 HttpOnly는 스크립트가 쿠키를 꺼내 가는 것만 막고, 숨어 들어온 스크립트가 실행되는 것 자체는 막지 못했다.

CSP는 한 단계 앞에서 막는다. 공격자가 게시글에 `<script>` 를 숨겨 넣는 데 성공해도, 그 스크립트가 서버가 허락한 목록에 없으면 브라우저가 실행하지 않는다. 공연장 경비원이 출연자 명단을 들고 있어서, 무대에 오르려는 사람이 명단에 없으면 올려 보내지 않는 것과 같다. 관객석에 몰래 들어온 사람은 있어도 무대에는 못 선다.

### 출처 목록 쓰기: default-src와 script-src
Directive는 지시, 명령이라는 뜻이다. CSP 값은 지시어(Directive) 여러 개를 세미콜론으로 이어 쓰고, 지시어 하나는 자원 종류 하나에 대한 허락 목록이다.

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example
```

- script-src는 스크립트를 어디서 가져와 실행해도 되는지 정한다(CSP3 6.1.10절)
- default-src는 기본값이다. script-src, img-src처럼 자원별 지시어를 따로 적지 않았으면 default-src의 목록을 대신 쓴다(6.1.3절). 위 예시에서 이미지는 img-src가 없으니 default-src를 따라 같은 출처에서만 불러온다
- 자원별 지시어를 적으면 그 종류는 default-src를 보지 않는다. 위 예시의 스크립트는 script-src만 따른다. 두 목록이 합쳐지지 않으므로 script-src에도 'self'를 다시 적었다

'self'는 지금 페이지와 같은 출처를 뜻한다. 출처는 스킴, 호스트, 포트를 묶은 단위로, [CORS](../CORS(Cross-Origin%20Resource%20Sharing)/README.md#출처-origin) 노트에서 본 그 출처다. (CSP3는 http 페이지에서 같은 호스트의 https 주소도 'self'로 인정하는 등 세부 규칙을 더 둔다. 1.3절, 6.7.2.8절.) 작은따옴표까지가 값의 일부라서 따옴표를 함께 적는다.

### 인라인 스크립트와 nonce
인라인(Inline)은 줄 안에 있다는 뜻이다. 인라인 스크립트는 외부 파일을 불러오지 않고 HTML 안에 바로 적은 `<script>...</script>` 나 `onclick="..."` 같은 코드를 말한다.

문제는 XSS로 숨어 들어오는 스크립트도 대부분 인라인이라는 점이다. 브라우저는 페이지 안에 적힌 두 스크립트 중 어느 쪽이 개발자가 쓴 것이고 어느 쪽이 공격자가 넣은 것인지 구별하지 못한다. 그래서 CSP는 default-src나 script-src가 있으면 인라인 스크립트를 기본으로 막는다. eval() 같은 문자열 실행 함수도 함께 막힌다(MDN CSP 가이드). 막지 않게 하는 'unsafe-inline'이라는 값도 있지만 표준은 쓰지 말라고 적고(6.1절), MDN은 CSP를 쓰는 의미를 대부분 없앤다고 적는다.

내가 쓴 인라인 스크립트만 살리는 방법이 nonce다. Nonce는 원래 이번 한 번만이라는 뜻의 영어 단어이고, 보안에서는 한 번만 쓰고 버리는 값을 말한다.

1. 서버가 응답마다 새 무작위 값을 만든다
2. 그 값을 CSP 헤더의 `'nonce-값'` 과 내가 쓴 `<script nonce="값">` 양쪽에 넣는다
3. 브라우저는 nonce가 헤더와 일치하는 스크립트만 실행한다

공격자는 다음 응답에 어떤 값이 나올지 모르므로 자기 스크립트에 맞는 nonce를 붙일 수 없다. 공연장이 그날 출연자에게만 그날의 팔찌를 채워 주는 것과 같다. 어제 팔찌를 구해 와도 오늘은 색이 다르다.

그래서 nonce는 정말로 매번 새로 만들어야 한다. CSP3 7.1절은 정책을 보낼 때마다 고유한 값을 만들어야 하고(MUST), 인코딩 전 128비트 이상이며 암호학적으로 안전한 난수 생성기로 만드는 것이 좋다(SHOULD)고 적는다. 모든 응답에 같은 nonce를 쓰면 공격자가 한 번 보고 따라 붙일 수 있다.

nonce 말고 스크립트 내용의 해시(Hash)값을 헤더에 적는 방법도 있다(hash-source). 해시는 내용을 정해진 규칙으로 섞어 짧은 값으로 바꾼 것으로, 내용이 같으면 늘 같은 값이 나온다([로드 밸런싱](../../로드%20밸런싱(Load%20Balancing)/README.md#ip-해시-ip-hash) 노트 참고). 내용이 한 글자라도 다르면 해시가 달라져 실행되지 않는다. 자세한 비교는 TODO로 넘긴다.

### 막기 전에 지켜보기: report-only 모드
CSP를 처음 붙이면 내가 쓴 스크립트까지 막혀 사이트가 깨지기 쉽다. 그래서 막지는 않고 위반만 알려 주는 헤더가 따로 있다.

```http
Content-Security-Policy-Report-Only: default-src 'self'; report-to csp-endpoint
```

CSP3 3.2절은 이 헤더를 정책을 강제하지 않고 그 효과를 지켜보기(monitoring) 위한 것이라고 설명한다. 브라우저는 규칙을 어긴 자원도 그대로 불러오되, 위반 사실을 report-to로 지정한 곳에 보고한다. 보고 받을 주소는 Reporting-Endpoints 헤더로 따로 이름을 붙여 둔다(MDN CSP 가이드). 경비원이 명단에 없는 사람을 일단 들여보내되 누가 들어왔는지 적어 두는 것과 같다. 보고를 모아 명단을 다듬은 뒤 Content-Security-Policy로 바꿔 실제로 막는다.

### CSP가 막지 못하는 것
- CSP는 주입을 막는 장치가 아니라 주입된 뒤의 피해를 줄이는 장치다. CSP3 1절은 CSP가 콘텐츠 주입 취약점에 대한 첫 번째 방어선이 아니라고 적고, MDN도 입력을 걸러 내는 일을 대신하지 않으며 둘 다 해야 한다고 적는다. 화면에 넣을 때 특수 문자를 안전한 글자로 바꾸는 이스케이프(escape) 처리는 여전히 필요하다
- 허락 목록에 넣은 곳에서 오는 스크립트는 막지 못한다. 누구나 파일을 올릴 수 있는 공용 서버를 목록에 넣으면, 공격자도 거기에 스크립트를 올려 불러올 수 있다. 브라우저는 출처만 볼 뿐 그 파일을 누가 올렸는지는 모른다
- 'unsafe-inline'을 넣거나 nonce를 매번 바꾸지 않으면 인라인 스크립트 방어가 사실상 사라진다
- 스크립트가 아닌 HTML 조각을 주입해 정상 nonce를 엿보는 식의 우회 방법도 있다(CSP3 7.2절, 자세한 내용은 TODO). 주입 자체가 남아 있으면 우회 시도도 남는다

<br/>

## Strict-Transport-Security (HSTS)
### 이름의 뜻
Strict는 엄격한, Transport는 운송, 실어 나르기, Security는 보안이다. 엄격한 전송 보안, 보통 HSTS(HTTP Strict Transport Security)라고 부른다. Transport는 [HTTPS와 TLS](../HTTPS와%20TLS(HTTPS%20and%20TLS)/README.md#tls-transport-layer-security) 노트의 TLS(Transport Layer Security)에 들어 있는 그 말이다.
공학적으로는 이 도메인에는 앞으로 일정 기간 HTTPS로만 접속하라고 브라우저에게 기억시키는 헤더다. 표준은 RFC 6797이다.

### 다운그레이드란
다운그레이드(Downgrade)는 등급을 낮추다라는 뜻이다. 보안에서는 안전한 방식으로 통신할 수 있는데도 덜 안전한 방식으로 끌어내리는 공격을 말한다.

사이트가 HTTPS를 지원해도 사용자는 주소창에 그냥 bank.example이라고 치는 경우가 많다. 예전 브라우저는 이때 먼저 http://로 요청했고, 서버가 https://로 옮기라는 리다이렉트를 보내야 HTTPS로 넘어갔다. 요즘 주요 브라우저는 HTTPS를 먼저 시도하지만, 실패하면 HTTP로 되돌아가는 경우가 있어 공격자가 그 실패를 일부러 만들 수 있다(브라우저와 버전별 동작은 확인 필요). 이 첫 요청은 [HTTPS와 TLS](../HTTPS와%20TLS(HTTPS%20and%20TLS)/README.md#http만-쓰면-생기는-문제) 노트에서 본 엽서 상태다. 카페 와이파이처럼 중간에 끼어든 공격자는 이 리다이렉트를 지우고, 자기는 진짜 서버와 HTTPS로 이야기하면서 사용자와는 계속 HTTP로 이야기할 수 있다. 사용자의 비밀번호는 엽서로 공격자를 거쳐 간다. 이런 공격을 흔히 SSL 스트리핑(SSL Stripping, 벗겨 내기)이라고 부른다. RFC 6797 본문에 이 이름이 나오지는 않고, 2.3.1절에서 수동적 공격자(엿보기)와 능동적 공격자(가짜 와이파이, DNS 조작)를 막으려는 위협으로 든다.

### 어떻게 막을까
은행이 단골 손님에게 앞으로 1년 동안은 반드시 보안 정문으로만 들어오라고 일러 두는 것과 같다. 손님은 그 말을 기억했다가, 누가 옆문으로 안내해도 따라가지 않고 정문으로 간다. 정문의 신분 확인이 이상하면 아예 들어가지 않는다.

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

RFC 6797이 브라우저에게 정한 동작은 아래와 같다.

1. 이 헤더는 HTTPS 응답에 붙었을 때만 믿는다. HTTP 응답에 붙은 것은 무시한다(8.1절). 중간에서 끼어든 공격자가 HTTP 응답에 가짜 헤더를 넣거나 기간을 줄이지 못하게 하려는 것이다(MDN)
2. 이 헤더를 받은 도메인을 HSTS 호스트로 기억해 둔다
3. 이후 그 도메인으로 http:// 주소를 열려고 하면, 요청을 보내기 전에 브라우저가 스스로 https://로 바꾼다. 포트 80은 443으로 바꾸고 다른 포트는 그대로 둔다(8.3절). 첫 HTTP 요청이 아예 나가지 않으니 공격자가 가로챌 리다이렉트도 없다
4. 인증서 오류처럼 보안 연결에 문제가 생기면 연결을 끊는다(8.4절). 사용자가 경고를 무시하고 들어가는 선택지도 주지 말라고 권한다(12.1절)

4번이 중요하다. HSTS가 없으면 공격자가 가짜 인증서로 HTTPS인 척해도 사용자가 경고 화면에서 계속을 누를 수 있다. RFC 6797 12.1절은 HSTS 호스트에서 이 버튼을 주지 말라고 권하고, 주요 브라우저는 이를 따른다(브라우저별 동작은 확인 필요).

### max-age와 includeSubDomains
- max-age는 이 도메인을 HSTS 호스트로 기억할 시간을 초로 적는다. 반드시 있어야 하는 지시어다(6.1.1절). 31536000초는 1년이다. max-age=0을 보내면 HSTS 호스트에서 빼라는 뜻이다
- includeSubDomains를 붙이면 그 아래 하위 도메인(www.bank.example, api.bank.example)에도 같은 규칙을 적용한다(6.1.2절). 값 없이 이름만 쓴다
- 지시어 이름은 대소문자를 구분하지 않는다(6.1절). 아래 GitHub 응답처럼 includeSubdomains로 써도 같다

max-age를 길게 주는 것은 되돌리기 어려운 약속이기도 하다. 1년을 적어 보낸 뒤 HTTPS를 내리면, 그 사이트를 방문했던 브라우저는 1년 동안 HTTP로 접속하지 않으니 사이트에 들어오지 못한다. includeSubDomains도 HTTPS를 지원하지 않는 하위 도메인이 하나라도 있으면 그곳을 막아 버린다.

### 첫 접속 문제와 preload
HSTS는 한 번은 HTTPS로 접속해 헤더를 받아야 시작된다. 그 전의 첫 접속은 여전히 엽서다. RFC 6797 14.6절은 이것을 부트스트랩 MITM(Bootstrap MITM) 취약점이라고 부른다. 부트스트랩은 처음 시작하는 단계, MITM(Man-In-The-Middle)은 중간자 공격이다. 은행이 정문으로만 오라고 일러 주려면 손님이 한 번은 은행에 와야 하는데, 그 첫 방문길에서 가짜 안내원을 만날 수 있는 것과 같다.

RFC 6797 12.3절은 이 틈을 메우는 방법으로, 브라우저 회사가 HSTS 호스트 목록을 브라우저에 미리 넣어 배포하는 방식을 소개한다. 이것을 사전 등록 목록(Preload List)이라고 한다. 처음 오는 손님도 받는 지도에 이 은행은 정문만 쓴다고 이미 적혀 있는 셈이다. 다만 12.3절은 이런 방식이 있을 수 있다고 소개할 뿐 목록을 어떻게 만들지는 정하지 않는다. MDN도 지금 쓰이는 목록은 Google이 운영하는 서비스이고 HSTS 표준의 일부가 아니라고 적는다.

이 목록에 올리려는 사이트는 헤더 끝에 preload를 붙인다. preload는 RFC 6797에 없는 지시어다. hstspreload.org가 적은 등록 조건은 아래와 같다.

- 유효한 인증서를 쓴다
- 80번 포트를 연다면 같은 호스트의 HTTPS로 리다이렉트한다
- 모든 하위 도메인을 HTTPS로 제공한다
- 기본 도메인의 HTTPS 응답에 max-age가 31536000(1년) 이상이고 includeSubDomains와 preload가 있는 HSTS 헤더를 붙인다

hstspreload.org는 목록에서 빠지기까지 오래 걸리고 번거로우며, 변경이 사용자에게 닿으려면 브라우저 업데이트로 몇 달이 걸린다고 경고한다. Chrome이 목록을 관리하고 Firefox, Safari, Edge도 이 목록을 바탕으로 한 목록을 쓴다고 적고 있다(2026년 10월 28일 확인).

### HSTS가 막지 못하는 것
- 목록에 없는 사이트의 첫 접속, 그리고 max-age가 끝난 뒤의 첫 접속
- 피싱(Phishing). RFC 6797 2.3.2.1절은 HSTS가 피싱 자체에 대한 방어가 아니라고 적는다. bank.example 대신 bank-example.com 같은 다른 도메인으로 유도하면 그 도메인은 HSTS와 관계가 없다
- 사용자 컴퓨터의 악성 코드(2.3.2.2절)
- IP 주소로 접속하는 경우. MDN은 HSTS 호스트는 도메인 이름으로만 정해지고 IP 주소는 HSTS 호스트가 될 수 없다고 적는다
- 이미 HTTPS로 연결된 뒤 페이지 안에서 벌어지는 XSS 같은 공격. HSTS는 연결을 지킬 뿐 내용은 보지 않는다

<br/>

## X-Content-Type-Options: nosniff
### 이름의 뜻
Content-Type은 [HTTP 헤더](../HTTP%20헤더(HTTP%20Headers)/README.md#content-type)에서 본 본문의 형식이고, Options는 선택 사항이다. 앞의 X-는 표준이 아니던 시절의 표시다([HTTP 헤더의 직접 만드는 헤더](../HTTP%20헤더(HTTP%20Headers)/README.md#직접-만드는-헤더) 참고). 값 nosniff의 Sniff는 냄새 맡다, 킁킁거리다라는 뜻이다.
공학적으로 MIME 스니핑(MIME Sniffing)은 브라우저가 Content-Type을 그대로 믿지 않고 본문 내용을 들여다보며 실제 형식을 짐작하는 동작을 말한다. nosniff는 그 짐작을 하지 말고 서버가 적은 Content-Type을 따르라는 지시다. 지금은 WHATWG Fetch 표준 3.6절이 이 헤더를 정한다.

### 왜 필요할까
예전 서버들은 Content-Type을 틀리게 보내는 일이 많았고, 브라우저는 페이지가 깨지지 않게 내용을 보고 형식을 맞혀 주었다. 친절이 공격 통로가 된 것이다. 예를 들어 사용자가 올린 파일을 text/plain으로 내려주는 사이트가 있다고 하자. 공격자가 JavaScript를 담은 텍스트 파일을 올리고, 이 사이트 페이지 어딘가에 `<script src="그 파일 주소">` 를 끼워 넣는 데 성공했다고 하자. 파일이 같은 출처에 있으니 CSP의 'self'도 통과하고, 브라우저가 내용을 보고 스크립트로 짐작하면 이 사이트의 코드로 실행된다. 형식을 헷갈리게 만들어 노리는 이런 공격을 MIME 혼동(MIME Confusion) 공격이라고 부른다. MDN은 이 이름의 Mozilla 블로그 글을 참고로 걸어 두었다. 지금 브라우저에서 nosniff 없이 이 예시가 실제로 실행되는지는 확인하지 않았다(확인 필요).

[HTTP 헤더](../HTTP%20헤더(HTTP%20Headers)/README.md#택배-송장으로-이해하기) 노트의 택배 비유로 말하면, 송장에 서류라고 적힌 상자는 냄새가 음식 같아도 서류로만 다루라는 표시다.

### 어떻게 동작할까
Fetch 표준 3.6.1절의 판단 순서는 짧다.

1. nosniff가 없으면 막지 않는다
2. 요청의 용도가 스크립트인데 Content-Type이 JavaScript 형식이 아니면 막는다
3. 요청의 용도가 스타일시트인데 Content-Type이 text/css가 아니면 막는다
4. 나머지는 막지 않는다

표준은 공격이 모두 이 두 용도와 관련되어 있어서 스크립트와 스타일만 본다고 적는다. MDN은 그 밖의 응답, 예를 들어 새 HTML 문서로 이동하는 경우에도 nosniff가 있으면 내용을 들여다보지 않고 Content-Type을 그대로 쓴다고 적는다. text/plain에 nosniff가 붙은 응답은 안에 HTML이 있어도 HTML로 그려지지 않는다.

### 막지 못하는 것
nosniff는 서버가 적은 Content-Type을 믿게 할 뿐이다. 서버가 처음부터 사용자가 올린 파일을 text/html이나 application/javascript로 내려주면 막을 것이 없다. 그 형식이 맞다고 서버가 말했기 때문이다. 업로드 파일의 형식을 서버가 제대로 정하는 일은 따로 필요하다.

<br/>

## 클릭재킹과 frame-ancestors
### 클릭재킹 (Clickjacking)
Click(누르기)과 Hijacking(납치)을 합친 말이다. Hijack은 [쿠키](../쿠키(Cookie)/README.md#왜-필요할까) 노트의 세션 하이재킹에서 본 그 말이다.
공학적으로는 다른 사이트가 우리 페이지를 iframe(페이지 안에 다른 페이지를 끼워 넣는 틀)으로 불러와 투명하게 만든 뒤, 자기 화면 위에 겹쳐 올려 두는 공격이다. 사용자 눈에는 아래에 있는 경품 받기 버튼만 보이지만, 실제로 클릭이 닿는 것은 그 위에 보이지 않게 덮인 우리 사이트의 송금 버튼이나 설정 변경 버튼이다. 사용자가 로그인해 있으면 그 클릭은 진짜 사용자의 클릭으로 처리된다. 그림 앞에 보이지 않는 유리문을 세워 두어, 그림 속 손잡이를 잡으려던 손이 유리문을 여는 것과 같다.

### frame-ancestors
Ancestor는 조상이라는 뜻이다. 우리 페이지를 감싸는 바깥 틀, 그 틀을 다시 감싸는 틀을 조상이라고 부른다.
CSP의 frame-ancestors 지시어는 우리 페이지를 iframe 같은 틀에 넣을 수 있는 조상 페이지의 출처를 정한다(CSP3 6.4.2절). 우리 그림을 어느 액자에 넣어도 되는지 그림 뒷면에 적어 두는 것과 같다.

```http
Content-Security-Policy: frame-ancestors 'none'
```

- 'none'은 어디에도 끼워 넣지 못하게 한다. MDN은 끼워 넣어질 필요가 없는 사이트라면 'none'을 쓰라고 권한다
- 'self'는 같은 출처의 페이지 안에만 넣을 수 있게 한다
- 출처를 직접 적어 특정 사이트만 허락할 수도 있다

frame-ancestors는 다른 CSP 지시어와 두 가지가 다르다. default-src를 대신 쓰지 않는다. 그래서 default-src 'self'만 적었다고 클릭재킹이 막히지 않는다. 또 HTML의 `<meta>` 태그로 적은 CSP에서는 무시되고(6.4.2절, 3.3절) 응답 헤더로 보내야 한다.

### 옛 방식: X-Frame-Options
frame-ancestors 이전에는 X-Frame-Options 헤더를 썼다. DENY는 어디에도 넣지 못하게, SAMEORIGIN은 같은 출처에만 넣게 한다. 특정 출처를 허락하던 ALLOW-FROM은 MDN 기준 폐지된 값이고, 지금 브라우저는 이 값을 보면 헤더 전체를 무시한다. CSP3 6.4.2.2절은 강제 모드의 frame-ancestors가 있으면 X-Frame-Options는 무시한다고 적는다. 오래된 브라우저를 위해 둘을 함께 보내는 사이트도 많다. 아래 GitHub 응답도 그렇다.

### 막지 못하는 것
다른 사이트에 끼워 넣어지는 것이 서비스의 목적인 페이지(결제 창, 지도, 동영상 플레이어 같은 위젯)는 'none'을 쓸 수 없다. 이런 페이지는 허락할 출처를 직접 적는데, 허락한 사이트가 해킹되거나 나쁜 마음을 먹으면 막지 못한다. 또 frame-ancestors가 다루는 것은 틀 안에 끼워 넣는 일뿐이다. 끼워 넣지 않는 다른 속임수는 이 헤더의 범위 밖이다.

<br/>

## Referrer-Policy
### 이름의 뜻
Referrer는 소개하는 사람, 추천인이라는 뜻이다. 링크를 눌러 다른 페이지로 갈 때 브라우저가 어느 페이지에서 왔는지 알리는 요청 헤더가 Referer다. MDN은 이 헤더 이름이 referrer의 철자를 틀리게 쓴 것이라고 적는다. 정책 헤더 이름은 바른 철자인 Referrer-Policy다.
공학적으로 Referrer-Policy는 Referer에 주소를 얼마나 담을지 정하는 응답 헤더다. 손님을 다른 가게에 소개할 때 우리 가게 이름만 말할지, 손님이 어느 자리에서 무엇을 주문했는지까지 말할지 정하는 것과 같다.

### 왜 필요할까
Referer에는 출처뿐 아니라 경로와 쿼리스트링까지 실릴 수 있다(MDN Referer 문서). 주소에 비밀번호 재설정 토큰이나 검색어가 들어 있으면 그 페이지에서 누른 외부 링크와 외부 이미지 요청을 통해 다른 사이트로 새어 나간다. [쿼리스트링](../쿼리스트링(Query%20String)/README.md#주의할-점) 노트에서 비밀 값을 주소에 넣지 말라고 한 이유 중 하나다.

### 기본값
값을 보내지 않거나 잘못된 값을 보내면 브라우저는 strict-origin-when-cross-origin을 쓴다(MDN, 2026년 10월 28일 확인).

- 같은 출처로 가는 요청에는 출처, 경로, 쿼리스트링을 모두 보낸다
- 다른 출처로 가는 요청에는 보안 수준이 낮아지지 않으면(HTTPS에서 HTTPS, HTTP에서 HTTP) 출처만 보낸다
- HTTPS 페이지에서 HTTP 주소로 가는 요청에는 아무것도 보내지 않는다

no-referrer(보내지 않음), same-origin(같은 출처에만 보냄) 등 더 좁히는 값과, unsafe-url(늘 전체 주소)처럼 넓히는 값이 있다.

### 막지 못하는 것
Referrer-Policy는 정보가 새는 길 하나를 좁힐 뿐이다. 주소는 브라우저 방문 기록, 서버 로그, 화면 공유에도 남는다. 비밀 값을 주소에 넣지 않는 것이 먼저다.

<br/>

## Permissions-Policy
Permission은 허가라는 뜻이다. 공학적으로 Permissions-Policy는 이 페이지와 페이지 안의 iframe이 위치 정보, 카메라, 마이크 같은 브라우저 기능을 쓸 수 있는지 정하는 헤더다. 광고나 외부 위젯을 iframe으로 넣었을 때 그 코드가 사용자 위치나 카메라를 요청하지 못하게 막아 두려고 쓴다. 세입자에게 집을 빌려주면서 창고 열쇠는 주지 않는 것과 같다.

```http
Permissions-Policy: geolocation=(), camera=()
```

빈 괄호는 누구에게도 허락하지 않는다는 뜻이다. MDN은 이 헤더를 실험적(Experimental) 기능으로 표시하고, 널리 쓰이는 브라우저 중 일부에서 동작하지 않는다고 적는다(2026년 10월 28일 확인. 어느 브라우저인지는 확인하지 않았다). 이 문서에서는 이런 헤더가 있다는 것만 적고 자세한 내용은 TODO로 넘긴다.

<br/>

## 코드로 보기
### Node.js 서버로 헤더 붙여 보기
Node.js http 모듈로 만든 서버가 응답마다 nonce를 새로 만들어 CSP와 본문에 넣고, 나머지 보안 헤더도 붙인다. 서버는 빈 포트(0)로 띄우고 curl로 두 번 요청한 뒤 스스로 닫는다. 본문 길이는 Content-Length로 직접 적었다.

```js
// security-headers-demo.js
const http = require('node:http');
const crypto = require('node:crypto');
const { execFile } = require('node:child_process');

const server = http.createServer((req, res) => {
  // 응답마다 새 nonce를 만든다. 16바이트(128비트)를 base64로 바꾼 값
  const nonce = crypto.randomBytes(16).toString('base64');

  const body =
    `<script nonce="${nonce}">console.log('허락된 스크립트')</script>\n` +
    `<script>console.log('nonce 없는 스크립트')</script>\n`;

  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Content-Security-Policy':
      `default-src 'self'; script-src 'self' 'nonce-${nonce}'; frame-ancestors 'none'`,
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), camera=()',
  });
  res.end(body);
});

function curl(url) {
  return new Promise((resolve) => {
    execFile('curl', ['-s', '-i', url], (err, stdout) => resolve(stdout));
  });
}

server.listen(0, '127.0.0.1', async () => {
  const url = `http://127.0.0.1:${server.address().port}/`;
  console.log('--- 첫 번째 요청');
  console.log(await curl(url));
  console.log('--- 두 번째 요청 (CSP 줄만)');
  const second = await curl(url);
  console.log(second.split('\n').find((l) => l.startsWith('Content-Security-Policy')));
  server.close();
});
```

Node.js v24.22.1, curl 8.7.1에서 2026년 10월 28일에 실행한 출력이다. nonce는 무작위라 실행할 때마다 다르다.

```text
--- 첫 번째 요청
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 146
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-KTDUdJq/guKRWrNfpPDf5A=='; frame-ancestors 'none'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), camera=()
Date: Wed, 28 Oct 2026 14:14:56 GMT
Connection: keep-alive
Keep-Alive: timeout=5

<script nonce="KTDUdJq/guKRWrNfpPDf5A==">console.log('허락된 스크립트')</script>
<script>console.log('nonce 없는 스크립트')</script>

--- 두 번째 요청 (CSP 줄만)
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-m65jQMzIAU4jd7ChBkeT+g=='; frame-ancestors 'none'
```

- 두 응답의 nonce가 다르다. 첫 응답의 nonce를 알아내도 다음 응답에서는 쓸 수 없다
- 본문의 첫 번째 스크립트는 헤더와 같은 nonce를 달고 있고, 두 번째 스크립트는 nonce가 없다. 브라우저였다면 첫 번째만 실행하고 두 번째는 막았을 것이다. CSP3 6.1.10절이 인라인 스크립트는 'unsafe-inline', 일치하는 nonce, 일치하는 해시 중 하나로 허락될 때만 실행된다고 정한 동작이다. 이 문서에서는 이 페이지를 실제 브라우저로 열어 콘솔을 확인하지 않았다
- curl은 이 헤더들을 모두 받아 보여 줄 뿐 아무것도 막지 않았다. 두 스크립트가 본문에 그대로 들어 있다. 앞에서 말한 대로 이 헤더들은 브라우저가 지켜야 효과가 있다

### 실제 사이트의 응답 보기
2026년 10월 28일(Date: Wed, 28 Oct 2026 14:14:55 GMT)에 `curl -sI https://github.com` 으로 받은 응답에서 보안 헤더만 골랐다. CSP는 매우 길어서 일부만 옮겼다.

```text
HTTP/1.1 200 OK
Strict-Transport-Security: max-age=31536000; includeSubdomains; preload
X-Frame-Options: deny
X-Content-Type-Options: nosniff
Referrer-Policy: origin-when-cross-origin, strict-origin-when-cross-origin
Content-Security-Policy: default-src 'none'; base-uri 'self'; ... frame-ancestors 'none'; ... script-src github.githubassets.com 'sha256-6AKuI+cDd1MoUL1u4eqrA9PXmnPAkOB4h7421hPUUm0='; ... upgrade-insecure-requests; ...
```

- HSTS는 1년, 하위 도메인 포함, preload까지 적었다. hstspreload.org의 상태 조회(`/api/v2/status?domain=github.com`)는 같은 날 `"status": "preloaded"` 를 돌려주었다. 이 도메인은 첫 접속부터 HTTPS로 간다
- `curl -sI http://github.com` 은 `301 Moved Permanently` 와 `Location: https://github.com/` 만 돌려주고 HSTS 헤더는 없었다. HTTP 응답의 HSTS는 어차피 무시되므로(RFC 6797 8.1절) HTTPS 응답에만 붙이는 것이다
- default-src를 'none'으로 두고 필요한 종류만 하나씩 열었다. script-src에는 출처 하나와 해시값 하나만 있고 nonce나 'unsafe-inline'은 없다
- frame-ancestors 'none'과 X-Frame-Options: deny를 함께 보낸다. 새 브라우저는 frame-ancestors를, 옛 브라우저는 X-Frame-Options를 따른다
- Referrer-Policy에 값을 두 개 적었다. 값을 쉼표로 여러 개 적으면 브라우저는 자기가 아는 값 중 마지막 것을 쓴다(Referrer Policy 명세 8.1절). 앞의 값은 뒤의 값을 모르는 옛 브라우저를 위한 대비다(MDN Referrer-Policy)

같은 시각 `curl -sI https://example.com` 의 응답에는 이 문서의 헤더가 하나도 없었다. 보안 응답 헤더는 서버가 골라서 붙이는 것이고, 붙이지 않으면 브라우저는 기본 동작대로 움직인다.

<br/>

## 정리
| 헤더 | 막는 것 | 막지 못하는 것 |
| --- | --- | --- |
| Content-Security-Policy | 주입된 스크립트의 실행, 허락하지 않은 곳의 자원 불러오기 | 주입 자체, 허락 목록 안에서 오는 스크립트, 'unsafe-inline'을 넣은 정책 |
| Strict-Transport-Security | HTTP로 끌어내리기(다운그레이드), 인증서 경고 무시하고 들어가기 | preload 없는 첫 접속, 피싱, IP 주소 접속, 페이지 안의 공격 |
| X-Content-Type-Options: nosniff | 형식이 맞지 않는 응답을 스크립트, 스타일로 쓰기 | 서버가 처음부터 잘못된 형식을 적은 경우 |
| frame-ancestors (X-Frame-Options) | 다른 사이트가 우리 페이지를 끼워 넣는 클릭재킹 | 허락한 출처의 악용, 끼워 넣기가 아닌 속임수 |
| Referrer-Policy | 다른 사이트로 가는 요청의 주소 노출 | 방문 기록, 로그 등 다른 길로 새는 주소 |

어느 헤더도 혼자서 공격을 끝내지 못한다. 서버에서 입력을 검증하고 출력을 이스케이프하는 일, HTTPS를 쓰는 일, 쿠키 속성을 바르게 붙이는 일([쿠키](../쿠키(Cookie)/README.md)) 위에 한 겹 더 두는 방어(Defense in Depth, 심층 방어)다.

<br/>

## 참고 자료
- W3C, [Content Security Policy Level 3](https://w3c.github.io/webappsec-csp/). 2026년 10월 28일에 읽은 판은 2026년 10월 27일자 편집자 초안(Editor's Draft)이다. 절 번호는 이 판 기준이다
- RFC 6797, [HTTP Strict Transport Security (HSTS)](https://www.rfc-editor.org/rfc/rfc6797.html) (2012년 11월)
- WHATWG, [Fetch Standard](https://fetch.spec.whatwg.org/#x-content-type-options-header) 3.6절 X-Content-Type-Options (2026년 10월 19일 갱신판)
- [hstspreload.org](https://hstspreload.org/) 등록 조건
- MDN, [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) (문서 수정일 2026년 3월 22일)
- MDN, [Strict-Transport-Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Strict-Transport-Security) (문서 수정일 2026년 9월 11일)
- MDN, [X-Content-Type-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Content-Type-Options) (문서 수정일 2026년 3월 17일)
- MDN, [X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Frame-Options) (문서 수정일 2026년 9월 17일)
- W3C, [Referrer Policy](https://w3c.github.io/webappsec-referrer-policy/) 8.1절(헤더 값 해석, 마지막 값 사용), 8.3절(strict-origin-when-cross-origin 동작). 2026년 10월 28일 확인
- MDN, [Referrer-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy) (문서 수정일 2026년 9월 4일), [Referer](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referer)
- MDN, [Permissions-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Permissions-Policy) (문서 수정일 2026년 10월 23일)

<br/>

## 더 볼 것 (TODO)
- 프레임워크와 서버별 보안 헤더 설정법 (Next.js headers 설정, Express helmet, nginx)
- 브라우저에서 CSP 위반을 직접 확인하기 (개발자 도구 콘솔, report-only 보고 받기)
- nonce와 해시 비교, 'strict-dynamic'과 Strict CSP
- 위반 보고를 받는 Reporting API (Reporting-Endpoints, report-to와 옛 report-uri)
- upgrade-insecure-requests와 혼합 콘텐츠 (Mixed Content)
- XSS를 막는 방법 (출력 이스케이프, Trusted Types)
- 주입된 HTML 조각으로 nonce를 엿보는 우회(dangling markup)와 CSP3 7.2절의 대응
- Permissions-Policy 자세히, 옛 Feature-Policy와의 관계
- 다른 출처와의 격리를 정하는 헤더 (Cross-Origin-Opener-Policy, Cross-Origin-Embedder-Policy, Cross-Origin-Resource-Policy)
