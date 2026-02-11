/* =========================================
   CONFIGURATION
========================================= */

const CONFIG = {
    redirectURL: "https://example.com",          // Change this
    contactURL: "https://example.com/contact"    // Change this
};


/* =========================================
   BOOT SCREEN AUTO TRANSITION
========================================= */

const bootScreen = document.getElementById("bootScreen");
const mainContent = document.getElementById("mainContent");
const bootOutput = document.getElementById("bootOutput");

const bootText = `
Booting Kali Linux 6.1.0-amd64...
Loading kernel modules...
Mounting encrypted partitions...
Starting secure services...
Initializing remote command interface...
Establishing encrypted channel...
Firewall bypass successful.
Root privileges granted.

Access Granted.
Launching Control Panel...
`;

function typeBootText(text, speed = 18) {
    let i = 0;

    const interval = setInterval(() => {
        bootOutput.innerHTML += text.charAt(i);
        i++;

        if (i >= text.length) {
            clearInterval(interval);

            setTimeout(() => {
                bootScreen.style.display = "none";
                mainContent.classList.remove("hidden");
            }, 1200);
        }

    }, speed);
}

typeBootText(bootText);


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

const contactBtn = document.getElementById("contactOwnerBtn");

if (contactBtn) {
    contactBtn.addEventListener("click", function () {
        window.location.href = CONFIG.contactURL;
    });
}
