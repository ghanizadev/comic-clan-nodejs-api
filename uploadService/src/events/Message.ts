export interface Message {
    id?: string;
    event: string;
    from?: string;
    body: any;
    user ?: any;
    replyTo?: string;
}
