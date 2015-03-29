/// <reference path="../../Scripts/jquery-1.4.1.min.js" />

var DisciplineArray = [];
var ddlGradationStr = new Array();
function PageLoad() {
    InitCmsMenu("m_Discipline");
    bindGradation();
}

function loadData(gradationId) {
    $(".cms_contentbox").show();
    if (ddlGradationStr.length == 0) {
        $excuteWS("~CmsWS.getGradationList", { userExtend: SimpleUser }, function (r) {
            ddlGradationStr.push('<select id="ddlGradation">');
            ddlGradationStr.push('<option value="-1">选择阶段</option>');
            if (r) {
                for (var i = 0; i < r.length; i++) {
                    ddlGradationStr.push('<option value="' + r[i].id + '">' + r[i].gradationName + '</option>');
                }
            }
            ddlGradationStr.push('</select>');
            loadDisciplineList(gradationId);
            $("#cms_toolbar #btnAdd").click(function () {
                editDiscipline();
            });
        }, null, { userContext: "getGradationList" });
    } else {
        loadDisciplineList(gradationId);
       
    }
    
}

function loadDisciplineList(gradationId) {
    var $contentbox = $(".cms_contentbox");
    $contentbox.showLoading();
    //$excuteWS("~CmsWS.getDisciplineList", { userExtend: SimpleUser }, bindDisciplineList, null, { contentbox: $contentbox });
    $excuteWS("~CmsWS.getDisciplineList", { userExtend: SimpleUser }, function (result) {
        var arr = result.findAll("gradationId", gradationId);
        bindDisciplineList(arr, { contentbox: $contentbox });
    }, null, null);
}

function bindDisciplineList(result, context) {
    var $contentbox = context.contentbox;
    var $dataTable = $contentbox.find(".cms_datatable");

    $contentbox.hideLoading();
    $dataTable.find("tr:gt(0)").remove();
    if (!result || result.length == 0) {
        $dataTable.append("<tr class='nodata lightblue'><td colspan='6'>无记录</td></tr>");
        return;
    } else {
        DisciplineArray = result;
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
        sBuilder.push("<td>" + this.disciplineName + "</td>");
        sBuilder.push("<td>" + sequence + "</td>");
        sBuilder.push("<td>" + isAvailable + "</td>");
        sBuilder.push("<td class='operate'><img src='Images/application_edit.png' title='编辑' onclick=\"editDiscipline('" + this.id + "')\" />&nbsp;<img src='Images/application_delete.png' title='删除' onclick=\"deleteDiscipline('" + this.id + "')\" /></td>");
        sBuilder.push("</tr>");
        $dataTable.append(sBuilder.join(''));
    });

    $dataTable.find("tr:gt(0)").hover(function () {
        $(this).addClass("hover");
    }, function () {
        $(this).removeClass("hover");
    });
}

function editDiscipline(id) {
    var title = "";
    var _id = "";
    if (id) {
        title = "编辑学科类别";
        _id = id;
    } else {
        title = "添加学科类别";
        _id = "";
    }

    var $jb = $.jBox(initDisciplineBox(), { id: 'jb_cmsDiscipline', title: title, width: 580, top: "25%", buttons: { "保存": true, "取消": false }, submit: submitDiscipline });
    var $discipline = $jb.find("#cms_dialog_discipline");
    $discipline.data("_id", _id);

    if (id) {
        var discipline = getDisciplineObj(id);
        var isAvailable = (discipline.flag == "1") ? true : false;
        with ($discipline) {
            find("#txtDisciplineName").val(discipline.disciplineName);
            find("#txtSequence").val(discipline.sequence);
            find("#ddlGradation").val(discipline.gradationId);
            find("#cbxIsAvailable").attr("checked", isAvailable);
        }
    }
}

function deleteDiscipline(id) {
    var discipline = getDisciplineObj(id);
    $.jBox.confirm("你确定要删除类别“" + discipline.disciplineName + "”吗?", "提示", function (v, h, f) {
        if (v == true) {
            $excuteWS("~CmsWS.deleteDiscipline", { disciplineW: { id: id }, userExtend: SimpleUser }, function (result) {
                if (result) {
                    loadDisciplineList();
                } else {
                    $.jBox.tip("删除失败！", 'error');
                }
            }, null, null);
        }
    }, { top: "25%", buttons: { "确定": true, "取消": false} });
}

function initDisciplineBox() {
    var sBuilder = new Array();
    sBuilder.push("<div id='cms_dialog_discipline' class='cms_dialog'>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp; 类别名称：</li>");
    sBuilder.push("    <li class='inp'><input id='txtDisciplineName' name='txtDisciplineName' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'>序号：</li>");
    sBuilder.push("    <li class='inp'><input id='txtSequence' name='txtSequence' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'>阶段：</li>");
    sBuilder.push("    <li class='inp'>" + ddlGradationStr .join('')+ "</li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'>&nbsp;</li>");
    sBuilder.push("    <li class='inp'><input id='cbxIsAvailable' name='cbxIsAvailable' type='checkbox' checked='checked' />&nbsp;<label for='cbxIsAvailable'>该类型可用</label></li>");
    sBuilder.push("</ul>");
    sBuilder.push("</div>");
    return sBuilder.join("");
}

function submitDiscipline(v, h, f) {
    if (v == true) {
        var validData = validateForm(f);
        if (validData.isValid == false) {
            $.jBox.tip(validData.msg, 'warning');
            return false;
        }
        var disciplineWrapper = getDiscipline(h);
        var disciplineId = h.find("#cms_dialog_discipline").data("_id");
        if (disciplineId != "") {
            disciplineWrapper.id = disciplineId;
            $excuteWS("~CmsWS.editDiscipline", { disciplineW: disciplineWrapper, userExtend: SimpleUser }, onEditDiscipline, null, null);
        } else {
            $excuteWS("~CmsWS.saveDiscipline", { disciplineW: disciplineWrapper, userExtend: SimpleUser }, onSaveDiscipline, null, null);
        }
        return false;
    }
}

function getDisciplineObj(id) {
    var discipline = null;
    for (var i = 0; i < DisciplineArray.length; i++) {
        if (DisciplineArray[i].id == id) {
            discipline = DisciplineArray[i];
            break;
        }
    }
    return discipline;
}

function validateForm(f) {
    var validData = { isValid: true, msg: "" };
    if (f.txtDisciplineName.trim() == "") {
        validData.isValid = false;
        validData.msg = "类别名称不能为空！";
    }
    return validData;
}

function getDiscipline(h) {
    var discipline = {};
    discipline.disciplineName = h.find("#txtDisciplineName").val().trim();
    discipline.sequence = h.find("#txtSequence").val().trim();
    discipline.gradationId = h.find("#ddlGradation").find("option:selected").val();
    discipline.flag = h.find("#cbxIsAvailable").is(":checked") ? "1" : "0";
    return discipline;
}

function onSaveDiscipline(result) {
    var discipline = result;
    if (!discipline) {
        $.jBox.tip("保存失败！", 'error');
    } else {
        $.jBox.close('jb_cmsDiscipline');
        DisciplineArray.push(discipline);

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

        var sequence = (discipline.sequence) ? discipline.sequence : "";
        var isAvailable = "";
        if (discipline.flag) {
            isAvailable = (discipline.flag == "1") ? "是" : "否";
        } 

        sBuilder = new Array();
        sBuilder.push("<tr id='" + discipline.id + "' " + rowClass + ">");
        sBuilder.push("<td>" + discipline.disciplineName + "</td>");
        sBuilder.push("<td>" + sequence + "</td>");
        sBuilder.push("<td>" + isAvailable + "</td>");
        sBuilder.push("<td class='operate'><img src='Images/application_edit.png' title='编辑' onclick=\"editDiscipline('" + discipline.id + "')\" />&nbsp;<img src='Images/application_delete.png' title='删除' onclick=\"deleteDiscipline('" + discipline.id + "')\" /></td>");
        sBuilder.push("</tr>");
        $dataTable.append(sBuilder.join(''));
        $dataTable.find("tr:last").hover(function () {
            $(this).addClass("hover");
        }, function () {
            $(this).removeClass("hover");
        });
    }
}

function onEditDiscipline(result) {
    var discipline = result;
    if (!discipline) {
        $.jBox.tip("更新失败！", 'error');
    } else {
        $.jBox.close('jb_cmsDiscipline');
        //loadDisciplineList();
        $("#ddlGradation").trigger("change")
    }
}

//显示阶段列表
function bindGradation() {
    var ddl = $("#ddlGradation");

    ddl.empty().unbind("change").addClass("sel_loading");
    $excuteWS("~CmsWS.getGradationList", { userExtend: SimpleUser }, function (result) {
        //赋值
        var options = [];
        if (result) {
            $.each(result, function () {
                options.push("<option value='" + this.id + "'>" + this.gradationName + "</option>");
            });
        }
        ddl.removeClass("sel_loading").append("<option value='-1'>请选择阶段</option>");
        ddl.append(options.join(""));
    }, null, null);

    //事件
    ddl.change(function () {
        var gradationId = $(this).val();
        if (gradationId != "-1") {
            loadData(gradationId);
        } else {
            $(".cms_contentbox").hide();
        }
    });
}