import winston from 'winston';
import os from 'os';
const host = os.hostname();

export default class Logger {
    private static instance : Logger;
    private logger !: winston.Logger;
    constructor() {}

    public static getInstance() {
        if (!Logger.instance) Logger.instance = new this();

        return Logger.instance;
    }

    private create () : winston.Logger {
        const { printf, json, timestamp, splat } = winston.format;

        const ip = () : string => {
            // const interfaces = os.networkInterfaces();
            // const keys = Object.keys(interfaces);

            // if(keys[1] && interfaces[keys[1]] && interfaces[keys[1]][0])
            
            // return interfaces[keys[1]][0].address;
            return "";
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

        if (process.env.NODE_ENV !== 'test') {
            logger.add(new winston.transports.Console({
                format: winston.format.combine(timestamp(), consoleFormat, splat())
            }));
        }

        return logger;
    }

    public getLogger() {
        if(!this.logger) {
            this.logger = this.create();
        }

        return this.logger;
    }
}

export const logger = Logger.getInstance().getLogger();