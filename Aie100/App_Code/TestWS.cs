using JEWS;
using JEWS.EngineStudyGuide;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Collections;

/// <summary>
/// TestWS 的摘要说明
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// 若要允许使用 ASP.NET AJAX 从脚本中调用此 Web 服务，请取消注释以下行。 
[System.Web.Script.Services.ScriptService]
public class TestWS : System.Web.Services.WebService {

    public TestWS () {

        //如果使用设计的组件，请取消注释以下行 
        //InitializeComponent(); 
    }

    [WebMethod(Description = "根据考试情况得到题")]
    public QuestionWrapper[] Question_listByTestId(string testId, string testResultId,string userId, UserExtend user)
    {
        return new StudyGuideEngine().getQuestionForTestId(testId, testResultId,userId, user);
    }

    //[WebMethod(Description = "得到考试题型")]
    //public TestQuestionTypeWrapper[] TestQuestionType_listByBookId(string bookId,UserExtend user) {
    //    return new CmsEngine().getTestQuestionTypeBookList(bookId, user);
    //}

    //[WebMethod(Description = "得到题的参考答案")]
    //public ReferenceAnswersWrapper[] ReferenceAnswer_listByQuestionIdAndSeedId(anyType2anyTypeMapEntry[] ht,UserExtend user) {
    //    return new StudyGuideEngine().getReferenceAnswersListByQidQsIds(ht, user);
    //}
    [WebMethod(Description = "阅卷和查看报告")]
    public JEWS.EngineSubmissionTest.TestResultQuestionWrapper[] TestResultQuestion_listByTestResultId(string testResultId, bool? improveFlag, bool? improveReport, int? improveNum, JEWS.EngineSubmissionTest.UserExtend user)
    {
        return new SubmissionEngine().getQuestionCorrectFlagByTestResultId(testResultId, improveFlag,improveReport,improveNum, user);
    }

    [WebMethod(Description = "提高阅卷")] 
    public JEWS.EngineSubmissionTest.TestResultQuestionWrapper[] getQuestionCorrectFlag(JEWS.EngineSubmissionTest.TestResultQuestionWrapper[] testResultQuestionArray, JEWS.EngineSubmissionTest.UserExtend userExtend)
    {
        return new SubmissionEngine().getQuestionCorrectFlag(testResultQuestionArray, userExtend);
    }
    //这个里面已把testResultQuestion返回了？。
    [WebMethod(Description = "根据考试详细信息，type：0“考试”，1“报告”或“阅卷”，2“提高-训练”,3“提高-报告”或“提高-阅卷”（改善一个content的分数的题组）")]
    public Dictionary<string, object> QuestionInfo_getTestDetail(string type, string bookId, string assingmentId, string submissionType, string testResultId, string userId, string courseId, string sectionId, bool? improveReport, int? improveNum, UserExtend user)
    {
        JEWS.EngineSubmissionTest.UserExtend estUser = TOOLS.ObjectUtil.CopyObjectPoperty<JEWS.EngineSubmissionTest.UserExtend, UserExtend>(user);
        JEWS.EngineReport.UserExtend erUser= TOOLS.ObjectUtil.CopyObjectPoperty<JEWS.EngineReport.UserExtend, UserExtend>(user);
        Dictionary<string, object> dic = new Dictionary<string, object>();
        if (type == "1" || type=="3")
        {
            JEWS.EngineClient.Users[] userExs = new UserEngine().usersByIds(new string[] { userId }, null);
            if (userExs != null && userExs.Count() != 0)
            {
                dic.Add("username", userExs[0].fullName);
            }
        }

        TestQuestionTypeWrapper[] tqtw= new CmsEngine().getTestQuestionTypeBookList(bookId, user);
        if (tqtw != null)
        {
            dic.Add("testQuestionTypes",tqtw);
        }
        JEWS.EngineClient.Assignment[] asmts = new AssignmentEngine().assignmentByIds(new string[] { assingmentId }, courseId, sectionId, userId, TOOLS.ObjectUtil.CopyObjectPoperty<JEWS.EngineClient.UserExtend, UserExtend>(user));
        string testId = null;
        if (asmts != null && asmts.Count() > 0)
        {
            testId = asmts[0].testId;
            dic.Add("markingModel", asmts[0].markingModel);
            dic.Add("testId",testId);
            dic.Add("testTitle", asmts[0].title);
            dic.Add("testTime", asmts[0].testTime);
            dic.Add("upsetQuestion",asmts[0].upsetQuestion);
            dic.Add("shortTestTime", asmts[0].shorTestTime);
            dic.Add("dateControl",asmts[0].dateControl);
        }
        JEWS.EngineReport.TestResultWrapper testResultWrapper = null;
        if (testResultId != null && testResultId.Trim() != "")
        {
             testResultWrapper = new ReportEngine().testResultById(testResultId, userId, erUser);
        }
        else
        {
             testResultWrapper = new ReportEngine().testResultByAssignment(testId, assingmentId, submissionType, erUser);
        }
        if (testResultWrapper!=null) {
            dic.Add("testResultWrapper", testResultWrapper);
        }
        if (type == "0")
        {
            if (asmts != null && asmts[0].dateControl == 1)//在指定时间内必须完成
            {
                DateTime endTime = asmts[0].endDate;
                DateTime currentTime = DateTime.Now;
                int? spentTime = 0;
                if (asmts[0].testTime == null) { asmts[0].testTime = 0; }
                if (endTime > currentTime)//考试还未结束
                {
                    TimeSpan tsUseTime = endTime.Subtract(currentTime).Duration();//当前时间与考试结束时间的时间间隔
                    int totalSeconds = (int)Math.Round(tsUseTime.TotalSeconds);
                    if (asmts[0].testTime * 60 > totalSeconds)//考试时间已经过去了一部分
                    {
                        spentTime = asmts[0].testTime * 60 - totalSeconds;//还剩下的考试时间
                    }
                    else//考试结束时间还未到，但考试已经开始
                    {
                        if (testResultWrapper != null)//若是保存了，使用考试结果中的用时
                        {
                            spentTime = Int32.Parse(testResultWrapper.useTime);
                        }
                        else//没有保存，考试试卷也还未到，就没有用去时间
                        {
                            spentTime = 0;
                        }
                    }
                }
                else//考试已经结束
                {
                    spentTime = asmts[0].testTime * 60;
                }
                dic.Add("spentTime", spentTime);
            }
            else
            {
                dic.Add("spentTime", (testResultWrapper != null ? Int32.Parse(testResultWrapper.useTime) : 0));
            }
        }
        QuestionWrapper[] questionWrapperArray = (type != "2" && type != "3") ? new StudyGuideEngine().getQuestionForTestId(testId, testResultWrapper != null ? testResultWrapper.id : null,userId, user) : new StudyGuideEngine().questionErrorDrillForTestResultId(testResultWrapper != null ? testResultWrapper.id : null, testId, improveReport, improveNum, user);
        if (questionWrapperArray != null && questionWrapperArray.Length>0)
        {
            dic.Add("questions", questionWrapperArray);
            dic.Add("questionCount", questionWrapperArray.Length);
            anyType2anyTypeMapEntry[] ht = new anyType2anyTypeMapEntry[questionWrapperArray.Length];
            float testScore = 0f;
            for (int i = 0; i < questionWrapperArray.Length; i++)
            {
                anyType2anyTypeMapEntry kv = new anyType2anyTypeMapEntry();
                kv.key = questionWrapperArray[i].id;
                kv.value = questionWrapperArray[i].qpvSeedId;
                ht[i] = kv;
                if (questionWrapperArray[i].id == questionWrapperArray[i].parentId)
                {
                    testScore += Convert.ToSingle(questionWrapperArray[i].score);
                }
            }
            dic.Add("testScore", testScore);
            ReferenceAnswersWrapper[] raws = new StudyGuideEngine().getReferenceAnswersListByQidQsIds(ht,user);
            dic.Add("referenceAnswers", raws);

            if (testResultWrapper != null)
            {
                //这里有问题吧，如果是报告应该不是加1  jason...这个在阅卷的时候是不是不需要返回了，因为上面两个接口（返回对错的接口已把这些值返回了哟）
                //int _improveNum = 0;
                
                //_improveNum=(type != "2" && type != "3") ? 0 : Convert.ToInt32(testResultWrapper.improveNum)+1;
                //这里加了两个接口，不过可以看一下，这个应该只是在保存了考试之后，再继续做考试有用吧，因为保存之后再做需要晓得已做的题的答案，而阅卷的时候好像不需要了吧？这个需要在js里面判断从哪里取答案的问题？
                //而在这里只需要判断是不是考试或者提高中，否则都不需要从这里得到答题者答案。
                //new SubmissionEngine().getQuestionCorrectFlagByTestResultId(testResultId, improveFlag,improveReport,improveNum, user)
                JEWS.EngineSubmissionTest.TestResultQuestionWrapper[] trqs = (type == "1" || type == "3") ? new SubmissionEngine().getQuestionCorrectFlagByTestResultId(testResultWrapper.id, (type == "3" ? true : false), improveReport, improveNum, estUser) :
                    new SubmissionEngine().getTestResultQuestionList(testResultWrapper.id, (type != "2" && type != "3") ? false : true, improveReport, improveNum, estUser);
                if (trqs != null)
                {
                    dic.Add("testerAnswers", trqs);
                }
              
            }

           

        }
        return dic;
    }

    [WebMethod(Description = "得到某个班的某个assignment的某部份人需要阅卷的考试记录。学生")]
    public JEWS.EngineReport.TestResultWrapper[] testResultOtherMarkingByAssignment(string assignmentId, string userId, string sectionId, JEWS.EngineReport.UserExtend userExtend)
    {
        return new ReportEngine().testResultOtherMarkingByAssignment(assignmentId, userId, sectionId, userExtend);
    }

    [WebMethod(Description = "得到某个班的某个assignment的某个人可以看的报告。学生")]
    public JEWS.EngineReport.TestResultWrapper[] testResultOtherReportByAssignment(String assignmentId, String userId, String sectionId, JEWS.EngineReport.UserExtend userExtend)
    {
        return new ReportEngine().testResultOtherReportByAssignment(assignmentId, userId, sectionId, userExtend);
    }

    [WebMethod(Description = "得到某个班的某个assignment的所有考试记录。教师")]
    public JEWS.EngineReport.TestResultWrapper[] testResulNormalBySectionAssignment(string assignmentId, JEWS.EngineReport.UserExtend userExtend)
    {
        return new ReportEngine().testResulNormalBySectionAssignment(assignmentId, userExtend);
    }

    [WebMethod(Description = "得到某个班的某个assignmentContent的所有已阅卷的考试记录")]
    public JEWS.EngineReport.TestResultWrapper[] testResulByReporSectionAssignment(string assignmentId, string sectionId, JEWS.EngineReport.UserExtend userExtend)
    {
        return new ReportEngine().testResulByReporSectionAssignment(assignmentId, sectionId, userExtend);
    }

    [WebMethod(Description = "得到某个班的某个assignmentContent的所有需要阅卷的考试记录")]
    public JEWS.EngineReport.TestResultWrapper[] testResulByMarkingSectionAssignment(String assignmentId, String sectionId, JEWS.EngineReport.UserExtend userExtend)
    {
        return new ReportEngine().testResulByMarkingSectionAssignment(assignmentId, sectionId, userExtend);
    }

    [WebMethod(Description = "保存考生答案")]
    public JEWS.EngineSubmissionTest.TestResultWrapper TestResult_saveTesterAnswersResult(JEWS.EngineSubmissionTest.TestResultWrapper testResultWrapper, JEWS.EngineSubmissionTest.TestResultQuestionWrapper[] testResultQuestions, JEWS.EngineSubmissionTest.UserExtend user)
    {
        return new SubmissionEngine().saveTesterAnswersResult(testResultWrapper,testResultQuestions,user);
    }

    [WebMethod(Description = "提交提高的考试")]
    public string submitOnlineImproveTest(JEWS.EngineSubmissionTest.TestResultWrapper testResultWrapper, JEWS.EngineSubmissionTest.TestResultQuestionWrapper[] testResultQuestionWrappers,  bool? analysisLoFlag, JEWS.EngineSubmissionTest.UserExtend user)
    {
        return new SubmissionEngine().submitOnlineImproveTest(testResultWrapper, testResultQuestionWrappers, analysisLoFlag, user);
    }

    [WebMethod(Description = "提交在线考试(自动阅卷)")]
    public string submitOnlineTest(JEWS.EngineSubmissionTest.TestResultWrapper testResultWrapper, JEWS.EngineSubmissionTest.TestResultQuestionWrapper[] testResultQuestionWrappers,   bool? isAuto, JEWS.EngineSubmissionTest.UserExtend user)
    {
       return new SubmissionEngine().submitOnlineTest(testResultWrapper, testResultQuestionWrappers, isAuto, user);
    }

    [WebMethod(Description="人工参与阅卷(线上)" ,EnableSession=true)]
    public JEWS.EngineSubmissionTest.TestResultWrapper submitOnlineTestGrade(JEWS.EngineSubmissionTest.TestResultWrapper testResultWrapper, JEWS.EngineSubmissionTest.TestResultQuestionWrapper[] testResultQuestionWrappers, JEWS.EngineSubmissionTest.UserExtend user)
    {
        return new SubmissionEngine().submitOnlineTestGrade(testResultWrapper, testResultQuestionWrappers,user);
    }

    [WebMethod(Description="提高考试的阅卷" ,EnableSession=true)]
    public JEWS.EngineSubmissionTest.TestResultWrapper submitOnlineImproveTestGrade(JEWS.EngineSubmissionTest.TestResultWrapper testResultWrapper, JEWS.EngineSubmissionTest.TestResultQuestionWrapper[] testResultQuestionWrappers,bool? analysisLoFlag, JEWS.EngineSubmissionTest.UserExtend user)
    {
        return new SubmissionEngine().submitOnlineImproveTestGrade(testResultWrapper, testResultQuestionWrappers,analysisLoFlag, user);
    }
    

    [WebMethod(Description = "提交在线考试")]
    public JEWS.EngineSubmissionTest.TestResultWrapper submitTesterAnswersResult(JEWS.EngineSubmissionTest.TestResultWrapper testResultWrapper, JEWS.EngineSubmissionTest.TestResultQuestionWrapper[] testResultQuestionWrappers, JEWS.EngineSubmissionTest.UserExtend user)
    {
        return new SubmissionEngine().submitTesterAnswersResult(testResultWrapper, testResultQuestionWrappers, user);
    }


    //[WebMethod(Description = "根据testResultId得到TesterAnswersWrapper")]
    //public TesterAnswersWrapper[] TesterAnswers_listByTestResultId(string testResultId, JEWS.EngineSubmissionTest.UserExtend user)
    //{
    //    return new StudyGuideEngine().getTesterAnswers(testResultId);
    //}

    //[WebMethod(Description = " 得到考试的最后一次,有可能是保存，有可能是提交了")]
    //public TestResultWrapper TestResult_getTestResult(string testId, string assignmentContentId, string submissionType,UserExtend user)
    //{ 
    //    return new StudyGuideEngine().getTestResult(testId, assignmentContentId, submissionType, user);
    //}

    [WebMethod(Description = "根据书的结构的structureId返回知识点 包含状态", EnableSession = true)]
    public JEWS.EngineReport.KnowledgeGradesWrapper[] getKnowledgeGradesOfStructureList(string bookStructureId, bool sampleQuestionFlag,string userId,JEWS.EngineReport.UserExtend userExtend)
    {
        return new ReportEngine().getKnowledgeGradesOfStructureList(new string[] { bookStructureId }, sampleQuestionFlag,userId, userExtend);
    }

    [WebMethod(Description = "返回Question对应的答案", EnableSession = true)]
    public ReferenceAnswersWrapper[] getReferenceAnswersList(string questionId, string qpvSeedId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new StudyGuideEngine().getReferenceAnswersList(questionId, qpvSeedId, userExtend);
    }

    [WebMethod(Description = "根据loId返回该LO的所有Question", EnableSession = true)]
    public QuestionWrapper[] getQuestionOfLoList0(string loId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new StudyGuideEngine().getQuestionNoStudentOfLo(new String[] { loId }, userExtend);
    }

    [WebMethod(Description = "教师得到某个任务中所有题的正确率", EnableSession = true)]
    public TestResultQuestionReportWrapper[] getQuestionCorrectPercentage(string assignmentId, string testId, string sectionId, UserExtend userExtend)
    {
        return new StudyGuideEngine().getQuestionCorrectPercentage(assignmentId, testId, sectionId, userExtend);
    }

    [WebMethod(Description = "看每个题的答题者答案", EnableSession = true)]
    public TestResultQuestionWrapper[] getTesterAnswersByTest(string assignmentId, string testId, string[] questionIds, string sectionId, UserExtend userExtend)
    {
        return new StudyGuideEngine().getTesterAnswersByTest(assignmentId, testId, questionIds, sectionId, userExtend);
    }

    [WebMethod(Description = "根据questionId数组反映对应的question", EnableSession = true)]
    public QuestionWrapper[] getQuestionByQuestionIds(string[] questionIds, JEWS.EngineStudyGuide.UserExtend simpleUser)
    {
        return new StudyGuideEngine().getQuestions(questionIds, simpleUser);
    }

    [WebMethod(Description = "根据loId返回该LO的所有Question")]
    public QuestionWrapper[] getQuestionOfLoList(string loId, JEWS.EngineStudyGuide.UserExtend simpleUser)
    {
        return new StudyGuideEngine().getQuestionNoStudentOfLo(new String[] { loId }, simpleUser);
    }

    [WebMethod(Description = "返回任务整体报告数据")]
    public IList getAssignIntegratedData(string assignmentId, string testId, string sectionId,string userId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return JEWS.TestManage.getAssignIntegratedData(assignmentId, testId, sectionId,userId, userExtend);
    }

    [WebMethod(Description = "答案正确率统计")]
    public anyType2anyTypeMapEntry[] referenceAnswersBaseByTest(string assignmentId, string testId, string[] questionIds, string sectionId, UserExtend userExtend)
    {
        return new StudyGuideEngine().referenceAnswersBaseByTest(assignmentId, testId, questionIds, sectionId, userExtend);
    }

    [WebMethod(Description = "修改题分数")]
    public string editTestResultQuestionScore(string testResultId, string questionId, string tScore, string aScore, string userId, string sectionId,JEWS.EngineSubmissionTest.UserExtend userExtend)
    {
        return new SubmissionEngine().editTestResultQuestionScore(testResultId, questionId, tScore, aScore, userId, sectionId, userExtend);
    }
}

