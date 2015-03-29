/// <reference path="../../Scripts/jquery-1.4.1.min.js" />

var GradationArray = [];

function PageLoad() {
    InitCmsMenu("m_Gradation");
    loadGradationList();
    $("#cms_toolbar #btnAdd").click(function () {
        editGradation();
    });
}

function loadGradationList() {
    var $contentbox = $(".cms_contentbox");
    $contentbox.showLoading();
    $excuteWS("~CmsWS.getGradationList", { userExtend: SimpleUser }, bindGradationList, null, { contentbox: $contentbox });
}

function bindGradationList(result, context) {
    var $contentbox = context.contentbox;
    var $dataTable = $contentbox.find(".cms_datatable");

    $contentbox.hideLoading();
    $dataTable.find("tr:gt(0)").remove();
    if (!result || result.length == 0) {
        $dataTable.append("<tr class='nodata lightblue'><td colspan='6'>无记录</td></tr>");
        return;
    } else {
        GradationArray = result;
    }

    var sBuilder = [];
    var rowClass = "";
    var sequence = "";
    var isAvailable = "";

    $.each(result, function (i) {
        if (i % 2 == 0) {
            rowClass = "class='lightblue'";
        } else {
            rowClass = "";
        }

        sequence = (this.sequence) ? this.sequence : "";
        if (this.flag) {
            isAvailable = (this.flag == "1") ? "是" : "否";
        } else {
            isAvailable = "";
        }

        sBuilder = [];
        sBuilder.push("<tr id='" + this.id + "' " + rowClass + ">");
        sBuilder.push("<td>" + this.gradationName + "</td>");
        sBuilder.push("<td>" + sequence + "</td>");
        sBuilder.push("<td>" + isAvailable + "</td>");
        sBuilder.push("<td class='operate'><img src='Images/application_edit.png' title='编辑' onclick=\"editGradation('" + this.id + "')\" />&nbsp;<img src='Images/application_delete.png' title='删除' onclick=\"deleteGradation('" + this.id + "')\" /></td>");
        sBuilder.push("</tr>");
        $dataTable.append(sBuilder.join(''));
    });

    $dataTable.find("tr:gt(0)").hover(function () {
        $(this).addClass("hover");
    }, function () {
        $(this).removeClass("hover");
    });
}

function editGradation(id) {
    var title = "";
    var _id = "";
    if (id) {
        title = "编辑阶段";
        _id = id;
    } else {
        title = "添加阶段";
        _id = "";
    }

    var $jb = $.jBox(initGradationBox(), { id: 'jb_cmsGradation', title: title, width: 580, top: "25%", buttons: { "保存": true, "取消": false }, submit: submitGradation });
    var $gradation = $jb.find("#cms_dialog_gradation");
    $gradation.data("_id", _id);

    if (id) {
        var gradation = getGradationObj(id);
        var isAvailable = (gradation.flag == "1") ? true : false;
        with ($gradation) {
            find("#txtGradationName").val(gradation.gradationName);
            find("#txtSequence").val(gradation.sequence);
            find("#cbxIsAvailable").attr("checked", isAvailable);
        }
    }
}

function deleteGradation(id) {
    
    var gradation = getGradationObj(id);
    $.jBox.confirm("你确定要删除阶段“" + gradation.gradationName + "”吗?", "提示", function (v, h, f) {
        if (v == true) {
            $excuteWS("~CmsWS.deleteGradation", { gradationId: id , userExtend: SimpleUser }, function (result) {
                if (result) {
                    loadGradationList();
                } else {
                    $.jBox.tip("删除失败！", 'error');
                }
            }, null, null);
        }
    }, { top: "25%", buttons: { "确定": true, "取消": false } });
}

function initGradationBox() {
    var sBuilder = new Array();
    sBuilder.push("<div id='cms_dialog_gradation' class='cms_dialog'>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp; 阶段名称：</li>");
    sBuilder.push("    <li class='inp'><input id='txtGradationName' name='txtGradationName' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'>序号：</li>");
    sBuilder.push("    <li class='inp'><input id='txtSequence' name='txtSequence' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'>&nbsp;</li>");
    sBuilder.push("    <li class='inp'><input id='cbxIsAvailable' name='cbxIsAvailable' type='checkbox' checked='checked' />&nbsp;<label for='cbxIsAvailable'>该类型可用</label></li>");
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
        var gradationWrapper = getGradation(h);
        var gradationId = h.find("#cms_dialog_gradation").data("_id");
        
        if (gradationId != "") {
            gradationWrapper.id = gradationId;
            $excuteWS("~CmsWS.editGradation", { gradationW: gradationWrapper, userExtend: SimpleUser }, onEditGradation, null, null);
        } else {
            $excuteWS("~CmsWS.saveGradation", { gradationW: gradationWrapper, userExtend: SimpleUser }, onSaveGradation, null, null);
        }
        return false;
    }
}

function getGradationObj(id) {
    var gradation = null;
    for (var i = 0; i < GradationArray.length; i++) {
        if (GradationArray[i].id == id) {
            gradation = GradationArray[i];
            break;
        }
    }
    return gradation;
}

function validateForm(f) {
    var validData = { isValid: true, msg: "" };
    if (f.txtGradationName.trim() == "") {
        validData.isValid = false;
        validData.msg = "阶段名称不能为空！";
    }
    return validData;
}

function getGradation(h) {
    var gradation = {};
    gradation.gradationName = h.find("#txtGradationName").val().trim();
    gradation.sequence = h.find("#txtSequence").val().trim();
    gradation.flag = h.find("#cbxIsAvailable").is(":checked") ? "1" : "0";
    return gradation;
}

function onSaveGradation(result) {
    onEditGradation(result);
    return;
    var gradation = result;
    if (!gradation) {
        $.jBox.tip("保存失败！", 'error');
    } else {
        $.jBox.close('jb_cmsGradation');
        GradationArray.push(gradation);

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

        var sequence = (gradation.sequence) ? gradation.sequence : "";
        var isAvailable = "";
        if (gradation.flag) {
            isAvailable = (gradation.flag == "1") ? "是" : "否";
        }

        sBuilder = new Array();
        sBuilder.push("<tr id='" + gradation.id + "' " + rowClass + ">");
        sBuilder.push("<td>" + gradation.gradationName + "</td>");
        sBuilder.push("<td>" + sequence + "</td>");
        sBuilder.push("<td>" + isAvailable + "</td>");
        sBuilder.push("<td class='operate'><img src='Images/application_edit.png' title='编辑' onclick=\"editGradation('" + gradation.id + "')\" />&nbsp;<img src='Images/application_delete.png' title='删除' onclick=\"deleteGradation('" + gradation.id + "')\" /></td>");
        sBuilder.push("</tr>");
        $dataTable.append(sBuilder.join(''));
        $dataTable.find("tr:last").hover(function () {
            $(this).addClass("hover");
        }, function () {
            $(this).removeClass("hover");
        });
    }
}

function onEditGradation(result) {
    var gradation = result;
    if (!gradation) {
        $.jBox.tip("更新失败！", 'error');
    } else {
        $.jBox.close('jb_cmsGradation');
        loadGradationList();
    }
}