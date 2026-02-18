/* =========================================================
CONTROLTHEWORLD FILE MANAGER VIEWER v5.0
FULLY FIXED VERSION WITH PARAMETER LOADER SUPPORT
========================================================= */

let fm_allFiles = [];
let fm_currentPath = "/";
let fm_filteredFiles = [];

/* =========================================================
MAIN RENDER FUNCTION
========================================================= */

function renderFileManager(container)
{

if (!Array.isArray(currentJSON))
{
    container.innerHTML =
    "<div class='filemanager-empty'>Invalid file data</div>";
    return;
}

/* NORMALIZE FILE STRUCTURE */

fm_allFiles =
currentJSON.map(file =>
({
    name: file.name,
    path: file.path,
    size: file.size || 0,
    modified: file.last_modified || 0,
    hidden: file.hidden || false,
    directory: file.directory || false,
    parent: getParent(file.path)
}));

/* DETECT REAL ROOT */

fm_currentPath =
detectRootPath();

container.innerHTML =
`
<div class="filemanager-header">

    <div class="filemanager-path" id="fmPath">
        ${fm_currentPath}
    </div>

    <input
        type="text"
        id="fmSearch"
        class="filemanager-search"
        placeholder="Search files...">

</div>

<div id="fmList"
     class="filemanager-list"></div>
`;

document
.getElementById("fmSearch")
.addEventListener(
    "input",
    function()
    {
        renderFileList(
            this.value.toLowerCase());
    });

renderFileList();

}

/* =========================================================
ROOT DETECTION
========================================================= */

function detectRootPath()
{

if(!fm_allFiles.length)
    return "/";

const first =
    fm_allFiles[0].path;

const parts =
    first.split("/")
    .filter(Boolean);

if(parts.length >= 3)
    return "/" +
        parts[0] + "/" +
        parts[1] + "/" +
        parts[2];

return "/";

}

/* =========================================================
GET PARENT PATH
========================================================= */

function getParent(path)
{

if(!path) return "/";

const parts =
    path.split("/");

parts.pop();

const parent =
    parts.join("/");

return parent === ""
    ? "/"
    : parent;

}

/* =========================================================
RENDER FILE LIST
========================================================= */

function renderFileList(search = "")
{

const list =
    document.getElementById("fmList");

if(!list) return;

list.innerHTML = "";

fm_filteredFiles =
fm_allFiles.filter(file =>
{

    if(file.parent !== fm_currentPath)
        return false;

    if(search &&
       !file.name.toLowerCase()
       .includes(search))
        return false;

    return true;

});

/* SORT: directories first */

fm_filteredFiles.sort((a,b)=>
{

    if(a.directory && !b.directory)
        return -1;

    if(!a.directory && b.directory)
        return 1;

    return a.name.localeCompare(b.name);

});

/* BACK BUTTON */

if(fm_currentPath !== detectRootPath())
{

    const back =
    document.createElement("div");

    back.className =
    "filemanager-item";

    back.innerHTML =
    "📁 .. (Back)";

    back.onclick =
    function()
    {
        fm_currentPath =
        getParent(fm_currentPath);

        updatePath();

        renderFileList();
    };

    list.appendChild(back);
}

/* FILE ITEMS */

fm_filteredFiles.forEach(file =>
{

    const div =
    document.createElement("div");

    div.className =
    "filemanager-item";

    const icon =
    file.directory
    ? "📁"
    : "📄";

    div.innerHTML =
    icon + " " +
    file.name;

    if(file.directory)
    {
        div.onclick =
        function()
        {
            fm_currentPath =
            file.path;

            updatePath();

            renderFileList();
        };
    }

    list.appendChild(div);

});

}

/* =========================================================
UPDATE PATH BAR
========================================================= */

function updatePath()
{
const el =
document.getElementById(
"fmPath");

if(el)
    el.innerHTML =
    fm_currentPath;

}

/* =========================================================
PARAMETER LOADER BRIDGE FUNCTION
THIS FIXES YOUR ISSUE
========================================================= */

window.onViewerData =
function(data)
{

window.currentJSON =
    data;

const container =
    document.getElementById(
        "viewerRoot");

renderFileManager(container);

};
