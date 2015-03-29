/// <reference path="CorrectingPapers.js" />
/// <reference path="../jquery-1.10.2.min.js" />
/// <reference path="../Question.js" />
/// <reference path="../jquery.ajax.js" />
/// <reference path="../../editor/scripts/editor.js" />
/// <reference path="../Array.js" />
/// <reference path="../SimpleUser.js" />
/// <reference path="../numtocn.aie100.js" />

var TC_json = { urlParams: null, improveMarkingModel: "0", $spStuFullName: null, $spStuFullNameValue: null, $btnNext: null, $btnExitTest: null, $divQuestionList: null, $btnSubmitTest: null, testResultWrapper: null, testResultWrapperArray: null, testResultWrapperArray2: null, testResultQuestions: null, correctReferenceAnswerArray: [], testTime: 0, testScore: null, testId: null, markingModel: null };
//var editor = null;

$(function () {

    TC_json.urlParams = getUrlParms();
    // TC_json.urlParams.assignmentId = "11111";
    // TC_json.urlParams.testId = "4028803c44dd06770144dd6287b2000f";
    // TC_json.urlParams.bookId = "5c26bf943ad47549013ad47580720001";
    // TC_json.urlParams.testResultId = null;
    if (!TC_json.urlParams.improveNum) {
        $("#spTestTime0,#spUseTime0,#spAnswerBase0,#spMySocre0").show();
    }
    TC_json.$divQuestionList = $("#divQuestionList");

    TC_json.$btnSubmitTest = $("#btnSubmitTest");
    TC_json.$btnExitTest = $("#btnExitTest");
    TC_json.$btnNext = $("#btnNext");
    TC_json.$spStuFullName = $("#spStuFullName");
    TC_json.$spStuFullNameValue = $("#spStuFullNameValue");
    //(TestResultWrapper testResultWrapper,TestResultQuestionWrapper[] testResultQuestionWrappers,UserExtend user)
    TC_json.$btnSubmitTest.click(function () {

        if (TC_json.testResultWrapper && TC_json.testResultQuestions) {
            $.jBox.tip("数据正在保存中，请稍后", "loading");

            ////  TC_json.$divQuestionList.find("div.correct_answerinfo[questionid] :radio[value='" + trq[q].correctFlag + "']").attr("checked", "checked");
            for (var i = 0; i < TC_json.testResultQuestions.length; i++) {
                var $c = TC_json.$divQuestionList.find("div.correct_answerinfo[questionid='" + TC_json.testResultQuestions[i].questionId + "']");
                var $cf = $c.find("span[correct_flag]");
                if ($cf.length == 0) {
                    var vcorrectflag = $c.find(":radio:checked").val();
                    if (TC_json.testResultQuestions[i].correctFlag != vcorrectflag) {
                        TC_json.testResultQuestions[i].correctFlag = vcorrectflag;
                    }

                } else {
                    var vcorrectflag2 = $cf.attr("correct_flag");
                    if (TC_json.testResultQuestions[i].correctFlag != vcorrectflag2) {
                        TC_json.testResultQuestions[i].correctFlag = vcorrectflag2;
                    }
                }
                var vscore = $c.find(":input.score").val();
                if (TC_json.testResultQuestions[i].score != vscore) {
                    TC_json.testResultQuestions[i].score = vscore;
                }

            }
            if (TC_json.urlParams.type != "3") {
                TC_json.testResultWrapper.totalScore = TC_json.testScore;
            } else {
                TC_json.testResultWrapper.improveTotalScore = TC_json.testScore;
            }
            var _data = { testResultWrapper: TC_json.testResultWrapper, testResultQuestionWrappers: TC_json.testResultQuestions, user: get_simpleUser() };
            var _method = null;
            if (TC_json.urlParams.type != "3") {
                _method = "~TestWS.submitOnlineTestGrade";
            } else {
                _method = "~TestWS.submitOnlineImproveTestGrade";
                _data.analysisLoFlag = true;
            }

            $excuteWS(_method, _data, function (r) {
                if (r) {
                    if (TC_json.testResultWrapperArray != null && TC_json.testResultWrapperArray.length > 0) {
                        for (var k = 0; k < TC_json.testResultWrapperArray.length; k++) {
                            if (TC_json.testResultWrapper.id == TC_json.testResultWrapperArray[k].id) {
                                TC_json.testResultWrapperArray.splice(k, 1)
                                break;
                            }
                        }
                        if (TC_json.testResultWrapperArray.length > 0) {
                            $.jBox.tip("数据已成功保存，下一个未批改的试卷加载中", "loading");
                            if (TC_json.testResultWrapperArray.length == 1) {
                                TC_json.$btnNext.hide();
                            }
                            t_index = 0;
                            loadCorrectingPapersInfo();
                            return;
                        }

                        //if (TC_json.testResultWrapperArray.length > 0) {
                        //    $.jBox.confirm("该试卷已批改，是否继续批改下一个试卷？", "提示", function (v, h, f) {
                        //        if (v == true) {
                        //            loadCorrectingPapersInfo();
                        //        } else {
                        //            TC_json.$btnExitTest.trigger("click");
                        //        }
                        //    }, { buttons: { '确定': true, '取消': false } });
                        //    return;
                        //}
                    }

                    TC_json.$btnSubmitTest.remove();
                    $.jBox.tip("数据已成功保存", "success");
                    TC_json.$btnExitTest.trigger("click");
                } else {
                    $.jBox.tip("数据保存失败", "error");
                }
                $.jBox.closeTip();
            }, null, null);
        }

    });

    TC_json.$btnNext.click(function () {
        $.jBox.tip("数据正在加载中", "loading");
        loadCorrectingPapersInfo();
    })

    U(function () {
        TC_json.$btnExitTest.click(function () {

            //if (get_roleId() == "0") {
            //    location.href="../Instructor/TeachingCenter.aspx?sectionId="+get_sectionId();
            //}else if(get_roleId()=="1"){
            //    location.href="../Student/LearningCenter.aspx?sectionId="+get_sectionId();
            //} else {

            //    location.href="../Default.aspx";
            //}

            if (get_roleId() == "0") {
                if (TC_json.urlParams.cpflag) {
                    location.href = "../Instructor/Reports.aspx?sectionId=" + get_sectionId() + "&assignmentId=" + TC_json.urlParams.assignmentId;
                } else {
                    location.href = "../Instructor/TeachingCenter.aspx?sectionId=" + get_sectionId();
                }
            } else if (get_roleId() == "1") {

                if (TC_json.urlParams.cpflag) {
                    location.href = "../Student/Reports.aspx?sectionId=" + get_sectionId() + "&assignmentId=" + TC_json.urlParams.assignmentId;
                } else {
                    location.href = "../Student/LearningCenter.aspx?sectionId=" + get_sectionId();
                }
            } else {
                location.href = "../Default.aspx";
            }
        });

        if (!get_userId()) {
            return;
        }
        var json_data = null;
        //(string assignmentId, string userId, string sectionId, JEWS.EngineReport.UserExtend userExtend)

        if (get_roleId() == "0") {
            //testResulNormalBySectionAssignment(string assignmentId, JEWS.EngineReport.UserExtend userExtend)
            if (TC_json.urlParams.improveNum && TC_json.urlParams.stuUserId) {

                $excuteWS("~TLCenterWS.testResultByAssignmentIds", { assignmentIds: [TC_json.urlParams.assignmentId], userId: TC_json.urlParams.stuUserId, user: get_simpleUser() }, function (r) {
                    if (r && r.length > 0) {
                        TC_json.$spStuFullName.show();
                        if (r.length > 1) {
                            TC_json.$btnNext.show();
                        }
                        TC_json.testResultWrapperArray = [];
                        TC_json.testResultWrapperArray.addRange(r);
                        loadCorrectingPapersInfo();
                    } else {
                        TC_json.$btnExitTest.trigger("click");
                    }
                }, null, null);
            } else {
                if (TC_json.urlParams.cpflag == "1") {//需要阅卷的
                    $excuteWS("~TestWS.testResulByMarkingSectionAssignment", { assignmentId: TC_json.urlParams.assignmentId, sectionId: get_sectionId(), userExtend: get_simpleUser() }, function (r) {

                        if (r && r.length > 0) {
                            TC_json.$spStuFullName.show();
                            if (r.length > 1) {
                                TC_json.$btnNext.show();
                            }
                            TC_json.testResultWrapperArray = [];
                            TC_json.testResultWrapperArray.addRange(r);
                            loadCorrectingPapersInfo();
                        } else {
                            TC_json.$btnExitTest.trigger("click");
                        }
                    }, null, null);
                } else {
                    $excuteWS("~TestWS.testResulByReporSectionAssignment", { assignmentId: TC_json.urlParams.assignmentId, sectionId: get_sectionId(), userExtend: get_simpleUser() }, function (r) {

                        if (r && r.length > 0) {
                            TC_json.$spStuFullName.show();
                            if (r.length > 1) {
                                TC_json.$btnNext.show();
                            }
                            TC_json.testResultWrapperArray = [];
                            TC_json.testResultWrapperArray.addRange(r);
                            loadCorrectingPapersInfo();
                        } else {
                            TC_json.$btnExitTest.trigger("click");
                        }
                    }, null, null);
                }
            }
            //$excuteWS("~TestWS.testResulNormalBySectionAssignment", { assignmentId: TC_json.urlParams.assignmentId, userExtend: get_simpleUser() }, function (r) {
            //    if (r && r.length > 0) {
            //        var ar = r.findAll("statusFlag", "2");
            //        if (ar != null) {
            //            TC_json.testResultWrapperArray = [];
            //            TC_json.testResultWrapperArray.addRange(ar);
            //            loadCorrectingPapersInfo();
            //        }

            //    } else {
            //        TC_json.$btnExitTest.trigger("click");
            //    }
            //}, null, null);
        } else if (get_roleId() == "1") {

            if (TC_json.urlParams.cpflag == "1") {//给他人阅卷
                //testResultOtherReportByAssignment
                $excuteWS("~TestWS.testResultOtherMarkingByAssignment", { assignmentId: TC_json.urlParams.assignmentId, userId: get_userId(), sectionId: get_sectionId(), userExtend: get_simpleUser() }, function (r) {
                    if (r && r.length > 0) {
                        TC_json.$spStuFullName.show();
                        if (r.length > 1) {
                            TC_json.$btnNext.show();
                        }
                        TC_json.testResultWrapperArray = [];
                        TC_json.testResultWrapperArray.addRange(r);
                        loadCorrectingPapersInfo();
                    } else {
                        TC_json.$btnExitTest.trigger("click");
                    }
                }, null, null);
            } else if (TC_json.urlParams.cpflag == "2") {//查看他人报告
                $excuteWS("~TestWS.testResultOtherReportByAssignment", { assignmentId: TC_json.urlParams.assignmentId, userId: get_userId(), sectionId: get_sectionId(), userExtend: get_simpleUser() }, function (r) {
                    if (r && r.length > 0) {
                        TC_json.$spStuFullName.show();
                        if (r.length > 1) {
                            TC_json.$btnNext.show();
                        }
                        TC_json.testResultWrapperArray = [];
                        TC_json.testResultWrapperArray.addRange(r);
                        loadCorrectingPapersInfo();
                    } else {
                        TC_json.$btnExitTest.trigger("click");
                    }
                }, null, null);
            } else {
                loadCorrectingPapersInfo();
            }
        }



    });

});

//加载试卷信息
var t_index = 0;
var t_simpleUser = null;
function loadCorrectingPapersInfo() {

    var user = get_simpleUser();
    t_simpleUser = {};
    var json_data = {};

    if (TC_json.testResultWrapperArray != null && TC_json.testResultWrapperArray.length > 0) {

        if (get_roleId() == "0" && TC_json.urlParams.stuUserId && TC_json.testResultWrapperArray.length > 1 && TC_json.testResultWrapperArray[0].userId != TC_json.urlParams.stuUserId) {
            for (var i = 0; i < TC_json.testResultWrapperArray.length; i++) {
                if (TC_json.testResultWrapperArray[i].userId == TC_json.urlParams.stuUserId) {
                    TC_json.testResultWrapperArray.splice(0, 1, TC_json.testResultWrapperArray[i]);
                    break;
                }
            }

        }
        for (var k in user) {
            if (k == "userId") {
                t_simpleUser[k] = TC_json.testResultWrapperArray[t_index].userId;
            } if (k == "roleId") {
                t_simpleUser[k] = "1";
            } else {
                t_simpleUser[k] = user[k];
            }
        }
        json_data = {
            type: TC_json.urlParams.type == "3" ? "3" : "1",
            bookId: get_bookId(),
            assingmentId: TC_json.urlParams.assignmentId != null ? TC_json.urlParams.assignmentId : null,
            submissionType: TC_json.testResultWrapperArray[t_index] != null ? TC_json.testResultWrapperArray[t_index].submissionType : "1",
            testResultId: TC_json.testResultWrapperArray[t_index].id ? TC_json.testResultWrapperArray[t_index].id : null,
            userId: TC_json.testResultWrapperArray[t_index].userId,
            courseId: get_courseId(),
            sectionId: get_sectionId(),
            improveReport: TC_json.urlParams.improveNum ? true : false,
            improveNum: TC_json.urlParams.improveNum ? TC_json.urlParams.improveNum : 0,
            user: t_simpleUser
        };

        t_index++;
        if (t_index == TC_json.testResultWrapperArray.length) {
            t_index = 0;
        }
    } else {
        for (var k in user) {
            t_simpleUser[k] = user[k];
        }
        //  t_simpleUser = user;
        json_data = {
            type: TC_json.urlParams.type == "3" ? "3" : "1",
            bookId: get_bookId(),
            assingmentId: TC_json.urlParams.assignmentId != null ? TC_json.urlParams.assignmentId : null,
            submissionType: TC_json.testResultWrapper != null ? TC_json.testResultWrapper.submissionType : "1",
            testResultId: TC_json.urlParams.testResultId ? TC_json.urlParams.testResultId : null,
            userId: get_userId(),
            courseId: get_courseId(),
            sectionId: get_sectionId(),
            improveReport: TC_json.urlParams.improveNum ? true : false,
            improveNum: TC_json.urlParams.improveNum ? TC_json.urlParams.improveNum : 0,
            user: t_simpleUser
        }
    }


    $excuteWS("~TestWS.QuestionInfo_getTestDetail", json_data, function (r2) {

        var testQuestionTypes = r2.testQuestionTypes;
        if (!testQuestionTypes) {
            return;
        }
        if (TC_json.$spStuFullName.is(":visible")) {
            TC_json.$spStuFullNameValue.html(r2.username);
        }

        TC_json.testResultWrapper = r2.testResultWrapper;
        if (typeof TC_json.testResultWrapper == "undefined") {
            return;
        }
        if (TC_json.testResultWrapper) {

            $("#spAnswerBase").html((accMul(Math_Round(TC_json.testResultWrapper.answeredBase, 2), 100)) + "%");
        } else {
            $("#spAnswerBase").html("0%");
        }

        var t = "0";
        if (TC_json.testResultWrapper) {
            t = formatSeconds(TC_json.testResultWrapper.useTime);
        }
        $("#spUseTime").html(t);
        if (TC_json.testResultWrapper) {
            if (TC_json.testResultWrapper.adjustScore < 0) {
                $("#spMySocre").html("--");//
            } else {
                $("#spMySocre").html(accMul(Math_Round(TC_json.testResultWrapper.adjustScore / TC_json.testResultWrapper.totalScore, 2), 100) + "%");//
            }
        } else {
            $("#spMySocre").html("0%");
        }
        var cp_flag = false;//是报告(true)还是阅卷(false)
        if (TC_json.urlParams.type != "3") {
            if (TC_json.testResultWrapper.statusFlag != "2") {//报告
                cp_flag = true;
                TC_json.$btnSubmitTest.remove();
            } else {//阅卷
                TC_json.$btnSubmitTest.show();
            }
        } else {

            if (TC_json.testResultWrapper.improveType == "1" && TC_json.testResultWrapper.improveScoreFlag != "1") {//阅卷
                TC_json.$btnSubmitTest.show();
            } else {
                cp_flag = true;
            }

        }

        TC_json.markingModel = r2.markingModel;


        if (TC_json.urlParams.type != "3" && TC_json.testResultWrapperArray == null && get_roleId() == "1" && TC_json.markingModel != "2" && TC_json.testResultWrapper.statusFlag == "2") {
            location.href = "../Student/LearningCenter.aspx?sectionId=" + get_sectionId();
            return;
        }
        TC_json.testId = r2.testId;
        $("#spQuestionCount").text(r2.questionCount);
        r2.testTime = r2.testTime ? r2.testTime : "0";
        $("#spTestTime").text(r2.testTime);
        TC_json.testTime = r2.testTime;
        TC_json.testScore = r2.testScore;
        $("#spTestScore").text(r2.testScore);
        $("#divTestTitle").text(r2.testTitle);

        var questions = r2.questions;
        var referenceAnswers = r2.referenceAnswers;
        //TC_json.correctReferenceAnswerArray = r2.correctReferenceAnswers;
        var testerAnswers = TC_json.testResultQuestions = r2.testerAnswers;
        //if (referenceAnswers) {
        //    for (var cr = 0; cr < referenceAnswers.length; cr++) {
        //        if (referenceAnswers[cr].correctFlag == "1") {
        //            TC_json.correctReferenceAnswerArray.push(referenceAnswers[cr]);
        //        }
        //    }
        //}

        if (questions) {
            var json_question = {};
            for (var q = 0; q < questions.length; q++) {
                if (questions[q].id == questions[q].parentId && questions[q].questionTypeId != "5") {//非子母题
                    if (!json_question[questions[q].questionTypeId]) {
                        json_question[questions[q].questionTypeId] = { questioninfo: [] };

                        for (var k = 0; k < testQuestionTypes.length; k++) {
                            if (questions[q].questionTypeId == testQuestionTypes[k].questionTypeId) {
                                json_question[questions[q].questionTypeId].testQuestionTypeTitle = testQuestionTypes[k].title;
                                break;
                            }
                        }
                    }

                    var qras = [];
                    if (referenceAnswers) {
                        for (var r = 0; r < referenceAnswers.length; r++) {
                            if (referenceAnswers[r].questionId == questions[q].id) {
                                qras.push(referenceAnswers[r]);
                            }
                        }
                    }

                    json_question[questions[q].questionTypeId].questioninfo.push({ question: questions[q], referenceAnswers: qras });
                }
                else {//子母题

                }
            }


            var arr = [];
            var tinum = 1;

            for (var key in json_question) {
                var o_qinfo = json_question[key].questioninfo;
                var qlen = o_qinfo.length;
                var qscore = o_qinfo[0].question.score;
                var hideStr = "";
                var kgtFlag = false;
                switch (key) {
                    case "1":
                    case "2":
                    case "3":
                        kgtFlag = true;

                        if (TC_json.urlParams.type != "3") {
                            if (TC_json.testResultWrapper.statusFlag != "1") {
                                hideStr = "display:none;";
                            }
                        } else {
                            if (!cp_flag) {
                                hideStr = "display:none;";
                            }
                        }
                        break;
                    default: break;
                }


                arr.push('<div style="font-weight:bold;padding-left:10px;' + hideStr + '">' + Utils.numberToChinese(tinum) + '、' + (json_question[key].testQuestionTypeTitle ? (json_question[key].testQuestionTypeTitle + '，') : '') + '本大题共' + qlen + '小题，每小题' + qscore + '分，共' + (qlen * qscore) + '分。</div>');

                for (var i = 0; i < o_qinfo.length; i++) {
                    arr.push('<div class="question" style="' + hideStr + '">');
                    //arr.push('<div class="f_l"><input type="checkbox" style="border:0px" />&nbsp;</div>');
                    arr.push('<div class="f_l" style="margin:0px 0px 15px 0px;">');
                    //arr.push('<div>' + (i + 1) + '、(本小题 ' + r2[i].score + ' 分)</div>');
                    var qcontent = $.trim(o_qinfo[i].question.content).toLowerCase();
                    var lindex = qcontent.lastIndexOf("</p>");
                    if (qcontent.indexOf("<p>") == 0 && lindex == qcontent.length - 4) {
                        qcontent = qcontent.substring(3, lindex);
                    }
                    arr.push('<div class="w_qcontent">' + (i + 1) + '、' + qcontent + '</div>');//(本小题 ' + r2[i].score + ' 分)
                    var qseedidstr = o_qinfo[i].question.qpvSeedId ? ' qpvseedid="' + o_qinfo[i].question.qpvSeedId + '" ' : "";
                    var qscorestr = o_qinfo[i].question.score ? ' score="' + o_qinfo[i].question.score + '" ' : "";
                    var _testerAnswers = testerAnswers != null ? testerAnswers.findAll("questionId", o_qinfo[i].question.id) : null;
                    arr.push('<div>');
                    arr.push('<div class="w_answerdz" style="float:left" referenceflag="1" questionid="' + o_qinfo[i].question.id + '" ' + qseedidstr + qscorestr + ' questiontypeid="' + o_qinfo[i].question.questionTypeId + '">' + new Question({ data: { question: o_qinfo[i].question, answers: o_qinfo[i].referenceAnswers, testerAnswers: _testerAnswers } }).getAnswerForCP() + '</div>');
                    arr.push('<div style="float:left" class="correct_answerinfo w_answerdz" questionid="' + o_qinfo[i].question.id + '">');
                    var qlink_name = "q_link_" + o_qinfo[i].question.id;
                    arr.push('<a name="' + qlink_name + '"></a>');
                    if (cp_flag) {
                        if (kgtFlag) {//客观题
                            arr.push('<div class="f_l"><input  disabled="disabled" id="rdCorrect' + o_qinfo[i].question.id + '" name="rdgroup_correct_' + o_qinfo[i].question.id + '" type="radio" value="1"/><label style="margin-right:10px;">正确</label><input disabled="disabled" id="rdIncorrect' + o_qinfo[i].question.id + '" name="rdgroup_correct_' + o_qinfo[i].question.id + '" type="radio" value="0"/><label>错误</label></div>');
                            arr.push('<div class="f_r">得分：<input disabled="disabled" class="score" type="text" tscore="' + o_qinfo[i].question.score + '" value="' + o_qinfo[i].question.score + '"/></div>');
                        } else {
                            arr.push('<div class="f_l">正确率：<span correct_flag="0">0%</span></div>');
                            if (get_roleId() == "0") {
                                arr.push('<div class="f_r">总分：<span style="margin-right:20px;">' + o_qinfo[i].question.score + '</span>得分：<input class="score" type="text" tscore="' + o_qinfo[i].question.score + '" value="' + o_qinfo[i].question.score + '"/><div class="update_score_button">修改分数</div><span class="to_next_question" qlink_name="' + qlink_name + '">下一题</span></div>');
                            } else {
                                arr.push('<div class="f_r">得分：<input disabled="disabled" class="score" type="text" tscore="' + o_qinfo[i].question.score + '" value="' + o_qinfo[i].question.score + '"/></div>');
                            }
                        }

                    } else {
                        if (kgtFlag) {//客观题
                            arr.push('<div class="f_l"><input id="rdCorrect' + o_qinfo[i].question.id + '" name="rdgroup_correct_' + o_qinfo[i].question.id + '" type="radio" value="1"/><label style="margin-right:10px;" for="rdCorrect' + o_qinfo[i].question.id + '">正确</label><input id="rdIncorrect' + o_qinfo[i].question.id + '" name="rdgroup_correct_' + o_qinfo[i].question.id + '" type="radio" value="0"/><label for="rdIncorrect' + o_qinfo[i].question.id + '">错误</label></div>');
                            arr.push('<div class="f_r">得分：<input class="score" type="text" tscore="' + o_qinfo[i].question.score + '" value="' + o_qinfo[i].question.score + '"/></div>');
                        } else {
                            arr.push('<div class="f_l">正确率：<span correct_flag="0">0%</span></div>');
                            arr.push('<div class="f_r">总分：<span style="margin-right:20px;">' + o_qinfo[i].question.score + '</span>得分：<input class="score" type="text" tscore="' + o_qinfo[i].question.score + '" value="' + o_qinfo[i].question.score + '"/><span  class="to_next_question" qlink_name="' + qlink_name + '">下一题</span></div>');
                        }

                    }

                    arr.push('<div class="c_b"></div>');
                    arr.push('<div style="border:1px solid #fff;padding:5px;margin-top:5px;overflow:auto">正确答案：' + getCorrectAnswer(o_qinfo[i].question.questionTypeId, o_qinfo[i].referenceAnswers) + '<br/>解题过程：' + o_qinfo[i].question.solution + '</div>');
                    arr.push('</div>');
                    arr.push('<div class="c_b"></div>');
                    arr.push('</div>');
                    arr.push('</div>');
                    arr.push('<div class="c_b"></div>');
                    arr.push('</div>');
                }
                tinum++;
            }

            TC_json.$divQuestionList.html(arr.join(''));
            var f_height = TC_json.$divQuestionList.find("div.question:eq(0)").height();
            var f_index = null;
            var $cas = TC_json.$divQuestionList.find("div.correct_answerinfo[questionid]");
            $cas.each(function (index) {
                var $o = $(this);

                var $txt = $o.find("input.score");
                $txt.focus(function () {
                    $txt.select();
                });
                $txt.keyup(function () {
                    var $this = $(this);
                    if (isNaN($this.val())) {
                        $.jBox.tip("分数必须为数字", "error");
                        $this.val($this.attr("tscore"));
                        return;
                    }

                    if (parseFloat($this.val()) > ($this.attr("tscore")) || parseFloat($this.val()) < 0) {
                        $.jBox.tip("请正确设置分数", "error");
                        $this.val($this.attr("tscore"));

                    }
                    var correct_flag = Math_Round($this.val() / $this.attr("tscore"), 2);
                    if (parseFloat(correct_flag) < 0.7) {
                        $o.css("background-color", "#f8efef");
                    } else {
                        $o.css("background-color", "");
                    }
                    $o.find("span[correct_flag]").attr("correct_flag", correct_flag).html((accMul(correct_flag, 100)) + "%");
                });
                $o.find("div.update_score_button").click(function () {
                    $.jBox.tip("正在修改该题得分", "loading");
                    $excuteWS("~TestWS.editTestResultQuestionScore",
                        {
                            testResultId: TC_json.testResultWrapper.id,
                            questionId: $o.attr("questionid"),
                            tScore: $txt.attr("tscore"),
                            aScore: $txt.val(),
                            userId: t_simpleUser.userId,
                            sectionId: get_sectionId(),
                            userExtend: get_simpleUser()
                        },
                        function (re) {
                            if (re) {
                                $.jBox.tip("你已经成功修改该题的得分", "success");
                            } else {
                                $.jBox.tip("修改分数失败", "error");
                            }
                        }, null, null);
                });
                //$txt.blur(function () {
                //    var $this = $(this);
                //    $o.find("span[correct_flag]").html((Math_Round($this.val() / $this.attr("tscore"), 2) * 100) + "%");
                //});
                $o.find(":radio[name='rdgroup_correct_" + $o.attr("questionid") + "']").click(function () {
                    var $this = $(this);
                    if ($this.val() == "1") {
                        $txt.val($txt.attr("tscore"));
                    } else if ($this.val() == 0) {
                        $txt.val("0.0");
                    }
                });
                var $nq = $o.find("span.to_next_question");
                if ($nq.length != 0) {
                    if (f_index == null) {
                        f_index = index;
                    }
                    $nq.click(function () {
                        var tindex = ((index + 1) == $cas.length ? f_index : (index + 1));
                        var $position = $("a[name='" + $cas.filter(":eq(" + tindex + ")").find("span.to_next_question").attr("qlink_name") + "']").position();
                        window.scrollTo($position.left, $position.top - f_height);
                    });
                }

            });

            //var $nqs = TC_json.$divQuestionList.find("span.to_next_question");
            //$nqs.each(function (index) {
            //    var $this = $(this);
            //    $this.click(function () {
            //        var $position = $("a[name='" + $nqs.filter(":eq(" + ((index + 1) == $nqs.length ? 0 : (index + 1)) + ")").attr("qlink_name") + "']").position();
            //        window.scrollTo($position.left, $position.top - f_height);
            //    });
            //});
            //$nqs.click(function (index) {
            //    var $position = $("a[name='" + $nqs.filter(":eq("+(index+1)+")").attr("qlink_name") + "']").position();
            //    window.scrollTo($position.left, $position.top - f_height);
            //});

            //TC_json.$divQuestionList.find("div.correct_answerinfo[questionid] input.score").keyup(function () {
            //    var $this = $(this);
            //    if (isNaN($this.val())) {
            //        $.jBox.tip("分数必须为数字", "error");
            //        $this.val($this.attr("tscore"));
            //    }
            //});
            if (TC_json.testResultWrapper != null) {
                $.jBox.tip("数据正在加载中", "loading");

                //$excuteWS("~TestWS.TestResultQuestion_listByTestResultId", { testResultId: TC_json.testResultWrapper.id,improveFlag: TC_json.urlParams.type!="3" ? false : true, improveReport:(TC_json.urlParams.improveNum ? true : false),improveNum: (TC_json.urlParams.improveNum ? TC_json.urlParams.improveNum : 0),user: t_simpleUser }, function (trq) {
                //TC_json.testResultQuestions = trq;
                var trq = TC_json.testResultQuestions;
                if (trq) {

                    for (var q = 0; q < trq.length; q++) {
                        var $c = TC_json.$divQuestionList.find("div.correct_answerinfo[questionid='" + trq[q].questionId + "']");

                        //if ($c.height() > 500) {
                        //    $c.css({"height":"500px","overflow":"auto"});
                        //}
                        var f = false;
                        if (!trq[q].correctFlag || parseFloat(trq[q].correctFlag) < 0.7) {
                            f = true;
                            $c.css("background-color", "#f8efef");
                        }
                        if ($c.find("span[correct_flag]").length == 0) {
                            $c.find(":radio[value='" + (trq[q].correctFlag ? parseInt(trq[q].correctFlag) : "0") + "']").attr("checked", "checked");
                        } else {
                            $c.find("span[correct_flag]").attr("correct_flag", trq[q].correctFlag).html(trq[q].correctFlag ? (accMul(Math_Round(trq[q].correctFlag, 2), 100)) + "%" : "--");
                        }
                        //if (TC_json.testResultWrapper.statusFlag != "1" && f && TC_json.urlParams.type != "3") {//阅卷且正确率低于0.7
                        //    $c.find("input.score").val("0.0");
                        //} else {
                        $c.find("input.score").val(trq[q].score);
                        //}
                    }//
                    $.jBox.closeTip();

                }
                // }, null, null);
            }

            if (TC_json.markingModel == "2" && !cp_flag) {
                $.jBox("<div style='padding:5px'>该试卷中存在有主观题，你需要自己手工阅卷。</div>", { title: "提醒" });
            }
            //.find("div.zg_tester_answer").click(function () {
            //    if (editor == null) {
            //        editor = new emath_editor();
            //        editor.show_mode = "design";
            //    }

            //    editor.upload_path = "../Uploads/Test/" + get_bookId();
            //    editor.edit_height = "150px";
            //    editor.edit_container = this;
            //    editor.hide();
            //    editor.show();

            //    if (!window.editor_loadFlag) {
            //        $("div.emath_editor div.aie_editor_head :not(img[click_action='createtable'],img[click_action='mathlatex'],img[click_action='justifyleft'],img[click_action='justifycenter'],img[click_action='justifyright'],img[click_action='insertorderedlist'],img[click_action='insertunorderedlist'],img[click_action='outdent'],img[click_action='indent'],img[click_action='inserthorizontalrule'],img[click_action='fullscreen'])").remove();
            //        window.editor_loadFlag = true;
            //    }

            //});
            //start_time(r2.testTime);
        }
    }, null, null);

}


function formatSeconds(value) {
    var theTime = parseInt(value);// 秒
    var theTime1 = 0;// 分
    var theTime2 = 0;// 小时
    // alert(theTime);
    if (theTime > 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        // alert(theTime1+"-"+theTime);
        if (theTime1 > 60) {
            theTime2 = parseInt(theTime1 / 60);
            theTime1 = parseInt(theTime1 % 60);
        }
    }
    var result = "" + parseInt(theTime) + "秒";
    if (theTime1 > 0) {
        result = "" + parseInt(theTime1) + "分钟" + result;
    }
    if (theTime2 > 0) {
        result = "" + parseInt(theTime2) + "小时" + result;
    }
    return result;
}
function getCorrectAnswer(typeId, answers) {
    var correctStr = "";
    var kgFlag = false;
    if (answers) {
        switch (typeId) {
            case "1":
            case "2":
            case "3":
                kgFlag = true;
                for (var i = 0; i < answers.length; i++) {
                    if (answers[i].correctFlag == 1) {
                        correctStr += String.fromCharCode(i + 65) + "，";
                    }

                }
                break;
            default:
                for (var i = 0; i < answers.length; i++) {
                    if (answers[i].correctFlag == 1) {
                        correctStr = answers[i].content ? answers[i].content : "";
                        break;
                    }

                }
                break;
        }

    }
    if (kgFlag) {
        return correctStr != "" ? correctStr.substring(0, correctStr.lastIndexOf("，")) : "";
    } else {
        return correctStr;
    }


}
