"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var routes_1 = __importDefault(require("./routes"));
var body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
var app = express_1.default();
app.use(body_parser_1.default.json());
app.use(routes_1.default);
app.listen((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3001, function () {
    var _a;
    console.log("Listening on port " + ((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3001));
});
