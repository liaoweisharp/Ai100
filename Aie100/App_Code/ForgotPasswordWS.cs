using JEWS;
using JEWS.EngineClient;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;

/// <summary>
/// ForgotPasswordWS 的摘要说明
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// 若要允许使用 ASP.NET AJAX 从脚本中调用此 Web 服务，请取消注释以下行。 
[System.Web.Script.Services.ScriptService]
public class ForgotPasswordWS : System.Web.Services.WebService {

    public ForgotPasswordWS () {

        //如果使用设计的组件，请取消注释以下行 
        //InitializeComponent(); 
    }

    [WebMethod(EnableSession = true,Description = "用户名在系统里是否已经存在,并且返回安全问题")]
    public ArrayList CheckUserName(string userName)
    {
        ArrayList returnValue = new ArrayList();
        Users userW = new UserEngine().usersByUsername(userName,null); // UIBLL.UsersManage.getUserByUserName(userName);
        if (userW != null)
        {
            //Dictionary<string, string> questionList = EmathLibrary.XmlManage.get(Server.MapPath("../Xml/constantVariable.xml").ToString(), "securityQuestion");
            //string sQuestion = "";
            //if (userW.Security_Question != null && userW.Security_Question != "")
            //{
            //    sQuestion = questionList[userW.Security_Question.Trim()];
            //}

            returnValue.Add(true);
            returnValue.Add("");
            Session["forgotpassword_userId"] = userW.id;
        }
        else
        {
            returnValue.Add(false);
        }
        return returnValue;
    }

    [WebMethod(EnableSession = true,Description = "检查答案")]
    public bool? CheckSec_Answer(string sec_Answer)
    {
        bool? returnValue = false;
        //if (Session["forgotpassword_userId"] != null)
        //{
        //    string userId = Session["forgotpassword_userId"].ToString();
        //    Users userWrapper =UIBLL.UsersManage.getUserById(userId);
        //    if (userWrapper != null)
        //    {
        //        if (userWrapper.Security_Ansewer != null)
        //        {
        //            returnValue = userWrapper.Security_Ansewer.Trim() == sec_Answer.Trim() ? true : false;
        //        }
        //        else
        //        {
        //            returnValue = false;
        //        }
        //    }
        //    else
        //    {
        //        returnValue = null;
        //    }
        //    ///Session.Remove("forgotpassword_userId");
        //}
        //else
        //{
        //    returnValue = null;
        //}
        return returnValue;
    }

    [WebMethod(EnableSession = true,Description = "修改密码")]
    public bool? ModifyPasswordByEmail(string userId, string randomCode, string newPassword)
    {
        return new UserEngine().userEditPasswordByRandomCode(userId, newPassword, randomCode, null);
        //bool? returnValue = false;

        //Users userWrapper = UIBLL.UsersManage.getUserById(userId);

        //if (userWrapper != null)
        //{

        //    if (userWrapper.RandomCode != userWrapper.RandomCode)
        //    {
        //        return null;
        //    }
        //    userWrapper.RandomCode = null;

        //    userWrapper.PassWord = newPassword;
        //    returnValue = UIBLL.UsersManage.update_User(userWrapper);
        //}
        //else
        //{
        //    returnValue = null;
        //}

        //return returnValue;
    }

    [WebMethod(EnableSession = true,Description = "修改密码")]
    public bool? ModifyPasswordBySecurity(string newPassword)
    {

        bool? returnValue = false;
        //if (Session["forgotpassword_userId"] != null)
        //{
        //    string userId = Session["forgotpassword_userId"].ToString();
        //    Wrapper.UsersWrapper userWrapper = UIBLL.UsersManage.getUserById(userId);
        //    if (userWrapper != null)
        //    {
        //        userWrapper.PassWord = newPassword;
        //        returnValue = UIBLL.UsersManage.update_User(userWrapper);
        //        if (returnValue == true)
        //        {
        //            Session.Remove("forgotpassword_userId");
        //        }
        //    }
        //    else
        //    {
        //        returnValue = null;
        //    }
        //}
        //else
        //{
        //    returnValue = null;
        //}
        return returnValue;
    }

    [WebMethod(EnableSession = true,Description = "发送重置密码邮件")]
    public bool? SendSetPasswordEmail(string userName)
    {
        UserEngine ue=new UserEngine();
        bool returnValue = false;
        Users user = ue.usersByUsername(userName, null); //MBLL.UserManageBase.getUserByUserName(userName);
        if (user != null && user.id != "" && user.id != null)
        {
            string randomCode=AieLibrary.Libray.GetString(10);
            bool? boo=ue.userSaveRandomCode(user.id, randomCode, null);
            if ((bool)boo)
            {
                returnValue = new SendEmailManage().emailForSetPassword(userName, randomCode, user.email, user.id);
            }
            else
            {
                returnValue = false;
            }
            //user.randomCode = MBLL.UserManageBase.GetRandomCode();
            //MBLL.UserManageBase.update_User(user);
            ////
            //returnValue = MBLL.UserManageBase.emailForSetPassword(user.User_Name, user.RandomCode, user.Email, user.ID);
            //if (!returnValue)
            //{
            //    user.RandomCode = "";
            //    MBLL.UserManageBase.update_User(user);
            //}
            //发送重置密码邮件。。
        }
        else
        {
            //没有这个用户名
            returnValue = false;
        }

        return returnValue;
    }
}
