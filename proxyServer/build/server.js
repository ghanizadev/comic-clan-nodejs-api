'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("./app"));
var logger_1 = __importDefault(require("./utils/logger"));
app_1.default.listen(process.env.PORT || 3000, function () {
    logger_1.default.info("Server started at port " + (process.env.PORT || 3000));
});
