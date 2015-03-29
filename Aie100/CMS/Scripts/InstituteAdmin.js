/// <reference path="../../Scripts/jquery-1.4.1.min.js" />

var $ddlInstitutes = null;
var $tbUserList = null;
var $btnRegUser = null;
var CurrUser = null;

function PageLoad() {
    InitCmsMenu("m_InstituteAdmin");

    $ddlInstitutes = $("#ddlInstitutes");
    $tbUserList = $("#tbUserList");
    $btnRegUser = $("#btnRegUser");

    $btnRegUser.bind("click", registerUser);

    $excuteWS("~UsersWS.usersByUserIdBookId", { userId: SimpleUser.userId, bookId: "", userExtend: SimpleUser }, function (result) {
        CurrUser = result
        bindInstituteList();
    }, null, null);
}

//显示所有学院
function bindInstituteList() {
    $excuteWS("~CourseWS.institutesMyManageList", { userId: SimpleUser.userId, userExtend: SimpleUser }, function (institutes) {
        if (institutes && institutes.length > 0) {
            var options = [];

            $.each(institutes, function () {
                options.push("<option value='" + this.id + "'>" + this.name + "</option>");
            });
            $ddlInstitutes.append(options.join('')).unbind().bind("change", showInstituteUserList);
        }
    }, null, null);
}


function showInstituteUserList() {
    var instituteId = $ddlInstitutes.val();
    $tbUserList.find("tr:gt(0)").remove();
    if (instituteId != -1) {
        $(".cms_contentbox").showLoading();
        $excuteWS("~CourseWS.getInstituteAdminData", { instituteId: instituteId, userExtend: SimpleUser }, function (result) {
            bindInstituteUserList(result);
        }, null, null);
    }
}

function bindInstituteUserList(users) {
    var instituteAdmins = users[0];
    var users = users[1];

    avoidSystemAdmin(instituteAdmins);
    sortByInstitute(instituteAdmins);

    $(".cms_contentbox").hideLoading();

    if (!instituteAdmins || instituteAdmins.length == 0) {
        $tbUserList.append("<tr class='nodata lightblue'><td colspan='5'>用户不存在</td></tr>");
        return;
    }

    var sBuilder = [];
    var rowClass = "";
    var n, fullName, userName, roleName, registerDate, status;
    
    $.each(instituteAdmins, function (i) {
        if (i % 2 == 0) {
            rowClass = "class='lightblue'";
        } else {
            rowClass = "";
        }

        n = users.indexOf("id", this.userId);
        fullName = (n != -1) ? users[n].fullName : "";
        userName = (n != -1) ? users[n].userName : "";
        roleName = (this.superFlag == 1) ? "<span style='color:#eb2319'>学院管理员</span>" : "<span>内容管理员</span>";
        registerDate = jDateFormat(users[n].registerDate);
        status = (this.statusFlag == 1) ? "<span style='color:#008200;cursor:pointer' onclick='disableUser(\"" + this.id + "\", 1)'>激活</span>" : "<span style='color:#b91818;cursor:pointer' onclick='disableUser(\"" + this.id + "\", 0)'>禁用</span>";

        sBuilder = [];
        sBuilder.push("<tr id='" + this.id + "'" + rowClass + ">");
        sBuilder.push("<td>" + fullName + "</td>");
        sBuilder.push("<td>" + userName + "</td>");
        sBuilder.push("<td>" + roleName + "</td>");
        sBuilder.push("<td>" + registerDate + "</td>");
        sBuilder.push("<td>" + status + "</td>");
        sBuilder.push("<td class='operate' style='padding-left:12px'><img src='Images/user_delete.png' title='删除' onclick=\"delInstituteUser('" + this.id + "')\" /></td>");
        sBuilder.push("</tr>");
        $tbUserList.append(sBuilder.join(""));
    });
}

//排除系统管理员
function avoidSystemAdmin(iusers) {
    if (CurrUser.adminRole == 0) {
        var i = iusers.indexOf("userId", CurrUser.userId);
        if (i != -1) {
            iusers.splice(i, 1);
        }
    }
}

//将学院管理员排在第一个位置
function sortByInstitute(iusers) {
    var i = iusers.indexOf("superFlag", 1);
    if (i != -1) {
        var obj = iusers.splice(i, 1)[0];
        iusers.splice(0, 0, obj);
    }
}

function disableUser(id, flg) {

}


function delInstituteUser(id) {
    $.jBox.confirm("你确定要删除这条记录吗?", "消息", function (v, h, f) {
        if (v == true) {
            //$excuteWS("~CourseWS.instructorRemoveFromInstitute", { instructorInstituteId: id, userExtend: SimpleUser }, function (result) {
            //    if (result) {
            //        showInstituteUserList();
            //    } else {
            //        $.jBox.tip("删除失败！", 'error');
            //    }
            //}, null, null);
        }
    }, { top: "25%", buttons: { "确定": true, "取消": false } });
}


function registerUser() {
    if ($ddlInstitutes.val() == -1) {
        $.jBox.info("请选择学院", "提示");
        return;
    }

    $.jBox(initRegUsersBox(), { id: 'jb_regusers', title: "注册管理员", width: 450, top: "25%", buttons: { "保存": true, "取消": false }, submit: regInstituteAdmin });
}

function initRegUsersBox() {
    var sb = [];
    sb.push("<div id='dvRegUserBox' style='border:1px solid #ccc; padding:15px'>");
    sb.push("    <table>");
    sb.push("        <tr><td style='width:120px; text-align:right'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp;姓名：</td><td><input type='text' id='txtFullName_Ru' style='width:200px' /></td></tr>");
    sb.push("        <tr><td style='width:120px; text-align:right'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp;用户名：</td><td><input type='text' id='txtUserName_Ru' style='width:200px' /></td></tr>");
    sb.push("        <tr><td style='width:120px; text-align:right'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp;用户密码：</td><td><input type='text' id='txtPwd_Ru' style='width:200px' /></td></tr>");
    sb.push("        <tr><td style='width:120px; text-align:right'></td><td><input id='cbxIsInstituteAdmin' name='cbxIsInstituteAdmin' type='checkbox' />&nbsp;<label for='cbxIsInstituteAdmin'>学院管理员</label></td></tr>");
    sb.push("    </table>");
    sb.push("</div>");
    return sb.join("");
}

function regInstituteAdmin(v, h, f) {
    if (v == true) {
        var fullName = $("#txtFullName_Ru").val();
        var userName = $("#txtUserName_Ru").val();
        var pwd = $("#txtPwd_Ru").val();

        if (!fullName) {
            $.jBox.tip("请输入姓名", 'warning');
            return false;
        } else if (!userName) {
            $.jBox.tip("请输入用户名", 'warning');
            return false;
        } else if (!pwd) {
            $.jBox.tip("请输入用户密码", 'warning');
            return false;
        }

        var user = {};
        user.fullName = fullName;
        user.userName = userName;
        user.password = pwd;
        user.instituteId = $ddlInstitutes.val();
        isInstituteAdmin = $("#cbxIsInstituteAdmin").is(":checked");
        
        if (isInstituteAdmin) {
            $excuteWS("~CourseWS.instituteAdminIsExist", { instituteId: $ddlInstitutes.val(), userExtend: SimpleUser }, function (result) {
                if (result) {
                    $.jBox.prompt("学院管理员已经存在，不能重复添加!", "提示", 'warning');
                } else {
                    $.jBox.close("jb_regusers");
                    $excuteWS("~CourseWS.registerInstituteAdmin", { user: user, instituteId: $ddlInstitutes.val(), userExtend: SimpleUser }, function (resutl) {
                        if (resutl) {
                            showInstituteUserList();
                        }
                    }, null, null);
                }
            }, null, null);
        } else {
            $.jBox.close("jb_regusers");
            $excuteWS("~CourseWS.registerContentAdmin", { user: user, instituteId: $ddlInstitutes.val(), userExtend: SimpleUser }, function (resutl) {
                if (resutl) {
                    showInstituteUserList();
                }
            }, null, null);
        }
        return false;
    }
}