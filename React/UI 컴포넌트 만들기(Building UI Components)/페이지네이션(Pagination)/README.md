## 페이지네이션이란 ?
- 많은 목록을 일정한 개수씩 페이지로 나눠 한 페이지씩 보여 주는 방식
- 현재 페이지 번호와 한 페이지당 항목 수로 보여 줄 범위를 계산하고, 페이지 번호 버튼으로 번호를 바꾼다
- 데이터를 모두 받아 클라이언트에서 자르는 방식과, 서버에 필요한 페이지만 요청하는 방식이 있다

### 페이지네이션 (Pagination)
사전적 의미는 책이나 문서에 쪽 번호를 매기는 일이다.
웹에서는 긴 목록을 쪽으로 나누고 쪽 번호로 이동하게 하는 UI를 말한다. 두꺼운 책을 한 번에 펼칠 수 없어 쪽 번호로 찾아가듯, 수백 개의 항목을 한 번에 그리지 않고 한 쪽씩 보여 준다.

<br/>

## 왜 필요할까
항목이 수백, 수천 개인 목록을 한 화면에 모두 그리면 화면이 길어져 원하는 항목을 찾기 어렵고, 그려야 할 요소가 많아 느려진다. 페이지로 나누면 한 번에 그리는 양이 일정해지고, 사용자는 몇 쪽에 있는지로 위치를 기억할 수 있다.

<br/>

## 어떻게 동작할까
상태로 두는 값은 현재 페이지 `currentPage` 하나다. 나머지는 이 값과 전체 데이터에서 계산한다.

- 총 페이지 수: `Math.ceil(전체 개수 / 페이지당 개수)`. 50개를 5개씩 나누면 10쪽, 51개면 11쪽이다
- 현재 페이지의 범위: 시작 위치는 `(currentPage - 1) * 페이지당 개수`, 끝은 시작에 페이지당 개수를 더한 곳이다. `slice(시작, 끝)` 로 잘라 낸다
- 번호 버튼을 누르면 `currentPage` 만 바꾸고, 잘라 내는 범위는 다시 렌더링할 때 새로 계산된다

<br/>

## 클라이언트에서 자르기
데이터를 이미 모두 가지고 있을 때 쓰는 방식이다.

```tsx
import { useState } from "react";

type PaginationProps = {
  items: string[];
  itemsPerPage: number;
};

export const Pagination = ({ items, itemsPerPage }: PaginationProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  // 총 페이지 수. 항목이 하나도 없어도 1페이지로 둔다
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  // 현재 페이지에 보여 줄 항목만 잘라 낸다
  const start = (currentPage - 1) * itemsPerPage;
  const pageItems = items.slice(start, start + itemsPerPage);

  return (
    <div>
      <ul>
        {pageItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div>
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          이전
        </button>
        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;
          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          다음
        </button>
      </div>
    </div>
  );
};

// 사용 예시
const App = () => {
  const dummyItems = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);
  return <Pagination items={dummyItems} itemsPerPage={5} />;
};

export default App;
```

React 19, TypeScript 5.6 `strict` 에서 타입 검사를 통과했고, jsdom에서 렌더링해 결과를 확인했다.

```text
50개, 5개씩: 번호 버튼 10개, 1쪽은 Item 1 ~ Item 5
10쪽: Item 46 ~ Item 50, 다음 버튼 비활성화
51개, 5개씩: 11쪽에 Item 51 하나
항목 0개: 1쪽 하나, 다음 버튼 비활성화
```

처음 코드에서 고친 부분은 아래와 같다.

- 데이터 타입을 `any[]` 에서 `string[]` 으로 바꿨다. 실제로는 항목 타입에 맞춰 바꾼다
- 목록의 `key` 를 배열 번호에서 항목 값으로 바꿨다. 페이지를 넘기면 같은 번호 자리에 다른 항목이 오므로, 번호를 `key` 로 쓰면 React가 다른 항목을 같은 것으로 착각할 수 있다. 실제 데이터라면 id를 쓴다
- 항목이 0개이면 총 페이지 수가 0이 되어, 다음 버튼이 활성화되고 누르면 0쪽으로 가는 문제가 있었다. `Math.max(1, ...)` 로 최소 1쪽을 두어 막았다
- 현재 페이지 버튼에 `aria-current="page"` 를 붙여 화면 낭독기(Screen Reader)가 지금 페이지를 알 수 있게 했다

<br/>

## 서버에서 나눠 받기 (Server-side Pagination)
데이터가 아주 많으면 모두 받아 오는 것부터 느리다. 이때는 서버에 페이지 번호와 개수를 보내고 그 페이지의 항목과 전체 개수만 받아 온다. 처음 노트에는 이 방식을 SSR이라고 적었는데, SSR(서버 사이드 렌더링)은 서버에서 HTML을 만들어 보내는 렌더링 방식이라 다른 개념이다. 이 방식은 서버 사이드 페이지네이션이라고 부르고, 화면은 클라이언트에서 그려도 된다. SSR은 [CSR과 SSR](../../../NextJS/CSR과%20SSR/README.md)에 정리했다.

```tsx
import { useEffect, useState } from "react";

type PageResponse = {
  items: string[];
  totalCount: number;
};

export const ServerPagination = ({ itemsPerPage }: { itemsPerPage: number }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<PageResponse>({ items: [], totalCount: 0 });

  useEffect(() => {
    let ignore = false; // 페이지를 빠르게 넘길 때 늦게 도착한 이전 응답을 버린다

    fetch(`/api/items?page=${currentPage}&limit=${itemsPerPage}`)
      .then((res) => res.json())
      .then((json: PageResponse) => {
        if (!ignore) setData(json);
      });

    return () => {
      ignore = true;
    };
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(data.totalCount / itemsPerPage));

  return (
    <div>
      <ul>
        {data.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
        이전
      </button>
      <span>
        {currentPage} / {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        다음
      </button>
    </div>
  );
};
```

`/api/items` 는 예시 주소이고, 서버가 `{ items, totalCount }` 모양으로 응답한다고 가정했다. 이 코드는 타입 검사만 했고 실제 서버에 붙여 실행하지는 않았다.

클라이언트에서 자를 때와 달라지는 점은 두 가지다. 총 페이지 수를 서버가 알려 준 전체 개수로 계산하고, 페이지가 바뀔 때마다 요청을 새로 보낸다. 요청이 늦게 도착하는 사이에 페이지를 또 넘기면 이전 응답이 나중에 와서 화면을 덮을 수 있어서, 정리 함수(cleanup function)에서 `ignore` 를 켜 이전 응답을 버린다.

예시를 짧게 하려고 로딩 표시와 요청 실패 처리는 넣지 않았다. 실제로는 요청 중 상태와 오류 상태를 함께 두고 화면에 보여 준다.

<br/>

## 더 볼 것 (TODO)
- 페이지 번호가 많을 때 앞뒤 몇 개만 보여 주고 줄임표로 생략하기
- 현재 페이지를 URL 쿼리(`?page=2`)에 두어 새로고침해도 유지하기
- React Query로 페이지별 응답 캐싱하기
- 무한 스크롤과 비교
- 항목이 줄어 총 페이지 수가 현재 페이지보다 작아졌을 때 현재 페이지를 마지막 페이지로 맞추기
