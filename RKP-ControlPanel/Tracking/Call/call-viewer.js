/* =========================================
   CALL LOG VIEWER ENGINE
========================================= */

function renderCall(container) {
    if (!Array.isArray(currentJSON)) {
        container.innerHTML = "<p>Invalid call log format.</p>";
        return;
    }

    // Sort by date (latest first)
    const calls = [...currentJSON].sort((a, b) => b.date - a.date);

    container.className = "call-app";
    container.innerHTML = `
        <div class="call-header">Recent Calls</div>
        <div class="call-search">
            <input type="text" id="callSearch" placeholder="Search by number">
        </div>
        <div class="call-list" id="callList"></div>
    `;

    const list = document.getElementById("callList");

    calls.forEach(call => {
        const item = createCallItem(call);
        list.appendChild(item);
    });

    // Search logic
    document.getElementById("callSearch").addEventListener("input", function () {
        const query = this.value.toLowerCase();
        filterCalls(query);
    });
}

/* =========================================
   CREATE CALL ITEM
========================================= */

function createCallItem(call) {

    const wrapper = document.createElement("div");

    const item = document.createElement("div");
    item.className = "call-item";

    const icon = document.createElement("div");
    icon.className = "call-icon";

    const { label, className, symbol } = getCallType(call.type);
    icon.classList.add(className);
    icon.textContent = symbol;

    const details = document.createElement("div");
    details.className = "call-details";

    const number = document.createElement("div");
    number.className = "call-number";
    number.textContent = call.number;

    const meta = document.createElement("div");
    meta.className = "call-meta";
    meta.textContent = `${label} • ${formatDate(call.date)} • ${formatDuration(call.duration)}`;

    details.appendChild(number);
    details.appendChild(meta);

    item.appendChild(icon);
    item.appendChild(details);

    const expanded = document.createElement("div");
    expanded.className = "call-expanded";

    expanded.innerHTML = `
        <div><strong>Number:</strong> ${call.number}</div>
        <div><strong>Type:</strong> ${label}</div>
        <div><strong>Date:</strong> ${formatFullDate(call.date)}</div>
        <div><strong>Duration:</strong> ${formatDuration(call.duration)}</div>
        <div class="call-actions">
            <button>Call Back</button>
            <button>Message</button>
        </div>
    `;

    item.addEventListener("click", () => {
        expanded.classList.toggle("active");
    });

    wrapper.appendChild(item);
    wrapper.appendChild(expanded);

    return wrapper;
}

/* =========================================
   TYPE MAPPING
========================================= */

function getCallType(type) {
    switch (type) {
        case 1:
            return { label: "Incoming", className: "call-incoming", symbol: "⬇" };
        case 2:
            return { label: "Outgoing", className: "call-outgoing", symbol: "⬆" };
        case 3:
            return { label: "Missed", className: "call-missed", symbol: "✖" };
        default:
            return { label: "Unknown", className: "call-incoming", symbol: "?" };
    }
}

/* =========================================
   DATE FORMATTERS
========================================= */

function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
}

function formatFullDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
}

/* =========================================
   DURATION FORMATTER
========================================= */

function formatDuration(seconds) {
    if (!seconds) return "0 sec";

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
        hrs > 0 ? hrs + "h" : null,
        mins > 0 ? mins + "m" : null,
        secs + "s"
    ].filter(Boolean).join(" ");
}

/* =========================================
   SEARCH FILTER
========================================= */

function filterCalls(query) {
    const items = document.querySelectorAll(".call-item");

    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.parentElement.style.display = text.includes(query) ? "" : "none";
    });
}
