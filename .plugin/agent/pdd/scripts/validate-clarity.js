const fs = require('fs');

const specPath = 'docs/01-plan/functional_spec.md';

console.log(`[Self-Correction] Checking clarity in ${specPath}...`);

if (!fs.existsSync(specPath)) {
    console.error(`[FAIL] File not found: ${specPath}`);
    process.exit(1);
}

const content = fs.readFileSync(specPath, 'utf8');
const lines = content.split('\n');
let issuesFound = 0;

// Vague words to avoid in specs
const vagueWords = [
    'fast', 'quickly', 'slow', // Performance ambiguity
    'easy', 'simple', 'intuitive', // UX ambiguity
    'appropriate', 'suitable', // Logic ambiguity
    'many', 'few', 'some', // Quantity ambiguity
    'good', 'bad' // Subjective
];

lines.forEach((line, index) => {
    const lowerLine = line.toLowerCase();
    vagueWords.forEach(word => {
        // Simple regex to match whole words
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        if (regex.test(line)) {
            console.warn(`[WARN] Line ${index + 1}: Found vague word "${word}". Be specific.`);
            console.warn(`       > ${line.trim()}`);
            issuesFound++;
        }
    });
});

if (issuesFound > 0) {
    console.log(`\n[SUMMARY] Found ${issuesFound} clarity issues.`);
    console.log(`ACTION: Please replace these vague terms with specific metrics or logic.`);
} else {
    console.log(`[PASS] No obvious vague terms found. Good job!`);
}
