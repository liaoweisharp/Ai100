/// <reference path="../../Scripts/jquery-1.4.1.min.js" />

/*
* 学习资料的相关知识点
*/

var LoTreeData = null;          //树节点的数据
var LoStudyReferArray = [];     //已选关系
var LoStudyReferBox = null;     //弹出窗口

//学习资料相关知识点
function LoStudyReference(studyReferId, title, isEditable) {
    if (!studyReferId) return;
    var _title = (title) ? title : "学习资料相关知识点";
    var $jb;
    if (isEditable) {
        $jb = $.jBox(initLoStudyReferenceBox(), { id: 'jb_LoStudyRefer', title: _title, width: 958, top: "15%", buttons: { "确定": true, "取消": false }, submit: submitLoStudyRefer });
    } else {
        $jb = $.jBox(initLoStudyReferenceBox(), { id: 'jb_LoStudyRefer', title: _title, width: 958, top: "15%", buttons: {}, submit: submitLoStudyRefer });
    }

    LoStudyReferBox = $jb.find("#dvLoStudyReferBox");
    var $dvLoTree = LoStudyReferBox.find("#dvLoTree");
    var $dvSelLoStudyRefer = LoStudyReferBox.find("#dvSelLoStudyRefer");
    LoStudyReferBox.data("_studyReferId", studyReferId);
    LSR_loadLoTree($dvLoTree);
    loadSelectedItems(studyReferId, $dvSelLoStudyRefer);
}

//初始化选择界面
function initLoStudyReferenceBox() {
    var strArray = new Array();
    strArray.push("<div id='dvLoStudyReferBox' style='padding:5px;'>");
    strArray.push("<table class='kpr_contentbox' style='width: 900px; table-layout:fixed'>");
    strArray.push("<tr>");
    strArray.push("<td style='width:350px'><div id='dvLoTree' style='width:100%; height:450px; margin-bottom:8px'></td>");
    strArray.push("<td style='width:590px'>");
    strArray.push(" <div id='dvSelLoStudyRefer' style='height:456px;overflow:auto;'>");
    strArray.push(" <table border='0' class='kpr_sel_item'>");
    strArray.push("  <tr>");
    strArray.push("   <th style='text-align:left;'>知识点</th>");
    strArray.push("   <th style='text-align:center; width:75px'>权重</th>");
    strArray.push("   <th style='text-align:center; width:75px'>目标知识点?</th>");
    strArray.push("   <th style='text-align:center; width:75px'>认知层次</th>");
    strArray.push("   <th style='text-align:center; width:50px'>删除</th>");
    strArray.push("  </tr>");
    strArray.push(" </table>");
    strArray.push(" </div>");
    strArray.push("</td>");
    strArray.push("</tr>");
    strArray.push("</table>");
    strArray.push("</div>");
    return strArray.join("");
}

//加载bookStructureTree
function LSR_loadLoTree(treeContainer) {
    if (LoTreeData) {
        LSR_buildRelationTree(treeContainer, LoTreeData);
    } else {
        treeContainer.empty().html("<img src='../Images/ajax-loader_b.gif' style='margin-left:38%; margin-top:5%;' />");
        $excuteWS("~CmsWS.getBookStructureArray", { isbn: ISBN, isLazy: true }, function (bsData) {
            LoTreeData = bsData[0];
            if (LoTreeData) {
                LSR_buildRelationTree(treeContainer, LoTreeData);
            }
        }, null, null);
    }
}

//加载已选关系
function loadSelectedItems(studyReferId, container) {
    container.showLoading();
    $excuteWS("~CmsWS.getLoStudyReferenceList", { studyReferenceId: studyReferId, userExtend: simpleUser }, bindSelectedItems, null, { contentbox: container });
}

function bindSelectedItems(result, context) {
    var $contentbox = context.contentbox;
    var $dataTable = $contentbox.find(".kpr_sel_item");

    $contentbox.hideLoading();
    $dataTable.find("tr:gt(0)").remove();
    if (!result || result.length == 0) {
        $dataTable.append("<tr class='nodata lightblue'><td colspan='6'>无记录</td></tr>");
        LoStudyReferArray = [];
        return;
    } else {
        LoStudyReferArray = result;
    }

    var sBuilder = [];
    var rowClass = "";
    var title = "";
    var checked = "";

    $.each(result, function (i) {
        if (i % 2 == 0) {
            rowClass = "class='lightblue'";
        } else {
            rowClass = "";
        }

        title = this.loUnit + ". " + this.loName;
        checked = (this.loType == "1") ? "checked='checked'" : "";

        sBuilder = [];
        sBuilder.push("<tr id='" + this.id + "' loId='" + this.loId + "' " + rowClass + ">");
        sBuilder.push("<td>" + title + "</td>");
        sBuilder.push("<td align='center'><input type='text' value='" + this.probability + "' style='width:25px;height:10px;font-size:10px' /></td>");
        sBuilder.push("<td align='center'><input type='checkbox' " + checked + " /></td>");
        sBuilder.push("<td align='center'>");
        sBuilder.push("<select>");

        sBuilder.push("<option value='-1'>认知层次</option>");
        sBuilder.push(String.format("<option value='{0}' {1}>1.记忆</option>", 1, this.cognitiveType == "1" ? "selected='true'" : ""));
        sBuilder.push(String.format("<option value='{0}' {1}>2.理解</option>", 2, this.cognitiveType == "2" ? "selected='true'" : ""));
        sBuilder.push(String.format("<option value='{0}' {1}>3.应用</option>", 3, this.cognitiveType == "3" ? "selected='true'" : ""));
        sBuilder.push(String.format("<option value='{0}' {1}>4.分析</option>", 4, this.cognitiveType == "4" ? "selected='true'" : ""));
        sBuilder.push(String.format("<option value='{0}' {1}>5.评价</option>", 5, this.cognitiveType == "5" ? "selected='true'" : ""));
        sBuilder.push(String.format("<option value='{0}' {1}>6.创造</option>", 6, this.cognitiveType == "6" ? "selected='true'" : ""));
        sBuilder.push("</select>");
        sBuilder.push("</td>");

        sBuilder.push("<td align='center'><img title='Delete' alt='' src='Images/application_delete.png' style='cursor:pointer;' onclick='deleteLoStudyReferRow(\"" + this.loId + "\", this)' /></td>");
        sBuilder.push("</tr>");
        $dataTable.append(sBuilder.join(''));
    });

    $dataTable.find("tr:gt(0)").hover(function () {
        $(this).addClass("hover");
    }, function () {
        $(this).removeClass("hover");
    });
}

var LSR_OldRelationId = "";
function LSR_buildRelationTree(treeContainer, treeData) {
    ///<summary>构造RelationStructure树</summary>
    treeContainer.dynatree({
        title: "Relation Tree",
        clickFolderMode: 1,
        children: treeData,
        cookieId: "relationTree",
        onLazyRead: function (node) {
            var structureId = node.data.key;
            simpleUser.isbn = ISBN;
            $excuteWS("~CmsWS.getLearningObjectiveWithStructureList", { structureId: structureId, isbn: ISBN, exCurriculumId: "", userExtend: simpleUser }, onGetKnowledgePoints, null, node);
        },
        onClick: function (node, event) {
            if (event.target.className != "dynatree-expander") {
                if (node.data.key != LSR_OldRelationId && node.parent.data.structureLevel == "10") {
                    LSR_OldRelationId = node.data.key;
                    addLoStudyReferRow(node);
                }
            }
        },
        onDblClick: function (node, event) {
            node.toggleExpand();
        }
    });
}

function addLoStudyReferRow(node) {
    var studyReferId = LoStudyReferBox.data("_studyReferId");
    var b = addLoStudyRefer({ loId: node.data.key, studyReferenceId: studyReferId });
    if (!b) { return }

    var $dataTable = $("#dvSelLoStudyRefer .kpr_sel_item");
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

    var row = new Array();
    row.push("<tr id='' loId='" + node.data.key + "' " + rowClass + ">");
    row.push("<td>" + node.data.title + "</td>");
    row.push("<td align='center'><input type='text' style='width:25px;height:10px;font-size:10px' /></td>");
    row.push("<td align='center'><input type='checkbox' /></td>");
    row.push("<td align='center'>");
    row.push("<select>");

    row.push("<option value='-1'>认知层次</option>");
    row.push(String.format("<option value='{0}' >1.记忆</option>", 1));
    row.push(String.format("<option value='{0}' >2.理解</option>", 2));
    row.push(String.format("<option value='{0}' >3.应用</option>", 3));
    row.push(String.format("<option value='{0}' >4.分析</option>", 4));
    row.push(String.format("<option value='{0}' >5.评价</option>", 5));
    row.push(String.format("<option value='{0}' >6.创造</option>", 6));
    row.push("</select>");
    row.push("</td>");
    row.push("<td align='center'><img title='Delete' alt='' src='Images/application_delete.png' style='cursor:pointer;' onclick='deleteLoStudyReferRow(\"" + node.data.key + "\", this)' /></td>");
    row.push("</tr>");
    $dataTable.append(row.join(""));
    $dataTable.find("tr:last").hover(function () {
        $(this).addClass("hover");
    }, function () {
        $(this).removeClass("hover");
    });
}

function deleteLoStudyReferRow(loId, obj) {
    var delObj = deleteLoStudyRefer(loId);
    if (delObj) {
        $(obj).parent().parent().remove();
        var $dataTable = $("#dvSelLoStudyRefer .kpr_sel_item");
        var rowCount = $dataTable.find("tr:gt(0)").length;
        if (rowCount == 0) {
            $dataTable.append("<tr class='nodata lightblue'><td colspan='6'>无记录</td></tr>");
        }
    }
}

function getLoStudyRefer(loId) {
    var idx = LoStudyReferArray.indexOf("loId", loId);
    if (idx != -1) {
        return LoStudyReferArray[idx];
    } else {
        return null;
    }
}


function addLoStudyRefer(lsrObj) {
    var idx = LoStudyReferArray.indexOf("loId", lsrObj.loId);
    if (idx == -1) {
        LoStudyReferArray.push(lsrObj);
        return true;
    } else {
        return false;
    }
}

function deleteLoStudyRefer(loId) {
    var idx = LoStudyReferArray.indexOf("loId", loId);
    if (idx != -1) {
        return LoStudyReferArray.splice(idx, 1)[0];
    } else {
        return null;
    }
}

function submitLoStudyRefer(v, h, f) {
    if (v == true) {
        var probability = "";
        var probabilityValid = true;
        var loType = "";
        var loTypeChecked = "0";
        var lsrObj = null;
        var $dataTable = LoStudyReferBox.find("#dvSelLoStudyRefer .kpr_sel_item");

        if (!$dataTable.find("tr:eq(1)").hasClass("nodata")) {
            probabilityValid = checkProbability($dataTable);
            if (probabilityValid) {
                $dataTable.find("tr:gt(0)").each(function (i) {
                    probability = $(this).find("input[type='text']").val().trim();
                    loTypeChecked = $(this).find("input[type='checkbox']").is(":checked");
                    loType = (loTypeChecked) ? "1" : "0";

                    lsrObj = getLoStudyRefer($(this).attr("loId"));
                    lsrObj.cognitiveType = $(this).find("select").val();
                    lsrObj.probability = probability;
                    lsrObj.loType = loType;
                });
            }
        }

        if (probabilityValid) {
            var studyReferId = LoStudyReferBox.data("_studyReferId");
            $excuteWS("~CmsWS.updateLoStudyReference", { studyReferenceId: studyReferId, loStudyReferences: LoStudyReferArray, userExtend: simpleUser }, function (result) {
                if (result) {
                    $.jBox.tip("保存成功", 'success');
                } else {
                    $.jBox.tip('保存点失败.', 'error');
                }
            }, null, null);
        } else {
            $.jBox.tip("probability error.", 'warning');
            return false;
        }
    }
}

function checkProbability($dt) {
    var $probability = null;
    var probabilityValid = true;
    var probabilityVal = "";
    var probability = 0;
    var weight = 0;

    $dt.find("tr:gt(0)").each(function () {
        $probability = $(this).find("input[type='text']");
        probabilityVal = $probability.val().trim();
        if (probabilityVal == "") {
            probabilityValid = false;
            return false;
        }

        if (!isNaN(probabilityVal)) {
            probability = parseFloat(probabilityVal);
            if (probability > 0 && probability <= 1) {
                weight += probability;
            } else {
                probabilityValid = false;
                return false;
            }
        } else {
            probabilityValid = false;
            return false;
        }
    });

    if (probabilityValid && weight == 1) {
        return true;
    } else {
        return false;
    }
}