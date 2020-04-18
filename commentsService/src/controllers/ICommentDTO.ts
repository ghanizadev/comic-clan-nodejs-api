export interface ICommentDTO {
    user ?: any;
    body: string;
    media?: string[];
    comments?: string[] | ICommentDTO[];
    updatedAt?: string;
    createdAt?: string;
    acceptComments ?: boolean;
    _id: string;
    _v: number;
}
