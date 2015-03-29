function randomStringFun(length) {
    ///<summary>生成随机字符串</summary>
    ///<param name="length">生成字符串的长度</param>
    ///<return>返回生成的字符串</return>

    var x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
    var tmp=new Array();
    for (var i = 0; i < length; i++) {
        tmp[i]=(x.charAt(Math.ceil(Math.random() * 100000000) % x.length));
    }
    return tmp.join("");
}
//判断字符串以空格分隔的每一部分长度是否小于制定的值
function isLessMaxLength(str, maxLength) {
    var strArray = str.split(" ");
    for (var i = 0; i < strArray.length; i++) {
        var item = strArray[i];
        if (item.length > maxLength) {
            return false;
        }
    }
    return true;
}

String.format = function() {
/// <summary>格式化字符串 eg. String.format("hello {0}","world!")</summary>
     if( arguments.length == 0 )
         return null;
 
     var str = arguments[0];
     for(var i=1;i<arguments.length;i++) {
         var re = new RegExp('\\{' + (i-1) + '\\}','gm');
         str = str.replace(re, arguments[i]);
     }
     return str;
 }

 String.prototype.cutOut_ForLength = function (length)
 {
     /// <summary>按长度截取字符串,保留整个单词</summary>
     if (this.length > length)
     {
         var _str = this.substring(0, length);

         var index = _str.lastIndexOf(" ");
         if (index != -1)
         {
             return _str.substring(0, index);
         }
     }
     else
     {
         var _str = this;
     }
     return _str;
 }
 String.prototype.cutOut_ForNumOfWords = function (numOfWords) {
     /// <summary>按单词数截取字符串</summary>

 }
 String.prototype.numberOfWords = function () {
     /// <summary>返回单词数量（只限于英文）</summary>
     return this.split(" ").length;
 }
 String.randomString = function (length)
 {
 /// <summary>随机字符串</summary>
     /// <param name="length" type="Number">字符串长度</param>
     var x = "0123456789QWERTYUIOPASDFGHJKLZXCVBNMqwertyuioplkjhgfdsazxcvbnm";
     var tmp = new Array();
     for (var i = 0; i < length; i++)
     {
         tmp[i] = (x.charAt(Math.ceil(Math.random() * 100000000) % x.length));
     }
     return tmp.join("");
 }
 
//全部匹配替换
String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}
//去除两边空格
String.prototype.trim = function () {
    
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
//去除左边控格
String.prototype.ltrim = function () {
    
    return this.replace(/(^\s*)/g, "");
}
//去除右边控格
String.prototype.rtrim = function () {
    return this.replace(/(\s*$)/g, ""); 
}

function getFullName(Fname,Minitial,Lname)
{
    

            return Fname+Lname;
         
}

//在一个字符串中截取前面部分文字，汉字、全角符号按2个占位，数字英文、半角按一个占位，未显示完的最后加入省略号
String.prototype.sub = function (length) {
    var sub_length = length;
    var temp1 = this.replace(/[^\x00-\xff]/g, "**"); //精髓   
    var temp2 = temp1.substring(0, sub_length);
    //找出有多少个*   
    var x_length = temp2.split("\*").length - 1;
    var hanzi_num = x_length / 2;
    sub_length = sub_length - hanzi_num; //实际需要sub的长度是总长度-汉字长度   
    var res = this.substring(0, sub_length);
    if (sub_length < this.length) {
        var end = res + "...";
    } else {
        var end = res;
    }
    return end;
}
String.prototype.parseDateFormat = function (formatString)
{
    /// <summary>字符串转日期类型</summary>
    /// <param name="dateString" type="String">日期字符串(如："2012-08-07 08:07:06")</param>
    /// <param name="formatString" type="String">指定的日期字符串格式(如："yyyy-MM-dd HH:mm:ss")</param>
    if (Date.validateDate(this, formatString))
    {
        var now = new Date();
        var vals = Date.regexp.exec(this);
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
String.prototype.parseDate = function ()
{
/// <summary>字符串转换成日期类型(如：str为"\Date(213132312312)\")</summary>
    var reg = "[0-9]+";
    var minTime = this.match(reg)[0];
    return new Date(Number(minTime));
}