"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var redis_1 = __importDefault(require("redis"));
var EventHandler = /** @class */ (function () {
    function EventHandler() {
        this.eventListeners = [];
    }
    EventHandler.prototype.retry_strategy = function (options) {
        if (options.attempt > 30) {
            console.log('Redis server is not responding...');
            process.exit(1);
        }
        if (options.error && options.error.code === "ECONNREFUSED") {
            return 1000;
        }
        return 1000;
    };
    ;
    EventHandler.getInstance = function () {
        if (!EventHandler.instance)
            EventHandler.instance = new EventHandler();
        return EventHandler.instance;
    };
    EventHandler.prototype.connect = function (connectionString, channel) {
        var _this = this;
        var retry_strategy = this.retry_strategy;
        this.channel = channel;
        this.consumer = redis_1.default.createClient({ url: connectionString, retry_strategy: retry_strategy });
        this.consumer.once("connect", function () {
            _this.consumer.subscribe(_this.channel);
            _this.consumer.on('message', function (_, message) {
                var msg = JSON.parse(message);
                _this.eventListeners.forEach(function (event) {
                    if (event[0] === msg.event) {
                        event[1](msg);
                    }
                });
            });
        });
    };
    EventHandler.prototype.on = function (event, callback) {
        this.eventListeners.push([event, callback]);
    };
    return EventHandler;
}());
exports.default = EventHandler;
