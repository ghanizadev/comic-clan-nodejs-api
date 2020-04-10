"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rate_limiter_flexible_1 = require("rate-limiter-flexible");
var middleware = function (db) {
    var rateLimiter = new rate_limiter_flexible_1.RateLimiterRedis({
        storeClient: db,
        keyPrefix: 'middleware',
        points: 10,
        duration: 1,
    });
    return function (req, res, next) {
        rateLimiter.consume(req.ip)
            .then(function () {
            next();
        })
            .catch(function () {
            res.status(429).send('Too Many Requests');
        });
    };
};
exports.default = middleware;
