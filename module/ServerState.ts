import APIService from './APIService'
interface iServerState {
    host: string
    version: string
    purge: Boolean
  }
class ServerState {
    protected host: string
    protected version: string
    protected purge: Boolean

    public getState: () => void = async () => {
      await APIService.upDateState()
      this.host = await APIService.getHOST() || undefined;
      this.version = await APIService.getVERSION() || '1';
      this.purge = await APIService.getPURGE() || false;
    }

    public getHonst() : string {
      return this.host
    }
    public getversion() : string {
      return this.version
    }
    public getPurge() : Boolean {
      return this.purge
    }

}

export default new ServerState;
