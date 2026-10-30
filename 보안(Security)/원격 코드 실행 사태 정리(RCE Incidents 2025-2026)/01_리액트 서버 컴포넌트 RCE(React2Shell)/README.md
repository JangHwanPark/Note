## 무슨 일이 있었나
- 2025년 12월 3일 React 팀이 리액트 서버 컴포넌트(React Server Components, RSC)의 원격 코드 실행 취약점 CVE-2025-55182를 공개했다. 별명은 React2Shell, CVSS는 만점인 10.0이다
- 인증 없이 조작한 HTTP 요청 하나로 서버의 Node.js 프로세스에서 코드를 실행할 수 있었다
- 공개 당일부터 공격이 관측됐고, CISA는 이틀 뒤인 12월 5일 KEV에 등재했다

이 장은 취약점 자체를 다룬다. 실제 프로젝트(Testea)에서 어떻게 대응했는지는 [이슈와 대응 기록(React 보안 이슈)](../../../Project/DataArts-Studio/Testea/03.[개발노트]이슈와%20대응%20기록(React%20보안%20이슈)/README.md)에 따로 있다.

<br/>

## 알아둘 개념

### 직렬화와 역직렬화 (Serialization, Deserialization)
직렬(serial)은 한 줄로 늘어선다는 뜻이다. 직렬화는 메모리 안에 얽혀 있는 객체를 한 줄의 바이트나 문자열로 펼쳐서 네트워크로 보내거나 파일에 저장할 수 있게 만드는 일이다. 역직렬화는 그 반대로, 받은 문자열을 다시 객체로 복원하는 일이다.

역직렬화가 위험한 이유는 복원할 객체의 모양을 보내는 쪽이 정하기 때문이다. `JSON.parse()` 처럼 숫자, 문자열, 배열, 평범한 객체만 만드는 방식은 비교적 안전하다. 하지만 함수 참조, 클래스 인스턴스, 다른 값을 가리키는 참조까지 복원하는 형식이라면, 서버가 무엇을 만들어도 되는지 엄격히 검사하지 않는 순간 공격자가 서버 안의 원하지 않는 객체에 손을 뻗을 수 있다.

### Flight 프로토콜과 Server Function
RSC는 서버에서 컴포넌트를 렌더링하고 그 결과를 Flight라는 React 전용 형식으로 직렬화해 브라우저로 보낸다. 반대 방향도 있다. 브라우저가 Server Function(Next.js에서는 Server Action)을 호출하면 인자를 Flight 형식으로 직렬화해 POST로 보내고, 서버는 이것을 역직렬화해서 함수에 넘긴다. Flight 형식은 Promise, 다른 덩어리를 가리키는 참조 같은 JSON보다 풍부한 값을 표현한다.

<br/>

## 어떻게 동작했나
React 공지에 따르면 결함은 React가 Server Function 엔드포인트로 들어온 페이로드를 디코딩하는 방식에 있었다. 서버는 요청 본문의 Flight 데이터를 복원하면서 구조 검증을 충분히 하지 않았고, 공격자는 정상 클라이언트가 만들지 않을 형태의 페이로드를 보내 서버 쪽 코드 실행까지 이어 갔다.

복원 과정에서 참조를 따라 속성을 꺼낼 때 객체 자신의 속성인지 검사하지 않아 프로토타입 체인을 거쳐 함수 생성자에 닿았다는 분석이 보안 업체 글에 나오지만, 이 노트에서는 공식 문서로 확인하지 못해 확인 필요로 둔다.

중요한 점은 코드 실행이 역직렬화 단계에서 일어난다는 것이다. Server Function 본문 안에서 로그인 여부나 권한을 검사하더라도, 그 검사는 인자 복원이 끝난 뒤에 돈다. 그래서 인가 로직과 상관없이 공격이 가능했다.

### 영향 범위
- 취약한 패키지는 `react-server-dom-webpack`, `react-server-dom-parcel`, `react-server-dom-turbopack` 의 19.0, 19.1.0, 19.1.1, 19.2.0이다
- 이 패키지를 쓰는 Next.js App Router, React Router의 RSC 모드, Waku, `@vitejs/plugin-rsc` 같은 프레임워크와 번들러 플러그인이 함께 영향을 받았다
- React 공지는 Server Function을 직접 만들지 않았더라도 앱이 RSC를 지원하면 취약할 수 있다고 적었다. 기본 `create-next-app` 프로젝트도 코드 변경 없이 공격 대상이 됐다
- 서버 없이 브라우저에서만 도는 React 앱이나, RSC를 지원하지 않는 프레임워크(Next.js Pages Router 등)는 영향이 없었다

Next.js 쪽에서 따로 발급된 CVE-2025-66478은 나중에 CVE-2025-55182의 중복으로 정리됐다.

<br/>

## 무엇을 고쳐야 했나

### 1차 패치
`react-server-dom-*` 패키지를 19.0.1, 19.1.2, 19.2.1로 올리는 것이 해결책이었다. 우회 설정(workaround)은 없었다. 직접 설치하지 않고 프레임워크가 품고 있는 경우가 많아서, 실제로는 Next.js 같은 프레임워크 버전을 올리는 방식으로 반영했다.

### 후속 취약점
패치 뒤 연구자들이 같은 영역을 더 들여다보면서 12월 11일에 후속 취약점이 공개됐다. 서비스 거부 CVE-2025-55184(CVSS 7.5)와 서버 함수 소스 코드 노출 CVE-2025-55183(CVSS 5.3)이다. 서비스 거부 수정이 불완전해서 CVE-2025-67779가 이어 나왔고, 2026년 1월 26일에는 서비스 거부 CVE-2026-23864가 더 추가됐다.

후속 공지는 CVE마다 버전을 나누지 않고 한 묶음으로 안내한다. 12월에 낸 19.0.3, 19.1.4, 19.2.3은 서비스 거부 수정이 불완전했고, 네 후속 취약점까지 모두 막힌 안전 버전은 19.0.4, 19.1.5, 19.2.4다. 1차 패치(19.2.1)나 12월 후속 패치(19.2.3)에서 멈췄다면 서비스 거부 취약점은 열려 있다는 뜻이다. Testea는 12월 16일 19.2.3으로 올렸고, 2026-10-30에 확인했을 때도 `react`, `react-dom` 은 19.2.3이었다. 다만 Next.js App Router는 서버 컴포넌트용 React와 `react-server-dom-webpack` 을 자체 번들에 넣어 쓰므로, 실제 노출 여부는 Next.js 버전으로 판단해야 한다. Testea가 쓰는 `next@16.4.2` 안의 React는 `19.3.0-canary-278794d7-20261002` 빌드로, 마지막 후속 취약점을 고친 Next.js 16.1.5보다 뒤의 버전이다. 그 canary에 수정이 들어갔다는 것은 빌드 날짜와 버전 순서로 추론한 것이고 코드로 대조하지는 않았다. 번들 밖에서 쓰이는 `react` 패키지는 19.2.4 이상으로 올려 두는 편이 낫다.

<br/>

## 이 사건에서 남는 것
프레임워크가 새 통신 방식(여기서는 Flight)을 숨겨서 처리해 주면 편하지만, 그 통신 방식의 파서도 공격 표면이 된다. Server Action은 겉보기에는 함수 호출이지만 실제로는 누구나 POST를 보낼 수 있는 공개 엔드포인트다. 이 사실은 이 취약점과 별개로도 기억해 둘 만하다.

<br/>

## 참고 자료
- [React 공식 공지, Critical Security Vulnerability in React Server Components](https://react.dev/blog/2025/12/03/critical-security-vulnerability-in-react-server-components)
- [React 후속 공지, Denial of Service and Source Code Exposure in React Server Components](https://react.dev/blog/2025/12/11/denial-of-service-and-source-code-exposure-in-react-server-components)
- [NVD, CVE-2025-55182](https://nvd.nist.gov/vuln/detail/CVE-2025-55182)
- [CISA, KEV 등재 알림](https://www.cisa.gov/news-events/alerts/2025/12/05/cisa-adds-one-known-exploited-vulnerability-catalog)

<br/>

[목차](../README.md) | 다음 장: [Node.js Brotli RCE(Node2Shell)](../02_Node.js%20Brotli%20RCE(Node2Shell)/README.md)
