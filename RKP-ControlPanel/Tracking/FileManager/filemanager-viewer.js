/* =========================================================
CONTROLTHEWORLD — FILE MANAGER INTELLIGENCE VIEWER JS v2.0
Fully Fixed Root Detection + Advanced Intelligence Engine
Zero main HTML modification required
========================================================= */

/* =========================================================
GLOBAL STATE
========================================================= */

let fm_allFiles = [];
let fm_currentPath = "/";
let fm_filtered = [];

let fm_state = {

search: "",
type: "all",
hidden: "all",
sort: "name",
order: "asc"

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

/* Normalize filesystem */

fm_allFiles =
currentJSON.map(file => ({

    name: file.name || "Unknown",

    path: normalizePath(file.path),

    directory: !!file.directory,

    hidden: !!file.hidden,

    size: file.size || 0,

    modified: file.last_modified || 0,

    extension: getExtension(file.name),

    parent: getParent(normalizePath(file.path))

}));

/* Detect correct root automatically */

fm_currentPath = detectRootPath();

/* Build UI */

container.innerHTML = buildFileManagerUI();

attachFileManagerEvents();

fm_render();

}

/* =========================================================
BUILD UI
========================================================= */

function buildFileManagerUI()
{

return `

<div class="filemanager-header">
    File Manager Intelligence
</div><div class="filemanager-toolbar"><input id="fm-search"
placeholder="Search name or path">

<select id="fm-type">
    <option value="all">All</option>
    <option value="directory">Folders</option>
    <option value="file">Files</option>
</select>

<select id="fm-hidden">
    <option value="all">All</option>
    <option value="visible">Visible</option>
    <option value="hidden">Hidden</option>
</select>

<select id="fm-sort">
    <option value="name">Sort: Name</option>
    <option value="size">Sort: Size</option>
    <option value="modified">Sort: Date</option>
    <option value="extension">Sort: Type</option>
</select>

<button id="fm-export">
    Export
</button>

</div><div id="fm-breadcrumb"
class="filemanager-breadcrumb"></div><div id="fm-stats"
class="filemanager-stats"></div><div id="fm-list"
class="filemanager-list"></div>`;
}

/* =========================================================
EVENT SYSTEM
========================================================= */

function attachFileManagerEvents()
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
fm_state.type = e.target.value;
fm_render();
};

document.getElementById("fm-hidden")
.onchange = e =>
{
fm_state.hidden = e.target.value;
fm_render();
};

document.getElementById("fm-sort")
.onchange = e =>
{
fm_state.sort = e.target.value;
fm_render();
};

document.getElementById("fm-export")
.onclick = () =>
{
exportJSON(fm_filtered);
};

}

/* =========================================================
MAIN RENDER PIPELINE
========================================================= */

function fm_render()
{

let list =
fm_allFiles.filter(file =>
file.parent === fm_currentPath
);

/* Apply filters */

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
        file.name.toLowerCase().includes(fm_state.search)
        ||
        file.path.toLowerCase().includes(fm_state.search)
    );
}

return true;

});

/* Sorting */

list.sort((a,b)=>
{

let v1 = a[fm_state.sort];
let v2 = b[fm_state.sort];

if(typeof v1 === "string")
return v1.localeCompare(v2);

return v1 - v2;

});

/* Directories first */

list.sort((a,b)=>
b.directory - a.directory
);

fm_filtered = list;

renderBreadcrumb();
renderStats();
renderFileList();

}

/* =========================================================
FILE LIST RENDER
========================================================= */

function renderFileList()
{

const container =
document.getElementById("fm-list");

container.innerHTML = "";

if(fm_filtered.length === 0)
{
container.innerHTML =
"<div class='filemanager-empty'>No files found</div>";
return;
}

fm_filtered.forEach(file =>
{

const div =
document.createElement("div");

div.className =
"filemanager-item" +
(file.hidden ? " filemanager-hidden": "");

div.innerHTML =
`

<div class="filemanager-icon">
${file.directory ? "📁" : getFileIcon(file.extension)}
</div><div class="filemanager-info"><div class="filemanager-name">
${escapeHTML(file.name)}
</div><div class="filemanager-meta">${file.directory
? "Folder"
: formatSize(file.size)}

•
${formatDate(file.modified)}

</div></div>
`;if(file.directory)
{
div.onclick =
() =>
{
fm_currentPath = file.path;
fm_render();
};
}

container.appendChild(div);

});

}

/* =========================================================
BREADCRUMB NAVIGATION
========================================================= */

function renderBreadcrumb()
{

const bc =
document.getElementById("fm-breadcrumb");

const parts =
fm_currentPath.split("/").filter(Boolean);

let html =
"<span onclick="fm_goRoot()">Root</span>";

let path = "";

parts.forEach(p =>
{

path += "/" + p;

html +=
" / <span onclick="fm_goPath('${path}')">${p}</span>";

});

bc.innerHTML = html;

}

function fm_goRoot()
{

fm_currentPath = detectRootPath();
fm_render();

}

function fm_goPath(path)
{

fm_currentPath = path;
fm_render();

}

/* =========================================================
STATS ENGINE
========================================================= */

function renderStats()
{

const stats =
document.getElementById("fm-stats");

const total =
fm_filtered.length;

const files =
fm_filtered.filter(f=>!f.directory).length;

const dirs =
fm_filtered.filter(f=>f.directory).length;

stats.innerHTML =
"${total} items • ${files} files • ${dirs} folders";

}

/* =========================================================
ROOT DETECTION ENGINE (FIXED)
========================================================= */

function detectRootPath()
{

if(fm_allFiles.length === 0)
return "/";

/* find shortest path */

let shortest =
fm_allFiles[0].path;

fm_allFiles.forEach(f =>
{

if(f.path.length < shortest.length)
shortest = f.path;

});

/* remove filename if file */

if(!shortest.endsWith("/"))
{
const parent =
getParent(shortest);
return parent || "/";
}

return shortest;

}

/* =========================================================
HELPERS
========================================================= */

function normalizePath(path)
{

if(!path) return "/";

return path.replace(//+/g,"/");

}

function getParent(path)
{

if(!path) return "/";

const parts =
path.split("/");

parts.pop();

const parent =
parts.join("/");

return parent || "/";

}

function getExtension(name)
{

if(!name) return "";

const i =
name.lastIndexOf(".");

if(i === -1)
return "";

return name.substring(i+1).toLowerCase();

}

function formatSize(bytes)
{

if(!bytes) return "0 B";

const units =
["B","KB","MB","GB"];

let i = 0;

while(bytes >= 1024 && i < units.length-1)
{
bytes /= 1024;
i++;
}

return bytes.toFixed(1) + " " + units[i];

}

function formatDate(ts)
{

if(!ts) return "Unknown";

return new Date(ts).toLocaleString();

}

function exportJSON(data)
{

const blob =
new Blob(
[JSON.stringify(data,null,2)],
{type:"application/json"}
);

const a =
document.createElement("a");

a.href =
URL.createObjectURL(blob);

a.download =
"filemanager_export.json";

a.click();

}

function escapeHTML(str)
{

return str
.replace(/&/g,"&")
.replace(/</g,"<")
.replace(/>/g,">");

}

function getFileIcon(ext)
{

const map =
{
zip:"🗜",
apk:"📦",
json:"📄",
mp3:"🎵",
mp4:"🎬",
jpg:"🖼",
png:"🖼",
txt:"📄"
};

return map[ext] || "📄";

}
