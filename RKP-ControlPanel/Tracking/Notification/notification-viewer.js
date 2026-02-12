/* =========================================
   ANDROID REAL NOTIFICATION VIEWER JS
========================================= */

let notificationList = [];

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

    notificationList =
        currentJSON.sort(
            (a, b) => b.posted_time - a.posted_time
        );

    container.className = "notificationviewer-app";

    container.innerHTML = `

        <div class="notificationviewer-header">
            Notifications
        </div>

        <div class="notificationviewer-search">
            <input id="notificationSearch"
                   placeholder="Search notifications">
        </div>

        <div class="notificationviewer-list"
             id="notificationList">
        </div>

    `;

    renderNotificationItems();

    /* SEARCH */

    document
        .getElementById("notificationSearch")
        .addEventListener("input", function() {

            const query =
                this.value.toLowerCase();

            renderNotificationItems(query);

        });

}

/* =========================================
   RENDER LIST
========================================= */

function renderNotificationItems(search="") {

    const list =
        document.getElementById("notificationList");

    list.innerHTML = "";

    const filtered =
        notificationList.filter(n => {

            if (!search) return true;

            return (

                n.app_name?.toLowerCase().includes(search) ||

                n.package?.toLowerCase().includes(search) ||

                n.title?.toLowerCase().includes(search) ||

                n.text?.toLowerCase().includes(search) ||

                n.big_text?.toLowerCase().includes(search)

            );

        });

    if (filtered.length === 0) {

        list.innerHTML =
            "<div class='notificationviewer-empty'>No notifications</div>";

        return;
    }

    filtered.forEach(notification => {

        list.appendChild(
            createNotificationCard(notification)
        );

    });

}

/* =========================================
   CREATE CARD
========================================= */

function createNotificationCard(n) {

    const card =
        document.createElement("div");

    card.className =
        "notificationviewer-item";

    const icon =
        getAppIcon(n.package, n.app_name);

    const time =
        formatRelativeTime(n.posted_time);

    const text =
        n.text ||
        n.big_text ||
        n.ticker ||
        "";

    card.innerHTML = `

        <div class="notificationviewer-icon">
            ${icon}
        </div>

        <div class="notificationviewer-content">

            <div class="notificationviewer-top">

                <div class="notificationviewer-appname">
                    ${escapeHTML(n.app_name || "Unknown")}
                </div>

                <div class="notificationviewer-time">
                    ${time}
                </div>

            </div>

            <div class="notificationviewer-title">
                ${escapeHTML(n.title || "")}
            </div>

            ${
                text
                ?
                `<div class="notificationviewer-text">
                    ${escapeHTML(text)}
                 </div>`
                :
                ""
            }

        </div>

    `;

    return card;
}

/* =========================================
   APP ICON GENERATOR
========================================= */

function getAppIcon(packageName, appName) {

    const map = {

        "com.whatsapp": "fab fa-whatsapp",
        "com.whatsapp.w4b": "fab fa-whatsapp",

        "com.instagram.android": "fab fa-instagram",

        "com.snapchat.android": "fab fa-snapchat",

        "com.google.android.gm": "fas fa-envelope",

        "com.android.systemui": "fas fa-mobile-alt",

        "com.samsung.android.incallui": "fas fa-phone",

        "com.facebook.katana": "fab fa-facebook",

        "com.google.android.youtube": "fab fa-youtube",

        "com.android.chrome": "fab fa-chrome"

    };

    if (map[packageName]) {

        return `<i class="${map[packageName]}"></i>`;

    }

    /* fallback: first letter */

    return appName
        ? appName.charAt(0).toUpperCase()
        : "?";

}

/* =========================================
   TIME FORMAT (Android style)
========================================= */

function formatRelativeTime(timestamp) {

    const now =
        Date.now();

    const diff =
        now - timestamp;

    const seconds =
        Math.floor(diff / 1000);

    const minutes =
        Math.floor(seconds / 60);

    const hours =
        Math.floor(minutes / 60);

    const days =
        Math.floor(hours / 24);

    if (seconds < 60)
        return "now";

    if (minutes < 60)
        return minutes + " min ago";

    if (hours < 24)
        return hours + " hr ago";

    if (days === 1)
        return "Yesterday";

    return days + " days ago";

}

/* =========================================
   SAFE HTML
========================================= */

function escapeHTML(str) {

    if (!str) return "";

    return str
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;");

}
