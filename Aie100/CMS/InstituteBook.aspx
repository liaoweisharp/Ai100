<%@ Page Language="C#" AutoEventWireup="true" CodeFile="InstituteBook.aspx.cs" Inherits="CMS_InstituteBook"  MasterPageFile="~/CMS/Master/cms.master"%>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <link href="../Plugins/pagination/pagination.css?version=1127" rel="stylesheet" type="text/css" />
    <script src="../Plugins/pagination/jquery.pagination.js?version=1127" type="text/javascript"></script>
    <script src="Scripts/InstituteBook.js?version=1127" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder" runat="Server">
    <div>学院的书>></div>
    <div id="bookInfoBar" class="cms_toolbar">
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
    <div class="cms_contentbox">
        <table id="tbInstituteBooks" class="cms_datatable">
            <tr id="book">
                <th width="30%">
                    书名
                </th>
                <th style="text-align: center; width:42px">
                    价格
                </th>
                <th style="text-align: center; width:205px">
                    学习
                </th>
                <th>
                    操作
                </th>
            </tr>
        </table>
    </div>
    <div style="clear:both;"></div>
    <div id="instituteBookPagin" style="margin-top: 12px; text-align: center;"></div>
</asp:Content>