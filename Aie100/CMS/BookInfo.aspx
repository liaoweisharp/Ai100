<%@ Page Language="C#" AutoEventWireup="true" CodeFile="BookInfo.aspx.cs" Inherits="CMS_BookInfo" 
    MasterPageFile="~/CMS/Master/cms.master"%>

<asp:Content ID="Content1" runat="server" ContentPlaceHolderID="head">
    <link href="../Plugins/uploadify/uploadify.css" rel="stylesheet" />
    <script src="../Plugins/uploadify/jquery.uploadify.min.js?version=1127" type="text/javascript"></script>
    <link href="../Plugins/pagination/pagination.css?version=1127" rel="stylesheet" type="text/css" />
    <script src="../Plugins/pagination/jquery.pagination.js?version=1127" type="text/javascript"></script>
    <link href="../Styles/blocklayout.css?version=1127" rel="stylesheet" />
    <script src="Scripts/BookInfo.js?version=1127" type="text/javascript"></script>

    <style type="text/css">
        .bklist
        {
            margin: 3px 0px 0px;
            padding: 6px;
            width: 846px;
            height: 300px;
            list-style-type: none;
            border: 1px solid #ccc;
            overflow: auto;
        }
        .bklist li
        {
            height:21px;
        }
        .bklist li:hover
        {
            background-color:#eee;
            cursor:pointer;
        }

       .bst_row:hover{
           background-color:rgb(244,244,244);
         
       }

        .tqt_row:hover{
           background-color:rgb(244,244,244);
          
           color:rgb(42,140,37)
       }

        .upImgBox {
                float: left;
                width: 155px;
                height: 185px;
                text-align: center;
                position: relative;
            }
       
        .dtt {
            position: absolute;
            right: 0px;
            top: 165px;
            width: 20px;
            height: 20px;
            background-color: #ccc;
            filter: alpha(opacity=70);
            opacity: 0.7;
        }

    </style>
</asp:Content>
<asp:Content ID="Content2" runat="server" ContentPlaceHolderID="ContentPlaceHolder">
    <div id="dvFeatureName">书管理>></div>
    <div id="bookInfoBar" class="cms_toolbar">
        <ul>
            <li><img id="btnAdd" title="添加" src="Images/application_add.png" class="btnsel00" onmouseover="this.className='btnsel00_border'" onmouseout="this.className='btnsel00'" /></li>
            <li class="delimiter">&nbsp;</li>
            <li><select id="discipline" style="width:160px"><option value="-1">请选择学科类别</option></select></li>
            <li><select id="subject" style="width:160px"><option value="-1">请选择学科</option></select></li>
        </ul>
    </div>
    <div id="cms_contentbox_bookinfo" class="cms_contentbox">
        <table id="cms_datatable_bookinfo" class="cms_datatable">
            <tr><th width="200">ISBN</th><th>标题</th><th>子标题</th><th width="150">版本</th><th width="100">出版年份</th><th width="80">操作</th></tr>
        </table>
    </div>
    <div style="clear:both;"></div>
    <div id="dvBookPagin" style="margin-top: 12px; text-align: center;"></div>
</asp:Content>