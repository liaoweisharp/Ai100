/// <reference path="../JQuery/jquery-1.4.1.min.js" />

var KpsEditHistoryArray = [] //编辑历史数组

function ViewKpsEditHistory() {
    var sBuilder = new Array();
    sBuilder.push("<div id='_KpsEditHistoryBox' style='padding:10px'>");
    sBuilder.push("<div style='padding-bottom:8px'>");
    sBuilder.push(" <select id='ddlEditType'>");
    sBuilder.push("     <option value='0'>最近编辑创建的知识点</option>");
    sBuilder.push("     <option value='1'>审核过的知识点</option>");
    sBuilder.push("     <option value='2'>未审核过的知识点</option>");
    sBuilder.push("     <option value='3'>有建议的知识点</option>");
    sBuilder.push("  </select>");
    sBuilder.push("</div>");
    sBuilder.push("<div id='dvKpsEditHistory' style='overflow-y:auto; height:366px; border:1px solid #BED7F5'>");
    sBuilder.push(" <table id='tbKpsEditHistory' class='cms_datatable'>");
    sBuilder.push("     <tr><th width='100'>单元</th><th width='560'>知识点</th><th>操作</th></tr>");
    sBuilder.push(" </table>");
    sBuilder.push("</div>");
    sBuilder.push("<center><div class='pagination' style='margin-top:10px'></div></center>")
    sBuilder.push("</div>");
    var $jb = $.jBox(sBuilder.join(""), { id: 'jb_KpsEditHistory', title: "知识点编辑历史", width: 880, top: "15%", buttons: { "关闭": true} });
    var $KpsEditHistoryBox = $jb.find("#_KpsEditHistoryBox");
    $KpsEditHistoryBox.find("#ddlEditType").bind("change", ddlKpsEditType_Change).trigger("change");
}

function ddlKpsEditType_Change() {
    if (this.value == -1) {
        return;
    }
    
    var bookId = $("#selBookList").find("option:selected").attr("id");
    if (this.value == 2) {
        $excuteWS("~CmsWS.getUnauditedLearningObjectiveIds", { userId: "", bookId: bookId, userExtend: SimpleUser }, function (result) {
            bindKpsPagination(result);
        }, null, null);
    } else {
        var operationType = "";
        switch (this.value) {
            case "0":
                operationType = "1";
                break;
            case "1":
                operationType = "3";
                break;
            case "3":
                operationType = "2";
                break;
        }
        $excuteWS("~CmsWS.listByContentOperation",
            { contentType: "2", operationType: operationType, userId: "", bookId: bookId, userExtend: SimpleUser }, function (result) {
                bindKpsPagination(result);
            }, null, null);
    }
}

var pageSize = 12;
function bindKpsPagination(kpIds) {
    $("div[class=pagination]").html("").pagination(kpIds.length, {
        num_edge_entries: 2,
        num_display_entries: 5,
        items_per_page: pageSize,
        callback: function (page_index, o) {
            var _startPos = page_index * pageSize;
            var _endPos = _startPos + (pageSize - 1);
            var ids = getKpIdsSlice(kpIds, _startPos, _endPos);
            SimpleUser.bookId = $("#selBookList").find("option:selected").attr("id");
            SimpleUser.isbn = $("#selBookList").val();
            $("#dvKpsEditHistory").showLoading();
            $excuteWS("~CmsWS.getLearningObjectiveForLoIds", { loIds: ids, userExtend: SimpleUser }, function (result) {
                KpsEditHistoryArray = result;
                bindKpsItems(result)
            }, null, null);
        }
    });
}

function getKpIdsSlice(kpIds, startpos, endpos) {
    if (kpIds) {
        var len = kpIds.length;
        if (endpos > len) {
            endpos = len;
        }
        return kpIds.slice(startpos, endpos + 1);
    } else {
        return [];
    }
}

function bindKpsItems(kpArray) {
    var $editHistoryBox = $("#_KpsEditHistoryBox");
    var $dvKpsEditHistory = $editHistoryBox.find("#dvKpsEditHistory");
    var $dataTable = $editHistoryBox.find("#tbKpsEditHistory");

    $dvKpsEditHistory.hideLoading();
    $dataTable.find("tr:gt(0)").remove();
    
    if (!kpArray || kpArray.length == 0) {
        $dataTable.append("<tr class='nodata lightblue'><td colspan='3'>无记录</td></tr>");
        return;
    }
    var sBuilder = [];
    $.each(kpArray, function (i) {
        if (i % 2 == 0) {
            rowClass = "class='lightblue'";
        } else {
            rowClass = "";
        }

        sBuilder = [];
        sBuilder.push("<tr id='" + this.id + "' " + rowClass + ">");
        sBuilder.push("<td>" + this.unit + "</td>");
        sBuilder.push("<td>" + this.name + "</td>");
        sBuilder.push("<td>");
        sBuilder.push(" <img style='cursor:pointer;' onclick='_editKp(this.parentNode, \"" + i + "\")' src='Images/page_white_edit.png' title='编辑知识点'>");
        sBuilder.push(" <img style='cursor:pointer;' onclick='_viewKpEditHistory(\"" + this.id + "\")' src='Images/history.png' title='编辑历史'>");
        sBuilder.push("</td>");
        sBuilder.push("</tr>");
        $dataTable.append(sBuilder.join(''));
    });
}

function _viewKpEditHistory(contentId) {
    var obj = new ContentEditHistory({
        bookId: $("#selBookList").find("option:selected").attr("id"),
        contentId: contentId,
        contentType: "2",
        simpleUser: SimpleUser
    });
    obj.Show();
}

function _editKp(editColumn, idx) {
    var tarKp = KpsEditHistoryArray[idx];
    EditKnowledgePoint1(tarKp, function (kp) {
        $(editColumn).prev().html(kp.name);
        var node = $BookStructureTree.dynatree("getTree").getNodeByKey(kp.id);
        if (node) {
            node.setTitle(kp.unit + ". " + kp.name);
            KnowledgePointsDataSvr.Update(node.parent.data.key, kp);
            showKnowledgeDetails(kp.id);
        }
    });
}