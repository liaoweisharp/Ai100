<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ExaminerManage.aspx.cs" Inherits="Instructor_ExaminerManage" MasterPageFile="~/Master/Simple.master" Title="阅卷设置" %>

<asp:Content runat="server" ContentPlaceHolderID="head">
    <script type="text/javascript" src="../Scripts/jquery-1.7.1.min.js?version=1127"></script>
    <link href="../Plugins/showLoading/css/showLoading.css?version=1127" rel="stylesheet" />
    <script type="text/javascript" src="../Plugins/showLoading/js/jquery.showLoading.min.js?version=1127"></script>
    <link href="../Plugins/jBox/Skins/Default/jbox.css?version=1127" rel="stylesheet" />
    <script src="../Plugins/jBox/jquery.jBox-2.3.min.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/pagination/jquery.pagination.js?version=1127" type="text/javascript"></script>
    <link href="../Plugins/pagination/pagination.css?version=1127" rel="stylesheet" />

    <script type="text/javascript" src="../Scripts/comm.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/jquery.ajax.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/SimpleUser.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Array.js?version=1127"></script>

    <link href="../Styles/Pages/ExaminerManage.css?version=1127" rel="stylesheet" />
    <script src="../Scripts/Pages/ExaminerManage.js?version=1127" type="text/javascript"></script>
</asp:Content>
<asp:Content runat="server" ContentPlaceHolderID="ContentPlaceHolder1">
    <div style="background-color: #2A8C25;color: #FFFFFF;padding: 12px 35px; margin-bottom: 10px;">
        <span id="spFeatureName">阅卷设置</span>
    </div>
    <div style="border:1px solid #ccc; padding:12px; margin-bottom:35px;">
    <div class="ms_list">
        <div class="col_title">学生阅卷人：</div>
        <table id="tbStudentExaminers" style="width:100%; border:1px solid #ccc">
            <tr><th>学生</th><th>阅卷人</th></tr>
        </table>
    </div>
    <div class="ms_setting">
        <div class="col_title"><div class="f_l">学生阅卷人设置：</div><div class="f_r"><input id="btnSaveExaminerAllocation" class="button" type="button" value="保存" style=" margin-right:2px;padding:1px 10px;margin-bottom:3px;" /></div><div class="c_b"></div></div>
        <div style="width:280px;float:left; border: 1px solid #ccc;height:36px;">
            <table id="tbExaminers" class="examiner_list">
                <tr><th><div style="float:left;margin-top:6px;">阅卷人</div><input id="btnAddExaminer" class="button" type="button" value="添加..." disabled="disabled" style="float:right;padding:1px 10px;margin-bottom:3px;margin-top:3px;margin-right:3px;" /></th></tr>
            </table>
        </div>
        <div style="width:295px;float:left; margin-left:-1px;border: 1px solid #ccc;height:36px;">
            <table id="tbStudents" class="student_list">
                <tr style="height:35px;"><th align="left">学生</th><th align="right" width="50px"><input class="button" id="btnAddStudent" type="button" value="添加..." disabled="disabled" style="display:none;padding:1px 10px;margin-bottom:3px;margin-top:3px;margin-right:3px;" /></th></tr>
            </table>
        </div>
    </div>
    <div style="clear:both;"></div>
    </div>
</asp:Content>