# JS_Statistics
对页面进行用户行为收集统计
//Collect users' behaviours for backend using js

Update Log:
2017/08/10 : add BrowserInfo

这个简单插件会记录预设的class，当含有该class的dom节点被点击时会记录其id以及点击次数，同时会记录该用户的访问当前页面的时间，持续时间，当前页面的地址(纯URL和get参数分开统计)，上一个页面的地址(纯URL和get参数分开统计)，适应微信浏览器。

This js plugin will record the dom node's id and click times when it matches the preseted classnames. It also record the current Location(pure URL and get parameters), the last Location(pure URL and get parameters), the time when user visit and duration.This work good in Wechat Browser.

>usage:
```
//please do these as soon as document is loaded
var classNames = "btn";
var url = "domain/example";//the final ajax destination

//the ways of writing parameter follow is recommended 
//var classNames = ["btn"];
//var classNames = ["btn","btn-primary"];

var somename = new GlobalListener(classNames,url);
```
GlobalListener is a singleton so if you instantiate twice, you will get the same object.

It means:
```
var classNames = ["btn"];
var somename = new GlobalListener(classNames);
var somename2 = new GlobalListener(classNames);
somename == somename2;//return true
```
you can run ```GlobalListener.singleton.resultArray``` to check the statistics

an ajax event will be evoked when user click on link to go to other pages, refresh the pages or close the tags/Browser
the data will be posted in json string, and its content looks like this:
```json
{
  "lastLocation":{
    "baseUrl":"http://domain/test/js/",
    "parameter":""
   },
   "currLocation":{
    "baseUrl":"http://domain/test/js2/",
    "parameter":"xxx=asd&yyy=asd"
   },
   "startTimeStamp":1500447561495,
   "DateTime":"2017-07-19 14:59:21",
   "duration":3508,
   "click":{
    "id of dom":{
      "times":9
    }
   },
   "Browser":{
    "name":"Netscape",
    "version":"5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.78 Safari/537.36",
    "code":"Mozilla",
    "userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.78 Safari/537.36",
    "language":"zh-CN"
   }
 }
```
>notice:the duration and startTimeStamp is milliseconds.
