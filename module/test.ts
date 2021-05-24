function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function testLogic() {
    while(true){
        await sleep(2000);
        console.log("hello!")
    }
}
export default testLogic;