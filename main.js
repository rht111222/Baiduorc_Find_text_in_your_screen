auto.waitFor();
const { Api, Secret, Text} = hamibot.env;
//console.show();
var height = device.height;
var width = device.width;
var curr_time = new Date();
var now_D = curr_time.getDay();
log("\n设备宽：" + width + "\n" + "设备高：" + height + "\n" + "手机型号：" + device.model + "\n安卓版本：" + device.release);
//设置脚本坐标点击所适合的屏幕宽高。
setScreenMetrics(width, height);
//请求截图权限
if (!requestScreenCapture()) {
    toast("请求截图失败");
    exit();
}
sleep(1000);

log(BaiDu_Ocr_FindWord(Text))
function BaiDu_Ocr_FindWord(str){
isClick=false
var imgScreen = captureScreen();//请求截取当前屏幕
var logOcr= Baidu_ocr(imgScreen);
// log(logOcr);
var wordResult=logOcr.words_result;
var count=0;
wordResult.forEach(function(w){
    if (w.words.indexOf(str) != -1) {
        log(w.words)
        //如果找到了就返回
        isClick=true
        return
        }
    })
return isClick
};

//调用百度文字识别ocr得到当前手机截屏文字
function Baidu_ocr(imgFile){
    log("调用百度ocr开始识图");
    var imag64 = images.toBase64(imgFile, "png", 100);//转换截屏图片
    var API_Key=Api;
    var Secret_Key=Secret;
    var getTokenUrl="https://aip.baidubce.com/oauth/2.0/token";
    var token_Res = http.post(getTokenUrl, {
        grant_type: "client_credentials",
        client_id: API_Key,
        client_secret: Secret_Key,
    });
    var token = token_Res.body.json().access_token;
  	var ocrUrl = "https://aip.baidubce.com/rest/2.0/ocr/v1/general"; //每天可用5000次。
  	var ocr_Res = http.post(ocrUrl, {
        headers: {
            "Content - Type": "application/x-www-form-urlencoded"
        },
        access_token: token,
        image: imag64,
    });
    var json = ocr_Res.body.json();
    //log(json);
    return json;
}
