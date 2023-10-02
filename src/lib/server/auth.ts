import {JWT_SECRET, JWT_EXPIRE_MINUTES, JWT_ISSUER} from '$env/static/private';
import pkg from 'jsonwebtoken';
import { logger } from './logger';
/**
 * Auth utils for SvelteKit
 * Using JWT and httpOnly cookies
 */

// Create a JWT token
export function createToken(payload: Token): string {
	if (!JWT_SECRET) {
		logger.error('JWT_SECRET is not defined');
		throw new Error('JWT_SECRET is not defined');
	}

	if (!JWT_EXPIRE_MINUTES) {
		logger.error('JWT_EXPIRE_MINUTES is not defined');
		throw new Error('JWT_EXPIRE_MINUTES is not defined');
	}

	if (!JWT_ISSUER) {
		logger.error('JWT_ISSUER is not defined');
		throw new Error('JWT_ISSUER is not defined');
	}

	return pkg.sign(payload, JWT_SECRET, {
		expiresIn: Number.parseInt(JWT_EXPIRE_MINUTES) * 60,
		issuer: JWT_ISSUER
	});
}

// Verify a JWT token
export function verifyToken(token: string): any {
	try {
		if (!JWT_SECRET) {
			logger.error('JWT_SECRET is not defined');
			throw new Error('JWT_SECRET is not defined');
		}

		return pkg.verify(token, JWT_SECRET);
	} catch (err) {
		logger.error(err);
		throw new Error('Invalid token');
	}
}

// Get the user from the JWT token
export function getUserIDFromToken(token: string): any {
	try {
		const payload = verifyToken(token);
		return payload.sub;
	} catch (err) {
		logger.error(err);
		throw new Error('Invalid token');
	}
}

// Get claims from the JWT token
export function getClaimsFromToken(token: string): any {
	try {
		const payload = verifyToken(token);
		return payload.claims;
	} catch (err) {
		logger.error(err);
		throw new Error('Invalid token');
	}
}

// Payload for JWT token
export interface Token {
	sub: string;
}
