var data=["刘大屁","刘大屁的屁股","刘大屁的脑袋","刘大屁的肚子","刘大屁的大手","没抽到吧","蠢货","大炮","哈哈","逗逗"],
    timer=null,
    flag=0;

window.onload=function(){
    var play=document.getElementById("play"),
        stop=document.getElementById("stop");
    play.onclick=playFun;
    stop.onclick=stopFun;
}
//键盘事件
document.onkeyup=function(event){
    event=event||window.event;
    if(event.keyCode==13){
        if(flag==0){
            playFun();
            flag=1;
        }else{
            stopFun();
            flag=0;
        }
    }
}
//开始抽奖
function playFun(){
    clearInterval(timer);
    var title=document.getElementById("title"),
        play=document.getElementById("play");
    timer=setInterval(function(){
    var random=Math.floor(Math.random()*data.length);
    title.innerHTML=data[random];
    },50)
    play.style.background="#999";
}
//停止抽奖
function stopFun(){
    clearInterval(timer);
    var play=document.getElementById("play");
    play.style.background="#036";
}