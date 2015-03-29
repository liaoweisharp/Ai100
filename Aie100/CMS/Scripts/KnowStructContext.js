/// <reference path="../../Scripts/jquery-1.4.1.min.js" />
/// <reference path="BookStructContext.js" />

/*
* 知识体系结构（虚拟书）
*/

var KnowKpsData = null;             //知识体系结构的数据维护对象
var $KnowStructTree = null;         //知识体系结构树
var KnowISBN = "";                  //知识体系结构的ISBN

function LoadKnowStructTree(isbn, tree) {
    ///<summary>加载参照结构树</summary>

    KnowISBN = isbn;
    $KnowStructTree = tree;

    $KnowStructTree.empty().html("<img src='../Images/ajax-loader_b.gif' style='margin-left:38%; margin-top:5%;' />");
    $excuteWS("~CmsWS.getBookStructureArray", { isbn: KnowISBN, isLazy: true }, bindKnowStructTree, null, null);
}

function bindKnowStructTree(bsData) {
    var bsTreeNodes = bsData[0];
    if (!bsTreeNodes) {
        return;
    }

    KnowKpsData = new KnowledgePointsData();

    $KnowStructTree.dynatree({
        clickFolderMode: 1,
        children: bsTreeNodes,
        onLazyRead: function (node) {
            var structureId = node.data.key;
            $excuteWS("~CmsWS.getLearningObjectiveWithStructureList", { structureId: structureId, isbn: KnowISBN, exCurriculumId: "", userExtend: SimpleUser }, onGetKnowStructKps, null, node);
        },
        onClick: function (node, event) {
            if (node.data.structureLevel == "10" || node.parent.data.structureLevel == "10") {
                if (event.target.nodeName == "IMG" || (event.shiftKey && !node.isSelected())) {
                    addReferKp(node);
                }
            }
        },
        onDblClick: function (node, event) {
            node.toggleExpand();
        },
        onCreate: function (node, span) {
            if (node.data.structureLevel == "10" || node.parent.data.structureLevel == "10") {
                $(span).parent().append("<img src='../Images/fafu.gif' title='添加引用(shift+单击)' class='sp_op_add' style='margin-left:10px;cursor:pointer; display:none' />");
            }
        }
    });

    if (window.isReloadTree) {
        $KnowStructTree.dynatree("getTree").reload();
    } else {
        window.isReloadTree = true;
    }

}

function onGetKnowStructKps(result, node) {
    if (result != null && result.length > 0) {
        KnowKpsData.AppendStructure(node.data.key, result);
        var kpNodes = new Array();
        var kpNode = null;
        $.each(result, function () {
            kpNode = {};
            kpNode.title = this.unit + ". " + this.name;
            kpNode.key = this.id;
            kpNodes.push(kpNode);
        });
        node.addChild(kpNodes);
        setReferFlg(node);
    } else {
        KnowKpsData.AppendStructure(node.data.key, []);
        node.data.isFolder = false;
        node.render();
    }
    node.setLazyNodeStatus(DTNodeStatus_Ok);
}

function setReferFlg(node) {
    ///<summary>设置引用标记</summary>

    var referCount = 0;
    $.each(node.getChildren(), function () {
        if (KpInBook(this.data.key)) {
            this.select(true);
            referCount++;
        } else {
            $(this.span).parent().find("img.sp_op_add").show();
        }
    });
    
    var cmp = node.countChildren() - referCount;
    if (cmp == 0) {
        node.select(true);
    } else if (cmp > 1) {
        //$(node.span).parent().find("img.sp_op_add").show();
        $(node.span).next().show();
    }

    node.data.childSelectCount = referCount;
}

function addReferKp(node) {
    ///<summary>添加引用知识点到自定义书中</summary>
    var referKps = [];
    var kp = null;
    if (node.data.structureLevel == "10") {
        $.each(node.getChildren(), function () {
            if (!this.isSelected()) {
                kp = KnowKpsData.Get(node.data.key, this.data.key);
                if (kp) {
                    referKps.push(kp);
                }
            }
        });
    } else {
        kp = KnowKpsData.Get(node.parent.data.key, node.data.key);
        if (kp) {
            referKps.push(kp);
        }
    }

    if (referKps.length > 0) {
        AddKnowledgePoints(referKps, function () {
            //选中当前节点
            node.select(true);
            $(node.span).parent().find("img.sp_op_add").hide();

            if (node.countChildren() > 0) {
                //当前为kp的父节点，选中子节点
                $.each(node.getChildren(), function () {
                    if (!this.isSelected()) {
                        this.select(true);
                        $(this.span).parent().find("img.sp_op_add").hide();
                    }
                });
            } else {
                //当前为kp节点，若kp被全选则选中父节点
                node.parent.data.childSelectCount++;
                if (node.parent.data.childSelectCount == node.parent.countChildren()) {
                    node.parent.select(true);
                    $(node.parent.span).parent().find("img.sp_op_add").hide();
                }
            }

        });
    }
}