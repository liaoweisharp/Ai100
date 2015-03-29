<%@ Control Language="C#" AutoEventWireup="true" CodeFile="QuestionManage.ascx.cs"
    Inherits="UserControl_QuestionManage" %>
<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>
<%--<%@ Register Src="EmathEditor.ascx" TagName="EmathEditor" TagPrefix="uc1" %>--%>
<style type="text/css">
    img
    {
        border-style: none;
    }
</style>
<asp:ScriptManagerProxy ID="smp1" runat="server">
    <Scripts>
        <asp:ScriptReference Path="~/CMS/Scripts/QuestionManage.js?version=1127" />
        <asp:ScriptReference Path="~/Js/dtree.js?version=1127" />
        <asp:ScriptReference Path="~/editor/scripts/editor.js?version=1127" />
        <%-- <asp:ScriptReference Path="~/Scripts/JQuery/jquery-1.6.1.min.js?version=1127" />
        <asp:ScriptReference Path="~/Scripts/JQuery/jquery.ajax.js?version=1127" />
        <asp:ScriptReference Path="~/Scripts/JQuery/plugins/jquery.pagination.js?version=1127" />--%>
    </Scripts>
    <Services>
        <asp:ServiceReference Path="~/WebService/CmsWS.asmx" />
        <asp:ServiceReference Path="~/WebService/TestWS.asmx" />
    </Services>
</asp:ScriptManagerProxy>
<div>
    <asp:Panel ID="imgDataLoading" runat="server" Style="display: none">
        <img alt="加载中..." src="../Images/ajax-loader_b.gif" />
    </asp:Panel>
    <div id="qImgLoading" style="position: fixed; width: 100%; height: 100%; top: 15%;
        padding: 50px;">
        <center>
            <img alt="加载中..." src="../Images/ajax-loader_b.gif" />
        </center>
    </div>
    <ajaxToolkit:AlwaysVisibleControlExtender ID="avce" runat="server" TargetControlID="imgDataLoading"
        VerticalSide="Middle" VerticalOffset="10" HorizontalSide="Center" HorizontalOffset="10"
        ScrollEffectDuration=".1" />
    <div style="font-size:15px;">题管理>></div>
    <div id="divQuestionManage">
        <div id="divQuestionManage1">
            <%--          <div id="divCurriculumList" class="divCurriculumList">
                Curiculum:
                <select id="ddlCurriculumList" onchange="onDdlCurriculumListChange(this)">
                    <option value="-1">Select a curriculum</option>
                </select>
            </div>--%>
            <div id="divBookList" class="divBookList cms_toolbar" style="height:18px;text-align:left">
                <div>
                    <select id="Des">
                        <option value="-1">请选择学科类别</option>
                    </select>
                    <select id="Sub">
                        <option value="-1">请选择学科</option>
                    </select>
                    <select id="ddlBookList" onchange="onDdlBookListChange(this)">
                        <option value="-1">请选择书</option>
                    </select>
                </div>
                <%--<div id="divAlgorithmParamsOfValue" style="display: none; margin-top: 5px;">
                    # of saved:&nbsp;<input id="txtAlgorithmParamsOfValue" type="text" style="width: 30px;"
                        value="10" title="enter saved times here." />
                    <input id="btnSaveAlgorithmParamsValue" type="button" value="Save algorithm params' value"
                        onclick="onBtnSaveAlgorithmParamsValueClick()" />
                </div>--%>
            </div>
            <div id="div_tree_questions" style="display: none">
                <table id="tb_tree_questions" width="100%" cellpadding="0" cellspacing="0" class="Tb" style="margin-top:-1px">
                    <tr>
                        <td id="td1_tree1" class="TbTd1" style="width: 270px; overflow: auto">
                            <%-- <asp:TreeView ID="tvBookStructure_NoHref" runat="server">
                            </asp:TreeView>--%>
                            <div id="div_tree">
                                <div id="divTreeLoading" style="text-align: center">
                                    <img alt="加载中" src="../Images/ajax-loader_b.gif" />
                                </div>
                            </div>
                        </td>
                        <td class="TbTd2">
                            <div id="div_action" style="text-align: right; background-color: rgb(240,240,240);">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td style="text-align: left; padding: 3px 0px 3px 3px">
                                            <select id="ddlInterval" title="指定一个范围进行查询" onchange="onDdlIntervalChange(this)">
                                                <option value="-1" selected="selected">自由输入</option>
                                                <option value="0">num1,num2,num3...</option>
                                                <option value="1">(num1,num2)</option>
                                                <option value="2">(num1,num2]</option>
                                                <option value="3">[num1,num2]</option>
                                                <option value="4">[num1,num2)</option>
                                            </select>
                                            <input type="text" id="txtQuestionNumberQuery" value="" title="在这里输入题号" style="text-align: center;
                                                width: 140px;" onchange="onTxtQuestionNumberQueryClick(this,event)" onclick="onTxtQuestionNumberQueryClick(this)" />
                                            <input type="button" id="btnQuestionNumberQuery" value="查询" title="根据题号查询题" onclick="onBtnQuestionNumberQueryClick(this)"
                                                disabled="disabled" />
                                           
                                            <select id="ddlViewQuestionsByDiffCondition" onchange="onDdlViewQuestionsChange(this)"
                                                style="width: 255px;display:none">
                                                <option value="-1" title="显示指定章节下的题">显示指定章节下的题</option>
                                                <option value="0" selected="selected" title="显示指定知识点下的题">显示指定知识点下的题</option>
                                                <option value="1" title="显示章节下没有知识点的题">显示章节下没有知识点的题</option>
                                                <option value="2" title="显示没有生成种子的活动题">显示没有生成种子的活动题</option>

                                            </select>
                                            <%--<input id="cbk_Select" type="checkbox" onclick="click_cbk_Select()" /><label for="cbk_Select">Show questions by knowledge structure.</label>--%>
                                            &nbsp;
                                            <select id="ddlViewEditHistory" onchange="ddlViewEditHistory_change(this)">
                                                <option value="-1">编辑历史</option>
                                                <option value="0">最近编辑的</option>
                                                <option value="1">已审核的</option>
                                                <option value="2">未审核的</option>
                                                <option value="3">建议的</option>
                                            </select>
                                        </td>
                                        <td>
                                            <select id="ddlActions" style="margin: 3px;display:none" onchange="onDdlActionsChange(this)">
                                                <option value="-1" selected="selected">选择操作</option>
                                                <option value="create">创建一个题</option>
                                                <option value="addchild">添加一个子题</option>
                                                <option value="edit">编辑</option>
                                                <option value="copys">拷贝</option>
                                                <%--<option value="copy">Copy Source</option>--%>
                                                <option value="review">回顾</option>
                                                <option value="delete">删除</option>
                                                <option value="audit">审核与建议</option>
                                                <option value="editHistory">编辑历史</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="text-align:left; padding-left:3px; padding-bottom:4px">
                                            <input type="button" id="btnCreateQuestion" value="创建一个题" onclick="$('#ddlActions').val('create').trigger('change')" />
                                            <input type="button" id="btnQuestionSearch" value="通过题搜索" />
                                            <input type="button" id="btnKnowledgeSearch" value="通过知识点搜索" />
                                            <input type="button" id="btnTestSearch" value="通过试卷搜索" />
                                            <input type="button" id="btnViewMyQuestions" value="我的题" />
                                            <%--<input type="button" id="btnNoSeedPublish" value="保存未生成种子的题" />--%>
                                        </td>
                                        <td>&nbsp;</td>
                                    </tr>
                                </table>
                            </div>
                            <div id="dvAdvancedSearch" style="border-bottom: 1px solid #bad3ed; margin-bottom: 8px;
                                display: none">
                            </div>
                            <div style="background-color: White;">
                                <div class="pagination_ddl" style="width: 15%; float: left; text-align: left; padding-left: 10px; padding-top:3px; display: none;">
                                    页大小
                                    <select id="ddlPageSize" class='ddlPageSize' onchange="ddlPageSizeChange();">
                                    </select></div>
                                <div class="pagination" style="float: left; text-align: left; padding-left: 20px; padding-top:3px;"></div>
                                <div class="dvGotoPage" style="float:left; padding-top:0px; display:none;">到第&nbsp;<input type="text" style="width:30px;" class="gotoIndex" />&nbsp;页&nbsp;<input type="button" value="确定" onclick="gotoPage(this)" /></div>
                            </div>
                            <div id="div_questions" style="padding: 0px 5px 0px 5px; clear: both;">
                                &nbsp;
                            </div>
                            <div class="pagination" style="float: left; text-align: left; padding-left: 196px;padding-top:3px;"></div>
                            <div class="dvGotoPage" style="float:left; padding-top:0px; display:none;">到第&nbsp;<input type="text" style="width:30px;" class="gotoIndex" />&nbsp;页&nbsp;<input type="button" value="确定" onclick="gotoPage(this)" /></div>
                        </td>
                    </tr>
                </table>
            </div>
            <asp:Panel ID="plSampleQuestion" runat="server" Style="width: 700px; position: absolute;
                display: none; z-index: 100;">
                <asp:Panel ID="plHeader" runat="server" Style="height: 57px; overflow: hidden; cursor: move;">
                    <div style="float: left;">
                        <div style="">
                            <img src="../Images/help/up_left.gif" /></div>
                        <div style="height: 30px; width: 19px; border-left: solid 5px #BED7F5; background-color: #DFEFFF;">
                        </div>
                    </div>
                    <div style="float: left; height: 100%; width: 644px;">
                        <div style="padding: 0px; margin: 0px; height: 5px; overflow: hidden; background-color: #BED7F5;">
                        </div>
                        <div style="padding: 10px 5px; margin: 0px; height: 52px; overflow: hidden; background-color: #DFEFFF;">
                            <span id="sampleQuestionHeader" style="display: block; padding-top: 9px; padding-left: 5px;
                                float: left; color: #3D6599; font-weight: bold;"></span><span style="display: block;
                                    float: right;">
                                    <%--  <asp:ImageButton ID="imgClose" runat="server" ImageUrl="~/Images/close.gif" style="cursor:pointer;"
                    onclick="imgClose_Click"/>--%>
                                    <img alt="关闭" src="../Images/close.gif" onmousedown="closeSampleQuestion();" style="cursor: pointer;" />
                                </span>
                        </div>
                    </div>
                    <div style="float: right; clear: right;">
                        <div>
                            <img src="../Images/help/up_right.gif" /></div>
                        <div style="height: 30px;">
                            <div style="float: left; width: 18px; height: 30px; background-color: #DFEFFF;">
                            </div>
                            <div style="float: left; width: 12px; height: 30px; background: url(../Images/help/right.gif) repeat-y;">
                            </div>
                        </div>
                    </div>
                </asp:Panel>
                <asp:Panel ID="plContent" runat="server">
                    <div style="clear: both;">
                        <table cellspacing="0" cellpadding="0">
                            <tr>
                                <td style="width: 681px; border-left: solid 5px #BED7F5; background-color: White;">
                                    <div style="height: auto; padding: 0px; padding-top: 10px;">
                                        <iframe id="ifrSampelQuestion" width="100%" frameborder="0" style="height: 500px;
                                            overflow: scroll; border: none; border-style: none;"></iframe>
                                    </div>
                                </td>
                                <td style="width: 12px; background: url(../Images/help/right.gif) repeat-y; height: auto;">
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div style="height: 33px; overflow: hidden; clear: both;">
                        <div style="float: left;">
                            <img src="../Images/help/down_left.gif" /></div>
                        <div style="float: left; height: 100%; width: 644px;">
                            <div style="padding: 0px; margin: 0px; height: 20px; overflow: hidden; background-color: White;">
                            </div>
                            <div style="padding: 0px; margin: 0px; height: 13px; overflow: hidden; width: 100%;
                                background-image: url(../Images/help/down_middle.gif); background-repeat: repeat-x">
                            </div>
                        </div>
                        <div style="float: right; clear: right;">
                            <img src="../Images/help/down_right.gif" /></div>
                    </div>
                </asp:Panel>
            </asp:Panel>
            <ajaxToolkit:DragPanelExtender ID="DragPanelExtender1" runat="server" TargetControlID="plSampleQuestion"
                DragHandleID="plHeader">
            </ajaxToolkit:DragPanelExtender>
        </div>
        <div id="divQuestionManage2" style="display: none">
            <ajaxToolkit:TabContainer runat="server" ID="Tabs1" ActiveTabIndex="3" OnClientActiveTabChanged="onActiveTabChanged1">
                <ajaxToolkit:TabPanel runat="Server" ID="tabPanel1" HeaderText="<div class='tabHeader'>第一步. 题描述</div>">
                    <ContentTemplate>
                        <div id="divStep1">
                            <div id="divBookForCopyQuestion" style="overflow: hidden; clear: both; margin-bottom: 15px;
                                display: none">
                                <div class="td1" style="float: left">
                                    书:
                                </div>
                                <div class="td2" style="float: left">
                                    <select id="ddlBookListForCopyQuestion" onchange="onDdlBookListForCopyQuestionChange(this)">
                                        <option value="-1">请选择书</option>
                                    </select>
                                </div>
                            </div>
                            <table border="0" cellpadding="0" cellspacing="0" style="width: auto; clear: both;
                                line-height: 20px; line-height: 30px;">
                                <tr style="display:none">
                                    <td class="td1">
                                        章节:
                                    </td>
                                    <td class="td2">
                                        <div id="div_bookStructureChange">
                                            <div id="divBookStructureOfQuestion" style="line-height: 15px">
                                                <center>
                                                    <img alt="加载中" src="../Images/ajax-loader_b.gif" />
                                                </center>
                                            </div>
                                            <div id="divBookStructureChangeTool">
                                                <input type="button" value="应用" class="btn" onclick="onBookStructureChangeApply()" />
                                                <input type="button" value="取消" class="btn" onclick="onBookStructureChangeCancel()" />
                                            </div>
                                        </div>
                                        <div>
                                            <span id="spanBookStructurePos">[...]</span> <span>
                                                <input id="btnChangeStructure" type="button" value="更改" onclick="onBookStructureChange()"
                                                    class="btn" />
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                                 <tr>
                                    <td class="td1">
                                        题类型:
                                    </td>
                                    <td class="td2">
                                        <table cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td>
                                                    <select id="ddlQuestionType">
                                                        <option value="-1">选择题类型</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <img enableddl="1" alt="" style="cursor: pointer; display: none;" onclick="removeDisbledForDDL(this,'ddlQuestionType')"
                                                        title="启用" src="../CMS/Images/lock.png" />
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="td1">
                                        答案类型:
                                    </td>
                                    <td class="td2">
                                        <table cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td>
                                                    <select id="ddlAnswerType" onchange="onAnswerTypeChange(this)">
                                                        <option value="-1">选择答案类型</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <img enableddl="1" alt="" style="cursor: pointer; display: none;" onclick="removeDisbledForDDL(this,'ddlAnswerType')"
                                                        title="启用" src="../CMS/Images/lock.png" />
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                               
                                <tr style="display:none">
                                    <td class="td1">
                                        逻辑类型:
                                    </td>
                                    <td class="td2">
                                        <table cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td>
                                                    <select id="ddlLogicType">
                                                        <option value="-1">请选择逻辑类型</option>
                                                        <option value="1" selected="selected">概念</option>
                                                        <option value="2">技巧</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <img enableddl="1" alt="" style="cursor: pointer; display: none;" onclick="removeDisbledForDDL(this,'ddlLogicType')"
                                                        title="启用" src="../CMS/Images/lock.png" />
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="td1">
                                        难度:
                                    </td>
                                    <td class="td2">
                                        <select id="ddlDifficult">
                                            <option value="-1">请选择难度系数</option>
                                            <option value="1" selected="selected">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </select>
                                    </td>
                                </tr>
                                <%--                                <tr>
                                    <td class="td1">
                                        Classify question types:
                                    </td>
                                    <td class="td2">
                                        <select id="ddlThinkFlag">
                                            <option value="0" selected="selected">Select classify question type</option>
                                            <option value="1">Critical thinking</option>
                                            <option value="2">Computational</option>
                                            <option value="3">Application</option>
                                            <option value="4">Writing</option>
                                            <option value="5">Conceptual</option>
                                        </select>
                                    </td>
                                </tr>--%>
                                <tr>
                                    <td colspan="2" class="trlineHeignt">
                                    </td>
                                </tr>
                                
                                <tr style="display:none">
                                    <td class="td1">
                                        区分度:
                                    </td>
                                    <td class="td2">
                                        <input id="txtDiscriminator" style="width: 70px" type="text" />（在正数范围内，值越大越代表能区分出知识掌握的程度，如果为负，表示掌握的好的不容易做对。）
                                    </td>
                                </tr>
                                <tr style="display:none">
                                    <td class="td1">
                                        答案猜中率:
                                    </td>
                                    <td class="td2">
                                        <input id="txtGuessFactor" style="width: 70px" type="text" />
                                    </td>
                                </tr>
                                <tr id="trQuestionOrder" style="display: none;">
                                    <td class="td1">
                                        序号:
                                    </td>
                                    <td class="td2">
                                        <input id="txtQuestionOrder" style="width: 70px" type="text" value="0" />
                                    </td>
                                </tr>
                                <tr style="display:none">
                                    <td colspan="2" class="trlineHeignt">
                                    </td>
                                </tr>
                                <tr>
                                    <td class="td1">
                                        挂靠位置:
                                    </td>
                                    <td class="td2">
                                        <select id="ddlStructureType" style="width: 140px">
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" class="trlineHeignt">
                                    </td>
                                </tr>
                                <tr id="tr_GradeMode" style="display: none;">
                                    <td colspan="2" style="padding: 0px;">
                                        <table border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td class="td1">
                                                    阅卷模式?:
                                                </td>
                                                <td class="td2">
                                                    <input id="rdAutoGrade" type="radio" name="rdGradeMode" />&nbsp;<label for="rdAutoGrade">电脑自动</label>
                                                    <input id="rdManualGrade" type="radio" name="rdGradeMode" checked="checked" />&nbsp;<label
                                                        for="rdManualGrade">手动</label>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="td1">
                                        是否为母题:
                                    </td>
                                    <td class="td2">
                                        <input id="rdIsParentQuestionYes" type="radio" name="rdIsParentQuestion" />&nbsp;<label for="rdIsParentQuestionYes">是</label>
                                        <input id="rdIsParentQuestionNo" type="radio" name="rdIsParentQuestion" checked="checked" />&nbsp;<label for="rdIsParentQuestionNo">否</label>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="td1">
                                        是否学生可见:
                                    </td>
                                    <td class="td2">
                                        <input id="rdIsStudentVisibleYes" type="radio" name="rdIsStudentVisible"  checked="checked"/>&nbsp;<label
                                            for="rdIsStudentVisibleYes">是</label>
                                        <input id="rdIsStudentVisibleNo" type="radio" name="rdIsStudentVisible" />&nbsp;<label
                                            for="rdIsStudentVisibleNo">否</label>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="trlineHeignt" colspan="2">
                                    </td>
                                </tr>
                                <tr style="display:none">
                                    <td class="td1">
                                        是否有答案:
                                    </td>
                                    <td class="td2">
                                        <input id="rdIsAnswerYes" type="radio" name="rdIsAnswer" checked="checked" />&nbsp;<label
                                            for="rdIsAnswerYes">是</label>
                                        <input id="rdIsAnswerNo" type="radio" name="rdIsAnswer" />&nbsp;<label for="rdIsAnswerNo">否</label>
                                    </td>
                                </tr>
                                <tr style="display:none">
                                    <td colspan="2" class="trlineHeignt">
                                    </td>
                                </tr>
                                <tr>
                                    <td class="td1">
                                        是否是例题:
                                    </td>
                                    <td class="td2">
                                        <input id="rdIsSampleQuestionYes" type="radio" name="rdIsSampleQuestion">&nbsp;<label
                                            for="rdIsSampleQuestionYes">是</label>
                                        <input id="rdIsSampleQuestionNo" checked type="radio" name="rdIsSampleQuestion">&nbsp;<label
                                            for="rdIsSampleQuestionNo">否</label>
                                    </td>
                                </tr>
                                <tr style="display:none">
                                    <td class="trlineHeignt" colspan="2">
                                    </td>
                                </tr>
                                <tr style="display:none">
                                    <td class="td1">
                                        是否是思考题:
                                    </td>
                                    <td class="td2">
                                        <input id="rdIsThinkQuestionYes" type="radio" name="rdIsThinkQuestion">&nbsp;<label
                                            for="rdIsThinkQuestionYes">是</label>
                                        <input id="rdIsThinkQuestionNo" checked="checked" type="radio" name="rdIsThinkQuestion">&nbsp;<label
                                            for="rdIsThinkQuestionNo">否</label>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="trlineHeignt" colspan="2">
                                    </td>
                                </tr>
                                <tr id="trIsAlgorithm">
                                    <td class="td1">
                                        是否活动题:
                                    </td>
                                    <td class="td2">
                                        <input id="rdAlgorithmYes" type="radio" name="rdIsAlgorithmVisible" onclick="onRdIsAlgorithmClick()" />&nbsp;是
                                        <input id="rdAlgorithmNo" type="radio" name="rdIsAlgorithmVisible" checked="checked"
                                            onclick="onRdIsAlgorithmClick()" />&nbsp;否
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </ContentTemplate>
                </ajaxToolkit:TabPanel>
                <ajaxToolkit:TabPanel runat="Server" ID="tabPanel2" HeaderText="<div class='tabHeader'>第二步. 编辑题</div>">
                    <ContentTemplate>
                        <%--                        <div id="Question_divEmathEditor">
                            <uc1:EmathEditor ID="EmathEditor1" runat="server" />
                        </div>--%>
                        <div id="divStep2">
                            <ajaxToolkit:TabContainer runat="server" ID="Tab2" ActiveTabIndex="0" OnClientActiveTabChanged="onActiveTabChanged2">
                                <%--<ajaxToolkit:TabPanel runat="Server" ID="_tabPanel1" HeaderText="标题">
                                    <ContentTemplate>
                                        <div class="eqcontent" id="divQuestionTitle" onclick="onQustionDivClick(this)">
                                            &nbsp;
                                        </div>
                                    </ContentTemplate>
                                </ajaxToolkit:TabPanel>
                                <ajaxToolkit:TabPanel runat="Server" ID="_tabPanel2" HeaderText="描述">
                                    <ContentTemplate>
                                        <div class="eqcontent" id="divQuestionDescription" onclick="onQustionDivClick(this)">
                                            &nbsp;
                                        </div>
                                    </ContentTemplate>
                                </ajaxToolkit:TabPanel>
                                <ajaxToolkit:TabPanel runat="Server" ID="_tabPanel3" HeaderText="说明">
                                    <ContentTemplate>
                                        <div class="eqcontent" id="divQuestionInstruction" onclick="onQustionDivClick(this)">
                                            &nbsp;
                                        </div>
                                    </ContentTemplate>
                                </ajaxToolkit:TabPanel>--%>
                                <ajaxToolkit:TabPanel runat="Server" ID="_tabPanel4" HeaderText="题内容">
                                    <ContentTemplate>
                                        <div class="eqcontent" id="divQuestionBody" onclick="onQustionDivClick(this)">
                                            &nbsp;
                                        </div>
                                    </ContentTemplate>
                                </ajaxToolkit:TabPanel>
                                <ajaxToolkit:TabPanel runat="Server" ID="_tabPanel5" HeaderText="答案">
                                    <ContentTemplate>
                                        <div class="eqcontent" id="divQuestionAnswer" style="padding: 0px" onclick="onQuestionAnswerClick(this)">
                                            &nbsp;
                                        </div>
                                    </ContentTemplate>
                                </ajaxToolkit:TabPanel>
                                <ajaxToolkit:TabPanel runat="Server" ID="TabPanel6" HeaderText="解题过程">
                                    <ContentTemplate>
                                        <div class="eqcontent" id="divQuestionSolution" onclick="onQustionDivClick(this)">
                                            &nbsp;
                                        </div>
                                    </ContentTemplate>
                                </ajaxToolkit:TabPanel>
                                <ajaxToolkit:TabPanel runat="Server" ID="TabPanel7" HeaderText="提示">
                                    <ContentTemplate>
                                        <div class="eqcontent" id="divQuestionHint" onclick="onQustionDivClick(this)">
                                            &nbsp;
                                        </div>
                                    </ContentTemplate>
                                </ajaxToolkit:TabPanel>
                            </ajaxToolkit:TabContainer>
                        </div>
                        <div id="divAlgorithmInfo">
                            <div id="pnAlgorithmSeedInfo" style="margin-bottom: 10px;">
                                <div id="pnAlgorithmSeedInfoHeader">
                                    <div id="divAlgorithmSeedInfoHeader" class="divAlgorithmInfoHeader">
                                        活动题参数种子信息:
                                    </div>
                                </div>
                                <div id="pnAlgorithmSeedInfoContent">
                                    <div>
                                        <table id="tableAlgorithmSeedInfo" class="gridviewblue" cellspacing="0" cellpadding="0">
                                            <tbody>
                                                <tr class="titlerow">
                                                    <th style="vertical-align: middle; padding-left: 5px;" class="tdAlgorithmName">
                                                        名字
                                                    </th>
                                                    <th style="vertical-align: middle" class="tdAlgorithmContent">
                                                        内容
                                                    </th>
                                                    <th style="vertical-align: middle" class="tdAlgorithmPreView">
                                                        预览
                                                    </th>
                                                    <th style="vertical-align: middle;" class="tdAlgorithmTool">
                                                        <div style="display: none">
                                                            <img style="cursor: pointer" title="检查所有参数" onclick="checkAlgorithmPrameter(this,null)"
                                                                alt="检查所有参数" src="../CMS/Images/application_get.png">
                                                            <img style="visibility: hidden; cursor: pointer" id="imgRecoveryParametersSeedInfo"
                                                                title="恢复所有参数" onclick="recoveryAlgorithmPrameterInfo()" alt="恢复所有参数" src="../Images/arrow_undo.png">
                                                            <img style="cursor: pointer" title="从另一道题拷贝全部参数信息" onclick="copyAlgorithmPrameterInfo()"
                                                                alt="拷贝参数" src="../Images/application_double.png">
                                                        </div>
                                                    </th>
                                                </tr>
                                                <tr id="trAlgorithmRow_gzoqpam7h85sgss9t8c0" class="tdAlgorithmName">
                                                    <td class="tdAlgorithmName" style="padding-left: 5px;">
                                                        <span id="spAlgorimSeedName">V2</span>
                                                    </td>
                                                    <td class="tdAlgorithmContent">
                                                        <div style="border-bottom: medium none; border-left: medium none; padding-bottom: 0px;
                                                            margin: 0px; padding-left: 0px; width: 672px; padding-right: 0px; word-wrap: break-word;
                                                            word-break: break-all; border-top: medium none; cursor: text; border-right: medium none;
                                                            padding-top: 0px" id="divAlgorithmSeedContentInfo" onclick="onAlgorithmContentDivClick(this,event)">
                                                            &nbsp;</div>
                                                    </td>
                                                    <td class="tdAlgorithmPreView">
                                                        <span id="spAlgorithmSeedPreview" style="color: gray">未检查</span>
                                                    </td>
                                                    <td class="tdAlgorithmTool">
                                                        <div style="margin: 0px; height: 3px; visibility: hidden">
                                                            <img style="cursor: pointer" title="添加行" onclick="createAlgorithmRow(this)" alt="Add"
                                                                src="../CMS/Images/application_add.png">&nbsp;<img style="cursor: pointer" title="删除行"
                                                                    onclick="deleteAlgorithmRow(this)" alt="删除行" src="../CMS/Images/application_delete.png">&nbsp;<img
                                                                        style="cursor: pointer" title="check parameter" onclick="checkAlgorithmPrameter(this)"
                                                                        alt="检查" src="../CMS/Images/application_get.png"></div>
                                                        &nbsp;
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <%-- <div style="display: none">
                                        <input style="margin: 0px; width: 672px; overflow: hidden" onkeydown=" {if(event.keyCode == 13)return false;if(event.keyCode == 27)return false}"
                                            id="Text1" class="txtbox" onkeyup="onTxtAlgorithmContentKeyUp(this,event); "
                                            type="text">
                                    </div>
                                    <div style="z-index: 100; position: absolute; margin: 2px 0px 0px 2px; display: none"
                                        id="DIV2">
                                        <select style="border-bottom: gray 1px solid; border-left: gray 1px solid; margin: -2px;
                                            float: left; height: 100px; overflow: scroll; border-top: gray 1px solid; border-right: gray 1px solid"
                                            id="select2" multiple onchange="divSelect_Click(event)">
                                        </select>
                                        <label style="background-color: #ffffdf; float: left" id="LABEL1">
                                        </label>
                                    </div>--%>
                                </div>
                            </div>
                            <asp:Panel ID="pnAlgorithmInfo" runat="server">
                                <asp:Panel ID="pnAlgorithmInfoHeader" runat="server">
                                    <div id="divAlgorithmInfoHeader" class="divAlgorithmInfoHeader">
                                        活动题参数信息:
                                    </div>
                                </asp:Panel>
                                <asp:Panel ID="pnAlgorithmInfoContent" runat="server">
                                    <div>
                                        <table class="gridviewblue" id="tableAlgorithmInfo" cellpadding="0" cellspacing="0">
                                            <tr class="titlerow">
                                                <th class="tdAlgorithmName" style="vertical-align: middle">
                                                    名字
                                                </th>
                                                <th class="tdAlgorithmContent" style="vertical-align: middle">
                                                    内容
                                                </th>
                                                <th class="tdAlgorithmPreView" style="vertical-align: middle">
                                                    预览
                                                </th>
                                                <th class="tdAlgorithmTool" style="vertical-align: middle">
                                                    <img alt="检查所有参数" title="检查所有参数" style="cursor: pointer;" src="../CMS/Images/application_get.png"
                                                        onclick="checkAlgorithmPrameter(this,null)" />
                                                    <img id="imgRecoveryParametersInfo" alt="恢复所有参数" title="恢复所有参数" style="cursor: pointer;
                                                        visibility: hidden" src="../Images/arrow_undo.png" onclick="recoveryAlgorithmPrameterInfo()" />
                                                    <img alt="拷贝参数" title="从另一道题拷贝全部参数信息" style="cursor: pointer;" src="../Images/application_double.png"
                                                        onclick="copyAlgorithmPrameterInfo()" />
                                                </th>
                                            </tr>
                                        </table>
                                    </div>
                                    <div style="display: none">
                                        <input type="text" id="txtAlgorithmContent" class="txtbox" style="margin: 0px; width: 672px;
                                            overflow: hidden;" onkeydown=" {if(event.keyCode == 13)return false;if(event.keyCode == 27)return false}"
                                            onkeyup="onTxtAlgorithmContentKeyUp(this,event); " />
                                    </div>
                                    <div id="ddlSysFunction" style="display: none; margin: 2px 0px 0px 2px; position: absolute;
                                        z-index: 100">
                                        <select id="selectResult" multiple="multiple" style="float: left; overflow: scroll;
                                            height: 100px; border: solid 1px gray; margin: -2px" onchange="divSelect_Click(event)">
                                        </select>
                                        <label id="titleShow" style="float: left; background-color: #FFFFDF">
                                        </label>
                                    </div>
                                </asp:Panel>
                            </asp:Panel>
                        </div>
                        <%--  <ajaxToolkit:DragPanelExtender ID="DragPanelExtender1" runat="server"
                                TargetControlID="pnAlgorithmInfo"
                                DragHandleID="pnAlgorithmInfoHeader" />--%>
                    </ContentTemplate>
                </ajaxToolkit:TabPanel>
                <ajaxToolkit:TabPanel runat="Server" ID="tabPanel3" HeaderText="<div class='tabHeader'>第三步. 知识点</div>">
                    <ContentTemplate>
                        <div id="divStep3">
                            <div id="divStep3_SelectLo">
                                <table id="tb_Step3SelectLO" width="100%" cellpadding="0" cellspacing="0" class="Tb">
                                    <tr>
                                        <td class="TbTd1" style="width: 260px; overflow: auto">
                                            <div style="font-size: 11px; color: blue; cursor: pointer; padding: 5px 5px 0; text-decoration: underline;"
                                                title="从解题过程中获取知识点" onclick="QM_showSolutionKP()">
                                                解题过程的知识点</div>
                                            <div id="div_tree2" style="padding: 5px;">
                                                <div id="divLoading2" style="text-align: center">
                                                    <img alt="加载中" src="../Images/ajax-loader_b.gif" />
                                                </div>
                                            </div>
                                        </td>
                                        <td class="TbTd2">
                                            <div id="divSKnowlegePoint" style="display: none">
                                                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                                    <tr>
                                                        <td class="KP_Tb_TD1">
                                                            <div id="divLOs">
                                                                &nbsp;
                                                            </div>
                                                        </td>
                                                        <td class="KP_Tb_TD2">
                                                            <div id="divQuestionLos">
                                                                <table id="table_QuestionLos" class="gridviewblue" cellpadding="0" cellspacing="0"
                                                                    style="text-align: left; width: 100%">
                                                                    <tbody>
                                                                        <tr class="titlerow">
                                                                            <th class="QuestionLos_TD1">
                                                                                单元
                                                                            </th>
                                                                            <th class="QuestionLos_TD2">
                                                                                知识点
                                                                            </th>
                                                                            <th class="QuestionLos_TD3">
                                                                                权重
                                                                            </th>
                                                                            <th class="QuestionLos_TD4">
                                                                                目标<br />
                                                                                知识点?
                                                                            </th>
                                                                            <th class="QuestionLos_TD6">
                                                                                认知过程
                                                                            </th>
                                                                            <th class="QuestionLos_TD5">
                                                                                删除
                                                                            </th>
                                                                        </tr>
                                                                    </tbody>
                                                                    <tbody>
                                                                        <tr id="trQuestionLoNoInfo">
                                                                            <td colspan="5">
                                                                                没有相关知识点信息
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                            &nbsp;
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div id="divStep3_showSelectedLos">
                            </div>
                        </div>
                    </ContentTemplate>
                </ajaxToolkit:TabPanel>
                <ajaxToolkit:TabPanel runat="Server" ID="tabPanel4" HeaderText="<div class='tabHeader'>第三步. 预览题</div>">
                    <ContentTemplate>
                        <div id="divStep4">
                            <div id="divQuestionSeedManage">
                            </div>
                            <div id="divQuestionPreview">
                            </div>
                            <div id="divPreviewErrorInfo">
                            </div>
                            <div id="divQuestionPreviewTool">
                                <input id="btnQuestionApply" type="button" value="应用" disabled="disabled" class="btn"
                                    onclick="btnQuestionApplyClick()" />
                                <input id="btnQuestionCancel" type="button" value="取消" class="btn" onclick="btnQuestionCancelClick()" />
                            </div>
                        </div>
                    </ContentTemplate>
                </ajaxToolkit:TabPanel>
            </ajaxToolkit:TabContainer>
        </div>
    </div>
    <div id="divLoading22" style="width: 100%; height: 100%; display: none; position: fixed;
        top: 40%; z-index: 1000">
        <center>
            <img id="abcd" alt="加载中" src="../Images/ajax-loader_b.gif" />
        </center>
    </div>
    <div id="divEnableOthers" style="display: none; position: fixed; top: 0px; left: 0px;
        width: 100%; height: 100%; background-color: Gray; filter: alpha(opacity=30);
        -moz-opacity: 0.3; opacity: 0.3; z-index: 10">
    </div>
    <div id="divAnswerFeedback" style="display: none; position: fixed; top: 30%; left: 30%;
        width: 600px; height: 200px; border: solid 2px #BED7F5; padding: 4px; z-index: 101;
        background-color: #E8E8E8; filter: progid:DXImageTransform.Microsoft.Shadow(color=#999999,direction=135,strength=6);">
        <div id="divAnswerFeedbackContent" style="border: solid 1px inset; height: 170px;
            border-color: #BED7F5; background-color: White; cursor: text; overflow: auto"
            onclick="onQustionDivClick(this)">
            &nbsp;
        </div>
        <div style="height: 22px; text-align: right; padding-top: 4px">
            <input id="btnAnswerFeedbackConfirm" type="button" value="确定" onclick="onBtnAnswerFeedbackConfirm()" />
            <input id="btnAnswerFeedbackCancel" type="button" value="取消" onclick="onBtnAnswerFeedbackCancel()" />
        </div>
    </div>
    <div id="divInputQuestionNumber" style="display: none; position: fixed; top: 30%;
        left: 38%; z-index: 101; width: 300px; border: solid 2px #BED7F5; padding: 5px;
        text-align: center; background-color: #ffffff; filter: progid:DXImageTransform.Microsoft.Shadow(color=#999999,direction=135,strength=6);">
        <div>
            <div style="color: Red;">
                请输入一个<br />
                用于拷贝活动题参数的题号:</div>
            <div style="margin: 2px">
                <input type="text" id="txtNumberOfQuestion" style="width: 250px;" value="" onkeyup="checkNumericAnswer(this.value,this)" />
            </div>
            <div>
                <input type="button" id="btnQueryAlgorithmInfo" value="确定" onclick="onQueryAlgorithmInfoClick()" />
                <input type="button" id="btnCancelQueryAlgorithmInfo" value="取消" onclick="onCancelQueryAlgorithmInfoClick()" />
            </div>
        </div>
    </div>
    <asp:Panel ID="FackBack_ModulePopup" runat="server" Style="width: 500px; display: none;
        z-index: 100;">
        <asp:Panel ID="FackBack_ModulePopup_PopupDragHandle" runat="server" Style="height: 57px;
            overflow: hidden; cursor: move;">
            <div style="float: left;">
                <div style="">
                    <img src="../Images/help/up_left.gif" /></div>
                <div style="height: 30px; width: 19px; border-left: solid 5px #BED7F5; background-color: #DFEFFF;">
                </div>
            </div>
            <div style="float: left; height: 100%; width: 444px;">
                <div style="padding: 0px; margin: 0px; height: 5px; overflow: hidden; background-color: #BED7F5;">
                </div>
                <div style="padding: 10px 5px; margin: 0px; height: 52px; overflow: hidden; background-color: #DFEFFF;">
                    <span id="Span1" style="display: block; padding-top: 9px; padding-left: 5px; float: left;
                        color: #3D6599; font-weight: bold;">
                        <h4>
                            Feedback
                        </h4>
                    </span><span style="display: block; float: right;">
                        <%--  <asp:ImageButton ID="imgClose" runat="server" ImageUrl="~/Images/close.gif" style="cursor:pointer;"
                    onclick="imgClose_Click"/>--%>
                        <img alt="Close" src="../Images/close.gif" onmousedown="return $find('FackBack_ModulePopupBehavior').hide();"
                            style="cursor: pointer;" />
                    </span>
                </div>
            </div>
            <div style="float: right; clear: right;">
                <div>
                    <img src="../Images/help/up_right.gif" /></div>
                <div style="height: 30px;">
                    <div style="float: left; width: 18px; height: 30px; background-color: #DFEFFF;">
                    </div>
                    <div style="float: left; width: 12px; height: 30px; background: url(../Images/help/right.gif) repeat-y;">
                    </div>
                </div>
            </div>
        </asp:Panel>
        <asp:Panel ID="Panel3" runat="server">
            <div style="clear: both;">
                <table cellspacing="0" cellpadding="0">
                    <tr>
                        <td style="width: 481px; border-left: solid 5px #BED7F5; background-color: White;">
                            <div id="divFaceBack" style="height: auto; padding: 10px;">
                                <%--<iframe id="Iframe1" width="100%" frameborder="0" style=" height:500px; overflow:scroll;  border:none; border-style:none;"></iframe>--%>
                            </div>
                        </td>
                        <td style="width: 12px; background: url(../Images/help/right.gif) repeat-y; height: auto;">
                        </td>
                    </tr>
                </table>
            </div>
            <div style="height: 33px; overflow: hidden; clear: both;">
                <div style="float: left;">
                    <img src="../Images/help/down_left.gif" /></div>
                <div style="float: left; height: 100%; width: 444px;">
                    <div style="padding: 0px; margin: 0px; height: 20px; overflow: hidden; background-color: White;">
                    </div>
                    <div style="padding: 0px; margin: 0px; height: 13px; overflow: hidden; width: 100%;
                        background-image: url(../Images/help/down_middle.gif); background-repeat: repeat-x">
                    </div>
                </div>
                <div style="float: right; clear: right;">
                    <img src="../Images/help/down_right.gif" /></div>
            </div>
        </asp:Panel>
    </asp:Panel>
    <asp:Button runat="server" ID="hiddenTargetControlForModulePopup_FackBack" Style="display: none" />
    <ajaxToolkit:ModalPopupExtender runat="server" ID="FackBack_ModalPopupExtender" BehaviorID="FackBack_ModulePopupBehavior"
        TargetControlID="hiddenTargetControlForModulePopup_FackBack" PopupControlID="FackBack_ModulePopup"
        DropShadow="False" PopupDragHandleControlID="FackBack_ModulePopup_PopupDragHandle"
        RepositionMode="RepositionOnWindowScroll">
    </ajaxToolkit:ModalPopupExtender>
    <%--<script type="text/javascript">
        bindSimpleUser()
        if ($get("ddlActions").value != "-1") {
            $get("ddlActions").value = "-1";
        }
      
    </script>--%>
</div>
