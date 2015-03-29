<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Author.aspx.cs" Inherits="CMS_Author" 
    MasterPageFile="~/CMS/Master/cms.master"%>

<asp:Content ID="Content1" runat="server" ContentPlaceHolderID="head">
    <script src="Scripts/Author.js?version=1127" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" runat="server" ContentPlaceHolderID="ContentPlaceHolder">
    <div>作者管理>></div>
    <div id="cms_toolbar" class="cms_toolbar">
        <ul>
            <li><img id="btnAdd" title="添加" src="Images/application_add.png" class="btnsel00" onmouseover="this.className='btnsel00_border'" onmouseout="this.className='btnsel00'" /></li>
        </ul>
    </div>
    <div class="cms_contentbox">
        <table class="cms_datatable">
            <tr><th width="300">作者名称</th><th width="100">电话</th><th width="500">地址</th><th>操作</th></tr>
        </table>
    </div>
</asp:Content>