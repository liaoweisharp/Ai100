<%@ Page Language="C#" AutoEventWireup="true" CodeFile="AssignIntegratedReport.aspx.cs" Inherits="Instructor_AssignIntegratedReport" MasterPageFile="~/Master/Simple.master" Title="整体报告" %>

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

    <script type="text/javascript" src="../Scripts/Question.js?version=1127"></script>
    <link href="../Styles/Pages/AssignIntegratedReport.css?version=1127" rel="stylesheet" />
    <script type="text/javascript" src="../Scripts/Pages/AssignIntegratedReport.js?version=1127"></script>
</asp:Content>
<asp:Content runat="server" ContentPlaceHolderID="ContentPlaceHolder1">
    <div style="background-color: #2A8C25;color: #FFFFFF;padding: 12px 35px; margin-bottom: 10px;">
        <span id="spFeatureName">整体报告</span>
    </div>
    <div id="dvReport" style="border:1px solid #ccc">
        <img alt="" src="../Images/ajax-loader_b.gif" style="margin:30px 50%" />
    </div>
</asp:Content>