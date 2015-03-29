<%@ Page Language="C#" AutoEventWireup="true" CodeFile="TestQuestionType.aspx.cs" Inherits="CMS_TestQuestionType" 
    MasterPageFile="~/CMS/Master/cms.master"%>

<asp:Content ID="Content1" runat="server" ContentPlaceHolderID="head">
    <script src="Scripts/TestQuestionType.js?version=1127" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" runat="server" ContentPlaceHolderID="ContentPlaceHolder">
    <div>考试题型管理>></div>
    <div id="cms_toolbar" class="cms_toolbar">
        <ul>
            <li><select id="ddlGradation" style="width: 180px"><option value='-1'>请选择阶段</option></select></li>
            <li><select id="Des" style="width: 180px"><option value='-1'>请选择学科类别</option></select></li>
            <li><select id="selSubjectList" style="width: 180px"><option value='-1'>请选择学科</option></select></li>
            <li class="delimiter">&nbsp;</li>
            <li><img id="btnAdd" title="添加" src="Images/application_add.png" class="btnsel00" onmouseover="this.className='btnsel00_border'" onmouseout="this.className='btnsel00'" /></li>
        </ul>
    </div>
    <div class="cms_contentbox" style="display:none">
        <table class="cms_datatable">
            <tr><th width="200">考试题型</th><th width="100">答案类型</th><th width="100">分数</th><th width="100">序号</th><th width="100">难度</th><th width="300">描述</th><th>操作</th></tr>
        </table>
    </div>
</asp:Content>