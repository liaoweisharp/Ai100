/// <reference path="jquery-1.6.1.min.js?ver=Acepherics120317" />

//调用webservice方法
//var $ws_tpath = "WebService/";
var $fun_params = new Array();
var $_DivReloginBox = null;

function $excuteWS2(method, data, beforeSendFun, successFun, errorFun, completeFun, context) {
    if (method.indexOf(".") == -1) {
        alert("method name error.");
        return;
    }
    
    //jQuery.support.cors = true;

    var $fhLen = $getCharCount(method, "~");
    var $tstr = "";
    for (var i = 0; i < $fhLen; i++) {
        $tstr += "../";
    }
    var $tRootPath = (typeof window.$ws_tpath != "undefined" && window.$ws_tpath != null) ? window.$ws_tpath : "WebService/";
    window.$ws_tpath = null;

    var $url = $tstr + $tRootPath + method.replace(".", ".asmx/").replace(/~/g, "");

   // var $url = "http://192.168.0.110/" + method.replace(".", ".asmx/").replace(/~/g, "");// +"?jsoncallback=?";
    var $data = "";
    if (typeof data == "object") {
        removeJSONProperties(data);
        
        $data = $toJSON(data);
    } else if (typeof data == "string") {
        $data = data;
    }
    
    //  setTimeout(function () {
    $.ajax({
        type: "POST",
        contentType: "application/json",
        dataType: 'json',
        url: $url,
        data: $data,
        async: true,
        beforeSend: function (_xmlHttpRequest)
        {
            if (beforeSendFun != null)
            {
                beforeSendFun(_xmlHttpRequest);
            }
        },
        complete: function (_xmlHttpRequest, _strStatus)
        {
            if (completeFun != null)
            {
                completeFun(_xmlHttpRequest, _strStatus);
            }
        },
        timeout: function (result)
        {
        },
        global: function (result)
        {
        },
        success: function (result)
        {
            successFun(result.d, context);
        },
        error: function (error)
        {
            
           if ($.trim(error.responseText) == "")
            {
                //alert("error");
                return;
            }
            var to = eval('(' + error.responseText + ')');
            if (to.Message == "User_Session_End")
            {// || ($.trim(to.ExceptionType) == "" && to.Message.indexOf("error processing") != -1)
                $fun_params.push({ method: method, data: data, beforeSendFun: beforeSendFun, successFun: successFun, errorFun: errorFun, completeFun: completeFun, context: context });
                $createReLoginBoxControl();
                return;
            } else if ($.trim(to.ExceptionType) == "" && to.Message.indexOf("error processing") != -1)
            {
                return;
            }
            if (typeof errorFun == "undefined" || typeof errorFun != "function" || errorFun == null)
            {

                alert(context + "@@@" + error.responseText);
            } else
            {
                errorFun(error, context);
            }
        }
    });
    //  },0);

}

function removeJSONProperties(data) {
    for (var key in data) {
        if (data[key] && typeof data[key].ExtensionData == "object") {
            delete data[key].ExtensionData;
       }
        if (data[key] && typeof data[key] == "object") {
           removeJSONProperties(data[key]);
       }
    }
}
//



function $excuteWS(method, data, successFun, errorFun, context) {

    $excuteWS2(method, data, null, successFun, errorFun, null, context);
}

//将对象转换为json字符串
function $toJSON(data) {
    
    if (typeof data == 'string') try { data = eval('(' + data + ')') } catch (e) { return "" };
    var draw = [], last = false, isLast = true, indent = 0;
    function notify(name, value, isLast, formObj) {
        if (name != "__type") {
            if (value && value.constructor == Array) {
                draw.push((formObj ? ('"' + name + '":') : '') + '[');
                for (var i = 0; i < value.length; i++) notify(i, value[i], i == value.length - 1, false);
                draw.push(']' + (isLast ? '' : (',')));
            } else if (value && typeof value == 'object') {
                draw.push((formObj ? ('"' + name + '":') : '') + '{');
                var len = 0, i = 0;
                for (var key in value) len++;
                for (var key in value) notify(key, value[key], ++i == len, true);
                draw.push('}' + (isLast ? '' : (',')));
            } else {
                if (typeof value == 'string') value = '"' + value.replace(/\\/gi, '\\\\').replace(/\"/gi, '\\"') + '"';
                draw.push((formObj ? ('"' + name + '":') : '') + value + (isLast ? '' : ','));
            };
        }
    };
    notify('', data, isLast, false);
    return draw.join('');
};

function $getCharCount(str1, str2) {
    if (str1 == null) {
        return null;
    }
    if (str1.indexOf(str2) == -1) { return 0; }
    var r = new RegExp('\\' + str2, "gi");
    return str1.match(r).length;
}
