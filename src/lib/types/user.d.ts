import type { ObjectId } from "mongodb";

export interface User { 
    id?: ObjectId; // Unique identifier
    username: string;
    email: string;
    salt: string; // Random string used to salt the password hash
    hash: string; // Hashed password
}