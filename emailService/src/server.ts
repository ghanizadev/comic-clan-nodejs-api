import dotenv from 'dotenv';
import controller from './controllers';
import EventHandler from './events/index'

dotenv.config();

const eventHandler = new EventHandler(process.env.REDIS_SERVER || 'redis://localhost:6379/', 'email_ch');
eventHandler.listen();

const run = async () => {
    try{
        eventHandler.on('newmessage', async (msg) => {
            const {email, name, from, message, date} = msg.body;
            await controller.newMessage(email, name, '#', from, message, date, '#');
        })
        eventHandler.on('newuser', async (msg) => {
            const {email, name} = msg.body;
            await controller.welcome(email, name, '#', '#')
        })

        eventHandler.on('resetpassword', async (msg) => {
            const {email, name, link} = msg.body;
            await controller.reset(email, name, link)
        })
    } catch(e) {
        console.log(e)
    }
}

run().catch(console.log)

