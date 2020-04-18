import Database from '../database';
import HTTPError from '../errors';
import { IPostDTO } from './IPostDTO';
import { IPostPaginatedDTO } from './IPostPaginatedDTO';
import { IPostCreateOptions } from './IPostCreateOptions';
import { IPostDeleteOptions } from './IPostDeleteOptions';
import { IPostAddCommentOptions } from "./IPostAddCommentOptions";
import { IPostAddMediaOptions } from "./IPostAddMediaOptions";
import { IPostModifyOptions } from "./IPostModifyOptions";
import { IPostListOptions } from "./IPostListOptions";
import Post from '../models/postsSchema';
import EventHandler from '../events';
import { IPost } from '../models/IPost';
import { logger } from '../utils/logger';

const eventHandler = EventHandler.getInstance();

export default {
    async create(body : IPostCreateOptions, user : any) : Promise<IPostDTO | void> {
        const save = {...body, userId:  user._id}
        const post = new Post(save);

        const result = await post.save()
        .then(async (doc) => {
            const { _id, _v, user, description, comments, body, media, createdAt, updatedAt } = doc;

            return {
                _id,
                user,
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

        return result;
    },
    async list(body : IPostListOptions) : Promise<IPostPaginatedDTO[]> {
        let posts = await Post.paginate(body.query, body.pagination || {});

        const promises : Promise<IPostPaginatedDTO>[] = [];
    
        if(Array.isArray(posts.docs))
            posts.docs.forEach((doc : IPost) => {
                const promise : Promise<IPostPaginatedDTO> =
                    new Promise(async (resolve, reject) => {
                        const id = doc.userId;
                        let post : any;
    
                        await eventHandler.publish('users_ch', {
                            event: 'list',
                            body: { query: {_id: id} }
                        }).then((res : any ) => {
                            const user : any = res.payload.shift();
    
                            delete user.password;
                            delete user.active;
    
                            post = doc.toObject();
    
                            delete post.userId;
    
                            post = {
                                ...post,
                                user
                            };                        
                        })
                        .catch(reject);

                        await eventHandler.publish('comments_ch', {
                            event: 'list',
                            body: {query: {_id : {$in : post.comments}}}
                        }).then(comments => {

                            post.comments = comments.payload;
                            resolve(post);

                        })
                        .catch(reject);
                    })
    
                promises.push(promise);
            });
    
        const result : IPostPaginatedDTO[] = await Promise.all(promises);
    
        posts.docs = result;

        return posts;

    },

    async single(body : IPostListOptions) : Promise<IPostDTO> {
        try{

            let post = await Post.findById(body.query._id);
            let user : any;
            let comments : any;
    
            if(!post)
                throw new HTTPError('not_found', 'This post was not found. It might been deleted', 404);
    
            const id = post.userId;
    
            await eventHandler.publish('users_ch', {
                event: 'list',
                body: { query: {_id: id} }
            })
            .then((res : any ) => {
                const userFetched : any = res.payload.shift();
    
                delete userFetched.password;
                delete userFetched.active;
    
                user = userFetched;
            })
            .catch(e => {
                throw new HTTPError(e)
            });
    
            await eventHandler.publish('comments_ch', {
                event: 'list',
                body: {query: {_id : {$in : post.comments}}}
            })
            .then(commentsFetched => {
                comments = commentsFetched.payload;
            })
            .catch(e => {
                throw new HTTPError(e)
            });
            
            const result = post.toObject();
            delete result?.userId;
    
            return {
                ...result,
                user,
                comments
            };
        }catch(e) {
            if(e.name === "CastError")
                throw new HTTPError('not_found', 'This post was not found. It might been deleted', 404);

            throw new HTTPError(e);
        }

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

        const { _id, _v, user, comments, description, body, media, createdAt, updatedAt } = doc;

        return {
            _id,
            user,
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
            
        const { _id, _v, user, comments, description, body, media, createdAt, updatedAt } = result;


        return {
            _id,
            user,
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
            
        const { _id, _v, user, comments, description, body, media, createdAt, updatedAt } = queryPost;


        return {
            _id,
            user,
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

        const { _id, _v, user, comments, description, body, media, createdAt, updatedAt } = find;

        return {
            _id,
            user,
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