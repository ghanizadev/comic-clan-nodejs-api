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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = __importDefault(require("./events"));
var controllers_1 = __importDefault(require("./controllers"));
var dotenv_1 = __importDefault(require("dotenv"));
var database_1 = __importDefault(require("./database"));
var logger_1 = __importDefault(require("./utils/logger"));
dotenv_1.default.config();
var run = function () { return __awaiter(void 0, void 0, void 0, function () {
    var logger, eventHandler, db;
    return __generator(this, function (_a) {
        logger = logger_1.default.getInstance().getLogger();
        eventHandler = events_1.default.getInstance();
        eventHandler.connect(process.env.REDIS_SERVER || 'redis://localhost:6379/', 'users_ch');
        db = database_1.default.getInstance();
        db.connect(process.env.MONGO_SERVER || 'mongodb://localhost:27017');
        eventHandler.on('list', function (e, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var doc, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, controllers_1.default.list(e.body)];
                    case 1:
                        doc = _a.sent();
                        if (doc)
                            reply({ payload: doc, status: 200 });
                        else
                            reply({ error: 'not_found', error_description: "user was not found in our database", status: 404 });
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        if (e_1.error && e_1.error_description && e_1.status)
                            reply(e_1);
                        else
                            reply({ error: 'failed_to_fetch', error_description: e_1.message, status: 500 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        eventHandler.on('create', function (e, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var doc, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, controllers_1.default.create(e.body)];
                    case 1:
                        doc = _a.sent();
                        if (!doc)
                            reply({ error: 'failed_to_create', error_description: 'service returned an empty response', status: 500 });
                        else
                            reply({ payload: doc, status: 201 });
                        eventHandler.publish('email_ch', {
                            body: doc,
                            event: 'newuser'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        if (e_2.error && e_2.error_description && e_2.status)
                            reply(e_2);
                        else
                            reply({ error: 'failed_to_create', error_description: e_2.message, status: 500 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        eventHandler.on('delete', function (e, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var doc, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, controllers_1.default.delete(e.body)];
                    case 1:
                        doc = _a.sent();
                        if (doc)
                            reply({ payload: doc, status: 201 });
                        else
                            reply({ error: 'not_found', error_description: "user was not found in our database", status: 404 });
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _a.sent();
                        if (e_3.error && e_3.error_description && e_3.status)
                            reply(e_3);
                        else
                            reply({ error: 'failed_to_delete', error_description: e_3.message, status: 500 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        eventHandler.on('modify', function (e, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var doc, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, controllers_1.default.modify(e.body)];
                    case 1:
                        doc = _a.sent();
                        if (doc)
                            reply({ payload: doc, status: 200 });
                        else
                            reply({ error: 'not_found', error_description: "user was not found in our database", status: 404 });
                        return [3 /*break*/, 3];
                    case 2:
                        e_4 = _a.sent();
                        if (e_4.error && e_4.error_description && e_4.status)
                            reply(e_4);
                        else
                            reply({ error: 'failed_to_update', error_description: e_4.message, status: 500 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        logger.warn('Process instantited in environment ', process.env.NODE_ENV);
        return [2 /*return*/];
    });
}); };
run().catch(console.error);
