var ISBN = "";
var BookWrapperArray = [];
var TestModelArray = [];
var TestQuestionTypeArray = [];
var $_dvTestModel = null;

function PageLoad() {
    InitCmsMenu("m_TestModels");
    bindBookInfo();
    $("#btnAdd").click(function () {
        if ($("#selBookList").val() == "-1") {
            $.jBox.info("请选择书", "提示", { buttons: { '确定': true } });
        } else {
            editTestModel();
        }
    });
    $("#selBookList").change(function () {
        ISBN = $(this).val();
        if (ISBN != "-1") {
            var bookWrapper = findBookObj(ISBN);
            bindDiscipline(bookWrapper.disciplineId);
            bindSubject(bookWrapper.disciplineId, bookWrapper.subjectId);
            AddUserParam("isbn", ISBN);
            loadTestModels();
        } else {
            SetUserParam("isbn", "");
        }
    });
}

function bindBookInfo() {
    var oSel = $("#selBookList");
    $excuteWS("~CmsWS.getBookList", { userId: null, instituteIds: null, disciplineIds: null, subjectIds: null, realFlag: false, userExtend: SimpleUser }, function (result) {
        oSel.empty();
        if (result) {
            BookWrapperArray = result;
            $.each(result, function () {
                oSel.append("<option value='" + this.isbn + "' id='" + this.id + "' >" + this.title + "</option>");
            });
        }
        oSel.removeClass("sel_loading").prepend("<option value='-1'>请选择书</option>").get(0).selectedIndex = 0;

        //选择默认的书
        var args = getUrlParms();
        if (args["isbn"]) {
            oSel.val(args["isbn"]).trigger("change");
        } else {
            bindDiscipline();
        }
    }, null, null);
}

function findBookObj(isbn) {
    var book = null;
    for (var i = 0; i < BookWrapperArray.length; i++) {
        if (BookWrapperArray[i].isbn == isbn) {
            book = BookWrapperArray[i];
        }
    }
    return book;
}

//显示学科类别列表
function bindDiscipline(defVal) {
    var oSel = $("#Des");
    if (oSel.find("option").length > 0) {
        if (defVal) {
            oSel.val(defVal);
        }
    } else {
        //重新读取学科类别
        $excuteWS("~CmsWS.getDisciplineList", { userExtend: SimpleUser }, function (result) {
            oSel.empty();
            if (result && result.length > 0) {
                $.each(result, function () {
                    oSel.append("<option value='" + this.id + "'>" + this.disciplineName + "</option>");
                });
            }
            oSel.removeClass("sel_loading").prepend("<option value='-1'>请选择学科类别</option>").get(0).selectedIndex = 0;
            if (defVal) {
                oSel.val(defVal);
            }
        }, null, null);

        oSel.change(function () {
            if ($(this).val() != "-1") {
                bindSubject($(this).val(), null);
            } else {
                $("#Sub").empty();
            }
        });
    }
}

//显示学科列表
function bindSubject(disciplineId, defSubjectId) {
    var oSel = $("#Sub");
    var oldDisciplineId = oSel.data("_disciplineId");
    if (disciplineId == oldDisciplineId) {
        if (defSubjectId) {
            oSel.val(defSubjectId);
        }
    } else {
        //重新读取学科数据
        oSel.empty().addClass("sel_loading");
        $excuteWS("~CmsWS.getSubjectListByDisciplineId", { disciplineId: disciplineId, userExtend: SimpleUser }, function (result) {
            if (result && result.length > 0) {
                $.each(result, function () {
                    oSel.append("<option value='" + this.id + "'>" + this.subjectName + "</option>");
                });
                oSel.removeClass("sel_loading").prepend("<option value='-1'>请选择学科</option>").get(0).selectedIndex = 0;
                if (defSubjectId) {
                    oSel.val(defSubjectId);
                }
            }
        }, null, null);

        oSel.change(function () {
            if ($(this).val() == "-1") {
                bindBookListBySubjectId("");
            } else {
                bindBookListBySubjectId($(this).val());
            }
        });

        oSel.data("_disciplineId", disciplineId)
    }
}

//筛选出指定学科的书
function bindBookListBySubjectId(subjectId) {
    if (BookWrapperArray == null || BookWrapperArray.length == 0) return;

    var tarBookList = [];
    if (subjectId) {
        for (var i = 0; i < BookWrapperArray.length; i++) {
            if (BookWrapperArray[i].subjectId == subjectId) {
                tarBookList.push(BookWrapperArray[i]);
            }
        }
    } else {
        tarBookList = BookWrapperArray;
    }

    var oSel = $("#selBookList");
    oSel.find("option:gt(0)").remove();
    for (var i = 0; i < tarBookList.length; i++) {
        oSel.append("<option value='" + tarBookList[i].isbn + "' id='" + tarBookList[i].id + "' >" + tarBookList[i].title + "</option>");
    }
}

function loadTestModels() {
    var bookId = $("#selBookList").find("option:selected").attr("id");
    var $contentbox = $(".cms_contentbox").showLoading();
    $excuteWS("~CmsWS.getTestModelList", { bookId: bookId, userExtend: SimpleUser }, bindTestModelList, null, { contentbox: $contentbox });
}

function bindTestModelList(testModels, context) {
    var $contentbox = context.contentbox;
    var $dataTable = $contentbox.find(".cms_datatable");

    $contentbox.hideLoading();
    $dataTable.find("tr:gt(0)").remove();
    if (!testModels || testModels.length == 0) {
        $dataTable.append("<tr class='nodata lightblue'><td colspan='6'>无记录</td></tr>");
        return;
    }

    var sBuilder = [];
    var rowClass = "";
    var title = "";
    var description = "";

    TestModelArray = testModels;
    $.each(testModels, function (i) {
        if (i % 2 == 0) {
            rowClass = "class='lightblue'";
        } else {
            rowClass = "";
        }

        title = (this.title) ? this.title : "";
        //description = (this.description) ? this.description : "";

        sBuilder = [];
        sBuilder.push("<tr id='" + this.id + "' " + rowClass + ">");
        sBuilder.push("<td>" + title + "</td>");
        sBuilder.push("<td class='operate'><img src='Images/application_edit.png' title='编辑' onclick=\"editTestModel('" + this.id + "')\" />&nbsp;<img src='Images/application_delete.png' title='删除' onclick=\"deleteTestModel('" + this.id + "')\" /></td>");
        sBuilder.push("<td>&nbsp;</td>");
        sBuilder.push("</tr>");
        $dataTable.append(sBuilder.join(''));
    });

    $dataTable.find("tr:gt(0)").hover(function () {
        $(this).addClass("hover");
    }, function () {
        $(this).removeClass("hover");
    });
}

//编辑模板
function editTestModel(id) {
    var title = "";
    var testModelId = "";
    if (id) {
        title = "编辑模板";
        testModelId = id;
    } else {
        title = "添加新模板";
        testModelId = "";
    }
    
    var $jb = $.jBox(initBox(), {
        id: 'jb_testmodel', title: title, width: 600, top: "20%", buttons: { "保存": true, "取消": false }, submit: submitTestModel, closed: function () {
            if ($_dvTestModel) {
                $_dvTestModel.hideLoading();
            }
        }
    });
    var $dvTestModel = $jb.find("#dvTestModel");
    $dvTestModel.data("_testModelId", testModelId);
    $dvTestModel.find("#dvAddQuestionType a").click(function () {
        addTestModelRow($dvTestModel.find("#tbTestModel"));
    });

    //读取考试题型信息
    if (TestQuestionTypeArray && TestQuestionTypeArray.length == 0) {
        $dvTestModel.showLoading();
        var bookId = $("#selBookList").find("option:selected").attr("id");
        $excuteWS("~CmsWS.getTestQuestionTypeBookList", { bookId: bookId, userExtend: SimpleUser }, function (result) {
            $dvTestModel.hideLoading();
            TestQuestionTypeArray = (result) ? result : [];
        }, null, null);
    }

    //编辑考试模板
    if (testModelId) {
        loadTMDetail(testModelId, $dvTestModel);
    }
}

//删除模板
function deleteTestModel(id) {
    var testModel = findTestModel(id);
    $.jBox.confirm("你确定要删除\"" + testModel.title + "\"吗?", "提示", function (v, h, f) {
        if (v == true) {
            var bookId = $("#selBookList").find("option:selected").attr("id");
            $excuteWS("~CmsWS.deleteTestModel", { testModelId: id, bookId: bookId, userExtend: SimpleUser }, function (result) {
                if (result) {
                    loadTestModels();
                } else {
                    $.jBox.tip("删除失败！", 'error');
                }
            }, null, null);
        }
    }, { top: "25%", buttons: { "确定": true, "取消": false } });
}

//初始化界面
function initBox() {
    var sBuilder = new Array();
    sBuilder.push("<div id='dvTestModel' style='padding:10px'>");
    sBuilder.push("    <div style='height:36px'><label>模板名称:&nbsp;</label><input type='text' id='txtTestModelName' style='width:300px' /></div>");
    sBuilder.push("    <div id='dvHeader' style='background-color:#abc5e7; width:570px'>");
    sBuilder.push("        <table class='tm_lst' border='0'>");
    sBuilder.push("            <tr><th style='text-align:left; width:200px;'>&nbsp;题类型</th><th style='width: 100px'>题量</th><th style='width: 100px'>每题分数</th><th style='width: 80px'>总分</th><th style='width: 50px'>&nbsp;</th></tr>");
    sBuilder.push("        </table>");
    sBuilder.push("    </div>");
    sBuilder.push("    <div style='border:0px solid #abc5e7; height:230px; width:568px; overflow-y:auto'>");
    sBuilder.push("    <table id='tbTestModel' class='tm_lst' border='0'>");
    sBuilder.push("    </table>");
    sBuilder.push("    <div id='dvAddQuestionType' style='padding:3px'><a href='javascript:void(0)'>添加题类型</a></div>");
    sBuilder.push("    </div>");
    sBuilder.push("</div>");
    return sBuilder.join("");
}

function addTestModelRow($table, oTestModel) {
    var sBuilder = new Array();
    sBuilder.push("<tr>");
    sBuilder.push("    <td style='text-align: left; width: 200px;'><select class='qType' style='width: 180px'><option value='-1'>选择题类型</option></select></td>");
    sBuilder.push("    <td style='width: 100px'><input class='qNum' type='text' style='width: 30px' /></td>");
    sBuilder.push("    <td style='width: 100px'><input class='qScore' type='text' style='width: 30px' /></td>");
    sBuilder.push("    <td style='width: 80px'></td>");
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
    }

}

function delTestModelRow(o) {
    $(o).parent().parent().remove();
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

//保存模板
function submitTestModel(v, h, f) {
    if (v == true) {
        var validData = validateTestModel(h);
        if (validData.isValid == false) {
            $.jBox.tip(validData.msg, 'warning');
            return false;
        }

        //保存模板
        var testModel = getTestModelObj(h);
        $excuteWS("~CmsWS.saveTestModels", { testModel: testModel, bookId: testModel.bookId, userExtend: SimpleUser }, function (testModelId) {
            if (testModelId) {
                var testSampleArray = getTestSamples(h, testModelId);
                $excuteWS("~CmsWS.saveTestSamples", { testSamples: testSampleArray, testModelId: testModelId, userExtend: SimpleUser }, function (result) {
                    if (result) {
                        $.jBox.close("jb_testmodel");
                        $.jBox.tip("保存成功", 'success');
                        loadTestModels();
                    }
                }, null, null);
            }
        }, null, null);
        return false;
    }
}

//验证模板输入的有效性
function validateTestModel(h) {
    var validData = { isValid: true, msg: ""};

    if (h.find("#txtTestModelName").val() == "") {
        validData.isValid = false;
        validData.msg = "模板名称不能为空！";
        return validData;
    } 

    var $testModelItems = h.find("#tbTestModel tr");
    if ($testModelItems.length == 0) {
        validData.isValid = false;
        validData.msg = "模板不能为空！";
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

//获取模板项的值
function getTestSamples(h, testModelId) {
    var testSampleArray = [];
    var tmpTestSample;
    
    h.find("#tbTestModel tr").each(function () {
        tmpTestSample = {};
        tmpTestSample.testModelId = testModelId;
        tmpTestSample.testQuestionTypeId = $(this).find(".qType").val();
        tmpTestSample.questionNum = $(this).find(".qNum").val();
        tmpTestSample.questionScore = $(this).find(".qScore").val();
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
        var bookId = $("#selBookList").find("option:selected").attr("id");
        testModelObj.bookId = bookId;
        testModelObj.title = h.find("#txtTestModelName").val();
        testModelObj.userId = SimpleUser.userId
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
    $excuteWS("~CmsWS.getTestSampleListByModel", { testModelId: testModelId, userExtend: SimpleUser }, showTestSampleList, null, container);
}

function showTestSampleList(testSamples, container) {
    container.hideLoading();
    if (!testSamples) {
        return;
    }

    var $table = container.find("#tbTestModel");
    for (var i = 0; i < testSamples.length; i++) {
        addTestModelRow($table, testSamples[i]);
    }
}
