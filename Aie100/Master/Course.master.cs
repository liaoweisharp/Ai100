using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Master_Course : System.Web.UI.MasterPage
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (JEWS.SessionManage.SimpleUser == null)
        {
            Response.Redirect("../Default.aspx");
        }

        if (JEWS.SessionManage.SimpleUser.roleId == Convert.ToString((int)(AieLibrary.EnumSysUserRole.Instructor)))
        {
            master_liManageCourse.Visible = true;
        }
    }
}
