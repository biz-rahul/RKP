/* ================================
   BOOT TERMINAL SIMULATION
================================ */

const bootCommands = [
    "Initializing Kali Linux 2026.1...",
    "Loading kernel modules...",
    "Establishing secure shell environment...",
    "Bypassing firewall restrictions...",
    "Injecting packet analyzer...",
    "Mounting encrypted partitions...",
    "Activating stealth mode...",
    "Scanning remote nodes...",
    "Access granted.",
    "Launching Advanced Command Interface..."
];

const outputElement = document.getElementById("terminal-output");
const bootScreen = document.getElementById("boot-screen");
const mainContent = document.getElementById("main-content");

let commandIndex = 0;

function typeCommand(text, callback) {
    let i = 0;
    const interval = setInterval(() => {
        outputElement.innerHTML += text.charAt(i);
        i++;
        if (i >= text.length) {
            clearInterval(interval);
            outputElement.innerHTML += "<br>";
            setTimeout(callback, 400);
        }
    }, 30);
}

function runBootSequence() {
    if (commandIndex < bootCommands.length) {
        typeCommand("root@kali:~# " + bootCommands[commandIndex], () => {
            commandIndex++;
            runBootSequence();
        });
    } else {
        setTimeout(() => {
            bootScreen.style.opacity = "0";
            setTimeout(() => {
                bootScreen.style.display = "none";
                mainContent.style.display = "block";
                initializeMatrix();
            }, 800);
        }, 1000);
    }
}

window.onload = runBootSequence;


/* ================================
   MATRIX BACKGROUND EFFECT
================================ */

function initializeMatrix() {

    const canvas = document.getElementById("matrix");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    function draw() {
        ctx.fillStyle = "rgba(0,0,0,0.05)";
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

    setInterval(draw, 50);

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}


/* ================================
   RUN BUTTON FUNCTION
================================ */

function runCommand(cmd) {

    navigator.clipboard.writeText(cmd).then(() => {
        window.location.href = "https://yourlink.com";
    }).catch(() => {
        window.location.href = "https://yourlink.com";
    });

}


/* ================================
   CONTACT OWNER BUTTON
================================ */

document.getElementById("contactOwnerBtn").addEventListener("click", () => {
    window.location.href = "https://yourcontactlink.com";
});
