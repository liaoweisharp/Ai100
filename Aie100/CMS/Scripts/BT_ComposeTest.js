/// <reference path="TestManageGlobal.js" />
/// <reference path="BT_Common.js" />
/// <reference path="BT_SelectQuestions.js" />


/*
* 创建考试:组卷
*/

//显示组卷信息
function showComposeContent() {
    var $dvTestModel = $("#dvTestModel");
    //if ($dvTestModel.data("_isDirty")) {
        $dvTestModel.data("_isDirty", false);
        TestSampleArray = getTestSamples($("#spTestModelName").data("_id"));
        createQuestionGroup(TestSampleArray);
        buildQuesTypeLabel();
    //}

    if (!_BookStructureData) {
        $("#bookStructureTree").data("_isNewLoad", false);
        $("#bookStructureTree").empty().html("<img src='../Images/ajax-loader_b.gif' style='margin-left:38%; margin-top:5%;' />");
        $excuteWS("~CmsWS.getBookStructureArray", { isbn: ISBN, isLazy: true }, buildBookStructureTree, null, null);
    } else {
        if ($("#bookStructureTree").data("_isNewLoad") == true) {   //每次新打开组卷界面层的时候重新加载树，以清除上一次在树上的选择
            $("#bookStructureTree").data("_isNewLoad", false);
            buildBookStructureTree(_BookStructureData);
        }
    }
}

function buildBookStructureTree(bsData) {
    ///<summary>构造BookStructure树</summary>

    _BookStructureData = bsData;
    var bsTreeNodes = _BookStructureData[0];
    if (!bsTreeNodes) {
        return;
    }

    KnowledgePointsDataSvr = new KnowledgePointsData();

    var $tree = $("#bookStructureTree").dynatree({
        title: "Book Structure Tree",
        clickFolderMode: 1,
        checkbox: true,
        selectMode: 3,
        children: bsTreeNodes,
        cookieId: "bookStructureTree",
        onLazyRead: function (node) {
            var structureId = node.data.key;
            SimpleUser.isbn = ISBN;
            $excuteWS("~CmsWS.getLearningObjectiveWithStructureList", { structureId: structureId, isbn: ISBN, exCurriculumId: "", userExtend: SimpleUser }, onGetKnowledgePoints, null, node);
        },
        onClick: function (node, event) {
        },
        onDblClick: function (node, event) {
            node.toggleExpand();
        }
    });

    if (window.isReloadTree) {
        $tree.dynatree("getTree").reload();
    } else {
        window.isReloadTree = true;
    }

    ResetTreeNavFrameHeight("bookStructureTree", "dvQuesBox");
    setQuestionContentHeight();
    $("#tbContentbox").colResizable({
        liveDrag: true,
        minWidth: 100
    });
}

function onGetKnowledgePoints(result, node) {
    if (result != null && result.length > 0) {
        KnowledgePointsDataSvr.AppendStructure(node.data.key, result);
        var kpNodes = new Array();
        var kpNode = null;
        $.each(result, function () {
            kpNode = {};
            kpNode.title = this.unit + ". " + this.name;
            kpNode.key = this.id;
            kpNode.select = node.isSelected();
            kpNodes.push(kpNode);
        });
        node.addChild(kpNodes);
    } else {
        KnowledgePointsDataSvr.AppendStructure(node.data.key, []);
        node.data.isFolder = false;
        node.render();
    }
    node.setLazyNodeStatus(DTNodeStatus_Ok);
}

//根据考试模板生成题型标签
function buildQuesTypeLabel() {
    var ul = [];
    ul.push("<ul>");
    for (var i = 0; i < _TestQuestionGroups.length; i++) {
        ul.push("<li id='" + _TestQuestionGroups[i].testQuestionTypeId + "'>" + _TestQuestionGroups[i].title + " (" + _TestQuestionGroups[i].questionNum + ")</li>");
    }
    ul.push("</ul>");
    $("#dvTestQuesType").html(ul.join(""));
}

function onBuildTest() {
    //生成数据之前清空之前的数据
    BT_ClearTestData();

    var structureIds = [];
    var loIds = [];
    var selectedNodes = $("#bookStructureTree").dynatree("getTree").getSelectedNodes(true);
    for (var i = 0; i < selectedNodes.length; i++) {
        if (selectedNodes[i].parent.data.structureLevel == "10") {
            loIds.push(selectedNodes[i].data.key);
        } else {
            structureIds.push(selectedNodes[i].data.key);
        }
    }
    var $dvRightContent = $("#dvQuesBox").showLoading();
    var diff = $("#dlg_ddlDifficultye").val();
    SimpleUser.isbn = ISBN;
    $excuteWS("~CmsWS.getQuestionListByTestSample", { testSamples: TestSampleArray, structureIds: structureIds, loIds: loIds, difficulty: diff, userExtend: SimpleUser }, function (result) {
        $dvRightContent.hideLoading();
        if (result) {
            _TestQuestionBank = result;
            groupByTestQuestionType(result);
            setQuestionScore();
            buildQuesTypeLabelByPaper();
            $("#dvViewModel").show().next().show();
            $("#dvTestQuesType li:eq(0)").trigger("click");
            $("#btnSaveTestQuestion").removeAttr("disabled");
        }
    }, null, null);
}


var _oldShowModel = "";
//根据试卷生成题类型标签
function buildQuesTypeLabelByPaper() {
    var num, lackQuesTip;
    var ul = [];
    ul.push("<ul>");
    for (var i = 0; i < _TestQuestionGroups.length; i++) {
        num = _TestQuestionGroups[i].questions.length;
        lackQuesTip = ""
        if (num != _TestQuestionGroups[i].questionNum) {
            lackQuesTip = "class='lackQuesTip'";    //题量不够增加提示
        }
        ul.push("<li id='" + _TestQuestionGroups[i].testQuestionTypeId + "'>" + _TestQuestionGroups[i].title + " (<span " + lackQuesTip + ">" + num + "/" + _TestQuestionGroups[i].questionNum + "</span>)</li>");
    }
    ul.push("</ul>");
    $("#dvTestQuesType").html(ul.join("")).find("li").click(function () {
        if (this.className == "selected") {
            return;
        } else {
            _oldShowModel = "";
        }
        //
        $(this).removeClass().addClass("selected").siblings().removeClass("selected");
        $("#ulByQuestion").trigger("click");
    });
}

//切换题显示模式选项卡
function onSelViewModelTab() {
    var $currTab = $(this);
    var $siblingTabs = $currTab.siblings();
    if (this.className != "custab_ul_s") {
        $siblingTabs.removeClass().addClass("custab_ul");
        $siblingTabs.find("li").each(function () {
            this.className = this.className.replace("_s", "");
        });

        $currTab.removeClass().addClass("custab_ul_s");
        $currTab.find("li").each(function () {
            this.className = this.className + "_s";
        });
    }

    var currId = $currTab.attr("id");
    if (currId != _oldShowModel) {
        assignSubQuestionScore();
        switch (currId) {
            case "ulByQuestion":
                showByQuestion(); break;
            case "ulByLo":
                showByLo(); break;
        }
        _oldShowModel = currId;
    }
}

//按题显示
function showByQuestion() {
    var testQuestionTypeId = $("#dvTestQuesType li.selected").attr("id");
    var questions = getQuestionsByTid(testQuestionTypeId);
    var quesNum, score;
    var trs = [];
    for (var i = 0; i < questions.length; i++) {
        quesNum = i + 1;
        score = questions[i].score.replace(".0", "");
        trs.push("<tr id='" + questions[i].id + "' class='mq'>");
        trs.push("<td class='oper'><span onmouseover=\"BT_onQuestonActionMenuShow(this,event,true)\" onmouseout=\"BT_onQuestonActionMenuShow(this,event,false)\"><img src=\"../CMS/Images/wrench.png\" alt=\"\"></span>" + BT_getQuestionActionMenu(questions[i]) + "</td>");
        //trs.push("<td class='oper'><input type='button' value='选题' onclick='manualSelectQuestion(\"" + questions[i].id + "\",this)' /></td>");
        //trs.push("<td class='oper'><input type='button' value='换题' onclick='autoSelectQuestion(\"" + questions[i].id + "\",this)' /></td>");
        trs.push("<td class='num'>" + quesNum + ".&nbsp;(" + score + "分)</td>");
        trs.push("<td class='content'>" + buildQuestionContent(questions[i]) + "</td>");
        trs.push("</tr>");
    }
    $("#tbQuesList").empty().append(trs.join(""))
        .removeClass().addClass("tbQuestionList").find("tr.mq:even").addClass("highlight");

    //根据题量判断是否可以添加新题
    if ($("#dvTestQuesType li.selected span").hasClass("lackQuesTip")) {
        $("#btnAddQuestion").removeAttr("disabled");
    } else {
        $("#btnAddQuestion").attr("disabled", "disabled");
    }

}

//按知识点显示题
function showByLo() {
    var testQuestionTypeId = $("#dvTestQuesType li.selected").attr("id");
    var questionIds = getQuestionIdsByTid(testQuestionTypeId);

    var $content = $("#dvQuesBox").showLoading();
    $excuteWS("~CmsWS.getLoQuestionArray", { questionIds: questionIds, userExtend: SimpleUser }, function (result) {
        $content.hideLoading();
        LoQuestionArray = (result && result.length > 0) ? result : [];
        buildLoQuestionsList();
    }, null, null);
}

//显示子题
function showSubQuestions(subQuestions, score) {
    var num, tscore, subScore;
    var tb = [];
    for (var i = 0; i < subQuestions.length; i++) {
        num = i + 1;
        subScore = (subQuestions[i].score) ? subQuestions[i].score : "";
        tb.push("<tr>");
        tb.push("<td style='width:110px'>(" + num + ").&nbsp;<input type='text' id='" + subQuestions[i].id + "' value='" + subScore + "' style='width:30px; border:1px solid #26A0DA;' />&nbsp;分</td>");
        tb.push("<td>" + subQuestions[i].content + "</td>");
        tb.push("</tr>");
    }
    tscore = score.replace(".0", "");
    return "<table class='subQuesList' score='" + tscore + "' style='width:100%'>" + tb.join("") + "</table>";
}

//根据知识点生成题列表
function buildLoQuestionsList() {
    if (LoQuestionArray.length == 0) return;
    var los = LoQuestionArray[1];
    var cls = "";
    var trs = [];
    for (var i = 0; i < los.length; i++) {
        if (i % 2 == 0) {
            cls = "highlight";
        } else {
            cls = "";
        }
        trs.push("<tr class='" + cls + "'><td>" + buildLoQuestions(los[i]) + "</td></tr>");
    }
    $("#tbQuesList").empty().append(trs.join(""))
        .removeClass().addClass("tbLoQuestionList");
}

//生成一个知识点和对应的题列表
function buildLoQuestions(lo) {
    var questionIds = [];
    var loQuestionMaps = LoQuestionArray[0];
    var n = loQuestionMaps.indexOf("key", lo.id);
    if (n != -1) {
        questionIds = loQuestionMaps[n].value;
    }

    var tb = [];
    tb.push("<table>");
    tb.push("<tr><td style='width:40px' align='center' class='expander' onclick='onExpandQuesList(this)'><img src='../Images/sanjiaoNormal.gif' /></td><td width='50'>" + lo.unit + "</td><td>" + lo.name + "&nbsp;(" + questionIds.length + "题)</td></tr>");
    tb.push("<tr style='display:none'><td colspan='3' style='padding-left:30px'>" + buildQuestionList(questionIds) + "</td></tr>");
    tb.push("</table>");
    return tb.join("");
}

//创建题列表
function buildQuestionList(questionIds) {
    var quesNum, score;
    var tb = [];
    var testQuestionTypeId = $("#dvTestQuesType li.selected").attr("id");
    var questions = getQuestionsByIds(questionIds, testQuestionTypeId);

    if (questions.length == 0) {
        return "";
    }

    tb.push("<table class='tbQuestionList'>");
    for (var i = 0; i < questions.length; i++) {
        quesNum = i + 1;
        score = questions[i].score.replace(".0", "");

        tb.push("<tr id='" + questions[i].id + "' class='mq'>");
        tb.push("<td class='oper'><span onmouseover=\"BT_onQuestonActionMenuShow(this,event,true)\" onmouseout=\"BT_onQuestonActionMenuShow(this,event,false)\"><img src=\"../CMS/Images/wrench.png\" alt=\"\"></span>" + BT_getQuestionActionMenu(questions[i]) + "</td>");
        tb.push("<td class='num'>" + quesNum + ".&nbsp;(" + score + "分)</td>");
        tb.push("<td class='content'>" + buildQuestionContent(questions[i]) + "</td>");
        tb.push("</tr>");
    }
    tb.push("</table>");
    return tb.join("");
}

//生成题
function buildQuestionContent(q) {
    var qHtml = [];
    qHtml.push("<div>" + q.content + "</div>");
    if (q.subQuestions) {
        qHtml.push(showSubQuestions(q.subQuestions, q.score));
    }
    return qHtml.join("");
}

//替换题内容
function replaceQuesContent(question, replaceRow) {
    var qContent = buildQuestionContent(question);
    replaceRow.attr("id", question.id).find("td.content").html(qContent);
}

//增加题内容
function addQuesContent(question) {
    var qContent = buildQuestionContent(question);
    var $tbQuesList = $("#tbQuesList");
    var quesNum = $tbQuesList.find("tr.mq").length + 1;
    var score = question.score.replace(".0", "");
    var tb = [];

    var cls = "mq highlight";
    if (quesNum % 2 == 0) {
        cls = "mq";
    }

    tb.push("<tr class='" + cls + "'>");
    tb.push("<td class='oper'><span onmouseover=\"BT_onQuestonActionMenuShow(this,event,true)\" onmouseout=\"BT_onQuestonActionMenuShow(this,event,false)\"><img src=\"../CMS/Images/wrench.png\" alt=\"\"></span>" + BT_getQuestionActionMenu(question) + "</td>");
    tb.push("<td class='num'>" + quesNum + ".&nbsp;(" + score + "分)</td>");
    tb.push("<td class='content'>" + buildQuestionContent(question) + "</td>");
    tb.push("</tr>");
    $tbQuesList.append(tb.join(""));
}

//选择添加的题需要执行的操作
function onSelectAddQuestion() {
    var $dvSelQuesBox = $("#dvSelQuesBox");
    var testQuestionTypeId = $("#dvTestQuesType li.selected").attr("id");
    var allowNum = getAllowNumForQuesGroup(testQuestionTypeId);
    var b, question;

    if (this.checked) {
        //不允许多添加题
        if (SelectedQuestions.length == allowNum) {
            $.jBox.tip("只能选择 " + allowNum + " 道题！", "warning");
            this.checked = false;
            return;
        }

        question = getObjById(this.id, AlternativeQuestions);
        b = addObjToArr(question, SelectedQuestions);
        if (b) {
            $dvSelQuesBox.find("span.added").html(SelectedQuestions.length);
            $(this).parent().parent().addClass("selectrow");
        }
    } else {
        b = delObjById(this.id, SelectedQuestions);
        if (b) {
            $dvSelQuesBox.find("span.added").html(SelectedQuestions.length);
            $(this).parent().parent().removeClass("selectrow");
        }
    }
}

//替换题
function replaceQuestion(questionId) {
    closeSelectQuestionBox();

    //被替换的内容
    var $tbQuesList = $("#tbQuesList");
    var repId = $tbQuesList.data("_repId");
    var replaceRow = $tbQuesList.data("_replaceRow");
    var q = getAlternativeQuestion(questionId);  //选中的题对象
    var repQues = [q];
    var testQuestionTypeId = $("#dvTestQuesType li.selected").attr("id");

    if (q.parentFlag == "1") {  //如果是母题还需返回子题
        $excuteWS("~CmsWS.getSubQuestionListById", { questionId: q.id, qpvSeedId: q.qpvSeedId, usersExtendWrapper: SimpleUser }, function (result) {
            if (result) {
                q.subQuestions = result;
                for (var i = 0; i < result.length; i++) {
                    repQues.push(result[i]);
                }
            } else {
                q.subQuestions = [];
            }

            var qs = _replaceQuestionObj(repId, testQuestionTypeId, repQues);
            replaceQuesContent(qs, replaceRow);
        }, null, null);
    } else {
        var qs = _replaceQuestionObj(repId, testQuestionTypeId, repQues);
        replaceQuesContent(qs, replaceRow);
    }
}

function BT_getQuestionActionMenu(questionW) {
    var strArr = new Array();
    strArr.push('<div class="actionParentMenu" onmouseover="this.style.display=\'\'" onmouseout="this.style.display=\'none\'" style="display:none;padding:3px;width:120px;font-size:11px;background-color:#fff;text-align:left;border:1px solid gray;position:absolute;">');
    strArr.push('<div onclick="BT_excuteActionMenu({val:\'autoSelect\', evt:event}, this)"><img title="自动换题" src="../Images/application_osx_double.png" alt="" /> 自动换题</div>');
    strArr.push('<div onclick="BT_excuteActionMenu({val:\'manualSelect\', evt:event}, this)"><img title="手动换题" src="../CMS/Images/application_edit.png" alt="" /> 手动换题</div>');
    strArr.push('</div>');
    return strArr.join('');
}

function BT_onQuestonActionMenuShow(o, evt, flag) {
    var $actionParentMenu = $(o).parent().find("div.actionParentMenu");
    if (!flag) {
        $actionParentMenu.hide();
    } else {
        if (typeof evt.pageY == "undefined") {
            evt.pageY = evt.y;
        }
        $actionParentMenu.css({ "margin-left": "-10px", "top": (evt.pageY - 10) + "px" });
        //if ($.browser.mozilla) {
        //    $actionParentMenu.css({ "top": (evt.mozMovementY - 90) + "px" });
        //} else {
        //    $actionParentMenu.css({ "top": (evt.y - 10) + "px" });
        //}
        $actionParentMenu.show();
    }
}

function BT_excuteActionMenu(data, o) {
    try {
        if (window.event) {
            data.evt.cancelBubble = true;
        }
        else if (data.evt) {
            data.evt.stopPropagation();
        }
    } catch (e) { }

    var replaceRow = $(o).parent().parent().parent();
    var questionId = replaceRow.attr("id");
    switch (data.val) {
        case "manualSelect":
            manualSelectQuestion(questionId, replaceRow);
            break;
        case "autoSelect":
            autoSelectQuestion(questionId, replaceRow);
            break;
        default:
            break;
    }
}

//自动换题
function autoSelectQuestion(questionId, replaceRow) {
    var testQuestionTypeId = $("#dvTestQuesType li.selected").attr("id");
    var $content = $("#dvQuesBox").showLoading();
    $excuteWS("~CmsWS.getQuestionListByQuestion", { questionId: questionId, testQuestionTypeId: testQuestionTypeId, userExtend: SimpleUser }, function (result) {
        $content.hideLoading();
        if (result && result.length > 0) {
            var q = _replaceQuestionObj(questionId, testQuestionTypeId, result);
            replaceQuesContent(q, replaceRow)
        } else {
            $.jBox.tip('没有可替换的题', 'info');
        }
    }, null, null);
}

//手动选择换题
function manualSelectQuestion(questionId, replaceRow) {
    //缓存被替换的题数据
    var $tbQuesList = $("#tbQuesList");
    $tbQuesList.data("_repId", questionId);
    $tbQuesList.data("_replaceRow", replaceRow);

    var structureIds = [];
    var loIds = [];
    var selectedNodes = $("#bookStructureTree").dynatree("getTree").getSelectedNodes(true);
    for (var i = 0; i < selectedNodes.length; i++) {
        if (selectedNodes[i].parent.data.structureLevel == "10") {
            loIds.push(selectedNodes[i].data.key);
        } else {
            structureIds.push(selectedNodes[i].data.key);
        }
    }

    var quesIds = [];
    for (var i = 0; i < _TestQuestionBank.length; i++) {
        quesIds.push(_TestQuestionBank[i].id);
    }

    var testQuestionTypeId = $("#dvTestQuesType li.selected").attr("id");
    var $content = $("#tdRightBox").showLoading();
    $excuteWS("~CmsWS.getQuestionListByStructureAndLo", { testQuestionTypeId: testQuestionTypeId, structureIds: structureIds, loIds: loIds, questionIds: quesIds, userExtend: SimpleUser }, function (result) {
        $content.hideLoading();
        if (result && result.length > 0) {
            showSelectQuestionBox();
            bindQuestionPagination(result, buildRepQuestionList);
        } else {
            $.jBox.tip('没有可替换的题', 'info');
        }
    }, null, null);
}

//添加题
function onAddQuestion() {
    var structureIds = [];
    var loIds = [];
    var selectedNodes = $("#bookStructureTree").dynatree("getTree").getSelectedNodes(true);
    for (var i = 0; i < selectedNodes.length; i++) {
        if (selectedNodes[i].parent.data.structureLevel == "10") {
            loIds.push(selectedNodes[i].data.key);
        } else {
            structureIds.push(selectedNodes[i].data.key);
        }
    }

    var quesIds = [];
    for (var i = 0; i < _TestQuestionBank.length; i++) {
        quesIds.push(_TestQuestionBank[i].id);
    }

    var testQuestionTypeId = $("#dvTestQuesType li.selected").attr("id");
    var $content = $("#tdRightBox").showLoading();
    $excuteWS("~CmsWS.getQuestionListByStructureAndLo", { testQuestionTypeId: testQuestionTypeId, structureIds: structureIds, loIds: loIds, questionIds: quesIds, userExtend: SimpleUser }, function (result) {
        $content.hideLoading();
        if (result && result.length > 0) {
            showSelectQuestionBox("add");
            bindQuestionPagination(result, buildAddQuestionList);
        } else {
            $.jBox.tip('没有可添加的题', 'info');
        }
    }, null, null);
}

//添加多题
function addQuesListContent(questions) {
    for (var i = 0; i < questions.length; i++) {
        addQuesContent(questions[i]);
    }
}

//返回新题与知识点的关系
function addLoQuesListContent(questions) {
    var questionIds = [];
    for (var i = 0; i < questions.length; i++) {
        questionIds.push(questions[i].id);
    }
    var $content = $("#dvQuesBox").showLoading();
    $excuteWS("~CmsWS.getLoQuestionArray", { questionIds: questionIds, userExtend: SimpleUser }, function (result) {
        $content.hideLoading();
        if (result && result.length > 0) {
            addLoQuestions(result);
        }
        buildLoQuestionsList();
    }, null, null);
}

//保存关系列表数据
function addLoQuestions(loQuestions) {
    if (LoQuestionArray.length == 0) {
        LoQuestionArray = loQuestions;
    } else {
        LoQuestionArray[0].addRange(loQuestions[0]);
        LoQuestionArray[1].addRange(loQuestions[1]);
    }
}

//检查添加的题是否达到模板规定的数量
function checkQuestionNum() {
    var testQuestionTypeId = $("#dvTestQuesType li.selected").attr("id");
    var questionGroup = getQuestionGroup(testQuestionTypeId);
    if (questionGroup) {
        var currNum = questionGroup.questions.length;
        var allowNum = questionGroup.questionNum;
        var $span = $("#dvTestQuesType li.selected span").html(currNum + "/" + allowNum);
        if (currNum == allowNum) {
            $span.removeClass("lackQuesTip");
            $("#btnAddQuestion").attr("disabled", "disabled");
        }
    }
}

function onExpandQuesList(o) {
    var expend = $(o).data("_expend") ? $(o).data("_expend") : false;
    if (!expend) {
        $(o).find("img").attr("src", "../Images/sanjiaoExpend.gif");
        $(o).data("_expend", true);
        $(o).parent().next().show();
    } else {
        $(o).find("img").attr("src", "../Images/sanjiaoNormal.gif");
        $(o).data("_expend", false);
        $(o).parent().next().hide();
    }
}


function saveTestQuestion() {
    var b;

    //检查考试基本信息
    b = checkTestBaseInfo();
    if (!b) return;
    //检查模板信息
    b = checkTestModel();
    if (!b) return;

    assignSubQuestionScore();

    var nRet = checkQuestionBank();
    if (nRet != 0) {
        switch (nRet) {
            case -1:
                $.jBox.tip('请先生成题！', 'warning');
                break;
            case -2:
                $.jBox.tip('题数量不够！', 'warning');
                break;
            case -3:
                $.jBox.tip('子母题分数设置不正确！', 'warning');
                break;
        }
        return;
    }

    //获取考试基本信息
    var testInfo = getTestBaseInfo();
    SimpleUser.bookId = $("#selBookList").find("option:selected").attr("id");
    testInfo.subjectiveFlag = checkTestSubjective();
    $.jBox.tip("正在保存数据，请稍等...", 'loading');
    $excuteWS("~CmsWS.saveTestQuestion", { test: testInfo, questions: _TestQuestionBank, userExtend: SimpleUser }, function (result) {
        if (result) {
            closeBuildTestBox();
            queryTestInfo();
            $.jBox.tip('保存成功！', 'success');
        } else {
            $.jBox.tip('保存失败！', 'error');
        }
    }, null, null);
}

//判断试卷是否有主观题
function checkTestSubjective() {
    var subjectiveFlag = "0";
    var i = -1;
    $.each(_TestQuestionGroups, function () {
        i = TestQuestionTypeArray.indexOf("id", this.testQuestionTypeId);
        if (i != -1) {
            subjectiveFlag = TestQuestionTypeArray[i].subjectiveFlag;
            if (subjectiveFlag == "1") {
                return false;
            }
        }
    });
    return subjectiveFlag;
}