<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ForgotPassword.aspx.cs" Inherits="UserManage_ForgotPassword" 
    MasterPageFile="~/Master/Compact.master" Title="找回密码"%>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../Styles/base.css?version=1127" rel="stylesheet" type="text/css" />
    <link href="../Styles/left_sty.css?version=1127" rel="stylesheet" type="text/css" />

    <script src="../Scripts/jquery-1.4.1.min.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/jBox/jquery.jBox-2.3.min.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/jBox/i18n/jquery.jBox-zh-CN.js?version=1127" type="text/javascript"></script>
    <link href="../Plugins/jBox/Skins/Default/jbox.css?version=1127" rel="stylesheet" />

    <script src="../Scripts/jquery.ajax.js?version=1127" type="text/javascript"></script>
    <%--<script src="../Scripts/comm.js?version=1127" type="text/javascript"></script>--%>
    <script src="../Scripts/comm.js?version=1127" type="text/javascript"></script>
    <script src="../Scripts/String.js?version=1127" type="text/javascript"></script>
    <script src="../Scripts/Dialog.js?version=1127" type="text/javascript"></script>

    <script src="../Scripts/Pages/ForgotPassword.js?version=1127" type="text/javascript"></script>
    <link href="../Styles/Pages/Registration.css?version=1127" rel="stylesheet" />
    <link href="../Styles/Pages/ForgotPassword.css?version=1127" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div class="conbox" style="margin-top:10px">
        <div class="cont_box1000">
            <div style="background-color: #2A8C25;color: #FFFFFF;padding: 12px 35px;">
                <span id="spFeatureName">忘记密码</span>
            </div>
                <div style="border:1px solid #ccc">
                    <form id="aspnetform">
                    <fieldset id="findStyle" class="hides">
                        <legend>找回方式</legend>
                        <div>
                            <div>
                                <div class="left1">
                                    <img src="../Images/emails.gif" class="img1" id="SecurityEmail1" onclick="Emailfind()"
                                        alt="" /></div>
                                <div class="right1">
                                    <span class="title_01" id="SecurityEmail" onclick="Emailfind()">安全邮箱找回密码</span><br />
                                    <span class="title_02">注册用户对应的邮箱名即为初始安全邮箱</span></div>
                            </div>
                            <br />
                            <div style="display:none">
                                <div class="left1">
                                    <img src="../Images/safe.png" class="img1" id="SecurityProblem1" alt="" onclick="Securityfind()" /></div>
                                <div class="right1">
                                    <span class="title_01" id="SecurityProblem" onclick="Securityfind()">安全问题找回密码</span><br />
                                    <span class="title_02">注册用户对应的邮箱名即为初始安全邮箱</span></div>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset id="EmailfindPasswords" class="">
                        <div>
                        </div>
                        <legend>邮箱找回密码</legend>
                        <div>
                            <div class="left">
                                <b>*</b>请输入登陆邮箱
                            </div>
                            <input id="userName" type="text" maxlength="35" />
                        </div>
                        <div>
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
                                验证码</div>
                            <img id="code" name="code" class="point" src="../UserManage/ValidateCodes.aspx"
                                alt="看不清？点击更换" title="看不清？点击更换" onclick="code_changes()" />
                            看不清 [<span id="changeimage" class="reds point" onclick="code_changes()">换一张</span>]
                        </div>
                        <div>
                            <div class="left">
                            </div>
                            <div>
                                <input id="next4" class="userRegs" type="button" value="确 定" />
                            </div>
                        </div>
                    </fieldset>
                    <fieldset id="SercurityfindPasswords" class="hides">
                        <legend>安全问题找回密码</legend>
                        <div>
                            <div class="left">
                                <b>*</b>请输入登录帐号
                            </div>
                            <div>
                                <input id="Username" type="text" maxlength="35" />
                            </div>
                            <div>
                                <div class="left">
                                </div>
                                <div>
                                    <a id="next1" class="next" href="javascript:void(0)">下一步</a>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset id="findEmailsuccece" class="hides">
                        <legend>找回密码成功</legend>
                    </fieldset>
                    <fieldset id="securityCertificate" class="hides">
                        <legend>安全认证</legend>
                        <div>
                            <div>
                                <div class="left">
                                    安全问题</div>
                                <div>
                                    <div>
                                        <label id="dom_SQuestion">
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div class="left">
                                    <b>*</b>安全答案</div>
                                <div>
                                    <input id="Security_answer" type="text" maxlength="10" /></div>
                            </div>
                            <div>
                                <div class="left">
                                    <b>*</b> 输入验证码</div>
                                <div>
                                    <input id="validatorcode" maxlength="4" /></div>
                            </div>
                            <div>
                                <div class="left">
                                    验证码</div>
                                <div>
                                    <img id="Img1" name="code" class="point" src="../Registration/ValidateCodes.aspx"
                                        alt="看不清？点击更换" title="看不清？点击更换" onclick="code_change()" />看不清 [<span id="Span1" class="point reds"
                                            onclick="code_change()">换一张</span>]
                                    <img id="Img2" class="hides" src="../Images/success.jpg" alt="" />
                                    <img id="Img3" class="hides" alt="" style="margin-bottom: -8px" src="../Images/error.gif" />
                                    <span id="Span2" class="hides" style="color: Red">验证码错误</span></div>
                            </div>
                            <div>
                                <div class="left">
                                </div>
                                <div>
                                    <a id="next2" class="next" href="javascript:void(0)">下一步</a></div>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset id="setPassword" class="hides">
                        <legend>设置新密码</legend>
                        <div>
                            <div class="left">
                                <b>*</b>设置密码</div>
                            <div>
                                <input id="newpassword" maxlength="16" type="password" /></div>
                            <div class="left">
                                <b>*</b>确认密码</div>
                            <div>
                                <input id="Con_newpassword" maxlength="16" type="password" /></div>
                            <div>
                                <div class="left">
                                </div>
                                <div>
                                    <a id="next3"class="next" href="javascript:void(0)">提 交</a>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    </form>
                </div>
        </div>
    </div>
</asp:Content>