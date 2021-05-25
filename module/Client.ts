import APIService from './APIService'
import ServerState from "./ServerState";
import { ipcMain } from 'electron';
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
        console.log(socket.connected); // true
        console.log(socket.id);
      });
      socket.on("get_userinfo", () => {
        console.log("서버가 내정보 요청");
        socket.emit("set_userinfo", { "socketID": socket.id })
      });
      socket.on("shutdown", ()=>{
        console.log("shutdown");
      })
      socket.on("reboot", ()=>{
        console.log("reboot");
      })
    });
  }
}

export default new Client;
