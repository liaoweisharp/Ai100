
       
Date.prototype.pattern=function(fmt) {        
    var o = {        
    "M+" : this.getMonth()+1, //月份        
    "d+" : this.getDate(), //日        
    "h+" : this.getHours() == 0 ? 12 : this.getHours(), //小时        
    "H+" : this.getHours(), //小时        
    "m+" : this.getMinutes(), //分        
    "s+" : this.getSeconds(), //秒        
    "q+" : Math.floor((this.getMonth()+3)/3), //季度        
    "S" : this.getMilliseconds() //毫秒        
    };        
    var week = {        
    "0" : "\u65e5",        
    "1" : "\u4e00",        
    "2" : "\u4e8c",        
    "3" : "\u4e09",        
    "4" : "\u56db",        
    "5" : "\u4e94",        
    "6" : "\u516d"       
    };        
    if(/(y+)/.test(fmt)){        
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));        
    }        
    if(/(E+)/.test(fmt)){        
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")+week[this.getDay()+""]);        
    }        
    for(var k in o){        
        if(new RegExp("("+ k +")").test(fmt)){        
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));        
        }        
    }        
    return fmt;
}
Date.prototype.add=function(interval,number){
/// <summary>日期型数据加/减</summary>
/// <param name="interval" type="String">需要加/减的部分（如年"y",日"d"...）</param>
/// <param name="number" type="Number">需要加/减的数值</param>
/// <returns type="Object" />
    var date=new Date();
    switch(interval.toLowerCase()){   
        case "y": date= new Date(this.setFullYear(this.getFullYear()+number));   break;
        case "m": date= new Date(this.setMonth(this.getMonth()+number));   break;
        case "d": date= new Date(this.setDate(this.getDate()+number));   break;
        case "w": date= new Date(this.setDate(this.getDate()+7*number));   break;
        case "h": date= new Date(this.setHours(this.getHours()+number));   break;
        case "n": date= new Date(this.setMinutes(this.getMinutes()+number));   break;
        case "s": date= new Date(this.setSeconds(this.getSeconds()+number));   break;
        case "l": date= new Date(this.setMilliseconds(this.getMilliseconds()+number));   break;
    }   
    return date;
}
 
 
 //var regexp;

Date.parseFormat = function (dateString, formatString)
{
    /// <summary>字符串转日期类型</summary>
    /// <param name="dateString" type="String">日期字符串(如："2012-08-07 08:07:06")</param>
    /// <param name="formatString" type="String">指定的日期字符串格式(如："yyyy-MM-dd HH:mm:ss")</param>
    if (Date.validateDate(dateString, formatString))
    {
        var now = new Date();
        var vals = Date.regexp.exec(dateString);
        var index = Date.validateIndex(formatString);
        var year = index[0] >= 0 ? vals[index[0] + 1] : now.getFullYear();
        var month = index[1] >= 0 ? (vals[index[1] + 1] - 1) : now.getMonth();
        var day = index[2] >= 0 ? vals[index[2] + 1] : now.getDate();
        var hour = index[3] >= 0 ? vals[index[3] + 1] : "";
        var minute = index[4] >= 0 ? vals[index[4] + 1] : "";
        var second = index[5] >= 0 ? vals[index[5] + 1] : "";

        var validate;

        if (hour == "")
            validate = new Date(year, month, day);
        else
            validate = new Date(year, month, day, hour, minute, second);

        if (validate.getDate() == day) return validate;

    }
    return null;
}
 
 
 Date.validateDate=function(dateString, formatString){
 var dateString = Date.trim(dateString);
 if (dateString == "") return;
 /** year : /yyyy/ */
 var y4 = "([0-9]{4})";
 /** year : /yy/ */
 var y2 = "([0-9]{2})";
 /** index year */
 var yi = -1;

 /** month : /MM/ */
 var M2 = "(0[1-9]|1[0-2])";
 /** month : /M/ */
 var M1 = "([1-9]|1[0-2])";
 /** index month */
 var Mi = -1;

 /** day : /dd/ */
 var d2 = "(0[1-9]|[1-2][0-9]|30|31)";
 /** day : /d/ */
 var d1 = "([1-9]|[1-2][0-9]|30|31)";
 /** index day */
 var di = -1;

 /** hour : /HH/ */
 var H2 = "([0-1][0-9]|20|21|22|23)";
 /** hour : /H/ */
 var H1 = "([0-9]|1[0-9]|20|21|22|23)";
 /** index hour */
 var Hi = -1;

 /** minute : /mm/ */
 var m2 = "([0-5][0-9])";
 /** minute : /m/ */
 var m1 = "([0-9]|[1-5][0-9])";
 /** index minute */
 var mi = -1;

 /** second : /ss/ */
 var s2 = "([0-5][0-9])";
 /** second : /s/ */
 var s1 = "([0-9]|[1-5][0-9])";
 /** index month */
 var si = -1;
 var reg = formatString;
 reg = reg.replace(/yyyy/, y4);
 reg = reg.replace(/yy/, y2);
 reg = reg.replace(/MM/, M2);
 reg = reg.replace(/M/, M1);
 reg = reg.replace(/dd/, d2);
 reg = reg.replace(/d/, d1);
 reg = reg.replace(/HH/, H2);
 reg = reg.replace(/H/, H1);
 reg = reg.replace(/mm/, m2);
 reg = reg.replace(/m/, m1);
 reg = reg.replace(/ss/, s2);
 reg = reg.replace(/s/, s1);
 reg = new RegExp("^"+reg+"$");
 Date.regexp = reg;
 return reg.test(dateString);
 }

Date.validateIndex=function(formatString)
{
 
 var ia = new Array();
 var i = 0;
 yi = formatString.search(/yyyy/);
 if ( yi < 0 ) yi = formatString.search(/yy/);
 if (yi >= 0) {
 ia[i] = yi;
 i++;
 }
 
 Mi = formatString.search(/MM/);
 if ( Mi < 0 ) Mi = formatString.search(/M/);
 if (Mi >= 0) {
 ia[i] = Mi;
 i++;
}
 
 di = formatString.search(/dd/);
 if ( di < 0 ) di = formatString.search(/d/);
 if (di >= 0) {
 ia[i] = di;
 i++;
 }
 
 Hi = formatString.search(/HH/);
 if ( Hi < 0 ) Hi = formatString.search(/H/);
 if (Hi >= 0) {
 ia[i] = Hi;
 i++;
 }
 
 mi = formatString.search(/mm/);
 if ( mi < 0 ) mi = formatString.search(/m/);
 if (mi >= 0) {
 ia[i] = mi;
 i++;
 }
 
 si = formatString.search(/ss/);
 if ( si < 0 ) si = formatString.search(/s/);
 if (si >= 0) {
 ia[i] = si;
 i++;
 }
 
 var ia2 = new Array(yi, Mi, di, Hi, mi, si);
 
 for(i=0; i<ia.length-1; i++) 
 for(j=0;j<ia.length-1-i;j++) 
 if(ia[j]>ia[j+1]) {
temp=ia[j]; 
 ia[j]=ia[j+1]; 
 ia[j+1]=temp;
 }
 
 for (i=0; i<ia.length ; i++)
 for (j=0; j<ia2.length; j++)
 if(ia[i]==ia2[j]) {
 ia2[j] = i;
 }
 
 return ia2;
 }
 

 Date.trim=function(str){
 return str.replace(/(^\s*)|(\s*$)/g, "");
 }


		/* 
        * 获得时间差,时间格式为 年-月-日 小时:分钟:秒 或者 年/月/日 小时：分钟：秒 
        * 其中，年月日为全格式，例如 ： 2010-10-12 01:00:00 
        * 返回精度为：秒，分，小时，天
        */

        Date.GetDateDiff=function(startTime, endTime, diffType) {
            //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式 
//            startTime = startTime.replace(/\-/g, "/");
//            endTime = endTime.replace(/\-/g, "/");

            //将计算间隔类性字符转换为小写
            diffType = diffType.toLowerCase();
            var sTime = startTime;      //开始时间
            var eTime = endTime;  //结束时间
            //作为除数的数字
            var divNum = 1;
            switch (diffType) {
                case "second":
                    divNum = 1000;
                    break;
                case "minute":
                    divNum = 1000 * 60;
                    break;
                case "hour":
                    divNum = 1000 * 3600;
                    break;
                case "day":
                    divNum = 1000 * 3600 * 24;
                    break;
                default:
                    break;
            }
            return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
        }
		
		
		//alert(result);


//var date = new Date();     
//window.alert(date.pattern("yyyy-MM-dd hh:mm:ss"));  
