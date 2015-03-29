/// <reference path="../JQuery/jquery-1.4.1.min.js" />

function ContentEditHistory(options) {
    var defaults = {
        bookId: "",
        contentId: "",      //审核对象Id
        contentType: "",    //审核对象类型(0:题, 2:知识点, 3:学习资料)
        simpleUser: null
    };
    this.options = $.extend(defaults, options);
}

ContentEditHistory.prototype.Show = function () {
    var sBuilder = new Array();
    sBuilder.push("<div id='cms_EditHistory' style='padding:10px'>");
    sBuilder.push("<div style='overflow-y:auto; height:300px; border:1px solid #BED7F5'>");
    sBuilder.push(" <table id='tbEditHistory' class='cms_datatable'>");
    sBuilder.push("     <tr><th width='175'>时间</th><th width='66'>操作</th><th>用户</th><th>描述</th></tr>");
    sBuilder.push("     <tr class='loader'><td colspan='4' style='height:30px; text-align:center'><img src='../Images/ajax-loader_b.gif' /></td></tr>");
    sBuilder.push(" </table>");
    sBuilder.push("</div>");
    sBuilder.push("</div>");
    var $jb = $.jBox(sBuilder.join(""), { id: 'jb_audit', title: "编辑历史", width: 800, top: "25%", buttons: { "关闭": true} });
    var $editHistory = $jb.find("#cms_EditHistory");
    $excuteWS("~CmsWS.getContentEditHistory",
        { contentId: this.options.contentId, contentType: this.options.contentType, bookId: this.options.bookId, userExtend: this.options.simpleUser },
        bindEditHistory, null, $editHistory.find("#tbEditHistory"));
}

function bindEditHistory(result, $dataTable) {
    $dataTable.find("tr.loader").remove();
    var editHistories = result[0];
    if (!editHistories || editHistories.length == 0) {
        $dataTable.append("<tr class='nodata lightblue'><td colspan='4'>无历史记录</td></tr>");
        return;
    } else {
        AddUserInfoToList(editHistories, result[1]);
    }

    var editDate = "";
    var userName = "";
    var operationTypeName = "";
    var suggestion = "";
    
    $.each(editHistories, function (i) {
        if (i % 2 == 0) {
            rowClass = "class='lightblue'";
        } else {
            rowClass = "";
        }

        editDate = jDateFormat(this.editDate);

        if (this.userName) {
            userName = this.userName;
        } else {
            userName = "";
        }
        operationTypeName = getOperationTypeName(this.operationType);
        suggestion = (this.suggestion) ? this.suggestion : "";

        sBuilder = [];
        sBuilder.push("<tr id='" + this.id + "' " + rowClass + ">");
        sBuilder.push("<td>" + editDate + "</td>");
        sBuilder.push("<td>" + operationTypeName + "</td>");
        sBuilder.push("<td>" + userName + "</td>");
        sBuilder.push("<td>" + suggestion + "</td>");
        sBuilder.push("</tr>");
        $dataTable.append(sBuilder.join(''));
    });
}

function AddUserInfoToList(list, users) {
    for (var i = 0; i < list.length; i++) {
        for (j = 0; j < users.length; j++) {
            if (list[i].userId == users[j].id) {
                list[i].userName = users[j].fullName;
                break;
            }
        }
    }
}

//编辑操作的类型
var EnumOperationType = {
    Edit: "1",
    Suggestion: "2",
    Audit: "3"
};
function getOperationTypeName(operationType) {
    var name = "";
    switch (operationType) {
        case EnumOperationType.Edit:
            name = "编辑";
            break;
        case EnumOperationType.Suggestion:
            name = "建议";
            break;
        case EnumOperationType.Audit:
            name = "审核";
            break;
    }
    return name;
}