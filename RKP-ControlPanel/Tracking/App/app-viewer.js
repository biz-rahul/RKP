/* =========================================
   ADVANCED APP VIEWER (NO DATABASE VERSION)
========================================= */

/* =========================================
   ENTRY FUNCTION
========================================= */

function renderApp(container) {

    if (!Array.isArray(currentJSON)) {
        container.innerHTML = "<p>Invalid App JSON format.</p>";
        return;
    }

    const processedApps = currentJSON
        .filter(app => app.package)
        .map(app => ({
            package: app.package,
            name: formatAppName(app.package),
            type: detectAppType(app.package),
            icon: detectIcon(app.package)
        }))
        .sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
        );

    const userApps = processedApps.filter(app => app.type === "user");
    const systemApps = processedApps.filter(app => app.type === "system");

    container.className = "appviewer-app";

    container.innerHTML = `
        <div class="appviewer-header">Installed Applications</div>

        <div class="appviewer-search">
            <input type="text" id="appSearch" placeholder="Search apps by name or package">
        </div>

        <div class="appviewer-stats">
            ${userApps.length} User Apps • ${systemApps.length} System Apps
        </div>

        <div class="appviewer-list" id="appList"></div>
    `;

    renderSections(userApps, systemApps);

    document.getElementById("appSearch")
        .addEventListener("input", function() {
            filterApps(this.value.toLowerCase());
        });
}

/* =========================================
   STRICT SYSTEM DETECTION
========================================= */

function detectAppType(pkg) {

    // Strict system prefixes
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
        "com.huawei",
        "com.transsion"
    ];

    for (let prefix of systemPrefixes) {
        if (pkg.startsWith(prefix)) {
            return "system";
        }
    }

    // Everything else is USER
    return "user";
}

/* =========================================
   RENDER SECTIONS
========================================= */

function renderSections(userApps, systemApps) {

    const list = document.getElementById("appList");
    list.innerHTML = "";

    if (userApps.length > 0) {
        const userTitle = document.createElement("div");
        userTitle.className = "appviewer-section";
        userTitle.textContent = "User Applications";
        list.appendChild(userTitle);

        userApps.forEach(app => {
            list.appendChild(createAppItem(app));
        });
    }

    if (systemApps.length > 0) {
        const systemTitle = document.createElement("div");
        systemTitle.className = "appviewer-section";
        systemTitle.textContent = "System Applications";
        list.appendChild(systemTitle);

        systemApps.forEach(app => {
            list.appendChild(createAppItem(app));
        });
    }
}

/* =========================================
   CREATE APP ITEM
========================================= */

function createAppItem(app) {

    const wrapper = document.createElement("div");

    const item = document.createElement("div");
    item.className = "appviewer-item";

    /* ICON USING FONT AWESOME */

    const icon = document.createElement("div");
    icon.className = "appviewer-icon";

    const i = document.createElement("i");
    i.className = app.icon;

    icon.appendChild(i);

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

    /* BADGE */

    const badge = document.createElement("div");
    badge.className = "appviewer-badge " + 
        (app.type === "system" ? "badge-system" : "badge-user");
    badge.textContent = app.type === "system" ? "SYSTEM" : "USER";

    item.appendChild(icon);
    item.appendChild(details);
    item.appendChild(badge);

    /* EXPANDED PANEL */

    const expanded = document.createElement("div");
    expanded.className = "appviewer-expanded";
    expanded.innerHTML = `
        <strong>Package:</strong> ${app.package}<br>
        <strong>Type:</strong> ${app.type === "system" ? "System Application" : "User Installed Application"}
    `;

    item.addEventListener("click", () => {
        expanded.classList.toggle("active");
    });

    wrapper.appendChild(item);
    wrapper.appendChild(expanded);

    return wrapper;
}

/* =========================================
   FONT AWESOME ICON DETECTION
========================================= */

function detectIcon(pkg) {

    const lower = pkg.toLowerCase();

    if (lower.includes("whatsapp")) return "fa-brands fa-whatsapp";
    if (lower.includes("instagram")) return "fa-brands fa-instagram";
    if (lower.includes("facebook")) return "fa-brands fa-facebook";
    if (lower.includes("chrome")) return "fa-brands fa-chrome";
    if (lower.includes("youtube")) return "fa-brands fa-youtube";
    if (lower.includes("spotify")) return "fa-brands fa-spotify";
    if (lower.includes("twitter") || lower.includes("x")) return "fa-brands fa-x-twitter";
    if (lower.includes("snapchat")) return "fa-brands fa-snapchat";
    if (lower.includes("amazon")) return "fa-brands fa-amazon";
    if (lower.includes("google")) return "fa-brands fa-google";
    if (lower.includes("microsoft")) return "fa-brands fa-microsoft";

    // SYSTEM DEFAULT
    if (detectAppType(pkg) === "system") {
        return "fa-solid fa-gear";
    }

    // USER DEFAULT
    return "fa-solid fa-mobile-screen";
}

/* =========================================
   FORMAT APP NAME
========================================= */

function formatAppName(pkg) {

    const parts = pkg.split(".");
    const raw = parts[parts.length - 1];

    return raw
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, c => c.toUpperCase());
}

/* =========================================
   SEARCH
========================================= */

function filterApps(query) {

    const items = document.querySelectorAll(".appviewer-item");

    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.parentElement.style.display =
            text.includes(query) ? "" : "none";
    });
}
