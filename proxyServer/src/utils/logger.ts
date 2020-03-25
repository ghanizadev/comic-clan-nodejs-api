import winston from 'winston';

const { combine, timestamp, label, printf } = winston.format;

const consoleFormat = printf((data) => {
	return `[${data.timestamp}] ${data.level.toUpperCase()}: ${data.message}`;
});

const logger = winston.createLogger({
	format: combine(
		label({ label: 'proxy_server' }),
        timestamp(),
    ),
	transports: [
		new winston.transports.File({ filename: 'error.log', level: 'error' }),
		new winston.transports.File({ filename: 'combined.log' }),
	]
});

if (process.env.NODE_ENV !== 'production') {
	logger.add(new winston.transports.Console({
        format: consoleFormat
	}));
    }

export default logger;