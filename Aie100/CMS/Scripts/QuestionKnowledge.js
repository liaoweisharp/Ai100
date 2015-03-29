var KnowledgePointsDataSvr = null;      //KnowledgePoints数据维护对象
var BookStructureArray = [];
var BookWrapperArray = [];
var QuestionIdArray = [];
var TestListArray = [];
var OldStructureId = "";
var LoQuestionArray = [];
var $dvRelationSetting = null;
var $dataTable = null;
var $cbxAllQuestionSame = null;
var $cbxCustomProbability = null;
var $dvTestList = null;
var TestQueryCondition = {};    //查询条件
var imgLoadingId = "";
var AccLevel = 0;


function PageLoad() {
    InitCmsMenu("m_QuestionKnowledge");
    $(window).resize(function () {
        ResetTreeNavFrameHeight("dvQuestionList", "bookStructureTree", 15);
        setQuestionContentHeight();
    });
    AccLevel = $("#__accessLevel").val();
    $dvRelationSetting = $("#dvRelationSetting");
    $dataTable = $dvRelationSetting.find(".kpr_sel_item");
    $cbxAllQuestionSame = $("#cbxAllQuestionSame");
    $cbxCustomProbability = $("#cbxCustomProbability");
    $("#btnAssociateQuestions").bind("click", onAssociateQuestions);
    $("#btnAssociateTests").bind("click", onAssociateTests);
    $("#btnSearchQuestion").bind("click", onSearchQuestion);
    $("#btnSaveLoQuestion").bind("click", onSaveLoQuestion);
    $("#btnAutoLoQuestion").bind("click", onAutoLoQuestion);
    $("#btnRecommendLo").bind("click", onRecommendLo);
    $("#btnGetUnrelated").click(function () {
        var testId = $(this).data("testId");
        var relatedFlag = $(this).data("relatedFlag");
        if (testId && relatedFlag) {
            getQuestionByTest(testId, relatedFlag);
        }
    });
    $cbxAllQuestionSame.attr("checked", false);
    $cbxCustomProbability.attr("checked", false).bind("change", onCustomProbability).trigger("change");
    bindBookInfo();
    $("#selBookList").change(function () {
        var isbn = $(this).val();
        SimpleUser.isbn = $(this).val();
        var $tbContentbox = $("#tbContentbox");
        if (isbn != "-1") {
            BookStructureArray = [];
            var bookWrapper = findBookObj(isbn);
            bindDiscipline(bookWrapper.disciplineId);
            bindSubject(bookWrapper.disciplineId, bookWrapper.subjectId);

            $tbContentbox.show();
            ResetTreeNavFrameHeight("dvQuestionList", "bookStructureTree", 15);
            setQuestionContentHeight();
            $tbContentbox.colResizable({
                liveDrag: true,
                minWidth: 100
            });

            if ($("#dvPagination").data("_questionId")) {
                loadBookStructureTree();
            }

            AddUserParam("isbn", isbn);
        } else {
            $tbContentbox.hide();
            SetUserParam("isbn", "");
        }
    });

    $(".gotoIndex").empty().keydown(function (e) {
        if (e.which == 13) {
            $(e.target).next().trigger("click");
        }
    });
    
    if (AccLevel > 3) {
        $("#cbxCustomProbability").hide().next().hide();
    }
    if (AccLevel == 3 || AccLevel == 6) {
        $("#btnAutoLoQuestion").hide();
        $("#btnSaveLoQuestion").hide();
    }    
}

//加载树
function loadBookStructureTree() {
    if (BookStructureArray && BookStructureArray.length > 0) {
        buildBookStructureTree(BookStructureArray)
    } else {
        var isbn = $("#selBookList").find("option:selected").val();
        $("#bookStructureTree").empty().html("<img src='../Images/ajax-loader_b.gif' style='margin-left:38%; margin-top:5%;' />");
        $excuteWS("~CmsWS.getBookStructureArray", { isbn: isbn, isLazy: true }, buildBookStructureTree, null, null);
    }
}

function buildBookStructureTree(bsData) {
    ///<summary>构造BookStructure树</summary>
    BookStructureArray = bsData;
    var bsTreeNodes = bsData[0];
    if (!bsTreeNodes) {
        return;
    }

    KnowledgePointsDataSvr = new KnowledgePointsData();
    var isbn = $("#selBookList").find("option:selected").val();

    var $tree = $("#bookStructureTree").dynatree({
        title: "Book Structure Tree",
        clickFolderMode: 1,
        children: bsTreeNodes,
        cookieId: "bookStructureTree",
        onLazyRead: function (node) {
            var structureId = node.data.key;
            SimpleUser.isbn = isbn;
            $excuteWS("~CmsWS.getLearningObjectiveWithStructureList", { structureId: structureId, isbn: isbn, exCurriculumId: "", userExtend: SimpleUser }, onGetLearningObjective, null, node);
        },
        onClick: function (node, event) {
            if (event.target.className != "dynatree-expander") {
                if (node.data.key != OldStructureId) {
                    OldStructureId = node.data.key;
                    if (node.parent.data.structureLevel == "10") {
                        addLoQuestion(node);
                    }
                }
            }
        },
        onDblClick: function (node, event) {
            node.toggleExpand();
        },
        onCreate: function (node, span) {
        }
    });

    if (window.isReloadTree) {
        $tree.dynatree("getTree").reload();
    } else {
        window.isReloadTree = true;
    }
}

function onGetLearningObjective(result, node) {
    if (result != null && result.length > 0) {
        KnowledgePointsDataSvr.AppendStructure(node.data.key, result);
        var kpNodes = new Array();
        var kpNode = null;
        $.each(result, function () {
            kpNode = {};
            kpNode.title = this.unit + " " + this.name;
            kpNode.key = this.id;
            kpNode.unit = this.unit;
            kpNode.step = this.step;
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

//设置题显示高度
function setQuestionContentHeight() {
    var h = $("#dvQuestionList").height() - $("#dvQuestionListTitle").height() - $("#pagination").height() - 60;
    $("#dvQuestionContent").height(h);
    $dvRelationSetting.height($("#bookStructureTree").height() - 20);
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

//显示书列表
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

var pageSize = 1;
function bindQuestionPagination(questionIdArray) {
    if (questionIdArray.length > 0) {
        showQuestionListDiv(true);
        QuestionIdArray = questionIdArray;
        $("div.pagination").html("").pagination(questionIdArray.length, {
            num_edge_entries: 2,
            num_display_entries: 5,
            items_per_page: pageSize,
            prev_text: "上一题",
            next_text: "下一题",
            callback: function (page_index, o) {
                $("#dvQuestionList").showLoading();
                o.data("page_index", page_index);
                var _startPos = page_index * pageSize;
                var _endPos = _startPos + (pageSize - 1);
                var questionIds = getIdsArray(questionIdArray, _startPos, _endPos);
                o.data("_questionId", questionIds[0]);
                $excuteWS("~CmsWS.getQuestionAndAnwser", { questionIds: questionIds, usersExtendWrapper: SimpleUser }, showQuestionContent, null, null);
            }
        });
    } else {
        showQuestionListDiv(false);
    }
}

//显示或隐藏题显示界面
function showQuestionListDiv(b) {
    if (b == true) {
        $("#dvPagination").show();
        $("div.dvGotoPage").show();
        $("#dvQuestionBody").html("");
    } else {
        $("#dvPagination").hide();
        $("div.dvGotoPage").hide();
        $("#dvQuestionContent>div").html("");
        $("#dvQuestionBody").html("<span style='color:#6f6f6f'>没有可用的题</span>").show();
    }
    

}

//根据索引，从数据中返回部分数据
function getIdsArray(idArray, startpos, endpos) {
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


function showQuestionContent(questionObjArray) {
    $("#dvQuestionList").hideLoading();

    var questionWrappers = questionObjArray[0];
    var referenceAnswer = questionObjArray[1];
    var masterQuestionWrapper = null;
    var questionWrapper = null;

    LoQuestionArray = (questionObjArray[2]) ? sortByStep(questionObjArray[2]) : [];
    if (!questionWrappers) {
        return;
    }

    if (questionWrappers.length > 1) {  //子母题
        for (var i = 0; i < questionWrappers.length; i++) {
            if (questionWrappers[i].parentFlag =="1") {
                masterQuestionWrapper = questionWrappers[i];
            } else {
                questionWrapper = questionWrappers[i];
            }
        }
    } else {
        questionWrapper = questionWrappers[0];
    }


    if (AccLevel == 2 || AccLevel == 5) {   //操作权限
        if (questionWrapper.userId == SimpleUser.userId) {
            $("#btnAutoLoQuestion").show();
            $("#btnSaveLoQuestion").show();
        } else {
            $("#btnAutoLoQuestion").hide();
            $("#btnSaveLoQuestion").hide();
        }
    }

    //显示题
    questionWrapper.orderName = questionWrapper.number;
    var question = new Question({ data: { question: questionWrapper, answers: referenceAnswer } });
    if (masterQuestionWrapper) {
        $("#dvMasterQuestion").html(masterQuestionWrapper.content).show();
    } else {
        $("#dvMasterQuestion").html("").hide();
    }
    $("#dvQuestionBody").html(question.getBody());
    $("#dvReferenceAnswer").html(question.getAnswerCView());
    $("#dvSolution").html(question.getSolution());
    $("#dvTip").html(question.getTip());

    var b = $.inArray(questionWrapper.questionTypeId, ["1", "2", "3"]);
    if (b != -1) {
        $("#dvAnswerTitle").hide();
        $("#dvSolutionTitle").show();
    } else {
        $("#dvAnswerTitle").show();
        $("#dvSolutionTitle").show();
    }

    //显示题与知识点的关系
    showLoQuestionRow();
}

function bindTestList(testListArray, dataTable) {
    var tId = $("input[name='rdAssociateTests']:checked").attr("id");
    var relatedFlag = "";
    if ($.inArray(tId, ["mtUnassociated", "atUnassociated"]) == -1) {
        relatedFlag = "related";
    } else {
        relatedFlag = "unrelated";
    }

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
            rows.push("<tr " + rowClass + "><td>" + testListArray[i].title + "</td><td style='width:100px; text-align:center'><a href='javascript:void(0)' onclick='getQuestionByTest(\"" + testListArray[i].id + "\", \"" + relatedFlag + "\")'>选择</a></td></tr>");
        }
        dataTable.append(rows.join(""));
    } else {
        TestListArray = [];
        dataTable.append("<tr class='lightblue'><td align='center'>无数据</td></tr>");
    }
}

function initTestListBox() {
    var sBuilder = new Array()
    sBuilder.push("<div style='border: 1px solid #b2b1b1; width:557px; height:280px; overflow:auto; margin:10px;'>");
    sBuilder.push("    <table id='tbTestList' class='cms_datatable'>");
    sBuilder.push("    <tr><td colspan='2' align='center' style='height:220px'><img src='Images/ajax-loader_b.gif'></td></tr>");
    sBuilder.push("    </table>");
    sBuilder.push("</div>");
    return sBuilder.join("");
}

function getQuestionByTest(testId, relatedFlag) {
    //设置考试名称
    var test = getObjById(testId, TestListArray);   
    var title = test ? test.title : "";
    $("#dvQuestionListTitle").html(title).show();
    $("#dvQuestionTool").show();

    var $dvQuestionList = $("#dvQuestionList").showLoading();
    if (relatedFlag == "unrelated") {
        $("#btnGetUnrelated").data({ "testId": testId, "relatedFlag": relatedFlag }).show();
        $excuteWS("~CmsWS.getQuestionByNoKpForTestId", { testId: testId, userExtend: SimpleUser }, function (result) {
            $dvQuestionList.hideLoading();
            var questionIds = (result && result.length > 0) ? result : [];
            bindQuestionPagination(questionIds);
        }, null, null);
    } else {
        $("#btnGetUnrelated").hide();
        $excuteWS("~CmsWS.getQuestionForyTest", { testId: testId, userExtend: SimpleUser }, function (result) {
            $dvQuestionList.hideLoading();
            var questionIds = (result && result.length > 0) ? result : [];
            bindQuestionPagination(questionIds);
        }, null, null);
    }

    $.jBox.close("jb_tls");

    //加载树
    loadBookStructureTree();
    //显示关系设置界面
    $cbxAllQuestionSame.removeAttr("disabled").parent().show();
    $cbxAllQuestionSame.next().css("color", "#000");
    $dvRelationSetting.show();
}

//根据id返回查找对象
function getObjById(id, objArr) {
    var i = objArr.indexOf("id", id);
    if (i != -1) {
        return objArr[i];
    }
    return null;
}

function addLoQuestion(node) {
    if (!$("#dvPagination").data("_questionId")) {
        $.jBox.tip('请先选择题', 'info');
        return;
    }
    
    var loQuestion = {};
    var x = LoQuestionArray.indexOf("loId", node.data.key);
    if (x == -1) {
        loQuestion.loId = node.data.key;
        loQuestion.loUnit = node.data.unit;
        loQuestion.loName = node.data.title.replace(node.data.unit + " ", "");
        loQuestion.loStep = node.data.step;
        loQuestion.loType = "";
        loQuestion.probability = "";
        LoQuestionArray.push(loQuestion);
        addLoQuestionRow(loQuestion);
    }
}

function addLoQuestionRow(obj) {
    var customColSty = !$cbxCustomProbability.attr("checked") ? "display:none;" : "";
    var rowCount = $dataTable.find("tr:gt(0)").length;
    if (rowCount == 1) {
        var $fRow = $dataTable.find("tr:eq(1)");
        if ($fRow.hasClass("nodata")) {
            $fRow.remove();
            rowCount--;
        }
    }
    rowCount++;
    var rowClass = "class='lightblue'";
    if (rowCount % 2 != 0) {
        rowClass = "class='lightblue'";
    }

    var checked = (obj.loType == "0") ? "checked='checked'" : "";

    var sBuilder = [];
    sBuilder.push("<tr id='" + obj.loId + "' step='" + obj.loStep + "' " + rowClass + ">");
    sBuilder.push("    <td>" + obj.loUnit + "</td>");
    sBuilder.push("    <td><span style='color:#1a5fbf; cursor:pointer' onclick='viewKpInfo(\"" + obj.loId + "\", event)'>" + obj.loName + "</span></td>");
    sBuilder.push("    <td class='custom_col' style='" + customColSty + "'><input style='width: 25px; height: 10px; font-size: 10px;' type='text' value='" + obj.probability + "'></td>");
    sBuilder.push("    <td class='custom_col' style='" + customColSty + "text-align: center'><input type='checkbox' " + checked + "></td>");
    sBuilder.push("    <td class='custom_col' style='" + customColSty + "'>" + buildCognitiveSelect(obj.cognitiveType) + "</td>");
    sBuilder.push("    <td style='text-align: center'><img title='删除' style='cursor: pointer;' onclick='deleteLoQuestionRow(\"" + obj.loId + "\", this)' alt='删除' src='../CMS/Images/application_delete.png'></td>");
    sBuilder.push("</tr>");
    //添加一条关系(根据loStep决定题与知识点的关系在列表中的位置)
    addLoQuestionByStep(obj.loStep, sBuilder.join(""));
}

//认知类型
var EnumCognitiveType = { "1": "1 记忆", "2": "2 理解", "3": "3 应用", "4": "4 分析", "5": "5 评价", "6": "6 创造" };
//生成认知选择项
function buildCognitiveSelect(cognitiveType) {
    var selflg = "";
    var sp = [];

    sp.push("<select>");
    sp.push("<option value='-1'>选择认知</option>");
    for (var k in EnumCognitiveType) {
        if (cognitiveType == k) {
            selflg = "selected='selected'";
        } else {
            selflg = "";
        }
        sp.push("<option value='" + k + "' " + selflg + ">" + EnumCognitiveType[k] + "</option>");
    }
    sp.push("<select>");
    return sp.join("");
}

//删除关系
function deleteLoQuestionRow(id, o) {
    $(o).parent().parent().remove();
    var x = LoQuestionArray.indexOf("loId", id);
    if (x != -1) {
        LoQuestionArray.splice(x, 1);
    }
    if (LoQuestionArray.length == 0) {
        $dataTable.append("<tr class='nodata lightblue'><td colspan='6' align='center'>无相关知识点</td></tr>");
    }
}

//显示题与知识点的关系
function showLoQuestionRow() {
    $dataTable.find("tr:gt(0)").remove();
    if (LoQuestionArray.length == 0) {
        $dataTable.append("<tr class='nodata lightblue'><td colspan='6' align='center'>无相关知识点</td></tr>");
    } else {
        for (var i = 0; i < LoQuestionArray.length; i++) {
            addLoQuestionRow(LoQuestionArray[i]);
        }
    }
}

//保存题与知识点的关系
function onSaveLoQuestion() {
    if (!$dvRelationSetting.is(":visible")) {
        $.jBox.tip('没有数据需要保存！', 'warning');
        return;
    }

    if ($cbxCustomProbability.is(":checked")) {
        saveLoQuestions_custom();
    } else {
        saveLoQuestions();
    }
}

//保存题与知识点的关系
function saveLoQuestions() {
    var loQuestionArray = [];
    if ($dataTable.find("tr:gt(0)").length == 1 && $dataTable.find("tr:eq(1)").hasClass("nodata")) {
        loQuestionArray = [];
    } else {
        loQuestionArray = $dataTable.find("tr:gt(0)").map(function () {
            var loQuestion = {};
            loQuestion.loId = this.id;
            return loQuestion;
        }).get();
    }

    //计算并分配权重
    var len = loQuestionArray.length
    if (len > 0) {
        allocationProbability(calcProbability(len), loQuestionArray);
    }

    var questionIds = [];
    if (!$cbxAllQuestionSame.is(":disabled") && $cbxAllQuestionSame.is(":checked")) {
        questionIds = QuestionIdArray;
    } else {
        var questionId = $("#dvPagination").data("_questionId");
        questionIds = [questionId];
    }

    $excuteWS("~CmsWS.manageLoQuestion", { questionIds: questionIds, loQuestions: loQuestionArray, usersExtendWrapper: SimpleUser }, function (result) {
        if (result) {
            $.jBox.tip('保存成功.', 'success');
            OldStructureId = "";
            if (!$cbxAllQuestionSame.is(":checked")) {
                //$("#dvPagination").trigger('nextPage');
                $("#dvPagination a.next").trigger("click");
            }
        } else {
            $.jBox.tip('保存知识点失败.', 'error');
        }
    }, function (error) {
        to = eval('(' + error.responseText + ')');
        $.jBox.prompt(to.Message, "提示", "warning");
    }, null);
}

//保存题与知识点的关系(自定义权重)
function saveLoQuestions_custom() {
    if (!validProbability()) {
        $.jBox.tip('权重输入错误！', 'warning');
        return;
    }

    var loQuestionArray = [];
    if ($dataTable.find("tr:gt(0)").length == 1 && $dataTable.find("tr:eq(1)").hasClass("nodata")) {
        loQuestionArray = [];
    } else {
        loQuestionArray = $dataTable.find("tr:gt(0)").map(function () {
            var loQuestion = {};
            loQuestion.loId = this.id;
            loQuestion.probability = $(this).find("td input[type='text']").val();
            var b = $(this).find("td input[type='checkbox']").is(":checked");
            loQuestion.loType = (b) ? "0" : "1";
            loQuestion.cognitiveType = $(this).find("td select").val();
            return loQuestion;
        }).get();
    }

    var questionIds = [];
    if (!$cbxAllQuestionSame.is(":disabled") && $cbxAllQuestionSame.is(":checked")) {
        questionIds = QuestionIdArray;
    } else {
        var questionId = $("#dvPagination").data("_questionId");
        questionIds = [questionId];
    }

    $excuteWS("~CmsWS.manageLoQuestion", { questionIds: questionIds, loQuestions: loQuestionArray, usersExtendWrapper: SimpleUser }, function (result) {
        if (result) {
            $.jBox.tip('保存成功.', 'success');
            OldStructureId = "";
            if (!$cbxAllQuestionSame.is(":checked")) {
                //$("#dvPagination").trigger('nextPage');
                $("#dvPagination a.next").trigger("click");
            }
        } else {
            $.jBox.tip('保存知识点失败.', 'error');
        }
    }, function (error) {
        to = eval('(' + error.responseText + ')');
        $.jBox.prompt(to.Message, "提示", "warning");
    }, null);
}

//检查权重输入是否正确
function validProbability() {
    var validProbability = false;
    var rows = $dataTable.find("tr:gt(0)").length;

    if (rows == 0) {    //等于空视为正确
        validProbability = true;
    } else if (rows == 1 && $dataTable.find("tr:eq(1)").hasClass("nodata")) { //等于空视为正确
        validProbability = true;
    } else {   //有记录是的判断
        var $probability = null;
        var sprobability = "";
        var probability = 0;
        var probabilitySum = 0;

        validProbability = true;
        $dataTable.find("tr:gt(0)").each(function (i) {
            $probability = $(this).find("input[type='text']");
            sprobability = $probability.val() ? $probability.val() : "0";
            if (!isNaN(sprobability)) {
                probability = parseFloat(sprobability);
                if (probability > 0 && probability <= 1) {
                    //probabilitySum += probability;
                    probabilitySum = add(probabilitySum, probability);
                } else {
                    validProbability = false;
                    return false;
                }
            } else {
                validProbability = false;
                return false;
            }
        });

        //在输入无误的情况下判断权重是否为1
        if (validProbability) {
            validProbability = (probabilitySum == 1) ? true : false;
        }
    }

    return validProbability;
}

//分配权重
function allocationProbability(ave, loQuestionArray) {
    if (ave.length == 1) {
        for (var i = 0; i < loQuestionArray.length; i++) {
            loQuestionArray[i].probability = ave[0];
            loQuestionArray[i].loType = "1";
        }
    } else {
        loQuestionArray[0].probability = ave[0];
        for (var i = 1; i < loQuestionArray.length; i++) {
            loQuestionArray[i].probability = ave[1];
            loQuestionArray[i].loType = "1";
        }
    }
    loQuestionArray[0].loType = "0";
}

//计算平均数
function averageEx(n) {
    var ave = decimalPlaces(1 / n, 2);
    var surplus = add(1, accMul(-ave, n - 1));
    return [surplus, ave]
}

//计算权重
function calcProbability(n) {
    if (testDivisible(1, n)) {
        return [1 / n];
    } else {
        return averageEx(n);
    }
}

//添加题与知识点的关系
function addLoQuestionByStep(step, content) {
    var fstep, pstep, ts, index = -1;

    try { fstep = parseFloat(step); } catch (e) { fstep = 0; }
    stepsSort = $dataTable.find("tr:gt(0)").map(function () {
        try { ts = parseFloat($(this).attr("step")) } catch (e) { ts = 0 }
        return ts;
    }).get();

    for (var i = 0; i < stepsSort.length; i++) {
        if (fstep > stepsSort[i]) {
            index = i;
            break;
        }
    }
    
    if (index == -1) {
        $dataTable.append(content);
    } else {
        pstep = stepsSort[index];
        $dataTable.find("tr[step='" + pstep + "']").before(content);
    }
}

//根据setp排序
function sortByStep(objArr) {
    return objArr;  //元数据已经排过序了
}

//题与知识点的关系
function onAssociateQuestions() {
    if ($("#selBookList").val() == "-1") {
        $.jBox.tip('请选择书', 'info');
        return;
    }

    var arr = [];
    arr.push("<div id='dv' style='padding:20px 50px'>");
    arr.push("    <ul style='float: left; list-style-type:none; width:130px'>");
    arr.push("        <li style='height:25px'>我的题：</li>");
    arr.push("        <li style='height:25px'><input type='radio' name='rdAssociateQuestions' id='mqUnassociated' />&nbsp;<label for='mqUnassociated'>未关联</label></li>");
    arr.push("        <li style='height:25px'><input type='radio' name='rdAssociateQuestions' id='mqAssociated' />&nbsp;<label for='mqAssociated'>已关联</label></li>");
    arr.push("    </ul>");
    arr.push("    <ul style='float: left; list-style-type:none; width:130px'>");
    arr.push("        <li style='height:25px'>全部题：</li>");
    arr.push("        <li style='height:25px'><input type='radio' name='rdAssociateQuestions' id='aqUnassociated' />&nbsp;<label for='aqUnassociated'>未关联</label></li>");
    arr.push("        <li style='height:25px'><input type='radio' name='rdAssociateQuestions' id='aqAssociated' />&nbsp;<label for='aqAssociated'>已关联</label></li>");
    arr.push("    </ul>");
    arr.push("</div>");
    $.jBox(arr.join(""), {
        title: "题与知识点的关系", width: 360, height: 185, top: "25%", buttons: { "确定": true }, submit: function (v, h, f) {
            if (v == true) {
                id = h.find("input[name='rdAssociateQuestions']:checked").attr("id");
                getLoQuestions(id);
            }
        }
    });
    $("#btnGetUnrelated").hide();
}

//考试题与知识点的关系
function onAssociateTests() {
    if ($("#selBookList").val() == "-1") {
        $.jBox.tip('请选择书', 'info');
        return;
    }

    var arr = [];
    arr.push("<table style='margin-left:10px'>");
    arr.push("    <tr>");
    arr.push("        <td colspan='2'>");
    arr.push("            <span style='height:25px;'>考试名称：</span>&nbsp;&nbsp;");
    arr.push("            <input type='text' id='txtTestName' style='width:305px;' />&nbsp;&nbsp;");
    arr.push("        </td>");
    arr.push("    </tr>");
    arr.push("    <tr>");
    arr.push("        <td>");
    arr.push("            <span style='height:25px'>我的考试：</span>&nbsp;&nbsp;");
    arr.push("            <input type='radio' name='rdAssociateTests' id='mtUnassociated' />&nbsp;<label for='mtUnassociated'>未关联</label>&nbsp;");
    arr.push("            <input type='radio' name='rdAssociateTests' id='mtAssociated' />&nbsp;<label for='mtAssociated'>已关联</label>");
    arr.push("        </td>");
    arr.push("        <td style='padding-left:55px'>");
    arr.push("            <span style='height:25px'>全部考试：</span>&nbsp;&nbsp;");
    arr.push("            <input type='radio' name='rdAssociateTests' id='atUnassociated' />&nbsp;<label for='atUnassociated'>未关联</label>&nbsp;");
    arr.push("            <input type='radio' name='rdAssociateTests' id='atAssociated' />&nbsp;<label for='atAssociated'>已关联</label>");
    arr.push("        </td>");
    arr.push("    </tr>");
    arr.push("</table>");
    arr.push("<div id='dvTestList' style='border: 1px solid #b2b1b1; width:596px; height:280px; overflow:auto; margin:10px;'>");
    arr.push("    <table id='tbTestList' class='cms_datatable'>");
    arr.push("    <tr><td colspan='2' align='center' style='height:220px'>&nbsp;</td></tr>");
    arr.push("    </table>");
    arr.push("</div>");
    arr.push("<div id='dvTestPagination' class='testPagination' style='margin:0px 10px 6px; text-align: center; '></div>");
    var $jb = $.jBox(arr.join(""), {
        id: "jb_tls", title: "考试题与知识点的关系", width: 620, top: "25%", buttons: { "关闭": true }, closed: function () {
            if ($dvTestList) {
                $dvTestList.hideLoading();
            }
        }
    });
    $jb.find("input[name='rdAssociateTests']").click(function () {
        getLoTests(this.id, $jb);
    });

    //显示上次的查询情况
    if ($("#btnAssociateTests").data("_testName")) {
        $jb.find("#txtTestName").val($("#btnAssociateTests").data("_testName"));
    }
    if ($("#btnAssociateTests").data("_id")) {
        $jb.find("#" + $("#btnAssociateTests").data("_id")).trigger("click");
    }
}

//返回题与知识点的关系
function getLoQuestions(id) {
    var bookId = $("#selBookList").find("option:selected").attr("id");
    var $dvQuestionList = $("#dvQuestionList").showLoading();
    $("#dvQuestionTool").show();
    switch (id) {
        case "mqUnassociated":
            $("#dvQuestionListTitle").html("我的未关联的题").show();
            $excuteWS("~CmsWS.getQuestionByNoKpForUserId", { userId: SimpleUser.userId, bookId: bookId, userExtend: SimpleUser }, function (result) {
                $dvQuestionList.hideLoading();
                var questionIds = (result && result.length > 0) ? result : [];
                bindQuestionPagination(questionIds);
            }, null, null);
            break;
        case "mqAssociated":
            $("#dvQuestionListTitle").html("我的已关联知识点的题").show();
            $excuteWS("~CmsWS.getQuestionByKpForUserId", { userId: SimpleUser.userId, bookId: bookId, userExtend: SimpleUser }, function (result) {
                $dvQuestionList.hideLoading();
                var questionIds = (result && result.length > 0) ? result : [];
                bindQuestionPagination(questionIds);
            }, null, null);
            break;
        case "aqUnassociated":
            $("#dvQuestionListTitle").html("所有未关联知识点的题").show();
            $excuteWS("~CmsWS.getQuestionByNoKpForBookId", { bookId: bookId, userExtend: SimpleUser }, function (result) {
                $dvQuestionList.hideLoading();
                var questionIds = (result && result.length > 0) ? result : [];
                bindQuestionPagination(questionIds);
            }, null, null);
            break;
        case "aqAssociated":
            $("#dvQuestionListTitle").html("所有已关联知识点的题").show();
            $excuteWS("~CmsWS.getQuestionByKpForBookId", { bookId: bookId, userExtend: SimpleUser }, function (result) {
                $dvQuestionList.hideLoading();
                var questionIds = (result && result.length > 0) ? result : [];
                bindQuestionPagination(questionIds);
            }, null, null);
            break;
        default:
            $dvQuestionList.hideLoading();
            break;
    }

    if (id) {   //判断用户是否选择了查询选项
        //加载树
        loadBookStructureTree();
        //显示关系设置界面
        $cbxAllQuestionSame.attr("checked", false).attr("disabled", "disabled").parent().show();
        $cbxAllQuestionSame.next().css("color", "#7D7D7D");
        $dvRelationSetting.show();
    }
}

//返回考试与知识点的关系
function getLoTests(id, container) {
    var bookId = $("#selBookList").find("option:selected").attr("id");
    var title = container.find("#txtTestName").val();
    var $tbTestList = container.find("#tbTestList");

    //保存查询条件，使下次打开查询窗口可以显示默认的查询
    $("#btnAssociateTests").data("_testName", title);
    $("#btnAssociateTests").data("_id", id);

    $dvTestList = container.find("#dvTestList").hideLoading().showLoading();
    switch (id) {
        case "mtUnassociated":
            $excuteWS("~CmsWS.getTestIdsByNoKpForUserId", { userId: SimpleUser.userId, bookId: bookId, title: title, importFlag: "1", userExtend: SimpleUser }, function (result) {
                $dvTestList.hideLoading();
                var testIds = (result && result.length > 0) ? result : [];
                bindTestsPagination(testIds, $tbTestList);
            }, null, null);
            break;
        case "mtAssociated":
            $excuteWS("~CmsWS.getTestIdsByKpForUserId", { userId: SimpleUser.userId, bookId: bookId, title: title, importFlag: "1", userExtend: SimpleUser }, function (result) {
                $dvTestList.hideLoading();
                var testIds = (result && result.length > 0) ? result : [];
                bindTestsPagination(testIds, $tbTestList);
            }, null, null);
            break;
        case "atUnassociated":
            $excuteWS("~CmsWS.getTestIdsByNoKpForBookId", { bookId: bookId, title: title, importFlag: "1", userExtend: SimpleUser }, function (result) {
                $dvTestList.hideLoading();
                var testIds = (result && result.length > 0) ? result : [];
                bindTestsPagination(testIds, $tbTestList);
            }, null, null);
            break;
        case "atAssociated":
            $excuteWS("~CmsWS.getTestIdsByKpForBookId", { bookId: bookId, title: title, importFlag: "1", userExtend: SimpleUser }, function (result) {
                $dvTestList.hideLoading();
                var testIds = (result && result.length > 0) ? result : [];
                bindTestsPagination(testIds, $tbTestList);
            }, null, null);
            break;
    }
    
}

var tpageSize = 10;
function bindTestsPagination(testIdArray, tbTestList) {
    $("div.testPagination").html("").pagination(testIdArray.length, {
        num_edge_entries: 2,
        num_display_entries: 5,
        items_per_page: tpageSize,
        prev_text: "上一页",
        next_text: "下一页",
        callback: function (page_index, o) {
            tbTestList.parent().showLoading();
            var _startPos = page_index * tpageSize;
            var _endPos = _startPos + (tpageSize - 1);
            var testIds = getIdsArray(testIdArray, _startPos, _endPos);
            $excuteWS("~CmsWS.getTestListForTestIds", { testIds: testIds, userExtend: SimpleUser }, function (result) {
                tbTestList.parent().hideLoading();
                bindTestList(result, tbTestList);
            }, null, null);
        }
    });
}

//推荐知识点
function onRecommendLo() {
    var questionId = $("#dvPagination").data("_questionId");
    if (!questionId) {
        $.jBox.tip('请先选择题', 'info');
        return;
    }
    var isbn = $("#selBookList").find("option:selected").val();
    var structureId = "";
    var tree = $("#bookStructureTree").dynatree("getTree");
    var node = tree.getActiveNode();
    if (!node) {
        structureId = tree.getRoot().childList[0].data.key;
    } else {
        if (node.parent.data.structureLevel == "10") {
            structureId = node.parent.data.key;
        } else {
            structureId = node.data.key;
        }
    }
    
    var $content = $("#dvRelationSetting").showLoading();
    $excuteWS("~CmsWS.getLearningObjectiveAutoCompatibility", { questionId: questionId, structureId: structureId, isbn: isbn, userExtend: SimpleUser }, function (result) {
        $content.hideLoading();
        if (result && result.length > 0) {
            addRecommendLo(result);
        } else {
            $.jBox.tip('没有推荐的知识点', 'info');
        }
    }, null, null);
}

//添加推荐知识点
function addRecommendLo(los) {
    var loQuestion = {};
    var n = -1;
    var $tb = $("#dvRelationSetting .kpr_sel_item");

    for (var i = 0; i < los.length; i++) {
        n = LoQuestionArray.indexOf("loId", los[i].id);
        if (n == -1) {
            loQuestion = {};
            loQuestion.loId = los[i].id;
            loQuestion.loUnit = los[i].unit;
            loQuestion.loName = los[i].name;
            loQuestion.loStep = los[i].step;
            loQuestion.loType = "";
            loQuestion.probability = "";
            LoQuestionArray.push(loQuestion);
            addLoQuestionRow(loQuestion);
        }
        $tb.find("tr[id='" + los[i].id + "']").css({ "background-color": "#E2F6CF", "border": "1px solid #DDDDDD" });
    }
}

//智能关联知识点
function onAutoLoQuestion() {
    if (QuestionIdArray.length == 0) {
        $.jBox.tip('没有需要保存的题', 'info');
        return;
    }
    var isbn = $("#selBookList").find("option:selected").val();
    var structureId = "";
    var tree = $("#bookStructureTree").dynatree("getTree");
    var node = tree.getActiveNode();
    if (!node) {
        structureId = tree.getRoot().childList[0].data.key;
    } else {
        if (node.parent.data.structureLevel == "10") {
            structureId = node.parent.data.key;
        } else {
            structureId = node.data.key;
        }
    }

    
    var questionIds = [];
    if (!$cbxAllQuestionSame.is(":disabled") && $cbxAllQuestionSame.is(":checked")) {
        questionIds = QuestionIdArray;
    } else {
        var questionId = $("#dvPagination").data("_questionId");
        questionIds = [questionId];
    }
    
    var $content = $("#dvCmsMain").showLoading();
    $excuteWS("~CmsWS.manageBsQuestion", { questionIds: questionIds, structureId: structureId, isbn: isbn, userExtend: SimpleUser }, function (result) {
        $content.hideLoading();
        if (result) {
            var $dvPagination = $("#dvPagination");
            var page_index = $dvPagination.data("page_index");
            if (page_index) {
                $("#dvPagination").trigger('setPage', [page_index]);
            }
        }
    }, function (error) {
        $content.hideLoading();
        $.jBox.prompt("正在执行操作，请稍后查看执行结果，你现在可以进行其他工作了。", "提示", "info");
    }, null);
}

function onCustomProbability() {
    if (this.checked) {
        $dataTable.find("tr .custom_col").show();
    } else {
        $dataTable.find("tr .custom_col").hide();
    }
}


function viewKpInfo(id, event) {
    ///<summary>查看kp信息</summary>

    e = event ? event : window.event;
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }

    window.simpleUser = SimpleUser;
    new ShowDetails({ data: { itemId: id }, show_type: "1", type: "0" }).show();
}


function gotoPage(o) {
    var n = $(o).prev().val();
    if (!n){
        return;
    } else if (isNaN(n)) {
        $.jBox.tip('页码输入错误！', 'warning');
        return;
    }
    var p = parseInt(n) - 1;
    $("div.pagination").trigger('setPage', [p]);
    $(o).prev().val("");
}

function onSearchQuestion() {
    if ($("#selBookList").val() == "-1") {
        $.jBox.tip('请选择书', 'info');
        return;
    }

    (new QuestionSearch({
        data: {
            isbn: $("#selBookList").val(),
            bookId: $("#selBookList").find("option:selected").attr("id"),
            simpleUser: SimpleUser
        },
        showMode: 1,
        callback: function (questionIds) {
            $("#dvQuestionListTitle").html("搜索的题").show();
            bindQuestionPagination(questionIds);
        }
    })).Show();
}