/// <reference path="../../Scripts/JQuery/jquery-1.4.1.min.js" />

var $ddlInstitutes = null;
var $tbUserList = null;
var $tbUserBookList = null;
var $btnAdd = null;

var InstituteBooks = [];    //学院的书
var UserBookIds = [];       //用户的书

function PageLoad() {
    InitCmsMenu("m_instituteuserbook");

    $ddlInstitutes = $("#ddlInstitutes");
    $tbUserList = $("#tbUserList");
    $tbUserBookList = $("#tbUserBookList");
    $btnAdd = $("#btnAdd");

    bindInstituteList();
    $btnAdd.bind("click", addBooks);
    ResetTreeNavFrameHeight("dvUserList", "dvUserBookList");
    $(window).resize(function () {
        ResetTreeNavFrameHeight("dvUserList", "dvUserBookList");
    });
}

//显示所有学院
function bindInstituteList() {
    $excuteWS("~CourseWS.institutesMyManageList", { userId: SimpleUser.userId, userExtend: SimpleUser }, function (institutes) {
        if (institutes && institutes.length > 0) {
            var options = [];

            $.each(institutes, function () {
                options.push("<option value='" + this.id + "'>" + this.name + "</option>");
            });
            $ddlInstitutes.append(options.join('')).unbind().bind("change", showInstituteUserList);
        }
    }, null, null);
}

function showInstituteUserList() {
    $tbUserList.find("tr:gt(0)").remove();
    $tbUserBookList.find("tr:gt(0)").remove();
    var instituteId = $ddlInstitutes.val();
    if (instituteId != -1) {
        $tbUserList.parent().showLoading();
        $excuteWS("~CourseWS.getInstructorsByInstituteId", { instituteId: instituteId, userExtend: SimpleUser }, bindUserList, null, null);
    }
}

var OldSelectedRow = null; //上一次被选中的行
function bindUserList(users) {
    $tbUserList.parent().hideLoading();
    if (!users || users.length == 0) {
        $tbUserList.append("<tr class='nodata lightblue'><td>无用户信息</td></tr>");
        return;
    }

    var sBuilder = [];
    var rowClass = "";
    $.each(users, function (i) {
        if (i % 2 == 0) {
            rowClass = "class='lightblue'";
        } else {
            rowClass = "";
        }

        sBuilder = [];
        sBuilder.push("<tr id='" + this.id + "' " + rowClass + ">");
        sBuilder.push("<td>" + this.fullName + "</td>");
        sBuilder.push("</tr>");
        $tbUserList.append(sBuilder.join(''));
    });

    $tbUserList.find("tr:gt(0)").click(function () {
        if ($(this).hasClass("selected")) return;
        if (OldSelectedRow) {
            $(OldSelectedRow).removeClass("selected");
        }
        $(this).addClass("selected");
        OldSelectedRow = this;

        showUserBookList(this.id);
    })
    .hover(function () {
        $(this).addClass("hover");
    }, function () {
        $(this).removeClass("hover");
    });
}

//显示用户的书
function showUserBookList(userId) {
    $("#dvUserBookList").showLoading();
    $excuteWS("~CourseWS.BookWrapper_listByInstituteUser", { instituteId: $ddlInstitutes.val(), userId: userId, user: SimpleUser }, bindUserBookList, null, null);
}

function bindUserBookList(books) {
    $("#dvUserBookList").hideLoading();
    $tbUserBookList.find("tr:gt(0)").remove();
    if (!books || books.length == 0) {
        $tbUserBookList.append("<tr class='nodata lightblue'><td colspan='2'>未分配书</td></tr>");
        UserBookIds = [];
        return;
    }

    UserBookIds = getBookIds(books);

    var sBuilder = [];
    var rowClass = "";
    $.each(books, function (i) {
        if (i % 2 == 0) {
            rowClass = "class='lightblue'";
        } else {
            rowClass = "";
        }

        sBuilder = [];
        sBuilder.push("<tr id='" + this.id + "'" + rowClass + ">");
        sBuilder.push("<td style='padding-left:10px'>" + this.title + "</td>");
        sBuilder.push("<td style='padding-left:15px; cursor:pointer'><img src='Images/application_delete.png' title='删除' onclick=\"delUserBook('" + this.id + "')\" /></td>");
        sBuilder.push("</tr>");
        $tbUserBookList.append(sBuilder.join(""));
    });
}

function addBooks() {
    if ($ddlInstitutes.val() == -1) {
        $.jBox.info("请选择学院", "提示");
        return;
    }

    if (!$tbUserList.find("tr.selected").get(0)) {
        $.jBox.info("请选择用户", "提示");
        return;
    }

    var $jb = $.jBox(initAddBookBox(), { id: 'jb_addbooks', title: "分配书", width: 580, top: "25%", buttons: { "保存": true, "取消": false }, submit: saveInstituteUserBooks });
    if (InstituteBooks && InstituteBooks.length > 0) {
        bindBookList();
    } else {
        $excuteWS("~CourseWS.getBooksByInstitute", { instituteId: $ddlInstitutes.val(), userExtend: SimpleUser }, function (books) {
            InstituteBooks = (books && books.length > 0) ? books : [];
            bindBookList();
        }, null, null);
    }
}

function initAddBookBox() {
    var sb = [];
    sb.push("<div style='overflow:auto; height:300px; padding:8px'>");
    sb.push("<table id='tbSelBookList' style='width:100%'>");
    sb.push("<tr><th style='text-align:left'>书名</th></tr>");
    sb.push("<tr><td style='text-align:center'><img src='Images/ajax-loader_b.gif' /></td></tr>");
    sb.push("</table>");
    sb.push("</div>");
    return sb.join("");
}

function saveInstituteUserBooks(v, h, f) {
    if (v == true) {
        var selBookIds = h.find("#tbSelBookList input:checked").map(function () {
            return this.id;
        }).get();

        if (selBookIds.length == 0) {
            $.jBox.tip("没有选择书！", 'warning');
            return;
        }

        var instituteId = $ddlInstitutes.val();
        var userId = $tbUserList.find("tr.selected").attr("id");
        $excuteWS("~CourseWS.bookDistributionInstituteUser", { instituteId: instituteId, userId: userId, bookIds: selBookIds, userExtend: SimpleUser }, function (result) {
            showUserBookList(userId);
        }, null, null);
    }
}


function bindBookList() {
    var bookList = excludeSelected();   //得到可选的书
    var sb = [];

    $.each(bookList, function () {
        sb.push("<tr><td><input type='checkbox' id='" + this.id + "' /><label for='" + this.id + "' style='cursor:pointer'>" + this.title + "</label></td></tr>");
    });

    $("#tbSelBookList").find("tr:gt(0)").remove();
    $("#tbSelBookList").append(sb.join(""));
}

//去除已选项目
function excludeSelected() {
    var arr = [];
    $.each(InstituteBooks, function () {
        if ($.inArray(this.id, UserBookIds) == -1) {
            arr.push(this);
        }
    });
    return arr;
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

//删除用户的书
function delUserBook(id) {
    $.jBox.confirm("你确定要删除这条记录吗?", "消息", function (v, h, f) {
        if (v == true) {
            var instituteId = $ddlInstitutes.val();
            var userId = $tbUserList.find("tr.selected").attr("id");
            $excuteWS("~CourseWS.bookRemoveDistributionInstituteUser", { instituteId: instituteId, userId: userId, bookId: id, userExtend: SimpleUser }, function (result) {
                if (result) {
                    showUserBookList(userId);
                } else {
                    $.jBox.tip("删除失败！", 'error');
                }
            }, null, null);
        }
    }, { top: "25%", buttons: { "确定": true, "取消": false } });
}