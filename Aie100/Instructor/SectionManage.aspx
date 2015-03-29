<%@ Page Language="C#" AutoEventWireup="true" CodeFile="SectionManage.aspx.cs" Inherits="Course_SectionManage" MasterPageFile="~/Master/Course.master" Title="班级管理" %>

<asp:Content runat="server" ContentPlaceHolderID="head">
<%--    <link href="../Styles/comm.css?version=1127" rel="stylesheet" />--%>
    <link href="../Plugins/showLoading/css/showLoading.css?version=1127" rel="stylesheet" />
    <link href="../Styles/Pages/SectionManage.css?version=1127" rel="stylesheet" />
    <link href="../Plugins/jBox/Skins/Default/jbox.css?version=1127" rel="stylesheet" />

    <script type="text/javascript" src="../Scripts/comm.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/SimpleUser.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/jquery-1.10.2.min.js?version=1127"></script>
    <script type="text/javascript" src="../Plugins/showLoading/js/jquery.showLoading.min.js?version=1127"></script>
    <%--   <script type="text/javascript" src="../Scripts/jquery-1.7.1.min.js?version=1127"></script>--%>
    <script type="text/javascript" src="../Plugins/jBox/jquery.jBox-2.3.min.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/jquery.ajax.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Pages/SectionManage.js?version=1127"></script>
</asp:Content>
<asp:Content runat="server" ContentPlaceHolderID="ContentPlaceHolder1">
    <div class="sectionmanage">
        <div class="toolbar">
            <div class="f_l"><span class="sp_sectionmanage" id="spSectionmanage" flg="1"><span id="spCourseTitle" flg="1">班级管理</span></div>
          <%--  <div class="f_l">
                <select id="ddlSectionProps">
                    <option value="-1">全部班级</option>
                    <option value="0">班级名称</option>
                    <option value="1">班级号</option>
                    <option value="2">创建者</option>
                </select>
                <input class="v_s_info" type="text" value="" disabled="disabled" id="txtSectionPropsValue" />
                <input type="button" value="查询班级" class="button" id="btnViewSection" disabled="disabled"/>
            </div>
            <div class="f_r">
                <input id="btnCreateSection" type="button" value="创建班级" class="button" /></div>--%>
            <div class="c_b"></div>
        </div>
        <div class="toolbar" style="margin-top: 0px;padding:5px 10px;background:#888" >
                <div class="f_l">
                <select id="ddlSectionProps">
                    <option value="-1">全部班级</option>
                    <option value="0">班级名称</option>
                    <option value="1">班级号</option>
                    <option value="2">创建者</option>
                </select>
                <input class="v_s_info" type="text" value="" disabled="disabled" id="txtSectionPropsValue" />
                <input type="button" value="查询班级" class="button" id="btnViewSection" disabled="disabled" style="width:80px;background:rgb(9,169,131);border:0" />
            </div>
            <div class="f_r">
                <input id="btnCreateSection" type="button" value="创建班级" class="button"  style="width:80px;background:rgb(9,169,131);border:0" /></div>
            <div class="c_b"></div>
            </div>
        <div class="hr"></div>
        <div class="c_b p_t1" id="divSectionList">
            <center>
                <img class="data_loading" alt="" src="../Images/ajax-loader_b.gif" />
            </center>
        </div>

    </div>
</asp:Content>


