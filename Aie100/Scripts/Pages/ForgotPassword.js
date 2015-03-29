/// <reference path="../JQuery/jquery-1.4.1.min.js" />
/// <reference path="../JQuery/jquery.ajax.js" />
var strUserName = "用户名必填.";
var strAnswer = "你的答案必填.";
var strSessionOut = "超时，你不得不从第一步开始.";
var strUserNameNotExist = "用户名不存在，请再试一次.";
var strAnswerIsWrong = "答案不正确，请再试一次.";
var strNewPasswordNotModify = "服务器忙! 请再试一次.";
var strPasswordIsRequired = "密码必填.";
var strRePasswordIsRequired = "确认密码必填.";
var strPasswordLessSix = "请至少输入6位密码.";
var strSamePassword = "请确认密码一致.";
var strFirstLastName = "姓名必填.";
var strNewPasswordSuccess = "设置新密码成功,您可以返回首页登陆系统了."
var urlParams = null;
var strSessionOuts = "找回密码校验码不匹配，请尝试重新找回！"
$(document).ready(function () {
    urlParams = getUrlParms();
    if (urlParams["key"] && urlParams["key"] != "") {
        
        $("#setPassword").removeClass("hides");
        $("#EmailfindPasswords").removeClass().addClass("hides");
    } else {
        $("#findStyle").removeClass("hides");
    }

    $("#next1").bind("click", { index: 1 }, step1_Click);
    $("#next2").bind("click", { index: 2 }, step2_Click);
    $("#next3").bind("click", { index: 3 }, step3_Click);
    $("#next4").bind("click", { index: 4 }, step4_Click);
    function step1_Click(event) {

        //var index = event.data.index;
        function_Click(event);
    }
    function step2_Click(event) {
        // var index = event.data.index;
        function_Click(event);
    }
    function step3_Click(event) {
        //    var index = event.data.index;
        function_Click(event);
    }
    function step4_Click(event) {
        //    var index = event.data.index;
        function_Click(event);
    }
    $("#validatorImgcode").keyup(function () {
        var $this = $(this);
        $this.val($this.val().replace(/[^\w\.\/]/ig, ''))
        if ($this.val().length == 4) {
            $excuteWS("~RegistrationWS.getCheckCode", {}, function (r) {
                var vals = $this.val();
                if (r != vals.toLocaleLowerCase()) {
                    $("#success").hide();
                    $("#errors").show();
                    $("#error1").show();
                } else {
                    $("#success").show();
                    $("#errors").hide();
                    $("#error1").hide();
                }
            }, null, null);
        }
        else {
            $("#success").hide();
            $("#errors").hide();
            $("#error1").hide();

        }
    });
    $("#validatorcode").keyup(function () {
        var $this = $(this);
        $this.val($this.val().replace(/[^\w\.\/]/ig, ''))
        if ($this.val().length == 4) {
            $excuteWS("~RegistrationWS.getCheckCode", {}, function (r) {
                var vals = $this.val();
                if (r != vals.toLocaleLowerCase()) {
                    $("#Img2").hide();
                    $("#Img3").show();
                    $("#Span2").show();
                } else {
                    $("#Img2").show();
                    $("#Img3").hide();
                    $("#Span2").hide();
                }
            }, null, null);
        }
        else {
            $("#Img2").hide();
            $("#Img3").hide();
            $("#Span2").hide();

        }
    });
})

//更换验证码
function code_changes() {
    $('#code').attr("src", "../UserManage/ValidateCodes.aspx?time=" + new Date());
}
function code_change() {
    $('#Img1').attr("src", "../UserManage/ValidateCodes.aspx?time=" + new Date());
}

//显示邮箱方式找回
function Emailfind() {
    return;
    $("#EmailfindPasswords").slideToggle();
    $("#SercurityfindPasswords").hide();
}
//显示安全问题方式找回
function Securityfind() {
    $("#SercurityfindPasswords").slideToggle();
    $("#EmailfindPasswords").hide();
}
//弹出验证安全问题
function SecurityNext() {
    $("#securityCertificate").slideDown();
    $("#EmailfindPasswords").hide();
    $("#SercurityfindPasswords").hide();
    $("#findStyle").hide();
}
//弹出设置新密码
function SecuritySuccess() {
    $("#securityCertificate").hide();
    $("#setPassword").slideDown();
}

function function_Click(event) {
    var index = event.data.index;
    
    switch (index) {
        case 0:
            showDOM(index);
            break;
        case 1:
            var $userName = $("#Username");
            var userName = $.trim($userName.val());
            if (userName == "") {
                //                alert(strUserName);
                $.jBox("<div style='padding:5px;'>" + strUserName + "</div>", { title: "提示", top: '35%' });
                $userName.focus();
                return false;
            }
            var context = { content: "CheckUserName", index: index };
            $excuteWS2("~ForgotPasswordWS.CheckUserName", { userName: userName }, before_All, onForgotPassword_Successed, onForgotPassword_Errored, complete_All, context);
            break;
        case 2:
            var $sAnswer = $("#Security_answer");
            var sAnswer = $.trim($sAnswer.val());
            if (sAnswer == "") {
                //        alert(strAnswer);
                $.jBox("<div style='padding:5px;'>" + strAnswer + "</div>", { title: "提示", top: '35%' });
                $sAnswer.focus();
                return false;
            }
            else if ($("#Img2").is(":hidden")) {
                $("#Img3").show();
                $("#Span2").show();
                $("#validatorcode").focus();
            }
            else {
                var context = { content: "CheckSec_Answer", index: index };
                $excuteWS2("~ForgotPasswordWS.CheckSec_Answer", { sec_Answer: sAnswer }, before_All, onForgotPassword_Successed, onForgotPassword_Errored, complete_All, context);
            }
            break;
        case 3:
            var $password = $("#newpassword");
            var $rePassword = $("#Con_newpassword");
            var password = $password.val();
            var rePassword = $rePassword.val();

            //验证
            if (password == "") {
                //                alert(strPasswordIsRequired);
                $.jBox("<div style='padding:5px;'>" + strPasswordIsRequired + "</div>", { title: "提示", top: '35%' });
                $password.focus();
                return false;
            }
            else if (rePassword == "") {
                //alert(strRePasswordIsRequired);
                $.jBox("<div style='padding:5px;'>" + strRePasswordIsRequired + "</div>", { title: "提示", top: '35%' });
                $rePassword.focus();
                return false;
            }
            else if (password.length < 6 || rePassword.length < 6) {
                // alert(strPasswordLessSix);
                $.jBox("<div style='padding:5px;'>" + strPasswordLessSix + "</div>", { title: "提示", top: '35%' });
                return false;
            }
            else if (password != rePassword) {
                //                alert(strSamePassword);
                $.jBox("<div style='padding:5px;'>" + strSamePassword + "</div>", { title: "提示", top: '35%' });
                $rePassword.focus();
                return false;
            }
            //验证结束
            var context = { content: "ModifyPassword", index: index };
            if (urlParams["key"] && urlParams["key"] != "") {
                $excuteWS2("~ForgotPasswordWS.ModifyPasswordByEmail", { userId: urlParams["userId"], randomCode: urlParams["key"], newPassword: password }, before_All, onForgotPassword_Successed, onForgotPassword_Errored, complete_All, context);
            } else {
                $excuteWS2("~ForgotPasswordWS.ModifyPasswordBySecurity", { newPassword: password }, before_All, onForgotPassword_Successed, onForgotPassword_Errored, complete_All, context);
            }

            break;
        case 4:
            var $userName2 = $("#userName");
            var userName2 = $.trim($userName2.val());
            if (userName2 == "") {
                //                alert(strUserName);
                $.jBox("<div style='padding:5px;'>" + strUserName + "</div>", { title: "提示", top: '35%' });
                $userName2.focus();
                return false;
            }
            else if ($("#success").is(":hidden")) {
                $("#errors").show();
                $("#error1").show();
                $("#validatorImgcode").focus();

            }
            else {
                var context = { content: "CheckUserName2", index: index };
                $excuteWS2("~ForgotPasswordWS.CheckUserName", { userName: userName2 }, before_All, onForgotPassword_Successed, onForgotPassword_Errored, complete_All, context);
            }
            break;
    }
}

function onForgotPassword_Successed(result, context) {
    var index;

    if (context.content == "CheckUserName") {
        index = context.index;
        var isValidUserName = result[0]; //是否是有效的用户名
        if (isValidUserName == true) {
            var sQuestion = result[1]; //安全问题
            if (sQuestion == "") {
            }
            SecurityNext();
            $("#dom_SQuestion").html(sQuestion);
        }
        else {
            //            alert(strUserNameNotExist);
            $.jBox("<div style='padding:5px;'>" + strUserNameNotExist + "</div>", { title: "提示", top: '35%' });
            $("#Username").focus();
            return false;
        }
    }
    else if (context.content == "CheckSec_Answer") {

        index = context.index;
        var isCorrectAnswer = result;
        if (isCorrectAnswer == null) {
            //            alert(strSessionOut);
            $.jBox("<div style='padding:5px;'>" + strSessionOut + "</div>", { title: "提示", top: '35%' });
            window.document.location.reload();
            //showDOM(0);
            return false;
        }
        else if (isCorrectAnswer == false) {
            //            alert(strAnswerIsWrong);
            $.jBox("<div style='padding:5px;'>" + strAnswerIsWrong + "</div>", { title: "提示", top: '35%' });
            code_change();
            $("#Img2").hide();
            $("#Security_answer").focus();

            return false;
        }
        else {
            SecuritySuccess();
        }
    }
    else if (context.content == "ModifyPassword") {
        index = context.index;
        var isModify = result; //是否修改成功
        if (isModify == null) {
            //            alert(strSessionOut);
            $.jBox("<div style='padding:5px;'>" + strSessionOuts + "</div>", {
                title: "提示", top: '35%', closed: function () {
                    location.href = "Forgotpassword.aspx";
                }
            });
            //showDOM(0);
            return false;
        }
        else if (isModify == false) {
            //            alert(strNewPasswordNotModify);
            $.jBox("<div style='padding:5px;'>" + strNewPasswordNotModify + "</div>", { title: "提示", top: '35%' });
            $("#txt_Password").focus();
            return false;
        }
        else {
            $.jBox("<div style='padding:5px;'>" + strNewPasswordSuccess + "</div>" + "<div style='padding:5px'>" + "<a style='cursor: pointer; color: Blue;' href='../Default.aspx'>返回首页</a>" + "</div>",
            {
                top: '35%', title: "提示", closed: function () {
                    location.href = "../Default.aspx?userName=" + $("#Username").val();
                }
            });
        }
    }
    else if (context.content == "CheckUserName2") {
        index = context.index;
        var isValidUserNames = result[0]; //是否是有效的用户名
        if (isValidUserNames == true) {
            sendEmail();
        }
        else {
            //            alert(strUserNameNotExist);
            $.jBox("<div style='padding:5px;'>" + strUserNameNotExist + "</div>", {
                title: "提示", top: '35%', closed: function () {
                    $("#success").hide();
                    code_changes();
                }
            });
            $("#userName").focus();
            return false;
        }
    }
}

function onForgotPassword_Errored(result, context) {

}
function before_All() {
    dialog = new Dialog();
    dialog.show("", "");
}
function complete_All() {
    dialog.dispose();
}
//发送设置新密码链接到注册邮箱
function sendEmail() {
    var $userName3 = $("#userName");
    var userName3 = $.trim($userName3.val());
    $excuteWS2("~ForgotPasswordWS.SendSetPasswordEmail", { userName: userName3 }, before_All, sendEmailSucceed, onForgotPassword_Errored, complete_All, null);
}

function sendEmailSucceed(result, context) {
    if (result) {
        $.jBox("<div style='padding:5px;'>恭喜您.验证邮件已发送到您的邮箱<a style='color:Green;font-size:16;font-weight:bold'>" + $.trim($("#userName").val()) + "</a></div><div style='padding:5px;'>请点击邮箱中的链接重置密码，谢谢!</div>", {
            title: "提示", top: '35%', closed: function () {
                location.reload();
            }
        });
    } else {
        $.jBox("<div style='padding:5px;'>对不起,发送邮件失败!</div><div style='padding:5px;'>请重试!</div>", {
            title: "错误报告", top: '35%', closed: function () {
                location.reload();
            }
        })
    }
}