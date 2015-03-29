<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Publisher.aspx.cs" Inherits="CMS_Publisher" 
    MasterPageFile="~/CMS/Master/cms.master"%>

<asp:Content ID="Content1" runat="server" ContentPlaceHolderID="head">
    <script src="Scripts/Publisher.js?version=1127" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" runat="server" ContentPlaceHolderID="ContentPlaceHolder">
    <div>出版社管理>></div>
    <div id="cms_toolbar" class="cms_toolbar">
        <ul>
            <li><img id="btnAdd" title="添加" src="Images/application_add.png" class="btnsel00" onmouseover="this.className='btnsel00_border'" onmouseout="this.className='btnsel00'" /></li>
        </ul>
    </div>
    <div class="cms_contentbox">
        <table class="cms_datatable">
            <tr><th>出版社名称</th><th width="150">电话</th><th width="150">联系人</th><th width="280">地址一</th><th width="280">地址二</th><th width="80">操作</th></tr>
        </table>
    </div>
</asp:Content>