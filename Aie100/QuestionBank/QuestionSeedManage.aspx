<%@ Page Language="C#" AutoEventWireup="true" CodeFile="QuestionSeedManage.aspx.cs"
    Inherits="QuestionBank_QuestionSeedManage" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Question Seed Manage</title>
    <link href="../Styles/lesson.css?version=1127" rel="stylesheet" type="text/css" />
    <script src="../Scripts/jquery-1.6.1.min.js?version=1127" type="text/javascript"></script>
    <script src="../Scripts/jquery.ajax.js?version=1127" type="text/javascript"></script>
    <script src="../Scripts/Pages/QuestionSeedManage.js?version=1127" type="text/javascript"></script>
    <link href="../Plugins/EmathTabs/EmathTabs.css?version=1127" rel="stylesheet" />
    <script src="../Plugins/EmathTabs/EmathTabs.js?version=1127" type="text/javascript"></script>
<%--    <script src="../Scripts/CommFunction/QuestionTemplate.js?version=1127" type="text/javascript"></script>--%>
    <script src="../Scripts/functions.js?version=1127" type="text/javascript"></script>
    <style type="text/css">
        .questionTemplate
        {
        }
        .questionTemplate .hr
        {
            margin: 5px 0px;
            height: 1px;
            display:none;
        }
        
        .questionTemplate .tdCheckBox
        {
            width: 19px;
            padding-right: 0px;
        }
        
        .questionTemplate .removeSeed
        {
            cursor:pointer;
        }
        
        .questionTemplate .tdNumber
        {
            width: 20px;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <div style="border:1px solid gray;margin-bottom:10px;padding:5px;">
            <div><input id="btnGetDiffQuestion" type="button" value="产生一个不同于其他种子生成的已存在的题" />&nbsp;<input id="btnSaveQuestionSeed" style="display:none" type="button" value="保存" /></div>
            <div id="divGetSomeSeedInfo" style="color:Blue;font-size:11px;display:none;">生成<input id="txtNumOfSeeds" type="text" value="3" style="width:15px;text-align:center;border:0px;border-bottom:1px solid gray;" />套种子<input id="btnGetSomeSeedsInfo" type="button" value="生成"/></div>
            <div id="divDiffQuestionInfo" style="margin-top:5px;">
               <div style="padding:5px;font-size:11px;color:gray;">请点击按钮产生一个种子</div>
            </div>
        </div>
        <div style="border:1px solid gray;padding:5px;">
            <div>
                已存在的种子生成的题：
            </div>
            <div id="divExistSeedQuestionInfo" style="margin-top:5px;">
                &nbsp;
            </div>
        </div>
    </div>
    </form>
</body>
</html>
