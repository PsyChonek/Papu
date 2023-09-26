import fs from 'fs';
// get package.json version only date
// version format '2023/07/17 18:34'

// Get date '0.1.6 - 2023/07/17 18:34'
const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split(':').slice(0, -1).join(':').replace(/-/g, '/');

// Append date to version
const versionWithDate = `${date}`;

// Update .env version
fs.writeFileSync('./.env', `PUBLIC_APP_VERSION=${versionWithDate}`);

// Log version
console.log(`versionWithDate: ${versionWithDate}`);