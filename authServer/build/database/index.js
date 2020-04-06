"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var redis_1 = __importDefault(require("redis"));
exports.default = {
    connect: function (connectionString, databaseName) {
        function retry_strategy(options) {
            if (options.attempt > 30) {
                console.log('Redis server is not responding...');
                process.exit(1);
            }
            if (options.error && options.error.code === "ECONNREFUSED") {
                console.log('Connection refused, trying again...[%s]', options.attempt);
                return 1000;
            }
            return 1000;
        }
        return redis_1.default.createClient({ url: connectionString, retry_strategy: retry_strategy });
    }
};
