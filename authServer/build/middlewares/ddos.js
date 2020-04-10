"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var redis_1 = __importDefault(require("redis"));
var rate_limiter_flexible_1 = require("rate-limiter-flexible");
var redisClient = redis_1.default.createClient(process.env.REDIS_HOST || 'redis://localhost:6379/');
var rateLimiter = new rate_limiter_flexible_1.RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'middleware',
    points: 10,
    duration: 1,
});
var rateLimiterMiddleware = function (req, res, next) {
    rateLimiter.consume(req.ip)
        .then(function () {
        next();
    })
        .catch(function () {
        res.status(429).send('Too Many Requests');
    });
};
exports.default = rateLimiterMiddleware;
