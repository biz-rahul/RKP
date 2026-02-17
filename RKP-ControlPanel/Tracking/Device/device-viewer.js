/* =========================================================
CONTROLTHEWORLD — DEVICE INTELLIGENCE VIEWER v3.0
Forensic Device Analysis & Intelligence Engine
Fully compatible with existing controller
========================================================= */

/* =========================================================
GLOBAL STATE ENGINE
========================================================= */

let DEVICE_STATE = {

raw: null,

indexed: [],

filtered: [],

search: "",

filters: {

    category: "all",
    risk: "all"

},

stats: {

    totalProps: 0,
    riskScore: 0,
    securityScore: 0,
    hardwareScore: 0

}

};

/* =========================================================
MAIN ENTRY POINT
========================================================= */

function renderDevice(container) {

if (!currentJSON || typeof currentJSON !== "object") {

    container.innerHTML =
        "<div class='deviceviewer-empty'>Invalid device info format</div>";

    return;
}

initializeDevice(currentJSON);

container.className = "deviceviewer-app";

container.innerHTML = `
    ${renderDeviceHeader()}
    ${renderDeviceToolbar()}
    ${renderDeviceStats()}
    ${renderDeviceContainer()}
`;

attachDeviceHandlers();

runDevicePipeline();

}

/* =========================================================
INITIALIZATION + INDEXING ENGINE
========================================================= */

function initializeDevice(json) {

DEVICE_STATE.raw = json;

DEVICE_STATE.indexed = [];

indexObject(json, "");

calculateDeviceScores();

}

/* =========================================================
RECURSIVE INDEX ENGINE
========================================================= */

function indexObject(obj, prefix) {

Object.keys(obj).forEach(key => {

    const path =
        prefix ? prefix + "." + key : key;

    const value = obj[key];

    if (typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)) {

        indexObject(value, path);

    } else {

        DEVICE_STATE.indexed.push({

            path,

            category: prefix || "root",

            key,

            value,

            risk: assessRisk(path, value)

        });

    }

});

DEVICE_STATE.stats.totalProps =
    DEVICE_STATE.indexed.length;

}

/* =========================================================
RISK ASSESSMENT ENGINE
========================================================= */

function assessRisk(path, value) {

if (path.includes("security_patch")) {

    const patchDate =
        new Date(value);

    const diffDays =
        (Date.now() - patchDate)
        / (1000*60*60*24);

    if (diffDays > 365)
        return "high";

    if (diffDays > 180)
        return "medium";

    return "low";
}

if (path.includes("vpn_active") && value === false)
    return "medium";

if (path.includes("wifi_connected") && value === false)
    return "low";

return "none";

}

/* =========================================================
DEVICE SCORING ENGINE
========================================================= */

function calculateDeviceScores() {

let riskScore = 0;

DEVICE_STATE.indexed.forEach(prop => {

    if (prop.risk === "high")
        riskScore += 30;

    if (prop.risk === "medium")
        riskScore += 15;

    if (prop.risk === "low")
        riskScore += 5;

});

DEVICE_STATE.stats.riskScore =
    Math.min(100, riskScore);

DEVICE_STATE.stats.securityScore =
    100 - DEVICE_STATE.stats.riskScore;

DEVICE_STATE.stats.hardwareScore =
    estimateHardwareScore();

}

/* =========================================================
HARDWARE SCORE ESTIMATION
========================================================= */

function estimateHardwareScore() {

const cpu =
    DEVICE_STATE.raw.cpu?.cores || 0;

const api =
    DEVICE_STATE.raw.system?.api_level || 0;

let score = 0;

if (cpu >= 8) score += 50;
else if (cpu >= 4) score += 30;

if (api >= 34) score += 50;
else if (api >= 30) score += 30;

return Math.min(score,100);

}

/* =========================================================
PIPELINE ENGINE
========================================================= */

function runDevicePipeline() {

applyDeviceFilters();

renderDeviceProperties();

renderDeviceStatsLive();

}

/* =========================================================
FILTER ENGINE
========================================================= */

function applyDeviceFilters() {

DEVICE_STATE.filtered =
    DEVICE_STATE.indexed.filter(prop => {

    if (DEVICE_STATE.search) {

        const s =
            DEVICE_STATE.search;

        if (!(
            prop.path.toLowerCase().includes(s) ||
            String(prop.value)
            .toLowerCase()
            .includes(s)
        )) return false;
    }

    if (DEVICE_STATE.filters.category !== "all") {

        if (!prop.path.startsWith(
            DEVICE_STATE.filters.category
        )) return false;
    }

    if (DEVICE_STATE.filters.risk !== "all") {

        if (prop.risk !== DEVICE_STATE.filters.risk)
            return false;
    }

    return true;

});

}

/* =========================================================
UI RENDERING
========================================================= */

function renderDeviceHeader(){

return `

<div class="deviceviewer-header">
Device Intelligence Terminal
</div>`;
}function renderDeviceToolbar(){

return `

<div class="deviceviewer-toolbar"><input id="deviceSearch"
placeholder="Search properties">

<select id="deviceCategory"><option value="all">All Categories</option>${generateDeviceCategories()}

</select><select id="deviceRisk"><option value="all">All Risk</option>
<option value="high">High Risk</option>
<option value="medium">Medium Risk</option>
<option value="low">Low Risk</option></select><button id="exportDeviceJSON">
Export JSON
</button><button id="exportDeviceCSV">
Export CSV
</button></div>`;
}function renderDeviceStats(){

return `

<div class="deviceviewer-stats"
id="deviceStats">Properties:
${DEVICE_STATE.stats.totalProps}
|
Security Score:
${DEVICE_STATE.stats.securityScore}
|
Hardware Score:
${DEVICE_STATE.stats.hardwareScore}

</div>`;
}function renderDeviceStatsLive(){

document.getElementById("deviceStats")
.innerHTML="Showing ${DEVICE_STATE.filtered.length} / ${DEVICE_STATE.stats.totalProps} | Security: ${DEVICE_STATE.stats.securityScore} | Hardware: ${DEVICE_STATE.stats.hardwareScore}";
}

function renderDeviceContainer(){

return `

<div class="deviceviewer-container"
id="deviceContainer">
</div>`;
}function renderDeviceProperties(){

const container =
document.getElementById("deviceContainer");

container.innerHTML="";

DEVICE_STATE.filtered.forEach(prop=>{

const div =
document.createElement("div");

div.className="deviceviewer-row";

div.innerHTML=`

<div class="deviceviewer-label">
${prop.path}
</div><div class="deviceviewer-value risk-${prop.risk}">
${formatValue(prop.value)}
</div>`;

container.appendChild(div);

});
}

/* =========================================================
CATEGORY GENERATOR
========================================================= */

function generateDeviceCategories(){

const categories =
Object.keys(DEVICE_STATE.raw);

return categories.map(c=>
"<option value="${c}">${c}</option>"
).join("");

}

/* =========================================================
EVENT HANDLERS
========================================================= */

function attachDeviceHandlers(){

document.getElementById("deviceSearch")
.oninput=e=>{

DEVICE_STATE.search=
e.target.value.toLowerCase();

runDevicePipeline();

};

document.getElementById("deviceCategory")
.onchange=e=>{

DEVICE_STATE.filters.category=
e.target.value;

runDevicePipeline();

};

document.getElementById("deviceRisk")
.onchange=e=>{

DEVICE_STATE.filters.risk=
e.target.value;

runDevicePipeline();

};

document.getElementById("exportDeviceJSON")
.onclick=exportDeviceJSON;

document.getElementById("exportDeviceCSV")
.onclick=exportDeviceCSV;

}

/* =========================================================
EXPORT ENGINE
========================================================= */

function exportDeviceJSON(){

downloadDeviceFile(
"device-report.json",
JSON.stringify(
DEVICE_STATE.filtered,null,2)
);

}

function exportDeviceCSV(){

const rows=
DEVICE_STATE.filtered.map(p=>
"${p.path},${p.value},${p.risk}");

downloadDeviceFile(
"device-report.csv",
rows.join("\n")
);

}

function downloadDeviceFile(name,content){

const blob=
new Blob([content]);

const url=
URL.createObjectURL(blob);

const a=
document.createElement("a");

a.href=url;
a.download=name;
a.click();

URL.revokeObjectURL(url);

}

/* =========================================================
UTILITIES
========================================================= */

function formatValue(val){

if(typeof val==="boolean")
return val?"True":"False";

return val;

}
