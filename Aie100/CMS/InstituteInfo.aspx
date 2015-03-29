<%@ Page Title="学院管理" Language="C#" AutoEventWireup="true" CodeFile="InstituteInfo.aspx.cs" Inherits="CMS_InstituteInfo" MasterPageFile="~/CMS/Master/cms.master" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <link href="../Plugins/pagination/pagination.css?version=1127" rel="stylesheet" type="text/css" />
    <script src="../Plugins/pagination/jquery.pagination.js?version=1127" type="text/javascript"></script>
    <script src="Scripts/Institute.js?version=1127" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder" runat="Server">
    <div>学院管理>></div>
    <div id="InstituteInfoBar" class="cms_toolbar">
        <ul>
            <li><img id="btnAdd" alt='Add' title="添加" src="Images/application_add.png" class="btnsel00" onmouseover="this.className='btnsel00_border'" onmouseout="this.className='btnsel00'" /></li>
            <%--<li class="delimiter">&nbsp;</li>
            <li><span style="font-size:13px">学院名称</span></li>
            <li><input id="keys" type="text" maxlength="50" /></li>
            <li><input id="btnQuery" type="button" value="查询" /></li>--%>
        </ul>
    </div>
    <div class="cms_contentbox">
        <table class="cms_datatable">
            <tr>
                <th width="20%">
                    学院名称
                </th>
                <th width="10%" style='text-align: center'>
                    类型
                </th>
                <th width="20%" style='text-align: center'>
                    地址
                </th>
                <th width="10%" style='text-align: center'>
                    城市
                </th>
                <th width="10%">
                    操作
                </th>
            </tr>
        </table>
    </div>
    <div style="clear:both;"></div>
    <div id="institutePagin" style="margin-top: 12px; text-align: center;"></div>
</asp:Content>
