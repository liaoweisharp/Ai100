/// <reference path="../../Plugins/jquery.highcharts.js" />
/// <reference path="../Array.js" />
/// <reference path="../SimpleUser.js" />
/// <reference path="../jquery.ajax.js" />
/// <reference path="../jquery-1.10.2.min.js" />
/// <reference path="../../Plugins/showLoading/js/jquery.showLoading.min.js" />
/// <reference path="../Math.js" />
/// <reference path="../../Plugins/jBox/jquery.jBox-2.3.min.js" />

TCtr_json = {
    testResultArray: [],tj_asmt:{status:null,assignmentId:null}, $divTjAssignmentInfo:null, $spCourseName: null, $divStructureName: null, $divStructureStatus: null, $divCorreceBase: null, $spOCorrectBaseContent: null, $spPCorrectBaseContent: null, $spPCorrectBase: null, $divTreeView: null, $divAssignmentList: null, $divAssignmentListInfo: null, $divLearningInfo: null, $divAssignmentDetails: null, treeData: null, assignmentArray: null, $LC_divTabs: null, selected_structureId: null, $temp_tab: null, json_markingModel: { "1": "自动", "2": "自己参与", "3": "教师参与", "4": "相互参与", undefined: "--" },
    colors: {
        Excellent_Color: "#33aa00",
        Good_Color: "#99cc33",
        Fair_Color: "#ccff99",
        Weak_Color: "#ffff66",
        Inadequate_Color: "#ff6633",
        NotAssessed_Color: "#cccccc"
    }
};

$(function () {
    U(function () {

        //$.jBox.confirm("确定删除该任务吗？", "提示", { buttons: { '确定': true, '取消': false } }, function (v, h, f) { });
        TCtr_json.$divTjAssignmentInfo = $("#divTjAssignmentInfo");
        TCtr_json.$divTreeView = $("#divTreeView");
        TCtr_json.$divAssignmentList = $("#divAssignmentList");
        TCtr_json.$divAssignmentListInfo = $("#divAssignmentListInfo");
        TCtr_json.$divAssignmentDetails = $("#divAssignmentDetails");
        TCtr_json.$LC_divTabs = $("#LC_divTabs");
        TCtr_json.$spCourseName = $("#spCourseName");
        TCtr_json.$divStructureName = $("#divStructureName");
        TCtr_json.$divStructureStatus = $("#divStructureStatus");
        TCtr_json.$spOCorrectBaseContent = $("#spOCorrectBaseContent");
        //TCtr_json.$spPCorrectBaseContent = $("#spPCorrectBaseContent");
        //TCtr_json.$spPCorrectBase = $("#spPCorrectBase");
        TCtr_json.$divCorreceBase = $("#divCorreceBase");
        TCtr_json.$loadimg = TCtr_json.$divAssignmentDetails.find("div.img_loading");
        TCtr_json.$divLearningInfo = $("#divLearningInfo");
        $excuteWS("~CourseWS.Course_getBaseById", { id: get_courseId(), userId: get_userId(), user: get_simpleUser() }, function (r) {
            if (r) {
                //TCtr_json.$spCourseName.html(r.courseName);

                $excuteWS("~SectionManageWS.sectionInfoByIds", { sectionIds: [get_sectionId()], courseId: r.id, user: get_simpleUser() }, function (re) {
                    TCtr_json.$spCourseName.html(r.courseName + "（" + re[0].sectionName + "）");
                }, null, null);
            }
        }, null, null);

        $excuteWS("~TreeViewWS.getTreeViewData", { isbn: get_isbn(), isLazy: true, sampleQuestionFlag: false, userId: get_userId(), user: get_simpleUser() }, function (r) {
            if (r) {
                TCtr_json.treeData = r;
                aie_buildRelationTree(TCtr_json.$divTreeView, r[0], get_isbn());

            } else {
                TCtr_json.$divTreeView.html("没有数据可显示。");
            }
        }, null, null);


        // $("#divKnowledgeStatus").html(getKnowledgeStatusBar(get_roleId(), node.data.key, TCtr_json.treeData[1]));

        aie_getAssignmentInfo(null);
    });
});


function aie_getAssignmentInfo(structureId) {
    TCtr_json.$divAssignmentDetails.find("div[status],div.noasmtinfo").remove();
    TCtr_json.$divTjAssignmentInfo.hide();
    $excuteWS("~AssignmentWS.assignmentRStudent", { structureId: structureId, courseId: get_courseId(), sectionId: get_sectionId(), userId: get_userId(), userExtend: get_simpleUser() }, function (re) {
        
        if (re) {
            TCtr_json.assignmentArray = [];
            var arr = new Array();
            if (re.myMarking != null && re.myMarking.length != 0) {
                TCtr_json.tj_asmt = { status: "myMarking", assignmentId: re.myMarking[0] };
            } else if (re.otherMarking != null && re.otherMarking.length != 0) {
                TCtr_json.tj_asmt = { status: "otherMarking", assignmentId: re.otherMarking[0] };
            } else if (re.unfinished != null && re.unfinished.length != 0) {
                TCtr_json.tj_asmt = { status: "unfinished", assignmentId: re.unfinished[0] };
            } else if (re.enhance != null && re.enhance.length != 0) {
                TCtr_json.tj_asmt = { status: "enhance", assignmentId: re.enhance[0] };
            } else {
                TCtr_json.tj_asmt = null;
            }
            
            if (re.current != null && re.current.length != 0) {
                arr.push('<div class="tab_item" status="current">当前(' + re.current.length + ')</div>');
                $('<div status="current"><div class="asmts"></div><div class="pagination"></div></div>').appendTo(TCtr_json.$divAssignmentDetails);
            }

            if (re.unfinished != null && re.unfinished.length != 0) {
                arr.push('<div class="tab_item" status="unfinished">未完成(' + re.unfinished.length + ')</div>');
                $('<div status="unfinished"><div class="asmts"></div><div class="pagination"></div></div>').appendTo(TCtr_json.$divAssignmentDetails);
            }

            if (re.enhance != null && re.enhance.length != 0) {
                arr.push('<div class="tab_item" status="enhance">需加强(' + re.enhance.length + ')</div>');
                $('<div status="enhance"><div class="asmts"></div><div class="pagination"></div></div>').appendTo(TCtr_json.$divAssignmentDetails);
            }

            if (re.finishMarking != null && re.finishMarking.length != 0) {
                arr.push('<div class="tab_item" status="finishMarking">已阅卷(' + re.finishMarking.length + ')</div>');
                $('<div status="finishMarking"><div class="asmts"></div><div class="pagination"></div></div>').appendTo(TCtr_json.$divAssignmentDetails);
            }

            if (re.waitforMarking != null && re.waitforMarking.length != 0) {
                arr.push('<div class="tab_item" status="waitforMarking">待阅卷(' + re.waitforMarking.length + ')</div>');
                $('<div status="waitforMarking"><div class="asmts"></div><div class="pagination"></div></div>').appendTo(TCtr_json.$divAssignmentDetails);
            }

            if (re.otherMarking != null && re.otherMarking.length != 0) {
                arr.push('<div class="tab_item" status="otherMarking">给他人阅卷(' + re.otherMarking.length + ')</div>');
                $('<div status="otherMarking"><div class="asmts"></div><div class="pagination"></div></div>').appendTo(TCtr_json.$divAssignmentDetails);
            }

            if (re.myMarking != null && re.myMarking.length != 0) {

                arr.push('<div class="tab_item" status="myMarking">自己阅卷(' + re.myMarking.length + ')</div>');
                $('<div status="myMarking"><div class="asmts"></div><div class="pagination"></div></div>').appendTo(TCtr_json.$divAssignmentDetails);
            }

            if (re.past != null && re.past.length != 0) {
                arr.push('<div class="tab_item" status="past">已结束(' + re.past.length + ')</div>');
                $('<div status="past"><div class="asmts"></div><div class="pagination"></div></div>').appendTo(TCtr_json.$divAssignmentDetails);
            }

            if (re.upcoming != null && re.upcoming.length != 0) {
                arr.push('<div class="tab_item" status="upcoming">未开始(' + re.upcoming.length + ')</div>');
                $('<div status="upcoming"><div class="asmts"></div><div class="pagination"></div></div>').appendTo(TCtr_json.$divAssignmentDetails);
            }

            if (arr.length == 0) {
                TCtr_json.$LC_divTabs.hide();
                TCtr_json.$divAssignmentList.hideLoading();
                TCtr_json.$divAssignmentDetails.html('<div class="noasmtinfo">还没有相关任务信息。</div>');
                return;
            } else {
                TCtr_json.$LC_divTabs.show();
            }
            //if (re.current != null && re.current.length != 0) {
            //    arr.push('<div class="tab_item">全部(10)</div>');
            //}
            arr.push('<div class="c_b"></div>');


            TCtr_json.$LC_divTabs.html(arr.join(''));
            TCtr_json.$LC_divTabs.find("div.tab_item").click(function () {
                var $this =TCtr_json.$temp_tab = $(this);
                var _status =  $this.attr("status");
                TCtr_json.$LC_divTabs.find("div.tab_item").css("background-color", "");
                $this.css("background-color", "rgb(255,230,100)");
                TCtr_json.$divAssignmentDetails.find("div[status]").hide().filter("div[status='" + _status + "']").show();
                // TCtr_json.$divAssignmentDetails.find("div[status='" + _status + "']").show();
                    
                if ($this.attr("flag") == "1") {
                    //var $ctb = TCtr_json.$divAssignmentDetails.find("div[status='" + _status + "']");
                    //if ($ctb.length != 0) {
                    //    $ctb.show();
                    //}
                    return;
                }
                if (TCtr_json.$divAssignmentDetails.find("div.img_loading").length == 0) {
                    //if (TCtr_json.$divAssignmentDetails.first().length != 0) {
                    //    $('<div class="img_loading"><center><img style="margin:20px;" alt="" src="../Images/ajax-loader_b.gif" /></center></div>').insertBefore(TCtr_json.$divAssignmentDetails.first());
                    //} else {
                        TCtr_json.$divAssignmentDetails.append('<div class="img_loading"><center><img style="margin:20px;" alt="" src="../Images/ajax-loader_b.gif" /></center></div>');
                    //}
                    
                }
                TCtr_json.$divAssignmentList.show();
              
                //if (TCtr_json.$loadimg.length == 0) {
                //    TCtr_json.$divAssignmentList.showLoading();
                //}
                var $loadimg1 = TCtr_json.$divAssignmentDetails.find("div.img_loading");
                if ($loadimg1.length == 0) {
                    TCtr_json.$divAssignmentList.showLoading();
                }

                var asmtIds = re[_status];
                $this.attr("flag", "1");
                bindAssignmentPagination(asmtIds, _status)
                
            });
            if (TCtr_json.tj_asmt != null) {
                TCtr_json.$LC_divTabs.find("div.tab_item[status='" + TCtr_json.tj_asmt.status + "']").trigger("click");
            } else {
                TCtr_json.$LC_divTabs.find("div.tab_item:first").trigger("click");
            }
        }
    }, null, null);
}
//根据索引，从数据中返回部分数据
//function getIdsArray(idArray, startpos, endpos) {
//    var tempIdArray = new Array();
//    if (idArray) {
//        var tidArray = idArray;
//        var lastIndex = tidArray.length - 1;
//        if (endpos > lastIndex) {
//            endpos = lastIndex;
//        }
//        tempIdArray = tidArray.slice(startpos, endpos + 1);
//    }
//    return tempIdArray;
//}

var tpageSize = 10;
function bindAssignmentPagination(asmtIds, vstatus) {
    
    
    $("div[status='"+vstatus+"']>div.pagination").html("").pagination(asmtIds.length, {
        num_edge_entries: 2,
        num_display_entries: 5,
        items_per_page: tpageSize,
        prev_text: "上一页",
        next_text: "下一页",
        callback: function (page_index, o) {
            // container.parent().showLoading();
            
            var $statusTb = TCtr_json.$divAssignmentDetails.find("div[status='" + vstatus + "'] table[status='" + vstatus + "']");
            $statusTb.hide();
            if ($statusTb.filter("[pageindex='" + page_index + "']").length!=0) {
                $statusTb.filter("[pageindex='" + page_index + "']").show();
                return;
            } 
            
            var _startPos = page_index * tpageSize;
            var _endPos = _startPos + (tpageSize - 1);
            var _asmtIds = getIdsArray(asmtIds, _startPos, _endPos);
            $excuteWS("~AssignmentWS.assignmentByIds", { assignmentIds: _asmtIds, courseId: get_courseId(), sectionId: get_sectionId(), userId: get_userId(), userExtend: get_simpleUser() }, function (r, context) {
                var assignmentIds = new Array();
                var xhasignmentIds = new Array();
                var tbArray = new Array();

                if (r && r.length > 0) {
                    TCtr_json.assignmentArray.addRange(r);
                    tbArray.push('<table pageindex="'+page_index+'" status="' + context.status + '" class="tb_asmt" width="100%">');
                    tbArray.push('<tr class="tr0">');
                    tbArray.push('<th style="width:40px;">编号</th>');
                    tbArray.push('<th>任务名称</th>');
                    //tbArray.push('<th style="width:55px">日期</th>');
                    tbArray.push('<th style="width:110px;">原始成绩</th>');
                    tbArray.push('<th style="width:110px;">提高后成绩</th>');
                    tbArray.push('<th style="width:101px;">状态</th>');
                    tbArray.push('<th style="width:90px;">训练</th>');
                    tbArray.push('</tr>');
                    var bianhao = page_index * tpageSize;
                    for (var i = 0; i < r.length; i++) {
                        bianhao++;
                        assignmentIds.push(r[i].id);
                        if (r[i].markingModel == "4") {
                            xhasignmentIds.push(r[i].id);
                        }
                        //var title_time = '开始日期：' + jDateFormat(r[i].startDate) + '\n' + '结束日期：' + jDateFormat(r[i].endDate);
                        tbArray.push('<tr markingmodel=' + r[i].markingModel + ' assignmentid="' + r[i].id + '" testId="'+r[i].testId+'" class="tr">');
                        tbArray.push('<td>' + bianhao + '</td>');
                        var asmtname = '<a href="#" title="查看任务设置" assignmenttitle="1" assignmentid="' + r[i].id + '" onclick="aie_viewAsmtSettings(this)">' + r[i].title + '</a>';
                        tbArray.push('<td style="text-align:left;padding:0px 5px;">'+asmtname+'</td>');
                        if (TCtr_json.tj_asmt && r[i].id == TCtr_json.tj_asmt.assignmentId) {
                            TCtr_json.$divTjAssignmentInfo.find("div.asmtname").html(asmtname);
                            TCtr_json.$divTjAssignmentInfo.show();
                        }
                        //if (r[i].timeState == "1") {
                        //    tbArray.push('<td timestate="' + r[i].timeState + '">未开始</td>');
                        //} else if (r[i].timeState == "2") {
                        //    tbArray.push('<td timestate="' + r[i].timeState + '">进行中</td>');
                        //} else if (r[i].timeState == "3") {
                        //    tbArray.push('<td timestate="' + r[i].timeState + '">已结束</td>');
                        //}
                        //tbArray.push('<td>' + jDateFormat(r[i].startDate) + '</td>');
                        //tbArray.push('<td>' + jDateFormat(r[i].endDate) + '</td>');
                        tbArray.push('<td cj="1"><img src="../Images/ajax-loader_m.gif" alt="..."/></td>');
                        tbArray.push('<td tg_cj="1"><img src="../Images/ajax-loader_m.gif" alt="..."/></td>');
                        tbArray.push('<td zt="1" style="padding-bottom:5px"><img src="../Images/ajax-loader_m.gif" alt="..."/></td>');
                        tbArray.push('<td tg_zt="1" style="padding-bottom:5px" timestate="' + r[i].timeState + '"><img src="../Images/ajax-loader_m.gif" alt="..."/></td>');
                        //tbArray.push('<img onclick="location.href=\'../TestShow/TestContent.aspx?sectionId='+get_sectionId()+'&assignmentId=' + r[i].id + '\'" src="../Images/application_view_detail.png" alt="训练" title="训练"/>');
                        //tbArray.push('<span class="status" onclick="location.href=\'../TestShow/TestContent.aspx?sectionId=' + get_sectionId() + '&assignmentId=' + $this.attr("assignmentId") + '\'" >开始考试</span>');
                        //tbArray.push('</td>');
                        tbArray.push('</tr>');
                    }
                    tbArray.push('</table>');
                } else {
                    tbArray.push('<div class="noasmtinfo">还没有相关任务信息。</div>');
                }

                var $loadimg2 = TCtr_json.$divAssignmentDetails.find("div.img_loading");
                if ($loadimg2.length != 0) {
                    $loadimg2.remove();
                }

                TCtr_json.$divAssignmentDetails.find("div[status='" + context.status + "']>div.asmts").append(tbArray.join(''));
               
                TCtr_json.$divAssignmentList.hideLoading();
                
                if (assignmentIds.length > 0) {
                    $excuteWS("~AssignmentWS.assignmentIdsByotherMarking", { assignmentIds: xhasignmentIds, userId: get_userId(), sectionId: get_sectionId(), userExtend: get_simpleUser() }, function (rs) {

                        $excuteWS("~TLCenterWS.testResultByAssignmentIds", { assignmentIds: assignmentIds, userId: get_userId(), user: get_simpleUser() }, function (re) {
                            
                            if (re) {
                                TCtr_json.$divAssignmentDetails.find("table[status='" + context.status + "'] tr[assignmentid]").each(function () {
                                    var $this = $(this);
                                    var ro = null;
                                    for (var k = 0; k < re.length; k++) {
                                        if (re[k].assignmentId == $this.attr("assignmentId")) {
                                            ro = re[k];
                                            break;
                                        }
                                    }

                                    if (ro != null) {
                                        if (ro.improveHistory && ro.improveHistory.indexOf("null;") == 0) {
                                            ro.improveHistory=ro.improveHistory.replace("null;", "");
                                        }
                                        
                                        TCtr_json.testResultArray.push(ro);
                                        if (ro.adjustScore && ro.adjustScore >= 0) {
                                            $this.find("td[cj='1']").html(ro.adjustScore + "/" + ro.totalScore + "=" + accMul(Math_Round(ro.adjustScore / ro.totalScore, 2), 100) + "%");
                                        } else {
                                            $this.find("td[cj='1']").html("--");
                                        }

                                        if (ro.improvedScore && ro.improvedScore >= 0) {
                                            $this.find("td[tg_cj='1']").html('<span class="status" style="width:100%" onclick="aie_viewImproveHistory(\'' + $this.attr("assignmentId") + '\',\'' + ro.id + '\')" title="查看提高历史">' + (ro.improvedScore + "/" + ro.totalScore + "=" + accMul(Math_Round(ro.improvedScore / ro.totalScore, 2), 100) + "%") + "</span>");
                                        } else {
                                            $this.find("td[tg_cj='1']").html("--");
                                        }

                                        var b = null;
                                        if (rs) {
                                            for (var v = 0; v < rs.length; v++) {
                                                if (rs[v].key == $this.attr("assignmentId")) {
                                                    b = rs[v].value;
                                                    break;
                                                }
                                            }
                                        }

                                        var ztstr = "";
                                        
                                        var tg_ztstr = get_studyFlag() == "0" ? "--" : '<div class="reports"><div class="xxreports" onclick="aie_onLeaningDrillClick(\'' + $this.attr("testId") + '\')"><img src="../Images/startdrill.png" />开始训练</div></div>';
                                        if (b == false) {
                                            //ztstr += '<span class="status" onclick="location.href=\'../TestShow/CorrectingPapers.aspx?sectionId=' + get_sectionId() + '&assignmentId=' + $this.attr("assignmentId") + '&cpflag=1\'">开始阅卷</span>';
                                            ztstr += '<div class="reports"><div class="xxreports" onclick="openNewWindow(\'../Student/Reports.aspx?sectionId=' + get_sectionId() + '&assignmentId=' + $this.attr("assignmentId") + '\')"><img src="../Images/otherreport.png" />他人报告</div></div>';
                                            //$this.find("td[zt='1']").html('<span class="status" onclick="location.href=\'../TestShow/CorrectingPapers.aspx?sectionId=' + get_sectionId() + '&assignmentId=' + $this.attr("assignmentId") + '&cpflag=1\'">开始阅卷</span>');
                                        } //else {
                                        else if (b == true) {
                                            ztstr += '<div class="reports"><div class="xxreports" onclick="openNewWindow(\'../Student/Reports.aspx?sectionId=' + get_sectionId() + '&assignmentId=' + $this.attr("assignmentId") + '\')"><img src="../Images/othermark.png" />给他人阅卷</div></div>';
                                        }
                                        if (ro.statusFlag == "1") {
                                            if (b != null) {
                                                ztstr += '<div class="reports"><div class="xxreports" onclick="openNewWindow(\'../TestShow/CorrectingPapers.aspx?sectionId=' + get_sectionId() + '&assignmentId=' + $this.attr("assignmentId") + '\')"><img src="../Images/viewreport.png" />查看报告</div></div>';
                                            } else {
                                                ztstr += '<div class="reports"><div class="xxreports" onclick="openNewWindow(\'../TestShow/CorrectingPapers.aspx?sectionId=' + get_sectionId() + '&assignmentId=' + $this.attr("assignmentId") + '\')"><img src="../Images/viewreport.png" />查看报告</div></div>';
                                            }

                                            if (ro.improveNum <= 5) {
                                                if (ro.improveType == "1" && ro.improveScoreFlag != "1") {//提高阅卷
                                                    tg_ztstr = '<div class="reports"><div class="xxreports" onclick="location.href=\'../TestShow/CorrectingPapers.aspx?type=3&sectionId=' + get_sectionId() + '&assignmentId=' + $this.attr("assignmentId") + '\'"><img src="../Images/startmark.png" />开始阅卷</div></div>';
                                                } else {
                                                    tg_ztstr = '<div class="reports"><div class="xxreports" onclick="location.href=\'../TestShow/TestContent.aspx?type=2&sectionId=' + get_sectionId() + '&assignmentId=' + $this.attr("assignmentId") + '\'"><img src="../Images/startimprove.png" />开始提高</div></div>';
                                                }
                                            }

                                        } else if (ro.statusFlag == "2") {
                                            //if (b != null) {
                                            //    ztstr +=  aie_getMarkingModelYJ($this.attr("markingmodel"), $this.attr("assignmentId"));
                                            //} else {
                                            //    ztstr += aie_getMarkingModelYJ($this.attr("markingmodel"), $this.attr("assignmentId"));
                                            //}
                                            if (ztstr == "") {
                                                ztstr += aie_getMarkingModelYJ($this.attr("markingmodel"), $this.attr("assignmentId"));
                                            }
                                            //$this.find("td[zt='1']").html(aie_getMarkingModelYJ($this.attr("markingmodel"), $this.attr("assignmentId")));//('<span onclick="location.href=\'../TestShow/CorrectingPapers.aspx?sectionId=' + get_sectionId() + '&assignmentId=' + $this.attr("assignmentId") + '\'">阅卷' + aie_getMarkingmodel($this.attr("markingmodel")) + '</span>');
                                        } else if (ro.statusFlag == "3") {
                                            if (b != null) {
                                                ztstr += '<div class="reports"><div class="xxreports" onclick="location.href=\'../TestShow/TestContent.aspx?sectionId=' + get_sectionId() + '&assignmentId=' + $this.attr("assignmentId") + '\'"><img src="../Images/waitsubmit.png" />等待提交</div></div>';
                                            } else {
                                                ztstr += '<div class="reports"><div class="xxreports" onclick="location.href=\'../TestShow/TestContent.aspx?sectionId=' + get_sectionId() + '&assignmentId=' + $this.attr("assignmentId") + '\'"><img src="../Images/waitsubmit.png" />等待提交</div></div>';
                                            }
                                            //$this.find("td[zt='1']").html('<span class="status" onclick="location.href=\'../TestShow/TestContent.aspx?sectionId=' + get_sectionId() + '&assignmentId=' + $this.attr("assignmentId") + '\'" >等待提交</span>');
                                        }
                                        $this.find("td[zt='1']").html(ztstr);
                                        $this.find("td[tg_zt='1']").html(tg_ztstr);
                                        
                                        //}
                                    } else {
                                        var tg_ztstr2 = get_studyFlag() == "0" ? "--" : '<div class="reports"><div class="xxreports" onclick="aie_onLeaningDrillClick(\'' + $this.attr("testId") + '\')"><img src="../Images/startdrill.png" />开始训练</div></div>';
                                        $this.find("td[cj='1']").html("--");
                                        $this.find("td[tg_cj='1']").html("--");
                                        $this.find("td[tg_zt='1']").html(tg_ztstr2);

                                        var timestate = $this.find("td[timestate]").attr("timestate");
                                        if (timestate == "2") {
                                            $this.find("td[zt='1']").html('<div class="reports"><div class="xxreports" onclick="location.href=\'../TestShow/TestContent.aspx?sectionId=' + get_sectionId() + '&assignmentId=' + $this.attr("assignmentId") + '\'" ><img src="../Images/starttest.png" />开始考试</div></div>');
                                        } else {
                                            $this.find("td[zt='1']").html("--");
                                        }
                                    }
                                    
                                    if (TCtr_json.tj_asmt && $this.attr("assignmentId") == TCtr_json.tj_asmt.assignmentId) {
                                        TCtr_json.$divTjAssignmentInfo.find("div.asmtcj").html("<span>原始成绩：" + $this.find("td[cj='1']").html() + "</span>" + "<span style='margin-left:20px;'>提高后成绩：" + $this.find("td[tg_cj='1']").html() + "</span>");
                                        var _ztHtml = $this.find("td[zt='1']").html();
                                        var _tgztHtml = $this.find("td[tg_zt='1']").html();
                                        TCtr_json.$divTjAssignmentInfo.find("div.asmtztxl").html("<div class='f_l'>" + (_ztHtml.text != "--" ? _ztHtml : "") + "</div>" + "<div class='f_l'>" + (_tgztHtml != "--" ? _tgztHtml : "") + "</div><div class='c_b'></div>").find("div.reports").css({ float: "left" });
                                        TCtr_json.$divTjAssignmentInfo.show();
                                    }
                                });
                            } else {

                                TCtr_json.$divAssignmentDetails.find("table[status='" + context.status + "']  tr[assignmentid]").each(function () {
                                    var $this = $(this);
                                    $this.find("td[cj='1']").html("--");
                                    $this.find("td[tg_cj='1']").html("--");
                                    $this.find("td[tg_zt='1']").html('--');
                                    var timestate = $this.find("td[timestate]").attr("timestate");
                                    if (timestate == "2") {
                                        $this.find("td[zt='1']").html('<div class="reports"><div class="xxreports" onclick="location.href=\'../TestShow/TestContent.aspx?sectionId=' + get_sectionId() + '&assignmentId=' + $this.attr("assignmentId") + '\'" ><img src="../Images/starttest.png" />开始考试</div></div>');
                                    } else {
                                        $this.find("td[zt='1']").html("--");
                                    }
                                    if ($this.attr("assignmentId") == TCtr_json.tj_asmt.assignmentId) {
                                        TCtr_json.$divTjAssignmentInfo.find("div.asmtcj").html("<span>原始成绩：" + $this.find("td[cj='1']").html() + "</span>" + "<span style='margin-left:20px;'>提高后成绩：" + $this.find("td[tg_cj='1']").html() + "</span>");
                                        var _ztHtml2 = $this.find("td[zt='1']").html();
                                        var _tgztHtml2 = $this.find("td[tg_zt='1']").html();
                                        TCtr_json.$divTjAssignmentInfo.find("div.asmtztxl").html("<div class='f_l'>" + (_ztHtml2.text != "--" ? _ztHtml2 : "") + "</div>" + "<div class='f_l'>" + (_tgztHtml2 != "--" ? _tgztHtml2 : "") + "</div><div class='c_b'></div>").find("div.reports").css({float:"left"});
                                        TCtr_json.$divTjAssignmentInfo.show();
                                    }
                                });
                            }
                           
                        }, null, null);
                    }, null, null);

                }
            }, null, { status: vstatus });
        }
    });
}

function aie_onLeaningDrillClick(testId) {
    openNewWindow("../TestShow/LearnAndDrill.aspx?sectionId=" + get_sectionId() + "&assignmentId=" + testId);
}

function aie_viewAsmtSettings(o) {
    //TCtr_json.$divAssignmentDetails.find("div[status='" + context.status + "'] table[pageindex='" + page_index + "'][status='" + context.status + "'] a[assignmenttitle]").click(function () {
        var $ts = $(o);
        $.jBox('<div style="padding:5px 15px;" id="jbx_assignmentsettings"><div class="img_loading"><center><img style="margin:20px;" alt="" src="../Images/ajax-loader_b.gif" /></center></div></div>', { title: "任务设置" });
        var asmt = TCtr_json.assignmentArray.firstOrDefault("id", $ts.attr("assignmentid"));
        $excuteWS("~AssignmentWS.assignmentSettingByIds", { ids: [asmt.assignmentSettingId], userExtend: get_simpleUser() }, function (re1) {

            if (re1 && re1.length > 0) {
                var arr = new Array();

                arr.push('<div style="line-height:22px;">');
                //arr.push('<div>任务名称：' + asmt.title + '</div>');

                arr.push('<div>阅卷模式：' + TCtr_json.json_markingModel[asmt.markingModel] + '</div>');
                arr.push('<div>考试时间：' + asmt.testTime + ' 分钟</div>');
                arr.push('<div>最短交试卷时间：' + (asmt.shorTestTime ? asmt.shorTestTime : "--") + '</div>');
                arr.push('<div>开始日期：' + jDateFormat(asmt.startDate) + '</div>');
                arr.push('<div>结束日期：' + jDateFormat(asmt.endDate) + '</div>');
                arr.push('<div>是否打乱题的顺序：' + (asmt.upsetQuestion == 1 ? "是" : "否") + '</div>');
                arr.push('<div>是否在指定时间内完成：' + (asmt.dateControl == 1 ? "是" : "否") + '</div>');
                arr.push('<div>是否显示做错的考题：' + (re1[0].showErrorQuestion == 1 ? "是" : "否") + '</div>');
                arr.push('<div>是否用做错的题来提高成绩：' + (re1[0].allowErrorQuestionImprove == 1 ? "是" : "否") + '</div>');
                if (get_studyFlag() == "1") {
                    arr.push('<div>是否允许用训练来提高成绩：' + (re1[0].allowDrillImprove == 1 ? "是" : "否") + '</div>');//
                    arr.push('<div>是否显示答案：' + (re1[0].showAnswer == 1 ? "是" : "否") + '</div>');//
                    arr.push('<div>是否在考试前显示训练：' + (re1[0].showDrill == 1 ? "是" : "否") + '</div>');//
                    arr.push('<div>是否显示提示：' + (re1[0].showHint == 1 ? "是" : "否") + '</div>');//
                    arr.push('<div>是否显示知识点：' + (re1[0].showKp == 1 ? "是" : "否") + '</div>');//
                    arr.push('<div>是否显示解题过程：' + (re1[0].showSolution == 1 ? "是" : "否") + '</div>');//
                }
                arr.push('</div>');
                $("#jbx_assignmentsettings").html(arr.join(''));
            } else {
                $("#jbx_assignmentsettings").html("没有可用的设置信息。");
            }
        }, null, null);
   // })

}

function aie_viewImproveHistory(assignmentId,testResultId) {
    if (TCtr_json.testResultArray.length > 0 && testResultId && $.trim(testResultId) != "") {
        var re = TCtr_json.testResultArray.firstOrDefault("id", testResultId);
        var historyArray = re ? re.improveHistory.split(";") : null;
        if (historyArray) {
            var tbArray = new Array();
            tbArray.push('<table border="1" width="100%" borderColor="rgb(174,174,174)" style="border:1px solid rgb(174,174,174)">');
            tbArray.push('<tr style="background-color:rgb(174,174,174)">');
            tbArray.push('<th>次数</th>');
            tbArray.push('<th>成绩</th>');
            tbArray.push('<th>提高成绩</th>');
            tbArray.push('<th>时间</th>');
            tbArray.push('<th>报告</th>');
            tbArray.push('</tr>');
            for (var i = 0; i < historyArray.length; i++) {
                var history = historyArray[i] && $.trim(historyArray[i]) != "" ? historyArray[i].split(",") : null;
                tbArray.push('<tr>');
                var improveNum = i + 1;
                tbArray.push('<td style="text-align:center;">' + improveNum + '</td>');
                tbArray.push('<td style="text-align:center;">' + history[0] + '</td>');
                tbArray.push('<td style="text-align:center;">' + (history[1] + "/" + history[2] + "=" + accMul(Math_Round(history[1] / history[2], 2), 100) + "%") + '</td>');
                tbArray.push('<td style="text-align:center;">' + history[4] + '</td>');
                tbArray.push('<td style="text-align:center;"><a href="../TestShow/CorrectingPapers.aspx?sectionId=' + get_sectionId() + '&assignmentId=' + assignmentId + '&type=3&improveNum=' + improveNum + '" target="_blank">查看报告</a></td>');
                tbArray.push('</tr>');
            }
            tbArray.push('<table>');
        }
        $.jBox(tbArray.join(''), { title: "考试提高历史记录", width: 450, buttons: {}});
    } 
    
}

function updateTreeData(treeData) {
    if (!(treeData && TCtr_json.treeData[1] && treeData.key)) {
        return;
    }
    var item = TCtr_json.treeData[1].firstOrDefault("itemId", treeData.key);
    var status = getKnowledgeStatus(item.personalKnowledgeScore);
    treeData.title = "<span class='status_" + status + "'>&nbsp;</span>" + treeData.title + "";
    if (treeData.children != null) {
        for (var i = 0; i < treeData.children.length; i++) {
            updateTreeData(treeData.children[i]);
        }

    }
}

var knowledgeGradesArray = null;
function aie_buildRelationTree(treeContainer, treeData, isbn) {
    ///<summary>构造RelationStructure树</summary>
    knowledgeGradesArray = TCtr_json.treeData[1];
    treeContainer.attr("loadFlag", "1");
    updateTreeData(treeData);
    var $tree = treeContainer.dynatree({
        title: "Relation Tree",
        clickFolderMode: 1,
        children: treeData,
        cookieId: "relationTree",
        onLazyRead: function (node) {
            var structureId = node.data.key;
            $excuteWS("~TreeViewWS.getKnowledgeGradesOfStructureList", { structureId: structureId, sampleQuestionFlag: false, userId: get_userId(), user: get_simpleUser() }, function (result) {
                if (result != null && result.length > 0) {
                    if (knowledgeGradesArray == null) {
                        knowledgeGradesArray = [];
                    }

                    var arr= result.except(knowledgeGradesArray)
                    if (arr && arr.length > 0) {
                        knowledgeGradesArray.addRange(arr);
                    }
                    var kpNodes = new Array();
                    var kpNode = null;
                    
                    $.each(result, function () {
                        kpNode = {};
                        kpNode.title = "<span class='status_" + getKnowledgeStatus(this.personalKnowledgeScore) + "'>&nbsp;</span>" + this.unit + ". " + this.itemName;
                        kpNode.key = this.itemId;
                        kpNodes.push(kpNode);
                    });
                    node.addChild(kpNodes);
                } else {
                    node.data.isFolder = false;
                    node.render();
                }
                node.setLazyNodeStatus(DTNodeStatus_Ok);
            }, null, node);
        },
        onClick: function (node, event) {
            
            if (TCtr_json.selected_structureId == node.data.key) {
                return;
            }
            //TCtr_json.$spPCorrectBase.hide();
            TCtr_json.selected_structureId = node.data.key;
            if (event.target.className != "dynatree-expander") {
                TCtr_json.$divStructureStatus.show();
                
                
                var $title = $("<span>" + node.data.title + "</span>");
                $title.find("span[class*=status_]").remove();
                TCtr_json.$divStructureName.html($title.html());
                var knowledgeGrade = null;
                
                if (knowledgeGradesArray) {
                    for (var i = 0; i < knowledgeGradesArray.length; i++) {
                        if (knowledgeGradesArray[i].itemId == node.data.key) {
                            knowledgeGrade = knowledgeGradesArray[i];
                            break;
                        }
                    }
                }

                //if (knowledgeGrade.pCountOlo>0) {
                TCtr_json.$divCorreceBase.show();
                
                    var oc = (knowledgeGrade.pCountOlo == 0) ? "--" : Math_Round(knowledgeGrade.pCorrectOlo,1) + "/" + knowledgeGrade.pCountOlo + "=" + accMul(Math_Round(accDiv(knowledgeGrade.pCorrectOlo, knowledgeGrade.pCountOlo), 2), 100) + "%";
                    //var pc = (knowledgeGrade.pCountPlo == 0) ? null : knowledgeGrade.pCorrectPlo + "/" + knowledgeGrade.pCountPlo + "=" + accMul(Math_Round(accDiv(knowledgeGrade.pCorrectPlo, knowledgeGrade.pCountPlo), 2), 100) + "%";
                    TCtr_json.$spOCorrectBaseContent.html(oc);

                    //if (pc) {
                    //    TCtr_json.$spPCorrectBase.show();
                    //    TCtr_json.$spPCorrectBaseContent.html(pc);
                    //}
                //}

                
                $("#divKnowledgeStatus").html(getKnowledgeStatusBar(get_roleId(), knowledgeGrade));
                if (node.parent.data.structureLevel == "10") {
                    //TCtr_json.$divAssignmentList.show();
                    TCtr_json.$divAssignmentListInfo.hide();
                    getTbLeanringInfo(node.data, 1);
                    //if (get_studyFlag() == 1) {
                    //   openNewWindow("../Student/LearnAndDrill.aspx?sectionId=" + get_sectionId() + "&loId=" + node.data.key);
                    //}
                } else {
                   // TCtr_json.$divAssignmentList.show();
                    TCtr_json.$divAssignmentListInfo.show();
                    getTbLeanringInfo(node.data, 0);
                    aie_getAssignmentInfo(node.data.key);
                }

            }
        },
        onDblClick: function (node, event) {
            node.toggleExpand();
        }
    });

    $tree.dynatree("getTree").reload();
    try {
        //var _key=$tree.dynatree("getRoot").getChildren()[0].data.key;
        getTbLeanringInfo($tree.dynatree("getRoot").getChildren()[0].data, "0");
    } catch (e) { }
    treeContainer.css("overflow", "");
}

function getTbLeanringInfo(nodedata, ttype) {
    //structure:0 lo:1
    var _key = nodedata.key;
    var tbArray=new Array();
    tbArray.push('<table cellspacing="8" cellpadding="15">');
    tbArray.push('<tr>');
    if (get_studyFlag() == "1") {
        tbArray.push('<td class="td1">');
        tbArray.push('<div class="litem">');
        tbArray.push('<div class="ltitle">学习与训练</div>');

        tbArray.push('<div><img ltype="0" tid="'+_key+'" alt="" src="../Images/learndrill.png" /></div>');

        tbArray.push('</div>');
        tbArray.push('</td>');
    }
        tbArray.push('<td class="td2">');
        tbArray.push('<div class="litem">');
        tbArray.push('<div class="ltitle">错题回顾</div>');
        tbArray.push('<div><img ltype="1" tid="' + _key + '" alt="" src="../Images/erqreview.png" /></div>');
        tbArray.push('</div>');
        tbArray.push('</td>');
   
    if (ttype == 0) {
        tbArray.push('<td class="td3">');
        tbArray.push('<div class="litem">');
        tbArray.push('<div class="ltitle">学得怎么样</div>');
        tbArray.push('<div><img ltype="2" tid="' + _key + '" alt="" src="../Images/piechart1.png" /></div>');
        tbArray.push('</div>');
        tbArray.push('</td>');
    } else {
        tbArray.push('<td class="td4">');
        tbArray.push('<div class="litem">');
        tbArray.push('<div class="ltitle">学习历史</div>');
        tbArray.push('<div><img ltype="3" tid="' + _key + '" alt="" src="../Images/linechart.png" /></div>');
        tbArray.push('</div>');
        tbArray.push('</td>');
    }
    tbArray.push('</tr>');
    tbArray.push('</table>');
    TCtr_json.$divLearningInfo.html(tbArray.join(''));
    TCtr_json.$divLearningInfo.find("div.litem img[ltype]").unbind("click").click(function () {
        
        var $this = $(this);
        var tid = $this.attr("tid");
        switch ($this.attr("ltype")) {
            case "0"://学习与训练
                if (nodedata.bookId) {
                    openNewWindow("../TestShow/LearnAndDrill.aspx?sectionId=" + get_sectionId() + "&isbn=" + get_isbn());
                } else {
                    openNewWindow("../TestShow/LearnAndDrill.aspx?sectionId=" + get_sectionId() + "&" + (ttype == 0 ? "structureId" : "loId") + "=" + tid);
                }
                
                break;
            case "1"://错题回顾
                if (nodedata.bookId) {
                    openNewWindow("../Student/ErrorQuestions.aspx?sectionId=" + get_sectionId() + "&userId=" + get_userId());
                } else {
                    if (ttype == 0) {
                        openNewWindow("../Student/ErrorQuestions.aspx?sectionId=" + get_sectionId() + "&structureId" + "=" + tid);
                    } else {
                        var knowledge = knowledgeGradesArray.firstOrDefault("itemId", tid);
                        openNewWindow("../Student/ErrorQuestions.aspx?sectionId=" + get_sectionId() + "&pointingLoId" + "=" + knowledge.pointingLoId);
                    }
                   
                    
                }
                break;
            case "2"://学得怎么样
                //getNormalKnowledgeStateDetailOfStructure(string structureId, string userId, string sectionId, bool sectionFlag, JEWS.EngineReport.UserExtend userExtend)
                $.jBox('<div id="jbxTCPieChart" style="padding:10px;width:360px;height:295px;">加载中…</div>', { title: "学得怎么样", width: 400, height: 400 });
                if (nodedata.bookId) {
                    $excuteWS("~TLCenterWS.getNormalKnowledgeStateDetailOfISBN", { isbn: get_isbn(), userId: get_userId(), sectionId: get_sectionId(), sectionFlag: false, userExtend: get_simpleUser() }, function (r) {
                        getTCPiechart(r);
                    }, null, null);
                } else {
                    $excuteWS("~TLCenterWS.getNormalKnowledgeStateDetailOfStructure", { structureId: tid, userId: get_userId(), sectionId: get_sectionId(), sectionFlag: false, userExtend: get_simpleUser() }, function (r) {
                        getTCPiechart(r);
                    }, null, null);
                }
                
                break;
            case "3"://学习历史
                
                $.jBox('<div id="jbxTCLineChart" style="padding:10px;width:660px;height:295px;">加载中…</div>', { title: "学得怎么样", width: 700, height: 400 });
                var knowledge = knowledgeGradesArray.firstOrDefault("itemId", tid);
                $excuteWS("~TLCenterWS.testHistoryHtByPointingLo", { userId: get_userId(), pointingLoId: knowledge.pointingLoId, userExtend: get_simpleUser() }, function (r) {
                    getTCLinechart(r);
                }, null, null);
                break;
            default: break;
        }
    });
}

function getTCPiechart(r) {
    var tempData = new Array();
    if (r != null && r.length > 0) {
        for (var i = 0; i < r.length; i++) {
            tempData.push([getKnowledgeStatusInfo(r[i].key), parseInt(r[i].value)]);
        }

    }
    else {
        tempData.push([getKnowledgeStatusInfo("5"), 0]);
        tempData.push([getKnowledgeStatusInfo("4"), 0]);
        tempData.push([getKnowledgeStatusInfo("3"), 0]);
        tempData.push([getKnowledgeStatusInfo("2"), 0]);
        tempData.push([getKnowledgeStatusInfo("1"), 0]);
        tempData.push([getKnowledgeStatusInfo("0"), -1]);
    }
    
    var chart = new Highcharts.Chart({
        colors: [TCtr_json.colors.Excellent_Color, TCtr_json.colors.Good_Color,
        TCtr_json.colors.Fair_Color, TCtr_json.colors.Weak_Color,
        TCtr_json.colors.Inadequate_Color, TCtr_json.colors.NotAssessed_Color],
        //chart: {
        //    renderTo: 'jbxTCPieChart',
        //    plotBackgroundColor: null,
        //    plotBorderWidth: null,
        //    plotShadow: null,
        //    marginTop: 20,
        //    marginBottom: 0
        //},
        //title: {
        //    text: 'Your Knowledge Mastery Status',
        //    align: 'left',
        //    style: {
        //        color: '#336633',
        //        fontSize: '13px',
        //        fontWeight: 'bold',
        //        fontFamily: 'Arial, Helvetica, sans-serif'
        //    }
        //},
        chart: {
            renderTo: 'jbxTCPieChart',
            plotBackgroundColor: "#E9F3FA",
            plotBorderWidth: null,
            plotShadow: null,
            margin: 0
        },
        title: {
            text: ''
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.point.name + '</b>：' + Math_Round(this.percentage, 1) + ' %' + (this.point.y != -1 ? '<br/><b>人数</b>：' + this.point.y + '个' : "");
            }
        },
        //legend: {
        //    layout: 'vertical',
        //    align: 'right',
        //    verticalAlign: 'top',
        //    x: -10,
        //    y: 30,
        //    borderWidth: 0
        //},
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: 0,
            y: 5,
            borderWidth: 0
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                //events: {
                //    click: function (e) {
                //        //alert(e.point.name)
                //        //openNewWindow("../Report/KnowledgeGuide.aspx?userId=" + get_userId() + "&sectionId=" + get_sectionId() + "&tUserId=" + get_userId() + "&tRoleId=" + get_roleId() + "&knowledgestatus=" + e.point.name);
                //        location.href = "../" + roleStr + "/KnowledgeProfile.aspx?userId=" + get_userId() + "&sectionId=" + get_sectionId() + "&kpStatus=" + e.point.name;
                //    }
                //},

                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            type: 'pie',
            name: 'Knowledge Points',
            data: tempData
        }]
    });
}

function getTCLinechart(result) {
    var categoryArray = new Array();
    //var classHistoryData = new Array();
    var stuHistoryData = new Array;
    
    if (result != null && result.length != 0) {
        for (var i = 0; i < result.length; i++) {
            categoryArray.push(i + 1);
            if (result[i].key != null && result[i].value != "--" && result[i].value >= 0) {
                var statusV = getKnowledgeStatus(accMul(Math_Round(result[i].value, 2), 100));
                
                stuHistoryData.push({ y: getYAxisData(statusV), date: result[i].key, statusLabel: getKnowledgeStatusInfo(statusV) });
            } else {
                stuHistoryData.push(-25);
            }
        }
    }
    
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: "jbxTCLineChart",
            defaultSeriesType: 'spline'
        },
        title: {
            text: ''//'Properties of Real Numbers'
        },
        subtitle: {
            text: ''//userName
        },
        xAxis: {
            min: 0,
            categories: categoryArray
            //,
            //labels: {
            //    formatter: function () {
            //        return "第" + Utils.numberToChinese(this.value) + "次";
            //    }
            //}
        },
        yAxis: {
            min: -25,
            max: 100,
            title: {
                text: '状态'
            },
            labels: {
                formatter: function () {
                    return getYAxisLabel(this.value);
                }
            }
        },
        tooltip: {
            crosshairs: true,
            shared: true,
            formatter: function () {
                var toolTip = "";
                var point = this.points[0].point;
                var classStatus = "";
                var stuStatus = "";
                
                if (point != null) {
                    //for (var p = 0; p < points.length; p++) {
                    //    //if (points[p].series.name == "Class Status") {
                    //    //    classStatus = getYAxisLabel(points[p].y);
                    //    //} else if (points[p].series.name == "My Status") {
                    //        stuStatus = getYAxisLabel(points[p].y);
                    //   // }
                    //}
                    toolTip = "时间: " + point.date + "<br/>状态: " + point.statusLabel;
                }
               
                return toolTip;
            }
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 4,
                    lineColor: '#666666',
                    lineWidth: 1
                }
            }
        },
        series: [{
            name: '知识点学习状态',
            marker: {
                symbol: 'diamond'
            },
            data: stuHistoryData
        }]
        ,
    });
    //chart.addSeries({
    //    name: 'Class Status',
    //    marker: {
    //        symbol: 'square'
    //    },
    //    data: classHistoryData
    //});
    //if (get_roleId() == "1") {
        //chart.addSeries({
        //    name: '',
        //    marker: {
        //        symbol: 'diamond'
        //    },
        //    data: stuHistoryData
        //});
    //}

}
function getYAxisData(status) {
    if (status == "0") {
        return -25;
    } else if (status == "1") {
        return 0;
    } else if (status == "2") {
        return 25;
    } else if (status == "3") {
        return 50;
    } else if (status == "4") {
        return 75;
    } else if (status == "5") {
        return 100;
    }
}

function getYAxisLabel(value) {
    var v = '';
    switch (value + '') {
        case '-25':
            v = getKnowledgeStatusInfo(0);
            break;
        case '0':
            v = getKnowledgeStatusInfo(1);
            break;
        case '25':
            v = getKnowledgeStatusInfo(2);
            break;
        case '50':
            v = getKnowledgeStatusInfo(3);
            break;
        case '75':
            v = getKnowledgeStatusInfo(4);
            break;
        case '100':
            v = getKnowledgeStatusInfo(5);
            break;
        default:
            break;
    }
    return v;
}

function aie_getMarkingModelYJ(v, asmtId) {
    var str = "--";
    if (v == "1")
        str = '自动阅卷';
    if (v == "2")
        str = '<div class="reports"><div class="xxreports" onclick="location.href=\'../TestShow/CorrectingPapers.aspx?sectionId=' + get_sectionId() + '&assignmentId=' + asmtId + '\'"><img src="../Images/startmark.png" />自己阅卷</div></div>';
    if (v == "3")
        str = '教师阅卷';
    if (v == "4")
        str = '相互阅卷';

    return str;
}


