/* =========================================================
CONTROLTHEWORLD — ADVANCED APP VIEWER v3.0
Enterprise-grade Android App Intelligence Viewer
Fully compatible with existing controller
========================================================= */

/* =========================================================
GLOBAL STATE ENGINE
========================================================= */

let APP_STATE = {

raw: [],
filtered: [],
indexed: new Map(),

tab: "user",

search: "",

filters: {
    type: "all",
    sizeMin: 0,
    sizeMax: Infinity,
    installFrom: 0,
    installTo: Infinity
},

sort: {
    field: "name",
    dir: "asc"
},

pagination: {
    page: 1,
    perPage: 50
},

stats: {
    total: 0,
    user: 0,
    system: 0,
    totalSize: 0
}

};

/* =========================================================
MAIN ENTRY POINT
========================================================= */

function renderApp(container) {

if (!Array.isArray(currentJSON)) {
    container.innerHTML =
        "<div class='appviewer-empty'>Invalid App JSON format</div>";
    return;
}

initializeAppData(currentJSON);

container.className = "appviewer-app";

container.innerHTML = `
    ${renderHeader()}
    ${renderToolbar()}
    ${renderTabs()}
    ${renderStats()}
    ${renderListContainer()}
    ${renderPagination()}
`;

attachEventHandlers();

runFullPipeline();

}

/* =========================================================
DATA INITIALIZATION + INDEXING
========================================================= */

function initializeAppData(json) {

APP_STATE.raw = json.map(app => {

    const pkg = app.package_name || "";

    const obj = {

        name: app.app_name || formatAppName(pkg),

        package: pkg,

        type: detectAppType(pkg),

        icon: detectIcon(pkg),

        version: app.version_name || "Unknown",

        sizeBytes: app.app_size_bytes || 0,

        size: formatSize(app.app_size_bytes),

        installedTS: app.installed_date || 0,

        installed: formatDate(app.installed_date),

        usageHours: app.usage_hours || 0,

        usageMinutes: app.usage_minutes || 0,

        usageTotalMinutes:
            (app.usage_hours || 0) * 60 +
            (app.usage_minutes || 0)
    };

    APP_STATE.indexed.set(pkg.toLowerCase(), obj);

    return obj;

});

calculateStats();

}

/* =========================================================
STATS ENGINE
========================================================= */

function calculateStats() {

let totalSize = 0;
let user = 0;
let system = 0;

APP_STATE.raw.forEach(app => {

    totalSize += app.sizeBytes;

    if (app.type === "user") user++;
    else system++;
});

APP_STATE.stats = {
    total: APP_STATE.raw.length,
    user,
    system,
    totalSize
};

}

/* =========================================================
FULL PIPELINE ENGINE
========================================================= */

function runFullPipeline() {

applyFilters();

applySort();

renderList();

renderPaginationControls();

renderStatsLive();

}

/* =========================================================
FILTER ENGINE
========================================================= */

function applyFilters() {

const f = APP_STATE.filters;

APP_STATE.filtered = APP_STATE.raw.filter(app => {

    if (APP_STATE.tab !== app.type) return false;

    if (APP_STATE.search) {

        const s = APP_STATE.search;

        if (!(
            app.name.toLowerCase().includes(s) ||
            app.package.toLowerCase().includes(s)
        )) return false;
    }

    if (app.sizeBytes < f.sizeMin) return false;

    if (app.sizeBytes > f.sizeMax) return false;

    if (app.installedTS < f.installFrom) return false;

    if (app.installedTS > f.installTo) return false;

    return true;
});

}

/* =========================================================
SORT ENGINE
========================================================= */

function applySort() {

const { field, dir } = APP_STATE.sort;

APP_STATE.filtered.sort((a, b) => {

    let v1 = a[field];
    let v2 = b[field];

    if (typeof v1 === "string")
        return dir === "asc"
            ? v1.localeCompare(v2)
            : v2.localeCompare(v1);

    return dir === "asc"
        ? v1 - v2
        : v2 - v1;
});

}

/* =========================================================
PAGINATION ENGINE
========================================================= */

function paginate() {

const start =
    (APP_STATE.pagination.page - 1) *
    APP_STATE.pagination.perPage;

return APP_STATE.filtered.slice(
    start,
    start + APP_STATE.pagination.perPage
);

}

/* =========================================================
RENDER HEADER
========================================================= */

function renderHeader() {

return `
    <div class="appviewer-header">
        Android Package Intelligence
    </div>
`;

}

/* =========================================================
RENDER TOOLBAR
========================================================= */

function renderToolbar() {

return `
    <div class="appviewer-toolbar">

        <input
            type="text"
            id="appSearch"
            placeholder="Search name or package"
        >

        <select id="sortField">

            <option value="name">Name</option>
            <option value="sizeBytes">Size</option>
            <option value="installedTS">Install Date</option>
            <option value="usageTotalMinutes">Usage Time</option>

        </select>

        <button id="sortToggle">
            Toggle Sort
        </button>

        <button id="exportCSV">
            Export CSV
        </button>

        <button id="exportJSON">
            Export JSON
        </button>

    </div>
`;

}

/* =========================================================
RENDER TABS
========================================================= */

function renderTabs() {

return `
    <div class="appviewer-tabs">

        <div class="appviewer-tab active"
            id="tab-user">
            USER (${APP_STATE.stats.user})
        </div>

        <div class="appviewer-tab"
            id="tab-system">
            SYSTEM (${APP_STATE.stats.system})
        </div>

    </div>
`;

}

/* =========================================================
STATS PANEL
========================================================= */

function renderStats() {

return `
    <div class="appviewer-stats" id="appStats">

        Total Apps: ${APP_STATE.stats.total}
        |
        Storage Used: ${formatSize(APP_STATE.stats.totalSize)}

    </div>
`;

}

function renderStatsLive() {

const el = document.getElementById("appStats");

if (!el) return;

el.innerHTML = `
    Showing ${APP_STATE.filtered.length}
    of ${APP_STATE.stats.total}
    |
    Page ${APP_STATE.pagination.page}
`;

}

/* =========================================================
LIST CONTAINER
========================================================= */

function renderListContainer() {

return `
    <div class="appviewer-list"
         id="appList"></div>
`;

}

/* =========================================================
RENDER LIST
========================================================= */

function renderList() {

const list = document.getElementById("appList");

list.innerHTML = "";

const pageItems = paginate();

if (!pageItems.length) {

    list.innerHTML =
        "<div class='appviewer-empty'>No apps found</div>";

    return;
}

pageItems.forEach(app => {

    list.appendChild(createAppItem(app));

});

}

/* =========================================================
PAGINATION CONTROLS
========================================================= */

function renderPagination() {

return `
    <div class="appviewer-pagination"
         id="appPagination"></div>
`;

}

function renderPaginationControls() {

const el = document.getElementById("appPagination");

const totalPages =
    Math.ceil(
        APP_STATE.filtered.length /
        APP_STATE.pagination.perPage
    );

el.innerHTML = `
    <button id="prevPage">Prev</button>
    Page ${APP_STATE.pagination.page}
    of ${totalPages}
    <button id="nextPage">Next</button>
`;

}

/* =========================================================
APP CARD
========================================================= */

function createAppItem(app) {

const div = document.createElement("div");

div.className = "appviewer-item";

div.innerHTML = `
    <div class="appviewer-icon">
        <i class="${app.icon}"></i>
    </div>

    <div class="appviewer-details">

        <div class="appviewer-name">
            ${app.name}
        </div>

        <div class="appviewer-package">
            ${app.package}
        </div>

        <div class="appviewer-meta">

            Version ${app.version}
            |
            ${app.size}
            |
            Installed ${app.installed}

        </div>

    </div>
`;

return div;

}

/* =========================================================
EVENT ENGINE
========================================================= */

function attachEventHandlers() {

document.getElementById("appSearch")
    .oninput = e => {

        APP_STATE.search =
            e.target.value.toLowerCase();

        APP_STATE.pagination.page = 1;

        runFullPipeline();
    };

document.getElementById("sortField")
    .onchange = e => {

        APP_STATE.sort.field = e.target.value;

        runFullPipeline();
    };

document.getElementById("sortToggle")
    .onclick = () => {

        APP_STATE.sort.dir =
            APP_STATE.sort.dir === "asc"
            ? "desc"
            : "asc";

        runFullPipeline();
    };

document.getElementById("tab-user")
    .onclick = () => {

        APP_STATE.tab = "user";

        runFullPipeline();
    };

document.getElementById("tab-system")
    .onclick = () => {

        APP_STATE.tab = "system";

        runFullPipeline();
    };

document.getElementById("prevPage")
    .onclick = () => {

        if (APP_STATE.pagination.page > 1) {

            APP_STATE.pagination.page--;

            runFullPipeline();
        }
    };

document.getElementById("nextPage")
    .onclick = () => {

        APP_STATE.pagination.page++;

        runFullPipeline();
    };

document.getElementById("exportCSV")
    .onclick = exportCSV;

document.getElementById("exportJSON")
    .onclick = exportJSON;

}

/* =========================================================
EXPORT ENGINE
========================================================= */

function exportCSV() {

const rows = APP_STATE.filtered.map(a =>
    `${a.name},${a.package},${a.version},${a.size}`
);

downloadFile(
    "apps.csv",
    rows.join("\n")
);

}

function exportJSON() {

downloadFile(
    "apps.json",
    JSON.stringify(
        APP_STATE.filtered,
        null,
        2
    )
);

}

function downloadFile(name, content) {

const blob = new Blob(
    [content],
    { type: "text/plain" }
);

const url = URL.createObjectURL(blob);

const a = document.createElement("a");

a.href = url;

a.download = name;

a.click();

URL.revokeObjectURL(url);

}

/* =========================================================
UTILITIES
========================================================= */

function detectAppType(pkg) {

const systemPrefixes = [
    "com.android",
    "android",
    "com.google.android",
    "com.samsung",
    "com.miui",
    "com.oppo",
    "com.huawei"
];

return systemPrefixes.some(p =>
    pkg.startsWith(p))
    ? "system"
    : "user";

}

function detectIcon(pkg) {

const p = pkg.toLowerCase();

if (p.includes("whatsapp"))
    return "fa-brands fa-whatsapp";

if (p.includes("instagram"))
    return "fa-brands fa-instagram";

if (p.includes("google"))
    return "fa-brands fa-google";

return "fa-solid fa-mobile";

}

function formatSize(bytes) {

if (!bytes) return "0 B";

const units =
    ["B", "KB", "MB", "GB"];

let i = 0;

while (bytes >= 1024 &&
       i < units.length - 1) {

    bytes /= 1024;
    i++;
}

return bytes.toFixed(1)
       + " "
       + units[i];

}

function formatDate(ts) {

if (!ts) return "Unknown";

return new Date(ts)
    .toLocaleDateString();

}

function formatAppName(pkg) {

const parts = pkg.split(".");

return parts[parts.length - 1];

}
