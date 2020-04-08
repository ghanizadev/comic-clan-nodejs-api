export interface Reply {
    payload: object;
    status: number;
    from?: string;
    replyTo?: string;
}
