
/// <reference path="../JQuery/jquery-1.4.1-vsdoc.js?ver=Acepherics120317" />
/// <reference path="../Scripts/JSUtil/Stip.js?ver=Acepherics120317" />
/// <reference path="String.js?ver=Acepherics120317" />

var $SHOW_RELATED_LO_loArray = new Array();
function $SHOW_RELATED_LO_addMouseHoverEvent(o) {
    var obj = typeof o;
    var oContainer = null;
    if (o!=null &&obj != "undefined") {
        if (obj == "string") {
            oContainer = $("#" + o);
        } else if (obj == "object") {
            oContainer = $(o);
        } 
    } else {
        oContainer = $(document.body);
    }
    if (oContainer.length == 0) {
        alert("error");
        return;
    }
    
    oContainer.find("span[loarray]").each(function (index) {
        var $this = $(this);
        //        $this.removeAttr("message");
        //        if ($this.data($.expando) != null) {
        //            $this.removeData($.expando)
        //        }
        //var tID = null; // $this.attr("id");
        //        if (typeof tID == "undefined" || tID == null || tID == "") {
        var randomID = randomStringFun(15);
        $this.attr("id", randomID);
        var tID = randomID;
        //        }
        var loIds = $this.attr("loarray");
        var tip = Stip(tID);

        $this.hover(function () {
            $this.css("background-color", "rgb(204,228,251)");
            //tip.show({ content: '<img src="../_Images/ajax-loader_m.gif"/>' });
            //tip.show($SHOW_RELATED_LO_getShowLoHTML(loIds));

            if ($("#" + tID + "_tip").length == 0) {
                $(getShowRightTipHTML($SHOW_RELATED_LO_getShowLoHTML(loIds), $this)).appendTo(document.body);
                $("#" + tID + "_tip").find("img[title=Detail]").each(function () {
                    var $this1 = $(this);
                    $this1.click(function () {
                        var $thisNext = $this1.next();
                        if ($LoDescriptionInfo == null) {
                            $LoDescriptionInfo = $("<div></div>"); //$this1.next();
                        }

                        $LoDescriptionInfo.html($thisNext.html());

                        $LoDescriptionInfo.dialog({ title: $thisNext.attr("title"), width: 480, height: 250, position: ["20%", $this1.offset().top + "px"]
                        });
                    });

                });
                $("#" + tID + "_tip").hover(
                function () {
                    $(this).show();
                }, function () {
                    $(this).hide();
                });

            } else {
                $("#" + tID + "_tip").show().find("div[tipshow=true]").css("top", $this.offset().top + "px").css("left", ($this.offset().left + 15) + "px");
                //$("#" + tID + "_tip").find("div[tipshow=true]").css("style", "top:" + $this.offset().top + "px;left:" + ($this.offset().left + 15) + "px;");
            }
        }, function () {
            $this.css("background-color", "");
            $("#" + tID + "_tip").hide();
        });

        //        $this.mouseout(function () {
        //            $this.css("background-color", "");
        //            $("#" + tID + "_tip").hide();
        //        });


    })

//    oContainer.find("span[message]").each(function (index) {
//        var $this = $(this);
//        //$this.removeAttr($.expando);
//        if ($this.data($.expando) != null) {
//            $this.removeData($.expando)
//        }
//        //        if (typeof tID == "undefined" || tID == null || tID == "") {
//        var randomID = randomStringFun(15);
//        $this.attr("id", randomID);
//        var tID = randomID;
//        //        }
//        var message = $this.attr("message");
//        var tip = Stip(tID);
//        $this.mouseover(function () {
//            $this.css("background-color", "rgb(204,228,251)");
////            tip.show({ content: '<img src="../_Images/ajax-loader_m.gif"/>' });
//            tip.show(message);
//        });

//        $this.mouseout(function () {
//            $this.css("background-color", "");
//            tip.hide();
//        });


//    })
}

var $LoDescriptionInfo = null;

function getShowRightTipHTML(content, o) { 
    var strHTMLArray=new Array();
    strHTMLArray.push('<div id="' + o.attr("id") + '_tip">');
    strHTMLArray.push('<div tipshow="true" class="lj-tipsWrap lj-correct" style="top: '+o.offset().top+'px; left: '+(o.offset().left+15)+'px;">');
    strHTMLArray.push('<div class="lj-content">'+content+'</div>');
    strHTMLArray.push('<span class="lj-in lj-right"><span class="lj-in lj-span"></span></span><a class="lj-close" href="javascript:void(0)" style="display: none;">x</a></div>');
    strHTMLArray.push('</div>');
    return strHTMLArray.join('');
}

function $SHOW_RELATED_LO_addLOToArray(loArray) {
    if (loArray == null) {
        loArray = new Array();
    }
    
    for (var i = 0; i < loArray.length; i++) {
        var flag=false;
        for (var j = 0; j < $SHOW_RELATED_LO_loArray.length; j++) {
            if ($SHOW_RELATED_LO_loArray[j].itemId == loArray[i].itemId) {
                flag = true;
                break;
            }
        }
        if (!flag) {
            $SHOW_RELATED_LO_loArray.push(loArray[i]);
        }
    }
    return $SHOW_RELATED_LO_loArray;
}

function $SHOW_RELATED_LO_getShowLoHTML(loIdsStr) {
    var loIds = $replaceAllSpaceToEmpty(loIdsStr);
    var tLoIdArray = loIds != null && loIds != "" ? loIds.split(",") : new Array();
    var htmlArray = new Array();
    htmlArray.push('<div>');
    for (var i = 0; i < $SHOW_RELATED_LO_loArray.length; i++) {
        for (var j = 0; j < tLoIdArray.length; j++) {
            if ($SHOW_RELATED_LO_loArray[i].itemId == tLoIdArray[j]) {
                var tlo = $SHOW_RELATED_LO_loArray[i].unit + '. ' + $SHOW_RELATED_LO_loArray[i].itemName;
                var des = ($SHOW_RELATED_LO_loArray[i].description != null && $SHOW_RELATED_LO_loArray[i].description != "") ? '&nbsp;&nbsp;<span><img Align="top" title="Detail" style="cursor:pointer;" alt="" src="../_Images/application_view_detail.png"/><div description="true" title="'+tlo+'" style="display:none;">' + $SHOW_RELATED_LO_loArray[i].description + '</div></span>' : "";
                htmlArray.push('<div style="color:blue;font-size:11px">' + tlo +des+ '</div>');
            }
        }
    }
    if (htmlArray.length == 1) {
        htmlArray.push('<div style="color:gray;font-size:11px;">No lo info yet.</div>');
    }
    htmlArray.push('</div>');
    return htmlArray.join('');
}

//替换所有空格('&nbsp'或' ')
function $replaceAllSpaceToEmpty(objStr) {
    return objStr.replace(/\s|　|&nbsp(;)?/gi, "");
}