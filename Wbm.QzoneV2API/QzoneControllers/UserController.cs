/*
 This file was create by Xusion at 2011.10.27
 */
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;

using Wbm.QzoneV2API.QzoneModels;
using Wbm.QzoneV2API.QzoneServices;
using Wbm.QzoneV2API.Helpers;

namespace Wbm.QzoneV2API.QzoneControllers
{
    public static class UserController
    {
        /// <summary>
        /// 获取用户信息
        /// </summary>
        /// <returns></returns>
        public static QzoneMUsers GetUser()
        {
            try
            {
                Wbm.QzoneV2API.oAuthQzone oauth = Wbm.QzoneV2API.QzoneBase.oAuth();
                QzoneV2API.QzoneServices.QzoneApiService qzone = new QzoneV2API.QzoneServices.QzoneApiService();

                QzoneMUsers user = GetModelByXml(qzone.users_show(oauth));
                user.id = oauth.OpenId;
                return user;
            }
            catch (Exception ex)
            {
                ApiLogHelper.Append(ex);
                throw ex;
            }
        }

        #region 根据返回XML来转换Model
        /// <summary>
        /// 转换XML用户信息
        /// </summary>
        /// <param name="xmlUser"></param>
        /// <returns></returns>
        private static QzoneMUsers GetModelByXml(string xmlUser)
        {
            try
            {
                if (!string.IsNullOrEmpty(xmlUser))
                {
                    XmlHelper xml = new XmlHelper();
                    xml.LoadXml(xmlUser);
                    foreach (XmlNode xuser in xml.SelectNodes("//data"))
                    {

                        return GetUserModel(xml, xuser);
                    }
                }
                return new QzoneMUsers();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// 转换XML用户Model
        /// </summary>
        /// <param name="xml"></param>
        /// <param name="xuser"></param>
        /// <returns></returns>
        public static QzoneMUsers GetUserModel(XmlHelper xml, XmlNode xuser)
        {
            string ret = xml.SelectSingleNodeText(xuser, "ret");
            string msg = xml.SelectSingleNodeText(xuser, "msg");
            string nickname = xml.SelectSingleNodeText(xuser, "nickname");
            string figureurl = xml.SelectSingleNodeText(xuser, "figureurl");
            string figureurl_1 = xml.SelectSingleNodeText(xuser, "figureurl_1");
            string figureurl_2 = xml.SelectSingleNodeText(xuser, "figureurl_2");
            string gender = xml.SelectSingleNodeText(xuser, "gender");
            if (ret != "")
            {
                QzoneMUsers user = new QzoneMUsers();
                user.nickname = nickname;
                user.figureurl = figureurl;
                user.figureurl_1 = figureurl_1;
                user.figureurl_2 = figureurl_2;
                user.gender = gender;
                return user;
            }
            else
            {
                throw new ArgumentException(string.Format("ret:{0} msg:{1}", ret, msg));
            }
        }
        #endregion
    }
}
