using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;
using System.IO;

namespace JEWS
{
    public class XmlManage
    {
        public static Dictionary<string, string> get(string xmlPath,string privateKey)
        {
            Dictionary<string, string> returnValue = new Dictionary<string, string>();

            XDocument xdoc = null;
            using (StreamReader sr = new StreamReader(xmlPath))
            {
                xdoc = XDocument.Parse(sr.ReadToEnd());
            }
            IEnumerable<XElement> elements = xdoc.Root.Elements();
            XElement xelement = elements.FirstOrDefault(ins => ins.Name.LocalName == privateKey);
            if (xelement != null)
            {
                //IEnumerable<XElement> list= xelement.Elements();
                foreach (XElement item in xelement.Elements())
                {
                    string value = "", text = "";
                    foreach (XElement ins in item.Elements())
                    {
                        if (ins.Name.LocalName == "uniqueId")
                        {
                            value = ins.Value;
                        }
                        else if (ins.Name.LocalName == "text")
                        {
                            text = ins.Value;
                        }
                    }
                    returnValue.Add(value, text);
                }
            }
            // var d = from ele in xdoc select ele;
            return returnValue;
        }

        /// <summary>
        /// 返回CMS功能结构
        /// </summary>
        /// <param name="xmlPath">配置文件路径</param>
        /// <returns></returns>
        public static IList<object> GetCmsFuncStructs(string xmlPath)
        {
            XDocument xdoc = null;
            using (StreamReader sr = new StreamReader(xmlPath))
            {
                xdoc = XDocument.Parse(sr.ReadToEnd());
            }

            IEnumerable<XElement> elements = xdoc.Root.Elements();
            IDictionary<string, object> root = new Dictionary<string, object>();
            root.Add("key", "");
            buildFuncStructs(root, elements);

            if (root.ContainsKey("children"))
            {
                return ((IList<object>)root["children"]);
            }
            else
            {
                return null;
            }
        }

        /// <summary>
        /// 构造功能结构
        /// </summary>
        private static void buildFuncStructs(IDictionary<string, object> pstruct, IEnumerable<XElement> elements)
        {
            IList<object> childStructures = null;
            if (elements.Count() > 0)
            {
                childStructures = new List<object>();
                pstruct.Add("children", childStructures);
                pstruct.Add("isFolder", true);
            }
            else
            {
                return;
            }

            IDictionary<string, object> currStruct = null;
            foreach (XElement xe in elements)
            {
                currStruct = buildChildStruct(xe, childStructures, pstruct["key"].ToString());
                buildFuncStructs(currStruct, xe.Elements());
            }


        }

        /// <summary>
        /// 构造子结构
        /// </summary>
        private static IDictionary<string, object> buildChildStruct(XElement xe, IList<object> targets, string parentKey)
        {
            IDictionary<string, object> funcStruct = new Dictionary<string, object>();
            XAttribute xArrt = null;

            xArrt = xe.Attribute("id");
            if (xArrt != null)
            {
                funcStruct.Add("key", xArrt.Value);
            }
            xArrt = xe.Attribute("title");
            if (xArrt != null)
            {
                funcStruct.Add("title", xArrt.Value);
            }
            xArrt = xe.Attribute("target");
            if (xArrt != null)
            {
                funcStruct.Add("target", xArrt.Value);
            }
            xArrt = xe.Attribute("access");
            if (xArrt != null)
            {
                funcStruct.Add("access", xArrt.Value);
            }
            funcStruct.Add("parentKey", parentKey);
            targets.Add(funcStruct);

            return funcStruct;
        }
    }
}
