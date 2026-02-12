/* =========================================
   GOOGLE CONTACTS ANDROID VIEWER JS
   Material Design Contacts Viewer
========================================= */

let contactsList = [];

/* =========================================
   MAIN ENTRY POINT
========================================= */

function renderContacts(container) {

    if (!Array.isArray(currentJSON)) {

        container.innerHTML =
            "<div class='contactsviewer-empty'>Invalid contacts format</div>";

        return;
    }

    /* NORMALIZE AND SORT */

    contactsList =
        currentJSON
        .map(contact => ({
            name: contact.name || "Unknown",
            number: contact.number || ""
        }))
        .sort((a, b) =>
            a.name.localeCompare(b.name)
        );

    container.className =
        "contactsviewer-app";

    container.innerHTML = `

        <div class="contactsviewer-header">
            Contacts
        </div>

        <div class="contactsviewer-search">
            <input id="contactsSearch"
                   placeholder="Search contacts">
        </div>

        <div id="contactsList"
             class="contactsviewer-list">
        </div>

    `;

    renderContactsList();

    /* SEARCH EVENT */

    document
        .getElementById("contactsSearch")
        .addEventListener("input", function() {

            renderContactsList(
                this.value.toLowerCase()
            );

        });

}

/* =========================================
   RENDER CONTACT LIST
========================================= */

function renderContactsList(search="") {

    const container =
        document.getElementById("contactsList");

    container.innerHTML = "";

    /* FILTER */

    const filtered =
        contactsList.filter(contact => {

            if (!search) return true;

            return (

                contact.name.toLowerCase().includes(search) ||

                contact.number.toLowerCase().includes(search)

            );

        });

    if (filtered.length === 0) {

        container.innerHTML =
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
   CONTACT ITEM
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
            ${avatarLetter}
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
   SAFE HTML FUNCTION
========================================= */

function escapeHTML(text) {

    if (!text) return "";

    return text
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;");

}
