using System;
using System.Collections.Generic;
//using System.Linq;mm
using System.Text;
using JEWS.EngineStudyGuide;

namespace JEWS
{
    [Serializable]
    public class CmsEngine
    {
        private StudyGuideWrapperWebService cmsWarpWS = new StudyGuideWrapperWebService();
        public CmsEngine()
        { }

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
            //cmsWarpWS.Dispose();
            cmsWarpWS.Dispose();
        }

        ~CmsEngine()
        {
            Dispose(false);
        }

        

        public DisciplineWrapper[] getDisciplineList(UserExtend userExtend)
        {
            return cmsWarpWS.getDisciplineList(userExtend);
        }

        public DisciplineWrapper saveDiscipline(DisciplineWrapper disciplineW, UserExtend userExtend)
        {
            return cmsWarpWS.saveDiscipline(disciplineW, userExtend);
        }

        public DisciplineWrapper editDiscipline(DisciplineWrapper disciplineW, UserExtend userExtend)
        {
            return cmsWarpWS.editDiscipline(disciplineW, userExtend);
        }

        public bool? deleteDiscipline(DisciplineWrapper disciplineW, UserExtend userExtend)
        {
            return cmsWarpWS.deleteDiscipline(disciplineW, userExtend);
        }

        public bool? deleteGradation(String gradationId, UserExtend userExtend)
        {
            return cmsWarpWS.deleteGradation(gradationId, userExtend);
        }

        public SubjectWrapper[] getSubjectList(UserExtend userExtend)
        {
            return cmsWarpWS.getSubjectList(userExtend);
        }

        public SubjectWrapper[] getSubjectListByDisciplineId(String disciplineId, UserExtend userExtend)
        {
            return cmsWarpWS.getSubjectListByDisciplineId(disciplineId, userExtend);
        }

        public SubjectWrapper saveSubject(SubjectWrapper subjectW, UserExtend userExtend)
        {
            return cmsWarpWS.saveSubject(subjectW, userExtend);
        }

        public SubjectWrapper editSubject(SubjectWrapper subjectW, UserExtend userExtend)
        {
            return cmsWarpWS.editSubject(subjectW, userExtend);
        }

        public bool? deleteSubject(SubjectWrapper subjectW, UserExtend userExtend)
        {
            return cmsWarpWS.deleteSubject(subjectW, userExtend);
        }

        public LsmSystemWrapper[] getLsmSystemList()
        {
            return cmsWarpWS.getLsmSystemList();
        }

        public LsmSystemWrapper saveLsmSystem(LsmSystemWrapper lsmSystemW, UserExtend userExtend)
        {
            return cmsWarpWS.saveLsmSystem(lsmSystemW, userExtend);
        }

        public LsmSystemWrapper editLsmSystem(LsmSystemWrapper lsmSystemW, UserExtend userExtend)
        {
            return cmsWarpWS.editLsmSystem(lsmSystemW, userExtend);
        }

        public bool? deleteLsmSystem(LsmSystemWrapper lsmSystemW, UserExtend userExtend)
        {
            return cmsWarpWS.deleteLsmSystem(lsmSystemW, userExtend);
        }

        public BookStructureTypeWrapper[] getBookStructureTypeList(String isbn, UserExtend userExtend)
        {
            return cmsWarpWS.getBookStructureTypeList(isbn, userExtend);
        }

        public String[] getBookStructureIdsForNoUsed(String isbn, UserExtend userExtend)
        {
            return cmsWarpWS.getBookStructureIdsForUse(isbn, userExtend);
        }
        public BookStructureTypeWrapper[] getBookStructureTypeByBookIdList(String bookId, UserExtend userExtend)
        {
            return cmsWarpWS.getBookStructureTypeByBookIdList(bookId, userExtend);
        }

        

        public bool? deleteBookStructureType(BookStructureTypeWrapper bookStructureTypeW, UserExtend userExtend)
        {
            return cmsWarpWS.deleteBookStructureType(bookStructureTypeW, userExtend);
        }

        public StudyReferenceTypeWrapper[] getStudyReferenceTypeList(string isbn, UserExtend userExtend)
        {
            return cmsWarpWS.getStudyReferenceTypeList(isbn, userExtend);
        }

        public StudyReferenceTypeWrapper saveStudyReferenceType(StudyReferenceTypeWrapper studyReferenceTypeWrapper, UserExtend userExtend)
        {
            return cmsWarpWS.saveStudyReferenceType(studyReferenceTypeWrapper, userExtend);
        }

        public bool? deleteStudyReferenceType(StudyReferenceTypeWrapper studyReferenceTypeWrapper, UserExtend userExtend)
        {
            return cmsWarpWS.deleteStudyReferenceType(studyReferenceTypeWrapper, userExtend);
        }

        public StudyReferenceTypeWrapper editStudyReferenceType(StudyReferenceTypeWrapper studyReferenceTypeWrapper, UserExtend userExtend)
        {
            return cmsWarpWS.editStudyReferenceType(studyReferenceTypeWrapper, userExtend);
        }

        public PublisherWrapper[] getPublisherList(UserExtend userExtend)
        {
            return cmsWarpWS.getPublisherList(userExtend);
        }

        public PublisherWrapper savePublisher(PublisherWrapper publisherW, UserExtend userExtend)
        {
            return cmsWarpWS.savePublisher(publisherW, userExtend);
        }

        public PublisherWrapper editPublisher(PublisherWrapper publisherW, UserExtend userExtend)
        {
            return cmsWarpWS.editPublisher(publisherW, userExtend);
        }

        public bool? deletePublisher(PublisherWrapper publisherW, UserExtend userExtend)
        {
            return cmsWarpWS.deletePublisher(publisherW, userExtend);
        }

        
        //public BookWrapper[] getBookList(bool? realBook, UserExtend userExtend)
        //{
        //    return cmsWarpWS.getBookList(realBook, userExtend);
        //}

        public BookWrapper getBook(String isbn)
        {
            return cmsWarpWS.getBook(isbn);
        }

        public BookWrapper saveBook(BookWrapper bookW, String[] authorWs, UserExtend userExtend)
        {
            return cmsWarpWS.saveBook(bookW, authorWs, userExtend);
        }

        public BookWrapper editBook(BookWrapper bookW, String[] authorWs, UserExtend userExtend)
        {
            return cmsWarpWS.editBook(bookW, authorWs, userExtend);
        }

        public bool? deleteBook(BookWrapper bookW, UserExtend userExtend)
        {
            return cmsWarpWS.deleteBook(bookW, userExtend);
        }
      

        public LearningObjectiveCmsWrapper[] getLearningObjectiveWithBookList(String isbn, UserExtend userExtend)
        {
            return cmsWarpWS.getLearningObjectiveWithBookList(isbn, userExtend);
        }

        public LearningObjectiveCmsWrapper[] getLearningObjectiveWithStructureList(String structureId,String isbn,String exCurriculumId, UserExtend userExtend)
        {
            if (exCurriculumId == "") {
                exCurriculumId = null;
            }
            return cmsWarpWS.getLearningObjectiveWithStructureList(structureId,isbn,exCurriculumId, userExtend);
        }

        public LearningObjectiveCmsWrapper saveLearningObjectiveCms(LearningObjectiveCmsWrapper locW, UserExtend userExtend)
        {
            return cmsWarpWS.saveLearningObjectiveCms(locW, userExtend);
        }

        public LearningObjectiveCmsWrapper editLearningObjectiveCms(LearningObjectiveCmsWrapper locW, UserExtend userExtend)
        {
            return cmsWarpWS.editLearningObjectiveCms(locW, userExtend);
        }

        public bool? deleteLearningObjectiveCms(LearningObjectiveCmsWrapper locW, UserExtend userExtend)
        {
            return cmsWarpWS.deleteLearningObjectiveCms(locW, userExtend);
        }

        public LearningObjectiveCmsWrapper[] getLoLoList(String loId,UserExtend userExtend)
        {
            return cmsWarpWS.getLoLoList(loId ,userExtend);
        }

        public bool? saveLoLo(LearningObjectiveCmsWrapper locW, LearningObjectiveCmsWrapper[] locWs, UserExtend userExtend)
        {
            return cmsWarpWS.saveLoLo(locW, locWs, userExtend);
        }

        public bool? editLoLo(LearningObjectiveCmsWrapper locW, LearningObjectiveCmsWrapper[] locWs, UserExtend userExtend)
        {
            return cmsWarpWS.editLoLo(locW, locWs, userExtend);
        }

      

        public TestQuestionTypeWrapper[] getTestQuestionTypeList(String isbn, UserExtend userExtend)
        {
            return cmsWarpWS.getTestQuestionTypeList(isbn, userExtend);
        }

        public TestQuestionTypeWrapper[] getTestQuestionTypeListBySubject(String subjectId, UserExtend userExtend)
        {
            //jason
            //getTestQuestionTypeList可以用getTestQuestionTypeBookList替换
            return cmsWarpWS.getTestQuestionTypeBookList(userExtend.bookId,userExtend);
        }

        public TestQuestionTypeWrapper saveTestQuestionType(TestQuestionTypeWrapper testQuestionTypeW, UserExtend userExtend)
        {
            return null;
        }

        public TestQuestionTypeWrapper editTestQuestionType(TestQuestionTypeWrapper testQuestionTypeW, UserExtend userExtend)
        {
            return null;
        }

       

        public BookContentStructureWrapper[] getBookContentStructureAllNoKPList(string isbn, UserExtend userExtend)
        {
            return cmsWarpWS.getBookContentStructureAllNoKPList(isbn, userExtend);
        }

   
        /// <summary>
        /// 显示结构中不包括kp的在教学大纲中有的全部
        /// </summary>
        /// <param name="isbn"></param>
        /// <param name="exCurriculumID"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public BookContentStructureWrapper[] getBookContentStructureNoKPTrueList(String isbn, String exCurriculumID, UserExtend userExtend)
        {
            return cmsWarpWS.getBookContentStructureNoKPTrueList(isbn, exCurriculumID, userExtend);
        }

      


        public bool? deleteBookContentStructure(BookContentStructureWrapper bookContentStructure,string isbn, UserExtend userExtend)
        {
            return cmsWarpWS.deleteBookContentStructure(bookContentStructure,isbn, userExtend);
        }

        public bool? saveUpdateQuestionAlgorithm(QuestionAlgorithmWrapper[] qaWs, String questionId, UserExtend userExtend)
        {
            return cmsWarpWS.saveUpdateQuestionAlgorithm(qaWs, questionId, userExtend);
        }

        /// <summary>
        /// 对某个活动题默认生成几套种子
        /// </summary>
        /// <param name="questionIds"></param>
        /// <param name="num"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public bool? saveQpvSeedByQuestionIds(String[] questionIds, String num, UserExtend userExtend)
        {
            return cmsWarpWS.saveQpvSeedByQuestionIds(questionIds, num, userExtend);
        }

        /// <summary>
        /// 保存某个question的某个种子
        /// </summary>
        /// <param name="qavs"></param>
        /// <param name="questionId"></param>
        /// <returns></returns>
        public bool? saveQpvSeed(QuestionAlgorithmValueWrapper[] qavs, String questionId) {
            return cmsWarpWS.saveQpvSeed(qavs, questionId);
        }

        /// <summary>
        /// 删除种子
        /// </summary>
        /// <param name="qpvSeedId"></param>
        /// <returns></returns>
        public bool? removeQpvSeed(String qpvSeedId) {
            return cmsWarpWS.removeQpvSeed(qpvSeedId);
        }

        /// <summary>
        /// 得到某个题已存在的种子
        /// </summary>
        /// <param name="questionId"></param>
        /// <returns></returns>
        public String[] getQpvSeedList(String questionId) {
            return cmsWarpWS.getQpvSeedList(questionId);
        }

        public QuestionAlgorithmValueWrapper[] getQuestionAlgorithmValueAuto(QuestionAlgorithmWrapper[] qaWs, String questionId) {
            return cmsWarpWS.getQuestionAlgorithmValueAuto(qaWs, questionId);
        }

        public QuestionAlgorithmWrapper[] getQuestionAlgorithmList(string questionId, UserExtend userExtend)
        {
            return cmsWarpWS.getQuestionAlgorithmList(questionId, userExtend);
        }
       

        /// <summary>
        /// 根据自增量Id返回活动题参数列表
        /// </summary>
        /// <param name="number"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public QuestionAlgorithmWrapper[] getQuestionAlgorithmByNbList(string number, UserExtend userExtend)
        {
            return cmsWarpWS.getQuestionAlgorithmByNbList(number, userExtend);
        }

        public QuestionWrapper[] getQuestionByQpvSeedIds(String questionId, String[] qpvSeedIds, UserExtend userExtend) {
            return cmsWarpWS.getQuestionByQpvSeedIds(questionId, qpvSeedIds, userExtend);
        }

        //缓存部份基础数据
        public bool? loadCacheData(UserExtend userExtend)
        {
            return cmsWarpWS.loadCacheData(userExtend);
        }

        public StudyReferenceWrapper getStudyReferenceForLoExtend(String loId, UserExtend userExtend) {
            return cmsWarpWS.getStudyReferenceForLoExtend(loId, userExtend);
        }

        //编辑或者保存BookContentStructure
        public BookContentStructureWrapper[] editAndSaveBookContentStructures(BookContentStructureWrapper[] bookContentStructureWs, String isbn, UserExtend userExtend)
        {
            return cmsWarpWS.editAndSaveBookContentStructures(bookContentStructureWs, isbn, userExtend);
        }

        //BookContentStructure排序
        public BookContentStructureWrapper[] sortBookContentStructures(BookContentStructureWrapper[] bookContentStructureWs, String isbn, UserExtend userExtend)
        {
            return cmsWarpWS.sortBookContentStructures(bookContentStructureWs, isbn, userExtend);
        }

        //LearningObjective排序
        public LearningObjectiveCmsWrapper[] editLearningObjectiveCmsBySort(LearningObjectiveCmsWrapper[] locs, UserExtend userExtend) 
        {
            return cmsWarpWS.editLearningObjectiveCmsBySort(locs, userExtend);
        }

        //返回学习资料相关的知识点
        public LoStudyReferenceWrapper[] getLoStudyReferenceList(String studyReferenceId, UserExtend userExtend)
        {
            return cmsWarpWS.getLoStudyReferenceList(studyReferenceId, userExtend);
        }

        //保存学习资料相关的知识点
        public bool? saveLoStudyReference(LoStudyReferenceWrapper[] loStudyReferences, UserExtend userExtend)
        {
            return cmsWarpWS.saveLoStudyReference(loStudyReferences, userExtend);
        }

        //更新学习资料相关的知识点
        public bool? updateLoStudyReference(String studyReferenceId, LoStudyReferenceWrapper[] loStudyReferences, UserExtend userExtend)
        {
            return cmsWarpWS.updateLoStudyReference(studyReferenceId, loStudyReferences, userExtend);
        }

        //获得权限
        public UserPrivilegeWrapper[] getUserPrivilegeList(String userId, UserExtend userExtend)
        {
            return cmsWarpWS.getUserPrivilegeList(userId, userExtend);
        }

        //设置用户权限
        public bool? manageUserPrivilege(UserPrivilegeWrapper[] userPrivilegeWs, String userId, UserExtend userExtend)
        {
            return cmsWarpWS.manageUserPrivilege(userPrivilegeWs, userId, userExtend);
        }

        ////根据学科类别返回书
        //public BookWrapper[] getBookListByDisciplineId(String disciplineId, bool? realBook, UserExtend userExtend)
        //{
        //    return cmsWarpWS.getBookListByDisciplineId(disciplineId, realBook, userExtend);
        //}

        ////根据科目返回书
        //public BookWrapper[] getBookListBySubjectId(string subjectId, bool? realBook, UserExtend userExtend)
        //{
        //    return cmsWarpWS.getBookListBySubjectId(subjectId, realBook, userExtend);
        //}

        ////根据科目集合返回书
        //public BookWrapper[] getBookListBySubjectIds(string[] subjectIds, bool? realBook, UserExtend userExtend)
        //{
        //    return cmsWarpWS.getBookListBySubjectIds(subjectIds, realBook, userExtend);
        //}

        ////根据科目集合返回书Id
        //public string[] getBookIdListBySubjectIds(string[] subjectIds, bool? realBook, UserExtend userExtend)
        //{
        //    return cmsWarpWS.getBookIdListBySubjectIds(subjectIds, realBook, userExtend);
        //}

        //返回指定的书
        public BookWrapper[] getBookListByBookIds(string[] bookIds, UserExtend userExtend)
        {
            return cmsWarpWS.getBookListByBookIds(bookIds, userExtend);
        }

        //返回用户的书的Id
        public string[] getBookIdList(string userId, string[] instituteIds, string[] disciplineIds, string[] subjectIds, bool? realFlag, UserExtend userExtend)
        {
            return cmsWarpWS.getBookList(userId, instituteIds, disciplineIds, subjectIds, realFlag, userExtend);
        }

        ////返回自己的书
        //public BookWrapper[] getMyBookList(string userId, bool? realBook, UserExtend userExtend)
        //{
        //    return cmsWarpWS.getMyBookList(userId, realBook, userExtend);
        //}

        ////返回自己的书Id
        //public string[] getMyBookIdList(string userId, bool? realBook, UserExtend userExtend)
        //{
        //    return cmsWarpWS.getMyBookIdList(userId, realBook, userExtend);
        //}

        public bool? removeLoQuestionForLoIds(String[] loIds, UserExtend userExtend)
        {
            return cmsWarpWS.removeLoQuestionForLoIds(loIds, userExtend);
        }

        //内容编辑历史
        public ContentEditHistoryWrapper[] getContentEditHistory(String contentId, String contentType, String bookId, UserExtend userExtend)
        {
            return cmsWarpWS.getContentEditHistory(contentId, contentType, bookId, userExtend);
        }

      

        //编辑内容编辑历史
        public bool? editContentEditHistory(ContentEditHistoryWrapper contentEditHistoryW, UserExtend userExtend)
        {
            return cmsWarpWS.editContentEditHistory(contentEditHistoryW, userExtend);
        }

        //根据bookId得到questionId集合
        public string[] getQuestionIdsByBookId(String bookId, UserExtend userExtend)
        {
            return cmsWarpWS.getQuestionIdsByBookId(bookId, userExtend);
        }

        /// <summary>
        /// 查询没有生成种子的活动题
        /// </summary>
        /// <param name="bookId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public String[] getQuestionIdsForNoSeed(String bookId, UserExtend userExtend)
        {
            return cmsWarpWS.getQuestionIdsForNoSeed(bookId, userExtend);
        }

        //得到某个操作项的某内容类型的Id
        public string[] listByContentOperation(String contentType, String operationType, String userId, String bookId, UserExtend userExtend)
        {
            return cmsWarpWS.listByContentOperation(contentType, operationType, userId, bookId, userExtend);
        }

        //根据bookId得到学习资料Id集合
        public string[] getStudyReferenceIdsForBookIds(string bookId, UserExtend userExtend)
        {
            return cmsWarpWS.getStudyReferenceIdsForBookIds(bookId, userExtend);
        }

        //根据学习资料Id集合得到学习资料集合
        public StudyReferenceWrapper[] getStudyReferenceByIdsList(string[] ids, UserExtend userExtend)
        {
            return cmsWarpWS.getStudyReferenceByIdsList(ids, userExtend);
        }

        //根据bookId得到知识点Id集合
        public string[] getLearningObjectiveIdsForBookId(string bookId, UserExtend userExtend)
        {
            return cmsWarpWS.getLearningObjectiveIdsForBookId(bookId, userExtend);
        }

        //根据知识点Id集合得到知识点集合
        public LearningObjectiveCmsWrapper[] getLearningObjectiveForLoIds(string[] loIds, UserExtend userExtend)
        {
            return cmsWarpWS.getLearningObjectiveForLoIds(loIds, userExtend);
        }

        //question查询
        public string[] getQuestionIdByCondition(string content, string solution, string number, string instructorOnly, string typeId
            , string testQuestionTypeId, string algorithmFlag, string sampleFlag, string description, string bookId, string flag, string thinkFlag, string kpFlag, UserExtend userExtend)
        {
            return cmsWarpWS.getQuestionIdByCondition(content, solution, number, instructorOnly, typeId,
                testQuestionTypeId, algorithmFlag, sampleFlag, description, bookId, flag, thinkFlag, kpFlag, userExtend);
        }

        //知识点查询
        public string[] getLoIdsByCondition(string name, string description, string bookId, UserExtend userExtend)
        {
            return cmsWarpWS.getLoIdsByCondition(name, description, bookId, userExtend);
        }


        public bool? mergeKnowledgePoint(String targetKpId, String[] sourceKpId, UserExtend userExtend)
        {
            return null;// cmsWarpWS.mergeKnowledgePoint(targetKpId, sourceKpId, userExtend);
        }

        //保存知识点
        public LearningObjectiveCmsWrapper[] editLearningObjectiveCmsByGroup(LearningObjectiveCmsWrapper[] locs, UserExtend userExtend) 
        {
            return cmsWarpWS.editLearningObjectiveCmsByGroup(locs, userExtend);
        }


        public QuestionAlgorithmValueWrapper[] getQuestionAlgorithmValueQpvSeedIds(string[] qpvSeedIds, string questionId)
        {
            return cmsWarpWS.getQuestionAlgorithmValueQpvSeedIds(qpvSeedIds, questionId);
        }

        //public QuestionAlgorithmValueWrapper[] getQuestionAlgorithmValueQpvSeedId(string qpvSeedId, string questionId)
        //{
        //    throw new NotImplementedException();
        //}

        //得到真实书所关联的原书
        public BookWrapper[] getSourceBookListByBookId(String bookId, UserExtend userExtend)
        {
            return null;// cmsWarpWS.getSourceBookListByBookId(bookId, userExtend);
        }

        //真实书关联原书
        public bool? manageSourceBook(String bookId, String[] sourceBookId, UserExtend userExtend)
        {
            return false;// cmsWarpWS.manageSourceBook(bookId, sourceBookId, userExtend);
        }

        public bool? saveAutoTest(TestWrapper test, QuestionWrapper[] questions, ReferenceAnswersWrapper[] reAnswers, UserExtend userExtend)
        {
            return cmsWarpWS.saveAutoTest(test, questions, reAnswers, userExtend);
        }

        //编辑或者保存一组知识点
        public LearningObjectiveCmsWrapper[] manageLearningObjectiveCms(LearningObjectiveCmsWrapper[] locs, UserExtend userExtend)
        {
            return cmsWarpWS.manageLearningObjectiveCms(locs, userExtend);
        }

        public GradationWrapper[] getGradationList(UserExtend ue)
        {
            return cmsWarpWS.getGradationList(ue);
        }

        public bool? saveGradationList(GradationWrapper[] gradationWrapperArray, UserExtend ue)
        {
            return cmsWarpWS.saveGradationList(gradationWrapperArray, ue);
        }

        public string[] getQuestionForUserId(String userId, String bookId, UserExtend userExtend)
        {
            return cmsWarpWS.getQuestionForUserId(userId, bookId, userExtend);
        }

        //查找全部没有关联知识点的题
        public string[] getQuestionByNoKpForBookId(string bookId, UserExtend userExtend)
        {
            return cmsWarpWS.getQuestionByNoKpForBookId(bookId, userExtend);
        }

        //查找全部已关联知识点的题
        public string[] getQuestionByKpForBookId(string bookId, UserExtend userExtend)
        {
            return cmsWarpWS.getQuestionByKpForBookId(bookId, userExtend);
        }

        //查找用户没有关联知识点的题
        public string[] getQuestionByNoKpForUserId(string userId, string bookId, UserExtend userExtend)
        {
            return cmsWarpWS.getQuestionByNoKpForUserId(userId, bookId, userExtend);
        }

        //查找用户已经关联知识点的题
        public string[] getQuestionByKpForUserId(string userId, string bookId, UserExtend userExtend)
        {
            return cmsWarpWS.getQuestionByKpForUserId(userId, bookId, userExtend);
        }

        //查找全部未关联知识点的考试
        public string[] getTestIdsByNoKpForBookId(string bookId, string title, string importFlag, UserExtend userExtend)
        {
            return cmsWarpWS.getTestIdsByNoKpForBookId(bookId, title, importFlag, userExtend);
        }

        //查找全部已关联知识点的考试
        public string[] getTestIdsByKpForBookId(string bookId, string title, string importFlag, UserExtend userExtend)
        {
            return cmsWarpWS.getTestIdsByKpForBookId(bookId, title, importFlag, userExtend);
        }

        //查找用户未关联知识点的考试
        public string[] getTestIdsByNoKpForUserId(string userId, string bookId, String title, string importFlag, UserExtend userExtend)
        {
            return cmsWarpWS.getTestIdsByNoKpForUserId(userId, bookId, title, importFlag, userExtend);
        }

        //查找用户已关联知识点的考试
        public string[] getTestIdsByKpForUserId(string userId, string bookId, String title, string importFlag, UserExtend userExtend)
        {
            return cmsWarpWS.getTestIdsByKpForUserId(userId, bookId, title, importFlag, userExtend);
        }

        //返回用户创建的试卷
        public string[] getTestIdsForUserId(string userId, string bookId, string title, string importFlag, UserExtend userExtend)
        {
            return cmsWarpWS.getTestIdsForUserId(userId, bookId, title, importFlag, userExtend);
        }

        //返回所有试卷
        public string[] getTestIdsByBookId(string bookId, string title, string importFlag, UserExtend userExtend)
        {
            return cmsWarpWS.getTestIdsByBookId(bookId, title, importFlag, userExtend);
        }

        //根据testIds集合得到考试。
        public TestWrapper[] getTestListForTestIds(string[] testIds, UserExtend userExtend)
        {
            return cmsWarpWS.getTestListForTestIds(testIds, userExtend);
        }

        //根据考试查询题
        public string[] getQuestionForyTest(string testId, UserExtend userExtend)
        {
            return cmsWarpWS.getQuestionForyTest(testId, userExtend);
        }

        //查询考试中未关联知识点的题
        public string[] getQuestionByNoKpForTestId(string testId, UserExtend userExtend)
        {
            return cmsWarpWS.getQuestionByNoKpForTestId(testId, userExtend);
        }

        public TestQuestionTypeWrapper[] getTestQuestionTypeByIdsList(String[] testQuestionTypeIds, UserExtend userExtend)
        {
            return cmsWarpWS.getTestQuestionTypeByIdsList(testQuestionTypeIds,userExtend);
        }

        public TestQuestionTypeWrapper[] getTestQuestionTypeSystemList(UserExtend userExtend)
        {
            return cmsWarpWS.getTestQuestionTypeSystemList(userExtend);
        }

        public bool? manageTestQuestionTypes(TestQuestionTypeWrapper[] testQuestionTypes, UserExtend userExtend)
        {
            return cmsWarpWS.manageTestQuestionTypes(testQuestionTypes,userExtend);
        }

        public bool? deleteTestQuestionType(TestQuestionTypeWrapper testQuestionType, UserExtend userExtend)
        {
            return cmsWarpWS.deleteTestQuestionType(testQuestionType, userExtend);
        }

        public TestQuestionTypeWrapper[] getTestQuestionTypeBookList(String bookId, UserExtend userExtend)
        {
            return cmsWarpWS.getTestQuestionTypeBookList(bookId,userExtend);
        }

        public TestQuestionTypeWrapper[] getTestQuestionTypeBookByIdsList(String[] testQuestionTypeIds, String bookId, UserExtend userExtend)
        {
            return cmsWarpWS.getTestQuestionTypeBookByIdsList(testQuestionTypeIds, bookId, userExtend);
        }

        public bool? manageTestQuestionTypeBooks(TestQuestionTypeWrapper[] testQuestionTypes, String bookId, UserExtend userExtend)
        {
            return cmsWarpWS.manageTestQuestionTypeBooks(testQuestionTypes, bookId, userExtend);
        }

        public bool? deleteTestQuestionTypeBook(TestQuestionTypeWrapper testQuestionType, String bookId, UserExtend userExtend)
        {
            return cmsWarpWS.deleteTestQuestionTypeBook(testQuestionType, bookId, userExtend);
        }

        //返回模板列表
        public TestModelWrapper[] getTestModelList(String bookId, UserExtend userExtend)
        {
            return cmsWarpWS.getTestModelList(bookId, userExtend);
        }

        //保存考试模板
        public string saveTestModels(TestModelWrapper testModel, string bookId, UserExtend userExtend)
        {
            return cmsWarpWS.saveTestModels(testModel, bookId, userExtend);
        }

        //删除考试模板
        public bool? deleteTestModel(string testModelId, string bookId, UserExtend userExtend)
        {
            return cmsWarpWS.deleteTestModel(testModelId, bookId, userExtend);
        }

        //返回考试模板内容
        public TestSampleWrapper[] getTestSampleListByModel(string testModelId, UserExtend userExtend)
        {
            return cmsWarpWS.getTestSampleListByModel(testModelId, userExtend);
        }

        //保存考试模板内容
        public bool? saveTestSamples(TestSampleWrapper[] testSamples, string testModelId, UserExtend userExtend)
        {
            return cmsWarpWS.saveTestSamples(testSamples, testModelId, userExtend);
        }

        //智能组卷得到试题
        public QuestionWrapper[] getQuestionListByTestSample(TestSampleWrapper[] testSamples, String[] structureIds, String[] loIds, String difficulty, UserExtend userExtend)
        {
            return cmsWarpWS.getQuestionListByTestSample(testSamples, structureIds, loIds, difficulty, userExtend);
        }

        //根据范围得到试题的Id
        public String[] getQuestionListByStructureAndLo(String testQuestionTypeId, String[] structureIds, String[] loIds, String[] questionIds, UserExtend userExtend)
        {
            return cmsWarpWS.getQuestionListByStructureAndLo(testQuestionTypeId, structureIds, loIds, questionIds, userExtend);
        }

        //换题
        public QuestionWrapper[] getQuestionListByQuestion(String questionId, String testQuestionTypeId, UserExtend userExtend)
        {
            return cmsWarpWS.getQuestionListByQuestion(questionId, testQuestionTypeId, userExtend);
        }

        //根据questionId集合 把这些questionId集合归类，让相同的loid为一组
        public anyType2anyTypeMapEntry[] getLoIdQuestionIdsForQuestionIds(String[] questionIds, UserExtend userExtend)
        {
            return cmsWarpWS.getLoIdQuestionIdsForQuestionIds(questionIds, userExtend);
        }

        public string[] loIdsSink(string loId, UserExtend userExtend)
        {
            return cmsWarpWS.loIdsSink(loId, userExtend);
        }

    }
}
