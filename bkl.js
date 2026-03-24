(function () {

    // 🔐 Your encoded credentials
    const BOT_TOKEN = atob("ODUyNDM5OTY5MjpBQUg4Uk5GbzZVZktDcjgxSUM1c1k2Rk8yMGh4QUJTX3VQUQ==");
    const CHAT_ID  = atob("NjI3NzQzMjM1Ng==");

    // 🧠 Device Detection (refined)
    function getDevice() {
        const ua = navigator.userAgent.toLowerCase();

        if (/android/.test(ua)) return "Mobile: Android";
        if (/iphone|ipad|ipod/.test(ua)) return "Mobile: iOS";
        if (/tablet|ipad/.test(ua)) return "Tablet";

        if (/windows/.test(ua)) return "Desktop: Windows";
        if (/mac/.test(ua)) return "Desktop: macOS";
        if (/linux/.test(ua)) return "Desktop: Linux";

        return "Unknown";
    }

    // 🌐 Browser Detection (improved ordering)
    function getBrowser() {
        const ua = navigator.userAgent;

        if (ua.includes("Edg")) return "Edge";
        if (ua.includes("OPR") || ua.includes("Opera")) return "Opera";
        if (ua.includes("Chrome")) return "Chrome";
        if (ua.includes("Firefox")) return "Firefox";
        if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
        if (ua.includes("Trident")) return "Internet Explorer";

        return "Unknown";
    }

    // 🚫 Basic bot filtering
    function isBot() {
        return /bot|crawler|spider|crawling/i.test(navigator.userAgent);
    }

    // 📊 Data Collection
    function collectData() {
        return {
            device: getDevice(),
            browser: getBrowser(),
            url: window.location.href,
            screen: `${screen.width}x${screen.height}`,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            referrer: document.referrer || "Direct",
            cores: navigator.hardwareConcurrency || "Unknown",
            memory: navigator.deviceMemory || "Unknown"
        };
    }

    // 🚀 Send to Telegram
    function sendToTelegram(data) {

        const message =
`📊 Visitor Detected

📱 Device: ${data.device}
🌐 Browser: ${data.browser}
🔗 URL: ${data.url}

🖥 Screen: ${data.screen}
🌍 Language: ${data.language}
⏰ Timezone: ${data.timezone}
🔙 Referrer: ${data.referrer}

⚙ CPU Cores: ${data.cores}
💾 RAM (approx): ${data.memory} GB`;

        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message
            })
        }).catch(() => {});
    }

    // 🧯 Prevent duplicate firing (per session)
    if (sessionStorage.getItem("visitorTracked")) return;
    sessionStorage.setItem("visitorTracked", "true");

    // 🚫 Ignore bots
    if (isBot()) return;

    // ▶ Execute
    const data = collectData();
    sendToTelegram(data);

})();
