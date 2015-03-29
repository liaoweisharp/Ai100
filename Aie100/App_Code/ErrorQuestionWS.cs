using JEWS;
using JEWS.EngineStudyGuide;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;

/// <summary>
/// ErrorQuestionWS 的摘要说明
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// 若要允许使用 ASP.NET AJAX 从脚本中调用此 Web 服务，请取消注释以下行。 
[System.Web.Script.Services.ScriptService]
public class ErrorQuestionWS : System.Web.Services.WebService {

    public ErrorQuestionWS () {

        //如果使用设计的组件，请取消注释以下行 
        //InitializeComponent(); 
    }

    [WebMethod(EnableSession = true, Description = "返回整个班的错题")]
    public TestResultQuestionReportWrapper[] questionErrorSectionBySectionId(string sectionId, double correceBase, string startDate, string endDate, UserExtend userExtend)
    {
        return new StudyGuideEngine().questionErrorSectionBySectionId(sectionId, correceBase,  startDate, endDate,userExtend);
    }


    [WebMethod(EnableSession = true, Description = "返回某个班某个节点下的错题")]
    public TestResultQuestionReportWrapper[] questionErrorSectionByStructureId(string structureId, string sectionId, double correceBase, string startDate, string endDate, UserExtend userExtend)
    {
        return new StudyGuideEngine().questionErrorSectionByStructureId(structureId, sectionId, correceBase,  startDate, endDate,userExtend);
    }


    [WebMethod(EnableSession = true, Description = "返回某个班某个知识点下的错题库")]
    public TestResultQuestionReportWrapper[] questionErrorSectionByLoIds(string[] pointingLoIds, string sectionId, double correceBase, string startDate, string endDate, UserExtend userExtend)
    {
        return new StudyGuideEngine().questionErrorSectionByLoIds(pointingLoIds, sectionId, correceBase,  startDate, endDate,userExtend);
    }
    
    //////////////////////////////////////////////////////////////////////////

    [WebMethod(EnableSession = true, Description = "返回某个学生在某个班的的错题")]
    public TestResultQuestionReportWrapper[] questionErrorUserByUserId(string userId, double correceBase, string startDate, string endDate, UserExtend userExtend)
    {
        return new StudyGuideEngine().questionErrorUserByUserId(userId, correceBase,  startDate, endDate,userExtend);
    }


    [WebMethod(EnableSession = true, Description = "返回某个学生在某个节点下的错题")]
    public TestResultQuestionReportWrapper[] questionErrorUserByStructureId(string structureId, string userId, double correceBase, string startDate, string endDate, UserExtend userExtend)
    {
        return new StudyGuideEngine().questionErrorUserByStructureId(structureId, userId, correceBase,  startDate, endDate,userExtend);
    }

    [WebMethod(EnableSession = true, Description = "返回某个学生在某个知识点下的错题库")]
    public TestResultQuestionReportWrapper[] questionErrorUserByLoIds(string[] pointingLoIds, string userId, double correceBase, string startDate, string endDate, UserExtend userExtend)
    {
        return new StudyGuideEngine().questionErrorUserByLoIds(pointingLoIds, userId, correceBase,  startDate, endDate,userExtend);
    }
}
