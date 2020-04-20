declare enum MediaTypes {
    jpg = 0,
    png = 1,
    mp4 = 2,
    gif = 3
}
declare type Client = {
    id: string;
    secret: string;
    name: string;
    url: string;
};
export default interface Body {
    body: {
        security?: {
            jwt?: {
                expiring_time?: number;
            };
            password?: {
                regex?: string;
                salt?: string;
            };
        };
        system?: {
            clients?: Client[];
            administration?: {
                username?: string;
                passsword?: string;
            };
            whitelist?: string[];
        };
        email?: {
            smtp?: string;
            port?: number;
            username?: string;
            password?: string;
            tls?: boolean;
        };
        fileUploader?: {
            maxSize?: {
                [key in MediaTypes]?: number;
            };
            garbageColector?: {
                interval?: number;
                active?: boolean;
            };
            allowedMedia?: {
                formats?: MediaTypes[];
            };
            maxFilesPerPost?: number;
            maxFilesPerComment?: number;
        };
    };
}
export {};
