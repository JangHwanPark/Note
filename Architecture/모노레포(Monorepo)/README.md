## 모노레포란 ?
- 모노레포(Monorepo)는 여러 애플리케이션과 공통 패키지를 저장소(repository) 하나에 함께 두고 관리하는 방식이다
- 앱마다 저장소를 따로 두는 방식은 폴리레포(Polyrepo)라고 부른다
- 이 노트는 pnpm workspace로 모노레포를 만드는 기본 순서를 정리한다. 확인한 환경은 pnpm 10.23.0이다

### 모노레포 (Monorepo)
mono는 하나, repo는 저장소(repository)의 줄임말이다. 말 그대로 저장소 하나라는 뜻이다.
공학적으로는 웹 앱, 관리자 앱, 공통 UI 패키지처럼 서로 관련된 프로젝트를 한 저장소에 두되, 각자 `package.json` 을 가진 독립된 패키지로 나눠 두는 구조를 말한다. 저장소는 하나지만 프로젝트는 여럿이다.

한 건물 안에 여러 가게가 입점한 상가와 같다. 가게마다 간판과 장부는 따로지만, 전기와 수도 같은 공용 설비는 함께 쓴다.

<br/>

## 왜 쓸까
공통 코드를 여러 앱이 함께 쓸 때 저장소가 나뉘어 있으면, 공통 코드를 고칠 때마다 패키지를 배포하고 각 앱에서 버전을 올려야 한다. 모노레포에서는 공통 패키지를 고치면 같은 저장소의 앱이 바로 그 코드를 쓴다. 변경 하나가 여러 앱에 미치는 영향을 커밋 하나, PR 하나로 확인할 수 있다.

대신 저장소가 커지면 설치와 빌드가 느려지고, 어느 패키지가 어느 패키지에 의존하는지 관리해야 한다. 그래서 workspace를 지원하는 패키지 매니저와 Turborepo 같은 빌드 도구를 함께 쓴다.

<br/>

## pnpm workspace로 만드는 순서
### 1. 저장소 루트 만들기
```bash
mkdir my-workspace
cd my-workspace
pnpm init
```

pnpm 10.23.0에서 `pnpm init -y` 처럼 `-y` 를 붙이면 `Unknown option: 'y'` 오류가 난다. npm과 달리 pnpm의 `init` 은 묻지 않고 바로 `package.json` 을 만들기 때문에 `-y` 가 필요 없다.

pnpm이 없다면 `npm install -g pnpm@10.23.0` 으로 설치한다. 버전을 빼면 최신 버전이 설치되는데, 이 노트의 동작은 10.23.0에서만 확인했다. Corepack(`corepack enable pnpm`)을 쓰는 방법도 있지만, Corepack 저장소 README에 따르면 Corepack은 Node.js 14.19.0부터 25.0.0 전까지만 함께 배포된다. Node.js 25 이상에서는 `npm install -g corepack` 으로 따로 설치해야 한다. npm과 yarn도 workspace를 지원하므로 pnpm이 아니어도 모노레포를 만들 수 있다.

### 2. pnpm-workspace.yaml 만들기
루트에 이 파일을 두면 pnpm이 저장소를 workspace로 인식한다. `packages` 에 적은 경로 아래 폴더가 각각 하나의 패키지가 된다.

```yaml
packages:
  - apps/*
  - packages/*
```

### 3. 폴더 구조
```text
my-workspace/
  package.json
  pnpm-workspace.yaml
  apps/
    web/         실제로 실행되는 앱(React, Next.js 등)
  packages/
    ui/          여러 앱이 함께 쓰는 공통 UI, 유틸리티
```

`apps` 와 `packages` 라는 이름은 관례일 뿐이고, `pnpm-workspace.yaml` 에 적은 경로와 맞으면 된다.

### 4. 앱 추가하기
```bash
pnpm create next-app apps/web
```

create-next-app 16.4.2의 코드를 보면 pnpm으로 만들 때 앱 폴더 안에 `pnpm-workspace.yaml` 을 따로 만든다. 그래서 `apps/web` 에 workspace 파일이 하나 더 생길 수 있다. 이것이 루트 workspace 인식이나 설치에 영향을 주는지는 실행해 보지 않았다(확인 필요).

### 5. 공통 패키지를 앱에서 쓰기
`packages/ui/package.json` 의 `name` 을 `@my/ui` 로 정했다면, 앱에서 아래처럼 추가한다.

```bash
pnpm --filter web add @my/ui --workspace
```

`--filter web` 은 `name` 이 `web` 인 패키지에서 명령을 실행한다는 뜻이고, `--workspace` 는 npm 레지스트리가 아니라 같은 저장소 안의 패키지를 찾으라는 뜻이다. pnpm 10.23.0 기본 설정에서 `@my/ui` 의 `version` 이 `1.0.0` 인 상태로 실행하니 `apps/web/package.json` 에 `"@my/ui": "workspace:*"` 가 들어갔다. `workspace:` 는 배포된 버전이 아니라 저장소 안의 코드를 쓴다는 표시다. `workspace:*` 가 들어갈지 `workspace:^` 가 들어갈지는 `save-workspace-protocol` 설정과 패키지의 `version` 에 따라 달라진다.

<br/>

## 함께 쓰는 도구
### Turborepo (빌드 파이프라인)
여러 패키지의 빌드, 린트, 테스트를 의존 순서에 맞춰 병렬로 돌리고, 결과를 캐시해 바뀌지 않은 패키지는 다시 빌드하지 않는 도구다. 저장소 전체에서 쓰므로 루트에 개발 의존성으로 설치한다.

```bash
pnpm add -Dw turbo
```

workspace 루트에서 `-w`(`--workspace-root`) 없이 `pnpm add -D turbo` 를 실행하면 pnpm 10.23.0은 `ERR_PNPM_ADDING_TO_ROOT` 오류를 내고 멈춘다. 루트에 넣는 것이 의도라면 `-w` 를 붙여 명시하라는 뜻이다.

### Changesets (버전 관리와 배포)
패키지별 버전과 CHANGELOG를 관리하는 도구다. 변경할 때마다 어떤 패키지를 어느 단계(major, minor, patch)로 올릴지 기록해 두고, 배포할 때 한꺼번에 반영한다.

```bash
pnpm add -Dw @changesets/cli
pnpm changeset init
```

<br/>

## 확인한 환경
- pnpm 10.23.0, Windows 11에서 `pnpm init`, `pnpm-workspace.yaml`, `pnpm --filter web add @my/ui --workspace`, `pnpm add -Dw turbo` 를 실행해 결과를 확인했다
- `pnpm create next-app` 과 Changesets 명령은 실행하지 않았다

<br/>

## 참고 자료
- [pnpm Workspace](https://pnpm.io/workspaces)
- [Corepack README](https://github.com/nodejs/corepack#readme)
- [Turborepo](https://turborepo.com/docs)
- [Changesets](https://github.com/changesets/changesets)

<br/>

## 더 볼 것 (TODO)
- turbo.json에서 태스크 의존 관계와 캐시 설정하기
- 공통 패키지를 빌드 없이 소스로 가져다 쓸지, 빌드한 결과를 쓸지 정하는 기준
- 모노레포에서 Next.js 앱이 workspace 패키지를 변환하게 하는 설정(`transpilePackages`)
