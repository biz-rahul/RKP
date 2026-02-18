let apps=[];
let filtered=[];


// MENU

function toggleMenu(){

document.getElementById("sideMenu").classList.toggle("open");

}


// URL PARAM LOAD

window.onload=function(){

const params=new URLSearchParams(window.location.search);

const github=params.get("github");

if(github) fetchGithub(github);

};


// LOAD METHODS

function loadPaste(){

const text=document.getElementById("jsonPaste").value;

process(JSON.parse(text));

}

document.getElementById("fileInput").onchange=function(e){

const reader=new FileReader();

reader.onload=function(){

process(JSON.parse(reader.result));

};

reader.readAsText(e.target.files[0]);

};


function loadGithub(){

const url=document.getElementById("githubInput").value;

fetchGithub(url);

}


function fetchGithub(url){

fetch(url)

.then(r=>r.json())

.then(data=>process(data));

}


// PROCESS

function process(data){

apps=data;

filtered=[...apps];

render();

}


// RENDER

function render(){

const list=document.getElementById("appsList");

list.innerHTML="";

filtered.forEach(app=>{

const icon=getIcon(app.package_name);

const row=document.createElement("div");

row.className="appRow";

row.innerHTML=`

<img class="appIcon" src="${icon}">

<div class="appInfo">

<div class="appName">${app.app_name}</div>

<div class="appPackage">${app.package_name}</div>

<div class="appMeta">
Version: ${app.version_name}
<br>
Version Code: ${app.version_code}
<br>
Size: ${formatSize(app.app_size_bytes)}
<br>
Installed: ${formatDate(app.installed_date)}
<br>
Last Used: ${formatDate(app.last_used)}
<br>
Usage: ${formatTime(app.usage_time_ms)}
</div>

</div>

`;

list.appendChild(row);

});

}


// SEARCH

document.getElementById("searchInput").oninput=function(){

const v=this.value.toLowerCase();

filtered=apps.filter(a=>

a.app_name.toLowerCase().includes(v) ||

a.package_name.toLowerCase().includes(v)

);

render();

};


// SORT

document.getElementById("sortSelect").onchange=function(){

const v=this.value;

filtered.sort((a,b)=>{

if(v==="size") return b.app_size_bytes-a.app_size_bytes;

if(v==="usage") return b.usage_time_ms-a.usage_time_ms;

if(v==="installed") return b.installed_date-a.installed_date;

if(v==="last_used") return b.last_used-a.last_used;

return a.app_name.localeCompare(b.app_name);

});

render();

};


// ICON FETCH

function getIcon(pkg){

return "https://play-lh.googleusercontent.com/"+pkg;

}


// UTILS

function formatSize(bytes){

return (bytes/1024/1024).toFixed(2)+" MB";

}

function formatDate(ts){

if(ts==0) return "Never";

return new Date(ts).toLocaleString();

}

function formatTime(ms){

let m=Math.floor(ms/60000);

let h=Math.floor(m/60);

return h+"h "+(m%60)+"m";

}
