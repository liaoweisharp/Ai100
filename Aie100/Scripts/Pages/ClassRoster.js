/// <reference path="../jquery.ajax.js" />
/// <reference path="../jquery-1.10.2.min.js" />
/// <reference path="../comm.js" />
/// <reference path="../SimpleUser.js" />
/// <reference path="TestManage.js" />
/// <reference path="../Array.js" />
/// <reference path="../../Plugins/showLoading/js/jquery.showLoading.min.js" />

var CR_json = { urlParams: null, simpleUser: null, $tbStudentList: null };

U(function () {
    CR_json.urlParams = getUrlParms();
    CR_json.simpleUser = this.simpleUser;
    CR_json.$tbStudentList = $("#tbStudentList");
    $("#btnSearch").bind("click", loadClassRoster).trigger("click");
});

function loadClassRoster() {
    var fullName = "";
    var userName = "";
    if ($("#ddlUserProps").val() == "0") {
        fullName = $.trim($("#txtKey").val());
    } else {
        userName = $.trim($("#txtKey").val());
    }
    CR_json.$tbStudentList.showLoading();
    $excuteWS("~UsersWS.getClassRosterInfo", { sectionId: CR_json.urlParams.sectionId, fullName: fullName, userName: userName, userExtend: CR_json.simpleUser }, function (result) {
        CR_json.$tbStudentList.hideLoading();
        CR_json.$tbStudentList.find("tr:gt(0)").empty();
        if (result[0] && result[0].length > 0) {
            uniteSectionProperty(result);
            showClassRoster(result[0]);
        }
    }, null, null);
}

//学生绑定班级属性
function uniteSectionProperty(classRosterInfo) {
    var students = classRosterInfo[0];
    var userSection = classRosterInfo[1];
    var n = -1;
    $.each(students, function () {
        n = userSection.indexOf("userId", this.id);
        if (n != -1) {
            this.flag = userSection[n].flag;
            this.roleId = userSection[n].roleId;
            this.joinedDate = userSection[n].joinedDate;
            this.validDays = userSection[n].validDays;
            this.payStatus = userSection[n].payStatus;
            this.sectionId = userSection[n].sectionId;
        }
    });
}

//显示花名册
function showClassRoster(student) {
    var sb = [];
    var payment = "";
    var isValid = "";
    var ctip = "";
    var role = "";
    var joinedDate = "";

    $.each(student, function (i) {
        if (this.roleId == "0") role = "教师"; else if (this.roleId == "1") role = "学生"; else role = "";
        joinedDate = jDateFormat(this.joinedDate);
        isValid = (this.flag == 1) ? "激活" : "禁用";
        ctip = (this.flag == 1) ? "u_valid" : "u_invalid";

        if (this.payStatus == -1) {
            payment = "免费";
        } else if (this.payStatus == 0) {
            payment = "续费";
        } else if (this.payStatus == 1) {
            payment = "已付费";
        } else {
            payment = "";
        }
        
        sb.push("<tr>");
        sb.push("<td align='center'>" + (i + 1) + "</td>");
        sb.push("<td>" + this.fullName + "</td>");
        sb.push("<td>" + this.userName + "</td>");
        sb.push("<td align='center'>" + role + "</td>");
        sb.push("<td align='center'>" + joinedDate + "</td>");
        sb.push("<td align='center'>" + payment + "</td>");
        sb.push("<td align='center'><span class='" + ctip + "' flag='" + this.flag + "' onclick='setUserValid(\"" + this.id + "\", this)'>" + isValid + "</span></td>");
        sb.push("<td align='center' style='cursor:pointer'><img src='../Images/user_go.png' title='改变角色' onclick=\"changeRole('" + this.id + "', '" + this.sectionId + "', '" + this.roleId + "')\" />&nbsp;<img src='../CMS/Images/user_delete.png' title='退出班' onclick=\"exitSection('" + this.id + "', '" + this.sectionId + "')\" /></td>");
        sb.push("<td>&nbsp;</td>");
        sb.push("</tr>");
    });
    CR_json.$tbStudentList.append(sb.join(""));
}

function setUserValid(id, o) {
    var flag = ($(o).attr("flag") == "1") ? 0 : 1;
    var isValid = (flag == 1) ? "激活" : "禁用";
    var ctip = (flag == 1) ? "u_valid" : "u_invalid";

    $excuteWS("~UsersWS.usFlagUpdate", { userId: id, sectionId: CR_json.urlParams.sectionId, flag: flag, userExtend: CR_json.simpleUser }, function (result) {
        if (result) {
            $(o).attr("flag", flag);
            $(o).removeClass().addClass(ctip);
            $(o).html(isValid);
        }
    }, null, null);
}

//退出班
function exitSection(userId, sectionId) {
    $.jBox.confirm("你确定要退出这个班吗?", "消息", function (v, h, f) {
        if (v == true) {
            $excuteWS("~UsersWS.sectionExitByUserId", { userId: userId, sectionId: sectionId, userExtend: CR_json.simpleUser }, function (result) {
                if (result) {
                    loadClassRoster();
                } else {
                    $.jBox.error("退出班级失败!", "错误");
                }
            }, null, null);
        }
    }, { top: "25%", buttons: { "确定": true, "取消": false } });
}

//改变角色
function changeRole(userId, sectionId, roleId) {
    var $jb = $.jBox("<div style='padding:20px;'>选择用户的角色:&nbsp;<select id='ddl_UserRole' style='width:150px'><option value='0'>教师</option><option value='1'>学生</option></select></div>", {
        id: 'jb_changeRole', title: "改变用户角色", width: 300, top: "25%", buttons: { "保存": true, "取消": false }, submit: function (v, h, f) {
            if (v == true) {
                var newRoleId = $("#ddl_UserRole").val();
                if (newRoleId != roleId) {
                    $excuteWS("~UsersWS.sectionRoleChangeByUserId", { userId: userId, sectionId: sectionId, roleId: newRoleId, userExtend: CR_json.simpleUser }, function (result) {
                        if (result) {
                            loadClassRoster();
                        } else {
                            $.jBox.error("改变角色失败!", "错误");
                        }
                    }, null, null);
                }
            }
    } });
}