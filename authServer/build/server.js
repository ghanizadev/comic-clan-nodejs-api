"use strict";
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
dotenv_1.default.config();
var app = express_1.default();
var options = {
    key: fs_1.default.readFileSync(path_1.default.resolve(__dirname, 'keys', 'key.pem')),
    cert: fs_1.default.readFileSync(path_1.default.resolve(__dirname, 'keys', 'server.crt'))
};
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(helmet_1.default());
app.use(ddos_1.default);
app.use('/oauth', routes_1.default);
console.log("started at ", process.env.PORT || 3333);
https_1.default.createServer(options, app).listen(process.env.PORT || 3333);
