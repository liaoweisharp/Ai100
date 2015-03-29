/// <reference path="../../Scripts/jquery-1.4.1.min.js" />
var BookWrapperArray = [];
var MathBookArray = [];
var isbn3;
function PageLoad() {
    InitCmsMenu("m_book");
    loadBookList();
    $("#bookInfoBar #btnAdd").click(function () {
        editBookInfo();
    });
    $("#sumbi").click(function () {
        var keys = $("#keyword").val();
        Query(keys);
    })
}

function loadBookList() {
    var $contentbox = $(".cms_contentbox");
    $contentbox.showLoading();
    $excuteWS("~BookWS.getAllBook", {}, bindBookList, null, { contentbox: $contentbox });
}

function bindBookList(result, context) {
    var $contentbox = context.contentbox;
    var $dataTable = $contentbox.find(".cms_datatable");

    $contentbox.hideLoading();
    $dataTable.find("tr:gt(0)").remove();
    if (!result || result.length == 0) {
        $dataTable.append("<tr class='nodata lightblue'><td colspan='6'>无记录</td></tr>");
        return;
    }

    var sBuilder = [];
    var rowClass = "";

    BookWrapperArray = result;
    $.each(result, function (i) {
        if (i % 2 == 0) {
            rowClass = "class='lightblue'";
        } else {
            rowClass = "";
        }

        var title = (this.Title) ? this.Title : "";
        var subTitle = (this.SubTitle) ? this.SubTitle : "";
        var price = (this.Price) ? this.Price : "";

        sBuilder = [];
        sBuilder.push("<tr id='" + this.ID + "' " + rowClass + ">");
        sBuilder.push("<td>" + this.ISBN + "</td>");
        sBuilder.push("<td>" + title + "</td>");
        sBuilder.push("<td>" + subTitle + "</td>");
        sBuilder.push("<td style='text-align:center'>$ " + price + "</td>");
        sBuilder.push("<td class='operate'><img src='Images/application_edit.png' title='编辑' onclick=\"editBookInfo('" + this.ID + "')\" />&nbsp;<img src='Images/application_delete.png' title='删除' onclick=\"deleteBook('" + this.ID + "')\" /></td>");
        sBuilder.push("</tr>");
        $dataTable.append(sBuilder.join(' '));
    });

    $dataTable.find("tr:gt(0)").hover(function () {
        $(this).addClass("hover");
    }, function () {
        $(this).removeClass("hover");
    });
}

function editBookInfo(bookId) {
    var title = "";
    var _bookId = "";
    if (bookId) {
        title = "Edit Book";
        _bookId = bookId;
        var $jb = $.jBox(initBookBox(), { id: 'jb_cmsbook', title: title, width: 580, top: "25%", buttons: { "保存": true, "取消": false }, submit: submitBookInfo });
        var $book = $jb.find("#cms_dialog_book");
        $book.data("_bookId", _bookId);
        $("#txtPrice").keyup(function () {
            if (/\D/.test(this.value)) {
                alert('只能输入数字'); this.value = ''
            }
        });
        var bookWrapper = getBookInfoObj(bookId);
        $book.find("#txtISBN").text(bookWrapper.ISBN);
        $book.find("#txtTitle").val(bookWrapper.Title);
        $book.find("#txtSubTitle").val(bookWrapper.SubTitle);
        $book.find("#txtPrice").val(bookWrapper.Price);
    }
    else {
        title = "添加书";
        _bookId = "";
        var $jb = $.jBox(initAddBookBox(), { id: 'jb_cmsbook', title: title, width: 580, top: "25%", buttons: { "保存": true, "取消": false }, submit: submitBookInfo });
        var $book = $jb.find("#cms_dialog_book");
        $book.data("_bookId", _bookId);
        $("#txtPrice").keyup(function () {
            if (/\D/.test(this.value)) {
                alert('只能输入数字'); this.value = ''
            }
        })

        $excuteWS("~CmsWS.getBookList", { userId: null, instituteIds: null, disciplineIds: null, subjectIds: null, realFlag: null, userExtend: SimpleUser }, function (result) {
            MathBookArray = result;
            var $title = $("#txtTitle");
            $.each(result, function () {
                $title.append("<option value='" + this.id + "'>" + this.title + "</option>");
            });
        }, null, null);

        $book.find("#txtPrice").val("1");
        $("#txtTitle").change(function () {

            var mathbook = getbookFormMath($(this).val());
            $("#txtISBN").text(mathbook.isbn);
            isbn3 = mathbook.isbn;
        })
    }
}
function initAddBookBox() {
    var sBuilder = new Array();
    sBuilder.push("<div id='cms_dialog_book' class='cms_dialog'>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp; ISBN：</li>");
    sBuilder.push("    <li class='inp'><label id='txtISBN' name='txtISBN'  style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp;标题：</li>");
    sBuilder.push("    <li class='inp'><select id='txtTitle' name='txtTitle' type='text' style='width:100%;'></select></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp;子标题：</li>");
    sBuilder.push("    <li class='inp'><input id='txtSubTitle' name='txtSubTitle' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp;价格：</li>");
    sBuilder.push("    <li class='inp'><input id='txtPrice' name='txtPrice' type='text' style='width:174px'/></li>");
    sBuilder.push("</ul>");
    sBuilder.push("</div>");
    return sBuilder.join("");
}
//初始化书信息编辑界面
function initBookBox() {
    var sBuilder = new Array();
    sBuilder.push("<div id='cms_dialog_book' class='cms_dialog'>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp; ISBN：</li>");
    sBuilder.push("    <li class='inp'><label id='txtISBN' name='txtISBN'  style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp;标题：</li>");
    sBuilder.push("    <li class='inp'><input id='txtTitle' name='txtTitle' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp;子标题：</li>");
    sBuilder.push("    <li class='inp'><input id='txtSubTitle' name='txtSubTitle' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp;价格：</li>");
    sBuilder.push("    <li class='inp'><input id='txtPrice' name='txtPrice' type='text' style='width:174px'/></li>");
    sBuilder.push("</ul>");
    sBuilder.push("</div>");
    return sBuilder.join("");
}


//验证BookInfo
function validateBookInfo(f) {
    var validData = { isValid: true, msg: "" };
    if (f.txtTitle.trim() == "") {
        validData.isValid = false;
        validData.msg = "标题不能为空";
    }
    else if (f.txtSubTitle.trim() == "") {
        validData.isValid = false;
        validData.msg = "子标题不能为空";
    }
    else if (f.txtPrice.trim() == "") {
        validData.isValid = false;
        validData.msg = "价格不能为空";
    }
    return validData;
}

//从表单获取bookInfo
function getBookInfo(f) {
    var bookWrapper = {};
    bookWrapper.Title = f.txtTitle;
    bookWrapper.SubTitle = f.txtSubTitle;
    bookWrapper.Price = f.txtPrice;
    return bookWrapper;
}

//提交书信息
function submitBookInfo(v, h, f) {
    if (v == true) {

        var validData = validateBookInfo(f);
        if (validData.isValid == false) {
            $.jBox.tip(validData.msg, 'warning');
            return false;
        }

        var bookWrapper = getBookInfo(f);
        var bookId = h.find("#cms_dialog_book").data("_bookId");
        if (bookId != "") {
            bookWrapper.ID = bookId;
            var originBook = getBookInfoObj(bookId);
            bookWrapper.ISBN = originBook.ISBN;
            if (bookWrapper.ISBN != originBook.ISBN) {
                checkAndSave("edit", bookWrapper);
            } else {
                $excuteWS("~BookWS.editBook", { bookW: bookWrapper }, onEditBook, null, null);
            }

        } else {
        
            bookWrapper.ISBN = isbn3;
            bookWrapper.ID = bookWrapper.Title;
            for (var i = 0; i < MathBookArray.length; i++) {
                if (MathBookArray[i].id == bookWrapper.Title) {
                    bookWrapper.Title = MathBookArray[i].title;
                }
            }
            checkAndSave("save", bookWrapper);
        }
        return false;
    }
}

//如果ISBN不重复则保存book
function checkAndSave(op, book) {
    $excuteWS("~BookWS.getBookByISBN", { ISBN: book.ISBN }, function (result) {
        if (result) {
            $.jBox.tip("ISBN 重复", 'warning');
        } else {
            if (op == "save") {
                $excuteWS("~BookWS.saveBook", { bookW: book }, onSaveBook, null, null);
            } else {
                $excuteWS("~BookWS.editBook", { bookW: book }, onEditBook, null, null);
            }
        }
    }, null, null);
}

function onSaveBook(result) {
    var bookWrapper = result;
    if (!bookWrapper) {
        $.jBox.tip("保存失败！", 'error');
    } else {
        $.jBox.close('jb_cmsbook');
        BookWrapperArray.push(bookWrapper);

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
        sBuilder = new Array();
        sBuilder.push("<tr id='" + bookWrapper.ID + "' " + rowClass + ">");
        sBuilder.push("<td>" + bookWrapper.ISBN + "</td>");
        sBuilder.push("<td>" + bookWrapper.Title + "</td>");
        sBuilder.push("<td>" + bookWrapper.SubTitle + "</td>");
        sBuilder.push("<td style='text-align:center'>$ " + bookWrapper.Price + "</td>");
        sBuilder.push("<td class='operate'><img src='Images/application_edit.png' title='编辑' onclick=\"editBookInfo('" + bookWrapper.ID + "')\" />&nbsp;<img src='Images/application_delete.png' title='删除' onclick=\"deleteBook('" + bookWrapper.ID + "')\" /></td>");
        sBuilder.push("</tr>");
        $dataTable.append(sBuilder.join(' '));
        $dataTable.find("tr:last").hover(function () {
            $(this).addClass("hover");
        }, function () {
            $(this).removeClass("hover");
        });
    }
}

function onEditBook(result) {
    if (result == false) {
        $.jBox.tip("更新失败！", 'error');
    } else {
        $.jBox.close('jb_cmsbook');
        loadBookList();
    }
}
//客户端返回的书
function getBookInfoObj(bookId) {
    var book = null;
    for (var i = 0; i < BookWrapperArray.length; i++) {
        if (BookWrapperArray[i].ID == bookId) {
            book = BookWrapperArray[i];
            break;
        }
    }

    return book;
}
//Math返回的书
function getbookFormMath(bookid) {
    var book = null;
    for (var i = 0; i < MathBookArray.length; i++) {
        if (MathBookArray[i].id == bookid) {
            book = MathBookArray[i];
            break;
        }
    }
    return book;
}
function deleteBook(bookId) {
    var book = getBookInfoObj(bookId);
    $.jBox.confirm("你确定要删除这本书吗?", "消息", function (v, h, f) {
        if (v == true) {
            $excuteWS("~BookWS.deleteBook", { bookW: { id: bookId }, userExtend: SimpleUser }, function (result) {
                if (result == true) {
                    loadBookList();
                }
                else {
                    $.jBox.tip("删除失败！", 'error');
                }
            }, null, null);
        }
    }, { top: "25%", buttons: { "确定": true, "取消": false} });
}
function Query(key) {
    if (key != null || key != "") {
        $excuteWS("~BookWS.getBookByName", { Name: key }, function (result) {
            var $dataTable = $(".cms_datatable");
            $dataTable.find("tr:gt(0)").remove();
            if (!result || result.length == 0) {
                $dataTable.append("<tr class='nodata lightblue'><td colspan='6'>无记录</td></tr>");
                return;
            }
            var sBuilder = [];
            var rowClass = "";

            $.each(result, function (i) {
                if (i % 2 == 0) {
                    rowClass = "class='lightblue'";
                } else {
                    rowClass = "";
                }

                var title = (this.Title) ? this.Title : "";
                var subTitle = (this.SubTitle) ? this.SubTitle : "";
                var price = (this.Price) ? this.Price : "";

                sBuilder = [];
                sBuilder.push("<tr id='" + this.ID + "' " + rowClass + ">");
                sBuilder.push("<td>" + this.ISBN + "</td>");
                sBuilder.push("<td>" + title + "</td>");
                sBuilder.push("<td>" + subTitle + "</td>");
                sBuilder.push("<td style='text-align:center'>$ " + price + "</td>");
                sBuilder.push("<td class='operate'><img src='Images/application_edit.png' title='编辑' onclick=\"editBookInfo('" + this.ID + "')\" />&nbsp;<img src='Images/application_delete.png' title='删除' onclick=\"deleteBook('" + this.ID + "')\" /></td>");
                sBuilder.push("</tr>");
                $dataTable.append(sBuilder.join(' '));
            })
            $dataTable.find("tr:gt(0)").hover(function () {
                $(this).addClass("hover");
            }, function () {
                $(this).removeClass("hover");
            });
        }, null, null)
    }
}