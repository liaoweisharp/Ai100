using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

public partial class Instructor_TeachingCenter : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string sectionId=Request["sectionId"];
        if (!JEWS.UserPermissions.isValidUser(AieLibrary.EnumSysUserRole.Instructor, sectionId))
        {
            Response.Redirect("../Default.aspx");
        }
        else
        {
            (this.Master.FindControl("master_libianshen") as HtmlGenericControl).Visible = true;
            (this.Master.FindControl("spTLcenter") as HtmlGenericControl).InnerHtml = "<span location=\"../Instructor/TeachingCenter.aspx?sectionId=" + sectionId + "\">教学中心</span>";
            (this.Master.FindControl("spEfficiency") as HtmlGenericControl).InnerHtml = "<span location=\"../Instructor/Efficiency.aspx?sectionId=" + sectionId + "\">效率排行榜</span>";

        }
    }
}