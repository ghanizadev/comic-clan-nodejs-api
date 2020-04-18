export interface IPostModifyOptions {
    _id: string;
    user?: any;
    content: {
        description: string;
        body: string;
        media?: string[];
    };
}
