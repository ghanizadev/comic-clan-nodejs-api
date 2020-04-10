"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var redis_1 = __importDefault(require("redis"));
var Database = /** @class */ (function () {
    function Database() {
    }
    Database.getInstance = function () {
        if (!Database.instance)
            Database.instance = new Database();
        return Database.instance;
    };
    Database.prototype.retry_strategy = function (options) {
        if (options.attempt > 30) {
            console.log('Redis server is not responding...');
            process.exit(1);
        }
        if (options.error && options.error.code === "ECONNREFUSED") {
            return 1000;
        }
        return 1000;
    };
    Database.prototype.connect = function (connectionString, databaseName) {
        var _this = this;
        return new Promise(function (res, rej) {
            var retry_strategy = _this.retry_strategy;
            var r = redis_1.default.createClient({ url: connectionString, retry_strategy: retry_strategy });
            _this.db = r;
            r.once('connect', function () {
                res(r);
            });
            r.once('error', function () { return rej(); });
        });
    };
    Database.prototype.get = function () {
        return this.db;
    };
    return Database;
}());
exports.default = Database;
