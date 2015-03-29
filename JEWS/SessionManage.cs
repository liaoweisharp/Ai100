
using JEWS.EngineClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace JEWS
{
    public class SessionManage
    {
        public static bool SignOutFlag
        {
            get
            {
                if (HttpContext.Current.Session["SignOutFlag"] == null)
                {
                    return false;
                }
                return (bool)(HttpContext.Current.Session["SignOutFlag"]);
                //  return  pSignOutFlag; 
            }
            set
            {
                HttpContext.Current.Session["SignOutFlag"] = value;
                //pSignOutFlag = value; 
            }
        }

        public static UserExtend SimpleUser
        {
            get
            {
                return HttpContext.Current.Session["SimpleUser"] as UserExtend;
            }
            set
            {
                //if (value == null) {
                //    throw new ArgumentOutOfRangeException("Null value not allowed for User", value, "null");
                //}
                HttpContext.Current.Session["SimpleUser"] = value;
            }
        }

        /// <summary>
        /// 用户权限
        /// </summary>
        public static IList<object> FuncPermissions
        {
            get
            {
                return HttpContext.Current.Session["FuncPermissions"] as IList<object>;
            }
            set
            {
                HttpContext.Current.Session["FuncPermissions"] = value;
            }
        }

    }
}
