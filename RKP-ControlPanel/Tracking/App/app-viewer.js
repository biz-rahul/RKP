/* =========================================
   FINAL APP VIEWER (NEW JSON FORMAT)
========================================= */

let allApps = [];
let currentTab = "user";

/* =========================================
   MAIN ENTRY
========================================= */

function renderApp(container) {

    if (!Array.isArray(currentJSON)) {
        container.innerHTML = "<div class='appviewer-empty'>Invalid App JSON</div>";
        return;
    }

    allApps = currentJSON.map(app => {

        const name = app.app_name || formatAppName(app.package_name);
        const pkg = app.package_name || "";
        const type = detectAppType(pkg);

        return {
            name,
            package: pkg,
            type,
            icon: detectIcon(pkg),
            version: app.version_name || "Unknown",
            size: formatSize(app.app_size_bytes),
            installed: formatDate(app.installed_date)
        };

    }).sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );

    container.className = "appviewer-app";

    container.innerHTML = `
        <div class="appviewer-header">Package Manager</div>

        <div class="appviewer-top-search">
            <input type="text" id="globalSearch" placeholder="Search app or package">
        </div>

        <div class="appviewer-tabs">
            <div class="appviewer-tab active" id="tab-user">
                USER APPS
            </div>
            <div class="appviewer-tab" id="tab-system">
                SYSTEM APPS
            </div>
        </div>

        <div class="appviewer-list" id="appList"></div>
    `;

    setupTabs();
    setupSearch();
    renderList();
}

/* =========================================
   SYSTEM DETECTION (STRICT)
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
        "com.oppo",
        "com.vivo",
        "com.huawei"
    ];

    for (let prefix of systemPrefixes) {
        if (pkg.startsWith(prefix)) {
            return "system";
        }
    }

    return "user";
}

/* =========================================
   TAB SYSTEM
========================================= */

function setupTabs() {

    document.getElementById("tab-user").onclick = () => {
        currentTab = "user";
        updateTabs();
        renderList();
    };

    document.getElementById("tab-system").onclick = () => {
        currentTab = "system";
        updateTabs();
        renderList();
    };
}

function updateTabs() {

    document.getElementById("tab-user").classList.remove("active");
    document.getElementById("tab-system").classList.remove("active");

    document.getElementById("tab-" + currentTab)
        .classList.add("active");
}

/* =========================================
   SEARCH
========================================= */

function setupSearch() {

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

        list.innerHTML =
            "<div class='appviewer-empty'>No apps found</div>";

        return;
    }

    filtered.forEach(app => {

        list.appendChild(createAppItem(app));

    });
}

/* =========================================
   CREATE APP ITEM
========================================= */

function createAppItem(app) {

    const item = document.createElement("div");
    item.className = "appviewer-item";

    /* ICON */

    const icon = document.createElement("div");
    icon.className = "appviewer-icon";

    const iconElement = document.createElement("i");
    iconElement.className = app.icon;

    icon.appendChild(iconElement);

    /* DETAILS */

    const details = document.createElement("div");
    details.className = "appviewer-details";

    details.innerHTML = `
        <div class="appviewer-name">${app.name}</div>
        <div class="appviewer-package">${app.package}</div>
        <div class="appviewer-meta">
            Version ${app.version} • ${app.size}
        </div>
        <div class="appviewer-meta">
            Installed ${app.installed}
        </div>
    `;

    /* GOOGLE SEARCH BUTTON */

    const searchBtn = document.createElement("div");
    searchBtn.className = "appviewer-search-btn";
    searchBtn.textContent = "🔍";

    searchBtn.onclick = (e) => {

        e.stopPropagation();

        window.open(
            "https://www.google.com/search?q=" +
            encodeURIComponent(app.package),
            "_blank"
        );
    };

    item.appendChild(icon);
    item.appendChild(details);
    item.appendChild(searchBtn);

    return item;
}

/* =========================================
   FONT AWESOME ICON DETECTION
========================================= */

function detectIcon(pkg) {

    const p = pkg.toLowerCase();

    if (p.includes("whatsapp")) return "fa-brands fa-whatsapp";
    if (p.includes("instagram")) return "fa-brands fa-instagram";
    if (p.includes("facebook")) return "fa-brands fa-facebook";
    if (p.includes("youtube")) return "fa-brands fa-youtube";
    if (p.includes("chrome")) return "fa-brands fa-chrome";
    if (p.includes("spotify")) return "fa-brands fa-spotify";
    if (p.includes("google")) return "fa-brands fa-google";
    if (p.includes("microsoft")) return "fa-brands fa-microsoft";
    if (p.includes("amazon")) return "fa-brands fa-amazon";
    if (p.includes("openai")) return "fa-brands fa-openai";

    if (detectAppType(pkg) === "system") {
        return "fa-solid fa-microchip";
    }

    return "fa-solid fa-mobile-screen";
}

/* =========================================
   FORMAT SIZE
========================================= */

function formatSize(bytes) {

    if (!bytes) return "Unknown size";

    const units = ["B", "KB", "MB", "GB"];

    let i = 0;

    while (bytes >= 1024 && i < units.length - 1) {

        bytes /= 1024;
        i++;
    }

    return bytes.toFixed(1) + " " + units[i];
}

/* =========================================
   FORMAT DATE
========================================= */

function formatDate(timestamp) {

    if (!timestamp) return "Unknown";

    const d = new Date(timestamp);

    return d.toLocaleDateString();
}

/* =========================================
   FALLBACK NAME
========================================= */

function formatAppName(pkg) {

    const parts = pkg.split(".");
    return parts[parts.length - 1];
}
