/// <reference path="../JQuery/jquery.ajax.js?ver=Acepherics120317" />
/// <reference path="../JQuery/jquery-1.4.1-vsdoc.js?ver=Acepherics120317" />


//调用SimpleUser的方式
/*
一：只传递函数（默认已经指定了从地址栏获得的userId和sectionId参数信息，并指定了默认路径"~"）
    U(function(){
        alert(this.simpleUser.userId);
    });
    或
    SimpleUser(function(){
        alert(this.simpleUser.userId);
    });
二：传递详细参数（需要指定路径和userId或sectionId的情况时，必须指定详细参数信息）
    U({path:"~", userId:"userId", sectionId:"sectionId",complete:function()
    {
        alert(this.simpleUser.userId);
    }});
    或
    SimpleUser({path:"~", userId:"userId", sectionId:"sectionId",complete:function()
    {
        alert(this.simpleUser.userId);
    }});

    
*/
var RealUserExtend = { };
function SimpleUser(data) {
    /// <summary>data:{path:"~", userId:"userId", sectionId:"sectionId",complete:function(){}}或data:function(){}</summary>
    //$(document.body).hide();
    
    if (typeof data == "function" && arguments.length == 1) {
        data = { complete: data };
    }
    if (!data) {
        data = {};
    }

    if (!data.path) {
        data.path = "~";
    }

    if (SimpleUser.user) {
        data.simpleUser = SimpleUser.user;
        if (typeof data.complete == "function") {
            (data.complete)();
        }
        return;
    }
    
    if (!data.sectionId) {
        var param = new Object();
        var query = location.search.substring(1);   
        var pairs = query.split("&"); 
        for (var i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf('=');  
            if (pos == -1) continue; 
            var argname = pairs[i].substring(0, pos);    
            var value = pairs[i].substring(pos + 1);    
            param[argname] = unescape(value);    
        }
        
        data.userId = param["userId"] && param["userId"]!="" ? param["userId"] : null;
        data.sectionId = param["sectionId"] && param["sectionId"]!="" ? param["sectionId"] : null;
    }

    //if (!data.userId && !data.sectionId) {
    //    return;
    //}
    var o = this;
    var methodStr = data.userId != null ? "UsersWS.Users_getSimpleUserByUserSectionId" : "UsersWS.Users_getSimpleUserBySectionId";
    var mdata = data.userId != null ? {userId:data.userId, sectionId: data.sectionId } : { sectionId: data.sectionId };
    //$excuteWS(data.path + "UsersWS.Users_getSimpleUserBySectionId", { sectionId: data.sectionId },
    
    $excuteWS(data.path + methodStr, mdata,
        function (r, context) {
            // $(document.body).show();
            
            o = r;
            if (o != null) {
                delete o.__type;
                if (o.realUserExtend) {
                    RealUserExtend = o.realUserExtend;
                    delete o.realUserExtend;
                }
               
            } else {
               // $createReLoginBoxControl();
                o = {};
            }
            SimpleUser.user = o;
            data.simpleUser = o;
            if (typeof data.complete == "function") {
                (data.complete)();
            }
        }, null, { context: "SimpleUser" });
   
}

function U(data) {
    /// <summary>data:{path:"~", userId:"userId", sectionId:"sectionId",complete:function(){}}或data:function(){}</summary>
    SimpleUser(data);
}

function $reloginEmathSystem() {
    var $_imgLoading = $("#_DivReloginBox_ImgLoading", "#_DivReloginBox");
    var $_userName = $("#_DivReloginBox_TxtUserName", "#_DivReloginBox").val();
    var $_passWord = $("#_DivReloginBox_TxtPassWord", "#_DivReloginBox").val();
    var $_pUserId = null;
    var $_pSectionId = null;
    $_imgLoading.css("visibility", "visible");
    if ($.trim($_userName) == "") {
        alert("请输入用户名");
        $_imgLoading.css("visibility", "hidden");
        return;
    }

    if ($.trim($_passWord) == "") {
        alert("必须输入密码");
        $_imgLoading.css("visibility", "hidden");
        return;
    }

    // var $ws_method = "LoginWS.checkUserLogin";
    var $ws_method = "LoginWS.reLoginSystem";
    var $initFlag = false; //是否为页面初始加载，默认为否（即非页面初始加载，而是页面已经加载完毕后调用webservice时session过期弹出的登陆框）
    var $ws_path = "~";
    if ($fun_params != null && $fun_params.length != 0) {
        var _method = $fun_params[0].method;
        var _index = _method.lastIndexOf("~");
        $ws_path = _index != -1 ? _method.substring(0, _index + 1) : "";
    } else {
        $initFlag = true;
        if (typeof window.$webservice_path != "undefined" && window.$webservice_path != null) {
            $ws_path = window.$webservice_path;
        }
    }
    var $_urlParams = GetUrlParms();
    if ($_urlParams["userId"]) {
        $_pUserId = $_urlParams["userId"];
    }
    if ($_urlParams["sectionId"]) {
        $_pSectionId = $_urlParams["sectionId"];
    }

    $ws_method = $ws_path + $ws_method;
    $excuteWS2($ws_method,
        { userName: $_userName, passWord: $_passWord, p_userId: $_pUserId, p_sectionId: $_pSectionId }, null,
        function (result, context) {
            if (result == -1) {
                alert("登陆失败! 请检查你有账号和密码!");
            } else if (result == 0 || result == 1 || result == 2) {
                if ($initFlag) {
                    window.location.reload();
                } else {
                    $_DivReloginBox.hide();
                    for (var i = 0; i < $fun_params.length; i++) {
                        $excuteWS2($fun_params[i].method, $fun_params[i].data, $fun_params[i].beforeSendFun, $fun_params[i].successFun, $fun_params[i].errorFun, $fun_params[i].completeFun, $fun_params[i].context);
                    }
                    $fun_params = new Array();
                }
            } else if (result == -2) {
                alert("你的账号正在审核，请等待.");
            } else {

                alert("error");
            }

        }, null, function () {
            $_imgLoading.css("visibility", "hidden");
        }, { userContext: "checkUserLogin" });
}

//function $closeReLoginBoxControl() {
//    $_DivReloginBox.hide();
//}

function $createReLoginBoxControl() {
    $(document.body).html("");
    setTimeout(function () {
        $(document.body).find("table").hide();
        var htmlStrArray = new Array();
        if ($_DivReloginBox != null) {
            $_DivReloginBox.show();
        } else {
            htmlStrArray.push('<div id="_DivReloginBox">');
            htmlStrArray.push('<div style="position: fixed; top: 0px; left: 0px; width: 100%;');
            htmlStrArray.push('height: 100%; background-color: Gray; filter: alpha(opacity=15); -moz-opacity: 0.3;');
            htmlStrArray.push('opacity: 0.3; z-index: 99998; padding-top: 20%;">');
            htmlStrArray.push('</div>');
            htmlStrArray.push('<div style="text-align: center; position: fixed; top: 30%; left: 35%; z-index: 99999;');
            htmlStrArray.push('background-color: #BBE5EC; width: 430px; border: 2px solid gray;">'); //rgb(162,219,246)
            htmlStrArray.push('<table cellpadding="2" cellspacing="2" style="background-color:rgb(16,135,190)" width="100%">');
            htmlStrArray.push('<tr>');
            htmlStrArray.push('<td style="color:White;text-align:left;font-size:15px;">会话超时，请重新登录</td>');
            htmlStrArray.push('<td style="text-align:right">&nbsp;</td>'); //<img onclick="$closeReLoginBoxControl()" alt="Close" title="Close" style="cursor:pointer" src="../_Images/close2.gif" />
            htmlStrArray.push('</tr>');
            htmlStrArray.push('</table>');
            htmlStrArray.push('<center>');
            htmlStrArray.push('<table cellpadding="0" cellspacing="3" style="margin:8px;font-size:14px;">');
            htmlStrArray.push('<tr>');
            htmlStrArray.push('<td style="color: #005F9C;text-align:right">用户名:</td>');
            htmlStrArray.push('<td><input id="_DivReloginBox_TxtUserName" type="text" style="width: 160px;color:Gray;" /></td>');
            htmlStrArray.push('</tr>');
            htmlStrArray.push('<tr>');
            htmlStrArray.push('<td style="color: #005F9C;text-align:right">密码:</td>');
            htmlStrArray.push('<td><input id="_DivReloginBox_TxtPassWord" type="password" style="width: 160px;color:Gray;" /></td>');
            htmlStrArray.push('</tr>');
            htmlStrArray.push('<tr>');
            htmlStrArray.push('<td>&nbsp;</td>');
            htmlStrArray.push('<td align="left">');
            htmlStrArray.push('<input id="_DivReloginBox_btnSignIn" type="button" onclick="$reloginEmathSystem()" value="登录" style="background: url(../images/img.gif) no-repeat scroll 0 0 transparent;');
            htmlStrArray.push('border: 0 none; color: #013655;cursor: pointer;font-family: Arial,Helvetica,sans-serif;font-size: 13px;');
            htmlStrArray.push('font-weight: bold;height: 22px;line-height: 22px;margin: 0;padding: 0;width: 90px;"/>');
            htmlStrArray.push('&nbsp;&nbsp;<img id="_DivReloginBox_ImgLoading" src="../_Images/ajax-loader_m.gif" style="visibility:hidden"/>');
            htmlStrArray.push('</td>');
            htmlStrArray.push('</tr>');
            htmlStrArray.push('</table>');
            htmlStrArray.push('</center>');
            htmlStrArray.push('</div>');
            htmlStrArray.push('</div>');
            $(htmlStrArray.join('')).appendTo(document.body);
            $_DivReloginBox = $("#_DivReloginBox");

            var $_userName = $("#_DivReloginBox_TxtUserName", "#_DivReloginBox");
            var $_passWord = $("#_DivReloginBox_TxtPassWord", "#_DivReloginBox");
            $_userName.keydown(function (e) {
                if (e.which == 13) {
                    $_passWord.focus();
                }
            });

            $_passWord.keydown(function (e) {
                if (e.which == 13) {
                    $reloginEmathSystem();
                    // $("#_DivReloginBox_btnSignIn", "#_DivReloginBox").trigger("click");
                }
            });
        }

    }, 500);

}

function get_simpleUser() {
    return SimpleUser.user;
}

function get_userId() {
    return SimpleUser.user.userId;
}

function get_roleId() {
    return SimpleUser.user.roleId;
}

function get_sectionId() {
    return SimpleUser.user.sectionId;
}

function get_courseId() {
    return SimpleUser.user.courseId;
}


function get_isbn() {
    return SimpleUser.user.isbn;
}

function get_bookId() {
    return SimpleUser.user.bookId;
}
function get_systemId() {
    return SimpleUser.user.systemId;
}

function get_studyFlag() {
    return SimpleUser.user.studyFlag;
}

function get_realSimpleUser() {
    return RealUserExtend;
}

function get_realRoleId() {
    return RealUserExtend.roleId;
}

function get_realUserId() {
    return RealUserExtend.userId;
}

//getSimpleUserBySectionId || getSimpleUserByUserIdAndSectionId