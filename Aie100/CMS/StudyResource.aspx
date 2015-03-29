<%@ Page Language="C#" AutoEventWireup="true" CodeFile="StudyResource.aspx.cs" Inherits="CMS_StudyResource"
    MasterPageFile="~/CMS/Master/cms1.master" %>

<%@ Register Assembly="System.Web.Extensions, Version=1.0.61025.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35"
    Namespace="System.Web.UI" TagPrefix="asp" %>
<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>
<%--<%@ Register Src="~/UserControl/EmathEditor.ascx" TagName="EmathEditor" TagPrefix="uc1" %>--%>
<asp:Content ID="Content1" runat="server" ContentPlaceHolderID="head">
    <title>学习资源管理</title>
    <script src="../Plugins/dynatree/jquery/jquery.min.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/dynatree/jquery/jquery-ui.custom.min.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/dynatree/jquery/jquery.cookie.js?version=1127" type="text/javascript"></script>
    <link href="../Plugins/dynatree/src/skin/ui.dynatree.css?version=1127" rel="stylesheet" type="text/css" />
    <script src="../Plugins/dynatree/src/jquery.dynatree.min.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/dynatree/contextmenu/jquery.contextMenu-custom.js?version=1127" type="text/javascript"></script>
    <link href="../Plugins/dynatree/contextmenu/jquery.contextMenu.css?version=1127" rel="stylesheet" type="text/css" />
    <link href="../Styles/blocklayout.css?version=1127" rel="stylesheet" type="text/css" />
    <script src="../Scripts/jquery.ajax.js?version=1127" type="text/javascript"></script>
    <link href="Styles/StudyResources.css?version=1127" rel="stylesheet" type="text/css" />
    <link href="../Style/StyleSheet.css?version=1127" rel="stylesheet" type="text/css" />
    <link href="Styles/Common.css?version=1127" rel="stylesheet" type="text/css" />
    <link href="Styles/ControlCss.css?version=1127" rel="stylesheet" type="text/css" />
    <link href="../Styles/pas_reg_sty.css?version=1127" rel="stylesheet" type="text/css" />
    <link href="../Style/EmathTree.css?version=1127" rel="stylesheet" type="text/css" />
    <script src="../Scripts/comm.js?version=1127" type="text/javascript"></script>
    <script src="../Scripts/Array.js?version=1127" type="text/javascript"></script>
    <script src="../Scripts/String.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/jquery-ui/ui/jquery.ui.core.min.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/jquery-ui/ui/jquery.ui.widget.min.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/jquery-ui/ui/jquery.ui.mouse.min.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/jquery-ui/ui/jquery.ui.draggable.min.js?version=1127" type="text/javascript"></script>
    <link href="../Plugins/jBox/Skins/Default/jbox.css?version=1127" rel="stylesheet"
        type="text/css" />
    <script src="../Plugins/jBox/jquery.jBox-2.3.min.js?version=1127"
        type="text/javascript"></script>
    <script src="../Plugins/jBox/i18n/jquery.jBox-us-en.js?version=1127"
        type="text/javascript"></script>
    <script src="../Scripts/ShowDetails.js?version=1127" type="text/javascript"></script>
    <link href="../Plugins/showLoading/css/showLoading.css?version=1127" rel="stylesheet"
        type="text/css" />
    <script src="../Plugins/showLoading/js/jquery.showLoading.min.js?version=1127"
        type="text/javascript"></script>
    <script src="Scripts/cms_header.js?version=1127" type="text/javascript"></script>
    <link href="Styles/BookStructure.css?version=1127" rel="stylesheet" type="text/css" />
    <link href="Styles/KnowledgePointRelation.css?version=1127" rel="stylesheet" type="text/css" />
    <link href="Styles/KnowledgePoints.css?version=1127" rel="stylesheet" type="text/css" />
    <script src="Scripts/LoStudyReference.js?version=1127" type="text/javascript"></script>
    <script src="../editor/scripts/editor.js?version=1127" type="text/javascript"></script>
    <link href="../Plugins/EmathTabs/EmathTabs.css?version=1127" rel="stylesheet" type="text/css" />
    <script src="../Plugins/EmathTabs/EmathTabs.js?version=1127" type="text/javascript"></script>
    <script src="Scripts/KnowledgePointsData.js?version=1127" type="text/javascript"></script>
    <script src="Scripts/KnowledgePointsInfo.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/colResizable-1.3.source.js?version=1127" type="text/javascript"></script>
    <script src="Scripts/ContentAudit.js?version=1127" type="text/javascript"></script>
    <script src="Scripts/ContentEditHistory.js?version=1127" type="text/javascript"></script>
    <link href="../Plugins/pagination/pagination.css?version=1127" rel="stylesheet" type="text/css" />
    <script src="../Plugins/pagination/jquery.pagination.js?version=1127" type="text/javascript"></script>
    <script type="text/javascript">
        $(function () {
            $("#editor_InsertLO").css("display", "");
        })
    </script>
</asp:Content>
<asp:Content ID="Content2" runat="server" ContentPlaceHolderID="ContentPlaceHolder">
    <asp:ScriptManager ID="ScriptManager1" runat="server">
        <Services>
            <asp:ServiceReference Path="~/WebService/CmsWS.asmx" />
        </Services>
        <Scripts>
            <asp:ScriptReference Path="~/CMS/Scripts/StudyResources.js?version=1127" />
            <asp:ScriptReference Path="~/Js/functions.js?version=1127" />
            <asp:ScriptReference Path="~/Js/Common.js?version=1127" />
            <asp:ScriptReference Path="~/Js/EmathTree.js?version=1127" />
        </Scripts>
    </asp:ScriptManager>
    <div id="divImgLoading" style="text-align: center; top: 50%; left: 50%; position: fixed;
        display: none">
        <img alt="loading..." src="../Images/ajax-loader_02.gif" />
    </div>
    <div id="divStudyResources">
        <!-- Definition of context menu -->
        <ul id="knowledgePointMenu" class="contextMenu">
            <li class="edit"><a href="#editKp">Edit Node</a></li>
        </ul>
        <!--// End definition -->
        <div>
            学习资源管理>></div>
        <div id="divStudyResourceManageTop" class="cms_toolbar">
            <ul>
                <li>
                    <select id="Des">
                        <option value="-1">请选择学科类别</option>
                    </select></li>
                <li>
                    <select id="Sub">
                        <option value="-1">请选择学科</option>
                    </select></li>
                <li>
                    <select id="selBookList" style="width: 260px">
                        <option value="-1">请选择书</option>
                    </select></li>
                <li class="delimiter">&nbsp;</li>
                <li>
                    <img id="btnAdd" title="添加" src="Images/application_add.png" class="btnsel00" onmouseover="this.className='btnsel00_border'"
                        onmouseout="this.className='btnsel00'" /></li>
                <li class="delimiter">&nbsp;</li>
                <li>
                    <select id="ddlViewEditHistory" onchange="ddlViewEditHistory_change(this)">
                        <option value="-1">编辑历史</option>
                        <option value="0">最近编辑创建的学习资料</option>
                        <option value="1">审核过的学习资料</option>
                        <option value="2">未审核过的学习资料</option>
                        <option value="3">有建议的学习资料</option>
                    </select></li>
            </ul>
        </div>
        <div id="divStudyResourceInfo1">
            <table id="table2" border="0" cellpadding="0" cellspacing="0" class="table2" width="100%" style="margin-top: -1px">
                <tbody>
                    <tr>
                        <td class="table2Td1" style="padding-bottom: 10px">
                            <div id="divTree">
                            </div>
                        </td>
                        <td class="table2Td2">
                            <div id="dvRightContent" style="overflow: auto">
                                <div style="padding: 8px">
                                    <div id="SR_divKnowledge" style="display: none">
                                        <div style="font-weight: bold;">
                                            <center>
                                                <span id="SR_knowledgeTitle"></span>
                                            </center>
                                        </div>
                                        <div id="SR_divKnowledgeDetails" style="margin: 5px 0px 10px 0px; line-height: 18px;">
                                            <span style="font-size: 11px; color: Gray;">没有知识点描述信息</span></div>
                                    </div>
                                    <div id="divStudyResourceList" style="margin-bottom:10px">
                                        <div id="divStudyMaterialsInfoHeader">
                                            学习资源信息
                                        </div>
                                        <div>
                                            <select id="ddlResourceTypeFilter" onchange="onResourceTypeFilter(this)">
                                                <option value="-1">所有资源</option>
                                                <option value="1">课件</option>
                                                <option value="2">素材库</option>
                                                <option value="3">词汇表</option>
                                            </select>
                                        </div>
                                        <div id="divStudyResourceInfo" style="margin-top: 5px;">
                                        </div>
                                        <center>
                                            <div class="pagination" style="margin-top: 12px; font-size: 10.5pt">
                                            </div>
                                        </center>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div id="divStudyResourceContainer" style="display: none">
            <div id="divStudyResourceInfo2" style="padding: 10px">
                <!--//-->
                <div class="cont_box_nr1000">
                    <div>
                        <div class="custab_bg">
                            <ul id="ulBasicInfo" class="custab_ul">
                                <li class="custab_l"></li>
                                <li class="custab_m">基本信息</li>
                                <li class="custab_r"></li>
                            </ul>
                            <ul id="ulContents" class="custab_ul">
                                <li class="custab_l"></li>
                                <li class="custab_m" >内容</li>
                                <li class="custab_r"></li>
                            </ul>
                        </div>
		                <div class="custab_box" style="width:708px;">
                            <div id="dvBasicInfo" class="f12 line_h22">
                                <!---->
                                <div>
                                    <table id="table3" border="0" cellpadding="5" cellspacing="0" width="auto">
                                        <tbody>
                                            <tr>
                                                <td colspan="2">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="auto" style="border-collapse: collapse">
                                                        <tr>
                                                            <td class="table4Td1">
                                                                <div class="tagText">资料类型:</div>
                                                            </td>
                                                            <td class="table4Td2">
                                                                <select id="ddlResourceType" onchange="ddlResourceTypeChange(this)" style="width:180px">
                                                                    <option value="1">课件</option>
                                                                    <option value="2">素材库</option>
                                                                    <option value="3">词汇表</option>
                                                                </select>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="auto" style="border-collapse: collapse">
                                                        <tr>
                                                            <td class="table4Td1">
                                                                <div class="tagText">
                                                                    <span style='color: #e62701; font-size: 13px;'>*</span>&nbsp;标题:</div>
                                                            </td>
                                                            <td class="table4Td2">
                                                                <input id="txtReferenceTiltle" type="text" />
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="auto" style="border-collapse: collapse">
                                                        <tr>
                                                            <td class="table4Td1">
                                                                <div class="tagText">
                                                                    标签:</div>
                                                            </td>
                                                            <td class="table4Td2">
                                                                <input id="txtSrTags" type="text" style="width: 400px; margin-left: 2px;" />
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td rowspan="2" style="padding: 0px;">
                                                    <table id="table4" border="0" cellpadding="0" cellspacing="0" class="table4" style="line-height: 30px;">
                                                        <tbody>
                                                            <tr>
                                                                <td class="table4Td1">
                                                                    <div class="tagText">
                                                                        适合学习者情况:</div>
                                                                </td>
                                                                <td class="table4Td2">
                                                                    <select id="ddlRecommendation" class="selectTag">
                                                                        <option value="1" selected="selected">必须</option>
                                                                        <option value="2">值得推荐</option>
                                                                        <option value="3">可选</option>
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="table4Td1">
                                                                    <div class="tagText">
                                                                        难度:</div>
                                                                </td>
                                                                <td class="table4Td2">
                                                                    <select id="ddlDifficulty" class="selectTag">
                                                                        <option value="1" selected="selected">1</option>
                                                                        <option value="2">2</option>
                                                                        <option value="3">3</option>
                                                                        <option value="4">4</option>
                                                                        <option value="5">5</option>
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="table4Td1">
                                                                    <div class="tagText">
                                                                        格式类型:</div>
                                                                </td>
                                                                <td class="table4Td2">
                                                                    <select id="ddlFileType" class="selectTag">
                                                                        <option value="1" selected="selected">书</option>
                                                                        <option value="2">音频</option>
                                                                        <option value="3">视频</option>
                                                                        <option value="4">文章</option>
                                                                        <option value="5">游戏</option>
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="table4Td1">
                                                                    <div class="tagText">
                                                                        类容类型:</div>
                                                                </td>
                                                                <td class="table4Td2">
                                                                    <select id="ddlContentType" class="selectTag">
                                                                        <option value="-1">NULL</option>
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                            <tr style="display: none">
                                                                <td class="table4Td1">
                                                                    <div class="tagText">
                                                                        关联度:</div>
                                                                </td>
                                                                <td class="table4Td2">
                                                                    <select id="ddlRelevancy" class="selectTag">
                                                                        <option value="0.9" selected="selected">90%</option>
                                                                        <option value="0.4">40%</option>
                                                                        <option value="0.5">50%</option>
                                                                        <option value="0.6">60%</option>
                                                                        <option value="0.7">70%</option>
                                                                        <option value="0.8">80%</option>
                                                                        <option value="1.0">100%</option>
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="table4Td1">
                                                                    <div class="tagText">
                                                                        共享级别:</div>
                                                                </td>
                                                                <td class="table4Td2">
                                                                    <select id="ddlShareFlag" class="selectTag">
                                                                        <option value="0">自己</option>
                                                                        <option value="1">课程</option>
                                                                        <option value="2" selected="selected">书</option>
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="table4Td1">
                                                                    <div class="tagText">
                                                                        阶段:</div>
                                                                </td>
                                                                <td class="table4Td2">
                                                                    <select id="ddlPhase" class="selectTag">
                                                                        <option value="1">引入</option>
                                                                        <option selected="selected" value="2">正式</option>
                                                                        <option value="3">探索</option>
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="table4Td1">
                                                                    <div class="tagText">
                                                                        绑定位置:</div>
                                                                </td>
                                                                <td class="table4Td2">
                                                                    <select id="ddlStructureType" class="selectTag">
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="table4Td1">
                                                                    <div class="tagText">知识点:</div>
                                                                </td>
                                                                <td class="table4Td2">
                                                                    <input type="text"readonly="readonly" id="txtKpName" style="width: 175px;"><img onmouseout="this.className='btnsel00'" onmouseover="this.className='btnsel00_border'" class="btnsel00" src="../Images/application_view_list.png" style="vertical-align: middle;" title="选择知识点" id="btnSelKp">
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="table4Td1">
                                                                    <div class="tagText">
                                                                        是否可见:</div>
                                                                </td>
                                                                <td class="table4Td2">
                                                                    <select id="ddlVisible" class="selectTag">
                                                                        <option value="0">否</option>
                                                                        <option value="1" selected="selected">是</option>
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                                <td class="table3Td2" id="tb3t2" style="vertical-align: top">
                                                    <div style="display:none">
                                                        <fieldset style="width: 172px; float: left; padding: 5px 10px">
                                                            <legend>电子书设置</legend>
                                                            <ul class="settings_h">
                                                                <li>
                                                                    <input id="rd_e_Displaydirectly" name="rd_eBookSettings" type="radio" value="0" /><label
                                                                        for="rd_e_Displaydirectly">直接显示</label></li>
                                                                <li>
                                                                    <input id="rd_e_ExpansionLink" name="rd_eBookSettings" type="radio" value="1" /><label
                                                                        for="rd_e_ExpansionLink">展开链接</label></li>
                                                                <li>
                                                                    <input id="rd_e_PopupLink" name="rd_eBookSettings" type="radio" value="2" /><label
                                                                        for="rd_e_PopupLink">弹出链接</label></li>
                                                                <li>
                                                                    <input id="rd_e_Disabled" name="rd_eBookSettings" type="radio" value="3" /><label
                                                                        for="rd_e_Disabled">禁用</label></li>
                                                            </ul>
                                                        </fieldset>
                                                        <fieldset style="width: 172px; float: left; padding: 5px 10px; margin-left: 5px;">
                                                            <legend>学习帮助设置</legend>
                                                            <ul class="settings_h">
                                                                <li>
                                                                    <input id="rd_s_Displaydirectly" name="rd_StudyHelpSettings" type="radio" value="0" /><label
                                                                        for="rd_s_Displaydirectly">直接显示</label></li>
                                                                <li>
                                                                    <input id="rd_s_ExpansionLink" name="rd_StudyHelpSettings" type="radio" value="1" /><label
                                                                        for="rd_s_ExpansionLink">展开链接</label></li>
                                                                <li>
                                                                    <input id="rd_s_PopupLink" name="rd_StudyHelpSettings" type="radio" value="2" /><label
                                                                        for="rd_s_PopupLink">弹出链接</label></li>
                                                                <li>
                                                                    <input id="rd_s_Disabled" name="rd_StudyHelpSettings" type="radio" value="3" /><label
                                                                        for="rd_s_Disabled">禁用</label></li>
                                                            </ul>
                                                        </fieldset>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <!---->
                            </div>
                            <div id="dvContents" class="f12 line_h22" style="display:none">
                                <!---->
                                <div>
                                    <div id="divStudyResourceContentContainer">
                                        <div id="divStudyResourceContent" class="content" title="点击这儿编辑" onclick="onStudyResourceContentDivClick(this)" style="overflow-y:auto; overflow-x:hidden"></div>
                                    </div>
                                </div>
                                <!---->
                            </div>
		                </div>
	                </div>
                </div>
                <!--//-->
            </div>
        </div>
    </div>
    <div id="divDisableOthers" class="disabledDIV">
    </div>
    <div id="divLoInfo" class="divLoInfo">
        <%--<div id="divLoEmathEditor" style="display: none"><uc1:EmathEditor ID="EmathEditor2" runat="server" /></div>--%>
        <div id="divLoHeader" style="background-color: rgb(220,243,253)">
            <table width="100%" cellpadding="5">
                <tr>
                    <td style="text-align: left; color: #43525a">
                        <b><span id="spLoNameHeader">知识点</span></b>
                    </td>
                    <td style="text-align: right">
                        <span>
                            <img src="../Images/close.gif" alt="关闭" title="关闭" style="cursor: pointer" onclick="onBtnCancelClick()" /></span>
                    </td>
                </tr>
            </table>
        </div>
        <div>
            <div id="divLoDaoXiang" class="daoxiang" style="display:none">
                <ul id="ulBaseInfo" style="cursor: pointer;" class="daoxiang_hover_2 c_ore">
                    <li>基本信息</li></ul>
                <ul id="ulDescription" style="cursor: pointer;" class="daoxiang_link c_blue">
                    <li>描述</li></ul>
            </div>
            <div id="dvBaseInfo" class="dvBaseInfo" style="padding: 5px 5px 0px 5px;">
                <table cellpadding="4" cellspacing="2" border="0">
                    <tr>
                        <td class="fname" style="width:110px;">
                            <span style='color: #e62701; font-size: 15px;'>*</span>&nbsp;名字:
                        </td>
                        <td>
                            <input id="txtLoName" type="text" style="width: 720px" />
                        </td>
                    </tr>
                    <tr style="display:none">
                        <td class="fname" style="width:110px;">
                            <span style='color: #e62701; font-size: 15px;'>*</span>&nbsp;顺序:
                        </td>
                        <td>
                            <input id="txtSequence" type="text" class="inp" />
                        </td>
                    </tr>
                    <tr style="display:none">
                        <td class="fname" style="width:110px;">
                            <span style='color: #e62701; font-size: 15px;'>*</span>&nbsp;顺序名:
                        </td>
                        <td>
                            <input id="txtSequenceName" type="text" class="inp" />
                        </td>
                    </tr>
                    <tr style="display:none">
                        <td class="fname" style="width:110px;">
                            URL:
                        </td>
                        <td>
                            <input type="text" id="txtURL" class="inp" />
                        </td>
                    </tr>
                    <tr style="display:none">
                        <td class="fname" style="width:110px;">
                            页码:
                        </td>
                        <td>
                            <input type="text" id="txtLocation" class="inp" />
                        </td>
                    </tr>
                    <tr style="display:none">
                        <td class="fname" style="width:110px;">
                            标签:
                        </td>
                        <td>
                            <input type="text" id="txtTags" class="inp" />
                        </td>
                    </tr>
                    <tr>
                        <td class="fname" style="width:110px;">
                            <span style='color: #e62701; font-size: 15px;'>*</span>&nbsp;选择知识维度:
                        </td>
                        <td>
                            <select id="ddlCognitive" class="inp">
                                <option value='-1'>选择知识维度</option>
                                <%--<option value='0'>NULL</option>--%>
                                <option value='1'>事实性知识</option>
                                <option value='2'>原理概念规则性知识</option>
                                <option value='3'>程序性知识</option>
                                <option value='4'>元认知知识</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td class="fname" style="width:110px;">
                            描述:
                        </td>
                        <td>
                           
                        </td>
                    </tr>
                </table>
            </div>

            <div id="dvDescription" class="dvDescription" style="padding:0px 5px 5px 5px; ">
                <div style="text-align: center; padding-top: 5px">
                    <div style="display: none">
                        <input id="rdShortDescription" type="radio" value="short" checked="checked" name="rdDescriptionGroup" />
                        <label for="rdShortDescription" style="color: #005f9c; cursor: pointer;">
                            摘录</label>&nbsp;
                        <input id="rdLongDescription" type="radio" value="long" name="rdDescriptionGroup" />
                        <label for="rdLongDescription" style="color: #005f9c; cursor: pointer;">
                            详细</label>&nbsp;
                        <input id="rdExtendDescription" type="radio" value="extend" name="rdDescriptionGroup" />
                        <label for="rdExtendDescription" style="color: #005f9c; cursor: pointer;">
                            扩展讨论</label>
                    </div>
                </div>
                <div id="divShortDescription" style="padding:0px 5px 5px 5px;">
                    <div class="loDetails" title="click here for edit" id="divAreaShortDetails" onclick="onLoDescriptionDivClick(this)">
                        &nbsp;</div>
                </div>
                <%--<div id="divLongDescription" style="padding: 5px; display: none">
                    <div class="loDetails" title="click here for edit" id="divAreaLongDetails" onclick="onLoDescriptionDivClick(this)">&nbsp;</div>
                </div>
                <div id="divExtendDescription" style="padding: 5px; display: none">
                    <div class="loDetails" title="click here for edit" id="divAreaExtendDetails" onclick="onLoDescriptionDivClick(this)">&nbsp;</div>
                </div>--%>
            </div>
        </div>
        <div style="padding: 10px; border-top: 1px dotted #B2D0EC;">
            <table width="100%">
                <tr>
                    <td style="text-align: left; color: #005F9C; font-size: 13px;">
                        <%-- <div id="divLoDescriptionPreview" style="display: none;">
                            <span id="spAbstractPreview" style="cursor: pointer;"><img src="../Images/application_view_list.png" />Abstract Preview</span>&nbsp; 
                            <span id="spDetailsPreview" style="cursor: pointer;"><img src="../Images/application_view_list.png" />Details Preview</span>&nbsp; 
                            <span id="spExtendPreview" style="cursor: pointer;"><img src="../Images/application_view_list.png" />Extended Discussion Preview</span>
                        </div>--%>
                    </td>
                    <td style="text-align: right;">
                        <input id="btnkpEditConfirm" type="button" value="确定" class="but_blue_60 mg_r10" />
                        <input id="btnkpEditClose" type="button" value="取消" class="but_blue_60 mg_r10" onclick="onBtnCancelClick()" />
                    </td>
                </tr>
            </table>
        </div>
    </div>
</asp:Content>
