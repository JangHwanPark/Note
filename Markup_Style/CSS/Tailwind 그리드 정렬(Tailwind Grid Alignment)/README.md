## Tailwind 그리드에서 아이템 정렬하기
- Tailwind CSS 클래스로 그리드(Grid) 아이템을 자기 칸 안의 어디에 둘지 정하는 방법
- 세로 방향은 `items-*`, `self-*`, 가로 방향은 `justify-items-*`, `justify-self-*`, 두 방향을 한 번에 정할 때는 `place-items-*`, `place-self-*` 를 쓴다
- 아이템이 칸을 몇 개 차지할지는 `row-span-*`, `col-span-*` 로 정한다
- 클래스가 만드는 CSS와 위치 값은 tailwindcss 4.3.3으로 클래스를 만들고 headless Chromium 156.0.8078.4에서 예시 HTML을 그대로 가로 600px 화면에 띄워 확인했다. 열이 셋이라 칸 하나의 너비는 200px, `h-64` 그리드의 높이는 256px이다

### 그리드 안의 정렬
그리드는 부모를 가로세로 칸으로 나누고, 아이템을 칸에 하나씩 넣는다. 정렬은 아이템을 그 칸 안의 어디에 둘지를 정하는 일이다. 비유하면 서랍장의 칸마다 물건을 넣을 때 칸 위쪽에 붙일지, 가운데 둘지, 칸 가득 채울지를 정하는 것과 같다.

아무 정렬도 주지 않으면 `align-items` 와 `justify-items` 의 초깃값은 `normal` 인데, 그리드 아이템에서는 늘이기(`stretch`)처럼 동작한다. `h-64` 그리드에 아이템 하나를 넣고 재 보니 아이템이 칸 높이 256px, 칸 너비 200px를 가득 채웠다. 아래 클래스들은 이 늘이기를 멈추고 아이템을 칸의 한쪽에 붙인다.

| 방향 | 모든 아이템에 (부모에 준다) | 아이템 하나에 (아이템에 준다) | 만드는 CSS |
| --- | --- | --- | --- |
| 세로 | `items-*` | `self-*` | `align-items`, `align-self` |
| 가로 | `justify-items-*` | `justify-self-*` | `justify-items`, `justify-self` |
| 세로와 가로 | `place-items-*` | `place-self-*` | `place-items`, `place-self` |

<br/>

## 세로 정렬
### items: 모든 아이템의 세로 위치
부모에 `items-start`, `items-center`, `items-end` 를 주면 모든 아이템이 각자의 칸 안에서 위, 가운데, 아래로 간다.

```html
<div class="grid grid-cols-3 h-64 items-end bg-gray-200">
  <div class="bg-blue-500 p-4">1</div>
  <div class="bg-red-500 p-4">2</div>
  <div class="bg-green-500 p-4">3</div>
</div>
```

아이템이 칸 아래에 붙었다(아래 여백 0, 위 여백 200px). 가로 방향은 그대로 늘이기라서 아이템 너비가 칸 너비 200px를 채웠다. 세로만 정했기 때문이다.

### self: 아이템 하나의 세로 위치
아이템에 `self-start`, `self-center`, `self-end` 를 주면 그 아이템만 따로 위치를 정한다. 부모의 `items-*` 보다 우선한다.

```html
<div class="grid grid-cols-3 h-64 items-center bg-gray-200">
  <div class="bg-blue-500 p-4 self-start">위</div>
  <div class="bg-red-500 p-4 self-center">가운데</div>
  <div class="bg-green-500 p-4 self-end">아래</div>
</div>
```

<br/>

## 가로 정렬
### justify-items: 모든 아이템의 가로 위치
부모에 `justify-items-start`, `justify-items-center`, `justify-items-end` 를 주면 모든 아이템이 각자의 칸 안에서 왼쪽, 가운데, 오른쪽으로 간다. 특정 열만 정렬하는 것이 아니라 모든 칸에 똑같이 적용된다.

```html
<div class="grid grid-cols-3 h-64 justify-items-center bg-gray-200">
  <div class="bg-blue-500 p-4 justify-self-start">왼쪽</div>
  <div class="bg-red-500 p-4">가운데</div>
  <div class="bg-green-500 p-4">가운데</div>
</div>
```

### justify-self: 아이템 하나의 가로 위치
위 예시에서 첫 아이템은 `justify-self-start` 를 주어 부모의 `justify-items-center` 를 무시하고 칸 왼쪽에 붙었다(칸 안 왼쪽 여백 0). 두 번째 아이템(가로 80px)은 부모 설정대로 자기 칸 안에서 좌우 여백이 60px씩으로 가운데에 왔다.

<br/>

## 두 방향을 한 번에
### place-items: 모든 아이템을 세로와 가로 모두
`place-items-*` 는 `align-items` 와 `justify-items` 를 같은 값으로 한 번에 정한다. 그래서 `place-items-start` 는 위쪽 정렬만이 아니라 왼쪽 위 정렬이다.

```html
<div class="grid grid-cols-3 h-64 place-items-center bg-gray-200">
  <div class="bg-blue-500 p-4">1</div>
  <div class="bg-red-500 p-4">2</div>
  <div class="bg-green-500 p-4">3</div>
</div>
```

첫 아이템이 칸 가운데에 왔다. 칸 안에서 위아래 여백이 100px, 좌우 여백이 79.7px로 같았다. 늘이기를 멈추었기 때문에 아이템 크기도 내용만큼(가로 40.6px, 세로 56px)으로 줄었다.

### place-self: 아이템 하나를 세로와 가로 모두
```html
<div class="grid grid-cols-3 h-64 bg-gray-200">
  <div class="bg-blue-500 p-4 place-self-start">왼쪽 위</div>
  <div class="bg-red-500 p-4 place-self-center">가운데</div>
  <div class="bg-green-500 p-4 place-self-end">오른쪽 아래</div>
</div>
```

첫 아이템은 칸의 왼쪽 위, 두 번째는 가운데, 세 번째는 오른쪽 아래 모서리에 붙었다.

<br/>

## 칸 여러 개 차지하기
### row-span: 세로로 여러 줄
`row-span-2` 는 `grid-row: span 2 / span 2` 를 만들어 아이템이 줄 두 개를 차지하게 한다.

```html
<div class="grid grid-cols-3 grid-rows-3 gap-4 bg-gray-200">
  <div class="bg-blue-500 p-4 row-span-2">2줄 차지</div>
  <div class="bg-red-500 p-4">1</div>
  <div class="bg-green-500 p-4">2</div>
  <div class="bg-yellow-500 p-4">3</div>
</div>
```

첫 아이템의 높이가 두 줄과 그 사이 간격(gap)을 더한 128px이 되었다.

`row-span-full` 은 `grid-row: 1 / -1` 을 만든다. `-1` 은 `grid-rows-*` 로 직접 정한 마지막 줄을 뜻하므로, 줄 수를 정하지 않은 그리드에서는 한 줄만 차지한다. `grid-rows-*` 없이 아이템 다섯 개를 넣어 재 보니 `row-span-full` 아이템의 높이가 한 줄 높이(56px)에 그쳤다. 모든 줄을 차지하게 하려면 `grid-rows-*` 로 줄 수를 먼저 정한다.

### col-span: 가로로 여러 칸
`col-span-2` 는 `grid-column: span 2 / span 2` 를 만들어 아이템이 열 두 개를 차지하게 한다. `col-span-full` 은 `grid-column: 1 / -1` 이고, 열은 보통 `grid-cols-*` 로 정해 두므로 한 줄 전체를 차지한다.

```html
<div class="grid grid-cols-3 gap-4 bg-gray-200">
  <div class="bg-blue-500 p-4 col-span-2">2칸 차지</div>
  <div class="bg-red-500 p-4">1</div>
  <div class="bg-green-500 p-4">2</div>
</div>
```

화면 크기에 따라 차지할 칸 수를 바꾸려면 반응형 접두사를 붙인다. 예를 들어 `col-span-3 md:col-span-1` 은 작은 화면에서는 세 칸 전체를, 중간 크기 이상에서는 한 칸을 차지한다.

<br/>

## 어떤 걸 쓸까
- 모든 아이템을 칸 가운데에 두려면 부모에 `place-items-center` 를 준다.
- 세로만 맞추고 가로는 칸을 채우게 두려면 부모에 `items-*` 를 준다.
- 몇 개만 다르게 두려면 그 아이템에 `self-*`, `justify-self-*`, `place-self-*` 를 준다.
- 아이템을 크게 만들려면 `row-span-*`, `col-span-*` 를 쓰고, `-full` 을 쓸 때는 줄이나 열 수가 정해져 있는지 확인한다.

<br/>

## 참고 자료
- [Tailwind CSS: align-items](https://tailwindcss.com/docs/align-items)
- [Tailwind CSS: grid-row](https://tailwindcss.com/docs/grid-row)
- [MDN: CSS 그리드 레이아웃의 상자 정렬](https://developer.mozilla.org/ko/docs/Web/CSS/CSS_grid_layout/Box_alignment_in_grid_layout)
- 확인한 환경은 tailwindcss 4.3.3(@tailwindcss/cli 4.3.3), Playwright 1.64.1의 headless Chromium 156.0.8078.4다. Tailwind v3에서는 확인하지 않았다

<br/>

## 더 볼 것 (TODO)
- 칸 묶음 전체를 옮기는 `content-*`, `justify-content` 와 칸 안 정렬의 차이
- `grid-flow-dense` 로 빈 칸 채우기
- flex에서의 같은 클래스 동작 비교
