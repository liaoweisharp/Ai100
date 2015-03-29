using JEWS;
using JEWS.EngineClient;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;

/// <summary>
/// RegistrationPage 的摘要说明
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// 若要允许使用 ASP.NET AJAX 从脚本中调用此 Web 服务，请取消注释以下行。 
[System.Web.Script.Services.ScriptService]
public class RegistrationWS : System.Web.Services.WebService {

    public RegistrationWS()
    {

        //如果使用设计的组件，请取消注释以下行 
        //InitializeComponent(); 
    }


    [WebMethod(EnableSession = true,Description = "得到验证码")]
    public string getCheckCode()
    {
        return Session["CheckCode"].ToString().ToLower();
    }


    [WebMethod(EnableSession = true,Description = "用户名在系统里是否已经存在")]
    public bool IsUsedForUserName(string userName)
    {
        //bool bo = UIBLL.UsersManage.IsUsedForUserName(userName);
        //return bo;
        return (bool)new UserEngine().usersExist(userName,null);
    }
    [WebMethod(EnableSession = true,Description = "注册用户")]
    public ArrayList RegistrationUser(Users user)
    {
        ArrayList returnValue = new ArrayList();
        bool isUsedForUserName = this.IsUsedForUserName(user.userName);
        if (isUsedForUserName == true)
        {
            returnValue.Add(false);
            return returnValue;
        }
        user.id = Guid.NewGuid().ToString();
        user.registerDate = DateTime.Now;

        bool? status= new UserEngine().userRegister(user, null);
        //bool status = UIBLL.UsersManage.RegistrationUser(user, haveClassCode, classCode, Server.MapPath("../Xml/constantVariable.xml").ToString());

        //保存多个安全问题，就需要修改。。。

        returnValue.Add((bool)status);//返回注册是否成功
        returnValue.Add(user.id);//返回UserId
        return returnValue;
    }
    [WebMethod(EnableSession = true, Description = "注册QQ账号")]
    public ArrayList RegistrationUserForQQ(Users user)
    {
        ArrayList returnValue = new ArrayList();
        bool isUsedForUserName = this.IsUsedForUserName(user.userName);
        if (isUsedForUserName == true)
        {
            returnValue.Add(false);
            return returnValue;
        }
        user.id = Guid.NewGuid().ToString();
        user.registerDate = DateTime.Now;
        var userQQ = Wbm.QzoneV2API.QzoneControllers.UserController.GetUser();
        user.UId = userQQ.id;
        
        bool? status = new UserEngine().userRegister(user, null);
        //bool status = UIBLL.UsersManage.RegistrationUser(user, haveClassCode, classCode, Server.MapPath("../Xml/constantVariable.xml").ToString());

        //保存多个安全问题，就需要修改。。。

        returnValue.Add((bool)status);//返回注册是否成功
        returnValue.Add(user.id);//返回UserId
        returnValue.Add(user.UId);
        return returnValue;
    }
    [WebMethod(EnableSession = true, Description = "绑定QQ账号")]
    public string BindUserForQQ(string userName,string password,string validateCode)
    {
        string userId = null;
        if(Session["CheckCode"]!=null && validateCode.ToLower()==Session["CheckCode"].ToString().ToLower()){
            userId = "-1";
            UserEngine userEngine= new JEWS.UserEngine();
            Users user = userEngine.userLoginCheckUsers(userName, password, null);
            if (user != null)
            {
                var userQQ = Wbm.QzoneV2API.QzoneControllers.UserController.GetUser();
                if (userQQ != null)
                {
                    user.UId = userQQ.id;
                    bool? status= userEngine.usersInfoEdit(user, null);
                    if (status.HasValue && status.Value == true)
                    {
                        userId = user.id;
                    }
                }
            }
            
        }
        else
        {
            //验证码错误
            userId = null;
        }
       
        //bool status = UIBLL.UsersManage.RegistrationUser(user, haveClassCode, classCode, Server.MapPath("../Xml/constantVariable.xml").ToString());
        //保存多个安全问题，就需要修改。。。
        return userId;
    }
    [WebMethod(EnableSession = true,Description = "得到所有Institute")]
    public Institute[] GetAllInstitute(UserExtend user)
    {
        // return UIBLL.CourseManage.listAllInstitute();
        string[] instituteIds= new CourseEngine().instituteIdsAllList(user);
        return new CourseEngine().instituteByIds(instituteIds, user);
    }
    [WebMethod(EnableSession = true,Description = "得到Security Question集合")]
    public Dictionary<string, string> GetSecurityQuestion()
    {
        // return EmathLibrary.XmlManage.get(Server.MapPath("../XML/constantVariable.xml"), "securityQuestion");
        return null;
    }

    [WebMethod(EnableSession = true,Description = "验证Class Code是否有效")]
    public ArrayList CheckClassCode(string classCode)
    {
        //ArrayList list = new ArrayList();
        //bool status = UIBLL.CourseManage.isClassCodeEnable(classCode);
        //list.Add(status);
        //if (status == false)
        //{
        //    return list;
        //}
        ////string sectionId= UIBLL.CourseManage.getSectionIdByClassCode(classCode);
        //Wrapper.SectionExtendWrapper sectionW = UIBLL.CourseManage.getSectionByClassCode(classCode);
        //string sectionId = sectionW.ID;
        //double price = UIBLL.CourseManage.getPriceBySectionId(sectionId);
        ////Wrapper.CourseExtendWrapper courseW = UIBLL.CourseManage.getCourseBySectionId(sectionId);

        //list.Add(sectionW);
        //list.Add(Math.Round(price, 2));

        //return list;
        return null;
    }
    [WebMethod(EnableSession = true,Description = "使用付费码付费")]
    public object RegistorPaidCode(string paidCode, string userId, string sectionId)
    {
        // return UIBLL.UsersManage.RegistorPaidCode(paidCode, userId, sectionId, Server.MapPath("../Xml/constantVariable.xml").ToString());
        return null;
    }
    [WebMethod(EnableSession = true,Description = "得到付费界面的数据")]
    public object GetPaidInfo(string userId, string sectionId)
    {
        // return UIBLL.UsersManage.getPaidInfo(userId, sectionId);
        return null;
    }
    [WebMethod(EnableSession = true,Description = "用Google方式付费")]
    public bool UpdateForGoogle(string userId, string sectionId)
    {
       // return UIBLL.UsersManage.updateForGoogle(userId, sectionId);
        return false;
    }
    [WebMethod(EnableSession = true,Description = "用注册码方式付费")]
    public bool UpdateForRegistrationCode(string userId, string sectionId)
    {
       // return UIBLL.UsersManage.UpdateForRegistrationCode(userId, sectionId);
        return false;
    }
    
}
