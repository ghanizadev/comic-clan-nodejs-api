import winston from 'winston';
export default class Logger {
    private static instance;
    private logger;
    constructor();
    static getInstance(): Logger;
    private create;
    getLogger(): winston.Logger;
}
export declare const logger: winston.Logger;
