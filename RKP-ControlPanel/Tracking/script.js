/* ====================================
   CONFIGURATION
==================================== */

const owner = "MOFO-UG";
const repo = "ControlTheWorld";

let defaultBranch = "";
let currentJSON = null;
let currentFileName = "";
let currentPath = "";

/* ====================================
   INITIALIZATION
==================================== */

async function init() {
    try {
        const repoInfo = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        const repoData = await repoInfo.json();
        defaultBranch = repoData.default_branch;
        loadContents("");
    } catch (err) {
        console.error("Initialization failed:", err);
    }
}

document.addEventListener("DOMContentLoaded", init);

/* ====================================
   LOAD DIRECTORY CONTENTS
==================================== */

async function loadContents(path) {
    currentPath = path;
    updateBreadcrumb(path);

    const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${defaultBranch}`
    );

    const data = await response.json();
    const fileList = document.getElementById("fileList");
    fileList.innerHTML = "";

    if (path !== "") {
        const back = document.createElement("div");
        back.className = "folder";
        back.textContent = ".. (Back)";
        back.onclick = () => {
            const parts = path.split("/");
            parts.pop();
            loadContents(parts.join("/"));
        };
        fileList.appendChild(back);
    }

    data.forEach(item => {
        const div = document.createElement("div");
        div.className = item.type === "dir" ? "folder" : "file";
        div.textContent = item.name;

        if (item.type === "dir") {
            div.onclick = () => loadContents(item.path);
        } else if (item.name.endsWith(".json")) {
            div.onclick = () => loadJSON(item.path, item.name);
        }

        fileList.appendChild(div);
    });
}

/* ====================================
   LOAD JSON FILE
==================================== */

async function loadJSON(path, filename) {
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${path}`;

    try {
        const response = await fetch(rawUrl);
        const text = await response.text();

        currentJSON = JSON.parse(text);
        currentFileName = filename;

        showJSONControls();
        clearViewer();

    } catch (err) {
        console.error("Invalid JSON:", err);
    }
}

/* ====================================
   UI HELPERS
==================================== */

function updateBreadcrumb(path) {
    document.getElementById("breadcrumb").textContent = "/" + path;
}

function showJSONControls() {
    document.getElementById("jsonActions").classList.remove("hidden");
    document.getElementById("viewerOptions").classList.remove("hidden");
}

function clearViewer() {
    document.getElementById("viewerContainer").innerHTML = "";
}

/* ====================================
   COPY JSON
==================================== */

document.getElementById("copyJsonBtn").addEventListener("click", () => {
    if (!currentJSON) return;

    const formatted = JSON.stringify(currentJSON, null, 2);
    navigator.clipboard.writeText(formatted);
    alert("JSON copied successfully.");
});

/* ====================================
   DOWNLOAD JSON
==================================== */

document.getElementById("downloadJsonBtn").addEventListener("click", () => {
    if (!currentJSON) return;

    const blob = new Blob(
        [JSON.stringify(currentJSON, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = currentFileName || "data.json";
    a.click();
    URL.revokeObjectURL(url);
});

/* ====================================
   VIEWER ENGINE
==================================== */

function openViewer(type) {
    const container = document.getElementById("viewerContainer");
    container.innerHTML = "";

    if (!currentJSON) return;

    switch (type) {
        case "regular":
            renderRegular(container);
            break;
        case "sms":
            renderPlaceholder(container, "SMS Viewer Layout Coming Soon");
            break;
        case "call":
            renderPlaceholder(container, "Call Viewer Layout Coming Soon");
            break;
        case "contacts":
            renderPlaceholder(container, "Contacts Viewer Layout Coming Soon");
            break;
        case "device":
            renderPlaceholder(container, "Device Viewer Layout Coming Soon");
            break;
        case "notification":
            renderPlaceholder(container, "Notification Viewer Layout Coming Soon");
            break;
    }
}

/* ====================================
   REGULAR VIEWER
==================================== */

function renderRegular(container) {
    const pre = document.createElement("pre");
    pre.textContent = JSON.stringify(currentJSON, null, 2);
    container.appendChild(pre);
}

/* ====================================
   PLACEHOLDER RENDERER
==================================== */

function renderPlaceholder(container, text) {
    const div = document.createElement("div");
    div.textContent = text;
    container.appendChild(div);
}
