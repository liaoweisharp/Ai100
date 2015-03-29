/// <reference path="../jquery-1.10.2.min.js" />
/// <reference path="../jquery.ajax.js" />
/// <reference path="../../Plugins/showLoading/js/jquery.showLoading.min.js" />
/// <reference path="../comm.js" />
/// <reference path="../SimpleUser.js" />

var SM_json = { urlParams: null, course: null, courseId: null, $txtSectionName: null, $txtSectionLimit: null, $divSectionList: null, $btnViewSection: null, $ddlSectionProps: null, $txtSectionPropsValue: null, sections: null };

$(function () {
    SM_json.urlParams = getUrlParms();
    SM_json.$txtSectionName = $("#txtSectionName");
    SM_json.$txtSectionLimit = $("#txtSectionLimit");
    SM_json.$divSectionList = $("#divSectionList");
    SM_json.$btnViewSection = $("#btnViewSection");
    SM_json.$ddlSectionProps = $("#ddlSectionProps");
    SM_json.$txtSectionPropsValue = $("#txtSectionPropsValue");
    U(function () {
        
        SM_json.courseId = SM_json.urlParams.courseId;
        if (!SM_json.courseId) {
            return;
        }
        $excuteWS("~CourseWS.Course_getBaseById", { id: SM_json.courseId, userId: get_userId(), user: get_simpleUser() }, function (r) {
            if (r) {
                SM_json.course = r;
                SM_listByCourseId();
            }
        }, null, null);
    });
    SM_json.$ddlSectionProps.change(function () {
        if (SM_json.$ddlSectionProps.val() != -1) {
            SM_json.$txtSectionPropsValue.removeAttr("disabled").val("");
            SM_json.$btnViewSection.removeAttr("disabled");
        } else {
            SM_listByCourseId();
            SM_json.$txtSectionPropsValue.attr("disabled", "disabled").val("");
            SM_json.$btnViewSection.attr("disabled","disabled");
        }
    });

    $("#btnCreateSection").click(function () {
       
        $.jBox(SM_getSectionInfo(), {
            id: "jbx_create_section",
            title: "创建班级", width: 500, buttons: { "创建": true }, submit: function () {

                var section = {};
                section.courseId = SM_json.courseId;
                section.sectionName = $("#txtSectionName").val();
                section.sectionLimit = $("#txtSectionLimit").val();
                if ($.trim(section.sectionName) == "") {
                    $.jBox.tip("班级名称不能为空！", "error");
                    return false;
                }
                if ($.trim(section.sectionLimit) == "") {
                    section.sectionLimit = 0;
                }

                if (isNaN(section.sectionLimit)) {
                    $.jBox.tip("容纳人数必须为数字！", "error");
                    return false;
                }
                section.openFlag = $(":radio[name='rdOpenFlagGroup']:checked").val();
                section.flag = $(":radio[name='rdFlagGroup']:checked").val();
                section.sectionRoleId = $(":radio[name='rdInsGroup']:checked").val();
                section.passwordFlag = $(":radio[name='rdPasswordFlagGroup']:checked").val();
                if (section.passwordFlag == 1) {
                    section.password = $("#txtPassword").val();
                } else {
                    section.password = null;
                }
                //else {
                //    var oldpw = $("#txtPassword").attr("oldpassword");
                //    section.password = $.trim(oldpw)!="" ? oldpw : null;
                //}
                
                $excuteWS("~SectionManageWS.Section_save", { section: section,userId:get_userId(), user: get_simpleUser() }, function (r) {
                    if (r) {
                        $.jBox.tip("班级创建成功！", "success");
                        SM_listByCourseId();
                        $.jBox.close("jbx_create_section");
                    } else {
                        $.jBox.tip("创建班级失败！", "error");
                    }
                    return false;
                }, null, null)
                return false;
            }
        });
        bindPWFlagEvt("jbx_create_section");
    });

    SM_json.$btnViewSection.click(function () {
        switch (SM_json.$ddlSectionProps.val()) {
            case "0":

                $excuteWS("~SectionManageWS.Section_listBySectionName", { sectionName: SM_json.$txtSectionPropsValue.val(),courseId:SM_json.courseId, user: get_simpleUser() }, function (r) {
                    SM_json.$divSectionList.html(SM_getSectionRowsHTML(r)).hideLoading();
                    SM_bindClickEventForSectionRow();
                }, null, null);
                break;
            case "1":
                $excuteWS("~SectionManageWS.Section_listBySectionNumber", { sectionNumber: SM_json.$txtSectionPropsValue.val(), courseId: SM_json.courseId, user: get_simpleUser() }, function (r) {
                    SM_json.$divSectionList.html(SM_getSectionRowsHTML(r)).hideLoading();
                    SM_bindClickEventForSectionRow();
                }, null, null);
                break;
            case "2":
                $excuteWS("~SectionManageWS.Section_listByCreator", { userName: SM_json.$txtSectionPropsValue.val(), courseId: SM_json.courseId, user: get_simpleUser() }, function (r) {
                    SM_json.$divSectionList.html(SM_getSectionRowsHTML(r)).hideLoading();
                    SM_bindClickEventForSectionRow();
                }, null, null);
                break;
            default:
                SM_listByCourseId();
                break;
        }
    });
})

function SM_getSectionInfo(section) {
    if (!section) {
        section = { sectionName: "", sectionLimit: "" ,openFlag:"1",flag:"1",sectionRoleId:"0",passwordFlag:"0",password:null};
    }
    
    var sArr = new Array();
    sArr.push('<div style="line-height:28px;width:375px;margin:10px auto;">');
    sArr.push('<div><span>班级名称：</span><input id="txtSectionName" value="' + section.sectionName + '" type="text" style="width:300px;"/> <span class="required">*</span></div>');
    sArr.push('<div><span>容纳人数：</span><input id="txtSectionLimit" value="'+section.sectionLimit+'" type="text" value="30" style="width:50px;text-align:center;"/> <span class="required">*</span></div>');
    sArr.push('<div><span>是否公开：</span><input type="radio" ' + (section.openFlag == "1" ? ' checked="checked" ' : "") + ' value="1" name="rdOpenFlagGroup" id="rdOpenFlagYes" style="border:none"/><label for="rdOpenFlagYes">是</label><input type="radio" value="0" ' + (section.openFlag == "0" ? ' checked="checked" ' : "") + '  name="rdOpenFlagGroup" id="rdOpenFlagNo" style="border:none;margin-left:10px;"/><label for="rdOpenFlagNo">否</label></div>');
    sArr.push('<div><span>是否禁用：</span><input type="radio" ' + (section.flag == "0" ? ' checked="checked" ' : "") + ' value="0" name="rdFlagGroup" id="rdFlagYes" style="border:none"/><label for="rdFlagYes">是</label><input type="radio" value="1" ' + (section.flag == "1" ? ' checked="checked" ' : "") + '  name="rdFlagGroup" id="rdFlagNo" style="border:none;margin-left:10px;"/><label for="rdFlagNo">否</label></div>');
    var str = SM_json.course.userId != get_userId() ? ' style="display:none;" ' : '';
    sArr.push('<div' + str + '><span>是否任教：</span><input type="radio" ' + (section.sectionRoleId ? ' checked="checked" ' : "") + ' value="0" name="rdInsGroup" id="rdInsYes" style="border:none"/><label for="rdInsYes">是</label><input type="radio" value="" ' + (!section.sectionRoleId ? ' checked="checked" ' : "") + '  name="rdInsGroup" id="rdInsNo" style="border:none;margin-left:10px;"/><label for="rdInsNo">否</label></div>');
    sArr.push('<div><span>是否加密：</span><input type="radio" ' + (section.passwordFlag == "1" ? ' checked="checked" ' : "") + ' value="1" name="rdPasswordFlagGroup" id="rdPasswordFlagYes" style="border:none"/><label for="rdPasswordFlagYes">是</label><input type="radio" value="0" ' + (section.passwordFlag == "0" ? ' checked="checked" ' : "") + '  name="rdPasswordFlagGroup" id="rdPasswordFlagNo" style="border:none;margin-left:10px;"/><label for="rdPasswordFlagNo">否</label>');
    if (!section.password) {
        section.password = "";
    }
    if (section.passwordFlag==1) {
        sArr.push('<input maxlength="12" type="text" id="txtPassword" style="width:120px;margin-left:10px;" oldpassword="'+section.password+'" value="' + section.password + '"/>');
    } else {
        sArr.push('<input maxlength="12" type="text" id="txtPassword" style="width:120px;margin-left:10px;display:none;" oldpassword="' + section.password + '" value="' + section.password + '"/>');
    }
    sArr.push('</div>');
    sArr.push('</div>');
    return sArr.join('');
}

function SM_listByCourseId() {
    if ($("divSectionList").find("img.data_loading").length == 0) {
        SM_json.$divSectionList.showLoading();
    }
    
    $excuteWS("~SectionManageWS.Section_listByCourseId", { courseId: SM_json.courseId, user: get_simpleUser() }, function (r) {
        SM_json.$divSectionList.html(SM_getSectionRowsHTML(r)).hideLoading();
        SM_bindClickEventForSectionRow();
    }, null, null);
}

function SM_getSectionRowsHTML(r) {
    var arr = new Array();
    if (r && r.length > 0) {
        SM_json.sections = r;
        arr.push('<table class="sectionlist" border="0" >');
        arr.push('<tr class="tr0"><th>编号</th><th>名称</th><th>班级号</th><th>容纳人数</th><th>创建者</th><th>是否公开</th><th>是否禁用</th><th>是否加密</th><th>花名册</th><th>管理</th></tr>');
        for (var i = 0; i < r.length; i++) {
            
            arr.push('<tr class="tr" sectionid="' + r[i].id + '">');
            arr.push('<td>' + (i + 1) + '</td><td>' + r[i].sectionName + '</td><td>' + r[i].sectionNumber + '</td><td>' + r[i].sectionLimit + '</td><td>' + r[i].fullName + '</td><td>' + (r[i].openFlag == "1" ? "是" : "否") + '</td><td>' + (r[i].flag == "1" ? "否" : "是") + '</td>');
            arr.push('<td>' + (r[i].passwordFlag == "1" ? "是" : "否") + '</td>');
            arr.push('<td><img src="../Images/user.png" title="班级花名册" style="cursor: pointer;" onclick="viewClassRoster(\'' + r[i].id + '\')" /></td>');
            if (r[i].userId == get_userId()) {
                arr.push('<td class="action"><img src="../Images/edit.png" title="编辑" action="edit" sectionid="' + r[i].id + '"/><img src="../Images/delete.png" title="删除" action="delete" sectionid="' + r[i].id + '"/></td>');
            }
            else {
                arr.push('<td class="action">&nbsp;</td>');
            }
            arr.push('</tr>');
           
        }
        arr.push('</table>');
    } else {
        arr.push('<div class="nodata">还没有任何班级信息，请先创建一个班级。</div>');
    }
    return arr.join('');
}

function bindPWFlagEvt(jbxId) {
    $("#" + jbxId).find(":radio[name='rdPasswordFlagGroup']").unbind("click").click(function () {
        var $this=$(this);
        if ($this.val() == "1") {
            $("#txtPassword").show();
        } else {
            $("#txtPassword").hide();
        }
    });
}

function SM_bindClickEventForSectionRow() {
    SM_json.$divSectionList.find("td.action img[action]").unbind().click(function () {
        var $this = $(this);
        var _sectionId = $this.attr("sectionid");
        if ($this.attr("action") == "edit") {
            var sections = SM_json.sections;
            var section = null;
            for (var i = 0; i < sections.length; i++) {
                if (sections[i].id == _sectionId) {
                    section = sections[i];
                    break;
                }
            }
            if (section != null) {
                
                $excuteWS("~SectionManageWS.Section_roleIdByUser", { userId: get_userId(), sectionId: _sectionId, user: get_simpleUser() }, function (r) {
                    
                    if (r!=null) {
                        section.sectionRoleId = r;
                    } 
                    var sectionHTML = SM_getSectionInfo(section);
                    $.jBox(sectionHTML, {
                        id: "jbx_edit_section",
                        title: "编辑班级", width: 500, buttons: { "更新": true }, submit: function () {
                            section.sectionName = $("#txtSectionName").val();
                            section.sectionLimit = $("#txtSectionLimit").val();
                            if ($.trim(section.sectionName) == "") {
                                $.jBox.tip("班级名称不能为空！", "error");
                                return false;
                            }
                            if ($.trim(section.sectionLimit) == "") {
                                section.sectionLimit = 0;
                            }

                            if (isNaN(section.sectionLimit)) {
                                $.jBox.tip("容纳人数必须为数字！", "error");
                                return false;
                            }
                            section.openFlag = $(":radio[name='rdOpenFlagGroup']:checked").val();
                            section.flag = $(":radio[name='rdFlagGroup']:checked").val();
                            section.sectionRoleId = $(":radio[name='rdInsGroup']:checked").val();
                            section.createDate = jDateFormat(section.createDate);
                            section.passwordFlag = $(":radio[name='rdPasswordFlagGroup']:checked").val();
                            if (section.passwordFlag == 1) {
                                section.password = $("#txtPassword").val();
                            } else {
                                var oldpw = $("#txtPassword").attr("oldpassword");
                                section.password = $.trim(oldpw) != "" ? oldpw : null;
                            }
                            $excuteWS("~SectionManageWS.Section_update", { section: section,userId:get_userId(), user: get_simpleUser() }, function (r) {
                                if (r) {
                                    $.jBox.tip("更新班级成功！", "success");
                                    SM_listByCourseId();
                                    $.jBox.close("jbx_edit_section");
                                } else {
                                    $.jBox.tip("更新班级失败！", "error");
                                }
                                return false;
                            }, null, null)
                            return false;
                        }
                    });
                    bindPWFlagEvt("jbx_edit_section");
                    
                }, null, null);
             
            }
        } else if ($this.attr("action") == "delete") {
            $.jBox.confirm("该班级将被永久删除，是否继续？", "提醒",function (v, h, f) {
                if (v == 'ok')
                {
                    $excuteWS("~SectionManageWS.Section_delete", { sectionId: _sectionId,userId:get_userId(), user: get_simpleUser() }, function (r) {
                        if (r) {
                            $.jBox.tip("班级删除成功！", "success");
                            SM_listByCourseId();
                        } else {
                            $.jBox.tip("班级删除失败！", "error");
                        }
                    }, null, null);
                }
                return true; 
            }
        );
            
        }
    });
}

function viewClassRoster(sectionId) {
    openNewWindow("ClassRoster.aspx?sectionId=" + sectionId);
}