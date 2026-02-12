/* =========================================
   ADVANCED HACKING SMS VIEWER ENGINE
========================================= */

function renderSMS(container) {

    if (!Array.isArray(currentJSON)) {
        container.innerHTML = "<p>Invalid SMS format</p>";
        return;
    }

    const grouped = {};

    // Group by address
    currentJSON.forEach(msg => {
        if (!grouped[msg.address]) grouped[msg.address] = [];
        grouped[msg.address].push(msg);
    });

    const conversations = Object.keys(grouped).map(address => {

        const messages = grouped[address]
            .sort((a, b) => a.date - b.date);

        return {
            address,
            messages,
            latest: messages[messages.length - 1]
        };
    }).sort((a, b) => b.latest.date - a.latest.date);

    container.className = "sms-app";

    container.innerHTML = `
        <div class="sms-header">Secure Messages Terminal</div>
        <div class="sms-search">
            <input type="text" id="smsSearch" placeholder="Search conversation">
        </div>
        <div class="sms-list" id="smsList"></div>
    `;

    const list = document.getElementById("smsList");

    conversations.forEach(conv => {
        list.appendChild(createConversationItem(conv));
    });

    document.getElementById("smsSearch")
        .addEventListener("input", function () {
            filterSMS(this.value.toLowerCase());
        });
}

/* =========================================
   CONVERSATION ITEM
========================================= */

function createConversationItem(conv) {

    const item = document.createElement("div");
    item.className = "sms-item";

    item.innerHTML = `
        <div class="sms-address">${conv.address}</div>
        <div class="sms-preview">${conv.latest.body}</div>
    `;

    item.addEventListener("click", () => openThread(conv));

    return item;
}

/* =========================================
   OPEN THREAD
========================================= */

function openThread(conv) {

    const thread = document.createElement("div");
    thread.className = "sms-thread";

    thread.innerHTML = `
        <div class="thread-header">
            <button>←</button>
            ${conv.address}
        </div>
        <div class="thread-messages" id="threadMessages"></div>
    `;

    document.querySelector(".sms-app").appendChild(thread);

    thread.querySelector("button").onclick = () => thread.remove();

    const container = thread.querySelector("#threadMessages");

    conv.messages.forEach(msg => {

        const bubble = document.createElement("div");

        // Detect sent vs received
        const isOutgoing = detectOutgoing(msg);

        bubble.className = "message-bubble " +
            (isOutgoing ? "outgoing" : "incoming");

        bubble.innerHTML = `
            ${msg.body}
            <div class="message-time">${formatTime(msg.date)}</div>
        `;

        container.appendChild(bubble);
    });

    container.scrollTop = container.scrollHeight;
}

/* =========================================
   SENT / RECEIVED DETECTION
========================================= */

function detectOutgoing(msg) {

    // If JSON has type field
    if (msg.type !== undefined) {
        return msg.type === 2; // Android: 2 = sent
    }

    // Fallback logic:
    // If address looks like shortcode → assume incoming
    if (msg.address && msg.address.startsWith("+")) {
        return false;
    }

    return false;
}

/* =========================================
   SEARCH
========================================= */

function filterSMS(query) {

    const items = document.querySelectorAll(".sms-item");

    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? "" : "none";
    });
}

/* =========================================
   FORMAT TIME
========================================= */

function formatTime(timestamp) {

    const date = new Date(timestamp);
    return date.toLocaleString();
}
