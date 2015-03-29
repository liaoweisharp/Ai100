/*
 This file was create by Xusion at 2011.10.27
 */
using System;
using System.Collections.Generic;
using System.Text;
using System.Web;

using Wbm.QzoneV2API.Helpers;
using Wbm.QzoneV2API.Entitys;
using Wbm.QzoneV2API.QzoneServices;

namespace Wbm.QzoneV2API
{
    public static class QzoneBase
    {
        private static ApplicationEntity _application = null;
        /// <summary>
        /// AppKey 
        /// </summary>
        public static ApplicationEntity Application
        {
            set { _application = value; }
            get
            {
                if (_application == null)
                {
                    throw new ArgumentException("AppKey还没有注册。请使用RegisterKey方法进行注册");
                }
                return _application;
            }
        }
        /// <summary>
        ///  Oauth 2.0 默认使用缓存值
        /// </summary>
        /// <returns></returns>
        public static oAuthQzone oAuth()
        {
            QzoneCache cache = new QzoneCache(Application.AppName);

            return oAuth(cache.AccessToken, cache.OpenId);
        }

        /// <summary>
        ///  Oauth 2.0 
        /// </summary>
        /// <param name="AccessToken">通过Authorization Code获取的Access Token</param>
        /// <param name="OpenId">用户的ID，与QQ号码一一对应。</param>
        /// <returns></returns>
        public static oAuthQzone oAuth(string AccessToken, string OpenId)
        {
            if (Application == null)
            {
                throw new ArgumentException("AppKey还没有注册。请使用RegisterKey方法进行注册");
            }
            oAuthQzone oauth = new oAuthQzone();
            oauth.ClientId = Application.AppKey;
            oauth.ClientSecret = Application.AppSecret;
            oauth.RedirectUri = Application.RedirectUri;
            oauth.AccessToken = AccessToken;
            oauth.OpenId = OpenId;
            return oauth;
        }


        /// <summary>
        /// 注册AppKey 自定义名称，可修改。来自Wbm.QzoneV2.config配置文件设置
        /// </summary>
        /// <param name="configAppKeyName"></param>
        public static void RegisterKey(string configAppKeyName)
        {
            Application = SinaConfig.GetAppKey(configAppKeyName);
        }

        /// <summary>
        /// 是否拥有缓存值(AccessToken和OpenId)
        /// </summary>
        /// <returns></returns>
        public static bool HasCache
        {
            get
            {
                QzoneCache cache = new QzoneCache(Application.AppName);
                return !string.IsNullOrEmpty(cache.AccessToken) && !string.IsNullOrEmpty(cache.OpenId);
            }
        }

        /// <summary>
        /// 更新缓存值
        /// </summary>
        /// <param name="accessToken">通过Authorization Code获取的Access Token</param>
        /// <param name="openId">用户的ID，与QQ号码一一对应。</param>
        public static void UpdateCache(string accessToken, string openId)
        {
            QzoneCache cache = new QzoneCache(Application.AppName);
            cache.AccessToken = accessToken;
            cache.OpenId = openId;
        }

        /// <summary>
        /// 清除缓存值
        /// </summary>
        public static void ClearCache()
        {
            QzoneCache cache = new QzoneCache(Application.AppName);
            cache.AccessToken = null;
            cache.OpenId = null;
        }
    }
}
