<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ImportTest.aspx.cs" Inherits="CMS_ImportTest" MasterPageFile="~/CMS/Master/cms1.master" %>

<asp:Content ContentPlaceHolderID="head" runat="server">
    <style type="text/css">
        .testimport {
            font-family: 'Microsoft YaHei';
            font-size: 14px;
            margin: 0px auto;
            /* width: 1000px;*/
            border: 1px solid rgb(190, 218, 255);
            display: none;
        }

            .testimport .importsetting {
                text-align: right;
            }

                .testimport .importsetting .setting1 {
                    line-height: 30px;
                    border: 1px solid rgb(190, 218, 255);
                    margin-bottom: 5px;
                    padding: 5px;
                }

                    .testimport .importsetting .setting1 .test_title {
                        text-align: left;
                    }

                .testimport .importsetting .setting2 {
                    line-height: 30px;
                    border: 1px solid rgb(190, 218, 255);
                }

                .testimport .importsetting .setting3 {
                    line-height: 30px;
                    border: 1px solid rgb(190, 218, 255);
                    margin-top: 5px;
                }

            .testimport .testinfo {
                /*background-color: rgb(190, 218, 255);*/
                padding: 15px;
            }

        .testinfo span {
            margin-right: 30px;
        }

        .testimport input.underline {
            background-color: transparent;
            border-style: none;
            border-bottom: 1px solid #000;
            text-align: left;
        }

        .testimport table td {
            vertical-align: top;
        }

        .testimport #divTestEditor {
            width: 100%;
            height: 100%;
            border: 1px solid gray;
        }

        .testimport .sbTX {
            position: absolute;
            width: 120px;
            line-height: 18px;
            left: 133px;
            margin-top: -5px;
            background-color: #fff;
            border: 1px solid #888;
            text-align: left;
            display: none;
        }

            .testimport .sbTX .sbTX_item:hover {
                color: #fff;
                background-color: rgb(90,183,227);
                cursor: pointer;
            }
    </style>
    <link href="../Styles/Ico.css?version=1127" rel="stylesheet" />
    <script src="../Scripts/jquery-1.6.1.min.js?version=1127" type="text/javascript"></script>
    <script src="../Scripts/jquery.ajax.js?version=1127" type="text/javascript"></script>
    <script src="../Scripts/Array.js?version=1127" type="text/javascript"></script>
    <script src="../Scripts/comm.js?version=1127" type="text/javascript"></script>
    <script src="../Scripts/String.js?version=1127" type="text/javascript"></script>
    <%--    <script src="../Scripts/SimpleUser.js?version=1127" type="text/javascript"></script>--%>
    <script src="../Plugins/jBox/jquery.jBox-2.3.min.js?version=1127"
        type="text/javascript"></script>
    <link href="../Plugins/jBox/Skins/Default/jbox.css?version=1127" rel="stylesheet"
        type="text/css" />
    <script src="Scripts/cms_header.js?version=1127" type="text/javascript"></script>
    <script src="../editor/scripts/editor.js?version=1127" type="text/javascript"></script>
    <script src="../Scripts/Question.js?version=1127" type="text/javascript"></script>
    <script src="Scripts/ImportTest.js?aa=123" type="text/javascript"></script>

</asp:Content>
<asp:Content ContentPlaceHolderID="ContentPlaceHolder" runat="server">
    <object style="display: none" id="oActiveX" classid="clsid:3d0d6540-ca10-3863-b94d-3c616fda7b38"></object>
    <div id="divActiveXWarning" style="display: none; font-size: 13px; padding: 5px; background-color: #f2f1f1; border-top: 1px solid gray; position: fixed; bottom: 0; left: 0; width: 100%; overflow: hidden; z-index: 1000;">
        未安装“图片自动上传插件”，或此插件运行不正常（未在IE下使用），安装成功后请刷新页面。<a href="../Uploads/aie插件.rar" target="_blank">点此下载该插件</a>
    </div>
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

        </ul>
    </div>
    <div id="divTestImport" class="testimport">
        <table border="0" style="width: 100%">
            <tr>
                <td style="width: 400px">
                    <div class="importsetting">
                        <div class="setting1">
                            <div class="test_title">试卷名称：</div>
                            <div>
                                <textarea rows="" cols="" id="txtAreaTestTitle" style="width: 390px; height: 80px; vertical-align: top; font-weight: bold"></textarea></div>
                            <div style="margin-top: 5px;">
                                <center>
                                    <div style="border: 1px dotted gray; padding: 0px 5px 0px 5px; width: 170px; text-align: center;">
                                        <input checked="checked" id="rdSaveTest" type="radio" name="test_question_group" />
                                        <label for="rdSaveTest">保存试卷</label>&nbsp;<input id="rdSaveQuesions" type="radio" name="test_question_group" />
                                        <label for="rdSaveQuesions">只保存题</label></div>
                                </center>
                                <center>
                                    <div>
                                        <span>学生可见：<input type="checkbox" checked="checked" id="cbxOnlyStudentVisible"></span>
                                        <span style="margin-left: 10px;">分数：<input type="text" id="txtTestScore" default="100" onkeyup="checkNumericAnswer(this.value,this)" value="100" class="underline" style="width: 35px; text-align: center" /></span>
                                        <span style="margin-left: 10px;">时间：<input type="text" id="txtTestTime" default="60" onkeyup="checkNumericAnswer(this.value,this)" value="60" class="underline" style="width: 35px; text-align: center" /></span>
                                        <span style="margin-left: 10px;">难度：<select id="ddlDifficulty">
                                            <option>1</option>
                                            <option>2</option>
                                            <option selected="selected">3</option>
                                            <option>4</option>
                                            <option>5</option>
                                        </select>
                                        </span>
                                    </div>
                                </center>

                            </div>

                        </div>
                        <div class="setting2">
                            <div id="divTestQuestionType" style="width: 360px; margin: 5px auto;">
                                <div style="text-align: center">
                                    <img alt="" src="../Images/ajax-loader_b.gif" /></div>
                            </div>
                        </div>

                        <div class="setting3">
                            <div style="width: 260px; margin: 5px auto;">
                                <div>

                                    <div><span style="width: 200px;">题设：</span><input id="txtQuestionBody" class="underline" style="width: 180px; text-align: center;" value="[0-9]{1,}．" /></div>
                                    <div class="sbTX" style="font-size: 12px; width: 180px; left: 163px;">
                                        <div class="sbTX_item" val="[0-9]{1,}．">“数字”+“．”&nbsp;&nbsp;(如：“1．”)</div>
                                        <div class="sbTX_item" val="[0-9]{1,}\.">“数字”+“.”&nbsp;&nbsp;(如：“1.”)</div>
                                        <div class="sbTX_item" val="[0-9]{1,}、">“数字”+“、”&nbsp;&nbsp;(如：“1、”)</div>
                                    </div>
                                    <%--<div>
                                            <select id="txtQuestionBody" style="width:180px;position:absolute;margin-top:-5px;left:70px;">
                                                <option value="[0-9]．">“数字”+“．”&nbsp;&nbsp;(如：“1．”)</option>
                                                <option value="[0-9]、">“数字”+“、”&nbsp;&nbsp;(如：“1、”)</option>
                                            </select>

                                        </div>--%>
                                </div>
                                <div>
                                    <div><span style="width: 200px;">参考答案：</span><input id="txtReferenceAnswer" class="underline" style="width: 180px; text-align: center;" value="[A-Z]．" /></div>
                                    <div class="sbTX" style="font-size: 12px; width: 180px; left: 163px;">
                                        <div class="sbTX_item" val="[A-Z]．">“字母”+“．”&nbsp;&nbsp;(如：“A．”)</div>
                                        <div class="sbTX_item" val="[A-Z]\.">“字母”+“．”&nbsp;&nbsp;(如：“A.”)</div>
                                        <div class="sbTX_item" val="[A-Z]、">“字母”+“、”&nbsp;&nbsp;(如：“A、”)</div>
                                    </div>
                                    <%--<select id="txtReferenceAnswer" style="width:180px;">
                                            <option value="[A-Z]．">“字母”+“．”&nbsp;&nbsp;(如：“A．”)</option>
                                            <option value="[A-Z]、">“字母”+“、”&nbsp;&nbsp;(如：“A、”)</option>
                                        </select>--%>
                                </div>
                                <div>
                                    <div><span style="width: 200px;">正确答案：</span><input id="txtCorrectAnswer" class="underline" style="width: 180px; text-align: center;" value="答案：" /></div>
                                    <div class="sbTX" style="font-size: 12px; width: 180px; left: 163px;">
                                        <div class="sbTX_item" val="答案：">“答案：”</div>
                                        <div class="sbTX_item" val="答案:">“答案:”</div>
                                        <div class="sbTX_item" val="正确答案：">“正确答案：”</div>
                                        <div class="sbTX_item" val="正确答案:">“正确答案:”</div>
                                        <%--<div class="sbTX_item" val="数字+“.”+答案">“数字”+“.”+“答案”</div>--%>
                                    </div>
                                    <%--<select id="txtCorrectAnswer" style="width:180px;">
                                            <option value="答案：">“答案：”</option>
                                            <option value="正确答案：">“正确答案：”</option>
                                        </select>--%>
                                </div>
                                <div>
                                    <div><span style="width: 200px;">解题过程：</span><input id="txtSolution" class="underline" style="width: 180px; text-align: center;" value="答案要点：" /></div>
                                    <div class="sbTX" style="font-size: 12px; width: 180px; left: 163px;">
                                        <div class="sbTX_item" val="答案要点：">“答案要点：”</div>
                                        <div class="sbTX_item" val="答案要点:">“答案要点:”</div>
                                        <div class="sbTX_item" val="解题过程：">“解题过程：”</div>
                                        <div class="sbTX_item" val="解题过程:">“解题过程:”</div>
                                        <div class="sbTX_item" val="解析：">“解析：”</div>
                                        <div class="sbTX_item" val="解析:">“解析:”</div>
                                        <div class="sbTX_item" val="分析：">“分析：”</div>
                                        <div class="sbTX_item" val="分析:">“分析:”</div>
                                    </div>
                                    <%-- <select id="txtSolution" style="width:180px;">
                                            <option value="答案要点：">“答案要点：”</option>
                                            <option value="解题过程：">“解题过程：”</option>
                                            <option value="解析：">“解析：”</option>
                                            <option value="分析：">“分析：”</option>
                                        </select>--%>
                                </div>
                                <div>
                                    <div><span style="width: 200px;">提示：</span><input id="txtHint" class="underline" style="width: 180px; text-align: center;" value="提示：" /></div>
                                    <div class="sbTX" style="font-size: 12px; width: 180px; left: 163px;">
                                        <div class="sbTX_item" val="提示：">“提示：”</div>
                                        <div class="sbTX_item" val="提示:">“提示:”</div>
                                    </div>
                                    <%--<select id="txtHint" style="width:180px;">
                                            <option value="提示：">“提示：”</option>
                                        </select>--%>
                                </div>

                                <%--<div>
                                        <span style="width: 200px;">题设：</span><input id="txtQuestionBody" value="[0-9]．" class="underline" style="width: 120px;" /><span style="margin-left: 30px; visibility: hidden">分数 / 题：</span><input maxlength="3" class="underline" style="width: 40px; visibility: hidden" />
                                    </div>
                                    <div>
                                        <span>参考答案：</span><input id="txtReferenceAnswer" value="[A-Z]．" class="underline" style="width: 120px;" /><span style="margin-left: 30px;visibility:hidden">分数 / 题：</span><input maxlength="3" class="underline" style="width: 40px;visibility:hidden" />
                                    </div>
                                    <div>
                                        <span>正确答案：</span><input id="txtCorrectAnswer" value="答案：" class="underline" style="width: 120px;" /><span style="margin-left: 30px;visibility:hidden">分数 / 题：</span><input maxlength="3" class="underline" style="width: 40px;visibility:hidden" />
                                    </div>
                                    <div>
                                        <span>解题过程：</span><input id="txtSolution" value="答案要点：" class="underline" style="width: 120px;" /><span style="margin-left: 30px;visibility:hidden">分数 / 题：</span><input maxlength="3" class="underline" style="width: 40px;visibility:hidden" />
                                    </div>
                                    <div>
                                        <span>提示：</span><input id="txtHint" value="提示：" class="underline" style="width: 120px;" /><span style="margin-left: 30px;visibility:hidden">分数 / 题：</span><input maxlength="3" class="underline" style="width: 40px;visibility:hidden" />
                                    </div>--%>
                            </div>

                        </div>
                        <div style="line-height: 30px; margin-top: 5px; text-align: center">
                            <input type="button" value="开始识别试卷" class="but_blue_90 mg_r10" id="btnTestPreview" />
                            <input type="button" value="只识别题部分" class="but_blue_90 mg_r10" id="btnQuestionPreview" style="display:none" />
                        </div>

                    </div>
                </td>
                <td>

                    <div id="divTestEditor"></div>
                </td>

            </tr>
        </table>


    </div>
</asp:Content>
