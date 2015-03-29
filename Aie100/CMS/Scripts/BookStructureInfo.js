/// <reference path="../../Scripts/jquery-1.4.1.min.js" />
/// <reference path="BookStructureData.js" />

/*
* BookStructure信息维护
*/

var $divBsInfo = null;                  //BookStructure编辑界面
var $divDisableOthers = null;           //遮罩层
var BookStructureDataSvr = null;        //BookStructure数据维护对象
var _BookStructureTypeArray = [];        //书结构的结构类型

function GetBookStructureContext(isbn, callback) {
    ///<summary>获取BookStructure对象数据</summary>

    $("#bookStructureTree").empty().html("<img src='../Images/ajax-loader_b.gif' style='margin-left:38%; margin-top:5%;' />");
    //返回书结构类型
    $excuteWS("~CmsWS.getBookStructureTypeList", { isbn: isbn }, function (result) {
        if (result && result.length > 0) {
            _BookStructureTypeArray = result;
            //返回书结构
            $excuteWS("~CmsWS.getBookStructureArray", { isbn: isbn, isLazy: true }, callback, null, null);
        }
    }, null, null);
}

function InitBsBox() {
    ///<summary>初始化BookStructure编辑界面</summary>

    if (!$divBsInfo) {
        $divBsInfo = $("#divBsInfo");
    }
    if (!$divDisableOthers) {
        $divDisableOthers = $("#divDisableOthers");
    }
    $divBsInfo.find("#divBsDaoXiang ul").bind("click", onBsSelectTab);
    divEmathEditorContainerId = "divLoEmathEditor";
    $divBsInfo.draggable({ handle: $divBsInfo.find("#divBsHeader") });
}

function onBsSelectTab() {
    if (!$(this).hasClass("c_ore")) {
        var $siblingTabs = $(this).siblings();
        $siblingTabs.removeClass().addClass("daoxiang_link c_blue");
        $(this).removeClass().addClass("daoxiang_hover_2 c_ore");
        if (this.id == "ulBsBaseInfo") {
            $("#dvBsBaseInfo").show();
            $("#dvBsDescription").hide();
        } else {
            $("#dvBsBaseInfo").hide();
            $("#dvBsDescription").show();
        }
    }
}

function AddBookStructure(bookId, parentId, structureLevel, order, callback) {
    ///<summary>添加BookStructure对象</summary>
    $divBsInfo.find("#spBsNameHeader").html("添加书结构");
    $divBsInfo.find("#txtOrderName").val(order);
    $divBsInfo.data("_bookId", bookId);
    $divBsInfo.data("_parentId", parentId);
    $divBsInfo.data("_callback", callback);
    $divBsInfo.show();
    $divDisableOthers.show();
    bindBookStructureType(structureLevel, "", getDirectChildTypes, $divBsInfo.find("#ddlStructureType"));
}

function EditBookStructure(sid, structureLevel, callback) {
    ///<summary>编辑BookStructure对象</summary>

    $divBsInfo.find("#spBsNameHeader").html("编辑书结构");
    $divBsInfo.show();
    $divDisableOthers.show();
    var bs = BookStructureDataSvr.Get(sid);
    if (bs) {
        with ($divBsInfo) {
            data("_bookStructure", bs);
            data("_callback", callback);
            find("#txtTitle").val(bs.title);
            bindBookStructureType(structureLevel, bs.structureTypeId, getCurrTypes, find("#ddlStructureType"));
            find("#txtOrderName").val(bs.structureOrderName);
            find("#txtPosition").val(bs.structurePosition);
            find("#txtUrl").val(bs.url);
            find("#divBsAreaDetails").html(bs.description);
        }
    }
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

function onBsBtnConfirmClick() {
    ///<summary>保存BookStructure编辑</summary>

    if (editor) {
        editor.hide();
    }

    // hidden_emath_editor();
    var validData = validateBsForm();
    if (validData.isValid == false) {
        $.jBox.tip(validData.msg, 'warning');
        return false;
    }

    var callback = $divBsInfo.data("_callback");
    var bsWrapper = getBookStructureWrapper();
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
    onBsBtnCloseClick();
}

function onBsBtnCloseClick() {
    ///<summary>取消BookStructure编辑</summary>
    if (editor) {
        editor.hide();
    }

    //hidden_emath_editor();
    CloseBsBox();
    clearBsForm();
}

function clearBsForm() {
    ///<summary>清除界面信息</summary>

    with ($divBsInfo) {
        find("#txtTitle").val("");
        find("#ddlStructureType").val("-1");
        find("#txtOrderName").val("");
        find("#txtPosition").val("");
        find("#txtUrl").val("");
        find("#divBsAreaDetails").html("&nbsp;");
        data("_bookStructure", null);
        data("_callback", null);
    }
    $divBsInfo.find("#divBsDaoXiang ul:eq(0)").trigger("click");
}

function CloseBsBox() {
    ///<summary>关闭BookStructure编辑界面</summary>

    $divBsInfo.hide();
    $divDisableOthers.hide();
}

function validateBsForm() {
    ///<summary>验证BookStructure</summary>

    var validData = { isValid: true, msg: "" };
    if ($divBsInfo.find("#txtTitle").val().trim() == "") {
        validData.isValid = false;
        validData.msg = "结构名称不能为空！";
    } else if ($divBsInfo.find("#ddlStructureType").val() == "-1") {
        validData.isValid = false;
        validData.msg = "请选择结构级别！";
    }
    return validData;
}

function bindBookStructureType(level, defVal, funGet, oSel) {
    ///<summary>bind Book structure type</summary>
    $excuteWS("~CmsWS.getBookStructureTypeList", { isbn: ISBN }, function (result) {
        oSel.find("option:gt(0)").remove();
        if (result && result.length > 0) {
            var types = funGet(level, result);
            $.each(types, function () {
                oSel.append("<option value='" + this.id + "' level='" + this.structureLevel + "'>" + this.structureType + "</option>");
            });
            if (defVal) {
                oSel.val(defVal);
            } else if (types.length == 1) {
                oSel.val(types[0].id);
            }
        }
    }, null, null);
}

function getDirectChildTypes(level, objArr) {
    ///<summary>获得子节点的类型列表</summary>

    var childLevel = "";
    if (level == "0") {
        childLevel = objArr[0].structureLevel;
    } else {
        var idx = objArr.indexOf("structureLevel", level);
        if (idx != -1 && idx < objArr.length - 1) {
            childLevel = objArr[idx + 1].structureLevel;
        }
    }

    var childTypes = [];
    $.each(objArr, function () {
        if (this.structureLevel == childLevel) {
            childTypes.push(this);
        }
    });
    return childTypes;
}

function getCurrTypes(level, objArr) {
    ///<summary>获得当前节点的类型列表</summary>

    var currTypes = [];
    $.each(objArr, function () {
        if (this.structureLevel == level) {
            currTypes.push(this);
        }
    });
    return currTypes;
}

function getBookStructureWrapper() {
    ///<summary>返回BookStructureWrapper对象</summary>

    var $selStructureType = $divBsInfo.find("#ddlStructureType option:selected");
    var bs = $divBsInfo.data("_bookStructure");
    if (bs) {
        with ($divBsInfo) {
            bs.title = find("#txtTitle").val().trim();
            bs.structureTypeId = find("#ddlStructureType").val();
            bs.structureTypeName = $selStructureType.text();
            bs.structureTypeLevel = $selStructureType.attr("level");
            bs.structureOrderName = find("#txtOrderName").val().trim();
            bs.structurePosition = find("#txtPosition").val().trim();
            bs.url = find("#txtUrl").val().trim();
            bs.description = find("#divBsAreaDetails").html();
        }
    } else {
        bs = {};
        var bookId = $divBsInfo.data("_bookId");
        var parentId = $divBsInfo.data("_parentId");
        with ($divBsInfo) {
            bs.bookId = bookId;
            bs.parentId = parentId;
            bs.title = find("#txtTitle").val().trim();
            bs.structureTypeId = find("#ddlStructureType").val();
            bs.structureTypeName = $selStructureType.text();
            bs.structureTypeLevel = $selStructureType.attr("level");
            bs.structureOrderName = find("#txtOrderName").val().trim();
            bs.structurePosition = find("#txtPosition").val().trim();
            bs.url = find("#txtUrl").val().trim();
            bs.description = find("#divBsAreaDetails").html();
        }
    }
    return bs;
}

var editor = null;
function onBsDescriptionDivClick(currentDIV) {
    ///<summary>点击div加入编辑器</summary>
    if (editor == null) {
        editor = new emath_editor();
        editor.show_mode = "latex";
    }

    editor.edit_container = currentDIV;
    editor.upload_path = "../Uploads/CMS/" + $("#selBookList").find("option:selected").attr("id");

    editor.edit_height = "272px";
    editor.hide();
    editor.show(); 
    editor.jsUploadImage($("#selBookList").find("option:selected").attr("id"));
    //    var divLoEmathEditor = $("#divLoEmathEditor").get(0);
    //    divLoEmathEditor.style.display = "none";
    //    currentDIV.style.overflow = "hidden";
    //    create_emath_editor({ editorContainer: currentDIV, width: "100%", height: "330px" });
    //    currentDIV.parentNode.insertBefore(divLoEmathEditor, currentDIV);
    //    divLoEmathEditor.style.display = "block";
}


function GetBookStructureArray() {
    ///<summary>返回BookStructure 数组</summary>

    var targetArray = new Array();
    if (BookStructureDataSvr) {
        var originalArray = BookStructureDataSvr.GetList().slice(0);  //复制BookStructure数据
        var rootNode = $BookStructureTree.dynatree("getRoot");
        getStructureTreeNode(rootNode, originalArray, targetArray);
    }
    return targetArray;
}

function getStructureTreeNode(parentNode, sourceArray, targetArray) {
    ///<summary>根据bookStructureTree节点的顺序返回BookStructure数组</summary>
    /// <param name="parentNode" type="Object">父节点</param>
    /// <param name="sourceArray" type="Array">源BookStructure数组</param>
    /// <param name="targetArray" type="Array">需要返回的BookStructure数组</param>

    if (parentNode.data.structureLevel == "10") {
        return;
    } else {
        var children = parentNode.getChildren();
        if (children) {
            var bs = null;
            for (var i = 0; i < children.length; i++) {
                bs = getBookStructureObj(children[i].data.key, sourceArray);
                if (bs) {
                    targetArray.push(bs);
                }
                getStructureTreeNode(children[i], sourceArray, targetArray);
            }
        }
    }
}

function getBookStructureObj(id, bsArray) {
    ///<summary>根据contentId返回BookStructure对象</summary>

    var idx = bsArray.indexOf("contentId", id);
    if (idx != -1) {
        var obj = bsArray.splice(idx, 1);
        return obj[0];
    } else {
        return null;
    }
}

////返回子节点的结构类型
//function getDirectChildStructureType(structureLevel) {
//    var structureTypes = getDirectChildTypes(structureLevel, _BookStructureTypeArray);
//    if (structureTypes && structureTypes.length > 0) {
//        return structureTypes[0];
//    } else {
//        return null;
//    }
//}

//返回子节点的结构类型
//function getDirectChildStructureType(structureLevel) {
//    var len = _BookStructureTypeArray.length;
//    var i = _BookStructureTypeArray.indexOf("structureLevel", structureLevel);
//    if (i != -1 && i < len - 1) {
//        return _BookStructureTypeArray[i + 1];
//    }
//    return null;
//}

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