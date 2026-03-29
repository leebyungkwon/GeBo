const fs = require('fs');

// Check if input file exists and is not empty
const inputFile = 'docs/01-plan/initial_requirements.md';

if (fs.existsSync(inputFile)) {
    const content = fs.readFileSync(inputFile, 'utf8');
    if (content.length < 50) {
        console.warn(`[WARN] Requirements file is too short (${content.length} chars). Planning might fail.`);
    } else {
        console.log(`[INFO] Requirements file loaded (${content.length} chars). Ready for check.`);
    }
} else {
    console.log(`[SKIP] Requirements file not found. Proceeding without check.`);
}
