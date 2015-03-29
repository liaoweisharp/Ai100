/*
 This file was create by Xusion at 2011.10.27
 */
using System;
using System.Collections.Generic;
using System.Text;
using System.Web;

using Wbm.QzoneV2API.Helpers;
using Wbm.QzoneV2API.Entitys;

namespace Wbm.QzoneV2API.QzoneServices
{
    public class QzoneCache
    {
        /// <summary>
        /// oAuth 对象 缓存名字
        /// </summary>
        private const string ACCESSTOKEN = "WBM_ACCESSTOKEN";
        private const string OPENID = "WBM_OPENID";

        /// <summary>
        /// 缓存AppKeyName
        /// </summary>
        private string AppKeyName = string.Empty;

        /// <summary>
        /// 缓存AccessToken 
        /// </summary>
        public string AccessToken
        {
            set { ApiCacheHelper.SetValue(ACCESSTOKEN + AppKeyName, value); }
            get { return ApiCacheHelper.GetValue(ACCESSTOKEN + AppKeyName) != null ? ApiCacheHelper.GetValue(ACCESSTOKEN + AppKeyName).ToString() : null; }
        }

        /// <summary>
        /// 缓存OpenId
        /// </summary>
        public string OpenId
        {
            set { ApiCacheHelper.SetValue(OPENID + AppKeyName, value); }
            get { return ApiCacheHelper.GetValue(OPENID + AppKeyName) != null ? ApiCacheHelper.GetValue(OPENID + AppKeyName).ToString() : null; }
        }

        /// <summary>
        /// 缓存值
        /// </summary>
        /// <param name="appKeyName">应用名称</param>
        public QzoneCache(string appKeyName)
        {
            this.AppKeyName = appKeyName;
        }       
    }
}
