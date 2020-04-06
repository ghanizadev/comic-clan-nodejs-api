export interface Message {
    id?: string;
    event: string;
    from?: string;
    body: any;
    replyTo?: string;
}
declare type Event = 'newuser' | 'resetpassword' | 'removeuser';
export default class EventHandler {
    private consumer;
    private channel;
    private eventListeners;
    private retry_strategy;
    constructor(connectionString: string, channel: string);
    on(event: Event, callback: (message: Message) => void): void;
    listen(channel?: string): void;
}
export {};
