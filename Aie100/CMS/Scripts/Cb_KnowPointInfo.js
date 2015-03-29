/// <reference path="../../Scripts/jquery-1.4.1.min.js" />
/// <reference path="KnowledgePointsData.js" />

/*
* 自定义书的KnowledgePoint维护
*/

var $divLoInfo = null;                  //知识点编辑界面
var $divDisableOthers = null;           //遮罩层
var StructureId = "";                   //当前选择的书结构结构id
var CurrKnowledgePoint = null;          //当前编辑的KnowledgePoint对象，如果是新增则为空
var CurrStudyReference = null;          //当前编辑的StudyReference对象，如果是新增则为空
var KnowledgePointsDataSvr = null;      //KnowledgePoints数据维护对象
var oldSequence = "";

function InitKnowledgePointBox() {
    ///<summary>初始化知识点的编辑界面</summary>

    if (!$divLoInfo) {
        $divLoInfo = $("#divLoInfo");
    }
    if (!$divDisableOthers) {
        $divDisableOthers = $("#divDisableOthers");
    }

    $divLoInfo.find("#divLoDaoXiang ul").bind("click", onSelectTab);
    $divLoInfo.find("#dvDescription input[name='rdDescriptionGroup']").bind("click", rdDescriptionGroup_click);
    bindCategory();
    divEmathEditorContainerId = "divLoEmathEditor";
    $divLoInfo.draggable({ handle: $divLoInfo.find("#divLoHeader") });

    $("#spAbstractPreview").click(function () {
        editor.hide();
        $("#div_AbstractPreview").remove();
        var $Drill_LoDes = $('<div id="div_AbstractPreview" title="Abstract" style="display:none;">' + $get("divAreaShortDetails").innerHTML + '</div>');
        $Drill_LoDes.dialog({ zIndex: 9999, width: 500, height: 160, position: ['left', 'top'] });
    });

    //    $("#spDetailsPreview").click(function () {
    //        editor.hide();
    //        $("#div_DetailsPreview").remove();
    //        var $Drill_LoDes = $('<div id="div_DetailsPreview" title="Details" style="display:none;">' + $get("divAreaLongDetails").innerHTML + '</div>');
    //        $Drill_LoDes.dialog({ zIndex: 9999, width: 500, height: 160, position: ['left', 'top'] });
    //    });
    //    $("#spExtendPreview").click(function () {
    //        editor.hide();
    //        $("#div_ExtendDiscussionPreview").remove();
    //        var $Drill_LoDes = $('<div id="div_ExtendDiscussionPreview" title="Extended Discussion" style="display:none;">' + $get("divAreaExtendDetails").innerHTML + '</div>');
    //        $Drill_LoDes.dialog({ zIndex: 9999, width: 500, height: 160, position: ['left', 'top'] });
    //    });

    var $txtSequenceName = $divLoInfo.find("#txtSequenceName");
    $divLoInfo.find("#txtSequence").keyup(function (e) {
        if ($txtSequenceName.val() == oldSequence) {
            $txtSequenceName.val(this.value);
            oldSequence = this.value;
        }
    })
}

function EditKnowledgePoint(sid, kpId, action) {
    ///<summary>编辑KnowledgePoint对象</summary>
    ///<param name="sid" type="String">structure id</param>
    ///<param name="kpId" type="String">kp的id</param>

    StructureId = sid;
    clearKpInfo();
    $divLoInfo.find("#spLoNameHeader").html("编辑知识点");
    $divLoInfo.data("_action", action);
    CurrKnowledgePoint = KnowledgePointsDataSvr.Get(sid, kpId);
    if (CurrKnowledgePoint) {
        loadKpInfo(CurrKnowledgePoint);
    }
    $divLoInfo.show();
    $divDisableOthers.show();
}

function DelKnowledgePoint(sid, kpId, callback) {
    ///<summary>删除知识点</summary>

    $.jBox.confirm("你确定要删除这个知识点吗?", "提示", function (v, h, f) {
        if (v == true) {
            $.jBox.tip("正在删除，请稍后...", 'loading');
            var kp = KnowledgePointsDataSvr.Get(sid, kpId);
            if (kp) {
                $excuteWS("~CmsWS.deleteLearningObjectiveCms", { locW: kp, userExtend: SimpleUser }, function (result) {
                    if (result) {
                        $.jBox.closeTip();
                        callback(result);
                    } else {
                        $.jBox.tip('该知识点有相关数据，不能直接删除。', 'error');
                    }
                }, null, null);
            }
        }
    }, { top: "25%", buttons: { '确定': true, '取消': false} });
}

function loadKpInfo(kp) {
    ///<summary>载入知识点信息</summary>

    var $dvBaseInfo = $divLoInfo.find("#dvBaseInfo");
    var $dvDescription = $divLoInfo.find("#dvDescription");
    with ($dvBaseInfo) {
        find("#txtLoName").val(kp.name);
        find("#txtSequence").val(kp.sequence);
        find("#txtSequenceName").val(kp.sequenceName);
        find("#txtURL").val(kp.url);
        find("#txtLocation").val(kp.location);
        find("#txtTags").val(kp.tags);
        if (kp.loCategoryId) {
            find("#ddlCategory").val(kp.loCategoryId);
        }
        $dvDescription.find("#divAreaShortDetails").html(kp.description);
        oldSequence = kp.sequence;
    }

    //    $excuteWS("~CmsWS.getStudyReferenceForLoExtend", { loId: kp.id, userExtend: SimpleUser }, function (result) {
    //        if (result) {
    //            CurrStudyReference = result;
    //            $dvDescription.find("#divAreaLongDetails").html(CurrStudyReference.discription);
    //            $dvDescription.find("#divAreaExtendDetails").html(CurrStudyReference.content);
    //        }
    //    }, null, null);
}

function CloseKpBox() {
    ///<summary>关闭知识点编辑界面</summary>

    $divLoInfo.hide();
    $divDisableOthers.hide();
}

function onSelectTab() {
    if (!$(this).hasClass("c_ore")) {
        var $siblingTabs = $(this).siblings();
        $siblingTabs.removeClass().addClass("daoxiang_link c_blue");
        $(this).removeClass().addClass("daoxiang_hover_2 c_ore");
        if (this.id == "ulBaseInfo") {
            $("#dvBaseInfo").show();
            $("#dvDescription").hide();
            //            $("#divLoDescriptionPreview").hide();
        } else {
            $("#dvBaseInfo").hide();
            $("#dvDescription").show();
            //            $("#divLoDescriptionPreview").show();
        }
    }
}

function bindCategory() {
    var oSel = $("#ddlCategory");
    $excuteWS("~CmsWS.getLoCategoryList", { userExtend: SimpleUser }, function (result) {
        oSel.find("option:gt(0)").remove();
        if (result) {
            $.each(result, function () {
                oSel.append("<option value='" + this.id + "'>" + this.name + "</option>");
            });
            oSel.get(0).selectedIndex = 1;
        }
    }, null, null);
}

function rdDescriptionGroup_click() {
    var $dvDescription = $divLoInfo.find("#dvDescription");
    var $divShortDescription = $dvDescription.find("#divShortDescription");
    var $divLongDescription = $dvDescription.find("#divLongDescription");
    var $divExtendDescription = $dvDescription.find("#divExtendDescription");

    if ($(this).val() == "short") {
        $divShortDescription.show();
        $divLongDescription.hide();
        $divExtendDescription.hide();
    } else if ($(this).val() == "long") {
        $divLongDescription.show();
        $divShortDescription.hide();
        $divExtendDescription.hide();
    } else if ($(this).val() == "extend") {
        $divExtendDescription.show();
        $divShortDescription.hide();
        $divLongDescription.hide();
    }
}

function onBtnCancelClick() {
    ///<summary>取消知识点的当前编辑</summary>

    if (editor) {
        editor.hide();
    }
    CloseKpBox();
    clearKpInfo();
}

function clearKpInfo() {
    ///<summary>清除LO界面信息</summary>

    $divLoInfo.find("#divLoDaoXiang ul:eq(0)").trigger("click");
    $divLoInfo.find("#dvDescription #rdShortDescription").trigger("click");
    $divLoInfo.find("input[type=text]").val("");
    $divLoInfo.find("select.inp").get(0).selectedIndex = 1;
    $divLoInfo.find("div[class=loDetails]").html("&nbsp;");
}

var editor = null;
function onLoDescriptionDivClick(currentDIV) {
    ///<summary>点击div加入编辑器</summary>

//    var divLoEmathEditor = $("#divLoEmathEditor").get(0);
//    divLoEmathEditor.style.display = "none";
//    currentDIV.style.overflow = "hidden";
//    create_emath_editor({ editorContainer: currentDIV, width: "100%", height: "330px" });
//    currentDIV.parentNode.insertBefore(divLoEmathEditor, currentDIV);
    //    divLoEmathEditor.style.display = "block";
    if (editor == null) {
        editor = new emath_editor();
        editor.show_mode = "latex";
    }

    editor.upload_path = "../Uploads/CMS/" + $("#selBookList").find("option:selected").attr("id");
    editor.edit_height = "272px";
    editor.edit_container = currentDIV;
    editor.hide();
    editor.show(); 
    editor.jsUploadImage($("#selBookList").find("option:selected").attr("id"));
}

function onBtnConfirmClick() {
    var validteFlag = validateLearningObjectiveInfo();
    if (validteFlag == null) {
        editor.hide();
        CloseKpBox();
        var treeAction = $divLoInfo.data("_action");
        var kp = getKnowledgePointWrapper();
        SimpleUser.isbn = $("#selBookList").val();
        $excuteWS("~CmsWS.editLearningObjectiveCms", { locW: kp, userExtend: SimpleUser }, function (result) {
            if (result) {
                kp.id = result.id;
                treeAction(result);
            }
        }, null, null);
    } else {
        $.jBox.tip(validteFlag, 'warning');
        $divLoInfo.find("#divLoDaoXiang ul:eq(0)").trigger("click");
    }
}

function validateLearningObjectiveInfo() {
    ///<summary>验证知识点界面输入信息是否合法</summary>

    var $dvBaseInfo = $divLoInfo.find("#dvBaseInfo");
    with ($dvBaseInfo) {
        if (find("#txtLoName").val().trim() == "") {
            return "Name is required.";
        }
        if (find("#txtSequence").val().trim() == "") {
            return "Sequence is required.";
        }
        if (find("#txtSequenceName").val().trim() == "") {
            return "Sequence name is required.";
        }
        if (find("#ddlCategory").val() == "-1") {
            return "Category is required.";
        }
    }
    return null;
}

function getKnowledgePointWrapper() {
    ///<summary>返回KnowledgePoint对象</summary>

    var $dvBaseInfo = $divLoInfo.find("#dvBaseInfo");
    var $ddlCategory = $dvBaseInfo.find("#ddlCategory");
    var $selectedBookItem = $("#selBookList").find("option:selected");

    if (!CurrKnowledgePoint) {
        CurrKnowledgePoint = {};
        CurrKnowledgePoint.id = null;
    }
    with ($dvBaseInfo) {
        CurrKnowledgePoint.name = find("#txtLoName").val().trim();
        CurrKnowledgePoint.loCategoryName = $ddlCategory.find("option:selected").text();
        CurrKnowledgePoint.loCategoryId = $ddlCategory.val();
        CurrKnowledgePoint.sequence = find("#txtSequence").val().trim();
        CurrKnowledgePoint.sequenceName = find("#txtSequenceName").val().trim();
        CurrKnowledgePoint.structureId = StructureId;
        CurrKnowledgePoint.location = find("#txtLocation").val().trim();
        CurrKnowledgePoint.url = find("#txtURL").val().trim();
        CurrKnowledgePoint.bookId = $selectedBookItem.attr("id");
        CurrKnowledgePoint.bookTitle = $selectedBookItem.text();
        CurrKnowledgePoint.description = $divLoInfo.find("#dvDescription #divAreaShortDetails").html();
        CurrKnowledgePoint.tags = find("#txtTags").val().trim();
    }
    return CurrKnowledgePoint;
}

//function getStudyReferenceWrapper(loId) {
//    ///<summary>返回StudyReference对象</summary>

//    var $dvDescription = $divLoInfo.find("#dvDescription");

//    if (!CurrStudyReference) {
//        CurrStudyReference = {};
//        CurrStudyReference.id = null;
//        CurrStudyReference.bookStructureId = null;
//        CurrStudyReference.loId = loId;
//        CurrStudyReference.userId = SimpleUser.userId;
//        CurrStudyReference.title = "Lo Description";
//        CurrStudyReference.location = null;
//        CurrStudyReference.authorDiscription = null;
//        CurrStudyReference.recommendation = "0";
//        CurrStudyReference.difficulty = "0";
//        CurrStudyReference.studyReferenceTypeId = "24";
//        CurrStudyReference.relevancy = "1.0";
//        CurrStudyReference.shareFlag = "2";
//        CurrStudyReference.systemId = SimpleUser.SystemId;
//        CurrStudyReference.locationFlag = "0";
//        CurrStudyReference.type = "8";
//    }
//    CurrStudyReference.discription = $dvDescription.find("#divAreaLongDetails").html();
//    CurrStudyReference.content = $dvDescription.find("#divAreaExtendDetails").html();

//    return CurrStudyReference;
//}


function GetSortKnowledgePointArray() {
    ///<summary>返回需要排序的KnowledgePoint数组</summary>

    var knowledgePointArray = new Array();
    if (KnowledgePointsDataSvr) {
        var structureNode = null;
        var structureIds = KnowledgePointsDataSvr.GetDirtyStructureIds();
        for (var i = 0; i < structureIds.length; i++) {
            structureNode = $BookStructureTree.dynatree("getTree").getNodeByKey(structureIds[i]);
            if (structureNode) {
                var kp = null;
                structureNode.visit(function (node) {
                    kp = KnowledgePointsDataSvr.Get(structureNode.data.key, node.data.key);
                    if (kp) {
                        knowledgePointArray.push(kp);
                    }
                });
            }
        }
    }
    return knowledgePointArray;
}

var DirtyNodes = [];
function GetDirtyKnowledgePointArray() {
    ///<summary>返回新引用的KnowledgePoint数组</summary>

    DirtyNodes = [];
    var knowledgePointArray = new Array();
    if (KnowledgePointsDataSvr) {
        var structureNode = null;
        var structureIds = KnowledgePointsDataSvr.GetDirtyStructureIds();
        for (var i = 0; i < structureIds.length; i++) {
            structureNode = $BookStructureTree.dynatree("getTree").getNodeByKey(structureIds[i]);
            if (structureNode) {
                var kp = null;
                structureNode.visit(function (node) {
                    if (node.data.isNew) {
                        kp = KnowledgePointsDataSvr.Get(structureNode.data.key, node.data.key);
                        if (kp) {
                            knowledgePointArray.push(kp);
                            DirtyNodes.push(node);
                        }
                    }
                });
            }
        }
    }
    return knowledgePointArray;
}

//更新引用知识点
function updateNewKps(oldKps, newKps) {
    for (var i = 0; i < oldKps.length; i++) {
        for (var j = 0; j < newKps.length; j++) {
            if (oldKps[i].pointingId == newKps[j].pointingId) {
                oldKps[i].id = newKps[j].id;
                break;
            }
        }
    }
}

//更新新添加的节点
function updateNewNodes(newKps) {
    if (DirtyNodes && DirtyNodes.length > 0) {
        for (var i = 0; i < DirtyNodes.length; i++) {
            for (var j = 0; j < newKps.length; j++) {
                if (DirtyNodes[i].data.key == newKps[j].pointingId) {
                    DirtyNodes[i].data.key = newKps[j].id;
                    DirtyNodes[i].data.isNew = false;
                    DirtyNodes[i].setTitle(newKps[j].unit + ". " + newKps[j].name);
                    break;
                }
            }
        }
    }
}