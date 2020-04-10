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
var express_1 = __importDefault(require("express"));
var routes_1 = __importDefault(require("./routes"));
var body_parser_1 = __importDefault(require("body-parser"));
var dotenv_1 = __importDefault(require("dotenv"));
var https_1 = __importDefault(require("https"));
var fs_1 = __importDefault(require("fs"));
var helmet_1 = __importDefault(require("helmet"));
var path_1 = __importDefault(require("path"));
var ddos_1 = __importDefault(require("./middlewares/ddos"));
var events_1 = __importDefault(require("./events"));
var database_1 = __importDefault(require("./database"));
dotenv_1.default.config();
var run = function () { return __awaiter(void 0, void 0, void 0, function () {
    var eventHandler, conn, db, app, options;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                eventHandler = events_1.default.getInstance();
                eventHandler.connect(process.env.REDIS_SERVER || 'redis://localhost:6379/', 'auth_ch');
                conn = database_1.default.getInstance();
                return [4 /*yield*/, conn.connect(process.env.REDIS_SERVER || 'redis://localhost:6379/', 'auth')];
            case 1:
                db = _a.sent();
                eventHandler.on('newuser', function (message) {
                    db.hset(message.body.email, 'password', message.body.password);
                });
                eventHandler.on('removeuser', function (message) {
                    db.del(message.body.email);
                });
                app = express_1.default();
                options = {
                    key: fs_1.default.readFileSync(path_1.default.resolve(__dirname, 'keys', 'key.pem')),
                    cert: fs_1.default.readFileSync(path_1.default.resolve(__dirname, 'keys', 'server.crt'))
                };
                app.use(body_parser_1.default.urlencoded({ extended: true }));
                app.use(body_parser_1.default.json());
                app.use(helmet_1.default());
                app.use(ddos_1.default(db));
                app.use('/oauth', routes_1.default);
                https_1.default.createServer(options, app).listen(process.env.PORT || 3333);
                console.log("started at ", process.env.PORT || 3333);
                return [2 /*return*/];
        }
    });
}); };
run().catch(console.error);
