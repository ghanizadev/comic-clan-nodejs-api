import winston from 'winston';
import os from 'os';
const host = os.hostname();

const { printf, json, timestamp, splat } = winston.format;

const ip = () : string => {
    const interfaces = os.networkInterfaces()
    const keys = Object.keys(interfaces);

    return interfaces[keys[1]][0].address;
}

const consoleFormat = printf((data) => {
	return `[${data.timestamp}]: ${data.level.toUpperCase()}: ${data.message}`;
});

const logger = winston.createLogger({
    format: winston.format.combine(timestamp(), json()),
    defaultMeta: { service: 'proxy_server', host, address: ip() },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'events.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
	logger.add(new winston.transports.Console({
        format: winston.format.combine(timestamp(), consoleFormat, splat())
	}));
}

export default logger;