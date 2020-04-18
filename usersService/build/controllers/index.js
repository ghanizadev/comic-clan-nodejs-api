"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var database_1 = __importDefault(require("../database"));
var errors_1 = __importDefault(require("../errors"));
var User = database_1.default.getInstance().getModel();
exports.default = {
    create: function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var findQuery, user;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body.email = body.email.trim();
                        return [4 /*yield*/, User.findOne({ email: body.email }).exec()];
                    case 1:
                        findQuery = _a.sent();
                        if (findQuery) {
                            if (findQuery.active === true) {
                                throw new errors_1.default('invalid_request', "User \"" + findQuery.email + "\" is already taken", 400);
                            }
                            findQuery.set({ active: true, password: body.password });
                            return [2 /*return*/, findQuery.save()
                                    .then(function (doc) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, doc];
                                    });
                                }); })
                                    .catch(function (err) {
                                    if (err.name === 'ValidationError' || err.name === 'ValidatorError') {
                                        var messages_1 = [];
                                        Object.keys(err.errors).forEach(function (key) { return messages_1.push(err.errors[key].message); });
                                        throw new errors_1.default('invalid_request', messages_1.join(' '), 400);
                                    }
                                    else
                                        throw new errors_1.default(err);
                                })];
                        }
                        else {
                            user = new User(body);
                            return [2 /*return*/, user.save()
                                    .then(function (doc) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, doc];
                                    });
                                }); })
                                    .catch(function (err) {
                                    if (err.name === 'ValidationError' || err.name === 'ValidatorError') {
                                        var messages_2 = [];
                                        Object.keys(err.errors).forEach(function (key) { return messages_2.push(err.errors[key].message); });
                                        throw new errors_1.default('invalid_request', messages_2.join(' '), 400);
                                    }
                                    else
                                        throw new errors_1.default(err);
                                })];
                        }
                        return [2 /*return*/];
                }
            });
        });
    },
    list: function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var users;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, User.find(__assign(__assign({}, body.query), { active: true })).exec()];
                    case 1:
                        users = _a.sent();
                        return [2 /*return*/, users];
                }
            });
        });
    },
    modify: function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var queryUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, User.findOneAndUpdate({ email: body.email, active: true }, body.content, { new: true }).exec()];
                    case 1:
                        queryUser = _a.sent();
                        if (!queryUser) {
                            throw new errors_1.default('not_found', "user with email \"" + body.email + "\" is not registered or it is deleted", 404);
                        }
                        return [2 /*return*/, queryUser];
                }
            });
        });
    },
    delete: function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var queryUser, check;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, User.findOne({ email: body.email, active: true }).exec()];
                    case 1:
                        queryUser = _a.sent();
                        if (!queryUser) {
                            throw new errors_1.default('not_found', "user with email \"" + body.email + "\" is not registered or it is deleted", 404);
                        }
                        return [4 /*yield*/, (queryUser === null || queryUser === void 0 ? void 0 : queryUser.compareHash(body.password))];
                    case 2:
                        check = _a.sent();
                        if (!check)
                            throw new errors_1.default('unauthorized_client', "Password does not match", 401);
                        return [4 /*yield*/, User.findOneAndUpdate({ email: body.email, active: true }, { active: false }, { new: true }).exec()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, queryUser];
                }
            });
        });
    }
};
