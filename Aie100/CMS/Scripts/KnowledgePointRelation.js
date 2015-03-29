/// <reference path="../../Scripts/jquery-1.4.1.min.js" />

var ISBN = "";
var KnowledgePointsDataSvr = null;      //KnowledgePoints数据维护对象
var RelationTreeData = null;            //树节点的数据
var $SelRelationList = null;            //可选的知识点列表对象
var HasRelationArray = [];              //已选知识点关系数据
var SelRelationArray = [];              //可选知识点关系数据
window.isReloadTree = false;            //是否需要重新加载树（当树内容改变时设置为true）
var BookWrapperArray = [];
var $dataTable = null;
var _loIdsSink = [];                    //不能关联的知识点列表

function PageLoad() {
    InitCmsMenu("m_KnowledgeRelation");
    $("#btnSave").bind("click", saveKpRelations);
    $(window).resize(function () {
        ResetTreeNavFrameHeight("bookStructureTree", "dvRightContent");
    });
    bindDiscipline();
    bindBookInfo();
    $dataTable = $("#hasRelationBox #hasRelationList");
    $("#selBookList").change(function () {
        RelationTreeData = null;
        ISBN = $(this).val();
        var $tbContentbox = $("#tbContentbox");
        if (ISBN != "-1") {
            var bookWrapper = findBookObj(ISBN);
            bindDiscipline(bookWrapper.disciplineId);
            bindSubject(bookWrapper.disciplineId, bookWrapper.subjectId);

            $tbContentbox.show();
            ResetTreeNavFrameHeight("bookStructureTree", "dvRightContent");
            $("#bookStructureTree").empty().html("<img src='../Images/ajax-loader_b.gif' style='margin-left:38%; margin-top:5%;' />");
            $("#dvRelationTree").empty().html("<img src='../Images/ajax-loader_b.gif' style='margin-left:38%; margin-top:5%;' />");
            $excuteWS("~CmsWS.getBookStructureArray", { isbn: ISBN, isLazy: true }, function (result) {
                buildBookStructureTree(result);
                bindRelationTree(result);
            }, null, null);
            AddUserParam("isbn", ISBN);
        } else {
            $("#bookStructureTree").empty();
            $tbContentbox.hide();
            SetUserParam("isbn", "");
        }
        $("#hasRelationList").hide();
        $("#relationTip").show();
    });

    $("#btnViewRelationMap").click(function () {
        //OldStructureId
        if (OldStructureLevel && OldStructureLevel != "") {
            if (OldStructureLevel == "10") {
                window.open("/AcephericsClient/Report/KnowledgeVisualMap.aspx?userId=" + SimpleUser.userId + "&sectionId=" + SimpleUser.SectionId + "&tUserId=" + SimpleUser.userId + "&tRoleId=" + SimpleUser.roleId + "&loId="+OldStructureId);
            } else {
                window.open("/AcephericsClient/Report/KnowledgeVisualMap.aspx?userId=" + SimpleUser.userId + "&sectionId=" + SimpleUser.SectionId + "&tUserId=" + SimpleUser.userId + "&tRoleId=" + SimpleUser.roleId + "&structureId=" + OldStructureId);
            }
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
        }
    }, null, null);
}

var OldStructureId = "";
var OldStructureLevel = "";
function buildBookStructureTree(bsData) {
    ///<summary>构造BookStructure树</summary>
    var bsTreeNodes = bsData[0];
    if (!bsTreeNodes) {
        return;
    }

    KnowledgePointsDataSvr = new KnowledgePointsData();

    var $tree = $("#bookStructureTree").dynatree({
        title: "Book Structure Tree",
        clickFolderMode: 1,
        children: bsTreeNodes,
        cookieId: "bookStructureTree",
        onLazyRead: function (node) {
            var structureId = node.data.key;
            SimpleUser.isbn = ISBN;
            $excuteWS("~CmsWS.getLearningObjectiveWithStructureList", { structureId: structureId, isbn: ISBN, exCurriculumId: "", userExtend: SimpleUser }, onGetKnowledgePoints, null, node);
        },
        onClick: function (node, event) {
            if (event.target.className != "dynatree-expander") {
                if (node.data.key != OldStructureId) {
                    OldStructureId = node.data.key;
                    OldStructureLevel = node.parent.data.structureLevel;
                    showHasRelations(node);
                    $excuteWS("~CmsWS.loIdsSink", { loId: node.data.key, userExtend: SimpleUser }, function (result) {
                        _loIdsSink = (result && result.length > 0) ? result : [];
                    }, null, node);
                }
            }
        },
        onDblClick: function (node, event) {
            node.toggleExpand();
        },
        onCreate: function (node, span) {
            //bindContextMenu(node, span);
        }
    });

    if (window.isReloadTree) {
        $tree.dynatree("getTree").reload();
    } else {
        window.isReloadTree = true;
    }

    $("#tbContentbox").colResizable({
        liveDrag: true,
        minWidth: 100
    });
}


var OldRStructureId = "";
function bindRelationTree(bsData) {
    var bsTreeNodes = bsData[0];
    if (!bsTreeNodes) {
        return;
    }

    var $tree = $("#dvRelationTree").dynatree({
        title: "Relation Tree",
        clickFolderMode: 1,
        children: bsTreeNodes,
        cookieId: "relationTree",
        onLazyRead: function (node) {
            var structureId = node.data.key;
            SimpleUser.isbn = ISBN;
            $excuteWS("~CmsWS.getLearningObjectiveWithStructureList", { structureId: structureId, isbn: ISBN, exCurriculumId: "", userExtend: SimpleUser }, onGetKnowledgePoints, null, node);
        },
        onClick: function (node, event) {
            if (event.target.className != "dynatree-expander") {
                if (node.data.key != OldRStructureId) {
                    OldRStructureId = node.data.key;
                    if (node.parent.data.structureLevel == "10") {
                        addLoLoRelation(node);
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
}

function bindContextMenu(node, span) {
    ///<summary>Contextmenu helper</summary>
    
    var bindMenu = "";
    if (node.parent.data.structureLevel == "10") {
        bindMenu = "knowledgePointMenu";
    }
    // Add context menu to this node:
    $(span).contextMenu({ menu: bindMenu }, function (action, el, pos) {
        // The event was bound to the <span> tag, but the node object
        // is stored in the parent <li> tag
        var node = $.ui.dynatree.getNode(el);
        span.click();
        switch (action) {
            case "addRelation":
                addRelation(node);
                break;
            default:
                alert("Todo: appply action '" + action + "' to node " + node);
        }
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

function showHasRelations(node) {
    ///<summary>显示已选关系知识点的列表</summary>

    var $hasRelationBox = $("#hasRelationBox");
    var $hasRelationList = $hasRelationBox.find("#hasRelationList");
    var $relationTip = $hasRelationBox.find("#relationTip");

    HasRelationArray = [];
    if (node.parent.data.structureLevel == "10") {
        $hasRelationList.show();
        $relationTip.hide();
        $hasRelationBox.showLoading();
        $excuteWS("~CmsWS.getLoLoList", { loId: node.data.key, userExtend: SimpleUser }, onGetLoLoList, null, node);
    } else {
        $hasRelationList.hide();
        $relationTip.show();
    }
}

function onGetLoLoList(result, node) {
    var $hasRelationBox = $("#hasRelationBox");
    var $hasRelationList = $hasRelationBox.find("#hasRelationList");
    $hasRelationBox.hideLoading();
    $hasRelationList.find("tr:gt(0)").remove();
    if (!result || result.length == 0) {
        //$hasRelationList.append("<tr><td colspan='5' align='center'>无相关知识点</td></tr>");
        var kp = KnowledgePointsDataSvr.Get(node.parent.data.key, node.data.key);
        addHasRelationObj(kp);  //添加关系时默认需要添加自己

        var loloWeight = kp.loloWeight ? kp.loloWeight : "";
        var sBuilder = [];
        sBuilder.push("<tr id='" + kp.id + "' step='" + kp.step + "'>");
        sBuilder.push("<td>" + kp.unit + "</td>");
        sBuilder.push("<td><span style='color:#1a5fbf; cursor:pointer' onclick='viewKpInfo(\"" + kp.id + "\", event)'>" + kp.name + "</span></td>");
        sBuilder.push("<td align='center' style='display:none'><input type='text' value='" + loloWeight + "' style='width:25px;height:10px;font-size:10px' /></td>");
        sBuilder.push("<td align='center'>&nbsp;</td>");
        sBuilder.push("<td>&nbsp;</td>");
        sBuilder.push("</tr>");
        $hasRelationList.append(sBuilder.join(""));
    } else {
        HasRelationArray = (result) ? result : [];
        var row = "";
        $.each(result, function () {
            var loloWeight = this.loloWeight ? this.loloWeight : "";
            var op = "&nbsp;";
            if (this.id != node.data.key) {
                op = "<img title='删除知识点关系' alt='' src='Images/application_delete.png' style='cursor:pointer;' onclick='delKpRelation(this)' />";
            }
            row = "<tr id='" + this.id + "' step='" + this.step + "'>" +
                    "    <td>" + this.unit + "</td>" +
                    "    <td><span style='color:#1a5fbf; cursor:pointer' onclick='viewKpInfo(\"" + this.id + "\", event)'>" + this.name + "</span></td>" +
                    "    <td align='center' style='display:none'><input type='text' value='" + loloWeight + "' style='width:25px;height:10px;font-size:10px' /></td>" +
                    "    <td align='center'>" + op + "</td>" +
                    "    <td>&nbsp;</td>" +
                    "</tr>";
            $hasRelationList.append(row);
        });
    }
}

function addRelation(node) {
    OldRelationId = "";
    var kp = KnowledgePointsDataSvr.Get(node.parent.data.key, node.data.key);
    addHasRelationObj(kp);  //添加关系时默认需要添加自己
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
    strArray.push("   <th style='text-align:left; width:100px'>单元</th>");
    strArray.push("   <th style='text-align:left;'>知识点</th>");
    strArray.push("  </tr>");
    strArray.push(" </table>");
    strArray.push(" </div>");
    strArray.push("</td>");
    strArray.push("</tr>");
    strArray.push("</table>");
    strArray.push("</div>");

    var boxTitle = kp.unit + " " + kp.name;
    var $jb = $.jBox(strArray.join(""), { title: boxTitle, width: 918, top: "15%", buttons: { "确定": true, "取消": false }, submit: submitRelation });
    var $selRelationBox = $jb.find("#selRelationBox");
    var $selRelationTree = $selRelationBox.find("#selRelationTree");
    $SelRelationList = $("#selRelationBox .kpr_sel_item");
    $SelRelationList.data("_currkpId", kp.id);
    if (RelationTreeData) {
        buildRelationTree($selRelationTree, RelationTreeData);
    } else {
        $selRelationTree.empty().html("<img src='../Images/ajax-loader_b.gif' style='margin-left:38%; margin-top:5%;' />");
        $excuteWS("~CmsWS.getBookStructureArray", { isbn: ISBN,  isLazy: false }, function (bsData) {
            RelationTreeData = bsData[0];
            if (RelationTreeData) {
                buildRelationTree($selRelationTree, RelationTreeData);
            }
        }, null, null);
    }
}

function submitRelation(v, h, f) {
    if (v == true) {
        var node = $("#bookStructureTree").dynatree("getActiveNode");
        onGetLoLoList(HasRelationArray, node);
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

    markSelectedNodes(HasRelationArray, treeContainer.dynatree("getTree"));
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
        $SelRelationList.append("<tr class='lightblue'><td>&nbsp;</td><td>&nbsp;</td><td>无相关知识点</td></tr>");
        return;
    }
    SelRelationArray = result;

    var row = "";
    var rowClass = "";
    var checked = "";
    var disabled = "";
    var kp = null;
    var currKpId = $SelRelationList.data("_currkpId");
    var arrSelected = HasRelationArray.slice(0);

    $.each(result, function (i) {
        if (i % 2 == 0) {
            rowClass = "class='lightblue'";
        } else {
            rowClass = "";
        }
        
        checked = "";
        disabled = "";
        if (arrSelected.length > 0) {
            kp = extractObject(this.id, arrSelected);
            if (kp) {
                checked = "checked='checked'";
                if (kp.id == currKpId) {
                    disabled = "disabled='disabled'";
                }
            }
        }

        row = "<tr " + rowClass + ">";
        row += "<td style='text-align:center'><input id='" + this.id + "' type='checkbox' " + checked + " " + disabled + " /></th>";
        row += "<td>" + this.unit + "</td>";
        row += "<td><span style='color:#1a5fbf; cursor:pointer' onclick='viewKpInfo(\"" + this.id + "\", event)'>" + this.name + "</span></td>";
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

function showLoading(obj) {
    obj.append("<div id='_loadingBox' style='width:500px; top:0px; left:410px; position:absolute; z-index:100; text-align:center; margin-top:200px'><img src='../Images/ajax-loader_b.gif' /></div>");
}

function closeLoading(obj) {
    obj.find("#_loadingBox").remove();
}

function getHasRelationObj(id) {
    ///<summary>返回已经选择的知识点对象</summary>

    var idx = HasRelationArray.indexOf("id", id);
    if (idx != -1) {
        return HasRelationArray[idx];
    } else {
        return null;
    }
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

function addHasRelationObj(obj) {
    ///<summary>选择知识点对象</summary>

    var idx = HasRelationArray.indexOf("id", obj.id);
    if (idx == -1) {
        HasRelationArray.push(obj);
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

function saveKpRelations() {
    ///<summary>保存知识点关系</summary>
    
    if ($("#selBookList").val() == "-1") {
        $.jBox.info("请选择书", "提示", { buttons: { '确定': true} });
        return;
    }

    var kp = null;
    var node = $("#bookStructureTree").dynatree("getActiveNode");
    if (node && node.parent.data.structureLevel == "10") {
        kp = KnowledgePointsDataSvr.Get(node.parent.data.key, node.data.key);
    } else {
        $.jBox.info("请选择知识点", "提示", { buttons: { '确定': true} });
        return;
    }

    var validWeight = true;

    if (kp) {
        //if (HasRelationArray.length > 0) {
        //    var $weight = null;
        //    var sweight = "";
        //    var weight = 0;
        //    var relationKp = null;
        //    $("#hasRelationList tr:gt(0)").each(function (i) {
        //        $weight = $(this).find("input");
        //        sweight = $weight.val() ? $weight.val() : "0";
        //        if (!isNaN(sweight)) {
        //            weight = parseFloat(sweight);
        //            if (weight > 0 && weight <= 1) {
        //                relationKp = getHasRelationObj(this.id);
        //                if (relationKp) {
        //                    relationKp.loloWeight = weight;
        //                }
        //            } else {
        //                validWeight = false;
        //                return false;
        //            }
        //        } else {
        //            validWeight = false;
        //            return false;
        //        }
        //    });
        //}

        //if (!validWeight) {
        //    $.jBox.tip("权重输入错误.", 'warning');
        //} else {
        //    window.$ws_tpath = "AjaxWebService/";
        //    $excuteWS("~CmsWS.editLoLo", { locW: kp, locWs: HasRelationArray, userExtend: SimpleUser }, function (result) {
        //        if (result) {
        //            $.jBox.tip("保存成功", 'success');
        //        } else {
        //            $.jBox.tip('保存点失败.', 'error');
        //        }
        //    }, null, null);
        //}

        //计算并分配权重
        var len = HasRelationArray.length;
        if (len > 0) {
            allocationProbability(calcProbability(len), HasRelationArray);
        }
        $excuteWS("~CmsWS.editLoLo", { locW: kp, locWs: HasRelationArray, userExtend: SimpleUser }, function (result) {
            if (result) {
                $.jBox.tip("保存成功", 'success');
            } else {
                $.jBox.tip('保存点失败.', 'error');
            }
        }, null, null);

    }
}

function delKpRelation(sender) {
    ///<summary>删除知识点关系</summary>

    var $row = $(sender).parent().parent();
    var delKp = delHasRelationObj($row.attr("id"));
    if (delKp) {
        $row.remove();
        if (HasRelationArray.length == 0) {
            $("#hasRelationList").append("<tr><td colspan='5' align='center'>无相关知识点</td></tr>");
        }
    }
}

function markSelectedNodes(selectedArr, tree) {
    ///<summary>在树上标注被选中的节点</summary>
    
    if (selectedArr.length == 0) {
        return;
    }

    $.each(selectedArr, function () {
        var node = tree.getNodeByKey(this.structureId);
        if (node && !node.isSelected()) {
            node.visitParents(function (node) {
                node.select(true);
            }, true);
        } 
    });
}

function extractObject(id, arrObj) {
    ///<summary>从对象数组arrObj中提取指定id的对象</summary>
    
    var idx = arrObj.indexOf("id", id);
    if (idx != -1) {
        var obj = arrObj.splice(idx, 1);
        return obj[0];
    } else {
        return null;
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
                $("#Sub").find("option:gt(0)").remove();
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

function findBookObj(isbn) {
    var book = null;
    for (var i = 0; i < BookWrapperArray.length; i++) {
        if (BookWrapperArray[i].isbn == isbn) {
            book = BookWrapperArray[i];
        }
    }
    return book;
}

function addLoLoRelation(node) {
    if (!$dataTable.is(":visible")) {
        $.jBox.tip('请先在左边树中选择知识点', 'info');
        return;
    }

    var lolo = {};
    var x = HasRelationArray.indexOf("id", node.data.key);
    if (x == -1) {
        var kp = KnowledgePointsDataSvr.Get(node.parent.data.key, node.data.key);



        var n = $.inArray(node.data.key, _loIdsSink);
        if (n != -1) {
            var leftUnit = "";
            var leftNode = $("#bookStructureTree").dynatree("getActiveNode");
            if (leftNode) {
                var leftkp = KnowledgePointsDataSvr.Get(leftNode.parent.data.key, leftNode.data.key);
                leftUnit = leftkp.unit;
            }
            $.jBox.tip("[知识点" + leftUnit + "]是[知识点" + kp.unit + "]的基础知识点，不能关联！", "info");
            return;
        }

        if (kp) {
            HasRelationArray.push(kp);
            addLoLoRelationRow(kp);
        }
    }
}

function addLoLoRelationRow(kp) {
    var loloWeight = kp.loloWeight ? kp.loloWeight : "";
    var sBuilder = [];
    sBuilder.push("<tr id='" + kp.id + "' step='" + kp.step + "'>");
    sBuilder.push("<td>" + kp.unit + "</td>");
    sBuilder.push("<td><span style='color:#1a5fbf; cursor:pointer' onclick='viewKpInfo(\"" + kp.id + "\", event)'>" + kp.name + "</span></td>");
    sBuilder.push("<td align='center' style='display:none'><input type='text' value='" + loloWeight + "' style='width:25px;height:10px;font-size:10px' /></td>");
    sBuilder.push("<td align='center'><img title='删除知识点关系' alt='' src='Images/application_delete.png' style='cursor:pointer;' onclick='delKpRelation(this)' /></td>");
    sBuilder.push("<td>&nbsp;</td>");
    sBuilder.push("</tr>");
    addLoLoRelationByStep(kp.step, sBuilder.join(""));
}

function addLoLoRelationByStep(step, content) {
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

//分配权重
function allocationProbability(ave, loArray) {
    if (ave.length == 1) {
        for (var i = 0; i < loArray.length; i++) {
            loArray[i].loloWeight = ave[0];
        }
    } else {
        loArray[0].loloWeight = ave[0];
        for (var i = 1; i < loArray.length; i++) {
            loArray[i].loloWeight = ave[1];
        }
    }
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