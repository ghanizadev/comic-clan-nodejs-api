import { IPostDTO } from './IPostDTO';
import { IPostPaginatedDTO } from './IPostPaginatedDTO';
import { IPostCreateOptions } from './IPostCreateOptions';
import { IPostDeleteOptions } from './IPostDeleteOptions';
import { IPostAddCommentOptions } from "./IPostAddCommentOptions";
import { IPostAddMediaOptions } from "./IPostAddMediaOptions";
import { IPostModifyOptions } from "./IPostModifyOptions";
import { IPostListOptions } from "./IPostListOptions";
declare const _default: {
    create(body: IPostCreateOptions, user: any): Promise<void | IPostDTO>;
    list(body: IPostListOptions): Promise<IPostPaginatedDTO[]>;
    single(body: IPostListOptions): Promise<IPostDTO>;
    modify(modifiedPost: IPostModifyOptions): Promise<IPostDTO>;
    addComment(modifiedPost: IPostAddCommentOptions): Promise<void | IPostDTO>;
    addMedia(modifiedPost: IPostAddMediaOptions): Promise<void | IPostDTO>;
    delete(deleteOptions: IPostDeleteOptions): Promise<IPostDTO>;
};
export default _default;
