<%@ Page Language="C#" AutoEventWireup="true" CodeFile="QuestionManage.aspx.cs" Inherits="QuestionBank_QuestionManage" MasterPageFile="~/CMS/Master/cms1.master" %>
<%@ Register src="../UserControl/QuestionManage.ascx" tagname="QuestionManage" tagprefix="uc1" %>
<asp:Content ID="Content1" runat="server" ContentPlaceHolderID="head">
     <link href="../Styles/StyleSheet.css?version=1127" rel="stylesheet" type="text/css" />
    <link href="../Styles/font.css?version=1127" rel="stylesheet" type="text/css" />
    <link href="../Styles/Pages/QuestionManagePage.css?version=1127" rel="stylesheet" type="text/css" />
    <link href="Styles/cms.css?version=1127" rel="stylesheet" type="text/css" />
<%--    <link href="../Style/master.css?version=1127" rel="stylesheet" type="text/css" />--%>
    <script src="../Scripts/jquery-1.6.1.min.js?version=1127" type="text/javascript"></script>
    <script src="../Scripts/jquery.ajax.js?version=1127" type="text/javascript"></script>
    <script src="../Scripts/Commons.js?version=1127" type="text/javascript"></script>
    <script src="../Scripts/comm.js?version=1127" type="text/javascript"></script>
    <script src="../Scripts/Array.js?version=1127" type="text/javascript"></script>
    <script src="../Scripts/Common.js?version=1127" type="text/javascript"></script>   
    <link href="../Style/Page/TabsCss.css?version=1127" rel="stylesheet" type="text/css" />
    <script src="../Scripts/tab-view.js?version=1127" type="text/javascript"></script>
    <script src="../Scripts/functions.js?version=1127" type="text/javascript"></script>
    <%--<script src="../Scripts/JSUtil/editor.emath.js?version=1127" type="text/javascript"></script>--%>
    <link href="../Plugins/Stip/Stip.css?version=1127" rel="stylesheet" type="text/css" />
    <script src="../Plugins/Stip/Stip.js?version=1127" type="text/javascript"></script>
    <script src="../Scripts/ShowRelatedLoInfo.js?version=1127" type="text/javascript"></script>
    <script src="../Scripts/PopTip.js?version=1127" type="text/javascript"></script>
    <script src="../Scripts/String.js?version=1127" type="text/javascript"></script>
    <script src="../Scripts/ShowDetails.js?version=1127" type="text/javascript"></script>
    <link href="../Styles/lesson.css?version=1127" rel="stylesheet" type="text/css" />
    <link href="../Styles/Base.css?version=1127" rel="stylesheet" type="text/css" />
    <script src="../Plugins/colResizable-1.3.source.js?version=1127" type="text/javascript"></script>
        <script src="../Plugins/dynatree/jquery/jquery-ui.custom.min.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/dynatree/jquery/jquery.cookie.js?version=1127" type="text/javascript"></script>
        <link href="../Plugins/dynatree/src/skin/ui.dynatree.css?version=1127" rel="stylesheet" type="text/css" />
    <script src="../Plugins/dynatree/src/jquery.dynatree.min.js?version=1127" type="text/javascript"></script>
        <script src="../Plugins/EmathTabs/EmathTabs.js?version=1127" type="text/javascript"></script>
            <link href="../Plugins/pagination/pagination.css?version=1127" rel="stylesheet" type="text/css" />
                <script src="../Plugins/pagination/jquery.pagination.js?version=1127" type="text/javascript"></script>
        <script src="../Plugins/jBox/jquery.jBox-2.3.min.js?version=1127"
        type="text/javascript"></script>
    <script src="../Plugins/jBox/i18n/jquery.jBox-us-en.js?version=1127"
        type="text/javascript"></script>
    <link href="../Plugins/jBox/Skins/Default/jbox.css?version=1127" rel="stylesheet"
        type="text/css" />
    <script src="Scripts/cms_header.js?version=1127" type="text/javascript"></script>
    <script src="Scripts/ContentAudit.js?version=1127" type="text/javascript"></script>
    <script src="Scripts/ContentEditHistory.js?version=1127" type="text/javascript"></script>
    <script src="Scripts/QuestionSearch.js?version=1127" type="text/javascript"></script>
    <script src="Scripts/KnowledgePointSearch.js?version=1127" type="text/javascript"></script>
    <script src="Scripts/TestSearchDlg.js?version=1127" type="text/javascript"></script>
    <link href="../Plugins/showLoading/css/showLoading.css?version=1127" rel="stylesheet"
        type="text/css" />
    <script src="../Plugins/showLoading/js/jquery.showLoading.min.js?version=1127"
        type="text/javascript"></script>
    <%--<script src="../Scripts/PopTip.js?version=1127" type="text/javascript"></script>--%>
    <script type="text/javascript">
        $(function () {
            $("#editor_InsertLO,#inservideo").css("display", "");
            $("#editor_spUploadImage,#editor_spUploadFile").css("display", "inline-block");
        })
    </script>
</asp:Content>
<asp:Content ID="Content2" runat="server" ContentPlaceHolderID="ContentPlaceHolder">
    <asp:ScriptManager ID="sm1" runat="server">
    </asp:ScriptManager>
    <div style="padding:10px">
        <div>
            <uc1:QuestionManage ID="QuestionManage1" runat="server" />
        </div>
        
    </div>
        <div style="display:none">
        <asp:Button ID="btnRedirect" runat="server" Text="" 
            onclick="btnRedirect_Click" />
    </div>
</asp:Content>

