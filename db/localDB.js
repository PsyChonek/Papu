// Settings for local database
const UserName = 'papuadmin';
const UserPass = 'papuadmin';
const PORTS = "27017:27017";
const DBName = 'papu';
const sampleFolder = './sample';
const containerName = 'papu-mongo';

// Edit docker-compose.yml file to change ports and login credentials
const yaml = require('js-yaml');
const fs = require('fs');


// Check if docker is running
const { execSync } = require('node:child_process');
const { exit } = require('node:process');

try {
    execSync('docker info');
} catch (error) {
    console.log('Docker is not running!');
    exit();
}

// Check if docker-compose is running
try {
    execSync('docker-compose --version');
} catch (error) {
    console.log('Docker-compose is not installed!');
    exit();
}

// Check if container is not already running if so stop and remove it
try {
    execSync(`docker stop ${containerName}`);
    execSync(`docker rm ${containerName}`);
} catch (error) {
    console.log('Container is not running!');
}

// Prep docker-compose.yml
const file = yaml.load(fs.readFileSync('./docker-compose.yml', 'utf8'));

file.services.mongo.ports = [PORTS];
file.services.mongo.environment.MONGO_INITDB_ROOT_USERNAME = UserName;
file.services.mongo.environment.MONGO_INITDB_ROOT_PASSWORD = UserPass;
file.services.mongo.container_name = containerName;

// Write docker-compose.yml
fs.writeFileSync('./docker-compose.yml', yaml.dump(file), 'utf8');

// Start docker-compose
const exec = require('node:child_process').exec;
exec("docker compose up");
 
// Try if container is running
let tries = 3;
let timeout = 1000;

let interval = setInterval(() => {
    try {
        execSync(`docker exec ${containerName} mongo --eval "printjson(db.serverStatus())"`);
        clearInterval(interval);

    } catch (error) {
        tries++;
        if (tries <= 0) {
            console.log('Container is not running!');
            clearInterval(interval);
        }
    }
}, timeout);

console.log('Database started!');

// Seed DB with sample data

// Open database connection
const MongoClient = require("mongodb").MongoClient;

// Connection URL
const url = `mongodb://${UserName}:${UserPass}@localhost:${PORTS.split(':')[0]}/?authMechanism=DEFAULT`;

console.log('Connecting to database...');

// Connect to local db
async function dbConnect() {
    db = await MongoClient.connect(url, { useUnifiedTopology: true });
    console.log('Connected to database!');

    // Create database
    const dbo = db.db(DBName);

    // Create collections
    const fs = require('fs');
    fs.readdir(sampleFolder, (err, files) => {
        if (err) throw err;

        files.forEach(file => {
            console.log(file);
            const collectionName = file.split('.')[1];
            col = dbo.collection(collectionName);
            console.log(`Collection ${col.collectionName} created!`);

            data = fs.readFileSync(`${sampleFolder}/${file}`, 'utf8');
            data = data.replace("$oid", "oid");

            json = JSON.parse(data);

            col.updateMany(json);
        });

        console.log('Sample data inserted!');
    });
};

dbConnect();