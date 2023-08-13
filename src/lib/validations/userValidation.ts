import type { RegisterForm } from "../../routes/user/register/+page";

export const validateRegisterForm = (input: RegisterForm) => {
    var errors :string[] = [];

    errors = errors.concat(validateUsername(input.username));
    errors = errors.concat(validatePassword(input.password, input.passwordConfirm));
    errors = errors.concat(validateEmail(input.email));

    return errors;
}

// Valid username
const validateUsername = (username: string) => {
    var errors :string[] = [];

    // Check if username is to short
    if (username.length < 4) {
        errors.push('Username is to short');
    }

    // Check if username is to long
    if (username.length > 20) {
        errors.push('Username is to long');
    }

    return errors;
}

// TODO: Valid password complexity
// Valid password
const validatePassword = (password: string, passwordConfirm: string) => {
    var errors :string[] = [];

    // Check if password and passwordConfirm match
    if (password !== passwordConfirm) {
        errors.push('Passwords do not match');
    }

    // Check if password is to short
    if (password.length < 8) {
        errors.push('Password is to short');
    }

    return errors;
}

// TODO: Valid email
// Valid email
const validateEmail = (email: string) => {
    var errors :string[] = [];

    // Check if email is valid
    if (!email.includes('@')) {
        errors.push('Email is not valid');
    }

    return errors;
}