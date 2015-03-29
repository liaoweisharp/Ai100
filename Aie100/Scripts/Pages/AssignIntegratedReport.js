/// <reference path="../jquery.ajax.js" />
/// <reference path="../jquery-1.10.2.min.js" />
/// <reference path="../comm.js" />
/// <reference path="../SimpleUser.js" />
/// <reference path="../Array.js" />
/// <reference path="../../Plugins/showLoading/js/jquery.showLoading.min.js" />

var AIR_jason = { urlParams: null, simpleUser: null, assignment: null};
var _TestQuestions = [];            //考题
var _ReferenceAnswers = [];         //参考答案
var _correctNums = [];              //正确率统计数据
var _answerNums = [];               //答案的正确率统计

$(function () {
    AIR_jason.urlParams = getUrlParms();
    U(function () {
        AIR_jason.simpleUser = this.simpleUser;
        
        $excuteWS("~AssignmentWS.assignmentByIds", { assignmentIds: [AIR_jason.urlParams.assignmentId], courseId: AIR_jason.simpleUser.courseId, sectionId: AIR_jason.simpleUser.sectionId, userId: AIR_jason.simpleUser.userId, userExtend: AIR_jason.simpleUser }, function (assignments) {
            var assignment = null;
            if (assignments && assignments.length == 1) {
                assignment = assignments[0];
                AIR_jason.assignment = assignment;
            } else {
                return;
            }
            
            $excuteWS("~TestWS.getAssignIntegratedData", { assignmentId: AIR_jason.urlParams.assignmentId, testId: assignment.testId, sectionId: AIR_jason.simpleUser.sectionId, userId: AIR_jason.simpleUser.userId, userExtend: AIR_jason.simpleUser }, function (result) {
                _TestQuestions = result[0] ? result[0] : [];
                _ReferenceAnswers = result[1] ? result[1] : [];
                _correctNums = result[2] ? result[2] : [];
                _answerNums = result[3] ? result[3] : [];
                
                assignAnswerNum();
                assignReferAnswers();
                assignSubQuestions();
                if (_TestQuestions.length > 0) {
                    showReport(assignment, _correctNums, _TestQuestions);
                }
            }, null, null);

        }, null, null);
    });
});

//关联答案统计数据
function assignAnswerNum() {
    var i = -1;
    $.each(_answerNums, function () {
        i = _ReferenceAnswers.indexOf("id", this.key);
        if (i != -1) {
            _ReferenceAnswers[i].num = this.value;
        }
    });
}

//题与参考答案关联
function assignReferAnswers() {
    for (var i = 0; i < _TestQuestions.length; i++) {
        if (_TestQuestions[i].parentFlag != "1") {
            _TestQuestions[i].referAnswers = _ReferenceAnswers.findAll("questionId", _TestQuestions[i].id);
        }
    }
}

//母题关联子题
function assignSubQuestions() {
    var q, sq;
    for (var i = 0; i < _TestQuestions.length; i++) {
        q = _TestQuestions[i];
        if (q.parentFlag == "1") {   //找到母题
            q.subQuestions = [];

            //查找并关联子题
            for (var j = 0; j < _TestQuestions.length; j++) {
                sq = _TestQuestions[j];
                if (sq.parentId == q.id && sq.id != sq.parentId) {
                    q.subQuestions.push(sq);
                }
            }
        }
    }
}

function showReport(assignment, correctNums, questions) {
    var $report = $("#dvReport").empty();
    $("#spFeatureName").html(assignment.title);
    var sb, strCorrectRate, questionW;
    $.each(questions, function (i) {
        strCorrectRate = calcCorrectRate(this.id, correctNums);
        this.orderName = ++i;
        questionW = new Question({ data: { question: this, answers: null } });
        sb = [];
        sb.push("<div class='q_itemc'>");
        sb.push("<div class='q_body' id='" + this.id + "'>" + questionW.getBody() + "</div>");
        sb.push("<div class='correct_rate'>" + strCorrectRate + "</div>");
        if ($.inArray(this.questionTypeId, ["1", "2", "3"]) != -1) {
            sb.push("<div class='objective_detail'>" + showAnswerStats(this.referAnswers) + "</div>");
        } else {
            sb.push("<div class='subjective_detail'>" + showSubjectiveDetails(this.id, this.referAnswers) + "</div>");
        }
        sb.push("</div>");
        $report.append(sb.join(""));
    });
    
    $report.find("div.q_itemc:last").css("border", "0px");
}

//显示客观题答案统计
function showAnswerStats(refAnswers) {
    var sb = [];
    var content = "";
    var correctFlag = "";
    var num = "";
    sb.push("<table>");
    $.each(refAnswers, function () {
        num = this.num ? this.num : "0";
        correctFlag = (this.correctFlag == "1") ? "<img src='../Images/correct.png' />" : "";
        sb.push("<tr><td width='50'>(" + num + ")</td><td width='25'>" + correctFlag + "</td><td>" + this.content + "</td></tr>");
    })
    sb.push("</table>");
    return sb.join("");
}

//显示主观题答案
function showSubjectiveDetails(questionId, refAnswers) {
    var sb = [];
    var content = "";

    if (refAnswers && refAnswers.length > 0) {
        content = refAnswers[0].content;
    }
    
    sb.push("<div class='sub_det_op' onclick='_showSubDetail(\"" + questionId + "\",this)' expand='0'><img class='op_img' src='../Images/nolines_plus.gif' style='vertical-align:bottom;' /><span class='op_title'>显示详细...</span></div>");
    sb.push("<div class='w_qdetail' style='display:none'>");
    sb.push("   <div style='float:left; width:47%; border:1px solid #ccc; padding:10px; overflow:auto'>");
    sb.push("       <div>正确答案：</div>");
    sb.push("       <div>" + content + "</div>");
    sb.push("   </div>");
    sb.push("   <div style='float:left; width:48%; margin-left:15px'>");
    sb.push("       <div class='testerAnswers' style='border:1px solid #ccc; padding:10px; overflow:auto;'><img src='../Images/ajax-loader_b.gif' style='margin:30px 50%' /></div>");
    sb.push("       <div class='pagination' style='font-size:11px; margin-top:10px; text-align:center;'></div>");
    sb.push("   </div>");
    sb.push("   <div style='clear:both'></div>");
    sb.push("</div>");
    return sb.join("");
}


var _testerAnswers = null;
function _showSubDetail(questionId, o) {
    if ($(o).attr("expand") == '0') {
        $(o).attr("expand", "1");
        $(o).find(".op_img").attr("src", "../Images/nolines_minus.gif");
        $(o).find(".op_title").html("隐藏详细信息");
        var $testerAnswers = $(o).next().show().find(".testerAnswers");
        var testerAnswers = $testerAnswers.data("_testerAnswers");
        var assignment = AIR_jason.assignment;

        if (testerAnswers) {
            showTesterAnswers(questionId, testerAnswers, $testerAnswers);
        } else {
            $excuteWS("~TestWS.getTesterAnswersByTest", { assignmentId: assignment.id, testId: assignment.testId, questionIds: [questionId], sectionId: AIR_jason.simpleUser.sectionId, userExtend: AIR_jason.simpleUser }, function (result) {
                $testerAnswers.data("_testerAnswers", result);
                showTesterAnswers(questionId, result, $testerAnswers);
            }, null, null);
        }
    } else {
        $(o).attr("expand", "0");
        $(o).find(".op_img").attr("src", "../Images/nolines_plus.gif");
        $(o).next().hide();
        $(o).find(".op_title").html("显示详细...");
    }
}


var pageSize = 1;
function showTesterAnswers(questionId, testerAnswers, container) {
    
    if (!testerAnswers || testerAnswers.length == 0) {
        container.html("无数据");
        return;
    }

    if (container.next().data("_isLoad")) {
        return;
    }

    //分页
    container.next().data("_isLoad", true).pagination(testerAnswers.length, {
        num_edge_entries: 2,
        num_display_entries: 5,
        items_per_page: pageSize,
        prev_text: "上一个",
        next_text: "下一个",
        callback: function (page_index, o) {
            container.html(testerAnswers[page_index].testerAnswersContent);
        }
    });
}

//计算正确率
function calcCorrectRate(questionId, correctNums) {
    
    var strCorrectRate = "<span class='t'>正确：</span>--";
    if (!correctNums || correctNums.length == 0) {
        return strCorrectRate;
    }

    var i = correctNums.indexOf("questionId", questionId)
    if (i != -1) {
        strCorrectRate = "<span class='t'>正确：</span><span class='r'>" + calcPer(correctNums[i].correctNum, correctNums[i].countNum) + "</span>";
    }

    return strCorrectRate;
}

//计算参与的比例
function calcPer(sNum, sTotalNum) {
    var num = (sNum && !isNaN(sNum)) ? parseInt(sNum) : 0;
    var totalNum = (sTotalNum && !isNaN(sTotalNum)) ? parseInt(sTotalNum) : 0;

    if (totalNum == 0) {
        return "--";
    }

    var per = Math_Round((num / totalNum) * 100, 0);
    return num + "/" + totalNum + "=" + per + "%";
}