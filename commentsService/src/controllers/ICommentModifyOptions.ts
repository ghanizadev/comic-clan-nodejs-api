export interface ICommentModifyOptions {
    _id: string;
    content: {
        description: string;
        body: string;
        media?: string[];
    };
}
