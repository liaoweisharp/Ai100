using JEWS;
using JEWS.EngineClient;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;

/// <summary>
/// ReportsWS 的摘要说明
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// 若要允许使用 ASP.NET AJAX 从脚本中调用此 Web 服务，请取消注释以下行。 
 [System.Web.Script.Services.ScriptService]
public class ReportsWS : System.Web.Services.WebService {

    public ReportsWS () {

        //如果使用设计的组件，请取消注释以下行 
        //InitializeComponent(); 
    }

    [WebMethod]
    public string HelloWorld() {
        return "Hello World";
    }
    [WebMethod(Description = "seciontId获得所有学生", EnableSession = true)]
    public ArrayList getInfoForIns(string sectionId,string assignmentId, JEWS.EngineClient.UserExtend userExtend)
    {
        ArrayList returnValue = new ArrayList();
        returnValue.Add(new UserEngine().usersStdBySectionId(sectionId, userExtend));
        JEWS.EngineReport.UserExtend userExtend_Re= TOOLS.ObjectUtil.CopyObjectPoperty<JEWS.EngineReport.UserExtend, JEWS.EngineClient.UserExtend>(userExtend);
        returnValue.Add(new ReportEngine().testResulNormalBySectionAssignment(assignmentId, userExtend_Re));
        returnValue.Add(new AssignmentEngine().assignmentReportBySectionAssignmentId(assignmentId, sectionId, userExtend));
        return returnValue;
    }

    [WebMethod(Description = "学生查看自己一个组的成员报告", EnableSession = true)]
    public ArrayList getInfoForStu(string userId,string sectionId, string assignmentId, JEWS.EngineClient.UserExtend userExtend)
    {
        ArrayList returnValue = new ArrayList();
        returnValue.Add(new UserEngine().userStdByOther(userId,sectionId, userExtend));
        JEWS.EngineReport.UserExtend userExtend_Re = TOOLS.ObjectUtil.CopyObjectPoperty<JEWS.EngineReport.UserExtend, JEWS.EngineClient.UserExtend>(userExtend);
        returnValue.Add(new ReportEngine().testResultOtherByAssignment(assignmentId,userId,sectionId, userExtend_Re));
        returnValue.Add(new AssignmentEngine().assignmentReportByOtherAssignmentIds(assignmentId,userId, sectionId, userExtend));
        return returnValue;
    }
    [WebMethod(Description = "学习效率评估报告", EnableSession = true)]
    public ArrayList getEfficiencyEvaluations(string sectionId, JEWS.EngineClient.UserExtend userExtend)
    {
        ArrayList returnValue = new ArrayList();
        JEWS.EngineReport.UserExtend userExtend_Re = TOOLS.ObjectUtil.CopyObjectPoperty<JEWS.EngineReport.UserExtend, JEWS.EngineClient.UserExtend>(userExtend);
        returnValue.Add(new ReportEngine().getEfficiencyEvaluations(sectionId, userExtend_Re));
        returnValue.Add(new UserEngine().usersStdBySectionId(sectionId, userExtend));
        return returnValue;
    }


    [WebMethod(Description = "根据主键集合得到assignment对像集合", EnableSession = true)]
    public Assignment assignmentById(string assignmentId, string courseId, string sectionId, string userId, JEWS.EngineClient.UserExtend userExtend)
    {
        return new AssignmentEngine().assignmentById(assignmentId, courseId, sectionId, userId, userExtend);
    }
   
    
}
