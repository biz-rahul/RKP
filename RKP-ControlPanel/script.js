
/* =========================================
   CONFIGURATION
========================================= */

const CONFIG = {
    password: "fuckyou",
    redirectURL: "https://example.com",          // Change this
    contactURL: "https://example.com/contact"    // Change this
};


/* =========================================
   ELEMENT REFERENCES
========================================= */

const loginScreen = document.getElementById("loginScreen");
const mainContent = document.getElementById("mainContent");
const bootOutput = document.getElementById("bootOutput");
const typedPassword = document.getElementById("typedPassword");
const mobileInput = document.getElementById("mobileInput");
const contactBtn = document.getElementById("contactOwnerBtn");

let enteredPassword = "";
let unlocked = false;


/* =========================================
   BOOT SEQUENCE
========================================= */

const bootText = `
Booting Kali Linux 6.1.0-amd64...
Loading kernel modules...
Starting secure terminal services...
Mounting encrypted partitions...
Establishing secure shell...
Bypassing firewall...
Accessing root privileges...

Authentication Required.

Enter root password:
`;

function typeBootText(text, speed = 18) {
    let i = 0;
    const interval = setInterval(() => {
        bootOutput.innerHTML += text.charAt(i);
        i++;
        if (i >= text.length) clearInterval(interval);
    }, speed);
}

typeBootText(bootText);


/* =========================================
   MOBILE + DESKTOP PASSWORD SYSTEM
========================================= */

/* Focus input when screen tapped (mobile keyboard fix) */
loginScreen.addEventListener("click", () => {
    if (!unlocked) mobileInput.focus();
});

/* Keep focus active */
setInterval(() => {
    if (!unlocked) mobileInput.focus();
}, 800);


/* Sync typed characters */
mobileInput.addEventListener("input", function () {
    enteredPassword = mobileInput.value;
    typedPassword.textContent = "*".repeat(enteredPassword.length);
});


/* Handle Enter key */
mobileInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        validatePassword();
    }
});


function validatePassword() {

    if (enteredPassword === CONFIG.password) {

        bootOutput.innerHTML += "\n\nAccess Granted.\nLaunching Control Panel...\n";

        setTimeout(() => {
            loginScreen.style.display = "none";
            mainContent.classList.remove("hidden");
            unlocked = true;
            mobileInput.blur();
        }, 1500);

    } else {

        bootOutput.innerHTML += "\n\nAccess Denied.\nTry Again.\n\n";
        enteredPassword = "";
        mobileInput.value = "";
        typedPassword.textContent = "";
    }
}


/* =========================================
   MATRIX RAIN ENGINE
========================================= */

const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

let fontSize = 14;
let columns;
let drops;

const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

function initMatrix() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(1);
}

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00ff00";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {

        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }

        drops[i]++;
    }
}

initMatrix();
setInterval(drawMatrix, 50);
window.addEventListener("resize", initMatrix);


/* =========================================
   RUN BUTTON SYSTEM
========================================= */

const runButtons = document.querySelectorAll(".run-btn");

runButtons.forEach(btn => {
    btn.addEventListener("click", function () {

        const command = this.getAttribute("data-command");

        navigator.clipboard.writeText(command).then(() => {
            window.location.href = CONFIG.redirectURL;
        }).catch(() => {
            window.location.href = CONFIG.redirectURL;
        });

    });
});


/* =========================================
   CONTACT OWNER BUTTON
========================================= */

if (contactBtn) {
    contactBtn.addEventListener("click", function () {
        window.location.href = CONFIG.contactURL;
    });
}
