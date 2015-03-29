
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using JEWS.EngineClient;
using JEWS;

/// <summary>
/// SectionManageWS 的摘要说明
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// 若要允许使用 ASP.NET AJAX 从脚本中调用此 Web 服务，请取消注释以下行。 
[System.Web.Script.Services.ScriptService]
public class SectionManageWS : System.Web.Services.WebService {

    public SectionManageWS () {

        //如果使用设计的组件，请取消注释以下行 
        //InitializeComponent(); 
    }

    private static Section[] Section_ChangeList(Section[] sectionList, UserExtend user)
    {
        if (sectionList != null && sectionList.Count() > 0)
        {
            string[] userIds = (from ins in sectionList select ins.userId).Distinct().ToArray();
            Users[] users = new UserEngine().usersByIds(userIds, user);
            foreach (Section section in sectionList)
            {
                if (section.userId != null)
                {
                    section.fullName = (from ins in users where ins.id == section.userId select ins).Single<Users>().userName;
                }
                else
                {
                    section.fullName = "";
                }
                
            }
            return sectionList;
        }
        else
        {
            return null;
        }
    }

    [WebMethod(EnableSession = true,Description = "查看该用户所创建的班级")]
    public Section[] Section_listByUserId(string userId,string courseId,UserExtend user)
    {
        CourseEngine ce = new CourseEngine();
        string[] sectionIds = ce.sectionIdsByUserIdCreate(userId, courseId, user);
        Section[] sectionList = ce.sectionInfoByIds(sectionIds, courseId, user);
        //if (sectionList != null && sectionList.Count() > 0)
        //{
        //    Users[] users = new UserEngine().usersByIds(new string[] { userId }, user); //BLL.UsersManage.Users_getById(userId);
        //    Users u = users != null && users.Count() > 0 ? users[0] : null;
        //    foreach (Section section in sectionList)
        //    {
        //        section.fullName = u.userName;
        //    }
        //}
        //return sectionList;
        return Section_ChangeList(sectionList, user);
       //List<Section> sectionList = BLL.CourseManage.Section_listByUserId(userId);
       //if (sectionList != null && sectionList.Count > 0)
       //{
       //    Users u = BLL.UsersManage.Users_getById(userId);
       //    foreach (Section section in sectionList)
       //    {
       //        section.Creator = u.UserName;
       //    }
       //}
       //return sectionList;
    }

    [WebMethod(EnableSession = true,Description = "根据班级名称模糊查询班级")]
    public Section[] Section_listBySectionName(string sectionName, string courseId, UserExtend user)
    {
       // return BLL.CourseManage.Section_ChangeList(BLL.CourseManage.Section_listBySectionName(sectionName));
        CourseEngine ce = new CourseEngine();
        string[] sectionIds= ce.sectionIdsBySectionName(sectionName, courseId, user);
        Section[] sectionList = ce.sectionInfoByIds(sectionIds, courseId, user);
        return Section_ChangeList(sectionList,user);
    }

    [WebMethod(EnableSession = true, Description = "根据id查询班级")]
    public Section[] sectionInfoByIds(string[] sectionIds, string courseId, UserExtend user)
    {
        return new CourseEngine().sectionInfoByIds(sectionIds, courseId, user);
    }
    
    [WebMethod(EnableSession = true,Description = "根据班级号查询班级")]
    public Section[] Section_listBySectionNumber(string sectionNumber,string courseId, UserExtend user)
    {
       // return BLL.CourseManage.Section_ChangeList(BLL.CourseManage.Section_listBySectionNumber(sectionNumber));
        CourseEngine ce = new CourseEngine();
        Section section = ce.sectionBySectionNumber(sectionNumber, courseId, user);
        return Section_ChangeList(new Section[]{section}, user);
    }
    
    [WebMethod(EnableSession = true,Description = "根据创建者查询班级")]
    public Section[] Section_listByCreator(string userName,string courseId, UserExtend user)
    {
       // return BLL.CourseManage.Section_listByCreator(userName);
        CourseEngine ce = new CourseEngine();
        string[] sectionIds = ce.sectionIdsByUserNameCreate(userName, courseId, user);
        Section[] sectionList = ce.sectionInfoByIds(sectionIds, courseId, user);
        return Section_ChangeList(sectionList, user);
    }

    ///// <summary>
    ///// 根据班级名称模糊查询班级
    ///// </summary>
    ///// <param name="sectionName"></param>
    ///// <returns></returns>
    //public static List<Section> Section_listBySectionName(string sectionName, Users user)
    //{
    //    List<Section> sectionList = BLL.CourseManage.Section_listBySectionName(sectionName);
    //    if (sectionList != null && sectionList.Count > 0)
    //    {
    //        Users u = BLL.UsersManage.Users_getById(userId);
    //        foreach (Section section in sectionList)
    //        {
    //            section.Creator = u.UserName;
    //        }
    //    }
    //    return sectionList;
    //}

    ///// <summary>
    ///// 根据班级号查询班级
    ///// </summary>
    ///// <param name="sectionNumber"></param>
    ///// <returns></returns>
    //public static List<Section> Section_listBySectionNumber(string sectionNumber)
    //{
    //    return CourseDAO.Section_listBySectionNumber(sectionNumber);
    //}

    [WebMethod(EnableSession = true,Description = "查看某课程下的所有班级")]
    public Section[] Section_listByCourseId(string courseId, UserExtend user)
    {
        //return BLL.CourseManage.Section_ChangeList(BLL.CourseManage.Section_listByCourseId(courseId));
        CourseEngine ce = new CourseEngine();
        string[] sectionIds = ce.sectionIdsByCourseId(courseId, user);
        Section[] sectionList = ce.sectionInfoByIds(sectionIds, courseId, user);
        return Section_ChangeList(sectionList, user);
    }

    [WebMethod(EnableSession = true, Description = "查看某课程下用户所创建的班级")]
    public Section[] Section_listByUserCreated(string userId, string courseId, UserExtend user)
    {
        //return BLL.CourseManage.Section_ChangeList(BLL.CourseManage.Section_listByCourseId(courseId));
        CourseEngine ce = new CourseEngine();
        string[] sectionIds = ce.sectionIdsByUserIdCreate(userId, courseId, user);
        Section[] sectionList = ce.sectionInfoByIds(sectionIds, courseId, user);
        return Section_ChangeList(sectionList, user);
    }

    [WebMethod(EnableSession = true,Description = "保存班级")]
    public Section Section_save(Section section,string userId, UserExtend user)
    {
       section.passwordFlagSpecified=section.createDateSpecified = section.flagSpecified = section.openFlagSpecified = section.sectionLimitSpecified = section.sectionNumberSpecified = true;
        //return BLL.CourseManage.Section_save(section, user);
        return new CourseEngine().sectionSave(section, userId, user);
    }

    [WebMethod(EnableSession = true,Description = "更新班级")]
    public bool? Section_update(Section section,string userId, UserExtend user)
    {
        
       // return BLL.CourseManage.Section_update(section,user);
        return new CourseEngine().sectionUpdate(section, userId, user);
    }

    [WebMethod(EnableSession = true,Description = "删除班级")]
    public bool? Section_delete(string sectionId,string userId, UserExtend user)
    {
        //return BLL.CourseManage.Section_delete(section,user);
        return new CourseEngine().sectionRemove(sectionId, userId, user);
    }

    [WebMethod(EnableSession = true,Description = "查询用户在班级中的角色")]
    public string Section_roleIdByUser(string userId, string sectionId, UserExtend user)
    {
        return new UserEngine().sectionRoleIdByUser(userId, sectionId, user);
    }

    [WebMethod(EnableSession = true, Description = "根据班级号加入班级")]
    public int? sectionJoinByNumber(string sectionNumber, string userId, string roleId, UserExtend user)
    {
        return new CourseEngine().sectionJoinByNumber(sectionNumber, userId, roleId, user);
    }

    [WebMethod(EnableSession = true, Description = "查询用户所在的班级")]
    public Section[] sectionByMyInCourse(string userId, string courseId, UserExtend user)
    {
        return new CourseEngine().sectionByMyInCourse(userId, courseId, user);
    }


    [WebMethod(EnableSession = true, Description = "判断是否需要输入密码")]
    public bool? sectionPasswordFlag(string sectionNumber, UserExtend userExtend)
    {
        return new CourseEngine().sectionPasswordFlag(sectionNumber, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "根据班级号和密码加入班级")]
    public int? sectionJoinByNumberPassword(string sectionNumber, string password, string userId, string roleId, UserExtend userExtend)
    {
        return new CourseEngine().sectionJoinByNumberPassword(sectionNumber, password, userId, roleId, userExtend);
    }
}
