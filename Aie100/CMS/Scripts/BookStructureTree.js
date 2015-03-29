/// <reference path="../../Scripts/jquery-1.4.1.min.js" />
/// <reference path="BookStructureInfo.js" />
/// <reference path="KnowledgePointsInfo.js" />


/*
* 构造Book Structure树，定义树的添加、删除和编辑方法
*/

var $BookStructureTree = null;          //BookStructureTree jquery 对象
window.isReloadTree = false;            //是否需要重新加载树（当树内容改变时设置为true）
window.expandAndActiveKey = "";         //记录延迟加载节点的新建的子节点，以便在首次延迟加载完成后激活它
var OldStructureId = "";

function BuildBookStructureTree(bsData) {
    ///<summary>构造BookStructure树</summary>

    var bsTreeNodes = bsData[0];
    var bsObjArr = bsData[1];
    
    if (bsTreeNodes) {
        BookStructureDataSvr = new BookStructureData(bsObjArr);
        KnowledgePointsDataSvr = new KnowledgePointsData();
    } else {
        return;
    }

    $BookStructureTree = $("#bookStructureTree").dynatree({
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
            // Close menu on click
            if ($(".contextMenu:visible").length > 0) {
                $(".contextMenu").hide();
                // return false;
            }

            //if (event.target.className != "dynatree-expander") {
            //    if (node.data.key != OldStructureId) {
            //        OldStructureId = node.data.key;
            //        _onTreeNodeClick(node);
            //    }
            //}
        },
        onDblClick: function (node, event) {
            node.toggleExpand();
        },
        onCreate: function (node, span) {
            bindContextMenu(node, span);
        },
        dnd: {
            onDragStart: function (node) {
                return true;
            },
            autoExpandMS: 1000,
            preventVoidMoves: true,
            onDragEnter: function (node, sourceNode) {
                return true;
            },
            onDragOver: function (node, sourceNode, hitMode) {
                //可移动节点，但不能改变节点的层次
                var level = node.getLevel() - sourceNode.getLevel();
                if (level == 0 && hitMode != "over") {
                    return true;
                } else if (level == -1 && hitMode == "over") {
                    if (node.isLazy() && !node.isExpanded()) {  //延迟加载的节点必须为展开状态才能drop
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            },
            onDrop: function (node, sourceNode, hitMode, ui, draggable) {
                var bs = null;
                var kp = null;
                var level = node.getLevel() - sourceNode.getLevel();
                if (level == 0 && hitMode != "over") {
                    //同层移动更新父节点
                    if (node.parent.data.key != sourceNode.parent.data.key) {   //更新父节点信息
                        if (sourceNode.parent.data.structureLevel == "10") {
                            KnowledgePointsDataSvr.Move(sourceNode.parent.data.key,
                                node.parent.data.key, sourceNode.data.key);
                        } else {
                            BookStructureDataSvr.UpdateParent(sourceNode.data.key, node.parent.data.key);
                        }
                    } else {    //设置数据修改标志
                        if (sourceNode.parent.data.structureLevel == "10") {
                            KnowledgePointsDataSvr.SetDirty(sourceNode.parent.data.key);
                        } else {
                            BookStructureDataSvr.SetDirty();
                        }
                    }
                } else if (level == -1 && hitMode == "over") {
                    //跨层移动更新父节点
                    if (node.data.key != sourceNode.parent.data.key) {  //更新父节点信息
                        if (sourceNode.parent.data.structureLevel == "10") {
                            KnowledgePointsDataSvr.Move(sourceNode.parent.data.key,
                                node.data.key, sourceNode.data.key);
                        } else {
                            BookStructureDataSvr.UpdateParent(sourceNode.data.key, node.data.key);
                        }
                    } else {    //设置数据修改标志
                        if (sourceNode.parent.data.structureLevel == "10") {
                            KnowledgePointsDataSvr.SetDirty(sourceNode.parent.data.key);
                        } else {
                            BookStructureDataSvr.SetDirty();
                        }
                    }
                }

                var oldSourceParent = sourceNode.parent;

                sourceNode.move(node, hitMode);         //移动节点

                //如果源节点的父节点不包含子节点，改变其节点类型为普通节点
                if (!oldSourceParent.hasChildren()) {
                    oldSourceParent.data.isFolder = false;
                    oldSourceParent.render();
                }

                //如果目的节点添加了第一个子节点，改变其节点类型为Folder节点
                if (!node.data.isFolder && node.hasChildren()) {
                    node.data.isFolder = true;
                    node.render();
                }

            }
        }
    });

    if (window.isReloadTree) {
        $BookStructureTree.dynatree("getTree").reload();
    } else {
        window.isReloadTree = true;
    }

    $("#tbContentbox").colResizable({
        liveDrag: true,
        minWidth: 100
    });

    var rootNode = $BookStructureTree.dynatree("getRoot").getChildren()[0];
    if (rootNode.isLazy()) {
        rootNode.reloadChildren();
        rootNode.expand(true);
    }
}

/**
 * Implement inline editing for a dynatree node
 */
function editNode(node) {
    var prevTitle = node.data.title.replace(node.data.unit + " ", "");
      tree = node.tree;
    // Disable dynatree mouse- and key handling
    tree.$widget.unbind();
    // Replace node with <input>
    $(".dynatree-title", node.span).html("<input id='editNode' value='" + prevTitle + "'>");
    // Focus <input> and bind keyboard handler
    $("input#editNode")
      .focus(function (event) {
          this.select();
      })
      .keydown(function (event) {
          switch (event.which) {
              case 27: // [esc]
                  // discard changes on [esc]
                  $("input#editNode").val(prevTitle);
                  $(this).blur();
                  break;
              case 13: // [enter]
                  // simulate blur to accept new value
                  $(this).blur();
                  break;
          }
      })
      .blur(function (event) {
          // Accept new value, when user leaves <input>
          var title = $("input#editNode").val();
          node.setTitle(node.data.unit + " " + title);
          // Re-enable mouse and keyboard handlling
          tree.$widget.bind();
          node.focus();
          
          //保存名字被改变的节点
          if (node.data.isNew) {
              saveNodeInfo(node);
          } else {
              var oldName = "";
              if (node.data.structureLevel) {
                  oldName = BookStructureDataSvr.Get(node.data.key).title;
              } else {
                  oldName = KnowledgePointsDataSvr.Get(node.parent.data.key, node.data.key).name;
              }

              var newName = node.data.title.replace(node.data.unit + " ", "");
              if (newName != oldName) {
                  saveNodeInfo(node);
              }
          }
      }).focus();
}

function onGetKnowledgePoints(result, node) {
    if (result != null && result.length > 0) {
        KnowledgePointsDataSvr.AppendStructure(node.data.key, result);
        var kpNodes = new Array();
        var kpNode = null;
        $.each(result, function () {
            kpNode = {};
            kpNode.title = this.unit + " " + this.name;
            kpNode.key = this.id;
            kpNode.unit = this.unit;
            kpNode.tooltip = "知识点";
            kpNodes.push(kpNode);
        });
        node.addChild(kpNodes);
    } else {
        KnowledgePointsDataSvr.AppendStructure(node.data.key, []);
        node.data.isFolder = false;
        node.render();
    }
    node.setLazyNodeStatus(DTNodeStatus_Ok);

    //如果为新建子节点后首次展开延迟加载的节点，则激活新节点
    if (window.expandAndActiveKey) {
        $BookStructureTree.dynatree("getTree").activateKey(window.expandAndActiveKey);
        window.expandAndActiveKey = "";
    }
}

function bindContextMenu(node, span) {
    ///<summary>Contextmenu helper</summary>

    var bindMenu = "";
    if (node.data.bookId) {
        bindMenu = "bookMenu";
    } else if (typeof node.data.structureLevel == "undefined") {
        bindMenu = "knowledgePointMenu";
    } else {
        bindMenu = "structureMenu";
    }

    // Add context menu to this node:
    $(span).contextMenu({ menu: bindMenu }, function (action, el, pos) {
        // The event was bound to the <span> tag, but the node object
        // is stored in the parent <li> tag
        var node = $.ui.dynatree.getNode(el);
        node.activate();
        switch (action) {
            case "addSubStructure":
                if (node.data.structureLevel == "10") {
                    if (node.isLazy() && !node.isExpanded() && (typeof node.hasChildren() == "undefined")) {
                        $.jBox.tip('请先展开节点！', 'warning');
                    } else {
                        addKnowledgePointNode(node);
                    }
                } else {
                    addStructureNode(node);
                }
                break;
            case "editStructure":
                editStructureNode(node);
                break;
            case "deleteStructure":
                delStructureNode(node);
                break;
            case "editKp":
                editKnowledgePointNode(node);
                break;
            case "deleteKp":
                delKnowledgePointNode(node);
                break;
            case "addSiblingNode":
                addSiblingNode(node);
                break;
            default:
                alert("Todo: appply action '" + action + "' to node " + node);
        }

    }, function (menu, el) {
        var node = $.ui.dynatree.getNode(el);

        //设置书和章节菜单的名称（不包括知识点菜单）
        if (typeof node.data.structureLevel != "undefined") {   
            setMenuItemsName(menu, node);
        }

        //设置删除菜单是否可见
        var isVisible = false;
        if (node.isLazy()) {
            if (node.isExpanded() && !node.hasChildren()) {
                isVisible = true;
            } 
        } else {
            if (!node.hasChildren()) {
                isVisible = true;
            }
        }
        if (isVisible) {
            menu.find("li.delete").show();
        } else {
            menu.find("li.delete").hide();
        }
    });
}

//设置书和章节菜单的名称
function setMenuItemsName(menu, node) {
    var currTypeName = getCurrStructTypeName(node.data.structureLevel);
    var childTypeName = getChildStructTypeName(node.data.structureLevel);
    
    if (node.data.bookId) {     //书
        menu.find("a span").html(childTypeName);  //添加子节点
    } else {    //书结构
        menu.find("a span:eq(0)").html(currTypeName);   //添加同级节点
        menu.find("a span:eq(1)").html(childTypeName);  //添加子节点
        menu.find("a span:eq(2)").html(currTypeName);   //编辑节点
        menu.find("a span:eq(3)").html(currTypeName);   //删除节点
    }

}

function addStructureNode(node) {
    ///<summary>添加BookStructure节点</summary>

    //var rootNode = $BookStructureTree.dynatree("getRoot");
    //var bookId = rootNode.getChildren()[0].data.key;
    //var structureLevel = node.data.structureLevel;
    //var sequence = node.getChildren() ? node.getChildren().length + 1 : 1;

    //var parentId = node.data.key;
    //if (structureLevel == "0") {
    //    parentId = "";
    //}
    //AddBookStructure(bookId, parentId, structureLevel, sequence, function (bs) {
    //    if (!node.isExpanded()) {
    //        node.expand(true);
    //    }
    //    var newNode = node.addChild({
    //        title: bs.unit + " " + bs.title,
    //        key: bs.contentId,
    //        tooltip: bs.structureTypeName,
    //        structureLevel: bs.structureTypeLevel
    //    });
    //    if (!node.data.isFolder && node.hasChildren()) {
    //        node.data.isFolder = true;
    //        node.render();
    //    }
    //    newNode.activate();

    //    //显示描述
    //    $("#SR_divKnowledgeDetails").html(formatDiscription(bs.description)).show();
    //});
    

    
    var sequence = node.getChildren() ? node.getChildren().length + 1 : 1;
    var unit = (node.data.unit) ? node.data.unit + "." + sequence : sequence;
    var structureTypeLevel = "";
    var structureTypeName = "";
    var structureTypeId = "";
    var structureType = getChildStructureType(node.data.structureLevel);
    if (structureType) {
        structureTypeLevel = structureType.structureLevel;
        structureTypeName = structureType.structureType;
        structureTypeId = structureType.id;
    }

    var newNode = node.addChild({
        //title: unit + " 新节点",
        title: unit + " *新的" + structureTypeName,
        tooltip: structureTypeName,
        structureLevel: structureTypeLevel,
        structureTypeId: structureTypeId,
        sequence: sequence,
        unit: unit,
        isNew: true
    });
    if (!node.data.isFolder && node.hasChildren()) {
        node.data.isFolder = true;
        node.render();
    }
    if (!node.isExpanded()) {
        node.expand(true);
    }
    editNode(newNode);
}

function editStructureNode(node) {
    ///<summary>编辑BookStructure节点</summary>

    //var sid = node.data.key;
    //var structureLevel = node.data.structureLevel;

    //EditBookStructure(sid, structureLevel, function (bs) {
    //    if (bs.title != node.data.title) {
    //        node.setTitle(bs.unit + " " + bs.title);
    //    }

    //    //显示描述
    //    $("#SR_divKnowledgeDetails").html(formatDiscription(bs.description)).show();
    //});

    editNode(node);
}

//<summary>编辑BookStructure节点</summary>
function delStructureNode(node) {
    var typeName = getCurrStructTypeName(node.data.structureLevel);
    DelBookStructure(node.data.key, typeName, ISBN, function (bs) {
        var parentNode = node.parent;
        node.remove();
        if (!parentNode.hasChildren()) {
            parentNode.data.isFolder = false;
            parentNode.render();
        }
    });
}

function addKnowledgePointNode(node) {
    ///<summary>添加知识点节点</summary>

    //var sequence = -1;
    
    //if (node.isLazy() == false) {
    //    sequence = node.countChildren();
    //} else {
    //    if (node.isExpanded()) {
    //        sequence = node.countChildren()
    //    } else {
    //        if (node.hasChildren()) {
    //            sequence = node.countChildren()
    //        }
    //    }
    //}
    
    //if (sequence != -1) {
    //    sequence++;
    //}

    //AddKnowledgePoint(node.data.key, sequence, function (kp) {
    //    if (node.data.isFolder && !node.isExpanded()) {
    //        node.expand(true);
    //        window.expandAndActiveKey = kp.id;  //记录下新建的子节点，以便在首次延迟加载完成后激活它
    //    } else {
    //        var newNode = node.addChild({
    //            title: kp.unit + " " + kp.name,
    //            key: kp.id
    //        });
    //        if (!node.data.isFolder && node.hasChildren()) {
    //            node.data.isFolder = true;
    //            node.render();
    //        }
    //        newNode.activate();
    //    }
    //    showKnowledgeDetails(kp.id);
    //});



    var sequence = -1;
    if (node.isLazy() == false) {
        sequence = node.countChildren();
    } else {
        if (node.isExpanded()) {
            sequence = node.countChildren()
        } else {
            if (node.hasChildren()) {
                sequence = node.countChildren()
            }
        }
    }
    if (sequence != -1) {
        sequence++;
    }
    var unit = (node.data.unit) ? node.data.unit + "." + sequence : sequence;
 
    var newNode = node.addChild({
        title: unit + " *新知识点",
        tooltip: "知识点",
        sequence: sequence,
        unit: unit,
        isNew: true
    });
    if (!node.data.isFolder && node.hasChildren()) {
        node.data.isFolder = true;
        node.render();
    }
    if (!node.isExpanded()) {
        node.expand(true);
    }
    editNode(newNode);
}

function editKnowledgePointNode(node) {
    ///<summary>编辑知识点节点</summary>

    //EditKnowledgePoint(node.parent.data.key, node.data.key, function (kp) {
    //    if (node.data.title != kp.name) {
    //        node.setTitle(kp.unit + " " + kp.name);
    //    }
    //    showKnowledgeDetails(kp.id);
    //});

    editNode(node);
}

function delKnowledgePointNode(node) {
    ///<summary>删除知识点节点</summary>

    DelKnowledgePoint(node.parent.data.key, node.data.key, function (kp) {
        var parentNode = node.parent;
        node.remove();
        if (!parentNode.hasChildren()) {
            parentNode.data.isFolder = false;
            parentNode.render();
        }
        $("#SR_divKnowledgeDetails").hide();
    });
}

//添加同级节点
function addSiblingNode(node) {
    var parentNode = node.parent;
    var sequence = parentNode.getChildren().length + 1;
    var unit = (parentNode.data.unit) ? parentNode.data.unit + "." + sequence : sequence;

    if (node.data.structureLevel) { //book structure
        var structureTypeLevel = "";
        var structureTypeName = "";
        var structureTypeId = "";
        var structureType = getCurrStructureType(node.data.structureLevel);
        if (structureType) {
            structureTypeLevel = structureType.structureLevel;
            structureTypeName = structureType.structureType;
            structureTypeId = structureType.id;
        }
        var newNode = node.parent.addChild({
            //title: unit + " 新节点",
            title: unit + " *新的" + structureTypeName,
            tooltip: structureTypeName,
            structureLevel: structureTypeLevel,
            structureTypeId: structureTypeId,
            sequence: sequence,
            unit: unit,
            isNew: true
        });
    } else {    //lo
        var newNode = node.parent.addChild({
            //title: unit + " 新节点",
            title: unit + " *新知识点",
            tooltip: "知识点",
            sequence: sequence,
            unit: unit,
            isNew: true
        });
    }
    editNode(newNode);   
}

function mergeKnowledgePointNode(node) {
    MergeKnowledgePoint(node);
}

function viewQuestions(node) {
    //alert(node.data.key);
    //    location.href = "../CMS/QuestionManage.aspx?loid=" + node.data.key + "&isbn=" + ISBN;
    var p = "";
    for (var k in _UserParam) {
        p += k + "=" + _UserParam[k] + "&";
    }
    if (p) {
        p = "?" + p.substr(0, p.length - 1);
    }

    window.open("../CMS/QuestionManage.aspx" + p + "&loid=" + node.data.key);
}

function _onTreeNodeClick(node) {
    if (node.parent.data.structureLevel == "10") {
        showKnowledgeDetails(node.data.key);
    } else {
        //$("#SR_divKnowledgeDetails").hide();
        showBookStructureDetails(node.data.key);
    }
}

function showKnowledgeDetails(kpId) {
    $("#SR_divKnowledgeDetails").show();
    var $dvRightContent = $("#dvRightContent").showLoading();
    window.simpleUser = SimpleUser;
    new ShowDetails({ data: { itemId: kpId }, container: "SR_divKnowledgeDetails", show_type: "0", type: "0" }).show(function () {
        $dvRightContent.hideLoading();
    });
}

function showBookStructureDetails(id) {
    var description = "";
    var bsObj = BookStructureDataSvr.Get(id);
    if (bsObj) {
        description = bsObj.description;
    } 
    var $SR_divKnowledgeDetails = $("#SR_divKnowledgeDetails").html(formatDiscription(description)).show();
    if (description && description != "&nbsp;" && description != "<br>") {
        $SR_divKnowledgeDetails.show();
    } else {
        $SR_divKnowledgeDetails.hide();
    }
}

function _editHistory(node) {
    ViewKpsEditHistory();
}

function _editHistoryItem(node) {
    _viewKpEditHistory(node.data.key, node.data.title);
}

function _auditSuggestion(node) {
    var obj = new ContentAudit({
        bookId: $("#selBookList").find("option:selected").attr("id"),
        contentId: node.data.key,
        contentType: "2",
        simpleUser: SimpleUser
    });
    obj.Show();
}

function formatDiscription(s) {
    var arr = [];
    arr.push("<table width='100%' cellspacing='0' cellpadding='0' border='0'>");
    arr.push("<tr><td style='background: url(../Images/RoundCorner/roudcornlb_tl.gif) no-repeat; width: 5px; height: 6px; padding: 0px;'></td>");
    arr.push("    <td style='background: url(../Images/RoundCorner/roudcornlb_tm.gif) repeat-x; height: 6px; padding: 0px;'></td>");
    arr.push("    <td style='background: url(../Images/RoundCorner/roudcornlb_tr.gif) repeat-x; width: 6px; height: 6px; padding: 0px;'></td></tr>");
    arr.push("<tr><td style='background: url(../Images/RoundCorner/roudcornlb_ml.gif) repeat-y; width: 20px; padding: 0px;'></td>");
    arr.push("    <td style='background-color: #fff; padding: 8px 8px 0px 0px; font-size: 12px;'>" + s + "</td>");
    arr.push("    <td style='background: url(../Images/RoundCorner/roudcornlb_mr.gif) repeat-y; width: 6px;'></td></tr>");
    arr.push("<tr><td style='background: url(../Images/RoundCorner/roudcornlb_bl.gif) repeat-x; width: 20px; height: 21px;'></td>");
    arr.push("    <td style='background: url(../Images/RoundCorner/roudcornlb_bm.gif) repeat-x; height: 21px;'></td>");
    arr.push("    <td style='background: url(../Images/RoundCorner/roudcornlb_br.gif) repeat-x; width: 6px; height: 21px;'></td></tr></table>");
    return arr.join("");
}

function saveNodeInfo(node) {
    //var bookNode = node.tree.getRoot().getChildren()[0];
    var bookId = $("#selBookList").find("option:selected").attr("id");
    var bookTitle = $("#selBookList").find("option:selected").text();
    
    var $dvRightContent = $("#dvRightContent").showLoading();
    if (node.data.structureLevel) { //book structure
        var bs = {};
        if (node.data.isNew) {
            var bookId = bookId;
            var parentId = node.parent.data.key;
            
            bs.bookId = bookId;
            bs.parentId = parentId;
            bs.title = node.data.title.replace(node.data.unit + " ", "");
            bs.structureTypeId = node.data.structureTypeId;
            bs.structureTypeName = node.data.tooltip;
            bs.structureTypeLevel = node.data.structureLevel;
            bs.structureOrder = node.data.sequence;
            bs.structureOrderName = node.data.sequence;
        } else {
            bs = BookStructureDataSvr.Get(node.data.key);
            bs.title = node.data.title.replace(node.data.unit + " ", "");
        }
        
        saveBookContentStructures(bs, function (tarBs) {
            if (node.data.isNew) {
                node.data.isNew = false;
                node.data.key = tarBs.contentId;
            }
            $dvRightContent.hideLoading();
        });
    } else {  //knowledge point
        if (node.parent.data.isNew) {
            $.jBox.tip('正在保存父节点数据，请稍后再保存！', 'warning');
            return;
        }
        var kp = {};
        if (node.data.isNew) {
            kp.name = node.data.title.replace(node.data.unit + " ", "");
            kp.category = "0";
            kp.sequence = node.data.sequence;
            kp.sequenceName = node.data.sequence;
            kp.structureId = node.parent.data.key;
            kp.bookId = bookId;
            kp.bookTitle = bookTitle;
        } else {
            kp = KnowledgePointsDataSvr.Get(node.parent.data.key, node.data.key);
            kp.name = node.data.title.replace(node.data.unit + " ", "");
        }

        manageLearningObjectiveCms(node.parent.data.key, kp, function (tarKp) {
            if (node.data.isNew) {
                node.data.isNew = false;
                node.data.key = tarKp.id;
            }
            $dvRightContent.hideLoading();
        });
    }
}