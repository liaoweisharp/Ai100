/// <reference path="../../Scripts/jquery-1.4.1.min.js" />

/*
* 查找试卷
*/

TestSearchDlg.pageSize = 10;   //分页大小

function TestSearchDlg(options) {
    var defaults = {
        data: {
            bookId: "",
            simpleUser: null
        },
        title: "选择试卷",
        callback: null
    };

    this.options = $.extend(defaults, options);
    this.container = null;
}

//显示对话框
TestSearchDlg.prototype.Show = function () {
    this.container = $.jBox(this.initUI(), { id: "jb_tsd", title: this.options.title, width: 620, top: "25%", buttons: { "关闭": true } });
    this.initData();
}

TestSearchDlg.prototype.initUI = function () {
    var sBuilder = new Array();
    sBuilder.push("<div id='dvTestSearchBox'>")
    sBuilder.push("<table style='margin-left:10px'>");
    sBuilder.push("    <tr>");
    sBuilder.push("        <td style='width:60px;'>试卷名称：</td>");
    sBuilder.push("        <td><input type='text' id='txtTestName' style='width:305px;' /></td>");
    sBuilder.push("    </tr>");
    sBuilder.push("    <tr>");
    sBuilder.push("        <td>搜索范围：</td>");
    sBuilder.push("        <td>");
    sBuilder.push("            <input type='radio' name='rdSearchRange' id='rdMyTests' />&nbsp;<label for='rdMyTests'>我创建的试卷</label>&nbsp;&nbsp;&nbsp;");
    sBuilder.push("            <input type='radio' name='rdSearchRange' id='rdAllTests' />&nbsp;<label for='rdAllTests'>所有试卷</label>");
    sBuilder.push("        </td>");
    sBuilder.push("    </tr>");
    sBuilder.push("</table>");
    sBuilder.push("<div id='dvTestList' style='border: 1px solid #b2b1b1; width:596px; height:280px; overflow:auto; margin:10px;'>");
    sBuilder.push("    <table id='tbTestList' class='cms_datatable'>");
    sBuilder.push("    <tr><td colspan='2' align='center' style='height:220px'>&nbsp;</td></tr>");
    sBuilder.push("    </table>");
    sBuilder.push("</div>");
    sBuilder.push("<div id='dvTestPagination' class='testPagination' style='margin:0px 10px 6px; text-align: center; '></div>");
    sBuilder.push("</div>");
    return sBuilder.join("");
}

TestSearchDlg.prototype.initData = function () {
    this.container.find("#dvTestSearchBox").data("_options", this.options);
    var testSearchDlg = this;
    this.container.find("input[name='rdSearchRange']").click(function () {
        testSearchDlg.getTests(this.id);
    });
}


TestSearchDlg.prototype.getTests = function (id) {
    var bookId = this.options.data.bookId;
    var testName = this.container.find("#txtTestName").val();
    var _simpleUser = this.options.data.simpleUser;
    var $tbTestList = this.container.find("#tbTestList");

    //保存查询条件，使下次打开查询窗口可以显示默认的查询(使用windows对象)
    //$("#btnAssociateTests").data("_testName", title);
    //$("#btnAssociateTests").data("_id", id);
    $dvTestList = this.container.find("#dvTestList").showLoading();
    switch (id) {
        case "rdMyTests":
            $excuteWS("~CmsWS.getTestIdsForUserId", { userId: _simpleUser.userId, bookId: bookId, title: testName, importFlag: "1", userExtend: _simpleUser }, function (result) {
                $dvTestList.hideLoading();
                var testIds = (result && result.length > 0) ? result : [];
                TSD_bindTestsPagination(testIds, $tbTestList);
            }, null, null);
            break;
        case "rdAllTests":
            $excuteWS("~CmsWS.getTestIdsByBookId", { bookId: bookId, title: testName, importFlag: "1", userExtend: _simpleUser }, function (result) {
                $dvTestList.hideLoading();
                var testIds = (result && result.length > 0) ? result : [];
                TSD_bindTestsPagination(testIds, $tbTestList);
            }, null, null);
            break;
    }

}

//获取试卷信息
function TSD_bindTestsPagination(testIdArray, tbTestList) {
    var pageSize = TestSearchDlg.pageSize;
    $("div.testPagination").html("").pagination(testIdArray.length, {
        num_edge_entries: 2,
        num_display_entries: 5,
        items_per_page: pageSize,
        prev_text: "上一页",
        next_text: "下一页",
        callback: function (page_index, o) {
            tbTestList.parent().showLoading();
            var _startPos = page_index * pageSize;
            var _endPos = _startPos + (pageSize - 1);
            var testIds = TSD_getIdsArray(testIdArray, _startPos, _endPos);
            $excuteWS("~CmsWS.getTestListForTestIds", { testIds: testIds, userExtend: SimpleUser }, function (result) {
                tbTestList.parent().hideLoading();
                TSD_bindTestList(result, tbTestList);
            }, null, null);
        }
    });
}

//绑定试卷列表
function TSD_bindTestList(testListArray, dataTable) {
    dataTable.empty();
    if (testListArray && testListArray.length > 0) {
        TestListArray = testListArray;
        var rows = [];
        var rowClass = "";
        for (var i = 0; i < testListArray.length; i++) {
            if (i % 2 == 0) {
                rowClass = "class='lightblue'";
            } else {
                rowClass = "";
            }
            rows.push("<tr " + rowClass + "><td>" + testListArray[i].title + "</td><td style='width:100px; text-align:center'><a href='javascript:void(0)' onclick='TSD_onSelectTest(\"" + testListArray[i].id + "\", this)'>选择</a></td></tr>");
        }
        dataTable.append(rows.join(""));
    } else {
        TestListArray = [];
        dataTable.append("<tr class='lightblue'><td align='center'>无数据</td></tr>");
    }
}

//根据用户选择执行回调
function TSD_onSelectTest(testId, o) {
    var $dvTestSearchBox = getTestSearchBox(o);
    if ($dvTestSearchBox.get(0)) {
        var _options = $dvTestSearchBox.data("_options");
        var fn = _options.callback;
        if (fn) {
            fn(testId);
            $.jBox.close("jb_tsd");
        }
    }
}

//找到容器对象
function getTestSearchBox(o) {
    var node = $(o);
    while (node.get(0) && node.attr("id") != "dvTestSearchBox") {
        node = node.parent();
    }
    if (node.attr("id") == "dvTestSearchBox") {
        return node;
    } else {
        return null;
    }
}

//根据索引，从数据中返回部分数据
function TSD_getIdsArray(idArray, startpos, endpos) {
    var tempIdArray = new Array();
    if (idArray) {
        var tidArray = idArray;
        var lastIndex = tidArray.length - 1;
        if (endpos > lastIndex) {
            endpos = lastIndex;
        }
        tempIdArray = tidArray.slice(startpos, endpos + 1);
    }
    return tempIdArray;
}