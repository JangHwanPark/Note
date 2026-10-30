// 강의 시연용 서버. 외부 패키지 없이 Node.js 기본 http 모듈만 쓴다.
// 실행: node server.js  (Node.js 18 이상)
const http = require('http');
const crypto = require('crypto');

const PORT = 8000;

// 데이터베이스(창고) 역할을 하는 배열
const stores = [
  { id: 1, name: '바삭치킨', menu: '후라이드', price: 18000 },
  { id: 2, name: '양념명가', menu: '양념치킨', price: 19000 },
  { id: 3, name: '간장한마리', menu: '간장치킨', price: 20000 },
];

// 로그인 번호표(세션 ID)와 사용자 이름을 묶어 두는 보관소
const sessions = {};

function getCookie(req, key) {
  const cookie = req.headers.cookie || '';
  const found = cookie.split('; ').find((item) => item.startsWith(key + '='));
  return found ? found.split('=')[1] : null;
}

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  console.log(`[요청] ${req.method} ${decodeURIComponent(url.pathname + url.search)}`);

  // 1. 첫 화면: HTML 응답
  if (url.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <h1>치킨 주문 서버</h1>
      <ul>
        <li><a href="/api/stores">가게 목록 (JSON)</a></li>
        <li><a href="/login?name=철수">철수로 로그인</a></li>
        <li><a href="/me">내가 누구인지 확인</a></li>
        <li><a href="/menu/pizza">없는 페이지 (404)</a></li>
      </ul>
    `);
    return;
  }

  // 2. 데이터만 주는 API: 서버가 창고(stores)에서 꺼내 JSON으로 응답
  if (url.pathname === '/api/stores') {
    sendJson(res, 200, stores);
    return;
  }

  // 3. 로그인: 서버가 번호표를 만들어 쿠키로 건넨다
  if (url.pathname === '/login') {
    const name = url.searchParams.get('name') || '손님';
    const sessionId = crypto.randomUUID();
    sessions[sessionId] = name;
    console.log(`  번호표 발급: ${sessionId} -> ${name}`);
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Set-Cookie': `sessionId=${sessionId}; HttpOnly; Path=/`,
    });
    res.end(`<p>${name}님 로그인 완료. <a href="/me">내 정보 보기</a></p>`);
    return;
  }

  // 4. 내 정보: 서버는 기억하지 않고 매번 번호표를 보고 찾는다
  if (url.pathname === '/me') {
    const sessionId = getCookie(req, 'sessionId');
    console.log(`  받은 번호표: ${sessionId}`);
    const name = sessions[sessionId];
    if (!name) {
      sendJson(res, 401, { message: '번호표가 없어요. 먼저 로그인하세요.' });
      return;
    }
    sendJson(res, 200, { name });
    return;
  }

  // 5. 메뉴판에 없는 주문
  sendJson(res, 404, { message: '그런 메뉴는 없어요.' });
});

server.listen(PORT, () => {
  console.log(`서버가 켜졌다. 요청을 기다리는 중: http://localhost:${PORT}`);
});
