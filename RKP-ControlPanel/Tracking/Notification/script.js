// ==========================
// GLOBAL STATE
// ==========================

let rawData = [];
let filteredData = [];
let currentView = "card";


// ==========================
// AUTO LOAD FROM URL PARAM
// ==========================

function autoLoadFromParams()
{
const params = new URLSearchParams(window.location.search);

const url = params.get("url");

if(url)
{
document.getElementById("urlInput").value = url;

fetchJSON(url);
}
}


// ==========================
// DATA INPUT FUNCTIONS
// ==========================

function loadPaste()
{
const text = document.getElementById("jsonPaste").value;

parseJSON(text);
}


function loadFile()
{
const file = document.getElementById("fileInput").files[0];

if(!file) return;

const reader = new FileReader();

reader.onload = e => parseJSON(e.target.result);

reader.readAsText(file);
}


async function loadURL()
{
const url = document.getElementById("urlInput").value;

fetchJSON(url);
}


async function fetchJSON(url)
{
try
{
const response = await fetch(url);

const text = await response.text();

parseJSON(text);
}
catch
{
alert("Failed to fetch JSON");
}
}


// ==========================
// JSON PARSER
// ==========================

function parseJSON(text)
{
try
{
rawData = JSON.parse(text);

filteredData = [...rawData];

initializeFilters();

applyFilters();

}
catch
{
alert("Invalid JSON");
}
}


// ==========================
// FILTER SYSTEM
// ==========================

function initializeFilters()
{

const appSet = new Set();

const categorySet = new Set();

rawData.forEach(n =>
{
if(n.app_name) appSet.add(n.app_name);

if(n.category) categorySet.add(n.category);
});


const appFilter = document.getElementById("appFilter");

appFilter.innerHTML = "<option value=''>All Apps</option>";

appSet.forEach(app =>
{
appFilter.innerHTML += `<option value="${app}">${app}</option>`;
});


const categoryFilter = document.getElementById("categoryFilter");

categoryFilter.innerHTML = "<option value=''>All Categories</option>";

categorySet.forEach(cat =>
{
categoryFilter.innerHTML += `<option value="${cat}">${cat}</option>`;
});

}


function applyFilters()
{

const search = document.getElementById("searchBox").value.toLowerCase();

const app = document.getElementById("appFilter").value;

const category = document.getElementById("categoryFilter").value;

const dateFrom = document.getElementById("dateFrom").value;

const dateTo = document.getElementById("dateTo").value;


filteredData = rawData.filter(n =>
{

if(app && n.app_name !== app) return false;

if(category && n.category !== category) return false;

if(search)
{
const combined = 
(n.title + " " +
n.text + " " +
n.big_text + " " +
n.ticker + " " +
n.package).toLowerCase();

if(!combined.includes(search))
return false;
}

if(dateFrom)
{
const from = new Date(dateFrom).getTime();

if(n.posted_time < from) return false;
}

if(dateTo)
{
const to = new Date(dateTo).getTime();

if(n.posted_time > to) return false;
}

return true;

});

renderViewer();

updateStats();

}


function clearFilters()
{

filteredData = [...rawData];

document.getElementById("searchBox").value = "";

document.getElementById("appFilter").value = "";

document.getElementById("categoryFilter").value = "";

renderViewer();

updateStats();

}


// ==========================
// STATS ENGINE
// ==========================

function updateStats()
{

const total = filteredData.length;

const appCounts = {};

filteredData.forEach(n =>
{
appCounts[n.app_name] = (appCounts[n.app_name] || 0) + 1;
});

let html = `<b>Total Notifications:</b> ${total}<br><br>`;

for(let app in appCounts)
{
html += `${app}: ${appCounts[app]}<br>`;
}

document.getElementById("stats").innerHTML = html;

}


// ==========================
// VIEW ENGINE
// ==========================

function setView(mode)
{
currentView = mode;

renderViewer();
}


function renderViewer()
{

if(currentView === "card")
renderCardView();

if(currentView === "table")
renderTableView();

if(currentView === "chat")
renderChatView();

if(currentView === "timeline")
renderTimelineView();

}


// ==========================
// CARD VIEW
// ==========================

function renderCardView()
{

const viewer = document.getElementById("viewer");

viewer.innerHTML = "";

filteredData
.sort((a,b)=>b.posted_time-a.posted_time)
.forEach(n =>
{

viewer.innerHTML +=

`
<div class="card">

<b>${n.app_name}</b><br>

${n.title}<br>

${n.text || ""}<br>

<small>${new Date(n.posted_time).toLocaleString()}</small>

</div>
`;

});

}


// ==========================
// TABLE VIEW
// ==========================

function renderTableView()
{

let html = "<table class='table'>";

html +=
`
<tr>
<th>App</th>
<th>Title</th>
<th>Message</th>
<th>Category</th>
<th>Time</th>
</tr>
`;

filteredData.forEach(n =>
{

html +=
`
<tr>

<td>${n.app_name}</td>

<td>${n.title}</td>

<td>${n.text}</td>

<td>${n.category}</td>

<td>${new Date(n.posted_time).toLocaleString()}</td>

</tr>
`;

});

html += "</table>";

document.getElementById("viewer").innerHTML = html;

}


// ==========================
// CHAT VIEW
// ==========================

function renderChatView()
{

const groups = {};

filteredData.forEach(n =>
{

const sender = n.title || "Unknown";

if(!groups[sender])
groups[sender] = [];

groups[sender].push(n);

});


let html = "";

for(let sender in groups)
{

html += `<div class="chat-group"><h3>${sender}</h3>`;

groups[sender].forEach(n =>
{

html +=
`
<div class="chat-msg">

${n.text}

<br>

<small>${new Date(n.posted_time).toLocaleString()}</small>

</div>
`;

});

html += "</div>";

}

document.getElementById("viewer").innerHTML = html;

}


// ==========================
// TIMELINE VIEW
// ==========================

function renderTimelineView()
{

let html = "";

filteredData
.sort((a,b)=>a.posted_time-b.posted_time)
.forEach(n =>
{

html +=
`
<div class="timeline-item">

${new Date(n.posted_time).toLocaleString()}

<br>

${n.app_name}

<br>

${n.title}

<br>

${n.text}

</div>
`;

});

document.getElementById("viewer").innerHTML = html;

}


// ==========================
// INITIALIZE
// ==========================

autoLoadFromParams();
