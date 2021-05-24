import APIService from './APIService'
const io = require('socket.io-client');

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
  constructor() {
    
  }
  private sleep: (ms: number) => Promise<() => {}> = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  // AWS에서 설정값을 받아옵니다.
  protected async setState() {
    await APIService.upDateState()
    this.host = await APIService.getHOST() || undefined;
    this.version = await APIService.getVERSION() || '1';
    this.purge = await APIService.getPURGE() || false;
    this.isconnect = false;
  }
  // shutdown command
  protected shutDown() {
    this.socket.on('shutdown', () => {
      console.log("shutdown명령받음");
    })
  }
  // reboot command
  protected reBoot() {
    this.socket.on('reboot', () => {
      console.log("reboot명령받음");
    })
  }

  public makeConnect: () => any = async () => {
    while (!this.isconnect) {
      console.log("?????");
      
      await this.setState();
      this.ConnectSocket();
      this.communication();
      this.disConnect();
      this.shutDown();
      this.reBoot();
      await this.sleep(20000)
      // 서버에 연결이 되지않으면 접속을 끊습니다.
      if (!this.isconnect) this.socket.disconnect()
    }
  }
  // 서버에 연결을 시도합니다.
  // 1. 서버에 성공적으로 접속함.
  // 2. 서버 접속 실패.
  public ConnectSocket() {
    this.socket = io.connect(this.host);
  }
  // 연결해제 이벤트
  // 1. 서버에 setState함수를 호출해 새로운 호스트를 찾습니다.
  public disConnect() {
    this.socket.on("disconnect", () => {
      console.log("서버와 연결이 끊겼습니다.");
      console.log("서버에 재연결 시도합니다..");
      this.isconnect = false
      this.makeConnect();
    })
  }
  // 서버에게 클라이언트 정보 전송
  public communication() {
    this.socket.on("get_userinfo", () => {
      this.isconnect = true;
      console.log("서버가 내정보 요청");
      this.socket.emit("set_userinfo", { "socketID": this.socket.id })
    })
  }
  // process.on('SIGINT', () => {
  //     process.exit(2);
  //   })
  // process.on('exit', function(){
  //     socket.emit("disconnection", "bye!\n bitcoin is good!");
  // });
}

export default Client;