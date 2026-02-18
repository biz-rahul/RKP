let rawData=[];
let filteredData=[];

const callTypes={
1:"Incoming",
2:"Outgoing",
3:"Missed",
5:"Rejected",
6:"Blocked"
};


function loadPaste(){

let text=document.getElementById("jsonInput").value;

process(text);

}


document.getElementById("fileInput").onchange=e=>{

let file=e.target.files[0];

let reader=new FileReader();

reader.onload=x=>process(x.target.result);

reader.readAsText(file);

};


async function loadGithub(){

let url=document.getElementById("githubUrl").value;

let res=await fetch(url);

let text=await res.text();

process(text);

}


function process(text){

rawData=JSON.parse(text);

filteredData=rawData;

renderStats();

renderViewer();

renderCharts();

}


function renderStats(){

let totalCalls=0;
let totalDuration=0;

let typesCount={};

rawData.forEach(c=>{

c.calls.forEach(call=>{

totalCalls++;

totalDuration+=call.duration;

typesCount[call.type]=(typesCount[call.type]||0)+1;

});

});


document.getElementById("stats").innerHTML=`

<div class="statbox">

Contacts: ${rawData.length}<br>

Calls: ${totalCalls}<br>

Duration: ${formatDuration(totalDuration)}

</div>

`;

}


function renderViewer(){

let html="";

filteredData.forEach(contact=>{

let duration=contact.calls.reduce((a,b)=>a+b.duration,0);

html+=`

<div class="contact">

<h3>${contact.name}</h3>

${contact.number}<br>

Calls:${contact.calls.length}<br>

Duration:${formatDuration(duration)}

</div>

`;

});

document.getElementById("viewer").innerHTML=html;

}


function renderCharts(){

let counts={};

rawData.forEach(c=>{

c.calls.forEach(call=>{

counts[call.type]=(counts[call.type]||0)+1;

});

});


new Chart(

document.getElementById("callTypeChart"),

{

type:"pie",

data:{

labels:Object.keys(counts).map(x=>callTypes[x]),

datasets:[{

data:Object.values(counts)

}]

}

}

);

}


function applyFilters(){

let search=document.getElementById("searchName").value.toLowerCase();

let type=document.getElementById("typeFilter").value;

filteredData=rawData.filter(c=>{

if(search && !c.name.toLowerCase().includes(search)) return false;

if(type){

if(!c.calls.some(call=>call.type==type)) return false;

}

return true;

});


renderViewer();

}


function formatDuration(sec){

let m=Math.floor(sec/60);

let s=sec%60;

return m+"m "+s+"s";

}


function loadFromParams(){

let params=new URLSearchParams(location.search);

let url=params.get("github");

if(url){

fetch(url)

.then(res=>res.text())

.then(process);

}

}

loadFromParams();
