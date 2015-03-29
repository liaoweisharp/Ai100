<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ErrorQuestions.aspx.cs" Inherits="Student_ErrorQuestions" MasterPageFile="~/Master/Simple.master" Title="错题库" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <script type="text/javascript" src="../Scripts/jquery-1.7.1.min.js?version=1127"></script>
     <link href="../Plugins/lhgcalendar/_doc/common.css?version=1127" rel="stylesheet" />
    <script type="text/javascript" src="../Plugins/Date.js?version=1127"></script>
    <script type="text/javascript" src="../Plugins/lhgcalendar/lhgcalendar.min.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/jquery.ajax.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/comm.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Math.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/SimpleUser.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Array.js?version=1127"></script>
    <link href="../Plugins/showLoading/css/showLoading.css?version=1127" rel="stylesheet" />
    <link href="../Plugins/pagination/pagination.css?version=1127" rel="stylesheet" />
    <link href="../Styles/Pages/ErrorQuestions.css?version=1127" rel="stylesheet" />
    <script type="text/javascript" src="../Scripts/Question.js?version=1127"></script>
    <script src="../Plugins/pagination/jquery.pagination.js?version=1127" type="text/javascript"></script>
    <script type="text/javascript" src="../Plugins/showLoading/js/jquery.showLoading.min.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Pages/ErrorQuestionsStu.js?version=1127"></script>

</asp:Content>
<asp:Content runat="server" ContentPlaceHolderID="ContentPlaceHolder1">
    <div class="errquestions">
        <div class="toolbar">
            选择正确率：
            <select id="ddlIncorreceBase">
                <option value="0.1">小于 10%</option>
                <option value="0.2">小于 20%</option>
                <option value="0.3">小于 30%</option>
                <option value="0.4">小于 40%</option>
                <option value="0.5">小于 50%</option>
                <option value="0.6">小于 60%</option>
                <option value="0.7">小于 70%</option>
                <option value="0.8">小于 80%</option>
                <option value="0.9">小于 90%</option>
                <option value="1.0">小于 100%</option>
            </select>
            &nbsp;
            <span>开始时间：<input id="txtStartDate"  type="text" style="width: 195px;background-color:#FFF;" class="runcode" /></span>
            &nbsp;
            <span>结束时间：<input id="txtEndDate"  type="text" style="width: 195px;background-color:#FFF;" class="runcode" /></span>
            &nbsp;
            <span class="viewbydate" id="spViewByDateRange">查询</span>
            &nbsp;
            <span class="viewbydate" id="spViewTodayInfo">今天</span>
        </div>
        <div class="errquestionslist">
            <div class="pagination"></div>
            <div id="divErrQuestionList" class="errquestionsinfo">
            
            </div>
            <div class="pagination"></div>
        </div>
    </div>
</asp:Content>