using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Collections;
using JEWS;
using JEWS.EngineClient;
using JEWS.EngineStudyGuide;
using System.IO;

/// <summary>
/// CmsWS 的摘要说明
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// 若要允许使用 ASP.NET AJAX 从脚本中调用此 Web 服务，请取消注释以下行。 
[System.Web.Script.Services.ScriptService]
public class CmsWS : System.Web.Services.WebService
{

    public CmsWS()
    {
        //如果使用设计的组件，请取消注释以下行 
        //InitializeComponent(); 
    }

    [WebMethod(Description = "返回SimpleUser", EnableSession = true)]
    public JEWS.EngineClient.UserExtend getSimpleUser(string userId, string sectionId)
    {
        JEWS.EngineClient.UserExtend simpleUser = JEWS.SessionManage.SimpleUser;
        if (simpleUser != null && simpleUser.sectionId != sectionId)
        {
            JEWS.SessionManage.SimpleUser = new UserEngine().usersByUserIdSectionId(simpleUser.userId, sectionId, simpleUser);
            return JEWS.SessionManage.SimpleUser;
        }

        return JEWS.SessionManage.SimpleUser;
    }

    [WebMethod(Description = "得到某个题已存在的种子", EnableSession = true)]
    public String[] getQpvSeedList(String questionId)
    {
        return new CmsEngine().getQpvSeedList(questionId);
    }

    [WebMethod(Description = "根据种子值集合得到question的参数值 ,比如在查看某个题有多少个种子的时候，再根据这个种子来显示一个题出来", EnableSession = true)]
    public QuestionAlgorithmValueWrapper[] getQuestionAlgorithmValueQpvSeedIds(String[] qpvSeedIds, String questionId)
    {
        return new CmsEngine().getQuestionAlgorithmValueQpvSeedIds(qpvSeedIds, questionId);
    }


    [WebMethod(Description = "对某个活动题默认生成几套种子", EnableSession = true)]
    public bool? saveQpvSeedByQuestionIds(String[] questionIds, String num, JEWS.EngineClient.UserExtend userExtendWrapper)
    {
        JEWS.EngineStudyGuide.UserExtend userExtend = TOOLS.ObjectUtil.CopyObjectPoperty<JEWS.EngineStudyGuide.UserExtend, JEWS.EngineClient.UserExtend>(SessionManage.SimpleUser);
        return new CmsEngine().saveQpvSeedByQuestionIds(questionIds, num, userExtend);
    }

    [WebMethod(Description = "保存种子", EnableSession = true)]
    public bool? saveQpvSeed(QuestionAlgorithmValueWrapper[] qavs, String questionId)
    {
        return new CmsEngine().saveQpvSeed(qavs, questionId);
    }

    [WebMethod(Description = "删除种子", EnableSession = true)]
    public bool? removeQpvSeed(String qpvSeedId)
    {
        return new CmsEngine().removeQpvSeed(qpvSeedId);
    }

    [WebMethod(Description = "根据questionId生成一个不同于已存在的种子的参数值", EnableSession = true)]
    public QuestionAlgorithmValueWrapper[] getQuestionAlgorithmValueAuto(QuestionAlgorithmWrapper[] qaWs, String questionId)
    {
        return new CmsEngine().getQuestionAlgorithmValueAuto(qaWs, questionId);
    }

    [WebMethod(Description = "根据questionId集合返回相应question", EnableSession = true)]
    public QuestionWrapper[] getQuestions(String[] questionIds, JEWS.EngineStudyGuide.UserExtend usersExtendWrapper)
    {
        return new StudyGuideEngine().getQuestions(questionIds, usersExtendWrapper);
    }


    [WebMethod(Description = "返回对应question下面的答案", EnableSession = true)]
    public ReferenceAnswersWrapper[] getReferenceAnswersList(string questionId, string qpvSeedId, JEWS.EngineStudyGuide.UserExtend usersExtendWrapper)
    {
        return new StudyGuideEngine().getReferenceAnswersList(questionId, qpvSeedId, usersExtendWrapper);
    }

    [WebMethod(Description = "得到BookStructure集合", EnableSession = true)]
    public object[] getBookStructureArray(String isbn, bool isLazy)
    {
        JEWS.EngineStudyGuide.UserExtend userExtend = TOOLS.ObjectUtil.CopyObjectPoperty<JEWS.EngineStudyGuide.UserExtend, JEWS.EngineClient.UserExtend>(SessionManage.SimpleUser);
        return CmsManage.getBookStructureArray(isbn, isLazy, userExtend);
    }

    [WebMethod(Description = "Question管理中得到BookStructure集合", EnableSession = true)]
    public object[] getBookStructureArrayForQuestionManage(string isbn, string exCurriculumId, bool isLazy)
    {
        JEWS.EngineStudyGuide.UserExtend userExtend = TOOLS.ObjectUtil.CopyObjectPoperty<JEWS.EngineStudyGuide.UserExtend, JEWS.EngineClient.UserExtend>(SessionManage.SimpleUser);
        return CmsManage.getBookStructureArrayForQuestionManage(isbn, exCurriculumId, isLazy, userExtend);
    }

    [WebMethod(Description = "合并知识点", EnableSession = true)]
    public bool? mergeKnowledgePoint(String targetKpId, String[] sourceKpId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().mergeKnowledgePoint(targetKpId, sourceKpId, userExtend);
    }


    [WebMethod(Description = "得到Book Structure Type列表", EnableSession = true)]
    public BookStructureTypeWrapper[] getBookStructureTypeList(string isbn)
    {
        JEWS.EngineStudyGuide.UserExtend userExtend = TOOLS.ObjectUtil.CopyObjectPoperty<JEWS.EngineStudyGuide.UserExtend, JEWS.EngineClient.UserExtend>(JEWS.SessionManage.SimpleUser);
        return new CmsEngine().getBookStructureTypeList(isbn, userExtend);
    }

    [WebMethod(Description = "得到未用的Book Structure Type列表id", EnableSession = true)]
    public string[] getBookStructureIdsForNoUsed(string isbn, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getBookStructureIdsForNoUsed(isbn, userExtend);
    }

    [WebMethod(Description = "编辑或者保存BookContentStructure", EnableSession = true)]
    public BookContentStructureWrapper[] editAndSaveBookContentStructures(BookContentStructureWrapper[] bookContentStructureWs, String isbn, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().editAndSaveBookContentStructures(bookContentStructureWs, isbn, userExtend);
    }

    [WebMethod(Description = "BookContentStructure排序", EnableSession = true)]
    public BookContentStructureWrapper[] sortBookContentStructures(BookContentStructureWrapper[] bookContentStructureWs, String isbn, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().sortBookContentStructures(bookContentStructureWs, isbn, userExtend);
    }

    [WebMethod(Description = "删除BookContentStructure对象", EnableSession = true)]
    public bool? deleteBookContentStructure(BookContentStructureWrapper bookContentStructure, string isbn, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().deleteBookContentStructure(bookContentStructure, isbn, userExtend);
    }

    [WebMethod(Description = "根据ISBN得到书", EnableSession = true)]
    public BookWrapper getBookByISBN(string isbn)
    {
        return new StudyGuideEngine().getBookByISBN(isbn);
    }

    [WebMethod(Description = "LearningObjective排序", EnableSession = true)]
    public LearningObjectiveCmsWrapper[] editLearningObjectiveCmsBySort(LearningObjectiveCmsWrapper[] locs, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().editLearningObjectiveCmsBySort(locs, userExtend);
    }

    [WebMethod(Description = "返回学科类别", EnableSession = true)]
    public DisciplineWrapper[] getDisciplineList(JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getDisciplineList(userExtend);
    }

    [WebMethod(Description = "返回阶段列表", EnableSession = true)]
    public GradationWrapper[] getGradationList(JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getGradationList(userExtend);
    }

    [WebMethod(Description = "返回所有学科", EnableSession = true)]
    public SubjectWrapper[] getSubjectList(JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getSubjectList(userExtend);
    }

    [WebMethod(Description = "返回指定类别的学科", EnableSession = true)]
    public SubjectWrapper[] getSubjectListByDisciplineId(string disciplineId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getSubjectListByDisciplineId(disciplineId, userExtend);
    }

    [WebMethod(Description = "返回出版社", EnableSession = true)]
    public PublisherWrapper[] getPublisherList(JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getPublisherList(userExtend);
    }

    [WebMethod(Description = "保存书信息", EnableSession = true)]
    public BookWrapper saveBook(BookWrapper bookW, String[] authorWs, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().saveBook(bookW, null, userExtend);
    }

    [WebMethod(Description = "编辑书", EnableSession = true)]
    public BookWrapper editBook(BookWrapper bookW, String[] authorWs, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        CmsEngine ce = new CmsEngine();

        //得到旧的封面图片
        string oldCoverImg = "";
        BookWrapper[] bws = ce.getBookListByBookIds(new string[] { bookW.id }, userExtend);
        if (bws != null && bws.Length > 0)
        {
            oldCoverImg = bws[0].bookConverIngLg;
        }

        BookWrapper rt =  new CmsEngine().editBook(bookW, null, userExtend);
        if (rt != null && !string.IsNullOrEmpty(oldCoverImg) && rt.bookConverIngLg != oldCoverImg)
        {
            //删除旧的封面图片
            string imgPath = Server.MapPath("/Uploads/bookCover/") + oldCoverImg;
            if (File.Exists(imgPath))
            {
                File.Delete(imgPath);
            }
        }

        return rt;
    }

    [WebMethod(Description = "删除book", EnableSession = true)]
    public bool? deleteBook(BookWrapper bookW, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().deleteBook(bookW, userExtend);
    }

    [WebMethod(Description = "保存学科类别", EnableSession = true)]
    public DisciplineWrapper saveDiscipline(DisciplineWrapper disciplineW, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().saveDiscipline(disciplineW, userExtend);
    }

    [WebMethod(Description = "编辑学科类别", EnableSession = true)]
    public DisciplineWrapper editDiscipline(DisciplineWrapper disciplineW, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().editDiscipline(disciplineW, userExtend);
    }

    [WebMethod(Description = "保存阶段", EnableSession = true)]
    public bool? saveGradation(GradationWrapper gradationW, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().saveGradationList(new GradationWrapper[1] { gradationW }, userExtend);
    }

    [WebMethod(Description = "编辑阶段", EnableSession = true)]
    public bool? editGradation(GradationWrapper gradationW, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().saveGradationList(new GradationWrapper[1] { gradationW }, userExtend);
    }


    [WebMethod(Description = "删除学科类别", EnableSession = true)]
    public bool? deleteDiscipline(DisciplineWrapper disciplineW, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().deleteDiscipline(disciplineW, userExtend);
    }

    [WebMethod(Description = "删除阶段", EnableSession = true)]
    public bool? deleteGradation(string gradationId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().deleteGradation(gradationId, userExtend);
    }


    [WebMethod(Description = "保存学科信息", EnableSession = true)]
    public SubjectWrapper saveSubject(SubjectWrapper subjectW, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().saveSubject(subjectW, userExtend);
    }

    [WebMethod(Description = "编辑学科信息", EnableSession = true)]
    public SubjectWrapper editSubject(SubjectWrapper subjectW, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().editSubject(subjectW, userExtend);
    }

    [WebMethod(Description = "删除学科信息", EnableSession = true)]
    public bool? deleteSubject(SubjectWrapper subjectW, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().deleteSubject(subjectW, userExtend);
    }

    [WebMethod(Description = "保存出版社信息", EnableSession = true)]
    public PublisherWrapper savePublisher(PublisherWrapper publisherW, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().savePublisher(publisherW, userExtend);
    }

    [WebMethod(Description = "编辑出版社信息", EnableSession = true)]
    public PublisherWrapper editPublisher(PublisherWrapper publisherW, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().editPublisher(publisherW, userExtend);
    }

    [WebMethod(Description = "删除出版社信息", EnableSession = true)]
    public bool? deletePublisher(PublisherWrapper publisherW, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().deletePublisher(publisherW, userExtend);
    }

   

    [WebMethod(Description = "编辑BookStructureType", EnableSession = true)]
    public BookStructureTypeWrapper[] manageBookStructureType(BookStructureTypeWrapper[] bsts, String isbn, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new StudyGuideEngine().manageBookStructureType(bsts, isbn, userExtend);
    }


    [WebMethod(Description = "删除BookStructureType", EnableSession = true)]
    public bool? deleteBookStructureType(BookStructureTypeWrapper bookStructureTypeW, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().deleteBookStructureType(bookStructureTypeW, userExtend);
    }

    [WebMethod(Description = "保存学习资料类型", EnableSession = true)]
    public StudyReferenceTypeWrapper saveStudyReferenceType(StudyReferenceTypeWrapper studyReferenceTypeWrapper, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().saveStudyReferenceType(studyReferenceTypeWrapper, userExtend);
    }

    [WebMethod(Description = "编辑学习资料类型", EnableSession = true)]
    public StudyReferenceTypeWrapper editStudyReferenceType(StudyReferenceTypeWrapper studyReferenceTypeWrapper, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().editStudyReferenceType(studyReferenceTypeWrapper, userExtend);
    }

    [WebMethod(Description = "删除学习资料类型", EnableSession = true)]
    public bool? deleteStudyReferenceType(StudyReferenceTypeWrapper studyReferenceTypeWrapper, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().deleteStudyReferenceType(studyReferenceTypeWrapper, userExtend);
    }

    [WebMethod(Description = "返回题型", EnableSession = true)]
    public TestQuestionTypeWrapper[] getTestQuestionTypeListBySubject(String subjectId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getTestQuestionTypeListBySubject(subjectId, userExtend);
    }

    [WebMethod(Description = "添加题型", EnableSession = true)]
    public TestQuestionTypeWrapper saveTestQuestionType(TestQuestionTypeWrapper testQuestionTypeW, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().saveTestQuestionType(testQuestionTypeW, userExtend);
    }

    [WebMethod(Description = "编辑题型", EnableSession = true)]
    public TestQuestionTypeWrapper editTestQuestionType(TestQuestionTypeWrapper testQuestionTypeW, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().editTestQuestionType(testQuestionTypeW, userExtend);
    }

    [WebMethod(Description = "", EnableSession = true)]
    public TestQuestionTypeWrapper[] getTestQuestionTypeByIdsList(String[] testQuestionTypeIds, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getTestQuestionTypeByIdsList(testQuestionTypeIds, userExtend);
    }

    [WebMethod(Description = "", EnableSession = true)]
    public TestQuestionTypeWrapper[] getTestQuestionTypeSystemList(JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getTestQuestionTypeSystemList(userExtend);
    }

    [WebMethod(Description = "", EnableSession = true)]
    public bool? manageTestQuestionTypes(TestQuestionTypeWrapper[] testQuestionTypes, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().manageTestQuestionTypes(testQuestionTypes, userExtend);
    }

    [WebMethod(Description = "删除题型", EnableSession = true)]
    public bool? deleteTestQuestionType(TestQuestionTypeWrapper testQuestionTypeW, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().deleteTestQuestionType(testQuestionTypeW, userExtend);
    }

    [WebMethod(Description = "", EnableSession = true)]
    public TestQuestionTypeWrapper[] getTestQuestionTypeBookList(String bookId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getTestQuestionTypeBookList(bookId, userExtend);
    }

    [WebMethod(Description = "", EnableSession = true)]
    public TestQuestionTypeWrapper[] getTestQuestionTypeBookByIdsList(String[] testQuestionTypeIds, String bookId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getTestQuestionTypeBookByIdsList(testQuestionTypeIds, bookId, userExtend);
    }

    [WebMethod(Description = "", EnableSession = true)]
    public bool? manageTestQuestionTypeBooks(TestQuestionTypeWrapper[] testQuestionTypes, String bookId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().manageTestQuestionTypeBooks(testQuestionTypes, bookId, userExtend);
    }

    [WebMethod(Description = "", EnableSession = true)]
    public bool? deleteTestQuestionTypeBook(TestQuestionTypeWrapper testQuestionType, String bookId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().deleteTestQuestionTypeBook(testQuestionType, bookId, userExtend);
    }

    [WebMethod(Description = "返回学习资料相关的知识点", EnableSession = true)]
    public LoStudyReferenceWrapper[] getLoStudyReferenceList(String studyReferenceId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getLoStudyReferenceList(studyReferenceId, userExtend);
    }

    [WebMethod(Description = "保存学习资料相关的知识点", EnableSession = true)]
    public bool? saveLoStudyReference(LoStudyReferenceWrapper[] loStudyReferences, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().saveLoStudyReference(loStudyReferences, userExtend);
    }

    [WebMethod(Description = "更新学习资料相关的知识点", EnableSession = true)]
    public bool? updateLoStudyReference(String studyReferenceId, LoStudyReferenceWrapper[] loStudyReferences, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().updateLoStudyReference(studyReferenceId, loStudyReferences, userExtend);
    }

    [WebMethod(Description = "返回CMS功能列表", EnableSession = true)]
    public IList<object> GetCmsFunctions(string userId)
    {
        return JEWS.UserPermissions.GetCmsFunctions(userId);
    }

    [WebMethod(Description = "获得内容管理员权限", EnableSession = true)]
    public IList<object> GetContentAdminFunctions(string userId, string instituteAdminId)
    {
        return JEWS.UserPermissions.GetContentAdminFunctions(userId, instituteAdminId);
    }

    [WebMethod(Description = "返回当前用户的功能权限", EnableSession = true)]
    public IList<object> GetFuncPermissions()
    {
        return JEWS.SessionManage.FuncPermissions;
    }

    [WebMethod(Description = "设置用户权限", EnableSession = true)]
    public bool? manageUserPrivilege(UserPrivilegeWrapper[] userPrivilegeWs, String userId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().manageUserPrivilege(userPrivilegeWs, userId, userExtend);
    }

    [WebMethod(Description = "返回CMS内容权限列表", EnableSession = true)]
    public IList<object> GetCmsContents(string userId)
    {
        return JEWS.UserPermissions.GetCmsContents(userId);
    }

    [WebMethod(Description = "获得内容管理员的内容权限", EnableSession = true)]
    public IList<object> GetContentAdminContent(string userId, string instituteAdminId)
    {
        return JEWS.UserPermissions.GetContentAdminContent(userId, instituteAdminId);
    }

    [WebMethod(Description = "保存用户功能权限", EnableSession = true)]
    public bool? SaveFuncPermissions(UserPrivilegeWrapper funcPermissions, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return JEWS.UserPermissions.SaveFuncPermissions(funcPermissions, userExtend);
    }

    [WebMethod(Description = "保存用户内容权限", EnableSession = true)]
    public bool? SaveContentPermissions(UserPrivilegeWrapper[] contentPermissions, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return JEWS.UserPermissions.SaveContentPermissions(contentPermissions, userExtend);
    }

    [WebMethod(Description = "根据ISBN查询书", EnableSession = true)]
    public BookWrapper getBookWrapperByISBN(string isbn)
    {
        return new CmsEngine().getBook(isbn);
    }

    [WebMethod(Description = "返回用户的书的Id", EnableSession = true)]
    public string[] getBookIdList(string userId, string[] instituteIds, string[] disciplineIds, string[] subjectIds, bool? realFlag, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getBookIdList(userId, instituteIds, disciplineIds, subjectIds, realFlag, userExtend);
    }

    [WebMethod(Description = "返回指定的书", EnableSession = true)]
    public BookWrapper[] getBookListByBookIds(string[] bookIds, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getBookListByBookIds(bookIds, userExtend);
    }

    [WebMethod(Description = "返回用户的书", EnableSession = true)]
    public BookWrapper[] getBookList(string userId, string[] instituteIds, string[] disciplineIds, string[] subjectIds, bool? realFlag, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return JEWS.CmsManage.getBookList(userId, instituteIds, disciplineIds, subjectIds, realFlag, userExtend);
    }

    [WebMethod(Description = "根据id集合得到学习资料", EnableSession = true)]
    public StudyReferenceWrapper[] getStudyReferenceByIdsList(string[] ids, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new JEWS.StudyGuideEngine().getStudyReferenceByIdsList(ids, userExtend);
    }

    [WebMethod(Description = "同步题", EnableSession = true)]
    public bool? removeLoQuestionForLoIds(string[] loIds, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().removeLoQuestionForLoIds(loIds, userExtend);
    }

    [WebMethod(Description = "内容编辑历史", EnableSession = true)]
    public ArrayList getContentEditHistory(String contentId, String contentType, String bookId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return JEWS.CmsManage.getContentEditHistory(contentId, contentType, bookId, userExtend);
    }

  

    [WebMethod(Description = "编辑内容编辑历史", EnableSession = true)]
    public bool? editContentEditHistory(ContentEditHistoryWrapper contentEditHistoryW, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().editContentEditHistory(contentEditHistoryW, userExtend);
    }
    [WebMethod(Description = "得到某个操作项的某内容类型的Id", EnableSession = true)]
    public string[] listByContentOperation(String contentType, String operationType, String userId, String bookId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().listByContentOperation(contentType, operationType, userId, bookId, userExtend);
    }

    [WebMethod(Description = "根据bookId得到questionId集合", EnableSession = true)]
    public string[] getQuestionIdsByBookId(String bookId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getQuestionIdsByBookId(bookId, userExtend);
    }

    [WebMethod(Description = "查询没有生成种子的活动题", EnableSession = true)]
    public string[] getQuestionIdsForNoSeed(String bookId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getQuestionIdsForNoSeed(bookId, userExtend);
    }

   

    [WebMethod(Description = "根据bookId得到学习资料Id集合", EnableSession = true)]
    public string[] getStudyReferenceIdsForBookIds(String bookId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getStudyReferenceIdsForBookIds(bookId, userExtend);
    }

    [WebMethod(Description = "根据bookId得到知识点Id集合", EnableSession = true)]
    public string[] getLearningObjectiveIdsForBookId(string bookId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getLearningObjectiveIdsForBookId(bookId, userExtend);
    }

    [WebMethod(Description = "根据知识点Id集合得到知识点集合", EnableSession = true)]
    public LearningObjectiveCmsWrapper[] getLearningObjectiveForLoIds(string[] loIds, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getLearningObjectiveForLoIds(loIds, userExtend);
    }

    [WebMethod(Description = "返回未审核的题", EnableSession = true)]
    public string[] getUnauditedQuestionIds(string userId, String bookId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return JEWS.CmsManage.getUnauditedQuestionIds(userId, bookId, userExtend);
    }

    [WebMethod(Description = "返回未审核的知识点", EnableSession = true)]
    public string[] getUnauditedLearningObjectiveIds(string userId, string bookId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return JEWS.CmsManage.getUnauditedLearningObjectiveIds(userId, bookId, userExtend);
    }

    [WebMethod(Description = "返回未审核的学习资料", EnableSession = true)]
    public string[] getUnauditedStudyReferenceIds(string userId, string bookId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return JEWS.CmsManage.getUnauditedStudyReferenceIds(userId, bookId, userExtend);
    }

    [WebMethod(Description = "question查询", EnableSession = true)]
    public string[] getQuestionIdByCondition(string content, string solution, string number, string instructorOnly, string typeId
            , string testQuestionTypeId, string algorithmFlag, string sampleFlag, string description, string bookId, string flag, string thinkFlag, string kpFlag, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getQuestionIdByCondition(content, solution, number, instructorOnly, typeId, testQuestionTypeId,
            algorithmFlag, sampleFlag, description, bookId, flag, thinkFlag, kpFlag, userExtend);
    }

    [WebMethod(Description = "知识点查询", EnableSession = true)]
    public string[] getLoIdsByCondition(string name, string description, string bookId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getLoIdsByCondition(name, description, bookId, userExtend);
    }

    [WebMethod(Description = "返回知识点", EnableSession = true)]
    public JEWS.EngineReport.KnowledgeGradesWrapper[] GetKnowledgeGrades(string[] loIds, bool sampleQuestionFlag,string userId, JEWS.EngineReport.UserExtend userExtendWrapper)
    {
        return new ReportEngine().getNormalKnowledgeGradesOfLoList(loIds, sampleQuestionFlag,userId, userExtendWrapper);
    }

    [WebMethod(Description = "保存知识点", EnableSession = true)]
    public LearningObjectiveCmsWrapper[] editLearningObjectiveCmsByGroup(LearningObjectiveCmsWrapper[] locs, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().editLearningObjectiveCmsByGroup(locs, userExtend);
    }

    [WebMethod(Description = "得到真实书所关联的原书", EnableSession = true)]
    public BookWrapper[] getSourceBookListByBookId(String bookId, JEWS.EngineStudyGuide.UserExtend userExtendWrapper)
    {
        return new CmsEngine().getSourceBookListByBookId(bookId, userExtendWrapper);
    }

    [WebMethod(Description = "得到真实书所关联的原书", EnableSession = true)]
    public bool? manageSourceBook(String bookId, String[] sourceBookId, JEWS.EngineStudyGuide.UserExtend userExtendWrapper)
    {
        return new CmsEngine().manageSourceBook(bookId, sourceBookId, userExtendWrapper);
    }

    [WebMethod(Description = "自动保存种子,保存一本书里面还没有保存种子的题", EnableSession = true)]
    public bool? saveQpvSeedByBookId(String bookId, JEWS.EngineStudyGuide.UserExtend usersExtendWrapper)
    {
        return new StudyGuideEngine().saveQpvSeedByBookId(bookId, usersExtendWrapper);
    }

    [WebMethod(Description = "自动保存试卷", EnableSession = true)]
    public bool? saveAutoTest(TestWrapper test, QuestionWrapper[] questions, ReferenceAnswersWrapper[] reAnswers, JEWS.EngineStudyGuide.UserExtend userExtendWrapper)
    {
        return new CmsEngine().saveAutoTest(test, questions, reAnswers, userExtendWrapper);
    }

    [WebMethod(Description = "编辑或者保存一组知识点", EnableSession = true)]
    public LearningObjectiveCmsWrapper[] manageLearningObjectiveCms(LearningObjectiveCmsWrapper[] locs, JEWS.EngineStudyGuide.UserExtend userExtendWrapper)
    {
        return new CmsEngine().manageLearningObjectiveCms(locs, userExtendWrapper);
    }

    [WebMethod(Description = "根据questionID得到question以及他的母题和参考答案", EnableSession = true)]
    public IList getQuestionAndAnwser(string[] questionIds, JEWS.EngineStudyGuide.UserExtend usersExtendWrapper)
    {
        return JEWS.CmsManage.getQuestionAndAnwser(questionIds, usersExtendWrapper);
    }

    [WebMethod(Description = "返回试卷信息", EnableSession = true)]
    public IList getTestPaperData(string bookId, string testId, string userId,JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return JEWS.CmsManage.getTestPaperData(bookId, testId,userId, userExtend);
    }

    [WebMethod(Description = "保存知识点与题的关系", EnableSession = true)]
    public bool? manageLoQuestion(string[] questionIds, LoQuestionWrapper[] loQuestions, JEWS.EngineStudyGuide.UserExtend usersExtendWrapper)
    {
        return new StudyGuideEngine().manageLoQuestion(questionIds, loQuestions, usersExtendWrapper);
    }

    [WebMethod(Description = "查看自己创建的题", EnableSession = true)]
    public string[] getQuestionForUserId(String userId, String bookId, JEWS.EngineStudyGuide.UserExtend usersExtendWrapper)
    {
        return new CmsEngine().getQuestionForUserId(userId, bookId, usersExtendWrapper);
    }

    [WebMethod(Description = "查找全部没有关联知识点的题", EnableSession = true)]
    public string[] getQuestionByNoKpForBookId(string bookId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getQuestionByNoKpForBookId(bookId, userExtend);
    }

    [WebMethod(Description = "查找全部已关联知识点的题", EnableSession = true)]
    public string[] getQuestionByKpForBookId(string bookId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getQuestionByKpForBookId(bookId, userExtend);
    }

    [WebMethod(Description = "查找用户没有关联知识点的题", EnableSession = true)]
    public string[] getQuestionByNoKpForUserId(string userId, string bookId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getQuestionByNoKpForUserId(userId, bookId, userExtend);
    }

    [WebMethod(Description = "查找用户已经关联知识点的题", EnableSession = true)]
    public string[] getQuestionByKpForUserId(string userId, string bookId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getQuestionByKpForUserId(userId, bookId, userExtend);
    }

    [WebMethod(Description = "查找全部未关联知识点的考试", EnableSession = true)]
    public string[] getTestIdsByNoKpForBookId(string bookId, string title, string importFlag, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getTestIdsByNoKpForBookId(bookId, title, importFlag, userExtend);
    }

    [WebMethod(Description = "查找全部已关联知识点的考试", EnableSession = true)]
    public string[] getTestIdsByKpForBookId(string bookId, string title, string importFlag, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getTestIdsByKpForBookId(bookId, title, importFlag, userExtend);
    }

    [WebMethod(Description = "查找用户未关联知识点的考试", EnableSession = true)]
    public string[] getTestIdsByNoKpForUserId(string userId, string bookId, String title, string importFlag, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getTestIdsByNoKpForUserId(userId, bookId, title, importFlag, userExtend);
    }

    [WebMethod(Description = "查找用户已关联知识点的考试", EnableSession = true)]
    public string[] getTestIdsByKpForUserId(string userId, string bookId, String title, string importFlag, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getTestIdsByKpForUserId(userId, bookId, title, importFlag, userExtend);
    }

    [WebMethod(Description = "返回用户创建的试卷", EnableSession = true)]
    public string[] getTestIdsForUserId(string userId, string bookId, string title, string importFlag, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getTestIdsForUserId(userId, bookId, title, importFlag, userExtend);
    }

    [WebMethod(Description = "返回所有试卷", EnableSession = true)]
    public string[] getTestIdsByBookId(string bookId, string title, string importFlag, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getTestIdsByBookId(bookId, title, importFlag, userExtend);
    }

    [WebMethod(Description = "根据testIds集合得到考试", EnableSession = true)]
    public TestWrapper[] getTestListForTestIds(string[] testIds, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getTestListForTestIds(testIds, userExtend);
    }

    [WebMethod(Description = "根据考试查询题", EnableSession = true)]
    public string[] getQuestionForyTest(string testId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getQuestionForyTest(testId, userExtend);
    }

    [WebMethod(Description = "查询考试中未关联知识点的题", EnableSession = true)]
    public string[] getQuestionByNoKpForTestId(string testId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getQuestionByNoKpForTestId(testId, userExtend);
    }

    [WebMethod(Description = "返回模板列表", EnableSession = true)]
    public TestModelWrapper[] getTestModelList(String bookId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getTestModelList(bookId, userExtend);
    }

    [WebMethod(Description = "保存考试模板", EnableSession = true)]
    public string saveTestModels(TestModelWrapper testModel, string bookId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().saveTestModels(testModel, bookId, userExtend);
    }

    [WebMethod(Description = "删除考试模板", EnableSession = true)]
    public bool? deleteTestModel(string testModelId, string bookId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().deleteTestModel(testModelId, bookId, userExtend);
    }

    [WebMethod(Description = "返回考试模板内容", EnableSession = true)]
    public TestSampleWrapper[] getTestSampleListByModel(string testModelId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getTestSampleListByModel(testModelId, userExtend);
    }

    [WebMethod(Description = "保存考试模板内容", EnableSession = true)]
    public bool? saveTestSamples(TestSampleWrapper[] testSamples, string testModelId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().saveTestSamples(testSamples, testModelId, userExtend);
    }

    [WebMethod(Description = "智能组卷得到试题", EnableSession = true)]
    public QuestionWrapper[] getQuestionListByTestSample(TestSampleWrapper[] testSamples, String[] structureIds, String[] loIds, String difficulty, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getQuestionListByTestSample(testSamples, structureIds, loIds, difficulty, userExtend);
    }

    [WebMethod(Description = "根据范围得到试题的", EnableSession = true)]
    public String[] getQuestionListByStructureAndLo(String testQuestionTypeId, String[] structureIds, String[] loIds, String[] questionIds, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getQuestionListByStructureAndLo(testQuestionTypeId, structureIds, loIds, questionIds, userExtend);
    }

    [WebMethod(Description = "换题", EnableSession = true)]
    public QuestionWrapper[] getQuestionListByQuestion(String questionId, String testQuestionTypeId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getQuestionListByQuestion(questionId, testQuestionTypeId, userExtend);
    }

    [WebMethod(Description = "根据questionID得到question以及他的母题", EnableSession = true)]
    public QuestionWrapper[] getQuestionFCList(string[] questionIds, JEWS.EngineStudyGuide.UserExtend usersExtendWrapper)
    {
        return new StudyGuideEngine().getQuestionFCList(questionIds, usersExtendWrapper);
    }

    [WebMethod(Description = "根据母题得到子题", EnableSession = true)]
    public QuestionWrapper[] getSubQuestionListById(String questionId, String qpvSeedId, JEWS.EngineStudyGuide.UserExtend usersExtendWrapper)
    {
        return new StudyGuideEngine().getSubQuestionListById(questionId, qpvSeedId, usersExtendWrapper);
    }

    [WebMethod(Description = "根据母题集合得到子题", EnableSession = true)]
    public QuestionWrapper[] getSubQuestionListByIds(String[] questionIds, String[] qpvSeedIds, JEWS.EngineStudyGuide.UserExtend usersExtendWrapper)
    {
        return new StudyGuideEngine().getSubQuestionListByIds(questionIds, qpvSeedIds, usersExtendWrapper);
    }

    [WebMethod(Description = "保存考试信息和考试题的testQuestion信息", EnableSession = true)]
    public string saveTestQuestion(TestWrapper test, QuestionWrapper[] questions, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new StudyGuideEngine().saveTestQuestion(test, questions, userExtend);
    }

    [WebMethod(Description = "这个修改成编辑试卷", EnableSession = true)]
    public bool? editTestQuestion(TestWrapper test, JEWS.EngineStudyGuide.anyType2anyTypeMapEntry[] htQuestionIdAndScore, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new StudyGuideEngine().editTestQuestion(test, htQuestionIdAndScore, userExtend);
    }

    [WebMethod(Description = "根据questionId集合 把这些questionId集合归类，让相同的loid为一组", EnableSession = true)]
    public JEWS.EngineStudyGuide.anyType2anyTypeMapEntry[] getLoIdQuestionIdsForQuestionIds(String[] questionIds, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getLoIdQuestionIdsForQuestionIds(questionIds, userExtend);
    }

    [WebMethod(Description = "返回知识点与题的关系", EnableSession = true)]
    public IList getLoQuestionArray(String[] questionIds, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return JEWS.CmsManage.getLoQuestionArray(questionIds, userExtend);
    }

    [WebMethod(Description = "自动关联题与知识点关系", EnableSession = true)]
    public bool? manageBsQuestion(string[] questionIds, string structureId, string isbn, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new StudyGuideEngine().manageBsQuestion(questionIds, structureId, isbn, userExtend);
    }

    [WebMethod(Description = "自动识别题相关的知识点，作为参考关联", EnableSession = true)]
    public LearningObjectiveCmsWrapper[] getLearningObjectiveAutoCompatibility(string questionId, string structureId, string isbn, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new StudyGuideEngine().getLearningObjectiveAutoCompatibility(questionId, structureId, isbn, userExtend);
    }

    [WebMethod(Description = "删除试卷", EnableSession = true)]
    public bool? removeTest(string testId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new StudyGuideEngine().removeTest(testId, userExtend);
    }

    [WebMethod(Description = "删除试卷和题", EnableSession = true)]
    public bool? removeTestAndQuestion(string testId, string isbn, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new StudyGuideEngine().removeTestAndQuestion(testId, isbn, userExtend);
    }

    [WebMethod(Description = "根据章节返回知识点", EnableSession = true)]
    public LearningObjectiveCmsWrapper[] getLearningObjectiveWithStructureList(String structureId, String isbn, String exCurriculumId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getLearningObjectiveWithStructureList(structureId, isbn, exCurriculumId, userExtend);
    }

    [WebMethod(Description = "得到该知识点上面一层关联的知识点", EnableSession = true)]
    public LearningObjectiveCmsWrapper[] getLoLoList(String loId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getLoLoList(loId, userExtend);
    }

    [WebMethod(Description = "编辑LO关系", EnableSession = true)]
    public bool? editLoLo(LearningObjectiveCmsWrapper locW, LearningObjectiveCmsWrapper[] locWs, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().editLoLo(locW, locWs, userExtend);
    }

    [WebMethod(Description = "根据书返回知识点", EnableSession = true)]
    public LearningObjectiveCmsWrapper[] getLearningObjectiveWithBookList(string isbn, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getLearningObjectiveWithBookList(isbn, userExtend);
    }

    [WebMethod(Description = "删除知识点", EnableSession = true)]
    public bool? deleteLearningObjectiveCms(LearningObjectiveCmsWrapper locW, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().deleteLearningObjectiveCms(locW, userExtend);
    }


    [WebMethod(Description = "编辑知识点", EnableSession = true)]
    public LearningObjectiveCmsWrapper editLearningObjectiveCms(LearningObjectiveCmsWrapper locW, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().editLearningObjectiveCms(locW, userExtend);
    }

    [WebMethod(Description = "保存知识点", EnableSession = true)]
    public LearningObjectiveCmsWrapper saveLearningObjectiveCms(LearningObjectiveCmsWrapper locW, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().saveLearningObjectiveCms(locW, userExtend);
    }

    [WebMethod(Description = "返回所有Answer Type[Question Type]", EnableSession = true)]
    public QuestionTypeWrapper[] getQuestionTypeList(JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new StudyGuideEngine().getQuestionTypeList(userExtend);
    }

    [WebMethod(Description = "返回所有Question Type[Test Question Type]", EnableSession = true)]
    public TestQuestionTypeWrapper[] getTestQuestionTypeList(string isbn, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new StudyGuideEngine().getTestQuestionTypeList(isbn, userExtend);
    }

    [WebMethod(Description = "返回学习资料类型集合", EnableSession = true)]
    public StudyReferenceTypeWrapper[] getStudyReferenceTypeList(string isbn, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new StudyGuideEngine().getStudyReferenceTypeList(isbn, userExtend);
    }

    [WebMethod(Description = "返回挂在章节或知识点上的学习资料", EnableSession = true)]
    public StudyReferenceWrapper[] getStudyReferenceList(string type, string structureOrLoId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        StudyGuideEngine studyGuideEngine = new StudyGuideEngine();
        if (type == "1")//章节
        {
            return studyGuideEngine.getStudyReferenceForStructureList(structureOrLoId, userExtend);
        }
        else if (type == "0")//知识点
        {
            return studyGuideEngine.getStudyReferenceList(structureOrLoId, userExtend);
        }
        return null;
    }

    [WebMethod(Description = "保存学习资料", EnableSession = true)]
    public bool saveStudyReference(StudyReferenceWrapper studyReferenceWrapper, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        StudyReferenceWrapper sr= new StudyGuideEngine().saveStudyReference(studyReferenceWrapper, userExtend); ;
        return sr != null ? true : false;
    }

    [WebMethod(Description = "编辑学习资料 new", EnableSession = true)]
    public StudyReferenceWrapper updateStudyReference(StudyReferenceWrapper newStudyReferenceWrapper, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new StudyGuideEngine().updateStudyReference(newStudyReferenceWrapper, userExtend);
    }

    [WebMethod(Description = "删除学习资料", EnableSession = true)]
    public bool? deleteStudyReference(StudyReferenceWrapper studyReferenceWrapper, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new StudyGuideEngine().deleteStudyReference(studyReferenceWrapper, userExtend);
    }

    [WebMethod(Description = "根据StructureId返回questionIds", EnableSession = true)]
    public string[] getQuestionIdsForStructureId(String structureId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new StudyGuideEngine().getQuestionIdsForStructureId(structureId, userExtend);
    }

    [WebMethod(EnableSession = true)]
    public string[] getQuestionIdsNoKpForStructureId(String structureId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new StudyGuideEngine().getQuestionIdsNoKpForStructureId(structureId, userExtend);
    }

    [WebMethod(Description = "删除Question", EnableSession = true)]
    public bool? deleteQuestions(QuestionWrapper[] questionWrapperArray, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new StudyGuideEngine().deleteQuestions(questionWrapperArray, userExtend);
    }

    [WebMethod(Description = "保存Question", EnableSession = true)]
    public QuestionWrapper[] saveQuestion(QuestionWrapper[] questionWrapperArray, LoQuestionWrapper[] loQuestionWrapperArray, ReferenceAnswersWrapper[] referenceAnswerWrapperArray, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new StudyGuideEngine().saveQuestion(questionWrapperArray, loQuestionWrapperArray, referenceAnswerWrapperArray, userExtend);
    }

    [WebMethod(Description = "保存Question", EnableSession = true)]
    public QuestionWrapper[] updateQuestion(QuestionWrapper[] questionWrapperArray, LoQuestionWrapper[] loQuestionWrapperArray, ReferenceAnswersWrapper[] referenceAnswerWrapperArray, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new StudyGuideEngine().updateQuestion(questionWrapperArray, loQuestionWrapperArray, referenceAnswerWrapperArray, userExtend);
    }

    [WebMethod(Description = "题预览", EnableSession = true)]
    public ArrayList getQuestionView(QuestionWrapper question, ReferenceAnswersWrapper[] ras, QuestionAlgorithmWrapper[] qas, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new StudyGuideEngine().getQuestionView(question, ras, qas, userExtend);
    }

    [WebMethod(Description = "返回Question的所有Question Lo", EnableSession = true)]
    public LoQuestionWrapper[] getLoQuestionList(string questionId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new StudyGuideEngine().getLoQuestionList(questionId, userExtend);
    }

    [WebMethod(Description = "Question管理中根据questionId得到Question信息", EnableSession = true)]
    public QuestionWrapper getQuestionEdit(string questionId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new StudyGuideEngine().getQuestionEdit(questionId, userExtend);
    }

    [WebMethod(Description = "检查活动题参数值", EnableSession = true)]
    public QuestionAlgorithmValueWrapper[] checkQuestionAlgorithmValues(QuestionAlgorithmWrapper[] questionAlgorithms, string questionId)
    {
        return new StudyGuideEngine().checkQuestionAlgorithmValues(questionAlgorithms, questionId);
    }

    [WebMethod(Description = "保存活动题参数", EnableSession = true)]
    public bool? saveUpdateQuestionAlgorithm(QuestionAlgorithmWrapper[] qaWs, string questionId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().saveUpdateQuestionAlgorithm(qaWs, questionId, userExtend);
    }

    [WebMethod(Description = "返回活动题参数列表", EnableSession = true)]
    public QuestionAlgorithmWrapper[] getQuestionAlgorithmList(string questionId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getQuestionAlgorithmList(questionId, userExtend);
    }

    [WebMethod(Description = "根据自增量Id返回活动题参数列表", EnableSession = true)]
    public QuestionAlgorithmWrapper[] getQuestionAlgorithmByNbList(string number, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().getQuestionAlgorithmByNbList(number, userExtend);
    }

    [WebMethod(Description = "根据一组number或一个得到question集合", EnableSession = true)]
    public QuestionWrapper[] getQuestionByNumber(string[] numbers, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new StudyGuideEngine().getQuestionByNumber(numbers, userExtend);
    }

    [WebMethod(Description = "更新question基本信息", EnableSession = true)]
    public bool updateQuestionInfo(QuestionWrapper[] questions, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        StudyGuideEngine studyGuideEngine = new StudyGuideEngine();
        bool boo = (bool)studyGuideEngine.updateQuestionInfo(questions, userExtend);
        studyGuideEngine.Dispose();
        return boo;
    }

    [WebMethod(EnableSession = true)]
    public QuestionWrapper[] getQuestionForIds(string[] questionIds, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new StudyGuideEngine().getQuestions(questionIds, userExtend);
    }

    [WebMethod(Description = "得到结构名称", EnableSession = true)]
    public string bookStructureName(string structureId, string isbn, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new StudyGuideEngine().bookStructureName(structureId, isbn, userExtend);
    }

    [WebMethod(Description = "根据学习资料ID集合得到学习资料")]
    public JEWS.EngineStudyGuide.StudyReferenceWrapper[] getStudyReferenceWrapperList(string[] referenceIds, JEWS.EngineStudyGuide.UserExtend usersExtendWrapper)
    {
        return new JEWS.StudyGuideEngine().getStudyReferenceByIdsList(referenceIds, usersExtendWrapper);
    }

    [WebMethod(Description = "返回某道题下面根据不同种子生成的题和对应种子题的答案", EnableSession = true)]
    public IList getQuestionAndReferenceAnswersSeedList(string questionId, bool existFlag, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return JEWS.TestManage.getQuestionAndReferenceAnswersSeedList(questionId, existFlag, userExtend);
    }

    [WebMethod(Description = "根据学习资料ID集合得到学习资料")]
    public string[] loIdsSink(string loId, JEWS.EngineStudyGuide.UserExtend userExtend)
    {
        return new CmsEngine().loIdsSink(loId, userExtend);
    }
}
