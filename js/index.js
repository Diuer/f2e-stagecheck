var email = document.getElementById("email");
var sendEmail = document.getElementById("sendEmail");
var countDown=document.getElementById("countDown");
var date=new Date(2018,6-1,4,12);

var timer=window.setInterval(function(){
	var dateToday=new Date();
	if(dateToday.getTime()<date.getTime()){
		var totalSeconds=(date.getTime()-dateToday.getTime())/1000;
		var countSeconds=Math.floor(totalSeconds%60);
		var countMinutes=Math.floor((totalSeconds/60)%60);
		var countHours=Math.floor((totalSeconds/60/60)%24);
		var countDays=Math.floor(totalSeconds/60/60/24);
		if(date.getTime()==dateToday.getTime()){
			clearInterval(timer);
		}
		countDown.innerHTML="倒數"+countDays+"天"+countHours+"時"+countMinutes+"分"+countSeconds+"秒";
	}else{
		var totalSeconds=(dateToday.getTime()-date.getTime())/1000;
		var countSeconds=Math.floor(totalSeconds%60);
		var countMinutes=Math.floor((totalSeconds/60)%60);
		var countHours=Math.floor((totalSeconds/60/60)%24);
		var countDays=Math.floor(totalSeconds/60/60/24);
		if(date.getTime()==dateToday.getTime()){
			clearInterval(timer);
		}
		countDown.innerHTML="已過"+countDays+"天"+countHours+"時"+countMinutes+"分"+countSeconds+"秒";
	}
},1000);

function getEmail(strEmail){
  return new Promise((resolve, reject) => {
    var request = new XMLHttpRequest();
    request.open('POST', "https://www.thef2e.com/api/stageCheck", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");  
    request.send("email=" + strEmail);
    request.onload = function() {
      resolve(this.responseText);
    };
  });
}
function isEmail(email) {
  var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if(!regex.test(email)) {
    return false;
  }else{
    return true;
  }
}

sendEmail.addEventListener('click', function(e){
  e.preventDefault();
  if(email.value === ""){
    alert("請輸入信箱");
  }else if(isEmail(email.value)){
    sendEmail.value = "Waiting";
    getEmail(email.value).then(function(resv){
      var applyJson = JSON.parse(resv);
      var str="";
      if(applyJson.success==false){
      	str="";
        str = applyJson.message;
        email.value = "";
        document.getElementById("showStage").innerHTML=str;
      }else{
       	for(var i=0;i<applyJson.length;i++){
       	  str="";
          var time = new Date(applyJson[i].timeStamp-28800000);
          var y = time.getFullYear();
          var m = time.getMonth() + 1;
          var d = time.getDate();
          var h = time.getHours();
          var ms = time.getMinutes();
          var ss = time.getSeconds();
          str = " 已於 " + y + "年" + m + "月" + d + "日 " + h + "點" + ms + "分" + ss + "秒 完成第" + applyJson[i].stage +"關<br/>";
          str += "See More! <a href='" + applyJson[i].url +"'>"+applyJson[i].url+"</a><br/>";
          str += "學習主軸 "+applyJson[i].tag+"<br/>";
          document.getElementById("showStage").innerHTML=str;
      	}
      }
      sendEmail.value="Submit";
    });
  }else{
    alert("這不是信箱格式");
    
  }
});