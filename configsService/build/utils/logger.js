"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var winston_1 = __importDefault(require("winston"));
var os_1 = __importDefault(require("os"));
var host = os_1.default.hostname();
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.getInstance = function () {
        if (!Logger.instance)
            Logger.instance = new this();
        return Logger.instance;
    };
    Logger.prototype.create = function () {
        var _a = winston_1.default.format, printf = _a.printf, json = _a.json, timestamp = _a.timestamp, splat = _a.splat;
        var ip = function () {
            // const interfaces = os.networkInterfaces();
            // const keys = Object.keys(interfaces);
            // if(keys[1] && interfaces[keys[1]] && interfaces[keys[1]][0])
            // return interfaces[keys[1]][0].address;
            return "";
        };
        var consoleFormat = printf(function (data) {
            return "[" + data.timestamp + "]: " + data.level.toUpperCase() + ": " + data.message;
        });
        var logger = winston_1.default.createLogger({
            format: winston_1.default.format.combine(timestamp(), json()),
            defaultMeta: { service: 'proxy_server', host: host, address: ip() },
            transports: [
                new winston_1.default.transports.File({ filename: 'error.log', level: 'error' }),
                new winston_1.default.transports.File({ filename: 'events.log' })
            ]
        });
        if (process.env.NODE_ENV !== 'test') {
            logger.add(new winston_1.default.transports.Console({
                format: winston_1.default.format.combine(timestamp(), consoleFormat, splat())
            }));
        }
        return logger;
    };
    Logger.prototype.getLogger = function () {
        if (!this.logger) {
            this.logger = this.create();
        }
        return this.logger;
    };
    return Logger;
}());
exports.default = Logger;
exports.logger = Logger.getInstance().getLogger();
