/*
   var q= new Question({
      on_answer_selected:function(){
      //选择答案时触发事件
      },
      data:{question:new QuestionWrapper(),answers:[new ReferenceAnswerWrapper()],testerAnswers:[new TesterAnswersWrapper()]}
   });
   q.getBodyAndAnswer(c);//将question的body和answer一起返回,c为容器的jquery对象或js对象，或容器id
   q.getBody(c);//只返回question的body,c为容器的jquery对象或js对象，或容器id
   q.getAnswer(c);//只返回question的answer,c为容器的jquery对象或js对象，或容器id
*/


function Question(d) {
    /// <summary>d:{on_answer_selected:function(){},data:{question:new QuestionWrapper(),answers:[new ReferenceAnswerWrapper()],testerAnswers:[new TesterAnswersWrapper()]}}</summary>
    this.data = null;
    this.answer_sevt_flag = null;//是否已经给答案添加选择事件
    this.on_answer_selected = null; //答案被选择时事件触发

    if (d != null) {
        if (d.data) {
            this.return_type = d.return_type ? d.return_type : 0;
            this.data = d.data;
            this.question_group = Math.random().toString().replace("0.", "");
            this.data.question.orderName = typeof this.data.question.orderName != "undefined" && this.data.question.orderName != null ? this.data.question.orderName + "．" : "";
            this.on_answer_selected = typeof d.on_answer_selected == "function" ? d.on_answer_selected : null;
        }
    }
}

Question.prototype.getBodyAndAnswer = function (c) {
    /// <summary>将question的body和answer一起返回,c为容器的jquery对象或js对象，或容器id</summary>

    var o = this;
    var questionArray = [];
    questionArray.push('<div>' + this.getBody(c) + '</div>')
    questionArray.push(this.getAnswer(c));
    if (!c) {
        return questionArray.join('');
    } else {
        var container = this.toJQueryObject(c);
        container.html(questionArray.join(''));
        if (typeof o.on_answer_selected == "function" && !o.answer_sevt_flag) {
            o.answer_sevt_flag = true;
            container.find("input[class=answer_select]").click(function () {
                o.current = this;
                (o.on_answer_selected)();
            })
        }
    }
}

Question.prototype.getBody = function (c) {
    /// <summary>只返回question的body,c为容器的jquery对象或js对象，或容器id</summary>
    if (!c) {
        var $div = $("<div>" + this.data.question.orderName + this.data.question.content + "</div>");
        
        $div.find("table tr td:empty").html("&nbsp;");
        return $div.html();

        //return this.data.question.orderName + this.data.question.content;
    } else {
        var container = this.toJQueryObject(c);
        container.html('<div>' + this.data.question.content + '</div>');
       
        container.find("table tr td:empty").html("&nbsp;");
    }
}

//未被禁用，考试或练习的时候可以用
Question.prototype.getAnswer = function (c, p) {
    /// <summary>只返回question的answer,c为容器的jquery对象或js对象，或容器id</summary>
    
    var o = this;

    var str = "";
    var kgflag = false;
    
    switch (o.data.question.questionTypeId) {
        case "1": //单选题
        case "3": //判断题
            if (typeof p == "number") {
                if (p == 1 || p == 2 || p == 6 || p==7) {
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
                } else if (p == 3 || p==5) {
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

        if (o.data.answers && o.data.answers.length > 0) {
            var answers = o.data.answers;
            answerArray.push('<table cellpadding="2" cellspacing="0" border="0">');
            for (var i = 0; i < answers.length; i++) {
                answerArray.push('<tr class="tr_kgt">');
                var ck = "";
                if (typeof p == "number") {
                    if ((p != 5 && p!=6) && answers[i].correctFlag == 1) {
                        ck = ' checked="checked" ';
                    } else if (p == 5 || p == 6) {
                        
                        var testerAnswers = o.data.testerAnswers;
                        if (testerAnswers && testerAnswers.length>0 && testerAnswers[0].testerAnswersContent && $.trim(testerAnswers[0].testerAnswersContent) != "") {
                            var _testerAnswers = $.trim(testerAnswers[0].testerAnswersContent).split(",");
                            for (var n = 0; n < _testerAnswers.length; n++) {
                                if (_testerAnswers[n] == answers[i].id) {
                                    ck = ' checked="checked" ';
                                    break;
                                }
                            }
                        }
                    }
                    
                } 
                if (p == 4) {
                    answerArray.push('<td class="input_answer_select" style="vertical-align: top; line-height: 25px; width: 40px;padding-right:0px;">' + (o.data.question.questionTypeId != "3" ? (String.fromCharCode(i + 65) + ".") : "") + '</td>');
                } else {
                    answerArray.push('<td class="input_answer_select" style="vertical-align: top; line-height: 25px; width: 40px;padding-right:0px;"><label for="rd_' + o.data.question.id + "_" + answers[i].id + '" style="display:block;width:100%;margin-right:0px;"><input ' + str + ck + ' class="answer_select" questionid="' + o.data.question.id + '"  value="' + answers[i].id + '" id="rd_' + o.data.question.id + "_" + answers[i].id + '"/>' + (o.data.question.questionTypeId != "3" ? (String.fromCharCode(i + 65) + ".") : "") + '</label></td>');
                }

                answerArray.push('<td class="answer_content" style="vertical-align: top; line-height: 25px;"><label for="rd_' + o.data.question.id + "_" + answers[i].id + '">' + answers[i].content + '</label></td>');
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
        } else if(p==5){
            var testerAnswers2 = o.data.testerAnswers;
            answerArray.push('<div questionid="' + o.data.question.id + '" title="点击这里编辑答案" class="zg_tester_answer">' + (testerAnswers2 && testerAnswers2.length > 0 && $.trim(testerAnswers2[0].testerAnswersContent)!="" ? testerAnswers2[0].testerAnswersContent : "&nbsp;") + '</div>');
        } else if (p == 6) {
            
            var testerAnswers2 = o.data.testerAnswers;
            answerArray.push('<div class="zg_tester_answer">' + (testerAnswers2 && testerAnswers2.length > 0 && $.trim(testerAnswers2[0].testerAnswersContent) != "" ? testerAnswers2[0].testerAnswersContent : "&nbsp;") + '</div>');
        }
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

//用于预览，为禁用状态
Question.prototype.getAnswerView = function (c) {
    return this.getAnswer(c, 1);
}

//用于预览，为禁用状态，正确答案被勾选
Question.prototype.getAnswerCView = function (c) {
   return this.getAnswer(c,2);
}

//默认正确答案被勾选，且答案可编辑
Question.prototype.getAnswerCDView = function (c) {
    return this.getAnswer(c, 3);
}

//用于预览，客观题没有单选或多选按钮
Question.prototype.getAnswerPView = function (c) {
    return this.getAnswer(c, 4);
}

//考试
Question.prototype.getAnswerForTest = function (c) {
    return this.getAnswer(c, 5);
}

//阅卷
Question.prototype.getAnswerForCP = function (c) {
    return this.getAnswer(c, 6);
}

Question.prototype.getAnswerForImport = function (c) {
    return this.getAnswer(c, 7);
}

Question.prototype.getCorrectAnswer = function (c) {
    /// <summary>只返回question的answer,c为容器的jquery对象或js对象，或容器id</summary>

    var container = this.toJQueryObject(c);
    var o = this;
    var str = "";
    var kgflag = false;
    switch (o.data.question.questionTypeId) {
        case "1": //单选题
        case "2": //多项选择题
        case "3": //判断题
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
    var correctAnswerArray = [];
    if (kgflag) {//单选题,判断题,多项选择题
        if (o.data.answers && o.data.answers.length > 0) {
            var answers = o.data.answers;

            for (var i = 0; i < answers.length; i++) {
                if (answers[i].correctFlag == 1) {
                    if (o.data.question.questionTypeId == "3") {
                        correctAnswerArray.push(answers[i].content);
                    } else {
                        correctAnswerArray.push(String.fromCharCode(i + 65) + '、');
                    }
                }
            }
            var lstindex = correctAnswerArray.length>0 && correctAnswerArray[correctAnswerArray.length - 1].lastIndexOf("、");
            if (correctAnswerArray.length>0 && o.data.question.questionTypeId != "3" && lstindex != -1) {
                correctAnswerArray[correctAnswerArray.length - 1] = correctAnswerArray[correctAnswerArray.length - 1].substring(0, lstindex);
            }
        }
    } else {
        if (o.data.answers != null && o.data.answers.length != 0) {
            correctAnswerArray.push(o.data.answers[0].content);
        }
        
    }
    if (!c) {
        var $div = $("<div>" + correctAnswerArray.join('') + "</div>");
        //$div.find("p").each(function () {
        //    var $this = $(this);
        //    if ($this.find("img,table").length == 0 && $.trim($this.text()) == "") {
        //        $this.remove();
        //    }
        //});

        $div.find("table tr td:empty").html("&nbsp;");
        return $div.html();
        //return correctAnswerArray.join('');
    } else {
        container.html(correctAnswerArray.join(''));
        //container.find("p").each(function () {
        //    var $this = $(this);
        //    if ($this.find("img,table").length == 0 && $.trim($this.text()) == "") {
        //        $this.remove();
        //    }
        //});
        container.find("table tr td:empty").html("&nbsp;");
    }
}

Question.prototype.getSolution = function (c) {
    /// <summary>只返回question的solution,c为容器的jquery对象或js对象，或容器id</summary>

    if (!c) {
        var $div = $("<div>" + this.data.question.solution + "</div>");
        //$div.find("p").each(function () {
        //    var $this = $(this);
        //    if ($this.find("img,table").length == 0 && $.trim($this.text()) == "") {
        //        $this.remove();
        //    }
        //});
        $div.find("table tr td:empty").html("&nbsp;");
        return $div.html();
        //return this.data.question.solution;
    } else {
        var container = this.toJQueryObject(c);
        container.html('<div>' + this.data.question.solution + '</div>');
        //container.find("p").each(function () {
        //    var $this = $(this);
        //    if ($this.find("img,table").length == 0 && $.trim($this.text()) == "") {
        //        $this.remove();
        //    }
        //});
        container.find("table tr td:empty").html("&nbsp;");
    }
}

Question.prototype.getTip = function (c) {
    /// <summary>只返回question的tip,c为容器的jquery对象或js对象，或容器id</summary>

    if (!c) {
        var $div = $("<div>" + this.data.question.hint + "</div>");
        //$div.find("p").each(function () {
        //    var $this = $(this);
        //    if ($this.find("img,table").length == 0 && $.trim($this.text()) == "") {
        //        $this.remove();
        //    }
        //});
        $div.find("table tr td:empty").html("&nbsp;");
        return $div.html();
        //return this.data.question.hint;
    } else {
        var container = this.toJQueryObject(c);
        container.html('<div>' + this.data.question.hint + '</div>');
        //container.find("p").each(function () {
        //    var $this = $(this);
        //    if ($this.find("img,table").length == 0 && $.trim($this.text()) == "") {
        //        $this.remove();
        //    }
        //});
        container.find("table tr td:empty").html("&nbsp;");
    }
}

Question.prototype.getKnowledges = function () {
    
}

Question.prototype.toJQueryObject = function (container) {
    ///<summary>得到jquery对象。container:若为字符串ID，或js对象，都将转换为jquery对象</summary>
    var $o = null;
    if (container) {
        if (typeof container == "object") {
            if (container instanceof jQuery) {
                $o = container;
            } else {
                $o = $(container);
            }
        } else if (typeof container == "string") {
            $o = $("#" + container);
        } else {
            $o = container;
        }
    }
    return $o;
}