using JEWS.EngineSubmissionTest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JEWS
{
    public class SubmissionEngine
    {
        private SubmissionWebService submissionWarpWS = new SubmissionWebService();
        public SubmissionEngine() { }

        ~SubmissionEngine() {
            submissionWarpWS.Dispose();
            GC.SuppressFinalize(this);
        }
        public string submitOnlineImproveTest(TestResultWrapper testResultWrapper,TestResultQuestionWrapper[] testResultQuestionWrappers, bool? analysisLoFlag, UserExtend userExtend)
        {
            return submissionWarpWS.submitOnlineImproveTest(testResultWrapper, testResultQuestionWrappers, analysisLoFlag, userExtend);
        }
        /// <summary>
        /// 在线提交question题组.
        /// </summary>
        /// <param name="testResultQuestionWrappers"></param>
        /// <param name="testerAnswerWs"></param>
        /// <param name="analysisLoFlag"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public TestResultQuestionWrapper[] submitOnlineQuestions(TestResultQuestionWrapper[] testResultQuestionWrappers,  bool? analysisLoFlag, UserExtend userExtend)
        {
            return submissionWarpWS.submitOnlineQuestions(testResultQuestionWrappers, analysisLoFlag, userExtend);
        }

        public TestResultQuestionWrapper[] submitOfflineQuestions(TestResultQuestionWrapper[] testResultQuestionWrappers, bool? analysisLoFlag, UserExtend userExtend)
        {
            return submissionWarpWS.submitOfflineQuestions(testResultQuestionWrappers, analysisLoFlag, userExtend);
        }
        /// <summary>
        /// 提交在线考试
        /// </summary>
        /// <param name="testResultWrapper"></param>
        /// <param name="testResultQuestionWrappers"></param>
        /// <param name="testerAnswers"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns> 
        public string submitOnlineTest(TestResultWrapper testResultWrapper, TestResultQuestionWrapper[] testResultQuestionWrappers, bool? isAuto, UserExtend userExtend)
        {
            return submissionWarpWS.submitOnlineTest(testResultWrapper, testResultQuestionWrappers, isAuto, userExtend);
        }

        public TestResultWrapper submitTesterAnswersResult(TestResultWrapper testResultWrapper,  TestResultQuestionWrapper[] testResultQuestionWrappers, UserExtend userExtend)
        {
            return submissionWarpWS.submitTesterAnswersResult(testResultWrapper,  testResultQuestionWrappers, userExtend);
        }



        ///// <summary>
        ///// 人工参与阅卷
        ///// </summary>
        ///// <param name="testResultWrapper"></param>
        ///// <param name="testResultQuestionWrappers"></param>
        ///// <param name="testerAnswers"></param>
        ///// <param name="userExtend"></param>
        ///// <returns></returns>
        //public TestResultWrapper submitTestGrade(TestResultWrapper testResultWrapper, TestResultQuestionWrapper[] testResultQuestionWrappers, UserExtend userExtend)
        //{
        //    return submissionWarpWS.submitTestGrade(testResultWrapper, testResultQuestionWrappers, userExtend);
        //}

        /// <summary>
        /// 人工参与阅卷(线上)
        /// </summary>
        /// <param name="testResultWrapper"></param>
        /// <param name="testResultQuestionWrappers"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public TestResultWrapper submitOnlineTestGrade(TestResultWrapper testResultWrapper, TestResultQuestionWrapper[] testResultQuestionWrappers, UserExtend userExtend)
        {
            return submissionWarpWS.submitOnlineTestGrade(testResultWrapper, testResultQuestionWrappers, userExtend);
        }
        public TestResultWrapper submitOnlineImproveTestGrade(TestResultWrapper testResultWrapper, TestResultQuestionWrapper[] testResultQuestionWrappers, bool? analysisLoFlag, UserExtend userExtend)
        {
            return submissionWarpWS.submitOnlineImproveTestGrade(testResultWrapper, testResultQuestionWrappers, analysisLoFlag, userExtend);
        }

        public TestResultWrapper saveTesterAnswersResult(TestResultWrapper testResultWrapper,  TestResultQuestionWrapper[] testResultQuestions, UserExtend userExtend)
        {
            return submissionWarpWS.saveTesterAnswersResult(testResultWrapper,testResultQuestions, userExtend);
        }
        public TestResultQuestionWrapper[] getTestResultQuestionList(string testResultId,bool? improveFlag, bool? improveReport,int? improveNum, UserExtend userExtend)
        {
            return submissionWarpWS.getTestResultQuestionList(testResultId,improveFlag,improveReport, improveNum,userExtend);
        }
        public TestResultQuestionWrapper[] getQuestionCorrectFlag(TestResultQuestionWrapper[] testResultQuestionArray, UserExtend userExtend)
        {
            return submissionWarpWS.getQuestionCorrectFlag(testResultQuestionArray, userExtend);
        }

        public TestResultQuestionWrapper[] getQuestionCorrectFlagByTestResultId(String testResultId, bool? improveFlag, bool? improveReport, int? improveNum, UserExtend userExtend)
        {
            return submissionWarpWS.getQuestionCorrectFlagByTestResultId(testResultId, improveFlag,improveReport,improveNum, userExtend);
        }

        //public bool? editTestResult(String assignmentContentId, String testId, String attemptNumber, String questionId, String score, String userId, String sectionId, UserExtend userExtend)
        //{
        //    return submissionWarpWS.editTestResult(assignmentContentId, testId, attemptNumber, questionId, score, userId, sectionId, userExtend);
        //}
        //public bool? editTestResultByResultId(String testResultId, String questionId, String score, String userId, String sectionId, UserExtend userExtend)
        //{
        //    return submissionWarpWS.editTestResultByResultId(testResultId, questionId, score, userId, sectionId, userExtend);
        //}

        public bool? updateTestResult(String testResultId, String improveScore, UserExtend userExtend)
        {
            return submissionWarpWS.updateTestResult(testResultId, improveScore, userExtend);
        }


        public String editTestResultQuestionScore(String testResultId, String questionId, String tScore, String aScore, String userId, String sectionId, UserExtend userExtend)
        {
            return submissionWarpWS.editTestResultQuestionScore(testResultId, questionId, tScore, aScore, userId, sectionId, userExtend);
        }

        /// <summary>
        /// 取消保存的考试数据
        /// </summary>
        /// <param name="testResultId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public bool? cancelSaveTestResutl(string testResultId, UserExtend userExtend)
        {
            return submissionWarpWS.cancelSaveTestResutl(testResultId, userExtend);
        }
    }
}
