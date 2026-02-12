/* =========================================
   NOTIFICATION VIEWER ENGINE
========================================= */

let notificationData = [];

/* =========================================
   MAIN ENTRY
========================================= */

function renderNotification(container) {

    if (!Array.isArray(currentJSON)) {

        container.innerHTML =
            "<div class='notificationviewer-empty'>Invalid notification format</div>";

        return;
    }

    /* SORT newest first */

    notificationData =
        currentJSON.sort(
            (a, b) => b.posted_time - a.posted_time
        );

    container.className =
        "notificationviewer-app";

    container.innerHTML = `

        <div class="notificationviewer-header">
            Notification Capture Terminal
        </div>

        <div class="notificationviewer-search">
            <input id="notificationSearch"
                   placeholder="Search notifications">
        </div>

        <div id="notificationList"
             class="notificationviewer-list">
        </div>

    `;

    renderNotificationList();

    document
        .getElementById("notificationSearch")
        .addEventListener("input", function() {

            renderNotificationList(
                this.value.toLowerCase()
            );

        });

}

/* =========================================
   RENDER LIST
========================================= */

function renderNotificationList(search="") {

    const list =
        document.getElementById(
            "notificationList"
        );

    list.innerHTML = "";

    const filtered =
        notificationData.filter(n => {

            if (!search) return true;

            return (

                n.app_name?.toLowerCase().includes(search) ||

                n.package?.toLowerCase().includes(search) ||

                n.title?.toLowerCase().includes(search) ||

                n.text?.toLowerCase().includes(search)

            );

        });

    if (filtered.length === 0) {

        list.innerHTML =
            "<div class='notificationviewer-empty'>No notifications found</div>";

        return;

    }

    filtered.forEach(notification => {

        list.appendChild(
            createNotificationItem(notification)
        );

    });

}

/* =========================================
   CREATE CARD
========================================= */

function createNotificationItem(n) {

    const div =
        document.createElement("div");

    div.className =
        "notificationviewer-item";

    const categoryClass =
        getCategoryClass(n.category);

    div.innerHTML = `

        <div class="notificationviewer-top">

            <div class="notificationviewer-appname">
                ${escapeHTML(n.app_name || "Unknown")}
            </div>

            <div class="notificationviewer-time">
                ${formatTime(n.posted_time)}
            </div>

        </div>

        <div class="notificationviewer-title">
            ${escapeHTML(n.title || "")}
        </div>

        <div class="notificationviewer-text">
            ${escapeHTML(
                n.text ||
                n.big_text ||
                n.ticker ||
                ""
            )}
        </div>

        <div class="notificationviewer-package">
            ${escapeHTML(n.package)}
        </div>

        ${
            n.category
            ? `<div class="notificationviewer-category ${categoryClass}">
                ${n.category}
               </div>`
            : ""
        }

    `;

    return div;

}

/* =========================================
   HELPERS
========================================= */

function formatTime(timestamp) {

    const d = new Date(timestamp);

    return d.toLocaleString();

}

function getCategoryClass(cat) {

    if (!cat) return "";

    if (cat === "call")
        return "category-call";

    if (cat === "sys")
        return "category-sys";

    return "";

}

/* Prevent HTML injection */

function escapeHTML(str) {

    if (!str) return "";

    return str
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;");

}
