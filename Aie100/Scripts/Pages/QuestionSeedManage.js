/// <reference path="../JQuery/jquery-1.6.1.min.js" />
/// <reference path="../CommFunction/QuestionTemplate.js" />
/// <reference path="../JQuery/jquery.ajax.js" />

var args = null;
var simpleUser = null;
$(function () {
    args = GetUrlParms();
    $excuteWS("~CmsWS.getSimpleUser", { userId: args["userId"], sectionId: args["sectionId"] }, function (result1) {
        if (result1.roleId != "2") {
            alert("error");
            return;
        }
        simpleUser = result1;
        getExsitSeedQuestionInfo(true);
        $("#btnGetDiffQuestion").click(function () {
            $("#divDiffQuestionInfo").html('<div class="loadingData" style="padding:5px;"><center><img alt="加载中..." src="../Images/ajax-loader_02.gif" /></center></div>');
            $excuteWS("~CmsWS.getQuestionAndReferenceAnswersSeedList", { questionId: args["questionId"], existFlag: false, userExtend: simpleUser }, function (result2) {
                if (result2) {
                    $("#divDiffQuestionInfo").find("div[class=loadingData]").remove();
                    getQuestionTemplate({ container: $("#divDiffQuestionInfo"), order: "0.", question: result2[0][0], referenceArray: result2[0][1] });
                    $("#btnSaveQuestionSeed").unbind("click").click(function () {

                        $excuteWS("~CmsWS.saveQpvSeed", { qavs: result2[0][3], questionId: args["questionId"] }, function (result3) {
                            if (result3) {
                                $("#divDiffQuestionInfo").html('<div style="padding:5px;font-size:11px;color:gray;">请点击按钮产生一个种子</div>');
                                $("#btnSaveQuestionSeed").hide();
                                getExsitSeedQuestionInfo();
                            } else {
                                alert("error");
                            }
                        }, null, { userContext: "saveQpvSeed" });
                    }).show();

                } else {
                    $("#btnSaveQuestionSeed").hide();
                    $("#divDiffQuestionInfo").html('<div style="padding:5px;font-size:11px;color:gray;">没有考试题信息.</div>');
                }
            }, null, { userContext: "getQuestionAndReferenceAnswersSeedList" });
        });
    }, null, { userContext: "getSimpleUser" });

    $("#btnGetSomeSeedsInfo").click(function () {

        $excuteWS("~CmsWS.saveQpvSeedByQuestionIds", { questionIds: [args["questionId"]], num: $("#txtNumOfSeeds").val(), userExtendWrapper: simpleUser }, function (r) {
            if (r) {
                getExsitSeedQuestionInfo();
                $("#divGetSomeSeedInfo").hide();
            }
        }, null, { userContext: "saveQpvSeedByQuestionIds" });
    });
})

function getExsitSeedQuestionInfo(flg) {
    $("#divExistSeedQuestionInfo").html('<div class="loadingData" style="padding:5px;"><center><img alt="加载中..." src="../Images/ajax-loader_02.gif" /></center></div>');
    $excuteWS("~CmsWS.getQuestionAndReferenceAnswersSeedList", { questionId: args["questionId"], existFlag: true, userExtend: simpleUser }, function (result2) {
        if (result2) {
            for (var i = 0; i < result2.length; i++) {

                getQuestionTemplate({ container: $("#divExistSeedQuestionInfo"), order: (i + 1) + ".", question: result2[i][0], referenceArray: result2[i][1], qpvSeedId: result2[i][2] });
                $("#divExistSeedQuestionInfo").append($("<br/>"));
            }
            $("#divExistSeedQuestionInfo").find("div[class=loadingData]").remove();
        } else {
            $("#divExistSeedQuestionInfo").html('<div style="padding:5px;font-size:11px;color:gray;">没有考试题信息.</div>');
            if (flg) {
                $("#divGetSomeSeedInfo").show();
            }
        }
    }, null, { userContext: "getQuestionAndReferenceAnswersSeedList" });
}

function getQuestionTemplate(json) {
    var o = json.container;
    var order = json.order;
    var qpvSeedId = json.qpvSeedId;
    var question=json.question;
    var referenceArray = json.referenceArray;

    if (!question) {
        return "";
    }
    var htmlArray = new Array();
    htmlArray.push('<table class="questionTemplate" questionId="' + question.id + '" width="100%" cellpadding="3" cellspacing="0" border="0">');
    htmlArray.push('<tr>');
    var img = qpvSeedId ? '<img title="Remove" qpvSeedId="' + qpvSeedId + '" class="removeSeed" src="../CMS/Images/application_delete.png" alt="" />' : '&nbsp;';
    htmlArray.push('<td class="tdCheckBox">'+img+'</td>');
    htmlArray.push('<td class="tdNumber">'+order+'</td>');
    htmlArray.push('<td>'+question.content+'</td>');
    htmlArray.push('</tr>');
    htmlArray.push('<tr>');
    htmlArray.push('<td class="tdCheckBox">&nbsp;</td>');
    htmlArray.push('<td class="tdNumber">&nbsp;</td>');
    htmlArray.push('<td>');
    htmlArray.push('<div class="referenceAnswer">');
    var questionTypeId = question.questionTypeId;
    if (referenceArray && referenceArray.length > 0) {

        if (questionTypeId == "1" || questionTypeId == "2" || questionTypeId == "11" || questionTypeId == "4" || questionTypeId == "8") {
            var radioOrCheckboxStr = (questionTypeId == "2" || questionTypeId == "11"
            || questionTypeId == "4" || questionTypeId == "8") ? ' type="checkbox" ' : ' type="radio" ';
            for (var r1 = 0; r1 < referenceArray.length; r1++) {
                if (referenceArray[r1].correctFlag == "1") {
                    htmlArray.push('<div><input ' + radioOrCheckboxStr + ' disabled="disabled" checked="checked"/>&nbsp;' + referenceArray[r1].content + '</div>');
                } else {
                    htmlArray.push('<div><input ' + radioOrCheckboxStr + ' disabled="disabled"/>&nbsp;' + referenceArray[r1].content + '</div>');
                }
            }
        } else if (questionTypeId == "3" || questionTypeId == "9" || questionTypeId == "13") {

            for (var r2 = 0; r2 < referenceArray.length; r2++) {
                if (referenceArray[r2].correctFlag == "1") {
                    htmlArray.push('<input checked="checked" type="radio" disabled="disabled" />' + referenceArray[r2].content);
                } else {
                    if (r2 != 0) {
                        htmlArray.push('&nbsp;&nbsp;<input type="radio" disabled="disabled" /> ' + referenceArray[r2].content);
                    } else {
                        htmlArray.push('<input type="radio" disabled="disabled" /> ' + referenceArray[r2].content);
                    }
                }
            }

        }
    }
    htmlArray.push('</div>');
    htmlArray.push('</td>');
    htmlArray.push('</tr>');

    htmlArray.push('<tr>');
    htmlArray.push('<td colspan="3">');

    htmlArray.push('<div class="questionTabs">');
    htmlArray.push('</div>');

    htmlArray.push('</td>');
    htmlArray.push('</tr>');

    htmlArray.push('</table>');
    var $tbQuestion = $(htmlArray.join(''));
    $tbQuestion.find("img[class=removeSeed]").click(function () {
        if (confirm("你确定要删除该题吗?")) {
            var _qpvSeedId = $(this).attr("qpvSeedId");
            $excuteWS("~CmsWS.removeQpvSeed", { qpvSeedId: _qpvSeedId }, function (result4) {
                if (result4) {
                    getExsitSeedQuestionInfo();
                } else {
                    alert("error");
                }
            }, null, { userContext: "removeQpvSeed" });
        }
    });
    $EmathTab_GetTabView({ tabContainer: $tbQuestion.find("div[class=questionTabs]"), showTopButton: false, showNullContent: true, defaultTabIndex: 0, tabContent: [{ title: "解题过程", content: question.solution }, { title: "提示", content: question.hint}] });
    o.append($tbQuestion);
    
}

