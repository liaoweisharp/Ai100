<%@ Page Language="C#" AutoEventWireup="true" CodeFile="LearningCenter.aspx.cs" Inherits="Student_LearningCenter" MasterPageFile="~/Master/MasterPage.master" Title="学习中心" %>
<asp:Content ContentPlaceHolderID="head" runat="server">
    <link href="../Styles/Pages/TLCenter.css?version=1127" rel="stylesheet" />
    <link href="../Plugins/showLoading/css/showLoading.css?version=1127" rel="stylesheet" />
    <link href="../Styles/util.css?version=1127" rel="stylesheet" />    
    <script type="text/javascript" src="../Scripts/jquery-1.7.1.min.js?version=1127"></script>     
    <script type="text/javascript" src="../Scripts/jquery.ajax.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/SimpleUser.js?version=1127"></script>   
    <script type="text/javascript" src="../Scripts/comm.js?version=1127"></script>
    <script type="text/javascript" src="../Plugins/showLoading/js/jquery.showLoading.min.js?version=1127"></script>
    <script src="../Plugins/dynatree/jquery/jquery-ui.custom.min.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/dynatree/jquery/jquery.cookie.js?version=1127" type="text/javascript"></script>
    <link href="../Plugins/dynatree/src/skin/ui.dynatree.css?version=1127" rel="stylesheet" type="text/css" />
    <script src="../Plugins/dynatree/src/jquery.dynatree.min.js?version=1127" type="text/javascript"></script>
    <script type="text/javascript" src="../Scripts/Array.js?version=1127"></script>
    <script type="text/javascript" src="../Scripts/Math.js?version=1127"></script>    
    <script type="text/javascript" src="../Plugins/jBox/jquery.jBox-2.3.min.js?version=1127"></script>
    <link href="../Plugins/jBox/Skins/Default/jbox.css?version=1127" rel="stylesheet" /> 
    <script type="text/javascript" src="../Scripts/Pages/LearningCenter.js?version=1127"></script>
    <link href="../Plugins/pagination/pagination.css?version=1127" rel="stylesheet" />
<%--    <script src="../Plugins/numtocn.js?version=1127" type="text/javascript"></script>--%>
    <script src="../Plugins/pagination/jquery.pagination.js?version=1127" type="text/javascript"></script>
    
    <script src="../Plugins/highcharts/jquery.highcharts.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/highcharts/theme1.js?version=1127" type="text/javascript"></script>
</asp:Content>
<asp:Content ContentPlaceHolderID="ContentPlaceHolder1" runat="server">

        <div class="tlcenter">
        <div class="toolbar">
           <span id="spCourseName">...</span><%-- <img alt="" src="../Images/triangle.png" style="height:16px;vertical-align:middle" />--%>
        </div>
        
        <div class="tlcenterinfo">
            <div class="f_l tree_area w_tree">
                
                <div id="divTreeView">
                    <center>
                        <img style="margin:20px;" alt="" src="../Images/ajax-loader_b.gif" />
                    </center>
                </div>
            </div>
            <div class="f_r asmt_area w_asmt">
                <div id="divTjAssignmentInfo" style="margin:5px 0 20px;border:1px solid rgb(174,174,174);line-height:30px;display:none">
                    <div style="padding: 5px; font-weight: bold; background-color: rgb(41, 115, 149); color: rgb(255, 255, 255);">
                        <img src="../Images/icon_light01.png" />推荐任务</div>
                    <div style="padding:5px;float:left"><img src="../Images/recommened.png"></div>
                    <div style="padding:5px 45px;float:left">
                        <div class="asmtname" style="font-weight:bold"></div>
                        <div class="asmtcj" style="color: rgb(52, 102, 49);"></div>
                        <div class="asmtztxl"></div>
                    </div>
                    <div class="c_b"></div>
                </div>
                <div id="divAssignmentList">
                    <div id="divStructureStatus" style="margin:5px 0px;background-color:rgb(169, 171, 147);padding:8px 10px;display:none;">
                        <div class="f_l" id="divStructureName" ></div>
                        <div class="f_r" id="divKnowledgeStatus"></div>
                        <div class="c_b"></div>
                    </div>
                    <div id="divCorreceBase" style="display:none;line-height: 30px; text-align: left; padding-left: 10px; background: none repeat scroll 0px 0px rgb(150, 175, 162);margin-bottom:5px;"><span>目标测试正确率：<span id="spOCorrectBaseContent"></span></span><span id="spPCorrectBase" style="margin-left:30px;display:none">辅助测试正确率：<span id="spPCorrectBaseContent"></span></span></div>
                    <div id="divAssignmentListInfo">
                        

                        <div id="LC_divTabs" style="display:none">
                        </div>
                            
                        <div id="divAssignmentDetails" style="border:1px solid rgb(214,214,214);padding:5px;">
                            <div class="img_loading">
                                    <center>
                                    <img style="margin:20px;" alt="" src="../Images/ajax-loader_b.gif" />
                                </center>
                            </div>
                              
                        </div>
                        
                    </div>
                </div>
                <div id="divLearningInfo" class="linfo">
                   <%-- <table cellspacing="8" cellpadding="15">
                        <tr>
                            <td style="background-color:rgb(47,151,138)">
                                <div class="litem">
                                    <div class="ltitle">学习与训练</div>
                                    <div><img alt="" src="../Images/resize_png_new1_96.png" /></div>
                                </div>
                            </td>
                            <td style="background-color:rgb(112,144,208)">
                                <div class="litem">
                                    <div class="ltitle">错题回顾</div>
                                    <div><img alt="" src="../Images/erqreview.png" /></div>
                                </div>
                            </td>
                            <td style="background-color:rgb(218,188,204)">
                                <div class="litem">
                                    <div class="ltitle">学得怎么样</div>
                                    <div><img alt="" src="../Images/piechart1.png" /></div>
                                </div>
                            </td>
                            <td style="background-color:rgb(229,134,134)">
                                <div class="litem">
                                    <div class="ltitle">学习历史</div>
                                    <div><img alt="" src="../Images/linechart.png" /></div>
                                </div>
                            </td>
                        </tr>
                    </table>--%>
                </div>
               
                <%--<div id="divStudyContent" style="display:none">
                    <div class="img_loading">
                        <center>
                            <img style="margin:20px;" alt="" src="../Images/ajax-loader_b.gif" />
                        </center>
                    </div>
                </div>--%>
            </div>
            <div class="c_b"></div>
        </div>
    </div>
 
</asp:Content>