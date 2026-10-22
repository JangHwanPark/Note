### CSS 세로정렬 하기

---

레이아웃을 잡거나 스타일링할때 자주 세로정렬을 자주 사용하지만, 방법이 너무 다양하기 때문에 조금씩 정리해보려 한다.


### <br>vertical-align 속성을 사용하여 세로 정렬하기

---
`vertical-align`속성을 사용하여 세로정렬을 할 수 있다. 하지만 가상 선택자 `before`를 추가해 빈 요소를 추가하는 방법을 사용한다.

이때 가상선택자의 높이는 부모 요소의 높이만큼 차지해야한다.

```html
<div style="height: 300px; margin-bottom: 1rem; border: 1px solid; text-align: center; position: relative;">
    <div style="display: inline-block; vertical-align: middle; height: 100%; width: 0; content: '';"></div>
    <div style="display: inline-block; vertical-align: middle;">
        vertical align (가상 선택자 사용 - before) 세로 정렬
    </div>
</div>
```

### <br>position 을 사용하여 세로 정렬하기

---
`position`속성과 `transform`속성을 사용하여 부모요소의 중앙에 위치시킬 수 있다.
만약 `transform`없이 `position`만 사용한다면 중앙정렬시 위치가 정확하게 중아에 위치하지 않을 수 있다.

```html
<div style="position: relative; height: 300px; border: 1px solid">
    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)">
        position 을 활용한 세로 정렬
    </div>
</div>
```

### <br>display flex 속성을 사용하여 세로 정렬하기

---
```html
<div style="display: flex; height: 300px; margin-bottom: 1rem; align-items: center; border: 1px solid">
    <div>display flex 세로 정렬</div>
</div>
```

### <br>grid 를 사용하여 세로 정렬하기

---
```html
<div style="display: grid; height: 300px; margin-bottom: 1rem; border: 1px solid; align-items: center; justify-content: center">
    <div>그리드 세로 정렬</div>
</div>
```

### <br>line-height 를 사용하여 세로 정렬하기

---
line-height 높이를 웹 높이와 동일하게 설정하면 세로 정렬이 가능하다.

```html
<div style="height: 300px; margin-bottom: 1rem; line-height: 300px; border: 1px solid; text-align: center">
    line-height 세로 정렬
</div>
```

### <br>Tailwind로 버튼을 세로 정중앙에 두기

---
캐러셀의 이전, 다음 버튼처럼 슬라이드 위에 띄운 버튼을 세로 정중앙에 둘 때는 위의 `position` 방식을 Tailwind 클래스로 쓰면 된다.

```html
<div class="relative h-[300px] border">
    <div class="absolute top-1/2 left-0 w-full flex justify-between -translate-y-1/2">
        <button>이전</button>
        <button>다음</button>
    </div>
</div>
```

`top-1/2` 는 요소의 윗변을 부모 높이의 50% 위치로 내린다. 이대로면 요소의 윗변이 가운데에 오므로, `-translate-y-1/2` 로 자기 높이의 50%만큼 다시 올려 요소의 가운데를 부모의 가운데에 맞춘다. `absolute` 는 `position` 이 지정된 가장 가까운 조상을 기준으로 자리를 잡으므로, 기준이 될 부모에 `relative` 를 준다.

Tailwind v3부터는 `-translate-y-1/2` 만 써도 이동이 적용된다. v2에서는 `transform` 클래스를 함께 붙여야 했다.