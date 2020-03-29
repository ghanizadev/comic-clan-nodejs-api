import logger from '../utils/logger';
import express from 'express';

export class HTTPError extends Error {
    public error : string = 'internal_server_error';
    // tslint:disable-next-line: variable-name
    public error_description : string = 'something went bad, check logs for further information';
    public status : number = 500;
    private level : string = 'error';

    // tslint:disable-next-line: variable-name
    constructor(error : string, error_description ?: string, status ?: number){
        super(error);
        this.error = error;
        this.error_description = error_description;
        this.status = status;

        if(status < 300) this.level = 'info';
        else if(status < 500) this.level = 'warn';
        else this.level = 'error'

        logger.log(this.level,`(${status}) ERROR: "${error}", ERROR_DESCRIPTION: "${error_description}"`);
    }
}

export default (err : HTTPError, req : express.Request, res : express.Response, next : express.NextFunction) => {
    const { error, error_description, status} = err;

    return res
    .status(status)
    .send({
        error,
        error_description,
        status,
    });
}