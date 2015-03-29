/// <reference path="../../Scripts/jquery-1.6.1.min.js" />
var BookList = [];
var simpleUser = null;
var SimpleUser = null;
var ISBN = "";
var divTreeLoadingHtmlStr = '<div id="divTreeLoading" style="padding:10px;width:auto;"><center><img alt="loading..." src="../Images/ajax-loader_b.gif" /></center></div>';
var spanNoStudyReferenceInfoHtmlStr = '<span class="noreferenceinfo">没有可用的学习资料。</span>';
var opstatus = null;
var OldStructureId = "";
var KnowledgePointsDataSvr = null;
var AccLevel = 0;
var BsTreeNodes = null;

function pageLoad() {
    var args = getUrlParms();
    AddUserParam("isbn", args["isbn"]);
    $("#editor_spUploadImage,#editor_spUploadFile").css("display", "inline-block");
    InitCmsMenu("m_StudyReference");
    AccLevel = $("#__accessLevel").val();
    $("#editor_InsertLO").css("visibility", "visible");
    InitKnowledgePointBox();
    KnowledgePointsDataSvr = new KnowledgePointsData();

    var args = new Object();
    args = getUrlParms();
    var userId = args["userId"] ? args["userId"] : null;
    var sectionId = args["sectionId"] != null && typeof args["sectionId"] != 'undefined' && args["sectionId"] != "" ? args["sectionId"] : null;

    if (typeof _loadFlag != "undefined" && _loadFlag) {
        return;
    }
    CmsWS.getSimpleUser(userId, sectionId, onStudyResourceManagePageSuccessed, onLearningStudyResourceManagePageFailed, { userContext: "getSimpleUser" }, null); //得到SimpleUser    
    //    emath_overflowDivArray.push("divStudyResourceContent");
    $(window).resize(function () {
        ResetTreeNavFrameHeight("divTree", "dvRightContent");
    });
    $("#btnAdd").bind("click", onAddStudyResoucesClick);
    var $ddlViewEditHistory = $("#ddlViewEditHistory");
    $ddlViewEditHistory.val("-1").attr("disabled", "disabled");
    $("#selBookList").change(function () {
        if ($(this).val() == "-1") {
            $ddlViewEditHistory.val("-1").attr("disabled", "disabled");
        } else {
            $ddlViewEditHistory.removeAttr("disabled");
        }
        onDdlBookListChange(this);
    });
    $("#btnkpEditConfirm").click(function () {
        onKpEditConfirmClick();
    });
    $(".custab_bg ul").bind("click", onStudySelectTab);
    if (AccLevel == 3 || AccLevel == 6) {
        $("#btnAdd").hide().parent().next().hide();
    }
}

/**
* 点击树形菜单节点得到学习资料
**/
var tempStructureId = null;
var tempStrucureFlag = null;
function EmathTree_onTreeNodeClick(structureId, structureFlag) {
    tempStructureId = structureId;
    tempStrucureFlag = structureFlag;
    $("#divStudyResourceList").show();
    if (structureFlag == "0") {
        showKpDetails(structureId);
    } else { $("#SR_divKnowledge").hide(); }
    //$get("divStudyResourceList").style.display="block";
    $("div[class=pagination]").hide();
    getStudyResourceList(structureId, structureFlag);
    $("#ddlViewEditHistory").val("-1");
    $("#ddlResourceTypeFilter").get(0).selectedIndex = 0;
}

function getStudyResourceList(structureId, structureFlag) {

    $get("divStudyResourceInfo").innerHTML = divTreeLoadingHtmlStr;
    CmsWS.getStudyReferenceList(structureFlag, structureId, simpleUser, onStudyResourceManagePageSuccessed, onLearningStudyResourceManagePageFailed, { userContext: "getStudyReferenceList" }, null);
}

/**
* 添加学习资料
**/
function onAddStudyResoucesClick() {
    if (tempStructureId != null) {
        opstatus = "add";
        showStudyResourceInfo(true);
        bindStructureType();
        $("#tb3t2").find('input[type=radio]:checked').attr("checked", false);
        $("#ddlVisible").val("1");
        var node = $("#divTree").dynatree("getActiveNode");
        if (node && node.parent.data.structureLevel == "10") {
            $("#txtKpName").data("loId", node.data.key).val(node.data.title);
        }
    } else {
        $.jBox.info("请选知识点", "提示", { buttons: { '确定': true} });
    }
}

/**
* 点击div加入编辑器
**/
var editor = null;
function onStudyResourceContentDivClick(currentDIV) {

    if (editor == null) {
        editor = new emath_editor();
        editor.show_mode = "latex";
    }

    editor.upload_path = "../Uploads/CMS/" + $("#selBookList").find("option:selected").attr("id");
    editor.edit_height = "239px";
    editor.edit_container = currentDIV;
    editor.hide();
    editor.show();
    
    editor.jsUploadImage($("#selBookList").find("option:selected").attr("id")+"_SR");
    
    //    onLoDescriptionDivClick(currentDIV);
    //    currentDIV.style.overflow = "hidden";
    //    create_emath_editor({editorContainer:currentDIV,width:"100%",height:"240px"}); 
}

/**
* 清除弹出层中的所有信息
**/
function clearAllStudyResourceDivInfo() {
    $get("txtSrTags").value = $get("txtReferenceTiltle").value = "";
    $get("ddlRelevancy").selectedIndex = $get("ddlContentType").selectedIndex = $get("ddlDifficulty").selectedIndex = $get("ddlRecommendation").selectedIndex = 0;
    $get("ddlPhase").selectedIndex = 1;
    $get("ddlResourceType").selectedIndex = 0;
    $("#ddlVisible").parent().parent().show();
    $get("divStudyResourceContent").innerHTML = "";
    $get("ddlFileType").selectedIndex = 0;
    $get("ddlShareFlag").selectedIndex = 2;
}

/**
* 显示或隐藏添加或编辑学习资料的弹出层
**/
function showStudyResourceInfo(flag, type) {
    if (flag) {

        // $get("divStudyResourceInfo2").style.display=$get("divDisableOthers").style.display = "block";
        var sb = [];
        sb.push("<div id='divStudyResourceInfo22'></div>");
        sb.push("<div style='height:25px;padding:5px 0 5px 0;text-align: right;' class='jbox-button-panel'>");
        sb.push("    <input type='button' id='btnSave_sr' value='保存' class='jbox-button' style='width: 60px;' />");
        sb.push("    <input type='button' id='btnClose_sr' value='关闭' class='jbox-button' style='width: 60px;' />");
        sb.push("</div>");

        var $jb = $.jBox(sb.join(""), { title: "学习资源管理", buttons: {}, showClose: false, width: 740 });
        $("div[class=jbox-title-panel]").unbind("onkeyup");
        $("#divStudyResourceInfo2").appendTo($("#divStudyResourceInfo22")).show();
        if (type) {
            $get("ddlFileType").value = type;
        }
        $jb.find(".custab_bg #ulBasicInfo").trigger("click");
        $("#btnSelKp").bind("click", onSelBookStructure);

        $jb.find("#btnSave_sr,#btnClose_sr").hover(
            function () {
                $(this).addClass("jbox-button-hover");
            },
            function () {
                $(this).removeClass("jbox-button-hover");
            }
        );
        $jb.find("#btnClose_sr").click(function () {
            showStudyResourceInfo(false);
        });
        $jb.find("#btnSave_sr").click(function () {
            onStudyResourceConfirm();
        });
    } else {
        if (editor) {
            editor.hide();
        }
        clearAllStudyResourceDivInfo();
        opstatus = null;
        tempOldStudyReference = null;
        $("#divStudyResourceInfo2").appendTo($("#divStudyResourceContainer"));
        $.jBox.close();
        // $get("divStudyResourceInfo2").style.display=$get("divDisableOthers").style.display = "none";
    }
}

/**
* 选择书生成bookstructure树形菜单
**/
function onDdlBookListChange(o) {
    OldStructureId = ""
    tempStructureId = null;
    tempStrucureFlag = null;
    $get("divStudyResourceList").style.display = "none";

    ISBN = o.value;
    if (o.value != "-1") {
        var bookWrapper = findBookObj(ISBN);
        var $des = $("#Des");
        var $sub = $("#Sub");
        bindDiscipline($des, "", bookWrapper.disciplineId);
        //$des.val(bookWrapper.disciplineId);
        bindSubject($sub, bookWrapper.disciplineId, "", bookWrapper.subjectId);
        editor_isbn = o.value;
        $("#table2").show();
        $("#divTree").empty().html("<img src='../Images/ajax-loader_b.gif' style='margin-left:38%; margin-top:5%;' />");
        ResetTreeNavFrameHeight("divTree", "dvRightContent");
        $excuteWS("~CmsWS.getStudyReferenceTypeList", { isbn: o.value, userExtend: simpleUser }, function (result) {
            onGetStudyReferenceTypeListSuccessed(result);
            $excuteWS("~CmsWS.getBookStructureArray", { isbn: o.value, isLazy: true }, buildBookStructureTree, null, null);
        }, null, null);
        AddUserParam("isbn", ISBN);

    } else {
        $get("table2").style.display = "none";
        SetUserParam("isbn", "");
    }
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

function buildBookStructureTree(bsData) {
    ///<summary>构造BookStructure树</summary>

    BsTreeNodes = bsData[0];
    if (!BsTreeNodes) {
        return;
    }
    var $tree = $("#divTree").dynatree({
        title: "Book Structure Tree",
        clickFolderMode: 1,
        children: BsTreeNodes,
        cookieId: "bookStructureTree",
        onLazyRead: function (node) {
            var structureId = node.data.key;
            simpleUser.isbn = ISBN;
            $excuteWS("~CmsWS.getLearningObjectiveWithStructureList", { structureId: structureId, isbn: ISBN, exCurriculumId: "", userExtend: simpleUser }, onGetKnowledgePoints, null, node);
        },
        onClick: function (node, event) {
            if (event.target.className != "dynatree-expander") {
                if (node.data.structureLevel == "0") {
                    return;
                }
                if (node.data.key != OldStructureId) {
                    OldStructureId = node.data.key;
                    if (node.parent.data.structureLevel == "10") {
                        EmathTree_onTreeNodeClick(node.data.key, "0");
                    }
                    
                }
            }
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

    $("#table2").colResizable({
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

/**
* 根据学习资料返回的结果分类(Book,Multimedia,Article,Others)
**/
function getDiffReferenceByResult(_result) {
    var _array = new Array();
    var book_array = [];
    var multimedia_array = [];
    var article_array = [];
    var others_array = [];
    if (_result != null) {
        for (var f = 0; f < _result.length; f++) {
            if (getStudyMaterialType(_result[f].type) == "书") {
                book_array.push(_result[f]);
            } else if (getStudyMaterialType(_result[f].type) == "多媒体") {
                multimedia_array.push(_result[f]);
            } else if (getStudyMaterialType(_result[f].type) == "文章") {
                article_array.push(_result[f]);
            } else if (getStudyMaterialType(_result[f].type) == "其它") {
                others_array.push(_result[f]);
            }

        }
    }
    _array.push(book_array);
    _array.push(multimedia_array);
    _array.push(article_array);
    _array.push(others_array);

    return _array;
}

/**
* 学习资料归类
**/
function getStudyMaterialType(_type) {

    var type = "";
    switch (_type) {
        case "0":
            type = "URL";
            break;
        case "1":
            type = "书";
            break;
        case "2":
            type = "音频";
            break;
        case "3":
            type = "视频";
            break;
        case "4":
            type = "文章";
            break;
        case "5":
            type = "在线文本";
            break;
        default:
            type = "其它";
            break;
    }
    return type;
}

/**
* 返回包装后的推荐指数
**/
function getRecommandHtmlStr(recommand) {
    if (recommand == "1") {
        return "必须";
    } else if (recommand == "2") {
        return "推荐";
    }
    else if (recommand == "3") {
        return "可选";
    }
    return null;
}

/**
* 根据返回的type value得到文件类型
**/
function getFileTypeByTypeValue(tpv) {
    var fileTypeName = "";
    switch (tpv) {
        case "0":
            fileTypeName = "网址";
            break;
        case "2":
            fileTypeName = "音频";
            break;
        case "3":
            fileTypeName = "视频";
            break;
        case "4":
            fileTypeName = "文章";
            break;
        case "5":
            fileTypeName = "游戏";
            break;
        case "6":
            fileTypeName = "图片";
            break;
        case "7":
            fileTypeName = "FLASH";
            break;
        default:
            fileTypeName = tpv;
            break;
    }
    return fileTypeName;

}

/**
* 学习资料返回后分类并绑定
**/
var tempStudyResoucesArray = null;
function onGetStudyReferenceListSuccessed(result) {
    tempStudyResoucesArray = result;
    $("#divStudyResourceInfo").html(getStudyReferenceHTML(tempStudyResoucesArray));
    //    tempStudyResoucesArray=getDiffReferenceByResult(result);//book:0,multimedia:1,article:2,others:3
    //    $get("divBookReference").innerHTML = getStudyReferenceHTML(tempStudyResoucesArray[0],0);
    //    $get("divMultimediaReference").innerHTML = getStudyReferenceHTML(tempStudyResoucesArray[1],1);  
    //    $get("divArticleReference").innerHTML = getStudyReferenceHTML(tempStudyResoucesArray[2],2);
    //    $get("divOthersReference").innerHTML = getStudyReferenceHTML(tempStudyResoucesArray[3],3);
}

/**
* 根据id从返回的学习资料集合中查找对应的学习资料
**/
function getStudyReferenceById(referenceId) {
    if (tempStudyResoucesArray == null)
    { return null; }

    for (var j = 0; j < tempStudyResoucesArray.length; j++) {
        if (tempStudyResoucesArray[j].id == referenceId) {
            return tempStudyResoucesArray[j];
        }
    }

}

function onBtnNextClick() {
    //
    $(".custab_bg #ulContents").trigger("click");
}

function onBtnBackClick() {
    $(".custab_bg #ulBasicInfo").trigger("click");
}

function getStudyReferenceWrapper(_newStudyReferenceWrapper) {
    var newStudyReferenceWrapper = _newStudyReferenceWrapper;
    if (tempStrucureFlag == "1") {
        newStudyReferenceWrapper.bookStructureId = tempStructureId;
    }
    else if (tempStrucureFlag == "0") {
        newStudyReferenceWrapper.loId = tempStructureId;
    }
    newStudyReferenceWrapper.userId = simpleUser.userId;
    newStudyReferenceWrapper.resourceType = $get("ddlResourceType").value;
    newStudyReferenceWrapper.title = $get("txtReferenceTiltle").value;
    newStudyReferenceWrapper.recommendation = $get("ddlRecommendation").value;
    newStudyReferenceWrapper.difficulty = $get("ddlDifficulty").value;
    newStudyReferenceWrapper.type = $get("ddlFileType").value;
    newStudyReferenceWrapper.studyReferenceTypeId = $get("ddlContentType").value;
    newStudyReferenceWrapper.relevancy = $get("ddlRelevancy").value;
    newStudyReferenceWrapper.shareFlag = $get("ddlShareFlag").value;
    newStudyReferenceWrapper.phase = $get("ddlPhase").value;
    newStudyReferenceWrapper.systemId = simpleUser.SystemId;
    newStudyReferenceWrapper.locationFlag = tempStrucureFlag;
    newStudyReferenceWrapper.content = $get("divStudyResourceContent").innerHTML;
    newStudyReferenceWrapper.structureType = $("#ddlStructureType").val();
    //newStudyReferenceWrapper.visibleFlag = $("#ddlVisible").val();
    if (newStudyReferenceWrapper.resourceType == "1") {
        newStudyReferenceWrapper.visibleFlag = $("#ddlVisible").val();
    } else {
        newStudyReferenceWrapper.visibleFlag = "0";        
    }
    newStudyReferenceWrapper.tags = $("#txtSrTags").val();
    var $rd = $("input[name='rd_eBookSettings']:checked");
    newStudyReferenceWrapper.ebookSettings = $rd.get(0) ? $rd.val() : "";
    $rd = $("input[name='rd_StudyHelpSettings']:checked");
    newStudyReferenceWrapper.studySettings = $rd.get(0) ? $rd.val() : "";
    newStudyReferenceWrapper.bookId = $("#selBookList").find("option:selected").attr("id");
    newStudyReferenceWrapper.loId = $("#txtKpName").data("loId");
    return newStudyReferenceWrapper;
}

function onStudyResourceConfirm() {
    var b = saveInfoValidity();
    if (!b) {
        return;
    }

    if (editor) {
        editor.hide();
    }
    $get("divImgLoading").style.display = "block";
    simpleUser.bookId = $("#selBookList").find("option:selected").attr("id");
    if (opstatus == "add") {
        CmsWS.saveStudyReference(getStudyReferenceWrapper({}), simpleUser, onStudyResourceManagePageSuccessed, onLearningStudyResourceManagePageFailed, { userContext: "saveStudyReference" }, null);
    } else if (opstatus == "edit") {
        var tStudyReference = {};
        for (var key in tempOldStudyReference) {
            tStudyReference[key] = tempOldStudyReference[key];
        }

        CmsWS.updateStudyReference(getStudyReferenceWrapper(tStudyReference), simpleUser, onStudyResourceManagePageSuccessed, onLearningStudyResourceManagePageFailed, { userContext: "updateStudyReference" }, null);
        //CmsWS.editStudyReference(newStudyReferenceWrapper,tempOldStudyReference,simpleUser,onStudyResourceManagePageSuccessed,onLearningStudyResourceManagePageFailed,{userContext:"editStudyReference"},null);
    }
    showStudyResourceInfo(false);
}


/**
* 编辑学习资料
**/
var tempOldStudyReference = null;
function onEditStudyReferenceClick(referenceId) {
    tempOldStudyReference = getStudyReferenceById(referenceId);
    if (tempOldStudyReference != null) {
        $get("ddlResourceType").value = tempOldStudyReference.resourceType.trim();
        $get("txtReferenceTiltle").value = tempOldStudyReference.title != null ? tempOldStudyReference.title : "";
        $get("ddlRecommendation").value = tempOldStudyReference.recommendation.trim();
        $get("ddlDifficulty").value = tempOldStudyReference.difficulty.trim();
        $get("ddlFileType").value = tempOldStudyReference.type.trim();
        $get("ddlContentType").value = tempOldStudyReference.studyReferenceTypeId.trim();
        $get("ddlRelevancy").value = tempOldStudyReference.relevancy.trim();
        $get("ddlShareFlag").value = tempOldStudyReference.shareFlag.trim();
        $get("ddlPhase").value = tempOldStudyReference.phase ? tempOldStudyReference.phase : "2";
        $get("divStudyResourceContent").innerHTML = tempOldStudyReference.content != null ? tempOldStudyReference.content : "";
        setLoName(tempOldStudyReference.loId);
        bindStructureType(tempOldStudyReference.structureType);
        var $ddlVisible = $("#ddlVisible").val(tempOldStudyReference.visibleFlag);
        if (tempOldStudyReference.resourceType == "1") {
            $ddlVisible.parent().parent().show();
        } else {
            $ddlVisible.parent().parent().hide();
        }
        $("#txtSrTags").val(tempOldStudyReference.tags != null ? tempOldStudyReference.tags : "");
        //if (tempOldStudyReference.originalFlag == "1") {
        //    $("#rdReproduce").trigger("click");
        //} else {
        //    $("#rdOriginal").trigger("click");
        //}


        if (tempOldStudyReference.ebookSettings && tempOldStudyReference.ebookSettings != "") {
            $("input[name='rd_eBookSettings']").get(tempOldStudyReference.ebookSettings).checked = true;
        } else {
            $("input[name='rd_eBookSettings']").removeAttr("checked");
        }
        if (tempOldStudyReference.studySettings && tempOldStudyReference.studySettings != "") {
            $("input[name='rd_StudyHelpSettings']").get(tempOldStudyReference.studySettings).checked = true;
        } else {
            $("input[name='rd_StudyHelpSettings']").removeAttr("checked");
        }

        opstatus = "edit";
        showStudyResourceInfo(true, tempOldStudyReference.type.trim());
    } else {
        $.jBox.info("该学习资源不存在", "提示", { buttons: { '确定': true } });
    }
}

/**
* 删除学习资料
**/
function onDeleteStudyReferenceClick(referenceId) {
    $.jBox.confirm("你确定要删除该学习资料吗?", "提示", function (v, h, f) {
        if (v == true) {
            var studyReference = getStudyReferenceById(referenceId);
            if (studyReference != null) {
                CmsWS.deleteStudyReference(studyReference, simpleUser, onStudyResourceManagePageSuccessed, onLearningStudyResourceManagePageFailed, { userContext: "deleteStudyReference" }, null);
            } else {
                $.jBox.info("对象不存在", "提示", { buttons: { '确定': true } });
            }
        }
    }, { top: "25%", buttons: { "确定": true, "取消": false } });
}

function onResourceTypeFilter(o) {
    $("#divStudyResourceInfo").html(getStudyReferenceHTML(tempStudyResoucesArray));
}

/**
* 创建学习资料
**/
function getStudyReferenceHTML(result) {
    var $ddlResourceType = $("#ddlResourceTypeFilter");
    if (result == null || result.length == 0) {
        $ddlResourceType.hide();
        return spanNoStudyReferenceInfoHtmlStr;
    }

    var resourceType = $ddlResourceType.show().val();
    var tableStrBuilder = new Sys.StringBuilder();
    tableStrBuilder.append("<table class=\"gridviewblue\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"text-align:left;\"><tbody>");
    tableStrBuilder.append("<tr class=\"titlerow\">");
    tableStrBuilder.append("<th style=\"text-align:left\">资源名称</th>");
    tableStrBuilder.append("<th style=\"text-align:center\">类型</th>");
    tableStrBuilder.append("<th style=\"text-align:center\">推荐</th>");
    tableStrBuilder.append("<th style=\"text-align:center\">难度</th>");
    tableStrBuilder.append("<th style=\"text-align:center\">阶段</th>");
    if (resourceType == "1") {
        tableStrBuilder.append("<th style=\"text-align:center\">是否可见</th>");
    }
    tableStrBuilder.append("<th style=\"text-align:center\">操作</th>");
    tableStrBuilder.append("</tr></tbody>");

    var tempList = [];
    if (resourceType == "-1") {
        tempList = result;
    } else {
        for (var i = 0; i < result.length; i++) {
            if (result[i].resourceType == resourceType) {
                tempList.push(result[i]);
            }
        }
    }
    
    if (tempList.length > 0) {
        for (var i = 0; i < tempList.length; i++) {
            isEditable = false;
            if (AccLevel == 1 || AccLevel == 4) {
                isEditable = true;
            } else if ((AccLevel == 2 || AccLevel == 5) && (tempList[i].userId == simpleUser.userId)) {
                isEditable = true;
            }

            tableStrBuilder.append("<tbody><tr class=\"" + ((i % 2) == 1 ? "evenrow" : "oddrow") + "\">");
            tableStrBuilder.append("<td><a href=\"javascript:showReferenceDetails('" + tempList[i].id + "')\">" + tempList[i].title + "</a></td>");
            tableStrBuilder.append("<td style=\"text-align:center\">" + getStudyMaterialType(tempList[i].type) + "</td>");
            tableStrBuilder.append("<td style=\"text-align:center\">" + addRecommendField(tempList[i].id, tempList[i].recommendation, isEditable) + "</td>");
            tableStrBuilder.append("<td style=\"text-align:center\">" + addDifficultyField(tempList[i].id, tempList[i].difficulty, isEditable) + "</td>");
            tableStrBuilder.append("<td style=\"text-align:center\">" + addPhaseField(tempList[i].id, tempList[i].phase, isEditable) + "</td>");
            if (resourceType == "1") {
                tableStrBuilder.append("<td style=\"text-align:center\">" + visibleFlagField(tempList[i].id, tempList[i].visibleFlag) + "</td>");
            }
            //if (simpleUser.roleId == "2" || (simpleUser.roleId == "0" && tempList[i].userId == simpleUser.userId)) {
            if (simpleUser.roleId == "2" || simpleUser.roleId == "0") {
                tableStrBuilder.append("<td style=\"text-align:center\">");
                if (isEditable) {
                    tableStrBuilder.append("<img title=\"编辑\" src=\"Images/application_edit.png\" onclick=\"onEditStudyReferenceClick('" + tempList[i].id + "')\" style=\"cursor:pointer;\" />&nbsp;");
                }

                if (AccLevel <= 3) {
                    if (AccLevel == 1 || (AccLevel == 2 && (tempList[i].userId == simpleUser.userId))) {
                        tableStrBuilder.append("<img title=\"知识点关系\" src=\"Images/relation.png\" onclick=\"LoStudyReference('" + tempList[i].id + "', '" + tempList[i].title + "', true)\" style=\"cursor:pointer;\" />&nbsp;");
                    } else {
                        tableStrBuilder.append("<img title=\"知识点关系\" src=\"Images/relation.png\" onclick=\"LoStudyReference('" + tempList[i].id + "', '" + tempList[i].title + "', false)\" style=\"cursor:pointer;\" />&nbsp;");
                    }
                }

                tableStrBuilder.append("<img title=\"审核与建议\" src=\"Images/suggestion.png\" onclick=\"Audit('" + tempList[i].id + "')\" style=\"cursor:pointer;\" />&nbsp;");
                tableStrBuilder.append("<img title=\"编辑历史\" src=\"Images/history.png\" onclick=\"editHistory('" + tempList[i].id + "')\" style=\"cursor:pointer;\" />&nbsp;");

                if (isEditable) {
                    tableStrBuilder.append("<img title=\"删除\" src=\"Images/application_delete.png\" onclick=\"onDeleteStudyReferenceClick('" + tempList[i].id + "')\" style=\"cursor:pointer;\" />");
                }
                tableStrBuilder.append("</td>");
            } else {
                //tableStrBuilder.append("<td style=\"text-align:center\"><img title=\"编辑\" src=\"Images/application_edit1.png\" onclick=\"alert('你没有权限编辑该信息')\" style=\"cursor:pointer;\" />&nbsp;<img title=\"知识点关系\" src=\"Images/relation.png\" onclick=\"alert('你没有权限编辑该信息.')\" style=\"cursor:pointer;\" />&nbsp;<img title=\"审核与建议\" src=\"Images/suggestion.png\" onclick=\"alert('你没有权限编辑该信息。')\" style=\"cursor:pointer;\" />&nbsp;<img title=\"Edit history\" src=\"Images/history.png\" onclick=\"alert('你没有权限编辑该信息')\" style=\"cursor:pointer;\" />&nbsp;<img title=\"删除\" src=\"Images/application_delete1.png\" onclick=\"alert('你没有权限删除该信息')\" style=\"cursor:pointer;\" /></td>");
                tableStrBuilder.append("<td>&nbsp;</td>");
            }
            tableStrBuilder.append("</tr></tbody>");
        }
    } else {
        tableStrBuilder.append("<tbody><tr><td colspan='7'>" + spanNoStudyReferenceInfoHtmlStr + "</td></tr></tbody>");
    }
    return tableStrBuilder.toString();

    //    var html = new Array();
    //    html.push('<TABLE border=0 cellSpacing=0 cellPadding=0 width="100%"><TBODY>');
    //    html.push('<TR>');
    //    html.push('<TD style="PADDING-BOTTOM: 0px; PADDING-LEFT: 0px; WIDTH: 5px; PADDING-RIGHT: 0px; BACKGROUND: url(../Images/RoundCorner/roudcornlb_tl.gif) no-repeat; HEIGHT: 6px; PADDING-TOP: 0px"></TD>');
    //    html.push('<TD style="PADDING-BOTTOM: 0px; PADDING-LEFT: 0px; PADDING-RIGHT: 0px; BACKGROUND: url(../Images/RoundCorner/roudcornlb_tm.gif) repeat-x; HEIGHT: 6px; PADDING-TOP: 0px"></TD>');
    //    html.push('<TD style="PADDING-BOTTOM: 0px; PADDING-LEFT: 0px; WIDTH: 6px; PADDING-RIGHT: 0px; BACKGROUND: url(../Images/RoundCorner/roudcornlb_tr.gif) repeat-x; HEIGHT: 6px; PADDING-TOP: 0px"></TD></TR>');
    //    html.push('<TR>');
    //    html.push('<TD style="PADDING-BOTTOM: 0px; PADDING-LEFT: 0px; WIDTH: 20px; PADDING-RIGHT: 0px; BACKGROUND: url(../Images/RoundCorner/roudcornlb_ml.gif) repeat-y; PADDING-TOP: 0px"></TD>');
    //    html.push('<TD style="PADDING-BOTTOM: 0px; BACKGROUND-COLOR: #fff; PADDING-LEFT: 0px; PADDING-RIGHT: 8px; FONT-SIZE: 12px; PADDING-TOP: 8px">');

    //    html.push(tableStrBuilder.toString());

    //    html.push('</TD>');
    //    html.push('<TD style="WIDTH: 6px; BACKGROUND: url(../Images/RoundCorner/roudcornlb_mr.gif) repeat-y"></TD></TR>');
    //    html.push('<TR>');
    //    html.push('<TD style="WIDTH: 20px; BACKGROUND: url(../Images/RoundCorner/roudcornlb_bl.gif) repeat-x; HEIGHT: 21px"></TD>');
    //    html.push('<TD style="BACKGROUND: url(../Images/RoundCorner/roudcornlb_bm.gif) repeat-x; HEIGHT: 21px"></TD>');
    //    html.push('<TD style="WIDTH: 6px; BACKGROUND: url(../Images/RoundCorner/roudcornlb_br.gif) repeat-x; HEIGHT: 21px"></TD>');
    //    html.push('</TR>');
    //    html.push('</TBODY>');
    //    html.push('</TABLE>');
    //    return html.join('');
}
//添加难度字段
function addRecommendField(id, recommend, isEditable) {
    if (isEditable) {
        var arr = [
        "<select onchange='changeRecommend(\"" + id + "\", this)' id='diff_" + id + "' class='selectTag'>",
        "<option value='1'>必须</option>  ",
        "<option value='2'>推荐</option>  ",
        "<option value='3'>可选</option>  ",
        "</select>                        "
        ];
        var index = $.inArray(recommend, ["1", "2", "3"]) != -1 ? parseInt(recommend) : 1;
        arr[index] = arr[index].replace("<option", "<option selected='selected'");
        return arr.join("");
    } else {
        var val = "";
        var list = ["必须", "推荐", "可选"];
        var i = $.inArray(recommend, ["1", "2", "3"]) != -1 ? parseInt(recommend) : 0;
        if (i != 0) {
            val = list[i - 1];
        }
        return val;
    }
}

//添加难度字段
function addDifficultyField(id, difficulty, isEditable) {
    if (isEditable) {
        var arr = [
            "<select onchange='changeDifficulty(\"" + id + "\", this)' id='diff_" + id + "' class='selectTag'>",
            "<option value='1'>1</option>  ",
            "<option value='2'>2</option>  ",
            "<option value='3'>3</option>  ",
            "<option value='4'>4</option>  ",
            "<option value='5'>5</option>",
            "</select>                        "
        ];
        var index = $.inArray(difficulty, ["1", "2", "3", "4", "5"]) != -1 ? parseInt(difficulty) : 1;
        arr[index] = arr[index].replace("<option", "<option selected='selected'");
        return arr.join("");
    } else {
        var val = "";
        var list = ["1", "2", "3", "4", "5"];
        var i = $.inArray(difficulty, ["1", "2", "3", "4", "5"]) != -1 ? parseInt(difficulty) : 0;
        if (i != 0) {
            val = list[i - 1];
        }
        return val;
    }
}

//添加阶段字段
function addPhaseField(id, phase) {
    if (isEditable) {
        var arr = [
            "<select onchange='changePhase(\"" + id + "\", this)' id='phase_" + id + "' class='selectTag'>",
            "<option value='1'>引入</option>  ",
            "<option value='2'>正式</option>  ",
            "<option value='3'>探索</option>  ",
            "</select>                        "
        ];
        var index = $.inArray(phase, ["1", "2", "3"]) != -1 ? parseInt(phase) : 2;
        arr[index] = arr[index].replace("<option", "<option selected='selected'");
        return arr.join("");
    } else {
        var val = "";
        var list = ["引入", "正式", "探索"];
        var i = $.inArray(phase, ["1", "2", "3"]) != -1 ? parseInt(phase) : 0;
        if (i != 0) {
            val = list[i - 1];
        }
        return val;
    }
}

//添加是否可见字段
function visibleFlagField(id, visibleFlag) {
    var arr = [
            "<select onchange='changeVisible(\"" + id + "\", this)' id='visi_" + id + "' class='selectTag'>",
            "<option value='0'>否</option> ",
            "<option value='1'>是</option>",
            "</select>                     "
        ];
    var index = $.inArray(visibleFlag, ["0", "1"]) != -1 ? parseInt(visibleFlag) : 1;
    index = index + 1;
    arr[index] = arr[index].replace("<option", "<option selected='selected'");
    return arr.join("");
}

function changeDifficulty(id, obj) {
    var studyRefer = getStudyReferenceById(id);
    if (studyRefer) {
        var $divStudyResourceInfo = $("#divStudyResourceInfo").showLoading();
        studyRefer.difficulty = obj.value;
        CmsWS.updateStudyReference(studyRefer, simpleUser, function () {
            $divStudyResourceInfo.hideLoading();
        }, onLearningStudyResourceManagePageFailed, { userContext: "updateStudyReference" }, null);
    }
}

function changeRecommend(id, obj) {
    var studyRefer = getStudyReferenceById(id);
    if (studyRefer) {
        var $divStudyResourceInfo = $("#divStudyResourceInfo").showLoading();
        studyRefer.recommendation = obj.value;
        CmsWS.updateStudyReference(studyRefer, simpleUser, function () {
            $divStudyResourceInfo.hideLoading();
        }, onLearningStudyResourceManagePageFailed, { userContext: "updateStudyReference" }, null);
    }
}

function changePhase(id, obj) {
    var studyRefer = getStudyReferenceById(id);
    if (studyRefer) {
        var $divStudyResourceInfo = $("#divStudyResourceInfo").showLoading();
        studyRefer.phase = obj.value;
        CmsWS.updateStudyReference(studyRefer, simpleUser, function () {
            $divStudyResourceInfo.hideLoading();
        }, onLearningStudyResourceManagePageFailed, { userContext: "updateStudyReference" }, null);
    }
}

function changeVisible(id, obj) {
    var studyRefer = getStudyReferenceById(id);
    if (studyRefer) {
        var $divStudyResourceInfo = $("#divStudyResourceInfo").showLoading();
        studyRefer.visibleFlag = obj.value;
        CmsWS.updateStudyReference(studyRefer, simpleUser, function () {
            $divStudyResourceInfo.hideLoading();
        }, onLearningStudyResourceManagePageFailed, { userContext: "updateStudyReference" }, null);
    }
}

/**
* 查看学习资料详细信息
**/
function viewStudyResourceDetails(referenceId) {
    var descriptionHtmlStr = $get("studyReferenceDescription_" + referenceId).innerHTML;
    var preview = window.open("", "preview",
			                  "toolbar=no,menubar=no,personalbar=no,width=800,height=400," +
			                  "scrollbars=yes,resizable=yes");
    preview.document.title = "学习资源详细信息";
    preview.document.body.style.backgroundColor = "rgb(242,240,253)";
    preview.document.body.innerHTML = descriptionHtmlStr;
}
/**
* 修改分类选择书ZH
**/
//显示学科列表
function bindSubject(oSel, disciplineId, defVal, Defval) {
    if (!disciplineId || disciplineId == "-1") {
        oSel.find("option:gt(0)").remove();
        return;
    }

    $excuteWS("~CmsWS.getSubjectListByDisciplineId", { disciplineId: disciplineId, userExtend: SimpleUser }, function (result) {
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
    $excuteWS("~CmsWS.getDisciplineList", { userExtend: SimpleUser }, function (result) {
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
        var $sel = $("#selBookList");
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

/**
* 返回书并绑定
**/
//var tempBookList=null;
function onGetBookListSuccessed(result) {
    bindDiscipline($("#Des"), "", "");
    BookList = result;
    var $booklist = $("#selBookList");
    $.each(result, function () {
        $booklist.append("<option value='" + this.isbn + "' id='" + this.id + "' >" + this.title + "</option>");
    })
    var arg = getUrlParms();
    var isbn = arg["isbn"];
    $booklist.val(isbn).trigger("change");
    var $del = $("#Des");
    var $sub = $("#Sub");
    //    var des = arg["des"];
    //    var sub = arg["sub"];

    $del.change(function () {
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
        listQueryContent($del, $sub, "");
        //        sub = $(this).val();
        //        if (sub != -1) {
        //            AddUserParam("sub", sub);
        //        }
        //        else {
        //            SetUserParam("sub", "");
        //        }
    })

    //    tempBookList=result;
    var $selBookList = $("#selBookList");
    if (simpleUser.roleId == "0") {
        $selBookList.val(simpleUser.isbn);
        $get("table2").style.display = "block";
        $get("divTree").innerHTML = divTreeLoadingHtmlStr;
        CmsWS.getStudyReferenceTypeList(simpleUser.isbn, simpleUser, onStudyResourceManagePageSuccessed, onLearningStudyResourceManagePageFailed, { userContext: "getStudyReferenceTypeList", isbn: simpleUser.isbn }, null);
    } else if (simpleUser.roleId == "2") {
        //        $get("divStudyResources").style.display="block";
        //        $get("divImgLoading").style.display="none";
    }
}

/**
* 绑定学习资料类型
**/
function onGetStudyReferenceTypeListSuccessed(result) {
    if (result != null) {
        var ddlContentType = $get("ddlContentType");
        if (ddlContentType.options.length == 1 && ddlContentType.options[0].value == "-1") {
            ddlContentType.options[0] = null;
        }
        for (var x = 0; x < result.length; x++) {
            ddlContentType.options[x] = new Option(result[x].type, result[x].id);
        }
    }
    if (simpleUser.roleId == "0") {
        $get("divStudyResources").style.display = "block";
        $get("divImgLoading").style.display = "none";
    }
}

/**
* 树形菜单数据成功返回并绑定
**/
function onGetBookContentStructureArraySuccessed(result) {
    $get("divTree").innerHTML = result; //getTreeMenuHTML(result,2)
}

var tempAuthorsArray = new Array();

function getAuthorById(id) {
    for (var i = 0; i < tempAuthorsArray.length; i++) {
        if (tempAuthorsArray[i].id == id) {
            return tempAuthorsArray[i];
        }
    }
}

/**
* 学习资料管理页面成功回调函数
**/
function onStudyResourceManagePageSuccessed(result, userContext, methodName) {
    if (userContext.userContext == "getSimpleUser") {
        delete result.__type;
        SimpleUser = simpleUser = result;

        if (simpleUser == null) {
            $.jBox.error("用户信息不存在", "错误", { buttons: { '确定': 'ok' } });
            return;
        }
        if (simpleUser.roleId == "2") {
            InitHeader(simpleUser);
        }
        if (simpleUser.roleId == "0") {
            $get("selBookList").setAttribute("disabled", "disabled");
        }
        $excuteWS("~CmsWS.getBookList", { userId: null, instituteIds: null, disciplineIds: null, subjectIds: null, realFlag: false, userExtend: SimpleUser }, onStudyResourceManagePageSuccessed, onLearningStudyResourceManagePageFailed, { userContext: "getBookList" });
        
    } else if (userContext.userContext == "getStudyReferenceTypeList") {
        onGetStudyReferenceTypeListSuccessed(result);
        //Comm_WebService.getBookContentStructureArray("4",userContext.isbn,null,simpleUser,onStudyResourceManagePageSuccessed,onLearningStudyResourceManagePageFailed,{userContext:"getBookContentStructureArray"},null);
        var myEmathTree = { showRootNodeFlag: true, showCheckBoxFlag: false, expendAllFlag: false, rootNodeName: "Book structure", imgURL: "../Images/tree/" };
        CmsWS.getTreeMenuHTML(myEmathTree, "4", userContext.isbn, null, simpleUser, onStudyResourceManagePageSuccessed, onLearningStudyResourceManagePageFailed, { userContext: "getBookContentStructureArray" }, null);
    } else if (userContext.userContext == "getBookList") {
        onGetBookListSuccessed(result);
    } else if (userContext.userContext == "getBookContentStructureArray") {
        onGetBookContentStructureArraySuccessed(result);
    } else if (userContext.userContext == "getStudyReferenceList") {
        onGetStudyReferenceListSuccessed(result);
    } else if (userContext.userContext == "deleteStudyReference") {
        if (result) {
            $.jBox.tip("学习资料删除成功！", 'success');
            getStudyResourceList(tempStructureId, tempStrucureFlag);
        } else {
            $.jBox.error("学习资料删除失败", "错误", { buttons: { '确定': 'ok' } });
        }
    } else if (userContext.userContext == "saveStudyReference" || userContext.userContext == "updateStudyReference") {
        $get("divImgLoading").style.display = "none";
        $.jBox.tip("学习资料保存成功！", 'success');
        getStudyResourceList(tempStructureId, tempStrucureFlag);
    }
}

function onLearningStudyResourceManagePageFailed(error, userContext, methodName) {
    alert("error at function: " + userContext + "\n" +
        "调用Microsoft桥接器（Bridge）失败信息：" + error.get_message() +
        "\nStack Trace：" + error.get_stackTrace() +
        "\nStatus Code：" + error.get_statusCode() +
        "\nExcept Type：" + error.get_exceptionType() +
        "\Time Out：" + error.get_timedOut());
    $get("divImgLoading").style.display = "none";
}

function bindStructureType(defVal) {
    var arrOption = new Array();
    $excuteWS("~CmsWS.getBookStructureTypeList", { isbn: $("#selBookList").val() }, function (result) {
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
    }, null, null);
}

function editKnowledgePointNode() {
    ///<summary>编辑知识点节点</summary>
    var node = $("#divTree").dynatree("getActiveNode");
    if (node && node.parent.data.structureLevel == "10") {
        EditKnowledgePoint(node.parent.data.key, node.data.key, function (kp) {
            if (node.data.title != kp.name) {
                node.setTitle(kp.unit + ". " + kp.name);
            }
        });
    }
}

function onKpEditConfirmClick() {
    //调用了KnowledgePointsInfo.js中的方法

    var validteFlag = validateLearningObjectiveInfo();
    if (validteFlag == null) {
        //        hidden_emath_editor();
        if (editor) {
            editor.hide();
        }
        CloseKpBox();
        var treeAction = $divLoInfo.data("_action");
        var kp = getKnowledgePointWrapper();
        SimpleUser.isbn = $("#selBookList").val();
        if (kp.id) {
            $excuteWS("~CmsWS.editLearningObjectiveCms", { locW: kp, userExtend: SimpleUser }, function (kp) {
                if (kp) {
                    treeAction(kp);
                    showKpDetails(kp.id);
                }
            }, null, null);
        }

    } else {
        $.jBox.tip(validteFlag, 'warning');
        $divLoInfo.find("#divLoDaoXiang ul:eq(0)").trigger("click");
    }
}

function showKpDetails(kpId) {
    new ShowDetails({ data: { itemId: kpId }, container: "SR_divKnowledgeDetails", show_type: "0", type: "0" }).show(function () {
        if ($("#SR_divKnowledgeDetails [nodetails=1]").length == 0) {
            $("#SR_divKnowledge").show();
            var edt;
            if (AccLevel == 3 || AccLevel == 6) {
                edt = "";
            } else {
                edt = "&nbsp;<img src='Images/application_edit.png' style='cursor:pointer' title='编辑知识点' onclick='editKnowledgePointNode()' />";
            }
            $("#SR_knowledgeTitle").html(this.itemName + edt);
        } else {
            $("#SR_divKnowledge").hide();
        }
    });
    $("#SR_knowledgeTitle").show();
    $("#SR_divKnowledgeDetails").show();
}

function showReferenceDetails(id) {
    new ShowDetails({ data: { studyReferenceId: id }, type: 1, show_type: 1 }).show()
}

function Audit(contentId) {
    var obj = new ContentAudit({
        bookId: $("#selBookList").find("option:selected").attr("id"),
        contentId: contentId,
        contentType: "3",
        simpleUser: simpleUser
    });
    obj.Show();
}

function editHistory(contentId) {
    var obj = new ContentEditHistory({
        bookId: $("#selBookList").find("option:selected").attr("id"),
        contentId: contentId,
        contentType: "3",
        simpleUser: simpleUser
    });
    obj.Show();
}

function ddlViewEditHistory_change(o) {
    var bookId = $("#selBookList").find("option:selected").attr("id");
    simpleUser.bookId = bookId;
    if (o.value == -1) {
        return;
    }

    $("#divStudyResourceList").show();
    $("#SR_knowledgeTitle").hide();
    $("#SR_divKnowledgeDetails").hide();

    if (o.value == 2) {
        $excuteWS("~CmsWS.getUnauditedStudyReferenceIds", { userId: "", bookId: bookId, userExtend: simpleUser }, function (result) {
            if (result && result.length > 0) {
                bindStudyReferencePagination(result);
            }
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

        $excuteWS("~CmsWS.listByContentOperation",
            { contentType: "3", operationType: operationType, userId: "", bookId: bookId, userExtend: simpleUser }, function (result) {
                if (result && result.length > 0) {
                    bindStudyReferencePagination(result);
                }
            }, null, null);
    }

}

var pageSize = 15;
function bindStudyReferencePagination(studyReferenceIds) {
    $("div[class=pagination]").show().html("").pagination(studyReferenceIds.length, {
        num_edge_entries: 2,
        num_display_entries: 5,
        items_per_page: pageSize,
        callback: function (page_index, o) {
            var _startPos = page_index * pageSize;
            var _endPos = _startPos + (pageSize - 1);
            var ids = getStudyReferenceIdsSlice(studyReferenceIds, _startPos, _endPos);
            $get("divStudyResourceInfo").innerHTML = divTreeLoadingHtmlStr;
            $excuteWS("~CmsWS.getStudyReferenceByIdsList", { ids: ids, userExtend: simpleUser }, function (result) {
                onGetStudyReferenceListSuccessed(result);
            }, null, null);
        }
    });
}

function getStudyReferenceIdsSlice(studyReferenceIds, startpos, endpos) {
    if (studyReferenceIds) {
        var len = studyReferenceIds.length;
        if (endpos > len) {
            endpos = len;
        }
        return studyReferenceIds.slice(startpos, endpos + 1);
    } else {
        return [];
    }
}

function ddlResourceTypeChange(o) {
    var $ddlVisible = $("#ddlVisible");
    if (o.value == "1") {
        $ddlVisible.parent().parent().show();
    } else {
        $ddlVisible.parent().parent().hide();
    }
}


function onStudySelectTab() {
    if (this.className == "custab_ul_s") return;

    var $currTab = $(this);
    var $siblingTabs = $currTab.siblings();

    if ($currTab.attr("id") == "ulContents" && !checkBaseInfoValidity()) return;

    $siblingTabs.removeClass().addClass("custab_ul");
    $siblingTabs.find("li").each(function () {
        this.className = this.className.replace("_s", "");
    });

    $currTab.removeClass().addClass("custab_ul_s");
    $currTab.find("li").each(function () {
        this.className = this.className + "_s";
    });

    switch ($currTab.attr("id")) {
        case "ulBasicInfo":
            $("#dvBasicInfo").show();
            $("#dvContents").hide();
            break;
        case "ulContents":
            $("#dvBasicInfo").hide();
            $("#dvContents").show();
            break;
    }

}

//验证基本信息
function checkBaseInfoValidity() {
    if ($get("txtReferenceTiltle").value.trim() == "") {
        $.jBox.tip("标题必填", 'warning');
        return false;
    }

    return true;
}

function saveInfoValidity() {
    if ($get("txtReferenceTiltle").value.trim() == "") {
        $.jBox.tip("标题必填", 'warning');
        return false;
    }

    if ($("#divStudyResourceContent").html() == "") {
        if ($(".custab_ul_s").attr("id") == "ulBasicInfo") {
            $(".custab_bg #ulContents").trigger("click");
        }

        $.jBox.tip("内容类型必填", 'warning');
        return false;
    }
    return true;
}

function onSelBookStructure() {
    var $jb = $.jBox("<div id='dvSelBookStructureTree' style='margin:6px;'><img src='../CMS/Images/ajax-loader_b.gif' style='margin: 35% 45%;' /></div>", { id: 'jb_bookStructureTree', title: "选择章节", width: 465, height: 505, top: "20%", buttons: { "确定": true, "取消": false }, submit: submitBookStructure });
    buildSelBookStructureTree($jb.find("#dvSelBookStructureTree"));
}

function submitBookStructure(v, h, f) {
    if (v == true) {
        var activeNode = h.find("#dvSelBookStructureTree").dynatree("getActiveNode");
        if (activeNode && activeNode.parent.data.structureLevel == "10") {
            $("#txtKpName").data("loId", activeNode.data.key).val(activeNode.data.title);
        } else {
            $.jBox.tip("请选择知识点", 'warning');
            return false;
        }
    }
}

function buildSelBookStructureTree(treeContainer) {
    ///<summary>构造BookStructure树</summary>

    if (!BsTreeNodes) {
        return;
    }
    treeContainer.dynatree({
        title: "Sel Book Structure Tree",
        clickFolderMode: 1,
        children: BsTreeNodes,
        cookieId: "selBsTree",
        onLazyRead: function (node) {
            var structureId = node.data.key;
            simpleUser.isbn = ISBN;
            $excuteWS("~CmsWS.getLearningObjectiveWithStructureList", { structureId: structureId, isbn: ISBN, exCurriculumId: "", userExtend: simpleUser }, function (result) {
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
            }, null, null);
        },
        onDblClick: function (node, event) {
            node.toggleExpand();
        }
    });
}

//获得知识点名称
function setLoName(loId) {
    //$excuteWS("~CmsWS.getLearningObjectiveForLoIds", { loIds: [loId], userExtend: simpleUser }, function (result) {
    //    if (result && result.length > 0) {
    //        $("#txtKpName").data("loId", result[0].id).val(result[0].unit + ". " + result[0].name);
    //    } else {
    //        $("#txtKpName").data("loId","").val("");
    //    }
    //}, null, null);

    var node = $("#divTree").dynatree("getActiveNode");
    if (node) {
        $("#txtKpName").data("loId", node.data.key).val(node.data.title);
    }
}