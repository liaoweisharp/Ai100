/// <reference path="../../Scripts/jquery-1.4.1.min.js" />

var CurrUserExtend = null;

function PageLoad() {
    InitCmsMenu("m_UserPermissionManagement");
    $excuteWS("~UsersWS.usersByUserIdBookId", { userId: SimpleUser.userId, bookId: "", userExtend: SimpleUser }, function (result) {
        CurrUserExtend = result
        BindInstitute();
    }, null, null);


    $("#cms_toolbar #btnSave").click(function () {
        if ($("#institute").val() == "-1") {
            $.jBox.info("请选学院", "提示", { buttons: { '确定': true } });
            return;
        }
        if (!$("#perUserList tr").hasClass("selected")) {
            $.jBox.info("请选用户", "提示", { buttons: { '确定': true } });
            return;
        }
        if ($("#dvPermissionsTree").find("#_NoInstituteFuncs").get(0)) {
            $.jBox.info("该学院没有设置权限", "提示", { buttons: { '确定': true } });
            return;
        }
        savePermissions();
    });

    $("#selPermissionType").change(function () {
        var $selRow = $("#perUserList tr.selected");
        if ($selRow.get(0)) {
            $("#perUserList tr.selected").trigger("click");
        }
    });

    $("#institute").change(function () {
        var vals = $(this).val();
        $("#perUserList").find("tr:gt(0)").remove();
        $("#dvPermissionsTree").empty();
        if (vals != -1) {
            loadUserList(vals);
        }
    });
}

function loadUserList(vals) {
    $("#tdUserBox").showLoading();
    $excuteWS("~CourseWS.getInstituteAdminData", { instituteId: vals, userExtend: SimpleUser }, bindContentAdminList, null, null);
}

var CA_OldSelectedRow = null; //上一次被选中的行
function bindContentAdminList(users) {
    var instituteAdmins = users[0];
    var users = users[1];

    $("#tdUserBox").hideLoading();
    $userList = $("#perUserList");
    if (!instituteAdmins || instituteAdmins.length == 0) {
        $userList.append("<tr class='nodata lightblue'><td>无用户信息</td></tr>");
        return;
    }

    var instituteAdminId = getInstituteAdminId(instituteAdmins);
    var sBuilder = [];
    var rowClass = "";
    var n;
    $.each(instituteAdmins, function (i) {
        if (i % 2 == 0) {
            rowClass = "class='lightblue'";
        } else {
            rowClass = "";
        }

        n = users.indexOf("id", this.userId);
        fullName = (n != -1) ? users[n].fullName : "";
        userName = (this.superFlag == 1) ? "<span style='color:#eb2319'>" + fullName + "</span>" : "<span>" + fullName + "</span>";

        sBuilder = [];
        sBuilder.push("<tr id='" + this.userId + "' instituteAdmin='" + this.superFlag + "'  " + rowClass + ">");
        sBuilder.push("<td>" + userName + "</td>");
        sBuilder.push("</tr>");
        $userList.append(sBuilder.join(''));
    });

    $userList.find("tr:gt(0)").click(function () {
        //if ($(this).hasClass("selected")) return;
        if (CA_OldSelectedRow) {
            $(CA_OldSelectedRow).removeClass("selected");
        }
        $(this).addClass("selected");
        CA_OldSelectedRow = this;
        if ($("#selPermissionType").val() == "1") {
            $("#tdPermissions").showLoading();
            if ($(this).attr("instituteAdmin") == "1") {
                getFuncPermission(this.id);
            } else {
                $excuteWS("~CmsWS.GetContentAdminFunctions", { userId: this.id, instituteAdminId: instituteAdminId }, bindFunctionsTree, null, { userId: this.id });
            }
        } else {
            //getContentPermission(this.id);
            $("#tdPermissions").showLoading();
            if ($(this).attr("instituteAdmin") == "1") {
                getContentPermission(this.id);
            } else {
                $excuteWS("~CmsWS.GetContentAdminContent", { userId: this.id, instituteAdminId: instituteAdminId }, bindContentsTree, null, { userId: this.id });
            }
        }
    })
    .hover(function () {
        $(this).addClass("hover");
    }, function () {
        $(this).removeClass("hover");
    });
}

//得到学院管理员ID
function getInstituteAdminId(iusers) {
    var instituteAdminId = "";
    var i = iusers.indexOf("superFlag", 1);
    if (i != -1) {
        instituteAdminId = iusers[i].userId;
        if (CurrUserExtend.adminRole == 0) {
            //将学院管理员排在第一个位置
            var obj = iusers.splice(i, 1)[0];
            iusers.splice(0, 0, obj);
        } else {
            //非超级管理员不可编辑学院管理员的权限
            iusers.splice(i, 1);
            //非超级管理员不可编辑自己的权限
            var n = iusers.indexOf("userId", CurrUserExtend.userId);
            if (n != -1) {
                iusers.splice(n, 1);
            }
        }
    }
    return instituteAdminId;
}

//返回用户的功能权限
function getFuncPermission(userId) {
    $("#tdPermissions").showLoading();
    $excuteWS("~CmsWS.GetCmsFunctions", { userId: userId }, bindFunctionsTree, null, { userId: userId });
}

function bindFunctionsTree(result, context) {
    $("#tdPermissions").hideLoading();
    var $dvPermissionsTree = $("#dvPermissionsTree");
    if (!result || result.length == 0) {
        $dvPermissionsTree.empty().html("<div id='_NoInstituteFuncs' style='color: #b30d24;padding-left: 6px;'>该学院没有设置权限!</div>");
        return;
    }

    $dvPermissionsTree.dynatree({
        checkbox: true,
        selectMode: 3,
        clickFolderMode: 1,
        children: result,
        onDblClick: function (node, event) {
            node.toggleExpand();
        }
    });

    $dvPermissionsTree.dynatree("getTree").reload(); //刷新树

    $dvPermissionsTree.dynatree("getRoot").visit(function (node) {
        if (node.data.isFolder && node.data.select) {
            node.select(true);
        }
        if (node.data.parentKey == "") {
            node.expand(true);
        }
    });
    $dvPermissionsTree.data("userId", context.userId);
}

//保存权限
function savePermissions() {
    var $dvPermissionsTree = $("#dvPermissionsTree");
    var userId = $dvPermissionsTree.data("userId");
    var instituteAdminFlg = $("#perUserList tr.selected").attr("instituteAdmin");

    if ($("#selPermissionType").val() == "1") {
        var permissions = [];
        if (instituteAdminFlg == "1") {
            //学院管理员的权限
            getFunPermissions($dvPermissionsTree.dynatree("getRoot").getChildren(), permissions);
        } else {
            //内容管理员的权限
            getFunPermissionsByContent($dvPermissionsTree.dynatree("getRoot").getChildren(), permissions);
        }

        var userPrivilege = {};
        userPrivilege.userId = userId;
        userPrivilege.contentType = "1";
        userPrivilege.contentId = permissions.join(",");
        $excuteWS("~CmsWS.SaveFuncPermissions", { funcPermissions: userPrivilege, userExtend: SimpleUser }, onSavePermissions, null, null);
    } else {
        var contentPrivilege = [];
        var arrSubjectId = [];
        var arrBookId = [];

        if (instituteAdminFlg == "1") {
            //学院管理员的权限
            getContentPermissions($dvPermissionsTree.dynatree("getRoot").getChildren(), arrSubjectId, arrBookId);
        } else {
            //内容管理员的权限
            getContentPermissionsByContent($dvPermissionsTree.dynatree("getRoot").getChildren(), arrBookId);
        }

        var subjectPrivilege = {};
        subjectPrivilege.userId = userId;
        subjectPrivilege.contentType = "2";
        subjectPrivilege.contentId = arrSubjectId.join(",");
        contentPrivilege.push(subjectPrivilege);

        var bookPrivilege = {};
        bookPrivilege.userId = userId;
        bookPrivilege.contentType = "3";
        bookPrivilege.contentId = arrBookId.join(",");
        contentPrivilege.push(bookPrivilege);
        $excuteWS("~CmsWS.SaveContentPermissions", { contentPermissions: contentPrivilege, userExtend: SimpleUser }, onSavePermissions, null, null);
    }
}

//获取当前设置的学院管理员的功能权限
function getFunPermissions(children, permissions) {
    var child = null;
    for (var i = 0; i < children.length; i++) {
        child = children[i];
        if (child.isSelected()) {
            permissions.push(child.data.key);
        } else if (child.hasChildren()) {
            getFunPermissions(child.getChildren(), permissions);
        }
    }
}

//获取当前设置的内容管理员的功能权限
function getFunPermissionsByContent(children, permissions) {
    var child = null;
    for (var i = 0; i < children.length; i++) {
        child = children[i];
        if (child.hasChildren()) {
            getFunPermissionsByContent(child.getChildren(), permissions);
        } else if (child.isSelected()) {
            permissions.push(child.data.key);
        }
    }
}

//获取当前设置的学院管理员的内容权限
function getContentPermissions(children, arrSubjectId, arrBookId) {
    var child = null;
    for (var i = 0; i < children.length; i++) {
        child = children[i];
        if (child.getLevel() > 1 && child.isSelected()) {
            if (child.getLevel() == 2) {
                arrSubjectId.push(child.data.key);
            } else if (child.getLevel() == 3) {
                arrBookId.push(child.data.key);
            }
        } else if (child.hasChildren()) {
            getContentPermissions(child.getChildren(), arrSubjectId, arrBookId);
        }
    }
}

//获取当前设置的内容管理员的内容权限
function getContentPermissionsByContent(children, arrBookId) {
    var child = null;
    for (var i = 0; i < children.length; i++) {
        child = children[i];
        if (child.getLevel() == 3 && child.isSelected()) {
            arrBookId.push(child.data.key);
        } else if (child.hasChildren()) {
            getContentPermissionsByContent(child.getChildren(), arrBookId);
        }
    }
}

function onSavePermissions(result) {
    if (result == null) {
        $.jBox.tip("不可编辑管理员权限！", 'warning');
    } else if (result == true) {
        $.jBox.tip("保存成功！", 'success');
    } else {
        $.jBox.tip("保存失败！", 'error');
    }
}

//返回内容权限
function getContentPermission(userId) {
    $("#tdPermissions").showLoading();
    $excuteWS("~CmsWS.GetCmsContents", { userId: userId }, bindContentsTree, null, { userId: userId });
}

function bindContentsTree(result, context) {
    $("#tdPermissions").hideLoading();
    var $dvPermissionsTree = $("#dvPermissionsTree");
    if (!result || result.length == 0) {
        $dvPermissionsTree.empty().html("<div id='_NoInstituteFuncs' style='color: #b30d24;padding-left: 6px;'>该学院没有设置权限!</div>");
        return;
    }

    if (!result) {
        $dvPermissionsTree.empty();
        return;
    }

    $dvPermissionsTree.dynatree({
        checkbox: true,
        selectMode: 3,
        clickFolderMode: 1,
        children: result,
        onDblClick: function (node, event) {
            node.toggleExpand();
        }
    });

    $dvPermissionsTree.dynatree("getTree").reload(); //刷新树

    $dvPermissionsTree.dynatree("getRoot").visit(function (node) {
        if (node.data.isFolder && node.data.select) {
            node.select(true);
        }
        if (node.getLevel() == 1) {
            node.expand(true);
        }
    });
    $dvPermissionsTree.data("userId", context.userId);
}
//返回所有学校
function BindInstitute() {
    $excuteWS("~CourseWS.institutesMyManageList", { userId: SimpleUser.userId, userExtend: SimpleUser }, function (institutes) {
        if (institutes && institutes.length > 0) {
            var options = [];
            $.each(institutes, function () {
                options.push("<option value='" + this.id + "'>" + this.name + "</option>");
            });
            $("#institute").append(options.join(''));
        }
    }, null, null);
}