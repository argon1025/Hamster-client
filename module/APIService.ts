import Axios from "axios";

// 싱글원
// 마지막 인터벌 버전 저장후 다른점이 없으면 업데이트 안함
class APIService {
  protected HOST: string = "";
  protected VERSION: string = "";
  protected PURGE: boolean;
  protected URL: string = "https://2w0pitlo9d.execute-api.ap-southeast-1.amazonaws.com/default/Hamstr-server";

  private sleep: (ms: number) => Promise<() => {}> = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  // 서버에서 새로운 상태정보를 불러옵니다
  // 실패시 설정된 인터벌 간격으로 재시도합니다
  public fetching: () => any = async () => {
    while (true) {
      try {
        console.log("request Data...");
        const response = await Axios.get(this.URL);
        console.log("Done!");
        return response.data;
      } catch (error) {
        console.error("request error retry...");
        await this.sleep(10000);
      }
    }
  };

  //상태를 업데이트 합니다
  public upDateState: () => {} = async () => {
    const result: { version: string; host: string; purge: string } =
      await this.fetching();
    console.log(result);

    // 기존 버전과 달라 상태 업데이트가 필요한 경우
    if (this.VERSION != result.version) {
      console.log("ENV Updating!");
      this.VERSION = result.version;
      this.HOST = result.host;
      this.PURGE = result.purge === 'true';
    } else {
      console.log("Now latestVersion.. NoUpdating");
    }
  };

  // 호스트
  public getHOST: () => string = () => {
    return this.HOST;
  };
  // 버전
  public getVERSION: () => string = () => {
    return this.VERSION;
  };
  // 퍼지 유무
  public getPURGE: () => boolean = () => {
    return this.PURGE;
  };
}

export default new APIService();
