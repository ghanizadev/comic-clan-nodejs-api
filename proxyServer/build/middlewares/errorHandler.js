"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (err, req, res, next) {
    if (err.error && err.error_description && err.status) {
        var error = err.error, error_description = err.error_description, status_1 = err.status;
        return res
            .status(status_1)
            .send({
            error: error,
            error_description: error_description,
            status: status_1,
        });
    }
    else {
        return res
            .status(500)
            .send({
            error: 'internal_error',
            error_description: err.message,
            status: 500,
        });
    }
});
