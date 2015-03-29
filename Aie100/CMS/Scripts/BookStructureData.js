/// <reference path="../../Scripts/jquery-1.4.1.min.js" />
/// <reference path="../../Scripts/Array.js" />

/*
* 定义BookStructure数据管理类
*/

function BookStructureData(bsArr) {
    ///<summary>构造BookStructure数据维护类</summary>
    ///<param name="bsObjArr" type="Array">BookStructure对象数组</param>

    //BookStructure列表
    this.bsList = new Array();
    if (typeof bsArr != "undefined" && bsArr && bsArr.length > 0) {
        this.bsList = bsArr;
    }

    //数据修改标志，有修改为true
    this.isDirty = false;
}

BookStructureData.prototype.Append = function (bs) {
    ///<summary>保存新节点信息</summary>

    if (bs) {
        this.bsList.push(bs);
        if (!this.isDirty) {
            this.isDirty = true;
        }
    }
}

BookStructureData.prototype.Get = function (sid) {
    ///<summary>根据BookStructure.contentId获取节点信息</summary>
    ///<param name="sid" type="String">structure id</param>

    var idx = this.bsList.indexOf("contentId", sid);
    if (idx != -1) {
        return this.bsList[idx];
    } else {
        return null;
    }

}

BookStructureData.prototype.GetList = function () {
    ///<summary>返回BookStructure列表</summary>

    return this.bsList;
}

BookStructureData.prototype.Update = function (bs) {
    if (bs) {
        var idx = this.bsList.indexOf("contentId", bs.contentId);
        if (idx != -1) {
            $.extend(this.bsList[idx], bs);
        }
    }
}

BookStructureData.prototype.UpdateParent = function (sid, parentId) {
    ///<summary>更新父节点信息</summary>
    ///<param name="sid" type="String">structure id</param>
    ///<param name="parentId" type="String">parent structure id</param>

    var idx = this.bsList.indexOf("contentId", sid);
    if (idx != -1) {
        this.bsList[idx].parentId = parentId;
        this.SetDirty();
    }
}

BookStructureData.prototype.SetDirty = function () {
    ///<summary>标识数据已经修改</summary>

    if (!this.isDirty) {
        this.isDirty = true;
    }
}

BookStructureData.prototype.IsDirty = function () {
    ///<summary>数据是否被修改，有修改为true</summary>
    
    return this.isDirty;
}

BookStructureData.prototype.Del = function (sid) {
    ///<summary>根据BookStructure.contentId删除节点信息</summary>
    ///<param name="sid" type="String">structure id</param>

    var idx = this.bsList.indexOf("contentId", sid);
    if (idx != -1) {
        var obj = this.bsList.splice(idx, 1);
        return obj[0];
    } else {
        return null;
    }
}