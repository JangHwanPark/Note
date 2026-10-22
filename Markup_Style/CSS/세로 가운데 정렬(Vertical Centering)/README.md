## 세로 가운데 정렬 방법
- 부모 요소 안에서 자식 요소를 위아래 가운데에 두는 방법을 모은 노트
- 레이아웃을 잡을 때 자주 쓰지만 방법이 여러 가지라서, 각 방법이 어떻게 동작하고 언제 깨지는지를 함께 정리한다
- 지금은 flex나 grid로 하는 것이 가장 간단하다. 나머지 방법은 오래된 코드에서 만나거나, 요소를 띄워야 할 때 쓴다

### 정렬 (Alignment)
사전적 의미는 가지런히 줄을 맞춰 늘어놓음이다.
CSS에서는 요소를 부모 안의 어느 위치에 둘지 정하는 일을 말한다. 가로 정렬은 `text-align` 처럼 오래전부터 쉬웠지만, 세로 정렬은 블록 요소의 높이가 내용에 따라 정해지는 구조라 flex가 나오기 전까지 우회하는 방법을 써야 했다.

비유하면 액자 속 사진을 위아래 가운데에 거는 일과 같다. 액자 높이(부모)와 사진 높이(자식)를 알아야 남는 공간을 위아래로 똑같이 나눌 수 있다.

아래 예시의 위치 값은 모두 headless Chromium 156.0.8078.4에서 예시 HTML을 그대로 가로 600px 화면에 띄워 잰 값이다. 부모는 높이 300px에 테두리 1px이고, 여백은 테두리 바깥선부터 잰 값이다. 글꼴과 줄 높이는 브라우저 기본값이라 자식 높이는 21px였다.

<br/>

## flex로 정렬하기
부모를 `display: flex` 로 만들고 `align-items: center` 를 주면 자식이 세로 가운데에 온다. flex에서 `align-items` 는 교차축(기본은 세로)의 정렬을 정하기 때문이다.

```html
<div style="display: flex; height: 300px; align-items: center; border: 1px solid">
    <div>display flex 세로 정렬</div>
</div>
```

자식의 위아래 여백이 140.5px로 같았다. 가로까지 가운데에 두려면 `justify-content: center` 를 더한다.

<br/>

## grid로 정렬하기
grid에서는 `align-items: center` 가 각 아이템을 자기 칸 안에서 세로 가운데에 둔다. 아래 예시는 `justify-content: center` 로 칸 묶음 전체를 가로 가운데로 옮겨 가로세로 모두 가운데에 놓았다.

```html
<div style="display: grid; height: 300px; border: 1px solid; align-items: center; justify-content: center">
    <div>그리드 세로 정렬</div>
</div>
```

자식(가로 123.3px)의 위아래 여백이 140.5px, 좌우 여백이 238.4px로 가운데에 왔다. `place-content: center` 한 줄로 써도 같은 위치가 나왔다.

<br/>

## position과 transform으로 정렬하기
부모를 기준점으로 삼고(`position: relative`), 자식을 `position: absolute` 로 띄운 뒤 `top: 50%` 로 내린다. 그런데 `top: 50%` 는 자식의 윗변을 부모의 가운데에 맞출 뿐이다. 그래서 `transform: translate(-50%, -50%)` 로 자식 자신의 크기의 절반만큼 다시 끌어올려야 자식의 가운데가 부모의 가운데에 온다.

```html
<div style="position: relative; height: 300px; border: 1px solid">
    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)">
        position 을 활용한 세로 정렬
    </div>
</div>
```

`transform` 을 빼고 재 보면 위 여백 151px, 아래 여백 130px로 자기 높이(21px)만큼 아래로 치우쳤고, 가로도 왼쪽 여백 300px로 오른쪽에 치우쳤다. `transform` 을 넣으면 위아래 140.5px, 좌우 195.6px로 같아졌다.

이 방법은 자식이 문서 흐름에서 빠져 다른 요소 위에 겹쳐 뜬다. 슬라이드 위에 띄운 버튼처럼 겹쳐야 할 때 쓴다.

<br/>

## vertical-align으로 정렬하기
`vertical-align` 은 같은 줄에 놓인 인라인 요소끼리의 세로 위치를 맞추는 속성이다. 그래서 자식에게 `vertical-align: middle` 만 주면 줄 높이가 자식 높이뿐이라 아무 변화가 없다. 실제로 재 보면 자식은 부모 맨 위(위 여백 3.4px, 아래 여백 277.6px)에 붙어 있었다.

부모 높이만큼 키가 큰 빈 인라인 요소를 같은 줄에 하나 더 두면, 그 줄의 높이가 부모 높이가 된다. 그 줄 안에서 자식이 `middle` 로 맞춰지므로 세로 가운데에 온다. 빈 요소는 보통 가상 요소(`::before`)로 만든다.

```html
<style>
  .parent { height: 300px; border: 1px solid; text-align: center; }
  .parent::before { content: ''; display: inline-block; height: 100%; vertical-align: middle; }
  .child { display: inline-block; vertical-align: middle; }
</style>
<div class="parent">
    <div class="child">vertical align (가상 요소 ::before 사용) 세로 정렬</div>
</div>
```

위아래 여백이 140.5px로 같았다. `::before` 대신 빈 `div` 를 직접 넣어도 같은 결과가 나온다. 이때 `content` 속성은 가상 요소에만 쓰이므로 `div` 에는 붙이지 않아도 된다.

<br/>

## line-height로 정렬하기
한 줄짜리 글자라면 `line-height` 를 부모 높이와 같게 주면 된다. 줄 높이 안에서 글자는 위아래 가운데에 놓이기 때문이다.

```html
<div style="height: 300px; line-height: 300px; border: 1px solid; text-align: center">
    line-height 세로 정렬
</div>
```

글자가 두 줄 이상이 되면 깨진다. 가로 200px 부모에 두 줄이 되는 글을 넣어 재 보니 한 줄마다 300px씩 차지해 내용 높이가 600px가 되었고, 두 번째 줄은 부모 아래로 넘쳐 나갔다. 버튼 글자처럼 줄이 바뀌지 않는 곳에만 쓴다.

<br/>

## Tailwind로 버튼을 세로 정중앙에 두기
캐러셀의 이전, 다음 버튼처럼 슬라이드 위에 띄운 버튼을 세로 정중앙에 둘 때는 위의 `position` 방식을 Tailwind 클래스로 쓰면 된다.

```html
<div class="relative h-[300px] border">
    <div class="absolute top-1/2 left-0 w-full flex justify-between -translate-y-1/2">
        <button>이전</button>
        <button>다음</button>
    </div>
</div>
```

`top-1/2` 는 요소의 윗변을 부모 높이의 50% 위치로 내린다. 이대로면 요소의 윗변이 가운데에 오므로, `-translate-y-1/2` 로 자기 높이의 50%만큼 다시 올려 요소의 가운데를 부모의 가운데에 맞춘다. `absolute` 는 `position` 이 지정된 가장 가까운 조상을 기준으로 자리를 잡으므로, 기준이 될 부모에 `relative` 를 준다. tailwindcss 4.3.3으로 클래스를 만들어 재 보니 버튼 줄의 위아래 여백이 138px로 같았다. 이 예시만 Tailwind 기본 스타일(줄 높이 1.5)이 적용되어 버튼 줄 높이가 24px이라 앞 예시들과 숫자가 다르다.

Tailwind v3부터는 `-translate-y-1/2` 만 써도 이동이 적용된다. v2에서는 `transform` 클래스를 함께 붙여야 했다. v4는 이 클래스를 `transform` 이 아니라 CSS `translate` 속성으로 만든다(4.3.3 출력에서 `translate: var(--tw-translate-x) var(--tw-translate-y)` 확인). 그래서 같은 요소에 `style="transform: ..."` 을 따로 주어도 서로 덮어쓰지 않고 함께 적용된다.

<br/>

## 어떤 방법을 고를까
| 방법 | 동작 | 어울리는 경우 | 주의할 점 |
| --- | --- | --- | --- |
| flex | 교차축 정렬 `align-items` | 대부분의 레이아웃 | 부모가 flex 컨테이너가 된다 |
| grid | 칸 안 정렬 `align-items`, `place-content` | 이미 grid로 짠 레이아웃 | 칸 정렬과 칸 묶음 정렬을 구분해야 한다 |
| position + transform | 띄운 뒤 자기 크기 절반만큼 되돌림 | 다른 요소 위에 겹쳐 띄울 때 | 문서 흐름에서 빠진다 |
| vertical-align | 같은 줄 인라인 요소끼리 맞춤 | 오래된 코드, 인라인 요소 | 부모 높이만큼의 빈 요소가 필요하다 |
| line-height | 줄 높이 안 가운데 | 한 줄 글자 | 두 줄이 되면 넘친다 |

<br/>

## 참고 자료
- [MDN: align-items](https://developer.mozilla.org/ko/docs/Web/CSS/align-items)
- [MDN: vertical-align](https://developer.mozilla.org/ko/docs/Web/CSS/vertical-align)
- 위치 값은 Playwright 1.64.1의 headless Chromium 156.0.8078.4로 재 보았고, Tailwind 클래스는 tailwindcss 4.3.3(@tailwindcss/cli 4.3.3)으로 만들었다

<br/>

## 더 볼 것 (TODO)
- flex에서 `align-items` 와 `align-content` 의 차이
- 블록 요소에 `align-content: center` 를 주는 방법(브라우저 지원 범위 확인 필요)
- `margin: auto` 로 flex 자식 가운데 두기
