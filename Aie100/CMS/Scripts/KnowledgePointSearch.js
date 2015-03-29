/// <reference path="../../Scripts/jquery-1.4.1.min.js" />

/*
* 知识点高级查找
*/

function KnowledgePointSearch(options) {
    var defaults = {
        data: {
            bookId: "",
            simpleUser: null
        },
        showMode: 0,        //显示模式(0:嵌入, 1:弹出窗口)
        containerId: "",    //当showMode=0时的父容器Id
        callback: null
    };

    this.options = $.extend(defaults, options);
    this.container = null;
}

KnowledgePointSearch.prototype.Show = function () {
    if (this.options.showMode == 0) {
        this.container = $("#" + this.options.containerId);
        if (!this.container.find("#dvKnowledgePointSearch").get(0)) {
            this.container.empty()
                .html(this.initUI())
                .find("#dvKnowledgePointSearch").data("_options", this.options);
            this.initUIData();
        } else {
            this.container.find("#dvKnowledgePointSearch").data("_options", this.options);
        }
        this.container.slideDown();
    } else {
        this.container = $.jBox(this.initUI(), { title: "知识点查询", width: 622, buttons: { '确定': true, '取消': false }, submit: function (v, h, f) {
            if (v == true) {
                knowledgePointSearch_Search(h.find("#dvKnowledgePointSearch"));
            }
        }
        });
        this.container.find("#dvSearchCmdBar").hide();
        this.container.find("#dvKnowledgePointSearch").data("_options", this.options);
        this.initUIData();
    }
}

KnowledgePointSearch.prototype.initUI = function () {
    var sBuilder = new Array();
    sBuilder.push("<div id='dvKnowledgePointSearch' style='border:0px solid #f00; padding:10px'>");
    sBuilder.push("    <table border='0' style='width:600px;'>");
    sBuilder.push("        <tr><td width='60'>知识点:</td>");
    sBuilder.push("            <td><input id='txtKpName' type='text' style='width:500px' /></td></tr>");
    sBuilder.push("        <tr><td>描述:</td>");
    sBuilder.push("            <td><textarea id='txtKpDescription' rows='2' cols='50' style='width:500px'></textarea></td></tr>");
    sBuilder.push("    </table>");
    sBuilder.push("    <div id='dvSearchCmdBar' style='border-top:1px solid #ddd; margin:6px 0px; padding:6px 0px; text-align:left '>");
    sBuilder.push("        <input id='btnSearch' type='button' value='确定' />&nbsp;<input id='btnClose' type='button' value='取消' /></div>");
    sBuilder.push("</div>");
    return sBuilder.join("");
}

KnowledgePointSearch.prototype.initUIData = function () {
    var container = this.container;

    this.container.find("#btnSearch").click(function () {
        knowledgePointSearch_Search(container.find("#dvKnowledgePointSearch"));
    });

    this.container.find("#btnClose").click(function () {
        container.slideUp();
    });
}

function knowledgePointSearch_Search(f) {
    var name = "";
    var description = ""
    var _options = f.data("_options");
    
    name = f.find("#txtKpName").val();
    description = f.find("#txtKpDescription").val();

    $get(imgLoadingId).style.display = "block";

    $excuteWS("~CmsWS.getLoIdsByCondition",
        {
            name: name, description: description, bookId: _options.data.bookId, userExtend: _options.data.simpleUser
        },
        function (result) {
            $get(imgLoadingId).style.display = "none";
            if (_options.showMode == 0) {
                $("#" + _options.containerId).hide();
            }
            _options.callback(result);
        },
    null, null);
}