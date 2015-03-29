/// <reference path="../../Scripts/jquery-1.4.1.min.js" />

var TestQuestionTypeBookArray = [];
var TestQuestionTypeArray = [];
var BookWrapperArray = [];
var BOOK_ID = "";

function PageLoad() {
    InitCmsMenu("m_TestQuestionTypeDistribute");

    $("#cms_toolbar #btnAdd").click(function () {
        if ($("#selBookList").val() != "-1") {
            editTestQuestionTypeBook();
        } else {
            $.jBox.info("请选择书", "提示", { buttons: { '确定': true } });
        }
    });

    bindGradation();
    getBookInfo(); 
    $excuteWS("~CmsWS.getTestQuestionTypeSystemList", { userExtend: SimpleUser }, function (r) {
        TestQuestionTypeArray = r;
    }, null,null);
}

function loadTestQuestionTypeBook(bookId) {
    var $contentbox = $(".cms_contentbox");

    $contentbox.show();
    $contentbox.showLoading();
    $excuteWS("~CmsWS.getTestQuestionTypeBookList", { bookId: bookId,userExtend:SimpleUser }, bindTestQuestionTypeBookList, null, { contentbox: $contentbox });
}

function bindTestQuestionTypeBookList(result, context) {
    
    var $contentbox = context.contentbox;
    var $dataTable = $contentbox.find(".cms_datatable");

    $contentbox.hideLoading();
    $dataTable.find("tr:gt(0)").remove();
    if (!result || result.length == 0) {
        $dataTable.append("<tr class='nodata lightblue'><td colspan='4'>无记录</td></tr>");
        return;
    } else {
        TestQuestionTypeBookArray = result;
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
        sBuilder.push("<td>" + this.title + "</td>");
        sBuilder.push("<td>" + this.difficulty + "</td>");
        sBuilder.push("<td>" + this.score + "</td>");
        sBuilder.push("<td class='operate'><img src='Images/application_edit.png' title='编辑' onclick=\"editTestQuestionTypeBook('" + this.id + "')\" />&nbsp;<img src='Images/application_delete.png' title='删除' onclick=\"deleteTestQuestionTypeBook('" + this.id + "')\" /></td>");
        sBuilder.push("</tr>");
        $dataTable.append(sBuilder.join(''));
    });

    $dataTable.find("tr:gt(0)").hover(function () {
        $(this).addClass("hover");
    }, function () {
        $(this).removeClass("hover");
    });
}

function initTestQuestionTypeBookBox() {
    var sBuilder = new Array();
    sBuilder.push("<div id='cms_TestQuestionTypeBook' class='cms_dialog'>");
       sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp;考试题型：</li>");
    sBuilder.push("    <li class='inp'><select id='ddlTestQuestionType' name='ddlTestQuestionType' style='width:100%;'><option value='-1'>选择考试题型</option>");
    if (TestQuestionTypeArray && TestQuestionTypeArray.length > 0) {
        for (var i = 0; i < TestQuestionTypeArray.length; i++) {
            sBuilder.push("<option value='" + TestQuestionTypeArray[i].id + "'>" + TestQuestionTypeArray[i].title + "</option>");
        }
    }
    sBuilder.push("</select></li>");
    sBuilder.push("</ul>");

    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp;难度：</li>");
    sBuilder.push("    <li class='inp'><select id='ddlDifficulty' name='ddlDifficulty' style='width:100%;'><option value='-1'>请选择难度</option><option selected='selected' value='1'>1</option><option value='2'>2</option><option value='3'>3</option><option value='4'>4</option><option value='5'>5</option></select></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp;分数：</li>");
    sBuilder.push("    <li class='inp'><input id='txtScore' name='txtScore' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("</div>");
    return sBuilder.join("");
}

function editTestQuestionTypeBook(id) {
    var title = "";
    var _id = "";
    if (id) {
        title = "考试题型分配";
        _id = id;
    } else {
        title = "考试题型分配";
        _id = "";
    }

    var $jb = $.jBox(initTestQuestionTypeBookBox(), { id: 'jb_TestQuestionTypeBook', title: title, width: 580, top: "25%", buttons: { "保存": true, "取消": false }, submit: submitTestQuestionTypeBook });
    var $testQuestionType = $jb.find("#cms_TestQuestionTypeBook");
    $testQuestionType.data("_id", _id);

    if (id) {
        
        var testQuestionType = getTestQuestionTypeBookObj(id);
        $testQuestionType.find("#ddlTestQuestionType").val(testQuestionType.id);
        $testQuestionType.find("#ddlDifficulty").val(testQuestionType.difficulty);
        $testQuestionType.find("#txtScore").val(testQuestionType.score);
    }
}

function getTestQuestionTypeBookObj(id) {
    var testQuestionType = null;
    for (var i = 0; i < TestQuestionTypeBookArray.length; i++) {
        if (TestQuestionTypeBookArray[i].id == id) {
            testQuestionType = TestQuestionTypeBookArray[i];
            break;
        }
    }
    return testQuestionType;
}

function submitTestQuestionTypeBook(v, h, f) {
    if (v == true) {
        var validData = validateForm(f);
        if (validData.isValid == false) {
            $.jBox.tip(validData.msg, 'warning');
            return false;
        }
        var bstWrapper = getTestQuestionTypeBook(h);
        if (bstWrapper.id) {
            $excuteWS("~CmsWS.manageTestQuestionTypeBooks", { testQuestionTypes: [bstWrapper],bookId:BOOK_ID, userExtend: SimpleUser }, onEditTestQuestionTypeBook, null, null);
        } else {
            $excuteWS("~CmsWS.saveBookStructureType", { bookStructureTypeW: bstWrapper, userExtend: SimpleUser }, onSaveTestQuestionTypeBook, null, null);
        }
        return false;
    }
}

function validateForm(f) {
    var validData = { isValid: true, msg: "" };
    
    if (f.ddlTestQuestionType.trim() == "-1") {
        validData.isValid = false;
        validData.msg = "考试题型不能为空！";
    } else if (f.ddlDifficulty.trim() == "-1") {
        validData.isValid = false;
        validData.msg = "难度不能为空！";
    } else if (f.txtScore.trim() == "") {
        validData.isValid = false;
        validData.msg = "分数不能为空！";
    } else if (isNaN(f.txtScore.trim())) {
        validData.isValid = false;
        validData.msg = "分数必须为数字类型！";
    }

    return validData;
}

function getTestQuestionTypeBook(h) {
    var testQuestionType;
    var id = h.find("#cms_TestQuestionTypeBook").data("_id");
    if (id) {
        testQuestionType = getTestQuestionTypeBookObj(id);
        testQuestionType.id = h.find("#ddlTestQuestionType").val().trim();
        testQuestionType.difficulty = h.find("#ddlDifficulty").val().trim();
        testQuestionType.score = h.find("#txtScore").val().trim();
    } else {
        testQuestionType = {};
        testQuestionType.bookId = $("#selBookList option:selected").attr("id");
        testQuestionType.id = h.find("#ddlTestQuestionType").val().trim();
        testQuestionType.difficulty = h.find("#ddlDifficulty").val().trim();
        testQuestionType.score = h.find("#txtScore").val().trim();
    }
    return testQuestionType;
}

function onSaveTestQuestionTypeBook(result) {
    var bookStructureType = result;
    if (!bookStructureType) {
        $.jBox.tip("保存失败！", 'error');
    } else {
        $.jBox.close('jb_TestQuestionTypeBook');
        TestQuestionTypeBookArray.push(bookStructureType);

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

        var showFlag = (bookStructureType.showFlag == "1") ? "是" : "否";
        sBuilder = new Array();
        sBuilder.push("<tr id='" + bookStructureType.id + "' " + rowClass + ">");
        sBuilder.push("<td>" + bookStructureType.structureType + "</td>");
        sBuilder.push("<td>" + bookStructureType.structureLevel + "</td>");
        sBuilder.push("<td>" + showFlag + "</td>");
        sBuilder.push("<td class='operate'><img src='Images/application_edit.png' title='编辑' onclick=\"editTestQuestionTypeBook('" + bookStructureType.id + "')\" />&nbsp;<img src='Images/application_delete.png' title='删除' onclick=\"deleteTestQuestionTypeBook('" + bookStructureType.id + "')\" /></td>");
        sBuilder.push("</tr>");
        $dataTable.append(sBuilder.join(''));
        $dataTable.find("tr:last").hover(function () {
            $(this).addClass("hover");
        }, function () {
            $(this).removeClass("hover");
        });
    }
}

function onEditTestQuestionTypeBook(result) {
    var testQuestionTypeBook = result;
    if (!testQuestionTypeBook) {
        $.jBox.tip("更新失败！", 'error');
    } else {
        $.jBox.close('jb_TestQuestionTypeBook');
        loadTestQuestionTypeBook(BOOK_ID);
    }
}

function deleteTestQuestionTypeBook(id) {
    var testQuestionType = getTestQuestionTypeBookObj(id);
    $.jBox.confirm("你确定要删除类型“" + testQuestionType.title + "”吗?", "提示", function (v, h, f) {
        if (v == true) {
            $excuteWS("~CmsWS.deleteTestQuestionTypeBook", { testQuestionType: testQuestionType,bookId:BOOK_ID, userExtend: SimpleUser }, function (result) {
                if (result) {
                    loadTestQuestionTypeBook(BOOK_ID);
                } else {
                    $.jBox.tip("删除失败！", 'error');
                }
            }, null, null);
        }
    }, { top: "25%", buttons: { "确定": true, "取消": false } });
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
            }
        });
    }, null, null);

    ddl.data("_gradationId", gradationId);
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

//显示学科列表
function bindSubject(disciplineId, def) {
    var ddl = $("#Sub");
    var oldDisciplineId = ddl.data("_disciplineId");

    if (disciplineId == oldDisciplineId) {
        return;
    }

    ddl.empty().unbind("change").addClass("sel_loading");
    $excuteWS("~CmsWS.getSubjectListByDisciplineId", { disciplineId: disciplineId, userExtend: SimpleUser }, function (result) {
        //赋值
        var options = [];
        if (result && result.length > 0) {
            $.each(result, function () {
                if (this.disciplineId == disciplineId) {
                    options.push("<option value='" + this.id + "'>" + this.subjectName + "</option>");
                }
            });
        }
        ddl.removeClass("sel_loading").append("<option value='-1'>请选择学科</option>");
        ddl.append(options.join(""));

        //事件
        ddl.change(function () {
            var subjectId = $(this).val();
            if (subjectId != "-1") {
                getBookInfo(subjectId);
            } else {
                getBookInfo();
            }
        });

        //默认值
        if (def) {
            ddl.val(def);
        }
    }, null, null);

    ddl.data("_disciplineId", disciplineId);
}

//显示书
function getBookInfo(subjectId) {
    var ddl = $("#selBookList");

    if (BookWrapperArray && BookWrapperArray.length > 0) {
        ddl.empty().unbind("change").append("<option value='-1'>请选择书</option>");
        bindBookInfo(BookWrapperArray, subjectId);
    } else {
        ddl.empty().unbind("change").addClass("sel_loading");
        $excuteWS("~CmsWS.getBookList", { userId: null, instituteIds: null, disciplineIds: null, subjectIds: null, realFlag: null, userExtend: SimpleUser }, function (result) {
            ddl.removeClass("sel_loading").append("<option value='-1'>请选择书</option>");
            if (result) {
                BookWrapperArray = result;
                bindBookInfo(result, subjectId);
            }
        }, null, null);
    }
}

function bindBookInfo(bookArr, subjectId) {
    var options = [];
    if (subjectId) {
        $.each(bookArr, function () {
            if (this.subjectId == subjectId) {
                options.push("<option value='" + this.isbn + "' id='" + this.id + "' >" + this.title + "</option>");
            }
        });
    } else {
        $.each(bookArr, function () {
            options.push("<option value='" + this.isbn + "' id='" + this.id + "' >" + this.title + "</option>");
        });
    }
    $("#selBookList").append(options.join(""))
    .change(function () {
        BOOK_ID = $(this).find("option:selected").attr("id");
        if (BOOK_ID != "-1") {
            var bookWrapper = findBookObj(BOOK_ID);
            bindDisciplineById(bookWrapper.disciplineId);
            bindSubject(bookWrapper.disciplineId, bookWrapper.subjectId);
            loadTestQuestionTypeBook(BOOK_ID);
        } else {
            $(".cms_contentbox").hide();
        }
    });
}

function findBookObj(bookId) {
    
    var book = null;
    for (var i = 0; i < BookWrapperArray.length; i++) {
        if (BookWrapperArray[i].id == bookId) {
            book = BookWrapperArray[i];
        }
    }
    return book;
}
