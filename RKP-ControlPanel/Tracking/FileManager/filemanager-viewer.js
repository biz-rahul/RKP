/* =========================================================
CONTROLTHEWORLD FILE MANAGER VIEWER v6.0
TRUE ROOT "/" FILESYSTEM — COMPLETE FIX
Shows ALL files, ALL folders, ALL depths
========================================================= */

let fm_root = null;
let fm_current = null;

let fm_filter =
{
search: "",
type: "all",
hidden: "all"
};

/* =========================================================
MAIN ENTRY
========================================================= */

function renderFileManager(container)
{

if (!Array.isArray(currentJSON))
{
    container.innerHTML =
    "<div class='filemanager-empty'>Invalid filesystem</div>";
    return;
}

container.className = "filemanager-app";

/* CREATE TRUE ROOT "/" */

fm_root = createNode("/", true);

/* INSERT ALL FILES */

currentJSON.forEach(file =>
insertPath(file));

/* START FROM "/" */

fm_current = fm_root;

container.innerHTML = buildUI();

attachEvents();

renderFM();

}

/* =========================================================
CREATE NODE
========================================================= */

function createNode(path, directory)
{

return {

path,

name:
path === "/"
? "/"
: path.split("/").pop(),

directory,

children: {},

size: 0,

hidden: false,

modified: 0

};

}

/* =========================================================
INSERT PATH INTO TREE
========================================================= */

function insertPath(file)
{

const full =
normalize(file.path);

const parts =
full.split("/")
.filter(Boolean);

let current = fm_root;

let currentPath = "";

parts.forEach((part,index)=>
{

    currentPath += "/" + part;

    if (!current.children[part])
    {

        const isDir =
        index < parts.length - 1
        || file.directory;

        current.children[part] =
        createNode(currentPath, isDir);

    }

    current =
    current.children[part];

});

current.size =
file.size || 0;

current.hidden =
file.hidden || false;

current.modified =
file.last_modified || 0;

}

/* =========================================================
BUILD UI
========================================================= */

function buildUI()
{

return `

<div class="filemanager-header">
File Manager
</div><div class="filemanager-toolbar"><input id="fm-search"
placeholder="Search current folder">

<select id="fm-type">
<option value="all">All</option>
<option value="directory">Folders</option>
<option value="file">Files</option>
</select><select id="fm-hidden">
<option value="all">All</option>
<option value="visible">Visible</option>
<option value="hidden">Hidden</option>
</select></div><div id="fm-path"
class="filemanager-path"></div><div id="fm-list"
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
fm_filter.search =
e.target.value.toLowerCase();
renderFM();
};

document.getElementById("fm-type")
.onchange = e =>
{
fm_filter.type = e.target.value;
renderFM();
};

document.getElementById("fm-hidden")
.onchange = e =>
{
fm_filter.hidden = e.target.value;
renderFM();
};

}

/* =========================================================
RENDER
========================================================= */

function renderFM()
{

renderPath();

renderList();

}

/* =========================================================
PATH BAR
========================================================= */

function renderPath()
{

document.getElementById("fm-path")
.innerHTML =
buildBreadcrumb(fm_current.path);

}

/* =========================================================
BREADCRUMB NAVIGATION
========================================================= */

function buildBreadcrumb(path)
{

const parts =
path.split("/").filter(Boolean);

let html =
"<span onclick="fm_go('/')">/</span>";

let current = "";

parts.forEach(part =>
{

current += "/" + part;

html +=
" / <span onclick="fm_go('${current}')">${part}</span>";

});

return html;

}

function fm_go(path)
{

const parts =
path.split("/").filter(Boolean);

let node = fm_root;

for (const part of parts)
{

node =
node.children[part];

if (!node)
return;

}

fm_current = node;

renderFM();

}

/* =========================================================
GET CHILDREN WITH FILTERS
========================================================= */

function getChildren()
{

return Object.values(
fm_current.children)

.filter(node =>
{

if (fm_filter.type==="file"
&& node.directory)
return false;

if (fm_filter.type==="directory"
&& !node.directory)
return false;

if (fm_filter.hidden==="hidden"
&& !node.hidden)
return false;

if (fm_filter.hidden==="visible"
&& node.hidden)
return false;

if (fm_filter.search &&
!node.name.toLowerCase()
.includes(fm_filter.search))
return false;

return true;

})

.sort((a,b)=>
{

if (a.directory !== b.directory)
return b.directory - a.directory;

return a.name.localeCompare(b.name);

});

}

/* =========================================================
RENDER LIST
========================================================= */

function renderList()
{

const container =
document.getElementById("fm-list");

container.innerHTML="";

const children =
getChildren();

if (!children.length)
{

container.innerHTML=
"<div class='filemanager-empty'>Empty folder</div>";

return;

}

children.forEach(node =>
{

const div =
document.createElement("div");

div.className =
"filemanager-item";

div.innerHTML=
`

<div class="filemanager-icon">
${node.directory ? "📁":"📄"}
</div><div class="filemanager-name">
${escapeHTML(node.name)}
</div>
`;if (node.directory)
{

div.onclick=
()=>
{

fm_current=node;

renderFM();

};

}

container.appendChild(div);

});

}

/* =========================================================
HELPERS
========================================================= */

function normalize(path)
{
return path.replace(//+/g,"/");
}

function escapeHTML(str)
{
return str
.replace(/&/g,"&")
.replace(/</g,"<")
.replace(/>/g,">");
}
