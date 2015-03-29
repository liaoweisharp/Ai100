<%@ Page Language="C#" AutoEventWireup="true" CodeFile="UserVisitInfo.aspx.cs" Inherits="UserVisitInfo" 
MasterPageFile="~/CMS/Master/cms.master" %>

<asp:Content ID="Content1" runat="server" ContentPlaceHolderID="head">
    <link href="../Styles/Ico.css?version=1127" rel="stylesheet" type="text/css" />
    <link href="../Styles/Base.css?version=1127" rel="stylesheet" type="text/css" />
    <link href="../Styles/tabcontent.css?version=1127" rel="stylesheet" type="text/css" />
    <link href="../Styles/login2.css?version=1127" rel="stylesheet" type="text/css" />    
</asp:Content>
<asp:Content ID="Content2" runat="server" ContentPlaceHolderID="ContentPlaceHolder">
    <script type="text/javascript">
        function PageLoad() {
            InitCmsMenu("m_UserOnlineStatus");
        }
    </script>
    <div>
        Time duration: <asp:TextBox ID="txtDurationTime" runat="server" style="width:50px"></asp:TextBox>
        <asp:Button ID="btnOk" runat="server" Text="set" CssClass="but_blue_60 mg_r5" onclick="btnOk_Click" />
    </div>
    <div style="text-align:left; margin-top:3px"><%=GetUserVisitInfo()%></div>
</asp:Content>