<%@ Page Language="C#" AutoEventWireup="true" CodeFile="CustomBook.aspx.cs" Inherits="CMS_CustomBook" 
    MasterPageFile="~/CMS/Master/cms.master"%>
<%--
<%@ Register Src="~/UserControl/EmathEditor.ascx" TagName="EmathEditor" TagPrefix="uc1" %>--%>
<asp:Content ID="Content1" runat="server" ContentPlaceHolderID="head">
    <script src="../Plugins/dynatree/jquery/jquery-ui.custom.min.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/dynatree/jquery/jquery.cookie.js?version=1127" type="text/javascript"></script>
    <link href="../Plugins/dynatree/src/skin/ui.dynatree.css?version=1127" rel="stylesheet" type="text/css" />
    <script src="../Plugins/dynatree/src/jquery.dynatree.min.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/dynatree/contextmenu/jquery.contextMenu-custom.js?version=1127" type="text/javascript"></script>
    <link href="../Plugins/dynatree/contextmenu/jquery.contextMenu.css?version=1127" rel="stylesheet" type="text/css" />

    <link href="Styles/Common.css?version=1127" rel="stylesheet" type="text/css" />
    <link href="../Styles/pas_reg_sty.css?version=1127" rel="stylesheet" type="text/css" />
<%--    <script src="../Scripts/JSUtil/editor.emath.js?version=1127" type="text/javascript"></script>--%>
    <script src="../editor/scripts/editor.js?version=1127" type="text/javascript"></script>
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
    <script src="../Plugins/colResizable-1.3.source.js?version=1127" type="text/javascript"></script>

    <link href="Styles/BookStructure.css?version=1127" rel="stylesheet" type="text/css" />
    <link href="Styles/KnowledgePoints.css?version=1127" rel="stylesheet" type="text/css" />

    <script src="Scripts/KnowledgePointsData.js?version=1127" type="text/javascript"></script>
    <script src="Scripts/BookStructureData.js?version=1127" type="text/javascript"></script>
    <script src="Scripts/Cb_KnowPointInfo.js?version=1127" type="text/javascript"></script>
    <script src="Scripts/Cb_BookStructInfo.js?version=1127" type="text/javascript"></script>

    <script src="Scripts/BookStructContext.js?version=1127" type="text/javascript"></script>
    <script src="Scripts/KnowStructContext.js?version=1127" type="text/javascript"></script>
    <script src="Scripts/CustomBook.js?version=1127" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" runat="server" ContentPlaceHolderID="ContentPlaceHolder">
    <!-- Definition of context menu -->
    <%--<ul id="bookMenu" class="contextMenu">
        <li class="add"><a href="#addBookAfter">添加子节点</a></li>
    </ul>
    <ul id="structureMenu" class="contextMenu">
        <li class="add"><a href="#addStructure">添加子节点</a></li>
        <li class="edit"><a href="#editStructure">编辑节点</a></li>
    </ul>
    <ul id="loMenu" class="contextMenu">
        <li class="edit"><a href="#editLo">编辑节点</a></li>
    </ul>
    <ul id="knowledgePointMenu" class="contextMenu">
        <li class="edit"><a href="#editKp">编辑节点</a></li>
        <li class="delete"><a href="#deleteKp">删除节点</a></li>
    </ul>--%>

    <!--书菜单-->
    <ul id="bookMenu" class="contextMenu">
        <li class="add"><a href="#addSubStructure">添加<span>子节点</span></a></li>
    </ul>
    <!--章节菜单-->
    <ul id="structureMenu" class="contextMenu">
        <li class="add"><a href="#addSiblingNode">添加<span>同级节点</span></a></li>
        <li class="addsub"><a href="#addSubStructure">添加<span>子节点</span></a></li>
        <li class="edit"><a href="#editStructure">编辑<span>节点</span></a></li>
        <li class="delete"><a href="#deleteStructure">删除<span>节点</span></a></li>
    </ul>
    <!--知识点菜单-->
    <ul id="knowledgePointMenu" class="contextMenu">
        <li class="delete"><a href="#deleteKp">删除知识点</a></li>
    </ul>

    <!--// End definition -->
    <div>定制书>></div>
    <div id="bookStructureBar" class="cms_toolbar">
        <ul>
            <li><img id="btnSave" title="保存" src="Images/application_save.gif" class="btnsel00" onmouseover="this.className='btnsel00_border'" onmouseout="this.className='btnsel00'" /></li>
        </ul>
    </div>
    <table id="tbContentbox" cellpadding="0" cellspacing="0" style="width:100%; border: 1px solid #bed7f5; border-collapse:collapse; margin-top:-1px">
        <tr>
            <td valign="top" style="width:560px; padding:8px;border: 1px solid #bed7f5;">
                <div style="background-color:#ebecec; padding: 4px">
                    <select id="Des" style="width: 120px" class="sel_loading"></select> >
                    <select id="Sub" style="width: 120px"><option value='-1'>请选择学科</option></select> >
                    <select id="selBookList" style="width: 250px" class="sel_loading"></select>
                </div>
                <div id="dvBookStructTree" style="border:0px solid #bed7f5;"></div>
            </td>
            <td valign="top" style="padding:8px;border: 1px solid #bed7f5;">
                <div style="background-color:#ebecec; padding: 4px">&nbsp;</div>
                <div id="dvKnowStructTree" style="border:0px solid #bed7f5;"></div>
            </td>
        </tr>
    </table>
    <!-- Definition of Lo editor -->
    <div id="divBsInfo" class="divLoInfo">
        <div id="divBsHeader" style="background-color:rgb(220,243,253)">
              <table width="100%" cellpadding="5">
              <tr>
                <td style="text-align:left;color:#43525a"><b><span id="spBsNameHeader">书结构</span></b></td>
                <td style="text-align:right"><span><img src="../Images/close.gif" alt="Close" title="Close" style="cursor:pointer" onclick="onBsBtnCloseClick()" /></span></td>
              </tr>
              </table>
        </div>
        <div>
            <div id="divBsDaoXiang" class="daoxiang">
                <ul id="ulBsBaseInfo" style="cursor: pointer;" class="daoxiang_hover_2 c_ore"><li>基本信息</li></ul>
                <ul id="ulBsDescription" style="cursor: pointer;" class="daoxiang_link c_blue"><li>描述信息</li></ul>
            </div>
            <div id="dvBsBaseInfo" class="dvBaseInfo" style="padding: 5px;">
                <table cellpadding="4" cellspacing="2" border="0">
                    <tr>
                        <td class="fname"><span style='color:#e62701; font-size:15px;'>*</span>&nbsp;结构名称:</td>
                        <td><input id="txtTitle" type="text" style="width: 720px" /></td>
                    </tr>
                    <tr>
                        <td class="fname"><span style='color:#e62701; font-size:15px;'>*</span>&nbsp;结构级别:</td>
                        <td><select id="ddlStructureType" class="inp"><option value='-1'>Select Structure Type</option></select></td>
                    </tr>
                    <tr>
                        <td class="fname">编号:</td>
                        <td><input type="text" id="txtOrderName" class="inp" /></td>
                    </tr>
                    <tr style="display:none">
                        <td class="fname">页码:</td>
                        <td><input type="text" id="txtPosition" class="inp" /></td>
                    </tr>
                    <tr style="display:none">
                        <td class="fname">URL:</td>
                        <td><input type="text" id="txtUrl" class="inp" /></td>
                    </tr>
                </table>
            </div>
            <div id="dvBsDescription" class="dvDescription" style="padding: 5px; display: none;">
                <div id="divBsDescription" style="padding: 5px;">
                    <div class="loDetails" title="click here for edit" id="divBsAreaDetails" onclick="onBsDescriptionDivClick(this)">&nbsp;</div>
                </div>
            </div>
        </div>
        <div style="padding: 10px;border-top: 1px dotted #B2D0EC;">
            <table width="100%">
                <tr>
                    <td style="text-align:right;">
                        <input type="button" value="确定" class="but_blue_60 mg_r10" onclick="onBsBtnConfirmClick()"/>
                        <input type="button" value="取消" class="but_blue_60 mg_r10" onclick="onBsBtnCloseClick()"/>
                    </td>
                </tr>
            </table>
        </div>
    </div>
    <div id="divLoInfo" class="divLoInfo">
        <%--<div id="divLoEmathEditor" style="display: none"><uc1:EmathEditor ID="EmathEditor1" runat="server" /></div>--%>
        <div id="divLoHeader" style="background-color:rgb(220,243,253)">
              <table width="100%" cellpadding="5">
              <tr>
                <td style="text-align:left;color:#43525a"><b><span id="spLoNameHeader">知识点</span></b></td>
                <td style="text-align:right"><span><img src="../Images/close.gif" alt="Close" title="Close" style="cursor:pointer" onclick="onBtnCancelClick()" /></span></td>
              </tr>
              </table>
        </div>
        <div>
            <div id="divLoDaoXiang" class="daoxiang">
                <ul id="ulBaseInfo" style="cursor: pointer;" class="daoxiang_hover_2 c_ore"><li>基本信息</li></ul>
                <ul id="ulDescription" style="cursor: pointer;" class="daoxiang_link c_blue"><li>描述信息</li></ul>
            </div>
            <div id="dvBaseInfo" class="dvBaseInfo" style="padding: 5px;">
                <table cellpadding="4" cellspacing="2" border="0">
                    <tr>
                        <td class="fname"><span style='color:#e62701; font-size:15px;'>*</span>&nbsp;名字:</td>
                        <td><input id="txtLoName" type="text" style="width: 720px" /></td>
                    </tr>
                    <tr>
                        <td class="fname"><span style='color:#e62701; font-size:15px;'>*</span>&nbsp;顺序:</td>
                        <td><input id="txtSequence" type="text" class="inp" /></td>
                    </tr>
                    <tr>
                        <td class="fname"><span style='color:#e62701; font-size:15px;'>*</span>&nbsp;顺序名:</td>
                        <td><input id="txtSequenceName" type="text" class="inp" /></td>
                    </tr>
                    <tr style="display:none">
                        <td class="fname">URL:</td>
                        <td><input type="text" id="txtURL" class="inp" disabled="disabled" /></td>
                    </tr>
                    <tr style="display:none">
                        <td class="fname">页码:</td>
                        <td><input type="text" id="txtLocation" class="inp" disabled="disabled" /></td>
                    </tr>
                    <tr style="display:none">
                        <td class="fname">标签:</td>
                        <td><input type="text" id="txtTags" class="inp" disabled="disabled" /></td>
                    </tr>
                    <tr>
                        <td class="fname"><span style='color:#e62701; font-size:15px;'>*</span>&nbsp;知识维度:</td>
                        <td>
                            <select id="ddlCategory" class="inp" disabled="disabled" ><option value='-1'>选择知识维度</option></select>
                        </td>
                    </tr>
                </table>
            </div>
            <div id="dvDescription" class="dvDescription" style="padding: 5px; display: none;">
                <div style="text-align: center; padding-top: 5px">
                    <div style="display:none">
                    <input id="rdShortDescription" type="radio" value="short" checked="checked" name="rdDescriptionGroup" />
                    <label for="rdShortDescription" style="color: #005f9c; cursor: pointer;">Abstract</label>&nbsp;
                    <input id="rdLongDescription" type="radio" value="long" name="rdDescriptionGroup" />
                    <label for="rdLongDescription" style="color: #005f9c; cursor: pointer;">Details</label>&nbsp;
                    <input id="rdExtendDescription" type="radio" value="extend" name="rdDescriptionGroup" />
                    <label for="rdExtendDescription" style="color: #005f9c; cursor: pointer;">Extended Discussion</label>
                    </div>
                </div>
                <div id="divShortDescription" style="padding: 5px;">
                    <div class="loDetails" title="click here for edit" id="divAreaShortDetails" onclick="onLoDescriptionDivClick(this)">&nbsp;</div>
                </div>
                <%--<div id="divLongDescription" style="padding: 5px; display: none">
                    <div class="loDetails" title="click here for edit" id="divAreaLongDetails" onclick="onLoDescriptionDivClick(this)">&nbsp;</div>
                </div>
                <div id="divExtendDescription" style="padding: 5px; display: none">
                    <div class="loDetails" title="click here for edit" id="divAreaExtendDetails" onclick="onLoDescriptionDivClick(this)">&nbsp;</div>
                </div>--%>
            </div>
        </div>
        <div style="padding: 10px;border-top: 1px dotted #B2D0EC;">
            <table width="100%">
                <tr>
                    <td style="text-align: left; color: #005F9C; font-size: 13px;">
                       <%-- <div id="divLoDescriptionPreview" style="display: none;">
                            <span id="spAbstractPreview" style="cursor: pointer;"><img src="../Images/application_view_list.png" />Abstract Preview</span>&nbsp; 
                            <span id="spDetailsPreview" style="cursor: pointer;"><img src="../Images/application_view_list.png" />Details Preview</span>&nbsp; 
                            <span id="spExtendPreview" style="cursor: pointer;"><img src="../Images/application_view_list.png" />Extended Discussion Preview</span>
                        </div>--%>
                    </td>
                    <td style="text-align:right;">
                        <input type="button" value="确定" class="but_blue_60 mg_r10" onclick="onBtnConfirmClick()"/>
                        <input type="button" value="取消" class="but_blue_60 mg_r10" onclick="onBtnCancelClick()"/>
                    </td>
                </tr>
            </table>
        </div>
    </div>
    <div id="divDisableOthers" class="disabledDIV"></div>
    <!--// End definition -->
    <asp:ScriptManager ID="ScriptManager1" runat="server">
    </asp:ScriptManager>
</asp:Content>