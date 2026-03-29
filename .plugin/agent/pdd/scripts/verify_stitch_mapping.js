const fs = require('fs');
const path = require('path');

const mappingPath = 'docs/02-design/stitch_component_mapping.md';
const tokensPath = 'docs/02-design/design_tokens.json';

console.log(`[Stitch Tester] Verifying Component Mapping...`);

// Load Files
if (!fs.existsSync(mappingPath) || !fs.existsSync(tokensPath)) {
    console.error(`[FAIL] Missing required files.`);
    process.exit(1);
}

const mapping = fs.readFileSync(mappingPath, 'utf8');
const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

// 1. Verify Token Usage
const tokenRegex = /token\('([^']+)'\)/g;
let match;
let tokenErrors = 0;

while ((match = tokenRegex.exec(mapping)) !== null) {
    const tokenPath = match[1];
    const resolved = resolveToken(tokens.theme, tokenPath);

    if (!resolved) {
        console.error(`[FAIL] Invalid Token Reference: ${tokenPath}`);
        tokenErrors++;
    } else {
        console.log(`[OK] Valid Token: ${tokenPath} -> ${resolved}`);
    }
}

// 2. Verify Component Structure
if (!mapping.includes('| Logical Element | Stitch Component |')) {
    console.error(`[FAIL] Mapping Table missing.`);
    process.exit(1);
}

if (tokenErrors === 0) {
    console.log(`\n[SUCCESS] Stitch Component Mapping is valid and strictly typed.`);
} else {
    console.error(`\n[FAIL] Found ${tokenErrors} token errors.`);
    process.exit(1);
}

function resolveToken(obj, path) {
    return path.split('.').reduce((o, i) => o ? o[i] : null, obj);
}
