let contacts=[];
let filtered=[];

let duplicateMap=new Map();

function normalizeNumber(num)
{
return num.replace(/\D/g,'');
}

function hash(contact)
{
return contact.name.toLowerCase()+"|"+normalizeNumber(contact.number);
}

function buildDuplicateMap()
{
duplicateMap.clear();

contacts.forEach(c=>
{
let h=hash(c);

if(!duplicateMap.has(h))
duplicateMap.set(h,[]);

duplicateMap.get(h).push(c);
});
}

function isDuplicate(contact)
{
return duplicateMap.get(hash(contact)).length>1;
}

function loadContacts(data)
{
contacts=data.map(c=>({
name:c.name||"",
number:c.number||"",
normalized:normalizeNumber(c.number)
}));

buildDuplicateMap();

filtered=[...contacts];

render();
updateStats();
}

function loadPaste()
{
try{
let data=JSON.parse(
document.getElementById("jsonPaste").value
);
loadContacts(data);
}catch(e){alert("Invalid JSON")}
}

function loadFile()
{
let file=document.getElementById("fileInput").files[0];

let reader=new FileReader();

reader.onload=e=>
loadContacts(JSON.parse(e.target.result));

reader.readAsText(file);
}

async function loadGitHub()
{
let url=document.getElementById("githubUrl").value;

let res=await fetch(url);

let json=await res.json();

loadContacts(json);
}

function applyFilters()
{
let nameFilter=
document.getElementById("nameFilter").value.toLowerCase();

let numberFilter=
document.getElementById("numberFilter").value;

let duplicateFilter=
document.getElementById("duplicateFilter").value;

let sortFilter=
document.getElementById("sortFilter").value;

filtered=contacts.filter(c=>
{
if(nameFilter && !c.name.toLowerCase().includes(nameFilter))
return false;

if(numberFilter && !c.number.includes(numberFilter))
return false;

if(duplicateFilter=="duplicate" && !isDuplicate(c))
return false;

if(duplicateFilter=="unique" && isDuplicate(c))
return false;

return true;
});

filtered.sort((a,b)=>
a[sortFilter].localeCompare(b[sortFilter])
);

render();
updateStats();
}

function render()
{
let container=
document.getElementById("contactsContainer");

container.innerHTML="";

filtered.forEach(c=>
{
let div=document.createElement("div");

div.className=
"contact "+(isDuplicate(c)?"duplicate":"unique");

div.innerHTML=
`
<div>${c.name}</div>
<div>${c.number}</div>
`;

container.appendChild(div);
});
}

function updateStats()
{
let total=contacts.length;

let duplicate=contacts.filter(isDuplicate).length;

let unique=total-duplicate;

document.getElementById("stats").innerHTML=
`
Total: ${total}<br>
Unique: ${unique}<br>
Duplicate: ${duplicate}
`;
}

function exportCSV()
{
let csv="Name,Number\n";

filtered.forEach(c=>
csv+=`${c.name},${c.number}\n`
);

download(csv,"contacts.csv");
}

function exportJSON()
{
download(
JSON.stringify(filtered,null,2),
"contacts.json"
);
}

function download(content,filename)
{
let blob=new Blob([content]);

let a=document.createElement("a");

a.href=URL.createObjectURL(blob);

a.download=filename;

a.click();
}

(function autoLoad()
{
let params=new URLSearchParams(location.search);

let github=params.get("github");

if(github)
{
document.getElementById("githubUrl").value=github;
loadGitHub();
}
})();
