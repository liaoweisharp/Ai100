/// <reference path="../jquery.ajax.js" />
/// <reference path="../jquery-1.10.2.min.js" />
/// <reference path="../comm.js" />
/// <reference path="../SimpleUser.js" />
/// <reference path="../../Plugins/showLoading/js/jquery.showLoading.min.js" />
/// <reference path="../../Plugins/lhgcalendar/lhgcalendar.min.js" />


var CM_json = { urlParams: null, course: null, $rdOpenFlagGroup: null, $rdOpenFlagYes: null, $rdOpenFlagNo: null, $ddlBookList: null, $ddlInstituteList: null, $txtCourseName: null, $txtStartDate: null, $txtEndDate: null, $txtAreaForTheCrowd: null, $txtAreaLearningObjective: null, $txtAreaIntroduction: null };
$(function () {
    CM_json.urlParams = getUrlParms();
    CM_json.$ddlBookList = $("#ddlBookList");
    CM_json.$ddlInstituteList = $("#ddlInstituteList");
    CM_json.$txtCourseName = $("#txtCourseName");
    CM_json.$txtStartDate = $("#txtStartDate");
    CM_json.$txtEndDate = $("#txtEndDate");
    CM_json.$txtAreaForTheCrowd = $("#txtAreaForTheCrowd");
    CM_json.$txtAreaIntroduction = $("#txtAreaIntroduction");
    CM_json.$txtAreaLearningObjective = $("#txtAreaLearningObjective");
    CM_json.$rdOpenFlagGroup = $(":radio[name='rdOpenFlagGroup']");
    CM_json.$rdOpenFlagYes = $("#rdOpenFlagYes");
    CM_json.$rdOpenFlagNo = $("#rdOpenFlagNo");
    if (CM_json.urlParams.courseId) {
        CM_json.$ddlInstituteList.showLoading();
        CM_json.$ddlBookList.showLoading();
    } else {
        CM_json.$ddlInstituteList.showLoading();
    }
    U(function () {
        if (CM_json.urlParams.courseId) {
            $excuteWS("~CourseWS.Course_getById", { id: CM_json.urlParams.courseId,userId:get_userId(), user: get_simpleUser() }, function (r) {
                if (r) {
                    
                    if (get_userId() != r.userId) {
                        //location.href = "#";
                        return;
                    }
                    CM_json.course = r;
                    CM_json.$ddlInstituteList.attr("disabled", "disabled").empty().append('<option value="' + r.instituteId + '">' + r.instituteName + '</option>');
                    CM_json.$ddlBookList.attr("disabled", "disabled").empty().append('<option value="' + r.bookId + '">' + r.bookName + '</option>');
                    CM_json.$txtCourseName.val(r.courseName);
                    CM_json.$txtStartDate.val(jDateFormat(r.startDate));
                    CM_json.$txtEndDate.val(jDateFormat(r.endDate));
                    CM_json.$txtAreaForTheCrowd.val(r.forTheCrowd);
                    CM_json.$txtAreaIntroduction.val(r.introduction);
                    CM_json.$txtAreaLearningObjective.val(r.learningObjective);
                    if (r.openFlag==1) {
                        CM_json.$rdOpenFlagYes.attr("checked","checked");
                    } else {
                        CM_json.$rdOpenFlagNo.attr("checked", "checked");
                    }
                }
                CM_json.$ddlInstituteList.hideLoading();
                CM_json.$ddlBookList.hideLoading();
            }, null, null);
        } else {

            
            $excuteWS("~CourseWS.Institute_listMyInstructor", {userId:get_userId(), user: get_simpleUser() }, function (r) {
                if (r) {
                    var options = new Array();
                    options.push('<option value="-1">== 请选择学院 ==</option>');
                    for (var i = 0; i < r.length; i++) {
                        options.push('<option value="' + r[i].id + '">' + r[i].name + '</option>');
                    }
                    CM_json.$ddlInstituteList.empty().append(options.join(''));
                }
                CM_json.$ddlInstituteList.hideLoading();
            }, null, null);
        }
    });

    //$("#txtStartDate").calendar({ format: 'yyyy年MM月dd日 HH时mm分ss秒', real: "#hidStartDate", minDate:'%y-%M-%d' });
    //$("#txtEndDate").calendar({ format: 'yyyy年MM月dd日 HH时mm分ss秒', real: "#hidEndDate", minDate: '%y-%M-%d' });

    $("#txtStartDate").calendar({ format: 'yyyy-MM-dd HH:mm:ss',  minDate: '%y-%M-%d' });
    $("#txtEndDate").calendar({ format: 'yyyy-MM-dd HH:mm:ss',  minDate: '%y-%M-%d' });
    //$.calendar({ id: '#txtEndDate', format: 'yyyy年MM月dd日 HH时mm分ss秒' });
    var $sp = $("div.coursemanage div.daoxiang ul li span");
    $sp.each(function (index) {
        var $this = $(this);
        $this.click(function () {
            $sp.parent().removeClass().addClass("unsel");
            $this.parent().removeClass().addClass("sel");
            $("div.coursemanage div[index]").hide().filter(":eq("+index+")").show();
        });
       
    })

    CM_json.$ddlInstituteList.change(function () {
        if ($(this).val() != "-1") {
            CM_json.$ddlBookList.showLoading();
            $excuteWS("~CourseWS.BookWrapper_listByInstituteUser", { instituteId: $(this).val(),userId:get_userId(), user: get_simpleUser() }, function (r) {
                if (r) {
                    var options = new Array();
                    options.push('<option value="-1">== 请选择书 ==</option>');
                    for (var i = 0; i < r.length; i++) {
                        options.push('<option value="' + r[i].id + '">' + r[i].title + '</option>');
                    }
                    CM_json.$ddlBookList.empty().append(options.join(''));
                }
                CM_json.$ddlBookList.hideLoading();
            }, null, null);
        } else {
            CM_json.$ddlBookList.val("-1");
        }
    });

    $("#btnSaveCourse").click(function () {
        var $this = $(this);
        if (CM_json.$ddlInstituteList.val() == "-1") {
            $.jBox.tip("请选择学院！", "error")
            return;
        }
        if (CM_json.$ddlBookList.val() == "-1") {
            $.jBox.tip("请选择书！","error")
            return;
        }

        if ($.trim(CM_json.$txtCourseName.val()) == "") {
            $.jBox.tip("课程名称必填！", "error")
            return;
        }

        if ($.trim(CM_json.$txtCourseName.val()) == "") {
            $.jBox.tip("课程名必填！", "error")
            return;
        }

        if ($.trim(CM_json.$txtCourseName.val()) == "") {
            $.jBox.tip("课程名必填！", "error")
            return;
        }

        if ($.trim(CM_json.$txtStartDate.val()) == "") {
            $.jBox.tip("请选择课程开始日期！", "error")
            return;
        }

        if ($.trim(CM_json.$txtEndDate.val()) == "") {
            $.jBox.tip("请选择课程结束日期！", "error")
            return;
        }
        $this.attr("disabled", "disabled");

        var course = {};
        if (CM_json.urlParams.courseId) {
            course = CM_json.course;
        }
        course.bookId = CM_json.$ddlBookList.val();
        course.courseName = CM_json.$txtCourseName.val();
        course.startDate = CM_json.$txtStartDate.val();
        course.endDate = CM_json.$txtEndDate.val();
        course.introduction = CM_json.$txtAreaIntroduction.val();
        course.flag = "0";
        course.instituteId = CM_json.$ddlInstituteList.val();
        course.courseSettingsId = null;
        course.learningObjective = CM_json.$txtAreaLearningObjective.val();
        course.forTheCrowd = CM_json.$txtAreaForTheCrowd.val();
        course.openFlag = CM_json.$rdOpenFlagYes.is(":checked")? "1" : "0";
 
        if (CM_json.urlParams.courseId) {
            course.createDate = jDateFormat(course.createDate);
            $.jBox.tip("正在保存课程数据，请稍后…", "loading");
            $excuteWS("~CourseWS.Course_update", { course: course, user: get_simpleUser() }, function (r) {
                if (r) {
                    
                    $.jBox.tip("课程更新成功", "success");
                    setTimeout(function () {
                        location.href = "../Course/ManageCourse.aspx";
                    }, 1500);
                    
                } else {
                    $.jBox.tip("课程更新失败", "error");
                    $this.removeAttr("disabled");
                    $.jBox.closeTip();
                }
            }, null, null);
        } else {
            $.jBox.tip("正在更新课程数据，请稍后…", "loading");
            $excuteWS("~CourseWS.Course_save", { course: course, user: get_simpleUser() }, function (r) {
                if (r) {
                    $.jBox.tip("课程创建成功", "success");
                    setTimeout(function () {
                        location.href = "../Course/ManageCourse.aspx";
                    }, 1500);
                } else {
                    $.jBox.tip("课程创建失败", "error");
                    $this.removeAttr("disabled");
                    $.jBox.closeTip();
                }
            }, null, null);
        }
    });
});