/// <reference path="../../Scripts/JQuery/jquery-1.4.1.min.js" />

var $ddlInstitutes = null;
var $btnRegUser = null;
var $btnAddUsers = null;
var $tbUserList = null;
var InstUserIds = [];

function PageLoad() {
    InitCmsMenu("m_instituteusers");

    $ddlInstitutes = $("#ddlInstitutes");
    $btnRegUser = $("#btnRegUser");
    $btnAddUsers = $("#btnAddUsers");
    $tbUserList = $("#tbUserList");

    bindInstituteList();
    $btnRegUser.bind("click", registerUser);
    $btnAddUsers.bind("click", addUsers);
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
        var $contentbox = $(".cms_contentbox").showLoading();
        $excuteWS("~CourseWS.getInstituteUsersIds", { instituteId: instituteId, userExtend: SimpleUser }, function (result) {
            $contentbox.hideLoading();
            var instituteUserIds = (result && result.length > 0) ? result : [];
            bindInstituteUserPagin(instituteUserIds);
        }, null, null);
    }
}

var pageSize = 25;
function bindInstituteUserPagin(instituteUserIds) {
    $("#instUserPagin").html("").pagination(instituteUserIds.length, {
        num_edge_entries: 2,
        num_display_entries: 5,
        items_per_page: pageSize,
        prev_text: "上一页",
        next_text: "下一页",
        callback: function (page_index, o) {
            var $contentbox = $(".cms_contentbox").showLoading();
            var _startPos = page_index * pageSize;
            var _endPos = _startPos + (pageSize - 1);
            var pageIds = getIdsArray(instituteUserIds, _startPos, _endPos);
            $excuteWS("~CourseWS.getInstituteUsersInfo", { instituteIds: pageIds, userExtend: SimpleUser }, function (result) {
                $contentbox.hideLoading();
                bindInstituteUserList(result);
            }, null, null);
        }
    });
}

function bindInstituteUserList(iuData) {
    var instituteUsers = iuData[0];
    var users = iuData[1];

    InstUserIds = getUserIds(users);
    $tbUserList.find("tr:gt(0)").remove();
    if (!instituteUsers || instituteUsers.length == 0) {
        $tbUserList.append("<tr class='nodata lightblue'><td colspan='3'>未添加用户</td></tr>");
        return;
    }
    
    var sBuilder = [];
    var rowClass = "";
    var n, fullName, userName, jionDate, status;
    $.each(instituteUsers, function (i) {
        if (i % 2 == 0) {
            rowClass = "class='lightblue'";
        } else {
            rowClass = "";
        }

        n = users.indexOf("id", this.userId);
        fullName = (n != -1) ? users[n].fullName : "";
        userName = (n != -1) ? users[n].userName : "";
        jionDate = jDateFormat(this.jionDate);
        status = (this.statusFlag == 1) ? "<span style='color:#008200;cursor:pointer' onclick='disableUser(\"" + this.id + "\", 1)'>激活</span>" : "<span style='color:#b91818;cursor:pointer' onclick='disableUser(\"" + this.id + "\", 0)'>禁用</span>";

        sBuilder = [];
        sBuilder.push("<tr id='" + this.id + "'" + rowClass + ">");
        sBuilder.push("<td>" + fullName + "</td>");
        sBuilder.push("<td>" + userName + "</td>");
        sBuilder.push("<td>" + jionDate + "</td>");
        sBuilder.push("<td>" + status + "</td>");
        sBuilder.push("<td class='operate' style='padding-left:12px'><img src='Images/user_delete.png' title='删除' onclick=\"delInstituteUser('" + this.id + "')\" /></td>");
        sBuilder.push("</tr>");
        $tbUserList.append(sBuilder.join(""));
    });

    _resizeCmsBox("cms_contentbox", 60);
}

function registerUser() {
    if ($ddlInstitutes.val() == -1) {
        $.jBox.info("请选择学院", "提示");
        return;
    }
    
    $.jBox(initRegUsersBox(), { id: 'jb_regusers', title: "注册新的教师", width: 450, top: "25%", buttons: { "保存": true, "取消": false }, submit: regInstituteUser });
}

function addUsers() {
    if ($ddlInstitutes.val() == -1) {
        $.jBox.info("请选择学院", "提示");
        return;
    }
    
    var $jb = $.jBox(initAddUsersBox(), { id: 'jb_addusers', title: "添加教师", width: 580, top: "25%", buttons: {} });
    $jb.find("#btnSearchSysUser").click(function () {
        var sysUserName = $("#txtSysUserName").val();
        if (sysUserName) {
            $("#dvSysUserListBox").showLoading();
            $excuteWS("~UsersWS.userIdsByUsername", { userName: sysUserName, userExtend: SimpleUser }, bindSysUserList, null, null);
        }
    });
    $jb.find("#txtSysUserName").keydown(function (e) {
        if (e.which == 13) {
            $jb.find("#btnSearchSysUser").click();
        }
    });
    $jb.find("#btnCloseAddBox").click(function () {
        $.jBox.close("jb_addusers");
    });
}

function initAddUsersBox() {
    var sb = [];
    sb.push("<div style='padding:15px'>");
    sb.push("<div style='margin-bottom:6px'>用户名：<input type='text' style='width:180px' id='txtSysUserName'/>&nbsp;<input type='button' id='btnSearchSysUser' value='查询' /></div>");
    sb.push("<div id='dvSysUserListBox' style='border:1px solid #ccc; height:280px; overflow:auto; '>")
    sb.push("   <table id='tbSysUserList' style='width:100%; border-collapse:collapse'>");
    sb.push("   <tr style='background-color:#e3f6ff; text-align:left; line-height:25px'><th style='padding-left:6px; width:180px'>姓名</th><th style='width:180px'>用户名</th><th>&nbsp;</th></tr>");
    sb.push("   </table>");
    sb.push("</div>")
    sb.push("<div style='margin-top: 10px;text-align: right;'><input type='button' id='btnCloseAddBox' value='关闭' /></div>")
    sb.push("</div>");
    return sb.join("");
}

function disableUser(id, flg) {
    
}

function bindSysUserList(user) {
    $("#dvSysUserListBox").hideLoading();
    var $tbSysUserList = $("#tbSysUserList");
    $("#tbSysUserList").find("tr:gt(0)").remove();
    if (!user) {
        $tbSysUserList.append("<tr><td colspan='3' style='color:#787878; text-align:center; line-height:50px'>用户不存在</td></tr>");
        return;
    }

    var sb = [];
    sb.push("<tr style='line-height:25px'>");
    sb.push("<td style='padding-left:6px'>" + user.fullName + "</td>");
    sb.push("<td>" + user.userName + "</td>");
    sb.push("<td><a href='javascript:void(0)' onclick='saveInstituteUser(\"" + user.id + "\")'>添加</a></td>");
    sb.push("</tr>");
    $tbSysUserList.append(sb.join(""));
}

function saveInstituteUser(userId) {
    if ($.inArray(userId, InstUserIds) != -1) {
        $.jBox.info("你添加的用户已经加入学院", "提示");
    } else {
        $.jBox.close("jb_addusers");
        $excuteWS("~CourseWS.instructorSaveToInstitute", { instituteId: $ddlInstitutes.val(), userId: userId, userExtend: SimpleUser }, function (resutl) {
            if (resutl) {
                showInstituteUserList();
            }
        }, null, null);
    }
}

function getUserIds(users) {
    var userIds = [];
    if (users && users.length > 0) {
        $.each(users, function () {
            userIds.push(this.id);
        });
    }
    return userIds;
}

function initRegUsersBox() {
    var sb = [];
    sb.push("<div id='dvRegUserBox' style='border:1px solid #ccc; padding:15px'>");
    sb.push("    <table>");
    sb.push("        <tr><td style='width:120px; text-align:right'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp;姓名：</td><td><input type='text' id='txtFullName_Ru' style='width:200px' /></td></tr>");
    sb.push("        <tr><td style='width:120px; text-align:right'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp;用户名：</td><td><input type='text' id='txtUserName_Ru' style='width:200px' /></td></tr>");
    sb.push("        <tr><td style='width:120px; text-align:right'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp;用户密码：</td><td><input type='text' id='txtPwd_Ru' style='width:200px' /></td></tr>");
    sb.push("    </table>");
    sb.push("</div>");
    return sb.join("");
}

function regInstituteUser(v, h, f) {
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

        $excuteWS("~UsersWS.userIdsByUsername", { userName: user.userName, userExtend: SimpleUser }, function (result) {
            if (result) {
                $.jBox.prompt("该用户已经注册, 如果不在当前学院中，请通过添加教师功能加入学院。", "提示", 'warning');
            } else {
                $.jBox.close("jb_regusers");
                $excuteWS("~CourseWS.instructorRegisterToInstitute", { user: user, instituteId: $ddlInstitutes.val(), userExtend: SimpleUser }, function (resutl) {
                    if (resutl) {
                        showInstituteUserList();
                    }
                }, null, null);
            }

        }, null, null)
        return false;
    }
}

function delInstituteUser(id) {
    $.jBox.confirm("你确定要删除这条记录吗?", "消息", function (v, h, f) {
        if (v == true) {
            $excuteWS("~CourseWS.instructorRemoveFromInstitute", { instructorInstituteId: id, userExtend: SimpleUser }, function (result) {
                if (result) {
                    showInstituteUserList();
                } else {
                    $.jBox.tip("删除失败！", 'error');
                }
            }, null, null);
        }
    }, { top: "25%", buttons: { "确定": true, "取消": false } });
}