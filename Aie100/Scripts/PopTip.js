var Cmm_simpleUser = {};
var Cmm_json_qustions = null;
function onImgPopMsgClick(o) {
    Cmm_json_qustions = null;
    if (typeof simpleUser == "undefined") {
        if (typeof SimpleUser == "function" && typeof get_simpleUser() == "object") {
            Cmm_simpleUser = get_simpleUser();
        } else {
            Cmm_simpleUser = SimpleUser;
        }
    } else {
        Cmm_simpleUser = simpleUser;
    }
    if (typeof Cmm_onImagePopMessageClick != "undefined") {
        Cmm_onImagePopMessageClick(o);
    }
}

function Cmm_onImagePopMessageClick(a) {


    var $a = $(a);
    var ltitle = "";
    var imglen = $a.find("img[icon=1]").length;
    if (imglen == 1) {
        //ltitle = '<img src="../Images/image.png" alt=""/>'
        if ($a.attr("type") == "text") {
            ltitle = "<span style='color:blue;'>[ 文本 ]</span>";
        } else if ($a.attr("type") == "lo") {
            ltitle = "<span style='color:blue;'>[ 知识点 ]</span>";
        } else if ($a.attr("type") == "reference") {
            ltitle = "<span style='color:blue;'>[ 资源 ]</span>";
        } else if ($a.attr("type") == "question") {
            ltitle = "<span style='color:blue;'>[ 题 ]</span>";
        }
    } else {
        ltitle = $a.text();
    }
    if ($("#cmm_popMsgContainer").length != 0) {

        var tbHtmlArray = new Array();
        if ($a.attr("type") == "text") {
            tbHtmlArray.push('<tr tabTitleFlag="true" onclick="Cmm_onTabTitleTrClick(this)" type="' + $a.attr("type") + '" text="' + $a.attr("text") + '" style="background-image:url(../CMS/Images/wunderbar_rest.gif);background-repeat:repeat-x;cursor:pointer;">');
            tbHtmlArray.push('<td style="border-bottom:1px solid #fff;font-size:12px;padding:5px;"><div instruction="' + $a.attr("text") + '" stext="' + $a.text() + '" style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;width:230px">' + ltitle + '</div></td><td style="width:16px;border-bottom:1px solid #fff"><img onclick="Cmm_onTabTitleCloseClick(this,event)" title="关闭" src="../Images/close3.gif" /></td>');
            tbHtmlArray.push('</tr>');

        } else if ($a.attr("type") == "lo") {

            tbHtmlArray.push('<tr tabTitleFlag="true" onclick="Cmm_onTabTitleTrClick(this)" type="' + $a.attr("type") + '" loarray="' + $a.attr("loarray") + '" style="background-image:url(../CMS/Images/wunderbar_rest.gif);background-repeat:repeat-x;cursor:pointer;">');
            tbHtmlArray.push('<td style="border-bottom:1px solid #fff;font-size:12px;padding:5px;"><div instruction="' + $a.attr("text") + '" stext="' + $a.text() + '" style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;width:230px">' + ltitle + '</div></td><td style="width:16px;border-bottom:1px solid #fff"><img onclick="Cmm_onTabTitleCloseClick(this,event)" title="关闭" src="../Images/close3.gif" /></td>');
            tbHtmlArray.push('</tr>');

        } else if ($a.attr("type") == "reference") {

            tbHtmlArray.push('<tr tabTitleFlag="true" onclick="Cmm_onTabTitleTrClick(this)" type="' + $a.attr("type") + '" referencearray="' + $a.attr("referencearray") + '" style="background-image:url(../CMS/Images/wunderbar_rest.gif);background-repeat:repeat-x;cursor:pointer;">');
            tbHtmlArray.push('<td style="border-bottom:1px solid #fff;font-size:12px;padding:5px;"><div instruction="' + $a.attr("text") + '" stext="' + $a.text() + '" style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;width:230px">' + ltitle + '</div></td><td style="width:16px;border-bottom:1px solid #fff"><img onclick="Cmm_onTabTitleCloseClick(this,event)" title="关闭" src="../Images/close3.gif" /></td>');
            tbHtmlArray.push('</tr>');

        } else if ($a.attr("type") == "question") {

            tbHtmlArray.push('<tr tabTitleFlag="true" onclick="Cmm_onTabTitleTrClick(this)" type="' + $a.attr("type") + '" questionarray="' + $a.attr("questionarray") + '" style="background-image:url(../CMS/Images/wunderbar_rest.gif);background-repeat:repeat-x;cursor:pointer;">');
            tbHtmlArray.push('<td style="border-bottom:1px solid #fff;font-size:12px;padding:5px;"><div instruction="' + $a.attr("text") + '" stext="' + $a.text() + '" style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;width:230px">' + ltitle + '</div></td><td style="width:16px;border-bottom:1px solid #fff"><img onclick="Cmm_onTabTitleCloseClick(this,event)" title="关闭" src="../Images/close3.gif" /></td>');
            tbHtmlArray.push('</tr>');

        }
        if (tbHtmlArray != null && tbHtmlArray.length != 0) {

            var $tr1 = $(tbHtmlArray.join(''));
            $tr1.appendTo($("#cmm_tabTitleContainer").find("table"));
            $tr1.trigger("click");
        }

        $("#cmm_tabTitleContainer").find("img[onclick='Cmm_onTabTitleCloseClick(this,event)']").show();
        return;
    }

    var _title = "";
    var htmlArray = new Array();
    htmlArray.push('<div id="cmm_popMsgContainer">');
    htmlArray.push('<table width="100%" border="0" style="border:1px solid rgb(215,215,215);" cellpadding="0" cellspacing="0">');
    htmlArray.push('<tr>');
    htmlArray.push('<td style="vertical-align:top;width:250px;padding:1px 1px 0px 1px;">');
    htmlArray.push('<div id="cmm_tabTitleContainer" style="height:450px;overflow:auto;">');
    htmlArray.push('<table width="100%" cellpadding="0" cellspacing="0">');
    if ($a.attr("type") == "text") {
        _title = "文本";
        htmlArray.push('<tr tabTitleFlag="true" onclick="Cmm_onTabTitleTrClick(this)" type="' + $a.attr("type") + '" text="' + $a.attr("text") + '" style="background-image:url(../CMS/Images/wunderbar_rest.gif);background-repeat:repeat-x;cursor:pointer;">');
        htmlArray.push('<td style="border-bottom:1px solid #fff;font-size:12px;padding:5px;"><div instruction="' + $a.attr("text") + '" stext="' + $a.text() + '" style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;width:230px">' + ltitle + '</div></td><td style="width:16px;border-bottom:1px solid #fff"><img onclick="Cmm_onTabTitleCloseClick(this,event)" style="display:none;" title="关闭" src="../Images/close3.gif" /></td>');
        htmlArray.push('</tr>');
    } else if ($a.attr("type") == "lo") {
        _title = "知识点";
        htmlArray.push('<tr tabTitleFlag="true" onclick="Cmm_onTabTitleTrClick(this)" type="' + $a.attr("type") + '" loarray="' + $a.attr("loarray") + '" style="background-image:url(../CMS/Images/wunderbar_rest.gif);background-repeat:repeat-x;cursor:pointer;">');
        htmlArray.push('<td style="border-bottom:1px solid #fff;font-size:12px;padding:5px;"><div instruction="' + $a.attr("text") + '" stext="' + $a.text() + '" style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;width:230px">' + ltitle + '</div></td><td style="width:16px;border-bottom:1px solid #fff"><img onclick="Cmm_onTabTitleCloseClick(this,event)" style="display:none;" title="关闭" src="../Images/close3.gif" /></td>');
        htmlArray.push('</tr>');
    } else if ($a.attr("type") == "reference") {
        _title = "学习资源";
        htmlArray.push('<tr tabTitleFlag="true" onclick="Cmm_onTabTitleTrClick(this)" type="' + $a.attr("type") + '" referencearray="' + $a.attr("referencearray") + '" style="background-image:url(../CMS/Images/wunderbar_rest.gif);background-repeat:repeat-x;cursor:pointer;">');
        htmlArray.push('<td style="border-bottom:1px solid #fff;font-size:12px;padding:5px;"><div instruction="' + $a.attr("text") + '" stext="' + $a.text() + '" style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;width:230px">' + ltitle + '</div></td><td style="width:16px;border-bottom:1px solid #fff"><img onclick="Cmm_onTabTitleCloseClick(this,event)" style="display:none;" title="关闭" src="../Images/close3.gif" /></td>');
        htmlArray.push('</tr>');
    } else if ($a.attr("type") == "question") {
        _title = "题";
        htmlArray.push('<tr tabTitleFlag="true" onclick="Cmm_onTabTitleTrClick(this)" type="' + $a.attr("type") + '" questionarray="' + $a.attr("questionarray") + '" style="background-image:url(../CMS/Images/wunderbar_rest.gif);background-repeat:repeat-x;cursor:pointer;">');
        htmlArray.push('<td style="border-bottom:1px solid #fff;font-size:12px;padding:5px;"><div instruction="' + $a.attr("text") + '" stext="' + $a.text() + '" style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;width:230px">' + ltitle + '</div></td><td style="width:16px;border-bottom:1px solid #fff"><img onclick="Cmm_onTabTitleCloseClick(this,event)" style="display:none;" title="关闭" src="../Images/close3.gif" /></td>');
        htmlArray.push('</tr>');
    } else {
        htmlArray.push('<tr style="background-image:url(../CMS/Images/wunderbar_rest.gif);background-repeat:repeat-x;cursor:pointer;">');
        htmlArray.push('<td style="border-bottom:1px solid #fff;font-size:12px;padding:5px;"><div instruction="' + $a.attr("text") + '" stext="' + $a.text() + '" style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;width:230px">' + ltitle + '</div></td><td style="width:16px;border-bottom:1px solid #fff"><img onclick="Cmm_onTabTitleCloseClick(this,event)" style="display:none;" title="关闭" src="../Images/close3.gif" /></td>');
        htmlArray.push('</tr>');
    }
    htmlArray.push('</table>');

    htmlArray.push('</div>');
    htmlArray.push('</td>');
    htmlArray.push('<td style="vertical-align:top;">');
    htmlArray.push('<div id="cmm_popMsgContent" style="padding:3px;line-height:18px;">加载中...</div>');
    htmlArray.push('</td>');
    htmlArray.push('</tr>');
    htmlArray.push('</table>');
    htmlArray.push('</div>');

    $.jBox(htmlArray.join(''), { width: 1000,  title: _title, dragLimit: false, zIndex: 10000, buttons: { "关闭": true} });

    $("#cmm_tabTitleContainer").find("tr[tabTitleFlag=true][type]").trigger("click");
}

function Cmm_onTabTitleTrClick(o) {

    var $a = $(o);
    var $div = $a.find("div[stext]");
    var stext = $div.attr("stext");
    var instruction = $div.attr("instruction");
    if (instruction == "undefined") {
        instruction = "";
    }
    if ($a.attr("type") == "text") {
        if ($a.attr("text") != undefined && $.trim($a.attr("text")) != "") {
            $("#cmm_popMsgContent").html(Cmm_getPopMsgContent({ index: 0, length: 1, contentId: "", stext: stext, instruction: null, title: "", content: $a.attr("text") }));
        } else {
            $("#cmm_popMsgContent").html('没有数据信息');
        }
    } else if ($a.attr("type") == "lo") {
        var loarray = $a.attr("loarray");
        if ($.trim(loarray) != "") {
            var loIdArray = new Array();
            if (loarray.indexOf(",") != -1) {
                loIdArray = loarray.split(",");
            } else {
                loIdArray.push(loarray);
            }

            $excuteWS("~CmsWS.getLearningObjectiveForLoIds", { loIds: loIdArray, userExtend: Cmm_simpleUser }, function (r1) {
                if (r1 && r1.length != 0) {
                    var contentArray = new Array();
                    for (var m = 0; m < r1.length; m++) {
                        contentArray.push(Cmm_getPopMsgContent({ index: m, length: r1.length, contentId: r1[m].itemId, stext: stext, instruction: instruction, title: r1[m].unit + "&nbsp;" + r1[m].name, content: r1[m].description }));
                    }
                    $("#cmm_popMsgContent").html("<div cmmloarray='" + $a.attr("loarray") + "'>" + contentArray.join('') + "</div>");
                } else {
                    $("#cmm_popMsgContent").html('没有数据信息');
                }
            }, null, { userContext: "getStudyItemWithLoIds" });
        }
    } else if ($a.attr("type") == "reference") {
        var referencearray = $a.attr("referencearray");

        if ($.trim(referencearray) != "") {
            var referenceIdArray = new Array();
            if (referencearray.indexOf(",") != -1) {
                referenceIdArray = referencearray.split(",");
            } else {
                referenceIdArray.push(referencearray);
            }

            $excuteWS("~CmsWS.getStudyReferenceByIdsList", { ids: referenceIdArray, userExtend: Cmm_simpleUser }, function (r2) {
                if (r2 && r2.length != 0) {
                    var contentArray2 = new Array();
                    for (var n = 0; n < r2.length; n++) {
                        var c = "";
                        if (r2[n].embedCode != null && r2[n].embedCode.toLowerCase().indexOf("iframe") != -1) {
                            c = r2[n].embedCode.replace(/<iframe /gi, '<iframe multimedia="1" ');
                        } else {
                            c = r2[n].content;
                        }
                        contentArray2.push(Cmm_getPopMsgContent({ index: n, length: r2.length, contentId: r2[n].id, stext: stext, instruction: instruction, title: r2[n].title, content: c }));
                    }
                    $("#cmm_popMsgContent").html(contentArray2.join('')).find("iframe[multimedia=1]").css({ "width": "725px", "height": "390px" });

                } else {
                    $("#cmm_popMsgContent").html('没有数据信息');
                }
            }, null, { userContext: "getStudyReferenceByIdsList" });
        }

    } else if ($a.attr("type") == "question") {
        var questionarray = $a.attr("questionarray");
        if ($.trim(questionarray) != "") {
            var questionIdArray = new Array();
            if (questionarray.indexOf(",") != -1) {
                questionIdArray = questionarray.split(",");
            } else {
                questionIdArray.push(questionarray);
            }
            $excuteWS("~TestWS.getQuestionByQuestionIds", { questionIds: questionIdArray, simpleUser: Cmm_simpleUser }, function (r1) {
                if (r1 && r1.length != 0) {
                    Cmm_json_qustions = { questionArray: r1, questionIds: questionIdArray, stext: stext, instruction: instruction,index:0 };
                    Cmm_getPopMsgInfo();
                } else {
                    $("#cmm_popMsgContent").html('没有数据信息');
                }
            }, null, { userContext: "getQuestionByQuestionIds" });
        }
    }

    $("#cmm_tabTitleContainer").find("tr[tabTitleFlag=true][type]").css("background-image", "url(../CMS/Images/wunderbar_rest.gif)");
    $a.css("background-image", "url(../CMS/Images/wunderbar_sel.gif)");
}



function Cmm_onTabTitleCloseClick(o, event) {

    var $tr2 = $("#cmm_tabTitleContainer").find("tr[tabTitleFlag=true][type]");
    $("#cmm_tabTitleContainer").find("img[onclick='Cmm_onTabTitleCloseClick(this,event)']").show();
    var $tr = $(o).parent().parent();
    if ($tr2.length > 1) {
        $tr.remove();
        $("#cmm_popMsgContent").children().remove();
        $tr2 = $("#cmm_tabTitleContainer").find("tr[tabTitleFlag=true][type]");
        if ($tr2.length == 1) {
            $("#cmm_tabTitleContainer").find("img[onclick='Cmm_onTabTitleCloseClick(this,event)']").hide();
        }
    }
    if (event.stopPropagation)
    { event.stopPropagation(); }
    else {
        event.cancelBubble = true;
    }

    if ($tr2.length > 0) {
        if ($tr2.length - 2 >= 0) {
            $tr2.filter(":eq(" + ($tr2.length - 1) + ")").trigger("click");
        } else {
            $tr2.filter(":eq(0)").trigger("click");
        }
    }
}

function Cmm_getPopMsgInfo(v) {
    if (Cmm_json_qustions == null) {
        return;
    }
    var $o = $("#cmm_popMsgContent");
    var $qArr = $o.find("div[cmmquestionarray]");
    if ($qArr.length != 0) {
        Cmm_json_qustions.index=Cmm_json_qustions.index + v;
    }
    var question = Cmm_json_qustions.questionArray[Cmm_json_qustions.index];
    var questionIds = Cmm_json_qustions.questionIds;
    var stext = Cmm_json_qustions.stext;
    var instruction = Cmm_json_qustions.instruction;
    var qlen = Cmm_json_qustions.questionArray.length;
    var content = question.content;
    var solution = question.solution;
    var html = '<div>' + content + '</div>'
                + '<div id="pt_rfc_' + question.id + '"><span class="nodata" style="color:red;font-size:11px;">参考答案加载中...</span></div>'
                + '<div style="font-weight:bold;margin-top:15px;">解决方案：</div>'
                + '<div>' + solution + '</div>';
   
    var contentHTML = Cmm_getPopMsgContent({ index: Cmm_json_qustions.index, length: qlen, contentId: question.id, stext: stext, instruction: instruction, title: question.title, content: html });
   
    if ($qArr.length != 0) {
        $(contentHTML).appendTo($qArr);
    } else {
        $o.html("<div cmmquestionarray='" + questionIds + "'>" + contentHTML + "</div>");
    }

    if ($("#pt_rfc_" + question.id + " span.nodata").length != 0) {
        $excuteWS("~TestWS.getReferenceAnswersList", { questionId: question.id, qpvSeedId: question.qpvSeedId, userExtend: Cmm_simpleUser }, function (r) {
            if (r) {
                $("#pt_rfc_" + question.id).html(Cmm_getAnswer(null, 1, question, r));
            } else {
                $("#pt_rfc_" + question.id).remove();
            }
        }, null, { userContext: "getReferenceAnswersList" });
    }
}

function Cmm_getAnswer(c, p, question, answers) {
    /// <summary>只返回question的answer,c为容器的jquery对象或js对象，或容器id</summary>

    var o = { question_group: Math.random().toString().replace("0.", "") };

    var str = "";
    var kgflag = false;

    switch (question.questionTypeId) {
        case "1": //单选题
        case "3": //判断题
            if (typeof p == "number") {
                if (p == 1 || p == 2 || p == 6 || p == 7) {
                    str = ' disabled="disabled" type="radio" name="radioGroup_' + o.question_group + '" ';
                } else if (p == 3 || p == 5) {

                    str = ' type="radio" name="radioGroup_' + o.question_group + '" ';
                }

            } else {
                str = ' type="radio" name="radioGroup_' + o.question_group + '" ';
            }

            kgflag = true;
            break;
        case "2": //多项选择题
            if (typeof p == "number") {
                if (p == 1 || p == 2 || p == 6 || p == 7) {
                    str = ' disabled="disabled" type="checkbox" ';
                } else if (p == 3 || p == 5) {
                    str = ' type="checkbox" ';
                }

            } else {
                str = ' type="checkbox" ';
            }
            kgflag = true;
            break;
        case "4": //填空题

            break;
        case "5": //子母题

            break;
        case "11": //问答题

            break;
        default:
            break;
    }

    var answerArray = [];
    if (kgflag) {//单选题,判断题,多项选择题

        if (answers && answers.length > 0) {
            var _answers = answers;
            answerArray.push('<table cellpadding="2" cellspacing="0" border="0">');
            for (var i = 0; i < _answers.length; i++) {
                answerArray.push('<tr class="tr_kgt">');
                var ck = "";
                if (typeof p == "number") {
                    if ((p != 5 && p != 6) && _answers[i].correctFlag == 1) {
                        ck = ' checked="checked" ';
                    }
                    //else if (p == 5 || p == 6) {
                    //    var testerAnswers = o.data.testerAnswers;
                    //    if (testerAnswers) {
                    //        for (var n = 0; n < testerAnswers.length; n++) {
                    //            if (testerAnswers[n].content == _answers[i].id) {
                    //                ck = ' checked="checked" ';
                    //                break;
                    //            }
                    //        }
                    //    }
                    //}

                }
                if (p == 4) {
                    answerArray.push('<td class="input_answer_select" style="vertical-align: top; line-height: 25px; width: 40px;padding-right:0px;">' + (question.questionTypeId != "3" ? (String.fromCharCode(i + 65) + ".") : "") + '</td>');
                } else {
                    answerArray.push('<td class="input_answer_select" style="vertical-align: top; line-height: 25px; width: 40px;padding-right:0px;"><label for="rd_' + question.id + "_" + _answers[i].id + '" style="display:block;width:100%;margin-right:0px;"><input ' + str + ck + ' class="answer_select" questionid="' + question.id + '"  value="' + _answers[i].id + '" id="rd_' + question.id + "_" + _answers[i].id + '"/>' + (question.questionTypeId != "3" ? (String.fromCharCode(i + 65) + ".") : "") + '</label></td>');
                }

                answerArray.push('<td class="answer_content" style="vertical-align: top; line-height: 25px;"><label for="rd_' + question.id + "_" + _answers[i].id + '">' + _answers[i].content + '</label></td>');
                answerArray.push('</tr>');
            }
            answerArray.push('</table>');
        }

    } else {

        if (p == 2) {
            var canswer = this.getCorrectAnswer(c);
            if (canswer.replace(/\s|　|&nbsp(;)?/gi, "") != "") {
                //answerArray.push("<div>答案：</div><br/>" + canswer);
                answerArray.push(canswer);
            }
        }
        //else if (p == 5) {
        //    var testerAnswers2 = o.data.testerAnswers;
        //    answerArray.push('<div questionid="' + o.data.question.id + '" title="点击这里编辑答案" class="zg_tester_answer">' + (testerAnswers2 && testerAnswers2.length > 0 ? testerAnswers2[0].content : "&nbsp;") + '</div>');
        //} else if (p == 6) {

        //    var testerAnswers2 = o.data.testerAnswers;
        //    answerArray.push('<div class="zg_tester_answer">' + (testerAnswers2 && testerAnswers2.length > 0 ? testerAnswers2[0].content : "&nbsp;") + '</div>');
        //}
    }

    if (!c) {
        var $div = $("<div>" + answerArray.join('') + "</div>");
        if (kgflag) {
            $div.find("p").each(function () {
                var $this = $(this);
                if ($this.find("img,table").length == 0 && $.trim($this.text()) == "") {
                    $this.remove();
                }
            });
        }

        $div.find("table tr td:empty").html("&nbsp;");
        return $div.html();
    } else {
        var container = this.toJQueryObject(c);
        container.html(answerArray.join(''));
        if (kgflag) {
            container.find("p").each(function () {
                var $this = $(this);
                if ($this.find("img,table").length == 0 && $.trim($this.text()) == "") {
                    $this.remove();
                }
            });
        }
        container.find("table tr td:empty").html("&nbsp;");
        if (kgflag) {

            if (typeof o.on_answer_selected == "function" && !o.answer_sevt_flag) {
                o.answer_sevt_flag = true;
                container.find("input[class=answer_select]").click(function () {
                    o.current = this;
                    (o.on_answer_selected)();
                })
            }
        }
    }

}
function Cmm_getPopMsgContent(o) {

    var htmlArray = new Array();
    var displayStr = o.index == 0 ? "" : " style='display:none' ";
    htmlArray.push('<div contentid = "cmm_content_' + o.contentId + '" ' + displayStr + '>');
    if (o.stext != null && o.stext != "" && $.trim(o.stext) != "null") {
        htmlArray.push('<div style="text-align:center;font-size:15px;font-weight:bold;background-color:rgb(238,238,238);padding:5px;color:rgb(254,180,72);margin-bottom:5px;">');
        htmlArray.push(o.stext);
        htmlArray.push('</div>');
    }
    htmlArray.push('<div style="height:408px;border:1px solid rgb(215,215,215);overflow:auto;padding:5px;">');
    if (o.instruction != null && o.instruction != "" && $.trim(o.instruction) != "null") {
        htmlArray.push('<div style="color: rgb(254,180,72);">' + o.instruction + '</div>');
    }

    if (o.title != null && o.title != "" && $.trim(o.title) != "null") {
        htmlArray.push('<div style="font-size:14px;font-weight:bold;"><center>' + o.title + '</center></div>');
    }
    htmlArray.push('<div style="margin-bottom:10px;font-size:13px">');
    htmlArray.push(o.content);
    htmlArray.push('</div>');

    htmlArray.push('</div>');
    if (o.length > 1) {
        if (o.index + 1 < o.length) {
            if (o.index == 0) {
                htmlArray.push('<div><center><input type="button" value="上一个"  disabled="disabled" onclick="Cmm_onViewContentClick(\'' + o.contentId + '\',-1)"/>&nbsp;<input type="button" value="下一个"  onclick="Cmm_onViewContentClick(\'' + o.contentId + '\',1)"/></center></div>');
            } else {
                htmlArray.push('<div><center><input type="button" value="上一个"  onclick="Cmm_onViewContentClick(\'' + o.contentId + '\',-1)"/>&nbsp;<input type="button" value="下一个"  onclick="Cmm_onViewContentClick(\'' + o.contentId + '\',1)"/></center></div>');
            }
        } else if (o.index + 1 == o.length) {
            htmlArray.push('<div><center><input type="button" value="上一个"  onclick="Cmm_onViewContentClick(\'' + o.contentId + '\',-1)"/>&nbsp;<input type="button" value="下一个" disabled="disabled" onclick="Cmm_onViewContentClick(\'' + o.contentId + '\',1)"/></center></div>');
        }
    }
    htmlArray.push('</div>');
    return htmlArray.join('');
}

function Cmm_onViewContentClick(contentId, status) {

    $("#cmm_popMsgContent").find("div[contentid]").hide();
    if (status == -1) {
       // Cmm_getPopMsgInfo(-1);
        $("#cmm_popMsgContent").find("div[contentid='cmm_content_" + contentId + "']").prev().show();
    } else if (status == 1) {
        var $c = $("#cmm_popMsgContent").find("div[contentid='cmm_content_" + contentId + "']").next();
        if ($c.length == 0) {
            Cmm_getPopMsgInfo(1);
        }
        $("#cmm_popMsgContent").find("div[contentid='cmm_content_" + contentId + "']").next().show();
        
    }

}
