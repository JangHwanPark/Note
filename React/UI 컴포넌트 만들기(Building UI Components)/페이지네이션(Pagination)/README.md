# 페이지네이션?
페이지네이션(Pagination)은 대량의 데이터를 여러 페이지로 나누어 표시하는 방식입니다.   
보통 클라이언트에서 다음과 같은 정보를 관리합니다.

- 현재 페이지 (currentPage)
- 한 페이지당 항목 수 (itemsPerPage)
- 전체 데이터 (data)
- 총 페이지 수 (totalPages)

## 페이지 네이션 동작 과정
- 사용자가 페이지를 이동할 때 currentPage 상태를 변경 
- currentPage와 itemsPerPage를 이용하여 필요한 데이터만 필터링 
- 필터링된 데이터만 렌더링 
- 페이지 번호 버튼을 클릭하면 currentPage를 업데이트하고, 다시 데이터를 필터링

```ts
import { useState } from "react";

const PaginationComponent = ({ data, itemsPerPage }: { data: any[], itemsPerPage: number }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // 현재 페이지에 맞는 데이터 필터링
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      {/* 데이터 출력 */}
      <ul>
        {paginatedData.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      {/* 페이지네이션 버튼 */}
      <div>
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          이전
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button key={index + 1} onClick={() => setCurrentPage(index + 1)}>
            {index + 1}
          </button>
        ))}
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          다음
        </button>
      </div>
    </div>
  );
};

// 사용 예시
const App = () => {
  const dummyData = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);

  return <PaginationComponent data={dummyData} itemsPerPage={5} />;
};

export default App;
```
- useState로 currentPage를 관리 
- slice를 사용해 itemsPerPage 만큼 데이터를 잘라서 보여줌
- <button> 클릭 시 setCurrentPage를 업데이트하여 페이지를 이동
- disabled 속성을 사용해 첫 페이지와 마지막 페이지에서 버튼 비활성화

### 서버 사이드 페이지네이션 (SSR)
위 예시는 클라이언트 사이드 페이지네이션 (CSR) 방식이며, 대량의 데이터를 다룰 때는 서버에서 필요한 데이터만 받아오는 방식 (API 요청 기반 페이지네이션) 을 사용해야 함.