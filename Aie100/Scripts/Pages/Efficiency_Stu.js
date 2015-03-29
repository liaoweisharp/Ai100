$(function () {
    var args = getUrlParms();
   
    window.sectionId = args["sectionId"];


    U(function () {
        
  
        $excuteWS("~ReportsWS.getEfficiencyEvaluations", { sectionId: get_sectionId(), userExtend: get_simpleUser() }, function (result) {
            
            var effArr = result[0];
            var users = result[1];
            var objs=[];
            for (var i = 0; i < users.length; i++) {
                var userId = users[i].id;
                var _obj= effArr.firstOrDefault("userId", userId);
                if (_obj) {
                    var jsonObj = $.extend(true, {}, _obj);
                    jsonObj["fullName"] = users[i].fullName;
                    objs.push(jsonObj);
                }
            }
            var str = "";
            if (objs.length == 0) {
                str = "<div style='padding:20px'>没有学生数据</div>";
                $("#content").html(str);
            }
            else {
                window.users = json_body(objs);
                 
                reOrder("studyEffice");
            }
            //
        }, null, null);

    });
})

function json_body(users){
    var arr=[];
    var num = 0;
    
    users.each(function (user) {
        num++;
        var name = user.fullName;
        var compRate = user.compRate;
        var compScore = user.compScore;
        var compEffice = user.compEffice;
        var knowledgeLevel = user.knowledgeLevel;
        var studyEffice = user.studyEffice;
        var userId = user.userId;
        if (compEffice != null && isNaN(compEffice) == false) {
            compEffice = Math_Round(compEffice, 2);
        }
        if (compRate != null && isNaN(compRate) == false) {
            compRate = Math_Round(compRate, 2);
        }
        if (compScore != null && isNaN(compScore) == false) {
            compScore = Math_Round(compScore, 2);
        }
        if (knowledgeLevel != null && isNaN(knowledgeLevel) == false) {
            knowledgeLevel = Math_Round(knowledgeLevel, 2);
        }
        if (studyEffice != null && isNaN(studyEffice) == false) {
            studyEffice = Math_Round(studyEffice, 2);
        }



       
        arr.push({userId:userId, name: name, compRate: compRate, compScore: compScore, compEffice: compEffice, knowledgeLevel: knowledgeLevel, studyEffice: studyEffice });
    })
    return arr;
}
window.orderInfo=null;
function _getOrderImg(orderName){
    if(!window.orderInfo) return "";
    if(window.orderInfo.orderName!=orderName){
        return "";
    }
    else{
        if(window.orderInfo.order=="desc"){
            return "&nbsp;<img src='Images/bullet_down2.png' title='降序' align='absmiddle'/>";
        }
        else if(window.orderInfo.order=="asc"){
            return "&nbsp;<img src='Images/bullet_up2.png' title='升序'  align='absmiddle'/>";
        }
    }
}
function html_body(data){
    if(!data || data.length==0) return "";
    var simpleUser= get_simpleUser();
    var roleId=simpleUser.roleId;
   
    var str = [];

    str.push("<table class='tb_rp'>");
    str.push("<tr class='header'>");
    str.push("<td class='td1'>序号</td>");
    str.push(String.format("<td>学生</td>", "name", _getOrderImg("name")));
    str.push(String.format("<td>作业完成分</td>", "compRate", _getOrderImg("compRate")));
    str.push(String.format("<td>作业成绩分</td>", "compScore", _getOrderImg("compScore")));
    str.push(String.format("<td>作业效率分</td>", "compEffice", _getOrderImg("compEffice")));
    str.push(String.format("<td>知识掌握分</td>", "knowledgeLevel", _getOrderImg("knowledgeLevel")));
    str.push(String.format("<td>综合评估分</td>", "studyEffice", _getOrderImg("studyEffice")));

    str.push("</tr>");
    var num = 0;
   
    data.each(function (user) {
        num++;
        var userId = user.userId;
        if (simpleUser.userId == userId) {
            str.push("<tr class='row bg2'>");
        }
        else {
            str.push("<tr class='row'>");
        }
        if (num < 11) {
            str.push(String.format("<td class='bg3'>{0}</td>", num));
        }
        else {
            str.push(String.format("<td>{0}</td>", num));
        }
        if (roleId == "1" && num > 10 && simpleUser.userId != userId) {
            
            str.push(String.format("<td>{0}</td>", "***"));
        }
        else {
            str.push(String.format("<td>{0}</td>", user.name));
        }
        str.push(String.format("<td>{0}</td>", user.compRate));
        str.push(String.format("<td>{0}</td>", user.compScore));
        str.push(String.format("<td>{0}</td>", user.compEffice));
        str.push(String.format("<td>{0}</td>", user.knowledgeLevel));
        str.push(String.format("<td>{0}</td>", user.studyEffice));
        str.push("</tr>");
    })

    str.push("</table>");
    return str.join("");
}
function reOrder(orderName) {
    
    if (window.orderInfo == null) window.orderInfo = {};
    if (!window.orderInfo.order || window.orderInfo.order == "asc") {
        window.orderInfo.order = "desc";
        window.users.orderBy(orderName);
        window.users.reverse()
    }
    else {
        window.orderInfo.order = "asc";
        window.users.orderBy(orderName);
    }
    window.orderInfo.orderName = orderName;

    var str = html_body(window.users);
    $div2 = $("#content");
    $div2.html(str);
}