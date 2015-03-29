/// <reference path="../../Plugins/showLoading/js/jquery.showLoading.min.js" />
/// <reference path="../SimpleUser.js" />
/// <reference path="../jquery-1.10.2.min.js" />
var cb_json = { $spSearchCourse: null, $spCourseTitle: null, $divDataLoading:null,$imgSearchCourse: null, $txtSearchCourse: null, $spMycourse: null, $course_type: null, $div_course_list: null, $myCourseList: undefined, $currentCourseList: undefined, $upCommingCourseList: undefined, $pastCourseList: undefined, $taughtCourseList: undefined, $trackCourseList: undefined };

$(function () {
    cb_json.$spSearchCourse = $("#spSearchCourse");
    cb_json.$txtSearchCourse = $("#txtSearchCourse");
    cb_json.$spMycourse = $("#spMycourse");
    cb_json.$course_type=$("div.course_type");
    cb_json.$div_course_list = $("#div_course_list");
    cb_json.$imgSearchCourse = $("#imgSearchCourse");
    cb_json.$spCourseTitle = $("#spCourseTitle");
    cb_json.$divDataLoading = $("#divDataLoading");
    
   
    U(function () {
        MC_listCourse(get_userId());
        $("#master_liManageCourse div").removeAttr("onclick").click(function () {
            MC_listCourse(get_userId());
        });
    });

    cb_json.$imgSearchCourse.click(function () {
        
        MC_listCourse(get_userId(), "-1");
        //$excuteWS("~CourseWS.Course_listByCourseNameForBank", { courseName: $.trim(cb_json.$txtSearchCourse.val()), user: get_simpleUser() }, function (r) {
        //    MC_getCourseList(r, "-1");
        //}, null, null);
    });

    cb_json.$spSearchCourse.click(function () {
        cb_json.$txtSearchCourse.focus();
    });

    cb_json.$txtSearchCourse.focus(function () {
        cb_json.$spSearchCourse.css({ "visibility": "hidden" });
    })

    cb_json.$txtSearchCourse.blur(function () {
        if ($.trim($(this).val()) == "") {
            cb_json.$spSearchCourse.css({"visibility":"visible"});
        }
    })

    cb_json.$spMycourse.click(function () {
        if (!cb_json.$course_type.is(":visible")) {
            cb_json.$course_type.slideDown(500);
            cb_json.$spMycourse.find("img").attr("src", "../Images/untriangle.png");
        } else {
            cb_json.$course_type.slideUp(500);
            cb_json.$spMycourse.find("img").attr("src", "../Images/triangle.png");
        }
    });

    $(document).click(function (evt) {
        
        if ($(evt.target).attr("flg")!="1") {
            cb_json.$course_type.slideUp(500);
            cb_json.$spMycourse.find("img").attr("src", "../Images/triangle.png");
        }
        
    });

    var $li = cb_json.$course_type.find("ul li");
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
        cb_json.$spCourseTitle.html($this.html());
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
            arr.push('<div class="course_item f_l">');
            arr.push('<div class="course_book">');
            arr.push('<img alt="" onerror="this.src=\'../Images/book-default.gif\'" src="../Images/book-default.gif" class="course_bookimg" />');
            arr.push('<div class="course_yytm course_name"><span>' + r[i].courseName + '</span></div>');
            arr.push('<div class="course_yytm course_details"><span>课程详情</span></div>');
            arr.push('</div>');
            //arr.push('<div class="btn studybtn">');
            //arr.push('<div>加入课程</div>');
            //arr.push('</div>');
            arr.push('<div class="btn managebtn f_l"><div onclick="location.href=\'../Instructor/CourseManage.aspx?courseId=' + r[i].id + '\'">课程</div></div>');
            arr.push('<div class="btn managebtn  f_r"><div onclick="location.href=\'../Instructor/SectionManage.aspx?courseId=' + r[i].id + '\'">班级</div></div>');
            arr.push('</div>');

        }
    }
    if (arr.length != 0) {
        arr.push('<div class="c_b"></div>');
    } else {
        arr.push('<div class="nodata">还没有任何课程信息。</div>');
    }
    if (cb_json.$divDataLoading.length != 0) {
        cb_json.$divDataLoading.remove();
    }
    var $co = null;
    if (index == "-1") {

        if (cb_json.$div_course_list.find("div[cindex='-1']").length == 0) {
            cb_json.$div_course_list.append('<div cindex="' + index + '">' + arr.join(''));
        } else {
            cb_json.$div_course_list.find("div[cindex='-1']").html('<div cindex="' + index + '">' + arr.join(''));
        }
    } else {
        cb_json.$div_course_list.append('<div cindex="' + index + '">' + arr.join(''));
    }
    cb_json.$div_course_list.find("div.course_book").hover(function () {
        $(this).find("div.course_details").show();
    }, function () {
        $(this).find("div.course_details").hide();
    });
    cb_json.$div_course_list.hideLoading();
    if (index == 0) {
       cb_json.$txtSearchCourse.autocomplete({
            source: availableTags
       });
        
    }

}

var tindex = null;
function MC_listCourse(userId, index) {
    
    if (index == null) {
        index = "0";
    }
    var clst = cb_json.$div_course_list.find("div[cindex]");
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
    if (cb_json.$div_course_list.find("#divDataLoading").length == 0) {
        cb_json.$div_course_list.showLoading();
    }
    
    switch (index) {
        case "0"://我的课程
            
            $excuteWS("~CourseWS.Course_listMyCreated", { userId: userId, user: get_simpleUser() }, function (r) {
                MC_getCourseList(r, index);
            }, null, null);
            break;
        //case "1"://正在学习的课程
        //    $excuteWS("~CourseWS.Course_listCurrentCourse", { userId: get_userId(), user: get_simpleUser() }, function (r) {
        //        MC_getCourseList(r,index);
        //    }, null, null);
        //    break;
        //case "2"://将要学习的课程
        //    $excuteWS("~CourseWS.Course_listUpCommingCourse", { userId: get_userId(), user: get_simpleUser() }, function (r) {
        //        MC_getCourseList(r, index);
        //    }, null, null);
        //    break;
        case "1"://学习过的课程
            //$excuteWS("~CourseWS.Course_listPastCourse", { userId: get_userId(), user: get_simpleUser() }, function (r) {
            //    MC_getCourseList(r, index);
            //}, null, null);
            break;
        //case "4"://我教的课程
        //    $excuteWS("~CourseWS.Course_listTaughtCourse", { userId: get_userId(), user: get_simpleUser() }, function (r) {
        //        MC_getCourseList(r, index);
        //    }, null, null);
        //    break;
        //case "5"://我跟踪的课程
        //    MC_getCourseList(null, index);
            //    break;
        case "-1":
            $excuteWS("~CourseWS.Course_listByCourseNameForBank", { userId: userId, courseName: $.trim(cb_json.$txtSearchCourse.val()), user: get_simpleUser() }, function (r) {
                MC_getCourseList(r, index);
            }, null, null);
            break;
    }
}

