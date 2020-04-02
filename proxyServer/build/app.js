'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv = __importStar(require("dotenv"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var bodyParser = __importStar(require("body-parser"));
var path = __importStar(require("path"));
var compression_1 = __importDefault(require("compression"));
var cors_1 = __importDefault(require("cors"));
var http = __importStar(require("http"));
var routes_1 = __importDefault(require("./routes"));
require("sucrase/register/ts");
dotenv.config();
var app = express_1.default();
var server = http.createServer(app);
// io(server); Only authenticated users
app.use(cors_1.default());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookie_parser_1.default());
app.use(express_1.default.static(path.join(__dirname, '..', 'public')));
app.use('/v3/api-docs', express_1.default.static(path.join(__dirname, '..', 'public', 'docs')));
app.use(compression_1.default());
app.get('/', function (_, res) {
    res.sendFile(path.join(__dirname, '..', 'public'));
});
app.get('/v3/api-docs', function (_, res) {
    res.sendFile(path.join(__dirname, '..', 'public', 'docs', 'index.html'));
});
app.use(routes_1.default);
exports.default = server;
