/// <reference path="../../Scripts/jquery-1.4.1.min.js" />

var LoCategoryArray = [];

function PageLoad() {
    InitCmsMenu("m_LOCategory");

    $("#cms_toolbar #btnAdd").click(function () {
        editLoCategory();
    });

    loadLoCategoryList();
}

function loadLoCategoryList() {
    var $contentbox = $(".cms_contentbox");
    $contentbox.showLoading();
    $excuteWS("~CmsWS.getLoCategoryList", { userExtend: SimpleUser }, bindLoCategoryList, null, { contentbox: $contentbox });
}

function bindLoCategoryList(result, context) {
    var $contentbox = context.contentbox;
    var $dataTable = $contentbox.find(".cms_datatable");

    $contentbox.hideLoading();
    $dataTable.find("tr:gt(0)").remove();
    if (!result || result.length == 0) {
        $dataTable.append("<tr class='nodata lightblue'><td colspan='3'>无记录</td></tr>");
        return;
    } else {
        LoCategoryArray = result;
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
        sBuilder.push("<td>" + this.name + "</td>");
        sBuilder.push("<td>" + this.description + "</td>");
        sBuilder.push("<td class='operate'><img src='Images/application_edit.png' title='编辑' onclick=\"editLoCategory('" + this.id + "')\" />&nbsp;<img src='Images/application_delete.png' title='删除' onclick=\"deleteLoCategory('" + this.id + "')\" /></td>");
        sBuilder.push("</tr>");
        $dataTable.append(sBuilder.join(''));
    });

    $dataTable.find("tr:gt(0)").hover(function () {
        $(this).addClass("hover");
    }, function () {
        $(this).removeClass("hover");
    });
}

function initLoCategoryBox() {
    var sBuilder = new Array();
    sBuilder.push("<div id='cms_LoCategory' class='cms_dialog'>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp; 类型名称：</li>");
    sBuilder.push("    <li class='inp'><input id='txtCategory' name='txtCategory' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'>描述：</li>");
    sBuilder.push("    <li class='inp'><input id='txtDescription' name='txtDescription' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("</div>");
    return sBuilder.join("");
}

function editLoCategory(id) {
    var title = "";
    var _id = "";
    if (id) {
        title = "编辑知识点类型";
        _id = id;
    } else {
        title = "添加知识点类型";
        _id = "";
    }

    var $jb = $.jBox(initLoCategoryBox(), { id: 'jb_LoCategory', title: title, width: 580, top: "25%", buttons: { "保存": true, "取消": false }, submit: submitLoCategory });
    var $loCategory = $jb.find("#cms_LoCategory");
    $loCategory.data("_id", _id);

    if (id) {
        var loCategory = getLoCategoryObj(id);
        $loCategory.find("#txtCategory").val(loCategory.name);
        $loCategory.find("#txtDescription").val(loCategory.description);
    }
}

function deleteLoCategory(id) {
    var loCategory = getLoCategoryObj(id);
    $.jBox.confirm("你确定要删除类型“" + loCategory.name + "”吗?", "提示", function (v, h, f) {
        if (v == true) {
            $excuteWS("~CmsWS.deleteLoCategory", { loCategoryW: { id: id }, userExtend: SimpleUser }, function (result) {
                if (result) {
                    loadLoCategoryList();
                } else {
                    $.jBox.tip("删除失败！", 'error');
                }
            }, null, null);
        }
    }, { top: "25%", buttons: { "确定": true, "取消": false} });
}

function submitLoCategory(v, h, f) {
    if (v == true) {
        var validData = validateForm(f);
        if (validData.isValid == false) {
            $.jBox.tip(validData.msg, 'warning');
            return false;
        }
        var loCategoryWrapper = getLoCategory(f);
        var loCategoryId = h.find("#cms_LoCategory").data("_id");
        if (loCategoryId != "") {
            loCategoryWrapper.id = loCategoryId;
            $excuteWS("~CmsWS.editLoCategory", { loCategoryW: loCategoryWrapper, userExtend: SimpleUser }, onEditLoCategory, null, null);
        } else {
            $excuteWS("~CmsWS.saveLoCategory", { loCategoryW: loCategoryWrapper, userExtend: SimpleUser }, onSaveLoCategory, null, null);
        }
        return false;
    }
}

function getLoCategoryObj(id) {
    var loCategory = null;
    for (var i = 0; i < LoCategoryArray.length; i++) {
        if (LoCategoryArray[i].id == id) {
            loCategory = LoCategoryArray[i];
            break;
        }
    }
    return loCategory;
}

function validateForm(f) {
    var validData = { isValid: true, msg: "" };
    if (f.txtCategory.trim() == "") {
        validData.isValid = false;
        validData.msg = "类型名称不能为空！";
    }
    return validData;
}

function getLoCategory(f) {
    var loCategory = {};
    loCategory.name = f.txtCategory.trim();
    loCategory.description = f.txtDescription.trim();
    return loCategory;
}

function onSaveLoCategory(result) {
    var loCategory = result;
    if (!loCategory) {
        $.jBox.tip("保存失败！", 'error');
    } else {
        $.jBox.close('jb_LoCategory');
        LoCategoryArray.push(loCategory);

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
        sBuilder.push("<tr id='" + loCategory.id + "' " + rowClass + ">");
        sBuilder.push("<td>" + loCategory.name + "</td>");
        sBuilder.push("<td>" + loCategory.description + "</td>");
        sBuilder.push("<td class='operate'><img src='Images/application_edit.png' title='编辑' onclick=\"editLoCategory('" + loCategory.id + "')\" />&nbsp;<img src='Images/application_delete.png' title='删除' onclick=\"deleteLoCategory('" + loCategory.id + "')\" /></td>");
        sBuilder.push("</tr>");
        $dataTable.append(sBuilder.join(''));
        $dataTable.find("tr:last").hover(function () {
            $(this).addClass("hover");
        }, function () {
            $(this).removeClass("hover");
        });
    }
}

function onEditLoCategory(result) {
    var loCategory = result;
    if (!loCategory) {
        $.jBox.tip("更新失败！", 'error');
    } else {
        $.jBox.close('jb_LoCategory');
        loadLoCategoryList();
    }
}