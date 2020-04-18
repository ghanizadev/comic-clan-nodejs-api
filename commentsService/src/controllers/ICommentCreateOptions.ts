export interface ICommentCreateOptions {
    userId: string;
    description: string;
    body: string;
    media?: string[];
}
