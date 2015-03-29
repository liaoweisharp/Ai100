<%@ Page Language="C#" AutoEventWireup="true" CodeFile="CourseManage.aspx.cs" Inherits="Course_CourseManage" MasterPageFile="~/Master/Course.master" Title="课程管理" %>

<asp:Content runat="server" ContentPlaceHolderID="head">
<%--    <link href="../Styles/comm.css?version=1127" rel="stylesheet" />--%>
    <link href="../Styles/util.css?version=1127" rel="stylesheet" />
    <link href="../Plugins/showLoading/css/showLoading.css?version=1127" rel="stylesheet" />
    <link href="../Styles/Pages/CourseManage.css?version=1127" rel="stylesheet" />
    <link href="../Plugins/jBox/Skins/Default/jbox.css?version=1127" rel="stylesheet" />
    <link href="../Plugins/lhgcalendar/_doc/common.css?version=1127" rel="stylesheet" />
    
    <script type="text/javascript" src="../Scripts/comm.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/SimpleUser.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/jquery-1.10.2.min.js?version=1127"></script>
    <script type="text/javascript" src="../Plugins/showLoading/js/jquery.showLoading.min.js?version=1127"></script>
    <%--   <script type="text/javascript" src="../Scripts/jquery-1.7.1.min.js?version=1127"></script>--%>
    <script type="text/javascript" src="../Plugins/jBox/jquery.jBox-2.3.min.js?version=1127"></script>
    <script type="text/javascript" src="../Plugins/lhgcalendar/lhgcalendar.min.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/jquery.ajax.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Pages/CourseManage.js?version=1127"></script>
</asp:Content>
<asp:Content runat="server" ContentPlaceHolderID="ContentPlaceHolder1">
    <div style="background-color: #2A8C25;color: #FFFFFF;padding: 12px 35px; margin-bottom: 10px;">
        <span id="spFeatureName">课程管理</span>
    </div>
    <div class="coursemanage">
        <div class="daoxiang">
            <ul>
                <li class="sel"><span>&nbsp;&nbsp;&nbsp;&nbsp;选择书&nbsp;&nbsp;&nbsp;&nbsp;</span></li>
                <li class="unsel"><span>&nbsp;基本信息&nbsp;</span></li>
                <%--<li class="unsel"><span>设置</span></li>--%>
            </ul>
        </div>
        <div index="0" class="step0">
            <div class="div">
                <div><span>学校：</span><select id="ddlInstituteList" style="width: 290px;"><option value="-1">== 请选择学校 ==</option>
                </select></div>
                <div><span>书：</span><select id="ddlBookList" style="width: 290px;"><option value="-1">== 请选择书 ==</option>
                </select></div>
            </div>
        </div>
        <div index="1" class="step1">
            <div class="div">
                <div><span>课程名称：</span><input id="txtCourseName" type="text" style="width: 670px;" /><span class="required">*</span></div>
                <div><span>开始日期：</span><input id="txtStartDate" readonly="readonly" type="text" style="width: 195px;" class="runcode" /><span class="required">*</span></div>
                <div><span>结束日期：</span><input id="txtEndDate" readonly="readonly" type="text" style="width: 195px;" class="runcode" /><span class="required">*</span></div>
                <div><span>是否公开：</span><input type="radio" name="rdOpenFlagGroup" value="1" id="rdOpenFlagYes"/><label for="rdOpenFlagYes">是</label><input style="margin-left:15px;" type="radio" name="rdOpenFlagGroup" value="0" id="rdOpenFlagNo" checked="checked"/><label for="rdOpenFlagNo">否</label></div>
                <%--  <div><span>课程价格：</span><input type="text" style="width:195px;" value="0"/></div>--%>
                <div><span>适用人群：</span><textarea id="txtAreaForTheCrowd" cols="0" rows="0" style="width: 670px; height: 65px;"></textarea></div>
                <div><span>学习目标：</span><textarea id="txtAreaLearningObjective" cols="0" rows="0" style="width: 670px; height: 65px;"></textarea></div>
                <div><span>课程介绍：</span><textarea id="txtAreaIntroduction" cols="0" rows="0" style="width: 670px; height: 65px;"></textarea></div>
            </div>
            <div class="buttons">
                <input class="button" type="button" value="退出" onclick="location.href='../Course/ManageCourse.aspx'" /><input class="button" id="btnSaveCourse" type="button" value="保存" />
            </div>
        </div>

    </div>

</asp:Content>

