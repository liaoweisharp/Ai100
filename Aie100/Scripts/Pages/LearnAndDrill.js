/// <reference path="../Question.js" />
/// <reference path="../Array.js" />
/// <reference path="../jquery-1.7.1.min.js" />
/// <reference path="../jquery.ajax.js" />
/// <reference path="../SimpleUser.js" />
/// <reference path="../comm.js" />

var ld_json = { urlParams: null, $divKnowledgeList: null,sectionFlag:null, $divPreKps: null, $divStudy: null, $divSampleQuestion: null, $divBestPath: null, $divPractice: null, $tabitems: null,submitedQuestionIds:[], independenceQuestionIds:[],pReferenceAnswers:[], pQuestionArray: [],_pQuestionArray:null, pIndex: 0, pLength: 0, knowledgeArray: [], sourceKonwledgeArray: [], preKnowledgeArray: [], bestKnowledgeArray: [], $loadingHTML: '<div class="loading"><img alt="加载中" src="../Images/ajax-loader_b.gif" /></div>', $nodata: '<span>没有可以学习的知识点。</span>' };
var editor = null;
$(function () {
    ld_json.urlParams = getUrlParms();
    ld_json.$divKnowledgeList = $("#divKnowledgeList");
    ld_json.$divPreKps = $("#divPreKps");
    ld_json.$divBestPath = $("#divBestPath");
    ld_json.$divPractice = $("#divPractice");
    ld_json.$divStudy = $("#divStudy");
    ld_json.$divSampleQuestion = $("#divSampleQuestion");
    U(function () {
        var $contentitems = $("div.contentbody div.contentitem");
        ld_json.$tabitems = $("div.tab_list div.tab_item");
        ld_json.sectionFlag = get_roleId() == "1" ? false : true;
        if (get_studyFlag() != "1") {
            ld_json.$tabitems.hide().filter("[type='sampequestion'],[type='practice']").show().filter(":eq(0)").removeClass("tab_item_nosel").addClass("tab_item_sel");
        }
        
        
        if (ld_json.urlParams.loId) {
            $excuteWS("~DrillWS.knowledgeGradesOfLoList", { loIds: [ld_json.urlParams.loId], sampleQuestionFlag: false,userId:get_userId(), userExtend: get_simpleUser() }, function (r) {
                ld_json.sourceKonwledgeArray = r;

                if (r && r.length > 0) {

                    ld_json.knowledgeArray.addRange(r);
                    ld_json.$divKnowledgeList.html(getKnowledgeItemList(r));
                    ld_json.$tabitems.filter(".tab_item_sel").trigger("click");
                    //ld_json.$tabitems.filter(":eq(0)").trigger("click");
                }
            }, null, null);
        } else if (ld_json.urlParams.structureId) {
            
            $excuteWS("~TLCenterWS.loIdsDrillByStructureId", { structureId: ld_json.urlParams.structureId, userId: get_userId(), sectionFlag:ld_json.sectionFlag, userExtend: get_simpleUser() }, function (result) {
                if (!result) {
                    result = [];
                }
                $excuteWS("~DrillWS.knowledgeGradesOfLoList", { loIds: result, sampleQuestionFlag: false, userId: get_userId(), userExtend: get_simpleUser() }, function (r) {
                    ld_json.sourceKonwledgeArray = r;

                    if (r && r.length > 0) {
                        ld_json.knowledgeArray.addRange(r);
                        ld_json.$divKnowledgeList.html(getKnowledgeItemList(r));
                        ld_json.$tabitems.filter(".tab_item_sel").trigger("click");
                        //ld_json.$tabitems.filter(":eq(0)").trigger("click");
                    } else {
                        ld_json.$divKnowledgeList.html("<div style='padding:8px;color:#888;'>没有可用的知识点。</div>");
                    }
                }, null, null);
            }, null,null);
        } else if (ld_json.urlParams.isbn) {
            
            $excuteWS("~TLCenterWS.loIdsDrillByIsbn", { isbn: ld_json.urlParams.isbn, userId: get_userId(), sectionFlag: ld_json.sectionFlag, userExtend: get_simpleUser() }, function (result) {
                if (!result) {
                    result = [];
                }
                $excuteWS("~DrillWS.knowledgeGradesOfLoList", { loIds: result, sampleQuestionFlag: false, userId: get_userId(), userExtend: get_simpleUser() }, function (r) {
                    ld_json.sourceKonwledgeArray = r;

                    if (r && r.length > 0) {
                        ld_json.knowledgeArray.addRange(r);
                        ld_json.$divKnowledgeList.html(getKnowledgeItemList(r));
                        ld_json.$tabitems.filter(".tab_item_sel").trigger("click");
                        //ld_json.$tabitems.filter(":eq(0)").trigger("click");
                    }
                }, null, null);
            }, null, null);
        } else if (ld_json.urlParams.assignmentId) {
            $excuteWS("~TLCenterWS.loIdsByTest", { testId: ld_json.urlParams.assignmentId, userExtend: get_simpleUser() }, function (result) {
                if (!result) {
                    result = [];
                }
                $excuteWS("~DrillWS.knowledgeGradesOfLoList", { loIds: result, sampleQuestionFlag: false, userId: get_userId(), userExtend: get_simpleUser() }, function (r) {
                    ld_json.sourceKonwledgeArray = r;

                    if (r && r.length > 0) {
                        ld_json.knowledgeArray.addRange(r);
                        ld_json.$divKnowledgeList.html(getKnowledgeItemList(r));
                        ld_json.$tabitems.filter(".tab_item_sel").trigger("click");
                        //ld_json.$tabitems.filter(":eq(0)").trigger("click");
                    } else {
                        ld_json.$divKnowledgeList.html("<div style='padding:8px;color:#888;'>没有可用的知识点。</div>");
                    }
                }, null, null);
            }, null, null);
        }
        ld_json.$tabitems.each(function (index) {
            var $this = $(this);
            $this.click(function () {
                ld_json.$tabitems.css({ "background-color": "" }).removeClass("tab_item_sel").addClass("tab_item_nosel");
                $this.css({ "background-color": "rgb(255, 230, 100)" }).removeClass("tab_item_nosel").addClass("tab_item_sel");
                $contentitems.hide();
                $contentitems.filter(":eq(" + index + ")").show();
                
                switch ($this.attr("type")) {
                    case "prekps":
                        var sloId = ld_json.$divKnowledgeList.find("div.knowledge_item_sel").attr("itemid");
                        if (!sloId || ld_json.$divPreKps.find("div.[currentitemid='" + sloId + "']").length != 0) {
                            return;
                        }
                        ld_json.$divPreKps.html(ld_json.$loadingHTML);
                       
                        $excuteWS("~DrillWS.knowledgeGradesOfSource", { loId: sloId, sampleQuestionFlag: false,userId:get_userId(), userExtend: get_simpleUser() }, function (r) {
                            ld_json.preKnowledgeArray = r;
                            if (r && r.length > 0) {
                                addToKnowledgeArray(r);
                                ld_json.$divPreKps.html(getLearingKnowledgeItemList(sloId, r));
                                bindStudyButtonEvent(ld_json.$divPreKps, ld_json.preKnowledgeArray);
                            } else {
                                ld_json.$divPreKps.html('<div currentitemid="' + sloId + '">'+ld_json.$nodata+'</div>');
                            }
                        }, null, null)
                        break;
                    case "study":
                        var sloId = ld_json.$divKnowledgeList.find("div.knowledge_item_sel").attr("itemid");
                        if (!sloId || ld_json.$divStudy.find("div.[currentitemid='" + sloId + "']").length != 0) {
                            return;
                        }
                        ld_json.$divStudy.html(ld_json.$loadingHTML);
                        
                        ld_json.$divStudy.html('<div currentitemid="' + sloId + '"><div style="padding:5px;">' + ld_json.knowledgeArray.firstOrDefault("itemId", sloId).description + '</div><div style="padding:5px;" id="divStudyReferenceList">' + ld_json.$loadingHTML + '</div></div>');
                        var $divStudyReferenceList = $("#divStudyReferenceList");
                        $excuteWS("~DrillWS.getStudyReferenceAllListForLoIds", { loIds: [sloId], userExtend: get_simpleUser() }, function (r) {
                            if (r && r.length > 0) {
                                var jichu = [];
                                var qianghua = [];
                                var jingying = [];
                                for (var k = 0; k < r.length; k++) {
                                    if (r[k].difficulty == "1") {//基础
                                        jichu.push(r[k]);
                                    } else if (r[k].difficulty == "2" || r[k].difficulty == "3") {//强化
                                        qianghua.push(r[k]);
                                    } else if (r[k].difficulty == "4" || r[k].difficulty == "5") {//精英
                                        jingying.push(r[k]);
                                    }
                                }
                                var arr = [];
                                //arr.push('');
                                arr.push('<div class="study_reference">');
                                if (jichu.length != 0 || qianghua.length != 0 || jingying.length != 0) {
                                    arr.push('<div>');
                                    if (jichu.length > 0) {
                                        arr.push('<div class="f_l study_tab_item" style="background-color:rgb(255,153,0);">基础</div>');
                                    }
                                    if (qianghua.length > 0) {
                                        arr.push('<div class="f_l study_tab_item">强化</div>');
                                    }
                                    if (jingying.length > 0) {
                                        arr.push('<div class="f_l study_tab_item">精英</div>');
                                    }
                                    arr.push('<div class="c_b"></div>');
                                    arr.push('</div>');
                                }
                                arr.push('<div class="study_reference_header"><div class="f_l study_reference_title">标题</div><div class="f_r study_reference_type">类型</div><div class="c_b"></div></div>');
                                
                                //基础
                                if (jichu && jichu.length > 0) {
                                    arr.push('<div class="study_reference_content" style="display:block">');
                                    for (var r = 0; r < jichu.length; r++) {
                                        arr.push('<div class="study_reference_item"><div class="f_l study_reference_title"><a href="#" referenceid="' + jichu[r].id + '">' + jichu[r].title + '</a></div><div class="f_r study_reference_type">' + getStudyMaterialType(jichu[r].type) + '</div><div class="c_b"></div></div>');
                                    }
                                    arr.push('</div>');
                                }

                                //强化
                                if (qianghua && qianghua.length > 0) {
                                    arr.push('<div class="study_reference_content">');
                                    for (var r = 0; r < qianghua.length; r++) {
                                        arr.push('<div class="study_reference_item"><div class="f_l study_reference_title"><a href="#" referenceid="' + qianghua[r].id + '">' + qianghua[r].title + '</a></div><div class="f_r study_reference_type">' + getStudyMaterialType(qianghua[r].type) + '</div><div class="c_b"></div></div>');
                                    }
                                    arr.push('</div>');
                                }

                                //精英
                                if (jingying && jingying.length > 0) {
                                    arr.push('<div class="study_reference_content">');
                                    for (var r = 0; r < jingying.length; r++) {
                                        arr.push('<div class="study_reference_item"><div class="f_l study_reference_title"><a href="#" referenceid="' + jingying[r].id + '">' + jingying[r].title + '</a></div><div class="f_r study_reference_type">' + getStudyMaterialType(jingying[r].type) + '</div><div class="c_b"></div></div>');
                                    }
                                    arr.push('</div>');
                                }
                                
                                arr.push('</div>');
                                
                                $divStudyReferenceList.html(arr.join(''));
                                $divStudyReferenceList.find("a[referenceid]").click(function () {
                                    new ShowDetails({ data: { studyReferenceId: $(this).attr("referenceid") }, type: 1, show_type: 1 }).show();
                                });

                                var $study_tab_item = $divStudyReferenceList.find("div.study_tab_item");
                                $study_tab_item.each(function (index) {
                                    var $tabitem = $(this);
                                    $tabitem.click(function () {
                                        $study_tab_item.removeAttr("style");
                                        $tabitem.css("background-color", "rgb(255,153,0)");
                                        $divStudyReferenceList.find("div.study_reference_content").hide().filter(":eq("+index+")").show();
                                    });
                                    

                                });
                            } else {
                                $divStudyReferenceList.html("");
                            }
                        }, null, null)
                        
                        break;
                    case "sampequestion":
                        var sloId = ld_json.$divKnowledgeList.find("div.knowledge_item_sel").attr("itemid");
                        if (!sloId || ld_json.$divSampleQuestion.find("div.[currentitemid='" + sloId + "']").length != 0) {
                            return;
                        }
                        ld_json.$divSampleQuestion.html(ld_json.$loadingHTML);
                        
                        $excuteWS("~DrillWS.getQuestionSampleByLoId", { loId: sloId, state: getKnowledgeStatus(ld_json.knowledgeArray.firstOrDefault("itemId", sloId).personalKnowledgeScore), userExtend: get_simpleUser() }, function (re) {
                            if (re && re.length > 0) {
                                var questionW = re[0];
                                var sq_arr = new Array();
                                sq_arr.push('<div style="font-weight:bold;">试题：</div>');
                                sq_arr.push('<div>' + questionW.content + '</div>');
                                sq_arr.push('<div id="div_sqanswers"></div>');
                                if (questionW.solution.replace(/\s|　|&nbsp(;)?/gi, "") != "") {
                                    sq_arr.push('<div style="font-weight:bold;">解决方案：</div>');
                                    sq_arr.push('<div>' + questionW.solution + '</div>');
                                }
                                
                                ld_json.$divSampleQuestion.html('<div currentitemid="' + sloId + '" style="line-height:22px;">' + sq_arr.join('') + '</div>');
                                if (questionW.questionTypeId == "1" || questionW.questionTypeId == "2" || questionW.questionTypeId == "3") {//客观题
                                    
                                    $excuteWS("~TestWS.getReferenceAnswersList", { questionId: questionW.id, qpvSeedId: questionW.qpvSeedId, userExtend: get_simpleUser() }, function (r) {
                                        if (r && r.length > 0) {
                                            $("#div_sqanswers").html(new Question({ data: { question: questionW, answers: r, testerAnswers: null } }).getAnswerForImport());
                                        } else {
                                            $("#div_sqanswers").html("");
                                        }
                                    }, null, null);
                                }
                            } else {
                                ld_json.$divSampleQuestion.html('<div currentitemid="' + sloId + '">该知识点下没有例题。</div>');
                            }
                        }, null, null);
                        break;
                    case "bestpath":
                        var sloId = ld_json.$divKnowledgeList.find("div.knowledge_item_sel").attr("itemid");
                        if (!sloId || ld_json.$divBestPath.find("div.[currentitemid='" + sloId + "']").length != 0) {
                            return;
                        }
                        ld_json.$divBestPath.html(ld_json.$loadingHTML);

                        $excuteWS("~DrillWS.loIdsLearningPath", { loId: sloId, userId: get_userId(), userExtend: get_simpleUser() }, function (r1) {
                            if (r1 && r1.length > 0) {
                                $excuteWS("~DrillWS.knowledgeGradesOfLoList", { loIds: r1, sampleQuestionFlag: false,userId:get_userId(), userExtend: get_simpleUser() }, function (r) {
                                    ld_json.bestKnowledgeArray = r;
                                    if (r && r.length > 0) {
                                        addToKnowledgeArray(r);
                                        ld_json.$divBestPath.html(getLearingKnowledgeItemList(sloId, r));
                                        bindStudyButtonEvent(ld_json.$divBestPath, ld_json.bestKnowledgeArray);
                                    } else {
                                        ld_json.$divBestPath.html('<div currentitemid="' + sloId + '">' + ld_json.$nodata + '</div>');
                                    }
                                }, null, null);
                            } else {
                                ld_json.$divBestPath.html('<div currentitemid="' + sloId + '">' + ld_json.$nodata + '</div>');
                            }
                        }, null, null);

                        
                        //$excuteWS("~DrillWS.getBestLeaningPath", {loId:sloId,userId:get_userId(),sampleQuestionFlag:false,userExtend:get_simpleUser()}, function (r) {
                        //    if (r && r.length > 0) {
                        //        ld_json.$divBestPath.html(getLearingKnowledgeItemList(sloId,r));
                        //    } else {
                        //        ld_json.$divBestPath.html('<div currentitemid="' + sloId + '">'+ld_json.$nodata+'</div>');
                        //    }
                        //}, null, null)
                        break;
                    case "practice":
                        //~DrillWS.getQuestionSampleByLos(string[] loIds, string num, JEWS.EngineStudyGuide.UserExtend userExtend);
                        var sloId = ld_json.$divKnowledgeList.find("div.knowledge_item_sel").attr("itemid");
                        if (!sloId || ld_json.$divPractice.find("div.[currentitemid='" + sloId + "']").length != 0) {
                            return;
                        }

                        ld_json.$divPractice.html(ld_json.$loadingHTML);
                        $excuteWS("~DrillWS.getQuestionSampleByLos", { loIds: [sloId], num: "3", userExtend: get_simpleUser() }, function (re) {
                            if (re && re.length > 0) {
                                ld_json.$divPractice.find("input.continue_practice").removeAttr("disabled");
                                ld_json.pQuestionArray = re;
                                ld_json._pQuestionArray = ld_json.pQuestionArray.copyArray();
                                
                                ld_json.pLength = ld_json.pQuestionArray.length;
                                var questionW = re[0];
                                var sq_arr = new Array();
                                //sq_arr.push('<div id="divQuestionDetail" style="padding:5px;border:1px solid #888;position:fixed;width:500px;background-color:#fff;">sdfdsfsdfsdf</div>');
                                sq_arr.push('<div style="text-align:center;padding:5px;background-color:rgb(250,250,250)"><input class="continue_practice button" type="button" value="继续练习" />&nbsp;&nbsp;<input class="submit_question button" type="button" value="提交"/></div>');
                                sq_arr.push('<div>');
                                sq_arr.push('<div class="f_l w_drillqinfo">');

                                sq_arr.push('<div id="divAnsweredInfo">');
                                sq_arr.push('<div class="correctinfo">恭喜你，答题正确！</div>');
                                sq_arr.push('<div class="errorinfo">答题错误，继续加油！</div>');

                                sq_arr.push('<div style="background-color: rgb(205, 205, 205); padding: 5px; text-align: center;display:none;" id="divLdCorrectOrError">');
                                sq_arr.push('正确率：');
                                sq_arr.push('<select id="ddlZgtWR"><option value="1">100%</option><option value="0.9">90%</option><option value="0.8">80%</option><option value="0.7">70%</option><option value="0.6">60%</option><option value="0.5">50%</option><option value="0.4">40%</option><option value="0.3">30%</option><option value="0.2">20%</option><option value="0.1">10%</option><option value="0">0%</option></select>');
                                sq_arr.push('&nbsp;<input id="btnZgtWR" type="button" value="确定"/>');
                                sq_arr.push('</div>');

                                sq_arr.push('</div>');

                                sq_arr.push('<div style="font-weight:bold;">试题：</div>');
                                sq_arr.push('<div id="div_pbody"><div questionbody="1" questionid="' + questionW.id + '">' + questionW.content + '</div></div>');
                                sq_arr.push('<div id="div_panswers"></div>');
                                            
                                sq_arr.push('</div>');
                                sq_arr.push('<div class="f_r">');
                                sq_arr.push('<div id="div_qdetail" class="qdetail">');
                                sq_arr.push('<div class="qdetail_item"><img src="../Images/tag_pink.png" alt="" />&nbsp;<a type="knowledge">知识点</a></div>');
                                sq_arr.push('<div class="qdetail_item"><img src="../Images/tag_pink.png" alt="" />&nbsp;<a type="tip">提示</a></div>');
                                sq_arr.push('<div class="qdetail_item answer"><img src="../Images/tag_pink.png" alt="" />&nbsp;<a type="answer">答案</a></div>');
                                sq_arr.push('<div class="qdetail_item solution"><img src="../Images/tag_pink.png" alt="" />&nbsp;<a type="solution">解决方案</a></div>');
                                sq_arr.push('</div>');
                                sq_arr.push('</div>');
                                sq_arr.push('<div class="c_b"></div>');
                                sq_arr.push('</div>');
                                sq_arr.push('<div style="text-align:center;padding:5px;background-color:rgb(250,250,250)"><input class="continue_practice button" type="button" value="继续练习" />&nbsp;&nbsp;<input class="submit_question button" type="button" value="提交"/></div>');
                                ld_json.$divPractice.html('<div currentitemid="' + sloId + '" style="line-height:22px;">' + sq_arr.join('') + '</div>');
                                ld_json.$divPractice.find("#div_qdetail div.qdetail_item a").click(function () {
                                    var $a = $(this);
                                    var _questionId = $("#div_pbody").find("div[questionbody='1']").attr("questionid");

                                    var arr = new Array();
                                    arr.push('<div id="jbox_tabs">');
                                    arr.push('<div type="knowledge" class="f_l jbox_tab jbox_tabitem">知识点</div>');
                                    arr.push('<div type="tip" class="f_l jbox_tab jbox_tabitem">提示</div>');
                                    if ($("#div_qdetail div.answer").is(":visible")) {
                                        arr.push('<div type="answer" class="f_l jbox_tab jbox_tabitem">答案</div>');
                                    }
                                    if ($("#div_qdetail div.solution").is(":visible")) {
                                        arr.push('<div type="solution" class="f_l jbox_tab jbox_tabitem">解决方案</div>');
                                    }
                                    arr.push('<div class="c_b"></div>');
                                    arr.push('</div>');
                                    arr.push('<div id="jbox_tabcontent" class="jb_tabcontent">');
                                    arr.push('<div id="jb_knowledges" class="jb_tabcontent_item">' + ld_json.$loadingHTML + '</div>');
                                    arr.push('<div id="jb_tip" class="jb_tabcontent_item">' + ld_json.$loadingHTML + '</div>');
                                    arr.push('<div id="jb_answer" class="jb_tabcontent_item">' + ld_json.$loadingHTML + '</div>');
                                    arr.push('<div id="jb_solution" class="jb_tabcontent_item">' + ld_json.$loadingHTML + '</div>');
                                    arr.push('</div>');
                                    $.jBox('<div style="padding:5px;" id="jbox_details">' + arr.join('') + '</div>', { title: "目标知识点和预备知识点", width: 600, buttons: {} });
                                    var $jboxTabs = $("#jbox_tabs div.jbox_tab");
                                    $jboxTabs.click(function () {
                                        var $c = $(this);
                                        $jboxTabs.removeClass("jbox_tabitem_s").addClass("jbox_tabitem");
                                        $c.removeClass("jbox_tabitem").addClass("jbox_tabitem_s");
                                        $("#jbox_tabcontent div.jb_tabcontent_item").hide();
                                        switch ($c.attr("type")) {
                                            case "knowledge":
                                                var $jb_knowledges = $("#jbox_tabcontent #jb_knowledges");
                                                $jb_knowledges.show();
                                                if ($jb_knowledges.find("div[currentitemid='" + sloId + "']").length > 0) {
                                                    return;
                                                }
                                                $jb_knowledges.html(ld_json.$loadingHTML);
                                                if (ld_json.independenceQuestionIds.firstOrDefault("questionId", _questionId) == null) {
                                                    ld_json.independenceQuestionIds.push({ questionId: _questionId });
                                                }
                                                $excuteWS("~DrillWS.knowledgeGradesByQuestionId", { questionId: _questionId, sampleQuestionFlag: false,userId:get_userId(), userExtend: get_simpleUser() }, function (re1) {
                                                    if (re1 && re1.length > 0) {
                                                        var kpArray = new Array();
                                                        var oarray = re1.findAll("loType", "0");
                                                        var parray = re1.findAll("loType", "1");
                                                        kpArray.push('<div currentitemid="' + sloId + '">');
                                                        if (oarray && oarray.length > 0) {
                                                            kpArray.push('<div>');
                                                            kpArray.push('<div style="font-weight:bold;">目标知识点</div>');
                                                            for (var x = 0; x < oarray.length; x++) {
                                                                kpArray.push('<div>');
                                                                kpArray.push('<div class="f_l" style="cursor:pointer;" knowledge_itemid="' + oarray[x].itemId + '"><img knowledgeflag="1" align="middle" src="../Images/bullet_arrow_right.png" alt=""/>' + oarray[x].unit + ' ' + oarray[x].itemName + '</div><div class="f_r" style="line-height:18px;">' + getKnowledgeStatusBar(get_roleId(), oarray[x]) + '</div><div class="c_b"></div>');
                                                                kpArray.push('<div details_itemid="' + oarray[x].itemId + '" style="display:none;">' + ld_json.$loadingHTML + '</div>');
                                                                kpArray.push('</div>');
                                                            }
                                                            kpArray.push('</div>');
                                                        }
                                                            
                                                        if (parray && parray.length > 0) {
                                                            kpArray.push('<div>');
                                                            kpArray.push('<div style="font-weight:bold;">预备知识点</div>');
                                                            for (var y = 0; y < parray.length; y++) {
                                                                kpArray.push('<div>');
                                                                kpArray.push('<div class="f_l" style="cursor:pointer;" knowledge_itemid="' + parray[y].itemId + '"><img knowledgeflag="1" align="middle" src="../Images/bullet_arrow_right.png" alt=""/>' + parray[y].unit + ' ' + parray[y].itemName + '</div><div class="f_r" style="line-height:18px;">' + getKnowledgeStatusBar(get_roleId(), parray[y]) + '</div><div class="c_b"></div>');
                                                                kpArray.push('<div details_itemid="' + parray[y].itemId + '" style="display:none;margin-bottom:5px;">' + ld_json.$loadingHTML + '</div>');
                                                                kpArray.push('<div>');
                                                            }
                                                            kpArray.push('</div>');
                                                        }
                                                        kpArray.push('</div>');
                                                        //kpArray.push('<div>');
                                                        $jb_knowledges.html(kpArray.join('')).find("div[knowledge_itemid]").click(function () {
                                                            //new ShowDetails({ data: { itemId: $(this).attr("knowledge_itemid") }, type: 0, show_type: 1 }).show();
                                                            var $to = $(this);
                                                            var $img = $to.find("img[knowledgeflag='1']");
                                                            var $details = $to.parent().find("div[details_itemid='" + $to.attr("knowledge_itemid") + "']");
                                                            if ($img.attr("src").lastIndexOf("bullet_arrow_right.png") != -1) {
                                                                $img.attr("src", "../Images/bullet_arrow_down.png");
                                                                $details.show();
                                                                if ($details.find("div.loading").length > 0) {
                                                                    new ShowDetails({ data: { itemId: $to.attr("knowledge_itemid") }, container: $details, show_type: "0", type: "0" }).show();
                                                                }
                                                            } else {
                                                                $img.attr("src", "../Images/bullet_arrow_right.png");
                                                                $details.hide();
                                                            }
                                                            if ($jb_knowledges.height() > 400) {
                                                                $jb_knowledges.css({ "height": "400px", "overflow": "auto" });
                                                            }
                                                        });
                                                        if ($jb_knowledges.height() > 400) {
                                                            $jb_knowledges.css({ "height": "400px", "overflow": "auto" });
                                                        }
                                                            
                                                    } else {
                                                        $.jBox('<div style="padding:5px;">该题没有可用的知识点。</div>', { title: "提示", width: 550 });
                                                    }
                                                }, null, null);
                                                    
                                                break;
                                            case "tip":
                                                if (ld_json.independenceQuestionIds.firstOrDefault("questionId", _questionId) == null) {
                                                    ld_json.independenceQuestionIds.push({ questionId: _questionId });
                                                }
                                                var q = ld_json._pQuestionArray.firstOrDefault("id", _questionId);
                                                var $jb_tip = $("#jbox_tabcontent #jb_tip");
                                                $jb_tip.show();

                                                if (q != null && q.tip != null && q.tip.replace(/\s|　|&nbsp(;)?/gi, "") != "") {
                                                    $jb_tip.html(q.tip);
                                                } else {
                                                    $jb_tip.html('<div style="padding:5px;">该题没有可用的提示信息。</div>');
                                                }
                                                if ($jb_tip.height() > 400) {
                                                    $jb_tip.css({ "height": "400px", "overflow": "auto" });
                                                }
                                                break;
                                            case "answer":
                                                //var r = ld_json.pReferenceAnswers.firstOrDefault("questionId", _questionId);
                                                var $answer = $("#jbox_tabcontent #jb_answer");
                                                $answer.show();
                                                var correctAnswer = "";
                                                   
                                                if (ld_json.pReferenceAnswers) {
                                                    var q = ld_json._pQuestionArray.firstOrDefault("id", _questionId);
                                                    var arr = new Array();
                                                       
                                                    var kflag=false;
                                                    if (q.questionTypeId == "1" || q.questionTypeId == "2" || q.questionTypeId == "3") {
                                                        kflag=true;
                                                    }
                                                    for (var r = 0; r < ld_json.pReferenceAnswers.length; r++) {
                                                        if (ld_json.pReferenceAnswers[r].correctFlag > 0.7 || ld_json.pReferenceAnswers[r].correctFlag == 0.7) {
                                                            if (kflag) {
                                                                if (q.questionTypeId == "3") {
                                                                    correctAnswer = ld_json.pReferenceAnswers[r].content + "、";
                                                                } else {
                                                                    correctAnswer += String.fromCharCode(r + 65) + "、";
                                                                }
                                                            } else {
                                                                correctAnswer += ld_json.pReferenceAnswers[r].content + "<br/>";
                                                            }
                                                        }
                                                    }
                                                        
                                                    if (kflag && correctAnswer!="") {
                                                        correctAnswer = correctAnswer.substring(0,correctAnswer.length-1);
                                                    }
                                                }
                                                if (correctAnswer != "") {
                                                    $answer.html(correctAnswer);
                                                } else {
                                                    $answer.html("该题没有设置正确答案。");
                                                }

                                                break;
                                            case "solution":

                                                var q = ld_json._pQuestionArray.firstOrDefault("id", _questionId);
                                                var $jb_solution = $("#jbox_tabcontent #jb_solution");
                                                $jb_solution.show();

                                                if (q != null && q.solution != null && q.solution.replace(/\s|　|&nbsp(;)?/gi, "") != "") {
                                                    $jb_solution.html(q.solution);
                                                } else {
                                                    $jb_solution.html('<div style="padding:5px;">该题没有可用的提示信息。</div>');
                                                }
                                                if ($jb_solution.height() > 400) {
                                                    $jb_solution.css({ "height": "400px", "overflow": "auto" });
                                                }
                                                break;
                                        }
                                            
                                    });
                                        
                                    $jboxTabs.filter("[type='" + $a.attr("type") + "']").trigger("click");
                                        
                                        
                                });

                                ld_json.$divPractice.find("input.continue_practice").click(function () {
                                    if (editor != null) {
                                        editor.hide();
                                    }
                                    $("#divAnsweredInfo div.correctinfo").hide();
                                    $("#divAnsweredInfo div.errorinfo").hide();
                                    $("#div_qdetail div.answer,div.solution").hide();
                                    
                                    ld_json.pIndex++;
                                    if (ld_json.pIndex > ld_json.pLength - 1) {
                                        ld_json.pIndex = 0;
                                    }
                                    var _questionW = ld_json.pQuestionArray[ld_json.pIndex];
                                    //if (!(_questionW.questionTypeId == "1" || _questionW.questionTypeId == "2" || _questionW.questionTypeId == "3")) {//客观题
                                    //    $("#divLdCorrectOrError").show().find("select").val("1");
                                    //} else {
                                    //    $("#divLdCorrectOrError").hide();
                                    //}
                                    $("#divLdCorrectOrError").hide();
                                    $("#div_pbody").html('<div questionbody="1" questionid="'+_questionW.id+'">'+_questionW.content+'</div>');
                                    $("#div_panswers").html(ld_json.$loadingHTML);
                                    $excuteWS("~TestWS.getReferenceAnswersList", { questionId: _questionW.id, qpvSeedId: _questionW.qpvSeedId, userExtend: get_simpleUser() }, function (r3) {
                                            
                                        if (r3 && r3.length > 1 && _questionW.questionTypeId != "3") {
                                            r3.sort(function () { return 0.5 - Math.random() }); //打乱题的顺序
                                        }
                                        ld_json.pReferenceAnswers = r3;
                                        if (r3 && r3.length > 0) {
                                            $("#div_panswers").html('<div referenceflag="1" questionid="' + _questionW.id + '" questiontypeid="' + _questionW.questionTypeId + '">' + new Question({ data: { question: _questionW, answers: r3, testerAnswers: null } }).getAnswerForTest() + '</div>');
                                            bindZgtAnswerClick();
                                        } else {
                                            $("#div_panswers").html("");
                                        }
                                        ld_json.$divPractice.find("input.submit_question").removeAttr("disabled");
                                    }, null, null);
                                });
                                ld_json.$divPractice.find("input.submit_question").click(function () {
                                    
                                    if (editor != null) {
                                        editor.hide();
                                    }
                                    var trqs = getTestResultQuestionWrapperArray();
                                    if ((trqs && trqs.length > 0 && (!trqs[0].testerAnswersContent || $.trim(trqs[0].testerAnswersContent) == "")) || trqs==null || trqs.length == 0) {
                                        $.jBox.tip("请先填写你的答案。");
                                        return;
                                    }
                                    
                                    ld_json.$divPractice.find("input.submit_question").attr("disabled", "disabled");
                                    $("#div_panswers div[referenceflag='1']").showCover();
                                    if ($("#div_panswers").find("div.zg_tester_answer").length != 0) {//如果是主观题
                                        $("#div_qdetail div.answer,div.solution").show();
                                        $("#divLdCorrectOrError").show().find("select").val("1");
                                        $("#divLdCorrectOrError :button,select").removeProp("disabled");
                                        return;
                                    }
                                    submitLDQuestions(true, sloId, trqs);
                                    
                                   
                                    //var qid = $("#div_pbody").find("div[questionbody='1']").attr("questionid");
                                    //var analysisLoFlag = true;
                                    //if (ld_json.submitedQuestionIds.firstOrDefault("questionId", qid) == null) {
                                    //    ld_json.submitedQuestionIds.push({questionId:qid});
                                    //} else {
                                    //    analysisLoFlag = false;
                                    //}
                                        
                                    //$excuteWS("~DrillWS.submitOnlineQuestions", { testResultQuestionWrappers: trqs, analysisLoFlag: analysisLoFlag, userExtend: get_simpleUser() }, function (re2) {
                                    //        $("#div_qdetail div.answer,div.solution").show();
                                    //        if (re2 && re2.length > 0) {
                                    //            if (re2[0].correctFlag > 0.7 || re2[0].correctFlag==0.7) {
                                    //                $("#divAnsweredInfo div.errorinfo").hide();
                                    //                $("#divAnsweredInfo div.correctinfo").show();
                                    //                ld_json.pQuestionArray.removeAll("id", qid);
                                    //                ld_json.pLength = ld_json.pQuestionArray.length;
                                    //                ld_json.pIndex = 0;
                                    //                if (ld_json.pLength == 0) {
                                    //                    $excuteWS("~DrillWS.getQuestionSampleByLos", { loIds: [sloId], num: "3", userExtend: get_simpleUser() }, function (re3) {
                                    //                        if (re3 && re3.length > 0) {
                                    //                            ld_json.pQuestionArray = re3;
                                    //                            ld_json._pQuestionArray = ld_json.pQuestionArray.copyArray();
                                    //                        }
                                    //                        if (!ld_json.pQuestionArray || ld_json.pQuestionArray.length == 0) {
                                    //                            d_json.$divPractice.find("input.continue_practice").attr("disabled", "disabled");
                                    //                        }
                                    //                    }, null, null);
                                    //                }
                                    //            } else {
                                    //                $("#divAnsweredInfo div.correctinfo").hide();
                                    //                $("#divAnsweredInfo div.errorinfo").show();
                                    //                //ld_json.$divPractice.find("input.submit_question").removeAttr("disabled");
                                    //            }

                                    //            //这里更新知识点
                                    //            $excuteWS("~DrillWS.knowledgeGradesOfLoList", { loIds: [sloId], sampleQuestionFlag: false, userExtend: get_simpleUser() }, function (r) {
                                    //                if (r && r.length>0) {
                                    //                    ld_json.$divKnowledgeList.find("div[itemid=" + sloId + "] div.kpstatus").replaceWith(getKnowledgeStatusBar(get_roleId(), r[0]));
                                    //                }
                                                    
                                    //            }, null, null);
                                    //        } else {
                                                
                                    //        }
                                    //}, null, null);

                                });
                                ld_json.$divPractice.find("#btnZgtWR").click(function () {
                                    $("#divLdCorrectOrError :button,select").prop("disabled","disabled");
                                    submitLDQuestions(false,sloId,null);
                                    //var qid = $("#div_pbody").find("div[questionbody='1']").attr("questionid");
                                    //var analysisLoFlag = true;
                                    //if (ld_json.submitedQuestionIds.firstOrDefault("questionId", qid) == null) {
                                    //    ld_json.submitedQuestionIds.push({ questionId: qid });
                                    //} else {
                                    //    analysisLoFlag = false;
                                    //}
                                    //var trqs = getTestResultQuestionWrapperArray();
                                    ////submitOfflineQuestions(TestResultQuestionWrapper[] testResultQuestionWrappers, bool analysisLoFlag, UserExtend userExtend)
                                    //$excuteWS("~DrillWS.submitOfflineQuestions", { testResultQuestionWrappers: trqs, analysisLoFlag: analysisLoFlag, userExtend: get_simpleUser() }, function (re2) {
                                    //    $("#div_qdetail div.answer,div.solution").show();
                                    //    if (re2 && re2.length > 0) {
                                    //        if (re2[0].correctFlag > 0.7 || re2[0].correctFlag == 0.7) {
                                    //            $("#divAnsweredInfo div.errorinfo").hide();
                                    //            $("#divAnsweredInfo div.correctinfo").show();
                                    //            ld_json.pQuestionArray.removeAll("id", qid);
                                    //            ld_json.pLength = ld_json.pQuestionArray.length;
                                    //            ld_json.pIndex = 0;
                                    //            if (ld_json.pLength == 0) {
                                    //                $excuteWS("~DrillWS.getQuestionSampleByLos", { loIds: [sloId], num: "3", userExtend: get_simpleUser() }, function (re3) {
                                    //                    if (re3 && re3.length > 0) {
                                    //                        ld_json.pQuestionArray = re3;
                                    //                        ld_json._pQuestionArray = ld_json.pQuestionArray.copyArray();
                                    //                    }
                                    //                    if (!ld_json.pQuestionArray || ld_json.pQuestionArray.length == 0) {
                                    //                        d_json.$divPractice.find("input.continue_practice").attr("disabled", "disabled");
                                    //                    }
                                    //                }, null, null);
                                    //            }
                                    //        } else {
                                    //            $("#divAnsweredInfo div.correctinfo").hide();
                                    //            $("#divAnsweredInfo div.errorinfo").show();
                                    //            //ld_json.$divPractice.find("input.submit_question").removeAttr("disabled");
                                    //        }

                                    //        //这里更新知识点
                                    //        $excuteWS("~DrillWS.knowledgeGradesOfLoList", { loIds: [sloId], sampleQuestionFlag: false, userExtend: get_simpleUser() }, function (r) {
                                    //            if (r && r.length > 0) {
                                    //                ld_json.$divKnowledgeList.find("div[itemid=" + sloId + "] div.kpstatus").replaceWith(getKnowledgeStatusBar(get_roleId(), r[0]));
                                    //            }

                                    //        }, null, null);
                                    //    } else {

                                    //    }
                                    //}, null, null);
                                });
                               
                                //var booKG = false;
                                //if (!(questionW.questionTypeId == "1" || questionW.questionTypeId == "2" || questionW.questionTypeId == "3")) {//客观题
                                //    //booKG = true;
                                //    $("#divLdCorrectOrError").show().find("select").val("1");
                                //} else {
                                //    $("#divLdCorrectOrError").hide();
                                //}

                                $excuteWS("~TestWS.getReferenceAnswersList", { questionId: questionW.id, qpvSeedId: questionW.qpvSeedId, userExtend: get_simpleUser() }, function (r) {
                                    if (questionW.questionTypeId == "1" || questionW.questionTypeId == "2" || questionW.questionTypeId == "3") {
                                        if (r && r.length > 1 && questionW.questionTypeId != "3") {
                                            r.sort(function () { return 0.5 - Math.random() }); //打乱题的顺序
                                        }
                                    }

                                    ld_json.pReferenceAnswers = r;
                                    
                                    if (r && r.length > 0) {
                                        $("#div_panswers").html('<div referenceflag="1" questionid="' + questionW.id + '" questiontypeid="' + questionW.questionTypeId + '">' + new Question({ data: { question: questionW, answers: r, testerAnswers: null } }).getAnswerForTest() + '</div>');
                                        bindZgtAnswerClick();
                                    } else {
                                        $("#div_panswers").html("");
                                    }
                                   
                                }, null, null);
                                
                            } else {
                                ld_json.$divPractice.html('<div currentitemid="' + sloId + '">该知识点下没有例题。</div>');
                            }
                        }, null, null);

                        break;
                }
            });

        });
    });
  
})

function submitLDQuestions(onlineFlag, sloId, trqs) {
    
    var qid = $("#div_pbody").find("div[questionbody='1']").attr("questionid");
    var analysisLoFlag = true;
    if (ld_json.submitedQuestionIds.firstOrDefault("questionId", qid) == null) {
        ld_json.submitedQuestionIds.push({ questionId: qid });
    } else {
        analysisLoFlag = false;
    }
    var method = null;
    if (onlineFlag) {
        method = "~DrillWS.submitOnlineQuestions";
    } else {
        method = "~DrillWS.submitOfflineQuestions";
    }
    var _trqs =trqs!=null? trqs : getTestResultQuestionWrapperArray();
    $excuteWS(method, { testResultQuestionWrappers: _trqs, analysisLoFlag: analysisLoFlag, userExtend: get_simpleUser() }, function (re2) {
        $("#div_qdetail div.answer,div.solution").show();
        if (re2 && re2.length > 0) {
            if (re2[0].correctFlag > 0.7 || re2[0].correctFlag == 0.7) {
                $("#divAnsweredInfo div.errorinfo").hide();
                $("#divAnsweredInfo div.correctinfo").show();
                ld_json.pQuestionArray.removeAll("id", qid);
                ld_json.pLength = ld_json.pQuestionArray.length;
                ld_json.pIndex = 0;
                if (ld_json.pLength == 0) {
                    $excuteWS("~DrillWS.getQuestionSampleByLos", { loIds: [sloId], num: "3", userExtend: get_simpleUser() }, function (re3) {
                        if (re3 && re3.length > 0) {
                            ld_json.pQuestionArray = re3;
                            ld_json._pQuestionArray = ld_json.pQuestionArray.copyArray();
                        }
                        if (!ld_json.pQuestionArray || ld_json.pQuestionArray.length == 0) {
                            d_json.$divPractice.find("input.continue_practice").attr("disabled", "disabled");
                        }
                    }, null, null);
                }
            } else {
                $("#divAnsweredInfo div.correctinfo").hide();
                $("#divAnsweredInfo div.errorinfo").show();
                //ld_json.$divPractice.find("input.submit_question").removeAttr("disabled");
            }

            //这里更新知识点
            $excuteWS("~DrillWS.knowledgeGradesOfLoList", { loIds: [sloId], sampleQuestionFlag: false, userId:get_userId(),userExtend: get_simpleUser() }, function (r) {
                if (r && r.length > 0) {
                    ld_json.$divKnowledgeList.find("div[itemid=" + sloId + "] div.kpstatus").replaceWith(getKnowledgeStatusBar(get_roleId(), r[0]));
                }

            }, null, null);
        } else {

        }
    }, null, null);
}

$.fn.showCover = function () {
    
    var s = $(this.selector);
    if (s.length != 0 && s.find("div.reference_cover").length==0) {
        s.css({ "position": "relative" });
        s.append('<div class="reference_cover" style="width:100%;height:100%;background-color:#fff;position:absolute;top:0px;left:0px;filter:alpha(opacity=30);-moz-opacity:0.1;opacity:0.1"></div>');
    }
}

//$.fn.hideCover = function () {
//    var s = $(this.selector);
//    if (s.length != 0 && s.find("div.reference_cover").length != 0) {
//        s.find("div.reference_cover").remove();
//    }
//}

function bindZgtAnswerClick() {
    $("#div_panswers").unbind("click").find("div.zg_tester_answer").click(function () {
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
        });

        $aie_editor_finish.find("span.cancel_action").unbind("click").click(function () {
            editor.html(tempHtml);
            editor.hide();
        });

        if (!window.editor_loadFlag) {
            //$("div.emath_editor iframe.aie_editor_iframe").css("margin-bottom", "-7px");
            $("div.emath_editor div.aie_editor_head :not(img[click_action='createtable'],img[click_action='mathlatex'],img[click_action='justifyleft'],img[click_action='justifycenter'],img[click_action='justifyright'],img[click_action='insertorderedlist'],img[click_action='insertunorderedlist'],img[click_action='outdent'],img[click_action='indent'],img[click_action='inserthorizontalrule'],img[click_action='fullscreen'])").remove();
            window.editor_loadFlag = true;
        }

    });
}

function getTestResultQuestionWrapperArray() {

    var testResultQuestionWrapperArray = new Array();
    var _userId = get_userId();
    var _sectionId = get_sectionId();
    $("#div_panswers").find("div[referenceflag='1']").each(function () {
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
                testResultQuestionWrapper.tScore = null; //$this.attr("score");
                testResultQuestionWrapper.score = null; // $this.attr("score");
                testResultQuestionWrapper.sectionId = get_sectionId();
                testResultQuestionWrapper.stdNote = null;
                testResultQuestionWrapper.systemId = get_systemId();
                testResultQuestionWrapper.testId = null; //TC_json.testId;
                testResultQuestionWrapper.userId = get_userId();
                testResultQuestionWrapper.independence = ld_json.independenceQuestionIds.firstOrDefault("questionId", $this.attr("questionid"))!=null ? "0" : "1";
                var testerAnswersContent = "";
                $this.find("input.answer_select:checked").each(function () {//:checked
                    testerAnswersContent += $(this).val() + ",";
                });

                var lastindex = testerAnswersContent.lastIndexOf(",");
                if (lastindex != -1 && lastindex == testerAnswersContent.length - 1) {
                    testerAnswersContent = testerAnswersContent.substring(0, lastindex);
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
                var $ddlZgtWR = $("#ddlZgtWR");
                testResultQuestionWrapper.correctFlag = $ddlZgtWR.is(":visible") ? $ddlZgtWR.val() : null;
                testResultQuestionWrapper.id = null;
                testResultQuestionWrapper.improveNum = null;
                testResultQuestionWrapper.insNote = null;
                testResultQuestionWrapper.qpvSeedId = typeof $this.attr("qpvseedid") != "undefined" ? $this.attr("qpvseedid") : null;
                testResultQuestionWrapper.questionId = $this.attr("questionid");
                testResultQuestionWrapper.tScore = null;//$this.attr("score");
                testResultQuestionWrapper.score = null;// $this.attr("score");
                testResultQuestionWrapper.sectionId = get_sectionId();
                testResultQuestionWrapper.stdNote = null;
                testResultQuestionWrapper.systemId = get_systemId();
                testResultQuestionWrapper.testId = null;//TC_json.testId;
                testResultQuestionWrapper.userId = get_userId();
                testResultQuestionWrapper.independence = ld_json.independenceQuestionIds.firstOrDefault("questionId", $this.attr("questionid")) != null ? "0" : "1";
                //var testerAnswerWrapper2 = {};
                var $zgt = $this.find("div.zg_tester_answer");
                if ($zgt.find("div.emath_editor").length == 0) {
                    testResultQuestionWrapper.testerAnswersContent = $zgt.html();
                    if (testResultQuestionWrapper.testerAnswersContent.replace(/\s|　|&nbsp(;)?/gi, "") != "") {
                        testResultQuestionWrapperArray.push(testResultQuestionWrapper);
                    }
                }

                break;
        }
    });

    return testResultQuestionWrapperArray;
}
function addToKnowledgeArray(arr) {
    if (arr && arr.length > 0) {
        for (var i = 0; i < arr.length; i++) {
            var bo = false;
            for (var j = 0; j < ld_json.knowledgeArray.length; j++) {
                if (arr[i].itemId == ld_json.knowledgeArray[j].itemId) {
                    bo = true;
                    break;
                }
            }
            if (!bo) {
                ld_json.knowledgeArray.push(arr[i]);
            }
        }
    }
}

//function getKnowledgeItem(itemId) {
//   return ld_json.knowledgeArray.firstOrDefault("itemId", itemId);
//}

function getKnowledgeItemList(knowledges, newFlag) {
    $("div.learndrill td.content").css({ visibility: "visible" });
    var htmlArray = new Array();
    if (newFlag) {
        for (var i = 0; i < knowledges.length; i++) {
            htmlArray.push('<div onclick="onkowledgeitemclick(this)" itemid="' + knowledges[i].itemId + '" class="knowledge_item_new' + (i == 0 ? ' knowledge_item_sel' : "") + '"><div>' + knowledges[i].unit + ' ' + knowledges[i].itemName + '</div><div class="f_l">' + getKnowledgeStatusBar(get_roleId(), knowledges[i]) + '</div><div class="f_r"><img class="study_tab_img" src="../Images/new.png" alt=""/></div><div class="c_b"></div></div>');
        }
    } else {
        for (var j = 0; j < knowledges.length; j++) {
            if (j == 0) {
                htmlArray.push('<div onclick="onkowledgeitemclick(this)" itemid="' + knowledges[j].itemId + '" class="knowledge_item knowledge_item_sel"><div>' + knowledges[j].unit + ' ' + knowledges[j].itemName + '</div><div class="f_l">' + getKnowledgeStatusBar(get_roleId(), knowledges[j]) + '</div><div class="f_r"><img style="visibility:hidden;" class="study_tab_img" src="../Images/new.png" alt=""/></div><div class="c_b"></div></div>');
            } else {
                htmlArray.push('<div onclick="onkowledgeitemclick(this)" itemid="' + knowledges[j].itemId + '" class="knowledge_item"><div>' + knowledges[j].unit + ' ' + knowledges[j].itemName + '</div><div class="f_l">' + getKnowledgeStatusBar(get_roleId(), knowledges[j]) + '</div><div class="f_r"><img style="visibility:hidden;" class="study_tab_img" src="../Images/new.png" alt=""/></div><div class="c_b"></div></div>');
            }
        }
    }
    
    return htmlArray.join('');
}

function onkowledgeitemclick(o) {
    ld_json.$divKnowledgeList.find("div[itemid]").css("background-color", "").removeClass("knowledge_item_sel");
    $(o).css("background-color", "rgb(222,184,135)").addClass("knowledge_item_sel");

    ld_json.$tabitems.filter(".tab_item_sel").trigger("click");
}

function getLearingKnowledgeItemList(itemId, knowledges) {
    var htmlArray = new Array();
    htmlArray.push('<div currentitemid="' + itemId + '">');
    htmlArray.push('<table class="kp_list" width="100%" cellspadding="0" cellspacing="0">');
    for (var i = 0; i < knowledges.length; i++) {
        htmlArray.push('<tr class="kp">');
        htmlArray.push('<td>' +knowledges[i].unit+' '+ knowledges[i].itemName + '</td>');
        htmlArray.push('<td style="width:170px;text-align:center;">' + getKnowledgeStatusBar(get_roleId(), knowledges[i]) + '</td>');
        htmlArray.push('<td style="width:60px;"><div itemid="' + knowledges[i].itemId + '" class="studybutton">学习</div></td>');
        htmlArray.push('</tr>');
    }
    htmlArray.push('</table>');
    htmlArray.push('</div>');
    return htmlArray.join('');
}

function bindStudyButtonEvent($c, knowledges) {
    $c.find("div.studybutton").unbind("click").click(function () {
        var loid = $(this).attr("itemid");
        var knowledge = knowledges.firstOrDefault("itemId", loid);
        if (ld_json.$divKnowledgeList.find("div[itemid='" + loid + "']").length != 0) {
            var $kp_item = ld_json.$divKnowledgeList.find("div[itemid='" + loid + "']");
            $kp_item.find("img.study_tab_img").css({ "visibility": "visible" })
            $kp_item.trigger("click");
            return;
        }
        ld_json.$divKnowledgeList.append(getKnowledgeItemList([knowledge], true));
        ld_json.$divKnowledgeList.find("div[itemid='" + loid + "']").trigger("click");
    });
}