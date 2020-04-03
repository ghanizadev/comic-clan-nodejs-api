interface IPostReturn {
    userId: string;
    description: string;
    body: string;
    comments?: string[];
    media?: string[];
    updatedAt?: string;
    createdAt?: string;
    _id: string;
    _v: number;
}
interface IPostCreateOptions {
    userId: string;
    description: string;
    body: string;
    media?: string[];
}
interface IPostDeleteOptions {
    _id: string;
}
interface IPostListOptions {
    query: {
        _id?: string;
    };
    pagination?: any;
}
interface IPostModifyOptions {
    _id: string;
    content: {
        description: string;
        body: string;
        media?: string[];
    };
}
interface IPostAddCommentOptions {
    _id: string;
    commentsId: string | string[];
}
interface IPostAddMediaOptions {
    _id: string;
    photosURL: string | string[];
}
declare const _default: {
    create(body: IPostCreateOptions): Promise<IPostReturn | null>;
    list(body: IPostListOptions): Promise<IPostReturn[]>;
    modify(modifiedPost: IPostModifyOptions): Promise<IPostReturn>;
    addComment(modifiedPost: IPostAddCommentOptions): Promise<void | IPostReturn>;
    addMedia(modifiedPost: IPostAddMediaOptions): Promise<void | IPostReturn>;
    delete(deleteOptions: IPostDeleteOptions): Promise<IPostReturn | null>;
};
export default _default;
