import { env } from '$env/dynamic/private';
import pkg from 'jsonwebtoken';
import { logger } from './logger';
/**
 * Auth utils for SvelteKit
 * Using JWT and httpOnly cookies
 */

// Create a JWT token
export function createToken(payload: Token): string {
	if (!env.JWT_SECRET) {
		logger.error('JWT_SECRET is not defined');
		throw new Error('JWT_SECRET is not defined');
	}

	if (!env.JWT_EXPIRE_MINUTES) {
		logger.error('JWT_EXPIRE_MINUTES is not defined');
		throw new Error('JWT_EXPIRE_MINUTES is not defined');
	}

	if (!env.JWT_ISSUER) {
		logger.error('JWT_ISSUER is not defined');
		throw new Error('JWT_ISSUER is not defined');
	}

	return pkg.sign(payload, env.JWT_SECRET, {
		expiresIn: Number.parseInt(env.JWT_EXPIRE_MINUTES) * 60,
		issuer: env.JWT_ISSUER
	});
}

// Verify a JWT token
export function verifyToken(token: string): any {
	try {
		if (!env.JWT_SECRET) {
			logger.error('JWT_SECRET is not defined');
			throw new Error('JWT_SECRET is not defined');
		}

		return pkg.verify(token, env.JWT_SECRET);
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
