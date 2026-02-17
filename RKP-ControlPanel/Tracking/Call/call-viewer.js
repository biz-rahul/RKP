/* =========================================================
CONTROLTHEWORLD — ADVANCED CALL VIEWER v3.0
Forensic Call Intelligence & Analysis Engine
Fully compatible with existing controller
========================================================= */

/* =========================================================
GLOBAL STATE ENGINE
========================================================= */

let CALL_STATE = {

rawContacts: [],
rawCalls: [],
filteredCalls: [],

search: "",

filters: {

    type: "all",     // incoming, outgoing, missed, rejected
    minDuration: 0,
    maxDuration: Infinity,

    dateFrom: 0,
    dateTo: Infinity

},

sort: {

    field: "date",
    dir: "desc"

},

pagination: {

    page: 1,
    perPage: 50

},

stats: {

    totalCalls: 0,
    incoming: 0,
    outgoing: 0,
    missed: 0,
    rejected: 0,
    totalDuration: 0

}

};

/* =========================================================
MAIN ENTRY
========================================================= */

function renderCall(container) {

if (!Array.isArray(currentJSON)) {

    container.innerHTML =
        "<div class='callviewer-empty'>Invalid call log format</div>";

    return;
}

initializeCallData(currentJSON);

container.className = "callviewer-app";

container.innerHTML = `
    ${renderHeader()}
    ${renderToolbar()}
    ${renderStats()}
    ${renderListContainer()}
    ${renderPagination()}
`;

attachCallHandlers();

runCallPipeline();

}

/* =========================================================
DATA INITIALIZATION
========================================================= */

function initializeCallData(json) {

CALL_STATE.rawContacts = json;

CALL_STATE.rawCalls = [];

json.forEach(contact => {

    const name = contact.name || "Unknown";
    const number = contact.number || "";

    contact.calls.forEach(call => {

        CALL_STATE.rawCalls.push({

            name,
            number,

            type: call.type,

            date: call.date,

            duration: call.duration,

            durationFormatted:
                formatDuration(call.duration),

            dateFormatted:
                formatDateTime(call.date)

        });

    });

});

calculateCallStats();

}

/* =========================================================
STATS ENGINE
========================================================= */

function calculateCallStats() {

let incoming = 0;
let outgoing = 0;
let missed = 0;
let rejected = 0;
let totalDuration = 0;

CALL_STATE.rawCalls.forEach(call => {

    totalDuration += call.duration;

    switch(call.type) {

        case 1: incoming++; break;
        case 2: outgoing++; break;
        case 3: missed++; break;
        case 5: rejected++; break;

    }

});

CALL_STATE.stats = {

    totalCalls: CALL_STATE.rawCalls.length,
    incoming,
    outgoing,
    missed,
    rejected,
    totalDuration

};

}

/* =========================================================
PIPELINE ENGINE
========================================================= */

function runCallPipeline() {

applyCallFilters();

applyCallSort();

renderCallList();

renderCallPagination();

renderCallStatsLive();

}

/* =========================================================
FILTER ENGINE
========================================================= */

function applyCallFilters() {

const f = CALL_STATE.filters;

CALL_STATE.filteredCalls =
    CALL_STATE.rawCalls.filter(call => {

    if (CALL_STATE.search) {

        const s = CALL_STATE.search;

        if (!(
            call.name.toLowerCase().includes(s) ||
            call.number.includes(s)
        )) return false;
    }

    if (f.type !== "all" &&
        call.type !== Number(f.type))
        return false;

    if (call.duration < f.minDuration)
        return false;

    if (call.duration > f.maxDuration)
        return false;

    if (call.date < f.dateFrom)
        return false;

    if (call.date > f.dateTo)
        return false;

    return true;
});

}

/* =========================================================
SORT ENGINE
========================================================= */

function applyCallSort() {

const { field, dir } = CALL_STATE.sort;

CALL_STATE.filteredCalls.sort((a, b) => {

    let v1 = a[field];
    let v2 = b[field];

    return dir === "asc"
        ? v1 - v2
        : v2 - v1;
});

}

/* =========================================================
PAGINATION ENGINE
========================================================= */

function paginateCalls() {

const start =
    (CALL_STATE.pagination.page - 1)
    * CALL_STATE.pagination.perPage;

return CALL_STATE.filteredCalls.slice(
    start,
    start + CALL_STATE.pagination.perPage
);

}

/* =========================================================
HEADER
========================================================= */

function renderHeader() {

return `
    <div class="callviewer-header">
        Call Intelligence Terminal
    </div>
`;

}

/* =========================================================
TOOLBAR
========================================================= */

function renderToolbar() {

return `
    <div class="callviewer-toolbar">

        <input
            type="text"
            id="callSearch"
            placeholder="Search name or number"
        >

        <select id="callTypeFilter">

            <option value="all">All Types</option>
            <option value="1">Incoming</option>
            <option value="2">Outgoing</option>
            <option value="3">Missed</option>
            <option value="5">Rejected</option>

        </select>

        <select id="callSortField">

            <option value="date">Date</option>
            <option value="duration">Duration</option>

        </select>

        <button id="callSortToggle">
            Toggle Sort
        </button>

        <button id="exportCallCSV">
            Export CSV
        </button>

        <button id="exportCallJSON">
            Export JSON
        </button>

    </div>
`;

}

/* =========================================================
STATS PANEL
========================================================= */

function renderStats() {

return `
    <div class="callviewer-stats"
         id="callStats">

        Total Calls:
        ${CALL_STATE.stats.totalCalls}

        |
        Duration:
        ${formatDuration(
            CALL_STATE.stats.totalDuration
        )}

    </div>
`;

}

function renderCallStatsLive() {

const el =
    document.getElementById("callStats");

el.innerHTML = `
    Showing
    ${CALL_STATE.filteredCalls.length}
    /
    ${CALL_STATE.stats.totalCalls}
    calls
`;

}

/* =========================================================
LIST CONTAINER
========================================================= */

function renderListContainer() {

return `
    <div class="callviewer-list"
         id="callList"></div>
`;

}

/* =========================================================
RENDER CALL LIST
========================================================= */

function renderCallList() {

const list =
    document.getElementById("callList");

list.innerHTML = "";

const calls = paginateCalls();

if (!calls.length) {

    list.innerHTML =
    "<div class='callviewer-empty'>No calls found</div>";

    return;
}

calls.forEach(call => {

    list.appendChild(
        createCallItem(call)
    );

});

}

/* =========================================================
CALL ITEM
========================================================= */

function createCallItem(call) {

const div =
    document.createElement("div");

div.className =
    "callviewer-item";

div.innerHTML = `

    <div class="callviewer-name">
        ${call.name}
    </div>

    <div class="callviewer-number">
        ${call.number}
    </div>

    <div class="callviewer-meta
        ${getCallTypeClass(call.type)}">

        ${getCallTypeText(call.type)}
        |
        ${call.dateFormatted}
        |
        ${call.durationFormatted}

    </div>

`;

return div;

}

/* =========================================================
PAGINATION
========================================================= */

function renderPagination() {

return `
    <div class="callviewer-pagination"
         id="callPagination"></div>
`;

}

function renderCallPagination() {

const el =
    document.getElementById(
        "callPagination"
    );

const totalPages =
    Math.ceil(
        CALL_STATE.filteredCalls.length /
        CALL_STATE.pagination.perPage
    );

el.innerHTML = `

    <button id="callPrev">
        Prev
    </button>

    Page
    ${CALL_STATE.pagination.page}
    /
    ${totalPages}

    <button id="callNext">
        Next
    </button>

`;

}

/* =========================================================
EVENT HANDLERS
========================================================= */

function attachCallHandlers() {

document.getElementById("callSearch")
    .oninput = e => {

    CALL_STATE.search =
        e.target.value.toLowerCase();

    CALL_STATE.pagination.page = 1;

    runCallPipeline();
};

document.getElementById("callTypeFilter")
    .onchange = e => {

    CALL_STATE.filters.type =
        e.target.value;

    runCallPipeline();
};

document.getElementById("callSortField")
    .onchange = e => {

    CALL_STATE.sort.field =
        e.target.value;

    runCallPipeline();
};

document.getElementById("callSortToggle")
    .onclick = () => {

    CALL_STATE.sort.dir =
        CALL_STATE.sort.dir === "asc"
        ? "desc"
        : "asc";

    runCallPipeline();
};

document.getElementById("callPrev")
    .onclick = () => {

    if (CALL_STATE.pagination.page > 1)
        CALL_STATE.pagination.page--;

    runCallPipeline();
};

document.getElementById("callNext")
    .onclick = () => {

    CALL_STATE.pagination.page++;

    runCallPipeline();
};

document.getElementById("exportCallCSV")
    .onclick = exportCallCSV;

document.getElementById("exportCallJSON")
    .onclick = exportCallJSON;

}

/* =========================================================
EXPORT ENGINE
========================================================= */

function exportCallCSV() {

const rows =
    CALL_STATE.filteredCalls.map(c =>

    `${c.name},${c.number},${getCallTypeText(c.type)},${c.dateFormatted},${c.durationFormatted}`
);

downloadCallFile(
    "calls.csv",
    rows.join("\n")
);

}

function exportCallJSON() {

downloadCallFile(
    "calls.json",
    JSON.stringify(
        CALL_STATE.filteredCalls,
        null,
        2
    )
);

}

function downloadCallFile(name, content) {

const blob =
    new Blob([content]);

const url =
    URL.createObjectURL(blob);

const a =
    document.createElement("a");

a.href = url;
a.download = name;
a.click();

URL.revokeObjectURL(url);

}

/* =========================================================
UTILITIES
========================================================= */

function getCallTypeText(type) {

return {
    1: "Incoming",
    2: "Outgoing",
    3: "Missed",
    5: "Rejected"
}[type] || "Unknown";

}

function getCallTypeClass(type) {

return {
    1: "call-incoming",
    2: "call-outgoing",
    3: "call-missed",
    5: "call-rejected"
}[type] || "";

}

function formatDateTime(ts) {

return new Date(ts)
    .toLocaleString();

}

function formatDuration(sec) {

if (!sec) return "0s";

const m =
    Math.floor(sec / 60);

const s =
    sec % 60;

return m > 0
    ? `${m}m ${s}s`
    : `${s}s`;

    }
