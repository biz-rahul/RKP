/* =========================================
   HACKING CONTACT VIEWER JS (MERGE VERSION)
   Merges contacts with same name
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
       STEP 1: MERGE CONTACTS BY NAME
    ===================================== */

    const merged = {};

    currentJSON.forEach(contact => {

        const name =
            (contact.name || "Unknown").trim();

        const number =
            (contact.number || "Unknown").trim();

        if (!merged[name]) {

            merged[name] = {

                name: name,
                numbers: new Set()

            };

        }

        merged[name].numbers.add(number);

    });

    /* =====================================
       STEP 2: CONVERT TO ARRAY
    ===================================== */

    contactsData =
        Object.values(merged)
        .map(contact => ({

            name: contact.name,

            numbers:
                Array.from(contact.numbers)
                .sort()

        }))
        .sort((a, b) =>
            a.name.localeCompare(b.name)
        );

    /* =====================================
       UI SETUP
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

            if (contact.name.toLowerCase().includes(search))
                return true;

            return contact.numbers.some(number =>
                number.toLowerCase().includes(search)
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
   CONTACT CARD (MULTIPLE NUMBERS)
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
