<%@ Page Title="client Book" Language="C#" MasterPageFile="~/CMS/Master/cms.master"
    AutoEventWireup="true" CodeFile="ClientBook.aspx.cs" Inherits="CMS_ClientBook" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <script src="Scripts/CreateBook.js?version=1127" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder" runat="Server">
    <div>
        书管理>></div>
    <div id="bookInfoBar" class="cms_toolbar">
        <ul>
            <li>
                <img id="btnAdd" alt="Add" title="添加" src="Images/application_add.png" class="btnsel00"
                    onmouseover="this.className='btnsel00_border'" onmouseout="this.className='btnsel00'" /></li>
            <li class="delimiter">&nbsp;</li>
            <li><span style="font-size:13px">标题</span></li>
            <li>
                <input id="keyword" type="text" maxlength="50" /></li>
            <li>
                <input id="sumbi" type="button" value="查询" /></li>
        </ul>
    </div>
    <div class="cms_contentbox">
        <table class="cms_datatable">
            <tr>
                <th width="20%">
                    ISBN
                </th>
                <th width="25%">
                    标题
                </th>
                <th width="20%">
                    子标题
                </th>
                <th width="25%" style="text-align: center">
                    价格
                </th>
                <th width="10%">
                    操作
                </th>
            </tr>
        </table>
    </div>
</asp:Content>
