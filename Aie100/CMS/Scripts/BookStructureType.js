/// <reference path="../../Scripts/jquery-1.4.1.min.js" />

var BookStructureTypeArray = [];
var BookWrapperArray = [];
var ISBN = "";

function PageLoad() {
    InitCmsMenu("m_BookStructureType");

    $("#cms_toolbar #btnAdd").click(function () {
        if ($("#selBookList").val() != "-1") {
            editBookStructureType();
        } else {
            $.jBox.info("请选择书", "提示", { buttons: { '确定': true} });
        }
    });

    bindGradation();
    getBookInfo();
}

function loadBookStructureTypeList(isbn) {
    var $contentbox = $(".cms_contentbox");

    $contentbox.show();
    $contentbox.showLoading();
    $excuteWS("~CmsWS.getBookStructureTypeList", { isbn: isbn }, bindBookStructureTypeList, null, { contentbox: $contentbox });
}

function bindBookStructureTypeList(result, context) {
    var $contentbox = context.contentbox;
    var $dataTable = $contentbox.find(".cms_datatable");
    
    $contentbox.hideLoading();
    $dataTable.find("tr:gt(0)").remove();
    if (!result || result.length == 0) {
        $dataTable.append("<tr class='nodata lightblue'><td colspan='4'>无记录</td></tr>");
        return;
    } else {
        BookStructureTypeArray = result;
    }

    var sBuilder = [];
    var showFlag = "";
    $.each(result, function (i) {
        if (i % 2 == 0) {
            rowClass = "class='lightblue'";
        } else {
            rowClass = "";
        }

        showFlag = (this.showFlag == "1") ? "是" : "否";

        sBuilder = [];
        sBuilder.push("<tr id='" + this.id + "' " + rowClass + ">");
        sBuilder.push("<td>" + this.structureType + "</td>");
        sBuilder.push("<td>" + this.structureLevel + "</td>");
        sBuilder.push("<td>" + showFlag + "</td>");
        sBuilder.push("<td class='operate'><img src='Images/application_edit.png' title='编辑' onclick=\"editBookStructureType('" + this.id + "')\" />&nbsp;<img src='Images/application_delete.png' title='删除' onclick=\"deleteBookStructureType('" + this.id + "')\" /></td>");
        sBuilder.push("</tr>");
        $dataTable.append(sBuilder.join(''));
    });

    $dataTable.find("tr:gt(0)").hover(function () {
        $(this).addClass("hover");
    }, function () {
        $(this).removeClass("hover");
    });
}

function initBookStructureTypeBox() {
    var sBuilder = new Array();
    sBuilder.push("<div id='cms_BookStructureType' class='cms_dialog'>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp;类型名称：</li>");
    sBuilder.push("    <li class='inp'><input id='txtStructureType' name='txtStructureType' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp;类型编号：</li>");
    sBuilder.push("    <li class='inp'><input id='txtStructureLevel' name='txtStructureLevel' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'>&nbsp;</li>");
    sBuilder.push("    <li class='inp'><input id='cbxShowFlag' name='cbxShowFlag' type='checkbox' checked='checked' />&nbsp;<label for='cbxShowFlag'>该类型可见</label></li>");
    sBuilder.push("</ul>");
    sBuilder.push("</div>");
    return sBuilder.join("");
}

function editBookStructureType(id) {
    var title = "";
    var _id = "";
    if (id) {
        title = "编辑级别";
        _id = id;
    } else {
        title = "添加级别";
        _id = "";
    }

    var $jb = $.jBox(initBookStructureTypeBox(), { id: 'jb_BookStructureType', title: title, width: 580, top: "25%", buttons: { "保存": true, "取消": false }, submit: submitBookStructureType });
    var $bookStructureType = $jb.find("#cms_BookStructureType");
    $bookStructureType.data("_id", _id);

    if (id) {
        var bookStructureType = getBookStructureTypeObj(id);
        var showFlag = (bookStructureType.showFlag == "1") ? true : false;
        $bookStructureType.find("#txtStructureType").val(bookStructureType.structureType);
        $bookStructureType.find("#txtStructureLevel").val(bookStructureType.structureLevel);
        $bookStructureType.find("#cbxShowFlag").attr("checked", showFlag);
    }
}

function getBookStructureTypeObj(id) {
    var bookStructureType = null;
    for (var i = 0; i < BookStructureTypeArray.length; i++) {
        if (BookStructureTypeArray[i].id == id) {
            bookStructureType = BookStructureTypeArray[i];
            break;
        }
    }
    return bookStructureType;
}

function submitBookStructureType(v, h, f) {
    if (v == true) {
        var validData = validateForm(f);
        if (validData.isValid == false) {
            $.jBox.tip(validData.msg, 'warning');
            return false;
        }
        var bstWrapper = getBookStructureType(h);
        if (bstWrapper.id) {
            $excuteWS("~CmsWS.editBookStructureType", { bookStructureTypeW: bstWrapper, userExtend: SimpleUser }, onEditBookStructureType, null, null);
        } else {
            $excuteWS("~CmsWS.saveBookStructureType", { bookStructureTypeW: bstWrapper, userExtend: SimpleUser }, onSaveBookStructureType, null, null);
        }
        return false;
    }
}

function validateForm(f) {
    var validData = { isValid: true, msg: "" };
    if (f.txtStructureType.trim() == "") {
        validData.isValid = false;
        validData.msg = "类型名称不能为空！";
    } else {
        var level = f.txtStructureLevel.trim();
        if (level == "") {
            validData.isValid = false;
            validData.msg = "类型编号不能为空！";
        } else {
            var levelError = false;
            if (!isNaN(level)) {
                if (parseInt(level) <= 0) {
                    levelError = true;
                }
            } else {
                levelError = true;
            }
            if (levelError) {
                validData.isValid = false;
                validData.msg = "类型编号为大于0的整数，请正确输入！";
            }
        }
    }
    

    return validData;
}

function getBookStructureType(h) {
    var bookStructureType;
    var id = h.find("#cms_BookStructureType").data("_id");
    if (id) {
        bookStructureType = getBookStructureTypeObj(id);
        bookStructureType.structureType = h.find("#txtStructureType").val().trim();
        bookStructureType.structureLevel = h.find("#txtStructureLevel").val().trim();
        bookStructureType.showFlag = (h.find("#cbxShowFlag").is(":checked")) ? "1" : "0";
    } else {
        bookStructureType = {};
        bookStructureType.bookId = $("#selBookList option:selected").attr("id");
        bookStructureType.structureType = h.find("#txtStructureType").val().trim();
        bookStructureType.structureLevel = h.find("#txtStructureLevel").val().trim();
        bookStructureType.showFlag = (h.find("#cbxShowFlag").is(":checked")) ? "1" : "0";
    }
    return bookStructureType;
}

function onSaveBookStructureType(result) {
    var bookStructureType = result;
    if (!bookStructureType) {
        $.jBox.tip("保存失败！", 'error');
    } else {
        $.jBox.close('jb_BookStructureType');
        BookStructureTypeArray.push(bookStructureType);

        var $dataTable = $(".cms_contentbox .cms_datatable");
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

        var showFlag = (bookStructureType.showFlag == "1") ? "是" : "否";
        sBuilder = new Array();
        sBuilder.push("<tr id='" + bookStructureType.id + "' " + rowClass + ">");
        sBuilder.push("<td>" + bookStructureType.structureType + "</td>");
        sBuilder.push("<td>" + bookStructureType.structureLevel + "</td>");
        sBuilder.push("<td>" + showFlag + "</td>");
        sBuilder.push("<td class='operate'><img src='Images/application_edit.png' title='编辑' onclick=\"editBookStructureType('" + bookStructureType.id + "')\" />&nbsp;<img src='Images/application_delete.png' title='删除' onclick=\"deleteBookStructureType('" + bookStructureType.id + "')\" /></td>");
        sBuilder.push("</tr>");
        $dataTable.append(sBuilder.join(''));
        $dataTable.find("tr:last").hover(function () {
            $(this).addClass("hover");
        }, function () {
            $(this).removeClass("hover");
        });
    }
}

function onEditBookStructureType(result) {
    var bookStructureType = result;
    if (!bookStructureType) {
        $.jBox.tip("更新失败！", 'error');
    } else {
        $.jBox.close('jb_BookStructureType');
        loadBookStructureTypeList(ISBN);
    }
}

function deleteBookStructureType(id) {
    var bookStructureType = getBookStructureTypeObj(id);
    $.jBox.confirm("你确定要删除类型“" + bookStructureType.structureType + "”吗?", "提示", function (v, h, f) {
        if (v == true) {
            $excuteWS("~CmsWS.deleteBookStructureType", { bookStructureTypeW: bookStructureType, userExtend: SimpleUser }, function (result) {
                if (result) {
                    loadBookStructureTypeList(ISBN);
                } else {
                    $.jBox.tip("删除失败！", 'error');
                }
            }, null, null);
        }
    }, { top: "25%", buttons: { "确定": true, "取消": false} });
}

//显示阶段列表
function bindGradation() {
    var ddl = $("#ddlGradation");

    ddl.empty().unbind("change").addClass("sel_loading");
    $excuteWS("~CmsWS.getGradationList", { userExtend: SimpleUser }, function (result) {
        //赋值
        var options = [];
        if (result) {
            $.each(result, function () {
                options.push("<option value='" + this.id + "'>" + this.gradationName + "</option>");
            });
        }
        ddl.removeClass("sel_loading").append("<option value='-1'>请选择阶段</option>");
        ddl.append(options.join(""));
    }, null, null);

    //事件
    ddl.change(function () {
        var gradationId = $(this).val();
        if (gradationId != "-1") {
            bindDiscipline(gradationId);
        } 
    });
}

function bindDiscipline(gradationId) {
    var ddl = $("#Des");
    var oldGradationId = ddl.data("_gradationId");

    if (gradationId == oldGradationId) {
        return;
    }

    ddl.empty().unbind("change").addClass("sel_loading");
    $excuteWS("~CmsWS.getDisciplineList", { userExtend: SimpleUser }, function (result) {
        //赋值
        var options = [];
        if (result && result.length > 0) {
            $.each(result, function () {
                if (this.gradationId == gradationId) {
                    options.push("<option value='" + this.id + "'>" + this.disciplineName + "</option>");
                }
            });
        }
        ddl.removeClass("sel_loading").append("<option value='-1'>请选择学科类别</option>");
        ddl.append(options.join(""));

        //事件
        ddl.change(function () {
            var disciplineId = $(this).val();
            if (disciplineId != "-1") {
                bindSubject(disciplineId);
            }
        });
    }, null, null);

    ddl.data("_gradationId", gradationId);
}

function bindDisciplineById(disciplineId) {
    var ddl = $("#Des");
    var oldDisciplineId = ddl.data("_disciplineId");

    if (disciplineId == oldDisciplineId) {
        return;
    }

    ddl.empty().unbind("change").addClass("sel_loading");
    $excuteWS("~CmsWS.getDisciplineList", { userExtend: SimpleUser }, function (result) {
        //赋值
        var gradationId = "";
        var options = [];
        if (result && result.length > 0) {
            var x = result.indexOf("id", disciplineId);
            if (x != -1) {
                gradationId = result[x].gradationId;
                $.each(result, function () {
                    if (this.gradationId == gradationId) {
                        options.push("<option value='" + this.id + "'>" + this.disciplineName + "</option>");
                    }
                });
            }
        }
        ddl.removeClass("sel_loading").append("<option value='-1'>请选择学科类别</option>");
        ddl.append(options.join(""));
        ddl.val(disciplineId);
        $("#ddlGradation").val(gradationId);

        //事件
        ddl.change(function () {
            var disciplineId = $(this).val();
            if (disciplineId != "-1") {
                bindSubject(disciplineId);
            }
        });
    }, null, null);

    ddl.data("_disciplineId", disciplineId);
}

//显示学科列表
function bindSubject(disciplineId, def) {
    var ddl = $("#Sub");
    var oldDisciplineId = ddl.data("_disciplineId");

    if (disciplineId == oldDisciplineId) {
        return;
    }

    ddl.empty().unbind("change").addClass("sel_loading");
    $excuteWS("~CmsWS.getSubjectListByDisciplineId", { disciplineId: disciplineId, userExtend: SimpleUser }, function (result) {
        //赋值
        var options = [];
        if (result && result.length > 0) {
            $.each(result, function () {
                if (this.disciplineId == disciplineId) {
                    options.push("<option value='" + this.id + "'>" + this.subjectName + "</option>");
                }
            });
        }
        ddl.removeClass("sel_loading").append("<option value='-1'>请选择学科</option>");
        ddl.append(options.join(""));

        //事件
        ddl.change(function () {
            var subjectId = $(this).val();
            if (subjectId != "-1") {
                getBookInfo(subjectId);
            } else {
                getBookInfo();
            }
        });

        //默认值
        if (def) {
            ddl.val(def);
        }
    }, null, null);

    ddl.data("_disciplineId", disciplineId);
}

//显示书
function getBookInfo(subjectId) {
    var ddl = $("#selBookList");

    if (BookWrapperArray && BookWrapperArray.length > 0) {
        ddl.empty().unbind("change").append("<option value='-1'>请选择书</option>");
        bindBookInfo(BookWrapperArray, subjectId);
    } else {
        ddl.empty().unbind("change").addClass("sel_loading");
        $excuteWS("~CmsWS.getBookList", { userId: null, instituteIds: null, disciplineIds: null, subjectIds: null, realFlag: null, userExtend: SimpleUser }, function (result) {
            ddl.removeClass("sel_loading").append("<option value='-1'>请选择书</option>");
            if (result) {
                BookWrapperArray = result;
                bindBookInfo(result, subjectId);
            }
        }, null, null);
    }
}

function bindBookInfo(bookArr, subjectId) {
    var options = [];
    if (subjectId) {
        $.each(bookArr, function () {
            if (this.subjectId == subjectId) {
                options.push("<option value='" + this.isbn + "' id='" + this.id + "' >" + this.title + "</option>");
            }
        });
    } else {
        $.each(bookArr, function () {
            options.push("<option value='" + this.isbn + "' id='" + this.id + "' >" + this.title + "</option>");
        });
    }
    $("#selBookList").append(options.join(""))
    .change(function () {
        ISBN = $(this).val();
        if (ISBN != "-1") {
            var bookWrapper = findBookObj(ISBN);
            bindDisciplineById(bookWrapper.disciplineId);
            bindSubject(bookWrapper.disciplineId, bookWrapper.subjectId);
            loadBookStructureTypeList(ISBN);
        } else {
            $(".cms_contentbox").hide();
        }
    });
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
