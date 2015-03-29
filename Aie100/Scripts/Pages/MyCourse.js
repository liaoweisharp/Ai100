/// <reference path="../jquery.ajax.js" />
/// <reference path="../../Plugins/showLoading/js/jquery.showLoading.min.js" />
/// <reference path="../SimpleUser.js" />
/// <reference path="../jquery-1.10.2.min.js" />
/// <reference path="../../Plugins/jBox/jquery.jBox-2.3.min.js" />

var mc_json = { $spJoinClass: null, $imgJoinClass: null, $txtSectionNumber: null, $spSearchCourse: null, $spCourseTitle: null, $divDataLoading: null, $imgSearchCourse: null, $txtSearchCourse: null, $spMycourse: null, $course_type: null, $div_course_list: null, $myCourseList: undefined, $currentCourseList: undefined, $upCommingCourseList: undefined, $pastCourseList: undefined, $taughtCourseList: undefined, $trackCourseList: undefined };

$(function () {
    mc_json.$spSearchCourse = $("#spSearchCourse");
    mc_json.$txtSearchCourse = $("#txtSearchCourse");
    mc_json.$imgSearchCourse = $("#imgSearchCourse");

    mc_json.$spJoinClass = $("#spJoinClass");
    mc_json.$txtSectionNumber = $("#txtSectionNumber");
    mc_json.$imgJoinClass = $("#imgJoinClass");

    mc_json.$spMycourse = $("#spMycourse");
    mc_json.$course_type=$("div.course_type");
    mc_json.$div_course_list = $("#div_course_list");
    mc_json.$spCourseTitle = $("#spCourseTitle");
    mc_json.$divDataLoading = $("#divDataLoading");
   
    U(function () {
        MC_listCourse(get_userId());
        $("#master_liMycourse div").removeAttr("onclick").click(function () {
            mc_json.$course_type.find("ul li:eq(0)").trigger("click");
            //mc_json.$spCourseTitle.html("我的课程");
            //MC_listCourse(get_userId());
        });
    });

    mc_json.$imgSearchCourse.click(function () {
        MC_listCourse(get_userId(), "-1");
        //$excuteWS("~CourseWS.Course_listByCourseName", {userId:get_userId() , courseName: $.trim(mc_json.$txtSearchCourse.val()), user: get_simpleUser() }, function (r) {
        //    MC_getCourseList(r, "-1");
        //}, null, null);
    });

    mc_json.$imgJoinClass.click(function () {
        var sectionNumber = mc_json.$txtSectionNumber.val();
        if ($.trim(sectionNumber) == "") {
            $.jBox.tip("请输入班级号", "error");
            return;
        }

        if (isNaN(sectionNumber)) {
            $.jBox.tip("班级号必须为数字", "error");
            return;
        }
  
        $excuteWS("~SectionManageWS.sectionPasswordFlag", { sectionNumber: sectionNumber, userExtend: get_simpleUser() }, function (boo) {
            if (boo) {
                $.jBox('<div style="padding:8px;"><center>密码：<input maxlength="12" id="txtJoinPassword" type="password" style="width:160px;"/></center></div>', {
                    title: "该班级已设置密码，请先输入密码", width: 250, submit: function (v) {
                        if (v == "ok") {
                            var pw = $("#txtJoinPassword").val();
                            if ($.trim(pw) == "") {
                                $.jBox.tip("密码不能为空", "error");
                                return false;
                            }
                            $excuteWS("~SectionManageWS.sectionJoinByNumberPassword", { sectionNumber: sectionNumber, password: pw, userId: get_userId(), roleId: "1", userExtend: get_simpleUser() }, function (r) {
                                if (r != null) {//0：班级不存在，1:成功  2:已经加入过这个班了。
                                    if (r == 0) {
                                        $.jBox.tip("不存在该班级，请检查班级号是否正确", "error");
                                    } else if (r == 1) {
                                        $.jBox.tip("你已成功加入该班级", "success");
                                        location.reload();
                                    } else if (r == 2) {
                                        $.jBox.tip("你已经加入过该课程，不需要再加入了", "error");
                                    } else if (r == 3) {
                                        $.jBox.tip("密码错误，请重新输入", "error");
                                    } else {
                                        $.jBox.tip("加入班级失败", "error");
                                    }
                                }
                            }, null, null);
                            return false;
                        }
                    }
                });
            } else {
                $excuteWS("~SectionManageWS.sectionJoinByNumber", { sectionNumber: sectionNumber, userId: get_userId(), roleId: "1", user: get_simpleUser() }, function (r) {
                    if (r != null) {//0：班级不存在，1:成功  2:已经加入过这个班了。
                        if (r == 0) {
                            $.jBox.tip("不存在该班级，请检查班级号是否正确", "error");
                        } else if (r == 1) {
                            $.jBox.tip("你已成功加入该班级", "success");
                            location.reload();
                        } else if (r == 2) {
                            $.jBox.tip("你已经加入过该课程，不需要再加入了", "error");
                        } else {
                            $.jBox.tip("加入班级失败", "error");
                        }
                    }
                }, null, null);
            }
        }, null, null);
        
    });

    mc_json.$spJoinClass.click(function () {
        mc_json.$txtSectionNumber.focus();
    });

    mc_json.$txtSectionNumber.focus(function () {
        mc_json.$spJoinClass.css({ "visibility": "hidden" });
    })

    mc_json.$txtSectionNumber.blur(function () {
        if ($.trim($(this).val()) == "") {
            mc_json.$spJoinClass.css({ "visibility": "visible" });
        }
    })
    ///
    mc_json.$spSearchCourse.click(function () {
        mc_json.$txtSearchCourse.focus();
    });

    mc_json.$txtSearchCourse.focus(function () {
        mc_json.$spSearchCourse.css({ "visibility": "hidden" });
    })

    mc_json.$txtSearchCourse.blur(function () {
        if ($.trim($(this).val()) == "") {
            mc_json.$spSearchCourse.css({"visibility":"visible"});
        }
    })

    mc_json.$spMycourse.click(function () {
        if (!mc_json.$course_type.is(":visible")) {
            mc_json.$course_type.slideDown(500);
            mc_json.$spMycourse.find("img").attr("src", "../Images/untriangle.png");
        } else {
            mc_json.$course_type.slideUp(500);
            mc_json.$spMycourse.find("img").attr("src", "../Images/triangle.png");
        }
    });

    $(document).click(function (evt) {
        
        if ($(evt.target).attr("flg")!="1") {
            mc_json.$course_type.slideUp(500);
            mc_json.$spMycourse.find("img").attr("src", "../Images/triangle.png");
        }
        
    });

    var $li = mc_json.$course_type.find("ul li");
    $li.hover(function () {
        var $this = $(this);
        $li.removeClass();
        $this.addClass("lihover");

    }, function () {
        $li.removeClass();
    });

    $li.click(function () {
       
        var $this = $(this);
        $li.removeAttr("style");
        $this.css({ "background-color": "#1B88C9;" });
        $("div.course_type div.course_type_details").hide().filter(":eq(" + $this.attr("index") + ")").show();
        mc_json.$spCourseTitle.html($this.html());
        MC_listCourse(get_userId(), $this.attr("index"));
    });
   
})

function MC_getCourseList(r,index) {
    var availableTags = new Array();
    var arr = new Array();
    if (r) {
       
        for (var i = 0; i < r.length; i++) {
            if (index == 0) {
                availableTags.push(r[i].courseName);
            }

            if (index != 1) {
                if ((i + 1) % 3 == 0) {
                    arr.push('<div selcourseid="'+r[i].id+'" class="f_l" style="width:295px;margin:0px 0px 5px auto;border:1px solid #D4D4D4;position:relative;">');//--1
                } else {
                    arr.push('<div selcourseid="' + r[i].id + '" class="f_l" style="width:295px;margin:0px 60px 5px auto;border:1px solid #D4D4D4;position:relative;">');//--1
                }


                arr.push('<div class="course_item f_l" style="border:0px;height:auto">');
                arr.push('<div class="course_book">');
                arr.push('<img alt="" onerror="this.src=\'../Images/book-default.gif\'" src="../Images/book-default.gif" class="course_bookimg" />');
                arr.push('<div class="course_yytm course_name"><span>' + r[i].courseName + '</span></div>');
                arr.push('<div enter_courseid="' + r[i].id + '" class="course_yytm course_details"><span>进入课程</span></div>');
                arr.push('</div>');
                arr.push('</div>');

                arr.push('<div class="f_l" asmt_courseid="' + r[i].id + '" style="padding-top:5px">');
                if (r[i].courseRoleId == "0") {
                    arr.push('<div current="true" style="background-color:#88F6F5;text-align:center;width:120px;padding:2px 0px;margin-top:5px;"><img src="../Images/ajax-loader_m.gif" alt=""/></div>');
                    arr.push('<div myMarking="true" style="background-color:#88F6F5;text-align:center;width:120px;padding:2px 0px;margin-top:5px;"><img src="../Images/ajax-loader_m.gif" alt=""/></div>');
                    arr.push('<div otherMarking="true" style="background-color:#88F6F5;text-align:center;width:120px;padding:2px 0px;margin-top:5px;"><img src="../Images/ajax-loader_m.gif" alt=""/></div>');
                } else {
                    arr.push('<div myMarking="true" style="background-color:#88F6F5;text-align:center;width:120px;padding:2px 0px;margin-top:5px;"><img src="../Images/ajax-loader_m.gif" alt=""/></div>');
                    arr.push('<div otherMarking="true" style="background-color:#88F6F5;text-align:center;width:120px;padding:2px 0px;margin-top:5px;"><img src="../Images/ajax-loader_m.gif" alt=""/></div>');
                    arr.push('<div waitforMarking="true" style="background-color:#88F6F5;text-align:center;width:120px;padding:2px 0px;margin-top:5px;"><img src="../Images/ajax-loader_m.gif" alt=""/></div>');
                    arr.push('<div unfinished="true" style="background-color:#88F6F5;text-align:center;width:120px;padding:2px 0px;margin-top:5px;"><img src="../Images/ajax-loader_m.gif" alt=""/></div>');
                    arr.push('<div enhance="true" style="background-color:#88F6F5;text-align:center;width:120px;padding:2px 0px;margin-top:5px;"><img src="../Images/ajax-loader_m.gif" alt=""/></div>');
                }
                if (r[i].courseRoleId == "1") {
                    arr.push('<div><img exit_courseid="' + r[i].id + '" src="../Images/quit.png" style="cursor:pointer;bottom:42px;position:absolute;margin-left:45px;width:20px;" title="退出该课程"></div>');
                }
                arr.push('<div class="btn" ><div enter_courseid="' + r[i].id + '" style="bottom:10px;position:absolute;width:110px">进入课程</div></div>');
                arr.push('</div>');
                arr.push('</div>');//--1
            } else {
                arr.push('<div class="course_item f_l">');
                arr.push('<div class="course_book">');
                arr.push('<img alt="" onerror="this.src=\'../Images/book-default.gif\'" src="../Images/book-default.gif" class="course_bookimg" />');
                arr.push('<div class="course_yytm course_name"><span>' + r[i].courseName + '</span></div>');
                arr.push('<div enter_courseid="' + r[i].id + '" class="course_yytm course_details"><span>进入课程</span></div>');
                arr.push('</div>');
                arr.push('<div class="btn studybtn">');
                arr.push('<div enter_courseid="' + r[i].id + '">进入课程</div>');
                arr.push('</div>');
                arr.push('</div>');
            }
            
        }
    }

    if (arr.length != 0) {
        arr.push('<div class="c_b"></div>');
    } else {
        arr.push('<div class="nodata">还没有任何课程信息。</div>');
    }
    if (mc_json.$divDataLoading.length != 0) {
        mc_json.$divDataLoading.remove();
    }
    var $co = null;
    if (index == "-1") {
        
        if (mc_json.$div_course_list.find("div[cindex='-1']").length == 0) {
            mc_json.$div_course_list.append('<div cindex="' + index + '">' + arr.join(''));
        } else {
            mc_json.$div_course_list.find("div[cindex='-1']").html('<div cindex="' + index + '">' + arr.join(''));
        }
        

    } else {
        mc_json.$div_course_list.append('<div cindex="' + index + '">' + arr.join(''));
    }
    //(string courseId, string userId, JEWS.EngineClient.UserExtend userExtend)
    if (r && r.length > 0) {
        for (var c = 0; c < r.length; c++) {
            if (r[c].courseRoleId == "0") {
                $excuteWS("~AssignmentWS.assignmentRInstructorByCourse", { courseId: r[c].id, userId: get_userId(), userExtend: get_simpleUser() }, function (re,context) {
                    var $asmtCourse=mc_json.$div_course_list.find("div[asmt_courseid='" + context.courseId + "']");
                    $asmtCourse.find("div[current='true']").html("当前(" + re.current.length + ")");
                    $asmtCourse.find("div[myMarking='true']").html("我要阅卷(" + re.myMarking.length + ")");
                    $asmtCourse.find("div[otherMarking='true']").html("他人阅卷(" + re.otherMarking.length + ")");
                }, null, { courseId: r[c].id });
            } else if (r[c].courseRoleId == "1") {
                //assignmentRStudent(string structureId, string courseId, string sectionId, string userId, JEWS.EngineClient.UserExtend userExtend)
                $excuteWS("~AssignmentWS.assignmentRStudent", {structureId:null, courseId: r[c].id, sectionId:null, userId: get_userId(), userExtend: get_simpleUser() }, function (re, context) {
                    var $asmtCourse = mc_json.$div_course_list.find("div[asmt_courseid='" + context.courseId + "']");
                    $asmtCourse.find("div[myMarking='true']").html("自己阅卷(" + re.myMarking.length + ")");
                    $asmtCourse.find("div[otherMarking='true']").html("给他人阅卷(" + re.otherMarking.length + ")");
                    $asmtCourse.find("div[waitforMarking='true']").html("待阅卷(" + re.waitforMarking.length + ")");
                    $asmtCourse.find("div[unfinished='true']").html("未完成(" + re.unfinished.length + ")");
                    $asmtCourse.find("div[enhance='true']").html("需加强(" + re.enhance.length + ")");
                }, null, { courseId: r[c].id });
            }
          
        }
        
    }
    
    mc_json.$div_course_list.find("div.course_book").hover(function () {
        $(this).find("div.course_details").show();
    }, function () {
        $(this).find("div.course_details").hide();
    });

    mc_json.$div_course_list.find("img[exit_courseid]").click(function () {
        var _courseId = $(this).attr("exit_courseid");
        $.jBox.confirm("你确定要退出该课程吗?", "提示", function (v, h, f) {
            if (v == true) {
               
                $excuteWS("~CourseWS.courseExistByUserId", { userId: get_userId(), courseId: _courseId, userExtend: get_simpleUser() }, function (r) {
                    if (r) {
                        $.jBox.tip("你已成功退出该课程", "success");
                        $("div[selcourseid='" + _courseId + "']").remove();
                    } else {
                        $.jBox.tip("退出课程失败", "error");
                    }
                }, null, null);
            }
        }, { top: "25%", buttons: { "确定": true, "取消": false } });

        
    });

    mc_json.$div_course_list.find("div[enter_courseid]").click(function () {
        var _courseId = $(this).attr("enter_courseid");
        $excuteWS("~SectionManageWS.sectionByMyInCourse", { userId: get_userId(), courseId: _courseId, user: get_simpleUser() }, function (re) {
            //section里面的 //status; //1：表示是激活状态;0：表示被禁用 ;2:表示到期该续费了
            if(re && re.length>0){
                if (re.length == 1) {
                    
                    if (get_roleId() == "0") {
                        if (re[0].sectionRoleId == "0") {
                            location.href = '../Instructor/TeachingCenter.aspx?sectionId=' + re[0].id;
                        } else if (re[0].sectionRoleId == "1") {
                            location.href = '../Student/LearningCenter.aspx?sectionId=' + re[0].id;
                        }
                    } else {
                        if (re[0].status == "1") {
                            location.href = '../Student/LearningCenter.aspx?sectionId=' + re[0].id;
                        } else if (re[0].status == "0") {
                            $.jBox.tip("该课程已被禁用", "error");
                        } else if (re[0].status == "2") {
                            $.jBox.tip("你的付费有效期已过，请续费", "error");
                        }
                    }
                   
                } else {
                    if (get_roleId() == "0") {
                        var arr = new Array();
                        arr.push('<div style="padding:5px;line-height:25px;">');
                        for (var s = 0; s < re.length; s++) {
                            if (re[s].sectionRoleId == "0") {
                                arr.push('<div><img src="../Images/application_go.png" alt="" align="middle"/> <a href="../Instructor/TeachingCenter.aspx?sectionId=' + re[s].id + '">' + re[s].sectionName + '</a></div>');
                            } else if (re[s].sectionRoleId == "1") {
                                arr.push('<div><img src="../Images/application_go.png" alt="" align="middle"/> <a href="../Student/LearningCenter.aspx?sectionId=' + re[s].id + '">' + re[s].sectionName + '</a></div>');
                            }
                        }
                        arr.push('</div>');
                        $.jBox(arr.join(''), {
                            title: "请选择你想进入的班级", buttons: {},width:450
                        });
                    } else {
                        $.jBox.tip("对不起，你暂时不能进入该课程", "error");
                    }
                    //else {
                    //    if (re[0].status == "1") {
                    //        location.href = '../Student/LearningCenter.aspx?sectionId=' + re[0].id;
                    //    } else if (re[0].status == "0") {
                    //        $.jBox.tip("该课程已被禁用", "error");
                    //    } else if (re[0].status == "2") {
                    //        $.jBox.tip("你的付费有效期已过，请续费", "error");
                    //    }
                    //}
                }
            }
        }, null, null);
    });
    mc_json.$div_course_list.hideLoading();
    if (index == 0) {
       mc_json.$txtSearchCourse.autocomplete({
            source: availableTags
       });
        
    }

}

var tindex = null;
function MC_listCourse(userId, index) {
    
    if (index == null) {
        index = "0";
    }
    var clst = mc_json.$div_course_list.find("div[cindex]");
    clst.hide()
    if (index != "-1") {
        if (clst.filter("[cindex='" + index + "']").length != 0) {
            clst.filter("[cindex='" + index + "']").show();
            return;
        }
        if (tindex == index) {
            return;
        }
    } else {
        clst.filter("[cindex='" + index + "']").show();
    }
   
    tindex = index;
    if (mc_json.$div_course_list.find("#divDataLoading").length == 0) {
        mc_json.$div_course_list.showLoading();
    }
    
    switch (index) {
        case "0"://我的课程
            
            $excuteWS("~CourseWS.Course_listMyCourse", { userId: userId, user: get_simpleUser() }, function (r) {
                MC_getCourseList(r, index);
            }, null, null);
            break;
        //case "1"://正在学习的课程
            //    $excuteWS("~CourseWS.Course_listCurrentCourse", { userId: userId, user: get_simpleUser() }, function (r) {
        //        MC_getCourseList(r,index);
        //    }, null, null);
        //    break;
        //case "2"://将要学习的课程
            //    $excuteWS("~CourseWS.Course_listUpCommingCourse", { userId: userId, user: get_simpleUser() }, function (r) {
        //        MC_getCourseList(r, index);
        //    }, null, null);
        //    break;
        case "1"://学习过的课程
            $excuteWS("~CourseWS.Course_listPastCourse", { userId: userId, user: get_simpleUser() }, function (r) {
                MC_getCourseList(r, index);
            }, null, null);
            break;
        //case "4"://我教的课程
            //    $excuteWS("~CourseWS.Course_listTaughtCourse", { userId: userId, user: get_simpleUser() }, function (r) {
        //        MC_getCourseList(r, index);
        //    }, null, null);
        //    break;
        //case "5"://我跟踪的课程
        //    MC_getCourseList(null, index);
            //    break;
        case "-1":
            $excuteWS("~CourseWS.Course_listByCourseName", { userId: userId, courseName: $.trim(mc_json.$txtSearchCourse.val()), user: get_simpleUser() }, function (r) {
                MC_getCourseList(r, index);
            }, null, null);
            break;
    }
}

