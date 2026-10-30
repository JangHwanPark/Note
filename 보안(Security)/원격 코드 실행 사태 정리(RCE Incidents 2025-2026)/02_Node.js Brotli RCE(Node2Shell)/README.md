## 무슨 일이 있었나
- 2026년 10월 21일 Node.js가 보안 릴리스를 내면서 내장 Brotli 디코더의 범위 밖 쓰기(out-of-bounds write) 취약점 CVE-2026-111497을 고쳤다. 별명은 Node2Shell이다
- 공격자가 만든 Brotli 압축 데이터를 Node.js가 풀면 프로세스가 죽거나, 메모리 내용이 새거나, 코드가 실행될 수 있다
- CVSS v4.0 점수는 9.2다. Node.js 자체 등급은 High로, 같은 릴리스의 High 네 개 중 하나다

1장의 React2Shell은 프레임워크가 요청을 해석하는 코드에 결함이 있었다면, 이번에는 그보다 아래인 런타임에 들어 있는 압축 라이브러리에 결함이 있었다.

<br/>

## 알아둘 개념

### Brotli와 콘텐츠 인코딩
Brotli는 구글이 만든 압축 알고리즘이다. 이름은 스위스의 빵 이름(Brötli)에서 따왔다. HTTP에서는 `Content-Encoding: br` 헤더로 본문이 Brotli로 압축돼 있다고 알리고, 받는 쪽이 압축을 풀어 원래 데이터를 얻는다. 브라우저와 서버 사이 응답 압축에 널리 쓰이고, 요청 본문을 압축해 보내는 경우도 있다.

Node.js는 Brotli 구현을 소스에 포함해 `node:zlib` 모듈로 제공한다. 그래서 운영체제의 Brotli를 업데이트해도 Node.js 안의 Brotli는 바뀌지 않는다.

### 범위 밖 쓰기 (Out-of-bounds Write)
범위(bounds)는 경계를 뜻한다. 프로그램이 확보한 메모리 공간의 끝을 넘어 데이터를 써 버리는 결함이다. 넘친 데이터는 옆에 있던 다른 변수나 함수 주소를 덮어쓰고, 공격자가 덮어쓸 내용을 고를 수 있다면 실행 흐름을 바꿀 수도 있다. 자바스크립트 코드에서는 생기지 않지만, Node.js 내부의 C/C++ 코드에서는 생길 수 있다.

<br/>

## 어떻게 동작했나
Node.js 공지의 설명은 이렇다. Brotli 스트림이 잘못된 블록 전환(block switch) 신호를 담고 있을 때, 디코더가 이것을 "형식 오류"로 끝내지 않고 "입력이 더 필요하다"로 처리했다. 스트리밍 디코더는 그 말을 믿고 들어오는 바이트를 8바이트짜리 내부 버퍼에 계속 이어 붙였고, 버퍼 끝을 넘어 쓰게 됐다.

수정은 구글 Brotli 저장소에서 이뤄졌다. 이런 스트림을 만나면 `BROTLI_DECODER_ERROR_FORMAT_BLOCK_SWITCH` 라는 전용 오류를 돌려주도록 바뀌었다. Brotli 쪽 고정 버전은 1.0.10, 1.1.1, 1.2.1이다. 보도된 취약 범위는 1.0.3부터 1.2.0까지인데, 이 중 고정 버전으로 올린 줄(1.0.10 이상, 1.1.1 이상)은 제외된다.

### 공격자 데이터가 디코더까지 가는 길
결함이 압축 해제 단계에 있으므로, 공격자가 보낸 Brotli 데이터를 애플리케이션이 풀기만 하면 된다. 보안 업체들이 짚은 경로는 아래와 같다.

- `zlib.brotliDecompress()`, `zlib.createBrotliDecompress()` 에 외부 입력을 직접 넘기는 코드
- Node.js 내장 `fetch()`. 응답에 `Content-Encoding: br` 가 있으면 자동으로 압축을 푼다. 악성 서버나 탈취된 서버에 요청만 보내도 클라이언트 쪽 Node.js가 공격받을 수 있다. 요청에 `Accept-Encoding: identity` 를 넣어도 막히지 않는다고 보고됐다
- Express 5와 body-parser 2. json, raw, text, urlencoded 파서가 `inflate` 옵션 기본값 `true` 로 `br` 요청 본문을 풀어 준다. Express 4가 쓰는 body-parser 1.x는 gzip과 deflate만 처리하고 `br` 은 415로 거절한다
- Koa의 본문 파서, Fastify의 `@fastify/compress` 처럼 요청 본문 압축 해제를 지원하는 미들웨어

Node.js 기본 `http` 서버는 들어온 본문의 압축을 스스로 풀지 않는다. 결국 누가 압축을 푸느냐에 따라 같은 Node.js 버전이라도 노출 여부가 달라진다.

<br/>

## 실제로 얼마나 위험했나
패치는 10월 21일 10시 38분(UTC)에 나왔고, 같은 날 15시 47분에 이 CVE를 다룬 첫 공개 GitHub 저장소가 올라왔다. 10월 22일에는 개념 증명 코드(Proof of Concept, PoC) 저장소가 11개까지 늘었다. 저장소가 올라왔다고 모두 동작하는 공격 코드는 아니다. 같은 날 Imperva는 공식 Node.js 24.22.0 Docker 이미지(Linux arm64)에서 코드 실행에 성공했다고 발표했지만 공격 코드는 공개하지 않았다.

다만 실제 위험도에 대해서는 의견이 갈린다. 크래시는 재현이 쉬웠지만 안정적인 원격 코드 실행은 특정 환경에서만 재현됐고, 일부 공개 PoC는 일부러 약하게 만든 빌드에서만 동작했다. 주소 무작위화(ASLR)가 켜진 환경에서 원격으로 성공하지 못했다는 보고도 있다. 이후 10월 26일 ELLIO가 악용을 확인했다고 밝혔고, CISA가 10월 27일 KEV에 등재하고 11월 10일을 연방 기관 조치 기한으로 정했다는 보도가 있다. KEV 등재는 CISA 원문으로 확인하지 못해 확인 필요로 둔다.

<br/>

## 무엇을 고쳐야 했나

### 버전 올리기
고정 버전은 22.23.4, 24.22.1, 26.12.1이다. Node.js 공지는 우회 설정을 제시하지 않았으므로 업그레이드가 유일한 완전한 해결책이다. 지원이 끝난 20.x 이하와 홀수 버전(23.x, 25.x)은 패치가 나오지 않았다. 아직 Node.js 20을 쓰고 있었다면 이번 일은 메이저 버전 업그레이드를 강제하는 사건이 된다.

Docker 이미지, 서버리스 런타임처럼 Node.js가 여러 곳에 들어 있으면 `package.json` 만 봐서는 실제 실행 버전을 알 수 없다. 배포 환경마다 `node -v` 를 확인해야 한다.

### 당장 올릴 수 없을 때
body-parser를 쓴다면 `inflate: false` 로 압축된 요청 본문을 받지 않게 할 수 있다. 이렇게 하면 압축된 본문은 415로 거절된다. 옵션은 파서마다 따로 받으므로, 쓰고 있는 파서 전부에 넣어야 한다.

```js
app.use(express.json({ inflate: false }));
app.use(express.urlencoded({ extended: true, inflate: false }));
app.use(express.text({ inflate: false }));
app.use(express.raw({ inflate: false }));
```

이것은 Express 요청 경로만 막는다. `fetch()` 응답이나 직접 `zlib` 을 쓰는 코드는 그대로 남으므로 임시 조치로만 본다.

### 같은 Brotli를 쓰는 다른 소프트웨어
결함은 Node.js가 아니라 Brotli에 있었으므로 Brotli를 품은 다른 소프트웨어도 고쳐야 했다. Bun은 1.4.4에서 고쳤고, 시스템 Brotli 라이브러리를 쓰는 리눅스 배포판도 패키지 업데이트가 필요했다. PHP도 Windows 빌드에 Brotli를 포함하고 있어서 별도 재빌드를 냈다. 이 이야기는 3장에서 이어진다. Node.js를 올렸다고 다른 프로그램 안의 Brotli까지 고쳐지는 것은 아니다.

### 같은 릴리스의 다른 취약점
이번 릴리스는 모두 10개를 고쳤다. Brotli 외의 High 세 개는 `dns.resolve` 가 NUL 문자가 든 이름을 잘라 버리는 문제(CVE-2026-105482), 전각 숫자로 쓴 IP로 TLS 인증서 호스트명 검사를 우회하는 문제(CVE-2026-105483), 느슨하게 IP로 해석되는 호스트명으로 같은 검사를 우회하는 문제(CVE-2026-106069)다. Node2Shell만 보고 버전을 고르기보다 릴리스 전체를 올리는 편이 맞다.

<br/>

## 이 사건에서 남는 것
압축 해제는 보통 신경 쓰지 않는 단계라서 공격 표면으로 떠올리기 어렵다. 하지만 압축된 데이터도 바깥에서 들어온 입력이고, 그것을 해석하는 코드는 C로 짠 라이브러리라 메모리 결함이 생길 수 있다. 같은 Node.js라도 Express 4에서 5로 올리면서 `br` 해제가 기본으로 켜진 것처럼, 프레임워크 기본값이 바뀌면 노출 범위도 바뀐다.

<br/>

## 참고 자료
- [Node.js, October 2026 Security Releases](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases)
- [Akamai, Inside Node2Shell: A Closer Look at CVE-2026-111497](https://www.akamai.com/blog/security-research/inside-node2shell-closer-look-cve-2026-111497)
- [Sysdig, Node2Shell (CVE-2026-111497): Detecting the Node.js Brotli RCE](https://www.sysdig.com/blog/node2shell-cve-2026-111497-detecting-the-node-js-brotli-rce)
- [The Hacker News, Node.js Brotli Decoder Bug Could Allow Remote Code Execution](https://thehackernews.com/2026/10/nodejs-brotli-decoder-bug-could-allow.html)

<br/>

[목차](../README.md) | 이전 장: [리액트 서버 컴포넌트 RCE(React2Shell)](../01_리액트%20서버%20컴포넌트%20RCE(React2Shell)/README.md) | 다음 장: [PHP RCE(PHP2Shell)](../03_PHP%20RCE(PHP2Shell)/README.md)
