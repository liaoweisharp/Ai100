using JEWS.EngineReport;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace JEWS
{
    public class TreeViewManage
    {
        /// <summary>
        /// 得到BookStructure集合
        /// </summary>
        /// <param name="isbn"></param>
        /// <param name="userExtend"></param>
        /// <param name="isLazy">确定知识点否是为延迟加载节点</param>
        /// <returns></returns>
        public object[] getTreeViewData(String isbn, bool isLazy, bool sampleQuestionFlag,string userId, UserExtend userExtend)
        {
            object[] retArr = new object[2];
            CmsEngine cmsEngine = new CmsEngine();

            //获取bookStructure信息

            KnowledgeGradesWrapper[] knowledgeGradesWrapperArray = new ReportEngine().knowledgeGradesNoKpOfISBN(isbn, sampleQuestionFlag,userId, userExtend); //null;

            if (knowledgeGradesWrapperArray != null && knowledgeGradesWrapperArray.Length > 0)
            {
                //找到BookContentStructures中的book对象
                KnowledgeGradesWrapper book = getBookForBookContentStructure(knowledgeGradesWrapperArray);

                if (book != null)
                {
                    //创建book节点
                    IDictionary<string, object> bookStructure = new Dictionary<string, object>();
                    bookStructure.Add("title", book.itemName);
                    bookStructure.Add("key", book.itemId);
                    bookStructure.Add("bookId", book.itemId);
                    bookStructure.Add("structureLevel", book.structureLevel);
                    bookStructure.Add("tooltip", book.structureType);
                    bookStructure.Add("unit", "");
                    if (book.structureLevel == "10")
                    {
                        bookStructure.Add("isLazy", true);
                    }
                    else
                    {
                        bookStructure.Add("expand", true);
                    }

                    AddChildAction addChild = null;
                    if (isLazy)
                    {
                        addChild = addChildNodeLazy;
                    }
                    else
                    {
                        addChild = addChildNode;
                    }
                    buildBookStructureNodes(bookStructure, knowledgeGradesWrapperArray, 1, addChild);

                    if (!bookStructure.ContainsKey("isFolder"))
                    {
                        bookStructure.Add("isFolder", true);
                    }
                    retArr[0] = bookStructure;  //节点数据
                    retArr[1] = knowledgeGradesWrapperArray; //BookStructure原始数据
                }
            }

            return retArr;
        }

        /// <summary>
        /// 构造BookStructure的树形结构
        /// </summary>
        /// <param name="parentNode">父节点</param>
        /// <param name="arrOriginal">源数据</param>
        /// <param name="targets">目标数据</param>
        /// <param name="depth">树的深度</param>
        private static void buildBookStructureNodes(IDictionary<string, object> parentNode, KnowledgeGradesWrapper[] arrOriginal, byte depth, AddChildAction addChild)
        {
            //筛选子节点数据
            string parentId = parentNode["key"].ToString();
            KnowledgeGradesWrapper[] bcsws = (from inst in arrOriginal where inst.parentId == parentId select inst).ToArray();
            if (bcsws.Length != 0)
            {
                depth++;
            }
            else
            {
                return;
            }

            //可以在数据源(arrOriginal)中删除已经筛选出的节点以减少比较次数


            //确定父节点包含子节点时需要设置相关属性
            IList<object> childNodes = new List<object>();
            parentNode.Add("children", childNodes);
            parentNode.Add("isFolder", true);

            IDictionary<string, object> currNode = null;
            foreach (KnowledgeGradesWrapper bcsw in bcsws)
            {
                currNode = addChild(bcsw, childNodes, depth);
                buildBookStructureNodes(currNode, arrOriginal, depth, addChild);
            }
        }

        /// <summary>
        /// 添加孩子节点的方法
        /// </summary>
        /// <param name="bcsw"></param>
        /// <param name="childNodes"></param>
        /// <param name="depth"></param>
        /// <returns></returns>
        public delegate IDictionary<string, object> AddChildAction(KnowledgeGradesWrapper kgw, IList<object> childNodes, byte depth);

        /// <summary>
        /// 添加子节点
        /// </summary>
        /// <param name="kgw">数据</param>
        /// <param name="childNodes">子节点数组</param>
        /// <param name="depth">树的深度</param>
        /// <returns></returns>
        private static IDictionary<string, object> addChildNode(KnowledgeGradesWrapper kgw, IList<object> childNodes, byte depth)
        {
            IDictionary<string, object> node = new Dictionary<string, object>();
            node.Add("title", kgw.unit + " " + kgw.itemName);
            node.Add("key", kgw.itemId);
            node.Add("tooltip", kgw.structureType);
            node.Add("structureLevel", kgw.structureLevel);
            node.Add("unit", kgw.unit);
            childNodes.Add(node);
            return node;
        }

        /// <summary>
        /// 添加子节点（延迟加载）
        /// </summary>
        /// <param name="kgw">数据</param>
        /// <param name="childNodes">子节点数组</param>
        /// <param name="depth">树的深度</param>
        /// <returns></returns>
        private static IDictionary<string, object> addChildNodeLazy(KnowledgeGradesWrapper kgw, IList<object> childNodes, byte depth)
        {
            IDictionary<string, object> node = new Dictionary<string, object>();
            node.Add("title", kgw.unit + " " + kgw.itemName);
            node.Add("key", kgw.itemId);
            node.Add("tooltip", kgw.structureType);
            node.Add("structureLevel", kgw.structureLevel);
            node.Add("unit", kgw.unit);
            if (kgw.structureLevel == "10")
            {
                node.Add("isLazy", true);   //添加延迟属性
                node.Add("isFolder", true);
            }
            childNodes.Add(node);
            return node;
        }

        private static KnowledgeGradesWrapper getBookForBookContentStructure(KnowledgeGradesWrapper[] knowledgeGradesWrapperArray)
        {
            //在BookContentStructures中，book对象的parentId为空
            KnowledgeGradesWrapper[] bsws = (from inst in knowledgeGradesWrapperArray where inst.parentId == "" select inst).ToArray();
            if (bsws != null && bsws.Length > 0)
            {
                return bsws[0];
            }
            else
            {
                return null;
            }
        }
    }


}
