<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Assignment.aspx.cs" Inherits="Assignment_CreateAssignment" MasterPageFile="~/Master/MasterPage.master" Title="任务管理" %>

<asp:Content runat="server" ContentPlaceHolderID="head">
    <%--<script type="text/javascript" src="../Scripts/jquery-1.10.2.min.js?version=1127"></script>--%>
    <script type="text/javascript" src="../Scripts/jquery-1.7.1.min.js?version=1127"></script>
    <link href="../Plugins/showLoading/css/showLoading.css?version=1127" rel="stylesheet" />
    <script type="text/javascript" src="../Plugins/showLoading/js/jquery.showLoading.min.js?version=1127"></script>
    <link href="../Plugins/jBox/Skins/Default/jbox.css?version=1127" rel="stylesheet" />
    <script src="../Plugins/jBox/jquery.jBox-2.3.min.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/pagination/jquery.pagination.js?version=1127" type="text/javascript"></script>
    <link href="../Plugins/pagination/pagination.css?version=1127" rel="stylesheet" />

    <script src="../Plugins/dynatree/jquery/jquery-ui.custom.min.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/dynatree/jquery/jquery.cookie.js?version=1127" type="text/javascript"></script>
    <link href="../Plugins/dynatree/src/skin/ui.dynatree.css?version=1127" rel="stylesheet" type="text/css" />
    <script src="../Plugins/dynatree/src/jquery.dynatree.min.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/dynatree/contextmenu/jquery.contextMenu-custom.js?version=1127" type="text/javascript"></script>
    <link href="../Plugins/dynatree/contextmenu/jquery.contextMenu.css?version=1127" rel="stylesheet" type="text/css" />
    <script src="../Plugins/colResizable-1.3.source.js?version=1127" type="text/javascript"></script>

    <script type="text/javascript" src="../Scripts/comm.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/jquery.ajax.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/SimpleUser.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Array.js?version=1127"></script>

    <link href="../Styles/util.css?version=1127" rel="stylesheet" />
    <link href="../Styles/Pages/CreateAssignment.css?version=1127" rel="stylesheet" />
    <script type="text/javascript" src="../Scripts/Pages/TestList.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Pages/CreateAssignment.js?version=1127"></script>
    <link href="../Plugins/lhgcalendar/_doc/common.css?version=1127" rel="stylesheet" />
    <script type="text/javascript" src="../Plugins/lhgcalendar/lhgcalendar.min.js?version=1127"></script>

    <link href="../Styles/blocklayout.css?version=1127" rel="stylesheet" type="text/css" />
    <link href="../CMS/Styles/buildTest.css?version=1127" rel="stylesheet" />
    <link href="../CMS/Styles/TestModels.css?version=1127" rel="stylesheet" />

    <script type="text/javascript" src="../Scripts/Math.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Question.js?version=1127"></script>
    <script type="text/javascript" src="../CMS/Scripts/KnowledgePointsData.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Pages/AM_TestManageGlobal.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Pages/AM_Common.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Pages/AM_TestInfo.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Pages/AM_TestModel.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Pages/AM_ComposeTest.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Pages/AM_SelectQuestions.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Pages/AM_buildTest.js?version=1127"></script>
</asp:Content>
<asp:Content runat="server" ContentPlaceHolderID="ContentPlaceHolder1">
    <div style="background-color: #2A8C25;color: #FFFFFF;padding: 12px 35px; margin-bottom: 10px;">
        <span id="spFeatureName">任务管理</span>
    </div>
    <div id="dvAssignmentBox">
        <div class="custab_bg">
            <ul class="custab_ul" id="ulSelectTest">
                <li class="custab_l"></li>
                <li class="custab_m">选择考试</li>
                <li class="custab_r"></li>
            </ul>
            <ul class="custab_ul" id="ulAssignSetting">
                <li class="custab_l"></li>
                <li class="custab_m">设置</li>
                <li class="custab_r"></li>
            </ul>
        </div>
		<div class="custab_box">
            <div class="f12 line_h22" id="dvSelectTest">
                <div id="dvSelectList">
                <div style="margin:5px 0px; padding-top: 2px; font-size: 13px; height: 25px; float: left; width: 100%;">
                    <div style="float: left; width: 500px;">
                        <input id="txtTestName" type="text" style="width: 173px" />
                        <select id="ddlTestType">
                            <option value="0">我的考试</option>
                            <option value="1" selected="selected">所有的考试</option>
                        </select>
                        <select id="ddlImportFlag">
                            <option value="" selected="selected">显示所有试卷</option>
                            <option value="0">显示智能组卷</option>
                            <option value="1">显示导入的试卷</option>
                        </select>
                        <input type="button" id="btnCreatePaper" value="创建试卷" />
                    </div>
                    <div style="float:right; display:none"><input type="button" id="btnCancelSelect" value="取消选择" class="button"/></div>
                </div>
                <div class="cms_contentbox" style="border: 1px solid #d5d5d5; height: 505px; overflow: auto; clear:both">
                    <table class="tb_lightblue" id="tbTestList">
                        <tr>
                            <th width="35">选择</th>
                            <th width="600">试卷名称</th>
                            <th width="80">难度</th>
                            <th width="100">考试时长(分)</th>
                            <th width="100">学生可见</th>
                            <th width="100">共享模式</th>
                            <th width="80">操作</th>
                            <th>&nbsp;</th>
                        </tr>
                    </table>
                </div>
                <div id="dvTestPagination" class="testPagination" style="margin: 10px 10px 2px; text-align: center;"></div>
                <div style="clear:both"></div>
                </div>
                <div id="dvSelectedItem" style="display:none">
                    <div class="cms_contentbox" style="border: 1px solid #d5d5d5; clear:both">
                        <table class="tb_lightblue" id="tbSelectedItem">
                            <tr>
                                <th width="600">试卷名称</th>
                                <th width="80">难度</th>
                                <th width="100">考试时长(分)</th>
                                <th width="100">学生可见</th>
                                <th width="100">共享模式</th>
                                <th width="80">操作</th>
                                <th>&nbsp;</th>
                            </tr>
                        </table>
                    </div>
                    <div style="text-align:right; height:35px; padding-top: 10px; padding-right:60px"><input type="button" id="btnReselectTest" value="重新选择考试" class="button"/></div>
                </div>
            </div>
            <div style="display:none" class="f12 line_h22" id="dvAssignSetting">
                <div class="group_title" style="margin-top:20px; margin-left: 175px;"><span>基本信息</span></div>
                <div class="b_list" style="margin: 15px 0 15px 130px;">
                    <ul>
                        <li class="fname"><span style="color:#f00">*</span>&nbsp;任务名称：</li><li class="fcont" style="width:564px"><input type="text" id="txtAssignTitle" style="width:510px" />&nbsp;</li>
                        <li class="fname">任务类型：</li><li class="fcont"><select id="ddlAssignType"><option value="1">单元考试</option><option value="2" selected="selected">阶段性考试</option><option value="3">课外作业</option><option value="4">模拟考试</option></select>&nbsp;</li><li class="fname"><span style="color:#f00">*</span>&nbsp;属于：</li><li class="fcont"><input type="text" id="txtStructureName" readonly="readonly" style="background-color:#e2e2e2" /><img id="btnSelBookStructure" title="选择章节" style="vertical-align: middle;" src="../Images/application_view_list.png" class="btnsel00" onmouseover="this.className='btnsel00_border'" onmouseout="this.className='btnsel00'" />&nbsp;</li>
                    </ul>
                </div>
                <div class="group_title" style="margin-top:20px; margin-left: 175px;"><span>考试设置</span></div>
                <div class="b_list" style="margin: 15px 0 15px 130px;">
                    <ul>
                        <li class="fname">阅卷模式：</li><li class="fcont" style="width:564px"><select id="ddlExamineMode"></select>&nbsp;<a style="display:none" target="_blank" href="ExaminerManage.aspx?sectionId=<%=Request.QueryString["sectionId"] %>">阅卷设置</a>&nbsp;</li>
                        <li class="fname"><span style="color:#f00">*</span>&nbsp;考试时间：</li><li class="fcont"><input type="text" id="txtTimeLength" />&nbsp;分钟</li><li class="fname"><span style="color:#f00">*</span>&nbsp;最短交试卷时间：</li><li class="fcont"><input type="text" id="txtShorTestTime" value="30" />&nbsp;分钟</li>
                        <li class="fname"><span style="color:#f00">*</span>&nbsp;开始日期：</li><li class="fcont"><input id="txtStartDate" readonly="readonly" type="text" class="runcode" />&nbsp;</li><li class="fname"><span style="color:#f00">*</span>&nbsp;结束日期：</li><li class="fcont"><input id="txtEndDate" readonly="readonly" type="text" class="runcode" />&nbsp;</li>
                    </ul>
                </div>
                <div class="tb_list" style="margin: -10px 0 15px 130px;">
                    <ul>
                        <li class="fl"><input type="checkbox" id="ckIsDateControl" checked="checked" /><label for="ckIsDateControl">是否在指定时间内完成</label></li><li class="fr"><input type="checkbox" id="ckUpsetQuestionField" checked="checked" /><label for="ckUpsetQuestionField">是否打乱题的顺序</label></li>
                        <li class="fl"><input type="checkbox" id="ckShowErrorQuestion" checked="checked" /><label for="ckShowErrorQuestion">是否显示做错的考题</label></li><li class="fr"><input type="checkbox" id="ckErrorQuestionImprove" checked="checked" /><label for="ckErrorQuestionImprove">是否用做错的题来提高成绩</label></li>
                    </ul>
                </div>
                <div id="divStudySettings" style="display:none;">
                    <div class="group_title" style="margin-top:20px; margin-left: 175px;"><span>学习设置</span></div>
                    <div class="tb_list" style="margin: 15px 0 15px 130px;">
                        <ul>
                            <li class="fl"><input type="checkbox" id="ckShowKp" checked="checked" /><label for="ckShowKp">是否显示知识点</label></li><li class="fr"><input type="checkbox" id="ckShowAnwer" checked="checked" /><label for="ckShowAnwer">是否显示答案</label></li>
                            <li class="fl"><input type="checkbox" id="ckShowHint" checked="checked" /><label for="ckShowHint">是否显示提示</label></li><li class="fr"><input type="checkbox" id="ckShowSolution" checked="checked" /><label for="ckShowSolution">是否显示解题过程</label></li>
                            <li class="fl"><input type="checkbox" id="ckShowDrill" checked="checked" /><label for="ckShowDrill">是否在考试前显示训练</label></li><li class="fr"><input type="checkbox" id="ckAllowDrillImprove" checked="checked" /><label for="ckAllowDrillImprove">是否允许用训练来提高成绩</label></li>
                        </ul>
                    </div>
                </div>
                <div style="clear:both;height:46px;text-align:right;padding-top:20px; padding-right:405px"><input type="button" id="btnSaveAssignSetting" value="保存" style="width: 60px;"  class="button"/></div>
            </div>
		</div>
	</div>
    <div id="dvBuildTestBox" style="display: none">
        <div>智能组卷>></div>
        <div style="margin-right: 15px; margin-top: 8px;">
            <div id="dvBuildTestTab" class="cseltab_bg">
                <ul id="ulTestBaseInfo" class="cseltab_ul">
                    <li class="cseltab_l"></li>
                    <li class="cseltab_m">第一步：考试信息</li>
                    <li class="cseltab_r"></li>
                </ul>
                <ul id="ulTestModel" class="cseltab_ul">
                    <li class="cseltab_l"></li>
                    <li class="cseltab_m">第二步：选择试卷模板</li>
                    <li class="cseltab_r"></li>
                </ul>
                <ul id="ulComposePaper" class="cseltab_ul">
                    <li class="cseltab_l"></li>
                    <li class="cseltab_m">第三步：组卷</li>
                    <li class="cseltab_r"></li>
                </ul>
                <%--<ul id="ulComposeComplete" class="cseltab_ul">
                    <li class="cseltab_l"></li>
                    <li class="cseltab_m">完成</li>
                    <li class="cseltab_r"></li>
                </ul>--%>
            </div>
            <div class="cseltab_box">
                <div id="dvTestBaseInfo" class="f12 line_h22">
                    <div class="cms_dialog" style="width: 700px;">
                        <ul>
                            <li class='fname'><span style='color: #e62701; font-size: 13px;'>*</span>&nbsp;考试名称：</li>
                            <li class='inp'>
                                <input id='dlg_txtTestName' name='dlg_txtTestName' type='text' style='width: 100%;' /></li>
                        </ul>
                        <ul>
                            <li class='fname'>难度：</li>
                            <li class='inp'>
                                <select id='dlg_ddlDifficultye' name='dlg_ddlDifficultye' style='width: 180px'>
                                    <option value="1">基础</option>
                                    <option value="2">简单</option>
                                    <option value="3" selected="selected">中等</option>
                                    <option value="4">困难</option>
                                    <option value="5">挑战</option>
                                </select></li>
                        </ul>
                        <ul>
                            <li class='fname'><span style='color: #e62701; font-size: 13px;'>*</span>&nbsp;考试时长(分)：</li>
                            <li class='inp'>
                                <input id='dlg_TimeLength' name='dlg_TimeLength' type='text' style='width: 100%;' /></li>
                        </ul>
                        <ul>
                            <li class='fname'>学生是否可见：</li>
                            <li class='inp'>
                                <input type="radio" id="rdStdVisible_y" name="rdStdVisible" /><label for="rdStdVisible_y">是</label>
                                <input type="radio" id="rdStdVisible_n" name="rdStdVisible" checked="checked" /><label for="rdStdVisible_n">否</label>
                            </li>
                        </ul>
                        <ul>
                            <li class='fname'>描述：</li>
                            <li class='inp'>
                                <textarea id="dlg_Description" name="dlg_Description" rows="8" cols="50" style="width: 435px; height: 182px"></textarea></li>
                        </ul>
                    </div>
                    <div style="clear: both"></div>
                </div>
                <div id="dvTestModelInfo" class="f12 line_h22" style="display: none">
                    <input type="button" id="btnAddTestModel" value="新建题型" />
                    <input type="button" id="btnSelTestModel" value="选择选择已存在的模板" />
                    <span style="font-weight: bold; font-size: 11pt; display: none">模板名称:</span>
                    <span id="spTestModelName" style="font-size: 11pt; display: none"></span>
                    <div id="dvTestModel" style="padding:10px; display:none">
                        <div style="height:36px"><label>模板名称:&nbsp;</label><input type="text" id="txtTestModelName" style="width:300px" /></div>
                        <div id="dvHeader" style="background-color:#abc5e7; width:570px">
                            <table class="tm_lst" border="0">
                                <tr><th style="text-align:left; width:200px;">&nbsp;题类型</th><th style="width: 100px">题量</th><th style="width: 100px">每题分数</th><th style="width: 80px">总分</th><th style="width: 50px">&nbsp;</th></tr>
                            </table>
                        </div>
                        <div style="border:0px solid #abc5e7; height:230px; width:568px; overflow-y:auto">
                        <table id="tbTestModel" class="tm_lst" border="0">
                        </table>
                        <div id="dvAddQuestionType" style="padding:3px"><a href="javascript:void(0)">添加题类型</a></div>
                        </div>
                    </div>
                </div>
                <div id="dvComposePaper" class="f12 line_h22" style="display: none">
                    <!---->
                    <div id="dvCmdBar" style="border: 1px solid #dadada; background-color: #f4f4f4; margin-top: 8px;">
                        <div style="padding: 3px">
                            <input type="button" id="btnBuildTest" value="生成试卷" disabled="disabled" />
                            <input type="button" id="btnAddQuestion" value="添加题" disabled="disabled" />
                            <input type="button" id="btnSaveTestQuestion" value="保存" disabled="disabled" />
                            <input type="button" id="btnCancelTestQuestion" value="关闭" onclick="closeBuildTestBox()" />
                        </div>
                    </div>
                    <table id="tbContentbox" style="width: 100%; border: 1px solid #ddd; border-collapse: collapse; margin-top: -1px;">
                        <tr>
                            <td style="border: 1px solid #ddd; width: 25%" valign="top">
                                <div id="bookStructureTree"></div>
                            </td>
                            <td id="tdRightBox" style="border: 1px solid #ddd;" valign="top">
                                <div id="dvQuesBox">
                                    <div id="dvTestQuesType"></div>
                                    <div id="dvViewModel" class="custab_bg" style="clear: both; display: none">
                                        <ul id="ulByQuestion" class="custab_ul">
                                            <li class="custab_l"></li>
                                            <li class="custab_m">按题显示</li>
                                            <li class="custab_r"></li>
                                        </ul>
                                        <ul id="ulByLo" class="custab_ul">
                                            <li class="custab_l"></li>
                                            <li class="custab_m">按知识点显示</li>
                                            <li class="custab_r"></li>
                                        </ul>
                                    </div>
                                    <div id="dvQuestionList" class="custab_box" style="display: none; overflow: auto; font-size: 13px;">
                                        <table id="tbQuesList"></table>
                                    </div>
                                </div>
                                <div id="dvSelQuesBox" style="display: none; font-size: 13px; padding-top: 5px; padding-left:5px;">
                                    <div style="float: left">
                                        <input type="button" id="btnConfirmSel" value="添加" />
                                        <input type="button" id="btnCloseSel" value="取消" />
                                        <span id="spAllowNum" style="color:#4c9f02;font-weight:bold">(已选择<span class="added">&nbsp;</span>道题，可选择<span class="allowNum">&nbsp;</span>道题)</span>
                                    </div>
                                    <div id="dvSelPagination" class="pagination" style="margin: 0px 10px 6px; text-align: center;"></div>
                                    <div id="dvSelQuesList" style="overflow: auto;">
                                        <table class="tbQuestionList"><tr style="border-top:1px solid #d5d5d5; background-color:#e3f6ff;height:25px;"><th align="left">选择</th><th>题</th></tr></table>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                    <div style="clear: both"></div>
                    <!--//-->
                </div>
                <%--<div id="dvCompleteBuildTest">
                    <div style="text-align:center; padding:12px;">
                        <input type="button" id="btnSaveTest" value="保存" />&nbsp;
                        <input type="button" id="btnCancelSaveTest" value="取消" onclick="closeBuildTestBox()" />
                    </div>
                </div>--%>
            </div>
        </div>
    </div>
</asp:Content>