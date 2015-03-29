/// <reference path="../jquery.ajax.js" />
/// <reference path="../jquery-1.10.2.min.js" />
/// <reference path="../comm.js" />
/// <reference path="../SimpleUser.js" />
/// <reference path="TestManage.js" />
/// <reference path="../Array.js" />
/// <reference path="../../Plugins/showLoading/js/jquery.showLoading.min.js" />

var CA_jason = { urlParams: null, simpleUser: null };
var InputTestNameTip = "请输入试卷名称";
var TestPartArray = []; //换存分页数据
var AssignModel = { "Create": "0", "Edit": "1" };
var AssignOperation;    //当前状态
var _Assignment, _Test, _AssignSettings;
var bookStructureNodes = null;


$(function () {
    U(function () {
        CA_jason.urlParams = getUrlParms();
        CA_jason.simpleUser = this.simpleUser;
        if (get_studyFlag()=="1") {
            $("#divStudySettings").show();
        }
        $(".custab_bg ul").bind("click", onSelectTab).first().trigger("click");
        $("#txtStartDate").calendar({ format: 'yyyy-MM-dd HH:mm:ss', minDate: '%y-%M-%d' });
        $("#txtEndDate").calendar({ format: 'yyyy-MM-dd HH:mm:ss', minDate: '%y-%M-%d' });             
        $("#btnSaveAssignSetting").bind("click", onSaveAssignment);
        $("#btnReselectTest").bind("click", onReselectTest);
        $("#btnCancelSelect").bind("click", onCancelSelect);
        $("#btnSelBookStructure").bind("click", onSelBookStructure);
        var urlParams = getUrlParms();
        var structureId = urlParams.structureId ? urlParams.structureId : "";
        var assignmentId = urlParams.assignmentId ? urlParams.assignmentId : "";
        
        if (assignmentId) {
            document.title = "编辑任务";
            $("#spFeatureName").html(document.title);
            $("#dvSelectList").hide();
            $("#dvSelectedItem").show();
            AssignOperation = AssignModel.Edit;
            //载入编辑数据
            loadAssignmentData(assignmentId, this.simpleUser);
        } else {   
            document.title = "创建任务";
            $("#spFeatureName").html(document.title);
            $("#dvSelectList").show();
            $("#dvSelectedItem").hide();
            AssignOperation = AssignModel.Create;

            $("#txtStartDate").val(new Date().formatEx());
            setAssignmentEndDate();
        }

        $("#btnCreatePaper").bind("click", onCreatePaper);
        $("#dvBuildTestTab ul").bind("click", onSelectTab_b);
        initBuildTestBox();

    });
});

var _old_tab = "";
function onSelectTab() {
    if (this.className == "custab_ul_s") return;

    var $currTab = $(this);
    var $siblingTabs = $currTab.siblings();

    switch ($currTab.attr("id")) {
        case "ulSelectTest":
            $("#dvSelectTest").show();
            $("#dvAssignSetting").hide();
            if (!TestPartArray || TestPartArray.length == 0) {
                loadTestList();
            } 
            break;
        case "ulAssignSetting":
            if (AssignOperation == AssignModel.Create || $("#dvSelectTest").data("_reselect")) {
                if (!validSelectedTest()) {
                    return;
                } else {
                    setAssignBySelected();
                }
            }

            $("#dvSelectTest").hide();
            $("#dvAssignSetting").show();
            break;
    }

    _old_tab = $currTab.attr("id");

    $siblingTabs.removeClass().addClass("custab_ul");
    $siblingTabs.find("li").each(function () {
        this.className = this.className.replace("_s", "");
    });

    $currTab.removeClass().addClass("custab_ul_s");
    $currTab.find("li").each(function () {
        this.className = this.className + "_s";
    });

}

//显示考试信息
function loadTestList() {
    initTestManageBox();
}

function onSaveAssignment() {
    //验证
    var b = true;
    if (AssignOperation == AssignModel.Create || $("#dvSelectTest").data("_reselect")) {
        b = validSelectedTest();
    }
    if (b) {
        b = validAssignment();
    }
    if (!b) {
        return;
    }

    //保存
    var assignment = getAssignment();
    var assignmentSetting = getAssignmentSetting();
    if (assignment.createDate) {
        assignment.createDate = jDateFormat(assignment.createDate);
    }
    $excuteWS("~AssignmentWS.manageAssignment", { assignment: assignment, assignmentSetting: assignmentSetting, userExtend: get_simpleUser() }, function (result) {
        if (result) {
            //$.jBox.success("保存成功", "提示");
            location.href = "TeachingCenter.aspx?sectionId=" + getUrlParms().sectionId;
        } else {
            $.jBox.error("保存失败", "提示");
        }
    }, null, null);
}

//获得选择的考试
function getSelectedTest() {
    var test = null;
    var $rd = $("#tbTestList").find(":radio:checked");
    if ($rd.get(0)) {
        var i = TestPartArray.indexOf("id", $rd.attr("id"));
        if (i != -1) {
            test = TestPartArray[i];
        }
    }
    return test;
}

//获得基本信息
function getAssignment() {
    var assignment;
    if (AssignOperation == AssignModel.Create) {
        var simpleUser = get_simpleUser();
        var urlParams = getUrlParms();

        assignment = {};
        assignment.courseId = simpleUser.courseId;
        assignment.userId = simpleUser.userId;
        assignment.dateControl = 1;
    } else {
        assignment = _Assignment;
    }
    
    if (AssignOperation == AssignModel.Create || $("#dvSelectTest").data("_reselect")) {
        var test = getSelectedTest();
        assignment.testId = test.id;
    }

    with ($("#dvAssignSetting")) {
        assignment.structureId = find("#txtStructureName").data("structureId");
        assignment.title = find("#txtAssignTitle").val();
        assignment.assignmentType = find("#ddlAssignType").val();
        assignment.markingModel = find("#ddlExamineMode").val();
        assignment.testTime = find("#txtTimeLength").val();
        assignment.shorTestTime = find("#txtShorTestTime").val();
        assignment.startDate = find("#txtStartDate").val();
        assignment.endDate = find("#txtEndDate").val();
        assignment.upsetQuestion = find("#ckUpsetQuestionField").is(":checked") ? 1 : 0;
        assignment.dateControl = find("#ckIsDateControl").is(":checked") ? 1 : 0;
    }
    return assignment;
}

//获得设置参数
function getAssignmentSetting() {
    var assignmentSetting;
    if (AssignOperation == AssignModel.Create) {
        assignmentSetting = {};
    } else {
        assignmentSetting = _AssignSettings;
    }

    with ($("#dvAssignSetting")) {
        assignmentSetting.showKp = find("#ckShowKp").is(":checked") ? 1 : 0;
        assignmentSetting.showAnswer = find("#ckShowAnwer").is(":checked") ? 1 : 0;
        assignmentSetting.showHint = find("#ckShowHint").is(":checked") ? 1 : 0;
        assignmentSetting.showSolution = find("#ckShowSolution").is(":checked") ? 1 : 0;
        assignmentSetting.showDrill = find("#ckShowDrill").is(":checked") ? 1 : 0;
        assignmentSetting.allowDrillImprove = find("#ckAllowDrillImprove").is(":checked") ? 1 : 0;
        assignmentSetting.showErrorQuestion = find("#ckShowErrorQuestion").is(":checked") ? 1 : 0;
        assignmentSetting.allowErrorQuestionImprove = find("#ckErrorQuestionImprove").is(":checked") ? 1 : 0;
    }
    return assignmentSetting;
}

var _selectedId = "";
//根据选择设置任务信息
function setAssignBySelected() {
    var test = getSelectedTest();
    var $dvBaseInfo = $("#dvAssignSetting");
    var $txtAssignTitle = $dvBaseInfo.find("#txtAssignTitle");
    var $txtTimeLength = $dvBaseInfo.find("#txtTimeLength");
    
    if (_selectedId != test.id) {
        $txtAssignTitle.val(test.title);
        $txtTimeLength.val(test.timeLength);
        loadExamineMode(test.subjectiveFlag);
    }
    _selectedId = test.id;
}

//载入编辑数据
function loadAssignmentData(assignmentId, simpleUser) {
    $excuteWS("~AssignmentWS.assignmentByIds", { assignmentIds: [assignmentId], courseId: simpleUser.courseId, sectionId: simpleUser.sectionId, userId: simpleUser.userId, userExtend: simpleUser }, function (assignments) {
        if (assignments && assignments.length == 1) {
            _Assignment = assignments[0];
        } else {
            return;
        }

        $excuteWS("~CmsWS.getTestListForTestIds", { testIds: [_Assignment.testId], userExtend: simpleUser }, function (tests) {
            if (tests && tests.length == 1) {
                _Test = tests[0];
            } else {
                return;
            }

            $excuteWS("~AssignmentWS.assignmentSettingByIds", { ids: [_Assignment.assignmentSettingId], userExtend: simpleUser }, function (assignmentSettings) {
                showSelectedTest(_Test);
                showAssignment(_Assignment);
                if (assignmentSettings && assignmentSettings.length == 1) {
                    _AssignSettings = assignmentSettings[0];
                    showAssignmentSetting(_AssignSettings);
                } 

            }, null, null);
        }, null, null);

        
    }, null, null);
}

//显示已选的考试
function showSelectedTest(test) {
    var rows = [];
    var stdVisible = (test.stdVisible == "1") ? "是" : "否";
    rows.push("<tr id='" + test.id + "'>");
    rows.push("<td>" + test.title + "</td>");
    rows.push("<td>" + getDifficultyName(test.difficulty) + "</td>");
    rows.push("<td>" + test.timeLength + "</td>");
    rows.push("<td>" + stdVisible + "</td>");
    rows.push("<td>" + getShareName(test.shareFlag) + "</td>");
    rows.push("<td class='operate'>");
    rows.push("<img src='../Images/page.png' title='试卷预览' onclick=\"viewTestPaper('" + test.id + "')\" />&nbsp;");
    rows.push("</td>");
    rows.push("<td>&nbsp;</td>");
    rows.push("</tr>");
    $("#tbSelectedItem").append(rows.join(""));
    loadExamineMode(test.subjectiveFlag);
}

//显示阅卷模式
function loadExamineMode(isSubjective) {
    var enumExamineMode = {};
    if (isSubjective == "1") {
        enumExamineMode = { "2": "自己参与", "3": "教师参与", "4": "相互参与" }  //主观题阅卷模式
    } else {
        enumExamineMode = { "1": "自动" };    //客观题阅卷模式
    }

    var options = [];
    for (var k in enumExamineMode) {
        options.push("<option value='" + k + "'>" + enumExamineMode[k] + "</option>");
    }
    $("#ddlExamineMode").empty().append(options.join(""))
        .change(function () {
            if (this.value == "4") {
                $(this).next().show();

                //检查是否完成阅卷人设置,并提示
                $excuteWS("~AssignmentWS.uuSectionCompleted", { sectionId: CA_jason.urlParams.sectionId, userExtend: CA_jason.simpleUser }, function (result) {
                    if (!result) {
                        $.jBox.prompt("请完成阅卷人设置！", "提示", "warning", {
                            submit: function (v, h, f) {
                                if (v == "ok") {
                                    openNewWindow("ExaminerManage.aspx?sectionId=" + CA_jason.urlParams.sectionId);
                                }
                            }
                        });
                    } 
                }, null, null);
            } else {
                $(this).next().hide();
            }
        });
}

//显示assignment
function showAssignment(assignment) {
    setStructureName(assignment.structureId);
    var $dvBaseInfo = $("#dvAssignSetting");
    with ($dvBaseInfo) {
        find("#txtAssignTitle").val($("<span>" + assignment.title + "</span>").text());
        find("#ddlAssignType").val(assignment.assignmentType);
        find("#ddlExamineMode").val(assignment.markingModel).trigger("change");
        find("#txtTimeLength").val(assignment.testTime);
        find("#txtShorTestTime").val(assignment.shorTestTime);
        find("#txtStartDate").val(jDateFormat(assignment.startDate));
        find("#txtEndDate").val(jDateFormat(assignment.endDate));
        if (assignment.upsetQuestion == 0) {
            find("#ckUpsetQuestionField").removeAttr("checked");
        } else {
            find("#ckUpsetQuestionField").attr("checked", "checked");
        }

        if (assignment.dateControl == 0) {
            find("#ckIsDateControl").removeAttr("checked");
        } else {
            find("#ckIsDateControl").attr("checked", "checked");
        }
    }
}

//显示assignmentSetting
function showAssignmentSetting(as) {
    var $dvSetting = $("#dvAssignSetting");
    with ($dvSetting) {
        if (as.showKp == 0) {
            find("#ckShowKp").removeAttr("checked");
        } else {
            find("#ckShowKp").attr("checked", "checked");
        }

        if (as.showAnswer == 0) {
            find("#ckShowAnwer").removeAttr("checked");
        } else {
            find("#ckShowAnwer").attr("checked", "checked");
        }

        if (as.showHint == 0) {
            find("#ckShowHint").removeAttr("checked");
        } else {
            find("#ckShowHint").attr("checked", "checked");
        }

        if (as.showSolution == 0) {
            find("#ckShowSolution").removeAttr("checked");
        } else {
            find("#ckShowSolution").attr("checked", "checked");
        }

        if (as.showDrill == 0) {
            find("#ckShowDrill").removeAttr("checked");
        } else {
            find("#ckShowDrill").attr("checked", "checked");
        }

        if (as.allowDrillImprove == 0) {
            find("#ckAllowDrillImprove").removeAttr("checked");
        } else {
            find("#ckAllowDrillImprove").attr("checked", "checked");
        }

        if (as.showErrorQuestion == 0) {
            find("#ckShowErrorQuestion").removeAttr("checked");
        } else {
            find("#ckShowErrorQuestion").attr("checked", "checked");
        }

        if (as.allowErrorQuestionImprove == 0) {
            find("#ckErrorQuestionImprove").removeAttr("checked");
        } else {
            find("#ckErrorQuestionImprove").attr("checked", "checked");
        }
    }
}

function onReselectTest() {
    $("#dvSelectList").show();
    $("#dvSelectedItem").hide();
    $("#btnCancelSelect").parent().show();
    $("#dvSelectTest").data("_reselect", true);
}

function onCancelSelect() {
    $("#dvSelectList").hide();
    $("#dvSelectedItem").show();
    $(this).parent().hide();
    $("#dvSelectTest").data("_reselect", false);
}

//设置书结构名称
function setStructureName(structureId) {
    var simpleUser = get_simpleUser();
    $excuteWS("~CmsWS.bookStructureName", { structureId: structureId, isbn: simpleUser.isbn, userExtend: simpleUser }, function (result) {
        if (result) {
            $("#txtStructureName").data("structureId", structureId).val(result);
        }
    }, null, null);
}

//设置任务结束时间
function setAssignmentEndDate() {
    var simpleUser = get_simpleUser();
    $excuteWS("~CourseWS.Course_getBaseById", { id: simpleUser.courseId, userId: simpleUser.userId, user: simpleUser }, function (result) {
        if (result) {
            $("#txtEndDate").val(jDateFormat(result.endDate));
        }
    }, null, null);
}

//验证选择的考试
function validSelectedTest() {
    var $rd = $("#dvSelectList #tbTestList").find(":radio:checked");
    if ($rd.get(0)) {
        return true;
    } else {
        $.jBox.prompt("请选择一套试卷", "提示", "warning");
        return false;
    }
}

//验证任务基本信息
function validAssignment() {
    var b = true;
    var $a = $("#dvAssignSetting");
    var testTime = $a.find("#txtTimeLength").val();
    var shorTestTime = $a.find("#txtShorTestTime").val();

    if ($a.find("#txtAssignTitle").val() == "") {
        b = false;
        $.jBox.prompt("任务名称不能为空！", "提示", "warning");
    } else if (!$a.find("#txtStructureName").data("structureId")) {
        b = false;
        $.jBox.prompt("请选择任务所属章节！", "提示", "warning");
    } else if (!testTime || isNaN(testTime) || parseInt(testTime) == 0) {
        b = false;
        $.jBox.prompt("考试时间设置不正确！", "提示", "warning");
    } else if (!shorTestTime || isNaN(shorTestTime) ) {
        b = false;
        $.jBox.prompt("最短交试卷时间设置不正确！", "提示", "warning");
    } else if ($a.find("#txtStartDate").val() == "") {
        b = false;
        $.jBox.prompt("请设置开始日期！", "提示", "warning");
    } else if ($a.find("#txtEndDate").val() == "") {
        b = false;
        $.jBox.prompt("请设置结束日期！", "提示", "warning");
    }

    return b;
}

function onSelBookStructure() {
    var $jb = $.jBox("<div id='bookStructureTree' style='margin:6px;'><img src='../CMS/Images/ajax-loader_b.gif' style='margin: 35% 45%;' /></div>", { id: 'jb_bookStructureTree', title: "选择章节", width: 465, height: 505, top: "20%", buttons: { "确定": true, "取消": false }, submit: submitBookStructure });
    if (bookStructureNodes) {
        buildBookStructureTree($jb.find("#bookStructureTree"), bookStructureNodes);
    } else {
        $excuteWS("~TreeViewWS.getTreeViewData", { isbn: get_isbn(), isLazy: true, sampleQuestionFlag: false, userId:get_userId(),user: get_simpleUser() }, function (r) {
            if (r) {
                bookStructureNodes = r[0];
                buildBookStructureTree($jb.find("#bookStructureTree"), bookStructureNodes);
            }
        }, null, null);
    }
}

function buildBookStructureTree(treeContainer, treeData) {
    var $tree = treeContainer.dynatree({
        title: "Relation Tree",
        clickFolderMode: 1,
        children: treeData,
        cookieId: "selBsTree",
        onLazyRead: function (node) {
            var structureId = node.data.key;
            $excuteWS("~TreeViewWS.getKnowledgeGradesOfStructureList", { structureId: structureId, sampleQuestionFlag: false, userId: get_userId(), user: get_simpleUser() }, function (result) {
                if (result != null && result.length > 0) {
                    var kpNodes = new Array();
                    var kpNode = null;

                    $.each(result, function () {
                        kpNode = {};
                        kpNode.title = this.unit + ". " + this.itemName;
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
        onDblClick: function (node, event) {
            node.toggleExpand();
        }
    });
}

function submitBookStructure(v, h, f) {
    if (v == true) {
        var activeNode = h.find("#bookStructureTree").dynatree("getActiveNode");
        if (activeNode) {
            var tarNode;
            if (activeNode.parent.data.structureLevel == "10") {
                tarNode = activeNode.parent;
            } else {
                tarNode = activeNode;
            }
            var title = tarNode.data.title.replace(tarNode.data.unit + " ", "");
            $("#txtStructureName").data("structureId", tarNode.data.key).val(title);
        } else {
            $.jBox.tip("没有选择任何章节", 'warning');
        }
    }
}


//---------------------------组卷----------------------------------
function onCreatePaper() {
    resetBuildTestForm();
    editTestInfo();
    initSelectTestModel();
}

function editTestInfo() {
    $("#dvBuildTestTab #ulTestBaseInfo").trigger("click");
    showBuildTestBox(true);
}

function onSelectTab_b() {
    if (this.className == "cseltab_ul_s") return;

    var $currTab = $(this);
    var $siblingTabs = $currTab.siblings();
    var b;

    switch ($currTab.attr("id")) {
        case "ulTestBaseInfo":
            $("#dvTestBaseInfo").show();
            $("#dvTestModelInfo").hide();
            $("#dvComposePaper").hide();
            $("#dvCompleteBuildTest").hide();
            showTestBaseInfo();
            break;
        case "ulTestModel":
            b = checkTestBaseInfo();
            if (!b) {
                return;
            }
            $("#dvTestBaseInfo").hide();
            $("#dvTestModelInfo").show();
            $("#dvComposePaper").hide();
            $("#dvCompleteBuildTest").hide();
            showTestModelInfo();
            break;
        case "ulComposePaper":
            b = checkTestBaseInfo();
            if (!b) {
                return;
            }
            b = checkTestModel();
            if (!b) {
                return;
            }

            $("#dvTestBaseInfo").hide();
            $("#dvTestModelInfo").hide();
            $("#dvComposePaper").show();
            $("#dvCompleteBuildTest").hide();
            showComposeContent();
            break;
    }

    $siblingTabs.removeClass().addClass("cseltab_ul");
    $siblingTabs.find("li").each(function () {
        this.className = this.className.replace("_s", "");
    });

    $currTab.removeClass().addClass("cseltab_ul_s");
    $currTab.find("li").each(function () {
        this.className = this.className + "_s";
    });

}