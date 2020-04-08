import EmailHandler from '../services/sendEmail';
import formatDate from '../utils/formatDate';

const emailSender = new EmailHandler();

export default {
    welcome(email : string, name : string, link : string, dashboard : string) {
        emailSender.sendWelcomeAlert(
            email,
            {
                name,
                link,
                dashboard
            }
        )
    },
    reset(email : string, name : string, link : string) {
        emailSender.sendResetAlert(
            email,
            {
                name,
                link,
            }
        )
    },
    newMessage(email : string, name : string, postLink : string, from : string, message: string, postDate : Date, profileLink: string) {

        emailSender.sendMessageAlert(
            email,
            {
                name,
                postLink,
                from,
                message,
                postDate: formatDate(postDate),
                profileLink,
            }
        )
    }
}