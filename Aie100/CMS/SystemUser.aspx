<%@ Page Language="C#" AutoEventWireup="true" CodeFile="SystemUser.aspx.cs" Inherits="CMS_SystemUser" MasterPageFile="~/CMS/Master/cms.master" %>
<asp:Content ID="Content1" runat="server" ContentPlaceHolderID="head">
</asp:Content>
<asp:Content ID="Content2" runat="server" ContentPlaceHolderID="ContentPlaceHolder">
    <%--<script src="../Scripts/jquery-1.4.1.min.js?version=1127" type="text/javascript"></script>--%>
    <script src="../Plugins/pagination/jquery.pagination.js?version=1127" type="text/javascript"></script>
    <%--<script src="../Scripts/jquery.ajax.js?version=1127" type="text/javascript"></script>--%>
    <script src="../Scripts/Pages/CMS/SystemUser.js?version=1127" type="text/javascript"></script>
    <script src="../Scripts/comm.js?version=1127" type="text/javascript"></script>
    <%--<script src="../Scripts/String.js?version=1127" type="text/javascript"></script>--%>
    <script src="../Scripts/JSUtil/datepicker.emath.js?version=1127" type="text/javascript"></script>
    <link href="../Styles/Dialog.css?version=1127" rel="stylesheet" type="text/css" />
    <link href="../Styles/Pages/SystemUser.css?version=1127" rel="stylesheet" type="text/css" />
    <link href="../Plugins/pagination/pagination.css?version=1127" rel="stylesheet" type="text/css" />
    <script type="text/javascript">
        function PageLoad() {
            InitCmsMenu("m_SysUserManagement");
        }
    </script>
    <div>
        <table width="90%">
            <tr>
                <td width="40">
                    <input id="cbx_Pass" type="checkbox" checked="checked" /></td>
                <td >
                   审核状态: <input id="rb_NoPass" name="isPass" type="radio" />&nbsp;<label for="rb_NoPass">不通过</label>&nbsp;&nbsp;&nbsp;<input id="rb_Pass" name="isPass" type="radio"/>&nbsp;<label for="rb_Pass">通过</label></td>
                
            </tr>
              <tr>
                <td width="40"><input id="cbx_Email" type="checkbox" checked="checked" style="display:none;"/></td>
                <td >
                    </td>
                
            </tr>
            <tr>
                <td></td>
                <td>
                    <table width="95%" border="0">
                        <tr>
                            <td>
                                电子邮件:
                            </td>
                            <td>
                                <input id="txt_Email" type="text"  />
                            </td>
                            <td>
                            用户名: 
                            </td>
                            <td>
                            <input id="txt_UserName" type="text"  />
                            </td>
                        </tr>
                         <tr>
                            <td>
                                姓名: 
                            </td>
                            <td>
                                <input id="txt_Lname" type="text"  />
                            </td>
                             <td style="visibility:hidden">
                                名: 
                            </td>
                            <td style="visibility:hidden">
                                <input id="txt_Fname" type="text"  />
                            </td>

                        </tr>
                       
                    </table>
                </td>
            </tr>
               <tr style="display:none;">
                <td width="40"><input id="cbx_UserName" type="checkbox"  checked="checked" style="display:none;"  /></td>
                <td >
                    </td>
                
            </tr>
            
              <tr style="display:none;">
                <td width="40"><input id="cbx_Lname" type="checkbox"  checked="checked" style="display:none;"  /></td>
                <td >
                    </td>
                
            </tr>
              <tr style="display:none;">
                <td width="40"><input id="cbx_Fname" type="checkbox"   checked="checked" style="display:none;"/></td>
                <td >
                    </td>
                
            </tr>
               <tr>
                <td width="40"><input id="cbx_Date" type="checkbox"   checked="checked" /></td>
                <td ><table width="95%" border="0">
                    <tr>
                            <td>开始日期:</td>
                            <td> <input id="txt_StartDate" type="text"  readonly="readonly" /><input class="DateJscalendar" type="image" src="../Images/date.png" onclick="return showCalendar('txt_StartDate', '%m/%d/%Y %H:%M:%S', '24', true);" /></td>
                            <td>结束日期:</td>
                            <td><input id="txt_EndDate" type="text" readonly="readonly" /><input class="DateJscalendar" type="image" src="../Images/date.png" onclick="return showCalendar('txt_EndDate', '%m/%d/%Y %H:%M:%S', '24', true);" /></td>
                        </tr>
                </table> </td>
                
            </tr>
         
               <tr>
                <td width="40"><input id="cbx_Institute" type="checkbox" checked="checked" style="display:none;" /></td>
                <td >所属学院:
                    <select id="ddl_Institute">
                        <option value="-1">请选择学院</option>
                    </select>
                </td>
                
            </tr>
          
               <tr>
                <td width="40"><input id="cbx_Role" type="checkbox" checked="checked"  /></td>
                 <td >
                  用户角色: <input id="rd_Student" name="role" type="radio" />&nbsp;<label for="rd_Student">学生</label>&nbsp;&nbsp;&nbsp;<input id="rd_Instructor" name="role" type="radio"/>&nbsp;<label for="rd_Instructor">教师</label>
                </td>
                
            </tr>
        </table>
    </div>
    <div style=" padding:5px;">
        <input id="bt_Query" type="button" value="查询" style=" clear:both;" class="but_blue_60" />
    </div>
     <div  style="display:none;">
        <div style="display:none;">Query Where:</div>
        <div id="filterWarn_Content" style="display:none;"></div>
        </div>
    <div id="div_Pagination"></div>
    <div id="div_Content">
    
    </div>
</asp:Content>