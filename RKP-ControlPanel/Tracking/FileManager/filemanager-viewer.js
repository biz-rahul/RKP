/* =========================================================
CONTROLTHEWORLD FILE MANAGER VIEWER v3.0
FULLY FIXED — WORKS WITH FLAT FILESYSTEM JSON
========================================================= */

let fm_allFiles = [];
let fm_currentPath = "";
let fm_filtered = [];

let fm_state = {

search: "",
type: "all",
hidden: "all",
sort: "name"

};

/* =========================================================
MAIN ENTRY
========================================================= */

function renderFileManager(container)
{

if (!Array.isArray(currentJSON))
{
    container.innerHTML =
    "<div class='filemanager-empty'>Invalid file structure</div>";
    return;
}

container.className = "filemanager-app";

/* Normalize */

fm_allFiles =
currentJSON.map(f => ({

    name: f.name || "Unknown",

    path: normalizePath(f.path),

    directory: !!f.directory,

    hidden: !!f.hidden,

    size: f.size || 0,

    modified: f.last_modified || 0

}));

/* DETECT ROOT */

fm_currentPath = detectRoot();

container.innerHTML = buildUI();

attachEvents();

fm_render();

}

/* =========================================================
DETECT ROOT
========================================================= */

function detectRoot()
{

if (fm_allFiles.length === 0)
    return "/";

/* Find shortest path */

let shortest =
fm_allFiles.reduce((a,b)=>
    a.path.length < b.path.length ? a : b
).path;

return shortest;

}

/* =========================================================
BUILD UI
========================================================= */

function buildUI()
{

return `

<div class="filemanager-header">
File Manager Intelligence
</div><div class="filemanager-toolbar"><input id="fm-search"
placeholder="Search files">

<select id="fm-type">
<option value="all">All</option>
<option value="directory">Folders</option>
<option value="file">Files</option>
</select><select id="fm-hidden">
<option value="all">All</option>
<option value="visible">Visible</option>
<option value="hidden">Hidden</option>
</select></div><div id="fm-breadcrumb"
class="filemanager-breadcrumb"></div><div id="fm-stats"
class="filemanager-stats"></div><div id="fm-list"
class="filemanager-list"></div>`;

}

/* =========================================================
EVENTS
========================================================= */

function attachEvents()
{

document.getElementById("fm-search")
.oninput = e =>
{
fm_state.search =
e.target.value.toLowerCase();
fm_render();
};

document.getElementById("fm-type")
.onchange = e =>
{
fm_state.type =
e.target.value;
fm_render();
};

document.getElementById("fm-hidden")
.onchange = e =>
{
fm_state.hidden =
e.target.value;
fm_render();
};

}

/* =========================================================
CORE FIX — GET DIRECT CHILDREN USING PATH PREFIX
========================================================= */

function getChildren(path)
{

const depth =
path.split("/").length;

return fm_allFiles.filter(file =>
{

    if (file.path === path)
        return false;

    if (!file.path.startsWith(path))
        return false;

    const fileDepth =
    file.path.split("/").length;

    return fileDepth === depth + 1;

});

}

/* =========================================================
RENDER
========================================================= */

function fm_render()
{

let list =
getChildren(fm_currentPath);

/* FILTER */

list =
list.filter(file =>
{

if (fm_state.type === "file" && file.directory)
    return false;

if (fm_state.type === "directory" && !file.directory)
    return false;

if (fm_state.hidden === "hidden" && !file.hidden)
    return false;

if (fm_state.hidden === "visible" && file.hidden)
    return false;

if (fm_state.search)
{
    return (
        file.name.toLowerCase()
        .includes(fm_state.search)
    );
}

return true;

});

/* SORT */

list.sort((a,b)=>
{

if (a.directory !== b.directory)
    return b.directory - a.directory;

return a.name.localeCompare(b.name);

});

fm_filtered = list;

renderBreadcrumb();

renderStats();

renderList();

}

/* =========================================================
RENDER LIST
========================================================= */

function renderList()
{

const container =
document.getElementById("fm-list");

container.innerHTML = "";

if (fm_filtered.length === 0)
{
container.innerHTML =
"<div class='filemanager-empty'>Empty folder</div>";
return;
}

fm_filtered.forEach(file =>
{

const div =
document.createElement("div");

div.className =
"filemanager-item" +
(file.hidden ? " filemanager-hidden":"");

div.innerHTML =
`

<div class="filemanager-icon">
${file.directory ? "📁":"📄"}
</div><div class="filemanager-info"><div class="filemanager-name">
${escapeHTML(file.name)}
</div><div class="filemanager-meta">
${file.directory
?"Folder"
:formatSize(file.size)}
</div></div>
`;if (file.directory)
{
div.onclick =
() =>
{
fm_currentPath =
file.path;
fm_render();
};
}

container.appendChild(div);

});

}

/* =========================================================
BREADCRUMB
========================================================= */

function renderBreadcrumb()
{

const bc =
document.getElementById("fm-breadcrumb");

const parts =
fm_currentPath.split("/").filter(Boolean);

let html =
"<span onclick="goRoot()">Root</span>";

let path = "";

parts.forEach(p =>
{

path += "/" + p;

html +=
" / <span onclick="goPath('${path}')">${p}</span>";

});

bc.innerHTML = html;

}

function goRoot()
{

fm_currentPath =
detectRoot();

fm_render();

}

function goPath(path)
{

fm_currentPath =
path;

fm_render();

}

/* =========================================================
STATS
========================================================= */

function renderStats()
{

const stats =
document.getElementById("fm-stats");

stats.innerHTML =
"${fm_filtered.length} items";

}

/* =========================================================
HELPERS
========================================================= */

function normalizePath(path)
{

return path.replace(//+/g,"/");

}

function formatSize(bytes)
{

if(!bytes) return "0 B";

const units =
["B","KB","MB","GB"];

let i=0;

while(bytes>=1024)
{
bytes/=1024;
i++;
}

return bytes.toFixed(1)+" "+units[i];

}

function escapeHTML(str)
{

return str
.replace(/&/g,"&")
.replace(/</g,"<")
.replace(/>/g,">");

    }
