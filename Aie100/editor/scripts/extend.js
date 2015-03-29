var emath_simpleUser = null;
var emath_curriculumId = null;
var emath_iframeWin = null;
function emath_getInsertPanel(_iwin,_editor,rng) {

    if (typeof simpleUser != "undefined" && simpleUser) {
        emath_simpleUser = simpleUser;
    } else if (typeof SimpleUser != "undefined" && SimpleUser) {
        emath_simpleUser = SimpleUser;
    } else {
        simpleUser= emath_simpleUser = {};
    }

    emath_iframeWin = _iwin;
    //var rng = $.browser.msie ? emath_iframeWin.document.selection.createRange() : emath_iframeWin.getSelection().getRangeAt(0); //$("<span></span>").append(emath_iframeWin.getSelection().getRangeAt(0).cloneContents());
    if ($("#emath_insertPanel").length != 0) {
        return;
    }
    
    emath_curriculumId = emath_simpleUser && emath_simpleUser.roleId != "2" ? emath_simpleUser.CurriculumId : null;
    var emath_isbn = typeof editor_isbn == "undefined" || editor_isbn == null ? emath_simpleUser.isbn : editor_isbn;
    var htmlArray = new Array();

    htmlArray.push('<div id="emath_insertPanel">');
    htmlArray.push('<table border="0" cellpadding="0" cellspacing="0" width="100%">');
    htmlArray.push('<tr>');
    htmlArray.push('<td>');
    htmlArray.push('<table id="emath_inserTabHeader" border="0" cellpadding="3" cellspacing="3" width="210">'); //background-color:rgb(149,146,144)//background-color:rgb(153,153,153)
    htmlArray.push('<tr style="background-color:rgb(149,146,144);color:#fff;text-align:center;">');
    htmlArray.push('<td sindex=0 selected="selected" style="background-color:rgb(5,117,244);cursor:pointer;">文本</td>');
    htmlArray.push('<td sindex=1>知识点</td>');
    htmlArray.push('<td sindex=2>学习资料</td>');
    htmlArray.push('<td sindex=3>题</td>');
    htmlArray.push('</tr>');
    htmlArray.push('</table>');
    htmlArray.push('</td>');
    htmlArray.push('<td style="padding-right:5px;text-align: right;"><span id="emath_target_description" style="display:none"></span>难度:<select id="emath_insertDifficulty"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select></td>');
    htmlArray.push('</tr>');
    htmlArray.push('</table>');
    htmlArray.push('<div id="emath_insertContent">');

    htmlArray.push('<div sindex=0 style="margin:0px 3px 3px 3px;border:1px solid rgb(143,199,64);padding:3px;"><textarea id="emath_txtAreaTextInfo" style="height:105px;width:880px;"></textarea></div>');
    htmlArray.push('<div sindex=1 style="margin:0px 3px 3px 3px;border:1px solid rgb(143,199,64);padding:3px;display:none;"><div style="font-size:11px;color:red;margin:10px;">加载中...</div></div>');
    htmlArray.push('<div sindex=2 style="margin:0px 3px 3px 3px;border:1px solid rgb(143,199,64);padding:3px;display:none;"><div style="font-size:11px;color:red;margin:10px;">加载中...</div></div>');
    htmlArray.push('<div sindex=3 style="margin:0px 3px 3px 3px;border:1px solid rgb(143,199,64);padding:3px;display:none;"><div style="font-size:11px;color:red;margin:10px;">加载中...</div></div>');
    htmlArray.push('</div>');
    htmlArray.push('</div>');

    $.jBox('<div id="emath_jBoxContainer">' + htmlArray.join('') + '</div>', { id: "jbx_insert_related_info", zIndex: 100000, title: "插入信息", width: 900, dragLimit: false, buttons: { "确定": 0 },
        closed: function () {
            emath_selectedQuestionIdArray = emath_selectedReferenceIdArray = emath_selectedLoIdArray = [];
        },
        submit: function (v, o, f) {


            if (v == 0) {
                var sindex = $("#emath_inserTabHeader").find("td[sindex][selected=selected]").attr("sindex");
                if (sindex != 0) {
                    $.jBox.confirm("你是否需要添加一些文本信息?", "提示", function (v, h, f) {
                        if (v == true) {
                            //弹出文本框输入文本信息，再执行插入知识点，学习资料或题
                            $.jBox('<center><textarea id="emath_addTextInfo" style="width:340px;height:100px;">' + $("#emath_target_description").html() + '</textarea></center>', { title: "添加文本信息", submit: function () {
                                $("#emath_target_description").html($("#emath_addTextInfo").val());
                                updateImgSrc(rng, sindex, _editor);
                                $.jBox.close("jbx_insert_related_info");
                                return true;
                            }
                            });
                        }
                        else {
                            //直接执行插入知识点，学习资料或题
                            updateImgSrc(rng, sindex, _editor);
                            $.jBox.close("jbx_insert_related_info");
                            return true;

                        }
                        return true;
                    }, { buttons: { '是': true, '否': false} });
                } else {
                    // 若是添加文字，就直接添加
                    updateImgSrc(rng, sindex, _editor);
                    $.jBox.close("jbx_insert_related_info");
                    return true;
                }

                
            }
            return false;
        }
    });

    var $td = $("#emath_inserTabHeader").find("tr td");
    $td.each(function (index) {
        var $this = $(this);
        $this.hover(function () {
            if ($this.attr("selected") != "selected") {
                $this.attr("style", "background-color:rgb(111,173,255);cursor:pointer;");
            }
        }, function () {
            if ($this.attr("selected") != "selected") {
                $this.removeAttr("style");
            }
        });

        $this.click(function () {
            if ($this.attr("selected") != "selected") {
                var $currentContentDiv = $("#emath_insertContent").find("div[sindex]").hide().filter("div[sindex=" + index + "]");
                $currentContentDiv.css("display", "block");
                if ($td.filter("[sindex!=" + index + "]").is(":visible") == true) {
                    $td.removeAttr("style");
                }
                $td.removeAttr("selected");
                $this.attr("selected", "selected");
                $this.attr("style", "background-color:rgb(5,117,244);cursor:pointer;");
                switch (index) {
                    case 0: //文字信息
                        break;
                    case 1: //知识点

                        if ($("#emath_treeKnowledgeContainer").attr("loadFlag") != "1") {
                            var strArray1 = new Array();
                            strArray1.push('<table width="100%" border="1" cellpadding="0" cellspacing="0" style="border-collapse:collapse">');
                            strArray1.push('<tr>');
                            strArray1.push('<td style="width:362px;vertical-align:top;"><div id="emath_treeKnowledgeContainer" style="width:360px;height:370px;overflow:auto;"><div style="padding-top:10px;"><center><img src="../CMS/Images/ajax-loader_b.gif" alt=""/></center></div></div></td>');
                            strArray1.push('<td style="vertical-align:top;padding:5px;"><div id="emath_knowledgeSelectedDataContainer" style="display:none;height:120px;overflow:auto;margin-bottom:5px;padding:5px;border:1px solid rgb(171,197,231);">没有选择的知识点</div><div id="emath_knowledgeDataContainer" style="padding:5px;border:1px solid rgb(171,197,231);display:none;">点击章节得到知识点信息</div></td>');
                            strArray1.push('</tr>');
                            strArray1.push('</table>');
                            $currentContentDiv.html(strArray1.join(''));
                            if (window.treeKnowledgeData) {
                                emath_buildRelationTree($("#emath_treeKnowledgeContainer"), window.treeKnowledgeData, emath_isbn);
                            } else {

                                $excuteWS("~CmsWS.getBookStructureArrayForQuestionManage", { isbn: emath_isbn, exCurriculumId: emath_curriculumId, isLazy: false }, function (bsData1) {
                                    window.treeKnowledgeData = bsData1[0];
                                    emath_buildRelationTree($("#emath_treeKnowledgeContainer"), bsData1[0], emath_isbn);
                                }, null, null);
                            }
                        }
                        break;
                    case 2: //学习资料
                        if ($("#emath_treeStudyResourceContainer").attr("loadFlag") != "1") {
                            var strArray2 = new Array();
                            strArray2.push('<table width="100%" border="1" cellpadding="0" cellspacing="0" style="border-collapse:collapse">');
                            strArray2.push('<tr>');
                            strArray2.push('<td style="width:362px;vertical-align:top;"><div id="emath_treeStudyResourceContainer" style="width:360px;height:370px;overflow:auto;"><div style="padding-top:10px;"><center><img src="../CMS/Images/ajax-loader_b.gif" alt=""/></center></div></div></td>');
                            strArray2.push('<td style="vertical-align:top;padding:5px;"><div id="emath_studyResourceSelectedDataContainer" style="display:none;height:120px;overflow:auto;margin-bottom:5px;padding:5px;border:1px solid rgb(171,197,231);">没有选择的学习资料</div><div id="emath_studyResourceDataContainer" style="padding:5px;border:1px solid rgb(171,197,231);display:none;">点击知识点得到学习资料</div></td>');
                            strArray2.push('</tr>');
                            strArray2.push('</table>');
                            $currentContentDiv.html(strArray2.join(''));
                            if (window.treeStructureData) {
                                emath_buildRelationTree($("#emath_treeStudyResourceContainer"), window.treeStructureData, emath_isbn);
                            } else {
                                if (emath_simpleUser.roleId == "2") {
                                    $excuteWS("~CmsWS.getBookStructureArray", { isbn: emath_isbn, isLazy: true }, function (bsData2) {
                                        window.treeStructureData = bsData2[0];
                                        emath_buildRelationTree($("#emath_treeStudyResourceContainer"), bsData2[0], emath_isbn);
                                    }, null, null);
                                } else {
                                    $excuteWS("~CmsWS.getBookStructureArrayForQuestionManage", { isbn: emath_isbn, exCurriculumId: emath_curriculumId, isLazy: true }, function (bsData2) {
                                        window.treeStructureData = bsData2[0];
                                        emath_buildRelationTree($("#emath_treeStudyResourceContainer"), bsData2[0], emath_isbn);
                                    }, null, null);
                                }
                            }
                        }
                        break;
                    case 3: //题
                        if ($("#emath_treeQuestionContainer").attr("loadFlag") != "1") {
                            var strArray2 = new Array();
                            strArray2.push('<table width="100%" border="1" cellpadding="0" cellspacing="0" style="border-collapse:collapse">');
                            strArray2.push('<tr>');
                            strArray2.push('<td style="width:362px;vertical-align:top;"><div id="emath_treeQuestionContainer" style="width:360px;height:370px;overflow:auto;"><div style="padding-top:10px;"><center><img src="../CMS/Images/ajax-loader_b.gif" alt=""/></center></div></div></td>');
                            strArray2.push('<td style="vertical-align:top;padding:5px;"><div id="emath_questionSelectedDataContainer" style="display:none;height:120px;overflow:auto;margin-bottom:5px;padding:5px;border:1px solid rgb(171,197,231);">没有选择的题</div><div id="emath_questionDataContainer" style="padding:5px;border:1px solid rgb(171,197,231);display:none;">点击章节得到题</div></td>');
                            strArray2.push('</tr>');
                            strArray2.push('</table>');
                            $currentContentDiv.html(strArray2.join(''));
                            if (window.treeStructureData) {
                                emath_buildRelationTree($("#emath_treeQuestionContainer"), window.treeStructureData, emath_isbn);
                            } else {
                                if (emath_simpleUser.roleId == "2") {
                                    $excuteWS("~CmsWS.getBookStructureArray", { isbn: emath_isbn, isLazy: true }, function (bsData2) {
                                        window.treeStructureData = bsData2[0];
                                        emath_buildRelationTree($("#emath_treeQuestionContainer"), bsData2[0], emath_isbn);
                                    }, null, null);
                                } else {
                                    $excuteWS("~CmsWS.getBookStructureArrayForQuestionManage", { isbn: emath_isbn, exCurriculumId: emath_curriculumId, isLazy: true }, function (bsData2) {
                                        window.treeStructureData = bsData2[0];
                                        emath_buildRelationTree($("#emath_treeStudyResourceContainer"), bsData2[0], emath_isbn);
                                    }, null, null);
                                }
                            }
                        }
                        break;
                }
            }
        });
    });

    var rangeEditFlag = false;
    var $rangeParent = null;
    if ($.browser.msie) {
        if (rng.length != undefined && rng.item()) {
            rangeEditFlag = true;
            $rangeParent = $(rng.item()).parent();
            if ($rangeParent.find("img[src*='link_edit.png']").length != 1 && $(rng.item()).attr("src").indexOf("link_edit.png") == -1) {
                return;
            }
        }

    } else {
        $rangeParent = $(rng.commonAncestorContainer);
        if ($rangeParent.filter("a[type]").length == 1) {
            if ($rangeParent.find("img[src*='link_edit.png']").length == 1) {
                rangeEditFlag = true;
            } else {
                return;
            }
        }

    }
    
    if (rangeEditFlag) {

        var $a1 = $rangeParent; //$(rng.item()).parent();
        var _difficulty = $a1.attr("difficulty") != "undefined" && $a1.attr("difficulty") != "" ? $a1.attr("difficulty") : "1";
        var _text = $a1.attr("text") != "undefined" && $a1.attr("text") != "" ? $a1.attr("text") : "";

        $("#emath_insertDifficulty").val(_difficulty);
        $("#emath_target_description").html(_text);
        if ($a1.attr("type") == "text") {
            $("#emath_txtAreaTextInfo").val($a1.attr("text"));
            $("#emath_inserTabHeader").find("td[sindex]").hide();
            $("#emath_inserTabHeader").find("td[sindex=0]").trigger("click").show();
        } else if ($a1.attr("type") == "lo") {
            var _loarray = $a1.attr("loarray");
            if (typeof _loarray != "undefined" && $.trim(_loarray) != "") {
                if (_loarray.indexOf(",") != -1) {
                    emath_selectedLoIdArray = _loarray.split(",");
                } else {
                    emath_selectedLoIdArray.push(_loarray);
                }

                if (emath_selectedLoIdArray && emath_selectedLoIdArray.length > 0) {

                    $excuteWS("~CmsWS.getLearningObjectiveForLoIds", { loIds: emath_selectedLoIdArray, userExtend: emath_simpleUser }, function (r) {
                        if (r && r.length > 0) {
                            $("#emath_knowledgeSelectedDataContainer").html(emath_getKnowledgePointData(r, true)).show();
                        }
                    }, null, null);
                }
            }
            $("#emath_inserTabHeader").find("td[sindex]").hide();
            $("#emath_inserTabHeader").find("td[sindex=1]").trigger("click").show();
        } else if ($a1.attr("type") == "reference") {

            var _referencearray = $a1.attr("referencearray");
            if (typeof _referencearray != "undefined" && $.trim(_referencearray) != "") {
                if (_referencearray.indexOf(",") != -1) {
                    emath_selectedReferenceIdArray = _referencearray.split(",");
                } else {
                    emath_selectedReferenceIdArray.push(_referencearray);
                }
            }
            if (emath_selectedReferenceIdArray && emath_selectedReferenceIdArray.length > 0) {

                $excuteWS("~CmsWS.getStudyReferenceByIdsList", { ids: emath_selectedReferenceIdArray, userExtend: emath_simpleUser }, function (r) {
                    if (r && r.length > 0) {
                        var srArray = new Array();
                        srArray.push('<div>');
                        srArray.push('<div style="font-weight:bold;text-align:center;background-color:rgb(171,191,231);padding:5px;color:#526b84">选择的学习资料</div>');
                        srArray.push('<table class="gridviewblue" width="100%" cellspacing="0" cellpadding="0" style="text-align:left;">');
                        for (var k = 0; k < r.length; k++) {
                            srArray.push('<tr style="background-color:rgb(243,248,252)">');
                            srArray.push('<td style="width:30px;text-align:center;"><input onclick="emath_onSelectedSRChecked(this)" type="checkbox" referenceid="' + r[k].id + '" checked="checked"/></td>');
                            srArray.push('<td style="width:60px;text-align:center;">' + emath_getFileTypeByTypeValue(r[k].type) + '</td>');
                            srArray.push('<td style="text-align:left;">' + r[k].title + '</td>');
                            srArray.push('</tr>');
                        }
                        srArray.push('</table>');
                        srArray.push('</div>');
                        $("#emath_studyResourceSelectedDataContainer").html(srArray.join('')).show();
                    }
                }, null, null);
            }

            $("#emath_inserTabHeader").find("td[sindex]").hide();
            $("#emath_inserTabHeader").find("td[sindex=2]").trigger("click").show();
        } else if ($a1.attr("type") == "question") {
            var _questionarray = $a1.attr("questionarray");
            if (typeof _questionarray != "undefined" && $.trim(_questionarray) != "") {
                if (_questionarray.indexOf(",") != -1) {
                    emath_selectedQuestionIdArray = _questionarray.split(",");
                } else {
                    emath_selectedQuestionIdArray.push(_questionarray);
                }

                if (emath_selectedQuestionIdArray && emath_selectedQuestionIdArray.length > 0) {

                    $excuteWS("~CmsWS.getLearningObjectiveForLoIds", { loIds: emath_selectedQuestionIdArray, userExtend: emath_simpleUser }, function (r) {
                        if (r && r.length > 0) {
                            $("#emath_questionSelectedDataContainer").html(emath_onGetQustionData(r, true)).show();
                        }
                    }, null, null);
                }
            }
            $("#emath_inserTabHeader").find("td[sindex]").hide();
            $("#emath_inserTabHeader").find("td[sindex=3]").trigger("click").show();
        }
    }

}


function updateImgSrc(rng, sindex,_editor) {
    var rangeEditFlag = false;
    var $rangeParent = null;
    var $rangeHTML = null;
    var editor = null;
    
    if ($.browser.msie) {
        editor = rng;
        $rangeHTML = rng.htmlText;
        if (rng.length != undefined && rng.item()) {
            rangeEditFlag = true;
            $rangeParent = $(rng.item()).parent();
            if ($rangeParent.find("img[src*='link_edit.png']").length != 1 && $(rng.item()).attr("src").indexOf("link_edit.png") == -1) {
                return;
            }
        }

    } else {
        editor = _editor;
        $rangeParent = $(rng.commonAncestorContainer);
        if ($rangeParent.filter("a[type]").length == 1) {
            if ($rangeParent.find("img[src*='link_edit.png']").length == 1) {
                $rangeHTML = $rangeParent.html();
                rangeEditFlag = true;
            } else {
                return;
            }
        } else {
            $rangeHTML = $("<span></span>").append(rng.cloneContents()).html();
        }
    }
    
    if (sindex == 0) {
        emath_iframeWin.focus();
        var vtext = $("#emath_txtAreaTextInfo").val();
        if (rangeEditFlag) {
            if ($.trim(vtext) == "") {
               // var _a = $(rng.item()).parent();
                $rangeParent.replaceWith(_a.text());
            } else {
                $rangeParent.attr("text", vtext).attr("difficulty", $("#emath_insertDifficulty").val());
            }

        } else {
            if ($.trim(vtext) == "") return;
            if ($.trim($rangeHTML) == "") {
                editor.pasteHTML('<a type="text" difficulty="' + $("#emath_insertDifficulty").val() + '" text="' + vtext + '" style="text-decoration: none" onclick="onImgPopMsgClick(this)" href="javascript:function(){}">' + '<img icon="1" title="查看文本信息" style="border:0px;" src="../editor/imgs/richtext/notes.png" alt=""/>' + '<img style="border:0px;border-bottom: 1px dotted;" alt="" src="../editor/imgs/richtext/link_edit.png" /></a>&nbsp;',rng);
            } else {
                editor.pasteHTML('<a type="text" difficulty="' + $("#emath_insertDifficulty").val() + '" text="' + vtext + '" style="border-bottom: 1px dotted;text-decoration: none" onclick="onImgPopMsgClick(this)" href="javascript:function(){}">' + $rangeHTML + '<img style="border:0px;" alt="" src="../editor/imgs/richtext/link_edit.png" /></a>&nbsp;', rng);
            }
        }

    } else if (sindex == 1) {
        //if (emath_selectedLoIdArray.length == 0) return;

        var loIds = emath_selectedLoIdArray.join(',');
        emath_iframeWin.focus();

        if (rng.length != undefined && rng.item()) {
            if ($.trim(loIds) == "") {
                //                            $(rng.item()).parent().removeAttr("loarray");
                //var _a = $(rng.item()).parent();
                $rangeParent.replaceWith(_a.text());
            } else {
                $rangeParent.attr("loarray", loIds).attr("text", $("#emath_target_description").html()).attr("difficulty", $("#emath_insertDifficulty").val());
            }
        } else {
            if ($.trim(loIds) == "") return;
            if (rng.htmlText && $.trim(rng.htmlText) == "") {
                editor.pasteHTML('<a type="lo" text="' + $("#emath_target_description").html() + '" difficulty="' + $("#emath_insertDifficulty").val() + '" loarray="' + loIds + '" style="text-decoration: none" onclick="onImgPopMsgClick(this)" href="javascript:function(){}">' + '<img icon="1" title="View Knowledge Info" style="border:0px;" src="../editor/imgs/richtext/knowledge.png" alt=""/>' + '<img style="border:0px;border-bottom: 1px dotted;" alt="" src="../editor/imgs/richtext/link_edit.png" /></a>&nbsp;', rng);
            } else {
                editor.pasteHTML('<a type="lo" text="' + $("#emath_target_description").html() + '" difficulty="' + $("#emath_insertDifficulty").val() + '" loarray="' + loIds + '" style="border-bottom: 1px dotted;text-decoration: none" onclick="onImgPopMsgClick(this)" href="javascript:function(){}">' + $rangeHTML + '<img style="border:0px;" alt="" src="../editor/imgs/richtext/link_edit.png" /></a>&nbsp;', rng);
            }
        }

    } else if (sindex == 2) {

        // if (emath_selectedReferenceIdArray.length == 0) return;
        var studyReferenceIds = emath_selectedReferenceIdArray.join(',');
        emath_iframeWin.focus();

        if (rng.length != undefined && rng.item()) {
            if ($.trim(studyReferenceIds) == "") {
                //$(rng.item()).parent().removeAttr("referencearray");
               // var _a = $(rng.item()).parent();
                $rangeParent.replaceWith($rangeParent.text());
            } else {
                $rangeParent.attr("referencearray", studyReferenceIds).attr("text", $("#emath_target_description").html()).attr("difficulty", $("#emath_insertDifficulty").val());
            }
        } else {
            if ($.trim(studyReferenceIds) == "") return;
            if (rng.htmlText && $.trim(rng.htmlText) == "") {
                editor.pasteHTML('<a type="reference" text="' + $("#emath_target_description").html() + '" difficulty="' + $("#emath_insertDifficulty").val() + '" referencearray="' + studyReferenceIds + '" style="text-decoration: none" onclick="onImgPopMsgClick(this)" href="javascript:function(){}">' + '<img icon="1" title="查看学习资料" style="border:0px;" src="../editor/imgs/richtext/reference.png" alt=""/>' + '<img style="border:0px;border-bottom: 1px dotted;" alt="" src="../editor/imgs/richtext/link_edit.png" /></a>&nbsp;', rng);
            } else {
                editor.pasteHTML('<a type="reference" text="' + $("#emath_target_description").html() + '" difficulty="' + $("#emath_insertDifficulty").val() + '" referencearray="' + studyReferenceIds + '" style="border-bottom: 1px dotted;text-decoration: none" onclick="onImgPopMsgClick(this)" href="javascript:function(){}">' + $rangeHTML + '<img style="border:0px;" alt="" src="../editor/imgs/richtext/link_edit.png" /></a>&nbsp;', rng);
            }
        }

    } else if (sindex == 3) {

        // if (emath_selectedQuestionIdArray.length == 0) return;
        var questionIds = emath_selectedQuestionIdArray.join(',');
        emath_iframeWin.focus();

        if (rng.length != undefined && rng.item()) {
            if ($.trim(questionIds) == "") {
                //$(rng.item()).parent().removeAttr("questionarray");
                //var _a = $(rng.item()).parent();
                $rangeParent.replaceWith(_a.text());
            } else {
                $rangeParent.attr("questionarray", questionIds).attr("text", $("#emath_target_description").html()).attr("difficulty", $("#emath_insertDifficulty").val());
            }
        } else {
            if ($.trim(questionIds) == "") return;
            if (rng.htmlText && $.trim(rng.htmlText) == "") {
                editor.pasteHTML('<a type="question" text="' + $("#emath_target_description").html() + '" difficulty="' + $("#emath_insertDifficulty").val() + '" questionarray="' + questionIds + '" style="text-decoration: none" onclick="onImgPopMsgClick(this)" href="javascript:function(){}">' + '<img icon="1" title="查看题" style="border:0px;" src="../editor/imgs/richtext/question.png" alt=""/>' + '<img style="border:0px;border-bottom: 1px dotted;" alt="" src="../editor/imgs/richtext/link_edit.png" /></a>&nbsp;', rng);
            } else {
                editor.pasteHTML('<a type="question" text="' + $("#emath_target_description").html() + '" difficulty="' + $("#emath_insertDifficulty").val() + '" questionarray="' + questionIds + '" style="border-bottom: 1px dotted;text-decoration: none" onclick="onImgPopMsgClick(this)" href="javascript:function(){}">' + $rangeHTML + '<img style="border:0px;" alt="" src="../editor/imgs/richtext/link_edit.png" /></a>&nbsp;', rng);
            }
        }
    }

    emath_selectedQuestionIdArray = emath_selectedReferenceIdArray = emath_selectedLoIdArray = [];
    return true;
}

var emath_selectedLoIdArray = new Array();
var emath_selectedReferenceIdArray = new Array();
var emath_selectedQuestionIdArray = new Array();
function emath_buildRelationTree(treeContainer, treeData, isbn) {
    ///<summary>构造RelationStructure树</summary>
    treeContainer.attr("loadFlag", "1");
    var $tree = treeContainer.dynatree({
        title: "Relation Tree",
        clickFolderMode: 1,
        children: treeData,
        cookieId: "relationTree",
        onLazyRead: function (node) {
            var structureId = node.data.key;
            emath_simpleUser.isbn = isbn;
            if (treeContainer.attr("id") == "emath_treeStudyResourceContainer") {
                $excuteWS("~CmsWS.getLearningObjectiveWithStructureList", { structureId: structureId, isbn: isbn, exCurriculumId: emath_curriculumId, userExtend: emath_simpleUser }, emath_onGetKnowledgePoints, null, node);
            } else if (treeContainer.attr("id") == "emath_treeQuestionContainer") {
                $excuteWS("~TestWS.getKnowledgeGradesOfStructureList", { bookStructureId: structureId, sampleQuestionFlag: true, userId: emath_simpleUser.userId, userExtend: emath_simpleUser }, emath_onGetQuestions, null, node);
            }
        },
        onClick: function (node, event) {

            if (event.target.className != "dynatree-expander") {
                if (node.data.structureLevel == "0") {
                    return;
                }
                if (treeContainer.attr("id") == "emath_treeKnowledgeContainer") {
                    var $emath_knowledgeDataContainer = $("#emath_knowledgeDataContainer");
                    $emath_knowledgeDataContainer.show().html('<div style="padding:10px"><center><img alt="" src="../Images/ajax-loader_b.gif" /></center></div>');
                    emath_simpleUser.isbn = isbn;
                    $excuteWS("~CmsWS.getLearningObjectiveWithStructureList", { structureId: node.data.key, isbn: isbn, exCurriculumId: emath_curriculumId, userExtend: emath_simpleUser }, function (r) {
                        $emath_knowledgeDataContainer.html(emath_getKnowledgePointData(r));
                        $emath_knowledgeDataContainer.find("table td input[type=checkbox]").click(function () {

                            var $this = $(this);
                            var $to = $("#emath_knowledgeSelectedDataContainer").find("table td input[type=checkbox][loid='" + $this.attr("loId") + "']");
                            if ($this.is(":checked") || $this.is(":checked") == true) {
                                if ($to.length == 0) {
                                    var strArr1 = new Array();
                                    strArr1.push('<tr style="background-color: rgb(243,248,252)">')
                                    strArr1.push('<td style="text-align: center; width: 30px"><input onclick="emath_onSelectedKPChecked(this)" checked="checked" type="checkbox" loid="' + $this.attr("loId") + '"></td>');
                                    strArr1.push('<td style="text-align: center; width: 60px">' + $this.parent().next().html() + '</td>');
                                    strArr1.push('<td>' + $this.parent().next().next().html() + '</td>');
                                    strArr1.push('</tr>');
                                    var $lastTR = $("#emath_knowledgeSelectedDataContainer").find("table tr:last");
                                    if ($lastTR.length != 0) {
                                        $(strArr1.join('')).insertAfter($lastTR);
                                    } else {
                                        var strArray = new Array();
                                        strArray.push('<div>');
                                        strArray.push('<div style="font-weight:bold;text-align:center;background-color:rgb(171,191,231);padding:5px;color:#526b84">选择的知识点</div>');
                                        strArray.push('<table class="gridviewblue" width="100%" cellspacing="0" cellpadding="0" style="text-align:left;">');
                                        strArray.push(strArr1.join(''));
                                        strArray.push('</table>');
                                        strArray.push('</div>');
                                        $("#emath_knowledgeSelectedDataContainer").html(strArray.join(''));
                                    }
                                    if ($("#emath_knowledgeSelectedDataContainer").is(":hidden")) {
                                        $("#emath_knowledgeSelectedDataContainer").show();
                                    }
                                } else {
                                    $to.attr("checked", "checked");
                                }
                                var f1 = false;
                                for (var m = 0; m < emath_selectedLoIdArray.length; m++) {
                                    if (emath_selectedLoIdArray[m] == $this.attr("loId")) {
                                        f1 = true;
                                        break;
                                    }
                                }

                                if (!f1) {
                                    emath_selectedLoIdArray.push($this.attr("loId"));
                                }

                            } else {
                                $to.removeAttr("checked");
                                for (var n = 0; n < emath_selectedLoIdArray.length; n++) {
                                    if (emath_selectedLoIdArray[n] == $this.attr("loId")) {
                                        emath_selectedLoIdArray.splice(n, 1);
                                        break;
                                    }
                                }
                            }

                        });
                        if ($emath_knowledgeDataContainer.height() >= 210) {

                            $emath_knowledgeDataContainer.css("height", "210");
                            $emath_knowledgeDataContainer.css("overflow", "auto");
                        } else {
                            $emath_knowledgeDataContainer.css("overflow", "");
                        }
                    }, null, { userContext: "getLearningObjectiveWithStructureList" });
                } else if (treeContainer.attr("id") == "emath_treeStudyResourceContainer") {
                    var $emath_studyResourceDataContainer = $("#emath_studyResourceDataContainer");
                    $emath_studyResourceDataContainer.show().html('<div style="padding:10px"><center><img alt="" src="../Images/ajax-loader_b.gif" /></center></div>');
                    emath_simpleUser.isbn = isbn;
                    var structureFlg = "1";
                    if (node.parent.data.structureLevel == "10") {
                        structureFlg = "0";
                    }

                    //CmsWS.getStudyReferenceList(structureFlag, structureId, emath_simpleUser, Successed, Failed, { userContext: "getStudyReferenceList" }, null);
                    $excuteWS("~CmsWS.getStudyReferenceList", { type: structureFlg, structureOrLoId: node.data.key, userExtend: emath_simpleUser }, function (r) {
                        var $emath_studyResourceDataContainer = $("#emath_studyResourceDataContainer");
                        $emath_studyResourceDataContainer.html(emath_onGetStudyreferenceData(r));
                        $emath_studyResourceDataContainer.find("table td input[type=checkbox]").click(function () {
                            var $this = $(this);
                            var $to = $("#emath_studyResourceSelectedDataContainer").find("table td input[type=checkbox][referenceid='" + $this.attr("referenceid") + "']");
                            if ($this.is(":checked") || $this.is(":checked") == true) {
                                if ($to.length == 0) {
                                    var strArr = new Array();
                                    strArr.push('<tr style="background-color: rgb(243,248,252)">')
                                    strArr.push('<td style="text-align: center; width: 30px"><input onclick="emath_onSelectedSRChecked(this)" checked="checked" type="checkbox" referenceid="' + $this.attr("referenceid") + '"></td>');
                                    strArr.push('<td style="text-align: center; width: 60px">' + $this.parent().next().next().html() + '</td>');
                                    strArr.push('<td style="text-align:left;">' + $this.parent().next().html() + '</td>');
                                    strArr.push('</tr>');
                                    var $lastTR = $("#emath_studyResourceSelectedDataContainer").find("table tr:last");
                                    if ($lastTR.length != 0) {
                                        $(strArr.join('')).insertAfter($lastTR);
                                    } else {
                                        var strArray = new Array();
                                        strArray.push('<div>');
                                        strArray.push('<div style="font-weight:bold;text-align:center;background-color:rgb(171,191,231);padding:5px;color:#526b84">选择的学习资料</div>');
                                        strArray.push('<table class="gridviewblue" width="100%" cellspacing="0" cellpadding="0" style="text-align:left;">');
                                        strArray.push(strArr.join(''));
                                        strArray.push('</table>');
                                        strArray.push('</div>');
                                        $("#emath_studyResourceSelectedDataContainer").html(strArray.join(''));
                                    }
                                    if ($("#emath_studyResourceSelectedDataContainer").is(":hidden")) {
                                        $("#emath_studyResourceSelectedDataContainer").show();
                                    }
                                } else {
                                    $to.attr("checked", "checked");
                                }

                                var f1 = false;
                                for (var m = 0; m < emath_selectedReferenceIdArray.length; m++) {
                                    if (emath_selectedReferenceIdArray[m] == $this.attr("referenceid")) {
                                        f1 = true;
                                        break;
                                    }
                                }

                                if (!f1) {
                                    emath_selectedReferenceIdArray.push($this.attr("referenceid"));
                                }
                            } else {
                                $to.removeAttr("checked");
                                for (var n = 0; n < emath_selectedReferenceIdArray.length; n++) {
                                    if (emath_selectedReferenceIdArray[n] == $this.attr("referenceid")) {
                                        emath_selectedReferenceIdArray.splice(n, 1);
                                        break;
                                    }
                                }
                            }

                        });
                        if ($emath_studyResourceDataContainer.height() >= 210) {
                            $emath_studyResourceDataContainer.css("height", "210");
                            $emath_studyResourceDataContainer.css("overflow", "auto");
                        } else {
                            $emath_studyResourceDataContainer.css("overflow", "");
                        }
                    }, null, { userContext: "getStudyReferenceList" });
                } else if (treeContainer.attr("id") == "emath_treeQuestionContainer") {
                    var $emath_questionDataContainer = $("#emath_questionDataContainer");
                    $emath_questionDataContainer.show().html('<div style="padding:10px"><center><img alt="" src="../Images/ajax-loader_b.gif" /></center></div>');
                    emath_simpleUser.isbn = isbn;
                    var structureFlg = "1";
                    if (node.parent.data.structureLevel == "10") {
                        structureFlg = "0";
                    }

                    $excuteWS("~TestWS.getQuestionOfLoList", { loId: node.data.key, simpleUser: emath_simpleUser }, function (r) {
                        $emath_questionDataContainer.html(emath_onGetQustionData(r));
                        $emath_questionDataContainer.find("table td input[type=checkbox]").click(function () {
                            var $this = $(this);
                            var $to = $("#emath_questionSelectedDataContainer").find("table td input[type=checkbox][loid='" + $this.attr("loId") + "']");
                            if ($this.is(":checked") || $this.is(":checked") == true) {
                                if ($to.length == 0) {
                                    var strArr1 = new Array();
                                    strArr1.push('<tr style="background-color: rgb(243,248,252)">')
                                    strArr1.push('<td style="text-align: center; width: 30px"><input onclick="emath_onSelectedQuestionChecked(this)" checked="checked" type="checkbox" questionid="' + $this.attr("questionid") + '"></td>');
                                    strArr1.push('<td style="text-align: center; width: 60px">' + $this.parent().next().html() + '</td>');
                                    strArr1.push('<td>' + $this.parent().next().next().html() + '</td>');
                                    strArr1.push('</tr>');
                                    var $lastTR = $("#emath_questionSelectedDataContainer").find("table tr:last");
                                    if ($lastTR.length != 0) {
                                        $(strArr1.join('')).insertAfter($lastTR);
                                    } else {
                                        var strArray = new Array();
                                        strArray.push('<div>');
                                        strArray.push('<div style="font-weight:bold;text-align:center;background-color:rgb(171,191,231);padding:5px;color:#526b84">选择的题</div>');
                                        strArray.push('<table class="gridviewblue" width="100%" cellspacing="0" cellpadding="0" style="text-align:left;">');
                                        strArray.push(strArr1.join(''));
                                        strArray.push('</table>');
                                        strArray.push('</div>');
                                        $("#emath_questionSelectedDataContainer").html(strArray.join(''));
                                    }
                                    if ($("#emath_questionSelectedDataContainer").is(":hidden")) {
                                        $("#emath_questionSelectedDataContainer").show();
                                    }
                                } else {
                                    $to.attr("checked", "checked");
                                }
                                var f1 = false;
                                for (var m = 0; m < emath_selectedQuestionIdArray.length; m++) {
                                    if (emath_selectedQuestionIdArray[m] == $this.attr("questionid")) {
                                        f1 = true;
                                        break;
                                    }
                                }

                                if (!f1) {
                                    emath_selectedQuestionIdArray.push($this.attr("questionid"));
                                }
                            } else {
                                $to.removeAttr("checked");
                                for (var n = 0; n < emath_selectedQuestionIdArray.length; n++) {
                                    if (emath_selectedQuestionIdArray[n] == $this.attr("questionid")) {
                                        emath_selectedQuestionIdArray.splice(n, 1);
                                        break;
                                    }
                                }
                            }

                        });
                        if ($emath_questionDataContainer.height() >= 210) {
                            $emath_questionDataContainer.css("height", "210");
                            $emath_questionDataContainer.css("overflow", "auto");
                        } else {
                            $emath_questionDataContainer.css("overflow", "");
                        }
                    }, null, { userContext: "getStudyReferenceList" });
                }
            }

            //            if (event.target.title == "book") {
            //                return;
            //            }
            //            if (event.target.className != "dynatree-expander") {
            //                if (treeContainer.attr("id") == "divBookStructureOfQuestion") {
            //                    qsTitle1 = node.data.title;
            //                } else if (treeContainer.attr("id") == "div_tree") {
            //                    qsTitle0 = node.data.title;
            //                }
            //                onTreeNodeClick(node.data.key, flag);
            //            }
        },
        onDblClick: function (node, event) {
            node.toggleExpand();
        }
    });

    $tree.dynatree("getTree").reload()
    treeContainer.css("overflow", "");
}
function emath_onSelectedKPChecked(o) {
    if ($(o).is(":checked")) {
        if (emath_selectedLoIdArray) {
            var f1 = false;
            for (var m = 0; m < emath_selectedLoIdArray.length; m++) {
                if (emath_selectedLoIdArray[m] == $(o).attr("loId")) {
                    f1 = true;
                    break;
                }
            }

            if (!f1) {
                emath_selectedLoIdArray.push($(o).attr("loId"));
            }
        }

        $("#emath_knowledgeDataContainer").find("table td input[type=checkbox][loid='" + $(o).attr("loId") + "']").attr("checked", "checked");
    } else {
        if (emath_selectedLoIdArray) {
            for (var n = 0; n < emath_selectedLoIdArray.length; n++) {
                if (emath_selectedLoIdArray[n] == $(o).attr("loId")) {
                    emath_selectedLoIdArray.splice(n, 1);
                    break;
                }
            }
        }
        $("#emath_knowledgeDataContainer").find("table td input[type=checkbox][loid='" + $(o).attr("loId") + "']").removeAttr("checked");
    }
}

function emath_getKnowledgePointData(result,sflag) {
    var strArray = new Array();
    strArray.push('<div>');
    if (sflag) {
        strArray.push('<div style="font-weight:bold;text-align:center;background-color:rgb(171,191,231);padding:5px;color:#526b84">选择的知识点</div>');
    }
    strArray.push('<table class="gridviewblue" width="100%" cellspacing="0" cellpadding="0" style="text-align:left;">');
    if (!sflag) {
        strArray.push('<tr class="titlerow"><th>勾选</th>');
        strArray.push('<th>单元</th>');
        strArray.push('<th>知识点</th></tr>');
    }
    if (result == null || result.length == 0) {
        strArray.push('<tr><td colspan="5">没有数据</td></tr>');
    } else {

        for (var lo = 0; lo < result.length; lo++) {
            if (!sflag) {
                if (lo % 2 == 1)//奇数
                {
                    strArray.push('<tr class="evenrow">');
                }
                else //偶数
                {
                    strArray.push('<tr class="oddrow">');
                }
            } else {
                strArray.push('<tr style="background-color:rgb(243,248,252)">');
            }

            var checkedStr = "";
            for (var m = 0; m < emath_selectedLoIdArray.length; m++) {
                if (emath_selectedLoIdArray[m] == result[lo].id) {
                    checkedStr = ' checked = "checked" ';
                    break;
                }
            }

            if (sflag) {
                strArray.push('<td style="width:30px;text-align:center;"><input onclick="emath_onSelectedKPChecked(this)" loid="' + result[lo].id + '" ' + checkedStr + 'type="checkbox"/></td>');
            } else {
                strArray.push('<td style="width:30px;text-align:center;"><input loid="' + result[lo].id + '" ' + checkedStr + 'type="checkbox"/></td>');
            }
            strArray.push('<td style="width:60px;text-align:center;">' + result[lo].unit + '</td>');
            if (typeof ShowDetails == "function") {
                strArray.push('<td><span style="color:#1a5fbf;cursor:pointer;" onclick=\'new ShowDetails({data:{itemId:"' + result[lo].id + '"},show_type:"1",type:"0",jbox_options:{opacity:0.1}}).show()\'>' + result[lo].name + '</span></td>');
            } else {
                strArray.push('<td>' + result[lo].name + '</td>');
            }
            //new ShowDetails({data:{itemId:"' + result[lo].id + '"},show_type:"1",type:"0",jbox_options:{opacity:0}}).show()

            strArray.push("</tr>");
        }
    }
    strArray.push('</table>');
    strArray.push('</div>');
    return strArray.join('');
}

function emath_onSelectedSRChecked(o) {
    if ($(o).is(":checked")) {
        if (emath_selectedReferenceIdArray) {
            var f1 = false;
            for (var m = 0; m < emath_selectedReferenceIdArray.length; m++) {
                if (emath_selectedReferenceIdArray[m] == $(o).attr("referenceid")) {
                    f1 = true;
                    break;
                }
            }

            if (!f1) {
                emath_selectedReferenceIdArray.push($(o).attr("referenceid"));
            }
        }

        $("#emath_studyResourceDataContainer").find("table td input[type=checkbox][referenceid='" + $(o).attr("referenceid") + "']").attr("checked", "checked");
    } else {
        if (emath_selectedReferenceIdArray) {
            for (var n = 0; n < emath_selectedReferenceIdArray.length; n++) {
                if (emath_selectedReferenceIdArray[n] == $(o).attr("referenceid")) {
                    emath_selectedReferenceIdArray.splice(n, 1);
                    break;
                }
            }
        }
        $("#emath_studyResourceDataContainer").find("table td input[type=checkbox][referenceid='" + $(o).attr("referenceid") + "']").removeAttr("checked");
    }
}

function emath_showReferenceDetails(id) {
    new ShowDetails({ data: { studyReferenceId: id }, type: 1, show_type: 1 }).show()
}
function emath_onGetStudyreferenceData(result) {
    if (!result) {
        $("#emath_studyResourceDataContainer").html("没有学习资料信息");
        return;
    }
    var o = emath_getDiffReferenceByResult(result);
    var tabContent = new Array();
    for (var key in o) {
        var content = o[key];
        if (!content || content.length == 0) {
            continue;
        }
        var strArray = new Array();
        strArray.push('<div>');
        strArray.push(
      '<table class="gridviewblue" width="100%" cellspacing="0" cellpadding="0" style="text-align:left;">'
      + '<tr class="titlerow" style="text-align:center"><th>勾选</th>'
      + '<th>标题</th>'
      + '<th>类型</th>'
      + '<th>推荐</th></tr>'
      );
        if (content == null || content.length == 0) {
            strArray.push('<tr><td colspan="5">没有数据</td></tr>');
        } else {
            for (var l = 0; l < content.length; l++) {
                if (l % 2 == 1)//奇数
                {
                    strArray.push('<tr class="evenrow">');
                }
                else //偶数
                {
                    strArray.push('<tr class="oddrow">');
                }
                var checkedStr = "";
                for (var m = 0; m < emath_selectedReferenceIdArray.length; m++) {
                    if (emath_selectedReferenceIdArray[m] == content[l].id) {
                        checkedStr = ' checked = "checked" ';
                        break;
                    }
                }

                strArray.push('<td style="width:35px;text-align:center;"><input referenceid="' + content[l].id + '" ' + checkedStr + 'type="checkbox"/></td>');
                strArray.push('<td><span style="color:#1a5fbf;cursor:pointer;" onclick="emath_showReferenceDetails(\'' + content[l].id + '\')">' + content[l].title + '</span></td>');
                if (key == "Book") {
                    strArray.push('<td style="width:80px;text-align:center;">' + (content[l].studyReferenceTypeName ? content[l].studyReferenceTypeName : "") + '</td>');
                } else {
                    strArray.push('<td style="width:80px;text-align:center;">' + emath_getFileTypeByTypeValue(content[l].type) + '</td>');
                }
                strArray.push('<td style="width:80px;text-align:center;">' + content[l].recommendation + '</td>');

                strArray.push("</tr>");
            }
        }
        strArray.push('</table>');
        strArray.push('</div>');
                var _title = "";
                if (key == "Book") {
                    _title = "书";
                } else if (key == "Multimedia") {
                    _title = "多媒体";
                } else if (key == "Article") {
                    _title = "文章";
                } else if (key == "Others") {
                    _title = "其他";
                }
        tabContent.push({ title: _title, content: strArray.join('') });
    }

    var json = { tabContainer: "emath_studyResourceDataContainer", showTopButton: false, showNullContent: true, defaultTabIndex: 0, tabContent: tabContent }
    $EmathTab_GetTabView(json);
}

function emath_onSelectedQuestionChecked(o) {
    if ($(o).is(":checked")) {
        if (emath_selectedQuestionIdArray) {
            var f1 = false;
            for (var m = 0; m < emath_selectedQuestionIdArray.length; m++) {
                if (emath_selectedQuestionIdArray[m] == $(o).attr("questionid")) {
                    f1 = true;
                    break;
                }
            }

            if (!f1) {
                emath_selectedQuestionIdArray.push($(o).attr("questionid"));
            }
        }

        $("#emath_questionDataContainer").find("table td input[type=checkbox][questionid='" + $(o).attr("questionid") + "']").attr("checked", "checked");
    } else {
        if (emath_selectedQuestionIdArray) {
            for (var n = 0; n < emath_selectedQuestionIdArray.length; n++) {
                if (emath_selectedQuestionIdArray[n] == $(o).attr("questionid")) {
                    emath_selectedQuestionIdArray.splice(n, 1);
                    break;
                }
            }
        }
        $("#emath_questionDataContainer").find("table td input[type=checkbox][questionid='" + $(o).attr("questionid") + "']").removeAttr("checked");
    }
}
function emath_onGetQustionData(result,sflag) {
    var strArray = new Array();
    strArray.push('<div>');
    if (sflag) {
        strArray.push('<div style="font-weight:bold;text-align:center;background-color:rgb(171,191,231);padding:5px;color:#526b84">选择的题</div>');
    }
    strArray.push('<table class="gridviewblue" width="100%" cellspacing="0" cellpadding="0" style="text-align:left;">');
    if (!sflag) {
        strArray.push('<tr class="titlerow"><th>勾选</th>');
        strArray.push('<th>题号.</th>');
//        strArray.push('<th>单元</th>');
        strArray.push('<th>题</th></tr>');
    }
    if (result == null || result.length == 0) {
        strArray.push('<tr><td colspan="6">没有任何数据</td></tr>');
    } else {

        for (var q = 0; q < result.length; q++) {
            if (!sflag) {
                if (q % 2 == 1)//奇数
                {
                    strArray.push('<tr class="evenrow">');
                }
                else //偶数
                {
                    strArray.push('<tr class="oddrow">');
                }
            } else {
                strArray.push('<tr style="background-color:rgb(243,248,252)">');
            }

            var checkedStr = "";
            for (var m = 0; m < emath_selectedQuestionIdArray.length; m++) {
                if (emath_selectedQuestionIdArray[m] == result[q].id) {
                    checkedStr = ' checked = "checked" ';
                    break;
                }
            }
            if (sflag) {
                strArray.push('<td style="width:30px;text-align:center;"><input onclick="emath_onSelectedQuestionChecked(this)" questionid="' + result[q].id + '" ' + checkedStr + 'type="checkbox"/></td>');
            } else {
                strArray.push('<td style="width:30px;text-align:center;"><input questionid="' + result[q].id + '" ' + checkedStr + 'type="checkbox"/></td>');
            }
            strArray.push('<td style="width:60px;text-align:center;color:red;">' + result[q].number + '</td>');
//            strArray.push('<td style="width:60px;text-align:center;">' + result[q].unit + '</td>');
            strArray.push('<td>' + result[q].content + '</td>');
            strArray.push('</tr>');
        }
    }
    strArray.push('</table>');
    strArray.push('</div>');
    return strArray.join('');
}

function emath_getFileTypeByTypeValue(tpv) {

    var fileTypeName = "";
//    switch (tpv) {
//        case "0":
//            fileTypeName = "地址";
//            break;
//        case "2":
//            fileTypeName = "音频";
//            break;
//        case "3":
//            fileTypeName = "视频";
//            break;
//        case "4":
//            fileTypeName = "文章";
//            break;
//        case "5":
//            fileTypeName = "游戏";
//            break;
//        case "6":
//            fileTypeName = "图片";
//            break;
//        case "7":
//            fileTypeName = "FLASH";
//            break;
//        default:
//            fileTypeName = tpv;
//            break;
    //    }
        switch (tpv) {
            case "0":
                fileTypeName = "地址";
                break;
            case "1":
                fileTypeName = "书";
                break;
            case "2":
                fileTypeName = "音频";
                break;
            case "3":
                fileTypeName = "视频";
                break;
            case "4":
                fileTypeName = "文章";
                break;
            case "5":
                fileTypeName = "在线文本";
                break;
        }
    return fileTypeName;
}

function emath_getStudyMaterialType(_type) {

    if (_type == "1") {
        return "book";
    } else if (_type == "2" || _type == "3" || _type == "5" || _type == "7") {
        return "multimedia";
    } else if (_type == "0" || _type == "4" || _type == "6") {
        return "article";
    } else {
        return "others";
        }
//    var type = "";
//    switch (_type) {
//        case "0":
//            type = "地址";
//            break;
//        case "1":
//            type = "书";
//            break;
//        case "2":
//            type = "音频";
//            break;
//        case "3":
//            type = "视频";
//            break;
//        case "4":
//            type = "文章";
//            break;
//        case "5":
//            type = "在线文本";
//            break;
//    }
//    return type;
}

function emath_getDiffReferenceByResult(_result) {

    var book_array = [];
    var multimedia_array = [];
    var article_array = [];
    var others_array = [];
    if (_result != null) {
        for (var f = 0; f < _result.length; f++) {
            if (emath_getStudyMaterialType(_result[f].type) == "book") {
                book_array.push(_result[f]);
            } else if (emath_getStudyMaterialType(_result[f].type) == "multimedia") {
                multimedia_array.push(_result[f]);
            } else if (emath_getStudyMaterialType(_result[f].type) == "article") {
                article_array.push(_result[f]);
            } else if (emath_getStudyMaterialType(_result[f].type) == "others") {
                others_array.push(_result[f]);
            }
        }
    }
    var o = {};
    o.Book = book_array;
    o.Multimedia = multimedia_array;
    o.Article = article_array;
    o.Others = others_array;

    return o;
}

function emath_onGetKnowledgePoints(result, node) {
    if (result != null && result.length > 0) {
        var kpNodes = new Array();
        var kpNode = null;
        $.each(result, function () {
            kpNode = {};
            kpNode.title = this.unit + ". " + this.name;
            kpNode.key = this.id;
            kpNodes.push(kpNode);
        });
        node.addChild(kpNodes);
    } else {
        node.data.isFolder = false;
        node.render();
    }
    node.setLazyNodeStatus(DTNodeStatus_Ok);
}

function emath_onGetQuestions(result, node) {
    if (result != null && result.length > 0) {
        var kpNodes = new Array();
        var kpNode = null;
        $.each(result, function () {
            kpNode = {};
            if (this.exampleQuestionFlag > 0) {
                kpNode.title = this.unit + ". " + this.itemName + " (" + this.exampleQuestionFlag + " 个题)";
            } else {
                kpNode.title = this.unit + ". " + this.itemName;
            }
            kpNode.key = this.itemId;
            kpNodes.push(kpNode);
        });
        node.addChild(kpNodes);
    } else {
        node.data.isFolder = false;
        node.render();
    }
    node.setLazyNodeStatus(DTNodeStatus_Ok);
}


function emath_onSelectedLoConfirmClickForQuestionManage(o) {

    if ($("#divSelectQLOForQuestionManageItem").find("div[loId]").length == 0) {
        $find(qPrefix + "QuestionManage1_Tabs1").set_activeTabIndex(2);
        return;
    }

    var loIdArray = new Array();
    $("#divSelectQLOForQuestionManageItem").find("input[type=checkbox]").each(function (index) {
        var $this = $(this);
        if ($this.is(":checked")) {
            loIdArray.push($this.val());
        }
    });
    try {
        var loIds = loIdArray.join(',');
        emath_iframeWin.focus();
        emath_iframeWin.document.selection.createRange().pasteHTML("<span loarray='" + loIds + "'><img alt='' src='../Emath/mathbbs_files/tip.png'/></span>");
        $("#divSelectQLOForQuestionManage").hide();
    } catch (e) { }
}

function emath_onCancelSelectedLoClickForQuestionManage(o) {
    $("#divSelectQLOForQuestionManage").hide(200);
}