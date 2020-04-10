import Database from '../database';
import HTTPError from '../errors';

const Post = Database.getInstance().getModel();

interface IPostDTO {
    userId: string;
    description : string;
    body : string;
    comments ?: string[];
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

interface IPostAddCommentOptions {
    _id : string;
    commentId : string;
}

interface IPostAddMediaOptions {
    id : string;
    type: 'post' | 'comment';
    file : string;
}

export default {
    async create(body : IPostCreateOptions) : Promise<IPostDTO | null> {
        const post = new Post(body);

        return post.save()
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
    async list(body : IPostListOptions) : Promise<IPostDTO[]> {
        let posts = await Post.find(body.query).exec();

        return (posts as IPostDTO[]);
    },

    async modify(modifiedPost : IPostModifyOptions) : Promise<IPostDTO> {
        const queryPost = await Post.findOneAndUpdate({ _id: modifiedPost._id }, modifiedPost.content, {new : true}).exec();

            
        if(!queryPost) {
            throw new HTTPError(
                'not_found',
                `post with id=${modifiedPost._id} does not exist or it is deleted`,
                404
            );
        }
            
        const { _id, _v, userId, comments, description, body, media, createdAt, updatedAt } = queryPost;


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
        }
    },


    async addComment(modifiedPost : IPostAddCommentOptions) : Promise<IPostDTO | void> {
        const queryPost = await Post.findOne({ _id: modifiedPost._id }).exec();

        if(!queryPost || !queryPost.comments) return;

        queryPost.comments.push(modifiedPost.commentId);

        const result = await queryPost.save();
        console.log(result)

        if(!result) {
            throw new HTTPError(
                'not_found',
                `post with id=${modifiedPost._id} does not exist or it is deleted`,
                404
            );
        }
            
        const { _id, _v, userId, comments, description, body, media, createdAt, updatedAt } = result;


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
        }
    },

    async addMedia(modifiedPost : IPostAddMediaOptions) : Promise<IPostDTO | void> {
        const queryPost = await Post.findOne({ _id: modifiedPost.id }).exec();
        
        if(!queryPost) {
            throw new HTTPError(
                'not_found',
                `post with id=${modifiedPost.id} does not exist or it is deleted`,
                404
            );
        }

        queryPost.media?.push(modifiedPost.file);
        const result = await queryPost.save();

        if(!result) {
            throw new HTTPError(
                'not_found',
                `post with id=${modifiedPost.id} does not exist or it is deleted`,
                404
            );
        }
            
            
            
        const { _id, _v, userId, comments, description, body, media, createdAt, updatedAt } = queryPost;


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
        }
    },

    async delete(deleteOptions : IPostDeleteOptions) : Promise<IPostDTO | null> {
        const queryPost = await Post.findOneAndDelete({ _id: deleteOptions._id }).exec();

        if(!queryPost) {
            throw new HTTPError(
                'not_found',
                `post with id=${deleteOptions._id} does not exist or it is deleted`,
                404
            );
        }

        const { _id, _v, userId, comments, description, body, media, createdAt, updatedAt } = queryPost;

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
        }
    }
}