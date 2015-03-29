<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ManageCourse.aspx.cs" Inherits="Course_ManageCourse" MasterPageFile="~/Master/Course.master" Title="管理课程" %>

<asp:Content runat="server" ContentPlaceHolderID="head">
    <link href="../Styles/Pages/ManageCourse.css?version=1127" rel="stylesheet" />
    <link href="../Plugins/showLoading/css/showLoading.css?version=1127" rel="stylesheet" />
    <script type="text/javascript" src="../Scripts/comm.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/jquery-1.10.2.min.js?version=1127"></script>
    <script type="text/javascript" src="../Plugins/showLoading/js/jquery.showLoading.min.js?version=1127"></script>
    <link href="../Plugins/jquery-ui-1.10.4.custom/development-bundle/themes/base/jquery.ui.all.css?version=1127" rel="stylesheet" />
    <script type="text/javascript" src="../Plugins/jquery-ui-1.10.4.custom/development-bundle/ui/jquery.ui.widget.js?version=1127"></script>
    <script type="text/javascript" src="../Plugins/jquery-ui-1.10.4.custom/development-bundle/ui/jquery.ui.autocomplete.js?version=1127"></script>
    <script type="text/javascript" src="../Plugins/jquery-ui-1.10.4.custom/development-bundle/ui/jquery.ui.core.js?version=1127"></script>
    <script type="text/javascript" src="../Plugins/jquery-ui-1.10.4.custom/development-bundle/ui/jquery.ui.menu.js?version=1127"></script>
    <script type="text/javascript" src="../Plugins/jquery-ui-1.10.4.custom/development-bundle/ui/jquery.ui.position.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/jquery.ajax.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/SimpleUser.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Pages/ManageCourse.js?version=1127"></script>
    
</asp:Content>
<asp:Content runat="server" ContentPlaceHolderID="ContentPlaceHolder1">
    <div class="managecourse">
        <div class="toolbar">
            <div class="f_l"><span class="sp_coursebank" id="spManageCourse" flg="1"><span id="spCourseTitle" flg="1">管理课程</span><img alt="" src="../Images/triangle.png" flg="1" style="display:none" /></span></div>
            <%-- <div class="f_l" style="margin:0px 10px">
                <input type="button" value="创建课程" class="button" style="width:80px;" onclick="location.href='../Instructor/CourseManage.aspx'" />
            </div>--%>
           <%-- <div class="f_l" style="margin-right:10px">
                <input type="button" value="创建班级" class="button" style="width:80px;" onclick="location.href = '../Instructor/SectionManage.aspx'" />
            </div>--%>
            <div class="f_r">
                <input id="txtSearchCourse" type="text" value="" /><img id="imgSearchCourse" alt="" title="搜索课程" src="../Images/search.gif" /><span id="spSearchCourse" class="search_tip">搜索课程</span></div>
            <div class="c_b"></div>
        </div>
         <div class="toolbar" style="margin-top: 0px;padding:5px 10px;background:#888" >
               <%--  <input type="button" value="创建课程" class="button2" style="width:80px;" onclick="location.href = '../Instructor/CourseManage.aspx'" />--%>
                 <div class='creteCoursebt'  onclick="location.href = '../Instructor/CourseManage.aspx'">创建课程</div>

            </div>
        <div class="course_type">
            <ul>
                <li index="0" style="background-color:#1B88C9;">我的课程</li>
               <%-- <li index="1">正在学的课程</li>--%>
<%--                <li index="2">将要学的课程</li>--%>
                <li index="1">学习过的课程</li>
<%--                <li index="4">我教的课程</li>
                <li index="5">我跟踪的课程</li>--%>
            </ul>
            <div style="display: block" class="course_type_details">
                我的课程，……
            </div>
          <%--  <div class="course_type_details">
                正在学的课程，……
            </div>
            <div class="course_type_details">
                将要学的课程，……
            </div>--%>
            <div class="course_type_details">
                学习过的课程，……
            </div>
          <%--  <div class="course_type_details">
                我教的课程，……
            </div>
            <div class="course_type_details">
                我跟踪的课程，……
            </div>--%>
            <div class="c_b"></div>
        </div>
        <div id="div_course_list" class="course_list">
            <div id="divDataLoading">
                <center>
                    <img style="margin:20px;" alt="" src="../Images/ajax-loader_b.gif" />
                </center>
            </div>
        </div>
    </div>
 
</asp:Content>
