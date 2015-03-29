/// <reference path="../../Scripts/jquery-1.4.1.min.js" />
/// <reference path="BookStructureInfo.js" />
/// <reference path="KnowledgePointsInfo.js" />
/// <reference path="BookStructureTree.js" />

/*
* 书结构管理
*/

var ISBN = "";
var BookList = [];
var SubList = [];
function PageLoad() {
    var args = getUrlParms();
    AddUserParam("isbn", args["isbn"]);
    $("#editor_spUploadImage,#editor_spUploadFile").css("display", "inline-block");
    InitCmsMenu("m_BookStructure");
    //    $("#editor_InsertLO").css("visibility","visible");
    $("#btnSave").bind("click", saveBookStructure);
    InitBsBox();
    bindBookInfo();
    InitKnowledgePointBox();
    var $selBookList = $("#selBookList");
    BindQueryBook();
    $(window).resize(function () {
        ResetTreeNavFrameHeight("bookStructureTree", "dvRightContent");
    });
    var $tbContentbox = $("#tbContentbox");
    $selBookList.change(function () {
        if (RelationTreeData) RelationTreeData = null;
        ISBN = $(this).val();
        //editor_bookId = $(this).find("option:selected").attr("id");

        if (ISBN != "-1") {
            var bookWrapper = findBookObj(ISBN);
            var $des = $("#Des");
            var $sub = $("#Sub");
            bindDiscipline($des, "", bookWrapper.disciplineId);
            //$des.val(bookWrapper.disciplineId);
            bindSubject($sub, bookWrapper.disciplineId, "", bookWrapper.subjectId);
            $tbContentbox.show();
            ResetTreeNavFrameHeight("bookStructureTree", "dvRightContent");
            GetBookStructureContext(ISBN, BuildBookStructureTree);
            editor_isbn = ISBN;

            AddUserParam("isbn", ISBN);
        } else {
            $tbContentbox.hide();
            $("#bookStructureTree").empty();
            SetUserParam("isbn", "");
        }
    });

    //    emath_overflowDivArray.push("divAreaShortDetails");
    //    emath_overflowDivArray.push("divAreaLongDetails");
    //    emath_overflowDivArray.push("divAreaExtendDetails");
}

function saveBookStructure() {
    if ($("#selBookList").val() == "-1") {
        $.jBox.info("请选择书", "提示", { buttons: { '确定': true} });

        return;
    }

    var bsArray = GetBookStructureArray();
    if (bsArray.length > 0) {
        $.jBox.tip("正在保存数据，请稍等...", 'loading');
        $excuteWS("~CmsWS.sortBookContentStructures", { bookContentStructureWs: bsArray, isbn: ISBN, userExtend: SimpleUser }, function (result) {
            if (result) {
                var kpArray = GetKnowledgePointArray();
                if (kpArray.length > 0) {  //保存kp
                    $excuteWS("~CmsWS.editLearningObjectiveCmsBySort", { locs: kpArray, userExtend: SimpleUser }, function (result) {
                        if (result) {
                            $.jBox.tip('保存成功.', 'success');
                            $("#selBookList").trigger("change");
                        } else {
                            $.jBox.tip('保存知识点失败.', 'error');
                        }

                    }, null, null);
                } else {
                    $.jBox.tip('保存成功.', 'success');
                    $("#selBookList").trigger("change");
                }
            } else {
                $.jBox.tip('保存书结构失败.', 'error');
            }
        }, null, null);
    }
}

function bindBookInfo() {
    bindDiscipline($("#Des"), "", "");
    $excuteWS("~CmsWS.getBookList", { userId: null, instituteIds: null, disciplineIds: null, subjectIds: null, realFlag: false, userExtend: SimpleUser }, function (result) {

        if (result) {
            BookList = result;
            var oSel = $("#selBookList");
            $.each(result, function () {
                oSel.append("<option value='" + this.isbn + "' id='" + this.id + "' >" + this.title + "</option>");
            });
        }
        //        oSel.removeClass("sel_loading").prepend("<option value='-1'>请选择书</option>").get(0).selectedIndex = 0;

        //选择默认的书
        var args = getUrlParms();
        if (args["isbn"]) {
            oSel.val(args["isbn"]).trigger("change");
        }
    }, null, null);
}
///修改选书方式 zh
//显示学科列表
function bindSubject(oSel, disciplineId, defVal, Defval) {
    if (!disciplineId || disciplineId == "-1") {
        oSel.find("option:gt(0)").remove();
        return;
    }

    $excuteWS("~CmsWS.getSubjectListByDisciplineId", { disciplineId: disciplineId, userExtend: SimpleUser }, function (result) {
        oSel.find("option:gt(0)").remove();
        if (result && result.length > 0) {
            SubList = result;
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
function listQueryContent(Des, Sub) {
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
            $sel.append("<option value='" + listQuery[i].isbn + "' id='" + listQuery[i].id + "' subjectId='" + listQuery[i].subjectId + "' >" + listQuery[i].title + "</option>");
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

    $des.change(function () {
        bindSubject($sub, $(this).val(), "", "");
        //        var des = $(this).val();
        //        if (des != -1) {
        //            AddUserParam("des", des);
        //        }
        //        else {
        //            SetUserParam("des", "");
        //        }
    })
    $sub.change(function () {
        listQueryContent($des, $sub);
        //        var sub = $(this).val();
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