/// <reference path="../../Scripts/jquery-1.4.1.min.js" />
/// <reference path="../../Scripts/Array.js" />

/*
* 定义KnowledgePoints数据管理类
*/


function KnowledgePointsData() {
    ///<summary>构造KnowledgePoints数据维护类</summary>

    //KnowledgePoints列表
    this.kpList = new Array();
}

KnowledgePointsData.prototype.getKpStructure = function (sid) {
    ///<summary>返回KnowledgePoint结构对象（包含一个objective下的所有KnowledgePoint）</summary>
    ///<param name="sid" type="String">structure id</param>

    var idx = this.kpList.indexOf("structureId", sid);
    if (idx != -1) {
        return this.kpList[idx];
    } else {
        return null;
    }
}

KnowledgePointsData.prototype.AppendStructure = function (sid, kps) {
    ///<summary>构造KnowledgePoints结构对象</summary>
    ///<param name="sid" type="String">structure id</param>
    ///<param name="kps" type="Array">kp对象数组</param>
    
    var kpStructure = this.getKpStructure(sid);
    if (!kpStructure) {
        var newStructure = { structureId: sid, isDirty: false, knowledgePoints: kps };
        this.kpList.push(newStructure);
    }
}

KnowledgePointsData.prototype.Add = function (sid, kp) {
    ///<summary>添加KnowledgePoint对象</summary>
    ///<param name="sid" type="String">structure id</param>
    ///<param name="kp" type="Object">kp对象</param>

    var kpStructure = this.getKpStructure(sid);
    if (kpStructure) {
        kpStructure.isDirty = true;
        kpStructure.knowledgePoints.push(kp);
    }
}

KnowledgePointsData.prototype.Get = function (sid, kpId) {
    ///<summary>返回KnowledgePoint对象</summary>
    ///<param name="sid" type="String">structure id</param>
    ///<param name="kpId" type="String">kp的id</param>

    var kpStructure = this.getKpStructure(sid);
    if (kpStructure) {
        var kps = kpStructure.knowledgePoints;
        var idx = kps.indexOf("id", kpId);
        if (idx != -1) {
            return kps[idx];
        } else {
            return null;
        }
    } else {
        return null;
    }
}

KnowledgePointsData.prototype.GetList = function (sid) {
    ///<summary>返回一个StructureId对应的KnowledgePoint列表</summary>
    ///<param name="sid" type="String">structure id</param>

    var kpStructure = this.getKpStructure(sid);
    if (kpStructure) {
        return kpStructure.knowledgePoints;
    } else {
        return null;
    }
}

KnowledgePointsData.prototype.Update = function (sid, kp) {
    ///<summary>更新KnowledgePoint对象</summary>
    ///<param name="sid" type="String">structure id</param>
    ///<param name="kp" type="Object">kp对象</param>

    if (kp) {
        var kpStructure = this.getKpStructure(sid);
        if (kpStructure) {
            var kps = kpStructure.knowledgePoints;
            var idx = kps.indexOf("id", kp.id);
            if (idx != -1) {
                $.extend(kps[idx], kp);
            }
        }
    }
}

KnowledgePointsData.prototype.Del = function (sid, kpId) {
    ///<summary>删除并返回KnowledgePoint对象</summary>
    ///<param name="sid" type="String">structure id</param>
    ///<param name="kpId" type="String">kp的id</param>

    var kpStructure = this.getKpStructure(sid);
    if (kpStructure) {
        var kps = kpStructure.knowledgePoints;
        var idx = kps.indexOf("id", kpId);
        if (idx != -1) {
            var obj = kps.splice(idx, 1);
            return obj[0];
        } else {
            return null;
        }
    } else {
        return null;
    }
}

KnowledgePointsData.prototype.Move = function (sourceSid, targetSid, kpId) {
    ///<summary>移动KnowledgePoint数据对象</summary>
    ///<param name="sourceSid" type="String">kp源位置的StructureId(父Id)</param>
    ///<param name="targetSid" type="String">kp新位置的StructureId(父Id)</param>
    ///<param name="kpId" type="String">kp的id</param>

    var kpStructure = null;
    var kps = null;
    var idx = -1;
    var kp = null;

    kpStructure = this.getKpStructure(sourceSid);
    if (kpStructure) {
        kps = kpStructure.knowledgePoints;
        idx = kps.indexOf("id", kpId);
        if (idx != -1) {
            kp = kps.splice(idx, 1)[0];
        }
    }

    if (kp) {
        kpStructure = this.getKpStructure(targetSid);
        if (kpStructure) {
            kps = kpStructure.knowledgePoints;
            idx = kps.indexOf("id", kp.id);
            if (idx == -1) {
                kp.structureId = targetSid;
                kps.push(kp);
                kpStructure.isDirty = true;
            }
        }
    }
}

KnowledgePointsData.prototype.GetDirtyStructures = function () {
    ///<summary>返回已修改的结构对象/summary>

    var dirtyStructures = new Array();
    for (var i = 0; i < this.kpList.length; i++) {
        if (this.kpList[i].isDirty) {
            dirtyStructures.push(this.kpList[i]);
        }
    }
    return dirtyStructures;
}

KnowledgePointsData.prototype.GetDirtyStructureIds = function () {
    ///<summary>返回被修改过的StructureId集合</summary>

    var dirtyStructureIds = new Array();
    for (var i = 0; i < this.kpList.length; i++) {
        if (this.kpList[i].isDirty) {
            dirtyStructureIds.push(this.kpList[i].structureId);
        }
    }
    return dirtyStructureIds;
}

KnowledgePointsData.prototype.SetDirty = function (sid) {
    ///<summary>标识KnowledgePoint Structure已经修改</summary>
    ///<param name="sid" type="String">structure id</param>

    var kpStructure = this.getKpStructure(sid);
    if (kpStructure) {
        kpStructure.isDirty = true;
    }
}

KnowledgePointsData.prototype.IsDirty = function () {
    ///<summary>返回KnowledgePointsData是否被修改，有修改为true</summary>

    var isDirty = false;
    for (var i = 0; i < this.kpList.length; i++) {
        if (this.kpList[i].isDirty) {
            isDirty = true;
            break;
        }
    }
    return isDirty;
}