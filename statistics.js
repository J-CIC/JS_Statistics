//constructor parameter ia an Array
function GlobalListener(targetNames,url){
  //singleton
  if(typeof GlobalListener.singleton != "undefined"){
    return GlobalListener.singleton;
  }
  GlobalListener.singleton = this;
  //return current DateTime
  this.getFormatDateTime = function(){
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds()
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (hour >= 1 && hour <= 9) {
        hour = "0" + hour;
    }
    if (minute >= 1 && minute <= 9) {
        minute = "0" + minute;
    }
    if (second >= 1 && second <= 9) {
        second = "0" + second;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + hour + seperator2 + minute
            + seperator2 + second;
    return currentdate;
  }
  //parameter data is an Array
  this.ajax = function(options) {
    options.dataType = "json";
    var params = JSON.stringify(options.data);

    //创建 - 非IE6 - 第一步
    if (window.XMLHttpRequest) {
      var xhr = new XMLHttpRequest();
    } else { //IE6及其以下版本浏览器
      var xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }

    //接收 - 第三步
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        var status = xhr.status;
        if (status >= 200 && status < 300) {
          options.success && options.success(xhr.responseText, xhr.responseXML);
        } else {
          options.fail && options.fail(status);
        }
      }
    }
    //连接 和 发送 - 第二步
    xhr.open("POST", options.url, false);
    //设置表单提交时的内容类型
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhr.send(params);

    //格式化参数
    function formatParams(data) {
      var arr = [];
      for (var name in data) {
        arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
      }
        arr.push(("v=" + Math.random()).replace(".",""));
      return arr.join("&");
    }
  }

  //property
  this.targetNames = targetNames;
  this.url = url;
  this.resultArray = {};
  this.resultArray['lastLocation'] = {
    baseUrl:document.referrer.split("?")[0],
    parameter:typeof document.referrer.split("?")[1]=="undefined" ? "" : document.referrer.split("?")[1],
  }
  this.resultArray['currLocation'] = {
    baseUrl:window.location.href.split("?")[0],
    parameter:typeof window.location.href.split("?")[1]=="undefined" ? "" : window.location.href.split("?")[1],
  }
  this.resultArray["startTimeStamp"] = (new Date()).valueOf();//millisecond
  this.resultArray["DateTime"] = this.getFormatDateTime();
  this.resultArray["duration"] = 0;
  this.resultArray["click"] = new Object();

  //addListener to Global and check wether the class name is targetName for each click event
  window.addEventListener("click", function(e){
    var element = e.target;
    //check if the class name is null
    if(!element.getAttribute("class")){
      return ;
    }
    var classNameArr = element.getAttribute("class").split(" ");
    for(var i in classNameArr){
      if(classNameArr[i]==" "||classNameArr[i]==""){
        return ;
      }
      //check if the arguments is an array(typeof object) or only string
      if(typeof targetNames=="object"){
        for(var j in targetNames){
          if(classNameArr[i]==targetNames[j]){
            //record something
            if(typeof GlobalListener.singleton.resultArray["click"][element.getAttribute("id")]=="undefined"){
              GlobalListener.singleton.resultArray["click"][element.getAttribute("id")]={"time":1}
            }else{
              GlobalListener.singleton.resultArray["click"][element.getAttribute("id")].time++;
            }
            return;
            // console.log("match:"+targetNames[j])
          }
        }
      }else if(typeof targetNames=="string"){
        if(classNameArr[i]==targetNames){
          //record something
          if(typeof GlobalListener.singleton.resultArray["click"][element.getAttribute("id")]=="undefined"){
            GlobalListener.singleton.resultArray["click"][element.getAttribute("id")]={"times":1}
          }else{
            GlobalListener.singleton.resultArray["click"][element.getAttribute("id")].times++;
          }
          // console.log("match:"+targetNames[j])
        }
      }
    }
  });
  //record data and do ajax when turn to other links or close the window 
  this.recordStatistics = function(event){
    console.log(GlobalListener.singleton.resultArray)
    GlobalListener.singleton.resultArray["duration"] = (new Date()).valueOf() - GlobalListener.singleton.resultArray["startTimeStamp"];//millisecond
    GlobalListener.singleton.ajax({
      url:GlobalListener.singleton.url,
      data:{
        data:GlobalListener.singleton.resultArray,
      },
      success:function(responseText){
        // console.log(responseText)
      },
      fail:function(status){
        // console.log(status)
      }
    });
  }

  window.addEventListener("pagehide",this.recordStatistics)

  // window.onbeforeunload = this.recordStatistics //this work on chrome but not work on wechat browser
  // document.addEventListener('visibilitychange',this.recordStatistics) //this only work when browser is closed
}