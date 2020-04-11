export declare class HTTPError extends Error {
    error: string;
    error_description: string;
    status: number;
    private level;
    constructor(error?: string | any, error_description?: string, status?: number);
}
