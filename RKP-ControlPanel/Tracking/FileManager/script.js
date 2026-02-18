class FileSystemEngine {

constructor(){

this.index = new Map();
this.children = new Map();
this.current = "/";
this.filtered = [];

this.sortField = "name";
this.sortAsc = true;

}

//////////////////////////////////////////////////////

load(json){

this.index.clear();
this.children.clear();

json.forEach(item=>{

this.index.set(item.path,item);

const parent = this.parent(item.path);

if(!this.children.has(parent))
this.children.set(parent,[]);

this.children.get(parent).push(item);

});

this.buildTree();

}

//////////////////////////////////////////////////////

parent(path){

const p = path.split("/");
p.pop();
return p.join("/")||"/";

}

//////////////////////////////////////////////////////

list(path){

let items = this.children.get(path)||[];

items = this.filter(items);

items.sort((a,b)=>{

let v1=a[this.sortField];
let v2=b[this.sortField];

if(v1<v2) return this.sortAsc?-1:1;
if(v1>v2) return this.sortAsc?1:-1;
return 0;

});

return items;

}

//////////////////////////////////////////////////////

filter(items){

const search=document.getElementById("searchBox").value.toLowerCase();

const showHidden=document.getElementById("showHidden").checked;

const type=document.getElementById("typeFilter").value;

const minSize=document.getElementById("minSize").value;
const maxSize=document.getElementById("maxSize").value;

const dateFrom=document.getElementById("dateFrom").value;
const dateTo=document.getElementById("dateTo").value;

return items.filter(f=>{

if(search && !f.name.toLowerCase().includes(search))
return false;

if(!showHidden && f.hidden)
return false;

if(type==="directory" && !f.directory)
return false;

if(type==="file" && f.directory)
return false;

if(minSize && f.size<minSize)
return false;

if(maxSize && f.size>maxSize)
return false;

if(dateFrom && f.last_modified<new Date(dateFrom).getTime())
return false;

if(dateTo && f.last_modified>new Date(dateTo).getTime())
return false;

return true;

});

}

}

//////////////////////////////////////////////////////

const Explorer = new FileSystemEngine();

//////////////////////////////////////////////////////

Explorer.render = function(){

const body=document.getElementById("tableBody");

body.innerHTML="";

const items=this.list(this.current);

items.forEach(item=>{

const tr=document.createElement("tr");

tr.className=item.hidden?"hidden":"";

tr.onclick=()=>{

if(item.directory){

this.current=item.path;
this.render();
this.renderBreadcrumb();

}

};

tr.innerHTML=`

<td class="${item.directory?"folder":"file"}">
${item.directory?"📁":"📄"} ${item.name}
</td><td>${item.directory?"Directory":"File"}</td>
<td>${this.size(item.size)}</td>
<td>${new Date(item.last_modified).toLocaleString()}</td>
<td>${item.hidden}</td>`;

body.appendChild(tr);

});

};

//////////////////////////////////////////////////////

Explorer.buildTree=function(){

const tree=document.getElementById("tree");

tree.innerHTML="";

this.children.forEach((list,path)=>{

if(path==="/")return;

const div=document.createElement("div");

div.innerText=path;

div.onclick=()=>{

this.current=path;
this.render();
this.renderBreadcrumb();

};

tree.appendChild(div);

});

};

//////////////////////////////////////////////////////

Explorer.renderBreadcrumb=function(){

const bc=document.getElementById("breadcrumb");

bc.innerHTML=this.current;

};

//////////////////////////////////////////////////////

Explorer.size=function(size){

if(size>1e9) return (size/1e9).toFixed(2)+" GB";
if(size>1e6) return (size/1e6).toFixed(2)+" MB";
if(size>1e3) return (size/1e3).toFixed(2)+" KB";
return size+" B";

};

//////////////////////////////////////////////////////

Explorer.sort=function(field){

this.sortAsc = this.sortField===field ? !this.sortAsc:true;
this.sortField=field;
this.render();

};

//////////////////////////////////////////////////////

Explorer.applyFilters=function(){

this.render();

};

//////////////////////////////////////////////////////

Explorer.loadFile=function(){

const file=document.getElementById("fileInput").files[0];

const reader=new FileReader();

reader.onload=e=>{

Explorer.load(JSON.parse(e.target.result));
Explorer.render();

};

reader.readAsText(file);

};

//////////////////////////////////////////////////////

Explorer.loadGithub=function(){

const url=document.getElementById("githubInput").value;

fetch(url)
.then(r=>r.json())
.then(data=>{

Explorer.load(data);
Explorer.render();

});

};

//////////////////////////////////////////////////////

window.onload=function(){

const params=new URLSearchParams(location.search);

const url=params.get("url");

if(url){

fetch(url)
.then(r=>r.json())
.then(data=>{
Explorer.load(data);
Explorer.render();
});

}

};
