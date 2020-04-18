"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("../utils/logger");
var retry_strategy = function (options) {
    if (options.attempt > 30) {
        logger_1.logger.warn('Cache deactivated due to connectivity issues');
    }
    if (options.error && options.error.code === "ECONNREFUSED") {
        return 1000;
    }
    return 1000;
};
exports.default = (function (options) {
    var expire = options.expire, name = options.name;
    return function (req, res, next) {
        res.end();
    };
});
