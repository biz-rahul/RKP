/* =========================================================
CONTROLTHEWORLD — NOTIFICATION INTELLIGENCE VIEWER v3.0
Forensic Notification Analysis Engine
Fully compatible with existing controller
========================================================= */

/* =========================================================
GLOBAL STATE ENGINE
========================================================= */

let NOTIFICATION_STATE = {

raw: [],

indexed: [],

filtered: [],

search: "",

filters: {

    app: "all",
    category: "all",
    timeRange: "all"

},

sort: {

    field: "posted_time",
    dir: "desc"

},

pagination: {

    page: 1,
    perPage: 50

},

stats: {

    total: 0,
    apps: new Map(),
    categories: new Map(),
    firstTime: 0,
    lastTime: 0

}

};

/* =========================================================
MAIN ENTRY
========================================================= */

function renderNotification(container) {

if (!Array.isArray(currentJSON)) {

    container.innerHTML =
        "<div class='notificationviewer-empty'>Invalid notification format</div>";

    return;
}

initializeNotifications(currentJSON);

container.className = "notificationviewer-app";

container.innerHTML = `
    ${renderNotificationHeader()}
    ${renderNotificationToolbar()}
    ${renderNotificationStats()}
    ${renderNotificationListContainer()}
    ${renderNotificationPagination()}
`;

attachNotificationHandlers();

runNotificationPipeline();

}

/* =========================================================
INITIALIZATION ENGINE
========================================================= */

function initializeNotifications(json) {

NOTIFICATION_STATE.raw = json;

NOTIFICATION_STATE.indexed = json.map(n => {

    const text =
        n.text ||
        n.big_text ||
        n.ticker ||
        "";

    return {

        id: n.notification_id,

        app: n.app_name || "Unknown",

        package: n.package || "",

        title: n.title || "",

        text,

        category: n.category || "other",

        posted_time: n.posted_time,

        timeFormatted:
            formatRelativeTime(n.posted_time),

        fullTime:
            new Date(n.posted_time)
            .toLocaleString()

    };

});

calculateNotificationStats();

}

/* =========================================================
STATS ENGINE
========================================================= */

function calculateNotificationStats(){

NOTIFICATION_STATE.stats.total =
    NOTIFICATION_STATE.indexed.length;

NOTIFICATION_STATE.indexed.forEach(n=>{

    incrementMap(
        NOTIFICATION_STATE.stats.apps,
        n.app
    );

    incrementMap(
        NOTIFICATION_STATE.stats.categories,
        n.category
    );

});

const times =
    NOTIFICATION_STATE.indexed
    .map(n=>n.posted_time);

NOTIFICATION_STATE.stats.firstTime =
    Math.min(...times);

NOTIFICATION_STATE.stats.lastTime =
    Math.max(...times);

}

/* =========================================================
PIPELINE ENGINE
========================================================= */

function runNotificationPipeline(){

applyNotificationFilters();

applyNotificationSort();

renderNotificationItems();

renderNotificationPaginationControls();

renderNotificationStatsLive();

}

/* =========================================================
FILTER ENGINE
========================================================= */

function applyNotificationFilters(){

NOTIFICATION_STATE.filtered =
    NOTIFICATION_STATE.indexed.filter(n=>{

    if(NOTIFICATION_STATE.search){

        const s =
            NOTIFICATION_STATE.search;

        if(!(

            n.app.toLowerCase().includes(s) ||
            n.package.toLowerCase().includes(s) ||
            n.title.toLowerCase().includes(s) ||
            n.text.toLowerCase().includes(s)

        )) return false;

    }

    if(
        NOTIFICATION_STATE.filters.app !== "all" &&
        n.app !== NOTIFICATION_STATE.filters.app
    ) return false;

    if(
        NOTIFICATION_STATE.filters.category !== "all" &&
        n.category !== NOTIFICATION_STATE.filters.category
    ) return false;

    if(!passesTimeFilter(n.posted_time))
        return false;

    return true;

});

}

/* =========================================================
TIME FILTER ENGINE
========================================================= */

function passesTimeFilter(time){

const now =
    Date.now();

const range =
    NOTIFICATION_STATE.filters.timeRange;

if(range==="all")
    return true;

if(range==="1h")
    return now-time<3600000;

if(range==="24h")
    return now-time<86400000;

if(range==="7d")
    return now-time<604800000;

return true;

}

/* =========================================================
SORT ENGINE
========================================================= */

function applyNotificationSort(){

const {field,dir} =
    NOTIFICATION_STATE.sort;

NOTIFICATION_STATE.filtered.sort(
    (a,b)=>
        dir==="asc"
        ?a[field]-b[field]
        :b[field]-a[field]
);

}

/* =========================================================
PAGINATION ENGINE
========================================================= */

function paginateNotifications(){

const start =
    (NOTIFICATION_STATE.pagination.page-1)
    * NOTIFICATION_STATE.pagination.perPage;

return NOTIFICATION_STATE.filtered.slice(
    start,
    start+
    NOTIFICATION_STATE.pagination.perPage
);

}

/* =========================================================
HEADER
========================================================= */

function renderNotificationHeader(){

return `

<div class="notificationviewer-header">
Notification Intelligence Terminal
</div>`;
}/* =========================================================
TOOLBAR
========================================================= */

function renderNotificationToolbar(){

return `

<div class="notificationviewer-toolbar"><input id="notificationSearch"
placeholder="Search notifications">

<select id="notificationAppFilter">
<option value="all">All Apps</option>
${generateAppOptions()}
</select><select id="notificationCategoryFilter">
<option value="all">All Categories</option>
${generateCategoryOptions()}
</select><select id="notificationTimeFilter">
<option value="all">All Time</option>
<option value="1h">Last Hour</option>
<option value="24h">Last 24 Hours</option>
<option value="7d">Last 7 Days</option>
</select><button id="exportNotificationCSV">
Export CSV
</button><button id="exportNotificationJSON">
Export JSON
</button></div>`;
}/* =========================================================
STATS PANEL
========================================================= */

function renderNotificationStats(){

return `

<div class="notificationviewer-stats"
id="notificationStats">Total:
${NOTIFICATION_STATE.stats.total}

</div>`;
}function renderNotificationStatsLive(){

document.getElementById("notificationStats")
.innerHTML="Showing ${NOTIFICATION_STATE.filtered.length} / ${NOTIFICATION_STATE.stats.total} notifications";
}

/* =========================================================
LIST
========================================================= */

function renderNotificationListContainer(){

return `

<div id="notificationList"
class="notificationviewer-list">
</div>`;
}function renderNotificationItems(){

const list =
document.getElementById("notificationList");

list.innerHTML="";

const page =
paginateNotifications();

if(!page.length){

list.innerHTML=
"<div class='notificationviewer-empty'>No notifications</div>";

return;

}

page.forEach(n=>{

list.appendChild(
createNotificationCardAdvanced(n)
);

});
}

/* =========================================================
CARD
========================================================= */

function createNotificationCardAdvanced(n){

const div =
document.createElement("div");

div.className="notificationviewer-item";

div.innerHTML=`

<div class="notificationviewer-icon">
${getAppIcon(n.package,n.app)}
</div><div class="notificationviewer-content"><div class="notificationviewer-top"><div class="notificationviewer-appname">
${escapeHTML(n.app)}
</div><div class="notificationviewer-time">
${n.timeFormatted}
</div></div><div class="notificationviewer-title">
${escapeHTML(n.title)}
</div><div class="notificationviewer-text">
${escapeHTML(n.text)}
</div><div class="notificationviewer-package">
${escapeHTML(n.package)}
</div></div>
`;return div;
}

/* =========================================================
PAGINATION
========================================================= */

function renderNotificationPagination(){

return `

<div id="notificationPagination"
class="notificationviewer-pagination">
</div>`;
}function renderNotificationPaginationControls(){

const totalPages =
Math.ceil(
NOTIFICATION_STATE.filtered.length /
NOTIFICATION_STATE.pagination.perPage
);

document.getElementById(
"notificationPagination"
).innerHTML=`

<button id="notificationPrev">
Prev
</button>Page
${NOTIFICATION_STATE.pagination.page}
/
${totalPages}

<button id="notificationNext">
Next
</button>
`;
}/* =========================================================
EVENT HANDLERS
========================================================= */

function attachNotificationHandlers(){

document.getElementById("notificationSearch")
.oninput=e=>{
NOTIFICATION_STATE.search=
e.target.value.toLowerCase();
runNotificationPipeline();
};

document.getElementById("notificationAppFilter")
.onchange=e=>{
NOTIFICATION_STATE.filters.app=e.target.value;
runNotificationPipeline();
};

document.getElementById("notificationCategoryFilter")
.onchange=e=>{
NOTIFICATION_STATE.filters.category=e.target.value;
runNotificationPipeline();
};

document.getElementById("notificationTimeFilter")
.onchange=e=>{
NOTIFICATION_STATE.filters.timeRange=e.target.value;
runNotificationPipeline();
};

document.getElementById("notificationPrev")
.onclick=()=>{
if(NOTIFICATION_STATE.pagination.page>1)
NOTIFICATION_STATE.pagination.page--;
runNotificationPipeline();
};

document.getElementById("notificationNext")
.onclick=()=>{
NOTIFICATION_STATE.pagination.page++;
runNotificationPipeline();
};

document.getElementById("exportNotificationCSV")
.onclick=exportNotificationCSV;

document.getElementById("exportNotificationJSON")
.onclick=exportNotificationJSON;

}

/* =========================================================
EXPORT ENGINE
========================================================= */

function exportNotificationCSV(){

const rows=
NOTIFICATION_STATE.filtered.map(n=>
"${n.app},${n.package},${n.title},${n.text},${n.fullTime}"
);

downloadNotificationFile(
"notifications.csv",
rows.join("\n")
);

}

function exportNotificationJSON(){

downloadNotificationFile(
"notifications.json",
JSON.stringify(
NOTIFICATION_STATE.filtered,null,2)
);

}

function downloadNotificationFile(name,content){

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
OPTION GENERATORS
========================================================= */

function generateAppOptions(){

return Array.from(
NOTIFICATION_STATE.stats.apps.keys()
).map(a=>
"<option value="${a}">${a}</option>"
).join("");

}

function generateCategoryOptions(){

return Array.from(
NOTIFICATION_STATE.stats.categories.keys()
).map(c=>
"<option value="${c}">${c}</option>"
).join("");

}

function incrementMap(map,key){

map.set(key,(map.get(key)||0)+1);

}

/* =========================================================
UTILITIES
========================================================= */

function formatRelativeTime(ts){

const diff=Date.now()-ts;

const m=Math.floor(diff/60000);
const h=Math.floor(diff/3600000);
const d=Math.floor(diff/86400000);

if(m<1) return "now";
if(m<60) return m+"m ago";
if(h<24) return h+"h ago";
return d+"d ago";

}

function escapeHTML(str){

return (str||"")
.replace(/&/g,"&")
.replace(/</g,"<")
.replace(/>/g,">");

   }
