<%@ Page Language="C#" AutoEventWireup="true" CodeFile="UserManage.aspx.cs" Inherits="CMS_UserManage" MasterPageFile="~/CMS/Master/cms.master"%>

<asp:Content ID="Content1" runat="server" ContentPlaceHolderID="head">
   <%--<script src="../Scripts/jquery-1.4.1.min.js?version=1127" type="text/javascript"></script>--%>
    <%--<script src="../Scripts/jquery.ajax.js?version=1127" type="text/javascript"></script>--%>
    <script src="../Plugins/pagination/jquery.pagination.js?version=1127" type="text/javascript"></script>
    <script src="../Scripts/Pages/CMS/UserManage.js?version=1127" type="text/javascript"></script>
    <script src="../Scripts/comm.js?version=1127" type="text/javascript"></script>
    <script src="../Scripts/String.js?version=1127" type="text/javascript"></script>
    <%--<script src="../Scripts/String.js?version=1127" type="text/javascript"></script>--%>
    <%--<script src="../Scripts/Array.js?version=1127" type="text/javascript"></script>--%>
    <script src="../Scripts/Dialog.js?version=1127" type="text/javascript"></script>
    <%--<link href="../Plugins/jBox/Skins/Default/jbox.css?version=1127" rel="stylesheet" type="text/css" />--%>
    <%--<script src="../Plugins/jBox/jquery.jBox-2.3.min.js?version=1127" type="text/javascript"></script>--%>
    <%--<script src="../Plugins/jBox/i18n/jquery.jBox-us-en.js?version=1127" type="text/javascript"></script>--%>
    <script src="../Scripts/JSUtil/datepicker.emath.js?version=1127" type="text/javascript"></script>
    <link href="../Styles/Dialog.css?version=1127" rel="stylesheet" type="text/css" />
    <link href="../Styles/Pages/UserManage.css?version=1127" rel="stylesheet" type="text/css" />
    <link href="../Plugins/pagination/pagination.css?version=1127" rel="stylesheet" type="text/css" />
    <style type="text/css">
        #Text3
        {
            width: 97px;
        }
        #Text4
        {
            width: 102px;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" runat="server" ContentPlaceHolderID="ContentPlaceHolder">
    
     <script type="text/javascript">
         function PageLoad() {
             InitCmsMenu("m_CourseUserManagement");
         }
    </script>
    <div class="conttabs_2">
    <ul >
    <li><a id="tab_1" href="#" rel="content1" class="selected" onclick="click_Tabs_1()">常用查询</a></li>
    <li><a id="tab_2" href="#" rel="content2" onclick="click_Tabs_2()">高级查询</a></li>
    </ul>
    </div>
    <div class="div_Content">
    <div id="div_CommonFilter">
        <div class="loading"><image src="../Images/ajax-loader_b.gif"></image></div>
        <div style="width:100%;">
                <fieldset style="width:100%;">
        <legend>用户信息</legend>
            <table border="0">
                <tr>
                    <td> <input id="ck_UserId_Comm" name="User_Comm" type="checkbox" style="display:none;" /> <label for="ck_UserId_Comm">用户主键:</label> </td>
                    <td><input id="txt_UserId_Comm" type="text" /></td>
                    <td><input id="ck_UserName_Comm" name="User_Comm" type="checkbox" style="display:none;"/> <label for="ck_UserName_Comm">用户名:</label> </td>
                    <td><input id="txt_UserName_Comm" type="text" /></td>
                    <td><input id="ck_Email_Comm" name="User_Comm" type="checkbox" style="display:none;"/> <label for="ck_Email_Comm">邮件:</label> </td>
                    <td> <input id="txt_Email_Comm" type="text" /></td>
                </tr>
                <tr>
                    <td><input id="ck_LastName_Comm" name="User_Comm" type="checkbox" style="display:none;"/> <label for="ck_LastName_Comm">姓名:</label> </td>
                    <td><input id="txt_LastName_Comm" type="text"/></td>
                    <td><input id="ck_FirstName_Comm" name="User_Comm" type="checkbox" style="display:none;"/> <label for="ck_FirstName_Comm" style="display:none">First Name:</label> </td>
                    <td><input id="txt_FirstName_Comm" type="text" style="display:none"/></td>
                    <td></td>
                    <td></td>
                </tr>
            </table>
           
            
           
           
            
            
        </fieldset>
        </div>
        <br />
        <div id="dropdownlists" style="margin-top:10px;">
        <div class="ddlClass">
            <select id="ddl_Institutes"  style=" width:300px;">
                <option value="">请选择学院...</option>
            </select>
        </div>
        <div class="ddlClass">
            <select id="ddl_Course" style=" width:300px;">
                <option value="">请选择课程...</option>
            </select>
        </div>
        <div class="ddlClass">
            <select id="ddl_Section"  style=" width:300px;">
                <option value="">请选择班级...</option>
                
            </select>
        </div>
        </div>
        <div class="other_Comm">
     
        <br />
            <fieldset>
        <legend>其它</legend>
           
            <input id="ckb_Payment_Comm" name="User" type="checkbox" /> <label for="ckb_Payment_Comm">付费情况:</label>&nbsp;&nbsp;<input id="rd_Paid_Comm" type="radio" name="payment_Comm" disabled="disabled"/><label for="rd_Paid_Comm">已付费</label>&nbsp;&nbsp;<input id="rd_Unpaid_Comm" type="radio" name="payment_Comm" disabled="disabled"/><label for="rd_Unpaid_Comm">未付费</label>
            <br />
            <input id="ckb_PaymentMode_Comm" type="checkbox" /> <label for="ckb_PaymentMode_Comm">付费模式:</label>&nbsp;&nbsp;<input id="rd_PaidMode_Online_Comm" type="radio" name="paymentMode_Comm" disabled="disabled"/><label for="rd_PaidMode_Online_Comm">网上</label>&nbsp;&nbsp;<input id="rd_PaidMode_RegisterCode_Comm" type="radio" name="paymentMode_Comm" disabled="disabled"/><label for="rd_PaidMode_RegisterCode_Comm">付费卡</label>&nbsp;&nbsp;<input id="rd_PaidMode_Mail_Comm" type="radio" name="paymentMode_Comm" disabled="disabled"/><label for="rd_PaidMode_Mail_Comm">邮寄</label>&nbsp;&nbsp;<input id="rd_PaidMode_Null_Comm" type="radio" name="paymentMode_Comm" disabled="disabled"/><label for="rd_PaidMode_Null_Comm">[null]</label>
            <br />
            <input id="ckb_Role_Comm" type="checkbox" /> <label for="ckb_Role_Comm">角色:</label>&nbsp;&nbsp;<input id="rd_RoleStudent_Comm" type="radio" name="role_Comm" disabled="disabled"/><label for="rd_RoleStudent_Comm">学生</label>&nbsp;&nbsp;<input id="rd_RoleInstructor_Comm" type="radio" name="role_Comm" disabled="disabled"/><label for="rd_RoleInstructor_Comm">教师</label>
            <br />
            <input id="ckb_Status_Comm" type="checkbox" /> <label for="ckb_Status_Comm">状态:</label>&nbsp;&nbsp;<input id="rd_Enable_Comm" type="radio" name="status_Comm" disabled="disabled"/><label for="rd_Enable_Comm">启用</label>&nbsp;&nbsp;<input id="rd_Disable_Comm" type="radio" name="status_Comm" disabled="disabled"/><label for="rd_Disable_Comm">禁用</label>
            
        </fieldset>
        </div>
        <br />
        <div style="clear:both;">
            <input id="bt_Query_Comm" type="button" value="查询" class="but_blue_60" />
        </div>
    </div>
    <div id="div_CompundFilter">
    <div style="clear:both;">
        <fieldset>
        <legend>用户信息</legend>
           
            <input id="ck_UserId" name="User" type="checkbox" /> <label for="ck_UserId">用户主键</label>&nbsp
            <input id="ck_UserName" name="User" type="checkbox" /> <label for="ck_UserName">用户名</label>&nbsp
            <input id="ck_LastName" name="User" type="checkbox" /> <label for="ck_LastName">姓名</label>
            <br /><br />
            值: <input id="txt_UserValue" type="text" disabled="disabled" />
        </fieldset>
        <fieldset>
        <legend>班级信息</legend>
           
            <input id="ck_SecionCode" name="Section" type="checkbox" /> <label for="ck_SecionCode">班级注册码</label>&nbsp
            <input id="ck_SectionName" name="Section" type="checkbox" /> <label for="ck_SectionName">班级名称</label>&nbsp
            
            <br /><br />
            值: <input id="txt_SectionValue" type="text" disabled="disabled" />
        </fieldset>
         <fieldset>
        <legend>日期</legend>
           
            <input id="ck_StartDate" name="Date" type="checkbox" /> <label for="ck_StartDate">开始日期</label> <input id="txt_StartDate" type="text" readonly="readonly" /><input class="DateJscalendar" type="image" src="../Images/date.png" onclick="return showCalendar('txt_StartDate', '%m/%d/%Y %H:%M:%S', '24', true);" />
           <br /><br /> <input id="ck_EndDate" name="Date" type="checkbox" /> <label for="ck_EndDate">结束日期</label> &nbsp; <input id="txt_EndDate" type="text" readonly="readonly" /><input class="DateJscalendar" type="image" src="../Images/date.png" onclick="return showCalendar('txt_EndDate', '%m/%d/%Y %H:%M:%S', '24', true);" />
            
            
          
        </fieldset> 
          <fieldset>
        <legend>其它</legend>
           
            <input id="ckb_Payment_Other" type="checkbox" /> <label for="ckb_Payment_Other">付费情况:</label>&nbsp;&nbsp;<input id="rd_Paid_Other" type="radio" name="payment_Other" disabled="disabled"/><label for="rd_Paid_Other">已付费</label>&nbsp;&nbsp;<input id="rd_Unpaid_Other" type="radio" name="payment_Other" disabled="disabled"/><label for="rd_Unpaid_Other">未付费</label>
            <br />
            <input id="ckb_PaymentMode_Other" type="checkbox" /> <label for="ckb_PaymentMode_Other">付费模式:</label>&nbsp;&nbsp;<input id="rd_PaidMode_Online_Other" type="radio" name="paymentMode_Other" disabled="disabled"/><label for="rd_PaidMode_Online_Other">在线</label>&nbsp;&nbsp;<input id="rd_PaidMode_RegisterCode_Other" type="radio" name="paymentMode_Other" disabled="disabled"/><label for="rd_PaidMode_RegisterCode_Other">付费码</label>&nbsp;&nbsp;<input id="rd_PaidMode_Mail_Other" type="radio" name="paymentMode_Other" disabled="disabled"/><label for="rd_PaidMode_Mail_Other">邮寄</label>&nbsp;&nbsp;<input id="rd_PaidMode_Null_Other" type="radio" name="paymentMode_Other" disabled="disabled"/><label for="rd_PaidMode_Null_Other">[null]</label>
            <br />
            <input id="ckb_Role_Other"  type="checkbox" /> <label for="ckb_Role_Other">角色:</label>&nbsp;&nbsp;<input id="rd_RoleStudent_Other" type="radio" name="role_Other" disabled="disabled"/><label for="rd_RoleStudent_Other">学生</label>&nbsp;&nbsp;<input id="rd_RoleInstructor_Other" type="radio" name="role_Other" disabled="disabled"/><label for="rd_RoleInstructor_Other">教师</label>
            <br />
            <input id="ckb_Status_Other" type="checkbox" /> <label for="ckb_Status_Other">状态:</label>&nbsp;&nbsp;<input id="rd_Enable_Other" type="radio" name="status_Other" disabled="disabled"/><label for="rd_Enable_Other">启用</label>&nbsp;&nbsp;<input id="rd_Disable_Other" type="radio" name="status_Other" disabled="disabled"/><label for="rd_Disable_Other">禁用</label>
            
        </fieldset>
        </div>
        <br style="clear:both;" />
        <br />
        <input id="bt_Query" type="button" value="查询" style=" clear:both;" class="but_blue_60" />
        <div class="filterWarn">
        <div style=" font-weight:bold; ">查询条件:</div>
        <div id="filterWarn_Content"></div>
        </div>
    </div>
    </div>
    <div>
        <div style="display:none; text-align:right; margin:4px;">
           条件:  <select id="ddl_Filter"  onchange="ddlFilter_Click()">
                        <option value="">全部</option>
                        <option value="paid">付费学生</option>
                        <option value="unpaid">未付费学生</option>
                        <option value="student">角色: 学生</option>
                        <option value="instructor">角色: 教师</option>
                        <option value="enable">状态: 启用</option>
                        <option value="disable">状态: 禁用</option>
                    </select>
        </div>
        <div id="div_Pagination"></div>
        <div id="div_detail" >
        </div>
    </div>

</asp:Content>