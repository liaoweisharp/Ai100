using JEWS.EngineReport;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JEWS
{
    public class ReportEngine
    {
        private ReportWrapperWebService reportWarpWS = new ReportWrapperWebService();
        public ReportEngine() { }

        ~ReportEngine() {
            reportWarpWS.Dispose();
            GC.SuppressFinalize(this);
        }

        /// <summary>
        /// 根据question得到知识点状况
        /// </summary>
        /// <param name="questionId"></param>
        /// <param name="sampleQuestionFlag"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public KnowledgeGradesWrapper[] knowledgeGradesByQuestionId(string questionId, bool sampleQuestionFlag,string userId, UserExtend userExtend)
        {
            return reportWarpWS.knowledgeGradesByQuestionId(questionId, sampleQuestionFlag,userId, userExtend);
        }

        /// <summary>
        /// 根据知识点集合得到
        /// </summary>
        /// <param name="loIds"></param>
        /// <param name="sampleQuestionFlag"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public KnowledgeGradesWrapper[] knowledgeGradesOfLoList(string[] loIds, bool sampleQuestionFlag,string userId, UserExtend userExtend)
        {
            return reportWarpWS.knowledgeGradesOfLoList(loIds, sampleQuestionFlag,userId, userExtend);
        }

        /// <summary>
        /// 得到一个知识点的最佳学习路径
        /// </summary>
        /// <param name="loId"></param>
        /// <param name="userId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public string[] loIdsLearningPath(string loId, string userId, UserExtend userExtend)
        {
            return reportWarpWS.loIdsLearningPath(loId, userId, userExtend);
        }
        /// <summary>
        /// 得到一个知识点隔得最近一组先行知识点
        /// </summary>
        /// <param name="loId"></param>
        /// <param name="sampleQuestionFlag"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public KnowledgeGradesWrapper[] knowledgeGradesOfSource(string loId, bool sampleQuestionFlag, string userId,UserExtend userExtend)
        {
            return reportWarpWS.knowledgeGradesOfSource(loId, sampleQuestionFlag,userId, userExtend);
        }

        
        public KnowledgeGradesWrapper[] getNormalKnowledgeGradesOfLoList(string[] loIds, bool? sampleQuestionFlag,string userId, UserExtend userExtend)
        {
            return reportWarpWS.knowledgeGradesOfLoList(loIds, sampleQuestionFlag,userId,userExtend);
        }


        /// <summary>
        /// 根据用户得到该用户在一个section里面的所有考试记录
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public TestResultWrapper[] testResulNormalByUser(string userId, UserExtend userExtend)
        {
            return reportWarpWS.testResulNormalByUser(userId, userExtend);
        }

        /// <summary>
        /// 得到某个用户的某个assignmentContent的考试记录
        /// </summary>
        /// <param name="assignmentContentId"></param>
        /// <param name="userId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public TestResultWrapper testResulNormalByUserAssignment(string assignmentContentId, string userId, UserExtend userExtend){
            return reportWarpWS.testResulNormalByUserAssignment(assignmentContentId, userId, userExtend);
        }

        /// <summary>
        /// 根据testResultId得到TestResult
        /// </summary>
        /// <param name="testResultId"></param>
        /// <param name="userId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public TestResultWrapper testResultById(string testResultId, string userId, UserExtend userExtend)
        {
            return reportWarpWS.testResultById(testResultId, userId, userExtend);
        }

        /// <summary>
        /// 得到某个人的一组assignment的考试记录
        /// </summary>
        /// <param name="assignmentContentIds"></param>
        /// <param name="userId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public TestResultWrapper[] testResultByAssignmentIds(string[] assignmentContentIds, string userId, UserExtend userExtend)
        {
            return reportWarpWS.testResultByAssignmentIds(assignmentContentIds, userId, userExtend);
        }


        /// <summary>
        /// 得到某个班的所有考试记录
        /// </summary>
        /// <param name="sectionId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public TestResultWrapper[] testResulNormalBySection(string sectionId, UserExtend userExtend)
        {
            return reportWarpWS.testResulNormalBySection(sectionId, userExtend);
        }

        /// <summary>
        /// 得到某个班的某个assignment的所有考试记录
        /// </summary>
        /// <param name="assignmentContentId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public TestResultWrapper[] testResulNormalBySectionAssignment(string assignmentContentId, UserExtend userExtend)
        {
            return reportWarpWS.testResulNormalBySectionAssignment(assignmentContentId, userExtend);
        }

        /// <summary>
        /// 得到某个班的某个assignmnet的某个人所阅读的对像集合的考试记录
        /// </summary>
        /// <param name="assignmentId"></param>
        /// <param name="userId"></param>
        /// <param name="sectionId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
       public TestResultWrapper[] testResultOtherByAssignment(string assignmentId, string userId, string sectionId, UserExtend userExtend)
        {
            return reportWarpWS.testResultOtherByAssignment(assignmentId, userId, sectionId, userExtend);
        }

        /// <summary>
        /// 得到某个班的某个assignmentContent的所有已阅卷的考试记录
        /// </summary>
        /// <param name="assignmentContentId"></param>
        /// <param name="sectionId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public TestResultWrapper[] testResulByReporSectionAssignment(string assignmentId, string sectionId, UserExtend userExtend)
        {
            return reportWarpWS.testResulByReporSectionAssignment(assignmentId, sectionId, userExtend);
        }
         /// <summary>
        /// 得到某个班的某个assignmentContent的所有需要阅卷的考试记录
         /// </summary>
         /// <param name="assignmentContentId"></param>
         /// <param name="sectionId"></param>
         /// <param name="userExtend"></param>
         /// <returns></returns>
        public TestResultWrapper[] testResulByMarkingSectionAssignment(string assignmentId, string sectionId, UserExtend userExtend)
        {
            return reportWarpWS.testResulByMarkingSectionAssignment(assignmentId, sectionId, userExtend);
        }

        /// <summary>
        /// 得到某个班的某个assignment的需要某个人阅卷的考试记录。
        /// </summary>
        /// <param name="assignmentId"></param>
        /// <param name="userId"></param>
        /// <param name="sectionId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public TestResultWrapper[] testResultOtherMarkingByAssignment(string assignmentId, string userId, string sectionId, UserExtend userExtend) {
            return reportWarpWS.testResultOtherMarkingByAssignment(assignmentId, userId, sectionId, userExtend);
        }

        /// <summary>
        /// 得到某个班的某个assignment的某个人可以看的报告
        /// </summary>
        /// <param name="assignmentId"></param>
        /// <param name="userId"></param>
        /// <param name="sectionId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public TestResultWrapper[] testResultOtherReportByAssignment(string assignmentId, string userId, string sectionId, UserExtend userExtend)
        {
            return reportWarpWS.testResultOtherReportByAssignment(assignmentId, userId, sectionId, userExtend);
        }

        /// <summary>
        /// 得到考试的最后一次,有可能是保存，有可能是提交了
        /// </summary>
        /// <param name="testId"></param>
        /// <param name="assignmentId"></param>
        /// <param name="submissionType"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public TestResultWrapper testResultByAssignment(string testId, string assignmentId, string submissionType, UserExtend userExtend)
        {
            return reportWarpWS.testResultByAssignment(testId, assignmentId, submissionType, userExtend);
        }

        public KnowledgeGradesWrapper[] getKnowledgeGradesOfStructureList(string[] bookStructureIds,bool sampleQuestionFlag,string userId, UserExtend user)
        {
            return reportWarpWS.knowledgeGradesOfStructureList(bookStructureIds,sampleQuestionFlag,userId, user);
        }

        public KnowledgeGradesWrapper[] knowledgeGradesNoKpOfISBN(string isbn,bool? sampleQuestionFlag,string userId, UserExtend userExtend)
        {
            return reportWarpWS.knowledgeGradesNoKpOfISBN(isbn,sampleQuestionFlag,userId, userExtend);
        }

        public KnowledgeGradesWrapper[] knowledgeGradesOfISBN(string isbn, bool? sampleQuestionFlag,string userId, UserExtend userExtend)
        {
            return reportWarpWS.knowledgeGradesOfISBN(isbn, sampleQuestionFlag,userId, userExtend);
        }


        public EfficiencyEvaluationWrapper[] getEfficiencyEvaluations(string sectionId, UserExtend userExtend)
        {
            return reportWarpWS.getEfficiencyEvaluations(sectionId, userExtend);
        }

        ///// <summary>
        ///// 得到某个班的某个assignment的某部份人需要阅卷的考试记录。学生
        ///// </summary>
        ///// <param name="assignmentId"></param>
        ///// <param name="userId"></param>
        ///// <param name="sectionId"></param>
        ///// <param name="userExtend"></param>
        ///// <returns></returns>
        //public TestResultWrapper[] testResultOtherMarkingByAssignment(string assignmentId, string userId, string sectionId, UserExtend userExtend)
        //{
        //    return reportWarpWS.testResultOtherMarkingByAssignment(assignmentId, userId, sectionId, userExtend);
        //}

        //非知识点的学习与训练
        public string[] loIdsDrillByStructureId(string structureId, string userId, bool sectionFlag, UserExtend userExtend)
        {
            return reportWarpWS.loIdsDrillByStructureId(structureId,userId,sectionFlag,userExtend);
        }

        public string[] loIdsDrillByIsbn(string isbn, string userId, bool sectionFlag, UserExtend userExtend)
        {
            return reportWarpWS.loIdsDrillByIsbn(isbn,userId,sectionFlag,userExtend);
        }
        public string[] loIdsByTest(String testId, UserExtend userExtend)
        {
            return reportWarpWS.loIdsByTest(testId, userExtend);

        }
        //学得怎么样
        public anyType2anyTypeMapEntry[] getNormalKnowledgeStateDetailOfStructure(string structureId, string userId, string sectionId, bool sectionFlag, UserExtend userExtend)
        {
            return reportWarpWS.getNormalKnowledgeStateDetailOfStructure(structureId, userId, sectionId, sectionFlag, userExtend);
        }

        public anyType2anyTypeMapEntry[] getNormalKnowledgeStateDetailOfISBN(string isbn, string userId, string sectionId, bool sectionFlag, UserExtend userExtend)
        {
            return reportWarpWS.getNormalKnowledgeStateDetailOfISBN(isbn, userId, sectionId, sectionFlag, userExtend);
        }

        public anyType2anyTypeMapEntry[] getKnowledgeStateDetailOfTests(string[] testIds, string userId, string sectionId, bool sectionFlag, UserExtend userExtend)
        {
            return reportWarpWS.getKnowledgeStateDetailOfTests(testIds, userId, sectionId, sectionFlag, userExtend);
        }

        public anyType2anyTypeMapEntry[] getKnowledgeStateDetailOfLoIds(string[] pointingIds, string userId, string sectionId, bool sectionFlag, UserExtend userExtend)
        {
            return reportWarpWS.getKnowledgeStateDetailOfLoIds(pointingIds, userId, sectionId, sectionFlag, userExtend);
        }


        //学生分布
        public anyType2anyTypeMapEntry[] getKnowledgeStateUsersOfStructure(string structureId, string sectionId, UserExtend userExtend)
        {
            return reportWarpWS.getKnowledgeStateUsersOfStructure(structureId, sectionId, userExtend);
        }

        public anyType2anyTypeMapEntry[] getKnowledgeStateUserslOfISBN(string isbn, string sectionId, UserExtend userExtend)
        {
            return reportWarpWS.getKnowledgeStateUserslOfISBN(isbn, sectionId, userExtend);
        }

        public anyType2anyTypeMapEntry[] getKnowledgeStateUsersOfTests(string[] testIds, string sectionId, UserExtend userExtend)
        {
            return reportWarpWS.getKnowledgeStateUsersOfTests(testIds, sectionId, userExtend);
        }

        public anyType2anyTypeMapEntry[] getKnowledgeStateUsersOfLoIds(string[] pointingIds, string sectionId, UserExtend userExtend)
        {
            return reportWarpWS.getKnowledgeStateUsersOfLoIds(pointingIds, sectionId, userExtend);
        }

        //学生学习知识点的历史记录。
        public anyType2anyTypeMapEntry[] testHistoryHtByPointingLo(string userId, string pointingLoId, UserExtend userExtend)
        {
            return reportWarpWS.testHistoryHtByPointingLo(userId, pointingLoId, userExtend);
        }

    }
}
