import { download } from "./fileDownloader";
import { commandRun } from "./commandExec";

const io = require("socket.io-client");
const ip = require("ip");

interface iClient {
  socket: object;
  isconnect: boolean;
}
class Client implements iClient {
  socket: any;
  isconnect: boolean;

  public connectSocket: () => void = async () => {
    let socket = io.connect("http://localhost:8080", {
      reconnectionAttempt: 3,
      // reconnection: false,
      // autoConnect: false,
    });
    socket = socket.connect();
    // socket.on("error", (error) => {
    //   console.log("error");
    //   console.log(socket.error); // true
    // });
    // socket.on("connect_error", (error) => {
    //   console.log("connect_error =>", error);
    //   socket.close(true);
    // });
    socket.on("disconnect", (reason) => {
      console.log(reason);
    });
    /**
     * 1. 클라이언트가 연결되었을때 대쉬에게 전달한 정보 emit (client_setClientInfo)
     * 2. 대쉬보드가 요청 했을때 클라이언트의 정보 알려주기 on (client_getClientInfo)
     */
    socket.on("connect", () => {
      console.log("conenc");
      // 1. 클라이언트가 연결되었을때 대쉬에게 전달한 정보 emit (client_setClientInfo)
      socket.emit("client_setClientInfo", ip.address());
    });
    // 2. 대쉬보드가 요청 했을때 클라이언트의 정보 알려주기 on (client_getClientInfo)
    socket.on("client_getClientInfo", ()=>{
      console.log("back clientinfo");
      socket.emit("client_setClientInfo", ip.address());
    })
    socket.on("shutdown", async () => {
      const result = await commandRun("shutdown -s -t 10");
      socket.emit("logEvent", result);
    });
    socket.on("reboot", async () => {
      const result = await commandRun("shutdown -r -t 10");
      socket.emit("logEvent", result);
    });
    socket.on("commnand", async (command) => {
      const result = await commandRun(command);
      socket.emit("logEvent", result);
    });
    socket.on("filedown", async (url) => {
      const result = await download(url, `${process.env.APPDATA}\\download`);
      socket.emit("logEvent", result);
    });
  };
}

export default new Client();
