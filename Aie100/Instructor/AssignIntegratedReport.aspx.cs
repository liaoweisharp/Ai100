using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Instructor_AssignIntegratedReport : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string sectionId = Request["sectionId"];
        if (!JEWS.UserPermissions.isValidUser(AieLibrary.EnumSysUserRole.Instructor, sectionId))
        {
            Response.Redirect("../Default.aspx");
        }
    }
}