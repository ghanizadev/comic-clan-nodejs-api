import { logger } from "../utils/logger";

export default class HTTPError extends Error {
    public error : string = 'internal_server_error';
    // tslint:disable-next-line: variable-name
    public error_description : string = 'something went bad, check logs for further information';
    public status : number = 500;
    private level : string = 'error';

    // tslint:disable-next-line: variable-name
    constructor(error : string | any, error_description ?: string, status ?: number){
        super(error);

        this.error = error || error.name || error.message;
        if(error_description) this.error_description = error_description;
        if(status) this.status = status;

        if(this.status < 300) this.level = 'info';
        else if(this.status < 500) this.level = 'warn';
        else this.level = 'error'

        logger.log(this.level,`(${status}) ERROR: "${error}", ERROR_DESCRIPTION: "${error_description}"`);
    }
}