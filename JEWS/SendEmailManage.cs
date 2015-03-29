using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;

namespace JEWS
{
    public class SendEmailManage
    {
        public bool emailForSetPassword(string userName, string randomCode, string userEmail, string userId)
        {
            string urlPassWord = new System.Configuration.AppSettingsReader().GetValue("urlPassWord", typeof(String)).ToString(); // System.Configuration.ConfigurationSettings.AppSettings["urlPassWord"];
            
            StringBuilder strBody = new StringBuilder();
            strBody.Append(@"<p> 尊敬的用户，你好！</p>");
            strBody.Append(String.Format("<div style='text-indent:2em;'>你的登陆账号是： {0}</div>", userName));
            strBody.Append("<p>请你点击以下链接重置您的密码</p>");
            strBody.Append(String.Format("<div style='heiht:200px;width:500px;background-color:#d3fae2;margin-left:30px;'><div><a href='" + urlPassWord + "/UserManage/ForgotPassword.aspx?userId=" + userId + "&key=" + randomCode + "'>" + urlPassWord + "/UserManage/ForgotPassword.aspx?userId=" + userId + "&key=" + randomCode + "</a></div></div>"));
            strBody.Append("<p>如有任何问题, 请联系我们：support@aie100.com </p>");
            strBody.Append("<p>此致!</p>");
            strBody.Append("<p>爱易佰网络教育科技 </p>");
            try
            {
                //SendSMTPEMail("mail.emath.com", "support@aie100.com", "mapoqiao", userEmail, "Registration confirmation", strBody.ToString());
                SendSMTPEMail(null, null, null, userEmail, "爱易佰找回密码", strBody.ToString());
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }
        public bool emailForRandomCode(string userName, string randomCode, string userEmail)
        {
            StringBuilder strBody = new StringBuilder();
            strBody.Append(@"<p> 尊敬的用户，你好！</p>");
            strBody.Append(@"<div style='text-indent:2em;'>你成功获得随机码。</div>");
            strBody.Append(@"<div style='text-indent:2em;'>网址 = www.aie100.com</div>");
            strBody.Append(String.Format("<div style='text-indent:2em;'>用户名 = {0}</div>", userName));
            strBody.Append(String.Format("<div style='text-indent:2em;'>随机码 = {0}</div>", randomCode));
            strBody.Append("<p>如有任何问题, 请联系我们：support@aie100.com </p>");
            strBody.Append("<p>此致!</p>");
            strBody.Append("<p>爱易佰网络教育科技 </p>");
            try
            {
                //SendSMTPEMail("mail.emath.com", "support@aie100.com", "mapoqiao", userEmail, "Registration confirmation", strBody.ToString());
                SendSMTPEMail(null, null, null, userEmail, "随机码", strBody.ToString());
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }
        /// <summary>
        /// 发送确认邮件
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="password"></param>
        /// <param name="userEmail"></param>
        /// <param name="security_Question"></param>
        /// <param name="security_Ansewer"></param>
        /// <param name="isNeedPaid"></param>
        /// <returns></returns>
        public bool emailForRegister(string userName, string password, string userEmail, string security_Question, string security_Ansewer, bool isNeedPaid)
        {
            StringBuilder strBody = new StringBuilder();
            strBody.Append(@"<p> 尊敬的用户，你好！</p>");
            strBody.Append(@"<div style='text-indent:2em;'>恭喜你! 你成功注册到www.aie100.com. 请保存好你的信息，以便将来使用.</div>");
            strBody.Append(@"<div style='text-indent:2em;'>网址 = www.aie100.com</div>");
            strBody.Append(String.Format("<div style='text-indent:2em;'>用户名 = {0}</div>", userName));
            //strBody.Append(String.Format("<div style='text-indent:2em;'>密码 = {0}</div>", password));
            strBody.Append(String.Format("<div style='text-indent:2em;'>安全问题 = {0}</div>", security_Question));//
            strBody.Append(String.Format("<div style='text-indent:2em;'>安全问题答案= {0}</div>", security_Ansewer));
            if (isNeedPaid == true)
            {
                strBody.Append("<p>你的课程需要激活，请及时去激活你的课程. </p>");//
            }
            strBody.Append("<p>如有任何问题, 请联系我们：support@aie100.com </p>");
            strBody.Append("<p>此致!</p>");
            strBody.Append("<p>爱易佰网络教育科技 </p>");

            try
            {
                //SendSMTPEMail("mail.emath.com", "support@aie100.com", "mapoqiao", userEmail, "Registration confirmation", strBody.ToString());
                SendSMTPEMail(null, null, null, userEmail, "注册成功！", strBody.ToString());
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        /// <summary>
        /// 发送进入班级确认邮件
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="sectionName"></param>
        /// <param name="instructorName"></param>
        /// <param name="isNeedPaid"></param>
        /// <returns></returns>
        public bool emailForErollSection(string userName, string sectionName, string instructorName, string userEmail, bool isNeedPaid)
        {
            StringBuilder strBody = new StringBuilder();
            strBody.Append(@"<p> 尊敬的用户，你好！</p>");
            strBody.Append(@"<div style='text-indent:2em;'>你的课程注册成功.</div>");
            strBody.Append(@"<div style='text-indent:2em;'>Web Address = www.aie100.com</div>");
            strBody.Append(String.Format("<div style='text-indent:2em;'>用户名 = {0}</div>", userName));

            strBody.Append(String.Format("<div style='text-indent:2em;'>班级名 = {0}</div>", sectionName));//
            strBody.Append(String.Format("<div style='text-indent:2em;'>教师 = {0}</div>", instructorName));
            if (isNeedPaid == true)
            {
                strBody.Append("<p>你的课程需要激活，请及时去激活你的课程.. </p>");//
            }
            strBody.Append("<p>如有任何问题, 请联系我们：support@aie100.com </p>");
            strBody.Append("<p>此致!</p>");
            strBody.Append("<p>爱易佰网络教育科技 </p>");

            try
            {
                //SendSMTPEMail("mail.emath.com", "support@aie100.com", "mapoqiao", userEmail, "Registration confirmation", strBody.ToString());
                SendSMTPEMail(null, null, null, userEmail, "注册课程成功信息", strBody.ToString());
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }
        public bool emailForActivated(string courseName, string sectionName, string userName, string password, string userEmail, string security_Question, string security_Ansewer)
        {
            StringBuilder strBody = new StringBuilder();
            strBody.Append(@"<p> 尊敬的用户，你好！</p>");
            strBody.Append(@"<div style='text-indent:2em;'>恭喜你! 你在www.aie100.com上的课程已激活, 请保存好你的信息，以便将来使用.</div>");
            strBody.Append("<div style='text-indent:2em;'>");
            strBody.Append(@"<div >网址 = www.aie100.com</div>");
            strBody.Append(String.Format("<div>课程 = {0}</div>", courseName));
            strBody.Append(String.Format("<div>班级 = {0}</div>", sectionName));
            strBody.Append(String.Format("<div>用户名 = {0}</div>", userName));
            //strBody.Append(String.Format("<div>密码 = {0}</div>", password));
            strBody.Append(String.Format("<div>安全问题 = {0}</div>", security_Question));//
            strBody.Append(String.Format("<div>安全答案 = {0}</div>", security_Ansewer));
            strBody.Append(String.Format("<div>状态 = 激活</div>"));
            strBody.Append("</div>");
            strBody.Append("<p>如有任何问题, 请联系我们：support@aie100.com </p>");
            strBody.Append("<p>此致!</p>");
            strBody.Append("<p>爱易佰网络教育科技 </p>");
            try
            {
                //SendSMTPEMail("mail.emath.com", "support@aie100.com", "mapoqiao", userEmail, "Activation confirmation", strBody.ToString());
                SendSMTPEMail(null, null, null, userEmail, "激活信息", strBody.ToString());
                return true;
            }
            catch (Exception e)
            {
                e.ToString();
                return false;
            }
        }

        /// <summary>
        /// 发送Email方法
        /// </summary>
        /// <param name="strSmtpServer"></param>
        /// <param name="strFrom"></param>
        /// <param name="strFromPass"></param>
        /// <param name="strto"></param>
        /// <param name="strSubject"></param>
        /// <param name="strBody"></param>
        private static void SendSMTPEMail(string strSmtpServer, string strFrom, string strFromPass, string strto, string strSubject, string strBody)
        {
            if (strSmtpServer == null || strSmtpServer.Trim() == "")
            {
                strSmtpServer =new System.Configuration.AppSettingsReader().GetValue("SMTPServer", typeof(String)).ToString();//System.Configuration.ConfigurationSettings.AppSettings["SMTPServer"];
            }

            System.Net.Mail.SmtpClient client = new SmtpClient(strSmtpServer);
            client.UseDefaultCredentials = true;
            client.Port = 25;
            if (strFrom == null || strFrom.Trim() == "")
            {
                strFrom = new System.Configuration.AppSettingsReader().GetValue("From_Username", typeof(String)).ToString();//System.Configuration.ConfigurationSettings.AppSettings["From_Username"];
            }
            if (strFromPass == null || strFromPass.Trim() == "")
            {
                strFromPass = new System.Configuration.AppSettingsReader().GetValue("From_Password", typeof(String)).ToString();// System.Configuration.ConfigurationSettings.AppSettings["From_Password"];
            }
            client.Credentials = new System.Net.NetworkCredential(strFrom, strFromPass);
            client.DeliveryMethod = SmtpDeliveryMethod.Network;

            System.Net.Mail.MailMessage message = new System.Net.Mail.MailMessage(strFrom, strto, strSubject, strBody);
            message.BodyEncoding = System.Text.Encoding.UTF8;
            message.SubjectEncoding = System.Text.Encoding.UTF8;
            message.Priority = MailPriority.High;//邮件优先级
            message.IsBodyHtml = true;
            client.Send(message);
        }
    }
}
