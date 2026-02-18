/* =========================================================
CONTROLTHEWORLD FILE MANAGER VIEWER v4.0
TRUE FILESYSTEM TREE ENGINE — FULLY FIXED
========================================================= */

let fm_tree = {};
let fm_currentNode = null;
let fm_currentPath = "";

let fm_state = {

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

/* BUILD TREE */

fm_tree = buildFileTree(currentJSON);

fm_currentPath = fm_tree.path;

fm_currentNode = fm_tree;

container.innerHTML = buildUI();

attachEvents();

fm_render();

}

/* =========================================================
BUILD TRUE TREE
========================================================= */

function buildFileTree(files)
{

const root =
createNode("/", true);

files.forEach(file =>
{

    const parts =
    normalizePath(file.path)
    .split("/")
    .filter(Boolean);

    let current = root;

    parts.forEach((part, index) =>
    {

        if (!current.children[part])
        {

            current.children[part] =
            createNode(

                "/" + parts.slice(0,index+1).join("/"),

                index !== parts.length - 1
                || file.directory

            );

        }

        current =
        current.children[part];

    });

    current.size = file.size || 0;
    current.hidden = file.hidden || false;
    current.modified =
    file.last_modified || 0;

});

return root;

}

/* =========================================================
CREATE NODE
========================================================= */

function createNode(path, directory)
{

return {

path,

name: path.split("/").pop() || "Root",

directory,

children: {},

size: 0,

hidden: false,

modified: 0

};

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
placeholder="Search current folder">

<select id="fm-type">
<option value="all">All</option>
<option value="directory">Folders</option>
<option value="file">Files</option>
</select><select id="fm-hidden">
<option value="all">All</option>
<option value="visible">Visible</option>
<option value="hidden">Hidden</option>
</select></div><div id="fm-breadcrumb"
class="filemanager-breadcrumb"></div><div id="fm-list"
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
RENDER
========================================================= */

function fm_render()
{

renderBreadcrumb();

renderList();

}

/* =========================================================
GET CURRENT CHILDREN
========================================================= */

function getCurrentChildren()
{

let list =
Object.values(
fm_currentNode.children
);

return list.filter(node =>
{

if (fm_state.type === "file"
    && node.directory)
    return false;

if (fm_state.type === "directory"
    && !node.directory)
    return false;

if (fm_state.hidden === "hidden"
    && !node.hidden)
    return false;

if (fm_state.hidden === "visible"
    && node.hidden)
    return false;

if (fm_state.search)
{
    return node.name
    .toLowerCase()
    .includes(fm_state.search);
}

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

container.innerHTML = "";

const list =
getCurrentChildren();

if (!list.length)
{
container.innerHTML =
"<div class='filemanager-empty'>Empty folder</div>";
return;
}

list.forEach(node =>
{

const div =
document.createElement("div");

div.className =
"filemanager-item" +
(node.hidden ?
" filemanager-hidden":"");

div.innerHTML =
`

<div class="filemanager-icon">
${node.directory ? "📁":"📄"}
</div><div class="filemanager-info"><div class="filemanager-name">
${escapeHTML(node.name)}
</div><div class="filemanager-meta">
${node.directory
?"Folder"
:formatSize(node.size)}
</div></div>
`;if (node.directory)
{

div.onclick =
() =>
{

fm_currentNode =
node;

fm_currentPath =
node.path;

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

let current = "";

parts.forEach(part =>
{

current += "/" + part;

html +=
" / <span onclick="goPath('${current}')">${part}</span>";

});

bc.innerHTML = html;

}

function goRoot()
{

fm_currentNode =
fm_tree;

fm_currentPath =
fm_tree.path;

fm_render();

}

function goPath(path)
{

const parts =
path.split("/").filter(Boolean);

let current =
fm_tree;

for (const part of parts)
{

current =
current.children[part];

if (!current)
return;

}

fm_currentNode =
current;

fm_currentPath =
current.path;

fm_render();

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
