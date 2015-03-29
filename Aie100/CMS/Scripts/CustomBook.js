/// <reference path="../../Scripts/jquery-1.4.1.min.js" />
/// <reference path="BookStructContext.js" />
/// <reference path="KnowStructContext.js" />


/*
* 定制书
*/

var BookWrapperArray = [];

function PageLoad() {
    InitCmsMenu("m_CustomBook");
    //InitBookStructContext();
    bindBookInfo();
    ResetTreeNavFrameHeight("dvBookStructTree", "dvKnowStructTree");
    $(window).resize(function () {
        ResetTreeNavFrameHeight("dvBookStructTree", "dvKnowStructTree");
    });
    $("#tbContentbox").colResizable({
        liveDrag: true,
        minWidth: 100
    });
    $("#selBookList").change(function () {
        $("#dvKnowStructTree").empty();
        var $dvBookStructTree = $("#dvBookStructTree");
        var isbn = $(this).val();
        if (isbn != "-1") {
            var bookWrapper = findBookObj(isbn);
            bindDiscipline(bookWrapper.disciplineId);
            bindSubject(bookWrapper.disciplineId, bookWrapper.subjectId);

            LoadBookStructTree(isbn, $dvBookStructTree);
            var pointingIsbn = $(this).find("option:selected").attr("pointingIsbn");
            if (pointingIsbn) {
                LoadKnowStructTree(pointingIsbn, $("#dvKnowStructTree"));
            }
        } else {
            $dvBookStructTree.empty();
        }
    });

//    emath_overflowDivArray.push("divAreaShortDetails");

    $("#btnSave").bind("click", saveBookStructure);
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
                var kpArray = GetDirtyKnowledgePointArray();
                if (kpArray.length > 0) {  //保存kp
                    SimpleUser.isbn = $("#selBookList").val();
                    $excuteWS("~CmsWS.editLearningObjectiveCmsByGroup", { locs: kpArray, userExtend: SimpleUser }, function (result) {
                        if (result) {
                            updateNewKps(kpArray, result);
                            updateNewNodes(result);
                            _SortKp();
                        } else {
                            $.jBox.tip('保存知识点失败.', 'error');
                        }
                    }, null, null);

                } else {
                    _SortKp();
                }
            } else {
                $.jBox.tip('保存成功.', 'error');
            }
        }, null, null);
    }

}

function bindBookInfo() {
    var oSel = $("#selBookList");
    $excuteWS("~CmsWS.getBookList", { userId: null, instituteIds: null, disciplineIds: null, subjectIds: null, realFlag: true, userExtend: SimpleUser }, function (result) {
        oSel.empty();
        if (result && result.length > 0) {
            BookWrapperArray = result;
            $.each(result, function () {
                pointingIsbn = this.pointingIsbn ? this.pointingIsbn : "";
                oSel.append("<option value='" + this.isbn + "' id='" + this.id + "' subjectId='" + this.subjectId + "' pointingIsbn='" + pointingIsbn + "' >" + this.title + "</option>");
            });
        }
        oSel.removeClass("sel_loading").prepend("<option value='-1'>请选择书</option>").get(0).selectedIndex = 0;

        var args = getUrlParms();
        if (args["isbn"]) {
            AddUserParam("isbn", args["isbn"]);
        }

        bindDiscipline();

    }, null, null);
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
        pointingIsbn = tarBookList[i].pointingIsbn ? tarBookList[i].pointingIsbn : "";
        oSel.append("<option value='" + tarBookList[i].isbn + "' id='" + tarBookList[i].id + "' subjectId='" + tarBookList[i].subjectId + "' pointingIsbn='" + pointingIsbn + "' >" + tarBookList[i].title + "</option>");
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
                $("#Sub").empty();
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

function _SortKp() {
    var kpSortArray = GetSortKnowledgePointArray();
    if (kpSortArray.length > 0) {
        $excuteWS("~CmsWS.editLearningObjectiveCmsBySort", { locs: kpSortArray, userExtend: SimpleUser }, function (result) {
            if (result) {
                $.jBox.tip('保存成功.', 'success');
            } else {
                $.jBox.tip('保存失败.', 'error');
            }
        }, null, null);
    } else {
        $.jBox.tip('保存成功.', 'success');
    }
}