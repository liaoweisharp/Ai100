<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Compact.master" AutoEventWireup="true" CodeFile="BindPage.aspx.cs" Inherits="UserManage_BindPage" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <link href="../Styles/left_sty.css?version=1127" rel="stylesheet" />
    <link href="../Styles/Pages/BindPage.css?version=1127" rel="stylesheet" />

    <script src="../Scripts/jquery-1.4.1.min.js?version=1127" type="text/javascript"></script>
    <link href="../Plugins/Stip/Stip.css?version=1127" rel="stylesheet" />
    <script src="../Plugins/Stip/Stip.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/email.emath.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/jquery.validate.min.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/jBox/jquery.jBox-2.3.min.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/jBox/i18n/jquery.jBox-zh-CN.js?version=1127" type="text/javascript"></script>
    <link href="../Plugins/jBox/Skins/Default/jbox.css?version=1127" rel="stylesheet" />

    <script src="../Scripts/jquery.ajax.js?version=1127" type="text/javascript"></script>
    <script src="../Scripts/Pages/Registration_bind.js?version=1127" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="conbox">
        <div class="cont_box1000">
            <div id="logins" style="float: right;">
                已有账号? <a href="../Default.aspx?signout=1">马上登陆</a>
            </div>
            <br />
            <br />
            <div style="background-color: #2A8C25;color: #FFFFFF;padding: 12px 35px;">
                <span id="spFeatureName">只差一步，即可完成登录设置</span>
            </div>
            <div style="border:1px solid #ccc; padding-top:10px; padding-bottom:10px;" id="registerForms">
                <form id="registerForm" name="registerForm">
                    <div class="b1">
                        <div>
                            <div class="left">
                                <b>*</b> 电子邮箱
                            </div>
                            <input id="User_Name" name="User_Name" type="text" maxlength="35" placeholder="请输入您常用邮箱" />

                            <img id="Img1" src="../Images/success.jpg" alt="" class="hides" />
                        </div>
                        <div>
                            <div class="left">
                                <b>*</b> 登陆密码
                            </div>
                            <input id="password" name="password" type="password" placeholders="6-18位字符(字母|数字|符号)"
                                maxlength="16" />
                            <img id="Img2" src="../Images/success.jpg" alt="" class="hides" />

                        </div>
                        <div>
                            <div class="left">
                                <b>*</b> 确认密码
                            </div>
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
                                <b>*</b>真实姓名
                            </div>
                            <input id="name" name="name" class="abc" type="text" maxlength="6" onkeyup="value=value.replace(/[\d]/g,'') "
                                onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[\d]/g,''))"
                                placeholders="请填写真实姓名 2-6个汉字" />
                            <img id="Img4" src="../Images/success.jpg" alt="" class="hides" />

                        </div>
                        <div>
                            <div class="left">
                                手机号码
                            </div>
                            <input id="phone" name="phone" type="text" maxlength="11" onkeyup="this.value=this.value.replace(/\D/g,'')"
                                onafterpaste="this.value=this.value.replace(/\D/g,'')" placeholders="请真实填写，方便与您联系" />

                        </div>
                        <div>

                            <div id="schools" style="display: none;">
                            </div>
                            <div class="left" style="display: none;">
                                学校
                            </div>
                            <select id="Institute" name="Institute" class="selects" style="display: none;">
                                <option value="0">爱易佰智能个性化网络学院</option>
                            </select>
                        </div>

                        <div>
                            <input id="register" class="userRegs" type="button" value="立即注册" />
                        </div>
                    </div>
                    <div class="b2">
                        <div class="tit">
                            已有aie100账号？直接绑定
                        </div>
                        <div class="bt">
                            <div>
                                电子邮箱
                            </div>
                            <input id="_User_Name" name="_User_Name" type="text" maxlength="35" placeholder="请输入您常用邮箱" />
                            <%--   <span id="tip1" class="tip">请输入您常用邮箱</span>--%>
                            <img id="_Img1" src="../Images/success.jpg" alt="" class="hides" />
                        </div>
                        <div class="bt">
                            <div>
                                登陆密码
                            </div>
                            <input id="_password" name="_password" type="password" placeholders="6-18位字符(字母|数字|符号)"
                                maxlength="16" />
                            <img id="Img2" src="../Images/success.jpg" alt="" class="hides" />
                            <%--<span id="tip2" class="tip">请输入6-18位字符(字母|数字|符号),区分大小写</span>--%>
                        </div>

                        <div  class="bt">
                            <div>
                                验证码
                            </div>
                            <img id="code" name="code" src="ValidateCodes.aspx" alt="看不清？点击更换" title="看不清？点击更换"
                                onclick="code_change()" />
                            看不清 [<span id="changeimage" class="reds" onclick="code_change()">换一张</span>]
                        </div>
                        <div  class="bt">
                            <div>
                                输入验证码
                            </div>
                            <div>
                                <input id="validatorImgcode" name="validatorImgcode" maxlength="4" type="text" />
                                <img id="success" src="../Images/success.jpg" alt="" class="hides" />
                                <img id="errors" alt="" style="margin-bottom: -8px" class="hides" src="../Images/error.gif" />
                                <span id="error1" class="hides">验证码错误</span>
                            </div>
                        </div>
                       <div>
                        <div style="margin: 10px;">
                            <input id="btnBind" class="userRegs" type="button" value="绑定账号" />
                            <asp:HiddenField ID="hdQQuserId" runat="server" />
                        </div>
                    </div>
                    </div>
                    <div style="clear:both"></div>
                </form>
            </div>
        </div>
    </div>
</asp:Content>

