/// <reference path="../jquery.ajax.js" />
/// <reference path="../jquery-1.10.2.min.js" />
/// <reference path="../comm.js" />
/// <reference path="../SimpleUser.js" />
/// <reference path="TestManage.js" />
/// <reference path="../Array.js" />
/// <reference path="../../Plugins/showLoading/js/jquery.showLoading.min.js" />

var MS_json = { urlParams: null, simpleUser: null, $tbExaminers: null, $tbStudents: null,$btnAddExaminer: null, $btnAddStudent: null, $tbStudentExaminers: null};
MS_json.students = null;                    //班级中的所有学生
MS_json.studentExaminers = null;            //学生阅卷人对应关系

MS_json.examinerIds = null;                 //阅卷人Id集合
MS_json.studentIds = null;                  //当前选择的阅卷人对应的学生Id集合       //(可能不要这个变量)

U(function () {
    MS_json.urlParams = getUrlParms();
    MS_json.simpleUser = this.simpleUser;
    MS_json.$tbExaminers = $("#tbExaminers");
    MS_json.$tbStudents = $("#tbStudents");
    MS_json.$btnAddExaminer = $("#btnAddExaminer");
    MS_json.$btnAddStudent = $("#btnAddStudent");
    MS_json.$tbStudentExaminers = $("#tbStudentExaminers");
    $("#btnSaveExaminerAllocation").bind("click", onSaveEA);
    
    $excuteWS("~UsersWS.getStudExaminerInfo", { sectionId: MS_json.urlParams.sectionId, userExtend: MS_json.simpleUser }, function (result) {
        MS_json.$btnAddExaminer.removeAttr("disabled").bind("click", onAddExaminer);
        MS_json.$btnAddStudent.removeAttr("disabled").bind("click", onAddStudent);

        MS_json.students = result[0] ? result[0] : [];
        MS_json.studentExaminers = result[1] ? result[1] : [];
        if (MS_json.students.length > 0) {
            showStudentExaminerList();
            showExaminerList();
        }
    }, null, null);
});

//显示学生阅卷人的对应表
function showStudentExaminerList() {
    var $tbStudentExaminers = $("#tbStudentExaminers");
    var examinerId, examinerName, examiner;
    var sb = [];
    
    $.each(MS_json.students, function () {
        //查找阅卷人
        examinerId = getExaminerIdByStudendId(this.id);
        examiner = examinerId ? getUserById(examinerId) : null;
        examinerName = examiner ? examiner.fullName : "";
        sb.push("<tr id='se_" + this.id + "'><td>" + this.fullName + "</td><td>" + examinerName + "</td></tr>");
    });

    $tbStudentExaminers.find("tr:gt(0)").remove();
    $tbStudentExaminers.append(sb.join(""));
}

//显示已有阅卷人列表
function showExaminerList() {
    var $tbExaminers = $("#tbExaminers");

    //返回阅卷人对象集合
    MS_json.examinerIds = getAssignExaminerIds();
    var examiners = getUsersByIds(MS_json.examinerIds);
    var sb = [];
    var rowClass = "";

    $.each(examiners, function (i) {
        if (i % 2 == 0) {
            rowClass = "class='lightblue'";
        } else {
            rowClass = "";
        }
        
        sb.push("<tr id='e_" + this.id + "' userId='" + this.id + "' onClick='showExaminerAllocation(\"" + this.id + "\")' " + rowClass + "><td>" + this.fullName + "</td></tr>");
    });

    $tbExaminers.append(sb.join("")).find("tr:gt(0)").click(function () {
        if ($(this).hasClass("selected")) return;
        $(this).siblings().removeClass("selected");
        $(this).addClass("selected");
    })
    .hover(function () {
        $(this).addClass("hover");
    }, function () {
        $(this).removeClass("hover");
    });
}

//----------查询------------//
//返回用户对象
function getUserById(id) {
    var i = MS_json.students.indexOf("id", id);
    return (i != -1) ? MS_json.students[i] : null;
}

//返回用户对象集合
function getUsersByIds(ids) {
    var users = [];
    $.each(ids, function () {
        users.push(getUserById(this));
    });
    return users;
}

//得到有关联的阅卷人的学生Id集合
function getAssignStudentIds() {
    var studentIds = [];
    if (MS_json.studentExaminers.length > 0) {
        var t_studentIds = [];
        $.each(MS_json.studentExaminers, function () {
            t_studentIds.push(this.testerUserId);
        });
        studentIds = t_studentIds.uniquelize();
    }
    return studentIds;
}

//得到有关联的阅卷人Id集合
function getAssignExaminerIds() {
    var examinerIds = [];
    if (MS_json.studentExaminers.length > 0) {
        var t_examinerIds = [];
        $.each(MS_json.studentExaminers, function () {
            t_examinerIds.push(this.examinerUserId);
        });
        examinerIds = t_examinerIds.uniquelize();
    }
    return examinerIds;
}

//查找学生阅卷人关系
function getStudentExaminer(studentId, examinerId) {
    var index = -1;
    $.each(MS_json.studentExaminers, function (i) {
        if (this.examinerUserId == examinerId && this.testerUserId == studentId) {
            index = i;
            return false;
        }
    });
    return index;
}

//添加学生与阅卷人的关系
function addStudentExaminer(studentId, examinerId) {
    var i = getStudentExaminer(studentId, examinerId);
    if (i != -1) {
        return;
    }

    var studExam = {};
    studExam.examinerUserId = examinerId;
    studExam.testerUserId = studentId;
    studExam.sectionId = MS_json.urlParams.sectionId;
    MS_json.studentExaminers.push(studExam);
}

//删除学生与阅卷人的关系
function delStudentExaminer(studentId, examinerId) {
    var i = getStudentExaminer(studentId, examinerId);
    if (i != -1) {
        MS_json.studentExaminers.splice(i, 1);
    }
}

//查找学生关联的阅卷人
function getExaminerIdByStudendId(id) {
    var i = MS_json.studentExaminers.indexOf("testerUserId", id);
    return (i != -1) ? MS_json.studentExaminers[i].examinerUserId : "";
}

//----------查询结束------------//

//返回可选的阅卷人Id集合
function getExaminerIdsOptions() {
    //得到所有用户的id集合
    var userIds = [];
    $.each(MS_json.students, function () {
        userIds.push(this.id);
    });
    return userIds.except(MS_json.examinerIds);
}

//返回可选学生
function getStudentIdsOptions() {
    //得到可选用户的id集合
    var userIds = [];
    var examinerId = MS_json.$tbStudents.data("_examinerId");
    $.each(MS_json.students, function () {
        if (this.id != examinerId) {
            userIds.push(this.id);
        }
    });
    return userIds.except(getAssignStudentIds());
}

function onAddExaminer() {
    var sb = [];
    sb.push("<div style='border: 1px solid #b2b1b1; width:400px; height:360px; overflow:auto; margin:10px;'>");
    sb.push("    <table id='tbExaminerOptions' class='user_options'>");
    sb.push("    </table>");
    sb.push("</div>")
    var $jb = $.jBox(sb.join(""), { title: "添加阅卷人", width: 423, top: "18%", buttons: { "确定": true }, submit: submitAddExaminers });

    var examinerIds = getExaminerIdsOptions();
    var examiners = getUsersByIds(examinerIds);
    var trs = [];
    var id = "";
    $.each(examiners, function () {
        id = "ae_" + this.id;
        trs.push("<tr><td><input id='" + id + "' userId='" + this.id + "' type='checkbox' /><label for='" + id + "'>&nbsp;" + this.fullName + "<label></td></tr>");
    });
    $jb.find("#tbExaminerOptions").append(trs.join("")).find("tr:even").addClass("lightblue");
}

function onAddStudent() {
    var sb = [];
    sb.push("<div style='border: 1px solid #b2b1b1; width:400px; height:360px; overflow:auto; margin:10px;'>");
    sb.push("    <table id='tbStudentOptions' class='user_options'>");
    sb.push("    </table>");
    sb.push("</div>")
    var $jb = $.jBox(sb.join(""), { title: "添加学生", width: 423, top: "18%", buttons: { "确定": true }, submit: submitAddStudents });


    var studentIds = getStudentIdsOptions();
    var students = getUsersByIds(studentIds);
    var trs = [];
    var id = "";
    $.each(students, function () {
        id = "as_" + this.id;
        trs.push("<tr><td><input id='" + id + "' userId='" + this.id + "' type='checkbox' /><label for='" + id + "'>&nbsp;" + this.fullName + "<label></td></tr>");
    });
    $jb.find("#tbStudentOptions").append(trs.join("")).find("tr:even").addClass("lightblue");
}

function submitAddExaminers(v, h, f) {
    if (v == true) {
        var addExaminerIds = h.find("#tbExaminerOptions :checked").map(function () {
            return $(this).attr("userId");
        }).get();
        
        if (addExaminerIds.length > 0) {
            MS_json.examinerIds = MS_json.examinerIds.union(addExaminerIds);

            var sb = [];
            var rowClass = "";
            var rc = MS_json.$tbExaminers.find("tr").length - 2;
            var addExaminers = getUsersByIds(addExaminerIds);
            
            $.each(addExaminers, function (i) {
                rc++;
                if (rc % 2 == 0) {
                    rowClass = "class='lightblue'";
                } else {
                    rowClass = "";
                }
                
                sb.push("<tr id='e_" + this.id + "' userId='" + this.id + "' onClick='showExaminerAllocation(\"" + this.id + "\")' " + rowClass + "><td>" + this.fullName + "</td></tr>");
            });

            MS_json.$tbExaminers.append(sb.join("")).find("tr:gt(0)").click(function () {
                if ($(this).hasClass("selected")) return;
                $(this).siblings().removeClass("selected");
                $(this).addClass("selected");
            })
            .hover(function () {
                $(this).addClass("hover");
            }, function () {
                $(this).removeClass("hover");
            });
        }
    }
}

function submitAddStudents(v, h, f) {
    if (v == true) {
        var addStudentIds = h.find("#tbStudentOptions :checked").map(function () {
            return $(this).attr("userId");
        }).get();
    }
    
    if (addStudentIds.length > 0) {
        MS_json.studentIds = MS_json.studentIds.union(addStudentIds);

        var sb = [];
        var addStudents = getUsersByIds(addStudentIds);
        var examinerId = MS_json.$tbStudents.data("_examinerId");
        var examiner = getUserById(examinerId);
        var examinerName = examiner ? examiner.fullName : "";

        $.each(addStudents, function () {
            addStudentExaminer(this.id, examinerId);    //添加关系
            updateStudentExaminerList(this.id, examinerName);         //更新关系显示
            sb.push("<tr><td>" + this.fullName + "</td><td><a href='javascript:void(0)' onclick='delAllocation(\"" + this.id + "\", this)'>删除</a></td></tr>");
        });
        MS_json.$tbStudents.append(sb.join(""));
    }
}

//查找阅卷人分派的学生
function getExaminerAllocation(id) {
    var studentIds = [];
    if (MS_json.studentExaminers.length > 0) {
        var studExams = MS_json.studentExaminers.findAll("examinerUserId", id);
        if (studExams.length > 0) {
            $.each(studExams, function () {
                studentIds.push(this.testerUserId);
            });
        }
    }
    return studentIds;
}

//显示阅卷人所分配的学生
function showExaminerAllocation(id) {
    if (!MS_json.$btnAddStudent.is(":visible")) {
        MS_json.$btnAddStudent.show();
    }

    var studentIds = getExaminerAllocation(id);
    var students = getUsersByIds(studentIds);
    var sb = [];

    MS_json.studentIds = studentIds;
    $.each(students, function () {
        sb.push("<tr id='s_" + this.id + "' userId='" + this.id + "'><td>" + this.fullName + "</td><td><a href='javascript:void(0)' onclick='delAllocation(\"" + this.id + "\", this)'>删除</a></td></tr>");
    });

    MS_json.$tbStudents.find("tr:gt(0)").remove();
    MS_json.$tbStudents.append(sb.join(""));
    MS_json.$tbStudents.data("_examinerId", id);
}

function onSaveEA() {
    $excuteWS("~UsersWS.userUserSectionManage", { uuss: MS_json.studentExaminers, sectionId: MS_json.urlParams.sectionId, userExtend: MS_json.simpleUser }, function (result) {
        if (result) {
            $.jBox.tip("保存成功!", "success");
        } else {
            $.jBox.tip("保存失败！", 'error');
        }
    }, null, null);
}

//在阅卷人中删除分派的学生
function delAllocation(id, o) {
    var examinerId = MS_json.$tbStudents.data("_examinerId");
    delStudentExaminer(id, examinerId); //删除关系
    updateStudentExaminerList(id, "");
    $(o).parent().parent().remove();

}

//更新关系表的显示
function updateStudentExaminerList(id, name) {
    var $r = MS_json.$tbStudentExaminers.find("#se_" + id);
    if ($r.get(0)) {
        $r.find("td:eq(1)").html(name);
    }
}