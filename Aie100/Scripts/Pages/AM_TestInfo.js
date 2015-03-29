/// <reference path="AM_TestManageGlobal.js" />
/// <reference path="AM_Common.js" />

/*
* 创建考试:考试基本信息
*/

//考试基本信息
function showTestBaseInfo() {

}

//检查基本信息是否有效
function checkTestBaseInfo() {
    if ($("#dlg_txtTestName").val() == "") {
        $.jBox.tip('考试名称不能为空！', 'warning');
        return false;
    }
    var timeLength = $("#dlg_TimeLength").val();
    if (!timeLength || isNaN(timeLength) || parseFloat(timeLength) == 0) {
        $.jBox.tip('考试时长输入错误！', 'warning');
        return false;
    }
    return true;
}


//获取考试基本信息
function getTestBaseInfo() {
    var testInfo = {};
    testInfo.title = $("#dlg_txtTestName").val();
    if ($("#dlg_ddlDifficultye").val() != "-1") {
        testInfo.difficulty = $("#dlg_ddlDifficultye").val();
    }
    testInfo.timeLength = $("#dlg_TimeLength").val();
    testInfo.stdVisible = $("#rdStdVisible_y").is(":checked") ? "1" : "0";
    testInfo.shareFlag = "0";
    testInfo.description = $("#dlg_Description").val();
    testInfo.totalScore = calcTotalScoreByModel();
    return testInfo;
}

//根据模板计算试卷总分
function calcTotalScoreByModel() {
    var v, total = 0;
    $("#tbTestModel tr").each(function () {
        v = $(this).find(".qTotalScore").text();
        if (v && !isNaN(v) && parseFloat(v) != 0) {
            total += parseFloat(v);
        }
    });
    return total;
}