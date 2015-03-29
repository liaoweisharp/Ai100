using JEWS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class TestShow_TestContent : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (JEWS.SessionManage.SimpleUser == null) {
            return;
        }
        JEWS.EngineReport.TestResultWrapper testResultWrapper = null;
        string testResultId = Request["testResultId"];
        string assingmentId = Request["assignmentId"];

        if (testResultId != null && testResultId.Trim() != "")
        {
            testResultWrapper = new ReportEngine().testResultById(testResultId, JEWS.SessionManage.SimpleUser.userId, TOOLS.ObjectUtil.CopyObjectPoperty<JEWS.EngineReport.UserExtend, JEWS.EngineClient.UserExtend>(JEWS.SessionManage.SimpleUser));
        }
        else
        {
            JEWS.EngineClient.UserExtend user = TOOLS.ObjectUtil.CopyObjectPoperty<JEWS.EngineClient.UserExtend, JEWS.EngineClient.UserExtend>(JEWS.SessionManage.SimpleUser);
            JEWS.EngineClient.Assignment[] asmts = new AssignmentEngine().assignmentByIds(new string[] { assingmentId }, JEWS.SessionManage.SimpleUser.courseId, JEWS.SessionManage.SimpleUser.sectionId, JEWS.SessionManage.SimpleUser.userId, user);
            string testId = null;
            if (asmts != null && asmts.Length > 0)
            {
                testId = asmts[0].testId;
            }
            testResultWrapper = new ReportEngine().testResultByAssignment(testId, assingmentId, "1", TOOLS.ObjectUtil.CopyObjectPoperty<JEWS.EngineReport.UserExtend, JEWS.EngineClient.UserExtend>(JEWS.SessionManage.SimpleUser));
        }

        string type = Request["type"];
        if (testResultWrapper != null)
        {
            if (type == "2")
            {
                if (testResultWrapper.improveType == "1")//提高考试被提交了
                {
                    if (testResultWrapper.improveScoreFlag != "1")//还没有阅卷
                    {
                        this.Page.ClientScript.RegisterClientScriptBlock(this.Page.GetType(), "error", "<script>document.body.innerHTML='<div style=\"font-weight:bold;font-size:30px;color:#888\">该考试已被提交，你不能再进行考试。</div>';window.submittedFlag=true;</script>");
                    }
                   
                }
            }
            else
            {
                if (testResultWrapper.type == "1")//考试提交了
                {
                    if (testResultWrapper.scoreFlag == "1")//已经阅卷了
                    {
                        this.Page.ClientScript.RegisterClientScriptBlock(this.Page.GetType(), "error", "<script>document.body.innerHTML='<div style=\"font-weight:bold;font-size:30px;color:#888\">试卷已批改，你不能再进行考试。</div>';window.submittedFlag=true;</script>");
                    }
                    else
                    {
                        this.Page.ClientScript.RegisterClientScriptBlock(this.Page.GetType(), "error", "<script>document.body.innerHTML='<div style=\"font-weight:bold;font-size:30px;color:#888\">该考试已被提交，你不能再进行考试。</div>';window.submittedFlag=true;</script>");
                    }
                }
            }
            //if ((type!="2" && testResultWrapper.type == "1") || (type == "2" && testResultWrapper.type == "1"))
            //{
            //    if (testResultWrapper.scoreFlag != "1")//考试提交了，但是没有打分
            //    {
            //        this.Page.ClientScript.RegisterClientScriptBlock(this.Page.GetType(), "error", "<script>document.body.innerHTML='<div style=\"font-weight:bold;font-size:30px;color:#888\">该考试已被提交，你不能再进行考试。</div>';window.submittedFlag=true;</script>");
            //    }
            //    else//考试提交了，已经打分了
            //    {
            //        this.Page.ClientScript.RegisterClientScriptBlock(this.Page.GetType(), "error", "<script>document.body.innerHTML='<div style=\"font-weight:bold;font-size:30px;color:#888\">该考试已结束，你不能再进行考试。</div>';window.submittedFlag=true;</script>");
            //    }
            //}
        }
        //if (Request["type"] == "2")
        //{
        //    if (testResultWrapper != null && testResultWrapper.improveScoreFlag != "1")
        //    {
        //        if (testResultWrapper.improveType == "1")
        //        {
        //            this.Page.ClientScript.RegisterClientScriptBlock(this.Page.GetType(), "error", "<script>document.body.innerHTML='<div style=\"font-weight:bold;font-size:30px;color:#888\">该试卷还未批改，你暂时不能进行提高训练。</div>';window.submittedFlag=true;</script>");
        //        }
        //    }
        //    else if (testResultWrapper==null)
        //    {
        //        this.Page.ClientScript.RegisterClientScriptBlock(this.Page.GetType(), "error", "<script>document.body.innerHTML='<div style=\"font-weight:bold;font-size:30px;color:#888\">该试卷还未提交，你暂时不能进行提高训练。</div>';window.submittedFlag=true;</script>");
        //    }
        //}
        //else
        //{
        //    if (testResultWrapper != null)
        //    {
        //        if (testResultWrapper.type == "1" )
        //        {
        //            if (testResultWrapper.scoreFlag != "1")//考试提交了，但是没有打分
        //            {
        //                this.Page.ClientScript.RegisterClientScriptBlock(this.Page.GetType(), "error", "<script>document.body.innerHTML='<div style=\"font-weight:bold;font-size:30px;color:#888\">该考试已被提交，你不能再进行考试。</div>';window.submittedFlag=true;</script>");
        //            }
        //            else//考试提交了，已经打分了
        //            {
        //                this.Page.ClientScript.RegisterClientScriptBlock(this.Page.GetType(), "error", "<script>document.body.innerHTML='<div style=\"font-weight:bold;font-size:30px;color:#888\">该考试已结束，你不能再进行考试。</div>';window.submittedFlag=true;</script>");
        //            }
        //        }
        //        //else 
        //        //{
        //        //    this.Page.ClientScript.RegisterClientScriptBlock(this.Page.GetType(), "error", "<script>document.body.innerHTML='<div style=\"font-weight:bold;font-size:30px;color:#888\">该考试已结束，你不能再进行考试。</div>';window.submittedFlag=true;</script>");
        //        //}
        //    }
        //}
        
    }
}