using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using JEWS.EngineClient;

namespace JEWS
{
    [Serializable]
    public class AssignmentEngine
    {
        private ClientSystemWebService asmtClientSysWS = new ClientSystemWebService();
        public AssignmentEngine() { }
        ~AssignmentEngine()
        {
            asmtClientSysWS.Dispose();
            GC.SuppressFinalize(this);
        }

        #region Assignment

        //根据主键集合得到assignment对像集合。

        public Assignment[] assignmentByIds(string[] assignmentIds, string courseId, string sectionId, string userId, UserExtend userExtend)
        {
            return asmtClientSysWS.assignmentByIds(assignmentIds, courseId, sectionId, userId, userExtend);
        }

        //根据structureId得到该节点的全部任务（学生教师都可用）  按开始时间排序
        public string[] assignmentIdsByStructureId(string structureId, string courseId, string sectionId, string userId, UserExtend userExtend)
        {
            return asmtClientSysWS.assignmentIdsByStructureId(structureId, courseId, sectionId, userId, userExtend);
        }

       

        //管理任务
        public bool? manageAssignment(Assignment assignment, AssignmentSetting assignmentSetting, UserExtend userExtend)
        {
            return asmtClientSysWS.assignmentManage(assignment, assignmentSetting,null, userExtend);
        }

        //删除任务 相当于把assignment禁用了
        public bool? removeAssignment(string assignmentId, UserExtend userExtend)
        {
            return asmtClientSysWS.assignmentRemove(assignmentId, userExtend);
        }
       #endregion

        #region AssignmentSetting
        public AssignmentSetting[] assignmentSettingByIds(string[] ids, UserExtend userExtend)
        {
            return asmtClientSysWS.assignmentSettingByIds(ids, userExtend);
        }
        #endregion

        //返回某个班在指定的assignmnet的平均完成以及成绩情况。
        public AssignmentReport[] assignmentReportBySectionAssignmentIds(string[] assignmentIds, string sectionId, UserExtend userExtend)
        {
            return asmtClientSysWS.assignmentReportBySectionAssignmentIds(assignmentIds,sectionId,userExtend);
        }
        public AssignmentReport assignmentReportBySectionAssignmentId(string assignmentId, string sectionId, UserExtend userExtend)
        {
            AssignmentReport[] assignmentReports = asmtClientSysWS.assignmentReportBySectionAssignmentIds(new string[]{assignmentId}, sectionId, userExtend);
            if (assignmentReports != null && assignmentReports.Count() == 1)
            {
                return assignmentReports[0];
            }
            else {
                return null;
            }
        }

        public AssignmentReport assignmentReportByOtherAssignmentIds(string assignmentId,string userId, string sectionId, UserExtend userExtend)
        {
            AssignmentReport[] assignmentReports = asmtClientSysWS.assignmentReportByOtherAssignmentIds(new string[] { assignmentId }, userId, sectionId, userExtend);
            if (assignmentReports != null && assignmentReports.Count() == 1)
            {
                return assignmentReports[0];
            }
            else
            {
                return null;
            }
        }

        public Assignment assignmentById(string assignmentId, string courseId, string sectionId, string userId, UserExtend userExtend)
        {
            Assignment[] assignmentArr= assignmentByIds(new string[] { assignmentId }, courseId, sectionId, userId, userExtend);
            if (assignmentArr != null && assignmentArr.Count() > 0)
            {
                return assignmentArr[0];
            }
            else {
                return null;
            }
        }

        public AssignmentReportStudent assignmentRStudent(string structureId, string courseId, string sectionId, string userId, UserExtend userExtend)
        {
            return asmtClientSysWS.assignmentRStudent(structureId, courseId, sectionId, userId, userExtend);
        }

        public AssignmentReportInstructor assignmentRInstructor(string structureId, string courseId, string sectionId, string userId, UserExtend userExtend)
        {
            return asmtClientSysWS.assignmentRInstructor(structureId, courseId, sectionId, userId, userExtend);
        }

        public AssignmentReportInstructor assignmentRInstructorByCourse(string courseId,  string userId, UserExtend userExtend)
        {
            return asmtClientSysWS.assignmentRInstructorByCourse(courseId, userId, userExtend);
        }

        /// <summary>
        /// 返回学生查看相互阅卷的一组assignment的时候 ，返回需要他去阅卷的一组assignment
        /// </summary>
        /// <param name="assignmentIds"></param>
        /// <param name="userId"></param>
        /// <param name="sectionId"></param>
        /// <param name="userExtend"></param>
        /// <returns></returns>
        public anyType2anyTypeMapEntry[] assignmentIdsByotherMarking(string[] assignmentIds, string userId, string sectionId, UserExtend userExtend)
        {
            return asmtClientSysWS.assignmentIdsByotherMarking(assignmentIds, userId, sectionId, userExtend);
        }

        //检查是否完成阅卷人设置
        public bool? uuSectionCompleted(string sectionId, UserExtend userExtend)
        {
            return asmtClientSysWS.uuSectionCompleted(sectionId, userExtend);
        }

       

    }
}
