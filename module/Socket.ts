const io = require('socket.io-client');

// autoConnect 서버와 연결 해제시 대기
// reconnection 처음 커넥션을 만들때 재시도 할지
let socket = io.connect("http://192.168.0.3:8484",{reconnectionAttempt:3,reconnection:false,autoConnect:false});

socket = socket.connect();

socket.on("error", () => {
  console.log("error");
  console.log(socket.error); // true
});
socket.on("connect", () => {
  console.log("conenc");
  console.log(socket.connected); // true
  console.log(socket.id);
});
// 연결 끊겼을때 에러
socket.on("disconnect", (reason) => { 
  console.log(reason);
  socket.connect();
});
// 처음 연결 실패 에러
socket.on("connect_error", (error) => {
  console.log(error);
  
});

socket.on("get_userinfo", () => {
    console.log("서버가 내정보 요청");
});

socket.emit("set_userinfo", { "socketID": socket.id })