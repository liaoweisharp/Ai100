using JEWS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;

/// <summary>
/// DrillWS 的摘要说明
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// 若要允许使用 ASP.NET AJAX 从脚本中调用此 Web 服务，请取消注释以下行。 
[System.Web.Script.Services.ScriptService]
public class DrillWS : System.Web.Services.WebService {

    public DrillWS () {

        //如果使用设计的组件，请取消注释以下行 
        //InitializeComponent(); 
    }

    [WebMethod(EnableSession = true, Description = "根据知识点集合得到")]
    public JEWS.EngineReport.KnowledgeGradesWrapper[] knowledgeGradesOfLoList(string[] loIds, bool sampleQuestionFlag, string userId,JEWS.EngineReport.UserExtend userExtend)
    {
        return new ReportEngine().knowledgeGradesOfLoList(loIds, sampleQuestionFlag,userId, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "得到一个知识点隔得最近一组先行知识点")]
    public JEWS.EngineReport.KnowledgeGradesWrapper[] knowledgeGradesOfSource(string loId, bool sampleQuestionFlag,string userId, JEWS.EngineReport.UserExtend userExtend)
    {
        return new ReportEngine().knowledgeGradesOfSource(loId, sampleQuestionFlag,userId, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "得到最佳学习路径的知识点id集合")]
    public string[] loIdsLearningPath(string loId, string userId, JEWS.EngineReport.UserExtend userExtend)
    {
        return new ReportEngine().loIdsLearningPath(loId, userId, userExtend);
    }



    [WebMethod(EnableSession = true, Description = "最佳学习路径")]
    public JEWS.EngineReport.KnowledgeGradesWrapper[] getBestLeaningPath(string loId, string userId, bool sampleQuestionFlag, JEWS.EngineReport.UserExtend userExtend)
    {
        string[] loids = new ReportEngine().loIdsLearningPath(loId, userId, userExtend);
        if (loids != null && loids.Length > 0)
        {
            return new ReportEngine().knowledgeGradesOfLoList(loids, sampleQuestionFlag,userId, userExtend);
        }
        return null;
    }

    [WebMethod(EnableSession = true, Description = "得到指定知识点下的学习资料")]
    public JEWS.EngineStudyGuide.StudyReferenceWrapper[] getStudyReferenceAllListForLoIds(string[] loIds, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new StudyGuideEngine().getStudyReferenceAllListForLoIds(loIds, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "得到该知识点下的例题")]
    public JEWS.EngineStudyGuide.QuestionWrapper[] getQuestionSampleByLoId(string loId, string state, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new StudyGuideEngine().getQuestionSampleByLoId(loId, state, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "得到一组知识点所涉及到的所有题")]
    public JEWS.EngineStudyGuide.QuestionWrapper[] getQuestionSampleByLos(string[] loIds, string num, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new StudyGuideEngine().getQuestionSampleByLos(loIds, num, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "根据question得到知识点状况")]
    public JEWS.EngineReport.KnowledgeGradesWrapper[] knowledgeGradesByQuestionId(string questionId, bool sampleQuestionFlag,string userId, JEWS.EngineReport.UserExtend userExtend)
    {
        return new ReportEngine().knowledgeGradesByQuestionId(questionId, sampleQuestionFlag,userId, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "在线提交question题组")]
    public JEWS.EngineSubmissionTest.TestResultQuestionWrapper[] submitOnlineQuestions(JEWS.EngineSubmissionTest.TestResultQuestionWrapper[] testResultQuestionWrappers, bool analysisLoFlag, JEWS.EngineSubmissionTest.UserExtend userExtend)
    {
        return new SubmissionEngine().submitOnlineQuestions(testResultQuestionWrappers, analysisLoFlag, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "离线提交question题组")]
    public JEWS.EngineSubmissionTest.TestResultQuestionWrapper[] submitOfflineQuestions(JEWS.EngineSubmissionTest.TestResultQuestionWrapper[] testResultQuestionWrappers, bool analysisLoFlag, JEWS.EngineSubmissionTest.UserExtend userExtend)
    {
        return new SubmissionEngine().submitOfflineQuestions(testResultQuestionWrappers, analysisLoFlag, userExtend);
    }
}
