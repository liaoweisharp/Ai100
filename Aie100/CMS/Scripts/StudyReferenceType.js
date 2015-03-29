/// <reference path="../../Scripts/jquery-1.4.1.min.js" />

//学习资料父类型定义
var enumParentTypes = [
    { id: "1", name: "类型1" },
    { id: "2", name: "类型2" },
    { id: "3", name: "类型3" }
];

var StudyReferTypeArray = [];
var ISBN = "";

function PageLoad() {
    InitCmsMenu("m_StudyReferenceType");

    $("#cms_toolbar #btnAdd").click(function () {
        editStudyReferType();
    });

    loadStudyReferTypeList();
}

function loadStudyReferTypeList() {
    var $contentbox = $(".cms_contentbox");

    $contentbox.show();
    $contentbox.showLoading();
    $excuteWS("~CmsWS.getStudyReferenceTypeList", { isbn: '', userExtend: SimpleUser }, bindStudyReferTypeList, null, { contentbox: $contentbox });
}

function bindStudyReferTypeList(result, context) {
    var $contentbox = context.contentbox;
    var $dataTable = $contentbox.find(".cms_datatable");

    $contentbox.hideLoading();
    $dataTable.find("tr:gt(0)").remove();
    if (!result || result.length == 0) {
        $dataTable.append("<tr class='nodata lightblue'><td colspan='2'>无记录</td></tr>");
        return;
    } else {
        StudyReferTypeArray = result;
    }

    var sBuilder = [];
    $.each(result, function (i) {
        if (i % 2 == 0) {
            rowClass = "class='lightblue'";
        } else {
            rowClass = "";
        }

        sBuilder = [];
        sBuilder.push("<tr id='" + this.id + "' " + rowClass + ">");
        sBuilder.push("<td>" + getParentTypeName(this.parentType) + "</td>");
        sBuilder.push("<td>" + this.type + "</td>");
        sBuilder.push("<td class='operate'><img src='Images/application_edit.png' title='编辑' onclick=\"editStudyReferType('" + this.id + "')\" />&nbsp;<img src='Images/application_delete.png' title='删除' onclick=\"deleteStudyReferType('" + this.id + "')\" /></td>");
        sBuilder.push("</tr>");
        $dataTable.append(sBuilder.join(''));
    });

    $dataTable.find("tr:gt(0)").hover(function () {
        $(this).addClass("hover");
    }, function () {
        $(this).removeClass("hover");
    });
}

function initStudyReferTypeBox() {
    var sBuilder = new Array();
    sBuilder.push("<div id='cms_StudyReferType' class='cms_dialog'>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'>父类型：</li>");
    sBuilder.push("    <li class='inp'>" + addParentTypeField() + "</li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp;类型名称：</li>");
    sBuilder.push("    <li class='inp'><input id='txtType' name='txtType' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("</div>");
    return sBuilder.join("");
}

//添加父类型字段
function addParentTypeField() {
    var sb = [];
    sb.push("<select id='ddlParentType' style='width:354px'>");
    for (var i = 0; i < enumParentTypes.length; i++) {
        sb.push("<option value='" + enumParentTypes[i].id + "'>" + enumParentTypes[i].name + "</option>");
    }
    sb.push("</select>");
    return sb.join("");

}

function editStudyReferType(id) {
    var title = "";
    var _id = "";
    if (id) {
        title = "编辑学习资料类型";
        _id = id;
    } else {
        title = "添加学习资料类型";
        _id = "";
    }

    var $jb = $.jBox(initStudyReferTypeBox(), { id: 'jb_StudyReferType', title: title, width: 580, top: "25%", buttons: { "保存": true, "取消": false }, submit: submitStudyReferType });
    var $studyReferType = $jb.find("#cms_StudyReferType");
    $studyReferType.data("_id", _id);

    if (id) {
        var studyReferType = getStudyReferTypeObj(id);
        $studyReferType.find("#txtType").val(studyReferType.type);
        if (studyReferType.parentType) {
            $studyReferType.find("#ddlParentType").val(studyReferType.parentType);
        }
    }
}

function getStudyReferTypeObj(id) {
    var studyReferType = null;
    for (var i = 0; i < StudyReferTypeArray.length; i++) {
        if (StudyReferTypeArray[i].id == id) {
            studyReferType = StudyReferTypeArray[i];
            break;
        }
    }
    return studyReferType;
}

function submitStudyReferType(v, h, f) {
    if (v == true) {
        var validData = validateForm(f);
        if (validData.isValid == false) {
            $.jBox.tip(validData.msg, 'warning');
            return false;
        }
        var srtWrapper = getStudyReferType(h);
        if (srtWrapper.id) {
            $excuteWS("~CmsWS.editStudyReferenceType", { studyReferenceTypeWrapper: srtWrapper, userExtend: SimpleUser }, onEditStudyReferType, null, null);
        } else {
            $excuteWS("~CmsWS.saveStudyReferenceType", { studyReferenceTypeWrapper: srtWrapper, userExtend: SimpleUser }, onSaveStudyReferType, null, null);
        }
        return false;
    }
}

function validateForm(f) {
    var validData = { isValid: true, msg: "" };
    if (f.txtType.trim() == "") {
        validData.isValid = false;
        validData.msg = "类型名称不能为空！";
    }
    return validData;
}

function getStudyReferType(h) {
    var studyReferType;
    var id = h.find("#cms_StudyReferType").data("_id");
    if (id) {
        studyReferType = getStudyReferTypeObj(id);
        studyReferType.parentType = h.find("#ddlParentType").val();
        studyReferType.type = h.find("#txtType").val().trim();
    } else {
        studyReferType = {};
        studyReferType.parentType = h.find("#ddlParentType").val();
        studyReferType.type = h.find("#txtType").val().trim();
    }
    return studyReferType;
}

function onSaveStudyReferType(result) {
    var studyReferType = result;
    if (!studyReferType) {
        $.jBox.tip("保存失败！", 'error');
    } else {
        $.jBox.close('jb_StudyReferType');
        StudyReferTypeArray.push(studyReferType);

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
        sBuilder.push("<tr id='" + studyReferType.id + "' " + rowClass + ">");
        sBuilder.push("<td>" + getParentTypeName(studyReferType.parentType) + "</td>");
        sBuilder.push("<td>" + studyReferType.type + "</td>");
        sBuilder.push("<td class='operate'><img src='Images/application_edit.png' title='编辑' onclick=\"editStudyReferType('" + studyReferType.id + "')\" />&nbsp;<img src='Images/application_delete.png' title='删除' onclick=\"deleteStudyReferType('" + studyReferType.id + "')\" /></td>");
        sBuilder.push("</tr>");
        $dataTable.append(sBuilder.join(''));
        $dataTable.find("tr:last").hover(function () {
            $(this).addClass("hover");
        }, function () {
            $(this).removeClass("hover");
        });
    }
}

function getParentTypeName(parentType) {
    var name = "";
    for (var i = 0; i < enumParentTypes.length; i++) {
        if (enumParentTypes[i].id == parentType) {
            name = enumParentTypes[i].name;
        }
    }
    return name;
}

function onEditStudyReferType(result) {
    var studyReferType = result;
    if (!studyReferType) {
        $.jBox.tip("更新失败！", 'error');
    } else {
        $.jBox.close('jb_StudyReferType');
        loadStudyReferTypeList(ISBN);
    }
}

function deleteStudyReferType(id) {
    var studyReferType = getStudyReferTypeObj(id);
    $.jBox.confirm("你确定要删除类型“" + studyReferType.type + "”吗?", "提示", function (v, h, f) {
        if (v == true) {
            $excuteWS("~CmsWS.deleteStudyReferenceType", { studyReferenceTypeWrapper: studyReferType, userExtend: SimpleUser }, function (result) {
                if (result) {
                    loadStudyReferTypeList(ISBN);
                } else {
                    $.jBox.tip("删除失败！", 'error');
                }
            }, null, null);
        }
    }, { top: "25%", buttons: { "确定": true, "取消": false} });
}