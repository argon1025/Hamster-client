import { download } from "./fileDownloader";
import { commandRun } from "./commandExec";

const io = require("socket.io-client");
const ip = require("ip");

class Client {
  IP: string = ip.address();

  public connectSocket: () => void = async () => {
    let socket = io.connect(
      "http://localhost:8828", //ec2-3-34-49-175.ap-northeast-2.compute.amazonaws.com
      {
        reconnectionAttempt: 3,
      }
    );
    socket = socket.connect();
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
      socket.emit("client_newClient", this.IP);
    });
    // 2. 대쉬보드가 요청 했을때 클라이언트의 정보 알려주기 on (client_getClientInfo)
    socket.on("client_getClientInfo", (dash_socketID) => {
      console.log("i'm joined", dash_socketID);
      socket.emit("client_setClientInfo", this.IP, dash_socketID);
    });
    socket.on("shutdown", async (dashboardID) => {
      console.log("shutdown");
      const result = await commandRun("shutdown -s -t 10");
      console.log(result);
      socket.emit(
        "client_logEvent",
        dashboardID,
        this.IP,
        socket.id,
        result.result
      );
    });
    socket.on("reboot", async (dashboardID) => {
      console.log("reboot");
      const result = await commandRun("shutdown -r -t 10");
      console.log(result);
      socket.emit(
        "client_logEvent",
        dashboardID,
        this.IP,
        socket.id,
        result.result
      );
    });
    socket.on("command", async (dashboardID, command) => {
      console.log("command");
      const clientID = this.IP.split(".")[3];
      const splitedCommand = command.replace("%ip", clientID);
      const resultCommand = await commandRun(splitedCommand);
      console.log(resultCommand);
      socket.emit(
        "client_logEvent",
        dashboardID,
        this.IP,
        socket.id,
        resultCommand.result
      );
    });
    socket.on("filedown", async (dashboardID, data) => {
      console.log("filedown");
      const result = await download(data, `${process.env.APPDATA}\\download`);
      socket.emit(
        "client_logEvent",
        dashboardID,
        this.IP,
        socket.id,
        result.result
      );
    });
  };
}

export default new Client();
