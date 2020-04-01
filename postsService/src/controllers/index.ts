import Database from '../models';
import HTTPError from '../error';

var database = new Database('mongodb://localhost:27017', 'comicclan');
const Post = database.getModel();

database.connect();

interface IPostReturn {
    userId: string;
    description : string;
    body : string;
    media ?: string[];
    updatedAt ?: string;
    createdAt ?: string;
    _id : string;
    _v : number;
}

interface IPostCreateOptions {
    userId: string;
    description : string;
    body : string;
    media ?: string[];
}

interface IPostDeleteOptions {
    _id : string;
}
interface IPostListOptions {
    query : {
        _id ?: string;
    };
    pagination ?: any;
}

interface IPostModifyOptions {
    _id : string;
    content : {
        description : string;
        body : string;
        media ?: string[];
    };
}

export default {
    async create(body : IPostCreateOptions) : Promise<IPostReturn | null> {
        const user = new Post(body);

        return user.save()
        .then(async (doc) => {
            const { _id, _v, userId, description, body, media, createdAt, updatedAt } = doc;

            return {
                userId,
                body,
                media,
                description,
                _id,
                _v,
                createdAt,
                updatedAt
            };
        })
        .catch(err => {
            throw new HTTPError('failed_to_save', err.message, 400);
        })
    },
    async list(body : IPostListOptions) : Promise<IPostReturn[]> {
        let users = await Post.find(body.query).exec();

        return (users as IPostReturn[]);
    },

    async modify(modifiedPost : IPostModifyOptions) : Promise<IPostReturn> {
        const queryPost = await Post.findOneAndUpdate({ _id: modifiedPost._id }, modifiedPost.content, {new : true}).exec();

            
        if(!queryPost) {
            throw new HTTPError(
                'not_found',
                `post with id=${modifiedPost._id} does not exist or it is deleted`,
                404
            );
        }
            
        const { _id, _v, userId, description, body, media, createdAt, updatedAt } = queryPost;


        return {
            userId,
            body,
            media,
            description,
            _id,
            _v,
            createdAt,
            updatedAt
        };
    },

    async delete(deleteOptions : IPostDeleteOptions) : Promise<IPostReturn | null> {
        const queryPost = await Post.findOneAndDelete({ _id: deleteOptions._id }).exec();

        if(!queryPost) {
            throw new HTTPError(
                'not_found',
                `post with id=${deleteOptions._id} does not exist or it is deleted`,
                404
            );
        }

        const { _id, _v, userId, description, body, media, createdAt, updatedAt } = queryPost;


        return {
            userId,
            body,
            media,
            description,
            _id,
            _v,
            createdAt,
            updatedAt
        };
    }
}