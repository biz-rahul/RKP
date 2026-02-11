/* =========================================
   DEVICE INFO VIEWER ENGINE
========================================= */

function renderDevice(container) {
    if (!currentJSON || typeof currentJSON !== "object") {
        container.innerHTML = "<p>Invalid device info format.</p>";
        return;
    }

    container.className = "device-app fade-in";

    const model = currentJSON.model || "Unknown";
    const brand = capitalize(currentJSON.brand || "Unknown");
    const android = currentJSON.android || "Unknown";
    const sdk = currentJSON.sdk || "Unknown";

    container.innerHTML = `
        <div class="device-header">About Phone</div>

        <div class="device-hero">
            <div class="device-icon">📱</div>
            <div class="device-name">${brand} ${model}</div>
            <div class="device-subtitle">Android ${android}</div>
        </div>

        <div class="divider"></div>

        <div class="device-list">

            <div class="device-section-title">Device Information</div>

            ${createRow("Model", model)}
            ${createRow("Brand", brand)}
            ${createRow("Android Version", android)}
            ${createRow("SDK Level", sdk)}

        </div>
    `;
}

/* =========================================
   CREATE ROW TEMPLATE
========================================= */

function createRow(label, value) {
    return `
        <div class="device-row">
            <div class="device-label">${label}</div>
            <div class="device-value">${value}</div>
        </div>
    `;
}

/* =========================================
   UTILITY
========================================= */

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
