/* =========================================================
CONTROLTHEWORLD FILE MANAGER VIEWER v7.0
ABSOLUTE ROOT "/" WITH AUTO PARENT CREATION
GUARANTEED FULL VISIBILITY
========================================================= */

let fm_nodes = {};
let fm_currentPath = "/";

let fm_filter =
{
search:"",
type:"all",
hidden:"all"
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

container.className="filemanager-app";

buildFilesystem();

fm_currentPath="/";

container.innerHTML=buildUI();

attachEvents();

renderFM();

}

/* =========================================================
BUILD COMPLETE FILESYSTEM MAP
========================================================= */

function buildFilesystem()
{

fm_nodes={};

/* always create root */
fm_nodes["/"] =
{
path:"/",
name:"/",
directory:true,
children:[],
hidden:false
};

currentJSON.forEach(file =>
{

const normalized =
normalize(file.path);

const parts =
normalized.split("/").filter(Boolean);

let current="";

parts.forEach((part,index)=>
{

const parent =
current===""?"/":current;

current+="/"+part;

if (!fm_nodes[current])
{

fm_nodes[current]=
{
path:current,
name:part,
directory:true,
children:[],
hidden:false
};

}

/* link parent → child */
if (!fm_nodes[parent].children.includes(current))
{

fm_nodes[parent].children.push(current);

}

});

/* apply real file metadata */
fm_nodes[normalized].directory =
file.directory;

fm_nodes[normalized].hidden =
file.hidden;

fm_nodes[normalized].size =
file.size;

fm_nodes[normalized].modified =
file.last_modified;

});

}

/* =========================================================
UI
========================================================= */

function buildUI()
{

return `

<div class="filemanager-header">
File Manager
</div><div class="filemanager-toolbar"><input id="fm-search"
placeholder="Search">

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
.oninput=e=>
{
fm_filter.search=e.target.value.toLowerCase();
renderFM();
};

document.getElementById("fm-type")
.onchange=e=>
{
fm_filter.type=e.target.value;
renderFM();
};

document.getElementById("fm-hidden")
.onchange=e=>
{
fm_filter.hidden=e.target.value;
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
.innerHTML=
buildBreadcrumb(fm_currentPath);

}

function buildBreadcrumb(path)
{

const parts=
path.split("/").filter(Boolean);

let html=
"<span onclick="fm_open('/')">/</span>";

let current="";

parts.forEach(part=>
{

current+="/"+part;

html+=
" / <span onclick="fm_open('${current}')">${part}</span>";

});

return html;

}

/* =========================================================
OPEN FOLDER
========================================================= */

function fm_open(path)
{

if (!fm_nodes[path]) return;

fm_currentPath=path;

renderFM();

}

/* =========================================================
GET CHILDREN
========================================================= */

function getChildren()
{

return fm_nodes[fm_currentPath].children

.map(path=>fm_nodes[path])

.filter(node=>
{

if (fm_filter.type==="file" && node.directory)
return false;

if (fm_filter.type==="directory" && !node.directory)
return false;

if (fm_filter.hidden==="hidden" && !node.hidden)
return false;

if (fm_filter.hidden==="visible" && node.hidden)
return false;

if (fm_filter.search &&
!node.name.toLowerCase().includes(fm_filter.search))
return false;

return true;

})

.sort((a,b)=>
{

if (a.directory!==b.directory)
return b.directory-a.directory;

return a.name.localeCompare(b.name);

});

}

/* =========================================================
RENDER LIST
========================================================= */

function renderList()
{

const container=
document.getElementById("fm-list");

container.innerHTML="";

const children=getChildren();

if (!children.length)
{

container.innerHTML=
"<div class='filemanager-empty'>Empty</div>";

return;

}

children.forEach(node=>
{

const div=
document.createElement("div");

div.className="filemanager-item";

div.innerHTML=
`

<div class="filemanager-icon">
${node.directory?"📁":"📄"}
</div><div class="filemanager-name">
${escapeHTML(node.name)}
</div>
`;if (node.directory)
div.onclick=()=>fm_open(node.path);

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
