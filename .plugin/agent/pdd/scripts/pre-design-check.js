const fs = require('fs');

// Check if tech spec exists
const techSpec = 'docs/02-design/tech_spec.md';

if (fs.existsSync(techSpec)) {
    const content = fs.readFileSync(techSpec, 'utf8');
    if (!content.includes('Architecture') && !content.includes('Data Model')) {
        console.warn(`[WARN] Tech spec seems to be missing key sections (Architecture/Data Model).`);
    }
}
