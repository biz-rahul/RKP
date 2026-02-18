let threads=[];
let filteredThreads=[];
let currentThread=null;

let stats={
credit:0,
debit:0,
messages:0,
threads:0
};

function parseAmount(text){

let match=text.match(/Rs.?\s?([\d.]+)/i);

return match?parseFloat(match[1]):0;

}

function detectTransaction(msg){

let amount=parseAmount(msg.body);

if(msg.body.toLowerCase().includes("credited"))
return {type:"credit",amount};

if(msg.body.toLowerCase().includes("debited"))
return {type:"debit",amount};

return null;

}

function computeStats(){

stats.credit=0;
stats.debit=0;
stats.messages=0;
stats.threads=threads.length;

threads.forEach(thread=>{

thread.messages.forEach(msg=>{

stats.messages++;

let tx=detectTransaction(msg);

if(tx){

if(tx.type=="credit")
stats.credit+=tx.amount;

if(tx.type=="debit")
stats.debit+=tx.amount;

}

});

});

document.getElementById("statThreads").innerText="Threads: "+stats.threads;
document.getElementById("statMessages").innerText="Messages: "+stats.messages;
document.getElementById("statCredit").innerText="Credit: ₹"+stats.credit;
document.getElementById("statDebit").innerText="Debit: ₹"+stats.debit;
document.getElementById("statNet").innerText="Net: ₹"+(stats.credit-stats.debit);

}

function renderThreads(){

let panel=document.getElementById("threadPanel");

panel.innerHTML="";

filteredThreads.forEach((thread,index)=>{

let div=document.createElement("div");

div.className="thread";

div.innerHTML="<b>${thread.name||thread.address}</b> <br>${thread.messages.length} msgs";

div.onclick=()=>showThread(thread);

panel.appendChild(div);

});

}

function showThread(thread){

currentThread=thread;

let panel=document.getElementById("messagePanel");

panel.innerHTML="";

thread.messages.forEach(msg=>{

let div=document.createElement("div");

div.className="message "+(msg.type_name=="SENT"?"sent":"inbox");

let tx=detectTransaction(msg);

div.innerHTML=`

<div>${msg.body}</div>
<small>${new Date(msg.date).toLocaleString()}</small>
${tx?`<div>₹${tx.amount} ${tx.type}</div>`:""}
`;panel.appendChild(div);

});

}

function applyFilters(){

let search=document.getElementById("searchBox").value.toLowerCase();

filteredThreads=threads.map(thread=>{

let msgs=thread.messages.filter(msg=>{

if(search && !msg.body.toLowerCase().includes(search))
return false;

return true;

});

return {...thread,messages:msgs};

}).filter(t=>t.messages.length>0);

renderThreads();

}

document.getElementById("searchBox").oninput=applyFilters;

function loadJSON(text){

threads=JSON.parse(text);

filteredThreads=threads;

computeStats();

renderThreads();

}

function loadPaste(){

loadJSON(document.getElementById("pasteBox").value);

}

document.getElementById("fileInput").onchange=function(){

let reader=new FileReader();

reader.onload=e=>loadJSON(e.target.result);

reader.readAsText(this.files[0]);

}

async function loadGithub(){

let url=document.getElementById("githubInput").value;

let res=await fetch(url);

let text=await res.text();

loadJSON(text);

}

function autoLoad(){

let params=new URLSearchParams(location.search);

let url=params.get("url");

if(url){

fetch(url)
.then(r=>r.text())
.then(loadJSON);

}

}

autoLoad();
