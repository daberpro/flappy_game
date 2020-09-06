var electron = require("electron");
var remote = electron.remote;

var msbg = new Audio();
msbg.src = "music/bgms.mp3";
msbg.loop = true;
msbg.play();

let Win = remote.getCurrentWindow();

function getBtn(obj){
    return document.getElementById(obj);
}

getBtn("close").onclick=function(){
   Win.close(); 
}

getBtn("maximize").onclick=function(){
    Win.maximize();

}

getBtn("minimize").onclick=function(){
    Win.minimize();
    msbg.muted = true;
}

document.body.querySelector("canvas").onclick = function(){
    msbg.muted = false;
}