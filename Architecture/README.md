## 아키텍처란 ?
- 아키텍처(Architecture)의 사전적 의미는 건축 양식, 건물의 구조다
- 공학적으로는 소프트웨어를 어떤 부분으로 나누고, 그 부분들이 서로 어떻게 연결되는지를 정한 구조를 말한다
- 이 폴더는 서비스 구조(BFF, SaaS)와 코드베이스 구조(FSD, 모노레포)를 정리한다

<br/>

## 목차
- [아키텍처 종류](./아키텍처%20종류(Architecture%20Types)/README.md) : 시스템, 소프트웨어, 코드베이스 아키텍처가 각각 무엇을 다루는지와 폴더 구조 문서를 부르는 이름
- [BFF (Backend For Frontend)](./BFF(Backend%20For%20Frontend)/README.md) : 화면 하나를 위한 전용 백엔드 계층, 언제 필요한지와 Next.js Route Handler와 Spring으로 만든 디에듀 대시보드 예시
- [SaaS (Software as a Service)](./SaaS(Software%20as%20a%20Service)/README.md) : 설치하지 않고 접속해 쓰는 서비스형 소프트웨어, NIST 기준 SaaS, PaaS, IaaS의 차이. 서비스를 어떤 형태로 제공하고 어디까지 운영을 맡기느냐가 시스템 구조를 정하는 출발점이라 이 폴더에 둔다
- [FSD (Feature-Sliced Design)](./FSD(Feature-Sliced%20Design)/README.md) : 레이어, 슬라이스, 세그먼트로 프론트엔드 코드를 나누는 방법과 가져다 쓰는 방향 규칙
- [모노레포 (Monorepo)](./모노레포(Monorepo)/README.md) : 저장소 하나에 여러 앱과 공통 패키지를 두는 방식, pnpm workspace로 만드는 순서와 Turborepo, Changesets

<br/>

## 더 볼 것 (TODO)
- 아토믹 디자인(Atomic Design): 원자, 분자, 유기체 단계로 컴포넌트를 나누는 방법과 FSD와의 차이
- 레이어드, 클린, 헥사고날 아키텍처
- 마이크로서비스(MSA)와 모놀리스
