using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using JEWS;
using JEWS.EngineClient;

/// <summary>
/// AssignmentWS 的摘要说明
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// 若要允许使用 ASP.NET AJAX 从脚本中调用此 Web 服务，请取消注释以下行。 
[System.Web.Script.Services.ScriptService]
public class AssignmentWS : System.Web.Services.WebService {

    public AssignmentWS () {

        //如果使用设计的组件，请取消注释以下行 
        //InitializeComponent(); 
    }

    [WebMethod(Description = "管理任务", EnableSession = true)]
    public bool? manageAssignment(Assignment assignment, AssignmentSetting assignmentSetting,UserExtend userExtend)
    {
        assignment.assignmentTypeSpecified = assignment.createDateSpecified = assignment.dateControlSpecified = assignment.testTimeSpecified = assignment.timeStateSpecified = assignment.upsetQuestionSpecified = true;
        assignment.startDateSpecified = assignment.endDateSpecified = true;
        assignment.markingModelSpecified = true;
        assignment.upsetQuestionSpecified = true;
        assignment.shorTestTimeSpecified = true;
        assignmentSetting.allowDrillImproveSpecified = true;
        assignmentSetting.allowErrorQuestionImproveSpecified = true;
        assignmentSetting.showAnswerSpecified = true;
        assignmentSetting.showDrillSpecified = true;
        assignmentSetting.showErrorQuestionSpecified = true;
        assignmentSetting.showHintSpecified = true;
        assignmentSetting.showKpSpecified = true;
        assignmentSetting.showSolutionSpecified = true;
        return new AssignmentEngine().manageAssignment(assignment, assignmentSetting, userExtend);
    }

    [WebMethod(Description = "根据主键集合得到assignment对像集合", EnableSession = true)]
    public Assignment[] assignmentByIds(string[] assignmentIds, string courseId, string sectionId, string userId, UserExtend userExtend)
    {
        return new AssignmentEngine().assignmentByIds(assignmentIds, courseId, sectionId, userId, userExtend);
    }
   

    [WebMethod(Description = "根据设置ID集合得到设置", EnableSession = true)]
    public AssignmentSetting[] assignmentSettingByIds(string[] ids, UserExtend userExtend)
    {
        return new AssignmentEngine().assignmentSettingByIds(ids, userExtend);
    }

    [WebMethod(EnableSession = true)]
    public AssignmentReportInstructor assignmentRInstructor(string structureId, string courseId, string sectionId, string userId, UserExtend userExtend)
    {
        return new AssignmentEngine().assignmentRInstructor(structureId, courseId, sectionId, userId, userExtend);
    }

    [WebMethod(EnableSession = true)]
    public AssignmentReportInstructor assignmentRInstructorByCourse(string courseId, string userId, UserExtend userExtend)
    {
        return new AssignmentEngine().assignmentRInstructorByCourse(courseId, userId, userExtend);
    }

    [WebMethod(EnableSession = true)]
    public AssignmentReportStudent assignmentRStudent(string structureId, string courseId, string sectionId, string userId, UserExtend userExtend)
    {
        return new AssignmentEngine().assignmentRStudent(structureId, courseId, sectionId, userId, userExtend);
    }

    [WebMethod(Description="返回学生查看相互阅卷的一组任务的时候 ，返回需要他去阅卷的一组任务", EnableSession = true)]
    public anyType2anyTypeMapEntry[] assignmentIdsByotherMarking(string[] assignmentIds, string userId, string sectionId, UserExtend userExtend)
    {
        return new AssignmentEngine().assignmentIdsByotherMarking(assignmentIds, userId, sectionId, userExtend);
    }

    [WebMethod(Description = "检查是否完成阅卷人设置", EnableSession = true)]
    public bool? uuSectionCompleted(string sectionId, UserExtend userExtend)
    {
        return new AssignmentEngine().uuSectionCompleted(sectionId, userExtend);
    }
   
}
