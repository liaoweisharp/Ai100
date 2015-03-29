/// <reference path="../SimpleUser.js" />
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
            $excuteWS("~ReportsWS.getInfoForStu", {userId:get_userId(), sectionId: get_sectionId(), assignmentId: assignmentId, userExtend: get_simpleUser() }, function (r2) {
                var users = r2[0];
                var testResults = r2[1];
                var str = html_reports(r2);
                $div = $(".usersRp");
                $div.html(str);

                //加样式
                $div.find(".row").hover(
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
function html_reports(result) {
    var users = result[0];
    var testResults = result[1];
    var assignmentReport = result[2];
    var submitNum=""
    var saveNum="";
    var scoreNum="";
    var notInvolvedNum="";
    var avg="--";
    if(assignmentReport){
        submitNum=assignmentReport.submitNum;
        saveNum=assignmentReport.saveNum;
        scoreNum=assignmentReport.scoreNum;
        notInvolvedNum = assignmentReport.notInvolvedNum;
  
        if (isNaN(assignmentReport.adjustScore) == false && isNaN(assignmentReport.totalScore) == false && assignmentReport.totalScore != 0 && assignmentReport.adjustScore >= 0) {
            
            avg = (accMul(Math_Round(accDiv(assignmentReport.adjustScore, assignmentReport.totalScore), 2), 100)) + "%";
        } 
    }
      
    
   // var knowledges = r3[2];
    var str = [];
    str.push("<div>");
    str.push("<ul>");
    str.push(String.format("<li>已提交人数:<font class='fo'>{0}</font></li>", submitNum));
    str.push(String.format("<li>正在考试人数:<font class='fo'>{0}</font></li>", saveNum));
    str.push(String.format("<li>已阅卷人数:<font class='fo'>{0}</font></li>", scoreNum));
    str.push(String.format("<li>未参加考试人数:<font class='fo'>{0}</font></li>", notInvolvedNum));
    str.push(String.format("<li>平均分:<font class='fo'>{0}</font></li>", avg));
    str.push("</ul>");
    str.push("</div>");
    str.push("<table class='tb_rp'>");
    str.push("<tr class='header'>");
    str.push("<td class='td1'>编号</td>");
    str.push("<td class='td2'>学生</td>");
    str.push("<td class='td3'>提交时间</td>");
    str.push("<td class='td4'>题完成率</td>");
    str.push("<td class='td4'>状态</td>");
    str.push("<td class='td5'>原始成绩</td>");
    str.push("<td class='td5'>提高后成绩</td>");
    str.push("</tr>");
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
        if (testResults)
        {
            var ins = testResults.firstOrDefault("userId", userId);
            if (ins) {
                submitDate = ins.submittedDate;
                if (submitDate) {
                    submitDate = submitDate.split('.')[0];
                }
                twcl= ins.answeredBase != "-1" ? (Math_Round(ins.answeredBase, 2) * 100) + "%" : "--"
                if (ins.statusFlag == "1") {
                    zhuangTai = '<span style="cursor:pointer;color:blue;" onclick="location.href=\'../TestShow/CorrectingPapers.aspx?cpflag=2&stuUserId=' + userId + '&sectionId=' + get_sectionId() + '&assignmentId=' + window.assignmentId + '\'">查看报告</span>';
                } else if (ins.statusFlag == "2") {
                    zhuangTai = '<span style="cursor:pointer;color:blue;" onclick="location.href=\'../TestShow/CorrectingPapers.aspx?cpflag=1&stuUserId=' + userId + '&sectionId=' + get_sectionId() + '&assignmentId=' + window.assignmentId + '\'">阅卷' + aie_getMarkingmodel(window.assignment.markingModel) + '</span>';
                } else if (ins.statusFlag == "3") {
                    //$this.find("td[zt='1']").html('<span onclick="location.href=\'../TestShow/TestContent.aspx?sectionId=' + get_sectionId() + '&assignmentId=' + window.assignmentId + '\'" >等待提交</span>');
                    zhuangTai = '<span onclick="location.href=\'../TestShow/TestContent.aspx?sectionId=' + get_sectionId() + '&assignmentId=' + window.assignmentId + '\'" >等待提交</span>';
                }
                if (isNaN(ins.adjustScore) == false && isNaN(ins.totalScore) == false) {
                    var _adjustScore = Number(ins.adjustScore);
                    if (_adjustScore >= 0) {
                        var _totalScore = Number(ins.totalScore);
                        
                        score = _adjustScore + "/" + _totalScore + "=" + (accMul(Math_Round(accDiv(_adjustScore, _totalScore), 2), 100)) + "%";
                    } else {
                        score = "--";
                    }
                    
                }
                if (isNaN(ins.improvedScore) == false && isNaN(ins.totalScore) == false) {
                    var _improvedScore = Number(ins.improvedScore);
                    if (_improvedScore >= 0) {
                        var _totalScore = Number(ins.totalScore);

                        tscore = _improvedScore + "/" + _totalScore + "=" + (accMul(Math_Round(accDiv(_improvedScore, _totalScore), 2), 100)) + "%";
                    } else {
                        tscore = "--";
                    }

                }
                
            }
        }
        
        str.push("<tr class='row'>");
        str.push(String.format("<td>{0}</td>",num));
        str.push(String.format("<td>{0}</td>", name));
        str.push(String.format("<td>{0}</td>", submitDate));
        str.push(String.format("<td>{0}</td>",twcl));
        str.push(String.format("<td>{0}</td>", zhuangTai));
        str.push(String.format("<td>{0}</td>", score));
        str.push(String.format("<td>{0}</td>", tscore));
        str.push("</tr>");
    })
    
    str.push("</table>");
    return str.join("");
}
function aie_getMarkingmodel(v) {
    if (v == "1") return "<br/>(自动阅卷)";
    if (v == "2") return "<br/>(学生参与)";
    if (v == "3") return "<br/>(教师参与)";
    if (v == "4") return "<br/>(相互参与)";
}
