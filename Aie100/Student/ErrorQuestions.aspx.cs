using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

public partial class Student_ErrorQuestions : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string sectionId = Request["sectionId"];
        if (!JEWS.UserPermissions.isValidUser(AieLibrary.EnumSysUserRole.Student, sectionId))
        {
            Response.Redirect("../Default.aspx");
        }
        //else
        //{
        //    (this.Master.FindControl("spTLcenter") as HtmlGenericControl).InnerHtml = "<span location=\"../Student/LearningCenter.aspx?sectionId=" + sectionId + "\">学习中心</span>";
        //}
    }
}