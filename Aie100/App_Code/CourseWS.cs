using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Collections;

using JEWS.EngineClient;
using JEWS;
using Tools;
/// <summary>
/// CourseWS 的摘要说明
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// 若要允许使用 ASP.NET AJAX 从脚本中调用此 Web 服务，请取消注释以下行。 
[System.Web.Script.Services.ScriptService]
public class CourseWS : System.Web.Services.WebService {

    public CourseWS () {

        //如果使用设计的组件，请取消注释以下行 
        //InitializeComponent(); 
    }

    [WebMethod]
    public string HelloWorld() {
        return "Hello World";
    }

    [WebMethod(EnableSession = true, Description = "查询我的课程(未被禁用)")]
    public Course[] Course_listMyCourse(string userId, UserExtend user)
    {
        //return BLL.CourseManage.Course_listMyCourse(userId);
        CourseEngine ce = new CourseEngine();
        string[] strs = ce.courseIdsGetMyList(userId, user);
        return ce.courseGetByIds(strs, userId, user);

    }

    [WebMethod(EnableSession = true, Description = "退出课程  只有学生能直接退出课程")]
    public bool? courseExistByUserId(String userId, String courseId, UserExtend userExtend)
    {
        return new CourseEngine().courseExistByUserId(userId, courseId, userExtend);
    }


    [WebMethod(EnableSession = true, Description = "查询我教的课程(未被禁用，且未过期)")]
    public List<Course> Course_listTaughtCourse(string userId, UserExtend user)
    {
        //return BLL.CourseManage.Course_listTaughtCourse(userId);
        return null;
    }

    [WebMethod(EnableSession = true, Description = "查询我正在学习的课程(未被禁用，且未过期)")]
    public List<Course> Course_listCurrentCourse(string userId, UserExtend user)
    {
        //return BLL.CourseManage.Course_listCurrentCourse(userId);
        return null;
    }

    [WebMethod(EnableSession = true, Description = "查询将要学习的课程(未被禁用)")]
    public List<Course> Course_listUpCommingCourse(string userId, UserExtend user)
    {
        //return BLL.CourseManage.Course_listUpCommingCourse(userId);
        return null;
    }

    [WebMethod(EnableSession = true, Description = "查询已过期的所有课程(未被禁用)")]
    public Course[] Course_listPastCourse(string userId, UserExtend user)
    {
        //return BLL.CourseManage.Course_listPastCourse(userId);
        CourseEngine ce = new CourseEngine();
        string[] strs = ce.courseIdsGetPastList(userId, user);
        return ce.courseGetByIds(strs, userId, user);
    }

    [WebMethod(EnableSession = true, Description = "根据课程名字模糊查询课(未被禁用)")]
    public Course[] Course_listByCourseName(string userId,string courseName, UserExtend user)
    {
        //return BLL.CourseManage.Course_listByCourseName(courseName);
        CourseEngine ce = new CourseEngine();
        string[] strs = ce.courseIdsGetCourseName(userId, SpecialChars.handleSpecialChars(courseName), user);
        return ce.courseGetByIds(strs, userId, user);
    }

    [WebMethod(EnableSession = true, Description = "得到所有未结束的课（包括自己未加入的）")]
    public Course[] Course_listAllForBank(string userId, UserExtend user)
    {
        CourseEngine ce = new CourseEngine();
        string[] strs = ce.courseIdsGetAllList(userId, user);
        return ce.courseGetByIds(strs, userId, user);
    }

    [WebMethod(EnableSession = true, Description = "根据课程名字模糊查询课(未被禁用)")]
    public Course[] Course_listByCourseNameForBank(string courseName, UserExtend user)
    {
        CourseEngine ce = new CourseEngine();
        string[] strs = ce.courseIdsGetAllListByCourseName(SpecialChars.handleSpecialChars(courseName), user);
        return ce.courseInfoGetByIds(strs, user);
    }

    [WebMethod(EnableSession = true, Description = "得到我所创建的课程")]
    public Course[] Course_listMyCreated(string userId, UserExtend user)
    { 
        CourseEngine ce = new CourseEngine();
        string[] strs = ce.courseIdsGetMyCreateList(userId, user);
        return ce.courseGetByIds(strs, userId, user);
    }


    [WebMethod(EnableSession = true, Description = "查询指定的某一课程")]
    public Course Course_getById(string id, string userId, UserExtend user)
    {

        CourseEngine ce = new CourseEngine();
        Course[] courses = ce.courseGetByIds(new string[] { id }, userId, user);
        Course course = courses != null ? courses[0] : null;
        if (course != null)
        {
            Institute[] institutes = ce.instituteByIds(new string[] { course.instituteId }, user);
            Institute institute = null;
            if (institutes != null && institutes.Count() > 0)
            {
                institute = institutes[0];
            }
            if (institute != null)
            {
                course.instituteName = institute.name;
            }

            StudyGuideEngine sg = new StudyGuideEngine();
            JEWS.EngineStudyGuide.BookWrapper bookWrapper = sg.getBookById(course.bookId);
            if (bookWrapper != null)
            {
                course.bookName = bookWrapper.title;
            }
        }
        return course;
        //Course course = BLL.CourseManage.Course_getById(id);
        //if (course != null)
        //{
        //    Institute institute = BLL.CourseManage.Institute_getById(course.InstituteId);
        //    if (institute != null)
        //    {
        //        course.InstituteName = institute.Name;
        //    }

        //    BookWrapper bookWrapper = BLL.CourseManage.BookWrapper_getByBookId(course.BookId, user);
        //    if (bookWrapper != null)
        //    {
        //        course.BookName = bookWrapper.title;
        //    }
        //}


        //return course;
    }

    [WebMethod(EnableSession = true, Description = "查询基础表课程的信息")]
    public Course Course_getBaseById(string id, string userId, UserExtend user)
    {
        //return BLL.CourseManage.Course_getById(id);
        Course[] courses = new CourseEngine().courseGetByIds(new string[] { id }, userId, user);
        return courses != null ? courses[0] : null;
    }

    [WebMethod(EnableSession = true, Description = "查询我是教师的学院")]
    public Institute[] Institute_listMyInstructor(string userId,UserExtend user)
    {
        // return BLL.CourseManage.Institute_list();
        CourseEngine ce = new CourseEngine();
        string[] instituteIds = ce.instituteIdsMyByInstructorList(userId,user);
        if (instituteIds != null)
        {
            return ce.instituteByIds(instituteIds, user);
        }
        return null;
    }

    [WebMethod(EnableSession = true, Description = "查询所有学院")]
    public Institute[] Institute_list(UserExtend user)
    {
        // return BLL.CourseManage.Institute_list();
        CourseEngine ce = new CourseEngine();
        string[] instituteIds = ce.instituteIdsAllList(user);
        if (instituteIds != null)
        {
            return ce.instituteByIds(instituteIds, user);
        }
        return null;
    }

    [WebMethod(EnableSession = true, Description = "查询学院对应的书")]
    public JEWS.EngineStudyGuide.BookWrapper[] BookWrapper_listByInstituteUser(string instituteId,string userId, UserExtend user)
    {

        // return BLL.CourseManage.BookWrapper_listByInstituteId(instituteId, user);
        CourseEngine ce = new CourseEngine();
        string[] bookIds = ce.bookIdsByInstituteUser(instituteId,userId, user);
        StudyGuideEngine sg = new StudyGuideEngine();
        return sg.getBookListByBookIds(bookIds, TOOLS.ObjectUtil.CopyObjectPoperty<JEWS.EngineStudyGuide.UserExtend, UserExtend>(user));
    }

    [WebMethod(EnableSession = true, Description = "创建课程")]
    public bool? Course_save(Course course, UserExtend user)
    {
        //return BLL.CourseManage.Course_save(course,user);
        course.openFlagSpecified= course.createDateSpecified = course.endDateSpecified = course.flagSpecified = course.startDateSpecified = true;
        course.userId = user.userId;
        return new CourseEngine().courseSave(course, user);
    }

    [WebMethod(EnableSession = true, Description = "更新课程")]
    public bool? Course_update(Course course, UserExtend user)
    {
        //return BLL.CourseManage.Course_update(course,user);
        return new CourseEngine().courseUpdate(course, user);
    }

    [WebMethod(EnableSession = true, Description = "编辑学院")]
    public Institute instituteManage(Institute ins, UserExtend userExtend)
    {
        CourseEngine ce = new CourseEngine();
        ins.typeSpecified = true;
        return ce.instituteManage(ins, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "删除学院")]
    public bool? instituteRemove(String instituteId, UserExtend userExtend)
    {
        CourseEngine ce = new CourseEngine();
        return ce.instituteRemove(instituteId, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "分配书给某个学院")]
    public bool? bookDistributionInstitute(InstituteBook[] iBooks, UserExtend userExtend)
    {
        foreach(InstituteBook b in iBooks){
            b.priceSpecified = true;
            b.studyFlagSpecified = true;
        }
        return new CourseEngine().bookDistributionInstitute(iBooks, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "删除分配给学院的书")]
    public bool? bookDistributionRemove(InstituteBook iBook, UserExtend userExtend)
    {
        return new CourseEngine().bookDistributionRemove(iBook, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "得到某个学院的教师用户")]
    public Users[] getInstructorsByInstituteId(string instituteId, UserExtend userExtend)
    {
        CourseEngine ce = new CourseEngine();
        string[] userIds = ce.userIdsInstructorByInstituteId(instituteId, userExtend);
        if (userIds != null && userIds.Length > 0)
        {
            return new JEWS.UserEngine().usersByIds(userIds, userExtend);
        }
        else
        {
            return new Users[0];
        }
    }

    [WebMethod(EnableSession = true, Description = "得到学院的书")]
    public JEWS.EngineStudyGuide.BookWrapper[] getBooksByInstitute(string instituteId, UserExtend userExtend)
    {
        string[] bookIds = new CourseEngine().getBookIdsByInstitute(instituteId, userExtend);
        if (bookIds.Length > 0)
        {
            return new CmsEngine().getBookListByBookIds(bookIds, TOOLS.ObjectUtil.CopyObjectPoperty<JEWS.EngineStudyGuide.UserExtend, UserExtend>(userExtend));
        }
        else
        {
            return new JEWS.EngineStudyGuide.BookWrapper[0];
        }
    }

    [WebMethod(EnableSession = true, Description = "分配书给用户")]
    public bool? bookDistributionInstituteUser(string instituteId, string userId, string[] bookIds, UserExtend userExtend)
    {
        return new CourseEngine().bookDistributionInstituteUser(instituteId, userId, bookIds, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "删除分配给用户的书")]
    public bool? bookRemoveDistributionInstituteUser(string instituteId, string userId, string bookId, UserExtend userExtend)
    {
        return new CourseEngine().bookRemoveDistributionInstituteUser(instituteId, userId, bookId, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "查询某个内容管理员所管理控制的学校")]
    public Institute[] institutesMyManageList(string userId, UserExtend userExtend)
    {
        CourseEngine ce = new CourseEngine();
        string[] instituteIds = ce.instituteIdsMyManageList(userId, userExtend);
        if (instituteIds != null && instituteIds.Length > 0)
        {
            return ce.instituteByIds(instituteIds, userExtend);
        }
        else
        {
            return new Institute[0];
        }
    }


    [WebMethod(EnableSession = true, Description = "得到某个学院与用户关系为教师的主键")]
    public string[] iuIdsInstructorByInstituteId(string instituteId, UserExtend userExtend)
    {
        return new CourseEngine().iuIdsInstructorByInstituteId(instituteId, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "根据学院与用户关系的主键ID集合得到对像集合")]
    public InstituteUsers[] instituteUsersByIds(string[] ids, UserExtend userExtend)
    {
        return new CourseEngine().instituteUsersByIds(ids, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "得到学院用户Id")]
    public string[] getInstituteUsersIds(string instituteId, UserExtend userExtend)
    {
        return new CourseEngine().iuIdsInstructorByInstituteId(instituteId, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "得到学院的用户")]
    public IList getInstituteUsersInfo(string[] instituteIds, UserExtend userExtend)
    {
        IList retList = new ArrayList();
        CourseEngine ce = new CourseEngine();
        UserEngine ue = new UserEngine();

        InstituteUsers[] instituteUsers = ce.instituteUsersByIds(instituteIds, userExtend);
        retList.Add(instituteUsers);
        if (instituteUsers != null && instituteUsers.Length > 0)
        {
            string[] userIds = (from ins in instituteUsers select ins.userId).ToArray();
            Users[] users = ue.usersByIds(userIds, userExtend);
            retList.Add(users);
        }
        else
        {
            retList.Add(new Users[0]);
        }

        return retList;
    }

    [WebMethod(EnableSession = true, Description = "注册一个新用户并加到某个学院")]
    public bool? instructorRegisterToInstitute(Users user, string instituteId, UserExtend userExtend)
    {
        return new CourseEngine().instructorRegisterToInstitute(user, instituteId, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "把已有用户加到某个学院去")]
    public bool? instructorSaveToInstitute(string instituteId, string userId, UserExtend userExtend)
    {
        return new CourseEngine().instructorSaveToInstitute(instituteId, userId, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "把用户从某个学院移出")]
    public bool? instructorRemoveFromInstitute(string instructorInstituteId, UserExtend userExtend)
    {
        return new CourseEngine().instructorRemoveFromInstitute(instructorInstituteId, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "返回学院的所有管理员")]
    public Users[] usersAdminByInstituteId(string instituteId, UserExtend userExtend)
    {
        string[] userIds = new CourseEngine().usersAdminByInstituteId(instituteId, userExtend);
        if (userIds != null && userIds.Length > 0)
        {
            return new JEWS.UserEngine().usersByIds(userIds, userExtend);
        }
        else
        {
            return new Users[0];
        }
    }

    [WebMethod(EnableSession = true, Description = "注册内容管理员")]
    public bool? registerContentAdmin(Users user, string instituteId, UserExtend userExtend)
    {
        return new CourseEngine().registerContentAdmin(user, instituteId, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "注册学院管理员")]
    public bool? registerInstituteAdmin(Users user, string instituteId, UserExtend userExtend)
    {
        return new CourseEngine().registerInstituteAdmin(user, instituteId, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "判断学院管理员是否存在")]
    public bool? instituteAdminIsExist(string instituteId, UserExtend userExtend)
    {
        return new CourseEngine().instituteAdminIsExist(instituteId, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "返回学院管理员")]
    public Users getInstituteAdmin(string instituteId, UserExtend userExtend)
    {
        Users user = null;
        string instituteAdminId = new CourseEngine().getInstituteAdmin(instituteId, userExtend);
        if (instituteAdminId != null)
        {
            user = (new UserEngine()).usersByIds(new string[] { instituteAdminId }, userExtend)[0];
        }
        return user;
    }

    [WebMethod(EnableSession = true, Description = "返回学院所有管理员")]
    public IList getInstituteAdminData(string instituteId, UserExtend userExtend)
    {
        IList retList = new ArrayList();
        CourseEngine ce = new CourseEngine();
        UserEngine ue = new UserEngine();
        string[] iuIds = ce.iuIdsAdminByInstituteId(instituteId, userExtend);
        if (iuIds != null && iuIds.Length > 0)
        {
            InstituteUsers[] instituteUsers = ce.instituteUsersByIds(iuIds, userExtend);
            retList.Add(instituteUsers);
            string[] userIds = (from ins in instituteUsers select ins.userId).ToArray();
            Users[] users = ue.usersByIds(userIds, userExtend);
            retList.Add(users);
        }
        else
        {
            retList.Add(new InstituteUsers[0]);
            retList.Add(new Users[0]);
        }
        return retList;
    }

    [WebMethod(EnableSession = true, Description = "查询所有学院")]
    public string[] instituteIdsAllList(UserExtend userExtend)
    {
        return new CourseEngine().instituteIdsAllList(userExtend);
    }

    [WebMethod(EnableSession = true, Description = "根据主键查询学院")]
    public Institute[] instituteByIds(string[] instituteIds, UserExtend userExtend)
    {
        return new CourseEngine().instituteByIds(instituteIds, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "得到某个学院的所有bookId集合")]
    public string[] getBookIdsByInstitute(string instituteId, UserExtend userExtend)
    {
        return new CourseEngine().getBookIdsByInstitute(instituteId, userExtend);
    }

    [WebMethod(EnableSession = true, Description = "得到学院与书的详细信息")]
    public IList instituteBookByIB(string instituteId, string[] bookIds, UserExtend userExtend)
    {
        IList retList = new ArrayList();
        CourseEngine ce = new CourseEngine();
        InstituteBook[] instituteBooks = ce.instituteBookByIB(instituteId, bookIds, userExtend);
        retList.Add(instituteBooks);
        JEWS.EngineStudyGuide.UserExtend ue = TOOLS.ObjectUtil.CopyObjectPoperty<JEWS.EngineStudyGuide.UserExtend, JEWS.EngineClient.UserExtend>(userExtend);
        JEWS.EngineStudyGuide.BookWrapper[] books = new CmsEngine().getBookListByBookIds(bookIds, ue);
        retList.Add(books);
        return retList;
    }
}
