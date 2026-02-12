/* =========================================
   ADVANCED APP VIEWER ENGINE
   Connected to app-database.js
========================================= */

/* =========================================
   ENTRY FUNCTION
========================================= */

function renderApp(container) {

    if (!Array.isArray(currentJSON)) {
        container.innerHTML = "<p>Invalid App JSON format.</p>";
        return;
    }

    const apps = currentJSON
        .filter(app => app.package)
        .map(app => ({
            package: app.package,
            name: resolveAppName(app.package),
            category: resolveCategory(app.package),
            icon: resolveIcon(app.package)
        }))
        .sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
        );

    container.className = "appviewer-app";

    container.innerHTML = `
        <div class="appviewer-header">Installed Apps</div>

        <div class="appviewer-search">
            <input type="text" id="appSearch" placeholder="Search apps">
        </div>

        <div class="appviewer-stats">
            ${apps.length} apps detected
        </div>

        <div class="appviewer-list" id="appList"></div>
    `;

    renderAppList(apps);

    document.getElementById("appSearch")
        .addEventListener("input", function() {
            filterApps(this.value.toLowerCase());
        });
}

/* =========================================
   RENDER LIST GROUPED BY CATEGORY
========================================= */

function renderAppList(apps) {

    const list = document.getElementById("appList");
    list.innerHTML = "";

    const grouped = groupByCategory(apps);

    Object.keys(grouped).forEach(category => {

        const section = document.createElement("div");
        section.className = "appviewer-section";
        section.textContent = category;

        list.appendChild(section);

        grouped[category].forEach(app => {
            list.appendChild(createAppItem(app));
        });
    });
}

/* =========================================
   CREATE APP ITEM
========================================= */

function createAppItem(app) {

    const wrapper = document.createElement("div");

    const item = document.createElement("div");
    item.className = "appviewer-item";

    /* ===== ICON ===== */

    if (app.icon) {
        const img = document.createElement("img");
        img.src = app.icon;
        img.className = "appviewer-icon";
        item.appendChild(img);
    } else {
        const fallbackIcon = document.createElement("div");
        fallbackIcon.className = "appviewer-icon";
        fallbackIcon.textContent = app.name[0].toUpperCase();
        item.appendChild(fallbackIcon);
    }

    /* ===== DETAILS ===== */

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

    item.appendChild(details);

    /* ===== EXPAND PANEL ===== */

    const expanded = document.createElement("div");
    expanded.className = "appviewer-expanded";
    expanded.innerHTML = `
        <strong>Package:</strong> ${app.package}<br>
        <strong>Category:</strong> ${app.category}
    `;

    item.addEventListener("click", () => {
        expanded.classList.toggle("active");
    });

    wrapper.appendChild(item);
    wrapper.appendChild(expanded);

    return wrapper;
}

/* =========================================
   GROUP BY CATEGORY
========================================= */

function groupByCategory(apps) {

    const grouped = {};

    apps.forEach(app => {

        if (!grouped[app.category]) {
            grouped[app.category] = [];
        }

        grouped[app.category].push(app);
    });

    return grouped;
}

/* =========================================
   SEARCH FILTER
========================================= */

function filterApps(query) {

    const items = document.querySelectorAll(".appviewer-item");

    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.parentElement.style.display =
            text.includes(query) ? "" : "none";
    });
}

/* =========================================
   RESOLVE APP NAME
========================================= */

function resolveAppName(pkg) {

    const db = getAppFromDatabase(pkg);

    if (db && db.name) {
        return db.name;
    }

    const parts = pkg.split(".");
    return parts[parts.length - 1]
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, c => c.toUpperCase());
}

/* =========================================
   RESOLVE ICON
========================================= */

function resolveIcon(pkg) {

    const db = getAppFromDatabase(pkg);

    if (db && db.icon) {
        return db.icon;
    }

    return null;
}

/* =========================================
   RESOLVE CATEGORY
========================================= */

function resolveCategory(pkg) {

    const db = getAppFromDatabase(pkg);

    if (db && db.category) {
        return db.category;
    }

    if (pkg.startsWith("com.google")) return "Google Apps";
    if (pkg.startsWith("com.samsung")) return "Samsung Apps";
    if (pkg.startsWith("com.android")) return "Android System";
    if (pkg.startsWith("com.sec")) return "Samsung System";

    return "User Installed";
}
