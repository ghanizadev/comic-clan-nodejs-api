"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var redis_1 = __importDefault(require("redis"));
var EventHandler = /** @class */ (function () {
    function EventHandler(connectionString, channel) {
        this.eventListeners = [];
        var retry_strategy = this.retry_strategy;
        this.channel = channel;
        this.consumer = redis_1.default.createClient({ url: connectionString, retry_strategy: retry_strategy });
    }
    EventHandler.prototype.retry_strategy = function (options) {
        if (options.attempt > 30) {
            console.log('Redis server is not responding...');
            process.exit(1);
        }
        if (options.error && options.error.code === "ECONNREFUSED") {
            console.log('Connection refused, trying again...[%s]', options.attempt);
            return 1000;
        }
        return 1000;
    };
    EventHandler.prototype.on = function (event, callback) {
        this.eventListeners.push([event, callback]);
    };
    EventHandler.prototype.listen = function (channel) {
        var _this = this;
        if (channel)
            this.channel = channel;
        this.consumer.subscribe(this.channel);
        this.consumer.on('message', function (_, message) {
            var msg = JSON.parse(message);
            _this.eventListeners.forEach(function (event) {
                if (event[0] === msg.event) {
                    event[1](msg);
                }
            });
        });
    };
    return EventHandler;
}());
exports.default = EventHandler;
