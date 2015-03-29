<%@ Page Language="C#" AutoEventWireup="true" CodeFile="KnowledgePointRelation.aspx.cs" Inherits="CMS_KnowledgePointRelation"
    MasterPageFile="~/CMS/Master/cms.master" %>

<asp:Content ID="Content1" runat="server" ContentPlaceHolderID="head">
    <script src="../Plugins/dynatree/jquery/jquery-ui.custom.min.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/dynatree/jquery/jquery.cookie.js?version=1127" type="text/javascript"></script>
    <link href="../Plugins/dynatree/src/skin/ui.dynatree.css?version=1127" rel="stylesheet" type="text/css" />
    <script src="../Plugins/dynatree/src/jquery.dynatree.min.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/dynatree/contextmenu/jquery.contextMenu-custom.js?version=1127" type="text/javascript"></script>
    <link href="../Plugins/dynatree/contextmenu/jquery.contextMenu.css?version=1127" rel="stylesheet" type="text/css" />

    <link href="Styles/Common.css?version=1127" rel="stylesheet" type="text/css" />
    <link href="../Styles/pas_reg_sty.css?version=1127" rel="stylesheet" type="text/css" />
    <script src="../Scripts/JSUtil/editor.emath.js?version=1127" type="text/javascript"></script>
    <link href="../Plugins/jquery-ui/themes/base/jquery.ui.all.css?version=1127" rel="stylesheet"
        type="text/css" />
    <link href="../Plugins/jquery-ui/themes/base/default.css?version=1127" rel="stylesheet"
        type="text/css" />
    <script src="../Plugins/jquery-ui/ui/jquery.bgiframe-2.1.2.js?version=1127"
        type="text/javascript"></script>
    <script src="../Plugins/jquery-ui/ui/jquery.ui.core.min.js?version=1127"
        type="text/javascript"></script>
    <script src="../Plugins/jquery-ui/ui/jquery.ui.widget.min.js?version=1127"
        type="text/javascript"></script>
    <script src="../Plugins/jquery-ui/ui/jquery.ui.mouse.min.js?version=1127"
        type="text/javascript"></script>
    <script src="../Plugins/jquery-ui/ui/jquery.ui.draggable.min.js?version=1127"
        type="text/javascript"></script>
    <script src="../Plugins/jquery-ui/ui/jquery.ui.position.min.js?version=1127"
        type="text/javascript"></script>
    <script src="../Plugins/jquery-ui/ui/jquery.ui.resizable.min.js?version=1127"
        type="text/javascript"></script>
    <script src="../Plugins/jquery-ui/ui/jquery.ui.dialog.min.js?version=1127"
        type="text/javascript"></script>
    <link href="../Plugins/showLoading/css/showLoading.css?version=1127" rel="stylesheet"
        type="text/css" />
    <script src="../Plugins/showLoading/js/jquery.showLoading.min.js?version=1127"
        type="text/javascript"></script>
    <link href="Styles/BookStructure.css?version=1127" rel="stylesheet" type="text/css" />
    <link href="Styles/KnowledgePointRelation.css?version=1127" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="../Scripts/Math.js?version=1127"></script>
    <script src="Scripts/KnowledgePointsData.js?version=1127" type="text/javascript"></script>
    <script src="Scripts/KnowledgePointRelation.js?version=1127" type="text/javascript"></script>
    <script src="../Scripts/ShowDetails.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/colResizable-1.3.source.js?version=1127" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" runat="server" ContentPlaceHolderID="ContentPlaceHolder">
    <!-- Definition of context menu -->
    <ul id="knowledgePointMenu" class="contextMenu" style="width: 160px">
        <li class="relation"><a href="#addRelation">设置知识点关系</a></li>
    </ul>
    <!--// End definition -->
    <div>知识点关系管理>></div>
    <div id="bookStructureBar" class="cms_toolbar">
        <ul>
            <li>
                <select id="Des" style="width: 180px" class="sel_loading"></select></li>
            <li>
                <select id="Sub" style="width: 180px">
                    <option value='-1'>请选择学科</option>
                </select></li>
            <li>
                <select id="selBookList" style="width: 250px" class="sel_loading"></select></li>
            <li class="delimiter">&nbsp;</li>
            <li>
                <img alt="" id="btnSave" title="保存" src="Images/application_save.gif" class="btnsel00" onmouseover="this.className='btnsel00_border'" onmouseout="this.className='btnsel00'" /></li>
            <%--<li>
                <img alt="" id="btnViewRelationMap" title="查看关系图" src="../Images/map.png" class="btnsel00" onmouseover="this.className='btnsel00_border'" onmouseout="this.className='btnsel00'" /></li>--%>
        </ul>
    </div>
    <%--<table id="tbContentbox" class="kpr_contentbox" style="display:none; margin-top:-1px">
        <tr>
            <td style="width:25%; padding-bottom:10px" valign="top"><div id="bookStructureTree"></div></td>
            <td id="hasRelationBox" valign="top" style="width:75%;">
            <div id="dvRightContent" style="overflow:auto">
                <div id="relationTip" style="padding: 8px 12px;">展开左边知识点，查看知识点关系。</div>
                <table id="hasRelationList" class="kpr_has_item" style="display: none; font-size:10.5pt">
                    <tr>
                        <th style="text-align:left; width:100px">单元</th>
                        <th style="text-align:left; width:50%">知识点</th>
                        <th style="width:100px">权重</th>
                        <th style="width:100px">删除</th>
                        <th>&nbsp;</th>
                    </tr>
                </table>
            </div>
            </td>
        </tr>
    </table>--%>
    <table id="tbContentbox" style="display: none; width: 100%; border: 1px solid #bed7f5; border-collapse: collapse; margin-top: -1px;">
        <tr>
            <td style="border: 1px solid #bed7f5; width: 28%;" valign="top"><div id="bookStructureTree"></div></td>
            <td id="hasRelationBox" style="border: 1px solid #bed7f5; width: 44%;" valign="top">
                <div id="dvRightContent" style="overflow: auto">
                    <div id="relationTip" style="padding: 8px 12px;">
                        <ol>
                            <li>选择左边树中的知识点查看关联；</li>
                            <li>选择右边树中的知识点建立关联。</li>
                        </ol>
                    </div>
                    <table id="hasRelationList" class="kpr_has_item" style="display: none; font-size: 10.5pt">
                        <tr>
                            <th style="text-align: left; width: 100px">单元</th>
                            <th style="text-align: left; width: 50%">知识点</th>
                            <th style="width: 100px; display:none">权重</th>
                            <th style="width: 100px">删除</th>
                            <th>&nbsp;</th>
                        </tr>
                    </table>
                </div>
            </td>
            <td style="border: 1px solid #bed7f5; width: 28%;" valign="top"><div id="dvRelationTree"></div></td>
        </tr>
    </table>
</asp:Content>
