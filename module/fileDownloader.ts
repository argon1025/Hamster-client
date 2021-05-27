import * as Downloader from "nodejs-file-downloader";
import * as Zip from "adm-zip";

async function download(url: string, directory: string) {
  try {
    let downloader = new Downloader({
      url: url,
      directory: directory, // 폴더가 존재하지 않으면 새로 만듭니다
      cloneFiles: false, // 이미 파일이름이 존재한다면 기존파일 이름에 숫자를 새기고 해당 다운로드 파일의 이름은 유지합니다
    });
    // 다운로드 시작
    await downloader.download();
    // 다운로드받은 파일이 압축 파일일 경우
    if (url.search(".zip") != -1) {
      console.log("파일이 압축파일입니다.");
      await zipFile(url, directory);
    }
      console.log("Download Done");
      return {result: "파일 다운로드 완료!"}
  } catch (error) {
    //IMPORTANT: Handle a possible error. An error is thrown in case of network errors, or status codes of 400 and above.
    //Note that if the maxAttempts is set to higher than 1, the error is thrown only if all attempts fail.
    console.log("Download failed", error);
    return {result: error}
  }
}

// zip 파일이 있는 경로를 string형식으로 만들고 리턴합니다
function getZipDir(url: string, directory: string): string {
  // URL에서 파일 추출을 위해 / 기준으로 스플릿
  let dir: string[] | string = url.split("/");
  // 맨 끝에 있는 파일명을 저장
  dir = dir[dir.length - 1];
  // 다운로드 폴더경로 + 파일이름
  dir = `${directory}/${dir}`;

  return dir;

}
async function zipFile(url: string, directory: string) {
  try {
    const zipDir = getZipDir(url, directory);
    console.log(directory);
    let zip = new Zip(zipDir);
    // 지정 경로에 압축을 풉니다, 파일이 있을경우 덮어 씌웁니다
    zip.extractAllTo(directory, true);
    console.log("압축 해제 성공!");
  } catch (error) {
    throw new Error("압축해제 실패"+error);
  }
}

//download("https://trex-miner.com/download/t-rex-0.20.3-win.zip","/Users/leeseongrok/Desktop/Project/Hamster/Hamster-client/test");

export { download };