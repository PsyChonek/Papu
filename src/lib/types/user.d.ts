import type { ObjectId } from 'mongodb';

export interface User {
	_id: ObjectId; // Unique identifier
	username: string; // Unique username
	email: string; // Unique email address
	salt: string; // Random string used to salt the password hash
	hash: string; // Hashed password
	created: Date; // Date the user was created
}
