import yaml from 'js-yaml';
import fs from 'fs';
import { execSync } from 'child_process';
import { exit } from 'process';
import { MongoClient } from 'mongodb';

// Settings for local database
const UserName = 'papuadmin';
const UserPass = 'papuadmin';
const PORTS = "27017:27017";
const DBName = 'papu';
const sampleFolder = './sample';
const containerName = 'papu-mongo';

// Check if docker is running
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
    console.log('Error while stopping container! Its okay if its first time running this script!');
}

// Edit docker-compose.yml file to change ports and login credentials
const file = yaml.load(fs.readFileSync('./docker-compose.yml', 'utf8'));

file.services.mongo.ports = [PORTS];
file.services.mongo.environment.MONGO_INITDB_ROOT_USERNAME = UserName;
file.services.mongo.environment.MONGO_INITDB_ROOT_PASSWORD = UserPass;
file.services.mongo.container_name = containerName;

// Write docker-compose.yml
fs.writeFileSync('./docker-compose.yml', yaml.dump(file), 'utf8');

// Start docker-compose
execSync("docker compose up");
 
// Try if container is running
let tries = 3;
let timeout = 1000;

for (let i = 0; i < tries; i++) {
    try {
        execSync(`docker exec ${containerName} mongo --eval "printjson(db.serverStatus())"`);
        break;

    } catch (error) {
        // wait 
        console.log('Container is not running! Tries left: ' + tries);
        setTimeout(() => { }, timeout);

        tries--;
        if (tries <= 0) {
            console.log('Container is not running!');
            exit();
        }
    }
}

console.log('Database started!');

// Seed DB with sample data

// Open database connection

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