async function loadApp() {
    // Load dotenv
    await import("dotenv").then(module => module.config());
    // Load app
    await import("./index.js");
}

loadApp();