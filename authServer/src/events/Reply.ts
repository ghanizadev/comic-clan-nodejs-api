export default interface Reply {
    payload: any;
    status: number;
    from?: string;
    replyTo?: string;
}