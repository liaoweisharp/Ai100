<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Permission.aspx.cs" Inherits="CMS_Permission"
    MasterPageFile="~/CMS/Master/cms.master"%>

<asp:Content ID="Content1" runat="server" ContentPlaceHolderID="head">
    <script src="../Plugins/dynatree/jquery/jquery-ui.custom.min.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/dynatree/jquery/jquery.cookie.js?version=1127" type="text/javascript"></script>
    <link href="../Plugins/dynatree/src/skin/ui.dynatree.css?version=1127" rel="stylesheet" type="text/css" />
    <script src="../Plugins/dynatree/src/jquery.dynatree.min.js?version=1127" type="text/javascript"></script>

    <script src="Scripts/Permission.js?version=1127" type="text/javascript"></script>
    <link href="Styles/permission.css?version=1127" rel="stylesheet" type="text/css" />
</asp:Content>
<asp:Content ID="Content2" runat="server" ContentPlaceHolderID="ContentPlaceHolder">
    <div>权限管理>></div>
    <div id="cms_toolbar" class="cms_toolbar">
        <ul>
            <li><select id="institute" style="width:195px"><option value="-1">请选择学院</option></select></li>
            <li class="delimiter">&nbsp;</li>
            <li><img id="btnSave" title="保存权限设置" src="Images/application_save.gif" class="btnsel00" onmouseover="this.className='btnsel00_border'" onmouseout="this.className='btnsel00'" /></li>
        </ul>
    </div>
    <table id="tbContentbox" class="per_contentbox" style="margin-top:-1px;">
        <tr>
            <td id="tdUserBox" style="width:15%" valign="top">
                <table id="perUserList" class="per_userbox">
                    <tr class="per_title"><th>用户</th></tr>
                </table>
            </td>
            <td id="tdPermissions" valign="top">
                <div class="per_title">权限设置</div>
                <div style="padding:6px;">
                    <label>权限类型：</label>
                    <select id="selPermissionType">
                        <option value="1">功能权限</option>
                        <option value="2">内容权限</option>
                    </select>
                </div>
                <div id="dvPermissionsTree"></div>
            </td>
        </tr>
    </table>
</asp:Content>