using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Course_CourseManage : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

        if (!JEWS.UserPermissions.isValidUser(AieLibrary.EnumSysUserRole.Instructor,null))
        {
            Response.Redirect("../Default.aspx");
        }
    }
}