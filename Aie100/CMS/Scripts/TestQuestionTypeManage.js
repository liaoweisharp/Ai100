/// <reference path="../../Scripts/jquery-1.4.1.min.js" />

var TestQuestionTypeManageArray = [];
var QuestionTypeArray = [];
function PageLoad() {
    InitCmsMenu("m_TestQuestionTypeManage");
    
    var $contentbox = $(".cms_contentbox");
    $contentbox.showLoading();
    $excuteWS("~CmsWS.getQuestionTypeList", { userExtend: SimpleUser }, function (r) {
        QuestionTypeArray = r;
        loadTestQuestionTypeManage();
    }, null, { userContext: "getQuestionTypeList" });
    $("#cms_toolbar #btnAdd").click(function () {
        editTestQuestionTypeManage();
    });
}

function loadTestQuestionTypeManage() {
    var $contentbox = $(".cms_contentbox");
    $excuteWS("~CmsWS.getTestQuestionTypeSystemList", { userExtend: SimpleUser }, bindTestQuestionTypeManage, null, { contentbox: $contentbox });
}

function getQuestionTypeNameById(_questionTypeId) {
    if (QuestionTypeArray) {
        for (var i = 0; i < QuestionTypeArray.length; i++) {
            if (QuestionTypeArray[i].id == _questionTypeId) {
                return QuestionTypeArray[i].type;
            }
        }
    } else {
        return _questionTypeId;
    }
}

function bindTestQuestionTypeManage(result, context) {
    var $contentbox = context.contentbox;
    var $dataTable = $contentbox.find(".cms_datatable");
    
    $contentbox.hideLoading();
    $dataTable.find("tr:gt(0)").remove();
    if (!result || result.length == 0) {
        $dataTable.append("<tr class='nodata lightblue'><td colspan='6'>无记录</td></tr>");
        return;
    } else {
        TestQuestionTypeManageArray = result;
    }
    
    var sBuilder = [];
    var rowClass = "";
    
    $.each(result, function (i) {
        if (i % 2 == 0) {
            rowClass = "class='lightblue'";
        } else {
            rowClass = "";
        }

        sBuilder = [];
        sBuilder.push("<tr id='" + this.id + "' " + rowClass + ">");
        sBuilder.push("<td>" + this.title + "</td>");
        sBuilder.push("<td>" + this.description + "</td>");
        sBuilder.push("<td>" + getQuestionTypeNameById(this.questionTypeId) + "</td>");
        sBuilder.push("<td>" + this.typeOrder + "</td>");
        sBuilder.push("<td class='operate'><img src='Images/application_edit.png' title='编辑' onclick=\"editTestQuestionTypeManage('" + this.id + "')\" />&nbsp;<img src='Images/application_delete.png' title='删除' onclick=\"deleteTestQuestionTypeManage('" + this.id + "')\" /></td>");
        sBuilder.push("</tr>");
        $dataTable.append(sBuilder.join(''));
    });

    $dataTable.find("tr:gt(0)").hover(function () {
        $(this).addClass("hover");
    }, function () {
        $(this).removeClass("hover");
    });
}

function editTestQuestionTypeManage(id) {
    var title = "";
    var _id = "";
    if (id) {
        title = "编辑试题类型";
        _id = id;
    } else {
        title = "添加试题类型";
        _id = "";
    }

    var $jb = $.jBox(initTestQuestionTypeManageBox(), { id: 'jb_cmsTestQuestionTypeManage', title: title, width: 580, top: "25%", buttons: { "保存": true, "取消": false }, submit: submitGradation });
    var $testQuestionType = $jb.find("#cms_dialog_gradation");
    $testQuestionType.data("_id", _id);

    if (id) {
        var testQuestionType = getTestQuestionTypeManageObj(id);

        with ($testQuestionType) {
            find("#txtTestQuestionType").val(testQuestionType.title);
            find("#ddlQuestionType").val(testQuestionType.questionTypeId);
            find("#txtTypeOrder").val(testQuestionType.typeOrder);
            find("#txtDescription").val(testQuestionType.description);
        }
    }
}

function deleteTestQuestionTypeManage(id) {
    
    var testQuestionTypeManage = getTestQuestionTypeManageObj(id);
    $.jBox.confirm("你确定要删除试题类型“" + testQuestionTypeManage.title + "”吗?", "提示", function (v, h, f) {
        if (v == true) {
            $excuteWS("~CmsWS.deleteTestQuestionType", { testQuestionTypeW: {id:id}, userExtend: SimpleUser }, function (result) {
                if (result) {
                    loadTestQuestionTypeManage();
                } else {
                    $.jBox.tip("删除失败！", 'error');
                }
            }, null, null);
        }
    }, { top: "25%", buttons: { "确定": true, "取消": false } });
}

function initTestQuestionTypeManageBox() {
    var sBuilder = new Array();
    sBuilder.push("<div id='cms_dialog_gradation' class='cms_dialog'>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp; 试题类型：</li>");
    sBuilder.push("    <li class='inp'><input id='txtTestQuestionType' name='txtTestQuestionType' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp;答案类型：</li>");
    sBuilder.push("    <li class='inp'><select id='ddlQuestionType' name='ddlQuestionType' style='width:100%;'><option value=''>选择答案类型</option>");
    if (QuestionTypeArray && QuestionTypeArray.length > 0) {
        for (var i = 0; i < QuestionTypeArray.length; i++) {
            sBuilder.push("<option value='" + QuestionTypeArray[i].id + "'>" + QuestionTypeArray[i].type + "</option>");
        }
    }
    sBuilder.push("</select></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp; 序号：</li>");
    sBuilder.push("    <li class='inp'><input id='txtTypeOrder' name='txtTypeOrder' type='text' style='width:50px;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp; 描述：</li>");
    sBuilder.push("    <li class='inp'><input id='txtDescription' name='txtDescription' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("</div>");
    return sBuilder.join("");
}

function submitGradation(v, h, f) {
    if (v == true) {
        var validData = validateForm(f);
        if (validData.isValid == false) {
            $.jBox.tip(validData.msg, 'warning');
            return false;
        }
        var testQuestionTypeWrapper = getTestQuestionType(h);
        var testQuestionTypeId = h.find("#cms_dialog_gradation").data("_id");
        
        if (testQuestionTypeId != "") {
            testQuestionTypeWrapper.id = testQuestionTypeId;
            $excuteWS("~CmsWS.manageTestQuestionTypes", { testQuestionTypes: [testQuestionTypeWrapper], userExtend: SimpleUser }, onEditTestQuestionType, null, null);
        } else {
            $excuteWS("~CmsWS.manageTestQuestionTypes", { testQuestionTypes: [testQuestionTypeWrapper], userExtend: SimpleUser }, onSaveTestQuestionType, null, null);
        }
        return false;
    }
}

function getTestQuestionTypeManageObj(id) {
    var testQuestionType = null;
    for (var i = 0; i < TestQuestionTypeManageArray.length; i++) {
        if (TestQuestionTypeManageArray[i].id == id) {
            testQuestionType = TestQuestionTypeManageArray[i];
            break;
        }
    }
    return testQuestionType;
}

function validateForm(f) {
    var validData = { isValid: true, msg: "" };
    if (f.txtTestQuestionType.trim() == "") {
        validData.isValid = false;
        validData.msg = "阶段名称不能为空！";
    }
    else if (f.txtTypeOrder.trim() == "") {
        validData.isValid = false;
        validData.msg = "序号不能为空！";
    } else if (isNaN(f.txtTypeOrder.trim())) {
        validData.isValid = false;
        validData.msg = "序号必须为数字！";
    }
    return validData;
}

function getTestQuestionType(h) {
    var testQuestionType = {};
    testQuestionType.userId = SimpleUser.userId;
    testQuestionType.title = h.find("#txtTestQuestionType").val().trim();
    testQuestionType.questionTypeId = h.find("#ddlQuestionType").val().trim();
    testQuestionType.typeOrder = h.find("#txtTypeOrder").val().trim();
    testQuestionType.description = h.find("#txtDescription").val().trim();
    
    return testQuestionType;
}

function onSaveTestQuestionType(result) {
    onEditTestQuestionType(result);
    return;
    var testQuestionType = result;
    if (!testQuestionType) {
        $.jBox.tip("保存失败！", 'error');
    } else {
        $.jBox.close('jb_cmsTestQuestionTypeManage');
        TestQuestionTypeManageArray.push(testQuestionType);

        var $dataTable = $(".cms_contentbox .cms_datatable");
        var rowCount = $dataTable.find("tr:gt(0)").length;
        if (rowCount == 1) {
            var $fRow = $dataTable.find("tr:eq(1)");
            if ($fRow.hasClass("nodata")) {
                $fRow.remove();
                rowCount--;
            }
        }
        rowCount++;
        var rowClass = "";
        if (rowCount % 2 != 0) {
            rowClass = "class='lightblue'";
        }



        sBuilder = new Array();
        sBuilder.push("<tr id='" + testQuestionType.id + "' " + rowClass + ">");
        sBuilder.push("<td>" + testQuestionType.title + "</td>");

        sBuilder.push("<td class='operate'><img src='Images/application_edit.png' title='编辑' onclick=\"editTestQuestionTypeManage('" + testQuestionType.id + "')\" />&nbsp;<img src='Images/application_delete.png' title='删除' onclick=\"deleteTestQuestionTypeManage('" + testQuestionType.id + "')\" /></td>");
        sBuilder.push("</tr>");
        $dataTable.append(sBuilder.join(''));
        $dataTable.find("tr:last").hover(function () {
            $(this).addClass("hover");
        }, function () {
            $(this).removeClass("hover");
        });
    }
}

function onEditTestQuestionType(result) {
    var testQuestionType = result;
    if (!testQuestionType) {
        $.jBox.tip("更新失败！", 'error');
    } else {
        $.jBox.close('jb_cmsTestQuestionTypeManage');
        loadTestQuestionTypeManage();
    }
}