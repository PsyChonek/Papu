import type { LoginForm } from '../../routes/user/login/+page';
import type { RegisterForm } from '../../routes/user/register/+page';
import type { Validation, ValidationError } from '../types/validation';

export const validateRegisterForm = (input: RegisterForm) => {
	var validation: Validation = {
		errors: [],
		isValid: true
	};

	validation.errors.push(...validateUsername(input.username ?? ''));
	validation.errors.push(...validatePassword(input.password ?? '', input.passwordConfirm ?? ''));
	validation.errors.push(...validateEmail(input.email ?? ''));

	if (validation.errors.length > 0) {
		validation.isValid = false;
	}

	return validation;
};

export const validateLoginForm = (input: LoginForm) => {
	var validation: Validation = {
		errors: [],
		isValid: true
	};

	if (input.username.includes('@')) {
		validation.errors.push(...validateEmail(input.username));
	} else {
		validation.errors.push(...validateUsername(input.username));
	}

	validation.errors.push(...validatePassword(input.password, input.password));

	return validation;
};

// Valid username
const validateUsername = (username: string) => {
	var errors: ValidationError[] = [];
	if (username.length === 0) {
		return errors;
	}

	// Check if username is to short
	if (username.length < 4) {
		errors.push({
			text: 'Username is to short',
			type: 'username'
		});
	}

	// Check if username is to long
	if (username.length > 20) {
		errors.push({
			text: 'Username is to long',
			type: 'username'
		});
	}
	return errors;
};

// TODO: Valid password complexity
// Valid password
const validatePassword = (password: string, passwordConfirm: string) => {
	var errors: ValidationError[] = [];
	if (password.length === 0) {
		return errors;
	}

	// Check if password and passwordConfirm match
	if (password !== passwordConfirm) {
		errors.push({
			text: 'Passwords do not match',
			type: 'passwordMatch'
		});
	}

	// Check if password is to short
	if (password.length < 8) {
		errors.push({
			text: 'Password is to short',
			type: 'password'
		});
	}

	return errors;
};

// TODO: Valid email
// Valid email
const validateEmail = (email: string) => {
	var errors: ValidationError[] = [];
	if (email.length === 0) {
		return errors;
	}

	// Check if email is valid
	if (!email.includes('@')) {
		errors.push({
			text: 'Email is not valid',
			type: 'email'
		});
	}

	return errors;
};
