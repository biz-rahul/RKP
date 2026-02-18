let apps=[];
let filtered=[];


// URL AUTO LOAD

window.onload=function(){

const params=new URLSearchParams(window.location.search);

const github=params.get("github");

if(github) fetchGithub(github);

};


// LOAD METHODS

function loadPaste(){

const json=document.getElementById("jsonPaste").value;

process(JSON.parse(json));

}

document.getElementById("fileInput").onchange=function(e){

const reader=new FileReader();

reader.onload=function(){

process(JSON.parse(reader.result));

};

reader.readAsText(e.target.files[0]);

};

function loadGithub(){

const url=document.getElementById("githubUrl").value;

fetchGithub(url);

}

function fetchGithub(url){

fetch(url)

.then(r=>r.json())

.then(data=>process(data));

}


// PROCESS DATA

function process(data){

apps=data;

filtered=[...apps];

renderStats();

renderApps();

renderChart();

}


// STATS

function renderStats(){

const total=apps.length;

const totalSize=sum(apps,"app_size_bytes");

const totalUsage=sum(apps,"usage_time_ms");

const largest=max(apps,"app_size_bytes");

const mostUsed=max(apps,"usage_time_ms");

document.getElementById("statApps").innerHTML="Apps: "+total;

document.getElementById("statSize").innerHTML="Size: "+formatSize(totalSize);

document.getElementById("statUsage").innerHTML="Usage: "+formatTime(totalUsage);

document.getElementById("statLargest").innerHTML="Largest: "+largest.app_name;

document.getElementById("statMostUsed").innerHTML="Most Used: "+mostUsed.app_name;

}


// RENDER APPS

function renderApps(){

const container=document.getElementById("appsContainer");

container.innerHTML="";

if(document.getElementById("viewMode").value==="table"){

renderTable();

return;

}

filtered.forEach(app=>{

const card=document.createElement("div");

card.className="card";

card.innerHTML=`

<h3>${app.app_name}</h3>

<p>Package: ${app.package_name}</p>

<p>Size: ${formatSize(app.app_size_bytes)}</p>

<p>Usage: ${formatTime(app.usage_time_ms)}</p>

<p>Installed: ${formatDate(app.installed_date)}</p>

`;

container.appendChild(card);

});

}


// TABLE VIEW

function renderTable(){

const container=document.getElementById("appsContainer");

let html="<table class='table'>";

html+="<tr><th>Name</th><th>Size</th><th>Usage</th></tr>";

filtered.forEach(app=>{

html+=`

<tr>

<td>${app.app_name}</td>

<td>${formatSize(app.app_size_bytes)}</td>

<td>${formatTime(app.usage_time_ms)}</td>

</tr>

`;

});

html+="</table>";

container.innerHTML=html;

}


// SEARCH

document.getElementById("searchBox").oninput=function(){

const v=this.value.toLowerCase();

filtered=apps.filter(a=>a.app_name.toLowerCase().includes(v));

renderApps();

};


// SORT

document.getElementById("sortSelect").onchange=function(){

const v=this.value;

filtered.sort((a,b)=>{

if(v==="size") return b.app_size_bytes-a.app_size_bytes;

if(v==="usage") return b.usage_time_ms-a.usage_time_ms;

if(v==="installed") return b.installed_date-a.installed_date;

return a.app_name.localeCompare(b.app_name);

});

renderApps();

};


// VIEW MODE

document.getElementById("viewMode").onchange=function(){

renderApps();

};


// CHART

function renderChart(){

const top=apps.sort((a,b)=>b.usage_time_ms-a.usage_time_ms).slice(0,10);

new Chart(document.getElementById("usageChart"),{

type:"bar",

data:{

labels:top.map(a=>a.app_name),

datasets:[{

label:"Usage",

data:top.map(a=>a.usage_time_ms)

}]

}

});

}


// EXPORT

function exportFiltered(){

const blob=new Blob([JSON.stringify(filtered,null,2)]);

const a=document.createElement("a");

a.href=URL.createObjectURL(blob);

a.download="filtered.json";

a.click();

}


// UTILS

function sum(arr,key){

return arr.reduce((a,b)=>a+b[key],0);

}

function max(arr,key){

return arr.reduce((a,b)=>a[key]>b[key]?a:b);

}

function formatSize(bytes){

return (bytes/1024/1024).toFixed(2)+" MB";

}

function formatTime(ms){

let m=Math.floor(ms/60000);

let h=Math.floor(m/60);

return h+"h "+(m%60)+"m";

}

function formatDate(ts){

return new Date(ts).toLocaleDateString();

}
