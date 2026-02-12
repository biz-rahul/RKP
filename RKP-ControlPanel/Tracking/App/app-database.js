/* =========================================
   LOCAL APP DATABASE (100 COMMON APPS)
========================================= */

const appDatabase = {

/* ================= GOOGLE ================= */

"com.android.chrome": { name: "Google Chrome", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googlechrome.svg", category: "Browser" },
"com.google.android.youtube": { name: "YouTube", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/youtube.svg", category: "Video" },
"com.google.android.gm": { name: "Gmail", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/gmail.svg", category: "Communication" },
"com.google.android.apps.maps": { name: "Google Maps", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googlemaps.svg", category: "Navigation" },
"com.google.android.apps.photos": { name: "Google Photos", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googlephotos.svg", category: "Gallery" },
"com.google.android.calculator": { name: "Google Calculator", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/google.svg", category: "Utility" },
"com.google.android.contacts": { name: "Google Contacts", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/google.svg", category: "Communication" },
"com.google.android.apps.docs": { name: "Google Docs", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googledocs.svg", category: "Productivity" },
"com.google.android.apps.docs.editors.sheets": { name: "Google Sheets", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googlesheets.svg", category: "Productivity" },
"com.google.android.apps.docs.editors.slides": { name: "Google Slides", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googleslides.svg", category: "Productivity" },
"com.google.android.calendar": { name: "Google Calendar", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googlecalendar.svg", category: "Productivity" },
"com.google.android.keep": { name: "Google Keep", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googlekeep.svg", category: "Productivity" },
"com.google.android.drive": { name: "Google Drive", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googledrive.svg", category: "Cloud" },
"com.google.android.youtube.music": { name: "YouTube Music", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/youtubemusic.svg", category: "Music" },
"com.google.android.videos": { name: "Google TV", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/google.svg", category: "Video" },
"com.google.android.apps.messaging": { name: "Google Messages", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googlemessages.svg", category: "Communication" },
"com.google.android.apps.fitness": { name: "Google Fit", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googlefit.svg", category: "Health" },
"com.google.android.apps.walletnfcrel": { name: "Google Wallet", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googlepay.svg", category: "Finance" },
"com.google.android.apps.nbu.paisa.user": { name: "Google Pay", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googlepay.svg", category: "Finance" },
"com.google.android.apps.tachyon": { name: "Google Meet", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googlemeet.svg", category: "Communication" },

/* ================= META ================= */

"com.whatsapp": { name: "WhatsApp", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/whatsapp.svg", category: "Social" },
"com.whatsapp.w4b": { name: "WhatsApp Business", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/whatsapp.svg", category: "Social" },
"com.instagram.android": { name: "Instagram", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg", category: "Social" },
"com.facebook.katana": { name: "Facebook", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg", category: "Social" },
"com.facebook.orca": { name: "Messenger", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebookmessenger.svg", category: "Social" },
"com.facebook.lite": { name: "Facebook Lite", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg", category: "Social" },

/* ================= SHORT VIDEO ================= */

"com.zhiliaoapp.musically": { name: "TikTok", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tiktok.svg", category: "Social" },
"com.ss.android.ugc.trill": { name: "TikTok Lite", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tiktok.svg", category: "Social" },
"com.kwai.video": { name: "Kwai", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/kwai.svg", category: "Social" },

/* ================= MICROSOFT ================= */

"com.microsoft.office.word": { name: "Microsoft Word", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/microsoftword.svg", category: "Productivity" },
"com.microsoft.office.excel": { name: "Microsoft Excel", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/microsoftexcel.svg", category: "Productivity" },
"com.microsoft.office.powerpoint": { name: "Microsoft PowerPoint", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/microsoftpowerpoint.svg", category: "Productivity" },
"com.microsoft.skydrive": { name: "OneDrive", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/microsoftonedrive.svg", category: "Cloud" },
"com.microsoft.teams": { name: "Microsoft Teams", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/microsoftteams.svg", category: "Communication" },
"com.microsoft.outlook": { name: "Outlook", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/microsoftoutlook.svg", category: "Communication" },

/* ================= OTT ================= */

"com.netflix.mediaclient": { name: "Netflix", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/netflix.svg", category: "Entertainment" },
"com.amazon.avod.thirdpartyclient": { name: "Amazon Prime Video", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/amazonprime.svg", category: "Entertainment" },
"com.disney.disneyplus": { name: "Disney+", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/disneyplus.svg", category: "Entertainment" },
"in.startv.hotstar": { name: "Disney+ Hotstar", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/disneyplus.svg", category: "Entertainment" },

/* ================= MUSIC ================= */

"com.spotify.music": { name: "Spotify", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/spotify.svg", category: "Music" },
"com.apple.android.music": { name: "Apple Music", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/applemusic.svg", category: "Music" },
"com.gaana": { name: "Gaana", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/gaana.svg", category: "Music" },

/* ================= FINANCE INDIA ================= */

"com.phonepe.app": { name: "PhonePe", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/phonepe.svg", category: "Finance" },
"net.one97.paytm": { name: "Paytm", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/paytm.svg", category: "Finance" },
"com.mobikwik_new": { name: "MobiKwik", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/mobikwik.svg", category: "Finance" },

/* ================= SHOPPING ================= */

"com.amazon.mShop.android.shopping": { name: "Amazon", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/amazon.svg", category: "Shopping" },
"com.flipkart.android": { name: "Flipkart", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/flipkart.svg", category: "Shopping" },
"com.myntra.android": { name: "Myntra", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/myntra.svg", category: "Shopping" },

/* ================= TRANSPORT ================= */

"com.ubercab": { name: "Uber", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/uber.svg", category: "Transport" },
"com.olacabs.customer": { name: "Ola", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/ola.svg", category: "Transport" },

/* ================= BROWSERS ================= */

"org.mozilla.firefox": { name: "Firefox", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/firefoxbrowser.svg", category: "Browser" },
"org.torproject.torbrowser": { name: "Tor Browser", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/torproject.svg", category: "Browser" },
"com.opera.browser": { name: "Opera", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/opera.svg", category: "Browser" },

/* ================= AI ================= */

"com.openai.chatgpt": { name: "ChatGPT", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/openai.svg", category: "AI" },
"ai.perplexity.app.android": { name: "Perplexity AI", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/perplexity.svg", category: "AI" },

/* ================= GAMES ================= */

"com.supercell.clashofclans": { name: "Clash of Clans", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/supercell.svg", category: "Games" },
"com.tencent.ig": { name: "PUBG Mobile", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tencent.svg", category: "Games" },
"com.dts.freefireth": { name: "Free Fire", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/garena.svg", category: "Games" },

/* ================= SYSTEM ================= */

"com.android.settings": { name: "Settings", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/android.svg", category: "System" },
"com.android.vending": { name: "Google Play Store", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googleplay.svg", category: "System" },
"com.samsung.android.dialer": { name: "Samsung Dialer", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/samsung.svg", category: "System" },
"com.samsung.android.messaging": { name: "Samsung Messages", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/samsung.svg", category: "System" },
"com.samsung.android.app.contacts": { name: "Samsung Contacts", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/samsung.svg", category: "System" }

};

/* ========================================= */

function getAppFromDatabase(packageName) {
    return appDatabase[packageName] || null;
}
