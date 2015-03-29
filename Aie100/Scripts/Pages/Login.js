/// <reference path="../comm.js" />

$(function () {
    if ($.browser.msie) {
        if ($.browser.version != "10.0") {
            $("#txtUserName").attr("watermark", "邮箱");
            $("#txtPassWord").attr("watermark", "密码");
        }
    }
    var $btnSignIn = $("#btnSignIn");
    $btnSignIn.click(function () {
        onBtnSignInClick($btnSignIn);
    });
    var args = new Object();
    args = getUrlParms();
    var uid = args["uid"];
    if (uid) {
        //来自QQ“绑定”
        $("#hidQQuserId").attr("value", uid);
    }
    else if (typeof (args["u"]) != "undefined" && typeof (args["p"]) != "undefined") {
        //来自QQ“注册”
        $("#txtUserName").val(args["u"]);
        $("#txtPassWord").val(args["p"]);
        $btnSignIn.trigger("click");
    }
    //有UserName则把它绑定上去
    userName = decodeURI(args["userName"]);
    if (userName != null && userName != "undefined") {
        $("#txtUserName").val(userName);
    }
    
    //结束
    

    $("#txtUserName").keydown(function (e) {
        if (e.which == 13) {
            $("#txtPassWord").focus();
        }
    });

    $("#txtPassWord").keydown(function (e) {
        if (e.which == 13) {
            // $("#btnSignIn").trigger("click");
            onBtnSignInClick($btnSignIn);
        }
    });

    $(".xxk_box .xxk_tit_bg ul").bind("mouseover", selMiddleTitle_click);
    $(".rightmenu_box").bind("click", selRightTitle_click);
    //    $(".slideBox").slideshow({
    //        pauseSeconds: 5,
    //        width: 981,
    //        height: 292,
    //        caption: false
    //    });
    jQuery("#focusPicture").slide({ mainCell: ".bdd ul", autoPlay: true, interTime: 5000, delayTime: 1000 });
    // setDefaultHeight();
    var $selectcard = $(".selectcard");
    var $pictureNow = $("#pictureNow");
    //    $("#firstSelect").mouseover(function () {
    //        $selectcard.attr("src", "Images/unPickOn.png");
    //        $(this).attr("src", "Images/PickOn.png");
    //        $pictureNow.attr("src", "Images/focus1.png")
    //    });
    //    $("#secondSelect").mouseover(function () {
    //        $selectcard.attr("src", "Images/unPickOn.png");
    //        $(this).attr("src", "Images/PickOn.png");
    //        $pictureNow.attr("src", "Images/focus2.png")
    //    });
    //    $("#thirdSelect").mouseover(function () {
    //        $selectcard.attr("src", "Images/unPickOn.png");
    //        $(this).attr("src", "Images/PickOn.png");
    //        $pictureNow.attr("src", "Images/focus3.png")
    //    })

    var qqUserId= $("#hidQQuserId").attr("value");
    if(qqUserId){
        signInClickByQQ(qqUserId);
    }
})

function onBtnSignInClick($o) {
    var userName = $("#txtUserName").val();
    var password = $("#txtPassWord").val();
    if ($.trim(userName) == "") {
        $.jBox.info("账号必须填写.", "提示");
        return;
    }

    if ($.trim(password) == "") {
        $.jBox.info("必须输入密码.", "提示");
        return;
    }

    //        if ($.trim(password).length < 6) {
    //            $.jBox.info("Password can not less than six-digit.","Message");
    //            //return;
    //        }
    showLoaderImage(true);
    
    $excuteWS2("LoginWS.checkUserLogin", { userName: userName, password: password }, function () {
        $o.css("disabled", "disabled");
    }, onLoginPageSuccessed, onLoginPageFailed, function () {
        $o.removeAttr("disabled");
    }, "checkUserLogin");
}

//QQ登陆
function signInClickByQQ(uId) {
    $excuteWS2("LoginWS.checkUserLoginByQQ", { uId: uId }, function () {
    }, onLoginPageSuccessed, function (result) {
        alert(result)
    }, function () {

    }, "checkUserLogin");
}

//显示或隐藏登录时的加载图片
function showLoaderImage(flag) {
    if (flag) {
        $("#imgLoginLoader").css("visibility", "visible");
    } else {
        $("#imgLoginLoader").css("visibility", "hidden");
    }
}

//成功回调函数
function onLoginPageSuccessed(result, context) {
    if (context == "checkUserLogin") {
        if (result == -1 || result == null) {
            showLoaderImage(false);
            $.jBox.error("登陆失败! 请检查你的账号和密码是否正确!", "提示");
        } else if (result == 0 || result == 1) {
            //location.href = "Course/MyCourse.aspx";
            $("#hidIsChecked").val("true");
            $("#btnSubmit").click();
        } else if (result == -2) {
            showLoaderImage(false);
            $.jBox.info("你的账号正在审核中，请等待！", "提示");
        } else if (result == 2) {
            location.href = "CMS/HomePage.aspx";
            //location.href = "CMS/HomePage_New.aspx";
        }
    }
}

//失败回调函数
function onLoginPageFailed(error, context) {
    showLoaderImage(false);
    //$.jBox.error(error.responseText, "Message");
    $.jBox.error($.parseJSON(error.response).Message, "Message");
}

function selMiddleTitle_click() {
    if (this.className == "xxk_tit_nor") {
        $(".xxk_tit_sel").removeClass().addClass("xxk_tit_nor");
        $(this).removeClass().addClass("xxk_tit_sel");

        var $dvMiddleBox = $("#dvMiddleBox");
        var $dvMiddleContent = $dvMiddleBox.children("div");

        //隐藏全部选项卡内容
        $dvMiddleContent.hide();

        //显示当前选项卡内容
        if (this.id == "ulMid_1") { $("#dvMiddle_1").show(); }
        else if (this.id == "ulMid_2") { $("#dvMiddle_2").show(); }
        else if (this.id == "ulMid_3") { $("#dvMiddle_3").show(); }
        else if (this.id == "ulMid_4") { $("#dvMiddle_4").show(); }


        //setDefaultHeight();
    }
}


//设置内容的默认显示高度
function setDefaultHeight() {
    var $dvMiddleBox = $("#dvMiddleBox");
    var $dvMiddleContent = $dvMiddleBox.children("div");
    var minHeight = 260;
    var contextHeight = ($dvMiddleContent.height() < minHeight) ? minHeight : $dvMiddleContent.height();
    if ($dvMiddleContent.css("display") == "none") {
        $dvMiddleBox.height(minHeight);
    } else {
        $dvMiddleBox.height(contextHeight);
    }
}

function selRightTitle_click() {
    if ($(this).attr("expanded")) {
        if ($(this).attr("expanded") == "false") {
            var $downObj = $(".rightmenu_box ul[expanded='true']")
            $downObj.next().slideUp(300);
            $downObj.attr("expanded", "false");

            $(this).next().slideDown(300);
            $(this).attr("expanded", "true");
        }
    }
}

function getKeyCode(evt) { if (typeof (evt) == 'string') return evt.charCodeAt(0); return document.all ? event.keyCode : (evt && evt.which) ? evt.which : 0; }
function SAASkeyDown(event) { if (getKeyCode(event) == 13) { return false; } }
function clickMore(node) {
    var $divMore = $("#div_moreContent");
    if ($divMore.css("display") == "none") {
        $divMore.slideDown(1500);
        $("#div_more").find("a").eq(0)
        .css("background-image", "url(Images/up.png)")
        .text("shrink");
    }
    else {
        $divMore.slideUp(1500);
        $("#div_more").find("a").eq(0)
        .css("background-image", "url(Images/down.png)")
        .text("more");
    }
}
function click_How() {
    var html = $("#about").html();
    $.jBox(html, { title: '关于我们', buttons: {}, width: 700, height: 600 })
}
