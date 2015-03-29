/// <reference path="../../Scripts/jquery-1.4.1.min.js" />

var CMSMenuImagesMap = [
    {
        id: "mf_institute", img: "./Images/header/institue.png",
        children: [
            { id: "m_setInstitute", img: "./Images/header/m_setInstitute.png" },
            { id: "m_institutebook", img: "./Images/header/m_Discipline.png" },
            { id: "m_instituteuserbook", img: "./Images/header/m_Discipline.png" },
            { id: "m_instituteusers", img: "./Images/header/m_Discipline.png" }
        ]
    },
    {
        id: "mf_Book", img: "./Images/header/book.png",
        children: [
            { id: "m_BookInfo", img: "./Images/header/m_BookInfo.png" },
            { id: "m_CustomBookManage", img: "./Images/header/m_BookInfo.png" }
        ]
    },
    {
        id: "mf_BookContent", img: "./Images/header/bookcontent.png",
        children: [
            { id: "m_BookStructure", img: "./Images/header/m_BookStructure.png" },
            { id: "m_KnowledgeRelation", img: "./Images/header/m_KnowledgeRelation.png" },
            { id: "m_StudyReference", img: "./Images/header/m_StudyReference.png" },
            { id: "m_QuestionManage", img: "./Images/header/m_QuestionManage.png" },
            { id: "m_TestImport", img: "./Images/header/m_ImportTest.png" },
            { id: "m_CustomBook", img: "./Images/header/m_CustomBook.png" },
            { id: "m_TestManage", img: "./Images/header/m_TestManage.png" },
            { id: "m_QuestionKnowledge", img: "./Images/header/m_LoQuestion.png" },
            { id: "m_TestManage", img: "./Images/header/m_LoQuestion.png" },
            { id: "m_TestModels", img: "./Images/header/m_LoQuestion.png" }
        ]
    },
    {
        id: "mf_Settings", img: "./Images/header/setting.png",
        children: [
            { id: "m_BookStructureType", img: "./Images/header/m_BookStructureType.png" },
            { id: "m_LOCategory", img: "./Images/header/m_LOCategory.png" },
            { id: "m_StudyReferenceType", img: "./Images/header/m_StudyReferenceType.png" },
            { id: "m_TestQuestionType", img: "./Images/header/m_TestQuestionType.png" },
            { id: "m_TestQuestionTypeManage", img: "./Images/header/m_TestQuestionType.png" },
            { id: "m_TestQuestionTypeDistribute", img: "./Images/header/m_TestQuestionType.png" },
            { id: "m_Discipline", img: "./Images/header/m_Discipline.png" },
            { id: "m_Gradation", img: "./Images/header/m_Discipline.png" },
            { id: "m_Subject", img: "./Images/header/m_Subject.png" },
            { id: "m_Author", img: "./Images/header/m_Author.png" },
            { id: "m_Publisher", img: "./Images/header/m_Publisher.png" }
        ]
    },
    {
        id: "mf_UserManage", img: "./Images/header/user.png",
        children: [
            { id: "m_UserPermissionManagement", img: "./Images/header/m_UserPermissionManagement.png" },
            { id: "m_InstituteAdmin", img: "./Images/header/m_CourseUserManagement.png" }
        ]
    }
];

var SimpleUser = null;     //当前用户
var CmsMenus = [];  //菜单数据
var CmsMenusIsClick = false;  //确定菜单是否被点击
var _UserParam = {};     //用户参数
var _DefCmsSubMenuId = "";  //默认的子菜单Id

$(function () {
    //获取用户信息
    $excuteWS("~UsersWS.Users_getSimpleUserBySectionId", { sectionId: "" }, function (result) {
        if (result) {
            SimpleUser = result;
            InitHeader(result);
            InitCMSMainMenus();

            if (typeof PageLoad == "function") {
                PageLoad(); //调用页面的PageLoad
            }
        } else {
            $.jBox.error("取用户信息失败!", "错误", { buttons: { '确定': 'ok'} });
        }
    }, null, null);


    $(document)
        .click(function (event) {
            if (!CmsMenusIsClick) {
                hideCMSSubMenu();
            }
            CmsMenusIsClick = false;
        })
        .keypress(function (event) {
            if (event.keyCode == 27) {
                hideCMSSubMenu();
            }
        });
});

function InitHeader(simpleUser) {
    $excuteWS("~UsersWS.usersByIds", { userIds: [simpleUser.userId], userExtend: simpleUser }, function (users) {
        if (users && users.length > 0) {
            var userInfo = users[0].fullName;
            $("#spUser").html(userInfo);
        }
    }, null, null);
}

function InitCMSMainMenus() {
    $excuteWS("~CmsWS.GetFuncPermissions", {}, function (result) {
        if (result) {
            CmsMenus = result;

            //初始化一级菜单
            var img = "";
            var $cms_mainmenus = $("#cms_mainmenus");
            var menus = new Array();
            $.each(CmsMenus, function () {
                img = getCMSMainMenuImg(this.key);
                menus.push("<td class='cms_mainmenu'>");
                menus.push("    <ul id='" + this.key + "'>");
                menus.push("        <li class='img'><img src='" + img + "' /></li>");
                menus.push("        <li class='title'>" + this.title + "</li>");
                menus.push("    </ul>");
                menus.push("</td>");
            });
            if (menus.length > 0) {
                $cms_mainmenus.append("<table><tr>" + menus.join("") + "</tr></table>");
            }

            $(".cms_mainmenu ul").click(function () {
                CmsMenusIsClick = true;
                selectCMSMainMenu(this);
                showCMSSubMenu(this.id);
            });

            $("#cms_submenus").click(function () {
                CmsMenusIsClick = true;
            });
        }
    }, null, null);
}

//选中主菜单
function selectCMSMainMenu(oMenu) {
    $(oMenu).addClass("selected");
    $(oMenu).parent().siblings().find("ul").removeClass("selected");
}

//显示子菜单
function showCMSSubMenu(mainMenuId) {
    var img = "";
    var subMenus = getCMSSubMenus(mainMenuId);
    if (subMenus) {
        var subMenuContent = [];
        for (var i = 0; i < subMenus.length; i++) {
            img = getCMSSubMenuImg(mainMenuId, subMenus[i].key)
            if (subMenus[i].key == _DefCmsSubMenuId) {
                subMenuContent.push("<li style='color:#ff900a;cursor:default' id='" + subMenus[i].key + "''><img src='" + img + "' />" + subMenus[i].title + "</li>");
            } else {
                subMenuContent.push("<li id='" + subMenus[i].key + "' onclick='CMSMenuClickHandler(\"" + subMenus[i].key + "\")'><img src='" + img + "' />" + subMenus[i].title + "</li>");
            }
        }
        if (subMenuContent.length > 0) {
            var $cms_submenus = $("#cms_submenus");
            $cms_submenus.empty().append("<ul>" + subMenuContent.join("") + "</ul>").css("width", "").show();
            if ($cms_submenus.width() < 450) {
                $cms_submenus.width(450);
            } 
        }
    }
}

function CMSMenuClickHandler(menuId) {
    if (menuId) {
        var actionName = menuId + '_click';
        var exp = "if (typeof(" + actionName + ") != 'undefined') {eval(" + actionName + "())}";
        eval(exp);
    }
}


//隐藏子菜单
function hideCMSSubMenu() {
    $(".cms_mainmenu .selected").removeClass("selected");
    $("#cms_submenus").hide();
}

//返回子菜单数据
function getCMSSubMenus(mainMenuId) {
    var subMenus = null;
    var i = CmsMenus.indexOf("key", mainMenuId);
    if (i != -1) {
        subMenus = CmsMenus[i].children;
    }
    return subMenus;
}

//返回主菜单的图标
function getCMSMainMenuImg(menuId) {
    
    var mainImg = "";
    var i = CMSMenuImagesMap.indexOf("id", menuId);
    if (i != -1) {
        mainImg = CMSMenuImagesMap[i].img;
    }
    return mainImg;
}

//返回子菜单的图标
function getCMSSubMenuImg(mainMenuId, subMenuId) {
    var subImg = "";
    var i = CMSMenuImagesMap.indexOf("id", mainMenuId);
    if (i != -1) {
        var j = CMSMenuImagesMap[i].children.indexOf("id", subMenuId);
        if (j != -1) {
            subImg = CMSMenuImagesMap[i].children[j].img;
        }
    }
    return subImg;
}

function InitCmsMenu(def) {
    _DefCmsSubMenuId = def;
}

//添加自定义参数
function AddUserParam(key, value) {
    _UserParam[key] = value;
}

//设置自定义参数
function SetUserParam(key, value) {
    for (k in _UserParam) {
        if (k == key) {
            _UserParam[k] = value;
        }
    }
}

/**
* 根据浏览器窗口大小，重置容器的高度(不能设置隐藏容器的高度)
**/
function ResetFrameHeight(objId, bottomOffset) {
    var $obj = $("#" + objId);
    var bottomOffset = bottomOffset || 25;   //底部空出间距
    var h = $(window).height() - $obj.offset().top - bottomOffset;
    $obj.height(h);
}

/**
* 根据浏览器窗口大小，重置树型导航框架中左右容器的高度(不能设置隐藏容器的高度)
**/
function ResetTreeNavFrameHeight(leftDiv, rightDiv, bottomOffset) {
    var oL = $("#" + leftDiv);
    var oR = $("#" + rightDiv);
    var bottomOffset = bottomOffset || 25;   //底部空出间距
    var h = $(window).height() - oL.offset().top - bottomOffset;

    oL.height(h);
    oR.height(h);
}


/**
* 根据浏览器窗口大小设置容器大小（小于最大可显示值:尺寸不变；大于最大可显示值: 按最大值显示）
**/
function _resizeCmsBox(objId, bottomOffset) {
    var $obj = ($("#" + objId).get(0)) ? $("#" + objId) : $("." + objId);
    if ($obj.get(0)) {
        var bottomOffset = bottomOffset || 25;   //底部空出间距
        var h = $(window).height() - $obj.offset().top - bottomOffset;
        if ($obj.height() > h) {
            $obj.height(h).css("overflow", "auto");
        } else {
            $obj.css({ "height": "", "overflow": "" });
        }

        $(window).unbind("resize").resize(function () {
            $obj.css({ "height": "", "overflow": "" });
            _resizeCmsBox(objId, bottomOffset);
        });
    }
}

///菜单事件名称=菜单Id + ‘_click’
function m_BookInfo_click() {
    window.location.href = "BookInfo.aspx";
}

function m_CustomBookManage_click() {
    window.location.href = "BookInfo.aspx?real=1";
}

function m_myBookInfo_click() {
    window.location.href = "MyBookInfo.aspx";
}

function m_Discipline_click() {
    window.location.href = "Discipline.aspx";
}

function m_Gradation_click() {
    window.location.href = "Gradation.aspx";
}

function m_Subject_click() {
    window.location.href = "Subject.aspx";
}

function m_Author_click() {
    window.location.href = "Author.aspx";
}

function m_Publisher_click() {
    window.location.href = "Publisher.aspx";
}

function m_BookStructure_click() {
    var urlParam = "";
    if (_UserParam.isbn) {
        urlParam = "?isbn=" + _UserParam.isbn;
    }
    window.location.href = "BookStructure.aspx" + urlParam;
}

function m_BookStructureType_click() {
    window.location.href = "BookStructureType.aspx";
}

function m_StructureContentType_click() {
    window.location.href = "StructureContentType.aspx";
}

function m_KnowledgeRelation_click() {
    var urlParam = "";
    if (_UserParam.isbn) {
        urlParam = "?isbn=" + _UserParam.isbn;
    }
    window.location.href = "KnowledgePointRelation.aspx" + urlParam;
}

function m_LOCategory_click() {
    window.location.href = "LoCategory.aspx";
}

function m_StudyReference_click() {
    var urlParam = "";
    if (_UserParam.isbn) {
        urlParam = "?isbn=" + _UserParam.isbn;
    }
    window.location.href = "StudyResource.aspx" + urlParam;
}

function m_StudyReferenceType_click() {
    window.location.href = "StudyReferenceType.aspx";
}

function m_QuestionManage_click() {
    var urlParam = "";
    if (_UserParam.isbn) {
        urlParam = "?isbn=" + _UserParam.isbn;
    }
    window.location.href = "QuestionManage.aspx" + urlParam;
}

function m_TestImport_click() {
    
    var urlParam = "";
    if (_UserParam.isbn) {
        urlParam = "?isbn=" + _UserParam.isbn;
    }
    window.location.href = "ImportTest.aspx" + urlParam;
}

function m_CustomBook_click() {
    var urlParam = "";
    if (_UserParam.isbn) {
        urlParam = "?isbn=" + _UserParam.isbn;
    }
    window.location.href = "CustomBook.aspx" + urlParam;
}

function m_QuestionKnowledge_click() {
    var urlParam = "";
    if (_UserParam.isbn) {
        urlParam = "?isbn=" + _UserParam.isbn;
    }
    window.location.href = "QuestionKnowledge.aspx" + urlParam;
}

function m_TestManage_click() {
    var urlParam = "";
    if (_UserParam.isbn) {
        urlParam = "?isbn=" + _UserParam.isbn;
    }
    window.location.href = "TestManage.aspx" + urlParam;
}

function m_TestModels_click() {
    var urlParam = "";
    if (_UserParam.isbn) {
        urlParam = "?isbn=" + _UserParam.isbn;
    }
    window.location.href = "TestModels.aspx" + urlParam;
}

function m_TestQuestionType_click() {
    window.location.href = "TestQuestionType.aspx";
}

function m_TestQuestionTypeManage_click() {
    window.location.href = "TestQuestionTypeManage.aspx";
}

function m_TestQuestionTypeDistribute_click() {
    window.location.href = "TestQuestionTypeDistribute.aspx";
}

function m_SysUserManagement_click() {

    window.location.href = "SystemUser.aspx";
}

function m_CourseUserManagement_click() {
    window.location.href = "UserManage.aspx";
}

function m_UserOnlineStatus_click() {
    window.location.href = "UserVisitInfo.aspx";
}

function m_UserPermissionManagement_click() {
    window.location.href = "Permission.aspx";
}

function m_UserMessage_click() {
    window.location.href = "Message.aspx";
}

function m_Curriculum_click() {
    window.location.href = "CurriculumManage.aspx";
}

function m_ErrorManagement_click() {
    window.location.href = "ErrorManagementForCMS.aspx";
}

function m_ReportingErrors_click() {
    window.location.href = "CorrectionManage.aspx";
}

function cms_curriculummanage_click() {
    window.location.href = "CurriculumManage.aspx";
}

function m_setInstitute_click() {
    window.location.href = "InstituteInfo.aspx";
}

function m_book_click() {
    window.location.href = "ClientBook.aspx";
}

function m_institutebook_click() {
    window.location.href = "InstituteBook.aspx";
}

function m_instituteuserbook_click() {
    window.location.href = "InstituteUserBook.aspx";
}

function m_instituteusers_click() {
    window.location.href = "InstituteUsers.aspx";
}

function m_InstituteAdmin_click() {
    window.location.href = "InstituteAdmin.aspx";
}