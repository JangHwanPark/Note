// 강의 시연용 클라이언트. 브라우저가 아니어도 요청을 보내면 클라이언트다.
// 실행: server.js를 켜 둔 상태에서 다른 터미널에서 node client.js
async function main() {
  const res = await fetch('http://localhost:8000/api/stores');
  console.log('상태 코드:', res.status);

  const stores = await res.json();
  for (const store of stores) {
    console.log(`${store.name} - ${store.menu} ${store.price}원`);
  }
}

main().catch(() => {
  console.log('서버에 연결할 수 없다. server.js가 켜져 있는지 확인하자.');
});
