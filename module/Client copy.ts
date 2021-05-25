import APIService from './APIService'
const io = require('socket.io-client');
//import * as io from "socket.io-client";

interface iClient {
  host: string
  version: string
  purge: Boolean
  socket: object
  isconnect: boolean
}

/**
 * flow
 * 1. 서버에 연결을 시도합니다.
 * 2. 서버에 연결이 되면 
 */
class Client implements iClient {
  host: string
  version: string
  purge: Boolean
  socket: any
  isconnect: boolean
  private sleep: (ms: number) => Promise<() => {}> = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  // AWS에서 설정값을 받아옵니다.
  public setState: () => void = async () => {
      await APIService.upDateState()
      this.host = await APIService.getHOST() || undefined;
      this.version = await APIService.getVERSION() || '1';
      this.purge = await APIService.getPURGE() || false;
  }
  // public makeConnect: () => any = async () => {
  //   while (!this.isconnect) {
  //     // console.log("A");
  //     await this.setState();
  //     // console.log("B");
  //     await this.ConnectSocket();
  //     // console.log("C");
  //     await this.communication();
  //     // console.log("D");
  //     await this.disConnect();
  //     // console.log("E");
  //     await this.shutDown();
  //     // console.log("F");
  //     await this.reBoot();
  //     // console.log("G");
  //     // 서버에 연결이 되지않으면 접속을 끊습니다.
  //     console.log(this.socket.disconnected);
  //     await this.sleep(1000)

  //     if (!this.isconnect) {
  //       console.log("접속 실패! - 초기화할꺼임")
  //       this.socket.disconnect(true)
  //     }
  //   }
  // }
  // 서버에 연결을 시도합니다.
  // 1. 서버에 성공적으로 접속함.
  // 2. 서버 접속 실패.
  public connectSocket: () => void = async () => {
    this.socket = await io.connect(this.host);
    await this.communication()

  }
  // 연결해제 이벤트
  // 1. 서버에 setState함수를 호출해 새로운 호스트를 찾습니다.
  public disConnect() {
    return new Promise((resolve) => {
      if (this.socket.connected) {
        this.socket.on("disconnect", () => {
          console.log("서버와 연결이 끊겼습니다.");
          this.isconnect = false
        })
      }
      resolve(true);
    })
  }
  // 서버에게 클라이언트 정보 전송
  public communication: () => void = () => {
    return new Promise((resolve) => {
      this.socket.on("get_userinfo", () => {
        this.isconnect = true;
        console.log("서버가 내정보 요청");
        this.socket.emit("set_userinfo", { "socketID": this.socket.id })
      })
      resolve(true)
    })
  }
  // shutdown command
  protected shutDown() {
    return new Promise((resolve) => {
      this.socket.on('shutdown', () => {
        console.log("shutdown명령받음");
      })
      resolve(true)
    })
  }
  // reboot command
  protected reBoot() {
    return new Promise((resolve) => {
      this.socket.on('reboot', () => {
        console.log("reboot명령받음");
      })
      resolve(true)
    })
  }

}

export default new Client;
