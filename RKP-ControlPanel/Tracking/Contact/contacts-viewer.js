
/* =========================================
   HACKING CONTACT VIEWER JS
   Supports name + number JSON format
========================================= */

let contactsData = [];

/* =========================================
   MAIN ENTRY
========================================= */

function renderContacts(container) {

    if (!Array.isArray(currentJSON)) {

        container.innerHTML =
            "<div class='contactsviewer-empty'>Invalid contacts format</div>";

        return;
    }

    /* CLEAN + NORMALIZE */

    contactsData =
        currentJSON
        .map(contact => ({
            name: contact.name || "Unknown",
            number: contact.number || "Unknown"
        }))
        .sort((a, b) =>
            a.name.localeCompare(b.name)
        );

    container.className =
        "contactsviewer-app";

    container.innerHTML = `

        <div class="contactsviewer-header">
            CONTACT DATABASE TERMINAL
        </div>

        <div class="contactsviewer-search">
            <input id="contactsSearch"
                   placeholder="Search name or number">
        </div>

        <div id="contactsList"
             class="contactsviewer-list">
        </div>

    `;

    renderContactsList();

    /* SEARCH */

    document
        .getElementById("contactsSearch")
        .addEventListener("input", function() {

            const query =
                this.value.toLowerCase();

            renderContactsList(query);

        });

}

/* =========================================
   RENDER CONTACT LIST
========================================= */

function renderContactsList(search="") {

    const list =
        document.getElementById("contactsList");

    list.innerHTML = "";

    /* FILTER */

    const filtered =
        contactsData.filter(contact => {

            if (!search) return true;

            return (

                contact.name.toLowerCase().includes(search) ||

                contact.number.toLowerCase().includes(search)

            );

        });

    if (filtered.length === 0) {

        list.innerHTML =
            "<div class='contactsviewer-empty'>No contacts found</div>";

        return;

    }

    /* GROUP BY LETTER */

    const groups = {};

    filtered.forEach(contact => {

        const letter =
            contact.name.charAt(0).toUpperCase();

        if (!groups[letter])
            groups[letter] = [];

        groups[letter].push(contact);

    });

    /* RENDER GROUPS */

    Object.keys(groups)
        .sort()
        .forEach(letter => {

            list.appendChild(
                createLetterHeader(letter)
            );

            groups[letter]
                .forEach(contact => {

                    list.appendChild(
                        createContactCard(contact)
                    );

                });

        });

}

/* =========================================
   LETTER HEADER
========================================= */

function createLetterHeader(letter) {

    const div =
        document.createElement("div");

    div.className =
        "contactsviewer-letter";

    div.textContent =
        letter;

    return div;

}

/* =========================================
   CONTACT CARD
========================================= */

function createContactCard(contact) {

    const div =
        document.createElement("div");

    div.className =
        "contactsviewer-contact";

    div.innerHTML = `

        <div class="contactsviewer-name">
            ${escapeHTML(contact.name)}
        </div>

        <div class="contactsviewer-number">
            ${escapeHTML(contact.number)}
        </div>

    `;

    return div;

}

/* =========================================
   SAFE HTML
========================================= */

function escapeHTML(str) {

    if (!str) return "";

    return str
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;");

}
