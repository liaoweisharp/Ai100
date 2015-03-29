
Date.prototype.format = function (format) {
    
    if (format == null) {
        return "";
    }
    if (typeof window.DateFormatType == "undefined") {
        window.DateFormatType = {
            defaultDate: "yyyy-MM-dd HH:mm:ss",
            //defaultDate: "mm/dd/yyyy HH:MM:ss",
            shortDateTime: "mm/dd/yyyy",
            fullDateTime: "ddd mmm dd yyyy HH:MM:ss",

            shortDate: "m/d/yy",

            mediumDate: "mmm d, yyyy",

            longDate: "mmmm d, yyyy",

            fullDate: "dddd, mmmm d, yyyy",

            shortTime: "h:MM TT",

            mediumTime: "h:MM:ss TT",

            longTime: "h:MM:ss TT Z",

            isoDate: "yyyy-mm-dd",

            isoTime: "HH:MM:ss",

            isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",

            isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
        };

    }
    var xYear = this.getFullYear();
    //    if (!(navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)) {//非IE
    //        xYear = xYear + 1900;
    //    }

    var xMonth = this.getMonth() + 1;
    if (xMonth < 10) {
        xMonth = "0" + xMonth;
    }

    var xDay = this.getDate();
    if (xDay < 10) {
        xDay = "0" + xDay;
    }

    var xHours = this.getHours();
    if (xHours < 10) {
        xHours = "0" + xHours;
    }

    var xMinutes = this.getMinutes();
    if (xMinutes < 10) {
        xMinutes = "0" + xMinutes;
    }

    var xSeconds = this.getSeconds();
    if (xSeconds < 10) {
        xSeconds = "0" + xSeconds;
    }

    if (format == window.DateFormatType.shortDateTime) {
        return xMonth + "/" + xDay + "/" + xYear;
    }
    //return xMonth + "/" + xDay + "/" + xYear + " " + xHours + ":" + xMinutes + ":" + xSeconds;
    return xYear + "-" + xMonth + "-" + xDay + " " + xHours + ":" + xMinutes + ":" + xSeconds;
}


function jDateFormat(jdate) {
    return new Date(Number(jdate.match("[0-9]+")[0])).format();

}

//打开一个新窗口
function openNewWindow(url) {
    $("<form action=\"" + url + "\" target=\"_blank\" method=\"POST\"><input type=\"submit\"></form>").appendTo("body").submit().remove();
}

/*
        工具包
*/
var Utils = {
    /*
        单位
    */
    units: '个十百千万@#%亿^&~',
    /*
        字符
    */
    chars: '零一二三四五六七八九',

    /*
        数字转中文
        @number {Integer} 形如123的数字
        @return {String} 返回转换成的形如 一百二十三 的字符串             
    */
    numberToChinese: function (number) {
        var a = (number + '').split(''), s = [], t = this;
        if (a.length > 12) {
            throw new Error('too big');
        } else {
            for (var i = 0, j = a.length - 1; i <= j; i++) {
                if (j == 1 || j == 5 || j == 9) {//两位数 处理特殊的 1*
                    if (i == 0) {
                        if (a[i] != '1') s.push(t.chars.charAt(a[i]));
                    } else {
                        s.push(t.chars.charAt(a[i]));
                    }
                } else {
                    s.push(t.chars.charAt(a[i]));
                }
                if (i != j) {
                    s.push(t.units.charAt(j - i));
                }
            }
        }
        //return s;
        return s.join('').replace(/零([十百千万亿@#%^&~])/g, function (m, d, b) {//优先处理 零百 零千 等
            b = t.units.indexOf(d);
            if (b != -1) {
                if (d == '亿') return d;
                if (d == '万') return d;
                if (a[j - b] == '0') return '零'
            }
            return '';
        }).replace(/零+/g, '零').replace(/零([万亿])/g, function (m, b) {// 零百 零千处理后 可能出现 零零相连的 再处理结尾为零的
            return b;
        }).replace(/亿[万千百]/g, '亿').replace(/[零]$/, '').replace(/[@#%^&~]/g, function (m) {
            return { '@': '十', '#': '百', '%': '千', '^': '十', '&': '百', '~': '千' }[m];
        }).replace(/([亿万])([一-九])/g, function (m, d, b, c) {
            c = t.units.indexOf(d);
            if (c != -1) {
                if (a[j - c] == '0') return d + '零' + b
            }
            return m;
        });
    }
};