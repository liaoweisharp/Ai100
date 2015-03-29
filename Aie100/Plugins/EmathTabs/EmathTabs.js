

/**
* o可以为jquery容器对象，也可以为js容器对象，或者是容器id
**/

//var $tab_knowlege_content = 0;
//var $tab_solution_content = 1;
//var $tab_answer_content = 2;
//var $tab_hint_content = 3;
var $emath_tab_json = {tab_knowlege_content:0,tab_solution_content:1,tab_answer_content:2,tab_hint_content:3,emath_tab_id : null};
function $EmathTab_GetTabView(json) {

    //json:{ tabContainer: "tab", showTopButton: true, showNullContent: true, defaultTabIndex: 2, tabContent: [{ title: "Knowledge Point", content: "XXXX" }, { title: "xxx", content: "" }, { title: "Solution", content: "aaaaaa" }, { title: "Answer", content: "bbbbb" }, { title: "Hint", content: "cccc"}] }
    var $o = null;
    var oId = $EmathTab_GetRandomChars(12);
    if (json.tabContainer) {
        if (typeof json.tabContainer == "object") {
            if (json.tabContainer instanceof jQuery) {
                $o = json.tabContainer;
            } else {
                $o = $(json.tabContainer);
            }
        } else if (typeof json.tabContainer == "string") {
            $o = $("#" + json.tabContainer);
        } else {
            $o = json.tabContainer;
        }
        $o.attr("oId",oId);
    }
    var tabContent = json.tabContent;
    var htmlStrArray = new Array();

    if (tabContent != null && tabContent.length > 0) {
        var contentArray = new Array();
        htmlStrArray.push('<div class="emath_tabs">');
        htmlStrArray.push('<div>');
        htmlStrArray.push('<table cellpadding="0" cellspacing="0" width="100%">');
        htmlStrArray.push('<tr>');
//        if (json.showTopButton) {
//            htmlStrArray.push('<tr style="background: url(../Images/tab_tmbg.gif) repeat-x scroll 0pt 13pt transparent;font-size: 11px;">');
//        } else {
//            htmlStrArray.push('<tr style="background: url(../Images/tab_tmbg.gif) repeat-x scroll 0pt 0pt transparent;font-size: 11px;">');
//        }
        if (json.showTopButton) {
            htmlStrArray.push('<td style="padding:0px;background: url(../Images/tab_tmbg.gif) repeat-x scroll 0pt 13pt transparent;font-size: 11px;">');
        } else {
            htmlStrArray.push('<td style="padding:0px;background: url(../Images/tab_tmbg.gif) repeat-x scroll 0pt 0pt transparent;font-size: 11px;">');
        }
       // htmlStrArray.push('<td>');
        htmlStrArray.push('<table cellpadding="0" cellspacing="0" width="auto" style="line-height:0px;">');
        htmlStrArray.push('<tr>');
        if (!json.defaultTabIndex) {
            json.defaultTabIndex = 0;
        }
        if (!json.showNullContent && typeof json.showNullContent != "undefined" && tabContent!=null) {
            for (var f = 0; f < tabContent.length; f++) {
                var $tcontent=$("<div>" + tabContent[f].content + "</div>");
                //if ($.trim($tcontent.text()) == "" && $tcontent.find("img").length == 0) {
                if ($tcontent.text() == "" && $tcontent.find("img").length == 0) {
                    tabContent.splice(f, 1);
                }
            } 
        }

        for (var i = 0; i < tabContent.length; i++) {
//            if (!json.showNullContent && typeof json.showNullContent != "undefined") {
//                if ($.trim($("<div>"+tabContent[i].content+"</div>").text())=="") {
//                    continue;
//                }
//            }
            htmlStrArray.push('<td style="padding:0px; background-color:transparent">');
            htmlStrArray.push('<table cellpadding="0" cellspacing="0" style="margin-right: 3px">');
            if (json.showTopButton) {
                htmlStrArray.push('<tr>');
                if (tabContent[i].title == "知识点") {
                    htmlStrArray.push('<td colspan="3" style="padding:0px;"><img title="浮动" tabTopIndex="' + i + '" alt="" src="../Images/tabs/k.gif" style=" cursor: pointer;" /></td>');
                } else if (tabContent[i].title == "解题过程") {
                    htmlStrArray.push('<td colspan="3" style="padding:0px;"><img title="浮动" tabTopIndex="' + i + '" alt="" src="../Images/tabs/s.gif" style=" cursor: pointer;" /></td>');
                    var $content = $("<div>" + tabContent[i].content + "</div>");
                    $content.find("img").each(function () {
                        var $this = $(this);
                        if ($this.attr("src").lastIndexOf("Emath/mathbbs_files/tip.png") != -1) {
                            $this.attr("src", "../Emath/mathbbs_files/tip.png");
                        }
                    });
                    //$content.find("img[src$=Emath/mathbbs_files/tip.png]").attr("src", "../Emath/mathbbs_files/tip.png");
                    tabContent[i].content = $content.html();
                } else if (tabContent[i].title == "答案") {
                    htmlStrArray.push('<td colspan="3" style="padding:0px;"><img title="浮动" tabTopIndex="' + i + '" alt="" src="../Images/tabs/a.gif" style=" cursor: pointer;" /></td>');
                } else if (tabContent[i].title == "提示") {
                    htmlStrArray.push('<td colspan="3" style="padding:0px;"><img title="浮动" tabTopIndex="' + i + '" alt="" src="../Images/tabs/h.gif" style=" cursor: pointer;" /></td>');
                } else {
                    htmlStrArray.push('<td colspan="3" style="padding:0px;"><img title="浮动" tabTopIndex="' + i + '" alt="" src="../Images/tabs/x.png" style=" cursor: pointer;" /></td>');
                }
                htmlStrArray.push('</tr>');
            }
            htmlStrArray.push('<tr>');
            if (json.defaultTabIndex == i) {
                htmlStrArray.push('<td style="padding:0px;line-height:27px;" tabTitleIndex="' + i + '" class="emath_tab_s_l"></td>');
                htmlStrArray.push('<td style="padding:0 3px;line-height:27px;" tabTitleIndex="' + i + '" class="emath_tab_s_m">' + tabContent[i].title + '</td>');
                htmlStrArray.push('<td style="padding:0px;line-height:27px;" tabTitleIndex="' + i + '" class="emath_tab_s_r" ></td>');
                //contentArray.push('<div title="' + tabContent[i].title + '" tabContentIndex="' + i + '" style="border: 1px solid #ADD6FF;border-top: none; padding: 5px;" tabContentId="' + $EmathTab_GetRandomChars(12) + '"><div>' + tabContent[i].content + '</div></div>');
                contentArray.push('<div title="' + tabContent[i].title + '" tabContentIndex="' + i + '" style="border: 1px solid #d6d6d6;border-top: none; padding: 5px;" tabContentId="' + $EmathTab_GetRandomChars(12) + '"><div>' + tabContent[i].content + '</div></div>');
            } else {
                htmlStrArray.push('<td style="padding:0px;line-height:27px;" tabTitleIndex="' + i + '" class="emath_tab_ns_l"></td>');
                htmlStrArray.push('<td style="padding:0 3px;line-height:27px;" tabTitleIndex="' + i + '" class="emath_tab_ns_m">' + tabContent[i].title + '</td>');
                htmlStrArray.push('<td style="padding:0px;line-height:27px;" tabTitleIndex="' + i + '" class="emath_tab_ns_r"></td>');
                //contentArray.push('<div title="' + tabContent[i].title + '" tabContentIndex="' + i + '" style="border: 1px solid #ADD6FF;border-top: none; padding: 5px;display:none;"  tabContentId="' + $EmathTab_GetRandomChars(12) + '"><div>' + tabContent[i].content + '</div></div>');
                contentArray.push('<div title="' + tabContent[i].title + '" tabContentIndex="' + i + '" style="border: 1px solid #d6d6d6;border-top: none; padding: 5px;display:none;"  tabContentId="' + $EmathTab_GetRandomChars(12) + '"><div>' + tabContent[i].content + '</div></div>');
            }

            htmlStrArray.push('</tr>');
            htmlStrArray.push('</table>');
            htmlStrArray.push('</td>');
        }
        htmlStrArray.push('</tr>');
        htmlStrArray.push('</table>');
        htmlStrArray.push('</td>');
        htmlStrArray.push('</tr>');
        htmlStrArray.push('</table>');
        htmlStrArray.push('</div>');
        htmlStrArray.push(contentArray.join(''));
        htmlStrArray.push('</div>');
    }
    if (!$o) {
        return htmlStrArray.join('');
    } else {
        $o.html(htmlStrArray.join(''));
        $o.find("div[class=emath_tabs] table tr td[class^='emath_tab']").each(function () {
            var $this = $(this);
            $this.click(function () {
                $o.find("table tr td[class^='emath_tab_s']").each(function (index) {
                    var $this1 = $(this);
                    var className1 = $this1.attr("class");
                    $this1.attr("class", "emath_tab_ns" + className1.substring(className1.lastIndexOf("_")));
                });
                $this.parent().find("td").each(function (index) {
                    var $this2 = $(this);
                    var className2 = $this2.attr("class");
                    $this2.attr("class", "emath_tab_s" + className2.substring(className2.lastIndexOf("_")));
                    $o.find("div[tabContentIndex]").each(function () {
                        var $this3 = $(this);
                        if ($this3.attr("tabContentIndex") == $this2.attr("tabTitleIndex")) {
                            $this3.show();
                        } else {
                            $this3.hide();
                        }
                    });

                });
            });
        });
        if (json.showTopButton) {
            $o.find("img[tabTopIndex]").each(function () {
                var $this4 = $(this);
                $this4.click(function () {
                    if ($emath_tab_json.emath_tab_id != null && $o.attr("oId") != $emath_tab_json.emath_tab_id) {
                        $EmathTab_CloseTabContentLayer();
                    }
                    $emath_tab_json.emath_tab_id = $o.attr("oId");

                    var tabContentDiv = $o.find("div[tabContentIndex=" + $this4.attr("tabTopIndex") + "]");
                    var tabContentDivTitle = tabContentDiv.attr("title");
                    $EmathTab_ShowTabContentLayer($this4, tabContentDiv);
                });
            });
        }

    }
}

function $EmathTab_CloseTabContentLayer() {
    if (isNaN($emath_tab_json.tab_knowlege_content)) {
        $emath_tab_json.tab_knowlege_content.dialog('close');
    }
    if (isNaN($emath_tab_json.tab_solution_content)) {
        $emath_tab_json.tab_solution_content.dialog('close');
    }
    if (isNaN($emath_tab_json.tab_answer_content)) {
        $emath_tab_json.tab_answer_content.dialog('close');
    }
    if (isNaN($emath_tab_json.tab_hint_content)) {
        $emath_tab_json.tab_hint_content.dialog('close');
    }
}

function $EmathTab_ShowTabContentLayer(oimg, tabContentDiv) {

    var tabContentId = tabContentDiv.attr("tabContentId");
    
    var tabContentDivTitle = tabContentDiv.attr("title");
    var tab_content = null;
    if (tabContentDivTitle == "Knowledge&nbsp;Point" || tabContentDivTitle == "Knowlege Point") {
        tab_content = $emath_tab_json.tab_knowlege_content;
    } else if (tabContentDivTitle == "Solution") {
        tab_content = $emath_tab_json.tab_solution_content;
    } else if (tabContentDivTitle == "Answer") {
        tab_content = $emath_tab_json.tab_answer_content;
    } else if (tabContentDivTitle == "Hint") {
        tab_content = $emath_tab_json.tab_hint_content;
    }

    if (isNaN(tab_content)) {
      
        var $_layerKP1 = $(tab_content.get(0).firstChild);
        if ($_layerKP1.attr("tTabContentId") == tabContentId) {
            return;
        } 

        $_layerKP1.appendTo($("div[tabContentId=" + $_layerKP1.attr("tTabContentId") + "]"));
        var $_layerKP5 = $(tabContentDiv.get(0).firstChild);
        $_layerKP5.attr("tTabContentId", tabContentId);
        tab_content.append($_layerKP5);

        tab_content.dialog({ position: ["20%", oimg.offset().top+"px"], open: function () {
        }, close: function () {
            var $_layerKP2 = $(tab_content.get(0).firstChild);
            $_layerKP2.appendTo($("div[tabContentId=" + $_layerKP2.attr("tTabContentId") + "]"));
        }
        });
        return;
    } else {
        var type = tab_content;
        tab_content = $("<div title='" + tabContentDivTitle + "'></div>");
        if (type == 0) {
            $emath_tab_json.tab_knowlege_content = tab_content;
        } else if (type == 1) {
            $emath_tab_json.tab_solution_content = tab_content;
        } else if (type == 2) {
            $emath_tab_json.tab_answer_content = tab_content;
        } else if (type == 3) {
            $emath_tab_json.tab_hint_content = tab_content;
        }
        var $_layerKP3 = $($("div[tabContentId=" + tabContentId + "]").get(0).firstChild);
        $_layerKP3.attr("tTabContentId", tabContentId);
        tab_content.append($_layerKP3);
        tab_content.dialog({width:480, position: ["20%", oimg.offset().top+"px"], close: function () {
            var $_layerKP4 = $(tab_content.get(0).firstChild);
            $_layerKP4.appendTo($("div[tabContentId=" + $_layerKP4.attr("tTabContentId") + "]"));
        }
        });

    }
}

function $EmathTab_GetRandomChars(length) {
    ///<summary>生成随机字符串</summary>
    ///<param name="length">生成字符串的长度</param>
    ///<return>返回生成的字符串</return>

    var x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
    var tmp = new Array();
    for (var i = 0; i < length; i++) {
        tmp[i] = (x.charAt(Math.ceil(Math.random() * 100000000) % x.length));
    }
    return tmp.join("");
}