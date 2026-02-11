document.addEventListener("DOMContentLoaded", function () {

    /* ================= MATRIX ENGINE ================= */

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


    /* ================= RUN BUTTON SYSTEM ================= */

    const runButtons = document.querySelectorAll(".run-btn");
    const redirectURL = "https://example.com"; // change this

    runButtons.forEach(btn => {
        btn.addEventListener("click", function () {
            const command = this.getAttribute("data-command");

            navigator.clipboard.writeText(command).then(() => {
                window.location.href = redirectURL;
            }).catch(() => {
                window.location.href = redirectURL;
            });
        });
    });


    /* ================= CONTACT BUTTON ================= */

    const contactBtn = document.getElementById("contactOwnerBtn");
    const contactURL = "https://example.com/contact"; // change this

    if (contactBtn) {
        contactBtn.addEventListener("click", function () {
            window.location.href = contactURL;
        });
    }

});
