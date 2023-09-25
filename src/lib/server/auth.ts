import { JWT_SECRET } from '$env/static/private';
import { verify, sign } from 'jsonwebtoken';
import type { RequestHandler } from '@sveltejs/kit';
/**
 * Auth utils for SvelteKit
 * Using JWT and httpOnly cookies
 */

// Create a JWT token
export function createToken(payload: any): string {
	if (!JWT_SECRET) {
		throw new Error('JWT_SECRET is not defined');
	}

	return sign(payload, JWT_SECRET, {
		expiresIn: '1d'
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
export function getUserFromToken(token: string): any {
	const payload = verifyToken(token);

	return payload.user;
}

// Get claims from the JWT token
export function getClaimsFromToken(token: string): any {
	const payload = verifyToken(token);

	return payload.claims;
}

// Payload for JWT token
export interface TokenPayload {
	userID: any;
	userName: any;
	claims: any;
}
