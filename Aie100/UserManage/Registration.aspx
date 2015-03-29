<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Registration.aspx.cs" Inherits="UserManage_Registration" 
    MasterPageFile="~/Master/Compact.master" Title="注册"%>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <link href="../Styles/left_sty.css?version=1127" rel="stylesheet" />
    <link href="../Styles/Pages/Registration.css?version=1127" rel="stylesheet" />

    <script src="../Scripts/jquery-1.4.1.min.js?version=1127" type="text/javascript"></script>
    <link href="../Plugins/Stip/Stip.css?version=1127" rel="stylesheet" />
    <script src="../Plugins/Stip/Stip.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/email.emath.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/jquery.validate.min.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/jBox/jquery.jBox-2.3.min.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/jBox/i18n/jquery.jBox-zh-CN.js?version=1127" type="text/javascript"></script>
    <link href="../Plugins/jBox/Skins/Default/jbox.css?version=1127" rel="stylesheet" />

    <script src="../Scripts/jquery.ajax.js?version=1127" type="text/javascript"></script>
    <script src="../Scripts/Pages/Registration.js?version=1127" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="conbox">
        <div class="cont_box1000">
            <div id="logins" style="float: right;">
                已有账号? <a href="../Default.aspx">马上登陆</a></div>
            <br />
            <br />
            <div style="background-color: #2A8C25;color: #FFFFFF;padding: 12px 35px;">
                <span id="spFeatureName">注册新帐号</span>
            </div>
            <div style="border:1px solid #ccc">
                <form id="registerForm" name="registerForm">
                <fieldset>
                    <legend>请设置您的帐号名称</legend>
                    <div>
                        <div class="left">
                            <b>*</b> 电子邮箱</div>
                        <input id="User_Name" name="User_Name" type="text" maxlength="35" placeholder="请输入您常用邮箱" />
                        <span id="tip1" class="tip">请输入您常用邮箱</span>
                        <img id="Img1" src="../Images/success.jpg" alt="" class="hides" />
                    </div>
                    <div>
                        <div class="left">
                            <b>*</b> 登陆密码</div>
                        <input id="password" name="password" type="password" placeholders="6-18位字符(字母|数字|符号)"
                            maxlength="16" />
                        <img id="Img2" src="../Images/success.jpg" alt="" class="hides" />
                        <span id="tip2" class="tip">请输入6-18位字符(字母|数字|符号),区分大小写</span>
                    </div>
                    <div>
                        <div class="left">
                            <b>*</b> 确认密码</div>
                        <input id="confirm_password" name="confirm_password" type="password" placeholders="请再次输入密码，请保持与上面一样"
                            maxlength="16" />
                        <img id="Img3" src="../Images/success.jpg" alt="" class="hides" />
                        <%--  <span id="tip3" class="tip">请再次输入密码，请保持与上面所输入的一样</span>--%>
                    </div>
                    <div>
                        <div class="left">
                            <b>*</b>身份
                        </div>
                        <div>
                            <input type="radio" name="radioRole" id="rb_Instructor" />
                            <label for="rb_Instructor" class="lb1">
                                教师</label>
                            <input type="radio" name="radioRole" id="rb_Student" checked="checked" />
                            <label for="rb_Student" class="lb1">
                                学生</label>
                        </div>
                    </div>
                    <div>
                        <div class="left">
                            <b>*</b>真实姓名</div>
                        <input id="name" name="name" class="abc" type="text" maxlength="6" onkeyup="value=value.replace(/[\d]/g,'') "
                            onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[\d]/g,''))"
                            placeholders="请填写真实姓名 2-6个汉字" />
                        <img id="Img4" src="../Images/success.jpg" alt="" class="hides" />
                        <span id="tip4" class="tip">请填写真实姓名 2-6个汉字</span>
                    </div>
                    <div>
                        <div class="left">
                            手机号码</div>
                        <input id="phone" name="phone" type="text" maxlength="11" onkeyup="this.value=this.value.replace(/\D/g,'')"
                            onafterpaste="this.value=this.value.replace(/\D/g,'')" placeholders="请真实填写，方便与您联系" />
                        <span id="tip5" class="tip">请真实填写，方便与您联系</span>
                    </div>
                    <div>
                      <%--  <div class="left">
                            地址</div>
                        <input id="address" name="address" class="abc" type="text" maxlength="50" placeholders="请填写 真实地址，方便为您服务" />
                        <img id="Img5" src="../Images/success.jpg" alt="" class="hides" />
                        <span id="span6" class="tip ">请填写您的真实地址，方便为您服务</span>--%>
                        <div id="schools" style="display:none;">
                        </div>
                        <div class="left" style="display:none;">
                            学校</div>
                        <select id="Institute" name="Institute" class="selects" style="display:none;">
                        <option value="0">爱易佰智能个性化网络学院</option>
                        </select>
                    </div>
                </fieldset>
<%--                <fieldset>
                    <legend>安全信息设置 <em>以下信息对保护您的帐号安全极为重要，请慎重填写并牢记</em> </legend>
                    <div>
                        <div class="left">
                            安全问题</div>
                        <select id="ddl_SecurityQuestion" name="ddl_SecurityQuestion" class="selects">
                            <option value="">...请选择 ...</option>
                        </select>
                    </div>
                    <div>
                        <div class="left">
                            安全答案</div>
                        <input id="answer" name="answer" type="text" class="abc" maxlength="10" placeholders="忘记了密码可以用它来找回" />
                        <img id="Img6" src="../Images/success.jpg" alt="" class="hides" />
                        <span id="tip7" class="tip">请认真填写,如果忘记密码可以用它来找回您的密码</span>
                    </div>
                </fieldset>--%>
                <fieldset>
                    <legend>填写验证码</legend>
                    <div>
                        <div class="left">
                            验证码</div>
                        <img id="code" name="code" src="ValidateCodes.aspx" alt="看不清？点击更换" title="看不清？点击更换"
                            onclick="code_change()" />
                        看不清 [<span id="changeimage" class="reds" onclick="code_change()">换一张</span>]
                    </div>
                    <div>
                        <div class="left">
                            <b>*</b> 输入验证码</div>
                        <div>
                            <input id="validatorImgcode" name="validatorImgcode" maxlength="4" type="text" />
                            <img id="success" src="../Images/success.jpg" alt="" class="hides" />
                            <img id="errors" alt="" style="margin-bottom: -8px" class="hides" src="../Images/error.gif" />
                            <span id="error1" class="hides">验证码错误</span>
                        </div>
                    </div>
                    <div>
                        <div class="left">
                        </div>
                        <input id="argee" type="checkbox" name="argee" checked="checked" /><label for="argee"
                            style="margin: 0; padding: 0;">我已阅读并接受</label>
                        <a id="servers" href="javascript:void(0)">爱易佰网络教育服务条款</a> <span id="disagree" class="hides">
                            <img id="Img7" alt="" class="hides" style="margin-bottom: -9px; margin-left: 48px;"
                                src="../Images/error.gif" />
                            请您阅读并同意</span>
                    </div>
                    <div>
                        <input id="register" class="userRegs" type="button" value="立即注册" />
                    </div>
                </fieldset>
                </form>
                </div>
        </div>
    </div>
</asp:Content>