import { Message } from './Message';
import { Reply } from './Reply';
import { HTTPError } from '../errors/HTTPError';
export default class EventHandler {
    private static instance;
    private consumer;
    private publisher;
    private channel;
    private eventListeners;
    private retry_strategy;
    private constructor();
    static getInstance(): EventHandler;
    connect(connectionString: string, channel: string): Promise<void>;
    on(event: Event, callback: (message: Message, reply: (response: Reply | HTTPError) => void) => void): void;
    publish(channel: string | undefined, message: Message): Promise<Reply>;
}
export declare type Event = 'create' | 'modify' | 'delete' | 'list';
