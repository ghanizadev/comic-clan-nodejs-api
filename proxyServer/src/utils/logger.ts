import winston from 'winston';

const { combine, timestamp, label, printf } = winston.format;

const consoleFormat = printf((data) => {
	return `[${data.timestamp}] ${data.level.toUpperCase()}: ${data.message}`;
});

const logger = winston.createLogger({
    format: winston.format.json(),
    defaultMeta: { service: 'proxy_server' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'events.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
	logger.add(new winston.transports.Console({
        format: consoleFormat
	}));
    }

export default logger;