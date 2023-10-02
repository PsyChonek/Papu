import winston, { format } from 'winston';

// Define a format for console output with colorization
const consoleFormat = format.combine(
	format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
	format.colorize(),
	format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

// Define a format for file output without colorization
const fileFormat = format.combine(
	format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
	format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

export const logger = winston.createLogger({
	transports: [
		//
		// - Write to all logs with level `info` and below to `combined.log`
		// - Write all logs error (and below) to `error.log`.
		//
		new winston.transports.File({ filename: 'logs/debug.log', level: 'debug', format: fileFormat }),
		new winston.transports.File({ filename: 'logs/error.log', level: 'error', format: fileFormat }),
		new winston.transports.File({ filename: 'logs/combined.log', format: fileFormat }),
		new winston.transports.Console({ format: consoleFormat }) // Use the console format for console transport
	]
});
