<%@ Page Title="详细报告" Language="C#" MasterPageFile="~/Master/Simple.master" AutoEventWireup="true" CodeFile="Reports.aspx.cs" Inherits="Instructor_Reports" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <script type="text/javascript" src="../Scripts/jquery-1.7.1.min.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/jquery.ajax.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Array.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/String.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Math.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/SimpleUser.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/comm.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Pages/Reports_Ins.js?version=1127"></script>

    <link href="../Styles/Pages/Reports_Ins.css?version=1127" rel="stylesheet" />
        <script type="text/javascript" src="../Plugins/jBox/jquery.jBox-2.3.min.js?version=1127"></script>
    <link href="../Plugins/jBox/Skins/Default/jbox.css?version=1127" rel="stylesheet" /> 
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div>
        <div class="assignmentTitleDiv">
            <span class="assignmentTitle">
                <img alt="" src="../Images/ajax-loader_m.gif" /></span>
        </div>
        <div class="usersRp1">
            <div style="margin:15px;"><center><img alt="" src="../Images/ajax-loader_b.gif" /></center></div>
        </div>
         <div class="usersRp2">
            
        </div>
    </div>
</asp:Content>

