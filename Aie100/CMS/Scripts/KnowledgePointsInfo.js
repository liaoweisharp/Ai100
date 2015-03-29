/// <reference path="../../Scripts/jquery-1.4.1.min.js" />
/// <reference path="KnowledgePointsData.js" />

/*
* KnowledgePoints信息维护
*/

var $divLoInfo = null;                  //知识点编辑界面
var $divDisableOthers = null;           //遮罩层
var StructureId = "";                   //当前选择的书结构结构id
var CurrKnowledgePoint = null;          //当前编辑的KnowledgePoint对象，如果是新增则为空
var CurrStudyReference = null;          //当前编辑的StudyReference对象，如果是新增则为空
var KnowledgePointsDataSvr = null;      //KnowledgePoints数据维护对象

var RelationTreeData = null;            //树节点的数据
var HasRelationArray = [];              //已选知识点关系数据
var SelRelationArray = [];              //可选知识点关系数据
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
    // bindCategory($divLoInfo.find("#dvBaseInfo #ddlCognitive"), "");
    divEmathEditorContainerId = "divLoEmathEditor";
    $divLoInfo.draggable({ handle: $divLoInfo.find("#divLoHeader") });

    $("#spAbstractPreview").click(function () {
        //        hidden_emath_editor();
        if (editor) {
            editor.hide();
        }
        $("#div_AbstractPreview").remove();
        var $Drill_LoDes = $('<div id="div_AbstractPreview" title="Abstract" style="display:none;">' + $get("divAreaShortDetails").innerHTML + '</div>');
        $Drill_LoDes.dialog({ zIndex: 9999, width: 500, height: 160, position: ['left', 'top'] });
    });

    //    $("#spDetailsPreview").click(function () {
    //        hidden_emath_editor();
    //        $("#div_DetailsPreview").remove();
    //        var $Drill_LoDes = $('<div id="div_DetailsPreview" title="Details" style="display:none;">' + $get("divAreaLongDetails").innerHTML + '</div>');
    //        $Drill_LoDes.dialog({ zIndex: 9999, width: 500, height: 160, position: ['left', 'top'] });
    //    });
    //    $("#spExtendPreview").click(function () {
    //        hidden_emath_editor();
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
    });
}

function AddKnowledgePoint(sid, sequence, action) {
    ///<summary>添加KnowledgePoint对象/summary>

    StructureId = sid;
    CurrKnowledgePoint = null;
    CurrStudyReference = null;

    clearKpInfo();
    $divLoInfo.find("#spLoNameHeader").html("添加知识点");
    if (sequence != -1) {
        $divLoInfo.find("#txtSequence").val(sequence);
        $divLoInfo.find("#txtSequenceName").val(sequence);
        oldSequence = sequence.toString();
    }
    $divLoInfo.data("_action", action);
    $divLoInfo.show();
    $divDisableOthers.show();
}

function EditKnowledgePoint(sid, kpId, action) {
    ///<summary>编辑KnowledgePoint对象</summary>

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

function EditKnowledgePoint1(kp, action) {
    ///<summary>编辑KnowledgePoint对象</summary>

    StructureId = kp.structureId;
    clearKpInfo();
    $divLoInfo.find("#spLoNameHeader").html("编辑知识点");
    $divLoInfo.data("_action", action);
    CurrKnowledgePoint = kp;
    loadKpInfo(kp);
    var $o = $("#_KpsEditHistoryBox");
    if ($o.get(0)) {
        $divDisableOthers.removeClass().addClass("transparentDIV");
        $divDisableOthers.zIndex($o.zIndex() + 1);
        $divLoInfo.zIndex($o.zIndex() + 2);
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
                        if (KnowledgePointsDataSvr.Del(sid, kpId)) {
                            callback(result);
                        }
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
        find("#ddlCognitive").val(kp.category);
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
    $divDisableOthers.removeClass().addClass("disabledDIV");
    $divDisableOthers.zIndex(10);
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

function bindCategory(oSel, defVal) {
    $excuteWS("~CmsWS.getLoCategoryList", { userExtend: SimpleUser }, function (result) {
        oSel.find("option:gt(0)").remove();
        if (result) {
            $.each(result, function () {
                oSel.append("<option value='" + this.id + "'>" + this.name + "</option>");
            });
            oSel.val(defVal);
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

    //    hidden_emath_editor();
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
    $divLoInfo.find("select.inp").val("-1");
    $divLoInfo.find("div[class=loDetails]").html("&nbsp;");
    $divLoInfo.find("#ddlCognitive").val("0");
}

//var editor = null;
function onLoDescriptionDivClick(currentDIV) {
    ///<summary>点击div加入编辑器</summary>
    if ($(currentDIV).find("div.emath_editor").length != 0) {
        return;
    }
    if (editor == null) {
        editor = new emath_editor();
        editor.show_mode = "latex";
    }

    editor.edit_container = currentDIV;
    editor.upload_path = "../Uploads/CMS/" + $("#selBookList").find("option:selected").attr("id");

    editor.edit_height = "272px";
    editor.hide();
    editor.show(); 
    editor.jsUploadImage($("#selBookList").find("option:selected").attr("id") + "_SR");
    //    var divLoEmathEditor = $("#divLoEmathEditor").get(0);
    //    divLoEmathEditor.style.display = "none";
    //    currentDIV.style.overflow = "hidden";
    //    create_emath_editor({ editorContainer: currentDIV, width: "100%", height: "330px" });
    //    currentDIV.parentNode.insertBefore(divLoEmathEditor, currentDIV);
    //    divLoEmathEditor.style.display = "block";
}

function onBtnConfirmClick() {
    var validteFlag = validateLearningObjectiveInfo();
    if (validteFlag == null) {
        if (editor) {
            editor.hide();
        }
        //        hidden_emath_editor();
        CloseKpBox();
        var treeAction = $divLoInfo.data("_action");
        var kp = getKnowledgePointWrapper();
        SimpleUser.isbn = $("#selBookList").val();
        if (kp.id == null) {    //新增
            $excuteWS("~CmsWS.saveLearningObjectiveCms", { locW: kp, userExtend: SimpleUser }, function (kp) {
                if (kp) {
                    KnowledgePointsDataSvr.Add(StructureId, kp);
                    treeAction(kp);
                }
            }, null, null);
        } else {
            $excuteWS("~CmsWS.editLearningObjectiveCms", { locW: kp, userExtend: SimpleUser }, function (kp) {
                if (kp) {
                    treeAction(kp);
                }
            }, null, null);
        }

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
            return "知识点名字必填.";
        }
        //if (find("#txtSequence").val().trim() == "") {
        //    return "顺序必填.";
        //}
        //if (find("#txtSequenceName").val().trim() == "") {
        //    return "顺序名必填.";
        //}
        //if (find("#ddlCognitive").val() == "-1") {
        //    return "知识维度必选.";
        //}
    }
    return null;
}

function getKnowledgePointWrapper() {
    ///<summary>返回KnowledgePoint对象</summary>

    var $dvBaseInfo = $divLoInfo.find("#dvBaseInfo");
    var $ddlCognitive = $dvBaseInfo.find("#ddlCognitive");
    var $selectedBookItem = $("#selBookList").find("option:selected");

    if (!CurrKnowledgePoint) {
        CurrKnowledgePoint = {};
        CurrKnowledgePoint.id = null;
    }
    with ($dvBaseInfo) {

        CurrKnowledgePoint.name = find("#txtLoName").val().trim();
        // CurrKnowledgePoint.loCategoryName = $ddlCognitive.find("option:selected").text();
        CurrKnowledgePoint.category = $ddlCognitive.val();
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


function GetKnowledgePointArray() {
    ///<summary>返回KnowledgePoint数组</summary>

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

/////////////合并知识点/////////////
function MergeKnowledgePoint(node) {
    OldRelationId = "";
    var kp = KnowledgePointsDataSvr.Get(node.parent.data.key, node.data.key);

    var strArray = new Array();
    strArray.push("<div id='selRelationBox' style='padding:5px;'>");
    strArray.push("<table class='kpr_contentbox' style='width: 900px; table-layout:fixed'>");
    strArray.push("<tr>");
    strArray.push("<td style='width:400px'><div id='selRelationTree' style='width:100%; height:450px; margin-bottom:8px'></td>");
    strArray.push("<td style='width:500px'>");
    strArray.push(" <div id='dvSelRelations' style='height:456px;overflow:auto;'>");
    strArray.push(" <table border='0' class='kpr_sel_item'>");
    strArray.push("  <tr>");
    strArray.push("   <th style='text-align:center; width:20px'>&nbsp;</th>");
    strArray.push("   <th style='text-align:left; width:100px'>Unit</th>");
    strArray.push("   <th style='text-align:left;'>Knowledge Point</th>");
    strArray.push("  </tr>");
    strArray.push(" </table>");
    strArray.push(" </div>");
    strArray.push("</td>");
    strArray.push("</tr>");
    strArray.push("</table>");
    strArray.push("</div>");

    var boxTitle = kp.unit + " " + kp.name;
    var $jb = $.jBox(strArray.join(""), { title: boxTitle, width: 918, top: "15%", buttons: { "Confirm": true, "Cancel": false }, submit: submitRelation });
    var $selRelationBox = $jb.find("#selRelationBox");
    var $selRelationTree = $selRelationBox.find("#selRelationTree");
    $SelRelationList = $("#selRelationBox .kpr_sel_item");
    $SelRelationList.data("_currkpId", kp.id);
    if (RelationTreeData) {
        buildRelationTree($selRelationTree, RelationTreeData);
    } else {
        $selRelationTree.empty().html("<img src='../Images/ajax-loader_b.gif' style='margin-left:38%; margin-top:5%;' />");
        $excuteWS("~CmsWS.getBookStructureArray", { isbn: ISBN, isLazy: false }, function (bsData) {
            RelationTreeData = bsData[0];
            if (RelationTreeData) {
                buildRelationTree($selRelationTree, RelationTreeData);
            }
        }, null, null);
    }
}

var OldRelationId = "";
function buildRelationTree(treeContainer, treeData) {
    ///<summary>构造RelationStructure树</summary>
    treeContainer.dynatree({
        title: "Relation Tree",
        clickFolderMode: 1,
        children: treeData,
        cookieId: "relationTree",
        onClick: function (node, event) {
            if (event.target.className != "dynatree-expander") {
                if (node.data.key != OldRelationId && node.data.structureLevel != "0") {
                    OldRelationId = node.data.key;
                    showSelRelations(node);
                }
            }
        },
        onDblClick: function (node, event) {
            node.toggleExpand();
        }
    });
}

function showSelRelations(node) {
    ///<summary>可选知识点关系列表</summary>

    $SelRelationList.parent().showLoading();
    var structureId = node.data.key;
    SimpleUser.isbn = ISBN;
    $excuteWS("~CmsWS.getLearningObjectiveWithStructureList", { structureId: structureId, isbn: ISBN, exCurriculumId: "", userExtend: SimpleUser }, onGetRelationList, null, node);
}

function onGetRelationList(result, node) {

    $SelRelationList.parent().hideLoading();
    $SelRelationList.find("tr:gt(0)").remove();
    if (!result || result.length == 0) {
        SelRelationArray = [];
        $SelRelationList.append("<tr class='lightblue'><td>&nbsp;</td><td>&nbsp;</td><td>No related knowledge</td></tr>");
        return;
    }
    SelRelationArray = result;

    var row = "";
    var rowClass = "";
    var disabled = "";
    var kp = null;
    var currKpId = $SelRelationList.data("_currkpId");

    $.each(result, function (i) {
        if (i % 2 == 0) {
            rowClass = "class='lightblue'";
        } else {
            rowClass = "";
        }

        disabled = "";
        if (this.id == currKpId) {
            disabled = "disabled='disabled'";
        }

        row = "<tr " + rowClass + ">";
        row += "<td style='text-align:center'><input id='" + this.id + "' type='checkbox' " + disabled + " /></th>";
        row += "<td>" + this.unit + "</td>";
        row += "<td>" + this.name + "</td>";
        row += "</tr>";
        $SelRelationList.append(row);
    });
    $SelRelationList.find("tr:gt(0)")
    .hover(function () {
        $(this).addClass("hover");
    }, function () {
        $(this).removeClass("hover");
    })
    .click(function () {
        var $checked = $(this).find("input");
        if ($checked.attr("disabled") != "disabled") {
            if ($checked.is(":checked")) {
                $checked.attr("checked", false);
                delHasRelationObj($checked.attr("id"));
            } else {
                $checked.attr("checked", true);
                var kp = getSelRelationObj($checked.attr("id"));
                if (kp) {
                    addHasRelationObj(kp);
                }
            }
        }
    })
    .find("input").click(function (event) {
        event.stopPropagation();
        var kp = getSelRelationObj(this.id);
        if (kp) {
            addHasRelationObj(kp);
        }
    });
}

function delHasRelationObj(id) {
    ///<summary>删除已经选择的知识点对象</summary>

    var idx = HasRelationArray.indexOf("id", id);
    if (idx != -1) {
        var obj = HasRelationArray.splice(idx, 1);
        return obj[0];
    } else {
        return null;
    }
}

function getSelRelationObj(id) {
    ///<summary>返回可选择的知识点对象</summary>

    var idx = SelRelationArray.indexOf("id", id);
    if (idx != -1) {
        return SelRelationArray[idx];
    } else {
        return null;
    }
}

function addHasRelationObj(obj) {
    ///<summary>选择知识点对象</summary>

    var idx = HasRelationArray.indexOf("id", obj.id);
    if (idx == -1) {
        HasRelationArray.push(obj);
    }
}

function submitRelation(v, h, f) {
    if (v == true) {
        var sourceKpIds = [];
        for (var i = 0; i < HasRelationArray.length; i++) {
            sourceKpIds.push(HasRelationArray[i].id);
        }
        HasRelationArray = [];

        var param = {};
        param.targetKpId = $SelRelationList.data("_currkpId");
        param.sourceKpId = sourceKpIds
        param.userExtend = SimpleUser;
        $.jBox.tip("Processing, please wait...", 'loading');
        $excuteWS("~CmsWS.mergeKnowledgePoint", param, function (result) {
            if (result) {
                $.jBox.tip('Save success.', 'success');
                $("#selBookList").trigger("change");
            } else {
                $.jBox.tip('Save failed!', 'error');
            }
        }, null, null);
    }
}

//保存知识点
function manageLearningObjectiveCms(sid, kpWrapper, callback) {
    SimpleUser.isbn = $("#selBookList").val();
    $excuteWS("~CmsWS.manageLearningObjectiveCms", { locs: [kpWrapper], userExtendWrapper: SimpleUser }, function (result) {
        if (result != null) {
            var kp = result[0];
            if (!kpWrapper.id) {    //新增结构需要加入本地缓存中
                KnowledgePointsDataSvr.Add(sid, kp);
            }
            callback(kp);
        }
    }, null, null);
}