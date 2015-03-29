using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using JEWS.EngineClient;

namespace JEWS
{
    public class CourseEngine
    {
        private ClientSystemWebService userSysWS = new ClientSystemWebService();
        public CourseEngine() { }
        ~CourseEngine()
        {
            userSysWS.Dispose();
            GC.SuppressFinalize(this);
        }

        #region Course

        //退出课程  只有学生能直接退出课程
        public bool? courseExistByUserId(string userId, string courseId, UserExtend userExtend)
        {
            return userSysWS.courseExistByUserId(userId,courseId,userExtend);
        }


        /// <summary>
        /// 得到所有未结束的课（包括自己未加入的）
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public string[] courseIdsGetAllList(string userId, UserExtend userExtend)
        {
            return userSysWS.courseIdsGetAllList(userId, userExtend);
        }

        /// <summary>
        /// 根据课程名称得到所有未结束的课（包括自己未加入的）
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="courseName"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public string[] courseIdsGetAllListByCourseName(string courseName, UserExtend userExtend)
        {
            return userSysWS.courseIdsGetAllListByCourseName(courseName, userExtend);
        }


        /// <summary>
        /// 根据主键集合查询课程基本信息
        /// </summary>
        /// <param name="courseIds"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public Course[] courseInfoGetByIds(string[] courseIds, UserExtend userExtend)
        {
            return userSysWS.courseInfoGetByIds(courseIds, userExtend);
        }

        /// <summary>
        /// 根据主键盘集合查询每个人的课程集合的信息（包括在班级里的一些信息）。
        /// </summary>
        /// <param name="courseIds"></param>
        /// <param name="userId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public Course[] courseGetByIds(string[] courseIds, string userId, UserExtend userExtend)
        {
            return userSysWS.courseGetByIds(courseIds, userId, userExtend);
        }

        /// <summary>
        /// 根据课程名称查询当前课程。
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="courseName"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public string[] courseIdsGetCourseName(string userId, string courseName, UserExtend userExtend)
        {
            return userSysWS.courseIdsGetCourseName(userId, courseName, userExtend);
        }

        /// <summary>
        /// 查询我的课程,未结束的课(未被禁用)
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public string[] courseIdsGetMyList(string userId, UserExtend userExtend)
        {
            return userSysWS.courseIdsGetMyList(userId, userExtend);
        }

        /// <summary>
        /// 查询已过期的所有课程(未被禁用)
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public string[] courseIdsGetPastList(string userId, UserExtend userExtend)
        {
            return userSysWS.courseIdsGetPastList(userId, userExtend);
        }

        /// <summary>
        /// 得到我创建的课程
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public string[] courseIdsGetMyCreateList(string userId, UserExtend userExtend)
        {
            return userSysWS.courseIdsGetMyCreateList(userId,userExtend);
        }
        /// <summary>
        /// 保存课
        /// </summary>
        /// <param name="course"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public bool? courseSave(Course course, UserExtend userExtend)
        {
            return userSysWS.courseSave(course, userExtend);
        }

        /// <summary>
        /// 编辑课
        /// </summary>
        /// <param name="course"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public bool? courseUpdate(Course course, UserExtend userExtend)
        {
            return userSysWS.courseUpdate(course, userExtend);
        }

        /// <summary>
        /// 删除课
        /// </summary>
        /// <param name="courseId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public bool? courseRemove(string courseId, UserExtend userExtend)
        {
            return userSysWS.courseRemove(courseId, userExtend);
        }
        #endregion


        #region Section

        /// <summary>
        /// 判断是否需要输入密码。
        /// </summary>
        /// <param name="sectionNumber"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public bool? sectionPasswordFlag(String sectionNumber, UserExtend userExtend)
        {
            return userSysWS.sectionPasswordFlag(sectionNumber, userExtend);
        }

       /// <summary>
        /// 根据班级号加入班级  0：班级不存在，1:成功  2:已经加入过这个班了。
       /// </summary>
       /// <param name="sectionNumber"></param>
       /// <param name="password"></param>
       /// <param name="userId"></param>
       /// <param name="roleId"></param>
       /// <param name="userExtend"></param>
       /// <returns></returns>
        public int? sectionJoinByNumberPassword(String sectionNumber, String password, String userId, String roleId, UserExtend userExtend)
        {
            return userSysWS.sectionJoinByNumberPassword(sectionNumber,password, userId, roleId, userExtend);
        }
        /// <summary>
        /// 根据班级号加入班级  0：班级不存在，1:成功  2:已经加入过这个班了。
        /// </summary>
        /// <param name="courseId"></param>
        /// <param name="sectionNumber"></param>
        /// <param name="userId"></param>
        /// <param name="roleId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public int? sectionJoinByNumber(string sectionNumber, string userId, string roleId, UserExtend userExtend)
        {
            return userSysWS.sectionJoinByNumber(sectionNumber, userId, roleId, userExtend);
        }

        /// <summary>
        /// 随机加入班级.  这个暂时不写。
        /// </summary>
        /// <param name="courseId"></param>
        /// <param name="userId"></param>
        /// <param name="roleId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public bool? sectionJoinByCourse(string courseId, string userId, string roleId, UserExtend userExtend)
        {
            return userSysWS.sectionJoinByCourse(courseId, userId, roleId, userExtend);
        }

        /// <summary>
        /// 根据主键集合得到班级对像集合
        /// </summary>
        /// <param name="sectionIds"></param>
        /// <param name="courseId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public Section[] sectionInfoByIds(string[] sectionIds, string courseId, UserExtend userExtend) {
            return userSysWS.sectionInfoByIds(sectionIds, courseId, userExtend);
        }

        /// <summary>
        /// 根据userId得到他所创建的班级
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="courseId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public string[] sectionIdsByUserIdCreate(string userId, string courseId, UserExtend userExtend)
        {
            return userSysWS.sectionIdsByUserIdCreate(userId, courseId, userExtend);
        }

        /// <summary>
        /// 根据课程创建者得到班级
        /// </summary>
        /// <param name="fullName"></param>
        /// <param name="courseId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public string[] sectionIdsByFullNameCreate(string fullName, string courseId, UserExtend userExtend)
        {
            return userSysWS.sectionIdsByFullNameCreate(fullName, courseId, userExtend);
        }

        public string[] sectionIdsByUserNameCreate(String userName, String courseId, UserExtend userExtend)
        {
            return userSysWS.sectionIdsByUserNameCreate(userName, courseId, userExtend);
        }

        /// <summary>
        /// 根据班级名称查找班级
        /// </summary>
        /// <param name="sectionName"></param>
        /// <param name="courseId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public string[] sectionIdsBySectionName(string sectionName, string courseId, UserExtend userExtend)
        {
            return userSysWS.sectionIdsBySectionName(sectionName, courseId, userExtend);
        }

        /// <summary>
        /// 查看一个课程下面的所有班级
        /// </summary>
        /// <param name="courseId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public string[] sectionIdsByCourseId(string courseId, UserExtend userExtend)
        {
            return userSysWS.sectionIdsByCourseId(courseId, userExtend);
        }

        /// <summary>
        /// 根据班级号查找班级
        /// </summary>
        /// <param name="sectionNumber"></param>
        /// <param name="courseId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public Section sectionBySectionNumber(string sectionNumber, string courseId, UserExtend userExtend)
        {
            return userSysWS.sectionBySectionNumber(sectionNumber, courseId, userExtend);
        }

        /// <summary>
        /// 得到我在某个课程里面所加入的班。
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="courseId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public Section[] sectionByMyInCourse(string userId, string courseId, UserExtend userExtend)
        {
            return userSysWS.sectionByMyInCourse(userId, courseId, userExtend);
        }


        public Section sectionSave(Section section, string userId, UserExtend userExtend)
        {
            return userSysWS.sectionSave(section, userId, userExtend);
        }

        /// <summary>
        /// 更新班级
        /// </summary>
        /// <param name="section"></param>
        /// <param name="userId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public bool? sectionUpdate(Section section, string userId, UserExtend userExtend)
        {
            return userSysWS.sectionUpdate(section, userId, userExtend);
        }

        /// <summary>
        /// 删除班级
        /// </summary>
        /// <param name="sectionId"></param>
        /// <param name="userId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public bool? sectionRemove(string sectionId, string userId, UserExtend userExtend)
        {
            return userSysWS.sectionRemove(sectionId, userId, userExtend);
        }
        #endregion

        #region Institute
       
        /// <summary>
        /// 查询所有学院
        /// </summary>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public string[] instituteIdsAllList(UserExtend userExtend)
        {
            return userSysWS.instituteIdsAllList(userExtend);
        }

        /// <summary>
        /// 查询我加入的的学院
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public string[] instituteIdsMyList(string userId, UserExtend userExtend)
        {
            return userSysWS.instituteIdsMyList(userId, userExtend);
        }

        /// <summary>
        /// 查询我是教师的学院
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public string[] instituteIdsMyByInstructorList(string userId, UserExtend userExtend)
        {
            return userSysWS.instituteIdsMyByInstructorList(userId, userExtend);
        }

        /// <summary>
        /// 根据主键查询学院
        /// </summary>
        /// <param name="instituteIds"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public Institute[] instituteByIds(string[] instituteIds, UserExtend userExtend)
        {
            return userSysWS.instituteByIds(instituteIds, userExtend);
        }

        public Institute instituteManage(Institute ins, UserExtend userExtend)
        {
            return userSysWS.instituteManage(ins, userExtend);
        }

        public bool? instituteRemove(String instituteId, UserExtend userExtend)
        {
            return userSysWS.instituteRemove(instituteId, userExtend);
        }

        //得到分配给学院的书
        public InstituteBook[] instituteBookListByInstituteId(String instituteId, UserExtend userExtend)
        {
            return userSysWS.instituteBookListByInstituteId(instituteId, userExtend);
        }

        //得到学院与书的详细信息.
        public InstituteBook[] instituteBookByIB(string instituteId, string[] bookIds, UserExtend userExtend)
        {
            return userSysWS.instituteBookByIB(instituteId, bookIds, userExtend);
        }

        //分配书给某个学院
        public bool? bookDistributionInstitute(InstituteBook[] iBooks, UserExtend userExtend)
        {
            return userSysWS.bookDistributionInstitute(iBooks, userExtend);
        }

        //删除分配给学院的书
        public bool? bookDistributionRemove(InstituteBook iBook, UserExtend userExtend)
        {
            return userSysWS.bookDistributionRemove(iBook, userExtend);
        }

        //得到某个学院的教师用户
        public string[] userIdsInstructorByInstituteId(string instituteId, UserExtend userExtend)
        {
            return userSysWS.userIdsInstructorByInstituteId(instituteId, userExtend);
        }

        //查询某个内容管理员所管理控制的学校
        public string[] instituteIdsMyManageList(string userId, UserExtend userExtend)
        {
            return userSysWS.instituteIdsMyManageList(userId, userExtend);
        }

        //得到某个学院与用户关系为教师的主键ID集合.
        public string[] iuIdsInstructorByInstituteId(string instituteId, UserExtend userExtend)
        {
            return userSysWS.iuIdsInstructorByInstituteId(instituteId, userExtend);
        }

        //根据学院与用户关系的主键ID集合得到对像集合
        public InstituteUsers[] instituteUsersByIds(string[] ids, UserExtend userExtend)
        {
            return userSysWS.instituteUsersByIds(ids, userExtend);
        }

        //注册一个新用户并加到某个学院。
        public bool? instructorRegisterToInstitute(Users user, string instituteId, UserExtend userExtend)
        {
            return userSysWS.instructorRegisterToInstitute(user, instituteId, userExtend);
        }

        //把已有用户加到某个学院去
        public bool? instructorSaveToInstitute(string instituteId, string userId, UserExtend userExtend)
        {
            return userSysWS.instructorSaveToInstitute(instituteId, userId, userExtend);
        }

        //把用户从某个学院移出
        public bool? instructorRemoveFromInstitute(string instructorInstituteId, UserExtend userExtend)
        {
            return userSysWS.usersRemoveFromInstitute(instructorInstituteId, userExtend);
        }

        //返回学院的所有管理员Id集合
        public string[] usersAdminByInstituteId(string instituteId, UserExtend userExtend)
        {
            return userSysWS.usersAdminByInstituteId(instituteId, userExtend);
        }

        //返回学院与管理员关系Id集合(包括学院管理员和内容管理员)
        public string[] iuIdsAdminByInstituteId(string instituteId, UserExtend userExtend)
        {
            return userSysWS.iuIdsAdminByInstituteId(instituteId, userExtend);
        }
        
        //注册内容管理员
        public bool? registerContentAdmin(Users user, string instituteId, UserExtend userExtend)
        {
            return userSysWS.adminRegisterToInstitute(user, instituteId, userExtend);
        }

        //注册学院管理员
        public bool? registerInstituteAdmin(Users user, string instituteId, UserExtend userExtend)
        {
            return userSysWS.adminSupperToInstitute(user, instituteId, userExtend);
        }

        //判断学院管理员是否存在
        public bool? instituteAdminIsExist(string instituteId, UserExtend userExtend)
        {
            return userSysWS.adminSupperIsExist(instituteId, userExtend);
        }

        //返回学院管理员
        public string getInstituteAdmin(string instituteId, UserExtend userExtend)
        {
            return userSysWS.userIdSuperAdminByInsttituteId(instituteId, userExtend);
        }
        #endregion

        #region Book
        /// <summary>
        /// 得到某个学院的所有bookId集合
        /// </summary>
        /// <param name="instituteId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public string[] getBookIdsByInstitute(string instituteId, UserExtend userExtend)
        {
            return userSysWS.bookIdsByInstitute(instituteId, userExtend);
        }

        //根据学院与用户得到用户的书
        public string[] bookIdsByInstituteUser(string instituteId, string userId, UserExtend userExtend)
        {
            return userSysWS.bookIdsByInstituteUser(instituteId,userId,userExtend);
        }

        //分配书给用户
        public bool? bookDistributionInstituteUser(string instituteId, string userId, string[] bookIds, UserExtend userExtend)
        {
            return userSysWS.bookDistributionInstituteUser(instituteId, userId, bookIds, userExtend);
        }

        //删除分配给用户的书
        public bool? bookRemoveDistributionInstituteUser(string instituteId, string userId, string bookId, UserExtend userExtend)
        {
            return userSysWS.bookRemoveDistributionInstituteUser(instituteId, userId, bookId, userExtend);
        }
        #endregion

    }
}
