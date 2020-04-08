export interface ICommentReturn {
    userId: string;
    body: string;
    media?: string[];
    updatedAt?: string;
    createdAt?: string;
    _id: string;
    _v: number;
}
export interface ICommentCreateOptions {
    userId: string;
    description: string;
    body: string;
    media?: string[];
}
export interface ICommentDeleteOptions {
    _id: string;
}
export interface ICommentListOptions {
    query: {
        _id?: string;
    };
    pagination?: any;
}
export interface ICommentModifyOptions {
    _id: string;
    content: {
        description: string;
        body: string;
        media?: string[];
    };
}
declare const _default: {
    create(body: ICommentCreateOptions): Promise<void | ICommentReturn>;
    list(body: ICommentListOptions): Promise<ICommentReturn[]>;
    modify(modifiedComment: ICommentModifyOptions): Promise<ICommentReturn>;
    delete(deleteOptions: ICommentDeleteOptions): Promise<void | ICommentReturn>;
};
export default _default;
