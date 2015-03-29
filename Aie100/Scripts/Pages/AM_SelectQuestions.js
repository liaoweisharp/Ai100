/// <reference path="AM_TestManageGlobal.js" />
/// <reference path="AM_Common.js" />

/*
* 创建考试:组卷中添加（替换）题
*/

//显示选择题的层
function showSelectQuestionBox(flag) {
    $("#dvQuesBox").hide();
    $("#dvSelQuesBox").show();
    SelectedQuestions = [];

    var $dvSelQuesBox = $("#dvSelQuesBox");
    if (flag == "add") {
        //添加题：显示可以添加的数量
        var testQuestionTypeId = $("#dvTestQuesType li.selected").attr("id");
        var allowNum = getAllowNumForQuesGroup(testQuestionTypeId);
        $dvSelQuesBox.find("span.added").html("0");
        $dvSelQuesBox.find("span.allowNum").html(allowNum);
        $dvSelQuesBox.find("#spAllowNum").show();
    } else {
        //替换题
        $dvSelQuesBox.find("#spAllowNum").hide();
    }
}

//隐藏选择题的层
function closeSelectQuestionBox() {
    $("#dvQuesBox").show();
    $("#dvSelQuesBox").hide();
}

//确认添加题
function onConfirmAddQuestion() {
    if (SelectedQuestions.length == 0) {
        $.jBox.tip('请选要添加的择题！', 'info');
        return;
    } else {
        closeSelectQuestionBox();
    }

    //母题Id集合
    var mQuestionIds = [];
    //母题参数集合
    var qpvSeedIds = [];

    for (var i = 0; i < SelectedQuestions.length; i++) {
        if (SelectedQuestions[i].parentFlag == "1") {
            mQuestionIds.push(SelectedQuestions[i].id);
            qpvSeedIds.push(SelectedQuestions[i].qpvSeedId);
        }
    }

    var testQuestionTypeId = $("#dvTestQuesType li.selected").attr("id");
    var viewModel = $("#dvViewModel ul.custab_ul_s").attr("id");
    if (mQuestionIds.length > 0) {
        //返回母题对应的子题
        $excuteWS("~CmsWS.getSubQuestionListByIds", { questionIds: mQuestionIds, qpvSeedIds: qpvSeedIds, usersExtendWrapper: SimpleUser.user }, function (subQuestions) {
            if (subQuestions && subQuestions.length > 0) {
                var sqs = [];
                for (var i = 0; i < SelectedQuestions.length; i++) {
                    if (SelectedQuestions[i].parentFlag == "1") {
                        sqs = subQuestions.findAll("parentId", SelectedQuestions[i].id);
                        SelectedQuestions[i].subQuestions = sqs;
                    }
                }
                _addQuestionObjs(testQuestionTypeId, SelectedQuestions);
                checkQuestionNum();
                if (viewModel == "ulByQuestion") {
                    addQuesListContent(SelectedQuestions);
                } else {
                    addLoQuesListContent(SelectedQuestions);
                }
            }
        }, null, null);
    } else {
        _addQuestionObjs(testQuestionTypeId, SelectedQuestions);
        checkQuestionNum();
        if (viewModel == "ulByQuestion") {
            addQuesListContent(SelectedQuestions);
        } else {
            addLoQuesListContent(SelectedQuestions);
        }
    }
}

//生成替换题列表
function buildRepQuestionList(quesObjArray) {
    $("#tdRightBox").hideLoading();
    AlternativeQuestions = quesObjArray;
    var trs = [];
    for (var i = 0; i < quesObjArray.length; i++) {
        trs.push("<tr>");
        trs.push("<td class='oper'><a href='javascript:void(0)' onclick='replaceQuestion(\"" + quesObjArray[i].id + "\")'>选择</a></td>");
        trs.push("<td class='content'>" + quesObjArray[i].content + "</td>");
        trs.push("</tr>");
    }
    var $dt = $("#dvSelQuesList table.tbQuestionList");
    $dt.find("tr:gt(0)").remove();
    $dt.append(trs.join("")).find("tr:gt(0):even").addClass("highlight");
}

//生成添加新题列表
function buildAddQuestionList(quesObjArray) {
    $("#tdRightBox").hideLoading();
    AlternativeQuestions = quesObjArray;

    //生成列表
    var n, cbxStatus, rsty, trs = [];
    for (var i = 0; i < quesObjArray.length; i++) {
        rsty = "";
        cbxStatus = "";
        n = SelectedQuestions.indexOf("id", quesObjArray[i].id);
        if (n != -1) {
            rsty = "class='selectrow'";
            cbxStatus = "checked='checked'";
        }
        trs.push("<tr " + rsty + ">");
        trs.push("<td class='oper'><input type='checkbox' id='" + quesObjArray[i].id + "' " + cbxStatus + " ></td>");
        trs.push("<td class='content'>" + quesObjArray[i].content + "</td>");
        trs.push("</tr>");
    }
    var $dt = $("#dvSelQuesList table.tbQuestionList");
    $dt.find("tr:gt(0)").remove();
    $dt.append(trs.join("")).find("tr:gt(0):even").addClass("highlight");
    $dt.find(".oper input").bind("click", onSelectAddQuestion);
}

var pageSize = 8;
function bindQuestionPagination(questionIdArray, fn) {
    if (questionIdArray.length > 0) {
        QuestionIdArray = questionIdArray;
        $("div.pagination").html("").pagination(questionIdArray.length, {
            num_edge_entries: 2,
            num_display_entries: 5,
            items_per_page: pageSize,
            prev_text: "上一页",
            next_text: "下一页",
            callback: function (page_index, o) {
                $("#tdRightBox").showLoading();
                var _startPos = page_index * pageSize;
                var _endPos = _startPos + (pageSize - 1);
                var questionIds = getIdsArray(questionIdArray, _startPos, _endPos);
                $excuteWS("~CmsWS.getQuestionFCList", { questionIds: questionIds, usersExtendWrapper: SimpleUser.user }, fn, null, null);
            }
        });
    }
}