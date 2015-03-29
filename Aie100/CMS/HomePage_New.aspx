<%@ Page Language="C#" AutoEventWireup="true" CodeFile="HomePage_New.aspx.cs" Inherits="CMS_HomePage_New" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link href="Styles/homepage.css?version=1127" rel="stylesheet" type="text/css" />
    <script src="../Scripts/jquery-1.4.1.min.js?version=1127" type="text/javascript"></script>
    <script src="../Scripts/jquery.ajax.js?version=1127" type="text/javascript"></script>
    <link href="../Plugins/jBox/Skins/Default/jbox.css?version=1127" rel="stylesheet" type="text/css" />
    <script src="../Plugins/jBox/jquery.jBox-2.3.min.js?version=1127" type="text/javascript"></script>
    <script src="../Plugins/jBox/i18n/jquery.jBox-us-en.js?version=1127" type="text/javascript"></script>

    <script src="../Scripts/Array.js?version=1127" type="text/javascript"></script>
    <script src="Scripts/cms_header.js?version=1127" type="text/javascript"></script>
    <script src="Scripts/HomePage_New.js?version=1127" type="text/javascript"></script>
</head>
<body>
    <form id="form1" runat="server">
    <div id="hp_title_bar">
        <div id="hp_login_img"></div>
        <div id="hp_login">
            <table border="0" cellpadding="0" cellspacing="4" style="margin-top:4px">
                <tr>
                    <td><img src="./Images/homepage/yonghu.png" style="width:18px; height:18px" /></td>
                    <td id="spUser" class="hp_t1">&nbsp;</td>
                </tr>
                <tr>
                    <td><img src="./Images/homepage/quit.png" style="width:18px; height:18px" /></td>
                    <td id="spLogout" class="hp_t1"><a id="A1" runat="server" href="~/Default.aspx?signout=1">退出</a></td>
                </tr>
            </table>
        </div>
    </div>
    <table border="0" style="margin-left:auto; margin-right:auto; margin-top:45px">
        <tr>
            <td>
                <table>
                    <tr class="feature_bg">
                        <td colspan="2">
                            <ul style="list-style-type:none; margin:0px; padding:0px">
                                <li style="padding-left:10px"><img src="./Images/homepage/1_04.png" /></li>
                                <li style="padding-left:32px;" class="title hp_t2">学院</li>
                            </ul>
                        </td>
                    </tr>
                    <tr class="institute_bg">
                        <td id="m_setInstitute" class="hp_square_disable">
                            <ul>
                                <li><img src="./Images/homepage/1_23.png" /></li>
                                <li class="title">学院</li>
                            </ul>
                        </td>
                        <td id="m_book" class="hp_square_disable">
                            <ul>
                                <li><img src="./Images/homepage/1_26.png" /></li>
                                <li class="title">书信息</li>
                            </ul>
                        </td>
                    </tr>
                    <tr class="institute_bg">
                        <td id="m_relationship" class="hp_square_disable">
                            <ul>
                                <li><img src="./Images/homepage/1_50.png" /></li>
                                <li class="title">书分配</li>
                            </ul>
                        </td>
                    </tr>
                </table>
            </td>
            <td style="width:12px">&nbsp;</td>
            <td>
                <table>
                    <tr class="feature_bg">
                        <td>
                            <ul style="list-style-type:none; margin:0px; padding:0px">
                                <li style="padding-left:15px"><img src="./Images/homepage/1_06.png" /></li>
                                <li style="padding-left:35px" class="title hp_t2" >书</li>
                            </ul>
                        </td>
                    </tr>
                    <tr class="book_bg">
                        <td id="m_BookInfo" class="hp_square_disable">
                            <ul>
                                <li><img src="./Images/homepage/1_41.png" /></li>
                                <li class="title">书信息</li>
                            </ul>
                        </td>
                    </tr>
                    <tr class="book_bg">
                        <td id="m_CopyBook" class="hp_square_disable">
                            <ul>
                                <li><img src="./Images/homepage/1_52.png" /></li>
                                <li class="title">拷贝书</li>
                            </ul>
                        </td>
                    </tr>
                </table>
            </td>
            <td style="width:12px">&nbsp;</td>
            <td>
                <table>
                    <tr class="feature_bg">
                        <td colspan="3">
                            <ul style="list-style-type:none; margin:0px; padding:0px">
                                <li style="padding-left:10px"><img src="./Images/homepage/1_08.png" /></li>
                                <li style="padding-left:30px" class="title hp_t2" >内容</li>
                            </ul>
                        </td>
                    </tr>
                    <tr class="bookcontent_bg">
                        <td id="m_BookStructure" class="hp_square_disable">
                            <ul>
                                <li><img src="./Images/homepage/1_43.png" /></li>
                                <li class="title">书结构</li>
                            </ul>
                        </td>
                        <td id="m_KnowledgeRelation" class="hp_square_disable">
                            <ul>
                                <li><img src="./Images/homepage/1_28.png" /></li>
                                <li class="title">知识点关系</li>
                            </ul>
                        </td>
                        <td id="m_StudyReference" class="hp_square_disable">
                            <ul>
                                <li><img src="./Images/homepage/1_30.png" /></li>
                                <li class="title">学习资源</li>
                            </ul>
                        </td>
                    </tr>
                    <tr class="bookcontent_bg">
                        <td id="m_QuestionManage" class="hp_square_disable">
                            <ul>
                                <li><img src="./Images/homepage/1_67.png" /></li>
                                <li class="title">题库</li>
                            </ul>
                        </td>
                        <td id="m_CustomBook" class="hp_square_disable">
                            <ul>
                                <li><img src="./Images/homepage/1_54.png" /></li>
                                <li class="title">定制书</li>
                            </ul>
                        </td>
                        <td id="m_TestManage" class="hp_square_disable">
                            <ul>
                                <li><img src="./Images/homepage/1_56.png" /></li>
                                <li class="title">试卷管理</li>
                            </ul>
                        </td>
                    </tr>
                </table>
            </td>
            <td style="width:12px">&nbsp;</td>
            <td>
                <table>
                    <tr class="feature_bg">
                        <td colspan="4">
                            <ul style="list-style-type:none; margin:0px; padding:0px">
                                <li style="padding-left:10px"><img src="./Images/homepage/1_10.png" /></li>
                                <li style="padding-left:32px" class="title hp_t2" >设置</li>
                            </ul>
                        </td>
                    </tr>
                    <tr class="setting_bg">
                        <td id="m_BookStructureType" class="hp_square_disable">
                            <ul>
                                <li><img src="./Images/homepage/1_32.png" /></li>
                                <li class="title">书结构类型</li>
                            </ul>
                        </td>
                        <td id="m_LOCategory" class="hp_square_disable">
                            <ul>
                                <li><img src="./Images/homepage/1_34.png" /></li>
                                <li class="title">知识点类型</li>
                            </ul>
                        </td>
                        <td id="m_StudyReferenceType" class="hp_square_disable">
                            <ul>
                                <li><img src="./Images/homepage/1_36.png" /></li>
                                <li class="title">学习资料类型</li>
                            </ul>
                        </td>
                        <td id="m_TestQuestionTypeManage" class="hp_square_disable">
                            <ul>
                                <li><img src="./Images/homepage/1_38.png" /></li>
                                <li class="title">试题类型</li>
                            </ul>
                        </td>
                    </tr>
                    <tr class="setting_bg">
                        <td id="m_Discipline" class="hp_square_disable">
                            <ul>
                                <li><img src="./Images/homepage/1_60.png" /></li>
                                <li class="title">学科</li>
                            </ul>
                        </td>
                 
                        <td id="m_Subject" class="hp_square_disable">
                            <ul>
                                <li><img src="./Images/homepage/1_58.png" /></li>
                                <li class="title">科目</li>
                            </ul>
                        </td>
                        <td id="m_Author" class="hp_square_disable">
                            <ul>
                                <li><img src="./Images/homepage/1_62.png" /></li>
                                <li class="title">作者</li>
                            </ul>
                        </td>
                        <td id="m_Publisher" class="hp_square_disable">
                            <ul>
                                <li><img src="./Images/homepage/1_64.png" /></li>
                                <li class="title">出版社</li>
                            </ul>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <table border="0" style="margin-left:auto; margin-right:auto; margin-top:10px">
        <tr>
            <td>
                <table>
                    <tr class="feature_bg">
                        <td colspan="2">
                            <ul style="list-style-type:none; margin:0px; padding:0px">
                                <li style="padding-left:10px"><img src="./Images/homepage/1_12.png" /></li>
                                <li style="padding-left:28px" class="title hp_t2" >反馈</li>
                            </ul>
                        </td>
                    </tr>
                    <tr class="feedback_bg">
                        <td id="m_ErrorManagement" class="hp_square_disable">
                            <ul>
                                <li><img src="./Images/homepage/1_79.png" /></li>
                                <li class="title">系统错误</li>
                            </ul>
                        </td>
                        <td id="m_ReportingErrors" class="hp_square_disable">
                            <ul>
                                <li><img src="./Images/homepage/1_81.png" /></li>
                                <li class="title">错误报告</li>
                            </ul>
                        </td>
                    </tr>
                </table>
            </td>
            <td style="width:10px">&nbsp;</td>
            <td>
                <table>
                    <tr class="feature_bg">
                        <td>
                            <ul style="list-style-type:none; margin:0px; padding:0px">
                                <li style="padding-left:11px"><img src="./Images/homepage/1_14.png" /></li>
                                <li style="padding-left:20px" class="title hp_t2" >消息管理</li>
                            </ul>
                        </td>
                    </tr>
                    <tr class="message_bg">
                        <td id="m_UserMessage" class="hp_square_disable">
                            <ul>
                                <li><img src="./Images/homepage/1_74.png" /></li>
                                <li class="title">消息</li>
                            </ul>
                        </td>
                    </tr>
                </table>
            </td>
            <td style="width:10px">&nbsp;</td>
            <td>
                <table>
                    <tr class="feature_bg">
                        <td colspan="6">
                            <ul style="list-style-type:none; margin:0px; padding:0px">
                                <li style="padding-left:10px"><img src="./Images/homepage/1_16.png" /></li>
                                <li style="padding-left:19px" class="title hp_t2" >用户管理</li>
                            </ul>
                        </td>
                    </tr>
                    <tr class="user_bg">
                        <td id="m_SysUserManagement" class="hp_square_disable">
                            <ul>
                                <li><img src="./Images/homepage/1_84.png" /></li>
                                <li class="title">系统用户</li>
                            </ul>
                        </td>
                        <td id="m_CourseUserManagement" class="hp_square_disable">
                            <ul>
                                <li><img src="./Images/homepage/1_90.png" /></li>
                                <li class="title">课程用户</li>
                            </ul>
                        </td>
                        <td id="m_UserOnlineStatus" class="hp_square_disable">
                            <ul>
                                <li><img src="./Images/homepage/1_92.png" /></li>
                                <li class="title">在线状态</li>
                            </ul>
                        </td>
                        <td id="m_PromoCodeUserManagement" class="hp_square_disable">
                            <ul>
                                <li><img src="./Images/homepage/1_94.png" /></li>
                                <li class="title">优惠码用户</li>
                            </ul>
                        </td>
                        <td id="m_TutorManagement" class="hp_square_disable">
                            <ul>
                                <li><img src="./Images/homepage/1_76.png" /></li>
                                <li class="title">辅导员管理</li>
                            </ul>
                        </td>
                        <td id="m_UserPermissionManagement" class="hp_square_disable">
                            <ul>
                                <li><img src="./Images/homepage/1_97.png" /></li>
                                <li class="title">用户权限</li>
                            </ul>
                        </td>
                    </tr>
                </table>
            </td>
            <td style="width:10px">&nbsp;</td>
            <td>
                <table>
                    <tr class="feature_bg">
                        <td style="height:75px" >
                            <ul style="list-style-type:none; margin:0px; padding:0px">
                                <li style="padding-left:17px"><img src="./Images/homepage/1_87.png" /></li>
                                <li style="padding-left:17px" class="title hp_t2" >教学大纲</li>
                            </ul>
                        </td>
                    </tr>
                    <tr class="curriculum_bg">
                        <td id="m_Curriculum" class="hp_square_disable">
                            <ul>
                                <li><img src="./Images/homepage/1_87.png" /></li>
                                <li class="title">教学大纲</li>
                            </ul>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    </form>
</body>
</html>
