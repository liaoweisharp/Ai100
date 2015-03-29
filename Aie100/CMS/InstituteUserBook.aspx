<%@ Page Language="C#" AutoEventWireup="true" CodeFile="InstituteUserBook.aspx.cs" Inherits="CMS_InstituteUserBook" MasterPageFile="~/CMS/Master/cms.master" %>

<asp:Content ID="Content1" runat="server" ContentPlaceHolderID="head">
    <link href="Styles/permission.css?version=1127" rel="stylesheet" type="text/css" />
    <script src="Scripts/InstituteUserBook.js?version=1127" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" runat="server" ContentPlaceHolderID="ContentPlaceHolder">
    <div>学院教师的书>></div>
    <div id="cms_toolbar" class="cms_toolbar">
        <ul>
            <li>
                <select id="ddlInstitutes" style="width: 240px">
                    <option value="-1">请选择学院</option>
                </select>
            </li>
            <li class="delimiter">&nbsp;</li>
            <li><img id="btnAdd" title="分配书" alt="Add relationship" src="Images/assign.png" class="btnsel00" onmouseover="this.className='btnsel00_border'" onmouseout="this.className='btnsel00'" /></li>
        </ul>
    </div>
    <table id="tbContentbox" class="per_contentbox" style="margin-top:-1px;">
        <tr>
            <td style="width:15%" valign="top">
                <div id="dvUserList" style="overflow:auto">
                    <table id="tbUserList" class="per_userbox" style="border:0px">
                        <tr class="per_title_blue"><th>教师</th></tr>
                    </table>
                </div>
            </td>
            <td valign="top">
                <div id="dvUserBookList" style="overflow:auto">
                    <table id="tbUserBookList" class="per_userbox" style="border:0px;">
                        <tr class="per_title_blue"><th style="width:35%; text-align:left; padding-left:10px;">书名</th><th style="text-align:left;  padding-left:10px;">操作</th></tr>
                    </table>
                </div>                
            </td>
        </tr>
    </table>
</asp:Content>
