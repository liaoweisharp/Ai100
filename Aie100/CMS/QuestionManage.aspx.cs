using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using JEWS.EngineStudyGuide;
using JEWS;
using System.Collections.Generic;
using System.Text;
using System.Drawing;

public partial class QuestionBank_QuestionManage : System.Web.UI.Page
{

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            //Acephericslibrary.SessionManage sessionManage = new Acephericslibrary.SessionManage(this.Page);
            //SimpleUser user = sessionManage.getLoginUserSimple();

            //if (user.roleId != "0" && !checkUserOnlineOnUsed(user))
            //{
            //    // Response.Redirect("../Default.aspx");
            //    Page.ClientScript.RegisterStartupScript(this.GetType(), "haveUserOnline", "<script>alert(\"Your account has been login in another place, you\'re forced offline!\");document.getElementById('" + btnRedirect.ClientID + "').click();</script>");
            //    return;
            //}

            //if (!sessionManage.checkUserPermission(Request.Url.ToString(), user.roleId))
            //{
            //    //Page.ClientScript.RegisterStartupScript(this.GetType(), "nopermission", "<script>alert('Sorry!you have no permission to access other userinfo.')</script>");
            //    Response.Redirect("../Default.aspx");
            //    return;
            //}
        }
    }

    /// <summary>
    /// 在系统使用过程中检测用户是否在其他地点登陆
    /// </summary>
    /// <param name="user"></param>
    /// <returns></returns>
    //private bool checkUserOnlineOnUsed(SimpleUser user)
    //{
    //    bool flag = false;
    //    Hashtable ht = (Hashtable)Application["online"];
    //    if (ht != null && ht.Count > 0)
    //    {
    //        IDictionaryEnumerator idcEnum = ht.GetEnumerator();

    //        while (idcEnum.MoveNext())
    //        {
    //            if (idcEnum.Key.ToString() == (Session.SessionID + user.ID) && idcEnum.Value.ToString() == user.ID)
    //            {
    //                flag = true;
    //                break;
    //            }
    //        }

    //    }

    //    return flag;
    //}


    /// <summary>
    /// 检查用户访问权限
    /// </summary>
    /// <param name="url"></param>
    /// <param name="roleID"></param>
    /// <returns></returns>
    public bool checkUserPermission(string url, string roleID)
    {
        string currentURL = url.ToString();
        string urlStr = currentURL.Substring(0, currentURL.LastIndexOf("/")).ToLower();
        if (roleID == "0")//教师
        {
            if (urlStr.IndexOf("student") != -1 || urlStr.IndexOf("admin") != -1)
            {
                return false;
            }
        }
        else if (roleID == "1")//学生
        {
            if (urlStr.IndexOf("instructor") != -1 || urlStr.IndexOf("admin") != -1)
            {
                return false;
            }
        }
        else if (roleID == "2")//管理员
        {
            if (urlStr.IndexOf("instructor") != -1 || urlStr.IndexOf("student") != -1)
            {
                return false;
            }

        }
        return true;
    }

    protected void btnRedirect_Click(object sender, EventArgs e)
    {
        this.Page.Session.Clear();
        Response.Redirect("../Default.aspx");
    }
}
