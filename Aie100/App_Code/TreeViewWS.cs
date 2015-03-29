using JEWS.EngineReport;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;

/// <summary>
/// TreeViewWS 的摘要说明
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// 若要允许使用 ASP.NET AJAX 从脚本中调用此 Web 服务，请取消注释以下行。 
[System.Web.Script.Services.ScriptService]
public class TreeViewWS : System.Web.Services.WebService {

    public TreeViewWS () {

        //如果使用设计的组件，请取消注释以下行 
        //InitializeComponent(); 
    }

    [WebMethod(EnableSession = true,Description="得到树形菜单所需数据")]
    public object[] getTreeViewData(string isbn, bool isLazy, bool sampleQuestionFlag,string userId,UserExtend user)
    {
        return new JEWS.TreeViewManage().getTreeViewData(isbn, isLazy, sampleQuestionFlag,userId, user);
    }

    [WebMethod(EnableSession = true,Description = "树形菜单最后一层展开得到知识点")]
    public KnowledgeGradesWrapper[] getKnowledgeGradesOfStructureList(string structureId, bool sampleQuestionFlag,string userId, UserExtend user)
    {
        return new JEWS.ReportEngine().getKnowledgeGradesOfStructureList(new string[]{structureId}, sampleQuestionFlag,userId, user);
    }
    
}
