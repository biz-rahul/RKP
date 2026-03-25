let deferredPrompt;
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  installBtn.style.display = "inline-block";
});

installBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  if (!deferredPrompt) return;

  deferredPrompt.prompt();

  const result = await deferredPrompt.userChoice;

  if (result.outcome === "accepted") {
    console.log("Installed");
  } else {
    console.log("Dismissed");
  }

  deferredPrompt = null;
});
