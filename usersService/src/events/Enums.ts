export enum Protocol {
    AMQP = 'amqp',
}

export enum EventType {
    'connect',
    'disconnect',
    'subscribe',
    'message',
    'reply'
}