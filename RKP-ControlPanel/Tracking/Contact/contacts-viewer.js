/* =========================================
   CONTACT VIEWER JS — FINAL FIXED VERSION
   Correct merge + deduplicate + normalize
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

    /* =====================================
       STEP 1: MERGE USING MAP (BEST METHOD)
    ===================================== */

    const map = new Map();

    currentJSON.forEach(raw => {

        /* Normalize name */
        let name = (raw.name || "Unknown")
            .trim()
            .replace(/\s+/g, " ");

        /* Normalize number */
        let number = (raw.number || "Unknown")
            .trim()
            .replace(/\s+/g, " ");

        /* Create entry if not exists */
        if (!map.has(name)) {

            map.set(name, {

                name: name,
                numbers: new Set()

            });

        }

        /* Add number safely */
        map.get(name).numbers.add(number);

    });

    /* =====================================
       STEP 2: CONVERT MAP TO ARRAY
    ===================================== */

    contactsData =
        Array.from(map.values())
        .map(contact => ({

            name: contact.name,

            numbers:
                Array.from(contact.numbers)

        }))
        .sort((a, b) =>
            a.name.localeCompare(b.name)
        );

    /* =====================================
       STEP 3: BUILD UI
    ===================================== */

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

    const list =
        document.getElementById("contactsList");

    list.innerHTML = "";

    /* FILTER */

    const filtered =
        contactsData.filter(contact => {

            if (!search) return true;

            if (contact.name.toLowerCase().includes(search))
                return true;

            return contact.numbers.some(num =>
                num.toLowerCase().includes(search)
            );

        });

    if (filtered.length === 0) {

        list.innerHTML =
            "<div class='contactsviewer-empty'>No contacts found</div>";

        return;

    }

    /* GROUP */

    const groups = {};

    filtered.forEach(contact => {

        const letter =
            contact.name.charAt(0).toUpperCase();

        if (!groups[letter])
            groups[letter] = [];

        groups[letter].push(contact);

    });

    /* RENDER */

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

    let numbersHTML = "";

    contact.numbers.forEach(number => {

        numbersHTML += `
            <div class="contactsviewer-number">
                ${escapeHTML(number)}
            </div>
        `;

    });

    div.innerHTML = `

        <div class="contactsviewer-name">
            ${escapeHTML(contact.name)}
        </div>

        ${numbersHTML}

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
