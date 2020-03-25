import Publisher from './Publisher';
import Consumer from './Consumer';
import * as amqp from 'amqplib';
import { EventType } from './Enums';

interface Event {

}

class EventHandler {
    //Convert Consumer and Publisher classes to EventeHandler

    private consumer = new Consumer();
    private publisher = new Publisher();
    private connection : amqp.Connection;

    private eventListeners : [EventType, Function][] = [];

    async listen(connectionOptions : string | amqp.Options.Connect){
        const connection = await amqp.connect(connectionOptions);
        await this.publisher.connect(connection);
        await this.consumer.connect(connection);
    }

    on(event : EventType, callback : (event : Event) => void){
        this.eventListeners.push([event, callback]);
    }
}

export default EventHandler;
