/// <reference path="../../Scripts/jquery-1.6.1.min.js" />
/// <reference path="../../Scripts/jquery.ajax.js" />



var strUserIsExist = "邮箱已注册，请更换其他邮箱";
var StipFields = {}; //需要验证的字段
var StipEmail = null; //验证邮箱的提示
var dialog = null; //对话框对象


$(function () {
    Tipshow();
    var $register = $("#register");
    $register.click(function () {
        //获取页面数据
        
        DetailsNext_click();
    })
    var $argee = $("#argee");
    var $img7 = $("#Img7");
    var $disagree = $("#disagree");
    $argee.click(function () {
        if ($argee.is(":checked")) {
            $register.removeAttr("disabled");
            $register.attr("title", "立即注册");
            $disagree.hide();
            $img7.hide();
        }
        else {
            $register.attr("disabled", "disabled");
            $register.attr("title", "请先同意服务条款");
            $disagree.show();
            $img7.show();
        }
    })
    $("#servers").click(function () {
        $.jBox("get:UserTermsOfservice.htm", {
            title: "爱易佰用户服务条款",
            width: 800,
            height: 600
        });

    })
    //错误提示字段定义
    StipFields = {
        User_Name: Stip("User_Name"),
        password: Stip("password"),
        confirm_password: Stip("confirm_password"),
        name: Stip("name"),
        address: Stip("address"),
        //ddl_SecurityQuestion: Stip("ddl_SecurityQuestion"),
        //answer: Stip("answer")
    }

    //初始化验证规则
    $("#form1").validate({
        rules: {
            User_Name: { required: true, email: true },
            password: { required: true, minlength: 6 },
            confirm_password: { required: true, minlength: 6, equalTo: "#password" },
            name: { required: true },
            address: { required: true },
            //ddl_SecurityQuestion: { required: true },
            //answer: { required: true }
        },
        errorPlacement: function (error, element) {
            var stipName = "StipFields." + element.attr("id");

            var stipField = eval(stipName);
            if (stipField) {
                stipField.show({ content: error.html(), kind: "error" });
                $("#" + element.attr("id")).next().hide();
                $(".tip").hide();
            }

        },
        success: function (label) {
            var stipName = "StipFields." + label.attr("for");

            var stipField = eval(stipName);
            if (stipField) {
                stipField.hide();
                $("#" + label.attr("for")).next().show();
                $(".tip").hide();
            }
        }
    });

    //    $("input[name=radioRole]").bind("click", radioRole_click);//绑定选择角色
    //$excuteWS("~RegistrationWS.GetSecurityQuestion", {}, BindSecurityQuesetion, null, null);
    //暂时屏蔽 $excuteWS("~RegistrationWS.GetAllInstitute", {}, BindInsititute, null, null);

})
//返回Loading图标
function getLoading() {
    return $("<img src='../Images/ajax-loader_m.gif' title='Loading'/>");
}

//成功检验邮箱的提示
function checkEmail_Successed(result, context) {
    var UserIsExist = result;
    var $tipObj = context;
    var $tips = $(".tip");
    if (UserIsExist) {
        StipCheckEmail.show({ content: "用户名已存在.", kind: "提示" });
        $tips.hide();
        $("#Img1").hide();
    }
    else {
        $("#User_Name").siblings("img").show();
        StipCheckEmail.hide();
        $tips.hide();
    }
    if (context) {
        context.action(1);
    }
}
//绑定学校
function BindInsititute(result) {
    var data = result;
    var $ddl_School = $("#Institute");
    var isStudent = $("#rb_Instructor").is(":checked");
    $.each(data, function (index, item) {
        var value = index;
        var text = item.Institute_Name;
        var optionNode = $("<option></option>").attr("value", value).html(text); //生成选项节点;
        $ddl_School.append(optionNode);
    })
}
////绑定安全问题
//function BindSecurityQuesetion(result) {
//    var data = result;
//    $.each(data, function (index, item) {
//        var value = index;
//        var text = item;
//        var optionNode = $("<option></option>").attr("value", value).html(text); //生成选项节点
//        $("#ddl_SecurityQuestion").append($(optionNode));
//    })
//}
//提交时验证

function DetailsNext_click() {
    var validator = $("#form1").validate();
    var bo = validator.form();
    if (bo) {
        if ($("#Img1").is(":hidden")) {
            $.jBox.tip('请正确输入邮箱', 'error');
        } else {
            if ($("#success").is(":hidden")) {
                $("#errors").show();
                $("#error1").show();
            }
            else {
                SaveAccountDetails();
            }
        }
    }
}
//保存信息
function SaveAccountDetails() {
    var userName = $.trim($("#User_Name").val());
    var passWord = $.trim($("#password").val());
    var fullName = $.trim($("#name").val());
    var radioRoleId = $("input[type='radio'][name='radioRole']:checked").attr("id");
    var radioId = radioRoleId == "rb_Student" ? "1" : "0";
    var school = "0"; //$.trim($("#Institute").val());
    var phone = $.trim($("#phone").val());
    //var securityQuestion = $("#ddl_SecurityQuestion").val();
    //var securityAnswer = $.trim($("#answer").val());
    //var address = $.trim($("#address").val());
    var user = {};
    //user.Address = address;
    user.email = userName;
    user.userName = userName;
    user.password = passWord;
    user.instituteId = school;
    user.roleId = radioId;
    user.fullName = fullName;
    user.mPhone = phone;
    //user.Security_Question = securityQuestion;
    //user.Security_Ansewer = securityAnswer;
    $excuteWS("~RegistrationWS.RegistrationUser", { user: user}, function (result) {
        $.jBox("<div style='padding:5px;'>恭喜你，注册成功. 马上<a href='../Default.aspx'>返回首页</a></div>", {
            title: "提示", top: '35%', closed: function () {
                location.href = '../Default.aspx';
            }
        });
    }, null, { userContext: "RegistrationUser" });
}
////选择角色
//function radioRole_click() {
//    if (this.id == "rb_Instructor") {
//        $("#schools").show();
//    }
//    else {
//        $("#schools").hide();
//    }
//}
//更换验证码
function code_change() {
    $('#code').attr("src", "ValidateCodes.aspx?time=" + new Date());
}
//显示提示信息
function Tipshow() {
    var $tip = $(".tip");
    $("input[type=text]").focus(function () {
        $(this).siblings(".tip").show();
        var stipName = "StipFields." + $(this).attr("id");
        var stipField = eval(stipName);
        if (stipField != null) {
            stipField.hide();
        } else {
            return;
        }
    });
    $(".abc").focus(function () {
        $(this).siblings("img").hide();
    })
    $("#User_Name").focus(function () {
        if (checkEmailFormat($("#User_Name").get(0)) == true) {
            $tip.hide();
        }
    })
    $("input[type=text]").blur(function () {
        $tip.hide();
    });
    $("input[type=password]").focus(function () {
        $(this).siblings(".tip").show();
        $(this).siblings("img").hide();
        var stipName = "StipFields." + $(this).attr("id");
        var stipField = eval(stipName);
        if (stipField != null) {
            stipField.hide();
        } else {
            return;
        }
    });
    $("input[type=password]").blur(function () {
        $tip.hide();
    });
    $("#validatorImgcode").focus(function () {
        $("#errors").hide();
        $("#error1").hide();
    })
    //邮箱验证是否已存在
    StipCheckEmail = Stip("User_Name");
    $("#User_Name").keyup(function () {
        var email = $.trim($("#User_Name").val());
        if (checkEmailFormat($("#User_Name").get(0)) == true) {
            getLoading();
            $excuteWS("~RegistrationWS.IsUsedForUserName", { userName: email }, checkEmail_Successed, null, null);
        }
        else {
            $("#Img1").hide();
            StipCheckEmail.hide();
        }
    })
    //对验证码进行验证
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
}