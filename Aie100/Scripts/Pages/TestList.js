//初始化考试管理层
function initTestManageBox() {
    setTestNameTip();
    $("#ddlTestType").bind("change", queryTestInfo).trigger("change");
    $("#txtTestName").data("_oldval", "").blur(function () {
        var val = (this.value != InputTestNameTip) ? this.value : "";
        if (val != $(this).data("_oldval")) {
            queryTestInfo();
            $(this).data("_oldval", val);
        }
    });
    $("#ddlImportFlag").val("").bind("change", queryTestInfo);
}

//设置考试名称输入框提示信息
function setTestNameTip() {
    $("#txtTestName").val(InputTestNameTip).css("color", "#808080")
        .focus(function () {
            if (this.value == InputTestNameTip) {
                $(this).val("").css("color", "");
            }
        })
        .blur(function () {
            if (this.value == "") {
                $(this).val(InputTestNameTip).css("color", "#808080");
            }
        });
}

//显示我的考试列表
function loadMyTestList() {
    var val = $("#txtTestName").val();
    var testName = (val != InputTestNameTip) ? val : "";
    var $contentbox = $(".cms_contentbox:visible").showLoading();
    var importFlag = $("#ddlImportFlag").val();
    var simpleUser = get_simpleUser();
    $excuteWS("~CmsWS.getTestIdsForUserId", { userId: simpleUser.userId, bookId: simpleUser.bookId, title: testName, importFlag: importFlag, userExtend: simpleUser }, function (result) {
        $contentbox.hideLoading();
        var testIds = (result && result.length > 0) ? result : [];
        bindTestsPagination(testIds);
    }, null, null);
}

//显示所有考试列表
function loadAllTestList() {
    var bookId = $("#selBookList").find("option:selected").attr("id");
    var val = $("#txtTestName").val();
    var testName = (val != InputTestNameTip) ? val : "";
    var $contentbox = $(".cms_contentbox:visible").showLoading();
    var importFlag = $("#ddlImportFlag").val();
    var simpleUser = get_simpleUser();
    $excuteWS("~CmsWS.getTestIdsByBookId", { bookId: simpleUser.bookId, title: testName, importFlag: importFlag, userExtend: simpleUser }, function (result) {
        $contentbox.hideLoading();
        var testIds = (result && result.length > 0) ? result : [];
        bindTestsPagination(testIds);
    }, null, null);
}

//查询考试信息
function queryTestInfo() {
    var testType = $("#ddlTestType").val();
    if (testType == "0") {
        loadMyTestList();
    } else {
        loadAllTestList();
    }
}


var tpageSize = 15;
function bindTestsPagination(testIdArray) {
    $("div.testPagination").html("").pagination(testIdArray.length, {
        num_edge_entries: 2,
        num_display_entries: 5,
        items_per_page: tpageSize,
        prev_text: "上一页",
        next_text: "下一页",
        callback: function (page_index, o) {
            var $contentbox = $(".cms_contentbox:visible").showLoading();
            var _startPos = page_index * tpageSize;
            var _endPos = _startPos + (tpageSize - 1);
            var testIds = getIdsArray(testIdArray, _startPos, _endPos);
            $excuteWS("~CmsWS.getTestListForTestIds", { testIds: testIds, userExtend: get_simpleUser() }, function (result) {
                $contentbox.hideLoading();
                var tests = (result && result.length > 0) ? result : [];
                bindTestList(tests);
            }, null, null);
        }
    });
}

function bindTestList(testArray) {
    TestPartArray = testArray;
    var dataTable = $("#tbTestList");
    dataTable.find("tr:gt(0)").remove();
    if (testArray && testArray.length > 0) {
        var rows = [];
        var rowClass = "";
        var description = "";
        var stdVisible = "";
        var currUserId = get_simpleUser().userId;

        for (var i = 0; i < testArray.length; i++) {
            if (i % 2 == 0) {
                rowClass = "class='lightblue'";
            } else {
                rowClass = "";
            }

            stdVisible = (testArray[i].stdVisible == "1") ? "是" : "否";
            //description = testArray[i].description ? testArray[i].description : "";
            rows.push("<tr " + rowClass + ">");
            rows.push("<td class='oper'><input type='radio' name='selectTest' id='" + testArray[i].id + "'/></td>");
            rows.push("<td>" + testArray[i].title + "</td>");
            rows.push("<td>" + getDifficultyName(testArray[i].difficulty) + "</td>");
            rows.push("<td>" + testArray[i].timeLength + "</td>");
            rows.push("<td>" + stdVisible + "</td>");
            rows.push("<td>" + getShareName(testArray[i].shareFlag) + "</td>");
            rows.push("<td class='operate'>");
            rows.push("<img src='../Images/page.png' title='试卷预览' onclick=\"viewTestPaper('" + testArray[i].id + "')\" />&nbsp;");
            if (currUserId == testArray[i].userId) {
                rows.push("<img src='../Images/page_delete.png' title='删除试卷' onclick=\"delTestPaper('" + testArray[i].id + "')\" />&nbsp;");
                if (testArray[i].importFlag == '1') {
                    rows.push("<img src='../Images/page_white_delete.png' title='删除试卷和题' onclick=\"delTestAndQuestion('" + testArray[i].id + "')\" />&nbsp;");
                }
            }
            rows.push("</td>");
            rows.push("<td>&nbsp;</td>");
            rows.push("</tr>");
        }
        dataTable.append(rows.join(""));
        dataTable.find(".oper input").bind("click", onSelectTest);
    } else {
        dataTable.append("<tr class='lightblue'><td align='center' colspan='6'>无数据</td></tr>");
    }

    //选中新建的试卷
    var testQuestionId = $("#tbTestList").data("_testQuestionId");
    if (testQuestionId) {
        $("#tbTestList").data("_testQuestionId", "");
        $("#" + testQuestionId).attr("checked", true);
    }
}

function editTestInfo() {
    $(".cseltab_bg #ulTestBaseInfo").trigger("click");
    showBuildTestBox(true);
}

//返回难度
function getDifficultyName(diff) {
    var enumDifficulty = { "1": "基础", "2": "简单", "3": "中等", "4": "困难", "5": "挑战" };
    for (var k in enumDifficulty) {
        if (diff == k) {
            return enumDifficulty[k];
        }
    }
    return "";
}

//共享模式
function getShareName(shareFlag) {
    var enumShareType = { "0": "自己", "1": "课程", "2": "书" };
    for (var k in enumShareType) {
        if (shareFlag == k) {
            return enumShareType[k];
        }
    }
    return "";
}

function bindBookInfo() {
    var oSel = $("#selBookList");
    $excuteWS("~CmsWS.getBookList", { userId: null, instituteIds: null, disciplineIds: null, subjectIds: null, realFlag: false, userExtend: SimpleUser.user }, function (books) {
        oSel.empty();
        if (result) {
            BookWrapperArray = result;
            $.each(result, function () {
                oSel.append("<option value='" + this.isbn + "' id='" + this.id + "' >" + this.title + "</option>");
            });
        }
        oSel.removeClass("sel_loading").prepend("<option value='-1'>请选择书</option>").get(0).selectedIndex = 0;

        //选择默认的书
        var args = GetUrlParms();
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
        $excuteWS("~CmsWS.getDisciplineList", { userExtend: SimpleUser.user }, function (result) {
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
        $excuteWS("~CmsWS.getSubjectListByDisciplineId", { disciplineId: disciplineId, userExtend: SimpleUser.user }, function (result) {
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

//试卷预览
function viewTestPaper(testId) {
    var bookId = get_simpleUser().bookId;
    openNewWindow("../CMS/ViewTestPaper.aspx?bookId=" + bookId + "&testId=" + testId);
}

//删除试卷
function delTestPaper(testId) {
    $.jBox.confirm("你确定要删除这套试卷吗?", "删除试卷", function (v, h, f) {
        if (v == 'ok') {
            $.jBox.tip("正在删除数据...", 'loading');
            $excuteWS("~CmsWS.removeTest", { testId: testId, userExtend: SimpleUser.user }, delTestHandler, null, null);
        }
    }, { top: '30%' });
}

//删除试卷和题
function delTestAndQuestion(testId) {
    $.jBox.confirm("你确定要删除这套试卷以及所包含的题吗?", "删除试卷和题", function (v, h, f) {
        if (v == 'ok') {
            $.jBox.tip("正在删除数据...", 'loading');
            $excuteWS("~CmsWS.removeTestAndQuestion", { testId: testId, isbn: ISBN, userExtend: SimpleUser.user }, delTestHandler, null, null);
        }
    }, { top: '30%' });
}

function delTestHandler(b) {
    if (b) {
        $.jBox.tip('删除成功.', 'success');
        queryTestInfo();
    } else {
        $.jBox.tip('删除失败!', 'error');
    }
}

function onSelectTest() {
    //alert(this.id);
    //var cls = $(this).parent().parent().get(0).className;
    //$(this).parent().parent().removeClass(cls).addClass("selectrow");
}