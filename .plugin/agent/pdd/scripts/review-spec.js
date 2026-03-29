const fs = require('fs');
const path = require('path');

const specPath = 'docs/01-plan/functional_spec.md';

console.log(`[Reviewer] Checking ${specPath}...`);

if (!fs.existsSync(specPath)) {
    console.error(`[FAIL] File not found: ${specPath}`);
    process.exit(1);
}

const content = fs.readFileSync(specPath, 'utf8');
const missingSections = [];

// Critical Sections to Check
const checks = [
    { name: 'User Flow Diagram', keyword: 'mermaid' },
    { name: 'Screen Logic', keyword: 'Screen Logic' },
    { name: 'Data Requirements', keyword: 'Data Requirements' },
    { name: 'Exception Handling', keyword: 'Exception Handling' }
];

checks.forEach(check => {
    if (!content.includes(check.keyword)) {
        missingSections.push(check.name);
    }
});

if (missingSections.length > 0) {
    console.error(`[FAIL] The spec is incomplete.`);
    console.error(`Missing Sections: ${missingSections.join(', ')}`);
    console.error(`ACTION REQUIRED: Reject this spec and ask Service Planner to add these sections.`);
    process.exit(1);
} else {
    console.log(`[PASS] Structure looks good. All required sections are present.`);
    console.log(`Next Step: Review the actual logic content manually.`);
}
