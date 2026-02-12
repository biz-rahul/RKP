/* =========================================
   GOOGLE CONTACTS ANDROID VIEWER JS
   FULLY FIXED + UNIVERSAL JSON SUPPORT
========================================= */

let contactsList = [];

/* =========================================
   MAIN RENDER FUNCTION
========================================= */

function renderContacts(container) {

    if (!currentJSON) {

        container.innerHTML =
            "<div class='contactsviewer-empty'>No contacts data</div>";

        return;
    }

    /* =====================================
       FIX: SUPPORT ARRAY OR OBJECT JSON
    ===================================== */

    let data = currentJSON;

    if (!Array.isArray(data)) {

        if (typeof data === "object") {

            data = Object.values(data);

        } else {

            container.innerHTML =
                "<div class='contactsviewer-empty'>Invalid contacts format</div>";

            return;
        }
    }

    /* =====================================
       NORMALIZE DATA
    ===================================== */

    contactsList = data
        .map(contact => ({
            name: String(contact.name || "Unknown"),
            number: String(contact.number || "")
        }))
        .filter(contact =>
            contact.name !== "" || contact.number !== ""
        )
        .sort((a, b) =>
            a.name.localeCompare(b.name)
        );

    /* =====================================
       BUILD UI
    ===================================== */

    container.className =
        "contactsviewer-app";

    container.innerHTML = `

        <div class="contactsviewer-header">
            Contacts
        </div>

        <div class="contactsviewer-search">
            <input id="contactsSearch"
                   type="text"
                   placeholder="Search contacts">
        </div>

        <div id="contactsList"
             class="contactsviewer-list">
        </div>

    `;

    renderContactsList("");

    /* =====================================
       SEARCH EVENT
    ===================================== */

    const searchInput =
        document.getElementById("contactsSearch");

    searchInput.addEventListener("input", function() {

        const query =
            this.value.toLowerCase().trim();

        renderContactsList(query);

    });

}

/* =========================================
   RENDER CONTACT LIST
========================================= */

function renderContactsList(searchQuery="") {

    const container =
        document.getElementById("contactsList");

    if (!container) return;

    container.innerHTML = "";

    /* FILTER */

    const filtered =
        contactsList.filter(contact => {

            if (!searchQuery) return true;

            return (

                contact.name.toLowerCase().includes(searchQuery)

                ||

                contact.number.toLowerCase().includes(searchQuery)

            );

        });

    /* EMPTY */

    if (filtered.length === 0) {

        container.innerHTML =
            "<div class='contactsviewer-empty'>No contacts found</div>";

        return;
    }

    /* GROUP */

    const groups = {};

    filtered.forEach(contact => {

        let letter =
            contact.name.charAt(0).toUpperCase();

        if (!letter.match(/[A-Z]/))
            letter = "#";

        if (!groups[letter])
            groups[letter] = [];

        groups[letter].push(contact);

    });

    /* RENDER */

    Object.keys(groups)
        .sort()
        .forEach(letter => {

            container.appendChild(
                createLetterHeader(letter)
            );

            groups[letter].forEach(contact => {

                container.appendChild(
                    createContactItem(contact)
                );

            });

        });

}

/* =========================================
   CREATE LETTER HEADER
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
   CREATE CONTACT ITEM
========================================= */

function createContactItem(contact) {

    const div =
        document.createElement("div");

    div.className =
        "contactsviewer-contact";

    const avatarLetter =
        contact.name.charAt(0).toUpperCase();

    div.innerHTML = `

        <div class="contactsviewer-avatar">
            ${escapeHTML(avatarLetter)}
        </div>

        <div class="contactsviewer-info">

            <div class="contactsviewer-name">
                ${escapeHTML(contact.name)}
            </div>

            <div class="contactsviewer-number">
                ${escapeHTML(contact.number)}
            </div>

        </div>

    `;

    return div;
}

/* =========================================
   SAFE HTML
========================================= */

function escapeHTML(text) {

    if (!text) return "";

    return text
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;");
}
