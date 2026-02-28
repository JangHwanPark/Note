## [개발노트] 이슈와 대응 기록 — React 보안 이슈 (CVE-2025-55182)

> 2025년 12월 3일 ~ 17일 | CVSS 10.0 — 사이드 프로젝트에서 만난 역대급 보안 취약점

12월 3일, React 공식 블로그에 긴급 보안 공지가 올라왔다. **CVE-2025-55182**, 별명 **React2Shell**. CVSS 스코어 **10.0 만점**. React Server Components(RSC)의 Flight 프로토콜에서 발견된 **사전 인증 없이 원격 코드 실행(Pre-Auth RCE)**이 가능한 취약점이었다.

이건 "언젠가 패치하면 되는" 수준의 이슈가 아니었다. 공개 당일부터 실제 공격이 관측됐고, CISA(미국 사이버보안·인프라 보안청)는 이틀 만에 Known Exploited Vulnerabilities 카탈로그에 등재했다. AWS, Google Cloud, Microsoft, Palo Alto Networks가 동시에 위협 분석 보고서를 발행할 정도로 심각한 사안이었다.

**Testea는 Next.js App Router 기반이고, Server Actions를 전면적으로 사용하고 있었다.** 정확히 이 취약점의 타격 범위 안에 있었다.

<br/>

## 취약점 분석

### CVE-2025-55182 (React2Shell)

| 항목 | 내용 |
|---|---|
| **CVSS** | 10.0 (Critical) |
| **공격 벡터** | Network / 사전 인증 불필요 |
| **영향** | 원격 코드 실행 (RCE) |
| **영향 버전** | React 19.0, 19.1.0, 19.1.1, 19.2.0 |
| **패치 버전** | React 19.0.1, 19.1.2, 19.2.1+ |

React Server Components가 클라이언트로부터 받은 RSC 페이로드(Flight 프로토콜)를 역직렬화(deserialize)하는 과정에서, 입력값에 대한 구조 검증이 누락되어 있었다. 공격자가 조작된 HTTP POST 요청 하나만으로 서버 측 Node.js 런타임에서 임의 코드를 실행할 수 있었다.

핵심은 **기본 설정이 취약하다**는 점이었다. `create-next-app`으로 만든 표준 프로젝트가 아무런 코드 변경 없이 공격 가능했다. 워크어라운드도 없었다. 패치 외에는 답이 없었다.

### CVE-2025-66478 (Next.js)

Next.js App Router가 RSC 프로토콜을 사용하는 과정에서 발생하는 다운스트림 취약점. `Next-Action` 헤더를 통해 Server Actions에 조작된 페이로드를 주입할 수 있었다. 이후 CVE-2025-55182에 병합(duplicate)되었지만, Next.js 자체적으로도 별도 패치가 필요했다.

### 왜 Testea에 치명적이었나

Testea는 이 취약점의 모든 조건을 충족하고 있었다:

1. **Next.js App Router** 사용 — Pages Router는 영향 없지만, App Router는 직격
2. **React Server Components** 전면 활용 — 모든 페이지가 기본적으로 서버 컴포넌트
3. **Server Actions** 광범위 사용 — 프로젝트/케이스/스위트/런/마일스톤 CRUD 전체가 Server Actions
4. **React 19.2.0** 구동 중 — 영향받는 버전 정확히 해당
5. **프로덕션 배포 상태** — Vercel에 실제 배포되어 외부 접근 가능

하나라도 해당하면 패치해야 하는데, 다섯 개 전부 해당이었다.

<br/>

## 대응 타임라인

### 1차 대응: 2025년 12월 7일

```
커밋: 5cd983c
메시지: chore(deps): Next.js 업데이트 및 의존성 정리
    - 보안 취약점(CVE-2025-66478) 해결을 위해 Next.js 최신 버전으로 업데이트
```

CVE-2025-66478(Next.js 측 취약점)이 먼저 확인되어, Next.js를 16.0.3에서 16.0.7로 업데이트했다. 이 시점에서는 Next.js 측 패치가 React 코어의 문제까지 완전히 해결하지는 못했다.

**변경 내역:**
- `next`: 16.0.3 → 16.0.7
- `@types/testing-library__jest-dom` 제거 (자체 타입 내장으로 불필요)

### 2차 대응 (긴급): 2025년 12월 16일

```
커밋: 02d418a
메시지: [긴급] 리액트 CVE-2025-55182, CVE-2025-66478 대응
```

React 코어 패치가 릴리스된 후, 전체 의존성을 일괄 업데이트했다. 커밋 메시지에 `[긴급]` 태그를 붙인 유일한 커밋이다.

**핵심 변경:**

| 패키지 | Before | After |
|---|---|---|
| `react` | 19.2.0 | **19.2.3** |
| `react-dom` | 19.2.0 | **19.2.3** |
| `next` | 16.0.7 | **16.0.10** |

**동시 업데이트된 의존성:**

| 패키지 | Before | After |
|---|---|---|
| `@tanstack/react-query` | 5.90.10 | 5.90.12 |
| `@tanstack/react-query-devtools` | 5.90.2 | 5.91.1 |
| `drizzle-orm` | 0.44.7 | 0.45.1 |
| `zod` | 4.1.12 | 4.2.1 |
| `@supabase/supabase-js` | 2.83.0 | 2.87.3 |
| `framer-motion` | 12.23.25 | 12.23.26 |
| `lucide-react` | 0.554.0 | 0.561.0 |

보안 패치만 단독으로 올리는 것보다, **관련 의존성을 함께 올려서 호환성 문제를 사전에 차단**하는 쪽을 선택했다. React 코어 버전이 올라가면 이를 의존하는 라이브러리들도 함께 올려야 런타임 불일치를 피할 수 있기 때문이다.

### 사후 정리: 2025년 12월 17일

```
커밋: 5cfd8ec
메시지: chore(deps): remove deprecated @types/bcryptjs and @types/uuid packages
```

업데이트 과정에서 발견된 불필요한 타입 패키지를 정리했다. `bcryptjs`와 `uuid`가 자체 타입 정의를 내장하게 되면서 별도 `@types` 패키지가 deprecated 상태였다.

<br/>

## 대응 과정에서의 판단

### 왜 즉시 대응했나

사이드 프로젝트라서 "나중에 해도 되지 않나?"라는 생각이 들 수 있다. 하지만 세 가지 이유로 즉시 대응을 선택했다.

**1. 실제 공격이 진행 중이었다.**

공개 수시간 내에 중국 연계 위협 그룹(Earth Lamia, Jackpot Panda)의 공격이 관측됐다. AWS, Google Cloud, Datadog 등이 동시에 위협 보고서를 발행했다. 이건 "이론적 위협"이 아니라 **현재 진행형 공격**이었다.

**2. 공격 난이도가 극히 낮았다.**

HTTP POST 요청 하나로 서버 장악이 가능했다. 특별한 도구나 사전 지식이 필요 없었다. 공개된 PoC(Proof of Concept)가 빠르게 퍼졌고, 자동화된 스캐너에 탑재되는 건 시간 문제였다.

**3. 포트폴리오 서비스의 신뢰도 문제.**

알려진 CVSS 10.0 취약점을 방치한 서비스를 포트폴리오로 제시한다면, 그 자체로 보안 인식 부족을 드러내는 셈이다.

### 전체 의존성 동시 업데이트를 선택한 이유

보안 패치만 최소한으로 적용하는 방식도 있었다. 하지만 `package.json`의 76줄, `pnpm-lock.yaml`의 2,390줄이 변경된 이 커밋에서 볼 수 있듯, **전체 의존성을 함께 올리는 쪽을 선택**했다.

이유는 단순하다. React 코어 버전이 올라가면, 이를 의존하는 `react-dom`, `@tanstack/react-query`, `framer-motion` 등도 새 버전에서 테스트된 버전으로 맞춰야 한다. 보안 패치만 단독 적용하면 **지금은 동작하지만 미묘한 런타임 불일치가 잠복**할 수 있다.

업데이트 후 전체 빌드를 돌려 사이드이펙트가 없음을 확인하고 배포했다.

<br/>

## 이 프로젝트에서 왜 Server Actions가 위험했나

Testea의 Server Actions 사용 범위를 보면 왜 이 취약점이 치명적이었는지 체감할 수 있다:

```
src/entities/milestone/api/server-actions.ts
  → createMilestone, updateMilestone, archiveMilestone, addTestCases/Suites...

src/entities/project/api/server-actions.ts
  → archiveProject

src/entities/test-case/api/server-actions.ts
  → createTestCase, updateTestCase, archiveTestCase

src/entities/test-suite/api/server-actions.ts
  → createTestSuite, updateTestSuite, archiveTestSuite

src/features/runs-create/model/server-action.ts
  → createTestRunAction

src/features/runs-edit/model/
  → addCasesToRunAction, addMilestonesToRunAction, addSuitesToRunAction

src/features/runs/api/update-test-case-run.ts
  → updateTestCaseRunStatus
```

이 모든 Server Actions가 RSC Flight 프로토콜을 통해 클라이언트 요청을 받아 서버에서 실행된다. 취약점이 패치되기 전에는 **이 모든 엔드포인트가 잠재적 공격 표면**이었다.

이후 별도 커밋(`6f75b7d`)에서 `requireProjectAccess()` 인가 검증을 모든 Server Actions에 적용했지만, 이 취약점은 인가 이전 단계(역직렬화 과정)에서 발생하므로 **인가 로직과 무관하게 공격 가능**했다. 즉, 인가 검증은 정상 요청에 대한 보호이지, 이 CVE에 대한 방어는 아니었다.

<br/>

## 교훈

### 1. 프레임워크의 기본 설정을 맹신하지 말 것

React Server Components는 "안전한 기본값"을 표방했지만, Flight 프로토콜의 역직렬화 로직에 근본적인 결함이 있었다. 프레임워크가 제공하는 보안 보장은 **현재까지 알려진 범위 내에서의 보장**일 뿐이다.

### 2. 의존성 업데이트를 미루지 말 것

1차 대응(12/7)에서 Next.js만 올린 건 React 코어 패치가 아직 안정화되지 않았기 때문이었다. 그 사이 9일간의 공백이 있었다. 가능하다면 **패치가 나오는 즉시** 적용하는 것이 맞다. 사이드 프로젝트든 상용 서비스든, CVSS 10.0 앞에서는 동일하다.

### 3. 사이드 프로젝트의 보안은 선택이 아니다

> 포트폴리오로 사용할 서비스가 알려진 취약점을 포함하고 있다면, 그 자체로 보안 인식이 부족하다는 신호가 된다. **"아직 괜찮겠지"가 아니라 "알려진 즉시 대응한다"**가 올바른 자세다.

### 4. 보안 대응은 기록으로 남겨야 한다

어떤 취약점이 발견됐고, 어떤 판단 하에 어떤 조치를 취했는지를 커밋 로그와 문서로 남겨두면, 같은 상황이 다시 왔을 때 **대응 프로토콜**이 된다. `[긴급]` 태그 하나가 6개월 뒤에도 이 커밋의 맥락을 즉시 전달해준다.

<br/>

## 참고 자료

- [React 공식 보안 공지 — Critical Security Vulnerability in React Server Components](https://react.dev/blog/2025/12/03/critical-security-vulnerability-in-react-server-components)
- [Next.js Security Advisory — CVE-2025-66478](https://nextjs.org/blog/CVE-2025-66478)
- [NVD — CVE-2025-55182](https://nvd.nist.gov/vuln/detail/CVE-2025-55182)
- [Wiz Research — React2Shell: Critical React Vulnerability](https://www.wiz.io/blog/critical-vulnerability-in-react-cve-2025-55182)
- [Microsoft Security Blog — Defending against CVE-2025-55182](https://www.microsoft.com/en-us/security/blog/2025/12/15/defending-against-the-cve-2025-55182-react2shell-vulnerability-in-react-server-components/)
- [AWS Security Blog — China-nexus threat groups exploit React2Shell](https://aws.amazon.com/blogs/security/china-nexus-cyber-threat-groups-rapidly-exploit-react2shell-vulnerability-cve-2025-55182/)
- [Palo Alto Unit 42 — Exploitation of Critical Vulnerability in React Server Components](https://unit42.paloaltonetworks.com/cve-2025-55182-react-and-cve-2025-66478-next/)
- [CISA — Known Exploited Vulnerability Catalog](https://www.cisa.gov/news-events/alerts/2025/12/05/cisa-adds-one-known-exploited-vulnerability-catalog)
