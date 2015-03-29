/// <reference path="../Common.js?ver=Acepherics1105" />
/// <reference path="../../Scripts/CommFunction/Array.js" />
/// <reference path="../../Scripts/JQuery/jquery-1.4.1-vsdoc.js" />
/// <reference path="../../Scripts/JQuery/jquery.ajax.js" />
var BookList = [];
var qPrefix = "ContentPlaceHolder_";
var simpleUser = null;
var imgLoadingId = qPrefix + "QuestionManage1_imgDataLoading"; //loading图片的ID
var treeResult = null; //记录第一次用于生产树形菜单的结果
var sLoArray = []; //记录所选择的知识点
var questionId = null; //记录当前创建或编辑的question的Id
var editQuestionId = null;
var bookId = null; //记录bookId
var timeFormat = "MM/dd/yyyy HH:mm:ss";
var QM_parentQuestionId = null; 
var questionWrapperArray = []; //用于最终提交的Question
var loQuestionWrapperArray = []; //用于最终提交的Question Lo
var referenceAnswerWrapperArray = []; //用于最终提交的Reference Answer
var questionAlgorithmWrapperArray = []; //用于最终提交的活动题内容
var emath_editor_bookId = null;
var isQuestionManagePage = true;
var AccLevel = 0;

//点击树形菜单
var _structureId = null;
var _structureId2 = null;
var sourceStructureId = null;
var lastStructureId = null;
var $divQuestionManage1;
var $imgLoadingId;
var $ddlAnswerType;
var $ddlQuestionType;
var questionManageFlag = true;
var jq_simpleUser = {};
$(function () {
    var args = getUrlParms();
    AddUserParam("isbn", args["isbn"]);
    InitCmsMenu("m_QuestionManage");
    AccLevel = $("#__accessLevel").val();
    if (typeof _loadFlag != "undefined" && _loadFlag) {
        return;
    }
    bindSimpleUser()
    if ($get("ddlActions").value != "-1") {
        $get("ddlActions").value = "-1";
    }
    if (editor == null) {
        editor = new emath_editor();
        editor.show_mode = "latex";
        editor.edit_height = "150px";
    }
    $(".gotoIndex").val("");
    //$("img[enableDDL=1]", "#divStep1")
    //    editor_bindUploadify();

    $("#ddlQuestionType").change(function () {
        $("#ddlAnswerType").val($(this).find("option:selected").attr("answertype"));
        $("#ddlDifficult").val($(this).find("option:selected").attr("difficulty"));
    });

    $("#btnViewMyQuestions").click(function () {//(String userId, String bookId, UsersExtendWrapper usersExtendWrapper)
       
        $excuteWS("~CmsWS.getQuestionForUserId", { userId: jq_simpleUser.userId, bookId: $("#ddlBookList").find("option:selected").attr("id"), usersExtendWrapper: jq_simpleUser }, function (r) {
            if (r == null) { r = [];}
            $("div.pagination").show();
            $("div.dvGotoPage").show();
            $(".pagination_ddl").show();
            var questionIdArray = window.tempQuestionIdArray = r;
            bindDDLPageSize();
            bindKnowledgeGuidePagination(questionIdArray);
        }, null, null);
    });
    
    if (AccLevel > 3) {
        $("#trIsAlgorithm").hide().next().hide();
    }
    if (AccLevel == 3 || AccLevel == 6) {
        $("#btnCreateQuestion").hide();
    }
});

function onTreeNodeClick(tid, treeContaner) {
    $("#div_questions").hideLoading();
    var structureId = tid != null ? tid : "";
    if (tid != null) {
        lastStructureId = structureId;
    }
    var parentStructureId = (arguments[1] != null && arguments[1] != undefined) ? arguments[1] : "`-1"; //决定是否需要parentId
    $get("ddlViewEditHistory").value = -1;

    if (treeContaner.attr("id") == "div_tree") {
        if ($divQuestionManage1.style.display != "none") {//点击页面初始加载时的树形菜单
            if ($imgLoadingId.style.display != "none" && !window.confirm("之前的操作正在请求,你确定要取消之前的请求从而执行新的请求?")) {
                setSelectedNodeClass('div_tree', _structureId, null);
                return;
            }

            $imgLoadingId.style.display = "block";

            //            if(_structureId!=null && (_structureId==structureId)){
            //                $imgLoadingId.style.display="none";
            //                return;
            //            }else{
            _structureId = structureId;
            // setSelectedNodeClass('div_tree', _structureId, null);
            bindQuestionsToTable(structureId);

            //            $get("spanBookStructurePos").innerHTML = getCurrentNodePos("div_tree", _structureId);
            //            }
            sourceStructureId = _structureId;
        }
        //        else {//点击Step1 Description Question 里的树形菜单
        //            _structureId = structureId;
        //        }
    } else if (treeContaner.attr("id") == "divBookStructureOfQuestion") {
        _structureId = structureId;
    } else if (treeContaner.attr("id") == "div_tree2") {//点击Step 3 Knowledge Point里的树形菜单
        if ($("#ddlAnswerType").val() == "6") {
            return;
        }
        if ($imgLoadingId.style.display != "none" && !window.confirm("之前的操作正在请求,你确定要取消之前的请求从而执行新的请求?")) {
            setSelectedNodeClass('div_tree2', _structureId2);
            return;
        }

        $imgLoadingId.style.display = "block";

        if (_structureId2 != null && (_structureId2 == structureId)) {
            $imgLoadingId.style.display = "none";
            return;
        } else {
            _structureId2 = structureId;
            setSelectedNodeClass('div_tree2', _structureId2);
            bindLearningObjectiveListToTable(structureId);
        }

    }


}
function QM_buildRelationTree(treeContainer, treeData, isbn) {
    ///<summary>构造RelationStructure树</summary>

    treeContainer.attr("loadFlag", "1");
    var $tree = treeContainer.dynatree({
        title: "Relation Tree",
        clickFolderMode: 1,
        children: treeData,
        cookieId: "relationTree",
        onLazyRead: function (node) {
            var structureId = node.data.key;
            //emath_simpleUser.isbn = isbn;
            
            $excuteWS("~CmsWS.getLearningObjectiveWithStructureList", { structureId: structureId, isbn: isbn, exCurriculumId: null, simpleUser: simpleUser }, function (result) {
                if (result != null && result.length > 0) {
                    var kpNodes = new Array();
                    var kpNode = null;
                    $.each(result, function () {
                        kpNode = {};
                        kpNode.title = this.unit + ". " + this.name;
                        kpNode.key = this.id;
                        kpNodes.push(kpNode);
                    });
                    node.addChild(kpNodes);
                } else {
                    node.data.isFolder = false;
                    node.render();
                }
                node.setLazyNodeStatus(DTNodeStatus_Ok);
            }, null, node);
        },
        onClick: function (node, event) {

            if (event.target.className != "dynatree-expander") {
                if (node.data.structureLevel == "0") {
                    return;
                }
                onTreeNodeClick(node.data.key, treeContainer);
                if (treeContainer.attr("id") == "divBookStructureOfQuestion") {
                    $get("spanBookStructurePos").innerHTML = node.data.title
                } else if (treeContainer.attr("id") == "QM_div_copy_question_tree") {
                    copyq_structureId = node.data.key;
                }
            }


        },
        onDblClick: function (node, event) {
            node.toggleExpand();
        }
    });

    $tree.dynatree("getTree").reload()
    treeContainer.css("overflow", "");
}
function excuteGetKnowledgeGradesOfStructureList(bookStructureId, type, _simpleUser) {

    TestWS.getKnowledgeGradesOfStructureList(bookStructureId, true, _simpleUser.userId,_simpleUser, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "getKnowledgeGradesOfStructureList" }, null);
}

function onDdlViewQuestionsChange(o) {
    if (lastStructureId) {

        getQusetionWebservice(lastStructureId);
    }
}

//function click_cbk_Select()
//{
//    if (lastStructureId)
//    {
//        
//        getQusetionWebservice(lastStructureId);
//    }
//}
function getQusetionWebservice(structureId) {
    var type = $("#ddlViewQuestionsByDiffCondition").val();
    //    if ($("#cbk_Select").is(":checked"))
    //    {
    //        type = "2";
    //    }
    //    else 
    //    {
    //        type = "1";
    //    }


    $imgLoadingId.style.display = "block";
    if (type == "-1") {
        $("div.pagination").show();
        $("div.dvGotoPage").show();
        $(".pagination_ddl").show();
        //CmsWS.getQuestionExtendForStructureId(structureId,simpleUser,onQuestionManagePageSuccessed,onQuestionManagePageFailed,{userContext:"getQuestionExtendForStructureId"},null);
        // CmsWS.getQuestionForStructureId(structureId,simpleUser,onQuestionManagePageSuccessed,onQuestionManagePageFailed,{userContext:"getQuestionForStructureId"},null);
        CmsWS.getQuestionIdsForStructureId(structureId, simpleUser, function (_result, _userContext, _methodName) {
            var questionIdArray = window.tempQuestionIdArray = _result;
            bindDDLPageSize();
            bindKnowledgeGuidePagination(questionIdArray);

        }, onQuestionManagePageFailed, { userContext: "getQuestionIdsForStructureId" }, null);
    }
    else if (type == "0") {
        $("div.pagination").hide();
        $("div.dvGotoPage").hide();
        $(".pagination_ddl").hide();
        var _simpleUser = {};
        for (var ins in simpleUser) {
            if (typeof ins != "function" && ins != "__type") {

                _simpleUser[ins] = simpleUser[ins];
            }
        }
        excuteGetKnowledgeGradesOfStructureList(structureId, "Normal", simpleUser)
        //        AssignmentWS.getQuestionIdsForKpByStructureId([structureId],getTempISBN(), _simpleUser, function (_result, _userContext, _methodName)
        //        {
        //            var questionIdArray = window.tempQuestionIdArray = _result;
        //            bindKnowledgeGuidePagination(questionIdArray);

        //        }, onQuestionManagePageFailed, { userContext: "getQuestionIdsForKpByStructureId" }, null);
    }
    else if (type == "1") {
        CmsWS.getQuestionIdsNoKpForStructureId(structureId, simpleUser, function (_result, _userContext, _methodName) {

            var questionIdArray = window.tempQuestionIdArray = _result;
            bindDDLPageSize();
            bindKnowledgeGuidePagination(questionIdArray);

        }, onQuestionManagePageFailed, { userContext: "getQuestionIdsNoKpForStructureId" }, null);

    } else if (type == "2") {
    
        $excuteWS("~CmsWS.getQuestionIdsForNoSeed", { bookId: $("#ddlBookList").find("option:selected").attr("id"), userExtend: simpleUser }, function (r) {
            var questionIdArray = window.tempQuestionIdArray = r;
            bindDDLPageSize();
            bindKnowledgeGuidePagination(questionIdArray);
        }, null, { userContext: "getQuestionIdsForNoSeed" });
    }
}
function getCharCount(str1, str2) {
    var r = new RegExp('\\' + str2, "gi");
    return str1.match(r).length;
}
function bindDDLPageSize() {
    var ddlPageSize = $get("ddlPageSize");
    ddlPageSize.length = 0;
    var length = window.tempQuestionIdArray.length;
    var pageSizes = new Array();
    //pageSizes.push({ value: length, text: length });
    var i = 1;
    var maxPageSize = 50; //一页最大个数
    while (accMul(i, 10) < length / 2) {
        if (accMul(i, 10) > maxPageSize) {
            break;
        }
        pageSizes.push({ value: accMul(i, 10), text: accMul(i, 10) });
        i++;
    }
    if (length < maxPageSize) {
        pageSizes.push({ value: length, text: length });
    }
    for (var i = 0; i < pageSizes.length; i++) {
        ddlPageSize.options[i] = new Option(pageSizes[i].text, pageSizes[i].value);
    }
    ddlPageSize.value = ddlPageSize.options[ddlPageSize.options.length - 1].value;
}
function ddlPageSizeChange(node) {
    bindKnowledgeGuidePagination(window.tempQuestionIdArray);
}
//根据文本输入框里输入的number信息返回number数组
function getQuestionNumberArray(txtValue) {
    var v = txtValue.trim();
    var numberArray = new Array();
    if (v == "") {
        alert("请输入正确的考题编号。 ");
        return null;
    }
    if ($get("ddlInterval").value != "-1") {
        var eflg = true;
        switch ($get("ddlInterval").value) {
            case "0":
                if (v.indexOf("(") != -1 || v.indexOf(")") != -1 || v.indexOf("[") != -1 || v.indexOf("]") != -1) {
                    eflg = false;
                }
                break;
            case "1":
                if (v.indexOf("(") != 0 || v.indexOf(")") != v.length - 1) {
                    eflg = false;
                }
                break;
            case "2":
                if (v.indexOf("(") != 0 || v.indexOf("]") != v.length - 1) {
                    eflg = false;
                }
                break;
            case "3":
                if (v.indexOf("[") != 0 || v.indexOf("]") != v.length - 1) {
                    eflg = false;
                }
                break;
            case "4":
                if (v.indexOf("[") != 0 || v.indexOf(")") != v.length - 1) {
                    eflg = false;
                }
                break;
        }

        if (!eflg) {
            alert("请输入正确的考题编号。");
            return null;
        }
    }
    if (v.indexOf("(") == 0) {
        if (v.indexOf(",") == -1 || getCharCount(v, ",") != 1) {
            alert("请输入正确的考题编号。");
            return null;
        }
        var f = -1;
        if (v.lastIndexOf(")") != -1 && v.lastIndexOf(")") == v.length - 1)
        { f = 0; }
        else if (v.lastIndexOf("]") != -1 && v.lastIndexOf("]") == v.length - 1)
        { f = 1; }
        var temArr = v.substring(1, v.length - 1).split(",");
        if (temArr != null && f != -1 && temArr.length == 2) {
            if (!isNaN(temArr[0]) && temArr[0] != "" && !isNaN(temArr[1]) && temArr[1] != "") {
                if (f == 0) {
                    for (var num1 = (parseInt(temArr[0]) + 1); num1 < parseInt(temArr[1]); num1++) {
                        numberArray.push(num1);
                    }
                } else {
                    for (var num2 = (parseInt(temArr[0]) + 1); num2 <= parseInt(temArr[1]); num2++) {
                        numberArray.push(num2);
                    }
                }

            } else {
                alert("请输入正确的考题编号。");
                return null;
            }

        } else {
            alert("请输入正确的考题编号。");
            return null;
        }


    } else if (v.indexOf("[") == 0) {
        if (v.indexOf(",") == -1 || getCharCount(v, ",") != 1) {
            alert("请输入正确的考题编号。");
            return null;
        }
        var k = -1;
        if (v.lastIndexOf(")") != -1 && v.lastIndexOf(")") == v.length - 1)
        { k = 0; }
        else if (v.lastIndexOf("]") != -1 && v.lastIndexOf("]") == v.length - 1)
        { k = 1; }
        var temArr = v.substring(1, v.length - 1).split(",");
        if (temArr != null && k != -1 && temArr.length == 2) {
            if (!isNaN(temArr[0]) && temArr[0] != "" && !isNaN(temArr[1]) && temArr[1] != "") {
                if (f == 0) {
                    for (var num1 = parseInt(temArr[0]); num1 < parseInt(temArr[1]); num1++) {
                        numberArray.push(num1);
                    }
                } else {
                    for (var num2 = parseInt(temArr[0]); num2 <= parseInt(temArr[1]); num2++) {
                        numberArray.push(num2);
                    }
                }
            } else {
                alert("请输入正确的考题编号。");
                return null;
            }

        } else {
            alert("请输入正确的考题编号。");
            return null;
        }
    } else {
        if (v.indexOf(",") != -1) {
            var numbers = v.split(",");
            var flg = true;
            for (var t = 0; t < numbers.length; t++) {
                if (isNaN(numbers[t]) || numbers[t] == "") {
                    flg = false;
                    break;
                }
            }

            if (flg) {
                Array.clear(numberArray);
                Array.addRange(numberArray, numbers);
            } else {
                alert("请输入正确的考题编号。");
                return null;
            }

        } else {
            if (!isNaN(v)) {
                numberArray.push(v);
            } else {
                alert("请输入正确的考题编号。");
                return null;
            }
        }
    }
    return numberArray;
}

//点击输入question number的文本框时清空内容
function onTxtQuestionNumberQueryClick(o, evt) {
    if (o.value.indexOf("For:") != -1) {
        o.value = "";
    }
    o.style.color = "";

    if (typeof evt != "undefined" && evt.keyCode != null && evt.keyCode == 13) {
        onBtnQuestionNumberQueryClick();
    }
}

//根据指定的question number查询question
function onBtnQuestionNumberQueryClick() {
    var _numberArray = getQuestionNumberArray($get("txtQuestionNumberQuery").value);
    if (_numberArray != null) {
        $imgLoadingId.style.display = "block";
        simpleUser.bookId
        excuteGetQuestionByNumber(_numberArray, simpleUser);
    } else {
        $get("txtQuestionNumberQuery").value = "";
        return;
    }
}

//选择区间范围查询question
function onDdlIntervalChange(s) {
    if (s.value != "-1") {
        //        $get("txtQuestionNumberQuery").readOnly=$get("btnQuestionNumberQuery").disabled=false;
        $get("txtQuestionNumberQuery").style.color = "gray";
        switch (s.value) {
            case "0":
                $get("txtQuestionNumberQuery").value = "For: 10,20,30";
                break;
            case "1":
                $get("txtQuestionNumberQuery").value = "For: (10,30)";
                break;
            case "2":
                $get("txtQuestionNumberQuery").value = "For: (10,30]";
                break;
            case "3":
                $get("txtQuestionNumberQuery").value = "For: [10,30]";
                break;
            case "4":
                $get("txtQuestionNumberQuery").value = "For: [10,30)";
                break;
        }
    } else {
        $get("txtQuestionNumberQuery").value = "";
        //        $get("txtQuestionNumberQuery").readOnly=$get("btnQuestionNumberQuery").disabled=true;
    }
}

//恢复活动题参数信息
function recoveryAlgorithmPrameterInfo() {
    if (window.confirm("你确定你要恢复活动题参数信息?")) {
        hidAlgorithmTxtBox();
        clearTableAlgorithmInfo();
        onGetQuestionAlgorithmListSuccessed(tempAlgorithmInfoList);
    }

}

//复制活动题参数
function copyAlgorithmPrameterInfo() {
    hidAlgorithmTxtBox();
    $get("divEnableOthers").style.display = $get("divInputQuestionNumber").style.display = "block";
    $get("txtNumberOfQuestion").value = "";
}

//确定覆盖根据题自增量查出来的活动题参数
function onQueryAlgorithmInfoClick() {
    var txtNumberOfQuestionValue = $get("txtNumberOfQuestion").value;
    if (txtNumberOfQuestionValue.trim() == "") {
        alert("The question number is required.");
        return;
    }
    $get("divEnableOthers").style.display = $get("divInputQuestionNumber").style.display = "none";
    $get("divLoading22").style.display = "block";
    excuteGetQuestionAlgorithmByNbList(txtNumberOfQuestionValue, simpleUser);
}

//取消查询活动题参数
function onCancelQueryAlgorithmInfoClick() {
    $get("divEnableOthers").style.display = $get("divInputQuestionNumber").style.display = "none";
}

//function onBtnSaveAlgorithmParamsValueClick() {
//    if (isNaN($get("txtAlgorithmParamsOfValue").value.trim())) {
//        $get("txtAlgorithmParamsOfValue").value = "10";
//        alert("Must be a number.");
//        return;
//    }

//    try {
//        var times = parseInt($get("txtAlgorithmParamsOfValue").value);
//        if (times < 0 || times > 20) {
//            alert("The number must be within the range of 0-20");
//            return;
//        }
//    } catch (e) {
//        alert("The number must be within the range of 0-20");
//        return;
//    }

//    if ($get("ddlBookList").value != "-1") {
//        $get("qImgLoading").style.display = "block";
//        CmsWS.cacheQuestionAlgorthmValue($get("ddlBookList").value, $get("txtAlgorithmParamsOfValue").value, simpleUser, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "cacheQuestionAlgorthmValue" }, null);
//    }
//}

////教学大纲改变时重新绑定树形菜单
//var tempCurriculumId=null;
//function onDdlCurriculumListChange(s)
//{
//    if(s.selectedIndex!=0 && tempCurriculumId!=s.value)
//    {
//        if($get("div_tree_questions").style.display!="none"){
//            $imgLoadingId.style.display="block";
//        }
//        bindBookContentStructureListToTree(null,"undefined",s.value,simpleUser);
//        tempCurriculumId=s.value;
//        $get("div_tree_questions").style.display="block";
//        $get("div_questions").innerHTML="";
//    }
//}

//选择书
var tempIsbn = null;
var QM_tqtArray = new Array();
function onDdlBookListChange(s) {

    if (s.selectedIndex != 0 && tempIsbn != s.value) {
        $("div.pagination").hide();
        $("div.dvGotoPage").hide();
        $(".pagination_ddl").hide();
        $("#btnQuestionNumberQuery").attr("disabled", "disabled");
        if ($get("div_tree_questions").style.display != "none") {
            $imgLoadingId.style.display = "block";
        }
        var bookWrapper = findBookObj(s.value);
        var $des = $("#Des");
        var $sub = $("#Sub");
        bindDiscipline($des, "", bookWrapper.disciplineId);
        //$des.val(bookWrapper.disciplineId);
        bindSubject($sub, bookWrapper.disciplineId, "", bookWrapper.subjectId);
        emath_editor_bookId = $(s).find("option:selected").attr("id");
        if (QM_tqtArray.firstOrDefault("isbn", s.value) == null) {
            CmsWS.getTestQuestionTypeList(s.value, simpleUser, function (r) {
                QM_tqtArray.push({ isbn: s.value, bookId: emath_editor_bookId, result: r });
                bindBookContentStructureListToTree(null, s.value, null, simpleUser);
            }, onQuestionManagePageFailed, { userContext: "getTestQuestionTypeList" }, null);
        }
        else {
            bindBookContentStructureListToTree(null, s.value, null, simpleUser);
        }
        
        simpleUser.isbn = tempIsbn = s.value;
        $get("div_tree_questions").style.display = "block";
        $get("div_questions").innerHTML = "";
        $get("ddlViewEditHistory").value = -1;
        $get("dvAdvancedSearch").style.display = "none";
        AddUserParam("isbn", s.value);
       
        $ddlAnswerType.value = "-1";
        $ddlQuestionType.value = "-1";

    } else {
        SetUserParam("isbn", "");
    }
    //    $get("divAlgorithmParamsOfValue").style.display = (simpleUser.roleId == "2" && s.value != "-1") ? "block" : "none";
}

function onDdlBookListForCopyQuestionChange(s) {
    _structureId = null;
    $get("spanBookStructurePos").innerHTML = "[NULL]";
}
function removeDisbledForDDL(o, tid) {
    $('#' + tid).removeAttr("disabled");
    o.src = "../CMS/Images/lock_open.png";
}

//Question管理选择行为改变时
//var ddlTypeStatus = 0; //记录相应的webservice是否加载完毕(为2时加载完毕)
function onDdlActionsChange(s) {
    if (s.selectedIndex != 0) {
        $get("spanBookStructurePos").innerHTML = "[NULL]";
        if (s.value == "create" || s.value == "addchild") {
            if (s.value == "addchild") {
                if (questionIdArray.length == 0 || questionIdArray.length > 1 && QM_parentQuestionId != null) {// || !$("#div_questions").find("table input[type=checkbox][parentFlag=1]").is(":checked")) {
                    alert("请选择一个母题为其添加子题");
                    s.value = "-1";
                    return;
                }

            }
            $divQuestionManage1.style.display = "none";
            $get("divQuestionManage2").style.display = "block";
            $ddlAnswerType.removeAttribute("disabled");
            $ddlQuestionType.removeAttribute("disabled");
            $get("ddlLogicType").removeAttribute("disabled");
            $("img[enableDDL=1]", "#divStep1").hide();
            //_ddlDifficult.removeAttribute("disabled");
            $get("rdAlgorithmNo").removeAttribute("disabled");
            $get("rdAlgorithmYes").removeAttribute("disabled");
            $get("btnChangeStructure").removeAttribute("disabled");
            //            $get("spanBookStructurePos").innerHTML = getCurrentNodePos("div_tree", _structureId);
            $get("spanBookStructurePos").innerHTML = getCurrentNodePos(_structureId);
            //            if (ddlTypeStatus != 2) {
            $imgLoadingId.style.display = "block";
            bindAnswerTypeListToDropDownList();
            var _bookId = simpleUser.roleId == "2" ? $("#ddlBookList").find("option:selected").attr("id") : simpleUser.BookId;
            
            bindQuestionTypeListToDropDownList(_bookId);
            //            }

            clearArrayForQuestion();
            questionId = randomChars(20);
            $find(qPrefix + "QuestionManage1_Tabs1").set_activeTabIndex(0);
            $get("rdAlgorithmYes").checked = !($get("rdAlgorithmNo").checked = true);
            $get("imgRecoveryParametersInfo").style.visibility = "hidden";
            bindStructureType();
        }
        else if (s.value == "copys") {
            var html = new Array();
            html.push('<div id="QM_div_copy_questions" style="padding:5px;">');
            html.push('<div>拷贝到: <select id="ddlBookListForCopyQ" onchange="onBookCopyQuestionChange(this)">' + $("#ddlBookList").html() + '</select></div>');
            html.push('<div id="QM_div_copy_question_tree" style="padding:5px;height:400px;overflow:auto;"">请选择一个章节进行拷贝</div>');
            html.push('</div>');
            //$(html.join('')).appendTo(document.body);

            $.jBox(html.join(''), { title: "拷贝题", width: 300, closed: function () {
                s.value = "-1";
            }, submit: function () {
                //copyQuestions(String[] questionIds, String structureId, String newBookId,SimpleUser simpleUser)
                if (copyq_structureId != null) {

                    var qids = new Array();
                    if (questionIdArray) {
                        for (var j = 0; j < questionIdArray.length; j++) {
                            qids.push(questionIdArray[j].id);
                        }
                    }

                    var $ddlBookListForCopyQ = $("#ddlBookListForCopyQ");
                    var t_isbn = $ddlBookListForCopyQ.val();
                    CmsWS.copyQuestions(qids, copyq_structureId, $ddlBookListForCopyQ.find("option:selected").attr("id"), simpleUser, function (r) {
                        if (r && r.length != 0) {
                            alert("拷贝题成功");
                            var $ddlBookList2 = $("#ddlBookList");

                            if ($ddlBookList2.val() != t_isbn) {
                                $ddlBookList2.val(t_isbn).trigger("change");
                            }
                            var questionIdArray = window.tempQuestionIdArray = r;
                            bindDDLPageSize();
                            bindKnowledgeGuidePagination(questionIdArray);
                        }
                    }, onQuestionManagePageFailed, { userContext: "copyQuestions" }, null);
                    copyq_structureId = null;
                } else {
                    alert("请选择一个章节进行拷贝");
                    return false;
                }
                s.value = "-1";
            }
            });
            $("#ddlBookListForCopyQ").val("-1");
        }
        else if (s.value == "edit" || s.value == "copy") {
            if (questionIdArray.length == 0 || questionIdArray.length > 1) {
                if (s.value == "edit") {
                    alert("请选择一个考题进行编辑");
                } else {
                    alert("请选择一个考题进行拷贝.");
                }
                s.value = "-1";
                return;
            }

            //$get("divLoading22").style.display = "block";
            if (s.value == "copy") {
                $get("btnChangeStructure").removeAttribute("disabled");
                $get("ddlBookListForCopyQuestion").setAttribute("disabled", "false");
            } else {
                $("#div_questions").showLoading();
            }
            //            else if(s.value=="edit"){
            //                $get("btnChangeStructure").setAttribute("disabled","false");
            //             }

            questionId = questionIdArray[0].id;
            _structureId = questionIdArray[0].structureId;
            //            $imgLoadingId.style.display = "block";
            excuteGetQuestion(questionId); //LY1
            $ddlAnswerType.setAttribute("disabled", "disabled");
            $ddlQuestionType.setAttribute("disabled", "disabled");
            $get("ddlLogicType").setAttribute("disabled", "disabled");
            $("img[enableDDL=1]", "#divStep1").attr("src", "../CMS/Images/lock.png").show();
            $find(qPrefix + "QuestionManage1_Tabs1").set_activeTabIndex(0);
            //_ddlDifficult.setAttribute("disabled", "disabled");

            if (s.value == "copy" && simpleUser.roleId == "2") {
                $get("divBookForCopyQuestion").style.display = "block";
                bindBookListToDDL($("#ddlBookListForCopyQuestion"), tempBookList);
                $get("ddlBookListForCopyQuestion").value = $get("ddlBookList").value;
            } else {
                $get("divBookForCopyQuestion").style.display = "none";
            }
            //            $get("spanBookStructurePos").innerHTML = getCurrentNodePos("div_tree", _structureId);
            $get("spanBookStructurePos").innerHTML = getCurrentNodePos(_structureId);
            $get("imgRecoveryParametersInfo").style.visibility = "visible";
        } else if (s.value == "delete") {
            if (window.confirm("你确定要删除该题吗?")) {
                CmsWS.deleteQuestions(questionIdArray, simpleUser, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "deleteQuestions" }, null)
                questionIdArray = [];
            } else {
                $get("ddlActions").value = "-1";
            }
            $get("imgRecoveryParametersInfo").style.visibility = "hidden";
        }
        else if (s.value == "review") {

        } else if (s.value == "audit") {
            s.value = "-1";
            if (questionIdArray.length != 1) {
                alert("请选择一个题");
                return;
            }

            var obj = new ContentAudit({
                bookId: $("#ddlBookList").find("option:selected").attr("id"),
                contentId: questionIdArray[0].id,
                contentType: "0",
                simpleUser: simpleUser
            });
            obj.Show();
        } else if (s.value == "editHistory") {
            s.value = "-1";
            if (questionIdArray.length != 1) {
                alert("请选择一个题");
                return;
            }

            var obj = new ContentEditHistory({
                bookId: $("#ddlBookList").find("option:selected").attr("id"),
                contentId: questionIdArray[0].id,
                contentType: "0",
                simpleUser: simpleUser
            });
            obj.Show();
        }

    }
}

var copyq_structureId = null;
//function onCopyQuestionTreeClick(id) {
//    copyq_structureId = id;
//}

function onBookCopyQuestionChange(o) {

    $("#QM_div_copy_question_tree").html('<center><img alt="loading..." src="../Images/ajax-loader_b.gif" /></center>');
    if (this.value != "-1") {
        //        Comm_WebService.getBookContentStructureArray(null, o.value, null, simpleUser, function (result, userContext, methodName) {
        //            $("#QM_div_copy_question_tree").html(getTreeMenuHTML(result, null, 3) + "");
        //        }, onQuestionManagePageFailed, { userContext: "getBookContentStructureArray" }, null);

        $excuteWS("~CmsWS.getBookStructureArray", { isbn: o.value, isLazy: false }, function (result) {
            QM_buildRelationTree($("#QM_div_copy_question_tree"), result[0], o.value);
        }, null, null);
    } else {
        $("#QM_div_copy_question_tree").html("请选择一个章节进行拷贝");
    }
}

//编辑question时设置相关信息
var editQuestionTypeId = "-1";
var editTestQuestionTypeId = "-1";
var editQuestionParentId = "-1";
//勾选需要编辑的question的时候所执行的操作
var questionIdArray = [];
function getEditQuestionId(cbx, qId, structureId) {

    if (cbx.checked) {
        //        //#region 只能单选的操作
        //        $(".ckb_IsSelect").each(function (index) {
        //            if (this.checked && this.id != cbx.id) {
        //                this.checked = false;
        //            }
        //        });
        //        //#endregion 结束
        //        var questionWrapper = {};
        //        questionWrapper.id = qId;
        //        questionWrapper.structureId = structureId;
        //        questionWrapper.createdDate = createdDate;
        //        questionIdArray = [];
        //        questionIdArray.push(questionWrapper);
        var qidFlag = false;
        for (var _qid = 0; _qid < questionIdArray.length; _qid++) {
            if (qId == questionIdArray[_qid].id) {
                qidFlag = true;
                break;
            }
        }

        if (!qidFlag) {
            var questionWrapper = {};
            questionWrapper.id = qId;
            questionWrapper.structureId = structureId;
            //questionWrapper.createdDate = createdDate;
            questionIdArray.push(questionWrapper);
        }
    } else {
        //  questionIdArray = [];
        for (var _qid = 0; _qid < questionIdArray.length; _qid++) {
            if (qId == questionIdArray[_qid].id) {
                questionIdArray.splice(_qid, 1);
                break;
            }
        }
    }
}

//选择是否为活动题单选按钮
function onRdIsAlgorithmClick() {
    if ($get("rdAlgorithmYes").checked) {
        if (QM_parentQuestionId != null && QM_parentQuestionId != "") {
            bindQuestionAlgorithmList(QM_parentQuestionId);
        } else {
            if ($get("tableAlgorithmInfo").rows.length == 1) {
                createAlgorithmRow(1);
            }
            $get("divAlgorithmInfo").style.display = "block";
        }
    } else {
        $get("divAlgorithmInfo").style.display = "none";
    }
}

//下拉列表AnswerType改变
function onAnswerTypeChange(s) {
    if (s.value != -1) {
        //hidden_emath_editor();
        editor.hide();
        if (s.value == "11" || s.value == "4" || s.value == "8") {
            //$get("tr_GradeMode").style.display = "block";
            $get("rdManualGrade").checked = true;
            //            if(s.value == "11")// &&　$get("divQuestionAnswer").getElementsByTagName("input")!=null && $get("divQuestionAnswer").getElementsByTagName("input").length!=0)
            //            {
            //                $get("divQuestionAnswer").innerHTML="&nbsp;";
            //            }
        } else {
            $get("tr_GradeMode").style.display = "none";
            $get("rdManualGrade").checked = false;
        }

        if (s.value == "6") {

            $("#trQuestionOrder").css("display", "");
            $("#txtQuestionOrder").val("0");
        } else {
            $("#trQuestionOrder").css("display", "none");
        }
    }
}


//容器Tabs1里的某一选项卡被激活时//注意清空数组sLoArray
var answerTypeFlag = null;
var active_Tab_Index = 0;
function onActiveTabChanged1(sender, e) {
    $.jBox.close("jbox_SolutionsKP");
    var ddlAnswerTypeValue = $ddlAnswerType.value;
    if (sender._activeTabIndex != 0) {
        if (answerTypeFlag != ddlAnswerTypeValue) {
            if (answerTypeFlag != null && $get("ddlActions").value != "edit" && $get("ddlActions").value != "copy")//若选择项已发生改变再执行
            {
                //                if ($get("divQuestionAnswer").innerHTML.indexOf("div_IframeEditor") != -1 && $get("divQuestionAnswer").innerHTML.indexOf("iframeEditor") != -1) {
                //                    //hidden_emath_editor();
                //                    
                //                }
                editor.hide();
                $get("divQuestionAnswer").innerHTML = "&nbsp;";
                //                if(ddlAnswerTypeValue!="11"){
                //                    $get("divQuestionAnswer").innerHTML="&nbsp;";
                //                }else{
                //                    $get("divQuestionAnswer").innerHTML="<div id=\"divMathInputAnswer_"+randomChars(20)+"\" style=\"width:100%;height:100%\" onclick=\"onQustionDivClick(this)\">&nbsp;</div>";
                //                }
            } else {
                //                if(ddlAnswerTypeValue=="11" && $get("ddlActions").value!="edit" && $get("ddlActions").value!="copy"){
                //                     hidden_emath_editor();
                //                     $get("divQuestionAnswer").innerHTML="<div id=\"divMathInputAnswer_"+randomChars(20)+"\" style=\"width:100%;height:100%\" onclick=\"onQustionDivClick(this)\">&nbsp;</div>";
                //                }
            }
        }
        answerTypeFlag = ddlAnswerTypeValue;
    } else {
        return;
    }

    if (sender._activeTabIndex == 1) {
        if (ddlAnswerTypeValue == "-1") {
            sender.set_activeTabIndex(0)
            alert("请选择答案类型!");
            return;
        }

        if ($get("ddlQuestionType").value == "-1") {
            sender.set_activeTabIndex(0)
            alert("请选择题类型!");
            return;
        }

        

        if (_ddlDifficult.value == "-1") {
            sender.set_activeTabIndex(0)
            alert("请选择难度!");
            return;
        }

    } else if (sender._activeTabIndex == 2) {
        editor.hide();
        if ($get("div_tree2").innerHTML.indexOf("ajax-loader_b.gif") != -1 || $get("div_tree2").innerHTML == "" || $get("div_tree2").innerHTML == "[NULL]") {
            //$get("div_tree2").innerHTML = getTreeMenuHTML(treeResult, 0, 1);
            QM_buildRelationTree($("#div_tree2"), treeResult[0], $("#ddlBookList").val());
            $("#tb_Step3SelectLO").colResizable({
                liveDrag: true,
                minWidth: 100
            });

        }

        if ($get("divSKnowlegePoint").style.display == "none" && ($get("ddlActions").value == "edit" || $get("ddlActions").value == "copy")) {
            $imgLoadingId.style.display = "block";
        }
    } else if (sender._activeTabIndex == 3) {

        if (isNaN(_txtDiscriminator.value)) {
            alert("Discriminator must be a number");
            sender.set_activeTabIndex(active_Tab_Index);
            return;
        }

        if (isNaN(_txtGuessFactor.value)) {
            alert("GuessFactor must be a number");
            sender.set_activeTabIndex(active_Tab_Index);
            return;
        }
        //        if ($get("ddlActions").value == "edit" || $get("ddlActions").value == "copy") {
        //            if (ddlTypeStatus == 2 && loqstatus == 1) {
        //                $imgLoadingId.style.display = "none";
        //                //loqstatus=-1;
        //            } else {
        //                sender.set_activeTabIndex(active_Tab_Index);
        //                $imgLoadingId.style.display = "block";
        //            }
        //        }
        //hidden_emath_editor();
        editor.hide();
        $get("divPreviewErrorInfo").style.display = "block";
        $get("divQuestionPreview").innerHTML = "&nbsp;";

        var obj = getValidatedQuestionInfo();

        if (obj != null) {
            var tempQloDiv = document.createElement("div");
            tempQloDiv.innerHTML = obj.content;
            $get("divPreviewErrorInfo").innerHTML = obj.content;
            if (obj.flag) {
                $("#btnQuestionApply").removeAttr("disabled");
            } else {
                $("#btnQuestionApply").attr("disabled", "disabled");
            }
        } else {
            $get("divPreviewErrorInfo").style.display = "none";
            $("#btnQuestionApply").removeAttr("disabled");
        }

        //        try {
        //            $get("btnQuestionApply").removeAttribute("disabled");
        //        } catch (e) { }

        //QuestionWrapperArray
        questionWrapperArray = [];

        questionWrapperArray.push(getQuestionWrapper());

        //LoQuestionWrapperArray
        loQuestionWrapperArray = [];
        var tempTargetLoArray = []; //target lo
        var table_QuestionLos = $get("table_QuestionLos");
        var editFlag = ($get("ddlActions").value == "edit" || $get("ddlActions").value == "copy") ? true : false;
        for (var rowIndex = 2; rowIndex < table_QuestionLos.rows.length; rowIndex++) {
            // var txtProbability=table_QuestionLos.rows[rowIndex].cells[2].firstChild;//得到填写Probability的文本框
            var $txtProbability = $(table_QuestionLos.rows[rowIndex].cells[2].firstChild);
            var cbxIsTarget = table_QuestionLos.rows[rowIndex].cells[3].firstChild; //得到勾选是否为target的复选框
            var ddlCognitive = table_QuestionLos.rows[rowIndex].cells[4].firstChild; //得到勾选是否为target的复选框
            for (var tslo = 0; tslo < sLoArray.length; tslo++) {
                if ($txtProbability.attr("id") == "txt_qlo_" + sLoArray[tslo].loId) {
                    var surpportLo = {};
                    surpportLo.id = editFlag == true ? sLoArray[tslo].id : randomChars(20);
                    surpportLo.loId = sLoArray[tslo].loId;
                    surpportLo.loType =cbxIsTarget.checked?"0": "1";
                    surpportLo.probability = $txtProbability.val();
                    surpportLo.cognitiveType = $(ddlCognitive).val();
                    surpportLo.questionId = questionId;
                    surpportLo.loStep = $txtProbability.attr("step");
                    loQuestionWrapperArray.push(surpportLo);
                    if (cbxIsTarget.checked) {
                        var targetLo = {};
                        if (editFlag) {
                            var eflag = false;
                            for (var t = 0; t < targetLoArr.length; t++) {
                                if (targetLoArr[t].loId == sLoArray[tslo].loId) {
                                    targetLo.id = targetLoArr[t].id;
                                    eflag = true;
                                    break;
                                }
                            }

                            if (!eflag) {
                                targetLo.id = randomChars(20);
                            }
                        } else {
                            targetLo.id = randomChars(20);
                        }

                       
                        targetLo.loId = sLoArray[tslo].loId;
                        targetLo.loType = "0";
                        targetLo.probability = "0";
                        targetLo.cognitiveType = $(ddlCognitive).val();
                        targetLo.questionId = questionId;
                        targetLo.loStep = $txtProbability.attr("step");
                       // loQuestionWrapperArray.push(targetLo);
                    }
                    break;
                }
            }
        }

        //ReferenceAnswersWrapperArray
        referenceAnswerWrapperArray = [];
        switch ($ddlAnswerType.value) {
            case "1": //单选题 Multiple choices
                set_Multiple_Choices_Selection_Value(referenceAnswerWrapperArray, editFlag);
                break;
            case "11": //数学公式题 Math Input
                set_Multiple_Choices_Selection_Value(referenceAnswerWrapperArray, editFlag);
                //                var referenceAnswerWrapper={};
                //                var mathInputReferenceAnswerContent="";
                //                if(editFlag)
                //                {
                //                    if($get("divQuestionAnswer").firstChild!=null && $get("divQuestionAnswer").firstChild.id!=undefined)
                //                    {
                //                        referenceAnswerWrapper.id=$get("divQuestionAnswer").firstChild.id.substring(19);
                //                        mathInputReferenceAnswerContent=$get("divQuestionAnswer").firstChild.innerHTML;
                //                    }
                //                }else{
                //                    referenceAnswerWrapper.id=randomChars(20);
                //                    if($get("divQuestionAnswer").firstChild!=null){
                //                        mathInputReferenceAnswerContent=$get("divQuestionAnswer").firstChild.innerHTML;
                //                    }
                //                }
                //                referenceAnswerWrapper.orderName=null;
                //                referenceAnswerWrapper.questionId=questionId;
                //                referenceAnswerWrapper.correctFlag="1";
                //                referenceAnswerWrapper.content=V_A(mathInputReferenceAnswerContent);
                //                referenceAnswerWrapperArray.push(referenceAnswerWrapper);
                break;
            case "13": //Success/Fail
                set_SF_TF_YN_Value(referenceAnswerWrapperArray, { rd1: $get("rdSucceeded"), content: "对" }, { rd2: $get("rdFailed"), content: "错" });
                break;
            case "2": //Multiple selection
            case "15": //Grid in
                set_Multiple_Choices_Selection_Value(referenceAnswerWrapperArray, editFlag);
                break;
            case "3": //True Or False
                set_SF_TF_YN_Value(referenceAnswerWrapperArray, { rd1: $get("rdTrue"), content: "对" }, { rd2: $get("rdFalse"), content: "错" });
                break;
            case "4": //Fill-in blank
            case "14":
                set_Multiple_Choices_Selection_Value(referenceAnswerWrapperArray, editFlag);

                break;
            case "8": //Numeric answer
                set_Multiple_Choices_Selection_Value(referenceAnswerWrapperArray, editFlag);
                break;
            case "9": //Yes or No
                set_SF_TF_YN_Value(referenceAnswerWrapperArray, { rd1: $get("rdYes"), content: "对" }, { rd2: $get("rdNo"), content: "错" });
                break;
            default:
                break;
        }

        //活动题
        if ($get("rdAlgorithmYes").checked) {
            hidAlgorithmTxtBox();
            questionAlgorithmWrapperArray = getQuestionAlgorithmWrapperArray();
            $imgLoadingId.style.display = "block";
            checkAlgorithmPrameter(null, null, true);
        } else {
            questionAlgorithmWrapperArray = [];
            //创建预览
            
            createPreviewInfo(referenceAnswerWrapperArray, questionWrapperArray);
        }


    }

    if (sender._activeTabIndex != 3) {
        active_Tab_Index = sender._activeTabIndex;
    }
}
var solutionLoArray = null;
function QM_showSolutionKP() {
    var loids = new Array();
    $("#divQuestionSolution").find("a[type='lo'][loarray]").each(function () {
        loids.addRange($(this).attr("loarray").split(","));
    });

    var loIdArray = loids.uniquelize();

    if (loIdArray && loIdArray.length > 0) {
        $excuteWS("~CmsWS.getLearningObjectiveForLoIds", { loIds: loIdArray, userExtend: simpleUser }, function (r) {
            if (r) {
                if (temp_sLoArray == null) {
                    temp_sLoArray = new Array();
                }
                solutionLoArray = r;

                var html = new Array();
                html.push('<table class="gridviewblue" cellspacing="0" cellpadding="0" width="100%">');
                html.push('<tr class="titlerow"><th class="tableCheckBoxCell" style="text-align:center;width:20px;"></th><th class="tableUnitCell" style="text-align:center;width:70px;">单元</th><th class="tableKnowlegePointCell" style="text-align:left;">知识点</th></tr>');
                for (var k = 0; k < r.length; k++) {
                    if (k % 2 == 0) {
                        html.push('<tr class="oddrow">');
                    } else {
                        html.push('<tr class="evenrow">');
                    }
                    var ckFlag = "";
                    for (var n = 0; n < sLoArray.length; n++) {
                        if (r[k].id == sLoArray[n].loId) {
                            ckFlag = " checked=\"checked\" ";
                            break;
                        }
                    }
                    html.push('<td class="tableCheckBoxCell"><input type="checkbox" loid="' + r[k].id + '" ' + ckFlag + ' onclick="onLoCheckBoxClick(this,\'divSolutionLOs\')"></td>');
                    html.push('<td class="tableUnitCell" style="text-align:center;">' + r[k].unit + '</td>');
                    html.push('<td class="tableKnowlegePointCell" style="text-align:left;">' + r[k].name + '</td>');
                    html.push('</tr>');
                }
                html.push('</table>');
                $.jBox("<div id='divSolutionLOs' style='padding:5px;'>" + html.join('') + "</div>", { id: "jbox_SolutionsKP", title: "解题过程的知识点", width: 600, opacity: 0, buttons: {} });
            }
        }, null, { userContext: "getStudyItemWithLoIds" });
    } else {
        $.jBox("<div style='padding:5px;color:gray;font-size:11px;'>解题过程中还未关联知识点</div>", { id: "jbox_SolutionsKP", title: "解题过程的知识点", width: 600, opacity: 0, buttons: {} });
    }
}

//保存question时 给题型Successed/Failed,True/False,Yes/No设置答案
function set_SF_TF_YN_Value(referenceAnswerWrapperArray, oRd1, oRd2) {
    var referenceAnswerWrapper1 = {};
    referenceAnswerWrapper1.id = oRd1.rd1.value;
    referenceAnswerWrapper1.orderName = null;
    referenceAnswerWrapper1.questionId = questionId;
    referenceAnswerWrapper1.correctFlag = oRd1.rd1.checked ? "1" : "0";
    referenceAnswerWrapper1.content = oRd1.content;
    referenceAnswerWrapper1.feedback = $get("divAnswerFeedback_" + oRd1.rd1.id).innerHTML;


    var referenceAnswerWrapper2 = {};
    referenceAnswerWrapper2.id = oRd2.rd2.value;
    referenceAnswerWrapper2.orderName = null;
    referenceAnswerWrapper2.questionId = questionId;
    referenceAnswerWrapper2.correctFlag = oRd2.rd2.checked ? "1" : "0";
    referenceAnswerWrapper2.content = oRd2.content;
    referenceAnswerWrapper2.feedback = $get("divAnswerFeedback_" + oRd2.rd2.id).innerHTML;

    referenceAnswerWrapperArray.push(referenceAnswerWrapper1);
    referenceAnswerWrapperArray.push(referenceAnswerWrapper2);
}

//保存question时 给题型MultipleChoices,MultipleSelection设置答案
function set_Multiple_Choices_Selection_Value(referenceAnswerWrapperArray, editFlag) {
    var tableMultiple_ChoicesOrSelection = $get("tableMultiple_ChoicesOrSelection");
    if (tableMultiple_ChoicesOrSelection != null && tableMultiple_ChoicesOrSelection != undefined) {
        for (var tbmc = 0; tbmc < tableMultiple_ChoicesOrSelection.rows.length; tbmc++) {
            var orow = tableMultiple_ChoicesOrSelection.rows[tbmc];
            var referenceAnswerWrapper = {};
            referenceAnswerWrapper.id = editFlag == true ? orow.id : randomChars(20);
            referenceAnswerWrapper.orderName = null;
            referenceAnswerWrapper.questionId = questionId;
            var contentControl = tableMultiple_ChoicesOrSelection.rows[tbmc].cells[1].firstChild;
            var contentValue = contentControl.tagName.toUpperCase() != "INPUT" ? contentControl.innerHTML : contentControl.value;
            referenceAnswerWrapper.content = V_A(contentValue);
            referenceAnswerWrapper.feedback = V_A(tableMultiple_ChoicesOrSelection.rows[tbmc].cells[1].lastChild.innerHTML);
            if (orow.cells[0].firstChild.checked) {
                referenceAnswerWrapper.correctFlag = "1";
            }
            referenceAnswerWrapperArray.push(referenceAnswerWrapper);
        }
    }
}


//创建预览信息
function createPreviewInfo(_referenceAnswerWrapperArray, _questionWrapperArray) {
    
    $("#divQuestionPreview").html("&nbsp;");
    if (_questionWrapperArray.length == 0) {
        return;
    }
    var v = $ddlAnswerType.value;
    var tbArray = new Array();
    tbArray.push('<table width="100%" style="line-height:20px;" id="preViewMCMITable1" cellpadding="0"  cellspacing="0">');
    for (var r1 = 0; r1 < _questionWrapperArray.length; r1++) {
        //question
        tbArray.push('<tr>');
        tbArray.push('<td style="width:10px;text-align:right;vertical-align:top;">' + '<b>' + (r1 + 1) + ':</b>' + '</td>');
        tbArray.push('<td style="width:auto;text-align:left;vertical-align:top;">' + A_V(_questionWrapperArray[r1].content) + '</td>');
        tbArray.push('</tr>');

        //referenceAnswer
        tbArray.push('<tr>');
        tbArray.push('<td style="width:10px;text-align:right;">&nbsp;</td>');
        tbArray.push('<td style="width:auto;text-align:left;padding:0px 0px 5px 0px">');
        if (v == "1" || v == "2" || v == "11" || v == "4" || v == "8" || v == "15") {
            if (_referenceAnswerWrapperArray.length > 0) {
                tbArray.push('<table id="preViewTable2" width="auto" cellpadding="0" cellspacing="">');
                for (var r2 = 0; r2 < _referenceAnswerWrapperArray.length; r2++) {
                    if (_referenceAnswerWrapperArray[r2].questionId == _questionWrapperArray[r1].id) {
                        tbArray.push('<tr>');
                        tbArray.push('<td style="vertical-align:top;">');
                        var radioOrCheckboxStr = (v == "2" || v == "11" || v == "4" || v == "8" || v == "15") ? " type=\"checkbox\" " : " type=\"radio\" name=\"rd_referenceAnswer\" ";
                        if (_referenceAnswerWrapperArray[r2].correctFlag == "1") {
                            tbArray.push("<input " + radioOrCheckboxStr + " disabled=\"disabled\" checked=\"checked\" />");
                        } else {
                            tbArray.push("<input " + radioOrCheckboxStr + " disabled=\"disabled\" />");
                        }
                        tbArray.push('</td>');
                        tbArray.push('<td style="vertical-align:top;padding-left:0px;">' + A_V(_referenceAnswerWrapperArray[r2].content) + '</td>');
                        tbArray.push('</tr>');
                    }
                }
                tbArray.push('</table>');
            }
        }
        //else if(v=="11"){}
        else if (v == "3" || v == "9" || v == "13") {
            var referenceAnserContentStr = "";
            for (var raw = 0; raw < _referenceAnswerWrapperArray.length; raw++) {
                if (_referenceAnswerWrapperArray[raw].questionId == _questionWrapperArray[r1].id) {
                    var radioStr = _referenceAnswerWrapperArray[raw].correctFlag == "1" ? "<input name=\"previewRadioGroup\" type=\"radio\" disabled=\"disabled\" checked=\"checked\" />"
                    + _referenceAnswerWrapperArray[raw].content : "<input name=\"previewRadioGroup\" type=\"radio\" disabled=\"disabled\" />" + _referenceAnswerWrapperArray[raw].content;
                    referenceAnserContentStr += radioStr + "&nbsp;&nbsp;";
                }
            }
            tbArray.push(referenceAnserContentStr);
        }
        //        else if(v=="8"){//(v=="4" || v=="8"){}
        tbArray.push('</td>');
        tbArray.push('</tr>');

        //solution
        tbArray.push('<tr>');
        tbArray.push('<td class="pSHHeader1">&nbsp;</td>');
        tbArray.push('<td class="pSHHeader2"><b>解题过程:</b></td>');
        tbArray.push('</tr>');
        tbArray.push('<tr>');
        tbArray.push('<td style="width:10px;text-align:right;">&nbsp;</td>');
        tbArray.push('<td style="width:auto;text-align:left;">' + A_V(_questionWrapperArray[r1].solution) + '</td>');
        tbArray.push('</tr>');

        ////knowledge
        //tbArray.push('<tr>');
        //tbArray.push('<td class="pSHHeader1">&nbsp;</td>');
        //tbArray.push('<td class="pSHHeader2"><b>知识点:</b></td>');
        //tbArray.push('</tr>');
        //tbArray.push('<tr>');
        //tbArray.push('<td style="width:10px;text-align:right;">&nbsp;</td>');
        //tbArray.push('<td style="width:auto;text-align:left;">');

        //if (sLoArray && sLoArray.length > 0) {
        //    var selArr = $("#table_QuestionLos :checkbox:checked").map(function () {
        //        return this.id.replace("cbx_qlo_", "");
        //    }).get();

        //    var arrObjective = [];
        //    var arrPrereqaisite = [];
        //    for (var k = 0; k < sLoArray.length; k++) {
        //        if ($.inArray(sLoArray[k].loId, selArr) != -1) {
        //            arrObjective.push(sLoArray[k]);
        //        } else {
        //            arrPrereqaisite.push(sLoArray[k]);
        //        }
        //    }

        //    tbArray.push('<table cellpadding="2" cellspacing="0" style="color:#1a5fbf;">');
        //    tbArray.push('<tr><td colspan="2" style="color:#000">目标知识点:<td></tr>');
        //    for (var i = 0; i < arrObjective.length; i++) {
        //        tbArray.push('<tr>');
        //        tbArray.push('<td>&nbsp;&nbsp;' + arrObjective[i].loUnit + '</td>');
        //        tbArray.push('<td>' + arrObjective[i].loName + '</td>');
        //        tbArray.push('<tr>');
        //    }
        //    tbArray.push('<tr><td colspan="2" style="color:#000">辅助知识点:<td></tr>');
        //    for (var j = 0; j < arrPrereqaisite.length; j++) {
        //        tbArray.push('<tr>');
        //        tbArray.push('<td>&nbsp;&nbsp;' + arrPrereqaisite[j].loUnit + '</td>');
        //        tbArray.push('<td>' + arrPrereqaisite[j].loName + '</td>');
        //        tbArray.push('<tr>');
        //    }
        //    tbArray.push('</table>');
        //}
        //tbArray.push('</td>');
        //tbArray.push('</tr>');

        //hint
        tbArray.push('<tr>');
        tbArray.push('<td class="pSHHeader1">&nbsp;</td>');
        tbArray.push('<td class="pSHHeader2"><b>提示:</b></td>');
        tbArray.push('</tr>');
        tbArray.push('<tr>');
        tbArray.push('<td style="width:10px;text-align:right;">&nbsp;</td>');
        tbArray.push('<td style="width:auto;text-align:left;">' + A_V(_questionWrapperArray[r1].hint) + '</td>');
        tbArray.push('</tr>');
    }
    tbArray.push('</table>');
    $("#divQuestionPreview").html(tbArray.join(''));


    //--
    var _tloarray = new Array();
    for (var x = 0; x < sLoArray.length; x++) {
        _tloarray.push({ itemId: sLoArray[x].loId, itemName: sLoArray[x].loName, unit: sLoArray[x].loUnit });
    }
    $SHOW_RELATED_LO_addLOToArray(_tloarray);
    $SHOW_RELATED_LO_addMouseHoverEvent("divQuestionPreview");
}

function btnQuestionApplyClick() {

    var tempLoQuestionWrapperArray = new Array();
    loQuestionWrapperArray.sort(function (o1, o2) {
        return o2.loStep - o1.loStep;
    });
    
    if (loQuestionWrapperArray) {
        var loqArray = loQuestionWrapperArray.findAll("loType", "0");
        var loqArray1 = new Array();
        var loqArray2 = new Array();
        if (loqArray) {
            for (k1 = 0; k1 < loQuestionWrapperArray.length; k1++) {
                var arr = loqArray.firstOrDefault("loId", loQuestionWrapperArray[k1].loId);
                if (arr != null) {
                    loqArray1.push(loQuestionWrapperArray[k1]);
                } else {
                    loqArray2.push(loQuestionWrapperArray[k1]);
                }
            }
            tempLoQuestionWrapperArray.addRange(loqArray1);
            tempLoQuestionWrapperArray.addRange(loqArray2);
        }
    }


    for (var l = 0; l < tempLoQuestionWrapperArray.length; l++) {
        if (l == 0) {
            tempLoQuestionWrapperArray[l].loOrder = 0;
        } else {
            if (tempLoQuestionWrapperArray[l].loId != tempLoQuestionWrapperArray[l - 1].loId) {
                tempLoQuestionWrapperArray[l].loOrder = tempLoQuestionWrapperArray[l - 1].loOrder + 1;
            } else {
                tempLoQuestionWrapperArray[l].loOrder = tempLoQuestionWrapperArray[l - 1].loOrder;
            }
        }

    }

    if ($get("ddlActions").value == "create" || $get("ddlActions").value == "copy" || $get("ddlActions").value == "addchild") {
        if ($get("ddlActions").value == "copy" && $get("ddlBookListForCopyQuestion").value != $get("ddlBookList").value && simpleUser.roleId == "2") {
            tempLoQuestionWrapperArray = [];
        }

        CmsWS.saveQuestion(questionWrapperArray, tempLoQuestionWrapperArray, referenceAnswerWrapperArray, simpleUser, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "saveQuestion" }, null);
    } else if ($get("ddlActions").value == "edit") {
        CmsWS.updateQuestion(questionWrapperArray, tempLoQuestionWrapperArray, referenceAnswerWrapperArray, simpleUser, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "updateQuestion" }, null);
    }
}

function btnQuestionCancelClick() {
    if (window.confirm("确定退出当前操作吗?")) {
        clearAllQuestionInfo();
    }
}

//得到一个Question的信息
function getQuestionWrapper() {
    var questionWrapper = {};
    questionWrapper.id = questionId;
    questionWrapper.algorithmFlag = $get("rdAlgorithmYes").checked ? "1" : "0";
    questionWrapper.autoConfirmCorrectFlag = $get("rdAutoGrade").checked ? "1" : "0";
    if (simpleUser.roleId == "2") {
        if (tempBookList != null) {
            for (var b = 0; b < tempBookList.length; b++) {
                if ($get("ddlActions").value == "copy" && simpleUser.roleId == "2") {
                    if ($get("ddlBookListForCopyQuestion").value == tempBookList[b].isbn) {
                        questionWrapper.bookId = tempBookList[b].id;
                        break;
                    }
                }
                else {
                    if ($get("ddlBookList").value == tempBookList[b].isbn) {
                        questionWrapper.bookId = tempBookList[b].id;
                        break;
                    }
                }
            }
        }

    } else {
        questionWrapper.bookId = bookId;
    }
    //if ($get("ddlActions").value == "edit") {
    //    questionWrapper.createdDate = new Date(questionIdArray[0].createdDate);
    //}
    questionWrapper.content = V_A($get("divQuestionBody").innerHTML);
    //questionWrapper.description = $get("divQuestionDescription").innerHTML;
    questionWrapper.exQuestionId = null;
    questionWrapper.flag = "1";
    questionWrapper.groupId = null;
    questionWrapper.hint = V_A($get("divQuestionHint").innerHTML);
    //questionWrapper.instraction = $get("divQuestionInstruction").innerHTML;
    questionWrapper.instructorOnly = $get("rdIsStudentVisibleNo").checked ? "1" : "0";
    questionWrapper.sampleFlag = $get("rdIsSampleQuestionYes").checked ? "1" : "0";
    questionWrapper.thinkFlag = $get("rdIsThinkQuestionYes").checked ? "1" : "0";
    questionWrapper.answerFlag = $get("rdIsAnswerYes").checked ? "1" : "0";
    questionWrapper.orderName = null;
    //questionWrapper.parentId = (questionWrapperArray.length == 0) ? questionWrapper.id : questionWrapperArray[0].id;

    if ($("#ddlActions").val() == "addchild") {
        //var parentQuestionId = $("#div_questions").find("table input[type=checkbox][parentFlag=1]:checked").attr("questionId");
        if (QM_parentQuestionId) {
            questionWrapper.parentId = QM_parentQuestionId;
        }
    } else if (editQuestionParentId != "-1") {
        questionWrapper.parentId = editQuestionParentId;
    } else {
        questionWrapper.parentId = questionId;
    }
    questionWrapper.questionOrder = (questionWrapperArray.length == 0) ? null : questionWrapperArray.length.toString();
    questionWrapper.questionTypeTitle = null;
    questionWrapper.questionTypeId = $ddlAnswerType.value;
    questionWrapper.parentFlag = $get("rdIsParentQuestionYes").checked ? "1" : "0";
    questionWrapper.score = null;
    questionWrapper.solution = V_A($get("divQuestionSolution").innerHTML);
    questionWrapper.structureId = _structureId;
    questionWrapper.subOrderName = null;
    questionWrapper.systemId = simpleUser.SystemId;
    questionWrapper.testQuestionOrder = null;
    questionWrapper.testQuestionOrderName = null;
    questionWrapper.testQuestionTypeDescription = null;
    questionWrapper.testQuestionTypeId = $ddlQuestionType.value;
    questionWrapper.questionLogicTypeId = $get("ddlLogicType").value;

    questionWrapper.difficulty = _ddlDifficult.value.trim() != "" ? _ddlDifficult.value.trim() : null;
//    questionWrapper.thinkFlag = _ddlThinkFlag.value.trim() != "" ? _ddlThinkFlag.value.trim() : 0;


    questionWrapper.discriminator = _txtDiscriminator.value.trim() != "" ? _txtDiscriminator.value.trim() : null;
    questionWrapper.guessFactor = _txtGuessFactor.value;
    questionWrapper.structureType = $("#ddlStructureType").val();
    //questionWrapper.testQuestionTypeTitle = null;
    //questionWrapper.title = $get("divQuestionTitle").innerHTML;
    questionWrapper.questionAnswersFlag = (questionWrapper.parentFlag =="1" || questionWrapper.questionTypeId == "12") ? "0" : "1";
    questionWrapper.userId = simpleUser.userId;
    return questionWrapper;
}

//function formatDateStr(strDate) {
//    var _date = new Date(strDate);
//    if (_date.toString().indexOf("NaN") == -1) {
//        if (_date.format("MM/dd/yyyy HH:mm").toString().indexOf("NaN") == -1) {
//            return _date.format("MM/dd/yyyy HH:mm").toString();
//        } else if (_date.format("yyyy-MM-dd HH:mm:ss").toString().indexOf("NaN") == -1) {
//            return _date.format("yyyy-MM-dd HH:mm:ss").toString();
//        }
//    }
//    var _strDate = strDate.toString().indexOf("NaN") == -1 ? strDate.toString() : "--";
//    return _strDate;
//}

//容器Tabs2里的某一选项卡被激活时
function onActiveTabChanged2(sender, e) {
    if (sender._activeTabIndex == 4) {
        if ($get("divQuestionAnswer").innerHTML == "") {
            $get("divQuestionAnswer").innerHTML = "&nbsp;";
        }
    }

}

function onTable_MultipleChoicesClick() {
    _flag = true;
}

//根据条件answer type生成不同类型的answer
var _flag = false;
function onQuestionAnswerClick(o) {
    if ($get("rdIsParentQuestionYes").checked) {
        return;
    }
    var atv = $ddlAnswerType.value;
    switch (atv) {
        case "1": //单选题 Multiple choices
            createTableMultiple_ChoicesOrSelection(o, atv);
            break;
        case "11": //数学公式题 Math Input
            createTableMultiple_ChoicesOrSelection(o, atv);
            break;
        case "13": //Success/Fail
            if ($get("divSucessFailAnswer") == null && $get("ddlActions").value != "edit" && $get("ddlActions").value != "copy") {
                //hidden_emath_editor();
                editor.hide();
                $get("divQuestionAnswer").innerHTML = "<div id=\"divSucessFailAnswer\" style=\"border:solid 1px #BED7F5;width:99%;height:100%;text-align:left;padding:5px\">"
                + "<div id=\"divAnswerFeedback_rdSucceeded\" style=\"display:none;\"></div>"
                + "<div id=\"divAnswerFeedback_rdFailed\" style=\"display:none;\"></div>"
                + "&nbsp;<input name=\"SuccessedFailGroup\" id=\"rdSucceeded\" type=\"radio\" checked=\"checked\" style=\"cursor:default;\" value=\"" + randomChars(20) + "\" />对"
                + "&nbsp;&nbsp;<img alt=\"添加反馈信息\" title=\"编辑反馈信息\" style=\"cursor:pointer;vertical-align:bottom\" src=\"../Images/feed_edit.png\" onclick=\"addFeedbackForAnswer('divAnswerFeedback_rdSucceeded')\" />"
                + "<br/>&nbsp;<input name=\"SuccessedFailGroup\" id=\"rdFailed\" type=\"radio\" style=\"cursor:default;\" value=\"" + randomChars(20) + "\" />错"
                + "&nbsp;&nbsp;<img alt=\"添加反馈信息\" title=\"编辑反馈信息\" style=\"cursor:pointer;vertical-align:bottom\" src=\"../Images/feed_edit.png\" onclick=\"addFeedbackForAnswer('divAnswerFeedback_rdFailed')\" />"
                + "</div>";
            }
            break;
        case "2": //Multiple selection
        case "15": //Grid in
            createTableMultiple_ChoicesOrSelection(o, atv);
            break;
        case "3": //True Or False
            if ($get("divTrueFalseAnswer") == null && $get("ddlActions").value != "edit" && $get("ddlActions").value != "copy") {
                //hidden_emath_editor();
                editor.hide();
                $get("divQuestionAnswer").innerHTML = "<div id=\"divTrueFalseAnswer\" style=\"border:solid 1px #BED7F5;width:100%;height:100%;text-align:left;padding:5px\">"
                + "<div id=\"divAnswerFeedback_rdTrue\" style=\"display:none;\"></div>"
                + "<div id=\"divAnswerFeedback_rdFalse\" style=\"display:none;\"></div>"
                + "&nbsp;<input name=\"TrueFalseGroup\" id=\"rdTrue\" type=\"radio\" checked=\"checked\" style=\"cursor:default;\" value=\"" + randomChars(20) + "\" />对"
                + "&nbsp;&nbsp;<img alt=\"添加反馈信息\" title=\"编辑反馈信息\" style=\"cursor:pointer;vertical-align:bottom\" src=\"../Images/feed_edit.png\" onclick=\"addFeedbackForAnswer('divAnswerFeedback_rdTrue')\" />"
                + "<br/>&nbsp;<input name=\"TrueFalseGroup\" id=\"rdFalse\" type=\"radio\" style=\"cursor:default;\" value=\"" + randomChars(20) + "\" />错"
                + "&nbsp;&nbsp;<img alt=\"添加反馈信息\" title=\"编辑反馈信息\" style=\"cursor:pointer;vertical-align:bottom\" src=\"../Images/feed_edit.png\" onclick=\"addFeedbackForAnswer('divAnswerFeedback_rdFalse')\" />"
                + "</div>";
            }
            //add_SF_TF_YN_AnswerToDiv({containerDivId:"divTrueFalseAnswer",groupName:"TrueFalseGroup",rdID1:"rdTrue",rdID2:"rdFalse",rdID1Content:"True",rdID2Content:"False"});
            break;
        case "4": //Fill-in blank
        case "14":
            createTableMultiple_ChoicesOrSelection(o, atv);
            //            if($get("txtAreaFillInBlank")==null && $get("ddlActions").value!="edit" && $get("ddlActions").value!="copy"){
            //                $get("divQuestionAnswer").innerHTML="<textarea id=\"txtAreaFillInBlank\"  style=\"width:280px;height:80px\"></textarea>";
            //            }
            break;
        case "8": //Numeric answer
            createTableMultiple_ChoicesOrSelection(o, atv);
            //            if($get("txtNumericAnswer")==null && $get("ddlActions").value!="edit" && $get("ddlActions").value!="copy"){
            //                $get("divQuestionAnswer").innerHTML="<input id=\"txtNumericAnswer\" onkeyup=\"checkNumericAnswer(this.value,this)\" type=\"text\" style=\"width:150px\"/>";
            //            }
            break;
        case "9": //Yes or No
            if ($get("divYesNoAnswer") == null && $get("ddlActions").value != "edit" && $get("ddlActions").value != "copy") {
                //hidden_emath_editor();
                editor.hide();
                $get("divQuestionAnswer").innerHTML = "<div id=\"divYesNoAnswer\" style=\"border:solid 1px #BED7F5;width:100%;height:100%;text-align:left;padding:5px\">"
                + "<div id=\"divAnswerFeedback_rdYes\" style=\"display:none;\"></div>"
                + "<div id=\"divAnswerFeedback_rdNo\" style=\"display:none;\"></div>"
                + "&nbsp;<input name=\"YesNoGroup\" id=\"rdYes\" type=\"radio\" checked=\"checked\" style=\"cursor:default;\" value=\"" + randomChars(20) + "\" />对"
                + "&nbsp;&nbsp;<img alt=\"添加反馈信息\" title=\"编辑反馈信息\" style=\"cursor:pointer;vertical-align:bottom\" src=\"../Images/feed_edit.png\" onclick=\"addFeedbackForAnswer('divAnswerFeedback_rdYes')\" />"
                + "<br/>&nbsp;<input name=\"YesNoGroup\" id=\"rdNo\" type=\"radio\" style=\"cursor:default;\" value=\"" + randomChars(20) + "\" />错"
                + "&nbsp;&nbsp;<img alt=\"添加反馈信息\" title=\"编辑反馈信息\" style=\"cursor:pointer;vertical-align:bottom\" src=\"../Images/feed_edit.png\" onclick=\"addFeedbackForAnswer('divAnswerFeedback_rdNo')\" />"
                + "</div>";
            }
            break;
        default:
            break;
    }
}

function add_SF_TF_YN_AnswerToDiv(obj) {
    if ($get(obj.containerDivId) == null && $get("ddlActions").value != "edit" && $get("ddlActions").value != "copy") {
        //hidden_emath_editor();
        editor.hide();
        $get("divQuestionAnswer").innerHTML = "<div id=\"" + obj.containerDivId + "\" style=\"border:solid 1px #BED7F5;width:100%;height:100%;text-align:center;\">"
        + "<input name=\"" + obj.groupName + "\" id=\"" + obj.rdID1 + "\" type=\"radio\" checked=\"checked\" style=\"cursor:default;\" value=\"" + randomChars(20) + "\" />" + obj.rdID1Content + "&nbsp;&nbsp;&nbsp;"
        + "<input name=\"" + obj.groupName + "\" id=\"" + obj.rdID2 + "\" type=\"radio\" style=\"cursor:default;\" value=\"" + randomChars(20) + "\" />" + rdID2Content + "</div>";
    }
}

//生成Multiple Choices和Multiple Selection
function createTableMultiple_ChoicesOrSelection(o, v) {
    if (_flag == false) {//生成table和第一行
        if (o.firstChild != null && o.firstChild.id == "tableMultiple_ChoicesOrSelection") {
            _flag = false;
            return;
        }
        o.innerHTML = "";
        var tableMultiple_ChoicesOrSelection = document.createElement("table");
        tableMultiple_ChoicesOrSelection.setAttribute("id", "tableMultiple_ChoicesOrSelection");
        tableMultiple_ChoicesOrSelection.setAttribute("width", "100%");
        tableMultiple_ChoicesOrSelection.style.margin = "0px";
        tableMultiple_ChoicesOrSelection.cellSpacing = "0";
        tableMultiple_ChoicesOrSelection.cellPadding = "0";
        tableMultiple_ChoicesOrSelection.bgColor = "#ffffff";
        Sys.UI.DomElement.addCssClass(tableMultiple_ChoicesOrSelection, "MultipleChoices_TABLE");
        $addHandlers(
            tableMultiple_ChoicesOrSelection, {
                click: onTable_MultipleChoicesClick
            }
        );
        createMultiple_ChoicesOrSelectionRow(tableMultiple_ChoicesOrSelection, 0, null, v);
        o.appendChild(tableMultiple_ChoicesOrSelection);

    }
    else {
        _flag = false;
        return;
    }
}

//活动题 鼠标悬停行时改变样式
function onAlgorithmRowMouseOver(r) {
    var algorithmRow = (r.nodeName != null && r.nodeName != undefined && r.nodeName.toUpperCase() == "TR") ? r : this;
    algorithmRow.bgColor = "#eeeeff";
    if (algorithmRow.cells[1].getElementsByTagName("div")[0].getElementsByTagName("input")[0] == null) {
        algorithmRow.cells[1].getElementsByTagName("div")[0].style.border = "solid 1px gray";
        algorithmRow.cells[1].getElementsByTagName("div")[0].style.backgroundColor = "#ffffff";
    }
    algorithmRow.cells[3].getElementsByTagName("div")[0].style.visibility = "visible";
}

//活动题 鼠标离开行时改变样式
function onAlgorithmRowMouseOut(r) {
    var algorithmRow = (r.nodeName != null && r.nodeName != undefined && r.nodeName.toUpperCase() == "TR") ? r : this;
    algorithmRow.bgColor = "";
    algorithmRow.cells[1].getElementsByTagName("div")[0].style.border = "";
    algorithmRow.cells[1].getElementsByTagName("div")[0].style.backgroundColor = "";
    algorithmRow.cells[3].getElementsByTagName("div")[0].style.visibility = "hidden";

}

var lastAlgorithmContentDivId = null;
function onAlgorithmContentDivClick(o, event) {
    $("#ddlSysFunction").hide();
    var txtAlgorithmContent = $get("txtAlgorithmContent");
    var currentDivHtml = $.trim($(o).text()); //getBrowerVersion() == 1 ? o.innerText : o.textContent;
    //var currentDivHtml = otxt != " " ? otxt : "";
    if (lastAlgorithmContentDivId != null) {
        if (o.id != lastAlgorithmContentDivId) {
            var txtAlgorithmContentValue = txtAlgorithmContent.value;
            //            var otxt=getBrowerVersion()==1 ? o.innerText : o.textContent;
            //            var currentDivHtml=otxt!=" " ? otxt : "";
            o.innerHTML = "";
            o.appendChild(txtAlgorithmContent);
            txtAlgorithmContent.value = currentDivHtml;
            //            if (getBrowerVersion() == 1) {
            //                $get(lastAlgorithmContentDivId).innerText = txtAlgorithmContentValue != "" ? txtAlgorithmContentValue : " ";
            //            } else {
            //                $get(lastAlgorithmContentDivId).textContent = txtAlgorithmContentValue != "" ? txtAlgorithmContentValue : " ";
            //            }
            if ($.trim(txtAlgorithmContentValue) != "") {
                $("#" + lastAlgorithmContentDivId).text(txtAlgorithmContentValue);
            } else {
                $("#" + lastAlgorithmContentDivId).html("&nbsp;");
            }
            // $("#" + lastAlgorithmContentDivId).text(txtAlgorithmContentValue != "" ? txtAlgorithmContentValue : " ");
            lastAlgorithmContentDivId = o.id;
        }
    } else {
        o.innerHTML = "";
        o.appendChild(txtAlgorithmContent);
        txtAlgorithmContent.value = currentDivHtml;
        lastAlgorithmContentDivId = o.id;
    }
    txtAlgorithmContent.focus();
    $get("ddlSysFunction").style.left = (event.clientX ? event.clientX : event.layerX) + "px";
    $get("ddlSysFunction").style.top = event.clientY + 5 + "px"; //xtAlgorithmContent.offsetTop +txtAlgorithmContent.offsetHeight;
}

//添加活动题参数
function createAlgorithmRow(o) {
    var qaw = (typeof arguments[1] != 'undefined' && arguments[1] != null && o == null) ? arguments[1] : -1; //-1为新添加一行,否则根据现有数据生成行
    var tableAlgorithmInfo = $get("tableAlgorithmInfo");
    var rowIndexFlag = (typeof arguments[2] != 'undefined') && arguments[2] != null ? true : false; //若有第三个参数且值存在，行号rowindex就使用该值，否则默认-1即新添加
    var rowIndex = rowIndexFlag && qaw != -1 ? arguments[2] : -1;

    if (qaw == -1) {
        rowIndex = typeof (o) != "number" ? o.parentNode.parentNode.parentNode.rowIndex + 1 : o;
    }

    var qpName = qaw != -1 && !rowIndexFlag ? qaw.qpName : getAPName();
    $get("spAlgorimSeedName").innerHTML = getAPName(true);
    var algorithmId = qaw != -1 && !rowIndexFlag ? qaw.id : randomChars(20);
    var tr_AlgorithmRow = tableAlgorithmInfo.insertRow(rowIndex);
    tr_AlgorithmRow.setAttribute("id", "trAlgorithmRow_" + algorithmId);
    Sys.UI.DomElement.addCssClass(tr_AlgorithmRow, "tdAlgorithmName");
    $addHandlers(
       tr_AlgorithmRow, {
           mouseover: onAlgorithmRowMouseOver,
           mouseout: onAlgorithmRowMouseOut
       }
    );

    var td1_AlgorithmCell = tr_AlgorithmRow.insertCell(-1);
    td1_AlgorithmCell.style.paddingLeft = "5px";
    Sys.UI.DomElement.addCssClass(td1_AlgorithmCell, "tdAlgorithmName");
    td1_AlgorithmCell.innerHTML = qpName;
    var td2_AlgorithmCell = tr_AlgorithmRow.insertCell(-1);
    Sys.UI.DomElement.addCssClass(td2_AlgorithmCell, "tdAlgorithmContent");

    var algorithmContent = qaw != -1 ? qaw.qpFuction : "&nbsp;";
    algorithmContent = algorithmContent != "" ? algorithmContent : "&nbsp;";
    algorithmContent = algorithmContent.replace(/\>/gi, "&gt;");
    algorithmContent = algorithmContent.replace(/\</gi, "&lt;");
    td2_AlgorithmCell.innerHTML = '<div style="cursor:text;width:672px;margin:0px;padding:0px;word-wrap:break-word;word-break:break-all;" id="' + algorithmId + '" onclick="onAlgorithmContentDivClick(this,event)">' + algorithmContent + '</div>';
    var td3_AlgorithmCell = tr_AlgorithmRow.insertCell(-1);
    Sys.UI.DomElement.addCssClass(td3_AlgorithmCell, "tdAlgorithmPreView");
    td3_AlgorithmCell.innerHTML = '<span style="color:Gray">未检查</span>';
    var td4_AlgorithmCell = tr_AlgorithmRow.insertCell(-1);
    Sys.UI.DomElement.addCssClass(td4_AlgorithmCell, "tdAlgorithmTool");
    td4_AlgorithmCell.innerHTML = '<div style="visibility:hidden;height:3px;margin:0px;"><img alt="添加行" title="添加行" style="cursor:pointer;" src="../CMS/Images/application_add.png" onclick="createAlgorithmRow(this)" />&nbsp;'
    + '<img alt="删除行" title="删除行" style="cursor:pointer;" src="../CMS/Images/application_delete.png" onclick="deleteAlgorithmRow(this)" />&nbsp;'
    + '<img alt="检查参数" title="检查参数" style="cursor:pointer;" src="../CMS/Images/application_get.png" onclick="checkAlgorithmPrameter(this)" /></div>&nbsp;';
}

//检查活动题参数
function checkAlgorithmPrameter(o) {
    hidAlgorithmTxtBox();
    var _questionAlgorithmWrapperArray = [];
    if (arguments.length > 1) {
        var previewFlag = (arguments[2] != null && arguments[2] != undefined && arguments[2] == true) ? true : false;
        _questionAlgorithmWrapperArray = getQuestionAlgorithmWrapperArray();
        //doCheckQuestionAlgorithmValues(_questionAlgorithmWrapperArray, questionId, null, previewFlag);
        
        if (previewFlag) {
        
            CmsWS.getQuestionView(questionWrapperArray[0], referenceAnswerWrapperArray, _questionAlgorithmWrapperArray, simpleUser, function (r) {
                if (r && r.length == 2) {
                    onQuestionAndReferenceAnswersChanageSuccessed([r[1], [r[0]]], "--");
                    $imgLoadingId.style.display = "none";
                }
            }, onQuestionManagePageFailed, { userContext: "getQuestionView" }, null);
        } else {
            doCheckQuestionAlgorithmValues(_questionAlgorithmWrapperArray, questionId, null, previewFlag);
        }
    }
    else {
        var row = o.parentNode.parentNode.parentNode;
        _questionAlgorithmWrapperArray.push(getQuestionAlgorithmWrapper(row));
        doCheckQuestionAlgorithmValues(_questionAlgorithmWrapperArray, questionId, row.lastChild.previousSibling);
    }
}

function getQuestionAlgorithmWrapperArray() {
    var qaArray = [];
    var tableAlgorithmInfo = $get("tableAlgorithmInfo");
    for (var r = 1; r < tableAlgorithmInfo.rows.length; r++) {
        var row = tableAlgorithmInfo.rows[r];
        var qaw1 = getQuestionAlgorithmWrapper(row, null);
        qaw1.qpSeedFlag = "0";
        qaArray.push(qaw1);
    }

    if (replaceAllSpaceToEmpty($get("divAlgorithmSeedContentInfo").innerHTML) != "") {
        var qaw2 = getQuestionAlgorithmWrapper($get("tableAlgorithmSeedInfo").rows[1], null)
        qaw2.qpSeedFlag = "1";
        qaArray.push(qaw2);
    }
    return qaArray;
}

function getQuestionAlgorithmWrapper(row) {
    var questionAlgorithmWrapper = {};
    var questionAlgorithmWrapperId = row.id.substring(row.id.lastIndexOf("_") + 1);
    questionAlgorithmWrapper.id = questionAlgorithmWrapperId;
    questionAlgorithmWrapper.parentId = questionAlgorithmWrapperId;
    $row = $(row);
    var qpName = $row.find("td:eq(0)").text();
    //var qpName=getBrowerVersion()==1 ? row.firstChild.innerText : row.firstChild.textContent;
    qpName = V_A(qpName);
    questionAlgorithmWrapper.qpName = qpName;
    var qpFuction = $row.find("td:eq(1)").text();
    //var qpFuction=getBrowerVersion()==1 ? row.firstChild.nextSibling.innerText : row.firstChild.nextSibling.textContent;
    questionAlgorithmWrapper.qpFuction = V_A(qpFuction);
    questionAlgorithmWrapper.questionFunctionId = null;
    if (arguments.length == 1) {
        var loaderimg = ($get("ddlActions").value != "edit" && $get("ddlActions").value != "copy") ? '<img alt="loading..." src="../Images/ajax-loader_01.gif" />' : "Uncheck";
        row.lastChild.previousSibling.innerHTML = '<center>' + loaderimg + '</center>';
    }
    return questionAlgorithmWrapper;
}

//自动生成活动题参数名
function getAPName(seedFlag) {
    var tableAlgorithmInfo = $get("tableAlgorithmInfo");
    var maxIndex = 0;
    for (var r = 1; r < tableAlgorithmInfo.rows.length; r++) {
        var td1txt = tableAlgorithmInfo.rows[r].cells[0].innerHTML;
        //        var pIndex=td1txt.substring(td1txt.indexOf("@V")+2,td1txt.lastIndexOf("@"));
        var pIndex = td1txt.substring(1);
        if (parseInt(pIndex) > maxIndex) {
            maxIndex = pIndex;
        }
    }
    if (seedFlag) {
        return "V" + (parseInt(maxIndex) + 2);
    } else {
        return "V" + (parseInt(maxIndex) + 1);
    }
}

//隐藏活动题中的文本框
function hidAlgorithmTxtBox() {
    if (lastAlgorithmContentDivId != null) {
        var content = $get("txtAlgorithmContent").value;
        if ($get("_divAlgorithmContent") == null) {
            var _divAlgorithmContent = document.createElement("DIV");
            _divAlgorithmContent.setAttribute("id", "_divAlgorithmContent")
            _divAlgorithmContent.style.display = "none";
            _divAlgorithmContent.appendChild($get("txtAlgorithmContent"));
            document.body.appendChild(_divAlgorithmContent);
        } else {
            $get("_divAlgorithmContent").innerHTML = "";
            $get("_divAlgorithmContent").appendChild($get("txtAlgorithmContent"));
        }
        content = content != "" ? content : " ";
        //        if (getBrowerVersion() == 1) {
        //            $get(lastAlgorithmContentDivId).innerText = content;
        //        } else {
        //            $get(lastAlgorithmContentDivId).textContent = content;
        //        }
        $("#" + lastAlgorithmContentDivId).text(content);
        lastAlgorithmContentDivId = null;
    }
}

//删除活动题参数
function deleteAlgorithmRow(o) {
    var tableAlgorithmInfo = $get("tableAlgorithmInfo");
    var row = o.parentNode.parentNode.parentNode;
    var rowIndex = row.rowIndex;
    if (rowIndex == 1 || (row.cells[1].firstChild.firstChild.id != undefined && row.cells[1].firstChild.firstChild.id == "txtAlgorithmContent")) {
        hidAlgorithmTxtBox();
    }
    tableAlgorithmInfo.deleteRow(rowIndex);

    if (tableAlgorithmInfo.rows.length == 1) {
        createAlgorithmRow(1);
    }
}

//单选题  鼠标悬停行时改变样式
function onMultipleChoicesRowMouseOver() {
    if (this.lastChild.firstChild.firstChild.style.display == "none") {
        this.lastChild.firstChild.firstChild.style.display = "block";
    }

    if (this.bgColor != "#eeeeff") {
        this.bgColor = "#eeeeff";
    }

    //    if (this.firstChild.nextSibling.firstChild.style.border != "solid 1px gray" && this.firstChild.nextSibling.firstChild.firstChild != null && this.firstChild.nextSibling.firstChild.firstChild.id != "div_IframeEditor") {
    //        this.firstChild.nextSibling.firstChild.style.border = "solid 1px gray";
    //        this.firstChild.nextSibling.firstChild.style.backgroundColor = "#ffffff";
    //    }
}

//单选题  鼠标离开行时改变样式
function onMultipleChoicesRowMouseOut() {
    if (this.lastChild.firstChild.firstChild.style.display != "none") {
        this.lastChild.firstChild.firstChild.style.display = "none";
    }

    if (this.bgColor != "#ffffff") {
        this.bgColor = "#ffffff";
    }

    if (this.firstChild.nextSibling.firstChild.style.border != "") {
        this.firstChild.nextSibling.firstChild.style.border = "";
        this.firstChild.nextSibling.firstChild.style.backgroundColor = "";
    }
}

//单选题 添加行
function addMultipleChoicesRow(o, v) {
    var tableMultiple_ChoicesOrSelection = $get("tableMultiple_ChoicesOrSelection");
    var tr_MultipleChoices = o.parentNode.parentNode.parentNode.parentNode;
    var rowIndex = tr_MultipleChoices.rowIndex + 1;
    createMultiple_ChoicesOrSelectionRow(tableMultiple_ChoicesOrSelection, rowIndex, null, v);
}

//单选题 删除行
function deleteMultipleChoicesRow(o) {
    if (window.confirm("确定删除当前项吗?")) {
        editor.hide();
        var tableMultiple_ChoicesOrSelection = $get("tableMultiple_ChoicesOrSelection");
        var tr_MultipleChoices = o.parentNode.parentNode.parentNode.parentNode;
        //        if (tr_MultipleChoices.firstChild.nextSibling.firstChild.firstChild.id == "div_IframeEditor") {
        //            //hidden_emath_editor();
        //            editor.hide();
        //        }
        var rowIndex = tr_MultipleChoices.rowIndex;
        tableMultiple_ChoicesOrSelection.deleteRow(rowIndex);
        if (tableMultiple_ChoicesOrSelection.rows.length == 0) {
            $get("divQuestionAnswer").innerHTML = "&nbsp;";

        }


    }
}

//单选题中创建行 选项
function createMultiple_ChoicesOrSelectionRow(tableMultiple_ChoicesOrSelection, rowIndex) {
    var answerContent = (arguments[2] != null && arguments[2] != undefined) ? arguments[2] : null; //answerContent不为空为编辑，否则为创建

    var tr_MultipleChoices = tableMultiple_ChoicesOrSelection.insertRow(rowIndex);
    if (answerContent != null) {
        tr_MultipleChoices.setAttribute("id", answerContent.id);
    }

    $addHandlers(
         tr_MultipleChoices, {
             mouseover: onMultipleChoicesRowMouseOver,
             mouseout: onMultipleChoicesRowMouseOut
         }
      );
    var td1_MultipleChoices = tr_MultipleChoices.insertCell(-1);
    Sys.UI.DomElement.addCssClass(td1_MultipleChoices, "MultipleChoices_TD1");
    var checkedStr = (answerContent != null && answerContent.correctFlag == "1") || arguments[3] == "15" ? ' checked="checked" ' : "";
    var radioOrCheckBoxStr = (arguments[3] != null && arguments[3] != undefined && (arguments[3] == "2" || arguments[3] == "15" || arguments[3] == "11" || arguments[3] == "4" || arguments[3] == "8")) ? '<input type="checkbox" ' + checkedStr + ' />' : '<input type="radio" name="rdMultipleChoicesGroup"' + checkedStr + ' />';
    td1_MultipleChoices.innerHTML = radioOrCheckBoxStr;

    var td2_MultipleChoices = tr_MultipleChoices.insertCell(-1);
    Sys.UI.DomElement.addCssClass(td2_MultipleChoices, "MultipleChoices_TD2");
    var contentStr = (answerContent != null && answerContent.content != "") ? answerContent.content : "&nbsp;";
    var feedbackStr = (answerContent != null && answerContent.feedback != "") ? answerContent.feedback : "&nbsp;";
    var randomCharsId = randomChars(20);
    if (arguments[3] != "8") {
        td2_MultipleChoices.innerHTML = '<div class="td2_MultipleChoicesContent" id="' + randomCharsId + '" title="点击这里进行编辑" style="width:auto;height:100%" onclick="onQustionDivClick(this)">' + contentStr + '</div><div id="divAnswerFeedback_' + randomCharsId + '" style="display:none;">' + feedbackStr + '</div>';
    } else {
        td2_MultipleChoices.innerHTML = '<input type="text" onkeyup="checkNumericAnswer(this.value,this)" class="td2_MultipleChoicesContent" id="' + randomCharsId + '" title="点击这里进行编辑" style="width:99.2%;height:100%" value="' + contentStr + '"/><div id="divAnswerFeedback_' + randomCharsId + '" style="display:none;">' + feedbackStr + '</div>';
    }

    var td3_MultipleChoices = tr_MultipleChoices.insertCell(-1);
    Sys.UI.DomElement.addCssClass(td3_MultipleChoices, "MultipleChoices_TD3");
    td3_MultipleChoices.innerHTML = '<div class="td3_MultipleChoicesTool"><div style="display:none;"><img alt="添加行" title="添加行" style="cursor:pointer;" src="../CMS/Images/application_add.png" onclick="addMultipleChoicesRow(this,\'' + arguments[3] + '\')"/>&nbsp;&nbsp;<img alt="删除行" title="删除行" style="cursor:pointer;" src="../CMS/Images/application_delete.png" onclick="deleteMultipleChoicesRow(this)"/>&nbsp;&nbsp;<img alt="添加反馈信息" title="编辑反馈信息" style="cursor:pointer;" src="../Images/feed_edit.png" onclick="addFeedbackForAnswer(\'divAnswerFeedback_' + randomCharsId + '\')" /></div></div>&nbsp;';

}

//function onFeedBackMouseOver(fid,evt){
//    var feedbackDIV=$get(fid);
//    feedbackDIV.style.position="absolute";
//    feedbackDIV.style.border="solid 1px black";
//    feedbackDIV.style.width="400px";
//    feedbackDIV.style.left=evt.x-400;
//    feedbackDIV.style.top=evt.y;
//    feedbackDIV.style.padding="2px";
//    feedbackDIV.style.backgroundColor="rgb(255,255,225)";
//    feedbackDIV.style.display="block";
//}

//function onFeedBackMouseOut(fid)
//{
//    $get(fid).style.display="none";
//}

//显示给答案添加注释的控件
var currentHidAnswerFeedbackStrId = null;
function addFeedbackForAnswer(hidId) {
    $get("divEnableOthers").style.display = $get("divAnswerFeedback").style.display = "block";
    currentHidAnswerFeedbackStrId = hidId;
    //hidden_emath_editor();
    editor.hide();
    $get("divAnswerFeedbackContent").innerHTML = $get(hidId).innerHTML;
    //onQustionDivClick($get("divAnswerFeedbackContent"));
}

//取消添加答案注释
function onBtnAnswerFeedbackCancel() {
    $get("divEnableOthers").style.display = $get("divAnswerFeedback").style.display = "none";
    //    $get("Question_divEmathEditor").style.zIndex = $get("Question_divEmathEditor").style.position = "";
}

//提交给答案添加的注释
function onBtnAnswerFeedbackConfirm() {
    $get("divEnableOthers").style.display = $get("divAnswerFeedback").style.display = "none";
    //    $get("Question_divEmathEditor").style.zIndex = $get("Question_divEmathEditor").style.position = "";
    //hidden_emath_editor();
    editor.hide();
    $get(currentHidAnswerFeedbackStrId).innerHTML = $get("divAnswerFeedbackContent").innerHTML;
}

//添加QuestionLO 动态往table中添加行
function createQuestionLosRow(questionLo, targetLoFlag) {
    var isTargetLo = targetLoFlag ? arguments[1] : false;
    if (questionLo != null && questionLo != undefined) {
        var table_QuestionLos = $get("table_QuestionLos");
        var tr_QuestionLos = table_QuestionLos.insertRow(-1);
        tr_QuestionLos.setAttribute("id", "tr_QuestionLos_" + questionLo.loId);
        var td1_QuestionLos = tr_QuestionLos.insertCell(-1);
        Sys.UI.DomElement.addCssClass(td1_QuestionLos, "QuestionLos_TD1");
        td1_QuestionLos.innerHTML = questionLo.loUnit;

        var td2_QuestionLos = tr_QuestionLos.insertCell(-1);
        Sys.UI.DomElement.addCssClass(td2_QuestionLos, "QuestionLos_TD2");

        td2_QuestionLos.innerHTML = "<span style=\"color:#1a5fbf;cursor:pointer;\" onclick=\"QM_ShowKPDetails('" + questionLo.loId + "')\">" + questionLo.loName + "</span>";

        var td3_QuestionLos = tr_QuestionLos.insertCell(-1);
        Sys.UI.DomElement.addCssClass(td3_QuestionLos, "QuestionLos_TD3");
        td3_QuestionLos.style.paddingTop = td3_QuestionLos.style.paddingBottom = "2px";
        var txt_qlo_value = ($get("ddlActions").value == "edit" || $get("ddlActions").value == "copy") && questionLo.probability != null ? questionLo.probability : "";
        td3_QuestionLos.innerHTML = "<input type=\"text\" step=\"" + questionLo.loStep + "\" value=\"" + txt_qlo_value + "\" id=\"txt_qlo_" + questionLo.loId + "\" style=\"width:40px\" />";

        var td4_QuestionLos = tr_QuestionLos.insertCell(-1);
        Sys.UI.DomElement.addCssClass(td4_QuestionLos, "QuestionLos_TD4");
        var cbx_qlo_checkedStr = isTargetLo == true ? " checked=\"checked\" " : "";
        td4_QuestionLos.innerHTML = "<input type=\"checkbox\" id=\"cbx_qlo_" + questionLo.loId + "\" " + cbx_qlo_checkedStr + "/>";


        var td6_QuestionLos = tr_QuestionLos.insertCell(-1);
        Sys.UI.DomElement.addCssClass(td6_QuestionLos, "QuestionLos_TD6");
        var html = [];
        html.push("<select>");

        html.push("<option value='-1'>选择认知</option>");
        html.push(String.format("<option value='{0}' {1}>{0} 记忆</option>", 1, questionLo.cognitiveType == "1" ? "selected='true'" : ""));
        html.push(String.format("<option value='{0}' {1}>{0} 理解</option>", 2, questionLo.cognitiveType == "2" ? "selected='true'" : ""));
        html.push(String.format("<option value='{0}' {1}>{0} 应用</option>", 3, questionLo.cognitiveType == "3" ? "selected='true'" : ""));
        html.push(String.format("<option value='{0}' {1}>{0} 分析</option>", 4, questionLo.cognitiveType == "4" ? "selected='true'" : ""));
        html.push(String.format("<option value='{0}' {1}>{0} 评价</option>", 5, questionLo.cognitiveType == "5" ? "selected='true'" : ""));
        html.push(String.format("<option value='{0}' {1}>{0} 创造</option>", 6, questionLo.cognitiveType == "6" ? "selected='true'" : ""));
        html.push("</select>");
        td6_QuestionLos.innerHTML = html.join("");

        var td5_QuestionLos = tr_QuestionLos.insertCell(-1);
        Sys.UI.DomElement.addCssClass(td5_QuestionLos, "QuestionLos_TD5");
        td5_QuestionLos.innerHTML = "<img alt=\"删除\" title=\"删除\" style=\"cursor:pointer\" src=\"../CMS/Images/application_delete.png\" onclick=\"deleteQuestionLosRow('" + questionLo.loId + "',null)\"/>"

    }
}

//删除QuestionLo  删除table中的行
function deleteQuestionLosRow(loId) {

    for (var dlo = 0; dlo < sLoArray.length; dlo++) {
        if (loId == sLoArray[dlo].loId) {
            sLoArray.splice(dlo, 1);
            var rowIndex = $get("tr_QuestionLos_" + loId).rowIndex;
            $get("table_QuestionLos").deleteRow(rowIndex);
            if (arguments.length == 2) {
                $("#divLOs,#divSolutionLOs").find("input[loid='" + loId + "'][type='checkbox']:checked").removeAttr("checked");

                //                var cbx_tablelos = $get("divLOs").getElementsByTagName("input");
                //                for (var k = 0; k < cbx_tablelos.length; k++) {
                //                    if (cbx_tablelos[k].id == "cbx_lo_" + loId && cbx_tablelos[k].type == "checkbox" && cbx_tablelos[k].checked) {
                //                        cbx_tablelos[k].checked = false;
                //                        break;
                //                    }
                //                }
            }
            if (sLoArray.length == 0) {
                $get("trQuestionLoNoInfo").style.display = "block";
            }
            break;
        }
    }

}

//验证Multiple Choices和Multiple Selction
function multiple_ChoicesOrSelection_CorrectFlag() {
    var btnMutiple_ChoicesOrSelection = $get("divQuestionAnswer").getElementsByTagName("input");
    for (var rd = 0; rd < btnMutiple_ChoicesOrSelection.length; rd++) {
        if (btnMutiple_ChoicesOrSelection[rd].checked) {
            return true;
        }
    }

    return false;
}

//验证question信息
function getValidatedQuestionInfo() {
    var errorInfo = new Sys.StringBuilder();
    var errorIndex = 0;
    var bo = true;
    errorInfo.append("错误信息:<br/>");

    if ($ddlAnswerType.value == "-1") {
        errorIndex++; //2
        errorInfo.append(errorIndex + ". 请选择该题的答案类型<br/>"); //errorInfo.append(errorIndex + ":The answer type have not be selected yet,please do it<br/>");
        bo = false;
    }



    if (_ddlDifficult.value == "-1") {
        errorIndex++;
        errorInfo.append(errorIndex + ". 请选择该题的难度系数<br/>"); //errorInfo.append(errorIndex + ":The difficult have not be selected yet,please do it<br/>");
        bo = false;
    }



    var bodyHTML = $get("divQuestionBody").innerHTML;
    if (replaceAllSpaceToEmpty(bodyHTML) == "") {
        errorIndex++;
        errorInfo.append(errorIndex + ". 请填写题的内容<br/>"); //errorInfo.append(errorIndex + ":Empty question body - required<br/>")
        bo = false;
    }

    if ($ddlAnswerType.value != "14" && !$get("rdIsParentQuestionYes").checked && $ddlAnswerType.value != "6") {

        var answerHTML = $get("divQuestionAnswer").innerHTML;
        if (replaceAllSpaceToEmpty(answerHTML) == "") {
            errorIndex++;
            errorInfo.append(errorIndex + ". 请添加该题答案<br/>"); //errorInfo.append(errorIndex + ":No answer choices - required<br/>")
            bo = false;
        }
    }

    var correctFlag = false;
    if ($get("rdIsParentQuestionYes").checked) {
        correctFlag = true;
    } else {
        switch ($ddlAnswerType.value) {
            case "1": //单选题 Multiple choices
                correctFlag = multiple_ChoicesOrSelection_CorrectFlag();
                break;
            case "11": //数学公式题 Math Input
                correctFlag = multiple_ChoicesOrSelection_CorrectFlag();
                //            if($get("divQuestionAnswer").firstChild!=null && $get("divQuestionAnswer").firstChild.id!=undefined && replaceAllSpaceToEmpty($get("divQuestionAnswer").firstChild.innerHTML)!="")
                //            {
                //                correctFlag=true;
                //            }
                break;
            case "13": //Success/Fail
                if ($get("divSucessFailAnswer") != null) {
                    correctFlag = true;
                }
                break;
            case "2": //Multiple selection
                correctFlag = multiple_ChoicesOrSelection_CorrectFlag();
                break;
            case "3": //True Or False
                if ($get("divTrueFalseAnswer") != null) {
                    correctFlag = true;
                }
                break;
            case "4": //Fill-in blank
                correctFlag = multiple_ChoicesOrSelection_CorrectFlag();
                //            if($get("ddlActions").value!="edit" && $get("ddlActions").value!="copy"){
                //                if($get("txtAreaFillInBlank")!=null && replaceAllSpaceToEmpty($get("txtAreaFillInBlank").value)!="")
                //                {
                //                    correctFlag=true;
                //                }
                //            }
                //            else{
                //                if($get("divQuestionAnswer").firstChild!=null && $get("divQuestionAnswer").firstChild.id!=undefined && replaceAllSpaceToEmpty($get("divQuestionAnswer").firstChild.value)!="")
                //                {
                //                    correctFlag=true;
                //                }
                //            }
                break;
            case "8": //Numeric answer
                correctFlag = multiple_ChoicesOrSelection_CorrectFlag();
                //            if($get("ddlActions").value!="edit" && $get("ddlActions").value!="copy"){
                //                if($get("txtNumericAnswer")!=null && replaceAllSpaceToEmpty($get("txtNumericAnswer").value)!="")
                //                {
                //                    correctFlag=true;
                //                }
                //            }else{
                //                if($get("divQuestionAnswer").firstChild!=null && $get("divQuestionAnswer").firstChild.id!=undefined && replaceAllSpaceToEmpty($get("divQuestionAnswer").firstChild.value)!="")
                //                {
                //                    correctFlag=true;
                //                }
                //            }
                break;
            case "9": //Yes or No
                if ($get("divYesNoAnswer") != null) {
                    correctFlag = true;
                }
                break;
            case "14":
                correctFlag = true;
            default:
                break;
        }
    }
    if (!correctFlag) {
        errorIndex++;
        errorInfo.append(errorIndex + ":请为该题指定正确答案<br/>"); //errorInfo.append(errorIndex + ":No correct answer specified - required<br/>");
    }


    //var qlo_Flag = false;
    //if (sLoArray.length == 0) {
    //    errorIndex++;
    //    errorInfo.append(errorIndex + ". 缺少该题所涉及或关联的知识点(此项可选)<br/>"); //errorInfo.append(errorIndex + ":Missing knowledge information(what the question is about or related to) - optional<br/>");
    //    qlo_Flag = true;
    //} else {
    //    var targetLoFlag = false;
    //    var table_QuestionLos = $get("table_QuestionLos");
    //    var totalProbability = 0;
    //    var f = false;
    //    for (var tlo = 2; tlo < table_QuestionLos.rows.length; tlo++) {
    //        var cbxIsTarget = table_QuestionLos.rows[tlo].cells[3].firstChild;
    //        var txtProbability = table_QuestionLos.rows[tlo].cells[2].firstChild;
    //        //totalProbability+=parseFloat(txtProbability.value);
    //        totalProbability = add(totalProbability, parseFloat(txtProbability.value));
    //        if (parseFloat(txtProbability.value) == 0) {
    //            f = true;
    //        }
    //        if (cbxIsTarget.checked) {
    //            targetLoFlag = true;
    //        }
    //    }


    //    if (totalProbability != 1 || f) {
    //        errorIndex++;
    //        errorInfo.append(errorIndex + ". 知识点权重不正确，请仔细检查<br/>"); //errorInfo.append(errorIndex + ":The probabilities of knowledge points are incorrect.<br/>");
    //        bo = false;
    //    }

    //    if (!targetLoFlag) {
    //        errorIndex++;
    //        errorInfo.append(errorIndex + ". 该题的知识点权重还没有设置目标知识点<br/>"); //errorInfo.append(errorIndex + ":The knowledges of this question have not set target knowledge<br/>");
    //        bo = false;
    //        //            qlo_Flag=true;
    //    }
    //}

    if (errorIndex != 0) {
        //  if (errorIndex == 1 && qlo_Flag) {
        return { content: "<div id=\"divQloErrorInfo\" style=\"color:red;line-height:30px;\">" + errorInfo.toString() + "</div>", flag: (!correctFlag && bo ? true : false) };
        //        }
        //        else {
        //            return "<div style=\"color:red;line-height:30px;\">" + errorInfo.toString() + "</div>";
        //        }
    } else {
        return null;
    }

}

//替换所有空格('&nbsp'或' ')
function replaceAllSpaceToEmpty(objStr) {
    return objStr.replace(/\s|　|&nbsp(;)?/gi, "");
}

//点击div加入编辑器
var editor = null;
function onQustionDivClick(currentDIV) {
    
    editor.edit_container = currentDIV;
    editor.hide();
    editor.upload_path = "../Uploads/CMS/" + emath_editor_bookId;
    editor.show();
    $find(qPrefix + "QuestionManage1_Tabs1").set_activeTabIndex(1);
    //    //var currentDIV=arguments.length==1 ? arguments[0] : this;
    //    //    if ($("#ddlAnswerType").val() == "6" && currentDIV.id != "divQuestionBody") {
    //    //        return;
    //    //    }
    //    currentDIV.style.overflow = "hidden";
    //    if (currentDIV.id != "divAnswerFeedbackContent") {
    //        create_emath_editor({ editorContainer: currentDIV, width: "100%", height: "250px" });
    //    } else {

    //        $get("Question_divEmathEditor").style.zIndex = "101";
    //        $get("Question_divEmathEditor").style.position = "fixed";
    //        create_emath_editor({ editorContainer: currentDIV, width: "100%", height: "170px" });
    //    }
}

//改变bookstructure位置
function onBookStructureChange() {
    if ($get("div_bookStructureChange").lastChild != $get("div_tree")) {
        //$get("div_bookStructureChange").insertBefore($get("div_tree"),$get("divBookStructureChangeTool"));
        if ($get("ddlActions").value != "copy" || simpleUser.roleId == "0") {
            //$get("divBookStructureOfQuestion").innerHTML = getTreeMenuHTML(treeResult, 1, 2);
            QM_buildRelationTree($("#divBookStructureOfQuestion"), treeResult[0], $("#ddlBookList").val());
        } else {
            if (simpleUser.roleId == "2") {
                $get("divBookStructureOfQuestion").innerHTML = "<center><img alt=\"loading...\" src=\"../Images/ajax-loader_b.gif\" /></center>";
                bindBookContentStructureListToTree(null, $get("ddlBookListForCopyQuestion").value, null, simpleUser);
            } else {
                //$get("divBookStructureOfQuestion").innerHTML = getTreeMenuHTML(treeResult, 1, 2);
                QM_buildRelationTree($("#divBookStructureOfQuestion"), treeResult[0], $("#ddlBookList").val());
            }
        }

    }
    $get("div_bookStructureChange").style.display = "block";
}

//改变bookstructure位置
function onBookStructureChangeApply() {
    //    $get("spanBookStructurePos").innerHTML = getCurrentNodePos("divBookStructureOfQuestion", _structureId);
    $get("div_bookStructureChange").style.display = "none";
}

//改变bookstructure时隐藏树形菜单
function onBookStructureChangeCancel() {
    $get("div_bookStructureChange").style.display = "none";
}

//var QM_SelectedLOArray = new Array();
//function onSLoCheckBoxClick(cbx) {
//    var loId = cbx.id.substring(8);

//    if (cbx.checked) {//添加lo
//        if ($("#divSelectQLOForQuestionManage").length == 0) {
//            emath_InsertLO();
//        } else {
//            $("#divSelectQLOForQuestionManage").show(200);
//        }
//        var loFlag = false;
//        for (var lo = 0; lo < QM_SelectedLOArray.length; lo++) {
//            if (QM_SelectedLOArray[lo].loId == loId) {
//                loFlag = true;
//                break;
//            }
//        }
//        if (!loFlag) {
//            for (var tlo = 0; tlo < temp_sLoArray.length; tlo++) {
//                if (temp_sLoArray[tlo].id == loId) {
//                    $get("trQuestionLoNoInfo").style.display = "none";
//                    var loQuestionWrapper = {};
//                    loQuestionWrapper.loId = temp_sLoArray[tlo].id;
//                    loQuestionWrapper.loName = temp_sLoArray[tlo].name;
//                    //                    loQuestionWrapper.loType = temp_sLoArray[tlo].loloType;
//                    //                    loQuestionWrapper.loUnit = temp_sLoArray[tlo].unit;
//                    //                    loQuestionWrapper.probability = temp_sLoArray[tlo].loloWeight != "0" ? temp_sLoArray[tlo].loloWeight : "";
//                    //                    loQuestionWrapper.loQuestionId = questionId;
//                    //                    loQuestionWrapper.loStep = temp_sLoArray[tlo].step;
//                    $("#divSelectQLOForQuestionManageItem").find("div[noresults]").remove()
//                    $("<div loId='" + loQuestionWrapper.loId + "'><input type='checkbox' value='"
//                    + loQuestionWrapper.loId + "' />&nbsp;" + loQuestionWrapper.loName + "</div>")
//                    .appendTo($("#divSelectQLOForQuestionManageItem"));

//                    QM_SelectedLOArray.push(loQuestionWrapper);
//                    break;
//                }
//            }
//        }
//    } else {//删除lo
//        for (var dlo = 0; dlo < QM_SelectedLOArray.length; dlo++) {
//            if (loId == QM_SelectedLOArray[dlo].loId) {
//                $("#divSelectQLOForQuestionManage").show(200);
//                QM_SelectedLOArray.splice(dlo, 1);
//                $("#divSelectQLOForQuestionManageItem").find("div[loId='" + loId + "']").remove();
//                if (QM_SelectedLOArray.length == 0) {
//                    $("#divSelectQLOForQuestionManageItem").html('<div noresults="1" style="padding:5px;color:gray;">Please select some lo for this question.</div>');
//                }
//                break;
//            }
//        }
//    }
//}

//选择LO时点击复选框记录所选择的LO
function onLoCheckBoxClick(cbx, pid) {
    var loId = $(cbx).attr("loid");  //cbx.id.substring(7);
    if (cbx.checked) {//添加lo
        var loFlag = false;
        for (var lo = 0; lo < sLoArray.length; lo++) {
            if (sLoArray[lo].loId == loId) {
                loFlag = true;
                break;
            }
        }
        if (!loFlag) {
            var _temp_sLoArray = (pid == "divSolutionLOs") ? solutionLoArray : temp_sLoArray;
            for (var tlo = 0; tlo < _temp_sLoArray.length; tlo++) {
                if (_temp_sLoArray[tlo].id == loId) {
                    $get("trQuestionLoNoInfo").style.display = "none";
                    var loQuestionWrapper = {};
                    loQuestionWrapper.loId = _temp_sLoArray[tlo].id;
                    loQuestionWrapper.loName = _temp_sLoArray[tlo].name;
                    loQuestionWrapper.loType = _temp_sLoArray[tlo].loloType;
                    loQuestionWrapper.loUnit = _temp_sLoArray[tlo].unit;
                    loQuestionWrapper.probability = _temp_sLoArray[tlo].loloWeight != "0" ? _temp_sLoArray[tlo].loloWeight : "";
                    loQuestionWrapper.loQuestionId = questionId;
                    loQuestionWrapper.loStep = _temp_sLoArray[tlo].step;
                    sLoArray.push(loQuestionWrapper);
                    createQuestionLosRow(loQuestionWrapper);
                    if (pid == "divLOs") {
                        $("#divSolutionLOs").find("input[loid='" + loId + "'][type='checkbox']").attr("checked", "checked");
                    } else {
                        $("#divLOs").find("input[loid='" + loId + "'][type='checkbox']").attr("checked", "checked");
                    }
                    break;
                }
            }
        }
    } else {//删除lo
        deleteQuestionLosRow(loId);
        if (pid == "divLOs") {
            $("#divSolutionLOs").find("input[loid='" + loId + "'][type='checkbox']:checked").removeAttr("checked");
        } else {
            $("#divLOs").find("input[loid='" + loId + "'][type='checkbox']:checked").removeAttr("checked");
        }
    }
}

//得到当前选中节点的位置. tid:放tree的容器Id,sid:当前选中节点的Id,psid:即parentStructureId
//function getCurrentNodePos(tid, sid) {
//    if (typeof sid == 'undefined' || sid == null) {
//        return "[NULL]";
//    }
//    var pos = "";
//    var aArray = $get(tid).getElementsByTagName("A");
//    for (var r = 0; r < aArray.length; r++) {
//        var _href = aArray[r].href;
//        var asid = _href.substring(_href.indexOf("(") + 2, _href.indexOf("','"));
//        if (asid == sid) {
//            return aArray[r].innerHTML + "(" + aArray[r].title + ")";
//        }
//    }

//}

function getCurrentNodePos(sid) {

    var pos = "";
    if (sid != null && QM_bookStrucutreArray && QM_bookStrucutreArray.length > 1 && QM_bookStrucutreArray[1]!=null) {
        for (var i = 0; i < QM_bookStrucutreArray[1].length; i++) {
            if (QM_bookStrucutreArray[1][i].contentId == sid) {
                pos = QM_bookStrucutreArray[1][i].unit + ". " + QM_bookStrucutreArray[1][i].title;
                break;
            }
        }
    }
    return pos;
}
//清除数组questionWrapperArray，loQuestionWrapperArray，referenceAnswerWrapperArray
function clearArrayForQuestion() {
    sLoArray = [];
    //    QM_SelectedLOArray = [];
    questionWrapperArray = [];
    loQuestionWrapperArray = [];
    referenceAnswerWrapperArray = [];
}

//清除Question信息
function clearAllQuestionInfo(qid) {
    clearArrayForQuestion();
    //questionId=null;
    hidAlgorithmTxtBox();
    _flag = false;
    $get("divQuestionManage2").style.display = "none";
    $divQuestionManage1.style.display = "block";
    if ($get("td1_tree1").firstChild != $get("div_tree")) {
        $get("td1_tree1").appendChild($get("div_tree"));
    }
    $find(qPrefix + "QuestionManage1_Tabs1").set_activeTabIndex(0);
    $find(qPrefix + "QuestionManage1_Tabs1_tabPanel2_Tab2").set_activeTabIndex(0);
    emath_editor_bookId = null;
    $get("ddlActions").value = "-1";
    _structureId = sourceStructureId;
    _structureId2 = null;
    //    $get("spanBookStructurePos").innerHTML="[NULL]";
    $get("ddlActions").value = "-1";
//    $ddlAnswerType.value = "-1";
//    $ddlQuestionType.value = "-1";
    $get("ddlLogicType").value = "1";
    _ddlDifficult.value = "1";
//    _ddlThinkFlag.value = "0";
    _txtDiscriminator.value = "";
    _txtGuessFactor.value = "";
    $get("rdIsParentQuestionNo").checked = !($get("rdIsParentQuestionYes").checked = false);
    $get("rdAutoGrade").checked = !($get("rdManualGrade").checked = true);
    $get("rdIsStudentVisibleNo").checked = !($get("rdIsStudentVisibleYes").checked = true);
    $get("rdIsSampleQuestionNo").checked = !($get("rdIsSampleQuestionYes").checked = false);
    
    $get("rdIsThinkQuestionNo").checked = !($get("rdIsThinkQuestionYes").checked = false);
    $get("rdIsAnswerNo").checked = !($get("rdIsAnswerYes").checked = true);
    $get("rdAlgorithmYes").checked = !($get("rdAlgorithmNo").checked = true);
    //$get("divQuestionTitle").innerHTML = "&nbsp;";
    //$get("divQuestionDescription").innerHTML = "&nbsp;";
    //$get("divQuestionInstruction").innerHTML = "&nbsp;";
    $get("divQuestionBody").innerHTML = "&nbsp;";
    $get("divQuestionAnswer").innerHTML = "&nbsp;";
    $get("divQuestionSolution").innerHTML = "&nbsp;";
    $get("divQuestionHint").innerHTML = "&nbsp;";
    //$get("div_tree2").innerHTML = getTreeMenuHTML(treeResult, 0, 1);
    QM_buildRelationTree($("#div_tree2"), treeResult[0], $("#ddlBookList").val());
    $get("divSKnowlegePoint").style.display = "none";
    $get("divAlgorithmSeedContentInfo").innerHTML = "&nbsp;";
    $get("spAlgorithmSeedPreview").innerHTML = "未检查";
    //    $get("divLOs").innerHTML="&nbsp;";
    //    $get("table_QuestionLos").style.display="none";

    var table_QuestionLos = $get("table_QuestionLos");
    if (table_QuestionLos.rows.length > 2) {
        var tblength = table_QuestionLos.rows.length;
        for (r = 2; r < tblength; r++) {
            table_QuestionLos.deleteRow(r);
            tblength = tblength - 1;
            r = r - 1;
        }

    }
    $("#divSelectQLOForQuestionManage").remove();

    clearTableAlgorithmInfo();
    $get("divQuestionPreview").innerHTML = "&nbsp;";
    $get("btnQuestionApply").setAttribute("disabled", "disabled");
    //    loqstatus = -1;
    //    ddlTypeStatus = 0;
    temp_sLoArray = null;
    tempQuestionWrapperArray = [];
    targetLoArr = [];
    //    temp_QuestionAlgorithmValueWrapperArray=null;
    onBookStructureChangeCancel();
    $get("ddlBookListForCopyQuestion").value = "-1";
    $get("divLoading22").style.display = "none";
    tempAlgorithmInfoList = null;
    
    //$("html,body").animate({ scrollTop: $("#tdRowContainer_" + questionId).offset().top }, 1000)
    if ($("#" + Q_loId + "_" + questionId).length != 0) {
        location.href = "#" + Q_loId + "_" + questionId;
    }
    else {
        location.href = "#tdRowContainer_" + questionId;
    }

    editQuestionParentId = "-1";
    QM_parentQuestionId = null;
    

}

//重置活动题参数的table
function clearTableAlgorithmInfo() {
    $get("divAlgorithmInfo").style.display = "none";
    var tableAlgorithmInfo = $get("tableAlgorithmInfo");
    if (tableAlgorithmInfo.rows.length > 1) {
        var tblength1 = tableAlgorithmInfo.rows.length;
        for (r1 = 1; r1 < tblength1; r1++) {
            tableAlgorithmInfo.deleteRow(r1);
            tblength1 = tblength1 - 1;
            r1 = r1 - 1;
        }
    }
}

//将匹配“V数字”的字符串前后加上“@”
function V_A(str) {
    str = str.replace(/v\d+/ig, function (m) { return "@" + m.toUpperCase() + "@"; });
    return str;
}

//将匹配“@V数字@”的字符串去掉前后@
function A_V(str) {
    if (str == null)
    { return "" }
    str = str.replace(/@(v\d+)@/ig, "$1")
    return str;
}

//点击Question行展开信息(lo,answer,solution,hint)
function onQuestionRowClick(img, qid, qpvSID, answerTypeId, algorithmFlag, qpid) {
    var o = img.parentNode.parentNode;
//    if (isClickClearCache == true) {
//        isClickClearCache = false;
//        return;
//    }

    if (window.document.activeElement.tagName.toLowerCase() == "input") {
        return;
    }

    if (o.nextSibling.firstChild.firstChild.style.display != "none") {
        o.nextSibling.firstChild.firstChild.style.display = "none";
        o.parentNode.parentNode.style.border = "";
        if ($(o).attr("parentFlag") != "0" && $(o).attr("parentFlag") != "1") {
            o.firstChild.firstChild.src = "../Images/sanjiaoNormal.gif";
        }
        o.style.backgroundColor = "";
        $get("trQHeight_" + qid).style.height = "";
    } else {
        o.nextSibling.firstChild.firstChild.style.display = "block";
        o.parentNode.parentNode.style.border = "solid 8px #BED7F5";
        if ($(o).attr("parentFlag") != "0" && $(o).attr("parentFlag") != "1") {
            o.firstChild.firstChild.src = "../Images/sanjiaoExpend.gif";
        }

        $get("trQHeight_" + qid).style.height = "5px";
        o.style.backgroundColor = "#f3f8fe";
        if (o.nextSibling.firstChild.firstChild.innerHTML.indexOf("ajax-loader_b.gif") != -1) {
            // var algorithmFlag= $get("td_isAlgorithm_"+qid).innerHTML.toLowerCase().trim()=="yes" ? "1" : "0";//o.lastChild.previousSibling.innerHTML.toLowerCase().trim()=="yes" ? "1" : "0";
            
            bindReferenceAnswerListForQuestion({ solutionId: "divQSolution_" + qid, parentId: qpid, hintId: "divQHint_" + qid, tabsNodeId: "divQExInfo_" + qid, questionId: qid,qpvSeedId:qpvSID, sectionId: simpleUser.SectionId, roleId: simpleUser.roleId, answerTypeId: answerTypeId, algorithmFlag: algorithmFlag });
        }
    }
}

//Question对应的Lo成功返回
function onGetLOForQuestionSuccessed(result, _context) {
    //bindTabs(isShowLo,isShowAnswer,isShowSolution,isShowHint,loArray,ReferenceAnswersWrapperArray,solution,hint,tabsNode,questionId,sectionId,roleId,answerTypeId);
    var context = _context.context;
    bindTabs(false, true, true, true, true, result, _context.referenceArray, $get(context.solutionId).innerHTML, $get(context.hintId).innerHTML,
    $get(context.tabsNodeId), context.questionId, context.sectionId, context.roleId, context.answerTypeId, false, true);
}
var _ddlDifficult = null;
var _txtDiscriminator = null;
var _txtGuessFactor = null;
//var _ddlThinkFlag = null;
//绑定SimpleUser
function bindSimpleUser() {
    _ddlDifficult = $get("ddlDifficult");
//    _ddlThinkFlag = $get("ddlThinkFlag");
    _txtDiscriminator = $get("txtDiscriminator");
    _txtGuessFactor = $get("txtGuessFactor");
    $divQuestionManage1 = $get("divQuestionManage1");
    $imgLoadingId = $get(imgLoadingId);
    $ddlAnswerType = $get("ddlAnswerType");
    $ddlQuestionType = $get("ddlQuestionType");
    var args = new Object();
    args = getUrlParms();
    var _userId = args["userId"] ? args["userId"] : "";
    var sectionId = args["sectionId"] != null && typeof args["sectionId"] != 'undefined' && args["sectionId"] != "" ? args["sectionId"] : null;
    CmsWS.getSimpleUser(_userId, sectionId, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "getJsSimpleUser" }, null); //得到SimpleUser
}

//编辑Question时绑定question lo
function bindLoQuestionListForQuestion(_questionId) {
    //    $imgLoadingId.style.display = "block";
    CmsWS.getLoQuestionList(_questionId, simpleUser, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "getLoQuestionList" }, null)
}

//编辑question时绑定答案
function bindReferenceAnswerListForQuestion(q,flag) {
    
    if (flag) {
        //        $imgLoadingId.style.display = "block";
        CmsWS.getReferenceAnswersList(q.questionId,q.qpvSeedId, simpleUser, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "getReferenceAnswersList" }, null)
    } else if (typeof (q) == "object") {
        CmsWS.getReferenceAnswersList(q.questionId,q.qpvSeedId, simpleUser, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "getReferenceAnswersList", context: q }, null);
    }
}

//绑定LO到DropDownList
function bindLearningObjectiveListToTable(structureId) {
    $imgLoadingId.style.display = "block";
    //CmsWS.getLearningObjectiveExtendOfStructureList(structureId,simpleUser,onQuestionManagePageSuccessed,onQuestionManagePageFailed,{userContext:"getLOExtendOfStructureList"},null);
    CmsWS.getLearningObjectiveWithStructureList(structureId, getTempISBN(), null, simpleUser, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "getLOExtendOfStructureList" }, null);
}


//綁定Answer Type
function bindAnswerTypeListToDropDownList() {
    if ($ddlAnswerType.options.length <= 1) {
        CmsWS.getQuestionTypeList(simpleUser, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "getQuestionTypeList" }, null);
    } else {
        if ($imgLoadingId.style.display != "none") {
            $imgLoadingId.style.display = "none";
        }
    }
}

var t_bookId = "_";
var t_tqt_Array = null;
function bindQuestionTypeListToDropDownList(bookId) {
    //CmsWS.getTestQuestionTypeList(isbn, simpleUser, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "getTestQuestionTypeList" }, null);
    if (bookId == t_bookId) {
       // onQuestionManagePageSuccessed(t_tqt_Array, { userContext: "getTestQuestionTypeList" }, "getTestQuestionTypeList");
        return;
    }
    t_bookId = bookId;
    $excuteWS("~CmsWS.getTestQuestionTypeBookList", { bookId: bookId, userExtend: simpleUser }, function (r) {
        t_tqt_Array = r;
        onQuestionManagePageSuccessed(r, { userContext: "getTestQuestionTypeList" }, "getTestQuestionTypeList")
     }, null, { userContext: "getTestQuestionTypeListBySubject" });
    //if ($ddlQuestionType.options.length <= 1) {
    //    CmsWS.getTestQuestionTypeList(isbn, simpleUser, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "getTestQuestionTypeList" }, null);
    //} else {
    //    $($ddlQuestionType).trigger("change");
    //    if ($imgLoadingId.style.display != "none") {
    //        $imgLoadingId.style.display = "none";
    //    }
    //}
}

//绑定question
function bindQuestionsToTable(structureId) {

    getQusetionWebservice(structureId);
    //    $imgLoadingId.style.display="block";
    //    //CmsWS.getQuestionExtendForStructureId(structureId,simpleUser,onQuestionManagePageSuccessed,onQuestionManagePageFailed,{userContext:"getQuestionExtendForStructureId"},null);
    //    // CmsWS.getQuestionForStructureId(structureId,simpleUser,onQuestionManagePageSuccessed,onQuestionManagePageFailed,{userContext:"getQuestionForStructureId"},null);
    //    CmsWS.getQuestionIdsForStructureId(structureId, function (_result, _userContext, _methodName) {
    //        var questionIdArray = window.tempQuestionIdArray = _result;
    //        bindKnowledgeGuidePagination(questionIdArray);
    
    //    }, onQuestionManagePageFailed, { userContext: "getQuestionIdsForStructureId" }, null);
    //CmsWS.getQuestionAndQuestionAlgorithmForStructureId(structureId,simpleUser,onQuestionManagePageSuccessed,onQuestionManagePageFailed,{userContext:"getQuestionForStructureId"},null);
}

var pageSize = 10;
var tFlag = true;
function bindKnowledgeGuidePagination(questionIdArray) {

    if (questionIdArray != null) {

        pageSize = $("#ddlPageSize").val();
        pageSize = Number(pageSize);
        $("div[class=pagination]").html("").pagination(questionIdArray.length, {
            num_edge_entries: 2,
            num_display_entries: 5,
            items_per_page: pageSize,
            callback: function (page_index, o) {
                var _startPos = page_index * pageSize;
                var _endPos = _startPos + (pageSize - 1);

                if (tFlag) {
                    tFlag = false;
                } else {
                    $imgLoadingId.style.display = "block";
                }
                CmsWS.getQuestionForIds(getQuestionIdsArray(questionIdArray, _startPos, _endPos), simpleUser, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "getQuestionForStructureId" }, null);
            }
        });
    }
}

function getQuestionIdsArray(questionIdArray, startpos, endpos) {
    var tempQuestionIdArray = new Array();
    if (questionIdArray) {
        var tQuestionIdArray = questionIdArray;
        var lastIndex = tQuestionIdArray.length - 1;
        if (endpos > lastIndex) {
            endpos = lastIndex;
        }
        tempQuestionIdArray = tQuestionIdArray.slice(startpos, endpos + 1);
    }
    return tempQuestionIdArray;
}

//根据questionId返回question
function excuteGetQuestion(_questionId) {
    CmsWS.getQuestionEdit(_questionId, simpleUser, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "getQuestionEdit" }, null);
}

////处理活动题参数
//function excuteQuestionAndReferenceAnswersChanage(referenceAnswersWrapperArray, questionWrapperArray, questionAlgorithmValueWrapperArray, context, simpleUser) {
//    CmsWS.questionAndReferenceAnswersChanage(referenceAnswersWrapperArray, questionWrapperArray, questionAlgorithmValueWrapperArray, simpleUser, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "questionAndReferenceAnswersChanage", context: context }, null);
//}
////处理活动题参数  带活动题参数值
//function excuteQuestionAndReferenceAnswersChanage1(referenceAnswersWrapperArray, questionWrapperArray, questionAlgorithmValueWrapperArray, context, simpleUser) {
//    CmsWS.questionAndReferenceAnswersChanage(referenceAnswersWrapperArray, questionWrapperArray, questionAlgorithmValueWrapperArray, simpleUser, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "questionAndReferenceAnswersChanage2", context: context }, null);
//}

////处理活动题参数
//function excuteQuestionAndReferenceAnswersChanage2(referenceAnswersWrappers, questionWrappers, testResultId, context, simpleUser) {
//    CmsWS.questionAndReferenceAnswersChanage2(referenceAnswersWrappers, questionWrappers, testResultId, simpleUser, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "questionAndReferenceAnswersChanage2", context: context }, null);
//}


//将教学大纲绑定到dropdownlist
function bindCoursesToDropDownList(simpleUser) {
    $imgLoadingId.style.display = "block";
    CmsWS.getListByCourseAndUserId(simpleUser, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "getListByCourseAndUserId" }, null);
}

//绑定书到dropdownlist
function bindBookListToDropDownList(simpleUser) {
    $imgLoadingId.style.display = "block";
    //    CmsWS.getBookList(simpleUser, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "getBookList" }, null);
    $excuteWS("~CmsWS.getBookList", { userId: null, instituteIds: null, disciplineIds: null, subjectIds: null, realFlag: false, userExtend: simpleUser }, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "getBookList" });
}


//绑定树形菜单
var QM_bookStrucutreArray = null;
function bindBookContentStructureListToTree(type, isbn, exCurriculumId) {
    //Comm_WebService.getBookContentStructureArray(type, isbn, exCurriculumId, simpleUser, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "getBookContentStructureArray" }, null);
    $excuteWS("~CmsWS.getBookStructureArray", { isbn: isbn, isLazy: false }, function (result) {
        QM_bookStrucutreArray = result;
        onQuestionManagePageSuccessed(result, { userContext: "getBookContentStructureArray", isbn: isbn }, "getBookContentStructureArray")
    }, null, null);
}

//返回bookId
function getBookId(isbn, simpleUser) {
    $imgLoadingId.style.display = "block";
    CmsWS.getBookId(isbn, simpleUser, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "getBookId" }, null)
}

//检查活动题参数值
function doCheckQuestionAlgorithmValues(questionAlgorithms, questionId, oPreviewCell, previewFlag) {

    CmsWS.checkQuestionAlgorithmValues(questionAlgorithms, questionId, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "checkQuestionAlgorithmValues", oPreviewCell: oPreviewCell, previewFlag: previewFlag }, null)
}

//保存或更新活动题参数
function doSaveUpdateQuestionAlgorithm(questionAlgorithms, qaQuestionId) {

    CmsWS.saveUpdateQuestionAlgorithm(questionAlgorithms, qaQuestionId, simpleUser, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "saveUpdateQuestionAlgorithm", questionId: qaQuestionId }, null);
}

//返回活动题参数列表
function bindQuestionAlgorithmList(_questionId) {
    CmsWS.getQuestionAlgorithmList(_questionId, simpleUser, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "getQuestionAlgorithmList" }, null);
}



//根据questionId返回Question所对应的LO
function excuteGetLOForQuestion(context, simpleUser) {
    //CmsWS.getLOForQuestion(context.context.questionId, simpleUser, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "getLOForQuestion", context: context }, null);
    onQuestionManagePageSuccessed(null, { userContext: "getLOForQuestion", context: context }, "getLOForQuestion");
}

//根据题自增量返回该题的活动题参数列表
function excuteGetQuestionAlgorithmByNbList(number, simpleUser) {
    CmsWS.getQuestionAlgorithmByNbList(number, simpleUser, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "getQuestionAlgorithmByNbList" }, null);
}

//根据一组number或一个得到question集合
function excuteGetQuestionByNumber(numbers, simpleUser) {
    $("div[class=pagination]").html("");
    $(".pagination_ddl").hide()
    simpleUser.bookId = $("#ddlBookList").find("option:selected").attr("id");
    CmsWS.getQuestionByNumber(numbers, simpleUser, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "getQuestionByNumber" }, null);
}

//成功返回后綁定AnswerType到DropDownList
function onGetQuestionTypeListSuccessed(result) {
    if (result != null) {
        var ddlAnswerType = $ddlAnswerType;
        var index = 0;
        for (var d = 0; d < result.length; d++) {
            if (result[d].id != "10" && result[d].id != "12" && result[d].id != "7") {
                index++;
                ddlAnswerType.options[index] = new Option(result[d].type, result[d].id);
            }
        }

        if ($get("ddlActions").value == "edit" || $get("ddlActions").value == "copy") {
            $ddlAnswerType.value = editQuestionTypeId;
            //bindReferenceAnswerListForQuestion(questionId);
            if ((editQuestionTypeId == "11" || editQuestionTypeId == "4" || editQuestionTypeId == "8")) {
                //$get("tr_GradeMode").style.display = "block";
                //$get("rdManualGrade").checked=!($get("rdAutoGrade").checked=questionWrapperArray[editq].autoConfirmCorrectFlag =="1" ? true :false);
            } else {
                $get("tr_GradeMode").style.display = "none";
            }

            if (editQuestionTypeId == "6") {
                $("#trQuestionOrder").css("display", "");
                $("#txtQuestionOrder").val("0");
            } else {
                $("#trQuestionOrder").css("display", "none");
            }
        }
    }

    //    if (ddlTypeStatus == 0) {
    //        ddlTypeStatus = 1;
    //    } else if (ddlTypeStatus == 1) {
    //        ddlTypeStatus = 2;
    //    }
}

//成功返回后綁定QustionType到DropDownList
function onGetTestQuestionTypeListSuccessed(result) {
    
    var options = [];
    options.push('<option value="-1">选择题类型</option>');
    if (result != null) {
        //        var ddlQuestionType = $ddlQuestionType;
        //        for (var d1 = 0; d1 < result.length; d1++) {
        //            ddlQuestionType.options[d1 + 1] = new Option(result[d1].title, result[d1].id);
        //        }

        //var options = [];
        var difficulty = "";
        var answertype = "";
        //options.push('<option value="-1">选择题类型</option>');
        for (var i = 0; i < result.length; i++) {
            difficulty = (result[i].difficulty) ? result[i].difficulty : "";
            answertype = (result[i].questionTypeId) ? result[i].questionTypeId : "";
            options.push("<option value='" + result[i].id + "' difficulty='" + difficulty + "' answertype='" + answertype + "' >" + result[i].title + "</option>");
        }
        $($ddlQuestionType).empty().append(options.join(""));

        if ($get("ddlActions").value == "edit" || $get("ddlActions").value == "copy") {
            $ddlQuestionType.value = editTestQuestionTypeId;
        }

    } else {
        $($ddlQuestionType).empty().append(options.join(""));
    }

    //    if (ddlTypeStatus == 0) {
    //        ddlTypeStatus = 1;
    //    } else if (ddlTypeStatus == 1) {
    //        ddlTypeStatus = 2;
    //    }
}

//知识点成功返回后生成table
var temp_sLoArray = null;
function onGetLearningObjectiveExtendOfStructureListSuccessed(result) {
    temp_sLoArray = result;
    var tableStrBuilder = new Sys.StringBuilder();
    tableStrBuilder.append(
      "<table class=\"gridviewblue\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"text-align:left;\"><tbody>"
      + "<tr class=\"titlerow\">"
    //      + "<th class =\"tableCheckBoxCell\">&nbsp;</th>"
      + "<th class =\"tableCheckBoxCell\">勾选</th>"
      + "<th class =\"tableUnitCell\">单元</th>"
      + "<th class =\"tableKnowlegePointCell\">知识点</th></tr></tbody>"
      );
    if (result == null || result.length == 0) {
        tableStrBuilder.append("<tbody><tr><td colspan=\"5\">没有知识点信息</td></tr></tbody>");
    } else {
        for (var lo = 0; lo < result.length; lo++) {
            if (lo % 2 == 1)//奇数
            {
                tableStrBuilder.append("<tbody><tr class=\"evenrow\">");
            }
            else //偶数
            {
                tableStrBuilder.append("<tbody><tr class=\"oddrow\">");
            }

            //            var ckFlag0 = "";
            //            for (var m = 0; m < QM_SelectedLOArray.length; m++) {
            //                if (result[lo].id == QM_SelectedLOArray[m].loId) {
            //                    ckFlag0 = " checked=\"checked\" ";
            //                    break;
            //                }
            //            }

            var ckFlag = "";
            for (var n = 0; n < sLoArray.length; n++) {
                if (result[lo].id == sLoArray[n].loId) {
                    ckFlag = " checked=\"checked\" ";
                    break;
                }
            }

            tableStrBuilder.append(
            //"<td class =\"tableCheckBoxCell\"><input type=\"checkbox\" style=\"background-color:rgb(240,240,240)\" id=\"cbx_slo_" + result[lo].id + "\" " + ckFlag0 + " onclick=\"onSLoCheckBoxClick(this)\"/></td>"
           "<td class =\"tableCheckBoxCell\"><input type=\"checkbox\" loid=\"" + result[lo].id + "\" id=\"cbx_lo_" + result[lo].id + "\" " + ckFlag + "onclick=\"onLoCheckBoxClick(this,\'divLOs\')\"/></td>"
                + "<td class =\"tableUnitCell\">" + result[lo].unit + "</td>"
            //+ "<td class =\"tableKnowlegePointCell\">" + result[lo].name + "</td>");
                + "<td class =\"tableKnowlegePointCell\"><span style=\"color:#1a5fbf;cursor:pointer;\" onclick=\"QM_ShowKPDetails('" + result[lo].id + "')\">" + result[lo].name + "</span></td>");

            tableStrBuilder.append("</tr></tbody>");
        }
    }
    tableStrBuilder.append("</table>");

    $get("divLOs").innerHTML = tableStrBuilder.toString();
    $get("divSKnowlegePoint").style.display = "block";
    $get("ddlBookListForCopyQuestion").removeAttribute("disabled");
    $get("divLoading22").style.display = "none";
    //    if ($get("ddlActions").value == "edit" || $get("ddlActions").value == "copy") { loqstatus = 1; }
}

//课程成功返回后绑定到DropDownList
function onGetListByCourseAndUserIdSuccessed(result) {
    var ddlCurriculumList = $get("ddlCurriculumList");
    for (var x = 0; x < result.length; x++) {
        ddlCurriculumList.options[x + 1] = new Option(result[x].Name, result[x].ID);
    }

}

//返回question成功后绑定
var tempQuestionWrapperArray = [];
function onGetQuestionForStructureIdSuccessed(result) {
    var tableStrBuilder = new Sys.StringBuilder();
    if (result == null || result.length == 0) {
        tableStrBuilder.append("<div>没有任何数据</div>")
    }
    else {
        tableStrBuilder.append("<div style=' min-height:300px; height:530px; overflow:scroll;'>");
        tableStrBuilder.append(
      "<table id=\"tableQuestionsForBookStrucuture\" class=\"gridviewblue\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"text-align:left;\"><tbody>"
       + '<tbody><tr class="titlerow"><td colspan="5"><table border=0 width=100% cellspadding=0 cellspacing=0 style="margin:0px"><tr>'
              + "<th style='width:30px;text-align:center;'>&nbsp;</th>"
              + "<th style='width:35px;text-align:center;'>操作</th>"
              + "<th style='width:50px;text-align:center;'>编号.</th>"
              + "<th style='width:50px;text-align:center;display:none'>勾选</th>"
              + "<th style='width:50px;text-align:center;display:none;'>单元</th>"
              + "<th style='width:100px;text-align:center;'>题类型</th>"
              + "<th style='width:auto'>题</th>"
              + "<th style='width:35px;text-align:center;'>活动</th>"
              + "<th style='width:35px;text-align:center;'>可见</th>"
              + "<th style='width:35px;text-align:center;'>例题</th>"
              + "<th style='width:35px;text-align:center;'>难度</th>"
              
//              + "<th style='width:35px;text-align:center;'>Equi</th>"
//              + "<th style='width:35px;text-align:center;'>Sim</th>"
//              + "<th style='width:35px;text-align:center;'>Sub</th>"
//              + "<th style='width:35px;text-align:center;'>Seed</th>"
//              + "<th style='width:35px;text-align:center;'>Cache</th>"
//              + "<th style='width:65px;text-align:center;'>&nbsp;CopySource</th>"
              + '</tr></table></td></tr></tbody></table>'
      );

        tableStrBuilder.append(
      "<table id=\"tableQuestionsForBookStrucuture\" class=\"gridviewblue\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"text-align:left;\">"

      );
        var tbodyStrBuilder = new Sys.StringBuilder("");
        if (result != null) {

            for (var i = 0; i < result.length; i++) {
                if (i % 2 == 1)//奇数
                {
                    tbodyStrBuilder.append("<tbody class='evenrow' id='" + result[i].id + "'>");
                }
                else {
                    tbodyStrBuilder.append("<tbody class='oddrow' id='" + result[i].id + "'>");
                }
                tbodyStrBuilder.append(html_row_question(result[i]));
                tbodyStrBuilder.append("</tbody>");
            }
        }
        tableStrBuilder.append(tbodyStrBuilder.toString() + "</table>");
        tableStrBuilder.append("</div>");

    }
    $get("div_questions").innerHTML = tableStrBuilder.toString();
}

function html_row_questionFromKp(questionW) {

    var tableStrBuilder = new Sys.StringBuilder();
    //    if (i % 2 == 1)//奇数
    //    {
    //        tableStrBuilder.append("<tr style=\"cursor:pointer;\" questionId=\"" + questionW.id + "\" questionTypeId=\"" + questionW.questionTypeId + "\" class=\"evenrow\">");
    //    }
    //    else //偶数
    //    {
    // tableStrBuilder.append("<tr style=\"cursor:pointer;\" questionId=\"" + questionW.id + "\" questionTypeId=\"" + questionW.questionTypeId + "\" class=\"oddrow\">");
    //    }
    var cbxProperties = "";
    //var parentFlag = (questionW.parentFlag =="1" || questionW.questionTypeId == "6") && (!questionW.parentId || questionW.parentId == "" || questionW.parentId == questionW.id) ? "1" : "0";
    var parentFlag = "-1";
    if (questionW.parentFlag =="1" || questionW.questionTypeId == "6" && (!questionW.parentId || questionW.parentId == "" || questionW.parentId == questionW.id)) {
        parentFlag = "1";
    } else if (questionW.parentId && questionW.parentId != "" && questionW.parentId != questionW.id) {
        parentFlag = "0";
    }
    //    if (questionW.flag == "0") {
    //        cbxProperties = "disabled=\"disabled\"";
    //    } else 
    if (simpleUser.roleId == "0" && simpleUser.userId != questionW.userId) {
        cbxProperties = "disabled=\"disabled\" title=\"不是自己创建的\"";
    } else {
        cbxProperties = " questionId=\"" + questionW.id + "\" parentFlag=\"" + parentFlag + "\" onclick=\"getEditQuestionId(this,'" + questionW.id + "','" + questionW.structureId + "')\"";
    }
    //  +"<th style='text-align:center;width:16px;'>&nbsp;</th>"
    if (parentFlag == "1") {
        tableStrBuilder.append("<td style=\"color:red;text-align:center;width:16px;\"><img style=\"cursor:pointer\" expandflag=\"1\" src=\"../Images/bullet_go.png\" /></td>");
    } else if (parentFlag == "0") {
        tableStrBuilder.append("<td style=\"color:red;text-align:center;width:16px;\"><img style=\"cursor:pointer\" expandflag=\"1\" src=\"../Images/q_bullet_up.png\" /></td>");
    } else {
        tableStrBuilder.append("<td style=\"color:red;text-align:center;width:20px;\"><img style=\"cursor:pointer\" expandflag=\"1\" src=\"../Images/sanjiaoNormal.gif\" /></td>");
    }
    tableStrBuilder.append("<td style=\"text-align:center;width:20px;display:none;\"><input " + cbxProperties + " id=\"cbx_q_" + questionW.id + "\" type=\"checkbox\" style=\"cursor:default;\" /></td>");
    tableStrBuilder.append("<td style='width:35px;text-align:center;'><span style=\"color:blue;\" onmouseover=\"QM_onQuestonActionMenuShow(this,event,true)\" onmouseout=\"QM_onQuestonActionMenuShow(this,event,false)\"><img src=\"../CMS/Images/wrench.png\" alt=\"\"></span>" + QM_getQuestionActionMenu(questionW, parentFlag) + "</td>");
    tableStrBuilder.append("<td style=\"color:red;text-align:center;width:75px;\">" + questionW.number + "</td>");
    tableStrBuilder.append("<td style=\"text-align:center;width:75px;display:none;\">" + questionW.unit + "</td>");
    tableStrBuilder.append("<td style=\"text-align:center;width:90px;\">" +QM_getTestQuestionType(questionW.bookId,questionW.testQuestionTypeId) + "</td>");
    tableStrBuilder.append("<td style=\"text-align:left;\">"
            + '<span id="lo_question_details_solution_' + questionW.id + '" style="display:none;">' + questionW.solution + '</span>'
            + '<span id="lo_question_details_hint_' + questionW.id + '" style="display:none;">' + questionW.hint + '</span>'
            + questionW.content
            + "</td>");
    var algorithmFlagStr = "";
//    var strClearCache = "";
//    var seedStyleStr = "";
    if (questionW.algorithmFlag == "1") {
        algorithmFlagStr = "是";
//        if (simpleUser.roleId.trim() == "2")//管理员才能清理缓存
//        {
//            strClearCache = String.format("<img src='../Images/icon/clearCache.png' onclick=\"click_ClearCache('{0}',this)\" />", questionW.id).toString();
//        }
    } else {
        algorithmFlagStr = "否";
//        strClearCache = "";
//        seedStyleStr = ' style="visibility:hidden;" ';
    }

    //    var cbxProperties = "";
    //    if (questionW.flag == "0") {
    //        cbxProperties = "disabled=\"disabled\"";
    //    } else if (simpleUser.roleId == "0" && simpleUser.userId != questionW.userId) {
    //        cbxProperties = "disabled=\"disabled\" title=\"Not self-created\"";
    //    } else {

    //        //var parentFlag = (questionW.parentFlag =="1" || questionW.questionTypeId == "6") && (!questionW.parentId || questionW.parentId == "" || questionW.parentId == questionW.id) ? "1" : "0";
    //        cbxProperties = " questionId=\""+questionW.id+"\" parentFlag=\"" + parentFlag + "\" onclick=\"getEditQuestionId(this,'" + questionW.id + "','" + questionW.structureId + "','" + questionW.createdDate.format(timeFormat) + "')\"";
    //    }
//    tableStrBuilder.append("<td style='width:35px;text-align:center;'><span questionId=\"" + questionW.id + "\" onclick=\"QM_onInstructorOnlyClick(this,event)\" style=\"color:blue;cursor:pointer;\">" + (questionW.instructorOnly == "1" ? "否" : "是") + "</span></td>");
//    tableStrBuilder.append("<td algorithmFlag=\"true\" style='width:35px;text-align:center;'>" + algorithmFlagStr + "</td>");
//    tableStrBuilder.append("<td style='width:35px;text-align:center;'>" + getThinkFlag(questionW.thinkFlag) + "</td>");
    //    tableStrBuilder.append("<td style='width:35px;text-align:center;'>" + questionW.difficulty + "</td>");
    isEditable = true;
    if (AccLevel == 2 || AccLevel == 5) {   //操作权限
        if (questionW.userId != SimpleUser.userId) {
            isEditable = false;
        }
    } else if (AccLevel == 3 || AccLevel == 6) {	//浏览权限
        isEditable = false;
    }
    tableStrBuilder.append("<td style='width:35px;text-align:center;'>" + algorithmFlagStr + "</td>");
    if (isEditable) {
        tableStrBuilder.append("<td style='width:35px;text-align:center;'><span questionId=\"" + questionW.id + "\" onclick=\"QM_onInstructorOnlyClick(this,event)\" style=\"color:blue;cursor:pointer;\">" + (questionW.instructorOnly == "1" ? "否" : "是") + "</span></td>");
        tableStrBuilder.append("<td style='width:35px;text-align:center;'><span questionId=\"" + questionW.id + "\" onclick=\"QM_onIsSampleClick(this,event)\" style=\"color:blue;cursor:pointer;\">" + (questionW.sampleFlag == "1" ? "是" : "否") + "</span></td>");
        tableStrBuilder.append("<td style='width:35px;text-align:center;'>" + addDifficultyField(questionW.id, questionW.difficulty) + "</td>");
    } else {
        tableStrBuilder.append("<td style='width:35px;text-align:center;'><span questionId=\"" + questionW.id + "\">" + (questionW.instructorOnly == "1" ? "否" : "是") + "</span></td>");
        tableStrBuilder.append("<td style='width:35px;text-align:center;'><span questionId=\"" + questionW.id + "\">" + (questionW.sampleFlag == "1" ? "是" : "否") + "</span></td>");
        tableStrBuilder.append("<td style='width:35px;text-align:center;'>" + questionW.difficulty + "</td>");
    }

    
    
//    tableStrBuilder.append("<td style='width:35px;text-align:center;'><img title=\"等价题\" onclick=\"openNewWindow('../QuestionBank/EquivalenceQuestions.aspx?qType=0&userId=" + window.simpleUser.userId + "&sectionId=&questionId=" + questionW.id + "')\" src=\"../Images/application_osx_double.png\" alt=\"\" /></td>");
//    tableStrBuilder.append("<td style='width:35px;text-align:center;'><img title=\"相似题\" onclick=\"openNewWindow('../QuestionBank/EquivalenceQuestions.aspx?qType=1&userId=" + window.simpleUser.userId + "&sectionId=&questionId=" + questionW.id + "')\" src=\"../Images/application_osx_double.png\" alt=\"\" /></td>");
//    tableStrBuilder.append("<td style='width:35px;text-align:center;'><img title=\"种子管理\" " + seedStyleStr + " onclick=\"openNewWindow('../QuestionBank/QuestionSeedManage.aspx?userId=" + window.simpleUser.userId + "&sectionId=&questionId=" + questionW.id + "')\" src=\"../CMS/Images/world_key.png\" alt=\"\" /></td>");
//    tableStrBuilder.append("<td style='width:35px;text-align:center;'>" + strClearCache + "</td>");
    return tableStrBuilder.toString();
}

function QM_getTestQuestionType(bookId, tqtid) {
    
    if (tqtid) {
        for (var i = 0; i < QM_tqtArray.length; i++) {
            if (QM_tqtArray[i].bookId == bookId) {
                var r = QM_tqtArray[i].result;
                if (r) {
                    for (var j = 0; j < r.length; j++) {
                        if (r[j].id == tqtid) {
                            return r[j].title;
                        }
                    }
                }
                
                
            }
        }
    }
    return "--";

}

function html_row_question(questionW) {
    var tbodyStrBuilder = new Sys.StringBuilder("");

    tbodyStrBuilder.append("<tr><td name=\"tdRowContainer_" + questionW.id + "\" id=\"tdRowContainer_" + questionW.id + "\"  colspan=\"14\" >");

    var algorithmFlagStr = "";
//    var strClearCache = "";
//    var seedStyleStr = "";
    if (questionW.algorithmFlag == "1") {
        algorithmFlagStr = "是";
//        if (simpleUser.roleId.trim() == "2")//管理员才能清理缓存
//        {
//            strClearCache = String.format("<img src='../Images/icon/clearCache.png' onclick=\"click_ClearCache('{0}',this)\" />", questionW.id).toString();
//        }
    } else {
        algorithmFlagStr = "否";
//        strClearCache = "";
//        seedStyleStr = ' style="visibility:hidden;" ';
    }

    

    var cbxProperties = ""; // "<td ></td>";
    // var parentFlag = (questionW.parentFlag =="1" || questionW.questionTypeId == "6") && (!questionW.parentId || questionW.parentId == "" || questionW.parentId == questionW.id) ? "1" : "0";
    var parentFlag = "-1";
    if (questionW.parentFlag =="1" || questionW.questionTypeId == "6" && (!questionW.parentId || questionW.parentId == "" || questionW.parentId == questionW.id)) {
        parentFlag = "1";
    } else if (questionW.parentId && questionW.parentId != "" && questionW.parentId != questionW.id) {
        parentFlag = "0";
    }
    //    if (questionW.flag == "0") {
    //        cbxProperties = "disabled=\"disabled\"";
    //    } else 
    if (simpleUser.roleId == "0" && simpleUser.userId != questionW.userId) {
        cbxProperties = "disabled=\"disabled\" title=\"Not self-created\"";
    } else {
        cbxProperties = " questionId=\"" + questionW.id + "\" parentFlag=\"" + parentFlag + "\" onclick=\"getEditQuestionId(this,'" + questionW.id + "','" + questionW.structureId + "')\"";
    }

    var _s = "";
    if (parentFlag == "-1") {
        _s = "<tr style=\"cursor:default\">"
        + "<td style='width:30px;text-align:center;'><img style=\"cursor:pointer\" onclick=\"onQuestionRowClick(this,'" + questionW.id + "','" + questionW.qpvSeedId + "','" + questionW.questionTypeId + "'," + questionW.algorithmFlag + ",'" + questionW.parentId + "')\" src=\"../Images/sanjiaoNormal.gif\" /></td>";
    } else if (parentFlag == "0") {
        _s = "<tr parentFlag=\"" + parentFlag + "\" style=\"cursor:default\">"
        + "<td style='width:30px;text-align:center;'><img style=\"cursor:pointer\" onclick=\"onQuestionRowClick(this,'" + questionW.id + "','" + questionW.qpvSeedId + "','" + questionW.questionTypeId + "'," + questionW.algorithmFlag + ",'" + questionW.parentId + "')\" src=\"../Images/q_bullet_up.png\" /></td>";
    } else if (parentFlag == "1") {
        _s = "<tr parentFlag=\"" + parentFlag + "\" style=\"cursor:default\">"
        + "<td style='width:30px;text-align:center;'><img onclick=\"onQuestionRowClick(this,'" + questionW.id + "','" + questionW.qpvSeedId + "','" + questionW.questionTypeId + "'," + questionW.algorithmFlag + ",'" + questionW.parentId + "')\" src=\"../Images/bullet_go.png\" /></td>";
        //        _s = "<tr style=\"cursor:pointer\">"
        //        + "<td style='width:30px;text-align:center;'><img src=\"../Images/bullet_go.png\" /></td>";
    }

//    var copySource = "";
//    if (questionW.copyQuestionNumber) {
//        copySource = "<td style='width:85px;text-align:center;'><img title=\"拷贝源\" alt=\"\" onclick=\"copySource(" + questionW.copyQuestionNumber + ", event)\" src=\"../Images/lorry_go.png\" /></td>";
//    } else {
//        copySource = "<td style='width:85px;text-align:center;'>&nbsp;</td>";
//    }

    tbodyStrBuilder.append("<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"margin:0px\">" + _s);
    tbodyStrBuilder.append("<td style='width:35px;text-align:center;'><span style=\"color:blue;\" onmouseover=\"QM_onQuestonActionMenuShow(this,event,true)\" onmouseout=\"QM_onQuestonActionMenuShow(this,event,false)\"><img src=\"../CMS/Images/wrench.png\" alt=\"\"></span>" + QM_getQuestionActionMenu(questionW, parentFlag) + "</td>");
    tbodyStrBuilder.append("<td style='width:50px;text-align:center;'><span style=\"color:red;\">" + questionW.number + "</span></td>");
    tbodyStrBuilder.append("<td style='width:50px;text-align:center;display:none;'><input class=\"ckb_IsSelect\" type=\"checkbox\" " + cbxProperties + " id=\"cbx_q_" + questionW.id + "\" /></td>");
//    tbodyStrBuilder.append("<td style='width:50px;text-align:center;'>" + questionW.unit + "</td>");
    tbodyStrBuilder.append("<td style='width:100px;text-align:center;'>" + QM_getTestQuestionType(questionW.bookId,questionW.testQuestionTypeId) + "</td>");
    tbodyStrBuilder.append("<td style='width:auto'>" + questionW.content + "</td>");
    tbodyStrBuilder.append("<td style='width:35px;text-align:center;'>" + algorithmFlagStr + "</td>");
    tbodyStrBuilder.append("<td style='width:35px;text-align:center;'><span questionId=\"" + questionW.id + "\" onclick=\"QM_onInstructorOnlyClick(this,event)\" style=\"color:blue;cursor:pointer;\">" + (questionW.instructorOnly == "1" ? "否" : "是") + "</span></td>");
    tbodyStrBuilder.append("<td style='width:35px;text-align:center;'><span questionId=\"" + questionW.id + "\" onclick=\"QM_onIsSampleClick(this,event)\" style=\"color:blue;cursor:pointer;\">" + (questionW.sampleFlag == "1" ? "是" : "否") + "</span></td>");
    tbodyStrBuilder.append("<td style='width:35px;text-align:center;'>" + addDifficultyField(questionW.id, questionW.difficulty) + "</td>");
    
//    tbodyStrBuilder.append("<td style='width:35px;text-align:center;'><img title=\"等价题\" onclick=\"openNewWindow('../QuestionBank/EquivalenceQuestions.aspx?qType=0&userId=" + window.simpleUser.userId + "&sectionId=&questionId=" + questionW.id + "')\" src=\"../Images/application_osx_double.png\" alt=\"\"  />" + QM_getQuestionActionMenu(questionW, parentFlag) + "</td>");
//    tbodyStrBuilder.append("<td style='width:35px;text-align:center;'><img title=\"相似题\" onclick=\"openNewWindow('../QuestionBank/EquivalenceQuestions.aspx?qType=1&userId=" + window.simpleUser.userId + "&sectionId=&questionId=" + questionW.id + "')\" src=\"../Images/application_osx_double.png\" alt=\"\" /></td>");
//    if (parentFlag == "1") {
//        tbodyStrBuilder.append("<td style='width:35px;text-align:center;'><img title=\"得到子题\" onclick=\"insertSubQuestions(this,'" + questionW.id + "',event)\" src=\"../Images/application_osx_double-up.png\" alt=\"\" /></td>");
//    } else if (parentFlag == "0") {
//        tbodyStrBuilder.append("<td style='width:35px;text-align:center;'><img title=\"得到母题\" onclick=\"insertParentQuestions(this,'" + questionW.id + "','" + questionW.parentId + "',event)\" src=\"../Images/application_osx_double-right.png\" alt=\"\" /></td>");
//    } else {
//        tbodyStrBuilder.append("<td style='width:35px;text-align:center;'>&nbsp;</td>");
//    }
//    tbodyStrBuilder.append("<td style='width:35px;text-align:center;'><img title=\"种子管理\" " + seedStyleStr + " onclick=\"openNewWindow('../QuestionBank/QuestionSeedManage.aspx?userId=" + window.simpleUser.userId + "&sectionId=&questionId=" + questionW.id + "')\" src=\"../CMS/Images/world_key.png\" alt=\"\" /></td>");
//    tbodyStrBuilder.append("<td style='width:35px;text-align:center;'>" + strClearCache + "</td>");
//    tbodyStrBuilder.append(copySource);
    tbodyStrBuilder.append("</tr>");
    tbodyStrBuilder.append("<tr><td colspan=\"11\">");
    //"*****"

    tbodyStrBuilder.append("<div id=\"divQExInfo_" + questionW.id + "\" style=\"padding:0px 5px 5px;display:none\"><center><img src=\"../Images/ajax-loader_b.gif\"/></center></div>");
    tbodyStrBuilder.append("<div id=\"divQSolution_" + questionW.id + "\" style=\"display:none;\">" + questionW.solution + "</div>");
    tbodyStrBuilder.append("<div id=\"divQHint_" + questionW.id + "\" style=\"display:none;\">" + questionW.hint + "</div>");
    tbodyStrBuilder.append("</td></tr></table></td></tr>");
    tbodyStrBuilder.append("<tr id=\"trQHeight_" + questionW.id + "\" style=\"height:0px\"></tr>");
    return tbodyStrBuilder.toString();
}

function QM_onQuestonActionMenuShow(o,evt,flag) {
    var $actionParentMenu = $(o).parent().find("div.actionParentMenu");
    if (!flag) {
        $actionParentMenu.hide();
    } else {
        if (typeof evt.pageY=="undefined") {
            evt.pageY = evt.y;
        }
        $actionParentMenu.css({ "margin-left": "-10px", "top": (evt.pageY - 10) + "px" });
        //if ($.browser.mozilla) {
        //    $actionParentMenu.css({ "margin-left": "-10px", "top": (evt.mozMovementY-100) + "px" });
        //} else {
        //    $actionParentMenu.css({ "margin-left": "-10px", "top": (evt.y - 10) + "px" });
        //}
        $actionParentMenu.show();
    }
}

function QM_excuteActionMenu(data) {
    try {
        if (window.event) {
            data.evt.cancelBubble = true;
        }
        else if (data.evt) {
            data.evt.stopPropagation();
        }
    } catch (e) { }
    
    switch (data.val) {
        case "edit":
        case "copys":
        case "delete":
        case "audit":
        case "editHistory":
        case "addchild":

            questionIdArray = [{ id: data.questionId, structureId: data.structureId}];
            QM_parentQuestionId = data.questionId;
            $("#ddlActions").val(data.val).trigger("change");
            break;
        case "review":
            break;
        case "equivalence":
            openNewWindow('../QuestionBank/EquivalenceQuestions.aspx?qType=0&userId=' + window.simpleUser.userId + '&sectionId=&questionId=' + data.questionId);
            break;
        case "similarity":
            openNewWindow('../QuestionBank/EquivalenceQuestions.aspx?qType=1&userId=' + window.simpleUser.userId + '&sectionId=&questionId=' + data.questionId);
            break;
        case "subQuestion":
            insertSubQuestions(data.o, data.questionId ,data.qpvSeedId , data.evt);
            break;
        case "parentQuestion":
            insertParentQuestions(data.o, data.questionId , data.parentId , data.evt)
            break;
        case "seedManage":
            openNewWindow('../QuestionBank/QuestionSeedManage.aspx?userId=' + window.simpleUser.userId + '&sectionId=&questionId=' + data.questionId);
            break;
        case "review":
            break;
        case "copySource":
            copySource(data.copyQuestionNumber, data.evt)
            break;
        default:
            break;
    }
}

function QM_getQuestionActionMenu(questionW, parentFlag) {
    isEditable = true;
    if (AccLevel == 2 || AccLevel == 5) {   //操作权限
        if (questionW.userId != SimpleUser.userId) {
            isEditable = false;
        }
    } else if (AccLevel == 3 || AccLevel == 6) {	//浏览权限
        isEditable = false;
    }

    var strArr = new Array();
    strArr.push('<div class="actionParentMenu" onmouseover="this.style.display=\'\'" onmouseout="this.style.display=\'none\'" style="display:none;padding:3px;width:120px;font-size:11px;background-color:#fff;text-align:left;border:1px solid gray;position:absolute;">');
    if (isEditable){
        strArr.push('<div onclick="QM_excuteActionMenu({val:\'edit\',structureId:\'' + questionW.structureId + '\',questionId:\'' + questionW.id + '\',evt:event})"><img title="编辑该题" src="../CMS/Images/application_edit.png" alt="" /> 编辑</div>');
        //strArr.push('<div onclick="QM_excuteActionMenu({val:\'copys\',structureId:\'' + questionW.structureId + '\',questionId:\'' + questionW.id + '\',evt:event})"><img title="拷贝" src="../Images/application_osx_double.png" alt="" /> 拷贝</div>');
        strArr.push('<div onclick="QM_excuteActionMenu({val:\'delete\',structureId:\'' + questionW.structureId + '\',questionId:\'' + questionW.id + '\',evt:event})"><img title="删除" src="../CMS/Images/application_delete.png" alt="" /> 删除</div>');
    }
    strArr.push('<div onclick="QM_excuteActionMenu({val:\'audit\',structureId:\'' + questionW.structureId + '\',questionId:\'' + questionW.id + '\',evt:event})"><img title="审核与建议" src="../Images/application_osx_double.png" alt="" /> 审核与建议</div>');
    strArr.push('<div onclick="QM_excuteActionMenu({val:\'editHistory\',structureId:\'' + questionW.structureId + '\',questionId:\'' + questionW.id + '\',evt:event})"><img title="编辑历史" src="../Images/application_osx_double.png" alt="" /> 编辑历史</div>');
    if (parentFlag == "1"){
        strArr.push('<div onclick="QM_excuteActionMenu({val:\'addchild\',structureId:\'' + questionW.structureId + '\',questionId:\'' + questionW.id + '\',evt:event})"><img title="添加一个子题" src="../CMS/Images/application_add.png" alt="" /> 添加一个子题</div>');
    }
    if (parentFlag == "1") {
        strArr.push('<div onclick="QM_excuteActionMenu({o:this,val:\'subQuestion\',questionId:\'' + questionW.id + '\',qpvSeedId:\''+questionW.qpvSeedId+'\',evt:event})"><img title="得到子题" src="../Images/application_osx_double-up.png" alt="" /> 得到子题</div>');
    } else if (parentFlag == "0") {
        strArr.push('<div onclick="QM_excuteActionMenu({o:this,val:\'parentQuestion\',questionId:\'' + questionW.id + '\',parentId:\''+questionW.parentId+'\',evt:event})"><img title="得到母题" src="../Images/application_osx_double-right.png" alt="" /> 得到母题</div>');
    }
    if (questionW.algorithmFlag == "1" && !(questionW.parentId && questionW.parentId != "" && questionW.parentId != questionW.id)) {
        if (isEditable) { 
            strArr.push('<div onclick="QM_excuteActionMenu({val:\'seedManage\',questionId:\'' + questionW.id + '\',evt:event})"><img title="种子管理" src="../CMS/Images/world_key.png" alt="" /> 种子管理</div>');
        }
    }

    //if (questionW.copyQuestionNumber) {
    //    strArr.push('<div onclick="QM_excuteActionMenu({val:\'copySource\',copyQuestionNumber:' + questionW.copyQuestionNumber + ',evt:event})"><img title="拷贝源" src="../Images/lorry_go.png" alt=""/> 拷贝源</div>');
    //}

    strArr.push('</div>');
    return strArr.join('');
}

function QM_onInstructorOnlyClick(o, evt) {
//    try {
//        if (window.event) {
//            evt.cancelBubble = true;
//        }
//        else if (evt) {
//            evt.stopPropagation();
//        }
//    } catch (e) { }
    $(o).html('<img src="../Images/ajax-loader_m.gif" alt=""/>');
    // CmsWS.updateQuestionInfo(QuestionWrapper[] questions, Wrapper.UsersExtendWrapper usersExtendWrapper
    
    CmsWS.getQuestionEdit($(o).attr("questionId"), simpleUser, function (r1) {
        if (r1) {
            if (r1.instructorOnly == "1") {
                r1.instructorOnly = "0";
            } else {
                r1.instructorOnly = "1";
            }
            CmsWS.updateQuestionInfo([r1], simpleUser, function (r2) {
                if (r2) {
                    if (r1.instructorOnly == "1") {
                        $(o).html("否");
                    } else {
                        $(o).html("是");
                    }
                    //$(o).html((r1.instructorOnly == "1" ? "Y" : "N"));
                }
            }, onQuestionManagePageFailed, { userContext: "updateQuestionInfo" });
        }
    }, onQuestionManagePageFailed, { userContext: "getQuestionEdit" }, null);

}

function QM_onIsSampleClick(o, evt) {
    $(o).html('<img src="../Images/ajax-loader_m.gif" alt=""/>');
    CmsWS.getQuestionEdit($(o).attr("questionId"), simpleUser, function (r1) {
        if (r1) {
            if (r1.sampleFlag == "1") {
                r1.sampleFlag = "0";
            } else {
                r1.sampleFlag = "1";
            }
            CmsWS.updateQuestionInfo([r1], simpleUser, function (r2) {
                if (r2) {
                    if (r1.sampleFlag == "1") {
                        $(o).html("Y");
                    } else {
                        $(o).html("N");
                    }
                    //$(o).html((r1.sampleFlag == "1" ? "Y" : "N"));
                }
            }, onQuestionManagePageFailed, { userContext: "updateQuestionInfo" });
        }
    }, onQuestionManagePageFailed, { userContext: "getQuestionEdit" }, null);
}

//添加难度字段
function addDifficultyField(id, difficulty) {
    var sb = [];
    sb.push("<div class='diff_view' onmouseover='_showDiffView(this, true)' onmouseout='_showDiffView(this, false)'>");
    sb.push("    <div class='val'>" + difficulty + "</div>");
    sb.push("    <div class='options' onclick='_onDiffViewItemClick(\"" + id + "\", this, event)'>");
    sb.push("        <div>1</div>");
    sb.push("        <div>2</div>");
    sb.push("        <div>3</div>");
    sb.push("        <div>4</div>");
    sb.push("        <div>5</div>");
    sb.push("    </div>");
    sb.push("</div>");
    return sb.join("");
}

function _showDiffView(o, b) {
    if (b) {
        $(o).find(".val").css("border-color", "#ccc");
        if ($.browser.msie && $.browser.version > 7) {
            scrollTop = $("#tableQuestionsForBookStrucuture").parent().scrollTop();
            t = -1 - scrollTop;
            $(o).find(".options").css({ "margin-top": t + "px" });
        }
        $(o).find(".options").show();
    } else {
        $(o).find(".val").css("border-color", "transparent");
        $(o).find(".options").hide();
    }
}

function _onDiffViewItemClick(id, o, e) {
    e = e || event;
    tar = e.srcElement || e.target;
    $(o).hide();

    $(o).prev().html('<img src="../Images/ajax-loader_m.gif" alt=""/>');
    CmsWS.getQuestionEdit(id, simpleUser, function (r1) {
        if (r1) {
            r1.difficulty = tar.innerHTML;
            CmsWS.updateQuestionInfo([r1], simpleUser, function (r2) {
                if (r2) {
                    $(o).prev().html(tar.innerHTML);
                }
            }, onQuestionManagePageFailed, { userContext: "updateQuestionInfo" });
        }
    }, onQuestionManagePageFailed, { userContext: "getQuestionEdit" }, null);
}

function insertParentQuestions(o, qid, pqid, evt) {
    try {
        if (window.event) {
            evt.cancelBubble = true;
        }
        else if (evt) {
            evt.stopPropagation();
        }
    } catch (e) { }
    if ($(o).attr("flag") == "1" || $("#" + pqid).length != 0) {
        return;
    }
    $(o).attr("flag", "1");

    CmsWS.getQuestionEdit(pqid, simpleUser, function (r) {

        if (r) {
            var result = [r];
            var htmlRow = new Array();
            var $tbody = $("#" + qid);
            var num = $tbody.hasClass("oddrow") ? 0 : 1;
            for (var i = 0; i < result.length; i++) {
                if (i % 2 == num)//奇数
                {
                    htmlRow.push("<tbody class='evenrow' id='" + result[i].id + "'>");
                }
                else {
                    htmlRow.push("<tbody class='oddrow' id='" + result[i].id + "'>");
                }
                htmlRow.push(html_row_question(result[i]));
                htmlRow.push("</tbody>");
            }
            //$("#trQHeight_" + pqid).html("");
            $(htmlRow.join('')).insertBefore($("#" + qid));

        }
    }, onQuestionManagePageFailed, { userContext: "getQuestionEdit" }, null);
}

function insertSubQuestions(o, qid,seedId, evt) {
    try {
        if (window.event) {
            evt.cancelBubble = true;
        }
        else if (evt) {
            evt.stopPropagation();
        }
    } catch (e) { }
    if ($(o).attr("flag") == "1") {
        return;
    }
    $(o).attr("flag", "1");
    $("#trQHeight_" + qid).show().html('<center><img alt="加载中..." src="../Images/ajax-loader_b.gif" /></center>');
    
    CmsWS.getSubQuestionListById(qid, seedId, simpleUser, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "getQuestionList", questionId: qid }, null);
}

function getThinkFlag(thinkFlag) {

    if (thinkFlag == "1") {
        return "CT";
    }

    if (thinkFlag == "2") {
        return "CP";
    }

    if (thinkFlag == "3") {
        return "App";
    }

    if (thinkFlag == "4") {
        return "Wri";
    }

    if (thinkFlag == "5") {
        return "CC";
    }

    return "--";
}

//var isClickClearCache;
//function click_ClearCache(questionId, currentNode) {

//    isClickClearCache = true;
//    userContext = { userContent: "clearCacheQAV", currentNode: currentNode };
//    currentNode.style.display = "none";
//    CmsWS.clearCacheQAV(questionId, simpleUser, ClearCache_onSuccessed, ClearCache_onFailed, userContext, null);

//}
function ClearCache_onSuccessed(result, userContext, methodName) {

    if (userContext.userContent == "clearCacheQAV") {
        if (result == true) {
            alert("Successful!");
            userContext.currentNode.style.display = "none";
        }
        else if (result == false) {
            alert("Fail!");
        }
    }
}
function ClearCache_onFailed(result, userContext, methodName) {

    if (userContext == "clearCacheQAV") {
        alert("Fail!");
    }
}

//编辑question时设置单选和多选题答案
function setMultiple_ChoicesOrSelectionAnswer(result, ddlAnswerTypeValue) {
    $get("divQuestionAnswer").innerHTML = "";
    var tableMultiple_ChoicesOrSelection = document.createElement("table");
    tableMultiple_ChoicesOrSelection.setAttribute("id", "tableMultiple_ChoicesOrSelection");
    tableMultiple_ChoicesOrSelection.setAttribute("width", "100%");
    tableMultiple_ChoicesOrSelection.cellSpacing = "0";
    tableMultiple_ChoicesOrSelection.cellPadding = "0";
    tableMultiple_ChoicesOrSelection.bgColor = "#ffffff";
    Sys.UI.DomElement.addCssClass(tableMultiple_ChoicesOrSelection, "MultipleChoices_TABLE");
    $addHandlers(
        tableMultiple_ChoicesOrSelection, {
            click: onTable_MultipleChoicesClick
        }
    );

    for (var r = 0; r < result.length; r++) {
        result[r].content = A_V(result[r].content);
        createMultiple_ChoicesOrSelectionRow(tableMultiple_ChoicesOrSelection, r, result[r], ddlAnswerTypeValue);
    }


    $get("divQuestionAnswer").appendChild(tableMultiple_ChoicesOrSelection);
}

var QM_referenceAnswerArray = [];
//Question对应答案成功返回
function onGetReferenceAnswersListSuccessed0(result) {
    QM_referenceAnswerArray = result;
}

//编辑Question的时候 返回对应答案成功时
function onGetReferenceAnswersListSuccessed(result) {
    var ddlAnswerTypeValue = $ddlAnswerType.value;
    switch (ddlAnswerTypeValue) {
        case "1": //单选题 Multiple choices
            setMultiple_ChoicesOrSelectionAnswer(result, ddlAnswerTypeValue);
            break;
        case "11": //数学公式题 Math Input
            setMultiple_ChoicesOrSelectionAnswer(result, ddlAnswerTypeValue);
            //            var mathInputAnserContent="&nbsp;";
            //            if(result!=null && result!="")
            //            {
            //                mathInputAnserContent=result[0].content;
            //            }
            //            $get("divQuestionAnswer").innerHTML="<div id=\"divMathInputAnswer_"+result[0].id+"\" style=\"width:100%;height:100%\" onclick=\"onQustionDivClick(this)\">"+mathInputAnserContent+"</div>";
            break;
        case "13": //Success/Fail
            //            var rdSucceededStr="&nbsp;";
            //            var rdFailedStr="&nbsp;";
            //            if(result!=null)
            //            {
            //                
            //                for(var r=0;r<result.length;r++)
            //                {
            //                    var checkedStr=result[r].correctFlag=="1" ? " checked=\"checked\" " : "";
            //                    if(result[r].content.indexOf("Succeeded")!=-1)
            //                    {
            //                        rdSucceededStr="<input name=\"SuccessedFailGroup\" id=\"rdSucceeded\" type=\"radio\" "+checkedStr+" style=\"cursor:default;\" value=\""+result[r].id+"\" />Succeeded&nbsp;&nbsp;&nbsp;";
            //                    }else if(result[r].content.indexOf("Failed")!=-1){
            //                        rdFailedStr="<input name=\"SuccessedFailGroup\" id=\"rdFailed\" type=\"radio\" "+checkedStr+" style=\"cursor:default;\" value=\""+result[r].id+"\" />Failed</div>";
            //                    }
            //                }    
            //            }    
            //            $get("divQuestionAnswer").innerHTML="<div id=\"divSucessFailAnswer\" style=\"border:solid 1px #BED7F5;width:100%;height:100%;text-align:center;\">"+rdSucceededStr+rdFailedStr+"</div>";
            set_SF_TF_YN_AnswerForQuestionEdit({ containerDivId: "divSucessFailAnswer", groupName: "SuccessedFailGroup", rd1ID: "rdSucceeded", rd2ID: "rdFailed", rd1Content: "对", rd2Content: "错" }, result);
            break;
        case "2": //Multiple selection  
        case "15": //Grid in
            setMultiple_ChoicesOrSelectionAnswer(result, ddlAnswerTypeValue);
            break;
        case "3": //True Or False
            //            var rdTrueStr="&nbsp;";
            //            var rdFalseStr="&nbsp;";
            //            if(result!=null)
            //            {
            //                
            //                for(var r=0;r<result.length;r++)
            //                {
            //                    var checkedStr=result[r].correctFlag=="1" ? " checked=\"checked\" " : "";
            //                    if(result[r].content.indexOf("True")!=-1)
            //                    {
            //                        rdTrueStr="<input name=\"TrueFalseGroup\" id=\"rdTrue\" type=\"radio\" "+checkedStr+" style=\"cursor:default;\" value=\""+result[r].id+"\" />True&nbsp;&nbsp;&nbsp;";
            //                    }else if(result[r].content.indexOf("False")!=-1){
            //                        rdFalseStr="<input name=\"TrueFalseGroup\" id=\"rdFalse\" type=\"radio\" "+checkedStr+" style=\"cursor:default;\" value=\""+result[r].id+"\" />False</div>";
            //                    }
            //                }    
            //            }    
            //            $get("divQuestionAnswer").innerHTML="<div id=\"divTrueFalseAnswer\" style=\"border:solid 1px #BED7F5;width:100%;height:100%;text-align:center;\">"+rdTrueStr+rdFalseStr+"</div>";
            set_SF_TF_YN_AnswerForQuestionEdit({ containerDivId: "divTrueFalseAnswer", groupName: "TrueFalseGroup", rd1ID: "rdTrue", rd2ID: "rdFalse", rd1Content: "对", rd2Content: "错" }, result);
            break;
        case "4": //Fill-in blank
        case "14":
            setMultiple_ChoicesOrSelectionAnswer(result, ddlAnswerTypeValue);
            //            var fillInBlankAnserContent="&nbsp;";
            //            if(result!=null && result!="")
            //            {
            //                fillInBlankAnserContent=result[0].content;
            //            }
            //            $get("divQuestionAnswer").innerHTML="<textarea id=\"txtAreaFillInBlank_"+result[0].id+"\"  style=\"width:280px;height:80px\">"+fillInBlankAnserContent+"</textarea>";
            break;
        case "8": //Numeric answer
            setMultiple_ChoicesOrSelectionAnswer(result, ddlAnswerTypeValue);
            //            var numericAnserContent="&nbsp;";
            //            if(result!=null && result!="")
            //            {
            //                numericAnserContent=result[0].content;
            //            }
            //            $get("divQuestionAnswer").innerHTML="<input type=\"text\" onkeyup=\"checkNumericAnswer(this.value,this)\" id=\"txtNumericAnswer_"+result[0].id+"\" value=\""+numericAnserContent+"\"  style=\"width:150px;\" />";
            break;
        case "9": //Yes or No
            set_SF_TF_YN_AnswerForQuestionEdit({ containerDivId: "divYesNoAnswer", groupName: "YesNoGroup", rd1ID: "rdYes", rd2ID: "rdNo", rd1Content: "对", rd2Content: "错" }, result);
            break;
        default:
            break;
    }
}

function checkNumericAnswer(v, o) {
    if (isNaN(v)) {
        alert("必须为数字!");
        o.value = "";
    }
}

function set_SF_TF_YN_AnswerForQuestionEdit(obj, result) {
    //    var rd1Str="&nbsp;";
    //    var rd2Str="&nbsp;";
    //    if(result!=null)
    //    {
    //        
    //        for(var r=0;r<result.length;r++)
    //        {
    //            var checkedStr=result[r].correctFlag=="1" ? " checked=\"checked\" " : "";
    //            if(result[r].content.indexOf(obj.rd1Content)!=-1)
    //            {
    //                rd1Str="<input name=\""+obj.groupName+"\" id=\""+obj.rd1ID+"\" type=\"radio\" "+checkedStr+" style=\"cursor:default;\" value=\""+result[r].id+"\" />"+obj.rd1Content+"&nbsp;&nbsp;&nbsp;";
    //            }else if(result[r].content.indexOf(obj.rd2Content)!=-1){
    //                rd2Str="<input name=\""+obj.groupName+"\" id=\""+obj.rd2ID+"\" type=\"radio\" "+checkedStr+" style=\"cursor:default;\" value=\""+result[r].id+"\" />"+obj.rd2Content+"</div>";
    //            }
    //        }    
    //    }    
    //    $get("divQuestionAnswer").innerHTML="<div id=\""+obj.containerDivId+"\" style=\"border:solid 1px #BED7F5;width:100%;height:100%;text-align:center;\">"+rd1Str+rd2Str+"</div>";
    //    
    if (result == null || result.length != 2) {
        alert("error");
        return;
    }
    var checkedStr1 = result[0].correctFlag == "1" ? " checked=\"checked\" " : "";
    var checkedStr2 = (result[1].correctFlag == "1" && checkedStr1 == "") ? " checked=\"checked\" " : "";

    $get("divQuestionAnswer").innerHTML = "<div id=\"" + obj.containerDivId + "\" style=\"border:solid 1px #BED7F5;width:100%;height:100%;text-align:left;padding:5px\">"
                + "<div id=\"divAnswerFeedback_" + obj.rd1ID + "\" style=\"display:none;\">" + result[0].feedback + "</div>"
                + "<div id=\"divAnswerFeedback_" + obj.rd2ID + "\" style=\"display:none;\">" + result[1].feedback + "</div>"
                + "&nbsp;<input name=\"" + obj.groupName + "\" id=\"" + obj.rd1ID + "\" type=\"radio\" " + checkedStr1 + " style=\"cursor:default;\" value=\"" + result[0].id + "\" />" + obj.rd1Content
                + "&nbsp;&nbsp;<img alt=\"添加反馈信息\" title=\"编辑反馈信息\" style=\"cursor:pointer;vertical-align:bottom\" src=\"../Images/feed_edit.png\" onclick=\"addFeedbackForAnswer('divAnswerFeedback_" + obj.rd1ID + "')\" />"
                + "<br/>&nbsp;<input name=\"" + obj.groupName + "\" id=\"" + obj.rd2ID + "\" type=\"radio\" " + checkedStr2 + " style=\"cursor:default;\" value=\"" + result[1].id + "\" />" + obj.rd2Content
                + "&nbsp;&nbsp;<img alt=\"添加反馈信息\" title=\"编辑反馈信息\" style=\"cursor:pointer;vertical-align:bottom\" src=\"../Images/feed_edit.png\" onclick=\"addFeedbackForAnswer('divAnswerFeedback_" + obj.rd2ID + "')\" />"
                + "</div>";
}

function getLearningObjectiveCmsWrapper(o) {
    if (o.loloType == "0" && (o.loloWeight == "1" || o.loloWeight == "1.0")) {
        return null;
    } else {
        var learningObjectiveCmsWrapper = {}; //new JEWS.EngineStudyGuide.LearningObjectiveCmsWrapper();
        learningObjectiveCmsWrapper.id = o.loId;
        return learningObjectiveCmsWrapper;
    }
}

//编辑Question的时候 返回对应QuestionLo成功时
//var loqstatus = -1;
var targetLoArr = [];
function onGetLoQuestionListSuccessed(result) {
    targetLoArr = [];
    if (result != null && result.length != 0) {
        $get("trQuestionLoNoInfo").style.display = "none";
        
        
        for (var i = 0; i < result.length; i++) {
            if (result[i].loType == "0") {
                targetLoArr.push(result[i]);
                var lo = $.extend(true, {}, result[i]);
                lo["loType"] = "1";
                sLoArray.push(lo);
            } else {
                sLoArray.push(result[i]);
            }
        }

        for (var m = 0; m < sLoArray.length; m++) {
            var nflag = false; //判断是否为target lo
            for (var n = 0; n < targetLoArr.length; n++) {
                if (targetLoArr[n].loId == sLoArray[m].loId) {
                    nflag = true;
                    break;
                }
            }
            createQuestionLosRow(sLoArray[m], nflag);
        }


      
        _structureId2 = _structureId;
        setSelectedNodeClass('div_tree2', _structureId2);
    } else {
        $get("trQuestionLoNoInfo").style.display = "block";
    }
    //bindLearningObjectiveListToTable(_structureId);

}

//检查活动题参数返回参数值成功时
function onCheckQuestionAlgorithmValuesSuccessed(result, oPreviewCell, previewFlag) {
    if (result == null) {
        return;
    }

    var isNull = false;
    if (oPreviewCell != null)//检查某一个参数值
    {
        if (result[0].PValue == null)
        { isNull = true; }
        // oPreviewCell.innerHTML=result[0].PValue!="" ? "<div style=\"word-wrap:break-word;word-break:break-all;width:100px;\">"+result[0].PValue+"</div>" : "&nbsp;";
        // $(oPreviewCell).text(result[0].PValue != "" ? result[0].PValue  : " ");
        $(oPreviewCell).text(result[0].PValue != "" ? result[0].PValue : " ");

    } else {//检查所有参数值
        if (!previewFlag) {
            var tableAlgorithmInfo = $get("tableAlgorithmInfo");
            for (var r = 1; r < tableAlgorithmInfo.rows.length; r++) {
                var row = tableAlgorithmInfo.rows[r];
                var rQavId = row.id.substring(row.id.lastIndexOf("_") + 1)
                for (var k = 0; k < result.length; k++) {
                    if (rQavId == result[k].id) {
                        if (result[k].PValue == null) {
                            isNull = true
                        }
                        //row.lastChild.previousSibling.innerHTML=result[k].PValue!="" ? result[k].PValue : "&nbsp;";
                        $(row.lastChild.previousSibling).text(result[k].PValue != "" ? result[k].PValue : " ");
                        break;
                    }
                }
            }
        } else {
            for (var m = 0; m < result.length; m++) {
                if (result[m].PValue == null) {
                    isNull = true;
                    break;
                }
            }

            if (!isNull)//参数正确时 改变值 预览
            {
                $imgLoadingId.style.display = "block";
                //excuteQuestionAndReferenceAnswersChanage(referenceAnswerWrapperArray, questionWrapperArray, result, "--", simpleUser);
                

                onQuestionAndReferenceAnswersChanageSuccessed([referenceAnswerWrapperArray, questionWrapperArray], "--");
            }
        }
    }
    if (isNull) {
        alert("parameter error!");
    }
}

//返回活动题参数成功时
var tempAlgorithmInfoList = null;
function onGetQuestionAlgorithmListSuccessed(result) {
    tempAlgorithmInfoList = result;
    $get("divAlgorithmInfo").style.display = "block";
    if (result != null) {

        for (var i = 0; i < result.length; i++) {
            if (result[i].qpSeedFlag == "1") {
                var algorithmContent = result[i].qpFuction;
                algorithmContent = algorithmContent != "" ? algorithmContent : "&nbsp;";
                algorithmContent = algorithmContent.replace(/\>/gi, "&gt;");
                algorithmContent = algorithmContent.replace(/\</gi, "&lt;");
                $get("divAlgorithmSeedContentInfo").innerHTML = A_V(algorithmContent);
            } else {
                result[i].qpName = A_V(result[i].qpName);
                result[i].qpFuction = A_V(result[i].qpFuction);
                createAlgorithmRow(null, result[i]);
            }
        }
    }
}

//指定question返回成功时
function onGetQuestionSuccessed(result) {

    if (!result) {
        alert("error");
        return;
    }


    //得到answerType和questionTypeTitle下拉列表的选中值
    emath_editor_bookId = result.bookId;
    editQuestionTypeId = result.questionTypeId != null ? result.questionTypeId : "-1";
    editTestQuestionTypeId = result.testQuestionTypeId != null ? result.testQuestionTypeId : "-1";
    editQuestionParentId = result.parentId != null && result.parentId != "" && result.parentId != result.id ? result.parentId : "-1";
    bindAnswerTypeListToDropDownList(); //LY4
    var _bookId = result.bookId;// simpleUser.roleId == "2" ? $("#ddlBookList").find("option:selected").attr("id") : simpleUser.BookId;
    
    bindQuestionTypeListToDropDownList(_bookId); //LY5
    $ddlAnswerType.value = editQuestionTypeId;
    $ddlQuestionType.value = editTestQuestionTypeId;
    
    bindReferenceAnswerListForQuestion({ questionId: result.id, qpvSeedId: result.qpvSeedId }, true); //LY2
    // bindLoQuestionListForQuestion(result.id); //LY3
    onQuestionManagePageSuccessed(null, { userContext: "getLoQuestionList" }, "getLoQuestionList");
    $get("ddlLogicType").value = result.questionLogicTypeId != null && result.questionLogicTypeId != "" ? result.questionLogicTypeId : "-1";
    _ddlDifficult.value = result.difficulty != null && result.difficulty != "" ? result.difficulty : "-1";
//    _ddlThinkFlag.value = result.thinkFlag != null && result.thinkFlag != "" ? result.thinkFlag : "0";
    _txtDiscriminator.value = result.discriminator != null && result.discriminator != "" ? result.discriminator : "";
    _txtGuessFactor.value = result.guessFactor != null && result.guessFactor != "" ? result.guessFactor : "";
    bindStructureType(result.structureType); //LY6
    
    if ($get("ddlActions").value == "edit" || $get("ddlActions").value == "copy") {
        if ((editQuestionTypeId == "11" || editQuestionTypeId == "4" || editQuestionTypeId == "8")) {
            //$get("tr_GradeMode").style.display = "block";
            $get("rdManualGrade").checked = !($get("rdAutoGrade").checked = result.autoConfirmCorrectFlag == "1" ? true : false);
        } else {
            $get("tr_GradeMode").style.display = "none";
        }

        if (editQuestionTypeId == "6") {
            $("#trQuestionOrder").css("display", "");
            $("#txtQuestionOrder").val("0");
        } else {
            $("#trQuestionOrder").css("display", "none");
        }
    }

    
    $get("rdIsParentQuestionNo").checked = !($get("rdIsParentQuestionYes").checked = result.parentFlag == "1" ? true : false);
    //Visible For Student
    $get("rdIsStudentVisibleYes").checked = !($get("rdIsStudentVisibleNo").checked = result.instructorOnly == 1 ? true : false);
    //是否是例题
    $get("rdIsSampleQuestionNo").checked = !($get("rdIsSampleQuestionYes").checked = result.sampleFlag == 1 ? true : false);
    //是否是思考题
    $get("rdIsThinkQuestionNo").checked = !($get("rdIsThinkQuestionYes").checked = result.thinkFlag == 1 ? true : false);

    $get("rdManualGrade").checked = !($get("rdAutoGrade").checked = result.autoConfirmCorrectFlag == "1" ? true : false);

    //是否有答案
    $get("rdIsAnswerNo").checked = !($get("rdIsAnswerYes").checked = result.answerFlag == 1 ? true : false);

    //活动题单选按钮组设置
    $get("rdAlgorithmNo").checked = !($get("rdAlgorithmYes").checked = result.algorithmFlag == 1 ? true : false);
    if ($get("rdAlgorithmYes").checked == true) {
        $get("rdAlgorithmNo").setAttribute("disabled", "disabled");
        $get("rdAlgorithmYes").setAttribute("disabled", "disabled");
        if (editQuestionParentId != "-1") {
            bindQuestionAlgorithmList(editQuestionParentId);
        } else {
            bindQuestionAlgorithmList(questionId);
        }
    } else {
        $get("rdAlgorithmNo").removeAttribute("disabled");
        $get("rdAlgorithmYes").removeAttribute("disabled");
    }

    //编辑Question第二步 部分信息
    //$get("divQuestionTitle").innerHTML = (result.title != null && result.title != "") ? result.title : "&nbsp;";
    //$get("divQuestionDescription").innerHTML = (result.description != null && result.description != "") ? result.description : "&nbsp;";
    //$get("divQuestionInstruction").innerHTML = (result.instraction != null && result.instraction != "") ? result.instraction : "&nbsp;";
    result.content = A_V(result.content);
    $get("divQuestionBody").innerHTML = (result.content != null && result.content != "") ? result.content : "&nbsp;";
    result.solution = A_V(result.solution)
    $get("divQuestionSolution").innerHTML = (result.solution != null && result.solution != "") ? result.solution : "&nbsp;";
    result.hint = A_V(result.hint)
    $get("divQuestionHint").innerHTML = (result.hint != null && result.hint != "") ? A_V(result.hint) : "&nbsp;";
    //QM_FunCompletedForEdit(result.algorithmFlag);
    //$get("divQuestionManage2").style.display = "block";
}

//处理活动题参数
function onQuestionAndReferenceAnswersChanageSuccessed(result, context) {
    var result0 = [];
    var result1 = [];
    if (result != null) {
        result0 = result[0];
        result1 = result[1];
        if (result1 == null) {
            result1 = [];
        }
    }
    if (context != "--") {
        bindTabs(false, true, true, true, true, [], result0, $get(context.solutionId).innerHTML, $get(context.hintId).innerHTML, $get(context.tabsNodeId), context.questionId, context.sectionId, context.roleId, context.answerTypeId, false, true);

        //        $SHOW_RELATED_LO_addMouseHoverEvent();
    } else {
    
        createPreviewInfo(result0, result1);
    }
}

//处理活动题参数2
function onQuestionAndReferenceAnswersChanage2Successed(result, context1) {
    var result0 = [];
    if (result != null) {
        result0 = result[0];
    }

    var _context = { context: context1, referenceArray: result0 };
    excuteGetLOForQuestion(_context, simpleUser);
    //bindTabs(false,true,true,true,[],result0,$get(context.solutionId).innerHTML,$get(context.hintId).innerHTML,$get(context.tabsNodeId),context.questionId,context.sectionId,context.roleId,context.answerTypeId);
}

//返回书并绑定
var tempBookList = null;
function onGetBookListSuccessed(result) {
    tempBookList = result;
    BookList = result;
    BindQueryBook();
    var $ddlBookList = $("#ddlBookList");
    $.each(result, function () {
        $ddlBookList.append("<option value='" + this.isbn + "' id='" + this.id + "' >" + this.title + "</option>");
    });
    $("#divBookList").css("display", "block");
    //选择默认的书
    var args = getUrlParms();
    if (args["isbn"]) {
        $ddlBookList.val(args["isbn"]).trigger("change");
    }
    //    for(var x=0;x<result.length;x++)
    //    {
    //        ddlBookList.options[x+1] = new Option(result[x].title, result[x].isbn);
    //    }


    $get("divBookList").style.display = "block";
}

function getTempISBN() {
    if (simpleUser.roleId != "2") {
        return simpleUser.isbn;
    } else {
        return $get("ddlBookList").value;
    }
}

//绑定书到下拉框
function bindBookListToDDL(obj, result) {
    var options = new Array();
    options.push('<option value="-1">Select a Book</option>');
    for (var x = 0; x < result.length; x++) {
        //obj.options[x + 1] = new Option(result[x].title, result[x].isbn);
        options.push('<option bookId="' + result[x].id + '" value="' + result[x].isbn + '">' + result[x].title + '</option>');
    }
    obj.empty();

    $(options.join('')).appendTo(obj);
    var args = getUrlParms();
    if (args["isbn"]) {
        obj.val(args["isbn"]).trigger("change");
    }
}

//根据questionId返回对应Question的答案
function QM_excuteGetReferenceAnswersList(context, _simpleUser) {
    TestWS.getReferenceAnswersList(context.questionId, context.qpvSeedId,_simpleUser, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "getReferenceAnswersList0", context: context }, null);
}

var QM_tempQuestionWrapperArray = [];
var Q_loId = null;
//根据loId返回所有Question成功
function QM_onGetQuestionOfLoListSuccessed(result, context) {

    var loId = context.loId;
    Q_loId = loId;
    if (result != null) {
        //temp_QuestionAlgorithmValueWrapperArray = result;
        if (QM_tempQuestionWrapperArray == null || QM_tempQuestionWrapperArray.length == 0) {
            QM_tempQuestionWrapperArray = result;
        } else {
            for (var x = 0; x < result.length; x++) {
                var existFlag = false;
                for (var y = 0; y < QM_tempQuestionWrapperArray.length; y++) {
                    if (QM_tempQuestionWrapperArray[y].id == result[x].id) {
                        existFlag = true;
                        break;
                    }
                }

                if (!existFlag) {
                    QM_tempQuestionWrapperArray.push(result[x]);
                }
            }

        }
    }

    if (result == null) {
        $get(context.targetContainerId).innerHTML = "<div style='color:gray;font-size:11px;'>没有题信息</div>";
        return;
    }

    var tableStrBuilder = new Sys.StringBuilder();
    tableStrBuilder.append(
      "<table id=\"tableQuestionsOfLo\" class=\"gridviewblue\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"text-align:left;\"><tbody>"
      + "<tr class=\"titlerow\">"
      + "<th style='text-align:center;width:16px;'>&nbsp;</th>"
      + "<th style='text-align:center;width:20px;display:none;'>&nbsp;</th>"
      + "<th style='width:35px;text-align:center;'>操作</th>"
      + "<th style='text-align:center;width:75px;'>编号.</th>"
      + "<th style='text-align:center;width:75px;display:none;'>单元</th>"
      + "<th style='text-align:center;width:90px;'>题类型</th>"
      + "<th style='text-align:center'>题</th>"
      + "<th style='width:35px;text-align:center;'>活动</th>"
      + "<th style='width:35px;text-align:center;'>可见</th>"
      + "<th style='width:35px;text-align:center;'>例题</th>"
      + "<th style='width:35px;text-align:center;'>难度</th>"
      
//      + "<th style='width:35px;text-align:center;'>Equi</th>"
//      + "<th style='width:35px;text-align:center;'>Sim</th>"
//      + "<th style='width:35px;text-align:center;'>Seed</th>"
//      + "<th style='width:35px;text-align:center;'>Cache</th>"
    //      + "<th style=\"text-align:center\"></th>"
      + "</tr></tbody>"
      );

    for (var i = 0; i < result.length; i++) {
        if (i % 2 == 1)//奇数
        {
            tableStrBuilder.append("<tr name=\"" + loId + "_" + result[i].id + "\" id=\"" + loId + "_" + result[i].id + "\" style=\"cursor:default;\" questionId=\"" + result[i].id + "\" qpvSeedId=\"" + result[i].qpvSeedId + "\" questionTypeId=\"" + result[i].questionTypeId + "\" class=\"evenrow\">");
        }
        else {
            tableStrBuilder.append("<tr name=\"" + loId + "_" + result[i].id + "\" id=\"" + loId + "_" + result[i].id + "\" style=\"cursor:default;\" questionId=\"" + result[i].id + "\" qpvSeedId=\"" + result[i].qpvSeedId + "\" questionTypeId=\"" + result[i].questionTypeId + "\" class=\"oddrow\">");
        }
        tableStrBuilder.append(html_row_questionFromKp(result[i]));
        tableStrBuilder.append("<tr>");
    }
    tableStrBuilder.append("</table>");
    $get(context.targetContainerId).innerHTML = tableStrBuilder.toString();

    var $trQ = $("#" + context.targetContainerId).find("tr[questionId] img[expandflag=1]");
    $trQ.click(function () {

        var $this = $(this).parent().parent(); ;
        var $thisNext = $this.next();
        var qid = $this.attr("questionId");
        var qpvSID = $this.attr("qpvSeedId");
        if ($thisNext.attr("expandQuestionId") == qid) {
            if ($thisNext.is(":hidden")) {
                if ($(this).attr("src").indexOf("sanjiaoNormal.gif") != -1) {
                    $(this).attr("src", "../Images/sanjiaoExpend.gif");
                }
                $thisNext.slideDown();
            } else {
                if ($(this).attr("src").indexOf("sanjiaoExpend.gif") != -1) {
                    $(this).attr("src", "../Images/sanjiaoNormal.gif");
                }
                $thisNext.slideUp();
            }
            return;
        } else {
            if ($(this).attr("src").indexOf("sanjiaoNormal.gif") != -1) {
                $(this).attr("src", "../Images/sanjiaoExpend.gif");
            }
            var strArray = new Array();
            strArray.push('<tr expandQuestionId="' + qid + '">');
            strArray.push('<td colspan="14">');
            strArray.push('<div style="border:1px dotted rgb(190,210,245);margin:0px 5px;padding:5px;" id="lo_question_details_container_' + qid + '"><center><img alt="loading..." src="../Images/ajax-loader_b.gif" /></center></div>');
            strArray.push('<td>');
            strArray.push('</tr>');
            $(strArray.join('')).insertAfter($this);
            bindReferenceAnswerListForQuestion({
                solutionId: "lo_question_details_solution_" + qid,
                hintId: "lo_question_details_hint_" + qid,
                tabsNodeId: "lo_question_details_container_" + qid,
                questionId: qid,
                qpvSeedId: qpvSID,
                // parentId:result[i].parentId,
                sectionId: simpleUser.SectionId,
                roleId: simpleUser.roleId,
                answerTypeId: $this.attr("questionTypeId"),
                algorithmFlag: $this.find("td[algorithmFlag=true]").html() == "Y" ? 1 : 0
            });
            //            QM_excuteGetReferenceAnswersList({
            //                solutionId: "lo_question_details_solution_" + qid,
            //                hintId: "lo_question_details_hint_" + qid,
            //                tabsNodeId: "lo_question_details_container_" + qid,
            //                questionId: qid,
            //                sectionId: simpleUser.SectionId,
            //                roleId: simpleUser.roleId,
            //                answerTypeId: $this.attr("questionTypeId"),
            //                isHuoDongTi: $this.find("td[algorithmFlag=true]").html()
            //            }, simpleUser);
        }
    });

    $trQ.find("input[type=checkbox]").click(function (event) {
        event.stopPropagation();
    });

    // QM_setExistedQuestionForSelectedStatus();
}

//根据loId返回所有Question
function QM_excuteGetQuestionOfLoList(loId, _simpleUser, context) {
    context["loId"] = loId;
    TestWS.getQuestionOfLoList0(loId, _simpleUser, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "getQuestionOfLoList0", context: context }, null);
}

//点击知识点显示该知识点所对应的Question
function QM_onKnowlegesRowClick(img, loId) {
    var o = img.parentNode.parentNode;
    if (o.nextSibling.firstChild.firstChild.style.display != "none") {
        o.nextSibling.firstChild.firstChild.style.display = "none";
        o.parentNode.parentNode.style.border = "";
        o.firstChild.firstChild.src = "../Images/sanjiaoNormal.gif";
        o.style.backgroundColor = "";
    } else {
        o.nextSibling.firstChild.firstChild.style.display = "block";
        o.parentNode.parentNode.style.border = "solid 8px #BED7F5";
        o.firstChild.firstChild.src = "../Images/sanjiaoExpend.gif";
        o.style.backgroundColor = "#f3f8fe";
        if (o.nextSibling.firstChild.firstChild.innerHTML.indexOf("ajax-loader_b.gif") != -1) {
            //QM_excuteGetReferenceAnswersList({solutionId:"divQSolution_"+qid,hintId:"divQHint_"+qid,tabsNodeId:"divQExInfo_"+qid,questionId:qid,sectionId:simpleUser.SectionId,roleId:simpleUser.roleId,answerTypeId:answerTypeId,isHuoDongTi:o.lastChild.innerHTML},simpleUser);
            QM_excuteGetQuestionOfLoList(loId, simpleUser, { targetContainerId: "divLOExInfo_" + loId });
        }
    }
}

//成功返回所有知识点后生成table
function onGetKnowledgeGradesOfStructureListSuccessed(result) {
    var tableStrBuilder = new Sys.StringBuilder();

    tableStrBuilder.append(
      "<table id=\"tableKnowlegesForBookStrucuture\" class=\"gridviewblue\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"text-align:left;\">"
    //      + "<tr class=\"titlerow\">"
    //      + "<th style=\"width:16px;\">&nbsp;</th>"
    //      + "<th style=\"width:75px;\">Book Unit</th>"
    //      + "<th>Knowledge Point</th>"
    //      + "</tr>"

          + "<tr class=\"titlerow\">"
          + "<td>"
          + "<table cellspacing=\"0\" cellpadding=\"0\" width=\"100%\">"
          + "<tr>"
          + "<th style=\"width:16px;\">&nbsp;</th>"
          + "<th style=\"width:75px;text-align:center;\">单元</th>"
          + "<th>知识点</th>"
          + "<th style='width:70px;'>知识点描述</th>"
          + "</tr>"
          + "</table>"
          + "</td>"
          + "</tr>"
      );

    var tbodyStrBuilder = new Sys.StringBuilder("");
    if (result != null) {
        result.findAll("exampleQuestionFlag", "0");
        var temp1 = new Array();
        var temp2 = new Array();
        for (var i = 0; i < result.length; i++) {
            if (result[i].exampleQuestionFlag == "0") temp2.push(result[i]);
            else temp1.push(result[i]);
        }
        temp1.addRange(temp2);
        result = temp1;

        for (var i = 0; i < result.length; i++) {
            tbodyStrBuilder.append(html_row(result[i], i));
            //            if (i % 2 == 1)//奇数
            //            {
            //                tbodyStrBuilder.append("<tr><td id=\"td2RowContainer_" + result[i].loId + "\" class=\"evenrow\">");
            //            }
            //            else //偶数
            //            {
            //                tbodyStrBuilder.append("<tr><td id=\"td2RowContainer_" + result[i].loId + "\" class=\"oddrow\">");
            //            }
            //            tbodyStrBuilder.append("<table cellspacing=\"0\" cellpadding=\"0\" width=\"100%\">");
            //            var questionNum = result[i].exampleQuestionFlag;
            //            if (typeof questionNum && Number(questionNum) != "NaN" && Number(questionNum) > 0) {
            //                tbodyStrBuilder.append("<tr style=\"cursor:pointer;text-align:right;\" onclick=\"QM_onKnowlegesRowClick(this,'" + result[i].loId + "')\">"
            //            + "<td style=\"width:16px;\"><img src=\"../Images/sanjiaoNormal.gif\" /></td>");
            //            }
            //            else {
            //                tbodyStrBuilder.append("<tr><td style=\"width:16px;\"><img style=\"visibility:hidden\" src=\"../Images/sanjiaoNormal.gif\" /></td>");
            //            }
            //            tbodyStrBuilder.append("<td style=\"width:75px;text-align:center;\">" + result[i].unit + "</td>"
            //            + "<td style=\"text-align:left;\">" + result[i].objectivesName + " <br/>(<i>" + result[i].exampleQuestionFlag + " Quesions</i>)" + "</td>"
            //            + "</tr>"
            //            + "<tr><td colspan=\"3\">"
            //            + "<div id=\"divLOExInfo_" + result[i].loId + "\" style=\"padding:0px;display:none\"><center><img src=\"../Images/ajax-loader_b.gif\"/></center></div>"
            //            + "</td></tr></table></td></tr>");
        }
    }
    tableStrBuilder.append(tbodyStrBuilder.toString() + "</table>");
    if (result == null || result.length == 0) {
        tableStrBuilder.append("<div>没有任何记录</div>")
    }

    $get("div_questions").innerHTML = tableStrBuilder.toString();

}

function QM_ShowKPDetails(itemId, evt) {
    try {
        if (window.event) {
            evt.cancelBubble = true;
        }
        else if (evt) {
            evt.stopPropagation();
        }
    } catch (e) { }
    new ShowDetails({ data: { itemId: itemId }, show_type: "1", type: "0", jbox_options: { opacity: 0.1} }).show();

}

function html_row(knowledgeGrades, index) {
    var tbodyStrBuilder = new Sys.StringBuilder("");

    if (index % 2 == 1)//奇数
    {
        tbodyStrBuilder.append("<tr><td id=\"td2RowContainer_" + knowledgeGrades.itemId + "\" class=\"evenrow\">");
    }
    else //偶数
    {
        tbodyStrBuilder.append("<tr><td id=\"td2RowContainer_" + knowledgeGrades.itemId + "\" class=\"oddrow\">");
    }
    tbodyStrBuilder.append("<table cellspacing=\"0\" cellpadding=\"0\" width=\"100%\">");
    var questionNum = knowledgeGrades.exampleQuestionFlag;
    var parentFlag = "-1"; // (knowledgeGrades.parentFlag =="1" || knowledgeGrades.questionTypeId == "6") && (!knowledgeGrades.parentId || knowledgeGrades.parentId == "" || knowledgeGrades.parentId == knowledgeGrades.id) ? "1" : "0";
    if (knowledgeGrades.parentFlag =="1" || knowledgeGrades.questionTypeId == "6" && (!knowledgeGrades.parentId || knowledgeGrades.parentId == "" || knowledgeGrades.parentId == knowledgeGrades.id)) {
        parentFlag = "1";
    } else if (knowledgeGrades.parentId && knowledgeGrades.parentId != "" && knowledgeGrades.parentId != knowledgeGrades.id) {
        parentFlag = "0";
    }
    if (typeof questionNum && Number(questionNum) != "NaN" && Number(questionNum) > 0) {
        if (parentFlag == "-1") {
            tbodyStrBuilder.append("<tr style=\"cursor:default;text-align:right;\">"
            + "<td style=\"width:16px;\"><img style=\"cursor:pointer;\" onclick=\"QM_onKnowlegesRowClick(this,'" + knowledgeGrades.itemId + "')\" src=\"../Images/sanjiaoNormal.gif\" /></td>");
        } else if (parentFlag == "0") {
            tbodyStrBuilder.append("<tr style=\"cursor:default;text-align:right;\">"
            + "<td style=\"width:16px;\"><img style=\"cursor:pointer;\" onclick=\"QM_onKnowlegesRowClick(this,'" + knowledgeGrades.itemId + "')\" src=\"../Images/q_bullet_up.png\" /></td>");
        }
        else if (parentFlag == "1") {
            tbodyStrBuilder.append("<tr style=\"cursor:default;text-align:right;\" >"
            + "<td style=\"width:16px;\"><img src=\"../Images/bullet_go.png\" /></td>");
        }
    }
    else {
        if (parentFlag == "-1") {
            tbodyStrBuilder.append("<tr><td style=\"width:16px;\"><img style=\"visibility:hidden\" src=\"../Images/sanjiaoNormal.gif\" /></td>");
        } else if (parentFlag == "0") {
            tbodyStrBuilder.append("<tr><td style=\"width:16px;\"><img style=\"visibility:hidden\" src=\"../Images/q_bullet_up.png\" /></td>");
        }
        else if (parentFlag == "1") {
            tbodyStrBuilder.append("<tr><td style=\"width:16px;\"><img style=\"visibility:hidden\" src=\"../Images/bullet_go.png\" /></td>");
        }
    }
    tbodyStrBuilder.append("<td style=\"width:75px;text-align:center;\">" + knowledgeGrades.unit + "</td>"
            + "<td style=\"text-align:left;\">" + knowledgeGrades.itemName + " <br/>(<i>" + knowledgeGrades.exampleQuestionFlag + " Quesions</i>)" + "</td>"
            + "<td style='width:50px;text-align:center;'><img style=\"cursor:pointer;\" title=\"查看详细信息\" onclick='QM_ShowKPDetails(\"" + knowledgeGrades.itemId + "\",event)' src='../Images/application_view_detail.png'/></td>"
            + "</tr>"
            + "<tr><td colspan=\"4\">"
            + "<div id=\"divLOExInfo_" + knowledgeGrades.itemId + "\" style=\"padding:0px;display:none\"><center><img src=\"../Images/ajax-loader_b.gif\"/></center></div>"
            + "</td></tr></table></td></tr>");

    return tbodyStrBuilder.toString();
}

//function getQuestionAlgorithmWrapperByQuestionId(qid) {
//    var _questionAlgorithmValueWrapperArray = [];
//    if (temp_QuestionAlgorithmValueWrapperArray != null) {
//        for (var i = 0; i < temp_QuestionAlgorithmValueWrapperArray.length; i++) {
//            if (temp_QuestionAlgorithmValueWrapperArray[i].questionId == qid) {
//                _questionAlgorithmValueWrapperArray.push(temp_QuestionAlgorithmValueWrapperArray[i]);
//            }
//        }
//    }
//    return _questionAlgorithmValueWrapperArray;
//}

//var referenceAnswerArray=[];
//var temp_QuestionAlgorithmValueWrapperArray = null;
function onQuestionManagePageSuccessed(result, userContext, methodName) {
    if (userContext.userContext == "getJsSimpleUser") {
        $("#ContentPlaceHolder_QuestionManage1_Tabs1_tabPanel3_tab").hide();
        delete result.__type;
        simpleUser = result;
        if (simpleUser != null) {
            for (var key in simpleUser) {
                if (key != "__type") {
                    jq_simpleUser[key] = simpleUser[key];
                }
            }
        }
        //bindCoursesToDropDownList(simpleUser);
        $imgLoadingId.style.display = "block";
        if (simpleUser.roleId == "2") {
            bindBookListToDropDownList(simpleUser);
            $get("qImgLoading").style.display = "none";
            InitHeader(simpleUser);
        } else if (simpleUser.roleId == "0") {
            getBookId(simpleUser.isbn, simpleUser);
        }

        var args = getUrlParms();
        if (args["isbn"] && args["loid"]) {
            CmsWS.getQuestionIdByKp(args["loid"], simpleUser, function (_r, _userContext, _methodName) {
                if (_r && _r.length > 0) {
                    var questionIdArray = window.tempQuestionIdArray = _r;
                    bindDDLPageSize();
                    $(".pagination_ddl").show();
                    $("#div_questions").html('<center><img alt="loading..." src="../Images/ajax-loader_b.gif" /></center>');
                    bindKnowledgeGuidePagination(questionIdArray);
                    $imgLoadingId.style.display = "none";
                }
            }, onQuestionManagePageFailed, { userContext: "getQuestionIdByKp" }, null);
        }

        $("#btnQuestionSearch").click(function () {
            (new QuestionSearch({
                data: {
                    isbn: $("#ddlBookList").val(),
                    bookId: $("#ddlBookList").find("option:selected").attr("id"),
                    simpleUser: simpleUser
                },
                showMode: 0,
                containerId: "dvAdvancedSearch",
                callback: function (questionIds) {
                    $("div.pagination").show();
                    $("div.dvGotoPage").show();
                    window.tempQuestionIdArray = questionIds;
                    bindDDLPageSize();
                    $(".pagination_ddl").show();
                    bindKnowledgeGuidePagination(questionIds);
                }
            })).Show();
        });

        $("#btnKnowledgeSearch").click(function () {
            (new KnowledgePointSearch({
                data: {
                    bookId: $("#ddlBookList").find("option:selected").attr("id"),
                    simpleUser: simpleUser
                },
                showMode: 0,
                containerId: "dvAdvancedSearch",
                callback: function (KpIds) {
                    if (KpIds && KpIds.length > 0) {
                        $excuteWS("~CmsWS.GetKnowledgeGrades", { loIds: KpIds, sampleQuestionFlag: true,userId:simpleUser.userId, userExtendWrapper: simpleUser }, onQuestionManagePageSuccessed, null, { userContext: "getKnowledgeGradesOfStructureList" });
                    }
                }
            })).Show();
        });

        $("#btnTestSearch").click(function () {
            (new TestSearchDlg({
                data: {
                    bookId: $("#ddlBookList").find("option:selected").attr("id"),
                    simpleUser: SimpleUser
                },
                title: "通过试卷搜索",
                callback: function (testId) {
                    $excuteWS("~CmsWS.getQuestionForyTest", { testId: testId, userExtend: SimpleUser }, function (questionIds) {
                        $("div.pagination").show();
                        $("div.dvGotoPage").show();
                        window.tempQuestionIdArray = questionIds;
                        bindDDLPageSize();
                        $(".pagination_ddl").show();
                        bindKnowledgeGuidePagination(questionIds);
                    }, null, null);
                }
            })).Show();
        });

        $("#btnNoSeedPublish").click(function () {
            $.jBox.tip("正在保存...", 'loading');
            $(this).attr("disabled", "disabled");
            var bookId = $("#ddlBookList").find("option:selected").attr("id");
            $excuteWS("~CmsWS.saveQpvSeedByBookId", { bookId: bookId, usersExtendWrapper: simpleUser }, onQuestionManagePageSuccessed, null, { userContext: "saveQpvSeedByBookId" });
        });
    }
    else if (userContext.userContext == "cacheQuestionAlgorthmValue") {
        $get("qImgLoading").style.display = "none";
        if (result) {
            alert("成功!");
        } else {
            alert("失败!");
        }

    }
    else if (userContext.userContext == "getQuestionList") {

        if (result) {
            var htmlRow = new Array();
            var $tbody = $("#" + userContext.questionId);
            var num = $tbody.hasClass("oddrow") ? 0 : 1;
            var ids = "";
            for (var i1 = 0; i1 < result.length; i1++) {
                if (i1 % 2 == num)//奇数
                {
                    htmlRow.push("<tbody class='evenrow' id='" + result[i1].id + "'>");
                }
                else {
                    htmlRow.push("<tbody class='oddrow' id='" + result[i1].id + "'>");
                }
                htmlRow.push(html_row_question(result[i1]));
                htmlRow.push("</tbody>");
                if (i1 == result.length - 1) {
                    ids = ids + "#" + result[i1].id
                } else {
                    ids = ids + "#" + result[i1].id + ","
                }
            }
            $("#trQHeight_" + userContext.questionId).html("");
            if (ids != "") {
                $(ids).remove();
            }
            $(htmlRow.join('')).insertAfter($("#" + userContext.questionId));


        }
    }
    else if (userContext.userContext == "getQuestionOfLoList0") {
//        if (result[1]) {
//            temp_QuestionAlgorithmValueWrapperArray = result[1];
//        } else {
//            temp_QuestionAlgorithmValueWrapperArray = [];
//        }
        if (result[0]) {
            QM_onGetQuestionOfLoListSuccessed(result, userContext.context);
        } else {
            QM_onGetQuestionOfLoListSuccessed(result, userContext.context);
        }
    }
    else if (userContext.userContext == "getListByCourseAndUserId") {
        onGetListByCourseAndUserIdSuccessed(result);
    } else if (userContext.userContext == "getKnowledgeGradesOfStructureList") {
        QM_tempQuestionWrapperArray = [];
        onGetKnowledgeGradesOfStructureListSuccessed(result);
    }
    else if (userContext.userContext == "getQuestionForStructureId") {
        //        if(result==null)
        //        {
        //            $imgLoadingId.style.display="none";
        //            return;
        //        }
       // temp_QuestionAlgorithmValueWrapperArray = result[1] == null ? [] : result[1];
        onGetQuestionForStructureIdSuccessed(result == null ? [] : result);
        questionIdArray = [];
        resetAllGlobalVariables();
    } else if (userContext.userContext == "getBookContentStructureArray") {

        $("#btnQuestionNumberQuery").removeAttr("disabled");
        if ($get("ddlActions").value != "copy") {
            treeResult = result;
            if (simpleUser.roleId == "0") {
                $get("div_tree_questions").style.display = "block";
            }
            //$get("div_tree").innerHTML = getTreeMenuHTML(result, 1);
            QM_buildRelationTree($("#div_tree"), result[0], userContext.isbn);
            $get("qImgLoading").style.display = "none";
        } else {
            QM_buildRelationTree($("#divBookStructureOfQuestion"), result[0], userContext.isbn);
            //$get("divBookStructureOfQuestion").innerHTML = getTreeMenuHTML(result, 1, 2);
        }
        $("#tb_tree_questions").colResizable({
            liveDrag: true,
            minWidth: 100
        });
    } else if (userContext.userContext == "getQuestionTypeList") {
        onGetQuestionTypeListSuccessed(result);
        //QM_FunCompletedForEdit();
    } else if (userContext.userContext == "getTestQuestionTypeList") {
        onGetTestQuestionTypeListSuccessed(result);
        //QM_FunCompletedForEdit();
    } else if (userContext.userContext == "getLOExtendOfStructureList") {
        onGetLearningObjectiveExtendOfStructureListSuccessed(result);
    } else if (userContext.userContext == "saveQuestion") {
        if ($get("rdAlgorithmYes").checked && questionAlgorithmWrapperArray.length != 0) {

            if (result[0].parentId != null && result[0].parentId != "" && result[0].parentId != result[0].id) {
                doSaveUpdateQuestionAlgorithm(questionAlgorithmWrapperArray, result[0].parentId);
            } else {
                doSaveUpdateQuestionAlgorithm(questionAlgorithmWrapperArray, result[0].id);
            }
        }
        alert("保存成功!");
        
        clearAllQuestionInfo(result[0].id);
        questionIdArray = [];
        bindQuestionsToTable(_structureId);
        return;

    }
    else if (userContext.userContext == "updateQuestion") {

        if ($get("rdAlgorithmYes").checked && questionAlgorithmWrapperArray.length != 0) {
            //            doSaveUpdateQuestionAlgorithm(questionAlgorithmWrapperArray, result[0].id);

            if (result[0].parentId != null && result[0].parentId != "" && result[0].parentId != result[0].id) {
                doSaveUpdateQuestionAlgorithm(questionAlgorithmWrapperArray, result[0].parentId);
            } else {
                doSaveUpdateQuestionAlgorithm(questionAlgorithmWrapperArray, result[0].id);
            }
        }

        CmsWS.getQuestionForIds([result[0].id], simpleUser, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "updateThenGetQuestion" }, null);

        //            questionIdArray = [];
        //            bindQuestionsToTable(_structureId);

    }
    else if (userContext.userContext == "updateThenGetQuestion") {

        alert("更新成功!");
        
        clearAllQuestionInfo();
        //重绑一行
        //参数值赋给全局变量
        //var questionW = result;
        var questionW = result && result[0] ? result[0] : null;
        //模拟点击checkbox
        var ddlType = $("#ddlViewQuestionsByDiffCondition").val();
        if (ddlType == "-1" || ddlType == "1") {
            var tr = html_row_question(questionW);
            $("#" + questionW.id).html(tr);
            $("#cbx_q_" + questionW.id).attr("checked", "checked");
            getEditQuestionId(document.getElementById("cbx_q_" + questionW.id), questionW.id, _structureId)
        }
        else if (ddlType == "0") {
            var tr = html_row_questionFromKp(questionW);
            $("tr[questionId='" + questionW.id + "']").html(tr);
            $("#cbx_q_" + questionW.id).attr("checked", "checked");
            getEditQuestionId(document.getElementById("cbx_q_" + questionW.id), questionW.id, _structureId)
        }
        
        //$("#cbx_q_" + questionW.id).trigger("click");
//        var questionAlgorithValues = result[1];
//        if (questionAlgorithValues) {
//            for (var i = 0; i < questionAlgorithValues.length; i++) {
//                var id = questionAlgorithValues[i].id;
//                if (temp_QuestionAlgorithmValueWrapperArray) {
//                    var index = temp_QuestionAlgorithmValueWrapperArray.indexOf("id", id);
//                    if (index != -1) {
//                        temp_QuestionAlgorithmValueWrapperArray[index] = questionAlgorithValues[i];
//                    }
//                }
//                else {
//                    temp_QuestionAlgorithmValueWrapperArray = questionAlgorithalues;
//                    break;
//                }
//            }
//        }

        //clearAllQuestionInfo();
    }


    else if (userContext.userContext == "deleteQuestions") {
        if (result == true) {
            bindQuestionsToTable(_structureId);
            alert("成功!");
        } else {
            alert("失败!");
        }
        $get("ddlActions").value = "-1";
    } else if (userContext.userContext == "getBookId") {
        bookId = result;
        bindBookContentStructureListToTree(null, simpleUser.isbn, null);
    } else if (userContext.userContext == "getLoQuestionList") {
        onGetLoQuestionListSuccessed(result);
        //QM_FunCompletedForEdit();
    } else if (userContext.userContext == "getReferenceAnswersList") {


        if (userContext.context != null && userContext.context != undefined) {
            //referenceAnswerArray=result;
            //            bindTabs(false,true,true,true,[],result,$get(userContext.context.solutionId).innerHTML,$get(userContext.context.hintId).innerHTML,$get(userContext.context.tabsNodeId),userContext.context.questionId,userContext.context.sectionId,userContext.context.roleId,userContext.context.answerTypeId);
            if (userContext.context.algorithmFlag == "1") {
                var questionWrapper = new JEWS.EngineStudyGuide.QuestionWrapper();
                questionWrapper.id = userContext.context.questionId;
                questionWrapper.algorithmFlag = userContext.context.algorithmFlag;
                questionWrapper.parentId = userContext.context.parentId;
                //excuteQuestionAndReferenceAnswersChanage2(result,[questionWrapper],null,userContext.context,simpleUser);
//                var _questionAlgorithmValueWrapperArray = [];
//                if (temp_QuestionAlgorithmValueWrapperArray != null) {
//                    for (var i = 0; i < temp_QuestionAlgorithmValueWrapperArray.length; i++) {
//                        if (temp_QuestionAlgorithmValueWrapperArray[i].questionId == questionWrapper.id || (temp_QuestionAlgorithmValueWrapperArray[i].questionId != questionWrapper.id && temp_QuestionAlgorithmValueWrapperArray[i].questionId == questionWrapper.parentId)) {
//                            _questionAlgorithmValueWrapperArray.push(temp_QuestionAlgorithmValueWrapperArray[i]);
//                        }
//                    }
//                }
                //excuteQuestionAndReferenceAnswersChanage2(result,[questionWrapper],null,userContext.context,simpleUser);

                //excuteQuestionAndReferenceAnswersChanage1(result, [questionWrapper], _questionAlgorithmValueWrapperArray, userContext.context, simpleUser);
                onQuestionAndReferenceAnswersChanage2Successed([result,[questionWrapper]],  userContext.context )
            } else {
                //bindTabs(false,true,true,true,[],result,$get(userContext.context.solutionId).innerHTML,$get(userContext.context.hintId).innerHTML,$get(userContext.context.tabsNodeId),userContext.context.questionId,userContext.context.sectionId,userContext.context.roleId,userContext.context.answerTypeId);
                //userContext.context
                var _context = { context: userContext.context, referenceArray: result };
                excuteGetLOForQuestion(_context, simpleUser);
            }

        } else {
            onGetReferenceAnswersListSuccessed(result);
        }
        if ($("#ddlActions").val() == "edit") {
            $divQuestionManage1.style.display = "none";
            $("#divQuestionManage2").show();
            $("#div_questions").hideLoading();
        }
        //QM_FunCompletedForEdit();
    }
    else if (userContext.userContext == "getLOForQuestion") {
        onGetLOForQuestionSuccessed(result, userContext.context);
        //QM_FunCompletedForEdit();
    }
    else if (userContext.userContext == "checkQuestionAlgorithmValues") {
        onCheckQuestionAlgorithmValuesSuccessed(result, userContext.oPreviewCell, userContext.previewFlag);
    } else if (userContext.userContext == "saveUpdateQuestionAlgorithm") {
        //        $get("divQuestionSeedManage").innerHTML = '<span style="font-size:11px;color:blue;" onclick="openNewWindow(\'../QuestionBank/QuestionSeedManage.aspx?userId='+window.simpleUser.userId+'&sectionId=&questionId=' + userContext.questionId + '\')"><img style="cursor:pointer;" alt="" title="Seed Manage" src="../CMS/Images/world_key.png"/></span>';
        //        return;

    } else if (userContext.userContext == "getQuestionAlgorithmList") {
        onGetQuestionAlgorithmListSuccessed(result);
        //QM_FunCompletedForEdit();
    } else if (userContext.userContext == "getQuestionEdit") {
        onGetQuestionSuccessed(result);
    } else if (userContext.userContext == "questionAndReferenceAnswersChanage") {
        onQuestionAndReferenceAnswersChanageSuccessed(result, userContext.context);
    }
    else if (userContext.userContext == "questionAndReferenceAnswersChanage2") {
        onQuestionAndReferenceAnswersChanage2Successed(result, userContext.context);
    }
    else if (userContext.userContext == "getBookList") {
        onGetBookListSuccessed(result);
    } else if (userContext.userContext == "getQuestionAlgorithmByNbList") {
        onGetQuestionAlgorithmByNbListSuccessed(result);
    }
    else if (userContext.userContext == "getQuestionByNumber") {
        if (result != null) {
            var $ddlBookList = $("#ddlBookList");
            if (result && result[0].bookId != null && result[0].bookId != "" && $ddlBookList.val() != result[0].bookId) {
                $ddlBookList.find('option[bookId=' + result[0].bookId + ']').attr("selected", "selected").trigger("change");
            }
            //onDdlBookListChange($("#ddlBookList").get(0));
//            temp_QuestionAlgorithmValueWrapperArray = result[1];
            onGetQuestionForStructureIdSuccessed(result);
        }

        questionIdArray = [];
        resetAllGlobalVariables();
    }
    else if (userContext.userContext == "saveQpvSeedByBookId") {
        $("#btnNoSeedPublish").removeAttr("disabled");
        if (result) {
            $.jBox.tip('保存成功', 'success');
        } else {
            $.jBox.tip('保存失败', 'error');
        }
    }

    if ($imgLoadingId.style.display != "none") {
        $imgLoadingId.style.display = "none";
    }
}

//function QM_FunCompletedForEdit(algorithmFlag) {
    
//    if ($("#ddlActions").val() == "edit") {
//        if (algorithmFlag != null) {
//            this.algorithmFlag = algorithmFlag;
//            this.index = 1;
//        } else {
//            this.index++;
//        }

//         if ($ddlAnswerType.options.length > 1 && $ddlQuestionType.options.length > 1) {
//             if ((this.algorithmFlag == "1" && this.index == 5) || (this.algorithmFlag == "0" && this.index == 4)) {
//                $divQuestionManage1.style.display = "none";
//                $("#divQuestionManage2").show();
//                $("#div_questions").hideLoading();
//            }
//        }else{
//             if ((this.algorithmFlag == "1" && this.index == 6) || (this.algorithmFlag == "0" && this.index == 6)) {
//                $divQuestionManage1.style.display = "none";
//                $("#divQuestionManage2").show();
//                $("#div_questions").hideLoading();
//            }
//        }
//    }
//}

function onGetQuestionAlgorithmByNbListSuccessed(result) {
    if (result != null) {
        clearTableAlgorithmInfo();
        onGetQuestionAlgorithmListSuccessed(result);
    } else {
        alert("该题的活动题参数不存在或者题号不正确")
    }
    $get("divLoading22").style.display = "none";
}

function onQuestionManagePageFailed(error, userContext, methodName) {

    alert("error at function: " + userContext + "\n" +
        "调用Microsoft桥接器（Bridge）失败信息：" + error.get_message() +
        "\nStack Trace：" + error.get_stackTrace() +
        "\nStatus Code：" + error.get_statusCode() +
        "\nExcept Type：" + error.get_exceptionType() +
        "\Time Out：" + error.get_timedOut());
}


var preHTML = qPrefix + "QuestionManage1_";
function clickSampleQuestion(loId, loName) {
    if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
        $get('ifrSampelQuestion').Document.location.href = "about:blank";
    }
    else if (window.navigator.userAgent.indexOf("Firefox") >= 1) {
        $get('ifrSampelQuestion').contentDocument.location.href = "about:blank";
    }
    var userId = simpleUser.userId;
    var sectionId = simpleUser.SectionId;
    var plSampleQuestion = preHTML + "plSampleQuestion";
    $get('sampleQuestionHeader').innerHTML = "Sample Questions for \"" + loName + "\"";
    var pars = "loId=" + loId;
    if (courseId != null) {
        pars += "&userId=" + userId;
    }
    if (sectionId != null) {
        pars += "&sectionId=" + sectionId;
    }
    document.getElementById('ifrSampelQuestion').src = "../SharePage/SampleQuestion.aspx?" + pars;
    document.getElementById(plSampleQuestion).style.top = document.documentElement.scrollTop + 100 + "px";
    document.getElementById(plSampleQuestion).style.left = "25%";
    document.getElementById(plSampleQuestion).style.display = "block";

}
function closeSampleQuestion() {

    if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
        $get('ifrSampelQuestion').Document.location.href = "about:blank";
    }
    else if (window.navigator.userAgent.indexOf("Firefox") >= 1) {
        $get('ifrSampelQuestion').contentDocument.location.href = "about:blank";
    }
    var plSampleQuestion = preHTML + "plSampleQuestion";
    $get(plSampleQuestion).style.display = "none";
}

/////////////////////////////////////////////小蒋↓////////////////////////////////////////////////////////////
var selectedFlag = 0;
var autoCompleteData = [];
var autoCompleteData1 = [];
var autoCompleteData2 = [];
var storage = [];
var mark = "";
//window.onload = function () {
//    //    emath_overflowDivArray.push("divAnswerFeedbackContent");
//    //   document.body.onmouseover=function(){
//    //        var divAnswerFeedbackContentFirstChild= $get("divAnswerFeedbackContent").firstChild;
//    //        if($get("divAnswerFeedbackContent").style.display!="none" && divAnswerFeedbackContentFirstChild!=null && divAnswerFeedbackContentFirstChild.id!="div_IframeEditor")
//    //        {
//    //            $get("divAnswerFeedbackContent").style.overflow="auto";
//    //        }
//    //    }
//}
$(function () {
    ///em函数
    autoCompleteData1.push("abd(Object a)_a为参数数组,用于控制数组内的参数重复");
    autoCompleteData1.push("abs(Object a)_返回任何数绝对值");
    autoCompleteData1.push("acos(Object a)_返回角的反余弦,范围在0.0到pi之间");
    autoCompleteData1.push("asin(Object a)_返回角的反正弦,范围在-pi/2到pi/2之间");
    autoCompleteData1.push("atan(Object a)_返回角的反正切,范围在-pi/2到pi/2之间");
    autoCompleteData1.push("atan2(Object y, Object x)_将矩形坐标(x,y)转换成极坐标(r, theta)");
    autoCompleteData1.push("cbrt(Object a)_返回double值的立方根");
    autoCompleteData1.push("ceil(Object a)_返回最小的(最接近负无穷大)double值,该值大于或等于参数,并且等于某个整数");
    autoCompleteData1.push("cos(Object a)_返回角的三角余弦");
    autoCompleteData1.push("cosh(Object a)_返回double值的双曲线余弦");
    autoCompleteData1.push("complementArray(Object a, Object b)_返回两个集合的余集");
    autoCompleteData1.push("divisor(Object a)_返回一个数的所有约数");
    autoCompleteData1.push("exp(Object a)_返回欧拉数e的double次幂的值");
    autoCompleteData1.push("evalTex(Object a,Object b)_latex的运算，结果为分数 如:'\\frac{3}{2},\\frac{3}{2}', '/' ");
    autoCompleteData1.push("evalTexNum(Object a,Obejct b,Object c)_latex的运算，结果为数字 如:'\\frac{3}{2},\\frac{3}{2}', '/' ,2");
    autoCompleteData1.push("evalTexAv(Object a,Object b)_latex的运算，结果为分子分母的数组 如:'\\frac{3}{2},\\frac{3}{2}', '/' ");
    autoCompleteData1.push("expm1(Object a)_返回ex -1");
    autoCompleteData1.push("emJs(Object strJs)_执行与JS格式一样的语句 如em.emJs(xx=5;yy=em.random(2,10);if(8==8){xx=yy*2.0;};return xx;)");
    autoCompleteData1.push("floor(Object a)_返回最大的(最接近正无穷大)double值,该值小于或等于参数,并且等于某个整数");
    autoCompleteData1.push("factorial(Object n )_求n的阶乘,n是整数");
    autoCompleteData1.push("fracA3(Object p, Object q)_分数化简  如4又3分之2  4,2,3");
    autoCompleteData1.push("fracA3(Object a)_分数化简,输入latex或者数字  如4又3分之2  4,2,3");
    autoCompleteData1.push("fracA2(Object p, Object q)_分数化简  如4又3分之2  11,2");
    autoCompleteData1.push("fracA2(Object a)_分数化简，输入latex或者数字  如4又3分之2  11,2");
    autoCompleteData1.push("frac2Tex(Object p, Object q)_分数化简 ,化简成如7/2");
    autoCompleteData1.push("frac2Tex(Object a)_latex分数化简 ,化简成如7/2的latex，输入的是latex或者数字");
    autoCompleteData1.push("gcd(Object... a)_多个数的最大公约数，可以传2-5个数");
    autoCompleteData1.push("gcd(Object a)_一个数组格式的数求最大公约数 ,加引号");
    autoCompleteData1.push("getAV(Object a, Object b)_从一组数据里面返回一个值，加引号,如:四川,成都,青北江 返回一个数，b=1返回四川");
    autoCompleteData1.push("getAV(Object a, Object b,Object c)_从数组里面取值,如  如a=四川,成都,青北江;湖南,长沙,县城,   可以使用getAv(a,1,3) 就取清北江");
    autoCompleteData1.push("getAvFracs(Object a)_把数字或者latex都转换成分子分母的一个数组");
    autoCompleteData1.push("hypot(Object x, Object y)_返回squart(x2 + y2),没有中间溢出或下溢");
    autoCompleteData1.push("IEEEremainder(Object f1, Object f2)_按照IEEE 754标准的规定, 对两个参数进行余数运算");
    autoCompleteData1.push("interArray(Object a, Object b)_求两个集合的交集");
    autoCompleteData1.push("lcm(Object... a)_多个数的最小公倍数,可以传2-5个数");
    autoCompleteData1.push("lcm(Object a)_一个数组格式的数求最小公倍数 ,加引号");
    autoCompleteData1.push("log(Object a)_返回(底数是e)double值的自然对数");
    autoCompleteData1.push("log10(Object a)_返回double值的底数为10的对数");
    autoCompleteData1.push("log1p(Object a)_返回参数与1的和的自然对数");
    autoCompleteData1.push("mFrac2Tex(Object a, Object b)_分数化简,化成如3(1/2)的latex格式");
    autoCompleteData1.push("mFrac2Tex(Object a)_分数化简,化成如3(1/2)的latex格式,输入的是latex或者数字");
    autoCompleteData1.push("max(Object a, Object b)_返回两个数值中较大的一个");
    autoCompleteData1.push("min(Object a, Object b)_返回两个数值中较小的一个");
    autoCompleteData1.push("mod(Object a, Object b)_求a除b的余数");
    autoCompleteData1.push("pow(Object a, Object b)_返回第一个参数的第二个参数次幂的值");
    autoCompleteData1.push("PI()_返回圆周率");
    autoCompleteData1.push("primeDiv(Object a)_得到一个数的不重复的素数");
    autoCompleteData1.push("poly(Object b,Object a)_生成多项式 ，不需要指定指数  如:a为'3,2,1'，b为x就返回3x^2+2x+1");
    autoCompleteData1.push("polySE(Object xx,Object a,Object b)_生成多项式,并需要指定指数 如xx为x,xx可以为一个或者多个，如:'x,y,z',a为'2,3,5',b为'-2,7,6' 就返回2x^-2+3x^7+5x^6");
    autoCompleteData1.push("pfactor2Tex(Object number)_把一个整数分解成素数相乘,弄成如3^{3}2^{1}这样的形式    乘号 \cdot");
    autoCompleteData1.push("qradical2Tex(Object a,Object e,Object b,Object c,Object d)_带2次根号的分数化简(-3," + ",3,2,-9),表示化-9分子-3+3倍根号下2");
    autoCompleteData1.push("random()_返回带正号的double值,大于或等于0.0,小于1.0");
    autoCompleteData1.push("random(Object a, Object b, Object c)_返回一个区间的小数");
    autoCompleteData1.push("randomS(Object a, Object b, Object c,Object d)_返回一个区间不包含第4个参数的数字的随机小数");
    autoCompleteData1.push("random(Object a, Object b)_返回一个区间的随机整数");
    autoCompleteData1.push("randomS(Object a, Object b,Object c)_返回一个区间不包含第三个参数的数字的随机整数");
    autoCompleteData1.push("randomArray(Object a)_从一个数组里面返回一个值 ,加引号 ,用逗号隔开,注意仅是一个值，不代表是数值");
    autoCompleteData1.push("randomArraySem(Object a)_从一个数组里面返回一个值 ,加引号 ,用分号隔开,注意仅是一个值,不代表是数值");
    autoCompleteData1.push("randomArrayIndex(Object a,Object b)_从一个数组里面返回一个指定数组序号的值 ,加引号 ,用分号隔开,注意仅是一个值，不代表是数值");
    autoCompleteData1.push("randArray(Object a)_返回一组随机整数  如'2,9;3,6;10,15'返回8,5,14");
    autoCompleteData1.push("randomMArray(Object a)_从一个数组里面返回一个值 ,加引号 如:四川,成都,青北江;湖南,长沙,县城");
    autoCompleteData1.push("randomMVArray(Object a)_定义一个2维数组 ，加引号 如:四川,成都,青北江;湖南,长沙,县城");
    autoCompleteData1.push("rint(Object a)_返回其值最接近参数并且是整数的double值");
    autoCompleteData1.push("roundV(Object a)_向量的运算,如3*array(3,4,5)+2*array(4,3,6)、3*array(3,4,5)-2*array(4,3,6)、3*array(3,4,5)*2*array(4,3,6)");
    autoCompleteData1.push("roundTex(Object a)_向量的运算,如整数，小数，latex分数的向量运算 ，如:3*array(\\frac{3}{2},\\frac{2}{1},\\frac{1}{1})*\\frac{2}{1}*array(\\frac{4}{1},\\frac{3}{4},\\frac{2}{1}");
    autoCompleteData1.push("round(Object a)_返回最接近参数的整数");
    autoCompleteData1.push("round(Object v, Object scale)_提供精确的小数位四舍五入处理");
    autoCompleteData1.push("roundA(Object v, Object scale)_提供精确的小数位四舍五入处理，小数位数一定为设定的位数");
    autoCompleteData1.push("radicalA(Object k,Object n)_根号化简,如4倍3次根号下2为:4,3,2");
    autoCompleteData1.push("radical2Tex(Object k, Object n)_根号化简,k是开几次根号，n是要开根的整数");
    autoCompleteData1.push("radical2Tex(Object a)_根号化简,输入的是latex");
    autoCompleteData1.push("sizeStrs(Object a)_返回如'2,3,6'的一个数字长度，就是有几个数字");
    autoCompleteData1.push("signum(Object a)_返回参数的符号函数,如果参数是零,则返回零,如果参数大于零,则返回1.0;如果参数小于零,则返回-1.0");
    autoCompleteData1.push("sin(Object a)_返回角的三角正弦");
    autoCompleteData1.push("sinh(Object a)_返回double值的双曲线正弦");
    autoCompleteData1.push("sqrt(Object a)_返回正确输入的double值的正平方根");
    autoCompleteData1.push("sortStr(Object a)_返回一组字符排序");
    autoCompleteData1.push("sortNum(Object a)_返回一组数字排序");
    autoCompleteData1.push("tan(Object a)_返回角的三角正切");
    autoCompleteData1.push("tanh(Object a)_返回double值的双曲线余弦");
    autoCompleteData1.push("toDegrees(Object a)_将用弧度测量的角转换为近似相等的用度数测量的角");
    autoCompleteData1.push("toRadians(Object a)_将用度数测量的角转换为近似相等的用弧度测量的角");
    autoCompleteData1.push("ulp(Object a)_返回参数的ulp大小");
    autoCompleteData1.push("unionArray(Object a, Object b)_返回两个集合的并集");

    ///////////活动图,所有画图的函数(除ps外),都可以多传一个颜色的参数，颜色参数放在最后。ps有关的函数取代了原来的fx和xyCd函数
    //ps为绘图合并后的函数，参数fuction的格式为 Math.Pow(x,3)-2或者gd.fPolygonXy(0,0,2,3,4,2)
    //绘多个用:隔离开来，fuctions参数用{}括起来
    //例如:gd.ps(0,10,{gd.circleXy(2,3,2):gd.dotXy(2,3):gd.strXy((2,3),2,3):Math.Pow(x,2)})
    autoCompleteData2.push("arc2R(object x, object y, object r1, object r2, object startAngle, object sweepAngle)_画弧线,椭圆的一部份");
    autoCompleteData2.push("arc(object x, object y, object r, object startAngle, object sweepAngle)_画弧形，圆的一部份");
    autoCompleteData2.push("arc2RXy(object x, object y, object r1, object r2, object startAngle, object sweepAngle)_在坐标上画弧线，椭圆的一部份")
    autoCompleteData2.push("arcXy(object x, object y, object r, object startAngle, object sweepAngle)_在坐标上画弧形，圆的一部份");
    autoCompleteData2.push("ellipse(object x, object y, object r1, object r2)_画椭圆,由一个点和两个半径决定");
    autoCompleteData2.push("ellipseXy(object x, object y, object r1, object r2)_在坐标上画椭圆,由一个点和两个半径决定");
    autoCompleteData2.push("circle(object x, object y, object r)_画圆，由一个点和一个半径决定");
    autoCompleteData2.push("circleXy(object x, object y, object r)_在坐标上画圆，由一个点和一个半径决定");
    autoCompleteData2.push("dotXy(object x, object y)_在坐标系填充一个固定大小的点，就是一个小圆,由一个点决定,可以确定点的大小,但是在确定点的大小的时候,颜色参数必须填写(同时多两个参数)");
    autoCompleteData2.push("line(object x1, object y1, object x2, object y2)_画线");
    autoCompleteData2.push("lineXy(object x1, object y1, object x2, object y2)_在坐标系中画线");
    autoCompleteData2.push("lineDot(object x1, object y1, object x2, object y2)_画实虚线");
    autoCompleteData2.push("lineDotXy(object x1, object y1, object x2, object y2)_在坐标系中画虚线");
    autoCompleteData2.push("lineCap(object x1, object y1, object x2, object y2)_画带箭头的实线");
    autoCompleteData2.push("lineCapXy(object x1, object y1, object x2, object y2)_在坐标系统中画带箭头的实线");
    autoCompleteData2.push("lineCapDot(object x1, object y1, object x2, object y2)_画带箭头的虚线");
    autoCompleteData2.push("lineCapDotXy(object x1, object y1, object x2, object y2)_在坐标系统中画带箭头的虚线");
    autoCompleteData2.push("polygon(params object[] parameters)_画多边形,最后一个参数是定义颜色的,也可以不要");
    autoCompleteData2.push("polygonXy(params object[] parameters)_在坐标系画多边形,最后一个参数是定义颜色的,也可以不要");
    autoCompleteData2.push("pie2R(object x, object y, object r1, object r2, object startAngle, object sweepAngle)_画扇形，椭圆的一部份");
    autoCompleteData2.push("pie(object x, object y, object r, object startAngle, object sweepAngle)_画扇形，圆的一部份");
    autoCompleteData2.push("pie2RXy(object x, object y, object r1, object r2, object startAngle, object sweepAngle)_在坐标系画扇形，椭圆的一部份");
    autoCompleteData2.push("pieXy(object x, object y, object r, object startAngle, object sweepAngle)_在坐标系画扇形，圆的一部份");

    autoCompleteData2.push("ps(object sx, object ex,object sy,object ey object fuctions)_在坐标系统里面画函数与几何图形,x或y轴的起始点可选(一组都不要就是默认,只要x轴y轴会自动计算,xy轴都要就是定死了一个坐标系),函数(fuctions)参数前可以加三个（如果要其中一个，就必须三个都加）参数xUnit(为0表示不指定),yUnit,numFlag(0表示要不显示坐标数字，1表示显示)");
    autoCompleteData2.push("psX(object sx, object ex,object sy,object ey object fuctions)_在坐标系统里面画函数与几何图形,x或y轴的起始点可选(一组都不要就是默认,只要x轴y轴会自动计算,xy轴都要就是定死了一个坐标系),函数(fuctions)参数前可以加三个（如果要其中一个，就必须三个都加）参数xUnit(为0表示不指定),yUnit,numFlag(0表示要不显示坐标数字，1表示显示)");
    autoCompleteData2.push("psNet(object sx, object ex,object sy,object ey object fuctions)_在有网络的坐标系统里面画函数与几何图形,x或y轴的起始点可选(一组都不要就是默认,只要x轴y轴会自动计算,xy轴都要就是定死了一个坐标系),函数(fuctions)参数前可以加三个（如果要其中一个，就必须三个都加）参数xUnit(为0表示不指定),yUnit,numFlag(0表示要不显示坐标数字，1表示显示)");
    autoCompleteData2.push("psNoCd(object sx, object ex,object sy,object ey object fuctions)_在不显示坐标系的坐标系统里面画函数与几何图形,x或y轴的起始点可选(一组都不要就是默认,只要x轴y轴会自动计算,xy轴都要就是定死了一个坐标系),函数(fuctions)参数前可以加三个（如果要其中一个，就必须三个都加）参数xUnit(为0表示不指定),yUnit,numFlag(0表示要不显示坐标数字，1表示显示)");
    autoCompleteData2.push("psNoCsd(object sx, object ex,object sy,object ey object fuctions)_在不显示刻度的坐标系统里面画函数与几何图形,x或y轴的起始点可选(一组都不要就是默认,只要x轴y轴会自动计算,xy轴都要就是定死了一个坐标系),函数(fuctions)参数前可以加三个（如果要其中一个，就必须三个都加）参数xUnit(为0表示不指定),yUnit,numFlag(0表示要不显示坐标数字，1表示显示)");

    autoCompleteData2.push("rectangle(object x, object y, object width, object height)_画矩形");
    autoCompleteData2.push("rectangleXy(object x, object y, object width, object height)_在坐标系上画矩形");
    autoCompleteData2.push("square(object x, object y, object side)_画正方形");
    autoCompleteData2.push("squareXy(object x, object y, object side)_在坐标系中画正方形");
    autoCompleteData2.push("str(object str,object x,object y)_画字符串");
    autoCompleteData2.push("str(object str,object x,object y，object color)_画字符串，并指定颜色");
    autoCompleteData2.push("strXy(object str, object x, object y)_在坐标系中画文字");
    autoCompleteData2.push("strXyC(object str,object x,object y,object color)_在坐标系中画文字，并指定颜色");
    autoCompleteData2.push("fEllipse(object x, object y, object r1, object r2)_填充椭圆,由一个点和两个半径决定");
    autoCompleteData2.push("fEllipseXy(object x, object y, object r1, object r2)_在坐标系中填充椭圆,由一个点和两个半径决定");
    autoCompleteData2.push("fCircle(object x, object y, object r)_填充画圆，由一个点和一个半径决定");
    autoCompleteData2.push("fCircleXy(object x, object y, object r)_在坐标系填充画圆，由一个点和一个半径决定");
    autoCompleteData2.push("fPie2R(object x, object y, object r1, object r2, object startAngle, object sweepAngle)_填充扇形，椭圆的一部份");
    autoCompleteData2.push("fPie(object x, object y, object r, object startAngle, object sweepAngle)_填充扇形，圆的一部份")
    autoCompleteData2.push("fPie2RXy(object x, object y, object r1, object r2, object startAngle, object sweepAngle)_在坐标填充扇形，椭圆的一部份");
    autoCompleteData2.push("fPieXy(object x, object y, object r, object startAngle, object sweepAngle)_在坐标系中填充扇形，圆的一部份");
    autoCompleteData2.push("fPolygon(params object[] parameters)_填充多边形,最后一个参数是定义颜色的,也可以不要");
    autoCompleteData2.push("fPolygonXy(params object[] parameters)_在坐标系中填充多边形,最后一个参数是定义颜色的,也可以不要")
    autoCompleteData2.push("fRectangle(object x, object y, object width, object height)_填充矩形");
    autoCompleteData2.push("fRectangleXy(object x, object y, object width, object height)_在坐标系中填充矩形");
    autoCompleteData2.push("fSquare(object x, object y, object side)_填充正方形");
    autoCompleteData2.push("fSquareXy(object x, object y, object side)_在坐标系中填充正方形");
});

function onTxtAlgorithmContentKeyUp(e, event) {
    var key = window.event ? event.keyCode : event.which;

    if (key == 110 || key == 190) {
        if (window.event) {
            var sel = document.selection.createRange();
            var txt = e.createTextRange();
            var flag = sel.getBookmark();
            mark = flag;
            txt.collapse();
            txt.moveToBookmark(flag);
            txt.moveStart('character', -3);
        }
        else {
            var txt = e.value.substring(e.selectionStart - 3, e.selectionStart);
            mark = e.selectionStart;
        }
        if (txt.text == "em." || txt == "em.") {
            autoCompleteData = autoCompleteData1;
            for (var i = 0; i < autoCompleteData.length; i++) {
                $get("selectResult").options[i] = new Option(autoCompleteData[i].split("_")[0].split("(")[0] + "()", i);
            }
            $get("ddlSysFunction").style.display = "block";
            $get("selectResult").options[selectedFlag].selected = true;
            $get("titleShow").innerHTML = autoCompleteData[selectedFlag].replace("_", " ");
        } else if (txt.text == "gd." || txt == "gd.") {
            autoCompleteData = autoCompleteData2;
            for (var i = 0; i < autoCompleteData.length; i++) {
                $get("selectResult").options[i] = new Option(autoCompleteData[i].split("_")[0].split("(")[0] + "()", i);
            }
            $get("ddlSysFunction").style.display = "block";
            $get("selectResult").options[selectedFlag].selected = true;
            $get("titleShow").innerHTML = autoCompleteData[selectedFlag].replace("_", " ");
        }
    }
    else if (key == 38 || key == 40) {
        if ($get("ddlSysFunction").style.display == "block") {
            if (key == 38 && selectedFlag > 0) {
                $get("selectResult").options[selectedFlag--].selected = false;
                $get("selectResult").options[selectedFlag].selected = true;
                $get("titleShow").innerHTML = autoCompleteData[selectedFlag].replace("_", " ");
            }
            else if (key == 40 && (selectedFlag < $get("selectResult").options.length - 1)) {
                $get("selectResult").options[selectedFlag++].selected = false;
                if (selectedFlag + 5 < $get("selectResult").options.length) {
                    $get("selectResult").options[selectedFlag + 5].selected = true;
                    $get("selectResult").options[selectedFlag + 5].selected = false;
                }
                $get("selectResult").options[selectedFlag].selected = true;
                $get("titleShow").innerHTML = autoCompleteData[selectedFlag].replace("_", " ");
            }
        }
    }
    else if ((key > 64 && key < 90) || (key > 47 && key < 58) || (key > 95 && key < 106)) {
        if (key == 57 && event.shiftKey) {
            $get("ddlSysFunction").style.display = "none";
        }
        var tempText = "";
        if (document.selection)//for IE
        {
            var sel = document.selection.createRange();
            var txt = e.createTextRange();
            var flag = sel.getBookmark();
            txt.collapse();
            txt.moveToBookmark(flag);
            txt.moveStart('character', -e.value.length);
            //对比起始点
            tempText = txt.text.substring(txt.text.lastIndexOf(".") + 1, txt.text.length);
        }
        else //for Firefox
        {
            tempText = e.value.substring(e.value.substring(0, e.selectionStart).lastIndexOf(".") + 1, e.selectionStart);
        }
        for (var i = 0; i < autoCompleteData.length; i++) {
            if (tempText == autoCompleteData[i].substring(0, tempText.length)) {
                $get("selectResult").options[selectedFlag].selected = false;
                selectedFlag = i;
                if (selectedFlag + 5 < $get("selectResult").options.length) {
                    $get("selectResult").options[selectedFlag + 5].selected = true;
                    $get("selectResult").options[selectedFlag + 5].selected = false;
                }
                $get("selectResult").options[selectedFlag].selected = true;
                //去掉最前面的gd.和em.
                $get("titleShow").innerHTML = autoCompleteData[selectedFlag].replace("_", " ");
                break;
            }
        }
    }
    else if (key == 13 || key == 32) {
        if ($get("ddlSysFunction").style.display == "block") {
            for (var i = 0; i < $get("selectResult").options.length; i++) {
                if ($get("selectResult").options[i].selected) {
                    var textValue = new Sys.StringBuilder();
                    var tempText = "";
                    if (document.selection) {
                        var sel = document.selection.createRange();
                        var txt = e.createTextRange();
                        var flag = sel.getBookmark();
                        txt.collapse();
                        txt.moveToBookmark(flag);
                        txt.moveStart('character', -e.value.length);
                        textValue.append(txt.text.substring(0, txt.text.lastIndexOf(".") + 1));
                        textValue.append($get("selectResult").options[i].text);
                        e.value = e.value.replace(txt.text, textValue.toString());
                        var pos = txt.text.lastIndexOf(".");
                        txt.moveStart('character', pos + $get("selectResult").options[i].text.toString().length + 1);
                        txt.moveEnd('character', pos + $get("selectResult").options[i].text.toString().length + 1 - e.value.length);
                        txt.select();
                    }
                    else //for Firefox
                    {

                        tempText = e.value.substring(0, e.selectionStart);
                        textValue.append(tempText.substring(0, tempText.lastIndexOf(".") + 1));
                        textValue.append($get("selectResult").options[i].text);
                        e.value = e.value.replace(tempText, textValue.toString());
                        e.selectionStart = tempText.length + $get("selectResult").options[i].text.length;
                        e.selectionEnd = tempText.length + $get("selectResult").options[i].text.length;
                    }
                    $get("ddlSysFunction").style.display = "none";
                    break;
                }
            }
        }
    }
    else if (key == 27) {
        $get("ddlSysFunction").style.display = "none";
    }

    return false;
}

function selectResult_IndexChanged() {
    $get("selectResult").options[selectedFlag].selected = false;
    for (var i = 0; i < autoCompleteData.length; i++) {
        if ($get("selectResult").options[i].selected) {
            selectedFlag = i;
            break;
        }
    }
    titleShow.innerHTML = autoCompleteData[selectedFlag].replace("_", " ");
}

function divSelect_Click(event) {
    for (var i = 0; i < $get("selectResult").options.length; i++) {
        if ($get("selectResult").options[i].selected) {
            var textValue = new Sys.StringBuilder();
            var tempText = "";
            if (window.event) {
                $get("txtAlgorithmContent").focus();
                tempText = $get("txtAlgorithmContent").createTextRange();
                tempText.collapse();
                tempText.moveToBookmark(mark);
                tempText.moveStart('character', -$get("txtAlgorithmContent").value.length);
                textValue.append(tempText.text.substring(0, tempText.text.lastIndexOf(".") + 1));
                textValue.append($get("selectResult").options[i].text);
                $get("txtAlgorithmContent").value = $get("txtAlgorithmContent").value.replace(tempText.text, textValue.toString());
                var pos = tempText.text.lastIndexOf(".");
                tempText.moveStart('character', pos + $get("selectResult").options[i].text.toString().length + 1);
                tempText.moveEnd('character', pos + $get("selectResult").options[i].text.toString().length + 1 - $get("txtAlgorithmContent").value.length);
                tempText.select();
            }
            else {
                $get("txtAlgorithmContent").focus();
                tempText = $get("txtAlgorithmContent").value.substring(0, $get("txtAlgorithmContent").selectionStart);
                textValue.append(tempText.substring(0, tempText.lastIndexOf(".") + 1));
                textValue.append($get("selectResult").options[i].text);
                $get("txtAlgorithmContent").value = $get("txtAlgorithmContent").value.replace(tempText, textValue.toString());
                $get("txtAlgorithmContent").selectionStart = tempText.length + $get("selectResult").options[i].text.length;
                $get("txtAlgorithmContent").selectionEnd = tempText.length + $get("selectResult").options[i].text.length;
            }
            selectedFlag = i;
            $get("ddlSysFunction").style.display = "none";
            break;
        }
    }
}

function bindStructureType(defVal) {
    var arrOption = new Array();
    $excuteWS("~CmsWS.getBookStructureTypeList", { isbn: $("#ddlBookList").val() }, function (result) {
        if (result) {
            $.each(result, function () {
                arrOption.push("<option value='" + this.structureOrder + "'>" + this.structureType + "</option>");
            })
        }
        var $ddl = $("#ddlStructureType");
        $ddl.empty()
            .append("<option value='11'>知识点</option>")
            .append(arrOption.join(""));

        if (defVal) {
            $ddl.val(defVal);
        } else {
            $ddl.val("11");
        }

        //QM_FunCompletedForEdit();
    }, null, null);
}

function copySource(cpNum, event) {
    e = event ? event : window.event;
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }

    excuteGetQuestionByNumber([cpNum], simpleUser);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///修改选书方式 zh
//显示学科列表
function bindSubject(oSel, disciplineId, defVal, Defval) {
    if (!disciplineId || disciplineId == "-1") {
        oSel.find("option:gt(0)").remove();
        return;
    }

    $excuteWS("~CmsWS.getSubjectListByDisciplineId", { disciplineId: disciplineId, userExtend: simpleUser }, function (result) {
        oSel.find("option:gt(0)").remove();
        if (result && result.length > 0) {
            $.each(result, function () {
                oSel.append("<option value='" + this.id + "'>" + this.subjectName + "</option>");
            });
            if (defVal) {
                oSel.val(defVal).trigger("change");
            }
            if (Defval) {
                oSel.val(Defval);
            }
        }
    }, null, null);
}

//显示学科类别列表
function bindDiscipline(oSel, defVal, Defval) {
    $excuteWS("~CmsWS.getDisciplineList", { userExtend: simpleUser }, function (result) {
        oSel.find("option:gt(0)").remove();
        if (result && result.length > 0) {
            $.each(result, function () {
                oSel.append("<option value='" + this.id + "'>" + this.disciplineName + "</option>");
            });
            if (defVal) {
                oSel.val(defVal).trigger("change");
            }
            if (Defval) {
                oSel.val(Defval);
            }
        }
    }, null, null);
}
function listQueryContent(Des, Sub, defVal) {
    if (Sub.val() != -1) {
        var listQuery = [];
        for (var i = 0; i < BookList.length; i++) {
            if (BookList[i].disciplineId == Des.val() && BookList[i].subjectId == Sub.val()) {
                listQuery.push(BookList[i]);
            }
        }
        var $sel = $("#ddlBookList");
        $sel.find("option:gt(0)").remove();
        for (var i = 0; i < listQuery.length; i++) {
            if (listQuery[i].realFlag != "1") {
                $sel.append("<option value='" + listQuery[i].isbn + "' id='" + listQuery[i].id + "' subjectId='" + listQuery[i].subjectId + "' >" + listQuery[i].title + "</option>");
            }
        }
        if (defVal) {
            $sel.val(defVal).trigger("change");
        }
    }

}
function BindQueryBook() {
    var $des = $("#Des");
    var $sub = $("#Sub");
    //    var arg = getUrlParms();
    //    var isbn = arg["isbn"];
    //    var des = arg["des"];
    //    var sub = arg["sub"];
    bindDiscipline($des, "", "");
    $des.change(function () {
        bindSubject($sub, $(this).val(), "", "");
        //        des = $(this).val();
        //        if (des != -1) {
        //            AddUserParam("des", des);
        //        }
        //        else {
        //            SetUserParam("des", "");
        //        }
    })
    $sub.change(function () {
        listQueryContent($des, $sub, "");
        //        sub = $(this).val();
        //        if (sub != -1) {
        //            AddUserParam("sub", sub);
        //        }
        //        else {
        //            SetUserParam("sub", "");
        //        }
    })
}

function findBookObj(isbn) {
    var book = null;
    for (var i = 0; i < BookList.length; i++) {
        if (BookList[i].isbn == isbn) {
            book = BookList[i];
        }
    }
    return book;
}

function ddlViewEditHistory_change(o) {
    var bookId = $("#ddlBookList").find("option:selected").attr("id");

    if (o.value == -1) {
    }
    else if (o.value == 2) {
        $get(imgLoadingId).style.display = "block";
        $excuteWS("~CmsWS.getUnauditedQuestionIds", { userId: "", bookId: bookId, userExtend: simpleUser }, function (result) {
            $get(imgLoadingId).style.display = "none";
            window.tempQuestionIdArray = result;
            bindDDLPageSize();
            $("div.pagination").show();
            $("div.dvGotoPage").show();
            $(".pagination_ddl").show();
            bindKnowledgeGuidePagination(result);
        }, null, null);
    } else {
        var operationType = "";
        switch (o.value) {
            case "0":
                operationType = "1";
                break;
            case "1":
                operationType = "3";
                break;
            case "3":
                operationType = "2";
                break;
        }
        $get(imgLoadingId).style.display = "block";
        $excuteWS("~CmsWS.listByContentOperation",
            { contentType: "0", operationType: operationType, userId: "", bookId: bookId, userExtend: simpleUser }, function (result) {
                $get(imgLoadingId).style.display = "none";
                window.tempQuestionIdArray = result;
                bindDDLPageSize();
                $("div.pagination").show();
                $("div.dvGotoPage").show();
                $(".pagination_ddl").show();
                bindKnowledgeGuidePagination(result);
            }, null, null);
    }
}

function gotoPage(o) {
    var n = $(o).prev().val();
    if (!n || isNaN(n)) {
        $.jBox.tip('页码输入错误！', 'warning');
        return;
    }
    var p = parseInt(n) - 1;
    $("div.pagination").trigger('setPage', [p]);
    $(o).prev().val("");
}