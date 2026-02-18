let apps = [];


// SHOW INPUT BOXES

function showLinkInput(){

hideAllInputs();
document.getElementById("linkBox").classList.remove("hidden");

}

function showTextInput(){

hideAllInputs();
document.getElementById("textBox").classList.remove("hidden");

}

function hideAllInputs(){

document.getElementById("linkBox").classList.add("hidden");
document.getElementById("textBox").classList.add("hidden");

}


// LOAD FROM LINK

async function loadFromLink(){

const url = document.getElementById("linkInput").value;

if(!url){

alert("Enter link");
return;

}

try{

const res = await fetch(url);

const data = await res.json();

processApps(data);

}catch{

alert("Failed to load link");

}

}


// LOAD FROM TEXT

function loadFromText(){

try{

const text = document.getElementById("textInput").value;

const data = JSON.parse(text);

processApps(data);

}catch{

alert("Invalid JSON");

}

}


// LOAD FROM FILE

document.getElementById("fileInput").addEventListener("change", function(e){

const file = e.target.files[0];

if(!file) return;

const reader = new FileReader();

reader.onload = function(){

const data = JSON.parse(reader.result);

processApps(data);

};

reader.readAsText(file);

});


// PROCESS DATA

function processApps(data){

if(!Array.isArray(data)){

alert("Invalid apps format");
return;

}

apps = data;

showAppsScreen();

renderApps();

}


// SWITCH SCREEN

function showAppsScreen(){

document.getElementById("inputScreen").style.display="none";

document.getElementById("appsScreen").classList.remove("hidden");

document.getElementById("appCount").innerText =
apps.length + " apps";

}


// RENDER APPS

function renderApps(){

const list = document.getElementById("appsList");

list.innerHTML = "";

apps.forEach(app => {

const el = document.createElement("div");

el.className="appCard";

el.innerHTML = `

<div class="appHeader">

<div class="appIcon"></div>

<div class="appTitleGroup">

<div class="appName">${app.app_name}</div>

<div class="appPackage">${app.package_name}</div>

</div>

</div>


<div class="appDetails">

<div>Version Name: ${app.version_name}</div>

<div>Version Code: ${app.version_code}</div>

<div>Installed: ${formatDate(app.installed_date)}</div>

<div>Last Used: ${formatDate(app.last_used)}</div>

<div>Size: ${formatSize(app.app_size_bytes)}</div>

<div>Usage Time: ${formatTime(app.usage_time_ms)}</div>

<div>Usage Hours: ${app.usage_hours}</div>

<div>Usage Minutes: ${app.usage_minutes}</div>

</div>

`;

list.appendChild(el);

});

}


// FORMAT FUNCTIONS

function formatSize(bytes){

return (bytes/1024/1024).toFixed(2) + " MB";

}

function formatDate(ts){

if(!ts || ts==0) return "Never";

return new Date(ts).toLocaleString();

}

function formatTime(ms){

let min = Math.floor(ms/60000);

let hr = Math.floor(min/60);

return hr+"h "+(min%60)+"m";

}
