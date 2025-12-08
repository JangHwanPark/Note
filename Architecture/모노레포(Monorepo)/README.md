## Monorepo 기본 생성법
### 1. Workspace 초기화 (pnpm)
```bash
mkdir my-workspace
cd my-workspace
pnpm init -y
```

### 2. pnpm-workspace.yaml 생성
```yaml
packages:
  - apps/*
  - packages/*
```

### 3. 기본 폴더 구조
```text
apps/
  실제 실행되는 애플리케이션 프로그램(React, NextJS 등)
packages/
  apps 내부에서 공통으로 사용할 유틸리티, ui 등
```

### 4. 필수 도구
#### pnpm(패키지 매니저) - npm(yarn)으로도 모노레포 구성 가능
Node가 설치되어 있다면 글로벌 설치
```bash
npm install -g pnpm
```

#### Turborepo(빌드 파이프라인) 설치
pnpm 기반 모노레포에서 빌드, 린트, 테스트를 병렬 처리하기 위한 툴

터보는 별도 설치 없이도 package.json에 쓸 수 있고 원한다면 글로벌 설치도 가능함
```bash
pnpm add -D turbo
```
#### Changesets (버전 관리 및 패키지 배포)
모노레포에서 패키지별 버전 및 CHANGELOG 관리를 자동화
```bash
pnpm add -D @changesets/cli
pnpm changeset init
```

### 5. 프로젝트 추가법
```bash
pnpm create next-app apps/web
```

