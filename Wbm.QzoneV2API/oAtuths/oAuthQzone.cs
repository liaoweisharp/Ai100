/*
 This file was create by Xusion at 2011.10.27
 */
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Collections.Specialized;

using Wbm.QzoneV2API.Helpers;

namespace Wbm.QzoneV2API
{
    /// <summary>
    /// Oauth 2.0
    /// </summary>
    public class oAuthQzone
    {
        public const string AUTHORIZE = "https://graph.qq.com/oauth2.0/authorize";
        public const string ACCESS_TOKEN = "https://graph.qq.com/oauth2.0/token";
        public const string OPENID = "https://graph.qq.com/oauth2.0/me";

        public const string OAuthClientIdKey = "client_id";
        public const string OAuthClientSecretKey = "client_secret";
        public const string OAuthRedirectUriKey = "redirect_uri";
        public const string OAuthResponseTypeKey = "response_type";
        public const string OAuthStateKey = "state";
        public const string OAuthDisplayKey = "display";
        public const string OAuthAccessTokenKey = "access_token";
        public const string OAuthExpiresInKey = "expires_in";
        public const string OAuthRefreshTokenKey = "refresh_token";
        public const string OAuthCodeKey = "code";
        public const string OAuthGrantTypeKey = "grant_type";
        public const string OAuthUserNameKey = "username";
        public const string OAuthPasswordKey = "password";
        public const string OAuthConsumerKey = "oauth_consumer_key";
        public const string OAuthOpenIdKey = "openid";

        private ResponseTypeEnum _response_type = ResponseTypeEnum.code;
        private GrantTypeEnum _grant_type = GrantTypeEnum.authorization_code;
        private string _client_id = String.Empty;
        private string _client_secret = String.Empty;
        private string _redirect_uri = String.Empty;
        private string _access_token = String.Empty;
        private string _expires_in = String.Empty;
        private string _refresh_token = String.Empty;
        private string _code = String.Empty;
        private string _state = String.Empty;
        private DisplayEnum _display = DisplayEnum.Default;
        private string _username = String.Empty;
        private string _password = String.Empty;
        private string _scope = String.Empty;
        private string _openid = String.Empty;


        /// <summary>
        /// 授权类型，此值固定为“code”。
        /// </summary>
        public ResponseTypeEnum ResponseType { get { return _response_type; } set { _response_type = value; } }
        /// <summary>
        /// 授权类型，此值固定为“authorization_code”。
        /// </summary>
        public GrantTypeEnum GrantType { get { return _grant_type; } set { _grant_type = value; } }
        /// <summary>
        /// 申请QQ登录成功后，分配给网站的appid。
        /// </summary>
        public string ClientId { get { return _client_id; } set { _client_id = value; } }
        /// <summary>
        /// 申请QQ登录成功后，分配给网站的appkey。
        /// </summary>
        public string ClientSecret { get { return _client_secret; } set { _client_secret = value; } }
        /// <summary>
        /// 成功授权后的回调地址，建议设置为网站首页或网站的用户中心。
        /// </summary>
        public string RedirectUri { get { return _redirect_uri; } set { _redirect_uri = value; } }
        /// <summary>
        /// 通过Authorization Code获取Access Token
        /// </summary>
        public string AccessToken { get { return _access_token; } set { _access_token = value; } }
        /// <summary>
        /// accesstoken有效期时间,unix timestamp格式
        /// </summary>
        public string ExpiresIn { get { return _expires_in; } set { _expires_in = value; } }
        /// <summary>
        /// 刷新token,如果有获取权限则返回
        /// </summary>
        public string RefreshToken { get { return _refresh_token; } set { _refresh_token = value; } }
        /// <summary>
        /// 上一步返回的authorization code。
        /// </summary>
        public string Code { get { return _code; } set { _code = value; } }
        /// <summary>
        /// client端的状态值。用于第三方应用防止CSRF攻击，成功授权后回调时会原样带回。
        /// </summary>
        public string State { get { return _state; } set { _state = value; } }
        /// <summary>
        /// 用于展示的样式。不传则默认展示为为PC下的样式。
        /// </summary>
        public DisplayEnum Display { get { return _display; } set { _display = value; } }
        /// <summary>
        /// 请求用户授权时向用户显示的可进行授权的列表。
        /// <para>例如：scope=get_user_info,list_album,upload_pic,do_like</para>
        /// </summary>
        public string Scope { get { return _scope; } set { _scope = value; } }
        /// <summary>
        /// 用户的ID，与QQ号码一一对应。
        /// </summary>
        public string OpenId { get { return _openid; } set { _openid = value; } }



        /// <summary>
        /// 引导授权 HTTP请求方式 GET/POST
        /// </summary>
        /// <returns></returns>
        public string GetAuthorization()
        {
            try
            {
                List<QueryParameter> paras = new List<QueryParameter>();
                paras.Add(new QueryParameter(OAuthClientIdKey, this.ClientId));
                paras.Add(new QueryParameter(OAuthRedirectUriKey, HttpUtility.UrlEncode(this.RedirectUri)));
                paras.Add(new QueryParameter(OAuthResponseTypeKey, this.ResponseType));
                paras.Add(new QueryParameter(OAuthDisplayKey, this.Display));
                if (!string.IsNullOrEmpty(this.State))
                {
                    paras.Add(new QueryParameter(OAuthStateKey, this.State));
                }

                string ret = null;
                ret = AUTHORIZE + "?" + HttpUtil.GetQueryFromParas(paras);
                return ret;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// 换取Access Token HTTP请求方式 POST
        /// </summary>
        public void GetAccessToken()
        {
            try
            {
                if (HttpContext.Current.Request[OAuthStateKey] != null)
                {
                    this.State = HttpContext.Current.Request[OAuthStateKey];
                }
                if (this.ResponseType == ResponseTypeEnum.code)
                {
                    //response_type为code
                    this.Code = HttpContext.Current.Request[OAuthCodeKey];
                    if (string.IsNullOrEmpty(this.Code))
                    {
                        throw new Exception(string.Format("{0} 为空值", OAuthCodeKey));
                    }
                }
                else if (this.ResponseType == ResponseTypeEnum.token)
                {
                    //response_type为token
                    this.AccessToken = HttpContext.Current.Request[OAuthAccessTokenKey];
                    this.ExpiresIn = HttpContext.Current.Request[OAuthExpiresInKey];
                    this.RefreshToken = HttpContext.Current.Request[OAuthRefreshTokenKey];

                    if (string.IsNullOrEmpty(this.ExpiresIn) || string.IsNullOrEmpty(this.AccessToken))
                    {
                        throw new Exception(string.Format("{0}或者{1} 为空值", OAuthAccessTokenKey, OAuthExpiresInKey));
                    }
                }

                List<QueryParameter> paras = new List<QueryParameter>();
                paras.Add(new QueryParameter(OAuthClientIdKey, this.ClientId));
                paras.Add(new QueryParameter(OAuthClientSecretKey, this.ClientSecret));
                paras.Add(new QueryParameter(OAuthGrantTypeKey, this.GrantType.ToString()));

                if (this.GrantType == GrantTypeEnum.authorization_code)
                {
                    //grant_type为authorization_code时
                    paras.Add(new QueryParameter(OAuthCodeKey, this.Code));
                    paras.Add(new QueryParameter(OAuthRedirectUriKey, HttpUtility.UrlEncode(this.RedirectUri)));
                }
                else if (this.GrantType == GrantTypeEnum.refresh_token)
                {
                    //grant_type为refresh_token时
                    paras.Add(new QueryParameter(OAuthRefreshTokenKey, this.RefreshToken));
                }

                string response = HttpHelper.HttpPost(ACCESS_TOKEN, paras);

                if (!string.IsNullOrEmpty(response))
                {
                    NameValueCollection qs = HttpUtility.ParseQueryString(response);
                    if (qs != null && qs.Count >= 2)
                    {
                        if (qs[OAuthAccessTokenKey] != null)
                        {
                            this.AccessToken = qs[OAuthAccessTokenKey].ToString();
                            this.GetOpenId(); //获取OpenId
                        }

                        if (qs[OAuthExpiresInKey] != null)
                        {
                            this.ExpiresIn = qs[OAuthExpiresInKey].ToString();
                        }

                        if (qs[OAuthRefreshTokenKey] != null)
                        {
                            this.RedirectUri = qs[OAuthRefreshTokenKey].ToString();
                        }

                    }
                    else
                    {
                        throw new ArgumentException(response);
                    }
                }
            }
            catch (Exception ex)
            {
                ApiLogHelper.Append(ex);
                throw ex;
            }
        }

        /// <summary>
        /// 用户的ID，与QQ号码一一对应。
        /// </summary>
        public void GetOpenId()
        {
            List<QueryParameter> paras = new List<QueryParameter>();
            paras.Add(new QueryParameter(OAuthAccessTokenKey, this.AccessToken));

            string response = HttpHelper.HttpPost(OPENID, paras);
            if (!string.IsNullOrEmpty(response))
            {
                response = response.Replace("callback(", "").Replace(");", "");
                Dictionary<string, object> dic = HttpUtil.ParseJson<Dictionary<string, object>>(response);
                if (dic.ContainsKey("error") == false && dic.ContainsKey("openid") == true)
                {
                    this.OpenId = dic["openid"].ToString();
                }
                else
                {
                    throw new ArgumentException(response);
                }
            }


        }

        /// <summary>
        /// 获取oath参数
        /// </summary>
        /// <returns></returns>
        public List<QueryParameter> GetOauthParas()
        {
            List<QueryParameter> paras = new List<QueryParameter>();
            paras.Add(new QueryParameter(OAuthConsumerKey, this.ClientId));
            paras.Add(new QueryParameter(OAuthAccessTokenKey, this.AccessToken));
            paras.Add(new QueryParameter(OAuthOpenIdKey, this.OpenId));
            return paras;
        }

        /// <summary>
        /// 获取oath参数
        /// </summary>
        /// <returns></returns>
        public string GetOauthQuery()
        {
            return HttpUtil.GetQueryFromParas(GetOauthParas());
        }

        /// <summary>
        /// 授权页面类型 可选范围
        /// </summary>
        public enum DisplayEnum
        {
            /// <summary>
            /// 默认授权页面
            /// </summary>
            Default,
            /// <summary>
            /// 支持html5的手机
            /// </summary>
            Mobile,
            /// <summary>
            /// 弹窗授权页
            /// </summary>
            Popup,
            /// <summary>
            /// wap1.2页面
            /// </summary>
            Wap12,
            /// <summary>
            /// 	wap2.0页面	
            /// </summary>
            Wap20,
            /// <summary>
            /// js-sdk 专用 授权页面是弹窗，返回结果为js-sdk回掉函数		
            /// </summary>
            Js,
            /// <summary>
            /// 站内应用专用,站内应用不传display参数,并且response_type为token时,默认使用改display.授权后不会返回access_token，只是输出js刷新站内应用父框架
            /// </summary>
            Apponweibo

        }

        /// <summary>
        /// 请求的类型,可以为:authorization_code ,password,refresh_token
        /// </summary>
        public enum GrantTypeEnum
        {
            /// <summary>
            /// grant_type为authorization_code时
            /// </summary>
            authorization_code,
            /// <summary>
            /// grant_type为password时
            /// </summary>
            password,
            /// <summary>
            /// grant_type为refresh_token时
            /// </summary>
            refresh_token
        }

        /// <summary>
        /// 支持的值包括 code 和token 默认值为code
        /// </summary>
        public enum ResponseTypeEnum
        {
            /// <summary>
            /// response_type为code
            /// </summary>
            code,
            /// <summary>
            /// response_type为token
            /// </summary>
            token
        }
    }
}
