using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections;
using JEWS.EngineClient;
using JEWS.EngineStudyGuide;

namespace JEWS
{
    public class CmsManage
    {
        /// <summary>
        /// 得到BookStructure集合
        /// </summary>
        /// <param name="isbn"></param>
        /// <param name="userExtend"></param>
        /// <param name="isLazy">确定知识点否是为延迟加载节点</param>
        /// <returns></returns>
        public static object[] getBookStructureArray(String isbn, bool isLazy, JEWS.EngineStudyGuide.UserExtend userExtend)
        {
            return getBookStructureObjectArray(isbn, isLazy, true, null, userExtend);
        }

        public static object[] getBookStructureArrayForQuestionManage(String isbn, String exCurriculumId, bool isLazy, JEWS.EngineStudyGuide.UserExtend userExtend)
        {
            return getBookStructureObjectArray(isbn, isLazy, false, exCurriculumId, userExtend);
        }

        /// <summary>
        /// 得到BookStructure集合
        /// </summary>
        /// <param name="isbn"></param>
        /// <param name="userExtend"></param>
        /// <param name="isLazy">确定知识点否是为延迟加载节点</param>
        /// <returns></returns>
        private static object[] getBookStructureObjectArray(String isbn, bool isLazy, bool allFlag, string exCurriculumId, JEWS.EngineStudyGuide.UserExtend userExtend)
        {
            object[] retArr = new object[2];
            CmsEngine cmsEngine = new CmsEngine();

            //获取bookStructure信息
            BookContentStructureWrapper[] bookStructureExtendWrapperArray = null;

            if (allFlag)
            {
                bookStructureExtendWrapperArray = cmsEngine.getBookContentStructureAllNoKPList(isbn, userExtend);
            }
            else
            {
                bookStructureExtendWrapperArray = cmsEngine.getBookContentStructureNoKPTrueList(isbn, exCurriculumId, userExtend);
            }

            if (bookStructureExtendWrapperArray != null && bookStructureExtendWrapperArray.Length > 0)
            {
                //找到BookContentStructures中的book对象
                BookContentStructureWrapper book = getBookForBookContentStructure(bookStructureExtendWrapperArray);

                if (book != null)
                {
                    //创建book节点
                    IDictionary<string, object> bookStructure = new Dictionary<string, object>();
                    bookStructure.Add("title", book.title);
                    bookStructure.Add("key", book.contentId);
                    bookStructure.Add("bookId", book.bookId);
                    bookStructure.Add("structureLevel", book.structureTypeLevel);
                    bookStructure.Add("tooltip", book.structureTypeName);
                    bookStructure.Add("unit", "");
                    if (book.structureTypeLevel == "10")
                    {
                        bookStructure.Add("isLazy", true);
                    }
                    else
                    {
                        bookStructure.Add("expand", true);
                    }

                    AddChildAction addChild = null;
                    if (isLazy)
                    {
                        addChild = addChildNodeLazy;
                    }
                    else
                    {
                        addChild = addChildNode;
                    }
                    buildBookStructureNodes(bookStructure, bookStructureExtendWrapperArray, 1, addChild);

                    if (!bookStructure.ContainsKey("isFolder"))
                    {
                        bookStructure.Add("isFolder", true);
                    }
                    retArr[0] = bookStructure;  //节点数据
                    retArr[1] = bookStructureExtendWrapperArray; //BookStructure原始数据
                }
            }

            return retArr;
        }

        /// <summary>
        /// 构造BookStructure的树形结构
        /// </summary>
        /// <param name="parentNode">父节点</param>
        /// <param name="arrOriginal">源数据</param>
        /// <param name="targets">目标数据</param>
        /// <param name="depth">树的深度</param>
        private static void buildBookStructureNodes(IDictionary<string, object> parentNode, BookContentStructureWrapper[] arrOriginal, byte depth, AddChildAction addChild)
        {
            //筛选子节点数据
            string parentId = parentNode["key"].ToString();
            BookContentStructureWrapper[] bcsws = (from inst in arrOriginal where inst.parentId == parentId select inst).ToArray();
            if (bcsws.Length != 0)
            {
                depth++;
            }
            else
            {
                return;
            }

            //可以在数据源(arrOriginal)中删除已经筛选出的节点以减少比较次数


            //确定父节点包含子节点时需要设置相关属性
            IList<object> childNodes = new List<object>();
            parentNode.Add("children", childNodes);
            parentNode.Add("isFolder", true);

            IDictionary<string, object> currNode = null;
            foreach (BookContentStructureWrapper bcsw in bcsws)
            {
                currNode = addChild(bcsw, childNodes, depth);
                buildBookStructureNodes(currNode, arrOriginal, depth, addChild);
            }
        }

        /// <summary>
        /// 添加孩子节点的方法
        /// </summary>
        /// <param name="bcsw"></param>
        /// <param name="childNodes"></param>
        /// <param name="depth"></param>
        /// <returns></returns>
        public delegate IDictionary<string, object> AddChildAction(BookContentStructureWrapper bcsw, IList<object> childNodes, byte depth);

        /// <summary>
        /// 添加子节点
        /// </summary>
        /// <param name="bcsw">数据</param>
        /// <param name="childNodes">子节点数组</param>
        /// <param name="depth">树的深度</param>
        /// <returns></returns>
        private static IDictionary<string, object> addChildNode(BookContentStructureWrapper bcsw, IList<object> childNodes, byte depth)
        {
            IDictionary<string, object> node = new Dictionary<string, object>();
            node.Add("title", bcsw.unit + " " + bcsw.title);
            node.Add("key", bcsw.contentId);
            node.Add("tooltip", bcsw.structureTypeName);
            node.Add("structureLevel", bcsw.structureTypeLevel);
            node.Add("unit", bcsw.unit);
            childNodes.Add(node);
            return node;
        }

        /// <summary>
        /// 添加子节点（延迟加载）
        /// </summary>
        /// <param name="bcsw">数据</param>
        /// <param name="childNodes">子节点数组</param>
        /// <param name="depth">树的深度</param>
        /// <returns></returns>
        private static IDictionary<string, object> addChildNodeLazy(BookContentStructureWrapper bcsw, IList<object> childNodes, byte depth)
        {
            IDictionary<string, object> node = new Dictionary<string, object>();
            node.Add("title", bcsw.unit + " " + bcsw.title);
            node.Add("key", bcsw.contentId);
            node.Add("tooltip", bcsw.structureTypeName);
            node.Add("structureLevel", bcsw.structureTypeLevel);
            node.Add("unit", bcsw.unit);
            if (bcsw.structureTypeLevel == "10")
            {
                node.Add("isLazy", true);   //添加延迟属性
                node.Add("isFolder", true);
            }
            childNodes.Add(node);
            return node;
        }

        //找到BookContentStructures中的book对象
        private static BookContentStructureWrapper getBookForBookContentStructure(BookContentStructureWrapper[] bookStructureExtendWrapperArray)
        {
            //在BookContentStructures中，book对象的parentId为空
            BookContentStructureWrapper[] bsws = (from inst in bookStructureExtendWrapperArray where inst.parentId == "" select inst).ToArray();
            if (bsws != null && bsws.Length > 0)
            {
                return bsws[0];
            }
            else
            {
                return null;
            }
        }

        //返回用户的书
        public static BookWrapper[] getBookList(string userId, string[] instituteIds, string[] disciplineIds, string[] subjectIds, bool? realFlag, JEWS.EngineStudyGuide.UserExtend userExtend)
        {
            CmsEngine cmsEngine = new CmsEngine();
            string[] bookIds = cmsEngine.getBookIdList(userId, instituteIds, disciplineIds, subjectIds, realFlag, userExtend);
            if (bookIds != null && bookIds.Length > 0)
            {
                return cmsEngine.getBookListByBookIds(bookIds, userExtend);
            }
            else
            {
                return new BookWrapper[0];
            }
        }

        ////返回用户可以访问的书
        //public static BookWrapper[] getBookListByUser(JEWS.EngineStudyGuide.UserExtend userExtend)
        //{
        //    IList<BookWrapper> bookList = new List<BookWrapper>();
        //    CmsEngine cmsEngine = new CmsEngine();
        //    UserPrivilegeWrapper[] privileges = cmsEngine.getUserPrivilegeList(userExtend.userId, userExtend);
        //    if (privileges != null && privileges.Length > 0)
        //    {
        //        UserPrivilegeWrapper[] contentPrivileges = (from inst in privileges where inst.contentType != "1" select inst).ToArray();
        //        if (contentPrivileges.Length == 1 && contentPrivileges[0].contentType == "4")
        //        {
        //            //超级管理员返回所有书
        //            return cmsEngine.getBookList(null, userExtend);
        //        }

        //        string subjectIds = "";
        //        string bookIds = "";
        //        foreach (UserPrivilegeWrapper p in contentPrivileges)
        //        {
        //            if (p.contentType == "2")
        //            {
        //                subjectIds = p.contentId;
        //            }
        //            else if (p.contentType == "3")
        //            {
        //                bookIds = p.contentId;
        //            }
        //        }

        //        if (subjectIds != "")
        //        {
        //            BookWrapper[] books = cmsEngine.getBookListBySubjectIds(subjectIds.Split(','), null, userExtend);
        //            if (books != null)
        //            {
        //                foreach (BookWrapper b in books)
        //                {
        //                    bookList.Add(b);
        //                }
        //            }

        //        }
        //        if (bookIds != "")
        //        {
        //            BookWrapper[] books = cmsEngine.getBookListByBookIds(bookIds.Split(','), userExtend);
        //            if (books != null)
        //            {
        //                foreach (BookWrapper b in books)
        //                {
        //                    bookList.Add(b);
        //                }
        //            }
        //        }
        //        //把自己的书加入
        //        BookWrapper[] myBooks = cmsEngine.getMyBookList(userExtend.userId, null, userExtend);
        //        if (myBooks != null && myBooks.Length > 0)
        //        {

        //            foreach (BookWrapper myBook in myBooks)
        //            {
        //                bool flag = true;
        //                foreach (BookWrapper book in bookList)
        //                {
        //                    if (myBook.id == book.id)
        //                    {
        //                        flag = false; break;
        //                    }
        //                }
        //                if (flag)
        //                {
        //                    bookList.Add(myBook);
        //                }

        //            }


        //        }
        //        //加上自己加的书，然后对比之前返回的 ，如果不包含就加进去。。。

        //    }

        //    return bookList.ToArray();
        //}

        ////返回用户可以访问的书的Id
        //public static string[] getBookIdsByUser(bool? realBook, JEWS.EngineStudyGuide.UserExtend userExtend)
        //{
        //    List<string> bookIdList = new List<string>();
        //    CmsEngine cmsEngine = new CmsEngine();
        //    UserPrivilegeWrapper[] privileges = cmsEngine.getUserPrivilegeList(userExtend.userId, userExtend);
        //    if (privileges != null && privileges.Length > 0)
        //    {
        //        UserPrivilegeWrapper[] contentPrivileges = (from inst in privileges where inst.contentType != "1" select inst).ToArray();
        //        if (contentPrivileges.Length == 1 && contentPrivileges[0].contentType == "4")
        //        {
        //            //超级管理员返回所有书
        //            return cmsEngine.getBookIdList(realBook, userExtend);
        //        }

        //        string subjectIds = "";
        //        string bookIds = "";
        //        foreach (UserPrivilegeWrapper p in contentPrivileges)
        //        {
        //            if (p.contentType == "2")
        //            {
        //                subjectIds = p.contentId;
        //            }
        //            else if (p.contentType == "3")
        //            {
        //                bookIds = p.contentId;
        //            }
        //        }

        //        if (subjectIds != "")
        //        {
        //            string[] bookIdsBySubject = cmsEngine.getBookIdListBySubjectIds(subjectIds.Split(','), realBook, userExtend);
        //            if (bookIdsBySubject != null && bookIdsBySubject.Length > 0)
        //            {
        //                bookIdList.AddRange(bookIdsBySubject);
        //            }

        //        }

        //        if (bookIds != "")
        //        {
        //            bookIdList.AddRange(bookIds.Split(','));
        //        }

        //        //加上自己加的书，然后对比之前返回的 ，如果不包含就加进去。。。
        //        string[] myBookIds = cmsEngine.getMyBookIdList(userExtend.userId, realBook, userExtend);
        //        if (myBookIds != null && myBookIds.Length > 0)
        //        {
        //            foreach (string bookId in myBookIds)
        //            {
        //                if (!bookIdList.Contains(bookId))
        //                {
        //                    bookIdList.Add(bookId);
        //                }
        //            }
        //        }
        //    }

        //    return bookIdList.ToArray();            
        //}

        //内容编辑历史
        public static ArrayList getContentEditHistory(String contentId, String contentType, String bookId, JEWS.EngineStudyGuide.UserExtend userExtend)
        {
            CmsEngine cmsEngine = new CmsEngine();
            ArrayList result = new ArrayList();
            ContentEditHistoryWrapper[] cehws = cmsEngine.getContentEditHistory(contentId, contentType, bookId, userExtend);
            if (cehws != null)
            {
                JEWS.EngineClient.UserExtend ue = TOOLS.ObjectUtil.CopyObjectPoperty<JEWS.EngineClient.UserExtend, JEWS.EngineStudyGuide.UserExtend>(userExtend);
                string[] userIds = (from inst in cehws select inst.userId).ToArray();
                Users[] users = new UserEngine().usersByIds(userIds, ue);
                result.Add(cehws);
                result.Add(users);
            }
            else
            {
                result.Add(new ContentEditHistoryWrapper[0]);
                result.Add(new Users[0]);
            }
            return result;
        }

        //返回未审核的题
        public static string[] getUnauditedQuestionIds(string userId, string bookId, JEWS.EngineStudyGuide.UserExtend userExtend)
        {
            CmsEngine cmsEngine = new CmsEngine();
            string[] bookQuesIds = cmsEngine.getQuestionIdsByBookId(bookId, userExtend);                      //书的所有题
            string[] auditedIds = cmsEngine.listByContentOperation("0", "3", userId, bookId, userExtend);     //审核过的题

            if (bookQuesIds != null && bookQuesIds.Length > 0)
            {
                if (auditedIds != null && auditedIds.Length > 0)
                {
                    return bookQuesIds.Except(auditedIds).ToArray();
                }
                else
                {
                    return bookQuesIds;
                }
            }

            return null;
        }

        //返回未审核的知识点
        public static string[] getUnauditedLearningObjectiveIds(string userId, string bookId, JEWS.EngineStudyGuide.UserExtend userExtend)
        {
            CmsEngine cmsEngine = new CmsEngine();
            string[] loIds = cmsEngine.getLearningObjectiveIdsForBookId(bookId, userExtend);
            string[] auditedIds = cmsEngine.listByContentOperation("2", "3", userId, bookId, userExtend);
            if (loIds != null && loIds.Length > 0)
            {
                if (auditedIds != null && auditedIds.Length > 0)
                {
                    return loIds.Except(auditedIds).ToArray();
                }
                else
                {
                    return loIds;
                }
            }
            return null;
        }

        //返回未审核的学习资料
        public static string[] getUnauditedStudyReferenceIds(string userId, string bookId, JEWS.EngineStudyGuide.UserExtend userExtend)
        {
            CmsEngine cmsEngine = new CmsEngine();
            string[] studyReferenceIds = cmsEngine.getStudyReferenceIdsForBookIds(bookId, userExtend);
            string[] auditedIds = cmsEngine.listByContentOperation("3", "3", userId, bookId, userExtend);
            if (studyReferenceIds != null && studyReferenceIds.Length > 0)
            {
                if (auditedIds != null && auditedIds.Length > 0)
                {
                    return studyReferenceIds.Except(auditedIds).ToArray();
                }
                else
                {
                    return studyReferenceIds;
                }
            }
            return null;
        }

        //根据questionID得到question以及他的母题和参考答案
        public static IList getQuestionAndAnwser(string[] questionIds, JEWS.EngineStudyGuide.UserExtend usersExtendWrapper)
        {
            StudyGuideEngine sge = new StudyGuideEngine();
            ArrayList retList = new ArrayList();
            QuestionWrapper[] qws = sge.getQuestionFCList(questionIds, usersExtendWrapper);
            retList.Add(qws);

            if (qws != null)
            {
                List<JEWS.EngineStudyGuide.anyType2anyTypeMapEntry> lst2 = new List<JEWS.EngineStudyGuide.anyType2anyTypeMapEntry>();
                foreach (QuestionWrapper qs in qws)
                {
                    JEWS.EngineStudyGuide.anyType2anyTypeMapEntry ht = new JEWS.EngineStudyGuide.anyType2anyTypeMapEntry();
                    ht.key = qs.id;
                    ht.value = qs.qpvSeedId;
                    lst2.Add(ht);
                }
                ReferenceAnswersWrapper[] raws = sge.getReferenceAnswersListByQidQsIds(lst2.ToArray(), usersExtendWrapper);
                retList.Add(raws);
            }
            else
            {
                retList.Add(null);
            }

            //返回单个题所关联的知识点
            LoQuestionWrapper[] loQuestionArray = sge.getLoQuestionList(questionIds[0], usersExtendWrapper);
            retList.Add(loQuestionArray);

            return retList;
        }

        //返回试卷信息
        public static IList getTestPaperData(string bookId, string testId, string userId, JEWS.EngineStudyGuide.UserExtend userExtend)
        {
            ArrayList retList = new ArrayList();
            CmsEngine cmsEngine = new CmsEngine();
            StudyGuideEngine sge = new StudyGuideEngine();

            #region 返回考试信息
            TestWrapper[] testInfo = cmsEngine.getTestListForTestIds(new string[] { testId }, userExtend);
            retList.Add(testInfo[0]);
            #endregion

            #region 返回考试题型信息
            TestQuestionTypeWrapper[] testQuestionTypes = cmsEngine.getTestQuestionTypeBookList(bookId, userExtend);
            retList.Add(testQuestionTypes);
            #endregion

            #region 返回考题
            //string[] questionIds = BBLL.CmsManage.getQuestionForyTest(testId, userExtend);
            //QuestionWrapper[] qws = BBLL.QuestionsManage.getQuestionFCList(questionIds, userExtend);
            QuestionWrapper[] qws = sge.getQuestionForTestId(testId, "", userId,userExtend);
            retList.Add(qws);
            if (qws != null)
            {
                List<JEWS.EngineStudyGuide.anyType2anyTypeMapEntry> lst2 = new List<JEWS.EngineStudyGuide.anyType2anyTypeMapEntry>();
                foreach (QuestionWrapper qs in qws)
                {
                    JEWS.EngineStudyGuide.anyType2anyTypeMapEntry ht = new JEWS.EngineStudyGuide.anyType2anyTypeMapEntry();
                    ht.key = qs.id;
                    ht.value = qs.qpvSeedId;
                    lst2.Add(ht);
                }
                ReferenceAnswersWrapper[] raws = sge.getReferenceAnswersListByQidQsIds(lst2.ToArray(), userExtend);
                retList.Add(raws);
            }
            else
            {
                retList.Add(null);
            }
            #endregion

            return retList;
        }

        //返回知识点与题的关系
        public static IList getLoQuestionArray(String[] questionIds, JEWS.EngineStudyGuide.UserExtend userExtend)
        {
            ArrayList retList = new ArrayList(2);
            CmsEngine sge = new CmsEngine();
            CmsEngine cmsEngine = new CmsEngine();
            JEWS.EngineStudyGuide.anyType2anyTypeMapEntry[] loQuestions = sge.getLoIdQuestionIdsForQuestionIds(questionIds, userExtend);
            if (loQuestions != null && loQuestions.Length > 0)
            {
                IList<string> loIds = new List<string>();
                foreach (JEWS.EngineStudyGuide.anyType2anyTypeMapEntry lq in loQuestions)
                {
                    loIds.Add(lq.key.ToString());
                }
                LearningObjectiveCmsWrapper[] los = cmsEngine.getLearningObjectiveForLoIds(loIds.ToArray(), userExtend);

                retList.Add(loQuestions);
                retList.Add(los);
            }
            return retList;
        }
        
    }
}
