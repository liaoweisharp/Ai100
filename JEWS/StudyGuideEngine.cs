using System;
using System.Collections.Generic;
//using System.Linq;
using System.Text;
using JEWS.EngineStudyGuide;
using System.Collections;

namespace JEWS
{
    [Serializable]
    public class StudyGuideEngine 
    {
        private StudyGuideWrapperWebService studyGuideWarpWS = new StudyGuideWrapperWebService();

        public StudyGuideEngine()
        { 
        }
        ~StudyGuideEngine()
        {
            studyGuideWarpWS.Dispose();
            GC.SuppressFinalize(this);
        }

        public BookWrapper[] getBookListByBookIds(string[] bookIds, UserExtend userExtend)
        {
            return studyGuideWarpWS.getBookListByBookIds(bookIds, userExtend);
        }
        public BookWrapper getBookById(string bookId)
        {
            return studyGuideWarpWS.getBookById(bookId);
        }

        public BookWrapper getBookByISBN(string isbn)
        {
            return studyGuideWarpWS.getBook(isbn);
        }

        public QuestionWrapper[] getQuestions(string[] questionIds, UserExtend userExtend)
        {
            return studyGuideWarpWS.getQuestions(questionIds, userExtend);
        }

        public ReferenceAnswersWrapper[] getReferenceAnswersList(string questionId, string qpvSeedId, UserExtend userExtend)
        {
            ReferenceAnswersWrapper[] list = studyGuideWarpWS.getReferenceAnswersList(questionId, qpvSeedId, userExtend);
            if (list == null)
                return new ReferenceAnswersWrapper[0];
            else
                return list;
        }

        public QuestionWrapper getQuestionEdit(string questionID, UserExtend in1)
        {
            return studyGuideWarpWS.getQuestionEdit(questionID, in1);
        }

        public StudyReferenceWrapper getStudyReference(string id, UserExtend userExtend)
        {
            return studyGuideWarpWS.getStudyReference(id, userExtend);
        }

        public BookStructureTypeWrapper[] manageBookStructureType(BookStructureTypeWrapper[] bsts, string isbn, UserExtend userExtend)
        {
            return studyGuideWarpWS.manageBookStructureType(bsts, isbn, userExtend);
        }

        public StudyReferenceWrapper[] getStudyReferenceByIdsList(string[] ids, UserExtend userExtend)
        {
            return studyGuideWarpWS.getStudyReferenceByIdsList(ids, userExtend);
        }
        public BookStructureTypeWrapper[] getBookStructureTypeTrueList(string isbn, UserExtend userExtend)
        {
            return studyGuideWarpWS.getBookStructureTypeTrueList(isbn, userExtend);
        }

        public bool saveQuestionAlgorithmValueContent(QuestionAlgorithmValueWrapper[] qavs, string contentId, UserExtend userExtend)
        {
            throw new NotImplementedException();
            // return (bool)studyGuideWarpWS.saveQuestionAlgorithmValueContent(qavs, contentId, userExtend);
        }

        public bool removeQuestionAlgorithmValueContent(string[] contentIds, UserExtend userExtend)
        {
            return (bool)studyGuideWarpWS.removeQuestionAlgorithmValueContent(contentIds, userExtend);
        }


     

       

       

        public ReinforcementAssignmentWrapper getReinforcementAssignmentByTestResult(string testResultId, string sectionId, string userId, UserExtend userExtend)
        {
            return studyGuideWarpWS.getReinforcementAssignmentByTestResult(testResultId, sectionId, userId, userExtend);
        }

        public ReinforcementAssignmentWrapper getReinforcementAssignment(string userId, string sectionId, UserExtend userExtend)
        {
            return studyGuideWarpWS.getReinforcementAssignment(userId, sectionId, userExtend);
        }
        public QuestionWrapper[] getQuestionReinforRecent(string userId, string sectionId, string systemId, UserExtend userExtend)
        {
            QuestionWrapper[] list = studyGuideWarpWS.getQuestionReinforRecent(userId, sectionId, systemId, userExtend);
            if (list == null)
            {
                list = new QuestionWrapper[0];
            }
            return list;
        }
        public QuestionWrapper[] getQuestionForRecentTestError(string sectionId, string userId, UserExtend userExtend)
        {
            return studyGuideWarpWS.getQuestionForRecentTestError(sectionId, userId, userExtend);
        }
        public QuestionWrapper[] getQuestionForKpByStructureId(string[] structureIds, string questionTypeId, string difficulty, string isbn, UserExtend userExtend)
        {
            return studyGuideWarpWS.getQuestionForKpByStructureId(structureIds, questionTypeId, difficulty, isbn, userExtend);
        }
        public string[] getQuestionIdsForKpByStructureId(string[] structureIds, string questionTypeId, string difficulty, string isbn, UserExtend userExtend)
        {
            return studyGuideWarpWS.getQuestionIdsForKpByStructureId(structureIds, questionTypeId, difficulty, isbn, userExtend);
        }
        public QuestionWrapper[] getQuestionReinforSupportRecent(string userId, string sectionId, string systemId, UserExtend userExtend)
        {
            QuestionWrapper[] list = studyGuideWarpWS.getQuestionReinforSupportRecent(userId, sectionId, systemId, userExtend);
            if (list == null)
            {
                list = new QuestionWrapper[0];
            }
            return list;
        }
        public QuestionWrapper[] getQuestionReinforStructures(string[] structureIds, UserExtend userExtend)
        {
            return studyGuideWarpWS.getQuestionReinforStructures(structureIds, userExtend);
        }

        public QuestionWrapper[] getQuestionReinforLos(string[] loIds, string num, UserExtend userExtend)
        {
            return studyGuideWarpWS.getQuestionReinforLos(loIds, num, userExtend);
        }

        /// <summary>
        /// 得到一组知识点所涉及到的所有题
        /// </summary>
        /// <param name="loIds"></param>
        /// <param name="num"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public QuestionWrapper[] getQuestionSampleByLos(String[] loIds, string num, UserExtend userExtend)
        {
            return studyGuideWarpWS.getQuestionSampleByLos(loIds, num, userExtend);
        }

        /// <summary>
        /// 得到一个知识点的例题    state:1,2,3,4,5，知识点状态所分的5个情况。分别为数值state
        /// </summary>
        /// <param name="loId"></param>
        /// <param name="state"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public QuestionWrapper[] getQuestionSampleByLoId(String loId, String state, UserExtend userExtend)
        {
            return studyGuideWarpWS.getQuestionSampleByLoId(loId, state, userExtend);
        }
      
        public StudyReferenceTypeWrapper[] getStudyReferenceTypeList(string isbn, UserExtend userExtend)
        {
            return studyGuideWarpWS.getStudyReferenceTypeList(isbn, userExtend);
        }

        public StudyReferenceWrapper[] getStudyReferenceAllListForLoIds(String[] loIds, UserExtend userExtend)
        {
            return studyGuideWarpWS.getStudyReferenceAllListForLoIds(loIds, userExtend);
        }

        /// <summary>
        /// 根据structureId显示全部书中所有学习资料，给出了这些学习资料到底是不是在教学大纲中,教学大纲传空就是整本书的那个结构中的
        /// </summary>
        /// <param name="structureId"></param>
        /// <param name="exCurriculumId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public StudyReferenceWrapper[] getStudyReferenceAllListForStructure(string structureId, string exCurriculumId, UserExtend userExtend)
        {
            return studyGuideWarpWS.getStudyReferenceAllListForStructure(structureId, exCurriculumId, userExtend);
        }

        /// <summary>
        /// 根据loId显示全部书中所有学习资料，给出了这些学习资料到底是不是在教学大纲中,教学大纲传空就是整本书的那个结构中的
        /// </summary>
        /// <param name="loId"></param>
        /// <param name="exCurriculumId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public StudyReferenceWrapper[] getStudyReferenceAllList(string loId, string exCurriculumId, UserExtend userExtend)
        {
            return studyGuideWarpWS.getStudyReferenceAllList(loId, exCurriculumId, userExtend);
        }


       


       

        public string[] getLoIdsByEveryDay(string isbn, string userId, string sectionId, string systemId, string exCurriculumId, string loIdNums)
        {
            return null;// studyGuideWarpWS.getLoIdsByEveryDay(isbn, userId, sectionId, systemId, exCurriculumId, loIdNums);
        }

      

        

        public QuestionWrapper[] getQuestionReinforSupportTest(string[] testIds, UserExtend userExtend)
        {
            QuestionWrapper[] returnValue = studyGuideWarpWS.getQuestionReinforSupportTest(testIds, userExtend);
            if (returnValue == null)
            {
                returnValue = new QuestionWrapper[0];
            }
            return returnValue;
            //return studyGuideWarpWS.getQuestionReinforSupportTest(testIds, userExtend);
        }

        public QuestionWrapper[] getQuestionForTestId(string testId, string testResultId,string userId, UserExtend userExtend)
        {
            return studyGuideWarpWS.getQuestionForTestId(testId, testResultId,userId, userExtend);
        }
        public QuestionWrapper[] getQuestionReinforTest(string[] testIds, UserExtend userExtend)
        {
            QuestionWrapper[] returnValue = studyGuideWarpWS.getQuestionReinforTest(testIds, userExtend);
            if (returnValue == null)
            {
                returnValue = new QuestionWrapper[0];
            }
            return returnValue;
        }

        public QuestionWrapper[] getQuestionForTestIds(string[] testIdArray, UserExtend userExtend)
        {
            QuestionWrapper[] list = studyGuideWarpWS.getQuestionForTestIds(testIdArray, userExtend);
            if (list == null)
                return new QuestionWrapper[0];
            else
                return list;
        }
        public QuestionWrapper[] getQuestionForTestResultError(string testResultId, string testId,string userId, UserExtend userExtend)
        {
            return studyGuideWarpWS.getQuestionForTestResultError(testResultId, testId,userId, userExtend);
        }
        //public QuestionWrapper[] getQuestionForTestResultId(string testResultId, string testId, UserExtend userExtend)
        //{
        //    return studyGuideWarpWS.getQuestionForTestResultId(testResultId, testId, userExtend);
        //}



        /// <summary>
        /// 返回一个考试里面的问题没有全部一样的知识点的问题集合
        /// </summary>
        /// <param name="testId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public QuestionWrapper[] getQuestionTypeForTest(string testId, string testResultId, UserExtend userExtend)
        {
            QuestionWrapper[] list = studyGuideWarpWS.getQuestionTypeForTest(testId, testResultId, userExtend);
            if (list == null)
                return new QuestionWrapper[0];
            else
                return list;
        }
        public QuestionWrapper[] getQuestionTypeForTests(string[] testIds, UserExtend userExtend)
        {
            QuestionWrapper[] list = studyGuideWarpWS.getQuestionTypeForTests(testIds, userExtend);
            if (list == null)
                return new QuestionWrapper[0];
            else
                return list;
        }

        public bool? deleteTest(TestWrapper testWrapper, UserExtend userExtend)
        {
            return studyGuideWarpWS.deleteTest(testWrapper, userExtend);
        }

        public bool? unuseTest(TestWrapper testWrapper, UserExtend userExtend)
        {
            return studyGuideWarpWS.unuseTest(testWrapper, userExtend);
        }
      
       

        public QuestionWrapper[] saveQuestion(QuestionWrapper[] questionWrapperArray, LoQuestionWrapper[] loQuestionWrapperArray, ReferenceAnswersWrapper[] referenceAnswersWrapperArray, UserExtend user)
        {
            return studyGuideWarpWS.saveQuestion(questionWrapperArray, loQuestionWrapperArray, referenceAnswersWrapperArray, user);
        }

        public QuestionTypeWrapper[] getQuestionTypeList(UserExtend user)
        {
            return studyGuideWarpWS.getQuestionTypeList(user);
        }


        public ReferenceAnswersWrapper[] getReferenceAnswersListByQidQsIds(JEWS.EngineStudyGuide.anyType2anyTypeMapEntry[] ht, UserExtend userExtend)
        {
            return studyGuideWarpWS.getReferenceAnswersListByQidQsIds(ht, userExtend);
        }

        public QuestionWrapper[] getReinforTestNoKp(string testResultId,string userId, UserExtend userExtend)
        {
            QuestionWrapper[] returnValue = studyGuideWarpWS.getReinforTestNoKp(testResultId,userId, userExtend);
            if (returnValue == null)
            {
                returnValue = new QuestionWrapper[0];
            }
            return returnValue;
        }
        public QuestionWrapper getQuestion(string questionID, UserExtend in1)
        {
            return studyGuideWarpWS.getQuestion(questionID, in1);
        }


       

        public LoQuestionWrapper[] getLoQuestionList(string questionID, UserExtend userExtend)
        {
            return studyGuideWarpWS.getLoQuestionList(questionID, userExtend);
        }
        public QuestionWrapper[] getQuestionForQuestionType(string testId, QuestionTypeWrapper questionTypeWrapper, UserExtend user)
        {
            return studyGuideWarpWS.getQuestionForQuestionType(testId, questionTypeWrapper, user);
        }
        //public QuestionWrapper[] getQuestionSampleByLos(string[] loIds, string num, UserExtend user)
        //{
        //    return studyGuideWarpWS.getQuestionSampleByLos(loIds, num, user);
        //}

        public QuestionWrapper[] getQuestionSampleByStructure(string[] structureIds, UserExtend user)
        {
            return studyGuideWarpWS.getQuestionSampleByStructure(structureIds, user);
        }

        //public ReferenceAnswersWrapper[] getReferenceAnswerListForQuestionType(string testId, QuestionTypeWrapper questionTypeWrapper, UserExtend user)
        //{
        //    return studyGuideWarpWS.getReferenceAnswerListForQuestionType(testId, questionTypeWrapper, user);
        //}




        public TestWrapper getTest(string testId, UserExtend userExtend)
        {
            return studyGuideWarpWS.getTest(testId, userExtend);
        }
        //public TesterAnswersWrapper[] getTesterAnswers(string testResultId, string improveFlag, bool? improveReport, int? improveNum, UserExtend userExtend)
        //{
        //    return studyGuideWarpWS.getTesterAnswersList(testResultId,improveFlag,improveReport,improveNum, userExtend);
        //}


    

        /// <summary>
        /// 教师
        /// </summary>
        /// <param name="loIds"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public QuestionWrapper[] getQuestionNoStudentOfLo(string[] loIds, UserExtend userExtend)
        {
            return studyGuideWarpWS.getQuestionNoStudentOfLo(loIds, userExtend);
        }
        public string[] getQuestionIdsNoStudentOfLo(string[] loIds, UserExtend userExtend)
        {
            return studyGuideWarpWS.getQuestionIdsNoStudentOfLo(loIds, userExtend);
        }
        public QuestionWrapper[] getQuestionOfLoList(string loId, UserExtend userExtend)
        {
            return studyGuideWarpWS.getQuestionOfLoList(loId, userExtend);
        }
        public string[] getQuestionIdsOfLo(string loId, UserExtend userExtend)
        {
            return studyGuideWarpWS.getQuestionIdsOfLo(loId, userExtend);
        }
        //public QuestionWrapper[] getQuestionForIdList(string[] questionId, UserExtend userExtend)
        //{
        //    return studyGuideWarpWS.getQuestionForIdList(questionId, userExtend);
        //}
        public TestQuestionTypeWrapper[] getTestQuestionTypeList(string ISBN, UserExtend userExtend)
        {
            return studyGuideWarpWS.getTestQuestionTypeList(ISBN, userExtend);
        }

        //public TestResultQuestionWrapper[] getTestResultQuestionList(string testResultId, UserExtend userExtend)
        //{
        //    return studyGuideWarpWS.getTestResultQuestionList(testResultId, userExtend);
        //}


        /// <summary>
        /// 保存学习资料
        /// </summary>
        /// <param name="studyReferenceWrapper"></param>
        /// <param name="loId">与学习资料相关联的LO</param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public StudyReferenceWrapper saveStudyReference(StudyReferenceWrapper studyReferenceWrapper, UserExtend userExtend)
        {
            return studyGuideWarpWS.saveStudyReference(studyReferenceWrapper, userExtend);
        }

        /// <summary>
        /// 编辑学习资料
        /// </summary>
        /// <param name="studyReferenceWrapper"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public StudyReferenceWrapper updateStudyReference(StudyReferenceWrapper studyReferenceWrapper, UserExtend userExtend)
        {
            return studyGuideWarpWS.updateStudyReference(studyReferenceWrapper, userExtend);
        }
        /// <summary>
        /// 删除某个学习资料，并从它的教学大纲里面移出
        /// </summary>
        /// <param name="studyReferenceId"></param>
        /// <param name="loId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public bool? deleteStudyReference(StudyReferenceWrapper studyReferenceWrapper, UserExtend userExtend)
        {
            return studyGuideWarpWS.deleteStudyReference(studyReferenceWrapper, userExtend);
        }
      

     

       


        


        public QuestionWrapper[] updateQuestion(QuestionWrapper[] questionWrapperArray, LoQuestionWrapper[] loQuestionWrapperArray, ReferenceAnswersWrapper[] referenceAnswersWrapperArray, UserExtend user)
        {
            return studyGuideWarpWS.updateQuestion(questionWrapperArray, loQuestionWrapperArray, referenceAnswersWrapperArray, user);
        }
        public bool? deleteQuestions(QuestionWrapper[] questionWrapperArray, UserExtend user)
        {
            return studyGuideWarpWS.deleteQuestions(questionWrapperArray, user);
        }
        public string getSubmitAssignmentNum(string assignmentId, string testId, string submissionType, UserExtend user)
        {
            return studyGuideWarpWS.getAssignmentSubmitNum(assignmentId, testId, submissionType, user);
        }
        /// <summary>
        /// Test是否已经考试
        /// </summary>
        /// <param name="testId"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        public bool? testUseFlag(string testId, UserExtend user)
        {

            return studyGuideWarpWS.testUseFlag(testId, user);
        }
       


        //public StudyReferenceWrapper[] getStudyReferenceBookListForLoIds(string[] loids, UserExtend userExtend)
        //{
        //    return studyGuideWarpWS.getStudyReferenceListForLoIds(loids, "1", userExtend);
        //}

        public ArrayList getQuestionView(QuestionWrapper question, ReferenceAnswersWrapper[] ras, QuestionAlgorithmWrapper[] qas, UserExtend userExtend)
        {
            ArrayList lst = new ArrayList();
            anyType2anyTypeMapEntry[] hs = studyGuideWarpWS.getQuestionView(question, ras, qas, userExtend);
            System.Collections.IEnumerator ien = hs.GetEnumerator();
            while (ien.MoveNext())
            {
                anyType2anyTypeMapEntry o = ien.Current as anyType2anyTypeMapEntry;
                lst.Add(o.key as QuestionWrapper);
                lst.Add(o.value as ReferenceAnswersWrapper[]);
            }
            return lst;
        }

       


        //保存考试中question的参数值
        public bool? saveQuestionAlgorithmValue(QuestionAlgorithmValueWrapper[] qavs, string testResultId, UserExtend userExtend)
        {
            throw new NotImplementedException();
            //return studyGuideWarpWS.saveQuestionAlgorithmValue(qavs, testResultId, userExtend);
        }

        //检查活动题参数
        public QuestionAlgorithmValueWrapper[] checkQuestionAlgorithmValues(QuestionAlgorithmWrapper[] questionAlgorithms, string questionId)
        {
            return studyGuideWarpWS.checkQuestionAlgorithmValues(questionAlgorithms, questionId);
        }

        /// <summary>
        /// 根据一组number或一个得到question集合
        /// </summary>
        /// <param name="numbers"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public QuestionWrapper[] getQuestionByNumber(string[] numbers, UserExtend userExtend)
        {
            return studyGuideWarpWS.getQuestionByNumber(numbers, userExtend);
        }

    

        public Boolean? saveQpvSeedByBookId(string bookId, UserExtend userExtend)
        {
            return studyGuideWarpWS.saveQpvSeedByBookId(bookId, userExtend);
        }
        //jason liu
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);//如果执行了这个方法，在执行垃圾回收器的时候就不用重复再执行一遍析构函数。
        }

        private void Dispose(bool disposing)
        {
            if (disposing)
            {
                //释放托管资源
            }
            //studyGuideWarpWS.Dispose();
            studyGuideWarpWS.Dispose();
        }
      

        /// <summary>
        /// 得到母题的子题
        /// </summary>
        /// <param name="questionId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public QuestionWrapper[] getSubQuestionListById(string questionId, string qpvSeedId, UserExtend userExtend)
        {
            return studyGuideWarpWS.getQuestionList(questionId, qpvSeedId, userExtend);
        }

        /// <summary>
        /// 得到母题的所对应的子题
        /// </summary>
        /// <param name="questionId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public QuestionWrapper[] getSubQuestionListByIds(string[] questionIds, string[] qpvSeedIds, UserExtend userExtend)
        {
            return studyGuideWarpWS.getQuestionListByQuestionIds(questionIds, qpvSeedIds, userExtend);
        }

        public bool? updateQuestionInfo(QuestionWrapper[] questions, UserExtend userExtend)
        {
            return studyGuideWarpWS.updateQuestionInfo(questions, userExtend);
        }

        public QuestionAlgorithmValueWrapper[] getQuestionAlgorithmValues(string[] p, string testResultId, UserExtend user)
        {
            throw new NotImplementedException();
        }

        public QuestionWrapper[] getQuestionsByQidSeedId(string[] questionIds, string[] seedIds, UserExtend userExtend)
        {
            return studyGuideWarpWS.getQuestionsByQidSeedId(questionIds, seedIds, userExtend);
        }

        //根据questionID得到question以及他的母题
        public QuestionWrapper[] getQuestionFCList(string[] questionIds, UserExtend userExtend)
        {
            return studyGuideWarpWS.getQuestionFCList(questionIds, userExtend);
        }

        //保存知识点与题的关系
        public bool? manageLoQuestion(string[] questionIds, LoQuestionWrapper[] loQuestions, UserExtend userExtend)
        {
            return studyGuideWarpWS.manageLoQuestion(questionIds, loQuestions, userExtend);
        }

        //保存考试信息和考试题的testQuestion信息
        public string saveTestQuestion(TestWrapper test, QuestionWrapper[] questions, UserExtend userExtend)
        {
            return studyGuideWarpWS.saveTestQuestion(test, questions, userExtend);
        }

        //这个修改成编辑试卷
        public bool? editTestQuestion(TestWrapper test, anyType2anyTypeMapEntry[] htQuestionIdAndScore, UserExtend userExtend)
        {
            return studyGuideWarpWS.editTestQuestion(test, htQuestionIdAndScore, userExtend);
        }

        //自动关联题与知识点关系
        public bool? manageBsQuestion(string[] questionIds, string structureId, string isbn, UserExtend userExtend)
        {
            return studyGuideWarpWS.manageBsQuestion(questionIds, structureId, isbn, userExtend);
        }

        //自动识别题相关的知识点，作为参考关联
        public LearningObjectiveCmsWrapper[] getLearningObjectiveAutoCompatibility(string questionId, string structureId, string isbn, UserExtend userExtend)
        {
            return studyGuideWarpWS.getLearningObjectiveAutoCompatibility(questionId, structureId, isbn, userExtend);
        }

        //删除试卷
        public bool? removeTest(string testId, UserExtend userExtend)
        {
            return studyGuideWarpWS.removeTest(testId, userExtend);
        }

        //删除试卷和题
        public bool? removeTestAndQuestion(string testId, string isbn, UserExtend userExtend)
        {
            return studyGuideWarpWS.removeTestAndQuestion(testId, isbn, userExtend);
        }

        //根据structureId显示教学大纲中有的学习资料
        public StudyReferenceWrapper[] getStudyReferenceForStructureList(string structureId, UserExtend user)
        {
            return studyGuideWarpWS.getStudyReferenceForStructureList(structureId, "", user);
        }

        /// <summary>
        /// 根据loId显示教学大纲中有的学习资料
        /// </summary>
        public StudyReferenceWrapper[] getStudyReferenceList(string loid, UserExtend user)
        {
            return studyGuideWarpWS.getStudyReferenceList(loid, "", user);
        }

        public string[] getQuestionIdsForStructureId(string structureId, UserExtend userExtend)
        {
            //return studyGuideWarpWS.getQuestionIdsForStructureId(structureId, userExtend);
            throw new NotImplementedException();
        }

        /// <summary>
        /// 直接挂在某个节点上没有知识点的questionId
        /// </summary>
        public string[] getQuestionIdsNoKpForStructureId(string structureId, UserExtend userExtend)
        {
            //return studyGuideWarpWS.getQuestionIdsNoKpForStructureId(structureId, userExtend);
            throw new NotImplementedException();
        }

        /// <summary>
        /// 教师得到某个作业中所有题的正确率
        /// </summary>
        /// <param name="assignmentId"></param>
        /// <param name="testId"></param>
        /// <param name="sectionId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public TestResultQuestionReportWrapper[] getQuestionCorrectPercentage(string assignmentId, string testId, string sectionId, UserExtend userExtend) {
            return studyGuideWarpWS.getQuestionCorrectPercentage(assignmentId,testId,sectionId,userExtend);
        }

        //////////教师返回错题库
        /// <summary>
        /// 返回整个班的错题
        /// </summary>
        /// <param name="sectionId"></param>
        /// <param name="correceBase"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public TestResultQuestionReportWrapper[] questionErrorSectionBySectionId(string sectionId, double correceBase, string startDate, string endDate,UserExtend userExtend)
        {
            return studyGuideWarpWS.questionErrorSectionBySectionId(sectionId, correceBase, startDate, endDate, userExtend);
        }

        /// <summary>
        /// 返回某个班某个节点下的错题
        /// </summary>
        /// <param name="structureId"></param>
        /// <param name="sectionId"></param>
        /// <param name="correceBase"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public TestResultQuestionReportWrapper[] questionErrorSectionByStructureId(string structureId, string sectionId, double correceBase, string startDate, string endDate, UserExtend userExtend)
        {
            return studyGuideWarpWS.questionErrorSectionByStructureId(structureId, sectionId, correceBase, startDate, endDate, userExtend);
        }

        /// <summary>
        /// 返回某个班某个知识点下的错题库
        /// </summary>
        /// <param name="pointingLoIds"></param>
        /// <param name="sectionId"></param>
        /// <param name="correceBase"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public TestResultQuestionReportWrapper[] questionErrorSectionByLoIds(string[] pointingLoIds, string sectionId, double correceBase, string startDate, string endDate, UserExtend userExtend)
        {
            return studyGuideWarpWS.questionErrorSectionByLoIds(pointingLoIds, sectionId, correceBase, startDate, endDate, userExtend);
        }



        //////学生返回错题库。
        /// <summary>
        /// 
        /// </summary>返回某个学生在某个班的的错题
        /// <param name="userId"></param>
        /// <param name="correceBase"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public TestResultQuestionReportWrapper[] questionErrorUserByUserId(string userId, double correceBase, string startDate, string endDate, UserExtend userExtend)
        {
            return studyGuideWarpWS.questionErrorUserByUserId(userId, correceBase,startDate,endDate, userExtend);
        }

        /// <summary>
        /// 返回某个学生在某个节点下的错题
        /// </summary>
        /// <param name="structureId"></param>
        /// <param name="userId"></param>
        /// <param name="correceBase"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public TestResultQuestionReportWrapper[] questionErrorUserByStructureId(string structureId, string userId, double correceBase, string startDate, string endDate, UserExtend userExtend)
        {
            return studyGuideWarpWS.questionErrorUserByStructureId(structureId, userId, correceBase, startDate, endDate, userExtend);
        }

        /// <summary>
        /// 返回某个学生在某个知识点下的错题库
        /// </summary>
        /// <param name="pointingLoIds"></param>
        /// <param name="userId"></param>
        /// <param name="correceBase"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public TestResultQuestionReportWrapper[] questionErrorUserByLoIds(string[] pointingLoIds, string userId, double correceBase, string startDate, string endDate, UserExtend userExtend)
        {
            return studyGuideWarpWS.questionErrorUserByLoIds(pointingLoIds, userId, correceBase, startDate, endDate, userExtend);
        }

        /// <summary>
        /// 看每个题的答题者答案。
        /// </summary>
        /// <param name="assignmentId"></param>
        /// <param name="testId"></param>
        /// <param name="questionIds"></param>
        /// <param name="sectionId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public TestResultQuestionWrapper[] getTesterAnswersByTest(string assignmentId, string testId, string[] questionIds, string sectionId, UserExtend userExtend)
        {
            return studyGuideWarpWS.getTesterAnswersByTest(assignmentId, testId, questionIds, sectionId, userExtend);
        }


        //得到结构名称
        public string bookStructureName(string structureId, string isbn, UserExtend userExtend)
        {
            
            return studyGuideWarpWS.bookStructureName(structureId, isbn, userExtend);
        }

        //答案正确率统计
        public anyType2anyTypeMapEntry[] referenceAnswersBaseByTest(string assignmentId, string testId, string[] questionIds, string sectionId, UserExtend userExtend)
        {
            return studyGuideWarpWS.referenceAnswersBaseByTest(assignmentId, testId, questionIds, sectionId, userExtend);
        }

        /// <summary>
        /// 得到改善一个content的分数的题组.
        /// </summary>
        /// <param name="testResultId"></param>
        /// <param name="testId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public QuestionWrapper[] questionErrorDrillForTestResultId(String testResultId, String testId,bool? improveReport,int? improveNum, UserExtend userExtend)
        {
            return studyGuideWarpWS.questionErrorDrillForTestResultId(testResultId,testId, improveReport,improveNum, userExtend);
        }

   
    }
}
