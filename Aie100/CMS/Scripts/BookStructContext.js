/// <reference path="../../Scripts/jquery-1.4.1.min.js" />
/// <reference path="BookStructureData.js" />
/// <reference path="KnowledgePointsData.js" />

/*
* 自定义书的结构
*/

window.expandAndActiveKey = "";         //记录延迟加载节点的新建的子节点，以便在首次延迟加载完成后激活它
var BookStructureDataSvr = null;        //书结构的数据维护对象
var KnowledgePointsDataSvr = null;      //知识点的数据维护对象
var $BookStructureTree = null;          //书结构树
var BookKnowledgePoints = [];           //书中的所有知识点
var ISBN = "";                          //自定义书的ISBN
var _BookStructureTypeArray = [];        //书结构的结构类型

function InitBookStructContext() {
    ///<summary>初始化书结构数据</summary>

    InitBsBox();
    InitKnowledgePointBox();
}

function LoadBookStructTree(isbn, tree) {
    ///<summary>加载书结构</summary>

    ISBN = isbn;
    $BookStructureTree = tree;

    $BookStructureTree.empty().html("<img src='../Images/ajax-loader_b.gif' style='margin-left: 25px; margin-top: 25px' />");
    SimpleUser.isbn = ISBN;

    $excuteWS("~CmsWS.getLearningObjectiveWithBookList", { isbn: ISBN, userExtend: SimpleUser }, function (result) {
        if (result) {
            BookKnowledgePoints = result;
        }
        //返回书结构类型
        $excuteWS("~CmsWS.getBookStructureTypeList", { isbn: ISBN }, function (result) {
            if (result && result.length > 0) {
                _BookStructureTypeArray = result;
                //返回书结构
                $excuteWS("~CmsWS.getBookStructureArray", { isbn: ISBN, isLazy: true }, bindBookStructTree, null, null);
            }
        }, null, null);


    }, null, null);
}

function bindBookStructTree(bsData) {
    var bsTreeNodes = bsData[0];
    var bsObjArr = bsData[1];

    if (bsTreeNodes) {
        BookStructureDataSvr = new BookStructureData(bsObjArr);
        KnowledgePointsDataSvr = new KnowledgePointsData();
    } else {
        return;
    }

    $BookStructureTree.dynatree({
        clickFolderMode: 1,
        children: bsTreeNodes,
        onLazyRead: function (node) {
            var structureId = node.data.key;
            $excuteWS("~CmsWS.getLearningObjectiveWithStructureList", { structureId: structureId, isbn: ISBN, exCurriculumId: "", userExtend: SimpleUser }, onGetKnowledgePoints, null, node);
        },
        onClick: function (node, event) {
            // Close menu on click
            if ($(".contextMenu:visible").length > 0) {
                $(".contextMenu").hide();
                // return false;
            }
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
                addStructureNode(node);
                break;
            case "addSiblingNode":
                addSiblingNode(node);
                break;
            case "editStructure":
                editStructureNode(node);
                break;
            case "deleteStructure":
                delStructureNode(node);
                break;
            case "deleteKp":
                delKnowledgePointNode(node);
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

        //隐藏添加知识点菜单
        if (node.data.structureLevel == "10") {
            menu.find("li.addsub").hide();
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

function addStructureNode(node) {
    ///<summary>添加BookStructure节点</summary>

    //var rootNode = $BookStructureTree.dynatree("getRoot");
    //var bookId = rootNode.getChildren()[0].data.key;
    //var structureLevel = node.data.structureLevel;
    //var order = node.getChildren() ? node.getChildren().length + 1 : 1;

    //var parentId = node.data.key;
    //if (structureLevel == "0") {
    //    parentId = "";
    //}
    //AddBookStructure(bookId, parentId, structureLevel, order, function (bs) {
    //    if (!node.isExpanded()) {
    //        node.expand(true);
    //    }
    //    var newNode = node.addChild({
    //        title: bs.unit + ". " + bs.title,
    //        key: bs.contentId,
    //        tooltip: bs.structureTypeName,
    //        structureLevel: bs.structureTypeLevel
    //    });
    //    if (!node.data.isFolder && node.hasChildren()) {
    //        node.data.isFolder = true;
    //        node.render();
    //    }
    //    newNode.activate();
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
    //        node.setTitle(bs.unit + ". " + bs.title);
    //    }
    //});
    editNode(node);
}

function delStructureNode(node) {
    //<summary>删除BookStructure节点</summary>

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


function editKnowledgePointNode(node) {
    ///<summary>编辑知识点节点</summary>

    EditKnowledgePoint(node.parent.data.key, node.data.key, function (kp) {
        if (node.data.title != kp.name) {
            node.setTitle(kp.unit + ". " + kp.name);
            if (node.data.isNew) {
                node.data.key = kp.id;
                node.data.isNew = false;
            }
        }
    });
}

function delKnowledgePointNode(node) {
    ///<summary>删除知识点节点</summary>

    if (node.data.isNew) {
        _delNode(node);
    } else {
        DelKnowledgePoint(node.parent.data.key, node.data.key, function (succeed) {
            if (succeed) {
                _delNode(node);
            }
        });
    }
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

function _delNode(node) {
    _delKp(node.data.key);
    var delKp = KnowledgePointsDataSvr.Del(node.parent.data.key, node.data.key);
    if (!delKp) {
        return;
    }

    var parentNode = node.parent;
    node.remove();
    if (!parentNode.hasChildren()) {
        parentNode.data.isFolder = false;
        parentNode.render();
    }

    //if ($("#selStructures").val() != -1) {
    //    var source = $("#dvKnowStructTree").dynatree("getTree").getNodeByKey(delKp.pointingId);
    //    if (source) {
    //        source.select(false);
    //        $(source.span).parent().find("img.sp_op_add").show();
    //    }
    //}

    var source = $("#dvKnowStructTree").dynatree("getTree").getNodeByKey(delKp.pointingId);
    if (source) {
        source.select(false);
        $(source.span).parent().find("img.sp_op_add").show();
    }
    
}

function setKpNodeRelation(node) {
    ///<summary>设置知识点节点的关系</summary>

    SetKnowledgePointRelation(node.parent.data.key, node.data.key);
}

function KpInBook(kpId) {
    ///<summary>判断知识点是否存在书中</summary>

    var idx = BookKnowledgePoints.indexOf("pointingId", kpId);
    if (idx != -1) {
        return true;
    } else {
        return false;
    }
}

function _delKp(kpId) {
    var idx = BookKnowledgePoints.indexOf("id", kpId);
    if (idx != -1) {
        BookKnowledgePoints.splice(idx, 1);
    } 
}

function AddKnowledgePoints(kps, fn) {
    ///<summary>添加知识点</summary>

    var activeNode = $BookStructureTree.dynatree("getActiveNode");
    var targetNode = null;
    if (activeNode) {
        if (activeNode.data.structureLevel == "10") {
            targetNode = activeNode;
        } else if (activeNode.parent.data.structureLevel == "10") {
            targetNode = activeNode.parent;
        }
    }

    if (!targetNode || (targetNode.data.isFolder && !targetNode.isExpanded())) {
        $.jBox.tip("请展开自定义书中需要添加引用的节点！", 'warning');
        return;
    }

    var $selBookItem = $("#selBookList option:selected");
    $.each(kps, function () {
        this.bookId = $selBookItem.attr("id");
        this.bookTitle = $selBookItem.text();
        this.structureId = targetNode.data.key;
        this.structureTitle = targetNode.data.title;
        KnowledgePointsDataSvr.Add(targetNode.data.key, this);
        targetNode.addChild({
            title: this.unit + ". " + this.name,
            key: this.id,
            isNew: true    //表示新添加的节点
        });
    });

    if (!targetNode.data.isFolder && targetNode.hasChildren()) {
        targetNode.data.isFolder = true;
        targetNode.render();
        targetNode.expand(true);
    }

    if (fn) {
        fn();
    }
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


//返回当前结构类型名称
function getCurrStructTypeName(structureLevel) {
    var currTypeName = "";
    var oStructureType = getCurrStructureType(structureLevel);
    if (oStructureType) {
        currTypeName = oStructureType.structureType;
    }
    return currTypeName;
}

//返回子结构类型名称
function getChildStructTypeName(structureLevel) {
    var childTypeName = "";
    if (structureLevel == "10") {
        childTypeName = "知识点";
    } else {
        var oStructureType = getChildStructureType(structureLevel);
        if (oStructureType) {
            childTypeName = oStructureType.structureType;
        }
    }
    return childTypeName;
}

//返回当前结构类型对象
function getCurrStructureType(structureLevel) {
    var i = _BookStructureTypeArray.indexOf("structureLevel", structureLevel);
    if (i != -1) {
        return _BookStructureTypeArray[i];
    }
    return null;
}

//返回子结构类型对象
function getChildStructureType(structureLevel) {
    var len = _BookStructureTypeArray.length;
    var i = _BookStructureTypeArray.indexOf("structureLevel", structureLevel);
    if (i != -1 && i < len - 1) {
        return _BookStructureTypeArray[i + 1];
    }
    return null;
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


function saveNodeInfo(node) {
    var bookId = $("#selBookList").find("option:selected").attr("id");
    var bookTitle = $("#selBookList").find("option:selected").text();

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
            //$dvRightContent.hideLoading();
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

//保存书结构
function saveBookContentStructures(bsWrapper, callback) {
    $excuteWS("~CmsWS.editAndSaveBookContentStructures", { bookContentStructureWs: [bsWrapper], isbn: ISBN, userExtend: SimpleUser }, function (result) {
        if (result != null) {
            var bs = result[0];
            if (!bsWrapper.contentId) {    //新增结构需要加入本地缓存中
                BookStructureDataSvr.Append(bs);
                if (bs.structureTypeLevel == "10") {
                    KnowledgePointsDataSvr.AppendStructure(bs.contentId, []);
                }
            }
            callback(bs);
        }
    }, null, null);
}

//删除BookStructure对象
function DelBookStructure(sid, sTypeName, isbn, callback) {
    $.jBox.confirm("你确定要删除这一" + sTypeName + "吗?", "提示", function (v, h, f) {
        if (v == true) {
            $.jBox.tip("正在删除，请稍后...", 'loading');
            var bs = BookStructureDataSvr.Get(sid);
            if (bs) {
                $excuteWS("~CmsWS.deleteBookContentStructure", { bookContentStructure: bs, isbn: isbn, userExtend: SimpleUser }, function (result) {
                    if (result) {
                        $.jBox.closeTip();
                        if (BookStructureDataSvr.Del(sid)) {
                            callback(result);
                        }
                    } else {
                        $.jBox.tip('删除书结构数据失败!', 'error');
                    }
                }, null, null);
            }
        }
    }, { top: "25%", buttons: { '确定': true, '取消': false } });
}