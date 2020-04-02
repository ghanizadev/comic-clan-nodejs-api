'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("./app"));
var logger_1 = __importDefault(require("./utils/logger"));
app_1.default.listen((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000, function () {
    var _a;
    logger_1.default.info("Server started at port " + ((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000));
    console.log('Redis server: ', process.env.REDIS_SERVER);
});
