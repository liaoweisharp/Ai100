<%@ Page Language="C#" AutoEventWireup="true" EnableViewStateMac="false" CodeFile="Default.aspx.cs"
    EnableSessionState="True" Inherits="_Default" Title="Knowledge Diagnosis and Tutoring" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta property="qc:admins" content="276076662661151006375" />
    <title>爱易佰- 打造智能个性化教育第一品牌</title>
    <link rel="Shortcut Icon" href="favicon.ico" />
    <link rel="Shortcut Icon" href="favicon.ico" type="image/x-icon" />
    <link href="Styles/Base.css?version=1127" rel="stylesheet" type="text/css" />
    <link href="Styles/Ico.css?version=1127" rel="stylesheet" type="text/css" />
    <link href="Styles/Pages/loginNew.css?version=1127" rel="stylesheet" />

    <script src="Scripts/jquery-1.10.2.min.js?version=1127" type="text/javascript"></script>
    <script src="Plugins/jBox/jquery.jBox-2.3.min.js?version=1127" type="text/javascript"></script>
    <script src="Plugins/jBox/i18n/jquery.jBox-zh-CN.js?version=1127" type="text/javascript"></script>
    <link href="Plugins/jBox/Skins/Default/jbox.css?version=1127" rel="stylesheet" />

    <script src="Plugins/jquery.watermark.js?version=1127" type="text/javascript"></script>
    <script src="Plugins/adjs/jquery.SuperSlide.js?version=1127" type="text/javascript"></script>

    <script src="Scripts/comm.js?version=1127" type="text/javascript"></script>
    <script src="Scripts/jquery.ajax.js?version=1127" type="text/javascript"></script>
    <script src="Scripts/SimpleUser.js?version=1127" type="text/javascript"></script>    
    <script src="Scripts/Pages/Login.js?version=1127" type="text/javascript"></script>
    <style type="text/css">
         .f_l{
             float:left
         }

         .f_r{
             float:right
         }

         .c_b{
            clear:both
         }
    </style>
</head>
<body>
    <form id="form1" runat="server" onkeypress="javascript:return SAASkeyDown(event)">
    <div id="menu">

        <div id="menu_left">
            <img src="Images/Login/logoNew.png" alt="爱易佰" />
            <img src="Images/Login/poster.png" alt="手指轻轻一点，学习一目了然 ！" />
        </div>
        <div id="menu_right" style="display:none">
            <span><a id="aboutUs" href="javascript:click_How()">关于我们</a></span> <span><a id="connectionUs"
                href="javascript:(void)">联系我们</a></span>
        </div>
    </div>
    <div id="focus">
        <div class="focusContent">
            <div id="focusPicture">
                <div class="bdd">
                    <ul>
                        <li>
                            <img id="pictureNow" src="Images/Login/focus1.png" /></li>
                        <li>
                            <img id="Img1" src="Images/Login/focus2.png" /></li>
                        <li>
                            <img id="Img2" src="Images/Login/focus3.png" /></li>
                    </ul>
                </div>
                <div class="cd">
                    <ul>               
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </div>
           
        </div>
        <div class="landing-form">
            <div class="login-container">
                <div class="right link-wrapper signup">
                    <a href="UserManage/Registration.aspx">用户注册</a><br />
                    <br />
                </div>
                <div class="error-message">
                </div>
                <input tabindex="1" id="txtUserName" autocomplete="off" type="text" placeholder="邮箱" />
                <br />
                <br />
                <input tabindex="2" id="txtPassWord" type="password" autocomplete="off" placeholder="密码" />
                <div class="forgot-password22 link-wrapper">
                   <div class="f_l" style="display:none"><input type="checkbox" id="cbxAutoLogin" style="vertical-align:middle" /><label for="cbxAutoLogin" style="color:#fff;cursor:pointer;">十天内免登录</label></div>
                     <div class="f_r">
                        <a href="UserManage/Forgotpassword.aspx">忘记密码?</a>
                    </div>
                    <div class="c_b"></div>
                </div>
                <input tabindex="3" id="btnSignIn" type="button" value="登录" style="width:100%;font-size:16px;font-weight:bold" />
                <img alt="" id="imgLoginLoader" style="visibility:hidden; float:right;margin-top:25px;margin-right:10px" src="Images/ajax-loader_m.gif">
                
                <div id="otherLogin">
                    <div>
     

        <%--
        我不忙-QQ登陆OAuth2.0API使用流程：
        1、根据需要求修改配置文件(Wbm.QzoneV2.config)。
        2、注册ApplicationKey。(参考UiPageBase.cs文件)
        3、获取用户认证地址。(参考Logout.aspx文件)
        4、获取/缓存认证信息。(参考RedirectUri.aspx文件)
        5、获取用户资源。(参考Default.aspx文件)
        官方论坛：http://wobumang.com
        --%>
       
        <a href="Login.aspx">
            <img src="http://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_5.png" alt="QQ登陆" /></a>
     
    </div>
                </div>
            </div>
        </div>
         </div>
    </div>
    <div id="superiorityContent">
        <div id="first">
            <span>化慢为快</span>
        </div>
        <div id="second">
            <span>化繁为简</span>
        </div>
        <div id="third">
            <span>化难为易</span>
        </div>
        <div id="fourth">
            <span>化错为对</span>
        </div>
        <div id="fifth">
            <span>化盲为明</span>
        </div>
    </div>
    <div id="copyright">
        版权所有：爱易佰网络教育科技 www.aie100.com 川ICP备12029833号
    </div>
    <div id="about">
   <div class="smwzbox">
<ul>
<li class="ico_mg"><img width="90" height="90" src="Images/Login/po_l.png"></li>
<li class="texc">
<h1>我们的力量：</h1>
<p>爱易佰智能个性化教育系统是由一群充满激情的资深教师、人工智能教育研究者、教学设计专家、数位学习产业从业人员和信息技术从业人员共同打造。它是一个基于网络的个性化自适应学习、实时诊断与修复的系统。</p></li>
</ul>
<ul>
<li class="ico_mg"><img width="90" height="90" src="Images/Login/vs_l.png"></li>
<li class="texc">
<h1>我们的愿景：</h1>
<p>任何人在任何时候任何地方进行个性化的学习,成为最受欢迎的在线教育学习组织。</p></li>
</ul>
<ul>
<li class="ico_mg"><img width="90" height="90" src="Images/Login/mi_l.png"></li>
<li class="texc">
<h1>我们的使命：</h1>
<p>让每一个学生都享受系统化、智能化和个性化的辅导，大幅度提高学习效率；让每一个学生轻轻松松学习，快快乐乐成长！</p></li>
</ul>
<ul>
<li class="ico_mg"><img width="90" height="90" src="Images/Login/wt_l.png"></li>
<li class="texc">
<h1>当前教育存在的问题：</h1>
<p>所有的教育工作者和教师在帮助学生取得成功学习的过程中，在为每个学生提供个性化教学方面面临着极大的困难，目前个性化教育的开展仍然是教育领域里的一个巨大的瓶颈。</p></li>
</ul>
<ul>
<li class="ico_mg"><img width="90" height="90" src="Images/Login/up_l.png"></li>
<li class="texc">
<h1>我们的优势：</h1>
<p>填补个性化教育的空白，为个性化教学提供一个可行的解决过程。<br /><br /></p>

<div class="p1"><font>学生: </font>能根据自动化的导航学习模式，由“学会知识”变成“会学知识”，使学生越学越聪明.根据每个学生的实际情况制定相应的学习计划，让学习变得更轻松。</div>
<div class="p1"><font>教师: </font>能非常方便地掌握学习进度，了解学习者个人和所有学习者的整体情况，了解学习者的薄弱环节并获取针对性的补救措施等，依据学生的个体特征提供个性化的学习方案，既对常规教学起到很好的辅助作用，又为教师开辟新的教学方式提供了一种新的方案。真正做到哪里不会讲哪里，一切尽在掌握中。</div></li>
</ul>

</div></div>
    <asp:Button ID="btnSubmit" runat="server" OnClick="btnSubmit_Click" Style="display: none" />
    <asp:HiddenField ID="hidIsChecked" runat="server" />
    <asp:HiddenField ID="hidQQuserId" runat="server" />
    </form>
</body>
</html>