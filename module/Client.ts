import { download } from './fileDownloader';
import { commandRun } from './commandExec';

const io = require('socket.io-client');

interface iClient {
  socket: object
  isconnect: boolean
}
class Client implements iClient {
  socket: any
  isconnect: boolean

  public makeSocket: (host: string) => void = async (host: string) => {
    return new Promise((resolve, rejects) => {
      let socket = io.connect(host, {
        reconnectionAttempt: 3,
        reconnection: false,
        autoConnect: false,
      });
      socket = socket.connect();
      socket.on("error", (error) => {
        console.log("error");
        console.log(socket.error); // true
        rejects(error);
      });
      socket.on("connect_error", (error) => {
        console.log("ce");
        socket.close(true);
        rejects(error);
      });
      socket.on("disconnect", (reason) => {
        console.log(reason);
        socket.close(true);
        rejects(reason);
      });
      socket.on("connect", () => {
        console.log("conenc");
        socket.emit("set_userinfo", { "socketID": socket.id })
      });
      socket.on("shutdown", ()=>{
        commandRun("echo shutdown")
      })
      socket.on("reboot", ()=>{
        commandRun("echo reboot")
      })
      socket.on("filedown", result =>{
        download(result, "./download")
      })
      socket.on("commnand", result =>{
        commandRun("echo commnand" + result)
      })
    });
  }
}

export default new Client;
