/* =========================================
   CONTACTS VIEWER ENGINE
========================================= */

function renderContacts(container) {
    if (!Array.isArray(currentJSON)) {
        container.innerHTML = "<p>Invalid contacts format.</p>";
        return;
    }

    // Sort alphabetically
    const contacts = [...currentJSON].sort((a, b) => {
        return (a.name || "").localeCompare(b.name || "", undefined, { sensitivity: "base" });
    });

    container.innerHTML = "";
    container.className = "contacts-app";

    container.innerHTML = `
        <div class="contacts-header">Contacts</div>
        <div class="contacts-search">
            <input type="text" id="contactSearch" placeholder="Search by name or number">
        </div>
        <div class="contacts-list" id="contactsList"></div>
    `;

    const listContainer = document.getElementById("contactsList");

    // Group by first letter
    const grouped = {};

    contacts.forEach(contact => {
        const firstLetter = (contact.name || "#")[0].toUpperCase();
        const letter = /^[A-Z]$/.test(firstLetter) ? firstLetter : "#";

        if (!grouped[letter]) grouped[letter] = [];
        grouped[letter].push(contact);
    });

    Object.keys(grouped).sort().forEach(letter => {
        const section = document.createElement("div");
        section.className = "contact-section";

        const letterHeader = document.createElement("div");
        letterHeader.className = "section-letter";
        letterHeader.textContent = letter;

        section.appendChild(letterHeader);

        grouped[letter].forEach(contact => {
            const item = createContactItem(contact);
            section.appendChild(item);
        });

        listContainer.appendChild(section);
    });

    // Search Logic
    document.getElementById("contactSearch").addEventListener("input", function () {
        const query = this.value.toLowerCase();
        filterContacts(query);
    });
}

/* =========================================
   CREATE CONTACT ITEM
========================================= */

function createContactItem(contact) {
    const wrapper = document.createElement("div");

    const item = document.createElement("div");
    item.className = "contact-item";

    const avatar = document.createElement("div");
    avatar.className = "contact-avatar";
    avatar.textContent = (contact.name || "?")[0].toUpperCase();

    const details = document.createElement("div");
    details.className = "contact-details";

    const name = document.createElement("div");
    name.className = "contact-name";
    name.textContent = contact.name || "Unknown";

    const number = document.createElement("div");
    number.className = "contact-number";
    number.textContent = contact.number || "";

    details.appendChild(name);
    details.appendChild(number);

    item.appendChild(avatar);
    item.appendChild(details);

    const expanded = document.createElement("div");
    expanded.className = "contact-expanded";

    expanded.innerHTML = `
        <div><strong>${contact.name}</strong></div>
        <div>${contact.number}</div>
        <div class="contact-actions">
            <button>Call</button>
            <button>Message</button>
        </div>
    `;

    item.addEventListener("click", () => {
        expanded.classList.toggle("active");
    });

    wrapper.appendChild(item);
    wrapper.appendChild(expanded);

    return wrapper;
}

/* =========================================
   SEARCH FILTER
========================================= */

function filterContacts(query) {
    const sections = document.querySelectorAll(".contact-section");

    sections.forEach(section => {
        let visibleCount = 0;
        const items = section.querySelectorAll(".contact-item");

        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(query)) {
                item.parentElement.style.display = "";
                visibleCount++;
            } else {
                item.parentElement.style.display = "none";
            }
        });

        section.style.display = visibleCount > 0 ? "" : "none";
    });
}
