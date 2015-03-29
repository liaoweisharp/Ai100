<%@ Page Language="C#" AutoEventWireup="true" CodeFile="TestQuestionTypeManage.aspx.cs" Inherits="CMS_TestQuestionTypeManage"MasterPageFile="~/CMS/Master/cms.master"%>

<asp:Content ID="Content1" runat="server" ContentPlaceHolderID="head">
    <script src="Scripts/TestQuestionTypeManage.js?version=1127" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" runat="server" ContentPlaceHolderID="ContentPlaceHolder">
    <div>试题类型管理>></div>
    <div id="cms_toolbar" class="cms_toolbar">
        <ul>
            <li><img id="btnAdd" title="添加" src="Images/application_add.png" class="btnsel00" onmouseover="this.className='btnsel00_border'" onmouseout="this.className='btnsel00'" /></li>
        </ul>
    </div>
    <div class="cms_contentbox">
        <table class="cms_datatable">
            <tr><th width="150">试题类型</th><th>描述</th><th width="150">答案类型</th><th width="50">序号</th><th width="60">操作</th></tr>
        </table>
    </div>
</asp:Content>