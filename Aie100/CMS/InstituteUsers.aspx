<%@ Page Language="C#" AutoEventWireup="true" CodeFile="InstituteUsers.aspx.cs" Inherits="CMS_InstituteUsers" MasterPageFile="~/CMS/Master/cms.master" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <link href="../Plugins/pagination/pagination.css?version=1127" rel="stylesheet" type="text/css" />
    <script src="../Plugins/pagination/jquery.pagination.js?version=1127" type="text/javascript"></script>
    <script src="Scripts/InstituteUsers.js?version=1127" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder" runat="Server">
    <div>学院教师>></div>
    <div class="cms_toolbar">
        <ul>
            <li>
                <select id="ddlInstitutes" style="width: 240px">
                    <option value="-1">请选择学院</option>
                </select>
            </li>
            <li class="delimiter">&nbsp;</li>
            <li><img id="btnRegUser" title="注册新的教师" alt="" src="Images/user_add.png" class="btnsel00" onmouseover="this.className='btnsel00_border'" onmouseout="this.className='btnsel00'" /></li>
            <li><img id="btnAddUsers" title="添加教师" alt="" src="Images/group.png" class="btnsel00" onmouseover="this.className='btnsel00_border'" onmouseout="this.className='btnsel00'" /></li>
        </ul>
    </div>
    <div class="cms_contentbox">
        <table id="tbUserList" class="cms_datatable">
            <tr id="book">
                <th style="width:250px">
                    姓名
                </th>
                <th style="width:250px">
                    用户名
                </th>
                <th style="width:250px">
                    加入日期
                </th>
                <th style="width:80px">
                    状态
                </th>
                <th>
                    操作
                </th>
            </tr>
        </table>
    </div>
    <div style="clear:both;"></div>
    <div id="instUserPagin" style="margin-top: 12px; text-align: center;"></div>
</asp:Content>