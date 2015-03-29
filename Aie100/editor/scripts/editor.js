/// <reference path="../../Scripts/JQuery/jquery-1.6.1.min.js" />

/// <reference path="extend.js" />

$.fn.outerHTML = function () {
    var s = $(this.selector);
    //return (s) ? this.before(s).remove() : jQuery("p").append(this.eq(0).clone()).html();
    if (s.length != 0) {
        var $div = $(document.createElement("p"));
        s.clone().appendTo($div)
        return $div.html();
    } else {
        return null;
    }
}

if (typeof $.include != "function") {
    
    $.extend({
        includePath: '',
        include: function (file) {
            var files = typeof file == "string" ? [file] : file;
            for (var i = 0; i < files.length; i++) {
                var name = files[i].replace(/^\s|\s$/g, "");
                var att = name.split('.');
                var ext = att[att.length - 1].toLowerCase();
                var isCSS = ext == "css";
                var tag = isCSS ? "link" : "script";
                var attr = isCSS ? " type='text/css' rel='stylesheet' " : " language='javascript' type='text/javascript' ";
                var link = (isCSS ? "href" : "src") + "='" + $.includePath + name + "'";
                if ($(tag + "[" + link + "]").length == 0) document.write("<" + tag + attr + link + "></" + tag + ">");
            }
        }
    });
}
//$.includePath = ".." ;
$.include(['../editor/css/editor.css', '../editor/scripts/extend.js', '../Styles/uploadify.css', '../Plugins/swfobject.js', '../Plugins/jquery.uploadify.v2.1.4.min.js']);


function editor_getRootPath() {
    var pathName = window.location.pathname.substring(1);
    var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
    return window.location.protocol + '//' + window.location.host + '/' + webName;
}


function emath_editor() {
    this.ematx_url = "http://www.aie100.com:8080/cgi-bin/ematx.cgi";
    this.show_mode = null;
    this.head_container = null; //头部容器，若为null则默认头部和编辑器一起显示，否则头部放在用户自定义的容器里
    this.edit_container = null; //编辑区容器
    this.edit_height = "";
    this.upload_path = null;
    this.edit_content = null; //编辑区内容(html)
    this.jq_temp_container = $("<div></div>");
}

var emath_latexValue = "";

emath_editor.prototype.show = function () {

    if (!$.jBox) {
        alert("jBox.js is required.");
        return;
    }
    
    var _emath_editor = this;
    this.jq_edit_container = this.toJQueryObject(this.edit_container);
    this.jq_header_container = this.toJQueryObject(this.head_container);
    this.jq_edit_container.find("img[src*='link_edit.png']").css("display", "");
    
    var _html = this.jq_edit_container.html();
    if (_html.replace(/\s|　|&nbsp(;)?/gi, "") == "") { _html = ""; }
    if (_html != "") {
        this.jq_edit_container.find("img[src*='link_edit.png']").css("display", "");
        //        _emath_editor.edit_content = this.jq_edit_container.html();
        if (_emath_editor.show_mode == "html") {
            _emath_editor.edit_content = _html;
        } else if (_emath_editor.show_mode == "latex") {
            _emath_editor.edit_content = _emath_editor.imgToStr(_html);
        } else {
            _emath_editor.edit_content = _html;
        }
    }
    $("#aie_editor_preview").html("");
    if (this.flag) {

        if (this.jq_edit_container.find("div.emath_editor").length == 0) {
            //            var _html = this.jq_edit_container.html();
            //            if (_html.replace(/\s|　|&nbsp(;)?/gi, "") == "") { _html = ""; }
            this.jq_temp_container.find("iframe[edit_area=1]").css("height", _emath_editor.edit_height);
            this.jq_edit_container.html("");
            this.jq_edit_container.append(this.jq_temp_container.children());
            $(_emath_editor.jq_edit_container.find("iframe[edit_area=1]").get(0).contentWindow.document.body).html('<div style="color:red;font-size:12px;"><img src="../Images/ajax-loader_m.gif" alt=""/> The data is loading,please wait...</div>');

            var _i = 0;
            var t = setInterval(function () {
                if ($(_emath_editor.jq_edit_container.find("iframe[edit_area=1]").get(0).contentWindow.document.body).length > 0) {
                    clearInterval(t);
                } else {
                    //$(_emath_editor.jq_edit_container.find("iframe[edit_area=1]").get(0).contentWindow.document.body).html('<div style="color:red;font-size:12px;"><img src="../Images/ajax-loader_m.gif" alt=""/> The data is loading,please wait...</div>');
                    _i = _i + 50;
                    if (_i >= 2000) {
                        clearInterval(t);
                    }
                    return;
                }

                if (_emath_editor.show_mode == "html") {
                    $(_emath_editor.jq_edit_container.find("iframe[edit_area=1]").get(0).contentWindow.document.body).text(_html.replace(/\$/gi, "&#36;"));
                } else if (_emath_editor.show_mode == "latex") {
                    $(_emath_editor.jq_edit_container.find("iframe[edit_area=1]").get(0).contentWindow.document.body).html(_emath_editor.imgToStr(_html.replace(/\$/gi, "\\$")));
                } else {
                    $(_emath_editor.jq_edit_container.find("iframe[edit_area=1]").get(0).contentWindow.document.body).html(_html);
                }

                //if (_emath_editor.show_mode != "preview" && _emath_editor.show_mode != "html") {
                //    $(_emath_editor.jq_edit_container.find("iframe[edit_area=1]").get(0).contentWindow.document.body).find("img[src*='link_edit.png']").css("display", "");
                //}

                if ($("#aie_editor_preview").is(":visible")) {
                    $("#aie_editor_preview").html(_html).find("img[src*='link_edit.png']").css("display", "none");
                }

                if (_emath_editor.upload_path != null) {
                    $("#editor_spUploadImage,#editor_spUploadFile").css("display", "inline-block");
                    _emath_editor.uploadify();
                } else {
                    $("#editor_spUploadImage,#editor_spUploadFile").css("display", "none");
                }
            }, 50)

        }
        return;
    }

    var headArray = new Array();
    headArray.push('<div class="aie_editor_head">');
    headArray.push('<select select_action="formatblock">');
    headArray.push('<option value="&lt;p&gt;">标准</option>');
    headArray.push('<option value="&lt;p&gt;">段落</option>');
    headArray.push('<option value="&lt;h1&gt;">标题 1 </option>');
    headArray.push('<option value="&lt;h2&gt;">标题 2 </option>');
    headArray.push('<option value="&lt;h3&gt;">标题 3 </option>');
    headArray.push('<option value="&lt;h4&gt;">标题 4 </option>');
    headArray.push('<option value="&lt;h5&gt;">标题 5 </option>');
    headArray.push('<option value="&lt;h6&gt;">标题 6 </option>');
    headArray.push('<option value="&lt;address&gt;">地址 </option>');
    headArray.push('<option value="&lt;pre&gt;">格式 </option>');
    headArray.push('</select>');
    headArray.push('<select select_action="fontname">');
    headArray.push('<option value="Font" selected="selected">字体</option>');
    headArray.push('<option value="Arial">Arial</option>');
    headArray.push('<option value="Courier">Courier</option>');
    headArray.push('<option value="Times New Roman">Times New Roman</option>');
    headArray.push('</select>');
    headArray.push('<select select_action="fontsize">');
    headArray.push('<option value="Size">大小</option>');
    headArray.push('<option value="1">1</option>');
    headArray.push('<option value="2">2</option>');
    headArray.push('<option value="3">3</option>');
    headArray.push('<option value="4">4</option>');
    headArray.push('<option value="5">5</option>');
    headArray.push('<option value="6">6</option>');
    headArray.push('<option value="7">7</option>');
    headArray.push('</select>');
    headArray.push('<img click_action="editor_InsertLO" class="imgbutton" src="../editor/imgs/richtext/tip.png" alt="内容关联" title="内容关联" />');
    //headArray.push('<img click_action="inservideo" class="imgbutton" src="../Images/film.png" alt="插入语音视频" title="插入语音视频" />');
    headArray.push('<img click_action="undo" class="imgbutton" src="../editor/imgs/richtext/undo.gif" alt="撤销" title="撤销" />');
    headArray.push('<img click_action="redo" class="imgbutton" src="../editor/imgs/richtext/redo.gif" alt="重做" title="重做"/>');
    headArray.push('<img click_action="copy" class="imgbutton" src="../editor/imgs/richtext/copy.gif" alt="复制" title="复制" />');
    headArray.push('<img click_action="paste" class="imgbutton" src="../editor/imgs/richtext/paste.gif" alt="粘贴" title="粘贴" />');
    headArray.push('<img click_action="cut" class="imgbutton" src="../editor/imgs/richtext/cut.gif" alt="剪切" title="剪切" />');
    headArray.push('<img click_action="createlink" class="imgbutton" src="../editor/imgs/richtext/link.gif" alt="插入链接" title="插入链接" />');
    headArray.push('<img click_action="createtable" class="imgbutton" src="../editor/imgs/richtext/table.gif" alt="插入表格" title="插入表格" />');
    headArray.push('<span id="editor_spUploadImage" class="imagebutton" style="z-index:-10;display:none;width: 20px; text-align: center;" title="上传图片"><input type="file" name="uploadify_image" id="editor_uploadifyImage" /></span>');
    headArray.push('<span id="editor_spUploadFile" class="imagebutton" style="z-index:-10;display:none;width: 20px; text-align: center;" title="上传文件"><input type="file" name="uploadify_file" id="editor_uploadifyFile" /></span>');
    //headArray.push('<img click_action="createimage" class="imgbutton" src="../editor/imgs/richtext/file.gif" alt="Upload File" title="Upload File" />');
    headArray.push('<img click_action="bold" class="imgbutton" src="../editor/imgs/richtext/bold.gif" alt="粗体" title="粗体" />');
    headArray.push('<img click_action="italic" class="imgbutton" src="../editor/imgs/richtext/italic.gif" alt="斜体" title="斜体" />');
    headArray.push('<img click_action="underline" class="imgbutton" src="../editor/imgs/richtext/underline.gif" alt="下划线" title="下划线" />');
    //    headArray.push('<img click_action="insertstraightline" class="imgbutton" src="../editor/imgs/richtext/insertstraightline.gif" alt="insert straight-line" title="insert straight-line" />');
    //    headArray.push('<img click_action="insertordernumber" class="imgbutton" src="../editor/imgs/richtext/insertordernumber.gif" alt="insert serial number" title="insert serial number" />');
    //    headArray.push('<img click_action="resetordernumber" class="imgbutton" src="../editor/imgs/richtext/resetordernumber.gif" alt="reset serial number" title="reset serial number" />');
    headArray.push('<img click_action="justifyleft" class="imgbutton" src="../editor/imgs/richtext/justifyleft.gif" alt="居左" title="居左" />');
    headArray.push('<img click_action="justifycenter" class="imgbutton" src="../editor/imgs/richtext/justifycenter.gif" alt="居中" title="居中" />');
    headArray.push('<img click_action="justifyright" class="imgbutton" src="../editor/imgs/richtext/justifyright.gif" alt="居右" title="居右" />');
    headArray.push('<img click_action="strikethrough" class="imgbutton" src="../editor/imgs/richtext/strikethrough.gif" alt="删除线" title="删除线" />');
    headArray.push('<img click_action="subscript" class="imgbutton" src="../editor/imgs/richtext/subscript.gif" alt="下标" title="下标" />');
    headArray.push('<img click_action="superscript" class="imgbutton" src="../editor/imgs/richtext/superscript.gif" alt="上标" title="上标" />');
    headArray.push('<img click_action="delete" class="imgbutton" src="../editor/imgs/richtext/delete.gif" alt="删除" title="删除" />');
    //    headArray.push('<img click_action="forecolor" class="imgbutton" src="../editor/imgs/richtext/forecolor.gif" alt="Text Color" title="Text Color" />');
    //    headArray.push('<img click_action="hilitecolor" class="imgbutton" src="../editor/imgs/richtext/backcolor.gif" alt="Background Color" title="Background Color" />');
    headArray.push('<img click_action="insertorderedlist" class="imgbutton" src="../editor/imgs/richtext/orderedlist.gif" alt="有序列表" title="有序列表" />');
    headArray.push('<img click_action="insertunorderedlist" class="imgbutton" src="../editor/imgs/richtext/unorderedlist.gif" alt="无序列表" title="无序列表" />');
    headArray.push('<img click_action="outdent" class="imgbutton" src="../editor/imgs/richtext/outdent.gif" alt="减少缩进" title="减少缩进" />');
    headArray.push('<img click_action="indent" class="imgbutton" src="../editor/imgs/richtext/indent.gif" alt="增加缩进" title="增加缩进" />');
    headArray.push('<img click_action="inserthorizontalrule" class="imgbutton" src="../editor/imgs/richtext/inserthorizontalrule.gif" alt="插入水平尺" title="插入水平尺" />');
    headArray.push('<img click_action="mathlatex" class="imgbutton" style="width: 20px; height: 20px;" src="../editor/imgs/richtext/mathedit.png" alt="插入表达式" title="插入表达式" />');
    headArray.push('<img click_action="fullscreen" style="margin-left:4px" class="imgbutton" src="../editor/imgs/richtext/arrow_out.png" alt="" title="最大化" />');
    headArray.push('</div>');

    var editArray = new Array();

    editArray.push('<div>');
    var _h = this.edit_height != null ? ' style="height:' + this.edit_height + '" ' : '';
    editArray.push('<div><iframe class="aie_editor_iframe" ' + _h + ' onload="this.contentWindow.document.body.style.backgroundColor=\'#fff\';this.contentWindow.document.body.style.margin=\'0px\';this.contentWindow.document.designMode = \'on\';this.contentWindow.document.contentEditable=true;" edit_area="1" src="about:blank"></iframe></div>');
    editArray.push('<div class="aie_editor_mode"><center><span val="preview">预览</span>&nbsp;&nbsp;<span val="design">设计</span>&nbsp;&nbsp;<span val="latex">Latex</span>&nbsp;&nbsp;<span val="html">源码</span></center></div>');
    editArray.push('<div class="aie_editor_finish" title=""><span class="finish_action">保存</span><span class="cancel_action">取消</span></div>');
    editArray.push('</div>');

    if (this.jq_header_container != null) {
        this.jq_header_container.html(headArray.join(''));
        if (this.jq_edit_container != null) {
            this.jq_edit_container.append('<div class="emath_editor">' + editArray.join('') + '</div>');
            
        }
    } else {
        if (this.jq_edit_container != null) {
            this.jq_edit_container.html("").append('<div class="emath_editor">' + headArray.join('') + editArray.join('') + '</div>');
        }
    }

    this.jq_edit_container.find("div.emath_editor").show();

    if (!this.show_mode) {
        this.show_mode = "latex";
    }

    if (this.jq_edit_container != null) {
        this.flag = true;
        this.jq_edit_container.children().click(function (event) {
            event.stopPropagation();
        });
        var editor_win1 = this.jq_edit_container.find("iframe[edit_area=1]").get(0).contentWindow;
       
        //        editor_win1.document.designMode = "on";
        //        editor_win1.document.contentEditable = true;
        editor_win1.document.open();
        editor_win1.document.write('<html><head></head><body style="background-color:#fff;">' + (_emath_editor.edit_content != null ? _emath_editor.edit_content : "") + '</body></html>');
        editor_win1.document.close(); 
        var $spmode = this.jq_edit_container.find("div.aie_editor_mode span");
        $spmode.filter("[val='" + _emath_editor.show_mode + "']").css("background-color", "gray").css("color", "#fff");
        $spmode.click(function (event) {
            
            $spmode.css("background-color", "").css("color", "");
            var $this = $(this);
            $this.css("background-color", "gray").css("color", "#fff");
            //_emath_editor.changeMode($this.text().toLowerCase());
            var $aie_editor_iframe = _emath_editor.jq_edit_container.find("iframe[edit_area=1]");
            var editor_win2 = $aie_editor_iframe.get(0).contentWindow;
            $aie_editor_iframe.show();

            switch ($this.attr("val")) {
                case "preview":
                    //                    $(editor_win2.document.body).find("img[src*='link_edit.png']").css("display","none")  --LY
                    $("#aie_editor_preview").show();
                    $aie_editor_iframe.hide();
                    //_emath_editor.jq_edit_container.find("iframe[edit_area=1]").get(0).contentWindow.document.designMode = "off";
                    if (_emath_editor.show_mode != "preview") {
                        var pheight = ("height:" + ($aie_editor_iframe.height() - 8) + "px;"); //$("div[disabledAll='1']").length != 0 ? ("height:" + $aie_editor_iframe.height() + "px;") : ("height:" + _emath_editor.edit_height + ";");
                        //alert(pheight)
                        switch (_emath_editor.show_mode) {
                            case "design":
                                var htmlStr = $(editor_win2.document.body).html();
                                htmlStr = htmlStr.replace(/\\\$/gi, "&#36;");

                                if ($("#aie_editor_preview").length == 0) {
                                    $('<div id="aie_editor_preview" style="border:1px solid #adc3e8;overflow:auto;padding:5px; ' + pheight + ' ">' + htmlStr + '</div>').insertAfter($aie_editor_iframe);
                                } else {
                                    $("#aie_editor_preview").css("height", ($aie_editor_iframe.height() - 8) + "px").html(htmlStr);
                                }
                                _emath_editor.show_mode = "design";
                                break;
                            case "latex":
                                var htmlStr = $(editor_win2.document.body).html();
                                htmlStr = htmlStr.replace(/\\\$/gi, "&#36;");
                                //$(editor_win2.document.body).html(_emath_editor.strToImg(htmlStr));
                                if ($("#aie_editor_preview").length == 0) {
                                    $('<div id="aie_editor_preview" style="border:1px solid #adc3e8;overflow:auto;padding:5px; ' + pheight + ' ">' + _emath_editor.strToImg(htmlStr) + '</div>').insertAfter($aie_editor_iframe);
                                } else {
                                    $("#aie_editor_preview").css("height", ($aie_editor_iframe.height() - 8) + "px").html(_emath_editor.strToImg(htmlStr));
                                }
                                _emath_editor.show_mode = "latex";
                                break;
                            case "html":
                                var htmlText = $(editor_win2.document.body).text();
                                var patrn = /\\\$/gi;
                                if (patrn.exec(htmlText)) {
                                    htmlText = htmlText.replace(/\\\$/gi, "&#92;&#36;")
                                    htmlText = htmlText.replace(/\$/gi, "&#36;");
                                } else {
                                    htmlText = htmlText.replace(/\\\$/gi, "&#36;");
                                }
                                //$(editor_win2.document.body).html(_emath_editor.strToImg(htmlText));
                                if ($("#aie_editor_preview").length == 0) {
                                    $('<div id="aie_editor_preview" style="border:1px solid #adc3e8;overflow:auto;padding:5px; ' + pheight + ' ">' + _emath_editor.strToImg(htmlText) + '</div>').insertAfter($aie_editor_iframe);
                                } else {
                                    $("#aie_editor_preview").css("height", ($aie_editor_iframe.height() - 8) + "px").html(_emath_editor.strToImg(htmlText));
                                }
                                _emath_editor.show_mode = "html";
                                break;
                        }
                        $("#aie_editor_preview").find("img[src*='link_edit.png']").css("display", "none")
                    }
                    break;
                case "design":
                    //                    $(editor_win2.document.body).find("img[src*='link_edit.png']").css("display","");
                    $("#aie_editor_preview").hide();
                    //_emath_editor.jq_edit_container.find("iframe[edit_area=1]").get(0).contentWindow.document.designMode = "off";

                    if (_emath_editor.show_mode != "design") {

                        switch (_emath_editor.show_mode) {

                            case "latex":
                                var htmlStr = $(editor_win2.document.body).html();
                                htmlStr = htmlStr.replace(/\\\$/gi, "&#36;");
                                $(editor_win2.document.body).html(_emath_editor.strToImg(htmlStr));
                                //                                if ($("#aie_editor_preview").length == 0) {
                                //                                    $('<div id="aie_editor_preview" style="padding:5px;">' + _emath_editor.strToImg(htmlStr) + '</div>').insertAfter($aie_editor_iframe);
                                //                                } else {
                                //                                    $("#aie_editor_preview").html(_emath_editor.strToImg(htmlStr));
                                //                                }
                                break;
                            case "html":
                                var htmlText = $(editor_win2.document.body).text();
                                var patrn = /\\\$/gi;
                                if (patrn.exec(htmlText)) {
                                    htmlText = htmlText.replace(/\\\$/gi, "&#92;&#36;")
                                    htmlText = htmlText.replace(/\$/gi, "&#36;");
                                } else {
                                    htmlText = htmlText.replace(/\\\$/gi, "&#36;");
                                }
                                $(editor_win2.document.body).html(_emath_editor.strToImg(htmlText));
                                //                                if ($("#aie_editor_preview").length == 0) {
                                //                                    $('<div id="aie_editor_preview" style="padding:5px;">' + _emath_editor.strToImg(htmlText) + '</div>').insertAfter($aie_editor_iframe);
                                //                                } else {
                                //                                    $("#aie_editor_preview").html(_emath_editor.strToImg(htmlText));
                                //                                }
                                break;
                        }
                        _emath_editor.show_mode = "design";
                        //setModeChangeStyle("span_Design", "span_Html", "span_Latex");
                    }
                    break;
                case "latex":
                    //                    $(editor_win2.document.body).find("img[src*='link_edit.png']").css("display","");
                    $("#aie_editor_preview").hide();
                    //                    _emath_editor.jq_edit_container.find("iframe[edit_area=1]").get(0).contentWindow.document.designMode = "on";
                    if (_emath_editor.show_mode != "latex") {
                        switch (_emath_editor.show_mode) {

                            case "design":

                                var htmlStr = $(editor_win2.document.body).html();
                                var patrn = /\\\$/gi;
                                if (patrn.exec(htmlStr)) {
                                    htmlStr = htmlStr.replace(/\\\$/gi, "&#92;&#36;")
                                    htmlStr = htmlStr.replace(/\$/gi, "&#36;");
                                } else {
                                    htmlStr = htmlStr.replace(/\$/gi, "&#92;&#36;");
                                }
                                $(editor_win2.document.body).html(_emath_editor.imgToStr(htmlStr));
                                break;
                            case "html":
                                var htmlText = $(editor_win2.document.body).text();
                                //htmlText = htmlText.replace(/\$/gi, "&#36;");
                                htmlText = htmlText.replace(/&#36;/gi, "&#92;&#36;")
                                $(editor_win2.document.body).html(_emath_editor.imgToStr(htmlText));

                                break;
                        }
                        _emath_editor.show_mode = "latex";
                        //setModeChangeStyle("span_Latex", "span_Html", "span_Design");
                    }
                    break;
                case "html":
                    //                    $(editor_win2.document.body).find("img[src*='link_edit.png']").css("display","none");
                    $("#aie_editor_preview").hide();
                    //                    _emath_editor.jq_edit_container.find("iframe[edit_area=1]").get(0).contentWindow.document.designMode = "on";
                    if (_emath_editor.show_mode != "html") {
                        switch (_emath_editor.show_mode) {
                            case "design":
                                var htmlStr = $(editor_win2.document.body).html();
                                var patrn = /\\\$/gi;
                                if (patrn.exec(htmlStr)) {
                                    htmlStr = _emath_editor.strToImg(htmlStr.replace(/\\\$/gi, "&#36;"));
                                } else {
                                    htmlStr = htmlStr.replace(/\$/gi, "&#36;");
                                }
                                //$(editor_win2.document.body).text(htmlStr);
                                if (!$.browser.msie) {
                                    $(editor_win2.document.body).text(htmlStr);
                                } else {
                                    $(editor_win2.document.body).get(0).innerText = htmlStr;
                                }
                                break;
                            case "latex":
                                var htmlStr = $(editor_win2.document.body).html();
                                htmlStr = htmlStr.replace(/\\\$/gi, "&#36;")
                                //$(editor_win2.document.body).text(_emath_editor.strToImg(htmlStr));
                                if (!$.browser.msie) {
                                    $(editor_win2.document.body).text(_emath_editor.strToImg(htmlStr));
                                } else {
                                    $(editor_win2.document.body).get(0).innerText = _emath_editor.strToImg(htmlStr);
                                }
                                break;
                        }
                        _emath_editor.show_mode = "html";

                    }
                    break;
                default:
                    break;
            }
        });
    }
    var $sel = this.head_container != null ? this.jq_header_container.find("div.aie_editor_head select[select_action]") : this.jq_edit_container.find("div.aie_editor_head select[select_action]");
    $sel.change(function () {
        var $this = $(this);
        var v = $this.val();
        var cursel = this.selectedIndex;
        var editor_win1 = _emath_editor.jq_edit_container.find("iframe[edit_area=1]").get(0).contentWindow;
        editor_win1.focus();
        if (cursel != 0) {
            editor_win1.document.execCommand($this.attr("select_action"), false, v);
            this.selectedIndex = 0;
        }

    });

    var $img = this.head_container != null ? this.jq_header_container.find("div.aie_editor_head img[click_action]") : this.jq_edit_container.find("div.aie_editor_head img[click_action]");
    $img.click(function () {

        var v = $(this).attr("click_action");
        var editor_win = _emath_editor.jq_edit_container.find("iframe[edit_area=1]").get(0).contentWindow;
        editor_win.focus();
        var rng = !$.browser.msie ? editor_win.getSelection().getRangeAt(0) : editor_win.document.selection.createRange();
        
        switch (v) {
            case "editor_InsertLO":
                emath_getInsertPanel(_emath_editor.jq_edit_container.find("iframe[edit_area=1]").get(0).contentWindow, _emath_editor,rng);
                break;
            case "inservideo":

                break;
            //            case "delete":                                                                                                                                                                                             
            //                break;                                                                                                                                                                                             
            //            case "undo":                                                                                                                                                                                             
            //                break;                                                                                                                                                                                             
            //            case "redo":                                                                                                                                                                                             
            //                break;                                                                                                                                                                                             
            //            case "copy":                                                                                                                                                                                             
            //                break;                                                                                                                                                                                             
            //            case "paste":                                                                                                                                                                                             
            //                break;                                                                                                                                                                                             
            case "createlink":
                var szURL = prompt("Enter a URL:", "http://");
                if ((szURL != null) && (szURL != "")) {
                    editor_win.document.execCommand("CreateLink", false, szURL);
                }
                break;
            case "createtable":
                var rowstext = prompt("输入行数", "3");
                var colstext = prompt("输入列数", "3");
                var rows = parseInt(rowstext);
                var cols = parseInt(colstext);
                if ((rows > 0) && (cols > 0)) {
                    //var table = editor_win.document.createElement("table");
                    //table.setAttribute("border", "1");
                    //table.setAttribute("cellpadding", "2");
                    //table.setAttribute("cellspacing", "2");
                    //var tbody = editor_win.document.createElement("tbody");
                    //for (var i = 0; i < rows; i++) {
                    //    var tr = editor_win.document.createElement("tr");
                    //    for (var j = 0; j < cols; j++) {
                    //        var td = editor_win.document.createElement("td");
                    //        var br = editor_win.document.createElement("br");
                    //        td.appendChild(br);
                    //        tr.appendChild(td);
                    //    }
                    //    tbody.appendChild(tr);
                    //}
                    //table.appendChild(tbody);
                    var table = new Array();
                    table.push('<table cellpadding="2" cellspacing="2" border="1" style="border-collapse:collapse">');
                    for (var i = 0; i < rows; i++) {
                        table.push('<tr>');
                        for (var j = 0; j < cols; j++) {
                            table.push('<td><br/></td>');
                        }
                        table.push('</tr>');
                    }
                    table.push('</table>');
                    _emath_editor.pasteHTML(table.join(''));
                }
                break;
            case "createimage":

                break;
            case "mathlatex":
                //                if ($("#aie_editor_latexIframe").length == 0) {
                //                    $('<iframe id="aie_editor_latexIframe" frameborder="0" scrolling="no" style="position:absolute;top:0px;border: solid 1px gray;overflow: hidden;  filter: progid:DXImageTransform.Microsoft.Shadow(color=#999999,direction=135,strength=6);" src="mathedit.html" width="590" height="400"></iframe>').appendTo(document.body);
                //                } else {
                //                    $("#aie_editor_latexIframe").show();
                //                }
                //$.jBox('<iframe id="aie_editor_latexIframe" frameborder="0" scrolling="no" style="overflow: hidden;" src="mathedit.html" width="100%" height="100%"></iframe>', { title: "Latex Editor", width: 590, height: 400, buttons: {} });
                if ($.browser.msie) {
                    try {
                        _emath_editor.ie_book_mark = _emath_editor.jq_edit_container.find("iframe[edit_area=1]").get(0).contentWindow.document.selection.createRange().getBookmark();
                    } catch (ex) { }
                }


                emath_latexValue = "";
                var _ieRange = null;
                if ($.browser.msie) {
                    _ieRange = _emath_editor.jq_edit_container.find("iframe[edit_area=1]").get(0).contentWindow.document.selection.createRange();
                    if (_ieRange.length != undefined) {
                        emath_latexValue = _ieRange.item("").src.substring(_ieRange.item("").src.lastIndexOf("?") + 1);
                    }
                } else {
                    var _src = $("<span></span>").append($(_emath_editor.jq_edit_container.find("iframe[edit_area=1]").get(0).contentWindow.getSelection().getRangeAt(0).cloneContents())).find("img").attr("src");
                    emath_latexValue = _src && _src != "" ? _src.substring(_src.lastIndexOf("?") + 1) : "";
                }

                /*
                $.jBox('<iframe jbox="false" id="aie_editor_latexIframe" frameborder="0" scrolling="no" style="overflow: hidden;" src="../editor/mathedit.html" width="100%" height="100%"></iframe>', { id: "jbox_aie_editor_latexIframe", title: "Latex Editor", width: 590, height: 400, buttons: { "Insert Expression": true },
                submit: function (v, h, f) {

                if ($.browser.msie) {
                if (emath_latexValue == "") {
                if (_emath_editor.ie_book_mark) {
                var _aie_editor_range = _emath_editor.jq_edit_container.find("iframe[edit_area=1]").get(0).contentWindow.document.body.createTextRange();
                _aie_editor_range.moveToBookmark(_emath_editor.ie_book_mark);
                _aie_editor_range.select();
                _emath_editor.ie_book_mark = null;
                delete _emath_editor["ie_book_mark"];
                }
                _emath_editor.pasteHTML('<img src="' + $("#aie_editor_latexIframe").get(0).contentWindow.document.getElementById("equationview").src + '" />');
                } else {
                _ieRange.item("").src = $("#aie_editor_latexIframe").get(0).contentWindow.document.getElementById("equationview").src;
                }
                } else {
                _emath_editor.pasteHTML('<img src="' + $("#aie_editor_latexIframe").get(0).contentWindow.document.getElementById("equationview").src + '" />');
                }
                return true;
                },
                loaded: function (h) {
                try {
                $("#aie_editor_latexIframe").get(0).contentWindow.document.getElementById("latex_formula").value = emath_latexValue;
                } catch (e) { }
                }
                });
                */
                var f_v = location.href.indexOf("www.aie100.com") != -1 ? "?str=" + Math.random() : "?str=" + Math.random() + "&fv=zx";
                $.jBox('<div style="height:400px;"><iframe jbox="false" id="aie_editor_latexIframe" frameborder="0" scrolling="no" style="overflow: hidden;" src="../editor/matheditor.htm' + f_v + '" width="100%" height="100%"></iframe></div>', { dragLimit: false, id: "jbox_aie_editor_latexIframe", title: "数学公式编辑器", width: 600, height: 472, buttons: { "插入数学公式": true },
                    submit: function (v, h, f) {

                        if ($.browser.msie) {
                            if (emath_latexValue == "") {
                                if (_emath_editor.ie_book_mark) {
                                    var _aie_editor_range = _emath_editor.jq_edit_container.find("iframe[edit_area=1]").get(0).contentWindow.document.body.createTextRange();
                                    _aie_editor_range.moveToBookmark(_emath_editor.ie_book_mark);
                                    _aie_editor_range.select();
                                    _emath_editor.ie_book_mark = null;
                                    delete _emath_editor["ie_book_mark"];
                                }
                                _emath_editor.pasteHTML('<img src="' + $("#aie_editor_latexIframe").get(0).contentWindow.getLatexValue() + '" />');
                            } else {
                                _ieRange.item("").src = $("#aie_editor_latexIframe").get(0).contentWindow.getLatexValue();
                            }
                        } else {
                            _emath_editor.pasteHTML('<img src="' + $("#aie_editor_latexIframe").get(0).contentWindow.getLatexValue() + '" />',rng);
                        }
                        return true;
                    }
                    //                    ,
                    //                    loaded: function (h) {
                    //                        //$("#aie_editor_latexIframe").get(0).contentWindow.document.getElementById("txtareaLatex").value = emath_latexValue;

                    //                        try {
                    //                        
                    //                            $("#aie_editor_latexIframe").get(0).contentWindow.setLatexValue(emath_latexValue);
                    //                        } catch (ex) { }
                    //                    }
                });
                $("#aie_editor_latexIframe").parent().css("overflow","hidden");
                break;
            case "fullscreen":
                var ifr = _emath_editor.jq_edit_container.find("iframe[edit_area=1]");

                if (_emath_editor.jq_edit_container.find("div.emath_editor").attr("fullFlag") == "1") {
                    $("div[disabledAll='1']").remove();
                    _emath_editor.jq_edit_container.find("div.emath_editor").attr("fullFlag", "0").css({ "z-index": "", "position": "", "left": "", "top": "", "width": "" });
                    if ($("#aie_editor_preview").is(":visible")) {
                        $("div.aie_editor_mode span[val='preview']").trigger("click");
                    }
                    ifr.css("height", _emath_editor.edit_height);
                    $("#aie_editor_preview").css("height", ifr.height() + "px");
                    $(this).attr("title", "最大化").attr("src", "../editor/imgs/richtext/arrow_out.png");
                } else {
                    $("#aie_editor_preview").css("height", ifr.height() + "px");
                    $('<div disabledAll="1" onclick="editor_stopPropagation(event)" style="position:fixed;width:100%;height:100%;background-color:#fff;left:0px;top:0px;z-index:99998"></div>').insertAfter(_emath_editor.jq_edit_container.find("div.emath_editor"));
                    _emath_editor.jq_edit_container.find("div.emath_editor").attr("fullFlag", "1").css({ "z-index": "99999", "position": "fixed", "left": "0px", "top": "0px", "width": "100%" });
                    $(this).attr("title", "还原窗口").attr("src", "../editor/imgs/richtext/arrow_in.png");
                    ifr.css("height", ($(window).height() - 70) + "px");
                    $("#aie_editor_preview").css("height", ifr.height() + "px");
                }


                break;
            //            case "bold":                                                                                                                                                                                            
            //                break;                                                                                                                                                                                            
            //            case "italic":                                                                                                                                                                                            
            //                break;                                                                                                                                                                                            
            //            case "underline":                                                                                                                                                                                            
            //                break;                                                                                                                                                                                            
            case "insertstraightline":

                break;
            case "insertordernumber":

                break;
            case "resetordernumber":

                break;
            //            case "justifyleft":                                                                                                                                                                                             
            //                break;                                                                                                                                                                                             
            //            case "justifycenter":                                                                                                                                                                                             
            //                break;                                                                                                                                                                                             
            //            case "justifyright":                                                                                                                                                                                             
            //                break;                                                                                                                                                                                             
            //            case "strikethrough":                                                                                                                                                                                             
            //                break;                                                                                                                                                                                             
            //            case "subscript":                                                                                                                                                                                             
            //                break;                                                                                                                                                                                             
            //            case "superscript":                                                                                                                                                                                             
            //                break;                                                                                                                                                                                             
            //            case "cut":                                                                                                                                                                                             
            //                break;                                                                                                                                                                                             
            case "forecolor":

                break;
            case "hilitecolor":

                break;
            //            case "insertorderedlist":                                                                                                                                                                                             
            //                break;                                                                                                                                                                                             
            //            case "insertunorderedlist":                                                                                                                                                                                             
            //                break;                                                                                                                                                                                             
            //            case "outdent":                                                                                                                                                                                             
            //                break;                                                                                                                                                                                             
            //            case "indent":                                                                                                                                                                                             
            //                break;                                                                                                                                                                                             
            //            case "inserthorizontalrule":                                                                                                                                                                          
            //                break;                                                                                                                                                                          
            default:
                editor_win.document.execCommand(v, false, null);

        }
    });

    if (this.upload_path != null) {
        $("#editor_spUploadImage,#editor_spUploadFile").css("display", "inline-block");
        this.uploadify();
    } else {
        $("#editor_spUploadImage,#editor_spUploadFile").css("display", "none");
    }

    if (typeof questionManageFlag != "undefined" && questionManageFlag) {
        setTimeout(function () {
            $(_emath_editor.jq_edit_container.find("iframe[edit_area=1]").get(0).contentWindow.document.body).attr('onpaste', 'window.clipboardData.setData(\'Text\', window.clipboardData.getData(\'Text\'))')
            $(_emath_editor.jq_edit_container.find("iframe[edit_area=1]").get(0).contentWindow.document.body).bind("paste", function () { 
                window.clipboardData.setData('Text', window.clipboardData.getData('Text'));
            });
        }, 0);
    }
   
    //setTimeout(function () {
    //    if (_emath_editor.show_mode != "preview" && _emath_editor.show_mode != "html") {
    //        $(_emath_editor.jq_edit_container.find("iframe[edit_area=1]").get(0).contentWindow.document.body).find("img[src*='link_edit.png']").css("display", "");
    //    }
    //}, 0);
}

emath_editor.prototype.jsUploadImage = function (selbookId) {
    if (!selbookId) {
        selbookId = "-1";
    }
    var $editor_body = $(this.jq_edit_container.find("iframe[edit_area=1]").get(0).contentWindow.document.body);
    if ($editor_body.attr("pasteflag") == "1") {
        return;
    }
    this.ActivexUrl = (function () {
        if (location.href.toLowerCase().indexOf("www.aie100.com") != -1) {
            return "http://www.aie100.com/UploadImage.aspx";
        } else {
            //return "http://localhost:5072/AcephericsClient/UploadImage.aspx";
            return "http://localhost:32480/UploadImage.aspx";
            //return "http://192.168.0.110/UploadImage.aspx";
        }
    })();

    this.oActiveX = (function () {
        var $activeX = $('object.upload_activex');
        if ($activeX.length == 0) {
            $(document.body).append('<object style="display: none" class="upload_activex" classid="clsid:3d0d6540-ca10-3863-b94d-3c616fda7b38"></object>');
            $activeX = $('object.upload_activex');
        }
        var oActiveX = $activeX.get(0);
        if (typeof oActiveX.isActive == "undefined") {
            if ($('div.no_upload_activex').length == 0) {
                $(document.body).append('<div class="no_upload_activex" style="font-size: 13px; padding: 5px; background-color: #f2f1f1; border-top: 1px solid gray; position: fixed; bottom: 0; left: 0; width: 100%; overflow: hidden; z-index: 1000;">' +
                           '未安装“图片自动上传插件”，或此插件运行不正常（未在IE下使用），安装成功后请刷新页面。<a href="../Uploads/aie插件.rar" target="_blank">点此下载该插件</a></div>');
            }
        } else {
            return oActiveX;
        }
        return null;
    })();

    if (this.oActiveX == null) {
        return;
    }

    var o = this;
    if ($editor_body.attr("pasteflag") != "1") {
        $editor_body.attr("pasteflag", "1");
        $(o.jq_edit_container.find("iframe[edit_area=1]").get(0).contentWindow.document.body).bind("paste", function () {
            var str =o.oActiveX.getClipboardHtmlData();
            //str = str.replace(/<\!\[if \!vml\]>/gi, "").replace(/\<\!\[endif\]>/gi, "");
            if ($.trim(str) == "") { return; }
            var boo = true;
            var _s = str;
            var strArr = /<img[\s|\S]{0,}>/gi.exec(_s);
            var imgCount = 0;
            try {
                if (strArr != null) {
                    $.jBox.tip("图片正在自动上传，请稍等片刻...", "loading");
                }
                while (strArr != null) {
                    
                    var imgstr = strArr[0].substring(0, strArr[0].indexOf(">") + 1);
                    var $img = $(imgstr);
                    var sbookId = selbookId;
                    if (sbookId == "-1") {
                        sbookId = "undefined";
                    }

                    if ($img.attr("src").indexOf(sbookId) == -1) {
                        var fname = o.oActiveX.jsUploadImage(o.ActivexUrl, $img.attr("src").replace(/file:\/\/\//gi, ""), sbookId, null);
                        imgCount++;
                        if (fname == null) {
                            boo = false;
                        } else {
                            $img.attr("src", "../Uploads/CMS/" + sbookId + "/Test/" + fname);
                        }
                    }
                    
                    str = str.replace(imgstr, $("<span></span>").append($img).html());
                    _s = _s.substring(strArr.index + imgstr.length);
                    strArr = /<img[\s|\S]{0,}>/gi.exec(_s);
                }
            } catch (e) {
                //alert(e.message);
            }

            var i1 = str.toLowerCase().indexOf("<body");
            var i2 = str.toLowerCase().lastIndexOf("</body");
            var chtml = (i1 != -1 && i2 != -1) ? str.substr(i1 + str.substr(i1).indexOf(">") + 1, str.length - (i1 + str.substr(i1).indexOf(">") + 1) - str.substr(i2).length).replace(/<!--StartFragment-->|<!--EndFragment-->/gi, "") : str;
            //chtml = chtml.replace(/<\!\[if \!vml\]>/gi, "").replace(/\<\!\[endif\]>/gi, "");
            if (!boo) {
                $.jBox.tip("图片自动上传失败！", "error");

            } else {
                
                var intervaltime = setTimeout(function () {
                        if (imgCount != 0) {
                            $.jBox.tip("图片已上传成功！", "success");
                        } else {
                            $.jBox.closeTip();
                        }
                        chtml = chtml.replace(/<\!\[if \!vml\]>/gi, "").replace(/\<\!\[endif\]>/gi, "");
                        var $chtml = $("<span>" + chtml + "</span>");
                        $('<span>@[!br!]@</span>').insertAfter($chtml.find("br,table,p,div,h1,h2,h3,h4"));
                        $chtml.find("img").each(function () {
                            var $img = $(this);
                            $img.replaceWith('<span>@[!img src="' + $img.attr("src") + '" /!]@</span>');
                        });

                        o.pasteHTML($chtml.text().replace(/@\[!/gi, "<").replace(/\!]@/gi, ">"));
                    
                }, 500)
            }

            return false;
            

        });

    }
}
emath_editor.prototype.uploadify = function () {

    var _emath_editor = this;
    try {
        if ($("#editor_spUploadImage").is(":visible") || $("#editor_spUploadImage").css("display") == "inline-block") {
            //$("#editor_uploadifyImageUploader").remove();
            swfobject.removeSWF("editor_uploadifyImageUploader");

            $("#editor_uploadifyImage").unbind().uploadify({
                'uploader': '../editor/flash/uploadify.swf',
                'script': '../Upload.aspx',
                'cancelImg': '../editor/imgs/richtext/close.gif',
                'folder': _emath_editor.upload_path,
                'queueID': 'editor_fileQueue',
                'buttonImg': '../editor/imgs/richtext/image_upload.gif',
                'buttonText': 'Upload',
                //        'hideButton ': true,
                //        'rollover':true,
                'width': '15',
                'height': '15',
                'wmode': 'transparent',
                'auto': true,
                'multi': false,
                'fileExt': '*.jpg;*.jpeg;*.gif;*.png',
                'fileDesc': '*.jpg;*.jpeg;*.gif;*.png',
                'onOpen': function (event, ID, fileObj) {
                    $.jBox.tip('正在上传 ' + fileObj.name + ' ...', 'loading');
                },
                //         'onInit':function(){},
                'onSelect': function (event, queueID, fileObj) {
                    if (_emath_editor.upload_path == null) {
                        $('#editor_uploadifyImage').uploadifySettings('folder', 'ERROR:/');
                        $.jBox.tip("图片上传失败", "error");
                    } else if (fileObj.size > 1024000) {
                        $('#editor_uploadifyImage').uploadifySettings('folder', 'ERROR:/');
                        $.jBox.tip("图片上传失败", "error");
                    } else {
                        $('#editor_uploadifyImage').uploadifySettings('folder', _emath_editor.upload_path + '/' + 'images');
                    }
                },
                'onSWFReady': function () {
                    $("#editor_uploadifyImageUploader").attr("title", "上传图片").css("z-index", "0").css("vertical-align", "middle");
                },
                'onComplete': function (event, queueID, fileObj, response, data) {

                    response = $.trim(response);
                    if (response.charAt(0) == "1") {
                        var str1 = response.substring(2);
                        var fileName = str1.substring(0, str1.indexOf("]"));
                        _emath_editor.pasteHTML('<img src="' + _emath_editor.upload_path + '/images/' + fileName + '" />');
                        $.jBox.tip("图片已成功上传", "success");
                    } else {
                        $.jBox.tip("图片上传失败", "error");
                    }
                },
                'onError': function (event, queueId, fileObj, errorObj) {
                    $.jBox.tip("图片上传失败", "error");
                }
            });
        }

        if ($("#editor_spUploadFile").is(":visible") || $("#editor_spUploadFile").css("display") == "inline-block") {
            // $("#editor_uploadifyFileUploader").remove();
            swfobject.removeSWF("editor_uploadifyFileUploader");
            $("#editor_uploadifyFile").unbind().uploadify({
                'uploader': '../editor/flash/uploadify.swf',
                'script': '../Upload.aspx',
                'cancelImg': '../editor/imgs/richtext/close.gif',
                'folder': _emath_editor.upload_path,
                'queueID': 'editor_imgQueue',
                'buttonImg': '../editor/imgs/richtext/file_upload.gif',
                'buttonText': 'Upload',
  
                //'onCheck': function () {},
                //        'hideButton ': true,
                //        'rollover':true,
                'width': '9',
                'height': '16',
                'wmode': 'transparent',
                'auto': true,
                'multi': false,
                'onOpen': function (event, ID, fileObj) {
                    $.jBox.tip('正在上传 ' + fileObj.name + ' ...', 'loading');

                },
                //            'onInit':function(){},
                'onSelect': function (event, queueID, fileObj) {
                    if (_emath_editor.upload_path == null) {
                        $('#editor_uploadifyFile').uploadifySettings('folder', 'ERROR:/');
                        $.jBox.tip("上传文件失败", "error");
                    } else if (fileObj.size > 2048000) {
                        $('#editor_uploadifyFile').uploadifySettings('folder', 'ERROR:/');
                        $.jBox.tip("上传文件失败", "error");
                    } else {
                        $('#editor_uploadifyFile').uploadifySettings('folder', _emath_editor.upload_path + '/' + 'download');
                    }
                },
                'onSWFReady': function () {
                    $("#editor_uploadifyFileUploader").attr("title", "Upload File").css("z-index", "0").css("vertical-align", "middle");
                },
                'onComplete': function (event, queueID, fileObj, response, data) {
                    response = $.trim(response);
                    if (response.charAt(0) == "1") {
                        var str1 = response.substring(2);
                        var fileName = str1.substring(0, str1.indexOf("]"));
                        _emath_editor.pasteHTML('<a href="' + _emath_editor.upload_path + '/download/' + fileName + '">' + fileObj.name + '</a>');
                        $.jBox.tip("文件已成功上传", "success");
                    } else {
                        $.jBox.tip("文件上传失败", "error");
                    }
                },
                'onError': function (event, queueId, fileObj, errorObj) {
                    $.jBox.tip("文件上传失败", "error");
                }
            });
        }
    } catch (ex) {
        alert(ex);
    }
}

emath_editor.prototype.html = function (html) {
    try {
        if (this.jq_edit_container.find("iframe[edit_area=1]").length == 0) {
            return "";
        }

        if (html != null) {
            $(this.jq_edit_container.find("iframe[edit_area=1]").get(0).contentWindow.document.body).html(html);
            //$(this.editor_win.document.body).html(html);
        } else {
            var htmlStr = $(this.jq_edit_container.find("iframe[edit_area=1]").get(0).contentWindow.document.body).html();

            if (this.show_mode == "latex") {
                var patrn = /\\\$/gi;
                if (patrn.exec(htmlStr)) {
                    htmlStr = this.strToImg(htmlStr.replace(/\\\$/gi, "&#36;"));
                }
            }
            return htmlStr;

            //return this.strToImg(htmlStr);
            //return $(this.editor_win.document.body).html();
        }
    } catch (e) { }
}

emath_editor.prototype.text = function (txt) {
    try {
        if (this.jq_edit_container.find("iframe[edit_area=1]").length == 0) {
            return "";
        }
        if (txt != null) {
            $(this.jq_edit_container.find("iframe[edit_area=1]").get(0).contentWindow.document.body).text(txt);
            //$(this.editor_win.document.body).text(txt);
        } else {
            return $(this.jq_edit_container.find("iframe[edit_area=1]").get(0).contentWindow.document.body).text();
            //return $(this.editor_win.document.body).text();
        }
    } catch (e) { }
}

emath_editor.prototype.isVisible = function () {
    if (this.jq_temp_container.find("div.emath_editor").length == 0 && this.jq_edit_container && this.jq_edit_container.find("div.emath_editor").length != 0) {
        return true;
    }
    return false;
}

emath_editor.prototype.hide = function () {
    try {

        if (this.jq_temp_container.find("div.emath_editor").length == 0 && this.jq_edit_container && this.jq_edit_container.find("div.emath_editor").length != 0) {
            var html = "";
            if (this.show_mode == "html") {
                html = this.text();
            } else if (this.show_mode == "latex") {
                html = this.strToImg(this.html().replace(/\\\$/gi, "&#36;"));
            }
            else {
                html = this.html();
            }

            this.jq_temp_container.append(this.jq_edit_container.find("div.emath_editor"));
            this.html("");
            this.jq_edit_container.html((html != "" ? html : "&nbsp;"));
            this.jq_edit_container.find("img[src*='link_edit.png']").css("display", "none");
        }
    } catch (e) { }
}

emath_editor.prototype.dispose = function () {
    try {
        // _emath_editor.editor_win = null;
        this.jq_header_container.html("")
        this.jq_edit_container.html(_emath_editor.html());
        this.jq_edit_container.find("img[src*='link_edit.png']").css("display", "none");
        //this=undefined;
    } catch (e) { }
}

editor_stopPropagation = function (evt) {
    try {
        if (window.event) {
            evt.cancelBubble = true;
        }
        else if (evt) {
            evt.stopPropagation();
        }
    } catch (e) { }
}

//将美元符号内的内容替换为数学公式
emath_editor.prototype.strToImg = function (str) {
    var strResult = "";
    if (str != null && str != "") {

        var strs = str.split("\$");
        if (strs != null && strs.length > 0) {
            for (var i = 0; i < strs.length; i++) {
                if ((i + 1) % 2 == 0) {
                    strResult = strResult + strs[i] + "'/>";
                } else {
                    if (i == strs.length - 1) {
                        strResult = strResult + strs[i] + "";
                    } else {
                        strResult = strResult + strs[i] + "<IMG style='vertical-align:middle;' src='" + this.ematx_url + "?";
                    }
                }
            }
        } else {
            strResult = str;
        }
    } else {
        strResult = str;
    }
    return strResult;
}


//将公式图片转换为字符串表达式
emath_editor.prototype.imgToStr = function (htmlStr) {
    var $temDIV = $("<div>" + htmlStr + "</div>");
    var tempDivHtml = $temDIV.html();

    var imgs = $temDIV.get(0).getElementsByTagName("IMG");
    for (var i = 0; i < imgs.length; i++) {
        var $imgSrc = $(imgs[i]).attr("src");
        if ($imgSrc.indexOf("cgi-bin/ematx.cgi?") != -1) {//|| imgs[i].src.indexOf("gif.latex?") != -1
            tempDivHtml = tempDivHtml.replace(imgs[i].outerHTML, "$" + $imgSrc.substring($imgSrc.indexOf("?") + 1) + "$");
        }
    }
    return tempDivHtml;
}

emath_editor.prototype.pasteHTML = function (html,rng) {
    //var editor_win = this.jq_edit_container.find("iframe[edit_area=1]").get(0).contentWindow;
    //editor_win.focus();
    //if ($.browser.msie) {
    //    editor_win.document.selection.createRange().pasteHTML(html);
    //} else {
    //    editor_win.document.execCommand('InsertHtml', '', html);
    //}
    
    var editor_win = this.jq_edit_container.find("iframe[edit_area=1]").get(0).contentWindow;
    editor_win.focus();
    if ($.browser.msie) {
        editor_win.document.selection.createRange().pasteHTML(html);
    } else {
        
        //editor_win.document.execCommand('InsertHtml', '', html);
        var range = rng != null ? rng : editor_win.getSelection().getRangeAt(0);
        var doc = editor_win.document, frag = doc.createDocumentFragment();
        frag.appendChild($("<span>"+html+"</span>").get(0));
        range.deleteContents();
        range.insertNode(frag);
        range.collapse(false);
        //self.select(false);
    }
}


emath_editor.prototype.toJQueryObject = function (container) {
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
