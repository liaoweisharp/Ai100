<%@ Page Title="学习效率报告" Language="C#" MasterPageFile="~/Master/MasterPage.master" AutoEventWireup="true" CodeFile="Efficiency.aspx.cs" Inherits="Instructor_Efficiency" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <script type="text/javascript" src="../Scripts/jquery-1.7.1.min.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/jquery.ajax.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/jquery.ajax.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Array.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/String.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Math.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/SimpleUser.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/comm.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Pages/Efficiency_Ins.js?version=1127"></script>
    <link href="../Styles/Pages/Efficiency.css?version=1127" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="efficiency">
        <div class="toolbar">
               <span>学习效率排行榜</span>
            </div>
        <div id="content">
        
            <div style="text-align:center;padding:15px;">
                <img src="../Images/ajax-loader_b.gif" />
            </div>
        </div>
    </div>
</asp:Content>

