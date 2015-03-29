/// <reference path="AM_TestManageGlobal.js" />
/// <reference path="AM_Common.js" />

/*
* 创建考试:模板信息
*/

//显示模板信息
function showTestModelInfo() {
}

//检查模板信息是否有效
function checkTestModel() {
    var validData = validateTestModel();
    if (validData.isValid == false) {
        $.jBox.tip(validData.msg, 'warning');
        return false;
    }
    return true;
}

function initSelectTestModel() {
    $("#btnSelTestModel").unbind("click").bind("click", onSelectTestModel);
    $("#btnAddTestModel").unbind("click").bind("click", onAddTestModel);
    var $dvTestModel = $("#dvTestModel");
    $dvTestModel.find("#dvAddQuestionType a").unbind("click").click(function () {
        addTestModelRow($dvTestModel.find("#tbTestModel"));
        $("#dvTestModel").data("_isDirty", true);
        $("#dvViewModel").hide().next().hide();
    });

    //读取考试题型信息
    if (TestQuestionTypeArray && TestQuestionTypeArray.length == 0) {
        var $c = $("#dvBuildTestBox").showLoading();
        $excuteWS("~CmsWS.getTestQuestionTypeBookList", { bookId: SimpleUser.user.bookId, userExtend: SimpleUser.user }, function (result) {
            $c.hideLoading();
            TestQuestionTypeArray = (result) ? result : [];
        }, null, null);
    }
}

function onAddTestModel() {
    $("#dvTestModel").show().find("#tbTestModel").empty();
    $("#dvTestModel").data("_id", "").data("_isDirty", true);
    $("#dvViewModel").hide().next().hide();
    $("#btnBuildTest").removeAttr("disabled");
}

function onSelectTestModel() {
    var arr = [];
    arr.push("<div id='dvTestModelList' style='border: 1px solid #b2b1b1; width:596px; height:320px; overflow:auto; margin:10px;'>");
    arr.push("    <table id='tbTestModelList' class='cms_datatable'>");
    arr.push("    <tr><th>模板名称</th><th>&nbsp;</th></tr>");
    arr.push("    </table>");
    arr.push("</div>");
    var $jb = $.jBox(arr.join(""), {
        id: "jb_tml", title: "选择试卷模板", width: 620, top: "20%", buttons: { "关闭": true }, closed: function () {
            if ($dvTestModelList) {
                $dvTestModelList.hideLoading();
            }
        }
    });

    if (TestModelArray.length > 0) {
        bindTestModelList(TestModelArray, $jb.find("#tbTestModelList"));
    } else {
        $dvTestModelList = $jb.find("#dvTestModelList").showLoading();
        $excuteWS("~CmsWS.getTestModelList", { bookId: SimpleUser.user.bookId, userExtend: SimpleUser.user }, function (result) {
            $dvTestModelList.hideLoading();
            TestModelArray = (result) ? result : [];
            bindTestModelList(result, $jb.find("#tbTestModelList"));
        }, null, null);
    }
}

function bindTestModelList(testModels, table) {
    table.find("tr:gt(0)").remove();
    if (testModels && testModels.length > 0) {
        var rows = [];
        var rowClass = "";
        for (var i = 0; i < testModels.length; i++) {
            if (i % 2 == 0) {
                rowClass = "class='lightblue'";
            } else {
                rowClass = "";
            }
            rows.push("<tr " + rowClass + "><td>" + testModels[i].title + "</td><td style='width:100px; text-align:center'><a href='javascript:void(0)' onclick='applyTestModel(\"" + testModels[i].id + "\", this)'>选择</a></td></tr>");
        }
        table.append(rows.join(""));
    } else {
        table.append("<tr class='lightblue'><td colspan='2' align='center'>无数据</td></tr>");
    }
}

//应用所选择的模板
function applyTestModel(testModelId, obj) {
    var testModel = findTestModel(testModelId);
    if (testModel) {
        //$("#spTestModelName").show().prev().show();
        $("#spTestModelName").data("_id", testModel.id).html(testModel.title);
        $("#dvTestModel").data("_id", testModel.id).data("_isDirty", true);

        $("#txtTestModelName").val(testModel.title);
        $("#btnBuildTest").removeAttr("disabled");
        $("#btnAddQuestion").attr("disabled", "disabled");
        $("#btnSaveTestQuestion").attr("disabled", "disabled");
        $("#dvViewModel").hide().next().hide();


        //读取模板项的信息
        var $dvRightContent = $("#dvBuildTestBox").showLoading();
        $excuteWS("~CmsWS.getTestSampleListByModel", { testModelId: testModelId, userExtend: SimpleUser.user }, function (result) {
            TestSampleArray = (result) ? result : [];
            //第一次设置时,读取考试题型信息
            if (TestQuestionTypeArray && TestQuestionTypeArray.length == 0) {
                $excuteWS("~CmsWS.getTestQuestionTypeBookList", { bookId: SimpleUser.user.bookId, userExtend: SimpleUser.user }, function (result) {
                    $dvRightContent.hideLoading();
                    TestQuestionTypeArray = (result) ? result : [];
                    //createQuestionGroup(TestSampleArray);
                    //buildQuesTypeLabel();
                    showTestSampleList(TestSampleArray, $("#dvTestModel"));
                }, null, null);
            } else {
                $dvRightContent.hideLoading();
                //createQuestionGroup(TestSampleArray);
                //buildQuesTypeLabel();
                showTestSampleList(TestSampleArray, $("#dvTestModel"));
            }

        }, null, null);
    }
    $.jBox.close("jb_tml");
}

//查找模板对象
function findTestModel(testModelId) {
    var testModel = null;
    for (var i = 0; i < TestModelArray.length; i++) {
        if (TestModelArray[i].id == testModelId) {
            testModel = TestModelArray[i];
        }
    }
    return testModel;
}

//删除模板
function deleteTestModel(id) {
    var testModel = findTestModel(id);
    $.jBox.confirm("你确定要删除\"" + testModel.title + "\"吗?", "提示", function (v, h, f) {
        if (v == true) {
            $excuteWS("~CmsWS.deleteTestModel", { testModelId: id, bookId: SimpleUser.user.bookId, userExtend: SimpleUser.user }, function (result) {
                if (result) {
                    loadTestModels();
                } else {
                    $.jBox.tip("删除失败！", 'error');
                }
            }, null, null);
        }
    }, { top: "25%", buttons: { "确定": true, "取消": false } });
}

var _oldTestQuestionTypeId = "";
function addTestModelRow($table, oTestModel) {
    var sBuilder = new Array();
    sBuilder.push("<tr>");
    sBuilder.push("    <td style='text-align: left; width: 200px;'><select class='qType' style='width: 180px' onchange='onSelectQuestionType(this)'><option value='-1'>选择题类型</option></select></td>");
    sBuilder.push("    <td style='width: 100px'><input class='qNum' type='text' style='width: 30px' /></td>");
    sBuilder.push("    <td style='width: 100px'><input class='qScore' type='text' style='width: 30px' /></td>");
    sBuilder.push("    <td style='width: 80px' class='qTotalScore'></td>");
    sBuilder.push("    <td style='width: 50px'><img title='删除' src='../Images/close3.gif' onclick='delTestModelRow(this)' /></td>");
    sBuilder.push("</tr>");
    $table.append(sBuilder.join(""));

    //设置数据关联
    var $row = $table.find("tr:last");
    var options = [];
    for (var i = 0; i < TestQuestionTypeArray.length; i++) {
        options.push("<option value='" + TestQuestionTypeArray[i].id + "'>" + TestQuestionTypeArray[i].title + "</option>");
    }
    $row.find(".qType").append(options.join(""));
    $row.find(".qNum, .qScore").blur(function () {
        calcTotal($row);
    });

    //绑定默认数据
    if (oTestModel) {
        $row.find(".qType").val(oTestModel.testQuestionTypeId);
        $row.find(".qNum").val(oTestModel.questionNum);
        $row.find(".qScore").val(oTestModel.questionScore);
        calcTotal($row);

        if (oTestModel.testQuestionTypeId == _oldTestQuestionTypeId) {
            $row.prev().find(".qNum").attr("disabled", "disabled");
            $row.find(".qNum").attr("disabled", "disabled");
        }
        _oldTestQuestionTypeId = oTestModel.testQuestionTypeId;
    }
}

function delTestModelRow(o) {
    $(o).parent().parent().remove();
    $("#dvTestModel").data("_isDirty", true);
    $("#dvViewModel").hide().next().hide();
}

function calcTotal(p) {
    var r1, r2, m;

    var num = p.find(".qNum").val();
    var score = p.find(".qScore").val();

    if (num && score) {
        if (!isNaN(num) && !isNaN(score)) {
            r1 = parseFloat(num);
            r2 = parseFloat(score);
            m = accMul(r1, r2);
        } else {
            m = "";
        }
    } else {
        m = "";
    }

    p.find("td:eq(3)").text(m);
}

//验证模板输入的有效性
function validateTestModel() {
    var validData = { isValid: true, msg: "" };
    h = $("#dvTestModel");

    //if (h.find("#txtTestModelName").val() == "") {
    //    validData.isValid = false;
    //    validData.msg = "模板名称不能为空！";
    //    return validData;
    //}

    var $testModelItems = h.find("#tbTestModel tr");
    if ($testModelItems.length == 0) {
        validData.isValid = false;
        validData.msg = "题类型不能为空！";
        return validData;
    }

    $testModelItems.each(function () {
        if ($(this).find(".qType").val() == "-1") {
            validData.isValid = false;
            validData.msg = "请选择题类型！";
            return false;
        }
        if ($(this).find("td:eq(3)").text() == "") {
            validData.isValid = false;
            validData.msg = "题量或分数输入有误！";
            return false;
        }
    });
    return validData;
}

var old_testQuestionTypeId = "";
//获取模板项的值
function getTestSamples(testModelId) {
    var testSampleArray = [];
    var tmpTestSample;

    $("#tbTestModel tr").each(function () {
        tmpTestSample = {};
        tmpTestSample.testModelId = testModelId;
        tmpTestSample.testQuestionTypeId = $(this).find(".qType").val();
        tmpTestSample.questionNum = $(this).find(".qNum").val();
        tmpTestSample.questionScore = $(this).find(".qScore").val();
        if (tmpTestSample.testQuestionTypeId == old_testQuestionTypeId) {
            tmpTestSample.typeFlag = 0;
        } else {
            tmpTestSample.typeFlag = 1;
        }
        old_testQuestionTypeId = tmpTestSample.testQuestionTypeId;
        testSampleArray.push(tmpTestSample);
    });
    return testSampleArray;
}

function getTestModelObj(h) {
    var testModelObj = {};
    var testModelId = h.find("#dvTestModel").data("_testModelId");
    if (testModelId) {
        testModelObj = findTestModel(testModelId);
        testModelObj.title = h.find("#txtTestModelName").val();
    } else {
        testModelObj.bookId = SimpleUser.user.bookId;
        testModelObj.title = h.find("#txtTestModelName").val();
        testModelObj.userId = SimpleUser.user.userId
    }
    return testModelObj;
}

function findTestModel(testModelId) {
    var testModel = null;
    for (var i = 0; i < TestModelArray.length; i++) {
        if (TestModelArray[i].id == testModelId) {
            testModel = TestModelArray[i];
        }
    }
    return testModel;
}

//载入模板信息
function loadTMDetail(testModelId, container) {
    //模板基本信息
    var obj = findTestModel(testModelId);
    if (obj) {
        container.find("#txtTestModelName").val(obj.title);
    }

    $_dvTestModel = container.hideLoading().showLoading();
    //模板项的信息
    $excuteWS("~CmsWS.getTestSampleListByModel", { testModelId: testModelId, userExtend: SimpleUser.user }, showTestSampleList, null, container);
}

function showTestSampleList(testSamples, container) {
    $("#dvTestModel").show();

    if (!testSamples) {
        return;
    }

    var $table = container.find("#tbTestModel");
    $table.empty();
    for (var i = 0; i < testSamples.length; i++) {
        addTestModelRow($table, testSamples[i]);
    }
}

function onSelectQuestionType(o) {
    var $currRow = $(o).parent().parent();
    var $prevRow = $currRow.prev();
    var $nextRow = $currRow.next();

    if (o.value == $prevRow.find("select.qType").val() || o.value == $nextRow.find("select.qType").val()) {
        $currRow.find("input.qNum").val("1").attr("disabled", "disabled");

        if (o.value == $prevRow.find("select.qType").val()) {
            $prevRow.find("input.qNum").val("1").attr("disabled", "disabled");
        }

        if (o.value == $nextRow.find("select.qType").val()) {
            $nextRow.find("input.qNum").val("1").attr("disabled", "disabled");
        }
    } else {
        if ($prevRow.find("select.qType").val() != $nextRow.find("select.qType").val()) {
            $currRow.find("input.qNum").removeAttr("disabled");
        }
    }

    if ($prevRow.find("select.qType").val() != $nextRow.find("select.qType").val()) {
        if (o.value != $prevRow.find("select.qType").val() && $prevRow.find("select.qType").val() != $prevRow.prev().find("select.qType").val()) {
            $prevRow.find("input.qNum").removeAttr("disabled");
        }
        if (o.value != $nextRow.find("select.qType").val() && $nextRow.find("select.qType").val() != $nextRow.next().find("select.qType").val()) {
            $nextRow.find("input.qNum").removeAttr("disabled");
        }
    }

    var count = 0;
    $("#tbTestModel select.qType").each(function () {
        if (this.value == o.value) {
            count++;
            if (count == 2) {
                return false;
            }
        }
    });
    if (count > 1) {
        if (o.value != $prevRow.find("select.qType").val() && o.value != $nextRow.find("select.qType").val()) {
            $.jBox.tip('题类型已经存在，不能重复选择！', 'warning');
            o.value = "-1";
        }
    }

    if (o.value != $prevRow.find("select.qType").val() && o.value != $nextRow.find("select.qType").val()) {
        if ($prevRow[0] && $prevRow.find("select.qType").val() == $nextRow.find("select.qType").val()) {
            $.jBox.tip('题类型已经存在，不能重复选择！', 'warning');
            o.value = $prevRow.find("select.qType").val();
        }
    }
}