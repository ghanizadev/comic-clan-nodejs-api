import Database from '../database';
import HTTPError from '../errors';
import { IPostDTO } from './IPostDTO';
import { IPostCreateOptions } from './IPostCreateOptions';
import { IPostDeleteOptions } from './IPostDeleteOptions';
import { IPostAddCommentOptions } from "./IPostAddCommentOptions";
import { IPostAddMediaOptions } from "./IPostAddMediaOptions";
import { IPostModifyOptions } from "./IPostModifyOptions";
import { IPostListOptions } from "./IPostListOptions";

const Post = Database.getInstance().getModel();

export default {
    async create(body : IPostCreateOptions, user : any) : Promise<IPostDTO | void> {
        const save = {...body, userId:  user._id}
        const post = new Post(save);

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
        const queryPost = await Post.findOne({ _id: modifiedPost._id }).exec();

        if(!queryPost) {
            throw new HTTPError(
                'not_found',
                `post with id=${modifiedPost._id} does not exist or it is deleted`,
                404
            );
        }

        if(queryPost.userId !== modifiedPost.user.id){
            throw new HTTPError(
                'invalid_request',
                `user is not permited to modify or delete this request`,
                403
            );
        }

        queryPost.set(modifiedPost.content);

        const doc = await queryPost.save();

        const { _id, _v, userId, comments, description, body, media, createdAt, updatedAt } = doc;

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
        const queryPost = await Post.findOne({ _id: modifiedPost.id }).exec();

        if(!queryPost)
            throw new HTTPError('invalid_request', 'It is not possible to reply a reply', 400);

        queryPost.comments.push(modifiedPost.commentId);

        const result = await queryPost.save();

        if(!result) {
            throw new HTTPError(
                'not_found',
                `Post does not exist or it is deleted`,
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

    async delete(deleteOptions : IPostDeleteOptions) : Promise<IPostDTO> {
        const find = await Post.findById(deleteOptions.id).exec();

        if(!find) {
            throw new HTTPError(
                'not_found',
                `post with id=${deleteOptions.id} does not exist or it is deleted`,
                404
            );
        }

        if(find.userId !== deleteOptions.user.id){
            throw new HTTPError(
                'invalid_request',
                `user is not permited to modify or delete this request`,
                403
            );
        }

        await Post.findByIdAndDelete(deleteOptions.id).exec();

        const { _id, _v, userId, comments, description, body, media, createdAt, updatedAt } = find;

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