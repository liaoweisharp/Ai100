/// <reference path="../JQuery/jquery.ajax.js" />

function ShowDetails(d) {
    /// <summary>d:{path:"~",container:"容器ID",data:{数据对象},show_type:"显示方式:0为嵌入，1为弹出显示",type:"0为知识点，1为学习资料，2为题"}</summary>
    this.path = null;
    this.container = null;
    this.data = null; //数据对象：知识点(StudyGuideItemExtendWrapper),或学习资料(StudyReferenceWrapper),或题(QuestionWrapper)
    this.show_type = null;
    this.type = null;
    this.jbox_options = { buttons: {} };
    if (d != null) {
        this.init(d);
    }

}

ShowDetails.prototype.init = function (d) {
    this.path = d.path ? d.path : "~";
    this.container = d.container ? this.toJQueryObject(d.container) : null;
    this.data = d.data ? d.data : {};
    this.show_type = d.show_type ? d.show_type : "1";
    this.type = d.type ? d.type : null;
    if (d.show_type == 1) {
        this.jbox_options = d.jbox_options ? d.jbox_options : {};
        if (!this.jbox_options.width) {
            this.jbox_options.width = 815;
            this.jbox_options.overflow = "hidden";
        }
    }
}

ShowDetails.prototype.getStudyResource = function () {
    var htmlArr = new Array();
    htmlArr.push('<div style="font-size:12px;width:810px;font-family:Arial,Helvetica,sans-serif">');
    htmlArr.push('<div style="width:806px;height:306px;padding:10px 10px 0px 10px;">');
    htmlArr.push('<div style="margin-right:20px;height:280px;overflow:auto">' + this.data.content + '</div>');
    htmlArr.push('</div>');
    //   htmlArr.push('<div style="padding:0 8px">');
    //    htmlArr.push('<div style="font-weight:bold">' + this.data.title + '</div>');
    //    htmlArr.push('<div style="font-size:11px;color:Gray;margin:3px 3px 3px 0px"><span>Type:' + SD_getFileType(this.data.type) + '</span><span style="margin-left:20px">Difficulty:' + SD_getDifficulty(this.data.difficulty) + '</span><span style="margin-left:20px">Content Type:' + this.data.studyReferenceTypeName + '</span><span style="margin-left:20px">Relevancy:' + SD_getRelevancy(this.data.relevancy) + '</span><span style="margin-left:20px">Recommendation:' + SD_getRecommendation(this.data.recommendation) + '</span></div>');
    //    if (this.data.discription && $.trim(this.data.discription) != "" && $.trim(this.data.discription) != "&nbsp;") {
    //        htmlArr.push('<div style="color:Green;height:65px;overflow:auto;">' + this.data.discription + '</div>');
    //    }
    //    htmlArr.push('</div>');
    htmlArr.push('</div>');
    return htmlArr.join('');
}

ShowDetails.prototype.setContent = function (complete) {
    var o = this;

    if (this.type == null || this.show_type == null) {
        alert("Parameter error");
        return;
    }

    if (this.show_type == 0) {//嵌入

        if (this.type == 0) {//知识点
            var htmlArr = new Array();
            htmlArr.push('<table cellspacing="0" cellpadding="0" border="0" width="100%">');
            htmlArr.push('<tbody>');
            htmlArr.push('<tr>');
            htmlArr.push('<td style="background:url(../Images/RoundCorner/roudcornlb_tl.gif) no-repeat; width:5px; height:6px;padding:0px;"></td>');
            htmlArr.push('<td style="background:url(../Images/RoundCorner/roudcornlb_tm.gif) repeat-x; height:6px;padding:0px;"></td>');
            htmlArr.push('<td style="background:url(../Images/RoundCorner/roudcornlb_tr.gif) repeat-x; width:6px; height:6px;padding:0px;"></td>');
            htmlArr.push('</tr>');
            htmlArr.push('<tr>');
            htmlArr.push('<td style="background:url(../Images/RoundCorner/roudcornlb_ml.gif) repeat-y; width:20px;padding:0px;"></td>');
            htmlArr.push('<td style="background-color:#fff;padding:8px 8px 0px 0px;font-size:12px;">' + this.data.description + '</td>');
            htmlArr.push('<td style="background:url(../Images/RoundCorner/roudcornlb_mr.gif) repeat-y; width:6px;"></td>');
            htmlArr.push('</tr>');
            htmlArr.push('<tr>');
            htmlArr.push('<td style="background:url(../Images/RoundCorner/roudcornlb_bl.gif) repeat-x; width:20px; height:21px;"></td>');
            htmlArr.push('<td style="background:url(../Images/RoundCorner/roudcornlb_bm.gif) repeat-x; height:21px;"></td>');
            htmlArr.push('<td style="background:url(../Images/RoundCorner/roudcornlb_br.gif) repeat-x; width:6px; height:21px;"></td>');
            htmlArr.push('</tr>');
            htmlArr.push('</tbody>');
            htmlArr.push('</table>');
            this.container.html(htmlArr.join(''));

        } else if (this.type == 1) {//学习资料
            this.container.html(this.getStudyResource());
        } else if (this.type == 2) {//题

        }
        //if (this.container.height() > 250) {
        //    this.container.css({ "height": "250px", "overflow": "auto" })
        //}
    } else {//弹出
        this.jbox_options.buttons = { "关闭": true };
        if (this.type == 0) {//知识点
            $.jBox("<div jbox_flag='1' style='padding:5px;'>" + this.data.description + "</div>", this.jbox_options);
        } else if (this.type == 1) {//学习资料
            // this.jbox_options.width = "805";

            if (this.data.type == "3" && this.data.embedCode && this.data.embedCode.toLowerCase().indexOf("iframe") != -1) {
                //$(this.data.embedCode).appendTo(document.body);
                this.jbox_options.buttons = {};
                this.jbox_options.width = "100%";
                $.jBox("<div id='SD_ShowSRVideo'><div style='width:550px;height:400px;'></div></div>", this.jbox_options);
                var $SD_ShowSRVideo = $("#SD_ShowSRVideo");
                $SD_ShowSRVideo.html(this.data.embedCode);
                var $SD_ShowSRVideoIframe = $SD_ShowSRVideo.find("iframe");
                if (!$SD_ShowSRVideoIframe.attr("width")) {
                    $SD_ShowSRVideoIframe.attr("width", "550px")
                }

                if (!$SD_ShowSRVideoIframe.attr("height")) {
                    $SD_ShowSRVideoIframe.attr("height", "400px")
                }

            } else {
                $.jBox("<div jbox_flag='1' style='padding:5px;'>" + this.getStudyResource() + "</div>", this.jbox_options);
            }

        } else if (this.type == 2) {//题

        }

        var $jboxDiv = $("div[jbox_flag=1]");
        $jboxDiv.parent().css("overflow", "hidden");
        if (this.type == 0 && $jboxDiv.height() > 350) {
            $jboxDiv.css("height", "350");
            $jboxDiv.css("overflow", "auto");
        }
    }

    if (typeof complete == "function") {
        var json = { itemName: this.data.itemName, complete: complete };
        (json.complete)();
    }
}


ShowDetails.prototype.show = function (complete) {

    var o = this;
    if (this.type == 0) {//知识点
        if (this.data.description && $.trim(this.data.description) != "") {//有描述
            o.setContent(complete);
        } else {//无描述
            var _simpleUser = typeof get_simpleUser == "function" && get_simpleUser() ? get_simpleUser() : window.simpleUser;
            $excuteWS(o.path + "CmsWS.getLearningObjectiveForLoIds", { loIds: [this.data.itemId], userExtend: _simpleUser }, function (r) {
                //o.jbox_options.title = o.jbox_options.title && $.trim(o.jbox_options.title) != "" ? o.jbox_options.title : r[0].unit + " " + r[0].name;
                if (r && r.length > 0) {
                    if (o.jbox_options != null) {
                        o.jbox_options.title = o.jbox_options.title && $.trim(o.jbox_options.title) != "" ? o.jbox_options.title : r[0].unit + " " + r[0].name;
                    }
                    if ($.trim(r[0].description) != "") {
                        o.data.itemName = r[0].unit + " " + r[0].name;
                        o.data.description = r[0].description;
                    } else {
                        //o.data.description = "<span style='color:gray;' nodetails='1'>没有描述信息</span>";
                        o.data.itemName = r[0].unit + " " + r[0].name;
                        o.data.description = "";
                    }
                } else {
                    o.data.description = "<span style='color:gray;' nodetails='1'>没有描述信息</span>";
                }

                o.setContent(complete);
            }, null, { userContext: "getStudyItemNoBsWithLoIds" });
        }
    } else if (this.type == 1) {//学习资料
        if (this.content && $.trim(this.content) != "") {//有描述
            o.setContent(complete);
        } else {//无描述
            var _simpleUser = typeof get_simpleUser == "function" && get_simpleUser() ? get_simpleUser() : window.simpleUser;
            
            $excuteWS(o.path + "CmsWS.getStudyReferenceWrapperList", { referenceIds: [this.data.studyReferenceId], usersExtendWrapper: _simpleUser }, function (r) {
                if (r && r.length > 0) {
                    if (o.jbox_options != null) {
                        o.data.title = o.jbox_options.title = o.jbox_options.title && $.trim(o.jbox_options.title) != "" ? o.jbox_options.title : r[0].title;
                    }
                    o.data = r[0];
                } else {

                    o.content = "没有学习资料信息";
                }
                o.setContent(complete);
            }, null, { userContext: "getStudyReferenceWrapperList" });
        }
    } else if (this.type == 2) {//题

    }
}

ShowDetails.prototype.toJQueryObject = function (container) {
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

/*
function $O(container) {
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
*/

function SD_getFileType(tpv) {
    var fileTypeName = "";
    switch (tpv) {
        case "0":
            fileTypeName = "地址";
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
            fileTypeName = "游戏";
            break;
        case "6":
            fileTypeName = "图片";
            break;
        case "7":
            fileTypeName = "FLASH";
            break;
        default:
            fileTypeName = tpv;
            break;
    }
    return fileTypeName;
}

function SD_getRelevancy(v) {
    v = $.trim(v);
    var relevancyStr = "";
    switch (v) {
        case "0.4":
            relevancyStr = "40%";
            break;
        case "0.5":
            relevancyStr = "40%";
            break;
        case "0.6":
            relevancyStr = "60%";
            break;
        case "0.7":
            relevancyStr = "70%";
            break;
        case "0.8":
            relevancyStr = "80%";
            break;
        case "0.9":
            relevancyStr = "90%";
            break;
        case "1.0":
            relevancyStr = "100%";
            break;
        default:
            relevancyStr = v;
            break;
    }
    return relevancyStr;
}

function SD_getDifficulty(v) {
    v = $.trim(v);
    var difficultyStr = "";
    switch (v) {
        case "0":
            difficultyStr = "基础";
            break;
        case "1":
            difficultyStr = "中等";
            break;
        case "2":
            difficultyStr = "难";
            break;
        case "3":
            difficultyStr = "高难";
            break;
        default:
            difficultyStr = v;
    }
    return difficultyStr;
}

function SD_getRecommendation(recommendation) {
    var recommendation = $.trim(recommendation);
    var reslut = "";
    if (recommendation == "0") {
        reslut = "必须的";
    }
    else if (recommendation == "1") {
        reslut = "推荐的";
    } else if (recommendation == "2") {
        reslut = "可选的";
    } else {
        reslut = "[...]";
    }
    return reslut;
}
//ShowDetails.prototype.hide = function () {
//}

//ShowDetails.prototype.dispose = function () {
//}
