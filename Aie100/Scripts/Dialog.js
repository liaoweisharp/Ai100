/// <reference path="../JQuery/jquery-1.4.1.js?ver=Acepherics120317" />
///用法：
///1.页面文件引用"String.js","Dialog.js","jquery-1.4.1.js","Dialog.css","Base.css"文件
///2.var dialog=new Dialog();
///3.dialog.show("","");
///4.dialog.dispose();
///5.dialog.hide();
///6.dialog.clear();


function Dialog(width) {
    
    this.dialog_Id = randomStringFun(4);
    this.dialog_contentId = randomStringFun(4);
    this.dialog_titleId = randomStringFun(4);
    this.dialog_closeId = randomStringFun(4);
    this.maskLayer_Id = randomStringFun(4);
    this.dialog_width = width;
    this.dialog_height = "25%";

    $(window).resize(function () {
 
        var dialog = $("#" + this.dialog_Id);
        if (dialog.length != 0 && dialog.is(":visible")) {
            var objW = $(window);
            var width = objW.width();
            //var height = objW.height();
            //            var left = objW.scrollLeft();
            //            var top = objW.scrollTop();
            var curTop = dialog_height;
            var curLeft = (width / 2 - this.dialog_width / 2);
            dialog.css({ "top": curTop, "left": curLeft });
        }
    })
}
Dialog.prototype.show = function (content, title) {

    var mask = $("<div></div>").addClass("mask").attr("id", this.maskLayer_Id); //遮罩层



    mask.show();
    //    .css({ "height": height + scrollMaxY });
    var objW = $(window);
    var width = objW.width();
    var height = objW.height();
//    var left = objW.scrollLeft();
//    var top = objW.scrollTop();
    var curTop = "30%" ;
    var curLeft = (width / 2 - 100);
    var ins = $(this.createDom(content, title)); //对话框
    ins.show()
    .css({"position": "fixed", "top": curTop, "left": curLeft })
    .attr("id", this.dialog_Id);
    //绑定到Dom
    $("#aspnetForm").append(mask);
    $("#aspnetForm").append(ins);



    $("#" + this.dialog_closeId).bind("click", this.hide);

}

Dialog.prototype.hide = function () {
    
    $("#" + this.dialog_Id).hide();//对话框
    $(".mask").hide();//遮罩层
} 
Dialog.prototype.clear=function(){
    $("#" + this.dialog_contentId).empty();
    $("#" + this.dialog_titleId).empty();
}
Dialog.prototype.dispose = function () {
    
    $("#" + this.dialog_Id).remove();
    $("#" + this.maskLayer_Id).remove();
}
Dialog.prototype.createDom = function (content, title) {
    var str = new Array();
    str.push("<div class='Dialog'>");
    str.push("<div class='dialog_box shadow' style='width:" + this.dialog_width + "px'>");
    str.push("<ul>");
    str.push("<p id=" + this.dialog_titleId + " class='title'>");
    str.push(title);
    str.push("</p>");
 
    str.push("</ul>");
    str.push("<div id=" + this.dialog_contentId + " class='dialog_cont' style='width:" + this.dialog_width + "px'>");
    str.push(content);
  
    str.push("</div>");
    str.push("</div>");
    str.push("</div>");

    var obj = str.join("");
    return obj;
}


function Dialog_ForButton(width) {
    
    this.dialog_Id = randomStringFun(4);
    this.dialog_contentId = randomStringFun(4);
    this.dialog_titleId = randomStringFun(4);
    this.dialog_closeId = randomStringFun(4);
    this.maskLayer_Id = randomStringFun(4);
    this.dialog_width = width;
    this.dialog_height = "20%";

    $(window).resize(function () {
        
        var dialog = $("#" + this.dialog_Id);
        if (dialog.length != 0 && dialog.is(":visible")) {
            var objW = $(window);
            var width = objW.width();
            //var height = objW.height();
            //            var left = objW.scrollLeft();
            //            var top = objW.scrollTop();
            var curTop = this.dialog_height;
            var curLeft = (width / 2 - this.dialog_width/2);
            dialog.css({ "top": curTop, "left": curLeft });
        }
    })

}
Dialog_ForButton.prototype.show = function (content, title, comfirmText, comfirmFun, parsOfJson) {

    /// <summary>显示Dialog</summary>
    /// <param name="content" type="String">Dialog的文本内容</param>
    /// <param name="title" type="String">Dialog的Title</param>
    /// <param name="comfirmText" type="String">button的value值</param>
    /// <param name="comfirmFun" type="String">onclick事件响应函数</param>
    /// <param name="parsOfJson" type="Object">comfirmFun的onclick事件响应函数的参数</param>

    var mask = $("<div></div>").addClass("mask").attr("id", this.maskLayer_Id); //遮罩层
    mask.show();

    var objW = $(window);
    var width = objW.width();
    var height = objW.height();

    var curTop = "25%"; // (height / 2 - this.dialog_height / 2);
    var curLeft = (width / 2 - this.dialog_width / 2);
    var ins = $(this.createDom(content, title)); //对话框

    ins.show()
    .css({ "position": "fixed", "top": curTop, "left": curLeft })
    .attr("id", this.dialog_Id);
    //绑定到Dom
    $("body").append(mask);
    $("body").append(ins);


    if (typeof arguments[4] == "undefined" || parsOfJson == null || parsOfJson == "") {
        parsOfJson = {};
    }
    this.dialog_height
    var $ul= $("ul[name='Dialog_Comfirm']", ".Dialog");
    $ul.bind("click", parsOfJson, comfirmFun);

    $ul.find("li[class='mid']").html(comfirmText);


    $("#" + this.dialog_closeId).bind("click", this.hide);

}

Dialog_ForButton.prototype.createDom = function (content, title) {
    var str = new Array();
    str.push("<div class='Dialog'>");
    str.push("<div class='dialog_box shadow' style='width:" + this.dialog_width + "px'>");
    str.push("<ul>");
    str.push("<p id=" + this.dialog_titleId + " class='title'>");
    str.push(title);
    str.push("</p>");
    str.push(String.format("<p class='dialog_clo'><a onclick=\"dialog_clickCancel('{0}','{1}')\"><img class='pointer' src='../Images/close2.gif' width='16' height='16' /></a></p>", this.dialog_Id, this.maskLayer_Id));
    str.push("</ul>");
    str.push("<div id=" + this.dialog_contentId + " class='dialog_cont' style='width:" + this.dialog_width + "px'>");
    str.push(content);
    str.push("<div class='dialog_botbg'>");
    //str.push("<input name='Dialog_Comfirm' type='button' />");

    str.push("<ul class='Bt_Small' name='Dialog_Comfirm' >");
    str.push("<li class='left' style='margin-left:32%;'></li>");
    str.push("<li class='mid'></li>");
    str.push("<li class='right'></li>");
    str.push("</ul>");
    
    //str.push(String.format("<input name='input' type='button'  value='取消' onclick=\"dialog_clickCancel('{0}','{1}')\" />", this.dialog_Id, this.maskLayer_Id));
    str.push(String.format("<ul class='Bt_Small'  onclick=\"dialog_clickCancel('{0}','{1}')\">", this.dialog_Id, this.maskLayer_Id));
    str.push("<li class='left'></li>");
    str.push("<li class='mid'>取消</li>");
    str.push("<li class='right'></li>");
    str.push("</ul>");

    str.push("</div>");
    str.push("</div>");
    str.push("</div>");
    str.push("</div>");

    var obj = str.join("");
    return obj;
}


Dialog_ForButton.prototype.hide = function () {

    $("#" + this.dialog_Id).hide(); //对话框
    $("#" + this.maskLayer_Id).hide(); //遮罩层
}
Dialog_ForButton.prototype.clear = function () {
    $("#" + this.dialog_contentId).empty();
    $("#" + this.dialog_titleId).empty();
}
Dialog_ForButton.prototype.dispose = function () {
    $("#" + this.dialog_Id).remove();
    $("#" + this.maskLayer_Id).remove();
}


//for close
function Dialog_ForClose(width) {
    
    this.dialog_Id = randomStringFun(4);
    this.dialog_contentId = randomStringFun(4);
    this.dialog_titleId = randomStringFun(4);
    this.dialog_closeId = randomStringFun(4);
    this.maskLayer_Id = randomStringFun(4);
    this.dialog_width = width;
    this.dialog_height = "20%";

    $(window).resize(function () {
        
        var dialog = $("#" + this.dialog_Id);
        if (dialog.length != 0 && dialog.is(":visible")) {
            var objW = $(window);
            var width = objW.width();
 
            var curTop = this.dialog_height;
            var curLeft = (width / 2 - this.dialog_width / 2);
            dialog.css({ "top": curTop, "left": curLeft });
        }
    })

}
Dialog_ForClose.prototype.show = function (content, title) {
   
    var mask = $("<div></div>").addClass("mask").attr("id",this.maskLayer_Id); //遮罩层
    mask.show();

    var objW = $(window);
    var width = objW.width();
    var height = objW.height();

    var curTop = "25%"; // (height / 2 - this.dialog_height / 2);
    var curLeft = (width / 2 - this.dialog_width / 2);
    var ins = $(this.createDom(content, title)); //对话框

    ins.show()
    .css({ "position": "fixed", "top": curTop, "left": curLeft })
    .attr("id", this.dialog_Id);
    //绑定到Dom
    $("body").append(mask);
    $("body").append(ins);

    $("#" + this.dialog_closeId).bind("click", this.hide);

}


//替换Content
Dialog_ForClose.prototype.replaceContent = function (content) {

    $("#" + this.dialog_contentId).html(content);

}
Dialog_ForClose.prototype.replaceTitle = function (title) {

    $("#" + this.dialog_titleId).html(title);

}
Dialog_ForClose.prototype.createDom = function (content, title) {
    var str = new Array();
    str.push("<div class='Dialog'>");
    str.push("<div class='dialog_box shadow' style='width:" + this.dialog_width + "px'>");
    str.push("<ul>");
    str.push("<p id=" + this.dialog_titleId + " class='title'>");
    str.push(title);
    str.push("</p>");
    str.push(String.format("<p class='dialog_clo'><a onclick=\"dialog_clickCancel('{0}','{1}')\"><img class='pointer' src='../Images/close2.gif' width='16' height='16' /></a></p>", this.dialog_Id, this.maskLayer_Id));
    str.push("</ul>");
    str.push("<div id=" + this.dialog_contentId + " class='dialog_cont' style='width:" + this.dialog_width + "px'>");
    str.push(content);

    str.push("</div>");
    str.push("</div>");
    str.push("</div>");

    var obj = str.join("");
    return obj;
}
function dialog_clickCancel(dialogId,maskLayerId) {

    $("#" + dialogId).remove();
    $("#" + maskLayerId).remove();
}

Dialog_ForClose.prototype.hide = function () {

    $("#" + this.dialog_Id).hide(); //对话框
    $("#" + this.maskLayer_Id).hide(); //遮罩层
}
Dialog_ForClose.prototype.clear = function () {
    
    $("#" + this.dialog_contentId).empty();
    $("#" + this.dialog_titleId).empty();
}
Dialog_ForClose.prototype.dispose = function () {
    $("#" + this.dialog_Id).remove();
    $("#" + this.maskLayer_Id).remove();
}