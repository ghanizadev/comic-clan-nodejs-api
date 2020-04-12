import { logger } from '../utils/logger';

export default class HTTPError extends Error {
    public error : string;
    public error_description : string;
    public status : number;
    private level : string;

    constructor(error ?: string | any, error_description ?: string, status ?: number){
        super(error);

        if(error.error) this.error = error.error;
        else this.error = error.message || error || 'internal_server_error';

        if(error.error_description) this.error_description = error.error_description;
        else this.error_description = error_description || 'something went bad, check logs for further information';

        if(error.status) this.status = error.status;
        else this.status = status || 500;

        if(this.status < 300) this.level = 'info';
        else if(this.status < 500) this.level = 'warn';
        else this.level = 'error'

        logger.log(this.level,`(${status}) ERROR: "${error}", ERROR_DESCRIPTION: "${error_description}"`);
    }
}