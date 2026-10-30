## 무슨 일이 있었나
- 2026년 10월 21일 PHP가 보안 릴리스를 내면서 원격 코드 실행 취약점 두 개, CVE-2026-109618과 CVE-2026-109619를 고쳤다. 둘을 묶어 PHP2Shell이라 부른다
- 둘 다 CVSS v4.0 9.2이고, 인증 없이 웹 요청만으로 PHP 워커 권한의 코드 실행이 가능하다
- 웹 요청을 처리하는 거의 모든 PHP 설치가 대상이었고, 영향 버전은 PHP 5.4까지 거슬러 올라간다는 보도가 있다. CISA는 10월 26일 두 CVE를 KEV에 등재했다

2장의 Node2Shell이 압축을 푸는 라이브러리의 결함이었다면, 이번에는 PHP 엔진이 요청 하나를 처리하고 정리하는 과정 자체에 결함이 있었다.

<br/>

## 알아둘 개념

### SAPI와 워커
SAPI(Server Application Programming Interface)는 PHP 엔진이 웹 서버와 붙는 방식을 말한다. Apache 안에 모듈로 들어가는 `mod_php`, 별도 프로세스 풀로 요청을 받는 PHP-FPM, 요청마다 실행되는 `php-cgi`, Go로 만든 FrankenPHP, LiteSpeed 등이 있다. CISA와 PHP 권고는 웹 요청을 처리하는 이 전부를 영향 대상으로 꼽았다. 다만 아래에서 볼 CVE-2026-109619는 같은 워커가 다음 요청을 받아야 성립하므로, 워커를 재사용하지 않는 구성에서 얼마나 성립하는지는 확인 필요다.

워커(worker)는 일꾼이라는 뜻이다. PHP-FPM 같은 방식은 워커 프로세스 여러 개를 띄워 두고, 하나의 워커가 요청을 처리한 뒤 정리하고 다음 요청을 받는다. 프로세스를 매번 새로 만들지 않아서 빠르지만, 앞 요청의 흔적을 깨끗이 지우지 못하면 다음 요청이 그 흔적을 밟게 된다. 두 번째 CVE가 바로 이 지점을 찔렀다.

### 해제 후 사용 (Use-After-Free)
이미 돌려준(free) 메모리를 계속 쓰는(use) 결함이다. 돌려준 자리에는 나중에 다른 데이터가 들어올 수 있으므로, 옛 주소를 따라간 코드는 엉뚱한 데이터를 자기 것으로 믿고 쓰게 된다. 공격자가 그 자리에 들어갈 데이터를 조절할 수 있으면 코드 실행으로 이어질 수 있다.

<br/>

## 어떻게 동작했나

### CVE-2026-109618: 메모리 부족 처리 중 메모리 손상
PHP는 메모리 할당에 실패하면(OOM, Out of Memory) 요청 처리를 그 자리에서 포기한다. 이때 절반쯤 초기화된 요청 데이터가 남고, 뒤이은 정리(cleanup) 단계가 그 데이터를 그대로 사용하면서 메모리가 손상됐다.

공격자는 크기 제한 안에 들어가는 것처럼 보이지만 실제로는 메모리를 다 써 버리게 만드는 multipart 요청을 보내 이 상황을 만들 수 있었다. 애플리케이션이 공격자 입력 크기에 맞춰 메모리를 잡는 코드가 있으면 그것도 트리거가 된다.

### CVE-2026-109619: 요청 사이에 남은 상태
앞 요청이 끝날 때 해제된 메모리를 내부 상태가 여전히 가리키고 있었다. 같은 워커가 받은 다음 요청이 초기화되기 전에 그 상태에 접근하면 해제 후 사용이 일어났다.

앞 요청의 정리를 끊는 계기는 치명적 오류(fatal error)다. 메모리 부족, 실행 시간 초과가 여기에 해당한다. 공식 권고에서 확인된 경로는 PHP 8.5에서 기본으로 켜진 치명적 오류 백트레이스 기능과 세션 처리 경로다. FPM에서는 두 요청이 같은 워커에 도달해야 하므로 공격 난이도가 올라가고, CVSS 벡터의 공격 복잡도(AC)가 High로 잡힌 이유도 여기에 있다.

### 왜 mod_php가 가장 위험했나
PHP 측은 Apache `mod_php` 를 가장 위험한 구성으로 봤다. 애플리케이션 코드가 한 줄도 돌기 전에 공격이 성공할 수 있기 때문이다. 1장에서 본 것처럼 결함이 요청을 해석하는 단계에 있으면, 애플리케이션의 인증이나 입력 검증은 끼어들 틈이 없다.

<br/>

## 실제로 얼마나 위험했나
10월 26일 CISA가 두 CVE를 KEV에 등재했다. Perplexity 연구진이 공격을 끌어들이려 일부러 열어 둔 미끼 시스템(허니팟, honeypot)이 공격자가 원격 코드 실행에 성공한 장면을 기록했고, 이것이 첫 성공 악용 확인으로 보도됐다. 여러 공개 PoC가 돌고 있다.

Amazon이 패치 약 일주일 전부터 악용을 탐지했다는 보도도 검색 결과에 있지만 원문 기사로 확인하지 못해 확인 필요로 둔다. 반대로 Rapid7은 자체 시도에서는 좁은 실험실 환경에서만 공격에 성공했다고 적었다. 출처마다 공격 성공 범위가 달라서, 지금 단계에서는 악용이 확인됐고 공격 코드가 공개돼 있다는 것까지만 사실로 본다.

Shadowserver는 지원이 끝난 PHP 버전을 쓰는 인스턴스만 미국에서 26만 3천 개라고 밝혔다. 이들은 공식 패치를 받을 수 없다.

<br/>

## 무엇을 고쳐야 했나

### 버전 올리기
고정 버전은 8.2.35, 8.3.36, 8.4.27, 8.5.12다. 8.1 이하는 정기 업데이트가 끝났고, PHP는 7.4, 8.0, 8.1용 소스 백포트를 제한적으로만 제공했다. CISA는 바로 올릴 수 없거나 8.1 이하를 쓰는 시스템은 오프라인으로 내리라고 권고했다. 리눅스 배포판과 장기 지원 업체는 미리 패치를 받았으므로, 배포판 패키지로 PHP를 쓰고 있다면 배포판 보안 업데이트를 확인한다.

워드프레스, 그누보드처럼 PHP를 품은 소프트웨어나 공유 호스팅은 PHP 버전을 직접 고르지 못하는 경우가 많다. CISA가 첫 조치로 다른 소프트웨어 안에 들어 있는 PHP까지 포함한 자산 목록 만들기를 꼽은 이유다.

### 당장 올릴 수 없을 때
Rapid7이 정리한 임시 조치는 아래와 같다. 모두 서버 설정(php.ini, FPM 풀 설정)으로 걸어야 하고, 애플리케이션의 `ini_set()` 이나 `.user.ini` 는 요청 해석보다 늦게 적용돼 효과가 없다.

```ini
; 세션 업로드 진행 경로 차단 (CVE-2026-109619)
session.upload_progress.enabled = 0
; PHP 8.5 치명적 오류 백트레이스 경로 차단 (CVE-2026-109619)
fatal_error_backtraces = 0
; 요청 크기 상한 (CVE-2026-109618 완화). Rapid7 권고값은 업로드가 필요 없으면 8M, 필요하면 32M
post_max_size = 8M
```

8M은 PHP 기본값과 같다. 호스팅 설정이나 프레임워크 안내를 따라 이 값을 크게 올려 둔 서버가 많아서, 다시 낮추라는 뜻으로 읽으면 된다. `upload_max_filesize` 는 이보다 작게 둔다.

`memory_limit=-1` 로 메모리 제한을 없애는 방법도 언급됐지만, 실제 할당 실패는 여전히 일어날 수 있어 완전한 해결이 아니다. 오류 메시지 표시를 끄는 것은 해제된 상태에 접근하는 것 자체를 막지 못한다. 결국 완전한 해결은 두 수정이 모두 들어간 버전으로 올리는 것뿐이다.

### Windows용 PHP는 한 번 더
2장의 Brotli 결함은 Windows용 PHP 빌드에도 들어 있었다. PHP는 10월 26일 전후로 8.5.12-1, 8.4.27-1, 8.3.36-1, 8.2.35-1 재빌드를 냈다. 끝의 `-1` 은 의존 라이브러리를 바꿔 다시 패키징했다는 표시라서 `php -v` 로는 차이가 보이지 않는다. 이 경로는 cURL 확장에서 응답 자동 압축 해제를 켰을 때만 열리고, 기본값은 꺼져 있다고 보도됐다.

### 침해 흔적 확인
Rapid7은 업데이트와 함께 이미 침해됐는지 조사하라고 권고했다. CISA는 PHP 워커 프로세스가 셸을 띄우거나 도구를 내려받는 동작을 감시하라고 했고, 탐지 규칙(SIGMA)을 공개했다. 패치는 앞으로의 공격을 막을 뿐, 이미 심어진 웹셸을 지우지 않는다.

<br/>

## 이 사건에서 남는 것
PHP-FPM이 워커를 재사용하는 것은 성능을 위한 선택이지만, 앞 요청의 흔적을 완전히 지운다는 전제 위에 서 있다. 오류로 정리가 중간에 끊기면 그 전제가 깨진다. 오류 처리 경로는 평소에 잘 실행되지 않아 테스트도 덜 되므로, 정상 흐름보다 결함이 숨어 있기 쉽다. 그리고 임시 조치는 서버 설정 단계에서 걸어야 효과가 있었다. 애플리케이션 코드에서 할 수 있는 일이 거의 없었다는 점에서 1장의 React2Shell과 닮았다.

<br/>

## 참고 자료
- [CISA, Critical Vulnerabilities in PHP Require Immediate Patching](https://www.cisa.gov/news-events/alerts/2026/10/21/critical-vulnerabilities-php-require-immediate-patching)
- [Rapid7, CVE-2026-109618 and CVE-2026-109619: Critical Unauthenticated Remote Code Execution in PHP](https://www.rapid7.com/blog/post/etr-cve-2026-109618-and-cve-2026-109619-critical-unauthenticated-remote-code-execution-in-php/)
- [Cybersecurity Dive, CISA, security researchers confirm successful exploitation of PHP flaws](https://www.cybersecuritydive.com/news/cisa-security-researchers-exploitation-php-flaws/872886/)
- [The Hacker News, PHP issues second Windows security update](https://thehackernews.com/2026/10/php-issues-second-windows-security.html)

<br/>

[목차](../README.md) | 이전 장: [Node.js Brotli RCE(Node2Shell)](../02_Node.js%20Brotli%20RCE(Node2Shell)/README.md) | 다음 장: [오라클 PeopleSoft와 EBS(Oracle)](../04_오라클%20PeopleSoft와%20EBS(Oracle)/README.md)
