const fs = require('fs');

// 1. Pre-Dev Check
// Checks if Architecture and UI Guide exist before coding starts.
function checkPreDev() {
    const archFile = 'docs/02-design/system_architecture.md';
    const uiFile = 'docs/02-design/ui_guide.md';

    if (!fs.existsSync(archFile) || !fs.existsSync(uiFile)) {
        console.warn("[WARN] Developer is starting without Architecture or UI Guide. This is risky.");
    } else {
        console.log("[INFO] Inputs ready. Starting development.");
    }
}

// 2. Pre-Verify Check
// Checks if there IS code to verify.
function checkPreVerify() {
    if (!fs.existsSync('src') && !fs.existsSync('package.json')) {
        console.error("[ERROR] No source code found! Nothing to verify.");
        process.exit(1); // Stop execution
    }
}

// Simple args dispatcher
const mode = process.argv[2];
if (mode === 'dev') checkPreDev();
if (mode === 'verify') checkPreVerify();
