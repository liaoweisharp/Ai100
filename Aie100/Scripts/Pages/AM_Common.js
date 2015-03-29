/// <reference path="AM_TestManageGlobal.js" />
/// <reference path="../Math.js" />

/*
* 创建考试:数据处理
*/

//清空试题数据
function BT_ClearTestData() {
    _TestQuestionBank = [];
    SelectedQuestions = [];
    LoQuestionArray = [];
    //清空之前的题列表
    var qga = _TestQuestionGroups;
    for (var k = 0; k < qga.length; k++) {
        qga[k].questions = [];
    }
}

//根据考试模板创建试题分类集合
function createQuestionGroup(testSamples) {
    _TestQuestionGroups = [];
    for (var i = 0; i < testSamples.length; i++) {
        if (testSamples[i].typeFlag == 1) {
            _TestQuestionGroups.push({
                testQuestionTypeId: testSamples[i].testQuestionTypeId,
                title: getTestQuestionTypeTitle(testSamples[i].testQuestionTypeId),
                questionNum: parseInt(testSamples[i].questionNum),
                questionScore: [testSamples[i].questionScore],
                questions: []
            });

        } else if (testSamples[i].typeFlag == 0) {
            testSampleSubtotals(testSamples[i], _TestQuestionGroups);
        }
    }
}

//根据考试类型对题量进行分类汇总
function testSampleSubtotals(testSample, targetArray) {
    var idx = targetArray.indexOf("testQuestionTypeId", testSample.testQuestionTypeId);
    if (idx == -1) {
        targetArray.push({
            testQuestionTypeId: testSample.testQuestionTypeId,
            title: getTestQuestionTypeTitle(testSample.testQuestionTypeId),
            questionNum: parseInt(testSample.questionNum),
            questionScore: [testSample.questionScore],
            questions: []
        });
    } else {
        targetArray[idx].questionNum += parseInt(testSample.questionNum);
        targetArray[idx].questionScore.push(testSample.questionScore);
    }
}

//返回考试题型的名称
function getTestQuestionTypeTitle(testQuestionTypeId) {
    var title = "";
    var idx = TestQuestionTypeArray.indexOf("id", testQuestionTypeId);
    if (idx != -1) {
        title = TestQuestionTypeArray[idx].title;;
    } else {
        title = "";
    }
    return title;
}

//关联子母题
function _relateMsQuestion(questions) {
    var q, sq;
    for (var i = 0; i < questions.length; i++) {
        q = questions[i];
        if (q.parentFlag == "1") {   //找到母题
            q.subQuestions = [];

            //查找并关联子题
            for (var j = 0; j < questions.length; j++) {
                sq = questions[j];
                if (sq.parentId == q.id && sq.id != sq.parentId) {
                    q.subQuestions.push(sq);
                }
            }
        }
    }
}


//按考试题型分组
function groupByTestQuestionType(questions) {
    //清空之前的题列表
    var qga = _TestQuestionGroups;
    for (var k = 0; k < qga.length; k++) {
        qga[k].questions = [];
    }

    _relateMsQuestion(questions);

    var idx, q;
    for (var i = 0; i < questions.length; i++) {
        q = questions[i];
        if (q.parentId == q.id) {    //不单独添加子题，因为子题是挂在母题下面的
            idx = qga.indexOf("testQuestionTypeId", q.testQuestionTypeId);
            if (idx != -1) {
                qga[idx].questions.push(q);
            }
        }
    }
}

//设置试题分数
function setQuestionScore() {
    var qs;
    var qga = _TestQuestionGroups;
    for (var i = 0; i < qga.length; i++) {
        qs = qga[i].questions;
        if (qga[i].questionScore.length == 1) {
            for (var j = 0; j < qs.length; j++) {
                qs[j].score = qga[i].questionScore[0];
            }
        } else {
            for (var k = 0; k < qs.length; k++) {
                qs[k].score = qga[i].questionScore[k];
            }
        }
    }
}

//根据索引，从数据中返回部分数据
function getIdsArray(idArray, startpos, endpos) {
    var tempIdArray = new Array();
    if (idArray) {
        var tidArray = idArray;
        var lastIndex = tidArray.length - 1;
        if (endpos > lastIndex) {
            endpos = lastIndex;
        }
        tempIdArray = tidArray.slice(startpos, endpos + 1);
    }
    return tempIdArray;

}

//返回被替换的题（子母题设置关联）
function getReplaceQuestion(questions) {
    var tarQuestion = null;
    if (questions.length == 1) {
        tarQuestion = questions[0];
    } else {   //子母题
        _relateMsQuestion(questions);
        var i = questions.indexOf("parentFlag", "1");   //查找母题
        tarQuestion = (i != -1) ? questions[i] : questions[0];
    }
    return tarQuestion;
}

//替换题对象
function _replaceQuestionObj(srcQuestionId, testQuestionTypeId, questions) {
    //替换题库中的题
    replaceQuestionBank(srcQuestionId, questions);

    //替换组卷模型中的题
    var tarQuestion = getReplaceQuestion(questions);
    var qga = _TestQuestionGroups;
    var idx = qga.indexOf("testQuestionTypeId", testQuestionTypeId);
    if (idx != -1) {
        var x = qga[idx].questions.indexOf("id", srcQuestionId);
        if (x != -1) {
            if (qga[idx].questionScore.length == 1) {
                tarQuestion.score = qga[idx].questionScore[0];
            } else {
                tarQuestion.score = qga[idx].questionScore[x];
            }
            qga[idx].questions[x] = null;
            qga[idx].questions.splice(x, 1, tarQuestion);
        }
    }

    return tarQuestion;

}

//添加题
function _addQuestionObjs(testQuestionTypeId, questions) {
    var tmpArr = [];
    for (var i = 0; i < questions.length; i++) {
        //在题库中添加新题
        tmpArr = [questions[i]];
        if (questions[i].subQuestions && questions[i].subQuestions.length > 0) {
            tmpArr.addRange(questions[i].subQuestions);
            addQuestionBank(tmpArr);
        } else {
            addQuestionBank(tmpArr);
        }

        //将新题分组
        var qga = _TestQuestionGroups;
        var j = qga.indexOf("testQuestionTypeId", testQuestionTypeId);
        if (j != -1) {
            if (qga[j].questionScore.length == 1) {
                questions[i].score = qga[j].questionScore[0];
            } else {
                var n = qga[j].questions.length;
                questions[i].score = qga[j].questionScore[n];
            }
            qga[j].questions.push(questions[i]);
        }

    }
}

//替换题库中的题
function replaceQuestionBank(questionId, questions) {
    //删除原来的题
    var i = _TestQuestionBank.indexOf("id", questionId);
    if (i != -1) {
        var q = _TestQuestionBank.splice(i, 1)[0];
        if (q.parentFlag == "1") {  //如果是母题需要同时删除子题
            for (var j = 0; j < _TestQuestionBank.length; j++) {
                sq = _TestQuestionBank[j];
                if (sq.parentId == q.id && sq.id != sq.parentId) {
                    _TestQuestionBank.splice(j, 1);
                }
            }
        }
    }

    //添加新的题
    for (var k = 0; k < questions.length; k++) {
        _TestQuestionBank.push(questions[k]);
    }
}

//在题库中添加新题
function addQuestionBank(questions) {
    for (var k = 0; k < questions.length; k++) {
        _TestQuestionBank.push(questions[k]);
    }
}


//返回备选题对象
function getAlternativeQuestion(questionId) {
    var idx = AlternativeQuestions.indexOf("id", questionId);
    if (idx != -1) {
        return AlternativeQuestions[idx];
    } else {
        return null;
    }
}

//向集合中添加对象(不允许id重复)
function addObjToArr(obj, objArr) {
    var i = objArr.indexOf("id", obj.id);
    if (i == -1) {
        objArr.push(obj);
        return true;
    }
    return false;
}

//根据id返回集合中的对象
function getObjById(id, objArr) {
    var i = objArr.indexOf("id", id);
    if (i != -1) {
        return objArr[i];
    } else {
        return null;
    }
}

//根据id删除集合中的对象
function delObjById(id, objArr) {
    var i = objArr.indexOf("id", id);
    if (i != -1) {
        objArr.splice(i, 1);
        return true;
    }
    return false;
}

//返回一个试题分组对象
function getQuestionGroup(testQuestionTypeId) {
    var i = _TestQuestionGroups.indexOf("testQuestionTypeId", testQuestionTypeId);
    if (i != -1) {
        return _TestQuestionGroups[i];
    }
    return null;
}

//返回一个试题分组（题型）中允许添加的题量
function getAllowNumForQuesGroup(testQuestionTypeId) {
    var i = _TestQuestionGroups.indexOf("testQuestionTypeId", testQuestionTypeId);
    if (i != -1) {
        return _TestQuestionGroups[i].questionNum - _TestQuestionGroups[i].questions.length;
    }
    return 0;
}

//根据题型返回题集合
function getQuestionsByTid(testQuestionTypeId) {
    var i = _TestQuestionGroups.indexOf("testQuestionTypeId", testQuestionTypeId);
    if (i != -1) {
        return _TestQuestionGroups[i].questions;
    } else {
        return [];
    }
}

//根据题型返回题的Id集合
function getQuestionIdsByTid(testQuestionTypeId) {
    var questions = getQuestionsByTid(testQuestionTypeId);
    var questionIds = [];
    for (var i = 0; i < questions.length; i++) {
        questionIds.push(questions[i].id);
    }
    return questionIds;
}

//根据Id返回Question列表
function getQuestionsByIds(questionIds, testQuestionTypeId) {
    var tarQuestions = [];
    var n = -1;
    var questions = getQuestionsByTid(testQuestionTypeId);

    for (var i = 0; i < questionIds.length; i++) {
        n = questions.indexOf("id", questionIds[i]);
        if (n != -1) {
            tarQuestions.push(questions[n]);
        }
    }
    return tarQuestions;
}

//返回模板规定的题量
function getModelQuestionNum() {
    var totalNum = 0;
    for (var i = 0; i < _TestQuestionGroups.length; i++) {
        totalNum += _TestQuestionGroups[i].questionNum;
    }
    return totalNum;
}

//检查题库
function checkQuestionBank() {
    var errNo = 0;

    //没有生成题
    if (!_TestQuestionBank || _TestQuestionBank.length == 0) {
        errNo = -1;
        return errNo;
    }

    //题数量不够
    if (!checkQuestionTotal()) {
        errNo = -2;
        return errNo;
    }

    //检查子母题的分数是否相等
    var q, subScoreSum = 0;
    for (var i = 0; i < _TestQuestionBank.length; i++) {    //求子题总分数
        q = _TestQuestionBank[i];
        if (q.subQuestions && q.subQuestions.length > 0) {
            subScoreSum = sumQuestionsScore(q.subQuestions);
            if (subScoreSum != q.score) {
                errNo = -3;
                return errNo;
            }
        }
    }

    return 0;
}

//检查试题总数是否达到模板定义的数量
function checkQuestionTotal() {
    var qg;
    for (var i = 0; i < _TestQuestionGroups.length; i++) {
        qg = _TestQuestionGroups[i];
        if (qg.questionNum != qg.questions.length) {
            return false;
        }
    }
    return true;
}

//试题分数求和
function sumQuestionsScore(subQuestions) {
    var totalScore = 0;
    for (var i = 0; i < subQuestions.length; i++) {
        if (subQuestions[i].score) {
            totalScore += parseFloat(subQuestions[i].score);
        }
    }
    return totalScore;
}

//在对象中保存正确设置的子分数
function assignSubQuestionScore() {
    $("#tbQuesList .subQuesList").each(function () {
        b = validSubQuestionScore(this);
        if (b) {
            BT_SetSubScore(this);
        } else {
            BT_ResetSubScore(this);
        }
    });
    return true;
}

//验证子题输入是否合法
function validSubQuestionScore(o) {
    //母题分数
    var ms = $(o).attr("score");
    var score = (ms) ? parseFloat(ms) : 0;

    var v, b = true, total = 0;
    $(o).find("input").each(function () {
        v = $(this).val();
        if (!v || isNaN(v) || parseFloat(v) == 0) {
            b = false;
            return false;
        }
        total += parseFloat(v);
    });

    if (b && total == score) {
        return true;
    } else {
        return false;
    }
}

//设置子题分数
function BT_SetSubScore(o) {
    var i = -1;
    $(o).find("input").map(function () {
        i = _TestQuestionBank.indexOf("id", this.id);
        if (i != -1) {
            _TestQuestionBank[i].score = $(this).val();
        }
    });
}

//清空错误的子母题分数
function BT_ResetSubScore(o) {
    var i = -1;
    $(o).find("input").map(function () {
        i = _TestQuestionBank.indexOf("id", this.id);
        if (i != -1) {
            $(this).val("");
            _TestQuestionBank[i].score = "";
        }
    });
}