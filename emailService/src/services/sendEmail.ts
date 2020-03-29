import { createTransport, Transporter } from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

export enum Template {
    welcome,
    reset,
    new_message
}

type MessageAlertBody = {
    name: string;
    from: string,
    message: string,
    postDate: string,
    profileLink: string,
    postLink : string
}

type WelcomeAlertBody = {
    name: string,
    link: string,
    dashboard : string,
}

type ResetAlertBody = {
    name: string,
    link: string,
}

export default class EmailHandler {

    private mailer : Transporter;
    private contact : string = '"ComicClan Team" <team@comicclan.com>'

    private init() {
        const {EMAIL_PASS, EMAIL_PORT, EMAIL_USER, EMAIL_SMTP} = process.env;

        const params ={
            host: EMAIL_SMTP,
            port: EMAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
              user: EMAIL_USER, // generated ethereal user
              pass: EMAIL_PASS // generated ethereal password
            }
        }

        this.mailer = createTransport(params);
    }
    constructor(contactInfo ?:{ name : string, email : string}) {
        if(contactInfo) {
            this.contact = `"${contactInfo.name}" <${contactInfo.email}>`;
        }
        this.init();
    }

    public async sendMessageAlert(to : string, body : MessageAlertBody){
        let html = await ejs.renderFile(path.resolve(__dirname, '../', 'views', 'newMessage.min.ejs'), body);
        let subject = `${body.name}, you have a new message!`;
        const from = this.contact;

        const email = {from, to, subject, html}

        await this.mailer.sendMail(email);
    }

    public async sendWelcomeAlert(to : string, body : WelcomeAlertBody){
        let html = await ejs.renderFile(path.resolve(__dirname, '../', 'views', 'welcome.min.ejs'), body);
        let subject = "Welcome to ComicClan!";
        const from = this.contact;

        const email = {from, to, subject, html}

        await this.mailer.sendMail(email);
    }

    public async sendResetAlert(to : string, body : ResetAlertBody){
        let html = await ejs.renderFile(path.resolve(__dirname, '../', 'views', 'reset.min.ejs'), body);
        let subject = "Reset your password - ComicClan";
        const from = this.contact;

        const email = {from, to, subject, html}

        await this.mailer.sendMail(email);
    }

}