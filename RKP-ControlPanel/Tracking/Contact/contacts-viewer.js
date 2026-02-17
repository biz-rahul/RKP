/* =========================================================
CONTROLTHEWORLD — ADVANCED CONTACT VIEWER v3.0
Contact Intelligence & Forensic Analysis System
Fully compatible with existing controller
========================================================= */

/* =========================================================
GLOBAL STATE ENGINE
========================================================= */

let CONTACT_STATE = {

raw: [],
normalized: [],
filtered: [],

index: new Map(),

search: "",

filters: {

    duplicate: "all",   // all, unique, duplicates
    letter: "all"

},

sort: {

    field: "name",
    dir: "asc"

},

pagination: {

    page: 1,
    perPage: 100

},

stats: {

    total: 0,
    uniqueNumbers: 0,
    duplicateNumbers: 0
}

};

/* =========================================================
MAIN ENTRY POINT
========================================================= */

function renderContacts(container) {

if (!Array.isArray(currentJSON)) {

    container.innerHTML =
    "<div class='contactsviewer-empty'>Invalid contacts format</div>";

    return;
}

initializeContacts(currentJSON);

container.className = "contactsviewer-app";

container.innerHTML = `
    ${renderHeader()}
    ${renderToolbar()}
    ${renderStats()}
    ${renderListContainer()}
    ${renderPagination()}
`;

attachContactHandlers();

runContactPipeline();

}

/* =========================================================
INITIALIZATION + NORMALIZATION
========================================================= */

function initializeContacts(json) {

CONTACT_STATE.raw = json;

CONTACT_STATE.normalized = [];

CONTACT_STATE.index.clear();

json.forEach(contact => {

    const name =
        contact.name || "Unknown";

    const number =
        normalizeNumber(contact.number);

    const obj = {

        name,
        number,

        firstLetter:
            name.charAt(0).toUpperCase(),

        numberDigits:
            number.replace(/\D/g,"")

    };

    CONTACT_STATE.normalized.push(obj);

    if (!CONTACT_STATE.index.has(number))
        CONTACT_STATE.index.set(number, []);

    CONTACT_STATE.index.get(number).push(obj);

});

calculateContactStats();

}

/* =========================================================
STATS ENGINE
========================================================= */

function calculateContactStats() {

let unique = 0;
let duplicates = 0;

CONTACT_STATE.index.forEach(list => {

    if (list.length > 1)
        duplicates += list.length;
    else
        unique++;

});

CONTACT_STATE.stats = {

    total: CONTACT_STATE.normalized.length,
    uniqueNumbers: unique,
    duplicateNumbers: duplicates

};

}

/* =========================================================
PIPELINE ENGINE
========================================================= */

function runContactPipeline() {

applyContactFilters();

applyContactSort();

renderContactsList();

renderContactsPagination();

renderContactStatsLive();

}

/* =========================================================
FILTER ENGINE
========================================================= */

function applyContactFilters() {

CONTACT_STATE.filtered =
    CONTACT_STATE.normalized.filter(contact => {

    /* SEARCH */

    if (CONTACT_STATE.search) {

        const s = CONTACT_STATE.search;

        if (!(
            contact.name.toLowerCase().includes(s) ||
            contact.number.includes(s)
        )) return false;

    }

    /* DUPLICATE FILTER */

    if (CONTACT_STATE.filters.duplicate !== "all") {

        const isDuplicate =
            CONTACT_STATE.index
            .get(contact.number).length > 1;

        if (
            CONTACT_STATE.filters.duplicate === "duplicates"
            && !isDuplicate
        ) return false;

        if (
            CONTACT_STATE.filters.duplicate === "unique"
            && isDuplicate
        ) return false;

    }

    /* LETTER FILTER */

    if (
        CONTACT_STATE.filters.letter !== "all" &&
        contact.firstLetter !== CONTACT_STATE.filters.letter
    )
    return false;

    return true;

});

}

/* =========================================================
SORT ENGINE
========================================================= */

function applyContactSort() {

const { field, dir } =
    CONTACT_STATE.sort;

CONTACT_STATE.filtered.sort((a,b)=>{

    let v1 = a[field];
    let v2 = b[field];

    return dir === "asc"
        ? v1.localeCompare(v2)
        : v2.localeCompare(v1);

});

}

/* =========================================================
PAGINATION ENGINE
========================================================= */

function paginateContacts() {

const start =
    (CONTACT_STATE.pagination.page-1)
    * CONTACT_STATE.pagination.perPage;

return CONTACT_STATE.filtered.slice(
    start,
    start +
    CONTACT_STATE.pagination.perPage
);

}

/* =========================================================
HEADER
========================================================= */

function renderHeader() {

return `
<div class="contactsviewer-header">
    Contact Intelligence Terminal
</div>`;

}

/* =========================================================
TOOLBAR
========================================================= */

function renderToolbar() {

return `
<div class="contactsviewer-toolbar">

    <input id="contactSearch"
           placeholder="Search name or number">

    <select id="duplicateFilter">

        <option value="all">All</option>
        <option value="unique">Unique</option>
        <option value="duplicates">Duplicates</option>

    </select>

    <select id="letterFilter">

        <option value="all">All Letters</option>

        ${generateLetterOptions()}

    </select>

    <button id="contactSortToggle">
        Toggle Sort
    </button>

    <button id="exportContactsCSV">
        Export CSV
    </button>

    <button id="exportContactsJSON">
        Export JSON
    </button>

</div>`;

}

/* =========================================================
LETTER OPTIONS
========================================================= */

function generateLetterOptions(){

let html="";

for(let i=65;i<=90;i++){

    html+=`<option>${String.fromCharCode(i)}</option>`;

}

return html;

}

/* =========================================================
STATS PANEL
========================================================= */

function renderStats(){

return `
<div class="contactsviewer-stats"
     id="contactStats">

     Total: ${CONTACT_STATE.stats.total}
     |
     Unique: ${CONTACT_STATE.stats.uniqueNumbers}
     |
     Duplicate: ${CONTACT_STATE.stats.duplicateNumbers}

</div>`;

}

function renderContactStatsLive(){

document.getElementById("contactStats")
.innerHTML = `
    Showing ${CONTACT_STATE.filtered.length}
    /
    ${CONTACT_STATE.stats.total}
    contacts
`;

}

/* =========================================================
LIST CONTAINER
========================================================= */

function renderListContainer(){

return `
<div id="contactsList"
     class="contactsviewer-list">
</div>`;

}

/* =========================================================
LIST RENDER
========================================================= */

function renderContactsList(){

const list =
    document.getElementById("contactsList");

list.innerHTML="";

const page =
    paginateContacts();

if(!page.length){

    list.innerHTML =
    "<div class='contactsviewer-empty'>No contacts found</div>";

    return;
}

page.forEach(contact=>{

    list.appendChild(
        createContactCard(contact)
    );

});

}

/* =========================================================
CONTACT CARD
========================================================= */

function createContactCard(contact){

const div =
    document.createElement("div");

div.className =
    "contactsviewer-contact";

const duplicateCount =
    CONTACT_STATE.index
    .get(contact.number).length;

div.innerHTML = `

    <div class="contactsviewer-name">
        ${escapeHTML(contact.name)}
    </div>

    <div class="contactsviewer-number">
        ${escapeHTML(contact.number)}
    </div>

    ${
        duplicateCount>1
        ?
        `<div class="contactsviewer-duplicate">
            Duplicate (${duplicateCount})
         </div>`
        : ""
    }

`;

return div;

}

/* =========================================================
PAGINATION
========================================================= */

function renderPagination(){

return `
<div id="contactsPagination"
     class="contactsviewer-pagination">
</div>`;

}

function renderContactsPagination(){

const totalPages =
    Math.ceil(
        CONTACT_STATE.filtered.length /
        CONTACT_STATE.pagination.perPage
    );

document.getElementById(
    "contactsPagination"
).innerHTML = `

    <button id="contactPrev">
        Prev
    </button>

    Page
    ${CONTACT_STATE.pagination.page}
    /
    ${totalPages}

    <button id="contactNext">
        Next
    </button>

`;

}

/* =========================================================
EVENT HANDLERS
========================================================= */

function attachContactHandlers(){

document.getElementById("contactSearch")
.oninput = e => {

CONTACT_STATE.search =
e.target.value.toLowerCase();

CONTACT_STATE.pagination.page=1;

runContactPipeline();

};

document.getElementById("duplicateFilter")
.onchange = e=>{

CONTACT_STATE.filters.duplicate =
e.target.value;

runContactPipeline();

};

document.getElementById("letterFilter")
.onchange = e=>{

CONTACT_STATE.filters.letter =
e.target.value;

runContactPipeline();

};

document.getElementById("contactSortToggle")
.onclick=()=>{

CONTACT_STATE.sort.dir =
CONTACT_STATE.sort.dir==="asc"
?"desc":"asc";

runContactPipeline();

};

document.getElementById("contactPrev")
.onclick=()=>{

if(CONTACT_STATE.pagination.page>1)
CONTACT_STATE.pagination.page--;

runContactPipeline();

};

document.getElementById("contactNext")
.onclick=()=>{

CONTACT_STATE.pagination.page++;

runContactPipeline();

};

document.getElementById("exportContactsCSV")
.onclick = exportContactsCSV;

document.getElementById("exportContactsJSON")
.onclick = exportContactsJSON;

}

/* =========================================================
EXPORT ENGINE
========================================================= */

function exportContactsCSV(){

const rows =
CONTACT_STATE.filtered.map(c=>
"${c.name},${c.number}");

downloadContactFile(
"contacts.csv",
rows.join("\n")
);

}

function exportContactsJSON(){

downloadContactFile(
"contacts.json",
JSON.stringify(
CONTACT_STATE.filtered,
null,2
)
);

}

function downloadContactFile(name,content){

const blob =
new Blob([content]);

const url =
URL.createObjectURL(blob);

const a =
document.createElement("a");

a.href=url;
a.download=name;
a.click();

URL.revokeObjectURL(url);

}

/* =========================================================
UTILITIES
========================================================= */

function normalizeNumber(num){

if(!num) return "Unknown";

return num.trim();

}

function escapeHTML(str){

return str
.replace(/&/g,"&")
.replace(/</g,"<")
.replace(/>/g,">");

                            }
