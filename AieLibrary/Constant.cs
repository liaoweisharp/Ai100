using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AieLibrary
{
    public class Constant
    {
        public const string SystemId = "1";
    }

    /// <summary>
    /// 用户系统角色
    /// </summary>
    public enum EnumSysUserRole
    {
        Admin = 2, Instructor = 0, Student = 1
    }

    public enum EnumUserLogin
    {
        UNAME_PASSWORD_WRONG = -1,//用户名密码错误
        USER_DISABLED = -2,//用户被禁用
        INS_LOGIN_SUCCESS = 0,//教师成功登录
        STU_LOGIN_SUCCESS = 1,//学生成功登陆
        ADMIN_LOGIN_SUCCESS = 2//管理员成功登陆
    }

    /// <summary>
    /// CMS权限类型
    /// </summary>
    public enum EnumCmsPermissionType
    {
        /// <summary>
        /// 功能访问权限
        /// </summary>
        Function = 1,
        /// <summary>
        /// 学科访问权限
        /// </summary>
        Subject = 2,
        /// <summary>
        /// 书访问权限
        /// </summary>
        Book = 3,
        /// <summary>
        /// 管理员权限
        /// </summary>
        Admin = 4
    }
}
