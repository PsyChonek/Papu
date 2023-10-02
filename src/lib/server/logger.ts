import winston, { format } from 'winston';

/**
 * Example from github
 */
export const logger = winston.createLogger({
	format: format.combine(
		format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
	),
	transports: [
		//
		// - Write to all logs with level `info` and below to `combined.log`
		// - Write all logs error (and below) to `error.log`.
		//
		new winston.transports.File({ filename: 'logs/debug.log', level: 'debug' }),
		new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
		new winston.transports.File({ filename: 'logs/combined.log' })
	]
});

logger.add(
	new winston.transports.Console({
		format: format.combine(
			format.colorize(),
			format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
			format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
		),
		level: 'debug'
	})
);

logger.add(
	new winston.transports.Console({
		format: format.combine(
			format.colorize(),
			format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
			format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
		),
		level: 'info'
	})
);

logger.add(
	new winston.transports.Console({
		format: format.combine(
			format.colorize(),
			format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
			format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
		),
		level: 'warn'
	})
);

logger.add(
	new winston.transports.Console({
		format: format.combine(
			format.colorize(),
			format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
			format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
		),
		level: 'error'
	})
);
