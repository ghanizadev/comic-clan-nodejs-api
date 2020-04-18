'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("./app"));
var logger_1 = require("./utils/logger");
var events_1 = __importDefault(require("./events"));
var redis_1 = __importDefault(require("redis"));
var v4_1 = __importDefault(require("uuid/v4"));
var https_1 = __importDefault(require("https"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var run = function () { return __awaiter(void 0, void 0, void 0, function () {
    var retry_strategy, db;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, events_1.default.getInstance().connect(process.env.REDIS_SERVER || 'redis://localhost:6379', 'proxy_ch')];
            case 1:
                _a.sent();
                retry_strategy = function (options) {
                    if (options.attempt > 30) {
                        logger_1.logger.warn('Redis server is not responding...');
                        process.exit(1);
                    }
                    if (options.error && options.error.code === "ECONNREFUSED") {
                        return 1000;
                    }
                    return 1000;
                };
                db = redis_1.default.createClient({ url: process.env.REDIS_SERVER || 'redis://localhost:6379', retry_strategy: retry_strategy });
                db.once('connect', function () {
                    logger_1.logger.info('Checking from credentials...');
                    db.hgetall('clients', function (error, keys) {
                        if (error)
                            return;
                        var auth = { id: '', secret: '' };
                        if (keys) {
                            auth.id = Object.keys(keys).shift() || '';
                            auth.secret = keys[auth.id] || '';
                            if (auth.id !== '' && auth.secret !== '') {
                                logger_1.logger.warn('Client credentials found in database');
                                logger_1.logger.warn("CLIENT_ID=" + auth.id);
                                logger_1.logger.warn("CLIENT_SECRET=" + auth.secret);
                            }
                            else {
                                logger_1.logger.warn('Generating temporary client credentials...');
                                var clientID = v4_1.default();
                                var clientSecret = v4_1.default();
                                logger_1.logger.warn("CLIENT_ID=" + clientID);
                                logger_1.logger.warn("CLIENT_SECRET=" + clientSecret);
                                db.hset('clients', clientID, clientSecret);
                            }
                        }
                        else {
                            logger_1.logger.warn('Generating temporary client credentials...');
                            var clientID = v4_1.default();
                            var clientSecret = v4_1.default();
                            logger_1.logger.warn("CLIENT_ID=" + clientID);
                            logger_1.logger.warn("CLIENT_SECRET=" + clientSecret);
                            db.hset('clients', clientID, clientSecret);
                        }
                        var options = {
                            key: fs_1.default.readFileSync(path_1.default.resolve(__dirname, 'keys', 'server.pem')),
                            cert: fs_1.default.readFileSync(path_1.default.resolve(__dirname, 'keys', 'server.crt'))
                        };
                        https_1.default.createServer(options, app_1.default).listen(process.env.PORT || 3000, function () {
                            logger_1.logger.info("Server started at port " + (process.env.PORT || 3000));
                        });
                    });
                });
                return [2 /*return*/];
        }
    });
}); };
run().catch(logger_1.logger.warn);
