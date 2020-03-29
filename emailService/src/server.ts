import dotenv from 'dotenv';
import Email from './services/sendEmail';

dotenv.config();

const run = async () => {
    const email = new Email();

    try{
        await email.sendMessageAlert(
            'jf.melo6@gmail.com',
            {
                name: 'Jean',
                postLink: 'http://www.google.com',
                from: 'Ivona',
                message: "I love you soooooooooooo much!",
                postDate: new Date().toLocaleDateString(),
                profileLink: 'http://facebook.com.br/ghanizadev',
            }
        )

        await email.sendWelcomeAlert(
            'jf.melo6@gmail.com',
            {
                name: 'Jean',
                link: 'http://www.google.com',
                dashboard: 'http://www.facebook.com'
            }
        )

        await email.sendResetAlert(
            'jf.melo6@gmail.com',
            {
                name: 'Jean',
                link: 'http://www.google.com',
            }
        )
    } catch(e) {
        console.log(e)
    }
}

run().catch(console.log)

