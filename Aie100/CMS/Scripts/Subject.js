/// <reference path="../../Scripts/jquery-1.4.1.min.js" />

var SubjectArray = [];

function PageLoad() {
    InitCmsMenu("m_Subject");
    $("#cms_toolbar #btnAdd").click(function () {
        editSubject();
    });

    bindGradation();
    bindDisciplineDes();
}

function loadSubjectList(disciplineId) {
    $(".cms_contentbox").show();
    var $contentbox = $(".cms_contentbox");
    $contentbox.showLoading();
    //$excuteWS("~CmsWS.getSubjectList", { userExtend: SimpleUser }, bindSubjectList, null, { contentbox: $contentbox });
    $excuteWS("~CmsWS.getSubjectListByDisciplineId", { disciplineId: disciplineId, userExtend: SimpleUser }, bindSubjectList, null, { contentbox: $contentbox });
}

function bindSubjectList(result, context) {
    var $contentbox = context.contentbox;
    var $dataTable = $contentbox.find(".cms_datatable");

    $contentbox.hideLoading();
    $dataTable.find("tr:gt(0)").remove();
    if (!result || result.length == 0) {
        $dataTable.append("<tr class='nodata lightblue'><td colspan='6'>无记录</td></tr>");
        return;
    } else {
        SubjectArray = result;
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
        sBuilder.push("<td>" + this.subjectName + "</td>");
        sBuilder.push("<td>" + sequence + "</td>");
        sBuilder.push("<td>" + isAvailable + "</td>");
        sBuilder.push("<td class='operate'><img src='Images/application_edit.png' title='编辑' onclick=\"editSubject('" + this.id + "')\" />&nbsp;<img src='Images/application_delete.png' title='删除' onclick=\"deleteSubject('" + this.id + "')\" /></td>");
        sBuilder.push("</tr>");
        $dataTable.append(sBuilder.join(''));
    });

    $dataTable.find("tr:gt(0)").hover(function () {
        $(this).addClass("hover");
    }, function () {
        $(this).removeClass("hover");
    });
}

function initSubjectBox() {
    var sBuilder = new Array();
    sBuilder.push("<div id='cms_dialog_subject' class='cms_dialog'>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp;学科类别：</li>");
    sBuilder.push("    <li class='inp'><select id='ddlDiscipline' name='ddlDiscipline' style='width:354px'><option value='-1'>请选择</option></select></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp;学科名称：</li>");
    sBuilder.push("    <li class='inp'><input id='txtSubject' name='txtSubject' type='text' style='width:100%;' /></li>");
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

function editSubject(id) {
    var title = "";
    var _id = "";
    if (id) {
        title = "编辑学科";
        _id = id;
    } else {
        title = "添加学科";
        _id = "";
    }

    var $jb = $.jBox(initSubjectBox(), { id: 'jb_cmsSubject', title: title, width: 580, top: "25%", buttons: { "保存": true, "取消": false }, submit: submitSubject });
    var $subject = $jb.find("#cms_dialog_subject");
    $subject.data("_id", _id);

    if (id) {
        var subject = getSubjectObj(id);
        var isAvailable = (subject.flag == "1") ? true : false;
        bindDiscipline($subject.find("#ddlDiscipline"), subject.disciplineId);
        $subject.find("#txtSubject").val(subject.subjectName);
        $subject.find("#txtSequence").val(subject.sequence);
        $subject.find("#cbxIsAvailable").attr("checked", isAvailable);
    } else {
        bindDiscipline($subject.find("#ddlDiscipline"), "");
    }
}

function deleteSubject(id) {
    var subject = getSubjectObj(id);
    $.jBox.confirm("你确定要删除学科“" + subject.subjectName + "”吗?", "提示", function (v, h, f) {
        if (v == true) {
            $excuteWS("~CmsWS.deleteSubject", { subjectW: subject, userExtend: SimpleUser }, function (result) {
                if (result) {
                    //loadSubjectList();
                    $("#Des").trigger("change");
                } else {
                    $.jBox.tip("删除失败！", 'error');
                }
            }, null, null);
        }
    }, { top: "25%", buttons: { "确定": true, "取消": false} });
}

function submitSubject(v, h, f) {
    if (v == true) {
        var validData = validateForm(f);
        if (validData.isValid == false) {
            $.jBox.tip(validData.msg, 'warning');
            return false;
        }
        var subjectWrapper = getSubject(h);
        if (subjectWrapper.id) {
            $excuteWS("~CmsWS.editSubject", { subjectW: subjectWrapper, userExtend: SimpleUser }, onEditSubject, null, null);
        } else {
            $excuteWS("~CmsWS.saveSubject", { subjectW: subjectWrapper, userExtend: SimpleUser }, onSaveSubject, null, subjectWrapper);
        }
        return false;
    }
}

function getSubjectObj(id) {
    var subject = null;
    for (var i = 0; i < SubjectArray.length; i++) {
        if (SubjectArray[i].id == id) {
            subject = SubjectArray[i];
            break;
        }
    }
    return subject;
}

function validateForm(f) {
    var validData = { isValid: true, msg: "" };
    if (f.ddlDiscipline == "-1") {
        validData.isValid = false;
        validData.msg = "请选择学科类别！";
    } else if (f.txtSubject.trim() == "") {
        validData.isValid = false;
        validData.msg = "学科名称不能为空！";
    }
    return validData;
}

function getSubject(h) {
    var subject;
    var id = h.find("#cms_dialog_subject").data("_id");
    if (id) {
        subject = getSubjectObj(id);
    } else {
        subject = {};
    }
    var $selDiscipline = h.find("#ddlDiscipline option:selected");
    subject.disciplineId = $selDiscipline.attr("value");
    subject.disciplineName = $selDiscipline.text();
    subject.subjectName = h.find("#txtSubject").val().trim();
    subject.sequence = h.find("#txtSequence").val().trim();
    subject.flag = h.find("#cbxIsAvailable").is(":checked") ? "1" : "0";
    return subject;
}

function onSaveSubject(result, subjectWrapper) {
    var subject = result;
    if (!subject) {
        $.jBox.tip("保存失败！", 'error');
    } else {
        subject.disciplineName = subjectWrapper.disciplineName;
        $.jBox.close('jb_cmsSubject');
        SubjectArray.push(subject);

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

        var sequence = (subject.sequence) ? subject.sequence : "";
        var isAvailable = "";
        if (subject.flag) {
            isAvailable = (subject.flag == "1") ? "是" : "否";
        } 
        
        sBuilder = new Array();
        sBuilder.push("<tr id='" + subject.id + "' " + rowClass + ">");
        sBuilder.push("<td>" + subject.disciplineName + "</td>");
        sBuilder.push("<td>" + subject.subjectName + "</td>");
        sBuilder.push("<td>" + sequence + "</td>");
        sBuilder.push("<td>" + isAvailable + "</td>");
        sBuilder.push("<td class='operate'><img src='Images/application_edit.png' title='编辑' onclick=\"editSubject('" + subject.id + "')\" />&nbsp;<img src='Images/application_delete.png' title='删除' onclick=\"deleteSubject('" + subject.id + "')\" /></td>");
        sBuilder.push("</tr>");
        $dataTable.append(sBuilder.join(''));
        $dataTable.find("tr:last").hover(function () {
            $(this).addClass("hover");
        }, function () {
            $(this).removeClass("hover");
        });
    }
}

function onEditSubject(result) {
    var subject = result;
    if (!subject) {
        $.jBox.tip("更新失败！", 'error');
    } else {
        $.jBox.close('jb_cmsSubject');
        //loadSubjectList();
        $("#Des").trigger("change");
    }
}

//显示学科类别列表
function bindDiscipline(oSel, defVal) {
    $excuteWS("~CmsWS.getDisciplineList", { userExtend: SimpleUser }, function (result) {
        oSel.find("option:gt(0)").remove();
        if (result && result.length > 0) {
            $.each(result, function () {
                oSel.append("<option value='" + this.id + "'>" + this.disciplineName + "</option>");
            });
            if (defVal) {
                oSel.val(defVal);
            }
        }
    }, null, null);
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
            bindDisciplineDes(gradationId);
        } else {
            bindDisciplineDes();
        }
    });
}

function bindDisciplineDes(gradationId) {
    var ddl = $("#Des");
    ddl.empty().unbind("change").addClass("sel_loading");
    $excuteWS("~CmsWS.getDisciplineList", { userExtend: SimpleUser }, function (result) {
        //赋值
        var options = [];
        if (result && result.length > 0) {
            if (gradationId) {
                $.each(result, function () {
                    if (this.gradationId == gradationId) {
                        options.push("<option value='" + this.id + "' gradationId='" + this.gradationId + "'>" + this.disciplineName + "</option>");
                    }
                });
            } else {
                $.each(result, function () {
                    options.push("<option value='" + this.id + "' gradationId='" + this.gradationId + "'>" + this.disciplineName + "</option>");
                });
            }
        }
        ddl.removeClass("sel_loading").append("<option value='-1'>请选择学科类别</option>");
        ddl.append(options.join(""));

        //事件
        var tgradationId;
        ddl.change(function () {
            var disciplineId = $(this).val();
            if (disciplineId != "-1") {
                tgradationId = $(this).find("option:selected").attr("gradationId");
                $("#ddlGradation").val(tgradationId);
                loadSubjectList(disciplineId);
            } else {
                $(".cms_contentbox").hide();
            }
        });
    }, null, null);
}