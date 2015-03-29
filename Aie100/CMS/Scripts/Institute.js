/// <reference path="../../Scripts/JQuery/jquery-1.4.1.min.js" />

var InstituteWrapperArray = [];
var StateWrapperArray = [];
function PageLoad() {
    InitCmsMenu("m_setInstitute");
    LoadInstituteList();
    $("#InstituteInfoBar #btnAdd").click(function () {
        editInstituteInfo();
    });

    //$("#btnQuery").click(function () {
    //    var key = $.trim($("#keys").val().toString());
    //    query(key);
    //});
}

function LoadInstituteList() {
    var $contentbox = $(".cms_contentbox").showLoading();
    $excuteWS("~CourseWS.instituteIdsAllList", { userExtend: SimpleUser }, function (result) {
        $contentbox.hideLoading();
        var instituteIds = (result && result.length > 0) ? result : [];
        bindInstitutePagin(instituteIds);
    }, null, null);
}

var pageSize = 25;
function bindInstitutePagin(instituteIds) {
    $("#institutePagin").html("").pagination(instituteIds.length, {
        num_edge_entries: 2,
        num_display_entries: 5,
        items_per_page: pageSize,
        prev_text: "上一页",
        next_text: "下一页",
        callback: function (page_index, o) {
            var $contentbox = $(".cms_contentbox").showLoading();
            var _startPos = page_index * pageSize;
            var _endPos = _startPos + (pageSize - 1);
            var pageIds = getIdsArray(instituteIds, _startPos, _endPos);
            $excuteWS("~CourseWS.instituteByIds", { instituteIds: pageIds, userExtend: SimpleUser }, function (result) {
                $contentbox.hideLoading();
                bindInstituteList(result);
            }, null, null);
        }
    });
}

function bindInstituteList(result) {
    var $dataTable = $(".cms_datatable");

    InstituteWrapperArray = result;
    $dataTable.find("tr:gt(0)").remove();
    if (!result || result.length == 0) {
        $dataTable.append("<tr class='nodata lightblue'><td colspan='6'>无记录</td></tr>");
        return;
    }
    var sBuilder = [];
    var rowClass = "";

    $.each(result, function (i) {
        if (i % 2 == 0) {
            rowClass = "class='lightblue'";
        } else {
            rowClass = "";
        }

        var Name = (this.name) ? this.name : "";
        var Type = (this.type) ? "常规" : "系统学院";
        var Address = (this.adress) ? this.adress : "";
        var City = (this.cityId) ? this.cityId : "";
        sBuilder = [];
        sBuilder.push("<tr id='" + this.id + "'" + rowClass + ">");
        sBuilder.push("<td>" + Name + "</td>");
        sBuilder.push("<td style='text-align:center'>" + Type + "</td>");
        sBuilder.push("<td style='text-align:center'>" + Address + "</td>");
        sBuilder.push("<td style='text-align:center'>" + City + "</td>");
        sBuilder.push("<td class='operate'><img src='Images/application_edit.png' title='编辑' onclick=\"editInstituteInfo('" + this.id + "')\" />&nbsp;<img src='Images/application_delete.png' title='删除' onclick=\"deleteInstituteInfo('" + this.id + "')\" /></td>");
        sBuilder.push("</tr>");
        $dataTable.append(sBuilder.join(''));
    });
    $dataTable.find("tr:gt(0)").hover(function () {
        $(this).addClass("hover");
    }, function () {
        $(this).removeClass("hover");
    });

    _resizeCmsBox("cms_contentbox", 60);
}

//编辑学院信息
function editInstituteInfo(instituteId) {
    var title = "";
    var _instituteId = "";
    if (instituteId) {
        title = "编辑学院信息";
        _instituteId = instituteId;
    } else {
        title = "添加学院";
        _instituteId = "";
    }

    var $jb = $.jBox(initInstituteBox(), { id: 'jb_cmsInstitute', title: title, width: 580, top: "25%", buttons: { "保存": true, "取消": false }, submit: submitInstituteInfo });
    var $institute = $jb.find("#cms_dialog_institute");
    $institute.data("_instituteId", _instituteId);
    var $ddlState = $institute.find("#ddlState");
    if (instituteId) {
        var institute = getInstituteInfoObj(instituteId);
        $institute.find("#txtName").val(institute.name);
        if (institute.type == 0) {
            $("#cbxIsSysInstitute").attr("checked", "checked");
        }
        $institute.find("#txtAddress").val(institute.adress);
        $institute.find("#txtCity").val(institute.cityId);
        $institute.find("#txtDescription").val(institute.Description);
    } 

}

//初始化学院信息
function initInstituteBox() {
    var sBuilder = new Array();
    sBuilder.push("<div id='cms_dialog_institute' class='cms_dialog'>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp;学院名称：</li>");
    sBuilder.push("    <li class='inp'><input id='txtName' name='txtName' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'>地址：</li>");
    sBuilder.push("    <li class='inp'><input id='txtAddress' name='txtAddress' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'>城市：</li>");
    sBuilder.push("    <li class='inp'><input id='txtCity' name='txtCity' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'>&nbsp;</li>");
    sBuilder.push("    <li class='inp'><input type='checkbox' name='cbxIsSysInstitute' id='cbxIsSysInstitute'><label for='cbxIsSysInstitute' style='margin-left:4px'>系统学院</label></li>");
    sBuilder.push("</ul>");
    sBuilder.push("</div>");
    return sBuilder.join("");
}
//验证学院信息
function validateInstituteInfo(f) {
    var validData = { isValid: true, msg: "" };
    if (f.txtName.trim() == "") {
        validData.isValid = false;
        validData.msg = "学院名称不能为空.";
    }
    //else if (f.txtAddress.trim() == "") {
    //    validData.isValid = false;
    //    validData.msg = "地址不能为空.";
    //} else if (f.txtCity.trim() == "") {
    //    validData.isValid = false;
    //    validData.msg = "城市不能为空.";
    //}
    return validData;
}

//从表单获取学院信息
function getInstituteInfo(f, h) {
    var institute = {};
    var instituteId = h.find("#cms_dialog_institute").data("_instituteId");
    if (instituteId) {
        institute = getInstituteInfoObj(instituteId);
    } 
    institute.name = f.txtName;
    institute.adress = f.txtAddress;
    institute.cityId = f.txtCity;
    institute.type = h.find("#cbxIsSysInstitute").is(":checked") ? 0 : 1;
    return institute;
}

//提交学院信息
function submitInstituteInfo(v, h, f) {
    if (v == true) {
        var valiData = validateInstituteInfo(f);
        if (valiData.isValid == false) {
            $.jBox.tip(valiData.msg, 'warning');
            return false;
        }

        var institute = getInstituteInfo(f, h);
        $excuteWS("~CourseWS.instituteManage", { ins: institute, userExtend: SimpleUser }, function (result) {
            if (result) {
                LoadInstituteList();
            } else {
                $jBox.tip("保存失败!", "error");
            }
        }, null, null);
    }
}

function getInstituteInfoObj(instituteId) {
    var institute = null;
    for (var i = 0; i < InstituteWrapperArray.length; i++) {
        if (InstituteWrapperArray[i].id == instituteId) {
            institute = InstituteWrapperArray[i];
            break;
        }
    }
    return institute;
}

function deleteInstituteInfo(instituteId) {
    $.jBox.confirm("你确定要删除这个学院吗?", "消息", function (v, h, f) {
        if (v == true) {
            $excuteWS("~CourseWS.instituteRemove", { instituteId: instituteId, userExtend: SimpleUser }, function (result) {
                if (result == true) {
                    LoadInstituteList();
                } else {
                    $.jBox.tip("删除失败！", 'error');
                }
            }, null, null);
        }
    }, { top: "25%", buttons: { "确定": true, "取消": false } });
}

//function query(key) {
//    if (key != null || key != "") {
//        $excuteWS("~InstituteWs.getInstituteByName", { name: key }, function (result) {
//            var $dataTable = $(".cms_datatable");
//            $dataTable.find("tr:gt(0)").remove();
//            if (!result || result.length == 0) {
//                $dataTable.append("<tr class='nodata lightblue'><td colspan='6'>没有学院信息</td></tr>");
//                return;
//            }
//            var sBuilder = [];
//            var rowClass = "";

//            $.each(result, function (i) {
//                if (i % 2 == 0) {
//                    rowClass = "class='lightblue'";
//                } else {
//                    rowClass = "";
//                }
//                var state;
//                for (var i = 0; i < StateWrapperArray.length; i++) {
//                    if (this.State_ID == StateWrapperArray[i].Id) {
//                        state = StateWrapperArray[i].Name;
//                    }
//                }
//                var Name = (this.Institute_Name) ? this.Institute_Name : "";
//                var Type = (this.Institute_Type) ? this.Institute_Type : "";
//                var Address = (this.Adress) ? this.Adress : "";
//                var City = (this.City) ? this.City : "";
//                var Description = (this.Description) ? this.Description : "";
//                sBuilder = [];
//                sBuilder.push("<tr id='" + this.id + "'" + rowClass + ">");
//                sBuilder.push("<td>" + Name + "</td>");
//                sBuilder.push("<td style='text-align:center'>" + Type + "</td>");
//                sBuilder.push("<td style='text-align:center'>" + Address + "</td>");
//                sBuilder.push("<td style='text-align:center'>" + City + "</td>");
//                sBuilder.push("<td style='text-align:center'>" + state + "</td>");
//                sBuilder.push("<td>" + Description + "</td>");
//                sBuilder.push("<td class='operate'><img src='Images/application_edit.png' title='编辑' onclick=\"editInstituteInfo('" + this.id + "')\" />&nbsp;<img src='Images/application_delete.png' title='删除' onclick=\"deleteInstituteInfo('" + this.id + "')\" /></td>");
//                sBuilder.push("</tr>");
//                $dataTable.append(sBuilder.join(''));
//            });
//            $dataTable.find("tr:gt(0)").hover(function () {
//                $(this).addClass("hover");
//            }, function () {
//                $(this).removeClass("hover");
//            });
//        }, null, null)
//    }
//}