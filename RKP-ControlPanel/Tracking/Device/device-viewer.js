/* =========================================
   FINAL DEVICE INFO VIEWER JS
   SUPPORTS NEW STRUCTURED JSON
========================================= */

function renderDevice(container) {

    if (!currentJSON || typeof currentJSON !== "object") {

        container.innerHTML =
            "<div class='deviceviewer-empty'>Invalid device info format</div>";

        return;
    }

    const data = currentJSON;

    container.className = "deviceviewer-app";

    container.innerHTML = `
        <div class="deviceviewer-header">
            Device Information Terminal
        </div>

        <div class="deviceviewer-container" id="deviceContainer">
        </div>
    `;

    const root = document.getElementById("deviceContainer");

    /* =========================================
       RENDER ALL SECTIONS
    ========================================= */

    renderSection(root, "Device", [

        ["Model", data.device?.model],
        ["Device Name", data.device?.device_name],
        ["Manufacturer", capitalize(data.device?.manufacturer)],
        ["Brand", capitalize(data.device?.brand)],
        ["Hardware", data.device?.hardware]

    ]);

    renderSection(root, "System", [

        ["Android Version", data.system?.android_version],
        ["API Level", data.system?.api_level],
        ["Build", data.system?.build_display],
        ["Security Patch", data.system?.security_patch]

    ]);

    renderSection(root, "CPU", [

        ["Processor", data.cpu?.processor],
        ["Architecture", data.cpu?.cpu_architecture],
        ["Cores", data.cpu?.cores]

    ]);

    renderSection(root, "Battery", [

        [
            "Level",
            formatBatteryLevel(data.battery?.level_percent),
            getBatteryClass(data.battery?.level_percent)
        ],

        [
            "Status",
            capitalize(data.battery?.status),
            getBatteryStatusClass(data.battery?.status)
        ]

    ]);

    renderSection(root, "Network", [

        ["IPv4", data.network?.ipv4],
        ["IPv6", data.network?.ipv6]

    ]);

    renderSection(root, "Connectivity", [

        [
            "WiFi",
            formatConnection(data.connectivity?.wifi_connected),
            getConnectionClass(data.connectivity?.wifi_connected)
        ],

        [
            "Mobile Data",
            formatConnection(data.connectivity?.mobile_connected),
            getConnectionClass(data.connectivity?.mobile_connected)
        ]

    ]);

    renderSection(root, "Display", [

        ["Resolution", data.display?.resolution],
        ["Density", data.display?.density],
        ["Density DPI", data.display?.density_dpi],
        ["Brightness", data.display?.brightness_level + "%"],
        ["Screen Timeout", formatTimeout(data.display?.screen_timeout_ms)]

    ]);

}

/* =========================================
   SECTION RENDER ENGINE
========================================= */

function renderSection(container, title, rows) {

    const section = document.createElement("div");

    section.className = "deviceviewer-section";

    section.innerHTML = `
        <div class="deviceviewer-section-title">
            ${title}
        </div>
    `;

    rows.forEach(row => {

        if (!row[1]) return;

        const label = row[0];
        const value = row[1];
        const cssClass = row[2] || "";

        const div = document.createElement("div");

        div.className = "deviceviewer-row";

        div.innerHTML = `
            <div class="deviceviewer-label">
                ${label}
            </div>

            <div class="deviceviewer-value ${cssClass}">
                ${value}
            </div>
        `;

        section.appendChild(div);

    });

    container.appendChild(section);
}

/* =========================================
   HELPERS
========================================= */

function capitalize(text) {

    if (!text) return "Unknown";

    return text.charAt(0).toUpperCase() +
        text.slice(1);
}

/* =========================================
   BATTERY HELPERS
========================================= */

function formatBatteryLevel(level) {

    if (level === undefined) return "Unknown";

    return level + "%";
}

function getBatteryClass(level) {

    if (level >= 60) return "status-good";

    if (level >= 30) return "status-warning";

    return "status-bad";
}

function getBatteryStatusClass(status) {

    if (!status) return "";

    if (status === "charging")
        return "status-good";

    if (status === "discharging")
        return "status-warning";

    return "";
}

/* =========================================
   CONNECTION HELPERS
========================================= */

function formatConnection(state) {

    return state ? "Connected" : "Disconnected";
}

function getConnectionClass(state) {

    return state ? "status-good" : "status-bad";
}

/* =========================================
   TIMEOUT FORMAT
========================================= */

function formatTimeout(ms) {

    if (!ms) return "Unknown";

    const minutes = Math.floor(ms / 60000);

    return minutes + " minutes";
}
