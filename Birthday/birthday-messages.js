// ================================
// 🎉 Simplified Birthday Message Logic
// ================================

function updateBirthdayMessage(months, days, hours, minutes, seconds) {
    // Get today's date info
    const today = new Date();
    const month = today.getMonth() + 1; // 1-12
    const day = today.getDate();

    let message = "";

    // Check specific date ranges for messages
    if ((month === 7 && day >= 26) || (month === 8 && day <= 25)) {
        message = "sirf 11 machine bache hai mera birthday aane me";
    }
    else if ((month === 8 && day >= 26) || (month === 9 && day <= 25)) {
        message = "sirf 10 machine bache hai mera birthday aane me";
    }
    else if ((month === 9 && day >= 26) || (month === 10 && day <= 25)) {
        message = "sirf 9 machine bache hai mera birthday aane me";
    }
    else if ((month === 10 && day >= 26) || (month === 11 && day <= 25)) {
        message = "sirf 8 machine bache hai mera birthday aane me";
    }
    else if ((month === 11 && day >= 26) || (month === 12 && day <= 25)) {
        message = "sirf 7 machine bache hai mera birthday aane me";
    }
    else if ((month === 12 && day >= 26) || (month === 1 && day <= 23)) {
        message = "sirf 6 machine bache hai mera birthday aane me";
    }
    else if (month === 1 && day === 24) {
        message = "kal mera half birthday hai";
    }
    else if (month === 1 && day === 25) {
        message = "aaj mera half birthday hai";
    }
    else if ((month === 1 && day >= 26) || (month === 2 && day <= 25)) {
        message = "sirf 5 machine bache hai mera birthday aane me";
    }
    else if ((month === 2 && day >= 26) || (month === 3 && day <= 25)) {
        message = "sirf 4 machine bache hai mera birthday aane me";
    }
    else if ((month === 3 && day >= 26) || (month === 4 && day <= 25)) {
        message = "sirf 3 machine bache hai mera birthday aane me";
    }
    else if ((month === 4 && day >= 26) || (month === 5 && day <= 25)) {
        message = "sirf 2 machine bache hai mera birthday aane me";
    }
    else if ((month === 5 && day >= 26) || (month === 6 && day <= 22)) {
        message = "sirf 1 machine bache hai mera birthday aane me";
    }
    else if (month === 6 && day >= 23 && day <= 30) {
        message = "bas 4 hafte aur....\nfir mera Birthday aa jayega";
    }
    else if (month === 7 && day >= 1 && day <= 6) {
        message = "bas 3 hafte aur....\nfir mera Birthday aa jayega";
    }
    else if (month === 7 && day >= 7 && day <= 13) {
        message = "bas 2 hafte aur....\nfir mera Birthday aa jayega";
    }
    else if (month === 7 && day >= 14 && day <= 20) {
        message = "bas 1 hafte aur....\nfir mera Birthday aa jayega";
    }
    else if (month === 7 && day === 21) {
        message = "bas 4 din aur....\nfir mera Birthday aa jayega";
    }
    else if (month === 7 && day === 22) {
        message = "bas 3 din aur....\nfir mera Birthday aa jayega";
    }
    else if (month === 7 && day === 23) {
        message = "bas 2 din aur....\nfir mera Birthday aa jayega";
    }
    else if (month === 7 && day === 24) {
        message = "Finally, kal mera Birthday hai, taiyar ho jao 🤣";
    }
    else if (month === 7 && day === 25) {
        message = "aaj mera Birthday hai";
    }

    // ================================
    // SHOW THE MESSAGE
    // ================================
    document.getElementById("messageBox").innerHTML = message;
}
