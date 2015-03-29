<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ErrorManageControl.ascx.cs" Inherits="ContentManagementSystem_UserControl_ErrorManageControl" %>
    <asp:ScriptManager runat="server">
        <Services>
            <asp:ServiceReference Path="~/AjaxWebService/ErrorManagementPageService.asmx" />
        </Services>
    </asp:ScriptManager>        
    <div style="text-align:right; margin-bottom:5px">
        <label style="vertical-align:middle">
            按组查询:
        </label>
        <select id="EMC_Select_IsSolved" style="vertical-align:middle" onchange="EMC_Select_IsSolved_SelectedIndexChanged()">
            <option value="0">未解决</option>
            <option value="1">已解决</option>
            <option value="2" selected="selected">全部</option>
        </select>
    </div>
    <div id="EMC_Div_Holder" style="text-align:center">
    </div>
    <div id="CME_Div_SubmitPanel" style="left:20%; top:20%; width:60%; position:fixed; display:none; z-index:100; background-color:rgb(252,233,160)">
        <div>
            <label style="margin-left:10%">
                解题过程:
            </label>
        </div>
        <div>
            <textarea id="CME_Text_Solution" rows="5" style="width:80%; height:100px; margin-left:10%"></textarea>
        </div>
        <div style="text-align:right; padding-right:10%;">
            <input type="button" value="提交" id="CME_Btn_SolutionSubmit" onclick="CME_Btn_SolutionSubmit_Click()" />&nbsp;
            <input type="button" value="取消" id="CME_Btn_SolutionCancel" onclick="CME_Btn_SolutionCancel_Click()" />
        </div>
    </div>
    <div id="CME_Div_EnableOther" style="position:fixed; display:none; top:0px;left:0px;width:100%;height:100%;background-color:Gray;filter:alpha(opacity=30);
            -moz-opacity:0.3;opacity:0.3;z-index:50"></div>
    <script type="text/javascript">
        var CME_Submit_ID = "";
        var currentStorage = [];
        function PageLoad() {
            InitCmsMenu("m_ErrorManagement");

            $get("EMC_Div_Holder").innerHTML = '<img src="../CMS/Images/ajax-loader_b.gif" />';
            ErrorManagementPageService.getAllErrorList(EMC_Fun_Onsuccess, EMC_Fun_OnFail, "getErrorList")
        }
        
        function EMC_Fun_OnFail(){}
        
        function EMC_Fun_Onsuccess(result, userContext)
        {
            if (userContext == "getErrorList")
            {
                if(result.length > 0)
                {
                    currentStorage = result;                    
                    var htmlString =new Sys.StringBuilder();
                    for(var i = 0; i < result.length; i++)
                    {
                        htmlString.append("<tr><td colspan='6'><table id='EMC_Tb_" + result[i].ID 
                        + "' style='width:100%; ' cellpadding='0' cellspacing='0'><tr id='CME_Tr_" + result[i].ID 
                        + "' style='cursor:pointer; background-color:" + (i % 2 == 0 ? "RGB(203,218,238)" : "White") 
                        + "; height:30px; vertical-align:middle;' onclick='EMC_Tr_Onclick(this)'><td style='width:35%'>" 
                        + result[i].ID + "</td><td style='width:10%'>" + (result[i].isSolved == "1" ? "是" : "否") 
                        + "</td><td style='width:10%'>" + result[i].Type + "</td><td style='width:15%'>"
                        + result[i].Create_Date.format("MM/dd/yyyy HH:mm:ss") + "</td><td style='width:15%'>" 
                        + result[i].Solve_Date.format("MM/dd/yyyy HH:mm:ss") 
                        + "</td><td style='width:15%'><input type='button' id='CME_Btn_" 
                        + result[i].ID + "' value='提交' onclick='CME_Btn_Submit_Click(this)' /></td></tr><tr><td colspan='6'><div id='CME_Div_" 
                        + result[i].ID + "' style='display:none'><table style='width:100%; ' cellpadding='0' cellspacing='0'><tr style='border:solid 1px gray;'>"
                        +"<td style='text-align:right; width:10%'>Phone:&nbsp;</td><td style='text-align:left'>" 
                        + result[i].Phone + "</td></tr><tr style='border:solid 1px gray;'><td style='text-align:right'>电子邮件:&nbsp;</td><td style='text-align:left'>" 
                        + result[i].Email + "</td></tr><tr style='border:solid 1px gray;'><td style='text-align:right'>用户编号:&nbsp;</td><td style='text-align:left'>" 
                        + result[i].User_ID + "</td></tr><tr style='; border:solid 1px gray;'><td style='text-align:right;'>课程编号:&nbsp;</td><td style='text-align:left'>" 
                        + result[i].Course_ID + "</td></tr><tr><td style='text-align:right;'>班级编号:&nbsp;</td><td style='text-align:left'>" + result[i].Section_ID 
                        + "</td></tr><tr style='vertical-align:top; border:solid 1px gray;'><td style='text-align:right;'>错误页面:&nbsp;</td>"
//                        +"<td  style='text-align:left; cursor:pointer' onmouseover='EMC_Td_OnmouseOver(this)' onmouseout='EMC_Td_OnmouseOut(this)' "
//                        +"onclick='EMC_Td_Onclick(this)'>" + result[i].Error_Page + "</td></tr><tr style='; border:solid 1px gray;'><td style='text-align:right'>Sys Detail:&nbsp;"

                        +"<td  style='text-align:left;'><a href=\""+result[i].Error_Page+"\" target=\"_blank\">" + result[i].Error_Page + "</a></td></tr><tr style='; border:solid 1px gray;'><td style='text-align:right'>系统详细信息:&nbsp;"
                        
                        +"</td><td style='text-align:left'>" + result[i].Sys_Detail + "</td></tr><tr style='; border:solid 1px gray;'><td style='text-align:right'>用户详细信息:&nbsp;"
                        +"</td><td style='text-align:left'>" + result[i].User_Detail + "</td></tr></table></div></td></tr></table></td></tr>");
                      //  htmlString += "<tr id='EMC_Tr_" + result[i].ID + "' style='background-color:" + (i % 2 == 0 ? "RGB(203,218,238)" : "White") + "' onclick='EMC_Tr_Onclick(this)'><td colspan='5'><table style='width:100%' cellspadding='0' cellspacing='0'><tr><td style='width:60%; text-align:left'>" + result[i].Error_Page.substring(result[i].Error_Page.lastIndexOf("\/")) + "</td><td style='width:10%; text-align:center'>" + result[i].Type + "</td><td style='width:10%; text-align:center'>" + (result[i].isSolved == "1" ? "Yes" : "No") + "</td><td style='width:10%; text-align:center'>" + (result[i].Create_Date.format("MM/dd/yyyy HH:mm:ss")) + "</td><td style='width:10%; text-align:center'>" + (result[i].Solve_Date.format("MM/dd/yyyy HH:mm:ss")) + "</td></tr><tr><td colspan='5'><div id='EMC_Div_" + result[i].ID + "' style='display:none'><table cellspadding='0' cellspacing='0' style='width:100%'><tr><td style='width:8%; text-align:right;'>User ID:&nbsp;</td><td style='width:92'>" + result[i].User_ID + "</td></tetr><tr><td>Course ID:&nbsp;</td><td>" + result[i].Course_ID + "</td></tr><tr><td>Section ID:&nbsp;</td><td>Phone:&nbsp;</td><td>" + result[i].Phone + "</td></tr><tr><td>Email:&nbsp;</td><td>" + result[i].Email + "</td></tr><tr><td>Sys Detail</td><td>" + result[i].Sys_Detail + "</td></tr><tr><td>User Detail</td><td>" + result[i].User_Detail + "</td></tr></table></div></td></tr></table></td></tr>";
                    }
                    $get("EMC_Div_Holder").innerHTML = "<table cellpadding='0' cellspacing='0' style='width:100%; border:solid 1px Black'><tr style='width:30%; height:30px; vertical-align:middle; background-color:RGB(116,161,213)'><td style='width:35%; text-align:center'><strong>编号</strong></td><td style='width:10%; text-align:center'><strong>是否已解决</strong></td><td style='width:10%; text-align:center'><strong>类型</strong></td><td style='width:15%'><strong>创建日期</strong></td><td style='width:15%'><strong>解决日期</strong></td><td style='width:15%'><strong>提交解题过程</strong></td></tr>" + htmlString.toString() + "</table>"
                    //$get("EMC_Div_Holder").innerHTML ="<table  style='width:98%; border: solid 1px Black' cellspadding='0' cellspacing='0'><tr style='height:30px; background-color:RGB(116,161,213);'><td style='width:60%; text-align:center'>Error Page</td><td style='width:10%; text-align:center'>Type</td><td style='width:10%; text-align:center'>Is Solved</td><td style='width:10%; text-align:center'>Create Date</td><td style='width:10%; text-align:center'>Solve Date</td></tr>" + htmlString + "</table>";
                }
                else
                {
                    currentStorage = [];
                    $get("EMC_Div_Holder").innerHTML = "<table cellpadding='0' cellspacing='0' style='width:100%; border:solid 1px Black'><tr style='width:30%; height:30px; vertical-align:middle; background-color:RGB(116,161,213)'><td style='width:35%; text-align:center'><strong>编号</strong></td><td style='width:10%; text-align:center'><strong>是否已解决</strong></td><td style='width:10%; text-align:center'><strong>类型</strong></td><td style='width:15%'><strong>创建日期</strong></td><td style='width:15%'><strong>解决日期</strong></td><td style='width:15%'><strong>提交解题过程</strong></td></tr><tr><td colspan='6'><label><strong>没有任何记录.</strong></label></td></tr></table>"
                }
            }
            else if(userContext == "submitSolution")
            {
                if(result == "1")
                {
                    alert("提交成功");
                    EMC_Select_IsSolved_SelectedIndexChanged();
                }
            }
        }
        
        function EMC_Tr_Onclick(obj)
        { 
            if(document.activeElement.tagName.toLowerCase() == "input")
            {
                return;
            }
            $get("CME_Div_" + obj.id.split("_")[2]).style.display = $get("CME_Div_" + obj.id.split("_")[2]).style.display == "none" ?  "block" : "none";
            $get("CME_Div_" + obj.id.split("_")[2]).style.backgroundColor = "rgb(252,233,160)";
            $get("EMC_Tb_" + obj.id.split("_")[2]).style.border = $get("EMC_Tb_" + obj.id.split("_")[2]).style.border == "rgb(203,218,238) 3px solid" ? "0" : "solid 3px RGB(203,218,238)"
            $get("EMC_Tb_" + obj.id.split("_")[2]).style.marginBottom = $get("EMC_Tb_" + obj.id.split("_")[2]).style.marginBottom == "5px" ? "0px" : "5px"
        }
        
        function CME_Btn_Submit_Click(obj)
        {            
            CME_Submit_ID = obj.id.split("_")[2];
            $get("CME_Text_Solution").value = "";
            $get("CME_Div_EnableOther").style.display = "block";
            $get("CME_Div_SubmitPanel").style.display = "block";            
        }
        
        function CME_Btn_SolutionCancel_Click()
        {
            $get("CME_Div_EnableOther").style.display = "none";
            $get("CME_Div_SubmitPanel").style.display = "none";
        }
        
        function CME_Btn_SolutionSubmit_Click()
        {
            for(var i = 0; i < currentStorage.length; i++)
            {
                if(currentStorage[i].ID == CME_Submit_ID)                
                {
                    currentStorage[i].Solve_Date = new Date().format("MM/dd/yyyy HH:mm:ss");
                    currentStorage[i].Solution = $get("CME_Text_Solution").value;
                    currentStorage[i].isSolved = "1";
                    ErrorManagementPageService.solutionSubmit(currentStorage[i], EMC_Fun_Onsuccess, EMC_Fun_OnFail, "submitSolution");
                    CME_Btn_SolutionCancel_Click();
                    break;
                }                
            }            
        }
        
        function EMC_Select_IsSolved_SelectedIndexChanged() {
            $get("EMC_Div_Holder").innerHTML = '<img src="../CMS/Images/ajax-loader_b.gif" />';
            if($get("EMC_Select_IsSolved").value == "0")
            {
                ErrorManagementPageService.getUnsolvedErrorList(EMC_Fun_Onsuccess, EMC_Fun_OnFail, "getErrorList");                
            }               
            else if($get("EMC_Select_IsSolved").value == "2")
            {
                ErrorManagementPageService.getAllErrorList(EMC_Fun_Onsuccess, EMC_Fun_OnFail, "getErrorList");
            }
            else
            {
                ErrorManagementPageService.getSolvedErrorList(EMC_Fun_Onsuccess, EMC_Fun_OnFail, "getErrorList");               
            }
        }
        
        function EMC_Td_OnmouseOver(obj)
        {
            obj.style.textDecoration = "underline";            
        }
        
        function EMC_Td_OnmouseOut(obj)
        {
            obj.style.textDecoration = "none";
        }
        
        function EMC_Td_Onclick(obj)
        {
            var newWindow = window.open(obj.innerHTML);            
        }
        
    </script>