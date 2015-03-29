/// <reference path="../../Scripts/jquery-1.4.1.min.js" />

/*
* Question高级查找
*/

function QuestionSearch(options) {
    var defaults = {
        data: {
            isbn: "",
            bookId: "",
            simpleUser: null
        },
        showMode: 0,        //显示模式(0:嵌入, 1:弹出窗口)
        containerId: "",    //当showMode=0时的父容器Id
        callback: null
    };

    this.options = $.extend(defaults, options);
    this.container = null;
}

QuestionSearch.prototype.Show = function () {
    if (this.options.showMode == 0) {
        this.container = $("#" + this.options.containerId);
        if (!this.container.find("#dvQuestionSearchBox").get(0)) {
            this.container.empty()
                .html(this.initUI())
                .find("#dvQuestionSearchBox").data("_options", this.options);
            this.initUIData();
        } else {
            this.container.find("#dvQuestionSearchBox").data("_options", this.options);
        }
        this.container.slideDown();
    } else {
        this.container = $.jBox(this.initUI(), { title: "题查询", width: 705, buttons: { '确定': true, '取消': false }, submit: function (v, h, f) {
            if (v == true) {
                questionSearch_Search(h.find("#dvQuestionSearchBox"));
            }
        }
        });
        this.container.find("#dvSearchCmdBar").hide();
        this.container.find("#dvQuestionSearchBox").data("_options", this.options);
        this.initUIData();
    }
}

QuestionSearch.prototype.initUI = function () {
    var sBuilder = new Array();
    sBuilder.push("<div id='dvQuestionSearchBox' style='border:0px solid #f00; padding:15px'>");
    sBuilder.push("    <table border='0' style='width:600px;'>");
    sBuilder.push("        <tr><td width='80'>编号:</td>");
    sBuilder.push("            <td><input id='txtNumber' type='text' style='width:60px' /></td>");
    sBuilder.push("            <td width='75'>答案类型:</td>");
    sBuilder.push("            <td><select id='ddlQuestionTypeId'><option value=''>选择答案类型</option></select></td>");
    sBuilder.push("            <td width='70'>题类型:</td>");
    sBuilder.push("            <td><select id='ddlTestQuestionTypeId'><option value=''>选择题类型</option></select></td></tr>");
    sBuilder.push("    </table>");
    sBuilder.push("    <table border='0' style='width:600px; margin-top: 6px'>");
    sBuilder.push("        <tr style='line-height:25px'><td width='80'>题内容:</td>");
    sBuilder.push("            <td><textarea id='txtContent' rows='2' cols='50' style='width:500px; height:50px'></textarea></td></tr>");
    sBuilder.push("        <tr style='line-height:25px'><td>解题过程:</td>");
    sBuilder.push("            <td><textarea id='txtSolution' rows='2' cols='50' style='width:500px; height:50px'></textarea></td></tr>");
    sBuilder.push("        <tr style='line-height:25px'><td>描述:</td>");
    sBuilder.push("            <td><textarea id='txtDescription' rows='2' cols='50' style='width:500px; height:50px'></textarea></td></tr>");
    sBuilder.push("    </table>");
    sBuilder.push("    <table border='0' style='width:710px; margin-top: 6px'>");
    sBuilder.push("        <tr><td width='100'><input id='cbxIsStudentVisible' type='checkbox' /><label for='cbxIsStudentVisible'>&nbsp;&nbsp;是否学生可见</label></td>");
    sBuilder.push("            <td>");
    sBuilder.push("                <input id='rdIsStudentVisibleYes' type='radio' name='rdIsStudentVisible' value='0' disabled='disabled' />");
    sBuilder.push("                <label for='rdIsStudentVisibleYes'>&nbsp;是</label>");
    sBuilder.push("                <input id='rdIsStudentVisibleNo' type='radio' name='rdIsStudentVisible' value='1' disabled='disabled' />");
    sBuilder.push("                <label for='rdIsStudentVisibleNo'>&nbsp;否</label>");
    sBuilder.push("            </td>");
    sBuilder.push("            <td width='100'><input id='cbxIsAlgorithm' type='checkbox' /><label for='cbxIsAlgorithm'>&nbsp;&nbsp;是否活动题</label></td>");
    sBuilder.push("            <td>");
    sBuilder.push("                <input id='rdAlgorithmYes' type='radio' name='rdIsAlgorithm' value='1' disabled='disabled' />");
    sBuilder.push("                <label for='rdAlgorithmYes'>&nbsp;是</label>");
    sBuilder.push("                <input id='rdAlgorithmNo' type='radio' name='rdIsAlgorithm' value='0' disabled='disabled' />");
    sBuilder.push("                <label for='rdAlgorithmNo'>&nbsp;否</label>");
    sBuilder.push("            </td>");
    sBuilder.push("            <td width='100'><input id='QS_cbxKnowledgeMapped' type='checkbox' /><label for='QS_cbxKnowledgeMapped'>&nbsp;关联知识点</label></td>");
    sBuilder.push("            <td>");
    sBuilder.push("                <input id='QS_rdKnowledgeMappedYes' type='radio' name='QS_rdKnowledgeMapped' value='1' disabled='disabled' />");
    sBuilder.push("                <label for='QS_rdKnowledgeMappedYes'>&nbsp;是</label>");
    sBuilder.push("                <input id='QS_rdKnowledgeMappedNo' type='radio' name='QS_rdKnowledgeMapped' value='0' disabled='disabled' />");
    sBuilder.push("                <label for='QS_rdKnowledgeMappedNo'>&nbsp;否</label>");
    sBuilder.push("            </td></tr>");
    sBuilder.push("        <tr><td><input id='cbxIsSampleQuestion' type='checkbox' /><label for='cbxIsSampleQuestion'>&nbsp;&nbsp;是否是例题</label></td>");
    sBuilder.push("            <td>");
    sBuilder.push("                <input id='rdIsSampleQuestionYes' type='radio' name='rdIsSampleQuestion' value='1' disabled='disabled' />");
    sBuilder.push("                <label for='rdIsSampleQuestionYes'>&nbsp;是</label>");
    sBuilder.push("                <input id='rdIsSampleQuestionNo' type='radio' name='rdIsSampleQuestion' value='0' disabled='disabled' />");
    sBuilder.push("                <label for='rdIsSampleQuestionNo'>&nbsp;否</label>");
    sBuilder.push("            </td>");
    sBuilder.push("            <td><input id='cbxIsDisable' type='checkbox' /><label for='cbxIsDisable'>&nbsp;&nbsp;是否禁用</label></td>");
    sBuilder.push("            <td>");
    sBuilder.push("                <input id='rdIsDisableYes' type='radio' name='rdIsDisable' value='0' disabled='disabled' />");
    sBuilder.push("                <label for='rdIsDisableYes'>&nbsp;是</label>");
    sBuilder.push("                <input id='rdIsDisableNo' type='radio' name='rdIsDisable' value='1' disabled='disabled' />");
    sBuilder.push("                <label for='rdIsDisableNo'>&nbsp;否</label>");
    sBuilder.push("            </td>");
    sBuilder.push("            <td style='display:none'><input id='QS_cbxCriticalThinking' type='checkbox' /><label for='QS_cbxCriticalThinking'>&nbsp;Critical Thinking</label></td>");
    sBuilder.push("            <td style='display:none'>");
    sBuilder.push("                <input id='QS_rdCriticalThinkingYes' type='radio' name='QS_rdCriticalThinking' value='1' disabled='disabled' />");
    sBuilder.push("                <label for='QS_rdCriticalThinkingYes'>&nbsp;是</label>");
    sBuilder.push("                <input id='QS_rdCriticalThinkingNo' type='radio' name='QS_rdCriticalThinking' value='0' disabled='disabled' />");
    sBuilder.push("                <label for='QS_rdCriticalThinkingNo'>&nbsp;否</label>");
    sBuilder.push("            </td></tr>");
    sBuilder.push("    </table>");
    sBuilder.push("    <div id='dvSearchCmdBar' style='border-top:1px solid #ddd; margin:6px 0px; padding:6px 0px; text-align:left '>");
    sBuilder.push("        <input id='btnSearch' type='button' value='确定' />&nbsp;<input id='btnClose' type='button' value='取消' /></div>");
    sBuilder.push("</div>");
    return sBuilder.join("");
}

QuestionSearch.prototype.initUIData = function () {
    var container = this.container;
    $excuteWS("~CmsWS.getQuestionTypeList", { userExtend: this.options.data.simpleUser }, function (result) {
        var options = new Array();
        if (result) {
            $.each(result, function () {
                if (this.id != "10" && this.id != "12" && this.id != "7") {
                    options.push("<option value='" + this.id + "'>" + this.type + "</option>");
                }
            })
        }
        var $ddlTestQuestionTypeId = container.find("#ddlQuestionTypeId");
        $ddlTestQuestionTypeId.find("option:gt(0)").remove();
        $ddlTestQuestionTypeId.append(options.join(""));
    }, null, null);

    $excuteWS("~CmsWS.getTestQuestionTypeList", { isbn: this.options.data.isbn, userExtend: this.options.data.simpleUser }, function (result) {
        var options = new Array();
        if (result) {
            $.each(result, function () {
                options.push("<option value='" + this.id + "'>" + this.title + "</option>");
            })
        }
        var $ddlTestQuestionTypeId = container.find("#ddlTestQuestionTypeId");
        $ddlTestQuestionTypeId.find("option:gt(0)").remove();
        $ddlTestQuestionTypeId.append(options.join(""));
    }, null, null);

    this.container.find("#btnSearch").click(function () {
        questionSearch_Search(container.find("#dvQuestionSearchBox"));
    });

    this.container.find("#btnClose").click(function () {
        container.slideUp();
    });

    this.container.find("input[type='checkbox']").click(function () {
        var $rd = $(this).parent().next().find("input[type='radio']");
        if (this.checked) {
            $rd.removeAttr("disabled");
        } else {
            $rd.attr({ checked: false, disabled: "disabled" });
        }
    });
}

function questionSearch_Search(f) {
    var number = "";
    var typeId = "";
    var testQuestionTypeId = "";
    var content = "";
    var solution = "";
    var description = "";
    var instructorOnly = "";
    var algorithmFlag = "";
    var sampleFlag = "";
    var flag = "";
    var thinkFlag = "";
    var kpFlag = "";
    var _options = f.data("_options");
    
    number = f.find("#txtNumber").val();
    typeId = f.find("#ddlQuestionTypeId").val();
    testQuestionTypeId = f.find("#ddlTestQuestionTypeId").val();
    content = f.find("#txtContent").val();
    solution = f.find("#txtSolution").val();
    description = f.find("#txtDescription").val();

    var $rd = null;
    if (f.find("#cbxIsStudentVisible").is(":checked")) {
        $rd = f.find("input[name='rdIsStudentVisible']:checked");
        instructorOnly = $rd.get(0) ? $rd.val() : "";
    }
    if (f.find("#cbxIsAlgorithm").is(":checked")) {
        $rd = f.find("input[name='rdIsAlgorithm']:checked");
        algorithmFlag = $rd.get(0) ? $rd.val() : "";
    }
    if (f.find("#cbxIsSampleQuestion").is(":checked")) {
        $rd = f.find("input[name='rdIsSampleQuestion']:checked");
        sampleFlag = $rd.get(0) ? $rd.val() : "";
    }
    if (f.find("#cbxIsDisable").is(":checked")) {
        $rd = f.find("input[name='rdIsDisable']:checked");
        flag = $rd.get(0) ? $rd.val() : "";
    }
    if (f.find("#QS_cbxCriticalThinking").is(":checked")) {
        $rd = f.find("input[name='QS_rdCriticalThinking']:checked");
        thinkFlag = $rd.get(0) ? $rd.val() : "";
    }
    if (f.find("#QS_cbxKnowledgeMapped").is(":checked")) {
        $rd = f.find("input[name='QS_rdKnowledgeMapped']:checked");
        kpFlag = $rd.get(0) ? $rd.val() : "";
    }

    if (imgLoadingId) { $get(imgLoadingId).style.display = "block";}
    $excuteWS("~CmsWS.getQuestionIdByCondition",
        {
            content: content, solution: solution, number: number, instructorOnly: instructorOnly, typeId: typeId, testQuestionTypeId: testQuestionTypeId,
            algorithmFlag: algorithmFlag, sampleFlag: sampleFlag, description: description, bookId: _options.data.bookId, flag: flag, thinkFlag: thinkFlag, kpFlag: kpFlag, userExtend: _options.data.simpleUser
        },
        function (result) {
            if (imgLoadingId) { $get(imgLoadingId).style.display = "none"; }
            if (_options.showMode == 0) {
                $("#" + _options.containerId).hide();
            }
            _options.callback(result);
        },
        null, null);    
}