/*
 This file was create by Xusion at 2011.10.27
 */
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Wbm.QzoneV2API.Helpers;

namespace Wbm.QzoneV2API.QzoneServices
{
    public class QzoneApiService
    {
        #region API服务 用户接口
        /// <summary>
        /// 获取登录用户信息，目前可获取用户昵称及头像信息。
        /// <para>注意：json、xml为小写，否则将不识别。format不传或非xml，则返回json格式数据。</para>
        /// </summary>
        /// <param name="oauth"></param>
        /// <param name="format">format: 定义API返回的数据格式。</param>
        /// <returns></returns>
        public string users_show(oAuthQzone oauth, DataFormat format = DataFormat.xml)
        {
            try
            {
                List<QueryParameter> paras = oauth.GetOauthParas();
                paras.Add(new QueryParameter("format", format));

                string httpUrl = "https://graph.qq.com/user/get_user_info";

                return HttpHelper.HttpGet(httpUrl, paras);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion

        #region DataFormat 数据格式
        /// <summary>
        /// 数据格式
        /// </summary>
        public enum DataFormat
        {
            /// <summary>
            /// XML格式
            /// </summary>
            xml,
            /// <summary>
            /// Json格式
            /// </summary>
            json
        }

        #endregion
    }
}
