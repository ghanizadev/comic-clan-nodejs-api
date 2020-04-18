"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("../utils/logger");
var HTTPError = /** @class */ (function (_super) {
    __extends(HTTPError, _super);
    // tslint:disable-next-line: variable-name
    function HTTPError(error, error_description, status) {
        var _this = _super.call(this, error) || this;
        _this.error = 'internal_server_error';
        // tslint:disable-next-line: variable-name
        _this.error_description = 'something went bad, check logs for further information';
        _this.status = 500;
        _this.level = 'error';
        _this.error = error;
        if (error_description)
            _this.error_description = error_description;
        if (status)
            _this.status = status;
        if (_this.status < 300)
            _this.level = 'info';
        else if (_this.status < 500)
            _this.level = 'warn';
        else
            _this.level = 'error';
        logger_1.logger.log(_this.level, _this.level, "(" + status + ") ERROR: \"" + error + "\", ERROR_DESCRIPTION: \"" + error_description + "\"");
        return _this;
    }
    return HTTPError;
}(Error));
exports.default = HTTPError;
