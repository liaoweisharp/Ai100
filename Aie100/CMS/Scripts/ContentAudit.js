/// <reference path="../JQuery/jquery-1.4.1.min.js" />

function ContentAudit(options) {
    var defaults = {
        bookId: "",
        contentId: "",      //审核对象Id
        contentType: "",    //审核对象类型(0:题, 2:知识点, 3:学习资料)
        simpleUser: null,
        callback: null      //成功回调函数
    };
    this.options = $.extend(defaults, options);
}

ContentAudit.prototype.Show = function () {
    var sBuilder = new Array();
    sBuilder.push("<div id='cms_dialog_audit' class='cms_dialog'>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'>操作：</li>");
    sBuilder.push("    <li class='inp'><select id='ddlOperationType' name='ddlOperationType' style='width:100%'><option value='2'>建议</option><option value='3'>审核</option></select></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'>描述：</li>");
    sBuilder.push("    <li class='inp'><textarea id='txtSuggestion' name='txtSuggestion' style='width:100%; height:100px'></textarea></li>");
    sBuilder.push("</ul>");
    sBuilder.push("</div>");
    var $jb = $.jBox(sBuilder.join(""), { id: 'jb_audit', title: "审核建议", width: 580, top: "25%", buttons: { "保存": true, "取消": false }, submit: submitContentAudit });
    var $audit = $jb.find("#cms_dialog_audit");
    $audit.data("_AuditItem", this.options);
}


function submitContentAudit(v, h, f) {
    if (v == true) {
        var o = h.find("#cms_dialog_audit").data("_AuditItem");
        var param = {
            bookId: o.bookId,
            contentId: o.contentId,
            contentType: o.contentType,
            userId: o.simpleUser.userId,
            operationType: f.ddlOperationType,  //操作类型(1:编辑, 2:建议, 3:审核)
            suggestion: f.txtSuggestion         //审核建议
        };
        $excuteWS("~CmsWS.editContentEditHistory", { contentEditHistoryW: param, userExtend: o.simpleUser }, function (result) {
            if (result) {
                $.jBox.tip('保存成功.', 'success');
                $.jBox.close('jb_audit');
                if (o.callback) {
                    o.callback();
                }
            } else {
                $.jBox.tip("保存失败！", 'error');
            }
        }, null, null);
        return false;
    }
}