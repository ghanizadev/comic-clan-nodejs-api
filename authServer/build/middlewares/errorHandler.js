"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("../utils/logger");
exports.default = (function (err, req, res, next) {
    var ip = req.headers['x-forwarded-for'] || req.ip || req.ips || req.connection.remoteAddress;
    if (err.error && err.error_description && err.status) {
        var error = err.error, error_description = err.error_description, status_1 = err.status;
        var level = void 0;
        if (status_1 < 300)
            level = 'info';
        else if (status_1 < 500)
            level = 'warn';
        else
            level = 'error';
        logger_1.logger.log(level, "(" + status_1 + ") ERROR: \"" + error + "\", ERROR_DESCRIPTION: \"" + error_description + ", IP: " + ip + "\"");
        return res
            .status(status_1)
            .send({
            error: error,
            error_description: error_description,
            status: status_1,
        });
    }
    else {
        logger_1.logger.log('error', err.message);
        return res
            .status(500)
            .send({
            error: 'internal_error',
            error_description: err.message,
            status: 500,
        });
    }
});
