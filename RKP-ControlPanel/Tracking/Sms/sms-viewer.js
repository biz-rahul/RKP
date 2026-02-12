/* =========================================
   FINAL SMS VIEWER JS
   Supports thread-based JSON structure
========================================= */

let smsThreads = [];

/* =========================================
   MAIN ENTRY
========================================= */

function renderSMS(container) {

    if (!Array.isArray(currentJSON)) {

        container.innerHTML =
            "<div class='smsviewer-empty'>Invalid SMS format</div>";

        return;
    }

    /* PROCESS THREADS */

    smsThreads = currentJSON.map(thread => {

        const messagesSorted =
            thread.messages.sort((a, b) => b.date - a.date);

        const latest = messagesSorted[0];

        const unread =
            thread.messages.some(msg => msg.read === 0);

        return {

            address: thread.address || "Unknown",

            name: thread.name || thread.address,

            thread_id: thread.thread_id,

            messages: messagesSorted.reverse(), // oldest → newest for chat

            latest,

            unread

        };

    }).sort((a, b) =>
        b.latest.date - a.latest.date
    );

    container.className = "smsviewer-app";

    container.innerHTML = `
        <div class="smsviewer-header">
            Secure SMS Terminal
        </div>

        <div class="smsviewer-search">
            <input type="text"
                   id="smsSearch"
                   placeholder="Search threads">
        </div>

        <div class="smsviewer-list"
             id="smsList">
        </div>
    `;

    renderThreadList();

    document.getElementById("smsSearch")
        .addEventListener("input", function() {

            renderThreadList(this.value.toLowerCase());

        });
}

/* =========================================
   RENDER THREAD LIST
========================================= */

function renderThreadList(search = "") {

    const list =
        document.getElementById("smsList");

    list.innerHTML = "";

    const filtered =
        smsThreads.filter(thread => {

            if (!search) return true;

            return (
                thread.address.toLowerCase().includes(search) ||
                thread.latest.body.toLowerCase().includes(search)
            );

        });

    if (filtered.length === 0) {

        list.innerHTML =
            "<div class='smsviewer-empty'>No messages found</div>";

        return;
    }

    filtered.forEach(thread => {

        list.appendChild(
            createThreadItem(thread)
        );

    });
}

/* =========================================
   CREATE THREAD ITEM
========================================= */

function createThreadItem(thread) {

    const div =
        document.createElement("div");

    div.className =
        "smsviewer-thread-item" +
        (thread.unread ? " smsviewer-unread" : "");

    div.innerHTML = `

        <div class="smsviewer-thread-top">

            <div class="smsviewer-address">
                ${thread.address}
            </div>

            <div class="smsviewer-time">
                ${formatTime(thread.latest.date)}
            </div>

        </div>

        <div class="smsviewer-preview">
            ${thread.latest.body}
        </div>

    `;

    div.onclick = () =>
        openThread(thread);

    return div;
}

/* =========================================
   OPEN CHAT THREAD
========================================= */

function openThread(thread) {

    const chat =
        document.createElement("div");

    chat.className =
        "smsviewer-chat";

    chat.innerHTML = `

        <div class="smsviewer-chat-header">

            <div class="smsviewer-back">
                ←
            </div>

            ${thread.address}

        </div>

        <div class="smsviewer-chat-body"
             id="chatBody">
        </div>

    `;

    document.querySelector(".smsviewer-app")
        .appendChild(chat);

    chat.querySelector(".smsviewer-back")
        .onclick = () => chat.remove();

    const body =
        chat.querySelector("#chatBody");

    thread.messages.forEach(msg => {

        body.appendChild(
            createMessageBubble(msg)
        );

    });

    body.scrollTop =
        body.scrollHeight;
}

/* =========================================
   CREATE MESSAGE BUBBLE
========================================= */

function createMessageBubble(msg) {

    const div =
        document.createElement("div");

    const typeClass =
        msg.type === 2
        ? "smsviewer-sent"
        : "smsviewer-inbox";

    const unreadClass =
        msg.read === 0
        ? " smsviewer-unread-msg"
        : "";

    div.className =
        "smsviewer-bubble " +
        typeClass +
        unreadClass;

    div.innerHTML = `

        ${msg.body}

        <div class="smsviewer-msg-time">
            ${formatFullTime(msg.date)}
        </div>

    `;

    return div;
}

/* =========================================
   TIME FORMAT
========================================= */

function formatTime(timestamp) {

    const d =
        new Date(timestamp);

    return d.toLocaleDateString(
        undefined,
        {
            month: "short",
            day: "numeric"
        }
    );
}

function formatFullTime(timestamp) {

    const d =
        new Date(timestamp);

    return d.toLocaleString();
}
