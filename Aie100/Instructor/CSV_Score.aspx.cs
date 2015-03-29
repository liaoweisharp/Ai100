using JEWS.EngineClient;
using JEWS.EngineReport;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Instructor_CSV_Score : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        CreateCSV();
    }
    /// <summary>
    /// csv添加逗号 用来区分列
    /// </summary>
    /// <param name="argFields">字段</param>
    /// <returns>添加后内容</returns>
    private StringBuilder AppendCSVFields(StringBuilder argSource, string argFields)
    {
        if (argFields != null)
        {
            return argSource.Append(argFields.Replace(",", " ").Trim()).Append(",");
        }
        else
        {
            return argSource.Append("").Append(",");
        }
    }


    /// <summary>
    /// 弹出下载框
    /// </summary>
    /// <param name="argResp">弹出页面</param>
    /// <param name="argFileStream">文件流</param>
    /// <param name="strFileName">文件名</param>
    private static void DownloadCSVFile(HttpResponse argResp, StringBuilder argFileStream, string strFileName)
    {
        try
        {
            string strResHeader = "attachment; filename=" + Guid.NewGuid().ToString() + ".csv";
            if (!string.IsNullOrEmpty(strFileName))
            {
                strResHeader = "inline; filename=" + strFileName;
            }
            argResp.AppendHeader("Content-Disposition", strResHeader);//attachment说明以附件下载，inline说明在线打开
            argResp.ContentType = "application/ms-excel";
            argResp.ContentEncoding = Encoding.GetEncoding(0); // Encoding.UTF8;//
            argResp.Write(argFileStream);

            

        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
    public void CreateCSV()
    {

        string sectionId = Request["sectionId"];
        string assignmentId = Request["assignmentId"];
        JEWS.EngineClient.UserExtend userExtend = new UsersWS().Users_getSimpleUserBySectionId(sectionId);
        ArrayList list = new ReportsWS().getInfoForIns(sectionId, assignmentId, userExtend);
        DataTable dt= getObject(list);
        //userId="48fe1f72-465f-4dad-94b7-286ad3d7d9f7";
        //sectionId = "1d09a45b-ebdd-485d-90b3-d44d349ae98d";

        //写出列名
        StringWriter swCSV = new StringWriter();
        //列名
        StringBuilder sbText = new StringBuilder();
        sbText = AppendCSVFields(sbText, "学生");
        sbText = AppendCSVFields(sbText, "提交时间");
        sbText = AppendCSVFields(sbText, "原始成绩");
        sbText = AppendCSVFields(sbText, "提高后成绩");
        //去掉尾部的逗号
        sbText.Remove(sbText.Length - 1, 1);
        //加入到对象中
        swCSV.WriteLine(sbText.ToString());
        
        foreach (DataRow row in dt.Rows)
        {
            StringBuilder _sb = new StringBuilder();
            string name= row["Name"] as string;
            string submitDate = row["SubmitDate"] as string;
            string score = row["Score"] as string;
            string improveScore = row["ImproveScore"] as string;
              
                _sb = AppendCSVFields(_sb, name);
                _sb = AppendCSVFields(_sb, submitDate);
                _sb = AppendCSVFields(_sb, score);
                _sb = AppendCSVFields(_sb, improveScore);
                //去掉尾部的逗号
                _sb.Remove(_sb.Length - 1, 1);
                //加入到对象中
                swCSV.WriteLine(_sb.ToString());

           
        }
        //写出列名结束

        StringBuilder fileName = new StringBuilder();

        fileName.Append("Score");
        fileName.Append(".csv");

        DownloadCSVFile(Response, swCSV.GetStringBuilder(), fileName.ToString());
        swCSV.Close();
        Response.End();
        // ExportDsToXls2(this.Page, filename, data.ToString());
    }
    private DataTable getObject(ArrayList datas)
    {

        Users[] users = datas[0] as Users[];
        TestResultWrapper[] testResults = datas[1] as TestResultWrapper[];
        AssignmentReport assignmentReport = datas[2] as AssignmentReport;
        System.Data.DataTable table = new System.Data.DataTable();
        table.Columns.Add("Name", typeof(string));
        table.Columns.Add("SubmitDate", typeof(string));
        table.Columns.Add("Score", typeof(string));
        table.Columns.Add("ImproveScore", typeof(string));
        // var knowledges = r3[2];
        for (int num = 0; num < users.Length; num++)
        {
            Users user = users[num];
            var name = user.fullName;
            var userId = user.id;
            var submitDate = "--";
            var score = "--";
            var tscore = "--";
            if (testResults != null)
            {
                var ins = testResults.FirstOrDefault(p => p.userId == userId);
                if (ins != null)
                {
                    submitDate = ins.submittedDate;
                    if (submitDate != null)
                    {
                        submitDate = submitDate.Split('.')[0];
                    }

                    float _adjust = 0;
                    float _totalScore = 0;
                    if (float.TryParse(ins.adjustScore, out _adjust) && float.TryParse(ins.totalScore, out _totalScore))
                    {
                        if (_adjust >= 0)
                        {
                            score = (Math.Round(_adjust / _totalScore, 2) * 100).ToString() ;
                        }
                        else
                        {
                            score = "--";
                        }
                    }
                    if (float.TryParse(ins.improvedScore, out _adjust) && float.TryParse(ins.totalScore, out _totalScore))
                    {
                        if (_adjust >= 0)
                        {
                            tscore = (Math.Round(_adjust / _totalScore, 2) * 100 ).ToString();
                        }
                        else
                        {
                            tscore = "--";
                        }
                    }

                }
            }
            System.Data.DataRow row = table.NewRow();
            row["Name"] = name;
            row["SubmitDate"] = submitDate;
            row["Score"] = score;
            row["ImproveScore"] = tscore;
            table.Rows.Add(row);
        }
        return table;

    }
}