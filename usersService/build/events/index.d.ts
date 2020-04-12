export interface Message {
    id?: string;
    event: string;
    from?: string;
    body: any;
    user ?: any;
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
export default class EventHandler {
    private consumer;
    private publisher;
    private channel;
    private isListening;
    private eventListeners;
    private retry_strategy;
    constructor(connectionString: string, channel: string);
    listen(channel?: string): Promise<void>;
    on(event: 'create' | 'modify' | 'delete' | 'list', callback: (message: Message, reply: (response: ResponseType) => void) => void): void;
    publish(channel: string | undefined, message: Message): Promise<ResponseType>;
}
export {};
