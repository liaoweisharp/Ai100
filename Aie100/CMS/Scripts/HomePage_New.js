/// <reference path="../../Scripts/jquery-1.4.1.min.js" />

$(function () {
    //设置权限
    setPermissions();

    //获取用户信息
    $excuteWS("~CmsWS.getSimpleUser", { userId: "", sectionId: "" }, function (result) {
        if (result) {
            InitHeader(result);
        } else {
            $.jBox.error("Cannot get user data.", "error", { buttons: { 'Confirm': 'ok'} });
        }
    }, null, null);
});

//设置权限
function setPermissions() {
    $excuteWS("~CmsWS.GetFuncPermissions", {}, function (result) {
        if (result) {
            var keys = extractFunKeys(result);
            $(".hp_square_disable").each(function () {
                if (keys.contains(this.id)) {
                    $(this).removeClass("hp_square_disable").addClass("hp_square");
                }
            });

            $(".hp_square").click(function () {
                if (this.id) {
                    var actionName = this.id + '_click';
                    var exp = "if (typeof(" + actionName + ") != 'undefined') {eval(" + actionName + "())}";
                    eval(exp);
                }
            });
        }
    }, null, null);
}

//提取功能Id
function extractFunKeys(cmsMenus) {
    var keys = [];
    for (var i = 0; i < cmsMenus.length; i++) {
        for (var j = 0; j < cmsMenus[i].children.length; j++) {
            keys.push(cmsMenus[i].children[j].key);
        }
    }
    return keys;
}

function InitHeader(simpleUser) {
    $excuteWS("~UserDetail.getUserDetailById", { userId: simpleUser.userId }, function (user) {
        if (user) {
            var userInfo = user.Fname + " " + user.Lname;
            userInfo += "，" + SayHello() + "！";
            $("#spUser").html(userInfo);
        }
    }, null, null);
}

function SayHello() {
    var say = "";
    var now = (new Date()).getHours();
    if (now > 0 && now <= 6) {
        say = "午夜好";
    } else if (now > 6 && now <= 11) {
        say = "早上好";
    } else if (now > 11 && now <= 14) {
        say = "中午好";
    } else if (now > 14 && now <= 18) {
        say = "下午好";
    } else {
        say = "晚上好";
    }
    return say;
}