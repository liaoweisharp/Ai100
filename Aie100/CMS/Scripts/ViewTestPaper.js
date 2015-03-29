/// <reference path="../../Scripts/jquery-1.4.1.min.js" />
/// <reference path="comm.js" />

/*
* 生成试卷预览
*/

var SimpleUser = null;              //当前用户
var _Test = null;                   //考试信息
var _TestQuestionTypes = [];        //考试题型信息
var _TestQuestions = [];            //考题
var _ReferenceAnswers = [];         //参考答案   
var _TestQuestionGroups = [];       //试题分组

var $_dvTestPaper = null;

$(function () {
    //获取用户信息
    $excuteWS("~CmsWS.getSimpleUser", { userId: "", sectionId: "" }, function (result) {
        if (result) {
            SimpleUser = result;
            PageLoad();
        } else {
            $.jBox.error("取用户信息失败!", "错误", { buttons: { '确定': 'ok' } });
        }
    }, null, null);
});

function PageLoad() {
    $_dvTestPaper = $("#dvTestPaper");

    var args = getUrlParms();
    var bookId = (args["bookId"]) ? args["bookId"] : "";
    var testId = (args["testId"]) ? args["testId"] : "";

    if (!bookId || !testId) {
        $.jBox.tip("参数错误！", "warning");
        return;
    }

    $excuteWS("~CmsWS.getTestPaperData", { bookId: bookId, testId: testId,userId:SimpleUser.userId, userExtend: SimpleUser }, function (result) {
        $_dvTestPaper.empty();
        _Test = result[0];
        _TestQuestionTypes = result[1] ? result[1] : [];
        _TestQuestions = result[2] ? result[2] : [];
        _ReferenceAnswers = result[3] ? result[3] : [];

        assignReferAnswers();
        assignSubQuestions();
        groupQuestions();

        buildTestPaper();
    }, null, null);
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

//试题分组
function groupQuestions() {
    var tmpTestQuestionGroups = [];
    var questionGroup = {};
    for (var i = 0; i < _TestQuestionTypes.length; i++) {
        questionGroup = {};
        questionGroup.testQuestionTypeId = _TestQuestionTypes[i].id;
        questionGroup.title = _TestQuestionTypes[i].title;
        questionGroup.totalScore = 0;
        questionGroup.questions = [];
        tmpTestQuestionGroups.push(questionGroup);
    }

    var n = -1;
    var totalScore = 0;
    for (var j = 0; j < _TestQuestions.length; j++) {
        if (_TestQuestions[j].parentId == _TestQuestions[j].id) {   //不单独添加子题，因为子题是挂在母题下面的
            n = tmpTestQuestionGroups.indexOf("testQuestionTypeId", _TestQuestions[j].testQuestionTypeId)
            if (n != -1) {
                if (_TestQuestions[j].score) {
                    tmpTestQuestionGroups[n].totalScore += parseFloat(_TestQuestions[j].score);
                }
                tmpTestQuestionGroups[n].questions.push(_TestQuestions[j]);
            }
        }
    }

    for (var k = 0; k < tmpTestQuestionGroups.length; k++) {
        if (tmpTestQuestionGroups[k].questions.length > 0) {
            _TestQuestionGroups.push(tmpTestQuestionGroups[k]);
        }
    }

}

//构造试卷
function buildTestPaper() {
    buildTestTitle();
    buildQuestionContents();
}

//生成标题
function buildTestTitle() {
    var sb = [];
    sb.push("<div id='maintitle'>" + _Test.title + "</div>");
    sb.push("<div id='subtitle'>（满分&nbsp;" + calcTotalScore() + "&nbsp;分&nbsp;&nbsp;考试时间&nbsp;" + _Test.timeLength + "&nbsp;分钟）</div>");
    $_dvTestPaper.append(sb.join(""));
}

//计算试卷总分
function calcTotalScore() {
    var total = 0;
    $.each(_TestQuestionGroups, function () {
        total += this.totalScore;
    })
    return total;
}

//生成题题内容
function buildQuestionContents() {
    var groupDesc, questionContent;
    for (var i = 0; i < _TestQuestionGroups.length; i++) {
        groupDesc = buildGroupDesc(_TestQuestionGroups[i], i + 1);
        questionContent = buildQuestionByGroup(_TestQuestionGroups[i].questions);
        $_dvTestPaper.append(groupDesc);
        $_dvTestPaper.append(questionContent);
    }
}

//生成大题描述
function buildGroupDesc(quesiontGroup, qNo) {
    var questionNo = Utils.numberToChinese(qNo);
    var title = quesiontGroup.title;
    var questionNum = quesiontGroup.questions.length;
    var totalScore = quesiontGroup.totalScore;
    return "<div class='ques_group_desc'>" + questionNo + "、" + title + "(共&nbsp;" + questionNum + "&nbsp;题，共&nbsp;" + totalScore + "&nbsp;分)</div>";
}

//生成一个题型的题
function buildQuestionByGroup(quesionts) {
    var sb = [];
    var qNo = 0;
    for (var i = 0; i < quesionts.length; i++) {
        qNo = i + 1;
        if (quesionts[i].parentFlag == "1") {
            sb.push(buildMsQuestion(quesionts[i], qNo));
        } else {
            sb.push(buildNormalQuestion(quesionts[i], qNo));
        }

    }
    return sb.join("");
}

//生成子母题
function buildMsQuestion(questionW, qNo) {
    var question, sb = [];
    var score = questionW.score.replace(".0", "");
    questionW.orderName = qNo;

    sb.push("<table border='0' style='margin: 16px 19px; border-collapse:collapse'>");
    sb.push("<tr><td valign='top' >" + qNo + ".</td><td>" + questionW.content + "</td></tr>");
    sb.push("<tr><td colspan='2' style='padding:10px 20px'>");
    var subQuestions = questionW.subQuestions;
    for (var i = 0; i < subQuestions.length; i++) {
        subQuestions[i].orderName = "(" + (i + 1) + ")";
        question = new Question({ data: { question: subQuestions[i], answers: subQuestions[i].referAnswers } });
        sb.push("<div>" + question.getBody() + "</div>");
        sb.push("<div style='padding:10px 20px'>" + question.getAnswerPView() + "</div>");
    }
    sb.push("</td></tr>");
    sb.push("</table>");
    return sb.join("");
}

//生成普通题
function buildNormalQuestion(questionW, qNo) {
    questionW.orderName = qNo;
    var question = new Question({ data: { question: questionW, answers: questionW.referAnswers } });
    var score = questionW.score.replace(".0", "");

    var sb = [];
    sb.push("<div style='margin: 23px 20px;'>");
    sb.push("<div>" + question.getBody() + "</div>");
    sb.push("<div style='margin:10px 20px;'>" + question.getAnswerPView() + "</div>");
    sb.push("</div>");
    return sb.join("");
}

