/// <reference path="../../Scripts/jquery-1.4.1.min.js" />

var BookWrapperArray = [];
var TestQuestionTypeArray = [];
var OriginalBooks = []; //原书
var _Real = "0";
var $discipline = null;
var $subject = null;

function PageLoad() {
    var real = getUrlParms().real;
    _Real = (real && real == "1") ? "1" : "0";
    $discipline = $("#discipline");
    $subject = $("#subject");

    if (_Real == "1") {
        InitCmsMenu("m_CustomBookManage");
        $("#dvFeatureName").html("定制书管理>>");
    } else {
        InitCmsMenu("m_BookInfo");
        $("#dvFeatureName").html("书管理>>");
    }
    
    loadBookList();
    $("#bookInfoBar #btnAdd").click(function () {
        editBookInfo();
    });
    
    bindDiscipline($discipline, "");
    $discipline.change(function () {
        bindSubject($subject, $(this).val(), "");
        loadBookList();
    })
    $subject.change(function () {
        loadBookList();
    })

    $excuteWS("~CmsWS.getTestQuestionTypeSystemList", { userExtend: SimpleUser }, function (r) {
        $excuteWS("~CmsWS.getTestQuestionTypeSystemList", { userExtend: SimpleUser }, function (r) {
            TestQuestionTypeArray = r;
        }, null,null);
    }, null, null);
}

function loadBookList() {
    var $contentbox = $(".cms_contentbox").showLoading();
    var realBook = (_Real == "1") ? true : false;
    var disciplineIds = ($discipline.val() != "-1") ? [$discipline.val()] : null;
    var subjectIds = ($subject.val() != "-1") ? [$subject.val()] : null;
    $excuteWS("~CmsWS.getBookIdList", { userId: null, instituteIds: null, disciplineIds: disciplineIds, subjectIds: subjectIds, realFlag: realBook, userExtend: SimpleUser }, function (result) {
        $contentbox.hideLoading();
        var bookIds = (result && result.length > 0) ? result : [];
        bindBookPagin(bookIds);
    }, null, null);
}

var pageSize = 25;
function bindBookPagin(bookIds) {
    $("#dvBookPagin").html("").pagination(bookIds.length, {
        num_edge_entries: 2,
        num_display_entries: 5,
        items_per_page: pageSize,
        prev_text: "上一页",
        next_text: "下一页",
        callback: function (page_index, o) {
            var $contentbox = $(".cms_contentbox").showLoading();
            var _startPos = page_index * pageSize;
            var _endPos = _startPos + (pageSize - 1);
            var pageIds = getIdsArray(bookIds, _startPos, _endPos);
            $excuteWS("~CmsWS.getBookListByBookIds", { bookIds: pageIds, userExtend: SimpleUser }, function (result) {
                $contentbox.hideLoading();
                bindBookList(result);
            }, null, null);
        }
    });
}

function bindBookList(result, context) {
    var $dataTable = $(".cms_datatable");

    $dataTable.find("tr:gt(0)").remove();
    if (!result || result.length == 0) {
        $dataTable.append("<tr class='nodata lightblue'><td colspan='6'>无记录</td></tr>");
        return;
    }

    var sBuilder = [];
    var rowClass = "";
    var title = "";
    var subTitle = "";
    var edition = "";
    var publishYear = "";
    var i = 0;
    BookWrapperArray = result;

    $.each(result, function () {
        if (this.realFlag == _Real) {
            if (i % 2 == 0) {
                rowClass = "class='lightblue'";
            } else {
                rowClass = "";
            }

            title = (this.title) ? this.title : "";
            subTitle = (this.subTitle) ? this.subTitle : "";
            edition = (this.edition) ? this.edition : "";
            publishYear = (this.publishYear) ? this.publishYear : "";

            sBuilder = [];
            sBuilder.push("<tr id='" + this.id + "' " + rowClass + ">");
            sBuilder.push("<td>" + this.isbn + "</td>");
            sBuilder.push("<td>" + this.title + "</td>");
            sBuilder.push("<td>" + subTitle + "</td>");
            sBuilder.push("<td>" + edition + "</td>");
            sBuilder.push("<td>" + publishYear + "</td>");
            sBuilder.push("<td class='operate'><img src='Images/application_edit.png' title='编辑' onclick=\"editBookInfo('" + this.id + "')\" />&nbsp;<img src='Images/application_delete.png' title='删除' onclick=\"deleteBook('" + this.id + "')\" /></td>");
            sBuilder.push("</tr>");
            $dataTable.append(sBuilder.join(''));
            i++;
        }
    });
    $dataTable.find("tr:gt(0)").hover(function () {
        $(this).addClass("hover");
    }, function () {
        $(this).removeClass("hover");
    });

    _resizeCmsBox("cms_contentbox", 60);
}

function bstBindEvt() {
    
    var $trs = $("#jb_divBookInfo").find("div.custab_box div.content:eq(1) table tr.bst_row");
    $trs.unbind().hover(function () {
        $(this).find("div[contenteditable]").css({ "border": "1px inset rgb(227, 246, 255)", "background-color": "#fff" })
        $(this).find("td.operate div.btns img[action='remove']").show();
    }, function () {
        if ($(this).attr("flag") != "1") {
            $(this).find("div[contenteditable]").css({ "border": "1px solid #fff", "background-color": "" })
        }
        $(this).find("td.operate div.btns img[action='remove']").hide();
    });
    $trs.find("div[contenteditable]").unbind().click(function () {
        $trs.removeAttr("flag").find("div[contenteditable]").css({ "border": "1px solid #fff" });
        $(this).parent().parent().attr("flag", "1").find("div[contenteditable]").css({ "border": "1px inset rgb(227, 246, 255)", "background-color": "#fff" });
    });
}

function onBstRowClick(o) {
    var $o = $(o);
    var trArray = new Array();
    trArray.push('<tr class="bst_row">');
    trArray.push('<td style="border-bottom:1px dotted #ABCEFF;"><div contenteditable="true" style="padding:2px;border:1px solid #fff;"> </div></td>');
    trArray.push('<td class="operate" style="text-align:center;border-bottom:1px dotted #ABCEFF"><div class="btns"><img style="display:none;cursor:pointer;" onclick="onBstRowClick(this)" action="add" title="添加" src="Images/application_add.png"><img style="display:none" onclick="onBstRowClick(this)" action="remove" title="删除" src="Images/application_delete.png"></div></td>');
    trArray.push('</tr>');
    if ($o.attr("action") == "add") {
        
        $(trArray.join('')).insertAfter($("#bst_dataTable tr:last"));
        bstBindEvt();
        var $tr = $("#bst_dataTable tr");
        if ($tr.length == 2) {
            $tr.filter(":last").find("div[contenteditable]").trigger("click");
        }
    } else if ($o.attr("action") == "remove") {
        $o.parent().parent().parent().remove();
        
        var $jb_divBookInfo = $("#jb_divBookInfo");
        if ($jb_divBookInfo.find("div.custab_box div.content:eq(1) table tr.bst_row").length == 0) {
            $(trArray.join('')).insertAfter($jb_divBookInfo.find("div.custab_box div.content:eq(1) table tr"));
            bstBindEvt();
        }
    }
}

function getDifficultSelect(difficult) {
    var arr = new Array();
    arr.push('<select>');
    //arr.push('<option value="-1">--</option>');
    for (var i = 1; i <=5; i++) {
        arr.push('<option '+(difficult==""+i ? 'selected="selected"' : '')+' value="' + i + '">' + i + '</option>');
    }
    arr.push('<select>');
    return arr.join('');
}

var _tindex = 0;
function editBookInfo(bookId) {
    var title = "";
    var _bookId = "";
    if (bookId) {
        title = "编辑书";
        _bookId = bookId;
    } else {
        title = "添加书";
        _bookId = "";
    }
    var tbHTML = new Array();
    tbHTML.push('<div class="cont_box_nr1000" style="margin:5px;">');
    tbHTML.push('<div>');
    tbHTML.push('<div class="custab_bg">');
    tbHTML.push('<ul class="custab_ul">');
    tbHTML.push('<li class="custab_l_s"></li>');
    tbHTML.push('<li class="custab_m_s">书管理</li>');
    tbHTML.push('<li class="custab_r_s"></li>');
    tbHTML.push('</ul>');
    tbHTML.push('<ul class="custab_ul">');
    tbHTML.push('<li class="custab_l"></li>');
    tbHTML.push('<li class="custab_m" >书结构类型</li>');
    tbHTML.push('<li class="custab_r"></li>');
    tbHTML.push('</ul>');
    tbHTML.push('<ul class="custab_ul">');
    tbHTML.push('<li class="custab_l"></li>');
    tbHTML.push('<li class="custab_m" >考试题类型分配</li>');
    tbHTML.push('<li class="custab_r"></li>');
    tbHTML.push('</ul>');
    tbHTML.push('</div>');
    tbHTML.push('<div class="custab_box">');
    tbHTML.push('<div class="content">'+initBookBox()+'</div>');
    tbHTML.push('<div class="content" style="display:none;"><div class="data_loading" style="padding-top:5px;"><center><img loading="1" alt="" src="../Images/ajax-loader_b.gif" /></center></div></div><div id="divBstLastRow" style="display:none;background-color: rgb(244, 244, 244); line-height: 28px; padding-left: 10px;">知识点（题关联知识点的位置）</div>');
    tbHTML.push('<div class="content" style="display:none;"><div class="data_loading" style="padding-top:5px;"><center><img loading="1" alt="" src="../Images/ajax-loader_b.gif" /></center></div></div>');
    //<div style="background:#F3F8FE;padding:5px;"><input type="text" style="width:350px;margin-right:5px;"/><button style="padding:0px 10px 0px 10px;cursor:pointer;" class="jbox-button jbox-button-hover">添加</button></div>
    //<div style="background:#F3F8FE;padding:5px;"><input type="text" style="width:350px;margin-right:5px;"/><button style="padding:0px 10px 0px 10px;cursor:pointer;" class="jbox-button jbox-button-hover">添加</button></div>
    tbHTML.push('</div>');
    tbHTML.push('</div>');
    tbHTML.push('</div>');
    
    //var $jb = $.jBox(initBookBox(), { id: 'jb_cmsbook', title: title, width: 580, top: "25%", buttons: { "保存": true, "取消": false }, submit: submitBookInfo });
    _tindex = 0;
    window.bstArray = null;
    var $jb = $.jBox("<div id='jb_divBookInfo'>" + tbHTML.join('') + "</div>", { id: 'jb_cmsbook', title: title, width: 900, top: "25%", buttons: { "保存": true, "关闭": false }, submit: submitBookInfo });
    var $jb_divBookInfo = $("#jb_divBookInfo");
    initUploader();
    $jb_divBookInfo.find("#txtISBN").blur(function () {
        var $this = $(this);
        if (!bookId && $.trim($this.val()) != "" && $jb_divBookInfo.attr("isbn") != $this.val()) {
            $jb_divBookInfo.showLoading();
            $excuteWS("~CmsWS.getBookWrapperByISBN", { isbn: $this.val() }, function (r) {
                $jb_divBookInfo.hideLoading();
                if (r != null && r.length != 0) {
                    $this.attr("existflag","1");
                    $.jBox.tip("该ISBN已经存在", 'warning');
                }
                else {
                    $this.removeAttr("existflag");
                }
            }, null, null);
        }
    });
    var $ul = $jb_divBookInfo.find("ul.custab_ul");

    $jb_divBookInfo.find("#btnOriginalBook").click(function () {
        $jb_divBookInfo.find("#cms_dialog_book").hide();
        $jb_divBookInfo.find("#div_sob").show();
    });

    $jb_divBookInfo.find("#btnReutrnBM").click(function () {
        $jb_divBookInfo.find("#cms_dialog_book").show();
        $jb_divBookInfo.find("#div_sob").hide();
    });

    if (_Real == "1") {
        $jb_divBookInfo.find("#txtOriginalBook").parent().parent().show();
    } else {
        $jb_divBookInfo.find("#txtOriginalBook").parent().parent().hide();
    }

    
    //返回可选的原书
    var $sob_discipline = $jb_divBookInfo.find("#sob_discipline");
    var $sob_Subject = $jb_divBookInfo.find("#sob_Subject");
    if (bookId) {
        var bookWrapper = getBookInfoObj(bookId);
        bindDiscipline($sob_discipline, bookWrapper.disciplineId);
        bindSubject($sob_Subject, bookWrapper.disciplineId, bookWrapper.subjectId);
        queryOriginalBook(bookWrapper.disciplineId, bookWrapper.subjectId, $jb_divBookInfo);
    } else {
        bindDiscipline($sob_discipline);
    }
    $sob_discipline.change(function () {
        $jb_divBookInfo.find("#sob_BookList").empty();
        bindSubject($sob_Subject, $(this).val(), "");
    });
    $sob_Subject.change(function () {
        if (this.value != "-1") {
            queryOriginalBook($sob_discipline.val(), this.value, $jb_divBookInfo, "filter");
        }
    });
    //-end

    $ul.each(function (index1) {
        $(this).click(function () {
            
            var _isbn = $.trim($("#txtISBN").val());
            
            if ((index1 == 1 || index1==2) && !bookId && $jb_divBookInfo.attr("isbn") != _isbn) {
                //$.jBox.tip("请先保存书的信息", 'warning');
                return;
            }
            _tindex = index1;
            $(this).find("li").each(function (index2) {
                $(this).removeClass();
                switch (index2) {
                    case 0:
                        $(this).addClass("custab_l_s");
                        break;
                    case 1:
                        $(this).addClass("custab_m_s");
                        break;
                    case 2:
                        $(this).addClass("custab_r_s");
                        break;
                }
                
            });
            $ul.filter(":not(:eq("+index1+"))").each(function(){
                $(this).find("li").each(function (index3) {
                    $(this).removeClass();
                    switch (index3) {
                        case 0:
                            $(this).addClass("custab_l");
                            break;
                        case 1:
                            $(this).addClass("custab_m");
                            break;
                        case 2:
                            $(this).addClass("custab_r");
                            break;
                    }
                });
            });
            var $cdiv = $jb_divBookInfo.find("div.custab_box div.content").hide().filter(":eq(" + index1 + ")");
            $cdiv.show();
            switch (index1) {
                case 0:
                    $("#divBstLastRow").hide();
                    break;
                case 1:
                    $("#divBstLastRow").show();
                    var $cdiv_list = $cdiv.find("div.data_loading");
                    if ($cdiv_list.length != 0) {

                        $excuteWS("~CmsWS.getBookStructureTypeList", { isbn: _isbn }, function (r1) {
                            window.bstArray = r1;
                            if (r1 && r1.length > 0) {
                                $excuteWS("~CmsWS.getBookStructureIdsForNoUsed", { isbn: _isbn, userExtend: SimpleUser }, function (r2) {
                                    $cdiv.html(getBstList(r1, r2))
                                    bstBindEvt();
                                }, null, null);
                                
                            }
                            else {
                                $cdiv.html(getBstList(r1));
                                //bstBindEvt();
                            }

                        }, null, null);
                    }
                    break;
                case 2:
                    $("#divBstLastRow").hide();
                    if (!bookId) {
                        bookId = $jb_divBookInfo.attr("bookId");
                    }
                    var $cdiv_list = $cdiv.find("div.data_loading");
                    if ($cdiv_list.length != 0) {
                        $excuteWS("~CmsWS.getTestQuestionTypeBookList", { bookId: bookId, userExtend: SimpleUser }, function (r1) {
                            var htmlArray = new Array();
                            htmlArray.push('<table width="100%" cellspacing="5">');
                            htmlArray.push('<tr>');
                            htmlArray.push('<td style="width:340px;vertical-align:top;">');
                            htmlArray.push('<div id="divTQTSysList" class="cms_contentbox" style="border:1px solid rgb(227, 246, 255)">');
                            if (TestQuestionTypeArray) {
                                htmlArray.push('<div id="divTQTSysList" class="cms_contentbox" style="border:1px solid rgb(227, 246, 255)">');
                                htmlArray.push('<table border="0" class="cms_datatable">');
                                htmlArray.push('<tbody>');
                                htmlArray.push('<tr>');
                                htmlArray.push('<th width="20"></th>');
                                htmlArray.push('<th width="100">考试题型</th>');
                                htmlArray.push('<th>描述</th>');
                                htmlArray.push('</tr>');
                                for (var i = 0; i < TestQuestionTypeArray.length; i++) {
                                    if (i % 2 == 0) {
                                        htmlArray.push('<tr class="lightblue">');
                                    } else {
                                        htmlArray.push('<tr>');
                                    }
                                    var b = false;
                                    if (r1) {
                                        for (var k = 0; k < r1.length; k++) {
                                            if (TestQuestionTypeArray[i].id == r1[k].id) {
                                                b = true;
                                                break;
                                            }
                                        }
                                    }

                                    htmlArray.push('<td><input type="checkbox" ' + (b ? 'checked="checked"' : "") + ' tqtid="' + TestQuestionTypeArray[i].id + '" difficulty="' + TestQuestionTypeArray[i].difficulty + '" score="'+TestQuestionTypeArray[i].score+'" /></td>');
                                    htmlArray.push('<td>' + TestQuestionTypeArray[i].title + '</td>');
                                    htmlArray.push('<td>' + TestQuestionTypeArray[i].description + '</td>');
                                    htmlArray.push('</tr>');
                                }

                                htmlArray.push('</tbody>');
                                htmlArray.push('</table>');
                                htmlArray.push('</div>');

                            } else {
                                htmlArray.push('<div>没有记录。</div>');
                            }
                            htmlArray.push('<div style="clear:both;"></div>');
                            htmlArray.push('</div>');
                            htmlArray.push('</td>');
                            htmlArray.push('<td style="vertical-align:top;">');
                            //htmlArray.push('<div id="tqt_distribute_lst" style="border:1px solid rgb(227, 246, 255)"><div style="padding:5px;color:#888">请选择考试题型进行分配</div></div>');
                            htmlArray.push('<div id="tqt_distribute_lst" style="border:1px solid rgb(227, 246, 255)">');
                            if (r1) {
                                htmlArray.push('<div class="cms_contentbox" style="border:1px solid rgb(227, 246, 255)">');
                                htmlArray.push('<table border="0" class="cms_datatable">');
                                htmlArray.push('<tbody>');
                                htmlArray.push('<tr>');
                                htmlArray.push('<th>考试题型</th>');
                                htmlArray.push('<th style="width:40px;">难度</th>');
                                htmlArray.push('<th style="width:60px;text-align:center;">分数</th>');
                                htmlArray.push('<th style="width:20px;"></th>');
                                htmlArray.push('</tr>');
                                for (var i = 0; i < r1.length; i++) {
                                    htmlArray.push('<tr tqtid="'+r1[i].id+'" class="tqt_row">');
                                    htmlArray.push('<td style="border-bottom:1px dotted #ABCEFF;">' + r1[i].title + '</td>');
                                    htmlArray.push('<td style="border-bottom:1px dotted #ABCEFF;">' + getDifficultSelect(r1[i].difficulty) + '</td>');
                                    htmlArray.push('<td style="border-bottom:1px dotted #ABCEFF;text-align:center;"><input type="text" style="width:50px;text-align:center;" value="' + r1[i].score + '" /></td>');
                                    htmlArray.push('<td style="border-bottom:1px dotted #ABCEFF;"><img onclick="onTqtRemoveClick(\''+r1[i].id+'\')" title="删除" src="../Images/close.gif" style="cursor:pointer;" alt="" /></td>');
                                    htmlArray.push('</tr>');
                                }

                                htmlArray.push('</tbody>');
                                htmlArray.push('</table>');
                                htmlArray.push('</div>');

                            } else {
                                htmlArray.push('<div style="padding:5px;color:#888">请选择考试题型进行分配</div>');
                            }
                            htmlArray.push('<div style="clear:both;"></div>');
                            htmlArray.push('</div>');
                            htmlArray.push('</td>');
                            htmlArray.push('</tr>');
                            htmlArray.push('</table>');
                            $cdiv.html(htmlArray.join('')).find("#divTQTSysList table tr input:checkbox").click(function () {
                                
                                    var $cbx = $(this);
                                    var $tqt_distribute_lst = $("#tqt_distribute_lst");
                                    var $tr1 = $tqt_distribute_lst.find("table.cms_datatable tr[tqtid='" + $cbx.attr("tqtid") + "']");
                                    
                                    if ($cbx.is(":checked")) {
                                        if ($tr1.length != 0) {
                                            $tr1.show();
                                            return;
                                        }
                                        
                                        var trArr = new Array();
                                        trArr.push('<tr tqtid="'+$cbx.attr("tqtid")+'" class="tqt_row">');
                                        trArr.push('<td style="border-bottom:1px dotted #ABCEFF;">'+$cbx.parent().next().html()+'</td>');
                                        trArr.push('<td style="border-bottom:1px dotted #ABCEFF;">' + getDifficultSelect($cbx.attr("difficulty")) + '</td>');
                                        trArr.push('<td style="border-bottom:1px dotted #ABCEFF;text-align:center;"><input type="text" style="width:50px;text-align:center;" value="' + (isNaN($cbx.attr("score")) ? 0 : $cbx.attr("score")) + '" /></td>');
                                        trArr.push('<td style="border-bottom:1px dotted #ABCEFF;"><img onclick="onTqtRemoveClick(\'' + $cbx.attr("tqtid") + '\')" title="删除" src="../Images/close.gif" style="cursor:pointer;" alt="" /></td>');
                                        trArr.push('</tr>');
                                        if ($tqt_distribute_lst.find("table.cms_datatable").length == 0) {
                                            var htmlArray3 = new Array();
                                            htmlArray3.push('<div class="cms_contentbox" style="border:1px solid rgb(227, 246, 255)">');
                                            htmlArray3.push('<table border="0" class="cms_datatable">');
                                            htmlArray3.push('<tbody>');
                                            htmlArray3.push('<tr>');
                                            htmlArray3.push('<th>考试题型</th>');
                                            htmlArray3.push('<th style="width:40px;">难度</th>');
                                            htmlArray3.push('<th style="width:60px;text-align:center;">分数</th>');
                                            htmlArray3.push('<th style="width:20px;"></th>');
                                            htmlArray3.push('</tr>');
                                            htmlArray3.push(trArr.join(''));
                                            htmlArray3.push('</tbody>');
                                            htmlArray3.push('</table>');
                                            htmlArray3.push('</div>');
                                            $tqt_distribute_lst.html(htmlArray3.join(''));
                                        } else {
                                            $(trArr.join('')).insertAfter($tqt_distribute_lst.find("table.cms_datatable tr:last"))
                                        }
                                    } else {
                                        $tr1.hide();
                                    }
                                });
                           
                        }, null, null);
                        
                    }
                    break;
                default: break;
            }
            

        });
    });

    var $book = $jb.find("#cms_dialog_book");
    $book.data("_bookId", _bookId);

    var $ddlDiscipline = $book.find("#ddlDiscipline");
    var $ddlSubject = $book.find("#ddlSubject");

    if (bookId) {
        var bookWrapper = getBookInfoObj(bookId);
        $book.find("#txtISBN").val(bookWrapper.isbn);
        $book.find("#txtTitle").val(bookWrapper.title);
        $book.find("#txtSubTitle").val(bookWrapper.subTitle);
        $book.find("#txtEdition").val(bookWrapper.edition);
        $book.find("#txtPublishYear").val(bookWrapper.publishYear);
        bindDiscipline($ddlDiscipline, bookWrapper.disciplineId);
        bindSubject($ddlSubject, bookWrapper.disciplineId, bookWrapper.subjectId);
        bindPublisher($book.find("#ddlPublisher"), bookWrapper.publisherId);
        $book.find("#ddlRealFlag").val(bookWrapper.realFlag);
        $book.find(":radio[name='rdSyn'][qvalue='" + bookWrapper.synchroFlag + "']").attr("checked", "checked");

        if (bookWrapper.pointingBookId) {
            //返回当前书的原书
            $excuteWS("~CmsWS.getBookListByBookIds", { bookIds: [bookWrapper.pointingBookId], userExtend: SimpleUser }, function (result) {
                if (result) {
                    var originalBook = result[0];
                    var $txtOriginalBook = $book.find("#txtOriginalBook");
                    $txtOriginalBook.val(originalBook.title);
                    $txtOriginalBook.data("pointingBookId", originalBook.id);
                    $txtOriginalBook.data("pointingIsbn", originalBook.isbn);
                }
            }, null, null);            
        }

        //显示书的封面
        if (bookWrapper.bookConverIngLg) {
            $("#dvBookCoverBox").data("_bookCoverImg", bookWrapper.bookConverIngLg).empty().append("<div class='upImgBox'><div class='dtt'><img src='../Plugins/uploadify/delete.png' title='删除' style='cursor:pointer;' onclick='onDelUploadImg(this)' /></div><img class='_upImg' fileName='" + bookWrapper.bookConverIngLg + "' style='width:155px;height:185px' src='../Uploads/bookCover/" + bookWrapper.bookConverIngLg + "' /></div>");
        }
    } else {
        bindDiscipline($book.find("#ddlDiscipline"), "");
        bindSubject($book.find("#ddlSubject"), "", "");
        bindPublisher($book.find("#ddlPublisher"), "");
    }

    $ddlDiscipline.change(function () {
        bindSubject($ddlSubject, $(this).val(), "");
    });
}

function onTqtRemoveClick(tqtid) {
    $("#tqt_distribute_lst").find("table.cms_datatable tr[tqtid='" + tqtid + "']").hide();
    $("#divTQTSysList input[type='checkbox'][tqtid='" + tqtid + "']").removeAttr("checked");
}

function getBstList(r1,r2) {
    var htmlArray = new Array();
    htmlArray.push('<div class="cms_contentbox" style="border:0px;">');
    htmlArray.push('<table id="bst_dataTable" border="0" class="cms_datatable">');
    htmlArray.push('<tbody>');
    htmlArray.push('<tr>');
    htmlArray.push('<th>类型名称</th>');
    htmlArray.push('<th style="text-align:center;width:20px;"><img style="cursor:pointer;" onclick="onBstRowClick(this)" action="add" title="添加" src="Images/application_add.png"></th>');
    htmlArray.push('</tr>');
    if (r1) {

        for (var i = 0; i < r1.length; i++) {
            var boo = false;
            if (r2 && r2.length > 0) {
                for (var j = 0; j < r2.length; j++) {
                    if (r2[j] == r1[i].id) {
                        boo = true;
                        break;
                    }
                }
            }
            if (!boo) {
                htmlArray.push('<tr class="bst_row">');
                htmlArray.push('<td style="border-bottom:1px dotted #ABCEFF;"><div bstid="'+r1[i].id+'" contenteditable="true" style="padding:2px;border:1px solid #fff;">' + r1[i].structureType + '</div></td>');
                htmlArray.push('<td class="operate" style="text-align:center;border-bottom:1px dotted #ABCEFF">&nbsp;</td>');
                htmlArray.push('</tr>');
            } else {
                htmlArray.push('<tr class="bst_row">');
                htmlArray.push('<td style="border-bottom:1px dotted #ABCEFF;"><div bstid="' + r1[i].id + '" contenteditable="true" style="padding:2px;border:1px solid #fff;">' + r1[i].structureType + '</div></td>');
                htmlArray.push('<td class="operate" style="text-align:center;border-bottom:1px dotted #ABCEFF"><div class="btns"><img style="display:none" onclick="onBstRowClick(this)" action="add" title="添加" src="Images/application_add.png"><img style="display:none" onclick="onBstRowClick(this)" action="remove" title="删除" src="Images/application_delete.png"></div></td>');
                htmlArray.push('</tr>');
            }
           
        }

       

    } 
    htmlArray.push('</tbody>');
    htmlArray.push('</table>');
    htmlArray.push('</div>');
    htmlArray.push('<div style="clear:both;"></div>');
    return htmlArray.join('');
}

//初始化书信息编辑界面
function initBookBox() {
    var sBuilder = new Array();
    sBuilder.push("<div id='cms_dialog_book' class='cms_dialog'>");
    sBuilder.push("<div style='float: left; width: 540px;'>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp; 选择原书：</li>");
    sBuilder.push("    <li class='inp'><input id='txtOriginalBook' name='txtOriginalBook' type='text' style='width:273px;' /><input type='button' value='选择...' id='btnOriginalBook'></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp; ISBN：</li>");
    sBuilder.push("    <li class='inp'><input id='txtISBN' name='txtISBN' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp;标题：</li>");
    sBuilder.push("    <li class='inp'><input id='txtTitle' name='txtTitle' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'>副标题：</li>");
    sBuilder.push("    <li class='inp'><input id='txtSubTitle' name='txtSubTitle' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'>版本：</li>");
    sBuilder.push("    <li class='inp'><input id='txtEdition' name='txtEdition' type='text' style='width:174px' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'>出版年份：</li>");
    sBuilder.push("    <li class='inp'><input id='txtPublishYear' name='txtPublishYear' type='text' style='width:174px' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp;学科类别：</li>");
    sBuilder.push("    <li class='inp'><select id='ddlDiscipline' name='ddlDiscipline' style='width:180px'><option value='-1'>请选择</option></select></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp;学科：</li>");
    sBuilder.push("    <li class='inp'><select id='ddlSubject' name='ddlSubject' style='width:180px'><option value='-1'>请选择</option></select></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp;出版社：</li>");
    sBuilder.push("    <li class='inp'><select id='ddlPublisher' name='ddlPublisher' style='width:180px'><option value='-1'>请选择</option></select></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul style='display:none'>");
    sBuilder.push("    <li class='fname'>是否为真实书：</li>");
    sBuilder.push("    <li class='inp'><select id='ddlRealFlag' name='ddlRealFlag' style='width:180px'><option value='0' selected='selected'>否</option><option value='1'>是</option></select></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul style='display:none'>");
    sBuilder.push("    <li class='fname'>是否同步：</li>");
    sBuilder.push(String.format("    <li class='inp'><input id='{0}' type='radio' name='rdSyn' qvalue='1'> <label for='{0}'>是</label> &nbsp;&nbsp;<input id='{1}' checked='checked' type='radio' name='rdSyn' qvalue='0'> <label for='{1}'>否</label> </li>", String.randomString(3), String.randomString(3)));
    sBuilder.push("</ul>");
    sBuilder.push("</div>");
    sBuilder.push("<div style='float: left; width: 300px;'>");
    sBuilder.push("<input id='file_upload' name='file_upload' type='file' />");
    sBuilder.push("<div id='dvBookCoverBox' style='border: 1px solid #ccc; width: 155px; height: 185px; margin-top: 5px'></div>");
    sBuilder.push("</div>");
    sBuilder.push("</div>");

    /////////////
    sBuilder.push("<div id='div_sob' style='float:left; padding:8px; display:none'>");
    sBuilder.push("    <div style='float: left; height: 100%'>");
    sBuilder.push("        <div>");
    sBuilder.push("            <select id='sob_discipline' style='width:185px'><option value='-1'>选择学科类别</option></select><select id='sob_Subject' style='width:185px; margin-left:5px'><option value='-1'>选择学科</option></select>");
    sBuilder.push("            <input type='button' value='返回' id='btnReutrnBM' style='margin-left:422px' />");
    sBuilder.push("        </div>");
    sBuilder.push("        <ul id='sob_BookList' class='bklist'>");
    sBuilder.push("        </ul>");
    sBuilder.push("    </div>");
    sBuilder.push("</div>");
    /////////////

    sBuilder.push("<div style='clear:both;'></div>");
    return sBuilder.join("");
}

//显示学科类别列表
function bindDiscipline(oSel, defVal) {
    $excuteWS("~CmsWS.getDisciplineList", { userExtend: SimpleUser }, function (result) {
        oSel.find("option:gt(0)").remove();
        if (result && result.length > 0) {
            $.each(result, function () {
                oSel.append("<option value='" + this.id + "'>" + this.disciplineName + "</option>");
            });
            if (defVal) {
                oSel.val(defVal);
            }
        }
    }, null, null);
}

//显示学科列表
function bindSubject(oSel, disciplineId, defVal) {
    if (!disciplineId || disciplineId == "-1") {
        oSel.find("option:gt(0)").remove();
        return;
    }

    $excuteWS("~CmsWS.getSubjectListByDisciplineId", { disciplineId: disciplineId, userExtend: SimpleUser }, function (result) {
        oSel.find("option:gt(0)").remove();
        if (result && result.length > 0) {
            $.each(result, function () {
                oSel.append("<option value='" + this.id + "'>" + this.subjectName + "</option>");
            });
            if (defVal) {
                oSel.val(defVal);
            }
        }
    }, null, null);
}

//显示出版社列表
function bindPublisher(oSel, defVal) {
    $excuteWS("~CmsWS.getPublisherList", { userExtend: SimpleUser }, function (result) {
        oSel.find("option:gt(0)").remove();
        if (result && result.length > 0) {
            $.each(result, function () {
                oSel.append("<option value='" + this.id + "'>" + this.name + "</option>");
            });
            if (defVal) {
                oSel.val(defVal);
            }
        }
    }, null, null);
}

//验证BookInfo
function validateBookInfo(f, h) {
    var validData = { isValid: true, msg: "" };
    if (h.find("#txtOriginalBook").is(":visible") && f.txtOriginalBook.trim() == "") {
        validData.isValid = false;
        validData.msg = "原书不能为空！";
    } else if (f.txtISBN.trim() == "") {
        validData.isValid = false;
        validData.msg = "ISBN不能为空！";
    } else if (f.txtTitle.trim() == "") {
        validData.isValid = false;
        validData.msg = "标题不能为空！";
    } else if (f.ddlDiscipline == "-1") {
        validData.isValid = false;
        validData.msg = "请选择学科类别！";
    } else if (f.ddlSubject == "-1") {
        validData.isValid = false;
        validData.msg = "请选择学科！";
    } else if (f.ddlPublisher == "-1") {
        validData.isValid = false;
        validData.msg = "请选出版社！";
    }
    return validData;
}

//从表单获取bookInfo
function getBookInfo(f, h) {
    var bookWrapper = {};
    bookWrapper.userId = SimpleUser.userId;
    bookWrapper.isbn = f.txtISBN;
    bookWrapper.title = f.txtTitle;
    bookWrapper.subTitle = f.txtSubTitle;
    bookWrapper.edition = f.txtEdition;
    bookWrapper.publishYear = f.txtPublishYear;
    bookWrapper.disciplineId = f.ddlDiscipline;
    bookWrapper.subjectId = f.ddlSubject;
    bookWrapper.publisherId = f.ddlPublisher;
    bookWrapper.realFlag = _Real;
    bookWrapper.synchroFlag = $(":radio[name='rdSyn']:checked").attr("qvalue");
    if (_Real == "1") {
        var $txtOriginalBook = $("#txtOriginalBook");
        bookWrapper.pointingBookId = $txtOriginalBook.data("pointingBookId");
        bookWrapper.pointingIsbn = $txtOriginalBook.data("pointingIsbn");
    }
    var img = h.find("#dvBookCoverBox").data("_bookCoverImg");
    bookWrapper.bookConverIngLg = (img) ? img : "";
    return bookWrapper;
}

//提交书信息
function submitBookInfo(v, h, f) {
    if (v == true) {
        var validData = validateBookInfo(f, h);
        if (validData.isValid == false) {
            $.jBox.tip(validData.msg, 'warning');
            return false;
        }
        
        var bookWrapper = getBookInfo(f, h);
        var bookId = h.find("#cms_dialog_book").data("_bookId");
        
        if (_tindex == 0) {
            
            if (bookId != "") {
                
                bookWrapper.id = bookId;
                var originBook = getBookInfoObj(bookId);
                if (bookWrapper.isbn != originBook.isbn) {
                    checkAndSave("edit", bookWrapper);
                } else {
                    $excuteWS("~CmsWS.editBook", { bookW: bookWrapper, authorWs: [], userExtend: SimpleUser }, onEditBook, null, null);
                }

            } else {
                if ($("#txtISBN").attr("existflag") == "1") {
                    $.jBox.tip("ISBN已经存在", 'warning');
                    return false;
                }
                checkAndSave("save", bookWrapper);
            }
        } else if (_tindex == 1) {
            var bsts = new Array();
            var error_msg = "";
            $("#jb_divBookInfo").find("div.custab_box div.content:eq(1) table tr.bst_row").each(function () {
                var bst = null;
                var $editDIV = $(this).find("div[contenteditable]");
                var bstname = $.trim($editDIV.text());
                if (bstname == "") {
                    error_msg = "类型名称不能为空";
                    return false;
                }
                //if (window.bstArray) {
                //    for (var m = 0; m < window.bstArray.length; m++) {
                //        if ($.trim(window.bstArray[m].structureType) == bstname) {
                //            bst = window.bstArray[m];
                //            break;
                //        }
                //    }
                //}

                var _bstid = $editDIV.attr("bstid");
                if (_bstid != null && _bstid != "undefined" && _bstid != "") {
                    if (window.bstArray) {
                        for (var m = 0; m < window.bstArray.length; m++) {
                            if ($.trim(window.bstArray[m].id) == _bstid) {
                                bst = window.bstArray[m];
                                bst.structureType = bstname;
                                break;
                            }
                        }
                    }
                }

                if (bst == null) {
                    bst = {};
                    bst.structureType = bstname;
                    bst.bookId = bookId != "" ? bookId : $("#jb_divBookInfo").attr("bookId");
                }
                
                
                bsts.push(bst);
            });
            if (error_msg != "") {
                $.jBox.tip(error_msg, "error");
                return;
            }
            
            $excuteWS("~CmsWS.manageBookStructureType", { bsts: bsts, isbn: $.trim($("#txtISBN").val()), userExtend: SimpleUser }, function (r) {
                if (r != null) {
                    $.jBox.tip("书结构类型保存成功","success");
                }
            }, null, null);
        } else if (_tindex == 2) {
            var $tqt_distribute_lst = $("#tqt_distribute_lst");
            var testQuestionTypes = new Array();
            var f=true;
            $tqt_distribute_lst.find("table.cms_datatable tr[tqtid]:visible").each(function () {
                var $this = $(this);
                var tqt = getTqtObj($this.attr("tqtid"));
                tqt.difficulty = $this.find("select").val();
                tqt.score = $this.find("input[type='text']").val();
                if (isNaN(tqt.score)) {
                    return f=false;
                }
                testQuestionTypes.push(tqt);
            });

            if (!f) {
                $.jBox.tip("分数必须为数字类型", "error");
                return false;
            }
            
            $excuteWS("~CmsWS.manageTestQuestionTypeBooks", { testQuestionTypes: testQuestionTypes, bookId: bookId != "" ? bookId : $("#jb_divBookInfo").attr("bookId"), userExtend: SimpleUser }, function (r) {
                $.jBox.tip("试题类型保存成功", "success");
            }, null, null);
        }
        return false;
    } 
}

function getTqtObj(id) {
    var tqt = {};
    if (TestQuestionTypeArray) {
        for (var x = 0; x < TestQuestionTypeArray.length; x++) {
            if (TestQuestionTypeArray[x].id == id) {
                tqt = TestQuestionTypeArray[x];
                break;
            }
        }
    }
    return tqt;
}

//如果ISBN不重复则保存book
function checkAndSave(op, book) {
    $excuteWS("~CmsWS.getBookByISBN", { isbn: book.isbn }, function (result) {
        if (result) {
            $.jBox.tip("ISBN重复！", 'warning');
        } else {
            if (op == "save") {
                $excuteWS("~CmsWS.saveBook", { bookW: book, authorWs: [], userExtend: SimpleUser }, onSaveBook, null, null);
            } else {
                $excuteWS("~CmsWS.editBook", { bookW: book, authorWs: [], userExtend: SimpleUser }, onEditBook, null, null);                
            }
        }
    }, null, null);
}


function onSaveBook(result) {
    var bookWrapper = result;
    if (!bookWrapper) {
        $.jBox.tip("保存失败！", 'error');
    } else {
        // $.jBox.close('jb_cmsbook');
        $.jBox.tip("已成功保存书的信息", 'warning');
        loadBookList();
        
        $("#jb_divBookInfo").attr("isbn",bookWrapper.isbn).attr("bookId",bookWrapper.id);
        $("#jb_divBookInfo").find("ul.custab_ul:eq(1)").trigger("click");
    }
}

function onEditBook(result) {
    var bookWrapper = result;
    if (!bookWrapper) {
        $.jBox.tip("更新失败！", 'error');
    } else {
       // $.jBox.close('jb_cmsbook');
        loadBookList();
    }
}

function getBookInfoObj(bookId) {
    var book = null;
    for (var i = 0; i < BookWrapperArray.length; i++) {
        if (BookWrapperArray[i].id == bookId) {
            book = BookWrapperArray[i];
            break;
        }
    }
    return book;
}

function deleteBook(bookId) {
    $.jBox.confirm("你确定要删除这本书吗?", "提示", function (v, h, f) {
        if (v == true) {
            $excuteWS("~CmsWS.deleteBook", { bookW: { id: bookId }, userExtend: SimpleUser }, function (result) {
                if (result) {
                    loadBookList();
                } else {
                    $.jBox.tip("删除失败！", 'error');
                }
            }, null, null);
        }
    }, { top: "25%", buttons: { "确定": true, "取消": false} });
}


function queryOriginalBook(disciplineId, subjectId, o, flg) {
    if (flg == "filter") {
        o.find("#sob_BookList").showLoading();
    }
    $excuteWS("~CmsWS.getBookList", { userId: null, instituteIds: null, disciplineIds: [disciplineId], subjectIds: [subjectId], realFlag: false, userExtend: SimpleUser }, function (books) {
        OriginalBooks = (books && books.length > 0) ? books : [];
        if (OriginalBooks.length > 0) {
            var lis = [];
            for (var i = 0; i < books.length; i++) {
                lis.push("<li id='" + books[i].id + "' onclick='onSelOriginalBook(\"" + books[i].id + "\")'>" + books[i].title + "</li>");
            }
            o.find("#sob_BookList").empty().append(lis.join("")).hideLoading();
        } else {
            o.find("#sob_BookList").empty().append("<li style='text-align:center; color:#7d7d7d;'>没有原书</li>").hideLoading();
        }
    }, null, null);
}

function onSelOriginalBook(id) {
    var i = OriginalBooks.indexOf("id", id);
    var bookWrapper = (i != -1) ? OriginalBooks[i] : null;

    if (bookWrapper) {
        var $txtOriginalBook = $("#txtOriginalBook");
        $txtOriginalBook.val(bookWrapper.title);
        $txtOriginalBook.data("pointingBookId", bookWrapper.id);
        $txtOriginalBook.data("pointingIsbn", bookWrapper.isbn);
        $("#btnReutrnBM").trigger("click");
    }
}

//绑定已选列表
function bindSelectedORList(selectedList, o) {
    var lis = [];
    for (var i = 0; i < selectedList.length; i++) {
        lis.push("<li id='" + selectedList[i].id + "'>" + selectedList[i].title + "</li>");
    }
    o.find("#sob_Selected").empty().append(lis.join(""));
}

//初始化上传模块
function initUploader() {
    $("#file_upload").uploadify({
        'swf': '../Plugins/uploadify/uploadify.swf',
        'uploader': '../Upload.aspx?folder=Uploads/bookCover',
        'height': '22',
        'buttonText': '上传封面',
        'buttonClass': 'uploadify-button-custom',
        'fileTypeExts': '*.jpg;*.jpeg;*.gif;*.png',
        'fileSizeLimit': '1024KB',
        'multi': false,
        'removeTimeout': 1,
        'onUploadSuccess': function (file, data, response) {
            svrData = $.trim(data);
            if (svrData.charAt(0) == "1") {
                var str1 = svrData.substring(2);
                var fileName = str1.substring(0, str1.indexOf("]"));
                $("#dvBookCoverBox").data("_bookCoverImg", fileName).empty().append("<div class='upImgBox'><div class='dtt'><img src='../Plugins/uploadify/delete.png' title='删除' style='cursor:pointer;' onclick='onDelUploadImg(this)' /></div><img class='_upImg' fileName='" + fileName + "' style='width:155px;height:185px' src='../Uploads/bookCover/" + fileName + "' /></div>");
            }
        },
        'onInit': function () {
            $("#file_upload-queue").hide();
        }
    });
}

function onDelUploadImg(o) {
    $(o).parent().parent().remove();
    $("#dvBookCoverBox").data("_bookCoverImg", "");
}