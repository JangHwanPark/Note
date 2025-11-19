리액트 쿼리를 NextJS에서 사용하는 팀프로젝트가 많았다. 이걸 사용하다보면 

## Next.JS는 향상된 fetch를 지원하는데 왜 ReactQuery를 사용할까?
- Next.js의 향상된 fetch()는 `서버 중심 데이터 패칭`용
- React Query는 `클라이언트 상태 관리 + 실시간 갱신`용

용도 자체가 달라서 보완 관계로 React Query는 단순히 `use client 대응`이라기보단 CSR 환경에서 데이터를 캐싱, 리프레시, 자동 동기화해주는 상태 관리 도구다.

## Next.js의 향상된 fetch()가 하는 일

## React Query의 역할 (클라이언트 중심)