## Tailwind CSS 그리드 세로 정렬 방법 (Vertical Alignment in Grid)
✅ 1. place-items - 전체 아이템 세로 정렬
place-items-{align}을 사용하면 그리드 내부의 모든 아이템을 세로 방향으로 정렬할 수 있습니다.

▶ 예제: 아이템을 세로 가운데 정렬
tsx
복사
편집
<div className="grid grid-cols-3 h-64 place-items-center bg-gray-200">
  <div className="bg-blue-500 p-4">1</div>
  <div className="bg-red-500 p-4">2</div>
  <div className="bg-green-500 p-4">3</div>
</div>
✅ place-items-center → 모든 아이템을 가로/세로 중앙 정렬

📌 다른 정렬 옵션

클래스	설명
place-items-start	세로 방향 위쪽 정렬
place-items-center	세로 방향 중앙 정렬
place-items-end	세로 방향 아래 정렬
✅ 2. items-{align} - 특정 행의 세로 정렬
만약 각 행(row) 전체의 세로 정렬을 조정하고 싶다면 items-{align}을 사용하면 됩니다.

▶ 예제: 세로 정렬 방식 비교
tsx
복사
편집
<div className="grid grid-cols-3 h-64 items-end bg-gray-200">
  <div className="bg-blue-500 p-4">1</div>
  <div className="bg-red-500 p-4">2</div>
  <div className="bg-green-500 p-4">3</div>
</div>
✅ items-end → 아이템들이 아래쪽으로 정렬됨

📌 다른 정렬 옵션

클래스	설명
items-start	세로 방향 위쪽 정렬
items-center	세로 방향 중앙 정렬
items-end	세로 방향 아래 정렬
✅ 3. place-self - 특정 아이템만 세로 정렬
그리드 내에서 각 아이템을 개별적으로 세로 정렬하고 싶다면 place-self-{align}을 사용하면 됩니다.

▶ 예제: 특정 아이템만 정렬
tsx
복사
편집
<div className="grid grid-cols-3 h-64 bg-gray-200">
  <div className="bg-blue-500 p-4 place-self-start">위</div>
  <div className="bg-red-500 p-4 place-self-center">가운데</div>
  <div className="bg-green-500 p-4 place-self-end">아래</div>
</div>
✅ place-self-start, place-self-center, place-self-end → 각각 개별 정렬됨

📌 다른 정렬 옵션

클래스	설명
place-self-start	특정 아이템을 위쪽 정렬
place-self-center	특정 아이템을 중앙 정렬
place-self-end	특정 아이템을 아래 정렬
✅ 4. align-self - 특정 아이템을 수직 정렬
align-self-{align}을 사용하면 특정 아이템의 세로 정렬을 개별적으로 조정할 수 있습니다.

▶ 예제: 개별 아이템 정렬
tsx
복사
편집
<div className="grid grid-cols-3 h-64 items-center bg-gray-200">
  <div className="bg-blue-500 p-4 align-self-start">위</div>
  <div className="bg-red-500 p-4 align-self-center">가운데</div>
  <div className="bg-green-500 p-4 align-self-end">아래</div>
</div>
✅ align-self-start, align-self-center, align-self-end → 개별적으로 위치 조정 가능

📌 다른 정렬 옵션

클래스	설명
align-self-start	특정 아이템을 위쪽 정렬
align-self-center	특정 아이템을 중앙 정렬
align-self-end	특정 아이템을 아래 정렬
✅ 5. row-span을 활용한 세로 확장
만약 특정 아이템을 세로로 확장하고 싶다면 row-span-{n}을 사용할 수 있습니다.

▶ 예제: 특정 아이템 세로 확장
tsx
복사
편집
<div className="grid grid-cols-3 grid-rows-3 gap-4 bg-gray-200">
  <div className="bg-blue-500 p-4 row-span-2">2줄 차지</div>
  <div className="bg-red-500 p-4">1</div>
  <div className="bg-green-500 p-4">2</div>
  <div className="bg-yellow-500 p-4">3</div>
</div>
✅ row-span-2 → 세로로 2줄을 차지함

📌 다른 확장 옵션

클래스	설명
row-span-2	2줄 차지
row-span-3	3줄 차지
row-span-full	가능한 모든 줄 차지
🎯 정리 (어떤 걸 써야 할까?)
✔ place-items-{align} → 전체 아이템 정렬
✔ items-{align} → 한 줄(row) 전체 정렬
✔ place-self-{align} → 개별 아이템 정렬
✔ align-self-{align} → 아이템별 세로 정렬 조정
✔ row-span-{n} → 특정 아이템 세로 확장

## Tailwind CSS에서 그리드 아이템을 가로 정렬하는 방법 (Horizontal Alignment in Grid)
✅ 1. place-items - 전체 아이템 가로 정렬
place-items-{align}을 사용하면 그리드 내 모든 아이템을 가로 방향으로 정렬할 수 있습니다.

▶ 예제: 아이템을 가로 가운데 정렬
tsx
복사
편집
<div className="grid grid-cols-3 h-64 place-items-center bg-gray-200">
  <div className="bg-blue-500 p-4">1</div>
  <div className="bg-red-500 p-4">2</div>
  <div className="bg-green-500 p-4">3</div>
</div>
✅ place-items-center → 모든 아이템이 가로/세로 중앙 정렬됨

📌 다른 정렬 옵션

클래스	설명
place-items-start	가로 왼쪽 정렬
place-items-center	가로 중앙 정렬
place-items-end	가로 오른쪽 정렬
✅ 2. justify-items - 특정 열(column)의 가로 정렬
그리드 내에서 각 열의 가로 정렬을 조정하고 싶다면 justify-items-{align}을 사용하면 됩니다.

▶ 예제: 그리드 열(column) 내 아이템 가로 정렬
tsx
복사
편집
<div className="grid grid-cols-3 h-64 justify-items-center bg-gray-200">
  <div className="bg-blue-500 p-4">왼쪽</div>
  <div className="bg-red-500 p-4">가운데</div>
  <div className="bg-green-500 p-4">오른쪽</div>
</div>
✅ justify-items-center → 각 열의 아이템이 가운데 정렬됨

📌 다른 정렬 옵션

클래스	설명
justify-items-start	가로 왼쪽 정렬
justify-items-center	가로 중앙 정렬
justify-items-end	가로 오른쪽 정렬
✅ 3. place-self - 특정 아이템만 가로 정렬
특정 아이템 하나만 가로 정렬하고 싶다면 place-self-{align}을 사용하면 됩니다.

▶ 예제: 특정 아이템만 가로 정렬
tsx
복사
편집
<div className="grid grid-cols-3 h-64 bg-gray-200">
  <div className="bg-blue-500 p-4 place-self-start">왼쪽</div>
  <div className="bg-red-500 p-4 place-self-center">가운데</div>
  <div className="bg-green-500 p-4 place-self-end">오른쪽</div>
</div>
✅ place-self-start, place-self-center, place-self-end → 각각 개별 정렬됨

📌 다른 정렬 옵션

클래스	설명
place-self-start	특정 아이템을 왼쪽 정렬
place-self-center	특정 아이템을 가운데 정렬
place-self-end	특정 아이템을 오른쪽 정렬
✅ 4. justify-self - 특정 아이템을 개별 정렬
justify-self-{align}을 사용하면 개별 아이템의 가로 정렬을 설정할 수 있습니다.

▶ 예제: 개별 아이템 정렬
tsx
복사
편집
<div className="grid grid-cols-3 h-64 justify-items-center bg-gray-200">
  <div className="bg-blue-500 p-4 justify-self-start">왼쪽</div>
  <div className="bg-red-500 p-4 justify-self-center">가운데</div>
  <div className="bg-green-500 p-4 justify-self-end">오른쪽</div>
</div>
✅ justify-self-start, justify-self-center, justify-self-end → 각각 개별적으로 위치 조정 가능

📌 다른 정렬 옵션

클래스	설명
justify-self-start	특정 아이템을 왼쪽 정렬
justify-self-center	특정 아이템을 가운데 정렬
justify-self-end	특정 아이템을 오른쪽 정렬
✅ 5. col-span을 활용한 가로 확장
특정 아이템을 가로로 확장하고 싶다면 col-span-{n}을 사용할 수 있습니다.

▶ 예제: 특정 아이템 가로 확장
tsx
복사
편집
<div className="grid grid-cols-3 gap-4 bg-gray-200">
  <div className="bg-blue-500 p-4 col-span-2">2칸 차지</div>
  <div className="bg-red-500 p-4">1</div>
  <div className="bg-green-500 p-4">2</div>
</div>
✅ col-span-2 → 가로로 2칸을 차지함

📌 다른 확장 옵션

클래스	설명
col-span-2	2칸 차지
col-span-3	3칸 차지
col-span-full	가능한 모든 칸 차지
🎯 정리 (어떤 걸 써야 할까?)
✔ place-items-{align} → 전체 아이템 정렬 (가로+세로)
✔ justify-items-{align} → 각 열(column) 내 정렬
✔ place-self-{align} → 개별 아이템 정렬
✔ justify-self-{align} → 개별 아이템 가로 정렬
✔ col-span-{n} → 특정 아이템 가로 확장

## 추천 사용법
✅ 전체 아이템 가로 정렬 → place-items-center
✅ 개별 아이템 가로 정렬 → justify-self-center
✅ 아이템 하나만 가로 확장 → col-span-2
✅ 모바일에서는 col-span-12로 자동 조정 가능