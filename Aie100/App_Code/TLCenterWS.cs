using JEWS;
using JEWS.EngineClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;

/// <summary>
/// TeachingCenterWS 的摘要说明
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// 若要允许使用 ASP.NET AJAX 从脚本中调用此 Web 服务，请取消注释以下行。 
[System.Web.Script.Services.ScriptService]
public class TLCenterWS : System.Web.Services.WebService {

    public TLCenterWS () {

        //如果使用设计的组件，请取消注释以下行 
        //InitializeComponent(); 
    }

    [WebMethod(EnableSession = true,Description="返回任务信息")]
    public Assignment[] Assignment_listByStructureId(string structureId,string courseId,string sectionId, string userId, UserExtend user)
    {
        AssignmentEngine ae = new AssignmentEngine();
        string[] asmtIds= ae.assignmentIdsByStructureId(structureId, courseId, sectionId, userId, user);
        if (asmtIds != null)
        {
            Assignment[] asmts= ae.assignmentByIds(asmtIds, courseId, sectionId, userId, user);
            if (asmts != null)
            {
                return asmts;
            }
        }
       
        return null;
    }

    [WebMethod(EnableSession = true,Description = "返回任务报告信息")]
    public AssignmentReport[] AssignmentReport_listBySectionAsmtIds(string[] assignmentIds,string sectionId,UserExtend user)
    {
        return new AssignmentEngine().assignmentReportBySectionAssignmentIds(assignmentIds, sectionId, user);

    }

     [WebMethod(EnableSession = true,Description = "删除任务")]
    public bool? removeAssignment(string assignmentId, UserExtend user)
    {
        return new AssignmentEngine().removeAssignment(assignmentId, user);
    }

    [WebMethod(EnableSession = true,Description = "得到指定任务的结果")]
     public JEWS.EngineReport.TestResultWrapper[] testResultByAssignmentIds(string[] assignmentIds, string userId, JEWS.EngineReport.UserExtend user)
     {
         return new ReportEngine().testResultByAssignmentIds(assignmentIds,userId,user);
     }

    [WebMethod(EnableSession = true, Description = "学得怎么样1")]
    public JEWS.EngineReport.anyType2anyTypeMapEntry[] getNormalKnowledgeStateDetailOfStructure(string structureId, string userId, string sectionId, bool sectionFlag, JEWS.EngineReport.UserExtend userExtend)
    {
        return new ReportEngine().getNormalKnowledgeStateDetailOfStructure(structureId, userId, sectionId, sectionFlag, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "学得怎么样2")]
    public JEWS.EngineReport.anyType2anyTypeMapEntry[] getNormalKnowledgeStateDetailOfISBN(string isbn, string userId, string sectionId, bool sectionFlag, JEWS.EngineReport.UserExtend userExtend)
    {
        return new ReportEngine().getNormalKnowledgeStateDetailOfISBN(isbn, userId, sectionId, sectionFlag, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "学得怎么样3")]
    public JEWS.EngineReport.anyType2anyTypeMapEntry[] getKnowledgeStateDetailOfLoIds(string[] pointingIds, string userId, string sectionId, bool sectionFlag, JEWS.EngineReport.UserExtend userExtend)
    {
        return new ReportEngine().getKnowledgeStateDetailOfLoIds(pointingIds, userId, sectionId, sectionFlag, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "学生分布1")]
    public JEWS.EngineReport.anyType2anyTypeMapEntry[] getKnowledgeStateUsersOfStructure(string structureId, string sectionId, JEWS.EngineReport.UserExtend userExtend)
    {
        return new ReportEngine().getKnowledgeStateUsersOfStructure(structureId, sectionId, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "学生分布2")]
    public JEWS.EngineReport.anyType2anyTypeMapEntry[] getKnowledgeStateUserslOfISBN(string isbn, string sectionId, JEWS.EngineReport.UserExtend userExtend)
    {
        return new ReportEngine().getKnowledgeStateUserslOfISBN(isbn, sectionId, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "学生分布3")]
    public JEWS.EngineReport.anyType2anyTypeMapEntry[] getKnowledgeStateUsersOfLoIds(string[] pointingIds, string sectionId, JEWS.EngineReport.UserExtend userExtend)
    {
        return new ReportEngine().getKnowledgeStateUsersOfLoIds(pointingIds, sectionId, userExtend);
    }

    [WebMethod(EnableSession = true)]
    public string[] loIdsDrillByStructureId(string structureId, string userId, Boolean sectionFlag,JEWS.EngineReport.UserExtend userExtend)
    {
        return new ReportEngine().loIdsDrillByStructureId(structureId, userId, sectionFlag, userExtend);
    }

    [WebMethod(EnableSession = true)]
    public string[] loIdsDrillByIsbn(string isbn, string userId, Boolean sectionFlag, JEWS.EngineReport.UserExtend userExtend)
    {
        return new ReportEngine().loIdsDrillByIsbn(isbn, userId, sectionFlag, userExtend);
    }

    [WebMethod(EnableSession = true)]
    public string[] loIdsByTest(string testId, JEWS.EngineReport.UserExtend userExtend)
    {
        return new ReportEngine().loIdsByTest(testId, userExtend);
    }

    [WebMethod(EnableSession = true)]
    public JEWS.EngineReport.anyType2anyTypeMapEntry[] testHistoryHtByPointingLo(string userId, string pointingLoId, JEWS.EngineReport.UserExtend userExtend)
    {
        return new ReportEngine().testHistoryHtByPointingLo(userId, pointingLoId, userExtend);
    }
}
