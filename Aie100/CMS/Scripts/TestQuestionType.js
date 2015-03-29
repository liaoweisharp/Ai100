/// <reference path="../../Scripts/jquery-1.4.1.min.js" />
/// <reference path="../../Scripts/jquery.ajax.js" />

var TestQuestionTypeArray = [];
var QuestionTypeArray = [];
var SubjectId = "";

function PageLoad() {
    InitCmsMenu("m_TestQuestionType");

    $("#cms_toolbar #btnAdd").click(function () {
        if ($("#selSubjectList").val() != "-1") {
            editTestQuestionType();
        } else {
            $.jBox.info("请选择科目", "提示", { buttons: { '确定': true} });
        }
    });

    bindGradation();
    bindSubject();
    $excuteWS("~CmsWS.getQuestionTypeList", { userExtend: SimpleUser }, function (r) {
        QuestionTypeArray = r;
    }, null, { userContext: "getQuestionTypeList" });
}

function bindSubjectList(oSel) {
    $excuteWS("~CmsWS.getSubjectList", { userExtend: SimpleUser }, function (result) {
        oSel.empty();
        if (result) {
            $.each(result, function () {
                oSel.append("<option value='" + this.id + "'>" + this.subjectName + "</option>");
            });
        }
        oSel.removeClass("sel_loading").prepend("<option value='-1'>请选择学科</option>").get(0).selectedIndex = 0;
    }, null, null);
}

function loadTestQuestionTypeList(subjectId) {
    var $contentbox = $(".cms_contentbox");

    $contentbox.show();
    $contentbox.showLoading();
    $excuteWS("~CmsWS.getTestQuestionTypeListBySubject", { subjectId: subjectId, userExtend: SimpleUser }, bindTestQuestionTypeList, null, { contentbox: $contentbox });
}

function bindTestQuestionTypeList(result, context) {
    var $contentbox = context.contentbox;
    var $dataTable = $contentbox.find(".cms_datatable");

    $contentbox.hideLoading();
    $dataTable.find("tr:gt(0)").remove();
    if (!result || result.length == 0) {
        $dataTable.append("<tr class='nodata lightblue'><td colspan='5'>无记录</td></tr>");
        return;
    } else {
        TestQuestionTypeArray = result;
    }

    var sBuilder = [];
    var difficulty = "";
    var description = "";
    var answerType = "";
    var score = "";
    $.each(result, function (i) {
        if (i % 2 == 0) {
            rowClass = "class='lightblue'";
        } else {
            rowClass = "";
        }

        difficulty = (this.difficulty) ? this.difficulty : "";
        description = (this.description) ? this.description : "";
        answerType = (this.questionTypeId) ? this.questionTypeId : "";
        score = (this.score) ? this.score : "";
        sBuilder = [];
        sBuilder.push("<tr id='" + this.id + "' " + rowClass + ">");
        sBuilder.push("<td>" + this.title + "</td>");
        sBuilder.push("<td>" + answerType + "</td>");
        sBuilder.push("<td>" + score + "</td>");
        sBuilder.push("<td>" + this.typeOrder + "</td>");
        sBuilder.push("<td>" + difficulty + "</td>");
        sBuilder.push("<td>" + description + "</td>");
        sBuilder.push("<td class='operate'><img src='Images/application_edit.png' title='编辑' onclick=\"editTestQuestionType('" + this.id + "')\" />&nbsp;<img src='Images/application_delete.png' title='删除' onclick=\"deleteTestQuestionType('" + this.id + "')\" /></td>");
        sBuilder.push("</tr>");
        $dataTable.append(sBuilder.join(''));
    });

    $dataTable.find("tr:gt(0)").hover(function () {
        $(this).addClass("hover");
    }, function () {
        $(this).removeClass("hover");
    });
}

function initTestQuestionTypeBox() {
    var sBuilder = new Array();
    sBuilder.push("<div id='cms_TestQuestionType' class='cms_dialog'>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp;考试题型：</li>");
    sBuilder.push("    <li class='inp'><input id='txtTitle' name='txtTitle' type='text' style='width:100%;' /></li>");
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
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp;分数：</li>");
    sBuilder.push("    <li class='inp'><input id='txtScore' name='txtScore' onkeyup='checkNumericAnswer(this)' type='text' style='width:40px' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp;序号：</li>");
    sBuilder.push("    <li class='inp'><input id='txtTypeOrder' name='txtTypeOrder' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp;难度：</li>");
    sBuilder.push("    <li class='inp'><select id='ddlDifficulty' name='ddlDifficulty' style='width:100%;'><option value='-1'>请选择难度</option><option selected='selected' value='1'>1</option><option value='2'>2</option><option value='3'>3</option><option value='4'>4</option><option value='5'>5</option></select></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'>描述：</li>");
    sBuilder.push("    <li class='inp'><input id='txtDiscription' name='txtDiscription' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("</div>");
    return sBuilder.join("");
}

function checkNumericAnswer(o) {
    if (isNaN(o.value)) {
        alert("Must be a number!");
        o.value = "";
    }
}

function editTestQuestionType(id) {
    var title = "";
    var _id = "";
    if (id) {
        title = "编辑考试题型";
        _id = id;
    } else {
        title = "添加考试题型";
        _id = "";
    }

    var $jb = $.jBox(initTestQuestionTypeBox(), { id: 'jb_TestQuestionType', title: title, width: 580, top: "25%", buttons: { "保存": true, "取消": false }, submit: submitTestQuestionType });
    var $testQuestionType = $jb.find("#cms_TestQuestionType");
    $testQuestionType.data("_id", _id);

    if (id) {
        var testQuestionType = getTestQuestionTypeObj(id);
        $testQuestionType.find("#txtTitle").val(testQuestionType.title);
        if (testQuestionType.questionTypeId) {
            $testQuestionType.find("#ddlQuestionType").val(testQuestionType.questionTypeId);
        }
        $testQuestionType.find("#txtScore").val(testQuestionType.score);

        $testQuestionType.find("#txtTypeOrder").val(testQuestionType.typeOrder);
        if (testQuestionType.difficulty) {
            $testQuestionType.find("#ddlDifficulty").val(testQuestionType.difficulty);
        }
        $testQuestionType.find("#txtDiscription").val(testQuestionType.description);
    }
}

function getTestQuestionTypeObj(id) {
    var testQuestionType = null;
    for (var i = 0; i < TestQuestionTypeArray.length; i++) {
        if (TestQuestionTypeArray[i].id == id) {
            testQuestionType = TestQuestionTypeArray[i];
            break;
        }
    }
    return testQuestionType;
}

function submitTestQuestionType(v, h, f) {
    if (v == true) {
        var validData = validateForm(f);
        if (validData.isValid == false) {
            $.jBox.tip(validData.msg, 'warning');
            return false;
        }
        var tqtWrapper = getTestQuestionType(h);
        if (tqtWrapper.id) {
            $excuteWS("~CmsWS.editTestQuestionType", { testQuestionTypeW: tqtWrapper, userExtend: SimpleUser }, onEditTestQuestionType, null, null);
        } else {
            $excuteWS("~CmsWS.saveTestQuestionType", { testQuestionTypeW: tqtWrapper, userExtend: SimpleUser }, onSaveTestQuestionType, null, null);
        }
        return false;
    }
}

function validateForm(f) {
    var validData = { isValid: true, msg: "" };
    if (f.txtTitle.trim() == "") {
        validData.isValid = false;
        validData.msg = "考试题型不能为空！";
    } else if (f.txtTypeOrder.trim() == "") {
        validData.isValid = false;
        validData.msg = "序号不能为空！";
    } else if (f.ddlDifficulty == "-1") {
        validData.isValid = false;
        validData.msg = "请选择难度！";
    }
    return validData;
}

function getTestQuestionType(h) {
    var testQuestionType;
    var id = h.find("#cms_TestQuestionType").data("_id");
    if (id) {
        testQuestionType = getTestQuestionTypeObj(id);
    } else {
        testQuestionType = {};
        testQuestionType.subjectId = $("#selSubjectList").val();
    }

    
    testQuestionType.title = h.find("#txtTitle").val().trim();

    testQuestionType.questionTypeId = h.find("#ddlQuestionType").val();
    testQuestionType.score = h.find("#txtScore").val().trim();

    testQuestionType.typeOrder = h.find("#txtTypeOrder").val().trim();
    testQuestionType.difficulty = h.find("#ddlDifficulty").val();
    testQuestionType.description = h.find("#txtDiscription").val().trim();
    return testQuestionType;
}

function onSaveTestQuestionType(result) {
    var testQuestionType = result;
    if (!testQuestionType) {
        $.jBox.tip("保存失败！", 'error');
    } else {
        $.jBox.close('jb_TestQuestionType');
        TestQuestionTypeArray.push(testQuestionType);

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

        var difficulty = (testQuestionType.difficulty) ? testQuestionType.difficulty : "";
        var description = (testQuestionType.description) ? testQuestionType.description : "";
        var answerType = (testQuestionType.questionTypeId) ? testQuestionType.questionTypeId : "";
        var score = (testQuestionType.score) ? testQuestionType.score : "";
        sBuilder = new Array();
        sBuilder.push("<tr id='" + testQuestionType.id + "' " + rowClass + ">");
        sBuilder.push("<td>" + testQuestionType.title + "</td>");
        sBuilder.push("<td>" + answerType + "</td>");
        sBuilder.push("<td>" + score + "</td>");
        sBuilder.push("<td>" + testQuestionType.typeOrder + "</td>");
        sBuilder.push("<td>" + difficulty + "</td>");
        sBuilder.push("<td>" + description + "</td>");
        sBuilder.push("<td class='operate'><img src='Images/application_edit.png' title='编辑' onclick=\"editTestQuestionType('" + testQuestionType.id + "')\" />&nbsp;<img src='Images/application_delete.png' title='删除' onclick=\"deleteTestQuestionType('" + testQuestionType.id + "')\" /></td>");
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
        $.jBox.close('jb_TestQuestionType');
        loadTestQuestionTypeList(SubjectId);
    }
}

function deleteTestQuestionType(id) {
    var testQuestionType = getTestQuestionTypeObj(id);
    $.jBox.confirm("你确定要删除类型“" + testQuestionType.title + "”吗?", "提示", function (v, h, f) {
        if (v == true) {
            $excuteWS("~CmsWS.deleteTestQuestionType", { testQuestionTypeW: testQuestionType, userExtend: SimpleUser }, function (result) {
                if (result) {
                    loadTestQuestionTypeList(SubjectId);
                } else {
                    $.jBox.tip("删除失败！", 'error');
                }
            }, null, null);
        }
    }, { top: "25%", buttons: { "确定": true, "取消": false} });
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
            bindDiscipline(gradationId);
        }
    });
}

function bindDiscipline(gradationId) {
    var ddl = $("#Des");
    var oldGradationId = ddl.data("_gradationId");

    if (gradationId == oldGradationId) {
        return;
    }

    ddl.empty().unbind("change").addClass("sel_loading");
    $excuteWS("~CmsWS.getDisciplineList", { userExtend: SimpleUser }, function (result) {
        //赋值
        var options = [];
        if (result && result.length > 0) {
            $.each(result, function () {
                if (this.gradationId == gradationId) {
                    options.push("<option value='" + this.id + "'>" + this.disciplineName + "</option>");
                }
            });
        }
        ddl.removeClass("sel_loading").append("<option value='-1'>请选择学科类别</option>");
        ddl.append(options.join(""));

        //事件
        ddl.change(function () {
            var disciplineId = $(this).val();
            if (disciplineId != "-1") {
                bindSubject(disciplineId);
            } else {
                bindSubject();
            }
        });
    }, null, null);

    ddl.data("_gradationId", gradationId);
}

//显示学科列表
function bindSubject(disciplineId) {
    var ddl = $("#selSubjectList");
    ddl.empty().unbind("change").addClass("sel_loading");
    $excuteWS("~CmsWS.getSubjectList", { userExtend: SimpleUser }, function (result) {
        //赋值
        var options = [];
        if (result && result.length > 0) {
            if (disciplineId) {
                $.each(result, function () {
                    if (this.disciplineId == disciplineId) {
                        options.push("<option value='" + this.id + "' disciplineId='" + this.disciplineId + "'>" + this.subjectName + "</option>");
                    }
                });
            } else {
                $.each(result, function () {
                    options.push("<option value='" + this.id + "' disciplineId='" + this.disciplineId + "'>" + this.subjectName + "</option>");
                });
            }
        }
        ddl.removeClass("sel_loading").append("<option value='-1'>请选择学科</option>");
        ddl.append(options.join(""));

        //事件
        var tdisciplineId;
        ddl.change(function () {
            SubjectId = $(this).val();
            if (SubjectId != "-1") {
                tdisciplineId = $(this).find("option:selected").attr("disciplineId");
                bindDisciplineById(tdisciplineId);
                loadTestQuestionTypeList(SubjectId);
            } else {
                $(".cms_contentbox").hide();
            }
        });
    }, null, null);
}

function bindDisciplineById(disciplineId) {
    var ddl = $("#Des");
    var oldDisciplineId = ddl.data("_disciplineId");

    if (disciplineId == oldDisciplineId) {
        return;
    }

    ddl.empty().unbind("change").addClass("sel_loading");
    $excuteWS("~CmsWS.getDisciplineList", { userExtend: SimpleUser }, function (result) {
        //赋值
        var gradationId = "";
        var options = [];
        if (result && result.length > 0) {
            var x = result.indexOf("id", disciplineId);
            if (x != -1) {
                gradationId = result[x].gradationId;
                $.each(result, function () {
                    if (this.gradationId == gradationId) {
                        options.push("<option value='" + this.id + "'>" + this.disciplineName + "</option>");
                    }
                });
            }
        }
        ddl.removeClass("sel_loading").append("<option value='-1'>请选择学科类别</option>");
        ddl.append(options.join(""));
        ddl.val(disciplineId);
        $("#ddlGradation").val(gradationId);

        //事件
        ddl.change(function () {
            var disciplineId = $(this).val();
            if (disciplineId != "-1") {
                bindSubject(disciplineId);
            }
        });
    }, null, null);

    ddl.data("_disciplineId", disciplineId);
}