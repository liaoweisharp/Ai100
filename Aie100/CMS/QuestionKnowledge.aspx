<%@ Page Title="" Language="C#" MasterPageFile="~/CMS/Master/cms.master" AutoEventWireup="true" CodeFile="QuestionKnowledge.aspx.cs" Inherits="CMS_QuestionKnowledge" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link href="../Styles/Base.css?version=1127" rel="stylesheet" type="text/css" />
    <link href="../Plugins/pagination/pagination.css?version=1127" rel="stylesheet" type="text/css" />
    <script src="../Plugins/pagination/jquery.pagination.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/colResizable-1.3.source.js?version=1127" type="text/javascript"></script>

    <script src="../Plugins/dynatree/jquery/jquery-ui.custom.min.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/dynatree/jquery/jquery.cookie.js?version=1127" type="text/javascript"></script>
    <link href="../Plugins/dynatree/src/skin/ui.dynatree.css?version=1127" rel="stylesheet" type="text/css" />
    <script src="../Plugins/dynatree/src/jquery.dynatree.min.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/dynatree/contextmenu/jquery.contextMenu-custom.js?version=1127" type="text/javascript"></script>
    <link href="../Plugins/dynatree/contextmenu/jquery.contextMenu.css?version=1127" rel="stylesheet" type="text/css" />

    <link href="Styles/QuestionKnowledge.css?version=1127" rel="stylesheet" />
    <link href="Styles/KnowledgePointRelation.css?version=1127" rel="stylesheet" />
    <script type="text/javascript" src="../Scripts/Math.js?version=1127"></script>
    <script src="Scripts/QuestionSearch.js?version=1127" type="text/javascript"></script>
    <script src="Scripts/KnowledgePointsData.js?version=1127" type="text/javascript"></script>
    <script type="text/javascript" src="../Scripts/Question.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/ShowDetails.js?version=1127"></script>
    <script type="text/javascript" src="Scripts/QuestionKnowledge.js?version=1127"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder" Runat="Server">
    <div>题与知识点关系>></div>
    <div id="bookStructureBar" class="cms_toolbar">
        <ul>
            <li><select id="Des" style="width: 180px" class="sel_loading"></select></li>
            <li><select id="Sub" style="width: 180px"><option value='-1'>请选择学科</option></select></li>
            <li><select id="selBookList" style="width: 250px" class="sel_loading"></select></li>
            <li class="delimiter">&nbsp;</li>
            <li><img alt="" id="btnAssociateQuestions" title="题与知识点的关系" src="Images/application_side_boxes.png" class="btnsel00" onmouseover="this.className='btnsel00_border'" onmouseout="this.className='btnsel00'" /></li>
            <li><img alt="" id="btnAssociateTests" title="考试题与知识点的关系" src="Images/application_view_gallery.png" class="btnsel00" onmouseover="this.className='btnsel00_border'" onmouseout="this.className='btnsel00'" /></li>
            <li><img alt="" id="btnSearchQuestion" title="搜索题" src="Images/app_search.png" class="btnsel00" onmouseover="this.className='btnsel00_border'" onmouseout="this.className='btnsel00'" /></li>
            <li><img alt="" id="btnAutoLoQuestion" title="智能关联知识点" src="Images/table_save.png" class="btnsel00" onmouseover="this.className='btnsel00_border'" onmouseout="this.className='btnsel00'" /></li>
            <li><img alt="" id="btnSaveLoQuestion" title="保存题与知识点的关系" src="Images/application_save.gif" class="btnsel00" onmouseover="this.className='btnsel00_border'" onmouseout="this.className='btnsel00'" /></li>
        </ul>
    </div>
    <table id="tbContentbox" style="display:none; width: 100%; border: 1px solid #bed7f5; border-collapse:collapse; margin-top:-1px;">
        <tr>
            <td style="border: 1px solid #bed7f5; width:30%;" valign="top">
                <div id="dvQuestionList">
                    <div id="dvQuestionListTitle" style="font-weight:bold; text-align:center; border-bottom:1px solid #a5a3a3; padding-bottom:10px;margin:10px; display:none">&nbsp;</div>
                    <div id="dvQuestionTool" style="margin:10px; display:none"><input type="button" id="btnGetUnrelated" value="刷新" /></div>
                    <div id="dvPagination" class="pagination" style="margin:0px 10px 10px; float:left"></div>
                    <div class="dvGotoPage" style="float:left; margin-top:-3px; display:none;">第&nbsp;<input type="text" style="width:30px;" class="gotoIndex" />&nbsp;页&nbsp;<input type="button" value="确定" onclick="gotoPage(this)" /><input type="text" style="display:none" /></div>
                    <div style="clear:both"></div>
                    <div id="dvQuestionContent" style="overflow:auto; padding:0px 10px;">
                        <div id="dvMasterQuestion" style="padding:8px 0px; display:none"></div>
                        <div id="dvQuestionBody" style="padding:8px 0px;"></div>
                        <div id="dvAnswerTitle" style="background:#267D00; padding:3px; color:#fff; width:38px; display:none">答案：</div>
                        <div id="dvReferenceAnswer" style="padding:8px 0px"></div>
                        <div id="dvSolutionTitle" style="background:#267D00; padding:3px; color:#fff; width:65px; display:none">解题过程：</div>
                        <div id="dvSolution" style="padding:8px 0px;"></div>
                        <div id="dvTip" style="padding:8px 0px"></div>
                    </div>
                </div>
            </td>
            <td style="border: 1px solid #bed7f5; width:28%;" valign="top">
                <div id="bookStructureTree"></div>
            </td>
            <td style="border: 1px solid #bed7f5; width:42%;" valign="top">
                <div style="padding:3px; display:none">
                    <input type="button" id="btnRecommendLo" value="推荐知识点"/>
                    <input type="checkbox" id="cbxAllQuestionSame" style="margin-left:12px" />&nbsp;<label for="cbxAllQuestionSame">全部题智能关联或者使用同一关联</label>
                    <input type="checkbox" id="cbxCustomProbability" style="margin-left:12px" />&nbsp;<label for="cbxCustomProbability">自定义权重</label>
                </div>
                <div id="dvRelationSetting" style="overflow:auto; display:none">
                    <table class="kpr_sel_item" border="0">
                        <tr>   
	                        <th style="width: 60px; text-align: left;">单元</th>
	                        <th style="text-align: left;">知识点</th>
                            <th class="custom_col" style="width: 30px; text-align: center;">权重</th>
                            <th class="custom_col" style="width: 40px; text-align: center;">目标</th>
                            <th class="custom_col" style="width: 80px; text-align: left;">认知过程</th>
                            <th style="width: 30px; text-align: center;">操作</th>
                        </tr>
                    </table>
                </div>
            </td>
        </tr>
    </table>
</asp:Content>

