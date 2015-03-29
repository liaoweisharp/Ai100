using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;

public partial class Upload : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/plain";
        Response.Charset = "utf-8";
        HttpPostedFile file = Request.Files["FileData"];
        string uploadpath = Server.MapPath(Request["folder"] + "\\");

        if (file != null)
        {
            //if (!Directory.Exists(uploadpath))
            //{
            //    Directory.CreateDirectory(uploadpath);
            //}
            //try
            //{
            //    file.SaveAs(uploadpath + file.FileName);
            //    Response.Write("1");
            //}
            //catch (Exception ex) {
            //    ex.ToString();
            //    Response.Write("0");
            //}



            if (!Directory.Exists(uploadpath))
            {
                Directory.CreateDirectory(uploadpath);
            }
            string fileName = "";
            try
            {
                fileName = Guid.NewGuid() + file.FileName.Substring(file.FileName.LastIndexOf('.'));
                file.SaveAs(uploadpath + fileName);
                Response.Write("1[" + fileName + "]");
            }
            catch (Exception ex)
            {
                ex.ToString();
                Response.Write("0");
            }
        }
        else
        {
            Response.Write("0");
        }
    }
}