## 왜 동기화가 필요할까
- GitHub에서 다른 사람의 저장소를 포크(Fork)하면 내 계정에 복사본이 생기고, 그 뒤로는 원본 저장소와 따로 움직인다
- 원본에 새 커밋이 쌓여도 내 포크에는 저절로 들어오지 않는다. 오픈소스에 기여할 때 최신 원본 위에서 작업하지 않으면 PR을 올릴 때 충돌이 나기 쉽다
- 그래서 원본 저장소를 업스트림(upstream)이라는 이름의 원격 저장소로 하나 더 등록해 두고, 거기서 최신 커밋을 받아 온다
### 포크 (Fork)
사전적 의미는 포크, 그리고 길이 갈라지는 곳이다.
GitHub에서는 남의 저장소를 내 계정으로 통째로 복사해 따로 갈라져 나온 저장소를 만드는 일을 말한다. 갈라진 뒤로는 각자 커밋이 쌓이므로 원본과 내 포크가 서로 다른 길을 간다.

### 업스트림 (Upstream)
사전적 의미는 강의 상류다. 물이 흘러 내려오는 위쪽을 말한다.
Git에서는 내 저장소가 갈라져 나온 원래 저장소를 가리킨다. 변경 사항이 원본에서 포크로 흘러 내려온다고 보고 붙인 이름이다. `upstream` 은 Git이 정한 예약어가 아니라 관례로 쓰는 원격 이름이라 다른 이름을 붙여도 동작은 같다.

Git에는 이와 다른 뜻의 업스트림도 있다. 내 로컬 브랜치가 따라가는 원격 브랜치(추적 브랜치)를 업스트림이라 부르고, `git push -u origin main` 으로 정하거나 `@{upstream}` 으로 가리킨다. 이 노트에서 말하는 것은 원격 이름 `upstream` 쪽이다.

### 원격 저장소 (Remote)
내 컴퓨터 밖에 있는 저장소를 가리키는 이름과 주소의 짝이다. 포크를 클론하면 내 포크가 `origin` 으로 자동 등록되고, 원본은 직접 `upstream` 으로 추가해야 한다.

강물에 비유하면 원본은 상류의 수원, 내 포크는 하류에 따로 파 둔 저수지다. 저수지 물을 새로 채우려면 상류에서 끌어오는 수로(upstream 등록)가 있어야 한다.

<br/>

## 업스트림 등록하기
```bash
git remote add upstream https://github.com/original-owner/repository.git
git remote -v
```

`git remote -v` 로 보면 원격이 두 개가 된다.

```text
origin    https://github.com/your-username/repository.git (fetch)
origin    https://github.com/your-username/repository.git (push)
upstream  https://github.com/original-owner/repository.git (fetch)
upstream  https://github.com/original-owner/repository.git (push)
```

`origin` 은 내 포크, `upstream` 은 원본이다. 업스트림에도 push 주소가 보이지만, 원본에 쓰기 권한이 없으면 push는 거부된다.

<br/>

## 원본의 최신 커밋 가져오기
`git fetch` 는 원격의 커밋을 받아 `upstream/main` 같은 원격 추적 브랜치에만 넣고, 내 브랜치는 건드리지 않는다. 받은 뒤에 내 브랜치에 합치는 단계가 따로 필요하다.

```bash
git fetch upstream
git log --oneline main..upstream/main   # 내 main에 없는 원본 커밋만 보기
```

### 내 main에 아무 작업도 하지 않았을 때
main을 원본과 똑같이 유지하는 경우라면 fast-forward로 합친다. 내 커밋이 끼어 있으면 실패하므로, 실수로 main에 작업했는지 알아챌 수 있다.

```bash
git switch main
git merge --ff-only upstream/main
git push origin main   # 내 포크(origin)에도 반영
```

확인할 때 원본에만 있던 커밋 `b from original` 이 이 과정을 거쳐 내 main과 포크에 그대로 들어왔다.

### 작업 브랜치를 원본 위로 옮길 때
기능 브랜치에서 작업하던 중에 원본이 앞서 나갔다면 rebase로 내 커밋을 원본 최신 커밋 뒤로 옮긴다.

```bash
git fetch upstream
git switch feature
git rebase upstream/main
```

확인했을 때 결과 기록은 아래처럼 원본 커밋 두 개 뒤에 내 커밋이 붙었다.

```text
d78fc5f c my work
dd4599f d from original
f19762b b from original
```

rebase는 커밋을 새로 만들기 때문에 이미 포크에 push한 브랜치라면 다시 push할 때 `git push --force-with-lease` 가 필요하다. 다른 사람과 함께 쓰는 브랜치에서는 rebase 대신 `git merge upstream/main` 을 쓴다.

<br/>

## 업스트림 주소 바꾸기와 지우기
원본 저장소 주소가 바뀌었으면 주소만 고친다.

```bash
git remote set-url upstream https://github.com/new-owner/repository.git
git remote get-url upstream
```

등록 자체를 없애고 다시 추가할 수도 있다. `remove` 를 하면 `upstream/main` 같은 원격 추적 브랜치도 함께 지워진다.

```bash
git remote remove upstream
git remote add upstream https://github.com/new-owner/repository.git
```

<br/>

## 확인한 환경
위 명령은 Git 2.45.1(Windows)에서 로컬 저장소 세 개(원본, 포크, 내 작업 폴더)를 만들어 실행해 확인했다.

<br/>

## 더 볼 것 (TODO)
- GitHub 웹의 Sync fork 버튼과 `gh repo sync` 로 동기화하기 (확인 필요)
- 동기화 중 충돌이 났을 때 해결 순서
