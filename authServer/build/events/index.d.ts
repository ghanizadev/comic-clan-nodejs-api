export interface Message {
    id?: string;
    event: string;
    from?: string;
    body: any;
    user ?: any;
    replyTo?: string;
}
declare type Event = 'newuser' | 'resetpassword' | 'removeuser';
export default class EventHandler {
    private static instance;
    private consumer;
    private channel;
    private eventListeners;
    private retry_strategy;
    private constructor();
    static getInstance(): EventHandler;
    connect(connectionString: string, channel: string): void;
    on(event: Event, callback: (message: Message) => void): void;
}
export {};
