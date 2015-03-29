using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;

public partial class UserVisitInfo : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            txtDurationTime.Text = "8";
        }
    }

    public string GetUserVisitInfo() 
    {
        //string retInfo = "";
        //int hours = Convert.ToInt32(txtDurationTime.Text);
        //List<string> userInfoList = UIBLL.UsersManage.getUserVisitInfo(hours);
        //if (userInfoList != null && userInfoList.Count > 0)
        //{
        //    StringBuilder strbHtml = new StringBuilder(userInfoList.Count);
        //    strbHtml.Append("<table border='1' width='1000' cellpadding='3' cellspacing='0'>");
        //    foreach (string item in userInfoList)
        //    {
        //        strbHtml.Append(string.Format("<tr style='height:28px'><td>{0}</td></tr>", item));
        //    }
        //    strbHtml.Append("</table>");
        //    retInfo = strbHtml.ToString();
        //}
        //return retInfo;
        return "";
    }
    protected void btnOk_Click(object sender, EventArgs e)
    {
        GetUserVisitInfo();
    }
}