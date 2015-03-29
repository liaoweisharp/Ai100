using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections;
using JEWS.EngineStudyGuide;
using JEWS.EngineClient;


namespace JEWS
{
    public class UserPermissions
    {
        /// <summary>
        /// 返回CMS功能列表
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public static IList<object> GetCmsFunctions(string userId)
        {
            string xmlPath = System.Web.HttpContext.Current.Server.MapPath("../XML/CmsFuncStructs.xml");
            IList<object> funcStructs = XmlManage.GetCmsFuncStructs(xmlPath);

            CmsEngine cmsEngine = new CmsEngine();
            EngineStudyGuide.UserExtend userExtend = TOOLS.ObjectUtil.CopyObjectPoperty<EngineStudyGuide.UserExtend, EngineClient.UserExtend>(SessionManage.SimpleUser);
            UserPrivilegeWrapper[] privileges = cmsEngine.getUserPrivilegeList(userId, userExtend);
            UserPrivilegeWrapper funcPermissions = null;
            if (privileges != null && privileges.Length > 0)
            {
                //返回功能权限或者超级管理员权限
                UserPrivilegeWrapper[] list = (from inst in privileges where inst.contentType == "4" || inst.contentType == "1" select inst).ToArray();
                if (list.Length > 0)
                {
                    funcPermissions = list[0];
                }
            }

            if (funcPermissions != null)
            {
                if (funcPermissions.contentType == "4")
                {
                    //设置超级管理员权限
                    setAdminPermissions(funcStructs);
                }
                else
                {
                    if (!string.IsNullOrEmpty(funcPermissions.contentId))
                    {
                        IList<string> userPermissions = new List<string>(funcPermissions.contentId.Split(','));
                        setFuncPermissions(funcStructs, userPermissions, new List<object>());
                    }
                }
                return funcStructs;
            }
            else
            {
                //判断用户是否合法
                bool? b = new UserEngine().usersAdmin(userId, SessionManage.SimpleUser);
                if (b == true)
                {
                    return funcStructs;
                }
                else
                {
                    return null;
                }
            }
        }

        /// <summary>
        /// 返回用户功能权限
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public static IList<object> GetFuncPermissions(string userId)
        {
            IList<object> funcPermissions = GetCmsFunctions(userId);
            if (funcPermissions != null)
            {
                delNoPermissions(funcPermissions);
            }
            return funcPermissions;
        }

        /// <summary>
        /// 返回用户内容权限
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public static IList<object> GetContentPermissions(string userId)
        {
            IList<object> contentPermissions = GetCmsContents(userId);
            if (contentPermissions != null)
            {
                delNoPermissions(contentPermissions);
            }
            return contentPermissions;
        }

        /// <summary>
        /// 设置用户的功能权限
        /// </summary>
        /// <param name="funcs">系统功能结构</param>
        /// <param name="permissions">用户权限项</param>
        /// <param name="ancestors">当前功能的祖先功能，供程序内部使用（初始化为空集合对象）</param>
        private static void setFuncPermissions(IList<object> funcs, IList<string> permissions, IList<object> ancestors)
        {
            string permissionId = "";
            foreach (IDictionary<string, object> funcItem in funcs)
            {
                if (permissions.Count > 0)
                {
                    permissionId = funcItem["key"].ToString();
                    if (permissions.Contains(permissionId))
                    {
                        funcItem.Add("select", true);
                        permissions.Remove(permissionId);
                        halfSelectAncestors(ancestors);   //选择当前功能时标记祖先功能为半选
                    }
                    if (funcItem.ContainsKey("children"))
                    {
                        ancestors.Add(funcItem);
                        setFuncPermissions((IList<object>)funcItem["children"], permissions, ancestors);
                        ancestors.Remove(funcItem);
                    }
                }
                else
                {
                    break;
                }
            }
        }

        /// <summary>
        /// 设置管理员功能权限
        /// </summary>
        /// <param name="funcs"></param>
        private static void setAdminPermissions(IList<object> funcs)
        {
            foreach (IDictionary<string, object> funcItem in funcs)
            {
                funcItem.Add("select", true);
                if (funcItem.ContainsKey("children"))
                {
                    setAdminPermissions((IList<object>)funcItem["children"]);
                }
            }
        }


        /// <summary>
        /// 添加半选标记
        /// </summary>
        private static void halfSelectAncestors(IList<object> ancestors)
        {
            IEnumerable<object> list = ancestors.Reverse();
            foreach (IDictionary<string, object> obj in list)
            {
                if (!obj.ContainsKey("halfSelect"))
                {
                    obj.Add("halfSelect", true);
                }
                else
                {
                    break;
                }
            }
        }

        /// <summary>
        /// 删除无权访问的功能
        /// </summary>
        /// <param name="markedFuncs">设置权限后的系统功能列表（调用setFuncPermissions函数后的系统功能列表）</param>
        public static void delNoPermissions(IList<object> markedFuncs)
        {
            IDictionary<string, object> funcItem = null;
            for (int i = 0; i < markedFuncs.Count(); i++)
            {
                funcItem = (IDictionary<string, object>)markedFuncs[i];
                if (funcItem.ContainsKey("halfSelect"))
                {
                    if (funcItem.ContainsKey("children"))
                    {
                        delNoPermissions((IList<object>)funcItem["children"]);
                    }
                }
                else if (funcItem.ContainsKey("select"))
                {
                    continue;
                }
                else
                {
                    markedFuncs.Remove(funcItem);
                    i--;
                }
            }
        }

        /// <summary>
        /// 检查指定功能在当前是否可以被访问
        /// </summary>
        /// <param name="funcId">功能Id</param>
        /// <param name="funcs">当前用户功能</param>
        /// <returns></returns>
        public static bool checkFuncPermissions(string funcId, IList<object> funcs)
        {
            bool bRet = false;
            foreach (IDictionary<string, object> funcItem in funcs)
            {
                if (funcItem.ContainsKey("target"))
                {
                    if (funcItem["target"].ToString() == funcId)
                    {
                        bRet = true;
                        break;
                    }
                    else
                    {
                        continue;
                    }
                }
                else
                {
                    if (funcItem.ContainsKey("children"))
                    {
                        bRet = checkFuncPermissions(funcId, (IList<object>)funcItem["children"]);
                        if (bRet)
                        {
                            break;
                        }
                    }
                }
            }
            return bRet;
        }

        //返回CMS内容权限列表
        public static IList<object> GetCmsContents(string userId)
        {
            CmsEngine cmsEngine = new CmsEngine();
            JEWS.EngineStudyGuide.UserExtend userExtend = TOOLS.ObjectUtil.CopyObjectPoperty<JEWS.EngineStudyGuide.UserExtend, JEWS.EngineClient.UserExtend>(JEWS.SessionManage.SimpleUser);
            IList<object> contentStructs = GetCmsContentStructs(userExtend);
            UserPrivilegeWrapper[] privileges = cmsEngine.getUserPrivilegeList(userId, userExtend);
            UserPrivilegeWrapper[] contentPermissions = null;
            if (privileges != null && privileges.Length > 0)
            {
                //返回内容权限
                contentPermissions = (from inst in privileges where inst.contentType != "1" select inst).ToArray();
            }

            if (contentPermissions != null && contentPermissions.Length > 0)
            {
                if (contentPermissions.Length == 1 && contentPermissions[0].contentType == "4")
                {
                    //设置超级管理员权限
                    setAdminPermissions(contentStructs);
                }
                else
                {
                    ArrayList permissionList = new ArrayList();
                    foreach (UserPrivilegeWrapper p in contentPermissions)
                    {
                        if (!string.IsNullOrEmpty(p.contentId))
                        {
                            permissionList.AddRange(p.contentId.Split(','));
                        }
                    }
                    string[] permissions = (string[])permissionList.ToArray(typeof(string));
                    setFuncPermissions(contentStructs, new List<string>(permissions), new List<object>());
                }
            }

            return contentStructs;
        }


        //获得CMS内容结构
        private static IList<object> GetCmsContentStructs(JEWS.EngineStudyGuide.UserExtend userExtend)
        {
            CmsEngine cmsEngine = new CmsEngine();
            DisciplineWrapper[] disciplines = cmsEngine.getDisciplineList(userExtend);
            SubjectWrapper[] subjects = cmsEngine.getSubjectList(userExtend);
            BookWrapper[] books = CmsManage.getBookList(null, null, null, null, null, userExtend);

            IList<object> contentStructs = new List<object>();
            IDictionary<string, object> disciplineStruct = null;

            foreach (DisciplineWrapper discipline in disciplines)
            {
                disciplineStruct = new Dictionary<string, object>();
                disciplineStruct.Add("key", discipline.id);
                disciplineStruct.Add("title", discipline.disciplineName);
                disciplineStruct.Add("hideCheckbox", true);
                contentStructs.Add(disciplineStruct);
                buildSubjectStructs(discipline.id, disciplineStruct, subjects, books);
            }

            return contentStructs;
        }

        //构造学科结构
        private static void buildSubjectStructs(string disciplineId, IDictionary<string, object> disciplineStruct, SubjectWrapper[] subjects, BookWrapper[] books)
        {
            SubjectWrapper[] tarSubjects = (from inst in subjects where inst.disciplineId == disciplineId select inst).ToArray();
            if (tarSubjects.Length > 0)
            {
                IList<object> childStructs = new List<object>();
                disciplineStruct.Add("children", childStructs);
                disciplineStruct.Add("isFolder", true);

                IDictionary<string, object> subjectStruct = null;
                foreach (SubjectWrapper subject in tarSubjects)
                {
                    subjectStruct = new Dictionary<string, object>();
                    subjectStruct.Add("key", subject.id);
                    subjectStruct.Add("title", subject.subjectName);
                    childStructs.Add(subjectStruct);
                    buildBookStructs(subject.id, subjectStruct, books);
                }
            }

        }

        //构造书结构
        private static void buildBookStructs(string subjectId, IDictionary<string, object> subjectStruct, BookWrapper[] books)
        {
            BookWrapper[] tarBooks = (from inst in books where inst.subjectId == subjectId select inst).ToArray();
            if (tarBooks.Length > 0)
            {
                IList<object> childStructs = new List<object>();
                subjectStruct.Add("children", childStructs);
                subjectStruct.Add("isFolder", true);

                IDictionary<string, object> bookStruct = null;
                foreach (BookWrapper book in tarBooks)
                {
                    bookStruct = new Dictionary<string, object>();
                    bookStruct.Add("key", book.id);
                    bookStruct.Add("title", book.title);
                    childStructs.Add(bookStruct);
                }
            }
        }


        //保存用户功能权限
        public static bool? SaveFuncPermissions(UserPrivilegeWrapper funcPermissions, JEWS.EngineStudyGuide.UserExtend userExtend)
        {
            if (funcPermissions == null) return false;

            //设置功能权限
            funcPermissions.contentType = "1";
            IList<UserPrivilegeWrapper> userPermissions = new List<UserPrivilegeWrapper>();
            userPermissions.Add(funcPermissions);

            string userId = funcPermissions.userId;
            CmsEngine cmsEngine = new CmsEngine();
            UserPrivilegeWrapper[] privileges = cmsEngine.getUserPrivilegeList(userId, userExtend);
            if (privileges != null && privileges.Length > 0)
            {
                UserPrivilegeWrapper[] contentPrivileges = (from inst in privileges where inst.contentType != "1" select inst).ToArray();
                if (contentPrivileges.Length == 1 && contentPrivileges[0].contentType == "4")
                {
                    //超级管理员不需要设置权限
                    return null;
                }

                foreach (UserPrivilegeWrapper p in contentPrivileges)
                {
                    userPermissions.Add(p);
                }
            }
            else
            {
                //判断用户是否合法
                bool? b = new UserEngine().usersAdmin(userId, SessionManage.SimpleUser);
                if (b == false)
                {
                    return false;
                }

            }

            return cmsEngine.manageUserPrivilege(userPermissions.ToArray(), userId, userExtend);
        }


        //保存用户内容权限
        public static bool? SaveContentPermissions(UserPrivilegeWrapper[] contentPermissions, JEWS.EngineStudyGuide.UserExtend userExtend)
        {
            if (!checkContentPrivileges(contentPermissions))
            {
                return false;
            }

            IList<UserPrivilegeWrapper> userPermissions = new List<UserPrivilegeWrapper>();
            foreach (UserPrivilegeWrapper p in contentPermissions)
            {
                userPermissions.Add(p);
            }

            string userId = contentPermissions[0].userId;
            CmsEngine cmsEngine = new CmsEngine();
            UserPrivilegeWrapper[] privileges = cmsEngine.getUserPrivilegeList(userId, userExtend);
            if (privileges != null && privileges.Length > 0)
            {
                UserPrivilegeWrapper[] funcPrivileges = (from inst in privileges where inst.contentType != "2" && inst.contentType != "3" select inst).ToArray();
                if (funcPrivileges.Length == 1 && funcPrivileges[0].contentType == "4")
                {
                    //超级管理员不需要设置权限
                    return null;
                }

                foreach (UserPrivilegeWrapper p in funcPrivileges)
                {
                    userPermissions.Add(p);
                }
            }
            else
            {
                //判断用户是否合法
                bool? b = new UserEngine().usersAdmin(userId, SessionManage.SimpleUser);
                if (b == false)
                {
                    return false;
                }
            }

            return cmsEngine.manageUserPrivilege(userPermissions.ToArray(), userId, userExtend);
        }

        //检查用户内容权限是否合法
        private static bool checkContentPrivileges(UserPrivilegeWrapper[] contentPrivileges)
        {
            bool bRet = false;
            if (contentPrivileges != null)
            {
                int privilegeCount = contentPrivileges.Length;
                if (privilegeCount == 1)
                {
                    if (contentPrivileges[0].contentType == "2" || contentPrivileges[0].contentType == "3")
                    {
                        bRet = true;
                    }
                }
                else if (privilegeCount == 2)
                {
                    if ((contentPrivileges[0].contentType == "2" && contentPrivileges[1].contentType == "3")
                        || (contentPrivileges[0].contentType == "3" && contentPrivileges[1].contentType == "2"))
                    {
                        if (contentPrivileges[0].userId == contentPrivileges[1].userId)
                        {
                            bRet = true;
                        }
                    }
                }
            }
            return bRet;
        }

        public static bool isValidUser(AieLibrary.EnumSysUserRole role,string sectionId) {
          

            if (JEWS.SessionManage.SimpleUser == null)
            {
                return false;
            }

            string roleId = null;
            if (sectionId != null)
            {
                EngineClient.UserExtend suser = new UserEngine().usersByUserIdSectionId(JEWS.SessionManage.SimpleUser.userId, sectionId, JEWS.SessionManage.SimpleUser);
                if (suser != null)
                {
                    roleId = suser.roleId;
                }
            }
            else
            {
                roleId = JEWS.SessionManage.SimpleUser.roleId;
            }
            if (roleId!=Convert.ToString((int)(role)))
            {
                return false;
            }
            return true;
        }


        /// <summary>
        /// 获得内容管理员权限
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="instituteAdminId"></param>
        /// <returns></returns>
        public static IList<object> GetContentAdminFunctions(string userId, string instituteAdminId)
        {
            if (string.IsNullOrEmpty(instituteAdminId))
            {
                return new List<object>();
            }

            IList<object> instituteFuns = GetFuncPermissions(instituteAdminId);
            clearSelectFlag(instituteFuns);

            CmsEngine cmsEngine = new CmsEngine();
            EngineStudyGuide.UserExtend userExtend = TOOLS.ObjectUtil.CopyObjectPoperty<EngineStudyGuide.UserExtend, EngineClient.UserExtend>(SessionManage.SimpleUser);
            UserPrivilegeWrapper[] privileges = cmsEngine.getUserPrivilegeList(userId, userExtend);
            UserPrivilegeWrapper funcPermissions = null;
            if (privileges != null && privileges.Length > 0)
            {
                //返回功能权限
                UserPrivilegeWrapper[] list = (from inst in privileges where inst.contentType == "4" || inst.contentType == "1" select inst).ToArray();
                if (list.Length > 0)
                {
                    funcPermissions = list[0];
                }
            }

            if (funcPermissions != null)
            {
                if (!string.IsNullOrEmpty(funcPermissions.contentId))
                {
                    IList<string> userPermissions = new List<string>(funcPermissions.contentId.Split(','));
                    setFuncPermissions(instituteFuns, userPermissions, new List<object>());
                }
            }
            return instituteFuns;
        }

        //获得内容管理员的内容权限
        public static IList<object> GetContentAdminContent(string userId, string instituteAdminId)
        {
            if (string.IsNullOrEmpty(instituteAdminId))
            {
                return new List<object>();
            }

            IList<object> instituteContent = GetContentPermissions(instituteAdminId);   //学院内容权限
            clearSelectFlag(instituteContent);

            CmsEngine cmsEngine = new CmsEngine();
            JEWS.EngineStudyGuide.UserExtend userExtend = TOOLS.ObjectUtil.CopyObjectPoperty<JEWS.EngineStudyGuide.UserExtend, JEWS.EngineClient.UserExtend>(JEWS.SessionManage.SimpleUser);
            UserPrivilegeWrapper[] privileges = cmsEngine.getUserPrivilegeList(userId, userExtend);
            UserPrivilegeWrapper[] contentPermissions = null;
            if (privileges != null && privileges.Length > 0)
            {
                //返回内容权限
                contentPermissions = (from inst in privileges where inst.contentType != "1" select inst).ToArray();
            }

            if (contentPermissions != null && contentPermissions.Length > 0)
            {
                ArrayList permissionList = new ArrayList();
                foreach (UserPrivilegeWrapper p in contentPermissions)
                {
                    if (!string.IsNullOrEmpty(p.contentId))
                    {
                        permissionList.AddRange(p.contentId.Split(','));
                    }
                }
                string[] permissions = (string[])permissionList.ToArray(typeof(string));
                setFuncPermissions(instituteContent, new List<string>(permissions), new List<object>());
            }
            return instituteContent;
        }

        //删除选中标记
        public static void clearSelectFlag(IList<object> markedFuncs)
        {
            IDictionary<string, object> funcItem = null;
            for (int i = 0; i < markedFuncs.Count(); i++)
            {
                funcItem = (IDictionary<string, object>)markedFuncs[i];
                if (funcItem.ContainsKey("halfSelect"))
                {
                    funcItem.Remove("halfSelect");
                    if (funcItem.ContainsKey("children"))
                    {
                        clearSelectFlag((IList<object>)funcItem["children"]);
                    }
                }
                else if (funcItem.ContainsKey("select"))
                {
                    funcItem.Remove("select");
                }
            }
        }

        //返回当前的操作权限
        public static string getOperPermissions(string funcId, IList<object> funcs)
        {
            string access = null;
            foreach (IDictionary<string, object> funcItem in funcs)
            {
                if (funcItem.ContainsKey("target"))
                {
                    if (funcItem["target"].ToString() == funcId)
                    {
                        if (funcItem.ContainsKey("children"))
                        {
                            object permissionObj = ((IList<object>)funcItem["children"])[0];
                            IDictionary<string, object> permissionItem = (IDictionary<string, object>)permissionObj;
                            if (permissionItem.ContainsKey("access"))
                            {
                                access = permissionItem["access"].ToString();
                            }
                        }
                        break;
                    }
                    else
                    {
                        continue;
                    }
                }
                else
                {
                    if (funcItem.ContainsKey("children"))
                    {
                        access = getOperPermissions(funcId, (IList<object>)funcItem["children"]);
                        if (access != null)
                        {
                            break;
                        }
                    }
                }
            }
            return access;
        }

    }
}
