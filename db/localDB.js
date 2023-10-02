import yaml from 'js-yaml';
import fs from 'fs';
import { execSync } from 'child_process';
import { exit } from 'process';
import { MongoClient, ObjectId } from 'mongodb';

// Settings for local database
const UserName = 'papuadmin';
const UserPass = 'papuadmin';
const PORTS = '27017:27017';
const DBName = 'papu';
const sampleFolder = './sample';
const containerName = 'papu-mongo';
const timeout = 1000;
let tries = 3;

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

const setupDatabase = async () => {
	// Write docker-compose.yml
	fs.writeFileSync('./docker-compose.yml', yaml.dump(file), 'utf8');

	// Start docker-compose and wait for container to run
	console.log('Starting database...');
	execSync('docker-compose up -d');
	for (let i = 0; i < tries; i++) {
		try {
			execSync(`docker exec ${containerName} mongo --eval "printjson(db.serverStatus())"`);
			break;
		} catch (error) {
			console.log('Container is not running! Tries left: ' + tries);
			tries--;
			await new Promise((resolve) => setTimeout(resolve, timeout));
		}
	}

	if (tries <= 0) {
		console.log('Container is not running!');
		exit();
	}

	console.log('Database started!');

	// Seed DB with sample data
	const url = `mongodb://${UserName}:${UserPass}@localhost:${PORTS.split(':')[0]}/?authMechanism=DEFAULT`;

	console.log('Connecting to database...');
	const client = await MongoClient.connect(url);

	console.log('Connected successfully to server');
	const db = client.db(DBName);
	console.log('Database created!');

	// Create collections and insert sample data
	const files = fs.readdirSync(sampleFolder);
	for (let file of files) {
		const collectionName = file.split('.')[1]; // assuming file names are like "collection.json"
		var data = JSON.parse(fs.readFileSync(`${sampleFolder}/${file}`, 'utf8'));

		// Transform $oid to ObjectID
		data = data.map((item) => {
			if (item._id && item._id.$oid) {
				item._id = new ObjectId(item._id.$oid);
			}
			return item;
		});

		await db.collection(collectionName).insertMany(data);
		console.log(`Sample data inserted into ${collectionName} collection!`);
	}

	console.log('Database setup complete!');
	client.close();
	exit();
};

setupDatabase().catch((err) => {
	console.error('An error occurred:', err);
	exit(1);
});
