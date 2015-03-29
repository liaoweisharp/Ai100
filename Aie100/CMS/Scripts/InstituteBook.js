/// <reference path="../../Scripts/JQuery/jquery-1.4.1.min.js" />

var $ddlInstitutes = null;
var $btnAdd = null;
var $tbInstituteBooks = null;
var $contentbox = null;
var instituteBookArray = [];
var bookArray = [];
var selBookIdArr = [];

function PageLoad() {
    InitCmsMenu("m_institutebook");

    $ddlInstitutes = $("#ddlInstitutes");
    $btnAdd = $("#btnAdd");
    $tbInstituteBooks = $("#tbInstituteBooks");
    $contentbox = $(".cms_contentbox");

    bindInstituteList();
    $btnAdd.bind("click", addBooks);
}

//显示所有学院
function bindInstituteList() {
    $excuteWS("~CourseWS.institutesMyManageList", { userId: SimpleUser.userId, userExtend: SimpleUser }, function (institutes) {
        if (institutes && institutes.length > 0) {
            var options = [];

            $.each(institutes, function () {
                options.push("<option value='" + this.id + "'>" + this.name + "</option>");
            });
            $ddlInstitutes.append(options.join('')).unbind().bind("change", showInstituteBookList);
        }
    }, null, null);
}

function showInstituteBookList() {
    var instituteId = $ddlInstitutes.val();
    if (instituteId != -1) {
        $contentbox.showLoading();
        $excuteWS("~CourseWS.getBookIdsByInstitute", { instituteId: instituteId, userExtend: SimpleUser }, function (result) {
            $contentbox.hideLoading();
            var bookIds = (result && result.length > 0) ? result : [];
            bindInstituteBookPagin(bookIds);
        }, null, null);
    } else {
        $tbInstituteBooks.find("tr:gt(0)").remove();
    }
}

var pageSize = 25;
function bindInstituteBookPagin(bookIds) {
    $("#instituteBookPagin").html("").pagination(bookIds.length, {
        num_edge_entries: 2,
        num_display_entries: 5,
        items_per_page: pageSize,
        prev_text: "上一页",
        next_text: "下一页",
        callback: function (page_index, o) {
            var $contentbox = $(".cms_contentbox").showLoading();
            var _startPos = page_index * pageSize;
            var _endPos = _startPos + (pageSize - 1);
            var pageIds = getIdsArray(bookIds, _startPos, _endPos);
            $excuteWS("~CourseWS.instituteBookByIB", { instituteId: $ddlInstitutes.val(), bookIds: pageIds, userExtend: SimpleUser }, function (result) {
                $contentbox.hideLoading();
                bindInstituteBookList(result);
            }, null, null);
        }
    });
}


function bindInstituteBookList(instituteBookArr) {
    var instituteBooks = instituteBookArr[0];
    var books = instituteBookArr[1];

    instituteBookArray = instituteBooks;
    selBookIdArr = getBookIds(books);

    $contentbox.hideLoading();
    $tbInstituteBooks.find("tr:gt(0)").remove();
    if (!instituteBooks || instituteBooks.length == 0) {
        $tbInstituteBooks.append("<tr class='nodata lightblue'><td colspan='4'>未分配书</td></tr>");
        return;
    }

    var sBuilder = [];
    var rowClass = "";
    var n, bookName, price, studyFlag;
    $.each(instituteBooks, function (i) {
        if (i % 2 == 0) {
            rowClass = "class='lightblue'";
        } else {
            rowClass = "";
        }

        n = books.indexOf("id", this.bookId);
        bookName = (n != -1) ? books[n].title : "";
        price = (this.price || this.price == 0) ? this.price : "";
        studyFlag = (this.studyFlag) ? "checked='checked'" : "";

        sBuilder = [];
        sBuilder.push("<tr id='" + this.id + "'" + rowClass + ">");
        sBuilder.push("<td>" + bookName + "</td>");
        sBuilder.push("<td style='text-align:center'><input type='text' oldval='" + price + "' value='" + price + "' class='inp_price' style='width:30px;'></td>");
        sBuilder.push("<td style='text-align:center'><input type='checkbox' " + studyFlag + " class='inp_study' /></td>");
        sBuilder.push("<td class='operate' style='padding-left:12px'><img src='Images/application_delete.png' title='删除' onclick=\"delInstituteBook('" + this.id + "')\" /></td>");
        sBuilder.push("</tr>");
        $tbInstituteBooks.append(sBuilder.join(""));
    });

    _resizeCmsBox("cms_contentbox", 60);

    //更新价格
    $tbInstituteBooks.find("input.inp_price").blur(function () {
        var $o = $(this);
        var id = $o.parent().parent().attr("id");
        var v = $o.val();
        var oldvla = $o.attr("oldval");

        if (v != oldvla) {
            if (!v || isNaN(v)) {
                $.jBox.tip("价格输入错误", "warning");
                $o.val(oldvla);
                return;
            }
            var i = instituteBookArray.indexOf("id", id);
            if (i != -1) {
                instituteBookArray[i].price = v;
                $excuteWS("~CourseWS.bookDistributionInstitute", { iBooks: [instituteBookArray[i]], userExtend: SimpleUser }, function (result) {
                    $o.attr("oldval", v);
                }, null, null);
            }
        }
    });

    //更新studyFlag
    $tbInstituteBooks.find("input.inp_study").click(function () {
        var $o = $(this);
        var id = $o.parent().parent().attr("id");
        var studyFlag = (this.checked) ? 1 : 0;
        var i = instituteBookArray.indexOf("id", id);
        if (i != -1) {
            instituteBookArray[i].studyFlag = studyFlag;
            $excuteWS("~CourseWS.bookDistributionInstitute", { iBooks: [instituteBookArray[i]], userExtend: SimpleUser }, function (result) {
            }, null, null);
        }
    });
}

function addBooks() {
    if ($ddlInstitutes.val() == -1) {
        $.jBox.info("请选择学院", "提示");
        return;
    } 

    var $jb = $.jBox(initAddBookBox(), { id: 'jb_addbooks', title: "分配书", width: 580, top: "25%", buttons: { "保存": true, "取消": false }, submit: saveInstituteBooks });
    if (bookArray && bookArray.length > 0) {
        bindBookList();
    } else {
        $excuteWS("~CmsWS.getBookList", { userId: null, instituteIds: null, disciplineIds: null, subjectIds: null, realFlag: null, userExtend: SimpleUser }, function (books) {
            bookArray = (books && books.length > 0) ? books : [];
            bindBookList();
        }, null, null);
    }
}

function initAddBookBox() {
    var sb = [];
    sb.push("<div style='overflow:auto; height:300px; padding:8px'>");
    sb.push("<table id='tbBookList' style='width:100%'>");
    sb.push("<tr><th style='text-align:left'>书名</th></tr>");
    sb.push("<tr><td style='text-align:center'><img src='Images/ajax-loader_b.gif' /></td></tr>");
    sb.push("</table>");
    sb.push("</div>");
    return sb.join("");
}

function bindBookList() {
    var bookList = excludeSelected();   //得到可选的书
    var sb = [];

    $.each(bookList, function () {
        sb.push("<tr><td><input type='checkbox' id='" + this.id + "' /><label for='" + this.id + "' style='cursor:pointer'>" + this.title + "</label></td></tr>");
    });
    
    $("#tbBookList").find("tr:gt(0)").remove();
    $("#tbBookList").append(sb.join(""));
}

function saveInstituteBooks(v, h, f) {
    if (v == true) {
        var selBookIds = h.find("#tbBookList input:checked").map(function () {
            return this.id;
        }).get();
        
        if (selBookIds.length == 0) {
            $.jBox.tip("没有选择书！", 'warning');
            return;
        }

        var instBooks = [];
        var instituteId = $ddlInstitutes.val();
        for (var i = 0; i < selBookIds.length; i++) {
            var instBook = {};
            instBook.bookId = selBookIds[i];
            instBook.instituteId = instituteId;
            instBook.price = 0;
            instBook.studyFlag = 0;
            instBooks.push(instBook);
        }
        
        $excuteWS("~CourseWS.bookDistributionInstitute", { iBooks: instBooks, userExtend: SimpleUser }, function (result) {
            showInstituteBookList();
        }, null, null);
    }
}

function getBookIds(books) {
    var bookIds = [];
    if (books && books.length > 0) {
        $.each(books, function () {
            bookIds.push(this.id);
        });
    }
    return bookIds;
}

//去除已选项目
function excludeSelected() {
    var arr = [];
    $.each(bookArray, function () {
        if ($.inArray(this.id, selBookIdArr) == -1) {
            arr.push(this);
        }
    });
    return arr;
}

function delInstituteBook(id) {
    $.jBox.confirm("你确定要删除这条记录吗?", "消息", function (v, h, f) {
        if (v == true) {
            var i = instituteBookArray.indexOf("id", id);
            $excuteWS("~CourseWS.bookDistributionRemove", { iBook: instituteBookArray[i], userExtend: SimpleUser }, function (result) {
                if (result) {
                    showInstituteBookList();
                } else {
                    $.jBox.tip("删除失败！", 'error');
                }
            }, null, null);
        }
    }, { top: "25%", buttons: { "确定": true, "取消": false } });
}