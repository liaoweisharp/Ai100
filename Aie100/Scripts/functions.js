function GetCookieVal(offset)
//获得Cookie解码后的值
{
var endstr = document.cookie.indexOf (";", offset);
if (endstr == -1)
endstr = document.cookie.length;
return unescape(document.cookie.substring(offset, endstr));
}
function SetCookie(name, value)
//设定Cookie值
{
var expdate = new Date();
var argv = SetCookie.arguments;
var argc = SetCookie.arguments.length;
var expires = (argc > 2) ? argv[2] : null;
var path = (argc > 3) ? argv[3] : null;
var domain = (argc > 4) ? argv[4] : null;
var secure = (argc > 5) ? argv[5] : false;
if(expires!=null) expdate.setTime(expdate.getTime() + ( expires * 1000 ));
document.cookie = name + "=" + escape (value) +((expires == null) ? "" : ("; expires="+ expdate.toGMTString()))
+((path == null) ? "" : ("; path=" + path)) +((domain == null) ? "" : ("; domain=" + domain))
+((secure == true) ? "; secure" : "");
}
function DelCookie(name)
//删除Cookie
{
var exp = new Date();
exp.setTime (exp.getTime() - 1);
var cval = GetCookie (name);
document.cookie = name + "=" + cval + "; expires="+ exp.toGMTString();
}
function GetCookie(name)
//获得Cookie的原始值
{
var arg = name + "=";
var alen = arg.length;
var clen = document.cookie.length;
var i = 0;
while (i < clen)
{
var j = i + alen;
if (document.cookie.substring(i, j) == arg)
return GetCookieVal (j);
i = document.cookie.indexOf(" ", i) + 1;
if (i == 0) break;
}
return null;
}


    function getDate()
     { 
        var currentDate = new Date(); document.getElementById("xxx").innerHTML=(currentDate.toLocaleString());
     }
    function Confirmer(targetUrl)
    {
       var locationUrl=window.location.href;
       var aa = new Array("AssignmentCreate.aspx","TestCreate.aspx","StudyGuideCreateStep1.aspx","Upload.aspx");
       var bo=true;
       for(var i=0;i<aa.length;i++)
       {
           var n=locationUrl.search(aa[i]);
           if(n!="-1")
           {
                var warnString;
                switch(i)
                {
                    case 0:
                        warnString="assignment";
                        break;
                    case 1:
                        warnString="test";
                        break;
                    case 2:
                        warnString="study guide";
                        break;
                    case 3:
                        warnString="upload";
                        break;
                }
                if(confirm("Your "+warnString+" has not been saved yet. Please confirm that you really want to ababdon this "+warnString+"."))
               { 
                    bo=true;
               }
               else
               {
                    bo=false;
               }
                break;
           }
       }
       if(bo)
       {
            window.location.href=targetUrl;
       }      
    }
    function selectRadio(gvId,radioId)
    {
       
            var gridView= document.getElementById(gvId);
            var inputs= gridView.getElementsByTagName("input");
            for(i=0;i<inputs.length;i++)
            {
                if(inputs[i].type=="radio")
                {
                    if(inputs[i].id==radioId)
                    {
                        inputs[i].checked=true;
                    }
                    else
                    {
                        inputs[i].checked=false;
                    }
                }
            }           
   }
//   //启用和禁用clientControlId对应的Control
//   function ShowTestSetting(flag,clientControlId)
//   {       
//        var control=document.getElementById(clientControlId);
//        var inputs=control.getElementsByTagName("input");        
//        if(flag=='Y')
//        {              
//            for(i=0;i<inputs.length;i++) 
//            {       
//                if(inputs[i].type=="text")
//                {
//                    inputs[i].disabled=false;
//                }
//            }
//            control.disabled=false;            
//        }
//        if(flag=='N')
//        {      
//            for(i=0;i<inputs.length;i++) 
//            {       
//                if(inputs[i].type=="text")
//                {    
//                    inputs[i].disabled=true;
//                }
//            }
//            control.disabled=true;   
//        }
//   }
   function ShowTestSetting1(flag,clientControlId)
   {
    
        var control=document.getElementById(clientControlId);
        if(flag=='Y')
        {          
            control.value="";
            control.disabled=false;
        }
        if(flag=='N')
        {   
            control.value="Disabled"
            control.disabled=true;   
        }
   }
   
   //改变父控件中所有子控件的ENABLED
 //parentID 为父控件或父控件ID  
 //disabled为是否禁用true 为禁用,false 为可用  
 //filter为不更改disabled而更改readOnly的以|分隔的控件ID列表  
 function SetChildControlsStatus(parentID,disabled)  
 {  

     var parent;  
    if(typeof(parentID)=="undefined")  
    {return;}  
    if(typeof(parentID)=="string")  
    {  
        parent=document.getElementById(parentID);  
        if(parent!=null)
        {
            parent.disabled=disabled;
        }        
    }  
    else  
    {  
        parent=parentID;  
    }  
    var i=0;  
    for(i=0;i<parent.childNodes.length;i++)  
   {  
        
        var m_TagName=parent.childNodes[i].tagName  
       if(m_TagName)  
        {  
            m_TagName = m_TagName.toUpperCase();  
        }  
       else  
       {  
           continue;  
        }  
        if(m_TagName=="INPUT"||m_TagName=="SELECT"||m_TagName=="TEXTAREA")  
        {  
            if(m_TagName=="SELECT")
            {
                parent.childNodes[i].selectedIndex=0;
            }
            else if(m_TagName=="INPUT")
            {
                if(parent.childNodes[i].type.toUpperCase()=="RADIO")
                {
                    parent.childNodes[i].checked=false;
                }
                else if(parent.childNodes[i].type.toUpperCase()=="TEXT")
                {
                     parent.childNodes[i].value="";
                     
                }               
            }
            parent.childNodes[i].disabled=disabled;  

        }  
        if(parent.childNodes[i].childNodes)  
        {  
           
            SetChildControlsStatus(parent.childNodes[i],disabled);  
          
        }  
    }//for  
}

   
   function imgClickInGridView11(id)
   {
  
        var div=document.getElementById(id);
        if(div.style.display=='none')
        {
            div.style.display="block";
        }
        else
        {
            div.style.display='none';
        }
   }
    function imgClickInGridView(id,imgId,titleId)
           {
      
                var img=document.getElementById(imgId);
                var div=document.getElementById(id);
                var divTitle=document.getElementById(titleId);
                if(div.style.display=='none')
                {
                    div.style.display="block";
                    img["src"]="../Images/sanjiaoExpend.gif";
                    divTitle.style.backgroundColor="#E7E7EF";
                    divTitle.style.fontWeight="bold";
                }
                else
                {
                    div.style.display='none';
                    img["src"]="../Images/sanjiaoNormal.gif";
                    divTitle.style.backgroundColor="#FFFFFF";
                    divTitle.style.fontWeight="normal";
                }
            }  
   // '1'显示控件，'0'隐藏控件
   function displayOrdisappearControl(flag,clientControlId)
   {
        var control= document.getElementById(clientControlId);
        if(control!=null)
        {
            if(flag=='1')
            {
                control.style.display="block";
            }
            else if(flag=='0')
            {
                control.style.display="none";
            }
        }
   }
   function dd(id)
    {
        document.getElementById(id).click();
    }
    //用于显示第一个li和div，隐藏其他li和div.应用于学习资料的选项卡。
     function mouseover_reference(li_id1,li_id2,li_id3,li_id4,gv_id1,gv_id2,gv_id3,gv_id4)
                                {   
                                                     
                                    try{
                                    document.getElementById(li_id1).className='current';
                                    document.getElementById(li_id2).className='optioncard';
                                    document.getElementById(li_id3).className='optioncard';
                                    document.getElementById(li_id4).className='optioncard';
                                    document.getElementById(gv_id1).style.display="block";
                                    document.getElementById(gv_id2).style.display="none";
                                    document.getElementById(gv_id3).style.display="none";
                                    document.getElementById(gv_id4).style.display="none";
                                    }catch(e){alert(e);}
                                }
   //点击Sample Question后执行的弹出事件
  function ClickSampleQuestion(loId,loName,sampleQuestionId,sampleQuestionDrapHanderId,lbHeaderId,ifrSampelQuestionId,assignmentId,sectionId,courseId)
            {  
      
                if(document.all)
                {
                    $get(sampleQuestionId).style.display="block";
                   
                    $get(lbHeaderId).innerText="Sample questions for \""+loName+"\"";
                    var pars="loId="+loId;
                    
                    if(assignmentId!=null)
                    {
                        pars+="&assignmentId="+assignmentId;
                    }
                    if(courseId!=null)
                    {
                        pars+="&courseId="+courseId;
                    }
                    if(sectionId!=null)
                    {
                        pars+="&sectionId="+sectionId;
                    }
                    $get(ifrSampelQuestionId).src="../SharePage/SampleQuestion.aspx?userId="+getUserId()+"&"+pars;
                    $get(sampleQuestionId).style.top=document.documentElement.scrollTop+100;
                    $get(sampleQuestionId).style.left="25%";
                }
                else
                {
                    document.getElementById(sampleQuestionId).style.display="block";
                   
                    document.getElementById(lbHeaderId).innerText="Sample questions for \""+loName+"\"";
                    var pars="loId="+loId;
                    
                    if(assignmentId!=null)
                    {
                        pars+="&assignmentId="+assignmentId;
                    }
                    if(courseId!=null)
                    {
                        pars+="&courseId="+courseId;
                    }
                    if(sectionId!=null)
                    {
                        pars+="&sectionId="+sectionId;
                    }
                    document.getElementById(ifrSampelQuestionId).src="../SharePage/SampleQuestion.aspx?"+pars;
                    document.getElementById(sampleQuestionId).style.top=document.documentElement.scrollTop+100+"px";
                    document.getElementById(sampleQuestionId).style.left="25%";
                }
                
            }
            function clickRelatedLinks(plLoRelated,itemId,loName,ifrRelateId,state,loId,assignmentId)
            {
               
                 var args = new Object();
                 args = GetUrlParms();
                    
                 sectionId = args["sectionId"];
                 courseId=args["courseId"];
               
                 var par='';
                 if(args["studyGuideId"]!=undefined)
                 {
                    par="&sourceId="+args["studyGuideId"]+"&sourceType=0&type=Study Guide&objectType=1";
                 }
                 else if(args["testId"]!=undefined)
                 {
                    par="&sourceId="+args["testId"]+"&sourceType=6&type=Test&objectType=1";
                 }
                 
                 if(document.all)
                 {
                     $get(plLoRelated).style.display="block";
                     $get(itemId).innerText="Knowledge point: \""+loName+"\"";
                     if(par==undefined)
                     {
                        par="";
                     }
                     $get(ifrRelateId).src="../SharePage/LOReleated.aspx?state="+state+"&loId="+loId+"&assignmentId="+assignmentId+"&sectionId="+sectionId+"&courseId="+courseId+par;
                     $get(plLoRelated).style.top=document.documentElement.scrollTop+110;
                     $get(plLoRelated).style.left="20%";
                 }
                 else
                 {
                     document.getElementById(plLoRelated).style.display="block";
                     document.getElementById(itemId).innerText="Knowledge point: \""+loName+"\"";
                     if(par==undefined)
                     {
                        par="";
                     }
                     document.getElementById(ifrRelateId).src="../SharePage/LOReleated.aspx?state="+state+"&loId="+loId+"&assignmentId="+assignmentId+"&sectionId="+sectionId+"&courseId="+courseId+par;
                     $get(plLoRelated).style.top=document.documentElement.scrollTop+110+"px";
                     $get(plLoRelated).style.left="20%";
                 }
            }
            function clickRelatedLinksFromProfile(plLoRelated,itemId,loName,ifrRelateId,state,loId,sourceType,sourceId,sourceName)
            {
             
                 var args = new Object();
                 args = GetUrlParms();
                    
                 sectionId = args["sectionId"];
                 courseId=args["courseId"];
               
              
                 if(document.all)
                 {
                     $get(plLoRelated).style.display="block";
                     $get(itemId).innerText="Knowledge point: \""+loName+"\"";
                    
                     $get(ifrRelateId).src="../SharePage/LOReleated.aspx?state="+state+"&loId="+loId+"&sectionId="+sectionId+"&courseId="+courseId+"&sourceId="+sourceId+"&Type="+sourceName+"&sourceType="+sourceType+"&objectType=1";
                     $get(plLoRelated).style.top=document.documentElement.scrollTop+110;
                     $get(plLoRelated).style.left="20%";
                 }
                 else
                 {
                     document.getElementById(plLoRelated).style.display="block";
                     document.getElementById(itemId).innerText="Knowledge point: \""+loName+"\"";
                    
                     document.getElementById(ifrRelateId).src="../SharePage/LOReleated.aspx?state="+state+"&loId="+loId+"&sectionId="+sectionId+"&courseId="+courseId+"&sourceId="+sourceId+"&Type="+sourceName+"&sourceType="+sourceType+"&objectType=1";
                     $get(plLoRelated).style.top=document.documentElement.scrollTop+110+"px";
                     $get(plLoRelated).style.left="20%";
                 }
            }
 //点击Question Type三角图形后执行的函数
function imgClickInGridView2(divId,imgId)
            { 
            
                var div=document.getElementById(divId);
                var img=document.getElementById(imgId);
                if(div.style.display=='none')
                {
                    div.style.display="block";
                    img["src"]="../Images/sanjiaoExpend.gif";
                }
                else
                {
                    div.style.display='none';
                    img["src"]="../Images/sanjiaoNormal.gif";
                }
                
            }
   function clickType(id)
             {
           
                document.getElementById(id).click();
             }
    function dd(id)
    {
        
        document.getElementById(id).click();
    }
    
    
 //获得url参数
//    使用方法：
//var args = new Object();
//args = GetUrlParms();
//如果要查找参数key:
//value = args[key] 
    function GetUrlParms()    
{
    var args=new Object();   
    var query=location.search.substring(1);//获取查询串   
    var pairs=query.split("&");//在逗号处断开   
    for(var   i=0;i<pairs.length;i++)   
    {   
        var pos=pairs[i].indexOf('=');//查找name=value   
            if(pos==-1)   continue;//如果没有找到就跳过   
            var argname=pairs[i].substring(0,pos);//提取name   
            var value=pairs[i].substring(pos+1);//提取value   
            args[argname]=unescape(value);//存为属性   
    }
    return args;
}

//保留x位小数（四舍五入）
function Math_Round(num,x)
{   
    
    if (!isNaN(num) && !isNaN(x)) {
        return parseFloat(num).toFixed(x);
    }
    return 0;
}