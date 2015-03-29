/// <reference path="../Question.js" />
/// <reference path="../../Plugins/showLoading/js/jquery.showLoading.min.js" />
/// <reference path="../Math.js" />
/// <reference path="../Array.js" />
/// <reference path="../comm.js" />
/// <reference path="../jquery.ajax.js" />
/// <reference path="../jquery-1.7.1.min.js" />
/// <reference path="../../Plugins/Date.js" />
/// <reference path="../SimpleUser.js" />
var json_errorq = { urlParams: null, $divErrQuestionList: null, $ddlIncorreceBase: null, $txtStartDate: null, $txtEndDate: null,$spViewByDateRange:null,$ddlStudentList:null, errorQuestions: null, questionIds: [] };

$(function () {
    
    json_errorq.urlParams = getUrlParms();
    json_errorq.$divErrQuestionList = $("#divErrQuestionList");
    json_errorq.$ddlIncorreceBase = $("#ddlIncorreceBase");
    json_errorq.$txtStartDate = $("#txtStartDate");
    json_errorq.$txtEndDate = $("#txtEndDate");
    json_errorq.$spViewByDateRange = $("#spViewByDateRange");
    json_errorq.$ddlStudentList = $("#ddlStudentList");
    json_errorq.$txtStartDate.calendar({ format: 'yyyy-MM-dd HH:mm:ss', maxDate: '#txtEndDate' });
    json_errorq.$txtEndDate.calendar({ format: 'yyyy-MM-dd HH:mm:ss', minDate: '#txtStartDate' });

    json_errorq.$spViewByDateRange.click(function () {
        //json_errorq.$divErrQuestionList.showLoading();
        getQuestionError();
    });

    $("#spViewTodayInfo").click(function () {
        var d = new Date();
        json_errorq.$txtStartDate.val(d.pattern("yyyy-MM-dd 00:00:00"));
        json_errorq.$txtEndDate.val(d.pattern("yyyy-MM-dd HH:mm:ss"));
        json_errorq.$spViewByDateRange.trigger("click");
    });
  
    U(function () {
        $excuteWS("~UsersWS.usersStdBySectionId", { sectionId: get_sectionId(), userExtend: get_simpleUser() }, function (r) {
            if (r && r.length > 0) {
                var options = new Array();
                for (var i = 0; i < r.length; i++) {
                    options.push('<option value="' + r[i].id + '">' + r[i].fullName + '</option>');
                }
                json_errorq.$ddlStudentList.append(options.join(''));
                json_errorq.$ddlStudentList.change(function () {
                    getQuestionError();
                });
            }
        }, null, null);
        getQuestionError();
        json_errorq.$ddlIncorreceBase.change(function () {
            //json_errorq.$divErrQuestionList.showLoading();
            getQuestionError();
        });
    });


})

function getQuestionError(_stuUserId) {
    json_errorq.$divErrQuestionList.showLoading();
    var _startDate = json_errorq.$txtStartDate.val();
    var _endDate = json_errorq.$txtEndDate.val();
    if ($.trim(_startDate)=="") {
        _startDate = null;
    }
    if ($.trim(_endDate) == "") {
        _endDate = null;
    }

    var _stuUserId = json_errorq.$ddlStudentList.val();
    
    if (_stuUserId=="") {
        if (json_errorq.urlParams.structureId) {
            $excuteWS("~ErrorQuestionWS.questionErrorSectionByStructureId", { structureId: json_errorq.urlParams.structureId, sectionId: get_sectionId(), correceBase: json_errorq.$ddlIncorreceBase.val(), startDate: _startDate, endDate: _endDate, userExtend: get_simpleUser() }, function (r) {

                json_errorq.errorQuestions = r;
                json_errorq.questionIds = r ? r.select("questionId") : [];
                bindErrQuestionsPagination();

            }, null, null)
        } else if (json_errorq.urlParams.pointingLoId) {
            $excuteWS("~ErrorQuestionWS.questionErrorSectionByLoIds", { pointingLoIds: [json_errorq.urlParams.pointingLoId], sectionId: get_sectionId(), correceBase: json_errorq.$ddlIncorreceBase.val(), startDate: _startDate, endDate: _endDate, userExtend: get_simpleUser() }, function (r) {

                json_errorq.errorQuestions = r;
                json_errorq.questionIds = r ? r.select("questionId") : [];
                bindErrQuestionsPagination();

            }, null, null)
        } else {
            $excuteWS("~ErrorQuestionWS.questionErrorSectionBySectionId", { sectionId: get_sectionId(), correceBase: json_errorq.$ddlIncorreceBase.val(), startDate: _startDate, endDate: _endDate, userExtend: get_simpleUser() }, function (r) {

                json_errorq.errorQuestions = r;
                json_errorq.questionIds = r ? r.select("questionId") : [];
                bindErrQuestionsPagination();

            }, null, null)
        }
    } else {
        if (json_errorq.urlParams.structureId) {
            $excuteWS("~ErrorQuestionWS.questionErrorUserByStructureId", { structureId: json_errorq.urlParams.structureId, userId: _stuUserId, correceBase: json_errorq.$ddlIncorreceBase.val(), startDate: _startDate, endDate: _endDate, userExtend: get_simpleUser() }, function (r) {

                json_errorq.errorQuestions = r;
                json_errorq.questionIds = r ? r.select("questionId") : [];
                bindErrQuestionsPagination();

            }, null, null)
        } else if (json_errorq.urlParams.pointingLoId) {
            $excuteWS("~ErrorQuestionWS.questionErrorUserByLoIds", { pointingLoIds: [json_errorq.urlParams.pointingLoId], userId: _stuUserId, correceBase: json_errorq.$ddlIncorreceBase.val(), startDate: _startDate, endDate: _endDate, userExtend: get_simpleUser() }, function (r) {

                json_errorq.errorQuestions = r;
                json_errorq.questionIds = r ? r.select("questionId") : [];
                bindErrQuestionsPagination();

            }, null, null)
        } else {
            $excuteWS("~ErrorQuestionWS.questionErrorUserByUserId", { userId: _stuUserId, correceBase: json_errorq.$ddlIncorreceBase.val(), startDate: _startDate, endDate: _endDate, userExtend: get_simpleUser() }, function (r) {

                json_errorq.errorQuestions = r;
                json_errorq.questionIds = r ? r.select("questionId") : [];
                bindErrQuestionsPagination();

            }, null, null)
        }
    }


}
var tpageSize = 10;
function bindErrQuestionsPagination() {
    //if (json_errorq.questionIds == null || json_errorq.questionIds.length == 0) {
    //    json_errorq.$divErrQuestionList.html('<div style="color:#888;">没有错题信息。</div>');
    //    json_errorq.$divErrQuestionList.hideLoading();
    //    //return;
    //}
    
    $("div.errquestionslist div.pagination").html("").pagination(json_errorq.questionIds.length, {
        num_edge_entries: 2,
        num_display_entries: 5,
        items_per_page: tpageSize,
        prev_text: "上一页",
        next_text: "下一页",
        callback: function (page_index, o) {
            if (json_errorq.questionIds == null || json_errorq.questionIds.length == 0) {
                json_errorq.$divErrQuestionList.html('<div style="color:#888;">没有错题信息。</div>');
                json_errorq.$divErrQuestionList.hideLoading();
                return;
            }
            var _startPos = page_index * tpageSize;
            var _endPos = _startPos + (tpageSize - 1);
            var _questionIds = getIdsArray(json_errorq.questionIds, _startPos, _endPos);
            //json_errorq.$divErrQuestionList.showLoading();
            $excuteWS("~TestWS.getQuestionByQuestionIds", { questionIds: _questionIds, simpleUser: get_simpleUser() }, function (r) {
                var htmlArray = new Array();
                if (r) {
                    htmlArray.push('<table class="questioninfo" cellpadding="5" cellspacing="0">');
                    var bianhao = page_index * tpageSize;
                    for (var i = 0; i < r.length; i++) {
                        bianhao++;
                        htmlArray.push('<tr questionid="' + r[i].id + '">');
                        htmlArray.push('<td class="td"><img class="arrowimg" src="../Images/arrowr_right.png" alt=""></td>');
                        htmlArray.push('<td class="bianhao td">' + bianhao + '、</td>');
                        htmlArray.push('<td class="td"><div class="questionbody">' + r[i].content + '</div><div class="answers_solution"></div></td>');
                        var errq = json_errorq.errorQuestions.firstOrDefault("questionId", r[i].id);
                        htmlArray.push('<td class="td" style="width:130px;text-align:center;vertical-align:top;">正确率：' + errq.correctNum + '/' + errq.countNum + '=' + accMul(Math_Round(accDiv(errq.correctNum, errq.countNum), 2), 100) + '%</td>');
                        htmlArray.push('</tr>');
                    }
                    htmlArray.push('<table>');
                    json_errorq.$divErrQuestionList.html(htmlArray.join(''));
                    json_errorq.$divErrQuestionList.find("table.questioninfo tr[questionid]").click(function () {
                        var $this = $(this);
                        var _questionId = $this.attr("questionid");
                        var $answers_solution = $this.find("div.answers_solution");
                        var $img = $this.find("td img.arrowimg");
                        if ($answers_solution.attr("as_questionid") == _questionId) {
                            if ($answers_solution.is(":visible")) {
                                $answers_solution.hide();
                                $img.attr("src", "../Images/arrowr_right.png")
                                $this.css({ "background-color": "" });
                            } else {
                                $answers_solution.show();
                                $img.attr("src", "../Images/arrowr_down.png")
                                $this.css({ "background-color": "rgb(235, 255, 234)" });
                            }
                            return;
                        }
                        $answers_solution.attr("as_questionid", _questionId);
                        var question = r.firstOrDefault("id", _questionId);
                        $img.attr("src", "../Images/arrowr_down.png");
                        $this.css({ "background-color": "rgb(235, 255, 234)" });

                        var _qpvSeedId = question.qpvSeedId;
                        $excuteWS("~TestWS.getReferenceAnswersList", { questionId: _questionId, qpvSeedId: _qpvSeedId, userExtend: get_simpleUser() }, function (r2) {
                            if (r2) {
                                $('<div reference_questionid="' + _questionId + '"><div><b>答案：</b></div>' + new Question({ data: { question: question, answers: r2, testerAnswers: null } }).getAnswerCView() + '</div>').appendTo($answers_solution);

                                if (question.solution != null && $.trim(question.solution) != "") {
                                    $('<div solution_questionid="' + _questionId + '"><div><b>解决方案：</b></div><div>' + question.solution + '</div></div>').appendTo($answers_solution);
                                }
                            }
                        }, null, null);
                    });
                }
                json_errorq.$divErrQuestionList.hideLoading();
            }, null, null);
        }
    });
}
