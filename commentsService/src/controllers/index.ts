import Database from '../database';
import HTTPError from '../error';

var database = new Database('mongodb://localhost:27017', 'comments');
const Comment = database.getModel();

database.connect();

export interface ICommentReturn {
    userId: string;
    body : string;
    media ?: string[];
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

export default {
    async create(body : ICommentCreateOptions) : Promise<ICommentReturn | void> {
        const user = new Comment(body);

        return user.save()
        .then(async (doc) => {
            const { _id, _v, userId, description, comments, body, media, createdAt, updatedAt } = doc;

            return {
                _id,
                userId,
                description,
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
    async list(body : ICommentListOptions) : Promise<ICommentReturn[]> {
        let users = await Comment.find(body.query).exec();

        return (users as ICommentReturn[]);
    },

    async modify(modifiedComment : ICommentModifyOptions) : Promise<ICommentReturn> {
        const queryComment = await Comment.findOneAndUpdate({ _id: modifiedComment._id }, modifiedComment.content, {new : true}).exec();

            
        if(!queryComment) {
            throw new HTTPError(
                'not_found',
                `post with id=${modifiedComment._id} does not exist or it is deleted`,
                404
            );
        }
            
        const { _id, _v, userId, body, media, createdAt, updatedAt } = queryComment;


        return {
            _id,
            userId,
            body,
            media,
            createdAt,
            updatedAt,
            _v,
        }
    },

    async delete(deleteOptions : ICommentDeleteOptions) : Promise<ICommentReturn | void> {
        const queryComment = await Comment.findOneAndDelete({ _id: deleteOptions._id }).exec();

        if(!queryComment) {
            throw new HTTPError(
                'not_found',
                `post with id=${deleteOptions._id} does not exist or it is deleted`,
                404
            );
        }

        const { _id, _v, userId, body, media, createdAt, updatedAt } = queryComment;

        return {
            _id,
            userId,
            body,
            media,
            createdAt,
            updatedAt,
            _v,
        }
    }
}