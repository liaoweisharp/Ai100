//Author: LW
function dynatree_getJsonOfTree(data, parentId, attrArr)
{
    /// <summary>生成树形菜单节点的json对象数组</summary>
    /// <param name="data" type="Array">树结构数组</param>
    /// <param name="parentId" type="String">第一层的parentId值</param>
    /// <param name="attrArr" type="Json">必须有如下的json结构{title,tooltip,key,parentId}.如：{title:item.name,tooltip:item.fullName,key:item.id,parentId:item.parentId}</param>
    if (!attrArr || !attrArr.title || !attrArr.tooltip || !attrArr.key || !attrArr.parentId)
    {
        var e = new Error();
        e.message = "attrArr 参数不够";
        throw e;
    }
    var childJsonArr = new Array();
    if (data)
    {
        var items = data.findAll(attrArr.parentId, parentId); //
        for (var i = 0; i < items.length; i++)
        {
            var item = items[i];
            var childJson = { title: item[attrArr.title], tooltip: item[attrArr.tooltip], key: item[attrArr.key] }; //
            var _childJsonArr = data.findAll(attrArr.parentId, item[attrArr.key]); //
            if (_childJsonArr.length > 0)
            {
                childJson["children"] = arguments.callee(data, item[attrArr.key], attrArr); //递归调用
            }
            childJsonArr.push(childJson);
        }
    }
    return childJsonArr;
}
