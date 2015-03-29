<%@ Page Language="C#" AutoEventWireup="true" CodeFile="CorrectingPapers.aspx.cs" Inherits="TestShow_TestContent" Title="** 试卷详情 **" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <link href="../Styles/comm.css?version=1127" rel="stylesheet" />
    <link href="../Styles/Pages/CorrectingPapers.css?version=1127" rel="stylesheet" />
    <script type="text/javascript" src="../Scripts/jquery-1.10.2.min.js?version=1127"></script>
    <script src="../Plugins/jBox/jquery.jBox-2.3.min.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/jBox/i18n/jquery.jBox-zh-CN.js?version=1127" type="text/javascript"></script>
    <link href="../Plugins/jBox/Skins/Default/jbox.css?version=1127" rel="stylesheet" />
    <script type="text/javascript" src="../Scripts/comm.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Array.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/jquery.ajax.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/SimpleUser.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Question.js?version=1127"></script>
    <script type="text/javascript" src="../Plugins/numtocn.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Math.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Pages/CorrectingPapers.js?version=1127"></script>
<%--    <script type="text/javascript" src="../editor/scripts/editor.js?version=1127"></script>--%>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
    <script type="text/javascript">
        window.onload = function () {
            if (window.screen.width > 1400) {
                document.body.className = "w1240";
            } else {
                document.body.className = "w1024";
            }
        }
    </script>
</head>
<body class="w1240">
    <form id="form1" runat="server">
    <div class="correctingpapers w_correctingpapers">
        <div class="head w_cphead">
            <div class="title" id="divTestTitle">
                ...
            </div>
            
            <div class="tinfo">
                <span style="margin-right:20px;display:none" id="spStuFullName">姓名：<span id="spStuFullNameValue"><img alt="" src="../Images/ajax-loader_m.gif" /></span></span>

                <span style="margin-right:20px">题量：共<span id="spQuestionCount">0</span>题</span>
     
                <span id="spTestTime0" style="margin-right:20px;display:none;">时间：<span id="spTestTime">0</span>分钟</span>
    
                <span style="margin-right:20px">满分：<span id="spTestScore">0</span>分</span>
 
                <span id="spAnswerBase0" style="margin-right:20px;display:none;">题完成率：<span id="spAnswerBase">0</span></span>
      
                <span id="spUseTime0" style="margin-right:20px;display:none;">用时：<span id="spUseTime">0</span></span>
   
                <span id="spMySocre0" style="display:none;">得分：<span id="spMySocre">0</span></span>
            </div>
            <div>
                <input class="tc_button" type="button" id="btnSubmitTest" value="提交" style="display:none" />
                <input class="tc_button" type="button" id="btnNext" value="下一个" style="display:none" />
                <input class="tc_button" type="button" id="btnExitTest" value="退出" />
            </div>
            <%--<div class="toolbar">
                <div class="btn f_l toolbtn">
                    <div class="yy">提交</div>
                </div>
                <div class="btn f_l toolbtn" style="margin:0px 0px;">
                    <div class="yy">保存</div>
                </div>
                <div class="btn f_l toolbtn">
                    <div class="yy">退出</div>
                </div>
                <div class="c_b"></div>
            </div>--%>
        </div>
        <div style="border:1px solid rgb(135,178,33);padding-top:115px">
            <div id="divQuestionList" class="questions f_l w_cpcontent">
                
                <div style="padding:50px;text-align:center;"><img src="../Images/ajax-loader_b.gif" alt="" /></div>
            </div>
            <div class="right_area" style="margin-left:762px;position:fixed;display:none">
                <div class="remaintime">
                    <div id="timer" class="timer"><span class="hour">00</span>:<span class="minute">00</span>:<span class="second">00</span></div>
                    <div>考试剩余时间</div>
                </div>
                <div class="mark">
                    <div class="mark_content">
                        <div class="f_l">
                            <div class="mark_bg_marked"></div>
                            <div>标记</div>
                        </div>
                        <div class="f_l" style="margin-left:20px;">
                            <div class="mark_bg_finished"></div>
                            <div>已做</div>
                        </div>
                        <div class="f_l" style="margin-left:20px;">
                             <div class="mark_bg_unfinished"></div>
                            <div>未做</div>
                        </div>
                        <div class="c_b"></div>
                    </div>
                </div>
              
            </div>
            <div class="c_b"></div>
        </div>
    </div>
    </form>
</body>
</html>
