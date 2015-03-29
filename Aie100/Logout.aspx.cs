using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Logout : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        /*
         * 2、注册ApplicationKey。(参考UiPageBase.cs文件)
         * 注册AppKey
         * app_1：自定义名称，可修改。来自Wbm.QzoneV2.config配置文件设置
         */
        Wbm.QzoneV2API.QzoneBase.RegisterKey("app_1");

        ///////////////////////////////

        Wbm.QzoneV2API.QzoneBase.ClearCache();

        Response.Redirect("./");

    }
}