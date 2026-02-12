/* =========================================
   FINAL MATERIAL APP VIEWER JS
========================================= */

let allApps = [];
let currentTab = "user";

/* =========================================
   ENTRY
========================================= */

function renderApp(container) {

    if (!Array.isArray(currentJSON)) {
        container.innerHTML = "<div class='appviewer-empty'>Invalid JSON format</div>";
        return;
    }

    allApps = currentJSON
        .filter(app => app.package)
        .map(app => ({
            package: app.package,
            name: formatAppName(app.package),
            type: detectAppType(app.package),
            iconClass: detectIcon(app.package)
        }))
        .sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
        );

    container.className = "appviewer-app";

    container.innerHTML = `
        <div class="appviewer-header">Package Names</div>

        <div class="appviewer-top-search">
            <input type="text" id="globalSearch" placeholder="Search app or package">
        </div>

        <div class="appviewer-tabs">
            <div class="appviewer-tab active" id="tab-user">USER APPS</div>
            <div class="appviewer-tab" id="tab-system">SYSTEM APPS</div>
        </div>

        <div class="appviewer-list" id="appList"></div>
    `;

    attachTabEvents();
    attachSearchEvent();
    renderList();
}

/* =========================================
   STRICT SYSTEM DETECTION
========================================= */

function detectAppType(pkg) {

    const systemPrefixes = [
        "com.android",
        "android",
        "com.google.android",
        "com.samsung",
        "com.sec",
        "com.qualcomm",
        "com.mediatek",
        "com.miui",
        "com.huawei",
        "com.oppo",
        "com.vivo"
    ];

    for (let prefix of systemPrefixes) {
        if (pkg.startsWith(prefix)) {
            return "system";
        }
    }

    return "user"; // unknown always user
}

/* =========================================
   TAB SWITCHING
========================================= */

function attachTabEvents() {

    document.getElementById("tab-user").onclick = () => {
        currentTab = "user";
        switchTabUI();
        renderList();
    };

    document.getElementById("tab-system").onclick = () => {
        currentTab = "system";
        switchTabUI();
        renderList();
    };
}

function switchTabUI() {

    document.getElementById("tab-user").classList.remove("active");
    document.getElementById("tab-system").classList.remove("active");

    if (currentTab === "user") {
        document.getElementById("tab-user").classList.add("active");
    } else {
        document.getElementById("tab-system").classList.add("active");
    }
}

/* =========================================
   SEARCH
========================================= */

function attachSearchEvent() {

    document.getElementById("globalSearch")
        .addEventListener("input", function() {
            renderList(this.value.toLowerCase());
        });
}

/* =========================================
   RENDER LIST
========================================= */

function renderList(searchQuery = "") {

    const list = document.getElementById("appList");
    list.innerHTML = "";

    const filtered = allApps.filter(app => {

        if (app.type !== currentTab) return false;

        if (!searchQuery) return true;

        return (
            app.name.toLowerCase().includes(searchQuery) ||
            app.package.toLowerCase().includes(searchQuery)
        );
    });

    if (filtered.length === 0) {
        list.innerHTML = "<div class='appviewer-empty'>No apps found</div>";
        return;
    }

    filtered.forEach(app => {
        list.appendChild(createAppItem(app));
    });
}

/* =========================================
   CREATE CARD ITEM
========================================= */

function createAppItem(app) {

    const item = document.createElement("div");
    item.className = "appviewer-item";

    /* ICON */

    const icon = document.createElement("div");
    icon.className = "appviewer-icon";

    const iconElement = document.createElement("i");
    iconElement.className = app.iconClass;

    icon.appendChild(iconElement);

    /* DETAILS */

    const details = document.createElement("div");
    details.className = "appviewer-details";

    const name = document.createElement("div");
    name.className = "appviewer-name";
    name.textContent = app.name;

    const pkg = document.createElement("div");
    pkg.className = "appviewer-package";
    pkg.textContent = app.package;

    details.appendChild(name);
    details.appendChild(pkg);

    /* SEARCH EMOJI */

    const searchBtn = document.createElement("div");
    searchBtn.className = "appviewer-search-btn";
    searchBtn.textContent = "🔍";

    searchBtn.onclick = (e) => {
        e.stopPropagation();
        window.open(
            "https://www.google.com/search?q=" +
            encodeURIComponent("what is " + app.package),
            "_blank"
        );
    };

    item.appendChild(icon);
    item.appendChild(details);
    item.appendChild(searchBtn);

    return item;
}

/* =========================================
   FONT AWESOME ICON DETECTION FIXED
========================================= */

function detectIcon(pkg) {

    const lower = pkg.toLowerCase();

    if (lower.includes("whatsapp")) return "fa-brands fa-whatsapp";
    if (lower.includes("instagram")) return "fa-brands fa-instagram";
    if (lower.includes("facebook")) return "fa-brands fa-facebook";
    if (lower.includes("youtube")) return "fa-brands fa-youtube";
    if (lower.includes("chrome")) return "fa-brands fa-chrome";
    if (lower.includes("spotify")) return "fa-brands fa-spotify";
    if (lower.includes("twitter") || lower.includes("x")) return "fa-brands fa-x-twitter";
    if (lower.includes("snapchat")) return "fa-brands fa-snapchat";
    if (lower.includes("amazon")) return "fa-brands fa-amazon";
    if (lower.includes("google")) return "fa-brands fa-google";
    if (lower.includes("microsoft")) return "fa-brands fa-microsoft";
    if (lower.includes("openai") || lower.includes("chatgpt")) return "fa-brands fa-openai";

    if (detectAppType(pkg) === "system") {
        return "fa-solid fa-microchip";
    }

    return "fa-solid fa-mobile-screen";
}

/* =========================================
   FORMAT NAME
========================================= */

function formatAppName(pkg) {

    const parts = pkg.split(".");
    const raw = parts[parts.length - 1];

    return raw
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, c => c.toUpperCase());
           }
