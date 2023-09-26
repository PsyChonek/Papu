import { JWT_EXPIRE_MINUTES, JWT_ISSUER, JWT_SECRET } from '$env/static/private';
import { verify, sign } from 'jsonwebtoken';
/**
 * Auth utils for SvelteKit
 * Using JWT and httpOnly cookies
 */

// Create a JWT token
export function createToken(payload: Token): string {
	if (!JWT_SECRET) {
		throw new Error('JWT_SECRET is not defined');
	}

	if (!JWT_EXPIRE_MINUTES) {
		throw new Error('JWT_EXPIRE_MINUTES is not defined');
	}

	if (!JWT_ISSUER) {
		throw new Error('JWT_ISSUER is not defined');
	}

	return sign(payload, JWT_SECRET, {
		expiresIn: Number.parseInt(JWT_EXPIRE_MINUTES) * 60,
		issuer: JWT_ISSUER
		});
}

// Verify a JWT token
export function verifyToken(token: string): any {
	if (!JWT_SECRET) {
		throw new Error('JWT_SECRET is not defined');
	}

	return verify(token, JWT_SECRET);
}

// Get the user from the JWT token
export function getUserIDFromToken(token: string): any {
	const payload = verifyToken(token);
	return payload.sub;
}

// Get claims from the JWT token
export function getClaimsFromToken(token: string): any {
	const payload = verifyToken(token);

	return payload.claims;
}

// Payload for JWT token
export interface Token {
	sub: string;
}
