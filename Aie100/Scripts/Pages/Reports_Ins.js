/// <reference path="../SimpleUser.js" />
var reprt_json = {
    testResultArray:null
};

$(function () {
    
    var args = getUrlParms();
    window.assignmentId = args["assignmentId"];
    window.sectionId = args["sectionId"];
 
    
    U(function () {
        
        get_simpleUser().sectionId = sectionId;
        $excuteWS("~ReportsWS.assignmentById", { assignmentId: assignmentId, courseId: get_courseId(), sectionId: get_sectionId(), userId: get_userId(), userExtend: get_simpleUser() }, function (r1) {
            window.assignment = r1;
            var title = r1.title;
            $(".assignmentTitle").html(title);
            $excuteWS("~ReportsWS.getInfoForIns", { sectionId: get_sectionId(), assignmentId: assignmentId, userExtend: get_simpleUser() }, function (r2) {
                var users = r2[0];
                var testResults =reprt_json.testResultArray= r2[1];
                //var str = html_reports(r2);
                var jheader= json_header(r2);
                window.jBody= json_body(users,testResults);
                var str1= html_header(jheader);
                
                var str2= html_body(window.jBody);
                $div1 = $(".usersRp1");
                $div2 = $(".usersRp2");
                $div1.html(str1);
                $div2.html(str2);
                //加样式
                $div2.find(".row").hover(
                    function () {

                        $(this).toggleClass("bg1");
                    },
                    function () {
                        $(this).toggleClass("bg1");
                    })

            }, null, null);
        }, null, null);
       
    });
})
function json_header(result) {
    var users = result[0];
    var testResults = result[1];
    var assignmentReport = result[2];
    var submitNum = ""
    var saveNum = "";
    var scoreNum = "";
    var notInvolvedNum = "";
    var avg = "--";
    var tavg = "--";
    if (assignmentReport) {
        submitNum = assignmentReport.submitNum;
        saveNum = assignmentReport.saveNum;
        scoreNum = assignmentReport.scoreNum;
        notInvolvedNum = assignmentReport.notInvolvedNum;

        if (isNaN(assignmentReport.adjustScore) == false && isNaN(assignmentReport.totalScore) == false && assignmentReport.totalScore != 0 && assignmentReport.adjustScore >= 0) {

            avg = (accMul(Math_Round(accDiv(assignmentReport.adjustScore, assignmentReport.totalScore), 2), 100)) + "%";
        }

        if (isNaN(assignmentReport.improvedScore) == false && isNaN(assignmentReport.totalScore) == false && assignmentReport.totalScore != 0 && assignmentReport.improvedScore >= 0) {

            tavg = (accMul(Math_Round(accDiv(assignmentReport.improvedScore, assignmentReport.totalScore), 2), 100)) + "%";
        }
    }
    return { submitNum: submitNum, saveNum: saveNum, scoreNum: scoreNum, notInvolvedNum: notInvolvedNum, avg: avg, tavg: tavg };
}
function json_body(users,testResults){
    var arr=[];
    var num=0;
    users.each(function (user) {
        num++;
        var name = user.fullName;
        var userId = user.id;
        var submitDate = "--";
        var twcl = "--";
        var zhuangTai = "--";
        var score = "--";
        var tscore = "--";
        var lastScore=-1;
        var lastImproveScore=-1;
        var lasttwcl=-1;
        if (testResults)
        {
            var ins = testResults.firstOrDefault("userId", userId);
            if (ins) {
                submitDate = ins.submittedDate;
                if (submitDate) {
                    submitDate = submitDate.split('.')[0];
                }
                if( ins.answeredBase != "-1"){
                    lasttwcl=accMul(Math_Round(ins.answeredBase, 2) , 100);
                    twcl=lasttwcl+"%";
                }
                else{
                    lasttwcl=-1;
                    twcl="--";
                }
                twcl= ins.answeredBase != "-1" ? (accMul(Math_Round(ins.answeredBase, 2) , 100)) + "%" : "--";
                
                if (ins.statusFlag == "1") {
                    zhuangTai = '<span style="cursor:pointer;color:blue;" onclick="location.href=\'../TestShow/CorrectingPapers.aspx?cpflag=2&sectionId=' + get_sectionId() + '&assignmentId=' + window.assignmentId + '&stuUserId='+userId+'\'">查看报告</span>';
                } else if (ins.statusFlag == "2") {
                    zhuangTai = '<span style="cursor:pointer;color:blue;" onclick="location.href=\'../TestShow/CorrectingPapers.aspx?cpflag=1&sectionId=' + get_sectionId() + '&assignmentId=' + window.assignmentId + '&stuUserId=' + userId + '\'">' + aie_getMarkingmodel(window.assignment.markingModel) + '</span>';
                } else if (ins.statusFlag == "3") {
                    //$this.find("td[zt='1']").html('<span onclick="location.href=\'../TestShow/TestContent.aspx?sectionId=' + get_sectionId() + '&assignmentId=' + window.assignmentId + '\'" >等待提交</span>');
                    zhuangTai = '<span style="cursor:pointer;color:blue;" onclick="location.href=\'../TestShow/TestContent.aspx?sectionId=' + get_sectionId() + '&assignmentId=' + window.assignmentId + '&userId=' + userId + '\'" >等待提交</span>';
                }
                if (isNaN(ins.adjustScore) == false && isNaN(ins.totalScore) == false) {
                    var _adjustScore = Number(ins.adjustScore);
                    if (_adjustScore >= 0) {
                        var _totalScore = Number(ins.totalScore);
                        lastScore=accMul(Math_Round(accDiv(_adjustScore, _totalScore), 2), 100);
                        score = _adjustScore + "/" + _totalScore + "=" + lastScore + "%";

                    } else {
                        lastScore=-1;
                        score = "--";
                    }
                    
                }
                if (isNaN(ins.improvedScore) == false && isNaN(ins.totalScore) == false) {
                    var _improvedScore = Number(ins.improvedScore);
                    if (_improvedScore >= 0) {
                        var _totalScore = Number(ins.totalScore);
                        lastImproveScore=accMul(Math_Round(accDiv(_improvedScore, _totalScore), 2), 100);
                        tscore = _improvedScore + "/" + _totalScore + "=" + lastImproveScore + "%";
                    } else {
                        lastImproveScore="-1";
                        tscore = "--";
                    }

                }
            }
        }
        var improveScore="--";
       
        
        if (ins && ins.improvedScore && ins.improvedScore >= 0) {
            improveScore=String.format("<span class='status' style='display:inline-block;width:100%' onclick=\"aie_viewImproveHistory('{1}','{2}','{3}')\" title='查看提高历史'>{0}</span>",tscore,ins.assignmentId,ins.assignmentId,ins.id)
        }
     
        arr.push({ name: name, submitDate: submitDate, twcl: twcl, zhuangTai: zhuangTai, score: score, improveScore: improveScore, lastScore: lastScore, lastImproveScore: lastImproveScore, lasttwcl: lasttwcl });
    })
    return arr;
}
function html_header(data){
    var str = [];
    str.push("<div>");
    str.push("<ul>");
    str.push(String.format("<li>已提交人数:<font class='fo'>{0}</font></li>", data.submitNum));
    str.push(String.format("<li>正在考试人数:<font class='fo'>{0}</font></li>", data.saveNum));
    str.push(String.format("<li>已阅卷人数:<font class='fo'>{0}</font></li>", data.scoreNum));
    str.push(String.format("<li>未参加考试人数:<font class='fo'>{0}</font></li>", data.notInvolvedNum));
    str.push(String.format("<li>原始平均成绩:<font class='fo'>{0}</font></li>", data.avg));
    str.push(String.format("<li>提高后平均成绩:<font class='fo'>{0}</font></li>", data.tavg));
    str.push("</ul>");
    str.push("</div>");
    if (window.jBody.length > 0) {
        str.push("<div class='dow'  onclick='clickExcel()'>下载</div>")
    }
    return str.join("");
}
window.orderInfo=null;
function _getOrderImg(orderName){
    if(!window.orderInfo) return "";
    if(window.orderInfo.orderName!=orderName){
        return "";
    }
    else{
        if(window.orderInfo.order=="desc"){
            return "&nbsp;<img src='../Images/bullet_down2.png' title='降序' align='absmiddle'/>";
        }
        else if(window.orderInfo.order=="asc"){
            return "&nbsp;<img src='../Images/bullet_up2.png' title='升序'  align='absmiddle'/>";
        }
    }
}

function html_body(data){
    if(!data || data.length==0) return "";
    var str=[];
    str.push("<table class='tb_rp'>");
    str.push("<tr class='header'>");
    str.push("<td class='td1'>编号</td>");
    
    str.push(String.format("<td class='td2 order' ordername='{0}' onclick=\"reOrder('{0}')\">学生{1}</td>","name", _getOrderImg("name")));
    str.push(String.format("<td class='td3 order' ordername='{0}' onclick=\"reOrder('{0}')\">提交时间{1}</td>","submitDate", _getOrderImg("submitDate")));
    str.push(String.format("<td class='td4 order' ordername='{0}' onclick=\"reOrder('{0}')\">题完成率{1}</td>","lasttwcl", _getOrderImg("lasttwcl")));
    str.push(String.format("<td class='td4 order' ordername='{0}' onclick=\"reOrder('{0}')\">状态{1}</td>","zhuangTai", _getOrderImg("zhuangTai")));
    str.push(String.format("<td class='td5 order' ordername='{0}' onclick=\"reOrder('{0}')\">原始成绩{1}</td>","lastScore", _getOrderImg("lastScore")));
    str.push(String.format("<td class='td6 order' ordername='{0}' onclick=\"reOrder('{0}')\">提高后成绩{1}</td>","lastImproveScore", _getOrderImg("lastImproveScore")));
    str.push("</tr>");
    str.push("</tr>");
    var name;
    var submitDate;
    var twcl;
    var zhuangTai;
    var score;
    var improveScore;
    var num=0;
    data.each(function (user) {
        num++;
        name=user.name;
        submitDate=user.submitDate;
        twcl=user.twcl;
        zhuangTai=user.zhuangTai;
        score=user.score;
        improveScore=user.improveScore;
        str.push("<tr class='row'>");
        str.push(String.format("<td>{0}</td>",num));
        str.push(String.format("<td>{0}</td>", name));
        str.push(String.format("<td>{0}</td>", submitDate));
        str.push(String.format("<td>{0}</td>",twcl));
        str.push(String.format("<td>{0}</td>", zhuangTai));
        str.push(String.format("<td>{0}</td>", score));
        str.push(String.format("<td>{0}</td>", improveScore));
        
        str.push("</tr>");
    })
    str.push("</table>");
    return str.join("");
}


function reOrder(orderName){
    
    if(window.orderInfo ==null) window.orderInfo ={};
    if(!window.orderInfo.order || window.orderInfo.order=="asc"){
        window.orderInfo.order="desc";
        window.jBody.orderBy(orderName);
        window.jBody.reverse()
    }
    else{
        window.orderInfo.order="asc";
        window.jBody.orderBy(orderName);
    }
    window.orderInfo.orderName=orderName;
   
    var str=html_body(window.jBody);
    $div2 = $(".usersRp2");
    $div2.html(str);
}
function aie_getMarkingmodel(v) {
    if (v == "1") return "自动阅卷";
    if (v == "2") return "学生阅卷";
    if (v == "3") return "教师阅卷";
    if (v == "4") return "相互阅卷";
}

function aie_viewImproveHistory(userId,assignmentId,testResultId) {
    if (reprt_json.testResultArray.length > 0 && testResultId && $.trim(testResultId) != "") {
        var re = reprt_json.testResultArray.firstOrDefault("id", testResultId);
        var historyArray = re ? re.improveHistory.split(";") : null;
        if (historyArray) {
            var tbArray = new Array();
            tbArray.push('<table border="1" width="100%" borderColor="rgb(174,174,174)" style="border:1px solid rgb(174,174,174)">');
            tbArray.push('<tr style="background-color:rgb(174,174,174)">');
            tbArray.push('<th>次数</th>');
            tbArray.push('<th>成绩</th>');
            tbArray.push('<th>提高成绩</th>');
            tbArray.push('<th>时间</th>');
            tbArray.push('<th>报告</th>');
            tbArray.push('</tr>');
            for (var i = 0; i < historyArray.length; i++) {
                var history = historyArray[i] && $.trim(historyArray[i]) != "" ? historyArray[i].split(",") : null;
                tbArray.push('<tr>');
                var improveNum=i+1;
                tbArray.push('<td style="text-align:center;">' + improveNum + '</td>');
                tbArray.push('<td style="text-align:center;">' + history[0] + '%</td>');
                tbArray.push('<td style="text-align:center;">' + (history[1] + "/" + history[2] + "=" + accMul(Math_Round(history[1] / history[2], 2), 100) + "%") + '</td>');
                tbArray.push('<td style="text-align:center;">' + history[4] + '</td>');
                tbArray.push('<td style="text-align:center;"><a href="../TestShow/CorrectingPapers.aspx?sectionId=' + get_sectionId() + '&assignmentId=' + assignmentId + '&stuUserId='+userId+'&type=3&improveNum=' + improveNum + '">查看报告</a></td>');
                tbArray.push('</tr>');
            }
            tbArray.push('<table>');
        }
        $.jBox(tbArray.join(''), { title: "考试提高历史记录", width: 450, buttons: {} });
    }

}
function clickExcel() {
    window.location.href = 'CSV_Score.aspx?sectionId=' + window.sectionId + "&assignmentId=" + window.assignmentId;
}
