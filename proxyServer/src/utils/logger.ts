import winston from 'winston';

const { printf, json, timestamp } = winston.format;

const consoleFormat = printf((data) => {
	return `[${data.timestamp}]: ${data.level.toUpperCase()}: ${data.message}`;
});

const logger = winston.createLogger({
    format: winston.format.combine(timestamp(), json()),
    defaultMeta: { service: 'proxy_server' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'events.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
	logger.add(new winston.transports.Console({
        format: winston.format.combine(timestamp(), consoleFormat)
	}));
}

export default logger;