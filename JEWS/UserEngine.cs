using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using JEWS.EngineClient;

namespace JEWS
{
    public class UserEngine
    {
        private ClientSystemWebService userClientSysWS = new ClientSystemWebService();
        public UserEngine() { }
        ~UserEngine()
        {
            userClientSysWS.Dispose();
            GC.SuppressFinalize(this);
        }

        #region User

        public bool? usersExist(String userName, UserExtend userExtend)
        {
            return userClientSysWS.usersExist(userName, userExtend);
        }



        public string sectionRoleIdByUser(String userId, String sectionId, UserExtend userExtend)
        {
            return userClientSysWS.sectionRoleIdByUser(userId, sectionId, userExtend);
        }


        /// <summary>
        /// 根据主键集合得到用户对像集合
        /// </summary>
        /// <param name="userIds"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public Users[] usersByIds(string[] userIds, UserExtend userExtend)
        {
            return userClientSysWS.usersByIds(userIds, userExtend);
        }

        /// <summary>
        /// 根据userId和sectionId得到用户对像
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="sectionId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public UserExtend usersByUserIdSectionId(string userId, string sectionId, UserExtend userExtend)
        {
            return userClientSysWS.usersByUserIdSectionId(userId, sectionId, userExtend);
        }

        /// <summary>
        /// 判断登录是否正确
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="userPassword"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public UserExtend userLoginCheck(string userName, string userPassword, UserExtend userExtend)
        {
            return userClientSysWS.userLoginCheck(userName, userPassword, userExtend);
        }
        public UserExtend userLoginQQ(string uId, UserExtend userExtend)
        {
            return userClientSysWS.userLoginQQ(uId, userExtend);
        }
        public Users[] usersBySectionId(string sectionId, UserExtend userExtend) {
            String[] userIds= userClientSysWS.usersIdsBySectionId(sectionId, userExtend);
            return userClientSysWS.usersByIds(userIds, userExtend);
        }
        public String[] usersIdsBySectionId(string sectionId, UserExtend userExtend)
        {
            return userClientSysWS.usersIdsBySectionId(sectionId, userExtend);
        }
        public String[] usersIdsStdBySectionId(string sectionId, UserExtend userExtend)
        {
            return userClientSysWS.usersIdsStdBySectionId(sectionId, userExtend);
        }
        public Users[] usersStdBySectionId(string sectionId, UserExtend userExtend)
        {
            String[] userIds = userClientSysWS.usersIdsStdBySectionId(sectionId, userExtend);
            return userClientSysWS.usersByIds(userIds, userExtend);
        }

        public Users[] userStdByOther(String userId, String sectionId, UserExtend userExtend)
        {
            String[] userIds = userClientSysWS.userIdsByOther(userId, sectionId, userExtend);
            return userClientSysWS.usersByIds(userIds, userExtend);
        }
        /// <summary>
        /// 用户注册
        /// </summary>
        /// <param name="users"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public bool? userRegister(Users users, UserExtend userExtend)
        {
            return userClientSysWS.userRegister(users, userExtend);
        }

        /// <summary>
        /// 编辑用户信息
        /// </summary>
        /// <param name="users"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public bool? usersInfoEdit(Users users, UserExtend userExtend)
        {
            return userClientSysWS.usersInfoEdit(users, userExtend);
        }

        /// <summary>
        /// 根据邮箱收到随机码修改密码
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="newPassword"></param>
        /// <param name="randomCode"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public bool? userEditPasswordByRandomCode(string userId, string newPassword, string randomCode, UserExtend userExtend)
        {
            return userClientSysWS.userEditPasswordByRandomCode(userId, newPassword, randomCode, userExtend);
        }

        /// <summary>
        /// 根据旧密码来修改密码
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="newPassword"></param>
        /// <param name="oldPassword"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public bool? userEditPasswordByOldPassword(string userId, string newPassword, string oldPassword, UserExtend userExtend)
        {
            return userClientSysWS.userEditPasswordByOldPassword(userId, newPassword, oldPassword, userExtend);
        }

        /// <summary>
        /// 保存User邮件发送的随机号码
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="randomCode"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public bool? userSaveRandomCode(string userId, string randomCode, UserExtend userExtend)
        {
            return userClientSysWS.userSaveRandomCode(userId, randomCode, userExtend);
        }

        /// <summary>
        /// 判断用户是否为管理员
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public bool? usersAdmin(String userId, UserExtend userExtend)
        {
            return userClientSysWS.usersAdmin(userId, userExtend);
        }

        


        #endregion

        public Users usersByUsername(String userName, UserExtend userExtend)
        {
            return userClientSysWS.usersByUsername(userName, userExtend);
        }

        //返回所有学院
        public string[] instituteIdsAllList(UserExtend userExtend)
        {
            return userClientSysWS.instituteIdsAllList(userExtend);

        }

        //查询我加入的的学院
        public string[] instituteIdsMyList(string userId, UserExtend userExtend)
        {
            return userClientSysWS.instituteIdsMyList(userId, userExtend);
        }

        //查询我是教师的学院
        public string[] instituteIdsMyByInstructorList(string userId, UserExtend userExtend)
        {
            return userClientSysWS.instituteIdsMyByInstructorList(userId, userExtend);

        }

        //根据主键查询学院
        public Institute[] instituteByIds(string[] instituteIds, UserExtend userExtend)
        {
            return userClientSysWS.instituteByIds(instituteIds, userExtend);
        }

        //返回学院管理员
        public String[] usersAdminByInstituteId(String instituteId,UserExtend userExtend)
        {
            return userClientSysWS.usersAdminByInstituteId(instituteId, userExtend);
        }

        //根据sectionID得到全班的阅卷对应表
        public UserUserSection[] uuSectionListBySectionId(string sectionId, UserExtend userExtend)
        {
            return userClientSysWS.uuSectionListBySectionId(sectionId, userExtend);
        }

        //管理阅卷对应表
        public bool? userUserSectionManage(UserUserSection[] uuss, string sectionId, UserExtend userExtend)
        {
            return userClientSysWS.userUserSectionManage(uuss, sectionId, userExtend);
        }

        //根据userId集合和sectionId得到userSection集合
        public UserSection[] userSectionByUserIds(string[] userIds, string sectionId, UserExtend userExtend)
        {
            return userClientSysWS.userSectionByUserIds(userIds, sectionId, userExtend);
        }

        //返回一个班的所有学生的id集合
        public string[] userIdsBySection(string sectionId, string roleId, UserExtend userExtend)
        {
            return userClientSysWS.userIdsBySection(sectionId, roleId, userExtend);
        }

        //返回一个班的用户
        public string[] userIdsBySectionConditions(string sectionId, string fullName, string userName, UserExtend userExtend)
        {
            return userClientSysWS.userIdsBySectionConditions(sectionId, fullName, userName, userExtend);
        }

        //班级角色改变
        public bool? sectionRoleChangeByUserId(string userId, string sectionId, string roleId, UserExtend userExtend)
        {
            return userClientSysWS.sectionRoleChangeByUserId(userId, sectionId, roleId, userExtend);
        }

        //退出班级 直接删除用户与班的关系表的数据
        public bool? sectionExitByUserId(string userId, string sectionId, UserExtend userExtend)
        {
            return userClientSysWS.sectionExitByUserId(userId, sectionId, userExtend);
        }

        //设置用户的可用状态
        public bool? usFlagUpdate(string userId, string sectionId, int flag, UserExtend userExtend)
        {
            return userClientSysWS.usFlagUpdate(userId, sectionId, flag, userExtend);
        }
        public Users userLoginCheckUsers(string userName, string password,  UserExtend userExtend)
        {
            return userClientSysWS.userLoginCheckUsers(userName, password, userExtend);
        }

        //查找用户
        public Users userIdsByUsername(string userName, UserExtend userExtend)
        {
            return userClientSysWS.userIdsByUsername(userName, userExtend);
        }

        //返回用户信息
        public UserExtend usersByUserIdBookId(string userId, string bookId, UserExtend userExtend)
        {
            return userClientSysWS.usersByUserIdBookId(userId, bookId, userExtend);
        }
        
    }
}
