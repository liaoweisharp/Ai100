/// <reference path="../../Scripts/jquery-1.6.1.min.js" />
/// <reference path="../../Scripts/Question.js" />
//两种错误情况暂未处理：1.试卷题型和答案题型不匹配（试卷中显示：一、单项选择题；答案中则显示：一、答案部分单项选择题）  2.格式不正确（试卷中显示：六、案例分析题 XXX；答案中则显示：37. XXX）
var editor = null;
var editor_pFlag = true;
var testQuestionTypeArray = null;
var $divTestQuestionType;
var $cbxOnlyStudentVisible = null;
var oActiveX = null;
var $chtml = null;
function getActiveXURL() {

    if (location.href.toLowerCase().indexOf("www.aie100.com") != -1) {
        return "http://www.aie100.com/UploadImage.aspx";
    } else {
        //return "http://localhost:5072/AcephericsClient/UploadImage.aspx";
        return "http://localhost:32480/UploadImage.aspx";
        //return "http://192.168.0.110/UploadImage.aspx";
    }
}

function PageLoad() {

    oActiveX = $("#oActiveX").get(0);
    if (typeof oActiveX.isActive == "undefined") {
        $("#divActiveXWarning").show();
    }
    $divTestQuestionType = $("#divTestQuestionType");
    $cbxOnlyStudentVisible = $("#cbxOnlyStudentVisible");
    InitCmsMenu("m_TestImport");
    bindBookInfo();
    $("#selBookList").change(function () {
        var $this = $(this);
        var ISBN = $this.val();
        var _bookId = $this.find("option:selected").attr("id");
        var $tbContentbox = $("#tbContentbox");
        if (ISBN != "-1") {
            $("#divTestImport").show();
            editor.upload_path = "../Uploads/CMS/" + _bookId;
            var bookWrapper = findBookObj(ISBN);
            bindDiscipline(bookWrapper.disciplineId);
            bindSubject(bookWrapper.disciplineId, bookWrapper.subjectId);
            bindTestQuestionTypeList(_bookId)
        } else {
            $("#divTestImport").hide();
        }

    });
    editor = new emath_editor();
    editor.edit_container = "divTestEditor";
    editor.upload_path = "../Uploads/CMS/" + $("#selBookList").find("option:selected").attr("id");
    editor.edit_height = ($(window).height() - 230) + "px";
    editor.show();

    $("div.emath_editor div.aie_editor_mode span[val='preview'],span[val='html']").remove();

    $("#editor_spUploadImage,#editor_spUploadFile").show();
    $("img[click_action='editor_InsertLO']").hide();
    //U({
    //    path: "~", userId: "123456", sectionId: "", complete: function () {

    //    }
    //});

    //if ($("#Sub").val() != -1) {
    //    bindTestQuestionTypeList($("#Sub").val());
    //}
    var testWrapper = {};
    var questionWrapperArray = new Array();
    var referenceAnswersWrapperArray = new Array();
    $("#btnTestPreview,#btnQuestionPreview").click(function () {
        var btn_id = $(this).attr("id");
        var it_bookId = $("#selBookList").find("option:selected").attr("id");
        var re_qb = new RegExp($("#txtQuestionBody").val(), "gi");//题设
        var re_ra = new RegExp($("#txtReferenceAnswer").val(), "gi");//参考答案
        var re_a = new RegExp($("#txtCorrectAnswer").val(), "gi");//正确答案
        var re_s = new RegExp($("#txtSolution").val(), "gi");//解题过程
        var re_t = new RegExp($("#txtHint").val(), "gi");//提示

        testWrapper = {};
        testWrapper.bookId = it_bookId;
        testWrapper.score = $("#txtTestScore").val();
        testWrapper.timeLength = $("#txtTestTime").val();
        testWrapper.title = $.trim($("#txtAreaTestTitle").val());
        testWrapper.difficulty = $("#ddlDifficulty").val();
        if ($("#rdSaveTest").is(":checked")) {
            //if ($.trim(testWrapper.title) == "") {
            //    $.jBox.tip("还没有设置试卷名称！", "warning");
            //    return;
            //}

            if ($.trim(testWrapper.score) == "") {
                $.jBox.tip("还没有设置考试分数！", "warning");
                return;
            }

            if ($.trim(testWrapper.timeLength) == "") {
                $.jBox.tip("还没有设置考试时间！", "warning");
                return;
            }

        }

        questionWrapperArray = [];
        referenceAnswersWrapperArray = [];
        if ($chtml == null || $.trim($chtml.text()) == "") {
            return;
        }

        $chtml = $("<span>" + editor.html() + "</span>");
        $chtml.find("table,img").each(function () {
            var imgHTML1 = $("<span></span>").append($(this).clone()).html();
            var imgHTML2 = imgHTML1.replace(/</gi, "@[!").replace(/>/gi, "!]@").replace(/\./gi, "@[.]@");
            $(this).replaceWith(imgHTML2);
            //$(this).replaceWith('@[!img alt="" src="'+$(this).attr("src")+'" /!]@');
        });

        //$chtml.find("table").each(function () {
        //    var tbHTML1 = $("<span></span>").append($(this).clone()).html();
        //    var tbHTML2 = tbHTML1.replace(/</gi, "@[!").replace(/>/gi, "!]@").replace(/\./gi, "@[.]@");
        //    $(this).replaceWith(tbHTML2);
        //});

        //$chtml.find("p").each(function () {
        //    //var tbHTML1 = $("<span></span>").append($(this).clone()).html();
        //    //var tbHTML2 = tbHTML1.replace(/</gi, "@[!").replace(/>/gi, "!]@").replace(/\./gi, "@[.]@");
        //    var phtml = $(this).html();
        //    $(this).removeAttr().replaceWith("<content>"+phtml+"</content>");
        //});
        //
        //$chtml.find("p").removeAttr("class").removeAttr("style").each(function () {
        //    var $this = $(this);
        //    if ($this.find("img,table").length==0 && $.trim($this.text()) == "") {
        //        $this.remove();
        //    }
        //});


        $chtml.html($chtml.html().replace(/<p>/gi, "@[!p!]@").replace(/<\/p>/gi, "@[!/p!]@").replace(/<br\/>/gi, "@[!br/!]@"));//.replace(/<p\/>|<o:p>|<\/o:p>/gi, "")
        //$chtml.children().removeAttr();
        //$chtml.html().replace(/</gi, "@[!").replace(/>/gi, "!]@");
        var _html = $.trim($chtml.text());
        var testHTML = "";
        var answerHTML = "";
        if (testQuestionTypeArray) {
            var lstIndex = _html.lastIndexOf(testQuestionTypeArray[0]);
            if (_html.indexOf(testQuestionTypeArray[0]) != lstIndex) {
                testHTML = _html.substr(0, lstIndex)
                if (btn_id == "btnTestPreview") {
                    answerHTML = _html.substr(lstIndex);
                }
            } else {
                testHTML = $.trim($chtml.text());
            }
        }

        var inputValues = new Array();
        $("#divTestQuestionType").find("div[test_question_type_id]").each(function () {

            var input0 = $(this).find("input[index=0]");
            if ($.trim(input0.val()) != "") {
                inputValues.push({ difficulty: $(this).attr("difficulty"), questionTypeId: $(this).attr("question_type_id"), testQuestionTypeId: $(this).attr("test_question_type_id"), testQuestionTypeValue: $.trim(input0.val()), scoreValue: $.trim($(this).find("input[index=1]").val()) });
            }
        });
        var haveAnswerFlag = false;
        if (inputValues.length > 0 && $.trim(testHTML) != "") {
            var xuhao1 = 1;

            for (var i = 0; i < testHTML.length; i++) {
                var index1 = -1;
                var len = 0;
                var inputValue = null;
                for (var j = 0; j < inputValues.length; j++) {
                    index1 = testHTML.indexOf(inputValues[j].testQuestionTypeValue);
                    if (index1 != -1) {
                        len = inputValues[j].testQuestionTypeValue.length;
                        inputValue = inputValues[j];
                        break;
                    }
                }

                var tx = "";
                if (index1 == -1) {
                    tx = testHTML.substr(0);
                } else {
                    var _testHTML = testHTML.substr(index1 + len);
                    var index2 = testHTML.length - 1;
                    for (var j = 0; j < inputValues.length; j++) {
                        var index = _testHTML.indexOf(inputValues[j].testQuestionTypeValue);
                        if (index != -1 && index < index2) {
                            index2 = index;
                        }
                    }
                    tx = testHTML.substring(index1, index2 + index1 + len);
                }


                if (index1 == -1 && index2 > 0) {//考试名称
                    if (testWrapper.title == "") {
                        testWrapper.title = tx ? $("<span>" + $.trim(tx).replace(/@\[!/gi, "<").replace(/\!]@/gi, ">").replace(/@\[.]@/gi, ".") + "</span>").text() : "";
                        $("#txtAreaTestTitle").val(testWrapper.title);
                    }

                } else { //某题型相关字符串

                    var arr = tx.split(re_qb);//题设
                    var instructorOnly = $cbxOnlyStudentVisible.is(":checked") ? "0" : "1";
                    for (var m = 1; m < arr.length; m++) {

                        var questionWrapper = {};
                        questionWrapper.id = randomStringFun(20);
                        questionWrapper.algorithmFlag = "0";
                        //questionWrapper.autoConfirmCorrectFlag = "0";
                        questionWrapper.bookId = it_bookId;
                        questionWrapper.createdDate = "";
                        //questionWrapper.description = null;
                        // questionWrapper.exQuestionId = null;
                        questionWrapper.flag = "1";
                        //questionWrapper.groupId = null;

                        //questionWrapper.instraction = null;
                        questionWrapper.instructorOnly = instructorOnly;
                        questionWrapper.sampleFlag = "0";
                        //questionWrapper.thinkFlag = "0";
                        questionWrapper.answerFlag = "1";
                        //questionWrapper.orderName = null;
                        questionWrapper.parentId = questionWrapper.id;//非子母题 指向自己
                        questionWrapper.questionOrder = 1;
                        questionWrapper.questionTypeTitle = null;
                        questionWrapper.testQuestionTypeId = inputValue.testQuestionTypeId;
                        questionWrapper.questionTypeId = inputValue.questionTypeId;
                        questionWrapper.score = inputValue.scoreValue;

                        questionWrapper.structureId = null;
                        //questionWrapper.subOrderName = null;
                        questionWrapper.systemId = SimpleUser.systemId;
                        questionWrapper.testQuestionOrder = null;
                        questionWrapper.testQuestionOrderName = null;
                        questionWrapper.testQuestionTypeDescription = null;

                        // questionWrapper.questionLogicTypeId = "1";
                        questionWrapper.difficulty = inputValue.difficulty;
                        //questionWrapper.discriminator = null;
                        //questionWrapper.guessFactor = null;
                        questionWrapper.structureType = null;
                        //questionWrapper.testQuestionTypeTitle = null;
                        //questionWrapper.title = null;
                        questionWrapper.questionAnswersFlag = (questionWrapper.parentFlag == "1" || questionWrapper.questionTypeId == "12") ? "0" : "1";//5子母题
                        questionWrapper.userId = SimpleUser.userId;

                        var indexarr = new Array();

                        var aindex = arr[m].search(re_a);//正确答案
                        if (aindex != -1) {
                            indexarr.push({ key: "aindex", index: aindex, content: $("#txtCorrectAnswer").val() });
                        }
                        var sindex = arr[m].search(re_s);//解题过程
                        if (sindex != -1) {
                            indexarr.push({ key: "sindex", index: sindex, content: $("#txtSolution").val() });
                        }
                        var tindex = arr[m].search(re_t);//提示
                        if (tindex != -1) {
                            indexarr.push({ key: "tindex", index: tindex, content: $("#txtHint").val() });
                        }

                        indexarr.sort(function (o1, o2) {
                            return o1.index - o2.index;
                        });

                        var a = "", s = "", t = "";
                        for (var k = 0; k < indexarr.length; k++) {
                            if (k + 1 < indexarr.length) {
                                if (indexarr[k].key == "aindex") {
                                    a = arr[m].substring(indexarr[k].index + indexarr[k].content.length, indexarr[k + 1].index);
                                } else if (indexarr[k].key == "sindex") {
                                    s = arr[m].substring(indexarr[k].index + indexarr[k].content.length, indexarr[k + 1].index);
                                } else if (indexarr[k].key == "tindex") {
                                    t = arr[m].substring(indexarr[k].index + indexarr[k].content.length, indexarr[k + 1].index);
                                }
                            } else if (k + 1 == indexarr.length) {
                                if (indexarr[k].key == "aindex") {
                                    a = arr[m].substring(indexarr[k].index + indexarr[k].content.length);
                                } else if (indexarr[k].key == "sindex") {
                                    s = arr[m].substring(indexarr[k].index + indexarr[k].content.length);
                                } else if (indexarr[k].key == "tindex") {
                                    t = arr[m].substring(indexarr[k].index + indexarr[k].content.length);
                                }
                            }
                        }
                        questionWrapper.solution = $.trim(s);
                        questionWrapper.hint = $.trim(t);

                        if (questionWrapper.questionTypeId == "1" || questionWrapper.questionTypeId == "2") {//单项选择题或多项选择题
                            var arr1 = arr[m].split(re_ra);//参考答案
                            questionWrapper.content = $.trim(arr1[0]);
                            //questionWrapperArray.push(questionWrapper);

                            for (n = 1; n < arr1.length; n++) {
                                var referenceAnswerWrapper = {};

                                if (n == arr1.length - 1) {

                                    var _maindex = arr1[n].search(re_a);//正确答案
                                    if (_maindex != -1) {
                                        arr1[n] = arr1[n].substring(0, _maindex);
                                    }
                                }
                                referenceAnswerWrapper.content = arr1[n] ? $.trim(arr1[n]).replace(/@\[!/gi, "<").replace(/\!]@/gi, ">").replace(/@\[.]@/gi, ".") : "";
                                referenceAnswerWrapper.correctFlag = $.trim(a).toUpperCase().indexOf(String.fromCharCode(n + 64)) != -1 ? '1' : '0';
                                referenceAnswerWrapper.feedback = null;
                                referenceAnswerWrapper.id = null;
                                referenceAnswerWrapper.orderName = null;
                                referenceAnswerWrapper.questionId = questionWrapper.id;
                                referenceAnswerWrapper.selectCount = null;
                                referenceAnswersWrapperArray.push(referenceAnswerWrapper);
                                referenceAnswerWrapper.xuhao = xuhao1;

                            }

                        } else if (questionWrapper.questionTypeId == "3") {//判断题
                            var _tindex = a.indexOf("@[!");
                            if (_tindex != -1 && _tindex != 0) {
                                a = a.substring(0, _tindex);
                            }
                            if (aindex != -1) {
                                questionWrapper.content = $.trim(arr[m].substring(0, aindex));
                            } else {
                                questionWrapper.content = $.trim(arr[m].substring(0));
                            }
                            var referenceAnswerWrapper1 = {};
                            referenceAnswerWrapper1.content = "正确";
                            referenceAnswerWrapper1.correctFlag = ($.trim(a) == "对") || ($.trim(a) == "正确") || ($.trim(a.toUpperCase()) == "A") || ($.trim(a) == "√") ? '1' : '0';
                            referenceAnswerWrapper1.feedback = null;
                            referenceAnswerWrapper1.id = null;
                            referenceAnswerWrapper1.orderName = null;
                            referenceAnswerWrapper1.questionId = questionWrapper.id;
                            referenceAnswerWrapper1.selectCount = null;
                            referenceAnswersWrapperArray.push(referenceAnswerWrapper1);
                            referenceAnswerWrapper1.xuhao = xuhao1;

                            var referenceAnswerWrapper2 = {};
                            referenceAnswerWrapper2.content = "错误";
                            referenceAnswerWrapper2.correctFlag = ($.trim(a) == "错") || ($.trim(a) == "错误") || ($.trim(a.toUpperCase()) == "B") || ($.trim(a) == "×") ? '1' : '0';//referenceAnswerWrapper1.correctFlag == '1' ? '0' : '1'; //($.trim(a) == "错误") || ($.trim(a.toUpperCase()) == "B")|| ($.trim(a) == "×") ? '1' : '0';
                            referenceAnswerWrapper2.feedback = null;
                            referenceAnswerWrapper2.id = null;
                            referenceAnswerWrapper2.orderName = null;
                            referenceAnswerWrapper2.questionId = questionWrapper.id;
                            referenceAnswerWrapper2.selectCount = null;
                            referenceAnswersWrapperArray.push(referenceAnswerWrapper2);
                            referenceAnswerWrapper2.xuhao = xuhao1;

                        } else {//证明题，简答题，填空题
                            if (aindex != -1) {
                                questionWrapper.content = $.trim(arr[m].substring(0, aindex));
                            } else {
                                questionWrapper.content = $.trim(arr[m].substring(0));
                            }
                            var referenceAnswerWrapper = {};
                            referenceAnswerWrapper.correctFlag = '1';
                            referenceAnswerWrapper.feedback = null;
                            referenceAnswerWrapper.id = null;
                            referenceAnswerWrapper.orderName = null;
                            referenceAnswerWrapper.questionId = questionWrapper.id;
                            referenceAnswerWrapper.selectCount = null;
                            if ($.trim(a) != "") {
                                referenceAnswerWrapper.content = a ? $.trim(a).replace(/@\[!/gi, "<").replace(/\!]@/gi, ">").replace(/@\[.]@/gi, ".") : "";
                            }
                            referenceAnswersWrapperArray.push(referenceAnswerWrapper);
                            referenceAnswerWrapper.xuhao = xuhao1;
                        }
                        questionWrapper.content = questionWrapper.content ? questionWrapper.content.replace(/@\[!/gi, "<").replace(/\!]@/gi, ">").replace(/@\[.]@/gi, ".") : "";
                        questionWrapper.solution = questionWrapper.solution ? questionWrapper.solution.replace(/@\[!/gi, "<").replace(/\!]@/gi, ">").replace(/@\[.]@/gi, ".") : "";
                        questionWrapper.hint = questionWrapper.hint ? questionWrapper.hint.replace(/@\[!/gi, "<").replace(/\!]@/gi, ">").replace(/@\[.]@/gi, ".") : "";
                        // questionWrapper.title = questionWrapper.title ? questionWrapper.title.replace(/@\[!/gi, "<").replace(/\!]@/gi, ">").replace(/@\[.]@/gi, ".") : "";
                        //questionWrapper.instraction = questionWrapper.instraction ? questionWrapper.instraction.replace(/@\[!/gi, "<").replace(/\!]@/gi, ">").replace(/@\[.]@/gi, ".") : "";
                        //questionWrapper.description = questionWrapper.description ? questionWrapper.description.replace(/@\[!/gi, "<").replace(/\!]@/gi, ">").replace(/@\[.]@/gi, ".") : "";
                        questionWrapper.unit = questionWrapper.unit ? questionWrapper.unit.replace(/@\[!/gi, "<").replace(/\!]@/gi, ">").replace(/@\[.]@/gi, ".") : "";
                        questionWrapper.xuhao = xuhao1;
                        questionWrapperArray.push(questionWrapper);
                        xuhao1++;
                    }

                }
                testHTML = testHTML.replace(tx, "");

                if ($.trim(testHTML) == "") {
                    break;
                } else {
                    i = -1;
                }

                continue;

            }

            
            /*设置正确答案*/
            if (answerHTML != "" && referenceAnswersWrapperArray.length != 0) {
                haveAnswerFlag = true;
                var xuhao2 = 1;
                var tempindex = 0;
                for (var i = 0; i < answerHTML.length; i++) {
                    var index1 = -1;
                    var len = 0;
                    var inputValue = null;
                    for (var j = 0; j < inputValues.length; j++) {
                        index1 = answerHTML.indexOf(inputValues[j].testQuestionTypeValue);
                        if (index1 != -1) {
                            
                            len = inputValues[j].testQuestionTypeValue.length;
                            inputValue = inputValues[j];
                            break;
                        }
                    }

                    var tx = "";
                    if (index1 == -1) {
                        tx = answerHTML.substr(0);
                    } else {
                        var _testHTML = answerHTML.substr(index1 + len);
                        var index2 = answerHTML.length - 1;
                        for (var j = 0; j < inputValues.length; j++) {
                            var index = _testHTML.indexOf(inputValues[j].testQuestionTypeValue);
                            if (index != -1 && index < index2) {
                                index2 = index;
                            }
                        }
                        tx = answerHTML.substring(index1, index2 + index1 + len);
                    }
                    var arr = tx.split(re_qb);//题设

                    for (var m = 1; m < arr.length; m++) {
                        var indexarr = new Array();

                        var aindex = arr[m].search(re_a);//正确答案
                        if (aindex != -1) {
                            indexarr.push({ key: "aindex", index: aindex, content: $("#txtCorrectAnswer").val() });
                        } else {
                            indexarr.push({ key: "aindex", index: 0, content: "" });
                        }
                        var sindex = arr[m].search(re_s);//解题过程
                        if (sindex != -1) {
                            indexarr.push({ key: "sindex", index: sindex, content: $("#txtSolution").val() });
                        }

                        var tindex = arr[m].search(re_t);//提示
                        if (tindex != -1) {
                            indexarr.push({ key: "tindex", index: tindex, content: $("#txtHint").val() });
                        }

                        indexarr.sort(function (o1, o2) {
                            return o1.index - o2.index;
                        });

                        var a = "", s = "", t = "";
                        for (var k = 0; k < indexarr.length; k++) {
                            if (k + 1 < indexarr.length) {
                                if (indexarr[k].key == "aindex") {
                                    a = arr[m].substring(indexarr[k].index + indexarr[k].content.length, indexarr[k + 1].index);
                                } else if (indexarr[k].key == "sindex") {
                                    s = arr[m].substring(indexarr[k].index + indexarr[k].content.length, indexarr[k + 1].index);
                                } else if (indexarr[k].key == "tindex") {
                                    t = arr[m].substring(indexarr[k].index + indexarr[k].content.length, indexarr[k + 1].index);
                                }
                            } else if (k + 1 == indexarr.length) {
                                if (indexarr[k].key == "aindex") {
                                    if (indexarr[k].content.length == 0 && indexarr[k].index == 0) {
                                        a = arr[m].substring(indexarr[k].index + indexarr[k].content.length);
                                        if ((inputValue.questionTypeId == "1" || inputValue.questionTypeId == "2") && a.indexOf("@") != -1) {
                                            a = a.substring(0, a.indexOf("@"));
                                        }
                                    } else {
                                        a = arr[m].substring(indexarr[k].index + indexarr[k].content.length);
                                    }

                                } else if (indexarr[k].key == "sindex") {
                                    s = arr[m].substring(indexarr[k].index + indexarr[k].content.length);
                                } else if (indexarr[k].key == "tindex") {
                                    t = arr[m].substring(indexarr[k].index + indexarr[k].content.length);
                                }
                            }
                        }
                        if (!questionWrapperArray[xuhao2 - 1]) {
                            if (btn_id == "btnQuestionPreview") {
                                $.jBox('<div style="padding:5px;">1. 试卷中题型和提供的答案中的题型不匹配<br/>2. 试卷和提供的答案中对应题型下面的小题参数不匹配<br/>3. 试卷中存在与识别参数相同的特殊字符<br/>4. 参考答案所选择的识别参数不正确</div></div>', { title: "没有正确识别出试题，可能有以下情况：", buttons: {} });
                            } else {
                                $("#btnQuestionPreview").trigger("click");
                            }
                            return;
                        }
                        var xx = 0;
                        questionWrapperArray[xuhao2 - 1].solution = s ? s.replace(/@\[!/gi, "<").replace(/\!]@/gi, ">").replace(/@\[.]@/gi, ".") : "";
                        questionWrapperArray[xuhao2 - 1].tip = t ? t.replace(/@\[!/gi, "<").replace(/\!]@/gi, ">").replace(/@\[.]@/gi, ".") : "";
                        //questionWrapperArray[xuhao2 - 1].solution = s;
                        //questionWrapperArray[xuhao2 - 1].solution = t;
                        for (var r = tempindex; r < referenceAnswersWrapperArray.length; r++) {
                            if (referenceAnswersWrapperArray[r].xuhao == xuhao2) {
                                if (inputValue.questionTypeId == "1" || inputValue.questionTypeId == "2") {

                                    if ($.trim(a).indexOf(String.fromCharCode(xx + 65)) != -1) {
                                        referenceAnswersWrapperArray[r].correctFlag = "1";
                                    } else {
                                        referenceAnswersWrapperArray[r].correctFlag = "0";
                                    }
                                    xx++;
                                } else if (inputValue.questionTypeId == "3") {
                                    //($.trim(a) == "对") || ($.trim(a) == "正确") || ($.trim(a.toUpperCase()) == "A")|| ($.trim(a) == "√")
                                    //($.trim(a) == "错") || ($.trim(a) == "错误") || ($.trim(a.toUpperCase()) == "B") || ($.trim(a) == "×")
                                    var za = $.trim(a);
                                    if (za.indexOf("@") != -1) {
                                        za = za.substring(0, za.indexOf("@"))
                                    }
                                    if ((za == "对") || (za == "正确") || (za.toUpperCase() == "A") || (za == "√")) {
                                        if (referenceAnswersWrapperArray[r].content == "正确") {
                                            referenceAnswersWrapperArray[r].correctFlag = "1";
                                        } else {
                                            referenceAnswersWrapperArray[r].correctFlag = "0";
                                        }
                                    } else if ((za == "错") || (za == "错误") || (za.toUpperCase() == "B") || (za == "×")) {
                                        if (referenceAnswersWrapperArray[r].content == "错误") {
                                            referenceAnswersWrapperArray[r].correctFlag = "1";
                                        } else {
                                            referenceAnswersWrapperArray[r].correctFlag = "0";
                                        }
                                    }
                                } else {
                                    referenceAnswersWrapperArray[r].correctFlag = "1";
                                    referenceAnswersWrapperArray[r].content = a ? $.trim(a).replace(/@\[!/gi, "<").replace(/\!]@/gi, ">").replace(/@\[.]@/gi, ".") : null;
                                }

                                if (r + 1 <= referenceAnswersWrapperArray.length - 1 && referenceAnswersWrapperArray[r + 1].xuhao != referenceAnswersWrapperArray[r].xuhao) {
                                    delete referenceAnswersWrapperArray[r].xuhao;
                                    tempindex = r + 1;

                                    break;
                                }
                                delete referenceAnswersWrapperArray[r].xuhao;

                            }
                        }
                        xuhao2++;
                    }

                    answerHTML = answerHTML.replace(tx, "");

                    if ($.trim(answerHTML) == "") {
                        break;
                    } else {
                        i = -1;
                    }

                    continue;
                }
            }


        }

        if ($.trim(testWrapper.title) == "") {
            $.jBox.tip("还没有设置试卷名称！", "warning");
            return;
        }

        var qstr = new Array();
        var qorder = 0;
        var subjectiveFlag = "0";
        var kgt_rcflag = true;//客观题中有无指定正确答案
        var txTitle = "";
        qstr.push('<div style="font-size:20px;text-align:center;font-weight:bold;">' + testWrapper.title + '</div>');
        for (var q = 0; q < questionWrapperArray.length; q++) {
            var raArr = new Array();
            var _rcflag = false;
            for (var r = 0; r < referenceAnswersWrapperArray.length; r++) {
                if (referenceAnswersWrapperArray[r].questionId == questionWrapperArray[q].id) {
                    if (typeof referenceAnswersWrapperArray[r].xuhao != "undefined") {
                        delete referenceAnswersWrapperArray[r].xuhao;
                    }

                    if (referenceAnswersWrapperArray[r].content == null) {
                        referenceAnswersWrapperArray[r].content = "";
                    }
                    if (!_rcflag && referenceAnswersWrapperArray[r].correctFlag == "1") {
                        _rcflag = true;
                    }
                    raArr.push(referenceAnswersWrapperArray[r]);
                }
            }

            for (var f = 0; f < inputValues.length; f++) {
                if (questionWrapperArray[q].testQuestionTypeId == inputValues[f].testQuestionTypeId) {
                    qstr.push('<div style="margin-top:10px;font-weight:bold;">' + inputValues[f].testQuestionTypeValue + '</div>');
                    txTitle = inputValues[f].testQuestionTypeValue;
                    inputValues.splice(f, 1);
                    qorder = 0
                    break;
                }
            }
            qorder++;
            questionWrapperArray[q].orderName = qorder;
            if (questionWrapperArray[q].questionTypeId != "1" && questionWrapperArray[q].questionTypeId != "2" && questionWrapperArray[q].questionTypeId != "3") {
                subjectiveFlag = "1";
            }
            if (subjectiveFlag == "0" && !_rcflag) {
                kgt_rcflag = false;
            }

            if (subjectiveFlag == "0" && raArr.length == 0) {
                //$.jBox('<div style="padding:5px;">' + txTitle + '，第' + qorder + '小题：<br/>&nbsp;&nbsp;&nbsp;1. 该题没有参考答案<br/>&nbsp;&nbsp;&nbsp;2. 参考答案所选择的识别参数不正确<br/>&nbsp;&nbsp;&nbsp;3. 参考答案格式不统一' + '</div>', { title: "没有正确识别出参考答案，可能有以下情况：" });
                // $.jBox('<div style="padding:5px;">1. 存在有题没有设置参考答案<br/>2. 参考答案所选择的识别参数不正确<br/>3. 参考答案格式不统一<br/>4. 试卷中题型和提供的答案中的题型不匹配</div>', { title: "没有正确识别出参考答案，可能有以下情况：", buttons: {} });
                if (btn_id == "btnQuestionPreview") {
                    $.jBox('<div style="padding:5px;">1. 存在有题没有设置参考答案<br/>2. 参考答案所选择的识别参数不正确<br/>3. 参考答案格式不统一<br/>4. 试卷中题型和提供的答案中的题型不匹配</div>', { title: "没有正确识别出参考答案，可能有以下情况：", buttons: {} });
                    //$.jBox('<div style="padding:5px;">1. 试卷中题型和提供的答案中的题型不匹配<br/>2. 试卷和提供的答案中对应题型下面的小题参数不匹配<br/>3. 试卷中存在与识别参数相同的特殊字符<br/>4. 参考答案所选择的识别参数不正确</div></div>', { title: "没有正确识别出试题，可能有以下情况：", buttons: {} });
                } else {
                    $("#btnQuestionPreview").trigger("click");
                }
                return;
            }
            var question = new Question({ data: { question: questionWrapperArray[q], answers: raArr } });
            qstr.push('<div style="margin-top:10px">' + question.getBody() + '</div>');
            qstr.push('<div style="margin-top:5px;">' + question.getAnswerForImport() + '</div>');
            var correctAnswerHTML = question.getCorrectAnswer();
            if ($.trim(correctAnswerHTML) != "") {
                qstr.push('<div style="margin-top:5px;font-size:15px;"><strong>' + $("#txtCorrectAnswer").val() + '</strong>' + correctAnswerHTML + '</div>');
            }

            if ($.trim(questionWrapperArray[q].solution) != "") {
                qstr.push('<div style="margin-top:5px;font-size:15px;"><strong>' + $("#txtSolution").val() + '</strong>' + question.getSolution() + '</div>');
            }
            if ($.trim(questionWrapperArray[q].hint) != "") {
                qstr.push('<div style="margin-top:5px;font-size:15px;"><strong>' + $("#txtHint").val() + '</strong>' + question.getTip() + '</div>');
            }
        }
        if (!questionWrapperArray || questionWrapperArray.length == 0) {
            // $.jBox.tip("没有识别出题的存在，请认真检查设置或录入信息是否有误。", "warning");
            
            if (btn_id == "btnQuestionPreview") {
                $.jBox('<div style="padding:5px;">1. 试卷中题型和提供的答案中的题型不匹配<br/>2. 试卷和提供的答案中对应题型下面的小题参数不匹配<br/>3. 试卷中存在与识别参数相同的特殊字符<br/>4. 参考答案所选择的识别参数不正确</div>', { title: "没有识别出题的存在，可能有以下情况：", buttons: {} });
                //$.jBox('<div style="padding:5px;">1. 试卷中题型和提供的答案中的题型不匹配<br/>2. 试卷和提供的答案中对应题型下面的小题参数不匹配<br/>3. 试卷中存在与识别参数相同的特殊字符<br/>4. 参考答案所选择的识别参数不正确</div></div>', { title: "没有正确识别出试题，可能有以下情况：", buttons: {} });
            } else {
                $("#btnQuestionPreview").trigger("click");
            }
            return;
        }

        var bottomText = "";
        if (!kgt_rcflag) {
            if (haveAnswerFlag) {
                bottomText = '<span id="spWarning" style="color:red;font-size:14px;"><strong>提醒：</strong>试题中存在没有设置正确答案的题，可能是答案部分不正确</span>';
            } else {
                bottomText = '<span id="spWarning" style="color:red;font-size:14px;"><strong>提醒：</strong>试题中存在没有设置正确答案的题</span>';
            }
        }

        $("#divTestPreview").remove();
        
        var buttons = { '保存': 1, '关闭': 0 };
        if (btn_id == "btnQuestionPreview" || (haveAnswerFlag && !kgt_rcflag)) {
            buttons = { '关闭': 0 };
        }
        //$(document.body).append($("<div id='divTestPreview' style='position:absolute;left:0px;top:0px;background:#fff;width:1000px;border:1px solid #888;padding:5px;overflow:auto;height:800px;'><input type='button' value='hide' onclick='$(this).parent().remove()'/><br/>" + qstr.join('') + "</div>"));
        $.jBox("<div id='divTestPreview' style='padding:5px;font-family: \"Microsoft YaHei\"; font-size: 15px;'>" + qstr.join('') + "</div>", {
            id: "jbox_TestPreview", bottomText: bottomText, width: 1000, height: 550, title: "试卷预览", buttons: buttons, submit: function (v, h, f) {
                if (v == 0) {
                    return true;
                } else {
                    var _testWrapper = null;

                    if ($("#rdSaveTest").is(":checked")) {
                        _testWrapper = {};
                        for (var key in testWrapper) {
                            _testWrapper[key] = testWrapper[key];
                        }
                    }
                    //if ($("#rdSaveTest").is(":checked")) {

                    _testWrapper.subjectiveFlag = subjectiveFlag;
                    $excuteWS("~CmsWS.saveAutoTest", { test: _testWrapper, questions: questionWrapperArray, reAnswers: referenceAnswersWrapperArray, userExtendWrapper: SimpleUser }, function (r) {
                        if (r) {
                            if (_testWrapper != null) {
                                $.jBox.tip("你所录入的试卷信息已经成功保存。", "success");
                            } else {
                                $.jBox.tip("你所录入的题已经成功保存。", "success");
                            }
                            $("#txtAreaTestTitle").val("");
                            //$("div.setting1,div.setting2").find("input[type=text]").val("");
                            $.jBox.close('jbox_TestPreview');
                        } else {
                            if (_testWrapper != null) {
                                $.jBox.tip("试卷保存失败，请认真检查录入信息是否有误。", "error");
                            } else {
                                $.jBox.tip("保存题失败，请认真检查录入信息是否有误。", "error");
                            }
                        }
                        return true;
                    }, null, { userContext: "getTestQuestionTypeListBySubject" });
                    //} else if ($("#rdSaveQuesions").is(":checked")) {
                    //    $excuteWS("~CmsWS.saveQuestion", { questionWrapperArray: questionWrapperArray, loQuestionWrapperArray: [], referenceAnswerWrapperArray: referenceAnswersWrapperArray, userExtend: SimpleUser }, function (r) {
                    //        if (r) {
                    //            $.jBox.tip("你所录入的题已成功保存。", "success");
                    //            $("#txtAreaTestTitle").val("");
                    //            $("div.setting1,div.setting2").find("input[type=text]").val("");
                    //        } else {
                    //            $.jBox.tip("题保存失败，请认真检查录入信息是否有误。", "error");
                    //        }
                    //        return true;
                    //    }, null, { userContext: "saveQuestion" });
                    //    //CmsWS.saveQuestion(questionWrapperArray, [], referenceAnswerWrapperArray, simpleUser, onQuestionManagePageSuccessed, onQuestionManagePageFailed, { userContext: "saveQuestion" }, null);
                    //}

                }
                return false;
            }
        });

    });
    var $setting3 = $("#divTestImport div.setting3");
    $setting3.find("input.underline").click(function () {
        $("div.sbTX").hide();
        var $sbTX = $(this).parent().next();
        if ($sbTX.find("div.sbTX_item").length != 0) {
            $(this).parent().next().show();
        }
    });

    $setting3.find("div.sbTX div.sbTX_item").click(function () {
        $(this).parent().hide().prev().find("input.underline").val($(this).attr("val"));

    });

    $(document).click(function (evt) {
        if (evt.target.type != "text") {
            $("div.sbTX").hide();
        }
    })
}
function checkNumericAnswer(v, o) {
    if (isNaN(v)) {
        $.jBox.tip("必须为数字!", "error");
        o.value = $(o).attr("default");
    }
}



function bindTestQuestionTypeList(bookId) {

    if (bookId == "-1") {
        $("#divTestQuestionType").html("请选择学科查询试题类型");
        return;
    }
    $excuteWS("~CmsWS.getTestQuestionTypeBookList", { bookId: bookId, userExtend: SimpleUser }, function (r) {

        if (r) {
            var strArr = new Array();
            for (var i = 0; i < r.length; i++) {
                strArr.push('<div test_question_type_id="' + r[i].id + '" difficulty=' + r[i].difficulty + ' question_type_id="' + r[i].questionTypeId + '"><span>' + r[i].title + '：</span><input index=0 titleinfo="' + r[i].title + '" type="text" class="underline" style="width: 120px;" /><span style="margin-left: 30px;">分数 / 题：</span><input index=1 type="text" maxlength="6" class="underline" style="width: 40px;text-align:center;" value="' + (r[i].score != null ? r[i].score : "") + '"/></div>');
                strArr.push('<div class="sbTX"></div>');
            }

            $divTestQuestionType.html(strArr.join(''));
            $divTestQuestionType.find("input[type='text'][index=0]").click(function () {
                $("div.sbTX").hide();
                var $sbTX = $(this).parent().next();
                if ($sbTX.find("div.sbTX_item").length != 0) {
                    $(this).parent().next().show();
                }
            });

            setTimeout(function () {

                $($("#divTestEditor").find("iframe[edit_area=1]").get(0).contentWindow.document.body).bind("paste", function () {

                    var str = oActiveX.getClipboardHtmlData();
                    if ($.trim(str) == "") { return; }


                    var boo = true;
                    var _s = str;
                    var strArr = /<img[\s|\S]{0,}>/gi.exec(_s);

                    //var imgStrArr = new Array();
                    var imgCount = 0;
                    try {
                        if (strArr != null) {
                            $.jBox.tip("图片正在自动上传，请稍等片刻...", "loading");
                        }
                        while (strArr != null) {

                            var imgstr = strArr[0].substring(0, strArr[0].indexOf(">") + 1);

                            //imgStrArr.push(imgstr);
                            var $img = $(imgstr);
                            var sbookId = $("#selBookList").find("option:selected").attr("id");
                            if (sbookId == "-1") {
                                sbookId = "Temp";
                            }

                            if ($img.attr("src").indexOf(sbookId) == -1) {
                                var fname = oActiveX.jsUploadImage(getActiveXURL(), $img.attr("src").replace(/file:\/\/\//gi, ""), sbookId, null);
                                imgCount++;
                                if (fname == null) {
                                    boo = false;
                                } else {
                                    //var _w = $img.attr("width");
                                    //var _h = $img.attr("width");
                                    //var _style = $img.attr("style");
                                    //$img.removeAttr();
                                    //if (typeof _w != "undefined" && _w != undefined) {
                                    //    $img.attr("width", _w)
                                    //}
                                    //if (typeof _h != "undefined" && _h != undefined) {
                                    //    $img.attr("height", _h);
                                    //}
                                    //if (typeof _style != "undefined" && _style != undefined) {
                                    //    $img.attr("style", _style);
                                    //}
                                    $img.attr("src", "../Uploads/CMS/" + sbookId + "/Test/" + fname);


                                }
                            }

                            str = str.replace(imgstr, $("<span></span>").append($img).html());
                            _s = _s.substring(strArr.index + imgstr.length);
                            strArr = /<img[\s|\S]{0,}>/gi.exec(_s);
                        }
                    } catch (e) {
                        //alert(e.message);
                    }

                    var i1 = str.toLowerCase().indexOf("<body");
                    var i2 = str.toLowerCase().lastIndexOf("</body");
                    var chtml = (i1 != -1 && i2 != -1) ? str.substr(i1 + str.substr(i1).indexOf(">") + 1, str.length - (i1 + str.substr(i1).indexOf(">") + 1) - str.substr(i2).length).replace(/<!--StartFragment-->|<!--EndFragment-->/gi, "") : str;

                    if (!boo) {
                        $.jBox.tip("图片自动上传失败！", "error");

                    } else {

                        var intervaltime = setInterval(function () {
                            if (oActiveX.getUploadedCount(imgCount)) {
                                if (imgCount != 0) {
                                    //oActiveX.setClipbordHtmlData(str);
                                    $.jBox.tip("所有图片已上传成功！", "success");
                                }
                                chtml = chtml.replace(/<\!\[if \!vml\]>/gi, "").replace(/\<\!\[endif\]>/gi, "");
                                editor.pasteHTML(chtml);
                                clearInterval(intervaltime);
                                setTimeout(function () {
                                    $.jBox.closeTip();
                                }, 800)

                            }
                        }, 500)
                    }

                    $divTestQuestionType.find("div.sbTX").html("");
                    if ($chtml != null) {
                        $chtml.remove();
                    }
                    $chtml = $("<span>" + chtml + "</span>");

                    $chtml.find("img,table").each(function () {
                        var imgHTML1 = $("<span></span>").append($(this).clone()).html();
                        var imgHTML2 = imgHTML1.replace(/</gi, "@[!").replace(/>/gi, "!]@");
                        $(this).replaceWith(imgHTML2);
                        //$(this).replaceWith('@[!img alt="" src="'+$(this).attr("src")+'" /!]@');
                    });

                    //$chtml.find("table").each(function () {
                    //    var tbHTML1 = $("<span></span>").append($(this).clone()).html();
                    //    var tbHTML2 = tbHTML1.replace(/</gi, "@[!").replace(/>/gi, "!]@");
                    //    $(this).replaceWith(tbHTML2);
                    //});


                    var dataText = $chtml.text(); //window.clipboardData.getData('Text');
                    // window.clipboardData.setData('Text', dataText);
                    var txArr = new Array();
                    var regx = /[一|二|三|四|五|六|七|八|九|十|十一|十二|十三|十四|十五|十六|十七|十八|十九|二十]、[\S]{0,}题/;
                    if (!dataText.match(regx)) {
                        regx = /[一|二|三|四|五|六|七|八|九|十|十一|十二|十三|十四|十五|十六|十七|十八|十九|二十]：[\S]{0,}题/;
                    }

                    if (!dataText.match(regx)) {
                        regx = /[一|二|三|四|五|六|七|八|九|十|十一|十二|十三|十四|十五|十六|十七|十八|十九|二十]:[\S]{0,}题/;
                    }

                    if (!dataText.match(regx)) {
                        regx = /[一|二|三|四|五|六|七|八|九|十|十一|十二|十三|十四|十五|十六|十七|十八|十九|二十]，[\S]{0,}题/;
                    }

                    if (!dataText.match(regx)) {
                        regx = /[一|二|三|四|五|六|七|八|九|十|十一|十二|十三|十四|十五|十六|十七|十八|十九|二十],[\S]{0,}题/;
                    }

                    if (!dataText.match(regx)) {
                        regx = /[一|二|三|四|五|六|七|八|九|十|十一|十二|十三|十四|十五|十六|十七|十八|十九|二十] [\S]{0,}题/;
                    }

                    var arr = regx.exec(dataText);
                    while (arr != null) {
                        var tx = arr[0].substring(0, arr[0].indexOf("题") + 1);
                        var b = false;
                        for (var h = 0; h < txArr.length; h++) {
                            if ($.trim(txArr[h]) == $.trim(tx)) {
                                b = true;
                                break;
                            }
                        }
                        if (!b) {
                            txArr.push(tx);
                            $divTestQuestionType.find("div.sbTX").append('<div class="sbTX_item">' + tx + '</div>');
                        }

                        dataText = dataText.substring(arr.index + tx.length);
                        arr = regx.exec(dataText);
                    }
                    $divTestQuestionType.find("div.sbTX div.sbTX_item").click(function () {
                        $(this).parent().hide().prev().find("input[type='text'][index='0']").val($(this).text());

                    });

                    if (txArr.length != 0) {
                        testQuestionTypeArray = txArr;
                        $divTestQuestionType.find("input[index='0'][type='text']").each(function () {
                            var t = $(this).attr("titleinfo")
                            for (var i = 0; i < txArr.length; i++) {
                                if (t.indexOf(txArr[i].substr(2, 1)) != -1) {
                                    $(this).val(txArr[i]);
                                    break;
                                }
                            }
                        });
                    }

                    return false;

                });

            }, 0);
        } else {
            $divTestQuestionType.html('<div style="color:#888888;font-size:12px;text-align:left">没有试题类型</div>');
        }
    }, null, { userContext: "getTestQuestionTypeListBySubject" });
}

var BookWrapperArray = null;
function bindBookInfo() {
    var oSel = $("#selBookList");
    $excuteWS("~CmsWS.getBookList", { userId: null, instituteIds: null, disciplineIds: null, subjectIds: null, realFlag: false, userExtend: SimpleUser }, function (result) {
        oSel.empty();
        if (result) {
            BookWrapperArray = result;
            $.each(result, function () {
                oSel.append("<option value='" + this.isbn + "' id='" + this.id + "' >" + this.title + "</option>");
            });
        }
        oSel.removeClass("sel_loading").prepend("<option value='-1'>请选择书</option>").get(0).selectedIndex = 0;

        //选择默认的书
        var args = getUrlParms();
        if (args["isbn"]) {
            oSel.val(args["isbn"]).trigger("change");
        } else {
            bindDiscipline();
        }
    }, null, null);
}

//筛选出指定学科的书
function bindBookListBySubjectId(subjectId) {
    if (BookWrapperArray == null || BookWrapperArray.length == 0) return;

    var tarBookList = [];
    if (subjectId) {
        for (var i = 0; i < BookWrapperArray.length; i++) {
            if (BookWrapperArray[i].subjectId == subjectId) {
                tarBookList.push(BookWrapperArray[i]);
            }
        }
    } else {
        tarBookList = BookWrapperArray;
    }

    var oSel = $("#selBookList");
    oSel.find("option:gt(0)").remove();
    for (var i = 0; i < tarBookList.length; i++) {
        oSel.append("<option value='" + tarBookList[i].isbn + "' id='" + tarBookList[i].id + "' >" + tarBookList[i].title + "</option>");
    }
}

//显示学科类别列表
function bindDiscipline(defVal) {
    var oSel = $("#Des");
    if (oSel.find("option").length > 0) {
        if (defVal) {
            oSel.val(defVal);
        }
    } else {
        //重新读取学科类别
        $excuteWS("~CmsWS.getDisciplineList", { userExtend: SimpleUser }, function (result) {
            oSel.empty();
            if (result && result.length > 0) {
                $.each(result, function () {
                    oSel.append("<option value='" + this.id + "'>" + this.disciplineName + "</option>");
                });
            }
            oSel.removeClass("sel_loading").prepend("<option value='-1'>请选择学科类别</option>").get(0).selectedIndex = 0;
            if (defVal) {
                oSel.val(defVal);
            }
        }, null, null);

        oSel.change(function () {
            if ($(this).val() != "-1") {
                bindSubject($(this).val(), null);
            } else {
                $("#Sub").empty();
            }
        });
    }
}

//显示学科列表
function bindSubject(disciplineId, defSubjectId) {
    var oSel = $("#Sub");
    var oldDisciplineId = oSel.data("_disciplineId");

    if (false && disciplineId == oldDisciplineId) {
        if (defSubjectId) {
            oSel.val(defSubjectId);
        }
    } else {
        //重新读取学科数据
        oSel.empty().addClass("sel_loading");
        $excuteWS("~CmsWS.getSubjectListByDisciplineId", { disciplineId: disciplineId, userExtend: SimpleUser }, function (result) {
            if (result && result.length > 0) {
                $.each(result, function () {
                    oSel.append("<option value='" + this.id + "'>" + this.subjectName + "</option>");
                });
                oSel.removeClass("sel_loading").prepend("<option value='-1'>请选择学科</option>").get(0).selectedIndex = 0;
                if (defSubjectId) {
                    oSel.val(defSubjectId);
                    // bindTestQuestionTypeList(defSubjectId);
                }
            }
        }, null, null);

        oSel.change(function () {

            if ($(this).val() == "-1") {
                bindBookListBySubjectId("");
            } else {
                bindBookListBySubjectId($(this).val());
            }
            // bindTestQuestionTypeList($("#Sub").val());
            $("#divTestImport").hide();
        });

        oSel.data("_disciplineId", disciplineId)
    }
}

function findBookObj(isbn) {
    var book = null;
    for (var i = 0; i < BookWrapperArray.length; i++) {
        if (BookWrapperArray[i].isbn == isbn) {
            book = BookWrapperArray[i];
        }
    }
    return book;
}
