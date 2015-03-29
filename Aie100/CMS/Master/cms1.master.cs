using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using JEWS.EngineClient;

public partial class CMS_Master_cms1 : System.Web.UI.MasterPage
{
    protected void Page_Load(object sender, EventArgs e)
    {
        UserExtend user = JEWS.SessionManage.SimpleUser;
        string roleId = (user != null) ? user.roleId : null;
        if (user != null && user.roleId != ((int)AieLibrary.EnumSysUserRole.Admin).ToString())
        {
            Response.Redirect("../Default.aspx");
        }

        //用户权限判断
        IList<object> funcPermissions = JEWS.SessionManage.FuncPermissions;
        if (funcPermissions != null)
        {
            string funcId = Page.GetType().Name.Replace("_aspx", "");
            bool havePermission = JEWS.UserPermissions.checkFuncPermissions(funcId, funcPermissions);
            if (!havePermission)
            {
                Response.Redirect("../Default.aspx");
            }

            string accessLevel = JEWS.UserPermissions.getOperPermissions(funcId, funcPermissions);
            if (accessLevel == null)
            {
                accessLevel = "";
            }
            Page.ClientScript.RegisterHiddenField("__accessLevel", accessLevel);
        }
        else
        {
            Response.Redirect("../Default.aspx");
        }
    }
}
