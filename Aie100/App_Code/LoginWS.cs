using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using JEWS;
using JEWS.EngineClient;

/// <summary>
/// LoginWS 的摘要说明
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// 若要允许使用 ASP.NET AJAX 从脚本中调用此 Web 服务，请取消注释以下行。 
 [System.Web.Script.Services.ScriptService]
public class LoginWS : System.Web.Services.WebService {

    public LoginWS () {

        //如果使用设计的组件，请取消注释以下行 
        //InitializeComponent(); 
    }

    [WebMethod(EnableSession=true)]
    public Users Users_getById(string id)
    {
        //return BLL.UsersManage.Users_getById(id);
    
        Users[] users= new JEWS.UserEngine().usersByIds(new string[]{id}, null);
        if (users != null)
        {
            return users[0];
        }
        return null;
    }

    [WebMethod(EnableSession = true,Description = "用户登录")]
    public int? checkUserLogin(string userName, string password)
    {
       // return BLL.UsersManage.checkUserLogin(userName, password);
        UserExtend user = new JEWS.UserEngine().userLoginCheck(userName, password, null);
        if (user != null)
        {
            if (user.loginState != -1)
            {
                if (user.userId != null)
                {
                    JEWS.SessionManage.SimpleUser = user;
                    JEWS.SessionManage.FuncPermissions = JEWS.UserPermissions.GetFuncPermissions(user.userId); //获取用户权限
                }
                else
                {
                    JEWS.SessionManage.SimpleUser = null;
                }
            }
            else
            {
                JEWS.SessionManage.SimpleUser = null;
            }
            return user.loginState;
        }
        return null;
    }
    [WebMethod(EnableSession = true, Description = "用户qq登录")]
    public int? checkUserLoginByQQ(string uId)
    {
        // return BLL.UsersManage.checkUserLogin(userName, password);
        UserExtend user = new JEWS.UserEngine().userLoginQQ(uId, null);
        if (user != null)
        {
            if (user.loginState != -1)
            {
                if (user.userId != null)
                {
                    JEWS.SessionManage.SimpleUser = user;
                    JEWS.SessionManage.FuncPermissions = JEWS.UserPermissions.GetFuncPermissions(user.userId); //获取用户权限
                }
                else
                {
                    JEWS.SessionManage.SimpleUser = null;
                }
            }
            else
            {
                JEWS.SessionManage.SimpleUser = null;
            }
            return user.loginState;
        }
        return null;
    }
    
}
