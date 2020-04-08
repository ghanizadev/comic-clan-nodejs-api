export interface Message {
    id?: string;
    event: string;
    from?: string;
    body: any;
    replyTo?: string;
}
interface IResponseType {
    from?: string;
    replyTo?: string;
    status: number;
}
export interface Reply extends IResponseType {
    payload: object;
}
export interface HTTPError extends IResponseType {
    error: string;
    error_description: string;
}
export declare type ResponseType = Reply | HTTPError;
export declare type Event = 'newuser' | 'resetpassword' | 'newmessage';
export default class EventHandler {
    private consumer;
    private channel;
    private eventListeners;
    private retry_strategy;
    constructor(connectionString: string, channel: string);
    listen(channel?: string): Promise<void>;
    on(event: Event, callback: (message: Message) => void): void;
}
export {};
