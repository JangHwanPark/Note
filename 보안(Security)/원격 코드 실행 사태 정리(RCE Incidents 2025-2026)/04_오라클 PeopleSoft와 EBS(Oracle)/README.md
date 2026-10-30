## 무슨 일이 있었나
- 2026년 Oracle 업무용 제품에서 두 사건이 이어졌다. 하나는 PeopleSoft의 제로데이 CVE-2026-35273, 다른 하나는 E-Business Suite(EBS)의 CVE-2026-101767이다. 둘 다 CVSS v3.1 9.8이다
- PeopleSoft 건은 패치가 나오기 전부터 해킹 조직 ShinyHunters가 대학을 중심으로 대규모 침해에 썼고, 10월에는 하나의 CVE가 사실 결함 세 개를 엮은 것이었다는 분석이 나왔다
- EBS 건은 10월 정기 패치(Critical Patch Update, CPU)로 고쳐졌고, 패치 일주일 만에 탐색 공격이 관측됐다. 실제 침해는 아직 확인되지 않았다

1장부터 3장까지는 오픈소스 런타임과 라이브러리였고, 패치가 나온 뒤 공격이 시작됐다. 이 장은 기업용 상용 제품이고, 공격이 패치보다 먼저 왔다는 점이 다르다.

<br/>

## 알아둘 개념

### PeopleSoft와 E-Business Suite
둘 다 Oracle의 ERP(전사적 자원 관리) 제품이다. 인사, 급여, 재무 같은 회사 운영 데이터를 다룬다. PeopleSoft는 특히 대학에서 학생 기록과 학사 관리용으로 많이 쓴다. 그래서 이 제품이 뚫리면 개인정보와 재무 정보가 한꺼번에 나간다.

### 서버 측 요청 위조 (Server-Side Request Forgery, SSRF)
위조(forgery)는 진짜처럼 꾸민다는 뜻이다. 서버 측 요청 위조는 공격자가 서버를 시켜 다른 곳에 요청을 보내게 만드는 공격이다. 서버가 보낸 요청은 서버 내부에서 출발하므로, 바깥에서는 닿지 못하는 내부 서비스나 localhost에서 온 요청을 믿는 서비스에 닿을 수 있다.

### SQL 주입 (SQL Injection)
주입(injection)은 밀어 넣는다는 뜻이다. 사용자 입력이 SQL 문 안에 그대로 이어 붙여질 때, 입력에 SQL 구문을 섞어 넣어 원래 의도와 다른 쿼리를 실행시키는 공격이다. 데이터 조회와 변조에 그치지 않고, 데이터베이스 기능을 거쳐 코드 실행까지 이어지기도 한다.

<br/>

## PeopleSoft: CVE-2026-35273

### 경과
Mandiant와 Google 위협 인텔리전스 그룹(GTIG)에 따르면 ShinyHunters(UNC6240)는 2026년 5월 27일부터 6월 9일까지 이 결함을 제로데이로 썼다. Oracle은 6월 10일 정기 일정 밖의 긴급 보안 경보를 냈다. 피해 조직은 100곳이 넘는다고 보도됐고, 그중 약 68%가 미국 대학이었다.

영향 버전은 PeopleTools 8.61과 8.62이고, 지원이 끝난 이전 버전도 취약할 가능성이 높다. 6월 당시 패치가 바로 제공됐는지는 출처마다 엇갈려 확인 필요로 둔다. 다만 10월 기준으로 Oracle 경보에 이 CVE의 패치가 올라 있다는 점은 여러 출처가 같다. CISA KEV에도 등재됐다고 보도됐지만 등재일은 확인하지 못했다.

침입 뒤 공격자는 `psappsrv.cfg` 설정 파일에서 자격 증명을 꺼내고, 연결된 웹, 애플리케이션, 배치 서버를 파악한 뒤 원격 접속 에이전트와 웹셸을 심었다. 시스템에는 해킹 사실을 알리는 협박 메모 파일이 남았다.

### 패치 대신 WAF로 막은 곳은 다시 뚫렸다
패치를 적용하지 않고(또는 패치가 나오기 전에) WAF(웹 방화벽) 규칙으로 문제 경로만 막은 조직이 많았다. 9월 말 Mandiant는 ShinyHunters가 공격을 다시 키워 전 세계 수십 개 시스템에 웹셸을 심었다고 밝혔다. 요청 경로의 글자 하나를 URL 인코딩해 WAF 규칙을 피했다는 보도가 있다. 문자열을 비교하는 차단 규칙은 같은 뜻을 다르게 쓴 요청을 놓치기 쉽다. 임시 차단은 패치까지 시간을 버는 수단이지 패치를 대신하지 못한다는 것을 보여 준 사례다.

### 결함 세 개를 엮은 공격
ZDI(Zero Day Initiative)는 10월 분석 글에서 이 CVE 하나가 실제로는 서로 다른 결함 세 개라고 밝혔다. 공격 순서대로 보면 아래와 같다.

1. Integration Gateway(PSIGW)의 SSRF. `/PSIGW/HttpListeningConnector` 는 받은 요청을 다른 곳으로 전달하는데, 목적지 URL과 본문을 호출자가 정하고 목적지를 검사하지 않았다. 공격자는 이것으로 서버 자신(127.0.0.1)에 요청을 보낸다
2. PSEMHUB의 임의 파일 쓰기. 환경 관리 허브(PSEMHUB)는 `allowedhosts.properties` 기본값에 따라 localhost에서 온 요청을 믿는다. 1번으로 이 검사를 통과한 뒤, 로그를 쓰라고 만든 핸들러에 원하는 내용과 절대 경로를 넘겨 웹 애플리케이션 경로에 웹셸을 쓴다
3. PSEMHUB의 안전하지 않은 역직렬화. 허브 서블릿은 시작할 때 특정 폴더의 XML 파일을 모두 Java `XMLDecoder` 로 읽는다. `XMLDecoder` 는 XML에 적힌 대로 객체를 만들고 메서드를 호출하므로, 2번으로 악성 XML을 심어 두면 다음 재시작 때 코드가 실행된다. 웹셸 파일이 없어서 찾기가 더 어렵다

1장에서 본 역직렬화 문제가 여기서도 나온다. 언어와 형식은 달라도 받은 데이터대로 객체를 만든다는 구조는 같다. ZDI 글과 The Register 기사는 ZDI가 6월 10일 Oracle에 이 결함들을 보고했다고 적었다. Oracle 긴급 경보와 같은 날이라 날짜가 섞였을 가능성이 있어 확인 필요로 둔다. ZDI는 결함마다 따로 CVE를 받는 작업을 진행 중이다. 개별 CVE 번호는 아직 확인하지 못했다.

### 무엇을 고쳐야 했나
Oracle 패치를 적용하는 것이 기본이다. 바로 적용하지 못하면 다중 서버 구성에서는 환경 관리 허브 서비스를 끄고, 단일 서버 구성에서는 PSEMHUB 애플리케이션을 제거하라는 것이 Oracle 경보의 안내로 보도됐다. Oracle 경보 원문은 직접 열람하지 못해(접근 거부) 보도 내용 기준으로 적었다.

패치는 이미 심어진 웹셸이나 XML 파일을 지우지 않는다. 5월 말 이후 노출됐던 시스템은 PSEMHUB 웹 경로의 낯선 파일, 환경 메타데이터 폴더의 새 XML 파일을 확인해야 한다.

<br/>

## E-Business Suite: CVE-2026-101767
인증 없이 HTTP로 공격할 수 있는 SQL 주입이고, 원격 코드 실행으로 이어질 수 있다. Horizon3.ai가 7월 24일 Oracle에 보고했고, Oracle은 10월 20일 CPU에서 고쳤다. 이번 CPU는 1,200개가 넘는 취약점을 고쳤다고 보도됐다.

결함 위치는 출처마다 다르게 적혀 있다. SecurityWeek는 Application Object Library, The Register는 Thin Client Framework 서블릿이라고 썼다. 영향 버전도 이번에 확인한 기사에는 없었다. 둘 다 확인 필요다.

10월 27일 보안 업체 Defused의 EBS 허니팟(3장 참고)에 이 결함을 노린 탐색 공격이 기록됐다. 실제 침해 사례는 아직 보고되지 않았다. EBS는 2025년에도 대규모 침해 캠페인의 표적이 된 적이 있어서, 공격자들이 이 제품의 새 결함을 빠르게 노린다는 점을 감안하면 패치를 서둘러야 한다.

<br/>

## 이 사건에서 남는 것
PeopleSoft 사건은 내부에서 온 요청은 믿는다는 가정이 SSRF 하나로 무너지는 과정을 보여 준다. 내부 서비스도 바깥 요청과 같은 수준으로 검사해야 하고, 로그 쓰기 같은 사소한 기능도 경로를 검사하지 않으면 공격 도구가 된다.

또 하나는 CVE 하나가 결함 하나를 뜻하지 않는다는 점이다. 제작사가 여러 결함을 한 번호로 묶어 고치면, 바깥에서는 공격 경로가 몇 개였는지 알기 어렵다. WAF로 한 경로만 막은 조직은 같은 경로를 다르게 인코딩한 요청에 다시 뚫렸고, 막지 않은 다른 결함 경로도 그대로 남아 있었다.

<br/>

## 참고 자료
- [Oracle, Security Alert CVE-2026-35273](https://www.oracle.com/security-alerts/alert-cve-2026-35273.html) (접근 거부로 원문 미열람, 보도 기준 인용)
- [Zero Day Initiative, CVE-2026-35273: SSRF to RCE in Oracle PeopleSoft](https://www.zerodayinitiative.com/blog/2026/10/20/cve-2026-35273-ssrf-to-rce-in-oracle-peoplesoft)
- [Arctic Wolf, Critical Oracle PeopleSoft Vulnerability Actively Exploited in ShinyHunters Campaign](https://arcticwolf.com/resources/blog/critical-oracle-peoplesoft-vulnerability-actively-exploited-in-shinyhunters-campaign/)
- [The Register, Oracle celebrates end of Cybersecurity Awareness Month with quadruple trouble](https://www.theregister.com/security/2026/10/28/oracle-celebrates-end-of-cybersecurity-awareness-month-with-quadruple-trouble/5306121)
- [SecurityWeek, Hackers Start Probing Fresh Oracle EBS Vulnerability](https://www.securityweek.com/hackers-start-probing-fresh-oracle-ebs-vulnerability/)

<br/>

[목차](../README.md) | 이전 장: [PHP RCE(PHP2Shell)](../03_PHP%20RCE(PHP2Shell)/README.md)
