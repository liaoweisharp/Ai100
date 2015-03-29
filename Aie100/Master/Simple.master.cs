using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Master_MasterPage : System.Web.UI.MasterPage
{
    protected void Page_Load(object sender, EventArgs e)
    {
        //TODO:这里要取消

        //if (JEWS.SessionManage.SimpleUser == null)
        //{
        //    Response.Redirect("../Default.aspx");
        //}

        //if (JEWS.SessionManage.SimpleUser.roleId == Convert.ToString((int)AieLibrary.EnumSysUserRole.Instructor))
        //{
        //    master_libianshen.Visible = true;
        //    spTLcenter.InnerHtml = "<span location=\"../Instructor/TeachingCenter.aspx?sectionId=" + Request["sectionId"] + "\">教学中心</span>";
        //}
        //else if (JEWS.SessionManage.SimpleUser.roleId == Convert.ToString((int)AieLibrary.EnumSysUserRole.Student))
        //{
        //    spTLcenter.InnerHtml = "<span location=\"../Student/LearningCenter.aspx?sectionId=" + Request["sectionId"] + "\">学习中心</span>";
        //}
    }
}
