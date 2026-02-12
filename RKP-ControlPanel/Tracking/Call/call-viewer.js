/* =========================================
   FINAL CALL VIEWER JS
   SUPPORTS NEW JSON STRUCTURE
========================================= */

let callData = [];

/* =========================================
   MAIN ENTRY
========================================= */

function renderCall(container) {

    if (!Array.isArray(currentJSON)) {

        container.innerHTML =
            "<div class='callviewer-empty'>Invalid call log format</div>";

        return;
    }

    // Process contacts
    callData = currentJSON.map(contact => {

        const callsSorted = contact.calls
            .sort((a, b) => b.date - a.date);

        const latestCall = callsSorted[0];

        return {

            name: contact.name || "Unknown",
            number: contact.number,
            calls: callsSorted,
            latestCall

        };

    }).sort((a, b) =>
        b.latestCall.date - a.latestCall.date
    );

    container.className = "callviewer-app";

    container.innerHTML = `
        <div class="callviewer-header">Call Log Terminal</div>

        <div class="callviewer-search">
            <input type="text" id="callSearch"
            placeholder="Search name or number">
        </div>

        <div class="callviewer-list" id="callList"></div>
    `;

    renderCallList();

    document.getElementById("callSearch")
        .addEventListener("input", function() {

            renderCallList(this.value.toLowerCase());

        });
}

/* =========================================
   RENDER LIST
========================================= */

function renderCallList(search = "") {

    const list = document.getElementById("callList");

    list.innerHTML = "";

    const filtered = callData.filter(contact => {

        if (!search) return true;

        return (
            contact.name.toLowerCase().includes(search) ||
            contact.number.includes(search)
        );
    });

    if (filtered.length === 0) {

        list.innerHTML =
            "<div class='callviewer-empty'>No call logs found</div>";

        return;
    }

    filtered.forEach(contact => {

        list.appendChild(createContactItem(contact));

    });
}

/* =========================================
   CREATE CONTACT ITEM
========================================= */

function createContactItem(contact) {

    const item = document.createElement("div");

    item.className = "callviewer-item";

    const avatarLetter = contact.name[0].toUpperCase();

    const latest = contact.latestCall;

    item.innerHTML = `
        <div class="callviewer-contact">

            <div class="callviewer-avatar">
                ${avatarLetter}
            </div>

            <div class="callviewer-details">

                <div class="callviewer-name">
                    ${contact.name}
                </div>

                <div class="callviewer-number">
                    ${contact.number}
                </div>

                <div class="callviewer-meta
                    ${getCallTypeClass(latest.type)}">

                    ${getCallTypeText(latest.type)}
                    • ${formatDateTime(latest.date)}
                    • ${formatDuration(latest.duration)}

                </div>

            </div>

            <div class="callviewer-action"
                 onclick="searchNumber('${contact.number}')">

                🔍

            </div>

        </div>

        <div class="callviewer-history">

            ${contact.calls.map(call => `

                <div class="callviewer-call">

                    <div class="
                        callviewer-call-type
                        ${getCallTypeClass(call.type)}">

                        ${getCallTypeText(call.type)}

                    </div>

                    <div class="callviewer-call-time">

                        ${formatDateTime(call.date)}
                        • ${formatDuration(call.duration)}

                    </div>

                </div>

            `).join("")}

        </div>
    `;

    // Toggle history
    item.onclick = function(e) {

        if (e.target.classList.contains("callviewer-action"))
            return;

        const history =
            item.querySelector(".callviewer-history");

        history.classList.toggle("active");
    };

    return item;
}

/* =========================================
   CALL TYPE TEXT
========================================= */

function getCallTypeText(type) {

    switch(type) {

        case 1: return "Incoming";

        case 2: return "Outgoing";

        case 3: return "Missed";

        case 5: return "Rejected";

        default: return "Unknown";
    }
}

/* =========================================
   CALL TYPE CLASS
========================================= */

function getCallTypeClass(type) {

    switch(type) {

        case 1: return "call-incoming";

        case 2: return "call-outgoing";

        case 3: return "call-missed";

        case 5: return "call-rejected";

        default: return "";
    }
}

/* =========================================
   FORMAT DATE TIME
========================================= */

function formatDateTime(timestamp) {

    const d = new Date(timestamp);

    return d.toLocaleString();
}

/* =========================================
   FORMAT DURATION
========================================= */

function formatDuration(seconds) {

    if (!seconds) return "0s";

    const m = Math.floor(seconds / 60);
    const s = seconds % 60;

    if (m > 0)
        return `${m}m ${s}s`;

    return `${s}s`;
}

/* =========================================
   GOOGLE SEARCH
========================================= */

function searchNumber(number) {

    window.open(
        "https://www.google.com/search?q=" +
        encodeURIComponent(number),
        "_blank"
    );
}
