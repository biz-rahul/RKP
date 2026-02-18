// ==========================
// Core Architecture
// ==========================

const Controller = {

data:null,

loadPaste(){

const raw=document.getElementById("jsonPaste").value;

Parser.parse(raw);

},

loadFile(){

const file=document.getElementById("fileInput").files[0];

const reader=new FileReader();

reader.onload=e=>Parser.parse(e.target.result);

reader.readAsText(file);

},

async loadGithub(){

const url=document.getElementById("githubUrl").value;

const res=await fetch(url);

const json=await res.text();

Parser.parse(json);

},

async loadParam(){

const url=new URLSearchParams(location.search).get("url");

if(!url)return;

document.getElementById("githubUrl").value=url;

const res=await fetch(url);

const json=await res.text();

Parser.parse(json);

}

};

// ==========================
// Parser Layer
// ==========================

const Parser={

parse(raw){

try{

Controller.data=JSON.parse(raw);

Analytics.compute();

Renderer.render();

}catch(e){

alert("Invalid JSON");

}

}

};

// ==========================
// Analytics Engine
// ==========================

const Analytics={

healthScore:0,

compute(){

const d=Controller.data;

let score=100;

if(d.battery.level_percent<15)score-=30;

if(d.network.vpn_active)score-=10;

if(!d.connectivity.wifi_connected)score-=5;

this.healthScore=score;

},

};

// ==========================
// Renderer
// ==========================

const Renderer={

render(){

const root=document.getElementById("dashboard");

root.innerHTML="";

this.summary();

this.device();

this.system();

this.battery();

this.network();

this.widgets();

this.calendar();

},

createCard(title,content){

const div=document.createElement("div");

div.className="card";

div.innerHTML="<div class="card-title">${title}</div>${content}";

document.getElementById("dashboard").appendChild(div);

},

table(obj){

let html="<table class='table'>";

for(let k in obj){

html+="<tr><td>${k}</td><td>${obj[k]}</td></tr>";

}

html+="</table>";

return html;

},

summary(){

this.createCard(

"Health Score",

"<h2>${Analytics.healthScore}/100</h2>"

);

},

device(){

this.createCard(

"Device",

this.table(Controller.data.device)

);

},

system(){

this.createCard(

"System",

this.table(Controller.data.system)

);

},

battery(){

const b=Controller.data.battery;

this.createCard(

"Battery",

`

<div class="progress"><div class="progress-bar" style="width:${b.level_percent}%"></div></div>${this.table(b)}

`

);

},

network(){

this.createCard(

"Network",

this.table(Controller.data.network)

);

},

widgets(){

const list=Controller.data.widgets;

let html="<input class="search-box" placeholder="Search widgets" oninput="Renderer.filterWidgets(this.value)">";

html+="<div id="widgetList">";

list.forEach(w=>{

html+="<div class="widget-item">${w.provider}</div>";

});

html+="</div>";

this.createCard("Widgets (${list.length})",html);

},

filterWidgets(q){

const items=document.querySelectorAll(".widget-item");

items.forEach(i=>{

i.style.display=i.innerText.includes(q)?'block':'none';

});

},

calendar(){

const list=Controller.data.calendar_snapshot;

let html="<table class='table'>";

list.forEach(e=>{

html+=`<tr>

<td>${e.title}</td><td>${new Date(e.start).toLocaleString()}</td></tr>`;});

html+="</table>";

this.createCard("Calendar",html);

}

};

// ==========================
// Initialize
// ==========================

Controller.loadParam();
