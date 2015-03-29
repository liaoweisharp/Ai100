using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class _Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        
        if (!IsPostBack)
        {
            Wbm.QzoneV2API.QzoneBase.RegisterKey("app_1");
            if (Request["signout"] == "1")
            {
                JEWS.SessionManage.SimpleUser = null;
                //qq登录退出
                Wbm.QzoneV2API.QzoneBase.ClearCache();
                //本站用户session清除，注：要不把session修改成用qq登录的那个cache?
                Session.Clear();
                JEWS.SessionManage.SignOutFlag = true;
            }
            else
            {
                //得到QQ登录的账号
                var user = Wbm.QzoneV2API.QzoneControllers.UserController.GetUser();
                if (user != null && user.id != null && user.id != "")
                {
                    hidQQuserId.Value = user.id;
                    JEWS.EngineClient.UserExtend userExtend= new JEWS.UserEngine().userLoginQQ(user.id, null);
                    if (userExtend != null&&userExtend.userId!=null&&userExtend.userId!="") {

                    }
                    else {
                        Page.Response.Redirect("UserManage/BindPage.aspx");
                    }
                }
                JEWS.SessionManage.SignOutFlag = false;
            }
        }
    }

   
    protected void btnSubmit_Click(object sender, EventArgs e)
    {
        string isChecked = hidIsChecked.Value;
        if (isChecked == "true")
        {
            Response.Redirect("Course/MyCourse.aspx");
        }
    }
}