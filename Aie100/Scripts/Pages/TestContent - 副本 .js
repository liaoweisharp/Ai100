/// <reference path="../Math.js" />
/// <reference path="../../Plugins/showLoading/js/jquery.showLoading.min.js" />
/// <reference path="TestContent.js" />
/// <reference path="../jquery-1.10.2.min.js" />
/// <reference path="../Question.js" />
/// <reference path="../jquery.ajax.js" />
/// <reference path="../../editor/scripts/editor.js" />
/// <reference path="../Array.js" />
/// <reference path="../SimpleUser.js" />
/// <reference path="../numtocn.aie100.js" />
var TC_json = { finishStatusArray: [], first_qheight: 130, urlParams: null, $timer: null, $divQuestionList: null,improveMarkingModel:"1", $btnSaveTesterAnswers: null,dateControl:0, $btnSubmitTest: null,$btnExitTest:null, $spFinishedNum: null, $spUnFinishedNum: null, testResultWrapper: null, correctReferenceAnswerArray: [], testTime: 0,spentTime:0, shortTestTime:0,testId: null, markingModel: null, questionCount: 0, answeredBase: 0 };//, finishedArray: [], allQuestionArray: []
var editor = null;
$(function () {
    
    window.showingFlag = false;
    if (window.submittedFlag) {
        return;
    }
    TC_json.urlParams = getUrlParms();
    // TC_json.urlParams.type = "2"; （2 为训练提高 ）
   
    TC_json.$divQuestionList = $("#divQuestionList");
    TC_json.$btnSaveTesterAnswers = $("#btnSaveTesterAnswers");
    TC_json.$btnSubmitTest = $("#btnSubmitTest");
    TC_json.$btnExitTest = $("#btnExitTest");
    TC_json.$spFinishedNum = $("#spFinishedNum");
    TC_json.$spUnFinishedNum = $("#spUnFinishedNum");
    TC_json.$timer = $("#timer");
    if (TC_json.urlParams.type != "2") {
        $("#spTimeLength").show();
        $("div.remaintime").show();
    }
    var unfinishedIndex = 0;
    $(".unfinished_area").click(function () {
        var boo = false;
        var $position = null;
        for (var i = unfinishedIndex; i < TC_json.finishStatusArray.length; i++) {
            if (TC_json.finishStatusArray[i].finishFlag == 0) {
                $position = $("a[name='" + TC_json.finishStatusArray[i].questionId + "']").position();
                window.scrollTo($position.left, $position.top - TC_json.first_qheight);
                unfinishedIndex = i + 1;
                if (unfinishedIndex > TC_json.finishStatusArray.length - 1) {
                    unfinishedIndex = 0;
                }
                boo = true;
                break;
            }
        }

        if (!boo) {
            if (TC_json.finishStatusArray.length > 1) {
                unfinishedIndex = 1;
            } else {
                unfinishedIndex = 0;
            }

            $position = $("a[name='" + TC_json.finishStatusArray[0].questionId + "']").position();
            window.scrollTo($position.left, $position.top - TC_json.first_qheight);
        }


    });


    var finishedIndex = 0;
    $(".finished_area").click(function () {
        var boo = false;
        var $position = null;
        for (var i = finishedIndex; i < TC_json.finishStatusArray.length; i++) {
            if (TC_json.finishStatusArray[i].finishFlag == 1) {

                $position = $("a[name='" + TC_json.finishStatusArray[i].questionId + "']").position();
                window.scrollTo($position.left, $position.top - TC_json.first_qheight);
                finishedIndex = i + 1;
                if (finishedIndex > TC_json.finishStatusArray.length - 1) {
                    finishedIndex = 0;
                }
                boo = true;
                break;
            }
        }

        if (!boo) {
            if (TC_json.finishStatusArray.length > 1) {
                finishedIndex = 1;
            } else {
                finishedIndex = 0;
            }

            $position = $("a[name='" + TC_json.finishStatusArray[0].questionId + "']").position();
            window.scrollTo($position.left, $position.top - TC_json.first_qheight);
        }

    });
    TC_json.$btnSaveTesterAnswers.click(function () {
        
        if (TC_json.$btnSaveTesterAnswers.attr("autoflag") == "1") {
            TC_json.$btnSaveTesterAnswers.removeAttr("autoflag");
            var _answeredBase = getAnsweredBase();
            if (Math_Round(_answeredBase, 4) == Math_Round(TC_json.answeredBase, 4)) {
                //TC_json.answeredBase = _answeredBase;
                return;
            }
            TC_json.answeredBase = _answeredBase;

        }

        //if (editor != null) {
        //    editor.hide();
        //}
        
        //var _testResultQuestionWrappers = null;
        //if (!TC_json.testResultWrapper) {
        //    _testResultQuestionWrappers = getTestResultQuestionWrapperArray()
        //} else {
        //    if (TC_json.urlParams.type == "2") {
        //        if (TC_json.testResultWrapper.improveScoreFlag != null) {
        //            if (TC_json.testResultWrapper.improveScoreFlag == "1") {
        //                _testResultQuestionWrappers = getTestResultQuestionWrapperArray()
        //            }
        //        } else {
        //            _testResultQuestionWrappers = getTestResultQuestionWrapperArray()
        //        }
        //    }
        //}

        var _testResultQuestionWrappers = getTestResultQuestionWrapperArray()
        var trW = getTestResultWrapper();
        //trW.improveScoreFlag = "0";
        //trW.improveType = "0";
        $excuteWS("~TestWS.TestResult_saveTesterAnswersResult", { testResultWrapper: trW,  testResultQuestions: _testResultQuestionWrappers, user: get_simpleUser() }, function (r) {
            TC_json.testResultWrapper = r;
            if (r) {
                $.jBox.tip("数据保存成功", "success");
            } else {
                $.jBox.tip("数据保存失败", "error");
            }
        }, null, null);
    });

    TC_json.$btnSubmitTest.click(function () {
        //$("div.testcontent").showLoading();
        
        if (TC_json.urlParams.type == "2") {
            submitTest();
            return;
        }
        var usedTime = getUseTime();
        
        if (TC_json.dateControl == 1 && TC_json.shortTestTime && TC_json.shortTestTime > 0 && usedTime < TC_json.shortTestTime * 60) {
            
            //var _time = (TC_json.shortTestTime - Math_Round(accDiv(usedTime, 60), 0));
            
            var _time = (TC_json.shortTestTime * 60 - usedTime);
            $.jBox.tip("暂时不可提交，还需等待" + formatSeconds(_time) + "后才可以交卷", "info");
            return;
        }
        var finishedCount = TC_json.finishStatusArray.findAll("finishFlag", 1).length;
        var unfinishedCount = TC_json.questionCount - finishedCount;

        if ($(this).attr("autoflag") != "1") {
            var info = "";
            if (unfinishedCount > 0) {
                info = "你当前还有<span style=\"color:red;font-weight:bold;\">" + unfinishedCount + "</span>题未完成，是否继续提交？";
            } else {
                info = "你已经答题完毕，是否立即提交该考试？";
            }
            $.jBox.confirm(info,
               "提示", function (v, h, f) {
                   if (v == 'ok') {
                       submitTest();
                   }
                   return true;
               }
           );
        } else {
            submitTest();
        }



    });

    //$(document).click(function (e, n) {
    //    if (editor != null && editor.isVisible() && !$(e.target).hasClass("zg_tester_answer") && $("div.emath_editor").find(e.target).length == 0 && $("#aie_editor_latexIframe").length == 0 && !window.showingFlag) {
    //        editor.hide();
    //    }
    //});

    U(function () {
        
        if (TC_json.$timer.length != 0 && TC_json.$timer.is(":visible")) {
            $(":button.tc_button").prop("disabled", "disabled");
        }
        TC_json.$btnExitTest.click(function () {
            if (TC_json.urlParams.previewflag == "1") {
                closeWindow();
                return;
            }
            if (get_roleId() == "0" || get_realRoleId()=="0") {
                location.href = "../Instructor/TeachingCenter.aspx?sectionId=" + get_sectionId();
            } else if (get_roleId() == "1" && get_realRoleId() != "0") {
                location.href = "../Student/LearningCenter.aspx?sectionId=" + get_sectionId();
            } else {
                location.href = "../Default.aspx";
            }
        });
        var json_data = {
            type:TC_json.urlParams.type== "2" ? "2" : "0",
            bookId: get_bookId(),
            assingmentId: TC_json.urlParams.assignmentId != null ? TC_json.urlParams.assignmentId : null,
            submissionType: TC_json.testResultWrapper != null ? TC_json.testResultWrapper.submissionType : "1",
            testResultId: TC_json.urlParams.testResultId ? TC_json.urlParams.testResultId : null,
            userId: get_userId(),
            courseId: get_courseId(),
            sectionId: get_sectionId(),
            improveReport: false,
            improveNum: 0,
            user: get_simpleUser()
        }
        if (!get_userId()) {
            return;
        }
        $excuteWS("~TestWS.QuestionInfo_getTestDetail", json_data, function (r2) {

            var testQuestionTypes = r2.testQuestionTypes;
            if (!testQuestionTypes) {
                return;
            }
            TC_json.markingModel = r2.markingModel;
            TC_json.testId = r2.testId;
            TC_json.shortTestTime = r2.shortTestTime ? r2.shortTestTime : 0;
            TC_json.spentTime = r2.spentTime ? r2.spentTime : 0;

            //TC_json.questionCount = r2.questionCount;暂时屏蔽
            //$("#spQuestionCount").text(r2.questionCount);暂时屏蔽
            r2.testTime = r2.testTime ? r2.testTime : "0"
            $("#spTestTime").text(r2.testTime);
            TC_json.testTime = r2.testTime;
            
            TC_json.dateControl = r2.dateControl;
            
            //if (TC_json.urlParams.type!="2" && TC_json.dateControl == 1 && TC_json.spentTime >= TC_json.testTime * 60) {
            //    $.jBox.tip("该考试已经结束，你不能进行考试", "info");
            //    setTimeout(function () {
            //       // $("#btnExitTest").trigger("click");
            //    }, 3000);

            //  //  return;
            //}
            $("#spTestScore").text(r2.testScore);
            $("#divTestTitle").text(r2.testTitle);
            TC_json.testResultWrapper = r2.testResultWrapper;
            TC_json.answeredBase = r2.testResultWrapper ? r2.testResultWrapper.answeredBase : null;

            var questions = r2.questions;
            var referenceAnswers = r2.referenceAnswers;
            // TC_json.correctReferenceAnswerArray = r2.correctReferenceAnswers;
            var testerAnswers = r2.testerAnswers;
            //if (referenceAnswers) {
            //    for (var cr = 0; cr < referenceAnswers.length; cr++) {
            //        if (referenceAnswers[cr].correctFlag == "1") {
            //            TC_json.correctReferenceAnswerArray.push(referenceAnswers[cr]);
            //        }
            //    }
            //}

            if (questions) {
                var json_question = {};
                var fcount = 0;
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

                        var qras = new Array();
                        if (referenceAnswers) {
                            for (var r = 0; r < referenceAnswers.length; r++) {
                                if (referenceAnswers[r].questionId == questions[q].id) {
                                    qras.push(referenceAnswers[r]);
                                }
                            }
                        }
                        //TC_json.allQuestionArray.push({ "questionId": questions[q].id });
                        
                        var finishFlag = 0;
                        if (testerAnswers) {
                            var _testerAnswer= testerAnswers.firstOrDefault("questionId", questions[q].id)
                            if (_testerAnswer != null && $.trim(_testerAnswer.testerAnswersContent) != "") {
                                finishFlag = 1;
                            }
                        }

                        TC_json.finishStatusArray.push({ questionId: questions[q].id, finishFlag: finishFlag });
                        if (qras.length > 1 && questions[q].questionTypeId!="3") {
                            qras.sort(function () { return 0.5 - Math.random() }); //打乱题的顺序
                        }
                        json_question[questions[q].questionTypeId].questioninfo.push({ question: questions[q], referenceAnswers: qras });
                        fcount++;
                    }
                    else {//子母题

                    }
                }
                //var json_arr = new Array();
                //for (var k in json_question) {
                //    json_arr.push(json_question[k]);
                //}

                //if (r2.upsetQuestion == 1) {
                //    json_arr.sort(function () { return 0.5 - Math.random() });
                //}
                TC_json.questionCount = fcount; //暂时这么赋值
                $("#spQuestionCount").text(fcount); //暂时这么赋值
                var arr = new Array();
                var tinum = 1;
                
                for (var key in json_question) {
                    if (TC_json.urlParams.type == "2" && TC_json.improveMarkingModel!="0" && (key != "1" && key != "2" && key != "3")) {
                        TC_json.improveMarkingModel = "0";
                    }
                    var o_qinfo = json_question[key].questioninfo;
                    if (r2.upsetQuestion == 1) {
                        o_qinfo.sort(function () { return 0.5 - Math.random() });
                    }

                    var qlen = o_qinfo.length;
                    var qscore = o_qinfo[0].question.score;
                    arr.push('<div style="font-weight:bold;padding-left:10px;">' + Utils.numberToChinese(tinum) + '、' + json_question[key].testQuestionTypeTitle + '，本大题共' + qlen + '小题，每小题' + qscore + '分，共' + (qlen * qscore) + '分。</div>');
                    for (var i = 0; i < o_qinfo.length; i++) {
                        arr.push('<div class="question">');
                        //arr.push('');
                        arr.push('<div class="f_l" style="visibility:hidden;"><a name="' + o_qinfo[i].question.id + '"></a><input type="checkbox" style="border:0px" />&nbsp;</div>');
                        arr.push('<div class="f_l w_question">');
                        //arr.push('<div>' + (i + 1) + '、(本小题 ' + r2[i].score + ' 分)</div>');
                        var qcontent = $.trim(o_qinfo[i].question.content).toLowerCase();
                        var lindex = qcontent.lastIndexOf("</p>");
                        if (qcontent.indexOf("<p>") == 0 && lindex == qcontent.length - 4) {
                            qcontent = qcontent.substring(3, lindex);
                        }
                        arr.push('<div>' + (i + 1) + '、' + qcontent + '</div>'); //(本小题 ' + r2[i].score + ' 分)
                        var qseedidstr = o_qinfo[i].question.qpvSeedId ? ' qpvseedid="' + o_qinfo[i].question.qpvSeedId + '" ' : "";
                        var qscorestr = o_qinfo[i].question.score ? ' score="' + o_qinfo[i].question.score + '" ' : "";
                        var _testerAnswers = testerAnswers != null ? testerAnswers.findAll("questionId", o_qinfo[i].question.id) : null;

                        //if (_testerAnswers != null && _testerAnswers.length>0) {
                        //    TC_json.finishedArray.push({ "questionId": o_qinfo[i].question.id });
                        //}
                        arr.push('<div referenceflag="1" questionid="' + o_qinfo[i].question.id + '" ' + qseedidstr + qscorestr + ' questiontypeid="' + o_qinfo[i].question.questionTypeId + '">' + new Question({ data: { question: o_qinfo[i].question, answers: o_qinfo[i].referenceAnswers, testerAnswers: _testerAnswers} }).getAnswerForTest() + '</div>');
                        arr.push('</div>');
                        arr.push('<div class="c_b"></div>');
                        arr.push('</div>');
                    }
                    tinum++;
                }

                TC_json.$divQuestionList.html(arr.join(''));
                //TC_json.$divQuestionList.find("div[questionid][questiontypeid] tr.tr_kgt").click(function () {
                //    var $input = $(this).find(":radio,:checkbox");
                //    if ($input.is(":checked")) {

                //    }
                //});
                TC_json.$divQuestionList.find("label img").attr("disabled", "disabled");
                TC_json.first_qheight = TC_json.$divQuestionList.find("div.question:eq(0)").height();
                
                var finishedCount = TC_json.finishStatusArray.findAll("finishFlag", 1).length;
                TC_json.$spFinishedNum.html(finishedCount);
                TC_json.$spUnFinishedNum.html(TC_json.questionCount - finishedCount);
                TC_json.$divQuestionList.find("input[class=answer_select]").click(function () {
                    var $o = $(this);
                    //var qo = TC_json.finishedArray.firstOrDefault("questionId", $o.attr("questionid"));
                    // if (!qo) {
                    //TC_json.finishedArray.push({ questionId: $o.attr("questionid") });

                    if ($o.is(":checkbox")) {
                        var $radiv = $('div[questionid="' + $o.attr("questionid") + '"][questiontypeid="2"]');
                        if ($radiv.length != 0 && $radiv.find(":checkbox:checked").length != 0) {
                            for (var m = 0; m < TC_json.finishStatusArray.length; m++) {
                                if ($o.attr("questionid") == TC_json.finishStatusArray[m].questionId) {
                                    unfinishedIndex = m;
                                    if (TC_json.finishStatusArray[m].finishFlag != 1) {
                                        TC_json.finishStatusArray[m].finishFlag = 1;
                                    }
                                    break;
                                }
                            }
                        } else {
                            for (var m = 0; m < TC_json.finishStatusArray.length; m++) {
                                if ($o.attr("questionid") == TC_json.finishStatusArray[m].questionId) {
                                    if (TC_json.finishStatusArray[m].finishFlag != 0) {
                                        TC_json.finishStatusArray[m].finishFlag = 0;
                                    }
                                    break;
                                }
                            }
                        }
                    } else {

                        for (var m = 0; m < TC_json.finishStatusArray.length; m++) {
                            if ($o.attr("questionid") == TC_json.finishStatusArray[m].questionId) {
                                unfinishedIndex = m;
                                if (TC_json.finishStatusArray[m].finishFlag != 1) {
                                    TC_json.finishStatusArray[m].finishFlag = 1;
                                }
                                break;
                            }
                        }
                    }
                    var finishedCount2 = TC_json.finishStatusArray.findAll("finishFlag", 1).length;
                    TC_json.$spFinishedNum.html(finishedCount2);
                    TC_json.$spUnFinishedNum.html(TC_json.questionCount - finishedCount2);
                    //}

                });


                TC_json.$divQuestionList.find("div.zg_tester_answer").click(function () {
                    var $this = $(this);
                    var tempHtml = $this.html();
                    if (editor != null && editor.isVisible()) {
                        return;
                    }
                    if ($this.find("div.emath_editor").length != 0) {
                        return;
                    }
                    if (editor == null) {
                        editor = new emath_editor();
                        editor.show_mode = "design";
                    }

                    editor.upload_path = "../Uploads/Test/" + get_bookId();
                    editor.edit_height = "150px";
                    editor.edit_container = $this;
                    editor.hide();
                    editor.show();
                    setTimeout(function () {
                        try {
                            var $_body = $($this.find("div.emath_editor iframe[edit_area=1]").get(0).contentWindow.document.body);
                            $_body.bind("paste", function () {
                                return false;
                            });
                        } catch (e) { }
                    }, 0);

                    var $aie_editor_finish = $this.find("div.emath_editor div.aie_editor_finish");
                    $aie_editor_finish.show();
                    $aie_editor_finish.find("span.finish_action").unbind("click").click(function () {
                        editor.hide();
                        // var qo = TC_json.finishedArray.firstOrDefault("questionId", $this.attr("questionid"));
                        if ($this.find("img,table").length != 0 || $.trim($this.text()) != "") {
                            // if (!qo) {
                            for (var m = 0; m < TC_json.finishStatusArray.length; m++) {
                                if ($this.attr("questionid") == TC_json.finishStatusArray[m].questionId) {
                                    if (TC_json.finishStatusArray[m].finishFlag != 1) {
                                        TC_json.finishStatusArray[m].finishFlag = 1;
                                    }
                                    break;
                                }
                            }
                            var finishedCount3 = TC_json.finishStatusArray.findAll("finishFlag", 1).length;
                            TC_json.$spFinishedNum.html(finishedCount3);
                            TC_json.$spUnFinishedNum.html(TC_json.questionCount - finishedCount3);
                            //TC_json.finishedArray.push({ questionId: $this.attr("questionid") });
                            //TC_json.$spFinishedNum.html(TC_json.finishedArray.length);
                            //TC_json.$spUnFinishedNum.html(TC_json.questionCount - TC_json.finishedArray.length);
                            // } 
                        } else {
                            for (var m = 0; m < TC_json.finishStatusArray.length; m++) {
                                if ($this.attr("questionid") == TC_json.finishStatusArray[m].questionId) {
                                    if (TC_json.finishStatusArray[m].finishFlag != 0) {
                                        TC_json.finishStatusArray[m].finishFlag = 0;
                                    }
                                    break;
                                }
                            }
                            var finishedCount3 = TC_json.finishStatusArray.findAll("finishFlag", 1).length;
                            TC_json.$spFinishedNum.html(finishedCount3);
                            TC_json.$spUnFinishedNum.html(TC_json.questionCount - finishedCount3);
                            //for (var f = 0; f < TC_json.finishedArray.length; f++) {
                            //    if (TC_json.finishedArray[f].questionId == $this.attr("questionid")) {
                            //        TC_json.finishedArray.splice(f, 1);
                            //        TC_json.$spFinishedNum.html(TC_json.finishedArray.length);
                            //        TC_json.$spUnFinishedNum.html(TC_json.questionCount - TC_json.finishedArray.length);
                            //        break;
                            //    }
                            //}
                        }

                    });

                    $aie_editor_finish.find("span.cancel_action").unbind("click").click(function () {
                        editor.html(tempHtml);
                        editor.hide();
                    });
                    if (!window.editor_loadFlag) {
                        $("div.emath_editor iframe.aie_editor_iframe").css("margin-bottom", "-7px");
                        $("div.emath_editor div.aie_editor_head :not(img[click_action='createtable'],img[click_action='mathlatex'],img[click_action='justifyleft'],img[click_action='justifycenter'],img[click_action='justifyright'],img[click_action='insertorderedlist'],img[click_action='insertunorderedlist'],img[click_action='outdent'],img[click_action='indent'],img[click_action='inserthorizontalrule'],img[click_action='fullscreen'])").remove();
                        window.editor_loadFlag = true;
                    }

                });
                if (TC_json.urlParams.type != "2") {
                    
                    start_time(r2.testTime);
                    setTimeout(function () {
                        if (get_roleId() == "1") {
                            $(":button.tc_button").removeProp("disabled");
                        } else {
                            TC_json.$btnExitTest.removeProp("disabled");
                        }
                        
                    }, 1000);
                }

                if (get_roleId() == "1" && get_realRoleId()!="0") {
                    window._interval=setInterval(function () {
                        TC_json.$btnSaveTesterAnswers.attr("autoflag", "1").trigger("click");
                    }, 1000 * 60 * 5);
                }
            }
        }, null, "QuestionInfo_getTestDetail");

    });

});

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
function submitTest() {
    
    $.jBox.tip("正在提交试卷，请稍后", "loading");
    if (editor != null) {
        editor.hide();
    }
    if (window._interval) {
        clearInterval(window._interval);
    }
    
    if (TC_json.urlParams.type == "2") {
        //(TestResultWrapper testResultWrapper, string percentage, string improveScore, TestResultQuestionWrapper[] testResultQuestionWrappers, 
        //TesterAnswersWrapper[] testerAnswers, bool? analysisLoFlag, JEWS.EngineSubmissionTest.UserExtend user)
        var kgtFlag = true;
        
        if (TC_json.improveMarkingModel=="1") {
            $excuteWS("~TestWS.submitOnlineImproveTest", {
                testResultWrapper: getTestResultWrapper(),
                testResultQuestionWrappers: getTestResultQuestionWrapperArray(),
                analysisLoFlag: true,
                user: get_simpleUser()
            }, function (r) {
                if (r) {
                    $.jBox.tip("你的考试已成功提交", "success");
                } else {
                    $.jBox.tip("提交考试失败", "error");
                }

                if (get_roleId() == "1" && get_realRoleId() != "0") {

                    //if (TC_json.markingModel == "1" || TC_json.markingModel == "2") {
                    //    location.href = "../TestShow/CorrectingPapers.aspx?type=3&sectionId=" + get_sectionId() + "&assignmentId=" + TC_json.urlParams.assignmentId;
                    //} else {
                        location.href = "../Student/LearningCenter.aspx?sectionId=" + get_sectionId();
                    //}

                } else if (get_roleId() == "0" || get_realRoleId() == "0") {
                    //if (TC_json.markingModel == "1" || TC_json.markingModel == "2") {
                    //    location.href = "../TestShow/CorrectingPapers.aspx?type=3&sectionId=" + get_sectionId() + "&assignmentId=" + TC_json.urlParams.assignmentId;
                    //} else {
                        location.href = "../Instructor/TeachingCenter.aspx?sectionId=" + get_sectionId();
                   // }
                }

            }, null, null);
        } else {
            var trW = getTestResultWrapper();
            //trW.improveScoreFlag = "0";
            //trW.improveType = "1";
            $excuteWS("~TestWS.submitTesterAnswersResult", { testResultWrapper: trW, testResultQuestionWrappers: getTestResultQuestionWrapperArray(), user: get_simpleUser() }, function (r) {
                if (r) {
                    $.jBox.tip("你的考试已成功提交", "success");
                } else {
                    $.jBox.tip("提交考试失败", "error");
                }
                if (get_roleId() == "1" && get_realRoleId() != "0") {
                    location.href = "../Student/LearningCenter.aspx?sectionId=" + get_sectionId();
                } else if (get_roleId() == "0" || get_realRoleId() == "0") {
                    location.href = "../Instructor/TeachingCenter.aspx?sectionId=" + get_sectionId();
                }
            }, null, null);
        }
      
    } else {
        if (TC_json.markingModel == "1") {

            $excuteWS("~TestWS.submitOnlineTest", { testResultWrapper: getTestResultWrapper(), testResultQuestionWrappers: getTestResultQuestionWrapperArray(), isAuto: true, user: get_simpleUser() }, function (r) {
                if (r) {
                    $.jBox.tip("你的考试已成功提交", "success");
                } else {
                    $.jBox.tip("提交考试失败", "error");
                }

                if (get_roleId() == "1" && get_realRoleId() != "0") {
                    if (TC_json.markingModel == "1" || TC_json.markingModel == "2") {
                        location.href = "../TestShow/CorrectingPapers.aspx?sectionId=" + get_sectionId() + "&assignmentId=" + TC_json.urlParams.assignmentId;
                    } else {
                        location.href = "../Student/LearningCenter.aspx?sectionId=" + get_sectionId();
                    }

                } else if (get_roleId() == "0" || get_realRoleId() == "0") {
                    if (TC_json.markingModel == "1" || TC_json.markingModel == "2") {
                        location.href = "../TestShow/CorrectingPapers.aspx?sectionId=" + get_sectionId() + "&assignmentId=" + TC_json.urlParams.assignmentId;
                    } else {
                        location.href = "../Instructor/TeachingCenter.aspx?sectionId=" + get_sectionId();
                    }
                }

            }, null, null);
        }
        else {
            $excuteWS("~TestWS.submitTesterAnswersResult", { testResultWrapper: getTestResultWrapper(),  testResultQuestionWrappers: getTestResultQuestionWrapperArray(), user: get_simpleUser() }, function (r) {
                if (r) {
                    $.jBox.tip("你的考试已成功提交", "success");
                } else {
                    $.jBox.tip("提交考试失败", "error");
                }
                if (get_roleId() == "1" && get_realRoleId() != "0") {
                    if (TC_json.markingModel == "2") {
                        location.href = "../TestShow/CorrectingPapers.aspx?sectionId=" + get_sectionId() + "&assignmentId=" + TC_json.urlParams.assignmentId;
                    } else {
                        location.href = "../Student/LearningCenter.aspx?sectionId=" + get_sectionId();
                    }
                } else if (get_roleId() == "0" || get_realRoleId() == "0") {
                    location.href = "../Instructor/TeachingCenter.aspx?sectionId=" + get_sectionId();
                }
            }, null, null);
        }
    }
    
}

function getUseTime() {

var h = Number(TC_json.$timer.find("span.hour").text());
var m = Number(TC_json.$timer.find("span.minute").text());
var s = Number(TC_json.$timer.find("span.second").text());
    var test_time = (TC_json.testTime * 60);
    var remain_time = ((h * 60 * 60) + (m * 60) + s);
    if (test_time >= remain_time) {
        return (TC_json.testTime * 60) - ((h * 60 * 60) + (m * 60) + s);
    }
    else {
        return (TC_json.testTime * 60);
    }
}

function getTestResultWrapper() {

    var testResultWrapper = {};
    if (TC_json.testResultWrapper) {
        testResultWrapper = TC_json.testResultWrapper;
    } else {
        testResultWrapper.assignmentContentId = testResultWrapper.assignmentId = TC_json.urlParams.assignmentId;
        testResultWrapper.testId = TC_json.testId;
        testResultWrapper.type = "1";
        testResultWrapper.submissionType = "1"; //正式
        testResultWrapper.id = null;
        testResultWrapper.attemptNumber = "1";
        testResultWrapper.totalScore = null;
        testResultWrapper.adjustScore = null;
        testResultWrapper.userId = get_userId();
        testResultWrapper.sectionId = get_sectionId();
        testResultWrapper.systemId = get_systemId();
        testResultWrapper.roleId = get_roleId();
    }
    testResultWrapper.answeredBase = getAnsweredBase();
    testResultWrapper.useTime = getUseTime();
    
    return testResultWrapper;
}

function getTesterAnswerWrapperArray(flag) {
    var testerAnswerWrapperArray = new Array();
    var finishedQuestionNum = 0;
    var _testResultId = TC_json.testResultWrapper ? TC_json.testResultWrapper.id : null;
    var _userId = get_userId();
    var _sectionId = get_sectionId();
    TC_json.$divQuestionList.find("div[referenceflag='1']").each(function () {
        var $this = $(this);
        var _questiontypeid = $this.attr("questiontypeid");
        switch (_questiontypeid) {
            case "1"://单项选择题
            case "2"://多项选择题
            case "3"://判断题
                $this.find("input.answer_select:checked").each(function () {//:checked
                    var testerAnswerWrapper1 = {};
                    testerAnswerWrapper1.content = $(this).val();
                    testerAnswerWrapper1.id = null;
                    testerAnswerWrapper1.orderName = null;
                    testerAnswerWrapper1.questionId = $this.attr("questionid");
                    testerAnswerWrapper1.sectionId = _sectionId;
                    testerAnswerWrapper1.testResultId = _testResultId;
                    testerAnswerWrapper1.userId = _userId;
                    if (flag) {
                        if (_questiontypeid != "2") {
                            finishedQuestionNum++;
                        } else {
                            
                            var f = false;
                            for (var q = 0; q < testerAnswerWrapperArray.length; q++) {
                                if (testerAnswerWrapperArray[q].questionId == testerAnswerWrapper1.questionId) {
                                    f = true;
                                    break;
                                }
                            }
                            if (!f) {
                                finishedQuestionNum++;
                            }
                        }
                    }
                    testerAnswerWrapperArray.push(testerAnswerWrapper1);
                    
                   
                });
                break;
            case "5": //子母题

                break;
            case "4": //填空题
            case "11": //问答题
            default:
                var testerAnswerWrapper2 = {};
                var $zgt = $this.find("div.zg_tester_answer");
                if ($zgt.find("div.emath_editor").length == 0) {
                    testerAnswerWrapper2.content = $zgt.html();
                    if (testerAnswerWrapper2.content.replace(/\s|　|&nbsp(;)?/gi, "") != "") {
                        testerAnswerWrapper2.id = null;
                        testerAnswerWrapper2.orderName = null;
                        testerAnswerWrapper2.questionId = $this.attr("questionid");
                        testerAnswerWrapper2.sectionId = _sectionId;
                        testerAnswerWrapper2.testResultId = _testResultId;
                        testerAnswerWrapper2.userId = _userId;
                        if (flag) {
                            finishedQuestionNum++;
                        }
                        testerAnswerWrapperArray.push(testerAnswerWrapper2);
                    }
                }
               
                break;
        }
    });
    if (flag) {
        return {finishedQuestionCount:finishedQuestionNum};
    }
    return testerAnswerWrapperArray;
}

function getTestResultQuestionWrapperArray(flag) {
   
    var testResultQuestionWrapperArray = new Array();
    var finishedQuestionNum = 0;
    var _testResultId = TC_json.testResultWrapper ? TC_json.testResultWrapper.id : null;
    var _userId = get_userId();
    var _sectionId = get_sectionId();
    TC_json.$divQuestionList.find("div[referenceflag='1']").each(function () {
        var $this = $(this);
        var _questiontypeid = $this.attr("questiontypeid");
        switch (_questiontypeid) {
            case "1"://单项选择题
            case "2"://多项选择题
            case "3"://判断题
                var testResultQuestionWrapper = {};
                testResultQuestionWrapper.correctFlag = null;
                testResultQuestionWrapper.id = null;
                testResultQuestionWrapper.improveNum = null;
                testResultQuestionWrapper.insNote = null;
                testResultQuestionWrapper.qpvSeedId = typeof $this.attr("qpvseedid") != "undefined" ? $this.attr("qpvseedid") : null;
                testResultQuestionWrapper.questionId = $this.attr("questionid");
                testResultQuestionWrapper.tScore = $this.attr("score");
                if (!testResultQuestionWrapper.tScore) {
                    testResultQuestionWrapper.tScore = null;
                }
                testResultQuestionWrapper.score = $this.attr("score");
                if (!testResultQuestionWrapper.score) {
                    testResultQuestionWrapper.score = null;
                }
                testResultQuestionWrapper.sectionId = get_sectionId();
                testResultQuestionWrapper.stdNote = null;
                testResultQuestionWrapper.systemId = get_systemId();
                testResultQuestionWrapper.testId = TC_json.testId;
                testResultQuestionWrapper.userId = get_userId();
                var testerAnswersContent = "";
                $this.find("input.answer_select:checked").each(function () {//:checked
                    testerAnswersContent += $(this).val() + ",";
                });
                
                var lastindex = testerAnswersContent.lastIndexOf(",");
                if (lastindex!=-1 &&lastindex == testerAnswersContent.length - 1) {
                    testerAnswersContent = testerAnswersContent.substring(0, lastindex);
                }
                if (flag && testerAnswersContent != "") {
                    finishedQuestionNum++;
                }
                testResultQuestionWrapper.testerAnswersContent = testerAnswersContent;
                testResultQuestionWrapperArray.push(testResultQuestionWrapper);
                break;
            case "5": //子母题

                break;
            case "4": //填空题
            case "11": //问答题
            default:
                var testResultQuestionWrapper = {};
                testResultQuestionWrapper.correctFlag = null;
                testResultQuestionWrapper.id = null;
                testResultQuestionWrapper.improveNum = null;
                testResultQuestionWrapper.insNote = null;
                testResultQuestionWrapper.qpvSeedId = typeof $this.attr("qpvseedid") != "undefined" ? $this.attr("qpvseedid") : null;
                testResultQuestionWrapper.questionId = $this.attr("questionid");
                testResultQuestionWrapper.tScore = $this.attr("score");
                if (!testResultQuestionWrapper.tScore) {
                    testResultQuestionWrapper.tScore = null;
                }
                testResultQuestionWrapper.score = $this.attr("score");
                if (!testResultQuestionWrapper.score) {
                    testResultQuestionWrapper.score = null;
                }
                testResultQuestionWrapper.sectionId = get_sectionId();
                testResultQuestionWrapper.stdNote = null;
                testResultQuestionWrapper.systemId = get_systemId();
                testResultQuestionWrapper.testId = TC_json.testId;
                testResultQuestionWrapper.userId = get_userId();
                 //var testerAnswerWrapper2 = {};
                var $zgt = $this.find("div.zg_tester_answer");
                if ($zgt.find("div.emath_editor").length == 0) {
                    testResultQuestionWrapper.testerAnswersContent = $zgt.html();
                    if (testResultQuestionWrapper.testerAnswersContent.replace(/\s|　|&nbsp(;)?/gi, "") != "") {
                        if (flag) {
                            finishedQuestionNum++;
                        }
                        
                    } else {
                        testResultQuestionWrapper.testerAnswersContent = "";
                    }
                }

                testResultQuestionWrapperArray.push(testResultQuestionWrapper);
                break;
        }
    });
    if (flag) {
        return { finishedQuestionCount: finishedQuestionNum };
    }

    
    return testResultQuestionWrapperArray;
}

function getTestResultQuestionWrapperArray1111() {

    var testResultQuestionWrapperArray = new Array();
    TC_json.$divQuestionList.find("div[referenceflag='1']").each(function () {
        var $this = $(this);
        var testResultQuestionWrapper = {};
        testResultQuestionWrapper.correctFlag = null;
        testResultQuestionWrapper.id = null;
        testResultQuestionWrapper.improveNum = null;
        testResultQuestionWrapper.insNote = null;
        testResultQuestionWrapper.qpvSeedId = typeof $this.attr("qpvseedid") != "undefined" ? $this.attr("qpvseedid") : null;
        testResultQuestionWrapper.questionId = $this.attr("questionid");
        testResultQuestionWrapper.tScore = $this.attr("score");
        testResultQuestionWrapper.score = $this.attr("score");
        testResultQuestionWrapper.sectionId = get_sectionId();
        testResultQuestionWrapper.stdNote = null;
        testResultQuestionWrapper.systemId = get_systemId();
        testResultQuestionWrapper.testId = TC_json.testId;
        testResultQuestionWrapper.userId = get_userId();
        testResultQuestionWrapperArray.push(testResultQuestionWrapper);
    });

    return testResultQuestionWrapperArray;
}

function getAnsweredBase() {
    if (TC_json.questionCount > 0) {
        return getTestResultQuestionWrapperArray(true).finishedQuestionCount / TC_json.questionCount;
        //return TC_json.finishedArray.length / TC_json.questionCount;
    }
    return TC_json.answeredBase;
}

//function getReferenceAnswerWrapperArray() {
//    var referenceAnswerWrapperArray = new Array();
//    var referenceAnswerWrapper = {};
//    referenceAnswerWrapper.content = null;
//    referenceAnswerWrapper.correctFlag = null;
//    referenceAnswerWrapper.feedback = null;
//    referenceAnswerWrapper.id = null;
//    referenceAnswerWrapper.orderName = null;
//    referenceAnswerWrapper.questionId = null;
//    referenceAnswerWrapper.selectCount = null;
//    return referenceAnswerWrapperArray;
//}

var time_now_server, time_now_client, time_end, time_server_client, timerID;
function start_time(t) {
    //time_now_server=new Date("2014/4/18 15:10:1");//开始的时间
    time_now_server = new Date();
    time_now_server = time_now_server.getTime();

    time_now_client = new Date();
    time_now_client = time_now_client.getTime();

    time_server_client = time_now_server - time_now_client;
    
    //time_end = new Date("2014/4/18 23:59:59");//结束的时间
    //time_end = time_end.getTime();
    var useTime = TC_json.spentTime ? TC_json.spentTime * 1000 : 0;
    var remaintime =  t * 60000 - useTime;
    time_end = time_now_server + remaintime;// (2 * 3600000 + 0 * 60000+ 1*1000);
    timerID=setTimeout("show_time()", 1000);
}

function show_time() {
   
    if (TC_json.$timer.length==0) { return; }
    //$timer.html(time_server_client);
    if (time_server_client == 0) {
        TC_json.$timer.find("span.hour").text("00");
        TC_json.$timer.find("span.minute").text("00");
        TC_json.$timer.find("span.second").text("00");
    } else {
        TC_json.$timer.text(time_server_client);
    }
    var time_now, time_distance, str_time;
    var int_day, int_hour, int_minute, int_second;
    var time_now = new Date();
    time_now = time_now.getTime() + time_server_client;
    time_distance = time_end - time_now;
    if (time_distance > 0) {
        int_day = Math.floor(time_distance / 86400000)
        time_distance -= int_day * 86400000;
        int_hour = Math.floor(time_distance / 3600000)
        time_distance -= int_hour * 3600000;
        int_minute = Math.floor(time_distance / 60000)
        time_distance -= int_minute * 60000;
        int_second = Math.floor(time_distance / 1000)
        int_hour = Math.floor(int_day * 24 + int_hour);
        if (int_hour < 10)
            int_hour = "0" + int_hour;
        if (int_minute < 10)
            int_minute = "0" + int_minute;
        if (int_second < 10)
            int_second = "0" + int_second;
        //str_time=int_day+"天"+int_hour+"时"+int_minute+"分"+int_second+"秒";
        //str_time = int_hour + ":" + int_minute + ":" + int_second + "";
        //$timer.html(str_time);
        
        TC_json.$timer.find("span.hour").text(int_hour);
        TC_json.$timer.find("span.minute").text(int_minute);
        TC_json.$timer.find("span.second").text(int_second);
        if (get_realRoleId() != "0") {
            timerID = setTimeout("show_time()", 1000);
        }
        
    }
    else {
        //$timer.html("00:00:00");//timer.innerHTML;
        TC_json.$timer.find("span.hour").text("00");
        TC_json.$timer.find("span.minute").text("00");
        TC_json.$timer.find("span.second").text("00");
        clearTimeout(timerID);
        if (get_roleId() == "1" && get_realRoleId() != "0") {
            TC_json.$btnSubmitTest.attr("autoflag", "1").trigger("click");
        }
    }
}