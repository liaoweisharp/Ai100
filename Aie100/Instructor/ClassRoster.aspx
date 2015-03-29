<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ClassRoster.aspx.cs" Inherits="Instructor_ClassRoster" MasterPageFile="~/Master/Simple.master" Title="班级花名册" %>

<asp:Content runat="server" ContentPlaceHolderID="head">
    <script type="text/javascript" src="../Scripts/jquery-1.10.2.min.js?version=1127"></script>

    <link href="../Plugins/showLoading/css/showLoading.css?version=1127" rel="stylesheet" />
    <script type="text/javascript" src="../Plugins/showLoading/js/jquery.showLoading.min.js?version=1127"></script>
    <link href="../Plugins/jBox/Skins/Default/jbox.css?version=1127" rel="stylesheet" />
    <script src="../Plugins/jBox/jquery.jBox-2.3.min.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/pagination/jquery.pagination.js?version=1127" type="text/javascript"></script>
    <link href="../Plugins/pagination/pagination.css?version=1127" rel="stylesheet" />

    <script type="text/javascript" src="../Scripts/comm.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/jquery.ajax.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/SimpleUser.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Array.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Math.js?version=1127"></script>

    <link href="../Styles/Pages/ClassRoster.css?version=1127" rel="stylesheet" />
    <script src="../Scripts/Pages/ClassRoster.js?version=1127" type="text/javascript"></script>
</asp:Content>
<asp:Content runat="server" ContentPlaceHolderID="ContentPlaceHolder1">
    <div style="background-color: #2A8C25;color: #FFFFFF;padding: 12px 35px; margin-bottom: 10px;">
        <span id="spFeatureName">班级花名册</span>
    </div>
    <div style="margin-bottom:5px">
        <select id="ddlUserProps">
            <option value="0">姓名</option>
            <option value="1">用户名</option>
        </select>
        <input class="v_s_info" type="text" value="" id="txtKey" />
        <input type="button" value="查询" class="button" id="btnSearch" style="width:80px; background:rgb(9,169,131);border:0" />
    </div>
    <div style="margin-bottom:40px">
        <table id="tbStudentList" class="stud_list">
            <tr>
                <th width="25">#</th><th width="200">姓名</th><th width="200">用户名</th><th width="50">角色</th><th width="200">加入日期</th><th width="60">付费状态</th><th width="50">状态</th><th width="50">管理</th><th>&nbsp;</th>
            </tr>
        </table>
    </div>
</asp:Content>
