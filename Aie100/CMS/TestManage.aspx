<%@ Page Language="C#" AutoEventWireup="true" CodeFile="TestManage.aspx.cs" Inherits="CMS_TestManage" MasterPageFile="~/CMS/Master/cms.master" %>

<asp:Content ID="Content1" runat="server" ContentPlaceHolderID="head">
    <script src="../Plugins/dynatree/jquery/jquery-ui.custom.min.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/dynatree/jquery/jquery.cookie.js?version=1127" type="text/javascript"></script>
    <link href="../Plugins/dynatree/src/skin/ui.dynatree.css?version=1127" rel="stylesheet" type="text/css" />
    <script src="../Plugins/dynatree/src/jquery.dynatree.min.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/dynatree/contextmenu/jquery.contextMenu-custom.js?version=1127" type="text/javascript"></script>
    <link href="../Plugins/dynatree/contextmenu/jquery.contextMenu.css?version=1127" rel="stylesheet" type="text/css" />
    <script src="../Plugins/colResizable-1.3.source.js?version=1127" type="text/javascript"></script>
    <link href="../Styles/blocklayout.css?version=1127" rel="stylesheet" type="text/css" />
    <link href="../Plugins/pagination/pagination.css?version=1127" rel="stylesheet" type="text/css" />
    <script src="../Plugins/pagination/jquery.pagination.js?version=1127" type="text/javascript"></script>
    <link href="Styles/buildTest.css?version=1127" rel="stylesheet" />
    <link href="Styles/TestModels.css?version=1127" rel="stylesheet" />
    <link href="Styles/TestManage.css?version=1127" rel="stylesheet" />
    <script type="text/javascript" src="Scripts/comm.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Math.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Question.js?version=1127"></script>
    <script type="text/javascript" src="Scripts/KnowledgePointsData.js?version=1127"></script>

    <script type="text/javascript" src="Scripts/TestManageGlobal.js?version=1127"></script>
    <script type="text/javascript" src="Scripts/BT_Common.js?version=1127"></script>
    <script type="text/javascript" src="Scripts/BT_TestInfo.js?version=1127"></script>
    <script type="text/javascript" src="Scripts/BT_TestModel.js?version=1127"></script>
    <script type="text/javascript" src="Scripts/BT_ComposeTest.js?version=1127"></script>
    <script type="text/javascript" src="Scripts/BT_SelectQuestions.js?version=1127"></script>
    <script type="text/javascript" src="Scripts/buildTest.js?version=1127"></script>
    <script type="text/javascript" src="Scripts/editTest.js?version=1127"></script>
    <script type="text/javascript" src="Scripts/TestManage.js?version=1127"></script>
    <link href="Styles/ViewTestPaper.css?version=1127" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" runat="server" ContentPlaceHolderID="ContentPlaceHolder">
    <div id="dvTestManageBox" style="display: block">
        <div>试卷管理>></div>
        <div class="cms_toolbar">
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
                    <img id="btnAdd" title="智能组卷" alt="" src="Images/application_add.png" class="btnsel00" onmouseover="this.className='btnsel00_border'" onmouseout="this.className='btnsel00'" /></li>
            </ul>
        </div>
        <div style="margin-top: 5px; padding-top: 2px; font-size: 13px; height: 25px; float: left; width: 100%;">
            <div style="float: left; width: 415px">
                <input id="txtTestName" type="text" style="width: 173px">
                <select id="ddlTestType">
                    <option value="0" selected="selected">我的考试</option>
                    <option value="1">所有的考试</option>
                </select>
                <select id="ddlImportFlag">
                    <option value="" selected="selected">显示所有试卷</option>
                    <option value="0">显示智能组卷</option>
                    <option value="1">显示导入的试卷</option>
                </select>
            </div>
            <div id="dvTestPagination" class="testPagination" style="margin: 0px 10px 6px; text-align: center; float: left;"></div>
        </div>
        <div id="dvTestListBox" class="cms_contentbox" style="border: 1px solid #d5d5d5; height: 580px; overflow: auto">
            <table class="cms_datatable">
                <tr>
                    <th width="660">试卷名称</th>
                    <th width="80">难度</th>
                    <th width="100">考试时长(分)</th>
                    <th width="100">学生是否可见</th>
                    <th width="100">共享模式</th>
                    <th width="100">操作</th>
                    <th>&nbsp;</th>
                </tr>
            </table>
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
                            <li class='fname'>共享模式：</li>
                            <li class='inp'>
                                <select id='dlg_ShareModel' name='dlg_ShareModel' style='width: 180px'>
                                    <option value="0">自己</option>
                                    <option value="1">课程</option>
                                    <option value="2" selected="selected">书</option>
                                </select></li>
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
                            <td style="border: 1px solid #ddd; width: 25%">
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
    <div id="dvEditTestBox" style="display: none">
        <div>编辑试卷>></div>
        <div style="margin-right: 15px; margin-top: 8px;">
            <div id="dvEditTestTab" class="cseltab_bg">
                <ul id="ulTestBaseInfo_et" class="cseltab_ul">
                    <li class="cseltab_l"></li>
                    <li class="cseltab_m">第一步：考试信息</li>
                    <li class="cseltab_r"></li>
                </ul>
                <ul id="ulComposePaper_et" class="cseltab_ul">
                    <li class="cseltab_l"></li>
                    <li class="cseltab_m">第二步：试题</li>
                    <li class="cseltab_r"></li>
                </ul>
            </div>
            <div class="cseltab_box">
                <div id="dvTestBaseInfo_et" class="f12 line_h22">
                    <div class="cms_dialog" style="width: 700px;">
                        <ul>
                            <li class='fname'><span style='color: #e62701; font-size: 13px;'>*</span>&nbsp;考试名称：</li>
                            <li class='inp'>
                                <input id='dlg_txtTestName_et' name='dlg_txtTestName_et' type='text' style='width: 100%;' /></li>
                        </ul>
                        <ul>
                            <li class='fname'>难度：</li>
                            <li class='inp'>
                                <select id='dlg_ddlDifficultye_et' name='dlg_ddlDifficultye_et' style='width: 180px'>
                                    <option value="1">基础</option>
                                    <option value="2">简单</option>
                                    <option value="3" selected="selected">中等</option>
                                    <option value="4">困难</option>
                                    <option value="5">挑战</option>
                                </select></li>
                        </ul>
                        <ul>
                            <li class='fname'><span style='color: #e62701; font-size: 13px;'>*</span>&nbsp;考试时长(分)：</li>
                            <li class='inp'><input id='dlg_TimeLength_et' name='dlg_TimeLength_et' type='text' style='width: 100%;' /></li>
                        </ul>
                        <ul>
                            <li class='fname'>学生是否可见：</li>
                            <li class='inp'>
                                <input type="radio" id="rdStdVisible_y_et" name="rdStdVisible_et" /><label for="rdStdVisible_y_et">是</label>
                                <input type="radio" id="rdStdVisible_n_et" name="rdStdVisible_et" checked="checked" /><label for="rdStdVisible_n_et">否</label>
                            </li>
                        </ul>
                        <ul>
                            <li class='fname'>共享模式：</li>
                            <li class='inp'>
                                <select id='dlg_ShareModel_et' name='dlg_ShareModel_et' style='width: 180px'>
                                    <option value="0">自己</option>
                                    <option value="1">课程</option>
                                    <option value="2" selected="selected">书</option>
                                </select></li>
                        </ul>
                        <ul>
                            <li class='fname'>描述：</li>
                            <li class='inp'>
                                <textarea id="dlg_Description_et" name="dlg_Description_et" rows="8" cols="50" style="width: 435px; height: 182px"></textarea></li>
                        </ul>
                    </div>
                    <div style="clear: both"></div>
                </div>
                <div id="dvComposePaper_et" class="f12 line_h22" style="display: none">
                    <!---->
                    <div id="dvCmdBar_et" style="border: 1px solid #dadada; background-color: #f4f4f4; margin-top: 8px;">
                        <div style="padding: 3px">
                            <input type="button" id="btnSaveTestQuestion_et" value="保存" />
                            <input type="button" id="btnCancelTestQuestion_et" value="关闭" />
                        </div>
                    </div>
                    <div id="dvContentbox_et" style="border: 1px solid #d5d5d5; margin-top:-1px; padding:10px; overflow: auto; height:600px"></div>
                    <!--//-->
                </div>
            </div>
        </div>
    </div>
</asp:Content>
