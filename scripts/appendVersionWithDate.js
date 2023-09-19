import fs from 'fs';
// get package.json version and append version with date
// version format '0.1.6 - 2023/07/17 18:34'

// Open file
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

// Get version from package.json
const version = packageJson.version;

// Get date '0.1.6 - 2023/07/17 18:34'
const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split(':').slice(0, -1).join(':').replace(/-/g, '/');

// Remove date from version
const versionWithoutDate = version.split(' - ')[0];

// Append date to version
// const versionWithDate = `${versionWithoutDate} - ${date}`;
const versionWithDate = `${date}`;

// Update .env version
fs.writeFileSync('./.env', `PUBLIC_APP_VERSION=${versionWithDate}`);

// Log version
console.log(`versionWithDate: ${versionWithDate}`);