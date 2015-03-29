<%@ Page Title="" Language="C#" MasterPageFile="~/CMS/Master/cms.master" AutoEventWireup="true" CodeFile="TestModels.aspx.cs" Inherits="CMS_TestModels" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link href="Styles/TestModels.css?version=1127" rel="stylesheet" />
    <script type="text/javascript" src="../Scripts/Math.js?version=1127"></script>
    <script type="text/javascript" src="Scripts/TestModels.js?version=1127"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder" Runat="Server">
    <div>试卷模板>></div>
    <div id="bookStructureBar" class="cms_toolbar">
        <ul>
            <li><select id="Des" style="width: 180px" class="sel_loading"></select></li>
            <li><select id="Sub" style="width: 180px"><option value='-1'>请选择学科</option></select></li>
            <li><select id="selBookList" style="width: 250px" class="sel_loading"></select></li>
            <li class="delimiter">&nbsp;</li>
            <li><img id="btnAdd" alt="" title="添加模板" src="Images/application_add.png" class="btnsel00" onmouseover="this.className='btnsel00_border'" onmouseout="this.className='btnsel00'" /></li>
        </ul>
    </div>
    <div class="cms_contentbox">
        <table class="cms_datatable">
            <tr><th width="485">模板名称</th><th width="80">操作</th><th>&nbsp;</th></tr>
        </table>
    </div>
</asp:Content>

