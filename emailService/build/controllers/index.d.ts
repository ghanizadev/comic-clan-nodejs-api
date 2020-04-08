declare const _default: {
    welcome(email: string, name: string, link: string, dashboard: string): Promise<void>;
    reset(email: string, name: string, link: string): Promise<void>;
    newMessage(email: string, name: string, postLink: string, from: string, message: string, postDate: Date, profileLink: string): Promise<void>;
};
export default _default;
