const token = process.argv[2];
if (!token) { console.error("No token provided"); process.exit(1); }
const parts = token.split('.');
if (parts.length !== 3) { console.error("Invalid JWT"); process.exit(1); }
const payload = Buffer.from(parts[1], 'base64').toString('utf8');
console.log(JSON.parse(payload));
