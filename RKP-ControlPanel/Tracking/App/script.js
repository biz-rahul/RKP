let apps = [];
let filtered = [];


// ---------- INIT ----------

window.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);
    const github = params.get("github");

    if (github) {
        console.log("Loading from parameter:", github);
        fetchGithub(github);
    }

});


// ---------- MENU ----------

function toggleMenu() {
    document.getElementById("sideMenu").classList.toggle("open");
}


// ---------- LOAD FROM PASTE ----------

function loadPaste() {

    try {

        const text = document.getElementById("jsonPaste").value;

        if (!text) {
            alert("Paste JSON first");
            return;
        }

        const data = JSON.parse(text);

        process(data);

    } catch (e) {

        alert("Invalid JSON");

        console.error(e);
    }
}


// ---------- FILE LOAD ----------

document.getElementById("fileInput").addEventListener("change", function (e) {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function () {

        try {

            const data = JSON.parse(reader.result);

            process(data);

        } catch {

            alert("Invalid JSON file");

        }

    };

    reader.readAsText(file);

});


// ---------- GITHUB FETCH ----------

function loadGithub() {

    const url = document.getElementById("githubInput").value;

    if (!url) {
        alert("Enter GitHub URL");
        return;
    }

    fetchGithub(url);

}


function fetchGithub(url) {

    console.log("Fetching:", url);

    fetch(url)
        .then(res => {

            if (!res.ok)
                throw new Error("HTTP error " + res.status);

            return res.json();

        })
        .then(data => {

            console.log("Loaded apps:", data.length);

            process(data);

        })
        .catch(err => {

            alert("Failed to load JSON");

            console.error(err);

        });

}


// ---------- PROCESS ----------

function process(data) {

    if (!Array.isArray(data)) {

        alert("JSON must be array");

        return;

    }

    apps = data;
    filtered = [...apps];

    render();

}


// ---------- RENDER ----------

function render() {

    const list = document.getElementById("appsList");

    if (!list) return;

    list.innerHTML = "";

    if (filtered.length === 0) {

        list.innerHTML = "<div style='padding:20px'>No apps found</div>";

        return;
    }

    filtered.forEach(app => {

        const row = document.createElement("div");

        row.className = "appRow";

        row.innerHTML = `

            <img class="appIcon" src="default_icon.png">

            <div class="appInfo">

                <div class="appName">${safe(app.app_name)}</div>

                <div class="appPackage">${safe(app.package_name)}</div>

                <div class="appMeta">

                Version: ${safe(app.version_name)}<br>

                Version Code: ${safe(app.version_code)}<br>

                Size: ${formatSize(app.app_size_bytes)}<br>

                Installed: ${formatDate(app.installed_date)}<br>

                Last Used: ${formatDate(app.last_used)}<br>

                Usage: ${formatTime(app.usage_time_ms)}

                </div>

            </div>

        `;

        list.appendChild(row);

    });

}


// ---------- SEARCH ----------

document.getElementById("searchInput").addEventListener("input", function () {

    const v = this.value.toLowerCase();

    filtered = apps.filter(a =>
        a.app_name.toLowerCase().includes(v) ||
        a.package_name.toLowerCase().includes(v)
    );

    render();

});


// ---------- SORT ----------

document.getElementById("sortSelect").addEventListener("change", function () {

    const v = this.value;

    filtered.sort((a, b) => {

        if (v === "size") return b.app_size_bytes - a.app_size_bytes;
        if (v === "usage") return b.usage_time_ms - a.usage_time_ms;
        if (v === "installed") return b.installed_date - a.installed_date;
        if (v === "last_used") return b.last_used - a.last_used;

        return a.app_name.localeCompare(b.app_name);

    });

    render();

});


// ---------- SAFE FORMAT ----------

function safe(v) {
    return v ?? "N/A";
}

function formatSize(bytes) {

    if (!bytes) return "0 MB";

    return (bytes / 1024 / 1024).toFixed(2) + " MB";

}

function formatDate(ts) {

    if (!ts || ts === 0) return "Never";

    return new Date(ts).toLocaleString();

}

function formatTime(ms) {

    if (!ms) return "0h 0m";

    const m = Math.floor(ms / 60000);

    const h = Math.floor(m / 60);

    return h + "h " + (m % 60) + "m";

}
