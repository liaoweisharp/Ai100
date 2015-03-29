using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class UploadImage : System.Web.UI.Page
{

    protected void Page_Load(object sender, EventArgs e)
    {
        string filename = Request.QueryString["filename"].ToString();
        string bookId = Request.QueryString["bookId"].ToString();

        string uploadpath = Server.MapPath("./Uploads/CMS/" + bookId + "/Test/");

        //string uploadpath = Server.MapPath("./");
        if (!Directory.Exists(uploadpath))
        {
            Directory.CreateDirectory(uploadpath);
        }
        try
        {
            using (FileStream fs = File.Create(uploadpath + filename))
            {
                // SaveFile(Request.InputStream, fs);
                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = Request.InputStream.Read(buffer, 0, buffer.Length)) != 0)
                {
                    fs.Write(buffer, 0, bytesRead);
                }

            }
            Response.Write("1");
        }
        catch (Exception ex)
        {
            ex.ToString();
            Response.Write("0");
        }

    }

}