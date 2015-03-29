/// <reference path="../../Scripts/jquery-1.4.1.min.js" />

/*
* 创建考试
*/

var _Test = null;                   //考试信息
var _TestQuestionTypes = [];        //考试题型信息
var _TestQuestions = [];            //考题
var _ReferenceAnswers = [];         //参考答案   
var _TestQuestionGroups = [];       //试题分组

var $testQuestionContent = null;

var _testInfo = null;

//初始化编辑考试层
function initEditTestBox() {
    $("#dvEditTestTab ul").bind("click", onSelectEditTestTab);
    $testQuestionContent = $("#dvContentbox_et");
    $("#btnCancelTestQuestion_et").bind("click", function () {
        showEditTestBox(false);
    });
    $("#btnSaveTestQuestion_et").bind("click", saveTestQuestion_et);
}

//显示编辑试卷
function editTestPaper(testId) {
    $("#dvEditTestBox").data("testId", testId);
    showEditTestBox(true);
    $("#dvEditTestTab #ulTestBaseInfo_et").trigger("click");

    _testInfo = null;
}

//显示考试基本信息
function ET_showTestInfo(testId) {
    var $context = $("#dvTestBaseInfo_et").showLoading();
    $excuteWS("~CmsWS.getTestListForTestIds", { testIds: [testId], userExtend: SimpleUser }, function (tests) {
        $context.hideLoading();
        if (tests && tests.length == 1) {
            var test = tests[0];
            _testInfo = tests[0];

            with ($("#dvEditTestBox #dvTestBaseInfo_et")) {
                find("#dlg_txtTestName_et").val(test.title);
                find("#dlg_ddlDifficultye_et").val(test.difficulty);
                find("#dlg_TimeLength_et").val(test.timeLength);
                if (test.stdVisible == "0") {
                    find("#rdStdVisible_n_et").attr("checked", "checked");
                } else {
                    find("#rdStdVisible_y_et").attr("checked", "checked");
                }
                find("#dlg_ShareModel_et").val(test.shareFlag);
                find("#dlg_Description_et").val(test.description);
            }
        }
    }, null, null);
}

//显示试题
function ET_showTestQuestion(testId) {
    var testId = $("#dvEditTestBox").data("testId");
    var bookId = $("#selBookList").find("option:selected").attr("id");
    var $context = $("#dvContentbox_et").showLoading();
    $excuteWS("~CmsWS.getTestPaperData", { bookId: bookId, testId: testId,userId:SimpleUser.userId, userExtend: SimpleUser }, function (result) {
        $context.hideLoading();
        _Test = result[0];
        _TestQuestionTypes = result[1] ? result[1] : [];
        _TestQuestions = result[2] ? result[2] : [];
        _ReferenceAnswers = result[3] ? result[3] : [];

        assignReferAnswers();
        assignSubQuestions();
        groupQuestions();

        buildQuestionContents();
    }, null, null);
}

//显示或隐藏编辑考试
function showEditTestBox(b) {
    if (b) {
        $("#dvTestManageBox").hide();
        $("#dvEditTestBox").show();
    } else {
        $("#dvTestManageBox").show();
        $("#dvEditTestBox").hide();
    }
}


function onSelectEditTestTab() {
    if (this.className == "cseltab_ul_s") return;
    var $currTab = $(this);
    var $siblingTabs = $currTab.siblings();

    $siblingTabs.removeClass().addClass("cseltab_ul");
    $siblingTabs.find("li").each(function () {
        this.className = this.className.replace("_s", "");
    });

    $currTab.removeClass().addClass("cseltab_ul_s");
    $currTab.find("li").each(function () {
        this.className = this.className + "_s";
    });

    var testId = $("#dvEditTestBox").data("testId");
    switch ($currTab.attr("id")) {
        case "ulTestBaseInfo_et":
            $("#dvTestBaseInfo_et").show();
            $("#dvComposePaper_et").hide();
            if (!_testInfo) {
                ET_showTestInfo(testId);
            }
            break;
        case "ulComposePaper_et":
            $("#dvTestBaseInfo_et").hide();
            $("#dvComposePaper_et").show();
            ResetFrameHeight("dvContentbox_et", 50);
            ET_showTestQuestion(testId);
            break;
    }
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
    _TestQuestionGroups = [];
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
    $testQuestionContent.empty();
    var groupDesc, questionContent;
    for (var i = 0; i < _TestQuestionGroups.length; i++) {
        groupDesc = buildGroupDesc(_TestQuestionGroups[i], i + 1);
        questionContent = buildQuestionByGroup(_TestQuestionGroups[i].questions);
        $testQuestionContent.append(groupDesc);
        $testQuestionContent.append(questionContent);
    }
}

//生成大题描述
function buildGroupDesc(quesiontGroup, qNo) {
    var questionNo = Utils.numberToChinese(qNo);
    var title = quesiontGroup.title;
    var questionNum = quesiontGroup.questions.length;
    return "<div class='ques_group_desc'>" + questionNo + "、" + title + "(共&nbsp;" + questionNum + "&nbsp;题)</div>";
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
    //questionW.orderName = qNo;
    var question = new Question({ data: { question: questionW, answers: questionW.referAnswers } });
    var score = questionW.score.replace(".0", "");

    var sb = [];
    sb.push("<div style='margin: 23px 20px;'>");
    //sb.push("<div>" + question.getBody() + "</div>");
    sb.push("<table border='0' style='margin: 16px 19px; border-collapse:collapse'>");
    sb.push("<tr><td valign='top' >" + qNo + ".</td><td valign='top' style='width:70px;text-align:center'><input id='" + questionW .id+ "' type='text' style='width:25px;' value='" + score + "'>&nbsp;分</td><td>" + question.getBody() + "</td></tr>");
    sb.push("</table>");

    sb.push("<div style='margin:10px 20px;'>" + question.getAnswerPView() + "</div>");
    sb.push("</div>");
    return sb.join("");
}

//保存编辑
function saveTestQuestion_et() {
    var $context = $("#dvContentbox_et").showLoading();
    var editMaps = $("#dvContentbox_et input").map(function () {
        var mp = {};
        mp.key = this.id;
        mp.value = this.value;
        return mp;
    });

    //检查分数输入是否有误，并统计总分
    var b = true;
    var totalScore = 0;
    $.each(editMaps, function () {
        if (this.value && !isNaN(this.value) && parseInt(this.value) != 0) {
            totalScore += parseInt(this.value);
        } else {
            b = false;
            return false;
        }
    });
    
    if (!b) {
        $context.hideLoading();
        $.jBox.tip("分数输入错误", 'warning');
        return;
    }
    if (!ET_checkTestBaseInfo()) {
        $context.hideLoading();
        return;
    }

    var submitMaps = getSubmitMaps(editMaps);
    //if (submitMaps.length == 0) {
    //    $context.hideLoading();
    //    return;
    //}
    
    ET_setTestInfo(totalScore);
    $excuteWS("~CmsWS.editTestQuestion", { test: _Test, htQuestionIdAndScore: submitMaps, userExtend: SimpleUser }, function (result) {
        $context.hideLoading();
        if (result) {
            $.jBox.tip("保存成功", 'success');
        }
    }, null, null);
}


function getSubmitMaps(editMaps) {
    var n = -1;
    var submitMaps = [];
    $.each(editMaps, function () {
        n = _TestQuestions.indexOf("id", this.key);
        if (n != -1 && (_TestQuestions[n].score != this.value)) {
            submitMaps.push(this);
        }
    });
    return submitMaps;
}

function ET_setTestInfo(totalScore) {
    delete _Test.lastUpdate;
    _Test.title = $("#dlg_txtTestName_et").val();
    if ($("#dlg_ddlDifficultye_et").val() != "-1") {
        _Test.difficulty = $("#dlg_ddlDifficultye_et").val();
    }
    _Test.timeLength = $("#dlg_TimeLength_et").val();
    _Test.stdVisible = $("#rdStdVisible_y_et").is(":checked") ? "1" : "0";
    if ($("#dlg_ShareModel_et").val() != "-1") {
        _Test.shareFlag = $("#dlg_ShareModel_et").val();
    }
    _Test.description = $("#dlg_Description_et").val();
    _Test.totalScore = totalScore;
}

//检查基本信息是否有效
function ET_checkTestBaseInfo() {
    if ($("#dlg_txtTestName_et").val() == "") {
        $.jBox.tip('考试名称不能为空！', 'warning');
        return false;
    }
    var timeLength = $("#dlg_TimeLength_et").val();
    if (!timeLength || isNaN(timeLength) || parseFloat(timeLength) == 0) {
        $.jBox.tip('考试时长输入错误！', 'warning');
        return false;
    }
    return true;
}