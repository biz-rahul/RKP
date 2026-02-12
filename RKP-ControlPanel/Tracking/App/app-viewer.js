/* =========================================
   APP VIEWER ENGINE
========================================= */

function renderApp(container) {

    if (!Array.isArray(currentJSON)) {
        container.innerHTML = "<p>Invalid App JSON format.</p>";
        return;
    }

    const apps = currentJSON
        .filter(a => a.package)
        .sort((a, b) =>
            a.package.localeCompare(b.package, undefined, { sensitivity: "base" })
        );

    container.className = "appviewer-app";

    container.innerHTML = `
        <div class="appviewer-header">Installed Apps</div>
        <div class="appviewer-search">
            <input type="text" id="appSearch" placeholder="Search apps">
        </div>
        <div class="appviewer-count">${apps.length} apps installed</div>
        <div class="appviewer-list" id="appList"></div>
    `;

    const list = document.getElementById("appList");

    const grouped = groupByCategory(apps);

    Object.keys(grouped).forEach(category => {

        const sectionTitle = document.createElement("div");
        sectionTitle.className = "appviewer-section";
        sectionTitle.textContent = category;
        list.appendChild(sectionTitle);

        grouped[category].forEach(app => {
            list.appendChild(createAppItem(app));
        });
    });

    document.getElementById("appSearch")
        .addEventListener("input", function() {
            filterApps(this.value.toLowerCase());
        });
}

/* =========================================
   CREATE APP ITEM
========================================= */

function createAppItem(app) {

    const wrapper = document.createElement("div");

    const item = document.createElement("div");
    item.className = "appviewer-item";

    const icon = document.createElement("div");
    icon.className = "appviewer-icon";
    icon.textContent = app.package[0].toUpperCase();

    const details = document.createElement("div");
    details.className = "appviewer-details";

    const name = document.createElement("div");
    name.className = "appviewer-name";
    name.textContent = formatAppName(app.package);

    const pkg = document.createElement("div");
    pkg.className = "appviewer-package";
    pkg.textContent = app.package;

    details.appendChild(name);
    details.appendChild(pkg);

    item.appendChild(icon);
    item.appendChild(details);

    const expanded = document.createElement("div");
    expanded.className = "appviewer-expanded";
    expanded.innerHTML = `
        <strong>Package:</strong> ${app.package}<br>
        <strong>Category:</strong> ${detectCategory(app.package)}
    `;

    item.addEventListener("click", () => {
        expanded.classList.toggle("active");
    });

    wrapper.appendChild(item);
    wrapper.appendChild(expanded);

    return wrapper;
}

/* =========================================
   CATEGORY GROUPING
========================================= */

function groupByCategory(apps) {

    const grouped = {};

    apps.forEach(app => {
        const category = detectCategory(app.package);
        if (!grouped[category]) grouped[category] = [];
        grouped[category].push(app);
    });

    return grouped;
}

function detectCategory(pkg) {

    if (pkg.startsWith("com.google")) return "Google Apps";
    if (pkg.startsWith("com.samsung")) return "Samsung Apps";
    if (pkg.startsWith("com.android")) return "Android System";
    if (pkg.startsWith("com.sec")) return "Samsung System";
    return "User Installed";
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

/* =========================================
   FORMAT APP NAME
========================================= */

function formatAppName(pkg) {
    const parts = pkg.split(".");
    return parts[parts.length - 1]
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, c => c.toUpperCase());
}
