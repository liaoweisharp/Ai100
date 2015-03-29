//获得url参数
//    使用方法：
//var args = new Object();
//args = GetUrlParms();
//如果要查找参数key:
//value = args[key] 
function getUrlParms() {
    var args = new Object();
    var query = location.search.substring(1); //获取查询串   
    var pairs = query.split("&"); //在逗号处断开   
    for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('='); //查找name=value   
        if (pos == -1) continue; //如果没有找到就跳过   
        var argname = pairs[i].substring(0, pos); //提取name   
        var value = pairs[i].substring(pos + 1); //提取value   
        args[argname] = unescape(value); //存为属性   
    }
    return args;
}

function closeWindow() {
    if (navigator.userAgent.indexOf("MSIE") > 0) {
        if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
            window.opener = null; window.close();
        }
        else {
            window.open('', '_top'); window.top.close();
        }
    }
    else if (navigator.userAgent.indexOf("Firefox") > 0) {
        window.location.href = 'about:blank ';
    }
    else {
        window.opener = null;
        window.open('', '_self', '');
        window.close();
    }
}

Date.prototype.formatEx = function (format) {
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

    if (format ==window.DateFormatType.shortDateTime) {
        return xMonth + "/" + xDay + "/" + xYear;
    }
    //return xMonth + "/" + xDay + "/" + xYear + " " + xHours + ":" + xMinutes + ":" + xSeconds;
    return xYear + "-" + xMonth + "-" + xDay + " " + xHours + ":" + xMinutes + ":" + xSeconds;
}


function jDateFormat(jdate) {
   return new Date(Number(jdate.match("[0-9]+")[0])).formatEx();
}

//根据索引，从数据中返回部分数据
function getIdsArray(idArray, startpos, endpos) {
    var tempIdArray = new Array();
    if (idArray) {
        var tidArray = idArray;
        var lastIndex = tidArray.length - 1;
        if (endpos > lastIndex) {
            endpos = lastIndex;
        }
        tempIdArray = tidArray.slice(startpos, endpos + 1);
    }
    return tempIdArray;
}

//打开一个新窗口
function openNewWindow(url) {
    $("<form action=\"" + url + "\" target=\"_blank\" method=\"POST\"><input type=\"submit\"></form>").appendTo("body").submit().remove();
}

function getScoreChange(score) {

    var ScoreChangeStr = "";
    var ScoreChange = 0.00;
    if (score != null && score != "--") {
        ScoreChange = Number(score);
        if (ScoreChange >= 88.00) {
            ScoreChangeStr = getKnowledgeStatusInfo(5);
        }
        else if (ScoreChange >= 70.00 && ScoreChange < 88.00) {
            ScoreChangeStr = getKnowledgeStatusInfo(4);
        }
        else if (ScoreChange >= 54.00 && ScoreChange < 70.00) {
            ScoreChangeStr = getKnowledgeStatusInfo(3);
        }
        else if (ScoreChange >= 40.00 && ScoreChange < 54.00) {
            ScoreChangeStr = getKnowledgeStatusInfo(2);
        }
        else if (ScoreChange >= 0.0 && ScoreChange < 40.00) {
            ScoreChangeStr = getKnowledgeStatusInfo(1);
        }
        else {
            ScoreChangeStr = getKnowledgeStatusInfo(0);
        }
    }
    else {
        ScoreChangeStr = getKnowledgeStatusInfo(0);
    }
    return ScoreChangeStr;
}

function getKnowledgeStatus(score) {

    var status = "0";
    var ScoreChange = 0.00;
    if (score != null && score != "--") {
        ScoreChange = Number(score);
        if (ScoreChange >= 88.00) {
            status = "5";
        }
        else if (ScoreChange >= 70.00 && ScoreChange < 88.00) {
            status = "4";
        }
        else if (ScoreChange >= 54.00 && ScoreChange < 70.00) {
            status = "3";
        }
        else if (ScoreChange >= 40.00 && ScoreChange < 54.00) {
            status = "2";
        }
        else if (ScoreChange >= 0.0 && ScoreChange < 40.00) {
            status = "1";
        }
       
    }
   
    return status;
}

function getKnowledgeStatusInfo(status) {
    var statusinfo;
    if (status==5) {
        statusinfo = "掌握";
    }
    else if (status == 4) {
        statusinfo = "熟练";
    }
    else if (status == 3) {
        statusinfo = "熟悉";
    }
    else if (status == 2) {
        statusinfo = "了解";
    }
    else if (status == 1) {
        statusinfo = "入门";
    }
    else {
        statusinfo = "未学";
    }
    return statusinfo;
}

//返回知识点状态条html
function getKnowledgeStatusBar(roleId, knowledgeGrade) {
    var personalKnowledgeScore = knowledgeGrade.personalKnowledgeScore;
    var classKnowledgeScore = knowledgeGrade.classKnowledgeScore;
            

    var htmlStrArray = new Array();
    htmlStrArray.push('<div class="kpstatus">');

    if (roleId == "1") {
        var percentPersonalKnowledgeScore = personalKnowledgeScore != null && personalKnowledgeScore != "--" ? personalKnowledgeScore + "%" : "100%";
        var personalStatusObj = cmm_getKPStatusObj(personalKnowledgeScore);
        htmlStrArray.push('<div title="个人状态：' + personalStatusObj.title + '" style="width:180px;margin-top:1px;border:1px solid rgb(188,199,216);background-color:rgb(214,222,206)">');
        if (personalStatusObj.score != "--") {
            var src2 = personalStatusObj.score == 0 ? "../Images/hStatus0.png" : "../Images/hStatus.png";
            htmlStrArray.push('<div style="width:' + percentPersonalKnowledgeScore + ';overflow:hidden;position:relative;text-align:left;">');
            htmlStrArray.push('<span style="position:absolute;margin-left:5px;color:#fff;width:170px;">' + personalStatusObj.title + '</span><img src="' + src2 + '" style="height: 20px;width:180px;"/></div>');
        } else {
            htmlStrArray.push('<div style="width:100%;background-color:#888;height:20px;"></div>');
        }
        htmlStrArray.push('</div>');
    } else if (roleId == "0") {
        var percentClassKnowledgeScore = classKnowledgeScore != null && classKnowledgeScore != "--" ? classKnowledgeScore + "%" : "100%";
        var classStatusObj = cmm_getKPStatusObj(classKnowledgeScore);
        htmlStrArray.push('<div title="全班状态：' + classStatusObj.title + '" style="width:180px;border:1px solid rgb(188,199,216);background-color:rgb(214,222,206)">');
        if (classStatusObj.score != "--") {
            var src1 = classStatusObj.score == 0 ? "../Images/hStatus0.png" : "../Images/hStatus.png";
            htmlStrArray.push('<div style="width:' + percentClassKnowledgeScore + ';overflow:hidden;position:relative;text-align:left;">');
            htmlStrArray.push('<span style="position:absolute;margin-left:5px;color:#fff;width:170px;">' + classStatusObj.title + '</span><img src="' + src1 + '" style="height: 20px;width:180px;"/></div>');
        } else {
            htmlStrArray.push('<div style="width:100%;background-color:#888;height:20px;"></div>');
        }
        htmlStrArray.push('</div>');
    }

    htmlStrArray.push('</div>');
    return htmlStrArray.join('');
}

function cmm_getKPStatusObj(score) {

    if (score != "--") {
        var tScore = score;
        if (tScore != 0) {
            var status = getScoreChange(tScore);
            if (status == "--" || status == "") {
                return { title: "--", score: "--" };
            }
            return { title: status, score: tScore };
        } else {
            return { title: "较差", score: tScore };
        }
    } else {
        return { title: "--", score: "--" };
    }

}

/**
* 学习资料归类
**/
function getStudyMaterialType(_type) {

    var type = "";
    switch (_type) {
        case "0":
            type = "URL";
            break;
        case "1":
            type = "书";
            break;
        case "2":
            type = "音频";
            break;
        case "3":
            type = "视频";
            break;
        case "4":
            type = "文章";
            break;
        case "5":
            type = "在线文本";
            break;
        default:
            type = "其它";
            break;
    }
    return type;
}

