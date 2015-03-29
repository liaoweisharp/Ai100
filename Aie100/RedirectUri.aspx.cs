using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class RedirectUri : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        /*
       * 2、注册ApplicationKey。(参考UiPageBase.cs文件)
       * 注册AppKey
       * app_1：自定义名称，可修改。来自Wbm.QzoneV2.config配置文件设置
       */
        Wbm.QzoneV2API.QzoneBase.RegisterKey("app_1");




        /*
            *  4、获取/缓存认证信息。(参考RedirectUri.aspx文件)
            */
        Wbm.QzoneV2API.oAuthQzone oauth = Wbm.QzoneV2API.QzoneBase.oAuth();


        oauth.GetAccessToken(); //获取认证信息
        Wbm.QzoneV2API.QzoneBase.UpdateCache(oauth.AccessToken, oauth.OpenId);//缓存认证信息
      
        //同步数据到数据库，注册成我们的用户？,在数据库里面添加openID
        Response.Redirect("./");
    }
}