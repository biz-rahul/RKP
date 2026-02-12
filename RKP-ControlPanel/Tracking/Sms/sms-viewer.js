SMS VIEWER ENGINE
========================================= */

function renderSMS(container) {
if (!Array.isArray(currentJSON)) {
container.innerHTML = "<p>Invalid SMS format.</p>";
return;
}

// Group by address  
const grouped = {};  

currentJSON.forEach(msg => {  
    if (!grouped[msg.address]) grouped[msg.address] = [];  
    grouped[msg.address].push(msg);  
});  

// Sort conversations by latest message  
const conversations = Object.keys(grouped).map(address => {  
    const messages = grouped[address].sort((a, b) => a.date - b.date);  
    return {  
        address,  
        messages,  
        latest: messages[messages.length - 1]  
    };  
}).sort((a, b) => b.latest.date - a.latest.date);  

container.className = "sms-app";  
container.innerHTML = `  
    <div class="sms-header">Messages</div>  
    <div class="sms-search">  
        <input type="text" id="smsSearch" placeholder="Search messages">  
    </div>  
    <div class="sms-list" id="smsList"></div>  
`;  

const list = document.getElementById("smsList");  

conversations.forEach(conv => {  
    const item = createConversationItem(conv);  
    list.appendChild(item);  
});  

document.getElementById("smsSearch").addEventListener("input", function () {  
    const query = this.value.toLowerCase();  
    filterSMS(query);  
});

}

/* =========================================
CREATE CONVERSATION ITEM
========================================= */

function createConversationItem(conv) {
const item = document.createElement("div");
item.className = "sms-item";

const avatar = document.createElement("div");  
avatar.className = "sms-avatar";  
avatar.textContent = conv.address[0].toUpperCase();  

const details = document.createElement("div");  
details.className = "sms-details";  

const address = document.createElement("div");  
address.className = "sms-address";  
address.textContent = conv.address;  

const preview = document.createElement("div");  
preview.className = "sms-preview";  
preview.textContent = conv.latest.body;  

const time = document.createElement("div");  
time.className = "sms-time";  
time.textContent = formatDate(conv.latest.date);  

details.appendChild(address);  
details.appendChild(preview);  

item.appendChild(avatar);  
item.appendChild(details);  
item.appendChild(time);  

item.addEventListener("click", () => openThread(conv));  

return item;

}

/* =========================================
OPEN THREAD VIEW
========================================= */

function openThread(conv) {
const thread = document.createElement("div");
thread.className = "sms-thread";

thread.innerHTML = `  
    <div class="thread-header">  
        <button onclick="this.closest('.sms-thread').remove()">←</button>  
        ${conv.address}  
    </div>  
    <div class="thread-messages" id="threadMessages"></div>  
`;  

document.querySelector(".sms-app").appendChild(thread);  

const container = thread.querySelector("#threadMessages");  

conv.messages.forEach(msg => {  
    const bubble = document.createElement("div");  
    bubble.className = "message-bubble incoming";  
    bubble.textContent = msg.body;  
    container.appendChild(bubble);  
});

}

/* =========================================
SEARCH FILTER
========================================= */

function filterSMS(query) {
const items = document.querySelectorAll(".sms-item");

items.forEach(item => {  
    const text = item.textContent.toLowerCase();  
    item.style.display = text.includes(query) ? "" : "none";  
});

}

/* =========================================
DATE FORMAT
========================================= */

function formatDate(timestamp) {
const date = new Date(timestamp);
return date.toLocaleDateString();
                      }
