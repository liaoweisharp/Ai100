
//查看Sample Question
function onSampleQuestionClick(plSampleQuestion,itemId,itemNameId)
{
    var sql=String.format("../TestShow/TestContent.aspx?type=2&loId={3}&userId={0}&sectionId={1}&name={2}",getUserId(),getSectionId(),"Sample Questions for "+$get(itemNameId).innerHTML,itemId);
    isClickSampleQuestion=true;//用来判断是否打开学习资料
    window.open(sql);
//    if (window.navigator.userAgent.indexOf("MSIE")>=1)
//    {
//        $get('ifrSampelQuestion').Document.location.href=  "about:blank";
//    }
//    else if(window.navigator.userAgent.indexOf("Firefox")>=1)
//    {
//        $get('ifrSampelQuestion').contentDocument.location.href=  "about:blank";
//    }
//    $get('sampleQuestionHeader').innerHTML="Sample Questions for \""+$get(itemNameId).innerHTML+"\"";                               
//    $get('ifrSampelQuestion').src="../SharePage/SampleQuestion.aspx?loId="+itemId;
//    $get(plSampleQuestion).style.top=document.documentElement.scrollTop+100+"px";
//    $get(plSampleQuestion).style.left="25%";
//    $get(plSampleQuestion).style.display="block";
}

//得到SampleQuestion图标
function getSampleQuestionIMG(plSampleQuestion,flag,itemId,itemNameId)
{
    var exampleQuestionFlag=((Number)(flag)>0) ? "<a class='activeNode' href=\"javascript:onSampleQuestionClick('"+plSampleQuestion+"','"+itemId+"','"+itemNameId+"')\"><img src=\"../Images/relatedQuestion.gif\"  style=\"border-width: 0px;\" title=\"SampleQuestion\"/> ("+flag+")</a>" : "";
    return exampleQuestionFlag;
}

//根据参数信息返回一个flash的object标签
function getFlashObjectStr(url)
{
    var _src=url.indexOf("?")!=-1 ? url.substring(0,url.indexOf("?")) : url;
    var id_name=_src.indexOf("/")!=-1 ? _src.substring(_src.lastIndexOf("/")+1,_src.toLowerCase().lastIndexOf(".swf")) : _src.substring(0,_src.toLowerCase().lastIndexOf(".swf"));
    var flashStr='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" id="'+id_name+'"'+
                                    ' width="100%" height="100%" codebase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab">'+
                                    ' <param name="movie" value="'+_src+'" />'+
                                    ' <param name="quality" value="high" />'+
                                    ' <param name="bgcolor" value="#869ca7" />'+
                                    ' <param name="allowScriptAccess" value="sameDomain" />'+
                                    ' <param name="wmode" value="opaque" />'+
                                    ' <param id="paramValue" name="flashvars" value="'+url+'" />'+
                                    ' <embed id="embedSrc" src="'+url+'" quality="high" bgcolor="#869ca7" width="100%" height="100%"'+
                                        ' name="'+id_name+'" align="middle" play="true" loop="false" type="application/x-shockwave-flash"'+
                                        ' wmode="opaque" pluginspage="http://www.adobe.com/go/getflashplayer">'+'</embed></object>';
    return flashStr;
	                                
}
// 生成随机字符串
//参数l:生成字符串的位数
function  randomChars(l)  {
  var  x="0123456789qwertyuioplkjhgfdsazxcvbnm";
  var  tmp=new Sys.StringBuilder();
  for(var  i=0;i<l;i++)  {
  tmp.append(x.charAt(Math.ceil(Math.random()*100000000)%x.length));
  }
  return  tmp.toString();
}

function HISTORY_setOptionsForDDLStudentList(source)
{
    if((typeof source).toLowerCase()=="object" && typeof source.options!="undefined"){
        for(var i=0;i<source.options.length;i++)
        {
            $get("HISTORY_ddlStudentList").options[i] = new Option(source.options[i].text, source.options[i].value);
        }
    }else
    {
        if(source!=null){
            for(var j=1;j<source.length;j++)
            {
                $get("HISTORY_ddlStudentList").options[j] = new Option(source[j].UserName, source[j].UserId);
            }
        }
    }
}

function createCoverLayerHTML()
{
    return "<div id=\"divEnableOthers\" style=\"display:none;position:fixed;top:0px;left:0px;width:100%;height:100%;background-color:Gray;filter:alpha(opacity=30);-moz-opacity:0.3;opacity:0.3;z-index:10\"></div>";
}

/**
* 显示隐藏历史记录的弹出层
**/
function HISTORY_showDivHistory(showFlag)
{
   $get("divEnableOthers").style.display= $get("HISTORY_divHistory").style.display = showFlag ? "block" : "none";
}

/**
* 历史记录的加载图片
**/
function HISTORY_createHistoryLoadHTML()
{
    $get("HISTORY_divHistoryContent").innerHTML="<center><img alt=\"loading...\" src=\"../Images/ajax-loader_02.gif\" style=\"margin-top:15%;\"/></center>";
}

/**
* 创建查看历史记录的弹出层
**/
function HISTORY_createKPHistoryLayer(roleId)
{
    if($get("HISTORY_divHistory")!=null)
    {
       return;
    }
    var tempDIV=document.createElement("div");
    var divStrBuilder=new Sys.StringBuilder();
     divStrBuilder.append("<div id=\"HISTORY_divHistory\" style=\"display:none;position:fixed;top:15%;left:10%;width:80%;height:450px;border:solid 2px #BED7F5;padding:4px;z-index:102;background-color:#E8E8E8;filter: progid:DXImageTransform.Microsoft.Shadow(color=#999999,direction=135,strength=6);\">");
     divStrBuilder.append("<div style=\"padding-bottom:4px;\">");
     divStrBuilder.append("<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">");
     divStrBuilder.append("<tbody>");
     divStrBuilder.append("<tr>");
     divStrBuilder.append("<td style=\"width:25%\">");
     if(roleId=="0"){
         divStrBuilder.append("<select id=\"HISTORY_ddlStudentList\" onchange=\"HISTORY_onDdlStudentListChange(this)\">");
         divStrBuilder.append("<option value=\"-1\">所有学生</option>");
         divStrBuilder.append("</select>");
     }else{
        divStrBuilder.append("&nbsp;");
     }
     divStrBuilder.append("</td>");
     divStrBuilder.append("<td style=\"width:50%;font-weight:bold;text-align:center;\">");
     divStrBuilder.append("<div id=\"HISTORY_divKPTitle\">知识点</div>");
     divStrBuilder.append("</td>");
     divStrBuilder.append("<td style=\"text-align:right;width:25%\">");
     divStrBuilder.append("<img src=\"../Images/close.gif\" style=\"cursor:pointer;\" onclick=\"HISTORY_showDivHistory(false)\" />");
     divStrBuilder.append("</td>");
     divStrBuilder.append("</tr>");
     divStrBuilder.append("</tbody>");
     divStrBuilder.append("</table>");
     divStrBuilder.append("</div>");
     divStrBuilder.append("<div id=\"HISTORY_divHistoryContent\" style=\"border:solid 1px inset;height:422px;border-color:#BED7F5;background-color:White;cursor:text;overflow:auto\">");
     divStrBuilder.append("<center><img alt=\"加载中...\" src=\"../Images/ajax-loader_02.gif\" style=\"margin-top:15%;\"/></center>");
     divStrBuilder.append("</div>");
     divStrBuilder.append("</div>");
     divStrBuilder.append(createCoverLayerHTML());
     tempDIV.innerHTML=divStrBuilder.toString();
    document.body.appendChild(tempDIV);
}

/**
* 创建查看知识点的历史记录HTML
**/
function HISTORY_createKPHistoryHTML(result,roleId,title)
{
   var tableStrBuilder=new Sys.StringBuilder();
   tableStrBuilder.append("<div style=\"margin:0px;\">");
   tableStrBuilder.append("<table class=\"gridviewblue\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"padding:0px;margin:0px;\">");
   tableStrBuilder.append("<tbody>");
   tableStrBuilder.append("<tr class=\"titlerow\">");
   tableStrBuilder.append("<th style=\"text-align:center;\">&nbsp;否.&nbsp;</th>");
   if(roleId=="1")
   {
      tableStrBuilder.append("<th style=\"text-align:center;\">考试名</th>");
      tableStrBuilder.append("<th style=\"text-align:center;\">个人知道状态</th>");
   }
   tableStrBuilder.append("<th style=\"text-align:center;\">班级知识状态</th>");
   tableStrBuilder.append("<th style=\"text-align:center;\">题量</th>");
   tableStrBuilder.append("<th style=\"text-align:center;\">正确数</th>");
   tableStrBuilder.append("<th style=\"text-align:center;\">目标知识点的题数</th>");
   tableStrBuilder.append("<th style=\"text-align:center;\">目标知识点做正确了的题数</th>");
   tableStrBuilder.append("<th style=\"text-align:center;\">辅助知识点的题数</th>");
   tableStrBuilder.append("<th style=\"text-align:center;\">辅助知识点做正确了的题数</th>");
   tableStrBuilder.append("</tr>");
   tableStrBuilder.append("</tbody>");
   var emptyFlag=false;
   if(result!=null && result.length!=0)
   {
       for(var i=0;i<result.length;i++)
       {
            if(i%2==1)//奇数
            {
                tableStrBuilder.append("<tr class=\"evenrow\">");
            }
            else //偶数
            {
                 tableStrBuilder.append("<tr class=\"oddrow\">");
            }
           tableStrBuilder.append("<td style=\"text-align:center;\">"+(i+1)+"</td>");
           if(roleId=="1")
           {
               tableStrBuilder.append("<td style=\"text-align:center;\">"+result[i].testName+"</td>");
               tableStrBuilder.append("<td style=\"text-align:center;\">"+getScoreChange(result[i].personalKnowledgeScore)+"</td>");
           }
           tableStrBuilder.append("<td style=\"text-align:center;\">"+getScoreChange(result[i].classKnowledgeScore)+"</td>");
           tableStrBuilder.append("<td style=\"text-align:center;\">"+result[i].countLO+"</td>");
           tableStrBuilder.append("<td style=\"text-align:center;\">"+result[i].correctLO+"</td>");
           tableStrBuilder.append("<td style=\"text-align:center;\">"+result[i].countOLO+"</td>");
           tableStrBuilder.append("<td style=\"text-align:center;\">"+result[i].correctOLO+"</td>");
           tableStrBuilder.append("<td style=\"text-align:center;\">"+result[i].countPLO+"</td>");
           tableStrBuilder.append("<td style=\"text-align:center;\">"+result[i].correctPLO+"</td>");
           tableStrBuilder.append("</tr>");
       }
    }else{
        emptyFlag=true;
    }
    tableStrBuilder.append("</table>");
    tableStrBuilder.append("</div>");
    if(emptyFlag)
    {
      tableStrBuilder.append("<div style=\"font-size:11px;padding:5px;color:gray;\">没有历史信息.</div>");
    }
    $get("HISTORY_divKPTitle").innerHTML=title;
    $get("HISTORY_divHistoryContent").innerHTML=tableStrBuilder.toString();
    
}

/**
* 显示隐藏教师查看学生针对某知识点状态的弹出层
**/
function VIEW_KPSTATUS_showStuKPStaus(showFlag)
{
    if($get("VIEW_KPSTATUS_divStatus")==null)
    {
        VIEW_KPSTATUS_createStuStatusLayer();
    }
    $get("VIEW_KPSTATUS_divStatus").style.display = showFlag ? "block" : "none";
   //$get("divEnableOthers").style.display= $get("VIEW_KPSTATUS_divStatus").style.display = showFlag ? "block" : "none";
}

function VIEW_KPSTATUS_onDdlStatusChange(o)
{
    if(o.value!="-1")
    {
        var tempStatusArray=new Array();
        if(VIEW_KPSTATUS_statusList!=null){
            for(var i=0;i<VIEW_KPSTATUS_statusList.length;i++)
            {
                var statusStr=getScoreChange(VIEW_KPSTATUS_statusList[i].personalKnowledgeScore).trim();
                if(statusStr!="--")
                {
                    if(statusStr==o.value){
                        tempStatusArray.push(VIEW_KPSTATUS_statusList[i]);
                    }
                }else{
                    if(o.value=="未评估")
                    {
                        tempStatusArray.push(VIEW_KPSTATUS_statusList[i]);
                    }
                }
            }
        }
        VIEW_KPSTATUS_createStuStatusHTML(tempStatusArray,null);
    }else{
        VIEW_KPSTATUS_createStuStatusHTML(VIEW_KPSTATUS_statusList,null);
    }
}

/**
* 创建查看学生知识点状态的弹出层
**/
function VIEW_KPSTATUS_createStuStatusLayer()
{
    if($get("VIEW_KPSTATUS_divStatus")!=null)
    {
       return;
    }
    var tempDIV=document.createElement("div");
    var divStrBuilder=new Sys.StringBuilder();
     divStrBuilder.append("<div id=\"VIEW_KPSTATUS_divStatus\" style=\"display:none;position:fixed;top:20%;left:30%;width:30%;height:400px;border:solid 2px #BED7F5;padding:4px;z-index:101;background-color:#E8E8E8;filter: progid:DXImageTransform.Microsoft.Shadow(color=#999999,direction=135,strength=6);\">");
     divStrBuilder.append("<div style=\"padding-bottom:4px;\">");
     divStrBuilder.append("<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">");
     divStrBuilder.append("<tbody>");
     divStrBuilder.append("<tr>");
     divStrBuilder.append("<td style=\"text-align:left;\">");
     divStrBuilder.append("<select id=\"VIEW_KPSTATUS_ddlStatus\" onchange=\"VIEW_KPSTATUS_onDdlStatusChange(this)\">");
     divStrBuilder.append("<option value=\"-1\">所有状态</option>");
     divStrBuilder.append("<option value=\"Excellent\">优秀</option>");
     divStrBuilder.append("<option value=\"Good\">良好</option>");
     divStrBuilder.append("<option value=\"Fair\">较好</option>");
     divStrBuilder.append("<option value=\"Inadequate\">薄弱</option>");
     divStrBuilder.append("<option value=\"Weak\">较差</option>");
     divStrBuilder.append("<option value=\"Not Assessed\">未评估</option>");
     divStrBuilder.append("</select>");
     divStrBuilder.append("</td>");
     divStrBuilder.append("<td style=\"text-align:right;\">");
     divStrBuilder.append("<img src=\"../Images/close.gif\" style=\"cursor:pointer;\" onclick=\"VIEW_KPSTATUS_showStuKPStaus(false)\" />");
     divStrBuilder.append("</td>");
     divStrBuilder.append("</tr>");
     divStrBuilder.append("</tbody>");
     divStrBuilder.append("</table>");
     divStrBuilder.append("</div>");
     divStrBuilder.append("<div id=\"VIEW_KPSTATUS_divKPStatusContent\" style=\"border:solid 1px inset;height:370px;border-color:#BED7F5;background-color:White;cursor:text;overflow:auto\">");
     divStrBuilder.append("<center><img alt=\"loading...\" src=\"../Images/ajax-loader_02.gif\" style=\"margin-top:15%;\"/></center>");
     divStrBuilder.append("</div>");
     divStrBuilder.append("</div>");
     //divStrBuilder.append(createCoverLayerHTML());
     tempDIV.innerHTML=divStrBuilder.toString();
    document.body.appendChild(tempDIV);
}

/**
* 创建查看学生知识点状态的HTML
**/
var VIEW_KPSTATUS_statusList=null;
function VIEW_KPSTATUS_createStuStatusHTML(result)
{
    if(typeof arguments[1]=="undefined")
    {
        VIEW_KPSTATUS_statusList=result; 
        VIEW_KPSTATUS_createStuStatusLayer();
        VIEW_KPSTATUS_showStuKPStaus(true);
        $get("VIEW_KPSTATUS_ddlStatus").value="-1";
    }
   
    var tableStrBuilder=new Sys.StringBuilder();
    tableStrBuilder.append("<div style=\"margin-top:5px;\">");//
    tableStrBuilder.append("<table class=\"gridviewblue\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"padding:0px;margin:0px;\">");
    tableStrBuilder.append("<thead>");
    tableStrBuilder.append("<tr class=\"titlerow\">");
    tableStrBuilder.append("<th style=\"text-align:center;\">用户名</th>");
    tableStrBuilder.append("<th style=\"text-align:center;\">状态</th>");
    tableStrBuilder.append("</tr>");
    tableStrBuilder.append("</thead>");
    var emptyFlag=false;
    if(result!=null && result.length!=0)
    {
       emptyFlag=true;
       tableStrBuilder.append("<tbody>");
       for(var i=0;i<result.length;i++)
       {
            if(i%2==1)//奇数
            {
                tableStrBuilder.append("<tr class=\"evenrow\">");
            }else //偶数
            {
                 tableStrBuilder.append("<tr class=\"oddrow\">");
            }
            tableStrBuilder.append("<td style=\"text-align:center;\">"+getUserNameByUserId(result[i].userId)+"</td>");
            tableStrBuilder.append("<td style=\"text-align:center;\">"+getScoreChange(result[i].personalKnowledgeScore)+"</td>");
            tableStrBuilder.append("</tr>");
        }
        tableStrBuilder.append("</tbody>");
     }
     
     tableStrBuilder.append("</table>");
     tableStrBuilder.append("</div>");//
     if(!emptyFlag)
     {
        tableStrBuilder.append("<div style=\"font-size:11px;padding:5px;color:gray;\">没有知识点状态信息.</div>");
     }
     $get("VIEW_KPSTATUS_divKPStatusContent").innerHTML=tableStrBuilder.toString();
}

var COMMS_USERS=null;
function getUserNameByUserId(userId)
{
    if(COMMS_USERS!=null){
        for(var i=0;i<COMMS_USERS.length;i++)
        {
            if(COMMS_USERS[i].UserId==userId)
            {
                return COMMS_USERS[i].UserName;
                break;
            }
        }
    }
    return "--";
}


//function clickSampleQuestion(loId,loName,plSampleQuestionId,simpleUser)
//{
//    if (window.navigator.userAgent.indexOf("MSIE")>=1)
//    {
//        $get('ifrSampelQuestion').Document.location.href=  "about:blank";
//    }
//    else if(window.navigator.userAgent.indexOf("Firefox")>=1)
//    {
//        $get('ifrSampelQuestion').contentDocument.location.href=  "about:blank";
//    }
//    var courseId=simpleUser.CourseId;
//    var sectionId=simpleUser.SectionId;
//    var assignmentId=params["assignmentId"];
//    $get('sampleQuestionHeader').innerHTML="Sample Questions for \""+loName+"\"";                               
//                    var pars="loId="+loId;
//                    
//                    if(assignmentId!=null)
//                    {
//                        pars+="&assignmentId="+assignmentId;
//                    }
//                    if(courseId!=null)
//                    {
//                        pars+="&courseId="+courseId;
//                    }
//                    if(sectionId!=null)
//                    {
//                        pars+="&sectionId="+sectionId;
//                    }
//                    document.getElementById('ifrSampelQuestion').src="../SharePage/SampleQuestion.aspx?"+pars;
//                    document.getElementById(plSampleQuestionId).style.top=document.documentElement.scrollTop+100+"px";
//                    document.getElementById(plSampleQuestionId).style.left="25%";
//                    document.getElementById(plSampleQuestionId).style.display="block";

//}
//function closeSampleQuestion(plSampleQuestionId)
//{

//    if (window.navigator.userAgent.indexOf("MSIE")>=1)
//    {
//        $get('ifrSampelQuestion').Document.location.href=  "about:blank";
//    }
//    else if(window.navigator.userAgent.indexOf("Firefox")>=1)
//    {
//        $get('ifrSampelQuestion').contentDocument.location.href=  "about:blank";
//    }
//    $get(plSampleQuestionId).style.display="none";
//}
