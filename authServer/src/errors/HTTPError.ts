export default interface HTTPError {
    error: string;
    error_description: string;
    status: number;
    from?: string;
    replyTo?: string;
}
