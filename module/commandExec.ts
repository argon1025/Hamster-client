import * as child_process from "child_process";
//var iconv = require('iconv-lite');


// 출처: https://118k.tistory.com/236 [개발자로 살아남기
//첫번째 인자는 에러객체이고 stdout은 명령출력결과, stderr는 명령에러출력
function run(cmds: string) {
    return new Promise((resolve):void => {
		child_process.exec(`chcp 65001 | ${cmds}`,{ encoding: 'utf-8',windowsHide:true }, (error, stdout, stderr) => {
            let result:string="";
            
            // 모듈 에러 발생
			if (error) {
				console.log(error)
				result = "failedExecute";
			}
            // 명령 실행 에러
            if(stderr){
                console.log(stderr);
                result = "failedExecute";
            }
            // 명령 실행 완료
            if(stdout){
                //console.log(stdout);
                //console.log(iconv.decode(stdout, 'euc-kr'));
                result = stdout;
            }

			resolve(result);
		},
        );
	});
}


async function commandRun(cmds:string) {
    console.log("running [" + cmds + "]");
    const result = await run(cmds);
    return {result: result}
}

export {commandRun};