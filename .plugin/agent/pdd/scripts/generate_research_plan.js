const args = process.argv.slice(2);
const productName = args[0];

if (!productName) {
    console.error("Usage: node generate_research_plan.js <Product_Name>");
    process.exit(1);
}

console.log(`\n=== 🕵️‍♀️ Deep Dive Research Plan for [${productName}] ===\n`);

const strategies = [
    {
        category: "🗣️ User Sentiment (Pain Points)",
        queries: [
            `site:reddit.com "${productName}" complaints`,
            `site:twitter.com "${productName}" suck`,
            `site:trustpilot.com "${productName}" reviews`,
            `"${productName}" vs alternative reddit`
        ]
    },
    {
        category: "🧪 Tech & Academic (Feasibility)",
        queries: [
            `site:medium.com "${productName}" architecture`,
            `site:dev.to "${productName}" tech stack`,
            `site:github.com "${productName}" open source alternative`
        ]
    },
    {
        category: "💼 Business & Metrics (Viability)",
        queries: [
            `"${productName}" revenue 2024`,
            `"${productName}" business model analysis`,
            `"${productName}" pitch deck pdf`
        ]
    }
];

strategies.forEach(strat => {
    console.log(`[${strat.category}]`);
    strat.queries.forEach(q => console.log(`  - ${q}`));
    console.log("");
});

console.log("---------------------------------------------------");
console.log("ACTION: Execute at least 1 query from each category using 'search_web'.");
