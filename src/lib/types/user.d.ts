export interface User { 
    id: guid; // Unique identifier
    username: string;
    email: string;
    salt: string; // Random string used to salt the password hash
    hash: string; // Hashed password
}

export interface UserLogin {
    username: string;
    password: string;
}

export interface UserRegister {
    username: string;
    password: string;
    email: string;
}