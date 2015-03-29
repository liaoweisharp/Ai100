//注意content里的每一块区域是一个div 且样式为les_tab_sma_box；即：<div class="les_tab_sma_box">
function $initTabs(data) {
    var containerId = data.containerId;
    var tabTitles = data.tabTitles;
    var content = data.content;
    var container = document.getElementById(containerId);
    if (container == null) {

        alert("error");
        return;
    }

    if (tabTitles == null || tabTitles.length == 0) {
        container.innerHTML = "No results found.";
        return;
    }
    var tabHTMLArray = new Array();
    tabHTMLArray.push('<div>'); //1
    //tabHTMLArray.push('<ul style="width:100%">');
    if (data.haveBgFlag) {
        tabHTMLArray.push('<div class="les_tab_sm">'); //3
    } else {
        tabHTMLArray.push('<div class="les_tab_sm1">'); //3
    }

    for (var h = 0; h < tabTitles.length; h++) {
        if (h == 0) {
            tabHTMLArray.push('<ul ulTitle="tabTitle" class="les_tab_sma_sl"><div class="tabTitleClass" style="padding:3px;">' + tabTitles[h] + '</div></ul>');
        } else {
            tabHTMLArray.push('<ul ulTitle="tabTitle" style="margin-left:4px;" class="les_tab_sma"><div class="tabTitleClass" style="padding:3px;">' + tabTitles[h] + '</div></ul>');
        }
    }
    tabHTMLArray.push('</div>'); //3
    tabHTMLArray.push('<div>'); //2
    tabHTMLArray.push(content);
    tabHTMLArray.push('</div>'); //2
    tabHTMLArray.push('</div>'); //1

    container.innerHTML = tabHTMLArray.join('');
    var $rootContainer = $(container);
    var $referenceContent = $rootContainer.find("div[class=les_tab_sma_box]");
    $referenceContent.hide();
    $referenceContent.filter(":eq(0)").show();
    var $ulTabTitle = $rootContainer.find("ul[ulTitle=tabTitle]");
    $ulTabTitle.each(function (index) {
        var $this = $(this);
        $this.click(function () {
            $ulTabTitle.filter("[class=les_tab_sma_sl]").attr("class", "les_tab_sma");
            $this.attr("class", "les_tab_sma_sl");
            $referenceContent.hide();
            $referenceContent.filter(":eq(" + index + ")").show();
        });
    });

}
function DelConfirm() {
    return confirm('确认要删除此行信息吗？');
}
//function createRadio(name,id,value,isChecked)
//{
//    var oRadio = null;
//    if(navigator.userAgent.indexOf("MSIE")>0)//微软的IE
//    {
//        oRadio = document.createElement("<input name='" + name + (isChecked ? "' checked='"+ isChecked +"'/>" : "' />"));
//        oRadio.id = id;
//        oRadio.type = "radio";
//        oRadio.value = value;
//    }
//    else//微软以外的浏览器
//    {
//        oRadio = document.createElement("input");
//        oRadio.setAttribute("type","radio");
//        oRadio.setAttribute("id",id);
//        oRadio.setAttribute("name",name);
//        oRadio.setAttribute("value",value);
//        if(isChecked)
//        {
//            oRadio.setAttribute("checked",isChecked);
//        }        
//    }
//    return oRadio;
//}
function BtnClick(btn) {
    if (document.all(btn).disabled) {
        return;
    }
    window.msgbox('正在处理数据，请稍候...');
    document.all(btn).click();
}

function BtnDeleteClick(btn) {
    if (document.all(btn).disabled) {
        return;
    }
    document.all(btn).click();
}

var oldLink = null;
// code to change the active stylesheet
function setActiveStyleSheet(link, title) {
    var i, a, main;
    for (i = 0; (a = document.getElementsByTagName("link")[i]); i++) {
        if (a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
            a.disabled = true;
            if (a.getAttribute("title") == title) a.disabled = false;
        }
    }
    if (oldLink) oldLink.style.fontWeight = 'normal';
    oldLink = link;
    link.style.fontWeight = 'bold';
    return false;
}

// This function gets called when the end-user clicks on some date.
function selected(cal, date) {
    cal.sel.value = date; // just update the date in the input field.
    if (cal.dateClicked && (cal.sel.id == "sel1" || cal.sel.id == "sel3"))
    // if we add this call we close the calendar on single-click.
    // just to exemplify both cases, we are using this only for the 1st
    // and the 3rd field, while 2nd and 4th will still require double-click.
        cal.callCloseHandler();
}

// And this gets called when the end-user clicks on the _selected_ date,
// or clicks on the "Close" button.  It just hides the calendar without
// destroying it.
function closeHandler(cal) {
    cal.hide();                        // hide the calendar
    //  cal.destroy();
    _dynarch_popupCalendar = null;
}

// This function shows the calendar under the element having the given id.
// It takes care of catching "mousedown" signals on document and hiding the
// calendar if the click was outside.
function showCalendar(id, format, showsTime, showsOtherMonths) {
    var el = document.getElementById(id);
    if (el.disabled) {
        return false;
    }
    if (_dynarch_popupCalendar != null) {
        // we already have some calendar created
        _dynarch_popupCalendar.hide();                 // so we hide it first.
    } else {
        // first-time call, create the calendar.
        var cal = new Calendar(1, null, selected, closeHandler);
        // uncomment the following line to hide the week numbers
        // cal.weekNumbers = false;
        if (typeof showsTime == "string") {
            cal.showsTime = true;
            cal.time24 = (showsTime == "24");
        }
        if (showsOtherMonths) {
            cal.showsOtherMonths = true;
        }
        _dynarch_popupCalendar = cal;                  // remember it in the global var
        cal.setRange(1900, 2070);        // min/max year allowed.
        cal.create();
    }
    _dynarch_popupCalendar.setDateFormat(format);    // set the specified date format
    _dynarch_popupCalendar.parseDate(el.value);      // try to parse the text in field
    _dynarch_popupCalendar.sel = el;                 // inform it what input field we use

    // the reference element that we pass to showAtElement is the button that
    // triggers the calendar.  In this example we align the calendar bottom-right
    // to the button.
    _dynarch_popupCalendar.showAtElement(el.nextSibling, "Br");        // show the calendar
    return false;
}

var MINUTE = 60 * 1000;
var HOUR = 60 * MINUTE;
var DAY = 24 * HOUR;
var WEEK = 7 * DAY;

// If this handler returns true then the "date" given as
// parameter will be disabled.  In this example we enable
// only days within a range of 10 days from the current
// date.
// You can use the functions date.getFullYear() -- returns the year
// as 4 digit number, date.getMonth() -- returns the month as 0..11,
// and date.getDate() -- returns the date of the month as 1..31, to
// make heavy calculations here.  However, beware that this function
// should be very fast, as it is called for each day in a month when
// the calendar is (re)constructed.
function isDisabled(date) {
    var today = new Date();
    return (Math.abs(date.getTime() - today.getTime()) / DAY) > 10;
}

function flatSelected(cal, date) {
    var el = document.getElementById("preview");
    el.innerHTML = date;
}

function showFlatCalendar() {
    var parent = document.getElementById("display");

    // construct a calendar giving only the "selected" handler.
    var cal = new Calendar(0, null, flatSelected);

    // hide week numbers
    cal.weekNumbers = false;

    // We want some dates to be disabled; see function isDisabled above
    cal.setDisabledHandler(isDisabled);
    cal.setDateFormat("%A, %B %e");

    // this call must be the last as it might use data initialized above; if
    // we specify a parent, as opposite to the "showCalendar" function above,
    // then we create a flat calendar -- not popup.  Hidden, though, but...
    cal.create(parent);

    // ... we can show it here.
    cal.show();
}

function getScoreChange(score) {

    var ScoreChangeStr = "";
    var ScoreChange = 0.00;
    if (score != null && score != "--") {
        ScoreChange = Number(score);
        if (ScoreChange >= 88.00) {
            ScoreChangeStr = "优秀";
        }
        else if (ScoreChange >= 70.00 && ScoreChange < 88.00) {
            ScoreChangeStr = "良好";
        }
        else if (ScoreChange >= 54.00 && ScoreChange < 70.00) {
            ScoreChangeStr = "较好";
        }
        else if (ScoreChange >= 40.00 && ScoreChange < 54.00) {
            ScoreChangeStr = "薄弱";
        }
        else if (ScoreChange >= 0.0 && ScoreChange < 40.00) {
            ScoreChangeStr = "较差";
        }
        else {
            ScoreChangeStr = "--";
        }
    }
    else {
        ScoreChangeStr = "--";
    }
    return ScoreChangeStr;
}

//是否是Weak的成绩。（用于Assignment界面的Weak Points）
function isWeakLo(score) {
    var str = getScoreChange(score);
    if (str == "Excellent" || str == "Good") {
        return false;
    }
    else {
        return true;
    }
}
//表示不显示答案。用于考试界面（上一次考试是提交不是保存）
function createAnswerStrForNoCorrectAnswer(answerTypeId, refenceAnswerArray, questionId) {

    return createAnswerStr(answerTypeId, refenceAnswerArray, null, questionId, 1, false)
}
//表示显示正确答案。用于阅卷和查看某个Question的正确答案
function createAnswerStrForCorrectAnswer(answerTypeId, refenceAnswerArray, questionId, isShowFeedBack) {
    return createAnswerStr(answerTypeId, refenceAnswerArray, null, questionId, 2, isShowFeedBack)
}
//表示显示答题者所填内容。用于阅卷和考试界面（上一次考试是保存，不是提交）
function createAnswerStrForTesterAnswer(answerTypeId, refenceAnswerArray, testerAnswerArray, questionId) {
    return createAnswerStr(answerTypeId, refenceAnswerArray, testerAnswerArray, questionId, 3, false)
}
//表示显示答题者所填内容。用于阅卷.
function createAnswerStrForTesterAnswerDisabled(answerTypeId, refenceAnswerArray, testerAnswerArray, questionId)
{
    
    return createAnswerStr(answerTypeId, refenceAnswerArray, testerAnswerArray, questionId, 4, false)
}

//数字题键盘按下若为回车避免刷新页面
function onTxtNumericAnswerKeyDown(evt) {
    if (evt.keyCode == '13') { return false; }
}

//数字题键盘抬起时判断是否为数字
function onTxtNumericAnswerKeyUp(v, o) {
    if (isNaN(v)) { alert('Must be a number!'); o.value = '' }
}
function FeedBackModule_Show(feedBackId) {

    $find("FackBack_ModulePopupBehavior").show();
    var strLoading = "<div style='text-align:center; padding:8px;'><img alt='loading' src='../Images/ajax-loader_02.gif' /></div>";
    $get("divFaceBack").innerHTML = strLoading;
    $get("divFaceBack").innerHTML = $get(feedBackId).innerHTML;
}
//生成答案（包括标明正确答案和不标明正确答案）的Html，线上题。
//answerTypeId:表示答案的类型，类型不一样显示方式不一样，所以生成的Html也就不一样
//refenceAnswerArray:表示正确答案和干扰答案的集合（例：单选、多选...），如果没有则传null（例：填空题，不显示答案）
//questionId:表示questionId,用于绑定到客户端控件。

//displayMode:答案显示的方式（1，2，3，4）。目前有三种显示方式：
// displayMode：1.表示不显示答案。用于考试界面（上一次考试是提交不是保存）
// displayMode：2.表示显示标准正确答案。用于阅卷和查看某个Question的正确答案
// displayMode：3.表示显示答题者所填内容。用于考试界面（上一次考试是保存，不是提交）
// displayMode：4.表示显示答题者所填内容。用于阅卷
function createAnswerStr(answerTypeId, refenceAnswerArray, testerAnswerArray, questionId, displayMode, isShowFeedBack) {

    var str = new Sys.StringBuilder();
    var answerNum = refenceAnswerArray.length; //此题ReferenceAnswers数目
    switch (answerTypeId) {

        case "1":  //单选题

            if (answerNum > 0) {
                str.append("<table cellspacing='0' cellpadding='5'>");
                for (var j = 0; j < answerNum; j++) {
                    var referenceAnswersId = refenceAnswerArray[j].id;
                    var referenceAnswersContent = refenceAnswerArray[j].content;
                    var correctFlag = refenceAnswerArray[j].correctFlag;
                    var feedback = refenceAnswerArray[j].feedback;
                    feedback = feedback == "&nbsp;" ? "" : feedback;
                    str.append("<tr>");
                    if (displayMode == 1) {
                        var radioStr = createRadio(referenceAnswersId, questionId, referenceAnswersContent);
                        str.append(radioStr);
                    }
                    else if (displayMode == 2) {

                        var correctImg = correctFlag == "1" ? "<img alt='Correct Answer' src='../Images/correct.png' />" : "<img alt='' style='visibility:hidden' src='../Images/icon/incorrect.png' />";
                        var isHaveFeedBack = false;
                        var randomString = "";
                        if (isShowFeedBack == true && feedback != null && feedback.trim() != "" && feedback.trim().toLowerCase() != "null") {
                            isHaveFeedBack = true;
                            randomStringId = randomStringFun(30);
                        }
                        if (isHaveFeedBack == true) {
                            str.append(String.format("<td><img alt='Feedback' src='../Images/icon/FeedBack.png' title='Feedback' onclick=\"FeedBackModule_Show('{0}')\"  style='cursor:pointer;'/><span id='{0}' style='display:none;'>{1}</span></td>", randomStringId, feedback));
                        }
                        else {
                            str.append(String.format("<td></td>"));
                        }

                        str.append(String.format("<td>{3}</td><td><input type='radio' value='{0}' disabled='disabled' {1}/> </td><td>{2}</td>", referenceAnswersId, correctFlag == "1" ? "checked='true'" : "", referenceAnswersContent, correctImg));
                    }
                    else if (displayMode == 3)//生成带用户填写答案的Answer
                    {
                        if (testerAnswerArray == null || testerAnswerArray.length == 0 || testerAnswerArray.length > 1)//如果没有数据或者大于一个数据就表明没有答案或者数据错误，尽管如此我们还是显示空答案。
                        {
                            var radioStr = createRadio(referenceAnswersId, questionId, referenceAnswersContent);
                            str.append(radioStr);
                        }
                        else if (testerAnswerArray.length == 1)//对于单选题来说用户填写最多也就是一个记录（答案）
                        {
                            var testerAnswer = testerAnswerArray[0];
                            var testerSelectAnswerId = testerAnswer.content;
                            if (testerSelectAnswerId == referenceAnswersId)//如果id相同则表明这个referenceAnswers是被选中了的。
                            {
                                str.append(String.format("<td><input type='radio' value='{0}' name='{1}' checked='true'/></td> <td>{2}</td>", referenceAnswersId, questionId, referenceAnswersContent));
                            }
                            else {
                                var radioStr = createRadio(referenceAnswersId, questionId, referenceAnswersContent);
                                str.append(radioStr);
                            }
                        }

                    }
                    else if (displayMode == 4)//生成带用户填写答案的Answer,禁用
                    {
                        if (testerAnswerArray == null || testerAnswerArray.length == 0 || testerAnswerArray.length > 1)//如果没有数据或者大于一个数据就表明没有答案或者数据错误，尽管如此我们还是显示空答案。
                        {
                            var radioStr = createRadioForDisabled(referenceAnswersId, questionId, referenceAnswersContent);
                            str.append(radioStr);
                        }
                        else if (testerAnswerArray.length == 1)//对于单选题来说用户填写最多也就是一个记录（答案）
                        {
                            var testerAnswer = testerAnswerArray[0];
                            var testerSelectAnswerId = testerAnswer.content;
                            if (testerSelectAnswerId == referenceAnswersId)//如果id相同则表明这个referenceAnswers是被选中了的。
                            {
                                str.append(String.format("<td><input type='radio' value='{0}' name='{1}' disabled='disabled' checked='true'/></td><td>{2}</td>", referenceAnswersId, questionId, referenceAnswersContent));
                            }
                            else {
                                var radioStr = createRadioForDisabled(referenceAnswersId, questionId, referenceAnswersContent);
                                str.append(radioStr);
                            }
                        }

                    }
                    str.append("</tr>");
                }
                str.append("</table>");
            }
            break;
        case "2":  //多选题
            if (answerNum > 0) {
                str.append("<table>");
                for (var j = 0; j < answerNum; j++) {
                    var referenceAnswersId = refenceAnswerArray[j].id;
                    var referenceAnswersContent = refenceAnswerArray[j].content;
                    var correctFlag = refenceAnswerArray[j].correctFlag;
                    str.append("<tr>");

                    if (displayMode == 1) {
                        var checkStr = createCheckBox(referenceAnswersId, referenceAnswersContent);
                        str.append(checkStr);
                    }
                    else if (displayMode == 2) {

                        var correctImg = correctFlag == "1" ? "<img alt='Correct Answer' src='../Images/correct.png' />" : "<img alt='' style='visibility:hidden' src='../Images/icon/incorrect.png' />";
                        var isHaveFeedBack = false;
                        var randomString = "";
                        if (isShowFeedBack == true && feedback != null && feedback.trim() != "" && feedback.trim().toLowerCase() != "null" && feedback.trim() != "&nbsp;") {
                            isHaveFeedBack = true;
                            randomStringId = randomStringFun(30);
                        }
                        if (isHaveFeedBack == true) {
                            str.append(String.format("<td><img alt='Feedback' src='../Images/icon/FeedBack.png' title='Feedback' onclick=\"FeedBackModule_Show('{0}')\"  style='cursor:pointer;'/><span id='{0}' style='display:none;'>{1}</span></td>", randomStringId, feedback));
                        }
                        else {
                            str.append(String.format("<td></td>"));
                        }

                        str.append(String.format("<td>{3}</td><td><input type='checkbox' value='{0}' disabled='disabled' {1}/> </td><td>{2}</td>", referenceAnswersId, correctFlag == "1" ? "checked='true'" : "", referenceAnswersContent, correctImg));


                        // str.append(String.format("<input type='checkbox' value='{0}' disabled='disabled' {1}/>   &nbsp; {2}",referenceAnswersId,correctFlag=="1"?"checked='true'":"",referenceAnswersContent));  
                    }
                    else if (displayMode == 3) {
                        if (testerAnswerArray == null || testerAnswerArray.length == 0) {
                            var checkStr = createCheckBox(referenceAnswersId, referenceAnswersContent);
                            str.append(checkStr);
                        }
                        else if (testerAnswerArray.length > 0) {
                            var bo = false;
                            for (var testerCount = 0; testerCount < testerAnswerArray.length; testerCount++) {
                                var testerSelectId = testerAnswerArray[testerCount].content;
                                if (referenceAnswersId == testerSelectId) {
                                    bo = true;
                                    break;

                                }

                            }
                            if (bo == true) {
                                str.append(String.format("<input type='checkbox' value='{0}' checked='true'/>   &nbsp; {1}", referenceAnswersId, referenceAnswersContent));
                            }
                            else {
                                str.append(String.format("<input type='checkbox' value='{0}' />   &nbsp; {1}", referenceAnswersId, referenceAnswersContent));
                            }
                        }
                    }
                    else if (displayMode == 4) {
                        if (testerAnswerArray == null || testerAnswerArray.length == 0) {
                            var checkStr = createCheckBoxForDisabled(referenceAnswersId, referenceAnswersContent);
                            str.append(checkStr);
                        }
                        else if (testerAnswerArray.length > 0) {
                            for (var testerCount = 0; testerCount < testerAnswerArray.length; testerCount++) {
                                var testerSelectId = testerAnswerArray[testerCount].content;
                                if (referenceAnswersId == testerSelectId) {
                                    str.append(String.format("<input type='checkbox' value='{0}' checked='true' disabled='disabled'/>   &nbsp; {1}", referenceAnswersId, referenceAnswersContent));
                                }
                            }
                        }
                    }
                    str.append("</tr>");
                }
                str.append("</table>");
            }
            break;
        case "4": //Fill-in blank
            if (answerNum > 0) {

                if (displayMode == 1) {
                    //str.append("<div id=\"divFillInBlank_" + questionId + "\" style=\"width:50%;height:auto;border:solid 1px gray;\" onclick=\"onQustionDivClick(this)\">&nbsp;</div>");
                    str.append("<div id=\"4_" + questionId + "\"><textarea cols=\"150\" rows=\"4\"></textarea></div>");
                }
                else if (displayMode == 2) {
                    str.append("<table cellspacing='0' cellpadding='10'>");

                    for (var j = 0; j < answerNum; j++) {
                        str.append("<tr>");
                        var referenceAnswersId = refenceAnswerArray[j].id;
                        var referenceAnswersContent = refenceAnswerArray[j].content;
                        var correctFlag = refenceAnswerArray[j].correctFlag;
                        var feedback = refenceAnswerArray[j].feedback;

                        var correctImg = correctFlag == "1" ? "<img alt='Correct Answer' src='../Images/correct.png' />" : "<img alt='' style='visibility:hidden' src='../Images/icon/incorrect.png' />";
                        var isHaveFeedBack = false;
                        var randomString = "";
                        if (isShowFeedBack == true && feedback != null && feedback.trim() != "" && feedback.trim().toLowerCase() != "null" && feedback.trim() != "&nbsp;") {
                            isHaveFeedBack = true;
                            randomStringId = randomStringFun(30);
                        }
                        if (isHaveFeedBack == true) {
                            str.append(String.format("<td><img alt='Feedback' src='../Images/icon/FeedBack.png' title='Feedback' onclick=\"FeedBackModule_Show('{0}')\"  style='cursor:pointer;'/><span id='{0}' style='display:none;'>{1}</span></td>", randomStringId, feedback));
                        }
                        else {
                            str.append(String.format("<td></td>"));
                        }

                        str.append(String.format("<td>{1}</td><td> <label>{0}</label></td>", referenceAnswersContent, correctImg));
                        str.append("</tr>");
                    }
                    str.append("</table>");
                }
                else if (displayMode == 3) {
                    var testerAnswerContent = (testerAnswerArray[0].content != null && testerAnswerArray[0].content != "") ? testerAnswerArray[0].content : "&nbsp;";
                    str.append("<div id=\"divFillInBlank_" + questionId + "\" style=\"width:50%;height:auto;border:solid 1px gray;\" onclick=\"onQustionDivClick(this)\">" + testerAnswerContent + "</div>");
                }
                else if (displayMode == 4) {
                    //var refenceAnswerContent=(refenceAnswerArray[0].content!=null && refenceAnswerArray[0].content!="") ? refenceAnswerArray[0].content : "&nbsp;";
                    if (testerAnswerArray != null && testerAnswerArray.length > 0) {
                        str.append("<div >" + testerAnswerArray[0].content + "</div>");
                    }
                }

            }
            break;
        case "14": //Free Input
            if (displayMode == 1) {
                //str.append("<div id=\"divFillInBlank_" + questionId + "\" style=\"width:50%;height:auto;border:solid 1px gray;\" onclick=\"onQustionDivClick(this)\">&nbsp;</div>");
                str.append("<div id=\"14_"+questionId+"\"><textarea cols=\"150\" rows=\"4\"></textarea></div>");
            }
            //                        else if(displayMode==2)
            //                        {
            //                            str.append("<table cellspacing='0' cellpadding='10'>");
            //                          
            //                            for(var j=0;j<answerNum;j++)
            //                            {
            //                                str.append("<tr>"); 
            //                                 var referenceAnswersId=refenceAnswerArray[j].id;
            //                                 var referenceAnswersContent=refenceAnswerArray[j].content;
            //                                 var correctFlag=refenceAnswerArray[j].correctFlag;
            //                                 var feedback=refenceAnswerArray[j].feedback;
            //                                 
            //                                var correctImg=correctFlag=="1" ? "<img alt='Correct Answer' src='../Images/correct.png' />" : "<img alt='' style='visibility:hidden' src='../Images/icon/incorrect.png' />";
            //                                var isHaveFeedBack=false;
            //                                var randomString = "";
            //                                if(isShowFeedBack==true && feedback!=null && feedback.trim()!="" && feedback.trim().toLowerCase()!="null" && feedback.trim()!="&nbsp;")
            //                                {
            //                                    isHaveFeedBack=true;
            //                                    randomStringId=randomStringFun(30);
            //                                }
            //                                if(isHaveFeedBack==true)
            //                                {
            //                                    str.append(String.format("<td><img alt='Feedback' src='../Images/icon/FeedBack.png' title='Feedback' onclick=\"FeedBackModule_Show('{0}')\"  style='cursor:pointer;'/><span id='{0}' style='display:none;'>{1}</span></td>",randomStringId,feedback));
            //                                }
            //                                else
            //                                {
            //                                    str.append(String.format("<td></td>"));
            //                                }
            //                                
            //                                 str.append(String.format("<td>{1}</td><td> <label>{0}</label></td>",referenceAnswersContent,correctImg));  
            //                                 str.append("</tr>"); 
            //                             }
            //                             str.append("</table>");
            //                        }
            else if (displayMode == 3) {
                var testerAnswerContent = (testerAnswerArray[0].content != null && testerAnswerArray[0].content != "") ? testerAnswerArray[0].content : "&nbsp;";
                str.append("<div id=\"divFillInBlank_" + questionId + "\" style=\"width:50%;height:auto;border:solid 1px gray;\" onclick=\"onQustionDivClick(this)\">" + testerAnswerContent + "</div>");
            }
            else if (displayMode == 4) {
                //var refenceAnswerContent=(refenceAnswerArray[0].content!=null && refenceAnswerArray[0].content!="") ? refenceAnswerArray[0].content : "&nbsp;";
                if (testerAnswerArray != null && testerAnswerArray.length > 0) {
                    str.append("<div >" + testerAnswerArray[0].content + "</div>");
                }
            }
            break;
        case "8": //Numeric answer
            if (answerNum > 0) {
                if (displayMode == 1) {
                    str.append("<input type=\"text\" style=\"width:150px;\" onkeydown=\"return onTxtNumericAnswerKeyDown(event);\" onkeyup=\"onTxtNumericAnswerKeyUp(this.value,this)\"/>");
                } else if (displayMode == 2) {
                    str.append("<table cellspacing='0' cellpadding='10'>");

                    for (var j = 0; j < answerNum; j++) {
                        str.append("<tr>");
                        var referenceAnswersId = refenceAnswerArray[j].id;
                        var referenceAnswersContent = refenceAnswerArray[j].content;
                        var correctFlag = refenceAnswerArray[j].correctFlag;
                        var feedback = refenceAnswerArray[j].feedback;

                        var correctImg = correctFlag == "1" ? "<img alt='Correct Answer' src='../Images/correct.png' />" : "<img alt='' style='visibility:hidden' src='../Images/icon/incorrect.png' />";
                        var isHaveFeedBack = false;
                        var randomString = "";
                        if (isShowFeedBack == true && feedback != null && feedback.trim() != "" && feedback.trim().toLowerCase() != "null" && feedback.trim() != "&nbsp;") {
                            isHaveFeedBack = true;
                            randomStringId = randomStringFun(30);
                        }
                        if (isHaveFeedBack == true) {
                            str.append(String.format("<td><img alt='Feedback' src='../Images/icon/FeedBack.png' title='Feedback' onclick=\"FeedBackModule_Show('{0}')\"  style='cursor:pointer;'/><span id='{0}' style='display:none;'>{1}</span></td>", randomStringId, feedback));
                        }
                        else {
                            str.append(String.format("<td></td>"));
                        }

                        str.append(String.format("<td>{1}</td><td> <label>{0}</label></td>", referenceAnswersContent, correctImg));
                        str.append("</tr>");
                    }
                    str.append("</table>");


                    // str.append("<label>"+refenceAnswerArray[0].content+"</label>");
                } else if (displayMode == 3) {
                    str.append("<input type=\"text\" value=\"" + testerAnswerArray[0].content + "\" style=\"width:150px;\" onkeydown=\"return onTxtNumericAnswerKeyDown(event);\" onkeyup=\"onTxtNumericAnswerKeyUp(this.value,this)\"/>");
                } else if (displayMode == 4) {
                    str.append("<input type=\"text\" value=\"" + refenceAnswerArray[0].content + "\" style=\"width:150px;\" disabled=\"disabled\" />");
                }
            }
            break;
        case "11": //数学公式题 Math Input
            if (answerNum > 0) {
                if (displayMode == 1) {
                    str.append("<div id=\"divMathInput_" + questionId + "\" style=\"width:100%;height:100%;border:solid 1px gray;\" onclick=\"onQustionDivClick(this)\">&nbsp;</div>");
                } else if (displayMode == 2) {
                    str.append("<table cellspacing='0' cellpadding='10'>");

                    for (var j = 0; j < answerNum; j++) {
                        str.append("<tr>");
                        var referenceAnswersId = refenceAnswerArray[j].id;
                        var referenceAnswersContent = refenceAnswerArray[j].content;
                        var correctFlag = refenceAnswerArray[j].correctFlag;
                        var feedback = refenceAnswerArray[j].feedback;

                        var correctImg = correctFlag == "1" ? "<img alt='Correct Answer' src='../Images/correct.png' />" : "<img alt='' style='visibility:hidden' src='../Images/icon/incorrect.png' />";
                        var isHaveFeedBack = false;
                        var randomString = "";
                        if (isShowFeedBack == true && feedback != null && feedback.trim() != "" && feedback.trim().toLowerCase() != "null" && feedback.trim() != "&nbsp;") {
                            isHaveFeedBack = true;
                            randomStringId = randomStringFun(30);
                        }
                        if (isHaveFeedBack == true) {
                            str.append(String.format("<td><img alt='Feedback' src='../Images/icon/FeedBack.png' title='Feedback' onclick=\"FeedBackModule_Show('{0}')\"  style='cursor:pointer;'/><span id='{0}' style='display:none;'>{1}</span></td>", randomStringId, feedback));
                        }
                        else {
                            str.append(String.format("<td></td>"));
                        }

                        str.append(String.format("<td>{1}</td><td> <label>{0}</label></td>", referenceAnswersContent, correctImg));
                        str.append("</tr>");
                    }
                    str.append("</table>");

                    // str.append("<label>"+refenceAnswerArray[0].content+"</label>");
                } else if (displayMode == 3) {
                    var testerAnswerContent = (testerAnswerArray[0].content != null && testerAnswerArray[0].content != "") ? testerAnswerArray[0].content : "&nbsp;";
                    str.append("<div id=\"divMathInput_" + questionId + "\" style=\"width:100%;height:100%;border:solid 1px gray;\" onclick=\"onQustionDivClick(this)\">" + testerAnswerContent + "</div>");
                } else if (displayMode == 4) {
                    var refenceAnswerContent = (refenceAnswerArray[0].content != null && refenceAnswerArray[0].content != "") ? refenceAnswerArray[0].content : "&nbsp;";
                    str.append("<div >" + refenceAnswerContent + "</div>");
                }
            }
            break;
        case "3": // True or False (判断题,之前的数据是 Success/Fail)
        case "9":  //Yes or No ()
        case "13": //Success/Fail
            if (answerNum == 2) {
                var Id_1 = questionId + "_1";
                var Id_2 = questionId + "_2";
                var Text_1 = refenceAnswerArray[0].content;
                var Text_2 = refenceAnswerArray[1].content;
                var refenceAnswerArray_1 = refenceAnswerArray[0].id;
                var refenceAnswerArray_2 = refenceAnswerArray[1].id;
                var correctFlag_1 = refenceAnswerArray[0].correctFlag;
                var correctFlag_2 = refenceAnswerArray[1].correctFlag;
                if (displayMode == 1) {
                    var radioStr = createRadioForTrueOrFalse(Id_1, questionId, Text_1, Id_2, Text_2, refenceAnswerArray_1, refenceAnswerArray_2);
                    str.append(radioStr);
                }
                else if (displayMode == 2) {
                    str.append(String.format("<input type='radio' value='{7}' disabled='disabled' {5}/> &nbsp; <label >{2}</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type='radio' value='{8}'  disabled='disabled' {6}/> &nbsp; <label >{4}</label>", Id_1, questionId, Text_1, Id_2, Text_2, correctFlag_1 == "1" ? "checked='true'" : "", correctFlag_2 == "1" ? "checked='true'" : "", refenceAnswerArray_1, refenceAnswerArray_2));
                }
                else if (displayMode == 3) {
                    if (testerAnswerArray == null || testerAnswerArray.length != 1)//这类题
                    {
                        var radioStr = createRadioForTrueOrFalse(Id_1, questionId, Text_1, Id_2, Text_2, refenceAnswerArray_1, refenceAnswerArray_2);
                        str.append(radioStr);
                    }
                    else if (testerAnswerArray.length == 1) {
                        var testerAnswer = testerAnswerArray[0];
                        var testerSelectAnswerId = testerAnswer.content;
                        var isSelectAnswer_1 = false; //第一个答案是用户选中了的吗
                        var isSelectAnswer_2 = false; //第二个答案是用户选中了的吗
                        if (testerSelectAnswerId == refenceAnswerArray_1)//如果id相同则表明这个referenceAnswers是被选中了的。
                        {
                            isSelectAnswer_1 = true;
                        }
                        if (testerSelectAnswerId == refenceAnswerArray_2) {
                            isSelectAnswer_2 = true;
                        }
                        str.append(String.format("<input type='radio' value='{7}' name='{1}' {5}/> &nbsp; <label >{2}</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type='radio' value='{8}' name='{1}' {6}/> &nbsp; <label >{4}</label>", Id_1, questionId, Text_1, Id_2, Text_2, isSelectAnswer_1 == true ? "checked='true'" : "", isSelectAnswer_2 == true ? "checked='true'" : "", refenceAnswerArray_1, refenceAnswerArray_2));
                    }
                }
                else if (displayMode == 4) {
                    if (testerAnswerArray == null || testerAnswerArray.length != 1)//这类题
                    {
                        var radioStr = createRadioForTrueOrFalseForDisabled(Id_1, questionId, Text_1, Id_2, Text_2, refenceAnswerArray_1, refenceAnswerArray_2);
                        str.append(radioStr);
                    }
                    else if (testerAnswerArray.length == 1) {
                        var testerAnswer = testerAnswerArray[0];
                        var testerSelectAnswerId = testerAnswer.content;
                        var isSelectAnswer_1 = false; //第一个答案是用户选中了的吗
                        var isSelectAnswer_2 = false; //第二个答案是用户选中了的吗
                        if (testerSelectAnswerId == refenceAnswerArray_1)//如果id相同则表明这个referenceAnswers是被选中了的。
                        {
                            isSelectAnswer_1 = true;
                        }
                        if (testerSelectAnswerId == refenceAnswerArray_2) {
                            isSelectAnswer_2 = true;
                        }
                        str.append(String.format("<input type='radio'  value='{7}'  {5} disabled='disabled'/> &nbsp; <label disabled='disabled'>{2}</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type='radio' value='{8}' disabled='disabled' {6}/> &nbsp; <label>{4}</label>", Id_1, questionId, Text_1, Id_2, Text_2, isSelectAnswer_1 == true ? "checked='true'" : "", isSelectAnswer_2 == true ? "checked='true'" : "", refenceAnswerArray_1, refenceAnswerArray_2));
                    }
                }
            }
            break;
        case "15":
           
            if (displayMode == 2)
            {
                //refenceAnswerArray, testerAnswerArray
                if (refenceAnswerArray && refenceAnswerArray.length > 0)
                {
                    for (var i = 0,j=0; i < refenceAnswerArray.length; i++)
                    {
                        if (refenceAnswerArray[i].correctFlag == 1)
                        {
                            if (j != 0)
                            {
                                str.append("<div style='padding:4px 0px;color:gray;'>OR</div>");
                            }
                            str.append("<div>" + refenceAnswerArray[i].content + "</div>");
                            j++;
                        }
                    }
                }
            }
            else if (displayMode == 4)
            {
                if (testerAnswerArray && testerAnswerArray.length == 1)
                {
                    var answers = testerAnswerArray[0].content.split(JDK.splitChar);
                    if (answers && answers.length == 2)
                    {
                        var jdk = new JDK("", $("<div></div>"));
                        jdk.setValue(answers[0]);
                        jdk.setValue_Vice(answers[1]);
                        jdk.setLianDong();
                        jdk.setDisableVice();
                        jdk.show();
                        str.append(jdk.$parentNode.get(0).outerHTML);
                    }
                }
            }
            break;
    }
    return str.toString();
}
//（类似私有，供文件内函数调用）
function createRadio(referenceAnswersId, questionId, referenceAnswersContent) {
    return String.format("<td><input type='radio' value='{0}' name='{1}'/></td> <td>{2}</td>", referenceAnswersId, questionId, referenceAnswersContent)
}

function createRadioForDisabled(referenceAnswersId, questionId, referenceAnswersContent) {
    return String.format("<td><input type='radio' value='{0}' name='{1}' disabled='disabled'/></td>  <td>{2}</td>", referenceAnswersId, questionId, referenceAnswersContent)
}
function createCheckBox(referenceAnswersId, referenceAnswersContent) {
    return String.format("<td><input type='checkbox' value='{0}'/></td> <td>{1}</td>", referenceAnswersId, referenceAnswersContent);
}
function createCheckBoxForDisabled(referenceAnswersId, referenceAnswersContent) {
    return String.format("<td><input type='checkbox' value='{0}' disabled='disabled'/></td> <td>{1}</td>", referenceAnswersId, referenceAnswersContent);
}
function createRadioForTrueOrFalse(Id_1, questionId, Text_1, Id_2, Text_2, refenceAnswerArray_1, refenceAnswerArray_2) {
    return String.format("<input type='radio' id='{0}' value='{5}' name='{1}'/>  <label for='{0}'>{2}</label> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type='radio' id='{3}' value='{6}' name='{1}'/>  <label for='{3}'>{4}</label>", Id_1, questionId, Text_1, Id_2, Text_2, refenceAnswerArray_1, refenceAnswerArray_2);
}
function createRadioForTrueOrFalseForDisabled(Id_1, questionId, Text_1, Id_2, Text_2, refenceAnswerArray_1, refenceAnswerArray_2) {
    return String.format("<input type='radio' id='{0}' value='{5}' name='{1}' disabled='disabled'/>  <label for='{0}' disabled='disabled'>{2}</label> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type='radio' id='{3}' value='{6}' name='{1}' disabled='disabled'/>  <label for='{3}' disabled='disabled'>{4}</label>", Id_1, questionId, Text_1, Id_2, Text_2, refenceAnswerArray_1, refenceAnswerArray_2);
}

//生成线下答案。表示不显示答案。用于考试界面（上一次考试是提交不是保存）
function createOfflineAnswerForNoAnswer(questionId) {
    return createOfflineAnswer(questionId, null);
}
//生成线下答案。表示显示正确答案。用于阅卷和查看某个Question的正确答案（暂不提供此功能）
function createOfflineAnswerForCorrectAnswer(questionId) {
    return createOfflineAnswer(questionId, null);
}
//生成线下答案。表示显示答题者所填内容。用于阅卷和考试界面（上一次考试是保存，不是提交）(暂不提供此功能)
function createOfflineAnswerForTesterAnswer(questionId) {
    return createOfflineAnswer(questionId, null);
}

//创建线下题答案。
//isCorrect表示用户填写的是success(传true)还是fail(传false),如果不显示用户填写的则传入null
function createOfflineAnswer(questionId, isCorrect) {
    var str = new Sys.StringBuilder();
    var successId = questionId + "_1";
    var failId = questionId + "_0";
    var successText = "Correct";
    var failTest = "Incorrect";
    if (isCorrect == null) {
        str.append(String.format("<input onclick='setReceivedSocreValue(\"{1}\",true)' type='radio' id={0} value='1' name='{1}'/>  <label for='{0}'>{2}</label> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type='radio' id={3} value='0' name='{1}' onclick='setReceivedSocreValue(\"{1}\",false)'/>  <label for='{3}'>{4}</label>", successId, questionId, successText, failId, failTest));
    }
    else {
        str.append(String.format("<input type='radio' id={0} value='1' name='{1}' disabled='disabled' {5}/>  <label for='{0}'>{2}</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type='radio' id={3} value='0' name='{1}' disabled='disabled' {6}/>  <label for='{3}'>{4}</label>", successId, questionId, successText, failId, failTest, isCorrect == true ? "checked='true'" : "", (!isCorrect) == true ? "checked='true'" : ""));
    }
    return str.toString();
}

function setReceivedSocreValue(questionId, iscorrect) {
    var o = $("#"+questionId + "_OfflineInput");
    if (iscorrect) {
        var s = $("#" + questionId + "_qScore").text();
        if ($.trim(o.val()) == "0" || $.trim(o.val()) == "") {
            o.val(s);
        }
        
    } else {
        o.val("0");
    }
}

function getKowlegeOfPriority(priorityValue) {
    if (priorityValue == null) {
        return "--";
    }
    var priorityStr = "";
    switch (priorityValue.trim()) {
        case "0":
            priorityStr = "高";
            break;
        case "1":
            priorityStr = "中";
            break;
        case "2":
            priorityStr = "低";
            break;
        default:
            priorityStr = priorityValue;
            break;
    }
    return priorityStr;
}

////生成LO表格html(没有学习资料), question 管理里显示lo:questionManageFlag为true时显示
function returnLOTable(loArray, questionId, roleId, sectionId, isShowSampleQuestion, questionManageFlag) {
    var OArray = new Array();
    var PArray = new Array();
    for (var i = 0; i < loArray.length; i++) {
        var ins = loArray[i];
        var loType = ins.loType;
        if (loType == "o" || loType == "op") {
            Array.add(OArray, ins);
        }
        else if (loType == "p") {
            Array.add(PArray, ins);
        }
    }

    var okp = "Objective Knowledge";
    var _okp = "What this question is about";
    var pkp = "Additional Prerequisite Knowledge";
    var _pkp = "Other knowledge needed to solve this question";
    var oTitle = "<strong>" + okp + "</strong> - <font style='font-size:11px'>" + _okp + "</font>";
    var pTilte = "<strong>" + pkp + "</strong> - <font style='font-size:11px'>" + _pkp + "</font>";
    var LOTableStr = new Sys.StringBuilder();
    var roleDir = roleId == "0" ? "Instructor" : "Student";
    var style1 = questionManageFlag ? "style='display:none;width:0px'" : "class='th1'";
    var style2 = questionManageFlag ? "style='display:none;'" : "class='th2'";
    var style3 = questionManageFlag ? "style='display:none;width:0px'" : "class='th3'";
    var style4 = questionManageFlag ? "style='display:none;width:0px'" : "class='th4'";
    var style5 = questionManageFlag ? "style='display:none;width:0px'" : "class='th5'";
    var style6 = questionManageFlag ? "style='display:none;width:0px'" : "class='th6'";
    var stylePriority = questionManageFlag ? "style='display:none;width:0px'" : "style='width:8%;background-color:#D6EAFE;height:25px; vertical-align:middle; color:#336699'"; //"class='thPriority'";
    var style7 = questionManageFlag ? "style='display:none;width:0px'" : "class='th7'";

    var _style1 = questionManageFlag ? "style='display:none;width:0px'" : "class='td1'";
    var _style2 = questionManageFlag ? "style='display:block;'" : "class='td2'";
    var _style3 = questionManageFlag ? "style='display:none;width:0px'" : "class='td3'";
    var _style4 = questionManageFlag ? "style='display:none;width:0px'" : "class='td4'";
    var _style5 = questionManageFlag ? "style='display:none;width:0px'" : "class='td5'";
    var _style6 = questionManageFlag ? "style='display:none;width:0px'" : "class='td6'";
    var _stylePriority = questionManageFlag ? "style='display:none;width:0px'" : "style='width:8%;text-align:center;'"; //"class='tdPriority'";
    var _style7 = questionManageFlag ? "style='display:none;width:0px'" : "class='td7'";
    if (questionManageFlag) {
        LOTableStr.append("<table width='100%' border='0' cellspacing='0' cellpadding='0'>");
    } else {
        LOTableStr.append("<table class='LOTable' width='100%' border='0' cellspacing='0' cellpadding='0'>");
    }
    LOTableStr.append("<tr>");

    LOTableStr.append(String.format("<th " + style1 + " scope='col'></th>    <th " + style2 + " scope='col'>知识点</th>    <th " + style3 + " scope='col'>{0}</th>    <th " + style4 + " scope='col'>页码</th>", isShowSampleQuestion == true ? "样题" : ""));
    if (roleId == "0")//教师
    {
        LOTableStr.append("<th " + style5 + " scope='col'>班级状态</th>");
    }
    else if (roleId == "1")//学生
    {
        LOTableStr.append("<th " + style5 + " scope='col'>知识状态<br>个人&nbsp;/&nbsp;班级</th> ");
    }
    LOTableStr.append("<th " + stylePriority + " scope='col'>Priority</th>");
    LOTableStr.append("<th " + style6 + " scope='col'>笔记</th>	<th " + style7 + " scope='col'></th>");
    LOTableStr.append("</tr>");
    if (OArray.length > 0) {
        LOTableStr.append(String.format("<tr>    <td height='25' ></td>    <td height='25' colspan='6'>{0}</td>  </tr>", oTitle));
        LOTableStr.append("<tr>   <td colspan='8'>");
        //此处生成ObjectiveKnowledge
        LOTableStr.append("<table width='100%' border='0' cellspacing='0' cellpadding='3'>");

        for (var i = 0; i < loArray.length; i++) {
            var loType = loArray[i].loType; //LO是T还是P
            var unit = loArray[i].unit;    //章节号
            var loName = loArray[i].itemName; //LO名字
            var loLocation = loArray[i].loLocation; //LO所在书的页码
            var classStatus = loArray[i].classKnowledgeStatus; //班级学习状态
            var personalStatus = loArray[i].personalKnowledgeStatus; //个人学习状态
            var loId = loArray[i].itemId;
            var exampleQuestionFlag = loArray[i].exampleQuestionFlag;
            var priority = getKowlegeOfPriority(loArray[i].priority);
            if (loType == "o" || loType == "op") {

                LOTableStr.append("<tr>")
                LOTableStr.append("<td " + _style1 + "></td>");
                LOTableStr.append(String.format("<td " + _style2 + ">&nbsp;&nbsp; <img src='../Images/{0}' title='{1}' align='middle'/>&nbsp;  {2}&nbsp;&nbsp; &nbsp;{3}</td>", loType == "op" ? "OPKP.gif" : "OKP.gif", loType == "op" ? okp : okp, unit, loName));
                LOTableStr.append(String.format("<td " + _style3 + ">"));
                if (isShowSampleQuestion == true) {
                    LOTableStr.append(String.format("<img src='../Images/{0}' title='样题' align='middle' style='cursor:pointer;' onclick=\"clickSampleQuestion('{1}','{2}')\"></img> <span style='font-size:11px; color:Blue;cursor:text;'> ({3})</span>", "relatedQuestion.gif", loId, loName, exampleQuestionFlag));
                }
                LOTableStr.append("</td>");
                LOTableStr.append(String.format("<td " + _style4 + ">P.{0}</td>", loLocation));
                if (roleId == "1")//学生是自己的学习状态。
                {
                    LOTableStr.append(String.format("<td " + _style5 + ">{0} / {1}</td>", getScoreChange(personalStatus), getScoreChange(classStatus)));
                }
                else if (roleId == "0")//教师是班级的状态
                {
                    LOTableStr.append(String.format("<td " + _style5 + ">{0}</td>", getScoreChange(classStatus)));
                }
                var userId = "";
                try {
                    if (getUserId() != null && getUserId() != "") {
                        userId = "userId=" + getUserId() + "&";
                    }
                } catch (e) { }
                LOTableStr.append("<td " + _stylePriority + ">" + priority + "</td>");
                //var href=String.format("../{0}/StudyNote.aspx1?"+userId+"sectionId={1}&objectId={2}&objectType=1&sourceId={3}&sourceType=8&type=KnowledgePoint&Name={4}",roleDir,sectionId,loId,questionId,loName);
                var href = "../Study/StudyNote.aspx?" + userId + "sectionId=" + sectionId + "&resId=" + loId + "&resType=2";
                LOTableStr.append(String.format("<td " + _style6 + "><a href='{1}' target='_blank'><img src='../Images/{0}' title='Notes' align='middle'  style='cursor:pointer;' ></img></a></td>", "notes.gif", href));
                LOTableStr.append("<td " + _style7 + "></td>");
                LOTableStr.append("</tr>")
            }
        }
        LOTableStr.append("</table>");
        LOTableStr.append("</td>  </tr>");
    }
    if (PArray.length > 0) {
        LOTableStr.append(String.format("<tr>  	<td height='25' ></td>    <td height='25' colspan='6'>{0}</td>  </tr> <tr>    <td colspan='8'>", pTilte));
        //此处生成Prerequisite Knowledge
        LOTableStr.append("<table width='100%' border='0' cellspacing='0' cellpadding='3'>");
        for (var i = 0; i < loArray.length; i++) {
            var loType = loArray[i].loType; //LO是T还是P
            var unit = loArray[i].unit;    //章节号
            var loName = loArray[i].itemName; //LO名字
            var loLocation = loArray[i].loLocation; //LO所在书的页码
            var classStatus = loArray[i].classKnowledgeStatus; //班级学习状态
            var personalStatus = loArray[i].personalKnowledgeStatus; //个人学习状态
            var priority = getKowlegeOfPriority(loArray[i].priority);
            if (loType == "p") {
                LOTableStr.append("<tr>")
                LOTableStr.append("<td " + _style1 + "></td>");
                LOTableStr.append(String.format("<td " + _style2 + "> &nbsp;&nbsp; <img src='../Images/{0}' title='{1}'align='middle'/>&nbsp; {2}&nbsp;&nbsp; &nbsp;{3}</td>", loType == "op" ? "OPKP.gif" : "PKP.gif", loType == "op" ? pkp : pkp, unit, loName));
                LOTableStr.append("<td " + _style3 + "></td>");
                LOTableStr.append(String.format("<td " + _style4 + ">P.{0}</td>", loLocation));
                if (roleId == "1")//学生是自己的学习状态。
                {
                    LOTableStr.append(String.format("<td " + _style5 + ">{0} / {1}</td>", getScoreChange(personalStatus), getScoreChange(classStatus)));
                }
                else if (roleId == "0")//教师是班级的状态
                {
                    LOTableStr.append(String.format("<td " + _style5 + ">{0}</td>", getScoreChange(classStatus)));
                }
                LOTableStr.append("<td " + _stylePriority + ">" + priority + "</td>");
                //var href=String.format("../{0}/StudyNote.aspx1?sectionId={1}&objectId={2}&objectType=1&sourceId={3}&sourceType=8&type=KnowledgePoint&Name={4}",roleDir,sectionId,loId,questionId,loName);           
                var href = "../Study/StudyNote.aspx?userId=" + getUserId() + "sectionId=" + sectionId + "&resId=" + loId + "&resType=2";
                LOTableStr.append(String.format("<td " + _style6 + "><a  href='{1}' target='_blank'><img src='../Images/{0}' title='笔记' align='middle'  style='cursor:pointer;'/></img></a></td>", "notes.gif", href));
                LOTableStr.append("<td " + _style7 + "></td>");
                LOTableStr.append("</tr>")
            }
        }
        LOTableStr.append("</table>");


        LOTableStr.append("</td>  </tr>");
    }
    LOTableStr.append("</table>");


    return LOTableStr.toString();
}
function openNewWindow1(url) {
    $("<form action=\"" + url + "\" target=\"_blank\" method=\"POST\"><input type=\"submit\"></form>").appendTo("body").submit().remove();
}

function getSimpleDescription(str) {
    var descriptionStr = $("<span></span>").html(str).text();
    var tempDescriptionStr = "";
    if (descriptionStr.replace(/\s|　|&nbsp(;)?/gi, "") != "") {
        if (descriptionStr.length > 55) {
            var tStr = descriptionStr.substring(0, 55);
            var tLastIndex = tStr.lastIndexOf(" ");
            if (tLastIndex == -1) {
                tLastIndex = tStr.lastIndexOf("&nbsp;")
            } else {
                tLastIndex = tStr.length - 1;
            }
            if (tLastIndex != -1) {
                tempDescriptionStr = $.trim(tStr.substring(0, tLastIndex));
            }
        } else {
            tempDescriptionStr = $.trim(descriptionStr);
        }
        //tempDescriptionStr = result[i].AssignmentDescription + '... <img src="../Images/expand_blue.jpg" alt=""/>';
    } else {
        tempDescriptionStr = "";
    }
    return tempDescriptionStr;
}

function returnLOTable2(loArray, roleId, questionManageFlag) {
    var strBuilder = new Sys.StringBuilder();
    strBuilder.append("<div style='padding:8px; font-weight:bold;background-color:rgb(150,216,234);text-align:center;background-image:url(../_Images/les_qg_titbg.gif);background-repeat:repeat-x;'>知识 - 概念与方法</div>");
    if (loArray == null || loArray.length == 0) {
        strBuilder.append("<div style='font-size:11px;color:gray;'>没有发现任何记录</div>");
        return strBuilder.toString();
    }
    var OArray = new Array();
    var PArray = new Array();
    for (var i = 0; i < loArray.length; i++) {
        var ins = loArray[i];
        var loType = ins.loType;
        if (loType == "o" || loType == "op") {
            Array.add(OArray, ins);
        }
        else if (loType == "p") {
            Array.add(PArray, ins);
        }
    }

    var oTitle = "<div style='font-weight:bold;padding:3px;background-color:rgb(223,243,252);color:#005F9C'><img alt='' title='What this question is about' src='../_Images/help.png'/> 目标知识点</div>";
    var pTilte = "<div style='font-weight:bold;padding:3px;background-color:rgb(223,243,252);color:#005F9C'><img alt='' title='Other knowledge needed to solve this question' src='../_Images/help.png'/> 其他辅助知识点</div>";

    strBuilder.append("<div divType='locontent' style='padding:8px'>"); //1

    strBuilder.append("<div>");
    strBuilder.append("<div>");
    strBuilder.append(oTitle);
    strBuilder.append("</div>");
    strBuilder.append("<div>");
    //Content
    if (OArray.length != 0) {
        strBuilder.append('<table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:0px;">');
        var tFlag = true;
        for (var m = 0; m < OArray.length; m++) {
            strBuilder.append('<tr>');
            strBuilder.append('<td style="vertical-align:top;border-top:solid 1px rgb(223,243,252);padding:5px;">');
            strBuilder.append('<div style="font-size:11px;font-weight:bold;color:#43525A;width:340px;"><span>' + OArray[m].unit + '&nbsp;' + OArray[m].itemName + '</span></div>');
            strBuilder.append('</td>');
            if (!questionManageFlag) {
                strBuilder.append('<td style="vertical-align:top;width:20px;border-top:solid 1px rgb(223,243,252);padding-right:2px;">');
                if (OArray[m].exampleQuestionFlag > 0) {
                    //strBuilder.append('<a href="" target="_blank"><img alt="" title="样题" style="cursor:pointer;" src="../_Images/viewfile.gif" />(' + OArray[m].exampleQuestionFlag + ')</a>');
                    strBuilder.append('<a style="color:blue;" target="_blank"><table onclick="openNewWindow1(\''
                        + '../TestShow/TestContent.aspx?userId=' + getUserId() + '&sectionId=' + getSectionId() + '&tUserId=' + getUserId() + '&type=2&loId=' + OArray[m].itemId + '&name=' + OArray[m].itemName
                        + '\')" style="cursor:pointer;" cellpadding="0" cellspacing="0"><tr><td><img alt="" title="样题" src="../_Images/viewfile.gif" /></td><td>(' + OArray[m].exampleQuestionFlag + ')</td></tr></table></a>');
                }
                strBuilder.append('</td>');
                strBuilder.append('<td style="vertical-align:top;width:16px;border-top:solid 1px rgb(223,243,252);padding-right:2px;">');
                strBuilder.append('<img alt="" src="../_Images/application_view_list.png" onmouseover="onMouseOverShowKPStatusHTML(this)" onmouseout="onMouseOutShowKPStatusHTML(this)"/>');
                var classStatusStr = getScoreChange(OArray[m].classStatus);
                var status1 = roleId == "1" ? ("<strong>个人状态:</strong> " + getScoreChange(OArray[m].personalStatus) + "<br/><strong>班级状态:</strong> " + classStatusStr) : "<strong>班级状态:</strong> " + classStatusStr;
                strBuilder.append('<div style="display:none;"><strong>优先级:</strong> ' + getKowlegeOfPriority(OArray[m].priority) + '<br/>' + status1 + '<br/><strong>页码:</strong> ' + OArray[m].loLocation + '</div>');
                strBuilder.append('</td>');
                strBuilder.append('<td style="vertical-align:top;width:16px;border-top:solid 1px rgb(223,243,252);padding-left:2px;">');
                strBuilder.append('<img title="查看学习资料" style="cursor:pointer;" onclick="onViewStudyResourcesClick(this,\'' + OArray[m].itemId + '\')" alt="" src="../_Images/application_view_list.png" />');
                strBuilder.append('<span style="display:none;">' + OArray[m].itemName + '</span>');
                strBuilder.append('</td>');
            }
            strBuilder.append('</tr>');
            var descriptionStr1 = OArray[m].description == null ? "" : OArray[m].description.trim();

            if (descriptionStr1 != "") {
                if (!tFlag) {
                    strBuilder.append('<tr trType="show_details" style="display:none;">');
                } else {
                    strBuilder.append('<tr trType="show_details">');
                }
                strBuilder.append('<td colspan="4">');
                strBuilder.append('<span style="color:#CC6633">' + getSimpleDescription(descriptionStr1) + '</span><span style="color:rgb(111,161,217);font-size:10px"> ...<span style="cursor:pointer;" onclick="onViewMoreLoDescriptionClick(this)" type="more_lo_details" title="更多">更多&gt;&gt;</span></span>');
                strBuilder.append('</td>');
                strBuilder.append('</tr>');
                if (!tFlag) {
                    strBuilder.append('<tr trType="details">');
                } else {
                    strBuilder.append('<tr trType="details" style="display:none;">');
                }
               // strBuilder.append('<tr style="display:none;">');
                strBuilder.append('<td colspan="4">');
                strBuilder.append('<table cellpadding="0" cellspacing="0" border="0" class="roudcornlb">');
                strBuilder.append('<tr><td class="tl"></td><td class="tm"></td><td class="tr"></td></tr>');
                strBuilder.append('<tr>');
                strBuilder.append('<td class="ml"></td>');
                strBuilder.append('<td class="mm" style="padding:0px;">');
                if (!tFlag) {
                    strBuilder.append('<div loheight="200px" style="font-size:11px;overflow-x: auto;height:200px;overflow-y: hidden;padding-bottom:5px;">' + descriptionStr1 + '</div>');
                    strBuilder.append('<div firstMore="true" style="text-align:right;"><span style="color:rgb(111,161,217);font-size:10px;cursor:pointer;" onclick="ClickFirstKPDetailsMore(this)">更多&gt;&gt;</span></div>');
                    tFlag = true;
                } else {
                    strBuilder.append('<div style="font-size:11px;overflow-x: auto;overflow-y: hidden;padding-bottom:5px;">' + descriptionStr1 + '</div>');
                }
                strBuilder.append('</td>');
                strBuilder.append('<td class="mr"></td>');
                strBuilder.append('</tr>');
                strBuilder.append('<tr><td class="bl"></td><td class="bm"></td><td class="br"></td></tr>');
                strBuilder.append('</table>');
                strBuilder.append('<td>');
                strBuilder.append('</tr>');
            }
        }
        strBuilder.append('</table>');
        //        for (var m = 0; m < OArray.length; m++) {
        //            strBuilder.append("<div style='border-top:solid 1px rgb(223,243,252);padding:4px'>");
        //            strBuilder.append("<div style='font-size:11px;font-weight:bold;color:#43525A'>" + OArray[m].unit + "&nbsp;" + OArray[m].itemName + "</div>");
        //            var descriptionStr1 = OArray[m].description == null ? "" : OArray[m].description;
        //            strBuilder.append("<div style='padding-left:5px;'>" + descriptionStr1 + "</div>");
        //            //strBuilder.append("<div style='width:50%;border:dotted 1px gray;padding:5px;margin:5px;'>");
        ////            var classStatusStr = getScoreChange(OArray[m].classStatus);
        ////            var status = roleId == "1" ? (getScoreChange(OArray[m].personalStatus) + "/" + classStatusStr) : classStatusStr;
        //            //            strBuilder.append("<div>" + getKowlegeOfPriority(OArray[m].priority) + "&nbsp;&nbsp;" + status + "&nbsp;&nbsp;&nbsp;&nbsp;p." + OArray[m].loLocation + "</div>");
        //          //  strBuilder.append("<span style='color:blue;cursor:pointer;'>View Study Resource</span>");
        //          //  strBuilder.append("</div>");
        //            strBuilder.append("</div>");
        //        }
    } else {
        strBuilder.append("<div style='font-size:11px;padding:5px;'>没有发现任何记录</div>");
    }
    strBuilder.append("</div>");
    strBuilder.append("</div>");

    if (PArray && PArray.length != 0) {
        strBuilder.append("<div style='margin-top:5px'>");
        strBuilder.append("<div>");
        strBuilder.append(pTilte);
        strBuilder.append("</div>");
        strBuilder.append("<div>");
        //Content
        if (PArray.length != 0) {
            strBuilder.append('<table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:0px;">')
            for (var n = 0; n < PArray.length; n++) {
                strBuilder.append('<tr>');
                strBuilder.append('<td style="vertical-align:top;border-top:solid 1px rgb(223,243,252);padding:5px;">');
                strBuilder.append('<div style="font-size:11px;font-weight:bold;color:#43525A;width:340px;"><span>' + PArray[n].unit + '&nbsp;' + PArray[n].itemName + '</span></div>');
                //            var descriptionStr1 = PArray[n].description == null ? "" : PArray[n].description.trim();
                //            
                //            if (descriptionStr1 != "") {
                //                strBuilder.append('<table cellpadding="0" cellspacing="0" border="0" class="roudcornlb">');
                //                strBuilder.append('<tr><td class="tl"></td><td class="tm"></td><td class="tr"></td></tr>');
                //                strBuilder.append('<tr>');
                //                strBuilder.append('<td class="ml"></td>');
                //                strBuilder.append('<td class="mm">');
                //                strBuilder.append('<div style="font-size:11px;">' + descriptionStr1 + '</div>');
                //                strBuilder.append('</td>');
                //                strBuilder.append('<td class="mr"></td>');
                //                strBuilder.append('</tr>');
                //                strBuilder.append('<tr><td class="bl"></td><td class="bm"></td><td class="br"></td></tr>');
                //                strBuilder.append('</table>');
                //            }
                strBuilder.append('</td>');
                if (!questionManageFlag) {
                    strBuilder.append('<td style="vertical-align:top;width:20px;border-top:solid 1px rgb(223,243,252);padding-right:2px;">');
                    if (PArray[n].exampleQuestionFlag > 0) {
                        // strBuilder.append('<a href="" target="_blank"><table style="cursor:pointer;" cellpadding="0" cellspacing="0"><tr><td><img alt="" title="Sample Question" src="../_Images/viewfile.gif" /></td><td>(' + PArray[n].exampleQuestionFlag + ')</td></tr></table></a>');
                        strBuilder.append('<a style="color:blue;" target="_blank"><table onclick="openNewWindow1(\''
                        + '../TestShow/TestContent.aspx?userId=' + getUserId() + '&sectionId=' + getSectionId() + '&tUserId=' + getUserId() + '&type=2&loId=' + PArray[n].itemId + '&name=' + PArray[n].itemName
                        + '\')" style="cursor:pointer;" cellpadding="0" cellspacing="0"><tr><td><img alt="" title="Sample Question" src="../_Images/viewfile.gif" /></td><td>(' + PArray[n].exampleQuestionFlag + ')</td></tr></table></a>');
                    }
                    strBuilder.append('</td>');
                    strBuilder.append('<td style="vertical-align:top;width:16px;border-top:solid 1px rgb(223,243,252);padding-right:2px;">');
                    strBuilder.append('<img alt="" src="../_Images/application_view_list.png" onmouseover="onMouseOverShowKPStatusHTML(this)" onmouseout="onMouseOutShowKPStatusHTML(this)" />');
                    var classStatusStr = getScoreChange(PArray[n].classStatus);
                    var status2 = roleId == "1" ? ("<strong>个人状态:</strong> " + getScoreChange(PArray[n].personalStatus) + "<br/><strong>班级状态:</strong> " + classStatusStr) : "<strong>班级状态:</strong> " + classStatusStr;
                    //var status2 = roleId == "1" ? (getScoreChange(PArray[n].personalStatus) + "/" + classStatusStr) : classStatusStr;
                    strBuilder.append('<div style="display:none;"><strong>优先级:</strong> ' + getKowlegeOfPriority(PArray[n].priority) + '<br/>' + status2 + '<br/><strong>页码:</strong> ' + PArray[n].loLocation + '</div>');
                    strBuilder.append('</td>');
                    strBuilder.append('<td style="vertical-align:top;width:16px;border-top:solid 1px rgb(223,243,252);padding-left:2px;">');
                    strBuilder.append('<img alt="" title="查看学习资料" style="cursor:pointer;" onclick="onViewStudyResourcesClick(this,\'' + PArray[n].itemId + '\')" src="../_Images/application_view_list.png" />');
                    strBuilder.append('<span style="display:none;">' + PArray[n].itemName + '</span>');
                    strBuilder.append('</td>');
                }
                strBuilder.append('</tr>');
                var descriptionStr1 = PArray[n].description == null ? "" : PArray[n].description.trim();

                if (descriptionStr1 != "") {
                    strBuilder.append('<tr trType="show_details">');
                    strBuilder.append('<td colspan="4">');
                    strBuilder.append('<span style="color:#CC6633">' + getSimpleDescription(descriptionStr1) + '</span><span style="color:rgb(111,161,217);font-size:10px"> ...<span style="cursor:pointer;" onclick="onViewMoreLoDescriptionClick(this)"  title="更多" type="more_lo_details">更多&gt;&gt;</span></span>');
                    strBuilder.append('</td>');
                    strBuilder.append('</tr>');

                    strBuilder.append('<tr trType="details" style="display:none;">');
                    strBuilder.append('<td colspan="4">');
                    strBuilder.append('<table cellpadding="0" cellspacing="0" border="0" class="roudcornlb">');
                    strBuilder.append('<tr><td class="tl"></td><td class="tm"></td><td class="tr"></td></tr>');
                    strBuilder.append('<tr>');
                    strBuilder.append('<td class="ml"></td>');
                    strBuilder.append('<td class="mm" style="padding:0px;">');
                    strBuilder.append('<div style="font-size:11px;overflow-x: auto;overflow-y: hidden;padding-bottom:5px;">' + descriptionStr1 + '</div>');
                    strBuilder.append('</td>');
                    strBuilder.append('<td class="mr"></td>');
                    strBuilder.append('</tr>');
                    strBuilder.append('<tr><td class="bl"></td><td class="bm"></td><td class="br"></td></tr>');
                    strBuilder.append('</table>');
                    strBuilder.append('<td>');
                    strBuilder.append('</tr>');
                }
            }
            strBuilder.append('</table>');

            //        for (var n = 0; n < PArray.length; n++) {
            //            strBuilder.append("<div style='border-top:solid 1px rgb(223,243,252);padding:4px'>");
            //            strBuilder.append("<div style='font-size:11px;font-weight:bold;color:#43525A'>" + PArray[n].unit + "&nbsp;" + PArray[n].itemName + "</div>");
            //            var descriptionStr2 = PArray[n].description == null? "" : PArray[n].description;
            //            strBuilder.append("<div style='padding-left:5px;'>" + descriptionStr2 + "</div>");
            //           // strBuilder.append("<div style='width:50%;border:dotted 1px gray;padding:5px;margin:5px;'>");
            ////            var classStatusStr1 = getScoreChange(PArray[n].classStatus);
            ////            var status1 = roleId == "1" ? (getScoreChange(PArray[n].personalStatus) + "/" + classStatusStr1) : classStatusStr1;
            //            //            strBuilder.append("<div>" + getKowlegeOfPriority(PArray[n].priority) + "&nbsp;&nbsp;" + status1 + "&nbsp;&nbsp;&nbsp;&nbsp;p." + PArray[n].loLocation + "</div>");
            //          //  strBuilder.append("<span style='color:blue;cursor:pointer;'>View Study Resource</span>");
            //          //  strBuilder.append("</div>");
            //            strBuilder.append("</div>");
            //        }
        } else {
            strBuilder.append("<div style='font-size:11px;padding:5px;'>No additional prerequisite knowledge info yet.</div>");
        }
        strBuilder.append("</div>");
        strBuilder.append("</div>");
    }
    strBuilder.append("</div>"); //1

    return strBuilder.toString();
}

function ClickFirstKPDetailsMore(o) {
    //o.parentNode.previousSibling.style.height = "auto";
    //o.parentNode.style.display = "none";
    $(o).parent().css("display","none").prev().css("height","");
}

function onViewMoreLoDescriptionClick(o) {

    var moreTR = $(o).parent().parent().parent();
    var detailsTR = moreTR.next();
    var tDIV = detailsTR.find("div[loheight=200px]");
    if (tDIV.length != 0) {
        $("div[divType=locontent] table tr[trType=details]").css("display", "none");
        $("div[divType=locontent] table tr[trType=show_details]").css("display", "")
        moreTR.css("display","none");
        detailsTR.css("display", "")
        tDIV.css("height", "auto");
        tDIV.parent().find("div[firstMore=true]").remove();
        tDIV.removeAttr("loheight");
    } else {
        if (detailsTR.css("display") == "none") {
            $("div[divType=locontent] table tr[trType=details]").css("display", "none");
            $("div[divType=locontent] table tr[trType=show_details]").css("display", "")
            moreTR.css("display", "none");
            detailsTR.css("display", "")
        } else {
            detailsTR.css("display", "none")
        }
    }
   
}

var tipShowDescriptionObj = null;
function onMouseOverShowDescription(o) {
    //var o = o.firstChild;  //$(obj).find("span.tip");
    return;
    if (o.id == null || o.id == "") {
        o.id = randomStringFun(11);
    }
    var descriptionStr = o.parentNode.nextSibling.innerHTML;
    if ($.trim(descriptionStr) == "") {
        return;
    }
    tipShowDescriptionObj = Stip(o.id);
    tipShowDescriptionObj.show({ content: "<div style='font-size:11px;'>" + o.parentNode.nextSibling.innerHTML + "</div>", p: "left" });
}

function onMouseOutShowDescription(o) {
    return;
    if (tipShowDescriptionObj != null) {
        tipShowDescriptionObj.hide();
    }
}

var tipShowKPStatusObj = null;
function onMouseOverShowKPStatusHTML(o) {
    if (o.id == null || o.id == "") {
        o.id = randomStringFun(11);
    }
    tipShowKPStatusObj = Stip(o.id);
    tipShowKPStatusObj.show({ content: "<div style='font-size:11px;'>" + o.nextSibling.innerHTML + "</div>", p: "left" });
}

function onMouseOutShowKPStatusHTML(o) {
    if (tipShowKPStatusObj != null) {
        tipShowKPStatusObj.hide();
    }
}

var tipObjectComm = null;
function onViewStudyResourcesClick(o, itemId) {
    var divStudyResourceListCommContainer = document.getElementById("divStudyResourceListCommContainer");
    if (divStudyResourceListCommContainer == null) {
        //$('<div id="divStudyResourceListCommContainer" style="display:block;position:fixed;left:50%;background-color:red"><div id="divStudyResourceListCommTabContainer">888888</div></div>').appendTo(document.body);
        divStudyResourceListCommContainer = document.createElement("div");
        divStudyResourceListCommContainer.setAttribute("id", "divStudyResourceListCommContainer");
        divStudyResourceListCommTabContainer = document.createElement("div");
        divStudyResourceListCommTabContainer.setAttribute("id", "divStudyResourceListCommTabContainer");
        divStudyResourceListCommContainer.appendChild(divStudyResourceListCommTabContainer);
        document.body.appendChild(divStudyResourceListCommContainer);
        divStudyResourceListCommContainer.style.display = "none";

    }
    if (o.id == null || o.id == "") {
        o.id = randomStringFun(13);
    }
    if (tipObjectComm != null) {
        tipObjectComm.hide();
    }
    tipObjectComm = Stip(o.id);
    tipObjectComm.show({ content: '<div style="text-align:center;">Data is loading...</div>', p: "left", kind: 'view', closeBtn: true });

    if (o.nextSibling.id == null || o.nextSibling.id == "") {
        o.nextSibling.id = randomStringFun(12);
    }
    var tid = o.nextSibling.id;
    var tempStudyResourceArray = getStudyResourcesArrayByLoIdComm(itemId);
    if (tempStudyResourceArray == null || tempStudyResourceArray.length == 0) {
        $excuteWS("~KnowlegeProfileWS.getStudyReferenceWithLoId", { loId: itemId, simpleUser: simpleUser }, function (result, context) {
            addToStudyResourceArrayComm(itemId, result);
            CreateTabsHTML(result, { rootContainerId: "divStudyResourceListCommContainer",
                tabContainerId: "divStudyResourceListCommTabContainer",
                plLoRelated: null, itemId: itemId, itemType: "1",
                userType: "ins_report", //getTempSimpleUser().roleId == "0" ? "ins_report" : "stu_report",
                itemNameId: tid, sourceId: itemId, sourceType: "1",
                objectType: "1", sourceTitleId: tid, hideNotesFlag: true
            });
            tipObjectComm.show({ content: "<div style='width:650px;color:black;background-color:white;'>" + divStudyResourceListCommContainer.innerHTML + "</div>", p: "left", kind: 'view', closeBtn: true });
            divStudyResourceListCommTabContainer.style.width = "100%";
            resetAllGlobalVariables();
        }, null, { userContext: "getStudyReferenceWithLoId" });
    } else {
        CreateTabsHTML(tempStudyResourceArray, { rootContainerId: "divStudyResourceListCommContainer",
            tabContainerId: "divStudyResourceListCommTabContainer",
            plLoRelated: null, itemId: itemId, itemType: "1",
            userType: "ins_report", //getTempSimpleUser().roleId == "0" ? "ins_report" : "stu_report",
            itemNameId: tid, sourceId: itemId, sourceType: "1",
            objectType: "1", sourceTitleId: tid, hideNotesFlag: true
        });
        tipObjectComm.show({ content: "<div style='width:650px;color:black;background-color:white;'>" + divStudyResourceListCommContainer.innerHTML + "</div>", p: "left", kind: 'view', closeBtn: true });
        divStudyResourceListCommTabContainer.style.width = "100%";
        resetAllGlobalVariables();
    }

}
var jsonStudyResourceArray = {};
function addToStudyResourceArrayComm(loId, array) {
    var flag = false;
    for (var key in jsonStudyResourceArray) {
        if (key == loId) {
            flag = true;
            break;
        }
    }
    if (!flag) {
        jsonStudyResourceArray[loId] = array;
    }
}

function getStudyResourcesArrayByLoIdComm(loId) {
    for (var key in jsonStudyResourceArray) {
        if (key == loId) {
            return jsonStudyResourceArray[key];
        }
    }
}

//公用
///绑定到选项卡上（Lo下没有学习资料）。
//必要条件：页面包含此.js文件和function.js文件。
//参数说明：
//ReferenceAnswersWrapperArray是.net的类型ReferenceAnswersWrapper[]。
//loArray是.net的类型StudyGuideItemExtendWrapper[]。
//sectionId是为了绑定Note的链接
//roleId是为了显示Lo的区分老师和学生看个人还是全班的知识状态
//answerTypeId是为了判断Answer的显示方式
//arguments.length==15 && arguments[14]=="-1" 针对question管理里显示lo的界面
function bindTabs(isShowLo, isShowAnswer, isShowSolution, isShowHint, isShowFeedBack, loArray, ReferenceAnswersWrapperArray, solution,
   hint, tabsNode, questionId, sectionId, roleId, answerTypeId, isShowSampleQuestion, questionManageFlag) {
    var tabContentArray = new Array();
    if (isShowLo) {
        if (loArray) {
            loArray.sort(function (e1, e2) {
                return e2.step - e1.step;
                //return e1 > e2 ? -1 : (e1 < e2 ? 1 : 0) 
            });
        }
        tabContentArray.push({ title: "知识点", content: returnLOTable2(loArray, roleId, questionManageFlag) });
    }
    var solutionContainerId;
    if (isShowSolution == true) {
        solutionContainerId = randomChars(20);
        tabContentArray.push({ title: "解题过程", content: "<div id=" + solutionContainerId + ">" + solution+"</div>" });
    }

    if (isShowAnswer == true) {
        var answerStr = createAnswerStrForCorrectAnswer(answerTypeId, ReferenceAnswersWrapperArray, questionId, isShowFeedBack); //调用函数,生成Answer的Html.
        tabContentArray.push({ title: "答案", content: answerStr });
    }

    if (isShowHint == true) {
        tabContentArray.push({ title: "提示", content: hint });
    }
    var showTopButtonFlag = questionManageFlag ? false : true;
    $EmathTab_GetTabView({ tabContainer: tabsNode, showTopButton: showTopButtonFlag, showNullContent: false, defaultTabIndex: 0, tabContent: tabContentArray });
    var solutionO = document.getElementById(solutionContainerId);
    if (isShowSolution && solutionO && (typeof $SHOW_RELATED_LO_addLOToArray == "function" && typeof $SHOW_RELATED_LO_addMouseHoverEvent == "function")) {
        $SHOW_RELATED_LO_addLOToArray(loArray);
        $SHOW_RELATED_LO_addMouseHoverEvent(solutionO);
    }
}

/*
function bindTabs(isShowLo, isShowAnswer, isShowSolution, isShowHint, isShowFeedBack, loArray, ReferenceAnswersWrapperArray, solution,
   hint, tabsNode, questionId, sectionId, roleId, answerTypeId, isShowSampleQuestion, questionManageFlag) {

    var tableStr = null;
    if (isShowLo) {
        tableStr = new Sys.StringBuilder();
        tableStr.append("<table border='0' width='100%'>");
        tableStr.append("<tr>");
        tableStr.append("<td style='width:460px;border:solid 1px rgb(236,233,216);vertical-align:top'>");
        tableStr.append(returnLOTable2(loArray, roleId, questionManageFlag));
        tableStr.append("</td>");
        tableStr.append("<td style='vertical-align:top;border:solid 1px rgb(236,233,216);'>");
    }

    var tabsStr = new Sys.StringBuilder();
    var array = []; //要加载的选项卡名称
    if (isShowLo == true || isShowAnswer == true || isShowSolution == true || isShowHint == true) {
        var radChars = randomChars(20); //随机数
        tabsStr.append(String.format("<div id={0}>", radChars));
        //        if(isShowLo==true)
        //        {
        //            tabsStr.append(String.format("<div class='dhtmlgoodies_aTab'>"));
        //            if(isShowSampleQuestion==null)
        //            {
        //                isShowSampleQuestion=true;
        //            }
        //            var loTableStr="";
        //            if (questionManageFlag) {
        //                loTableStr=returnLOTable(loArray,questionId,roleId,sectionId,isShowSampleQuestion,true);//question管理显示lo
        //            }else{
        //                loTableStr=returnLOTable(loArray,questionId,roleId,sectionId,isShowSampleQuestion);
        //            }
        //            tabsStr.append(loTableStr);
        //            tabsStr.append("</div>");
        //            Array.add(array,"Knowledge");
        //        }

        var solutionContainerId = null;
        if (isShowSolution == true) {
            solutionContainerId = randomChars(20);
            tabsStr.append(String.format("<div id='" + solutionContainerId + "' class='les_tab_sma_box'>"))
            tabsStr.append(solution);
            tabsStr.append("</div>");
            Array.add(array, "Solution");

        }
        if (isShowAnswer == true) {
            tabsStr.append(String.format("<div class='les_tab_sma_box'>"))
            //var answerStr=createAnswerStr(answerTypeId,questionAndAnswer.ReferenceAnswersWrapperArray,questionId,true);
            var answerStr = createAnswerStrForCorrectAnswer(answerTypeId, ReferenceAnswersWrapperArray, questionId, isShowFeedBack); //调用函数,生成Answer的Html.
            tabsStr.append(answerStr);
            tabsStr.append("</div>");
            Array.add(array, "Answer");
        }

        if (isShowHint == true) {
            tabsStr.append(String.format("<div class='les_tab_sma_box'>"))
            tabsStr.append(hint);
            tabsStr.append("</div>");
            Array.add(array, "Hint");
        }
        tabsStr.append(String.format("</div>"));
        if (isShowLo) {
            tableStr.append(tabsStr.toString());
            tableStr.append("</td>");
            tableStr.append("<tr>");
            tabsNode.innerHTML = tableStr.toString();
        } else {
            tabsNode.innerHTML = tabsStr.toString();
        }


        //initTabs(radChars, array, 0, "100%", "auto");
        //$initTabs(radChars, array, tabsStr);
        $initTabs({ containerId: radChars, tabTitles: array, content: tabsStr });

        if (isShowSolution && (typeof $SHOW_RELATED_LO_addLOToArray == "function" && typeof $SHOW_RELATED_LO_addMouseHoverEvent == "function")) {
            $SHOW_RELATED_LO_addLOToArray(loArray);
            $SHOW_RELATED_LO_addMouseHoverEvent(document.getElementById(solutionContainerId));
        }
    }

}
*/


//替换所有空格('&nbsp'或' ')
function replaceAllSpaceToEmpty(objStr) {
    return objStr.replace(/\s|　|&nbsp(;)?/gi, "");
}
//把字符串格式时间转换成时间类型
function toDate(str) {
    return new Date(Date.parse(str));
}

//checkbox的全选和反选验证功能,obj是当前点击的checkbox对象,allSelectBoxId是当前范围内控制全选的checkbox的Id,group是当前范围内除了全选的checkbox之外的所有checkbox对象,期待方式是通过getElementByName获取到的集合
function checkboxSelection(obj, allSelectBoxId, group) {
    if (obj.checked) {
        if (obj.id == allSelectBoxId) {
            for (var i = 0; i < group.length; i++) {
                group[i].checked = true;
            }
        }
        else {
            for (var i = 0; i < group.length; i++) {
                if (!group[i].checked) {
                    break;
                }
                if (i == group.length - 1) {
                    document.getElementById(allSelectBoxId).checked = true;
                }
            }
        }
    }
    else {
        if (obj.id == allSelectBoxId) {
            for (var i = 0; i < group.length; i++) {
                group[i].checked = false;
            }
        }
        else {
            document.getElementById(allSelectBoxId).checked = false;
        }
    }
}


//表格的交叉背景色定义功能,参数列表tbId表格ID,oddClassName,奇数行css类名,evenClassName,偶数行CSS类名,后两个注意是字符串
function altTrClassDefine(tbObj, oddClassName, evenClassName) {
    var tbItem = tbObj.firstChild.childNodes;
    if (tbItem != null && tbItem.length != 0) {
        for (var i = 1; i < tbItem.length; i++) {
            tbItem[i].className = i % 2 == 0 ? evenClassName : oddClassName;
        }
    }
    else {
        return false;
    }
}
//UTC时间转化成本地时间如：Sun Aug 22 16:00:00 UTC+0800 2010 转换成 Mon Aug 23 00:00:00 UTC+0800 2010
function UtcTolocale(time) {
    return new Date(-time.getTimezoneOffset() * 60000 + time.getTime());
}


//解决小数相加出现的误差
function add(arg1, arg2) {
    var r1, r2, m;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    return (arg1 * m + arg2 * m) / m;
}
//除法函数，用来得到精确的除法结果
//说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
//调用：accDiv(arg1,arg2)
//返回值：arg1除以arg2的精确结果
function accDiv(arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
    try { t2 = arg2.toString().split(".")[1].length } catch (e) { }
    with (Math) {
        r1 = Number(arg1.toString().replace(".", ""))
        r2 = Number(arg2.toString().replace(".", ""))
        return (r1 / r2) * pow(10, t2 - t1);
    }
}

//给Number类型增加一个div方法，调用起来更加方便。
Number.prototype.div = function (arg) {
    return accDiv(this, arg);
}

//乘法函数，用来得到精确的乘法结果
//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
//调用：accMul(arg1,arg2)
//返回值：arg1乘以arg2的精确结果
function accMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try { m += s1.split(".")[1].length } catch (e) { }
    try { m += s2.split(".")[1].length } catch (e) { }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}

//给Number类型增加一个mul方法，调用起来更加方便。
Number.prototype.mul = function (arg) {
    return accMul(arg, this);
}

//加法函数，用来得到精确的加法结果
//说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
//调用：accAdd(arg1,arg2)
//返回值：arg1加上arg2的精确结果
function accAdd(arg1, arg2) {
    var r1, r2, m;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2))
    return (arg1 * m + arg2 * m) / m
}



function randomStringFun(l) {

    var x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
    var tmp = new Sys.StringBuilder();
    for (var i = 0; i < l; i++) {
        tmp.append(x.charAt(Math.ceil(Math.random() * 100000000) % x.length));
    }
    return tmp.toString();
}

//给div标签添加圆角效果
function RoundedCorner(_tagetDIV, _bgColor, _cornerColor) {
    //    _cornerColor = _tagetDIV.style.borderColor;
    //    _bgColor = _tagetDIV.style.backgroundColor;
    if (typeof _tagetDIV == "undefined") {
        alert("parameter error.");
        return;
    }
    var targetDivType = (typeof _tagetDIV).toString().toLowerCase();
    var targetDIV = null;
    if ((targetDivType != "object" && targetDivType == "string")) {
        targetDIV = document.getElementById(_tagetDIV);
    } else if ((targetDivType != "string" && targetDivType == "object")) {
        targetDIV = _tagetDIV;
    } else {
        alert("error");
        return;
    }
    if (targetDIV == null) {
        alert("object not exist.");
        return;
    }

    var insertFlag = -1;
    if (targetDIV.firstChild != null) {
        if (targetDIV.firstChild.className != "b_Style" && targetDIV.lastChild.className != "b_Style") {
            insertFlag = 0;
        } else {
            return;
        }
    } else {
        insertFlag = 1;
    }

    _bgColor = typeof _bgColor != "undefined" && _bgColor != null ? _bgColor : "#9BD1FA";
    if (targetDIV.style.backgroundColor != "") {
        _bgColor = targetDIV.style.backgroundColor;
    }
    _cornerColor = typeof _cornerColor != "undefined" && _cornerColor != null ? _cornerColor : "#FFFFFF";
    var childBStyle1 = 'display:block;height: 1px;overflow: hidden;';
    var childBStyle2 = 'background: ' + _bgColor + ';';
    var tm = 'filter:alpha(opacity=30);-moz-opacity:0.3;opacity:1;';
    var childBStyle3 = tm + 'display:block;background: ' + _cornerColor + ';';
    var childBStyle4 = 'margin: 0 5px;';
    var childBStyle5 = 'margin: 0 3px;';
    var childBStyle6 = 'margin: 0 2px;';
    var childBStyle7 = 'margin: 0 1px;height: 2px;';

    var div1HTML = '<div class="b_Style" style="' + childBStyle3 + '"><div style="'
        + childBStyle1 + childBStyle2 + childBStyle4 + '"></div><div style="'
        + childBStyle1 + childBStyle2 + childBStyle5 + '"></div><div style="'
        + childBStyle1 + childBStyle2 + childBStyle6 + '"></div><div style="'
        + childBStyle1 + childBStyle2 + childBStyle7 + '"></div></div> ';

    var div2HTML = '<div class="b_Style" style="' + childBStyle3 + '"><div style="'
        + childBStyle1 + childBStyle2 + childBStyle7 + '"></div><div style="'
        + childBStyle1 + childBStyle2 + childBStyle6 + '"></div><div style="'
        + childBStyle1 + childBStyle2 + childBStyle5 + '"></div><div style="'
        + childBStyle1 + childBStyle2 + childBStyle4 + '"></div></div> ';
    var tempFirstDiv = document.createElement("div");
    tempFirstDiv.innerHTML = div1HTML;
    var firstDIV = tempFirstDiv.firstChild;
    var tempLastDiv = document.createElement("div");
    tempLastDiv.innerHTML = div2HTML;
    var lastDIV = tempLastDiv.firstChild;

    targetDIV.style.backgroundColor = _bgColor;
    if (insertFlag != -1) {
        if (insertFlag == 0) {
            targetDIV.insertBefore(firstDIV, targetDIV.firstChild);
            targetDIV.appendChild(lastDIV);
        } else {
            targetDIV.appendChild(firstDIV);
            targetDIV.appendChild(lastDIV);
        }
    }
}


/*------------------------------------------------------  
*说明：select元素javascript常用操作  
* 1.判断是否存在指定value的Item  
* 2.加入一个Item  
* 3.删除值为value的所有Item  
* 4.删除某一个index的选项  
* 5.更新第index项的value和text  
* 6.设置select中指定text的第一个Item为选中  
* 7.设置select中指定value的第一个Item为选中  
* 8.得到当前选中项的value  
* 9.得到当前选中项的index  
*  10.得到当前选中项的text  
* 11.清空所有选项  
-------------------------------------------------------*/
//1.判断是否存在指定value的Item   
function Select_ExistValue(obj, value) {
    for (var i = 0; i < obj.options.length; i++) {
        if (obj.options[i].value == value) {
            return true;
        }
    }
    return false;
}
//2.加入一个Item   
function Select_AddItem(obj, text, value) {
    var varItem = new Option(text, value);
    obj.options.add(varItem);
}
//3.删除值为value的所有Item   
function Select_RemoveItems(obj, value) {
    for (var i = 0; i < obj.options.length; i++) {
        if (obj.options[i].value == value) {
            obj.remove(i);
        }
    }
}
//4.删除某一个index的选项   
function Select_RemoveItem(obj, index) {
    obj.remove(index);
}

//5.更新第index项的value和text   
function Select_UpdateItem(obj, index, value, text) {
    obj.options[index].value = value;
    obj.options[index].text = text;
}

//6.设置select中指定text的第一个Item为选中   
function Select_SelectItemByText(obj, text) {
    var isExit = false;
    for (var i = 0; i < obj.options.length; i++) {
        if (obj.options[i].text == text) {
            obj.options[i].selected = true;
            return true;
        }
    }
    return false;
}
//7.设置select中指定value的第一个Item为选中   
function Select_SelectItemByValue(obj, value) {
    var isExit = false;
    for (var i = 0; i < obj.options.length; i++) {
        if (obj.options[i].value == value) {
            obj.options[i].selected = true;
            return true;
        }
    }
    return false;

}
//8.得到当前选中项的value，index,text   
function Select_GetValue(obj) {
    return obj.value;
}
//9.得到当前选中项的index   
function Select_GetIndex(obj) {
    return obj.selectedIndex;
}
//10.得到当前选中项的text   
function Select_GetText(obj) {
    return obj.options[obj.selectedIndex].text;
}
//11.清空所有选项   
function Select_Clear(obj) {
    obj.options.length = 0;
}  