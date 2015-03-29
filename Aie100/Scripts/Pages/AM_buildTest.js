/// <reference path="AM_TestManageGlobal.js" />
/// <reference path="AM_Common.js" />
/// <reference path="AM_TestInfo.js" />
/// <reference path="AM_TestModel.js" />
/// <reference path="AM_ComposeTest.js" />

/*
* 创建考试
*/

//显示或隐藏创建考试层
function showBuildTestBox(b) {
    if (b) {
        $("#dvAssignmentBox").hide();
        $("#dvBuildTestBox").show();
    } else {
        $("#dvAssignmentBox").show();
        $("#dvBuildTestBox").hide();
    }
}

//关闭创建考试层
function closeBuildTestBox() {
    showBuildTestBox(false);
    resetBuildTestForm();
}

//初始化创建考试层
function initBuildTestBox() {
    $(".custab_bg ul").bind("click", onSelViewModelTab);
    $("#btnBuildTest").bind("click", onBuildTest);
    $("#btnSaveTestQuestion").bind("click", saveTestQuestion);
    $("#btnAddQuestion").bind("click", onAddQuestion);
    $("#btnConfirmSel").bind("click", onConfirmAddQuestion);
    $("#btnCloseSel").bind("click", closeSelectQuestionBox);

    $(window).resize(function () {
        ResetTreeNavFrameHeight("bookStructureTree", "dvQuesBox");
        setQuestionContentHeight();
    });
    resetBuildTestForm();
}

//重置创建考试表单
function resetBuildTestForm() {
    $("#dlg_txtTestName").val("");
    $("#dlg_ddlDifficultye").val("3");
    $("#dlg_TimeLength").val("");
    $("#rdStdVisible_n").attr("checked", true);
    $("#dlg_Description").val("");
    $("#spTestModelName").data("_id", "").html("").prev().hide();
    $("#btnAddQuestion").attr("disabled", "disabled");
    $("#btnSaveTestQuestion").attr("disabled", "disabled");

    $("#bookStructureTree").data("_isNewLoad", true);   //表示数需要重新加载
    $("#dvTestQuesType").val("");
    $("#dvViewModel").hide();
    $("#tbQuesList").empty();
    $("#dvQuestionList").hide();

    $("#txtTestModelName").val("");
    $("#dvTestModel").hide().find("#tbTestModel").empty();
    $("#dvTestModel").data("_id", "").data("_isDirty", false);

}

//设置题显示高度
function setQuestionContentHeight() {
    var h = $("#dvQuesBox").height() - $("#dvViewModel").height() - 49;
    $("#dvQuestionList").height(h);
    $("#dvSelQuesList").height($("#dvQuesBox").height() - 30);
}
