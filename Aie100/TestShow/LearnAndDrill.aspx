<%@ Page Language="C#" AutoEventWireup="true" CodeFile="LearnAndDrill.aspx.cs" Inherits="Student_LearnAndDrill" MasterPageFile="~/Master/Simple.master" Title="学习与训练" %>

<asp:Content runat="server" ContentPlaceHolderID="head">
    <link href="../Styles/comm.css?version=1127" rel="stylesheet" />
    <link href="../Styles/Pages/LearnAndDrill.css?version=1127" rel="stylesheet" />
    <script type="text/javascript" src="../Scripts/jquery-1.7.1.min.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/jquery.ajax.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/comm.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/SimpleUser.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Array.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Question.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Pages/LearnAndDrill.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/PopTip.js?version=1127"></script>
    <script src="../Plugins/jBox/jquery.jBox-2.3.min.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/jBox/i18n/jquery.jBox-zh-CN.js?version=1127" type="text/javascript"></script>
    <script type="text/javascript" src="../Scripts/ShowDetails.js?version=1127"></script>
    <link href="../Plugins/jBox/Skins/Default/jbox.css?version=1127" rel="stylesheet" />
    <link href="../editor/css/editor.css?version=1127" rel="stylesheet" />
    <script type="text/javascript" src="../editor/scripts/editor.js?version=1127"></script>
</asp:Content>
<asp:Content runat="server" ContentPlaceHolderID="ContentPlaceHolder1">
    <div class="learndrill">
        <div class="toolbar">
            学习与训练
        </div>
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td class="knowledges">
                    <div id="divKnowledgeList">
                        <div class="loading">
                            <img alt="加载中" src="../Images/ajax-loader_b.gif" />
                        </div>
                    </div>
                </td>
                <td class="content">
                    <div>
                        <div class="tab_list">
                          <%--  <div type="prekps" class="tab_item tab_item_sel">预备知识</div>--%>
                            <div type="study" class="tab_item tab_item_sel">学习</div>
                            <div type="sampequestion" class="tab_item tab_item_nosel">例题</div>
                            <div type="bestpath" class="tab_item tab_item_nosel">最佳学习路径</div>
                            <div type="practice" class="tab_item tab_item_nosel">测试</div>
                            <div class="c_b"></div>
                        </div>

                        <div class="contentbody">
                          <%--  <div id="divPreKps" class="contentitem">
                                <div class="loading">
                                    <img alt="加载中" src="../Images/ajax-loader_b.gif" />
                                </div>
                            </div>--%>
                            <div id="divStudy" class="contentitem" style="display: none;">
                                <div class="loading">
                                    <img alt="加载中" src="../Images/ajax-loader_b.gif" />
                                </div>
                            </div>
                            <div id="divSampleQuestion" class="contentitem" style="display: none;">
                                <div class="loading">
                                    <img alt="加载中" src="../Images/ajax-loader_b.gif" />
                                </div>
                            </div>
                            <div id="divBestPath" class="contentitem" style="display: none;">
                                <div class="loading">
                                    <img alt="加载中" src="../Images/ajax-loader_b.gif" />
                                </div>
                            </div>
                            <div id="divPractice" class="contentitem" style="display: none;">
                                <div class="loading">
                                    <img alt="加载中" src="../Images/ajax-loader_b.gif" />
                                </div>
                            </div>

                        </div>
                    </div>
                </td>
            </tr>
        </table>

    </div>
</asp:Content>
