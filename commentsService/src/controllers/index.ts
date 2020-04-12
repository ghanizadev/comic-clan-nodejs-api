import Database from '../database';
import HTTPError from '../errors';

const Comment = Database.getInstance().getModel();

export interface ICommentDTO {
    userId: string;
    body : string;
    media ?: string[];
    comments ?: string[];
    updatedAt ?: string;
    createdAt ?: string;
    _id : string;
    _v : number;
}

export interface ICommentCreateOptions {
    userId: string;
    description : string;
    body : string;
    media ?: string[];
}

export interface ICommentDeleteOptions {
    _id : string;
}
export interface ICommentListOptions {
    query : {
        _id ?: string;
    };
    pagination ?: any;
}

export interface ICommentModifyOptions {
    _id : string;
    content : {
        description : string;
        body : string;
        media ?: string[];
    };
}

export interface ICommentAddCommentOptions {
    id: string;
    commentId: string;
}

export default {
    async create(body : ICommentCreateOptions) : Promise<ICommentDTO | void> {
        const user = new Comment(body);

        return user.save()
        .then(async (doc) => {
            const { _id, _v, userId, body, media, comments, createdAt, updatedAt } = doc;

            return {
                _id,
                userId,
                body,
                media,
                comments,
                createdAt,
                updatedAt,
                _v,
            };
        })
        .catch(err => {
            throw new HTTPError('failed_to_save', err.message, 400);
        })
    },
    async list(body : ICommentListOptions) : Promise<ICommentDTO[]> {
        let comments = await Comment.find(body.query).exec();
0
        const results : ICommentDTO[] = comments.map(comment => {
            const { userId, body, media, comments, createdAt, updatedAt, _id, _v} = comment;

            const result : ICommentDTO = {
                userId,
                body,
                media,
                createdAt,
                updatedAt,
                _id,
                _v
            };

            if(comment.acceptComments)
                result.comments = comments;

            return result
        })

        return results;
    },

    async modify(modifiedComment : ICommentModifyOptions) : Promise<ICommentDTO> {
        const queryComment = await Comment.findOneAndUpdate({ _id: modifiedComment._id }, modifiedComment.content, {new : true}).exec();

            
        if(!queryComment) {
            throw new HTTPError(
                'not_found',
                `post with id=${modifiedComment._id} does not exist or it is deleted`,
                404
            );
        }
            
        const { _id, _v, userId, body, media, comments, createdAt, updatedAt } = queryComment;


        return {
            _id,
            userId,
            body,
            media,
            comments,
            createdAt,
            updatedAt,
            _v,
        }
    },

    async addComment(modifiedComment : ICommentAddCommentOptions) : Promise<ICommentDTO | void> {
        const queryPost = await Comment.findOne({ _id: modifiedComment.id }).exec();

        if(!queryPost)
            throw new HTTPError('invalid_request', 'Comment ws not found or it is deleted', 400);

        if(!queryPost.acceptComments)
            throw new HTTPError('invalid_request', 'It is not possible to reply a reply', 400);
        
        queryPost.comments.push(modifiedComment.commentId);

        const result = await queryPost.save();

        if(!result) {
            throw new HTTPError(
                'not_found',
                `Comment does not exist or it is deleted`,
                404
            );
        }
            
        const { _id, _v, userId, comments, body, media, createdAt, updatedAt } = result;


        return {
            _id,
            userId,
            body,
            media,
            comments,
            createdAt,
            updatedAt,
            _v,
        }
    },

    async delete(deleteOptions : ICommentDeleteOptions) : Promise<ICommentDTO | void> {
        const queryComment = await Comment.findOneAndDelete({ _id: deleteOptions._id }).exec();

        if(!queryComment) {
            throw new HTTPError(
                'not_found',
                `post with id=${deleteOptions._id} does not exist or it is deleted`,
                404
            );
        }

        const { _id, _v, userId, body, media, comments, createdAt, updatedAt } = queryComment;

        return {
            _id,
            userId,
            body,
            media,
            comments,
            createdAt,
            updatedAt,
            _v,
        }
    }
}