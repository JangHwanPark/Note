## 업스트림
**업스트림(Upstream)** 이란 현재 로컬 저장소와 원본 저장소(Fork한 저장소 등)간의 관계를 설정하는 원격 저장소(Remote) 중 하나를 의미.

<br/>

### 업스트림이 필요한 이유
#### Fork한 저장소를 원본 저장소와 동기화할 때
GitHub에서 다른 사람의 저장소를 Fork하면, 원본 저장소(공식 저장소)와 내 저장소(Origin)가 분리.   
하지만 원본 저장소의 최신 코드가 필요할 때, 업스트림을 등록하여 최신 변경 사항을 가져올 수 있다.

<br/>

#### 오픈소스 프로젝트 기여할 때
오픈소스 프로젝트에서 Fork한 후 기여(Contribution)할 때, 원본 저장소와 내 저장소를 동기화해야 함.

<br/>

## 업스트림 추가 (Upstream 등록)
```bash
git remote add upstream https://github.com/original-owner/repository.git
```
upstream이라는 이름으로 원본 저장소를 추가   
origin(내 저장소)과 upstream(원본 저장소) 둘 다 연결됨

<br/>

## 현재 등록된 원격 저장소 확인
```bash
git remote -v
```
**출력 예시**
```bash
origin    https://github.com/your-username/Frontend.git (fetch)
origin    https://github.com/your-username/Frontend.git (push)
upstream  https://github.com/some-other-repo/Frontend.git (fetch)
upstream  https://github.com/some-other-repo/Frontend.git (push)
```

<br/>

## 업스트림에서 최신 코드 가져오기 (Fetch & Merge)
```bash
git fetch upstream
```

<br/>

## 기존 upstream URL을 변경
```bash
git remote set-url upstream https://github.com/Teamingg/Frontend.git
```
이후 git remote -v 로 변경된 URL이 적용되었는지 확인

<br/>

## 기존 upstream 삭제 후 다시 추가
```bash
git remote remove upstream
git remote add upstream https://github.com/Teamingg/Frontend.git
```
git remote remove upstream → 기존 upstream 제거   
git remote add upstream <URL> → 새로운 upstream 추가