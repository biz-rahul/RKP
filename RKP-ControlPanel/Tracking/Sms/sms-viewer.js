/* =========================================================
CONTROLTHEWORLD — SMS INTELLIGENCE VIEWER v4.0
Forensic Conversation Analysis Engine
Fully compatible with existing controller
========================================================= */

/* =========================================================
GLOBAL STATE ENGINE
========================================================= */

let SMS_STATE = {

raw: [],

threads: [],

filtered: [],

index: [],

search: "",

filters: {

    contact: "all",
    type: "all",       // all, inbox, sent
    unread: "all",     // all, unread
    financial: "all"   // all, financial, non-financial

},

pagination: {

    page: 1,
    perPage: 50

},

stats: {

    totalThreads: 0,
    totalMessages: 0,
    unreadMessages: 0,
    financialMessages: 0

}

};

/* =========================================================
MAIN ENTRY
========================================================= */

function renderSMS(container) {

if (!Array.isArray(currentJSON)) {

    container.innerHTML =
    "<div class='smsviewer-empty'>Invalid SMS format</div>";

    return;
}

initializeSMS(currentJSON);

container.className = "smsviewer-app";

container.innerHTML = `
    ${renderSMSHeader()}
    ${renderSMSToolbar()}
    ${renderSMSStats()}
    ${renderSMSListContainer()}
    ${renderSMSPagination()}
`;

attachSMSHandlers();

runSMSPipeline();

}

/* =========================================================
INITIALIZATION ENGINE
========================================================= */

function initializeSMS(json){

SMS_STATE.raw = json;

SMS_STATE.threads = json.map(thread=>{

    const messages =
        thread.messages
        .sort((a,b)=>a.date-b.date);

    const latest =
        messages[messages.length-1];

    const unread =
        messages.some(m=>m.read===0);

    messages.forEach(m=>{

        SMS_STATE.index.push({

            thread_id: thread.thread_id,

            address: thread.address,

            body: m.body,

            date: m.date,

            type: m.type,

            read: m.read,

            financial:
                isFinancialMessage(m.body)

        });

    });

    return {

        address: thread.address,

        name: thread.name || thread.address,

        thread_id: thread.thread_id,

        messages,

        latest,

        unread,

        messageCount: messages.length,

        financialCount:
            messages.filter(
                m=>isFinancialMessage(m.body)
            ).length

    };

});

calculateSMSStats();

}

/* =========================================================
FINANCIAL MESSAGE DETECTOR
========================================================= */

function isFinancialMessage(text){

if(!text) return false;

const keywords = [

    "credited",
    "debited",
    "upi",
    "bank",
    "transaction",
    "a/c",
    "account",
    "rs.",
    "payment",
    "balance"

];

text=text.toLowerCase();

return keywords.some(k=>text.includes(k));

}

/* =========================================================
STATS ENGINE
========================================================= */

function calculateSMSStats(){

SMS_STATE.stats.totalThreads =
    SMS_STATE.threads.length;

SMS_STATE.stats.totalMessages =
    SMS_STATE.index.length;

SMS_STATE.stats.unreadMessages =
    SMS_STATE.index.filter(
        m=>m.read===0
    ).length;

SMS_STATE.stats.financialMessages =
    SMS_STATE.index.filter(
        m=>m.financial
    ).length;

}

/* =========================================================
PIPELINE ENGINE
========================================================= */

function runSMSPipeline(){

applySMSFilters();

renderThreadListAdvanced();

renderSMSStatsLive();

renderSMSPaginationControls();

}

/* =========================================================
FILTER ENGINE
========================================================= */

function applySMSFilters(){

SMS_STATE.filtered =
    SMS_STATE.threads.filter(thread=>{

    if(SMS_STATE.search){

        const s =
            SMS_STATE.search;

        const matchThread =
            thread.address.toLowerCase()
            .includes(s);

        const matchMessage =
            thread.messages.some(
                m=>m.body.toLowerCase()
                .includes(s)
            );

        if(!matchThread && !matchMessage)
            return false;

    }

    if(
        SMS_STATE.filters.unread==="unread" &&
        !thread.unread
    ) return false;

    if(
        SMS_STATE.filters.financial==="financial" &&
        thread.financialCount===0
    ) return false;

    if(
        SMS_STATE.filters.financial==="non-financial" &&
        thread.financialCount>0
    ) return false;

    return true;

});

}

/* =========================================================
LIST RENDER
========================================================= */

function renderSMSListContainer(){

return `

<div id="smsList"
class="smsviewer-list">
</div>`;
}function renderThreadListAdvanced(){

const list=
document.getElementById("smsList");

list.innerHTML="";

const page=
paginateThreads();

if(!page.length){

list.innerHTML=
"<div class='smsviewer-empty'>No messages found</div>";

return;

}

page.forEach(thread=>{

list.appendChild(
createThreadItemAdvanced(thread)
);

});
}

/* =========================================================
THREAD CARD
========================================================= */

function createThreadItemAdvanced(thread){

const div=
document.createElement("div");

div.className=
"smsviewer-thread-item"+
(thread.unread?" smsviewer-unread":"");

div.innerHTML=`

<div class="smsviewer-thread-top"><div class="smsviewer-address">
${escapeHTML(thread.address)}
</div><div class="smsviewer-time">
${formatTime(thread.latest.date)}
</div></div><div class="smsviewer-preview">
${escapeHTML(thread.latest.body)}
</div><div class="smsviewer-meta">Messages: ${thread.messageCount}
|
Financial: ${thread.financialCount}

</div>
`;div.onclick=()=>openThreadAdvanced(thread);

return div;
}

/* =========================================================
THREAD VIEW
========================================================= */

function openThreadAdvanced(thread){

const chat=document.createElement("div");

chat.className="smsviewer-chat";

chat.innerHTML=`

<div class="smsviewer-chat-header"><div class="smsviewer-back">←</div>${escapeHTML(thread.address)}

</div><div class="smsviewer-chat-body"
id="chatBody">
</div>
`;document.querySelector(".smsviewer-app")
.appendChild(chat);

chat.querySelector(".smsviewer-back")
.onclick=()=>chat.remove();

const body=
chat.querySelector("#chatBody");

thread.messages.forEach(msg=>{

body.appendChild(
createMessageBubbleAdvanced(msg)
);

});

body.scrollTop=
body.scrollHeight;
}

/* =========================================================
MESSAGE BUBBLE
========================================================= */

function createMessageBubbleAdvanced(msg){

const div=
document.createElement("div");

const typeClass=
msg.type===2
?"smsviewer-sent"
:"smsviewer-inbox";

const financialClass=
isFinancialMessage(msg.body)
?" smsviewer-financial"
:"";

div.className=
"smsviewer-bubble "+
typeClass+
financialClass;

div.innerHTML=`

${escapeHTML(msg.body)}

<div class="smsviewer-msg-time">
${formatFullTime(msg.date)}
</div>
`;return div;
}

/* =========================================================
TOOLBAR
========================================================= */

function renderSMSToolbar(){

return `

<div class="smsviewer-toolbar"><input id="smsSearch"
placeholder="Search messages">

<select id="smsUnreadFilter">
<option value="all">All</option>
<option value="unread">Unread Only</option>
</select><select id="smsFinancialFilter">
<option value="all">All</option>
<option value="financial">Financial Only</option>
<option value="non-financial">Non-Financial</option>
</select><button id="exportSMSCSV">
Export CSV
</button><button id="exportSMSJSON">
Export JSON
</button></div>`;
}/* =========================================================
STATS PANEL
========================================================= */

function renderSMSHeader(){

return `

<div class="smsviewer-header">
SMS Intelligence Terminal
</div>`;
}function renderSMSStats(){

return `

<div class="smsviewer-stats"
id="smsStats">Threads:
${SMS_STATE.stats.totalThreads}
|
Messages:
${SMS_STATE.stats.totalMessages}

</div>`;
}function renderSMSStatsLive(){

document.getElementById("smsStats")
.innerHTML=`

Threads:
${SMS_STATE.filtered.length}
/
${SMS_STATE.stats.totalThreads}

|
Financial:
${SMS_STATE.stats.financialMessages}

`;
}

/* =========================================================
PAGINATION
========================================================= */

function renderSMSPagination(){

return `

<div id="smsPagination"
class="smsviewer-pagination">
</div>`;
}function renderSMSPaginationControls(){

const totalPages=
Math.ceil(
SMS_STATE.filtered.length/
SMS_STATE.pagination.perPage
);

document.getElementById(
"smsPagination"
).innerHTML=`

<button id="smsPrev">
Prev
</button>Page
${SMS_STATE.pagination.page}
/
${totalPages}

<button id="smsNext">
Next
</button>
`;
}function paginateThreads(){

const start=
(SMS_STATE.pagination.page-1)
*SMS_STATE.pagination.perPage;

return SMS_STATE.filtered.slice(
start,
start+
SMS_STATE.pagination.perPage
);
}

/* =========================================================
EXPORT ENGINE
========================================================= */

function exportSMSCSV(){

const rows=
SMS_STATE.index.map(m=>
"${m.address},${m.body},${new Date(m.date)}"
);

downloadSMSFile(
"sms.csv",
rows.join("\n")
);

}

function exportSMSJSON(){

downloadSMSFile(
"sms.json",
JSON.stringify(
SMS_STATE.index,null,2)
);

}

function downloadSMSFile(name,content){

const blob=new Blob([content]);

const url=URL.createObjectURL(blob);

const a=document.createElement("a");

a.href=url;
a.download=name;
a.click();

URL.revokeObjectURL(url);

}

/* =========================================================
EVENT HANDLERS
========================================================= */

function attachSMSHandlers(){

document.getElementById("smsSearch")
.oninput=e=>{
SMS_STATE.search=e.target.value.toLowerCase();
runSMSPipeline();
};

document.getElementById("smsUnreadFilter")
.onchange=e=>{
SMS_STATE.filters.unread=e.target.value;
runSMSPipeline();
};

document.getElementById("smsFinancialFilter")
.onchange=e=>{
SMS_STATE.filters.financial=e.target.value;
runSMSPipeline();
};

document.getElementById("exportSMSCSV")
.onclick=exportSMSCSV;

document.getElementById("exportSMSJSON")
.onclick=exportSMSJSON;

}

/* =========================================================
UTILITIES
========================================================= */

function escapeHTML(str){

return (str||"")
.replace(/&/g,"&")
.replace(/</g,"<")
.replace(/>/g,">");
}

function formatTime(ts){

return new Date(ts)
.toLocaleDateString();

}

function formatFullTime(ts){

return new Date(ts)
.toLocaleString();

}
