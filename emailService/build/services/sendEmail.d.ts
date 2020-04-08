export declare enum Template {
    welcome = 0,
    reset = 1,
    new_message = 2
}
declare type MessageAlertBody = {
    name: string;
    from: string;
    message: string;
    postDate: string;
    profileLink: string;
    postLink: string;
};
declare type WelcomeAlertBody = {
    name: string;
    link: string;
    dashboard: string;
};
declare type ResetAlertBody = {
    name: string;
    link: string;
};
export default class EmailHandler {
    private mailer;
    private contact;
    private init;
    constructor(contactInfo?: {
        name: string;
        email: string;
    });
    sendMessageAlert(to: string, body: MessageAlertBody): Promise<void>;
    sendWelcomeAlert(to: string, body: WelcomeAlertBody): Promise<void>;
    sendResetAlert(to: string, body: ResetAlertBody): Promise<void>;
}
export {};
