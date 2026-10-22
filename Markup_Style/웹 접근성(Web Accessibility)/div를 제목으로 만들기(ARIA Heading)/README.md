## div나 p를 제목처럼 동작하게 만드는 예제
div나 p 태그에 ARIA 태그(aria-label, aria-labelledby, role="heading")를 사용하면 제목으로 지정할 수 있다.

하지만 올바른 접근성을 유지하려면 h1~h6 태그를 기본적으로 사용하는 것이 권장된다.

### role="heading" + aria-level 사용
```tsx
<div role="heading" aria-level="2">이것은 제목입니다</div>
<p role="heading" aria-level="3">이것은 제목입니다</p>
```
- aria-level → h1~h6처럼 레벨을 지정 가능 (h1 = 1, h2 = 2 …)
- Screen Reader 가 해당 요소를 제목처럼 읽어줌.

### aria-labelledby 사용
다른 요소를 참조하여 제목을 지정 가능
```tsx
<div id="title">이것은 제목입니다</div>
<p aria-labelledby="title">이 문장은 제목에 연결됨</p>
```
- aria-labelledby="id" → id 속성을 가진 요소를 제목처럼 참조
- p 태그는 직접 제목이 되지 않지만, 다른 요소를 제목으로 인식하게 함.

### aria-label 사용
스크린 리더용으로 제목을 부여할 수 있음 (눈에는 안 보임)
```tsx
<div aria-label="이것은 제목입니다">내용</div>
```
- aria-label 속성은 실제 텍스트가 없어도 제목으로 읽히게 만듦. 
- UI에서는 안 보이지만, 스크린 리더가 읽을 때만 작동.