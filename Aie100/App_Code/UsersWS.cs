using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Collections;

using JEWS;
using JEWS.EngineClient;
/// <summary>
/// UsersWS 的摘要说明
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// 若要允许使用 ASP.NET AJAX 从脚本中调用此 Web 服务，请取消注释以下行。 
[System.Web.Script.Services.ScriptService]
public class UsersWS : System.Web.Services.WebService {

    public UsersWS () {

        //如果使用设计的组件，请取消注释以下行 
        //InitializeComponent(); 
    }



    [WebMethod(EnableSession = true, Description = "返回当前用户的一些基本信息")]
    public UserExtend Users_getSimpleUserBySectionId(string sectionId)
    {
        //return BLL.UsersManage.Users_getByUserIdSectionId(userId, sectionId);
        UserExtend simpleUser = JEWS.SessionManage.SimpleUser;
        if (simpleUser != null && simpleUser.sectionId != sectionId)
        {
            JEWS.SessionManage.SimpleUser = new UserEngine().usersByUserIdSectionId(simpleUser.userId, sectionId, simpleUser);
            return JEWS.SessionManage.SimpleUser;
        }

        return JEWS.SessionManage.SimpleUser;
    }

    [WebMethod(EnableSession = true, Description = "返回指定用户的一些基本信息")]
    public UserExtendClient Users_getSimpleUserByUserSectionId(string userId, string sectionId)
    {
        var realUserExtend = JEWS.SessionManage.SimpleUser;
        if (realUserExtend == null)
        {
            return null;
        }
        UserExtend simpleUser= new UserEngine().usersByUserIdSectionId(userId, sectionId,null);
        UserExtendClient userExtendClient= TOOLS.ObjectUtil.CopyObjectPoperty<UserExtendClient, UserExtend>(simpleUser);
        userExtendClient.realUserExtend = realUserExtend;
        return userExtendClient;
    }

    //[WebMethod(EnableSession = true, Description = "返回当前用户的一些基本信息")]
    //public void Users_getByUserIdSectionId(string userId, string sectionId)
    //{
    //    Users users = BLL.UsersManage.Users_getByUserIdSectionId(userId, sectionId);
    //    string jsoncallback = HttpContext.Current.Request["jsoncallback"];
 
    //    //返回数据的方式

    //    //  其中将泛型集合使用了Json库(第三方序列json数据的dll)转变成json数据字符串
    //    Tools.JSONObject o = new Tools.JSONObject();
    //    o.Add("users", users);
    //    string result = jsoncallback + "(" + Tools.JSONConvert.SerializeObject(o) + ")";

    //    HttpContext.Current.Response.Write(result);

    //    HttpContext.Current.Response.End();
 

    //}

    [WebMethod(EnableSession = true, Description = "根据主键集合得到用户对像集合")]
    public Users[] usersByIds(string[] userIds, UserExtend userExtend)
    {
        return new UserEngine().usersByIds(userIds, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "返回所有学院ID")]
    public string[] instituteIdsAllList(UserExtend userExtend)
    {
        return new UserEngine().instituteIdsAllList(userExtend);

    }

    [WebMethod(EnableSession = true, Description = "查询我加入的的学院")]
    public string[] instituteIdsMyList(string userId, UserExtend userExtend)
    {
        return new UserEngine().instituteIdsMyList(userId, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "查询我是教师的学院")]
    public string[] instituteIdsMyByInstructorList(string userId, UserExtend userExtend)
    {
        return new UserEngine().instituteIdsMyByInstructorList(userId, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "根据主键查询学院")]
    public Institute[] instituteByIds(string[] instituteIds, UserExtend userExtend)
    {
        return new UserEngine().instituteByIds(instituteIds, userExtend);
    }

    [WebMethod(EnableSession = true,Description = "返回学院管理员")]
    public String[] usersAdminByInstituteId(String instituteId, UserExtend userExtend)
    {
        return new UserEngine().usersAdminByInstituteId(instituteId, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "根据sectionID得到全班的用户id集合")]
    public String[] usersIdsBySectionId(string sectionId, UserExtend userExtend)
    {
        return new UserEngine().usersIdsBySectionId(sectionId, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "根据sectionID得到全班的学生id集合")]
    public string[] usersIdsStdBySectionId(string sectionId, UserExtend userExtend)
    {
        return new UserEngine().usersIdsStdBySectionId(sectionId, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "根据sectionID得到全班的阅卷对应表")]
    public UserUserSection[] uuSectionListBySectionId(string sectionId, UserExtend userExtend)
    {
        return new UserEngine().uuSectionListBySectionId(sectionId, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "管理阅卷对应表")]
    public bool? userUserSectionManage(UserUserSection[] uuss, string sectionId, UserExtend userExtend)
    {
        return new UserEngine().userUserSectionManage(uuss, sectionId, userExtend);
    }

    
    [WebMethod(EnableSession = true, Description = "返回学生与阅卷人信息")]
    public IList getStudExaminerInfo(string sectionId, UserExtend userExtend)
    {
        IList studExaminerInfo = new ArrayList();
        UserEngine ue = new UserEngine();

        //得到班级的学生
        string[] studentIds = ue.usersIdsStdBySectionId(sectionId, userExtend);
        Users[] students = ue.usersByIds(studentIds, userExtend);
        studExaminerInfo.Add(students);

        //得到学生阅卷人对应表
        UserUserSection[] uuSection = ue.uuSectionListBySectionId(sectionId, userExtend);
        studExaminerInfo.Add(uuSection);

        return studExaminerInfo;
    }

    [WebMethod(EnableSession = true, Description = "返回班级花名册")]
    public IList getClassRosterInfo(string sectionId, string fullName, string userName, UserExtend userExtend)
    {
        IList studInfo = new ArrayList();
        UserEngine ue = new UserEngine();

        //得到班级用户
        string[] userIds = ue.userIdsBySectionConditions(sectionId, fullName, userName, userExtend);
        Users[] users = ue.usersByIds(userIds, userExtend);
        studInfo.Add(users);

        UserSection[] us = ue.userSectionByUserIds(userIds, sectionId, userExtend);
        studInfo.Add(us);

        return studInfo;
    }

    [WebMethod(EnableSession = true, Description = "设置用户的可用状态")]
    public bool? usFlagUpdate(string userId, string sectionId, int flag, UserExtend userExtend)
    {
        return new UserEngine().usFlagUpdate(userId, sectionId, flag, userExtend);
    }


    [WebMethod(EnableSession = true, Description = "查找用户")]
    public Users userIdsByUsername(string userName, UserExtend userExtend)
    {
        return new UserEngine().userIdsByUsername(userName, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "返回一个班的用户")]
    public string[] userIdsBySectionConditions(string sectionId, string fullName, string userName, UserExtend userExtend)
    {
        return new UserEngine().userIdsBySectionConditions(sectionId, fullName, userName, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "返回一个班的学生")]
    public Users[] getUsersBySection(string sectionId, UserExtend userExtend)
    {
        UserEngine ue = new UserEngine();
        string[] userIds = ue.userIdsBySection(sectionId, "1" ,userExtend);
        return ue.usersByIds(userIds, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "班级角色改变")]
    public bool? sectionRoleChangeByUserId(string userId, string sectionId, string roleId, UserExtend userExtend)
    {
        return new UserEngine().sectionRoleChangeByUserId(userId, sectionId, roleId, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "退出班级 直接删除用户与班的关系表的数据")]
    public bool? sectionExitByUserId(string userId, string sectionId, UserExtend userExtend)
    {
        return new UserEngine().sectionExitByUserId(userId, sectionId, userExtend);

    }

    [WebMethod(EnableSession = true, Description = "返回用户信息")]
    public UserExtend usersByUserIdBookId(string userId, string bookId, UserExtend userExtend)
    {
        return new UserEngine().usersByUserIdBookId(userId, bookId, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "返回所有学生")]
    public Users[] usersStdBySectionId(string sectionId,UserExtend userExtend){
        return new UserEngine().usersStdBySectionId(sectionId, userExtend);
    }
}

public class UserExtendClient : UserExtend
{
    public UserExtend realUserExtend
    {
        set;
        get;
    }
}