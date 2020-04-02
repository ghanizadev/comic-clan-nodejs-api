"use strict";
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var redis = __importStar(require("redis"));
var uuid = __importStar(require("uuid"));
var logger_1 = __importDefault(require("../utils/logger"));
;
var EventHandler = /** @class */ (function () {
    function EventHandler(connectionString, channel) {
        this.isListening = false;
        this.eventListeners = [];
        this.channel = channel;
        logger_1.default.info("Connecting to REDIS... [" + connectionString + "]");
        this.consumer = redis.createClient(connectionString);
        this.publisher = redis.createClient(connectionString);
    }
    EventHandler.prototype.listen = function (channel) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (channel)
                    this.channel = channel;
                this.consumer.subscribe(this.channel);
                this.isListening = true;
                console.log('Litening to channel', this.channel);
                this.consumer.on('message', function (ch, msg) {
                    var decoded = JSON.parse(msg);
                    console.log('Message received from "%s"', decoded.from);
                    _this.eventListeners.forEach(function (event) {
                        if (decoded.event === event[0]) {
                            event[2] = decoded;
                            event[1](decoded, function (response) {
                                response.replyTo = decoded.id;
                                response.from = _this.channel;
                                _this.publisher.publish(decoded.from, JSON.stringify(response));
                            });
                        }
                    });
                });
                return [2 /*return*/];
            });
        });
    };
    EventHandler.prototype.on = function (event, callback) {
        this.eventListeners.push([event, callback, { payload: {}, status: 500 }]);
    };
    EventHandler.prototype.publish = function (channel, message) {
        if (channel === void 0) { channel = this.channel; }
        return __awaiter(this, void 0, void 0, function () {
            var _message, id;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.isListening) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.listen()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _message = message;
                        id = uuid.v4();
                        _message.id = id;
                        _message.from = this.channel;
                        console.log('Publishing with ID "%s" to channel "%s"', id, channel);
                        return [2 /*return*/, new Promise(function (res, rej) {
                                try {
                                    var listener_1 = function (_, msg) {
                                        var mess = JSON.parse(msg);
                                        if (mess.replyTo === id) {
                                            _this.consumer.removeListener('message', listener_1);
                                            if (mess.status >= 400)
                                                return rej(mess);
                                            return res(mess);
                                        }
                                    };
                                    _this.consumer.addListener('message', listener_1);
                                    _this.publisher.publish(channel, JSON.stringify(_message));
                                }
                                catch (e) {
                                    console.log(e);
                                    rej(e);
                                }
                            })];
                }
            });
        });
    };
    return EventHandler;
}());
exports.default = EventHandler;
exports.injector = function (eventHandler) {
    return function (req, res, next) {
        Object.defineProperty(req, 'eventHandler', { value: eventHandler });
        next();
    };
};