/* =========================================================
CONTROLTHEWORLD — FILE MANAGER INTELLIGENCE VIEWER JS v1.0
Forensic Storage Analysis Engine
Compatible with your existing viewer architecture
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
extension: "all",
sort: "name",
order: "asc"

};

/* =========================================================
MAIN ENTRY POINT
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

fm_allFiles = currentJSON.map(file =>
({
    name: file.name,
    path: file.path,
    directory: file.directory,
    hidden: file.hidden,
    size: file.size,
    modified: file.last_modified,
    extension: getExtension(file.name),
    parent: getParent(file.path)
}));

fm_currentPath = "/";
fm_buildUI(container);

fm_render();

}

/* =========================================================
BUILD UI
========================================================= */

function fm_buildUI(container)
{

container.innerHTML = `

<div class="filemanager-header">
    File Manager Intelligence
</div><div class="filemanager-toolbar"><input id="fm-search"
       placeholder="Search files, folders, paths">

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
    <option value="type">Sort: Type</option>
</select>

<button id="fm-export">
    Export JSON
</button>

</div><div class="filemanager-breadcrumb"
     id="fm-breadcrumb">
</div><div class="filemanager-stats"
     id="fm-stats">
</div><div class="filemanager-list"
     id="fm-list">
</div>`;

fm_attachEvents();

}

/* =========================================================
EVENTS
========================================================= */

function fm_attachEvents()
{

document.getElementById("fm-search")
.oninput = e =>
{
fm_state.search = e.target.value.toLowerCase();
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
downloadJSON(fm_filtered, "filemanager_export.json");
};

}

/* =========================================================
RENDER PIPELINE
========================================================= */

function fm_render()
{

let list =
fm_allFiles.filter(f =>
f.parent === fm_currentPath
);

/* Apply filters */

list =
list.filter(f =>
{

    if (fm_state.type === "file" && f.directory)
        return false;

    if (fm_state.type === "directory" && !f.directory)
        return false;

    if (fm_state.hidden === "hidden" && !f.hidden)
        return false;

    if (fm_state.hidden === "visible" && f.hidden)
        return false;

    if (fm_state.search)
    {
        return (
            f.name.toLowerCase().includes(fm_state.search)
            ||
            f.path.toLowerCase().includes(fm_state.search)
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

fm_filtered = list;

fm_renderBreadcrumb();
fm_renderStats();
fm_renderList();

}

/* =========================================================
RENDER LIST
========================================================= */

function fm_renderList()
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
"filemanager-item " +
(file.hidden ? "filemanager-hidden":"");

div.innerHTML =
`

<div class="filemanager-icon">
${file.directory ? "📁" : getFileIcon(file.extension)}
</div><div class="filemanager-info"><div class="filemanager-name">
${escapeHTML(file.name)}
</div><div class="filemanager-meta">
${file.directory ? "Folder" : formatSize(file.size)}
• ${formatDate(file.modified)}
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
BREADCRUMB
========================================================= */

function fm_renderBreadcrumb()
{

const bc =
document.getElementById("fm-breadcrumb");

const parts =
fm_currentPath.split("/").filter(Boolean);

let html =
"<span onclick="fm_navigate('/')">Root</span>";

let path = "";

parts.forEach(p=>
{

path += "/" + p;

html +=
" / <span onclick="fm_navigate('${path}')">${p}</span>";

});

bc.innerHTML = html;

}

function fm_navigate(path)
{

fm_currentPath = path;
fm_render();

}

/* =========================================================
STATS
========================================================= */

function fm_renderStats()
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
HELPERS
========================================================= */

function getParent(path)
{

const parts =
path.split("/");

parts.pop();

return parts.join("/") || "/";

}

function getExtension(name)
{

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

let i=0;

while(bytes>=1024)
{
bytes/=1024;
i++;
}

return bytes.toFixed(1)+" "+units[i];

}

function formatDate(ts)
{

return new Date(ts).toLocaleString();

}

function downloadJSON(data,name)
{

const blob =
new Blob([JSON.stringify(data,null,2)],
{type:"application/json"});

const a =
document.createElement("a");

a.href =
URL.createObjectURL(blob);

a.download =
name;

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
png:"🖼"
};

return map[ext] || "📄";

}
