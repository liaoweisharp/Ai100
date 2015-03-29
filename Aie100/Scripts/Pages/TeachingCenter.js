/// <reference path="../comm.js" />
/// <reference path="../Array.js" />
/// <reference path="../SimpleUser.js" />
/// <reference path="../jquery.ajax.js" />
/// <reference path="../jquery-1.10.2.min.js" />
/// <reference path="../../Plugins/showLoading/js/jquery.showLoading.min.js" />
/// <reference path="../Math.js" />
/// <reference path="../../Plugins/jBox/jquery.jBox-2.3.min.js" />

//TCtr_json = { $divTreeView:null,$divAssignmentList: null, $divAsmtArea:null,$divAssignmentDetails:null,treeData:null,selected_structureId:null};
TCtr_json = {
    $spCourseName: null, $divKnowledgeStatus: null, $divStructureName: null, $divStructureStatus: null, $divCorreceBase: null, $spOCorrectBaseContent: null, $spPCorrectBaseContent: null, $spPCorrectBase: null, $divTreeView: null, $divAssignmentList: null, $divAssignmentListInfo: null, $divLearningInfo: null, $divAsmtArea: null, $divAssignmentDetails: null, assignmentArray: null, treeData: null, $LC_divTabs: null, selected_structureId: null, $temp_tab: null, json_markingModel: { "1": "自动", "2": "自己参与", "3": "教师参与", "4": "相互参与", undefined: "--" },
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
        TCtr_json.$divTreeView = $("#divTreeView");
        TCtr_json.$divAssignmentList = $("#divAssignmentList");
        TCtr_json.$divAssignmentListInfo = $("#divAssignmentListInfo");
        TCtr_json.$divAsmtArea = $("#divAsmtArea");
        TCtr_json.$divAssignmentDetails = $("#divAssignmentDetails");
        TCtr_json.$LC_divTabs = $("#LC_divTabs");
        TCtr_json.$spCourseName = $("#spCourseName");
        TCtr_json.$divStructureName = $("#divStructureName");
        TCtr_json.$divStructureStatus = $("#divStructureStatus");
        TCtr_json.$spOCorrectBaseContent = $("#spOCorrectBaseContent");
        //TCtr_json.$spPCorrectBaseContent = $("#spPCorrectBaseContent");
        //TCtr_json.$spPCorrectBase = $("#spPCorrectBase");
        TCtr_json.$divCorreceBase = $("#divCorreceBase");
        TCtr_json.$divKnowledgeStatus = $("#divKnowledgeStatus");
        TCtr_json.$divLearningInfo = $("#divLearningInfo");
        $excuteWS("~CourseWS.Course_getBaseById", { id: get_courseId(), userId: get_userId(), user: get_simpleUser() }, function (r) {
            if (r) {

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

        aie_getAssignmentInfo(null);

        $("#btnCreateAsignment").click(function () {
            location.href = "../Instructor/Assignment.aspx?sectionId=" + get_sectionId() + "&structureId=" + TCtr_json.selected_structureId;
        });
    });
});



function aie_getAssignmentInfo(structureId) {
    
    TCtr_json.$divAssignmentDetails.find("div[status],div.noasmtinfo").remove();
    
    $excuteWS("~AssignmentWS.assignmentRInstructor", { structureId: structureId, courseId: get_courseId(), sectionId: get_sectionId(), userId: get_userId(), userExtend: get_simpleUser() }, function (re) {

        if (re) {
            TCtr_json.assignmentArray = [];
            var arr = new Array();
            var allAsmtIds = new Array();
            
            if (re.current != null && re.current.length != 0) {
                arr.push('<div class="tab_item" status="current">当前(' + re.current.length + ')</div>');
                $('<div status="current"><div class="asmts"></div><div class="pagination"></div></div>').appendTo(TCtr_json.$divAssignmentDetails);
                allAsmtIds.addRange(re.current);
            }

            if (re.myMarking != null && re.myMarking.length != 0) {
                arr.push('<div class="tab_item" status="myMarking">我要阅卷(' + re.myMarking.length + ')</div>');
                $('<div status="myMarking"><div class="asmts"></div><div class="pagination"></div></div>').appendTo(TCtr_json.$divAssignmentDetails);
            }

            if (re.otherMarking != null && re.otherMarking.length != 0) {
                arr.push('<div class="tab_item" status="otherMarking">他人阅卷(' + re.otherMarking.length + ')</div>');
                $('<div status="otherMarking"><div class="asmts"></div><div class="pagination"></div></div>').appendTo(TCtr_json.$divAssignmentDetails);
            }


            if (re.past != null && re.past.length != 0) {
                arr.push('<div class="tab_item" status="past">已结束(' + re.past.length + ')</div>');
                $('<div status="past"><div class="asmts"></div><div class="pagination"></div></div>').appendTo(TCtr_json.$divAssignmentDetails);
                allAsmtIds.addRange(re.past);
            }

            if (re.upcoming != null && re.upcoming.length != 0) {
                arr.push('<div class="tab_item" status="upcoming">未开始(' + re.upcoming.length + ')</div>');
                $('<div status="upcoming"><div class="asmts"></div><div class="pagination"></div></div>').appendTo(TCtr_json.$divAssignmentDetails);
                allAsmtIds.addRange(re.upcoming);
            }

            if (re.started != null && re.started.length != 0) {
                arr.push('<div class="tab_item" status="started">已开始(' + re.started.length + ')</div>');
                $('<div status="started"><div class="asmts"></div><div class="pagination"></div></div>').appendTo(TCtr_json.$divAssignmentDetails);
            }

            re.all = allAsmtIds;
            if (re.all != null && re.all.length != 0) {
                arr.push('<div class="tab_item" status="all">全部(' + re.all.length + ')</div>');
                $('<div status="all"><div class="asmts"></div><div class="pagination"></div></div>').appendTo(TCtr_json.$divAssignmentDetails);
                
            }
            
            if (arr.length == 0) {
                TCtr_json.$LC_divTabs.hide();
                TCtr_json.$divAssignmentList.hideLoading();
                TCtr_json.$divAssignmentDetails.html('<div class="noasmtinfo">还没有相关任务信息。</div>');
                return;
            } else {
                TCtr_json.$LC_divTabs.show();
            }
          
            arr.push('<div class="c_b"></div>');


            TCtr_json.$LC_divTabs.html(arr.join(''));
            TCtr_json.$divAssignmentDetails.find("table[status]").remove();
            TCtr_json.$LC_divTabs.find("div.tab_item").click(function () {
                
                var $this =TCtr_json.$temp_tab = $(this);
                TCtr_json.$LC_divTabs.find("div.tab_item").css("background-color", "");
                $this.css("background-color", "rgb(255,230,100)");
                TCtr_json.$divAssignmentDetails.find("div[status]").hide().filter("div[status='" + $this.attr("status") + "']").show();
                //TCtr_json.$divAssignmentDetails.find("div[status='" + $this.attr("status") + "']").show();
                
                if ($this.attr("flag") == "1") {
                    //var $ctb = TCtr_json.$divAssignmentDetails.find("div[status='" + $this.attr("status") + "']");
                    //if ($ctb.length != 0) {
                    //    $ctb.show();
                    //}
                    return;
                }
                if (TCtr_json.$divAssignmentDetails.find("div.img_loading").length == 0) {
                    TCtr_json.$divAssignmentDetails.append('<div class="img_loading"><center><img style="margin:20px;" alt="" src="../Images/ajax-loader_b.gif" /></center></div>');
                }
                TCtr_json.$divAssignmentList.show();
               
                var $loadimg1 = TCtr_json.$divAssignmentDetails.find("div.img_loading");
                if ($loadimg1.length == 0) {
                    TCtr_json.$divAssignmentList.showLoading();
                }

                var asmtIds = re[$this.attr("status")];
                $this.attr("flag", "1");
                bindAssignmentPagination(asmtIds, $this.attr("status"));
                
            });
            TCtr_json.$LC_divTabs.find("div.tab_item:first").trigger("click");
        }
    }, null, null);
}

////根据索引，从数据中返回部分数据
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

function updateTreeData(treeData) {
    if (!(treeData && TCtr_json.treeData[1] && treeData.key)) {
        return;
    }
    var item = TCtr_json.treeData[1].firstOrDefault("itemId", treeData.key);
    var status = getKnowledgeStatus(item.classKnowledgeScore);
    treeData.title = "<span class='status_" + status + "'>&nbsp;</span>" + treeData.title + "";
    if (treeData.children != null) {
        for (var i = 0; i < treeData.children.length; i++) {
            updateTreeData(treeData.children[i]);
        }
        
    }
}

var tpageSize = 10;
function bindAssignmentPagination(asmtIds, vstatus) {
    $("div[status='" + vstatus + "']>div.pagination").html("").pagination(asmtIds.length, {
        num_edge_entries: 2,
        num_display_entries: 5,
        items_per_page: tpageSize,
        prev_text: "上一页",
        next_text: "下一页",
        callback: function (page_index, o) {
            // container.parent().showLoading();

            var $statusTb = TCtr_json.$divAssignmentDetails.find("div[status='" + vstatus + "'] table[status='" + vstatus + "']");
            $statusTb.hide();
            if ($statusTb.filter("[pageindex='" + page_index + "']").length != 0) {
                $statusTb.filter("[pageindex='" + page_index + "']").show();
                return;
            }

            var _startPos = page_index * tpageSize;
            var _endPos = _startPos + (tpageSize - 1);
            var _asmtIds = getIdsArray(asmtIds, _startPos, _endPos);
            
            $excuteWS("~AssignmentWS.assignmentByIds", { assignmentIds: _asmtIds, courseId: get_courseId(), sectionId: get_sectionId(), userId: get_userId(), userExtend: get_simpleUser() }, function (r, context) {
                    var assignmentIds = new Array();
                    var tbArray = new Array();
                    var len = 0;
                
                    if (r && r.length > 0) {
                        TCtr_json.assignmentArray.addRange(r);
                        tbArray.push('<table pageindex="'+page_index+'" status="'+context.status+'" class="tb_asmt" width="100%">');
                        tbArray.push('<tr class="tr0">');
                        tbArray.push('<th style="width:40px;">编号</th>');
                        tbArray.push('<th>任务名称</th>');
                        //tbArray.push('<th style="width:65px">日期</th>');
                        tbArray.push('<th style="width:80px;">任务完成率</th>');
                        tbArray.push('<th style="width:70px;">题完成率</th>');
                        tbArray.push('<th style="width:70px;">原始成绩</th>');
                        tbArray.push('<th style="width:80px;">提高后成绩</th>');
                        tbArray.push('<th style="width:120px;">报告</th>');
                        tbArray.push('<th style="width:65px;">操作</th>');
                        tbArray.push('</tr>');
                        var bianhao = page_index * tpageSize;
                        for (var i = 0; i < r.length; i++) {
                            bianhao++;
                            var assignmentId = r[i].id;
                            assignmentIds.push(assignmentId);
                            //var title_time = '开始日期：' + jDateFormat(r[i].startDate) + '\n' + '结束日期：' + jDateFormat(r[i].endDate);
                            tbArray.push('<tr assignmentid="' + assignmentId + '" class="tr">');
                            tbArray.push('<td>' + bianhao + '</td>');
                            tbArray.push('<td style="text-align:left;padding:0px 5px;"><a href="#" title="查看任务设置" assignmenttitle="1" assignmentid="' + assignmentId + '">' + r[i].title + '</a></td>');

                            //if (r[i].timeState == "1") {
                            //    tbArray.push('<td>未开始</td>');
                            //} else if (r[i].timeState == "2") {
                            //    tbArray.push('<td>进行中</td>');
                            //} else if (r[i].timeState == "3") {
                            //    tbArray.push('<td>已结束</td>');
                            //}
                            //tbArray.push('<td>' + jDateFormat(r[i].startDate) + '</td>');
                            //tbArray.push('<td>' + jDateFormat(r[i].endDate) + '</td>');
                            tbArray.push('<td wcl="1"><img src="../Images/ajax-loader_m.gif" alt="..."/></td>');
                            tbArray.push('<td twcl="1"><img src="../Images/ajax-loader_m.gif" alt="..."/></td>');
                            tbArray.push('<td pjf="1"><img src="../Images/ajax-loader_m.gif" alt="..."/></td>');
                            tbArray.push('<td tg_pjf="1"><img src="../Images/ajax-loader_m.gif" alt="..."/></td>');
                            tbArray.push('<td>');

                            //tbArray.push('<img class="hid" style="cursor:pointer;margin-right:5px;" item="r1" src="../Images/table_lightning.png" title="详细报告" alt="..." onclick="clickRep_Detail(\'' + assignmentId + '\')"/>');
                            //tbArray.push('<img class="hid" style="cursor:pointer;" item="r2" onclick="clickRep_Total(\'' + assignmentId + '\')" src="../Images/table_key.png" title="整体报告" alt="..."/>');
                            tbArray.push('<div class="reports">');
                            tbArray.push('<div item="r1" class="hid xxreports" onclick="clickRep_Detail(\'' + assignmentId + '\')">');
                            tbArray.push('<img src="../Images/table_lightning.png" title="详细报告" alt="..."/>详细');
                            tbArray.push('</div>');
                            tbArray.push('<div item="r2" class="hid xxreports" onclick="clickRep_Total(\'' + assignmentId + '\')">');
                            tbArray.push('<img src="../Images/table_key.png" title="整体报告" alt="..."/>整体');
                            tbArray.push('</div>');
                            tbArray.push('<div style="clear:both;"></div>');
                            tbArray.push('</div>');
                            tbArray.push('</td>');
                            tbArray.push('<td class="action">');
 
                      
                            tbArray.push('<div style="position:relative">');
                            tbArray.push('<div class="action" czflag="1" style="display:block;">');
                            tbArray.push('<div class="action_item"><img  src="../Images/wrench.png" alt="操作" style="margin-right:3px;" title="操作"/>操作</div>');
                            tbArray.push('</div>');
                            tbArray.push('<div class="action_menu">');
                            if (r[i].userId == get_userId()) {
                                tbArray.push('<div class="action_menu_item" action="edit_assignment" assignmentid="' + assignmentId + '"><img src="../Images/table_edit.png" alt="编辑" title="编辑"/>编辑</div>');
                                tbArray.push('<div class="action_menu_item" action="remove_assignment" assignmentid="' + assignmentId + '"><img src="../Images/application_form_delete.png" alt="删除" title="删除"/>删除</div>');
                            }
                            tbArray.push('<div class="action_menu_item" action="view_test" onclick="openNewWindow(\'../TestShow/TestContent.aspx?sectionId=' + get_sectionId() + '&assignmentId=' + assignmentId + '&previewflag=1\')"><img alt="预览" title="预览" src="../Images/application_view_detail.png"/>预览</div>');
                            tbArray.push('</div>');
                            tbArray.push('</div>');
                            tbArray.push('</td>');
                            tbArray.push('</tr>');
                        }
                        tbArray.push('</table>');
                    } else {
                        tbArray.push('<div class="noasmtinfo">还没有相关任务信息。</div>。');
                    }
                    var $loadimg2 = TCtr_json.$divAssignmentDetails.find("div.img_loading");
                    if ($loadimg2.length != 0) {
                        $loadimg2.remove();
                    }
                    
                    TCtr_json.$divAssignmentDetails.find("div[status='" + context.status + "']>div.asmts").append(tbArray.join(''));
                    //if (TCtr_json.$divAssignmentDetails.find("table[status]:visible").length > 1) {
                    //    TCtr_json.$divAssignmentDetails.find("table[status]").hide().filter("[status='" + TCtr_json.$temp_tab.attr("status") + "']").show();
                    //}
                    TCtr_json.$divAssignmentDetails.find("div[status='" + context.status + "'] table[pageindex='" + page_index + "'][status='" + context.status + "'] a[assignmenttitle]").click(function () {
                        var $ts = $(this);
                        $.jBox('<div style="padding:5px 15px;" id="jbx_assignmentsettings"><div class="img_loading"><center><img style="margin:20px;" alt="" src="../Images/ajax-loader_b.gif" /></center></div></div>', { title: "任务设置" });
                        var asmt = TCtr_json.assignmentArray.firstOrDefault("id", $ts.attr("assignmentid"));
                        $excuteWS("~AssignmentWS.assignmentSettingByIds", { ids: [asmt.assignmentSettingId], userExtend: get_simpleUser() }, function (re1) {

                            if (re1 && re1.length > 0) {
                                var arr = new Array();
                                
                                arr.push('<div style="line-height:22px;">');
                                //arr.push('<div>任务名称：' + asmt.title + '</div>');
                                
                                arr.push('<div>阅卷模式：' +TCtr_json.json_markingModel[asmt.markingModel] + '</div>');
                                arr.push('<div>考试时间：' + asmt.testTime + ' 分钟</div>');
                                arr.push('<div>最短交试卷时间：' + (asmt.shorTestTime ? asmt.shorTestTime : "--") + '</div>');
                                arr.push('<div>开始日期：' + jDateFormat(asmt.startDate) + '</div>');
                                arr.push('<div>结束日期：' + jDateFormat(asmt.endDate) + '</div>');
                                arr.push('<div>是否打乱题的顺序：' + (asmt.upsetQuestion == 1 ? "是" : "否") + '</div>');
                                arr.push('<div>是否在指定时间内完成：' + (asmt.dateControl == 1 ? "是" : "否") + '</div>');
                                arr.push('<div>是否显示做错的考题：' + (re1[0].showErrorQuestion == 1 ? "是" : "否") + '</div>');
                                arr.push('<div>是否用做错的题来提高成绩：' + (re1[0].allowErrorQuestionImprove == 1 ? "是" : "否") + '</div>');

                                if (get_studyFlag() == "1") {
                                    arr.push('<div>是否允许用训练来提高成绩：' + (re1[0].allowDrillImprove == 1 ? "是" : "否") + '</div>');
                                    arr.push('<div>是否显示答案：' + (re1[0].showAnswer == 1 ? "是" : "否") + '</div>');
                                    arr.push('<div>是否在考试前显示训练：' + (re1[0].showDrill == 1 ? "是" : "否") + '</div>');
                                    arr.push('<div>是否显示提示：' + (re1[0].showHint == 1 ? "是" : "否") + '</div>');
                                    arr.push('<div>是否显示知识点：' + (re1[0].showKp == 1 ? "是" : "否") + '</div>');
                                    arr.push('<div>是否显示解题过程：' + (re1[0].showSolution == 1 ? "是" : "否") + '</div>');
                                }
                                arr.push('</div>');
                                $("#jbx_assignmentsettings").html(arr.join(''));
                            } else {
                                $("#jbx_assignmentsettings").html("没有可用的设置信息。");
                            }
                        }, null, null);
                    })
                    var $action = TCtr_json.$divAssignmentDetails.find("div[status='" + context.status + "'] table[pageindex='" + page_index + "'][status='" + context.status + "'] td.action div.action[czflag='1']");
                    var $actionmenu = $action.next();
                    $action.click(function () {
                        $(this).next().show();
                    });
                    $actionmenu.hover(function () {
                        $(this).show();
                    }, function () {
                        $(this).hide();
                    });
                    $actionmenu.find("div[action='remove_assignment']").click(function () {
                        var $this = $(this);
                        
                        var asmtId = $this.attr("assignmentid");
                        var $tr = $("tr.tr[assignmentid='" + asmtId + "']") //$this.parent().parent();
                        $.jBox.confirm("确定删除该任务吗？", "提示", function (v, h, f) {
                            if (v == true) {
                                $excuteWS("~TLCenterWS.removeAssignment", { assignmentId: asmtId, user: get_simpleUser() }, function (r) {
                                    if (r) {
                                        $tr.remove();
                                        $.jBox.tip("任务删除成功", "success");
                                    } else {
                                        $.jBox.tip("任务删除失败", "error");
                                    }
                                }, null, null);
                            }
                        }, { buttons: { '确定': true, '取消': false } });
                    });
                    $actionmenu.find("div[action='edit_assignment']").click(function () {
                        location.href = '../Instructor/Assignment.aspx?sectionId=' + get_sectionId() + '&assignmentId=' + $(this).attr("assignmentId");
                    });

                    //if (r && r.length > 0 && len == r.length) {
                    //    TCtr_json.$divAssignmentDetails.find("div[status='" + context.status + "'] table[pageindex='" + page_index + "'][status='" + context.status + "'] td.action div.action_menu :not(div[action='view_test'])").remove();
                    //}
                    TCtr_json.$divAssignmentList.hideLoading();
                    if (assignmentIds.length > 0) {
                        $excuteWS("~TLCenterWS.AssignmentReport_listBySectionAsmtIds", { assignmentIds: assignmentIds, sectionId: get_sectionId(), user: get_simpleUser() }, function (re) {
                            if (re) {
                                
                                for (var k = 0; k < re.length; k++) {
                                    var $tr = TCtr_json.$divAssignmentDetails.find("table[status='" + context.status + "'] tr[assignmentid='" + re[k].assignmentId + "']");
                                    $tr.find("td[wcl='1']").html(re[k].userNum != 0 ? (accMul(Math_Round((re[k].submitNum / re[k].userNum) + "", 2), 100) + "%") : "--");
                                    $tr.find("td[twcl='1']").html(re[k].answeredBase != "-1" ? (accMul(Math_Round(re[k].answeredBase, 2), 100)) + "%" : "--");
                                    $tr.find("td[pjf='1']").html(re[k].adjustScore && re[k].adjustScore >= 0 ? accMul(Math_Round(re[k].adjustScore / re[k].totalScore, 2), 100) + "%" : "--");
                                    $tr.find("td[tg_pjf='1']").html(re[k].improvedScore && re[k].improvedScore >= 0 ? accMul(Math_Round(re[k].improvedScore / re[k].totalScore, 2), 100) + "%" : "--");
                                    // alert(re[k].submitNum + "," + re[k].scoreNum)
                                    if (re[k] && re[k].submitNum > 0) {

                                        $tr.find("div[item='r1']").show();
                                    }
                                    if (re[k] && re[k].scoreNum > 0) {

                                        $tr.find("div[item='r2']").show();
                                    }
                                }
                            }
                        }, null, null);
                    }
                }, null, { status: vstatus });
        }
    });
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

                    var arr = result.except(knowledgeGradesArray)
                    if (arr && arr.length > 0) {
                        knowledgeGradesArray.addRange(arr);
                    }

                    var kpNodes = new Array();
                    var kpNode = null;
                    
                    $.each(result, function () {
                        kpNode = {};
                        kpNode.title = "<span class='status_" + getKnowledgeStatus(this.classKnowledgeScore) + "'>&nbsp;</span>" + this.unit + ". " + this.itemName + "";
                        kpNode.key = this.itemId;
                        kpNode.type = this.itemType;
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
            //if (TCtr_json.selected_structureId == node.data.key) {
            //    return;
            //}
            //TCtr_json.selected_structureId = node.data.key;
            //if (event.target.className != "dynatree-expander") {
            //    if (node.parent.data.structureLevel == "10") {
            //        TCtr_json.$divAssignmentList.hide();
            //        return;
            //    }
            //    TCtr_json.$divAssignmentList.show();
            //    TCtr_json.$divStructureStatus.show();
            //    var $title = $("<span>" + node.data.title + "</span>");
            //    $title.find("span[class*=status_]").remove();
            //    TCtr_json.$divStructureName.html($title.html());
            //    var knowledgeGrade = null;
            //    var knowledgeGradesArray = TCtr_json.treeData[1];
            //    if (knowledgeGradesArray) {
            //        for (var i = 0; i < knowledgeGradesArray.length; i++) {
            //            if (knowledgeGradesArray[i].itemId == node.data.key) {
            //                knowledgeGrade = knowledgeGradesArray[i];
            //                break;
            //            }
            //        }
            //    }
               
            //    TCtr_json.$divKnowledgeStatus.html(getKnowledgeStatusBar(get_roleId(), knowledgeGrade));
            //    aie_getAssignmentInfo(node.data.key);
            //}
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
                
               // if (knowledgeGrade.cCountOlo > 0) {
                TCtr_json.$divCorreceBase.show();
                    
                var oc = (knowledgeGrade.cCountOlo==0)? "--":  Math_Round(knowledgeGrade.cCorrectOlo,1) + "/" + knowledgeGrade.cCountOlo + "=" + accMul(Math_Round(accDiv(knowledgeGrade.cCorrectOlo, knowledgeGrade.cCountOlo), 2), 100) + "%";
                //var pc = (knowledgeGrade.cCountPlo == 0) ? null : knowledgeGrade.cCorrectPlo + "/" + knowledgeGrade.cCountPlo + "=" + accMul(Math_Round(accDiv(knowledgeGrade.cCorrectPlo, knowledgeGrade.cCountPlo), 2), 100) + "%";
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
            return;
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
    
    var tid = nodedata.key;
    var tbArray = new Array();
    tbArray.push('<table cellspacing="8" cellpadding="15">');
    tbArray.push('<tr>');
    if (get_studyFlag() == "1") {
        tbArray.push('<td class="td1">');
        tbArray.push('<div class="litem">');
        tbArray.push('<div class="ltitle">学习与训练</div>');

        tbArray.push('<div><img ltype="0" alt="" src="../Images/learndrill.png" /></div>');

        tbArray.push('</div>');
        tbArray.push('</td>');
    }
    tbArray.push('<td class="td2">');
    tbArray.push('<div class="litem">');
    tbArray.push('<div class="ltitle">错题回顾</div>');
    tbArray.push('<div><img ltype="1" alt="" src="../Images/erqreview.png" /></div>');
    tbArray.push('</div>');
    tbArray.push('</td>');
    if (ttype == 0) {
        tbArray.push('<td class="td3">');
        tbArray.push('<div class="litem">');
        tbArray.push('<div class="ltitle">学得怎么样</div>');
        tbArray.push('<div><img ltype="2" alt="" src="../Images/piechart1.png" /></div>');
        tbArray.push('</div>');
        tbArray.push('</td>');
    }
    tbArray.push('<td class="td4">');
    tbArray.push('<div class="litem">');
    tbArray.push('<div class="ltitle">学生分布</div>');
    tbArray.push('<div><img ltype="3" alt="" src="../Images/piechart2.png" /></div>');
    tbArray.push('</div>');
    tbArray.push('</td>');
    tbArray.push('</tr>');
    tbArray.push('</table>');
    TCtr_json.$divLearningInfo.html(tbArray.join(''));
    TCtr_json.$divLearningInfo.find("div.litem img[ltype]").unbind("click").click(function () {

        var $this = $(this);
        switch ($this.attr("ltype")) {
            case "0":
                if (nodedata.bookId) {
                    openNewWindow("../TestShow/LearnAndDrill.aspx?sectionId=" + get_sectionId() + "&isbn=" + get_isbn());
                } else {
                    openNewWindow("../TestShow/LearnAndDrill.aspx?sectionId=" + get_sectionId() + "&" + (ttype == 0 ? "structureId" : "loId") + "=" + tid);
                }

                break;
            case "1":
                if (nodedata.bookId) {
                    openNewWindow("../Instructor/ErrorQuestions.aspx?sectionId=" + get_sectionId());
                } else {
                    if (ttype == 0) {
                        openNewWindow("../Instructor/ErrorQuestions.aspx?sectionId=" + get_sectionId() + "&structureId" + "=" + tid);
                    } else {
                        var knowledge = knowledgeGradesArray.firstOrDefault("itemId", tid);
                        openNewWindow("../Instructor/ErrorQuestions.aspx?sectionId=" + get_sectionId() + "&pointingLoId" + "=" + knowledge.pointingLoId);
                    }
                }
                break;
            case "2"://学得怎么样
                //getNormalKnowledgeStateDetailOfStructure(string structureId, string userId, string sectionId, bool sectionFlag, JEWS.EngineReport.UserExtend userExtend)
                $.jBox('<div id="jbxTCPieChart" style="padding:10px;width:360px;height:295px;">加载中…</div>', { title: "学得怎么样", width: 400, height: 400 });
                if (nodedata.bookId) {
                    $excuteWS("~TLCenterWS.getNormalKnowledgeStateDetailOfISBN", { isbn: get_isbn(), userId: get_userId(), sectionId: get_sectionId(), sectionFlag: true, userExtend: get_simpleUser() }, function (r) {
                        getTCPiechart(r, 0);
                    }, null, null);
                } else {
                    if (ttype == 0) {
                        $excuteWS("~TLCenterWS.getNormalKnowledgeStateDetailOfStructure", { structureId: tid, userId: get_userId(), sectionId: get_sectionId(), sectionFlag: true, userExtend: get_simpleUser() }, function (r) {
                            getTCPiechart(r, 0);
                        }, null, null);
                    } else {
                        var knowledge = knowledgeGradesArray.firstOrDefault("itemId", tid);
                        $excuteWS("~TLCenterWS.getKnowledgeStateDetailOfLoIds", { pointingIds: [knowledge.pointingLoId], userId: get_userId(), sectionId: get_sectionId(), sectionFlag: true, userExtend: get_simpleUser() }, function (r) {
                            getTCPiechart(r, 0);
                        }, null, null);
                    }
                    
                }
                
                break;
            case "3"://学生分布
                $.jBox('<div id="jbxTCPieChart" style="padding:10px;width:360px;height:295px;">加载中…</div>', { title: "学生分布", width: 400, height: 400 });
                
                if (nodedata.bookId) {
                    $excuteWS("~TLCenterWS.getKnowledgeStateUserslOfISBN", { isbn: get_isbn(), sectionId: get_sectionId(), userExtend: get_simpleUser() }, function (r) {
                        getTCPiechart(r, 1);
                    }, null, null);
                } else {
                    if (ttype == 0) {//章节
                        $excuteWS("~TLCenterWS.getKnowledgeStateUsersOfStructure", { structureId: tid, sectionId: get_sectionId(), userExtend: get_simpleUser() }, function (r) {
                            getTCPiechart(r, 1);
                        }, null, null);
                    } else {//知识点 
                        var knowledge = knowledgeGradesArray.firstOrDefault("itemId", tid);
                        
                        $excuteWS("~TLCenterWS.getKnowledgeStateUsersOfLoIds", { pointingIds: [knowledge.pointingLoId], sectionId: get_sectionId(), userExtend: get_simpleUser() }, function (r) {
                            getTCPiechart(r, 1);
                        }, null, null);
                    }
                }
                
                break;
            default: break;
        }
    });
}

function getTCPiechart(r,type) {
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
                return '<b>' + this.point.name + '</b>: ' + Math_Round(this.percentage, 1) + ' %' + (this.point.y != -1 ? '<br/>'+(type==0 ? "<b>知识点数量</b>" :"<b>人数</b>")+'：' + this.point.y +'个' : "");
            }
        },
      
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


function clickRep_Detail(assignmentId) {
    openNewWindow("Reports.aspx?assignmentId=" + assignmentId + "&sectionId=" + get_sectionId());
}
function clickRep_Total(assignmentId) {
    openNewWindow("AssignIntegratedReport.aspx?assignmentId=" + assignmentId + "&sectionId=" + get_sectionId());

}