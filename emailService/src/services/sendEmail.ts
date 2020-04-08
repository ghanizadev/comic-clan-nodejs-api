import { createTransport, Transporter } from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

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
        const {EMAIL_PASS, EMAIL_USER, EMAIL_PORT, EMAIL_SMTP} = process.env;

        let poolConfig = `smtp://${EMAIL_USER}:${EMAIL_PASS}@${EMAIL_SMTP}:${EMAIL_PORT}/?pool=true`;
        console.log(poolConfig)
        return createTransport(poolConfig);
    }
    constructor(contactInfo ?:{ name : string, email : string}) {
        if(contactInfo) {
            this.contact = `"${contactInfo.name}" <${contactInfo.email}>`;
        }
        this.mailer = this.init();
    }

    public async sendMessageAlert(to : string, body : MessageAlertBody){
        let html = await ejs.renderFile(path.resolve(__dirname, '../', 'views', 'newMessage.min.ejs'), body);
        let subject = `${body.name}, you have a new message!`;
        const from = this.contact;

        const email = {from, to, subject, html}

        await this.mailer.sendMail(email).then(()=> console.log('Message sent to %s', to));
    }

    public async sendWelcomeAlert(to : string, body : WelcomeAlertBody){
        let html = await ejs.renderFile(path.resolve(__dirname, '../', 'views', 'welcome.min.ejs'), body);
        let subject = "Welcome to ComicClan!";
        const from = this.contact;

        const email = {from, to, subject, html}

        await this.mailer.sendMail(email).then(()=> console.log('Message sent to %s', to));
    }

    public async sendResetAlert(to : string, body : ResetAlertBody){
        let html = await ejs.renderFile(path.resolve(__dirname, '../', 'views', 'reset.min.ejs'), body);
        let subject = "Reset your password - ComicClan";
        const from = this.contact;

        const email = {from, to, subject, html}

        await this.mailer.sendMail(email).then(()=> console.log('Message sent to %s', to));
    }

}