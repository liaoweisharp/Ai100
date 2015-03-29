/// <reference path="../../Scripts/jquery-1.4.1.min.js" />

var AuthorArray = [];

function PageLoad() {
    InitCmsMenu("m_Author");
    loadAuthorList();
    $("#cms_toolbar #btnAdd").click(function () {
        editAuthor();
    });
}

function loadAuthorList() {
    var $contentbox = $(".cms_contentbox");
    $contentbox.showLoading();
    $excuteWS("~CmsWS.getAuthorList", { userExtend: SimpleUser }, bindAuthorList, null, { contentbox: $contentbox });
}

function bindAuthorList(result, context) {
    var $contentbox = context.contentbox;
    var $dataTable = $contentbox.find(".cms_datatable");

    $contentbox.hideLoading();
    $dataTable.find("tr:gt(0)").remove();
    if (!result || result.length == 0) {
        $dataTable.append("<tr class='nodata lightblue'><td colspan='4'>无记录</td></tr>");
        return;
    } else {
        AuthorArray = result;
    }

    var sBuilder = [];
    var rowClass = "";
    $.each(result, function (i) {
        if (i % 2 == 0) {
            rowClass = "class='lightblue'";
        } else {
            rowClass = "";
        }

        sBuilder = [];
        sBuilder.push("<tr id='" + this.id + "' " + rowClass + ">");
        sBuilder.push("<td>" + this.authorName + "</td>");
        sBuilder.push("<td>" + this.tel + "</td>");
        sBuilder.push("<td>" + this.address + "</td>");
        sBuilder.push("<td class='operate'><img src='Images/application_edit.png' title='编辑' onclick=\"editAuthor('" + this.id + "')\" />&nbsp;<img src='Images/application_delete.png' title='删除' onclick=\"deleteAuthor('" + this.id + "')\" /></td>");
        sBuilder.push("</tr>");
        $dataTable.append(sBuilder.join(''));
    });

    $dataTable.find("tr:gt(0)").hover(function () {
        $(this).addClass("hover");
    }, function () {
        $(this).removeClass("hover");
    });
}

function initAuthorBox() {
    var sBuilder = new Array();
    sBuilder.push("<div id='cms_dialog_author' class='cms_dialog'>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp;作者名称：</li>");
    sBuilder.push("    <li class='inp'><input id='txtAuthorName' name='txtAuthorName' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'>昵称：</li>");
    sBuilder.push("    <li class='inp'><input id='txtNickName' name='txtNickName' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'>电话：</li>");
    sBuilder.push("    <li class='inp'><input id='txtTel' name='txtTel' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'>地址：</li>");
    sBuilder.push("    <li class='inp'><input id='txtAddress' name='txtAddress' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'>描述：</li>");
    sBuilder.push("    <li class='inp'><textarea id='txtAuthorDescription' name='txtAuthorDescription' style='width:100%; height:100px'></textarea></li>");
    sBuilder.push("</ul>");
    sBuilder.push("</div>");
    return sBuilder.join(""); 
}

function editAuthor(id) {
    var title = "";
    var _id = "";
    if (id) {
        title = "编辑作者";
        _id = id;
    } else {
        title = "添加作者";
        _id = "";
    }

    var $jb = $.jBox(initAuthorBox(), { id: 'jb_cmsAuthor', title: title, width: 580, top: "25%", buttons: { "保存": true, "取消": false }, submit: submitAuthor });
    var $author = $jb.find("#cms_dialog_author");
    $author.data("_id", _id);
    if (id) {
        var author = getAuthorObj(id);
        $author.find("#txtAuthorName").val(author.authorName);
        $author.find("#txtNickName").val(author.authorNickName);
        $author.find("#txtTel").val(author.tel);
        $author.find("#txtAddress").val(author.address);
        $author.find("#txtAuthorDescription").val(author.authorDescription);
    }
}

function submitAuthor(v, h, f) {
    if (v == true) {
        var validData = validateForm(f);
        if (validData.isValid == false) {
            $.jBox.tip(validData.msg, 'warning');
            return false;
        }
        var authorWrapper = getAuthor(f);
        var authorId = h.find("#cms_dialog_author").data("_id");
        if (authorId != "") {
            authorWrapper.id = authorId;
            $excuteWS("~CmsWS.editAuthor", { authorW: authorWrapper, userExtend: SimpleUser }, onEditAuthor, null, null);
        } else {
            $excuteWS("~CmsWS.saveAuthor", { authorW: authorWrapper, userExtend: SimpleUser }, onSaveAuthor, null, null);
        }
        return false;
    }
}

function getAuthorObj(id) {
    var author = null;
    for (var i = 0; i < AuthorArray.length; i++) {
        if (AuthorArray[i].id == id) {
            author = AuthorArray[i];
            break;
        }
    }
    return author;
}

function validateForm(f) {
    var validData = { isValid: true, msg: "" };
    if (f.txtAuthorName.trim() == "") {
        validData.isValid = false;
        validData.msg = "作者名称不能为空！";
    }
    return validData;
}

function getAuthor(f) {
    var author = {};
    author.authorName = f.txtAuthorName.trim();
    author.authorNickName = f.txtNickName.trim();
    author.tel = f.txtTel.trim();
    author.address = f.txtAddress.trim();
    author.authorDescription = f.txtAuthorDescription.trim();
    return author;
}

function onSaveAuthor(result) {
    var author = result;
    if (!author) {
        $.jBox.tip("保存失败！", 'error');
    } else {
        $.jBox.close('jb_cmsAuthor');
        AuthorArray.push(author);

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
        sBuilder.push("<tr id='" + author.id + "' " + rowClass + ">");
        sBuilder.push("<td>" + author.authorName + "</td>");
        sBuilder.push("<td>" + author.tel + "</td>");
        sBuilder.push("<td>" + author.address + "</td>");
        sBuilder.push("<td class='operate'><img src='Images/application_edit.png' title='编辑' onclick=\"editAuthor('" + author.id + "')\" />&nbsp;<img src='Images/application_delete.png' title='删除' onclick=\"deleteAuthor('" + author.id + "')\" /></td>");
        sBuilder.push("</tr>");
        $dataTable.append(sBuilder.join(''));
        $dataTable.find("tr:last").hover(function () {
            $(this).addClass("hover");
        }, function () {
            $(this).removeClass("hover");
        });
    }
}

function onEditAuthor(result) {
    var author = result;
    if (!author) {
        $.jBox.tip("更新失败！", 'error');
    } else {
        $.jBox.close('jb_cmsAuthor');
        loadAuthorList();
    }
}

function deleteAuthor(id) {
    var author = getAuthorObj(id);
    $.jBox.confirm("你确定要删除作者“" + author.authorName + "”吗?", "提示", function (v, h, f) {
        if (v == true) {
            $excuteWS("~CmsWS.deleteAuthor", { authorW: { id: id }, userExtend: SimpleUser }, function (result) {
                if (result) {
                    loadAuthorList();
                } else {
                    $.jBox.tip("删除失败！", 'error');
                }
            }, null, null);
        }
    }, { top: "25%", buttons: { "确定": true, "取消": false} });
}